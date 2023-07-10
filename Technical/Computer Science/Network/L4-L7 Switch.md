---
categories: [network, computer-science]
title: L4-L7 Switch
date created: 2023-05-28
date modified: 2023-07-10
tags: [network, computer-science]
---

## Switch là gì?  

- Một bộ chuyển đổi mạng (switch) hoạt động như một chuyển tiếp giữa máy nguồn và đích theo địa chỉ được yêu cầu.  
- Điều này dùng để ẩn địa chỉ thực của máy chủ bất kể switch layer mấy (L4/L7).  
- Cụ thể, Switch L4/L7 thực hiện chức năng cân bằng tải đã thảo luận trong [[Load balancing]].  
- Các switch layer 4 đến 7 bao gồm các chức năng của các switch tầng dưới.  

## L4 Switch  

- L4 Switch hoạt động trong tầng Transport, dựa trên header giao thức (IP, PORT) của yêu cầu máy khách, nó điều chỉnh Source IP và Destination IP và chuyển tiếp với máy chủ ghép kênh, do đó, nó thực hiện cân bằng tải dựa trên (IP, PORT).  
- Khi một máy khách cố gắng kết nối với một máy chủ bằng giao thức TCP, một kết nối sẽ được tạo thông qua quá trình thiết lập kết nối `(3-Way HandShake)` với máy chủ đích. L4 Switch cũng tạo và quản lý dữ liệu kết nối.  
	- Tại thời điểm này, nếu kết nối không được sử dụng trong một khoảng thời gian nhất định, nó có giá trị xóa kết nối.  

## L7 Switch  

- L7 Switch hoạt động trong tầng Application, có thể phân tích trực tiếp nội dung lưu lượng (URI, Payload, Cookie, HTTP Header, v.v.), do đó, nó được sử dụng để cân bằng tải phức tạp hơn L4 Switch.  
- Mức tiêu thụ tài nguyên cao hơn so với L4 Switch  

## So sánh L4 vs L7 Switch  

- Điểm chung
	- Các gói đã nhận được chuyển tiếp đến đích thích hợp của chúng.  
	- Thực hiện chức năng cân bằng tải.  
- Sự khác biệt  
	- Giao thức TCP
		- Switch L4 tạo một phiên thông qua quy trình **thiết lập kết nối (3-Way HandShake)** giữa máy chủ được chuyển tiếp và máy khách.  
		- Switch L7 tạo mỗi phiên TCP thông qua quá trình **thiết lập kết nối (3-Way HandShake)** giữa máy khách và switch và giữa switch và máy chủ.  
- L7 Switch có thể thực hiện lọc gói thông qua phân tích các gói và tải trọng.  
- Mega Proxy Problem
	- Khi bộ chuyển mạch L4 phân phối tải bằng phương pháp băm IP, các yêu cầu có thể được tập trung vào một máy chủ cụ thể.
