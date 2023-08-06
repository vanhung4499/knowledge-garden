---
title: JS Class Static Member
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-06
date modified: 2023-08-07
---

# Thành viên tĩnh - Static Member

Thành viên tĩnh của một lớp bao gồm **phương thức tĩnh** và **thuộc tính tĩnh**.

- Phương thức tĩnh được định nghĩa trong lớp (không được định nghĩa trên đối tượng thể hiện `this`)
- Thuộc tính tĩnh được định nghĩa thông qua truy cập vào thuộc tính của đối tượng (đề xuất mới cung cấp từ khóa `static` để định nghĩa)

## Phương thức tĩnh

Lớp tương đương với nguyên mẫu của đối tượng, tất cả các phương thức được định nghĩa trong lớp đều được thể hiện kế thừa.

Nếu một phương thức được đặt trước từ khóa `static`, điều này có nghĩa là phương thức đó không được thể hiện kế thừa, mà cần được gọi trực tiếp thông qua lớp, điều này được gọi là **phương thức tĩnh**.

```js
class Foo {
  static sayHi() {
    return 'Xin chào';
  }
}

Foo.sayHi();
// 'Xin chào'

const foo = new Foo();

foo.sayHi();
// TypeError: foo.sayHi không phải là một hàm
```

### Phạm vi động

⚠️ **Lưu ý**: Nếu phương thức tĩnh chứa từ khóa `this`, `this` sẽ trỏ đến lớp, không phải là thể hiện.

```js
class Foo {
  static bar() {
    this.baz();
  }
  static baz() {
    console.log('Xin chào');
  }
  baz() {
    console.log('Thế giới!');
  }
}

Foo.bar();
// 'Xin chào'
```

### Kế thừa từ lớp con

Phương thức tĩnh của lớp cha có thể được kế thừa bởi lớp con.

```js
class Foo {
  static sayHi() {
    return 'Xin chào';
  }
}

class Bar extends Foo {}

Bar.sayHi();
// 'Xin chào'
```

## Thuộc tính tĩnh

Vì trong ES6 đã quy định rõ ràng, lớp chỉ có phương thức tĩnh, không có thuộc tính tĩnh được định nghĩa trực tiếp trong lớp.

```js
// Cách viết dưới đây không hợp lệ
class Foo {
  // Cách viết 1
  prop: 2;

  // Cách viết 2
  static prop: 2;
}
```

Hiện tại có một đề xuất về thuộc tính tĩnh, định rõ cách viết mới cho thuộc tính của thể hiện và thuộc tính tĩnh.

Trước đây, cần định nghĩa thuộc tính của thể hiện trong hàm tạo của lớp.

Bây giờ, **thuộc tính của thể hiện** có thể được viết bằng phương trình, được viết trong định nghĩa của lớp. Cách viết này rõ ràng hơn so với trước đây.

```js
// Cách viết cũ
class Foo {
  constructor() {
    this.state = {
      visible: true,
    };
  }
}

// Cách viết mới
class Bar {
  state = {
    visible: true,
  };

  constructor() {
    console.log(this.state.visible); // true
  }
}
```

**Vì mục đích đọc hiểu, cách viết mới cho phép liệt kê trực tiếp các thuộc tính đã được định nghĩa trong hàm tạo.**

Thuộc tính tĩnh của lớp chỉ cần thêm từ khóa `static` trước cách viết thuộc tính của thể hiện như trên.

```js
class MyClass {
  static state = {
    visible: true,
  };
  constructor() {
    console.log(MyClass.state.visible); // true
  }
}
```

Cách viết mới là khai báo rõ ràng (declarative), không phải gán giá trị, có ý nghĩa ngữ nghĩa tốt hơn.
