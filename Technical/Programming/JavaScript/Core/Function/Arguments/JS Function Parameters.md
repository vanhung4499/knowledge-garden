---
title: JS Function Parameters
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-04
date modified: 2023-08-05
---

# Tham số của hàm

## arguments

Trong JavaScript, định nghĩa hàm không xác định kiểu tham số của hàm, và khi gọi hàm cũng không kiểm tra kiểu của đối số được truyền vào. Trên thực tế, cuộc gọi hàm trong JavaScript thậm chí không kiểm tra số lượng tham số được truyền vào.

```js
function foo(x) {
  return x + 1;
}

console.log(foo(1));
// 2
console.log(foo('1'));
// '11'
console.log(foo());
// NaN
console.log(foo(1, 2));
// 2
```

### Tham số trùng tên

Trong chế độ không nghiêm ngặt, hàm có thể có các tham số trùng tên và chỉ có thể truy cập vào tham số cuối cùng có cùng tên.

```js
function foo(x, x, x) {
  console.log(x);
}

foo(1, 2, 3);
// 3
```

Tuy nhiên, trong chế độ nghiêm ngặt, việc có các tham số trùng tên sẽ gây ra lỗi cú pháp.

```js
function foo(x, x, x) {
  'use strict';
  console.log(x);
}

foo(1, 2, 3);
// SyntaxError: Duplicate parameter name not allowed in this context
```

### Số lượng tham số

Khi số lượng tham số thực tế ít hơn số lượng tham số được khai báo trong hàm, các tham số còn lại sẽ được đặt giá trị là `undefined`.

```js
function foo(x, y) {
  console.log(x, y);
  // 1 undefined
}

foo(1);
```

**Thiết lập giá trị mặc định:**

Thường ta sử dụng toán tử hoặc logic để đặt giá trị mặc định hợp lý cho các tham số bị bỏ qua.

```js
function foo(x, y) {
  y = y || 2;
  console.log(x, y);
  // 1 2
}

foo(1);
```

Thực tế, sử dụng `y || 2` không hoàn toàn chính xác, vì việc đặt giá trị sai (giá trị sai là `undefined`, `null`, `false`, `0`, `-0`, `''`, `NaN`) cũng sẽ cho kết quả tương tự. Do đó, ta nên đặt giá trị mặc định phù hợp dựa trên tình huống cụ thể.

Khi số lượng tham số thực tế lớn hơn số lượng tham số được khai báo, các tham số thừa không thể truy cập trực tiếp, mà phải sử dụng đối tượng `arguments` sẽ được giới thiệu sau.

Tham số trong JavaScript được biểu diễn bằng một mảng trong bên trong. Hàm nhận vào luôn là mảng này, không quan tâm mảng này chứa những tham số nào. Trong thân hàm, ta có thể truy cập vào mảng tham số này thông qua đối tượng `arguments`, từ đó lấy được từng tham số được truyền vào hàm.

Đối tượng `arguments` không phải là một thể hiện của `Array`, nó là một đối tượng giống mảng, có thể truy cập vào từng phần tử thông qua cú pháp dấu ngoặc vuông.

```js
function foo(x) {
  console.log(arguments[0], arguments[1], arguments[2]);
  // 1 2 3
  return x + 1;
}
foo(1, 2, 3);
```

Thuộc tính `length` của đối tượng `arguments` hiển thị số lượng tham số thực tế, thuộc tính `length` của hàm hiển thị số lượng tham số được khai báo.

```js
function fn(x, y) {
  console.log(arguments.length);
  // 3
}

fn(1, 2, 3);
console.log(fn.length);
// 2
```

Tham số được khai báo chỉ là để tiện lợi, không bắt buộc.

```js
function foo() {
  console.log(arguments[0]);
  // 1
  console.log(arguments[1]);
  // 2
}
```

Khi một hàm có hơn 3 tham số, việc gọi hàm với thứ tự tham số chính xác thật khó khăn.

```js
function fn(
  /*array*/ from,
  /*index*/ form_start,
  /*array*/ to,
  /*index*/ to_start,
  /*integer*/ length
) {
  // làm gì đó
}
```

