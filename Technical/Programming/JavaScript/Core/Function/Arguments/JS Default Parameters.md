---
title: JS Default Parameters
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-04
date modified: 2023-08-05
---

# Tham số mặc định

Thường thì, người gọi hàm không cần truyền tất cả các tham số có thể có, các tham số không được truyền sẽ được điền bằng giá trị mặc định. Trong JavaScript, các tham số mặc định được định dạng chặt chẽ, các tham số không được truyền giá trị sẽ mặc định là `undefined`. ES6 đã giới thiệu một cách mới để chỉ định giá trị mặc định cho bất kỳ tham số nào.

Mặc định, các tham số của hàm trong JavaScript đều là `undefined`. Trong ES5, không hỗ trợ việc đặt giá trị mặc định trực tiếp trong tham số. Do đó, để đặt giá trị mặc định, chúng ta phải kiểm tra xem tham số có phải là `undefined` hay không, sau đó gán giá trị tùy theo yêu cầu.

```js
function fn(x, y) {
  y = y || 'World';

  console.log(x, y);
}

fn('Hello');
// Hello World
fn('Hello', 'China');
// Hello China
fn('Hello', '');
// Hello World
```

**Nhược điểm**: Nếu tham số `y` được gán giá trị, nhưng giá trị tương ứng là `false`, thì giá trị gán không có tác dụng.

Để tránh vấn đề này, chúng ta cần kiểm tra xem tham số `y` đã được gán giá trị hay chưa. Nếu chưa, thì mới gán giá trị mặc định.

```js
function fn(x, y) {
  y = typeof y === undefined ? y || 'World';
  console.log(x, y);
}
```

## Cú pháp cơ bản

ES6 cho phép đặt giá trị mặc định cho các tham số của hàm, tức là viết trực tiếp sau định nghĩa tham số.

```js
function fn(x, y = 'World') {
  console.log(x, y);
}

fn('Hello');
// Hello World

fn('Hello', 'China');
// Hello China

fn('Hello', '');
// Hello
```

**Ưu điểm:**

- Người đọc mã có thể nhận biết ngay những tham số có thể bỏ qua, không cần phải xem qua thân hàm hoặc tài liệu.
- Hỗ trợ tối ưu mã trong tương lai, ngay cả khi phiên bản tương lai loại bỏ hoàn toàn tham số này trong giao diện bên ngoài, mã cũ vẫn có thể chạy.

### Khai báo mặc định

Các biến tham số được **khai báo mặc định**, vì vậy không thể khai báo lại bằng `let` hoặc `const`.

```js
function fn(x = 1) {
  let x = 2;
  // SyntaxError: Identifier 'x' has already been declared
  const x = 3;
  // SyntaxError: Identifier 'x' has already been declared
}
```

### Xung đột tên tham số

Khi sử dụng giá trị mặc định cho tham số, hàm không thể có các tham số cùng tên.

```js
// Không báo lỗi
function fn(x, x, y) {
  // làm gì đó
}

// Báo lỗi
function fn(x, x, y = 1) {
  // làm gì đó
}
// SyntaxError: Duplicate parameter name not allowed in this context
```

### Đánh giá lười biếng

Giá trị mặc định của tham số không được truyền giá trị, mà được tính toán lại mỗi lần tính giá trị mặc định. Điều này có nghĩa là giá trị mặc định của tham số được đánh giá lười biếng.

```js
let x = 99;
function fn(p = x + 1) {
  console.log(p);
}

fn();
// 100

x = 100;
fn();
// 101
```

### Kết hợp với phân huỷ cấu trúc

```js
function fn({ x, y = 5 }) {
  console.log(x, y);
}

fn({});
// undefined 5

fn({ x: 1 });
// 1 5

fn({ x: 1, y: 2 });
// 1 2

fn();
// TypeError: Cannot read property 'x' of undefined
```

Trong ví dụ trên, chỉ sử dụng gán giá trị mặc định của đối tượng, không sử dụng gán giá trị mặc định của tham số hàm. Chỉ khi tham số của hàm `fn` là một đối tượng, biến `x` và `y` mới được tạo ra thông qua việc gán giá trị mặc định. Nếu không cung cấp đối số khi gọi hàm `fn`, biến `x` và `y` sẽ không được tạo ra, dẫn đến lỗi. Bằng cách cung cấp giá trị mặc định cho tham số hàm, chúng ta có thể tránh được tình huống này.

