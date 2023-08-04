---
title: JS Rest Parameters
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-04
date modified: 2023-08-05
---

# Tham số còn lại

**Tham số còn lại (rest parameter)** được sử dụng để lấy các tham số dư thừa của một hàm, giúp chúng ta không cần sử dụng đối tượng `arguments` nữa. Biến kết hợp với tham số còn lại là một **mảng**, nơi mà các tham số dư thừa được đặt vào trong mảng đó.

```js
function add(...values) {
  let sum = 0;

  for (var val of values) {
    sum += val;
  }

  return sum;
}

add(2, 5, 3); // 10
```

Trong ví dụ trên, hàm `add` là một hàm tính tổng, sử dụng tham số còn lại để có thể truyền vào hàm một số lượng tham số tùy ý.

Dưới đây là một ví dụ sử dụng tham số còn lại để thay thế biến `arguments`.

```js
// Cách sử dụng biến arguments
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort();
}

// Cách sử dụng tham số còn lại
const sortNumbers = (...numbers) => numbers.sort();
```

Đối tượng `arguments` không phải là một mảng, mà là một đối tượng giống mảng. Vì vậy, để sử dụng các phương thức của mảng, chúng ta phải sử dụng `Array.prototype.slice.call` để chuyển đổi nó thành một mảng. Tham số còn lại không có vấn đề này, nó là một mảng thực sự, có thể sử dụng tất cả các phương thức của mảng. Dưới đây là một ví dụ sử dụng tham số còn lại để thay thế phương thức `push` của mảng.

```js
function push(array, ...items) {
  items.forEach(function(item) {
    array.push(item);
    console.log(item);
  });
}

const collection = [];

push(collection, 1, 2, 3);
```

## So sánh với đối tượng tham số

| Tham số còn lại                   | Đối tượng tham số                                                                  |
| :-------------------------------- | :--------------------------------------------------------------------------------- |
| Chỉ chứa các đối số không có tham số tương ứng | Bao gồm tất cả các đối số được truyền vào hàm                                      |
| Là một mảng thực sự, có thể sử dụng tất cả các phương thức của mảng | Không phải là một mảng thực sự, mà là một đối tượng giống mảng, cần sử dụng `Array.from` hoặc destructuring để chuyển đổi thành mảng thực sự trước khi lặp |
|                                  | Có một số thuộc tính bổ sung, như thuộc tính `callee`                                |

## Lưu ý

- Tham số còn lại không được sử dụng sau các tham số khác (nghĩa là **chỉ có thể là tham số cuối cùng**), nếu không sẽ gây ra lỗi.

```js
function f(a, ...b, c) { ... }
// Uncaught SyntaxError: Rest parameter must be last formal parameter
```

- Thuộc tính `length` của hàm không bao gồm tham số còn lại.

```js
(function(a) {}.length);
// 1
```

```js
(function(...a) {}.length);
// 0
```

```js
(function(a, ...b) {}.length);
// 1
```
