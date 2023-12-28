---
title: MySQL Interview Part 1
tags: [interview, db, mysql]
categories: [interview, db, mysql]
date created: 2023-08-19
date modified: 2023-08-19
---

# MySQL Interview Q&A Part 1

## Khác biệt giữa cơ sở dữ liệu quan hệ và cơ sở dữ liệu phi quan hệ là gì?

- Ưu điểm của cơ sở dữ liệu quan hệ:
  - Dễ hiểu vì nó sử dụng mô hình quan hệ để tổ chức dữ liệu.
  - Có thể duy trì tính nhất quán của dữ liệu.
  - Chi phí cập nhật dữ liệu thấp.
  - Hỗ trợ truy vấn phức tạp (có mệnh đề WHERE).
- Ưu điểm của cơ sở dữ liệu phi quan hệ:
  - Không cần thông qua lớp SQL, tốc độ đọc/ghi cao.
  - Dựa trên cặp khóa-giá trị, khả năng mở rộng dữ liệu tốt.
  - Có thể lưu trữ nhiều loại dữ liệu khác nhau như hình ảnh, tài liệu, v.v.

## Cơ sở dữ liệu phi quan hệ là gì?

Cơ sở dữ liệu phi quan hệ, còn được gọi là NOSQL, sử dụng hình thức lưu trữ dưới dạng cặp khóa-giá trị.

Nó có hiệu suất đọc/ghi cao, dễ mở rộng và có thể chia thành cơ sở dữ liệu trong bộ nhớ và cơ sở dữ liệu tài liệu như Redis, MongoDB, HBase, v.v.

Các tình huống phù hợp để sử dụng cơ sở dữ liệu phi quan hệ:

- Hệ thống ghi nhật ký (log).
- Lưu trữ vị trí địa lý.
- Dữ liệu lớn.
- Độ tin cậy cao.

## Tại sao lại sử dụng chỉ mục?

- Tạo chỉ mục duy nhất giúp đảm bảo tính duy nhất của mỗi dòng dữ liệu trong bảng cơ sở dữ liệu.
- Có thể cải thiện đáng kể tốc độ truy vấn dữ liệu, đây cũng là lý do chính để tạo chỉ mục.
- Giúp tránh sắp xếp và bảng tạm thời trên máy chủ.
- Chuyển từ I/O ngẫu nhiên sang I/O tuần tự.
- Có thể tăng tốc kết nối giữa các bảng, đặc biệt là trong việc thực hiện tính toán dữ liệu tham chiếu.

## Tại sao Innodb sử dụng ID tự tăng làm khóa chính?

Nếu bảng sử dụng khóa chính tự tăng, mỗi lần chèn bản ghi mới, bản ghi sẽ được thêm vào vị trí tiếp theo của nút chỉ mục hiện tại. Khi một trang đã đầy, một trang mới sẽ tự động được tạo ra.

Nếu sử dụng khóa chính không tự tăng (như số CMND hoặc số sinh viên), vì mỗi lần chèn giá trị khóa gần như ngẫu nhiên, bản ghi mới sẽ được chèn vào một vị trí ở giữa của trang chỉ mục hiện tại. Điều này dẫn đến việc tạo ra nhiều đoạn rời rạc và không tối ưu, và sau đó cần sử dụng OPTIMIZE TABLE để xây dựng lại bảng và tối ưu hóa trang.

## Sự khác biệt giữa MyISAM và InnoDB trong cách triển khai chỉ mục B-tree là gì?

- MyISAM: Trường data trong nút lá của B+Tree lưu trữ địa chỉ bản ghi dữ liệu. Trong quá trình truy vấn chỉ mục, đầu tiên sẽ tìm kiếm chỉ mục theo thuật toán tìm kiếm B+Tree, nếu khóa được chỉ định tồn tại, giá trị data sẽ được lấy ra và sau đó dùng giá trị data làm địa chỉ để đọc bản ghi tương ứng. Đây được gọi là "chỉ mục phi cụm".
- InnoDB: Tệp dữ liệu chính của nó đã được tổ chức thành một cấu trúc chỉ mục B+Tree, nút lá của cây chứa dữ liệu hoàn chỉnh. Chính vì vậy, tệp dữ liệu của bảng chính là chỉ mục chính, được gọi là "chỉ mục cụm" hoặc "chỉ mục gom nhóm". Các chỉ mục khác được coi là chỉ mục phụ, data trong nút lá của chúng lưu trữ giá trị khóa chính của bản ghi tương ứng thay vì địa chỉ.

## MySQL thực hiện một câu SQL như thế nào? Có những bước cụ thể nào?

Các bước thực hiện SQL trong lớp Server theo thứ tự là:

