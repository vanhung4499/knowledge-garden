---
title: Elasticsearch REST API
tags:
  - database
  - elasticssearch
categories: 
date created: 2024-02-24
date modified: 2024-02-24
---

# Elasticsearch Rest API

> **[Elasticsearch](https://github.com/elastic/elasticsearch) là một công cụ tìm kiếm và phân tích dữ liệu phân tán, theo phong cách RESTful**, có khả năng giải quyết nhiều tình huống sử dụng mới xuất hiện. Là trung tâm của Elastic Stack, nó lưu trữ dữ liệu tập trung của bạn, giúp bạn phát hiện những sự kiện dự kiến và không dự kiến.
>
> [Elasticsearch](https://github.com/elastic/elasticsearch) được phát triển dựa trên thư viện tìm kiếm [Lucene](https://github.com/apache/lucene-solr). Elasticsearch ẩn đi sự phức tạp của Lucene, cung cấp giao diện API REST / Java dễ sử dụng (ngoài ra còn có các giao diện API bằng ngôn ngữ khác).
>
> _Dưới đây gọi tắt là ES_.
>
> Tài liệu chi tiết nhất về REST API nên tham khảo: [ES Official REST API](https://www.elastic.co/guide/en/elasticsearch/reference/current/rest-apis.html)

## Cú pháp ElasticSearch Rest API

Các phần thành phần của yêu cầu gửi đến Elasticsearch giống như các yêu cầu HTTP thông thường khác:

```bash
curl -X<VERB> '<PROTOCOL>://<HOST>:<PORT>/<PATH>?<QUERY_STRING>' -d '<BODY>'
```

- `VERB`：Phương thức HTTP, hỗ trợ: `GET`, `POST`, `PUT`, `HEAD`, `DELETE`
- `PROTOCOL`：giao thức http hoặc https (chỉ có thể sử dụng khi có proxy https phía trước Elasticsearch)
- `HOST`：tên máy chủ của bất kỳ nút nào trong cụm Elasticsearch, nếu là nút trên máy cục bộ, thì gọi là localhost
- `PORT`：cổng dịch vụ HTTP của Elasticsearch, mặc định là 9200
- `PATH`：đường dẫn API (ví dụ: `_count` sẽ trả về số lượng tài liệu trong cụm),
- `PATH`：có thể chứa nhiều thành phần, ví dụ `_cluster/stats` hoặc `_nodes/stats/jvm`
- `QUERY_STRING`：một số tham số truy vấn tùy chọn, ví dụ tham số ?pretty sẽ làm cho yêu cầu trả về dữ liệu JSON dễ đọc hơn
- `BODY`：một cơ thể yêu cầu ở định dạng JSON (nếu yêu cầu cần)

ElasticSearch Rest API được chia thành hai loại:

- **URI Search**：sử dụng tham số truy vấn trong URL
- **Request Body Search**：dựa trên DSL định dạng JSON, hoàn chỉnh hơn

Ví dụ về URI Search:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20220530072511.png)

Ví dụ về Request Body Search:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20220530072654.png)

## Index API

> Tài liệu tham khảo: [Elasticsearch Official cat Index API](https://www.elastic.co/guide/en/elasticsearch/reference/current/cat-indices.html)

### Tạo chỉ mục

Để tạo mới Index, bạn có thể gửi trực tiếp yêu cầu `PUT` đến máy chủ ES.

Cú pháp:

```bash
PUT /my_index
{
    "settings": { ... any settings ... },
    "mappings": {
        "type_one": { ... any mappings ... },
        "type_two": { ... any mappings ... },
        ...
    }
}
```

Ví dụ:

```bash
PUT /user
{
  "settings": {
    "index": {
      "number_of_shards": 3,
      "number_of_replicas": 2
    }
  }
}
```

Máy chủ trả về một đối tượng JSON, trong đó trường `acknowledged` biểu thị hoạt động thành công.

```javascript
{"acknowledged":true,"shards_acknowledged":true,"index":"user"}
```

Nếu bạn muốn vô hiệu hóa việc tạo tự động chỉ mục, bạn có thể thêm cấu hình sau vào `config/elasticsearch.yml` trong mỗi nút:

```js
action.auto_create_index: false
```

### Xóa chỉ mục

Tiếp theo, chúng ta có thể gửi yêu cầu `DELETE` để xóa chỉ mục này.

```bash
DELETE /user
```

Xóa nhiều chỉ mục

```js
DELETE /index_one,index_two
DELETE /index_*
```

### Xem chỉ mục

Bạn có thể sử dụng yêu cầu GET để xem thông tin về chỉ mục

```bash
# Xem thông tin liên quan đến chỉ mục
GET kibana_sample_data_ecommerce

# Xem tổng số tài liệu trong chỉ mục
GET kibana_sample_data_ecommerce/_count

# Xem 10 tài liệu đầu tiên để hiểu định dạng tài liệu
GET kibana_sample_data_ecommerce/_search

# _cat indices API
# Xem các chỉ mục
GET /_cat/indices/kibana*?v&s=index

# Xem chỉ mục có trạng thái là xanh
GET /_cat/indices?v&health=green

# Sắp xếp theo số lượng tài liệu
GET /_cat/indices?v&s=docs.count:desc

# Xem các trường cụ thể
GET /_cat/indices/kibana*?pri&v&h=health,index,pri,rep,docs.count,mt

# Xem bộ nhớ mà chỉ mục sử dụng
GET /_cat/indices?v&h=i,tm&s=tm:desc
```

### Bí danh chỉ mục

Bí danh chỉ mục trong ES chính là tên khác mà bạn đặt cho một hoặc nhiều chỉ mục. Một ứng dụng điển hình là việc chuyển mượt mà giữa các chỉ mục.

Đầu tiên, tạo chỉ mục my_index, sau đó đặt bí danh my_alias cho nó, ví dụ như sau:

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

Bạn cũng có thể trong một yêu cầu thêm và xóa bí danh:

```bash
POST /_aliases
{
  "actions": [
    { "remove": { "index": "my_index", "alias": "my_alias" }}
    { "add": { "index": "my_index_v2", "alias": "my_alias" }}
  ]
}
```

> Điều cần lưu ý là nếu bí danh và chỉ mục là một-đối-một, bạn có thể sử dụng bí danh để lập chỉ mục hoặc truy vấn tài liệu. Tuy nhiên, nếu bí danh và chỉ mục là một-đối-nhiều, việc sử dụng bí danh sẽ gây ra lỗi, vì ES không biết nên viết tài liệu vào chỉ mục nào hoặc đọc tài liệu từ chỉ mục nào.

Một ứng dụng điển hình của bí danh chỉ mục ES là việc chuyển mượt mà giữa các chỉ mục. Để biết thêm chi tiết, bạn có thể xem [Phương pháp chuyển mượt mà giữa các chỉ mục Elasticsearch (ES) mà không cần tắt máy (không cần khởi động lại)](https://www.knowledgedict.com/tutorial/elasticsearch-index-smooth-shift.html).

### Mở/Đóng chỉ mục

Bằng cách thêm `_close` hoặc `_open` vào `POST`, bạn có thể mở hoặc đóng chỉ mục.

Mở chỉ mục

```bash
# Mở chỉ mục
POST kibana_sample_data_ecommerce/_open
# Đóng chỉ mục
POST kibana_sample_data_ecommerce/_close
```

## Tài liệu

```bash
############Create Document############
#create document. _id is automatically generated
POST users/_doc
{
	"user" : "Mike",
    "post_date" : "2019-04-15T14:12:12",
    "message" : "trying out Kibana"
}

#create document. Specify Id. If id already exists, an error is returned
PUT users/_doc/1?op_type=create
{
    "user" : "Jack",
    "post_date" : "2019-05-15T14:12:12",
    "message" : "trying out Elasticsearch"
}

#create document. Specify ID. If it already exists, an error is returned
PUT users/_create/1
{
     "user" : "Jack",
    "post_date" : "2019-05-15T14:12:12",
    "message" : "trying out Elasticsearch"
}

### Get Document by ID
#Get the document by ID
GET users/_doc/1


###  Index & Update
#Update specified ID  (delete first, then write)
GET users/_doc/1

PUT users/_doc/1
{
	"user" : "Mike"

}


#GET users/_doc/1
#Add fields to the original document
POST users/_update/1/
{
    "doc":{
        "post_date" : "2019-05-15T14:12:12",
        "message" : "trying out Elasticsearch"
    }
}



### Delete by Id
# Delete document
DELETE users/_doc/1


### Bulk Operations
#Execute twice, check the result each time

#Execute the first time
POST _bulk
{ "index" : { "_index" : "test", "_id" : "1" } }
{ "field1" : "value1" }
{ "delete" : { "_index" : "test", "_id" : "2" } }
{ "create" : { "_index" : "test2", "_id" : "3" } }
{ "field1" : "value3" }
{ "update" : {"_id" : "1", "_index" : "test"} }
{ "doc" : {"field2" : "value2"} }


#Execute the second time
POST _bulk
{ "index" : { "_index" : "test", "_id" : "1" } }
{ "field1" : "value1" }
{ "delete" : { "_index" : "test", "_id" : "2" } }
{ "create" : { "_index" : "test2", "_id" : "3" } }
{ "field1" : "value3" }
{ "update" : {"_id" : "1", "_index" : "test"} }
{ "doc" : {"field2" : "value2"} }

### mget Operations
GET /_mget
{
    "docs" : [
        {
            "_index" : "test",
            "_id" : "1"
        },
        {
            "_index" : "test",
            "_id" : "2"
        }
    ]
}


#Specify index in URI
GET /test/_mget
{
    "docs" : [
        {

            "_id" : "1"
        },
        {

            "_id" : "2"
        }
    ]
}


GET /_mget
{
    "docs" : [
        {
            "_index" : "test",
            "_id" : "1",
            "_source" : false
        },
        {
            "_index" : "test",
            "_id" : "2",
            "_source" : ["field3", "field4"]
        },
        {
            "_index" : "test",
            "_id" : "3",
            "_source" : {
                "include": ["user"],
                "exclude": ["user.location"]
            }
        }
    ]
}

### msearch Operations
POST kibana_sample_data_ecommerce/_msearch
{}
{"query" : {"match_all" : {}},"size":1}
{"index" : "kibana_sample_data_flights"}
{"query" : {"match_all" : {}},"size":2}


### Clear Test Data
#Clear data
DELETE users
DELETE test
DELETE test2
```

### Tạo tài liệu

#### Xác định ID

Định dạng cú pháp:

```bash
PUT /_index/_type/_create/_id
```

Ví dụ:

```bash
PUT /user/_doc/_create/1
{
  "user": "Trương Tam",
  "title": "Kỹ sư",
  "desc": "Quản lý cơ sở dữ liệu"
}
```

> Lưu ý: Xác định Id, nếu id đã tồn tại, sẽ báo lỗi

#### Tự động tạo ID

Khi thêm bản ghi mới, bạn cũng có thể không xác định Id, lúc này bạn cần thay đổi yêu cầu thành POST.

Định dạng cú pháp:

```bash
POST /_index/_type
```

Ví dụ:

```bash
POST /user/_doc
{
  "user": "Trương Tam",
  "title": "Kỹ sư",
  "desc": "Quản trị viên siêu cấp"
}
```

### Xóa tài liệu

Định dạng cú pháp:

```bash
DELETE /_index/_doc/_id
```

Ví dụ:

```bash
DELETE /user/_doc/1
```

### Cập nhật tài liệu

#### Xóa trước, sau đó viết vào

Định dạng cú pháp:

```bash
PUT /_index/_type/_id
```

Ví dụ:

```bash
PUT /user/_doc/1
{
  "user": "Lý Tứ",
  "title": "Kỹ sư",
  "desc": "Quản trị viên siêu cấp"
}
```

#### Thêm trường vào tài liệu gốc

Định dạng cú pháp:

```bash
POST /_index/_update/_id
```

Ví dụ:

```bash
POST /user/_update/1
{
    "doc":{
        "age" : "30"
    }
}
```

### Truy vấn tài liệu

#### Truy vấn theo ID cụ thể

Định dạng cú pháp:

```
GET /_index/_type/_id
```

Ví dụ:

```bash
GET /user/_doc/1
```

Kết quả:

```json
{
  "_index": "user",
  "_type": "_doc",
  "_id": "1",
  "_version": 1,
  "_seq_no": 536248,
  "_primary_term": 2,
  "found": true,
  "_source": {
    "user": "Trương Tam",
    "title": "Kỹ sư",
    "desc": "Quản lý cơ sở dữ liệu"
  }
}
```

Trong dữ liệu trả về, trường `found` biểu thị truy vấn thành công, trường `_source` trả về bản gốc của bản ghi.

Nếu id không chính xác, dữ liệu sẽ không được tìm thấy, và trường `found` sẽ là `false`

#### Truy vấn tất cả các bản ghi

Sử dụng phương thức `GET`, yêu cầu trực tiếp đến `/index/type/_search`, tất cả các bản ghi sẽ được trả về.

```bash
$ curl 'localhost:9200/user/admin/_search?pretty'
{
  "took" : 1,
  "timed_out" : false,
  "_shards" : {
    "total" : 3,
    "successful" : 3,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : 2,
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "user",
        "_type" : "admin",
        "_id" : "WWuoDG8BHwECs7SiYn93",
        "_score" : 1.0,
        "_source" : {
          "user" : "Lý Tứ",
          "title" : "Kỹ sư",
          "desc" : "Quản lý hệ thống"
        }
      },
      {
        "_index" : "user",
        "_type" : "admin",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "user" : "Trương Tam",
          "title" : "Kỹ sư",
          "desc" : "Quản trị viên siêu cấp"
        }
      }
    ]
  }
}
```

Trong kết quả trả về ở trên, trường `took` biểu thị thời gian tiêu tốn cho thao tác này (đơn vị là mili giây), trường `timed_out` biểu thị liệu có quá thời gian hay không, trường `hits` biểu thị các bản ghi đã truy vấn được, trong đó các trường con có ý nghĩa như sau.

- `total`: số lượng bản ghi trả về, trong trường hợp này là 2.
- `max_score`: mức độ khớp cao nhất, trong trường hợp này là `1.0`.
- `hits`: mảng các bản ghi trả về.

Trong các bản ghi trả về, mỗi bản ghi đều có một trường `_score`, biểu thị mức độ khớp, mặc định là được sắp xếp theo trường này theo thứ tự giảm dần.

### Tìm kiếm toàn văn

ES sử dụng [cú pháp truy vấn](https://www.elastic.co/guide/en/elasticsearch/reference/5.5/query-dsl.html) độc đáo của chính nó, yêu cầu các yêu cầu GET đi kèm với dữ liệu.

```bash
$ curl -H 'Content-Type: application/json' 'localhost:9200/user/admin/_search?pretty'  -d '
{
"query" : { "match" : { "desc" : "quản lý" }}
}'
```

Đoạn mã trên sử dụng [Match Query](https://www.elastic.co/guide/en/elasticsearch/reference/5.5/query-dsl-match-query.html), với điều kiện khớp được chỉ định là trường `desc` chứa từ "quản lý". Kết quả trả về như sau.

```javascript
{
  "took" : 2,
  "timed_out" : false,
  "_shards" : {
    "total" : 3,
    "successful" : 3,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : 2,
    "max_score" : 0.38200712,
    "hits" : [
      {
        "_index" : "user",
        "_type" : "admin",
        "_id" : "WWuoDG8BHwECs7SiYn93",
        "_score" : 0.38200712,
        "_source" : {
          "user" : "Lý Tứ",
          "title" : "Kỹ sư",
          "desc" : "Quản lý hệ thống"
        }
      },
      {
        "_index" : "user",
        "_type" : "admin",
        "_id" : "1",
        "_score" : 0.3487891,
        "_source" : {
          "user" : "Trương Tam",
          "title" : "Kỹ sư",
          "desc" : "Quản trị viên siêu cấp"
        }
      }
    ]
  }
}
```

Elastic mặc định trả về 10 kết quả mỗi lần, bạn có thể thay đổi cài đặt này thông qua trường `size`, và cũng có thể chỉ định vị trí thông qua trường `from`.

```bash
$ curl 'localhost:9200/user/admin/_search'  -d '
{
  "query" : { "match" : { "desc" : "quản lý" }},
  "from": 1,
  "size": 1
}'
```

Đoạn mã trên chỉ định, bắt đầu từ vị trí 1 (mặc định là bắt đầu từ vị trí 0), chỉ trả về một kết quả.

### Phép toán logic

Nếu có nhiều từ khóa tìm kiếm, Elastic coi chúng là mối quan hệ `or`.

```bash
$ curl 'localhost:9200/user/admin/_search'  -d '
{
"query" : { "match" : { "desc" : "phần mềm hệ thống" }}
}'
```

Đoạn mã trên tìm kiếm `phần mềm or hệ thống`.

Nếu bạn muốn thực hiện tìm kiếm `and` với nhiều từ khóa, bạn phải sử dụng [Bool Query](https://www.elastic.co/guide/en/elasticsearch/reference/5.5/query-dsl-bool-query.html).

```bash
$ curl -H 'Content-Type: application/json' 'localhost:9200/user/admin/_search?pretty'  -d '
{
 "query": {
  "bool": {
   "must": [
    { "match": { "desc": "quản lý" } },
    { "match": { "desc": "siêu cấp" } }
   ]
  }
 }
}'
```

### Thực hiện hàng loạt

Hỗ trợ thực hiện các hoạt động trên các chỉ mục khác nhau trong một lần gọi API

Hỗ trợ bốn loại hoạt động

- index
- create
- update
- delete

Nếu một hoạt động đơn lẻ thất bại, điều này sẽ không ảnh hưởng đến các hoạt động khác.

Kết quả trả về bao gồm kết quả của từng hoạt động được thực hiện.

```bash
POST _bulk
{ "index" : { "_index" : "test", "_id" : "1" } }
{ "field1" : "value1" }
{ "delete" : { "_index" : "test", "_id" : "2" } }
{ "create" : { "_index" : "test2", "_id" : "3" } }
{ "field1" : "value3" }
{ "update" : {"_id" : "1", "_index" : "test"} }
{ "doc" : {"field2" : "value2"} }
```

> Lưu ý: Nếu ví dụ trên được thực hiện nhiều lần, kết quả sẽ không giống nhau.

### Đọc hàng loạt

Đọc nhiều chỉ mục

```bash
GET /_mget
{
    "docs" : [
        {
            "_index" : "test",
            "_id" : "1"
        },
        {
            "_index" : "test",
            "_id" : "2"
        }
    ]
}
```

Đọc một chỉ mục

```bash
GET /test/_mget
{
    "docs" : [
        {

            "_id" : "1"
        },
        {

            "_id" : "2"
        }
    ]
}

GET /_mget
{
    "docs" : [
        {
            "_index" : "test",
            "_id" : "1",
            "_source" : false
        },
        {
            "_index" : "test",
            "_id" : "2",
            "_source" : ["field3", "field4"]
        },
        {
            "_index" : "test",
            "_id" : "3",
            "_source" : {
                "include": ["user"],
                "exclude": ["user.location"]
            }
        }
    ]
}
```

### Truy vấn hàng loạt

```bash
POST kibana_sample_data_ecommerce/_msearch
{}
{"query" : {"match_all" : {}},"size":1}
{"index" : "kibana_sample_data_flights"}
{"query" : {"match_all" : {}},"size":2}
```

### Tìm kiếm URI

Tìm kiếm URI Elasticsearch tuân theo ngữ cảnh QueryString, dạng như sau:

```bash
GET /movies/_search?q=2012&df=title&sort=year:desc&from=0&size=10&timeout=1s
{
	"profile": true
}
```

- **`q`** chỉ định câu truy vấn, sử dụng ngữ cảnh QueryString
- **`df`** là trường mặc định, nếu không chỉ định
- **`sort`** sắp xếp: `from` và `size` được sử dụng cho phân trang
- **`profile`** có thể xem cách thực hiện truy vấn

```bash
GET /movies/_search?q=title:2012&sort=year:desc&from=0&size=10&timeout=1s
{
	"profile":"true"
}
```

#### Term và Phrase

Beautiful Mind tương đương với Beautiful OR Mind

"Beautiful Mind" tương đương với Beautiful AND Mind

```bash
# Truy vấn Term
GET /movies/_search?q=title:Beautiful Mind
{
	"profile":"true"
}

# Sử dụng dấu ngoặc kép, Truy vấn Phrase
GET /movies/_search?q=title:"Beautiful Mind"
{
	"profile":"true"
}
```

#### Nhóm và dấu ngoặc kép

title:(Beautiful AND Mind)

title="Beautiful Mind"

#### AND, OR, NOT hoặc &&, ||, !

> Chú ý: AND, OR, NOT phải viết HOA

```bash
# Toán tử boolean
GET /movies/_search?q=title:(Beautiful AND Mind)
{
	"profile":"true"
}

GET /movies/_search?q=title:(Beautiful NOT Mind)
{
	"profile":"true"
}
```

#### Truy vấn phạm vi

- `[]` biểu thị khoảng đóng
- `{}` biểu thị khoảng mở

Ví dụ:

```bash
# Truy vấn phạm vi, cú pháp khoảng
GET /movies/_search?q=title:beautiful AND year:{2010 TO 2018%7D
{
	"profile":"true"
}

GET /movies/_search?q=title:beautiful AND year:[* TO 2018]
{
	"profile":"true"
}
```

#### Ký hiệu toán học

```bash
# Hồ sơ sau năm 2010
GET /movies/_search?q=year:>2010
{
	"profile":"true"
}

# Hồ sơ từ năm 2010 đến năm 2018
GET /movies/_search?q=year:(>2010 && <=2018)
{
	"profile":"true"
}

# Hồ sơ từ năm 2010 đến năm 2018
GET /movies/_search?q=year:(+>2010 +<=2018)
{
	"profile":"true"
}
```

#### Truy vấn dùng ký tự đại diện

- `?` đại diện cho 1 ký tự
- `*` đại diện cho 0 hoặc nhiều ký tự

Ví dụ:

```bash
GET /movies/_search?q=title:mi?d
{
	"profile":"true"
}

GET /movies/_search?q=title:b*
{
	"profile":"true"
}
```

#### Biểu thức chính quy

title:[bt]oy

#### Kết hợp mờ và truy vấn gần đúng

Ví dụ:

```bash
# Độ tương tự trong khoảng 1 ký tự
GET /movies/_search?q=title:beautifl~1
{
	"profile":"true"
}

# Độ tương tự trong khoảng 2 ký tự
GET /movies/_search?q=title:"Lord Rings"~2
{
	"profile":"true"
}
```

### Request Body & DSL

Ngoài phương pháp tìm kiếm URI, Elasticsearch còn hỗ trợ việc gửi câu truy vấn thông qua Http Request Body.

```bash
GET /kibana_sample_data_ecommerce/_search?ignore_unavailable=true
{
	"profile":"true",
	"query": {
	  "match_all": {}
	}
}
```

#### Phân trang

```bash
GET /kibana_sample_data_ecommerce/_search?ignore_unavailable=true
{
  "profile": "true",
  "from": 0,
  "size": 10,
  "query": {
    "match_all": {}
  }
}
```

#### Sắp xếp

Tốt nhất là sắp xếp trên trường dạng số hoặc ngày

Bởi vì khi sắp xếp trên trường có nhiều giá trị hoặc đã được phân tích, hệ thống sẽ chọn một giá trị, không thể biết giá trị đó là gì

```bash
GET /kibana_sample_data_ecommerce/_search?ignore_unavailable=true
{
  "profile": "true",
  "sort": [
    {
      "order_date": "desc"
    }
  ],
  "from": 1,
  "size": 10,
  "query": {
    "match_all": {}
  }
}
```

#### Lọc \_source

Nếu `_source` không được lưu trữ, thì chỉ trả về metadata của các tài liệu khớp

`_source` hỗ trợ sử dụng ký tự đại diện, ví dụ: `_source["name*", "desc*"]`

Ví dụ:

```bash
GET /kibana_sample_data_ecommerce/_search?ignore_unavailable=true
{
  "profile": "true",
  "_source": [
    "order_date",
    "category.keyword"
  ],
  "from": 1,
  "size": 10,
  "query": {
    "match_all": {}
  }
}
```

#### Trường script

```bash
GET /kibana_sample_data_ecommerce/_search?ignore_unavailable=true
{
  "profile": "true",
  "script_fields": {
    "new_field": {
      "script": {
        "lang": "painless",
        "source":"doc['order_date'].value+' hello'"
      }
    }
  },
  "from": 1,
  "size": 10,
  "query": {
    "match_all": {}
  }
}

```

#### Sử dụng biểu thức truy vấn - Match

```bash
POST movies/_search
{
  "query": {
    "match": {
      "title": "last christmas"
    }
  }
}

POST movies/_search
{
  "query": {
    "match": {
      "title": {
        "query": "last christmas",
        "operator": "and"
      }
    }
  }
}

```

#### Tìm kiếm cụm từ - Match Phrase

```bash
POST movies/_search
{
  "query": {
    "match_phrase": {
      "title":{
        "query": "last christmas"

      }
    }
  }
}
```

## Cluster API

> [Elasticsearch Official Cluster API](https://www.elastic.co/guide/en/elasticsearch/reference/current/cluster.html)

Một số API cấp cluster có thể được thực thi trên một tập con của các node, những node này có thể được chỉ định bằng bộ lọc node. Ví dụ, các API quản lý task, thống kê node và thông tin node đều có thể báo cáo kết quả từ một nhóm các node đã lọc thay vì tất cả các node.

Bộ lọc node được viết dưới dạng danh sách bộ lọc đơn lẻ được phân tách bằng dấu phẩy, mỗi bộ lọc thêm hoặc loại bỏ các node từ tập con đã chọn. Mỗi bộ lọc có thể là một trong những điều sau:

- `_all`: thêm tất cả các node vào tập con
- `_local`: thêm node cục bộ vào tập con
- `_master`: thêm node master hiện tại vào tập con
- Thêm các node khớp theo ID node hoặc tên node vào tập con
- Thêm các node khớp theo địa chỉ IP hoặc tên máy chủ vào tập con
- Sử dụng ký tự đại diện, thêm các node có tên, tên địa chỉ hoặc tên máy chủ khớp vào tập con
- `master:true`, `data:true`, `ingest:true`, `voting_only:true`, `ml:true` hoặc `coordinating_only:true`, tương ứng có nghĩa là thêm tất cả các node master, tất cả các node dữ liệu, tất cả các node ingest, tất cả các node chỉ bỏ phiếu, tất cả các node machine learning và tất cả các node điều phối vào tập con.
- `master:false`, `data:false`, `ingest:false`, `voting_only:true`, `ml:false` hoặc `coordinating_only:false`, tương ứng có nghĩa là loại trừ tất cả các node master, tất cả các node dữ liệu, tất cả các node ingest, tất cả các node chỉ bỏ phiếu, tất cả các node machine learning và tất cả các node điều phối ra khỏi tập con.
- Mô hình ghép cặp, sử dụng ký tự đại diện `*`, theo dạng `attrname:attrvalue`, thêm tất cả các node có thuộc tính node tùy chỉnh vào tập con, tên và giá trị của nó khớp với mô hình tương ứng. Thuộc tính node tùy chỉnh được thiết lập trong tệp cấu hình theo dạng `node.attr.attrname: attrvalue`.

```bash
# Nếu không có bộ lọc, mặc định là truy vấn tất cả các node
GET /_nodes
# Truy vấn tất cả các node
GET /_nodes/_all
# Truy vấn node cục bộ
GET /_nodes/_local
# Truy vấn node master
GET /_nodes/_master
# Truy vấn node theo tên (hỗ trợ ký tự đại diện)
GET /_nodes/node_name_goes_here
GET /_nodes/node_name_goes_*
# Truy vấn node theo địa chỉ (hỗ trợ ký tự đại diện)
GET /_nodes/10.0.0.3,10.0.0.4
GET /_nodes/10.0.0.*
# Truy vấn node theo quy tắc
GET /_nodes/_all,master:false
GET /_nodes/data:true,ingest:true
GET /_nodes/coordinating_only:true
GET /_nodes/master:true,voting_only:false
# Truy vấn node theo thuộc tính tùy chỉnh (ví dụ: truy vấn các node có thuộc tính node.attr.rack:2 trong tệp cấu hình)
GET /_nodes/rack:2
GET /_nodes/ra*:2
GET /_nodes/ra*:2*
```

### Cluster Health API

```bash
GET /_cluster/health
GET /_cluster/health?level=shards
GET /_cluster/health/kibana_sample_data_ecommerce,kibana_sample_data_flights
GET /_cluster/health/kibana_sample_data_flights?level=shards
```

### Cluster State API

Cluster State API trả về metadata biểu thị trạng thái toàn bộ cluster.

```bash
GET /_cluster/state
```

## Nodes API

> [Elasticsearch Official cat Nodes API](https://www.elastic.co/guide/en/elasticsearch/reference/current/cat-nodes.html) - Trả về thông tin về các node trong cluster.

```bash
# Xem các trường mặc định
GET /_cat/nodes?v=true
# Xem các trường chỉ định
GET /_cat/nodes?v=true&h=id,ip,port,v,m
```

## Shards API

> [Elasticsearch Official cat Shards API](https://www.elastic.co/guide/en/elasticsearch/reference/current/cat-shards.html) - Lệnh shards cung cấp một cái nhìn chi tiết về shard nào thuộc về node nào. Nó sẽ cho bạn biết nó là primary hay replica, số lượng tài liệu, số byte mà nó chiếm trên đĩa và node mà nó đang nằm trên.

```bash
# Xem các trường mặc định
GET /_cat/shards
# Truy vấn shard theo tên (hỗ trợ ký tự đại diện)
GET /_cat/shards/my-index-*
# Xem các trường chỉ định
GET /_cat/shards?h=index,shard,prirep,state,unassigned.reason
```

## Monitoring API

Trong Elasticsearch, các thông tin liên quan đến sức khỏe, thống kê, v.v. của cluster đều xoay quanh `cat` API.

Bằng cách gửi yêu cầu GET đến cat, dưới đây là tất cả các API có sẵn:

```bash
GET /_cat

=^.^=
/_cat/allocation
/_cat/shards
/_cat/shards/{index}
/_cat/master
/_cat/nodes
/_cat/tasks
/_cat/indices
/_cat/indices/{index}
/_cat/segments
/_cat/segments/{index}
/_cat/count
/_cat/count/{index}
/_cat/recovery
/_cat/recovery/{index}
/_cat/health
/_cat/pending_tasks
/_cat/aliases
/_cat/aliases/{alias}
/_cat/thread_pool
/_cat/thread_pool/{thread_pools}
/_cat/plugins
/_cat/fielddata
/_cat/fielddata/{fields}
/_cat/nodeattrs
/_cat/repositories
/_cat/snapshots/{repository}
/_cat/templates
```

## Tài liệu tham khảo

- **Chính thức**
  - [Trang chủ Elasticsearch](https://www.elastic.co/products/elasticsearch)
  - [Elasticsearch Github](https://github.com/elastic/elasticsearch)
  - [Tài liệu chính thức Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
