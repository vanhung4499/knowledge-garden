---
title: JS While Statement
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Câu lệnh while

Câu lệnh **while** được sử dụng để lặp lại một đoạn mã cụ thể cho đến khi một biểu thức điều kiện trở thành false.

## Cú pháp

```js
while (expression) statement;
```

### Tham số

| Tham số       | Mô tả                                                                                                                              |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `expression`  | Một biểu thức điều kiện được đánh giá trước mỗi lần lặp. Nếu giá trị của biểu thức là true, câu lệnh sẽ được thực hiện. Nếu giá trị là false, vòng lặp sẽ kết thúc. |
| `statement`   | Một câu lệnh sẽ được lặp lại miễn là biểu thức điều kiện là true. Để thực hiện nhiều câu lệnh, có thể sử dụng khối `{}`.                   |

Lưu ý: Sử dụng câu lệnh `break` để dừng vòng lặp trước khi biểu thức điều kiện trở thành false.

## Ví dụ

### Ví dụ mã

```js
var i = 0;
while (i < 10) {
  i += 2;
}
```

```js
var cars = ['BMW', 'Volvo', 'Saab', 'Ford'];
var text = '';
var i = 0;
while (i < cars.length) {
  text += cars[i] + '<br>';
  i++;
}
```

### Giải thích

Trong ví dụ đầu tiên, biến `i` được khởi tạo với giá trị 0. Vòng lặp sẽ tiếp tục lặp lại cho đến khi giá trị của `i` lớn hơn hoặc bằng 10. Trong mỗi lần lặp, giá trị của `i` sẽ tăng lên 2. Khi giá trị của `i` đạt đến 10, biểu thức điều kiện `i < 10` trở thành false và vòng lặp kết thúc.

Trong ví dụ thứ hai, một mảng `cars` được khởi tạo với các phần tử là các tên xe. Biến `text` được khởi tạo với giá trị rỗng. Vòng lặp sẽ tiếp tục lặp lại cho đến khi biến `i` lớn hơn hoặc bằng độ dài của mảng `cars`. Trong mỗi lần lặp, tên của mỗi phần tử trong mảng `cars` sẽ được thêm vào biến `text`. Cuối cùng, biến `text` sẽ chứa tất cả các tên xe được nối với nhau và ngăn cách bằng thẻ `<br>`.
