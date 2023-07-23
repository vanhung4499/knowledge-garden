---
title: MySQL Transactions
tags: [db, mysql, sql]
categories: [db, mysql, sql]
date created: 2023-07-22
date modified: 2023-07-23
---

# Giao dịch trong MySQL

> Không phải tất cả các engine lưu trữ của MySQL đều hỗ trợ giao dịch. Các engine lưu trữ hỗ trợ giao dịch bao gồm: `InnoDB` và `NDB Cluster`. Các engine lưu trữ không hỗ trợ giao dịch bao gồm: `MyISAM`.
>
> Người dùng có thể chọn engine lưu trữ phù hợp dựa trên việc có cần xử lý giao dịch hay không (xử lý giao dịch có thể đảm bảo an toàn dữ liệu nhưng sẽ tăng chi phí hệ thống).

## Giới thiệu về giao dịch

> Giao dịch đơn giản là: **Tất cả các hoạt động trong một phiên làm việc phải thành công hoặc thất bại cùng nhau**. Cụ thể hơn, giao dịch là một nhóm các hoạt động tuân thủ các đặc điểm ACID, có thể được gửi đi bằng cách sử dụng `Commit` để xác nhận giao dịch hoặc sử dụng `Rollback` để hoàn tác giao dịch.

![185b9c49-4c13-4241-a848-fbff85c03a64.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/185b9c49-4c13-4241-a848-fbff85c03a64.png)

**Giao dịch là một nhóm các câu lệnh SQL nguyên tử**. Cụ thể hơn, giao dịch là một nhóm các hoạt động tuân thủ các đặc điểm ACID.

**Các câu lệnh SQL trong giao dịch phải được thực thi hoàn toàn thành công hoặc thất bại hoàn toàn**.

**Các cơ chế cách ly giao dịch khác nhau có thể được thực hiện bằng cách sử dụng khóa**.

Hãy tưởng tượng nếu không có giao dịch, trong môi trường đồng thời, có thể xảy ra việc mất mát thay đổi.

Hai luồng T1 và T2 đều thay đổi dữ liệu, T1 thay đổi trước, T2 thay đổi sau, thay đổi của T2 ghi đè lên thay đổi của T1.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230721002023.png)

## Cách sử dụng giao dịch

### Các lệnh xử lý giao dịch

Trong MySQL, sử dụng câu lệnh `START TRANSACTION` để bắt đầu một giao dịch; sử dụng câu lệnh `COMMIT` để xác nhận tất cả các thay đổi; sử dụng câu lệnh `ROLLBACK` để hoàn tác tất cả các thay đổi. Không thể hoàn tác câu lệnh `SELECT`, việc hoàn tác câu lệnh `SELECT` cũng không có ý nghĩa; cũng không thể hoàn tác câu lệnh `CREATE` và `DROP`.

- `START TRANSACTION` - Câu lệnh dùng để đánh dấu điểm bắt đầu của giao dịch.
- `SAVEPOINT` - Câu lệnh dùng để tạo điểm lưu trữ.
- `ROLLBACK TO` - Câu lệnh dùng để hoàn tác đến điểm lưu trữ đã chỉ định; nếu không có điểm lưu trữ được đặt, nó sẽ hoàn tác đến câu lệnh `START TRANSACTION`.
- `COMMIT` - Xác nhận giao dịch.

Ví dụ xử lý giao dịch:

(1) Tạo một bảng ví dụ

```sql
-- Xóa bảng user nếu tồn tại
DROP TABLE IF EXISTS user;

-- Tạo bảng user
CREATE TABLE user (
  id int(10) unsigned NOT NULL COMMENT 'Id',
  username varchar(64) NOT NULL DEFAULT 'default' COMMENT 'Tên đăng nhập',
  password varchar(64) NOT NULL DEFAULT 'default' COMMENT 'Mật khẩu',
  email varchar(64) NOT NULL DEFAULT 'default' COMMENT 'Email'
) COMMENT='Bảng người dùng';
```

(2) Thực hiện các hoạt động giao dịch

