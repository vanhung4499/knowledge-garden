---
title: JS Block Scope
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Phạm vi khối (Block Scope)

> Bất kỳ tập hợp câu lệnh nào nằm trong cặp dấu ngoặc nhọn đều thuộc về một khối, và tất cả các biến được định nghĩa trong khối đó đều không thể nhìn thấy từ bên ngoài, chúng ta gọi đó là **phạm vi khối**.

Mặc dù phạm vi hàm là đơn vị phạm vi phổ biến nhất và là phương pháp thiết kế chủ yếu trong hầu hết JavaScript hiện đại, nhưng cũng có các đơn vị phạm vi khác tồn tại và có thể sử dụng các đơn vị phạm vi khác để tạo ra mã dễ bảo trì và gọn gàng hơn, ví dụ như phạm vi khối.

## Từ khóa khai báo

### var

Trong ES5 và trước đó, không có khái niệm biến khối, thay vào đó, người ta thường sử dụng **closure** để ngăn rò rỉ bộ nhớ.

Dưới đây là một số đặc điểm của khai báo `var` trong ES5:

- Biến trong hàm, nếu được khai báo bằng `var`, sẽ ghi đè biến toàn cục bên ngoài **ưu tiên sử dụng**
- Nếu biến được khai báo trong hàm mà không có từ khóa `var`, nó sẽ ghi đè biến toàn cục cùng tên
- Có trường hợp biến được khai báo trong hàm được "nâng lên" trước khi khai báo, có thể sử dụng biến trước khi khai báo
- `var` trong vòng lặp `for` sẽ làm ô nhiễm không gian toàn cục (không chỉ trong vòng lặp)

🌰 **Ví dụ mã: Ưu tiên sử dụng**

```js
var foo = 5;

function bar() {
  var foo = 3;
  console.log(foo);
}

bar();
// 3
```

🌰 **Ví dụ mã: Nâng lên biến**

```js
var foo = 5;

function bar() {
  console.log(foo);
  var foo = 3;
}

// JavaScript cho phép sử dụng biến không tồn tại trước
// Mặc định sẽ được khởi tạo thành undefined
bar();
// undefined,
```

🌰 **Ví dụ mã: Ô nhiễm không gian toàn cục**

```js
for (var i = 0; i < 9; i++) {
  console.log('Bên trong vòng lặp' + i);
}

console.log(i);
// 9

console.log(i * 5);
// 45
```

### let

Khai báo `let` được sử dụng tương tự như `var`, và biến được khai báo chỉ có thể sử dụng trong khối và các khối con của nó. Sự khác biệt chính giữa hai loại khai báo là phạm vi của biến được khai báo bằng `var` là toàn bộ hàm bao quanh nó.

```js
function foo() {
  if(true) {
    var number = 5;
    console.log(number);
  }

  console.log(number);
}

function bar() {
  if(true) {
    let number = 5;
    console.log(number);
  }

  console.log(number);
}

foo(); // 5 và 5
bar(); // 5 và ReferenceError: number is not defined
```

Phạm vi của biến được khai báo bằng `let` chỉ là khối bên ngoài, không phải là toàn bộ hàm bên ngoài.

Chúng ta có thể sử dụng tính năng này để thay thế IIFE (Immediately Invoked Function Expression).

```js
/**
 * IIFE
 */
(function () {
  var number = 1;
  // làm gì đó
})();

/**
 * Khối
 */
{
  let number = 1;
  // làm gì đó
}
```

⚠️ **Lưu ý**:

- Không được phép khai báo lại biến cùng tên, sẽ gây ra lỗi, duy nhất
- Không được sử dụng biến trước khi khai báo, sẽ gây ra lỗi, chỉ có thể sử dụng sau khi khai báo
- Có tính chất closure riêng, ví dụ như trong vòng lặp `for`

### const

Cú pháp `const` tương tự như `let`, nhưng `const` phải được gán giá trị, nếu không sẽ gây ra lỗi.

```js
// Cú pháp
const number = 4;

// Gây lỗi nếu không khởi tạo
const t;
// SyntaxError: Missing initializer in const declaration
```

`const` cũng là phạm vi khối, có ý nghĩa tương tự `let`, được sử dụng để khai báo hằng số và không thể thay đổi giá trị sau khi khai báo.

⚠️ **Lưu ý**: Đáng chú ý là biến được khai báo bằng `const` lưu giữ **con trỏ**, không thể thay đổi con trỏ, nhưng nếu biến được khai báo bằng `const` là một đối tượng, nội dung của đối tượng vẫn có thể thay đổi.

```js
// Gây lỗi khi gán lại
const PI = 3.14;
PI = 3.1415926;
// TypeError: Assignment to constant variable.

// Thêm thuộc tính vào đối tượng không làm thay đổi con trỏ foo, nên không gây lỗi
const foo = { foo: 2 };
foo.bar = 3;
console.log(foo);
// {
//  foo: 2,
//  bar: 3
// }
```

