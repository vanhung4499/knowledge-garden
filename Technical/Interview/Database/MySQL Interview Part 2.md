---
title: MySQL Interview Part 2
tags: [interview, db, mysql]
categories: [interview, db, mysql]
date created: 2023-08-19
date modified: 2023-08-19
---

# MySQL Interview Part 2

## Khóa chính, siêu khóa, khóa dự tuyển và khóa ngoại trong cơ sở dữ liệu là gì?

- **Super key** (siêu khóa): Trong một mô hình quan hệ, tập hợp các thuộc tính của bộ dữ liệu mà có thể duy nhất xác định một bộ dữ liệu được gọi là siêu khóa của mô hình quan hệ.
    
- **Candidate key** (khóa ứng viên): Siêu khóa không chứa các thuộc tính dư thừa được gọi là khóa ứng cử viên. Nghĩa là trong khóa ứng cử viên, nếu loại bỏ một thuộc tính, nó sẽ không còn là khóa nữa!
    
- **Primary key** (khóa chính): Một khóa ứng cử viên được chọn bởi người dùng để định danh duy nhất cho một bộ dữ liệu được gọi là khóa chính.
    
- **Foreign key** (khóa ngoại): Nếu thuộc tính K trong mô hình R là khóa chính của mô hình khác, thì K được gọi là khóa ngoại trong mô hình R.

**Ví dụ**:  
**Ví dụ**:

|Mã sinh viên|Họ và tên|Giới tính|Tuổi|Khoa|Ngành học|
|---|---|---|---|---|---|
|20020612|Lê Hiệu|Nam|20|Công nghệ thông tin|Phát triển phần mềm|
|20060613|Trần Văn|Nam|18|Công nghệ thông tin|Phát triển phần mềm|
|20060614|Nguyễn Thị|Nữ|19|Vật lý|Cơ học|
|20060615|Lê Thị|Nữ|17|Sinh học|Động vật học|
|20060616|Trần Thị|Nam|21|Hóa học|Hóa học thực phẩm|
|20060617|Trần Thị|Nữ|20|Sinh học|Thực vật học|

1. Siêu khóa: Từ ví dụ, chúng ta có thể thấy Mã sinh viên là một định danh duy nhất của thực thể sinh viên. Vì vậy, siêu khóa của bộ dữ liệu đó là Mã sinh viên. Ngoài ra, chúng ta có thể kết hợp nó với các thuộc tính khác, ví dụ: (Mã sinh viên, Giới tính), (Mã sinh viên, Tuổi).
2. Khóa ứng cử viên: Dựa trên ví dụ, Mã sinh viên là một khóa ứng cử viên, thực tế, khóa ứng cử viên là một phần con của siêu khóa, ví dụ: (Mã sinh viên, Tuổi) là siêu khóa, nhưng nó không phải là khóa ứng cử viên vì nó có thêm thuộc tính phụ.
3. Khóa chính: Đơn giản nói, khóa ứng cử viên của bộ dữ liệu trong ví dụ là Mã sinh viên, nhưng chúng ta chọn nó làm định danh duy nhất cho bộ dữ liệu đó, vì vậy Mã sinh viên là khóa chính.
4. Khóa ngoại là đối với khóa chính, ví dụ trong bảng sinh viên, khóa chính là Mã sinh viên, trong bảng điểm số cũng có trường Mã sinh viên, vì vậy Mã sinh viên là khóa ngoại của bảng điểm số, là khóa chính của bảng sinh viên.

**Khóa chính là tập con của khóa ứng viên, khóa ứng viên là tập con của siêu khóa và việc xác định khóa ngoại có liên quan đến khóa chính.**

## Phân tích chi tiết ba hình thức chuẩn hóa cơ sở dữ liệu

### **Hình thức chuẩn hóa 1NF**

Trong một cơ sở dữ liệu quan hệ, hình thức chuẩn hóa 1NF (First Normal Form) là yêu cầu cơ bản đối với mô hình quan hệ, một cơ sở dữ liệu không đáp ứng được hình thức chuẩn hóa 1NF (1NF) không được coi là cơ sở dữ liệu quan hệ. Hình thức chuẩn hóa 1NF (1NF) đòi hỏi mỗi cột trong bảng cơ sở dữ liệu là một mục dữ liệu không thể chia nhỏ, không thể có nhiều giá trị trong cùng một cột, nghĩa là một thuộc tính trong thực thể không thể có nhiều giá trị hoặc thuộc tính không thể có thuộc tính trùng lặp.

Nếu có thuộc tính trùng lặp, có thể cần định nghĩa một thực thể mới, thực thể mới được tạo thành từ các thuộc tính trùng lặp và có mối quan hệ một-nhiều với thực thể gốc. Trong hình thức chuẩn hóa 1NF (1NF), mỗi hàng trong bảng chỉ chứa thông tin của một thực thể.

Nói một cách đơn giản, **hình thức chuẩn hóa 1NF là không có cột trùng lặp**.

### **Hình thức chuẩn hóa 2NF**

Hình thức chuẩn hóa 2NF (Second Normal Form) được xây dựng trên cơ sở của hình thức chuẩn hóa 1NF (1NF), có nghĩa là để đáp ứng hình thức chuẩn hóa 2NF (2NF), cần phải đáp ứng hình thức chuẩn hóa 1NF (1NF) trước. Hình thức chuẩn hóa 2NF (2NF) yêu cầu mỗi hàng hoặc bản ghi trong bảng cơ sở dữ liệu phải có thể phân biệt được duy nhất.

Để đạt được sự phân biệt, thường cần thêm một cột vào bảng để lưu trữ khóa chính duy nhất của mỗi bản ghi. Cột thuộc tính duy nhất này được gọi là khóa chính hoặc khóa chính. Hình thức chuẩn hóa 2NF (2NF) yêu cầu thuộc tính của thực thể phụ thuộc hoàn toàn vào khóa chính.

Nghĩa là không thể có thuộc tính phụ thuộc vào một phần của khóa chính. Nếu có, thuộc tính đó cùng với một phần của khóa chính nên được tách ra để tạo thành một thực thể mới, thực thể mới có mối quan hệ một-nhiều với thực thể gốc. Để đạt được sự phân biệt, thường cần thêm một cột vào bảng để lưu trữ khóa chính duy nhất của mỗi bản ghi.

Nói một cách đơn giản, **hình thức chuẩn hóa 2NF là thuộc tính không phụ thuộc vào một phần của khóa chính**.

### **Hình thức chuẩn hóa 3NF**

Để đáp ứng hình thức chuẩn hóa 3NF (Third Normal Form), cần phải đáp ứng hình thức chuẩn hóa 2NF (2NF) trước. Nói một cách đơn giản, hình thức chuẩn hóa 3NF (3NF) yêu cầu một bảng cơ sở dữ liệu không chứa thông tin không phải là thuộc tính chính trong bất kỳ bảng nào khác.

