---
title: Elasticsearch Query
tags:
  - database
  - elasticssearch
categories: 
date created: 2024-02-23
date modified: 2024-02-23
---

# Elasticsearch Query

Câu truy vấn Elasticsearch sử dụng interface dựa trên phong cách RESTful được đóng gói thành đối tượng JSON, được gọi là Query DSL. Elasticsearch chia các truy vấn thành các loại chính sau: **truy vấn toàn văn**, **truy vấn từ khoá**, **truy vấn kết hợp**, **truy vấn lồng nhau**, **truy vấn vị trí**, **truy vấn đặc biệt**. Một cách phân loại khác của Elasticsearch truy vấn dựa vào cơ chế, một là dựa vào từ khoá truy vấn được người dùng nhập vào, thông qua mô hình xếp hạng để tính toán **mức độ liên quan** giữa tài liệu và từ khoá truy vấn, và trả về dựa trên thứ tự điểm số; cách khác là **cơ chế lọc**, chỉ lọc tài liệu dựa trên điều kiện lọc, không tính toán điểm số, tốc độ tương đối nhanh hơn.

## Truy vấn toàn văn

Truy vấn toàn văn ES chủ yếu được sử dụng trên các trường toàn văn, chủ yếu xem xét mức độ liên quan (Relevance) giữa từ khoá truy vấn và tài liệu.

### intervals query

[**`intervals query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-intervals-query.html) trả về tài liệu dựa trên thứ tự và độ tương quan của từ khoá khớp.

intervals query sử dụng **quy tắc khớp**, các quy tắc này được áp dụng cho các term trong trường đã chỉ định.

Ví dụ: Ví dụ dưới đây tìm kiếm trường `query`, giá trị tìm kiếm là `my favorite food`, không có bất kỳ khoảng trắng nào; sau đó là trường `my_text` tìm kiếm term khớp `hot water`, `cold porridge`.

Khi giá trị của my_text là `my favorite food is cold porridge`, nó sẽ khớp thành công, nhưng `when it's cold my favorite food is porridge` thì không khớp.

```bash
POST _search
{
  "query": {
    "intervals" : {
      "my_text" : {
        "all_of" : {
          "ordered" : true,
          "intervals" : [
            {
              "match" : {
                "query" : "my favorite food",
                "max_gaps" : 0,
                "ordered" : true
              }
            },
            {
              "any_of" : {
                "intervals" : [
                  { "match" : { "query" : "hot water" } },
                  { "match" : { "query" : "cold porridge" } }
                ]
              }
            }
          ]
        }
      }
    }
  }
}
```

### match query

[**`match query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html) **được sử dụng để tìm kiếm một trường đơn**, đầu tiên sẽ phân tích câu truy vấn (qua analyzer), chủ yếu là để tách câu truy vấn thành các từ, sau khi tách từ, bất kỳ từ nào trong câu truy vấn khớp, tài liệu sẽ được tìm thấy, theo mặc định, nó tương đương với việc thực hiện hoạt động khớp or sau khi tách từ.

[**`match query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html) là truy vấn tiêu chuẩn để thực hiện tìm kiếm toàn văn, bao gồm các tùy chọn khớp mờ.

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "match": {
      "customer_full_name": {
        "query": "George Hubbard"
      }
    }
  }
}
```

Tương đương với hoạt động khớp `or`, như sau:

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "match": {
      "customer_full_name": {
        "query": "George Hubbard",
        "operator": "or"
      }
    }
  }
}
```

#### match query viết tắt

Bạn có thể đơn giản hóa cú pháp truy vấn khớp bằng cách kết hợp tham số `<field>` và `query`.

Ví dụ:

```bash
GET /_search
{
  "query": {
    "match": {
      "message": "this is a test"
    }
  }
}
```

#### match query hoạt động như thế nào

Truy vấn khớp là kiểu boolean. Điều này có nghĩa là nó sẽ phân tích văn bản được cung cấp, quá trình phân tích sẽ xây dựng một truy vấn boolean từ văn bản được cung cấp. Tham số `operator` có thể được đặt thành `or` hoặc `and` để kiểm soát các mệnh đề con boolean (mặc định là `or`). Bạn có thể sử dụng tham số [`minimum_should_match`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-minimum-should-match.html) để đặt số lượng tối thiểu các mệnh đề `should` tùy chọn cần phải khớp.

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "match": {
      "customer_full_name": {
        "query": "George Hubbard",
        "operator": "and"
      }
    }
  }
}
```

Bạn có thể đặt `analyzer` để kiểm soát analyzer nào sẽ thực hiện quá trình phân tích văn bản. Nó mặc định là analyzer đã được định rõ trong định nghĩa mapping trường hoặc analyzer tìm kiếm mặc định.

Tham số `lenient` có thể được đặt thành `true` để bỏ qua các ngoại lệ do không khớp kiểu dữ liệu, chẳng hạn như cố gắng truy vấn chuỗi số trên trường số. Mặc định là `false`.

#### match query khớp mờ

`fuzziness` cho phép khớp mờ dựa trên loại trường đang được truy vấn. Xem cấu hình [Fuzziness](https://www.elastic.co/guide/en/elasticsearch/reference/current/common-options.html#fuzziness).

Trong trường hợp này, bạn có thể đặt `prefix_length` và `max_expansions` để kiểm soát khớp mờ. Nếu đã đặt các tùy chọn mờ, truy vấn sẽ sử dụng `top_terms_blended_freqs_${max_expansions}` làm phương pháp viết lại của nó, tham số `fuzzy_rewrite` cho phép kiểm soát cách truy vấn sẽ được viết lại.

Theo mặc định, cho phép đảo ngược mờ (`ab` → `ba`), nhưng có thể bị vô hiệu hóa bằng cách đặt `fuzzy_transpositions` thành `false`.

```bash
GET /_search
{
  "query": {
    "match": {
      "message": {
        "query": "this is a testt",
        "fuzziness": "AUTO"
      }
    }
  }
}
```

#### zero terms query

Nếu analyzer được sử dụng loại bỏ tất cả các token trong truy vấn, thì hành vi mặc định là không khớp với bất kỳ tài liệu nào. Bạn có thể sử dụng tùy chọn `zero_terms_query` để thay đổi hành vi mặc định, nó chấp nhận `none` (mặc định) và `all` (tương đương với truy vấn `match_all`).

```bash
GET /_search
{
  "query": {
    "match": {
      "message": {
        "query": "to be or not to be",
        "operator": "and",
        "zero_terms_query": "all"
      }
    }
  }
}
```

### match_bool_prefix query

[**`match_bool_prefix query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-bool-prefix-query.html) phân tích đầu vào của nó và xây dựng một truy vấn boolean dựa trên các từ này. Mỗi từ, ngoại trừ từ cuối cùng, được sử dụng trong một truy vấn từ. Từ cuối cùng được sử dụng trong một `prefix query`.

Ví dụ:

```bash
GET /_search
{
  "query": {
    "match_bool_prefix" : {
      "message" : "quick brown f"
    }
  }
}
```

Tương đương với

```bash
GET /_search
{
  "query": {
    "bool" : {
      "should": [
        { "term": { "message": "quick" }},
        { "term": { "message": "brown" }},
        { "prefix": { "message": "f"}}
      ]
    }
  }
}
```

Một sự khác biệt quan trọng giữa `match_bool_prefix query` và `match_phrase_prefix query` là: `match_phrase_prefix query` sẽ khớp các term của nó như một cụm từ, nhưng `match_bool_prefix query` có thể khớp các term của nó ở bất kỳ vị trí nào.

