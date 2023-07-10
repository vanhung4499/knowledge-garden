---
categories: [network, computer-science]
title: Proxy Server
date created: 2023-05-28
date modified: 2023-07-10
tags: [network, computer-science]
---

Khi máy khách kết nối với máy chủ, máy chủ không kết nối trực tiếp mà trung chuyển qua proxy ở giữa

![Pasted image 20230528015410](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230528015410.png)

## 1. Nguyên lý hoạt động

1. Yêu cầu: Người dùng nhập tên miền trong trình duyệt web.  
2. Chuyển tiếp: Chuyển tiếp yêu cầu đến Proxy Server hoạt động như một bộ đệm.
3. Kiểm tra: Kiểm tra xem trang chủ tên miền có trong Proxy Server hay không.  
4. Nếu có:  
	- Kiểm tra xem trang web trên máy chủ có phải là phiên bản mới nhất không  
	- Chỉ lấy những phần được cập nhật nếu cần
5. Nếu không có:  
	- Nó kết nối với máy chủ nơi đặt trang chủ và tìm nạp trang.

## 2. Tại sao Proxy Server lại cần thiết?

### Bảo mật: Lọc yêu cầu và phản hồi

![Pasted image 20230528015950](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230528015950.png)

- Nếu bạn không sử dụng Proxy Server, địa chỉ máy chủ dễ bị lộ và người dùng ẩn danh khác dễ dàng truy cập máy chủ.  
- Có thể ẩn IP máy chủ khi Proxy Server được chuyển qua  
- Proxy Server cũng có thể được sử dụng làm tường lửa (Proxy Firewall)  

#### Tường lửa (firewall)

- Một hệ thống an ninh mạng theo dõi và kiểm soát lưu lượng truy cập mạng vào và ra dựa trên các quy tắc bảo mật.  
- Tạo thành một rào cản giữa mạng nội bộ đáng tin cậy và mạng bên ngoài không đáng tin cậy

#### Proxy Firewall  

- Để kiểm tra tác hại của thông tin có trong phiên  
- Cách tường lửa kết thúc phiên và tạo phiên mới  
- Một phương pháp chặn phiên từ nguồn đến đích, tạo hai phiên, một từ nguồn đến tường lửa và một từ tường lửa đến đích, sau đó thực hiện kiểm tra trước khi chuyển thông tin từ phiên này sang phiên khác.  
- So với các bộ lọc gói tin, nó áp đặt tải cao hơn, do đó chậm hơn, nhưng có thể kiểm tra nhiều hơn.  
- Có thể thực hiện các chức năng bổ sung như thay đổi giao thức

### Xử lý phân tán: Cân bằng tải bằng bộ đệm

![Pasted image 20230528020509](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230528020509.png)

- Một số Proxy Server sử dụng bộ đệm để lưu trữ các yêu cầu được gửi đến Proxy Server.
- Cần có một kết nối riêng với máy chủ để yêu cầu lại nội dung được lưu trữ trong bộ đệm. X -> Ngăn chặn tắc nghẽn bằng cách tiết kiệm thời gian truyền và giảm lưu lượng truy cập bên ngoài cho máy chủ.

### Che giấu

![Pasted image 20230528020820](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230528020820.png)

Khi client 1, 2 và 3 giao tiếp trực tiếp với Internet, IP của họ được tiếp xúc trực tiếp với Internet. Đây chắc chắn là một lỗ hổng bảo mật.

Nếu bạn đặt Proxy Server ở giữa, bạn sẽ không biết IP của máy client vì máy chủ internet giao tiếp với Proxy Server!

Điều này có thể bao gồm các lỗ hổng bảo mật và cũng phục vụ để cho phép truy cập bằng cách bỏ qua một máy chủ cụ thể.

### ACL: Chính sách truy cập trang web

ACL (Access Control List): Tùy chọn đặt phạm vi có thể truy cập Proxy Server

Bạn có thể xác định chính sách truy cập để truy cập trang web.

> Danh sách kiểm soát truy cập (**access control list, ACL**) hoặc danh sách kiểm soát truy cập  

> Danh sách các quyền được áp dụng cho một đối tượng hoặc thuộc tính đối tượng. Danh sách này chỉ định ai hoặc cái gì được phép truy cập một đối tượng và những thao tác nào được phép thực hiện trên đối tượng.

## 3. Phân loại

### Forward Proxy

![Pasted image 20230528021450](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230528021450.png)

- Forwarding Proxy thường được gọi là Proxy.
- Thay vì các máy khách truy cập Internet trực tiếp, proxy server chuyển tiếp nhận yêu cầu, kết nối với Internet và gửi kết quả cho máy khách.  
	- ví dụ) Khi người dùng muốn kết nối với `facebook.com`, **Forward Proxy Server** sẽ nhận yêu cầu, kết nối với `facebook.com` và gửi kết quả cho người dùng thay vì kết nối với internet.  