Ví dụ, nếu có một bảng thông tin phòng ban, trong đó mỗi phòng ban có mã phòng ban (dept_id), tên phòng ban và mô tả phòng ban. Sau đó không thể thêm tên phòng ban, mô tả phòng ban và các thông tin liên quan đến phòng ban vào bảng thông tin nhân viên. Nếu không có bảng thông tin phòng ban, cũng cần xây dựng nó theo hình thức chuẩn hóa 3NF (3NF) để tránh sự trùng lặp dữ liệu.

Nói một cách đơn giản, **hình thức chuẩn hóa 3NF là thuộc tính không phụ thuộc vào bất kỳ thuộc tính không phải là khóa chính khác**.

## Tóm tắt về ba hình thức chuẩn hóa cơ sở dữ liệu

### (1) Tóm tắt đơn giản:

- Hình thức chuẩn hóa 1NF (First Normal Form - 1NF): Các trường không thể phân chia.
- Hình thức chuẩn hóa 2NF (Second Normal Form - 2NF): Có khóa chính và các trường không phải khóa chính phụ thuộc vào khóa chính.
- Hình thức chuẩn hóa 3NF (Third Normal Form - 3NF): Các trường không phụ thuộc vào các trường không phải khóa chính.

### (2) Giải thích:

- 1NF: Tính nguyên tử. Các trường không thể phân chia thành các phần nhỏ hơn, nếu không sẽ không phải là cơ sở dữ liệu quan hệ.
- 2NF: Tính duy nhất. Một bảng chỉ miêu tả một thực thể duy nhất.
- 3NF: Mỗi trường có mối quan hệ trực tiếp với khóa chính, không có sự phụ thuộc chéo.

## Sự khác biệt giữa hai công cụ MySQL phổ biến: InnoDB và MyISAM? Và các trường hợp sử dụng tương ứng là gì?

1) Giao dịch: MyISAM không hỗ trợ, InnoDB hỗ trợ.

2) Cấp độ khóa: MyISAM sử dụng khóa cấp bảng, InnoDB sử dụng khóa cấp hàng và ràng buộc khóa ngoại.

3) MyISAM lưu trữ tổng số hàng trong bảng; InnoDB không lưu trữ tổng số hàng.

4) MyISAM sử dụng chỉ mục phi tập trung, các lá của cây B + lưu trữ con trỏ đến tệp dữ liệu. InnoDB sử dụng chỉ mục cụm, các lá của cây B + lưu trữ dữ liệu.

**Các trường hợp sử dụng:**  

- MyISAM thích hợp: Thêm không thường xuyên, truy vấn rất thường xuyên, nếu có nhiều truy vấn SELECT, MyISAM là lựa chọn tốt hơn, không có giao dịch.  
- InnoDB thích hợp: Yêu cầu đáng tin cậy cao hoặc yêu cầu giao dịch; Cập nhật và truy vấn bảng diễn ra cùng một mức độ thường xuyên; Số lượng lớn INSERT hoặc UPDATE.

## Bốn tính chất của giao dịch (ACID): Tính nguyên tử, tính nhất quán, tính cô lập và tính bền vững?

### **Cách trả lời thứ nhất**

**Tính nguyên tử (Atomicity)**: Tất cả các hoạt động trong một giao dịch phải được thực hiện hoàn toàn hoặc không được thực hiện. Nếu trong quá trình thực hiện giao dịch xảy ra lỗi, giao dịch sẽ được phục hồi (rollback) về trạng thái trước khi giao dịch bắt đầu, giống như giao dịch chưa được thực hiện bao giờ.

**Tính nhất quán (Consistency)**: Trước và sau khi giao dịch kết thúc, tính toàn vẹn của cơ sở dữ liệu không được vi phạm. Điều này có nghĩa là dữ liệu được ghi vào phải tuân thủ tất cả các quy tắc đã được định nghĩa trước, bao gồm độ chính xác, tính liên kết và công việc sau đó của cơ sở dữ liệu phải được thực hiện một cách tự động.

**Tính cô lập (Isolation)**: Cơ sở dữ liệu cho phép nhiều giao dịch cùng thời điểm truy cập và thay đổi dữ liệu, nhưng mỗi giao dịch phải hoạt động độc lập mà không bị ảnh hưởng bởi các giao dịch khác. Điều này đảm bảo rằng các giao dịch không giao cắt nhau và không gây ra sự không nhất quán trong dữ liệu.

**Tính bền vững (Durability)**: Sau khi giao dịch hoàn thành và được xác nhận, các thay đổi trong dữ liệu phải được lưu trữ một cách bền vững và không bị mất đi ngay cả khi xảy ra sự cố hệ thống như mất điện hoặc lỗi phần cứng. Điều này đảm bảo rằng dữ liệu đã được ghi vào sẽ không bị mất và có thể được khôi phục sau khi hệ thống hoạt động lại.

### **Câu trả lời thứ hai**

Tính nguyên tử (Atomicity)

* Tính nguyên tử đề cập đến việc tất cả các hoạt động trong giao dịch phải thành công hoàn toàn hoặc thất bại và hoàn tác hoàn toàn. Do đó, nếu các hoạt động trong giao dịch thành công, chúng phải được áp dụng hoàn toàn vào cơ sở dữ liệu. Nếu hoạt động thất bại, không được ảnh hưởng đến cơ sở dữ liệu.

Tính nhất quán (Consistency)

* Tính nhất quán đảm bảo rằng tính toàn vẹn của cơ sở dữ liệu không bị vi phạm trước và sau khi giao dịch bắt đầu và kết thúc. Ví dụ, khi A chuyển tiền cho B, không thể A bị trừ tiền mà B không nhận được.

Tính cô lập (Isolation)

* Tính cô lập đảm bảo rằng khi nhiều người dùng truy cập cơ sở dữ liệu đồng thời, ví dụ như thao tác trên cùng một bảng, giao dịch của mỗi người dùng không bị ảnh hưởng bởi các hoạt động của giao dịch khác. Các giao dịch đồng thời không tác động lẫn nhau. Ví dụ, trong khi A đang rút tiền từ một tài khoản ngân hàng, B không thể chuyển tiền vào tài khoản đó cho đến khi A hoàn thành việc rút tiền.

Tính bền vững (Durability)

* Tính bền vững đảm bảo rằng khi một giao dịch được gửi đi, các thay đổi dữ liệu trong cơ sở dữ liệu là vĩnh viễn, ngay cả khi hệ thống cơ sở dữ liệu gặp sự cố.

## Sự khác biệt giữa hai hàm NOW() và CURRENT_DATE() trong SQL là gì?

Hàm NOW() trong SQL được sử dụng để hiển thị ngày, tháng, năm, giờ, phút và giây hiện tại.  
Hàm CURRENT_DATE() chỉ hiển thị ngày, tháng và năm hiện tại.

Vì vậy, khác biệt chính giữa hai hàm này là NOW() trả về cả ngày và giờ hiện tại, trong khi CURRENT_DATE() chỉ trả về ngày hiện tại.

## 33. Khái niệm về chỉ mục phân cụm (clustered index) là gì?

