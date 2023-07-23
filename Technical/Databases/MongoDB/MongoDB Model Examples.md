---
title: MongoDB Model Examples
tags: [db, mongodb, nosql]
categories: [db, mongodb, nosql]
date created: 2023-07-24
date modified: 2023-07-24
---

# Ví dụ về mô hình hóa MongoDB

## Mô hình quan hệ

### Mô hình nhúng tài liệu một một

#### Mô hình nhúng tài liệu một-một - Mô hình nhúng tài liệu

```json
// patron document
{
   _id: "joe",
   name: "Joe Bookreader"
}

// address document
{
   patron_id: "joe", // reference to patron document
   street: "123 Fake Street",
   city: "Faketon",
   state: "MA",
   zip: "12345"
}
```

Kết hợp thành:

```json
{
  "_id": "joe",
  "name": "Joe Bookreader",
  "address": {
    "street": "123 Fake Street",
    "city": "Faketon",
    "state": "MA",
    "zip": "12345"
  }
}
```

#### Mô hình nhúng tài liệu một-một - Mô hình con

Giả sử, có một bộ sưu tập định nghĩa thông tin về phim:

```json
{
  "_id": 1,
  "title": "The Arrival of a Train",
  "year": 1896,
  "runtime": 1,
  "released": ISODate("01-25-1896"),
  "poster": "http://ia.media-imdb.com/images/M/MV5BMjEyNDk5MDYzOV5BMl5BanBnXkFtZTgwNjIxMTEwMzE@._V1_SX300.jpg",
  "plot": "A group of people are standing in a straight line along the platform of a railway station, waiting for a train, which is seen coming at some distance. When the train stops at the platform, ...",
  "fullplot": "A group of people are standing in a straight line along the platform of a railway station, waiting for a train, which is seen coming at some distance. When the train stops at the platform, the line dissolves. The doors of the railway-cars open, and people on the platform help passengers to get off.",
  "lastupdated": ISODate("2015-08-15T10:06:53"),
  "type": "movie",
  "directors": ["Auguste Lumière", "Louis Lumière"],
  "imdb": {
    "rating": 7.3,
    "votes": 5043,
    "id": 12
  },
  "countries": ["France"],
  "genres": ["Documentary", "Short"],
  "tomatoes": {
    "viewer": {
      "rating": 3.7,
      "numReviews": 59
    },
    "lastUpdated": ISODate("2020-01-09T00:02:53")
  }
}
```

Trong ứng dụng, có một số tình huống chỉ cần hiển thị thông tin tóm tắt về phim, không cần hiển thị thông tin chi tiết như fullplot, poster. Vì vậy, chúng ta có thể xem xét việc chia cấu trúc ban đầu thành hai phần và liên kết chúng thông qua trường id.

Bộ sưu tập movie dùng để hiển thị thông tin tóm tắt

```json
// movie collection

{
  "_id": 1,
  "title": "The Arrival of a Train",
  "year": 1896,
  "runtime": 1,
  "released": ISODate("1896-01-25"),
  "type": "movie",
  "directors": ["Auguste Lumière", "Louis Lumière"],
  "countries": ["France"],
  "genres": ["Documentary", "Short"]
}
```

Bộ sưu tập movie_details dùng để hiển thị thông tin chi tiết

```json
// movie_details collection

{
  "_id": 156,
  "movie_id": 1, // tham chiếu đến bộ sưu tập movie
  "poster": "http://ia.media-imdb.com/images/M/MV5BMjEyNDk5MDYzOV5BMl5BanBnXkFtZTgwNjIxMTEwMzE@._V1_SX300.jpg",
  "plot": "A group of people are standing in a straight line along the platform of a railway station, waiting for a train, which is seen coming at some distance. When the train stops at the platform, ...",
  "fullplot": "A group of people are standing in a straight line along the platform of a railway station, waiting for a train, which is seen coming at some distance. When the train stops at the platform, the line dissolves. The doors of the railway-cars open, and people on the platform help passengers to get off.",
  "lastupdated": ISODate("2015-08-15T10:06:53"),
  "imdb": {
    "rating": 7.3,
    "votes": 5043,
    "id": 12
  },
  "tomatoes": {
    "viewer": {
      "rating": 3.7,
      "numReviews": 59
    },
    "lastUpdated": ISODate("2020-01-29T00:02:53")
  }
}
```

### Mô hình nhúng tài liệu một-nhiều

#### Mô hình nhúng tài liệu một-nhiều - Mô hình nhúng tài liệu

