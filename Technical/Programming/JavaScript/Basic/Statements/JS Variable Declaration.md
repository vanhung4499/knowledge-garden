---
title: JS Variable Declaration
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Khai báo biến

Biến trong ECMAScript là kiểu dữ liệu lỏng lẻo, có nghĩa là nó có thể được sử dụng để lưu trữ bất kỳ loại dữ liệu nào. Nói cách khác, mỗi biến chỉ là một vị trí lưu trữ giá trị.

## Khai báo biến

### `var`

Câu lệnh `var` được sử dụng để khai báo một biến và tùy chọn khởi tạo nó với một giá trị.

Khai báo biến, bất kể nằm ở đâu, đều được xử lý trước khi thực thi bất kỳ mã nào. Phạm vi của biến được khai báo bằng `var` là ngữ cảnh thực thi hiện tại của nó, có thể là một hàm lồng nhau hoặc biến được khai báo bên ngoài bất kỳ hàm nào. Nếu bạn khai báo lại một biến JavaScript, nó sẽ không mất giá trị của nó.

Giá trị được gán cho một biến chưa được khai báo được tạo ngầm thành một biến toàn cục (nó sẽ trở thành một thuộc tính của đối tượng toàn cục). Sự khác biệt giữa biến được khai báo và không được khai báo là:

- Biến được khai báo có phạm vi giới hạn trong ngữ cảnh khai báo của nó, trong khi biến không được khai báo luôn là biến toàn cục.

```js
function x() {
  y = 1; // Trong chế độ nghiêm ngặt, nó sẽ ném ra ngoại lệ ReferenceError
  var z = 2;
}

x();

console.log(y); // In ra '1'
console.log(z); // Ném ra ngoại lệ ReferenceError: z chưa được khai báo
```

- Biến được khai báo được tạo ra trước bất kỳ mã nào được thực thi, trong khi biến không được khai báo chỉ được tạo ra khi gán giá trị.

```js
console.log(a); // Ném ra ngoại lệ ReferenceError

console.log('still going...'); // Không bao giờ được thực thi
```

```js
var a;

console.log(a); // In ra 'undefined' hoặc '' (khác nhau trong các triển khai trình duyệt khác nhau)

console.log('still going...'); // In ra 'still going...'
```

- Biến được khai báo là thuộc tính không thể cấu hình của ngữ cảnh mà nó nằm trong, trong khi biến không được khai báo là có thể cấu hình (ví dụ: biến không được khai báo có thể bị xóa).

```js
a = 1;
b = 2;

delete this.a; // Trong chế độ nghiêm ngặt, nó sẽ ném ra TypeError, trong các trường hợp khác, nó sẽ thất bại mà không có thông báo lỗi.
delete this.b;

console.log(a, b); // Ném ra ngoại lệ ReferenceError	// Thuộc tính 'b' đã bị xóa.
```

Do ba sự khác biệt này, việc không khai báo biến có thể dẫn đến kết quả không mong muốn. Do đó, luôn khuyến nghị khai báo biến, bất kể chúng có ở trong phạm vi hàm hay phạm vi toàn cục. Trong chế độ nghiêm ngặt của ECMAScript 5, việc gán giá trị cho biến chưa được khai báo sẽ gây ra lỗi.

⚠️ Vì các khai báo (cũng như các khai báo khác) luôn được xử lý trước bất kỳ mã nào được thực thi, việc khai báo biến ở bất kỳ vị trí nào trong mã luôn tương đương với việc khai báo biến ở đầu mã. Điều này có nghĩa là biến có thể được sử dụng trước khi được khai báo, đây được gọi là [[JS Hoisting]]. Hoisting là quá trình di chuyển tất cả các khai báo biến lên đầu của hàm hoặc mã toàn cục.

### Temporal Dead Zone

Temporal Dead Zone (TDZ) mô tả hiện tượng biến được khai báo bằng `let` và `const` không được hoisting.

