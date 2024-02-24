---
title: Elasticsearch Sorting
tags:
  - elasticssearch
  - database
categories: 
date created: 2024-02-23
date modified: 2024-02-23
---

Elasticsearch Sorting

# Sắp xếp Elasticsearch

Trong Elasticsearch, mặc định được sắp xếp theo **đánh giá liên quan (\_score)** theo thứ tự giảm dần, hoặc có thể sắp xếp theo **giá trị của trường**, **sắp xếp nhiều cấp**, **sắp xếp trường nhiều giá trị**, **sắp xếp dựa trên vị trí địa lý (geo)** và **sắp xếp tùy chỉnh bằng script**. Ngoài ra, đánh giá liên quan cũng có thể được sử dụng để đánh giá lại với rescore hai, ba lần, nó có thể giới hạn kích thước cửa sổ (window size) cho việc đánh giá lại và chỉnh sửa điểm số của các tài liệu trong phạm vi tác động, từ đó đạt được mục tiêu kiểm soát kết quả liên quan một cách tinh vi.

## Sắp xếp liên quan mặc định

Trong Elasticsearch, mặc định, các tài liệu được sắp xếp theo thứ tự giảm dần của điểm liên quan, trường tương ứng với điểm liên quan được biểu thị bằng `_score`, đây là kiểu số thực, điểm `_score` càng cao, liên quan càng cao. Mô hình đánh giá có thể được chỉ định thông qua tham số `similarity` trong ánh xạ.

