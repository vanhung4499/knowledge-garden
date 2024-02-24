---
title: Elasticsearch Highlight Search and Display
tags:
  - database
  - elasticssearch
categories: 
date created: 2024-02-23
date modified: 2024-02-23
---

# Tìm kiếm và hiển thị nổi bật trong Elasticsearch

Chức năng tìm kiếm nổi bật (highlight) của Elasticsearch cho phép bạn lấy đoạn tóm tắt nổi bật từ một hoặc nhiều trường trong kết quả tìm kiếm, để hiển thị vị trí phù hợp với truy vấn của người dùng. Khi bạn yêu cầu tìm kiếm nổi bật, trường highlight trong kết quả trả về sẽ bao gồm các trường nổi bật và các đoạn nổi bật. Elasticsearch mặc định sẽ đánh dấu từ khóa bằng thẻ `<em></em>`.

## Tham số tìm kiếm nổi bật

ES cung cấp các tham số tìm kiếm nổi bật sau đây:

| Tham số                   | Mô tả                                                                                                                                                                                                                                                                                                                                                                                                             |
| :------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `boundary_chars`          | Chuỗi chứa mỗi ký tự biên. Mặc định là,! ?\ \n.                                                                                                                                                                                                                                                                                                                                                                   |
| `boundary_max_scan`       | Khoảng cách để quét các ký tự biên. Mặc định là 20.                                                                                                                                                                                                                                                                                                                                                               |
| `boundary_scanner`        | Xác định cách chia các đoạn nổi bật, hỗ trợ ba cách: chars, sentence, word.                                                                                                                                                                                                                                                                                                                                       |
| `boundary_scanner_locale` | Cài đặt địa phương để tìm kiếm và xác định biên của từ, tham số này sử dụng dạng ngôn ngữ ("en-US", "fr-FR", "ja-JP").                                                                                                                                                                                                                                                                                            |
| `encoder`                 | Biểu thị các đoạn mã nên được mã hóa HTML: mặc định (không mã hóa) hoặc HTML (mã hóa văn bản của đoạn mã, sau đó chèn thẻ nổi bật).                                                                                                                                                                                                                                                                               |
| `fields`                  | Xác định các trường để lấy tìm kiếm nổi bật. Có thể sử dụng ký tự đại diện để chỉ định trường. Ví dụ, có thể chỉ định comment* để lấy tìm kiếm nổi bật của tất cả các trường văn bản và từ khóa bắt đầu bằng comment*.                                                                                                                                                                                            |
| `force_source`            | Tìm kiếm nổi bật dựa trên nguồn. Mặc định là false.                                                                                                                                                                                                                                                                                                                                                               |
| `fragmenter`              | Xác định cách văn bản nên được chia trong các đoạn nổi bật: hỗ trợ tham số simple hoặc span.                                                                                                                                                                                                                                                                                                                      |
| `fragment_offset`         | Kiểm soát khoảng trắng để bắt đầu tìm kiếm nổi bật. Chỉ hiệu quả khi sử dụng fvh highlighter.                                                                                                                                                                                                                                                                                                                     |
| `fragment_size`           | Kích thước của các đoạn nổi bật trong các ký tự. Mặc định là 100.                                                                                                                                                                                                                                                                                                                                                 |
| `highlight_query`         | Tìm kiếm nổi bật các mục khớp với các truy vấn khác ngoài truy vấn tìm kiếm. Điều này đặc biệt hữu ích khi sử dụng các truy vấn tái chấm điểm, vì mặc định tìm kiếm nổi bật sẽ không xem xét những vấn đề này.                                                                                                                                                                                                    |
| `matched_fields`          | Kết hợp nhiều kết quả khớp để tìm kiếm nổi bật một trường duy nhất, đối với nhiều trường sử dụng cùng một chuỗi được phân tích theo các cách khác nhau. Tất cả các matched_fields phải đặt term_vector là with_positions_offsets, nhưng chỉ có các trường mà các mục khớp được kết hợp vào mới được tải, vì vậy chỉ khi store được đặt là yes thì trường này mới được hưởng lợi. Chỉ áp dụng cho fvh highlighter. |
| `no_match_size`           | Số lượng văn bản muốn trả về từ đầu trường nếu không có đoạn khớp nào để tìm kiếm nổi bật. Mặc định là 0 (không trả về bất kỳ nội dung nào).                                                                                                                                                                                                                                                                      |
| `number_of_fragments`     | Số lượng tối đa của các đoạn trả về. Nếu số lượng đoạn được đặt là 0, thì không trả về bất kỳ đoạn nào. Ngược lại, tìm kiếm nổi bật và trả về toàn bộ nội dung của trường. Điều này rất tiện khi cần tìm kiếm nổi bật văn bản ngắn (như tiêu đề hoặc địa chỉ), nhưng không cần phân đoạn. Nếu number_of_fragments là 0, thì bỏ qua fragment_size. Mặc định là 5.                                                  |
| `order`                   | Khi được đặt là score, sắp xếp các đoạn nổi bật theo điểm số. Mặc định, các đoạn sẽ được xuất ra theo thứ tự xuất hiện trong trường (order:none). Đặt tùy chọn này là score sẽ xuất các đoạn liên quan nhất trước tiên. Mỗi tìm kiếm nổi bật áp dụng logic riêng của mình để tính điểm liên quan.                                                                                                                 |
| `phrase_limit`            | Kiểm soát số lượng cụm từ khớp được xem xét trong tài liệu. Ngăn chặn fvh highlighter phân tích quá nhiều cụm từ và tiêu thụ quá nhiều bộ nhớ. Tăng giới hạn sẽ làm tăng thời gian truy vấn và tiêu thụ nhiều bộ nhớ hơn. Mặc định là 256.                                                                                                                                                                        |
| `pre_tags`                | Sử dụng cùng với post_tags, xác định thẻ HTML được sử dụng để tìm kiếm nổi bật văn bản. Mặc định, văn bản nổi bật được bao bọc trong thẻ và. Được chỉ định dưới dạng mảng chuỗi.                                                                                                                                                                                                                                  |
| `post_tags`               | Sử dụng cùng với pre_tags, xác định thẻ HTML được sử dụng để tìm kiếm nổi bật văn bản. Mặc định, văn bản nổi bật được bao bọc trong thẻ và. Được chỉ định dưới dạng mảng chuỗi.                                                                                                                                                                                                                                   |
| `require_field_match`     | Mặc định, chỉ tìm kiếm nổi bật các trường chứa các mục khớp truy vấn. Đặt require_field_match là false để tìm kiếm nổi bật tất cả các trường. Mặc định là true.                                                                                                                                                                                                                                                   |
| `tags_schema`             | Đặt để sử dụng kiểu mẫu thẻ được tích hợp.                                                                                                                                                                                                                                                                                                                                                                        |
| `type`                    | Chế độ tìm kiếm nổi bật được sử dụng, có thể chọn **_`unified`_**, **_`plain`_** hoặc **_`fvh`_**. Mặc định là _`unified`_.                                                                                                                                                                                                                                                                                       |

