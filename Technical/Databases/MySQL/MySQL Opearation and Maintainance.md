---
title: MySQL Opearation and Maintainance
tags: [db, mysql, sql]
categories: [db, mysql, sql]
date created: 2023-07-23
date modified: 2023-07-23
---

# Mysql quản trị

> Nếu công ty của bạn có DBA, thì tôi xin chúc mừng bạn, bạn có thể bỏ qua việc quản trị Mysql. Nếu công ty của bạn không có DBA, hãy học cách thực hiện các hoạt động quản trị cơ bản của Mysql, đó là điều cần thiết để tự bảo vệ mình khi hoạt động trong lĩnh vực này.

## Cài đặt và triển khai

### Cài đặt trên Windows

(1) Tải phiên bản Mysql 5.7 Portable (không cần cài đặt)

Link tải: https://dev.mysql.com/downloads/mysql/5.7.html#downloads

(2) Giải nén và tạo file my.ini trong thư mục gốc

Ví dụ file my.ini:

```ini
[mysqld]
# Thiết lập cổng 3306
port = 3306
# Thiết lập đường dẫn cài đặt mysql, thay đổi đường dẫn này cho phù hợp với thư mục bạn giải nén
basedir=D:\\Tools\\DB\\mysql\\mysql-5.7.31
# Số kết nối tối đa
max_connections=200
# Mysql sử dụng bộ ký tự mặc định là latin1
character-set-server=utf8
# Thiết lập engine lưu trữ mặc định cho bảng mới
default-storage-engine=INNODB

[client]
# Thiết lập bộ ký tự mặc định cho client mysql
default-character-set=utf8
```

(3) Thực hiện các lệnh cài đặt

Trên cửa sổ CMD, thực hiện lần lượt các lệnh cài đặt sau:

```
cd D:\\Tools\\DB\\mysql\\mysql-5.7.31
mysqld --initialize
mysqld -install
```

Giải thích:

- `mysqld --initialize` sẽ tự động khởi tạo và tạo thư mục data.
- `mysqld -install` sẽ cài đặt dịch vụ mysql.

(4) Khởi động dịch vụ

Trên cửa sổ CMD, thực hiện lệnh `net start mysql` để khởi động dịch vụ.

### Cài đặt trên CentOS

> Bài viết này chỉ giới thiệu cách cài đặt thông qua gói rpm

#### Cài đặt nguồn yum của mysql

Link tải chính thức: https://dev.mysql.com/downloads/repo/yum/

(1) Tải gói yum

```shell
wget https://dev.mysql.com/get/mysql80-community-release-el7-1.noarch.rpm
```

(2) Cài đặt tệp repo yum và cập nhật bộ nhớ cache yum

```shell
rpm -ivh mysql80-community-release-el7-1.noarch.rpm
```

Kết quả thực hiện:

Sẽ tạo ra hai tệp repo trong thư mục /etc/yum.repos.d/

```shell
$ ls | grep mysql
mysql-community.repo
mysql-community-source.repo
```

Cập nhật yum:

```shell
yum clean all
yum makecache
```

(3) Kiểm tra trạng thái cài đặt rpm

```shell
$ yum search mysql | grep server
mysql-community-common.i686 : MySQL database common files for server and client
mysql-community-common.x86_64 : MySQL database common files for server and
mysql-community-test.x86_64 : Test suite for the MySQL database server
                       : administering MySQL servers
mysql-community-server.x86_64 : A very fast and reliable SQL database server
```

Sau khi cài đặt mysql bằng yum, sẽ có một số thư mục quan trọng:

```
## Tệp cấu hình
/etc/my.cnf
## Thư mục cơ sở dữ liệu
/var/lib/mysql/
## Tệp cấu hình
/usr/share/mysql (lệnh mysql.server và tệp cấu hình)
## Các lệnh liên quan
/usr/bin (mysqladmin, mysqldump và các lệnh khác)
## Tệp khởi động
/usr/lib/systemd/system/mysqld.service (đăng ký dịch vụ systemd)
```

(4) Cài đặt máy chủ mysql

```shell
yum install mysql-community-server
```

#### Quản lý dịch vụ mysql

Sau khi cài đặt mysql bằng yum, sẽ có một dịch vụ systemd có tên `mysqld`.

Quản lý dịch vụ rất đơn giản:

```shell
## Kiểm tra trạng thái
systemctl status mysqld
## Kích hoạt dịch vụ
systemctl enable mysqld
## Vô hiệu hóa dịch vụ
systemctl disable mysqld
## Khởi động dịch vụ
systemctl start mysqld
## Khởi động lại dịch vụ
systemctl restart mysqld
## Dừng dịch vụ
systemctl stop mysqld
```

### Khởi tạo mật khẩu cho cơ sở dữ liệu

