---
title: JS For Statement
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Câu lệnh for

Câu lệnh **for** cũng là một loại vòng lặp kiểm tra trước, nhưng nó có khả năng khởi tạo biến và định nghĩa mã sẽ được thực hiện sau khi vòng lặp kết thúc.

## Cú pháp

```js
for (initialization; expression; post-loop-expression) {
  // statement
}
```

Tham số:

- `initialization` là biểu thức khởi tạo: Thường là biểu thức khởi tạo một hoặc nhiều biến đếm (biến), nhưng cú pháp cho phép một biểu thức phức tạp bất kỳ, thường là một câu lệnh gán (chỉ được thực hiện một lần trước khi vòng lặp bắt đầu).
- `expression` là biểu thức kiểm tra điều kiện: Được kiểm tra trước mỗi lần lặp để xác định xem có thực hiện câu lệnh lặp hay không. Nếu giá trị của biểu thức là true, câu lệnh lặp sẽ được thực hiện. Nếu giá trị là false, vòng lặp sẽ kết thúc và chương trình tiếp tục với câu lệnh tiếp theo sau vòng lặp.
- `post-loop-expression` là biểu thức cập nhật biến đếm: Được thực hiện sau khi câu lệnh lặp được thực hiện, để cập nhật biến đếm (biến) và chuẩn bị cho lần lặp tiếp theo.
- `statement` là câu lệnh lặp: Là câu lệnh được thực hiện khi điều kiện lặp đúng. Sau khi câu lệnh lặp được thực hiện, biểu thức cập nhật biến đếm sẽ được thực hiện (trừ khi sử dụng câu lệnh `break` hoặc `continue`).

## Thực hành tốt nhất

### Ví dụ mã

```js
var count = 10;

for (let i = 0; i < count; i++) {
  console.log(i);
}
```

### Lặp từ cuối lên đầu

### Lặp theo bội số của một số

```js
// Số có 5 chữ số
const num = 99999;

for (let i = 1; i < num; i *= 10) {
  // Số bị chia num
  // Số chia
  const divisor = i * 10;
  // Phần nguyên
  const divided = Math.floor(num / divisor);
  // Số dư
  const remainder = num % divisor;

  console.log(i, divisor);
  //    i       divisor
  // 1. 1       10
  // 2. 10      100
  // 3. 100     1000
  // 4. 1000    10000
  // 5. 10000   100000
}
```

### Lặp với nhiều biến

```js
for (let i = 0, j = 10; i < 10; i++, j--) {
  sum += i * j;
}
```

Nếu bạn muốn thay đổi nhiều biến trong một lần lặp, bạn phải sử dụng toán tử dấu phẩy để kết hợp biểu thức khởi tạo và biểu thức tăng giảm vào một biểu thức duy nhất để sử dụng trong vòng lặp `for`.

### Biểu thức có thể bỏ qua

```js
function tail(o) {
  // Trả về đối tượng cuối cùng trong danh sách liên kết
  for (; o.next; o = o.next /* empty */);
  return; // Thực hiện lặp qua việc kiểm tra o.next là một giá trị đúng
}
```

Trong biến đếm vòng lặp, thường là số và là phổ biến nhất, nhưng không bắt buộc. Bất kỳ biểu thức nào trong ba biểu thức của vòng lặp `for` cũng có thể bị bỏ qua, nhưng hai dấu chấm phẩy là bắt buộc. Nếu không có biểu thức, điều này sẽ tạo thành một vòng lặp vô hạn, tương tự như `while(true)`, một cách khác để tạo vòng lặp vô hạn là `for(;;)`.
