---
title: JS For-In Statement
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Câu lệnh for…in

Câu lệnh **for…in** được sử dụng để lặp qua các thuộc tính của một mảng hoặc một đối tượng (thực hiện vòng lặp qua các thuộc tính của một mảng hoặc đối tượng).

## Cú pháp

```js
for (property in expression) {
  statement;
}
```

### Tham số

| Tham số       | Kiểu dữ liệu | Mô tả                                                                                                 |
| ------------- | ------------ | ---------------------------------------------------------------------------------------------------- |
| `property`    | Bất kỳ        | Mỗi lần lặp, một tên thuộc tính khác nhau được gán cho biến này.                                       |
| `expression`  | Kiểu Object  | Đối tượng mà các thuộc tính của nó sẽ được liệt kê.                                                     |
| `statement`   | -            | Mã được thực thi trong mỗi lần lặp.                                                                   |

### Mô tả

- Vòng lặp `for…in` chỉ lặp qua các thuộc tính có thể liệt kê. Vòng lặp sẽ lặp qua tất cả các thuộc tính có thể liệt kê của đối tượng chính nó và các thuộc tính được kế thừa từ nguyên mẫu của nó (thuộc tính gần nhất trong chuỗi nguyên mẫu sẽ ghi đè lên thuộc tính trong nguyên mẫu).
- `for…in` không nên được sử dụng để lặp qua một mảng với thứ tự quan trọng. Chỉ số mảng chỉ là một thuộc tính liệt kê có tên số nguyên và tương tự với các thuộc tính đối tượng thông thường. Không thể đảm bảo `for…in` sẽ trả về các chỉ số theo bất kỳ thứ tự cụ thể nào. Để lặp qua các phần tử của một mảng theo thứ tự, hãy sử dụng vòng lặp `for` thông thường (hoặc sử dụng `Array.prototype.forEach()` hoặc vòng lặp `for…of`).
- Các thuộc tính của đối tượng không có thứ tự cụ thể, do đó thứ tự các thuộc tính được trả về bởi vòng lặp `for…in` là không thể đoán trước. Cụ thể, tất cả các thuộc tính có thể liệt kê sẽ được trả về một lần, nhưng thứ tự trả về có thể khác nhau tùy thuộc vào trình duyệt.
- Nếu giá trị của đối tượng được lặp qua là `null` hoặc `undefined`, câu lệnh `for…in` sẽ không gây ra lỗi và không thực hiện mã lặp (điều này chỉ áp dụng cho phiên bản ECMAScript 5 trở lên). Để đảm bảo tính tương thích tối đa, nên kiểm tra giá trị của đối tượng trước khi sử dụng `for…in`.

## Ví dụ

### Ví dụ mã

```js
for (var propName in window) {
  console.log(propName);
}
```

### Trích xuất các thuộc tính riêng của đối tượng

```js
var seat = { a: 1, b: 2, c: 3 };

function Car() {
  this.color = 'red';
}

Car.prototype = seat;

var lamborghini = new Car();

// Vòng lặp for...in
for (var prop in lamborghini) {
  if (lamborghini.hasOwnProperty(prop)) {
    console.log(`lamborghini.${prop} = ${lamborghini[prop]}`);
  }
}

// Kết quả:
// "lamborghini.color = red"
```

Trong ví dụ này, đối tượng `lamborghini` được tạo từ hàm tạo `Car`. Đối tượng `Car` có một thuộc tính riêng là `color` và kế thừa các thuộc tính từ đối tượng `seat`. Vòng lặp `for…in` được sử dụng để lặp qua các thuộc tính của `lamborghini`. Tuy nhiên, chỉ các thuộc tính riêng của `lamborghini` được truy cập bằng cách sử dụng phương thức `hasOwnProperty()` để kiểm tra xem thuộc tính có phải là thuộc tính riêng của đối tượng hay không. Trong ví dụ này, chỉ thuộc tính `color` được in ra màn hình.
