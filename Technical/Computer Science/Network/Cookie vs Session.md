---
categories: [network, computer-science]
title: Cookie vs Session
date created: 2023-05-28
date modified: 2023-07-20
tags: [network, computer-science]
---

## Sự xuất hiện Cookie

Các đặc điểm quan trọng nhất của HTTP là không trạng thái và không kết nối. Nếu bạn đăng nhập trên trang chủ và làm mới, thông tin đăng nhập sẽ bị xoá.  
HTTP phản hồi máy chủ khi máy khách đưa ra yêu cầu. Khi phản hồi hoàn tất, kết nối bị ngắt. Kết quả là, không còn trạng thái giao tiếp trước đó trên máy khách.  
Tài nguyên bị lãng phí nếu máy chủ giữ một số lượng lớn máy khách được kết nối. Cookie xuất hiện để giải quyết vấn đề này.

## Cookie

- Cookie là một tệp thông tin bản ghi nhỏ được cài đặt trên máy tính của người dùng Internet hoặc thiết bị khác thông qua trình duyệt web của người dùng khi người dùng truy cập một trang web nhất định.

![Pasted image 20230529010220](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230529010220.png)

- Khi máy chủ gửi phản hồi cho yêu cầu đăng nhập của máy khách, máy chủ sẽ gửi thông tin mà nó muốn lưu trữ ở phía máy khách qua `Set-Cookie` trong response header .
- Cookie được lưu trữ theo dạng Key-Value.
- Sau đó, mỗi khi khách hàng gửi yêu cầu, cookie được lưu trữ sẽ được đưa vào cookie của request header và được gửi đi.
- Máy chủ xác định ứng dụng khách của request dựa trên thông tin trong cookie.

### Nhược điểm của Cookie

- Dễ bị tổn thương về bảo mật  
	- Vì giá trị của cookie có thể được kiểm tra trong trình duyệt nên có nguy cơ bị rò rỉ và thao túng
- Cookie có dung lượng hạn chế và không thể chứa nhiều thông tin.  
- Không thể chia sẻ giữa các trình duyệt vì mỗi trình duyệt web hỗ trợ cookie khác nhau.  
- Kích thước cookie càng lớn thì tải cho mạng càng lớn.

## Session

Nhược điểm lớn nhất của cookie là lộ thông tin của người dùng.  
Session được giới thiệu để giải quyết vấn đề này.

![Pasted image 20230529004405](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230529004405.png)

- Session lưu trữ thông tin người dùng trước đó trong cookie của bộ nhớ của máy chủ và Session ID được tạo tại thời điểm đó được lưu trữ trong cookie và được truyền đi.  
- Khi máy khách gửi yêu cầu, nó sẽ chuyển session id trong cookie.  
- Máy chủ xác định máy khách bằng cách xác định tính hợp lệ của session id.  
- Thông tin session id bị xóa khi người dùng đóng trình duyệt.

### Ưu và nhược điểm

- Ngay cả khi request bao gồm cookie được hiển thị ra bên ngoài, bản thân session ID không chứa thông tin cá nhân có ý nghĩa.  
	- Tuy nhiên, nếu hacker truy cập máy chủ bằng session ID, thông tin của người dùng có thể dễ dàng truy cập.  
- Vì session ID duy nhất được cấp cho mỗi người dùng nên không cần kiểm tra thông tin thành viên mỗi khi có yêu cầu.  
- Khi bộ nhớ của máy chủ được sử dụng, nếu có nhiều yêu cầu, tải trên máy chủ sẽ trở nên nghiêm trọng.
