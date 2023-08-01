---
title: JS Type Check
tags: [js, programming]
categories: [js, programming]
date created: 2023-07-31
date modified: 2023-07-31
---

# Kiểm tra kiểu dữ liệu trong JS

Có một số phương pháp để kiểm tra kiểu dữ liệu:

1. `typeof`
2. `instanceof`
3. `Object.prototype.toString`
4. `constructor`

## typeof

Toán tử `typeof` trả về một chuỗi biểu thị kiểu dữ liệu chưa được tính toán của toán hạng.

```js
typeof undefined;
// "undefined"

typeof null;
// "object"

typeof 100;
// "number"

typeof NaN;
// "number"

typeof true;
// "boolean"

typeof 'foo';
// "string"

typeof function () {};
// "function"

typeof [1, 2];
// "object"

typeof new Object();
// "object"
```

Toán tử `typeof` thích hợp để kiểm tra kiểu dữ liệu của các loại cơ bản (trừ `null`) và kiểu dữ liệu `function`, nhưng không phù hợp để kiểm tra kiểu dữ liệu của các loại dữ liệu tham chiếu như mảng (Array).

Xem thêm thông tin chi tiết tại [typeof Operator](../expressions/operators/typeof).

## instanceof

Toán tử `instanceof` được sử dụng để kiểm tra xem một đối tượng có xuất hiện trong chuỗi nguyên mẫu của nó hay không.

Toán tử `instanceof` yêu cầu đối tượng bên trái là một đối tượng, nếu không sẽ trả về `false`. Đối tượng bên phải phải là một hàm hoặc một hàm tạo, nếu không sẽ trả về một ngoại lệ `TypeError`.

```js
obj instanceof constr;
```

```js
function Person() {}
function Student() {}
Student.prototype = new Person();
Student.prototype.constructor = Student;

const ben = new Student();
ben instanceof Student;
// true

const one = new Person();
one instanceof Person;
// true
one instanceof Student;
// false
ben instanceof Person;
// true
```

Mọi hàm tạo đều có một thuộc tính `prototype` là một đối tượng nguyên mẫu, đối tượng được tạo ra từ `new` sẽ có nguyên mẫu này.

📍 Toán tử `instanceof` thích hợp để kiểm tra xem một đối tượng có thuộc về kiểu dữ liệu như Array, Date và RegExp hay không.

📍 Toán tử `instanceof` không thể sử dụng để kiểm tra giữa các cửa sổ (window) hoặc giữa các `iframe`.

Xem thêm thông tin chi tiết tại [instanceof](../expressions/operators/instanceof).

## Object.prototype.toString

Có thể sử dụng `toString()` để lấy kiểu dữ liệu của mỗi đối tượng.

Để đảm bảo rằng mọi đối tượng đều có thể được kiểm tra bằng `Object.prototype.toString`, nó phải được gọi bằng cách sử dụng `Function.prototype.call` hoặc `Function.prototype.apply`, và truyền đối tượng cần kiểm tra làm tham số đầu tiên.

```js
Obejct.prototype.toString.call(undefined)；
//  "[object Undefined]"

Obejct.prototype.toString.call(null)；
//  "[object Null]"

Obejct.prototype.toString.call(true)；
//  "[object Boolean]"

Obejct.prototype.toString.call('')；
/// "[object String]"

Obejct.prototype.toString.call(123)；
//  "[object Number]"

Obejct.prototype.toString.call([])；
//  "[object Array]"

Obejct.prototype.toString.call({})；
//  "[object Object]"
```

💡 Sử dụng phương pháp `Object.prototype.toString` để xác định chính xác kiểu dữ liệu của một giá trị.

⚠️ **Lưu ý**:

- **Ghi đè phương thức**: `Object.prototype.toString` là một phương thức nguyên mẫu của Object, nhưng các kiểu dữ liệu như Array hoặc Function đã ghi đè phương thức `toString`. Do đó, khi gọi phương thức `toString` trên các kiểu dữ liệu khác nhau, nó sẽ gọi phương thức `toString` đã được ghi đè, chứ không phải phương thức `toString` nguyên mẫu của Object, vì vậy không thể lấy được kiểu dữ liệu của đối tượng bằng cách sử dụng `xxx.toString()`.
- Đối với các đối tượng không phải là mảng, việc sử dụng `Object.prototype.toString` sẽ trả về chuỗi `"[object Object]"`. Điều này không cho phép xác định kiểu dữ liệu cụ thể của đối tượng.
- Đối với các đối tượng mảng, việc sử dụng `Object.prototype.toString` sẽ trả về chuỗi `"[object Array]"`. Điều này cho phép xác định đối tượng là một mảng.

## Kiểm tra mảng

ECMAScript 5 đã chính thức giới thiệu phương thức `Array.isArray()` vào JavaScript, phương thức này có thể kiểm tra một biến có phải là một mảng hay không.

```js
Array.isArray(variable);
```
