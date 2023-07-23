---
title: MySQL Locks
tags: [db, mysql, sql]
categories: [db, mysql, sql]
date created: 2023-07-22
date modified: 2023-07-23
---

# Khóa trong MySQL

## Khóa lạc quan và khóa bi quan

Đảm bảo không làm hỏng tính cô lập, tính thống nhất và tính thống nhất của cơ sở dữ liệu khi nhiều giao dịch truy cập cùng một dữ liệu trong cùng một thời điểm, **khóa lạc quan và khóa bi quan là các phương pháp kỹ thuật được sử dụng chính cho kiểm soát đồng thời**.

- **`Khóa bi quan`** - Giả định xảy ra xung đột đồng thời và chặn mọi hoạt động có thể vi phạm tính toàn vẹn dữ liệu.
  - Khóa giao dịch ngay sau khi truy vấn dữ liệu, và chỉ mở khóa khi giao dịch được cam kết (`COMMIT`).
  - Cách thực hiện: **Sử dụng cơ chế khóa trong cơ sở dữ liệu**.
- **`Khóa lạc quan`** - Giả định không xảy ra xung đột đồng thời và chỉ kiểm tra vi phạm tính toàn vẹn dữ liệu khi thực hiện thao tác gửi đi.
  - Khóa giao dịch khi thay đổi dữ liệu và sử dụng phiên bản để khóa.
  - Cách thực hiện: **Sử dụng phiên bản hoặc dấu thời gian**.

【Ví dụ】Ví dụ về khóa lạc quan

Bảng hàng hóa (goods) có một trường status, trong đó status = 1 cho biết hàng hóa chưa được đặt hàng, status = 2 cho biết hàng hóa đã được đặt hàng, vì vậy khi đặt hàng cho một mặt hàng cần đảm bảo status của mặt hàng đó là 1. Giả sử id của mặt hàng là 1.

```sql
select (status,status,version) from t_goods where id=#{id}

update t_goods
set status=2,version=version+1
where id=#{id} and version=#{version};
```

## Khóa bảng và khóa hàng

Dựa trên phạm vi khóa của cơ sở dữ liệu, MySQL cung cấp hai loại khóa: khóa hàng và khóa bảng.

- **Khóa bảng (table lock)** - Khóa toàn bộ bảng. Trước khi người dùng thực hiện thao tác ghi trên bảng, cần có khóa ghi, điều này sẽ chặn tất cả các hoạt động đọc và ghi của người dùng khác trên bảng đó. Chỉ khi không có khóa ghi, người dùng khác mới có thể nhận được khóa đọc và các khóa đọc không chặn lẫn nhau.
- **Khóa hàng (row lock)** - Khóa các bản ghi hàng định. Điều này cho phép các tiến trình khác vẫn có thể thực hiện các hoạt động trên các bản ghi khác trong cùng một bảng.

Nên chỉ khóa các dữ liệu cần thay đổi, không phải tất cả tài nguyên. **Càng khóa ít dữ liệu, tần suất cạnh tranh khóa càng ít, độ đồng thời của hệ thống càng cao**. Tuy nhiên, việc khóa cần tiêu tốn tài nguyên và các hoạt động liên quan đến khóa (bao gồm lấy khóa, giải phóng khóa và kiểm tra trạng thái khóa) đều làm tăng chi phí của hệ thống. Do đó, **độ đồng thời của khóa càng nhỏ, chi phí của hệ thống càng lớn**.

Khi chọn mức độ chi tiết của khóa, cần phải cân bằng giữa chi phí khóa và độ đồng thời của hệ thống.

Trong `InnoDB`, **khóa hàng được thực hiện bằng cách khóa các mục nhập chỉ mục (index entry) trên chỉ mục (index)**. **Nếu không có chỉ mục, `InnoDB` sẽ khóa bản ghi thông qua chỉ mục cụm ẩn**.

## Khóa đọc và khóa ghi

- Khóa độc quyền (Exclusive), viết tắt là khóa X, còn được gọi là khóa ghi. Cách sử dụng: `SELECT … FOR UPDATE;`
- Khóa chia sẻ (Shared), viết tắt là khóa S, còn được gọi là khóa đọc. Cách sử dụng: `SELECT … LOCK IN SHARE MODE;`

