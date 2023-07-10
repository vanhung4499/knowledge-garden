---
categories: [database, computer-science]
date created: 2023-06-27
date modified: 2023-07-10
tags: [database, computer-science]
title: Transaction Concurrency Control
---

## 🔎 Giao dịch (Transaction) Part 2

Trong phần 1, chúng ta đã tìm hiểu về khái niệm và tính chất của giao dịch. Trong ACID, `Isolation` đảm bảo rằng khi nhiều giao dịch được thực hiện đồng thời, không xảy ra hiện tượng không mong muốn. Điều này được đảm bảo bởi hai thuộc tính quan trọng là `Serializability` và `Recoverable`.

- Lưu ý rằng hệ quản trị cơ sở dữ liệu (DBMS) phải cung cấp hai thuộc tính này trong quá trình `concurrency control` (điều khiển đồng thời.

## Concurrency Control

### 1. Serializability

Trong tính chất `Isolation` của ACID đã mô tả:

> Các giao dịch song song phải được cô lập lẫn nhau và hoạt động như thể chúng được thực hiện tuần tự, đồng thời cơ sở dữ liệu phải cho phép nhiều người dùng truy cập cùng một dữ liệu.

Như thể chúng được thực hiện tuần tự???? 😲  
Vâng, đây chính là **Serializability** (tuần tự hoá).

Trước khi đi vào nội dung, chúng ta hãy làm rõ một số thuật ngữ để làm ví dụ.

```
R1(A) : Hoạt động Read A của giao dịch 1 
W1(A) : Hoạt động Write A của giao dịch 1 
operation : Hoạt động, vd như R1(A) 
schedule : Thứ tự thực hiện của các hoạt động trong từng transaction, khi nhiều transaction được thực hiện đồng thời.
```

### ✔️ Serial schedule

> Lịch trình (schedule) mà các transaction không chồng chéo và chỉ có thể thực hiện một lần duy nhất tại một thời điểm.  
> Nghĩa là, trong một nhà hàng 🍽️ chỉ có một chỗ ngồi, không có việc ghép bàn, mỗi khách hàng chỉ có thể ngồi và ăn khi khách hàng trước đã hoàn thành bữa ăn của mình.

#### Ưu điểm

Ưu điểm của lịch trình tuần tự là đảm bảo thứ tự và tính nhất quán vì chỉ có một giao dịch được thực hiện một lúc.

#### Nhược điểm: Hiệu suất

Tuy nhiên, hoạt động R1(A) và W1(A) là các hoạt động disk I/O. Trong quá trình thực hiện các hoạt động mất nhiều thời gian này, CPU sẽ không hoạt động, dẫn đến lãng phí tài nguyên.

Nghĩa là, không thể đạt được hiệu suất tốt.

Trong thực tế, không thể sử dụng lịch trình tuần tự.

### ✔️ non-serial schedule

> Lịch trình mà các giao dịch được chồng chéo (interleaving) và thực hiện cùng một lúc.  
> Nghĩa là, trong một nhà hàng 🍽️ có thêm chỗ ngồi, ngay cả khi một khách hàng đang ăn, khách hàng tiếp theo có thể ngồi ở một chỗ ngồi khác và bắt đầu ăn.

#### Ưu điểm: Hiệu suất

Lần này, vì được xử lý song song, nên có hiệu suất cao hơn.

Do đó, có thể xử lý nhiều giao dịch cùng một lúc trong cùng một thời điểm.

Trong quá trình thực hiện các hoạt động như R1(A) và W1(A) - các hoạt động I/O đĩa mất nhiều thời gian, giao dịch khác như giao dịch 2 có thể tiếp tục thực hiện.

#### Nhược điểm: Bất thường

Tùy thuộc vào cách các giao dịch được chồng chéo và thực hiện, có thể xảy ra kết quả bất thường.

🤯: Vậy làm sao đây!?!

🐰 Rabbit: Chúng ta chỉ cần thực hiện lịch trình phi tuần tự mà không gây ra hiện tượng bất thường và đạt được kết quả giống như lịch trình tuần tự!

😲💡: Đúng vậy! Chúng ta cần tìm cách thực hiện lịch trình phi tuần tự (non-serial schedule) mà cho ra kết quả tương tự như lịch trình tuần tự.

Hãy cùng tìm hiểu thêm về cách làm điều này. Một cách đơn giản để đạt được điều này là sử dụng **conflict serializable**.

### ✔️ Conflict serializable ⭐️

> Conflict serializable: Khi một lịch trình phi tuần tự (non-serial schedule) có cùng kết quả với một lịch trình tuần tự (serial schedule) và các lịch trình này có cùng các conflict, ta nói rằng lịch trình phi tuần tự đó là conflict serializable.

Một kết luận đã được rút ra. **conflict serializable**. Được rồi, hãy đọc mô tả Conflict và Conflict equivalent để biết chúng là gì.

### ✔️ Conflict

> Conflict (xung đột) xảy ra khi hai hoạt động thỏa mãn ba điều kiện sau:

```
1. Hai operation thuộc về các giao dịch khác nhau.
2. Hai operation truy cập cùng một dữ liệu.
3. Ít nhất một trong hai operation là hoạt động ghi (write).
```

### [ Ví dụ ]

Trong ví dụ dưới đây, R2(B) và W1(B), W2(B) và R1(B), và W2(B) và W1(B) là conflict.

![Pasted image 20230627214220](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230627214220.png)

💡 Điều này quan trọng vì khi nhiều giao dịch được xử lý đồng thời, nếu thay đổi thứ tự thực hiện của các hoạt động xung đột, kết quả thực thi cũng sẽ thay đổi.

Ví dụ, hãy xem xét W2(B) và R1(B).

- Số dư ban đầu của tài khoản B là 100 triệu đồng / trong giao dịch 2, gửi vào một khoản tiền là 30 triệu đồng.
- Trong thứ tự ban đầu) W2(B) -> R1(B): Ghi 130 triệu đồng vào B. **Đọc 130 triệu đồng từ B**.
- Khi thay đổi thứ tự) R1(B) -> W2(B): **Đọc số dư ban đầu 100 triệu đồng từ B**. Ghi 130 triệu đồng vào B.
- Nếu thay đổi thứ tự, giá trị mà giao dịch 1 đọc từ B sẽ thay đổi.

