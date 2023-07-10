---
tags: [database, computer-science]
categories: 
title: SQL Injection
date created: 2023-06-30
date modified: 2023-07-10
tag: [network, computer-science, security]
---

## SQL Injection là gì?

SQL injection là một kỹ thuật hack sử dụng lỗ hổng bảo mật trong trang web để gửi một truy vấn SQL cụ thể nhằm lấy thông tin quan trọng từ cơ sở dữ liệu mà kẻ tấn công muốn.

Thường xảy ra khi điều này xảy ra khi máy khách không lọc đúng dữ liệu đầu vào.

Mặc dù khá dễ thực hiện, nhưng tác động của cuộc tấn công này có thể rất lớn, vì vậy nó được coi là một trong những mối đe dọa an ninh quan trọng nhất.

## Các loại SQL injection và phương thức tấn công

### Error based SQL Injection

> SQL injection sử dụng các lỗi logic

Đây là kỹ thuật tấn công được sử dụng phổ biến nhất.

```sql
SELECT * FROM Users WHERE id = 'INPUT1' AND password = 'INPUT2'
```

```sql
SELECT * FROM Users WHERE id = ' ' OR 1=1 -- 'AND password = 'INPUT2'
--> SELECT * FROM Users
```

Thường được sử dụng trong quá trình đăng nhập.

Do không kiểm tra giá trị input trước khi thực hiện câu lệnh truy vấn nên người dùng có thể chèn các mã thay đổi logic của câu lệnh truy vấn.

Nội dung input là `' OR 1=1--` bằng cách sử dụng dấu `'` để đóng cặp với dấu `'` trong WHERE và sử dụng câu truy vấn `OR 1=1` để làm cho tất cả các điều kiện trong WHERE trở thành đúng và sử dụng `--` để chú thích phần còn lại của câu truy vấn.

Mặc dù câu truy vấn rất đơn giản, nhưng kết quả cuối cùng là tất cả thông tin trong bảng Users sẽ được truy xuất, cho phép người dùng đăng nhập bằng tài khoản đầu tiên được tạo ra, thường là tài khoản quản trị viên. Hacker có thể sử dụng quyền quản trị viên này để gây ra thiệt hại khác.

### UNION based SQL Injection

> SQL Injection sử dụng lệnh UNION

UNION là một phương thức để kết hợp nhiều câu lệnh SQL thành một câu lệnh SQL duy nhất.

Khi thành công trong việc chèn UNION vào câu truy vấn hợp lệ, chúng ta có thể thực hiện các câu truy vấn mong muốn.

Để thành công trong việc thực hiện Union Injection, hai điều kiện cần phải đáp ứng là số cột trong hai bảng phải giống nhau và kiểu dữ liệu phải giống nhau.

```sql
SELECT * FROM Board WHERE title like '%INPUT%' OR contents like '%INPUT%'
```

```sql
SELECT * FROM Board WHERE title LIKE '% ' 
UNION SELECT null, id, password FROM Users 
-- %' AND contents '% UNION SELECT null, id, password FROM Users -- %'

```

Câu truy vấn đầu tiên là một câu truy vấn để tìm kiếm các bài viết trong bảng Board.

Sau khi so sánh giá trị input với dữ liệu trong cột `title` và `contents`, các bài đăng khớp với điều kiện sẽ được trả về.

Ở đây, nếu chèn Union và câu truy vấn SELECT với số cột phù hợp vào, hai câu truy vấn sẽ được kết hợp thành một bảng duy nhất.

Câu truy vấn thêm vào đang yêu cầu `id` và `password` của người dùng.

Nếu thành công trong việc chèn Union, thông tin cá nhân của người dùng sẽ được hiển thị cùng với các bài viết trên màn hình.

Mặc dù hiện tại `password` không được lưu trữ trực tiếp trong cơ sở dữ liệu, nhưng việc có thể thực hiện Injection đã khiến hệ thống bị tiếp xúc với các mối đe dọa an ninh tiềm ẩn.

Cuộc tấn công này cũng xảy ra do thiếu việc kiểm tra đầu vào từ người dùng.

