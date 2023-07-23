---
title: MySQL Index
tags: [db, mysql, sql]
categories: [db, mysql, sql]
date created: 2023-07-22
date modified: 2023-07-23
---

# Chỉ mục MySQL

> Chỉ mục là một phương pháp quan trọng để cải thiện hiệu suất truy vấn trong MySQL, nhưng quá nhiều chỉ mục có thể dẫn đến sử dụng đĩa cao và chiếm nhiều bộ nhớ, ảnh hưởng đến hiệu suất tổng thể của ứng dụng. Nên tránh việc thêm chỉ mục sau khi đã triển khai, vì sau đó có thể cần giám sát nhiều truy vấn SQL để xác định vị trí của vấn đề, và thời gian thêm chỉ mục nhất định là lớn hơn thời gian ban đầu để thêm chỉ mục, điều này cho thấy việc thêm chỉ mục cũng rất có tính kỹ thuật.
>
> Tiếp theo, tôi sẽ giới thiệu cho bạn một loạt các chiến lược tạo chỉ mục hiệu suất cao và nguyên tắc làm việc đằng sau mỗi chiến lược. Tuy nhiên, trước khi đi vào chi tiết, hãy tìm hiểu một số thuật toán và cấu trúc dữ liệu liên quan đến chỉ mục, điều này sẽ giúp bạn hiểu rõ hơn nội dung sau này.

## Giới thiệu về chỉ mục

**Chỉ mục là một cấu trúc dữ liệu trong cơ sở dữ liệu được sử dụng để cải thiện hiệu suất tìm kiếm**.

Chỉ mục là yếu tố quan trọng cho hiệu suất tốt, khi dữ liệu nhỏ và tải không cao, tác động của chỉ mục không thể thấy rõ; nhưng khi dữ liệu tăng dần, hiệu suất sẽ giảm đáng kể. Do đó, tối ưu chỉ mục là biện pháp hiệu quả nhất để tối ưu hiệu suất truy vấn.

### Ưu và nhược điểm của chỉ mục

B-Tree là cấu trúc dữ liệu chỉ mục phổ biến nhất, lưu trữ dữ liệu theo thứ tự, vì vậy MySQL có thể được sử dụng để thực hiện các hoạt động `ORDER BY` và `GROUP BY`. Vì dữ liệu được sắp xếp, B-Tree cũng sẽ lưu trữ các giá trị cột liên quan cùng nhau. Cuối cùng, vì chỉ mục lưu trữ các giá trị cột thực tế, nên một số truy vấn chỉ cần sử dụng chỉ mục để hoàn thành toàn bộ truy vấn.

✔ Ưu điểm của chỉ mục:

- **Chỉ mục giảm đáng kể lượng dữ liệu cần quét bởi máy chủ, từ đó tăng tốc độ truy vấn**.
- **Chỉ mục có thể giúp máy chủ tránh sắp xếp và bảng tạm thời**.
- **Chỉ mục có thể biến I/O ngẫu nhiên thành I/O tuần tự**.
- Các cơ sở dữ liệu hỗ trợ khóa hàng, chẳng hạn như InnoDB, sẽ khóa khi truy cập hàng. **Sử dụng chỉ mục có thể giảm số lượng hàng truy cập, từ đó giảm sự cạnh tranh khóa và tăng cường đồng thời**.
- Chỉ mục duy nhất đảm bảo tính duy nhất của mỗi hàng dữ liệu, sử dụng chỉ mục có thể tận dụng được trình tối ưu hóa ẩn, cải thiện hiệu suất hệ thống.

❌ Nhược điểm của chỉ mục:

- **Tạo và duy trì chỉ mục mất thời gian**, điều này tăng theo lượng dữ liệu.
- **Chỉ mục chiếm không gian vật lý bổ sung**, ngoài không gian dữ liệu của bảng, mỗi chỉ mục cũng cần một không gian vật lý nhất định, nếu tạo chỉ mục kết hợp, không gian cần thiết sẽ lớn hơn.
- **Có thể cần cập nhật chỉ mục khi thực hiện các hoạt động ghi (`INSERT`/`UPDATE`/`DELETE`)**, dẫn đến giảm hiệu suất ghi của cơ sở dữ liệu.

### Khi nào sử dụng chỉ mục

> Chỉ mục có thể dễ dàng nâng cao hiệu suất truy vấn một vài cấp số nhân.

✔ Trường hợp **thích hợp** sử dụng chỉ mục:

