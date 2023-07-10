---
categories: [database, computer-science]
date created: 2023-06-27
date modified: 2023-07-10
tags: [database, computer-science]
title: Transaction ACID Theory
---

## 🔎 Giao dịch (Transaction) Part 1

Giao dịch là một khái niệm quan trọng.  

Khi xử lý đồng bộ hóa dữ liệu lớn, tùy thuộc vào cách giao dịch được xử lý, giao dịch ảnh hưởng đến tính toàn vẹn của dữ liệu.

### Khái niệm

- Giao dịch là một đơn vị công việc trong cơ sở dữ liệu, thực hiện một chức năng logic duy nhất. Cách truy cập vào cơ sở dữ liệu là thông qua các truy vấn (query), nghĩa là giao dịch là một đơn vị gom nhóm nhiều truy vấn lại với nhau.
- Giao dịch có chức năng đảm bảo **tính nhất quán** của dữ liệu trong cơ sở dữ liệu.
- Chúng đảm bảo rằng tất cả các thao tác trong một tập hợp công việc logic được thực hiện hoàn toàn (commit), hoặc trong trường hợp không thể thực hiện, phục hồi trạng thái ban đầu (rollback) để tránh hiện tượng áp dụng một phần công việc.

#### COMMIT

- Lưu trữ nội dung công việc đã thực hiện vào cơ sở dữ liệu một cách vĩnh viễn.  
- Kết thúc giao dịch.  

#### ROLLBACK  

- Hủy bỏ tất cả các công việc đã thực hiện và khôi phục trạng thái trước của giao dịch.  
- Kết thúc giao dịch.  

#### AUTOCOMMIT  

- Khái niệm tự động xử lý giao dịch cho mỗi truy vấn.  
- Nếu truy vấn thành công, tự động thực hiện commit.  
- Nếu có vấn đề xảy ra trong quá trình thực thi, tự động thực hiện rollback.  
- Trong MySQL, mặc định autocommit được bật.  
- Khi thực hiện lệnh START TRANSACTION trong MySQL, autocommit sẽ tắt ngay lập tức.  
- Khi giao dịch kết thúc với COMMIT/ROLLBACK, trạng thái autocommit sẽ trở lại như ban đầu.

Rất nhiều nội dung. Tóm tắt trong hai dòng:

> Giao dịch là một đơn vị công việc để thực hiện một chức năng logic trong cơ sở dữ liệu.  
> all or nothing | Thành công -> Commit, Thất bại -> Rollback

### Ví dụ : chuyển tiền giữa các tài khoản

Thao tác chuyển khoản rút 100.000 won từ một tài khoản và gửi 100.000 won vào tài khoản khác phải được hoàn thành bình thường hoặc nếu không thể xử lý thành công thì phải trả lại trạng thái ban đầu khi chưa thực hiện gì.

Hãy xem xét tình huống chi tiết hơn.

Thỏ muốn chuyển 100.000 VND cho Mèo.

```
🐰 Rabbit Account : 2000000
🐱 Cat Account    : 1000000
```

Hai thao công việc ra vào lúc này.

#### 1) 🐰 Rabbit Account - 10000

```sql
UPDATE account SET balance = balance - 100000 WHERE id = "rabbit";
```

#### 2) 🐱 Cat Account + 10000

```sql
UPDATE account SET balance = balance + 100000 WHERE id = "cat";
```

Lúc này nếu chỉ một trong hai công việc này thành công thì đó không phải là giao dịch bình thường.

Cả hai công việc đều phải thành công để giao dịch "chuyển khoản" được coi là thành công.

### Ví dụ : MySQL

Hãy thực hiện ví dụ trên với MySQL.

```sql
START TRANSACTION;
UPDATE account SET balance = balance - 100000 WHERE id = "rabbit";
UPDATE account SET balance = balance + 100000 WHERE id = "cat";
COMMIT;
```

Khi giao dịch kết thúc, tài khoản của Thỏ và Mèo lần lượt có 1,9 triệu đồng và 1,1 triệu đồng.

```
🐰 Rabbit Account : 1900000
🐱 Cat Account    : 1100000
```

Tại thời điểm này, thực hiện hoạt động thêm một lần nữa.

Ngay sau khi câu lệnh UPDATE được thực thi, tài khoản của Thỏ chỉ còn 1,8 triệu won.

```sql
START TRANSACTION;
UPDATE account SET balance = balance - 100000 WHERE id = "rabbit";
ROLLBACK;
```

Nếu bạn ROLLBACK vào thời điểm này, số tiền trong tài khoản của Thỏ sẽ trở về 1,9 triệu đồng.

### Ví dụ : JAVA

Triển kahi giao dịch dưới dạng code JAVA.

```java
public void transfer(String fromId, String toId, int amount) {
        try {
            Connection connection = ...;      // get DB connection ..
            connection.setAutoCommit(false);  // means START TRANSACTION
            ...                               // update at fromId
            ...                               // update at toId
            connection.commit();
        } catch (Exception e) {
            ...
            connection.rollback();
            ...
        } finally {
            connection.setAutoCommit(true);
        }
}
```

