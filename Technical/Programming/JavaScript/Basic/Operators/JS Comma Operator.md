---
title: JS Comma Operator
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Toán tử dấu phẩy

**Toán tử dấu phẩy** là một **toán tử hai ngôi**, các toán hạng của nó có thể là bất kỳ kiểu dữ liệu nào.

Nó tính toán toán hạng bên trái trước, sau đó tính toán toán hạng bên phải, và cuối cùng trả về giá trị của toán hạng bên phải. Toán tử dấu phẩy cho phép thực hiện nhiều phép tính trong một câu lệnh.

```js
(x = 0), (y = 1), (z = 2);
```

```js
// Kết quả là 2, tương đương với đoạn mã dưới đây
x = 0;
y = 1;
z = 2;
```

## Cách sử dụng

### Sử dụng để khai báo nhiều biến

```js
var a = 1,
  b = 2,
  c = 3;

let x, y, z;
```

Toán tử dấu phẩy thường được sử dụng trong vòng lặp `for`, vòng lặp này thường có nhiều biến lặp:

```js
// Dấu phẩy đầu tiên là một phần của câu lệnh var
// Dấu phẩy thứ hai là toán tử dấu phẩy
// Nó cho phép đặt hai biểu thức (i++ và j--) trong một câu lệnh
for (var i = 0, j = 10; i < j; i++, j--) {
  console.log(i + j);
}
```

### Sử dụng để gán giá trị

Toán tử dấu phẩy cũng có thể được sử dụng để gán giá trị, khi được sử dụng để gán giá trị, toán tử dấu phẩy luôn trả về giá trị của biểu thức cuối cùng trong danh sách.

```js
var foo = (1, 2, 3, 4, 5);
// Nếu bỏ dấu ngoặc sẽ gây lỗi

console.log(foo);
// 5
```