Xem mật khẩu tạm thời:

```shell
$ grep "password" /var/log/mysqld.log
2018-09-30T03:13:41.727736Z 5 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: %:lt+srWu4k1
```

Thực hiện lệnh sau:

```shell
mysql -uroot -p<temporary_password>
```

Nhập mật khẩu tạm thời để truy cập vào mysql. Nếu bạn muốn thay đổi mật khẩu, thực hiện lệnh sau:

```shell
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_password';
```

Lưu ý: Mật khẩu mặc định có độ mạnh trung bình, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt. Bạn chỉ có thể thay đổi cấu hình để sử dụng mật khẩu đơn giản hơn sau khi đã thay đổi thành công mật khẩu.

### Cấu hình truy cập từ xa

```sql
CREATE USER 'root'@'%' IDENTIFIED BY 'your_password';
GRANT ALL ON *.* TO 'root'@'%';
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

### Bỏ qua xác thực đăng nhập

```shell
vim /etc/my.cnf
```

Thêm dòng `skip-grant-tables` dưới phần `[mysqld]`.

Chức năng này cho phép bỏ qua xác thực đăng nhập, nghĩa là bạn có thể đăng nhập vào root với bất kỳ mật khẩu nào.

Thực hiện `systemctl restart mysqld` để khởi động lại mysql.

### Kết nối từ máy khách

Cú pháp: `mysql -h<host> -P<port> -u<username> -p<password>`

Nếu không chỉ định mật khẩu một cách rõ ràng, bạn sẽ được yêu cầu nhập mật khẩu trước khi truy cập.

【Ví dụ】Kết nối đến Mysql cục bộ

```shell
$ mysql -h 127.0.0.1 -P 3306 -u root -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 13501
Server version: 8.0.19 MySQL Community Server - GPL

Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

### Xem kết nối

Sau khi kết nối thành công, nếu bạn không có hoạt động tiếp theo, kết nối sẽ ở trạng thái rảnh rỗi và bạn có thể thấy nó trong lệnh `show processlist`. Nếu máy khách không có hoạt động trong một khoảng thời gian dài, trình kết nối sẽ tự động đóng nó. Thời gian này được điều chỉnh bởi tham số `wait_timeout`, giá trị mặc định là 8 giờ.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200714115031.png)

### Tạo người dùng

```sql
CREATE USER 'username'@'host' IDENTIFIED BY 'password';
```

Giải thích:

- username: Tên người dùng bạn muốn tạo
- host: Xác định người dùng có thể đăng nhập từ máy chủ nào. Nếu là người dùng cục bộ, bạn có thể sử dụng localhost. Nếu bạn muốn người dùng có thể đăng nhập từ bất kỳ máy chủ từ xa nào, bạn có thể sử dụng ký tự đại diện `%`.
- password: Mật khẩu đăng nhập của người dùng. Mật khẩu có thể để trống. Nếu để trống, người dùng có thể đăng nhập vào máy chủ mà không cần mật khẩu.

Ví dụ:

```sql
CREATE USER 'dog'@'localhost' IDENTIFIED BY '123456';
CREATE USER 'pig'@'192.168.1.101_' IDENDIFIED BY '123456';
CREATE USER 'pig'@'%' IDENTIFIED BY '123456';
CREATE USER 'pig'@'%' IDENTIFIED BY '';
CREATE USER 'pig'@'%';
```

> Lưu ý: Trong Mysql 8, xác thực mặc định không còn là `password`. Vì vậy, khi tạo người dùng, `create user 'username'@'%' identified by 'password';` không thể kết nối từ máy khách.
>
> Vì vậy, bạn cần thêm `IDENTIFIED WITH mysql_native_password`, ví dụ: `CREATE USER 'slave'@'%' IDENTIFIED WITH mysql_native_password BY '123456';`

### Xem người dùng

```sql
-- Xem tất cả người dùng
SELECT DISTINCT CONCAT('User: ''', user, '''@''', host, ''';') AS query
FROM mysql.user;
```

### Cấp quyền

Cú pháp:

```sql
GRANT privileges ON databasename.tablename TO 'username'@'host'
```

Giải thích:

- privileges: Các quyền thực hiện của người dùng, như `SELECT`, `INSERT`, `UPDATE`, vv. Nếu muốn cấp tất cả quyền, sử dụng `ALL`.
- databasename: Tên cơ sở dữ liệu.
- tablename: Tên bảng. Nếu muốn cấp quyền cho người dùng trên tất cả cơ sở dữ liệu và bảng, bạn có thể sử dụng `*.*`.

Ví dụ:

```sql
GRANT SELECT, INSERT ON test.user TO 'pig'@'%';
GRANT ALL ON *.* TO 'pig'@'%';
GRANT ALL ON maindataplus.* TO 'pig'@'%';
```

