---
title: Elasticsearch Index
tags:
  - elasticssearch
  - database
categories: 
date created: 2024-02-23
date modified: 2024-02-23
---

# Elasticsearch Index

## Thao tác quản lý chỉ mục

Quản lý chỉ mục Elasticsearch chủ yếu bao gồm cách tạo chỉ mục, xóa chỉ mục, cập nhật bản sao, quyền đọc ghi chỉ mục, cấu hình bí danh chỉ mục, và nhiều nội dung khác.

### Xóa chỉ mục

Để xóa chỉ mục ES, bạn chỉ cần gửi một yêu cầu http delete đến giao diện http của cụm ES với chỉ mục được chỉ định, bạn có thể thực hiện điều này bằng lệnh curl, cụ thể như sau:

```bash
curl -X DELETE http://{es_host}:{es_http_port}/{index}
```

Nếu xóa thành công, nó sẽ trả về thông tin như sau, ví dụ cụ thể như sau:

```bash
curl -X DELETE http://10.10.10.66:9200/my_index?pretty
```

Để làm cho thông tin trả về dễ đọc hơn, chúng tôi đã thêm tham số pretty:

```bash
{
  "acknowledged" : true
}
```

### Bí danh chỉ mục

Bí danh chỉ mục ES là tên khác mà bạn đặt cho một hoặc nhiều chỉ mục, một ứng dụng điển hình là để thực hiện chuyển đổi mượt mà cho việc sử dụng chỉ mục.

Đầu tiên, tạo chỉ mục my_index, sau đó đặt bí danh my_alias để chỉ đến nó, ví dụ như sau:

```bash
PUT /my_index
PUT /my_index/_alias/my_alias
```

Bạn cũng có thể thực hiện như sau:

```bash
POST /_aliases
{
  "actions": [
    { "add": { "index": "my_index", "alias": "my_alias" }}
  ]
}
```

Bạn cũng có thể thêm và xóa bí danh trong một yêu cầu:

```bash
POST /_aliases
{
  "actions": [
    { "remove": { "index": "my_index", "alias": "my_alias" }},
    { "add": { "index": "my_index_v2", "alias": "my_alias" }}
  ]
}
```

> Cần lưu ý rằng, nếu bí danh và chỉ mục là một-một, bạn có thể sử dụng bí danh để lập chỉ mục hoặc truy vấn tài liệu. Tuy nhiên, nếu bí danh và chỉ mục là một-nhiều, việc sử dụng bí danh sẽ gây ra lỗi, vì ES không biết phải ghi tài liệu vào chỉ mục nào hoặc đọc tài liệu từ chỉ mục nào.