Chỉ mục phân cụm (clustered index) là một cách sắp xếp dữ liệu trong cơ sở dữ liệu theo một trật tự nhất định. Ví dụ, trong từ điển tiếng Trung, trật tự của các từ được sắp xếp theo bảng chữ cái Latinh. Khi tìm kiếm một từ, chúng ta có thể nhanh chóng tìm thấy nó bằng cách tra cứu theo trật tự chữ cái.

Chỉ mục phân cụm giúp tìm kiếm và truy xuất dữ liệu nhanh chóng vì dữ liệu đã được sắp xếp theo một trật tự cụ thể. Nó tạo ra một liên kết trực tiếp giữa chỉ mục và dữ liệu, giúp giảm thời gian tìm kiếm và truy xuất dữ liệu.

## 34. Khái niệm về chỉ mục không phân cụm (non-clustered index) là gì?

Chỉ mục không phân cụm (non-clustered index) là một cách sắp xếp dữ liệu trong cơ sở dữ liệu dựa trên một thuộc tính khác không phải là trật tự chính. Ví dụ, trong từ điển, chúng ta có thể tìm kiếm một từ bằng cách tra cứu theo bộ phận chính của từ (như bộ phận bên trái).

Chỉ mục không phân cụm giúp tìm kiếm và truy xuất dữ liệu nhanh chóng bằng cách tạo ra một liên kết giữa chỉ mục và dữ liệu. Khi tìm kiếm một từ, chúng ta trước tiên tìm kiếm trong chỉ mục không phân cụm để xác định vị trí của từ trong dữ liệu, sau đó truy xuất dữ liệu từ vị trí đã xác định.

## 35. Sự khác biệt giữa chỉ mục phân cụm và chỉ mục không phân cụm là gì?

Sự khác biệt giữa chỉ mục phân cụm và chỉ mục không phân cụm là:

- Chỉ mục phân cụm sắp xếp dữ liệu theo một trật tự cụ thể, trong khi chỉ mục không phân cụm sắp xếp dữ liệu dựa trên một thuộc tính khác không phải là trật tự chính.
- Chỉ mục phân cụm tạo ra một liên kết trực tiếp giữa chỉ mục và dữ liệu, trong khi chỉ mục không phân cụm tạo ra một liên kết giữa chỉ mục và vị trí của dữ liệu.
- Chỉ mục phân cụm thường được sử dụng để tìm kiếm và truy xuất dữ liệu nhanh chóng, trong khi chỉ mục không phân cụm thường được sử dụng để tìm kiếm dữ liệu dựa trên một thuộc tính khác không phải là trật tự chính.

## 36. Cần lưu ý những điều gì khi tạo chỉ mục?

Khi tạo chỉ mục, cần lưu ý những điều sau:

- Đảm bảo rằng các trường được chỉ định là NOT NULL, trừ khi bạn muốn lưu trữ giá trị NULL. Các trường có giá trị NULL làm phức tạp quá trình tối ưu hóa truy vấn và tạo chỉ mục.
- Ưu tiên tạo chỉ mục cho các trường có giá trị phân tán lớn (khác biệt giữa các giá trị). Bạn có thể sử dụng hàm COUNT() để xem số lượng giá trị khác nhau của một trường. Càng nhiều giá trị khác nhau, trường hợp phân tán càng cao.
- Kích thước của chỉ mục càng nhỏ càng tốt. Dữ liệu được lưu trữ theo trang, nên kích thước chỉ mục càng nhỏ, thì số lượng trang cần truy cập để tìm kiếm dữ liệu càng ít, tăng hiệu suất truy vấn.
- Cân nhắc tạo chỉ mục cho các trường duy nhất, không rỗng và thường xuyên được truy vấn.

## 37. Sự khác biệt giữa CHAR và VARCHAR trong MySQL là gì?

Có một số khác biệt quan trọng giữa CHAR và VARCHAR trong MySQL:

1. Độ dài: Độ dài của CHAR là không thay đổi và được lấp đầy bằng khoảng trắng để đạt đến độ dài được chỉ định, trong khi VARCHAR có độ dài có thể thay đổi.
2. Hiệu suất: CHAR có hiệu suất tốt hơn so với VARCHAR. Vì độ dài của CHAR là không thay đổi, việc truy xuất dữ liệu từ cột CHAR nhanh hơn so với VARCHAR.
3. Lưu trữ: CHAR lưu trữ dữ liệu theo cách sau: mỗi ký tự tiếng Anh (ASCII) chiếm 1 byte, mỗi ký tự tiếng Trung chiếm 2 byte. VARCHAR lưu trữ dữ liệu theo cách sau: mỗi ký tự tiếng Anh chiếm 2 byte, mỗi ký tự tiếng Trung cũng chiếm 2 byte.

Vì vậy, khi sử dụng CHAR và VARCHAR, bạn cần xem xét độ dài của dữ liệu và hiệu suất truy xuất để chọn loại dữ liệu phù hợp. Nếu độ dài của dữ liệu thay đổi và bạn cần tối ưu hiệu suất, thì VARCHAR có thể là lựa chọn tốt hơn. Tuy nhiên, nếu độ dài của dữ liệu không thay đổi và hiệu suất là yếu tố quan trọng, thì CHAR có thể là lựa chọn tốt hơn.

## Lưu ý khi sử dụng chỉ mục trong MySQL

Chỉ mục trong MySQL thường được sử dụng để cải thiện tốc độ tìm kiếm các hàng dữ liệu phù hợp với điều kiện WHERE. Trong quá trình sử dụng chỉ mục, có một số chi tiết và lưu ý cần chú ý.

Hàm, phép tính, toán tử phủ định, điều kiện kết nối, nhiều chỉ mục đơn cột, nguyên tắc tiền tố trái nhất, truy vấn phạm vi, không chứa cột có giá trị NULL, không sử dụng hàm và phép tính trên cột trong câu lệnh LIKE.

### **1) Không sử dụng hàm trên cột, điều này sẽ làm mất hiệu quả của chỉ mục và thực hiện quét toàn bộ bảng.**

```sql
select * from news where year(publish_time) < 2017
```

Để sử dụng chỉ mục và tránh quét toàn bộ bảng, bạn có thể thay đổi câu lệnh như sau.

```sql
select * from news where publish_time < '2017-01-01'
```

Một lưu ý khác là không nên thực hiện phép tính trên cột, điều này cũng sẽ làm mất hiệu quả của chỉ mục và thực hiện quét toàn bộ bảng.

```sql
select * from news where id / 100 = 1
```

Để sử dụng chỉ mục và tránh quét toàn bộ bảng, bạn có thể thay đổi câu lệnh như sau.

```sql
select * from news where id = 1 * 100
```

### **2) Tránh sử dụng các toán tử phủ định như !=, not in hoặc <>**

Nên tránh sử dụng các toán tử phủ định như !=, not in hoặc <> trong mệnh đề WHERE, vì các toán tử này sẽ làm mất hiệu quả của chỉ mục và thực hiện quét toàn bộ bảng. Nên tránh sử dụng or để kết nối các điều kiện.

```sql
select * from news where id = 1 or id = 2
```

### **3) Nhiều chỉ mục đơn cột không phải là lựa chọn tốt nhất**