- **Thao tác đọc thường xuyên (`SELECT`)**.
- **Dữ liệu trong bảng lớn**.
- **Tên cột thường xuất hiện trong điều kiện `WHERE` hoặc điều kiện kết nối (`JOIN`)**.

❌ Trường hợp **không thích hợp** sử dụng chỉ mục:

- **Thao tác ghi thường xuyên (`INSERT`/`UPDATE`/`DELETE`)**, điều này có nghĩa là cần cập nhật chỉ mục.
- **Tên cột không thường xuất hiện trong điều kiện `WHERE` hoặc điều kiện kết nối (`JOIN`)**, điều này có nghĩa là chỉ mục thường không được tìm thấy, không có ý nghĩa và tăng chi phí không gian.
- **Bảng rất nhỏ**, trong hầu hết các trường hợp, quét toàn bộ bảng đơn giản hơn và hiệu quả hơn cho bảng rất nhỏ.
- **Bảng cỡ lớn đặc biệt**, chi phí tạo và sử dụng chỉ mục sẽ tăng lên. Có thể xem xét sử dụng kỹ thuật phân vùng hoặc NoSQL.

## Cấu trúc dữ liệu của chỉ mục

Trong MySQL, chỉ mục được thực hiện ở bộ lưu trữ (storage engine), chứ không phải ở lớp máy chủ. Do đó, không có tiêu chuẩn chỉ mục chung; cấu trúc dữ liệu chỉ mục có thể khác nhau cho các storage engine khác nhau.

### Mảng (Array)

Mảng là một cấu trúc dữ liệu lưu trữ dữ liệu trong một không gian bộ nhớ liên tục và hỗ trợ truy cập ngẫu nhiên.

Mảng được sắp xếp có thể sử dụng thuật toán tìm kiếm nhị phân, có độ phức tạp thời gian là **O(log n)**, cho cả truy vấn bằng giá trị và truy vấn theo phạm vi.

Tuy nhiên, mảng có hai hạn chế quan trọng:

- Kích thước không gian mảng cố định, nếu cần mở rộng chỉ có thể sử dụng cách sao chép mảng.
- Thời gian phức tạp của việc chèn và xóa là O(n).

Điều này có nghĩa là, nếu sử dụng mảng làm chỉ mục và muốn đảm bảo mảng được sắp xếp, thì việc cập nhật sẽ tốn kém.

### Chỉ mục băm (Hash Index)

Bảng băm là một cấu trúc dữ liệu lưu trữ dữ liệu dưới dạng cặp khóa - giá trị (key-value), trong đó chúng ta chỉ cần nhập giá trị cần tìm kiếm là khóa (key), chúng ta sẽ tìm thấy giá trị tương ứng.

**Bảng băm** sử dụng **hàm băm** để tổ chức dữ liệu, hỗ trợ việc chèn và tìm kiếm nhanh chóng. Cấu trúc dữ liệu bảng băm thực chất là một mảng, với ý tưởng là: sử dụng hàm băm để chuyển đổi khóa thành chỉ mục mảng, sử dụng tính chất truy cập ngẫu nhiên của mảng, cho phép chúng ta tìm kiếm trong thời gian O(1).

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20220320201844.png)

Có hai loại bảng băm khác nhau: **bảng băm tập hợp** và **bảng băm ánh xạ**.

- **Bảng băm tập hợp** là một cấu trúc dữ liệu để lưu trữ các giá trị không trùng lặp.
- **Bảng băm ánh xạ** là một cấu trúc dữ liệu để lưu trữ cặp khóa - giá trị, trong đó giá trị được liên kết với khóa.

Chỉ mục băm dựa trên bảng băm để triển khai, **chỉ hỗ trợ truy vấn so sánh bằng**. Đối với mỗi hàng dữ liệu, chỉ mục băm sẽ tính toán một mã băm (hashcode) cho tất cả các cột chỉ mục và lưu trữ mã băm trong chỉ mục, đồng thời lưu trữ con trỏ đến mỗi hàng dữ liệu trong bảng băm.

Trong Mysql, chỉ có lưu trữ bộ nhớ (Memory) hiển thị hỗ trợ chỉ mục băm.

✔ Ưu điểm của chỉ mục băm:

- Vì cấu trúc dữ liệu chỉ mục gọn nhẹ, nên **tốc độ truy vấn rất nhanh**.

❌ Nhược điểm của chỉ mục băm:

