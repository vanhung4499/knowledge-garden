---
title: JS Error
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# Error

Đối tượng `Error` là một đối tượng tích hợp sẵn để tạo ra một đối tượng ngoại lệ, được ném ra khi xảy ra lỗi trong quá trình thực thi. Đối tượng Error cũng có thể được sử dụng làm cơ sở cho các đối tượng ngoại lệ do người dùng tự định nghĩa.

## Cú pháp

```js
new Error([ message ][, fileName[, lineNumber]])
```

| Tham số     | Mô tả                                                         | Kiểu dữ liệu |
| ----------- | ------------------------------------------------------------ | ------------ |
| message     | Tham số tùy chọn. Mô tả lỗi                                    | string       |
| fileName    | Tham số tùy chọn. Tên tệp mà đoạn mã gọi đến hàm tạo Error      | string       |
| lineNumber  | Tham số tùy chọn. Số dòng trong tệp mà đoạn mã gọi đến hàm tạo Error | number       |

## Các loại

Ngoài hàm tạo Error chung, còn có 6 hàm tạo ngoại lệ khác.

- `EvalError`: Được sử dụng để đại diện cho các ngoại lệ liên quan đến [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)
- `InternalError`: Được sử dụng để đại diện cho các ngoại lệ lỗi nội bộ của trình thông dịch JavaScript. Ví dụ: "Quá nhiều đệ quy".
- `RangeError`: Được sử dụng để đại diện cho các ngoại lệ khi giá trị biến hoặc tham số **vượt quá phạm vi hợp lệ** của nó
- `ReferenceError`: Được sử dụng để đại diện cho các ngoại lệ **tham chiếu không hợp lệ**
- `SyntaxError`: Được sử dụng để đại diện cho các ngoại lệ **lỗi cú pháp** xảy ra trong quá trình phân tích mã bằng [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)
- `TypeError`: Được sử dụng để đại diện cho các ngoại lệ khi biến hoặc tham số **không thuộc loại hợp lệ**
- `URIError`: Được sử dụng để đại diện cho các ngoại lệ khi tham số được truyền cho [`encodeURI()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI) hoặc [`decodeURl()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI) là **không hợp lệ**

## Ví dụ

Thường thì chúng ta sử dụng từ khóa `throw` để ném ra đối tượng Error mà bạn tạo ra.

```js
try {
  throw new Error('Whoops!');
} catch (e) {
  console.log(e.name + ': ' + e.message);
}
```

Bạn có thể xử lý các loại ngoại lệ cụ thể bằng cách kiểm tra kiểu ngoại lệ, sử dụng thuộc tính `constructor` và từ khóa `instanceof`.

```js
const a = RangeError('throw Error');

console.log(a instanceof RangeError);
// true
```
