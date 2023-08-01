---
title: JS Update Expressions
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Biểu thức cập nhật

Biểu thức cập nhật bao gồm **toán tử tăng/giảm trước** và **toán tử tăng/giảm sau**.

## Ví dụ

### Tăng trước

Toán tử tăng trước: tăng giá trị trước, sau đó gán giá trị

```js
let n = 10;

// Tăng trước
const res = ++n;

console.log(n);
// 11
console.log(res);
// 11
```

### Giảm trước

Toán tử giảm trước: giảm giá trị trước, sau đó gán giá trị

```js
let n = 10;

// Giảm trước
const res = --n;

console.log(res);
// 9
console.log(n);
// 9
```

### Tăng sau

Toán tử tăng sau: gán giá trị trước, sau đó tăng giá trị

```js
let n = 10;

// Tăng sau
const res = n++;

console.log(res);
// 10
console.log(n);
// 11
```

### Giảm sau

Toán tử giảm sau: gán giá trị trước, sau đó giảm giá trị

```js
let n = 10;

// Giảm sau
const res = n--;

console.log(res);
// 10
console.log(n);
// 9
```

## So sánh và khác biệt

Toán tử tăng/giảm trước và tăng/giảm sau có những điểm tương đồng và khác biệt:

- **Tương đồng**: Đối với biến, không có sự khác biệt giữa toán tử tăng/giảm trước và toán tử tăng/giảm sau, cả hai đều tăng/giảm giá trị của biến lên 1 đơn vị.
- **Khác biệt**:
  - Toán tử tăng/giảm trước: Tăng/giảm giá trị của biến trước (biến chính nó), sau đó gán giá trị (gán giá trị của biến cho kết quả của biểu thức tăng/giảm).
  - Toán tử tăng/giảm sau: Gán giá trị trước, sau đó tăng/giảm giá trị của biến.

> Tại sao toán tử tăng/giảm sau có mức độ ưu tiên cao nhưng lại thực hiện sau?

Toán tử tăng/giảm trước trả về giá trị đã tăng/giảm 1, do đó trả về chính đối tượng ban đầu, đây là một giá trị trái (ví dụ: `++i`, tăng trước sau đó thực hiện).

Toán tử tăng/giảm sau trả về giá trị gốc của toán hạng, sau đó tăng/giảm giá trị của nó lên 1, nhưng giá trị gốc của toán hạng được trả về là kết quả của biểu thức (có thể hiểu là `i++` thực hiện trước, sau đó tăng). Trên thực tế, vì toán tử tăng/giảm sau có mức độ ưu tiên cao, nó sẽ được thực hiện trước, nhưng trước khi tăng/giảm, nó sẽ tạo ra một bản sao để lưu giữ giá trị gốc của toán hạng, sau đó trả về giá trị của bản sao cho biểu thức.

Lưu ý: Chỉ sử dụng toán tử tăng/giảm sau khi cần thiết, hãy cố gắng sử dụng toán tử tăng/giảm trước. Bởi vì toán tử tăng/giảm trước thực hiện ít công việc hơn, trong khi toán tử tăng/giảm sau phải lưu giữ giá trị gốc của toán hạng, đối với các đối tượng kiểu int và con trỏ, trình biên dịch sẽ tối ưu công việc này, nhưng đối với các loại trình lặp phức tạp hơn, công việc bổ sung này có thể tốn nhiều chi phí hơn.
