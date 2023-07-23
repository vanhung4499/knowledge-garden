---
title: MySQL Common Issues
tags: [db, mysql, sql]
categories: [db, mysql, sql]
date created: 2023-07-24
date modified: 2023-07-24
---

# Các vấn đề thường gặp trong MySQL

## Tại sao kích thước tệp bảng không thay đổi khi tôi xóa một nửa dữ liệu của bảng?

【Vấn đề】Cơ sở dữ liệu chiếm nhiều không gian, tôi đã xóa một nửa dữ liệu của bảng lớn nhất, nhưng tại sao kích thước tệp bảng vẫn không thay đổi?

Dữ liệu bảng có thể được lưu trữ trong không gian bảng chia sẻ hoặc trong các tệp riêng lẻ. Hành vi này được điều khiển bởi tham số `innodb_file_per_table`:

1. Tham số này được đặt thành OFF, có nghĩa là dữ liệu của bảng được lưu trữ trong không gian bảng chia sẻ của hệ thống, cùng với từ điển dữ liệu;
2. Tham số này được đặt thành ON, có nghĩa là dữ liệu của mỗi bảng InnoDB được lưu trữ trong một tệp có phần mở rộng là .ibd.

Từ phiên bản MySQL 5.6.6 trở đi, giá trị mặc định của nó đã được đặt thành ON.

Tôi đề nghị bạn đặt giá trị này thành ON, bất kể bạn sử dụng phiên bản MySQL nào. Bởi vì việc lưu trữ mỗi bảng trong một tệp riêng lẻ dễ quản lý hơn và khi bạn không cần bảng đó nữa, hệ thống sẽ xóa tệp đó trực tiếp bằng lệnh drop table. Trong khi nếu nó được lưu trữ trong không gian bảng chia sẻ, thậm chí khi bảng bị xóa, không gian cũng không được giải phóng.

Vì vậy, **đặt innodb_file_per_table thành ON là phương pháp được khuyến nghị**. Các thảo luận tiếp theo của chúng ta sẽ dựa trên cài đặt này.

Khi chúng ta xóa toàn bộ bảng, chúng ta có thể sử dụng lệnh drop table để giải phóng không gian bảng. Tuy nhiên, trong nhiều tình huống, chúng ta chỉ xóa một số hàng, và đó là khi chúng ta gặp vấn đề ở đầu bài viết: dữ liệu trong bảng đã bị xóa, nhưng không gian bảng không được giải phóng.

**Các hoạt động chèn và xóa có thể tạo ra các khoảng trống**.

- Khi chèn, nếu trang chèn đã đầy, cần yêu cầu một trang mới.
- Khi xóa, không xóa trang đó, mà chỉ đánh dấu vị trí bản ghi trên trang là có thể tái sử dụng.

Vì vậy, nếu chúng ta có thể loại bỏ các khoảng trống này, chúng ta có thể thu nhỏ không gian bảng.

Để thu nhỏ các khoảng trống, chúng ta có thể sử dụng cách xây dựng lại bảng.
