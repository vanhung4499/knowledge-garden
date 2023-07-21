---
title: SQL DB Theory
tags: [db, sql]
categories: [db, sql]
date created: 2023-07-20
date modified: 2023-07-21
---

# Những điểm cốt lõi về hệ thống cơ sở dữ liệu

## Giao dịch (Transaction)

###  Khái niệm

Giao dịch là một tập hợp các hoạt động thỏa mãn các đặc tính ACID, có thể được thực hiện bằng cách Commit để xác nhận một giao dịch hoặc sử dụng Rollback để hoàn tác.

![185b9c49-4c13-4241-a848-fbff85c03a64.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/185b9c49-4c13-4241-a848-fbff85c03a64.png)

### ACID

####  1. Tính nguyên tử (Atomicity)

Giao dịch được coi là một đơn vị không thể chia tách, tất cả các hoạt động trong giao dịch phải được hoặc hoàn tất thành công hoặc hoàn tác hoàn toàn.

Hoàn tác có thể được thực hiện bằng cách sử dụng nhật ký, ghi lại các hoạt động sửa đổi được thực hiện trong giao dịch và thực hiện ngược lại các hoạt động này khi hoàn tác.

####  2. Tính nhất quán (Consistency)

Cơ sở dữ liệu duy trì trạng thái nhất quán trước và sau khi giao dịch được thực hiện. Trong trạng thái nhất quán, kết quả đọc dữ liệu từ mọi giao dịch đối với một dữ liệu cụ thể là như nhau.

####  3. Tính cô lập (Isolation)

Các sửa đổi được thực hiện bởi một giao dịch không được nhìn thấy bởi các giao dịch khác cho đến khi giao dịch đó được xác nhận.

####  4. Tính bền vững (Durability)

Một khi giao dịch được xác nhận, các sửa đổi được thực hiện trong giao dịch sẽ được lưu trữ vĩnh viễn trong cơ sở dữ liệu. Ngay cả khi hệ thống gặp sự cố, kết quả của giao dịch vẫn không bị mất.

Có thể thực hiện sao lưu và khôi phục cơ sở dữ liệu để đạt được tính bền vững. Khi hệ thống gặp sự cố, có thể sử dụng cơ sở dữ liệu đã sao lưu để khôi phục dữ liệu.

---

Các đặc tính ACID của giao dịch có khái niệm đơn giản, nhưng không dễ hiểu, chủ yếu là do các đặc tính này không có mối quan hệ ngang hàng:

- Chỉ khi đạt được tính nhất quán, kết quả của giao dịch mới là chính xác.
- Trong trường hợp không có sự cạnh tranh, khi giao dịch được thực hiện tuần tự, tính cô lập sẽ được đảm bảo. Khi đó, chỉ cần đạt được tính nguyên tử, tính nhất quán sẽ được đảm bảo.
- Trong trường hợp có sự cạnh tranh, khi nhiều giao dịch được thực hiện song song, giao dịch không chỉ cần đạt được tính nguyên tử mà còn cần đạt được tính cô lập để đảm bảo tính nhất quán.
- Tính bền vững của giao dịch là để đối phó với trường hợp hệ thống gặp sự cố.

![acid.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/acid.png)

### AUTOCOMMIT

MySQL mặc định sử dụng chế độ autocommit. Điều này có nghĩa là nếu không sử dụng rõ ràng câu lệnh `START TRANSACTION` để bắt đầu một giao dịch, thì mỗi truy vấn sẽ được coi là autocommit.

## Vấn đề nhất quán trong môi trường đồng thời

---

Trong môi trường đồng thời, rất khó để đảm bảo tính cô lập của giao dịch, do đó sẽ xuất hiện nhiều vấn đề về đồng nhất trong môi trường đồng thời.

### Mất sửa đổi

Hai giao dịch T1 và T2 đều sửa đổi cùng một dữ liệu, T1 sửa đổi trước, T2 sửa đổi sau và ghi đè lên sửa đổi của T1.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230721002023.png)

### Đọc dữ liệu bẩn (Dirty Read)

T1 sửa đổi một dữ liệu, T2 đọc dữ liệu đó ngay sau đó. Nếu T1 hoàn tác sửa đổi này, thì dữ liệu mà T2 đọc là dữ liệu không đúng.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/202307210021321.png)

### Đọc không nhất quán (Non-Repeatable Read)

