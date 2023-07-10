---
categories: [os, computer-science]
title: System Call
date created: 2023-05-31
date modified: 2023-07-10
tags: [os, computer-science]
---

## 📞 System Call là gì?

Nó là một giao diện (interface) để sử dụng các dịch vụ do hệ điều hành cung cấp.

Thông thường, chương trình sử dụng thông qua API (Library Function) hơn là sử dụng system call trực tiếp.

Vì các chương trình được viết bằng ngôn ngữ cấp cao như C hoặc C++ không thể trực tiếp thực hiện system call nên phương pháp này cho phép truy cập system call thông qua các API cấp cao.

Hệ điều hành cung cấp các dịch vụ khác nhau như tải chương trình vào bộ nhớ, xử lý I/O và xử lý hệ thống tệp và tiến trình người dùng nhận dịch vụ thông qua system call.

Thông thường, các system call được chia thành nhiều loại chức năng. Mỗi system call được gán một số và system-call interface duy trì một bảng được lập chỉ mục theo số này.

### Library Function

Các hàm thường được người dùng sử dụng, chẳng hạn như đầu vào/đầu ra chuỗi/tiêu chuẩn, được tạo thành các hàm trước.

Các hàm này sử dụng các system call trong nội bộ, nhưng khi được gọi, nó sẽ chạy ở user mode.

Tùy thuộc vào mục đích, nó có nhiều loại giá trị trả về khác nhau và được cung cấp để giúp cho việc phát triển trở nên dễ dàng hoặc để giảm thiểu các system call.

Ví dụ, xen system call ghi.

```c
ssize_t write(int fd, const void * buf, size_t count);
```

Nó chỉ đơn giản là hàm ghi dữ liệu chứa trong `buf` có độ dài `count` vào file được chỉ định là `fd`.

Tiếp theo, xem hàm `printf` được tạo bằng write system call.

```c
int printf(const char *format-string, argument-list);
```

Nó cho phép bạn dễ dàng xuất một chuỗi bằng cách sử dụng chuỗi định dạng.

Điều này là do `printf` đảm nhiệm việc định dạng tham số bên trong và cuối cùng dùng write system call.

Ví dụ đơn giản với ngôn ngữ C

```c
#include <stdio.h>
int main()
{
  ...
  printf("Hello World!");
  ...
  return 0;
}
```

Hàm printf() chạy ở user mode và gọi thư viện stdio. Thư viện stdio gọi system call `write()` và luồng thực thi chuyển sang kernel mode. Kernel thực hiện lệnh gọi để in chuỗi trên màn hình và luồng thực thi quay trở lại user mode để thực hiện bước tiếp theo của hàm `printf()`.

![Pasted image 20230601172304](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601172304.png)

Bất cứ khi nào các system call như `read()` và `write()` được gọi trong quá trình nhập/xuất file, chúng sẽ được chuyển đổi sang kernel mode và được ghi vào tệp.

Mặt khác, các Library Function `fread()` và `fwrite()` sử dụng bộ đệm để thực thi `read()` và `write()` chỉ một lần trong nội bộ, vì vậy tài nguyên hệ thống được sử dụng hiệu quả. Nó còn được gọi là hàm bao bọc (wrapper) vì nó system call.

Nói cách khác, lý do tại sao system call không được gọi trực tiếp là do môi trường thực hiện system call sẽ khác nhau tùy thuộc vào nơi nó được sử dụng, nhưng API chỉ cần trả về các đối số. Tính chất này được gọi là Portablility (di động).

Nói cách khác, system call, tức là giao diện cuộc gọi, đảm bảo tính di động và quản lý các phiên bản ứng dụng người dùng, v.v., vì nó được thiết kế theo giao thức chuẩn cho từng hệ điều hành.

>  Từ đây hiểu sao lại có Windows API, POSIX API, JAVA API, v.v

## System Call Type

### 1. Quản lý tiến trình (Process Control)

- Thoát (exit), huỷ (abort)
- Tải (load), thực thi (execute)
- Tạo process - fork
- Lấy và đặt các thuộc tính của process
- Thời gian chờ (wait time)
- Chờ sự kiện (wait event)
- Phát tín hiệu sự kiện (signal event)
- Cấp phát và giải phóng bộ nhớ (malloc, free)

### 2. Quản lý file (File Manipulation)

- Tạo, xoá (create, delete)
- Mở, đóng, đọc, ghi (open, close, read, write)
- Thay đổi vị trí (reposition)
- Lấy và sửa thông tin file (get file attribute, set file attribute)

