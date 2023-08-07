---
title: JS decodeURIComponent
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# decodeURIComponent

Hàm `decodeURIComponent()` được sử dụng để giải mã một thành phần đã được mã hóa của định danh tài nguyên thống nhất (URI) và trả về chuỗi không mã hóa.

Hàm này thuộc về đối tượng `Global` và được hỗ trợ bởi tất cả các trình duyệt phổ biến.

## Cú pháp

```js
decodeURIComponent(encodedURIString);
```

| Tham số               | Kiểu dữ liệu | Mô tả                                |
| --------------------- | ------------ | ----------------------------------- |
| `encodedURIString`    | Kiểu `String`| Chuỗi URI đã được mã hóa cần giải mã.|

Hàm này trả về một chuỗi URI đã được giải mã.

## Giải thích

Hàm `decodeURIComponent()` sẽ chuyển đổi tất cả các chuỗi đã được mã hóa trong thành phần URI thành các ký tự gốc tương ứng. Nếu chuỗi không hợp lệ, hàm sẽ gây ra lỗi `URIError`.

## Ví dụ

```js
var a = 'Hello JavaScript';
var b = encodeURIComponent(a);

console.log(b);
// 'Hello%20JavaScript'

var c = decodeURIComponent(b);
console.log(c);
// 'Hello JavaScript'
```