Sử dụng cú pháp key/value để truyền tham số, thứ tự của tham số không quan trọng nữa. Khi định nghĩa hàm, các tham số được ghi vào một đối tượng riêng biệt, và khi gọi hàm, truyền vào một đối tượng, các cặp key/value trong đối tượng này là dữ liệu thực sự của tham số.

```js
function fn(args) {
  fn(args.from, args.from_start || 0, args.to, args.to_start || 0, args.length);
}

const a = [1, 2, 3, 4],
  b = [];

fn({ from: a, to: b, length: 4 });
```

[[JS Rest Parameters|Tham số còn lại (Rest parameters)]] trong ES6 giải quyết hiệu quả vấn đề số lượng tham số quá nhiều và thứ tự của tham số.

### Đồng bộ

Khi số lượng tham số và số lượng đối số bằng nhau, giá trị của đối số và đối tượng `arguments` tương ứng được đồng bộ.

```js
function foo(num1, num2) {
  console.log(num1, arguments[0]);
  // 1 1

  arguments[0] = 2;
  console.log(num1, arguments[0]);
  // 2 2

  num1 = 10;
  console.log(num1, arguments[0]);
  // 10 10
}

foo(1);
```

Mặc dù các tham số được đặt tên và giá trị của đối tượng `arguments` tương ứng là giống nhau, nhưng chúng không phải là cùng một không gian tên. Chúng có không gian tên riêng biệt, nhưng giá trị của chúng được đồng bộ.

Tuy nhiên, trong chế độ nghiêm ngặt, giá trị của đối tượng `arguments` và tham số là độc lập.

```js
function fn(num1, num2) {
  'use strict';
  console.log(num1, arguments[0]);
  // 1 1

  arguments[0] = 2;
  console.log(num1, arguments[0]);
  // 1 2

  num1 = 10;
  console.log(num1, arguments[0]);
  // 10 2
}

fn(1);
```

Khi không có đối số tương ứng với tham số, giá trị của đối tượng `arguments` và tham số không tương ứng.

```js
function fn(num1, num2) {
  console.log(num1, arguments[0]); //undefined,undefined

  num1 = 10;

  arguments[0] = 5;

  console.log(num1, arguments[0]); //10,5
}

fn();
```

## Thuộc tính nội bộ

### callee

Đối tượng `arguments` có một thuộc tính được gọi là `callee`, thuộc tính này là một con trỏ trỏ tới hàm mà sở hữu đối tượng `arguments` này.

Dưới đây là một ví dụ về hàm giai thừa:

```js
function fn(num) {
  if (num <= 1) {
    return 1;
  } else {
    return num * fn(num - 1);
  }
}
console.log(fn(5)); // 120
```

Tuy nhiên, việc thực thi hàm trên liên quan chặt chẽ đến tên hàm, có thể sử dụng `arguments.callee` để loại bỏ sự phụ thuộc vào tên hàm.

```js
function fn(num) {
  if (num <= 1) {
    return 1;
  } else {
    return num * arguments.callee(num - 1);
  }
}
console.log(fn(5));
// 120
```

Tuy nhiên, trong chế độ nghiêm ngặt, truy cập thuộc tính này sẽ gây ra lỗi TypeError.

```js
function fn(num) {
  'use strict';
  if (num <= 1) {
    return 1;
  } else {
    return num * arguments.callee(num - 1);
  }
}

console.log(fn(5));
// TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them
```

Trong trường hợp này, có thể sử dụng biểu thức hàm có tên.

```js
const fn = function fn(num) {
  if (num <= 1) {
    return 1;
  } else {
    return num * fn(num - 1);
  }
};
console.log(fn(5)); //120
```

### caller

Thực tế có hai thuộc tính `caller`.

#### Caller của hàm

Thuộc tính `caller` của hàm lưu trữ tham chiếu đến hàm gọi hàm hiện tại. Nếu hàm được gọi trong phạm vi toàn cục, giá trị của thuộc tính này là `null`.

