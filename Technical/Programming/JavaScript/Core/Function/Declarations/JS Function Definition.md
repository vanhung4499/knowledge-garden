---
title: JS Function Definition
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-04
date modified: 2023-08-04
---

# Định nghĩa hàm theo cú pháp

Một định nghĩa hàm bao gồm một chuỗi từ khóa `function`, theo sau là:

- Tên của hàm
- Danh sách các tham số của hàm, được bao quanh bởi dấu ngoặc đơn và được phân tách bằng dấu phẩy
- Các câu lệnh thực thi của hàm, được bao quanh bởi dấu ngoặc nhọn `{}` (thân hàm)

## Câu lệnh khai báo hàm

Cấu trúc của câu lệnh khai báo hàm bao gồm:

1. Từ khóa `function`
2. `functionName`: Tên của hàm
3. `arg`: Tham số (tùy chọn)
4. `functionBody`: Thân hàm

### Cú pháp

```js
function functionName ([arg1 [,arg2 [...,argn]]]) {
  // functionBody
}
```

| Yếu tố khai báo hàm | Ý nghĩa     | Giải thích                                                                                          |
| :----------------- | :---------- | :-------------------------------------------------------------------------------------------------- |
| `function`         | Từ khóa     | Nhận diện từ khóa khai báo tên hàm                                                                    |
| `functionName`     | Tên hàm     | Tên duy nhất của hàm trong phạm vi hiện tại                                                          |
| `arg`              | Danh sách   | Nằm trong dấu ngoặc đơn sau tên hàm là danh sách tham số, các tham số được phân tách bằng dấu phẩy. |
| `functionBody`     | Thân hàm    | Tập hợp các câu lệnh, bao gồm cả dấu ngoặc nhọn.                                                      |

### Đặc điểm

- Khi tham số của hàm là một giá trị (kiểu dữ liệu cơ bản), nếu hàm được gọi thay đổi giá trị của tham số này, sự thay đổi không ảnh hưởng đến biến toàn cục hoặc hàm gọi.
- Tuy nhiên, khi tham số của hàm là một đối tượng (một giá trị không phải là giá trị nguyên thủy, ví dụ `Array` hoặc đối tượng người dùng tự định nghĩa), nếu hàm thay đổi các thuộc tính của đối tượng này, sự thay đổi sẽ được nhìn thấy bên ngoài hàm.

```js
function fn(arg1) {
  arg1.name = 'JavaScript';
}

let foo = { name: 'Java', year: 1998 };

fn(foo);

console.log(foo.name);
// 'JavaScript'
```

- Dấu ngoặc nhọn `{}` là **bắt buộc** trong câu lệnh khai báo hàm, điều này khác với vòng lặp `while` và một số câu lệnh khác, ngay cả khi thân hàm chỉ chứa một câu lệnh, vẫn phải sử dụng dấu ngoặc nhọn để bao quanh nó.

```js
function test();
// SyntaxError: Unexpected end of input

function test(){};
// Không báo lỗi

while(true);
// Không báo lỗi
```

- **Khai báo hàm trùng lặp sẽ ghi đè lên khai báo trước đó** (bất kể là biểu thức hàm hay câu lệnh khai báo hàm)

⚠️ **Lưu ý**: Do khai báo hàm được nâng lên (hoisting) trước biến hàm, nên khai báo biến không có tác dụng.

```js
var foo;

function foo() {
  console.log(1);
}

foo();
// 1
```

Khai báo hàm sau sẽ ghi đè lên khai báo hàm trước đó

```js
baz();
// 2

function baz() {
  console.log(1);
}

function baz() {
  console.log(2);
}
```

- Tương tự như khai báo biến, biến được tạo bởi câu lệnh khai báo hàm không thể bị xóa

```js
function foo() {
  console.log(1);
}

delete foo;
// false

console.log(foo());
// 1
```

## Biểu thức hàm

Cấu trúc của biểu thức hàm bao gồm:

- Từ khóa `var/let/const`
- `variableName`: Tên biến
- Dấu gán biểu thức
- Dấu chấm phẩy kết thúc khai báo biến
- `functionName`: Tên hàm (tùy chọn, nếu không có, hàm được gọi là hàm vô danh)
- `functionBody`: Thân hàm

Thường thì, khi định nghĩa hàm dưới dạng biểu thức, không cần tên hàm, điều này làm cho mã định nghĩa hàm trở nên gọn gàng hơn. Biểu thức định nghĩa hàm đặc biệt phù hợp để định nghĩa các hàm chỉ được sử dụng một lần.

### Cú pháp

```js
const variableName = function functionName(arg) {
  // Thân hàm
  functionBody;
};
```

Yếu tố của biểu thức hàm tương tự như câu lệnh khai báo hàm.

### Hàm vô danh

**Hàm vô danh (anonymous function)**, còn được gọi là hàm lambda, là một hàm không có tên sau từ khóa `function`.

```js
const square = function (number) {
  return number * number;
};
```

### Hàm có tên

Biểu thức hàm cũng có thể cung cấp tên hàm và có thể được sử dụng để tham chiếu đến chính nó trong phạm vi của nó, hoặc để phân biệt nó trong ngăn xếp gỡ lỗi.

```js
const factorial = function fac(n) {
  return n < 2 ? 1 : n * fac(n - 1);
};

console.log(factorial(3));

var x = square(4);
// Giá trị của x là 16
```

### Tên hàm

Một biểu thức hàm bao gồm tên, phạm vi cục bộ của hàm sẽ chứa một liên kết đến đối tượng hàm. Trên thực tế, tên của hàm sẽ trở thành một biến cục bộ trong hàm.

```js
const foo = function fn() {
  return fn;
};

console.log(foo);
// fn(){
//  return fn
// }

console.log(foo());
// fn(){
//  return fn
// }

console.log(foo()());
// fn(){
//  return fn
// }
```

Hiểu theo cách của riêng tôi:

- Đối với biểu thức hàm có tên, **tên hàm** tương đương với <strong style="color: red">tham số hình thức</strong> của hàm, chỉ có thể sử dụng trong hàm;
- Còn **tên biến** tương đương với <strong style="color: red">tham số thực</strong> của hàm, có thể sử dụng trong và ngoài hàm.

```js
const foo = function fn() {
  return fn === foo;
};

console.log(foo());
// true

console.log(foo === fn);
// ReferenceError: fn is not defined
```

Hàm định nghĩa một thuộc tính `name` không chuẩn, thông qua thuộc tính này có thể truy cập vào tên được chỉ định cho hàm, giá trị của thuộc tính này luôn bằng với từ khóa sau từ khóa `function`, thuộc tính `name` của hàm vô danh là rỗng.

```js
// Không hoạt động trên trình duyệt IE11- , tất cả đều trả về undefined
// Chrome có vấn đề khi xử lý thuộc tính name của hàm vô danh, nó sẽ hiển thị tên của biểu thức hàm
function fn() {}
console.log(fn.name);
// 'fn'

var fn = function () {};
console.log(fn.name);
// '' (trên trình duyệt Chrome sẽ hiển thị 'fn')

var fn = function abc() {};
console.log(fn.name);
// 'abc'
```

## Hàm khai báo ưu tiên

Mặc dù cả hai cách đều có thể định nghĩa hàm, nhưng khác biệt lớn nhất là:

- Trình phân tích cú pháp sẽ **đọc khai báo hàm trước**, cho phép truy cập đến nó trước khi thực thi bất kỳ mã nào (còn được gọi là **khai báo hàm nâng lên**);
- Trong khi biểu thức hàm cần **trình phân tích cú pháp thực thi đến dòng mã chứa nó** thì mới được thực thi.

```js
foo();
// Chạy bình thường, hiển thị 'foo'

bar();
// Báo lỗi Uncaught TypeError: baz is not a function

function foo() {
  alert('foo');
}

var baz = function bar() {
  alert('bar');
};
```