1. Yêu cầu từ khách hàng ->
2. Kết nối (Connector) (xác thực danh tính người dùng, cấp quyền) ->
3. Bộ nhớ cache truy vấn (Query Cache) (nếu có cache, trả về kết quả trực tiếp, nếu không, tiếp tục thực hiện các bước tiếp theo) ->
4. Phân tích cú pháp (Parser) (phân tích cú pháp và ngữ pháp của SQL) ->
5. Tối ưu hóa (Optimizer) (tạo kế hoạch thực hiện và chọn chỉ mục tối ưu) ->
6. Thực thi (Executor) (thực thi truy vấn, kiểm tra quyền truy cập) ->
7. Truy xuất dữ liệu từ lớp Storage Engine (lấy dữ liệu từ lớp lưu trữ) (nếu bật cache truy vấn, kết quả truy vấn sẽ được lưu vào cache)

Tóm lại:

- **Kết nối (Connector)**: Quản lý kết nối, xác thực người dùng.
- **Bộ nhớ cache truy vấn (Query Cache)**: Nếu có cache truy vấn, trả về kết quả trực tiếp.
- **Phân tích cú pháp (Parser)**: Phân tích cú pháp và ngữ pháp của SQL (kiểm tra xem các trường dữ liệu trong câu truy vấn có tồn tại không).
- **Tối ưu hóa (Optimizer)**: Tạo kế hoạch thực hiện và chọn chỉ mục tối ưu.
- **Thực thi (Executor)**: Thực thi câu truy vấn, kiểm tra quyền truy cập.
- **Truy xuất dữ liệu từ lớp Storage Engine**: Lấy dữ liệu từ lớp lưu trữ (nếu bật cache truy vấn, kết quả truy vấn sẽ được lưu vào cache).

## Bạn hiểu về cấu trúc bên trong của MySQL không? Thông thường nó có thể được chia thành hai phần nào?

MySQL có thể chia thành hai phần chính: lớp dịch vụ (Server layer) và lớp lưu trữ (Storage Engine layer).

**Lớp dịch vụ (Server layer)** bao gồm các thành phần như Connector, Query Cache, Parser, Optimizer và Executor. Nó quản lý các kết nối đến cơ sở dữ liệu, xác thực người dùng, tạo và quản lý bộ nhớ cache truy vấn, phân tích cú pháp và tối ưu hóa truy vấn, và thực thi truy vấn.

**Lớp lưu trữ (Storage Engine layer)** là phần chịu trách nhiệm lưu trữ và truy xuất dữ liệu. MySQL hỗ trợ nhiều loại lưu trữ khác nhau như InnoDB, MyISAM, Memory, v.v. Mỗi loại lưu trữ có cách lưu trữ và quản lý dữ liệu riêng.

Lớp dịch vụ và lớp lưu trữ là độc lập và có thể được thay đổi một cách riêng lẻ. Điều này cho phép MySQL linh hoạt trong việc lựa chọn lưu trữ phù hợp với yêu cầu và tối ưu hiệu suất của hệ thống.

## Nói về điểm chung và khác biệt giữa Drop, Delete và Truncate

### **Câu trả lời thứ nhất**

Drop, Delete và Truncate đều có ý nghĩa là xóa dữ liệu, nhưng ba thao tác này có một số khác biệt:

**Delete** được sử dụng để xóa toàn bộ hoặc một phần dữ liệu trong bảng. Sau khi thực hiện delete, người dùng cần phải commit hoặc rollback để thực hiện hoặc hủy bỏ việc xóa, và nó sẽ kích hoạt tất cả các trigger delete trên bảng đó.

**Truncate** xóa tất cả dữ liệu trong bảng. Thao tác này không thể rollback và không kích hoạt bất kỳ trigger nào trên bảng đó. Truncate nhanh hơn delete và chiếm ít không gian hơn.

**Drop** xóa bảng khỏi cơ sở dữ liệu, bao gồm tất cả các dòng dữ liệu, chỉ mục và quyền truy cập. Tất cả các trigger DML cũng sẽ không được kích hoạt. Thao tác này không thể rollback.

Vì vậy, khi không cần bảng nữa, sử dụng Drop; khi muốn xóa một phần dữ liệu, sử dụng Delete; khi muốn giữ lại bảng nhưng xóa tất cả dữ liệu, sử dụng Truncate.

### **Câu trả lời thứ hai**

- Drop: Xóa toàn bộ bảng.
- Truncate: Xóa dữ liệu trong bảng, khi chèn lại dữ liệu, các giá trị tự tăng sẽ bắt đầu từ 1.
- Delete: Xóa dữ liệu trong bảng, có thể sử dụng mệnh đề WHERE.

### **Phân tích cụ thể**