Thuật toán tương tự có thể được chỉ định theo trường, chỉ cần chọn trong ánh xạ cho các trường khác nhau, nếu bạn muốn chỉnh sửa thuật toán tương tự của trường hiện có, bạn chỉ có thể đạt được mục tiêu này bằng cách xây dựng lại chỉ mục cho dữ liệu. Đối với thuật toán tương tự es hơn, bạn có thể tham khảo [Sự hiểu biết sâu sắc về thuật toán tương tự es (tính điểm liên quan)](https://www.knowledgedict.com/tutorial/elasticsearch-similarity.html).

### Mô hình TF-IDF

Trước phiên bản 5.4 của Elasticsearch, các trường kiểu text mặc định sử dụng mô hình không gian vector dựa trên tf-idf.

Khi bắt đầu tính điểm, Elasticsearch sử dụng tần suất của từ khóa được tìm kiếm và mức độ phổ biến của nó để ảnh hưởng đến điểm. Một giải thích ngắn gọn là, **càng nhiều lần một từ khóa xuất hiện trong một tài liệu, nó càng liên quan; tuy nhiên, nếu từ khóa xuất hiện trong nhiều tài liệu khác nhau, nó càng không liên quan**. Điều này được gọi là TF-IDF, TF là **tần suất từ** (term frequency), IDF là **tần suất tài liệu nghịch đảo** (inverse document frequency).

Cách tiếp cận chính để đánh giá một tài liệu là đếm số lần một từ khóa xuất hiện trong văn bản. Ví dụ, nếu người dùng tìm kiếm một buổi họp về Elasticsearch trong khu vực của họ, họ muốn nhóm thảo luận về Elasticsearch được hiển thị đầu tiên.

```
"We will discuss Elasticsearch at the next Big Data group."
"Tuesday the Elasticsearch team will gather to answer questions about Elasticsearch."
```

Câu đầu tiên đề cập đến Elasticsearch một lần, trong khi câu thứ hai đề cập đến Elasticsearch hai lần, vì vậy tài liệu chứa câu thứ hai nên có điểm số cao hơn so với tài liệu chứa câu đầu tiên. Nếu chúng ta đề cập đến số lượng, tần suất từ (TF) của câu đầu tiên là 1, trong khi tần suất từ của câu thứ hai sẽ là 2.

Tần suất tài liệu nghịch đảo phức tạp hơn một chút so với tần suất từ. Mô tả tuyệt vời này có nghĩa là, nếu một từ (thông thường là một từ, nhưng không nhất thiết phải là một từ) xuất hiện nhiều lần trong các tài liệu khác nhau của chỉ mục, thì nó sẽ không quan trọng. Ví dụ sau sẽ giải thích điều này một cách dễ dàng hơn.

```
"We use Elasticsearch to power the search for our website."
"The developers like Elasticsearch so far."
"The scoring of documents is calculated by the scoring formula."
```

Trong ví dụ trên, cần hiểu những điểm sau:

- Tần suất tài liệu của từ khóa "Elasticsearch" là 2 (vì nó xuất hiện trong hai tài liệu). Tần suất tài liệu nghịch đảo xuất phát từ việc nhân điểm với 1/DF, nơi DF là tần suất tài liệu của từ khóa. Điều này có nghĩa là, do từ khóa có tần suất tài liệu cao hơn, trọng số của nó sẽ giảm.
- Tần suất tài liệu của từ khóa "the" là 3, vì nó xuất hiện trong tất cả ba tài liệu. Lưu ý rằng, mặc dù "the" xuất hiện hai lần trong tài liệu cuối cùng, tần suất tài liệu của nó vẫn là 3. Điều này là bởi vì tần suất tài liệu nghịch đảo chỉ kiểm tra xem một từ khóa có xuất hiện trong một tài liệu nào đó hay không, chứ không kiểm tra xem nó xuất hiện bao nhiêu lần. Điều đó nên là mối quan tâm của tần suất từ.

Tần suất tài liệu nghịch đảo là một yếu tố quan trọng, được sử dụng để cân nhắc tần suất từ. Ví dụ, xem xét một người dùng tìm kiếm từ khóa "the score", từ "the" xuất hiện gần như trong mọi văn bản tiếng Anh thông thường, nếu nó không được cân nhắc, tần suất từ của từ "the" sẽ hoàn toàn che mờ tần suất từ của từ "score". Tần suất tài liệu nghịch đảo IDF cân nhắc ảnh hưởng liên quan của từ thông dụng như "the", vì vậy điểm liên quan thực tế sẽ mô tả chính xác hơn từ khóa của truy vấn.

Một khi tần suất từ TF và tần suất tài liệu nghịch đảo IDF đã được tính toán, bạn có thể sử dụng công thức TF-IDF để tính điểm của tài liệu.

### Mô hình BM25

Sau phiên bản 5.4 của Elasticsearch, đối với trường kiểu text, mặc định sử dụng mô hình đánh giá BM25, không phải mô hình không gian vector dựa trên tf-idf, mô hình đánh giá có thể được chỉ định thông qua tham số `similarity` trong ánh xạ.

## Sắp xếp theo giá trị của trường

Trong Elasticsearch, để sắp xếp theo giá trị của một trường, bạn có thể sử dụng tham số `sort`.

```bash
GET books/_search
{
  "sort": {
    "price": {
      "order": "desc"
    }
  }
}
```

Kết quả trả về như sau:

```json
{
  "took": 132,
  "timed_out": false,
  "_shards": {
    "total": 10,
    "successful": 10,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": 749244,
    "max_score": null,
    "hits": [
      {
        "_index": "books",
        "_type": "book",
        "_id": "8456479",
        "_score": null,
        "_source": {
          "id": 8456479,
          "price": 1580.00,
          ...
        },
        "sort": [
          1580.00
        ]
      },
      ...
    ]
  }
}
```

Từ kết quả trả về trên, có thể thấy, `max_score` và `_score` đều trả về `null`, và trường `sort` được thêm vào, chứa giá trị của trường được sắp xếp. Việc tính toán `_score` tốn kém, nếu không sắp xếp theo mức độ liên quan, việc ghi lại `_score` không có ý nghĩa. Nếu bạn vẫn muốn tính toán `_score` dù sao, bạn có thể đặt tham số `track_scores` thành `true`.

## Sắp xếp nhiều trường

Nếu chúng ta muốn kết hợp price, date và \_score để truy vấn, và kết quả phù hợp đầu tiên được sắp xếp theo giá, sau đó được sắp xếp theo ngày, và cuối cùng được sắp xếp theo mức độ liên quan, ví dụ cụ thể như sau:

```bash
GET books/_search
{
	"query": {
		"bool": {
			"must": {
				"match": { "content": "java" }
			},
			"filter": {
				"term": { "user_id": 4868438 }
			}
		}
	},
	"sort": [{
			"price": {
				"order": "desc"
			}
		}, {
			"date": {
				"order": "desc"
			}
		}, {
			"_score": {
				"order": "desc"
			}
		}
	]
}
```

Thứ tự của các điều kiện sắp xếp rất quan trọng. Kết quả đầu tiên được sắp xếp theo điều kiện đầu tiên, chỉ khi giá trị `sort` đầu tiên của tập kết quả hoàn toàn giống nhau, kết quả mới được sắp xếp theo điều kiện thứ hai, và cứ tiếp tục như vậy.

Sắp xếp nhiều cấp không nhất thiết phải bao gồm `_score`. Bạn có thể sắp xếp theo một số trường khác nhau, như khoảng cách địa lý hoặc giá trị được tính toán bằng script.

## Sắp xếp trường có nhiều giá trị

Một trường hợp là sắp xếp khi trường có nhiều giá trị, cần nhớ rằng các giá trị này không có thứ tự cố định; một trường có nhiều giá trị chỉ đơn giản là một bộ giá trị nhiều, vậy nên chọn giá trị nào để sắp xếp?

Đối với số hoặc ngày, bạn có thể giảm trường nhiều giá trị thành một giá trị duy nhất, điều này có thể được thực hiện bằng cách sử dụng chế độ sắp xếp `min`, `max`, `avg` hoặc `sum`. Ví dụ, bạn có thể sắp xếp theo ngày sớm nhất trong mỗi trường date, thông qua cách sau:

```json
"sort": {
  "dates": {
    "order": "asc",
    "mode":  "min"
  }
}
```

## Sắp xếp theo khoảng cách địa lý

Elasticsearch sử dụng `_geo_distance` để sắp xếp theo khoảng cách địa lý, như ví dụ sau:

```json
{
  "sort" : [
    {
      "_geo_distance" : {
        "es_location_field" : [116.407526, 39.904030],
        "order" : "asc",
        "unit" : "km",
        "mode" : "min",
        "distance_type" : "plane"
      }
    }
  ],
  "query" : {
    ......
  }
}
```

Các tùy chọn của `_geo_distance` cụ thể như sau:

- Trường `es_location_field` trong ví dụ trên là tên của trường lưu trữ dữ liệu kinh độ và vĩ độ trong Elasticsearch.
- `order`: chỉ định sắp xếp theo khoảng cách tăng dần hoặc giảm dần, tương ứng với `asc` và `desc`.
- `unit`: đơn vị tính khoảng cách, mặc định là `m`, biểu thị mét (meters), các tùy chọn khác bao gồm `mi`, `cm`, `mm`, `NM`, `km`, `ft`, `yd` và `in`.
- `mode`: khi xử lý dữ liệu mảng (nhiều giá trị), chỉ định chế độ lấy giá trị, các tùy chọn bao gồm `min`, `max`, `sum`, `avg` và `median`. Khi sắp xếp theo thứ tự tăng dần, mặc định là `min`; khi sắp xếp theo thứ tự giảm dần, mặc định là `max`.
- `distance_type`: đặt cách tính toán khoảng cách, các tùy chọn bao gồm `sloppy_arc`, `arc` và `plane`. Mặc định là `sloppy_arc`. `arc` có độ chính xác tương đối cao hơn nhưng tốc độ sẽ giảm đáng kể, `plane` thì tốc độ tính toán nhanh nhưng không chính xác với khoảng cách dài.
- `ignore_unmapped`: khi gặp trường chưa được ánh xạ, có nên bỏ qua không, các tùy chọn bao gồm `true` và `false`. Mặc định là `false`, tức là nếu gặp trường chưa được ánh xạ, truy vấn sẽ gây ra ngoại lệ; nếu đặt là `true`, nó sẽ bỏ qua các trường chưa được ánh xạ và không khớp với bất kỳ tài liệu nào trong truy vấn này.
- `validation_method`: chỉ định cách kiểm tra dữ liệu kinh độ và vĩ độ, các tùy chọn bao gồm `IGNORE_MALFORMED`, `COERCE` và `STRICT`. `IGNORE_MALFORMED` cho phép chấp nhận điểm địa lý có vĩ độ hoặc kinh độ không hợp lệ, tức là bỏ qua dữ liệu; `COERCE` cố gắng đoán và chuyển đổi thành tọa độ địa lý chính xác; `STRICT` là giá trị mặc định, tức là sẽ ném ra ngoại lệ khi gặp tọa độ địa lý không chính xác.

## Tài liệu tham khảo

- [Hướng dẫn Elasticsearch](https://www.knowledgedict.com/tutorial/elasticsearch-intro.html)
