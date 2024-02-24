---
title: Elasticsearch Analyzer
tags:
  - database
  - elasticssearch
categories: 
date created: 2024-02-23
date modified: 2024-02-23
---

# Elasticsearch Analyzer

Phân tích văn bản là quá trình chuyển đổi toàn bộ văn bản thành một chuỗi các từ (term/token), còn được gọi là phân từ. Trong Elasticsearch, phân từ được thực hiện thông qua analyzer (bộ phân tích), dù là chỉ mục hay tìm kiếm, đều cần sử dụng analyzer (bộ phân tích). Bộ phân tích, chia thành **bộ phân tích được xây dựng sẵn** và **bộ phân tích tùy chỉnh**.  

Bộ phân tích có thể được phân loại thành ba phần là **bộ lọc ký tự**(**Character Filters**), **bộ phân từ** (**Tokenizer**) và **bộ lọc từ** (**Token Filters**). Thứ tự thực thi của nó như sau:

**_character filters_** -> **_tokenizer_** -> **_token filters_**

## Bộ lọc ký tự (Character Filters)

Bộ lọc ký tự nhận đầu vào là văn bản gốc, nếu cấu hình nhiều hơn, nó sẽ thực hiện theo thứ tự cấu hình. Hiện tại ES có 3 loại bộ lọc ký tự chính:

1. **html strip character filter**: Loại bỏ các phần tử HTML khỏi văn bản và thay thế các thực thể HTML bằng giá trị giải mã của chúng (ví dụ, thay thế **_`＆amp;`_** bằng **_`＆`_**).
2. **mapping character filter**: Tự định nghĩa một bản đồ ánh xạ, có thể thực hiện một số thay thế tùy chỉnh, như thường được sử dụng để thay đổi chữ hoa thành chữ thường cũng có thể được thiết lập tại đây.
3. **pattern replace character filter**: Sử dụng biểu thức chính quy java để khớp các ký tự cần thay thế bằng chuỗi thay thế được chỉ định, ngoài ra, chuỗi thay thế có thể tham chiếu đến nhóm bắt trong biểu thức chính quy.

### HTML strip character filter

Ví dụ về HTML strip:

```bash
GET /_analyze
{
  "tokenizer": "keyword",
  "char_filter": [
    "html_strip"
  ],
  "text": "<p>I&apos;m so <b>happy</b>!</p>"
}
```

Sau khi xử lý bằng bộ lọc ký tự **_`html_strip`_**, đầu ra như sau:

```
[ \nI'm so happy!\n ]
```

### Mapping character filter

Mapping character filter nhận một bản đồ ánh xạ giữa khóa và giá trị (key => value) như tham số cấu hình, mỗi khi gặp một chuỗi trong văn bản gốc giống với khóa trong bản đồ ánh xạ, nó sẽ thay thế chuỗi đó bằng giá trị tương ứng của khóa.

Việc khớp chuỗi trong văn bản gốc với khóa trong bản đồ ánh xạ là tham lam, nếu có sự chồng chéo giữa các khóa trong bản đồ ánh xạ, nó sẽ ưu tiên **khớp khóa dài nhất**. Cũng có thể thay thế bằng chuỗi rỗng.

mapping char_filter không giống như html_strip có thể sử dụng ngay lập tức, nó cần được cấu hình trước khi sử dụng, nó có hai thuộc tính có thể cấu hình:

| Tên tham số              | Mô tả tham số                                                                                       |
| :-------------------- | :--------------------------------------------------------------------------------------------- |
| **_`mappings`_**      | Một tập hợp ánh xạ, mỗi phần tử có định dạng là _key => value_.                                                    |
| **_`mappings_path`_** | Một đường dẫn tệp tương đối hoặc tuyệt đối, trỏ đến một tệp ánh xạ văn bản UTF-8 mã hóa mỗi dòng chứa một _key =>value_. |

Ví dụ về mapping char_filter như sau:

```bash
GET /_analyze
{
  "tokenizer": "keyword",
  "char_filter": [
    {
      "type": "mapping",
      "mappings": [
        "٠ => 0",
        "١ => 1",
        "٢ => 2",
        "٣ => 3",
        "٤ => 4",
        "٥ => 5",
        "٦ => 6",
        "٧ => 7",
        "٨ => 8",
        "٩ => 9"
      ]
    }
  ],
  "text": "My license plate is ٢٥٠١٥"
}
```

Kết quả phân tích như sau:

```
[ My license plate is 25015 ]
```

### Pattern Replace character filter

Pattern Replace character filter hỗ trợ ba tham số sau:

| Tên tham số            | Mô tả tham số                                                                       |
| :------------------ | :----------------------------------------------------------------------------- |
| **_`pattern`_**     | Tham số bắt buộc, một biểu thức chính quy java.                                             |
| **_`replacement`_** | Chuỗi thay thế, có thể sử dụng cú pháp **_`$1 … $9`_** để tham chiếu đến nhóm bắt.                      |
| **_`flags`_**       | Cờ biểu thức chính quy Java, xem chi tiết cờ của lớp java.util.regex.Pattern. |

Ví dụ, chuyển đổi tất cả các khoảng trắng lớn hơn một trong văn bản đầu vào thành một khoảng trắng, khi cấu hình, ví dụ như sau:

```bash
"char_filter": {
  "multi_space_2_one": {
    "pattern": "[ ]+",
    "type": "pattern_replace",
    "replacement": " "
  },
  ...
}
```

## Bộ phân từ (Tokenizer)

Tokenizer, còn được gọi là bộ phân từ, là thành phần quan trọng nhất của analyzer, nó thực hiện việc phân chia văn bản thành các từ; **một analyzer phải và chỉ có thể chứa một tokenizer**.