### 3. Quản lý thiết bị (Device Manipulation)

- Nhận thông tin trạng thái và kiểm soát phần cứng (ioctl)
- Yêu cầu thiết bị (request device), giải phóng thiết bị (release device)
- Đọc (read), ghi (write), thay đổi vị trí
- Lấy và đặt thuộc tính thiết bị  
- Gắn (attach) và tách (detach) các thiết bị

### 4. Bảo trì thông tin (Information Maintenance)

- getpid(), alarm(), sleep()
- Cài đặt và lấy thời gian (time)
- Cài đặt và lấy dữ liệu hệ thống(date)
- Thu thập và thiết lập các tệp tiến trình và thuộc tính thiết bị

### 5. Giao tiếp (Communication)

- pipe(), shm_open(), mmap()
- Tạo và loại bỏ các kết nối truyền thông
- Gửi và nhận tin nhắn
- Truyền thông tin trạng thái
- Gắn và tháo thiết bị từ xa

### 6. Bảo vệ (Protection)

- chmod()
- unmask()
- chown()

[![](https://github.com/devSquad-study/2023-CS-Study/raw/main/OS/img/os_system_call_command.png)](https://github.com/devSquad-study/2023-CS-Study/blob/main/OS/img/os_system_call_command.png)

Và còn rất nhiều system call khác, vui lòng tham khảo: [https://thevivekpandey.github.io/posts/2017-09-25-linux-system-calls.html](https://thevivekpandey.github.io/posts/2017-09-25-linux-system-calls.html)

## Ví dụ về System Call

```sh
cp in.txt out.txt
```

Người dùng nhập dòng lệnh (command line) trên bằng bàn phím, Linux nhận đầu vào từ người dùng. Trong trường hợp này, I/O system call được sử dụng.

Khi lệnh `cp` được thực thi, một system call được gọi để kiểm tra xem tệp in.txt có thể truy cập được từ thư mục hiện tại hay không.

Nếu tập tin không tồn tại thì sẽ báo lỗi và kết thúc chương trình, lúc này sử dụng system call.

Nếu tệp tồn tại, nó sẽ kiểm tra xem có tồn tại tệp output.txt hay không? Để lưu tệp đã sao chép.

Và tại thời điểm này, nó cũng được kiểm tra thông qua system call để kiểm tra xem tên tệp có tồn tại hay không.

Nếu tệp đã tồn tại, bạn có thể hỏi người dùng xem có nên ghi đè hoặc nối tệp đó không.

Nếu tên của tệp được lưu không trùng nhau, tệp phải được lưu, nhưng một system call cũng được sử dụng tại thời điểm này.

![Pasted image 20230601171030](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601171030.png)

## Quy trình hoạt động system call

![Pasted image 20230601172832](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601172832.png)

1. Lời gọi system call từ chương trình ứng dụng (thường được gói gọn trong dạng API nên có thể sử dụng mà không cần biết) -> xảy ra interrupt 0x80
2. Trong IDT (Interrupt Descripter Table: dùng để xác định loại interrupt), interrupt 0x80 là `system_call()` nên kernel thực hiện một hành động liên quan đến system call -> cần có các tham số bổ sung để phân biệt system call.
3. Cách truyền tham số:
	1. Chuyển tham số vào register
		- Tuy nhiên, phương pháp này không phù hợp vì có những trường hợp số lượng tham số vượt quá số lượng register.  
	2. Đặt các tham số vào bộ nhớ liền kề (block) hoặc rời rạc (table) và sau đó đặt địa chỉ vào thanh ghi.  
		- Không có giới hạn kích thước lớn hơn, vì vậy nó được sử dụng rộng rãi  
	3. Đặt tham số vào stack  
		- Kết quả là, không có nhiều khác biệt so với phương pháp đầu tiên, bởi vì tất cả dữ liệu trong stack phải được chuyển đến các register và các phần tử phải được lưu trữ trong stack.  
	**-> Phương pháp thứ 2 được sử dụng rất nhiều!!**

**Giới thiệu fork()**:

- `fork()` được tạo bởi OS.
- `fork()` nhân bản và sinh ra một tiến trình khác.
- Khi hàm `fork()` được gọi, một tiến trình con được tạo.
- Tại thời điểm này, các giá trị còn lại ngoại trừ giá trị `pid` được sao chép.
- Giá trị pid của tiến trình con luôn là `0` !!
- Nếu tiến trình con không trả về, điều đó có nghĩa là `-1`. (Trong trường hợp hàm `fork()` không được chạy)
