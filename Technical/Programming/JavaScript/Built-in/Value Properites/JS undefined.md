---
title: JS undefined
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# undefined

Thuộc tính `undefined` là một giá trị đặc biệt. Nếu một biến đã được khai báo nhưng chưa được khởi tạo, giá trị của nó sẽ là `undefined`.

Thuộc tính này là một thuộc tính chỉ đọc (chính xác hơn, là một hằng số) của đối tượng `Global`. Tất cả các trình duyệt phổ biến đều hỗ trợ thuộc tính này.

| Thuộc tính      | Giá trị  |
| -------------- | ------- |
| `writable`     | `false` |
| `enumerable`   | `false` |
| `configurable` | `false` |

## Giải thích

Nếu một biến chưa được khởi tạo, giá trị của nó sẽ là `undefined`. Nếu một hàm không có giá trị trả về, giá trị trả về mặc định của nó sẽ là `undefined`.

## Ví dụ

```js
let x;
if (x === undefined) {
  // these statements execute
} else {
  // these statements do not execute
}

```