ES cung cấp mặc định tokenizer là standard tokenizer, bộ phân từ tiêu chuẩn cung cấp phân từ dựa trên ngữ pháp (dựa trên thuật toán chia văn bản Unicode), và phù hợp với hầu hết các ngôn ngữ.

Ngoài ra, có rất nhiều plugin phân từ của bên thứ ba, chẳng hạn như bộ phân từ ik, một trong những bộ phân từ tiêu chuẩn nhất trong lĩnh vực phân từ tiếng Trung, nó tương ứng với tokenizer ik_smart và ik_max_word, một là phân từ thông minh (dành cho bên tìm kiếm), một là phân từ toàn bộ (dành cho bên chỉ mục).

Tokenizer mặc định mà ES cung cấp là standard không tối ưu hóa phân từ tiếng Trung, hiệu quả kém, thường sẽ cài đặt plugin phân từ tiếng Trung của bên thứ ba, thường là plugin [elasticsearch-analysis-ik](https://github.com/medcl/elasticsearch-analysis-ik) đầu tiên, thực ra đó là phiên bản tùy chỉnh của ik dành cho ES.

## Bộ lọc từ (Token Filters)

Token filters, còn được gọi là bộ lọc từ hoặc bộ lọc mục từ, xử lý các từ đã được phân chia bởi tokenizer. Các ứng dụng phổ biến bao gồm chuyển đổi thành chữ thường, xử lý từ dừng, xử lý từ đồng nghĩa, v.v. **Một analyzer có thể chứa 0 hoặc nhiều bộ lọc từ, và thực hiện lọc theo thứ tự cấu hình**.

Dưới đây là một ví dụ về việc sử dụng bộ lọc từ đồng nghĩa:

```bash
PUT /test_index
{
  "settings": {
    "index": {
      "analysis": {
        "analyzer": {
          "synonym": {
            "tokenizer": "standard",
            "filter": [ "my_stop", "synonym" ]
          }
        },
        "filter": {
          "my_stop": {
            "type": "stop",
            "stopwords": [ "bar" ]
          },
          "synonym": {
            "type": "synonym",
            "lenient": true,
            "synonyms": [ "foo, bar => baz" ]
          }
        }
      }
    }
  }
}
```

### Từ đồng nghĩa

Elasticsearch xử lý từ đồng nghĩa thông qua bộ lọc từ đồng nghĩa (synonym token filter) độc quyền của mình, cho phép xử lý từ đồng nghĩa một cách thuận tiện trong quá trình phân tích (analysis), thường thông qua cấu hình từ tệp cấu hình. Ngoài ra, từ đồng nghĩa có thể được sử dụng khi xây dựng chỉ mục (index-time synonyms) hoặc khi tìm kiếm (search-time synonyms).

#### Cú pháp cấu hình từ đồng nghĩa (synonym)

Như ví dụ trên, cú pháp cấu hình filter từ đồng nghĩa trong es cụ thể như sau:

- **_`type`_**: chỉ định synonym, biểu thị bộ lọc từ đồng nghĩa;
- **_`synonyms_path`_**: chỉ định đường dẫn tệp cấu hình từ đồng nghĩa;
- **`expand`**: tham số này quyết định mô hình hành vi ánh xạ, mặc định là true, biểu thị chế độ mở rộng, ví dụ cụ thể như sau:
  - Khi **`expand == true`**,

    ```
    ipod, i-pod, i pod
    ```

    tương đương với:

    ```
    ipod, i-pod, i pod => ipod, i-pod, i pod
    ```

    Khi **_`expand == false`_**,

    ```
    ipod, i-pod, i pod
    ```

    chỉ ánh xạ từ đầu tiên, tương đương với:

    ```
    ipod, i-pod, i pod => ipod
    ```

- **_`lenient`_**: nếu giá trị là true, khi gặp các quy tắc từ đồng nghĩa không thể phân giải, nó sẽ bỏ qua ngoại lệ. Mặc định là false.

#### Định dạng tài liệu từ đồng nghĩa

Elasticsearch có hai hình thức từ đồng nghĩa sau:

- Từ đồng nghĩa một chiều:

  ```
  ipod, i-pod, i pod => ipod
  ```

- Từ đồng nghĩa hai chiều:

  ```
  solanum tuberosum, khoai tây, potato
  ```

Đối với từ đồng nghĩa một chiều, không chỉ trong quá trình lập chỉ mục mà cả khi truy vấn, các từ ở bên trái mũi tên đều được ánh xạ thành từ ở bên phải mũi tên;

Đối với từ đồng nghĩa hai chiều, khi xây dựng chỉ mục, tất cả các từ đồng nghĩa đều xây dựng chỉ mục nghịch đảo, và khi truy vấn, tất cả các từ đồng nghĩa đều được so khớp với chỉ mục nghịch đảo.

> Khi tài liệu từ đồng nghĩa, điều cần chú ý là, khi cùng một từ xuất hiện trong các mối quan hệ từ đồng nghĩa khác nhau, các từ đồng nghĩa khác không có tính chất chuyển tiếp, điều này cần được chú ý.

Giả sử trong ví dụ trên, nếu "solanum tuberosum" và hai từ đồng nghĩa khác được viết thành hai dòng:

```
solanum tuberosum,khoai tây
solanum tuberosum,potato
```

Tại thời điểm này, Elasticsearch sẽ không coi "khoai tây" và "potato" là mối quan hệ từ đồng nghĩa, vì vậy nhiều từ đồng nghĩa cần được viết cùng nhau, điều này thường dễ bị bỏ qua trong quá trình phát triển.

## Tài liệu tham khảo

- [Hướng dẫn Elasticsearch](https://www.knowledgedict.com/tutorial/elasticsearch-intro.html)