```js
function fn({ x, y = 5 } = {}) {
  console.log(x, y);
}

fn();
// undefined 5
```

Dưới đây là một ví dụ khác về gán giá trị mặc định kết hợp phân huỷ cấu trúc.

```js
function fetch(url, { body = '', method = 'GET', headers = {} }) {
  console.log(method);
}

fetch('http://example.com', {});
// "GET"

fetch('http://example.com');
// VM1292:1 Uncaught TypeError: Cannot read property 'body' of undefined
//    at fetch (<anonymous>:1:23)
//    at <anonymous>:5:1
```

Trong ví dụ trên, nếu tham số thứ hai của hàm `fetch` là một đối tượng, chúng ta có thể đặt giá trị mặc định cho ba thuộc tính của nó. Cú pháp này không thể bỏ qua đối số thứ hai, nhưng khi kết hợp với giá trị mặc định của tham số hàm, chúng ta có thể bỏ qua đối số thứ hai. Khi đó, giá trị mặc định của giá trị gán sẽ được áp dụng và biến `method` sẽ nhận giá trị mặc định là `GET`.

```js
function fetch(url, { body = '', method = 'GET', headers = {} } = {}) {
  console.log(method);
}

fetch('http://example.com');
// "GET"
```

Trong ví dụ trên, khi hàm `fetch` không có đối số thứ hai, giá trị mặc định của tham số hàm sẽ được áp dụng, sau đó mới áp dụng giá trị gán mặc định của giải pháp gán giá trị. Biến `method` sẽ nhận giá trị mặc định là `GET`.

### Kết hợp với phân tích cú pháp

```js
// Cách viết 1
function fn1({ x = 0, y = 0 } = {}) {
  return [x, y];
}

// Cách viết 2
function fn2({ x, y } = { x: 0, y: 0 }) {
  return [x, y];
}
```

Hai cách viết trên đều đặt giá trị mặc định cho tham số của hàm, khác nhau ở chỗ:

- Cách viết 1: Giá trị mặc định của tham số là một đối tượng rỗng, nhưng có giá trị mặc định cho phân tích cú pháp đối tượng.
- Cách viết 2: Giá trị mặc định của tham số là một đối tượng có các thuộc tính cụ thể, nhưng không có giá trị mặc định cho phân tích cú pháp đối tượng.

```js
// Trường hợp không có tham số cho hàm
fn1();
// [0, 0]
fn2();
// [0, 0]

// Trường hợp cả x và y đều có giá trị
fn1({ x: 3, y: 8 });
// [3, 8]
fn2({ x: 3, y: 8 });
// [3, 8]

// Trường hợp chỉ có x có giá trị, y không có giá trị
fn1({ x: 3 });
// [3, 0]
fn2({ x: 3 });
// [3, undefined]

// Trường hợp cả x và y đều không có giá trị
fn1({});
// [0, 0];
fn2({});
// [undefined, undefined]

fn1({ z: 3 });
// [0, 0]
fn2({ z: 3 });
// [undefined, undefined]
```

## Vị trí của giá trị mặc định của tham số

Thường thì, các tham số được đặt giá trị mặc định nên ở cuối danh sách tham số của hàm. Điều này giúp dễ nhìn ra những tham số nào đã được bỏ qua. Nếu đặt giá trị mặc định cho các tham số không ở cuối danh sách, thực tế thì các tham số này không thể bị bỏ qua.

```js
// Ví dụ 1
function fn(x = 1, y) {
    return [x, y];
}

fn();
// [1, undefined]

fn(2);
// [2, undefined]

fn(, 1);
// Uncaught SyntaxError: Unexpected token ,

fn(undefined, 1);
// [1, 1]

// Ví dụ 2
function bar(x, y = 5, z) {
    return [x, y, z];
}

bar();
// [undefined, 5, undefined]

bar(1);
// [1, 5, undefined]

bar(1, ,2);
// Uncaught SyntaxError: Unexpected token ,

bar(1, undefined, 2);
// [1, 5, 2]
```

Nếu truyền giá trị `undefined`, thì tham số sẽ được gán giá trị mặc định. Nhưng nếu truyền giá trị `null`, thì không có hiệu lực gán giá trị mặc định.

```js
function fn(x = 5, y = 6) {
  console.log(x, y);
}

fn(undefined, null);
// 5 null
```

## Thuộc tính `length` của hàm

