---
title: JS NaN
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# NaN

Giá trị của thuộc tính toàn cục **`NaN`** đại diện cho "Không phải là một số" (Not-A-Number).

| Thuộc tính      | Giá trị  |
| -------------- | ------- |
| `writable`     | `false` |
| `enumerable`   | `false` |
| `configurable` | `false` |

## Giải thích

- `NaN` là một thuộc tính của đối tượng toàn cục.
- Giá trị ban đầu của thuộc tính `NaN` là `NaN`, giống với giá trị của `Number.NaN`.
- Trong mã nguồn, hiếm khi ta sử dụng trực tiếp giá trị `NaN`. Thông thường, nó xuất hiện khi một phép tính trong `Math` thất bại (ví dụ: `Math.sqrt(-1)`) hoặc khi ta cố gắng chuyển đổi một chuỗi thành số nhưng không thành công (ví dụ: `parseInt('blabla')`).

Các trường hợp trả về `NaN`:

- Chia một số vô cùng cho một số vô cùng.
- Thực hiện phép tính toán với một số âm.
- Sử dụng toán tử số học với một hoặc nhiều toán hạng không phải là số hoặc không thể chuyển đổi thành số.
- Phân tích một chuỗi thành số.

## Ví dụ

### Kiểm tra giá trị

Không thể sử dụng toán tử so sánh bằng để kiểm tra một giá trị có phải là `NaN` hay không. Ta phải sử dụng hàm `Number.isNaN()` hoặc `isNaN()` để kiểm tra.

Trong phép so sánh tự so sánh, `NaN` là duy nhất không bằng chính nó.

```js
NaN === NaN;
//	false

Number.NaN === NaN;
// false

isNaN(NaN);
// true;

isNaN(Number.NaN);
// true;
```

```js
function valueIsNaN(v) {
  return v !== v;
}
valueIsNaN(1);
// false
valueIsNaN(NaN);
// true
valueIsNaN(Number.NaN);
// true
```

Trước khi sử dụng `isNaN()`, hãy kiểm tra giá trị đó có phải là kiểu số hay không để tránh vấn đề chuyển đổi kiểu ngầm định.

```js
function detectIsNaN(value) {
  return typeof value === 'number' && isNaN(value);
}
```