1. DELETE thực hiện việc xóa bằng cách xóa từng dòng một trong bảng và ghi lại các hoạt động xóa này trong nhật ký giao dịch để có thể rollback. TRUNCATE TABLE xóa tất cả dữ liệu trong bảng một cách đồng loạt mà không ghi lại trong nhật ký giao dịch, do đó không thể rollback. Ngoài ra, TRUNCATE TABLE không kích hoạt các trigger xóa liên quan đến bảng.
2. Kích thước bảng và chỉ mục: Khi bảng được TRUNCATE, kích thước của bảng và chỉ mục sẽ trở về kích thước ban đầu, trong khi DELETE không giảm kích thước bảng và chỉ mục.
3. Thông thường, drop > truncate > delete.
4. Phạm vi áp dụng: TRUNCATE chỉ áp dụng cho bảng; DELETE có thể áp dụng cho bảng và view.
5. TRUNCATE và DELETE chỉ xóa dữ liệu, trong khi DROP xóa cả bảng (cấu trúc và dữ liệu).
6. truncate và delete không xóa cấu trúc bảng (định nghĩa), trong khi drop xóa cấu trúc bảng, ràng buộc phụ thuộc (constrain), trigger và chỉ mục (index) liên quan đến bảng. Các stored procedure / function phụ thuộc vào bảng đó sẽ được giữ lại, nhưng trạng thái của chúng sẽ trở thành: invalid.
7. DELETE là câu lệnh DML (Data Manipulation Language), hoạt động này được lưu trữ trong rollback segment và chỉ có hiệu lực sau khi giao dịch được commit. Nếu có trigger tương ứng, nó sẽ được kích hoạt khi thực thi.
8. TRUNCATE và DROP là câu lệnh DDL (Data Definition Language), hoạt động này có hiệu lực ngay lập tức, dữ liệu gốc không được lưu trong rollback segment và không thể rollback.
9. Trong trường hợp không có bản sao lưu, hãy cẩn thận khi sử dụng drop và truncate. Để xóa một phần dữ liệu, hãy sử dụng delete với mệnh đề where để giới hạn phạm vi ảnh hưởng. Đảm bảo rollback segment đủ lớn. Để xóa bảng, sử dụng drop. Nếu bạn muốn giữ lại bảng nhưng xóa tất cả dữ liệu, nếu không liên quan đến giao dịch, hãy sử dụng truncate. Nếu liên quan đến giao dịch hoặc muốn kích hoạt trigger, hãy sử dụng delete.
10. Truncate table table_name nhanh và hiệu quả vì: truncate table trong chức năng tương tự như delete không có WHERE mệnh đề: cả hai đều xóa tất cả các hàng trong bảng. Tuy nhiên, TRUNCATE TABLE nhanh hơn DELETE và sử dụng ít tài nguyên hệ thống và nhật ký giao dịch. DELETE xóa từng dòng một và ghi lại mỗi dòng đã xóa trong nhật ký giao dịch.
11. TRUNCATE TABLE xóa tất cả các hàng trong bảng, nhưng cấu trúc bảng và các cột, ràng buộc, chỉ mục, v.v. vẫn được giữ nguyên. Giá trị đếm hàng mới sử dụng lại giá trị khởi tạo cho cột. Nếu bạn muốn giữ giá trị đếm hàng, hãy sử dụng DELETE thay vì TRUNCATE TABLE.
12. Đối với các bảng được tham chiếu bởi ràng buộc FOREIGN KEY, không thể sử dụng TRUNCATE TABLE mà phải sử dụng DELETE mà không có WHERE mệnh đề. TRUNCATE TABLE không được ghi lại trong nhật ký, do đó không kích hoạt trigger.

## Bạn có hiểu về tối ưu hóa MySQL không? Hãy nêu một số khía cạnh có thể làm để tối ưu hiệu suất?

- Tạo chỉ mục cho các trường tìm kiếm.
- Tránh sử dụng `Select *`, chỉ liệt kê các trường cần truy vấn.
- Phân tách dữ liệu và bảng theo chiều dọc.
- Chọn đúng lựa chọn lưu trữ (storage engine).

## Các cấp độ cô lập trong cơ sở dữ liệu

- **Đọc chưa xác nhận** (READ-UNCOMMITTED): Trong một giao dịch, các thay đổi đã xảy ra có thể được nhìn thấy bởi các giao dịch khác ngay cả khi chưa được xác nhận. Ví dụ, nếu một số A ban đầu là 50 và sau đó được thay đổi thành 100 trong một giao dịch nhưng chưa được xác nhận, một giao dịch khác có thể nhìn thấy thay đổi này. Khi giao dịch gốc bị hủy, số A sẽ trở lại 50, nhưng giao dịch khác sẽ thấy A là 100. **Có thể gây ra đọc bẩn, đọc không nhất quán hoặc đọc không lặp lại**.
- **Đọc đã xác nhận** (READ-COMMITTED): Các thay đổi trong một giao dịch không thể nhìn thấy bởi các giao dịch khác cho đến khi giao dịch đã được xác nhận. Ví dụ, nếu số A ban đầu là 50 và sau đó được thay đổi thành 100 trong một giao dịch và sau đó được xác nhận, một giao dịch khác sẽ không thể nhìn thấy thay đổi này cho đến khi giao dịch gốc đã được xác nhận. **Có thể ngăn chặn đọc bẩn, nhưng vẫn có thể xảy ra đọc không nhất quán hoặc đọc không lặp lại**.
- **Đọc lặp lại** (REPEATABLE-READ): Đọc lại một bản ghi nhiều lần sẽ cho kết quả giống nhau. Ví dụ, nếu đọc số A nhiều lần, kết quả đọc sẽ không thay đổi. **Có thể ngăn chặn đọc bẩn và đọc không lặp lại, nhưng vẫn có thể xảy ra đọc không nhất quán**.
- **Đọc có thể tuần tự hóa** (SERIALIZABLE): Trong môi trường đồng thời, kết quả đọc sẽ giống như khi thực hiện tuần tự. Ví dụ, không có đọc bẩn, đọc không nhất quán hoặc đọc không lặp lại. **Cấp độ này có thể ngăn chặn đọc bẩn, đọc không nhất quán và đọc không lặp lại**.