Một ứng dụng điển hình của bí danh chỉ mục ES là chuyển đổi mượt mà, bạn có thể xem thêm chi tiết tại [Phương pháp chuyển đổi mượt mà chỉ mục Elasticsearch (ES) không cần tắt máy (không cần khởi động lại)](https://www.knowledgedict.com/tutorial/elasticsearch-index-smooth-shift.html).

## Giải thích Settings

Cấu hình chỉ mục Elasticsearch chủ yếu được chia thành **thuộc tính cấu hình tĩnh** và **thuộc tính cấu hình động**. Thuộc tính cấu hình tĩnh không thể thay đổi sau khi tạo chỉ mục, trong khi thuộc tính cấu hình động có thể thay đổi bất cứ lúc nào.

API để thiết lập chỉ mục ES là **_`_settings`_**, ví dụ đầy đủ như sau:

```bash
PUT /my_index
{
  "settings": {
    "index": {
      "number_of_shards": "1",
      "number_of_replicas": "1",
      "refresh_interval": "60s",
      "analysis": {
        "filter": {
          "tsconvert": {
            "type": "stconvert",
            "convert_type": "t2s",
            "delimiter": ","
          },
          "synonym": {
            "type": "synonym",
            "synonyms_path": "analysis/synonyms.txt"
          }
        },
        "analyzer": {
          "ik_max_word_synonym": {
            "filter": [
              "synonym",
              "tsconvert",
              "standard",
              "lowercase",
              "stop"
            ],
            "tokenizer": "ik_max_word"
          },
          "ik_smart_synonym": {
            "filter": [
              "synonym",
              "standard",
              "lowercase",
              "stop"
            ],
            "tokenizer": "ik_smart"
          }
        },
		"mapping": {
			"coerce": "false",
			"ignore_malformed": "false"
		},
		"indexing": {
			"slowlog": {
				"threshold": {
					"index": {
						"warn": "2s",
						"info": "1s"
					}
				}
			}
		},
		"provided_name": "hospital_202101070533",
		"query": {
			"default_field": "timestamp",
			"parse": {
				"allow_unmapped_fields": "false"
			}
		},
		"requests": {
			"cache": {
				"enable": "true"
			}
		},
		"search": {
			"slowlog": {
				"threshold": {
					"fetch": {
						"warn": "1s",
						"info": "200ms"
					},
					"query": {
						"warn": "1s",
						"info": "500ms"
					}
				}
			}
		}
	}
  }
}
```

### Thuộc tính cố định

- **_`index.creation_date`_**: Đúng như tên gọi, đây là dấu thời gian tạo chỉ mục.
- **_`index.uuid`_**: Thông tin uuid của chỉ mục.
- **_`index.version.created`_**: Phiên bản của chỉ mục.

### Cấu hình tĩnh chỉ mục

- **_`index.number_of_shards`_**: Số lượng mảnh chính của chỉ mục, giá trị mặc định là **_`5`_**. Cấu hình này không thể thay đổi sau khi tạo chỉ mục; ở cấp độ es, bạn có thể thiết lập số lượng mảnh tối đa cho chỉ mục thông qua thuộc tính **_`es.index.max_number_of_shards`_**, mặc định là **_`1024`_**.
- **_`index.codec`_**: Thuật toán nén để lưu trữ dữ liệu, giá trị mặc định là **_`LZ4`_**. Các giá trị tùy chọn khác bao gồm **_`best_compression`_**, nó có tỷ lệ nén tốt hơn so với LZ4 (tức là chiếm ít không gian đĩa hơn, nhưng hiệu suất lưu trữ thấp hơn LZ4).
- **_`index.routing_partition_size`_**: Số lượng phân vùng định tuyến, nếu thiết lập tham số này, thuật toán định tuyến sẽ là: `( hash(_routing) + hash(_id) % index.routing_parttion_size ) % number_of_shards`. Nếu giá trị này không được thiết lập, thuật toán định tuyến sẽ là `hash(_routing) % number_of_shardings`, `_routing` mặc định là `_id`.

Trong cấu hình tĩnh, một phần quan trọng là cấu hình phân tích (config analyzers).

- **`index.analysis`**

  : Cấu hình ngoài cùng của phân tích, bên trong chủ yếu được chia thành char_filter, tokenizer, filter và analyzer.

  - **_`char_filter`_**: Định nghĩa bộ lọc ký tự mới.
  - **_`tokenizer`_**: Định nghĩa tokenizer mới.
  - **_`filter`_**: Định nghĩa bộ lọc token mới, như bộ lọc đồng nghĩa.
  - **_`analyzer`_**: Cấu hình phân tích mới, thường là sự kết hợp của char_filter, tokenizer và một số bộ lọc token.

### Cấu hình động chỉ mục

- **_`index.number_of_replicas`_**: Số lượng bản sao của mảnh chính của chỉ mục, giá trị mặc định là **_`1`_**, giá trị này phải lớn hơn hoặc bằng 0, cấu hình này có thể thay đổi bất cứ lúc nào.
- **_`index.refresh_interval`_**: Tần suất thực hiện thao tác làm mới dữ liệu chỉ mục mới, thao tác này làm cho những thay đổi gần nhất đối với chỉ mục có thể nhìn thấy khi tìm kiếm, mặc định là **_`1s`_**. Bạn cũng có thể đặt là **_`-1`_** để vô hiệu hóa việc làm mới. Thông tin chi tiết hơn xem tại [Elasticsearch chỉnh sửa động refresh_interval cài đặt khoảng thời gian làm mới](https://www.knowledgedict.com/tutorial/elasticsearch-refresh_interval-settings.html).

## Giải thích Mapping

Trong Elasticsearch, **`Mapping`** (ánh xạ) được sử dụng để định rõ cách một tài liệu và các trường mà nó chứa được lưu trữ và lập chỉ mục. Bạn có thể định trước loại dữ liệu của các trường, trọng số của các trường, bộ phân tích, và các thuộc tính khác trong ánh xạ, giống như việc thiết lập loại dữ liệu cho các trường khi tạo bảng trong cơ sở dữ liệu quan hệ.

Mapping sẽ ánh xạ tài liệu json thành định dạng phẳng mà Lucene cần.

Một Mapping thuộc về một Type của chỉ mục

- Mỗi tài liệu đều thuộc về một Type
- Một Type có một định nghĩa Mapping
- Từ phiên bản 7.0 trở đi, không cần phải chỉ định thông tin type trong định nghĩa Mapping

### Phân loại ánh xạ

Trong Elasticsearch, ánh xạ có thể được chia thành ánh xạ tĩnh và ánh xạ động. Trong cơ sở dữ liệu quan hệ, trước khi ghi dữ liệu, bạn cần tạo bảng trước, trong câu lệnh tạo bảng, bạn sẽ khai báo thuộc tính của các trường. Tuy nhiên, trong Elasticsearch, bạn không cần phải làm như vậy. Một trong những tính năng quan trọng nhất của Elasticsearch là cho phép bạn khám phá dữ liệu càng nhanh càng tốt. Khi tài liệu được ghi vào Elasticsearch, nó sẽ tự động nhận biết loại của các trường. Cơ chế này được gọi là **ánh xạ động**, trong khi **ánh xạ tĩnh** là việc thiết lập thuộc tính của các trường trước khi ghi dữ liệu.

#### Ánh xạ tĩnh

**Ánh xạ tĩnh** là việc chỉ định ánh xạ chỉ mục theo cách thủ công khi tạo chỉ mục. Ánh xạ tĩnh tương tự như việc chỉ định thuộc tính trường trong câu lệnh tạo bảng trong SQL. So với ánh xạ động, thông qua ánh xạ tĩnh, bạn có thể thêm các thông tin cấu hình chi tiết và chính xác hơn.

Cách định nghĩa một Mapping

```bash
PUT /books
{
    "mappings": {
        "type_one": { ... any mappings ... },
        "type_two": { ... any mappings ... },
        ...
    }
}
```

#### Ánh xạ động

**Ánh xạ động** là một cách thoải mái, cho phép bạn tạo chỉ mục và ghi tài liệu mà không cần thiết lập loại trường khi tạo chỉ mục. Loại của các trường trong tài liệu sẽ được Elasticsearch **tự động nhận biết**. Trong dự án thực tế, nếu bạn không chắc chắn về các trường sẽ có trong dữ liệu trước khi nhập, hoặc bạn không rõ về loại dữ liệu của các trường, việc sử dụng ánh xạ động sẽ rất phù hợp. Khi Elasticsearch gặp một trường mà nó chưa từng thấy trước đó trong tài liệu, nó sẽ sử dụng ánh xạ động để xác định loại của trường đó và tự động thêm trường đó vào ánh xạ, dựa vào giá trị của trường để tự động dự đoán loại trường theo bảng sau:

| Dữ liệu định dạng JSON | Loại trường được dự đoán tự động                                                       |
| :--------------------- | :------------------------------------------------------------------------------------- |
| null                   | Không thêm trường nào                                                                  |
| true hoặc false        | Loại boolean                                                                           |
| Số dạng float          | Loại float                                                                             |
| Số                     | Loại long                                                                              |
| Đối tượng JSON         | Loại object                                                                            |
| Mảng                   | Được xác định bởi giá trị không rỗng đầu tiên trong mảng                               |
| string                 | Có thể là loại date (nếu bật kiểm tra ngày), double hoặc long, loại text, loại keyword |

Dưới đây là một ví dụ về ánh xạ động. Hãy tạo một chỉ mục mới trong Elasticsearch và xem ánh xạ của nó, sử dụng các lệnh sau:

```bash
PUT books
GET books/_mapping
```

Lúc này ánh xạ của chỉ mục books là trống, kết quả trả về như sau:

```json
{
  "books": {
    "mappings": {}
  }
}
```

Tiếp theo, hãy ghi một tài liệu vào chỉ mục books, sử dụng lệnh sau:

```bash
PUT books/it/1
{
	"id": 1,
	"publish_date": "2019-11-10",
	"name": "master Elasticsearch"
}
```

Sau khi ghi tài liệu, hãy xem lại ánh xạ, kết quả trả về như sau:

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

Khi sử dụng ánh xạ động, bạn cần xem xét yêu cầu kinh doanh thực tế. Nếu bạn sử dụng Elasticsearch như là một kho dữ liệu chính và muốn nhận được một ngoại lệ khi gặp một trường mới để cảnh báo vấn đề này, thì việc bật ánh xạ động không phù hợp. Trong ánh xạ, bạn có thể điều khiển việc tự động thêm trường mới thông qua cài đặt `dynamic`, nhận các tham số sau:

- **`true`**: Mặc định là true, tự động thêm trường.
- **`false`**: Bỏ qua các trường mới.
- **`strict`**: Chế độ nghiêm ngặt, nếu phát hiện trường mới thì ném ra ngoại lệ.

### Loại cơ bản

| Loại       | Từ khóa                                                              |
| :--------- | :------------------------------------------------------------------ |
| Loại chuỗi | string, text, keyword                                               |
| Loại số   | long, integer, short, byte, double, float, half_float, scaled_float |
| Loại ngày  | date                                                                |
| Loại boolean | boolean                                                             |
| Loại nhị phân | binary                                                              |
| Loại phạm vi | range                                                               |

### Loại phức tạp

| Loại     | Từ khóa |
| :------- | :----- |
| Loại mảng | array  |
| Loại đối tượng | object |
| Loại lồng | nested |

### Loại đặc biệt

| Loại         | Từ khóa      |
| :----------- | :---------- |
| Loại địa lý     | geo_point   |
| Loại hình địa lý | geo_shape   |
| Loại IP     | ip          |
| Loại phạm vi | completion  |
| Loại đếm token | token_count |
| Loại đính kèm | attachment  |
| Loại trích xuất | percolator  |

### Thuộc tính Mapping

Có rất nhiều thuộc tính trường trong mapping của Elasticsearch, cụ thể như bảng sau:

| Tên thuộc tính          | Mô tả                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |     |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| **_`type`_**            | Loại của trường, thông thường là text, integer, v.v.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |     |
| **_`index`_**           | Trường hiện tại có được sử dụng như một chỉ mục hay không. Giá trị có thể là **_`true`_**, mặc định là true.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |     |
| **_`store`_**           | Có lưu trữ trường được chỉ định hay không, giá trị có thể là **_`true`_** hoặc **_`false`_**. Đặt true có nghĩa là cần phải dành không gian lưu trữ riêng để lưu trữ trường này, và lưu trữ này là độc lập với lưu trữ **_`_source`_**.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |     |
| **_`norms`_**           | Có sử dụng yếu tố chuẩn hóa hay không, giá trị có thể là **_`true`_** hoặc **_`false`_**. Khi không cần sắp xếp trường theo điểm, bạn có thể vô hiệu hóa nó để tiết kiệm không gian; _type_ là _text_ thì mặc định là _true_, trong khi _type_ là _keyword_ thì mặc định là _false_.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |     |
| **_`index_options`_**   | Tùy chọn chỉ mục kiểm soát thông tin được thêm vào chỉ mục đảo ngược (Inverted Index), thông tin này được sử dụng cho việc tìm kiếm (Search) và làm nổi bật: **_`docs`_**: chỉ chỉ mục số tài liệu (Doc Number); **_`freqs`_**: chỉ mục số tài liệu và tần suất từ (term frequency); **_`positions`_**: chỉ mục số tài liệu, tần suất từ và vị trí từ (số thứ tự); **_`offsets`_**: chỉ mục số tài liệu, tần suất từ, vị trí từ (số thứ tự) và độ lệch từ (vị trí bắt đầu và kết thúc). Mặc định, các trường chuỗi được phân tích (analyzed string) sử dụng _positions_, các trường khác mặc định sử dụng _docs_. Ngoài ra, cần lưu ý rằng _index_option_ là thuộc tính cài đặt đặc biệt của elasticsearch; khi tìm kiếm gần và truy vấn cụm từ, _index_option_ phải được đặt thành _offsets_, đồng thời làm nổi bật cũng có thể sử dụng postings highlighter. |     |
| **_`term_vector`_**     | Tùy chọn chỉ mục kiểm soát thông tin liên quan đến vector từ: **_`no`_**: giá trị mặc định, không lưu trữ thông tin liên quan đến vector từ; **_`yes`_**: chỉ lưu trữ thông tin vector từ; **_`with_positions`_**: lưu trữ từ và vị trí từ; **_`with_offsets`_**: lưu trữ từ và vị trí độ lệch ký tự; **_`with_positions_offsets`_**: lưu trữ từ, vị trí từ, vị trí độ lệch ký tự. _term_vector_ là cài đặt chỉ mục ở cấp độ lucene.                                                                                                                                                                                                                                                                                                                                                                                                                           |     |
| **_`similarity`_**      | Chỉ định thuật toán độ tương tự của tài liệu (hoặc còn gọi là mô hình đánh giá): **_`BM25`_**: là cài đặt mặc định sau ES 5.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |     |
| **_`copy_to`_**         | Sao chép vào trường \_all tùy chỉnh, giá trị là dạng mảng, tức là có thể chỉ định nhiều trường tùy chỉnh.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |     |
| **_`analyzer`_**        | Chỉ định bộ phân tích khi lập chỉ mục và tìm kiếm, nếu _search_analyzer_ cũng được chỉ định thì bộ phân tích khi tìm kiếm sẽ được ưu tiên sử dụng.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |     |
| **_`search_analyzer`_** | Chỉ định bộ phân tích khi tìm kiếm, ưu tiên cao nhất khi tìm kiếm.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |     |
| **_`null_value`_**      | Dùng cho các tình huống cần tìm kiếm giá trị Null, chỉ có loại Keyword hỗ trợ cấu hình này.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |     |

## Truy vấn chỉ mục

### Truy vấn nhiều chỉ mục, nhiều loại

API tìm kiếm của Elasticsearch hỗ trợ **truy vấn nhiều loại (type) trong một chỉ mục (index)** cũng như **truy vấn nhiều chỉ mục (index)**.

Ví dụ, chúng ta có thể tìm kiếm tất cả các tài liệu phù hợp với điều kiện trong tất cả các loại của chỉ mục twitter, như sau:

```bash
GET /twitter/_search?q=user:shay
```

Chúng ta cũng có thể tìm kiếm các tài liệu phù hợp với điều kiện trong nhiều loại cụ thể của một chỉ mục, như sau:

```bash
GET /twitter/tweet,user/_search?q=user:banon
```

Chúng ta cũng có thể tìm kiếm các tài liệu phù hợp với điều kiện trong nhiều chỉ mục, như sau:

```bash
GET /twitter,elasticsearch/_search?q=tag:wow
```

Ngoài ra, chúng ta cũng có thể tìm kiếm các tài liệu phù hợp với điều kiện trong tất cả các chỉ mục, sử dụng `_all` để đại diện cho tất cả các chỉ mục, như sau:

```bash
GET /_all/_search?q=tag:wow
```

Thậm chí chúng ta cũng có thể tìm kiếm tất cả các tài liệu phù hợp với điều kiện trong tất cả các chỉ mục và tất cả các loại, như sau:

```bash
GET /_search?q=tag:wow
```

## Truy vấn URI

Elasticsearch hỗ trợ truy vấn thông qua URI, bạn có thể sử dụng các tham số liên quan trong yêu cầu GET và sử dụng các lệnh curl để thử nghiệm.

Dưới đây là một ví dụ:

```bash
GET twitter/_search?q=user:kimchy
```

Dưới đây là thực thể phản hồi của yêu cầu trước:

```json
{
  "timed_out": false,
  "took": 62,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": 1,
    "max_score": 1.3862944,
    "hits": [
      {
        "_index": "twitter",
        "_type": "_doc",
        "_id": "0",
        "_score": 1.3862944,
        "_source": {
          "user": "kimchy",
          "date": "2009-11-15T14:12:12",
          "message": "trying out Elasticsearch",
          "likes": 0
        }
      }
    ]
  }
}
```

Các tham số được cho phép trong URI:

| Tên                          | Mô tả                                                                                                                                                                                                                                                                                     |
| :--------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| q                            | Chuỗi truy vấn, ánh xạ đến truy vấn query_string                                                                                                                                                                                                                                          |
| df                           | Trường mặc định được sử dụng khi không có tiền tố trường được xác định trong truy vấn                                                                                                                                                                                                     |
| analyzer                     | Bộ phân tích được chỉ định khi truy vấn chuỗi                                                                                                                                                                                                                                             |
| analyze_wildcard             | Có cho phép truy vấn dùng ký tự đại diện và truy vấn tiền tố hay không, mặc định là false                                                                                                                                                                                                 |
| batched_reduce_size          | Số lượng kết quả từ các shard cần giảm trong một lần trên nút điều phối. Nếu số lượng shard tiềm năng trong yêu cầu lớn, thì giá trị này nên được sử dụng như một cơ chế bảo vệ, để giảm bớt bộ nhớ tiêu hao cho mỗi yêu cầu tìm kiếm                                                     |
| default_operator             | Toán tử khớp mặc định để sử dụng, có thể là _AND_ hoặc _OR_, mặc định là _OR_                                                                                                                                                                                                             |
| lenient                      | Nếu được đặt thành true, sẽ bỏ qua các vấn đề do định dạng gây ra (như cung cấp văn bản cho trường dữ liệu), mặc định là false                                                                                                                                                            |
| explain                      | Đối với mỗi hit, bao gồm giải thích về cách tính điểm                                                                                                                                                                                                                                     |
| \_source                     | Tham số yêu cầu nội dung tài liệu, mặc định là true; nếu đặt thành false, không trả về trường \_source, bạn có thể sử dụng tham số **\_source_include** và **\_source_exclude** để chỉ định trường trả về và không trả về                                                                 |
| stored_fields                | Chỉ định các trường được lưu trữ trong mỗi tài liệu khớp trả về, phân tách bằng dấu phẩy. Không chỉ định bất kỳ giá trị nào sẽ dẫn đến không có trường nào được trả về                                                                                                                    |
| sort                         | Cách sắp xếp, có thể là _fieldName_, _fieldName:asc_ hoặc _fieldName:desc_. fieldName có thể là trường thực trong tài liệu, hoặc có thể là trường như \_score, biểu thị sắp xếp dựa trên điểm số. Ngoài ra, bạn có thể chỉ định nhiều tham số sort (thứ tự rất quan trọng)                |
| track_scores                 | Khi sắp xếp, nếu đặt thành true, trả về điểm của mỗi tài liệu khớp                                                                                                                                                                                                                        |
| track_total_hits             | Có trả về tổng số tài liệu khớp với điều kiện hay không, mặc định là true                                                                                                                                                                                                                 |
| timeout                      | Đặt thời gian chờ tìm kiếm, mặc định không có thời gian chờ                                                                                                                                                                                                                               |
| terminate_after              | Chỉ định số lượng tài liệu tối đa mà mỗi shard thu thập trước khi đạt đến điều kiện dừng truy vấn. Nếu được đặt, thì có một trường boolean terminated_early trong phản hồi, để chỉ ra liệu việc thực hiện truy vấn có thực sự đã dừng lại hay không. Mặc định là không có terminate_after |
| from                         | Bắt đầu trả về kết quả từ tài liệu thứ mấy (chỉ số bắt đầu từ 0), mặc định là 0                                                                                                                                                                                                           |
| size                         | Trả về số lượng tài liệu khớp, mặc định là 10                                                                                                                                                                                                                                             |
| search_type                  | Cách tìm kiếm, có thể là _dfs_query_then_fetch_ hoặc _query_then_fetch_. Mặc định là _query_then_fetch_                                                                                                                                                                                   |
| allow_partial_search_results | Có thể trả về kết quả một phần hay không. Nếu được đặt thành false, nghĩa là nếu yêu cầu tạo ra kết quả một phần, thì đặt để trả về lỗi toàn bộ; mặc định là true, cho phép yêu cầu nhận kết quả một phần trong trường hợp quá thời gian hoặc thất bại một phần                           |

### Quy trình truy vấn

Trong Elasticsearch, việc truy vấn là một mô hình thực hiện khá phức tạp, vì chúng ta không biết document nào sẽ được khớp, và có thể có bất kỳ shard nào. Do đó, một yêu cầu tìm kiếm phải truy vấn tất cả các shard trong một hoặc nhiều chỉ mục để có thể hoàn toàn truy vấn được kết quả mong muốn của chúng ta.

Việc tìm thấy tất cả các kết quả khớp là bước đầu tiên của việc truy vấn, tập dữ liệu từ nhiều shard sẽ được hợp nhất vào một danh sách đã được sắp xếp trước khi được phân trang trả về cho client. Do cần thực hiện một bước lấy top N, nên việc tìm kiếm cần qua hai giai đoạn để hoàn thành, đó là query và fetch.

## Tài liệu tham khảo

- [Trang chủ Elasticsearch](https://www.elastic.co/)
- [Elasticsearch chỉ mục ánh xạ loại và chi tiết thuộc tính mapping](https://www.knowledgedict.com/tutorial/elasticsearch-index-mapping.html)
