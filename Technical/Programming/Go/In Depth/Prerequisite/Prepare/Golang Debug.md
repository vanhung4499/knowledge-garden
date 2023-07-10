---
categories: [golang]
title: Golang Debug
date created: 2023-06-06
date modified: 2023-07-10
tags: [golang]
---

Go là một dự án mã nguồn mở, chúng ta có thể dễ dàng có được mã nguồn của nó, nó có cấu trúc dự án rất phức tạp và cơ sở mã khổng lồ, Go ngày nay có gần 1,5 triệu dòng mã nguồn, chứa gần 1,4 triệu dòng mã Go, chúng ta có thể sử dụng các lệnh như sau để xem số dòng mã trong dự án:

```bash
$ cloc $GOROOT/src
	5988 text files.
    5875 unique files.
    1165 files ignored.

github.com/AlDanial/cloc v 1.78  T=6.96 s (693.7 files/s, 274805.2 lines/s)
-----------------------------------------------------------------------------------
Language                         files          blank        comment           code
-----------------------------------------------------------------------------------
Go                                4199         139910         221375        1398357
Assembly                           486          12784          19137         106699
C                                   64            718            562           4587
JSON                                12              0              0           1712
...
-----------------------------------------------------------------------------------
SUM:                              4828         154344         242395        1515787
-----------------------------------------------------------------------------------
```

Khi phát triển Go, toàn bộ cơ sở mã thay đổi theo thời gian, vì vậy kết quả thống kê ở trên khác nhau mỗi ngày. Mặc dù dự án có một cơ sở mã khổng lồ, nó không phải là không thể để gỡ lỗi Go, miễn là chúng ta có một phương pháp thích hợp và một số kiến thức về thư viện tiêu chuẩn của Go, chúng ta có thể gỡ lỗi Go, chúng ta sẽ giới thiệu một số phương pháp biên dịch và gỡ lỗi Go ở đây.

## 1. Biên dịch mã nguồn