MySQL chỉ có thể sử dụng một chỉ mục, nó sẽ chọn một chỉ mục có ràng buộc nghiêm ngặt nhất từ nhiều chỉ mục. Do đó, việc tạo nhiều chỉ mục đơn cột cho nhiều cột không cải thiện hiệu suất truy vấn của MySQL.  
Giả sử, có hai chỉ mục đơn cột, lần lượt là news_year_idx(news_year) và news_month_idx(news_month). Bây giờ, có một tình huống cần truy vấn theo năm và tháng của tin tức, câu lệnh SQL có thể được viết như sau:

```sql
select * from news where news_year = 2017 and news_month = 1
```

Thực tế, MySQL chỉ có thể sử dụng một chỉ mục đơn cột. Để cải thiện hiệu suất, bạn có thể sử dụng chỉ mục kết hợp news_year_month_idx(news_year, news_month) để đảm bảo cả hai cột news_year và news_month đều được bao phủ bởi chỉ mục.

### **4) Nguyên tắc tiền tố trái nhất của chỉ mục kết hợp**

Chỉ mục kết hợp tuân theo nguyên tắc "tiền tố trái nhất", có nghĩa là chỉ khi điều kiện truy vấn sử dụng cột đầu tiên của chỉ mục kết hợp, chỉ mục mới được sử dụng. Do đó, thứ tự cột chỉ mục rất quan trọng. Nếu không tìm kiếm từ cột đầu tiên của chỉ mục, chỉ mục sẽ không được sử dụng.  
Giả sử, có một tình huống chỉ cần truy vấn theo tháng của tin tức, câu lệnh SQL có thể được viết như sau:

```sql
select * from news where news_month = 1
```

Trong trường hợp này, chỉ mục news_year_month_idx(news_year, news_month) sẽ không được sử dụng, vì nó tuân theo nguyên tắc "tiền tố trái nhất" và không sử dụng cột đầu tiên của chỉ mục trong điều kiện truy vấn.

### **5) Lợi ích của chỉ mục bao gồm**

Nếu một chỉ mục chứa tất cả các giá trị cần thiết cho các truy vấn, có thể trả về dữ liệu dựa trên kết quả truy vấn chỉ mục mà không cần đọc bảng, điều này có thể cải thiện đáng kể hiệu suất. Do đó, bạn có thể định nghĩa một cách để chỉ mục chứa các cột bổ sung mà không cần thiết cho chỉ mục.

### **6) Ảnh hưởng của truy vấn phạm vi đối với truy vấn nhiều cột**

Nếu một cột trong truy vấn có truy vấn phạm vi, tất cả các cột bên phải của nó đều không thể sử dụng chỉ mục để tối ưu hóa tìm kiếm. Ví dụ, nếu có một tình huống cần tìm kiếm các bài viết tin tức được xuất bản trong tuần này, với điều kiện là phải ở trạng thái đã kích hoạt và thời gian xuất bản trong tuần này. Vì vậy, câu lệnh SQL có thể được viết như sau:

```sql
select * from news where publish_time >= '2017-01-02' and publish_time <= '2017-01-08' and enable = 1
```

Trong trường hợp này, vì ảnh hưởng của truy vấn phạm vi đối với truy vấn nhiều cột, chỉ mục news_publish_idx(publish_time, enable) sẽ không thể sử dụng các cột bên phải của publish_time để tối ưu hóa tìm kiếm. Nói cách khác, chỉ mục news_publish_idx(publish_time, enable) tương đương với chỉ mục news_publish_idx(publish_time).  
Đối với trường hợp này, đề xuất của tôi là: đối với truy vấn phạm vi, hãy chú ý đến tác động của nó và cố gắng tránh sử dụng truy vấn phạm vi càng ít càng tốt, bạn có thể đáp ứng yêu cầu kinh doanh bằng cách sử dụng các phương pháp giải quyết khác.  
Ví dụ, yêu cầu trên là tìm kiếm các bài viết tin tức được xuất bản trong tuần này, vì vậy bạn có thể tạo một trường news_weekth để lưu trữ thông tin tuần của bài viết tin tức, từ đó biến truy vấn phạm vi thành truy vấn thông thường, câu lệnh SQL có thể được thay đổi thành:

```sql
select * from news where news_weekth = 1 and enable = 1
```

Tuy nhiên, không phải truy vấn phạm vi nào cũng có thể được thay đổi, đối với những truy vấn phạm vi bắt buộc nhưng không thể thay đổi, đề xuất của tôi là: không cần phải cố gắng giải quyết tất cả các vấn đề bằng SQL, bạn có thể sử dụng các công nghệ lưu trữ dữ liệu khác để kiểm soát dòng thời gian, ví dụ như Redis SortedSet hoặc tăng cường hiệu suất bằng cách lưu kết quả truy vấn vào bộ nhớ đệm.

### **7) Chỉ mục không bao gồm các cột có giá trị NULL**

Chỉ mục không bao gồm các cột có giá trị NULL. Nếu một cột chứa giá trị NULL, nó sẽ không được bao gồm trong chỉ mục. Đối với chỉ mục kết hợp, nếu một cột bất kỳ có giá trị NULL, chỉ mục sẽ không có hiệu lực đối với chỉ mục kết hợp này.  
Vì vậy, trong thiết kế cơ sở dữ liệu, trừ khi có một lý do đặc biệt để sử dụng giá trị NULL, hãy tránh đặt giá trị mặc định của cột là NULL.

### **8) Ảnh hưởng của chuyển đổi ngầm đối với chỉ mục**

Khi hai bên của điều kiện truy vấn không khớp về kiểu dữ liệu, chuyển đổi ngầm sẽ xảy ra, ảnh hưởng của chuyển đổi ngầm có thể làm mất hiệu quả của chỉ mục và thực hiện quét toàn bộ bảng. Trong ví dụ dưới đây, date_str là một chuỗi, nhưng nó được so sánh với một số nguyên, dẫn đến chuyển đổi ngầm.

```sql
select * from news where date_str = 201701
```

Vì vậy, hãy nhớ rằng chuyển đổi ngầm có thể gây hại, hãy luôn luôn chú ý so sánh với cùng kiểu dữ liệu.

### **9) Vấn đề mất hiệu quả của chỉ mục trong câu lệnh LIKE**

Câu lệnh LIKE trong truy vấn, khi sử dụng LIKE "value%", có thể sử dụng chỉ mục, nhưng với cách sử dụng LIKE "%value%", sẽ thực hiện truy vấn toàn bộ bảng. Trong bảng có số lượng dữ liệu nhỏ, không có vấn đề về hiệu suất, nhưng đối với dữ liệu lớn, việc quét toàn bộ bảng là một việc đáng sợ. Vì vậy, dựa trên yêu cầu kinh doanh, hãy xem xét việc sử dụng ElasticSearch hoặc Solr là một giải pháp tốt.

## MySQL có những loại chỉ mục nào? Có những đặc điểm gì?