Lưu ý:

Người dùng được cấp quyền bằng các lệnh trên không thể cấp quyền cho người dùng khác. Nếu bạn muốn cho phép người dùng cấp quyền, sử dụng lệnh sau:

```sql
-- Cấu hình quyền cụ thể cho người dùng đã chỉ định
GRANT privileges ON databasename.tablename TO 'username'@'host' WITH GRANT OPTION;
-- Gán tất cả quyền cho người dùng root
GRANT ALL ON *.* TO 'root'@'%' IDENTIFIED BY 'password' WITH GRANT OPTION;
```

### Thu hồi quyền

Cú pháp:

```sql
REVOKE privilege ON databasename.tablename FROM 'username'@'host';
```

Giải thích:

privilege, databasename, tablename: Tương tự như phần cấp quyền.

Ví dụ:

```sql
REVOKE SELECT ON *.* FROM 'pig'@'%';
```

Lưu ý:

Nếu bạn đã cấp quyền cho người dùng `'pig'@'%'` như sau (hoặc tương tự): `GRANT SELECT ON test.user TO 'pig'@'%'`, thì việc sử dụng lệnh `REVOKE SELECT ON *.* FROM 'pig'@'%';` sẽ không thu hồi quyền `SELECT` của người dùng trên bảng `user` trong cơ sở dữ liệu `test`. Ngược lại, nếu quyền được cấp bằng `GRANT SELECT ON *.* TO 'pig'@'%';`, thì lệnh `REVOKE SELECT ON test.user FROM 'pig'@'%';` cũng không thu hồi quyền `SELECT` của người dùng trên bảng `user` trong cơ sở dữ liệu `test`.

Bạn có thể sử dụng lệnh `SHOW GRANTS FOR 'pig'@'%';` để xem thông tin chi tiết.

### Xem quyền

```SQL
-- Xem quyền của người dùng
SHOW GRANTS FOR 'root'@'%';
```

### Thay đổi mật khẩu người dùng

```sql
SET PASSWORD FOR 'username'@'host' = PASSWORD('newpassword');
```

Nếu đang đăng nhập với người dùng hiện tại, sử dụng:

```sql
SET PASSWORD = PASSWORD("newpassword");
```

Ví dụ:

```sql
SET PASSWORD FOR 'pig'@'%' = PASSWORD("123456");
```

### Sao lưu và khôi phục

Để sao lưu dữ liệu MySQL, chúng ta sử dụng lệnh mysqldump.

Mysqldump sẽ sao lưu dữ liệu trong cơ sở dữ liệu thành một tệp văn bản, cấu trúc bảng và dữ liệu của bảng sẽ được lưu trữ trong tệp văn bản được tạo ra.

Sao lưu:

#### Sao lưu một cơ sở dữ liệu

Cú pháp:

```sql
mysqldump -h <host> -P<port> -u<username> -p<database> [<table1> <table2> ...] > backup.sql
```

- **`host`** - Máy chủ Mysql
- **`port`** - Cổng của máy chủ Mysql
- **`username`** - Tên người dùng cơ sở dữ liệu
- **`dbname`** - Tên cơ sở dữ liệu
- Tham số table1 và table2 đại diện cho tên các bảng cần sao lưu, nếu để trống thì sao lưu toàn bộ cơ sở dữ liệu;
- Tham số BackupName.sql đại diện cho tên tệp sao lưu được tạo ra, bạn có thể thêm đường dẫn tuyệt đối trước tên tệp. Thông thường, cơ sở dữ liệu được sao lưu thành một tệp có phần mở rộng là sql.

#### Sao lưu nhiều cơ sở dữ liệu

```sql
mysqldump -u <username> -p --databases <database1> <database2> ... > backup.sql
```

#### Sao lưu tất cả cơ sở dữ liệu

```sql
mysqldump -u <username> -p --all-databases > backup.sql
```

#### Khôi phục một cơ sở dữ liệu

Để khôi phục dữ liệu MySQL, chúng ta sử dụng lệnh mysql.

Cú pháp:

```sql
mysql -h <host> -P<port> -u<username> -p<database> < backup.sql
```

#### Khôi phục tất cả cơ sở dữ liệu

```sql
mysql -u<username> -p --all-databases < backup.sql
```

### Gỡ cài đặt

(1) Xem MySQL đã được cài đặt

```shell
$ rpm -qa | grep -i mysql
perl-DBD-MySQL-4.023-6.el7.x86_64
mysql80-community-release-el7-1.noarch
mysql-community-common-8.0.12-1.el7.x86_64
mysql-community-client-8.0.12-1.el7.x86_64
mysql-community-libs-compat-8.0.12-1.el7.x86_64
mysql-community-libs-8.0.12-1.el7.x86_64
```

