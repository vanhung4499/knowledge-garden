---
title: JS Attributes Object
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-06
---

# Mô tả thuộc tính đối tượng

Phiên bản 5 của ECMA-262 đã định nghĩa các thuộc tính (Attribute) chỉ được sử dụng bên trong để mô tả các thuộc tính (Property) của đối tượng. Các thuộc tính này là các giá trị nội bộ và không thể truy cập trực tiếp trong JavaScript. Để biểu thị rằng các thuộc tính này là các giá trị nội bộ, quy tắc này đặt chúng trong cặp dấu ngoặc vuông `[[ ]]`.

Có hai loại thuộc tính mô tả đối tượng: **Thuộc tính dữ liệu** và **Thuộc tính truy cập**.

## Thuộc tính dữ liệu

Thuộc tính dữ liệu (Data Property) chứa một vị trí dữ liệu, nơi mà giá trị có thể được đọc và ghi. Thuộc tính dữ liệu có 4 thuộc tính.

| Thuộc tính dữ liệu  | Mô tả                                                                                                        | Giá trị mặc định |
| ------------------ | ----------------------------------------------------------------------------------------------------------- | --------------- |
| `[[Configurable]]` | **Khả năng cấu hình** xác định xem có thể sử dụng `delete` để xóa thuộc tính và xem có thể thay đổi thuộc tính | true            |
| `[[Enumerable]]`   | **Khả năng liệt kê** xác định xem thuộc tính có xuất hiện trong liệt kê thuộc tính của đối tượng hay không    | true            |
| `[[Writable]]`     | **Khả năng ghi** xác định xem giá trị thuộc tính có thể thay đổi hay không                                    | true            |
| `[[Value]]`        | **Giá trị thuộc tính** chứa giá trị dữ liệu của thuộc tính, khi đọc giá trị thuộc tính, đọc từ vị trí này    | undefined       |

### Khả năng ghi

Khả năng ghi (Writable) xác định xem có thể thay đổi giá trị của thuộc tính hay không, giá trị mặc định là `true`.

```js
let foo = { a: 1 };
foo.a = 2;

console.log(foo.a);
// 2
```

Khi thiết lập `writable: false`, câu lệnh gán giá trị sẽ không có hiệu lực.

```js
let foo = { a: 1 };

Object.defineProperty(foo, 'a', {
  writable: false,
});

foo.a = 2;

console.log(foo.a);
// 1
```

Sau khi thiết lập `writable: false`, việc thay đổi giá trị thuộc tính `value` bằng phương thức [Object.defineProperty()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) sẽ không bị ảnh hưởng, vì điều này cũng có nghĩa là thiết lập lại giá trị thuộc tính `writable` thành `true`.

```js
let foo = { a: 1 };

Object.defineProperty(foo, 'a', {
  writable: false,
});

console.log(foo.a);
// 1

Object.defineProperty(foo, 'a', {
  value: 2,
});

console.log(foo.a);
// 2
```

### Khả năng cấu hình

Khả năng cấu hình (Configurable) xác định xem có thể sử dụng `delete` để xóa thuộc tính và xem có thể thay đổi mô tả thuộc tính hay không, giá trị mặc định là `true`.

Khi thiết lập `configurable: false`, không thể sử dụng `delete` để xóa thuộc tính.

```js
let foo = { a: 1 };

Object.defineProperty(foo, 'a', {
  configurable: false,
});

delete foo.a;
// false

console.log(foo.a);
// 1
```

Thường thì sau khi thiết lập `configurable: false`, không thể sử dụng phương thức [Object.defineProperty()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) để thay đổi mô tả thuộc tính.

```js
let foo = { a: 1 };

Object.defineProperty(foo, 'a', {
  configurable: false,
});

Object.defineProperty(foo, 'a', {
  configurable: true,
});
// Uncaught TypeError: Cannot redefine property: a
```

Tuy nhiên, có một ngoại lệ, sau khi thiết lập `configurable: false`, chỉ cho phép thay đổi thuộc tính `writable` từ `true` thành `false`.

```js
let foo = { a: 1 };

Object.defineProperty(foo, 'a', {
  configurable: false,
  writable: true,
});

foo.a = 2;

console.log(foo.a);
// 2

Object.defineProperty(foo, 'a', {
  writable: false,
});

// Vì writable: false có hiệu lực, thuộc tính `bar` của đối tượng foo không thể thay đổi giá trị
// Vì vậy, câu lệnh gán `foo.bar = 3` thất bại mà không có thông báo lỗi
foo.a = 3;

console.log(foo.a);
// 2
```

