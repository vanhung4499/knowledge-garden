---
title: SQL Cheat Sheet
tags: [db, sql, 01/07/1999, 03/12/1999]
categories: [db, sql]
date created: 2023-07-22
date modified: 2023-07-22
---

# SQL Cheat Sheet

## Câu truy vấn để tìm kiếm dữ liệu

### **SELECT**: Được sử dụng để lựa chọn dữ liệu từ cơ sở dữ liệu

- `SELECT` \* `FROM` table_name;

### **DISTINCT**: Được sử dụng để lọc bỏ các giá trị trùng lặp và trả về các hàng của các cột đã chỉ định

- `SELECT DISTINCT` column_name;

### **WHERE**: Được sử dụng để lọc các bản ghi/hàng

- `SELECT` column1, column2 `FROM` table_name `WHERE` condition;
- `SELECT` \* `FROM` table_name `WHERE` condition1 `AND` condition2;
- `SELECT` \* `FROM` table_name `WHERE` condition1 `OR` condition2;
- `SELECT` \* `FROM` table_name `WHERE NOT` condition;
- `SELECT` \* `FROM` table_name `WHERE` condition1 `AND` (condition2 `OR` condition3);
- `SELECT` \* `FROM` table_name `WHERE EXISTS` (`SELECT` column_name `FROM` table_name `WHERE` condition);

### **ORDER BY**: Được sử dụng để sắp xếp kết quả trả về, theo thứ tự tăng dần (ASC) hoặc giảm dần (DESC)

- `SELECT` \* `FROM` table_name `ORDER BY` column;
- `SELECT` \* `FROM` table_name `ORDER BY` column `DESC`;
- `SELECT` \* `FROM` table_name `ORDER BY` column1 `ASC`, column2 `DESC`;

### **SELECT TOP**: Được sử dụng để chỉ định số lượng bản ghi trả về từ đầu bảng

- `SELECT TOP` number columns_names `FROM` table_name `WHERE` condition;
- `SELECT TOP` percent columns_names `FROM` table_name `WHERE` condition;
- Không phải tất cả các hệ thống cơ sở dữ liệu đều hỗ trợ `SELECT TOP`. Trong MySQL, thay vào đó sử dụng `LIMIT` trong câu truy vấn.
- `SELECT` column_names `FROM` table_name `LIMIT` offset, count;

### **LIKE**: Được sử dụng để tìm kiếm các mẫu cụ thể trong một cột, được sử dụng trong mệnh đề WHERE

- % (dấu phần trăm) là ký tự đại diện cho không, một hoặc nhiều ký tự
- \_ (gạch dưới) là ký tự đại diện cho một ký tự duy nhất
- `SELECT` column_names `FROM` table_name `WHERE` column_name `LIKE` pattern;
- `LIKE` ‘a%’ (tìm kiếm bất kỳ giá trị nào bắt đầu bằng "a")
- `LIKE` ‘%a’ (tìm kiếm bất kỳ giá trị nào kết thúc bằng "a")
- `LIKE` ‘%or%’ (tìm kiếm bất kỳ giá trị nào chứa "or")
- `LIKE` ‘\_r%’ (tìm kiếm bất kỳ giá trị nào có ký tự thứ hai là "r")
- `LIKE` ‘a*%*%’ (tìm kiếm bất kỳ giá trị nào bắt đầu bằng "a" và có độ dài ít nhất là 3)
- `LIKE` ‘[a-c]%’ (tìm kiếm bất kỳ giá trị nào bắt đầu bằng "a" hoặc "b" hoặc "c")

### **IN**: Được sử dụng để chỉ định nhiều giá trị trong mệnh đề WHERE

- Thực chất, toán tử IN là viết tắt của nhiều điều kiện OR
- `SELECT` column_names `FROM` table_name `WHERE` column_name `IN` (value1, value2, …);
- `SELECT` column_names `FROM` table_name `WHERE` column_name `IN` (`SELECT STATEMENT`);

### **BETWEEN**: Được sử dụng để lọc các giá trị trong một phạm vi đã cho

- `SELECT` column_names `FROM` table_name `WHERE` column_name `BETWEEN` value1 `AND` value2;
- `SELECT` \* `FROM` Products `WHERE` (column_name `BETWEEN` value1 `AND` value2) `AND NOT` column_name2 `IN` (value3, value4);
- `SELECT` \* `FROM` Products `WHERE` column_name `BETWEEN` #01/07/1999# AND #03/12/1999#;

### **NULL**: Đại diện cho một trường không có giá trị

- `SELECT` \* `FROM` table_name `WHERE` column_name `IS NULL`;
- `SELECT` \* `FROM` table_name `WHERE` column_name `IS NOT NULL`;

### **AS**: Được sử dụng để đặt tên bí danh cho bảng hoặc cột

- `SELECT` column_name `AS` alias_name `FROM` table_name;
- `SELECT` column_name `FROM` table_name `AS` alias_name;
- `SELECT` column_name `AS` alias_name1, column_name2 `AS` alias_name2;
- `SELECT` column_name1, column_name2 + ‘, ‘ + column_name3 `AS` alias_name;

### **UNION**: Được sử dụng để kết hợp kết quả của hai hoặc nhiều câu truy vấn SELECT

- Mỗi câu truy vấn SELECT phải có cùng số cột
- Các cột phải có cùng kiểu dữ liệu tương tự
- Các cột trong mỗi câu truy vấn SELECT cũng phải có cùng thứ tự
- `SELECT` columns_names `FROM` table1 `UNION SELECT` column_name `FROM` table2;
- `UNION` chỉ cho phép lựa chọn các giá trị khác nhau, `UNION ALL` cho phép lựa chọn trùng lặp

