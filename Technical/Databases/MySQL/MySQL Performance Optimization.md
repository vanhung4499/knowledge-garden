---
title: MySQL Performance Optimization
tags: [db, mysql, sql]
categories: [db, mysql, sql]
date created: 2023-07-22
date modified: 2023-07-23
---

# Tối ưu hiệu suất MySQL

## Tối ưu cấu trúc dữ liệu

Thiết kế logic và thiết kế vật lý tốt là nền tảng của hiệu suất cao.

### Tối ưu kiểu dữ liệu

#### Nguyên tắc cơ bản của tối ưu kiểu dữ liệu

- **Càng nhỏ càng tốt** - Kiểu dữ liệu nhỏ hơn thường nhanh hơn, chiếm ít không gian đĩa, bộ nhớ và yêu cầu ít chu kỳ CPU để xử lý.
  - Ví dụ: Kiểu số nguyên thường nhanh hơn kiểu ký tự, do đó sử dụng kiểu số nguyên để lưu địa chỉ IP, sử dụng `DATETIME` để lưu thời gian thay vì chuỗi ký tự.
- **Đơn giản là tốt** - Ví dụ: Kiểu số nguyên thường nhanh hơn kiểu ký tự.
	- Ví dụ: Nhiều phần mềm sử dụng kiểu số nguyên để lưu địa chỉ IP.
	- Ví dụ: **`UNSIGNED` chỉ ra không cho phép giá trị âm, có thể tăng giới hạn trên giá trị dương gần gấp đôi**.
- **Tránh NULL nếu có thể** - Cột có thể là NULL sẽ làm phức tạp việc tạo chỉ mục, thống kê chỉ mục và so sánh giá trị.

#### Lựa chọn kiểu dữ liệu

- Kiểu số nguyên thường là lựa chọn tốt nhất cho cột định danh vì chúng nhanh chóng và có thể sử dụng `AUTO_INCREMENT`.
- Kiểu ENUM và SET thường là lựa chọn tồi, nên tránh sử dụng.
- Nên tránh sử dụng kiểu ký tự làm cột định danh vì chúng tiêu tốn không gian và thường chậm hơn kiểu số. Đối với các chuỗi ngẫu nhiên như `MD5`, `SHA`, `UUID`, do phân bố ngẫu nhiên, chúng có thể phân tán trong không gian lớn, dẫn đến việc `INSERT` và một số truy vấn `SELECT` trở nên chậm chạp.
	- Nếu lưu trữ UUID, nên xóa ký tự `-`; cách tốt hơn là chuyển đổi giá trị UUID thành số 16 byte bằng cách sử dụng hàm `UNHEX()` và lưu trữ trong cột `BINARY(16)`, khi truy vấn, có thể định dạng lại thành định dạng hex bằng cách sử dụng hàm `HEX()`.

### Thiết kế bảng

Các vấn đề thiết kế nên tránh:

- **Quá nhiều cột** - Thiết kế có quá nhiều cột không cần thiết, trong thực tế, nhiều cột trong bảng không được sử dụng. Mô hình bảng rộng như vậy sẽ tạo ra một khoản phí hiệu suất không nhỏ, đặc biệt là `ALTER TABLE` rất tốn thời gian.
- **Quá nhiều liên kết** - Mô hình thiết kế thực thể - thuộc tính - giá trị (EAV) là một mô hình thiết kế tồi phổ biến. MySQL giới hạn mỗi phép liên kết tối đa chỉ có thể có 61 bảng, nhưng mô hình EAV yêu cầu nhiều liên kết tự liên kết.
- **Enum** - Nên tránh sử dụng enum vì việc thêm và xóa chuỗi (tùy chọn enum) phải sử dụng `ALTER TABLE`.
- Nên tránh sử dụng NULL nếu có thể.

### Chuẩn hoá và phi chuẩn hoá

**Mục tiêu của chuẩn hoá là giảm thiểu sự lặp lại, trong khi phi chuẩn hoá thì ngược lại**.

Lợi ích của chuẩn hoá:

- Tiết kiệm không gian hơn so với phi chuẩn hoá.
- Các hoạt động cập nhật nhanh hơn so với phi chuẩn hoá.
- Cần ít `DISTINCT` hoặc `GROUP BY` hơn.

Nhược điểm của chuẩn hoá:

- Thường cần truy vấn liên kết. Truy vấn liên kết có chi phí cao, đặc biệt là truy vấn liên kết giữa các bảng phân tán.

