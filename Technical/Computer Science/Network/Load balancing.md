---
categories: [network, computer-science]
title: Load balancing
date created: 2023-05-26
date modified: 2023-07-10
tags: [network, computer-science]
---

## ✔️ Tổng quan

- Cân bằng tải (load balancing) hoạt động như một máy chủ ảo có địa chỉ cho dịch vụ.  
- Thực hiện vai trò chuyển tiếp từng server thực ghép với client.

**Bài toán thực tế:**

Lập trình viên XYZ đã xây dựng máy chủ web của riêng mình và cung cấp dịch vụ. Sau một thời gian, khi số lượng người dùng dịch vụ tăng lên, lượng truy cập và lưu lượng truy cập tăng lên, việc cung cấp dịch vụ ổn định chỉ với Máy chủ `A (xxx.xxx.xx.1)` đã được vận hành trước đó trở nên tắc nghẽn.  
Ngay cả sau khi cải thiện hiệu suất của chính máy chủ (Scale-Up), nó vẫn không thể xử lý lưu lượng, vì vậy hai máy chủ bổ sung, `B (xxx.xxx.xx.2)` và `C (xxx.xxx.xx.3)` đã được thêm vào (Scale-Out) đã làm.  
Tại thời điểm này, bằng cách thay đổi từng url của máy chủ, máy khách sẽ gửi yêu cầu đến bộ cân bằng tải (load balancer) thay vì trực tiếp kiểm tra trạng thái máy chủ và yêu cầu nó, và bộ cân bằng tải sẽ chuyển tiếp yêu cầu đến máy chủ trong mạng con.

Sơ đồ mạng trước và sau khi sử dụng load balancer như sau:

- Trước

![Pasted image 20230528010959](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230528010959.png)

- Sau

![Pasted image 20230528011014](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230528011014.png)

## ✔️ Mục đích

- Tối ưu hóa việc sử dụng tài nguyên máy chủ  
- Tăng thông lượng dữ liệu  
- Giảm tốc độ phản hồi giữa máy khách và máy chủ  
- Ngăn chặn tình trạng quá tải của các máy chủ cụ thể  
- Tối đa hóa sự ổn định và tính sẵn sàng đáp ứng

## ✔️ Thuật toán phân phối

### Static Load Balancing

- **Round Robin**  
	- Một phương pháp phân bổ tuần tự các yêu cầu đầu vào cho mỗi máy chủ.  
	- Vì các yêu cầu từ máy khách được phân phối theo thứ tự nên thuật toán đơn giản và mỗi máy chủ phân phối và xử lý lưu lượng đồng đều.  
	- Hoạt động tốt khi thông lượng của mỗi máy chủ tương tự nhau.

![Pasted image 20230528011401](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230528011401.png)

- **IP Hash**
	- Một phương pháp ánh xạ địa chỉ IP của máy khách tới một máy chủ cụ thể và luôn gửi các yêu cầu nhận được từ một IP cụ thể tới máy chủ được ánh xạ.
	- Máy khách luôn kết nối với cùng một máy chủ.

![Pasted image 20230528011532](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230528011532.png)

### Dynamic Load Balancing

- **Weighted Round Robin**
	- Trọng số được đặt cho mỗi máy chủ và lưu lượng truy cập được ưu tiên chỉ định cho máy chủ có trọng số cao nhất.
	- Giả sử rằng đầu vào của máy khách là 100 và trọng số của các máy chủ A, B và C là 2, 3 và 5, các đầu vào là 20, 30 và 50 được gửi đến từng máy chủ theo cách luân phiên.
	- Hoạt động tốt khi thông lượng của mỗi máy chủ là khác nhau.

![Pasted image 20230528011658](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230528011658.png)

- **Least Connection**
	- Yêu cầu được gửi đến máy chủ có ít yêu cầu được kết nối nhất tại thời điểm đó.
	- Hoạt động khi thời lượng phiên dài hoặc lưu lượng phân phối đến máy chủ không cố định.
	- Thời gian phản hồi ít nhất
	- Trước khi chuyển tiếp yêu cầu của máy khách, hãy yêu cầu phản hồi từ mỗi máy chủ và chuyển tiếp yêu cầu của máy khách đến máy chủ có thời gian phản hồi ngắn nhất.
	- Hoạt động tốt khi hiệu suất của mỗi máy chủ là khác nhau.

## Các loại cân bằng tải

Để thực hiện cân bằng tải, L4 Load Balancer và L7 Load Balancer được sử dụng.  
Xem [[L4-L7 Switch]] để biết chi tiết.

- **L4 Load Balancer**  
	- Phân phối tải dựa trên header của giao thức bên dưới Layer 4 (Transport Layer) của mô hình [[OSI]] 7 Layer, chẳng hạn như IP, MAC và PORT, v.v.  
- **L7 Load Balancer**  
	- Các chức năng của L4 phân phối tải dựa trên các header giao thức bên dưới Layer 7 (Application Layer) của mô hình [[OSI ]]7 Layer như HTTP, FTP và SMTP v.v.  

## ❗️ Những điểm cần lưu ý  

Vì load balancer cũng là một loại thiết bị nên cần phải chuẩn bị cho các lỗi như ghép kênh.