- **Chỉ mục thông thường**: Chỉ tăng tốc độ truy vấn.
- **Chỉ mục duy nhất**: Tăng tốc độ truy vấn + giá trị cột duy nhất (có thể có giá trị null).
- **Chỉ mục khóa chính**: Tăng tốc độ truy vấn + giá trị cột duy nhất (không thể có giá trị null) + chỉ có một trong bảng.
- **Chỉ mục kết hợp**: Chỉ mục được tạo từ nhiều cột, được sử dụng đặc biệt cho tìm kiếm kết hợp, hiệu suất của nó cao hơn việc kết hợp chỉ mục.
- **Chỉ mục toàn văn**: Phân tích nội dung văn bản thành từ khóa và tìm kiếm.
- **Kết hợp chỉ mục**: Sử dụng nhiều chỉ mục đơn cột để tìm kiếm kết hợp.
- **Chỉ mục che phủ**: Các cột được chọn trong câu lệnh SELECT chỉ cần được lấy từ chỉ mục, không cần đọc hàng dữ liệu.
- **Chỉ mục phân cụm**: Dữ liệu bảng được lưu trữ cùng với khóa chính, các nút lá của chỉ mục chính lưu trữ dữ liệu hàng (bao gồm giá trị khóa chính), các nút lá của chỉ mục thứ cấp lưu trữ giá trị khóa chính của hàng. Sử dụng cây B+ làm cấu trúc lưu trữ chỉ mục, các nút không phải lá đều là từ khóa chỉ mục, nhưng không lưu trữ nội dung cụ thể hoặc địa chỉ nội dung tương ứng. Dữ liệu trên nút lá là khóa chính và bản ghi cụ thể (nội dung dữ liệu).

## Vì sao không tạo chỉ mục cho mỗi cột trong bảng nếu chỉ mục có nhiều ưu điểm?

- Khi thêm, xóa hoặc sửa dữ liệu trong bảng, **chỉ mục cũng phải được cập nhật động**, làm giảm tốc độ bảo trì dữ liệu.
- **Chỉ mục chiếm không gian vật lý**, ngoài không gian dữ liệu của bảng, mỗi chỉ mục còn chiếm một không gian vật lý nhất định. Nếu tạo chỉ mục phân cụm, cần nhiều không gian hơn.
- **Tạo và bảo trì chỉ mục mất thời gian**, thời gian này tăng lên theo sự tăng dữ liệu.

## Làm thế nào để chỉ mục cải thiện tốc độ truy vấn?

Chỉ mục giúp biến dữ liệu không có thứ tự thành dữ liệu có thứ tự tương đối (giống như tìm kiếm mục tiêu).

## Những điều cần lưu ý khi sử dụng chỉ mục

- Tạo chỉ mục trên các cột mà thường xuyên cần tìm kiếm để tăng tốc độ tìm kiếm.
- Tạo chỉ mục trên các cột thường được sử dụng trong mệnh đề WHERE để tăng tốc độ đánh giá điều kiện.
- **Đặt cột được định sẵn chỉ mục là NOT NULL, nếu không, hệ thống sẽ không sử dụng chỉ mục và thực hiện quét toàn bộ bảng.**
- Tạo chỉ mục trên các cột thường cần sắp xếp, vì chỉ mục đã được sắp xếp, việc truy vấn có thể tận dụng sắp xếp của chỉ mục để tăng tốc độ truy vấn sắp xếp.
- Tránh sử dụng hàm trên cột trong mệnh đề WHERE, điều này sẽ làm cho chỉ mục không thể được sử dụng.
- Chỉ mục là rất hiệu quả trên các bảng từ trung bình đến lớn, nhưng việc duy trì chỉ mục trên các bảng cực lớn sẽ tốn kém, không phù hợp để tạo chỉ mục trên các bảng cực lớn, hãy tạo chỉ mục logic.
- Tạo chỉ mục trên các cột liên tục thường được sử dụng, các cột này chủ yếu là các khóa ngoại, để tăng tốc độ kết nối.
- Khi không liên quan đến doanh nghiệp, hãy sử dụng khóa chính logic, tức là sử dụng khóa chính tự tăng không liên quan đến doanh nghiệp khi sử dụng InnoDB.
- Xóa các chỉ mục không sử dụng trong thời gian dài, sự tồn tại của các chỉ mục không sử dụng sẽ gây ra lãng phí hiệu năng không cần thiết.
- Khi sử dụng bộ nhớ đệm truy vấn với limit offset, bạn có thể tận dụng chỉ mục để cải thiện hiệu suất.

## Tăng số lượng cấp của cây B+ có thể giảm chiều cao của cây, vậy tăng số lượng cấp cây vô hạn có thể đạt được hiệu suất tìm kiếm tối ưu nhất không?

Không thể. Vì điều này sẽ tạo ra một mảng được sắp xếp, hệ thống tệp và chỉ mục cơ sở dữ liệu đều tồn tại trên đĩa cứng và nếu dữ liệu lớn, không thể tải toàn bộ vào bộ nhớ. Mảng được sắp xếp không thể tải toàn bộ vào bộ nhớ, đó là lý do tại sao cây B+ với nhiều cấp lưu trữ có hiệu quả, có thể tải một nút của cây B+ mỗi lần và sau đó tìm kiếm từng bước.

## Hãy nói về khóa bảng và khóa hàng trong cơ sở dữ liệu

**Khóa bảng (Table Lock)*

Không gây ra tình trạng chết khóa, xung đột khóa xảy ra khá cao, đồng thời xử lý đồng thời thấp.

Trước khi thực hiện câu truy vấn (select), MyISAM sẽ tự động thêm khóa đọc cho tất cả các bảng liên quan. Trước khi thực hiện các thao tác thêm, xóa, sửa, MyISAM sẽ tự động thêm khóa ghi cho các bảng liên quan.

MySQL có hai chế độ khóa bảng: khóa đọc chia sẻ bảng và khóa ghi độc quyền bảng.

Khóa đọc sẽ chặn các thao tác ghi, khóa ghi sẽ chặn các thao tác đọc và ghi.

- Đối với các thao tác đọc trên bảng MyISAM, không chặn các yêu cầu đọc từ các quy trình khác trên cùng một bảng, nhưng sẽ chặn các yêu cầu ghi từ các quy trình khác. Chỉ khi khóa đọc được giải phóng, các thao tác ghi của các quy trình khác mới được thực hiện.
- Đối với các thao tác ghi trên bảng MyISAM, sẽ chặn các yêu cầu đọc và ghi từ các quy trình khác trên cùng một bảng. Chỉ khi khóa ghi được giải phóng, các thao tác đọc và ghi của các quy trình khác mới được thực hiện.

MyISAM không phù hợp để làm động cơ chính cho các bảng có tính chất ghi là chủ yếu, vì sau khi khóa ghi, các luồng khác không thể thực hiện bất kỳ hoạt động nào, việc cập nhật lớn sẽ làm cho truy vấn khó khăn để có được khóa và gây ra chặn mãi mãi.

**Khóa hàng (Row Lock)**

Có thể gây ra tình trạng chết khóa, xung đột khóa xảy ra thấp, đồng thời xử lý đồng thời cao.

