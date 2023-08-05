---
title: JS Object Status
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-06
---

# Trạng thái của đối tượng

Đối tượng JavaScript có ba tính chất chính là mở rộng, kín và đóng băng.

Các tính chất này có các phương thức tương ứng:

* Tính chất mở rộng
* Tính chất kín
* Tính chất đóng băng

## Tính chất mở rộng

Mặc định, đối tượng có thể mở rộng, có thể thêm thuộc tính mới và có thể thay đổi đối tượng nguyên mẫu.

```js
const foo = {};

foo.a = 1;

foo.__proto__ = null;

console.log(foo);
// { a: 1 }
```

Sử dụng [Object.isExtensible](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible) để kiểm tra xem một đối tượng có thể mở rộng hay không.

```js
const foo = {};

console.log(Object.isExtensible(foo));
// true
```

Sử dụng phương thức [Object.preventExtensions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions) để đánh dấu một đối tượng là không thể mở rộng (Non-Extensible).

Đối tượng không thể mở rộng có các tính chất sau:

* Không thể thêm thuộc tính mới
* Không thể thay đổi đối tượng nguyên mẫu

Thuộc tính của đối tượng vẫn có thể bị xóa và vẫn có thể thêm thuộc tính cho nguyên mẫu của đối tượng.

```js
const foo = { a: 1 };

Object.preventExtensions(foo);

// Thêm hoặc xóa thuộc tính đều thất bại mà không có lỗi
// Trong chế độ nghiêm ngặt, sẽ có lỗi
foo.b = 1;
delete foo.a;

console.log(foo);
// {}
```

Sử dụng phương thức [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) để thêm thuộc tính cho đối tượng không thể mở rộng sẽ gây ra ngoại lệ.

```js
const foo = { a: 1};

Object.preventExtensions(foo);

Object.defineProperty(foo, 'a', {
    value: 2
})

console.log(foo.a);
// 2

Object.defineProperty(foo, 'b', {
    value: 1
})
// Uncaught TypeError: Cannot define property a, object is not extensible
```

## Tính chất kín

Đối tượng bị kín có các tính chất sau:

* Đối tượng không thể mở rộng
  * Không thể thêm thuộc tính mới
  * Không thể thiết lập đối tượng nguyên mẫu
* Tất cả các thuộc tính hiện có trở thành không thể cấu hình (`configurable: false`)
  * Điều này có nghĩa là các thuộc tính hiện có không thể bị xóa
  * Thuộc tính dữ liệu không thể được định nghĩa lại
* Tất cả các thuộc tính hiện có vẫn có thể được sửa đổi (`writable: true`)

Đối tượng bị kín không thể thêm thuộc tính mới và không thể xóa các thuộc tính hiện có.

```js
const foo = Object.seal({ a: 1 });

// Không thể xóa thuộc tính
delete foo.a;
// Không thể thêm thuộc tính mới
foo.b = 1;

console.log(foo.a);
// 1
console.log(foo.b);
// undefined
```

Cố gắng xóa một thuộc tính của đối tượng bị kín hoặc chuyển đổi một thuộc tính dữ liệu thành thuộc tính truy cập sẽ thất bại mà không có thông báo lỗi hoặc ném ra TypeError.

```js
// Không thể định nghĩa lại thuộc tính dữ liệu thành thuộc tính truy cập
Object.defineProperty(foo, 'c', {
	get: function(){ return 'c' }
});
// Uncaught TypeError: Cannot define property b, object is not extensible

Object.defineProperty(foo, 'd', {
	value: 1
})
// Uncaught TypeError: Cannot define property c, object is not extensible
```

Các thuộc tính hiện có của đối tượng trước khi bị kín vẫn có thể được sửa đổi sau khi bị kín.

```js
Object.defineProperty(foo, 'a', {
  value: 2
});
console.log(foo.a);
// 2
```

Sử dụng phương thức [Object.seal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal) để đánh dấu một đối tượng là bị kín.

* Nếu một đối tượng trống trở thành không thể mở rộng, nó cũng trở thành đối tượng bị kín
* Nếu đối tượng không phải là đối tượng trống, nó sẽ không trở thành đối tượng bị kín vì tất cả các thuộc tính của đối tượng bị kín phải là không thể cấu hình
* Nếu tất cả các thuộc tính của đối tượng trở thành không thể cấu hình, đó là một đối tượng bị kín

```js
const foo = Object.seal({});

console.log(Object.isSealed(foo));
// true
```

Sử dụng phương thức [Object.isSealed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed) để kiểm tra xem một đối tượng đã bị kín hay chưa.