⚠️ **Lưu ý**:

- Giống như `let`, duy nhất, **không thể khai báo lại**
- Có thể xem biến được khai báo bằng `const` là biến chỉ đọc (read-only) cho các kiểu dữ liệu cơ bản, nhưng biến được khai báo bằng `const` cho các kiểu dữ liệu tham chiếu vẫn có thể thay đổi

## Vùng chết tạm thời (Temporal Dead Zone - TDZ)

Biến được khai báo bằng `let` hoặc `const` sẽ gây ra lỗi nếu truy cập vào biến đó trước khi nó được khai báo và gán giá trị. Ngay cả việc sử dụng `typeof`, mà chúng ta thường coi là an toàn, cũng không còn an toàn nữa.

🌰 **Ví dụ mã**:

```js
// TDZ1
function foo() {
  // Bắt đầu TDZ
  console.log(typeof number);
  let number = 5; // Kết thúc TDZ
}

foo();
// ReferenceError: number is not defined
```

Lỗi được báo là `ReferenceError` (Lỗi tham chiếu), trong khi nếu sử dụng `var`, giá trị của `number` sẽ là `undefined`. Khu vực từ dòng đầu tiên của khối đến khai báo biến được gọi là **vùng chết tạm thời** (TDZ). Bất kỳ việc sử dụng biến trong vùng này đều sẽ gây ra lỗi.

🌰 **Ví dụ mã**:

```js
// TDZ2
function bar() {
  console.log(typeof number);
}

bar();
// undefined
```

Khi không sử dụng `let` để khai báo `number` trong hàm, giá trị của `number` sẽ là `undefined`. Lý thuyết là trước khi đến khai báo `let`, giá trị của `number` cũng nên là `5`, tuy nhiên hàm `foo` lại báo lỗi, điều này chứng tỏ rằng ngay cả trước khi đến khai báo `let`, biến đã có tác động. Điều này có nghĩa là `let` cũng có một loại "tạo lập" (hoisting), nhưng trong TDZ, việc sử dụng biến sẽ gây ra lỗi, không phải là `undefined`.

Thực tế, khi trình thông dịch JavaScript xem xét một khối mã có khai báo biến, đối với biến được khai báo bằng `var`, khai báo sẽ được di chuyển lên đầu phạm vi của hàm hoặc toàn bộ. Tuy nhiên, đối với biến được khai báo bằng `let` hoặc `const`, khai báo sẽ được đặt trong vùng chết tạm thời.

⚠️ **Lưu ý**: Mọi cố gắng truy cập biến trong vùng chết tạm thời sẽ gây ra **lỗi thời gian chạy** (Runtime Error). Chỉ khi đến câu lệnh khai báo biến, biến sẽ được loại bỏ khỏi vùng chết tạm thời và có thể sử dụng an toàn.

## Phạm vi khối rõ ràng

Trong phạm vi lồng nhau, việc sử dụng cùng một biến được khai báo bằng `let` là được phép. Phạm vi lồng nhau này được gọi là **phạm vi khối rõ ràng** trong ES6.

```js
var foo = 1;

{
  // Không gây lỗi
  let = 2;
  // các mã khác
}
```

Vì `let` và `const` là phạm vi khối, biến được khai báo sẽ được giải phóng sau khi khối hiện tại sử dụng xong, do đó, ngay cả khi sử dụng cùng một định danh, nó cũng không ghi đè biến trong phạm vi bên ngoài. Trong khi đó, `var` sẽ ghi đè biến trong phạm vi bên ngoài.

```js
function foo() {
  var bar = 1;
  {
    let bar = 2;
  }

  console.log(bar);
}

function zoo() {
  var bar = 1;
  {
    var bar = 2;
  }

  console.log(bar);
}

foo(); // 1
zoo(); // 2
```

Trong quá trình phát triển của ECMAScript 6, cách khai báo biến được chấp nhận rộng rãi là: mặc định nên sử dụng `let` thay vì `var`.

Đối với hầu hết các nhà phát triển JavaScript, cách thức hoạt động của `let` chính là cách thức hoạt động của `var` mà chúng ta mong muốn. Do đó, việc thay thế trực tiếp `var` bằng `let` là một cách tiếp cận logic hơn. Trong trường hợp này, bạn nên sử dụng `const` cho **các biến cần được bảo vệ**.

Mặc định nên sử dụng `const`, chỉ khi bạn biết rằng giá trị biến **cần được thay đổi**, hãy sử dụng `let`. Điều này đảm bảo tính không thay đổi cơ bản trong mã, giúp ngăn chặn một số loại lỗi.