(2) Gỡ cài đặt MySQL

```shell
yum remove mysql-community-server.x86_64
```

### Triển khai Master-Slave

Giả sử bạn cần cấu hình một môi trường máy chủ Master-Slave cho MySQL:

- Node Master: 192.168.8.10
- Node Slave: 192.168.8.11

#### Các bước trên Node Master

(1) Sửa đổi cấu hình và khởi động lại

Chạy lệnh `vi /etc/my.cnf` và thêm cấu hình sau:

```ini
[mysqld]
server-id=1
log_bin=/var/lib/mysql/binlog
```

- `server-id` - Số ID của máy chủ. Trong kiến trúc Master-Slave, mỗi máy phải có một ID duy nhất.
- `log_bin` - Đường dẫn và tên tệp nhật ký đồng bộ, hãy đảm bảo rằng thư mục này có quyền ghi cho MySQL;

Sau khi chỉnh sửa, khởi động lại MySQL để áp dụng cấu hình mới:

```sql
systemctl restart mysql
```

(2) Tạo người dùng cho đồng bộ hoá

Truy cập vào bảng điều khiển MySQL:

```
$ mysql -u root -p
Password:
```

Thực hiện các câu lệnh SQL sau:

```sql
-- a. Tạo người dùng slave
CREATE USER 'slave'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
-- Cấp quyền REPLICATION SLAVE cho slave
GRANT REPLICATION SLAVE ON *.* TO 'slave'@'%';

-- b. Hoặc, tạo người dùng slave và cho phép người dùng đăng nhập từ bất kỳ máy chủ nào
-- Nếu có nhiều slave và bạn muốn tất cả các slave sử dụng cùng một tên người dùng và mật khẩu, bạn có thể sử dụng cách này
CREATE USER 'slave'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
GRANT REPLICATION SLAVE ON *.* TO 'slave'@'%';

-- Làm mới thông tin bảng phân quyền
FLUSH PRIVILEGES;
```

> Lưu ý: Trong MySQL 8, phương thức xác thực mặc định không còn là `password`. Vì vậy, khi tạo người dùng, `create user 'username'@'%' identified by 'password';` không thể kết nối từ máy khách. Vì vậy, bạn cần thêm `IDENTIFIED WITH mysql_native_password BY 'password'` khi tạo người dùng.

SQL quản lý người dùng bổ sung:

```sql
-- Xem tất cả người dùng
SELECT DISTINCT CONCAT('User: ''', user, '''@''', host, ''';') AS query
FROM mysql.user;

-- Xem quyền của người dùng
SHOW GRANTS FOR 'root'@'%';

-- Tạo người dùng
-- a. Tạo người dùng slave và chỉ cho phép người dùng đăng nhập từ máy chủ 192.168.8.11
CREATE USER 'slave'@'192.168.8.11' IDENTIFIED WITH mysql_native_password BY 'password';
-- Cấp quyền REPLICATION SLAVE cho slave
GRANT REPLICATION SLAVE ON *.* TO 'slave'@'192.168.8.11';

-- Xóa người dùng
DROP USER 'slave'@'192.168.8.11';
```

(3) Thêm khóa đọc

Để đảm bảo dữ liệu trên máy chủ chính và máy chủ phụ giữ nguyên, chúng ta sẽ thêm khóa đọc cho MySQL, biến nó thành chỉ có thể đọc.

```sql
mysql> FLUSH TABLES WITH READ LOCK;
```

(4) Xem trạng thái của máy chủ chính

```sql
mysql> show master status;
+------------------+----------+--------------+---------------------------------------------+-------------------+
| File             | Position | Binlog_Do_DB | Binlog_Ignore_DB                            | Executed_Gtid_Set |
+------------------+----------+--------------+---------------------------------------------+-------------------+
| mysql-bin.000001 |     4202 |              | mysql,information_schema,performance_schema |                   |
+------------------+----------+--------------+---------------------------------------------+-------------------+
1 row in set (0.00 sec)
```

> Lưu ý: Ghi lại `File` và `Position`, chúng ta sẽ sử dụng chúng sau này.

(5) Xuất SQL

```shell
mysqldump -u root -p --all-databases --master-data > dbdump.sql
```

(6) Mở khóa đọc

```sql
mysql> UNLOCK TABLES;
```

(7) Truyền SQL từ xa đến máy chủ phụ

```shell
scp dbdump.sql root@192.168.8.11:/home
```

#### Các bước trên Node Slave

(1) Sửa đổi cấu hình và khởi động lại

Chạy lệnh `vi /etc/my.cnf` và thêm cấu hình sau:

```ini
[mysqld]
server-id=2
log_bin=/var/lib/mysql/binlog
```