Trong thực tế, hiếm khi sử dụng chuẩn hoá hoặc phi chuẩn hoá một cách cực đoan. Thực tế, nên cân nhắc lợi ích và hạn chế của chuẩn hoá và phi chuẩn hoá, sử dụng kết hợp.

### Tối ưu chỉ mục

> Tối ưu chỉ mục nên là biện pháp hiệu suất tìm kiếm hiệu quả nhất.
>
> Nếu bạn muốn tìm hiểu chi tiết về các tính năng chỉ mục, vui lòng tham khảo: [[MySQL Index]]

#### Khi nào sử dụng chỉ mục

- Đối với các bảng rất nhỏ, hầu hết các trường hợp, quét toàn bộ bảng đơn giản hơn.
- Đối với bảng trung bình và lớn, chỉ mục rất hiệu quả.
- Đối với bảng cực lớn, việc xây dựng và sử dụng chỉ mục sẽ tăng chi phí. Có thể xem xét sử dụng kỹ thuật phân vùng.
- Nếu có quá nhiều bảng, có thể xây dựng một bảng thông tin siêu dữ liệu để truy vấn các tính năng cần thiết.

#### Chiến lược tối ưu chỉ mục

- **Nguyên tắc cơ bản của chỉ mục**
	- Không phải càng nhiều chỉ mục càng tốt, không nên tạo chỉ mục cho tất cả các cột.
	- Tránh sự lặp lại và chỉ mục trùng lặp.
	- Xem xét xóa các chỉ mục không sử dụng.
	- Mở rộng chỉ mục hiện có thay vì tạo chỉ mục mới.
	- Các cột thường được sử dụng làm điều kiện lọc trong câu lệnh `WHERE` nên xem xét thêm chỉ mục cho chúng.
- **Cột độc lập** - "Cột độc lập" có nghĩa là cột chỉ mục không phải là một phần của biểu thức hoặc đối số của hàm.
- **Chỉ mục tiền tố** - Đối với cột ký tự dài, có thể chỉ mục một phần đầu của chuỗi để tiết kiệm không gian chỉ mục.
- **Nguyên tắc khớp trái nhất** - Sắp xếp các cột có độ chọn lọc cao hoặc độ kardinal lớn ở đầu chỉ mục nhiều cột.
- Sử dụng chỉ mục để sắp xếp dữ liệu.
- ` = ` và `IN` có thể không tuân thủ thứ tự - Không cần quan tâm đến thứ tự của ` = `, `IN`, v.v.
- **Chỉ mục che phủ**
- **Sử dụng trường tự tăng làm khóa chính**

# Tối ưu hóa SQL

Sử dụng câu lệnh `EXPLAIN` để kiểm tra xem câu lệnh SQL hiện tại có sử dụng chỉ mục hay không, sau đó sử dụng chiến lược thực thi (`EXPLAIN`) để xem hiệu quả của việc tối ưu.

Các nguyên tắc cơ bản của tối ưu SQL:

- **Chỉ trả về các cột cần thiết** - Tốt nhất là không sử dụng câu lệnh `SELECT *`.
- **Chỉ trả về các hàng cần thiết** - Sử dụng câu lệnh con `WHERE` để lọc dữ liệu, đôi khi cần sử dụng câu lệnh `LIMIT` để giới hạn số lượng hàng trả về.
- **Lưu trữ dữ liệu truy vấn lặp lại trong bộ nhớ cache** - Nên xem xét việc sử dụng bộ nhớ cache ở phía khách hàng, tránh sử dụng bộ nhớ cache của máy chủ MySQL (với nhiều vấn đề và hạn chế).
- **Sử dụng chỉ mục để che phủ truy vấn**

### Tối ưu truy vấn `COUNT()`

`COUNT()` có hai tác dụng:

- Đếm số lượng giá trị trong một cột. Khi đếm giá trị cột, yêu cầu giá trị cột không phải là `NULL` và nó sẽ không đếm `NULL`.
- Đếm số lượng hàng.

**Khi đếm các giá trị cột, yêu cầu giá trị cột không phải là `NULL` và nó sẽ không đếm `NULL`**. Nếu xác nhận biểu thức trong dấu ngoặc không thể là rỗng, thực tế là đang thống kê số hàng. Đơn giản nhất là khi sử dụng `COUNT(*)`, nó không mở rộng thành tất cả các cột như chúng ta tưởng tượng, mà ngược lại, nó bỏ qua tất cả các cột và chỉ thống kê số hàng.

