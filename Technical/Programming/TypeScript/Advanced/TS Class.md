---
title: TS Class
tags:
  - ts
categories:
  - ts
date created: 2024-03-15
date modified: 2024-03-15
---

# Class

Trong JavaScript truyền thống, khái niệm class được thực hiện thông qua hàm khởi tạo và thừa kế thông qua chuỗi nguyên mẫu. Tuy nhiên, trong ES6, chúng ta cuối cùng cũng đã có `class`.

TypeScript không chỉ thực hiện tất cả các tính năng của class trong ES6, mà còn thêm một số tính năng mới.

Phần này chủ yếu giới thiệu cách sử dụng class, phần tiếp theo sẽ trình bày cách định nghĩa loại class.

## Khái niệm class

Mặc dù JavaScript có khái niệm class, nhưng có thể đa số các lập trình viên JavaScript không quen với class, dưới đây là một giới thiệu ngắn gọn về các khái niệm liên quan đến class.

- Lớp (Class): Định nghĩa các đặc điểm trừu tượng của một thực thể, bao gồm các thuộc tính và phương thức của nó
- Đối tượng (Object): Là một thực thể của class, được tạo ra bằng `new`
- Ba đặc tính chính của lập trình hướng đối tượng (OOP): Đóng gói, kế thừa, đa hình
- Đóng gói (Encapsulation): Ẩn chi tiết thao tác dữ liệu, chỉ tiết lộ giao diện bên ngoài. Đối tượng gọi không cần (và cũng không thể) biết chi tiết, chỉ cần thông qua giao diện mà đối tượng cung cấp để truy cập đối tượng đó, đồng thời cũng đảm bảo không thể thay đổi tùy ý dữ liệu bên trong đối tượng từ bên ngoài
- Kế thừa (Inheritance): class con kế thừa từ class cha, class con không chỉ có tất cả các đặc tính của class cha, mà còn có một số đặc tính cụ thể hơn
- Đa hình (Polymorphism): Do kế thừa tạo ra các class liên quan nhưng khác nhau, đối với cùng một phương thức có thể có các phản ứng khác nhau. Ví dụ, `Cat` và `Dog` đều kế thừa từ `Animal`, nhưng cả hai đều thực hiện phương thức `eat` của riêng mình. Trong trường hợp này, đối với một thực thể cụ thể, chúng ta không cần biết nó là `Cat` hay `Dog`, chỉ cần gọi trực tiếp phương thức `eat`, chương trình sẽ tự động xác định cách thực hiện `eat`
- Truy cập (getter & setter): Dùng để thay đổi hành vi đọc và gán giá trị cho thuộc tính
- Bộ điều chỉnh (Modifiers): Bộ điều chỉnh là một số từ khóa, được sử dụng để hạn chế tính chất của thành viên hoặc loại. Ví dụ, `public` biểu thị thuộc tính hoặc phương thức công cộng
- class trừu tượng (Abstract Class): class trừu tượng là class cơ sở để các class khác kế thừa, class trừu tượng không được phép khởi tạo. Phương thức trừu tượng trong class trừu tượng phải được thực hiện trong class con
- Giao diện (Interfaces): Các thuộc tính hoặc phương thức chung giữa các class khác nhau, có thể được trừu tượng hóa thành một giao diện. Giao diện có thể được thực hiện (implements) bởi class. Một class chỉ có thể kế thừa từ một class khác, nhưng có thể thực hiện nhiều giao diện

## Sử dụng class trong ES6

Dưới đây, chúng ta sẽ xem xét cách sử dụng class trong ES6, để biết thêm chi tiết, bạn có thể tham khảo [[JS Class Basic]].

### Thuộc tính và phương thức

Sử dụng `class` để định nghĩa class, sử dụng `constructor` để định nghĩa hàm khởi tạo.

Khi tạo một thực thể mới thông qua `new`, hàm khởi tạo sẽ được gọi tự động.

```js
class Animal {
    name;
    constructor(name) {
        this.name = name;
    }
    sayHi() {
        return `My name is ${this.name}`;
    }
}

let a = new Animal('Jack');
console.log(a.sayHi()); // My name is Jack
```

### Kế thừa class

Sử dụng từ khóa `extends` để thực hiện kế thừa, trong class con sử dụng từ khóa `super` để gọi hàm khởi tạo và phương thức của class cha.

```js
class Cat extends Animal {
  constructor(name) {
    super(name); // Gọi hàm khởi tạo của class cha Animal(name)
    console.log(this.name);
  }
  sayHi() {
    return 'Meow, ' + super.sayHi(); // Gọi phương thức sayHi() của class cha
  }
}

let c = new Cat('Tom'); // Tom
console.log(c.sayHi()); // Meow, My name is Tom
```

### Truy cập

Sử dụng getter và setter có thể thay đổi hành vi gán và đọc giá trị của thuộc tính:

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  get name() {
    return 'Jack';
  }
  set name(value) {
    console.log('setter: ' + value);
  }
}

