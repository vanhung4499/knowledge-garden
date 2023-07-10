---
categories: [database, computer-science]
date created: 2023-06-27
date modified: 2023-07-10
title: DB Join
tags: [database, computer-science]
---

## Join là gì?

Là cách để kết hợp hai bảng liên quan với nhau thông qua `khóa chính`-`khóa ngoại` và tạo thành một bảng duy nhất trong `RDB`. Đây là vai trò quan trọng nhất khi sử dụng `RDB` .

Chúng ta hãy tìm hiểu cách kết hợp ba bảng: danh sách sách, danh sách tác giả của từng cuốn sách và danh sách nhà xuất bản của từng tác giả. Chúng ta sẽ tìm hiểu cách thực hiện điều này thông qua một ví dụ sử dụng MariaDB.

- Một bảng chứa tất cả tên sách, tác giả và nhà xuất bản mà không sử dụng các liên kết

|id|book|author|publisher|
|---|---|---|---|
|1|Java|jimmy|malang|
|2|C/C#|jose|malang|
|3|Linear Algebra|tom|dandan|
|4|Calculus|jimmy|malang|
|5|SQL|NULL|NULL|

- Bảng danh sách sách

|book_id|name|author_id|
|---|---|---|
|1|Java|1|
|2|C/C#|2|
|3|Linear Algebra|3|
|4|Calculus|1|
|5|SQL|NULL|

- Bảng tác giả

|author_id|name|publisher_id|
|---|---|---|
|1|jimmy|1|
|2|jose|1|
|3|tom|2|
|4|george|NULL|

- Bảng nhà xuất bản  

| publisher_id | name     |
| ------------ | -------- |
| 1            | malang   |
| 2            | dandan   |
| 3            | moolcung |

**Bạn có thể tạo nhanh chóng mariadb container thông qua docker**

```bash
# Create mariadb container
docker run -d --name mariadb -p 3306:3306 -e MARIADB_ROOT_PASSWORD=secret mariadb:latest

# Connect to db in terminal
docker exec -it mariadb mariadb -uroot -psecret

# Create database for test
MariaDB [(none)]> CREATE DATABASE join_example;
```

Ngoài ra bạn có thể dùng các phần mềm quản lý database nếu chưa quen với command line hay terminal. Có khá nhiều phần mềm nhưng tôi đề xuất [[Table Plus]].

## 🖇️ 1. Inner Join

- Inner Join là một phép toán tương tự như phép giao (intersection) trong tập hợp
- Nó cho phép chúng ta chỉ lấy những bản ghi hợp lệ mà có giá trị liên quan trong cả hai bảng mà chúng ta muốn kết hợp. Bất kỳ bản ghi nào có giá trị NULL hoặc không có liên quan sẽ bị loại bỏ.
- Có hai cách để thực hiện `Inner Join`: `Explicit Inner Join` và `Implicit Inner Join`. Kết quả của cả hai cách này là giống nhau, nhưng có một số khác biệt về cú pháp.

### Explicit Inner Join

- Cú pháp

```sql
SELECT {columns} 
FROM {tableA} INNER JOIN {tableB} 
  ON {join condition} 
WHERE {optional conditions};
```

### Implicit Inner Join

- Cú pháp

```sql
SELECT {columns} 
FROM {tableA}, {tableB} 
WHERE {join condition} 
  AND {optional conditions};
```

### Ví dụ sử dụng

- Bảng sách + Bảng tác giả

```bash
MariaDB [join_example]> SELECT *
    -> FROM book INNER JOIN author
    -> ON book.author_id = author.author_id;
+---------+----------------+-----------+-----------+-------+--------------+
| book_id | name           | author_id | author_id | name  | publisher_id |
+---------+----------------+-----------+-----------+-------+--------------+
|       1 | Java           |         1 |         1 | jimmy |            1 |
|       2 | C/C#           |         2 |         2 | jose  |            1 |
|       3 | Linear Algebra |         3 |         3 | tom   |            2 |
|       4 | Calculus       |         1 |         1 | jimmy |            1 |
+---------+----------------+-----------+-----------+-------+--------------+
4 rows in set (0.002 sec)
```

> Sách `SQL` có giá trị `author_id` là `NULL` bị loại khỏi danh sách sách và `george` bị loại khỏi danh sách tác giả vì không có cuốn sách nào mà `george` được đăng ký là tác giả.

- Bảng sách + Bảng tác giả + Bảng nhà xuất bản

```bash
MariaDB [join_example]> SELECT * 
    -> FROM book INNER JOIN author 
    -> ON book.author_id = author.author_id
    -> INNER JOIN publisher
    -> ON author.publisher_id = publisher.publisher_id;
+---------+----------------+-----------+-----------+-------+--------------+--------------+--------+
| book_id | name           | author_id | author_id | name  | publisher_id | publisher_id | name   |
+---------+----------------+-----------+-----------+-------+--------------+--------------+--------+
|       1 | Java           |         1 |         1 | jimmy |            1 |            1 | malang |
|       2 | C/C#           |         2 |         2 | jose  |            1 |            1 | malang |
|       3 | Linear Algebra |         3 |         3 | tom   |            2 |            2 | dandan |
|       4 | Calculus       |         1 |         1 | jimmy |            1 |            1 | malang |
+---------+----------------+-----------+-----------+-------+--------------+--------------+--------+
4 rows in set (0.002 sec)
```

