---
title: JS decodeURI
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# decodeURI

Hàm `decodeURI()` được sử dụng để giải mã một chuỗi đã được mã hóa của định danh tài nguyên thống nhất (URI) và trả về chuỗi không mã hóa.

Hàm này thuộc về đối tượng `Global` và được hỗ trợ bởi tất cả các trình duyệt phổ biến.

## Cú pháp

```js
decodeURI(encodedURIString);
```

| Tham số               | Kiểu dữ liệu | Mô tả                                |
| --------------------- | ------------ | ----------------------------------- |
| `encodedURIString`    | Kiểu `String`| Chuỗi URI đã được mã hóa cần giải mã.|

Hàm này trả về một chuỗi URI đã được giải mã.

## Giải thích

Hàm `decodeURI()` sẽ chuyển đổi tất cả các chuỗi đã được mã hóa trong URI thành các ký tự gốc tương ứng. Tuy nhiên, nó không thể giải mã các ký tự không được mã hóa bởi hàm `encodeURI` (ví dụ: `#`).

## Ví dụ

```js
let a = 'Hello JavaScript!';
let b = encodeURI(a);

console.log(b);
// 'Hello%20JavaScript!'

let c = decodeURI(b);
// 'Hello JavaScript!'
```