```js
function foo() {
  bar();
}

function bar() {
  console.log(bar.caller);
  // foo(){ bar(); }
}

foo();
```

```js
function foo() {
  console.log(foo.caller);
  // null
}
foo();
```

Trong chế độ nghiêm ngặt, truy cập thuộc tính này sẽ gây ra lỗi TypeError.

```js
function foo() {
  'use strict';
  // TypeError: 'caller' and 'arguments' are restricted function properties and cannot be accessed in this context
  console.log(foo.caller);
}
foo();
```

#### Caller của đối tượng `arguments`

Thuộc tính này luôn luôn là `undefined`, thuộc tính này được định nghĩa để phân biệt giữa `arguments.caller` và thuộc tính `caller` của hàm.

```js
function foo(x) {
  console.log(arguments.caller);
  // undefined
}
foo(1);
```

Tương tự, trong chế độ nghiêm ngặt, truy cập thuộc tính này sẽ gây ra lỗi TypeError.

```js
function foo(x) {
  'use strict';
  // TypeError: 'caller' and 'arguments' are restricted function properties and cannot be accessed in this context
  console.log(arguments.caller);
}
foo(1);
```

## Truyền tham số

Trong JavaScript, tất cả các tham số của hàm đều được truyền theo giá trị. Điều này có nghĩa là giá trị từ bên ngoài hàm sẽ được sao chép vào các tham số trong hàm, tương tự như việc sao chép giá trị từ một biến sang một biến khác.

### Giá trị của kiểu cơ bản

Khi truyền giá trị của kiểu cơ bản vào tham số, giá trị được sao chép vào một biến cục bộ (tham số đặt tên hoặc một phần tử của đối tượng `arguments`).

```js
function foo(x) {
  x = 1;
  return x;
}
let y = 2;
let result = foo(y);

console.log(y);
// 2 không thay đổi
console.log(result);
// 1
```

### Giá trị của kiểu tham chiếu

Khi truyền giá trị của kiểu tham chiếu vào tham số, địa chỉ bộ nhớ của giá trị này được sao chép vào một biến cục bộ, do đó các thay đổi trong biến cục bộ này sẽ phản ánh ra bên ngoài hàm.

```js
function foo(x) {
  x.name = 'ABC';
}

var y = {};
foo(y);

console.log(y.name);
// 'ABC'
```

Khi ghi đè lên tham số kiểu tham chiếu trong hàm, biến này sẽ trỏ đến một đối tượng cục bộ. Đối tượng cục bộ này sẽ bị hủy ngay sau khi hàm thực thi xong.

```js
function foo(obj) {
  obj.name = 'black';
  console.log(person.name); // 'black'

  obj = {};
  obj.name = 'white';

  console.log(person.name); // 'black'
}

var person = {};
foo(person);
```

## Nạp chồng hàm

Trong JavaScript, hàm không thể được nạp chồng (overloading) theo nghĩa truyền thống. Trong các ngôn ngữ khác, bạn có thể viết hai định nghĩa cho một hàm, miễn là hai định nghĩa này có các chữ ký khác nhau (loại và số lượng tham số được chấp nhận).

JavaScript không có chữ ký hàm, vì các tham số được biểu thị bằng một mảng chứa không có hoặc nhiều giá trị. Vì không có chữ ký hàm, việc thực sự nạp chồng là không thể.

```js
// Khai báo sau ghi đè lên khai báo trước
function addSomeNumber(num) {
  return num + 100;
}
function addSomeNumber(num) {
  return num + 200;
}
var result = addSomeNumber(100);
// 300
```

Để mô phỏng việc nạp chồng hàm, bạn chỉ có thể kiểm tra loại và số lượng tham số được truyền vào hàm và thực hiện các hành động khác nhau dựa trên điều này.

```js
function doAdd() {
  if (arguments.length == 1) {
    alert(arguments[0] + 10);
  } else if (arguments.length == 2) {
    alert(arguments[0] + arguments[1]);
  }
}

doAdd(10);
// 20
doAdd(30, 20);
// 50
```