Hiểu lầm phổ biến nhất của chúng ta xuất hiện ở đây, khi chỉ định một cột trong dấu ngoặc và hy vọng kết quả là số hàng, và thông thường người ta sai lầm cho rằng hiệu suất của phương pháp này sẽ tốt hơn. Nhưng điều này không phải là sự thật, nếu muốn đếm số hàng, hãy sử dụng `COUNT(*)` trực tiếp để ý nghĩa rõ ràng và hiệu suất cao hơn.

(1) Tối ưu đơn giản:

```sql
SELECT count(*) FROM world.city WHERE id > 5;

SELECT (SELECT count(*) FROM world.city) - count(*)
FROM world.city WHERE id <= 5;
```

(2) Sử dụng giá trị xấp xỉ

Đôi khi, trong một số tình huống kinh doanh, không cần giá trị thống kê chính xác, có thể sử dụng giá trị xấp xỉ để thay thế. Số hàng trả về từ `EXPLAIN` là một giá trị xấp xỉ tốt, và việc thực hiện `EXPLAIN` không yêu cầu thực hiện truy vấn thực tế, do đó chi phí rất thấp. Thông thường, việc thực hiện `COUNT()` đòi hỏi quét qua nhiều hàng để lấy giá trị chính xác, vì vậy rất khó tối ưu, ngoại trừ việc sử dụng chỉ mục che phủ. Nếu không thể giải quyết vấn đề, chỉ có thể giải quyết từ mức kiến ​​trúc, ví dụ như thêm bảng tổng hợp hoặc sử dụng hệ thống cache bên ngoài như Redis.

### Tối ưu truy vấn liên kết

Trong các kịch bản dữ liệu lớn, liên kết bảng thông qua một trường trùng lặp sẽ có hiệu suất tốt hơn so với việc sử dụng `JOIN` trực tiếp.

Nếu thực sự cần sử dụng truy vấn liên kết, cần lưu ý:

- **Đảm bảo các cột trong mệnh đề `ON` và `USING` có chỉ mục**. Khi tạo chỉ mục, cần xem xét thứ tự liên kết. Khi bảng A và bảng B được liên kết bằng cột column, nếu trình tối ưu hóa liên kết theo thứ tự A, B, thì không cần tạo chỉ mục trên cột tương ứng của bảng A. Việc tạo chỉ mục không được sử dụng sẽ tạo ra gánh nặng bổ sung, thông thường, chỉ cần tạo chỉ mục trên cột tương ứng của bảng thứ hai trong thứ tự liên kết (lý do cụ thể được phân tích bên dưới).
- **Đảm bảo bất kỳ biểu thức nào trong `GROUP BY` và `ORDER BY` chỉ tham chiếu đến một cột trong một bảng**. Điều này cho phép MySQL sử dụng chỉ mục để tối ưu.

Để hiểu kỹ thuật tối ưu liên kết truy vấn, cần hiểu cách MySQL thực hiện truy vấn liên kết. **Chiến lược thực hiện liên kết hiện tại của MySQL rất đơn giản. Nó thực hiện liên kết lồng nhau** cho bất kỳ liên kết nào, tức là trước tiên lặp lại từng bản ghi trong một bảng, sau đó lặp lại từng bản ghi trong bảng tiếp theo để tìm các hàng khớp, và tiếp tục như vậy cho đến khi tìm thấy tất cả các hàng khớp trong tất cả các bảng. Sau đó, dựa trên các hàng khớp của các bảng, trả về các cột yêu cầu trong truy vấn.

Quá trừu tượng? Lấy ví dụ trên để minh họa, chẳng hạn, có một câu truy vấn như vậy:

```sql
SELECT A.xx,B.yy
FROM A INNER JOIN B USING(c)
WHERE A.xx IN (5,6)
```

Giả sử MySQL thực hiện phép liên kết theo thứ tự A, B trong câu truy vấn, sau đây là một đoạn mã giả để biểu diễn cách MySQL thực thi truy vấn này:

```ruby
outer_iterator = SELECT A.xx,A.c FROM A WHERE A.xx IN (5,6);
outer_row = outer_iterator.next;
while(outer_row) {
    inner_iterator = SELECT B.yy FROM B WHERE B.c = outer_row.c;
    inner_row = inner_iterator.next;
    while(inner_row) {
        output[inner_row.yy,outer_row.xx];
        inner_row = inner_iterator.next;
    }
    outer_row = outer_iterator.next;
}
```

