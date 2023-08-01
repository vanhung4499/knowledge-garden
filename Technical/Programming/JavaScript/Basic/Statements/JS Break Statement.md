---
title: JS Break Statement
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Câu lệnh break

**Câu lệnh break** được sử dụng để thoát ngay lập tức khỏi vòng lặp nội bộ nhất hoặc câu lệnh switch.

## Cú pháp

```js
break [labelname];
```

### Tham số

| Tham số     | Mô tả                                                                                           |
| ----------- | ---------------------------------------------------------------------------------------------- |
| `labelname` | Tùy chọn, là một định danh liên quan đến nhãn câu lệnh. Nếu câu lệnh break không nằm trong một vòng lặp hoặc câu lệnh switch, thì tham số này là bắt buộc. |

- Câu lệnh `break` có thể chứa một nhãn tùy chọn, cho phép chương trình thoát khỏi một câu lệnh được gắn nhãn cụ thể. Điều này yêu cầu câu lệnh `break` được sử dụng bên trong câu lệnh tương ứng.
- Câu lệnh `break` không thể được sử dụng bên ngoài câu lệnh vòng lặp hoặc câu lệnh switch. Nếu sử dụng bên ngoài, sẽ gây ra lỗi cú pháp.

## Ví dụ

### Ví dụ mã

Sử dụng `break` trong câu lệnh `for`

```js
var num = 0;
for (var i = 1; i < 10; i++) {
  if (i % 5 == 0) {
    break;
  }
  num++;
}
console.log(num); // 4
```

### Câu lệnh switch

```js
var str = 'string', variable;

switch (str) {
    case 'number':
        variable = 'number';
        break;
    case 'string':
        variable = 'string';
        break;
    case 'boolean':
        variable = 'boolean';
}
```
