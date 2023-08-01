---
title: JS typeof
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# typeof

Toán tử `typeof` trả về một chuỗi đại diện cho kiểu dữ liệu của toán hạng chưa được tính toán.

## Cú pháp

```js
typeof operand;
```

### Tham số

| Tham số       | Mô tả                                          |
| ------------- | ---------------------------------------------- |
| `operand`   | Một biểu thức đại diện cho đối tượng hoặc giá trị nguyên thủy, kiểu dữ liệu của nó sẽ được trả về |

### Giá trị trả về

Bảng dưới đây tóm tắt các giá trị trả về có thể của `typeof`.

Để biết thêm thông tin về kiểu dữ liệu và giá trị nguyên thủy, bạn có thể xem trang [[JS Data Types]].

| Kiểu dữ liệu         | Kết quả                   |
| :------------------ | :----------------------- |
| Undefined           | `'undefined'`            |
| Null                | `'object'`               |
| Boolean             | `'boolean'`              |
| Number              | `'number'`               |
| String              | `'string'`               |
| Symbol              | `'symbol'`               |
| Đối tượng chủ thể   | Phụ thuộc vào việc triển khai |
| Đối tượng hàm        | `'function'`             |
| Bất kỳ đối tượng khác | `'object'`               |

## Ví dụ

### Ví dụ mã

#### Number

```js
typeof 37 === 'number';
typeof 3.14 === 'number';
typeof Math.LN2 === 'number';
typeof Infinity === 'number';

typeof NaN === 'number';
// Mặc dù NaN là viết tắt của "Not-A-Number"

typeof Number(1) === 'number';
// Nhưng không nên sử dụng hình thức này!
```

#### String

```js
typeof '' === 'string';
typeof 'bla' === 'string';

typeof typeof 1 === 'string';
// typeof luôn trả về một chuỗi

typeof String('abc') === 'string';
// Nhưng không nên sử dụng hình thức này!
```

#### Boolean

```js
typeof true === 'boolean';
typeof false === 'boolean';
typeof Boolean(true) === 'boolean';
// Nhưng không nên sử dụng hình thức này!
```

#### Symbol

```js
typeof Symbol() === 'symbol';
typeof Symbol('foo') === 'symbol';
typeof Symbol.iterator === 'symbol';
```

#### Undefined

```js
typeof undefined === 'undefined';
typeof declaredButUndefinedVariable === 'undefined';
typeof undeclaredVariable === 'undefined';
```

#### Object

```js
typeof { a: 1 } === 'object';

// Sử dụng Array.isArray hoặc Object.prototype.toString.call
// để phân biệt mảng và đối tượng thông thường
typeof [1, 2, 4] === 'object';

typeof new Date() === 'object';

// Các ví dụ dưới đây có thể gây nhầm lẫn, không nên sử dụng!
typeof new Boolean(true) === 'object';
typeof new Number(1) === 'object';
typeof new String('abc') === 'object';
```

#### Function

```js
typeof function () {} === 'function';
typeof class C {} === 'function';
typeof Math.sin === 'function';
typeof new Function() === 'function';
```

### Trường hợp đặc biệt `null`

```js
typeof null === 'object';
// Điều này đã được xác định từ đầu khi JavaScript được triển khai
```

Trong phiên bản ban đầu của JavaScript, giá trị trong JavaScript được biểu diễn bằng một nhãn đại diện cho kiểu dữ liệu và giá trị dữ liệu thực tế. Nhãn kiểu dữ liệu cho đối tượng là 0. Vì `null` đại diện cho con trỏ null (trên hầu hết các nền tảng, giá trị là `0x00`), nên nhãn kiểu dữ liệu của `null` cũng là 0, và `typeof null` trả về sai lầm `"object"`.

ECMAScript đã đề xuất một bản sửa chữa (thông qua opt-in), nhưng đã bị từ chối. Điều này dẫn đến `typeof null === 'object'`.
