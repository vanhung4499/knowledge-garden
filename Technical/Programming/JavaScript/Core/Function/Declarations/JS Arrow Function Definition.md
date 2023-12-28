---
title: JS Arrow Function Definition
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-04
date modified: 2023-12-208-04
---

# Hàm mũi tên - Arrow Function

Cú pháp của biểu thức hàm mũi tên ngắn gọn hơn biểu thức hàm thông thường và không có `this`, `arguments`, `super` và `new.target`.

Biểu thức hàm mũi tên thích hợp cho các tình huống cần hàm vô danh và không thể sử dụng như một hàm tạo.

## Cú pháp gán

Hàm mũi tên chỉ có thể sử dụng cú pháp **gán** và không thể sử dụng cú pháp **khai báo**.

```js
const fn = () => {
  // do something
};
```

## Tham số của hàm mũi tên

### Một tham số

Khi chỉ có một tham số, dấu ngoặc đơn là tùy chọn. Nếu không có tham số hoặc có nhiều hơn một tham số, cần sử dụng dấu ngoặc đơn.

```js
const fn1 = (param1) => {
  // do something
};

const fn2 = () => {
  // do something
};

const fn3 = (param1, param2) => {
  // do something
};
```

### Tham số còn lại

Hàm mũi tên hỗ trợ tham số còn lại (rest parameter) và tham số mặc định.

```js
const fn = (params1, params2, ...rest) => {
  // do something
};
```

🌰 **Ví dụ**:

```js
const numbers = (...nums) => nums;

numbers(1, 2, 3, 4, 5);
// [1, 2, 3, 4, 5]

const headAndTail = (head, ...tail) => [head, tail];

headAndTail(1, 2, 3, 4, 5);
// [1, [2, 3, 4, 5]]
```

### Tham số mặc định

```js
const fn = (params1 = default1, params2, ..., paramsN = defaultN) => {
  // do something
}
```

### Gán giá trị bằng phép phân hủy cấu trúc

Hàm mũi tên cũng hỗ trợ giải pháp gán giá trị bằng phép phân hủy cấu trúc (destructure).

```js
const fn = ([a, b] = [1, 2], { x: c } = { x: a + b }) => a + b + c;

fn();
// 6
```

🌰 **Ví dụ**

```js
const full = ({ first, last }) => first + '' + last;

// Tương đương với
function full(person) {
  return person.first + '' + person.last;
}
```

# Thân hàm

### Một biểu thức duy nhất

Nếu thân hàm chỉ có một biểu thức duy nhất, có thể không cần dùng dấu ngoặc nhọn.

```js
const fn = (param1, param2) => param1 + param2;
```

### Trả về giá trị mặc định

Nếu không có dấu ngoặc nhọn, có thể không cần viết từ khóa `return`, hàm mũi tên sẽ tự động trả về giá trị.

```js
const fn = (param1, param2) => param1 + param2;

fn(1, 2);
```

### Trả về đối tượng trực tiếp

Nếu có dấu ngoặc nhọn, thân hàm có thể trả về một biểu thức đối tượng.

```js
const fn = (bar) => ({ foo: bar });
```

## Ứng dụng

### Hàm gọi lại (callback)

**Hàm `map` của mảng:**

```js
// Cách viết hàm thông thường
const result = [1, 2, 3].map(function (x) {
  return x * x;
});

// Cách viết hàm mũi tên
const result = [1, 2, 3].map((x) => x * x);
```

**Hàm `sort` của mảng:**

```js
// Cách viết hàm thông thường
const result = values.sort(function (a, b) {
  return a - b;
});

// Cách viết hàm mũi tên
const result = values.sort((a, b) => a - b);
```

## Lưu ý