Trong InnoDB, MySQL hỗ trợ khóa hàng và khóa hàng được thực hiện thông qua chỉ mục, nghĩa là khóa hàng được thêm vào các hàng tương ứng với chỉ mục. Nếu câu lệnh SQL tương ứng không sử dụng chỉ mục, thì sẽ quét toàn bộ bảng và không thể thực hiện khóa hàng, mà thay vào đó là khóa bảng, trong trường hợp này, các giao dịch khác không thể cập nhật hoặc chèn vào bảng hiện tại.

**Cần lưu ý khi thực hiện khóa hàng:**

- Khóa hàng phải có chỉ mục để thực hiện, nếu không sẽ tự động khóa toàn bộ bảng, không phải là khóa hàng.
- Nếu là khóa chia sẻ, hai giao dịch có thể khóa cùng một chỉ mục, trong khi khóa độc quyền không thể.
- Các câu lệnh insert, delete, update trong giao dịch sẽ tự động mặc định thêm khóa độc quyền.

**Ứng dụng của khóa hàng:**

Ví dụ, người dùng A tiêu tiền, tầng dịch vụ trước tiên truy vấn số dư tài khoản của người dùng này, nếu số dư đủ, sau đó thực hiện các thao tác trừ tiền; trong trường hợp này, khi truy vấn, cần khóa bản ghi này.

Nếu không, người dùng B có thể chuyển tiền từ tài khoản của người dùng A trước khi người dùng A thực hiện kiểm tra số dư, trong khi người dùng A đã thực hiện kiểm tra số dư đủ hay không, điều này có thể dẫn đến trường hợp số dư không đủ nhưng vẫn trừ tiền thành công.

Để tránh tình huống này, cần khóa bản ghi khi người dùng A thực hiện các hoạt động này.

## Sự khác biệt giữa INNER JOIN, SELF JOIN, OUTER JOIN (LEFT, RIGHT, FULL) và CROSS JOIN trong cú pháp SQL?

- INNER JOIN (Kết nối trong): Chỉ hiển thị các bản ghi trong kết quả truy vấn mà có sự khớp hoàn toàn giữa hai bảng.
- SELF JOIN (Kết nối tự thân): Kết nối một bảng với chính nó, cho phép truy vấn các bản ghi trong bảng dựa trên mối quan hệ giữa các cột trong cùng một bảng.
- OUTER JOIN (Kết nối ngoại vi): Cho phép hiển thị các bản ghi từ một bảng mà không cần khớp với bản ghi từ bảng kết nối. Có ba loại kết nối ngoại vi:
  - LEFT OUTER JOIN (Kết nối ngoại vi trái): Hiển thị tất cả các bản ghi từ bảng bên trái và các bản ghi khớp từ bảng bên phải.
  - RIGHT OUTER JOIN (Kết nối ngoại vi phải): Hiển thị tất cả các bản ghi từ bảng bên phải và các bản ghi khớp từ bảng bên trái.
  - FULL OUTER JOIN (Kết nối ngoại vi đầy đủ): Hiển thị tất cả các bản ghi từ cả hai bảng, bao gồm cả các bản ghi khớp và không khớp.
- CROSS JOIN (Kết nối chéo): Tạo ra một kết quả truy vấn là tổ hợp của tất cả các bản ghi từ hai bảng, không cần có bất kỳ điều kiện kết nối nào.

## Bạn biết những biện pháp tối ưu cấu trúc cơ sở dữ liệu nào?

- **Tối ưu hóa theo hình thức**: Ví dụ như loại bỏ dữ liệu trùng lặp để tiết kiệm không gian lưu trữ.
- **Tối ưu hóa ngược hình thức**: Ví dụ như thêm dữ liệu trùng lặp một cách hợp lý để giảm số lần thực hiện các phép kết nối (JOIN).
- **Giới hạn phạm vi dữ liệu**: Luôn hạn chế các truy vấn dữ liệu mà không có bất kỳ điều kiện phạm vi nào. Ví dụ: Khi người dùng truy vấn lịch sử đơn hàng, chúng ta có thể giới hạn trong một khoảng thời gian nhất định.
- **Phân tách đọc/ghi**: Sử dụng phân tách cơ sở dữ liệu kinh điển, nơi cơ sở dữ liệu chính xử lý ghi và các cơ sở dữ liệu phụ xử lý đọc.
- **Phân tách bảng**: Phân vùng dữ liệu vật lý, các dữ liệu khác nhau có thể được lưu trữ trên các tệp dữ liệu nằm trên các ổ đĩa khác nhau. Khi truy vấn bảng này, chỉ cần quét trong phân vùng bảng, không cần quét toàn bộ bảng, giảm thời gian truy vấn đáng kể. Đặc biệt hữu ích cho các bảng có lượng dữ liệu lớn.
- **Chỉ mục**: Tạo chỉ mục cho các cột thường xuyên được truy vấn để tăng tốc độ truy vấn.
- **Tối ưu hóa câu truy vấn**: Đảm bảo các câu truy vấn được viết một cách hiệu quả và sử dụng các chỉ mục và điều kiện phù hợp để truy xuất dữ liệu nhanh chóng.

## Một trong những biện pháp phổ biến để tối ưu hóa cấu trúc cơ sở dữ liệu là phân tách bảng dữ liệu. Bạn hiểu biết về việc phân tách bảng dữ liệu như thế nào?

Phân tách bảng dữ liệu có thể được thực hiện theo hai hướng: **phân tách dọc** và **phân tách ngang**.

Ví dụ: Giả sử chúng ta có hệ thống mua sắm đơn giản với các bảng sau:

1. Bảng sản phẩm (có 10.000 bản ghi, ổn định)
2. Bảng đơn hàng (có 2.000.000 bản ghi và có xu hướng tăng)
3. Bảng người dùng (có 1.000.000 bản ghi và có xu hướng tăng)

Chúng ta sẽ trình bày ví dụ về phân tách dọc và phân tách ngang bằng cách sử dụng MySQL. MySQL có thể xử lý hàng triệu bản ghi, tuy nhiên, giới hạn của nó là khoảng vài chục triệu bản ghi.

**Phân tách dọc**

Giải quyết vấn đề: Xung đột I/O giữa các bảng

Không giải quyết vấn đề: Áp lực tăng trưởng dữ liệu trong một bảng

Giải pháp: Đặt bảng sản phẩm và bảng người dùng trên một máy chủ và đặt bảng đơn hàng trên một máy chủ riêng.

**Phân tách ngang**

Giải quyết vấn đề: Áp lực tăng trưởng dữ liệu trong một bảng

Không giải quyết vấn đề: Xung đột I/O giữa các bảng

Giải pháp: **Bảng người dùng** được phân tách thành bảng người dùng nam và bảng người dùng nữ, **bảng đơn hàng** được phân tách thành bảng đơn hàng đã hoàn thành và bảng đơn hàng chưa hoàn thành, **bảng sản phẩm** được phân tách thành bảng sản phẩm chưa hoàn thành và bảng sản phẩm đã hoàn thành. Bảng đơn hàng chưa hoàn thành và bảng người dùng nam được đặt trên một máy chủ, bảng đơn hàng đã hoàn thành và bảng người dùng nữ được đặt trên một máy chủ, và bảng sản phẩm chưa hoàn thành được đặt trên một máy chủ khác.