```json
// Tài liệu patron
{
   _id: "joe",
   name: "Joe Bookreader"
}

// Tài liệu địa chỉ
{
   patron_id: "joe", // tham chiếu đến tài liệu patron
   street: "123 Fake Street",
   city: "Faketon",
   state: "MA",
   zip: "12345"
}

{
   patron_id: "joe",
   street: "1 Some Other Street",
   city: "Boston",
   state: "MA",
   zip: "12345"
}
```

Kết hợp thành:

```json
{
  "_id": "joe",
  "name": "Joe Bookreader",
  "addresses": [
    {
      "street": "123 Fake Street",
      "city": "Faketon",
      "state": "MA",
      "zip": "12345"
    },
    {
      "street": "1 Some Other Street",
      "city": "Boston",
      "state": "MA",
      "zip": "12345"
    }
  ]
}
```

#### Mô hình nhúng tài liệu một-nhiều - Mô hình con

Xem xét một bộ sưu tập đại diện cho thông tin sản phẩm trên một trang web thương mại điện tử:

```json
{
  "_id": 1,
  "name": "Super Widget",
  "description": "This is the most useful item in your toolbox.",
  "price": { "value": NumberDecimal("119.99"), "currency": "USD" },
  "reviews": [
    {
      "review_id": 786,
      "review_author": "Kristina",
      "review_text": "This is indeed an amazing widget.",
      "published_date": ISODate("2019-02-18")
    },
    {
      "review_id": 785,
      "review_author": "Trina",
      "review_text": "Nice product. Slow shipping.",
      "published_date": ISODate("2019-02-17")
    },
    ...{
      "review_id": 1,
      "review_author": "Hans",
      "review_text": "Meh, it's okay.",
      "published_date": ISODate("2017-12-06")
    }
  ]
}
```

Các đánh giá được sắp xếp theo thứ tự thời gian giảm dần. Khi người dùng truy cập trang sản phẩm, ứng dụng sẽ tải lên mười đánh giá gần đây nhất. Thay vì lưu trữ tất cả các đánh giá cùng với thông tin sản phẩm, chúng ta có thể chia bộ sưu tập thành hai bộ sưu tập, một bộ sưu tập chứa thông tin sản phẩm và mười đánh giá gần đây nhất:

Bộ sưu tập sản phẩm lưu trữ thông tin về mỗi sản phẩm, bao gồm mười đánh giá gần đây nhất:

```json
{
  "_id": 1,
  "name": "Super Widget",
  "description": "This is the most useful item in your toolbox.",
  "price": { "value": NumberDecimal("119.99"), "currency": "USD" },
  "reviews": [
    {
      "review_id": 786,
      "review_author": "Kristina",
      "review_text": "This is indeed an amazing widget.",
      "published_date": ISODate("2019-02-18")
    }
    ...
    {
      "review_id": 776,
      "review_author": "Pablo",
      "review_text": "Amazing!",
      "published_date": ISODate("2019-02-16")
    }
  ]
}
```

Bộ sưu tập chi tiết đánh giá lưu trữ tất cả các đánh giá:

```json
{
  "review_id": 786,
  "product_id": 1,
  "review_author": "Kristina",
  "review_text": "This is indeed an amazing widget.",
  "published_date": ISODate("2019-02-18")
}
{
  "review_id": 785,
  "product_id": 1,
  "review_author": "Trina",
  "review_text": "Nice product. Slow shipping.",
  "published_date": ISODate("2019-02-17")
}
...
{
  "review_id": 1,
  "product_id": 1,
  "review_author": "Hans",
  "review_text": "Meh, it's okay.",
  "published_date": ISODate("2017-12-06")
}
```

### Mô hình một-nhiều dựa trên tài liệu tham chiếu

Xem xét ví dụ sau về mối quan hệ giữa nhà xuất bản và sách.

Ví dụ này cho thấy lợi ích của việc sử dụng tài liệu tham chiếu để tránh việc lặp lại thông tin về nhà xuất bản.

```json
{
   title: "MongoDB: The Definitive Guide",
   author: [ "Kristina Chodorow", "Mike Dirolf" ],
   published_date: ISODate("2010-09-24"),
   pages: 216,
   language: "English",
   publisher: {
              name: "O'Reilly Media",
              founded: 1980,
              location: "CA"
            }
}

{
   title: "50 Tips and Tricks for MongoDB Developer",
   author: "Kristina Chodorow",
   published_date: ISODate("2011-05-06"),
   pages: 68,
   language: "English",
   publisher: {
              name: "O'Reilly Media",
              founded: 1980,
              location: "CA"
            }
}
```