Mối quan hệ giữa khóa ghi và khóa đọc, nói một cách đơn giản: **Khi có khóa độc quyền tồn tại, các giao dịch khác không thể thực hiện bất kỳ hoạt động nào**.

**Khóa hàng, khóa khoảng (gap lock) và khóa next-key trong `InnoDB` đều thuộc loại khóa độc quyền**.

## Khóa ý định

**Khi có khóa bảng và khóa hàng cùng tồn tại, trước tiên phải yêu cầu khóa ý định (khóa bảng, nhưng không phải khóa thực sự), sau đó mới nhận được khóa hàng**. Sử dụng khóa ý định (Intention Lock) có thể dễ dàng hỗ trợ nhiều mức khóa.

**Khóa ý định được `InnoDB` tự động thêm vào, không cần can thiệp của người dùng**.

Khi có khóa hàng và khóa bảng, giao dịch T muốn khóa bảng A bằng khóa X, chỉ cần kiểm tra xem có giao dịch khác đã khóa bảng A hoặc một hàng nào đó trong bảng A bằng khóa X/IX/S/IS chưa. Nếu đã khóa, có nghĩa là có giao dịch khác đang sử dụng bảng này hoặc khóa của một hàng trong bảng này, do đó giao dịch T không thể khóa thành công.

Các quy tắc khóa ý định:

- IX/IS là khóa bảng;
- X/S là khóa hàng.
- Trước khi một giao dịch nhận khóa S cho một hàng dữ liệu nào đó, trước tiên phải nhận khóa IS hoặc khóa mạnh hơn trên bảng;
- Trước khi một giao dịch nhận khóa X cho một hàng dữ liệu nào đó, trước tiên phải nhận khóa IX hoặc khóa mạnh hơn trên bảng.

Bằng cách giới thiệu khóa ý định, giao dịch T muốn khóa bảng A bằng khóa X chỉ cần kiểm tra xem có giao dịch khác đã khóa A bằng khóa X/IX/S/IS chưa, nếu đã khóa thì có nghĩa là có giao dịch khác đang sử dụng bảng này hoặc một hàng trong bảng này, do đó giao dịch T không thể khóa thành công.

Các quan hệ khóa khác nhau như sau:

|  -  |  X  | IX  |  S  | IS  |
| :-: | :-: | :-: | :-: | :-: |
|  X  | ❌  | ❌  | ❌  | ❌  |
| IX  | ❌  | ✔️  | ❌  | ✔️  |
|  S  | ❌  | ❌  | ✔️  | ✔️  |
| IS  | ❌  | ✔️  | ✔️  | ✔️  |

Giải thích:

- Bất kỳ khóa IS/IX nào cũng tương thích với nhau, vì chúng chỉ đại diện cho việc muốn khóa bảng, không phải khóa thực sự;
- Quan hệ tương thích áp dụng cho khóa cấp bảng, trong khi khóa IX cấp bảng và khóa X cấp hàng tương thích với nhau. Hai giao dịch có thể đặt khóa X trên hai hàng dữ liệu (Giao dịch T1 muốn đặt khóa X trên hàng R1, Giao dịch T2 muốn đặt khóa X trên hàng R2 của cùng một bảng. Cả hai giao dịch đều cần phải đặt khóa IX trên bảng này, nhưng các loại khóa này là tương thích và tương thích với khoá X cấp hàng nghĩa là cả hai giao dịch có thể khoá thành công và chỉnh sửa hai hàng dữ liệu trong cùng một bảng).

## MVCC

**Điều khiển đồng thời đa phiên bản (Multi-Version Concurrency Control, MVCC)** có thể coi là một biến thể của khóa cấp hàng. Trong nhiều trường hợp, nó tránh được các hoạt động khóa, do đó có chi phí thấp hơn. Không chỉ có Mysql, các cơ sở dữ liệu khác như Oracle, PostgreSQL cũng đã triển khai MVCC của riêng họ, không có tiêu chuẩn thống nhất cho cơ chế triển khai.

