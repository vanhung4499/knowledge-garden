---
title: MongoDB CRUD Operations
tags: [db, mongodb, nosql]
categories: [db, mongodb, nosql]
date created: 2023-07-24
date modified: 2023-07-24
---

# Các thao tác CRUD trong MongoDB

## I. Các thao tác CRUD cơ bản

Các thao tác CRUD trong MongoDB là các thao tác đọc và ghi dữ liệu vào tài liệu (document).

### Thao tác Create (Tạo)

MongoDB cung cấp các thao tác sau để chèn tài liệu vào một bộ sưu tập (collection):

- [`db.collection.insertOne()`](https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/#db.collection.insertOne): Chèn một tài liệu vào bộ sưu tập.
- [`db.collection.insertMany()`](https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#db.collection.insertMany): Chèn nhiều tài liệu vào bộ sưu tập.

> Lưu ý: Các thao tác trên đều là thao tác nguyên tử.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200924112342.svg)

Đặc điểm của thao tác chèn:

- Tất cả các thao tác ghi trong MongoDB đều là thao tác nguyên tử cấp tài liệu duy nhất.
- Nếu bộ sưu tập mà bạn muốn chèn không tồn tại, thì thao tác chèn sẽ tự động tạo bộ sưu tập đó.
- Trong MongoDB, mỗi tài liệu được lưu trữ trong một bộ sưu tập cần có một trường [`_id`](https://docs.mongodb.com/manual/reference/glossary/#term-id) duy nhất làm khóa chính. Nếu tài liệu chèn thiếu trường `_id`, thì trình điều khiển MongoDB sẽ tự động tạo ra trường `_id` dưới dạng ObjectId.
- Bạn có thể điều chỉnh cấp độ xác nhận của thao tác ghi trong MongoDB.

【Ví dụ】Ví dụ chèn một tài liệu:

```javascript
db.inventory.insertOne({
  item: 'canvas',
  qty: 100,
  tags: ['cotton'],
  size: { h: 28, w: 35.5, uom: 'cm' }
})
```

【Ví dụ】Ví dụ chèn nhiều tài liệu:

```javascript
db.inventory.insertMany([
  {
    item: 'journal',
    qty: 25,
    tags: ['blank', 'red'],
    size: { h: 14, w: 21, uom: 'cm' }
  },
  {
    item: 'mat',
    qty: 85,
    tags: ['gray'],
    size: { h: 27.9, w: 35.5, uom: 'cm' }
  },
  {
    item: 'mousepad',
    qty: 25,
    tags: ['gel', 'blue'],
    size: { h: 19, w: 22.85, uom: 'cm' }
  }
])
```

### Thao tác Read (Đọc)

MongoDB cung cấp phương thức [`db.collection.find()`](https://docs.mongodb.com/manual/reference/method/db.collection.find/#db.collection.find) để truy vấn tài liệu.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200924113832.svg)

### Thao tác Update (Cập nhật)

MongoDB cung cấp các thao tác sau để cập nhật tài liệu trong một bộ sưu tập:

- [`db.collection.updateOne()`](https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/#db.collection.updateOne): Cập nhật một tài liệu.
- [`db.collection.updateMany()`](https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/#db.collection.updateMany): Cập nhật nhiều tài liệu.
- [`db.collection.replaceOne()`](https://docs.mongodb.com/manual/reference/method/db.collection.replaceOne/#db.collection.replaceOne): Thay thế một tài liệu.

Cú pháp:

- [`db.collection.updateOne(<filter>, <update>, <options>)`](https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/#db.collection.updateOne)
- [`db.collection.updateMany(<filter>, <update>, <options>)`](https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/#db.collection.updateMany)
- [`db.collection.replaceOne(<filter>, <update>, <options>)`](https://docs.mongodb.com/manual/reference/method/db.collection.replaceOne/#db.collection.replaceOne)

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200924114043.svg)

【Ví dụ】Chèn dữ liệu thử nghiệm:

```javascript
db.inventory.insertMany([
  {
    item: 'canvas',
    qty: 100,
    size: { h: 28, w: 35.5, uom: 'cm' },
    status: 'A'
  },
  { item: 'journal', qty: 25, size: { h: 14, w: 21, uom: 'cm' }, status: 'A' },
  { item: 'mat', qty: 85, size: { h: 27.9, w: 35.5, uom: 'cm' }, status: 'A' },
  {
    item: 'mousepad',
    qty: 25,
    size: { h: 19, w: 22.85, uom: 'cm' },
    status: 'P'
  },
  {
    item: 'notebook',
    qty: 50,
    size: { h: 8.5, w: 11, uom: 'in' },
    status: 'P'
  },
  { item: 'paper', qty: 100, size: { h: 8.5, w: 11, uom: 'in' }, status: 'D' },
  {
    item: 'planner',
    qty: 75,
    size: { h: 22.85, w: 30, uom: 'cm' },
    status: 'D'
  },
  {
    item: 'postcard',
    qty: 45,
    size: { h: 10, w: 15.25, uom: 'cm' },
    status: 'A'
  },
  {
    item: 'sketchbook',
    qty: 80,
    size: { h: 14, w: 21, uom: 'cm' },
    status: 'A'
  },
  {
    item: 'sketch pad',
    qty: 95,
    size: { h: 22.85, w: 30.5, uom: 'cm' },
    status: 'A'
  }
])
```

【Ví dụ】Cập nhật một tài liệu:

```javascript
db.inventory.updateOne(
  { item: 'paper' },
  {
    $set: { 'size.uom': 'cm', status: 'P' },
    $currentDate: { lastModified: true }
  }
)
```

【Ví dụ】Cập nhật nhiều tài liệu:

```javascript
db.inventory.updateMany(
  { qty: { $lt: 50 } },
  {
    $set: { 'size.uom': 'in', status: 'P' },
    $currentDate: { lastModified: true }
  }
)
```

【Ví dụ】Thay thế một tài liệu:

```javascript
db.inventory.replaceOne(
  { item: 'paper' },
  {
    item: 'paper',
    instock: [
      { warehouse: 'A', qty: 60 },
      { warehouse: 'B', qty: 40 }
    ]
  }
)
```

Đặc điểm của thao tác cập nhật:

- Tất cả các thao tác ghi trong MongoDB đều là thao tác nguyên tử cấp tài liệu duy nhất.
- Một khi đã được thiết lập, không thể cập nhật hoặc thay thế trường [`_id`](https://docs.mongodb.com/manual/reference/glossary/#term-id).
- MongoDB sẽ giữ nguyên thứ tự các trường trong tài liệu sau khi thực hiện thao tác ghi, trừ khi:
  - Trường `_id` luôn là trường đầu tiên trong tài liệu.
  - Các thao tác cập nhật bao gồm việc đổi tên trường có thể dẫn đến sắp xếp lại các trường trong tài liệu.
- Nếu thao tác cập nhật chứa `upsert: true` và không có tài liệu nào khớp với bộ lọc, MongoDB sẽ chèn một tài liệu mới; nếu có tài liệu khớp, MongoDB sẽ cập nhật hoặc thay thế các tài liệu đó.

### Thao tác Delete (Xóa)

MongoDB cung cấp các thao tác sau để xóa tài liệu trong một bộ sưu tập:

- [`db.collection.deleteOne()`](https://docs.mongodb.com/manual/reference/method/db.collection.deleteOne/#db.collection.deleteOne): Xóa một tài liệu.
- [`db.collection.deleteMany()`](https://docs.mongodb.com/manual/reference/method/db.collection.deleteMany/#db.collection.deleteMany): Xóa nhiều tài liệu.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200924120007.svg)

Đặc điểm của thao tác xóa:

- Tất cả các thao tác ghi trong MongoDB đều là thao tác nguyên tử cấp tài liệu duy nhất.

## II. Thao tác ghi hàng loạt

MongoDB hỗ trợ thao tác ghi hàng loạt (bao gồm chèn hàng loạt, cập nhật hàng loạt, xóa hàng loạt) thông qua phương thức [`db.collection.bulkWrite()`](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#db.collection.bulkWrite).

Ngoài ra, phương thức [`db.collection.insertMany()`](https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#db.collection.insertMany) cũng hỗ trợ thao tác chèn hàng loạt.

### Thao tác có thứ tự và không có thứ tự

Thao tác ghi hàng loạt có thể được thực hiện theo thứ tự hoặc không có thứ tự.

- Đối với danh sách có thứ tự, MongoDB thực hiện các thao tác theo thứ tự. Nếu có lỗi xảy ra trong quá trình xử lý thao tác ghi, MongoDB sẽ không xử lý các thao tác ghi còn lại trong danh sách.
- Đối với danh sách không có thứ tự, MongoDB có thể thực hiện các thao tác song song, nhưng không đảm bảo hành vi này. Nếu có lỗi xảy ra trong quá trình xử lý thao tác ghi, MongoDB sẽ tiếp tục xử lý các thao tác ghi còn lại trong danh sách.

Thực hiện các thao tác có thứ tự trên một tập hợp phân đoạn thường chậm hơn thực hiện các thao tác không có thứ tự, vì đối với các thao tác có thứ tự, mỗi thao tác phải chờ đợi thao tác trước hoàn thành.

Mặc định, [`bulkWrite()`](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#db.collection.bulkWrite) thực hiện các thao tác có thứ tự. Để chỉ định các thao tác ghi không có thứ tự, hãy đặt `ordered: false` trong tài liệu tùy chọn.

### Phương thức bulkWrite()

[`bulkWrite()`](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#db.collection.bulkWrite) hỗ trợ các thao tác ghi sau đây:

- [insertOne](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#bulkwrite-write-operations-insertone)
- [updateOne](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#bulkwrite-write-operations-updateonemany)
- [updateMany](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#bulkwrite-write-operations-updateonemany)
- [replaceOne](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#bulkwrite-write-operations-replaceone)
- [deleteOne](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#bulkwrite-write-operations-deleteonemany)
- [deleteMany](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#bulkwrite-write-operations-deleteonemany)

【Ví dụ】Ví dụ về thao tác ghi hàng loạt:

```javascript
try {
  db.characters.bulkWrite([
    {
      insertOne: {
        document: {
          _id: 4,
          char: 'Dithras',
          class: 'barbarian',
          lvl: 4
        }
      }
    },
    {
      insertOne: {
        document: {
          _id: 5,
          char: 'Taeln',
          class: 'fighter',
          lvl: 3
        }
      }
    },
    {
      updateOne: {
        filter: { char: 'Eldon' },
        update: { $set: { status: 'Critical Injury' } }
      }
    },
    { deleteOne: { filter: { char: 'Brisbane' } } },
    {
      replaceOne: {
        filter: { char: 'Meldane' },
        replacement: { char: 'Tanys', class: 'oracle', lvl: 4 }
      }
    }
  ])
} catch (e) {
  print(e)
}
```

### Chiến lược thao tác ghi hàng loạt

Các thao tác chèn hàng loạt lớn (bao gồm chèn dữ liệu ban đầu hoặc nhập dữ liệu thường xuyên) có thể ảnh hưởng đến hiệu suất của cụm phân đoạn. Đối với thao tác chèn hàng loạt, hãy xem xét các chiến lược sau:

#### Trước khi tách collection

Nếu tập hợp phân đoạn rỗng, tập hợp đó chỉ có một phân đoạn ban đầu nằm trên một phân đoạn duy nhất. Sau đó, MongoDB phải mất một khoảng thời gian để nhận dữ liệu, tạo các phân đoạn và phân phối các phân đoạn đã tách đến các phân đoạn khả dụng. Để tránh chi phí hiệu suất này, bạn có thể tiền tách collection theo hướng dẫn về tách phân đoạn trong cụm phân đoạn.

#### Thao tác ghi không có thứ tự

Để cải thiện hiệu suất ghi vào cụm phân đoạn, hãy sử dụng [`bulkWrite()`](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#db.collection.bulkWrite) và đặt tham số tùy chọn `ordered` thành false. [`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) có thể cố gắng gửi các thao tác ghi đến nhiều phân đoạn cùng một lúc. Đối với tập hợp trống, hãy tiền tách collection theo hướng dẫn tách phân đoạn trong cụm phân đoạn.

#### Tránh luồng dữ liệu đơn điệu

Nếu trong một thao tác chèn, khóa phân đoạn tăng dần, tất cả dữ liệu chèn sẽ được lưu trữ trong phân đoạn cuối cùng của tập hợp, tức là chỉ lưu trữ trong một phân đoạn. Do đó, khả năng chèn của cụm sẽ không bao giờ vượt quá khả năng chèn của một phân đoạn duy nhất.

Nếu lượng dữ liệu chèn lớn hơn khả năng chèn của một phân đoạn duy nhất và không thể tránh được khóa phân đoạn tăng dần, hãy xem xét các sửa đổi sau đây cho ứng dụng:

- Đảo ngược các bit nhị phân của khóa phân đoạn. Điều này giữ nguyên thông tin và tránh liên kết thứ tự chèn với sự gia tăng giá trị.
- Hoán đổi 16 bit đầu tiên và cuối cùng của khóa để chèn "ngẫu nhiên".

## So sánh SQL và MongoDB

### Thuật ngữ và Khái niệm

| Thuật ngữ và Khái niệm SQL    | Thuật ngữ và Khái niệm MongoDB                                                                                                                                                                                                                         |
|:----------------------------- |:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| database                      | [database](https://docs.mongodb.com/manual/reference/glossary/#term-database)                                                                                                                                                                          |
| table                         | [collection](https://docs.mongodb.com/manual/reference/glossary/#term-collection)                                                                                                                                                                      |
| row                           | [document](https://docs.mongodb.com/manual/reference/glossary/#term-document) hoặc [BSON](https://docs.mongodb.com/manual/reference/glossary/#term-bson)                                                                                               |
| column                        | [field](https://docs.mongodb.com/manual/reference/glossary/#term-field)                                                                                                                                                                                |
| index                         | [index](https://docs.mongodb.com/manual/reference/glossary/#term-index)                                                                                                                                                                                |
| table joins                   | [`$lookup`](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#pipe._S_lookup) hoặc nhúng tài liệu                                                                                                                                 |
| primary key                   | [primary key](https://docs.mongodb.com/manual/reference/glossary/#term-primary-key)<br>Trong MongoDB, khóa chính được tự động đặt là trường [`_id`](https://docs.mongodb.com/manual/reference/glossary/#term-id)                                       |
| aggregation (ví dụ: group by) | aggregation pipeline<br>Tham khảo [Bảng ánh xạ SQL sang Aggregation](https://docs.mongodb.com/manual/reference/sql-aggregation-comparison/).                                                                                                           |
| SELECT INTO NEW_TABLE         | [`$out`](https://docs.mongodb.com/manual/reference/operator/aggregation/out/#pipe._S_out)<br>Tham khảo [Bảng ánh xạ SQL sang Aggregation](https://docs.mongodb.com/manual/reference/sql-aggregation-comparison/)                                       |
| MERGE INTO TABLE              | [`$merge`](https://docs.mongodb.com/manual/reference/operator/aggregation/merge/#pipe._S_merge) (Hỗ trợ từ MongoDB 4.2 trở đi)<br>Tham khảo [Bảng ánh xạ SQL sang Aggregation](https://docs.mongodb.com/manual/reference/sql-aggregation-comparison/). |
| UNION ALL                     | [`$unionWith`](https://docs.mongodb.com/manual/reference/operator/aggregation/unionWith/#pipe._S_unionWith) (Hỗ trợ từ MongoDB 4.4 trở đi)                                                                                                             |
| transactions                  | [transactions](https://docs.mongodb.com/manual/core/transactions/)                                                                                                                                                                                     |