Để tránh việc lặp lại thông tin về nhà xuất bản, chúng ta có thể sử dụng tài liệu tham chiếu và lưu trữ thông tin về nhà xuất bản riêng biệt khỏi sách. Khi sử dụng tham chiếu, cách mà mối quan hệ tăng lên sẽ quyết định nơi lưu trữ tham chiếu. Nếu số lượng sách của mỗi nhà xuất bản ít và tăng trưởng có giới hạn, đôi khi việc lưu trữ tham chiếu sách trong tài liệu nhà xuất bản có thể hữu ích. Ngược lại, nếu số lượng sách của mỗi nhà xuất bản không bị giới hạn, mô hình dữ liệu này sẽ dẫn đến một mảng không đổi và không ngừng tăng, như ví dụ dưới đây:

```json
{
   name: "O'Reilly Media",
   founded: 1980,
   location: "CA",
   books: [123456789, 234567890, ...]
}

{
    _id: 123456789,
    title: "MongoDB: The Definitive Guide",
    author: [ "Kristina Chodorow", "Mike Dirolf" ],
    published_date: ISODate("2010-09-24"),
    pages: 216,
    language: "English"
}

{
   _id: 234567890,
   title: "50 Tips and Tricks for MongoDB Developer",
   author: "Kristina Chodorow",
   published_date: ISODate("2011-05-06"),
   pages: 68,
   language: "English"
}
```

Để tránh mảng không đổi và không ngừng tăng, hãy lưu trữ tham chiếu đến nhà xuất bản trong tài liệu sách:

```json
{
   _id: "oreilly",
   name: "O'Reilly Media",
   founded: 1980,
   location: "CA"
}

{
   _id: 123456789,
   title: "MongoDB: The Definitive Guide",
   author: [ "Kristina Chodorow", "Mike Dirolf" ],
   published_date: ISODate("2010-09-24"),
   pages: 216,
   language: "English",
   publisher_id: "oreilly"
}

{
   _id: 234567890,
   title: "50 Tips and Tricks for MongoDB Developer",
   author: "Kristina Chodorow",
   published_date: ISODate("2011-05-06"),
   pages: 68,
   language: "English",
   publisher_id: "oreilly"
}
```

## Mô hình cây có cấu trúc

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200911194846.svg)

### Mô hình cây có cấu trúc với nút cha

Cấu trúc trên có thể được biểu diễn bằng cách sử dụng tham chiếu cha:

```json
db.categories.insertMany([
  { "_id": "MongoDB", "parent": "Databases" },
  { "_id": "dbm", "parent": "Databases" },
  { "_id": "Databases", "parent": "Programming" },
  { "_id": "Languages", "parent": "Programming" },
  { "_id": "Programming", "parent": "Books" },
  { "_id": "Books", "parent": null }
])
```

- Truy vấn nút cha của một nút:

  ```
  db.categories.findOne( { _id: "MongoDB" } ).parent
  ```

- Có thể tạo chỉ mục trên trường cha để tìm kiếm nhanh nút cha:

  ```
  db.categories.createIndex( { parent: 1 } )
  ```

- Có thể tìm thấy các nút con trực tiếp thông qua truy vấn trường cha:

  ```
  db.categories.find( { parent: "Databases" } )
  ```

