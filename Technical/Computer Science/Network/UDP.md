---
categories: [network, computer-science]
title: UDP
date created: 2023-05-25
date modified: 2023-07-10
tags: [network, computer-science]
---

## UDP là gì?

**UDP** là viết tắt của **User Datagram Protocol** và nằm trong tầng transport, Layer 4 trong OSI.

Nó là một giao thức trái ngược với TCP, kém tin cậy hơn và không đảm bảo tính đầy đủ. Tuy nhiên, nó có ưu điểm là nhanh.

## Đặc điểm

UDP cung cấp dịch vụ Datagram không kết nối (connection less), không đáng tin cậy và không có thứ tự.

Đơn vị truyền dữ liệu là message. (Đơn vị truyền dữ liệu của TCP là segemnt)

### UDP Header

![Pasted image 20230526005104](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230526005104.png)

UDP Header rất đơn giản so với TCP Header.

Có số source/destination port và length bằng byte.

Checksum là tùy chọn và nếu checksum là 0, người nhận sẽ không tính toán checksum.

Theo mặc định, các UDP Header chỉ sử dụng kích thước cố định là 8 byte và việc xử lý header không mất nhiều thời gian.

### Những điểm UDP không có

- Thiết lập/phá bỏ kết nối **(Connection setup/teardown)**
	- Nó là một giao thức không kết nối, không yêu cầi phải bắt tay 3 bước (3-way hanshake) như TCP.
	- Do đó, nó thường được gọi là giao thức cho tầng vận chuyển hướng datagram.
- Thông báo hoàn thành việc tiếp nhận (Acknowledgement)
	- Không có hành động xác nhận để đảm bảo rằng message đã đến chính xác.  
- Truyền lại **(Flow Control)**
- Kiểm soát tắc nghẽn **(Congestion Control)**
	- Vì phản hồi cho điều khiển luồng không được cung cấp và không có chức năng phát hiện và kiểm soát lỗi đặc biệt, nên chương trình sử dụng UDP phải có chức năng kiểm soát lỗi riêng.
- Gửi theo thứ tự **(In-order delivery)**
	- Không giống TCP Header, không có trường số thứ tự vì không có điều khiển trình tự để căn chỉnh trình tự của các thông báo nhận được.
- **Fragmentation**

### Các tính năng chính của UDP

- **Real-time**
	- UDP thích hợp cho các ứng dụng thời gian thực đòi hỏi yêu cầu và phản hồi nhanh.
	- Điều này là do nó có ít ràng buộc và rất nhanh so với TCP.
	- VD: Internet calling, streaming, v.v.
- **Simple transaction**
	- TCP yêu cầu các giao dịch phức tạp vì nó cần kiểm tra tất cả các thiết lập, kết thúc và ACK.
	- Tuy nhiên UDP không kiểm tra quá trình trên nên giao dịch đơn giản.
	- VD: DNS, DHCP, SNMP, v.v.
- **Multicast / Broadcast**
	- TCP chỉ gửi và nhận dữ liệu khi bên gửi và bên nhận xác nhận lẫn nhau.
	- TCP, hoạt động theo kiểu Point-to-point, không thể truyền cả multicast/broadcast.
	- Chức năng này chỉ khả dụng cho UDP và không có giới hạn về tốc độ truyền.