- Giá trị chỉ mục không bao gồm giá trị cột, do đó không thể sử dụng giá trị chỉ mục để tránh đọc hàng. Tuy nhiên, việc truy cập hàng trong bộ nhớ nhanh, vì vậy trong hầu hết các trường hợp, điều này không ảnh hưởng đến hiệu suất.
- Dữ liệu chỉ mục băm không được sắp xếp theo giá trị chỉ mục, do đó **không thể sử dụng để sắp xếp**.
- Chỉ mục băm **không hỗ trợ truy vấn phạm vi**, vì chỉ mục băm sử dụng toàn bộ nội dung cột chỉ mục để tính toán băm. Ví dụ, trên cột dữ liệu (A, B) xây dựng chỉ mục băm, nếu truy vấn chỉ có cột dữ liệu A, không thể sử dụng chỉ mục này.
- Chỉ mục băm có thể gặp **xung đột băm**:
	- Khi xảy ra xung đột băm, phải duyệt qua tất cả các con trỏ hàng trong danh sách liên kết, so sánh từng hàng một cho đến khi tìm thấy hàng phù hợp.
	- Nếu xung đột băm nhiều, việc duy trì chỉ mục sẽ tốn kém.

> Vì các hạn chế trên, chỉ mục băm chỉ phù hợp cho các tình huống cụ thể. Tuy nhiên, một khi sử dụng chỉ mục băm, hiệu suất cải thiện sẽ rất đáng kể.

### Chỉ mục B-Tree

Thường khi nói về chỉ mục, chúng ta đề cập đến chỉ mục B-Tree, đây là loại chỉ mục phổ biến nhất trong cơ sở dữ liệu quan hệ, hầu hết các động cơ lưu trữ đều hỗ trợ loại chỉ mục này. Từ `B-Tree` được sử dụng trong MySQL trong các câu lệnh `CREATE TABLE` hoặc các câu lệnh khác, nhưng thực tế các storage engine khác nhau có thể sử dụng các cấu trúc dữ liệu khác nhau, ví dụ như InnoDB sử dụng `B+Tree`.

Trong B+Tree, chữ `B` đề cập đến từ `balance`, có nghĩa là cân bằng. Cần lưu ý rằng chỉ mục B+Tree không thể tìm ra hàng cụ thể cho một giá trị khóa đã cho, nó chỉ tìm ra trang chứa dòng dữ liệu được tìm kiếm và sau đó cơ sở dữ liệu sẽ đọc trang vào bộ nhớ và tiếp tục tìm kiếm trong bộ nhớ để cuối cùng thu được dữ liệu mong muốn.

#### Cây tìm kiếm nhị phân

Cây tìm kiếm nhị phân có đặc điểm là mỗi nút con trái nhỏ hơn nút cha và nút cha nhỏ hơn nút con phải. Độ phức tạp thời gian truy vấn của nó là $$O(log(N))$$.

Tuy nhiên, để duy trì độ phức tạp truy vấn $$O(log(N))$$, bạn cần đảm bảo rằng cây này là một cây tìm kiếm nhị phân cân bằng. Để đảm bảo điều này, độ phức tạp thời gian cập nhật cũng là $$O(log(N))$$.

Khi dữ liệu trong cơ sở dữ liệu tăng lên, kích thước chỉ mục cũng tăng lên và không thể lưu trữ toàn bộ chỉ mục trong bộ nhớ. Do đó, chỉ mục thường được lưu trữ dưới dạng tệp trên đĩa. Trong quá trình tìm kiếm chỉ mục, sẽ có sự tiêu tốn I/O đĩa, so với truy cập bộ nhớ, tiêu tốn I/O đĩa cao hơn một vài lần. Hãy tưởng tượng xem một cây nhị phân có hàng triệu nút sâu đến đâu? Nếu đặt cây nhị phân có độ sâu lớn như vậy lên đĩa, mỗi lần đọc một nút, sẽ cần một lần đọc I/O đĩa, rõ ràng thời gian tìm kiếm như vậy là không chấp nhận được. Vậy làm thế nào để giảm số lần truy cập I/O trong quá trình tìm kiếm?

Một phương pháp hiệu quả là giảm độ sâu của cây, biến cây nhị phân thành cây nhiều nhánh (multiway search tree), và **B+ tree là một loại cây nhiều nhánh**.

#### B+Tree

B+Tree là một cấu trúc dữ liệu dùng để tạo chỉ mục, phù hợp cho việc tìm kiếm toàn bộ khóa, tìm kiếm phạm vi khóa và tìm kiếm tiền tố khóa. Tuy nhiên, tìm kiếm tiền tố khóa chỉ áp dụng cho việc tìm kiếm tiền tố bên trái.

