---
title: JS Function Bind
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# Function.prototype.bind

Phương thức `Function.prototype.bind` tạo ra một hàm mới, trong đó `this` của hàm mới được chỉ định là đối số đầu tiên của `bind()`, và các đối số còn lại sẽ được sử dụng làm đối số cho hàm mới khi được gọi.

## Cú pháp

Cú pháp:

```ts
bind(thisArg: any, ...argArray: any[]): any;
```

Tham số:

| Tham số    | Mô tả                                       | Kiểu |
| ---------- | ------------------------------------------- | ---- |
| thisArg    | Tham số tùy chọn. Con trỏ `this` của hàm mới. |      |
| argArray   | Tham số tùy chọn. Danh sách các đối số.       |      |

## Mô tả

Phương thức `Function.prototype.bind` tạo ra một **hàm ràng buộc** mới (Bound Function, BF). Hàm ràng buộc là một đối tượng hàm đặc biệt (Exotic Function Object, thuật ngữ trong ECMAScript 2015) và nó bao gồm hàm gốc. Khi gọi hàm ràng buộc, nó thường dẫn đến việc thực thi **hàm bao bọc**.

Hàm ràng buộc có các thuộc tính nội bộ sau:

- `[[BoundTargetFunction]]`: Đối tượng hàm được bao gồm
- `[[BoundThis]]`: Giá trị `this` được truyền vào khi gọi hàm bao bọc
- `[[BoundArguments]]`: Danh sách các đối số, sẽ được sử dụng để điền vào danh sách đối số của hàm bao bọc khi gọi

Khi gọi hàm ràng buộc, nó sẽ gọi phương thức nội bộ `[[Call]]` trên `[[BoundTargetFunction]]`, như sau: `Call(boundThis, args)`. Ở đây, `boundThis` là `[[BoundThis]]`, `args` là `[[BoundArguments]]` cộng với danh sách đối số truyền vào khi gọi hàm.

Hàm ràng buộc cũng có thể được sử dụng với toán tử `new`, trong trường hợp này nó sẽ được coi là một hàm đã được xây dựng sẵn. Giá trị `this` được cung cấp sẽ bị bỏ qua, nhưng các đối số trước vẫn được cung cấp cho hàm giả lập.

## Ví dụ

### Tạo hàm ràng buộc

Một cách sử dụng đơn giản nhất của `Function.prototype.bind()` là tạo ra một hàm mà bất kể cách gọi, hàm đó luôn có tham chiếu `this` giống nhau. Một lỗi thường gặp của người mới học JavaScript là lấy một phương thức từ một đối tượng, sau đó gọi phương thức đó và mong đợi `this` trong phương thức là đối tượng gốc (ví dụ: truyền phương thức này vào một hàm gọi lại). Nếu không xử lý đặc biệt, thì thường sẽ mất mất đối tượng gốc. Bằng cách sử dụng hàm ràng buộc, bạn có thể tạo ra một hàm mới được liên kết với đối tượng gốc, giải quyết vấn đề này một cách thông minh.

```js
this.a = '100';

const foo = {
  a: '99',
  getA: function () {
    return this.a;
  },
};

foo.getA();
// '99'

const retrieveA = foo.getA;

retrieveA();
// '100'

const boundGetA = retrieveA.bind(foo);

boundGetA();
// '99'
```

### Hàm một phần

Một cách sử dụng khác của `Function.prototype.bind()` là để hàm có các tham số ban đầu được thiết lập trước. Chỉ cần chuyển các tham số này (nếu có) làm đối số cho `bind()` sau `this`. Khi hàm ràng buộc được gọi, các tham số này sẽ được chèn vào đầu danh sách tham số của hàm mục tiêu, và các đối số được truyền vào hàm ràng buộc sẽ được đặt sau chúng.

```js
const foo = function (a, b, c, d, e, f) {
  console.log(a, b, c, d, e, f);
};

// Thiết lập ba tham số 1 2 3 -> tương ứng với các tham số a b c của foo
const bar = foo.bind(null, 1, 2, 3);

bar(4, 5, 6);
// 1 2 3 4 5 6
```

### Kết hợp với hẹn giờ

Mặc định, khi sử dụng [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout), từ khóa `this` sẽ trỏ đến đối tượng Window. Khi một phương thức của một lớp cần `this` trỏ đến một thể hiện của lớp đó, bạn có thể rõ ràng ràng buộc `this` vào hàm gọi lại để không mất tham chiếu đến thể hiện đó.

```js
function LateBloomer() {
  this.petalCount = Math.ceil(Math.random() * 12) + 1;
}

LateBloomer.prototype.bloom = function () {
  window.setTimeout(this.declare.bind(this), 1000);
};

LateBloomer.prototype.declare = function () {
  console.log('I am a beautiful flower with ' + this.petalCount + ' petals!');
};

const flower = new LateBloomer();

flower.bloom();
```

## Cài đặt tương thích

Điểm quan trọng:

- Tạo hàm mới
- `this` của hàm mới được chỉ định bởi đối số đầu tiên của `bind`

Cài đặt:

1. Đảm bảo người gọi `bind` là một hàm.
2. Tham số: Sử dụng `Array.prototype.slice.call` để loại bỏ tham số `context`. ❗️(Quan trọng)
3. Ngữ cảnh thực thi hiện tại: Đây là `this` của hàm gọi `bind`.
4. Tạo hàm mới trả về:
   - Ngữ cảnh gọi là ngữ cảnh thực thi `currentContext` của hàm `bind`.
   - Sử dụng `apply` để thực hiện.
   - Kiểm tra xem ngữ cảnh gọi của hàm mới có phải là một thể hiện của hàm mới hay không, nếu phải thì `this` là ngữ cảnh đó, ngược lại là `context`.
   - Tham số là sự kết hợp của các tham số của `bind` và các tham số của hàm mới.
5. Xử lý chuỗi nguyên mẫu (prototype chain).
6. Trả về hàm mới.

```js
Function.prototype.bind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Người gọi phương thức bind không phải là một hàm.');
  }

  // Chuyển đổi tham số thành một mảng
  const args = Array.prototype.slice.call(arguments, 1);

  const currentContext = this;

  const fn = function () {
    return currentContext.apply(
      this instanceof fn ? this : context,
      args.concat(Array.prototype.slice.call(arguments))
    );
  };

  const OP = function () {};

  if (this.prototype) {
    OP.prototype = this.prototype;
  }

  // Đặt fn.prototype là một thể hiện của OP, vì vậy khi trả về fn như một hàm tạo mới
  // Đối tượng mới được tạo bởi new sẽ được truyền vào fn, __proto__ của đối tượng mới sẽ là một thể hiện của OP
  fn.prototype = new OP();

  return fn;
};
```