- `server-id` - Số ID của máy chủ. Trong kiến trúc Master-Slave, mỗi máy phải có một ID duy nhất.
- `log_bin` - Đường dẫn và tên tệp nhật ký đồng bộ, hãy đảm bảo rằng thư mục này có quyền ghi cho MySQL;

Sau khi chỉnh sửa, khởi động lại MySQL để áp dụng cấu hình mới:

```shell
systemctl restart mysql
```

(2) Nhập SQL

```shell
mysql -u root -p < /home/dbdump.sql
```

(3) Thiết lập kết nối với máy chủ chính trên máy chủ phụ

Truy cập vào bảng điều khiển MySQL:

```
$ mysql -u root -p
Password:
```

Thực hiện các câu lệnh SQL sau:

```sql
-- Dừng dịch vụ slave
STOP SLAVE;

-- Lưu ý: MASTER_USER và
CHANGE MASTER TO
MASTER_HOST='192.168.8.10',
MASTER_USER='slave',
MASTER_PASSWORD='password',
MASTER_LOG_FILE='binlog.000001',
MASTER_LOG_POS=4202;
```

- `MASTER_LOG_FILE` và `MASTER_LOG_POS` phải tương ứng với giá trị `File` và `Position` thu được từ lệnh `show master status`.
- `MASTER_HOST` là địa chỉ IP của máy chủ chính.
- `MASTER_USER` và `MASTER_PASSWORD` là tên người dùng và mật khẩu đã đăng ký trên máy chủ chính.

(4) Khởi động quá trình sao lưu

```sql
mysql> start slave;
```

(5) Kiểm tra trạng thái đồng bộ giữa máy chủ chính và máy chủ phụ

```sql
mysql> show slave status\G;
```

Lưu ý: Nếu cả hai tham số sau đây đều là YES, điều đó có nghĩa là cấu hình đã đúng.

- `Slave_IO_Running`
- `Slave_SQL_Running`

(6) Đặt máy chủ phụ thành chỉ đọc

```sql
mysql> set global read_only=1;
mysql> set global super_read_only=1;
mysql> show global variables like "%read_only%";
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| innodb_read_only      | OFF   |
| read_only             | ON    |
| super_read_only       | ON    |
| transaction_read_only | OFF   |
+-----------------------+-------+
```

> Lưu ý: Đặt máy chủ phụ thành chỉ đọc không ảnh hưởng đến quá trình đồng bộ hoá Master-Slave

### Truy vấn chậm

Kiểm tra xem truy vấn chậm có được bật hay không:

```sql
show variables like '%slow_query_log';
```

Bạn có thể sử dụng lệnh `set global slow_query_log` để bật hoặc tắt truy vấn chậm: ON để bật; OFF để tắt.

```sql
set global slow_query_log='ON';
```

Xem ngưỡng thời gian truy vấn chậm:

```sql
show variables like '%long_query_time%';
```

Đặt ngưỡng thời gian truy vấn chậm:

```sql
set global long_query_time = 3;
```

### Cấp độ cô lập

Xem cấp độ cô lập hiện tại:

```sql
mysql> show variables like 'transaction_isolation';
+-----------------------+-----------------+
| Variable_name         | Value           |
+-----------------------+-----------------+
| transaction_isolation | READ-COMMITTED  |
+-----------------------+-----------------+
```

## Cấu hình máy chủ

> **_Trong hầu hết các trường hợp, cấu hình mặc định đã đủ để xử lý hầu hết các tình huống, không nên thay đổi cấu hình máy chủ MySQL trừ khi bạn biết rõ rằng sự thay đổi đó có lợi._**
>
> Hãy cố gắng không sử dụng tính năng bộ nhớ cache của MySQL, vì nó yêu cầu các yêu cầu truy vấn giống nhau hoàn toàn để trúng cache. Cách tiếp cận này thực tế không hiệu quả và tăng thêm chi phí. Trong các tình huống thực tế, chúng ta thường sử dụng lưu trữ key-value như Redis để giải quyết vấn đề cache, hiệu suất cao hơn nhiều so với bộ nhớ cache truy vấn của MySQL.

### Đường dẫn tệp cấu hình

Trước tiên, bạn cần xác định đường dẫn tệp cấu hình MySQL.

Trên các hệ điều hành Linux khác nhau, đường dẫn tệp cấu hình MySQL có thể khác nhau. Đường dẫn thông thường là /etc/my.cnf hoặc /etc/mysql/my.cnf.

Nếu bạn không biết đường dẫn tệp cấu hình, bạn có thể thử các bước sau:

```shell
# which mysqld
/usr/sbin/mysqld
# /usr/sbin/mysqld --verbose --help | grep -A 1 'Default options'
Default options are read from the following files in the given order:
/etc/my.cnf /etc/mysql/my.cnf /usr/etc/my.cnf ~/.my.cnf
```

