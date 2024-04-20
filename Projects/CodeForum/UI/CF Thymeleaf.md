---
title: CF Thymeleaf
tags:
  - codeforum
  - project
categories: 
date created: 2024-04-14
date modified: 2024-04-14
---

# Tích hợp Thymeleaf Template Engine

Dự án này tập trung vào backend là chính nên đê giảm tải phần frontend, tôi sử dụng thymeleaf để triển khai frontend.

## Thymeleaf là gì?

Thymeleaf là một HTML Template Engine  dành cho Java, với ngôn ngữ thẻ và hàm phong phú. Sau khi JSP bị loại bỏ, Thymeleaf đã trở thành template engine được Spring Boot khuyến nghị.

Thymeleaf có thể hoạt động bình thường cả khi có kết nối internet và không có kết nối internet, cho phép các nhà thiết kế đồ họa xem trước giao diện tĩnh của trang trong trình duyệt và cho phép các lập trình viên xem trước giao diện động chứa dữ liệu trên máy chủ.

Điều này là do Thymeleaf hỗ trợ nguyên mẫu HTML, bằng cách thêm thuộc tính bổ sung vào các thẻ HTML để hiển thị mẫu và dữ liệu.

Khi trình duyệt phân tích cú pháp HTML, nó sẽ bỏ qua các thuộc tính thẻ không được định nghĩa, cho phép Thymeleaf hoạt động tĩnh; khi dữ liệu được trả về trang, các thẻ Thymeleaf sẽ thay thế nội dung tĩnh.

Dưới đây là một số biểu thức, thẻ và hàm Thymeleaf thường được sử dụng.

1) Biểu thức thường sử dụng

- `${...}` Biểu thức biến
- `*{...}` Biểu thức chọn
- `#{...}` Biểu thức văn bản
- `@{...}` Biểu thức URL
- `#maps` Biểu thức đối tượng

2) Thẻ thường sử dụng

- th:action Định nghĩa đường dẫn điều khiển máy chủ.
- th:each Câu lệnh lặp
- th:field Trường biểu mẫu
- th:href Liên kết URL
- th:id ID trong thẻ div
- th:if Điều kiện
- th:include Nạp tệp
- th:fragment Định nghĩa đoạn mã
- th:object Thay thế đối tượng
- th:src Địa chỉ hình ảnh
- th:text Văn bản
- th:value Giá trị thuộc tính

3) Hàm thường sử dụng

- `#dates` Hàm ngày
- `#lists` Hàm danh sách
- `#arrays` Hàm mảng
- `#strings` Hàm chuỗi
- `#numbers` Hàm số
- `#calendars` Hàm lịch
- `#objects` Hàm đối tượng
- `#bools` Hàm boolean

Để biết thêm về các biểu thức, thẻ và hàm Thymeleaf, bạn có thể truy cập trang web chính thức của Thymeleaf:

> [https://www.thymeleaf.org/](https://www.thymeleaf.org/)