- Đối tượng `this` trong thân hàm là đối tượng **được định nghĩa** tại thời điểm khai báo, không phải là đối tượng sử dụng tại thời điểm gọi.
- Không thể sử dụng như một hàm tạo (constructor), tức là không thể sử dụng `new` để tạo đối tượng từ hàm mũi tên, nếu làm vậy sẽ gây ra lỗi.
- Không thể sử dụng đối tượng `arguments`, đối tượng này không tồn tại trong thân hàm mũi tên. Nếu cần, có thể sử dụng tham số `rest` để thay thế.
- Không thể sử dụng từ khóa `yield`, do đó hàm mũi tên không thể sử dụng như một hàm tạo Generator.

### Đối tượng `this` trong hàm mũi tên

Đối tượng `this` có thể thay đổi, nhưng trong hàm mũi tên, nó là **cố định**. Vì trong hàm mũi tên, `this` là **phạm vi từ vựng (lexical scope)**, được xác định bởi ngữ cảnh.

```js
function foo() {
  setTimeout(() => {
    console.log(this.key);
  }, 100);
}

var key = 100;

foo.call({ key: 50 });
// 50
```

Trong đoạn mã trên, tham số của `setTimeout` là một hàm mũi tên, hàm mũi tên này được định nghĩa khi hàm `foo` được tạo ra, nhưng nó chỉ thực thi sau 100 mili giây. Nếu đó là một hàm thông thường, thì khi thực thi, `this` sẽ trỏ đến đối tượng toàn cục `window`, do đó sẽ in ra `100`. Nhưng hàm mũi tên làm cho `this` luôn trỏ đến đối tượng mà nó được định nghĩa (trong trường hợp này là `{ key: 50 }`), vì vậy kết quả là `50`.

Hàm mũi tên cho phép ràng buộc `this` trong `setTimeout` với phạm vi mà nó được định nghĩa, thay vì trỏ đến phạm vi thực thi.

Dưới đây là một ví dụ khác.

```js
function Timer() {
  this.num1 = 0;
  this.num2 = 0;

  // Hàm mũi tên
  setInterval(() => this.num1++, 1000);

  // Hàm thông thường
  setInterval(function () {
    this.num2++;
  }, 1000);
}

const timer = new Timer();

setTimeout(() => console.log('num1', timer.num1), 3000);
setTimeout(() => console.log('num2', timer.num2), 3000);
// num1: 3
// num2: 0
```

Trong đoạn mã trên, hàm `Timer` thiết lập hai bộ hẹn giờ, một bằng hàm mũi tên và một bằng hàm thông thường.

Hàm mũi tên ràng buộc `this` với phạm vi mà nó được định nghĩa (trong trường hợp này là hàm `Timer`), trong khi hàm thông thường thì `this` trỏ đến phạm vi thực thi (trong trường hợp này là đối tượng toàn cục). Vì vậy, sau 3000ms, `timer.num1` được cập nhật 3 lần, trong khi `timer.num2` không được cập nhật.

Hàm mũi tên cho phép `this` được cố định, đặc điểm này rất **hữu ích cho việc đóng gói các hàm gọi lại**.

```js
const handler = {
  id: '123456',
  init: function () {
    document.addEventListener('click', (event) => this.doSomething(event.type), false);
  },
  doSomething: function (type) {
    console.log('Handling' + type + ' for ' + this.id);
  },
};
```

Trong ví dụ trên, phương thức `init` sử dụng hàm mũi tên, điều này làm cho `this` trong hàm mũi tên luôn trỏ đến đối tượng `handler`. Nếu không có điều này, khi hàm gọi lại được thực thi, dòng `this.doSomething` sẽ gây ra lỗi, vì lúc này `this` trỏ đến đối tượng `document`.

⚠️ **Lưu ý**: Sự cố định của `this` không phải là do hàm mũi tên có cơ chế ràng buộc `this`, thực tế là hàm mũi tên không có `this` riêng của nó, dẫn đến `this` trong hàm mũi tên chính là `this` của khối mã bên ngoài. Chính vì không có `this`, nên hàm mũi tên không thể được sử dụng như một constructor.