| Cấp độ cô lập                       | Đọc bẩn | Đọc không lặp lại | Đọc ảo |
| ----------------------------------- | ------- | ----------------- | ------------------ |
| READ-UNCOMMITTED Đọc chưa xác nhận  | √       | √                 | √                  |
| READ-COMMITTED Đọc đã xác nhận      | ×       | √                 | √                  |
| REPEATABLE-READ Đọc lặp lại         | ×       | ×                 | √                  |
| SERIALIZABLE Đọc có thể tuần tự hóa | ×       | ×                 | ×                  |

Mặc định của MySQL InnoDB Storage Engine hỗ trợ cấp độ cô lập là **REPEATABLE-READ** (có thể lặp lại).

**Điều cần lưu ý là**: Khác với tiêu chuẩn SQL, InnoDB Storage Engine sử dụng thuật toán khóa Next-Key Lock trong cấp độ cô lập REPEATABLE-READ, do đó có thể tránh được hiện tượng đọc ảo, điều này khác với các hệ thống cơ sở dữ liệu khác (như SQL Server). Vì vậy, mặc định của InnoDB Storage Engine đã đáp ứng đầy đủ yêu cầu cô lập giao dịch, đạt đến cấp độ cô lập SERIALIZABLE của tiêu chuẩn SQL.

Vì cấp độ cô lập càng thấp thì yêu cầu khóa của giao dịch càng ít, nên hầu hết các hệ thống cơ sở dữ liệu đều sử dụng cấp độ cô lập READ-COMMITTED (đã xác nhận đọc). Tuy nhiên, bạn cần biết rằng việc sử dụng mặc định của InnoDB Storage Engine là REPEATABLE-READ (có thể lặp lại) không gây mất hiệu suất nào.

Trong trường hợp giao dịch phân tán, InnoDB Storage Engine thường sử dụng cấp độ cô lập SERIALIZABLE (có thể tuần tự hóa).

## Lý do chính tại sao cơ sở dữ liệu sử dụng cây B+ thay vì cây B?

Lý do chính: Cây B+ chỉ cần duyệt qua các nút lá để duyệt qua toàn bộ cây, trong khi trong cơ sở dữ liệu, truy vấn dựa trên phạm vi là rất phổ biến, trong khi cây B chỉ có thể duyệt qua tất cả các nút theo thứ tự trung tâm, hiệu suất quá thấp.

## Tại sao cả chỉ mục tệp và chỉ mục cơ sở dữ liệu sử dụng cây B+?

Cả tệp chỉ mục và chỉ mục cơ sở dữ liệu đều cần lưu trữ lượng dữ liệu lớn, có nghĩa là chúng không thể được lưu trữ toàn bộ trong bộ nhớ, mà phải lưu trữ trên đĩa cứng. Và để tìm kiếm và truy xuất dữ liệu nhanh chóng, cấu trúc chỉ mục cần được tổ chức sao cho giảm thiểu số lần truy xuất đĩa I/O trong quá trình tìm kiếm. Do đó, cây B+ là lựa chọn tốt hơn so với cây B. Hệ thống cơ sở dữ liệu khéo léo sử dụng nguyên lý về tính cục bộ và nguyên lý đọc trước của đĩa cứng, bằng cách đặt kích thước của mỗi nút bằng kích thước của một trang, điều này cho phép mỗi nút chỉ cần một lần I/O để tải hoàn toàn, trong khi cấu trúc như cây đỏ-đen có chiều cao rõ ràng sâu hơn nhiều và vì lý do logic, các nút gần nhau (cha con) có thể cách xa nhau vật lý, không thể tận dụng được tính cục bộ.

Quan trọng nhất, cây B+ còn có một lợi ích lớn nhất: dễ quét toàn bộ cơ sở dữ liệu.

Cây B+ cho phép quét từng nút lá một mà không cần sắp xếp theo thứ tự, trong khi cây B phải sử dụng phương pháp duyệt theo trình tự để quét toàn bộ cơ sở dữ liệu, điều này là không hiệu quả. Cây B+ hỗ trợ truy vấn theo khoảng rất dễ dàng, trong khi cây B không hỗ trợ, đây là lý do chính mà cơ sở dữ liệu chọn cây B+.

