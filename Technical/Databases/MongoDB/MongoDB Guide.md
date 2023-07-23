---
title: MongoDB Guide
tags: [db, mongodb, nosql]
categories: [db, mongodb, nosql]
date created: 2023-07-24
date modified: 2023-07-24
---

# Hướng dẫn MongoDB

## Giới thiệu

MongoDB là một cơ sở dữ liệu dựa trên hệ thống lưu trữ tệp phân tán. Được viết bằng ngôn ngữ C++. Mục tiêu là cung cấp một giải pháp lưu trữ dữ liệu có khả năng mở rộng và hiệu suất cao cho các ứng dụng web.

MongoDB lưu trữ dữ liệu dưới dạng tài liệu, cấu trúc dữ liệu bao gồm các cặp khóa-giá trị (key-value). Tài liệu trong MongoDB tương tự như đối tượng JSON. Giá trị của trường có thể chứa các tài liệu khác, mảng và mảng tài liệu.

### Phát triển của MongoDB

- Phiên bản 1.x - Hỗ trợ sao chép và phân đoạn
- Phiên bản 2.x - Các tính năng cơ sở dữ liệu phong phú hơn
- Phiên bản 3.x - WiredTiger và hệ sinh thái xung quanh
- Phiên bản 4.x - Hỗ trợ giao dịch phân tán

### MongoDB và RDBMS

| Tính năng   | MongoDB                                          | RDBMS    |
| -----------| ------------------------------------------------ | -------- |
| Mô hình dữ liệu | Mô hình tài liệu                                 | Quan hệ  |
| CRUD       | MQL/SQL                                          | SQL      |
| Khả năng cao  | Tập sao chép                                     | Chế độ cụm |
| Khả năng mở rộng | Hỗ trợ phân đoạn                                | Phân vùng dữ liệu |
| Cách mở rộng | Mở rộng theo chiều dọc + mở rộng theo chiều ngang | Mở rộng theo chiều dọc |
| Loại chỉ mục | B-Tree, chỉ mục toàn văn, chỉ mục địa lý, chỉ mục đa khóa, chỉ mục TTL | B-Tree |
| Dung lượng dữ liệu | Không giới hạn lý thuyết                          | Triệu, tỷ |

### Tính năng của MongoDB

- Dữ liệu là cấu trúc JSON
	- Hỗ trợ mô hình dữ liệu có cấu trúc và bán cấu trúc
	- Có thể phản ứng động với thay đổi cấu trúc
- Cung cấp tính sẵn có cao thông qua cơ chế sao chép
- Cung cấp khả năng mở rộng thông qua phân đoạn (sharding)

## Khái niệm trong MongoDB

| Thuật ngữ SQL | Thuật ngữ MongoDB | Giải thích / Giới thiệu                           |
| :----------- | :--------------- | :---------------------------------------------- |
| database     | database         | Cơ sở dữ liệu                                   |
| table        | collection       | Bảng / Bộ sưu tập trong cơ sở dữ liệu             |
| row          | document         | Hàng dữ liệu / Bản ghi trong cơ sở dữ liệu         |
| column       | field            | Cột dữ liệu / Thuộc tính                        |
| index        | index            | Chỉ mục                                         |
| table joins  |                  | Liên kết bảng, MongoDB không hỗ trợ              |
| primary key  | primary key      | Khóa chính, MongoDB tự động đặt trường \_id làm khóa chính |

### Cơ sở dữ liệu

Trong MongoDB, bạn có thể tạo nhiều cơ sở dữ liệu.

Cơ sở dữ liệu mặc định của MongoDB là "db", cơ sở dữ liệu này được lưu trữ trong thư mục data.

Một phiên bản MongoDB có thể chứa nhiều cơ sở dữ liệu độc lập, mỗi cơ sở dữ liệu có bộ sưu tập và quyền riêng của nó, và các cơ sở dữ liệu khác nhau cũng được lưu trữ trong các tệp khác nhau.

Lệnh `show dbs` có thể hiển thị danh sách tất cả cơ sở dữ liệu.

```shell
$ ./mongo
MongoDB shell version: 3.0.6
connecting to: test
> show dbs
local  0.078GB
test   0.078GB
>
```