```js
const foo = {};
const bar = Object.seal({});

console.log(Object.isSealed(foo));
// false
console.log(Object.isSealed(bar));
// true
```

## Tính chất đóng băng

Đối tượng bị đóng băng có các tính chất sau:

* Đối tượng không thể mở rộng
  * Không thể thêm thuộc tính mới
  * Không thể thiết lập đối tượng nguyên mẫu
* Tất cả các thuộc tính hiện có trở thành không thể cấu hình (`configurable: false`)
  * Điều này có nghĩa là các thuộc tính hiện có không thể bị xóa
  * Thuộc tính dữ liệu không thể được định nghĩa lại
  * Thuộc tính truy cập cũng không thể được định nghĩa lại, tuy nhiên, do nó là một hàm, nên có thể tạo ra sự nhầm lẫn rằng thuộc tính này vẫn có thể được sửa đổi
* Không thể thay đổi giá trị của các thuộc tính hiện có (`writable: false`)

Điều này có nghĩa là đối tượng bị đóng băng là không thể thay đổi.

Đối tượng bị đóng băng không thể thêm thuộc tính mới.

```js
const foo = Object.freeze({ a: 1 })

foo.b = 1

console.log(foo.b);
// undefined

Object.defineProperty(foo, 'c', {
    value: 1
});
// Uncaught TypeError: Cannot define property c, object is not extensible
```

Đối tượng bị đóng băng không thể thiết lập đối tượng nguyên mẫu. Cả hai câu lệnh dưới đây đều sẽ gây ra lỗi TypeError.

```js
const foo = Object.freeze({ a: 1 });

Object.setPrototypeOf(foo, { x: 20 });
// Uncaught TypeError: #<Object> is not extensible

foo.__proto__ = { x: 20 };
// Uncaught TypeError: #<Object> is not extensible
```

Nếu một thuộc tính có giá trị là một đối tượng, thì các thuộc tính trong đối tượng đó vẫn có thể thay đổi, trừ khi đối tượng đó cũng bị đóng băng.

```js
const foo = { bar: {} };

Object.freeze(foo);

foo.bar.a = 1;

console.log(foo.bar.a);
// 1
```

Mảng là một loại đối tượng và khi bị đóng băng, các phần tử trong mảng không thể thay đổi. Không có phần tử nào có thể được thêm vào hoặc xóa khỏi mảng.

```js
const foo = [0];

Object.freeze(foo);

a[0] = 1;
a.push(2);

console.log(a);
// [0]
```

Sử dụng [Object.isFrozen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen) để kiểm tra xem một đối tượng đã bị đóng băng hay chưa.

```js
const foo = Object.freeze({})

console.log(Object.isFrozen(foo));
// true
```

Nếu một đối tượng có một thuộc tính là một đối tượng, thì việc đóng băng đối tượng bên ngoài không ảnh hưởng đến khả năng thay đổi thuộc tính của đối tượng bên trong. Điều này được gọi là đóng băng nông (shallow freeze). Tuy nhiên, nếu đóng băng đối tượng bên ngoài cũng đóng băng tất cả các đối tượng bên trong, bao gồm cả các thuộc tính đệ quy, thì được gọi là đóng băng sâu (deep freeze).

```js
// Hàm đóng băng sâu
function deepFreeze(o) {

  // Lấy tên thuộc tính được định nghĩa trên đối tượng
  const propNames = Object.getOwnPropertyNames(o);

  // Đóng băng thuộc tính trước khi đóng băng chính nó
  propNames.forEach(function(name) {
    const prop = o[name];

    // Nếu prop là một đối tượng, đóng băng nó
    if (typeof prop == 'object' && prop !== null) {
      deepFreeze(prop);
    }
  });

  // Đóng băng chính nó (nếu chưa đóng băng)
  return Object.freeze(o);
}

const foo = { bar: {} };

deepFreeze(foo);

foo.bar.a = 1;

console.log(foo.bar.a);
// undefined
```

## Tổng kết

|          | Thêm thuộc tính mới | Xóa thuộc tính hiện có | Cấu hình thuộc tính dữ liệu | Thuộc tính hiện có có thể ghi |
| :------- | :----------------: | :-------------------: | :-----------------------: | :--------------------------: |
| Mở rộng  |         ❌          |          ✅           |           ✅               |             ✅               |
| Kín      |         ❌          |          ❌            |           ❌               |             ✅               |
| Đóng băng |         ❌          |          ❌            |           ❌               |             ❌               |
