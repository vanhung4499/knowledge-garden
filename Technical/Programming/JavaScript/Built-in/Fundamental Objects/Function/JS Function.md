---
title: JS Function
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-12-208-07
---

# Function

Hàm `Function` được sử dụng để tạo một đối tượng hàm mới thông qua từ khóa `new`. Trong JavaScript, mỗi hàm thực tế là một đối tượng của lớp Function.

## Cú pháp

**Hàm tạo**

```js
new Function ( [ argName1 [, argName1 [, argNameN... [, funcBody ]]]] )
```

**Hàm chuyển đổi kiểu hàm**

```js
Function ( [ argName1 [, argName1 [, argNameN... [, funcBody ]]]] )
```

| Tham số   | Mô tả                                                         | Kiểu dữ liệu |
| :-------- | :----------------------------------------------------------- | :----------- |
| argName1  | Tên của tham số thứ nhất được định nghĩa                        | string       |
| argName2  | Tên của tham số thứ hai được định nghĩa                         | string       |
| argNameN  | Tên của tham số thứ N được định nghĩa, có thể có nhiều tham số | string       |
| funcBody  | Nội dung chính của hàm, tức là mã thực thi bên trong hàm, mặc định là chuỗi rỗng (`""`) | string       |

`Function()` sẽ sử dụng **tham số cuối cùng** như là mã thực thi của hàm, các tham số trước đó sẽ được sử dụng như là các tham số của hàm.

- Nếu không chỉ định bất kỳ tham số nào, điều này có nghĩa là hàm không có danh sách tham số và mã thực thi của hàm cũng là chuỗi rỗng.
- Nếu chỉ định một tham số, thì tham số đó sẽ được coi là mã thực thi của hàm. Nếu bạn muốn định nghĩa một tham số và mã thực thi rỗng, hãy truyền vào hai tham số, tham số thứ hai là chuỗi rỗng: `new Function("argName1", "")`.

Giá trị trả về của `Function()` là một đối tượng hàm, trả về một đối tượng hàm.

## Mô tả

- Đối tượng hàm được tạo bởi hàm tạo Function được phân tích cú pháp khi hàm được tạo. Điều này khác với việc sử dụng [[JS Function Definition#Câu lệnh khai báo hàm|khai báo hàm]] hoặc [[JS Function Definition#Biểu thức hàm|biểu thức hàm]] và gọi hàm trong mã của bạn, vì các hàm được tạo bằng cách sử dụng các phương pháp này được phân tích cú pháp cùng với mã khác.
- Tất cả các tham số được truyền vào hàm tạo sẽ được coi là các tham số của hàm được tạo và có cùng tên và thứ tự truyền vào.
- Các hàm được tạo bằng cách sử dụng hàm tạo Function không tạo ra closure trong ngữ cảnh tạo chúng; chúng thường được tạo ra trong **phạm vi toàn cục**. Khi chạy các hàm này, chúng chỉ có thể truy cập biến cục bộ của chính nó và biến toàn cục, không thể truy cập phạm vi của ngữ cảnh tạo hàm Function. Điều này khác với việc sử dụng `eval` với mã biểu thức hàm.
- Gọi hàm Function bằng cách sử dụng phương thức gọi hàm (thay vì từ khóa `new`) tương tự như gọi một hàm tạo.

## Hàm tạo

- `Function.arguments`: Trả về một mảng chứa tất cả các tham số được truyền vào hàm. Thuộc tính này đã bị thay thế bởi [`arguments`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments).
- `Function.caller`: Trả về đối tượng cụ thể gọi hàm.
- `Function.length`: Trả về số lượng tham số được chấp nhận bởi hàm.
- `Function.name`: Trả về tên của hàm.
- `Function.displayName`: Trả về tên hiển thị của hàm.

## Đối tượng nguyên mẫu

- [[JS Function Apply|Function.prototype.apply]]: Thiết lập ngữ cảnh gọi hàm cụ thể và cung cấp các tham số dưới dạng một mảng.
- [[JS Function Apply|Function.prototype.call]]: Thiết lập ngữ cảnh gọi hàm cụ thể và cung cấp các tham số dưới dạng danh sách.
- [[JS Function Bind|Function.prototype.bind]]: Ràng buộc ngữ cảnh gọi của hàm cụ thể, bất kể cách gọi nào, ngữ cảnh gọi hàm sẽ được sử dụng.
- [Function.prototype.toString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/toString): Trả về chuỗi đại diện cho mã nguồn của hàm.

## Ví dụ

### Ví dụ cơ bản

Định nghĩa một hàm tính tổng: có 2 tham số `x`, `y`

```js
const sum = new Function('x', 'y', 'return x + y;');
```

Định nghĩa một hàm xuất ra: không có định nghĩa tham số, xuất ra `"CodePlayer"`

```js
const foo = Function('var name="CodePlayer"; console.log(name);');
```

Thực thi hàm.

```js
console.log(sum(12, 23));
// 35

foo();
// CodePlayer

console.log(typeof sum);
// function
console.log(sum instanceof Function);
// true
console.log(sum instanceof Object);
// true
```

### Khai báo hàm

JavaScript hỗ trợ khai báo hàm bằng từ khóa `function`, trong hầu hết các trường hợp, chúng ta cũng khuyến nghị sử dụng từ khóa `function` để khai báo hàm. Các đoạn mã tương ứng với hai hàm trên khi sử dụng từ khóa `function` để khai báo như sau:

```js
function sum(x, y) {
  return x + y;
}

function foo() {
  var name = 'CodePlayer';
  console.log(name);
}

// Thực thi hàm
console.log(sum(12, 23));
// 35
foo();
// CodePlayer

console.log(typeof sum);
// function
console.log(sum instanceof Function);
// true
console.log(sum instanceof Object);
// true
```

### Biểu thức hàm

Chúng ta cũng có thể sử dụng từ khóa `function` để khai báo một hàm ẩn danh và gán tham chiếu của hàm đó cho một biến. Chúng ta cũng có thể khai báo một hàm ẩn danh và ngay lập tức thực thi hàm đó.

```js
var foo = function () {
  var name = 'CodePlayer';
  console.log(name);
};

foo();
// CodePlayer
```

Chúng ta cần đặt dấu ngoặc đơn bên ngoài đoạn mã khai báo hàm ẩn danh để bắt buộc tính toán và trả về kết quả tính toán (nếu không, JavaScript chỉ phân tích cú pháp hàm ẩn danh đó mà không thể nhận được tham chiếu hàm và không thể thực thi hàm).

Chúng ta cũng có thể đặt dấu ngoặc đơn sau đoạn mã khai báo và truyền các tham số thực thi cần thiết (ở đây là `2` và `3`).

```js
(function (x, y) {
  console.log(x + y);
})(2, 3);
// 5
```

Đoạn mã trên cũng có thể được viết như sau (lưu ý vị trí và phù hợp của dấu ngoặc đơn):

```js
(function (x, y) {
  console.log(x + y);
}(2, 3));
// 5
```

### Phạm vi toàn cục

Trong đoạn mã dưới đây, hàm `f()` trả về hàm `e()`, đây là một closure.

```js
const n = 1;

function f() {
  const n = 2;
  function e() {
    return n;
  }
  return e;
}

console.log(f()());
// 2
```

Trong đoạn mã dưới đây, hàm `f()` trả về một hàm trong phạm vi toàn cục.

```js
const n = 1;

function f() {
  const n = 2;
  const e = new Function('return n;');
  return e;
}

console.log(f()());
// 1
```