Mã ES5 chuyển đổi từ hàm mũi tên như sau.

```js
// ES6
function foo() {
  setTimeout(() => {
    console.log('id:', this.id);
  }, 100);
}

// ES5
function foo() {
  var _this = this;

  setTimeout(function () {
    console.log('id:', _this.id);
  }, 100);
}
```

Trong đoạn mã trên, phiên bản ES5 đã chuyển đổi rõ ràng cho thấy hàm mũi tên không có `this` riêng của nó, mà thay vào đó tham chiếu đến `this` của khối mã bên ngoài.

```js
// Trong đoạn mã dưới đây, có bao nhiêu `this`?
function foo() {
  return () => {
    return () => {
      return () => {
        console.log('id:', this.id);
      };
    };
  };
}

var fn = foo.call({ id: 1 });

var res1 = fn.call({ id: 2 })()();
// id: 1
var res2 = fn().call({ id: 3 })();
// id: 1
var res3 = fn()().call({ id: 4 });
// id: 1
```

Trong đoạn mã trên, chỉ có một `this`, đó là `this` của hàm `foo`, vì vậy `res1`, `res2`, `res3` đều in ra cùng một kết quả. Vì tất cả các hàm bên trong đều là hàm mũi tên, không có `this` riêng của nó, `this` của chúng thực sự là `this` của hàm `foo`.

Ngoài `this`, ba biến sau đây cũng không tồn tại trong hàm mũi tên, chúng tham chiếu đến các biến tương ứng trong hàm bên ngoài: `arguments`, `super`, `new.target`.

```js
function foo() {
  setTimeout(() => {
    console.log('args:', arguments);
  }, 100);
}

foo(2, 4, 6, 8);
// args: [2, 4, 6, 8]
```

Trong đoạn mã trên, biến `arguments` trong hàm mũi tên thực sự là biến `arguments` của hàm `foo`.

Ngoài ra, vì hàm mũi tên không có `this` riêng của nó, nên không thể sử dụng các phương thức `call()`、`apply()`、`bind()` để thay đổi đối tượng `this`.

```js
(function () {
  return [(() => this.x).bind({ x: 'inner' })()];
}.call({ x: 'outer' }));
// ['outer']
```

Trong đoạn mã trên, hàm mũi tên không có `this` riêng của nó, vì vậy phương thức `bind` không có tác dụng, `this` bên trong vẫn trỏ đến `this` bên ngoài.

### Hàm mũi tên lồng nhau

Trong hàm mũi tên, ta có thể sử dụng hàm mũi tên lồng nhau. Dưới đây là một ví dụ với cú pháp ES5 của hàm lồng nhau.

```js
function insert(value) {
  return {
    into: function (array) {
      return {
        after: function (afterValue) {
          array.splice(array.indexOf(afterValue) + 1, 0, value);
          return array;
        },
      };
    },
  };
}

insert(2).into([1, 3]).after(1); // [1, 2, 3]
```

Hàm trên có thể được viết lại bằng hàm mũi tên.

```js
let insert = (value) => ({
  into: (array) => ({
    after: (afterValue) => {
      array.splice(array.indexOf(afterValue) + 1, 0, value);
      return array;
    },
  }),
});

insert(2).into([1, 3]).after(1); // [1, 2, 3]
```

Dưới đây là một ví dụ về triển khai cơ chế pipeline, nghĩa là kết quả của hàm trước là đầu vào của hàm sau.

```js
const pipeline = (...functions) => (value) => functions.reduce((acc, fn) => fn(acc), value);

const plus1 = (a) => a + 1;
const mult2 = (a) => a * 2;
const addThenMult = pipeline(plus1, mult2);

addThenMult(5);
// 12
```

Nếu cảm thấy cách viết trên khó đọc, bạn cũng có thể sử dụng cách viết dưới đây.

```js
const plus1 = (a) => a + 1;
const mult2 = (a) => a * 2;

mult2(plus1(5));
// 12
```