```sql
-- Bắt đầu giao dịch
START TRANSACTION;

-- Thực hiện hoạt động A
INSERT INTO `user`
VALUES (1, 'root1', 'root1', 'xxxx@163.com');

-- Tạo điểm lưu trữ updateA
SAVEPOINT updateA;

-- Thực hiện hoạt động B
INSERT INTO `user`
VALUES (2, 'root2', 'root2', 'xxxx@163.com');

-- Hoàn tác đến điểm lưu trữ updateA
ROLLBACK TO updateA;

-- Xác nhận giao dịch, chỉ hoạt động A được áp dụng
COMMIT;
```

(3) Kết quả thực thi

```sql
SELECT * FROM user;
```

Kết quả:

```
1	root1	root1	xxxx@163.com
```

### AUTOCOMMIT

**Mặc định, MySQL sử dụng chế độ xác nhận ngầm (`autocommit`)**. Mỗi câu lệnh được thực thi được coi là một giao dịch và được xác nhận. Khi gặp câu lệnh `START TRANSACTION`, chế độ xác nhận ngầm sẽ bị tắt; sau khi thực hiện câu lệnh `COMMIT` hoặc `ROLLBACK`, giao dịch sẽ tự động đóng và chế độ xác nhận ngầm sẽ được khôi phục.

Bằng cách sử dụng `set autocommit=0`, bạn có thể hủy bỏ xác nhận tự động cho đến khi `set autocommit=1` được thực hiện; cờ `autocommit` được áp dụng cho mỗi kết nối chứ không phải cho máy chủ.

```sql
-- Xem cờ AUTOCOMMIT
SHOW VARIABLES LIKE 'AUTOCOMMIT';

-- Tắt AUTOCOMMIT
SET autocommit = 0;

-- Bật AUTOCOMMIT
SET autocommit = 1;
```

# ACID

ACID là bốn yếu tố cơ bản để đảm bảo thực hiện giao dịch đúng đắn trong cơ sở dữ liệu.

- **Tính nguyên tử (Atomicity)**
    - Giao dịch được coi là đơn vị nhỏ nhất không thể chia tách, tất cả các hoạt động trong giao dịch phải được thực hiện hoàn toàn thành công hoặc hoàn toàn thất bại.
    - Rollback có thể được thực hiện bằng cách sử dụng nhật ký, nhật ký ghi lại các thay đổi được thực hiện trong giao dịch và thực hiện ngược lại các thay đổi này khi rollback.
- **Tính nhất quán (Consistency)**
    - Cơ sở dữ liệu duy trì trạng thái nhất quán trước và sau khi thực hiện giao dịch.
    - Trong trạng thái nhất quán, kết quả đọc của tất cả các giao dịch đối với một dữ liệu là giống nhau.
- **Tính cô lập (Isolation)**
    - Sự thay đổi mà một giao dịch thực hiện không được nhìn thấy bởi các giao dịch khác cho đến khi nó được cam kết.
- **Tính bền vững (Durability)**
    - Khi một giao dịch được cam kết, các thay đổi mà nó thực hiện sẽ được lưu trữ vĩnh viễn trong cơ sở dữ liệu. Ngay cả khi hệ thống gặp sự cố, kết quả của giao dịch vẫn không bị mất.
    - Điều này có thể được đạt được bằng sao lưu và khôi phục cơ sở dữ liệu, trong trường hợp hệ thống gặp sự cố.

**Hệ thống cơ sở dữ liệu hỗ trợ giao dịch phải có bốn tính chất này, nếu không, không thể đảm bảo tính chính xác của dữ liệu trong quá trình giao dịch.**

- Chỉ khi tuân thủ tính nhất quán, kết quả thực hiện của giao dịch mới là chính xác.
- Trong trường hợp không có sự cạnh tranh, khi giao dịch được thực hiện tuần tự, tính cô lập sẽ được đảm bảo. Khi đó, chỉ cần đảm bảo tính nguyên tử, tính nhất quán cũng sẽ được đảm bảo.
- Trong trường hợp có sự cạnh tranh, khi nhiều giao dịch được thực hiện song song, giao dịch không chỉ cần đảm bảo tính nguyên tử mà còn cần đảm bảo tính cô lập để đảm bảo tính nhất quán.
- Tính bền vững của giao dịch là để xử lý trường hợp hệ thống gặp sự cố.

![acid.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/acid.png)

