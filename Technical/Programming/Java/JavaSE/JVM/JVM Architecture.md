---
title: JVM Architecture
tags: [java, javase, jvm]
categories: [java, javase, jvm]
date created: 2023-07-10
date modified: 2023-07-18
---

# Kiến trúc JVM

> JVM có thể hoạt động trên nhiều nền tảng khác nhau chủ yếu là do JVM ẩn đi sự khác biệt giữa phần mềm và phần cứng của các nền tảng máy tính.

## Giới thiệu về JVM

### Kiến trúc máy tính

Phần lõi của kiến trúc máy tính thực tế bao gồm:

- Bộ chỉ thị
- Đơn vị tính toán (CPU)
- Phương pháp địa chỉ
- Bộ đăng ký
- Đơn vị lưu trữ

### Giới thiệu về kiến trúc JVM

Kiến trúc JVM tương tự như kiến trúc máy tính, nó bao gồm:

- Bộ chỉ thị JVM
- Trình tải lớp
- Môi trường thực thi - Tương đương với CPU của JVM
- Khu vực bộ nhớ - Lưu trữ của JVM
- Gọi phương thức cục bộ - Gọi phương thức cục bộ được triển khai bằng C/C++

## Kiến trúc Hotspot

Hotspot là JVM phổ biến nhất.

Các thành phần chính của máy ảo Java bao gồm **trình tải lớp**, **khu vực bộ nhớ thời gian chạy** và **môi trường thực thi**.

Máy ảo Hotspot có một kiến trúc mạnh mẽ, cung cấp nền tảng cơ bản cho các tính năng và khả năng mạnh mẽ. Ví dụ, trình biên dịch JIT của máy ảo Hotspot tạo ra mã máy cục bộ tối ưu trong quá trình thực thi ứng dụng Java, nghĩa là chúng tạo ra các hướng dẫn máy cục bộ hiệu suất cao cho kiến trúc hệ thống cơ bản. Ngoài ra, với sự tiến hóa và thiết kế liên tục của môi trường thời gian chạy và thu gom rác đa luồng, máy ảo Hotspot đã tạo ra khả năng mở rộng cao trên các hệ thống tính toán có khả năng sử dụng cao.

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/images/dev/cs/java/javacore/jvm/jvm-hotspot-architecture.png" />
</div>

### Các thành phần quan trọng của Hotspot

Máy ảo Java có ba thành phần quan trọng quan tâm đến khi nào thực hiện tối ưu hóa hiệu suất, không gian heap là nơi lưu trữ đối tượng, khu vực này được quản lý bởi bộ thu gom rác được chọn khi khởi động và hầu hết các tùy chọn tinh chỉnh liên quan đến việc điều chỉnh kích thước heap và chọn bộ thu gom rác phù hợp với tình huống của bạn. Trình biên dịch JIT cũng có ảnh hưởng lớn đến hiệu suất, nhưng rất ít khi cần điều chỉnh khi sử dụng phiên bản mới của máy ảo Java.

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/images/dev/cs/java/javacore/jvm/jvm-hotspot-key-components.png" />
</div>

### Các chỉ số hiệu suất

Có hai chỉ số hiệu suất chính của máy ảo Java:

- **Thời gian tạm dừng** - Thời gian phản hồi là tốc độ mà một ứng dụng phản hồi yêu cầu. Đối với các ứng dụng quan tâm đến khả năng phản hồi, thời gian tạm dừng lâu là không chấp nhận được, điểm quan trọng là có thể phản hồi trong một khoảng thời gian ngắn.
	- Tốc độ phản hồi sự kiện giao diện người dùng trên máy tính để bàn
	- Tốc độ trả về trang web
	- Tốc độ truy vấn dữ liệu trả về
- **Khả năng xử lý** - Khả năng xử lý quan tâm đến giá trị tối đa của công việc mà một ứng dụng có thể hoàn thành trong một khoảng thời gian cụ thể. Đối với các ứng dụng quan tâm đến khả năng xử lý, thời gian tạm dừng lâu có thể chấp nhận được. Vì ứng dụng có khả năng xử lý cao quan tâm đến giá trị cơ sở trên một khoảng thời gian dài, nên thời gian phản hồi nhanh không được xem xét.
	- Số lượng giao dịch hoàn thành trong một khoảng thời gian cụ thể
	- Số công việc hoàn thành bởi chương trình xử lý hàng loạt trong một giờ
	- Số lượng truy vấn dữ liệu hoàn thành trong một giờ