### ✔️ Conflict equivalent

> Hai lịch trình (schedule) được xem là tương đương xung đột (Conflict equivalent) nếu chúng đáp ứng cả hai điều kiện sau:

```
1. Các schedule liên quan đến cùng các transaction.
2. Thứ tự thực hiện của các conflict operation trong cả hai schedule là giống nhau.
```

#### Ví dụ

1. Sched 1 và Sched 2 có cùng các transaction và thứ tự thực hiện của các conflict operation là giống nhau. **(= conflict equivalent)**
2. Lịch trình Sched 2 có các giao dịch được thực hiện tuần tự. (=serial schedule)

![Pasted image 20230627215702](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230627215702.png)

💡 Nói cách khác,  khi một **non-serial schedule** là **conflict equivalent** với **serial schedule** và cũng là conflict serializable, thì nó được coi là conflict serializable.

Do đó, RDBMS cho phép các  **non-serial schedule** có thể **conflict serializable** để đảm bảo tính toàn vẹn dữ liệu mà không có xuất hiện bất thường.

Vậy, làm thế nào để chúng tôi thực hiện điều này?

Bạn có thể thực hiện việc này bằng cách áp dụng một giao thức đảm bảo rằng schedule có thể conflict serializable.

> Serializability được cho là hoạt động như thể nó được thực thi tuần tự.

💡 `concurrency control` : Làm cho mọi schedule hoạt động Serializable(Serializability).

💡 Có liên quan tới `Isolation`

### 2. Recoverability

> Khả năng phục hồi khi giao dịch thất bại

Rollback giao dịch là rất quan trọng trong việc đảm bảo tính `isolation`.

### ✔️ Unrecoverable schedule

> Lịch trình không thể khôi phục là lịch trình mà sau khi rollback, không thể khôi phục lại trạng thái trước đó (không được phép bởi DBMS).  
> Trong schedule, khi một transaction đã commit đọc dữ liệu mà transaction rollback đã ghi

### Ví dụ

Chúng ta muốn thực hiện rollback2.

![Pasted image 20230628143254](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230628143254.png)

Vì `R2(B) - W2(B)` đã hoạt động trước khi `R1(B) - W1(B)` đã hoạt động, nên giao dịch 1 cũng phải rollback.

Tuy nhiên, vì giao dịch 1 đã commit, nên không thể rollback do tính bền vững (durability).

Trường hợp khi giao dịch 1 đọc trong khi giao dịch 2 chưa hoàn thành được gọi là **DIRTY READ** (đọc bẩn).

> **DIRTY READ** (đọc bẩn): Hiện tượng mà một giao dịch có thể đọc được các thay đổi chưa hoàn thành từ một giao dịch khác.

### ✔️ recoverable schedule

> Lịch trình mà giao dịch chỉ commit sau khi giao dịch ghi dữ liệu mà nó đã đọc đã commit hoặc rollback.

### Ví dụ

Giao dịch 2 commit/rollback trước

![Pasted image 20230628160019](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230628160019.png)

### cascading rollback

Trong ví dụ trên, nếu giao dịch 2 rollback, giao dịch 1 đã đọc kết quả của giao dịch 2, do đó có sự phụ thuộc.

Vì vậy, giao dịch 1 cũng sẽ rollback. Điều này được gọi là **cascading rollback**.

Điều này tốn kém. Vì vậy, **cascadeless schedule** được xuất hiện.

### ✔️ cascadeless schedule

> Lịch trình mà chỉ sau khi giao dịch ghi dữ liệu đã commit/rollback thì dữ liệu mới có thể được đọc. Nói cách khác, dữ liệu chưa được commit sẽ không được đọc.

Tuy nhiên, hãy tưởng tượng rằng bạn đang nghĩ rằng giá một đĩa tô phở ở nhà hàng là 50000 đồng.

Cùng lúc đó, chủ nhà hàng (giao dịch 1) muốn viết giá là 40000 đồng, và quản lý (giao dịch 2) muốn viết giá là 30000 đồng.

Trong trạng thái này, nếu giao dịch 1 rollback, giá ban đầu là 50000 đồng sẽ được khôi phục. Điều này có nghĩa là giá 30000 đồng mà quản lý (giao dịch 2) đã đặt sẽ bị mất đi.

![Pasted image 20230628160721](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230628160721.png)

Vì vậy, **strict scedule** đã xuất hiện!

### ✔️ strict scedule

> Dữ liệu chưa được commit không được đọc hoặc ghi.

Một lịch trình nghiêm ngặt hơn đã xuất hiện.

### Tóm tắt

![Pasted image 20230628161249](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230628161249.png)

> Recoverability là một trong các thuộc tính của recoverable schedule.

💡 `concurrency control` : Đảm bảo mọi sche hoạt động theo cách có thể khôi phục được (Recoverability).

💡 Liên quan đến `Isolation`
