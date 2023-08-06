---
title: JS Class Basic
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-06
date modified: 2023-08-06
---

# Cú pháp cơ bản của lớp

Khái niệm lớp (class) trong ECMAScript 6 (ES6) thực tế có thể coi là một cú pháp đường dẫn cho cách viết nguyên mẫu đối tượng trong ECMAScript 5 (ES5).

## Cú pháp cơ bản

Sử dụng ES5 để triển khai nguyên mẫu đối tượng:

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ',' + this.y + ')';
};

var p = new Point(1, 2);
```

Sử dụng ES6 để triển khai nguyên mẫu đối tượng:

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  toString() {
    return '(' + this.x + ',' + this.y + ')';
  }
}
```

## Hình thức biểu diễn

Lớp có hai hình thức biểu diễn: khai báo và biểu thức.

### Khai báo lớp

Tương tự như ES5, lớp cũng được tạo ra bằng từ khóa `new` để tạo ra một thể hiện đối tượng.

Tuy nhiên, khác với ES5, trong ES6, chúng ta triển khai nguyên mẫu trong lớp, nhưng bản chất vẫn giống nhau, đều cần tạo một tên lớp, sau đó triển khai hàm tạo và các phương thức nguyên mẫu.

```js
class Foo(){
  // Hàm tạo
  constructor(name = 'Tom'){
    this.name = name
  }

  // Định nghĩa một phương thức và gán cho nguyên mẫu của hàm tạo
  sayName(){
    console.log(this.name)
  }
}

const foo = new Foo()
foo.sayName()
// 'Tom'
```

Sự khác biệt và đặc điểm giữa khai báo hàm và khai báo lớp:

1. Khai báo hàm có thể được nâng lên (hoisted), trong khi khai báo lớp không thể nâng lên (tương tự như khai báo `let`).
2. Mã trong lớp được tự động chạy trong chế độ nghiêm ngặt (strict mode).
3. Chỉ có thể khai báo lớp bằng từ khóa `new`, việc khai báo lớp sẽ gọi hàm tạo của lớp.
4. Mỗi lớp đều có một phương thức `[[construct]]`, phương thức này chính là hàm tạo.
5. Tất cả các phương thức của lớp được định nghĩa trong thuộc tính `prototype` của lớp.
6. Các phương thức trong lớp không cần thêm từ khóa `function`, chỉ cần thêm trực tiếp vào lớp.
7. Các phương thức không cần thêm dấu phẩy (`,`), nếu thêm sẽ gây lỗi.
8. Tất cả các phương thức trong lớp đều là không thể liệt kê (non-enumerable), trong khi các kiểu tùy chỉnh có thể sử dụng `Object.defineProperty()` để chỉ định thuộc tính không thể liệt kê.
9. Gọi phương thức trên thể hiện của lớp, thực chất là gọi phương thức trên nguyên mẫu.
10. Không thể thay đổi tên lớp trong lớp.
11. Thuộc tính `name` luôn trả về tên lớp ngay sau từ khóa `class`.
12. `this` mặc định trỏ đến thể hiện của lớp.

### Biểu thức lớp

```js
// Biểu thức
// Lớp này có tên là Baz2 thay vì Baz1
// Baz1 chỉ có thể sử dụng trong mã lớp, đại diện cho lớp hiện tại
const Baz2 = class Baz1 {
  constructor() {}
  getClassName() {
    return Baz1.name;
  }
};
```

## Cấu tạo của lớp

### Hàm tạo

Hàm tạo (`constructor` method) là phương thức mặc định của lớp, được tự động gọi khi tạo ra một thể hiện đối tượng bằng từ khóa `new`. Nếu không được định nghĩa rõ ràng, một hàm tạo rỗng sẽ được tự động thêm vào.

> ⚠️ **Lưu ý**: Lớp phải được gọi bằng từ khóa `new`, nếu không sẽ gây ra lỗi. Điều này là một khác biệt chính giữa lớp và hàm tạo thông thường, vì hàm tạo thông thường có thể được thực thi mà không cần từ khóa `new`.

### Đối tượng thể hiện

Giống như ES5, các thuộc tính của đối tượng thể hiện (`instance object`) ngoại trừ được định nghĩa rõ ràng trên chính đối tượng thể hiện (`this`), tất cả các thuộc tính khác đều được định nghĩa trên **đối tượng nguyên mẫu** (`prototype object`) (tức là định nghĩa trên lớp).

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