Cây B+ cung cấp hiệu suất truy vấn ổn định hơn, trong khi cây B có thể tìm thấy dữ liệu ở các nút trung gian, độ ổn định không đủ.

## Bạn đã nghe về khái niệm "view" chưa? Còn "cursor"?

- **View** là một bảng ảo, thường là một tập con của các hàng hoặc cột từ một hoặc nhiều bảng, có chức năng tương tự như bảng vật lý.
- **Cursor** là một cách để hiệu quả xử lý tập kết quả truy vấn. Thông thường, không sử dụng cursor, nhưng khi cần xử lý dữ liệu từng hàng một, cursor trở nên quan trọng.

## Tại sao MySQL cần có cơ chế rollback trong giao dịch?

Trong hệ quản trị cơ sở dữ liệu MySQL, cơ chế phục hồi được thực hiện thông qua ghi nhật ký rollback (undo log), tất cả các thay đổi trong giao dịch đều được ghi vào nhật ký rollback trước khi được ghi vào cơ sở dữ liệu. Khi giao dịch đã được xác nhận, không thể rollback lại.

Nhật ký rollback có các vai trò sau:

1) Cung cấp thông tin liên quan đến việc rollback khi xảy ra lỗi hoặc người dùng thực hiện ROLLBACK.

2) Khi toàn bộ hệ thống gặp sự cố hoặc quá trình cơ sở dữ liệu bị giết, khi người dùng khởi động lại quá trình cơ sở dữ liệu, có thể ngay lập tức rollback các giao dịch chưa hoàn thành trước đó bằng cách truy vấn nhật ký rollback, điều này yêu cầu nhật ký rollback phải được ghi trước khi dữ liệu được ghi vào đĩa, đây là lý do chúng ta cần ghi nhật ký trước khi ghi cơ sở dữ liệu.

## Sự khác biệt giữa công cụ cơ sở dữ liệu InnoDB và MyISAM

### **InnoDB**

- Là công cụ lưu trữ giao dịch mặc định của MySQL, chỉ khi cần các tính năng không được hỗ trợ bởi InnoDB mới xem xét sử dụng công cụ lưu trữ khác.
- Hỗ trợ bốn cấp độ cô lập tiêu chuẩn, cấp độ mặc định là Repeatable Read. Ở cấp độ cô lập Repeatable Read, sử dụng kiểm soát đồng thời phiên bản nhiều (MVCC) + khóa khoảng trống (Next-Key Locking) để ngăn chặn hiện tượng đọc ảo.
- Chỉ mục chính là chỉ mục nhóm, lưu trữ dữ liệu trong chỉ mục, giúp tránh việc đọc trực tiếp từ đĩa, do đó cải thiện hiệu suất truy vấn.
- Có nhiều tối ưu hóa nội bộ, bao gồm đọc dự đoán khi đọc dữ liệu từ đĩa, chỉ mục băm tự động tạo và tăng tốc thao tác chèn thông qua bộ đệm chèn.
- Hỗ trợ sao lưu nóng thực sự. Các công cụ lưu trữ khác không hỗ trợ sao lưu nóng thực sự, để có được một góc nhìn nhất quán, cần dừng việc ghi vào tất cả các bảng, trong khi trong kịch bản kết hợp đọc và ghi, dừng việc ghi có thể có nghĩa là dừng việc đọc.

### **MyISAM**

- Thiết kế đơn giản, dữ liệu được lưu trữ dưới dạng định dạng gọn gàng. Vẫn có thể sử dụng nếu dữ liệu chỉ đọc hoặc bảng nhỏ và có thể chịu được hoạt động sửa chữa.
- Cung cấp nhiều tính năng, bao gồm bảng nén, chỉ mục dữ liệu không gian, v.v.
- Không hỗ trợ giao dịch.
- Không hỗ trợ khóa cấp hàng, chỉ có thể khóa toàn bộ bảng, khi đọc, khóa chia sẻ được áp dụng cho tất cả các bảng cần đọc, khi ghi, khóa độc quyền được áp dụng cho bảng. Tuy nhiên, trong khi bảng có hoạt động đọc, vẫn có thể chèn bản ghi mới vào bảng, điều này được gọi là chèn đồng thời (CONCURRENT INSERT).

### **Tổng kết**

- Giao dịch: InnoDB hỗ trợ giao dịch, có thể sử dụng các câu lệnh `Commit` và `Rollback`.
- Đồng thời: MyISAM chỉ hỗ trợ khóa cấp bảng, trong khi InnoDB còn hỗ trợ khóa cấp hàng.
- Khóa ngoại: InnoDB hỗ trợ khóa ngoại.
- Sao lưu: InnoDB hỗ trợ sao lưu nóng thực sự.
- Khôi phục sau sự cố: Khả năng bị hỏng của MyISAM sau sự cố cao hơn nhiều so với InnoDB và thời gian khôi phục cũng chậm hơn.
- Các tính năng khác: MyISAM hỗ trợ bảng nén và chỉ mục dữ liệu không gian.

