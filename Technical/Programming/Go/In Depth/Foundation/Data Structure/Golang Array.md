---
title: Golang Array
date created: 2023-06-08
date modified: 2023-07-08
tags: [golang]
dg-publish: true
---

Array và Slice là cấu trúc dữ liệu phổ biến trong ngôn ngữ Go và nhiều nhà phát triển mới sử dụng Go có xu hướng nhầm lẫn giữa hai khái niệm này. Là tập hợp phổ biến nhất, mảng rất quan trọng trong các ngôn ngữ lập trình. Ngoài mảng, ngôn ngữ Go còn giới thiệu một khái niệm khác - slice. Slice có phần giống với mảng, nhưng sự khác biệt của chúng dẫn đến sự khác biệt lớn trong cách sử dụng. Trong phần này, chúng tôi sẽ giới thiệu các nguyên tắc triển khai cơ bản của mảng từ bài [[Golang Compile Intro]] của ngôn ngữ Go , bao gồm một số thao tác phổ biến về khởi tạo, truy cập và gán mảng.

## 1. Tổng quan

Mảng là một cấu trúc dữ liệu gồm tập hợp các phần tử cùng kiểu, máy tính sẽ cấp phát một phần bộ nhớ liên tục cho mảng để lưu trữ các phần tử, ta có thể sử dụng chỉ số của phần tử trong mảng để truy xuất nhanh một phần tử cụ thể. phần tử. Hầu hết các mảng phổ biến là một chiều, tuyến tính. Trong khi mảng nhiều chiều có ứng dụng tương đối phổ biến trong lĩnh vực tính toán số và đồ họa.

![Pasted image 20230608012457](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230608012457.png)

Là một kiểu dữ liệu cơ bản, mảng thường được mô tả từ hai trường, đó là kiểu phần tử được lưu trữ trong mảng và số lượng phần tử tối đa có thể được lưu trữ trong mảng. Trong ngôn ngữ Go, chúng ta thường sử dụng cách sau để đại diện cho các loại mảng:

```go
[10]int
[200]interface{}
```

Kích thước của mảng ngôn ngữ Go không thể thay đổi sau khi khởi tạo. Các kiểu mảng có cùng kiểu phần tử lưu trữ nhưng kích thước khác nhau thì hoàn toàn khác nhau trong ngôn ngữ Go. Chỉ khi hai điều kiện giống nhau thì chúng mới là cùng loại.

```go
func NewArray(elem *Type, bound int64) *Type {
	if bound < 0 {
		Fatalf("NewArray: invalid bound %v", bound)
	}
	t := New(TARRAY)
	t.Extra = &Array{Elem: elem, Bound: bound}
	t.SetNotInHeap(elem.NotInHeap())
	return t
}
```