Giả sử chúng ta muốn sửa đổi phương pháp phổ biến trong Go [`fmt.Println`](https://github.com/golang/go/blob/master/src/fmt/print.go#L313) cho phép thực hiện các chức năng như sau: in chuỗi bất kỳ khác trước khi in chuỗi cần in. Chúng ta có thể sửa đổi việc thực hiện phương pháp này thành các đoạn mã như sau, trong đó `println` là một phương pháp tích hợp được cung cấp trong thời gian chạy Go, mà không cần phải dựa vào bất kỳ gói nào để in chuỗi sang tiêu chuẩn:

```go
func Println(a ...interface{}) (n int, err error) {
	println("draven")
	return Fprintln(os.Stdout, a...)
}
```

Khi chúng ta sửa đổi dự án mã nguồn cho Go, bạn có thể sử dụng các tập lệnh được cung cấp trong kho để biên dịch và sinh ra Golang binary code và các toolchain liên quan:

```bash
$ ./src/make.bash
Building Go cmd/dist using /usr/local/Cellar/go/1.14.2_1/libexec. (go1.14.2 darwin/amd64)
Building Go toolchain1 using /usr/local/Cellar/go/1.14.2_1/libexec.
Building Go bootstrap cmd/go (go_bootstrap) using Go toolchain1.
Building Go toolchain2 using go_bootstrap and Go toolchain1.
Building Go toolchain3 using go_bootstrap and Go toolchain2.
Building packages and commands for darwin/amd64.
---
Installed Go for darwin/amd64 in /Users/draveness/go/src/github.com/golang/go
Installed commands in /Users/draveness/go/src/github.com/golang/go/bin
```

Script `./src/make.bash` biên dịch Golang binary, toolchain, standard library và command và di chuyển mã nguồn và các tệp nhị phân được biên dịch đến vị trí tương ứng. Như được hiển thị trong mã trên, binary code được lưu trữ trong thư mục `$GOPATH/src/github.com/golang/go/bin`, đây là nơi bạn cần truy cập đường dẫn tuyệt đối và sử dụng :

```bash
$ cat main.go
package main

import "fmt"

func main() {
	fmt.Println("Hello World")
}
$ $GOPATH/src/github.com/golang/go/bin/go run main.go
draven
Hello World
```

chúng ta sẽ thấy rằng lệnh trên đã gọi thành công `fmt.Println` đã được sửa, và tại thời điểm này, nếu bạn trực tiếp sử dụng `go run main.go`, có khả năng sử dụng `go` binary code được cài đặt bởi trình quản lý gói mà không nhận được kết quả mong muốn.

## 2. Intermediate code

Các ứng dụng Go cần phải được biên dịch thành mã nhị phân (binary code) trước khi chạy, trong quá trình biên dịch sẽ trải qua giai đoạn tạo mã trung gian , mã trung gian của trình biên dịch Go có các tính năng của **gán giá trị đơn giản tĩnh (Static Single Assignment, SSA)**, chúng ta sẽ giới thiệu tính năng này của mã trung gian sau này, ở đây chúng ta chỉ cần biết đây là một đại diện của mã trung gian.

Nhiều nhà phát triển Go biết rằng chúng ta có thể biên dịch mã nguồn của Go thành ngôn ngữ assembly bằng cách sử dụng các lệnh sau đây và sau đó thực hiện các quy trình cụ thể bằng cách phân tích ngôn ngữ assembly:

```go
$ go build -gcflags -S main.go
	rel 22+4 t=8 os.(*file).close+0
"".main STEXT size=137 args=0x0 locals=0x58
	0x0000 00000 (main.go:5)	TEXT	"".main(SB), ABIInternal, $88-0
	0x0000 00000 (main.go:5)	MOVQ	(TLS), CX
	0x0009 00009 (main.go:5)	CMPQ	SP, 16(CX)
	...
	rel 5+4 t=17 TLS+0
	rel 40+4 t=16 type.string+0
	rel 52+4 t=16 ""..stmp_0+0
	rel 64+4 t=16 os.Stdout+0
	rel 71+4 t=16 go.itab.*os.File,io.Writer+0
	rel 113+4 t=8 fmt.Fprintln+0
	rel 128+4 t=8 runtime.morestack_noctxt+0
```

Tuy nhiên, assembly code ở trên chỉ là kết quả của việc biên dịch Go, và là Go developer, chúng ta đã có thể phân tích các nút thắt cổ chai hiệu suất của chương trình thông qua kết quả được mô tả ở trên, nhưng nếu chúng ta muốn hiểu chi sâu hơn quá trình biên dịch của Go, chúng ta có thể dùng lệnh sau để nhận được quá trình tối ưu hóa assembly instruction thông qua :

```bash
$ GOSSAFUNC=main go build main.go
# runtime
dumped SSA to /usr/local/Cellar/go/1.14.2_1/libexec/src/runtime/ssa.html
# command-line-arguments
dumped SSA to ./ssa.html
```

Lệnh trên tạo ra một tập tin `ssa.html` trong thư mục hiện tại, và khi chúng ta mở nó, chúng ta sẽ thấy từng bước của tối ưu hóa assembly code:

![[Extras/Media/Pasted image 20230606151806.png]]

Các tệp HTML ở trên có thể tương tác và khi chúng ta click vào assembly instruction trên trang web, trang sẽ sử dụng cùng một màu sắc để xác định các dòng mã có liên quan ở các giai đoạn khác nhau của việc tạo mã trung gian SSA, làm cho nó dễ dàng hơn cho các nhà phát triển để phân tích quá trình tối ưu hóa biên dịch.

## 3. Nút thắt cổ chai

Nắm vững các phương pháp gỡ lỗi và tùy chỉnh mã nhị phân ngôn ngữ Go có thể giúp chúng ta nhanh chóng xác minh phỏng đoán về việc thực hiện bên trong ngôn ngữ Go, với chức năng `println` đơn giản và thô bạo nhất có thể gỡ lỗi mã nguồn và thư viện tiêu chuẩn của ngôn ngữ Go; Và nếu chúng ta muốn nghiên cứu quá trình tối ưu hóa biên dịch chi tiết của mã nguồn, chúng ta có thể sử dụng mã trung gian SSA được đề cập ở trên để đi sâu vào mã trung gian của ngôn ngữ Go và cách tối ưu hóa biên dịch, nhưng đọc mã nguồn là một quá trình không thể tránh khỏi miễn là chúng ta muốn hiểu cách thực hiện ngôn ngữ Go.
