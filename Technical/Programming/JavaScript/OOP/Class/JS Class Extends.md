---
title: JS Class Extends
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-06
date modified: 2023-08-07
---

# Kế thừa trong lớp

Kế thừa là quá trình mà lớp con kế thừa các thuộc tính và phương thức từ lớp cha, cho phép đối tượng của lớp con có các thuộc tính và phương thức của lớp cha.

## Cách sử dụng

Khác với việc sử dụng thay đổi chuỗi nguyên mẫu trong ES5 để thực hiện kế thừa, trong ES6, chúng ta sử dụng từ khóa `extends` để kế thừa tất cả các thuộc tính và phương thức của lớp cha.

```js
class Parent {}

class Child extends Parent {
  constructor() {
    super();
  }
}
```

⚠️ **Lưu ý**: Lớp con phải gọi phương thức `super` trong hàm tạo, nếu không, việc tạo thể hiện mới sẽ gây ra lỗi. Điều này là do `this` của lớp con phải trỏ đến đối tượng của lớp cha trước khi được xử lý để có các thuộc tính và phương thức giống như lớp cha. Nếu không gọi phương thức `super`, lớp con sẽ không có `this` thích hợp.

Nếu lớp con không định nghĩa hàm tạo, hàm tạo sẽ được tự động thêm vào. Điều này có nghĩa là, dù có định nghĩa rõ ràng hay không, mọi lớp con đều có hàm tạo.

Một điều quan trọng khác cần lưu ý là, trong hàm tạo của lớp con, **chỉ có thể sử dụng `this` sau khi gọi phương thức `super`**. Nếu không gọi phương thức `super`, sẽ gây ra lỗi.

Điều này là do quá trình xây dựng thể hiện của lớp con dựa trên thể hiện của lớp cha, và chỉ có phương thức `super` mới có thể gọi thể hiện của lớp cha.

```js
class Parent {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Child extends Parent {
  constructor(x, y, age) {
    this.age = age;
    // ReferenceError: this is not defined
    // Lỗi: Gọi this trước khi gọi super

    super(x, y);

    // Đúng
    this.age = age;
  }
}
```

## Truy cập lớp cha

Chúng ta có thể sử dụng phương thức `Object.getPrototypeOf()` để lấy lớp cha từ lớp con.

```js
Object.getPrototypeOf(Child) === Parent;
```

Do đó, chúng ta có thể sử dụng phương thức này để kiểm tra xem một lớp có kế thừa từ một lớp khác hay không.

## super

Từ khóa `super` có thể được sử dụng như một hàm hoặc một đối tượng.

Khi `super` được sử dụng như một hàm, nó đại diện cho hàm tạo của lớp cha.

ES6 yêu cầu rằng khi kế thừa hàm tạo của lớp cha, hàm tạo của lớp con phải gọi `super` ít nhất một lần. Ngoài ra, `super()` chỉ có thể được gọi trong hàm tạo, nếu không sẽ gây ra lỗi.

```js
class Parent {}

class Child extends Parent {
  constructor() {
    super();
  }
}
```

Mặc dù `super` đại diện cho hàm tạo của lớp cha `Parent` nhưng nó trả về một thể hiện của lớp con `Child`, nghĩa là `this` bên trong `super` trỏ đến `Child`. Do đó, `super()` ở đây tương đương với:

```js
Parent.prototype.constructor.call(this);
```

Khi `super` được sử dụng như một đối tượng:

- Trong các phương thức thông thường, nó trỏ đến đối tượng nguyên mẫu của lớp cha.
- Trong các phương thức tĩnh, nó trỏ đến lớp cha.

### Phương thức thông thường

Trong các phương thức thông thường, `super` trỏ đến đối tượng nguyên mẫu của lớp cha.

```js
class Parent {
  console() {
    return 'Hello world!';
  }
}

class Child extends Parent {
  constructor() {
    super();

    const result = super.console();

    console.log(result);
    // Hello world!
  }
}
```

Trong ví dụ trên, `super.console()` trong lớp con `Child` được sử dụng như một đối tượng. Lúc này, `super` trong phương thức thông thường trỏ đến `Parent.prototype`, vì vậy `super.console()` tương đương với `Parent.prototype.console()`.

