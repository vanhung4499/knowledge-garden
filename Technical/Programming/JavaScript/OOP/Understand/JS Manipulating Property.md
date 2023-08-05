---
title: JS Manipulating Property
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-06
---

# Thao tác với thuộc tính

## Truy vấn thuộc tính

Truy vấn thuộc tính còn được gọi là truy cập thuộc tính ở mức biểu thức.

Có hai cách thông thường để truy vấn thuộc tính:

- Toán tử dấu chấm
- Toán tử dấu ngoặc vuông

Tên thuộc tính có thể là tiếng Trung, vì tiếng Trung tương đương với ký tự và được coi là như nhau, vì vậy có thể viết là `person.một` hoặc `person['một']`.

```js
const person = {
  một: 1,
};
console.log(person.một);
// 1
console.log(person['một']);
// 1
```

### Toán tử dấu chấm

Toán tử dấu chấm là cách thông thường để truy cập thuộc tính trong nhiều câu lệnh hướng đối tượng. Vì nó đơn giản hơn, nên thường được sử dụng hơn toán tử dấu ngoặc vuông.

Vì JavaScript là một ngôn ngữ yếu, nên bạn có thể tạo bất kỳ số lượng thuộc tính nào trong bất kỳ đối tượng nào. Tuy nhiên, khi truy cập thuộc tính của đối tượng bằng toán tử dấu chấm `.` , tên thuộc tính được biểu thị bằng một định danh và phải tuân thủ [[JS Lexical Grammar#Định danh (Identifier)|quy tắc đặt tên biến]]. Định danh phải xuất hiện trực tiếp trong chương trình JavaScript và không phải là một kiểu dữ liệu, vì vậy chương trình không thể thay đổi chúng.

```js
const foo = {
  a: 1,
  1: 2
};

console.log(foo.a);
// 1

// Do biến không thể bắt đầu bằng số, nên o.1 sẽ báo lỗi
console.log(o.1);
// Uncaught SyntaxError: missing ) after argument list
```

### Toán tử dấu ngoặc vuông

Khi truy cập thuộc tính của đối tượng bằng toán tử dấu ngoặc vuông `[]`, tên thuộc tính được biểu thị bằng một chuỗi. Chuỗi là một kiểu dữ liệu trong JavaScript và có thể được sửa đổi và tạo ra trong quá trình chạy chương trình.

Sử dụng toán tử dấu ngoặc vuông có hai lợi ích:

- Có thể truy cập thuộc tính bằng biến
- Tên thuộc tính có thể là một định danh không hợp lệ của JavaScript

Giá trị trong dấu ngoặc vuông nếu không phải là kiểu chuỗi sẽ được chuyển đổi ngầm thành chuỗi bằng cách sử dụng `String()`. Nếu giá trị là kiểu chuỗi, nếu có dấu ngoặc kép, giá trị gốc sẽ được giữ nguyên, nếu không, nó sẽ được coi là một biến, nếu biến không được định nghĩa, nó sẽ báo lỗi.

#### Tên thuộc tính có thể tính toán được

Trong toán tử dấu ngoặc vuông, bạn có thể sử dụng biểu thức.

```js
const a = 1;
const foo = {
  3: 'abc',
};

foo[a + 2]; // 'abc'
```

Nhưng nếu bạn muốn sử dụng biểu thức làm tên thuộc tính trong literal, bạn cần sử dụng tính năng tên thuộc tính có thể tính toán trong ES6.

```js
const a = 1;

const foo = {
  a + 3: 'abc'
};
// Uncaught SyntaxError: Unexpected token +
```

ES6 đã thêm tính năng tên thuộc tính có thể tính toán, cho phép bạn sử dụng `[]` để bao bọc một biểu thức trong một chuỗi và sử dụng nó như một tên thuộc tính.

```js
const a = 1;

const foo = {
  [a + 3]: 'bar',
};

foo[4];
// 'bar'
```

#### Lỗi truy vấn thuộc tính

Truy vấn một thuộc tính không tồn tại sẽ không báo lỗi, mà chỉ trả về `undefined`.

```js
const foo = {};

console.log(foo.a);
// undefined
```

Nếu đối tượng không tồn tại, việc truy vấn thuộc tính của đối tượng không tồn tại sẽ báo lỗi.

```js
console.log(foo.a);
// Uncaught ReferenceError: person is not defined
```

Bạn có thể sử dụng tính năng này để kiểm tra xem một biến toàn cục có được khai báo hay không.

Kiểm tra xem biến có được khai báo hay không

```js
if (a) {...};
// Uncaught ReferenceError: a is not defined
```

Tất cả các biến toàn cục đều là thuộc tính của đối tượng Window. Ý nghĩa của `window.a` là đọc thuộc tính `a` của đối tượng Window, nếu thuộc tính này không tồn tại, nó sẽ trả về `undefined` mà không báo lỗi.

```js
if (window.a) {...}
```

## Thiết lập thuộc tính

Thiết lập thuộc tính, còn được gọi là gán giá trị cho thuộc tính, cũng có hai phương pháp như truy vấn thuộc tính: **toán tử dấu chấm** và **toán tử dấu ngoặc vuông**.

🌰 **Ví dụ mã: Toán tử dấu chấm**

```js
foo.p = 'bar';
```

🌰 **Ví dụ mã: Toán tử dấu ngoặc vuông**

```js
foo['p'] = 'bar';
```

### Kiểm tra trước khi gán giá trị

Trước khi gán giá trị cho thuộc tính của một đối tượng, thường cần kiểm tra xem đối tượng có tồn tại hay không.

```js
// Không tốt
let len = undefined;
if (book) {
  if (book.subtitle) {
    len = book.subtitle.length;
  }
}

// Tốt
let len = book && book.subtitle && book.subtitle.length;
```

### Kiểu nguyên thủy

Vì các giá trị của các kiểu dữ liệu như String, Number và Boolean có các đối tượng bao đóng tương ứng, nên gán thuộc tính cho chúng sẽ không gây ra lỗi.

```js
'foo'.a = 1;
// 1

(1).a = 1;
// 1

true.a = 1;
// 1
```

Tuy nhiên, `null` và `undefined` không phải là đối tượng, việc gán thuộc tính cho chúng sẽ gây ra lỗi.

```js
null.a = 1;
// Uncaught TypeError: Cannot set property 'a' of null

undefined.a = 1;
// Uncaught TypeError: Cannot set property 'a' of undefined
```

## Xóa thuộc tính

Sử dụng toán tử [[JS delete|delete]] để xóa thuộc tính của đối tượng (bao gồm cả phần tử mảng).

```js
const foo = { a: 1 };

console.log(foo.a);
// 1
console.log('a' in foo);
// true

// Xóa thuộc tính của đối tượng
console.log(delete foo.a);
// true

console.log(foo.a);
// undefined
console.log('a' in foo);
// false
```

- Gán giá trị `null` hoặc `undefined` cho thuộc tính của đối tượng không xóa thuộc tính đó.
- Khi xóa phần tử mảng bằng `delete`, độ dài của mảng không thay đổi.
- Toán tử `delete` chỉ có thể xóa thuộc tính riêng, không thể xóa thuộc tính kế thừa.
  - Để xóa thuộc tính kế thừa, phải xóa nó từ đối tượng nguyên mẫu định nghĩa thuộc tính đó và điều này sẽ ảnh hưởng đến tất cả các đối tượng kế thừa từ nguyên mẫu đó.
- Giá trị trả về của toán tử `delete` là một giá trị boolean `true` hoặc `false`.
  - Khi sử dụng toán tử `delete` để xóa thuộc tính đối tượng hoặc phần tử mảng thành công, trả về `true`.
  - Khi sử dụng toán tử `delete` để xóa thuộc tính không tồn tại hoặc giá trị không tồn tại, trả về `true`.
  - Khi sử dụng toán tử `delete` để xóa một biến, trả về `false` và trong chế độ nghiêm ngặt (strict mode), sẽ gây ra lỗi ReferenceError.
  - Khi sử dụng toán tử `delete` để xóa một thuộc tính không thể cấu hình, trả về `false` và trong chế độ nghiêm ngặt (strict mode), sẽ gây ra lỗi TypeError.

## Kế thừa thuộc tính

Mỗi đối tượng JavaScript đều liên kết với một đối tượng khác, đó là nguyên mẫu (prototype), mỗi đối tượng kế thừa các thuộc tính từ nguyên mẫu.

Tất cả các đối tượng được tạo bằng cách sử dụng đối tượng chữa được tạo ra từ cùng một đối tượng nguyên mẫu và có thể được truy cập vào đối tượng nguyên mẫu thông qua `Object.prototype`.

```js
const foo = {};

console.log(foo.__proto__ === Object.prototype);
// true
```

Đối tượng nguyên mẫu của `Object.prototype` là `null`, vì vậy nó không kế thừa bất kỳ thuộc tính nào.

```js
console.log(Object.prototype.__proto__ === null);
// true
```

Các thuộc tính mà đối tượng sở hữu được gọi là **thuộc tính riêng** (Own Property)，các thuộc tính được kế thừa từ nguyên mẫu được gọi là **thuộc tính kế thừa** (Inherited Property)。

### Phương pháp kiểm tra

- [[JS in|in]]：Toán tử `in` có thể kiểm tra xem thuộc tính có tồn tại trong đối tượng hay không, nhưng không phân biệt thuộc tính riêng hay thuộc tính kế thừa.
- [[JS For-In Statement|for-in]]：Với vòng lặp `for-in`, bạn có thể lặp qua tất cả các thuộc tính **có thể liệt kê** trong đối tượng.
- [hasOwnProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)：Phương thức `hasOwnProperty()` có thể xác định xem một thuộc tính có phải là thuộc tính riêng hay thuộc tính kế thừa.
- [Object.keys](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)：Phương thức `Object.keys()` trả về tất cả các thuộc tính **có thể liệt kê** là thuộc tính riêng.
- [Object.getOwnPropertyNames](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames)：Phương thức `Object.getOwnPropertyNames()` trả về tất cả các thuộc tính là thuộc tính riêng (bao gồm cả thuộc tính không thể liệt kê).