Để hiểu B+Tree, chỉ cần hiểu hai đặc điểm quan trọng nhất của nó:

- Thứ nhất, tất cả các khóa (có thể hiểu là dữ liệu) được lưu trữ trong các nút lá, các nút không phải lá không lưu trữ dữ liệu thực sự, tất cả các nút ghi nhận được sắp xếp theo thứ tự giá trị khóa và được lưu trữ trên cùng một tầng nút lá.
- Thứ hai, tất cả các nút lá được kết nối bằng con trỏ. Hình ảnh dưới đây là một cây B+ được đơn giản hóa.

![b-tree-index](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200304235424.jpg)

Dựa trên nội dung của các nút lá, loại chỉ mục được chia thành chỉ mục khóa chính và chỉ mục không phải khóa chính.

- **Chỉ mục khóa chính** (clustered index), còn được gọi là chỉ mục chính, chỉ mục cụm, nút lá lưu trữ toàn bộ dữ liệu hàng. Vì không thể lưu trữ hàng dữ liệu ở hai vị trí khác nhau cùng một lúc, nên **một bảng chỉ có thể có một chỉ mục khóa chính**. **Chỉ mục khóa chính của InnoDB thực tế là lưu trữ cả chỉ mục B-Tree và hàng dữ liệu trong cùng một cấu trúc**.
- Chỉ mục không phải khóa chính (non-clustered index) lưu trữ giá trị khóa chính tương ứng với khóa. Trong InnoDB, chỉ mục không phải khóa chính còn được gọi là chỉ mục phụ (secondary index). Dữ liệu được lưu trữ ở một vị trí, chỉ mục được lưu trữ ở một vị trí khác, chỉ mục chứa con trỏ đến vị trí dữ liệu. Có thể có nhiều chỉ mục phụ, tối đa 249.

**Phân cụm (clustered) có nghĩa là các hàng dữ liệu và giá trị khóa liền kề được lưu trữ cùng nhau một cách nhỏ gọn. Do đó việc truy cập nhanh chóng**. Vì không thể lưu trữ hàng dữ liệu trong hai vị trí khác nhau cùng một lúc, nên **một bảng chỉ có thể có một chỉ số cụm**.

**Sự khác biệt giữa truy vấn chỉ mục phân cụm và truy vấn chỉ mục không phân cụm**

- Nếu câu lệnh là `SELECT * FROM T WHERE ID = 500`, tức là truy vấn chỉ mục phân cụm, chỉ cần tìm kiếm B+Tree của ID;
- Nếu câu lệnh là `SELECT * FROM T WHERE k = 5`, tức là truy vấn chỉ mục không phân cụm, cần tìm kiếm cây chỉ mục k trước, tìm giá trị ID là 500, sau đó tìm kiếm cây chỉ mục ID. Quá trình này được gọi là **truy vấn lại**.

Nghĩa là, **truy vấn dựa trên chỉ mục không phân cụm cần quét hai cây chỉ mục**. Do đó, chúng ta nên ưu tiên sử dụng truy vấn khóa chính.

**Rõ ràng, độ dài khóa chính càng nhỏ thì nút lá chỉ mục không phải khóa chính càng nhỏ, chỉ mục không phân cụm chiếm ít không gian hơn.**

Khóa chính tự tăng là khóa chính được định nghĩa trên cột tự tăng, trong câu lệnh tạo bảng thường được định nghĩa như sau: `NOT NULL PRIMARY KEY AUTO_INCREMENT`. Về mặt hiệu suất và không gian lưu trữ, khóa chính tự tăng thường là lựa chọn hợp lý hơn. Có trường hợp nào phù hợp để sử dụng trường kinh doanh làm khóa chính không? Có. Ví dụ, một số yêu cầu kịch bản kinh doanh như sau:

- Chỉ có một chỉ mục;
- Chỉ mục này phải là chỉ mục duy nhất.

Vì không có chỉ mục khác, không cần xem xét vấn đề kích thước nút lá chỉ mục không phải khóa chính.

Lúc này, chúng ta nên ưu tiên áp dụng nguyên tắc "ưu tiên sử dụng truy vấn khóa chính", trực tiếp đặt chỉ mục này làm khóa chính, có thể tránh việc mỗi lần truy vấn đều cần tìm kiếm hai cây.

### Chỉ mục toàn văn bản (Full-Text Index)

