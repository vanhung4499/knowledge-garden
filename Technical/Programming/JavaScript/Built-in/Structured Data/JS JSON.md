---
title: JS JSON
tags: [js, programming, json]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# JSON

JSON là viết tắt của JavaScript Object Notation (Cú pháp đối tượng JavaScript), là một cú pháp nhẹ được sử dụng để lưu trữ và trao đổi thông tin văn bản. Nó được thiết kế để trao đổi dữ liệu đọc được.

JSON phát triển từ ngôn ngữ kịch bản JavaScript và sử dụng cú pháp JavaScript để mô tả đối tượng dữ liệu. Định dạng JSON chỉ là một văn bản đơn giản và độc lập với ngôn ngữ và nền tảng. Trình phân tích JSON và thư viện JSON hỗ trợ nhiều ngôn ngữ lập trình khác nhau. Hiện nay, nhiều ngôn ngữ lập trình động (PHP, JSP, .NET) đều hỗ trợ JSON.

Định dạng JSON có thể được sử dụng để tuần tự hóa và truyền dữ liệu có cấu trúc qua kết nối mạng, được sử dụng để viết ứng dụng dựa trên JavaScript, bao gồm các tiện ích mở rộng trình duyệt và trang web. JSON chủ yếu được sử dụng để truyền dữ liệu giữa máy chủ và ứng dụng web, các dịch vụ web và API có thể sử dụng định dạng JSON để cung cấp dữ liệu công khai, và nó cũng có thể được sử dụng trong các ngôn ngữ lập trình hiện đại.

## Cú pháp

Cú pháp JSON là một phần con của cú pháp đối tượng JavaScript.

- Dữ liệu được biểu diễn bằng cặp key/value.
- Dữ liệu được phân tách bằng dấu phẩy.
- Đối tượng được lưu trữ trong dấu ngoặc nhọn, mỗi tên sau đó là dấu hai chấm, các cặp key/value được phân tách bằng dấu phẩy.
- Mảng được lưu trữ trong dấu ngoặc vuông, các giá trị mảng được phân tách bằng dấu phẩy.

```js
{
    "book": [
        {
            "id":1562366,
            "price": 21.5,
            "isPromotion": true,
            "language": "Java",
            "edition": "third",
            "author": "Herbert Schildt",
        },
        {
            "id":"07",
            "language": "C++",
            "edition": "second",
            "author": "E.Balagurusamy"
        }
    ]
}
```

### Cặp key/value JSON

Định dạng dữ liệu JSON là: cặp key/value.

Cặp key/value bao gồm tên trường (nằm trong dấu nháy kép), sau đó là dấu hai chấm, và sau đó là giá trị:

```json
{ "firstName":"John", "lastName":"Doe" }
```

Tương đương với câu lệnh JavaScript sau:

```js
{ firstName = "John", lastName = "Doe"}
```

Giá trị JSON cho phép các kiểu dữ liệu JavaScript sau:

- Số (số nguyên hoặc số thực)
- Chuỗi (nằm trong dấu nháy kép)
- Giá trị logic (true hoặc false)
- Mảng (nằm trong dấu ngoặc vuông)
- Đối tượng (nằm trong dấu ngoặc nhọn)
- null

**Lưu ý: JSON không hỗ trợ giá trị đặc biệt `undefined` trong JavaScript.**

### Đối tượng JSON

**Chuỗi JSON**

```js
let person = {
  name: 'xianyu',
  age: 24,
  love: 'Online Game',
};
```

Từ ví dụ trên, chúng ta có thể thấy đây là một đối tượng được biểu diễn bằng chuỗi JSON, vì JSON chính là một dạng cú pháp của JavaScript và đối tượng JavaScript được biểu diễn bằng chuỗi JSON cũng có định dạng tương tự.

**Sự khác biệt với đối tượng JavaScript**

- JSON không có khái niệm biến (không cần khai báo biến)
- JSON không có dấu chấm phẩy ở cuối (vì không phải là câu lệnh JavaScript nên không cần dấu chấm phẩy)
- Giá trị thuộc tính của đối tượng JSON phải được bao bọc bởi dấu nháy kép

```js
// JavaScript
let person = {
    "name": "Nicholas",
    "age": 29
}

// JSON
{
    "name": "Nicholas",
    "age": 29
}
```

- Giá trị thuộc tính của JSON có thể là giá trị đơn giản hoặc giá trị phức tạp (do đó có thể nhúng đối tượng trong đối tượng như ví dụ dưới đây).

```js
{
    "name": "Nicolas",
    "age": 29,
    "school": {
        "name": "Merrimack College",
        "location": "North Andover, MA"
    }
}
```

**Lưu ý: Một đối tượng không nên có hai thuộc tính cùng tên trong JSON.**

### Mảng JSON

Mảng JSON sử dụng cú pháp mảng trong JavaScript.

```js
let values = [25, 'hi', true];
```

Mảng JSON cũng không có biến và dấu chấm phẩy. Kết hợp mảng với đối tượng, chúng ta có thể tạo ra các tập hợp dữ liệu phức tạp hơn.

```js
[
  {
    title: 'Professional JavaScript',
    authors: ['Nicholas C. Zakas'],
    edition: 3,
    year: 2011,
  },
  {
    title: 'Professional JavaScript',
    authors: ['Nicholas C. Zakas'],
    edition: 3,
    year: 2009,
  },
  {
    title: 'Professional JavaScript',
    authors: ['Nicholas C. Zakas'],
    edition: 3,
    year: 2008,
  },
];
```

## Phương thức

| Phương thức           | Mô tả                                                                                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `JSON.stringify()`   | Dùng để phân tích chuỗi JSON và tạo ra giá trị hoặc đối tượng JavaScript dựa trên chuỗi đó. Cung cấp một hàm `reviver` tùy chọn để biến đổi (thay đổi) đối tượng trước khi trả về. |
| `JSON.parse()`       | Chuyển đổi một giá trị JavaScript (đối tượng hoặc mảng) thành một chuỗi JSON. Nếu chỉ định `replace` là một hàm, nó có thể thay thế giá trị hoặc nếu chỉ định `replacer` là một mảng, chỉ bao gồm các thuộc tính được chỉ định. |

## Tệp JSON

Loại tệp của tệp JSON là `.json`

Loại MIME của văn bản JSON là `application/json`
