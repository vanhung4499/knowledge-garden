---
title: JS Do While Statement
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Câu lệnh do…while

Câu lệnh **do…while** tạo ra một vòng lặp thực hiện các câu lệnh chỉ định cho đến khi giá trị của `condition` là false. Câu lệnh `statement` được thực hiện trước khi kiểm tra `condition`, do đó ít nhất một lần `statement` sẽ được thực hiện.

## Cú pháp

```js
do {
  statement;
} while (expression);
```

### Tham số

| Tham số       | Mô tả                                                                                                                                           |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `statement`   | Các câu lệnh được thực hiện ít nhất một lần và được lặp lại mỗi khi giá trị của `condition` là true. Để thực hiện nhiều câu lệnh, có thể sử dụng khối `{}`. |
| `expression`  | Một biểu thức được tính toán trong mỗi lần lặp. Nếu giá trị của `condition` là true, `statement` sẽ được thực hiện lại. Khi giá trị là false, vòng lặp kết thúc. |

### Mô tả

- Câu lệnh `do…while` được sử dụng khi bạn muốn thực hiện một đoạn mã ít nhất một lần trong vòng lặp.
- Vòng lặp `do/while` có hai điểm khác biệt cú pháp so với vòng lặp `while` thông thường.
  - Vòng lặp `do` yêu cầu sử dụng từ khóa `do` để đánh dấu bắt đầu vòng lặp và từ khóa `while` để đánh dấu cuối vòng lặp và kiểm tra điều kiện.
  - Khác với vòng lặp `while`, vòng lặp `do` kết thúc bằng dấu chấm phẩy.
  - Nếu thân vòng lặp `while` được bao bọc trong dấu ngoặc nhọn `{}`, thì không cần sử dụng dấu chấm phẩy để kết thúc vòng lặp.

## Ví dụ

### Ví dụ mã

```js
var i = 0;
do {
  i += 2;
} while (i < 10);

console.log(i); // 10
```

### Giải thích

Trong ví dụ này, biến `i` được khởi tạo với giá trị 0. Sau đó, câu lệnh `do` được thực hiện, tăng giá trị của `i` lên 2. Sau mỗi lần lặp, giá trị của `i` được kiểm tra. Nếu giá trị của `i` nhỏ hơn 10, vòng lặp sẽ tiếp tục thực hiện lại câu lệnh `do`. Khi giá trị của `i` đạt đến 10, điều kiện `i < 10` trở thành false và vòng lặp kết thúc. Kết quả cuối cùng là giá trị của `i` là 10.
