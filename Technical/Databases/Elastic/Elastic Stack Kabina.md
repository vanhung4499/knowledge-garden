---
title: Elastic Stack Kabina
tags:
  - elastic
  - kibana
categories: 
date created: 2024-02-24
date modified: 2024-02-24
---

# Elastic Stack: Kibana

## Discover

Bằng cách nhấp vào `Discover` trong thanh điều hướng bên, bạn có thể xem chức năng truy vấn dữ liệu của `Kibana`.

![img](https://www.elastic.co/guide/en/kibana/current/images/tutorial-discover.png)

Trong thanh tìm kiếm, bạn có thể nhập điều kiện truy vấn Elasticsearch để tìm kiếm dữ liệu của mình. Bạn có thể duyệt kết quả trên trang `Discover` và tạo các biểu đồ trực quan từ các tìm kiếm đã lưu trên trang `Visualize`.

Mô hình chỉ mục hiện tại được hiển thị dưới thanh truy vấn. Mô hình chỉ mục xác định chỉ mục nào được tìm kiếm khi gửi truy vấn. Để tìm kiếm một tập hợp chỉ mục khác nhau, chọn một mô hình khác từ menu thả xuống. Để thêm mô hình chỉ mục (index pattern), hãy chuyển đến `Management/Kibana/Index Patterns` và nhấp vào `Add New`.

Bạn có thể xây dựng tìm kiếm bằng cách sử dụng tên trường và giá trị bạn quan tâm. Đối với các trường số, bạn có thể sử dụng các toán tử so sánh như lớn hơn (>), nhỏ hơn (<) hoặc bằng (=). Bạn có thể liên kết các phần tử với các toán tử logic `AND`, `OR` và `NOT`, tất cả đều viết hoa.

Mặc định, mỗi tài liệu khớp sẽ hiển thị tất cả các trường. Để chọn các trường tài liệu để hiển thị, di chuyển chuột qua danh sách "Available fields", sau đó nhấp vào nút thêm bên cạnh mỗi trường bạn muốn bao gồm. Ví dụ, nếu chỉ thêm account_number, hiển thị sẽ thay đổi thành danh sách đơn giản bao gồm năm số tài khoản:

![img](https://www.elastic.co/guide/en/kibana/6.1/images/tutorial-discover-3.png)

### Ngữ pháp truy vấn

Thanh tìm kiếm của Kibana tuân thủ ngữ pháp truy vấn được mô tả trong tài liệu [query-string-syntax](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax).

Dưới đây là một số ngữ pháp truy vấn cơ bản.

Chuỗi truy vấn sẽ được phân tích thành một loạt các thuật ngữ và toán tử. Một thuật ngữ có thể là một từ (như: quick, brown) hoặc một cụm từ được bao quanh bởi dấu ngoặc kép (như "quick brown").

Các hoạt động truy vấn cho phép bạn tùy chỉnh tìm kiếm - dưới đây là các tùy chọn có sẵn.

#### Tên trường

Như đã nói trong truy vấn chuỗi, sẽ tìm kiếm `default_field` trong điều kiện tìm kiếm, nhưng bạn cũng có thể chỉ định các trường khác trong cú pháp truy vấn:

Ví dụ:

- Tìm kiếm từ khóa `active` trong trường `status`

```
status:active
```

- Trường `title` chứa từ khóa `quick` hoặc `brown`. Nếu bạn bỏ qua toán tử `OR`, toán tử mặc định sẽ được sử dụng

```
title:(quick OR brown)
title:(quick brown)
```

- Trường tác giả tìm cụm từ chính xác "John Smith", tức là tìm kiếm chính xác.

```
author:"John Smith"
```

- Bất kỳ trường nào `book.title`, `book.content` hoặc `book.date` đều chứa `quick` hoặc `brown` (lưu ý làm thế nào chúng tôi sử dụng `\*` để biểu thị ký tự đại diện)

```
book.\*:(quick brown)
```

- Trường tiêu đề chứa bất kỳ giá trị không null nào

```
_exists_:title
```

#### Ký tự đại diện

ELK cung cấp hai ký tự đại diện là ? và \*.

- `?` biểu thị bất kỳ ký tự đơn nào;
- `*` biểu thị bất kỳ không hoặc nhiều ký tự.

```
qu?ck bro*
```

> **Chú ý: Truy vấn ký tự đại diện sẽ sử dụng rất nhiều bộ nhớ và hiệu suất thực thi không tốt, vì vậy hãy sử dụng cẩn thận.** > **Gợi ý**: Ký tự đại diện tinh khiết `*` được viết vào truy vấn [exists](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-exists-query.html), điều này đã cải thiện hiệu suất truy vấn. Do đó, ký tự đại diện `field：*` sẽ khớp với tài liệu chứa giá trị trống, như: `{“field”：“”}`, nhưng nếu trường bị mất hoặc giá trị được đặt thành null thì sẽ không khớp, như: `“field”：null}` > **Gợi ý**: Sử dụng ký tự đại diện ở đầu một từ (ví dụ: `*ing`) tạo ra một lượng truy vấn rất lớn, vì tất cả các thuật ngữ trong chỉ mục đều cần được kiểm tra, chỉ trong trường hợp nó khớp. Bạn có thể vô hiệu hóa điều này bằng cách đặt `allow_leading_wildcard` thành `false`.

#### Biểu thức chính quy

Bạn có thể sử dụng biểu thức chính quy trong chuỗi truy vấn bằng cách đặt chúng vào `/`.

Ví dụ:

```
name:/joh?n(ath[oa]n)/
```

Cú pháp biểu thức chính quy được hỗ trợ có thể được tham khảo tại: [Regular expression syntax](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html#regexp-syntax)

#### Truy vấn mờ

Chúng ta có thể sử dụng toán tử `~` để thực hiện truy vấn mờ.

Ví dụ:

Giả sử chúng ta thực sự muốn truy vấn

```
quick brown forks
```

Nhưng, do lỗi đánh máy, từ khóa truy vấn của chúng ta trở thành như sau, chúng ta vẫn có thể tìm thấy kết quả mong muốn.

```
quikc\~ brwn\~ foks\~
```

Truy vấn mờ này sử dụng khoảng cách Damerau-Levenshtein để tìm tất cả các mục khớp với tối đa hai thay đổi. Các thay đổi được đề cập ở đây là việc chèn, xóa hoặc thay thế một ký tự duy nhất, hoặc hoán đổi hai ký tự liền kề.

Khoảng cách chỉnh sửa mặc định là `2`, nhưng khoảng cách chỉnh sửa `1` nên đủ để bắt được 80% lỗi đánh máy của con người. Nó có thể được chỉ định như:

```
quikc\~1
```

#### Tìm kiếm xấp xỉ

Mặc dù truy vấn cụm từ (ví dụ, `john smith`) mong đợi tất cả các từ đều theo đúng thứ tự, nhưng tìm kiếm xấp xỉ cho phép các từ được chỉ định ở xa hơn hoặc được sắp xếp theo thứ tự khác nhau. Giống như truy vấn mờ có thể chỉ định khoảng cách chỉnh sửa tối đa cho các ký tự trong một từ, tìm kiếm xấp xỉ cũng cho phép chúng ta chỉ định khoảng cách chỉnh sửa tối đa cho các từ trong một cụm từ:

Ví dụ

```
"fox quick"\~5
```

Văn bản trong trường càng gần với thứ tự gốc được chỉ định trong chuỗi truy vấn, tài liệu đó càng được coi là liên quan. Khi so sánh với truy vấn mẫu ở trên, cụm từ `"quick fox"` sẽ được coi là gần với điều kiện truy vấn hơn so với `"quick brown fox"`.

#### Phạm vi

Bạn có thể chỉ định phạm vi cho các trường ngày, số hoặc chuỗi. Phạm vi khoảng đóng được chỉ định bằng dấu ngoặc vuông `[min TO max]` và phạm vi khoảng mở được chỉ định bằng dấu ngoặc nhọn `{min TO max}`.

Hãy xem một số ví dụ.

- Tất cả các ngày trong năm 2012

```
date:[2012-01-01 TO 2012-12-31]
```

- Số từ 1 đến 5

```
count:[1 TO 5]
```

- Nhãn giữa `alpha` và `omega`, không bao gồm `alpha` và `omega`

```
tag:{alpha TO omega}
```

- Số lớn hơn 10

```
count:[10 TO *]
```

- Tất cả các ngày trước năm 2012

```
date:{* TO 2012-01-01}
```

Ngoài ra, bạn cũng có thể kết hợp khoảng mở và khoảng đóng

- Số từ 1 đến 5, nhưng không bao gồm 5

```
count:[1 TO 5}
```

Phạm vi không giới hạn ở một bên cũng có thể sử dụng cú pháp sau:

```
age:>10
age:>=10
age:<10
age:<=10
```

Tất nhiên, bạn cũng có thể sử dụng toán tử AND để nhận được giao của hai kết quả truy vấn

```
age:(>=10 AND <20)
age:(+>=10 +<20)
```

#### Boosting

Sử dụng toán tử `^` để làm cho một thuật ngữ trở nên quan trọng hơn một thuật ngữ khác. Ví dụ, nếu chúng ta muốn tìm tất cả các tài liệu liên quan đến cáo, nhưng chúng ta đặc biệt quan tâm đến từ "nhanh":

```
quick^2 fox
```

Giá trị tăng cường mặc định là 1, nhưng có thể là bất kỳ số dương nào. Tăng cường giữa 0 và 1 giảm độ liên quan.

Tăng cường cũng có thể được áp dụng cho cụm từ hoặc nhóm:

```
"john smith"^2   (foo bar)^4
```

#### Thao tác Boolean

Theo mặc định, tất cả các từ đều tùy chọn miễn là có một từ phù hợp. Tìm kiếm `foo bar baz` sẽ tìm kiếm bất kỳ tài liệu nào chứa một hoặc nhiều từ `foo` hoặc `bar` hoặc `baz`. Chúng tôi đã thảo luận về `default_operator` ở trên, cho phép bạn yêu cầu tất cả các mục, nhưng cũng có các toán tử Boolean có thể được sử dụng trong chuỗi truy vấn để cung cấp nhiều kiểm soát hơn.

Toán tử ưa thích là `+` (thuật ngữ này phải tồn tại) và `-` (thuật ngữ này không được tồn tại). Tất cả các thuật ngữ khác là tùy chọn. Ví dụ, truy vấn này:

```
quick brown +fox -news
```

Truy vấn này có nghĩa là:

- fox phải tồn tại
- news không được tồn tại
- quick và brown là tùy chọn

Các toán tử quen thuộc `AND`, `OR` và `NOT` (cũng được viết là `&&`, `||` và `!`) cũng được hỗ trợ. Tuy nhiên, các toán tử này có mức độ ưu tiên: `NOT` ưu tiên hơn `AND`, `AND` ưu tiên hơn `OR`. Mặc dù `+` và `-` chỉ ảnh hưởng đến thuật ngữ ở bên phải của toán tử, nhưng `AND` và `OR` sẽ ảnh hưởng đến thuật ngữ ở cả hai bên.

#### Nhóm

Nhiều thuật ngữ hoặc mệnh đề có thể được kết hợp bằng cặp dấu ngoặc để tạo ra một truy vấn con

```
(quick OR brown) AND fox
```

Bạn có thể sử dụng nhóm để định vị các trường cụ thể, hoặc để tăng cường kết quả của truy vấn con:

```
status:(active OR pending) title:(full text search)^2
```

#### Từ dự trữ

Nếu bạn cần sử dụng bất kỳ ký tự nào trong truy vấn của mình như một toán tử (thay vì là một toán tử), thì bạn nên sử dụng một dấu gạch chéo ngược để thoát khỏi chúng. Ví dụ, để tìm kiếm (1 + 1) = 2, bạn cần viết truy vấn là `\(1\+1\)\=2`

Các ký tự dự trữ là: `+ - = && || > < ! ( ) { } [ ] ^ " ~ * ? : \ /`

Không thể thoát đúng các ký tự đặc biệt này có thể dẫn đến lỗi cú pháp, ngăn chặn truy vấn của bạn.

#### Truy vấn rỗng

Nếu chuỗi truy vấn trống hoặc chỉ chứa khoảng trắng, truy vấn sẽ tạo ra một tập kết quả trống.

## Visualize

Để hiển thị dữ liệu của bạn dưới dạng trực quan, hãy nhấp vào `Visualize` trong thanh điều hướng bên.

Công cụ Visualize cho phép bạn xem dữ liệu theo nhiều cách khác nhau như biểu đồ tròn, biểu đồ cột, đồ thị đường, biểu đồ phân phối, v.v. Để bắt đầu, hãy nhấp vào `Create a visualization` màu xanh hoặc nút `+`.

![https://www.elastic.co/guide/en/kibana/6.1/images/tutorial-visualize-landing.png](https://www.elastic.co/guide/en/kibana/6.1/images/tutorial-visualize-landing.png)

Có nhiều loại trực quan hóa để lựa chọn.

![https://www.elastic.co/guide/en/kibana/6.1/images/tutorial-visualize-wizard-step-1.png](https://www.elastic.co/guide/en/kibana/6.1/images/tutorial-visualize-wizard-step-1.png)

Dưới đây là một số ví dụ về việc tạo biểu đồ:

### Pie

Bạn có thể xây dựng biểu đồ trực quan từ tìm kiếm đã lưu hoặc nhập điều kiện tìm kiếm mới. Để nhập điều kiện tìm kiếm mới, trước tiên cần chọn một mô hình chỉ mục để xác định chỉ mục cần tìm kiếm.

Mặc định, tìm kiếm khớp với tất cả các tài liệu. Ban đầu, một "phần" chứa toàn bộ biểu đồ tròn:

![https://www.elastic.co/guide/en/kibana/6.1/images/tutorial-visualize-pie-1.png](https://www.elastic.co/guide/en/kibana/6.1/images/tutorial-visualize-pie-1.png)

Để chỉ định dữ liệu nào được hiển thị trong biểu đồ, hãy sử dụng việc tổ chức chứa của Elasticsearch. Tổ chức chứa chỉ đơn giản là phân loại các tài liệu khớp với điều kiện tìm kiếm của bạn và được gọi là nhóm.

Xác định một tổ chức chứa cho mỗi phạm vi:

1. Nhấp vào `Split Slices`.
2. Chọn `Terms` trong danh sách `Aggregation`. Lưu ý: Ở đây, "Terms" là trường hoặc nhãn đã được định nghĩa khi thu thập dữ liệu Elk.
3. Chọn `level.keyword` trong danh sách `Field`.
4. Nhấp vào nút ![images/apply-changes-button.png](https://www.elastic.co/guide/en/kibana/6.1/images/apply-changes-button.png) để cập nhật biểu đồ.

![image.png](https://upload-images.jianshu.io/upload_images/3101171-7fb2042dc6d59520.png)

Sau khi hoàn thành, nếu bạn muốn lưu biểu đồ này, bạn có thể nhấp vào nút `Save` ở phía trên trang.

### Vertical Bar

Chúng ta hãy xem cách tạo biểu đồ cột dọc.

1. Nhấp vào `Create a visualization` màu xanh hoặc nút `+`. Chọn `Vertical Bar`.
2. Chọn mô hình chỉ mục. Vì bạn chưa xác định bất kỳ bucket nào, bạn sẽ thấy một thanh lớn hiển thị tổng số tài liệu khớp với truy vấn ký tự đại diện mặc định.
3. Xác định trường đại diện cho trục Y.
4. Xác định trường đại diện cho trục X.
5. Nhấp vào nút ![images/apply-changes-button.png](https://www.elastic.co/guide/en/kibana/6.1/images/apply-changes-button.png) để cập nhật biểu đồ.

![image.png](https://upload-images.jianshu.io/upload_images/3101171-5aa7627284c19a56.png)

Sau khi hoàn thành, nếu bạn muốn lưu biểu đồ này, bạn có thể nhấp vào nút `Save` ở phía trên trang.

## Dashboard

`Dashboard` cho phép tổng hợp và chia sẻ tập hợp `Visualize`.

1. Nhấp vào `Dashboard` trong thanh điều hướng bên.
2. Nhấp vào `Add` để hiển thị danh sách trực quan hóa đã lưu.
3. Nhấp vào `Visualize` đã lưu trước đó và sau đó nhấp vào mũi tên nhỏ ở cuối danh sách để đóng danh sách trực quan hóa.
4. Di chuột qua đối tượng trực quan sẽ hiển thị các điều khiển khung cho phép bạn chỉnh sửa, di chuyển, xóa và điều chỉnh kích thước đối tượng trực quan.