MVCC là một cách cụ thể để triển khai cấp độ cô lập trong động cơ lưu trữ InnoDB, **được sử dụng để triển khai cấp độ đọc đã cam kết và đọc lặp lại**. Cấp độ đọc chưa cam kết luôn đọc dòng dữ liệu mới nhất, yêu cầu thấp, không cần sử dụng MVCC. Cấp độ tuần tự hóa yêu cầu khóa tất cả các dòng dữ liệu đọc, không thể triển khai chỉ bằng MVCC.

### Ý tưởng của MVCC

Việc khóa có thể giải quyết vấn đề nhất quán đồng thời xảy ra khi nhiều giao dịch được thực hiện cùng một lúc. Trong các tình huống thực tế, thao tác đọc thường nhiều hơn thao tác ghi, do đó, khóa đọc và ghi được giới thiệu để tránh các hoạt động khóa không cần thiết, chẳng hạn như không có mối quan hệ cạnh tranh giữa đọc và đọc. Thao tác đọc và ghi trong khóa đọc và ghi vẫn tương đối cạnh tranh.

Ý tưởng của MVCC là:

- **Lưu trữ bản chụp (snapshot) của dữ liệu tại một thời điểm nào đó, các thao tác ghi (DELETE, INSERT, UPDATE) cập nhật bản chụp phiên bản mới nhất; trong khi các thao tác đọc truy cập bản chụp phiên bản cũ, không có mối quan hệ cạnh tranh**. Điều này tương tự như `CopyOnWrite`.
- Đọc bẩn và đọc lại không nhất quán là do **giao dịch đọc các thay đổi chưa được giao dịch khác cam kết**. Khi giao dịch thực hiện thao tác đọc, để giải quyết vấn đề đọc bẩn và đọc không nhất quán, **MVCC quy định chỉ có thể đọc bản chụp đã cam kết**. Tất nhiên, một giao dịch có thể đọc bản chụp chưa được cam kết của chính nó, điều này không được coi là đọc bẩn.

### Số phiên bản

Triển khai MVCC của InnoDB là: lưu trữ hai cột ẩn sau mỗi dòng ghi, một cột lưu trữ thời gian tạo dòng, cột còn lại lưu trữ thời gian hết hạn của dòng (thời gian ở đây có nghĩa là số phiên bản hệ thống). Mỗi khi bắt đầu một giao dịch mới, số phiên bản hệ thống sẽ tự động tăng lên, số phiên bản hệ thống tại thời điểm bắt đầu giao dịch sẽ được sử dụng làm số phiên bản của giao dịch, để so sánh với số phiên bản của mỗi dòng ghi được truy vấn.

- Số phiên bản hệ thống `SYS_ID`: là một số tăng dần, mỗi khi bắt đầu một giao dịch mới, số phiên bản hệ thống sẽ tự động tăng lên.
- Số phiên bản giao dịch `TRX_ID`: số phiên bản hệ thống tại thời điểm bắt đầu giao dịch.

### Undo log

MVCC của nhiều phiên bản đề cập đến việc lưu trữ nhiều bản chụp, bản chụp được lưu trữ trong Undo log, log này kết nối tất cả các bản chụp của một dòng dữ liệu thông qua con trỏ rollback `ROLL_PTR`.

Ví dụ, trong MySQL, tạo một bảng t, bao gồm khóa chính id và một trường x. Chúng ta chèn một dòng dữ liệu trước, sau đó thực hiện hai lần cập nhật trên dòng đó.

```sql
INSERT INTO t(id, x) VALUES(1, "a");
UPDATE t SET x="b" WHERE id=1;
UPDATE t SET x="c" WHERE id=1;
```

Vì không sử dụng `START TRANSACTION` để thực hiện các hoạt động trên như một giao dịch, theo cơ chế `AUTOCOMMIT` của MySQL, mỗi hoạt động sẽ được coi là một giao dịch, vì vậy tổng cộng có ba giao dịch.  
Trong bản chụp, ngoài việc ghi lại số phiên bản của giao dịch `TRX_ID` và các hoạt động, còn có một trường DEL kiểu bit để đánh dấu xem liệu nó đã bị xóa hay chưa.

