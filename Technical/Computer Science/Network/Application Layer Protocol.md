---
title: Application Layer Protocol
tags:
  - network
  - computer-science
categories: " network, computer-science"
date created: 2023-09-17
date modified: 2023-09-17
---

# Tổng quan về các giao thức lớp ứng dụng (Application layer)

## HTTP: Giao thức truyền tải siêu văn bản

**HTTP (HyperText Transfer Protocol)** là một giao thức được sử dụng để truyền tải siêu văn bản và nội dung đa phương tiện, chủ yếu được thiết kế để giao tiếp giữa trình duyệt web và máy chủ web. Khi chúng ta sử dụng trình duyệt để duyệt web, trang web của chúng ta được tải thông qua yêu cầu HTTP.

HTTP sử dụng mô hình client-server, trong đó client gửi yêu cầu HTTP (HTTP request) và server trả về phản hồi HTTP (HTTP response).  Toàn bộ quá trình diễn ra như hình dưới đây.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230917111733.png)

HTTP dựa trên giao thức TCP, trước khi gửi yêu cầu HTTP, trước tiên phải thiết lập kết nối TCP, còn được gọi là bắt tay 3 bước. Hiện tại, hầu hết các phiên bản HTTP đều sử dụng phiên bản 1.1. Trong phiên bản 1.1, mặc định đã bật chế độ Keep-Alive, điều này cho phép kết nối được tái sử dụng trong nhiều yêu cầu.

Ngoài ra, HTTP là một giao thức **không trạng thái**, nghĩa là nó không thể ghi nhớ trạng thái của client, thông thường chúng ta sử dụng session để ghi nhớ trạng thái của client.

Để tìm hiểu chi tiết hơn, vui lòng xem bài viết [[HTTP]]

## SMTP: Giao thức truyền tải thư điện tử đơn giản

**Giao thức truyền tải thư điện tử đơn giản (SMTP - Simple Mail Transfer Protocol)** là một giao thức dựa trên TCP được sử dụng để gửi thư điện tử.

