---
categories: [network, interview]
title: Network Interview Part 1
date created: 2023-05-29
date modified: 2023-08-18
tags: [network, interview]
---

## Bandwidth

Q1. Nếu băng thông bị lãng phí, nguyên nhân có thể là gì?

- A1. Khi sử dụng bộ ghép kênh phân chia theo tần số, băng thông được phân bổ cho từng nút được kết nối trong một băng thông nhất định. Tại thời điểm này, một giới hạn được đặt cho mỗi băng tần để tránh nhiễu tín hiệu gây mất băng thông. ví dụ) Radio, TV Gần đây, các thiết bị CNTT thường chia kênh dựa trên phương pháp phân chia thời gian. Điều này nên được hiểu là mất thời gian sử dụng, không phải lãng phí băng thông.
- A2. Khi độ dài của mã thông báo JWT được sử dụng để xác thực người dùng trên thiết bị di động/web tăng lên, tình trạng lãng phí băng thông có thể tăng lên do dữ liệu lớn phải được trao đổi cho mỗi lần giao tiếp.

## OSI

Q. Tại sao OSI được chia thành 7 tầng?

- A. Quá trình truyền thông có thể được nắm bắt theo từng giai đoạn, việc khắc phục sự cố được tạo điều kiện thuận lợi và mỗi tầng có thể phát triển độc lập. Nó có thể được áp dụng cho nhiều loại giao thức, và cả trong kiến trúc dự án.

## Cookie, Session

✅Hãy cho tôi biết sự khác biệt giữa cookie và session

Cookie được lưu trữ trong trình duyệt, nhưng các session được lưu trữ trên máy chủ.  
Thông tin cookie vẫn còn ngay cả sau khi bạn đóng trình duyệt và truy cập lại trang web, nhưng thông tin session sẽ bị xóa khi bạn đóng trình duyệt.

✅Tại sao tôi cần cookie và session?

Trong HTTP, máy khách đưa ra yêu cầu và khi máy chủ phản hồi, kết nối sẽ bị đóng.  
Qua đó, máy chủ tiết kiệm được nhiều tài nguyên nhưng thông tin nó có lúc đó cũng biến mất nên khi truy cập lại phải lấy lại dữ liệu.  
Cookie được tạo ra để giải quyết vấn đề này. Cookies có lỗ hổng bảo mật vì dữ liệu được lưu trữ trực tiếp trên máy khách.  
Session được sinh ra để bù đắp cho điều đó. Một session lưu trữ thông tin mà người dùng cần trong bộ nhớ của máy chủ. Session Id được tạo tại thời điểm đó được chuyển đến cookie.
