---
categories: [network, computer-science]
title: Network Basic
date created: 2023-05-26
date modified: 2023-07-10
tags: [network, computer-science]
---

## Network là gì?

Network hay mạng đề cập đến một hệ thống được thiết lập bởi các thiết bị như máy tính sử dụng công nghệ truyền thông. Một tập hợp các nút (node) và được kết nối với nhau (link) và chia sẻ tài nguyên.

> Hình dung mạng như mạng nhện!

## Thông lượng và độ trễ

### Một mạng tốt là như thế nào?

Một mạng có thể xử lý thông lượng cao, độ trễ thấp, tần suất lỗi thấp và bảo mật tốt.

### Thông lượng (Throughput)

Là lượng dữ liệu trên mỗi đơn vị thời gian được truyền qua mạng

Đơn vị là bps(bits per second). Số bit được truyền hoặc nhận mỗi giây.

Thông lượng bị ảnh hưởng bởi lưu lượng truy cập tăng lên với mỗi kết nối của người dùng, băng thông (bandwidth) giữa các thiết bị mạng (số bit tối đa có thể truyền qua kết nối mạng trong một khoảng thời gian cụ thể), lỗi xảy ra ở giữa mạng và thông số kỹ thuật phần cứng của thiết bị.

![Pasted image 20230526175729](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230526175729.png)

### Độ trễ (Latency)

Độ trễ là thời gian một gói tin được xử lý và thời gian cần thiết để nó thực hiện hành trình khứ hồi giữa hai thiết bị.

Bị ảnh hưởng bởi kiểu kết nối (có dây, không dây), kích thước gói và thời gian xử lý gói của router.

## Đồ hình mạng

Đồ hình mạng đề cập đến cách thức bố trí các liên kết của các nút và loại kết nối.

### Mạng có cấu trúc cây (Hierachical Topology)

Một đồ hình mạng mạng được trình bày dưới dạng cây, được gọi là cấu trúc liên kết phân cấp

Việc thêm và xóa các nút rất dễ dàng và khi lưu lượng tập trung vào một nút cụ thể, nó có thể ảnh hưởng đến các nút phụ.

![Pasted image 20230526181110](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230526181110.png)

### Mạng hình tuyến (Bus Topology)

Một đồ hình mạng trong đó nhiều nút được kết nối và chia sẻ bởi một đường truyền thông trung tâm duy nhất.

Được sử dụng trong mạng cục bộ (LAN).

Chi phí lắp đặt thấp, độ tin cậy tuyệt vời, dễ dàng thêm và xóa các nút trên đường truyền thông trung tâm. Tuy nhiên, giả mạo là có thể.

![Pasted image 20230526181058](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230526181058.png)

### Mạng dạng hình sao (Star Topology)

Một đồ hình mạng được kết nối với một nút trung tâm.

Dễ dàng thêm các nút và phát hiện lỗi và ít có khả năng xung đột các gói. Ngay cả khi bất kỳ nút nào bị lỗi, lỗi có thể dễ dàng được tìm thấy. Nếu nút bị lỗi không phải là nút trung tâm, các nút khác sẽ ít bị ảnh hưởng hơn. Trong trường hợp nút trung tâm bị lỗi, toàn bộ mạng bị tê liệt và chi phí lắp đặt cao.

![Pasted image 20230526181118](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230526181118.png)

### Mạnh dạng vòng (Ring Topology)

Một đồ hình mạng trong đó mỗi nút kết nối với hai nút ở hai bên để liên lạc qua một đường dẫn liên tục giống như một vòng tổng thể. Dữ liệu di chuyển từ nút này sang nút khác và mỗi nút xử lý các gói thông qua một đường dẫn hình vòng.

Ngay cả khi số lượng nút tăng lên, hầu như không có tổn thất nào trên mạng, ít có khả năng xảy ra va chạm và rất dễ phát hiện lỗi nút.

Rất khó để thay đổi cấu hình mạng và nếu một đường bị lỗi, nó sẽ ảnh hưởng đến toàn bộ mạng.

![Pasted image 20230526181219](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230526181219.png)

### Mạng dạng lưới (Mesh Topology)

Một đồ hình mạng giống như lưới

Ngay cả khi một thiết bị đầu cuối bị lỗi, vẫn tồn tại nhiều tuyến đường, vì vậy mạng có thể tiếp tục được sử dụng và phân phối lưu lượng có thể được xử lý.