> Theo nguyên tắc tương tự, vì không có tác giả nào liên kết với nhà xuất bản `moolcung`, nó đã bị loại khỏi đầu ra.

- Chỉ xuất các bản ghi có tên tác giả là `jimmy` từ bảng đã join

```bash
MariaDB [join_example]> SELECT *
    -> FROM book INNER JOIN author 
    -> ON book.author_id = author.author_id
    -> INNER JOIN publisher
    -> ON author.publisher_id = publisher.publisher_id
    -> WHERE author.name = 'jimmy';
+---------+----------+-----------+-----------+-------+--------------+--------------+--------+
| book_id | name     | author_id | author_id | name  | publisher_id | publisher_id | name   |
+---------+----------+-----------+-----------+-------+--------------+--------------+--------+
|       1 | Java     |         1 |         1 | jimmy |            1 |            1 | malang |
|       4 | Calculus |         1 |         1 | jimmy |            1 |            1 | malang |
+---------+----------+-----------+-----------+-------+--------------+--------------+--------+
2 rows in set (0.006 sec)
```

- Khi phép chiếu được áp dụng

```bash
MariaDB [join_example]> SELECT  
    -> book.book_id AS id,
    -> book.name AS book,
    -> author.name AS author,
    -> publisher.name AS publisher
    -> FROM book INNER JOIN author
    -> ON book.author_id = author.author_id
    -> INNER JOIN publisher
    -> ON author.publisher_id = publisher.publisher_id
    -> WHERE author.name = 'jimmy';
+----+----------+--------+-----------+
| id | book     | author | publisher |
+----+----------+--------+-----------+
|  1 | Java     | jimmy  | malang    |
|  4 | Calculus | jimmy  | malang    |
+----+----------+--------+-----------+
2 rows in set (0.002 sec)
```

## 🔗 2. Outer Join

`Outer Join` là một phép toán kết hợp cho phép lấy tất cả các bản ghi từ một hoặc cả hai bảng dựa trên điều kiện liên quan. Outer Join được chia thành ba loại: `Left Join`, `Right Join` và `Full Join`.

### Left/Right Join

Cho phép lấy tất cả các bản ghi từ bảng gốc (bảng trái hoặc bảng phải) và kết hợp chúng với các bản ghi tương ứng từ bảng liên quan. Nếu không có bản ghi tương ứng với bảng cơ sở trong bảng liên quan, các trường sẽ được điền bằng giá trị `NULL`.

- Cú pháp

```sql
SELECT {columns} 
FROM {tableA} {LEFT | RIGHT} JOIN {tableB} 
  ON {join condition} 
WHERE {optional conditions}
```

#### Ví dụ sử dụng

- Sách + Tác giả / Bảng cơ sở: `book`

```bash
MariaDB [join_example]> SELECT *
    -> FROM book LEFT OUTER JOIN author
    -> ON book.author_id = author.author_id;
+---------+----------------+-----------+-----------+-------+--------------+
| book_id | name           | author_id | author_id | name  | publisher_id |
+---------+----------------+-----------+-----------+-------+--------------+
|       1 | Java           |         1 |         1 | jimmy |            1 |
|       2 | C/C#           |         2 |         2 | jose  |            1 |
|       3 | Linear Algebra |         3 |         3 | tom   |            2 |
|       4 | Calculus       |         1 |         1 | jimmy |            1 |
|       5 | SQL            |      NULL |      NULL | NULL  |         NULL |
+---------+----------------+-----------+-----------+-------+--------------+
5 rows in set (0.040 sec)
```

> Sách SQL trong bảng cơ sở chứa đầy thông tin tác giả với NULL.

- Sách + Tác giả + Nhà xuất bản / Bảng cơ sở: `author`

```bash
MariaDB [join_example]> SELECT *
  -> FROM book RIGHT OUTER  JOIN author 
  -> ON book.author_id = author.author_id
  -> LEFT OUTER JOIN publisher
  -> ON author.publisher_id = publisher.publisher_id;
+---------+----------------+-----------+-----------+--------+--------------+--------------+--------+
| book_id | name           | author_id | author_id | name   | publisher_id | publisher_id | name   |
+---------+----------------+-----------+-----------+--------+--------------+--------------+--------+
|       1 | Java           |         1 |         1 | jimmy  |            1 |            1 | malang |
|       2 | C/C#           |         2 |         2 | jose   |            1 |            1 | malang |
|       3 | Linear Algebra |         3 |         3 | tom    |            2 |            2 | dandan |
|       4 | Calculus       |         1 |         1 | jimmy  |            1 |            1 | malang |
|    NULL | NULL           |      NULL |         4 | george |         NULL |         NULL | NULL   |
+---------+----------------+-----------+-----------+--------+--------------+--------------+--------+
5 rows in set (0.042 sec)
```