![Giao thức SMTP](https://oss.javaguide.cn/github/javaguide/cs-basics/network/what-is-smtp.png)

Lưu ý: **Giao thức để nhận thư điện tử không phải là SMTP mà là giao thức POP3.**

Phần này liên quan đến nhiều nội dung về giao thức SMTP, dưới đây là hai câu hỏi quan trọng:

1. Quá trình gửi thư điện tử
2. Làm thế nào để xác định một địa chỉ email có tồn tại thực sự hay không?

**Quá trình gửi thư điện tử?**

Ví dụ, địa chỉ email của tôi là "vanhung4499@gmail.com" và tôi muốn gửi email đến "abcd@outlook.com". Quá trình này có thể được chia thành các bước đơn giản như sau:

1. Sử dụng giao thức **SMTP**, tôi gửi email đã viết sẵn cho máy chủ hòm thư của 163 (bưu điện).
2. Máy chủ hòm thư 163 nhận ra rằng địa chỉ email tôi gửi đến là hòm thư của outlook, sau đó sử dụng giao thức SMTP để chuyển tiếp email của tôi đến máy chủ hòm thư của outlook.
3. Sau khi máy chủ hòm thư của qq nhận được email, nó thông báo cho người dùng có hòm thư là "abcd@outlook.com" đến nhận email, sau đó người dùng sử dụng giao thức **POP3/IMAP** để lấy email ra.

**Làm thế nào để xác định một địa chỉ email có tồn tại thực sự hay không?**

Trong nhiều tình huống (như tiếp thị qua email), chúng ta cần xác định xem địa chỉ email mà chúng ta muốn gửi có tồn tại thực sự hay không, trong trường hợp này chúng ta có thể sử dụng giao thức SMTP để kiểm tra:

1. Tìm địa chỉ máy chủ SMTP tương ứng với tên miền email.
2. Thử kết nối với máy chủ.
3. Sau khi kết nối thành công, thử gửi email đến địa chỉ email cần xác minh.
4. Dựa trên kết quả trả về, xác định tính hợp lệ của địa chỉ email.

Dưới đây là một số công cụ trực tuyến để kiểm tra tính hợp lệ của địa chỉ email:

1. https://verify-email.org/
2. https://www.verifyemailaddress.org/

## POP3/IMAP: Giao thức nhận thư điện tử

Hai giao thức này không cần phải giải thích quá nhiều, chỉ cần hiểu rằng **POP3 và IMAP đều là giao thức dùng để nhận thư điện tử** (cả hai đều dựa trên giao thức TCP). Ngoài ra, cần lưu ý không nhầm lẫn hai giao thức này với giao thức SMTP. **Giao thức SMTP chỉ chịu trách nhiệm gửi thư điện tử, giao thức thực sự chịu trách nhiệm nhận thư là POP3/IMAP.**

Giao thức IMAP là một giao thức cập nhật hơn so với POP3, nó mạnh mẽ hơn về tính năng và hiệu suất. IMAP hỗ trợ các tính năng nâng cao như tìm kiếm, đánh dấu, phân loại, lưu trữ thư và có thể đồng bộ trạng thái thư qua nhiều thiết bị. Gần như tất cả các ứng dụng và máy chủ thư điện tử hiện đại đều hỗ trợ IMAP.

## FTP: Giao thức truyền tải tập tin

**Giao thức truyền tải tập tin (FTP - File Transfer Protocol)** là một giao thức dựa trên TCP được sử dụng để truyền tải tập tin giữa các máy tính, và nó có thể ẩn đi sự khác biệt về hệ điều hành và cách lưu trữ tập tin.

FTP được thiết kế dựa trên mô hình client-server, trong đó thiết lập hai kết nối giữa khách hàng và máy chủ FTP. Nếu chúng ta muốn phát triển một phần mềm truyền tải tập tin dựa trên giao thức FTP, trước tiên chúng ta cần hiểu nguyên lý hoạt động của FTP. Về nguyên lý hoạt động của FTP, đã có nhiều sách mô tả rất chi tiết:

> Điểm đặc biệt và cũng là điểm khác biệt lớn nhất của FTP so với các chương trình client-server khác là nó sử dụng hai kết nối TCP (các chương trình client-server khác thường chỉ sử dụng một kết nối TCP):
>
> 1. Kết nối điều khiển: Dùng để truyền tải thông tin điều khiển (lệnh và phản hồi).
> 2. Kết nối dữ liệu: Dùng để truyền tải dữ liệu.

Ý tưởng này của việc tách lệnh và dữ liệu giúp cải thiện hiệu suất của FTP đáng kể.

![Quy trình làm việc của FTP](https://raw.githubusercontent.com/vanhung4499/images/master/snap/ftp.png)

Lưu ý: FTP là một giao thức không an toàn, vì nó không mã hóa dữ liệu trong quá trình truyền tải. Do đó, các tập tin được truyền tải qua FTP có thể bị nghe trộm hoặc bị sửa đổi. Đề nghị sử dụng các giao thức an toàn hơn như SFTP (một giao thức truyền tải tập tin an toàn dựa trên giao thức SSH) khi truyền tải dữ liệu nhạy cảm trên mạng.

## Telnet: Giao thức đăng nhập từ xa

**Giao thức Telnet** là một giao thức dựa trên TCP được sử dụng để đăng nhập từ xa vào các máy chủ khác thông qua một terminal. Một trong những hạn chế lớn nhất của giao thức Telnet là tất cả dữ liệu (bao gồm tên người dùng và mật khẩu) được gửi dưới dạng văn bản thô, điều này tiềm ẩn rủi ro về bảo mật. Đây là lý do tại sao hiện nay ít sử dụng Telnet và thay vào đó sử dụng giao thức truyền tải mạng SSH rất an toàn.

![Telnet: Giao thức đăng nhập từ xa](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Telnet_is_vulnerable_to_eavesdropping-2.png)

## SSH: Giao thức truyền tải mạng an toàn

**SSH (Secure Shell)** là một giao thức dựa trên TCP, sử dụng các cơ chế mã hóa và xác thực để đảm bảo an toàn trong việc truy cập và truyền tải tập tin qua mạng.

SSH được sử dụng phổ biến để đăng nhập từ xa vào máy tính từ xa và thực hiện các lệnh. Ngoài ra, SSH cũng hỗ trợ giao thức tunneling, port forwarding và kết nối X11. Sử dụng các giao thức SFTP hoặc SCP, SSH cũng cho phép truyền tải tập tin.

SSH sử dụng mô hình khách hàng-máy chủ, với cổng mặc định là 22. SSH là một tiến trình dịch vụ, lắng nghe các yêu cầu từ khách hàng và xử lý chúng. Hầu hết các hệ điều hành hiện đại đều cung cấp SSH.

![SSH: Giao thức truyền tải mạng an toàn](https://raw.githubusercontent.com/vanhung4499/images/master/snap/ssh-client-server.png)

## RTP: Giao thức truyền tải thời gian thực

RTP (Real-time Transport Protocol, giao thức truyền tải thời gian thực) thường được xây dựng trên giao thức UDP, nhưng cũng hỗ trợ giao thức TCP. Nó cung cấp khả năng truyền tải dữ liệu thời gian thực từ điểm này đến điểm khác, nhưng không bao gồm tính năng đặt trước tài nguyên và không đảm bảo chất lượng truyền tải thời gian thực, những tính năng này được WebRTC thực hiện.

Giao thức RTP được chia thành hai giao thức con:

- **RTP (Real-time Transport Protocol, giao thức truyền tải thời gian thực)**: Dùng để truyền tải dữ liệu có tính chất thời gian thực.
- **RTCP (RTP Control Protocol, giao thức điều khiển RTP)**: Cung cấp thông tin thống kê trong quá trình truyền tải thời gian thực (như độ trễ mạng, tỷ lệ mất dữ liệu, v.v.), và WebRTC sử dụng thông tin này để xử lý việc mất dữ liệu.

## DNS: Hệ thống tên miền

DNS (Domain Name System, hệ thống tên miền) dựa trên giao thức UDP và được sử dụng để giải quyết vấn đề ánh xạ giữa tên miền và địa chỉ IP.

![Pasted image 20230528144958](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%2520image%252020230528144958.png)