### **ANY|ALL**: Được sử dụng để kiểm tra các điều kiện của mệnh đề con trong mệnh đề WHERE hoặc HAVING

- `ANY` trả về true nếu bất kỳ giá trị con của câu truy vấn thỏa mãn điều kiện.
- `ALL` trả về true nếu tất cả các giá trị con của câu truy vấn đều thỏa mãn điều kiện.
- `SELECT` columns_names `FROM` table1 `WHERE` column_name operator (`ANY`|`ALL`) (`SELECT` column_name `FROM` table_name `WHERE` condition);

### **GROUP BY**: Thường được sử dụng cùng với các hàm tổng hợp (COUNT, MAX, MIN, SUM, AVG), được sử dụng để nhóm kết quả thành một hoặc nhiều cột

- `SELECT` column_name1, COUNT(column_name2) `FROM` table_name `WHERE` condition `GROUP BY` column_name1 `ORDER BY` COUNT(column_name2) DESC;

### **HAVING**: Mệnh đề HAVING chỉ định rằng câu truy vấn SELECT chỉ nên trả về các giá trị tổng hợp thỏa mãn điều kiện đã chỉ định. Nó được thêm vào SQL vì từ khóa WHERE không thể được sử dụng với các hàm tổng hợp.

- `SELECT` `COUNT`(column_name1), column_name2 `FROM` table `GROUP BY` column_name2 `HAVING` `COUNT(`column_name1`)` > 5;

## Câu truy vấn để thay đổi dữ liệu

### **INSERT INTO**: Được sử dụng để chèn bản ghi/hàng mới vào bảng

- `INSERT INTO` table_name (column1, column2) `VALUES` (value1, value2);
- `INSERT INTO` table_name `VALUES` (value1, value2 …);

### **UPDATE**: Được sử dụng để sửa đổi các bản ghi/hàng hiện có trong bảng

- `UPDATE` table_name `SET` column1 = value1, column2 = value2 `WHERE` condition;
- `UPDATE` table_name `SET` column_name = value;

### **DELETE**: Được sử dụng để xóa các bản ghi/hàng hiện có trong bảng

- `DELETE FROM` table_name `WHERE` condition;
- `DELETE` \* `FROM` table_name;

## Câu truy vấn tổng hợp

### **COUNT**: Trả về số lần xuất hiện

- `SELECT COUNT (DISTINCT` column_name`)`;

### **MIN() và MAX()**: Trả về giá trị nhỏ nhất/lớn nhất của cột đã chọn

- `SELECT MIN (`column_names`) FROM` table_name `WHERE` condition;
- `SELECT MAX (`column_names`) FROM` table_name `WHERE` condition;

### **AVG()**: Trả về giá trị trung bình của cột số

- `SELECT AVG (`column_name`) FROM` table_name `WHERE` condition;

### **SUM()**: Trả về tổng các giá trị của cột số

- `SELECT SUM (`column_name`) FROM` table_name `WHERE` condition;

## Câu truy vấn kết nối

### **INNER JOIN**: Kết nối trong, trả về các bản ghi có giá trị khớp trong hai bảng

- `SELECT` column_names `FROM` table1 `INNER JOIN` table2 `ON` table1.column_name=table2.column_name;
- `SELECT` table1.column_name1, table2.column_name2, table3.column_name3 `FROM` ((table1 `INNER JOIN` table2 `ON` relationship) `INNER JOIN` table3 `ON` relationship);

### **LEFT (OUTER) JOIN**: Kết nối ngoài trái, trả về tất cả các bản ghi trong bảng trái (table1) và các bản ghi khớp trong bảng phải (table2)

- `SELECT` column_names `FROM` table1 `LEFT JOIN` table2 `ON` table1.column_name=table2.column_name;

### **RIGHT (OUTER) JOIN**: Kết nối ngoài phải, trả về tất cả các bản ghi trong bảng phải (table2) và các bản ghi khớp trong bảng trái (table1)

- `SELECT` column_names `FROM` table1 `RIGHT JOIN` table2 `ON` table1.column_name=table2.column_name;

### **FULL (OUTER) JOIN**: Kết nối ngoài đầy đủ, kết hợp của kết nối ngoài trái và kết nối ngoài phải. Bảng kết nối bao gồm tất cả các bản ghi từ bảng được kết nối, nếu thiếu bản ghi khớp, sẽ được điền bằng NULL.

- `SELECT` column_names `FROM` table1 `FULL OUTER JOIN` table2 `ON` table1.column_name=table2.column_name;

### **Self JOIN**: Kết nối tự thân, kết nối bảng với chính nó

- `SELECT` column_names `FROM` table1 T1, table1 T2 `WHERE` condition;

## Câu truy vấn xem

### **CREATE**: Tạo xem

- `CREATE VIEW` view_name `AS SELECT` column1, column2 `FROM` table_name `WHERE` condition;

### **SELECT**: Truy xuất xem

- `SELECT` \* `FROM` view_name;

### **DROP**: Xóa xem

- `DROP VIEW` view_name;

## Câu truy vấn để sửa đổi bảng

### **ADD**: Thêm cột

- `ALTER TABLE` table_name `ADD` column_name column_definition;

### **MODIFY**: Sửa đổi kiểu dữ liệu cột

- `ALTER TABLE` table_name `MODIFY` column_name column_type;

### **DROP**: Xóa cột

- `ALTER TABLE` table_name `DROP COLUMN` column_name;