## Các vấn đề mà giao dịch đồng thời trong cơ sở dữ liệu gây ra là gì?

Giao dịch đồng thời trong cơ sở dữ liệu có thể gây ra bốn vấn đề phổ biến: đọc bẩn (dirty read), đọc không nhất quán (non-repeatable read), mất thay đổi (lost update) và đọc ảo (phantom read).

**Đọc bẩn (Dirty Read)**: Khi giao dịch thứ nhất thực hiện một thay đổi và giao dịch thứ hai đọc dữ liệu trước khi giao dịch thứ nhất được xác nhận, gây ra việc đọc dữ liệu không chính xác.

**Đọc không nhất quán (Non-repeatable Read)**: Khi giao dịch thứ nhất đọc một hàng dữ liệu và giao dịch thứ hai thực hiện một thay đổi trên hàng đó và xác nhận, khi giao dịch thứ nhất đọc lại hàng đó, dữ liệu đã thay đổi, gây ra đọc không nhất quán.

**Mất thay đổi (Lost Update)**: Khi hai giao dịch cùng thay đổi dữ liệu cùng một lúc, giao dịch thứ hai ghi đè lên thay đổi của giao dịch thứ nhất, dẫn đến mất mát các thay đổi của giao dịch thứ nhất.

**Đọc ảo (Phantom Read)**: Khi giao dịch thứ nhất đọc một tập hợp dữ liệu dựa trên một điều kiện và giao dịch thứ hai thực hiện một thay đổi trong tập hợp dữ liệu đó và xác nhận, khi giao dịch thứ nhất đọc lại tập hợp dữ liệu đó, dữ liệu đã thay đổi, gây ra đọc ảo.

## Nguyên lý và ứng dụng của khóa bi quan và khóa lạc quan trong cơ sở dữ liệu là gì?

- **Khóa bi quan**: Khóa bi quan là khi trước khi thực hiện các hoạt động kinh doanh, trước tiên lấy khóa, sau đó thực hiện các hoạt động kinh doanh. Thông thường, câu lệnh `SELECT … FOR UPDATE` được sử dụng để khóa dữ liệu, tránh sự thay đổi không mong muốn từ các giao dịch khác. Khóa bi quan được sử dụng để đảm bảo tính nhất quán và đồng thời trong cơ sở dữ liệu.
- **Khóa lạc quan**: Khóa lạc quan là khi trước tiên thực hiện các hoạt động kinh doanh và chỉ kiểm tra và cập nhật dữ liệu khi cuối cùng thực hiện các hoạt động kinh doanh. AtomicFieldUpdater trong gói Java Concurrency là một ví dụ về khóa lạc quan, nó sử dụng cơ chế CAS (Compare and Swap) và không khóa dữ liệu, mà thay vào đó so sánh thời gian hoặc số phiên bản để xác định phiên bản mong muốn.

## Hai cấu trúc dữ liệu chính được sử dụng cho các chỉ mục trong MySQL là gì?

- **Chỉ mục băm (Hash Index)**: Chỉ mục băm sử dụng cấu trúc dữ liệu bảng băm dưới cùng. Đối với chỉ mục băm, dữ liệu được lưu trữ trong một bảng băm, giúp tìm kiếm dữ liệu nhanh chóng. Tuy nhiên, chỉ mục băm không hỗ trợ các truy vấn dựa trên phạm vi và không duy trì thứ tự sắp xếp của dữ liệu.
- **Chỉ mục cây B (B-Tree Index)**: Chỉ mục cây B trong MySQL sử dụng cây B+Tree. Chỉ mục cây B là một cấu trúc dữ liệu cây nhị phân cân bằng, cho phép tìm kiếm và truy cập dữ liệu theo thứ tự. Cây B+Tree được sử dụng rộng rãi trong MySQL vì khả năng hỗ trợ truy vấn dựa trên phạm vi và duy trì thứ tự sắp xếp của dữ liệu.

## Tại sao cần phân chia cơ sở dữ liệu thành nhiều database và bảng? Tại sao không thể đặt tất cả trong một database hoặc một bảng?

Mục đích của việc phân chia cơ sở dữ liệu thành nhiều database và bảng là để giảm tải cho cơ sở dữ liệu, cải thiện hiệu suất truy vấn và rút ngắn thời gian truy vấn.

**Phân chia bảng**: Phân chia bảng giúp giảm tải cho cơ sở dữ liệu, phân tán áp lực lên nhiều bảng khác nhau, đồng thời giảm kích thước của mỗi bảng, cải thiện hiệu suất truy vấn và rút ngắn thời gian truy vấn. Ngoài ra, nó cũng giúp giảm tải khóa bảng.

Phân chia bảng có thể được chia thành hai loại: phân chia theo chiều dọc và phân chia theo chiều ngang.

