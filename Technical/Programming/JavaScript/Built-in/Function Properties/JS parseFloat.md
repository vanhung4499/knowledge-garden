---
title: JS parseFloat
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# parseFloat

Hàm `parseFloat()` được sử dụng để **chuyển đổi một chuỗi thành số thực và trả về kết quả**.

Hàm này thuộc về đối tượng `Global` và được hỗ trợ bởi tất cả các trình duyệt phổ biến.

## Cú pháp

```js
parseFloat(numberString);
```

| Tham số        | Kiểu dữ liệu | Mô tả                                |
| -------------- | ------------ | ----------------------------------- |
| `numberString` | Kiểu `String`| Chuỗi cần chuyển đổi thành số thực. |

- Hàm trả về số thực đã chuyển đổi, kiểu `number`.
  - Nếu chuỗi chỉ định chứa các ký tự không phải số, hàm `parseFloat()` sẽ chuyển đổi một phần của chuỗi (từ đầu chuỗi cho đến khi gặp ký tự không phải số) thành số thực.
  - Nếu chuỗi bắt đầu bằng ký tự không phải số, hàm sẽ trả về `NaN`.

## Ví dụ

- Trả về số bình thường

```js
parseFloat('3.14');
parseFloat('314e-2');
parseFloat('0.0314E+2');
parseFloat('3.14more non-digit characters');

// Tất cả đều trả về 3.14
```

- Trả về `NaN`

```js
parseFloat('MDN');
// NaN
parseFloat(null);
// NaN
parseFloat([]);
// NaN
parseFloat({});
// NaN
```
