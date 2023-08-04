---
title: JS Function Prototype Object Properties
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Thuộc tính đối tượng nguyên mẫu hàm

## Thuộc tính `length`

Trong một hàm, thuộc tính `length` của đối tượng `arguments` đại diện cho số lượng tham số thực tế được truyền vào, trong khi thuộc tính `length` của hàm đại diện cho số lượng tham số hình thức mà hàm mong muốn nhận.

```js
function sayName(name) {
  // làm gì đó
}

function sum(num1, num2) {
  // làm gì đó
}

function sayHi() {
  // làm gì đó
}

console.log(sayName.length); // Kết quả: 1

console.log(sum.length); // Kết quả: 2

console.log(sayHi.length); // Kết quả: 0
```

## Thuộc tính `name`

Hàm định nghĩa một thuộc tính `name` không chuẩn, thông qua thuộc tính này, bạn có thể truy cập vào tên được chỉ định cho hàm cụ thể, giá trị của thuộc tính này luôn bằng với **identifier** ngay sau từ khóa `function`, thuộc tính `name` của hàm vô danh là rỗng.

```js
// Không hoạt động trên trình duyệt IE11- và sẽ trả về undefined
// Chrome có vấn đề khi xử lý thuộc tính name của hàm vô danh, sẽ hiển thị tên của hàm biểu thức
function a() {}

console.log(a.name); // Kết quả: 'fn'

const b = function() {};

console.log(b.name); // Kết quả: '' (trên trình duyệt Chrome sẽ hiển thị 'fn')

const c = function abc() {};

console.log(c.name); // Kết quả: 'abc'
```

- Được đưa vào chuẩn ES6

ES6 đã thay đổi hành vi của thuộc tính này. Nếu gán một hàm vô danh cho một biến, thuộc tính `name` của ES5 sẽ trả về chuỗi rỗng, trong khi thuộc tính `name` của ES6 sẽ trả về tên thực tế của hàm.

```js
const fun = function() {};

console.log(fun.name); // ES5: ''

console.log(fun.name); // ES6: 'fun'
```

Nếu gán một hàm có tên cho một biến, cả thuộc tính `name` của ES5 và ES6 đều trả về tên gốc của hàm đó.

```js
const bar = function baz() {};

console.log(bar.name); // ES5: "baz"

console.log(bar.name); // ES6: "baz"
```

- Hàm xây dựng

Đối tượng hàm trả về từ hàm xây dựng, thuộc tính `name` có giá trị là `'anonymous'`.

```js
new Function().name; // 'anonymous'
```

Hàm trả về từ `bind`, thuộc tính `name` sẽ có tiền tố `'bound '`.

```js
function foo() {}

console
  .log(foo.bind({}).name)
  (
    // 'bound foo'

    function() {}
  )
  .bind({}).name; // 'bound '
```