MyISAM hỗ trợ chỉ mục toàn văn bản, được sử dụng để tìm kiếm từ khóa trong văn bản thay vì so sánh trực tiếp. Điều kiện tìm kiếm được sử dụng là `MATCH AGAINST` thay vì `WHERE` thông thường.

Chỉ mục toàn văn bản thường sử dụng cấu trúc dữ liệu chỉ mục đảo ngược (inverted index), nó ghi lại ánh xạ từ khóa đến tài liệu chứa nó.

InnoDB Storage Engine hỗ trợ chỉ mục toàn văn bản từ phiên bản MySQL 5.6.4.

### Chỉ mục không gian

Lưu trữ MyISAM hỗ trợ chỉ mục không gian (R-Tree), được sử dụng để lưu trữ dữ liệu địa lý. Chỉ mục không gian sẽ tổ chức dữ liệu từ tất cả các chiều để tìm kiếm hiệu quả bằng bất kỳ kết hợp nào của các chiều.

Cần sử dụng các hàm liên quan đến GIS để duy trì dữ liệu.

## Các loại chỉ mục

Các hệ thống cơ sở dữ liệu quan hệ phổ biến thường hỗ trợ các loại chỉ mục sau:

### Chỉ mục khóa chính (`PRIMARY`)

Chỉ mục khóa chính: Đây là một loại chỉ mục đặc biệt, không cho phép giá trị trống. Một bảng chỉ có thể có một chỉ mục khóa chính (thực tế là chỉ mục gom cụm trong InnoDB) và thường được tạo cùng với việc tạo bảng.

```sql
CREATE TABLE `table` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    ...
    PRIMARY KEY (`id`)
)
```

### Chỉ mục duy nhất (`UNIQUE`)

Chỉ mục duy nhất: Các giá trị trong cột chỉ mục phải là duy nhất, nhưng cho phép giá trị trống. Nếu đó là chỉ mục kết hợp, thì sự kết hợp của các giá trị cột phải là duy nhất.

```sql
CREATE TABLE `table` (
    ...
    UNIQUE indexName (title(length))
)
```

### Chỉ mục thông thường (`INDEX`)

Chỉ mục thông thường: Đây là loại chỉ mục cơ bản, không có bất kỳ ràng buộc nào.

```sql
CREATE TABLE `table` (
    ...
    INDEX index_name (title(length))
)
```

### Chỉ mục toàn văn (`FULLTEXT`)

Chỉ mục toàn văn: Chủ yếu được sử dụng để tìm kiếm từ khóa trong văn bản, thay vì so sánh trực tiếp với các giá trị trong chỉ mục.

Chỉ mục toàn văn khác biệt rất nhiều so với các loại chỉ mục khác, nó giống như một công cụ tìm kiếm hơn là một tham số so sánh trong câu lệnh WHERE. Chỉ mục toàn văn được sử dụng kết hợp với phép toán `match against`, thay vì sử dụng câu lệnh WHERE thông thường kèm theo LIKE. Chỉ mục toàn văn có thể được sử dụng trong `CREATE TABLE`, `ALTER TABLE`, `CREATE INDEX`, nhưng hiện tại chỉ có thể tạo chỉ mục toàn văn trên các cột kiểu `char`, `varchar` và `text`. Đáng lưu ý là, khi có số lượng dữ liệu lớn, việc đưa dữ liệu vào một bảng không có chỉ mục toàn cục trước, sau đó tạo chỉ mục toàn văn bằng cách sử dụng `CREATE INDEX` sẽ nhanh hơn việc tạo chỉ mục toàn văn trước khi đưa dữ liệu vào.

```sql
CREATE TABLE `table` (
    `content` text CHARACTER NULL,
    ...
    FULLTEXT (content)
)
```

### Chỉ mục kết hợp

Chỉ mục kết hợp: Đây là chỉ mục được tạo trên nhiều trường, chỉ khi trường đầu tiên trong điều kiện truy vấn sử dụng chỉ mục, chỉ mục mới được sử dụng. Khi sử dụng chỉ mục kết hợp, cần tuân theo tập hợp tiền tố tối đa bên trái.

```sql
CREATE TABLE `table` (
    ...
    INDEX index_name (title(length), title(length), ...)
)
```

## Chiến lược lập chỉ mục

Giả sử có bảng sau:

```sql
CREATE TABLE `t` (
  `id` int(11) NOT NULL,
  `city` varchar(16) NOT NULL,
  `name` varchar(16) NOT NULL,
  `age` int(11) NOT NULL,
  `addr` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `city` (`city`)
) ENGINE=InnoDB;
```