`INSERT`, `UPDATE`, và `DELETE` sẽ tạo ra một bản ghi nhật ký và ghi số phiên bản giao dịch `TRX_ID`. `DELETE` có thể coi là một loại đặc biệt của `UPDATE`, ngoài ra còn thiết lập trường DEL thành 1.

### ReadView

MVCC duy trì một `consistent read view`, chứa danh sách các giao dịch chưa được cam kết trong hệ thống `TRX_IDs {TRX_ID_1, TRX_ID_2, …}`, cùng với giá trị nhỏ nhất và lớn nhất của danh sách đó `TRX_ID_MIN` và `TRX_ID_MAX`.

![mysql-mvcc-readview.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/mysql-mvcc-readview.png)

Như vậy, đối với thời điểm bắt đầu của giao dịch hiện tại, một phiên bản dữ liệu hàng `trx_id` có thể có các trường hợp sau:

1. Nếu nằm trong phần màu xanh lá cây, đó chỉ là phiên bản của một giao dịch đã được cam kết hoặc được tạo bởi chính giao dịch hiện tại, dữ liệu này có thể nhìn thấy.
2. Nếu nằm trong phần màu đỏ, đó chỉ là phiên bản được tạo bởi một giao dịch sẽ được khởi động trong tương lai, nó chắc chắn không thể nhìn thấy.
3. Nếu nằm trong phần màu cam, có hai trường hợp:
	- Nếu hàng `trx_id` có trong mảng, đó chỉ là phiên bản được tạo bởi một giao dịch chưa được cam kết, không thể nhìn thấy.  
	- Nếu hàng `trx_id` không có trong mảng, đó chỉ là phiên bản được tạo bởi một giao dịch đã được cam kết, có thể nhìn thấy.

Khi thực hiện thao tác `SELECT`, ta có thể xác định được khả năng sử dụng bản chụp hàng dữ liệu dựa trên mối quan hệ giữa `TRX_ID` của bản chụp và `TRX_ID_MIN` cũng như `TRX_ID_MAX`.

- `TRX_ID` < `TRX_ID_MIN`, đó là phiên bản dòng dữ liệu đã được thay đổi trước tất cả các giao dịch chưa được cam kết hiện tại, do đó có thể sử dụng.
- `TRX_ID` > `TRX_ID_MAX`, đó là phiên bản dòng dữ liệu đã được thay đổi sau khi giao dịch bắt đầu, do đó không thể sử dụng.
- `TRX_ID_MIN` <= `TRX_ID` <= `TRX_ID_MAX`, cần xác định dựa trên cấp độ cô lập:
	- Đọc đã cam kết: Nếu `TRX_ID` có trong danh sách `TRX_IDs`, đó là phiên bản dòng dữ liệu tương ứng với giao dịch chưa được cam kết, do đó phiên bản này không thể sử dụng. Nếu không, đó là phiên bản đã được cam kết, có thể sử dụng.
	- Đọc lặp lại: không thể sử dụng cả hai. Vì nếu có thể sử dụng, thì các giao dịch khác cũng có thể đọc phiên bản dòng dữ liệu này và thực hiện thay đổi, khiến giá trị đọc của giao dịch hiện tại thay đổi, tức là xảy ra vấn đề đọc lặp lại không nhất quán.

Trong trường hợp không thể sử dụng bản chụp hàng dữ liệu, cần tìm đến chỉ số cuộn `ROLL_PTR` trong Undo Log để tìm bản chụp tiếp theo và tiến hành kiểm tra như đã nêu ở trên.

### Đọc bản chụp và đọc hiện tại

**Đọc bản chụp**

Thao tác `SELECT` của MVCC là dữ liệu trong bản chụp, không cần thực hiện hoạt động khóa.

```sql
SELECT * FROM table ...;
```

**Đọc hiện tại**

Các hoạt động khác của MVCC sẽ thay đổi cơ sở dữ liệu (`INSERT`, `UPDATE`, `DELETE`) cần thực hiện hoạt động khóa để đọc dữ liệu mới nhất. Có thể thấy MVCC không hoàn toàn không sử dụng khóa, mà chỉ tránh việc áp dụng khóa cho `SELECT`.

```sql
INSERT;
UPDATE;
DELETE;
```