Có thể thấy, truy vấn bên ngoài cùng được thực hiện dựa trên cột `A.xx`, nếu cột `A.c` có chỉ mục, truy vấn liên kết sẽ không sử dụng chỉ mục. Tiếp theo, xem xét truy vấn bên trong, rõ ràng cột `B.c` có chỉ mục, có thể tăng tốc truy vấn. Do đó, chỉ cần tạo chỉ mục trên cột tương ứng của bảng thứ hai trong thứ tự liên kết.

### Tối ưu `GROUP BY` và `DISTINCT`

Trình tối ưu hóa MySQL sẽ chuyển đổi hai loại truy vấn này khi xử lý nội bộ. Cả hai đều **có thể được tối ưu hóa bằng cách sử dụng chỉ mục, đây cũng là phương pháp tối ưu hiệu quả nhất**.

### Tối ưu `LIMIT`

Khi cần phân trang, thường sử dụng `LIMIT` kết hợp với `OFFSET`, cùng với một `ORDER BY` phù hợp. **Nếu có chỉ mục tương ứng, thường hiệu suất sẽ tốt, nếu không, MySQL sẽ phải thực hiện nhiều hoạt động sắp xếp tệp**.

Một vấn đề phổ biến là khi `OFFSET` rất lớn, ví dụ: `LIMIT 10000 20`, MySQL sẽ phải truy vấn 10020 hàng và chỉ trả về 20 hàng, 10000 hàng đầu tiên sẽ bị bỏ qua, điều này tốn kém.

Một cách đơn giản để tối ưu truy vấn này là sử dụng quét chỉ mục che phủ càng nhiều cột càng tốt, thay vì truy vấn tất cả các cột. Sau đó, dựa trên nhu cầu, thực hiện một truy vấn liên kết để trả về tất cả các cột. Đối với các `OFFSET` lớn, điều này sẽ cải thiện đáng kể hiệu suất. Xem ví dụ truy vấn sau:

```sql
SELECT film_id,description FROM film ORDER BY title LIMIT 50,5;
```

Nếu bảng này rất lớn, truy vấn này nên được thay thế bằng truy vấn sau:

```sql
SELECT film.film_id,film.description
FROM film INNER JOIN (
    SELECT film_id FROM film ORDER BY title LIMIT 50,5
) AS tmp USING(film_id);
```

Việc liên kết trì hoãn này sẽ cải thiện đáng kể hiệu suất truy vấn, cho phép MySQL quét ít trang hơn và chỉ truy vấn các bản ghi cần truy vấn dựa trên cột liên kết.

Có thể đôi khi nếu sử dụng dấu trang để ghi lại vị trí lấy dữ liệu lần trước, lần sau có thể quét trực tiếp từ vị trí được ghi lại trong dấu trang đó, điều này giúp tránh việc sử dụng `OFFSET`, ví dụ như câu truy vấn sau:

```sql
SELECT id FROM t LIMIT 10000, 10;
```

Tối ưu thành:

```sql
SELECT id FROM t WHERE id > 10000 LIMIT 10;
```

Các phương pháp tối ưu hóa khác còn bao gồm việc sử dụng bảng tổng hợp được tính toán trước, hoặc liên kết với một bảng dự phòng chỉ chứa các cột khóa chính và các cột cần được sắp xếp.

### Tối ưu UNION

MySQL luôn thực hiện truy vấn `UNION` bằng cách tạo và điền dữ liệu vào các bảng tạm. Do đó, nhiều chiến lược tối ưu không hoạt động tốt trong truy vấn `UNION`. Thường xuyên cần phải đẩy các mệnh đề như `WHERE`, `LIMIT`, `ORDER BY` xuống từng câu truy vấn con để cho phép bộ tối ưu hóa sử dụng điều kiện này để làm việc hiệu quả.

Trừ khi thực sự cần loại bỏ các bản ghi trùng lặp, nếu không, luôn sử dụng `UNION ALL`. Nếu không có từ khóa `ALL`, MySQL sẽ thêm tùy chọn `DISTINCT` vào bảng tạm, điều này sẽ làm cho toàn bộ bảng tạm phải kiểm tra tính duy nhất, điều này tốn kém.  Tuy nhiên, ngay cả khi sử dụng từ khóa ALL, MySQL vẫn đưa kết quả vào bảng tạm, sau đó đọc ra và trả về cho máy khách. Mặc dù trong nhiều trường hợp không cần thiết như vậy, ví dụ như có thể trực tiếp trả lại kết quả của mỗi câu lệnh con cho máy khách.

