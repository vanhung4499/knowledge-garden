---
title: MongoDB Modeling
tags: [db, mongodb, nosql]
categories: [db, mongodb, nosql]
date created: 2023-07-24
date modified: 2023-07-24
---

# # Mô hình hóa MongoDB

Mô hình dữ liệu của MongoDB là một mô hình linh hoạt, trong khi cơ sở dữ liệu quan hệ yêu cầu bạn định nghĩa cấu trúc mô hình bảng trước khi chèn dữ liệu. Tuy nhiên, trong MongoDB, tài liệu không giới hạn cấu trúc. Điều này giúp dễ dàng ánh xạ giữa đối tượng và tài liệu cơ sở dữ liệu. Ngay cả khi có sự thay đổi lớn giữa các bản ghi dữ liệu, mỗi tài liệu vẫn có thể ánh xạ tốt vào các bản ghi khác nhau. Tuy nhiên, trong thực tế, các tài liệu trong cùng một bộ sưu tập thường có cấu trúc tương tự nhau.

Việc thiết kế mô hình dữ liệu là một quá trình đầy thách thức, đòi hỏi cân nhắc và cân nhắc giữa yêu cầu ứng dụng, hiệu suất của cơ sở dữ liệu và mô hình đọc/ghi dữ liệu. Khi thiết kế mô hình dữ liệu, hãy cân nhắc yêu cầu ứng dụng với mô hình sử dụng dữ liệu (như truy vấn, cập nhật và xử lý) cũng như cấu trúc tự nhiên của dữ liệu.

# Nhập môn mô hình hoá dữ liệu MongoDB

> Tham khảo: https://docs.mongodb.com/guides/server/introduction/#what-you-ll-need

### (1) Xác định tập dữ liệu

Khi cần tạo lưu trữ dữ liệu, trước hết cần đặt câu hỏi: Dữ liệu nào cần được lưu trữ? Các trường này liên quan như thế nào?

Đây là quá trình thiết kế dữ liệu. Mục tiêu là **trừu tượng hóa yêu cầu kinh doanh thành mô hình logic**.

Giả sử có một tình huống như sau: Chúng ta cần xây dựng cơ sở dữ liệu để theo dõi vật liệu và số lượng, kích thước, nhãn hiệu và xếp hạng của chúng.

Nếu lưu trữ trong RDBMS, có thể có bảng dữ liệu như sau:

| name     | quantity | size        | status | tags                     | rating |
| :------- | :------- | :---------- | :----- | :----------------------- | :----- |
| journal  | 25       | 14x21,cm    | A      | brown, lined             | 9      |
| notebook | 50       | 8.5x11,in   | A      | college-ruled,perforated | 8      |
| paper    | 100      | 8.5x11,in   | D      | watercolor               | 10     |
| planner  | 75       | 22.85x30,cm | D      | 2019                     | 10     |
| postcard | 45       | 10x,cm      | D      | double-sided,white       | 2      |

### (2) Xem xét cấu trúc JSON

Từ ví dụ trên, có vẻ như bảng là nơi lưu trữ dữ liệu tốt, nhưng các trường trong tập dữ liệu này có thể chứa nhiều giá trị và không dễ tìm kiếm hoặc hiển thị (như kích thước và nhãn hiệu) nếu được mô hình hóa trong một cột duy nhất.

Trong cơ sở dữ liệu SQL, có thể giải quyết vấn đề này bằng cách tạo bảng quan hệ.

Trong MongoDB, dữ liệu được lưu trữ dưới dạng tài liệu (document). Các tài liệu này được lưu trữ dưới dạng định dạng JSON (JavaScript Object Notation) trong MongoDB. Tài liệu JSON hỗ trợ các trường nhúng, cho phép lưu trữ dữ liệu liên quan và danh sách dữ liệu cùng với tài liệu, thay vì lưu trữ chúng trong bảng bên ngoài.

Định dạng JSON chứa các cặp khóa/giá trị. Trong tài liệu JSON, tên trường và giá trị được phân tách bằng dấu hai chấm, các cặp khóa/giá trị được phân tách bằng dấu phẩy và tập hợp các trường được đóng gói trong cặp dấu ngoặc nhọn `{}`.

