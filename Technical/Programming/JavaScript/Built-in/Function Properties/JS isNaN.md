---
title: JS isNaN
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# isNaN

Hàm `isNaN()` được sử dụng để kiểm tra xem một số cụ thể có phải là giá trị không phải là số `NaN` hay không.

Hàm này thuộc về đối tượng `Global` và được hỗ trợ bởi tất cả các trình duyệt phổ biến.

## Cú pháp

```js
isNaN(number);
```

| Tham số   | Kiểu dữ liệu | Mô tả             |
| --------- | ------------ | ---------------- |
| `number`  | Kiểu `Number` | Giá trị cần kiểm tra |

⚠️ **Lưu ý**: Nếu tham số `number` không phải là kiểu `Number`, hàm `isNaN()` sẽ chuyển đổi nó thành kiểu `Number` trước khi kiểm tra. Đa số các kiểu dữ liệu khác không thể chuyển đổi thành kiểu `Number`, kết quả chuyển đổi sẽ là `NaN`, và hàm `isNaN()` sẽ trả về `true`.

- Giá trị trả về của hàm `isNaN()` là kiểu `Boolean`.
  - Nếu số được chỉ định là `NaN`, hàm trả về `true`.
  - Nếu số được chỉ định không phải là `NaN`, hàm trả về `false`.

## Giải thích

- Thông thường, hàm này được sử dụng để kiểm tra kết quả trả về từ hàm `parseInt()` và `parseFloat()`.
- Khi chuyển đổi các giá trị không thể chuyển đổi thành kiểu số sang kiểu số, kết quả chuyển đổi sẽ là `NaN`.
- `NaN` không thể được so sánh bằng toán tử so sánh bằng (` == `), vì `NaN` là duy nhất không bằng chính nó.

## Ví dụ

```js
isNaN(NaN);
// true
isNaN(undefined);
// true
isNaN({});
// true

isNaN(true);
// false
isNaN(null);
// false
isNaN(37);
// false

// Chuỗi
isNaN('37');
// false: Có thể chuyển đổi thành số 37
isNaN('37.37');
// false: Có thể chuyển đổi thành số 37.37
isNaN('');
// false: Chuỗi rỗng được chuyển đổi thành số 0
isNaN(' ');
// false: Chuỗi chứa khoảng trắng được chuyển đổi thành số 0

// Ngày tháng
isNaN(new Date());
// false
isNaN(new Date().toString());
// true

isNaN('blabla');
// true: "blabla" không thể chuyển đổi thành số
```
