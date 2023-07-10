---
title: RDBMS and NoSQL
date created: 2023-06-27
date modified: 2023-07-08
tag: [db, sql, nosql, computer-science]
---

## SQL vs NoSQL

### Định nghĩa

#### SQL (Structured Query Language)

SQL là một ngôn ngữ lập trình được thiết kế để quản lý dữ liệu trong hệ thống quản lý cơ sở dữ liệu quan hệ (RDBMS). Một số ví dụ về SQL bao gồm MySQL, PostgreSQL và nhiều hệ thống khác.

#### NoSQL (Not Only Structured Query Language)

NoSQL cung cấp cơ chế lưu trữ và truy vấn dữ liệu sử dụng mô hình linh hoạt hơn so với SQL. NoSQL không bị giới hạn như SQL và cung cấp các cơ chế lưu trữ và truy vấn dữ liệu khác nhau. Một số ví dụ về NoSQL bao gồm MongoDB, Redis và nhiều hệ thống khác.

### Cấu trúc (Structure)

#### SQL

![Pasted image 20230630195741](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230630195741.png)

Trong SQL, dữ liệu phải được tuân thủ nghiêm ngặt theo [[DB Schema]], những dữ liệu không tuân thủ sẽ không được lưu trữ.

#### NoSQL

![Pasted image 20230630195747](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230630195747.png)

Trong NoSQL, không có [[DB Schema]] nên có thể thêm dữ liệu với cấu trúc khác nhau vào cùng một collection.

### Mối quan hệ (Relationship)

#### SQL

![Pasted image 20230630200359](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230630200359.png)

Bằng cách chia dữ liệu thành nhiều bảng, chúng ta có thể tránh sự trùng lặp dữ liệu.

Ví dụ, để đại diện cho các sản phẩm mà người dùng đã mua, chúng ta có thể tạo ra nhiều bảng như Customers (Khách hàng), Products (Sản phẩm), Orders (Đơn hàng), nhưng mỗi bảng sẽ chứa dữ liệu không được lưu trong bảng khác. (Không có dữ liệu trùng lặp).

Cấu trúc rõ ràng như vậy có nhiều ưu điểm. Bằng cách quản lý chỉ một bản ghi duy nhất trong mỗi bảng, chúng ta không phải lo lắng về việc xử lý dữ liệu không chính xác từ các bảng khác.

#### NoSQL

