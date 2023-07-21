---
title: SQL Syntax Foudation Features
tags: [db, sql]
categories: [db, sql]
date created: 2023-07-21
date modified: 2023-07-22
---

# Các tính năng cơ bản của cú pháp SQL

> Bài viết này tập trung vào cú pháp cơ bản của ngôn ngữ truy vấn SQL cho cơ sở dữ liệu quan hệ. Vì giới hạn bài viết, chúng tôi tập trung vào cách sử dụng, không đi sâu vào các tính năng và nguyên lý.

## Giới thiệu về SQL

### Thuật ngữ cơ sở dữ liệu

- `Cơ sở dữ liệu (database)` - Là một nơi lưu trữ dữ liệu có tổ chức (thường là một tập tin hoặc một nhóm tập tin).
- `Bảng dữ liệu (table)` - Là một danh sách có cấu trúc của một loại dữ liệu cụ thể.
- `Mô hình (schema)` - Là thông tin về cách dữ liệu được tổ chức trong cơ sở dữ liệu và bảng. Mô hình xác định cách dữ liệu được lưu trữ trong bảng, bao gồm việc lưu trữ loại dữ liệu nào, cách dữ liệu được phân tách, cách đặt tên thông tin và nhiều thông tin khác. Cả cơ sở dữ liệu và bảng đều có mô hình.
- `Cột (column)` - Là một trường trong bảng. Tất cả các bảng đều được tạo thành từ một hoặc nhiều cột.
- `Hàng (row)` - Là một bản ghi trong bảng.
- `Khóa chính (primary key)` - Là một cột (hoặc một nhóm cột) có giá trị duy nhất để xác định mỗi hàng trong bảng.

### Cú pháp SQL

> SQL (Structured Query Language) là một ngôn ngữ truy vấn có tiêu chuẩn do Ủy ban Tiêu chuẩn ANSI quản lý, do đó được gọi là ANSI SQL. Mỗi hệ quản trị cơ sở dữ liệu (DBMS) có cài đặt riêng của nó, chẳng hạn như PL/SQL, Transact-SQL, v.v.

#### Cấu trúc cú pháp SQL

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/sql-syntax.png)

Cấu trúc cú pháp SQL bao gồm:

- **`Mệnh đề (clause)`** - Là thành phần cấu thành của câu lệnh và truy vấn. (Trong một số trường hợp, chúng là tùy chọn.)
- **`Biểu thức (expression)`** - Có thể tạo ra một giá trị cố định hoặc một bảng dữ liệu từ các cột và hàng trong cơ sở dữ liệu.
- **`Tiên đề (predicate)`** - Xác định điều kiện logic ba giá trị (true/false/unknown) hoặc giá trị boolean để giới hạn hiệu quả của câu lệnh và truy vấn, hoặc thay đổi luồng chương trình.
- **`Truy vấn (query)`** - Truy xuất dữ liệu dựa trên điều kiện cụ thể. Đây là một phần quan trọng của SQL.
- **`Câu lệnh (statement)`** - Có thể ảnh hưởng lâu dài đến cấu trúc và dữ liệu, hoặc điều khiển giao dịch cơ sở dữ liệu, luồng chương trình, kết nối, phiên hoặc chẩn đoán.

#### Điểm chính của cú pháp SQL

- **Câu lệnh SQL không phân biệt chữ hoa chữ thường**, nhưng tên bảng, tên cột và giá trị có thể phân biệt tùy thuộc vào DBMS cụ thể và cấu hình.

Ví dụ: `SELECT` và `select`, `Select` là như nhau.

- **Nhiều câu lệnh SQL phải được phân tách bằng dấu chấm phẩy (`;`)**.
- Khi xử lý câu lệnh SQL, **tất cả các khoảng trắng đều bị bỏ qua**. Câu lệnh SQL có thể được viết trên một dòng hoặc được chia thành nhiều dòng.