- Phân chia theo chiều dọc (Vertical Partitioning): Tách các cột của bảng thành các bảng con riêng biệt, mỗi bảng con chứa một số cột. Điều này thích hợp khi có các cột có tần suất truy cập khác nhau hoặc có kích thước lớn.
- Phân chia theo chiều ngang (Horizontal Partitioning): Chia dữ liệu thành các phân đoạn dựa trên các hàng hoặc phạm vi giá trị của một cột. Điều này thích hợp khi có lượng dữ liệu lớn và cần phân tán dữ liệu trên nhiều máy chủ.

**Phân chia database**: Phân chia cơ sở dữ liệu thành nhiều database giúp phân tán dữ liệu và giảm tải cho cơ sở dữ liệu chính. Điều này có thể cải thiện hiệu suất truy vấn và rút ngắn thời gian truy vấn. Ngoài ra, việc phân chia cơ sở dữ liệu còn giúp quản lý dữ liệu dễ dàng hơn và cung cấp tính bảo mật cao hơn.

Tuy nhiên, việc phân chia cơ sở dữ liệu và bảng cũng đồng thời đặt ra một số thách thức, bao gồm việc quản lý dữ liệu phân tán, xử lý truy vấn phức tạp và đồng bộ hóa dữ liệu giữa các phần. Do đó, việc phân chia cơ sở dữ liệu và bảng cần được thực hiện cẩn thận và dựa trên yêu cầu cụ thể của ứng dụng.

## Sự khác biệt giữa đọc không lặp lại và đọc ảo là gì? Bạn có thể cho tôi một ví dụ?

**Đọc không nhất quán (Non-repeatable Read)**: xảy ra khi một giao dịch đọc dữ liệu hai lần và giữa hai lần đọc, một giao dịch khác thực hiện một thay đổi trên dữ liệu đó và xác nhận. Khi giao dịch ban đầu đọc lại dữ liệu, nó sẽ thấy dữ liệu đã thay đổi, dẫn đến không thể lặp lại kết quả đọc ban đầu.

Ví dụ: Giao dịch A đọc một hàng dữ liệu có giá trị là 100, sau đó giao dịch B thực hiện một thay đổi trên hàng đó và xác nhận. Khi giao dịch A đọc lại hàng đó, giá trị đã thay đổi và không còn giống với lần đọc ban đầu.

**Đọc ảo (Phantom Read)**: xảy ra khi một giao dịch đọc một tập hợp dữ liệu dựa trên một điều kiện và giữa hai lần đọc, một giao dịch khác thêm hoặc xóa dữ liệu trong tập hợp đó và xác nhận. Khi giao dịch ban đầu đọc lại tập hợp dữ liệu, nó sẽ thấy số lượng bản ghi đã thay đổi, dẫn đến hiện tượng đọc ảo.

Ví dụ: Giao dịch A đọc một tập hợp các bản ghi có giá trị lớn hơn 3000 và tìm thấy 4 bản ghi. Trong khi giao dịch A đang thực hiện, giao dịch B thêm một bản ghi có giá trị lớn hơn 3000. Khi giao dịch A đọc lại tập hợp dữ liệu, số lượng bản ghi đã thay đổi và không còn giống với lần đọc ban đầu.

## Có 4 loại chỉ mục trong MySQL, bạn có thể nói sơ qua về chúng được không?

- **FULLTEXT**: Đây là loại chỉ mục toàn văn, hiện tại chỉ được hỗ trợ bởi MyISAM Engine. Nó có thể được sử dụng trong CREATE TABLE, ALTER TABLE, CREATE INDEX, nhưng chỉ có thể tạo chỉ mục toàn văn trên cột CHAR, VARCHAR và TEXT. Cần lưu ý rằng từ phiên bản MySQL 5.6 trở đi đã hỗ trợ chỉ mục toàn văn, trong khi trước đó không hỗ trợ.
- **HASH**: Với tính chất duy nhất (gần như 100% duy nhất) và dạng khóa giá trị tương tự, chỉ mục HASH rất phù hợp để sử dụng làm chỉ mục. Chỉ mục HASH có thể xác định vị trí trực tiếp mà không cần tìm kiếm qua các tầng như chỉ mục cây, do đó có hiệu suất rất cao. Tuy nhiên, hiệu suất cao này chỉ áp dụng cho các điều kiện "=" và "in", trong khi đối với các truy vấn phạm vi, sắp xếp và chỉ mục kết hợp thì hiệu suất không cao.
- **BTREE**: Chỉ mục BTREE là một cấu trúc dữ liệu cây (cây nhị phân) trong đó các giá trị chỉ mục được lưu trữ theo một thuật toán nhất định. Mỗi lần truy vấn, cây được duyệt từ gốc (root) và tiếp tục duyệt qua các nút (node) để đến lá (leaf). Đây là loại chỉ mục mặc định và phổ biến nhất trong MySQL.
- **RTREE**: Chỉ mục RTREE ít được sử dụng trong MySQL, chỉ hỗ trợ kiểu dữ liệu geometry và chỉ có một số loại lưu trữ hỗ trợ, bao gồm MyISAM, BDb, InnoDb, NDb và Archive. So với BTREE, RTREE có ưu điểm trong việc tìm kiếm phạm vi.