### Cú pháp cấu hình

**Các cấu hình MySQL được thiết lập bằng chữ thường, các từ khóa được phân tách bằng dấu gạch dưới (`_`) hoặc dấu gạch ngang (`-`).**

Đề nghị sử dụng một kiểu cú pháp cố định để dễ dàng tìm kiếm các cấu hình.

```shell
# Hai định dạng sau đây tương đương nhau
/usr/sbin/mysqld --auto-increment-offset=5
/usr/sbin/mysqld --auto_increment_offset=5
```

### Giải thích các cấu hình phổ biến

> Đây là một số cấu hình cơ bản phổ biến, bạn có thể tham khảo thêm: [[MySQL Configuration]]

Dưới đây là một mẫu cấu hình phổ biến, nội dung như sau:

```ini
[mysqld]
# GENERAL
# -------------------------------------------------------------------------------
datadir = /var/lib/mysql
socket  = /var/lib/mysql/mysql.sock
pid_file = /var/lib/mysql/mysql.pid
user = mysql
port = 3306
default_storage_engine = InnoDB
default_time_zone = '+8:00'
character_set_server = utf8mb4
collation_server = utf8mb4_0900_ai_ci

# LOG
# -------------------------------------------------------------------------------
log_error = /var/log/mysql/mysql-error.log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/mysql-slow.log

# InnoDB
# -------------------------------------------------------------------------------
innodb_buffer_pool_size = <value>
innodb_log_file_size = <value>
innodb_file_per_table = 1
innodb_flush_method = O_DIRECT

# MyIsam
# -------------------------------------------------------------------------------
key_buffer_size = <value>

# OTHER
# -------------------------------------------------------------------------------
tmp_table_size = 32M
max_heap_table_size = 32M
query_cache_type = 0
query_cache_size = 0
max_connections = <value>
thread_cache = <value>
open_files_limit = 65535

[client]
socket  = /var/lib/mysql/mysql.sock
port = 3306
```

- GENERAL
  - `datadir` - Đường dẫn thư mục dữ liệu MySQL
  - `socket` - Tệp socket
  - `pid_file` - Tệp PID
  - `user` - Người dùng khởi động quy trình dịch vụ MySQL
  - `port` - Số cổng dịch vụ, mặc định là `3306`
  - `default_storage_engine` - Động cơ lưu trữ mặc định của MySQL từ phiên bản 5.1 trở đi là InnoDB
  - `default_time_zone` - Múi giờ mặc định. Hầu hết các khu vực của Trung Quốc nằm trong múi giờ GMT+8, tức là `+8:00`
  - `character_set_server` - Bộ ký tự mặc định của cơ sở dữ liệu
  - `collation_server` - Bộ ký tự của cơ sở dữ liệu tương ứng với một số quy tắc sắp xếp, hãy chắc chắn rằng nó phù hợp với `character_set_server`
- LOG
  - `log_error` - Đường dẫn tệp nhật ký lỗi
  - `slow_query_log` - Có bật nhật ký truy vấn chậm hay không
  - `slow_query_log_file` - Đường dẫn tệp nhật ký truy vấn chậm
- InnoDB
  - `innodb_buffer_pool_size` - InnoDB sử dụng một bộ nhớ đệm để lưu trữ chỉ mục và dữ liệu gốc, không giống như MyISAM. Kích thước bộ nhớ đệm càng lớn, số lần I/O đĩa cần thiết để truy cập dữ liệu trong bảng càng ít.
    - Trên một máy chủ cơ sở dữ liệu độc lập, bạn có thể đặt biến này thành 60% - 80% của kích thước bộ nhớ vật lý của máy chủ.
    - Lưu ý không đặt giá trị quá lớn, nếu không sẽ chiếm dụng không gian swap của hệ thống, làm chậm hệ điều hành và giảm hiệu suất truy vấn SQL.
    - Giá trị mặc định: 128M, giá trị đề nghị: 60% - 80% của bộ nhớ vật lý
  - `innodb_log_file_size` - Kích thước tệp nhật ký. Giá trị mặc định: 48M, giá trị đề nghị: điều chỉnh kích thước dựa trên không gian đĩa của hệ thống và tốc độ tăng nhật ký
  - `innodb_file_per_table` - Giải thích: Mặc định từ MySQL 5.7 trở đi, mỗi bảng có một không gian bảng riêng. Giá trị mặc định là 1, bật.
  - `innodb_flush_method` - Giải thích: Điều khiển cách mở và ghi tệp dữ liệu và nhật ký redo của InnoDB, có ba chế độ: fdatasync (mặc định), O_DSYNC, O_DIRECT. Giá trị mặc định là rỗng, giá trị đề nghị: sử dụng SAN hoặc RAID, đề nghị sử dụng O_DIRECT, nếu không hiểu thì mặc định sử dụng O_DIRECT trong môi trường sản xuất
    - `fdatasync`: Dữ liệu tệp, bộ đệm OS -> bộ đệm OS -> đĩa; Tệp nhật ký, bộ đệm OS -> bộ đệm OS -> đĩa;
    - `O_DSYNC`: Dữ liệu tệp, bộ đệm OS -> bộ đệm OS -> đĩa; Tệp nhật ký, bộ đệm OS -> đĩa;
    - `O_DIRECT`: Dữ liệu tệp, bộ đệm OS -> đĩa; Tệp nhật ký, bộ đệm OS -> bộ đệm OS -> đĩa;
