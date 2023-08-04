---
title: JS Class Structure Function
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Hàm tạo của lớp

## Cấu trúc gần giống lớp trong ES5

Trong ES5, cách tạo lớp là: tạo một hàm tạo, định nghĩa một phương thức và gán nó cho nguyên mẫu của hàm tạo.

```js
'use strict';
function Person(name) {
  this.name = name;
}

Person.prototype.sayName = function () {
  return this.name;
};

const faker = new Person('Faker');

console.log(faker.sayName());
// Faker
```

## Lớp trong ES6

Triển khai lớp trong ES6 rất đơn giản, chỉ cần khai báo lớp.

### Khai báo lớp

```js
class Person {
  // Tạo hàm tạo mới
  constructor(name) {
    // Thuộc tính riêng tư
    this.name = name;
  }

  // Định nghĩa một phương thức và gán nó cho nguyên mẫu của hàm tạo
  sayName() {
    return this.name
  }
}

const faker = new Person('Faker')；
console.log(faker.sayName());
// Faker
```

Khác với việc sử dụng hàm tạo trong ES5, trong ES6, chúng ta đặt triển khai nguyên mẫu trong lớp, nhưng bản chất vẫn giống nhau, đều cần tạo một tên lớp, sau đó triển khai hàm tạo và phương thức nguyên mẫu.

Thuộc tính riêng tư là thuộc tính trong một thể hiện và không xuất hiện trên nguyên mẫu, chỉ có thể tạo trong hàm tạo hoặc phương thức của lớp. Trong ví dụ này, `name` là một thuộc tính riêng tư. Tôi khuyến nghị bạn tạo tất cả các thuộc tính riêng tư trong hàm tạo để chỉ cần điều khiển tất cả các thuộc tính riêng tư chỉ từ một nơi.

Để định nghĩa thuộc tính riêng tư, chỉ cần định nghĩa `this.xx = xx` trong hàm tạo.

Lưu ý: `typeof Person` trả về `"function"`

**Khác biệt và đặc điểm của khai báo lớp và khai báo hàm**:

1. Khai báo hàm có thể được nâng lên, trong khi khai báo lớp không thể được nâng lên (tương tự với khai báo `let`)
2. Mã trong khai báo lớp tự động chạy trong chế độ nghiêm ngặt
3. Tất cả các phương thức trong lớp đều không thể liệt kê, trong khi trong các loại tùy chỉnh, bạn có thể chỉ định thuộc tính không thể liệt kê bằng cách sử dụng `Object.defineProperty()`
4. Mỗi lớp đều có một phương thức `[[constructor]]`
5. Chỉ có thể sử dụng `new` để gọi hàm tạo của lớp
6. Không thể thay đổi tên lớp trong lớp

### Sự tương đồng giữa lớp và hàm thông thường

1. Có thể truyền lớp như một tham số vào hàm

```js
// Tạo một lớp mới
let Person = class {
  sayName(){
    return 'Faker'
  }
}

// Hàm này trả về một thể hiện của lớp
function fn(Person) {
  return new Person();
}

// Truyền lớp Person vào hàm fn
const faker = fn(Person);

console.log(faker.sayName());
// Faker
```

2. Có thể tạo một đối tượng duy nhất bằng cách gọi ngay lập tức hàm tạo của lớp

Sử dụng biểu thức gọi lớp bằng từ khóa `new`, sau đó gọi biểu thức này bằng cách sử dụng cặp dấu ngoặc đơn.

```js
const faker = new class {
  constructor(name) {
    this.name = name;
  }
  sayName(){
    return this.name
  }
}('Faker')

console.log(faker.sayName());
// Faker
```

### Trình truy cập hàm

Lớp hỗ trợ định nghĩa thuộc tính truy cập trên nguyên mẫu.

Mặc dù nên tạo thuộc tính riêng tư trong hàm tạo của lớp, nhưng lớp cũng hỗ trợ định nghĩa thuộc tính truy cập trực tiếp trên nguyên mẫu. Khi tạo `getter`, cần thêm một khoảng trắng sau từ khóa `get` và sau đó là một định danh tương ứng; khi tạo `setter`, chỉ cần thay thế từ khóa `get` bằng từ khóa `set`.

```js
class Person {
  constructor(state) {
    this.state = state
  }

  // Tạo getter
  get myName() {
    return this.state.name
  }

  // Tạo setter
  set myName(name) {
    this.state.name = name
  }
}

// Lấy mô tả thuộc tính của đối tượng đã cho. Mô tả thuộc tính của đối tượng là thuộc tính mà đối tượng đã định nghĩa trực tiếp (không phải từ nguyên mẫu của đối tượng).
let descriptor = Object.getOwnPropertyDescriptor(Person.prototype, 'myName');

console.log('get' in descriptor);
// true

console.log(descriptor.enumerable);
// false không thể liệt kê
```

### Tên thành viên có thể tính toán