## Tác dụng của view là gì? Có thể thay đổi không?

View là một bảng ảo, khác với bảng chứa dữ liệu, view chỉ chứa các truy vấn để truy xuất dữ liệu khi sử dụng; không chứa bất kỳ cột hoặc dữ liệu nào. Sử dụng view có thể đơn giản hóa các hoạt động SQL phức tạp, ẩn đi các chi tiết cụ thể, bảo vệ dữ liệu; sau khi tạo view, có thể sử dụng chúng như bảng thông thường.

View không thể được tạo chỉ mục, cũng không thể có trigger hoặc giá trị mặc định liên kết; nếu view chính nó có mệnh đề order by, thì mệnh đề order by sẽ bị ghi đè.

Tạo view: create view xxx as xxxx

Đối với một số view như không sử dụng các truy vấn con liên kết, các hàm nhóm tổng hợp như Distinct Union, có thể cập nhật view này; việc cập nhật view sẽ cập nhật bảng cơ sở dữ liệu; tuy nhiên, view chủ yếu được sử dụng để đơn giản hóa truy vấn, bảo vệ dữ liệu và hầu hết các view không thể cập nhật.

## Tại sao nói rằng cây B+ thích hợp hơn cây B trong việc tạo chỉ mục cho hệ thống tệp và chỉ mục cơ sở dữ liệu trong ứng dụng thực tế?

Cây B+ có chi phí đọc/ghi đĩa thấp hơn và hiệu suất truy vấn của nó ổn định hơn.  
Lý do chính mà chỉ mục cơ sở dữ liệu sử dụng cây B+ thay vì cây B là vì cây B+ chỉ cần duyệt qua các nút lá để duyệt qua toàn bộ cây, và trong cơ sở dữ liệu, truy vấn dựa trên phạm vi là rất phổ biến, trong khi cây B chỉ có thể duyệt qua tất cả các nút theo thứ tự trung tố, hiệu suất quá thấp.

**Đặc điểm của cây B+**

- Tất cả các khóa xuất hiện trong danh sách liên kết của các nút lá (chỉ mục dày đặc), và các khóa trong danh sách liên kết này được sắp xếp theo thứ tự;
- Không thể truy cập vào các nút không phải lá;
- Các nút không phải lá tương đương với chỉ mục của các nút lá (chỉ mục thưa thớt), các nút lá tương đương với lưu trữ dữ liệu (khóa).

## Một câu hỏi về tình huống: Nếu công ty mà bạn đang làm chọn cơ sở dữ liệu MySQL để lưu trữ dữ liệu, với hơn 50.000 bản ghi tăng lên mỗi ngày, dự kiến duy trì trong ba năm, bạn có những biện pháp tối ưu nào?

- Thiết kế cấu trúc cơ sở dữ liệu tốt, cho phép một phần dữ liệu trùng lặp, tránh truy vấn kết hợp để tăng hiệu suất.
- Chọn kiểu dữ liệu trường bảng và cơ sở dữ liệu lưu trữ phù hợp, thêm chỉ mục một cách hợp lý.
- Sao lưu đọc/ghi chính và phụ của MySQL.
- Phân chia bảng theo quy tắc, giảm số lượng dữ liệu trong một bảng để tăng tốc độ truy vấn.
- Thêm cơ chế bộ nhớ đệm, chẳng hạn như Memcached, Apc, v.v.
- Tạo trang tĩnh cho các trang ít thay đổi.
- Viết các câu lệnh SQL hiệu quả. Ví dụ: SELECT * FROM TABLE thay bằng SELECT field_1, field_2, field_3 FROM TABLE.

## 25. Khi nào cần tạo chỉ mục cho cơ sở dữ liệu?

Cần tạo chỉ mục trên các trường được sử dụng thường xuyên nhất, được sử dụng để giới hạn phạm vi truy vấn hoặc cần sắp xếp.  

1. Không nên tạo chỉ mục trên các cột ít được sử dụng trong truy vấn hoặc chứa nhiều giá trị trùng lặp.  
2. Không nên tạo chỉ mục trên các loại dữ liệu đặc biệt như trường văn bản (text) và các loại dữ liệu tương tự.

## Chỉ số bao phủ là gì?

Nếu một chỉ mục chứa (hoặc "phủ") tất cả các giá trị của các trường cần truy vấn, chúng ta gọi đó là "chỉ số bao phủ".

Chúng ta biết rằng trong động cơ lưu trữ InnoDB, nếu không phải là chỉ mục khóa chính, các nút lá lưu trữ khóa chính + giá trị cột. Cuối cùng, chúng ta vẫn cần "truy vấn lại" bằng cách tìm kiếm thông qua khóa chính, điều này sẽ làm chậm quá trình truy vấn. "chỉ số bao phủ" là khi các cột cần truy vấn và chỉ mục tương ứng với chúng được phủ khớp, không cần thực hiện thêm bước "truy vấn lại"!
