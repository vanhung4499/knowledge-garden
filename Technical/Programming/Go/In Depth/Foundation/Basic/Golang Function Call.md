---
title: Golang Function Call
date created: 2023-07-01
date modified: 2023-07-01
tags: [golang]
---

Hàm là một yếu tố quan trọng trong Go, và hiểu và nắm vững quy trình gọi hàm là điều không thể bỏ qua khi học sâu về Go. Phần này sẽ giới thiệu quy ước gọi hàm và phương pháp truyền tham số của hàm.

## Quy ước gọi hàm

Dù là ngôn ngữ lập trình hệ thống như C và Go, hay là ngôn ngữ kịch bản như Ruby và Python, các ngôn ngữ này thường sử dụng cú pháp tương tự khi gọi hàm:

```c
somefunction(arg0, arg1)
```

Mặc dù cú pháp gọi hàm tương tự, nhưng quy ước gọi hàm có thể khác nhau. Quy ước gọi hàm là các quy tắc mà bên gọi và bên được gọi thống nhất về cách truyền tham số và trả về giá trị. Trong phần này, chúng ta sẽ tìm hiểu về quy ước gọi hàm trong C và Go.

### Ngôn ngữ C

Trước tiên, chúng ta sẽ tìm hiểu quy ước gọi hàm trong ngôn ngữ C. Một cách tốt nhất để hiểu quy ước gọi hàm là biên dịch mã C thành mã hợp ngữ bằng  [gcc](https://gcc.gnu.org/) hoặc [clang](https://clang.llvm.org/) và phân tích quy ước gọi hàm từ mã hợp ngữ. Từ mã hợp ngữ, chúng ta có thể hiểu quy trình gọi hàm cụ thể.

Biên dịch cùng một mã ngôn ngữ C với gcc và clang có thể tạo ra các hướng dẫn hợp ngữ khác nhau, nhưng mã được tạo sẽ không có nhiều khác biệt về cấu trúc, vì vậy nó không ảnh hưởng nhiều đến những người chỉ muốn hiểu quy ước gọi. Tác giả chọn sử dụng trình biên dịch gcc để biên dịch ngôn ngữ C trong phần này:

```bash
$ gcc --version
gcc (Ubuntu 4.8.2-19ubuntu1) 4.8.2
Copyright (C) 2013 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```

Chúng ta sẽ sử dụng trình biên dịch gcc để biên dịch mã C sau đây thành mã hợp ngữ:

```c
int my_function(int arg1, int arg2) {
    return arg1 + arg2;
}

int main() {
    int i = my_function(1, 2);
}
```

Chúng ta có thể sử dụng lệnh `gcc -S my_function.c` để biên dịch tệp tin trên thành mã hợp ngữ như sau:

```c
main:
    pushq	%rbp
    movq	%rsp, %rbp
    subq	$16, %rsp
    movl	$2, %esi  // Thiết lập tham số thứ hai
    movl	$1, %edi  // Thiết lập tham số thứ nhất
    call	my_function
    movl	%eax, -4(%rbp)
my_function:
    pushq	%rbp
    movq	%rsp, %rbp
    movl	%edi, -4(%rbp)    // Lấy tham số thứ nhất và đặt vào ngăn xếp
    movl	%esi, -8(%rbp)    // Lấy tham số thứ hai và đặt vào ngăn xếp
    movl	-8(%rbp), %eax    // eax = esi = 1
    movl	-4(%rbp), %edx    // edx = edi = 2
    addl	%edx, %eax        // eax = eax + edx = 1 + 2 = 3
    popq	%rbp
```

Chúng ta có thể phân tích quy trình gọi hàm theo thứ tự trước, trong và sau khi gọi hàm:

- Trước khi gọi `my_function`, hàm gọi `main` sẽ lưu hai tham số của `my_function` vào các thanh ghi `edi` và `esi`.
- Khi gọi `my_function`, nó sẽ lưu dữ liệu từ các thanh ghi edi và esi vào các thanh ghi eax và edx, sau đó tính tổng của hai tham số đầu vào bằng lệnh `addl`.
- Sau khi gọi `my_function`, giá trị trả về sẽ được truyền qua thanh ghi eax, và hàm gọi `main` sẽ lưu giá trị trả về của `my_function` vào biến `i` trên ngăn xếp.

```c
int my_function(int arg1, int arg2, int ... arg8) {
    return arg1 + arg2 + ... + arg8;
}
```

Trong đoạn mã trên, khi số lượng tham số của `my_function` tăng lên tám, việc biên dịch lại chương trình sẽ tạo ra mã hợp ngữ khác:

```c
main:
    pushq	%rbp
    movq	%rsp, %rbp
    subq	$16, %rsp     // Cấp phát 16 byte cho việc truyền tham số
    movl	$8, 8(%rsp)   // Truyền tham số thứ 8
    movl	$7, (%rsp)    // Truyền tham số thứ 7
    movl	$6, %r9d
    movl	$5, %r8d
    movl	$4, %ecx
    movl	$3, %edx
    movl	$2, %esi
    movl	$1, %edi
    call	my_function
```

Khi hàm `main` gọi hàm `my_function`, sáu tham số đầu tiên sẽ được truyền qua sáu thanh ghi edi, esi, edx, ecx, r8d và r9d. Thứ tự sử dụng các thanh ghi cũng là một phần của quy ước gọi hàm, với tham số đầu tiên của hàm sử dụng thanh ghi edi, tham số thứ hai sử dụng thanh ghi esi, và cứ tiếp tục như vậy.

Hai tham số cuối cùng khác hoàn toàn so với các tham số trước đó, hàm gọi `main` truyền hai tham số này thông qua ngăn xếp. Hình dưới đây mô tả thông tin ngăn xếp trước khi hàm `main` gọi hàm `my_function`:

![Pasted image 20230701032103](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230701032103.png)

Trong hình ảnh trên, thanh ghi rbp sẽ lưu trữ con trỏ cơ sở của ngăn xếp cuộc gọi hàm, tức là vị trí bắt đầu của không gian ngăn xếp thuộc về hàm `main`. Trong khi đó, thanh ghi rsp lưu trữ vị trí kết thúc của ngăn xếp cuộc gọi hàm của hàm `main`. Cả hai thanh ghi này cùng đại diện cho không gian ngăn xếp của hàm.

Trước khi gọi hàm `my_function`, hàm `main` sẽ cấp phát 16 byte địa chỉ ngăn xếp bằng lệnh `subq $16, %rsp`, sau đó lưu trữ các tham số từ thứ sáu trở đi theo thứ tự từ phải sang trái vào ngăn xếp, tức là tham số thứ tám và tham số thứ bảy. Sáu tham số còn lại sẽ được truyền qua thanh ghi. Tiếp theo, lệnh `call my_function` sẽ gọi hàm `my_function`:

```c
my_function:
	pushq	%rbp
	movq	%rsp, %rbp
	movl	%edi, -4(%rbp)    // rbp-4 = edi = 1
	movl	%esi, -8(%rbp)    // rbp-8 = esi = 2
	...
	movl	-8(%rbp), %eax    // eax = 2
	movl	-4(%rbp), %edx    // edx = 1
	addl	%eax, %edx        // edx = eax + edx = 3
	...
	movl	16(%rbp), %eax    // eax = 7
	addl	%eax, %edx        // edx = eax + edx = 28
	movl	24(%rbp), %eax    // eax = 8
	addl	%edx, %eax        // edx = eax + edx = 36
	popq	%rbp
```

Trong hàm `my_function`, trước tiên, tất cả dữ liệu trong thanh ghi được chuyển vào ngăn xếp. Sau đó, hàm sử dụng thanh ghi eax để tính tổng của tất cả các tham số đầu vào và trả về kết quả.

Chúng ta có thể tóm tắt phân tích và khám phá trong phần này như sau - khi sử dụng ngôn ngữ C trên máy x86_64, các tham số được truyền qua thanh ghi và ngăn xếp, với các đặc điểm sau:

- Sáu tham số hoặc ít hơn sẽ được truyền qua sáu thanh ghi edi, esi, edx, ecx, r8d và r9d theo thứ tự.
- Sáu tham số trở lên sẽ được truyền qua ngăn xếp, các tham số sẽ được lưu trữ vào ngăn xếp theo thứ tự từ phải sang trái.

Giá trị trả về của hàm được truyền qua thanh ghi eax. Vì chỉ sử dụng một thanh ghi để lưu trữ giá trị trả về, nên hàm trong ngôn ngữ C không thể trả về nhiều giá trị cùng một lúc.

### Ngôn ngữ Go

Sau khi phân tích quy ước gọi hàm trong ngôn ngữ C, chúng ta sẽ tiếp tục phân tích quy ước gọi hàm trong ngôn ngữ Go. Chúng ta sẽ phân tích một đoạn mã rất đơn giản như sau:

```go
package main

func myFunction(a, b int) (int, int) {
	return a + b, a - b
}

func main() {
	myFunction(66, 77)
}
```

Trong đoạn mã trên, hàm `myFunction` nhận vào hai số nguyên và trả về hai số nguyên. Trong hàm `main`, khi gọi `myFunction`, chúng ta truyền hai tham số 66 và 77 vào hàm. Khi biên dịch đoạn mã trên bằng lệnh `go tool compile -S -N -l main.go`, chúng ta sẽ có mã hợp ngữ như sau:

> Nếu không sử dụng tham số -N -l khi biên dịch, trình biên dịch sẽ tối ưu mã hợp ngữ và kết quả biên dịch sẽ khác đi đáng kể.

```go
"".main STEXT size=68 args=0x0 locals=0x28
	0x0000 00000 (main.go:7)	MOVQ	(TLS), CX
	0x0009 00009 (main.go:7)	CMPQ	SP, 16(CX)
	0x000d 00013 (main.go:7)	JLS	61
	0x000f 00015 (main.go:7)	SUBQ	$40, SP      // Cấp phát 40 byte không gian ngăn xếp
	0x0013 00019 (main.go:7)	MOVQ	BP, 32(SP)   // Lưu con trỏ cơ sở vào ngăn xếp
	0x0018 00024 (main.go:7)	LEAQ	32(SP), BP
	0x001d 00029 (main.go:8)	MOVQ	$66, (SP)    // Tham số thứ nhất
	0x0025 00037 (main.go:8)	MOVQ	$77, 8(SP)   // Tham số thứ hai
	0x002e 00046 (main.go:8)	CALL	"".myFunction(SB)
	0x0033 00051 (main.go:9)	MOVQ	32(SP), BP
	0x0038 00056 (main.go:9)	ADDQ	$40, SP
	0x003c 00060 (main.go:9)	RET
```

Dựa vào mã hợp ngữ được tạo ra từ hàm `main`, chúng ta có thể phân tích ngăn xếp trước khi gọi hàm `myFunction`:

![Pasted image 20230701033554](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230701033554.png)

Hàm main đã cấp phát tổng cộng 40 byte cho không gian ngăn xếp bằng lệnh `SUBQ $40, SP`:

| Không gian | Kích thước | Mục đích | |  
| ------------- | ---------- | --------------------------------------- |  
| SP+32 ~ BP | 8 byte | Con trỏ cơ sở của ngăn xếp của hàm main | |  
| SP+16 ~ SP+32 | 16 byte | Hai giá trị trả về của hàm myFunction |  
| SP ~ SP+16 | 16 byte | Hai tham số của hàm myFunction |  
Thứ tự đẩy các tham số vào ngăn xếp của `myFunction` giống như trong ngôn ngữ C, từ phải sang trái. Ví dụ, tham số đầu tiên 66 được lưu trữ trong không gian SP ~ SP+8 trên đỉnh ngăn xếp, và tham số thứ hai được lưu trữ trong không gian SP+8 ~ SP+16.

Sau khi chuẩn bị xong các tham số của hàm, lệnh `CALL "".myFunction(SB)` được gọi, lệnh này sẽ đưa địa chỉ trở về của hàm `main` vào ngăn xếp, sau đó thay đổi con trỏ ngăn xếp hiện tại SP và thực hiện các lệnh assembly của `myFunction`:

```go
"".myFunction STEXT nosplit size=49 args=0x20 locals=0x0
	0x0000 00000 (main.go:3)	MOVQ	$0, "".~r2+24(SP) // Khởi tạo giá trị trả về đầu tiên
	0x0009 00009 (main.go:3)	MOVQ	$0, "".~r3+32(SP) // Khởi tạo giá trị trả về thứ hai
	0x0012 00018 (main.go:4)	MOVQ	"".a+8(SP), AX    // AX = 66
	0x0017 00023 (main.go:4)	ADDQ	"".b+16(SP), AX   // AX = AX + 77 = 143
	0x001c 00028 (main.go:4)	MOVQ	AX, "".~r2+24(SP) // (24)SP = AX = 143
	0x0021 00033 (main.go:4)	MOVQ	"".a+8(SP), AX    // AX = 66
	0x0026 00038 (main.go:4)	SUBQ	"".b+16(SP), AX   // AX = AX - 77 = -11
	0x002b 00043 (main.go:4)	MOVQ	AX, "".~r3+32(SP) // (32)SP = AX = -11
	0x0030 00048 (main.go:4)	RET
```

Từ mã hợp ngữ trên, chúng ta có thể thấy rằng trong quá trình thực thi, hàm hiện tại đầu tiên sẽ đặt địa chỉ hai giá trị trả về trong hàm `main` thành giá trị mặc định của kiểu `int` là 0. Sau đó, nó sẽ lấy các tham số từ ngăn xếp dựa trên vị trí tương đối và thực hiện các phép cộng và trừ, sau đó lưu giá trị trở lại ngăn xếp. Trong quá trình này, dữ liệu trên ngăn xếp sẽ như sau:

![Pasted image 20230701034638](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230701034638.png)

Sau khi hàm `myFunction` trả về, hàm `main` sẽ khôi phục con trỏ cơ sở của ngăn xếp và giải phóng 40 byte không gian ngăn xếp không còn sử dụng bằng các lệnh sau:

```go
    0x0033 00051 (main.go:9)    MOVQ    32(SP), BP
    0x0038 00056 (main.go:9)    ADDQ    $40, SP
    0x003c 00060 (main.go:9)    RET
```

Dựa vào phân tích mã hợp ngữ sau khi biên dịch Go, chúng ta nhận thấy rằng Go sử dụng ngăn xếp để truyền tham số và nhận giá trị trả về. Do đó, chỉ cần cấp phát thêm một số lượng bộ nhớ trên ngăn xếp là có thể trả về nhiều giá trị.

### So sánh

C và Go là hai ngôn ngữ khác nhau trong cách thiết kế quy ước gọi hàm. Trong C, cả thanh ghi và ngăn xếp được sử dụng để truyền tham số, và thanh ghi eax được sử dụng để truyền giá trị trả về. Trong khi đó, Go sử dụng ngăn xếp để truyền tham số và giá trị trả về. Chúng ta có thể so sánh các ưu điểm và nhược điểm của hai cách thiết kế này:

Cách thiết kế của C giảm thiểu chi phí thêm khi gọi hàm, nhưng cũng làm tăng độ phức tạp của việc triển khai.

- Chi phí truy cập ngăn xếp cao hơn so với truy cập thanh ghi, khoảng vài chục lần.
- Cần xử lý riêng trường hợp có quá nhiều tham số cho hàm.

Cách thiết kế của Go giảm độ phức tạp của việc triển khai và hỗ trợ trả về nhiều giá trị.

- Không cần xem xét cách truyền tham số khi có quá nhiều tham số vượt quá số lượng thanh ghi.
- Không cần xem xét sự khác biệt về thanh ghi trên các kiến trúc khác nhau.
- Cần cấp phát không gian bộ nhớ trên ngăn xếp cho tham số và giá trị trả về.

Cách thiết kế của Go sử dụng ngăn xếp để truyền tham số và giá trị trả về là một lựa chọn sau khi xem xét toàn diện, điều này có nghĩa là trình biên dịch sẽ đơn giản hơn và dễ bảo trì hơn.

## Truyền tham số

Ngoài quy ước gọi hàm, một câu hỏi thú vị khác trong Go là liệu tham số được truyền bằng giá trị hay tham chiếu. Trước tiên, hãy nhắc lại sự khác biệt giữa truyền giá trị và truyền tham chiếu:

- Truyền giá trị (pass by value): Khi gọi hàm, tham số sẽ được sao chép, bên gọi và bên được gọi sẽ có hai bản sao dữ liệu không liên quan nhau
- Truyền tham chiếu (pass by reference): Khi gọi hàm, con trỏ của tham số sẽ được truyền, bên gọi và bên được gọi sẽ có cùng một dữ liệu, bất kỳ thay đổi nào từ một bên cũng sẽ ảnh hưởng đến bên kia.

Các ngôn ngữ khác nhau sẽ chọn cách truyền tham số khác nhau, và Go đã chọn cách truyền giá trị, bất kể truyền kiểu cơ bản, mảng hay con trỏ, tất cả đều được sao chép khi truyền. Phần còn lại của nội dung sẽ xác minh tính chính xác của phát hiện này.

### Kiểu số và mảng

Chúng ta hãy xem cách Go truyền các kiểu cơ bản và mảng. Hàm `myFunction` dưới đây nhận hai tham số, biến số nguyên `i` và mảng `arr`, hàm này sẽ in ra địa chỉ của hai tham số được truyền vào, và hàm `main` cũng sẽ in ra địa chỉ của hai tham số trước và sau khi gọi hàm `myFunction`:

```go
func myFunction(i int, arr [2]int) {
	fmt.Printf("in my_funciton - i=(%d, %p) arr=(%v, %p)\n", i, &i, arr, &arr)
}

func main() {
	i := 30
	arr := [2]int{66, 77}
	fmt.Printf("before calling - i=(%d, %p) arr=(%v, %p)\n", i, &i, arr, &arr)
	myFunction(i, arr)
	fmt.Printf("after  calling - i=(%d, %p) arr=(%v, %p)\n", i, &i, arr, &arr)
}
```

```bash
$ go run main.go
before calling - i=(30, 0xc00009a000) arr=([66 77], 0xc00009a010)
in my_funciton - i=(30, 0xc00009a008) arr=([66 77], 0xc00009a020)
after  calling - i=(30, 0xc00009a000) arr=([66 77], 0xc00009a010)
```

Khi chạy mã này, chúng ta sẽ thấy rằng địa chỉ của các tham số trong hàm `main` và hàm `myFunction` là hoàn toàn khác nhau.

Tuy nhiên, từ quan điểm của hàm `main`, địa chỉ của biến số nguyên `i` và mảng `arr` không thay đổi trước và sau khi gọi hàm `myFunction`. Vậy nếu chúng ta thay đổi các tham số trong hàm `myFunction`, liệu nó có ảnh hưởng đến biến trong hàm main không? Hãy cập nhật hàm `myFunction` và chạy lại đoạn mã này:

```go
func myFunction(i int, arr [2]int) {
	i = 29
	arr[1] = 88
	fmt.Printf("in my_funciton - i=(%d, %p) arr=(%v, %p)\n", i, &i, arr, &arr)
}
```

```bash
$ go run main.go
before calling - i=(30, 0xc000072008) arr=([66 77], 0xc000072010)
in my_funciton - i=(29, 0xc000072028) arr=([66 88], 0xc000072040)
after  calling - i=(30, 0xc000072008) arr=([66 77], 0xc000072010)
```

Ta có thể thấy rằng việc thay đổi các tham số trong hàm `myFunction` chỉ ảnh hưởng đến hàm đó và không ảnh hưởng đến hàm gọi `main`, vì vậy chúng ta có thể kết luận: **Go truyền giá trị cho kiểu số và mảng**, có nghĩa là khi gọi hàm, nội dung sẽ được sao chép. Cần lưu ý rằng nếu kích thước mảng rất lớn, cách truyền giá trị này sẽ ảnh hưởng đến hiệu suất.

### Cấu trúc và con trỏ

Tiếp theo, chúng ta sẽ tiếp tục phân tích hai kiểu phổ biến khác trong ngôn ngữ Go - cấu trúc và con trỏ. Đoạn mã dưới đây định nghĩa một cấu trúc `MyStruct` và một phương thức `myFunction` nhận hai tham số:

```go
type MyStruct struct {
	i int
}

func myFunction(a MyStruct, b *MyStruct) {
	a.i = 31
	b.i = 41
	fmt.Printf("in my_function - a=(%d, %p) b=(%v, %p)\n", a, &a, b, &b)
}

func main() {
	a := MyStruct{i: 30}
	b := &MyStruct{i: 40}
	fmt.Printf("before calling - a=(%d, %p) b=(%v, %p)\n", a, &a, b, &b)
	myFunction(a, b)
	fmt.Printf("after calling  - a=(%d, %p) b=(%v, %p)\n", a, &a, b, &b)
}
```

```bash
$ go run main.go
before calling - a=({30}, 0xc000018178) b=(&{40}, 0xc00000c028)
in my_function - a=({31}, 0xc000018198) b=(&{41}, 0xc00000c038)
after calling  - a=({30}, 0xc000018178) b=(&{41}, 0xc00000c028)
```

Từ kết quả chạy trên, chúng ta có thể rút ra các kết luận sau:

- Khi truyền cấu trúc: toàn bộ nội dung của cấu trúc sẽ được sao chép.
- Khi truyền con trỏ cấu trúc: con trỏ cấu trúc sẽ được sao chép.

Thay đổi con trỏ cấu trúc là thay đổi cấu trúc mà con trỏ đang trỏ tới, `b.i` có thể hiểu là `(*b).i`, tức là chúng ta trước tiên lấy cấu trúc mà con trỏ b đang trỏ tới, sau đó thay đổi thành viên của cấu trúc. Chúng ta sẽ sửa đổi đoạn mã trên một chút và phân tích cấu trúc trong bộ nhớ của ngôn ngữ Go:

```go
type MyStruct struct {
	i int
	j int
}

func myFunction(ms *MyStruct) {
	ptr := unsafe.Pointer(ms)
	for i := 0; i < 2; i++ {
		c := (*int)(unsafe.Pointer((uintptr(ptr) + uintptr(8*i))))
		*c += i + 1
		fmt.Printf("[%p] %d\n", c, *c)
	}
}

func main() {
	a := &MyStruct{i: 40, j: 50}
	myFunction(a)
	fmt.Printf("[%p] %v\n", a, a)
}
```

```bash
$ go run main.go
[0xc000018180] 41
[0xc000018188] 52
[0xc000018180] &{41 52}
```

Trong đoạn mã này, chúng ta sửa đổi biến thành viên của cấu trúc thông qua con trỏ. Cấu trúc trong bộ nhớ là một vùng liên tục, con trỏ đến cấu trúc cũng trỏ đến địa chỉ bắt đầu của cấu trúc đó. Nếu chúng ta thay đổi con trỏ `MyStruct` thành một kiểu `int`, thì truy cập vào con trỏ mới sẽ trả về biến kiểu số nguyên `i`, và di chuyển con trỏ 8 byte sau đó sẽ truy cập vào biến thành viên `j` tiếp theo.

Nếu chúng ta đơn giản hóa mã thành đoạn mã sau và biên dịch bằng công cụ `go tool compile`, chúng ta sẽ nhận được kết quả như sau:

```go
type MyStruct struct {
	i int
	j int
}

func myFunction(ms *MyStruct) *MyStruct {
	return ms
}
```

```bash
$ go tool compile -S -N -l main.go
"".myFunction STEXT nosplit size=20 args=0x10 locals=0x0
	0x0000 00000 (main.go:8)	MOVQ	$0, "".~r1+16(SP) // Khởi tạo giá trị trả về
	0x0009 00009 (main.go:9)	MOVQ	"".ms+8(SP), AX   // Sao chép tham chiếu
	0x000e 00014 (main.go:9)	MOVQ	AX, "".~r1+16(SP) // Trả về tham chiếu
	0x0013 00019 (main.go:9)	RET
```

Trong đoạn mã hợp ngữ này, chúng ta nhận thấy khi tham số là con trỏ, sử dụng lệnh `MOVQ "".ms+8(SP), AX` để sao chép tham chiếu, sau đó trả về con trỏ đã sao chép như giá trị trả về cho bên gọi.

![Pasted image 20230701042641](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230701042641.png)

Vì vậy, khi chúng ta truyền con trỏ vào một hàm nào đó, bên trong hàm sẽ sao chép con trỏ đó, tức là sẽ có hai con trỏ cùng trỏ đến cùng một vùng nhớ ban đầu, vì vậy trong Go, truyền con trỏ cũng là truyền giá trị.

### Truyền giá trị

Sau khi xác nhận các cấu trúc dữ liệu phổ biến trong Go, chúng ta có thể suy luận rằng Go sử dụng phương pháp truyền giá trị khi truyền tham số, bên nhận tham số sẽ sao chép các tham số này. Sau khi hiểu điều này, khi truyền mảng hoặc cấu trúc dữ liệu chiếm nhiều bộ nhớ, chúng ta nên sử dụng con trỏ làm kiểu tham số để tránh sao chép dữ liệu và ảnh hưởng đến hiệu suất.

## Tóm tắt

Trong phần này, chúng ta đã phân tích chi tiết về quy ước gọi hàm trong ngôn ngữ Go, bao gồm quá trình và nguyên lý truyền tham số và giá trị trả về. Go sử dụng ngăn xếp để truyền tham số và giá trị trả về của hàm, trước khi gọi hàm, nó sẽ cấp phát không gian bộ nhớ phù hợp cho giá trị trả về trên ngăn xếp, sau đó tham số sẽ được đẩy vào ngăn xếp từ phải sang trái theo thứ tự và được sao chép. Giá trị trả về sẽ được lưu trữ trên không gian ngăn xếp đã được cấp phát trước đó. Chúng ta có thể tóm tắt một số quy tắc sau:  

- Tham số được truyền qua ngăn xếp, thứ tự đẩy vào từ phải sang trái, và tính toán tham số từ trái sang phải.
- Giá trị trả về của hàm được truyền qua ngăn xếp và được bên gọi trước đó cấp phát không gian bộ nhớ bởi bên gọi.
- Khi gọi hàm, luôn truyền giá trị, và bên nhận sẽ sao chép tham số trước khi tính toán.