![132977191-17ecfef9-0ac5-45fc-ae51-f83563e40162](https://raw.githubusercontent.com/vanhung4499/images/master/snap/132977191-17ecfef9-0ac5-45fc-ae51-f83563e40162.png)

Trong NoSQL, thường ghi tất cả dữ liệu liên quan vào một bộ sưu tập (= một bảng trong SQL).

Thường thì ta sẽ đặt các dữ liệu liên quan vào cùng một bộ sưu tập. Ví dụ, nếu có nhiều đơn hàng (Orders), chúng ta sẽ lưu trữ các thông tin chung trong bộ sưu tập Orders, bao gồm cả thông tin về người dùng (Users) và sản phẩm (Products) mà không cần chia thành các bảng riêng biệt. (Nghĩa là, thông tin về người dùng và sản phẩm sẽ được lưu trữ trong bộ sưu tập Orders cùng với các thông tin khác.)

Do đó, chúng ta không cần phải thực hiện các phép nối (join) giữa nhiều bảng / bộ sưu tập, mà thay vào đó, chúng ta tạo ra các tài liệu (documents) chứa đầy đủ thông tin cần thiết trong mỗi bộ sưu tập. (Thực tế, NoSQL không có khái niệm về phép nối.) Thay vào đó, chúng ta sao chép dữ liệu qua các bộ sưu tập để đảm bảo rằng dữ liệu thuộc về một phần cụ thể của bộ sưu tập được truy xuất chính xác.

Phương pháp này dẫn đến sự trùng lặp dữ liệu trong NoSQL. Do đó, khi cập nhật dữ liệu, chúng ta cần chú ý để đảm bảo tính nhất quán. (Ví dụ, nếu chúng ta thêm email của John vào tài liệu của Khách hàng (Customer), chúng ta cũng cần cập nhật nó trong bộ sưu tập Orders, nếu không sẽ gây ra vấn đề.)

### Khả năng mở rộng (Scalability)

Khả năng mở rộng có thể được phân thành mở rộng theo chiều dọc (vertical scaling) và mở rộng theo chiều ngang (horizontal scaling).

Mở rộng theo chiều dọc đơn giản là cải thiện hiệu suất của máy chủ cơ sở dữ liệu. Trong khi đó, mở rộng theo chiều ngang là việc thêm nhiều máy chủ và phân tán cơ sở dữ liệu trên toàn bộ hệ thống.

#### SQL(vertical scale)

Do cách dữ liệu được lưu trữ, SQL thường chỉ hỗ trợ mở rộng theo chiều dọc.

#### NoSQL (horizontal scale)

Trong khi đó, NoSQL cho phép mở rộng theo chiều ngang.

## RDB

RDB (Relational Database) là một hệ thống cơ sở dữ liệu theo nguyên tắc đơn giản hóa các mối quan hệ giữa các khóa (key) và giá trị (value) thành các bảng.

Ưu điểm chính của mô hình cơ sở dữ liệu quan hệ là cung cấp cách biểu diễn dữ liệu trực quan và dễ dàng truy cập vào các điểm dữ liệu liên quan.

Khi sử dụng cơ sở dữ liệu quan hệ, có nhiều ưu điểm khi quản lý và lưu trữ dữ liệu.

Ưu điểm của RDB:  

1. Lưu trữ dữ liệu được chuẩn hóa: ta có thể xác định trước hình thức và kích thước của dữ liệu và lưu trữ dữ liệu theo đơn vị bảng.
2. Đảm bảo ACID (tính toàn vẹn, nhất quán, cô lập và bền vững) thông qua transaction.
3. Tìm kiếm dữ liệu phức tạp: RDB cho phép tìm kiếm dữ liệu phức tạp bao gồm các điều kiện phức tạp và các phép kết hợp (join).
4. Normalization: sử dụng normalization để giảm thiểu sự trùng lặp dữ liệu và cải thiện tính toàn vẹn dữ liệu.

## RDBMS

RDBMS (Relational Database Management System) là hệ thống quản lý cơ sở dữ liệu quan hệ, lưu trữ dữ liệu dưới dạng bảng có các hàng và cột, và sử dụng ngôn ngữ SQL để thao tác dữ liệu.

Có nhiều loại RDBMS như `MySQL`, `PostgreSQL`, `Oracle`, `Microsoft SQL Server`, `MariaDB`, v.v.  

![Pasted image 20230630165240](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230630165240.png)

Dưới đây là danh sách 10 RDBMS phổ biến nhất hiện nay (tính đến ngày 39/06/2023) theo [DB-Engines Ranking](https://db-engines.com/en/ranking):

![2023-06-30_16-55-03](https://raw.githubusercontent.com/vanhung4499/images/master/snap/2023-06-30_16-55-03.png)

Mỗi RDBMS có ngôn ngữ SQL riêng, mặc dù tuân thủ một số tiêu chuẩn SQL chung, nhưng mỗi hãng phát triển cũng có thể tùy chỉnh SQL cho sản phẩm của mình. Ví dụ, Oracle sử dụng PL/SQL, SQL Server sử dụng T-SQL, MySQL sử dụng SQL.

### MySQL

`MySQL` là tương thích với hầu hết OS và hiện đang là DBMS được sử dụng nhiều nhất sau Oracle. Nhiều công ty như Meta, Twitter, v.v cũng sử dụng MySQL.

MySQL được viết bằng C và C++, và nó cung cấp nén chỉ mục MyISAM, chỉ mục dựa trên B Tree, hệ thống phân bổ bộ nhớ dựa trên Thread và khả năng tham gia nhanh chóng. Nó cung cấp tối đa 64 chỉ mục.

MySQL được thiết kế để xử lý cơ sở dữ liệu lớn, hỗ trợ transaction, commit, rollback và bảo mật với hỗ trợ mã hóa kép. Nó được sử dụng trong nhiều dịch vụ.

Kiến trúc của của MySQL như sau:

![db-rdb-nosql-3](https://raw.githubusercontent.com/vanhung4499/images/master/snap/db-rdb-nosql-3.jpeg)

- Các Storage Engine đóng vai trò như "trái tim" của cơ sở dữ liệu. MySQL có kiến trúc module, cho phép dễ dàng thay đổi Storage Engine và nó hỗ trợ các tính năng như data warehousing, xử lý giao dịch và xử lý có tính sẵn sàng cao.
- Phía trên Storage Engine, có `API Connector` và `lớp dịch vụ` để tương tác dễ dàng với cơ sở dữ liệu MySQL.
- Hơn nữa, MySQL hỗ trợ bộ nhớ cache truy vấn, cho phép lưu trữ kết quả toàn bộ truy vấn đã nhập. Nếu truy vấn từ người dùng giống với truy vấn đã lưu trong cache, máy chủ chỉ cần hiển thị kết quả từ cache mà không cần phân tích cú pháp, tối ưu hóa và thực thi lại truy vấn.

Tuy nhiên, MySQL cũng có nhược điểm:  

- Khi sử dụng các truy vấn phức tạp, hiệu suất có thể bị giảm.  
- Hỗ trợ giao dịch không hoàn hảo  
- Việc sử dụng các hàm người dùng tự định nghĩa không dễ dàng và không linh hoạt.

### PostgreSQL

`PostgreSQL` cũng là một RDBMS được ưa chuộng và được công nhận rộng rãi.

Các điểm mạnh của PostgreSQL bao gồm:  

1. Không có vấn đề về chi phí vì giấy phép - PostgreSQL sử dụng giấy phép BSD, và một trong những đặc điểm quan trọng của giấy phép này là bạn có thể thay đổi mã nguồn và phân phối mã nguồn đó mà không gặp vấn đề pháp lý.  
2. Sự ổn định của mã nguồn mở đã tồn tại từ lâu - Mặc dù PostgreSQL là một hệ thống cơ sở dữ liệu nhẹ, nhưng nó không gặp vấn đề lớn khi xử lý dữ liệu lớn và nó tuân thủ chuẩn SQL.  
3. Cơ sở dữ liệu vẫn đang tiếp tục phát triển - PostgreSQL tiếp tục cập nhật với tốc độ nhanh chóng.  
4. Cú pháp và kiểu dữ liệu riêng - Điều này có thể là một ưu điểm và đồng thời là một nhược điểm. PostgreSQL có các kiểu dữ liệu và cú pháp riêng, tuy nhiên, khi gặp sự cố, việc tìm tài liệu tham khảo trong nguồn tài liệu trong nước có thể gặp khó khăn.

### Oracle

`Oracle` là DBMS được phát triển bởi công ty Oracle Corporation của Mỹ. Đây là DBMS hàng đầu thế giới về thị phần và hiện đang là DBMS được sử dụng rộng rãi nhất trên hệ điều hành Unix.  

Các điểm mạnh của Oracle bao gồm:  

1. Hệ thống quản lý: Cho phép điều chỉnh đa cơ sở dữ liệu và cho phép nhiều người dùng truy cập đồng thời.  
2. Quản lý thay đổi: Cho phép tạo kế hoạch thay đổi và xem trước hiệu quả của các thay đổi trước khi thực hiện. Ngoài ra, nó không làm gián đoạn hệ thống sản xuất.  
3. Cảnh báo: Khi xảy ra lỗi, có thể gửi cảnh báo đến các tài khoản và email đã cấu hình. Cảnh báo có thể bị chặn trong thời gian dừng hoạt động được lên lịch.  
4. Xử lý phân tán: Oracle cho phép xử lý phân tán trên các máy tính khác nhau, bao gồm máy tính thực thi DBMS, máy tính với vai trò máy chủ và máy tính thực thi ứng dụng DB.  
5. Khả năng xử lý: Oracle xử lý giao dịch với hiệu suất cao hơn so với các cơ sở dữ liệu khác. Nó cũng phân tích bảng và chỉ mục để giảm thiểu chi phí.

Các điểm yếu của Oracle bao gồm:  

1. Chi phí: Oracle có thể đắt đỏ, gây gánh nặng cho một số tổ chức.
2. Độ phức tạp: Do tính năng phong phú, Oracle có thể khó sử dụng đối với người mới bắt đầu.
3. Yêu cầu phần cứng cao: Oracle yêu cầu cấu hình phần cứng cao để đạt hiệu suất tối ưu.  

Nhìn chung, các doanh nghiệp nhỏ và vừa với nguồn lực hạn chế thường ưa thích MySQL, trong khi các doanh nghiệp lớn xử lý yêu cầu kinh doanh phức tạp và có nguồn lực đủ thường ưa thích Oracle cho các dự án của họ.

## NoSQL

NoSQL = Not only SQL là một loại cơ sở dữ liệu được tạo ra từ khẩu hiệu này.

### Tại sao NoSQL ra đời?

Với sự phát triển nhanh chóng của web, không chỉ dữ liệu đa phương tiện như hình ảnh, video mà còn dữ liệu phi cấu trúc như văn bản tự do được tạo ra thông qua các mạng xã hội và ghi lại nhật ký.

Trong môi trường như vậy, việc duy trì các ưu điểm của cơ sở dữ liệu quan hệ sẽ tốn rất nhiều chi phí.

Cơ sở dữ liệu quan hệ được sử dụng chủ yếu trong môi trường máy tính đơn lẻ và không được thiết kế để hoạt động hiệu quả trong môi trường cụm, trong đó nhiều máy tính được kết nối để tạo thành một hệ thống duy nhất.

Để giải quyết vấn đề lưu trữ và xử lý dữ liệu phi cấu trúc lớn trên web, `NoSQL` đã được đề xuất như một giải pháp thay thế cho cơ sở dữ liệu quan hệ.

Thực tế, các công ty cung cấp dịch vụ mạng xã hội đã làm chủ trong việc phát triển các công nghệ liên quan đến NoSQL.

### Đặc điểm của NoSQL

NoSQL là một loại cơ sở dữ liệu được sử dụng để lưu trữ và xử lý dữ liệu phi cấu trúc lớn được tạo ra với tốc độ nhanh. Nó không cung cấp chức năng giao dịch ACID nhưng cho phép lưu trữ, phân tán và xử lý dữ liệu trên nhiều máy tính với chi phí thấp.

NoSQL sử dụng mô hình dữ liệu linh hoạt hơn và không cần định nghĩa cấu trúc trước, do đó không cần định nghĩa [[DB Schema]] và có thể thay đổi cấu trúc dữ liệu một cách linh hoạt. Điều này làm cho NoSQL phù hợp để lưu trữ dữ liệu phi cấu trúc và hầu hết các hệ thống NoSQL được cung cấp dưới dạng mã nguồn mở.

NoSQL được phát triển để xử lý dữ liệu lớn được tạo ra với tốc độ nhanh. Nó không cố gắng thay thế hoàn toàn cơ sở dữ liệu quan hệ, mà tập trung vào việc tạo ra các cơ sở dữ liệu phù hợp với môi trường cụm và không cần định nghĩa schema trước.

NoSQL không phải là đối thủ của cơ sở dữ liệu quan hệ. Mục đích sử dụng của cơ sở dữ liệu quan hệ và NoSQL khác nhau, do đó NoSQL không thể hoàn toàn thay thế cơ sở dữ liệu quan hệ.

Cơ sở dữ liệu quan hệ sử dụng giao dịch để duy trì tính nhất quán và sử dụng khóa ngoại để biểu diễn mối quan hệ giữa các bảng, từ đó xử lý các truy vấn phức tạp như kết hợp. Tuy nhiên, đối với việc lưu trữ dữ liệu phi cấu trúc lớn được tạo ra với tốc độ nhanh, cơ sở dữ liệu quan hệ không hiệu quả về mặt mở rộng.

NoSQL không cung cấp chức năng giao dịch và không có schema cố định, cho phép thay đổi cấu trúc dữ liệu một cách linh hoạt và lưu trữ, xử lý dữ liệu phi cấu trúc lớn một cách nhanh chóng. Tuy nhiên, để tìm ra ý nghĩa ẩn chứa trong dữ liệu, cần áp dụng các kỹ thuật phân tích dữ liệu khác như khai phá dữ liệu.

Một số ví dụ về NoSQL bao gồm `MongoDB`, `Redis` và nhiều hệ thống khác.

![Pasted image 20230630184202](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230630184202.png)

### MongoDB

MongoDB là một cơ sở dữ liệu dựa trên tài liệu mở rộng từ mô hình dữ liệu key-value, với JSON được sử dụng để truy cập dữ liệu và dữ liệu được lưu trữ dưới dạng Binary JSON (BSON). Nó đi kèm với một máy chủ lưu trữ mặc định là WiredTiger.

MongoDB có khả năng mở rộng tốt, hiệu suất tốt khi lưu trữ dữ liệu lớn và hỗ trợ tính sẵn sàng cao, sharding và replica.

Ngoài ra, vì không yêu cầu định nghĩa schema trước, MongoDB rất phù hợp để phân tích dữ liệu từ các cơ sở dữ liệu đa ngành hoặc triển khai logging.

Hơn nữa, MongoDB tạo ra một giá trị `ObjectID` duy nhất trong các bộ sưu tập khác nhau mỗi khi tạo một tài liệu. `ObjectID` này được tạo thành một khóa chính duy nhất từ timestamp trên Unix (4 byte), giá trị ngẫu nhiên (5 byte) và một bộ đếm (3 byte).

### Redis

Redis là một cơ sở dữ liệu in-memory dựa trên mô hình dữ liệu key-value.

Redis hỗ trợ các kiểu dữ liệu cơ bản, như chuỗi (string), và có thể lưu trữ tối đa 512MB. Ngoài ra, Redis cũng hỗ trợ các kiểu dữ liệu khác như Set, Hash và nhiều kiểu khác.

Redis được dùng trong trong các hệ thống message qua chức năng Pub/Sub, làm lớp cache trước các cơ sở dữ liệu khác, quản lý thông tin phiên tử đơn giản cần sử dụng key-value, và cung cấp dịch vụ bảng xếp hạng thời gian thực sử dụng cấu trúc dữ liệu Set.

## Lựa chọn RDBMS hay NoSQL

Nếu bạn đang phân vân giữa cơ sở dữ liệu quan hệ và NoSQL, tôi muốn đề xuất rằng bạn nên chọn cái phù hợp nhất với yêu cầu công việc và khả năng của mình.

Nghĩa là, hãy chọn cái phù hợp nhất với hình thức dữ liệu và mục đích xử lý.

`RDBMS` thích hợp hơn khi quản lý dữ liệu có tính nhất quán cao và yêu cầu xử lý truy vấn phức tạp như kết hợp. Nó thích hợp cho việc quản lý dữ liệu có cấu trúc, chẳng hạn như dữ liệu nhân sự và tài chính của doanh nghiệp.

`NoSQL` thích hợp hơn khi lưu trữ và quản lý dữ liệu phi cấu trúc như hình ảnh và văn bản được tạo ra thông qua mạng xã hội, video được ghi lại thông qua hệ thống CCTV, dữ liệu cảm biến và các dạng dữ liệu khác có khối lượng lớn và tốc độ tạo ra nhanh. NoSQL tập trung vào việc lưu trữ và quản lý dữ liệu chủ yếu dựa trên việc thêm dữ liệu mới hơn là chỉnh sửa.

Dưới đây là một số so sánh đơn giản giữa cơ sở dữ liệu quan hệ và NoSQL trong một số khía cạnh.

|Phân loại|RDB|NoSQL|
|----|----|----|
|Xử lý dữ liệu|Dữ liệu có cấu trúc|Dữ liệu có cấu trúc và phi cấu trúc|
|Dữ liệu lớn|Hiệu suất giảm khi xử lý dữ liệu lớn|Hỗ trợ xử lý dữ liệu lớn|
|Schema|Có schema được định trước|Không có schema hoặc có thể thay đổi tự do|
|Giao dịch|Hỗ trợ giao dịch để đảm bảo tính nhất quán|Không hỗ trợ giao dịch, khó đảm bảo tính nhất quán|
|Chức năng tìm kiếm|Cung cấp chức năng tìm kiếm phức tạp như join|Cung cấp chức năng tìm kiếm đơn giản|
|Khả năng mở rộng|Không phù hợp với môi trường cụm|Phù hợp với môi trường cụm|
|Giấy phép|Chi phí giấy phép cao|Mã nguồn mở|
|Ví dụ|MySQL, PostgreSQL, Oracle, Microsoft SQL Server, MariaDB|MongoDB, Redis|