Khi thực hiện thao tác `SELECT`, có thể bắt buộc chỉ định thực hiện khóa. Câu lệnh đầu tiên yêu cầu khóa S, câu lệnh thứ hai yêu cầu khóa X.

```sql
SELECT * FROM table WHERE ? lock in share mode;
SELECT * FROM table WHERE ? for update;
```

## Khóa hàng

Có ba thuật toán cụ thể để triển khai khóa hàng (row lock): khóa bản ghi (record lock), Khoá khoảng (gap lock) và khóa next-key.

- `Khóa bản ghi (Record Lock)` - **Khóa hàng bằng cách khóa các mục chỉ mục (index entry), nếu không có chỉ mục thì sử dụng khóa bảng**.
- `Khoá khoảng (Gap Lock)` - **Khoá khoảng giữa các mục chỉ mục (index entry)**. Khoá khoảng giữa các mục chỉ mục, nhưng không bao gồm chính mục chỉ mục đó. Ví dụ, khi một giao dịch thực hiện câu lệnh sau, các giao dịch khác không thể chèn giá trị 15 vào cột c trong bảng t: `SELECT c FROM t WHERE c BETWEEN 10 and 20 FOR UPDATE;`. Trong MySQL, Khoá khoảng mặc định là được bật, tức là giá trị của tham số `innodb_locks_unsafe_for_binlog` là `disable`, và mặc định trong MySQL là cấp độ cô lập giao dịch RR.
- `Khóa next-key` - Đây là sự kết hợp của `Khóa bản ghi (record lock)` và `Khoá khoảng (gap lock)`. Nó không chỉ khóa một mục chỉ mục trên một bản ghi, mà còn khoá khoảng giữa các chỉ mục. Nó khóa một khoảng mở phía trước và đóng phía sau.

Chỉ có cáchoạt động cụ thể trong cấp độ cô lập đọc có thể lặp lại hoặc cao hơn mới sẽ nhận được khóa khoảng (gap lock) hoặc khóa next-key. Trong các câu lệnh `SELECT`, `UPDATE` và `DELETE`, ngoại trừ các truy vấn dựa trên chỉ mục duy nhất, các truy vấn dựa trên chỉ mục khác đều lấy khoá khoảng hoặc khóa next-key, tức là khóa phạm vi quét của chúng. Chỉ mục khóa chính cũng được coi là chỉ mục duy nhất, vì vậy chỉ mục khóa chính không sử dụng khóa khoảng (gap lock) hoặc khóa next-key.

MVCC không thể giải quyết vấn đề đọc lại không nhất quán, **khóa next-key được tạo ra để giải quyết vấn đề đọc lại không nhất quán**. Trong cấp độ cô lập đọc có thể lặp lại (`REPEATABLE READ`), sử dụng **MVCC + Khóa next-key** có thể giải quyết vấn đề đọc lại không nhất quán.

Chỉ mục được chia thành chỉ mục khóa chính (primary index) và chỉ mục khoá phụ (không phải khóa chính - non-primary index). Nếu một câu lệnh SQL thao tác trên chỉ mục khóa chính, MySQL sẽ khóa chỉ mục khóa chính đó; nếu một câu lệnh thao tác trên chỉ mục khoá phụ, MySQL sẽ khóa chỉ mục khoá phụ đó trước, sau đó khóa chỉ mục khóa chính liên quan. Trong các câu lệnh `UPDATE` và `DELETE`, MySQL không chỉ khóa tất cả các bản ghi chỉ mục được quét bởi điều kiện `WHERE`, mà còn khóa các giá trị liền kề, còn được gọi là `khóa next-key`.

Khi hai giao dịch được thực hiện đồng thời, một giao dịch khóa chỉ mục khoá chính và đang chờ đợi các chỉ mục liên quan. Giao dịch khác khóa chỉ mục khoá phụ và đang chờ đợi chỉ mục khoá chính liên quan. Điều này dẫn đến tình trạng bế tắc. Sau khi xảy ra tình trạng bế tắc, `InnoDB` thường có thể phát hiện và làm cho một giao dịch giải phóng khóa và rollback, và giao dịch khác tiếp tục lấy khóa để hoàn thành giao dịch.