Ví dụ truy vấn `match_bool_prefix query` ở trên có thể khớp với các trường chứa `quick brown fox`, nhưng nó cũng có thể khớp nhanh với `brown fox`. Nó cũng có thể khớp với các trường chứa `quick`, `brown` và bắt đầu bằng `f`, xuất hiện ở bất kỳ vị trí nào.

### match_phrase query

[**`match_phrase query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase.html) tức là khớp cụm từ, đầu tiên nó sẽ tách nội dung query thành các từ, bộ tách từ có thể được tùy chỉnh, đồng thời tài liệu cũng phải đáp ứng hai điều kiện sau đây mới được tìm kiếm:

1. **Tất cả các từ sau khi tách phải xuất hiện trong trường này (tương đương với hoạt động and)**.
2. **Thứ tự của các từ trong trường phải phù hợp**.

Ví dụ, có 3 tài liệu sau, sử dụng **`match_phrase`** để truy vấn "How are you", chỉ có hai tài liệu đầu tiên được khớp:

```bash
PUT demo/_create/1
{ "desc": "How are you" }

PUT demo/_create/2
{ "desc": "How are you, Jack?"}

PUT demo/_create/3
{ "desc": "are you"}

GET demo/_search
{
  "query": {
    "match_phrase": {
      "desc": "How are you"
    }
  }
}
```

> Ghi chú:
>
> Một tài liệu được xác định là khớp với cụm từ "How are you" phải đáp ứng các yêu cầu sau đây:
>
> - How, are và you cần phải xuất hiện trong trường.
> - Vị trí của are phải lớn hơn vị trí của How là 1.
> - Vị trí của you phải lớn hơn vị trí của How là 2.

### match_phrase_prefix query

[**`match_phrase_prefix query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase-prefix.html) tương tự như [**`match_phrase query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase.html), chỉ khác là [**`match_phrase_prefix query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase-prefix.html) sẽ xem term cuối cùng như một prefix match.

```bash
GET demo/_search
{
  "query": {
    "match_phrase_prefix": {
      "desc": "are yo"
    }
  }
}
```

Trong ví dụ này, Elasticsearch sẽ tìm kiếm các tài liệu có trường "desc" chứa cụm từ bắt đầu bằng "are yo". Cụm từ này có thể hoàn thành với bất kỳ từ nào bắt đầu bằng "yo", chẳng hạn như "you" hoặc "yoga". Điều này có thể hữu ích khi bạn muốn tìm kiếm một cụm từ nhưng chỉ biết một phần của nó.

### multi_match query

[**`multi_match query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html) là một phiên bản nâng cấp của **`match query`**, **được sử dụng để tìm kiếm trên nhiều trường**.

Ví dụ:

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "multi_match": {
      "query": 34.98,
      "fields": [
        "taxful_total_price",
        "taxless_total_price"
      ]
    }
  }
}
```

Trường tìm kiếm của **`multi_match query`** có thể được chỉ định bằng cách sử dụng ký tự đại diện, ví dụ như sau:

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "multi_match": {
      "query": 34.98,
      "fields": [
        "taxful_*",
        "taxless_total_price"
      ]
    }
  }
}
```

Đồng thời, bạn cũng có thể **chỉ định trọng số của trường tìm kiếm bằng cách sử dụng ký hiệu mũ**.

Ví dụ: chỉ định trọng số của trường taxful_total_price là gấp ba lần trường taxless_total_price, lệnh như sau:

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "multi_match": {
      "query": 34.98,
      "fields": [
        "taxful_total_price^3",
        "taxless_total_price"
      ]
    }
  }
}
```

Điều này có nghĩa là kết quả tìm kiếm từ trường "taxful_total_price" sẽ có trọng số cao hơn ba lần so với kết quả từ trường "taxless_total_price".

### combined_fields query

[**`combined_fields query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-combined-fields-query.html) hỗ trợ tìm kiếm nhiều trường văn bản, giống như nội dung của chúng đã được lập chỉ mục vào một trường kết hợp. Truy vấn này tạo ra một góc nhìn dựa trên term của chuỗi đầu vào: đầu tiên nó phân tích chuỗi truy vấn thành các term độc lập, sau đó tìm kiếm mỗi term trong tất cả các trường. Khi kết quả phù hợp có thể trải qua nhiều trường văn bản, truy vấn này đặc biệt hữu ích, ví dụ như tiêu đề, tóm tắt và nội dung của một bài viết:

```bash
GET /_search
{
  "query": {
    "combined_fields" : {
      "query":      "database systems",
      "fields":     [ "title", "abstract", "body"],
      "operator":   "and"
    }
  }
}
```

#### Trọng số tiền tố trường

Trọng số tiền tố trường được tính toán dựa trên mô hình trường kết hợp. Ví dụ, nếu trọng số của trường tiêu đề là 2, thì khi tính điểm độ phù hợp, mỗi term tạo ra từ trường tiêu đề sẽ được tính điểm như thể nó xuất hiện hai lần.

### common_terms query

> Đã bị loại bỏ từ phiên bản 7.3.0

[**`common_terms query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-common-terms-query.html) là một giải pháp để cải thiện độ chính xác và độ bao phủ của tìm kiếm mà không làm giảm hiệu suất, thay thế cho việc sử dụng từ dừng (stop words).

Mỗi từ trong truy vấn đều có một chi phí nhất định. Ví dụ, khi tìm kiếm "The brown fox", truy vấn sẽ được phân tích thành ba từ: "the", "brown", và "fox", mỗi từ sẽ thực hiện một truy vấn trong chỉ mục. Rõ ràng, số lượng tài liệu chứa "the" rất nhiều, so với các từ khác, tầm quan trọng của "the" thấp hơn nhiều. Cách giải quyết truyền thống là coi "the" là một từ dừng, loại bỏ từ dừng có thể giảm kích thước chỉ mục và giảm việc thu hẹp từ dừng khi tìm kiếm.

Tuy nhiên, mặc dù từ dừng không ảnh hưởng nhiều đến việc đánh giá tài liệu, nhưng khi từ dừng vẫn có ý nghĩa quan trọng, việc loại bỏ từ dừng không phải là giải pháp hoàn hảo. Nếu loại bỏ từ dừng, bạn không thể phân biệt "happy" và "not happy", "The" trong "To be or not to be" sẽ không tồn tại trong chỉ mục, làm giảm độ chính xác và độ bao phủ của tìm kiếm.

`common_terms query` cung cấp một giải pháp, nó chia những từ sau khi phân tách truy vấn thành từ quan trọng (từ có tần suất thấp) và từ không quan trọng (từ có tần suất cao, cũng chính là từ dừng trước đây). Khi tìm kiếm, đầu tiên tìm kiếm tài liệu phù hợp với từ quan trọng, những tài liệu này là những tài liệu mà từ xuất hiện ít và ảnh hưởng lớn đến việc đánh giá. Sau đó, thực hiện truy vấn thứ hai, tìm kiếm từ có tần suất cao ảnh hưởng ít đến việc đánh giá, nhưng không tính điểm cho tất cả tài liệu, chỉ tính điểm cho tài liệu đã phù hợp trong truy vấn đầu tiên. Nếu một truy vấn chỉ chứa từ có tần suất cao, thì sẽ thực hiện một truy vấn độc lập thông qua toán tử "and", nói cách khác, sẽ tìm kiếm tất cả các từ.

Từ là từ có tần suất cao hay tần suất thấp được thiết lập thông qua giá trị ngưỡng cutoff frequency, có thể là tần suất tuyệt đối (tần suất lớn hơn 1) hoặc tần suất tương đối (0 ~ 1). Điểm thú vị nhất của `common_terms query` là nó có thể tự điều chỉnh từ dừng cho lĩnh vực cụ thể, ví dụ, trên trang web lưu trữ video, các từ có tần suất cao như "clip" hoặc "video" sẽ tự động được coi là từ dừng, không cần duy trì danh sách thủ công.