```sql
-- Câu lệnh SQL trên một dòng
UPDATE user SET username='robot', password='robot' WHERE username = 'root';

-- Câu lệnh SQL trên nhiều dòng
UPDATE user
SET username='robot', password='robot'
WHERE username = 'root';
```

- SQL hỗ trợ ba cách chú thích

```sql
## Chú thích 1
-- Chú thích 2
/* Chú thích 3 */
```

#### Phân loại SQL

#### Ngôn ngữ định nghĩa dữ liệu (DDL)

Ngôn ngữ định nghĩa dữ liệu (Data Definition Language, DDL) là một tập hợp các ngôn ngữ SQL chịu trách nhiệm định nghĩa cấu trúc dữ liệu và đối tượng cơ sở dữ liệu.

DDL có chức năng chính là **định nghĩa đối tượng cơ sở dữ liệu**.

Các chỉ thị cốt lõi của DDL là `CREATE`, `ALTER`, `DROP`.

#### Ngôn ngữ điều khiển dữ liệu (DML)

Ngôn ngữ điều khiển dữ liệu (Data Manipulation Language, DML) được sử dụng để thao tác dữ liệu trong cơ sở dữ liệu, truy cập các đối tượng và dữ liệu trong cơ sở dữ liệu.

DML có chức năng chính là **truy cập dữ liệu**, do đó cú pháp của nó tập trung vào việc **đọc và ghi cơ sở dữ liệu**.

Các chỉ thị cốt lõi của DML là `INSERT`, `UPDATE`, `DELETE`, `SELECT`. Bốn chỉ thị này được gọi chung là CRUD (Create, Read, Update, Delete), tức là tạo, đọc, cập nhật, xóa.

#### Ngôn ngữ điều khiển giao dịch (TCL)

Ngôn ngữ điều khiển giao dịch (Transaction Control Language, TCL) được sử dụng để **quản lý các giao dịch trong cơ sở dữ liệu**. Nó được sử dụng để quản lý các thay đổi được thực hiện bởi các câu lệnh DML. Nó cũng cho phép nhóm các câu lệnh thành các giao dịch logic.

Các chỉ thị cốt lõi của TCL là `COMMIT`, `ROLLBACK`.

#### Ngôn ngữ điều khiển dữ liệu (DCL)

Ngôn ngữ điều khiển dữ liệu (Data Control Language, DCL) là một ngôn ngữ truy vấn cho phép **kiểm soát quyền truy cập của người dùng vào các đối tượng cơ sở dữ liệu** như bảng, xem, thủ tục lưu trữ, hàm người dùng và nhiều đối tượng cơ sở dữ liệu khác.