### Tối ưu cách thực hiện truy vấn

#### Chia nhỏ truy vấn lớn

Nếu một truy vấn lớn được thực hiện một lần, có thể khóa nhiều dữ liệu, làm đầy toàn bộ nhật ký giao dịch, sử dụng hết tài nguyên hệ thống và chặn nhiều truy vấn nhỏ nhưng quan trọng.

```sql
DELETE FROM messages WHERE create < DATE_SUB(NOW(), INTERVAL 3 MONTH);
```

```sql
rows_affected = 0
do {
    rows_affected = do_query(
    "DELETE FROM messages WHERE create  < DATE_SUB(NOW(), INTERVAL 3 MONTH) LIMIT 10000")
} while rows_affected > 0
```

#### Phân tách truy vấn liên kết lớn

Phân tách một truy vấn liên kết lớn (JOIN) thành nhiều truy vấn đơn bảng, sau đó kết hợp kết quả trong ứng dụng, có những lợi ích sau:

- Tăng hiệu suất của bộ nhớ cache. Trong trường hợp truy vấn liên kết, nếu một trong các bảng thay đổi, bộ nhớ cache của truy vấn toàn bộ không thể sử dụng. Tuy nhiên, khi phân tách thành nhiều truy vấn đơn bảng, ngay cả khi một trong các bảng thay đổi, bộ nhớ cache của các truy vấn khác vẫn có thể được sử dụng.
- Phân tách thành nhiều truy vấn đơn bảng, các kết quả của các truy vấn này có thể được sử dụng lại bởi các truy vấn khác, giảm số lượng truy vấn lặp lại.
- Giảm sự cạnh tranh khóa.
- Dễ dàng phân tách cơ sở dữ liệu, dễ dàng đạt được hiệu suất cao và khả năng mở rộng.
- Có thể cải thiện hiệu suất của truy vấn. Ví dụ, thay vì sử dụng truy vấn liên kết ngẫu nhiên, sử dụng IN() có thể cho phép MySQL thực hiện truy vấn theo thứ tự ID, điều này có thể hiệu quả hơn việc thực hiện truy vấn liên kết ngẫu nhiên.

```sql
SELECT * FROM tag
JOIN tag_post ON tag_post.tag_id=tag.id
JOIN post ON tag_post.post_id=post.id
WHERE tag.tag='mysql';
```

```sql
SELECT * FROM tag WHERE tag='mysql';
SELECT * FROM tag_post WHERE tag_id=1234;
SELECT * FROM post WHERE post.id IN (123,456,567,9098,8904);
```

## Kế hoạch thực thi (EXPLAIN)

Làm thế nào để xác định xem câu lệnh SQL hiện tại có sử dụng chỉ mục hay không? Làm thế nào để kiểm tra xem SQL đã được tối ưu sau khi chỉnh sửa hay chưa?

Trong SQL, bạn có thể sử dụng kế hoạch thực thi (`EXPLAIN`) để phân tích hiệu suất của truy vấn SELECT.

```sql
mysql> explain select * from user_info where id = 2\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: user_info
   partitions: NULL
         type: const
possible_keys: PRIMARY
          key: PRIMARY
      key_len: 8
          ref: const
         rows: 1
     filtered: 100.00
        Extra: NULL
1 row in set, 1 warning (0.00 sec)
```

Giải thích các tham số của `EXPLAIN`:

- `id`: Định danh của truy vấn SELECT. Mỗi truy vấn SELECT sẽ được gán một định danh duy nhất.
- `select_type` ⭐ : Loại truy vấn SELECT.
	- `SIMPLE`: Đại diện cho truy vấn không chứa UNION hoặc subquery.
	- `PRIMARY`: Đại diện cho truy vấn ngoại vi nhất.
	- `UNION`: Đại diện cho truy vấn UNION thứ hai trở đi.
	- `DEPENDENT UNION`: Đại diện cho truy vấn UNION phụ thuộc vào truy vấn bên ngoài.
	- `UNION RESULT`: Kết quả của truy vấn UNION.
	- `SUBQUERY`: Truy vấn con đầu tiên trong subquery.
	- `DEPENDENT SUBQUERY`: Truy vấn con đầu tiên trong subquery, phụ thuộc vào truy vấn bên ngoài. Nghĩa là subquery phụ thuộc vào kết quả của truy vấn bên ngoài.
