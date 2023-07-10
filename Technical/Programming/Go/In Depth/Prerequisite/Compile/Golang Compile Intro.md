---
title: Golang Compile Intro
date created: 2023-06-06
date modified: 2023-06-25
tags: [golang]
dg-publish: true
---

Ngôn ngữ Go là một ngôn ngữ lập trình đòi hỏi phải biên dịch để chạy, có nghĩa là mã cần phải tạo ra mã máy nhị phân thông qua trình biên dịch trước khi chạy, các tập tin có chứa mã máy nhị phân có thể chạy trên máy mục tiêu, nếu chúng ta muốn hiểu cách thực hiện ngôn ngữ Go, hiểu quá trình biên dịch của nó là một điều không thể bỏ qua.

Phần này sẽ cung cấp một cái nhìn tổng quan đầu tiên về quá trình biên dịch ngôn ngữ Go, giới thiệu một số bước được thực hiện bởi trình biên dịch từ cấp cao nhất, và các phần tiếp theo sẽ phân tích công việc và nguyên tắc thực hiện được thực hiện bởi mỗi bước riêng biệt, đồng thời giới thiệu một số kiến thức cần nắm vững trước để đảm bảo rằng các chương tiếp theo có thể được hiểu rõ hơn.

## 1. Chuẩn bị kiến thức

Để có được cái nhìn sâu sắc về quá trình biên dịch ngôn ngữ Go, bạn cần phải có một sự hiểu biết trước về một số thuật ngữ và chuyên môn liên quan đến quá trình biên dịch. Những kiến thức này thực sự khó sử dụng trong công việc hàng ngày và học tập hàng ngày của lệnh nhưng nó cũng rất quan trọng để hiểu quá trình biên dịch và nguyên tắc. Phần này sẽ đơn giản chọn một số khái niệm quan trọng để giới thiệu trước, giảm áp lực hiểu các chương tiếp theo.

### Abstract Syntax Tree