### Nguyên tắc cơ bản của lập chỉ mục

- **Không phải càng nhiều chỉ mục càng tốt, không nên tạo chỉ mục cho tất cả các cột**. Cần xem xét chi phí duy trì chỉ mục, không gian chiếm dụng và chi phí của việc truy vấn lại dữ liệu. Chỉ tạo chỉ mục khi cần thiết và cần đảm bảo chỉ mục nhẹ nhàng. Khi tạo chỉ mục kết hợp nhiều cột, cần cố gắng sử dụng chỉ mục để thực hiện truy vấn dữ liệu và giảm thiểu chi phí truy vấn lại dữ liệu.
- **Tránh tạo chỉ mục trùng lặp và không cần thiết**.
- **Xem xét xóa các chỉ mục không được sử dụng**.
- **Mở rộng chỉ mục hiện có thay vì tạo mới chỉ mục**.
- **Các cột được sử dụng thường xuyên làm điều kiện lọc nên xem xét việc tạo chỉ mục**.

### Cột độc lập

**"Cột độc lập" có nghĩa là các cột được lập chỉ mục không thể là một phần của biểu thức, chúng cũng không thể là tham số của hàm** .

**Việc thực hiện các phép toán trên trường chỉ mục có thể gây thiệt hại đến tính tuần tự của giá trị chỉ mục, do đó trình tối ưu quyết định từ chối sử dụng chức năng tìm kiếm cây.**

Nếu các cột trong truy vấn không phải là các cột độc lập, cơ sở dữ liệu sẽ không sử dụng chỉ mục.

❌ Ví dụ không đúng:

```sql
SELECT actor_id FROM actor WHERE actor_id + 1 = 5;
SELECT ... WHERE TO_DAYS(current_date) - TO_DAYS(date_col) <= 10;
```

### Chỉ mục che phủ

**Chỉ mục che phủ là chỉ mục mà thông tin trên chỉ mục đủ để đáp ứng yêu cầu truy vấn, không cần truy vấn lại dữ liệu**.

【Ví dụ】Truy vấn phạm vi

```sql
create table T (
ID int primary key,
k int NOT NULL DEFAULT 0,
s varchar(16) NOT NULL DEFAULT '',
index k(k))
engine=InnoDB;

insert into T values(100,1, 'aa'),(200,2,'bb'),(300,3,'cc'),(500,5,'ee'),(600,6,'ff'),(700,7,'gg');

select * from T where k between 3 and 5
```

Cần thực hiện bao nhiêu lần tìm kiếm cây, quét qua bao nhiêu hàng?

1. Tìm kiếm bản ghi với k=3 trên cây chỉ mục k, lấy ID = 300;
2. Tìm kiếm bản ghi với ID = 300 trên cây chỉ mục ID, lấy R3;
3. Tìm kiếm bản ghi với k=5 trên cây chỉ mục k, lấy ID = 500;
4. Tìm kiếm bản ghi với ID = 500 trên cây chỉ mục ID, lấy R4;
5. Tìm kiếm bản ghi với k=6 trên cây chỉ mục k, không thỏa mãn điều kiện, kết thúc vòng lặp.

Trong quá trình này, quá trình tìm kiếm lại trên cây chỉ mục chính được gọi là truy vấn lại. Có thể thấy, quá trình truy vấn này đọc 3 bản ghi trên cây chỉ mục k (bước 1, 3 và 5) và truy vấn lại hai lần (bước 2 và 4).

Nếu câu lệnh thực hiện là select ID from T where k between 3 and 5, chỉ cần lấy giá trị ID, và giá trị ID đã có trên cây chỉ mục k, do đó có thể trả kết quả truy vấn trực tiếp mà không cần truy vấn lại. Chỉ mục chứa tất cả các giá trị cần truy vấn, được gọi là chỉ mục che phủ.

**Do chỉ mục che phủ giảm số lần tìm kiếm cây, đáng kể cải thiện hiệu suất truy vấn, nên sử dụng chỉ mục che phủ là một biện pháp tối ưu hiệu suất phổ biến**.

### Sử dụng chỉ mục để sắp xếp

MySQL có hai cách để tạo kết quả sắp xếp: thông qua thao tác sắp xếp hoặc quét theo thứ tự chỉ mục.

**Chỉ mục tốt là chỉ mục có thể được sử dụng để sắp xếp và tìm kiếm hàng**. Điều này cho phép kết quả được truy xuất trực tiếp từ chỉ mục mà không cần sắp xếp lại.