> ⚠️ **Lưu ý**: ES6 quy định rằng khi gọi phương thức của lớp cha thông qua `super` trong phương thức thông thường của lớp con, `this` bên trong phương thức sẽ trỏ đến thể hiện của lớp con hiện tại.

🌰 **Ví dụ:**

```js
class Parent {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class Child extends Parent {
  constructor() {
    super();
    this.x = 2;
  }
  console() {
    super.print();
    // Khi phương thức print được gọi, this thực tế trỏ đến thể hiện của lớp con
  }
}

const child = new Child();

child.console();
// 2
```

### Phương thức tĩnh

Khi gọi phương thức tĩnh của lớp cha thông qua `super` trong phương thức tĩnh của lớp con, `this` bên trong phương thức sẽ trỏ đến **lớp con hiện tại, chứ không phải là thể hiện của lớp con**.

```js
class Parent {
  constructor() {
    this.x = 1;
  }
  static console() {
    console.log(this.x);
  }
}

class Child extends Parent {
  constructor() {
    super();
    this.x = 2;
  }
  static print() {
    super.console();
  }
}

Child.x = 3;

Child.print();
// 3
```

> ⚠️ **Lưu ý**: Khi sử dụng `super`, cần chỉ rõ là gọi như một hàm hay một đối tượng, nếu không sẽ gây ra lỗi.

```js
class Parent {}

class Child extends Parent {
  constructor() {
    super();
    console.log(super);
    // Lỗi
  }
}
```

Tóm lại, khi gọi phương thức của lớp cha thông qua `super`:

- Khi `super` được sử dụng như một đối tượng
  - Trong phương thức thông thường của lớp con
    - `super` trỏ đến **đối tượng nguyên mẫu của lớp cha** `Parent.prototype`
    - Khi gọi phương thức của lớp cha thông qua `super`, `this` bên trong phương thức sẽ trỏ đến **thể hiện của lớp con hiện tại**
  - Trong phương thức tĩnh của lớp con
    - `super` trỏ đến **lớp cha**, chứ không phải là đối tượng nguyên mẫu của lớp cha
    - Khi gọi phương thức của lớp cha thông qua `super`, `this` bên trong phương thức sẽ trỏ đến **lớp con hiện tại**, chứ không phải là thể hiện của lớp con

## Đối tượng nguyên mẫu của lớp

Trong hầu hết các trình duyệt, các triển khai của ES5 đều có thuộc tính `__proto__`, trỏ đến thuộc tính `prototype` của hàm tạo tương ứng.

Lớp, như là một cú pháp đường dẫn cho hàm tạo, cũng có thuộc tính `prototype` và `__proto__`, do đó tồn tại hai chuỗi kế thừa.

1. Thuộc tính `__proto__` của lớp con đại diện cho **kế thừa hàm tạo**, luôn trỏ đến **lớp cha**.
2. Thuộc tính `__proto__` của `prototype` của lớp con đại diện cho **kế thừa phương thức**, luôn trỏ đến `prototype` của **lớp cha**.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230807011517.png)

```js
class Parent {}

class Child extends Parent {}

console.log(Child.__proto__ === Parent);
// true

console.log(Child.prototype.__proto__ === Parent.prototype);
// true
```

Đối tượng nguyên mẫu của lớp được triển khai theo mô hình sau:

```js
class Parent {}

class Child {}

// 1. Đối tượng nguyên mẫu của lớp con kế thừa từ đối tượng nguyên mẫu của lớp cha
Object.setPrototypeOf(Child.prototype, Parent.prototype);

// 2. Lớp con kế thừa thuộc tính tĩnh từ lớp cha
Object.setPrototypeOf(Child, Parent);

const child = new Child();
```

[Phương thức Object.setPrototypeOf() được triển khai bên dưới](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)

Cách triển khai trên tương đương với:

```js
Object.setPrototypeOf(Child.prototype, Parent.prototype);
// Tương đương với
Child.prototype.__proto__ = Parent.prototype;

Object.setPrototypeOf(Child, Parent);
// Tương đương với
Child.__proto__ = Parent;
```

Cả hai chuỗi kế thừa này có thể được hiểu như sau:

- Lớp con `Child` được triển khai như một đối tượng, đối tượng nguyên mẫu ẩn (thuộc tính `__proto__`) của lớp con là lớp cha (`Parent`).
- Lớp con `Child` được triển khai như một hàm tạo, đối tượng nguyên mẫu rõ ràng (thuộc tính `prototype`) của lớp con là một thể hiện của đối tượng nguyên mẫu rõ ràng (thuộc tính `prototype`) của lớp cha (`Parent`).

**Kế thừa đối tượng nguyên mẫu của lớp con**

```js
class Child extends Object {}

// Tương đương với
console.log(Child.__proto__ === Object);
// true
console.log(Child.prototype.__proto__ === Object.prototype);
// true
```

Trong trường hợp này, `Child` thực sự là một bản sao của hàm tạo `Object`, đối tượng nguyên mẫu của `Child` (`__proto__`) là `Object` và các thể hiện của `Child` là các thể hiện của `Object`.

**Không có mối quan hệ kế thừa**

```js
class Parent {}

Parent.__proto__ === Function.prototype;
// true
Parent.prototype.__proto__ === Object.prototype;
// true
```

Trong trường hợp này, `Parent` là một lớp cơ bản (không có bất kỳ kế thừa nào), nó được coi là một hàm thông thường và do đó kế thừa trực tiếp từ `Function.prototype`.

Tuy nhiên, sau khi khởi tạo một thể hiện của `Parent`, nó trở thành một đối tượng rỗng (thể hiện của `Object`), vì vậy `Parent.prototype.__proto__` trỏ đến thuộc tính `prototype` của hàm tạo `Object`.

## Kế thừa đối tượng tích hợp sẵn

Đối tượng tích hợp sẵn (còn được gọi là hàm tạo nguyên thủy) là các hàm tạo được tích hợp sẵn trong JavaScript, thường được sử dụng để tạo cấu trúc dữ liệu.

Trước đây, không thể kế thừa các hàm tạo nguyên thủy, ví dụ như không thể tự định nghĩa một lớp con của `Array`. Nguyên nhân là vì lớp con không thể truy cập được vào các thuộc tính nội bộ của hàm tạo nguyên thủy, không thể sử dụng `Array.apply()` hoặc gán cho đối tượng nguyên mẫu. Hàm tạo nguyên thủy sẽ bỏ qua `this` được truyền vào thông qua phương thức `apply`, nghĩa là `this` của hàm tạo nguyên thủy không thể ràng buộc, dẫn đến không thể truy cập được các thuộc tính nội bộ.

Tuy nhiên, trong ES6, cho phép kế thừa các hàm tạo nguyên thủy để định nghĩa lớp con, bởi vì ES6 trước tiên tạo một đối tượng thể hiện của lớp cha `this`, sau đó sử dụng hàm tạo của lớp con để thay đổi `this`, làm cho tất cả các hành vi của lớp cha đều có thể được kế thừa. Dưới đây là một ví dụ về kế thừa `Array`.

```js
class SubArray extends Array {
  constructor(...args) {
    super(...args);
  }
}

var arr = new SubArray();
arr[0] = 12;
console.log(arr.length);
// 1

arr.length = 0;
console.log(arr[0]);
// undefined
```

Ví dụ trên cho thấy từ khóa `extends` không chỉ được sử dụng để kế thừa từ các lớp, mà còn được sử dụng để kế thừa từ các hàm tạo nguyên thủy tích hợp sẵn. Do đó, bạn có thể định nghĩa cấu trúc dữ liệu của riêng mình dựa trên cấu trúc dữ liệu tích hợp sẵn.

⚠️ **Lưu ý**: Khi kế thừa lớp con của `Object`, có một sự khác biệt trong hành vi.

```js
class SubObject extends Object {
  constructor() {
    super(...arguments);
  }
}
const obj = new SubObject({ attr: true });

obj.attr === true;
// false
```

Trong đoạn mã trên, `SubObject` kế thừa từ `Object`, nhưng không thể truyền tham số cho phương thức `super` của lớp cha `Object`. Điều này là do ES6 đã thay đổi hành vi của hàm tạo `Object`, nếu phát hiện rằng phương thức `Object` không được gọi dưới dạng `new Object()`, ES6 quy định hàm tạo `Object` sẽ bỏ qua các tham số.