![transaction_java](https://raw.githubusercontent.com/vanhung4499/images/master/snap/transaction_java.png)

Trong Spring Boot, giao dịch có thể được triển khai đơn giản với chú thích `@Transactional`.

### ✔️ Trạng thái giao dịch

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230627193226.jpeg)

Commit và Rollback có thể xảy ra trong các trạng thái khác nhau của giao dịch:

- **Active**: Giao dịch đang được thực thi và trong trạng thái hoạt động.
- **Partially Committed**: Giao dịch đã được thực thi và các thay đổi dữ liệu đã được áp dụng trong bộ nhớ đệm, nhưng chưa được áp dụng vào cơ sở dữ liệu thực tế.
- **Committed**: Giao dịch đã hoàn thành một cách thành công. Các thay đổi dữ liệu đã được áp dụng vào cơ sở dữ liệu và không thể rollback.
- **Failed**: Giao dịch bị lỗi và không thể tiếp tục thực thi.
- **Aborted**: Giao dịch đã bị hủy bỏ. Dữ liệu được phục hồi về trạng thái trước khi giao dịch bắt đầu
- **Terminated**: Giao dịch kết thúc và hệ thống có thể thực thi giao dịch mới

## Tính chât ACID

### 1) Tính nguyên tử (`Atomicity`)

- Đảm bảo rằng tất cả các hoạt động liên quan đến giao dịch đã được thực hiện hoặc không được thực hiện
- all or nothing
- Trước khi commit, dữ liệu chỉ được lưu trữ trong bộ nhớ đệm và không được ghi vào đĩa. Nếu giao dịch thất bại, không có hoạt động ghi nào được thực hiện trên đĩa.

### 2) Tính nhất quán (`Consistency`)

- Đảm bảo rằng sau khi giao dịch hoàn thành, trạng thái dữ liệu phải đồng nhất với trạng thái trước khi giao dịch bắt đầu.
- Điều này được đảm bảo bằng cách sử dụng ràng buộc và quy tắc đã được định nghĩa trước đó trong cơ sở dữ liệu. Nếu giao dịch vi phạm các ràng buộc này, nó sẽ bị rollback.

#### Ví dụ: Chuyển tiền

Hãy xem xét lại ví dụ trên với tình huống Thỏ muốn chuyển khoản 2,1 triệu đồng.

```
🐰 Rabbit Account : 2000000
🐱 Cat Account    : 1000000
```

Trong trường hợp này, Thỏ muốn chuyển khoản 2,1 triệu đồng.  
Sau đó, tài khoản của Thỏ trở thành -100.000 đồng.  
Nhưng bảng tài khoản có ràng buộc không cho phép số dư âm.

```sql
CREATE TABLE account (
    ...,
    balance INT,
    check (balance >= 0)
)
```

Vì vậy, câu lệnh UPDATE để chuyển khoản 2,1 triệu đồng sẽ không thành công vì phá vỡ tính nhất quán (`Inconsistent`)

Giao dịch sẽ bị rollback.

### 3) Tính cô lập (`Isolation`)

- Đảm bảo rằng các giao dịch đang chạy song song không ảnh hưởng lẫn nhau.
- Mỗi giao dịch phải hoạt động như thể nếu nó đang chạy độc lập và tuân thủ các quy tắc cô lập. Hệ thống cơ sở dữ liệu phải hỗ trợ nhiều người dùng truy cập cùng một dữ liệu.
- Cung cấp nhiều cấp độ cô lập (`isolation level`) khác nhau.

#### Ví dụ: Chuyển tiền

Tình huống: Thỏ chuyển tiền cho Mèo, cùng lúc đó Mèo nạp tiền vào tài khoản từ ATM

Các vấn đề có thể phát sinh nếu các giao dịch đang chạy đồng thời. Vì vậy, **isolation** là một tính năng quan trọng của các giao dịch.

```
🐰 Rabbit Account : 2000000
🐱 Cat Account    : 1000000
```

```
1) Thỏ bắt đầu giao dịch chuyển 100000 cho Mèo
---🐰 Rabbit TX--- 
read(balance) => 2000000
write(balance = 1900000)
---

---🐱 Cat TX---
read(balance) => 1000000

2) Lúc này Mèo bắt đầu giao dịch nạp 400000 vào tài khoản
read(balance) => 1000000
write(balance = 1400000)

write(balance = 1100000)
---
```

Có 2 hoạt động update số sư tài khoản xung đột nhau.

### 4) Tính bền vững (`Durability`)

- Các giao dịch đã được thực hiện thành công phải được lưu trữ kết quả công việc vào cơ sở dữ liệu một cách vĩnh viễn.
- Hệ thống cũng có khả năng khôi phục lại trạng thái ban đầu sau khi xảy ra sự cố. (kiểm tra, ghi nhật ký, quay lại)

Như được mô tả trong hình dưới đây, sau khi commit, không thể rollback được.  

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230627193226.jpeg)

## ❓ Tại sao cần học về giao dịch?

💡 Developer có quyền định nghĩa và sử dụng các giao dịch.

Để có thể định nghĩa giao dịch một cách phù hợp và sử dụng nó một cách hiệu quả, chúng ta cần hiểu về chức năng và các thuộc tính ACID của giao dịch.