Chạy lệnh `db` có thể hiển thị đối tượng cơ sở dữ liệu hoặc bộ sưu tập hiện tại.

```shell
$ ./mongo
MongoDB shell version: 3.0.6
connecting to: test
> db
test
>
```

Sử dụng lệnh `use` để kết nối đến một cơ sở dữ liệu cụ thể.

```shell
> use local
switched to db local
> db
local
>
```

Cơ sở dữ liệu cũng được định danh bằng tên. Tên cơ sở dữ liệu có thể là bất kỳ chuỗi UTF-8 nào thoả mãn các điều kiện sau:

- Không thể là chuỗi rỗng ("").
- Không được chứa ký tự ` ` (khoảng trắng), `.`, `$`, `/`, `\` và `\0` (ký tự rỗng).
- Nên viết thường toàn bộ.
- Tối đa 64 byte.

Một số tên cơ sở dữ liệu được bảo lưu và có thể truy cập trực tiếp vào các cơ sở dữ liệu đặc biệt này.

- **admin**: Từ quan điểm về quyền, đây là cơ sở dữ liệu `root`. Nếu bạn thêm một người dùng vào cơ sở dữ liệu này, người dùng đó sẽ tự động kế thừa quyền hạn của tất cả các cơ sở dữ liệu. Một số lệnh đặc biệt chỉ có thể chạy từ cơ sở dữ liệu này, chẳng hạn như liệt kê tất cả các cơ sở dữ liệu hoặc tắt máy chủ.
- **local**: Cơ sở dữ liệu này không bao giờ được sao chép và có thể được sử dụng để lưu trữ các bộ sưu tập hạn chế cho một máy chủ duy nhất.
- **config**: Khi sử dụng MongoDB cho cài đặt phân đoạn (sharding), cơ sở dữ liệu config được sử dụng nội bộ để lưu trữ thông tin liên quan đến phân đoạn.

### Tài liệu (Document)

Tài liệu là một tập hợp các cặp khóa-giá trị (tức là BSON). Tài liệu trong MongoDB không cần thiết phải có cùng cấu trúc và các trường giống nhau, điều này khác với cơ sở dữ liệu quan hệ.

Cần lưu ý rằng:

- Các cặp khóa/giá trị trong tài liệu được sắp xếp theo thứ tự.
- Giá trị trong tài liệu không chỉ có thể là chuỗi được bao quanh bởi dấu ngoặc kép, mà còn có thể là một số kiểu dữ liệu khác (thậm chí có thể là một tài liệu lồng nhau).
- MongoDB phân biệt chữ hoa chữ thường.
- Tài liệu MongoDB không thể có các khóa trùng lặp.
- Khóa trong tài liệu là chuỗi. Trừ một số trường hợp đặc biệt, khóa có thể sử dụng bất kỳ ký tự UTF-8 nào.

Quy tắc đặt tên khóa tài liệu:

- Khóa không thể chứa ký tự `\0` (ký tự rỗng). Ký tự này được sử dụng để đánh dấu cuối của khóa.
- `.` và `$` có ý nghĩa đặc biệt, chỉ có thể sử dụng trong một số ngữ cảnh cụ thể.
- Các khóa bắt đầu bằng dấu gạch dưới `_` là bảo lưu (không bắt buộc).

### Bộ sưu tập

Bộ sưu tập là một nhóm tài liệu trong MongoDB, tương tự như bảng trong hệ thống quản lý cơ sở dữ liệu quan hệ (RDBMS).

Bộ sưu tập tồn tại trong cơ sở dữ liệu và không có cấu trúc cố định, điều này có nghĩa là bạn có thể chèn các định dạng và kiểu dữ liệu khác nhau vào bộ sưu tập, nhưng thường thì dữ liệu chèn vào bộ sưu tập sẽ có một mối quan hệ nhất định.

Tên bộ sưu tập hợp lệ:

- Tên bộ sưu tập không thể là chuỗi rỗng ("").
- Tên bộ sưu tập không thể chứa ký tự `\0` (ký tự rỗng), ký tự này đại diện cho cuối tên bộ sưu tập.
- Tên bộ sưu tập không thể bắt đầu bằng "system." vì đó là tiền tố được dành riêng cho các bộ sưu tập hệ thống.
- Tên bộ sưu tập do người dùng tạo không thể chứa các ký tự bảo lưu. Một số trình điều khiển thực sự hỗ trợ việc bao gồm các ký tự này trong tên bộ sưu tập, điều này là do một số bộ sưu tập được tạo ra bởi hệ thống. Trừ khi bạn cần truy cập vào các bộ sưu tập được tạo ra bởi hệ thống này, hãy không bao giờ bao gồm chúng trong tên.

### Metadata

Thông tin về cơ sở dữ liệu được lưu trữ trong các bộ sưu tập (collections). Chúng sử dụng không gian tên hệ thống: `dbname.system.*`

Trong cơ sở dữ liệu MongoDB, không gian tên `<dbname>.system.*` là các bộ sưu tập đặc biệt chứa nhiều thông tin hệ thống, như sau:

|Tên không gian bộ sưu tập|Mô tả|
|:--|:--|
|dbname.system.namespaces|Liệt kê tất cả không gian tên.|
|dbname.system.indexes|Liệt kê tất cả các chỉ mục.|
|dbname.system.profile|Chứa thông tin hồ sơ của cơ sở dữ liệu.|
|dbname.system.users|Liệt kê tất cả người dùng có quyền truy cập vào cơ sở dữ liệu.|
|dbname.local.sources|Chứa thông tin và trạng thái của máy chủ sao chép (slave).|

Có một số hạn chế khi sửa đổi các đối tượng trong bộ sưu tập hệ thống:

- Có thể chèn dữ liệu vào `system.indexes` để tạo chỉ mục. Tuy nhiên, ngoài việc tạo chỉ mục, thông tin trong bảng này là không thay đổi (lệnh đặc biệt `drop index` sẽ tự động cập nhật thông tin liên quan).
- `system.users` có thể được sửa đổi.
- `system.profile` có thể bị xóa.

Tóm lại, Metadata đóng vai trò quan trọng trong cơ sở dữ liệu, mô tả cấu trúc và tổ chức của cơ sở dữ liệu, cũng như các thuộc tính và mối quan hệ của dữ liệu được lưu trữ trong cơ sở dữ liệu. Thông qua các bộ sưu tập hệ thống, ta có thể quản lý và truy cập vào các thông tin meta này.

## Các kiểu dữ liệu trong MongoDB

| Kiểu dữ liệu       | Mô tả                                                                                                      |
| :----------------- | :-------------------------------------------------------------------------------------------------------- |
| String             | Chuỗi ký tự. Đây là kiểu dữ liệu phổ biến được sử dụng để lưu trữ dữ liệu. Trong MongoDB, chỉ có chuỗi UTF-8 là hợp lệ. |
| Integer            | Số nguyên. Sử dụng để lưu trữ giá trị số. Tùy thuộc vào máy chủ bạn sử dụng, có thể là 32 bit hoặc 64 bit.       |
| Boolean            | Giá trị boolean. Sử dụng để lưu trữ giá trị true/false.                                                     |
| Double             | Số thực độ chính xác kép. Sử dụng để lưu trữ giá trị số thực.                                                |
| Min/Max keys       | So sánh một giá trị với giá trị tối thiểu và tối đa của phần tử BSON (JSON nhị phân).                          |
| Array              | Sử dụng để lưu trữ mảng, danh sách hoặc nhiều giá trị dưới một khóa.                                          |
| Timestamp          | Dấu thời gian. Ghi lại thời gian cụ thể khi tài liệu được sửa đổi hoặc thêm vào.                               |
| Object             | Sử dụng để nhúng tài liệu.                                                                                  |
| Null               | Sử dụng để tạo giá trị null.                                                                                |
| Symbol             | Ký hiệu. Kiểu dữ liệu này tương đương với kiểu chuỗi, nhưng thường được sử dụng trong các ngôn ngữ có ký hiệu đặc biệt. |
| Date               | Ngày tháng. Sử dụng định dạng thời gian UNIX để lưu trữ ngày tháng hiện tại. Bạn có thể chỉ định ngày tháng của riêng mình bằng cách tạo đối tượng Date và truyền thông tin về năm, tháng, ngày. |
| Object ID          | ID đối tượng. Sử dụng để tạo ID cho tài liệu.                                                               |
| Binary Data        | Dữ liệu nhị phân. Sử dụng để lưu trữ dữ liệu nhị phân.                                                        |
| Code               | Kiểu mã. Sử dụng để lưu trữ mã JavaScript trong tài liệu.                                                   |
| Regular expression | Kiểu biểu thức chính quy. Sử dụng để lưu trữ biểu thức chính quy.                                              |

## MongoDB CRUD

### Thao tác với cơ sở dữ liệu

#### Xem tất cả cơ sở dữ liệu

```shell
show dbs
```

#### Tạo cơ sở dữ liệu

```shell
use <database>
```

Nếu cơ sở dữ liệu không tồn tại, nó sẽ được tạo mới. Nếu tồn tại, nó sẽ chuyển sang cơ sở dữ liệu đã chỉ định.

【Ví dụ】Tạo cơ sở dữ liệu và chèn một bản ghi

Cơ sở dữ liệu "test" vừa được tạo mới không hiển thị trong danh sách cơ sở dữ liệu. Để hiển thị nó, chúng ta cần chèn một số dữ liệu.

```shell
> use test
switched to db test
>
> show dbs
admin   0.000GB
config  0.000GB
local   0.000GB
> db.test.insert({"name":"mongodb"})
WriteResult({ "nInserted" : 1 })
> show dbs
admin   0.000GB
config  0.000GB
local   0.000GB
test    0.000GB
```

#### Xóa cơ sở dữ liệu

Xóa cơ sở dữ liệu hiện tại

```shell
db.dropDatabase()
```

### Thao tác với bộ sưu tập (collection)

#### Xem bộ sưu tập

```shell
show collections
```

#### Tạo bộ sưu tập

```shell
db.createCollection(name, options)
```

Tham số:

- name: Tên của bộ sưu tập muốn tạo
- options: Tham số tùy chọn, cho phép chỉ định về kích thước bộ nhớ và các tùy chọn về chỉ mục

Các tùy chọn có thể là:

| Trường        | Kiểu dữ liệu | Mô tả                                                                                                                                                    |
| :------------ | :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| capped        | Boolean     | (Tùy chọn) Nếu là true, tạo một bộ sưu tập có kích thước cố định. Bộ sưu tập có kích thước cố định là một bộ sưu tập có kích thước tối đa và tự động ghi đè các tài liệu cũ khi đạt đến kích thước tối đa. **Khi giá trị này là true, bạn phải chỉ định tham số size.** |
| autoIndexId   | Boolean     | (Tùy chọn) Không còn được hỗ trợ từ phiên bản 3.2 trở đi. (Tùy chọn) Nếu là true, tự động tạo chỉ mục cho trường \_id. Mặc định là false.                                                                                     |
| size          | Number      | (Tùy chọn) Xác định kích thước tối đa của bộ sưu tập, tính bằng byte. **Nếu capped là true, bạn cũng phải chỉ định trường này.**                                                                                       |
| max           | Number      | (Tùy chọn) Xác định số lượng tài liệu tối đa trong bộ sưu tập.                                                                                                                                                          |

Khi chèn tài liệu, MongoDB sẽ kiểm tra trường size của bộ sưu tập trước, sau đó kiểm tra trường max.

```shell
> db.createCollection("collection")
{ "ok" : 1 }
> show collections
collection
```

#### Xóa bộ sưu tập

```shell
> db.collection.drop()
true
> show collections
>
```

### Thao tác chèn tài liệu

MongoDB sử dụng phương thức insert() để thực hiện thao tác chèn.

**Cú pháp**

```shell
# Chèn một tài liệu
db.<collection>.insertOne(<JSON>)
# Chèn nhiều tài liệu
db.<collection>.insertMany([<JSON 1>, <JSON 2>, ..., <JSON N>])
```

【Ví dụ】insertOne

```shell
> db.color.insertOne({name: "red"})
{
        "acknowledged" : true,
        "insertedId" : ObjectId("5f533ae4e8f16647950fdf43")
}
```

【Ví dụ】insertMany

```shell
> db.color.insertMany([
  {
    "name": "yellow"
  },
  {
    "name": "blue"
  }
])
{
        "acknowledged" : true,
        "insertedIds" : [
                ObjectId("5f533bcae8f16647950fdf44"),
                ObjectId("5f533bcae8f16647950fdf45")
        ]
}
>
```

### Thao tác truy vấn tài liệu

MongoDB sử dụng phương thức `find()` để thực hiện thao tác truy vấn tài liệu.

**Cú pháp**

```shell
db.<collection>.find(<JSON>)
```

Điều kiện truy vấn cũng được định dạng dưới dạng JSON. Nếu không đặt điều kiện truy vấn, nó sẽ truy vấn toàn bộ dữ liệu.

#### Điều kiện truy vấn

| Toán tử                 | Định dạng                              | Ví dụ                                        | Tương đương trong RDBMS |
| :---------------------- | :------------------------------------- | :------------------------------------------- | :---------------------- |
| Bằng                    | `{<key>:<value>}`                      | `db.book.find({"pageCount": {$eq: 0}})`      | `where pageCount = 0`   |
| Không bằng               | `{<key>:{$ne:<value>}}`                | `db.book.find({"pageCount": {$ne: 0}})`      | `where likes != 50`     |
| Lớn hơn                 | `{<key>:{$gt:<value>}}`                | `db.book.find({"pageCount": {$gt: 0}})`      | `where likes > 50`      |
| Lớn hơn hoặc bằng        | `{<key>:{$gte:<value>}}`               | `db.book.find({"pageCount": {$gte: 0}})`     | `where likes >= 50`     |
| Nhỏ hơn                 | `{<key>:{$lt:<value>}}`                | `db.book.find({"pageCount": {$lt: 200}})`    | `where likes < 50`      |
| Nhỏ hơn hoặc bằng        | `{<key>:{$lte:<value>}}`               | `db.book.find({"pageCount": {$lte: 200}})`   | `where likes <= 50`     |

> Lưu ý:
>
> ```shell
> $eq  --------  equal  =
> $ne ----------- not equal  !=
> $gt -------- greater than  >
> $gte --------- gt equal  >=
> $lt -------- less than  <
> $lte --------- lt equal  <=
> ```

【Ví dụ】

```shell
# Đếm số bản ghi khớp với điều kiện truy vấn
> db.book.find({"status": "MEAP"}).count()
68
```

#### Điều kiện logic truy vấn

(1) Điều kiện AND

Phương thức find() của MongoDB có thể chấp nhận nhiều khóa (key), mỗi khóa (key) được phân tách bằng dấu phẩy, tương tự như điều kiện AND trong SQL thông thường.

Cú pháp như sau:

```shell
> db.col.find({key1:value1, key2:value2}).pretty()
```

(2) Điều kiện OR

Câu lệnh điều kiện OR trong MongoDB sử dụng từ khóa **\$or**, cú pháp như sau:

```shell
>db.col.find(
   {
      $or: [
         {key1: value1}, {key2:value2}
      ]
   }
).pretty()
```

#### Truy vấn mờ

Truy vấn các tài liệu có trường "title" chứa chuỗi "Data":

```shell
db.col.find({ title: /Data/ })
```

Truy vấn các tài liệu có trường "title" bắt đầu chuỗi "Data":

```shell
db.col.find({ title: /^Data/ })
```

Truy vấn các tài liệu có trường "title" kết thúc bằng chuỗi "Data":

```shell
db.col.find({ title: /Data$/ })
```

#### Phương thức Limit()

Nếu bạn muốn đọc một số lượng cụ thể các bản ghi từ MongoDB, bạn có thể sử dụng phương thức Limit, phương thức limit() nhận một tham số số nguyên, tham số này chỉ định số lượng bản ghi đọc từ MongoDB.

Cú pháp của phương thức limit() như sau:

```shell
>db.COLLECTION_NAME.find().limit(NUMBER)
```

#### Phương thức Skip()

Ngoài việc sử dụng phương thức limit() để đọc một số lượng cụ thể các bản ghi từ MongoDB, chúng ta cũng có thể sử dụng phương thức skip() để bỏ qua một số lượng cụ thể các bản ghi, phương thức skip() cũng nhận một tham số số nguyên để xác định số lượng bản ghi bị bỏ qua.

Cú pháp của phương thức skip() như sau:

```shell
>db.COLLECTION_NAME.find().limit(NUMBER).skip(NUMBER)
```

#### Phương thức Sort()

Trong MongoDB, chúng ta có thể sắp xếp dữ liệu bằng cách sử dụng phương thức sort(), phương thức sort() cho phép chúng ta chỉ định trường sắp xếp và sử dụng 1 và -1 để chỉ định cách sắp xếp, 1 cho sắp xếp tăng dần và -1 được sử dụng để sắp xếp giảm dần.

Cú pháp cơ bản của phương thức sort() như sau:

```shell
>db.COLLECTION_NAME.find().sort({KEY:1})
```

> Lưu ý: Khi kết hợp phương thức skip(), limit(), sort() cùng nhau, thứ tự thực hiện là sort() trước, sau đó là skip(), cuối cùng là limit().

### Thao tác cập nhật tài liệu

Phương thức `update()` được sử dụng để cập nhật các tài liệu đã tồn tại trong cơ sở dữ liệu. Cú pháp như sau:

```shell
db.collection.update(
   <query>,
   <update>,
   {
     upsert: <boolean>,
     multi: <boolean>,
     writeConcern: <document>
   }
)
```

**Các tham số:**

- **query**: Điều kiện truy vấn cho việc cập nhật, tương tự như phần WHERE trong câu truy vấn SQL.
- **update**: Đối tượng cập nhật và các toán tử cập nhật (như $set, $inc…) và các tham số khác, tương tự như phần SET trong câu truy vấn SQL.
- **upsert**: Tùy chọn, nếu không tìm thấy tài liệu để cập nhật, liệu có thêm tài liệu mới hay không. Giá trị mặc định là false, không thêm tài liệu mới.
- **multi**: Tùy chọn, MongoDB mặc định là false, chỉ cập nhật bản ghi đầu tiên tìm thấy. Nếu đặt giá trị này là true, tất cả các bản ghi khớp sẽ được cập nhật.
- **writeConcern**: Tùy chọn, xác định mức độ nghiêm trọng của ngoại lệ.

【Ví dụ】Cập nhật tài liệu

```shell
db.collection.update({ title: 'MongoDB Tutorial' }, { $set: { title: 'MongoDB' } })
```

【Ví dụ】Cập nhật nhiều tài liệu giống nhau

Câu lệnh trên chỉ sẽ thay đổi tài liệu đầu tiên tìm thấy. Nếu bạn muốn cập nhật nhiều tài liệu giống nhau, bạn cần đặt tham số multi là true.

```shell
db.collection.update(
  { title: 'MongoDB Tutorial' },
  { $set: { title: 'MongoDB' } },
  { multi: true }
)
```

【Ví dụ】Các ví dụ khác

Chỉ cập nhật bản ghi đầu tiên:

```shell
db.collection.update({ count: { $gt: 1 } }, { $set: { test2: 'OK' } })
```

Cập nhật tất cả:

```shell
db.collection.update(
  { count: { $gt: 3 } },
  { $set: { test2: 'OK' } },
  false,
  true
)
```

Chỉ thêm bản ghi đầu tiên:

```shell
db.collection.update(
  { count: { $gt: 4 } },
  { $set: { test5: 'OK' } },
  true,
  false
)
```

Thêm tất cả:

```shell
db.collection.update(
  { count: { $gt: 4 } },
  { $set: { test5: 'OK' } },
  true,
  false
)
```

Cập nhật tất cả:

```shell
db.collection.update(
  { count: { $gt: 4 } },
  { $set: { test5: 'OK' } },
  true,
  false
)
```

Chỉ cập nhật bản ghi đầu tiên:

```shell
db.collection.update(
  { count: { $gt: 4 } },
  { $set: { test5: 'OK' } },
  true,
  false
)
```

### Thao tác xóa dữ liệu

Cách được khuyến nghị để xóa dữ liệu là sử dụng phương thức `deleteOne()` và `deleteMany()`.

Xóa tất cả các tài liệu có trường status là A:

```shell
db.collection.deleteMany({ status: 'A' })
```

Xóa một tài liệu có trường status là D:

```shell
db.collection.deleteOne({ status: 'D' })
```

### Thao tác với chỉ mục

Chỉ mục thường cải thiện đáng kể hiệu suất truy vấn. Nếu không có chỉ mục, MongoDB phải quét qua tất cả các tài liệu trong bộ sưu tập và chọn các bản ghi phù hợp với điều kiện truy vấn.

Quá trình quét toàn bộ bộ sưu tập để truy vấn dữ liệu là không hiệu quả, đặc biệt khi xử lý lượng dữ liệu lớn, truy vấn có thể mất vài chục giây hoặc thậm chí vài phút, điều này là rất đáng ngại đối với hiệu suất của trang web.

Chỉ mục là một cấu trúc dữ liệu đặc biệt, nó được lưu trữ trong một bộ sưu tập dễ dàng duyệt qua và đọc. Chỉ mục là một cách sắp xếp các giá trị của một cột hoặc nhiều cột trong bảng.

MongoDB sử dụng phương thức `createIndex()` để tạo chỉ mục.

Cú pháp cơ bản của phương thức `createIndex()` như sau:

```shell
db.collection.createIndex(keys, options)
```

Trong đó, keys là giá trị của trường bạn muốn tạo chỉ mục, 1 để chỉ định tạo chỉ mục theo thứ tự tăng dần, -1 để chỉ định tạo chỉ mục theo thứ tự giảm dần.

```shell
db.col.createIndex({"title":1})
```

Phương thức `createIndex()` cũng cho phép bạn tạo chỉ mục sử dụng nhiều trường (gọi là chỉ mục kết hợp) trong cùng một bảng.

```shell
db.col.createIndex({"title":1,"description":-1})
```

Phương thức `createIndex()` cũng có thể nhận các tham số tùy chọn, danh sách các tham số tùy chọn như sau:

| Tham số            | Kiểu dữ liệu  | Mô tả                                                                                                                                                                                                           |
|:------------------ |:------------- |:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| background         | Boolean       | Tạo chỉ mục ở chế độ nền, tức là tạo chỉ mục mà không làm gián đoạn các hoạt động khác trong cơ sở dữ liệu. Giá trị mặc định là **false**.                                                                      |
| unique             | Boolean       | Xác định xem chỉ mục được tạo có duy nhất hay không. Nếu đặt true, chỉ tạo chỉ mục duy nhất. Giá trị mặc định là **false**.                                                                                     |
| name               | string        | Tên của chỉ mục. Nếu không được chỉ định, MongoDB tạo tên chỉ mục dựa trên tên trường và thứ tự sắp xếp.                                                                                                        |
| ~~dropDups~~       | ~~Boolean~~   | ~~**Phiên bản 3.0+ đã bị loại bỏ.** Khi tạo chỉ mục duy nhất, xác định true để tạo chỉ mục duy nhất. Giá trị mặc định là **false**.~~                                                                           |
| sparse             | Boolean       | Chỉ tạo chỉ mục cho các tài liệu không có trường dữ liệu; tham số này cần được chú ý, nếu được đặt là true, chỉ mục sẽ không truy xuất các tài liệu không chứa trường tương ứng. Giá trị mặc định là **false**. |
| expireAfterSeconds | integer       | Xác định thời gian sống của bộ sưu tập, tính bằng giây.                                                                                                                                                         |
| v                  | index version | Phiên bản chỉ mục. Phiên bản chỉ mục mặc định phụ thuộc vào phiên bản MongoDB khi tạo chỉ mục.                                                                                                                  |
| weights            | document      | Trọng số chỉ mục, giá trị từ 1 đến 99,999, chỉ định trọng số điểm của chỉ mục so với các trường chỉ mục khác.                                                                                                   |
| default_language   | string        | Đối với chỉ mục văn bản, tham số này xác định danh sách các từ dừng và quy tắc từ gốc. Giá trị mặc định là tiếng Anh.                                                                                           |
| language_override  | string        | Đối với chỉ mục văn bản, tham số này xác định tên trường trong tài liệu chứa quy tắc ngôn ngữ và từ điển. Giá trị mặc định là language.                                                                         |

## Các phép toán tổng hợp trong MongoDB

Trong MongoDB, phép toán tổng hợp (aggregate) được sử dụng chủ yếu để xử lý dữ liệu (như tính trung bình, tổng, v.v.) và trả về kết quả tính toán. Đây tương tự như câu lệnh `count(*)` trong SQL.

### Pipeline (Đường ống)

Toàn bộ quá trình tổng hợp được gọi là pipeline, nó bao gồm nhiều bước, mỗi bước:

- Nhận một tập hợp các tài liệu (dữ liệu gốc).
- Thực hiện một loạt các phép toán trên các tài liệu này.
- Kết quả tài liệu được đưa cho bước tiếp theo.

Cú pháp cơ bản của phép toán tổng hợp:

```shell
pipeline = [$stage1, $stage1, ..., $stageN];