### Blind SQL Injection

#### Boolean based Blind SQL

Blind SQL Injection là kỹ thuật sử dụng khi chỉ có thể biết được thông tin đúng hoặc sai mà không nhận được bất kỳ giá trị hoặc dữ liệu cụ thể từ cơ sở dữ liệu.

Khi giả định rằng SQL Injection có thể xảy ra trong lúc đăng nhập, ta có thể trích xuất thông tin về các bảng trong DB thông qua các thông báo thành công hoặc thất bại của quá trình đăng nhập.

Nói cách khác, kỹ thuật này được sử dụng khi ta có thể phân biệt phản ứng của câu truy vấn là đúng hay sai khi chèn một câu truy vấn vào.

```sql
SELECT * FROM Users WHERE id = 'INPUT1' ANS password = 'INPUT2'
```

```sql
SELECT * FROM Users WHERE id = ' abc123' and 
ASCII(SUBSTR((SELECT name FROM information_schema.tables 
WHERE table_type='base table' limit 0,1),1,1)) > 100 --
```

Câu truy vấn trêm là một ví dụ về việc sử dụng Blind Injection để tìm hiểu tên bảng trong cơ sở dữ liệu.

Hacker có thể chèn câu truy vấn này vào biểu mẫu đăng nhập, cùng với một tài khoản abc123 tạo ra một cách tùy ý.

Câu truy vấn này được sử dụng để truy vấn tên bảng trong MySQL, sử dụng từ khóa LIMIT để chỉ truy vấn một bảng duy nhất, hàm SUBSTR để lấy ký tự đầu tiên và hàm ASCII để chuyển đổi thành giá trị ASCII.

Nếu tên bảng được truy vấn là Users, ký tự 'U' sẽ được trả về và so sánh với số 100.

Nếu sai, quá trình đăng nhập sẽ thất bại và hacker sẽ thay đổi số 100 cho đến khi kết quả trả về là đúng.

Qua đó, hacker có thể tìm tên bảng trong một khoảng thời gian ngắn.

#### Time based SQL

Trong một số trường hợp, kết quả phản hồi luôn giống nhau và không thể phân biệt được giữa đúng và sai chỉ qua kết quả đó.

Trong trường hợp này, ta có thể chèn một câu truy vấn gây trễ để phân biệt giữa đúng và sai dựa trên sự chênh lệch thời gian phản hồi.

Các hàm thường được sử dụng là `SLEEP` và `BENCHMARK` trong `MySQL`.

```sql
SELECT * FROM Users WHERE id = 'INPUT1' AND password = 'INPUT2'
```

```sql
SELECT * FROM Users WHERE id = ' abc123' OR 
(LENGTH(DATABASE())=1 AND SLEEP(2)) 
-- ' AND password = 'INPUT2'
```

Câu truy vấn trên là một ví dụ về Time based SQL Injection để tìm hiểu độ dài của cơ sở dữ liệu hiện tại.

Hacker có thể chèn câu truy vấn này vào biểu mẫu đăng nhập và tạo một tài khoản abc123.

Khi hacker chèn câu truy vấn này, hàm `LENGTH` trả về độ dài của chuỗi và hàm `DATABASE` trả về tên cơ sở dữ liệu.

Trong câu truy vấn đã chèn, nếu `LENGTH(DATABASE()) = 1` là đúng, thì `SLEEP(2)` sẽ được thực hiện, nếu sai thì không thực hiện.

Qua đó, hacker có thể thay đổi số 1 để tìm hiểu độ dài của cơ sở dữ liệu.

Nếu từ `SLEEP` không khả dụng, ta có thể sử dụng các hàm `BENCHMARK` hoặc `WAIT` như một phương pháp khác.

### Stored Procedure SQL Injection

> SQL Injection trong Stored Procedure

Là kỹ thuật tấn công sử dụng khi có lỗ hổng trong việc xử lý Stored Procedure, cho phép hacker thực thi các câu lệnh SQL độc hại thông qua việc chèn dữ liệu độc hại vào các tham số của Stored Procedure.

