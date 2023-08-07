---
title: JS encodeURI
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# encodeURI

Hàm `encodeURI()` được sử dụng để chuyển đổi một chuỗi URI thành một chuỗi đã được mã hóa theo định dạng escape sử dụng UTF-8.

Hàm này thuộc về đối tượng `Global` và được hỗ trợ bởi tất cả các trình duyệt phổ biến.

## Cú pháp

```js
encodeURI(URIString);
```

| Tham số       | Kiểu dữ liệu | Mô tả                        |
| ------------- | ------------ | --------------------------- |
| `URIString`   | Kiểu `String`| Chuỗi URI cần được mã hóa.   |

Hàm này trả về một chuỗi URI đã được mã hóa.

## Giải thích

Nếu bạn muốn giải mã một chuỗi URI đã được mã hóa bằng hàm `encodeURI()`, hãy sử dụng hàm `decodeURI()`.

Hàm `encodeURI()` không mã hóa các ký tự sau: 82 ký tự `!`, `#`, `$`, `'`, `(`, `)`, `*`, `+`, `,`, `-`, `.`, `/`, `:`, `;`, `=`, `?`, `@`, `_`, `~`, `0-9`, `a-z`, `A-Z`.

Nếu bạn chỉ muốn mã hóa một URI chứa các ký tự đặc biệt, URI này được sử dụng làm địa chỉ yêu cầu, hãy sử dụng hàm này.

Nếu bạn muốn truyền URI như một tham số yêu cầu, bạn có thể sử dụng hàm `encodeURIComponent()`. Hàm `encodeURIComponent()` sẽ mã hóa tất cả các ký tự.

## Ví dụ

```js
// URI ban đầu
var ftpUri = 'ftp://192.168.0.100/Ảnh';

// Mã hóa URI
var encodedFtpUri = encodeURI(ftpUri);
console.log(encodedFtpUri); // ftp://192.168.0.100/%E1%BA%A2nh

// Giải mã URI
var decodedFtpUri = decodeURI(encodedFtpUri);
console.log(decodedFtpUri); // ftp://192.168.0.100/Ảnh
```
