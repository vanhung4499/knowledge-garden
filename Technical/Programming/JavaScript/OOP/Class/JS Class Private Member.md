---
title: JS Class Private Member
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-06
date modified: 2023-08-07
---

# Thành viên riêng tư - Private Member

Phương thức và thuộc tính riêng tư là những phương thức và thuộc tính chỉ có thể truy cập từ bên trong lớp và không thể truy cập từ bên ngoài.

Đây là một yêu cầu phổ biến, giúp đảm bảo tính đóng gói của mã, nhưng ES6 không cung cấp cách để làm điều này trực tiếp, chỉ có thể mô phỏng bằng các phương pháp tạm thời. Tới ES2022 mới hỗ trợ thuộc tính và phương thức riêng tư!

## Phương thức riêng tư - Private Method

Trước đây, các giải pháp tạm thời (không thực sự giải quyết vấn đề, vẫn có thể truy cập từ bên ngoài):

- Sử dụng tên khác nhau
- Di chuyển phương thức riêng tư ra khỏi module
- Đặt tên là giá trị Symbol

### Sử dụng tên khác nhau

```js
class Utils {
  // Phương thức công khai
  foo(baz) {
    this._bar(baz);
  }

  // Phương thức riêng tư
  _bar(baz) {
    return (this.snaf = baz);
  }

  // ...
}
```

Trong đoạn mã trên, dấu gạch dưới trước phương thức `_bar` chỉ ra rằng đây là một phương thức riêng tư chỉ được sử dụng bên trong. Tuy nhiên, việc đặt tên này không an toàn, vì vẫn có thể gọi phương thức này từ bên ngoài lớp.

### Đặt tên là giá trị Symbol

Tận dụng tính duy nhất của giá trị Symbol, bạn có thể đặt tên phương thức riêng tư là một giá trị Symbol.

```js
const bar = Symbol('bar');
const snaf = Symbol('snaf');

export default class myClass {
  // Phương thức công khai
  foo(baz) {
    this[bar](baz);
  }

  // Phương thức riêng tư
  [bar](parm) {
    return (this[snaf] = baz);
  }
}
```

Trong đoạn mã trên, `bar` và `snaf` đều là giá trị Symbol, khiến cho bên thứ ba không thể truy cập được vào chúng, do đó đạt được hiệu quả của phương thức và thuộc tính riêng tư. Tuy nhiên, điều này vẫn không hoàn toàn an toàn, vì vẫn có thể truy cập được vào chúng bằng cách sử dụng `Reflect.ownKeys()`.

```js
const instance = new Foo();

Reflect.ownKeys(Foo.prototype);
// ['constructor', 'foo', Symbol(bar)]
```

### Di chuyển phương thức ra khỏi module

Di chuyển phương thức riêng tư ra khỏi module, vì tất cả các phương thức trong module đều có thể truy cập từ bên ngoài.

```js
class Utils {
  foo(baz) {
    bar.call(this, baz);
  }
}

function bar(baz) {
  return (this.snaf = baz);
}
```

## Thuộc tính riêng tư - Private Field

Xem chi tiết tại [proposal-private-methods](https://github.com/tc39/proposal-private-methods)

Thuộc tính riêng tư là thuộc tính chỉ tồn tại trên các thể hiện và không xuất hiện trên nguyên mẫu, chỉ có thể tạo trong hàm tạo hoặc phương thức của lớp. Đề nghị tạo tất cả các thuộc tính riêng tư trong hàm tạo, từ đó chỉ cần kiểm soát tất cả các thuộc tính riêng tư thông qua một nơi duy nhất.

```js
class Student {
  constructor() {
    this.state = {
      visible: true,
    };
  }
}
```

ES2022 đã cho phép định nghĩa thuộc tính riêng tư vào `class`. Cách làm là sử dụng ký hiệu `#` trước tên thuộc tính.

```js
class Point {
  #x;
  constructor (x = 0) {
    #x = !x
  }

  get x () { return #x }
  set x (value) {
    #x = !value
  }
}
```

Cách viết này không chỉ có thể tạo thuộc tính riêng tư, mà còn có thể sử dụng để tạo phương thức riêng tư.