- MyIsam
  - `key_buffer_size` - Xác định kích thước bộ đệm chỉ mục, cho phép chia sẻ giữa các luồng cho bảng MyISAM, không ảnh hưởng đến InnoDB. Ảnh hưởng đáng kể đến hiệu suất của MyISAM.
    - Không nên đặt giá trị lớn hơn 30% dung lượng bộ nhớ khả dụng, vì một phần bộ nhớ cũng được sử dụng bởi hệ điều hành để đệm dữ liệu hàng.
    - Thậm chí trong trường hợp bạn không sử dụng bảng MyISAM, bạn vẫn nên đặt giá trị từ 8-64M bởi vì nó cũng được sử dụng bởi các bảng tạm thời nội bộ.
    - Giá trị mặc định: 8M, giá trị đề nghị: 256M hoặc 384M đối với máy chủ có 4GB RAM.
    - Lưu ý: Đặt giá trị quá lớn sẽ làm giảm hiệu suất tổng thể của máy chủ!
- OTHER
  - `tmp_table_size` - Kích thước tối đa của bảng tạm thời trong bộ nhớ, mặc định là 16M, ở đây đặt thành 128M
  - `max_heap_table_size` - Kích thước của bảng tạm thời được tạo bởi người dùng trong bộ nhớ, mặc định là 16M, thường được đặt cùng với `tmp_table_size` để giới hạn kích thước bảng tạm thời của người dùng. Nếu vượt quá giới hạn, MySQL sẽ tự động chuyển nó thành bảng MyISAM dựa trên đĩa, lưu trữ trong thư mục tmpdir được chỉ định, tăng tải I/O, đề nghị tăng kích thước khi có nhiều bộ nhớ.
  - `query_cache_type` - Biến hệ thống này điều khiển việc bật và tắt chức năng bộ nhớ cache truy vấn, 0 để tắt, 1 để bật, 2 để chỉ bộ nhớ cache truy vấn khi `select` được chỉ định `SQL_CACHE`.
  - `query_cache_size` - Giá trị mặc định là 1M, ưu điểm của bộ nhớ cache truy vấn là nó có thể cải thiện đáng kể tốc độ của máy chủ. Nếu bạn có nhiều truy vấn giống nhau và ít thay đổi bảng, bộ nhớ cache truy vấn có thể làm giảm hiệu suất thay vì tăng hiệu suất.
  - `max_connections` - Số kết nối tối đa, có thể đặt giá trị tối đa là 16384, thường xem xét một số tổng hợp dựa trên số người dùng đồng thời trực tuyến, nếu thường xuyên gặp thông báo lỗi "Too Many Connections" khi truy cập, bạn cần tăng giá trị này.
  - `thread_cache` - Khi khách hàng ngắt kết nối, máy chủ xử lý khách hàng này sẽ được lưu trữ trong bộ nhớ cache để phục vụ khách hàng tiếp theo thay vì bị hủy bỏ. Có thể tái sử dụng, giảm chi phí hệ thống. Giá trị mặc định là 9, giá trị đề nghị: hai cách lấy giá trị,
    - Cách 1, dựa trên bộ nhớ vật lý, 1G -> 8; 2G -> 16; 3G -> 32;> 3G -> 64;
    - Cách 2, dựa trên `show status like 'threads%'`, xem giá trị Threads_connected.
  - `open_files_limit` - Giới hạn số mô tả tệp mà MySQL mở, mặc định tối thiểu là 1024;
    - Khi open_files_limit không được cấu hình, so sánh max_connections * 5 và giá trị ulimit -n, sử dụng giá trị lớn hơn,
    - Khi open_file_limit được cấu hình, so sánh open_files_limit và max_connections * 5, sử dụng giá trị lớn hơn
    - Lưu ý: Vẫn có thể xảy ra lỗi "Can't create a new thread"; trong trường hợp này, quan sát giới hạn ulimit của hệ thống `cat /proc/mysql` tiến trình / giới hạn, quan sát giới hạn ulimit của tiến trình `cat /proc/mysql` / giới hạn
    - Nếu giá trị quá nhỏ, xem xét sửa bảng cấu hình hệ thống, `/etc/security/limits.conf` và `/etc/security/limits.d/90-nproc.conf`