> Các cột còn lại trong hàng tương ứng với tác giả `george` của bảng cơ sở được điền bằng `NULL`.

- Áp dụng phép chiếu

```bash
MariaDB [join_example]> SELECT 
  -> book_id AS id,
  -> book.name AS book,
  -> author.name AS author,
  -> publisher.name AS publisher
  -> FROM book RIGHT OUTER JOIN author
  -> ON book.author_id = author.author_id
  -> LEFT OUTER JOIN publisher
  -> ON author.publisher_id = publisher.publisher_id;
+------+----------------+--------+-----------+
| id   | book           | author | publisher |
+------+----------------+--------+-----------+
|    1 | Java           | jimmy  | malang    |
|    2 | C/C#           | jose   | malang    |
|    3 | Linear Algebra | tom    | dandan    |
|    4 | Calculus       | jimmy  | malang    |
| NULL | NULL           | george | NULL      |
+------+----------------+--------+-----------+
5 rows in set (0.006 sec)
```

### Full Outer Join

Cho phép lấy tất cả các bản ghi từ cả hai bảng dựa trên điều kiện liên quan. Tuy nhiên, hỗ trợ Full Outer Join có thể khác nhau giữa các `DBMS`. `Oracle` hỗ trợ cú pháp `Full Outer Join`, nhưng `Mysql/MariaDB` không hỗ trợ nó, vì vậy phải sử dụng cú pháp `UNION` để thực hiện tương tự.

- Cú pháp:

```sql
SELECT {columns} 
FROM {tableA} FULL OUTER JOIN {tableB}
  ON {join condition}

// mysql
{LFET OUTER JOIN Query}
UNION
{RIGHT OUTER JOIN Query}
```

#### Ví dụ sử dụng

- Sách + Tác giả

```bash
MariaDB [join_example]> SELECT * 
    -> FROM book LEFT OUTER JOIN author 
    -> ON book.author_id = author.author_id
    -> UNION
    -> SELECT * 
    -> FROM book RIGHT OUTER JOIN author 
    -> ON book.author_id = author.author_id;
+---------+----------------+-----------+-----------+--------+--------------+
| book_id | name           | author_id | author_id | name   | publisher_id |
+---------+----------------+-----------+-----------+--------+--------------+
|       1 | Java           |         1 |         1 | jimmy  |            1 |
|       2 | C/C#           |         2 |         2 | jose   |            1 |
|       3 | Linear Algebra |         3 |         3 | tom    |            2 |
|       4 | Calculus       |         1 |         1 | jimmy  |            1 |
|       5 | SQL            |      NULL |      NULL | NULL   |         NULL |
|    NULL | NULL           |      NULL |         4 | george |         NULL |
+---------+----------------+-----------+-----------+--------+--------------+
6 rows in set (0.022 sec)
```

## 👀 3. Truy vấn Join theo sơ đồ Ven

### Left Join

![Pasted image 20230629225652](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230629225652.png)

```sql
SELECT {columns} 
FROM {tableA} LEFT OUTER JOIN {tableB} 
  ON {join condition};
```

### Right Join

![Pasted image 20230629225720](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230629225720.png)

```sql
SELECT {columns} 
FROM {tableA} RIGHT OUTER JOIN {tableB} 
  ON {join condition};
```

### Inner Join

![Pasted image 20230629225811](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230629225811.png)

```sql
SELECT {columns} 
FROM {tableA} RIGHT OUTER JOIN {tableB} 
  ON {join condition};
```

### Full Outer Join

![Pasted image 20230629225856](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230629225856.png)

```sql
SELECT {columns} 
FROM {tableA} FULL OUTER JOIN {tableB} 
  ON {join condition};

//or

SELECT {columns} 
FROM {tableA} LEFT OUTER JOIN {tableB} 
  ON {join condition}
UNION
SELECT {columns} 
FROM {tableA} RIGHT OUTER JOIN {tableB} 
  ON {join condition};
```

### Left Outer Join

![Pasted image 20230629225925](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230629225925.png)

```sql
SELECT {columns} 
FROM {tableA} LEFT OUTER JOIN {tableB} 
  ON {join condition} 
WHERE {tableB.col} IS NULL;
```

### Right Outer Join

![Pasted image 20230629230001](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230629230001.png)

```sql
SELECT {columns} 
FROM {tableA} RIGHT OUTER JOIN {tableB} 
  ON {join condition} 
WHERE {tableA.col} IS NULL;
```

### Left + Right Outer Join

![Pasted image 20230629230018](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230629230018.png)

```sql
SELECT {columns} 
FROM {tableA} FULL OUTER JOIN {tableB} 
  ON {join condition} 
WHERE {tableA.col} IS NULL OR {tableB.col} IS NULL

// or

SELECT {columns} 
FROM {tableA} LEFT OUTER JOIN {tableB} 
  ON {join condition} 
WHERE {tableB.col} IS NULL
UNION
SELECT {columns} 
FROM {tableA} RIGHT OUTER JOIN {tableB} 
  ON {join condition} 
WHERE {tableA.col} IS NULL;
```