Một trong những Stored Procedure phổ biến được sử dụng để tấn công là xp_cmdshell trong MS-SQL, cho phép thực thi các lệnh hệ thống trên Windows.

Tuy nhiên, để thực hiện tấn công này, hacker cần có quyền hạn hệ thống, do đó độ khó của cuộc tấn công là cao, nhưng nếu thành công, kẻ tấn công có thể gây ra thiệt hại trực tiếp cho máy chủ.

### Mass SQL Injection

> Tấn công SQL injection hàng loạt

Khác với SQL Injection thông thường, Mass SQL Injection tấn công một lần nhưng có thể thay đổi nhiều cơ sở dữ liệu, gây ra sự nhiễu loạn và thiệt hại lớn.

Thường được sử dụng trong các ứng dụng web dựa trên ASP sử dụng MS-SQL, các câu truy vấn được mã hóa bằng HEX để tấn công.

Thường thì giá trị của cơ sở dữ liệu bị thay đổi để chèn các đoạn mã độc hại vào cơ sở dữ liệu, và khi người dùng truy cập vào trang web bị thay đổi, máy tính của họ sẽ bị nhiễm virus thông qua các máy tính zombie.

Những máy tính zombie này sau đó có thể được sử dụng để thực hiện cuộc tấn công DDoS.

## Các biện pháp phòng chống SQL injection

### Kiểm tra giá trị đầu vào

Có rất nhiều kỹ thuật và từ khóa được sử dụng trong SQL Injection.

Do đó, việc kiểm tra giá trị đầu vào từ người dùng là cần thiết.

Phía máy chủ cần thực hiện kiểm tra dựa trên whitelist (danh sách cho phép) để đảm bảo chỉ chấp nhận các giá trị hợp lệ. Nếu dựa trên blacklist (danh sách cấm), sẽ cần đăng ký nhiều từ khóa để chặn, và nếu có bất kỳ từ khóa nào bị bỏ qua, cuộc tấn công có thể thành công.

Phương pháp thay thế bằng khoảng trắng cũng được sử dụng rộng rãi, nhưng đây cũng là một phương pháp yếu.

Ví dụ, khi nhập SESELECTLECT, nếu SELECT được thay thế bằng khoảng trắng, từ khóa SELECT sẽ được hoàn thành.

Thay vì khoảng trắng, nó nên được thay thế bằng các từ không có ý nghĩa với các từ khóa tấn công.

### Sử dụng Prepared Statement

Khi sử dụng Prepared Statement, giá trị đầu vào của người dùng được coi là một chuỗi ký tự và không được thực thi trước khi vào cơ sở dữ liệu.

Do đó, ngay cả khi có câu truy vấn tấn công, giá trị đầu vào của người dùng đã trở thành một chuỗi ký tự vô nghĩa, vì vậy toàn bộ câu truy vấn cũng không hoạt động theo ý đồ của kẻ tấn công.

### Không hiển thị Error Message

Để thực hiện SQL Injection, hacker cần thông tin về cơ sở dữ liệu như tên bảng, tên cột.

Khi xảy ra lỗi cơ sở dữ liệu, nếu không xử lý riêng, thông báo lỗi cùng với câu truy vấn lỗi sẽ được trả về, cung cấp gợi ý cho kẻ tấn công.

Do đó, khi xảy ra lỗi cơ sở dữ liệu, cần tạo trang lỗi riêng hoặc hiển thị hộp thoại thông báo để người dùng không thấy được thông tin lỗi.

### Sử dụng firewall

Sử dụng tường lửa, đặc biệt là tường lửa chuyên dụng cho phòng chống tấn công web, là một phương pháp bảo vệ.

Tường lửa web có thể được chia thành ba loại: software, hardware và proxy.

Loại phần mềm được cài đặt trực tiếp trên máy chủ, loại phần cứng được cấu hình trước trên mạng và loại proxy thay đổi địa chỉ DNS để tất cả lưu lượng truy cập máy chủ đi qua tường lửa web trước khi đến máy chủ.
