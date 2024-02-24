---
title: Elasticsearch Mapping
tags:
  - elasticssearch
  - database
categories: 
date created: 2024-02-23
date modified: 2024-02-23
---

# Elasticsearch Mapping

Trong Elasticsearch, **`Mapping`** (ánh xạ) được sử dụng để xác định cách một tài liệu cùng với các trường bên trong nó được lưu trữ và lập chỉ mục. Mapping cho phép bạn xác định trước các thuộc tính như kiểu dữ liệu của các trường, trọng số của các trường, bộ phân tích từ và các thuộc tính khác, giống như việc thiết lập các trường khi tạo bảng trong cơ sở dữ liệu quan hệ.

Mapping sẽ ánh xạ tài liệu JSON thành định dạng phẳng mà Lucene cần.

Mỗi Mapping thuộc về một Type của chỉ mục.

- Mỗi tài liệu đều thuộc về một Type.
- Một Type có một định nghĩa Mapping.
- Từ phiên bản 7.0 trở đi, không cần phải chỉ định thông tin type trong định nghĩa Mapping.

Mỗi `document` là một tập hợp của `field`, mỗi `field` đều có kiểu dữ liệu của riêng nó. Khi ánh xạ dữ liệu, bạn có thể tạo một `mapping` chứa danh sách `field` liên quan đến `document`. Định nghĩa ánh xạ cũng bao gồm các `field` metadata, như `_source`, nó tùy chỉnh cách xử lý metadata liên quan đến `document`.

## Cách ánh xạ

Trong Elasticsearch, ánh xạ có thể được chia thành ánh xạ tĩnh và ánh xạ động. Trong cơ sở dữ liệu quan hệ, trước khi ghi dữ liệu, bạn cần tạo bảng và khai báo thuộc tính của các trường trong câu lệnh tạo bảng. Tuy nhiên, trong Elasticsearch, điều này không cần thiết. Một trong những tính năng quan trọng nhất của Elasticsearch là cho phép bạn bắt đầu khám phá dữ liệu càng nhanh càng tốt. Khi tài liệu được ghi vào Elasticsearch, nó sẽ tự động nhận biết kiểu dữ liệu của các trường. Cơ chế này được gọi là **ánh xạ động**. Trong khi đó, **ánh xạ tĩnh** là việc thiết lập thuộc tính của các trường trước khi ghi dữ liệu.

### Ánh xạ tĩnh

