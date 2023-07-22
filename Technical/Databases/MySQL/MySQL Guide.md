---
title: MySQL Guide
tags: [db, mysql]
categories: [db, mysql]
date created: 2023-07-22
date modified: 2023-07-22
---

# Hướng dẫn ứng dụng MySQL

## Quá trình thực thi SQL

Để học MySQL, tốt nhất là hiểu cách MySQL hoạt động ở mức độ tổng quan.

> Tham khảo: [[MySQL Workflow]]

## Storage Engine (Bộ lưu trữ)

Trong hệ thống tệp, MySQL lưu trữ mỗi cơ sở dữ liệu (hoặc lược đồ - schema) như một thư mục con trong thư mục dữ liệu. Khi tạo bảng, MySQL sẽ tạo một tệp `.frm` có cùng tên với bảng trong thư mục con của cơ sở dữ liệu để lưu trữ định nghĩa của bảng. Vì MySQL sử dụng hệ thống tệp và thư mục của hệ thống để lưu trữ định nghĩa cơ sở dữ liệu và bảng, nên phân biệt chữ hoa và chữ thường phụ thuộc vào nền tảng cụ thể. Trên Windows, không phân biệt chữ hoa và chữ thường; trên các hệ thống tương tự Unix, phân biệt chữ hoa và chữ thường. **Các bộ lưu trữ khác nhau lưu trữ dữ liệu và chỉ mục theo cách khác nhau, nhưng định nghĩa bảng được xử lý theo cách thống nhất tại lớp dịch vụ MySQL.**

### Lựa chọn bộ lưu trữ

#### Bộ lưu trữ tích hợp sẵn trong MySQL

```shell
mysql> SHOW ENGINES;
+--------------------+---------+----------------------------------------------------------------+--------------+------+------------+
| Engine             | Support | Comment                                                        | Transactions | XA   | Savepoints |
+--------------------+---------+----------------------------------------------------------------+--------------+------+------------+
| InnoDB             | DEFAULT | Supports transactions, row-level locking, and foreign keys     | YES          | YES  | YES        |
| MRG_MYISAM         | YES     | Collection of identical MyISAM tables                          | NO           | NO   | NO         |
| MEMORY             | YES     | Hash based, stored in memory, useful for temporary tables      | NO           | NO   | NO         |
| BLACKHOLE          | YES     | /dev/null storage engine (anything you write to it disappears) | NO           | NO   | NO         |
| MyISAM             | YES     | MyISAM storage engine                                          | NO           | NO   | NO         |
| CSV                | YES     | CSV storage engine                                             | NO           | NO   | NO         |
| ARCHIVE            | YES     | Archive storage engine                                         | NO           | NO   | NO         |
| PERFORMANCE_SCHEMA | YES     | Performance Schema                                             | NO           | NO   | NO         |
| FEDERATED          | NO      | Federated MySQL storage engine                                 | NULL         | NULL | NULL       |
+--------------------+---------+----------------------------------------------------------------+--------------+------+------------+
9 rows in set (0.00 sec)
```

- **InnoDB** - Bộ lưu trữ giao dịch mặc định của MySQL, hỗ trợ khóa cấp hàng và khóa ngoại. Hiệu suất tốt và hỗ trợ khôi phục sau sự cố tự động.
- **MyISAM** - Bộ lưu trữ mặc định của MySQL trước phiên bản 5.1. Có nhiều tính năng nhưng không hỗ trợ giao dịch, khóa cấp hàng và khóa ngoại, cũng không có tính năng khôi phục sau sự cố.
- **CSV** - Cho phép xử lý bảng như là tệp CSV, nhưng không hỗ trợ chỉ mục.
- **Memory** - Thích hợp cho việc truy cập dữ liệu nhanh chóng và dữ liệu không thay đổi, không quan trọng nếu mất sau khi khởi động lại.
- **NDB** - Sử dụng trong cụm MySQL.

#### Cách chọn bộ lưu trữ phù hợp

Trong hầu hết các trường hợp, InnoDB là lựa chọn phù hợp, trừ khi cần sử dụng các tính năng mà InnoDB không hỗ trợ.

Nếu ứng dụng cần chọn bộ lưu trữ khác ngoài InnoDB, có thể xem xét các yếu tố sau:

- Giao dịch: Nếu cần hỗ trợ giao dịch, InnoDB là lựa chọn hàng đầu. Nếu không cần hỗ trợ giao dịch và chủ yếu là các hoạt động SELECT và INSERT, MyISAM là một lựa chọn tốt. Vì vậy, nếu cấu hình MySQL là chế độ master-slave, và thực hiện phân tách đọc/ghi, thì có thể làm như sau: Node chính (master) chỉ hỗ trợ các hoạt động ghi, với engine mặc định là InnoDB; Node sao lưu (slave) chỉ hỗ trợ các hoạt động đọc, với engine mặc định là MyISAM.
- Đồng thời: MyISAM chỉ hỗ trợ khóa cấp bảng, trong khi InnoDB cũng hỗ trợ khóa cấp hàng. Vì vậy, InnoDB có hiệu suất đồng thời cao hơn.
- Khóa ngoại: InnoDB hỗ trợ khóa ngoại.
- Sao lưu: InnoDB hỗ trợ sao lưu nóng trực tuyến.
- Khôi phục sau sự cố: Khả năng bị hỏng của MyISAM sau sự cố cao hơn nhiều so với InnoDB và thời gian khôi phục cũng lâu hơn.
- Các tính năng khác: MyISAM hỗ trợ nén bảng và chỉ mục dữ liệu không gian.

#### Chuyển đổi bộ lưu trữ của bảng

Câu lệnh sau có thể chuyển đổi bộ lưu trữ của bảng mytable thành InnoDB:

```sql
ALTER TABLE mytable ENGINE = InnoDB
```

### MyISAM

MyISAM thiết kế đơn giản, dữ liệu được lưu trữ dưới dạng đóng gói chặt chẽ. Đối với dữ liệu chỉ đọc hoặc bảng nhỏ, có thể vẫn sử dụng MyISAM.

Bộ lưu trữ MyISAM sử dụng B+Tree làm cấu trúc chỉ mục, **trường dữ liệu của các nút lá lưu trữ địa chỉ bản ghi dữ liệu**.

MyISAM cung cấp nhiều tính năng, bao gồm: chỉ mục toàn văn bản, nén bảng, chức năng không gian, v.v. Tuy nhiên, MyISAM không hỗ trợ giao dịch và khóa cấp hàng, cũng không có khả năng khôi phục sau sự cố tự động.

### InnoDB

InnoDB là bộ lưu trữ giao dịch mặc định của MySQL và chỉ nên xem xét sử dụng bộ lưu trữ khác khi cần các tính năng mà InnoDB không hỗ trợ.

InnoDB cũng sử dụng B+Tree làm cấu trúc chỉ mục, nhưng cách triển khai cụ thể khác hoàn toàn so với MyISAM. Trong MyISAM, tệp chỉ mục và tệp dữ liệu được tách rời, tệp chỉ mục chỉ lưu địa chỉ bản ghi dữ liệu. **Trong InnoDB, tệp dữ liệu của bảng chính là một cấu trúc chỉ mục B+Tree** và trường dữ liệu của các nút lá lưu trữ bản ghi dữ liệu đầy đủ. **Chỉ mục chính của InnoDB là dữ liệu bảng**.

InnoDB sử dụng MVCC để hỗ trợ đồng thời cao và triển khai bốn cấp độ cô lập tiêu chuẩn. Cấp độ mặc định là **REPEATABLE READ** và sử dụng Next-Key Lock để ngăn chặn đọc ảo (Phantom Read).

InnoDB được xây dựng dựa trên cụm, với nhiều tối ưu hóa bên trong, bao gồm đọc có thể dự đoán khi đọc dữ liệu từ đĩa, chỉ mục băm tự động được tạo ra để tăng tốc độ đọc và bộ đệm chèn để tăng tốc độ chèn dữ liệu.

Hỗ trợ sao lưu nóng trực tuyến thực sự. Các bộ lưu trữ khác không hỗ trợ sao lưu trực tuyến, để có được góc nhìn nhất quán, cần dừng việc ghi vào tất cả các bảng, trong khi trong các tình huống kết hợp đọc/ghi, dừng việc ghi có thể có nghĩa là dừng việc đọc.

