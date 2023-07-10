---
categories: [database, computer-science]
date created: 2023-06-27
date modified: 2023-07-10
title: DB Stored Procedure
tags: [database, computer-science]
---

## Stored Procedure (SP) là gì?

> Một tập hợp các câu truy vấn được thực hiện như một hàm duy nhất để thực hiện một chuỗi các hoạt động.

✔ Nghĩa là tạo ra các câu truy vấn cho một logic cụ thể như một hàm.

> Sự khác biệt giữa thủ tục lưu trữ và hàm:
>
> - Thủ tục lưu trữ: Một chuỗi các hoạt động được thực hiện theo thứ tự, không có hoặc có thể có nhiều giá trị trả về, thực thi trên máy chủ nên tốc độ nhanh hơn.
> - Hàm: Một chức năng được tạo ra cho nhiều hoạt động, giá trị trả về là bắt buộc, thực thi trên máy khách nên chậm hơn thủ tục lưu trữ.

## Query vs Stored Procedure

### Cách hoạt động của câu lệnh truy vấn

![query-process](https://raw.githubusercontent.com/vanhung4499/images/master/snap/query-process.svg)

Giải thích qua ví dụ

```sql
SELECT name FROM userTbl;
```

1. `Parsing`: Phân tích xem có lỗi cú pháp nào trong câu truy vấn, nếu có lỗi chính tả thì thông báo lỗi tại giai đoạn này.
2. `Check Name`: Kiểm tra xem bảng userTbl có tồn tại trong cơ sở dữ liệu hiện tại hay không, nếu có thì kiểm tra xem có cột name trong bảng đó hay không.  
3. `Check Permissions`: Kiểm tra xem người dùng hiện tại có quyền truy cập vào bảng userTbl hay không.  
4. `Optimization`: Xác định con đường tối ưu nhất để thực hiện câu truy vấn, dựa trên việc sử dụng chỉ mục. Trong trường hợp câu truy vấn trên, có thể sẽ quét toàn bộ dữ liệu hoặc quét chỉ mục cụm.  
5. `Excution Plan`: Đăng ký kết quả của chiến lược thực thi vào bộ nhớ (cache).  
6. `Excution`: Thực thi chiến lược đã đăng kí.

### Stored Procedure

### 🥚 1. Định nghĩa Stored Procedure

- Phân tích cú pháp: Phát hiện lỗi cú pháp trong câu lệnh.
- Xác minh tên đối tượng trì hoãn: Không cần phải tồn tại đối tượng (ví dụ: bảng) tại thời điểm định nghĩa của thủ tục. Kiểm tra sự tồn tại của đối tượng khi thực thi thủ tục (kiểm tra tên đối tượng).
- Xác minh quyền tạo: Kiểm tra xem người dùng hiện tại có quyền tạo thủ tục lưu trữ hay không.
- Đăng ký vào bảng hệ thống: Đăng ký tên và mã của thủ tục lưu trữ vào bảng hệ thống.

> Trong trường hợp của việc xác minh tên đối tượng trì hoãn, nếu bảng tồn tại, nó sẽ được kiểm tra và nếu tên cột hoặc tên đối tượng không chính xác, sẽ xảy ra lỗi.  
> Do đó, trong thực tế làm việc, cần chú ý để tránh các lỗi như việc định nghĩa thủ tục lưu trữ sử dụng bảng không tồn tại

### 🐣 2. Chạy thủ tục lưu trữ lần đầu tiên