- `table`: Bảng mà truy vấn đang truy vấn, nếu có đặt tên bảng thì hiển thị tên đó.
- `partitions`: Phân vùng khớp.
- `type` ⭐ : Cách thực hiện truy vấn từ bảng để tìm hàng, loại truy vấn là một chỉ số quan trọng trong tối ưu SQL, giá trị kết quả từ tốt đến xấu lần lượt là: system > const > eq_ref > ref > range > index > ALL.
	- `system`/`const`: Chỉ có một hàng trong bảng khớp, trong trường hợp này, truy vấn chỉ cần truy vấn một lần để tìm dữ liệu tương ứng. Nếu sử dụng chỉ mục B + cây, chúng ta biết rằng chỉ mục được xây dựng thành nhiều cấp cây, khi chỉ mục được truy vấn ở tầng dưới cùng, hiệu suất truy vấn sẽ càng kém.
	- `eq_ref`: Sử dụng quét chỉ mục duy nhất, phổ biến trong trường hợp kết nối nhiều bảng sử dụng khóa chính và chỉ mục duy nhất làm điều kiện kết nối.
	- `ref`: Quét chỉ mục không duy nhất, cũng có thể thấy trong trường hợp sử dụng quét chỉ mục duy nhất bên trái.
	- `range`: Quét phạm vi chỉ mục, ví dụ: <, >, between, v.v.
	- `index`: Quét toàn bộ chỉ mục, trong trường hợp này, duyệt qua toàn bộ cây chỉ mục.
	- `ALL`: Đại diện cho việc quét toàn bộ bảng, cần duyệt qua toàn bộ bảng để tìm hàng tương ứng.
- `possible_keys`: Chỉ mục có thể sử dụng trong truy vấn này.
- `key` ⭐ : Chỉ mục thực sự được sử dụng trong truy vấn này.
- `ref`: Cột hoặc hằng số nào được sử dụng cùng với khóa.
- `rows` ⭐ : Số hàng đã quét trong truy vấn này, đây là một ước tính.
- `filtered`: Phần trăm dữ liệu được lọc bởi điều kiện truy vấn.
- `extra`: Thông tin bổ sung.

## optimizer trace

Trong phiên bản MySQL 5.6 trở lên, chúng ta có thể sử dụng tính năng truy vấn trình tối ưu hóa để xem quá trình tạo kế hoạch thực thi của trình tối ưu hóa. Với tính năng này, chúng ta không chỉ có thể hiểu quá trình lựa chọn của trình tối ưu hóa, mà còn có thể hiểu chi phí của mỗi phần thực thi và từ đó tối ưu hóa truy vấn.

Như đoạn mã dưới đây, sau khi bật tính năng truy vấn trình tối ưu hóa, chúng ta có thể thực thi truy vấn SQL và sau đó truy vấn bảng information_schema.OPTIMIZER_TRACE để xem kế hoạch thực thi. Cuối cùng, chúng ta có thể tắt tính năng truy vấn trình tối ưu hóa:

```sql
SET optimizer_trace="enabled=on";
SELECT * FROM person WHERE NAME >'name84059' AND create_time>'2020-01-24 05:00';
SELECT * FROM information_schema.OPTIMIZER_TRACE;
SET optimizer_trace="enabled=off";
```

## Mô hình dữ liệu và kinh doanh

- Trong trường hợp các trường bảng phức tạp, dễ thay đổi và khó thống nhất, chúng ta có thể xem xét sử dụng NoSQL thay thế lưu trữ bảng cơ sở dữ liệu quan hệ, ví dụ như ElasticSearch, MongoDB.
- Trong trường hợp truy vấn trong môi trường đồng thời cao, chúng ta có thể sử dụng bộ nhớ cache (như Redis) thay thế các hoạt động cơ sở dữ liệu, tăng cường hiệu suất đồng thời.
- Đối với các bảng có tốc độ tăng dữ liệu nhanh chóng, cần xem xét phân chia ngang hoặc phân chia cơ sở dữ liệu để tránh hạn chế hiệu suất của việc làm việc chỉ với một bảng duy nhất.
- Ngoài ra, chúng ta nên tối ưu hóa bằng cách tránh các truy vấn JOIN phức tạp, ví dụ như sao chép một số trường để giảm số lượng truy vấn JOIN; tạo các bảng trung gian để giảm số lượng truy vấn JOIN.
