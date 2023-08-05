---
title: JS Partial Function
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Hàm một phần - Partial Function

Theo định nghĩa trong Wikipedia:

> Trong khoa học máy tính, một phần ứng dụng (hoặc phần hàm ứng dụng) đề cập đến quá trình cố định một số đối số của một hàm, tạo ra một hàm khác với số lượng đối số nhỏ hơn.

Trong lĩnh vực khoa học máy tính, hàm một phần áp dụng cho việc cố định một số đối số của một hàm, tạo ra một hàm khác với số lượng đối số nhỏ hơn.

🌰 **Ví dụ:**

```js
function add(a, b) {
  return a + b;
}

// Gọi hàm add, chỉ cần truyền vào hai đối số
add(1, 2); // 3

// Giả sử có một hàm partial có thể thực hiện hàm một phần
var addOne = partial(add, 1);

addOne(2); // 3
```

Hàm một phần và hàm currying rất giống nhau:

- **Currying:** Chuyển đổi một hàm với nhiều đối số thành nhiều hàm với một đối số, tức là chuyển đổi một hàm n-đối số thành n hàm một đối số.
- **Hàm một phần:** Cố định một hoặc nhiều đối số của một hàm, tức là chuyển đổi một hàm n-đối số thành một hàm n - x đối số.

## Ứng dụng thực tế

Hàm `bind` cho phép chúng ta truyền vào một hoặc nhiều đối số được định trước, sau đó trả về một hàm mới với giá trị `this` và các đối số đã được định trước. Khi hàm được gọi, các đối số này sẽ được chèn vào đầu danh sách đối số của hàm mục tiêu, và các đối số được truyền vào hàm ràng buộc sẽ đứng sau chúng.

```js
function addition(x, y) {
  return x + y;
}

const plus5 = addition.bind(null, 5);

plus5(10);
// 15

plus5(25);
// 30
```

Chúng ta truyền trước đối số `5` và trả về một hàm mới gán cho `plus5`, hàm này có thể chấp nhận các đối số còn lại. Gọi `plus5` với đối số còn lại `10` để nhận kết quả cuối cùng là `15`, và gọi với đối số `20` để nhận kết quả `30`. Hàm một phần giúp chúng ta tái sử dụng mã code bằng cách đặt giá trị trước.

## Cách thực hiện hàm một phần

Cả Underscore.js và Lodash đều có hàm `partial` để thực hiện hàm một phần. Dưới đây là một cách triển khai đơn giản:

```js
var _ = {};

function partial(fn) {
  var args = [].slice.call(arguments, 1);
  return function() {
    var position = 0,
      len = args.length;
    for (var i = 0; i < len; i++) {
      args[i] = args[i] === _ ? arguments[position++] : args[i];
    }
    while (position < arguments.length) args.push(arguments[position++]);
    return fn.apply(this, args);
  };
}
```