Ví dụ, từ có tần suất xuất hiện trong tài liệu lớn hơn 0.1% sẽ được coi là từ có tần suất cao, từ có tần suất có thể được kết nối bằng các tham số low_freq_operator và high_freq_operator. Thiết lập toán tử từ có tần suất thấp là "and" để tất cả các từ có tần suất thấp đều phải tìm kiếm, ví dụ mã như sau:

```bash
GET books/_search
{
	"query": {
		"common": {
			"body": {
				"query": "nelly the elephant as a cartoon",
				"cutoff_frequency": 0.001,
				"low_freq_operator": "and"
			}
		}
	}
}
```

Hoạt động trên tương đương với:

```bash
GET books/_search
{
	"query": {
		"bool": {
			"must": [
			  { "term": { "body": "nelly" } },
			  { "term": { "body": "elephant" } },
			  { "term": { "body": "cartoon" } }
			],
			"should": [
			  { "term": { "body": "the" } },
			  { "term": { "body": "as" } },
			  { "term": { "body": "a" } }
			]
		}
	}
}
```

### query_string query

[**`query_string query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html) là một loại truy vấn gắn kết chặt chẽ với cú pháp truy vấn của Lucene, cho phép sử dụng nhiều từ khóa điều kiện đặc biệt (như: AND | OR | NOT) trong một câu truy vấn để tìm kiếm trên nhiều trường, khuyến nghị cho người dùng đã quen với cú pháp truy vấn của Lucene.

Người dùng có thể sử dụng `query_string query` để tạo các truy vấn phức tạp bao gồm ký tự đại diện, tìm kiếm trên nhiều trường, v.v. Mặc dù là phổ biến, nhưng truy vấn là nghiêm ngặt, nếu chuỗi truy vấn chứa bất kỳ cú pháp không hợp lệ nào, sẽ trả về lỗi.

Ví dụ:

```bash
GET /_search
{
  "query": {
    "query_string": {
      "query": "(new york city) OR (big apple)",
      "default_field": "content"
    }
  }
}
```

### simple_query_string query

[**`simple_query_string query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html) là một loại truy vấn phù hợp để trực tiếp tiếp xúc với người dùng và có cú pháp truy vấn rất hoàn chỉnh, chấp nhận cú pháp truy vấn của Lucene, không ném ra ngoại lệ nếu có lỗi trong quá trình phân tích cú pháp.

Mặc dù cú pháp nghiêm ngặt hơn [**`query_string query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html), nhưng [**`simple_query_string query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html) không trả về lỗi cú pháp không hợp lệ. Ngược lại, nó sẽ bỏ qua bất kỳ phần không hợp lệ nào của chuỗi truy vấn.

Ví dụ:

```bash
GET /_search
{
  "query": {
    "simple_query_string" : {
        "query": "\"fried eggs\" +(eggplant | potato) -frittata",
        "fields": ["title^5", "body"],
        "default_operator": "and"
    }
  }
}
```

#### Ý nghĩa của simple_query_string

- `+`: tương đương với toán tử AND
- `|`: tương đương với toán tử OR
- `-`: tương đương với toán tử NOT
- `"`: bao quanh một số token để chỉ ra cụm từ dùng để tìm kiếm
- `*`: sau một từ để chỉ ra truy vấn tiền tố
- `(` và `)`: chỉ ra mức độ ưu tiên
- `~N`: sau một từ để chỉ ra khoảng cách chỉnh sửa (mờ)
- `~N`: sau một cụm từ để chỉ ra lượng tràn

Lưu ý: Để sử dụng các ký tự trên, hãy sử dụng dấu gạch chéo ngược `/` để thoát.

### Ví dụ hoàn chỉnh về truy vấn toàn văn

```bash
#Đặt position_increment_gap
DELETE groups
PUT groups
{
  "mappings": {
    "properties": {
      "names":{
        "type": "text",
        "position_increment_gap": 0
      }
    }
  }
}

GET groups/_mapping

POST groups/_doc
{
  "names": [ "John Water", "Water Smith"]
}

POST groups/_search
{
  "query": {
    "match_phrase": {
      "names": {
        "query": "Water Water",
        "slop": 100
      }
    }
  }
}

POST groups/_search
{
  "query": {
    "match_phrase": {
      "names": "Water Smith"
    }
  }
}

DELETE groups
```

Trong ví dụ này, chúng tôi thiết lập `position_increment_gap` cho trường "names" trong chỉ mục "groups". `position_increment_gap` được sử dụng để kiểm soát cách Elasticsearch xử lý các mảng của chuỗi văn bản khi thực hiện truy vấn cụm từ. Trong trường hợp này, nó được cài đặt là 0, có nghĩa là không có khoảng cách giữa các phần tử trong mảng.

Sau đó, chúng tôi thêm một tài liệu vào chỉ mục, với trường "names" bao gồm hai chuỗi: "John Water" và "Water Smith".

Tiếp theo, chúng tôi thực hiện hai truy vấn `match_phrase` khác nhau. Truy vấn đầu tiên tìm kiếm cụm từ "Water Water" với một "slop" (cho phép sự không khớp) là 100. Truy vấn thứ hai tìm kiếm cụm từ "Water Smith".

Cuối cùng, chúng tôi xóa chỉ mục "groups".

## Truy vấn từ khóa

**`Term` (từ khóa) là đơn vị nhỏ nhất để diễn đạt ý nghĩa**. Cả việc tìm kiếm và xử lý ngôn ngữ tự nhiên bằng mô hình ngôn ngữ thống kê đều cần xử lý Term.

Truy vấn toàn văn sẽ phân tích chuỗi truy vấn trước khi thực hiện truy vấn.

Khác với truy vấn toàn văn, truy vấn từ khóa không phân tách từ, mà coi đầu vào là một thể thống nhất, tìm kiếm các từ khóa chính xác trong chỉ mục đảo ngược và sử dụng công thức tính toán độ liên quan cho mỗi tài liệu chứa từ khóa đó. Nói cách khác: **truy vấn từ khóa là việc khớp chính xác từ khóa**. Truy vấn từ khóa thường được sử dụng cho dữ liệu có cấu trúc, như số, ngày và kiểu liệt kê.

Các loại truy vấn từ khóa bao gồm:

- **[`exists` query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-exists-query.html)**
- **[`fuzzy` query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-fuzzy-query.html)**
- **[`ids` query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-ids-query.html)**
- **[`prefix` query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-prefix-query.html)**
- **[`range` query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html)**
- **[`regexp` query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html)**
- **[`term` query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html)**
- **[`terms` query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-terms-query.html)**
- **[`type` query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-type-query.html)**
- **[`wildcard` query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-wildcard-query.html)**

### exists query

