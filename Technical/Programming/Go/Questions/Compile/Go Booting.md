---
title: Golang Booting
tags:
  - golang
  - interview
categories:
  - golang
  - interview
date created: 2023-10-05
date modified: 2023-10-05
---

# Golang: Booting

Chúng ta bắt đầu với ví dụ "Hello World":

```go
package main

import "fmt"

func main() {
	fmt.Println("hello world")
}
```

Thực thi lệnh sau trong thư mục gốc của dự án:

```shell
go build -gcflags "-N -l" -o hello src/main.go
```

`-gcflags "-N -l"` được sử dụng để tắt tối ưu hóa và việc nội tuyến hóa hàm của trình biên dịch, để tránh mất vị trí mã tương ứng khi thiết lập điểm dừng sau này.

Kết quả là chúng ta có được tệp thực thi hello. Thực thi:

```shell
$ gdb hello
```

Chúng ta đã nhập vào chế độ gỡ lỗi gdb, thực thi `info files`, chúng ta sẽ nhận được thông tin về tiêu đề tệp thực thi, liệt kê các phân đoạn:

![go-compile-20.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/go-compile-20.png)

Đồng thời, chúng ta cũng nhận được địa chỉ nhập khẩu: 0x450e20.

```shell
(gdb) b *0x450e20
Breakpoint 1 at 0x450e20: file /usr/local/go/src/runtime/rt0_linux_amd64.s, line 8.
```

Đây là địa chỉ nhập khẩu của chương trình Go, tôi đang chạy trên hệ điều hành Linux, vì vậy tệp nhập khẩu là `src/runtime/rt0_linux_amd64.s`, thư mục runtime chứa các tệp nhập khẩu với các tên khác nhau, hỗ trợ các hệ điều hành và kiến trúc khác nhau. Mã nguồn như sau:

```asm
TEXT _rt0_amd64_linux(SB),NOSPLIT,$-8
	LEAQ	8(SP), SI // argv
	MOVQ	0(SP), DI // argc
	MOVQ	$main(SB), AX
	JMP	AX
```

Chủ yếu là lấy argc, argv từ bộ nhớ vào thanh ghi. Ở đây, LEAQ được sử dụng để tính địa chỉ bộ nhớ, sau đó đưa chính địa chỉ bộ nhớ vào thanh ghi, tức là đưa địa chỉ argv vào thanh ghi SI. Cuối cùng, nhảy đến:

```go
TEXT main(SB),NOSPLIT,$-8
	MOVQ	$runtime·rt0_go(SB), AX
	JMP	AX
```

Tiếp tục với nhảy đến `runtime·rt0_go(SB)`, vị trí: `/usr/local/go/src/runtime/asm_amd64.s`, mã nguồn:

```asm
TEXT runtime·rt0_go(SB),NOSPLIT,$0
    // Bỏ qua một số mã kiểm tra các cờ đặc trưng của CPU
    // Chủ yếu là những gì tôi không hiểu, ^_^
    
    // ………………………………
    
    // Dưới đây là một số hàm cuối cùng được gọi, khá quan trọng
    // Khởi tạo đường dẫn tuyệt đối của tệp thực thi
    CALL	runtime·args(SB)
    // Khởi tạo số lõi CPU và kích thước trang bộ nhớ
	CALL	runtime·osinit(SB)
	// Khởi tạo tham số dòng lệnh, biến môi trường, gc, không gian ngăn xếp, quản lý bộ nhớ, tất cả các P, thuật toán HASH, v.v.
	CALL	runtime·schedinit(SB)

	// Hàm sẽ chạy trên goroutine chính
	MOVQ	$runtime·mainPC(SB), AX		// entry
	PUSHQ	AX
	PUSHQ	$0			// kích thước đối số
	
	// Tạo một goroutine mới, goroutine này sẽ gắn kết với runtime.main, đặt vào hàng đợi cục bộ của P, chờ lập lịch
	CALL	runtime·newproc(SB)
	POPQ	AX
	POPQ	AX

    // Khởi động M, bắt đầu lập lịch goroutine
	CALL	runtime·mstart(SB)

	MOVL	$0xf1, 0xf1  // crash
	RET

	
DATA	runtime·mainPC+0(SB)/8,$runtime·main(SB)
GLOBL	runtime·mainPC(SB),RODATA,$8	
```

Một bài viết trong tài liệu tham khảo ["Khám phá quá trình khởi động chương trình Go"] nghiên cứu sâu hơn về chủ đề này, tóm tắt như sau:

>1. Kiểm tra CPU của nền tảng chạy, thiết lập các cờ liên quan.
2. Khởi tạo TLS.
3. Các hàm runtime.args, runtime.osinit, runtime.schedinit thực hiện các biến và lập lịch cần thiết cho chương trình.
4. Tạo một goroutine mới để gắn kết với hàm main do người dùng viết.
5. Khởi động M, bắt đầu lập lịch goroutine.

Cuối cùng, hãy xem một hình ảnh tổng quan về quá trình khởi động Go:

![go-compile-21.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/go-compile-21.png)

Một số hoạt động quan trọng trong hàm main bao gồm: bắt đầu một goroutine chạy hàm sysmon, thực hiện garbage collection và preemption scheduling định kỳ; khởi động gc; thực hiện tất cả các hàm init, và nhiều hơn nữa.

Phần về việc thoát khỏi chương trình:

>Khi hàm main kết thúc, nó sẽ gọi exit(0) để thoát khỏi tiến trình. Nếu sau exit(0), tiến trình không thoát, mã cuối cùng của hàm main sẽ liên tục truy cập vào địa chỉ không hợp lệ:

```go
exit(0)
for {
	var x *int32
	*x = 0
}
```

>Thông thường, khi truy cập vào địa chỉ không hợp lệ, hệ thống sẽ kết thúc quá trình, đảm bảo tiến trình thoát.

Phần về quá trình thoát chương trình này được trích từ cuộc trò chuyện nhóm ["Đọc mã nguồn Go của runtime"], đó là một nhóm nghiên cứu mã nguồn cao cấp khác, trang GitHub của họ có trong tài liệu tham khảo.

Tất nhiên, phần khởi động chương trình Go cũng liên quan đến việc fork một quá trình mới, tải tệp thực thi, chuyển quyền điều khiển và nhiều vấn đề khác. Tôi khuyến nghị đọc hai cuốn sách trước đó, tôi nghĩ rằng tôi không thể viết tốt hơn, nên không trình bày chi tiết ở đây.