let a = new Animal('Kitty'); // setter: Kitty
a.name = 'Tom'; // setter: Tom
console.log(a.name); // Jack
```

### Phương thức tĩnh

Phương thức được sửa đổi bằng `static` được gọi là phương thức tĩnh, chúng không cần khởi tạo, mà được gọi trực tiếp thông qua class:

```js
class Animal {
  static isAnimal(a) {
    return a instanceof Animal;
  }
}

let a = new Animal('Jack');
Animal.isAnimal(a); // true
a.isAnimal(a); // TypeError: a.isAnimal is not a function
```

## Sử dụng class trong ES7

ES7 đã đưa ra một số đề xuất về class, TypeScript cũng đã thực hiện chúng, dưới đây là một giới thiệu ngắn gọn.

### Thuộc tính thực thể

Trong ES6, thuộc tính của thực thể chỉ có thể được định nghĩa thông qua `this.xxx` trong hàm khởi tạo, trong đề xuất ES7, chúng có thể được định nghĩa trực tiếp trong class:

```js
class Animal {
  name = 'Jack';

  constructor() {
    // ...
  }
}

let a = new Animal();
console.log(a.name); // Jack
```

### Thuộc tính tĩnh

Trong đề xuất ES7, bạn có thể sử dụng `static` để định nghĩa một thuộc tính tĩnh:

```js
class Animal {
  static num = 42;

  constructor() {
    // ...
  }
}

console.log(Animal.num); // 42
```

## Sử dụng class trong TypeScript

### public, private và protected

TypeScript có thể sử dụng ba loại bộ điều chỉnh truy cập (Access Modifiers), lần lượt là `public`, `private` và `protected`.

- `public` được sử dụng để chỉ định rằng thuộc tính hoặc phương thức là công khai, có thể được truy cập từ bất kỳ nơi nào. Mặc định, tất cả các thuộc tính và phương thức đều là `public`.
- `private` được sử dụng để chỉ định rằng thuộc tính hoặc phương thức là riêng tư, không thể truy cập từ bên ngoài class khai báo nó.
- `protected` được sử dụng để chỉ định rằng thuộc tính hoặc phương thức được bảo vệ, nó tương tự như `private` nhưng có thể truy cập từ class con.

Dưới đây là một số ví dụ:

```ts
class Animal {
  public name;
  public constructor(name) {
    this.name = name;
  }
}

let a = new Animal('Jack');
console.log(a.name); // Jack
a.name = 'Tom';
console.log(a.name); // Tom
```

Trong ví dụ trên, `name` được đặt là `public`, vì vậy việc truy cập trực tiếp vào thuộc tính `name` của thực thể là được cho phép.

Nhiều lúc, chúng ta muốn một số thuộc tính không thể truy cập trực tiếp, khi đó chúng ta có thể sử dụng `private`:

```ts
class Animal {
  private name;
  public constructor(name) {
    this.name = name;
  }
}

let a = new Animal('Jack');
console.log(a.name);
a.name = 'Tom';

// index.ts(9,13): error TS2341: Property 'name' is private and only accessible within class 'Animal'.
// index.ts(10,1): error TS2341: Property 'name' is private and only accessible within class 'Animal'.
```

Cần lưu ý là, mã JavaScript sau khi biên dịch từ TypeScript không hạn chế việc truy cập thuộc tính `private` từ bên ngoài.

Ví dụ trên sau khi biên dịch sẽ trở thành:

```js
var Animal = (function () {
  function Animal(name) {
    this.name = name;
  }
  return Animal;
})();
var a = new Animal('Jack');
console.log(a.name);
a.name = 'Tom';
```

Thuộc tính hoặc phương thức được sửa đổi bằng `private` không được phép truy cập trong class con:

```ts
class Animal {
  private name;
  public constructor(name) {
    this.name = name;
  }
}

class Cat extends Animal {
  constructor(name) {
    super(name);
    console.log(this.name);
  }
}

// index.ts(11,17): error TS2341: Property 'name' is private and only accessible within class 'Animal'.
```

Tuy nhiên, nếu sử dụng `protected`, việc truy cập trong class con sẽ được cho phép:

```ts
class Animal {
  protected name;
  public constructor(name) {
    this.name = name;
  }
}

class Cat extends Animal {
  constructor(name) {
    super(name);
    console.log(this.name);
  }
}
```

Khi hàm khởi tạo được đánh dấu là `private`, class đó không được phép kế thừa hoặc khởi tạo:

```ts
class Animal {
  public name;
  private constructor(name) {
    this.name = name;
  }
}
class Cat extends Animal {
  constructor(name) {
    super(name);
  }
}

let a = new Animal('Jack');

// index.ts(7,19): TS2675: Cannot extend a class 'Animal'. Class constructor is marked as private.
// index.ts(13,9): TS2673: Constructor of class 'Animal' is private and only accessible within the class declaration.
```

Khi hàm khởi tạo được đánh dấu là `protected`, class đó chỉ được phép kế thừa:

```ts
class Animal {
  public name;
  protected constructor(name) {
    this.name = name;
  }
}
class Cat extends Animal {
  constructor(name) {
    super(name);
  }
}