- Lưu dữ liệu vào bộ nhớ cục bộ  
- Client host phải sử dụng trình duyệt web đang sử dụng để thiết lập sử dụng proxy server => Có thể nhận diện được việc sử dụng  
- Giảm sử dụng băng thông  
- Xử lý và chi phí thực hiện chính sách truy cập (ACL) thấp  
- Chỉ có thể kết nối các trang được chỉ định, giới hạn môi trường sử dụng web => **Được sử dụng rộng rãi trong môi trường doanh nghiệp**

### Reverse Proxy

![Pasted image 20230528021909](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230528021909.png)

> Reverse ở đây có nghĩa là 'đằng sau, phía sau' chứ không phải 'đảo ngược'.

- Bạn cũng có thể coi Forward Proxy hiện có ở phía máy chủ.
- Khi máy khách yêu cầu dữ liệu từ Internet, Reverse Proxy sẽ nhận yêu cầu, nhận dữ liệu từ máy chủ nội bộ và chuyển tiếp đến máy khách.
	- ví dụ) Khi người dùng yêu cầu dữ liệu từ dịch vụ web facebook.com, Reverse Proxy sẽ nhận yêu cầu, nhận dữ liệu từ máy chủ nội bộ và gửi dữ liệu cho người dùng.  
- Khách nhận thấy rằng họ được kết nối với proxy server X, cảm thấy như thể người dùng cuối có quyền truy cập trực tiếp vào tài nguyên được yêu cầu
- Máy khách chỉ cần thực hiện các yêu cầu đối với Reverse Proxy mà không cần biết bất kỳ thông tin nào về máy chủ nội bộ.
- Máy chủ nội bộ có thể cung cấp dịch vụ trực tiếp, nhưng lý do phải làm như vậy là vì lý do bảo mật.
	- Trong môi trường mạng của công ty tồn tại một bộ phận nằm giữa mạng nội bộ và mạng bên ngoài được gọi là DMZ.
	- Các máy chủ cung cấp các dịch vụ bên ngoài như Mail Server, Web Server và FTP Server thường nằm trong bộ phận này.  
	- Nếu bạn truy cập trực tiếp vào **WAS**, vấn đề hack có thể xảy ra vì bạn có thể truy cập DB.  
	- Người ta thường đặt Reverse Proxy Server trong DMZ và đặt Service Server thực trên mạng nội bộ trước khi cung cấp dịch vụ.  
- Cài đặt cho máy chủ nội bộ thuận lợi cho việc cân bằng tải hoặc mở rộng máy chủ
- Tốt cho mã hóa SSL
	- Ban đầu, khi máy chủ giao tiếp với máy khách, việc mã hóa và giải mã bằng SSL (hoặc TSL) rất tốn kém.  
	- Tuy nhiên, việc sử dụng Reverse Proxy sẽ giải mã tất cả các request gửi đến và mã hóa các response gửi đi, cho phép liên lạc an toàn với máy khách và giảm gánh nặng cho Root Server.

#### Load Balancing

Cân bằng tải hoạt động trên máy chủ khi xử lý phản hồi cho yêu cầu.  
Để giảm tải rất nhiều công việc đang được thực hiện, sử dụng NGinx làm bộ cân bằng tải.

![Pasted image 20230528170024](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230528170024.png)

Hình tròn màu cam: công việc

- Lượng công việc cần phân bổ: 9  
- Giảm thiểu tải công việc bằng cách cho phép mỗi máy chủ xử lý 3 với công việc: cân bằng tải  
- Mở rộng quy mô phương pháp phân phối khối lượng công việc bằng cách thêm các máy chủ bổ sung: **Scale-Out**  
- Nâng cấp mở rộng quy mô bằng cách mở rộng hiệu năng của máy chủ hiện có, chứ không phải thêm máy chủ: **Scale-Up**

### Sự khác biệt

1. End Point:
	- Forward: Điểm cuối mà khách hàng yêu cầu là miền máy chủ thực và proxy chịu trách nhiệm liên lạc giữa hai bên
	- Reverse: Điểm cuối do khách hàng yêu cầu là miền proxy server và thông tin máy chủ thực tế không xác định.
2. Che giấu:
	- Forward: Client
	- Reverse: Server  
3. Mục tiêu truyền thông  
	- Forward: Client và Proxy Server giao tiếp và đưa dữ liệu ra bên ngoài vào Internet.  
	- Reverse: Proxy Server và máy chủ mạng nội bộ liên lạc với nhau và khi có request đến qua Internet, proxy server sẽ nhận và phản hồi.