- Để truy vấn cây con, bạn có thể tham khảo: [`$graphLookup`](https://docs.mongodb.com/manual/reference/operator/aggregation/graphLookup/#pipe._S_graphLookup).

### Mô hình cây có cấu trúc với nút con

```json
db.categories.insertMany([
  { "_id": "MongoDB", "children": [] },
  { "_id": "dbm", "children": [] },
  { "_id": "Databases", "children": ["MongoDB", "dbm"] },
  { "_id": "Languages", "children": [] },
  { "_id": "Programming", "children": ["Databases", "Languages"] },
  { "_id": "Books", "children": ["Programming"] }
])
```

- Truy vấn các nút con của một nút:

  ```
  db.categories.findOne( { _id: "Databases" } ).children
  ```

- Có thể tạo chỉ mục trên trường children để tìm kiếm nhanh các nút con:

  ```
  db.categories.createIndex( { children: 1 } )
  ```

- Có thể truy vấn các nút thông qua trường children để tìm kiếm nút cha và các nút anh em:

  ```
  db.categories.find( { children: "MongoDB" } )
  ```

### Mô hình cây có cấu trúc với tổ tiên

```json
db.categories.insertMany([
  {
    "_id": "MongoDB",
    "ancestors": ["Books", "Programming", "Databases"],
    "parent": "Databases"
  },
  {
    "_id": "dbm",
    "ancestors": ["Books", "Programming", "Databases"],
    "parent": "Databases"
  },
  {
    "_id": "Databases",
    "ancestors": ["Books", "Programming"],
    "parent": "Programming"
  },
  {
    "_id": "Languages",
    "ancestors": ["Books", "Programming"],
    "parent": "Programming"
  },
  { "_id": "Programming", "ancestors": ["Books"], "parent": "Books" },
  { "_id": "Books", "ancestors": [], "parent": null }
])
```

- Truy vấn tổ tiên của một nút hoặc đường dẫn là nhanh chóng và trực tiếp:

  ```json
  db.categories.findOne({ "_id": "MongoDB" }).ancestors
  ```

- Có thể tạo chỉ mục trên trường ancestors để tìm kiếm nhanh các nút tổ tiên:

  ```json
  db.categories.createIndex({ "ancestors": 1 })
  ```

- Có thể truy vấn tất cả các con cháu của một nút thông qua trường ancestors:

  ```json
  db.categories.find({ "ancestors": "Programming" })
  ```

### Mô hình cây có đường dẫn cụ thể

```json
db.categories.insertMany([
  { "_id": "Books", "path": null },
  { "_id": "Programming", "path": ",Books," },
  { "_id": "Databases", "path": ",Books,Programming," },
  { "_id": "Languages", "path": ",Books,Programming," },
  { "_id": "MongoDB", "path": ",Books,Programming,Databases," },
  { "_id": "dbm", "path": ",Books,Programming,Databases," }
])
```

- Có thể truy vấn để lấy toàn bộ cây và sắp xếp theo trường đường dẫn:

  ```
  db.categories.find().sort( { path: 1 } )
  ```

- Có thể sử dụng biểu thức chính quy trên trường path để tìm kiếm các con cháu của Programming:

  ```
  db.categories.find( { path: /,Programming,/ } )
  ```

- Có thể truy vấn các con cháu của Books, trong đó Books cũng nằm ở cấp cao nhất của cấu trúc:

  ```
  db.categories.find( { path: /^,Books,/ } )
  ```

- Để tạo chỉ mục trên trường path, hãy sử dụng lệnh sau:

  ```
  db.categories.createIndex( { path: 1 } )
  ```

### Mô hình cây có tập hợp lồng nhau

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200911204252.svg)

```javascript
db.categories.insertMany([
  { _id: 'Books', parent: 0, left: 1, right: 12 },
  { _id: 'Programming', parent: 'Books', left: 2, right: 11 },
  { _id: 'Languages', parent: 'Programming', left: 3, right: 4 },
  { _id: 'Databases', parent: 'Programming', left: 5, right: 10 },
  { _id: 'MongoDB', parent: 'Databases', left: 6, right: 7 },
  { _id: 'dbm', parent: 'Databases', left: 8, right: 9 }
])
```

Có thể truy vấn để lấy các con cháu của một nút:

```javascript
var databaseCategory = db.categories.findOne({ _id: 'Databases' })
db.categories.find({
  left: { $gt: databaseCategory.left },
  right: { $lt: databaseCategory.right }
})
```

## Mẫu thiết kế

### Tài liệu lớn, nhiều cột, nhiều chỉ mục

Giải pháp là: Chuyển đổi từ cột sang hàng

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200919225901.png)

### Quản lý các phiên bản tài liệu khác nhau

Định dạng tài liệu MongoDB rất linh hoạt, điều này có thể gây khó khăn trong việc duy trì các phiên bản.

Giải pháp là: Có thể thêm một trường số phiên bản

- Nhanh chóng lọc bỏ các tài liệu không cần nâng cấp
- Khi nâng cấp, xử lý khác nhau cho các tài liệu có phiên bản khác nhau

### Thống kê lượt nhấp vào trang web

Yêu cầu độ chính xác của dữ liệu thống kê không quá quan trọng.

Giải pháp: Sử dụng tính toán gần đúng

Ghi lại sau mỗi 10 lần nhấp:

```json
{ "$inc": { "views": 1 } }
```

### Thống kê chính xác

Giải pháp: Sử dụng tổng hợp trước