## Các vấn đề thường gặp

### Quá nhiều kết nối (Too many connections)

**Hiện tượng**

Khi cố gắng kết nối với MySQL, bạn gặp phải lỗi "Too many connections".

**Nguyên nhân**

Số lượng luồng kết nối vượt quá giá trị tối đa, từ chối truy cập.

**Giải pháp**

Nếu số lượng luồng kết nối thực tế quá lớn, bạn có thể xem xét thêm các máy chủ để phân tải công việc; nếu số lượng luồng thực tế không quá lớn, bạn có thể cấu hình `max_connections` để tăng số lượng kết nối tối đa được cho phép. Lưu ý rằng số lượng kết nối không nên quá lớn, thông thường, mỗi giây có khoảng 2000 kết nối đồng thời, bạn có thể xem xét mở rộng khi số lượng kết nối đồng thời đạt khoảng 1000 kết nối mỗi giây.

(1) Xem số lượng kết nối tối đa

```sql
mysql> show variables like '%max_connections%';
+------------------------+-------+
| Variable_name          | Value |
+------------------------+-------+
| max_connections        | 151   |
| mysqlx_max_connections | 100   |
+------------------------+-------+
```

(2) Xem số lượng kết nối tối đa mà máy chủ đã phản hồi

```sql
mysql> show global status like 'Max_used_connections';
+----------------------+-------+
| Variable_name        | Value |
+----------------------+-------+
| Max_used_connections | 142   |
+----------------------+-------+
1 row in set (0.00 sec)
```

(3) Đặt số lượng kết nối tối đa tạm thời

```sql
set GLOBAL max_connections=256;
```

Lưu ý: Khi máy chủ khởi động lại, số lượng kết nối tối đa sẽ được đặt lại.

(4) Đặt số lượng kết nối tối đa vĩnh viễn

Chỉnh sửa tệp cấu hình `/etc/my.cnf`, thêm cấu hình sau vào phần `[mysqld]`:

```sql
max_connections=256
```

Khởi động lại MySQL để áp dụng cấu hình mới.

(5) Sửa giới hạn số tệp tối đa trên Linux

Số lượng kết nối tối đa của MySQL sẽ bị giới hạn bởi số lượng tệp tối đa, `vim /etc/security/limits.conf`, thêm cấu hình cho người dùng mysql:

```
mysql hard nofile 65535
mysql soft nofile 65535
```

(6) Kiểm tra giới hạn LimitNOFILE

Nếu bạn cài đặt MySQL bằng cách sử dụng rpm, hãy kiểm tra xem tệp **mysqld.service** có chứa cấu hình `LimitNOFILE` không.

### Cách sửa chữa bảng dữ liệu bị hỏng

Để sửa chữa bảng dữ liệu bị hỏng, bạn có thể sử dụng các phương pháp sau:

Sử dụng `myisamchk`:

1. Trước khi sửa chữa, dừng dịch vụ MySQL.
2. Mở cửa sổ dòng lệnh và điều hướng đến thư mục `bin` của MySQL.
3. Chạy lệnh `myisamchk –recover` với đường dẫn đến tệp `.MYI` của cơ sở dữ liệu.

Sử dụng lệnh `REPAIR TABLE` hoặc `OPTIMIZE TABLE`:

- `REPAIR TABLE table_name` được sử dụng để sửa chữa bảng bị hỏng.
- `OPTIMIZE TABLE table_name` được sử dụng để tối ưu hóa bảng và giải phóng không gian không sử dụng. Khi các hàng dữ liệu trên bảng bị xóa, không gian trên đĩa không được giải phóng ngay lập tức. Sử dụng lệnh `OPTIMIZE TABLE` sẽ giải phóng không gian này và sắp xếp lại các hàng dữ liệu trên đĩa (lưu ý: trên đĩa, không phải trong cơ sở dữ liệu).

### Cấu trúc dữ liệu

> **Hiện tượng vấn đề**: ERROR 1071: Specified key was too long; max key length is 767 bytes

**Nguyên nhân vấn đề**: Mặc định, MySQL không cho phép tạo chỉ mục (index) trên một cột với độ dài vượt quá 767 byte (có thể khác nhau đối với các phiên bản khác nhau).

**Giải pháp**: Tối ưu hóa cấu trúc chỉ mục bằng cách giảm độ dài của các trường chỉ mục. Tránh sử dụng các trường quá dài cho chỉ mục.