## Tùy chỉnh đoạn nổi bật

Nếu chúng ta muốn sử dụng các thẻ tùy chỉnh, chỉ cần thêm `pre_tags` và `post_tags` vào thuộc tính nổi bật cho các trường cần nổi bật. Ví dụ, tìm kiếm sách có từ khóa "javascript" trong trường tiêu đề và sử dụng thẻ HTML tùy chỉnh để làm nổi bật từ khóa, câu truy vấn như sau:

```bash
GET /books/_search
{
  "query": {
    "match": { "title": "javascript" }
  },
  "highlight": {
    "fields": {
      "title": {
        "pre_tags": ["<strong>"],
        "post_tags": ["</strong>"]
      }
    }
  }
}
```

Trong câu truy vấn trên, thẻ `<strong>` sẽ được sử dụng để làm nổi bật từ khóa trong kết quả tìm kiếm.

## Đánh dấu nổi bật nhiều trường

Đối với tìm kiếm nổi bật, chúng ta cần biết cách thiết lập tìm kiếm nổi bật cho nhiều trường. Ví dụ, khi tìm kiếm trường tiêu đề, chúng ta hy vọng từ khóa trong trường mô tả cũng có thể được làm nổi bật. Lúc này, chúng ta cần đặt giá trị của thuộc tính `require_field_match` là `false`. Giá trị mặc định của `require_field_match` là `true`, chỉ làm nổi bật các trường khớp. Câu truy vấn đánh dấu nổi bật nhiều trường như sau:

```bash
GET /books/_search
{
  "query": {
    "match": { "title": "javascript" }
  },
  "highlight": {
    "require_field_match": false,
    "fields": {
      "title": {},
      "description": {}
    }
  }
}
```

Trong câu truy vấn trên, cả trường tiêu đề và trường mô tả sẽ được làm nổi bật nếu chúng chứa từ khóa "javascript".

## Phân tích hiệu suất nổi bật

Elasticsearch cung cấp ba loại trình nổi bật, gồm **trình nổi bật mặc định (highlighter)**, **trình nổi bật postings-highlighter** và **trình nổi bật fast-vector-highlighter**.

**Highlighter** mặc định là trình nổi bật cơ bản nhất. Trình nổi bật highlighter cần phân tích lại tài liệu gốc được lưu trong `_source` để thực hiện chức năng nổi bật, tốc độ của nó chậm nhất trong ba trình nổi bật, ưu điểm là không cần không gian lưu trữ bổ sung.

**Postings-highlighter** không cần phân tích lại để thực hiện chức năng nổi bật, nhưng cần thiết lập tham số `index_options` trong ánh xạ trường thành `offsets`, tức là lưu offset của từ khóa, nhanh hơn trình nổi bật mặc định. Ví dụ, để cấu hình trường bình luận sử dụng trình nổi bật postings-highlighter, ánh xạ như sau:

```bash
PUT /example
{
  "mappings": {
    "doc": {
      "properties": {
        "comment": {
          "type": "text",
          "index_options": "offsets"
        }
      }
    }
  }
}
```

**Fast-vector-highlighter** có tốc độ thực hiện chức năng nổi bật nhanh nhất, nhưng cần thiết lập tham số `term_vector` trong ánh xạ trường thành `with_positions_offsets`, tức là lưu thông tin vị trí và offset của từ khóa. Nó chiếm nhiều không gian lưu trữ nhất, là một cách tiêu biểu của việc đổi không gian lấy thời gian. Ví dụ, để cấu hình trường bình luận sử dụng trình nổi bật fast-vector-highlighter, ánh xạ như sau:

```bash
PUT /example
{
  "mappings": {
    "doc": {
      "properties": {
        "comment": {
          "type": "text",
          "term_vector": "with_positions_offsets"
        }
      }
    }
  }
}
```

Như vậy, khi xem xét việc sử dụng trình nổi bật nào, bạn cần cân nhắc giữa hiệu suất và yêu cầu lưu trữ. Trình nổi bật mặc định chậm hơn nhưng không cần không gian lưu trữ bổ sung, trong khi trình nổi bật postings-highlighter và fast-vector-highlighter nhanh hơn nhưng cần không gian lưu trữ bổ sung.