db.<collection>.aggregate(pipeline, {options});
```

### Các bước tổng hợp

| Bước              | Chức năng  | Tương đương SQL  |
| ----------------- | ---------- | ---------------- |
| `$match`          | Lọc        | WHERE            |
| `$project`        | Chiếu      | AS               |
| `$sort`           | Sắp xếp    | ORDER BY         |
| `$group`          | Nhóm       | GROUP BY         |
| `$skip` / `$limit`| Giới hạn kết quả | SKIP / LIMIT     |
| `$lookup`         | Kết nối trái | LEFT OUTER JOIN  |
| `$unwind`         | Mở rộng mảng | N/A              |
| `$graphLookup`    | Tìm kiếm đồ thị | N/A              |
| `$facet` / `$bucket` | Tìm kiếm phân khúc | N/A           |

【Ví dụ】

```shell
> db.collection.insertMany([{"title":"MongoDB Overview","description":"MongoDB is no sql database","by_user":"collection","tagsr":["mongodb","database","NoSQL"],"likes":"100"},{"title":"NoSQL Overview","description":"No sql database is very fast","by_user":"collection","tagsr":["mongodb","database","NoSQL"],"likes":"10"},{"title":"Neo4j Overview","description":"Neo4j is no sql database","by_user":"Neo4j","tagsr":["neo4j","database","NoSQL"],"likes":"750"}])
> db.collection.aggregate([{$group : {_id : "$by_user", num_tutorial : {$sum : 1}}}])
{ "_id" : null, "num_tutorial" : 3 }
{ "_id" : "Neo4j", "num_tutorial" : 1 }
{ "_id" : "collection", "num_tutorial" : 2 }
```

Bảng dưới đây hiển thị một số biểu thức tổng hợp:

| Biểu thức  | Mô tả                                           | Ví dụ                                                                                   |
| :---------| :---------------------------------------------- | :------------------------------------------------------------------------------------- |
| `$sum`    | Tính tổng.                                      | `db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$sum : "$likes"}}}])` |
| `$avg`    | Tính trung bình.                                 | `db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$avg : "$likes"}}}])` |
| `$min`    | Lấy giá trị nhỏ nhất trong tập hợp các tài liệu. | `db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$min : "$likes"}}}])` |
| `$max`    | Lấy giá trị lớn nhất trong tập hợp các tài liệu. | `db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$max : "$likes"}}}])` |
| `$push`   | Chèn giá trị vào một mảng trong tài liệu kết quả. | `db.mycol.aggregate([{$group : {_id : "$by_user", url : {$push: "$url"}}}])`            |
| `$addToSet` | Chèn giá trị vào một mảng trong tài liệu kết quả, nhưng không tạo bản sao. | `db.mycol.aggregate([{$group : {_id : "$by_user", url : {$addToSet : "$url"}}}])`       |
| `$first`  | Lấy tài liệu đầu tiên dựa trên sắp xếp.           | `db.mycol.aggregate([{$group : {_id : "$by_user", first_url : {$first : "$url"}}}])`    |
| `$last`   | Lấy tài liệu cuối cùng dựa trên sắp xếp.          | `db.mycol.aggregate([{$group : {_id : "$by_user", last_url : {$last : "$url"}}}])`      |