Kiểu mảng trong quá trình biên dịch được tạo bởi hàm  [`cmd/compile/internal/types.NewArray`](https://draveness.me/golang/tree/cmd/compile/internal/types.NewArray). Kiểu này chứa hai trường, cụ thể là kiểu phần tử `Elem` và kích thước của mảng `Bound`. Hai trường này kết hợp với nhau tạo thành kiểu mảng. Việc có nên khởi tạo mảng hiện tại trên ngăn xếp hay không được xác định tại thời điểm biên dịch.

## 2. Khởi tạo [#](https://draveness.me/golang/docs/part2-foundation/ch03-datastructure/golang-array/#312-%e5%88%9d%e5%a7%8b%e5%8c%96)

Có hai cách khác nhau để tạo mảng trong ngôn ngữ Go, một là chỉ định rõ ràng kích thước của mảng, hai là sử dụng `[…]T` để khai báo, ngôn ngữ Go sẽ suy ra kích thước của mảng từ mã nguồn trong quá trình biên dịch :

```go
arr1 := [3]int{1, 2, 3}
arr2 := [...]int{1, 2, 3}
```

Kết quả của hai phương thức khai báo trên hoàn toàn giống nhau trong runtime và phương thức khai báo số lượng sau sẽ được chuyển đổi thành phương thức khai báo số lượng trước trong quá trình biên dịch, đây là sự dẫn xuất của kích thước mảng bởi trình biên dịch.

### Dẫn xuất giới hạn trên

Hai phương thức khai báo khác nhau sẽ khiến trình biên dịch thực hiện các xử lý hoàn toàn khác nhau, nếu chúng ta sử dụng phương thức thứ nhất `[10]T` thì kiểu của biến sẽ được trích xuất trong giai đoạn [[Golang Type Check]] của quá trình biên dịch, sau đó được sử dụng [`cmd/compile/internal/types.NewArray`](https://draveness.me/golang/tree/cmd/compile/internal/types.NewArray) để tạo struct [`cmd/compile/internal/types.Array`](https://draveness.me/golang/tree/cmd/compile/internal/types.Array) chứa kích thước của mảng.

Khi chúng ta khai báo một mảng theo cách `[…]T`, trình biên dịch sẽ suy ra kích thước của mảng trong hàm [`cmd/compile/internal/gc.typecheckcomplit`](https://draveness.me/golang/tree/cmd/compile/internal/gc.typecheckcomplit):

```go
func typecheckcomplit(n *Node) (res *Node) {
	...
	if n.Right.Op == OTARRAY && n.Right.Left != nil && n.Right.Left.Op == ODDD {
		n.Right.Right = typecheck(n.Right.Right, ctxType)
		if n.Right.Right.Type == nil {
			n.Type = nil
			return n
		}
		elemType := n.Right.Right.Type

		length := typecheckarraylit(elemType, -1, n.List.Slice(), "array literal")

		n.Op = OARRAYLIT
		n.Type = types.NewArray(elemType, length)
		n.Right = nil
		return n
	}
	...

	switch t.Etype {
	case TARRAY:
		typecheckarraylit(t.Elem(), t.NumElem(), n.List.Slice(), "array literal")
		n.Op = OARRAYLIT
		n.Right = nil
	}
}
```

Lệnh [`cmd/compile/internal/gc.typecheckcomplit`](https://draveness.me/golang/tree/cmd/compile/internal/gc.typecheckcomplit) rút gọn này sẽ gọi lệnh [`cmd/compile/internal/gc.typecheckarraylit`](https://draveness.me/golang/tree/cmd/compile/internal/gc.typecheckarraylit)để đếm số lượng phần tử trong mảng bằng cách duyệt qua các phần tử.

Như vậy chúng ta có thể thấy điều đó `[…]T{1, 2, 3}` và `[3]T{1, 2, 3}` hoàn toàn tương đương trong runtime, phương thức khởi tạo `[…]T` này chỉ là cú pháp cú pháp do ngôn ngữ Go cung cấp, khi chúng ta không muốn đếm số phần tử trong mảng thì có thể sử dụng phương thức này để giảm bớt một số khối lượng công việc.

### Báo cáo chuyển đổi

Đối với một mảng bao gồm các ký tự, tùy theo số phần tử trong mảng, trình biên dịch sẽ thực hiện hai cách tối ưu hóa khác nhau trong hàm [`cmd/compile/internal/gc.anylit`](https://draveness.me/golang/tree/cmd/compile/internal/gc.anylit):

1. Khi số phần tử nhỏ hơn hoặc bằng 4 thì các phần tử trong mảng sẽ được xếp thẳng vào stack;
2. Khi số phần tử lớn hơn 4 thì các phần tử trong mảng sẽ được đặt vào vùng tĩnh và đưa ra ngoài tại runtime;

```go
func anylit(n *Node, var_ *Node, init *Nodes) {
	t := n.Type
	switch n.Op {
	case OSTRUCTLIT, OARRAYLIT:
		if n.List.Len() > 4 {
			...
		}

		fixedlit(inInitFunction, initKindLocalCode, n, var_, init)
	...
	}
}
```

Khi các phần tử của mảng **nhỏ hơn hoặc bằng bốn** , [`cmd/compile/internal/gc.fixedlit`](https://draveness.me/golang/tree/cmd/compile/internal/gc.fixedlit) sẽ chịu trách nhiệm chuyển đổi `[3]{1, 2, 3}` thành một câu lệnh nguyên thủy hơn trước khi hàm được biên dịch:

```go
func fixedlit(ctxt initContext, kind initKind, n *Node, var_ *Node, init *Nodes) {
	var splitnode func(*Node) (a *Node, value *Node)
	...

	for _, r := range n.List.Slice() {
		a, value := splitnode(r)
		a = nod(OAS, a, value)
		a = typecheck(a, ctxStmt)
		switch kind {
		case initKindStatic:
			genAsStatic(a)
		case initKindLocalCode:
			a = orderStmtInPlace(a, map[string][]*Node{})
			a = walkstmt(a)
			init.Append(a)
		}
	}
}
```

Khi số phần tử trong mảng nhỏ hơn hoặc bằng 4 và [`cmd/compile/internal/gc.fixedlit`](https://draveness.me/golang/tree/cmd/compile/internal/gc.fixedlit)hàm nhận `kind` là `initKindLocalCode`, đoạn mã trên sẽ tách câu lệnh khởi tạo ban đầu thành một biểu thức khai báo biến và một số biểu thức gán, và các biểu thức này sẽ hoàn thành việc khởi tạo Array:

```go
var arr [3]int
arr[0] = 1
arr[1] = 2
arr[2] = 3
```

Nhưng nếu mảng hiện tại có nhiều hơn bốn phần tử, thì [`cmd/compile/internal/gc.anylit`](https://draveness.me/golang/tree/cmd/compile/internal/gc.anylit)sẽ lấy trước một phần tử duy nhất `staticname`, sau đó gọi[`cmd/compile/internal/gc.fixedlit`](https://draveness.me/golang/tree/cmd/compile/internal/gc.fixedlit) để khởi tạo các phần tử trong mảng trong vùng lưu trữ tĩnh và gán các biến tạm thời cho mảng:

```go
func anylit(n *Node, var_ *Node, init *Nodes) {
	t := n.Type
	switch n.Op {
	case OSTRUCTLIT, OARRAYLIT:
		if n.List.Len() > 4 {
			vstat := staticname(t)
			vstat.Name.SetReadonly(true)

			fixedlit(inNonInitFunction, initKindStatic, n, vstat, init)

			a := nod(OAS, var_, vstat)
			a = typecheck(a, ctxStmt)
			a = walkexpr(a, init)
			init.Append(a)
			break
		}

		...
	}
}
```

Giả sử rằng đoạn mã cần được khởi tạo `[5]int{1, 2, 3, 4, 5}`, thì chúng ta có thể hiểu quá trình trên dưới dạng mã giả sau:

```go
var arr [5]int
statictmp_0[0] = 1
statictmp_0[1] = 2
statictmp_0[2] = 3
statictmp_0[3] = 4
statictmp_0[4] = 5
arr = statictmp_0
```

Tóm lại, chưa xét đến phân tích thoát, nếu số phần tử trong mảng nhỏ hơn hoặc bằng 4 thì tất cả các biến sẽ được khởi tạo trực tiếp trong strack, nếu số phần tử mảng lớn hơn 4 thì các biến được khởi tạo sẽ nằm trong vùng lưu trữ tĩnh rồi sao chép vào stack, mã được chuyển đổi sẽ tiếp tục đi vào hai giai đoạn tạo mã trung gian ([[Golang IR SSA]]) và tạo mã máy ([[Golang Machine Code]]), cuối cùng tạo ra tệp nhị phân thực thi.

## 3. Truy cập và gán

Cho dù nó nằm trên ngăn xếp hay trong một vùng lưu trữ tĩnh, một mảng là một chuỗi các không gian bộ nhớ trong bộ nhớ. Chúng ta biểu diễn một mảng bằng một con trỏ chỉ đến phần đầu của mảng, số lượng phần tử và kích thước của không gian bị chiếm dụng theo kiểu phần tử. Nếu chúng ta không biết số lượng phần tử trong mảng, thì nó có thể bị vượt quá giới hạn trong quá trình truy cập; và nếu chúng ta không biết kích thước của kiểu phần tử trong mảng, thì không có cách nào để biết có bao nhiêu byte dữ liệu nên được tìm nạp tại một thời điểm, bất kể thông tin nào bị mất, chúng tôi không thể biết Dữ liệu nào được lưu trữ trong không gian bộ nhớ liên tục này:

![Pasted image 20230608015654](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230608015654.png)

Truy cập mảng quá giới hạn là một lỗi rất nghiêm trọng, trong ngôn ngữ Go, kiểm tra kiểu tĩnh trong quá trình biên dịch có thể xác định rằng mảng vượt quá giới hạn. [`cmd/compile/internal/gc.typecheck1`](https://draveness.me/golang/tree/cmd/compile/internal/gc.typecheck1)sẽ xác minh chỉ mục của mảng truy cập.

```go
func typecheck1(n *Node, top int) (res *Node) {
	switch n.Op {
	case OINDEX:
		ok |= ctxExpr
		l := n.Left  // array
		r := n.Right // index
		switch n.Left.Type.Etype {
		case TSTRING, TARRAY, TSLICE:
			...
			if n.Right.Type != nil && !n.Right.Type.IsInteger() {
				yyerror("non-integer array index %v", n.Right)
				break
			}
			if !n.Bounded() && Isconst(n.Right, CTINT) {
				x := n.Right.Int64()
				if x < 0 {
					yyerror("invalid array index %v (index must be non-negative)", n.Right)
				} else if n.Left.Type.IsArray() && x >= n.Left.Type.NumElem() {
					yyerror("invalid array index %v (out of bounds for %d-element array)", n.Right, n.Left.Type.NumElem())
				}
			}
		}
	...
	}
}
```

1. Khi chỉ mục của mảng truy cập không phải là số nguyên, lỗi "non-integer array index %v" được báo cáo;
2. Khi chỉ mục của mảng truy cập là âm, lỗi "cinvalid array index %v (index must be non-negative)" được báo cáo;
3. Khi truy cập chỉ mục của mảng quá giới hạn, lỗi "invalid array index %v (out of bounds for %d-element array)" được báo cáo;

Một số lỗi đơn giản quá giới hạn của mảng và chuỗi sẽ được phát hiện trong quá trình biên dịch, chẳng hạn: dùng trực tiếp số nguyên hoặc hằng để truy cập mảng, nhưng nếu dùng biến để truy cập mảng hoặc chuỗi thì trình biên dịch không thể phát hiện trước lỗi, chúng ta cần runtime ngôn ngữ Go để ngăn truy cập không hợp lệ:

```go
arr[4]: invalid array index 4 (out of bounds for 3-element array)
arr[i]: panic: runtime error: index out of range [4] with length 3
```

Khi trình thực thi ngôn ngữ Go tìm thấy các thao tác vượt quá giới hạn trên array, slice và string, [`runtime.panicIndex`](https://draveness.me/golang/tree/runtime.panicIndex)và [`runtime.goPanicIndex`](https://draveness.me/golang/tree/runtime.goPanicIndex)sẽ gây lỗi runtime và khiến chương trình gặp sự cố thoát:

```go
TEXT runtime·panicIndex(SB),NOSPLIT,$0-8
	MOVL	AX, x+0(FP)
	MOVL	CX, y+4(FP)
	JMP	runtime·goPanicIndex(SB)

func goPanicIndex(x int, y int) {
	panicCheck1(getcallerpc(), "index out of range")
	panic(boundsError{x: int64(x), signed: true, y: y, code: boundsIndex})
}
```

Khi hoạt động truy cập của mảng vượt qua kiểm tra `OINDEX` của trình biên dịch thành công, nó sẽ được chuyển đổi thành một số hướng dẫn SSA. Giả sử chúng ta có mã ngôn ngữ Go được hiển thị bên dưới và biên dịch nó theo cách sau để lấy tệp `ssa.html:`

```go
package check

func outOfRange() int {
	arr := [3]int{1, 2, 3}
	i := 4
	elem := arr[i]
	return elem
}

$ GOSSAFUNC=outOfRange go build array.go
dumped SSA to ./ssa.html
```

Mã `start` SSA được tạo trong giai đoạn này là phiên bản đầu tiên của mã trung gian trước khi tối ưu hóa. Phần hiển thị bên dưới là mã trung gian tương ứng  `elem := arr[i]`. Trong mã trung gian này, chúng tôi thấy rằng ngôn ngữ Go tạo ra các lệnh để đánh giá giới hạn trên của mảng, `IsInBounds` để đánh giá giới hạn trên của mảng và `PanicBounds` để kích hoạt chương trình gặp sự cố khi điều kiện không được đáp ứng:

```go
b1:
    ...
    v22 (6) = LocalAddr <*[3]int> {arr} v2 v20
    v23 (6) = IsInBounds <bool> v21 v11
If v23 → b2 b3 (likely) (6)

b2: ← b1-
    v26 (6) = PtrIndex <*int> v22 v21
    v27 (6) = Copy <mem> v20
    v28 (6) = Load <int> v26 v27 (elem[int])
    ...
Ret v30 (+7)

b3: ← b1-
    v24 (6) = Copy <mem> v20
    v25 (6) = PanicBounds <mem> [0] v21 v11 v24
Exit v25 (6)
```

Trình biên dịch sẽ chuyển đổi lệnh `PanicBounds` thành hàm [`runtime.panicIndex`](https://draveness.me/golang/tree/runtime.panicIndex) được đề cập ở trên, khi chỉ số mảng không vượt qua ranh giới, trình biên dịch sẽ lấy địa chỉ bộ nhớ của mảng và chỉ số truy cập đầu tiên, sử dụng `PtrIndex` để tính toán địa chỉ của phần tử đích, và cuối cùng sử dụng thao tác `Load` để tải các phần tử tại con trỏ vào bộ nhớ.

Tất nhiên, chỉ khi trình biên dịch không thể đánh giá xem chỉ số mảng có vượt quá giới hạn hay không, lệnh `PanicBounds` sẽ được thêm vào và chuyển giao cho trình thực thi để phán đoán. Mã trung gian rất đơn giản được tạo khi sử dụng số nguyên để truy cập các chỉ số mảng. Khi chúng ta thay đổi arr[i] trong đoạn mã trên thành arr[2], chúng ta sẽ nhận được đoạn mã sau:

```go
b1:
    ...
    v21 (5) = LocalAddr <*[3]int> {arr} v2 v20
    v22 (5) = PtrIndex <*int> v21 v14
    v23 (5) = Load <int> v22 v20 (elem[int])
    ...
```

Ngôn ngữ Go vẫn có rất nhiều kiểm tra để truy cập mảng, nó sẽ không chỉ phát hiện trước một số lỗi ngoài giới hạn đơn giản trong quá trình biên dịch và gọi hàm chèn để phát hiện giới hạn trên của mảng, mà còn đảm bảo rằng hàm được chèn sẽ không xảy ra vi phạm ranh giới.

Các hoạt động gán và cập nhật của mảng `a[i] = 2` cũng sẽ tạo địa chỉ bộ nhớ của phần tử hiện tại của mảng được tính trong quá trình tạo SSA, sau đó sửa đổi nội dung của địa chỉ bộ nhớ hiện tại. Các câu lệnh gán này sẽ được chuyển đổi thành mã SSA sau:

```go
b1:
    ...
    v21 (5) = LocalAddr <*[3]int> {arr} v2 v19
    v22 (5) = PtrIndex <*int> v21 v13
    v23 (5) = Store <mem> {int} v22 v20 v19
    ...
```

Trong quá trình gán, địa chỉ của mảng mục tiêu sẽ được xác định trước, sau đó địa chỉ của phần tử mục tiêu sẽ được lấy thông qua `PtrIndex`, và cuối cùng dữ liệu sẽ được lưu trữ trong địa chỉ bằng cách sử dụng lệnh `Store`. Từ các mã SSA ở trên, chúng tôi có thể thấy rằng việc gán địa chỉ và gán mảng ở trên đều được thực hiện ở giai đoạn biên dịch, không có sự tham gia của runtime.

## 4. Tóm tắt

Mảng là một cấu trúc dữ liệu quan trọng trong ngôn ngữ Go. Hiểu cách triển khai của nó có thể giúp chúng ta hiểu rõ hơn về ngôn ngữ. Thông qua phân tích cách triển khai của nó, chúng ta biết rằng việc truy cập và gán mảng cần phụ thuộc vào cả trình biên dịch và runtime. Hầu hết các hoạt động của nó được chuyển đổi thành đọc và ghi trực tiếp bộ nhớ trong quá trình biên dịch([[Golang Compile Intro]]) và trong quá trình tạo mã trung gian, trình biên dịch cũng chèn lệnh gọi phương thức runtime  [`runtime.panicIndex`](https://draveness.me/golang/tree/runtime.panicIndex) để ngăn lỗi quá giới hạn.
