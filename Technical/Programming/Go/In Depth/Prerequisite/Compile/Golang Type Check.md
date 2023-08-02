---
categories: 
title: Golang Type Check
date created: 2023-06-06
date modified: 2023-08-02
tags: [golang]
dg-publish: true
---

Chúng tôi đã giới thiệu giai đoạn đầu tiên của biên dịch ngôn ngữ Go trong phần trước [[Golang Lexer and Parser]], - AST được thực xây dựng. Tiếp tục với giai đoạn tiếp theo của việc thực thi trình biên dịch - kiểm tra kiểu.

Đề cập đến các hệ thống kiểu kiểm tra kiểu và ngôn ngữ lập trình, nhiều bạn có thể nghĩ đến một số thuật ngữ hơi mơ hồ và khó hiểu: kiểu mạnh, kiểu yếu, kiểu tĩnh và kiểu động. Nhưng bây giờ chúng ta phải nói về quá trình kiểm tra kiểu cura trình biên dịch ngôn ngữ Go, chúng ta sẽ hoàn toàn tìm ra ý nghĩa của những kiểu này và tương tự.

## 1. Strong and Weak Type

[Strong and weak type](https://en.wikipedia.org/wiki/Strong_and_weak_typing)thường được thảo luận với nhau, nhưng cả hai đều không có một định nghĩa học thuật nghiêm ngặt, truy cập nhiều tài liệu hơn để hiểu lại trở khó hiểu hơn, nhiều tài liệu thậm chí mâu thuẫn với nhau.

![Pasted image 20230607005421](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230607005421.png)

Do sự không đầy đủ của định nghĩa của thẩm quyền, đối với các kiểu mạnh hay yếu, nhiều lần chúng ta chỉ có thể dựa trên hiện tượng và đặc điểm từ trực giác để đánh giá, nói chung sẽ có kết luận sau đây：

- Các ngôn ngữ lập trình kiểu mạnh có những hạn chế kiểu nghiêm ngặt hơn trong quá trình biên dịch, tức là trình biên dịch sẽ tìm thấy type error khi gán biến, giá trị trả về và gọi hàm trong quá trình biên dịch;
- Các ngôn ngữ lập trình kiểu yếu có thể thực hiện chuyển đổi kiểu ngầm tại runtime khi gặp type error và có thể gây ra lỗi chạy khi chuyển đổi kiểu.

Dựa trên kết luận trên, chúng ta có thể nghĩ rằng Java, C# và các ngôn ngữ lập trình khác thực hiện kiểm tra kiểu trong quá trình biên dịch là các kiểu mạnh. Tương tự như vậy, bởi vì ngôn ngữ Go tìm thấy type error trong quá trình biên dịch, nó nên là một kiểu ngôn ngữ lập trình mạnh.

Nếu định nghĩa khái niệm của các kiểu mạnh và yếu không nghiêm ngặt và mơ hồ, thì về mặt khái niệm, bản thân nó không có nhiều giá trị thực tế, ít nhất là ít hữu ích cho việc chúng ta thực sự sử dụng và hiểu ngôn ngữ lập trình. Câu hỏi đặt ra, như một định nghĩa trừu tượng, chúng ta sử dụng nó để làm gì? Câu trả thường là sự tiện lợi của kiện giao tiếp và phân lớp giữa các kiểu. Hãy bỏ qua các kiểu mạnh hay yếu và tập trung nhiều hơn vào các câu hỏi sau:

- Chuyển đổi kiểu là rõ ràng hay ngầm?
- Trình biên dịch có giúp chúng ta suy ra kiểu biến không?

Những vấn đề cụ thể này thực sự có giá trị hơn trong bối cảnh này, và hy vọng rằng độc giả có thể giảm tranh chấp về các kiểu mạnh và kiểu yếu.

## 2. Static and Dynamic Type

Các ngôn ngữ lập trình kiểu tĩnh (static) và kiểu động (dynamic) thực sự là không chính xác. Chính xác nên là ngôn ngữ lập trình sử dụng [Static Type Checking](https://en.wikipedia.org/wiki/Type_system#Static_type_checking) và [Dynamic Type Checking](https://en.wikipedia.org/wiki/Type_system#Dynamic_type_checking_and_runtime_type_information), phần này giới thiệu các đặc điểm của hai kiểu kiểm tra và sự khác biệt của chúng.

### Static Type Checking

**Static Type Checking**: Kiểm tra kiểu tĩnh là một quá trình dựa trên phân tích mã nguồn để xác định kiểu chương trình chạy an toàn. Nếu mã của chúng tôi có thể vượt qua kiểm tra kiểu tĩnh, chương trình hiện tại có thể đáp ứng các yêu cầu bảo mật kiểu ở một mức độ nào đó, nó có thể làm giảm kiểm tra kiểu chương trình tại runtime hoặc có thể được coi là một cách để tối ưu hóa mã.

Là một developer, kiểm tra kiểu tĩnh có thể giúp chúng tôi phát hiện ra type error xảy ra trong quá trình biên dịch và một số ngôn ngữ lập trình kiểu động có các công cụ được cung cấp bởi cộng đồng để thêm kiểm tra kiểu tĩnh cho các ngôn ngữ lập trình này, chẳng hạn như [Flow](https://flow.org/) cho JavaScript, những công cụ này có thể phát hiện type error trong mã trong quá trình biên dịch.

Tôi tin rằng rất nhiều độc giả cũng đã nghe nói "Dynamic type is cool for a while, code refactoring crematorium". Các developer sử dụng Python, Ruby và các ngôn ngữ lập trình khác phải có kinh nghiệm sâu sắc về cụm từ này, kiểu tĩnh cung cấp những hạn chế cho mã trong quá trình biên dịch, trình biên dịch có thể hạn chế các kiểu biến trong quá trình biên dịch.

Kiểm tra kiểu tĩnh có thể giúp chúng tôi tiết kiệm rất nhiều thời gian và tránh bỏ lỡ khi tái cấu trúc, nhưng nếu ngôn ngữ lập trình chỉ hỗ trợ kiểm tra kiểu động, bạn sẽ cần phải viết một số lượng lớn các unit test để đảm bảo rằng việc tái cấu trúc không gặp type error. Tất nhiên ở đây không phải là thử nghiệm không quan trọng, **bất kỳ mã nào cũng nên có một bài kiểm tra tốt**, điều này không liên quan nhiều đến ngôn ngữ.

### Dynamic Type Checking

**Dynamic Type Checking**: Kiểm tra kiểu động là quá trình xác định kiểu chương trình an toàn tại runtime, đòi hỏi ngôn ngữ lập trình thêm thông tin như nhãn kiểu cho tất cả các đối tượng tại thời điểm biên dịch và runtime có thể sử dụng thông tin kiểu được lưu trữ này để dynamic dispatch, downcasting, reflection và các tính năng khác.  Kiểm tra kiểu động cung cấp cho các kỹ sư nhiều không gian hoạt động hơn, cho phép chúng tôi có được một số ngữ cảnh liên quan đến kiểu và thực hiện một số hành động động dựa trên kiểu đối tượng tại runtime.

Các ngôn ngữ lập trình chỉ sử dụng kiểm tra kiểu động được gọi là ngôn ngữ lập trình kiểu động, các ngôn ngữ lập trình kiểu động phổ biến bao gồm JavaScript, Ruby và PHP, mặc dù các ngôn ngữ lập trình này rất linh hoạt trong sử dụng và không cần phải được biên dịch, mã có vấn đề sẽ không làm giảm lỗi vì tính linh hoạt hơn, lỗi vẫn có thể chạy. Trong khi tăng tính linh hoạt, chúng cũng tăng yêu cầu chất lượng kỹ sư.

### Summary

Kiểm tra kiểu tĩnh và kiểm tra kiểu động không hoàn toàn xung đột và đối lập, nhiều ngôn ngữ lập trình sử dụng cả hai kiểu kiểm tra cùng một lúc, chẳng hạn như Java không chỉ kiểm tra type error trước trong quá trình biên dịch, mà còn thêm thông tin kiểu cho các đối tượng, sử dụng reflect tại runtime để tự động thực thi hàm theo kiểu đối tượng để tăng tính linh hoạt và giảm mã dự phòng.

## 3. Execution process

Trình biên dịch ngôn ngữ Go không chỉ sử dụng kiểm tra kiểu tĩnh để giữ an toàn cho kiểu chương trình chạy, mà còn giới thiệu thông tin kiểu trong quá trình lập trình, cho phép các kỹ sư sử dụng reflect để xác định kiểu tham số và biến. Khi chúng tôi muốn chuyển đổi `interface{}` thành một kiểu cụ thể, chúng tôi thực hiện kiểm tra kiểu động và nếu không có chuyển đổi xảy ra, chương trình sụp đổ.

Ở đây chúng tôi sẽ tập trung vào việc kiểm tra kiểu tĩnh trong quá trình biên dịch, và trong [[Golang Compile Intro]], chúng tôi đã giới thiệu [`cmd/compile/internal/gc.Main`](https://draveness.me/golang/tree/cmd/compile/internal/gc.Main), một trong số đó là như thế này:

```go
	for i := 0; i < len(xtop); i++ {
		n := xtop[i]
		if op := n.Op; op != ODCL && op != OAS && op != OAS2 && (op != ODCLTYPE || !n.Left.Name.Param.Alias) {
			xtop[i] = typecheck(n, ctxStmt)
		}
	}

	for i := 0; i < len(xtop); i++ {
		n := xtop[i]
		if op := n.Op; op == ODCL || op == OAS || op == OAS2 || op == ODCLTYPE && n.Left.Name.Param.Alias {
			xtop[i] = typecheck(n, ctxStmt)
		}
	}

	...

	checkMapKeys()
```

Quá trình thực hiện mã này có thể được chia thành hai phần, bắt đầu bằng cách kiểm tra constant, type, function declaration, and variable assignment statement thông qua hàm [`cmd/compile/internal/gc.typecheck`](https://draveness.me/golang/tree/cmd/compile/internal/gc.typecheck). Sau đó sử dụng [`cmd/compile/internal/gc.checkMapKeys`](https://draveness.me/golang/tree/cmd/compile/internal/gc.checkMapKeys) để kiểm tra kiểu hash map key, chúng tôi sẽ phân tích nguyên tắc thực hiện mã trên trong một số phần.

Logic chính của kiểm tra kiểu trình biên dịch đều ở [`cmd/compile/internal/gc.typecheck`](https://draveness.me/golang/tree/cmd/compile/internal/gc.typecheck) và [`cmd/compile/internal/gc.typecheck1`](https://draveness.me/golang/tree/cmd/compile/internal/gc.typecheck1). Điều này trong[`cmd/compile/internal/gc.typecheck`](https://draveness.me/golang/tree/cmd/compile/internal/gc.typecheck) không phải là nhiều, nó sẽ làm một số kiểu kiểm tra trước khi chuẩn bị. Logic cốt lõi nằm trong [`cmd/compile/internal/gc.typecheck1`](https://draveness.me/golang/tree/cmd/compile/internal/gc.typecheck1), một hàm 2000 dòng switch/case:

```go
func typecheck1(n *Node, top int) (res *Node) {
	switch n.Op {
	case OTARRAY:
		...

	case OTMAP:
		...

	case OTCHAN:
		...
	}

	...

	return n
}
```

[`cmd/compile/internal/gc.typecheck1`](https://draveness.me/golang/tree/cmd/compile/internal/gc.typecheck1) vào các nhánh khác nhau dựa trên kiểu nút đến Op, bao gồm hơn 150 kiểu thao tác như nhân cộng và trừ, nhân, chia, function call, method call, v.v., vì có rất nhiều kiểu nút, vì vậy chỉ có một vài trường hợp điển hình được trích dẫn để phân tích chuyên sâu ở đây.

### Slice OTARRAY

Nếu kiểu hoạt động của nút hiện tại là `OTARRAY`, nhánh này bắt đầu bằng cách kiểm tra kiểu các nút bên phải, cụ thể là kiểu các yếu tố `slice` hoặc `array`:

```go
	case OTARRAY:
		r := typecheck(n.Right, Etype)
		if r.Type == nil {
			n.Type = nil
			return n
		}
```

[`cmd/compile/internal/gc.Node`](https://draveness.me/golang/tree/cmd/compile/internal/gc.Node), tức là ba cách khai báo khác nhau `[]int`,`[…]int` và `[3]int`. Kiểu đầu tiên tương đối đơn giản, sẽ gọi [`cmd/compile/internal/types.NewSlice`](https://draveness.me/golang/tree/cmd/compile/internal/types.NewSlice)：

```go
		if n.Left == nil {
			t = types.NewSlice(r.Type)
```

[`cmd/compile/internal/types.NewSlice`](https://draveness.me/golang/tree/cmd/compile/internal/types.NewSlice) trả về trực tiếp một struct kiểu `TSLICE` và thông tin kiểu phần tử được lưu trữ trong struct. Khi gặp `[…]int`, kiểu mảng này được xử lý bởi [`cmd/compile/internal/gc.typecheckcomplit`](https://draveness.me/golang/tree/cmd/compile/internal/gc.typecheckcomplit):

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
}
```

Cuối cùng, nếu mã nguồn chứa kích thước của mảng, [`cmd/compile/internal/types.NewArray`](https://draveness.me/golang/tree/cmd/compile/internal/types.NewArray) khởi tạo một cấu trúc lưu trữ kiểu phần tử mảng và kích thước mảng:

```go
		} else {
			n.Left = indexlit(typecheck(n.Left, ctxExpr))
			l := n.Left
			v := l.Val()
			bound := v.U.(*Mpint).Int64()
			t = types.NewArray(r.Type, bound)		}

		n.Op = OTYPE
		n.Type = t
		n.Left = nil
		n.Right = nil
```

Ba nhánh khác nhau xử lý các hình thức khác nhau của khai báo `array` và `slice`, mỗi nhánh được cập nhật [`cmd/compile/internal/gc.Node`](https://draveness.me/golang/tree/cmd/compile/internal/gc.Node) Các kiểu được lưu trữ trong cấu trúc Node và sửa đổi nội dung trong cây cú pháp trừu tượng. Thông qua phân tích của clip này, chúng tôi thấy rằng độ dài của mảng được xác định trong quá trình kiểm tra kiểu, trong khi `[…]int` thức khai báo này của int cũng chỉ là đường ngữ pháp mà ngôn ngữ Go cung cấp cho chúng tôi.

### Hash OTMAP

Nếu các nút được xử lý là hash, trình biên dịch kiểm tra các kiểu giá trị key của hash riêng biệt để xác minh tính hợp lệ của các kiểu của chúng:

```go
	case OTMAP:
		n.Left = typecheck(n.Left, Etype)
		n.Right = typecheck(n.Right, Etype)
		l := n.Left
		r := n.Right
		n.Op = OTYPE
		n.Type = types.NewMap(l.Type, r.Type)
		mapqueue = append(mapqueue, n)
		n.Left = nil
		n.Right = nil
```

Gần như giống hệt với khi xử lý slice, nó sẽ đi qua [`cmd/compile/internal/types.NewMap`](https://draveness.me/golang/tree/cmd/compile/internal/types.NewMap) tạo ra một cấu trúc `TMAP` mới và lưu kiểu key-value vào cấu trúc đó:

```go
func NewMap(k, v *Type) *Type {
	t := New(TMAP)
	mt := t.MapType()
	mt.Key = k
	mt.Elem = v
	return t
}
```

Các nút đại diện cho hash hiện tại cuối cùng cũng sẽ được thêm vào hàng đợi `mapqueue`, và trình biên dịch sẽ kiểm tra lại kiểu hash key ở giai đoạn sau, trong khi kiểm tra kiểu key thực sự được gọi là hàm [`cmd/compile/internal/gc.checkMapKeys`](https://draveness.me/golang/tree/cmd/compile/internal/gc.checkMapKeys) được đề cập ở trên:

```go
func checkMapKeys() {
	for _, n := range mapqueue {
		k := n.Type.MapType().Key
		if !k.Broke() && !IsComparable(k) {
			yyerrorl(n.Pos, "invalid map key type %v", k)
		}
	}
	mapqueue = nil
}
```

Hàm này đi qua các nút đang chờ kiểm tra trong hàng đợi `mapqueue` để xác định xem các kiểu này có thể hoạt động như các hash key hay không và nếu kiểu hiện tại không hợp lệ, nó sẽ trực tiếp báo lỗi cho toàn bộ quá trình kiểm tra trong giai đoạn kiểm tra kiểu.

### Keyword OMAKE 

Cuối cùng, giới thiệu `make` một hàm tích hợp phổ biến trong ngôn ngữ Go, trước giai đoạn kiểm tra kiểu, cho dù đó là slice, hash hoặc channel sử dụng từ khóa `make`, nhưng trong giai đoạn kiểm tra kiểu  `make` sẽ bị thay thay thế bằng một hàm cụ thể dựa trên kiểu được tạo ra và quá trình tạo mã trung gian ([[Golang IR SSA]]) sau này sẽ không còn `OMAKE`. Các nút của kiểu `OMAKE` được xử lý dựa trên kiểu phân đoạn được tạo ra:

![Pasted image 20230607005413](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230607005413.png)

Trình biên dịch kiểm tra lần đầu các tham số kiểu đầu tiên của `make`, đi vào các nhánh khác nhau tùy thuộc vào kiểu, các nhánh slice `TSLICE`, nhánh hash `TMAP` và nhánh channel `TCHAN`:

```go
	case OMAKE:
		args := n.List.Slice()

		n.List.Set(nil)
		l := args[0]
		l = typecheck(l, Etype)
		t := l.Type

		i := 1
		switch t.Etype {
		case TSLICE:
			...

		case TMAP:
			...

		case TCHAN:
			...
		}

		n.Type = t
```

Nếu tham số đầu tiên của `make` là kiểu slice, bạn sẽ lấy độ dài `len` của slice và dung lượng `cap` từ các tham số và kiểm tra cả hai tham số, bao gồm:

1. Cho dù các tham số chiều dài của slice được truyền vào;
2. Chiều dài của slice phải nhỏ hơn hoặc bằng dung lượng của slice

```go
		case TSLICE:
			if i >= len(args) {
				yyerror("missing len argument to make(%v)", t)
				n.Type = nil
				return n
			}

			l = args[i]
			i++
			l = typecheck(l, ctxExpr)
			var r *Node
			if i < len(args) {
				r = args[i]
				i++
				r = typecheck(r, ctxExpr)
			}

			if Isconst(l, CTINT) && r != nil && Isconst(r, CTINT) && l.Val().U.(*Mpint).Cmp(r.Val().U.(*Mpint)) > 0 {
				yyerror("len larger than cap in make(%v)", t)
				n.Type = nil
				return n
			}

			n.Left = l
			n.Right = r
			n.Op = OMAKESLICE
```

Ngoài việc kiểm tra số lượng và tính hợp lệ của các tham số, mã này cuối cùng sẽ thay đổi op hoạt động của nút hiện tại thành `OMAKESLICE` để tạo điều kiện xử lý giai đoạn biên dịch tiếp theo.

Trường hợp thứ hai là tham số đầu tiên của `make` là kiểu `map`, trong trường hợp đó tham số tùy chọn thứ hai là kích thước ban đầu của hash, theo mặc định kích thước của nó là 0 và nhánh hiện tại cuối cùng sẽ thay đổi thuộc tính Op của nút hiện tại:

```go
		case TMAP:
			if i < len(args) {
				l = args[i]
				i++
				l = typecheck(l, ctxExpr)
				l = defaultlit(l, types.Types[TINT])
				if !checkmake(t, "size", l) {
					n.Type = nil
					return n
				}
				n.Left = l
			} else {
				n.Left = nodintconst(0)
			}
			n.Op = OMAKEMAP
```

Cấu trúc cuối cùng mà hàm tích hợp `make` có thể khởi tạo là Channel ([[Golang Channel]]), từ mã sau đây, chúng ta có thể thấy rằng tham số thứ hai đại diện cho kích thước bộ đệm của Channel, và nếu không có tham số thứ hai, channel có kích thước bộ đệm là 0:

```go
		case TCHAN:
			l = nil
			if i < len(args) {
				l = args[i]
				i++
				l = typecheck(l, ctxExpr)
				l = defaultlit(l, types.Types[TINT])
				if !checkmake(t, "buffer", l) {
					n.Type = nil
					return n
				}
				n.Left = l
			} else {
				n.Left = nodintconst(0)
			}
			n.Op = OMAKECHAN
```

Trong quá trình kiểm tra kiểu, bất kể kiểu tham số đầu tiên của `make`, kiểu Op của nút hiện tại được sửa đổi và một số xác minh về tính hợp lệ của các tham số đến.

## 4. Review

Kiểm tra kiểu là giai đoạn thứ hai của biên dịch ngôn ngữ Go, sau khi phân tích từ và ngữ pháp, chúng tôi nhận được AST tương ứng với mỗi tập tin, sau đó kiểm tra kiểu sẽ đi qua các nút trong cây ngữ pháp trừu tượng, kiểm tra kiểu của mỗi nút, tìm ra lỗi ngữ pháp tồn tại trong đó, trong quá trình này cũng có thể viết lại AST, điều này không chỉ có thể loại bỏ một số mã sẽ không được thực thi, tối ưu hóa mã để cải thiện hiệu quả thực thi, mà còn sửa đổi `make` , `new` và các từ khóa khác tương ứng với kiểu hoạt động của nút.

`make` và `new` các chức năng tích hợp này thực sự không tương ứng trực tiếp với việc thực hiện một số chức năng nhất định, chúng sẽ được chuyển đổi thành các hàm khác thực sự tồn tại trong quá trình biên dịch, và chúng tôi sẽ mô tả những gì trình biên dịch đã làm cho chúng trong phần tiếp theo của tạo mã trung gian ([[Golang IR SSA]]).