Trong ECMAScript 2015, các khai báo `let` không bị ràng buộc bởi quy tắc **hoisting**, điều này có nghĩa là các khai báo `let` không được di chuyển lên đầu của ngữ cảnh thực thi hiện tại. Tham chiếu đến biến trước khi nó được khởi tạo trong khối sẽ gây ra `ReferenceError` (trong khi khai báo biến bằng `var` sẽ trả về `undefined`). Biến này nằm trong một "vùng chết tạm thời" cho đến khi nó được khởi tạo.

```js
{
  console.log(bar); // undefined
  console.log(foo); // ReferenceError: foo is not defined
  var bar = 1;
  let foo = 2;
}
```

Bạn có thể gặp lỗi như vậy trong các khối `switch`, vì nó chỉ có một khối.

```js
switch (x) {
  case 0:
    let foo;
    break;
  case 1:
    let foo; // TypeError vì đã khai báo lại biến
    break;
}
```

Tuy nhiên, quan trọng là lưu ý rằng các khối lồng nhau trong các mệnh đề `case` sẽ tạo ra một phạm vi từ điển mới, không gây ra lỗi khai báo lại như được hiển thị ở trên.

```js
let x = 1;

switch (x) {
  case 0: {
    let foo;
    break;
  }
  case 1: {
    let foo;
    break;
  }
}
```

### `const`

Câu lệnh `const` được sử dụng để tạo một hằng số, sau khi khai báo, giá trị của hằng số không thể thay đổi. Phạm vi của nó có thể là phạm vi toàn cục hoặc phạm vi khối mà nó được khai báo.

Biến được khai báo bằng `const` có các đặc điểm sau:

1. `const`, giống như `let`, không cho phép khai báo lại biến cùng tên, nếu có sẽ gây ra lỗi.
2. `const`, giống như `let`, không có hoisting, biến chỉ có thể sử dụng sau khi được khai báo.
3. `const` chỉ có hiệu lực trong phạm vi khối nơi nó được khai báo.
4. Biến được khai báo bằng `const` có thể hiểu là biến chỉ đọc, nhưng không phải là không thay đổi.

Khai báo hằng số yêu cầu một giá trị khởi tạo.

```js
const b; 	// SyntaxError: missing = in const declaration
```

Hằng số có thể được khai báo là một đối tượng.

```js
const c = { key: 'value' };

// Gán lại đối tượng sẽ thất bại
c = { OTHER_KEY: 'value' };

// Thuộc tính của đối tượng không nằm trong phạm vi bảo vệ, khai báo dưới đây sẽ thành công
c.key = 'otherValue';
```

Hằng số có thể được khai báo là một mảng.

```js
const d = [];

d.push('A'); // ["A"]

d = ['B']; // TypeError: Assignment to constant variable.
```

## Phạm vi biến

Biến được khai báo bên ngoài tất cả các hàm được gọi là biến toàn cục, vì nó có thể được truy cập bởi bất kỳ mã code nào khác trong tài liệu hiện tại. Biến được khai báo bên trong một hàm được gọi là biến cục bộ, vì nó chỉ có thể được truy cập trong hàm đó.

Trước ECMAScript 6, JavaScript không có phạm vi khối lệnh; thay vào đó, biến được khai báo trong khối lệnh sẽ trở thành biến cục bộ của đoạn mã chứa khối lệnh đó. Ví dụ, đoạn mã dưới đây sẽ in ra 5 trên console, vì phạm vi của x là hàm (hoặc phạm vi toàn cục) mà x được khai báo, chứ không phải khối lệnh `if`.

```js
if (true) {
  var x = 5;
}
console.log(x); // 5
```

Nếu sử dụng khai báo let trong ECMAScript 6, hành vi trên sẽ thay đổi.

```js
if (true) {
  let y = 5;
}
console.log(y); // ReferenceError: y is not defined
```

## Kiểu dữ liệu của biến

Xem chi tiết tại [[JS Data Types]]