DCL có chức năng chính là **kiểm soát quyền truy cập của người dùng**, do đó cú pháp của nó không phức tạp, quyền kiểm soát có thể được sử dụng bao gồm: `CONNECT`, `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `EXECUTE`, `USAGE`, `REFERENCES`.

Tùy thuộc vào DBMS cụ thể và thực thể bảo mật khác nhau, các quyền kiểm soát được hỗ trợ cũng khác nhau.

---

**(Dưới đây là cú pháp DML)**

## Thêm, Xóa, Sửa, Truy vấn (CRUD)

Thêm, Xóa, Sửa, Truy vấn (CRUD) là các hoạt động cơ bản trong cơ sở dữ liệu.

### Thêm dữ liệu

> - Câu lệnh `INSERT INTO` được sử dụng để chèn bản ghi mới vào bảng.

#### Chèn hàng hoàn chỉnh

```sql
INSERT INTO user
VALUES (10, 'root', 'root', 'xxxx@163.com');
```

#### Chèn một phần của hàng

```sql
INSERT INTO user(username, password, email)
VALUES ('admin', 'admin', 'xxxx@163.com');
```

#### Chèn dữ liệu từ truy vấn

```sql
INSERT INTO user(username)
SELECT name
FROM account;
```

### Cập nhật dữ liệu

> - Câu lệnh `UPDATE` được sử dụng để cập nhật bản ghi trong bảng.

```sql
UPDATE user
SET username='robot', password='robot'
WHERE username = 'root';
```

### Xóa dữ liệu

> - Câu lệnh `DELETE` được sử dụng để xóa bản ghi trong bảng.
> - `TRUNCATE TABLE` được sử dụng để xóa toàn bộ dữ liệu trong bảng.

#### Xóa dữ liệu cụ thể trong bảng

```sql
DELETE FROM user WHERE username = 'robot';
```

#### Xóa toàn bộ dữ liệu trong bảng

```sql
TRUNCATE TABLE user;
```

### Truy vấn dữ liệu

> - Câu lệnh `SELECT` được sử dụng để truy vấn dữ liệu từ cơ sở dữ liệu.
> - `DISTINCT` được sử dụng để trả về các giá trị duy nhất. Nó áp dụng cho tất cả các cột, tức là tất cả các cột phải giống nhau thì mới được coi là giống nhau.
> - `LIMIT` được sử dụng để giới hạn số hàng trả về. Có thể có hai tham số, tham số đầu tiên là hàng bắt đầu, bắt đầu từ 0; tham số thứ hai là tổng số hàng trả về.
>   - `ASC`: Sắp xếp tăng dần (mặc định)
>   - `DESC`: Sắp xếp giảm dần

#### Truy vấn một cột

```sql
SELECT prod_name FROM products;
```

#### Truy vấn nhiều cột

```sql
SELECT prod_id, prod_name, prod_price FROM products;
```

#### Truy vấn tất cả các cột

```sql
SELECT * FROM products;
```

#### Truy vấn các giá trị khác nhau

```sql
SELECT DISTINCT vend_id FROM products;
```

#### Giới hạn số lượng truy vấn

```sql
-- Trả về 5 hàng đầu tiên
SELECT * FROM products LIMIT 5;
SELECT * FROM products LIMIT 0, 5;
-- Trả về hàng 3 đến 5
SELECT * FROM products LIMIT 2, 3;
```

## Lọc dữ liệu (WHERE)

Truy vấn con là một truy vấn SQL được lồng vào trong một truy vấn lớn hơn. Truy vấn con cũng được gọi là truy vấn nội bộ hoặc lựa chọn nội bộ, và câu lệnh chứa truy vấn con được gọi là truy vấn bên ngoài hoặc lựa chọn bên ngoài.

- Truy vấn con có thể được lồng vào trong câu lệnh `SELECT`, `INSERT`, `UPDATE` hoặc `DELETE`, hoặc trong một truy vấn con khác.
- Truy vấn con thường được thêm vào trong mệnh đề `WHERE` của một câu lệnh `SELECT`.
- Bạn có thể sử dụng các toán tử so sánh như `>`, `<`, hoặc `=`. Các toán tử so sánh cũng có thể là toán tử đa hàng như `IN`, `ANY` hoặc `ALL`.
- Truy vấn con phải được đặt trong dấu ngoặc đơn `()`.
- Truy vấn con được thực hiện trước truy vấn bên ngoài của nó để kết quả của truy vấn con có thể được truyền cho truy vấn bên ngoài. Quá trình thực thi có thể được tham khảo trong hình sau:

  <p align="center">
    <img src="https://raw.githubusercontent.com/dunwu/images/dev/cs/database/mysql/sql-subqueries.gif" alt="sql-subqueries">
  </p>

**Truy vấn con của truy vấn con**

```sql
SELECT cust_name, cust_contact
FROM customers
WHERE cust_id IN (SELECT cust_id
                  FROM orders
                  WHERE order_num IN (SELECT order_num
                                      FROM orderitems
                                      WHERE prod_id = 'RGAN01'));
