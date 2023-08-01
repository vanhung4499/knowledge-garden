---
title: JS instanceof
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# instanceof

Toán tử `instanceof` được sử dụng để kiểm tra xem thuộc tính `prototype` của một hàm tạo có xuất hiện trong chuỗi nguyên mẫu của một đối tượng hay không.

Cú pháp:

```js
target instanceof constructor;
```

## Kiểm tra kiểu dữ liệu

`instanceof` được sử dụng để kiểm tra xem một đối tượng có phải là **thể hiện** của một đối tượng khác hay không.

```js
const Person = function () {};
const student = new Person();

console.log(student instanceof Person);
// true
```

`instanceof` cũng có thể kiểm tra kiểu dữ liệu cha.

```js
function Person() {}
function Student() {}

const p = new Person();

// Kế thừa nguyên mẫu
Student.prototype = p;

const s = new Student();

console.log(s instanceof Student);
// true
console.log(s instanceof Person);
// true
```

Ví dụ khác:

```js
// Kiểu dữ liệu số
console.log(1 instanceof Number);
// false
conosole.log(Infinity instanceof Number);
// false
console.log(Number(2) instanceof Number);

// Kiểu dữ liệu boolean
console.log(true instanceof Boolean);
// false

// Kiểu dữ liệu chuỗi
console.log('' instanceof String);
// false

// Kiểu dữ liệu hàm
const fn = () => console.log('Hello world!');
console.log(fn instanceof Function);
// true
```

## Mô phỏng thực thi

```js
function simulateInstanceof(left, right) {
  if (left === null || (typeof left !== 'object' && typeof left !== 'function')) return false;

  // Duyệt qua chuỗi nguyên mẫu
  while (true) {
    // Object.prototype.__proto__ === null
    if (left === null) return false;

    // Điểm quan trọng ở đây: Trả về true khi left chính xác bằng prototype
    if (left === right.prototype) return true;

    left = left.__proto__;
  }
}
```