[Cây ngữ pháp trừu tượng](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (Abstract Syntax Tree, AST) là một đại diện trừu tượng của cấu trúc của cú pháp mã nguồn đại diện cho cấu trúc ngữ pháp của ngôn ngữ lập trình theo cách giống như cây. Mỗi nút trong cây ngữ pháp trừu tượng đại diện cho một yếu tố trong mã nguồn, mỗi cây con đại diện cho một yếu tố cú pháp, lấy biểu thức `2 * 3 + 7` làm ví dụ, giai đoạn phân tích cú pháp của trình biên dịch tạo ra một cây ngữ pháp trừu tượng được hiển thị trong hình dưới đây.

![Pasted image 20230606154747](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230606154747.png)

Là một cấu trúc dữ liệu thường được sử dụng bởi trình biên dịch (kể cả các ngôn ngữ khác), cây cú pháp trừu tượng xóa một số ký tự không quan trọng trong mã nguồn - dấu cách, dấu chấm phẩy hoặc dấu ngoặc đơn, v.v (tuỳ vào ngôn ngữ). Sau khi thực hiện phân tích cú pháp (syntax analysis), trình biên dịch sẽ xuất ra một cây ngữ pháp trừu tượng. Cây ngữ pháp trừu tượng sẽ hỗ trợ trình biên dịch để phân tích ngữ nghĩa (semantic analysis). Chúng ta có thể sử dụng nó để xác định xem có một số lỗi cú pháp trong chương trình hay không.

### Static Single Assignment

[Static Single Assignment - SSA](https://en.wikipedia.org/wiki/Static_single_assignment_form)là một tính năng của mã trung gian, và nếu mã trung gian có các đặc điểm của SSA, mỗi biến sẽ chỉ được gán một lần. Trong thực tế, chúng ta thường sử dụng subscript để triển khai SSA. dưới đây là một ví dụ về mã sau:

```go
x := 1
x := 2
y := x
```

Sau khi phân tích đơn giản, chúng ta có thể thấy rằng câu lệnh gán giá trị `x := 1` ở dòng đầu tiên của mã ở trên sẽ không làm gì. Dưới đây là mã trung gian với tính năng SSA, nơi chúng ta có thể thấy rõ rằng biến `y_1` không liên quan gì đến `x_1`, vì vậy bạn có thể tiết kiệm giá trị `x := 1` khi mã máy được tạo ra và tối ưu hóa mã bằng cách giảm các lệnh (instruction) cần được thực hiện.

```go
x_1 := 1
x_2 := 2
y_1 := x_2
```

Bởi vì vai trò chính của SSA là tối ưu hóa mã, nó là phần back-end của trình biên dịch. Tất nhiên, lĩnh vực biên dịch ngoài SSA có rất nhiều phương pháp tối ưu hóa mã trung gian, tối ưu hóa mã tạo trình biên dịch cũng là một lĩnh vực cũ và phức tạp, sẽ không được giới thiệu ở đây.

### Tập lệnh - Instruction Set

Một trong những kiến thức chuẩn bị cuối cùng để giới thiệu là tập lệnh - [Instruction Set](https://en.wikipedia.org/wiki/Instruction_set_architecture)Nhiều nhà phát triển sẽ gặp phải mã biên dịch và chạy bình thường trong môi trường phát triển cục bộ, nhưng không hoạt động đúng trong môi trường sản xuất, có nhiều lý do đằng sau vấn đề này, và các tập lệnh khác nhau được sử dụng bởi các máy khác nhau có thể là một trong những lý do.

Tôi sử dụng macbook x86_64 làm thiết bị chính để làm việc, nhập lệnh `uname -m` vào Terminal để có được thông tin phần cứng cho máy hiện tại:

```bash
$ uname -m
x86_64
```

x86 là một tập lệnh phổ biến hơn hiện nay, ngoài x86, còn có arm và các tập lệnh khác, chip tự nghiên cứu trên macbook mới nhất của Apple sử dụng tập lệnh arm, các bộ xử lý khác nhau sử dụng kiến trúc và ngôn ngữ máy khác nhau, vì vậy nhiều ngôn ngữ lập trình để chạy trên các máy khác nhau cần phải dịch mã nguồn theo sang mã máy dựa theo kiến trúc.

Complex Instruction Set Computer (CISC) và Reduced Instruction Set Computer (RISC) là hai tập lệnh tuân theo các khái niệm thiết kế khác nhau, từ tên, chúng ta có thể suy đoán sự khác biệt giữa hai tập lệnh:

- CISC: Giảm số lượng lệnh cần thực hiện bằng cách tăng loại hướng dẫn;
- RISC: Sử dụng ít loại hướng dẫn hơn để hoàn thành nhiệm vụ tính toán mục tiêu;

Để giảm số lượng lệnh ngôn ngữ máy, CPU đời đầu thường sử dụng Complex Instuction Set để hoàn thành nhiệm vụ tính toán, cả hai đều không có ưu và nhược điểm tuyệt đối, chúng chỉ đơn giản là trong một số lựa chọn thiết kế khác nhau để đạt được các mục đích khác nhau, chúng ta sẽ chi tiết kiến trúc tập lệnh trong phần [[Golang Machine Code]] tiếp theo, nhưng độc giả cũng có thể chủ động tìm hiểu nội dung có liên quan.

## 2. Nguyên tắc biên dịch

Mã nguồn của trình biên dịch ngôn ngữ Go nằm trong thư mục [`src/cmd/compile`](https://github.com/golang/go/tree/master/src/cmd/compile), các tệp trong thư mục cùng nhau tạo thành trình biên dịch ngôn ngữ Go, những người đã học được nguyên tắc biên dịch có thể đã nghe nói về frontend và backend của trình biên dịch, frontend của trình biên dịch thường chịu trách nhiệm phân tích từ ngữ, phân tích cú pháp, kiểm tra loại và tạo mã trung gian để tạo ra một số phần công việc, trong khi backend của trình biên dịch chủ yếu chịu trách nhiệm tạo và tối ưu hóa mã mục tiêu, đó là, dịch mã trung gian sang mã máy nhị phân mà máy mục tiêu có thể chạy.

![Pasted image 20230606161321](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230606161321.png)

### Lexical and Syntax Analysis

Tất cả các quá trình biên dịch thực sự bắt đầu với phân tích từ (lexical analysis) các tập tin mã nguồn, vai trò của phân tích từ là phân rã các tập tin mã nguồn, nó chuyển đổi chuỗi trong tập tin thành chuỗi Token, thuận tiện cho việc xử lý và phân tích sau này, chúng ta gọi chương trình thường sẽ thực hiện phân tích từ là trình phân tích từ (lexer).

Và đầu vào của phân tích cú pháp (syntax analysis) là chuỗi Token đầu ra của trình phân tích từ (lexical analysis), phân tích cú pháp sẽ phân tích chuỗi Token theo thứ tự. Theo thông số kỹ thuật sau, mỗi tệp mã nguồn Go cuối cùng sẽ được tóm tắt thành cấu trúc  [SourceFile](https://golang.org/ref/spec#Source_file_organization)

```go
SourceFile = PackageClause ";" { ImportDecl ";" } { TopLevelDecl ";" } .
```

Phân tích từ trả về một chuỗi Token không chứa dấu cách, ngắt dòng, v.v., chẳng hạn như: `package`, `json`, `import`, `(`, `io`, `)`,…, trong khi phân tích cú pháp chuyển đổi chuỗi Token thành một cấu trúc có ý nghĩa, cụ thể là Abstract Syntax Tree:

```go
"json.go": SourceFile {
    PackageName: "json",
    ImportDecl: []Import{
        "io",
    },
    TopLevelDecl: ...
}
```

Quá trình chuyển đổi token sang abstract syntax tree (AST) ở trên sử dụng trình phân tích cú pháp, mỗi Abstract Syntax Tree tương ứng với một tệp ngôn ngữ Go riêng biệt, bao gồm tên gói, hằng số được xác định, cấu trúc và hàm mà tệp hiện tại thuộc về.

> Trình phân tích cú pháp cho ngôn ngữ Go sử dụng LALR(1). Độc giả quan tâm đến phương pháp phân tích cú pháp có thể tìm thấy các tài liệu liên quan đến phương pháp biên dịch trong các bài đọc được đề xuất.

![Pasted image 20230606162919](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230606162919.png)

Bất kỳ lỗi cú pháp nào xảy ra trong quá trình phân tích cú pháp sẽ được phát hiện bởi trình phân tích cú pháp và in tin nhắn ra đầu ra tiêu chuẩn (standard output), và toàn bộ quá trình biên dịch sẽ bị dừng khi lỗi xảy ra. Phần [[Golang Lexer and Parser]] chi tiết quá trình phân tích ngữ pháp, phân tích từ pháp và cú pháp của ngôn ngữ Go.

### Type Check

Khi bạn nhận được một tập hợp các tệp của cây ngữ pháp trừu tượng, trình biên dịch ngôn ngữ Go kiểm tra các kiểu dữ liệu được xác định và sử dụng trong cây cú pháp, xác minh và xử lý các loại nút khác nhau theo thứ tự sau:

1. constant, type and function name and type
2. variable assignment and initialization
3. bodies of function and closure
4. type of the key-value in hash map
5. import function body
6. external statement

Bằng cách duyệt toàn bộ AST, chúng ta xác minh loại cây con hiện tại trên mỗi nút để đảm bảo rằng không có type error trong nút. Tất cả các type error sẽ bị khám xét ở giai đoạn này, bao gồm: việc triển khai `interface` của `struct`.

Giai đoạn type check không chỉ xác minh kiểu của nút, mà còn mở rộng và viết lại một số hàm tích hợp, chẳng hạn như từ khóa `make` được thay thế bằng các hàm như `runtime.makeslice` hoặc `runtime.makechan` ở giai đoạn này dựa trên cấu trúc của cây con.

![Pasted image 20230606194704](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230606194704.png)

### Intermediate Code Generation

Khi chúng ta chuyển đổi Source Code thành AST, phân tích cú pháp của toàn bộ cây và kiểm tra loại, bạn có thể nghĩ rằng mã trong tệp hiện tại không có lỗi cú pháp (syntax error) và lỗi kiểu dữ liệu (type error), trình biên dịch ngôn ngữ Go sẽ chuyển đổi Abstract Syntax Tree thành mã trung gian.

Sau khi kiểm tra kiểu, trình biên dịch biên dịch tất cả các hàm trong toàn bộ dự án ngôn ngữ Go thông qua `cmd/compile/internal/gc.compileFunctions`. Những hàm này chờ đợi một vài Goroutine được xử lý trong một hàng đợi biên dịch và Goroutine được thực thi đồng thời chuyển đổi Abstract Syntax Tree tương ứng với tất cả các hàm thành mã trung gian.

![Pasted image 20230606200337](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230606200337.png)

Vì mã trung gian của trình biên dịch ngôn ngữ Go sử dụng các tính năng của SSA, ở giai đoạn này, chúng ta có thể phân tích các biến và mảnh vô dụng trong mã và tối ưu hóa mã. Chi tiết quá trình tạo mã trung gian và mô tả ngắn gọn các tính năng SSA của mã trung gian ngôn ngữ Go ở phần [[Golang IR SSA]].

### Machine Code Generation

Thư mục [`src/cmd/compile/internal`](https://github.com/golang/go/tree/master/src/cmd/compile/internal) của mã nguồn ngôn ngữ Go chứa nhiều gói liên quan đến tạo mã máy, với các loại CPU khác nhau tạo mã máy bằng các gói khác nhau, bao gồm amd64, arm, arm64, mips, mips64, ppc64, s390x, x86 và wasm. Điều thú vị là trong đó có có WebAssembly (wasm).

Là một binary instruction format được sử dụng trên stack virtual machine, mục tiêu thiết kế chính của nó là cung cấp một ngôn ngữ có tính di động cao trên trình duyệt web. Trình biên dịch ngôn ngữ Go có thể tạo ra các lệnh ở định dạng wasm, sau đó nó có thể chạy trong các trình duyệt phổ biến.

```bash
$ GOARCH=wasm GOOS=js go build -o lib.wasm main.go
```

Chúng ta có thể sử dụng các lệnh trên để biên dịch mã nguồn của Go để có thể chạy các tệp WebAssembly trên trình duyệt, tất nhiên, ngoài binary instruction format mới nổi này, ngôn ngữ Go có thể chạy trên hầu như tất cả các máy tính, nhưng khả năng tương thích của nó có thể có một số vấn đề với các máy ngoại trừ Linux và Darwin, chẳng hạn như Go Plugin vẫn không hỗ trợ Windows.

![Pasted image 20230606204038](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230606204038.png)

Chi tiết quá trình dịch mã trung gian sang các mã máy mục tiêu khác nhau ở  [[Golang Machine Code]], trong đó cũng sẽ giới thiệu ngắn gọn sự khác biệt giữa các kiến trúc tập lệnh khác nhau.

## 3. Compiler

Trình biên dịch ngôn ngữ Go nằm trong tệp [`src/cmd/compile/internal/gc/main.go`](https://github.com/golang/go/blob/master/src/cmd/compile/internal/gc/main.go), trong đó hàm Main là chương trình chính của trình biên dịch ngôn ngữ Go, hàm này sẽ lấy các tham số dòng lệnh đầu vào và cấu hình các tùy chọn biên dịch,sau đó thực hiện phân tích từ và phân tích cú pháp cho các tệp đã nhập để có được Abstract Syntax Tree tương ứng:

```go
func Main(archInit func(*ssagen.ArchInfo)) {
	...
}
```

Sau khi Abstract Syntax Tree được xây, nó sẽ được biên dịch trong chín giai đoạn, như chúng ta đã giới thiệu ở trên, Abstract Syntax Tree trải qua ba giai đoạn type check, SSA Intermidate Code Gen và Machine Code Gen:

1. Check the types of constants, types and functions;
2. Handle assignment of variables;
3. Type checking the body of the function;
4. Decide how to capture variables;
5. Check the type of the inline function;
6. Perform escape analysis;
7. Convert the body of the closure into a referenced capture variable;
8. Compile top-level functions;
9. Check the declaration of external dependencies;

Sau khi có một sự hiểu biết cấp cao nhất về toàn bộ quá trình biên dịch, chúng ta quay trở lại quá trình cụ thể sau khi phân tích từ và cú pháp, nơi trình biên dịch thực hiện kiểm tra kiểu dữ liệu các nút trong AST, ngoài các khai báo cấp cao nhất như `const`, `type` và `func`, nó sẽ kiểm tra các câu lệnh gán giá trị cho biến, thân hàm và các cấu trúc khác:

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
```

Type Check sẽ đi qua tất cả các nút con của nút hiện tại, quá trình này sẽ mở rộng và chuyển đổi các từ khóa như `make`, type check sẽ thay đổi một số nút trong AST, sẽ không tạo ra các biến mới hoặc cây cú pháp, sự kết thúc của quá trình này cũng có nghĩa là không có lỗi cú pháp và kiểu trong mã nguồn, mã trung gian và mã máy có thể được tạo ra bình thường theo Abstract Syntax Tree.

```go
	initssaconfig()

	peekitabs()

	for i := 0; i < len(xtop); i++ {
		n := xtop[i]
		if n.Op == ODCLFUNC {
			funccompile(n)
		}
	}

	compileFunctions()

	for i, n := range externdcl {
		if n.Op == ONAME {
			externdcl[i] = typecheck(externdcl[i], ctxExpr)
		}
	}

	checkMapKeys()
}
```

Vào cuối chương trình `Main`, trình biên dịch biên dịch các hàm cấp cao nhất thành mã trung gian và tạo mã máy dựa trên kiến trúc CPU mục tiêu, mặc dù ở giai đoạn này cũng có thể kiểm tra loại phụ thuộc bên ngoài một lần nữa để xác minh tính chính xác của nó.

## 4. Review

Quá trình biên dịch ngôn ngữ Go là rất thú vị và đáng học hỏi, thông qua phân tích bốn giai đoạn biên dịch của ngôn ngữ Go và chải các chức năng chính của trình biên dịch, chúng ta có thể có một số sự hiểu biết cơ bản về việc thực hiện ngôn ngữ Go, sau khi nắm vững quá trình biên dịch, ngôn ngữ Go không còn quá khó cho chúng ta, vì vậy quá trình học nguyên tắc biên dịch của nó vẫn còn rất hấp dẫn.