Khó thêm nút, chi phí xây dựng và vận hành cao

![Pasted image 20230526181351](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230526181351.png)

## Tắc nghẽn

Tắc nghẽn, thắt cổ chai (bottleneck) là hiện tượng trong đó hiệu suất hoặc công suất của toàn bộ hệ thống bị giới hạn bởi một thành phần.

Khi một dịch vụ mở một sự kiện, nó sẽ tạo ra rất nhiều lưu lượng truy cập và nếu lưu lượng đó không được quản lý tốt, nó sẽ trở thành nút thắt cổ chai và ngăn cản người dùng truy cập trang web.

Topology rất quan trọng vì nó là một tiêu chí quan trọng khi tìm ra các nút thắt cổ chai.

- Mạng ban đầu  

![before_line](https://raw.githubusercontent.com/vanhung4499/images/master/snap/before_line.png)  

- Sau khi thêm một đường dây  

![after_line](https://raw.githubusercontent.com/vanhung4499/images/master/snap/after_line.png)

Kiểm tra topology và giải quyết tắc nghẽn bằng cách thêm đường giữa các máy chủ và kết nối với cổng. Bạn cần biết mạng có cấu trúc liên kết nào và mạng bao gồm những tuyến nào để bạn có thể giải quyết tắc nghẽn một cách chính xác.

## Phân loại mạng

Mạng có thể được phân loại dựa trên kích thước:

- **LAN (Local Area Network)**: kích thước có thể được sở hữu bởi các văn phòng hoặc gia đình
	- Có nghĩa là mạng cục bộ. Hoạt động trong không gian hạn chế như cùng một tòa nhà hoặc khuôn viên. Tốc độ truyền nhanh và ít bị tắc nghẽn.
- **MAN (Metropolitan Area Network)**: Quy mô của một thành phố như HCM  
	- Đại diện cho một mạng khu vực đô thị, hoạt động trong một khu vực rộng lớn như thành phố, với tốc độ truyền trung bình. Đông đúc hơn mạng LAN.  
- **WAN (Wide Area Network)**: quy mô thế giới  
	- Hoạt động ở những khu vực rộng lớn như quốc gia hay châu lục. Tốc độ đường truyền chậm hơn và tắc nghẽn hơn so với MAN.

## Network command line

Đôi khi không có vấn đề gì trong mã ứng dụng nhưng người dùng không thể lấy dữ liệu từ dịch vụ, đây có thể là một nút thắt cổ chai mạng.

Nguyên nhân chính của tắc nghẽn

- Băng thông mạng  
- Đồ hình mạng
- CPU, RAM máy chủ  
- Cấu hình mạng không hiệu quả  

Cần phải phân tích hiệu suất mạng sau khi xác nhận rằng đó là **sự cố do mạng gây ra** thông qua các thử nghiệm liên quan đến mạng và các thử nghiệm không liên quan đến mạng.

### 1. ping

ping(Packet INternet Groper) là lệnh gửi một gói có kích thước nhất định đến nút đích để kiểm tra trạng thái mạng. Bạn có thể biết trạng thái nhận gói của nút tương ứng và thời gian cho đến khi nó đến, đồng thời bạn có thể kiểm tra xem mạng có được kết nối tốt với nút tương ứng hay không. Ping hoạt động thông qua giao thức ICMP giữa các giao thức TCP/IP.

Kiểm tra ping không khả dụng cho các mục tiêu chặn ICMP hoặc theo dõi theo chính sách mạng.

![Pasted image 20230526184340](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230526184340.png)

### 2. netstat

Lệnh netstat được sử dụng để hiển thị trạng thái mạng của các dịch vụ được kết nối và hiển thị danh sách các kết nối mạng, bảng định tuyến và giao thức mạng. Chủ yếu được sử dụng để kiểm tra xem cổng của dịch vụ có đang mở hay không.

### 3. nslookup

Dùng để kiểm tra các nội dung liên quan đến DNS. Được sử dụng để kiểm tra IP được ánh xạ tới một tên miền cụ thể.

![Pasted image 20230526184440](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230526184440.png)

### 4. tracert

Nó được thực thi bằng lệnh tracert trên Windows và traceroute trên Linux/Unix. Một lệnh được sử dụng để kiểm tra đường dẫn mạng đến nút đích. Có thể kiểm tra phần nào trong số các phần đến nút đích làm chậm thời gian phản hồi.

![Pasted image 20230526184556](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230526184556.png)