Nếu muốn bắt đầu mô hình hóa một trong các hàng trên, ví dụ hàng này:

| name     | quantity | size      | status | tags                     | rating |
| :------- | :------- | :-------- | :----- | :----------------------- | :----- |
| notebook | 50       | 8.5x11,in | A      | college-ruled,perforated | 8      |

Có thể bắt đầu từ các trường `name` và `quantity`. Trong JSON, các trường này sẽ như sau:

```json
{ "name": "notebook", "qty": 50 }
```

### (3) Xác định các trường là dữ liệu nhúng

Tiếp theo, cần xác định các trường có thể chứa nhiều giá trị. Có thể xem xét chuyển các trường này thành tài liệu nhúng hoặc đối tượng danh sách/mảng nhúng.

Ví dụ, trong ví dụ trên, trường `size` có thể chứa ba trường:

```json
{ "h": 11, "w": 8.5, "uom": "in" }
```

Và một số mục có nhiều xếp hạng, vì vậy `rating` có thể được biểu thị dưới dạng danh sách các tài liệu chứa trường `score`:

```json
[{ "score": 8 }, { "score": 9 }]
```

Và có thể cần xử lý nhiều nhãn cho mỗi mục. Vì vậy, có thể lưu trữ chúng trong một danh sách.

```json
["college-ruled", "perforated"]
```

Cuối cùng, một tài liệu JSON lưu trữ một mục trong kho hàng có thể trông như sau:

```json
{
  "name": "notebook",
  "qty": 50,
  "rating": [{ "score": 8 }, { "score": 9 }],
  "size": { "height": 11, "width": 8.5, "unit": "in" },
  "status": "A",
  "tags": ["college-ruled", "perforated"]
}
```

Điều này trông khác biệt rất nhiều so với cấu trúc dữ liệu bảng ban đầu bạn bắt đầu ở Bước 1.

## Giới thiệu về mô hình dữ liệu

Thách thức chính trong việc xây dựng mô hình dữ liệu là cân bằng giữa yêu cầu của ứng dụng, hiệu suất của cơ sở dữ liệu và mô hình truy xuất dữ liệu. Khi thiết kế mô hình dữ liệu, luôn cần xem xét cách ứng dụng sử dụng dữ liệu (tức là truy vấn, cập nhật và xử lý dữ liệu) cũng như cấu trúc cố định của dữ liệu.

### Schema linh hoạt

Trong cơ sở dữ liệu quan hệ, phải xác định và khai báo cấu trúc bảng trước khi chèn dữ liệu. Trong MongoDB, các tài liệu trong collection mặc định không cần có cấu trúc giống nhau. Nghĩa là:

Các tài liệu trong cùng một collection không cần có tập hợp trường giống nhau và kiểu dữ liệu của trường có thể khác nhau giữa các tài liệu trong collection.

Để thay đổi cấu trúc tài liệu trong collection, ví dụ như thêm trường mới, xóa trường hiện có hoặc thay đổi giá trị trường thành kiểu mới, chỉ cần cập nhật tài liệu thành cấu trúc mới.

Tính linh hoạt này giúp ánh xạ tài liệu vào các thực thể hoặc đối tượng. Mỗi tài liệu có thể khớp với các trường dữ liệu của thực thể mà nó đại diện, ngay cả khi tài liệu đó khác biệt rất nhiều so với các tài liệu khác trong collection. Tuy nhiên, thực tế là các tài liệu trong collection có cấu trúc tương tự và bạn có thể áp dụng các quy tắc kiểm tra tài liệu trong quá trình cập nhật và chèn dữ liệu vào collection.

### Cấu trúc tài liệu

#### Mô hình dữ liệu nhúng

Tài liệu nhúng bằng cách lưu trữ dữ liệu liên quan trong một cấu trúc tài liệu duy nhất. Tài liệu MongoDB có thể nhúng cấu trúc tài liệu vào trường hoặc mảng trong tài liệu khác. Mô hình dữ liệu phi chuẩn hóa này cho phép ứng dụng truy xuất và thao tác dữ liệu liên quan trong một hoạt động cơ sở dữ liệu duy nhất.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200910193231.png)