## Kiểu dữ liệu

### Kiểu số nguyên

`TINYINT`, `SMALLINT`, `MEDIUMINT`, `INT`, `BIGINT` lần lượt sử dụng 8, 16, 24, 32, 64 bit không gian lưu trữ, trong hầu hết các trường hợp, càng nhỏ càng tốt.

**`UNSIGNED` chỉ ra rằng không cho phép giá trị âm, có thể tăng giới hạn trên cùng của số dương**.

Số trong `INT(11)` chỉ quy định số ký tự hiển thị cho cột trong công cụ tương tác, không có ý nghĩa với việc lưu trữ và tính toán.

### Kiểu số thực

`FLOAT` và `DOUBLE` là kiểu số thực.

Kiểu `DECIMAL` chủ yếu được sử dụng cho tính toán chính xác, tuy nhiên nó tốn kém và chỉ nên sử dụng `DECIMAL` khi tính toán số thập phân chính xác - ví dụ: lưu trữ dữ liệu tài chính. Khi có số lượng dữ liệu lớn, có thể sử dụng `BIGINT` thay thế `DECIMAL`.

`FLOAT`, `DOUBLE` và `DECIMAL` có thể chỉ định chiều rộng cột, ví dụ `DECIMAL(18, 9)` chỉ ra tổng cộng 18 chữ số, 9 chữ số được sử dụng để lưu trữ phần thập phân.

### Kiểu chuỗi

Chủ yếu có hai loại kiểu chuỗi là `CHAR` và `VARCHAR`, một loại là cố định, một loại là biến đổi.

**Kiểu biến đổi `VARCHAR` này có thể tiết kiệm không gian vì chỉ cần lưu trữ nội dung cần thiết. Tuy nhiên, khi thực hiện UPDATE, có thể làm cho hàng trở nên dài hơn so với ban đầu**. Khi vượt quá kích thước mà một trang có thể chứa, sẽ có thêm hoạt động. MyISAM sẽ chia hàng thành các đoạn khác nhau để lưu trữ, trong khi InnoDB cần phải chia trang để đưa hàng vào trang.

`VARCHAR` sẽ giữ các khoảng trắng ở cuối chuỗi, trong khi `CHAR` sẽ xóa chúng.

### Thời gian và ngày tháng

MySQL cung cấp hai loại ngày tháng tương tự nhau: `DATATIME` và `TIMESTAMP`.

#### DATATIME

Có thể lưu trữ ngày tháng và thời gian từ năm 1001 đến năm 9999, với độ chính xác đến giây, sử dụng 8 byte không gian lưu trữ.

Nó không phụ thuộc vào múi giờ.

Mặc định, MySQL hiển thị giá trị DATATIME dưới dạng có thể sắp xếp, không gây hiểu lầm, ví dụ: "2008-01-16 22:37:08", đây là cách biểu diễn ngày tháng và thời gian được định nghĩa bởi tiêu chuẩn ANSI.

#### TIMESTAMP

Tương tự như dấu thời gian UNIX, lưu trữ số giây kể từ năm 1970, sử dụng 4 byte, chỉ có thể biểu diễn từ năm 1970 đến năm 2038.

Nó phụ thuộc vào múi giờ, có nghĩa là một dấu thời gian có thể đại diện cho thời gian cụ thể khác nhau trong các múi giờ khác nhau.

MySQL cung cấp hàm FROM_UNIXTIME() để chuyển đổi dấu thời gian UNIX thành ngày tháng và cung cấp hàm UNIX_TIMESTAMP() để chuyển đổi ngày tháng thành dấu thời gian UNIX.

Mặc định, nếu không chỉ định giá trị cột TIMESTAMP khi chèn, giá trị này sẽ được đặt thành thời gian hiện tại.

Nên sử dụng TIMESTAMP nếu có thể, vì nó có hiệu suất cao hơn so với DATETIME.

### BLOB và TEXT

`BLOB` và `TEXT` đều được thiết kế để lưu trữ dữ liệu lớn, cái trước là dữ liệu nhị phân, cái sau là dữ liệu chuỗi.

