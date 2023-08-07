---
title: JS isFinte
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# isFinite

Hàm `isFinite()` được sử dụng để kiểm tra xem một số cụ thể có phải là giá trị hữu hạn hay không. Nếu số được chỉ định là `NaN`, `Infinity`, hoặc `-Infinity`, hàm sẽ trả về `false`, trong trường hợp khác, hàm sẽ trả về `true`.

Hàm này thuộc về đối tượng `Global` và được hỗ trợ bởi tất cả các trình duyệt phổ biến.

## Cú pháp

```js
isFinite(number);
```

| Tham số   | Kiểu dữ liệu | Mô tả             |
| --------- | ------------ | ---------------- |
| `number`  | Kiểu `Number` | Giá trị cần kiểm tra |

Nếu tham số `number` không phải là kiểu `Number` (ví dụ: chuỗi, hàm, v.v.), hàm sẽ trả về `false`.

Giá trị trả về của hàm `isFinite()` là kiểu `Boolean`.

- Khi số được chỉ định là `NaN`, dương vô cùng (`Infinity`), hoặc âm vô cùng (`-Infinity`), hàm trả về `false`.
- Trong các trường hợp khác, hàm trả về `true`.

## Ví dụ

```js
// Trường hợp trả về false
isFinite(NaN);
// false
isFinite(Infinity);
// false
isFinite(-Infinity);
// false

// Trường hợp trả về true
isFinite(0);
// true
isFinite(2e64);
// true
isFinite('0');
// true

// Trường hợp đặc biệt
Number.isFinite(null);
// false
Number.isFinite('0');
// false
```

So với hàm `isFinite()` toàn cục, `Number.isFinite()` không ép buộc một tham số không phải là số thành số, điều này có nghĩa là chỉ có giá trị kiểu số và hữu hạn mới trả về `true`.
