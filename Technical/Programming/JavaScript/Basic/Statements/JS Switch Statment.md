---
title: JS Switch Statment
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Câu lệnh switch

Câu lệnh `switch` cho phép chương trình đánh giá giá trị của một biểu thức và thử khớp giá trị của biểu thức với một nhãn `case`. Nếu khớp thành công, chương trình sẽ thực hiện các câu lệnh liên quan.

## Cú pháp

```js
switch (expression) {
   case value_1:
      statements_1
      [break;]
   case value_2:
      statements_2
      [break;]
   ...
   default:
      statements_def
      [break;]
}
```

Cách hoạt động: Đầu tiên, đặt biểu thức `expression` (thường là một biến). Sau đó, giá trị của biểu thức sẽ được so sánh với giá trị của mỗi nhãn `case` trong cấu trúc. Nếu có sự khớp, các khối mã liên quan đến nhãn `case` đó sẽ được thực thi. Sử dụng từ khóa `break` để ngăn chặn việc chương trình tự động chạy tiếp vào nhãn `case` tiếp theo.

### Tham số

| Tham số           | Mô tả                         |
| ----------------- | ---------------------------- |
| `expression`      | Biểu thức để so sánh         |
| `value_(n)`       | Giá trị để so sánh với biểu thức |
| `statement(n)`    | Câu lệnh được thực thi        |

### Từ khóa

- `case`: Đại diện cho một trường hợp, nếu `expression` bằng `value`, thì `statement` tương ứng sẽ được thực thi.
- `break`: Dùng để thoát khỏi câu lệnh `switch`, nếu không có từ khóa `break`, chương trình sẽ tiếp tục chạy vào nhãn `case` tiếp theo.
- `default`: Xác định hành động khi giá trị của biểu thức không khớp với bất kỳ trường hợp nào (thực tế, nó tương đương với mệnh đề `else`).

## Ví dụ

```js
var myCar = 'Porsche'
switch (myCar) {
  case 'Nissan': alert("Xe của tôi là Nissan");
    break;
  case 'Honda': alert("Xe của tôi là Honda");
    break;
  case 'Porsche': alert("Xe của tôi là Porsche");
    break;
  default: alert("Tôi không có xe");
}
```

Kết quả: "Xe của tôi là Porsche" sẽ được hiển thị trên màn hình.