T2 đọc một dữ liệu, T1 sửa đổi dữ liệu đó. Nếu T2 đọc lại dữ liệu này, kết quả đọc sẽ khác so với lần đọc ban đầu.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230721002326.png)

### Đọc dữ liệu ảo (Phantom Read)

T1 đọc một phạm vi dữ liệu nhất định, T2 chèn dữ liệu mới trong phạm vi đó, T1 đọc lại phạm vi dữ liệu đó, kết quả đọc sẽ khác so với lần đọc ban đầu.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230721002333.png)

---

Nguyên nhân chính gây ra vấn đề nhất quán trong môi trường đồng thời là vi phạm tính cô lập (isolation) của giao dịch. Phương pháp giải quyết là sử dụng kiểm soát đồng thời để đảm bảo tính cô lập. Kiểm soát đồng thời có thể được thực hiện bằng cách sử dụng khóa, nhưng việc khóa phải được người dùng tự điều khiển và rất phức tạp. Hệ quản trị cơ sở dữ liệu cung cấp các cấp độ cô lập (isolation level) của giao dịch, cho phép người dùng xử lý vấn đề đồng nhất trong môi trường đồng thời một cách dễ dàng hơn.

## Khoá (Lock)

### Mức độ khóa

Trong MySQL, có hai mức độ khóa: khóa hàng (row-level locking) và khóa bảng (table-level locking).

Nên chỉ khóa phần dữ liệu cần sửa đổi, thay vì khóa tất cả tài nguyên. Việc khóa ít dữ liệu sẽ giảm khả năng xung đột khóa và tăng cường mức độ đồng thời của hệ thống.

Tuy nhiên, việc khóa tài nguyên sẽ tiêu tốn tài nguyên và các hoạt động khóa (bao gồm lấy khóa, giải phóng khóa và kiểm tra trạng thái khóa) sẽ tăng chi phí cho hệ thống. Do đó, mức độ khóa càng nhỏ, chi phí hệ thống càng lớn.

Khi chọn mức độ khóa, cần cân nhắc giữa chi phí khóa và mức độ đồng thời của hệ thống.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230721003046.png)

### Loại khóa

#### 1. Khóa đọc và ghi

- Khóa độc quyền (Exclusive Lock), viết tắt là khóa X, còn được gọi là khóa ghi.
- Khóa chia sẻ (Shared Lock), viết tắt là khóa S, còn được gọi là khóa đọc.

Có hai quy tắc sau đây:

- Một giao dịch khóa đối tượng dữ liệu A bằng khóa X, có thể đọc và cập nhật A. Trong quá trình khóa, các giao dịch khác không thể khóa A bằng bất kỳ loại khóa nào khác.
- Một giao dịch khóa đối tượng dữ liệu A bằng khóa S, có thể đọc A nhưng không thể cập nhật A. Trong quá trình khóa, các giao dịch khác có thể khóa A bằng khóa S, nhưng không thể khóa A bằng khóa X.

Mối quan hệ tương thích của khóa như sau:

|-|X|S|
|---|---|---|
|X|❌|❌|
|S|❌|✅|

#### 2. Khóa ý định

Sử dụng khóa ý định (Intention Locks) giúp hỗ trợ việc khóa nhiều mức độ dễ dàng hơn.

Trong trường hợp có khóa cấp hàng và khóa cấp bảng, khi giao dịch T muốn khóa bảng A bằng khóa X, nó cần kiểm tra xem có giao dịch khác đã khóa bảng A hoặc bất kỳ hàng nào trong bảng A chưa, điều này đòi hỏi kiểm tra từng hàng trong bảng A và tốn nhiều thời gian.

Khóa ý định giới thiệu các khóa IX/IS trên khóa X/S ban đầu, cả hai đều là khóa bảng, được sử dụng để chỉ ra rằng một giao dịch muốn khóa hàng A trong bảng bằng khóa X hoặc S. Có hai quy tắc sau đây:

- Trước khi một giao dịch nhận được khóa S cho một hàng dữ liệu cụ thể, nó phải trước tiên nhận được khóa IS của bảng hoặc một khóa mạnh hơn.
- Trước khi một giao dịch nhận được khóa X cho một hàng dữ liệu cụ thể, nó phải trước tiên nhận được khóa IX của bảng.

