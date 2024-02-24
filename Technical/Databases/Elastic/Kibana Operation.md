---
title: Kibana Operation
tags:
  - kibana
  - elastic
categories: 
date created: 2024-02-24
date modified: 2024-02-24
---

# Vận hành Kibana

Thông qua Kibana, bạn có thể trực quan hóa Elasticsearch của mình và điều hướng trong Elastic Stack, cho phép bạn thực hiện các hoạt động khác nhau, từ theo dõi tải truy vấn đến hiểu cách các yêu cầu chảy qua toàn bộ ứng dụng của bạn.

## 1. Cài đặt

### 1.1. Yêu cầu hệ thống

Phiên bản: Elastic Stack 7.4

### 1.2. Các bước cài đặt

Các bước cài đặt như sau:

1. Tải gói phiên bản yêu cầu từ [trang tải xuống chính thức của Kibana](https://www.elastic.co/downloads/kibana) và giải nén nó trên máy cục bộ của bạn.
2. Sửa tệp cấu hình `config/kibana.yml` và đặt `elasticsearch.url` để trỏ đến Elasticsearch của bạn.
3. Chạy `bin/kibana` (hoặc `bin\kibana.bat` trên Windows).
4. Truy cập Kibana trong trình duyệt của bạn tại địa chỉ <http://localhost:5601>.

## 2. Sử dụng

### 2.1. Khám phá (Discover)

Nhấp vào `Discover` trong thanh điều hướng bên để truy cập chức năng truy vấn dữ liệu của Kibana.

![img](https://www.elastic.co/guide/en/kibana/current/images/tutorial-discover.png)

Trong thanh tìm kiếm, bạn có thể nhập các điều kiện truy vấn Elasticsearch để tìm kiếm dữ liệu của bạn. Bạn có thể duyệt qua kết quả trên trang `Discover` và tạo các trực quan hóa với các điều kiện tìm kiếm đã lưu trên trang `Visualize`.

Mẫu chỉ mục hiện tại được hiển thị dưới thanh tìm kiếm. Mẫu chỉ mục xác định các chỉ mục nào được tìm kiếm khi truy vấn được gửi. Để tìm kiếm một tập hợp chỉ mục khác, hãy chọn một mẫu khác từ menu thả xuống. Để thêm một mẫu chỉ mục, điều hướng đến `Management/Kibana/Index Patterns` và nhấp vào `Add New`.

Bạn có thể xây dựng các truy vấn bằng cách sử dụng tên trường và các giá trị quan tâm. Đối với các trường số, bạn có thể sử dụng các toán tử so sánh như lớn hơn (>), nhỏ hơn (<) hoặc bằng (=). Bạn có thể kết hợp các yếu tố với các toán tử logic `AND`, `OR` và `NOT`, tất cả viết hoa.

Mặc định, mỗi tài liệu khớp hiển thị tất cả các trường. Để chọn các trường tài liệu muốn hiển thị, di chuột qua danh sách "Các trường có sẵn" và nhấp vào nút thêm bên cạnh mỗi trường bạn muốn bao gồm. Ví dụ, nếu chỉ thêm account_number, hiển thị sẽ thay đổi thành một danh sách đơn giản chứa năm tài khoản:

![img](https://www.elastic.co/guide/en/kibana/6.1/images/tutorial-discover-3.png)

Thanh tìm kiếm trong Kibana tuân theo cú pháp chuỗi truy vấn được mô tả trong tài liệu [query-string-syntax](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax).

Dưới đây là một số cú pháp truy vấn cơ bản nhất.

#### 2.1.1. Tên trường

Như đã mô tả trong truy vấn chuỗi truy vấn, mặc định sẽ tìm kiếm trường default_field trong điều kiện tìm kiếm, nhưng bạn có thể chỉ định các trường khác trong cú pháp truy vấn:

Ví dụ:

- Tìm kiếm từ khóa "active" trong trường `status`

```
status:active
```

- Tìm kiếm từ khóa "quick" hoặc "brown" trong trường `title`. Nếu bạn bỏ qua toán tử `OR`, toán tử mặc định sẽ được sử dụng.

```
title:(quick OR brown)
title:(quick brown)
```

- Tìm kiếm cụm từ chính xác "John Smith" trong trường `author`.

```
author:"John Smith"
```

- Tìm kiếm từ khóa "quick" hoặc "brown" trong bất kỳ trường nào (`book.title`, `book.content`, hoặc `book.date`). Lưu ý cách sử dụng `\*` để đại diện cho ký tự đại diện.

```
book.\*:(quick brown)
```

- Tìm kiếm các tài liệu có trường `title` chứa bất kỳ giá trị khác null nào.

```
_exists_:title
```

#### 2.1.2. Ký tự đại diện

ELK cung cấp hai ký tự đại diện là `?` và `*`.

- `?` đại diện cho bất kỳ ký tự duy nhất nào;
- `*` đại diện cho bất kỳ số ký tự nào, bao gồm cả không có ký tự.

```
qu?ck bro*
```

> **Lưu ý: Truy vấn ký tự đại diện sẽ sử dụng nhiều bộ nhớ và có hiệu suất thực hiện kém, vì vậy hãy sử dụng cẩn thận.** > **Gợi ý**: Truy vấn ký tự đại diện thuần túy `*` được viết dưới dạng truy vấn [exists](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-exists-query.html) để cải thiện hiệu suất truy vấn. Do đó, truy vấn `field:*` sẽ khớp với các tài liệu chứa giá trị rỗng như `{ "field": "" }`, nhưng không khớp nếu trường bị mất hoặc giá trị được đặt thành null như `{ "field": null }`. > **Gợi ý**: Truy vấn bằng ký tự đại diện ở đầu từ (ví dụ: `*ing`) có lượng truy vấn đặc biệt lớn, vì tất cả các thuật ngữ trong chỉ mục phải được kiểm tra trong trường hợp có khớp. Bằng cách đặt `allow_leading_wildcard` thành `false`, bạn có thể tắt tính năng này.

#### 2.1.3. Biểu thức chính quy

Bạn có thể sử dụng biểu thức chính quy bằng cách bao bọc nó trong dấu `/` trong chuỗi truy vấn.

Ví dụ:

```
name:/joh?n(ath[oa]n)/
```

Cú pháp biểu thức chính quy được hỗ trợ có thể được tham khảo tại: [Regular expression syntax](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html#regexp-syntax)

#### 2.1.4. Truy vấn mờ

Chúng ta có thể sử dụng toán tử `~` để thực hiện truy vấn mờ.

Ví dụ:

Giả sử chúng ta thực sự muốn tìm kiếm

```
quick brown forks
```

Nhưng do lỗi chính tả, từ khóa truy vấn của chúng ta trở thành như sau, nhưng vẫn có thể tìm thấy kết quả mong muốn.

```
quikc~ brwn~ foks~
```

Truy vấn mờ này sử dụng khoảng cách Damerau-Levenshtein để tìm tất cả các mục khớp có tối đa hai thay đổi. Thay đổi có thể là việc chèn, xóa hoặc thay thế một ký tự đơn, hoặc hoán đổi vị trí của hai ký tự liền kề.

Khoảng cách chỉnh sửa mặc định là `2`, nhưng khoảng cách chỉnh sửa là `1` thường đủ để bắt được 80% lỗi chính tả của con người. Nó có thể được chỉ định như sau:

```
quikc~1
```

#### 2.1.5. Tìm kiếm gần đúng

Mặc dù truy vấn cụm từ (ví dụ: `john smith`) mong đợi tất cả các thuật ngữ trong cụm từ đó có cùng thứ tự hoàn toàn, nhưng tìm kiếm gần đúng cho phép chỉ định các từ cụ thể được tách ra hoặc sắp xếp theo thứ tự khác nhau. Giống như truy vấn mờ có thể chỉ định khoảng cách chỉnh sửa tối đa cho các ký tự trong từ, tìm kiếm gần đúng cũng cho phép chúng ta chỉ định khoảng cách chỉnh sửa tối đa cho các từ trong cụm từ:

Ví dụ:

```
"fox quick"~5
```

Càng gần văn bản trong trường với thứ tự ban đầu được chỉ định trong chuỗi truy vấn, tài liệu đó càng được coi là liên quan. So với truy vấn ví dụ trên, cụm từ `"quick fox"` sẽ được coi là gần giống điều kiện truy vấn hơn `"quick brown fox"`.

#### 2.1.6. Phạm vi

Chúng ta có thể chỉ định phạm vi cho các trường ngày tháng, số hoặc chuỗi. Phạm vi đóng cửa được chỉ định bằng cặp dấu ngoặc vuông `[min TO max]` và phạm vi mở được chỉ định bằng cặp dấu ngoặc nhọn `{min TO max}`.

Hãy xem một số ví dụ.

- Tất cả các ngày trong năm 2012

```
date:[2012-01-01 TO 2012-12-31]
```

- Số từ 1 đến 5

```
count:[1 TO 5]
```

- Các nhãn nằm giữa `alpha` và `omega`, không bao gồm `alpha` và `omega`

```
tag:{alpha TO omega}
```

- Số lớn hơn hoặc bằng 10

```
count:[10 TO *]
```

- Tất cả các ngày trước năm 2012

```
date:{* TO 2012-01-01}
```

Ngoài ra, phạm vi mở và đóng cũng có thể được kết hợp sử dụng

- Mảng từ 1 đến 5, nhưng không bao gồm số 5

```
count:[1 TO 5}
```

Phạm vi không bị ràng buộc ở một bên cũng có thể được sử dụng với cú pháp sau:

```
age:>10
age:>=10
age:<10
age:<=10
```

Tất nhiên, bạn cũng có thể sử dụng toán tử AND để lấy giao của hai kết quả truy vấn:

```
age:(>=10 AND <20)
age:(+>=10 +<20)
```

#### 2.1.7. Boosting

Sử dụng toán tử `^` để làm cho một thuật ngữ quan trọng hơn một thuật ngữ khác. Ví dụ, nếu chúng ta muốn tìm kiếm tất cả các tài liệu liên quan đến con cáo, nhưng chúng ta đặc biệt quan tâm đến con cáo:

```
quick^2 fox
```

Giá trị tăng cường mặc định là 1, nhưng nó có thể là bất kỳ số thực dương nào. Giá trị tăng cường từ 0 đến 1 giảm tính liên quan.

Tăng cường cũng có thể được áp dụng cho cụm từ hoặc nhóm:

```
"john smith"^2   (foo bar)^4
```

#### 2.1.8. Phép toán Boolean

Mặc định, chỉ cần một từ khớp, tất cả các từ đều là tùy chọn. Tìm kiếm `foo bar baz` sẽ tìm kiếm bất kỳ tài liệu nào chứa một hoặc nhiều từ trong `foo`, `bar` hoặc `baz`. Chúng ta đã thảo luận về `default_operator` ở trên, cho phép bạn yêu cầu tất cả các mục, nhưng cũng có các toán tử Boolean có thể sử dụng trong chuỗi truy vấn để cung cấp sự kiểm soát nhiều hơn.

Các toán tử được ưu tiên sử dụng là `+` (thuật ngữ này phải tồn tại) và `-` (thuật ngữ này không được tồn tại). Tất cả các thuật ngữ khác là tùy chọn. Ví dụ, truy vấn này:

```
quick brown +fox -news
```

Truy vấn này có nghĩa là:

- `fox` phải tồn tại
- `news` không được tồn tại
- `quick` và `brown` là tùy chọn

Các toán tử quen thuộc `AND`, `OR` và `NOT` (cũng có thể được viết là `&&`, `||` và `!`) cũng được hỗ trợ. Tuy nhiên, các toán tử này có mức độ ưu tiên nhất định: `NOT` ưu tiên hơn `AND`, `AND` ưu tiên hơn `OR`. Mặc dù `+` và `-` chỉ ảnh hưởng đến thuật ngữ bên phải của toán tử, nhưng `AND` và `OR` ảnh hưởng đến cả thuật ngữ bên trái và bên phải.

#### 2.1.9. Nhóm

Nhiều thuật ngữ hoặc mệnh đề có thể được kết hợp trong cặp dấu ngoặc tròn để tạo thành một truy vấn con:

```
(quick OR brown) AND fox
```

Có thể sử dụng nhóm để xác định trường cụ thể hoặc cải thiện kết quả của truy vấn con:

```
status:(active OR pending) title:(full text search)^2
```

#### 2.1.10. Từ khóa đặc biệt

Nếu bạn cần sử dụng bất kỳ ký tự nào trong truy vấn của mình là một toán tử (thay vì một toán tử), bạn nên sử dụng dấu gạch chéo ngược để tránh chúng. Ví dụ, để tìm kiếm (1 + 1) = 2, bạn cần viết truy vấn là `\(1\+1\)\=2`

Các ký tự đặc biệt là: `+ - = && || > < ! ( ) { } [ ] ^ " ~ * ? : \ /`

Không thể thoát các ký tự đặc biệt này một cách chính xác có thể dẫn đến lỗi cú pháp và ngăn truy vấn của bạn hoạt động.

#### 2.1.11. Truy vấn trống

Nếu chuỗi truy vấn là trống hoặc chỉ chứa khoảng trắng, truy vấn sẽ tạo ra một tập kết quả trống.

### 2.2. Trực quan hóa

Để hiển thị dữ liệu của bạn dưới dạng trực quan, hãy nhấp vào `Visualize` trong thanh điều hướng bên.

Công cụ Visualize cho phép bạn xem dữ liệu theo nhiều cách khác nhau, chẳng hạn như biểu đồ tròn, biểu đồ cột, biểu đồ đường, biểu đồ phân phối, v.v. Để bắt đầu, hãy nhấp vào `Create a visualization` hoặc nút `+` màu xanh lá cây.

![https://www.elastic.co/guide/en/kibana/6.1/images/tutorial-visualize-landing.png](https://www.elastic.co/guide/en/kibana/6.1/images/tutorial-visualize-landing.png)

Có nhiều loại trực quan hóa để lựa chọn.

![https://www.elastic.co/guide/en/kibana/6.1/images/tutorial-visualize-wizard-step-1.png](https://www.elastic.co/guide/en/kibana/6.1/images/tutorial-visualize-wizard-step-1.png)

Dưới đây, chúng ta sẽ tạo một số ví dụ biểu đồ:

#### 2.2.1. Pie

Bạn có thể xây dựng một trực quan hóa từ tìm kiếm đã lưu hoặc nhập điều kiện tìm kiếm mới. Để nhập điều kiện tìm kiếm mới, trước tiên bạn cần chọn một mẫu chỉ mục để xác định chỉ mục bạn muốn tìm kiếm.

Mặc định, tìm kiếm khớp với tất cả các tài liệu. Ban đầu, một "miếng" chứa toàn bộ biểu đồ tròn:

![https://www.elastic.co/guide/en/kibana/6.1/images/tutorial-visualize-pie-1.png](https://www.elastic.co/guide/en/kibana/6.1/images/tutorial-visualize-pie-1.png)

Để chỉ định dữ liệu nào hiển thị trong biểu đồ, hãy sử dụng bucket aggregation của Elasticsearch. Grouping aggregation chỉ là việc phân loại tài liệu khớp với điều kiện tìm kiếm của bạn thành các danh mục khác nhau, còn được gọi là bucket.

Định nghĩa một bucket cho mỗi phạm vi:

1. Nhấp vào `Split Slices`.
2. Chọn `Terms` trong danh sách `Aggregation`. _Lưu ý: Các thuật ngữ ở đây là các trường hoặc nhãn đã được xác định khi thu thập dữ liệu Elk_.
3. Chọn `level.keyword` trong danh sách `Field`.
4. Nhấp vào ![images/apply-changes-button.png](https://www.elastic.co/guide/en/kibana/6.1/images/apply-changes-button.png) để cập nhật biểu đồ.

![image.png](https://upload-images.jianshu.io/upload_images/3101171-7fb2042dc6d59520.png)

Sau khi hoàn thành, nếu bạn muốn lưu biểu đồ này, bạn có thể nhấp vào nút `Save` ở phía trên trang.

#### 2.2.2. Vertical Bar

Chúng ta sẽ xem cách tạo biểu đồ cột dọc.

1. Nhấp vào `Create a visualization` hoặc nút `+` màu xanh lá cây. Chọn `Vertical Bar`.
2. Chọn mẫu chỉ mục. Vì bạn chưa xác định bất kỳ bucket nào, bạn sẽ thấy một thanh lớn hiển thị tổng số tài liệu khớp với truy vấn mặc định.
3. Chỉ định trường đại diện cho trục Y.
4. Chỉ định trường đại diện cho trục X.
5. Nhấp vào ![images/apply-changes-button.png](https://www.elastic.co/guide/en/kibana/6.1/images/apply-changes-button.png) để cập nhật biểu đồ.

![image.png](https://upload-images.jianshu.io/upload_images/3101171-5aa7627284c19a56.png)

Sau khi hoàn thành, nếu bạn muốn lưu biểu đồ này, bạn có thể nhấp vào nút `Save` ở phía trên trang.

### 2.3. Báo cáo

`Báo cáo (Dashboard)` cho phép tổng hợp và chia sẻ tập hợp `Visualize`.

1. Nhấp vào `Dashboard` trong thanh điều hướng bên.
2. Nhấp vào `Thêm hiển thị từ danh sách Visualize đã lưu`.
3. Nhấp vào `Visualize` đã lưu trước đó, sau đó nhấp vào mũi tên nhỏ ở cuối danh sách để đóng danh sách Visualize.
4. Khi di chuột qua đối tượng Visualize, các điều khiển container sẽ hiển thị cho phép bạn chỉnh sửa, di chuyển, xóa và điều chỉnh kích thước đối tượng Visualize.

## 3. FAQ

### 3.1. Cảnh báo Kibana No Default Index Pattern

**Câu hỏi:** Sau khi cài đặt ELK, khi truy cập trang Kibana, tôi nhận được cảnh báo lỗi sau:

```
Warning No default index pattern. You must select or create one to continue.
...
Unable to fetch mapping. Do you have indices matching the pattern?
```

Điều này cho thấy logstash không ghi nhật ký vào elasticsearch.

**Giải pháp:**

Kiểm tra xem có vấn đề gì về giao tiếp giữa logstash và elasticsearch, thường là vấn đề nằm ở đây.

## 4. Tài liệu tham khảo

- [Trang web chính thức của Kibana](https://www.elastic.co/cn/products/kibana)
- [Kibana Github](https://github.com/elastic/kibana)
- [Tài liệu chính thức của Kibana](https://www.elastic.co/guide/en/kibana/current/index.html)