### Khả năng liệt kê

Khả năng liệt kê (Enumerable) xác định xem thuộc tính có xuất hiện trong liệt kê thuộc tính của đối tượng hay không. Cụ thể, thuộc tính có thể được truy cập thông qua vòng lặp `for-in`, phương thức `Object.keys`, `JSON.stringify` và các phương thức tương tự.

Ngoài ra, có thể sử dụng phương thức [Object.propertyIsEnumerable()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable) để kiểm tra xem thuộc tính của đối tượng có thể liệt kê hay không.

**Thuộc tính thông thường được định nghĩa bởi người dùng mặc định là có thể liệt kê**, trong khi **các thuộc tính được kế thừa từ nguyên mẫu mặc định là không thể liệt kê**.

🌰 **Ví dụ:**

Vì các thuộc tính được kế thừa từ nguyên mẫu mặc định là không thể liệt kê, nên chỉ thu được thuộc tính tùy chỉnh `a: 1`.

```js
let foo = { a: 1 };

for (let item in foo) {
  console.log(foo[item]);
  // 1
}
```

Vì `enumerable` được thiết lập thành `false`, thuộc tính `a` không thể được liệt kê trong vòng lặp `for-in`.

```js
let foo = { a: 1 };

Object.defineProperty(foo, 'a', { enumerable: false });

for (let item in foo) {
  console.log(foo[item]);
  // undefined
}
```

## Thuộc tính truy cập

Thuộc tính truy cập không chứa giá trị dữ liệu, mà chúng chứa hai phương thức là hàm `getter` và hàm `setter` (không bắt buộc).

- Khi đọc thuộc tính truy cập, hàm `getter` sẽ được gọi, **hàm này trả về giá trị hợp lệ**
- Khi ghi vào thuộc tính truy cập, hàm `setter` sẽ được gọi và truyền giá trị mới vào, **hàm này quyết định cách xử lý dữ liệu**

| Thuộc tính truy cập | Mô tả                                  | Giá trị mặc định |
| :----------------- | :------------------------------------- | --------------- |
| `[[Configurable]]` | Giống với `[[Configurable]]` trong dữ liệu | true            |
| `[[Enumberable]]`  | Giống với `[[Enumberable]]` trong dữ liệu  | true            |
| `[[Getter]]`       | Hàm được gọi khi **đọc thuộc tính**       | undefined       |
| `[[Setter]]`       | Hàm được gọi khi **ghi vào thuộc tính**    | undefined       |

Khác với thuộc tính dữ liệu, thuộc tính truy cập **không thể ghi** (Writable).

- Nếu thuộc tính có cả phương thức `getter` và `setter`, thì nó là thuộc tính đọc / ghi.
- Nếu chỉ có phương thức `getter`, thì nó là thuộc tính chỉ đọc.
- Nếu chỉ có phương thức `setter`, thì nó là thuộc tính chỉ ghi. Đọc thuộc tính chỉ ghi sẽ luôn trả về `undefined`.

### Getter

`[[Getter]]` là một hàm ẩn, được gọi khi lấy giá trị thuộc tính.

Gán giá trị cho đối tượng chỉ có phương thức `get` mà không có phương thức `set` sẽ thất bại mà không có thông báo lỗi. Trong chế độ nghiêm ngặt, nó sẽ báo lỗi.

```js
const foo = {
  get a() {
    return 2;
  },
};

console.log(foo.a);
// 2

// Không hợp lệ
foo.a = 3;

console.log(foo.a);
// 2
```

### Setter

`[[Setter]]` cũng là một hàm ẩn, được gọi khi gán giá trị cho thuộc tính, giá trị mặc định là `undefined`.

Chỉ có phương thức `set` mà không có phương thức `get`, giá trị thuộc tính của đối tượng sẽ là `undefined`.

```js
let foo = {
  set a(val) {
    return 2;
  },
};

foo.a = 1;

console.log(foo.a);
// undefined
```

Thường thì phương thức `set` và `get` cần phải xuất hiện cùng nhau.

```js
const foo = {
  get a() {
    return this._a;
  },
  set a(val) {
    this._a = val * 2;
  },
};

foo.a = 1;

console.log(foo.a);
// 2
```
