---
title: JS Memorize Function
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Hàm ghi nhớ - Function Memoization

**Hàm ghi nhớ (Function Memoization)**: Lưu trữ kết quả tính toán của lần trước, khi gọi lại với cùng các tham số, chỉ cần trả về kết quả đã lưu trữ.

Nguyên lý hoạt động: Lưu trữ các tham số và kết quả tương ứng trong một đối tượng, khi gọi lại hàm với các tham số tương tự, kiểm tra xem khóa đã tồn tại trong đối tượng hay chưa, nếu tồn tại thì trả về kết quả đã lưu trữ.

```js
function memorize() {
  const cache = {};
  return function() {
    const key = Array.prototype.call(arguments, ',');
    if (key in cache) {
      return cache[key];
    }
    return (cache[key] = fn.apply(this, arguments));
  };
}
```