Mô hình dữ liệu phi chuẩn hóa thường là lựa chọn tốt cho nhiều tình huống trong MongoDB.

> Tài liệu nhúng có giới hạn kích thước: phải nhỏ hơn 16 MB.
>
> Đối với dữ liệu nhị phân lớn hơn, hãy xem xét [GridFS](https://docs.mongodb.com/manual/core/gridfs/).

#### Mô hình dữ liệu tham chiếu

Tham chiếu lưu trữ mối quan hệ dữ liệu bằng cách bao gồm liên kết hoặc tham chiếu từ một tài liệu đến một tài liệu khác. Ứng dụng có thể giải quyết các tham chiếu này để truy cập dữ liệu liên quan. Nói chung, đây là mô hình dữ liệu chuẩn hóa.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200910193234.png)

Thường thì mô hình dữ liệu tham chiếu được sử dụng trong các tình huống sau:

- Nhúng dẫn đến dữ liệu lặp lại nhưng không cung cấp lợi ích hiệu suất đọc đủ để vượt qua ý nghĩa của sự lặp lại.
- Đại diện cho quan hệ nhiều nhiều phức tạp hơn.
- Mô hình dữ liệu cây lớn.

Để tham gia các collection, MongoDB hỗ trợ các giai đoạn tổng hợp:

- [`$lookup`](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#pipe._S_lookup) (bắt đầu từ MongoDB 3.2)
- [`$graphLookup`](https://docs.mongodb.com/manual/reference/operator/aggregation/graphLookup/#pipe._S_graphLookup) (bắt đầu từ MongoDB 3.4)

MongoDB cũng cung cấp tham chiếu để hỗ trợ việc tham gia dữ liệu giữa các collection:

- Ví dụ mô hình dữ liệu tham chiếu, xem: [Model One-to-Many Relationships with Document References](https://docs.mongodb.com/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/#data-modeling-publisher-and-books).
- Nhiều mô hình cây hơn, xem: [Model Tree Structures](https://docs.mongodb.com/manual/applications/data-models-tree-structures/).

### Ghi nguyên tử

#### Tính nguyên tố của tài liệu đơn

Trong MongoDB, các hoạt động ghi đối với một tài liệu đơn là nguyên tố, ngay cả khi tài liệu đó chứa nhiều tài liệu con. Mô hình dữ liệu phi chuẩn hóa với dữ liệu nhúng kết hợp tất cả dữ liệu liên quan vào một tài liệu, thay vì chuẩn hóa chúng thành nhiều tài liệu và collection. Mô hình dữ liệu này giúp đảm bảo tính nguyên tố. Khi một hoạt động ghi đơn (ví dụ: [`db.collection.updateMany()`](https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/#db.collection.updateMany)) sửa đổi nhiều tài liệu, mỗi sửa đổi riêng lẻ của tài liệu là nguyên tố, nhưng toàn bộ hoạt động không phải là nguyên tố.

#### Giao dịch đa tài liệu

Đối với các trường hợp cần đảm bảo tính nguyên tố của việc đọc và ghi đối với nhiều tài liệu (trong một hoặc nhiều collection), MongoDB hỗ trợ giao dịch đa tài liệu.

- Trong phiên bản 4.0, MongoDB hỗ trợ giao dịch đa tài liệu trên tập sao chép.
- Trong phiên bản 4.2, MongoDB giới thiệu giao dịch phân tán, mở rộng hỗ trợ giao dịch đa tài liệu trên cụm shard và kết hợp với hỗ trợ giao dịch đa tài liệu hiện có trên tập sao chép.

> Trong hầu hết các trường hợp, giao dịch đa tài liệu sẽ tốn nhiều tài nguyên hiệu suất hơn so với việc ghi đơn tài liệu và khả năng sẵn có của giao dịch đa tài liệu không thể thay thế thiết kế cấu trúc hiệu quả. Trong nhiều trường hợp, mô hình dữ liệu phi chuẩn hóa (tài liệu nhúng và mảng) vẫn là lựa chọn tốt nhất. Điều này có nghĩa là thiết kế dữ liệu hợp lý sẽ giảm thiểu nhu cầu sử dụng giao dịch đa tài liệu.

### Sử dụng dữ liệu và hiệu năng

Khi thiết kế mô hình dữ liệu, hãy xem xét cách ứng dụng của bạn sẽ sử dụng cơ sở dữ liệu. Ví dụ, nếu ứng dụng của bạn chỉ sử dụng các tài liệu gần đây được chèn vào, hãy xem xét việc sử dụng capped collection. Hoặc, nếu ứng dụng của bạn chủ yếu là thao tác đọc trên bộ sưu tập, hãy thêm các chỉ mục để cải thiện hiệu năng.

## Xác thực Schema

### Xác định quy tắc xác thực

Nếu bạn muốn xác định quy tắc xác thực khi tạo bộ sưu tập mới, bạn cần chỉ định tùy chọn `validator` khi sử dụng [`db.createCollection()`](https://docs.mongodb.com/manual/reference/method/db.createCollection/#db.createCollection).

Nếu bạn muốn thêm xác thực tài liệu vào bộ sưu tập hiện có, bạn cần sử dụng lệnh [`collMod`](https://docs.mongodb.com/manual/reference/command/collMod/#dbcmd.collMod) với tùy chọn `validator`.

MongoDB cũng cung cấp các tùy chọn liên quan sau:

- Tùy chọn `validationLevel` (xác định mức độ nghiêm ngặt của xác thực tài liệu trong quá trình cập nhật)
- Tùy chọn `validationAction` (xác định hành động của MongoDB khi phát hiện tài liệu vi phạm quy tắc xác thực, có thể là từ chối và báo lỗi hoặc chấp nhận dữ liệu nhưng cảnh báo trong nhật ký).

### JSON Schema

Từ phiên bản 3.6 trở đi, MongoDB bắt đầu hỗ trợ xác thực JSON Schema.

Bạn có thể sử dụng toán tử [`$jsonSchema`](https://docs.mongodb.com/manual/reference/operator/query/jsonSchema/#op._S_jsonSchema) trong biểu thức xác thực để chỉ định xác thực JSON Schema.

【Ví dụ】

```javascript
db.createCollection('students', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'year', 'major', 'address'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        year: {
          bsonType: 'int',
          minimum: 2017,
          maximum: 3017,
          description: 'must be an integer in [ 2017, 3017 ] and is required'
        },
        major: {
          enum: ['Math', 'English', 'Computer Science', 'History', null],
          description: 'can only be one of the enum values and is required'
        },
        gpa: {
          bsonType: ['double'],
          description: 'must be a double if the field exists'
        },
        address: {
          bsonType: 'object',
          required: ['city'],
          properties: {
            street: {
              bsonType: 'string',
              description: 'must be a string if the field exists'
            },
            city: {
              bsonType: 'string',
              description: 'must be a string and is required'
            }
          }
        }
      }
    }
  }
})
```

### Các biểu thức truy vấn khác

Ngoài việc sử dụng toán tử truy vấn [`$jsonSchema`](https://docs.mongodb.com/manual/reference/operator/query/jsonSchema/#op._S_jsonSchema) để xác thực JSON Schema, MongoDB cũng hỗ trợ xác thực bằng các toán tử truy vấn khác, trừ các trường hợp sau:

- [`$near`](https://docs.mongodb.com/manual/reference/operator/query/near/#op._S_near),
- [`$nearSphere`](https://docs.mongodb.com/manual/reference/operator/query/nearSphere/#op._S_nearSphere),
- [`$text`](https://docs.mongodb.com/manual/reference/operator/query/text/#op._S_text),
- [`$where`](https://docs.mongodb.com/manual/reference/operator/query/where/#op._S_where), và
- [`$expr`](https://docs.mongodb.com/manual/reference/operator/query/expr/#op._S_expr) với biểu thức [`$function`](https://docs.mongodb.com/manual/reference/operator/aggregation/function/#exp._S_function)

【Ví dụ】Xác thực quy tắc trong biểu thức truy vấn

```javascript
db.createCollection('contacts', {
  validator: {
    $or: [
      { phone: { $type: 'string' } },
      { email: { $regex: /@mongodb\.com$/ } },
      { status: { $in: ['Unknown', 'Incomplete'] } }
    ]
  }
})
```

### Hành vi

Xác thực diễn ra trong quá trình cập nhật và chèn. Khi thêm quy tắc xác thực vào một bộ sưu tập, không có xác thực nào được áp dụng cho các tài liệu hiện có trừ khi có hoạt động sửa đổi.

#### Tài liệu hiện có

Tùy chọn `validationLevel` xác định hành động MongoDB thực hiện khi áp dụng quy tắc xác thực:

- Nếu `validationLevel` là strict (mức độ nghiêm ngặt, đây là mức độ mặc định của MongoDB), MongoDB sẽ áp dụng quy tắc xác thực cho tất cả các hoạt động chèn và cập nhật.
- Nếu `validationLevel` là moderate (mức độ trung bình), MongoDB chỉ xác thực các hoạt động chèn và cập nhật cho các tài liệu hiện có đã đáp ứng các điều kiện xác thực; các hoạt động cập nhật cho các tài liệu hiện có không đáp ứng các tiêu chí xác thực sẽ không được xác thực.

【Ví dụ】

Dưới đây là một hoạt động chèn bình thường:

```javascript
db.contacts.insert([
  {
    _id: 1,
    name: 'Anne',
    phone: '+1 555 123 456',
    city: 'London',
    status: 'Complete'
  },
  { _id: 2, name: 'Ivan', city: 'Vancouver' }
])
```

Cấu hình một quy tắc xác thực trên bộ sưu tập:

```javascript
db.runCommand({
  collMod: 'contacts',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['phone', 'name'],
      properties: {
        phone: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        name: {
          bsonType: 'string',
          description: 'must be a string and is required'
        }
      }
    }
  },
  validationLevel: 'moderate'
})
```

Bây giờ, bộ sưu tập `contacts` đã được thêm `validator` với `validationLevel` mức độ trung bình (moderate):

- Nếu cố gắng cập nhật tài liệu có `_id` là 1, MongoDB sẽ áp dụng quy tắc xác thực vì tài liệu hiện có đáp ứng điều kiện.
- Ngược lại, MongoDB sẽ không xác thực tài liệu có `_id` là 2 vì nó không đáp ứng quy tắc xác thực.

Nếu muốn vô hiệu hóa xác thực hoàn toàn, có thể đặt `validationLevel` thành `off`.

#### Chấp nhận hoặc từ chối tài liệu không hợp lệ

- Nếu `validationAction` là Error (lỗi, mặc định), MongoDB sẽ từ chối bất kỳ hoạt động chèn hoặc cập nhật nào vi phạm quy tắc xác thực.
- Nếu `validationAction` là Warn (cảnh báo), MongoDB sẽ ghi lại tất cả các vi phạm, nhưng cho phép chèn hoặc cập nhật.

【Ví dụ】

Khi tạo bộ sưu tập, cấu hình `validationAction` thành warn.

```javascript
db.createCollection('contacts2', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['phone'],
      properties: {
        phone: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        email: {
          bsonType: 'string',
          pattern: '@mongodb.com$',
          description:
            'must be a string and match the regular expression pattern'
        },
        status: {
          enum: ['Unknown', 'Incomplete'],
          description: 'can only be one of the enum values'
        }
      }
    }
  },
  validationAction: 'warn'
})
```

Cố gắng chèn một tài liệu vi phạm quy tắc:

```javascript
> db.contacts2.insert( { name: "Amanda", status: "Updated" } )
WriteResult({ "nInserted" : 1 })
```

MongoDB cho phép hoạt động này thực hiện, nhưng máy chủ sẽ ghi lại thông báo cảnh báo.

```
{"t":{"$date":"2020-09-11T16:35:57.754+08:00"},"s":"W",  "c":"STORAGE",  "id":20294,   "ctx":"conn14","msg":"Document would fail validation","attr":{"namespace":"test.contacts2","document":{"_id":{"$oid":"5f5b36ed8ea53d62a0b51c4e"},"name":"Amanda","status":"Updated"}}}
```

#### Giới hạn

Không thể xác định quy tắc xác thực trong các cơ sở dữ liệu đặc biệt `admin`, `local`, `config`.

Không thể xác định quy tắc xác thực trong các bộ sưu tập `system.*`.