Bằng cách giới thiệu khóa ý định, khi giao dịch T muốn khóa bảng A bằng khóa X, chỉ cần kiểm tra xem có giao dịch khác đã khóa bảng A bằng khóa X/IX/S/IS hay chưa. Nếu đã khóa, điều đó có nghĩa là có giao dịch khác đang sử dụng bảng này hoặc khóa của một hàng cụ thể trong bảng, do đó giao dịch T không thể khóa bảng A bằng khóa X.

Mối quan hệ tương thích của các khóa như sau:

|-|X|IX|S|IS|
|---|---|---|---|---|
|X|❌|❌|❌|❌|
|IX|❌|✅|❌|✅|
|S|❌|❌|✅|✅|
|IS|❌|✅|✅|✅|  

Giải thích như sau:

* Bất kỳ khóa IS/IX nào cũng tương thích với nhau, vì chúng chỉ đại diện cho việc muốn khóa bảng mà không phải là thực sự khóa;
* Khóa S chỉ tương thích với khóa S và IS, có nghĩa là giao dịch T muốn khóa hàng dữ liệu bằng khóa S, các giao dịch khác có thể đã có được khóa S trên bảng hoặc hàng trong bảng.

### Giao thức khóa

#### 1. Giao thức khóa ba cấp

**Giao thức khóa cấp một**

Khi giao dịch T muốn sửa đổi dữ liệu A, nó phải khóa A bằng khóa X và giữ khóa cho đến khi giao dịch T kết thúc.

Giao thức này giải quyết vấn đề mất sửa đổi, vì không thể có hai giao dịch cùng thay đổi cùng một dữ liệu, do đó sửa đổi của giao dịch sẽ không bị ghi đè.

|T1|T2|
|:---:|:---:|
|lock-x(A)||
|read A=20||
||lock-x(A)|
||wait|
|write A=19|.|
|commit|.|
|unlock-x(A)|.|
||obtain|
||read A=19|
||write A=21|
||commit|
||unlock-x(A)|

**Giao thức khóa cấp hai**

**Giao thức khóa cấp hai** được xây dựng trên cơ sở của giao thức khóa cấp một. Ngoài việc yêu cầu khóa X khi sửa đổi dữ liệu A, giao thức này còn yêu cầu khóa S khi đọc dữ liệu A và ngay lập tức giải phóng khóa S sau khi đọc xong.

Giao thức này giải quyết vấn đề đọc dữ liệu không đúng, vì nếu một giao dịch đang thực hiện sửa đổi trên dữ liệu A và đã khóa A bằng khóa X theo giao thức khóa cấp một, thì không thể khóa A bằng khóa S nữa, có nghĩa là không thể đọc dữ liệu vào.

|T1|T2|
|:---:|:---:|
|lock-x(A)||
|read A=20||
|write A=19||
||lock-s(A)|
||wait|
|rollback|.|
|A=20|.|
|unlock-x(A)|.|
||obtain|
||read A=20|
||commit|
||unlock-s(A)|

**Giao thức khóa cấp ba**

**Giao thức khóa cấp ba** được xây dựng trên cơ sở của giao thức khóa cấp hai. Ngoài việc yêu cầu khóa X khi sửa đổi dữ liệu A và khóa S khi đọc dữ liệu A, giao thức này còn yêu cầu giữ khóa S cho đến khi kết thúc giao dịch.

Giao thức này giải quyết vấn đề đọc không nhất quán, vì khi một giao dịch đang đọc dữ liệu A và đã khóa A bằng khóa S theo giao thức khóa cấp hai, không có giao dịch nào khác có thể khóa A bằng khóa X trong thời gian đọc. Điều này đảm bảo rằng dữ liệu không thay đổi trong quá trình đọc, tránh việc đọc dữ liệu không nhất quán.

|T1|T2|
|:---:|:---:|
|lock-s(A)||
|read A=20||
||lock-x(A)|
||wait|
|read A=20|.|
|commit|.|
|unlock-s(A)|.|
||obtain|
||read A=20|
||write A=19|
||commit|
||unlock-X(A)|

#### 2. Giao thức khóa hai đoạn

Quá trình khóa và giải phóng khóa được chia thành hai giai đoạn riêng biệt.

Lịch trình có thể tuân thủ tính tuần tự hóa, đảm bảo kết quả của các giao dịch được thực hiện đồng thời giống với kết quả của một lịch trình thực hiện tuần tự.

Tuân thủ giao thức khóa hai đoạn là điều kiện đủ để đảm bảo tính tuần tự hóa. Ví dụ, các hoạt động sau tuân thủ giao thức khóa hai đoạn và tạo ra một lịch trình tuần tự hóa:

```
lock-x(A)...lock-s(B)...lock-s(C)...unlock(A)...unlock(C)...unlock(B)
```

Tuy nhiên, nó không phải là điều kiện cần, ví dụ, các hoạt động sau không tuân thủ giao thức khóa hai đoạn, nhưng vẫn tạo ra một lịch trình tuần tự hóa:

```
lock-x(A)...unlock(A)...lock-s(B)...unlock(B)...lock-s(C)...unlock(C)
```

### Khóa ẩn và khóa hiển thị trong MySQL

Cơ chế lưu trữ InnoDB của MySQL tuân theo giao thức khóa hai đoạn và tự động thực hiện việc khóa khi cần thiết dựa trên cấp độ cô lập (isolation level), và tất cả các khóa đều được giải phóng cùng một thời điểm, điều này được gọi là khóa ẩn.

InnoDB cũng cho phép sử dụng các câu lệnh cụ thể để thực hiện khóa hiển thị:

```sql
SELECT ... LOCK In SHARE MODE;
SELECT ... FOR UPDATE;
```

## Mức độ cô lập (Isolation Level)

### Đọc chưa cam kết (READ UNCOMMITTED)

Các thay đổi trong một giao dịch, ngay cả khi chưa được xác nhận, cũng có thể nhìn thấy bởi các giao dịch khác.

### Đọc đã cam kết (READ COMMITTED)

Một giao dịch chỉ có thể đọc các thay đổi đã được xác nhận từ các giao dịch khác. Nói cách khác, các thay đổi được thực hiện trong một giao dịch không được nhìn thấy bởi các giao dịch khác cho đến khi được xác nhận.

### Đọc lặp lại (REPEATABLE READ)

Đảm bảo kết quả của việc đọc nhiều lần cùng một dữ liệu trong cùng một giao dịch là như nhau.

### Có thể tuần tự hóa (SERIALIZABLE)

Buộc các giao dịch thực hiện tuần tự.

---

|Isolation level|Dirty read|Non Repeatable Read|Phantom Read|
|---|---|---|---|
|Read uncommitted|✅|✅|✅|
|Read Commited|❌|✅|✅|
|Repeatable Read|❌|❌|✅|
|Serializable|❌|❌|❌|

## Kiểm soát đồng thời đa phiên bản

Kiểm soát đồng thời đa phiên bản (Multi-Version Concurrency Control - MVCC) là một cách cụ thể mà công cụ lưu trữ InnoDB của MySQL sử dụng để thực hiện các mức độ cô lập như đọc đã cam kết (read commited) và đọc lặp lại (repeatable read). Tuy nhiên, mức độ đọc chưa cam kết (read uncommited) luôn luôn đọc dữ liệu mới nhất mà không cần sử dụng MVCC. Mức độ tuân theo tuần tự hóa (serializable) yêu cầu khóa tất cả các hàng được đọc, và MVCC đơn thuần không thể thực hiện được mức độ tuân theo tuần tự hóa.

### Số phiên bản

- Số phiên bản hệ thống: Đây là một số tăng dần, mỗi khi bắt đầu một giao dịch mới, số phiên bản hệ thống sẽ tăng tự động.
- Số phiên bản giao dịch: Đây là số phiên bản hệ thống khi giao dịch bắt đầu.

### Cột ẩn

MVCC lưu trữ hai cột ẩn sau mỗi bản ghi, được sử dụng để lưu trữ hai số phiên bản:

- Số phiên bản tạo: Chỉ ra số phiên bản hệ thống khi tạo một bản ghi dữ liệu;
- Số phiên bản xóa: Nếu số phiên bản xóa của một bản ghi được tạo ra sau số phiên bản giao dịch hiện tại, nghĩa là bản ghi đó vẫn còn hiệu lực, ngược lại nghĩa là bản ghi đó đã bị xóa.

### Nhật ký Undo

MVCC sử dụng các bản ghi dữ liệu được lưu trữ trong nhật ký Undo, và thông qua con trỏ rollback, nó liên kết tất cả các bản ghi dữ liệu của một hàng.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230721010240.png)

### Quá trình thực hiện

Quá trình thực hiện dưới đây áp dụng cho mức độ đọc lặp lại (repeatable read).