```

### Mệnh đề WHERE

Trong câu lệnh SQL, dữ liệu được lọc dựa trên các điều kiện tìm kiếm được chỉ định trong mệnh đề `WHERE`.

Cú pháp cơ bản của mệnh đề `WHERE` như sau:

```sql
SELECT ……(tên cột) FROM ……(tên bảng) WHERE ……(mệnh đề điều kiện)
```

Mệnh đề `WHERE` được sử dụng để lọc bản ghi, tức là thu hẹp phạm vi truy cập vào dữ liệu. `WHERE` được theo sau bởi một điều kiện trả về `true` hoặc `false`.

`WHERE` có thể được sử dụng với các câu lệnh `SELECT`, `UPDATE` và `DELETE`.

**Mệnh đề `WHERE` trong câu lệnh `SELECT`**

```sql
SELECT * FROM Customers
WHERE cust_name = 'Kids Place';
```

**Mệnh đề `WHERE` trong câu lệnh `UPDATE`**

```sql
UPDATE Customers
SET cust_name = 'Jack Jones'
WHERE cust_name = 'Kids Place';
```

**Mệnh đề `WHERE` trong câu lệnh `DELETE`**

```sql
DELETE FROM Customers
WHERE cust_name = 'Kids Place';
```

Các toán tử có thể sử dụng trong mệnh đề `WHERE`:

### Toán tử so sánh

| Toán tử | Mô tả                                        |
| ------- | -------------------------------------------- |
| `=`     | Bằng                                         |
| `<>`    | Không bằng. Lưu ý: Trong một số phiên bản SQL, toán tử này có thể được viết là != |
| `>`     | Lớn hơn                                      |
| `<`     | Nhỏ hơn                                      |
| `>=`    | Lớn hơn hoặc bằng                             |
| `<=`    | Nhỏ hơn hoặc bằng                             |

### Toán tử phạm vi

| Toán tử    | Mô tả                          |
| --------- | ------------------------------ |
| `BETWEEN` | Nằm trong một phạm vi           |
| `IN`      | Chỉ định nhiều giá trị cho một cột |

- Toán tử `IN` được sử dụng trong mệnh đề `WHERE`, nó cho phép chọn một giá trị từ một số giá trị cụ thể đã chỉ định.
- Toán tử `BETWEEN` được sử dụng trong mệnh đề `WHERE`, nó cho phép chọn một giá trị nằm trong một phạm vi cụ thể.

**Ví dụ với toán tử `IN`**

```sql
SELECT *
FROM products
WHERE vend_id IN ('DLL01', 'BRS01');
```

**Ví dụ với toán tử `BETWEEN`**

```sql
SELECT *
FROM products
WHERE prod_price BETWEEN 3 AND 5;
```

### Toán tử logic

| Toán tử | Mô tả       |
| ------ | ---------- |
| `AND`  | Và         |
| `OR`   | Hoặc       |
| `NOT`  | Phủ định   |

`AND`、`OR` và `NOT` là các chỉ thị xử lý logic cho các điều kiện lọc.

- Toán tử `AND` có độ ưu tiên cao hơn toán tử `OR`, để xác định thứ tự xử lý rõ ràng, bạn có thể sử dụng `()`. Toán tử `AND` đại diện cho việc cả hai điều kiện phải được đáp ứng.
- Toán tử `OR` đại diện cho việc chỉ cần một trong hai điều kiện được đáp ứng.
- Toán tử `NOT` được sử dụng để phủ định một điều kiện.

**Ví dụ với toán tử `AND`**

```sql
SELECT prod_id, prod_name, prod_price
FROM products
WHERE vend_id = 'DLL01' AND prod_price <= 4;
```

**Ví dụ với toán tử `OR`**

```sql
SELECT prod_id, prod_name, prod_price
FROM products
WHERE vend_id = 'DLL01' OR vend_id = 'BRS01';
```

**Ví dụ với toán tử `NOT`**

```sql
SELECT *
FROM products
WHERE prod_price NOT BETWEEN 3 AND 5;
```

### Ký tự đại diện

| Toán tử | Mô tả                     |
| ------ | ------------------------ |
| `LIKE` | Tìm kiếm một mẫu cụ thể   |
| `%`    | Đại diện cho bất kỳ ký tự nào xuất hiện bất kỳ số lần nào |
| `_`    | Đại diện cho một ký tự bất kỳ xuất hiện một lần |
| `[]`   | Phải khớp với một ký tự cụ thể ở vị trí chỉ định |

Toán tử `LIKE` được sử dụng trong mệnh đề `WHERE` để xác định xem một chuỗi có khớp với mẫu hay không. Chỉ sử dụng `LIKE` khi trường là giá trị văn bản.

`LIKE` hỗ trợ các tùy chọn khớp mẫu sau:

- `%` đại diện cho bất kỳ ký tự nào xuất hiện bất kỳ số lần nào.
- `_` đại diện cho một ký tự bất kỳ xuất hiện một lần.
- `[]` phải khớp với một ký tự cụ thể ở vị trí chỉ định.

> Lưu ý: **Không sử dụng ký tự đại diện một cách lạm dụng, việc khớp đầu tiên sẽ rất chậm**.

Ví dụ với `%`:

```sql
SELECT prod_id, prod_name, prod_price
FROM products
WHERE prod_name LIKE '%bean bag%';
```

Ví dụ với `_`:

```sql
SELECT prod_id, prod_name, prod_price
FROM products
WHERE prod_name LIKE '__ inch teddy bear';
```

## Sắp xếp (ORDER BY)

> `ORDER BY` được sử dụng để sắp xếp kết quả truy vấn.

`ORDER BY` có hai chế độ sắp xếp:

- `ASC`: Sắp xếp tăng dần (mặc định)
- `DESC`: Sắp xếp giảm dần

Có thể sắp xếp theo nhiều cột và chỉ định cách sắp xếp khác nhau cho mỗi cột.

Ví dụ về sắp xếp theo nhiều cột:

```sql
SELECT * FROM products
ORDER BY prod_price DESC, prod_name ASC;
```

## Định nghĩa dữ liệu (CREATE, ALTER, DROP)

> Chức năng chính của DDL là định nghĩa các đối tượng cơ sở dữ liệu (như cơ sở dữ liệu, bảng dữ liệu, view, chỉ mục, v.v.).

### Cơ sở dữ liệu (DATABASE)

#### Tạo cơ sở dữ liệu

```sql
CREATE DATABASE IF NOT EXISTS db_tutorial;
```

#### Xóa cơ sở dữ liệu

```sql
DROP DATABASE IF EXISTS db_tutorial;
```

#### Chọn cơ sở dữ liệu

```sql
USE db_tutorial;
```

### Bảng dữ liệu (TABLE)

#### Xóa bảng dữ liệu

```sql
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS vip_user;
```

#### Tạo bảng dữ liệu

**Tạo bình thường**

```sql
CREATE TABLE user (
    id       INT(10) UNSIGNED NOT NULL COMMENT 'Id',
    username VARCHAR(64)      NOT NULL DEFAULT 'default' COMMENT 'Tên người dùng',
    password VARCHAR(64)      NOT NULL DEFAULT 'default' COMMENT 'Mật khẩu',
    email    VARCHAR(64)      NOT NULL DEFAULT 'default' COMMENT 'Địa chỉ email'
) COMMENT ='Bảng người dùng';
```

**Tạo bảng mới dựa trên bảng hiện có**

```sql
CREATE TABLE vip_user AS
SELECT *
FROM user;
```

#### Sửa bảng dữ liệu

##### Thêm cột

```sql
ALTER TABLE user
ADD age int(3);
```

##### Xóa cột

```sql
ALTER TABLE user
DROP COLUMN age;
```

##### Sửa cột

```sql
ALTER TABLE `user`
MODIFY COLUMN age tinyint;
```

### View (VIEW)

> View là một bảng ảo dựa trên kết quả của một truy vấn SQL. **View là một bảng ảo, nó không lưu trữ dữ liệu và không thể được lập chỉ mục**. Các hoạt động trên View tương tự như trên bảng thông thường.

Chức năng của View:

- Đơn giản hóa các hoạt động SQL phức tạp, chẳng hạn như các liên kết phức tạp.
- Chỉ sử dụng một phần dữ liệu của bảng thực tế.
- Đảm bảo tính bảo mật dữ liệu bằng cách chỉ cấp quyền truy cập vào View cho người dùng.
- Thay đổi định dạng và biểu diễn dữ liệu.

#### Tạo View

```sql
CREATE VIEW top_10_user_view AS
SELECT id, username
FROM user
WHERE id < 10;
```

#### Xóa View

```sql
DROP VIEW top_10_user_view;
```

### Chỉ mục (INDEX)

> Chỉ mục giúp truy vấn dữ liệu nhanh chóng và hiệu quả hơn. Người dùng không thể nhìn thấy chỉ mục, chỉ có thể sử dụng nó để tăng tốc truy vấn.

Việc cập nhật một bảng có chỉ mục mất nhiều thời gian hơn so với cập nhật một bảng không có chỉ mục, vì chỉ mục cũng cần được cập nhật. Do đó, cách tiếp cận lý tưởng là chỉ tạo chỉ mục trên các cột (và bảng) thường được tìm kiếm.

Chỉ mục duy nhất: Chỉ mục duy nhất đảm bảo mỗi giá trị chỉ mục tương ứng với một bản ghi duy nhất.

#### Tạo chỉ mục

```sql
CREATE INDEX idx_email
    ON user(email);