## Tại sao MySQL sử dụng cây B+ cho các chỉ mục, thay vì cây B hoặc cây đỏ-đen?

Dữ liệu trong MySQL thường được lưu trữ trên đĩa cứng, khi đọc dữ liệu, chúng ta chắc chắn sẽ truy cập vào đĩa cứng, và đĩa cứng có hai phần cơ bản của nó là quay đĩa và di chuyển cánh tay đọc/ghi. Quá trình di chuyển cánh tay để định vị khối trên đĩa cứng là một phần tốn thời gian, vì vậy khi lưu trữ một lượng lớn dữ liệu trên đĩa cứng, việc định vị là một quá trình tốn thời gian, nhưng chúng ta có thể tối ưu hóa nó bằng cách sử dụng cây B.

Tại sao cây B có thể tối ưu hóa quá trình định vị này? Chúng ta có thể xây dựng một cây B đa cấp, sau đó lưu trữ càng nhiều thông tin liên quan trên các nút càng tốt, **đảm bảo số lượng cấp (chiều cao của cây) là ít nhất có thể**, để sau đó chúng ta có thể tìm kiếm thông tin nhanh chóng, **giảm số lần thực hiện I/O của đĩa cứng**, và cây B là một cây cân bằng, chiều cao từ mỗi nút đến nút lá là như nhau, điều này đảm bảo mỗi truy vấn là ổn định.

Đặc biệt: Chỉ có cây B và cây B+ trong MySQL, đây là cây B, không phải cây B trừ.

## Nếu hash nhanh hơn cây B+, tại sao MySQL lại sử dụng cây B+ để lưu trữ chỉ mục?

Trong MySQL, dữ liệu chỉ mục được lưu trữ bằng cây B+, trong khi hash thực sự nhanh hơn. Tuy nhiên, sử dụng cây B+ để lưu trữ chỉ mục trong MySQL có hai lợi ích chính:

1. **Tính khả dụng bộ nhớ**: Khi sử dụng hash, toàn bộ dữ liệu chỉ mục phải được tải vào bộ nhớ. Điều này tiêu tốn rất nhiều bộ nhớ, đặc biệt là khi có nhiều dữ liệu. Trong khi đó, cây B+ cho phép tải dữ liệu theo phân đoạn dựa trên các nút, giảm sự tiêu tốn bộ nhớ và cho phép làm việc với các tập dữ liệu lớn hơn.
    
2. **Hỗ trợ truy vấn phạm vi**: Cây B+ có thứ tự sắp xếp và liên kết giữa các nút lá, điều này làm cho việc truy vấn các phạm vi dữ liệu trở nên hiệu quả hơn. Trong khi đó, hash chỉ hỗ trợ truy vấn theo khóa duy nhất và không hỗ trợ truy vấn phạm vi.

Vì vậy, mặc dù hash nhanh hơn trong một số trường hợp cụ thể, MySQL vẫn sử dụng cây B+ để lưu trữ chỉ mục để đảm bảo tính khả dụng bộ nhớ và hỗ trợ truy vấn phạm vi.

## Các tính chất quan trọng của cơ sở dữ liệu quan hệ không được đảm bảo sẽ như thế nào?

ACID, gồm tính nguyên tử (Atomicity), tính nhất quán (Consistency), tính cô lập (Isolation) và tính bền vững (Durability).

Chúng ta sẽ lấy ví dụ về việc chuyển 50 USD từ tài khoản A sang tài khoản B để giải thích về bốn tính chất ACID này.

**Tính nguyên tử**

Tính nguyên tử đảm bảo rằng một giao dịch là một USD công việc không thể chia tách, **các hoạt động trong giao dịch phải được thực hiện hoặc không được thực hiện**. Nghĩa là hoặc chuyển tiền thành công, hoặc chuyển tiền thất bại, không có trạng thái trung gian tồn tại!

**Nếu không thể đảm bảo tính nguyên tử, điều gì sẽ xảy ra?**

Vậy là dữ liệu sẽ không nhất quán, tài khoản A bị trừ đi 50 USD, trong khi tài khoản B không được cộng thêm 50 USD. Hệ thống sẽ mất đi 50 USD một cách vô lý~

**Tính nhất quán**

Tính nhất quán đảm bảo rằng trước và sau khi giao dịch được thực hiện, dữ liệu phải ở trạng thái hợp lệ, trạng thái này được xác định bởi các ràng buộc đã được định nghĩa trước, nó không phải là trạng thái cú pháp mà là trạng thái ngữ nghĩa. **Dữ liệu được coi là nhất quán nếu nó tuân thủ trạng thái đã được định nghĩa, nếu không tuân thủ, dữ liệu sẽ không nhất quán!**

**Nếu không thể đảm bảo tính nhất quán, điều gì sẽ xảy ra?**

- Ví dụ 1: Tài khoản A có 200 USD, chuyển đi 300 USD, lúc này số dư của tài khoản A là -100 USD. Bạn sẽ nhận ra rằng dữ liệu không nhất quán tại thời điểm này, tại sao? Vì bạn đã định nghĩa một trạng thái yêu cầu cột số dư phải lớn hơn 0.
- Ví dụ 2: Tài khoản A có 200 USD, chuyển 50 USD cho tài khoản B, số tiền của tài khoản A đã bị trừ, nhưng do một số sự cố, số dư của tài khoản B không tăng lên. Bạn cũng nhận ra rằng dữ liệu không nhất quán tại thời điểm này, tại sao? Vì bạn đã định nghĩa một trạng thái yêu cầu tổng số dư A+B phải không thay đổi.

**Tính cô lập**

Tính cô lập đảm bảo rằng **khi nhiều giao dịch được thực hiện song song, các hoạt động bên trong giao dịch không tác động lẫn nhau**, các giao dịch đang thực hiện song song không được can thiệp vào nhau.

**Nếu không thể đảm bảo tính cô lập, điều gì sẽ xảy ra?**

Giả sử tài khoản A có 200 USD, tài khoản B có 0 USD. Chuyển tiền từ tài khoản A sang tài khoản B hai lần, mỗi lần 50 USD, trong hai giao dịch đồng thời. Nếu không thể đảm bảo tính cô lập, có thể xảy ra trường hợp A bị trừ tiền hai lần, trong khi B chỉ được cộng tiền một lần, mất đi 50 USD một cách vô lý, dẫn đến tình trạng dữ liệu không nhất quán!

**Tính bền vững**

Theo định nghĩa, **tính bền vững đảm bảo rằng sau khi giao dịch được gửi đi, các thay đổi của nó trên cơ sở dữ liệu phải là vĩnh viễn**. Các hoạt động hoặc sự cố tiếp theo không được ảnh hưởng đến nó.

Nếu không thể đảm bảo tính bền vững, điều gì sẽ xảy ra?

