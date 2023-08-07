---
title: JS Infinity
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# Infinity

Thuộc tính toàn cục `Infinity` là một giá trị số, đại diện cho vô cùng.

Thuộc tính của `Infinity`

| Thuộc tính      | Giá trị  |
| :------------- | :------ |
| `writable`     | `false` |
| `enumerable`   | `false` |
| `configurable` | `false` |

## Giải thích

- `Infinity` là một thuộc tính của đối tượng toàn cục, nghĩa là nó là một biến toàn cục.
- Giá trị ban đầu của `Infinity` là [`Number.POSITIVE_INFINITY`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/POSITIVE_INFINITY).

`Infinity` lớn hơn bất kỳ giá trị nào. Giá trị này tương tự với ý nghĩa vô cùng trong toán học, ví dụ như tích của bất kỳ giá trị dương nào với `Infinity` đều bằng `Infinity`, phép chia bất kỳ giá trị nào (ngoại trừ `Infinity` và `-Infinity`) cho `Infinity` đều bằng 0.

## Ví dụ

🌰 **Ví dụ code**:

```js
console.log(Infinity);
// Infinity
console.log(Infinity + 1);
// Infinity
console.log(Math.pow(10, 1000));
// Infinity
console.log(Math.log(0));
// Infinity
console.log(1 / Infinity);
// 0
```