Khi bắt đầu một giao dịch mới, số phiên bản của giao dịch sẽ lớn hơn số phiên bản của tất cả các bản ghi dữ liệu hiện có. Điều này là rất quan trọng cần phải hiểu.

#### 1. SELECT

Nhiều giao dịch phải đọc cùng một bản ghi dữ liệu của một hàng và phải đọc bản ghi gần nhất trong tất cả các bản ghi hiệu lực. Tuy nhiên, có một ngoại lệ, nếu một giao dịch đang thay đổi bản ghi dữ liệu đó, nó có thể đọc các thay đổi của chính nó mà không cần phải đồng nhất với kết quả đọc của các giao dịch khác.

Gọi giao dịch không thay đổi bất kỳ bản ghi dữ liệu nào là T, số phiên bản tạo của bản ghi dữ liệu mà T muốn đọc phải nhỏ hơn số phiên bản của T, vì nếu lớn hơn hoặc bằng số phiên bản của T, điều đó có nghĩa là bản ghi dữ liệu đó là thay đổi mới nhất của các giao dịch khác và không thể đọc nó. Ngoài ra, số phiên bản xóa của bản ghi dữ liệu mà T muốn đọc phải lớn hơn số phiên bản của T, vì nếu nhỏ hơn hoặc bằng số phiên bản của T, điều đó có nghĩa là bản ghi dữ liệu đã bị xóa và không nên đọc nó.

#### 2. INSERT

Sử dụng số phiên bản hệ thống hiện tại làm số phiên bản tạo của bản ghi dữ liệu.

#### 3. DELETE

Sử dụng số phiên bản hệ thống hiện tại làm số phiên bản xóa của bản ghi dữ liệu.

#### 4. UPDATE

Sử dụng số phiên bản hệ thống hiện tại làm số phiên bản xóa của bản ghi dữ liệu trước khi cập nhật và sử dụng số phiên bản hệ thống hiện tại làm số phiên bản tạo của bản ghi dữ liệu sau khi cập nhật. Có thể hiểu là thực hiện DELETE trước và INSERT sau.

### Đọc bản chụp và đọc hiện tại

#### 1. Đọc bản san

Sử dụng MVCC để đọc dữ liệu từ bản san, giúp giảm thiểu chi phí của việc khóa.

```sql
SELECT * FROM table ...;  
```

#### 2. Đọc hiện tại

Đọc dữ liệu mới nhất, yêu cầu khóa. Câu lệnh đầu tiên yêu cầu khóa S, các câu lệnh khác yêu cầu khóa X.

```sql
SELECT * FROM table WHERE ? LOCK IN SHARE MODE;
SELECT * FROM table WHERE ? FOR UPDATE;
INSERT;
UPDATE;
DELETE;
```

## Next-Key Locks

---------------------------------------

Khóa tiếp theo (Next-Key Locks) là một cách thức thực hiện khóa trong công cụ lưu trữ InnoDB của MySQL.

MVCC không thể giải quyết vấn đề đọc dữ liệu ảo (phantom read), và Next-Key Locks được tạo ra để giải quyết vấn đề này. Trong mức độ đọc lặp lại (REPEATABLE READ), việc sử dụng MVCC kết hợp với Next-Key Locks có thể giải quyết vấn đề đọc dữ liệu ảo.

### Khóa bản ghi (Record Locks)

Khóa một chỉ mục trên một bản ghi, chứ không phải bản ghi chính.

Nếu bảng không có chỉ mục, InnoDB sẽ tự động tạo một chỉ mục gom nhóm ẩn trên khóa chính, do đó, khóa bản ghi vẫn có thể được sử dụng.

### Khóa khoảng trống (Gap Locks)

Khóa khoảng trống giữa các chỉ mục, nhưng không bao gồm chỉ mục chính. Ví dụ, nếu một giao dịch thực hiện câu lệnh sau, các giao dịch khác không thể chèn 15 vào cột t.c.

```sql
SELECT c FROM t WHERE c BETWEEN 10 and 20 FOR UPDATE;
```

### Khóa tiếp theo (Next-Key Locks)

Nó là sự kết hợp của khóa bản ghi và khóa khoảng trống, khóa bản ghi và khoảng trống giữa các chỉ mục. Ví dụ, nếu một chỉ mục chứa các giá trị sau: 10, 11, 13 và 20, thì cần khóa các khoảng sau:

```sql
(negative infinity, 10]
(10, 11]
(11, 13]
(13, 20]
(20, positive infinity)
```