> Mysql mặc định sử dụng chế độ tự động cam kết (`AUTO COMMIT`). Điều này có nghĩa là nếu không sử dụng rõ ràng câu lệnh `START TRANSACTION` để bắt đầu một giao dịch, mỗi câu lệnh truy vấn sẽ được coi là một giao dịch và tự động cam kết.

## Các cấp độ cô lập giao dịch

### Giới thiệu về cấp độ cô lập giao dịch

Trong môi trường đồng thời, rất khó đảm bảo tính cô lập của giao dịch, do đó sẽ xuất hiện nhiều vấn đề về tính nhất quán:

- **Mất mát thay đổi**
- **Đọc bẩn (Dirty Read)**
- **Đọc không nhất quán (Non-Repeatable Read)**
- **Đọc ảo (Phantom Read)**

Trong tiêu chuẩn SQL, xác định bốn cấp độ cô lập giao dịch (từ thấp đến cao):

- **Đọc chưa cam kết (Read Uncommitted)**
- **Đọc đã cam kết (Read Committed)**
- **Đọc lặp lại (Repeatable Read)**
- **Serializable (Serializable)**

Xem và thiết lập cấp độ cô lập giao dịch trong MySQL:

```sql
-- Xem cấp độ cô lập giao dịch
SHOW VARIABLES LIKE 'transaction_isolation';

-- Thiết lập cấp độ cô lập giao dịch là READ UNCOMMITTED
SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

-- Thiết lập cấp độ cô lập giao dịch là READ COMMITTED
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- Thiết lập cấp độ cô lập giao dịch là REPEATABLE READ
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- Thiết lập cấp độ cô lập giao dịch là SERIALIZABLE
SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

### Đọc chưa cam kết

**`Đọc chưa cam kết (Read Uncommitted)`** có nghĩa là: Các thay đổi trong giao dịch, ngay cả khi chưa được cam kết, cũng có thể nhìn thấy bởi các giao dịch khác.

Vấn đề của đọc chưa cam kết: Giao dịch có thể đọc dữ liệu chưa được cam kết, còn được gọi là **đọc bẩn (Dirty Read)**.

T1 thay đổi một dữ liệu, T2 sau đó đọc dữ liệu này. Nếu T1 hủy bỏ thay đổi này, thì dữ liệu đọc bởi T2 là dữ liệu bẩn.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/202307210021321.png)

### Đọc đã cam kết

**`Đọc đã cam kết (Read Committed)`** có nghĩa là: Các thay đổi trong giao dịch chỉ có thể nhìn thấy bởi các giao dịch khác sau khi đã được cam kết. Nó giải quyết vấn đề đọc dơ bẩn.

Đọc đã cam kết là cấp độ cô lập mặc định của hầu hết các cơ sở dữ liệu.

Vấn đề của đọc đã cam kết: Khi thực hiện hai lần truy vấn giống nhau, kết quả có thể không nhất quán.

T2 đọc một dữ liệu, T1 thay đổi dữ liệu này. Nếu T2 đọc dữ liệu này lần nữa, kết quả đọc sẽ khác với kết quả đọc lần đầu.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230721002326.png)

### Đọc lặp lại

**`Đọc lặp lại (Repeatable Read)`** có nghĩa là: Đảm bảo kết quả của việc đọc nhiều lần cùng một dữ liệu trong cùng một giao dịch là giống nhau. Đọc lặp lại giải quyết vấn đề đọc không nhất quán.

Đọc lặp lại là cấp độ cô lập mặc định của MySQL.

Vấn đề của đọc lặp lại: Khi một giao dịch T1 đọc một phạm vi dữ liệu, giao dịch T2 chèn một bản ghi mới vào phạm vi đó, sau đó giao dịch T1 đọc lại phạm vi dữ liệu này, kết quả đọc sẽ khác với kết quả đọc lần đầu, được gọi là **đọc ảo (Phantom Read)**.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230721002333.png)

### Tuần tự hoá

**`Tuần tự hoá (Serializable)`** có nghĩa là: Buộc giao dịch thực hiện tuần tự, khóa đọc và ghi cho cùng một hàng dữ liệu. Nếu xảy ra xung đột khóa, giao dịch phía trước phải chờ giao dịch phía sau giải phóng khóa.

Thực hiện giao dịch tuần tự sẽ tránh tất cả các vấn đề đồng thời. Chiến lược tuần tự hóa sẽ khóa từng hàng dữ liệu được đọc, điều này có thể dẫn đến nhiều thời gian chờ và cạnh tranh khóa. Điều này gần như không thể chấp nhận được đối với các ứng dụng có độ tải cao, vì vậy thường không sử dụng cấp độ này.

### Tóm tắt về các cấp độ cô lập

- **`Đọc chưa cam kết (Read Uncommitted)`** - Các thay đổi trong giao dịch, ngay cả khi chưa được cam kết, cũng có thể nhìn thấy bởi các giao dịch khác.
- **`Đọc đã cam kết (Read Committed)`** - Các thay đổi trong giao dịch chỉ có thể nhìn thấy bởi các giao dịch khác sau khi đã được cam kết.
- **`Đọc lặp lại (Repeatable Read)`** - Đảm bảo kết quả của việc đọc nhiều lần cùng một dữ liệu trong cùng một giao dịch là giống nhau.
- **`Tuần tự hoá (Serializable)`** - Buộc giao dịch thực hiện tuần tự, khóa đọc và ghi cho cùng một hàng dữ liệu.

Các vấn đề được giải quyết bởi các cấp độ cô lập giao dịch:

| Cấp độ cô lập | Mất mát thay đổi | Đọc bẩn | Đọc không nhất quán | Đọc ảo |
| :----------: | :-------------: | :--------: | :-----------------: | :---------: |
|  Đọc chưa cam kết |       ✔️        |     ❌      |         ❌          |     ❌      |
|   Đọc đã cam kết  |       ✔️        |     ✔️      |         ❌          |     ❌      |
|  Đọc lặp lại      |       ✔️        |     ✔️      |         ✔️          |     ❌      |
|  Tuần tự hoá |       ✔️        |     ✔️      |         ✔️          |     ✔️      |

## Deadlock (Bế tắc)

**Deadlock là tình huống mà hai hoặc nhiều giao dịch cạnh tranh với nhau để khóa tài nguyên của nhau, dẫn đến một vòng lặp vô hạn**.

Các tình huống gây ra deadlock:

- Khi nhiều giao dịch cố gắng khóa tài nguyên theo một thứ tự khác nhau, có thể gây ra deadlock.
- Khi nhiều giao dịch cùng khóa cùng một tài nguyên, cũng có thể gây ra deadlock.

### Nguyên nhân của deadlock

Có ba loại khóa hàng (lock) được sử dụng trong InnoDB: record lock, gap lock và next-key lock. Record lock được sử dụng để khóa các mục chỉ mục, gap lock được sử dụng để gap lock giữa các mục chỉ mục và next-key lock là sự kết hợp của hai loại khóa trên.

Chỉ có trong các hoạt động đọc lặp lại hoặc cấp độ cô lập cao hơn, các hoạt động đọc và ghi sử dụng gap lock hoặc next-key lock. Trong các truy vấn `Select`, `Update` và `Delete`, ngoại trừ truy vấn dựa trên chỉ mục duy nhất, các truy vấn sử dụng các chỉ mục khác sẽ lấy gap lock hoặc next-key lock, tức là khóa các phạm vi quét. Chỉ mục khóa chính (primary index) cũng là một chỉ mục duy nhất (unique index), vì vậy nó không sử dụng gap lock hoặc next-key lock.

Trong MySQL, gap lock mặc định là bật, tức là giá trị của innodb_locks_unsafe_for_binlog là disable và cấp độ cô lập mặc định trong MySQL là RR.

Khi chúng ta thực hiện truy vấn SQL sau, vì cột order_no không phải là chỉ mục duy nhất, và cấp độ cô lập là RR, vì vậy loại khóa của SELECT là gap lock, phạm vi gap là (4,+∞).

```sql
SELECT id FROM `demo`.`order_record` where `order_no` = 4 for update;
```

Khi chúng ta thực hiện truy vấn SQL INSERT sau, nó sẽ lấy khóa ý định chèn vào khoảng trống. Khóa ý định chèn cũng là một loại gap lock, và nó xung đột với gap lock, vì vậy khi một giao dịch giữ gap lock của khoảng trống, nó phải chờ đợi giao dịch khác giải phóng gap lock trước khi có thể lấy khóa ý định chèn (insert intention lock).

Cả hai giao dịch A và B đều giữ gap lock của khoảng (4,+∞), và tiếp theo là lấy khóa ý định chèn. Vì vậy, cả hai giao dịch đang chờ đợi giao dịch khác giải phóng gap lock. Do đó tạo ra một vòng lặp chờ đợi, gây ra deadlock.

```sql
INSERT INTO `demo`.`order_record`(`order_no`, `status`, `create_date`) VALUES (5, 1, ‘2019-07-13 10:57:03’);
```

| Lock             | Gap | Insert Intention | Record | Next Key |
| :--------------: | :---: | :----------------: | :------: | :--------: |
| Gap              | Tương thích | Xung đột | Tương thích | Tương thích |
| Insert Intention | Xung đột | Tương thích | Tương thích | Xung đột |
| Record           | Tương thích | Tương thích | Xung đột | Xung đột |
| Next Key         | Tương thích | Tương thích | Xung đột | Xung đột |  

> Nhận xét: chiều ngang là khóa đã nắm giữ, chiều dọc là khóa đang yêu cầu.

**Một tình huống deadlock khác**

Chỉ mục khoá chính (primary index) của InnoDB là chỉ mục cụm (clustered index), các chỉ mục khác là chỉ mục phụ (non-clustered index). Nếu sử dụng chỉ mục phụ để cập nhật cơ sở dữ liệu, cần sử dụng chỉ mục cụm để cập nhật các trường dữ liệu. Nếu hai giao dịch cập nhật sử dụng các chỉ mục phụ khác nhau hoặc một giao dịch sử dụng chỉ mục phụ và một giao dịch sử dụng chỉ mục cụm, đều có thể dẫn đến sự chờ đợi vòng lặp tài nguyên khoá và gây ra deadlock. Vì các giao dịch này là xung đột với nhau nên bốn điều kiện cần thiết để xảy ra deadlock trên được hình thành.

| Transaction A                                             | Transaction B                                             |
| --------------------------------------------------------- | --------------------------------------------------------- |
| BEGIN;                                                    | BEGIN;                                                    |
| UPDATE `order_record` SET status = 1 WHERE `order_no` = 4 | UPDATE `order_record` SET status = 1 WHERE `order_no` = 4 |

Xuất hiện tình trạng deadlock theo các bước sau:

| Transaction A                                                                               | Transaction B                          |
| ------------------------------------------------------------------------------------------- | -------------------------------------- |
| Đầu tiên lấy idx_order_status (non-clustered index)                                           |                                        |
|                                                                                             | Nhận khóa hàng trên chỉ mục khóa chính |
| Theo khóa chính (primary key) thu được bởi chỉ mục phụ (non-clustered index), lấy chỉ mục khóa chính (primary index), khoá hàng (row lock) |                                        |
|                                                                                             | Khi cập nhật cột status cần lấy idx_order_status (non-clusered index) |  

Từ những điều đã trình bày ở trên, chúng ta có thể hiểu rằng trong quá trình cập nhật dữ liệu, chúng ta nên sử dụng khóa chính để cập nhật các trường trong bảng một cách tối đa. Điều này giúp ngăn chặn hiện tượng xảy ra deadlock không cần thiết.

### Tránh tình trạng bế tắc

Những điều cần lưu ý để ngăn chặn tình trạng bế tắc:

- Trong quá trình lập trình, hãy cố gắng xử lý các bản ghi cơ sở dữ liệu theo một thứ tự cố định. Giả sử có hai hoạt động cập nhật, mỗi hoạt động cập nhật một bản ghi giống nhau nhưng thứ tự cập nhật khác nhau, có thể dẫn đến tình trạng bế tắc.
- Trong trường hợp cho phép đọc không nhất quán và đọc không lặp lại, hãy sử dụng cấp độ cô lập giao dịch RC để tránh tình trạng bế tắc do gap lock.
- Khi cập nhật bảng, hãy cố gắng sử dụng khóa chính để cập nhật.
- Tránh giao dịch kéo dài, hãy cố gắng chia nhỏ giao dịch để giảm khả năng xung đột với các giao dịch khác.
- Đặt tham số timeout chờ khóa hợp lý, chúng ta có thể sử dụng `innodb_lock_wait_timeout` để đặt ngưỡng timeout hợp lý, đặc biệt là trong các hoạt động kinh doanh có tải cao, chúng ta có thể đặt giá trị này nhỏ hơn để tránh việc chờ đợi nhiều giao dịch, chiếm tài nguyên hệ thống và gây ra tác động nghiêm trọng đến hiệu suất.

Ngoài ra, chúng ta cũng có thể đặt cột `order_no` là cột chỉ mục duy nhất. Mặc dù không thể ngăn chặn việc đọc không nhất quán, nhưng chúng ta có thể sử dụng tính duy nhất của nó để đảm bảo không tạo bản ghi đơn hàng trùng lặp. Nhược điểm duy nhất của phương pháp này là khi gặp tình trạng tạo đơn hàng trùng lặp, nó sẽ gây ra ngoại lệ.

Chúng ta cũng có thể sử dụng các phương pháp khác để thay thế cơ sở dữ liệu để kiểm tra tính đơn nhất. Ví dụ, sử dụng Redis và ZooKeeper để thực hiện, hiệu suất chạy tốt hơn so với cơ sở dữ liệu.

### Giải quyết tình trạng bế tắc

Khi gặp tình trạng bế tắc, có hai chiến lược:

- Một chiến lược là tiếp tục chờ đợi cho đến khi hết thời gian chờ. Thời gian chờ này có thể được đặt thông qua tham số `innodb_lock_wait_timeout`.
- Chiến lược khác là thực hiện kiểm tra bế tắc, khi phát hiện bế tắc, hủy bỏ một giao dịch trong chuỗi bế tắc, cho phép các giao dịch khác tiếp tục thực hiện. Đặt tham số `innodb_deadlock_detect` thành on để bật cơ chế này.

Trong InnoDB, giá trị mặc định của `innodb_lock_wait_timeout` là 50 giây, có nghĩa là nếu sử dụng chiến lược thứ nhất, khi gặp tình trạng bế tắc, giao dịch đầu tiên bị khóa sẽ chờ đợi trong 50 giây trước khi hết thời gian chờ và sau đó các giao dịch khác mới có thể tiếp tục thực hiện. Đối với dịch vụ trực tuyến, thời gian chờ này thường không thể chấp nhận được.

Tuy nhiên, chúng ta không thể đặt thời gian chờ quá nhỏ, ví dụ 1 giây. Nếu làm như vậy, khi gặp tình trạng bế tắc, thực sự sẽ giải quyết nhanh chóng, nhưng nếu không phải là bế tắc mà chỉ là chờ khóa đơn giản thì sao? Vì vậy, nếu đặt thời gian chờ quá ngắn, sẽ có nhiều trường hợp giả mạo.

Vì vậy, thông thường chúng ta vẫn nên sử dụng chiến lược thứ hai, tức là kiểm tra bế tắc một cách chủ động, và giá trị mặc định của `innodb_deadlock_detect` là `on`. Để giải quyết tình trạng bế tắc, các cơ sở dữ liệu khác nhau đã triển khai các cơ chế kiểm tra bế tắc và thời gian chờ riêng. Chính sách xử lý bế tắc của InnoDB là: **rollback giao dịch nắm giữ ít khóa độc quyền cấp hàng nhất**.

Kiểm tra bế tắc chủ động có thể nhanh chóng phát hiện và xử lý khi gặp tình trạng bế tắc, nhưng nó cũng có gánh nặng bổ sung. Bạn có thể tưởng tượng quá trình này: Mỗi khi một giao dịch bị khóa, hãy xem xem các luồng mà nó phụ thuộc vào có bị khóa bởi người khác không, và lặp lại quá trình này, cuối cùng xác định xem có xảy ra chờ đợi vòng lặp, tức là bế tắc hay không.

### Giao dịch phân tán

Trong một nút dữ liệu đơn lẻ, giao dịch chỉ giới hạn trong việc kiểm soát truy cập vào tài nguyên cơ sở dữ liệu duy nhất, được gọi là **giao dịch cục bộ**. Hầu hết các hệ quản trị cơ sở dữ liệu quan hệ đã cung cấp hỗ trợ gốc cho giao dịch cục bộ.

**Giao dịch phân tán là giao dịch trải dài qua nhiều nút và yêu cầu tuân thủ các tính chất ACID của giao dịch.**

Các phương án phổ biến cho giao dịch phân tán bao gồm:

- **Hai giai đoạn cam kết (2PC)** - Chia quá trình xác nhận giao dịch thành hai giai đoạn: giai đoạn chuẩn bị và giai đoạn cam kết. Người tham gia thông báo cho người điều phối về kết quả thành công hoặc thất bại của hoạt động, sau đó người điều phối quyết định xem tất cả người tham gia có nên thực hiện hoạt động hoặc hủy bỏ hoạt động hay không.
- **Ba giai đoạn cam kết (3PC)** - Khác với hai giai đoạn cam kết, giai đoạn cam kết ba giai đoạn giới thiệu cơ chế vượt quá thời gian. Đồng thời, cả người điều phối và người tham gia đều có cơ chế vượt quá thời gian. Giai đoạn chuẩn bị của hai giai đoạn cam kết được chia thành hai giai đoạn, chèn một giai đoạn preCommit, giải quyết vấn đề thời gian chờ lâu có thể xảy ra trong quá trình xác nhận hai giai đoạn khi người điều phối gặp sự cố hoặc lỗi.
- **Giao dịch bù trừ (TCC)**
	- **Thử** - Hoạt động như giai đoạn một, chịu trách nhiệm kiểm tra và dự trữ tài nguyên.
	- **Cam kết** - Hoạt động như hoạt động xác nhận hai giai đoạn, thực hiện thực sự của doanh nghiệp.
	- **Hủy bỏ** - Hủy bỏ việc dự trữ tài nguyên.
- **Bảng tin tin nhắn cục bộ** - Giao dịch khởi tạo bảng tin nhắn giao dịch mới trong bên gửi giao dịch, bên gửi giao dịch xử lý kinh doanh và ghi lại tin nhắn giao dịch trong giao dịch cục bộ, gửi tin nhắn giao dịch dựa trên dữ liệu trong bảng tin nhắn giao dịch, bên nhận giao dịch tiêu thụ tin nhắn giao dịch trong bảng tin nhắn giao dịch.
- **Giao dịch MQ** - Phương án giao dịch phân tán dựa trên bảng tin nhắn giao dịch cục bộ thực chất là một bảng tin nhắn giao dịch.
- **Saga** - Ý tưởng cốt lõi của giao dịch Saga là chia nhỏ giao dịch dài thành nhiều giao dịch cục bộ ngắn, được điều phối bởi bộ điều phối giao dịch Saga. Nếu kết thúc bình thường, thì hoàn thành bình thường, nếu một bước thất bại, sau đó gọi lại các hoạt động bù trừ theo thứ tự ngược lại.

Phân tích các phương án giao dịch phân tán:

- 2PC/3PC phụ thuộc vào cơ sở dữ liệu, có thể cung cấp tính nhất quán và tính chất giao dịch mạnh mẽ, nhưng độ trễ tương đối cao, phù hợp với ứng dụng truyền thống đơn lẻ, trong trường hợp có hoạt động chạy qua nhiều cơ sở dữ liệu trong cùng một phương thức, không phù hợp với các tình huống đòi hỏi đồng thời và hiệu suất cao.
- TCC phù hợp với thời gian thực và ngắn, yêu cầu tính thời gian thực cao, yêu cầu tính nhất quán dữ liệu cao, ví dụ như ba dịch vụ trung tâm của các doanh nghiệp tài chính trực tuyến: giao dịch, thanh toán, tài khoản.
- Bảng tin tin nhắn cục bộ/MQ giao dịch đều phù hợp với các bên tham gia hỗ trợ hoạt động độc lập, yêu cầu tính nhất quán không cao, doanh nghiệp có thể chấp nhận không nhất quán dữ liệu cho đến một chu kỳ kiểm tra thủ công.
- Saga do Saga không đảm bảo tính cô lập, cần kiểm soát đồng thời ở mức doanh nghiệp, phù hợp với các tình huống giao dịch đồng thời trên cùng một tài nguyên ít hơn. Saga so với thiếu hành động xác nhận, dẫn đến việc triển khai hoạt động bù trừ khá phức tạp, ví dụ như kinh doanh là gửi tin nhắn, hoạt động bù trừ phải gửi một tin nhắn khác, trải nghiệm người dùng khá tệ. Saga phù hợp với các tình huống mà hoạt động bù trừ dễ xử lý.

## Thực hành tốt nhất cho giao dịch

> Làm thế nào để tối ưu giao dịch trong các tình huống có tải cao?

### Sử dụng cấp độ cô lập giao dịch thấp nhất có thể

Kết hợp với kịch bản kinh doanh, hãy cố gắng sử dụng cấp độ cô lập giao dịch thấp nhất có thể.

### Tránh việc nâng cấp khóa hàng thành khóa bảng

Trong InnoDB, khóa hàng được thực hiện thông qua chỉ mục. Nếu không sử dụng điều kiện tìm kiếm dữ liệu thông qua chỉ mục, khóa hàng sẽ được nâng cấp thành khóa bảng. Chúng ta biết rằng khóa bảng sẽ ảnh hưởng nghiêm trọng đến hiệu suất hoạt động của toàn bộ bảng, vì vậy cần cố gắng tránh việc này.

### Thu nhỏ phạm vi giao dịch

Đôi khi, khi lượng truy cập cơ sở dữ liệu đồng thời quá lớn, sẽ xảy ra các ngoại lệ sau:

```
MySQLQueryInterruptedException: Query execution was interrupted
```

Trong tình huống đồng thời cao, khi cập nhật một bản ghi, do giao dịch còn có thể chứa các hoạt động khác, một giao dịch có thể trở nên dài hơn. Khi có nhiều yêu cầu đồng thời, có thể xảy ra tình huống một số yêu cầu cùng tham gia vào giao dịch.

Vì cạnh tranh khóa không công bằng, khi nhiều giao dịch cùng cập nhật một bản ghi, trong trường hợp cực đoan, một hoạt động cập nhật có thể bị chờ đợi trong hệ thống hàng đợi mà không bao giờ nhận được khóa. Cuối cùng, nó sẽ bị hệ thống huỷ bỏ và đẩy ra.

| Thứ tực thực hiện 1                                                    | Thứ tực thực hiện 2                                                    |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 1. Mở giao dịch                                                        | 1. Mở giao dịch                                                        |
| 2. Truy vấn hàng tồn kho và đánh giá xem hàng tồn kho có đáp ứng không | 2. Truy vấn hàng tồn kho và đánh giá xem hàng tồn kho có đáp ứng không |
| 3. Tạo đơn hàng mới                                                    | 3. Khấu trừ hàng tồn kho                                               |
| 4. Khấu trừ hàng tồn kho                                               | 4. Tạo đơn hàng mới                                                    |
| 5. Cam kết hoặc Khôi phục                                              | 5. Cam kết hoặc Phục hồi                                               |

Như mô tả trên, mặc dù tất cả đều trong một giao dịch, nhưng yêu cầu khóa xảy ra vào thời gian khác nhau. Chỉ khi tất cả các hoạt động khác đã hoàn thành, tất cả khóa mới được giải phóng. Vì việc khấu trừ kho là một hoạt động cập nhật và là khóa hàng, nó sẽ ảnh hưởng đến các giao dịch khác liên quan đến dữ liệu này. Vì vậy, chúng ta nên cố gắng tránh giữ khóa trong thời gian dài nhất có thể và giải phóng khóa sớm nhất có thể. Vì việc tạo đơn hàng trước và việc trừ kho trước đều không ảnh hưởng đến kinh doanh, chúng ta có thể đặt hoạt động trừ kho cuối cùng, tức là sử dụng thứ tự thực hiện 1, để giảm thiểu thời gian giữ khóa.

**Trong giao dịch InnoDB, khóa hàng được thêm vào khi cần thiết, nhưng không được giải phóng ngay khi không cần thiết nữa, mà chỉ được giải phóng khi giao dịch kết thúc. Đây chính là giao thức khóa hai giai đoạn.**

Biết được điều này, điều này sẽ giúp chúng ta sử dụng giao dịch một cách hiệu quả hơn. Nếu giao dịch của bạn cần khóa nhiều hàng, hãy đặt các khóa có thể gây xung đột nhất và có thể ảnh hưởng đến độ tương thích càng sau càng tốt, tức là ở cuối danh sách các hoạt động.