Tên thành viên có thể tính toán là việc sử dụng dấu ngoặc vuông để bao quanh một biểu thức, như trong ví dụ dưới đây, chúng ta định nghĩa một biến `methodName`, sau đó sử dụng `[methodName]` để đặt nó làm phương thức nguyên mẫu của lớp Person.

```js
const methodName = 'sayName';

class Person {
  constructor(name) {
    this.name = name;
  }
  [methodName]() {
    return this.name
  }
}

const faker = new Person('Faker')

faker.sayName();
// Faker
```

### Phương thức sinh

Một phương thức sinh là một hàm trả về một trình lặp. Trong lớp, chúng ta cũng có thể sử dụng phương thức sinh ra.

```js
class Person {
  *sayNum() {
    yield 1;
    yield 2;
    yield 3;
  }
}

const faker = new Person();

console.log(faker.sayNum().next());
// {done: false, value: 1}

console.log(faker.sayNum().next());
// {done: false, value: 1}

console.log(faker.sayNum().next());
// {done: false, value: 1}
```

Cách viết này khá thú vị, chúng ta thêm một phương thức nguyên mẫu và thay đổi một chút.

```js
class Person {
  *sayNum() {
    yield 1;
    yield 2;
    yield 3;
  }
  render(){
    // Trả về sayNum từ phương thức render, tương tự như cách thường được sử dụng trong React
    return this.sayNum()
  }
}

let faker = new Person();

console.log(faker.render().next());
// {done: false, value: 1}
```

### Thành viên tĩnh

Thành viên tĩnh là các phương thức hoặc thuộc tính được đặt trước tên phương thức hoặc thuộc tính bằng từ khóa `static`. Khác với các phương thức thông thường, các phương thức được đánh dấu bằng `static` không thể truy cập từ các thể hiện, mà chỉ có thể truy cập trực tiếp từ tên lớp.

```js
class Person {
  constructor(name) {
    this.name = name;
  }

  static create(name) {
    return new Person(name)
  }
}

const faker = Person.create('Faker');
console.log(faker.name);
// Faker

let ben = new Person();
console.log(ben.create('Ben'));
// ben.create is not a function
```

### Kế thừa và lớp con

Khi viết React, chúng ta thường tạo các thành phần tùy chỉnh kế thừa từ `React.Component`.

```js
class Person extends Component {
  constructor(props) {
    super(props)
  }
}
```

Person được gọi là lớp con. Trong lớp con, nếu sử dụng một hàm tạo, chúng ta phải sử dụng `super()`.

```js
class Person {
  constructor([name, age] = props){
    this.name = name;
    this.age = age;
  }
  sayHi() {
    return `Hi, my name is ${this.name}, and I'm ${this.age} years old.`;
  }
}

class Player extends Person {
  constructor(props) {
    super(props)
  }
}

let faker = new Player(['Faker', 22]);

console.log(faker.sayHi());
// Hi, my name is Faker, and I'm 22 years old.
```

Một số yêu cầu về việc sử dụng `super`:

1. Chỉ có thể sử dụng `super` trong lớp con, lớp con là lớp mới kế thừa từ lớp khác.
2. Gọi `super()` trước khi truy cập `this` trong hàm tạo, để khởi tạo `this`.

```js
// Không tốt
class Player extends Person {
  constructor(props) {
    this.name = 1
    // Phải gọi super() trước
    super(props)
  }
}
```

3. Nếu không muốn gọi `super`, bạn có thể làm cho hàm tạo của lớp trả về một đối tượng.

### Ghi đè phương thức của lớp

Chúng ta có thể ghi đè phương thức của lớp cha trong lớp con được kế thừa.

```js
class Person {
  constructor([name, age] = props){
    this.name = name;
    this.age = age;
  }
  sayHi() {
    return `Hi, my name is ${this.name}, and I'm ${this.age} years old.`;
  }
}

class Player extends Person {
  constructor(props) {
    super(props)
  }
  // Ghi đè phương thức sayHi, tính tích
  sayHi() {
    return `Hi, my name is ${this.name}, ${this.age}.`
  }
}

let faker = new Player(['Faker', 22]);

console.log(faker.sayName());
// Hi, my name is Faker, 22.`
```

### Kế thừa thành viên tĩnh

Các thành viên tĩnh của lớp cha cũng có thể được kế thừa vào lớp con. Các thành viên tĩnh được kế thừa chỉ có thể truy cập thông qua lớp con, không thể truy cập thông qua thể hiện của lớp con.

```js
class Person {
  constructor([name, age] = props) {
    this.name = name;
    this.age = age
  }
  static say([name, age] = props) {
    return `${name}, ${age}`;
  }
}

class Player extends Person {
  constructor(props) {
    super(props)
  }
}

const faker = new Play(['Faker', 22])

console.log(faker.say([2, 3]));
// 5
```

### Lớp dẫn xuất từ biểu thức

Điều này đơn giản là có nghĩa là lớp cha có thể là một biểu thức.

```js
function Rectangle(length, ){
  // làm gì đó
}

class Square extends Rectangle {
// làm gì đó
}
```