let a = new Animal('Jack');

// index.ts(13,9): TS2674: Constructor of class 'Animal' is protected and only accessible within the class declaration.
```

### Thuộc tính tham số

Bộ điều chỉnh truy cập và `readonly` có thể được sử dụng trong tham số hàm khởi tạo, tương đương với việc định nghĩa thuộc tính đó trong class và gán giá trị cho thuộc tính đó, giúp làm cho mã ngắn gọn hơn.

```ts
class Animal {
  // public name: string;
  public constructor(public name) {
    // this.name = name;
  }
}
```

### readonly

`readonly` là từ khóa chỉ định thuộc tính chỉ đọc, chỉ được phép xuất hiện trong khai báo thuộc tính hoặc chữ ký chỉ mục hoặc hàm khởi tạo.

```ts
class Animal {
  readonly name;
  public constructor(name) {
    this.name = name;
  }
}

let a = new Animal('Jack');
console.log(a.name); // Jack
a.name = 'Tom';

// index.ts(10,3): TS2540: Cannot assign to 'name' because it is a read-only property.
```

Lưu ý rằng nếu `readonly` xuất hiện cùng với các bộ điều chỉnh truy cập khác, nó cần được viết sau chúng.

```ts
class Animal {
  // public readonly name;
  public constructor(public readonly name) {
    // this.name = name;
  }
}
```

### Lớp trừu tượng

`abstract` được sử dụng để định nghĩa class trừu tượng và các phương thức trừu tượng bên trong nó.

class trừu tượng là gì?

Đầu tiên, class trừu tượng không được phép khởi tạo:

```ts
abstract class Animal {
  public name;
  public constructor(name) {
    this.name = name;
  }
  public abstract sayHi();
}

let a = new Animal('Jack');

// index.ts(9,11): error TS2511: Cannot create an instance of the abstract class 'Animal'.
```

Trong ví dụ trên, chúng tôi đã định nghĩa một class trừu tượng `Animal` và định nghĩa một phương thức trừu tượng `sayHi`. Khi cố gắng khởi tạo class trừu tượng, chúng tôi nhận được một lỗi.

Thứ hai, phương thức trừu tượng trong class trừu tượng phải được class con triển khai:

```ts
abstract class Animal {
  public name;
  public constructor(name) {
    this.name = name;
  }
  public abstract sayHi();
}

class Cat extends Animal {
  public eat() {
    console.log(`${this.name} is eating.`);
  }
}

let cat = new Cat('Tom');

// index.ts(9,7): error TS2515: Non-abstract class 'Cat' does not implement inherited abstract member 'sayHi' from class 'Animal'.
```

Trong ví dụ trên, chúng tôi đã định nghĩa một class `Cat` kế thừa từ class trừu tượng `Animal`, nhưng không triển khai phương thức trừu tượng `sayHi`, do đó chúng tôi nhận được một lỗi biên dịch.

Dưới đây là một ví dụ về việc sử dụng class trừu tượng đúng cách:

```ts
abstract class Animal {
  public name;
  public constructor(name) {
    this.name = name;
  }
  public abstract sayHi();
}

class Cat extends Animal {
  public sayHi() {
    console.log(`Meow, My name is ${this.name}`);
  }
}

let cat = new Cat('Tom');
```

Trong ví dụ trên, chúng tôi đã triển khai phương thức trừu tượng `sayHi`, và mã biên dịch không báo lỗi.

Cần lưu ý là, ngay cả khi là phương thức trừu tượng, kết quả biên dịch TypeScript vẫn sẽ chứa class này. Kết quả biên dịch của đoạn mã trên là:

```js
var __extends =
  (this && this.__extends) ||
  function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
  };
var Animal = (function () {
  function Animal(name) {
    this.name = name;
  }
  return Animal;
})();
var Cat = (function (_super) {
  __extends(Cat, _super);
  function Cat() {
    _super.apply(this, arguments);
  }
  Cat.prototype.sayHi = function () {
    console.log('Meow, My name is ' + this.name);
  };
  return Cat;
})(Animal);
var cat = new Cat('Tom');
```

## Kiểu của class

Để thêm kiểu TypeScript vào class rất đơn giản, tương tự như với giao diện:

```ts
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  sayHi(): string {
    return `My name is ${this.name}`;
  }
}

let a: Animal = new Animal('Jack');
console.log(a.sayHi()); // My name is Jack
```

Trong ví dụ trên, `Animal` được xác định như là một kiểu class. Biến `a` được khai báo với kiểu là `Animal`, và sau đó được khởi tạo bằng cách sử dụng từ khóa `new` để tạo một đối tượng mới từ class `Animal`. Phương thức `sayHi` cũng được xác định kiểu trả về là `string`.