[**`exists query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-exists-query.html) sẽ trả về các tài liệu có ít nhất một giá trị không trống trong trường.

Vì nhiều lý do, trường của tài liệu có thể không tồn tại giá trị chỉ mục:

- Trường trong JSON là `null` hoặc `[]`
- Trường này được cấu hình `"index" : false` trong mapping
- Độ dài giá trị trường vượt quá cài đặt `ignore_above` trong mapping
- Định dạng giá trị trường không đúng và `ignore_malformed` đã được định nghĩa trong mapping

Ví dụ:

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "exists": {
      "field": "email"
    }
  }
}
```

Các tài liệu sau sẽ khớp với truy vấn trên:

- `{ "user" : "jane" }` có trường user và không trống.
- `{ "user" : "" }` có trường user, giá trị là chuỗi trống.
- `{ "user" : "-" }` có trường user, giá trị không trống.
- `{ "user" : [ "jane" ] }` có trường user, giá trị không trống.
- `{ "user" : [ "jane", null ] }` có trường user, chỉ cần có ít nhất một giá trị không trống.

Các tài liệu sau sẽ không khớp:

- `{ "user" : null }` có trường user nhưng giá trị trống.
- `{ "user" : [] }` có trường user nhưng giá trị trống.
- `{ "user" : [null] }` có trường user nhưng giá trị trống.
- `{ "foo" : "bar" }` không có trường user.

### fuzzy query

[**`fuzzy query`** (truy vấn mờ)](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-fuzzy-query.html) trả về các tài liệu chứa các từ tương tự với từ tìm kiếm. ES sử dụng [Khoảng cách chỉnh sửa Levenshtein](https://en.wikipedia.org/wiki/Levenshtein_distance) để đo độ tương tự hoặc mờ.

Khoảng cách chỉnh sửa là số lượng thay đổi ký tự đơn lẻ cần thiết để chuyển đổi một thuật ngữ thành thuật ngữ khác. Những thay đổi này có thể bao gồm:

- Thay đổi một ký tự: (**b**ox -> **f**ox)
- Xóa một ký tự: (**b**lack -> lack)
- Thêm một ký tự: (sic -> sic**k**)
- Đảo ngược hai ký tự liền kề: (**ac**t → **ca**t)

Để tìm các từ khóa tương tự, truy vấn mờ sẽ tạo ra tất cả các biến thể hoặc tập mở rộng có thể của từ khóa tìm kiếm trong khoảng cách chỉnh sửa được chỉ định. Sau đó, nó trả về các tài liệu khớp hoàn toàn với bất kỳ tập mở rộng nào.

```bash
GET books/_search
{
  "query": {
    "fuzzy": {
      "user.id": {
        "value": "ki",
        "fuzziness": "AUTO",
        "max_expansions": 50,
        "prefix_length": 0,
        "transpositions": true,
        "rewrite": "constant_score"
      }
    }
  }
}
```

Lưu ý: Nếu [`search.allow_expensive_queries`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html#query-dsl-allow-expensive-queries) đã được cấu hình, thì truy vấn mờ không thể được thực thi.

### ids query

[**`ids query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-ids-query.html) trả về các tài liệu dựa trên ID. Truy vấn này sử dụng ID tài liệu được lưu trữ trong trường `_id`.

```bash
GET /_search
{
  "query": {
    "ids" : {
      "values" : ["1", "4", "100"]
    }
  }
}
```

### prefix query

[**`prefix query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-prefix-query.html#prefix-query-ex-request) được sử dụng để truy vấn các tài liệu có chứa tiền tố chỉ định trong một trường nào đó.

Ví dụ, để truy vấn các tài liệu có `user.id` chứa các từ khóa bắt đầu bằng `ki`, tất cả các tài liệu chứa các từ khóa như `kind`, `kid` và bất kỳ từ khóa nào khác bắt đầu bằng `ki` sẽ được khớp.

```bash
GET /_search
{
  "query": {
    "prefix": {
      "user.id": {
        "value": "ki"
      }
    }
  }
}
```

### range query

[**`range query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html) hay truy vấn phạm vi, được sử dụng để khớp các tài liệu có trường số, ngày hoặc chuỗi trong một phạm vi nhất định. Ví dụ, tìm kiếm những quyển sách có giá từ 50 đến 100, hoặc những quyển sách được xuất bản từ năm 2015 đến năm 2019. **Truy vấn phạm vi chỉ có thể truy vấn một trường, không thể áp dụng trên nhiều trường**.

Truy vấn phạm vi hỗ trợ các tham số sau:

- **`gt`**: lớn hơn
- **`gte`**: lớn hơn hoặc bằng
- **`lt`**: nhỏ hơn
- **`lte`**: nhỏ hơn hoặc bằng
- **`format`**: nếu trường là loại Date, bạn có thể đặt định dạng ngày
- **`time_zone`**: múi giờ
- **`relation`**: chỉ ra cách truy vấn phạm vi khớp với các giá trị trường phạm vi.
  - **`INTERSECTS` (Mặc định)**: Khớp với các tài liệu có giá trị trường phạm vi giao nhau với truy vấn.
  - **`CONTAINS`**: Khớp với các tài liệu hoàn toàn chứa giá trị trường của truy vấn.
  - **`WITHIN`**: Khớp với các tài liệu có giá trị trường phạm vi hoàn toàn trong phạm vi truy vấn.

Ví dụ: Truy vấn phạm vi số

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "range": {
      "taxful_total_price": {
        "gt": 10,
        "lte": 50
      }
    }
  }
}
```

Ví dụ: Truy vấn phạm vi ngày

```bash
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "range": {
      "order_date": {
        "time_zone": "+00:00",
        "gte": "2018-01-01T00:00:00",
        "lte": "now"
      }
    }
  }
}
```

### regexp query

[**`regexp query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html) trả về các tài liệu thuộc về các term khớp với biểu thức chính quy.

[Biểu thức chính quy](https://vi.wikipedia.org/wiki/Bi%E1%BB%83u_th%E1%BB%A9c_ch%C3%ADnh_quy) là một phương pháp sử dụng các ký tự đại diện để khớp với các mô hình dữ liệu, được gọi là toán tử.

Ví dụ: Tìm kiếm dưới đây trả về các tài liệu có trường `user.id` chứa bất kỳ từ nào bắt đầu bằng `k` và kết thúc bằng `y`. Toán tử `.*` khớp với bất kỳ ký tự nào với bất kỳ độ dài nào, bao gồm cả không có ký tự. Các từ khớp có thể bao gồm `ky`, `kay` và `kimchy`.

```bash
GET /_search
{
  "query": {
    "regexp": {
      "user.id": {
        "value": "k.*y",
        "flags": "ALL",
        "case_insensitive": true,
        "max_determinized_states": 10000,
        "rewrite": "constant_score"
      }
    }
  }
}
```

> Lưu ý: Nếu [`search.allow_expensive_queries`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html#query-dsl-allow-expensive-queries) được cấu hình, thì [**`regexp query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html) sẽ bị vô hiệu hóa.

### term query

[**`term query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html) được sử dụng để tìm các tài liệu có chứa từ cụ thể trong một trường cụ thể. Truy vấn term không được phân tích, chỉ khi từ truy vấn và từ trong tài liệu khớp chính xác thì mới được tìm kiếm. Các tình huống áp dụng bao gồm tìm kiếm tên người, tên địa điểm và các yêu cầu khớp chính xác khác.

Ví dụ:

```bash
# 1. Tạo một chỉ mục
DELETE my-index-000001
PUT my-index-000001
{
  "mappings": {
    "properties": {
      "full_text": { "type": "text" }
    }
  }
}

# 2. Sử dụng từ khóa "Quick Brown Foxes!" để tìm kiếm trường "full_text"
PUT my-index-000001/_doc/1
{
  "full_text": "Quick Brown Foxes!"
}

# 3. Sử dụng term query
GET my-index-000001/_search?pretty
{
  "query": {
    "term": {
      "full_text": "Quick Brown Foxes!"
    }
  }
}
# Vì trường full_text không còn chứa Term chính xác - "Quick Brown Foxes!", nên term query không tìm thấy kết quả nào

# 4. Sử dụng match query
GET my-index-000001/_search?pretty
{
  "query": {
    "match": {
      "full_text": "Quick Brown Foxes!"
    }
  }
}

DELETE my-index-000001
```

> :warning: Lưu ý: Nên tránh sử dụng term query để truy vấn các trường text.
>
> Theo mặc định, Elasticsearch phân tích các giá trị của trường text, điều này khiến việc tìm kiếm khớp chính xác với giá trị của trường text trở nên khó khăn.
>
> Để tìm kiếm giá trị của trường text, bạn nên sử dụng match query.

### terms query

[**`terms query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-terms-query.html) giống với [**`term query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html), nhưng có thể tìm kiếm nhiều giá trị.

Các tham số truy vấn terms query:

- **`index`**: Tên chỉ mục
- **`id`**: ID tài liệu
- **`path`**: Tên của trường mà từ đó lấy giá trị trường, tức từ khóa tìm kiếm
- **`routing`** (tùy chọn): Giá trị định tuyến tùy chỉnh của tài liệu từ đó lấy giá trị term. Nếu giá trị định tuyến tùy chỉnh đã được cung cấp khi lập chỉ mục tài liệu, thì tham số này là bắt buộc.

Ví dụ:

```bash
# 1. Tạo một chỉ mục
DELETE my-index-000001
PUT my-index-000001
{
  "mappings": {
    "properties": {
      "color": { "type": "keyword" }
    }
  }
}

# 2. Ghi một tài liệu
PUT my-index-000001/_doc/1
{
  "color": [
    "blue",
    "green"
  ]
}

# 3. Ghi một tài liệu khác
PUT my-index-000001/_doc/2
{
  "color": "blue"
}

# 3. Sử dụng terms query
GET my-index-000001/_search?pretty
{
  "query": {
    "terms": {
      "color": {
        "index": "my-index-000001",
        "id": "2",
        "path": "color"
      }
    }
  }
}

DELETE my-index-000001
```

### type query

> Đã bị loại bỏ sau phiên bản 7.0.0

[**`type query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-type-query.html) được sử dụng để truy vấn các tài liệu có loại cụ thể.

Ví dụ:

```bash
GET /_search
{
  "query": {
    "type": {
      "value": "_doc"
    }
  }
}
```

Tuy nhiên, từ phiên bản 7.0.0 trở đi, Elasticsearch đã loại bỏ hỗ trợ cho nhiều loại tài liệu trong một chỉ mục. Do đó, `type query` không còn được sử dụng nữa. Thay vào đó, bạn có thể sử dụng các cấu trúc dữ liệu khác nhau trong cùng một tài liệu hoặc sử dụng nhiều chỉ mục.

### wildcard query

[**`wildcard query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-wildcard-query.html) là truy vấn sử dụng ký tự đại diện, trả về các tài liệu khớp với mô hình ký tự đại diện.

`?` được sử dụng để khớp với một ký tự bất kỳ, `*` được sử dụng để khớp với không hoặc nhiều ký tự.

Ví dụ: Truy vấn dưới đây trả về các tài liệu mà trường `user.id` chứa các thuật ngữ bắt đầu bằng `ki` và kết thúc bằng `y`. Các khớp này có thể bao gồm `kiy`, `kity` hoặc `kimchy`.

```bash
GET /_search
{
  "query": {
    "wildcard": {
      "user.id": {
        "value": "ki*y",
        "boost": 1.0,
        "rewrite": "constant_score"
      }
    }
  }
}
```

> Lưu ý: Nếu [`search.allow_expensive_queries`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html#query-dsl-allow-expensive-queries) được cấu hình, thì [**`wildcard query`**](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-wildcard-query.html) sẽ bị vô hiệu hóa.

### Ví dụ hoàn chỉnh về truy vấn từ khoá

```bash
DELETE products
PUT products
{
  "settings": {
    "number_of_shards": 1
  }
}

POST /products/_bulk
{ "index": { "_id": 1 }}
{ "productID" : "XHDK-A-1293-#fJ3","desc":"iPhone" }
{ "index": { "_id": 2 }}
{ "productID" : "KDKE-B-9947-#kL5","desc":"iPad" }
{ "index": { "_id": 3 }}
{ "productID" : "JODL-X-1937-#pV7","desc":"MBP" }

GET /products

POST /products/_search
{
  "query": {
    "term": {
      "desc": {
        //"value": "iPhone"
        "value":"iphone"
      }
    }
  }
}

POST /products/_search
{
  "query": {
    "term": {
      "desc.keyword": {
        //"value": "iPhone"
        //"value":"iphone"
      }
    }
  }
}

POST /products/_search
{
  "query": {
    "term": {
      "productID": {
        "value": "XHDK-A-1293-#fJ3"
      }
    }
  }
}

POST /products/_search
{
  //"explain": true,
  "query": {
    "term": {
      "productID.keyword": {
        "value": "XHDK-A-1293-#fJ3"
      }
    }
  }
}

POST /products/_search
{
  "explain": true,
  "query": {
    "constant_score": {
      "filter": {
        "term": {
          "productID.keyword": "XHDK-A-1293-#fJ3"
        }
      }

    }
  }
}
```

Trong ví dụ trên, chúng ta đã tạo một chỉ mục `products` với một số tài liệu. Mỗi tài liệu có hai trường là `productID` và `desc`.

Sau đó, chúng ta thực hiện một số truy vấn từ ngữ (`term query`) khác nhau. Truy vấn từ ngữ được sử dụng để tìm các tài liệu mà một trường cụ thể chứa một giá trị cụ thể.

Trong các truy vấn, chúng ta có thể thấy rằng Elasticsearch phân biệt chữ hoa và chữ thường. Ví dụ, truy vấn từ ngữ với giá trị "iphone" sẽ không trả về tài liệu mà trường `desc` có giá trị "iPhone".

Ngoài ra, chúng ta cũng thấy rằng chúng ta có thể sử dụng trường `keyword` để thực hiện truy vấn không phân biệt chữ hoa và chữ thường.

Cuối cùng, chúng ta cũng thấy rằng chúng ta có thể sử dụng `constant_score` để áp dụng điểm số cố định cho tất cả các tài liệu khớp.

## Truy vấn kết hợp

Truy vấn kết hợp là việc kết hợp một số truy vấn đơn giản lại với nhau để đáp ứng các yêu cầu truy vấn phức tạp hơn. Ngoài ra, truy vấn kết hợp cũng có thể điều khiển hành vi của các truy vấn khác.

### bool query

Truy vấn bool có thể kết hợp bất kỳ số lượng truy vấn đơn giản nào, sử dụng các tùy chọn must, should, must_not, filter để biểu thị logic giữa các truy vấn đơn giản. Mỗi tùy chọn có thể xuất hiện từ 0 đến nhiều lần, ý nghĩa của chúng như sau:

- must: tài liệu phải khớp với các điều kiện truy vấn trong tùy chọn must, tương đương với AND trong logic, và tham gia vào việc đánh giá mức độ liên quan của tài liệu.
- should: tài liệu có thể khớp hoặc không khớp với các điều kiện truy vấn trong tùy chọn should, tương đương với OR trong logic, và tham gia vào việc đánh giá mức độ liên quan của tài liệu.
- must_not: ngược lại với must, các tài liệu khớp với các điều kiện truy vấn trong tùy chọn must_not sẽ không được trả về; điều cần lưu ý là **câu lệnh must_not không ảnh hưởng đến việc đánh giá điểm, nó chỉ loại bỏ các tài liệu không liên quan**.
- filter: giống như must, chỉ các tài liệu khớp với các điều kiện truy vấn trong tùy chọn filter mới được trả về, **nhưng filter không đánh giá điểm, chỉ có chức năng lọc, ngược lại với must_not**.

Giả sử bạn muốn tìm kiếm các cuốn sách có tiêu đề chứa từ khóa java, giá không cao hơn 70, mô tả có thể chứa hoặc không chứa máy ảo, bạn có thể tạo truy vấn bool như sau:

```
GET books/_search
{
  "query": {
    "bool": {
      "filter": {
        "term": {
          "status": 1
        }
      },
      "must_not": {
        "range": {
          "price": {
            "gte": 70
          }
        }
      },
      "must": {
        "match": {
          "title": "java"
        }
      },
      "should": [
        {
          "match": {
            "description": "máy ảo"
          }
        }
      ],
      "minimum_should_match": 1
    }
  }
}
```

Để biết thêm thông tin chi tiết về truy vấn bool, hãy tham khảo [bool query（truy vấn kết hợp）chi tiết](https://www.knowledgedict.com/tutorial/elasticsearch-query-bool.html).

### Truy vấn boosting

Truy vấn boosting được sử dụng trong các tình huống cần điều chỉnh điểm số của hai truy vấn. Truy vấn boosting sẽ đóng gói hai truy vấn lại với nhau và giảm điểm số của một trong hai truy vấn.

Truy vấn boosting bao gồm ba phần: positive, negative và negative_boost. Điểm số của truy vấn trong phần positive được giữ nguyên, truy vấn trong phần negative sẽ giảm điểm số của tài liệu, và negative_boost chỉ định giá trị giảm trong phần negative. Nếu chúng ta muốn giảm điểm số của các cuốn sách xuất bản trước năm 2015, chúng ta có thể tạo một truy vấn boosting, truy vấn như sau:

```
GET books/_search
{
	"query": {
		"boosting": {
			"positive": {
				"match": {
					"title": "python"
				}
			},
			"negative": {
				"range": {
					"publish_time": {
						"lte": "2015-01-01"
					}
				}
			},
			"negative_boost": 0.2
		}
	}
}
```

Trong truy vấn boosting, chúng ta đã chỉ định yếu tố ức chế là 0.2, điểm số của các tài liệu có giá trị publish_time sau ngày 01-01-2015 không thay đổi, điểm số của các tài liệu có giá trị publish_time trước ngày 01-01-2015 sẽ là 0.2 lần điểm số gốc.

### Truy vấn constant_score

Truy vấn constant_score đóng gói một truy vấn filter và trả về các tài liệu phù hợp với điều kiện truy vấn của bộ lọc, với điểm số liên quan của tất cả chúng đều bằng giá trị của tham số \_boost_ (có thể hiểu là điểm số liên quan ban đầu dựa trên tf-idf hoặc bm25 được cố định là 1.0, vì vậy điểm số cuối cùng là _1.0 \* boost_, tức là bằng giá trị của tham số _boost_). Truy vấn dưới đây sẽ trả về các tài liệu có trường title chứa từ khóa _elasticsearch_, với điểm số của tất cả các tài liệu đều là 1.8:

```
GET books/_search
{
  "query": {
    "constant_score": {
      "filter": {
        "term": {
          "title": "elasticsearch"
        }
      },
      "boost": 1.8
    }
  }
}
```

### Truy vấn dis_max

Truy vấn dis_max có một số liên hệ nhưng cũng có sự khác biệt với truy vấn bool. Truy vấn dis_max hỗ trợ nhiều truy vấn song song, có thể trả về bất kỳ loại tài liệu nào phù hợp với bất kỳ điều kiện truy vấn con nào. Khác với cách truy vấn bool có thể kết hợp điểm số của tất cả các truy vấn phù hợp, truy vấn dis_max chỉ sử dụng điểm số của điều kiện truy vấn phù hợp nhất. Hãy xem ví dụ dưới đây:

```
GET books/_search
{
	"query": {
		"dis_max": {
			"tie_breaker": 0.7,
			"boost": 1.2,
			"queries": [{
					"term": {
						"age": 34
					}
				},
				{
					"term": {
						"age": 35
					}
				}
			]
		}
	}
}
```

### Truy vấn function_score

Truy vấn function_score có thể chỉnh sửa điểm số của các tài liệu được truy vấn, loại truy vấn này rất hữu ích trong một số trường hợp, chẳng hạn như khi chi phí tính toán điểm số của tài liệu bằng hàm điểm số là quá cao, người dùng có thể thay thế cách tính điểm số truyền thống bằng cách sử dụng bộ lọc kết hợp với hàm điểm số tùy chỉnh.

Khi sử dụng truy vấn function_score, người dùng cần định nghĩa một truy vấn và một hoặc nhiều hàm điểm số, hàm điểm số sẽ tính toán điểm số cho mỗi tài liệu được truy vấn.

Truy vấn dưới đây sẽ trả về tất cả các tài liệu trong chỉ mục books, với điểm số tối đa của tài liệu là 5, điểm số của mỗi tài liệu được tạo ngẫu nhiên, chế độ tính trọng số là chế độ nhân.

```
GET books/_search
{
  "query": {
    "function_score": {
      "query": {
        "match_all": {}
      },
      "boost": "5",
      "random_score": {},
      "boost_mode": "multiply"
    }
  }
}
```

Sử dụng script để tùy chỉnh công thức điểm số, ở đây chúng tôi lấy căn bậc hai của một phần mười giá trị price làm điểm số cho mỗi tài liệu, truy vấn như sau:

```
GET books/_search
{
  "query": {
    "function_score": {
      "query": {
        "match": {
          "title": "java"
        }
      },
      "script_score": {
        "inline": "Math.sqrt(doc['price'].value/10)"
      }
    }
  }
}
```

Để biết thêm chi tiết về function_score, vui lòng xem [Elasticsearch function_score truy vấn giải thích mạnh nhất](https://www.knowledgedict.com/tutorial/elasticsearch-function_score.html).

### Truy vấn indices

Truy vấn indices phù hợp với các tình huống cần truy vấn giữa nhiều chỉ mục, nó cho phép chỉ định danh sách tên chỉ mục và truy vấn nội bộ. Trong truy vấn indices, có hai phần là query và no_match_query. Phần query được sử dụng để tìm kiếm tài liệu trong danh sách chỉ mục được chỉ định, trong khi điều kiện truy vấn trong no_match_query được sử dụng để tìm kiếm tài liệu ngoài danh sách chỉ mục được chỉ định. Truy vấn sau đây tìm kiếm các tài liệu trong chỉ mục books và books2 có trường title chứa từ khóa "javascript", và các tài liệu trong các chỉ mục khác có trường title chứa "basketball". Truy vấn như sau:

```
GET books/_search
{
	"query": {
		"indices": {
			"indices": ["books", "books2"],
			"query": {
				"match": {
					"title": "javascript"
				}
			},
			"no_match_query": {
				"term": {
					"title": "basketball"
				}
			}
		}
	}
}
```

## Truy vấn lồng

Trong hệ thống phân tán như Elasticsearch, việc thực hiện truy vấn kết nối theo phong cách SQL toàn diện có chi phí cao và không khả thi. Thay vào đó, để thực hiện mở rộng theo quy mô chiều ngang, Elasticsearch cung cấp hai hình thức join sau:

- Truy vấn lồng (nested query)

  Các tài liệu có thể chứa các trường kiểu lồng, các trường này được sử dụng để chỉ mục một số đối tượng mảng, mỗi đối tượng có thể được truy vấn như một tài liệu độc lập.

- Truy vấn has_child (có truy vấn con) và truy vấn has_parent (có truy vấn cha)

  Mối quan hệ cha-con có thể tồn tại giữa hai loại tài liệu trong một chỉ mục duy nhất. Truy vấn has_child sẽ trả về các tài liệu cha mà tài liệu con của chúng đáp ứng truy vấn cụ thể, trong khi has_parent sẽ trả về các tài liệu con mà tài liệu cha của chúng đáp ứng truy vấn cụ thể.

### Truy vấn lồng

Các tài liệu có thể chứa các trường kiểu lồng, các trường này được sử dụng để chỉ mục một số đối tượng mảng, mỗi đối tượng có thể được truy vấn như một tài liệu độc lập (sử dụng truy vấn lồng).

```
PUT /my_index
{
	"mappings": {
		"type1": {
			"properties": {
				"obj1": {
					"type": "nested"
				}
			}
		}
	}
}
```

### Truy vấn has_child

Mối quan hệ cha-con giữa các tài liệu được khai báo trong lúc tạo chỉ mục, trong ví dụ này, chúng ta sẽ sử dụng nhân viên (employee) và chi nhánh (branch) làm ví dụ, chúng thuộc về các loại khác nhau, tương đương với hai bảng trong cơ sở dữ liệu. Nếu chúng ta muốn liên kết nhân viên với thành phố mà họ làm việc, chúng ta cần thông báo cho Elasticsearch về mối quan hệ cha-con giữa các tài liệu, trong đó employee là loại con, và branch là loại cha. Chúng ta khai báo mối quan hệ này trong lúc tạo chỉ mục, thực hiện lệnh sau:

```
PUT /company
{
	"mappings": {
		"branch": {},
		"employee": {
			"parent": { "type": "branch" }
		}
	}
}
```

Sử dụng bulk api để chỉ mục tài liệu dưới loại branch, lệnh như sau:

```
POST company/branch/_bulk
{ "index": { "_id": "london" }}
{ "name": "London Westminster","city": "London","country": "UK" }
{ "index": { "_id": "liverpool" }}
{ "name": "Liverpool Central","city": "Liverpool","country": "UK" }
{ "index": { "_id": "paris" }}
{ "name": "Champs Elysees","city": "Paris","country": "France" }
```

Thêm dữ liệu nhân viên:

```
POST company/employee/_bulk
{ "index": { "_id": 1,"parent":"london" }}
{ "name": "Alice Smith","dob": "1970-10-24","hobby": "hiking" }
{ "index": { "_id": 2,"parent":"london" }}
{ "name": "Mark Tomas","dob": "1982-05-16","hobby": "diving" }
{ "index": { "_id": 3,"parent":"liverpool" }}
{ "name": "Barry Smith","dob": "1979-04-01","hobby": "hiking" }
{ "index": { "_id": 4,"parent":"paris" }}
{ "name": "Adrien Grand","dob": "1987-05-11","hobby": "horses" }
```

Để truy vấn tài liệu cha thông qua tài liệu con, chúng ta sử dụng truy vấn has_child. Ví dụ, để tìm kiếm các chi nhánh có nhân viên sinh sau năm 1980, nhân viên sinh sau năm 1980 bao gồm Mark Thomas và Adrien Grand, họ làm việc tại London và Paris tương ứng. Chúng ta thực hiện lệnh truy vấn sau để xác minh:

```
GET company/branch/_search
{
	"query": {
		"has_child": {
			"type": "employee",
			"query": {
				"range": { "dob": { "gte": "1980-01-01" } }
			}
		}
	}
}
```

Tìm kiếm những chi nhánh có nhân viên tên là "Alice Smith", vì chúng ta sử dụng truy vấn match, nó sẽ được phân tích thành "Alice" và "Smith", vì vậy chi nhánh mà Alice Smith và Barry Smith làm việc sẽ được khớp. Chúng ta thực hiện lệnh truy vấn sau để xác minh:

```
GET company/branch/_search
{
	"query": {
		"has_child": {
			"type": "employee",
			"score_mode": "max",
			"query": {
				"match": { "name": "Alice Smith" }
			}
		}
	}
}
```

Chúng ta có thể sử dụng min_children để chỉ định số lượng tối thiểu của tài liệu con. Ví dụ, để tìm kiếm những chi nhánh có ít nhất hai nhân viên, chúng ta thực hiện lệnh truy vấn sau:

```
GET company/branch/_search?pretty
{
	"query": {
		"has_child": {
			"type": "employee",
			"min_children": 2,
			"query": {
				"match_all": {}
			}
		}
	}
}
```

### Truy vấn has_parent

Để truy vấn tài liệu con thông qua tài liệu cha, chúng ta sử dụng truy vấn has_parent. Ví dụ, để tìm kiếm những nhân viên làm việc ở UK, chúng ta thực hiện lệnh truy vấn sau:

```
GET company/employee/_search
{
	"query": {
		"has_parent": {
			"parent_type": "branch",
			"query": {
				"match": { "country": "UK" }
			}
		}
	}
}
```

## Truy vấn vị trí

Elasticsearch có thể tìm kiếm dữ liệu của loại điểm địa lý (geo_point) và hình dạng địa lý (geo_shape). Để thuận tiện cho việc học, chúng ta sẽ chuẩn bị một số tọa độ địa lý của các thành phố để làm dữ liệu thử nghiệm, mỗi tài liệu đều bao gồm hai trường là tên thành phố và tọa độ địa lý. Tọa độ này được lấy từ một vị trí ở trung tâm của mỗi thành phố. Đầu tiên, hãy lưu nội dung sau vào tệp geo.json:

```
{"index":{ "_index":"geo","_type":"city","_id":"1" }}
{"name":"Bắc Kinh","location":"39.9088145109,116.3973999023"}
{"index":{ "_index":"geo","_type":"city","_id": "2" }}
{"name":"Urumqi","location":"43.8266300000,87.6168800000"}
{"index":{ "_index":"geo","_type":"city","_id":"3" }}
{"name":"Tây An","location":"34.3412700000,108.9398400000"}
{"index":{ "_index":"geo","_type":"city","_id":"4" }}
{"name":"Zhengzhou","location":"34.7447157466,113.6587142944"}
{"index":{ "_index":"geo","_type":"city","_id":"5" }}
{"name":"Hàng Châu","location":"30.2294080260,120.1492309570"}
{"index":{ "_index":"geo","_type":"city","_id":"6" }}
{"name":"Jinan","location":"36.6518400000,117.1200900000"}
```

Tạo một chỉ mục và thiết lập ánh xạ:

```
PUT geo
{
	"mappings": {
		"city": {
			"properties": {
				"name": {
					"type": "keyword"
				},
				"location": {
					"type": "geo_point"
				}
			}
		}
	}
}
```

Sau đó thực hiện lệnh nhập hàng loạt:

```
curl -XPOST "http://localhost:9200/_bulk?pretty" --data-binary @geo.json
```

### Truy vấn geo_distance

Truy vấn geo_distance có thể tìm kiếm các tài liệu điểm địa lý nằm trong phạm vi xác định từ một điểm trung tâm. Ví dụ, để tìm kiếm các thành phố nằm trong bán kính 200km từ Thanh Đô, kết quả tìm kiếm sẽ trả về Bắc Kinh, lệnh như sau:

```
GET geo/_search
{
	"query": {
		"bool": {
			"must": {
				"match_all": {}
			},
			"filter": {
				"geo_distance": {
					"distance": "200km",
					"location": {
						"lat": 39.0851000000,
						"lon": 117.1993700000
					}
				}
			}
		}
	}
}
```

Sắp xếp các thành phố theo khoảng cách đến Bắc Kinh:

```
GET geo/_search
{
  "query": {
    "match_all": {}
  },
  "sort": [{
    "_geo_distance": {
      "location": "39.9088145109,116.3973999023",
      "unit": "km",
      "order": "asc",
      "distance_type": "plane"
    }
  }]
}
```

Trong đó, trường location tương ứng với trường kinh độ và vĩ độ; unit là `km`, nghĩa là khoảng cách sẽ được ghi vào khóa sort của mỗi kết quả trả về theo đơn vị `km`; distance_type là `plane`, nghĩa là sử dụng phương pháp tính toán `plane` nhanh nhưng độ chính xác hơi kém.

### Truy vấn geo_bounding_box

Truy vấn geo_bounding_box được sử dụng để tìm kiếm các tọa độ địa lý nằm trong một hình chữ nhật xác định. Truy vấn xác định một hình chữ nhật bằng hai điểm, sau đó tìm kiếm các tài liệu phù hợp trong khu vực hình chữ nhật.

```
GET geo/_search
{
	"query": {
		"bool": {
			"must": {
				"match_all": {}
			},
			"filter": {
				"geo_bounding_box": {
					"location": {
						"top_left": {
							"lat": 38.4864400000,
							"lon": 106.2324800000
						},
						"bottom_right": {
							"lat": 28.6820200000,
							"lon": 115.8579400000
						}
					}
				}
			}
		}
	}
}
```

### Truy vấn geo_polygon

Truy vấn geo_polygon được sử dụng để tìm kiếm các điểm địa lý nằm trong một đa giác xác định. Ví dụ, Hohhot, Chongqing và Thượng Hải tạo thành một tam giác, truy vấn các thành phố nằm trong khu vực tam giác này, lệnh như sau:

```
GET geo/_search
{
	"query": {
		"bool": {
			"must": {
				"match_all": {}
			}
		},
		"filter": {
			"geo_polygon": {
				"location": {
					"points": [{
						"lat": 40.8414900000,
						"lon": 111.7519900000
					}, {
						"lat": 29.5647100000,
						"lon": 106.5507300000
					}, {
						"lat": 31.2303700000,
						"lon": 121.4737000000
					}]
				}
			}
		}
	}
}
```

### Truy vấn geo_shape

Truy vấn geo_shape được sử dụng để tìm kiếm dữ liệu địa lý kiểu geo_shape, có ba mối quan hệ giữa các hình dạng địa lý là giao nhau, chứa và không giao nhau. Tạo một chỉ mục mới để thử nghiệm, trong đó loại trường location được đặt là geo_shape.

```
PUT geoshape
{
	"mappings": {
		"city": {
			"properties": {
				"name": {
					"type": "keyword"
				},
				"location": {
					"type": "geo_shape"
				}
			}
		}
	}
}
```

Về thứ tự kinh độ và vĩ độ, chúng ta cần lưu ý rằng, đối với trường kiểu geo_point, vĩ độ đứng trước kinh độ, nhưng đối với điểm trong kiểu geo_shape, kinh độ đứng trước vĩ độ.

Chúng ta có thể viết dòng kết nối Tây An và Zhengzhou vào chỉ mục:

```
POST geoshape/city/1
{
	"name": "Tây An-Zhengzhou",
	"location": {
		"type": "linestring",
		"coordinates": [
			[108.9398400000, 34.3412700000],
			[113.6587142944, 34.7447157466]
		]
	}
}
```

Truy vấn hình dạng địa lý nằm trong hình chữ nhật được tạo bởi Yinchuan và Nanchang làm các điểm trên đường chéo, vì đường thẳng từ Tây An đến Zhengzhou nằm trong khu vực hình chữ nhật này, vì vậy nó có thể được truy vấn. Lệnh như sau:

```
GET geoshape/_search
{
	"query": {
		"bool": {
			"must": {
				"match_all": {}
			},
			"filter": {
				"geo_shape": {
					"location": {
						"shape": {
							"type": "envelope",
							"coordinates": [
								[106.23248, 38.48644],
								[115.85794, 28.68202]
							]
						},
						"relation": "within"
					}
				}
			}
		}
	}
}
```

### Truy vấn more_like_this

Truy vấn more_like_this có thể tìm kiếm các tài liệu tương tự với văn bản cung cấp, thường được sử dụng trong các tình huống như đề xuất văn bản tương tự. Lệnh truy vấn như sau:

```
GET books/_search
{
	"query": {
		"more_like_this": {
			"fields": ["title", "description"],
			"like": "java virtual machine",
			"min_term_freq": 1,
			"max_query_terms": 12
		}
	}
}
```

Các tham số tùy chọn và mô tả giá trị của chúng như sau:

- fields: các trường cần phù hợp, mặc định là trường \_all.
- like: văn bản cần phù hợp.
- min_term_freq: tần suất tối thiểu của các thuật ngữ trong tài liệu, mặc định là 2, các tài liệu có tần suất thấp hơn sẽ bị bỏ qua.
- max_query_terms: số lượng thuật ngữ tối đa có thể có trong truy vấn, mặc định là 25.
- min_doc_freq: tần suất tài liệu tối thiểu, mặc định là 5.
- max_doc_freq: tần suất tài liệu tối đa.
- min_word_length: độ dài tối thiểu của từ.
- max_word_length: độ dài tối đa của từ.
- stop_words: danh sách các từ dừng.
- analyzer: bộ phân tích.
- minimum_should_match: số lượng thuật ngữ tối thiểu mà tài liệu cần phù hợp, mặc định là 30% số thuật ngữ sau khi phân tích truy vấn.
- boost_terms: trọng số của các thuật ngữ.
- include: liệu có nên trả về tài liệu đầu vào như một kết quả hay không.
- boost: trọng số của toàn bộ truy vấn, mặc định là 1.0.

### Truy vấn script

Elasticsearch hỗ trợ việc sử dụng script để truy vấn. Ví dụ, để tìm kiếm các tài liệu có giá lớn hơn 180, lệnh như sau:

```
GET books/_search
{
  "query": {
    "script": {
      "script": {
        "inline": "doc['price'].value > 180",
        "lang": "painless"
      }
    }
  }
}
```

### Truy vấn percolate

Trong hầu hết các trường hợp, chúng ta thường viết tài liệu vào Elasticsearch trước, sau đó sử dụng câu lệnh truy vấn để tìm kiếm tài liệu. Truy vấn percolate làm điều ngược lại, nó đăng ký các điều kiện truy vấn trước, sau đó dựa vào tài liệu để truy vấn query. Ví dụ, trong chỉ mục my-index có một loại laptop, tài liệu có hai trường là price và name, trong mapping, chúng ta định nghĩa một trường percolator là query, lệnh như sau:

```
PUT my-index
{
	"mappings": {
		"laptop": {
			"properties": {
				"price": { "type": "long" },
				"name": { "type": "text" }
			},
			"queries": {
				"properties": {
					"query": { "type": "percolator" }
				}
			}
		}
	}
}
```

Đăng ký một bool query, trong đó bool query bao gồm một range query, yêu cầu trường price có giá trị nhỏ hơn hoặc bằng 10000, và trường name chứa từ khóa macbook:

```
PUT /my-index/queries/1?refresh
{
	"query": {
		"bool": {
			"must": [{
				"range": { "price": { "lte": 10000 } }
			}, {
				"match": { "name": "macbook" }
			}]
		}
	}
}
```

Truy vấn query dựa vào tài liệu:

```
GET /my-index/_search
{
	"query": {
		"percolate": {
			"field": "query",
			"document_type": "laptop",
			"document": {
				"price": 9999,
				"name": "macbook pro on sale"
			}
		}
	}
}
```

Tài liệu phù hợp với điều kiện trong query, kết quả trả về có thể tìm thấy bool query đã đăng ký ở trên. Truy vấn percolate có tính năng này phù hợp với các tình huống như phân loại dữ liệu, định tuyến dữ liệu, giám sát sự kiện và cảnh báo.