ES gọi ánh xạ tĩnh là **ánh xạ rõ ràng ([Explicit mapping](https://www.elastic.co/guide/en/elasticsearch/reference/current/explicit-mapping.html))**. **Ánh xạ tĩnh** là việc chỉ định rõ ràng ánh xạ chỉ mục khi tạo chỉ mục. Ánh xạ tĩnh tương tự như việc chỉ định thuộc tính trường trong câu lệnh tạo bảng trong SQL. So với ánh xạ động, thông qua ánh xạ tĩnh, bạn có thể thêm các thông tin cấu hình chi tiết và chính xác hơn. Ví dụ:

- Những trường chuỗi nào nên được coi là trường toàn văn bản.
- Những trường nào chứa số, ngày hoặc vị trí địa lý.
- Định dạng của giá trị ngày.
- Các quy tắc tùy chỉnh để kiểm soát việc thêm trường động.

【Ví dụ】Khi tạo chỉ mục, chỉ định rõ ràng mapping

```javascript
PUT /my-index-000001
{
  "mappings": {
    "properties": {
      "age":    { "type": "integer" },
      "email":  { "type": "keyword"  },
      "name":   { "type": "text"  }
    }
  }
}
```

【Ví dụ】Trong chỉ mục đã tồn tại, chỉ định thuộc tính của một trường

```javascript
PUT /my-index-000001/_mapping
{
  "properties": {
    "employee-id": {
      "type": "keyword",
      "index": false
    }
  }
}
```

【Ví dụ】Xem mapping

```
GET /my-index-000001/_mapping
```

【Ví dụ】Xem mapping của một trường cụ thể

```
GET /my-index-000001/_mapping/field/employee-id
```

### Ánh xạ động

Cơ chế ánh xạ động cho phép người dùng không cần định nghĩa thủ công ánh xạ, Elasticsearch sẽ tự động nhận biết kiểu dữ liệu của các trường. Trong các dự án thực tế, nếu đối tác không biết trước các trường nào sẽ xuất hiện trong dữ liệu được nhập vào, hoặc không rõ kiểu dữ liệu của các trường, việc sử dụng ánh xạ động sẽ rất phù hợp. Khi Elasticsearch gặp một trường chưa từng thấy trước đó trong một tài liệu, nó sẽ sử dụng ánh xạ động để xác định kiểu của trường và tự động thêm trường đó vào ánh xạ.

Ví dụ: Tạo một chỉ mục tên là `data`, với kiểu `mapping` là `_doc`, và có một trường kiểu `long` tên `count`.

```bash
PUT data/_doc/1
{ "count": 5 }
```

#### Ánh xạ động trường

Ánh xạ động trường ([Dynamic field mappings](https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic-field-mapping.html)) là quy tắc để quản lý việc phát hiện trường động. Khi Elasticsearch phát hiện một trường mới trong một tài liệu, theo mặc định, nó sẽ tự động thêm trường đó vào ánh xạ kiểu.

Trong ánh xạ, bạn có thể mở ánh xạ động bằng cách đặt tham số [`dynamic`](https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic.html) thành `true` hoặc `runtime`.

Các tùy chọn khác nhau của tham số [`dynamic`](https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic.html) có các chức năng như sau:

| Giá trị lựa chọn | Mô tả |
| --------------- | -------------------------------------------------------- |
| `true`          | Trường mới sẽ được thêm vào ánh xạ. Đây là cài đặt mặc định của ánh xạ. |
| `runtime`       | Trường mới sẽ được thêm vào ánh xạ và hoạt động như một trường runtime - những trường này sẽ không được lập chỉ mục nhưng có thể xuất hiện trong `_source` khi truy vấn. |
| `false`         | Trường mới sẽ không được lập chỉ mục hoặc tìm kiếm, nhưng vẫn sẽ xuất hiện trong trường `_source` trả về khi khớp. Những trường này sẽ không được thêm vào ánh xạ và bạn phải thêm trường mới một cách rõ ràng. |
| `strict`        | Nếu phát hiện trường mới, Elasticsearch sẽ ném ra ngoại lệ và từ chối tài liệu. Bạn phải thêm trường mới vào ánh xạ một cách rõ ràng. |

> Lưu ý: Đối với các trường đã tồn tại, một khi đã có dữ liệu được ghi vào, bạn không thể thay đổi định nghĩa trường. Nếu bạn muốn thay đổi kiểu dữ liệu của trường, bạn phải tái tạo chỉ mục. Điều này là do chỉ mục nghịch đảo của Lucene, một khi đã tạo, không thể thay đổi. Nếu bạn thay đổi kiểu dữ liệu của trường, điều này sẽ khiến các trường đã được lập chỉ mục không thể tìm kiếm.

Khi ánh xạ động trường được bật, Elasticsearch sử dụng các quy tắc được xây dựng để xác định cách ánh xạ kiểu dữ liệu cho mỗi trường. Các quy tắc như sau:

| **Kiểu dữ liệu JSON** | **`"dynamic":"true"`** | **`"dynamic":"runtime"`** |
| --------------------- | ---------------------- | ------------------------- |
| `null`                | Không có trường nào được thêm | Không có trường nào được thêm |
| `true` hoặc `false`   | Kiểu `boolean`         | Kiểu `boolean`            |
| Số thực               | Kiểu `float`           | Kiểu `double`             |
| Số                    | Kiểu `long`            | Kiểu `long`               |
| Đối tượng JSON        | Kiểu `object`          | Không có trường nào được thêm |
| Mảng                  | Quyết định bởi giá trị không rỗng đầu tiên trong mảng | Quyết định bởi giá trị không rỗng đầu tiên trong mảng |
| Chuỗi có bật [phát hiện ngày](https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic-field-mapping.html#date-detection) | Kiểu `date` | Kiểu `date` |
| Chuỗi có bật [phát hiện số](https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic-field-mapping.html#numeric-detection) | Kiểu `float` hoặc `long` | Kiểu `double` hoặc `long` |
| Chuỗi không bật bất cứ điều gì | Kiểu `text` với trường con `.keyword` | Kiểu `keyword` |

Dưới đây là một ví dụ về ánh xạ động. Tạo một chỉ mục mới trong Elasticsearch và xem ánh xạ của nó:

```bash
PUT books
GET books/_mapping
```

Lúc này ánh xạ của chỉ mục books là rỗng, kết quả trả về như sau:

```json
{
  "books": {
    "mappings": {}
  }
}
```

Tiếp theo, thêm một tài liệu vào chỉ mục books:

```bash
PUT books/it/1
{
	"id": 1,
	"publish_date": "2019-11-10",
	"name": "master Elasticsearch"
}
```

Sau khi thêm tài liệu, xem lại ánh xạ, kết quả trả về như sau:

```json
{
  "books": {
    "mappings": {
      "properties": {
        "id": {
          "type": "long"
        },
        "name": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "publish_date": {
          "type": "date"
        }
      }
    }
  }
}
```

Ánh xạ động đôi khi có thể nhận biết sai kiểu của trường, điều này có thể dẫn đến việc một số chức năng không hoạt động đúng, chẳng hạn như truy vấn Range. Vì vậy, khi sử dụng ánh xạ động, bạn cần xem xét nhu cầu kinh doanh thực tế. Nếu bạn sử dụng Elasticsearch như là lưu trữ dữ liệu chính và muốn ném ra ngoại lệ khi xuất hiện trường không xác định để gợi ý cho bạn vấn đề này, thì việc bật ánh xạ động không phù hợp.

#### Mẫu động

**Mẫu động** ([dynamic templates](https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic-templates.html)) là các quy tắc tùy chỉnh để thêm động các trường vào `mapping`.

Mẫu động có thể đặt điều kiện khớp, và chỉ khi những điều kiện này được đáp ứng thì mẫu động sẽ được sử dụng:

- `match_mapping_type` hoạt động trên kiểu dữ liệu được Elasticsearch phát hiện
- `match` và `unmatch` sử dụng so khớp mẫu cho tên trường
- `path_match` và `path_unmatch` hoạt động trên đường dẫn đầy đủ có dấu chấm của trường
- Nếu một mẫu động không định nghĩa `match_mapping_type`, `match`, hoặc `path_match`, nó sẽ không khớp với bất kỳ trường nào. Bạn vẫn có thể tham chiếu đến mẫu theo tên trong phần `dynamic_templates` của một yêu cầu hàng loạt.

**Ví dụ**: Khi thiết lập `'dynamic':'true'`, Elasticsearch ánh xạ các trường chuỗi như các trường văn bản với một trường con từ khóa. Nếu bạn chỉ đang lập chỉ mục nội dung có cấu trúc và không quan tâm đến tìm kiếm toàn văn, bạn có thể để Elasticsearch ánh xạ các trường chỉ dưới dạng trường từ khóa. Trong trường hợp này, những trường này chỉ có thể được tìm kiếm với một kết quả khớp chính xác.

```javascript
PUT my-index-000001
{
  "mappings": {
    "dynamic_templates": [
      {
        "strings_as_keywords": {
          "match_mapping_type": "string",
          "mapping": {
            "type": "keyword"
          }
        }
      }
    ]
  }
}
```

Trong ví dụ này, bất cứ khi nào một trường chuỗi mới được gặp, nó được ánh xạ như một trường từ khóa thay vì trường văn bản mặc định với một trường con từ khóa.

## Trường thời gian chạy

Trường thời gian chạy là các trường được đánh giá khi truy vấn. Trường thời gian chạy có các ứng dụng sau:

- Thêm trường vào tài liệu hiện có mà không cần lập chỉ mục lại dữ liệu
- Xử lý dữ liệu mà không cần hiểu cấu trúc dữ liệu
- Ghi đè giá trị trả về từ các trường đã lập chỉ mục khi truy vấn
- Định nghĩa trường cho mục đích cụ thể mà không cần sửa đổi cấu trúc cơ bản

Khi truy xuất Elasticsearch, không có sự khác biệt giữa trường thời gian chạy và các trường khác.

Cần lưu ý: Sử dụng tham số `fields` trên API `_search` để truy xuất giá trị của trường thời gian chạy. Trường thời gian chạy sẽ không hiển thị trong `_source`, nhưng API `fields` áp dụng cho tất cả các trường, kể cả những trường không được gửi như một phần của `_source` gốc.

Trường thời gian chạy rất hữu ích khi xử lý dữ liệu log, đặc biệt khi log có cấu trúc dữ liệu không chắc chắn: trong trường hợp này, tốc độ tìm kiếm sẽ giảm, nhưng kích thước chỉ mục của bạn sẽ nhỏ hơn nhiều, bạn có thể xử lý log nhanh hơn mà không cần thiết lập chỉ mục cho chúng.

### Ưu điểm của trường thời gian chạy

Vì **trường thời gian chạy không được lập chỉ mục**, việc thêm trường thời gian chạy sẽ không làm tăng kích thước chỉ mục. Người dùng có thể định nghĩa trường thời gian chạy trực tiếp trong mapping, giảm chi phí lưu trữ và tăng tốc độ thu thập dữ liệu. Sau khi định nghĩa trường thời gian chạy, bạn có thể sử dụng nó ngay lập tức trong yêu cầu tìm kiếm, tổng hợp, lọc và sắp xếp.

Nếu bạn đặt trường thời gian chạy làm trường chỉ mục, bạn không cần sửa đổi bất kỳ truy vấn nào tham chiếu đến trường thời gian chạy. Tốt hơn nữa, bạn có thể tham chiếu đến một số chỉ mục mà trường là trường thời gian chạy, cũng như một số chỉ mục khác mà trường là trường chỉ mục. Bạn có thể lựa chọn linh hoạt trường nào để lập chỉ mục và trường nào để giữ lại như trường thời gian chạy.

Về cơ bản, lợi ích quan trọng nhất của trường thời gian chạy là khả năng thêm trường vào tài liệu sau khi bạn đã trích xuất trường. Tính năng này đơn giản hóa quyết định về mapping, vì bạn không cần phải quyết định trước cách phân tích dữ liệu và bạn có thể sử dụng trường thời gian chạy để sửa đổi mapping bất cứ lúc nào. Sử dụng trường thời gian chạy cho phép chỉ mục nhỏ hơn và thời gian lấy dữ liệu nhanh hơn, điều này kết hợp với việc sử dụng ít tài nguyên hơn và giảm chi phí hoạt động của bạn.

## Kiểu dữ liệu trường

Trong Elasticsearch, mỗi trường đều có một kiểu dữ liệu trường hoặc kiểu trường, chỉ ra kiểu dữ liệu mà trường chứa (như chuỗi hoặc giá trị boolean) và mục đích dự kiến của nó. Các kiểu trường được nhóm theo series. Các kiểu trong cùng một series có hành vi tìm kiếm hoàn toàn giống nhau, nhưng có thể có sự khác biệt về việc sử dụng không gian hoặc đặc điểm hiệu suất.

Elasticsearch cung cấp rất nhiều kiểu dữ liệu, chúng được phân loại theo các nhóm sau:

- **Kiểu thông thường**
    
    - [`binary`](https://www.elastic.co/guide/en/elasticsearch/reference/current/binary.html): Giá trị nhị phân được mã hóa dưới dạng chuỗi Base64.
    - [`boolean`](https://www.elastic.co/guide/en/elasticsearch/reference/current/boolean.html): Kiểu boolean, giá trị là true hoặc false.
    - [Keywords](https://www.elastic.co/guide/en/elasticsearch/reference/current/keyword.html): Kiểu keyword, bao gồm `keyword`, `constant_keyword` và `wildcard`.
    - [Numbers](https://www.elastic.co/guide/en/elasticsearch/reference/current/number.html): Các kiểu số, như `long` và `double`
    - **Dates**: Các kiểu ngày, bao gồm [`date`](https://www.elastic.co/guide/en/elasticsearch/reference/current/date.html) và [`date_nanos`](https://www.elastic.co/guide/en/elasticsearch/reference/current/date_nanos.html).
    - [`alias`](https://www.elastic.co/guide/en/elasticsearch/reference/current/field-alias.html): Được sử dụng để xác định bí danh cho các trường hiện có.
- **Kiểu đối tượng**
    
    - [`object`](https://www.elastic.co/guide/en/elasticsearch/reference/current/object.html): Đối tượng JSON
    - [`flattened`](https://www.elastic.co/guide/en/elasticsearch/reference/current/flattened.html): Toàn bộ đối tượng JSON được xem như là một giá trị trường duy nhất.
    - [`nested`](https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html): Đối tượng JSON giữ lại mối quan hệ giữa các trường con của nó.
    - [`join`](https://www.elastic.co/guide/en/elasticsearch/reference/current/parent-join.html): Xác định mối quan hệ cha/con cho các tài liệu trong cùng một chỉ mục.
- **Kiểu dữ liệu có cấu trúc**
    
    - [Range](https://www.elastic.co/guide/en/elasticsearch/reference/current/range.html): Kiểu phạm vi, ví dụ: `long_range`, `double_range`, `date_range` và `ip_range`.
    - [`ip`](https://www.elastic.co/guide/en/elasticsearch/reference/current/ip.html): Địa chỉ IPv4 và IPv6.
    - [`version`](https://www.elastic.co/guide/en/elasticsearch/reference/current/version.html): Phiên bản. Hỗ trợ quy tắc ưu tiên [Semantic Versioning](https://semver.org/).
    - [`murmur3`](https://www.elastic.co/guide/en/elasticsearch/plugins/8.2/mapper-murmur3.html): Tính toán và lưu trữ giá trị hash.
- **Kiểu dữ liệu tổng hợp**
    
    - [`aggregate_metric_double`](https://www.elastic.co/guide/en/elasticsearch/reference/current/aggregate-metric-double.html): Giá trị chỉ số được tổng hợp trước
    - [`histogram`](https://www.elastic.co/guide/en/elasticsearch/reference/current/histogram.html): Giá trị số được tổng hợp trước theo dạng biểu đồ.
- **Kiểu tìm kiếm văn bản**
    
    - [`text` fields](https://www.elastic.co/guide/en/elasticsearch/reference/current/text.html): Kiểu text, bao gồm `text` và `match_only_text`.
    - [`annotated-text`](https://www.elastic.co/guide/en/elasticsearch/plugins/8.2/mapper-annotated-text.html): Văn bản chứa các dấu đánh dấu đặc biệt. Được sử dụng để nhận biết các thực thể được đặt tên.
    - [`completion`](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters.html#completion-suggester): Dùng cho tự động hoàn thành.
    - [`search_as_you_type`](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-as-you-type.html): Kiểu giống văn bản hoàn thành khi bạn gõ.
    - [`token_count`](https://www.elastic.co/guide/en/elasticsearch/reference/current/token-count.html): Đếm số lượng token trong văn bản.
- **Kiểu xếp hạng tài liệu**
    
    - [`dense_vector`](https://www.elastic.co/guide/en/elasticsearch/reference/current/dense-vector.html): Ghi lại vector dày đặc của số thực.
    - [`rank_feature`](https://www.elastic.co/guide/en/elasticsearch/reference/current/rank-feature.html): Ghi lại một đặc trưng số để tăng độ chính xác khi truy vấn.
    - [`rank_features`](https://www.elastic.co/guide/en/elasticsearch/reference/current/rank-features.html): Ghi lại nhiều đặc trưng số để tăng độ chính xác khi truy vấn.
- **Kiểu dữ liệu không gian**
    
    - [`geo_point`](https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-point.html): Tọa độ địa lý
    - [`geo_shape`](https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-shape.html): Hình dạng phức tạp, như đa giác
    - [`point`](https://www.elastic.co/guide/en/elasticsearch/reference/current/point.html): Điểm Cartesian bất kỳ
    - [`shape`](https://www.elastic.co/guide/en/elasticsearch/reference/current/shape.html): Hình dạng hình học Cartesian bất kỳ
- **Kiểu khác**
    
    - [`percolator`](https://www.elastic.co/guide/en/elasticsearch/reference/current/percolator.html): Truy vấn chỉ mục được viết bằng [Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)

## Trường siêu dữ liệu

Một tài liệu không chỉ chứa dữ liệu, mà còn chứa **siêu dữ liệu**. Siêu dữ liệu là thông tin mô tả về tài liệu.

- **Trường siêu dữ liệu đánh dấu**
  - [`_index`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-index-field.html): Chỉ mục mà tài liệu thuộc về.
  - [`_id`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-id-field.html): ID của tài liệu.
- **Trường siêu dữ liệu nguồn tài liệu**
  - [`_source`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-source-field.html): JSON gốc của nội dung tài liệu.
  - [`_size`](https://www.elastic.co/guide/en/elasticsearch/plugins/8.2/mapper-size.html): Kích thước (theo byte) của trường `_source`, được cung cấp bởi plugin [`mapper-size`](https://www.elastic.co/guide/en/elasticsearch/plugins/8.2/mapper-size.html).
- **Trường siêu dữ liệu đếm tài liệu**
  - [`_doc_count`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-doc-count-field.html): Trường tùy chỉnh dùng để lưu trữ số lượng tài liệu khi tài liệu đại diện cho dữ liệu đã được tổng hợp trước.
- **Trường siêu dữ liệu chỉ mục**
  - [`_field_names`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-field-names-field.html): Tất cả các trường không rỗng trong tài liệu.
  - [`_ignored`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-ignored-field.html): Tất cả các trường trong tài liệu bị bỏ qua khi lập chỉ mục do [`ignore_malformed`](https://www.elastic.co/guide/en/elasticsearch/reference/current/ignore-malformed.html).
- **Trường siêu dữ liệu định tuyến**
  - [`_routing`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-routing-field.html): Giá trị định tuyến tùy chỉnh để định tuyến tài liệu đến một shard cụ thể.
- **Trường siêu dữ liệu khác**
  - [`_meta`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-meta-field.html): Siêu dữ liệu cụ thể cho ứng dụng.
  - [`_tier`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-tier-field.html): Tầng dữ liệu ưa thích hiện tại của chỉ mục mà tài liệu thuộc về.

## Tham số ánh xạ

Elasticsearch cung cấp các tham số ánh xạ sau:

- [`analyzer`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analyzer.html): Xác định bộ phân tích được sử dụng để phân tích văn bản khi lập chỉ mục hoặc tìm kiếm các trường văn bản.
- [`coerce`](https://www.elastic.co/guide/en/elasticsearch/reference/current/coerce.html): Nếu được bật, Elasticsearch sẽ cố gắng làm sạch dữ liệu bẩn để phù hợp với kiểu dữ liệu của trường.
- [`copy_to`](https://www.elastic.co/guide/en/elasticsearch/reference/current/copy-to.html): Cho phép sao chép giá trị từ nhiều trường vào một trường nhóm, sau đó có thể được truy vấn như một trường đơn.
- [`doc_values`](https://www.elastic.co/guide/en/elasticsearch/reference/current/doc-values.html): Theo mặc định, tất cả các trường đều được
- [`dynamic`](https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic.html): Có nên bật ánh xạ động hay không.
- [`eager_global_ordinals`](https://www.elastic.co/guide/en/elasticsearch/reference/current/eager-global-ordinals.html): Khi sử dụng global ordinals, sau khi refresh, từ điển cần được xây dựng lại trong lần truy vấn tiếp theo, điều này có thể ảnh hưởng đến hiệu suất truy vấn. Bạn có thể sử dụng eager_global_ordinals để cập nhật từ điển ngay sau mỗi lần refresh, từ điển sẽ được lưu trữ trong bộ nhớ, giảm thời gian xây dựng từ điển khi truy vấn.
- [`enabled`](https://www.elastic.co/guide/en/elasticsearch/reference/current/enabled.html): Chỉ có thể áp dụng cho định nghĩa ánh xạ cấp cao nhất và các trường `object`. Khi được đặt thành `false`, Elasticsearch sẽ hoàn toàn bỏ qua trường này khi phân tích.
- [`fielddata`](https://www.elastic.co/guide/en/elasticsearch/reference/current/fielddata.html): Theo mặc định, các trường `text` có thể được tìm kiếm nhưng không thể được sử dụng cho việc tổng hợp, sắp xếp hoặc script. Nếu bạn đặt `fielddata=true` cho một trường, nó sẽ tải fielddata vào bộ nhớ bằng cách sử dụng chỉ mục đảo ngược, lưu ý rằng điều này có thể sử dụng một lượng lớn bộ nhớ. Nếu bạn muốn thực hiện tổng hợp, sắp xếp hoặc các hoạt động script trên trường `text`, fielddata là cách duy nhất.
- [`fields`](https://www.elastic.co/guide/en/elasticsearch/reference/current/multi-fields.html): Đôi khi, cùng một trường cần được lập chỉ mục với mục đích khác nhau, trong trường hợp này, bạn có thể cấu hình thông qua `fields`.
- [`format`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-date-format.html): Được sử dụng để định dạng kiểu ngày.
- [`ignore_above`](https://www.elastic.co/guide/en/elasticsearch/reference/current/ignore-above.html): Nếu độ dài của chuỗi lớn hơn giá trị được đặt bởi `ignore_above`, nó sẽ không được lập chỉ mục hoặc lưu trữ.
- [`ignore_malformed`](https://www.elastic.co/guide/en/elasticsearch/reference/current/ignore-malformed.html): Đôi khi, cùng một trường có thể lưu trữ các kiểu dữ liệu khác nhau. Theo mặc định, khi Elasticsearch không thể phân tích kiểu dữ liệu của một trường, nó sẽ tạo ra một ngoại lệ và từ chối toàn bộ tài liệu. Nếu bạn đặt `ignore_malformed` thành `true`, nó sẽ cho phép bỏ qua các ngoại lệ. Trong trường hợp này, các trường có định dạng không đúng sẽ không được lập chỉ mục, nhưng các trường khác trong tài liệu có thể được xử lý bình thường.
- [`index_options`](https://www.elastic.co/guide/en/elasticsearch/reference/current/index-options.html) được sử dụng để kiểm soát thông tin nào được thêm vào chỉ mục đảo ngược để tìm kiếm và làm nổi bật. Chỉ các loại trường dựa trên từ khoá như `text` và `keyword` hỗ trợ cấu hình này.
- [`index_phrases`](https://www.elastic.co/guide/en/elasticsearch/reference/current/index-phrases.html): Nếu được bật, các cụm từ hai từ (shingles) sẽ được lập chỉ mục vào một trường riêng biệt. Điều này cho phép thực hiện các truy vấn cụm từ chính xác (không có slop) hiệu quả hơn với chi phí lập chỉ mục lớn hơn. Lưu ý rằng phương pháp này hoạt động tốt nhất khi các từ dừng không bị loại bỏ, vì các cụm từ chứa từ dừng sẽ không sử dụng trường phụ trợ và sẽ quay lại truy vấn cụm từ chuẩn. Chấp nhận true hoặc false (mặc định).
- [`index_prefixes`](https://www.elastic.co/guide/en/elasticsearch/reference/current/index-prefixes.html): Tham số index_prefixes kích hoạt chỉ mục tiền tố term để tăng tốc tìm kiếm tiền tố.
- [`index`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-index.html): Tùy chọn `index` kiểm soát xem giá trị của trường có được lập chỉ mục hay không. Mặc định là true.
- [`meta`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-field-meta.html): Siêu dữ liệu được gắn vào trường. Siêu dữ liệu này không trong suốt đối với Elasticsearch, nó chỉ dùng để chia sẻ thông tin siêu dữ liệu giữa nhiều ứng dụng chia sẻ cùng một chỉ mục, ví dụ: đơn vị.
- [`normalizer`](https://www.elastic.co/guide/en/elasticsearch/reference/current/normalizer.html): Thuộc tính `normalizer` của trường `keyword` tương tự như [`analyzer`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analyzer.html), chỉ là nó đảm bảo rằng chuỗi phân tích chỉ tạo ra một token duy nhất. `normalizer` được áp dụng trước khi lập chỉ mục `keyword` và cũng được áp dụng khi tìm kiếm trường `keyword`thông qua bộ phân tích truy vấn (ví dụ: truy vấn khớp) hoặc truy vấn cấp từ ngữ (ví dụ: truy vấn từ khoá).
- [`norms`](https://www.elastic.co/guide/en/elasticsearch/reference/current/norms.html): `norms` lưu trữ các yếu tố chuẩn hóa khác nhau được sử dụng trong quá trình truy vấn để tính toán điểm liên quan của một tài liệu.
- [`null_value`](https://www.elastic.co/guide/en/elasticsearch/reference/current/null-value.html): Giá trị null không thể được lập chỉ mục và tìm kiếm. Khi một trường được đặt thành null, nó được coi như không có giá trị. `null_value` cho phép thay thế các giá trị rỗng bằng một giá trị được chỉ định, để chúng có thể được lập chỉ mục và tìm kiếm.
- [`position_increment_gap`](https://www.elastic.co/guide/en/elasticsearch/reference/current/position-increment-gap.html): Các trường văn bản đã phân tích xem xét vị trí của các từ khoá để có thể hỗ trợ các truy vấn lân cận hoặc cụm từ. Khi lập chỉ mục một trường văn bản với nhiều giá trị, một "khoảng trống giả" được thêm vào giữa các giá trị để ngăn chặn hầu hết các truy vấn cụm từ không khớp giữa các giá trị. Kích thước của khoảng trống này được cấu hình bằng `position_increment_gap`, mặc định là 100.
- [`properties`](https://www.elastic.co/guide/en/elasticsearch/reference/current/properties.html): Các trường con được chứa trong loại ánh xạ, các trường đối tượng và các trường lồng nhau được gọi là thuộc tính. Các thuộc tính này có thể là bất kỳ kiểu dữ liệu nào, bao gồm cả đối tượng và trường lồng nhau.
- [`search_analyzer`](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-analyzer.html): Thông thường, cùng một trình phân tích nên được sử dụng khi lập chỉ mục và tìm kiếm để đảm bảo các từ khoá trong truy vấn có cùng định dạng với các từ khoá trong chỉ mục đảo ngược. Tuy nhiên, đôi khi có thể hữu ích khi sử dụng một trình phân tích khác khi tìm kiếm, ví dụ khi sử dụng tokenizer [`edge_ngram`](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-edgengram-tokenizer.html) để tự động hoàn thành hoặc khi tìm kiếm từ đồng nghĩa.
- [`similarity`](https://www.elastic.co/guide/en/elasticsearch/reference/current/similarity.html): Elasticsearch cho phép cấu hình thuật toán điểm số văn bản hoặc sự tương tự cho mỗi trường. Cài đặt tương tự cung cấp một cách đơn giản để chọn một thuật toán tương tự văn bản khác với BM25 mặc định, chẳng hạn như boolean. Chỉ có các loại trường dựa trên văn bản như `text` và `keyword` hỗ trợ cấu hình này.
- [`store`](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-store.html): Mặc định, các giá trị trường được lập chỉ mục để có thể tìm kiếm, nhưng chúng không được lưu trữ. Điều này có nghĩa là bạn có thể truy vấn trường, nhưng bạn không thể lấy giá trị trường gốc. Thông thường, điều này không quan trọng, vì các giá trị trường đã là một phần của trường `_source` được lưu trữ theo mặc định. Nếu bạn chỉ muốn lấy giá trị của một hoặc một số trường, thay vì toàn bộ `_source`, bạn có thể làm điều đó với [lọc nguồn](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-fields.html#source-filtering).
- [`term_vector`](https://www.elastic.co/guide/en/elasticsearch/reference/current/term-vector.html): term_vector chứa thông tin về các từ khoá được tạo ra trong quá trình phân tích, bao gồm:
    - Danh sách từ khoá
    - Vị trí (hoặc thứ tự) của mỗi từ khoá
    - Độ lệch ký tự bắt đầu và kết thúc, để ánh xạ từ khoá và chuỗi gốc
    - Payload (nếu có) - dữ liệu nhị phân được định nghĩa bởi người dùng, liên quan đến vị trí của từ khoá

## Cấu hình ánh xạ

- `index.mapping.total_fields.limit`: Số lượng trường tối đa trong một chỉ mục. Các trường và ánh xạ đối tượng cũng như bí danh trường đều được tính vào giới hạn này. Giá trị mặc định là `1000`.
- `index.mapping.depth.limit`: Độ sâu tối đa của các trường, được đo bằng số lượng đối tượng bên trong. Ví dụ, nếu tất cả các trường đều được xác định ở cấp độ đối tượng gốc, thì độ sâu là `1`. Nếu có một ánh xạ đối tượng, thì độ sâu là `2`, và cứ tiếp tục như vậy. Giá trị mặc định là `20`.
- `index.mapping.nested_fields.limit`: Số lượng tối đa của các ánh xạ `nested` khác nhau trong một chỉ mục. Kiểu `nested` chỉ nên được sử dụng trong các trường hợp đặc biệt, tức là khi cần truy vấn độc lập các mảng đối tượng. Để ngăn chặn việc ánh xạ không tốt, cài đặt này hạn chế số lượng các kiểu `nested` duy nhất cho mỗi chỉ mục. Giá trị mặc định là `50`.
- `index.mapping.nested_objects.limit`: Số lượng tối đa các đối tượng JSON lồng nhau trong tất cả các kiểu `nested` trong một tài liệu đơn lẻ. Khi một tài liệu chứa quá nhiều đối tượng `nested`, giới hạn này giúp ngăn ngừa tràn bộ nhớ. Giá trị mặc định là `10000`.
- `index.mapping.field_name_length.limit`: Đặt độ dài tối đa của tên trường. Mặc định là Long.MAX_VALUE (không giới hạn).

## Tài liệu tham khảo

- [Elasticsearch Tài liệu chính thức về Mapping](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html)
