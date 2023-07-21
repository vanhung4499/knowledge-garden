---
title: Extend SQL
tags: [db, sql]
categories: [db, sql]
date created: 2023-07-22
date modified: 2023-07-22
---

# Mở rộng SQL

## Cơ sở dữ liệu

## Bảng

### Xem thông tin cơ bản của bảng

```sql
SELECT * FROM information_schema.tables
WHERE table_schema = 'test' AND table_name = 'user';
```

### Xem thông tin cột của bảng

```sql
SELECT * FROM information_schema.columns
WHERE table_schema = 'test' AND table_name = 'user';
```

### Làm thế nào để xóa một lượng lớn dữ liệu

Nếu bạn muốn xóa một lượng lớn dữ liệu dựa trên một khoảng thời gian, câu lệnh đơn giản như sau:

```sql
DELETE FROM orders
WHERE timestamp < SUBDATE(CURDATE(), INTERVAL 3 month);
```

Câu lệnh trên có khả năng gây lỗi khi thực thi, báo lỗi xóa không thành công, vì lượng dữ liệu cần xóa quá lớn, vì vậy cần xóa theo từng phần.

Bạn có thể trước tiên tìm ra ID đơn hàng cũ nhất trong các đơn hàng lịch sử thỏa mãn điều kiện, sau đó chuyển điều kiện xóa thành xóa theo khóa chính.

```sql
SELECT MAX(id) FROM orders
WHERE timestamp < SUBDATE(CURDATE(), INTERVAL 3 month);

-- Xóa theo từng phần, ? điền vào giá trị ID lớn nhất tìm được từ câu lệnh trên
DELETE FROM orders
WHERE id <= ?
ORDER BY id LIMIT 1000;
```

### Thay đổi định dạng mã hóa của bảng

Mã hóa utf8mb4 là một phiên bản mở rộng của utf8, tương thích với utf8 và có thể lưu trữ các ký tự biểu tượng cảm xúc 4 byte. Nếu mã hóa của bảng được chỉ định là utf8, sẽ xảy ra lỗi khi lưu trữ trường emoji.

```sql
ALTER TABLE <tableName> CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

## Khác

### Hiển thị các tiến trình đang chạy

```sql
mysql> show processlist;
+----+-----------------+-----------------+------+---------+-------+------------------------+------------------+
| Id | User            | Host            | db   | Command | Time  | State                  | Info             |
+----+-----------------+-----------------+------+---------+-------+------------------------+------------------+
|  5 | event_scheduler | localhost       | NULL | Daemon  | 40230 | Waiting on empty queue | NULL             |
| 10 | root            | localhost:10120 | NULL | Query   |     0 | init                   | show processlist |
+----+-----------------+-----------------+------+---------+-------+------------------------+------------------