Khi chỉ định giá trị mặc định cho các tham số, thuộc tính `length` của hàm sẽ trả về số lượng tham số không được chỉ định giá trị mặc định. Điều này có nghĩa là khi chỉ định giá trị mặc định, thuộc tính `length` sẽ bị sai lệch.

Ví dụ 1: Một tham số không có giá trị mặc định

```js
(function(a) {}.length);
// 1
```

Ví dụ 2: Một tham số có giá trị mặc định

```js
(function(a = 5) {}.length);
// 0
```

Ví dụ 3: Ba tham số, một trong số đó có giá trị mặc định

```js
(function(a, b, c = 5) {}.length);
// 2
```

Trong ví dụ trên, giá trị của thuộc tính `length` là số lượng tham số mà hàm mong đợi nhận. Ví dụ cuối cùng, hàm được định nghĩa với 3 tham số, trong đó một tham số `c` có giá trị mặc định. Do đó, giá trị của thuộc tính `length` là `3` trừ đi `1`, kết quả là `2`.

Điều này là vì ý nghĩa của thuộc tính `length` là số lượng tham số dự kiến được truyền vào. Khi một tham số được chỉ định giá trị mặc định, số lượng tham số dự kiến không bao gồm tham số đó. Tương tự, tham số rest cũng không được tính vào thuộc tính `length`.

```js
(function(...args) {}.length); // 0
```

Nếu một tham số có giá trị mặc định không phải là tham số cuối cùng, thì thuộc tính `length` cũng không tính các tham số sau đó.

```js
(function(a = 0, b, c) {}.length(
  // 0

  function(a, b = 1, c) {}
).length);
// 1
```

## Phạm vi của tham số

Khi một giá trị mặc định cho tham số được đặt, thì khi khai báo và khởi tạo hàm, tham số sẽ tạo ra một phạm vi riêng biệt. Sau khi khởi tạo kết thúc, phạm vi này sẽ biến mất. Hành vi ngôn ngữ này không xảy ra khi không đặt giá trị mặc định cho tham số.

```js
var x = 1;

function fn(x, y = x) {
  console.log(y);
}

f(2); // 2
```

Trong đoạn mã trên, giá trị mặc định của tham số `y` là giá trị của biến `x`. Khi gọi hàm `fn`, tham số tạo ra một phạm vi riêng biệt. Trong phạm vi này, biến mặc định `x` trỏ đến tham số đầu tiên `x`, chứ không phải là biến toàn cục `x`, do đó kết quả in ra là `2`.

Xem ví dụ dưới đây.

```js
let x = 1;

function fn(y = x) {
  let x = 2;
  console.log(y);
}

fn(); // 1
```

Trong đoạn mã trên, khi gọi hàm `fn`, tham số `y = x` tạo ra một phạm vi riêng biệt. Trong phạm vi này, biến `x` không được định nghĩa, nên nó trỏ đến biến toàn cục `x`. Do đó, kết quả in ra là `1`.

Nếu biến toàn cục `x` không tồn tại, sẽ xảy ra lỗi.

```js
function fn(y = x) {
  let x = 2;
  console.log(y);
}

fn(); // ReferenceError: x is not defined
```

Đoạn mã trên, biến `x` trong hàm `fn` trỏ đến biến bên ngoài, nhưng bên ngoài không có biến `x` được khai báo, nên sẽ xảy ra lỗi.

Viết như sau cũng sẽ xảy ra lỗi.

```js
var x = 1;

function fn(x = x) {
  // ...
}

fn(); // ReferenceError: x is not defined
```

Trong đoạn mã trên, tham số `x = x` tạo ra một phạm vi riêng biệt. Thực tế, nó tương đương với `let x = x`. Do hiện tượng "vùng chết tạm thời", dòng mã này sẽ báo lỗi `x is not defined` (đề cập đến biến `x` thứ hai chưa được định nghĩa).

Nếu giá trị mặc định của tham số là một hàm, phạm vi của hàm đó cũng tuân theo quy tắc này. Xem ví dụ dưới đây.

```js
let fn = 'outer';

function bar(func = () => fn) {
  let fn = 'inner';
  console.log(func());
}

bar(); // outer
```

Trong đoạn mã trên, giá trị mặc định của tham số `func` là một hàm vô danh, trả về giá trị của biến `fn`. Phạm vi của hàm tham số tạo ra không định nghĩa biến `fn`, nên `fn` trỏ đến biến toàn cục `fn`, do đó kết quả in ra là `outer`.

