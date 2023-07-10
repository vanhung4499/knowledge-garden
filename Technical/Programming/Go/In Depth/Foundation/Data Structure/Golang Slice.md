---
title: Golang Slice
date created: 2023-06-08
date modified: 2023-07-08
tags: [golang]
dg-publish: true
---

Array được giới thiệu trong phần trước không được sử dụng phổ biến trong ngôn ngữ Go, cấu trúc dữ liệu thường được sử dụng hơn là một slice, tức là một mảng động, độ dài của nó không cố định, chúng ta có thể thêm các phần tử vào một slice và nó sẽ tự động mở rộng khi dung lượng không đủ.

Trong ngôn ngữ Go, cách khai báo của kiểu slice hơi giống với kiểu của mảng, nhưng do độ dài của slice là động nên bạn chỉ cần xác định kiểu phần tử trong slice khi khai báo:

```go
[]int
[]interface{}
```

Từ định nghĩa của slice, chúng ta có thể suy ra rằng kiểu được tạo bởi slice trong quá trình biên dịch sẽ chỉ chứa các kiểu phần tử trong slice, tức là `int` hoặc `interface{}` v.v. [`cmd/compile/internal/types.NewSlice`](https://draveness.me/golang/tree/cmd/compile/internal/types.NewSlice)là hàm dùng để tạo các kiểu slice trong quá trình biên dịch:

```go
func NewSlice(elem *Type) *Type {
	if t := elem.Cache.slice; t != nil {
		if t.Elem() != elem {
			Fatalf("elem mismatch")
		}
		return t
	}

	t := New(TSLICE)
	t.Extra = Slice{Elem: elem}
	elem.Cache.slice = t
	return t
}
```

Trường `Extra` trong struct được phương thức trên trả về là struct chỉ chứa kiểu phần tử trong slice, nghĩa là kiểu phần tử trong slice được xác định trong quá trình biên dịch. Sau khi trình biên dịch xác định kiểu, nó sẽ lưu trữ kiểu trong trường `Extra`. Chương trình lấy kiểu một cách linh hoạt khi chạy.

## 1. Cấu trúc dữ liệu

Các slice trong quá trình biên dịch thuộc kiểu  [`cmd/compile/internal/types.Slice`](https://draveness.me/golang/tree/cmd/compile/internal/types.Slice), nhưng các slice trong runtime có thể được biểu diễn bằng reflect struct sau [`reflect.SliceHeader`](https://draveness.me/golang/tree/reflect.SliceHeader), trong đó:

- `Data` là một con trỏ tới một mảng;
- `Len` là chiều dài của slice hiện tại;
- `Cap` là dung lượng của slice hiện tại, tức là kích thước của mảng `Data` :

```go
type SliceHeader struct {
	Data uintptr
	Len  int
	Cap  int
}
```

`Data` là một không gian bộ nhớ liên tục, không gian bộ nhớ này có thể được sử dụng để lưu trữ tất cả các phần tử trong slice. các phần tử trong mảng chỉ là các khái niệm logic. Bộ nhớ cơ bản thực sự là liên tục, vì vậy chúng ta có thể hiểu slice là bộ nhớ liên tục. Không gian cộng với việc xác định chiều dài và dung lượng.

![Pasted image 20230608134956](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230608134956.png)

Từ hình trên, chúng ta sẽ thấy rằng các slice có liên quan rất chặt chẽ với array. Các slice giới thiệu một lớp trừu tượng cung cấp các tham chiếu đến một số phân đoạn liên tục trong mảng. Là một tham chiếu đến một mảng, chúng ta có thể sửa đổi độ dài của nó trong runtime. Khi độ dài của mảng ở dưới cùng của slice không đủ, quá trình mở rộng sẽ được kích hoạt và mảng được chỉ định bởi slice có thể thay đổi, tuy nhiên, từ phối cảnh của lớp trên, slice không thay đổi. Chỉ cần xử lý slice và không cần quan tâm đến sự thay đổi của mảng.

Chúng tôi đã giới thiệu trong phần trước rằng trình biên dịch đơn giản hóa các thao tác như lấy kích thước của mảng và đọc ghi các phần tử trong mảng trong quá trình biên dịch: Do bộ nhớ của mảng là cố định và liên tục nên hầu hết các thao tác sẽ trực tiếp đọc ghi các vị trí cụ thể trong bộ nhớ. Tuy nhiên, cấu trúc của slice được xác định trong runtime và tất cả các thao tác cũng phụ thuộc vào runtime của ngôn ngữ Go.

## 2. Khởi tạo

Có ba cách để khởi tạo slice trong ngôn ngữ Go:

1. Lấy một phần của một mảng hoặc slice bằng cách đăng ký
2. Khởi tạo slice mới bằng chữ
3. Sử dụng từ khóa `make` để tạo slice

```go
arr[0:3] or slice[0:3]
slice := []int{1, 2, 3}
slice := make([]int, 10)
```

### Sử dụng chỉ số

Sử dụng các chỉ số con để tạo slice là phương thức nguyên thủy nhất và gần gũi nhất với hợp ngữ, là phương thức cấp thấp nhất trong tất cả các phương thức, trình biên dịch sẽ chuyển đổi các câu lệnh như `arr[0:3]` hoặc `slice[0:3]` thành các toán tử `OpSliceMake`, chúng ta có thể kiểm chứng điều đó thông qua đoạn code sau:

```go
package opslicemake

func newSlice() []int {
	arr := [3]int{1, 2, 3}
	slice := arr[0:1]
	return slice
}
```

Có thể thu được một loạt mã trung gian SSA bằng cách biên dịch mã trên thông qua biến `GOSSAFUNC` và mã tương ứng với câu lệnh `slice := arr[0:1]` trong giai đoạn "decompose builtin" như sau:

```go
v27 (+5) = SliceMake <[]int> v11 v14 v17

name &arr[*[3]int]: v11
name slice.ptr[*int]: v11
name slice.len[int]: v14
name slice.cap[int]: v17
```

Thao tác `SliceMake` sẽ chấp nhận bốn tham số để tạo một slice mới, kiểu phần tử, con trỏ mảng, kích thước và dung lượng của slice, đây cũng là một số trường của slice mà chúng tôi đã đề cập trong phần cấu trúc dữ liệu. Cần lưu ý rằng việc khởi tạo slice với chỉ số con sẽ không sao chép dữ liệu trong mảng hoặc slice đầu, nó sẽ chỉ tạo cấu trúc slice trỏ đến mảng ban đầu. Do đó, việc sửa đổi dữ liệu của slice mới cũng sẽ sửa đổi slice ban đầu.

### Literal

Khi chúng ta sử dụng literal `[]int{1, 2, 3}` để tạo một slice mới, hàm [`cmd/compile/internal/gc.slicelit`](https://draveness.me/golang/tree/cmd/compile/internal/gc.slicelit)sẽ mở rộng nó trong quá trình biên dịch thành đoạn mã sau:

```go
var vstat [3]int
vstat[0] = 1
vstat[1] = 2
vstat[2] = 3
var vauto *[3]int = new([3]int)
*vauto = vstat
slice := vauto[:]
```

1. Suy luận về kích thước của mảng bên dưới dựa trên số lượng phần tử trong slice và tạo một mảng;
2. Lưu trữ các phần tử chữ này vào một mảng được khởi tạo;
3. Tạo một con trỏ mảng cũng trỏ đến kiểu `[3]int`;
4. Gán mảng `vstat` trong vùng lưu trữ tĩnh tới địa chỉ chứa con trỏ `vauto`;
5. Có được một lát cắt sử dụng vauto ở lớp dưới cùng thông qua thao tác `[:]`;

Ở bước 5 là phương pháp tạo slice sử dụng chỉ số `[:]`, từ đây ta cũng có thể thấy thao tác `[:]` là phương pháp tạo slice tầng dưới.

### Từ khóa make

Nếu bạn tạo các slice theo literal, thì hầu hết công việc sẽ được thực hiện tại thời điểm biên dịch. Nhưng khi chúng ta sử dụng từ khóa `make` để tạo một slice, rất nhiều công việc yêu cầu sự tham gia của runtime; lời gọi phải chuyển kích thước slice và dung lượng tùy chọn cho hàm `make` và hàm [`cmd/compile/internal/gc.typecheck1`](https://draveness.me/golang/tree/cmd/compile/internal/gc.typecheck1) sẽ kiểm tra các tham số đầu vào:

```go
func typecheck1(n *Node, top int) (res *Node) {
	switch n.Op {
	...
	case OMAKE:
		args := n.List.Slice()

		i := 1
		switch t.Etype {
		case TSLICE:
			if i >= len(args) {
				yyerror("missing len argument to make(%v)", t)
				return n
			}

			l = args[i]
			i++
			var r *Node
			if i < len(args) {
				r = args[i]
			}
			...
			if Isconst(l, CTINT) && r != nil && Isconst(r, CTINT) && l.Val().U.(*Mpint).Cmp(r.Val().U.(*Mpint)) > 0 {
				yyerror("len larger than cap in make(%v)", t)
				return n
			}

			n.Left = l
			n.Right = r
			n.Op = OMAKESLICE
		}
	...
	}
}
```

Hàm trên sẽ không chỉ kiểm tra xem `len` có được truyền vào hay không mà còn đảm bảo rằng dung lượng `cap` được truyền vào phải lớn hơn hoặc bằng `len`. Ngoài các tham số xác minh, hàm hiện tại sẽ chuyển đổi nút `OMAKE` thành `OMAKESLICE`, và hàm [`cmd/compile/internal/gc.walkexpr`](https://draveness.me/golang/tree/cmd/compile/internal/gc.walkexpr) sẽ chuyển đổi nút kiểu `OMAKESLICE` theo hai điều kiện sau:

1. Kích thước và dung lượng của slice có đủ nhỏ hay không;
2. Cho dù slice đã thoát và cuối cùng được khởi tạo trên heap

Khi slice thoát ra hoặc rất lớn, trình thực thi  [`runtime.makeslice`](https://draveness.me/golang/tree/runtime.makeslice) khởi tạo slice trên heap, nếu slice hiện tại không thoát ra và slice rất nhỏ, `make([]int, 3, 4)` sẽ được chuyển đổi trực tiếp thành mã sau:

```go
var arr [4]int
n := arr[:3]
```

Đoạn mã trên sẽ khởi tạo mảng và lấy lát cắt tương ứng của mảng thông qua chỉ số `[:3]`. Hai phần thao tác này sẽ được hoàn thành trong giai đoạn biên dịch. Trình biên dịch sẽ tạo mảng trên stack hoặc trong vùng lưu trữ tĩnh và chuyển đổi `[:3]` thành thao tác `OpSliceMake` như đã đề cập ở trên.

Sau khi phân tích các nhánh chủ yếu được xử lý bởi trình biên dịch, chúng ta quay lại hàm runtime [`runtime.makeslice`](https://draveness.me/golang/tree/runtime.makeslice) được sử dụng để tạo các slice, việc triển khai hàm này rất đơn giản:

```go
func makeslice(et *_type, len, cap int) unsafe.Pointer {
	mem, overflow := math.MulUintptr(et.size, uintptr(cap))
	if overflow || mem > maxAlloc || len < 0 || len > cap {
		mem, overflow := math.MulUintptr(et.size, uintptr(len))
		if overflow || mem > maxAlloc || len < 0 {
			panicmakeslicelen()
		}
		panicmakeslicecap()
	}

	return mallocgc(mem, et, true)
}
```

Công việc chính của hàm trên là tính dung lượng bộ nhớ bị chiếm bởi slice và áp dụng cho một phần bộ nhớ liên tục trên heap, nó sử dụng phương pháp sau để tính dung lượng bộ nhớ bị chiếm:

```
Dung lượng bộ nhớ = kích thước phần tử trong slice × dung lượng slice
```

Mặc dù có thể phát hiện nhiều lỗi trong quá trình biên dịch, nhưng nếu các lỗi sau xảy ra trong quá trình tạo slice, nó sẽ trực tiếp gây ra lỗi runtime và sự cố:

1. Kích thước của không gian bộ nhớ đã bị tràn;
2. Bộ nhớ được yêu cầu lớn hơn bộ nhớ được cấp phát tối đa;
3. Độ dài được truyền vào nhỏ hơn 0 hoặc độ dài lớn hơn dung lượng;

Hàm [`runtime.mallocgc`](https://draveness.me/golang/tree/runtime.mallocgc) được sử dụng để cấp phát cho bộ nhớ được gọi ở cuối [`runtime.makeslice`](https://draveness.me/golang/tree/runtime.makeslice), việc triển khai hàm này vẫn tương đối phức tạp, nếu gặp một đối tượng tương đối nhỏ, nó sẽ được khởi tạo trực tiếp trong cấu trúc P trong bộ lập lịch ngôn ngữ Go và đối tượng lớn hơn hơn 32KB sẽ nằm trên heap. Chúng tôi sẽ giới thiệu chi tiết về bộ cấp phát bộ nhớ của ngôn ngữ Go trong các chương sau nên chúng tôi sẽ không phân tích ở đây.

Trong phiên bản trước của ngôn ngữ Go, con trỏ mảng, độ dài và dung lượng sẽ được kết hợp thành một struct [`runtime.slice`](https://draveness.me/golang/tree/runtime.slice) , nhưng sau khi gửi từ [cmd/compile: di chuyển cấu trúc slice tới lời gọi makelice](https://github.com/golang/go/commit/020a18c545bf49ffc087ca93cd238195d8dcc411#diff-d9238ca551e72b3a80da9e0da10586a4) , công việc [`reflect.SliceHeader`](https://draveness.me/golang/tree/reflect.SliceHeader) được chuyển giao cho lời gọi của [`runtime.makeslice`](https://draveness.me/golang/tree/runtime.makeslice), hàm này sẽ chỉ trả về một con trỏ tới mảng bên dưới và người gọi sẽ xây dựng cấu trúc lát cắt trong quá trình biên dịch:

```go
func typecheck1(n *Node, top int) (res *Node) {
	switch n.Op {
	...
	case OSLICEHEADER:
	switch 
		t := n.Type
		n.Left = typecheck(n.Left, ctxExpr)
		l := typecheck(n.List.First(), ctxExpr)
		c := typecheck(n.List.Second(), ctxExpr)
		l = defaultlit(l, types.Types[TINT])
		c = defaultlit(c, types.Types[TINT])

		n.List.SetFirst(l)
		n.List.SetSecond(c)
	...
	}
}
```

Thao tác `OSLICEHEADER` này tạo ra cấu trúc [`reflect.SliceHeader`](https://draveness.me/golang/tree/reflect.SliceHeader) mà chúng tôi đã giới thiệu ở trên, chứa con trỏ mảng, độ dài và dung lượng của slice, là biểu diễn runtime của slice:

```go
type SliceHeader struct {
	Data uintptr
	Len  int
	Cap  int
}
```

Chính vì hầu hết các thao tác trên kiểu slice không cần thao tác trực tiếp với cấu trúc [`runtime.slice`](https://draveness.me/golang/tree/runtime.slice), nên việc giới thiệu  [`reflect.SliceHeader`](https://draveness.me/golang/tree/reflect.SliceHeader) có thể giảm một lượng nhỏ chi phí hoạt động trong quá trình khởi tạo slice. Sự thay đổi này không chỉ có thể giảm kích thước của gói ngôn ngữ Go xuống ~ 0,2% nhưng cũng  nó cũng tiết kiệm 92 lệnh gọi [`runtime.panicIndex`](https://draveness.me/golang/tree/runtime.panicIndex)cuộc gọi , chiếm ~3,5% mã nhị phân ngôn ngữ Go.

## 3. Truy cập các phần tử

Sử dụng `len` và `cap` để lấy độ dài hoặc dung lượng là thao tác phổ biến nhất của các slice. Trình biên dịch coi chúng là hai thao tác đặc biệt, cụ thể là `OLEN` và `OCAP`, và hàm [`cmd/compile/internal/gc.state.expr`](https://draveness.me/golang/tree/cmd/compile/internal/gc.state.expr)sẽ chuyển đổi chúng thành `OpSliceLen` và `OpSliceCap` trong giai đoạn tạo SSA ([[Golang IR SSA]]):

```go
func (s *state) expr(n *Node) *ssa.Value {
	switch n.Op {
	case OLEN, OCAP:
		switch {
		case n.Left.Type.IsSlice():
			op := ssa.OpSliceLen
			if n.Op == OCAP {
				op = ssa.OpSliceCap
			}
			return s.newValue1(op, types.Types[TINT], s.expr(n.Left))
		...
		}
	...
	}
}
```

Việc truy cập các trường trong một slice có thể kích hoạt tối ưu hóa trong giai đoạn "decompose builtin",  `len(slice)` hoặc `cap(slice)` sẽ được thay thế trực tiếp bằng độ dài hoặc dung lượng của lát cắt trong một số trường hợp và không cần lấy trong runtime :

```go
(SlicePtr (SliceMake ptr _ _ )) -> ptr
(SliceLen (SliceMake _ len _)) -> len
(SliceCap (SliceMake _ _ cap)) -> cap
```

Ngoài việc lấy độ dài và dung lượng của một slice, các thao tác `OINDEX` cũng được chuyển đổi thành truy cập trực tiếp đến các địa chỉ trong quá trình tạo họa tiết:

```go
func (s *state) expr(n *Node) *ssa.Value {
	switch n.Op {
	case OINDEX:
		switch {
		case n.Left.Type.IsSlice():
			p := s.addr(n, false)
			return s.load(n.Left.Type.Elem(), p)
		...
		}
	...
	}
}
```

Các thao tác của slice về cơ bản được hoàn thành trong quá trình biên dịch. Ngoài việc truy xuất độ dài, dung lượng hay các phần tử của slice, quá trình truyền tải chứa từ khóa `range` cũng sẽ được chuyển đổi thành một dạng vòng lặp đơn giản hơn trong quá trình biên dịch. Chúng tôi sẽ giới thiệu quy trình sử dụng phạm vi để duyệt các lát trong các chương sau.

## 4. Bổ sung và mở rộng

Sử dụng từ khóa `append` để thêm các phần tử vào slice cũng là một thao tác slice phổ biến, phương thức [`cmd/compile/internal/gc.state.append`](https://draveness.me/golang/tree/cmd/compile/internal/gc.state.append) ở giai đoạn tạo mã trung gian sẽ ghi đè lên biến ban đầu tùy theo giá trị trả về. Chọn nhập hai quy trình, nếu slice mới được `append` trả về không cần được gán trở lại biến ban đầu, nó sẽ bước vào luồng xử lý sau:

```go
// append(slice, 1, 2, 3)
ptr, len, cap := slice
newlen := len + 3
if newlen > cap {
    ptr, len, cap = growslice(slice, newlen)
    newlen = len + 3
}
*(ptr+len) = 1
*(ptr+len+1) = 2
*(ptr+len+2) = 3
return makeslice(ptr, newlen, cap)
```

Đầu tiên chúng ta sẽ giải cấu trúc slice để lấy con trỏ mảng, kích thước và dung lượng của nó, nếu kích thước của slice lớn hơn dung lượng sau khi thêm các phần tử, thì chúng ta sẽ gọi [`runtime.growslice`](https://draveness.me/golang/tree/runtime.growslice) để mở rộng slice và lần lượt thêm các phần tử mới.

Nếu câu lệnh  `slice = append(slice, 1, 2, 3)`, thì slice sau `append` sẽ bao phủ slice ban đầu và phương thức [`cmd/compile/internal/gc.state.append`](https://draveness.me/golang/tree/cmd/compile/internal/gc.state.append)sẽ sử dụng một cách khác để mở rộng:

```go
// slice = append(slice, 1, 2, 3)
a := &slice
ptr, len, cap := slice
newlen := len + 3
if uint(newlen) > uint(cap) {
   newptr, len, newcap = growslice(slice, newlen)
   vardef(a)
   *a.cap = newcap
   *a.ptr = newptr
}
newlen = len + 3
*a.len = newlen
*(ptr+len) = 1
*(ptr+len+1) = 2
*(ptr+len+2) = 3
```

Logic của việc có ghi đè lên biến ban đầu hay không thực sự giống nhau, sự khác biệt lớn nhất là slice mới thu được có được gán lại cho biến ban đầu hay không. Nếu chọn ghi đè lên biến gốc, chúng ta không cần lo copy slice ảnh hưởng đến hiệu suất, vì trình biên dịch của ngôn ngữ Go đã tối ưu hóa tình trạng phổ biến này rồi.

![Pasted image 20230608191357](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230608191357.png)

Cho đến nay chúng ta đã thấy cách ngôn ngữ Go có thể thêm các phần tử vào các slice khi dung lượng slice đủ, nhưng chúng ta vẫn cần nghiên cứu quy trình xử lý khi dung lượng slice không đủ. Khi dung lượng của slice không đủ chúng ta sẽ gọi hàm [`runtime.growslice`](https://draveness.me/golang/tree/runtime.growslice)để mở rộng slice. Mở rộng dung lượng là quá trình cấp phát không gian bộ nhớ mới cho slice và sao chép các phần tử trong slice ban đầu. Đầu tiên hãy xem dung lượng của slice như thế nào slice mới được xác định:

```go
func growslice(et *_type, old slice, cap int) slice {
	newcap := old.cap
	doublecap := newcap + newcap
	if cap > doublecap {
		newcap = cap
	} else {
		if old.len < 1024 {
			newcap = doublecap
		} else {
			for 0 < newcap && newcap < cap {
				newcap += newcap / 4
			}
			if newcap <= 0 {
				newcap = cap
			}
		}
	}
```

Trước khi phân bổ không gian bộ nhớ, bạn cần xác định dung lượng slice mới và chọn các chiến lược khác nhau để mở rộng dung lượng theo dung lượng hiện tại của slice khi chạy:

1. Nếu dung lượng dự kiến ​​lớn hơn gấp đôi dung lượng hiện tại thì sẽ sử dụng hết công suất dự kiến;
2. Nếu độ dài của slice hiện tại nhỏ hơn 1024, dung lượng sẽ tăng gấp đôi;
3. Nếu độ dài của slice hiện tại lớn hơn 1024, dung lượng sẽ tăng 25% mỗi lần cho đến khi dung lượng mới lớn hơn dung lượng dự kiến;

Đoạn mã trên sẽ chỉ xác định dung lượng gần đúng của slice và bộ nhớ cần được căn chỉnh theo kích thước của các phần tử trong slice. Khi kích thước byte của các phần tử trong mảng là bội số của 1, 8, hoặc 2, trình thực thi sẽ sử dụng mã sau đây để căn chỉnh bộ nhớ:

```go
	var overflow bool
	var lenmem, newlenmem, capmem uintptr
	switch {
	case et.size == 1:
		lenmem = uintptr(old.len)
		newlenmem = uintptr(cap)
		capmem = roundupsize(uintptr(newcap))
		overflow = uintptr(newcap) > maxAlloc
		newcap = int(capmem)
	case et.size == sys.PtrSize:
		lenmem = uintptr(old.len) * sys.PtrSize
		newlenmem = uintptr(cap) * sys.PtrSize
		capmem = roundupsize(uintptr(newcap) * sys.PtrSize)
		overflow = uintptr(newcap) > maxAlloc/sys.PtrSize
		newcap = int(capmem / sys.PtrSize)
	case isPowerOfTwo(et.size):
		...
	default:
		...
	}
```

Hàm [`runtime.roundupsize`](https://draveness.me/golang/tree/runtime.roundupsize)sẽ làm tròn bộ nhớ được áp dụng. Mảng[`runtime.class_to_size`](https://draveness.me/golang/tree/runtime.class_to_size) sẽ được sử dụng khi làm tròn. Việc sử dụng các số nguyên trong mảng này có thể cải thiện hiệu quả cấp phát bộ nhớ và giảm phân mảnh. Chúng tôi sẽ giới thiệu chi tiết chức năng của mảng này trong phần cấp phát bộ nhớ:

```go
var class_to_size = [_NumSizeClasses]uint16{
    0,
    8,
    16,
    32,
    48,
    64,
    80,
    ...,
}
```

Theo mặc định, chúng tôi nhân dung lượng mục tiêu với kích thước phần tử để có mức sử dụng bộ nhớ. Nếu xảy ra tràn bộ nhớ khi tính toán dung lượng mới hoặc bộ nhớ được yêu cầu vượt quá giới hạn trên, nó sẽ trực tiếp gây lỗi và thoát khỏi chương trình. Tuy nhiên, để giảm chi phí hiểu biết, mã liên quan được bỏ qua ở đây.

```go
	var overflow bool
	var newlenmem, capmem uintptr
	switch {
	...
	default:
		lenmem = uintptr(old.len) * et.size
		newlenmem = uintptr(cap) * et.size
		capmem, _ = math.MulUintptr(et.size, uintptr(newcap))
		capmem = roundupsize(capmem)
		newcap = int(capmem / et.size)
	}
	...
	var p unsafe.Pointer
	if et.kind&kindNoPointers != 0 {
		p = mallocgc(capmem, nil, false)
		memclrNoHeapPointers(add(p, newlenmem), capmem-newlenmem)
	} else {
		p = mallocgc(capmem, et, true)
		if writeBarrier.enabled {
			bulkBarrierPreWriteSrcOnly(uintptr(p), uintptr(old.array), lenmem)
		}
	}
	memmove(p, old.array, lenmem)
	return slice{p, old.len, newcap}
}
```

Nếu phần tử trong slice không phải là kiểu con trỏ, thì [`runtime.memclrNoHeapPointers`](https://draveness.me/golang/tree/runtime.memclrNoHeapPointers) sẽ được gọi để xóa vị trí vượt quá độ dài hiện tại của slice.và cuối cùng dùng [`runtime.memmove`](https://draveness.me/golang/tree/runtime.memmove) để sao chép nội dung của bộ nhớ mảng ban đầu sang bộ nhớ mới được cấp phát. Cả hai phương pháp này đều được thực hiện bằng cách sử dụng các assembly instruction trên máy mục tiêu, vì vậy chúng tôi sẽ không giới thiệu chúng ở đây.

Cuối cùng, hàm [`runtime.growslice`](https://draveness.me/golang/tree/runtime.growslice) sẽ trả về một slice mới, chứa con trỏ mảng, kích thước và dung lượng mới, và bộ ba được trả về cuối cùng sẽ ghi đè lên slice ban đầu.

```go
var arr []int64
arr = append(arr, 1, 2, 3, 4, 5)
```

Tóm tắt ngắn gọn quá trình mở rộng. Khi chúng ta thực thi đoạn mã trên, hàm [`runtime.growslice`](https://draveness.me/golang/tree/runtime.growslice) sẽ được gọi để mở rộng `arr` và dung lượng mới dự kiến ​​là 5. Tại thời điểm này, kích thước bộ nhớ được phân bổ dự kiến ​​là 40 byte. Tuy nhiên, do kích thước của các phần tử trong slice bằng `sys.PtrSize`, vì vậy trình thực thi sẽ gọi  [`runtime.roundupsize`](https://draveness.me/golang/tree/runtime.roundupsize)làm tròn kích thước bộ nhớ lên 48 byte, vì vậy dung lượng của slice mới là `48 / 8 = 6`.

## 5. Sao chép slice

Mặc dù việc sao chép các slice không phải là một hoạt động phổ biến, nhưng chúng ta cần phải tìm hiểu nguyên tắc thực hiện slice. Khi chúng ta sử dụng `copy(a, b)` để sao chép các slice, trong quá trình biên dịch, hàm [`cmd/compile/internal/gc.copyany`](https://draveness.me/golang/tree/cmd/compile/internal/gc.copyany) sẽ xử lý theo hai trường hợp, nếu hiện tại, không gọi `copy` trong runtime, `copy(a, b)` sẽ được chuyển đổi trực tiếp thành mã sau:

```go
n := len(a)
if n > len(b) {
    n = len(b)
}
if a.ptr != b.ptr {
    memmove(a.ptr, b.ptr, n*sizeof(elem(a))) 
}
```

trong đoạn mã trên [`runtime.memmove`](https://draveness.me/golang/tree/runtime.memmove)sẽ chịu trách nhiệm sao chép bộ nhớ. Và nếu việc sao chép xảy ra trong runtime, chẳng hạn: `go copy(a, b)`, trình biên dịch sẽ thay thế  `copy` bằng lệnh gọi [`runtime.slicecopy`](https://draveness.me/golang/tree/runtime.slicecopy) trong runtime, việc thực hiện chức năng này rất đơn giản:

```go
func slicecopy(to, fm slice, width uintptr) int {
	if fm.len == 0 || to.len == 0 {
		return 0
	}
	n := fm.len
	if to.len < n {
		n = to.len
	}
	if width == 0 {
		return n
	}
	...

	size := uintptr(n) * width
	if size == 1 {
		*(*byte)(to.array) = *(*byte)(fm.array)
	} else {
		memmove(to.array, fm.array, size)
	}
	return n
}
```

Cho dù đó là sao chép trong quá trình biên dịch hay sao chép trong runtime, cả hai phương thức sao chép sẽ dùng [`runtime.memmove`](https://draveness.me/golang/tree/runtime.memmove)để sao chép nội dung của toàn bộ khối bộ nhớ vào vùng bộ nhớ đích:

![Pasted image 20230608213629](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230608213629.png)

So với việc sao chép các yếu tố một cách tuần tự, [`runtime.memmove`](https://draveness.me/golang/tree/runtime.memmove)có thể mang lại hiệu suất tốt hơn. Cần lưu ý rằng việc sao chép toàn bộ khối bộ nhớ vẫn sẽ chiếm nhiều tài nguyên và bạn phải chú ý đến tác động đến hiệu suất khi thực hiện thao tác sao chép trên các slice lớn.

## 6. Tóm tắt

Nhiều chức năng của các slice được trình thực thi thực hiện. Cho dù đó là khởi tạo các slice, hoặc nối thêm hoặc mở rộng các slice, thì đều cần có sự hỗ trợ của runtime. Cần lưu ý rằng việc sao chép bộ nhớ quy mô lớn có thể xảy ra khi mở rộng hoặc sao chép các slice lớn. Đảm bảo giảm bớt các thao tác tương tự để tránh ảnh hưởng đến hiệu suất của chương trình.