```

#### Tạo chỉ mục duy nhất

```sql
CREATE UNIQUE INDEX uniq_username
    ON user(username);
```

#### Xóa chỉ mục

```sql
ALTER TABLE user
DROP INDEX idx_email;
ALTER TABLE user
DROP INDEX uniq_username;
```

#### Thêm khóa chính

```sql
ALTER TABLE user
ADD PRIMARY KEY (id);
```

#### Xóa khóa chính

```sql
ALTER TABLE user
DROP PRIMARY KEY;
```

### Ràng buộc

> Ràng buộc SQL được sử dụng để xác định các quy tắc dữ liệu trong bảng.

- Nếu có hành vi dữ liệu vi phạm ràng buộc, hành vi sẽ bị chặn bởi ràng buộc.
- Ràng buộc có thể được xác định khi tạo bảng (bằng câu lệnh CREATE TABLE) hoặc sau khi tạo bảng (bằng câu lệnh ALTER TABLE).
- Loại ràng buộc
  - `NOT NULL`: Xác định rằng một cột không thể lưu trữ giá trị NULL.
  - `UNIQUE`: Đảm bảo mỗi hàng của một cột phải có giá trị duy nhất.
  - `PRIMARY KEY`: Kết hợp NOT NULL và UNIQUE. Đảm bảo một cột (hoặc kết hợp nhiều cột) có định danh duy nhất, giúp tìm kiếm một bản ghi cụ thể trong bảng dễ dàng và nhanh chóng.
  - `FOREIGN KEY`: Đảm bảo dữ liệu trong một bảng phù hợp với giá trị trong một bảng khác.
  - `CHECK`: Đảm bảo giá trị trong một cột phải tuân thủ một điều kiện cụ thể.
  - `DEFAULT`: Xác định giá trị mặc định cho một cột khi không có giá trị được cung cấp.

Xác định ràng buộc khi tạo bảng:

```sql
CREATE TABLE Users (
  Id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Id',
  Username VARCHAR(64) NOT NULL UNIQUE DEFAULT 'default' COMMENT 'Tên người dùng',
  Password VARCHAR(64) NOT NULL DEFAULT 'default' COMMENT 'Mật khẩu',
  Email VARCHAR(64) NOT NULL DEFAULT 'default' COMMENT 'Địa chỉ email',
  Enabled TINYINT(4) DEFAULT NULL COMMENT 'Có hiệu lực hay không',
  PRIMARY KEY (Id)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='Bảng người dùng';
```