Nếu viết như sau, sẽ xảy ra lỗi.

```js
function bar(func = () => fn) {
  let fn = 'inner';
  console.log(func());
}

bar(); // ReferenceError: fn is not defined
```

Trong đoạn mã trên, biến `fn` trong hàm vô danh trỏ đến bên ngoài, nhưng bên ngoài không có biến `fn` được khai báo, nên sẽ xảy ra lỗi.

Dưới đây là một ví dụ phức tạp hơn.

```js
var x = 1;
function fn(
  x,
  y = function() {
    x = 2;
  }
) {
  var x = 3;
  y();
  console.log(x);
}

fn(); // 3
x; // 1
```

Trong đoạn mã trên, tham số của hàm `fn` tạo ra một phạm vi riêng biệt. Phạm vi này đầu tiên khai báo biến `x`, sau đó khai báo biến `y`, giá trị mặc định của `y` là một hàm vô danh. Biến `x` trong hàm vô danh trỏ đến tham số đầu tiên `x` của cùng một phạm vi. Trong hàm `fn`, biến `x` được khai báo lại, biến này không phải là biến `x` của tham số đầu tiên, nên sau khi thực thi `y()`, giá trị của biến `x` trong phạm vi nội bộ và biến toàn cục `x` không thay đổi.

Nếu loại bỏ từ khóa `var` trong dòng mã `var x = 3`, biến `x` trong phạm vi nội bộ của hàm `fn` sẽ trỏ đến tham số đầu tiên `x`, giống với biến `x` trong hàm vô danh, do đó kết quả in ra là `2`, và biến toàn cục `x` không bị ảnh hưởng.

```js
var x = 1;
function fn(
  x,
  y = function() {
    x = 2;
  }
) {
  x = 3;
  y();
  console.log(x);
}

fn();
// 2

console.log(x);
// 1
```

**Tóm lại:**

- Khi khai báo và khởi tạo hàm, nếu đặt giá trị mặc định cho tham số, tham số sẽ tạo ra một phạm vi riêng biệt, và sau khi khởi tạo kết thúc, phạm vi này sẽ biến mất. Hành vi này không xảy ra khi không đặt giá trị mặc định cho tham số.
- Biến trong phạm vi tham số sẽ được tìm kiếm trước trong phạm vi tham số đã khai báo trước, nếu không tồn tại, sẽ tìm kiếm trong phạm vi bên ngoài (không tìm kiếm trong phạm vi nội bộ của hàm).
  - Nếu tham số đã khai báo trước đã được định nghĩa, giá trị của biến sẽ là giá trị đã được định nghĩa cho tham số đó.
  - Nếu tham số đã khai báo trước chưa được định nghĩa và không có biến cùng tên đã được định nghĩa trong phạm vi bên ngoài, sẽ xảy ra lỗi.
- Nếu giá trị mặc định của tham số là một hàm, phạm vi của hàm đó cũng tuân theo quy tắc trên.
  - Khi phạm vi nội bộ của hàm khai báo lại biến cùng tên với tham số đã có, biến đó và tham số cùng tên không phải là cùng một biến.
  - Khi phạm vi nội bộ của hàm có biến cùng tên (không khai báo lại), biến đó sẽ trỏ đến tham số của hàm.

## Loại bỏ đối tượng tham số

Bây giờ chúng ta đã thấy rằng đối tượng `arguments` có thể được thay thế hoàn hảo bằng các tham số không định và tham số mặc định, việc loại bỏ `arguments` thường làm mã code dễ đọc hơn. Ngoài việc làm suy giảm tính đọc được, như chúng ta đã biết, việc tối ưu hóa máy ảo JavaScript cho đối tượng `arguments` có thể gây ra một số vấn đề đáng đau đầu.

Chúng ta mong muốn tham số không định và tham số mặc định có thể hoàn toàn thay thế `arguments`, để đạt được mục tiêu này, tiêu chuẩn đã thêm các hạn chế tương ứng: trong các hàm sử dụng tham số không định hoặc tham số mặc định, không được sử dụng đối tượng `arguments`. Các trình duyệt đã từng triển khai `arguments` không sẽ ngay lập tức loại bỏ hỗ trợ cho nó, tuy nhiên, hiện tại, chúng ta khuyến nghị sử dụng tham số không xác định và tham số mặc định.