Không thể sắp xếp hoặc tạo chỉ mục cho toàn bộ nội dung của kiểu `BLOB` và `TEXT`.

### Kiểu enum

Trong hầu hết các trường hợp, không cần sử dụng kiểu enum. Một trong những nhược điểm của kiểu enum là danh sách chuỗi enum là cố định, việc thêm và xóa chuỗi (lựa chọn enum) phải sử dụng `ALTER TABLE` (nếu chỉ thêm vào cuối danh sách, không cần xây dựng lại bảng).

### Lựa chọn kiểu dữ liệu

- Kiểu số nguyên thường là lựa chọn tốt nhất cho cột định danh, vì chúng nhanh chóng và có thể sử dụng `AUTO_INCREMENT`.
- Kiểu `ENUM` và `SET` thường là lựa chọn tồi, nên tránh sử dụng chúng.
- Nên tránh sử dụng kiểu chuỗi làm cột định danh, vì chúng chiếm không gian và thường chậm hơn kiểu số. Đối với các chuỗi ngẫu nhiên như `MD5`, `SHA`, `UUID`, do tính ngẫu nhiên, nên lưu trữ dưới dạng số lượng lớn, có thể sử dụng `BIGINT` thay cho `DECIMAL`. Để lưu trữ UUID, nên xóa dấu `-`; cách tốt hơn là chuyển đổi giá trị UUID thành số 16 byte bằng cách sử dụng hàm `UNHEX()` và lưu trữ trong cột `BINARY(16)`, khi truy vấn, có thể định dạng lại thành định dạng hexa bằng cách sử dụng hàm `HEX()`.

## Chỉ mục

> Chi tiết xem: [[MySQL Index]]

## Khóa

> Chi tiết xem: [[MySQL Locks]]

## Giao dịch

> Chi tiết xem: [[MySQL Transactions]]

## Tối ưu hiệu suất

> Chi tiết xem: [[MySQL Performance Optimization]]

## Sao chép

### Sao chép Master-Slave

MySQL hỗ trợ hai phương pháp sao chép: sao chép dựa trên hàng và sao chép dựa trên câu lệnh.

Cả hai phương pháp đều ghi lại nhật ký nhị phân trên máy chủ chính và sau đó chạy lại nhật ký trên máy chủ phụ để thực hiện sao chép dữ liệu không đồng bộ. Điều này có nghĩa là quá trình sao chép có độ trễ và trong khoảng thời gian này, dữ liệu trên máy chủ chính và máy chủ phụ có thể không nhất quán.

Chủ yếu liên quan đến ba luồng: luồng nhật ký nhị phân, luồng I/O và luồng SQL.

- **Luồng nhật ký nhị phân**: Đảm nhiệm việc ghi dữ liệu thay đổi từ máy chủ chính vào tệp nhật ký nhị phân (binlog).
- **Luồng I/O**: Đảm nhiệm đọc tệp nhật ký nhị phân từ máy chủ chính và ghi vào nhật ký chuyển tiếp trên máy chủ phụ.
- **Luồng SQL**: Đảm nhiệm đọc nhật ký chuyển tiếp và thực thi các câu lệnh SQL.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230721153816.png)

### Phân tách đọc ghi

Máy chủ chính được sử dụng để xử lý các hoạt động ghi và các hoạt động đọc có yêu cầu thời gian thực cao, trong khi máy chủ phụ được sử dụng để xử lý các hoạt động đọc.

Phân tách đọc ghi thường được thực hiện thông qua proxy, trong đó máy chủ proxy nhận các yêu cầu đọc và ghi từ ứng dụng, sau đó quyết định chuyển tiếp yêu cầu đến máy chủ nào.

Phân tách đọc ghi trong MySQL có thể cải thiện hiệu suất vì:

- Máy chủ chính và máy chủ phụ chịu trách nhiệm cho các hoạt động đọc và ghi riêng biệt, giảm đáng kể sự cạnh tranh khóa;
- Máy chủ phụ có thể được cấu hình để sử dụng hệ thống lưu trữ MyISAM, cải thiện hiệu suất truy vấn và tiết kiệm tài nguyên hệ thống;
- Tăng tính dự phòng, cải thiện khả năng sẵn có.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/master-slave-proxy.png)
