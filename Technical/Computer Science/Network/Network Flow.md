---
categories: [network, computer-science]
title: Network Flow
date created: 2023-05-26
date modified: 2023-07-10
tags: [network, computer-science]
---

## Web Flow

Quá trình từ khi nhập URL `www.google.com` vào thanh địa chỉ của của trình duyệt đến khi hiển thị kết quả màn hình?

**1. Người dùng nhập www.google.com vào thanh tìm kiếm của trình duyệt web**  

**2. Trình duyệt web kiểm tra các bản ghi DNS được lưu trong bộ nhớ cache để tìm địa chỉ IP tương ứng với tên miền.**  
	- Lúc này trình duyệt kiểm tra bản ghi DNS theo thứ tự browser → OS → router → ISP.  
	- Nếu nó không có trong bản ghi được lưu trong bộ nhớ cache ở giai đoạn này, nó sẽ chuyển sang giai đoạn tiếp theo.  

**3. Nếu không có bản ghi trong bộ đêm, DNS Server của ISP sẽ bắt đầu truy vấn DNS để tìm địa chỉ IP.**  
	- Các truy vấn DNS được lặp lại cho đến khi tìm thấy địa chỉ IP. (tìm kiếm đệ quy - recursive search)  
	- Quá trình truy vấn địa chỉ IP thông qua DNS được giải thích ở bài viết [[DNS]].  

**4. DNS Server phản hồi trình duyệt web bằng địa chỉ IP của trang web mà nó đang tìm kiếm**  

**5. Khi nhận được địa chỉ IP, bắt đầu giao tiếp TCP bình thường**  
	- Kết nối TCP được thiết lập thông qua quy trình bắt tay ba bước (3-way handshake)  

**6. Browser gửi request qua giao thức HTTP**  
	- Khi đã kết nối qua TCP, trình duyệt sẽ yêu cầu trang web www.google.com từ máy chủ thông qua phương thức HTTP GET.  

**7. Xử lý các tác vụ trang web trước trong máy chủ ứng dụng web (WAS - Web Application Server) và cơ sở dữ liệu (Database)**  
	- Nếu một mình máy chủ web (Web Server) xử lý tất cả các xử lý logic và quản lý dữ liệu thì khả năng cao là máy chủ sẽ bị quá tải. Vì vậy, WAS đóng vai trò trợ lý giúp máy chủ hoạt động.

> Web Server: Một máy chủ nhận các yêu cầu về nội dung tĩnh (HTML, CSS, IMAGE, v.v.) và xử lý và cung cấp chúng
>
> Web Application Server: Máy chủ nhận, xử lý và cung cấp nội dung động (JSP, ASP, PHP, v.v.) => Được kết nối trực tiếp tới DB Server để truy vấn dữ liệu  

> Extras/Media/Pasted image 20230526234657.png]]

**8. WAS trả response đã xử lý về máy Web Server**

- Response trả về chứa status code biểu thị trạng thái của server. Dưới đây là ý nghĩa của một số nhóm status code.

```
1xx ▶️ Information response
2xx ▶️ Successful response 
3xx ▶️ Redirect the client to another URL
4xx ▶️ An error occurred on the client side
5xx ▶️ An error occurred on the server side
```

**9. Web Server phản hồi với kết quả html document cho trình duyệt web.**

## Web Server vs WAS

### Web Server

> Máy chủ nhận, xử lý và cung cấp nội dung tĩnh (HTML, CSS, IMAGE, v.v.)

- Vì Web Server chỉ có thể xử lý nội dung tĩnh, nên khi nội dung động được yêu cầu, nó sẽ yêu cầu WAS, nhận phản hồi và gửi nó đến máy client.

👉 **Ví dụ về Web Server** : Apache Server, Nginx, v.v

### WAS (Web Application Server)

> Máy chủ nhận, xử lý và cung cấp nội dung động (JSP, ASP, PHP, v.v.) (có thể cung cấp tài nguyên tĩnh)

- WAS = Web Server + Web Container
- Phần mềm trung gian thực thi các ứng dụng trên máy tính hoặc thiết bị thông qua HTTP
- Kết nối trực tiếp với DB Server

👉 **Ví dụ về WAS**: Tomcat, JBoss, Jeus, Web Sphere, v.v.

👉 **Sự cần thiết của WAS**

Các trang web chứa cả nội dung tĩnh và động.

Nội dung động phù hợp phải được tạo và cung cấp theo yêu cầu của người dùng. Ví dụ, tên hiển thị trên màn hình có thể thay đổi theo thông tin đăng nhập.

Tại thời điểm này, nếu bạn chỉ sử dụng Web Server, bạn phải truy vấn, tính toán trước tất cả các giá trị cho yêu cầu của người dùng và cung cấp dịch vụ. Tuy nhiên, các nguồn lực là hoàn toàn không đủ để làm điều này.

Do đó, tài nguyên có thể được sử dụng hiệu quả bằng cách truy vấn dữ liệu đáp ứng yêu cầu từ DB thông qua WAS, đồng thời tạo và cung cấp kết quả theo logic nghiệp vụ.

### 👉 Web Service Architecture

![Pasted image 20230527004740](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230527004740.png)

**[ WAS + DB ]**

- Vì WAS có thể cung cấp cả nội dung động và tĩnh nên hệ thống có thể được cấu hình mà không cần máy chủ web.
- Tuy nhiên, nếu tất cả các vai trò được gán cho WAS, có những lo ngại rằng logic ứng dụng đắt tiền nhất có thể khó thực hiện do tài nguyên tĩnh làm quá tải máy chủ.

![was_and_db](https://raw.githubusercontent.com/vanhung4499/images/master/snap/was_and_db.png)

**[ WEB + WAS + DB ]**

- Nội dung tĩnh được Web Server xử lý và yêu cầu WAS xử lý nội dung logic động.  
- Khi hệ thống được phân chia như vậy, nếu sử dụng nhiều tài nguyên tĩnh, máy chủ web có thể được mở rộng và nếu sử dụng nhiều tài nguyên động, WAS có thể được mở rộng để quản lý tài nguyên hiệu quả.

![web_and_was_db](https://raw.githubusercontent.com/vanhung4499/images/master/snap/web_and_was_db.png)