Trong MySQL, để giải quyết vấn đề tốc độ CPU và ổ đĩa không đồng nhất, MySQL tải dữ liệu từ ổ đĩa vào bộ nhớ, thực hiện các hoạt động trên bộ nhớ, sau đó ghi lại vào ổ đĩa. Vậy, giả sử máy chủ gặp sự cố tại thời điểm này, dữ liệu đã được sửa đổi trong bộ nhớ sẽ bị mất, tính bền vững không thể đảm bảo.

Hãy tưởng tượng, hệ thống thông báo rằng giao dịch chuyển tiền thành công. Nhưng bạn nhận thấy số tiền không thay đổi, tại thời điểm này dữ liệu đã có trạng thái không hợp lệ, chúng ta gọi trạng thái này là tình trạng **dữ liệu không nhất quán**.

## Cách để đảm bảo tính nhất quán của cơ sở dữ liệu?

Có thể xem xét từ hai khía cạnh.

- **Từ khía cạnh cơ sở dữ liệu**, cơ sở dữ liệu đảm bảo tính nhất quán thông qua tính nguyên tử, tính cô lập và tính bền vững. Nghĩa là trong bốn tính chất ACID, tính nhất quán (Consistency) là mục tiêu, trong khi tính nguyên tử (Atomicity), tính cô lập (Isolation) và tính bền vững (Durability) là các phương tiện để đảm bảo tính nhất quán. **Cơ sở dữ liệu phải thực hiện được ba tính chất AID, mới có thể đảm bảo tính nhất quán**. Ví dụ, nếu không thể đảm bảo tính nguyên tử, rõ ràng tính nhất quán cũng không thể đảm bảo.
    
- **Từ khía cạnh ứng dụng**, thông qua mã code để kiểm tra tính hợp lệ của dữ liệu cơ sở dữ liệu và quyết định rollback hoặc commit dữ liệu!

## Làm thế nào để đảm bảo tính nguyên tử trong cơ sở dữ liệu?

Chủ yếu là sử dụng **undo log** của Innodb. **Undo log** được gọi là nhật ký hoàn tác, là yếu tố quan trọng để đảm bảo tính nguyên tử. Khi giao dịch cần hoàn tác, nó có thể hoàn tác tất cả các câu lệnh SQL đã được thực hiện thành công bằng cách ghi lại thông tin nhật ký tương ứng. Ví dụ:

- Khi bạn xóa một bản ghi dữ liệu, bạn cần ghi lại thông tin của bản ghi đó để khi hoàn tác, bạn có thể chèn lại bản ghi cũ.
- Khi bạn cập nhật một bản ghi dữ liệu, bạn cần ghi lại giá trị cũ để khi hoàn tác, bạn có thể thực hiện cập nhật dựa trên giá trị cũ đó.
- Khi bạn chèn một bản ghi dữ liệu, bạn cần ghi lại khóa chính của bản ghi đó để khi hoàn tác, bạn có thể thực hiện xóa dựa trên khóa chính đó.

**Undo log** ghi lại thông tin cần thiết cho việc hoàn tác, khi giao dịch thất bại hoặc gọi lệnh **rollback**, giao dịch cần hoàn tác, thông tin trong **undo log** có thể được sử dụng để hoàn tác dữ liệu về trạng thái trước khi thay đổi.

## Làm thế nào để đảm bảo tính bền vững trong cơ sở dữ liệu?

Chủ yếu là sử dụng **redo log** của Innodb. **Redo log** là nhật ký ghi đè, giống như đã nói trước đó, MySQL sẽ tải dữ liệu từ đĩa vào bộ nhớ, thực hiện thay đổi dữ liệu trong bộ nhớ, sau đó ghi lại vào đĩa. Nếu máy chủ gặp sự cố đột ngột, dữ liệu trong bộ nhớ sẽ bị mất. Làm thế nào để giải quyết vấn đề này? Đơn giản, trước khi giao dịch được ghi, hãy ghi dữ liệu trực tiếp vào đĩa. Nhưng việc này có vấn đề gì không?

- Khi chỉnh sửa một byte trong một trang, bạn phải ghi lại toàn bộ trang đó vào đĩa, rất lãng phí tài nguyên. Một trang có kích thước 16KB, bạn chỉ chỉnh sửa một chút nhỏ, nhưng phải ghi lại toàn bộ nội dung 16KB vào đĩa, nghe có vẻ không hợp lý.
- Một giao dịch có thể liên quan đến việc chỉnh sửa nhiều trang dữ liệu, và các trang dữ liệu này có thể không liên tiếp, tức là thuộc về I/O ngẫu nhiên. Rõ ràng, thao tác I/O ngẫu nhiên sẽ chậm hơn.

Do đó, quyết định sử dụng **redo log** để giải quyết vấn đề trên. Khi thực hiện thay đổi dữ liệu, không chỉ thao tác trong bộ nhớ, mà còn ghi lại thao tác này trong **redo log**. Khi giao dịch được ghi, nhật ký **redo log** sẽ được ghi vào đĩa (**redo log** một phần trong bộ nhớ, một phần trên đĩa). Khi khởi động lại cơ sở dữ liệu sau khi máy chủ gặp sự cố, nội dung của **redo log** sẽ được khôi phục vào cơ sở dữ liệu, sau đó dựa vào thông tin trong **undo log** và **binlog** để quyết định hoàn tác hoặc xác nhận dữ liệu.

**Lợi ích của việc sử dụng redo log?**

Thực tế, lợi ích chính là việc ghi **redo log** và so sánh nội dung trang dữ liệu giúp tăng tốc quá trình ghi trang dữ liệu. Cụ thể như sau:

- **Redo log** có kích thước nhỏ, vì chỉ ghi lại thông tin về trang nào đã được chỉnh sửa, do đó kích thước nhỏ, việc ghi vào đĩa nhanh chóng.
- **Redo log** luôn được ghi vào cuối, thuộc I/O tuần tự. Rõ ràng, việc thực hiện I/O tuần tự sẽ nhanh hơn so với I/O ngẫu nhiên.

## Có những giải pháp nào tốt để xử lý vấn đề đồng thời cao trong cơ sở dữ liệu?

- Thêm bộ nhớ cache vào trong framework dịch vụ web. Thêm một lớp cache giữa máy chủ và cơ sở dữ liệu để lưu trữ dữ liệu được truy cập nhiều lần, giảm tải đọc cơ sở dữ liệu.
- Tăng cường chỉ mục của cơ sở dữ liệu để cải thiện tốc độ truy vấn. (Tuy nhiên, quá nhiều chỉ mục có thể làm chậm tốc độ và việc ghi vào cơ sở dữ liệu cũng làm chậm tốc độ)
- Sử dụng phân tách đọc/ghi giữa máy chủ chính và máy chủ phụ để máy chủ chính xử lý ghi và máy chủ phụ xử lý đọc.
- Phân tách cơ sở dữ liệu thành các bảng nhỏ hơn để cải thiện tốc độ truy vấn.
- Sử dụng kiến trúc phân tán để phân tán tải tính toán.
