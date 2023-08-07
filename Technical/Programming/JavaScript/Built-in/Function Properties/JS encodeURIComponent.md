---
title: JS encodeURIComponent
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# encodeURIComponent

Hàm `encodeURIComponent()` được sử dụng để mã hóa các thành phần hợp lệ của định danh tài nguyên thống nhất (URI) và trả về chuỗi đã được mã hóa.

Hàm này thuộc về đối tượng `Global` và được hỗ trợ bởi tất cả các trình duyệt phổ biến.

## Cú pháp

```js
encodeURIComponent(URIString);
```

| Tham số       | Kiểu dữ liệu | Mô tả                                           |
| ------------- | ------------ | ---------------------------------------------- |
| `URIString`   | Kiểu `String`| Chuỗi thành phần URI cần được mã hóa.           |

Hàm này trả về một chuỗi đã được mã hóa.

## Giải thích

- Nếu bạn muốn giải mã một chuỗi thành phần URI đã được mã hóa bằng hàm `encodeURIComponent()`, hãy sử dụng hàm `decodeURIComponent()`.
- Hàm `encodeURIComponent()` sẽ mã hóa tất cả các ký tự. Nếu bạn muốn mã hóa một URI chứa các ký tự đặc biệt (ví dụ: tiếng Trung), URI này được sử dụng làm tham số yêu cầu, hãy sử dụng hàm này. Nếu bạn chỉ muốn mã hóa một URI với các ký tự đặc biệt để sử dụng làm địa chỉ yêu cầu, hãy sử dụng hàm `encodeURI()`.

## Ví dụ

### Ví dụ code

```js
// Chuỗi thành phần URI gốc
var origin = 'ftp://192.168.0.100/Ảnh';

// Mã hóa chuỗi thành phần URI
var encodedUri = encodeURIComponent(origin);
console.log(encodedUri); // ftp%3A%2F%2F192.168.0.100%2F%E1%BA%A2nh

// Giải mã chuỗi thành phần URI
var decodedUri = decodeURIComponent(encodedUri);
console.log(decodedUri); // ftp://192.168.0.100/Ảnh
```