Khi sử dụng chỉ mục để sắp xếp, cần đảm bảo chỉ mục được chọn đủ để thực hiện truy vấn dữ liệu và giảm thiểu chi phí truy vấn lại dữ liệu.

Quá trình thực hiện truy vấn sẽ như sau:

1. Tìm kiếm bản ghi đầu tiên trong chỉ mục (city, name, age) thỏa mãn điều kiện city='Hà Nội' và lấy giá trị city, name và age làm một phần của kết quả trực tiếp trả về;
2. Lấy bản ghi tiếp theo từ chỉ mục (city, name, age) và lấy giá trị city, name và age làm một phần của kết quả trực tiếp trả về;
3. Lặp lại bước 2 cho đến khi tìm thấy bản ghi thứ 1000 hoặc không thỏa mãn điều kiện city='Hà Nội' thì kết thúc vòng lặp.

### Chỉ mục tiền tố

Đôi khi cần tạo chỉ mục cho các cột có độ dài lớn, điều này sẽ làm cho chỉ mục trở nên lớn và chậm.

Trong trường hợp này, có thể sử dụng chỉ mục tiền tố, chỉ lưu trữ một phần đầu của chuỗi, điều này có thể **tiết kiệm không gian chỉ mục đáng kể và cải thiện hiệu suất chỉ mục**. Tuy nhiên, điều này cũng **giảm tính chọn lọc của chỉ mục**. Đối với các cột văn bản như `BLOB`/`TEXT`/`VARCHAR` không thể tạo chỉ mục đầy đủ, vì hầu hết các cơ sở dữ liệu không cho phép tạo chỉ mục đầy đủ cho các cột này.

**Tính chọn lọc của chỉ mục** là tỷ lệ giữa các giá trị chỉ mục không trùng nhau và tổng số bản ghi trong bảng dữ liệu. Giá trị tối đa là 1, khi đó mỗi bản ghi có một chỉ mục duy nhất tương ứng. Độ chọn lọc càng cao, hiệu suất truy vấn cũng càng cao. Nếu có nhiều chỉ mục tiền tố khớp với điều kiện, ta phải quét từng cái cho đến khi tìm được bản ghi chính xác cuối cùng.

**Sử dụng chỉ mục tiền tố và xác định độ dài, bạn có thể tiết kiệm không gian mà không cần tăng thêm quá nhiều chi phí truy vấn.**

Lựa chọn độ dài chỉ mục tiền tố phù hợp làm thế nào?

Có thể sử dụng câu lệnh sau để tính toán số lượng giá trị khác nhau trên cột:

```sql
select count(distinct email) as L from SUser;
```

Sau đó, lần lượt chọn các độ dài tiền tố khác nhau để xem giá trị này, ví dụ: chúng ta muốn xem tiền tố từ 4 đến 7 ký tự, có thể sử dụng câu lệnh sau:

```sql
select
  count(distinct left(email,4)）as L4,
  count(distinct left(email,5)）as L5,
  count(distinct left(email,6)）as L6,
  count(distinct left(email,7)）as L7,
from SUser;
```

Tất nhiên, **sử dụng chỉ mục tiền tố có thể làm giảm độ phân biệt**, vì vậy bạn cần thiết lập trước tỷ lệ chấp nhận được của sự giảm này, ví dụ như 5%. Sau đó, trong các kết quả trả về từ L4~L7, hãy tìm các giá trị không nhỏ hơn L * 95%, giả sử ở đây cả L6 và L7 đều thỏa mãn điều kiện này, bạn có thể chọn chiều dài tiền tố là 6.

Ngoài ra, **`ORDER BY` không thể sử dụng chỉ mục tiền tố, không thể sử dụng chỉ mục tiền tố làm chỉ mục che phủ**.

### Nguyên tắc khớp trước tối đa

Không chỉ là toàn bộ định nghĩa chỉ mục, chỉ cần đáp ứng khớp trước tối đa, chỉ mục có thể được sử dụng để tăng tốc tìm kiếm. Khớp trước tối đa có thể là N cột đầu tiên của chỉ mục kết hợp hoặc M ký tự đầu tiên của chỉ mục chuỗi.

MySQL sẽ tiếp tục khớp từ trái sang phải cho đến khi gặp các truy vấn phạm vi (`>`,`<`,`BETWEEN`,`LIKE`).

