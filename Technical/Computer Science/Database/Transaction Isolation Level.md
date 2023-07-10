---
tags: [database]
categories: [database]
date created: 2023-06-27
date modified: 2023-07-10
title: Transaction Isolation Level
---

## 🔎 Giao dịch (Transaction) Part 3

Trong phần 2, chúng ta đã tìm hiểu về concurrency control (Serializability, Recoverability) trong giao dịch.

Để đảm bảo tính Isolation của giao dịch, khi thực hiện nhiều giao dịch cùng một lúc, ta cần đảm bảo không xảy ra hiện tượng bất thường.

Điều này được đảm bảo bởi hai thuộc tính quan trọng là `Serializability` và `Recoverability`.

Nghĩa là, chúng ta cần đảm bảo hai thuộc tính này được đáp ứng.

Tuy nhiên, một nhược điểm của việc này là số lượng giao dịch có thể được xử lý đồng thời sẽ giảm, dẫn đến sự giảm hiệu suất của hệ quản trị cơ sở dữ liệu (DBMS).

Để giải quyết vấn đề này, **concurrency control** của DBMS cung cấp nhiều **Isolation level** khác nhau.

Nó cho phép các developer có thể xem xét đánh đổi giữa tính toàn vẹn dữ liệu và hiệu suất.

Trước khi tìm hiểu về Isolation level, hãy xem xét các hiện tượng có thể xảy ra khi không có Isolation.

### ✔️ Các hiện tượng phát sinh theo Isolation level

### 1) DIRTY READ (Đọc bẩn)

- Hiện tượng mà một giao dịch có thể đọc được các thay đổi chưa hoàn thành từ một giao dịch khác.
- Ví dụ: Người dùng A thay đổi giá trị từ 171 thành 177, nhưng thay đổi này vẫn chưa được "commit". Tuy nhiên, người dùng B lại có thể nhìn thấy kết quả là 177 khi truy vấn dữ liệu.  

Đây là một ví dụ về dirty read đã được đề cập trong phần `Unrecoverable schedule` ở phần 2.

### 2) NON-REPEATABLE READ (Đọc không lặp lại)

- Hiện tượng mà cùng một truy vấn SELECT được thực hiện nhiều lần nhưng cho kết quả khác nhau, vi phạm nguyên tắc "REPEATABLE READ" của tính toàn vẹn dữ liệu.
- Đây là hiện tượng xảy ra hai hoặc nhiều lần truy vấn cho cùng dữ liệu trong một giao dịch nhưng giá trị trả về lại khác nhau.

#### Ví dụ

Giá của một ổ bánh mì là 3000 đồng. Trong một giao dịch, cùng một dữ liệu được đọc hai lần nhưng cho kết quả khác nhau.

Theo Isolation, ngay cả khi nhiều giao dịch được thực hiện đồng thời, chúng phải hoạt động như thể chúng được thực hiện một mình.

Tuy nhiên, giao dịch 2 bị ảnh hưởng. Đây là một sự bất thường.

![Pasted image 20230628202226](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230628202226.png)

### 3) PHANTOM READ (Đọc ảo)

- Hiện tượng mà trong cùng một giao dịch, một truy vấn SELECT được gửi hai lần và lần thứ hai xuất hiện các bản ghi "**ảo**" (phantom) không có trong lần đầu tiên.
- Ví dụ: Người dùng A gửi truy vấn đến bảng sản phẩm để tìm các mặt hàng có số tiền lớn hơn 50000 đồng. -> Truy vấn lần đầu tiên trả về 3 bản ghi. -> Người dùng B chèn một bản ghi với giá trị là 60000 đồng. -> Truy vấn lần thứ hai trả về 4 bản ghi.

Tất nhiên, không nên cho phép xảy ra các hiện tượng bất thường này.

Tuy nhiên, nếu không cho phép xảy ra tất cả các hiện tượng này, sẽ có nhiều ràng buộc và số lượng giao dịch có thể xử lý đồng thời sẽ giảm.

Cuối cùng, thông lượng (throughput) tổng thể của DB sẽ giảm.

Vì vậy, `Isolation Level` được tạo ra để cho phép một số hiện tượng bất thường nhất định xảy ra và cho phép developer lựa chọn phù hợp giữa tính toàn vẹn dữ liệu và hiệu suất.

## Isolation level

> Isolation level được định nghĩa trong tiêu chuẩn SQL

Như có thể thấy từ bảng dưới đây, mức độ cô lập càng nghiêm ngặt thì không cho phép xảy ra các hiện tượng bất thường.

`Isolation level` được chia thành các mức độ dựa trên các hiện tượng mà nó cho phép xảy ra.

Do đó, developer có thể cân nhắc đánh đổi giữa `thông lượng tổng thể (throughput)` và `tính nhất quán` của dữ liệu thông qua mức độ cô lập.  

![Pasted image 20230628224249](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230628224249.png)

### 1) READ UNCOMMITTED (phantom read, non-repeatable read, dirty read)

- Có thể truy vấn dữ liệu chưa được commit từ các giao dịch khác.
- Không nên sử dụng vì mục đích bảo toàn tính toàn vẹn.

### 2) READ COMMITTED (phantom read, non-repeatable read)

- Chỉ cho phép truy vấn dữ liệu đã được commit từ các giao dịch khác.
- Tuy nhiên, một giao dịch có thể sửa đổi các hàng mà một giao dịch khác đã truy cập.
- Đây là mức độ cô lập được sử dụng phổ biến nhất và là giá trị mặc định (default) của nhiều cơ sở dữ liệu.

### 3) REPEATABLE READ (phantom read)

Chỉ cho phép truy vấn các nội dung đã được commit trước khi giao dịch bắt đầu. Ngăn chặn việc một giao dịch khác sửa đổi các hàng mà giao dịch hiện tại đã truy cập. Tuy nhiên, nó không ngăn chặn việc thêm các hàng mới.

### 4) SERIALIZABLE

- Thực hiện các giao dịch theo thứ tự tuần tự, rất nghiêm ngặt.
- Khi một giao dịch bắt đầu, nó khóa và ngăn chặn các giao dịch khác truy cập.
- Có khả năng cao xảy ra tình trạng bế tắc và hiệu suất rất kém.

Càng lên cao, tính đồng thời (concurent) càng mạnh mẽ, nhưng tính cô lập càng yếu đi và càng xuống thấp, tính đồng thời càng yếu đi và tính cô lập càng mạnh hơn.

### Tóm lại

- Các hệ quản trị cơ sở dữ liệu quan trọng sử dụng các mức độ cô lập dựa trên tiêu chuẩn SQL.
- Các hệ quản trị cơ sở dữ liệu (RDBMS) cung cấp các isolation level khác nhau.
- Ngay cả khi cùng có tên isolation level, cách hoạt động có thể khác nhau.
- Vì vậy, khi phát triển, chúng ta cần hiểu rõ mức độ cô lập của RDBMS mà chúng ta đang sử dụng và sử dụng mức độ cô lập phù hợp

#### Ví dụ

> - MySQL có đủ 4 Isolation Level như trên  
	- Postgres cũng có đủ 4 level nhưng định nghĩa của `READ UNCOMMITTED = READ COMMITTED` nên thực tế thì nó chỉ có 3 level.