const point = new Point(2, 3);

// Sau khi khởi tạo lớp, các thuộc tính được gắn trên this sẽ được gắn trên đối tượng thể hiện
point.toString();
// (2, 3)
point.hasOwnProperty('x');
// true
point.hasOwnProperty('y');
// true

// Các phương thức được gắn trên nguyên mẫu
point.hasOwnProperty('toString');
// false
point.__proto__.hasOwnProperty('toString');
// true
```

- Biến `x` và `y` là thuộc tính của đối tượng thể hiện `point` (vì được định nghĩa trên biến `this`)
- `toString` là thuộc tính của đối tượng nguyên mẫu (vì được định nghĩa trên lớp `Point`)

Giống như ES5, tất cả các thể hiện của lớp chia sẻ một đối tượng nguyên mẫu. Điều này có nghĩa là có thể thêm phương thức cho lớp bằng cách sử dụng thuộc tính `__proto__` của thể hiện.

> `__proto__` không phải là một tính năng của ngôn ngữ JavaScript, đây là một thuộc tính riêng được thêm vào bởi các triển khai cụ thể của các trình duyệt JavaScript. Mặc dù hiện tại nhiều trình duyệt hiện đại đã cung cấp thuộc tính riêng này, nhưng không khuyến nghị sử dụng trong môi trường production để tránh phụ thuộc vào môi trường.
>
> Trong môi trường production, chúng ta có thể sử dụng phương thức `Object.getPrototypeOf` để lấy đối tượng nguyên mẫu của thể hiện và sau đó thêm phương thức hoặc thuộc tính vào nguyên mẫu.

### Thuộc tính truy cập

Giống như ES5, trong lớp cũng có thể sử dụng từ khóa `get` và `set` để định nghĩa một **hàm gán giá trị (setter)** và **hàm lấy giá trị (getter)** cho một thuộc tính, từ đó kiểm soát quá trình gán và lấy giá trị của thuộc tính đó.

Mặc dù nên tạo thuộc tính của riêng mình trong hàm tạo của lớp, nhưng lớp cũng hỗ trợ việc định nghĩa thuộc tính truy cập trực tiếp trên nguyên mẫu.

```js
class Student () {
  constructor () {
    // ...
  }
  get run () {
    return 'get'
  }
  set run (value) {
    console.log(`set: ${value}`)
  }
}

let inst = new Student()

Student.run = 'abc'
// set: abc

Student.run
// get
```

### Thuộc tính biểu thức

Tên thuộc tính của lớp có thể là biểu thức.

```js
const methodName = 'getArea'

class Square(){
  constructor(length){
    // ...
  }
  [methodName](){
    // ...
  }
}
```

### Phương thức sinh

Nếu một phương thức có dấu sao (`*`) trước nó, nghĩa là phương thức đó là một **phương thức sinh** (Generator function).

```js
class Foo {
  constructor(...args) {
    this.args = args;
  }
  *[Symbol.iterator]() {
    for (let arg of this.args) {
      yield arg;
    }
  }
}

for (let x of new Foo('hello', 'world')) {
  console.log(x);
}
// hello
// world
```

## Đối tượng `this` trong môi trường thực thi

Trong phương thức của lớp, nếu có sử dụng `this`, nó mặc định trỏ đến **thể hiện của lớp**.

Tuy nhiên, nếu phương thức bên trong được trích xuất và sử dụng độc lập, `this` sẽ trỏ đến **môi trường thực thi của phương thức** và gây ra lỗi không tìm thấy phương thức tương ứng.

Do đó, cần **ràng buộc `this` trong hàm tạo** để tránh việc không tìm thấy phương thức tương ứng.

```js
class Student {
  constructor() {
    this.sayName = this.sayName.bind(this);
  }
}
```

Một cách giải quyết khác là sử dụng **hàm mũi tên (arrow function)**.

```js
class Car {
  constructor() {
    this.sayName = (name = 'BOT') => {
      this.sayName(`My name is ${name}`);
    };
  }
}
```

Một cách giải quyết khác là sử dụng `Proxy`, tự động ràng buộc `this` khi truy cập phương thức.