- Chỉ mục có thể đơn giản như một cột (a) hoặc phức tạp như nhiều cột (a, b, c, d), tức là chỉ mục kết hợp.
- Nếu đó là chỉ mục kết hợp, thì khóa cũng bao gồm nhiều cột, đồng thời, chỉ mục chỉ có thể được sử dụng để tìm kiếm khóa có sẵn (bằng nhau), khi gặp truy vấn phạm vi (`>`,`<`,`BETWEEN`,`LIKE`), nó sẽ không thể khớp tiếp theo, sau đó rơi vào tìm kiếm tuyến tính.
- Do đó, **thứ tự cột quyết định số cột có thể khớp được**.

**Không nên tạo chỉ mục độc lập cho mỗi cột**.

**Hãy đặt cột có khả năng chọn lọc cao hoặc cơ sở số lượng lớn ở đầu danh sách các cột kết hợp**. Tuy nhiên, đôi khi cũng cần xem xét các yếu tố như sắp xếp, nhóm và điều kiện phạm vi trong mệnh đề `WHERE`, những yếu tố này cũng ảnh hưởng đáng kể đến hiệu suất truy vấn.

Ví dụ: `a = 1 and b = 2 and c > 3 and d = 4`，nếu tạo chỉ mục theo thứ tự (a,b,c,d)，thì d sẽ không được sử dụng chỉ mục. Nếu tạo chỉ mục theo thứ tự (a,b,d,c)，thì cũng có thể sử dụng chỉ mục cho tất cả các cột. Thứ tự a,b,d có thể được sắp xếp theo bất kỳ cách nào.

Hãy đặt cột chỉ mục có tính chọn lọc cao nhất ở phía trước, tính chọn lọc của chỉ mục được hiểu là tỷ lệ giữa giá trị chỉ mục không trùng và tổng số bản ghi. Giá trị tối đa là 1, khi đó mỗi bản ghi sẽ có duy nhất một chỉ mục tương ứng. Độ chọn lọc càng cao thì hiệu suất truy vấn cũng càng cao.

Ví dụ như kết quả hiển thị dưới đây, tính chọn lọc của customer_id có mức độ ưu tiên cao hơn so với staff_id, do đó tốt nhất là để cột customer_id được đặt trước trong chỉ mục kết hợp.

```sql
SELECT COUNT(DISTINCT staff_id)/COUNT(*) AS staff_id_selectivity,
COUNT(DISTINCT customer_id)/COUNT(*) AS customer_id_selectivity,
COUNT(*)
FROM payment;
```

```batch
   staff_id_selectivity: 0.0001
customer_id_selectivity: 0.0373
               COUNT(*): 16049
```

### Phép = và in có thể không tuân theo thứ tự

**Không cần quan tâm đến thứ tự của ` = ` và `IN`**，MySQL sẽ tự động tối ưu thứ tự của các điều kiện này để khớp với số lượng cột chỉ mục càng nhiều càng tốt.

【Ví dụ】Nếu có chỉ mục (a, b, c, d), câu truy vấn có điều kiện `c > 3 and b = 2 and a = 1 and d < 4` và `a = 1 and c > 3 and b = 2 and d < 4` đều có thể. MySQL sẽ tự động tối ưu thành `a = 1 and b = 2 and c > 3 and d < 4`, và tìm kiếm theo thứ tự a, b, c, d.

## Thực hành tốt nhất cho chỉ mục

Việc tạo chỉ mục không đảm bảo sẽ mang lại hiệu quả. Ví dụ, không tuân thủ chỉ mục tiền tố, nguyên tắc khớp trước tối đa, điều kiện truy vấn liên quan đến tính toán hàm, v.v. đều không thể sử dụng chỉ mục. Ngoài ra, ngay cả khi câu lệnh SQL thỏa mãn điều kiện sử dụng chỉ mục, MySQL cũng sẽ đánh giá chi phí của các phương pháp truy vấn khác nhau để quyết định xem có sử dụng chỉ mục hay không và sử dụng chỉ mục nào.

Do đó, khi cố gắng tối ưu hiệu suất SQL bằng cách sử dụng chỉ mục, hãy chắc chắn xác nhận xem chỉ mục có thể cải thiện hiệu suất thực tế hay không thông qua chiến lược thực thi (`EXPLAIN`) hoặc hiệu quả thực tế. Nếu có thắc mắc về kế hoạch thực thi được cung cấp bởi `EXPLAIN`, bạn cũng có thể sử dụng `optimizer_trace` để xem kế hoạch thực thi chi tiết để phân tích tiếp.
