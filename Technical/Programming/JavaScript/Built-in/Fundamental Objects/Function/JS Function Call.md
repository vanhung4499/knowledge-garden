---
title: JS Function Call
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# Function.prototype.call

Phương thức `Function.prototype.call` được sử dụng để chỉ định con trỏ `this` của hàm và cung cấp các tham số riêng lẻ như là các tham số của hàm được chỉ định.

## Cú pháp

Cú pháp:

```ts
call(thisArg: any, ...argArray: any[]): any;
```

Tham số:

| Tham số  | Mô tả                                       | Kiểu |
| -------- | ------------------------------------------- | ---- |
| thisArg  | Tham số tùy chọn. Con trỏ `this` của hàm.    |      |
| argArray | Tham số tùy chọn. Danh sách các tham số riêng lẻ. |      |

## Ví dụ

```js
function Product(name, price) {
  this.name = name;
  this.price = price;
}

function Food(name, price) {
  Product.call(this, name, price);
  this.category = 'food';
}

function Toy(name, price) {
  Product.call(this, name, price);
  this.category = 'toy';
}

const cheese = new Food('cheese', 5);
const robot = new Toy('robot', 40);

console.log(cheese);
// {
//   category: "food",
//   name: "cheese",
//   price: 5,
// }
console.log(robot);
// {
//   category: "toy",
//   name: "robot",
//   price: 40,
// }
```

## Cài đặt tương thích

Cài đặt:

1. Đảm bảo người gọi `call` là một hàm.
2. Tham số: Chuyển đổi danh sách tham số thành một mảng. ❗️ (Quan trọng)
3. Ngữ cảnh thực thi: Đảm bảo ngữ cảnh `context` thực thi, sử dụng biến toàn cục `window` nếu không có.
4. Gán `this` (hàm người gọi) cho ngữ cảnh thực thi, sử dụng `Symbol` để tạo tên thuộc tính duy nhất.
5. Thực thi hàm người gọi và lưu kết quả thực thi. ❗️ (Quan trọng)
6. Xóa cặp khóa giá trị của người gọi (ngữ cảnh thực thi).
7. Trả về kết quả.

```js
Function.prototype.call = function (context) {
  // context là tham số đầu tiên trong cuộc gọi của call

  // Đầu tiên, hãy đảm bảo rằng người gọi call là một hàm
  if (typeof this !== 'function') {
    throw new TypeError(`${this}.call is not a function.`);
  }

  // Lưu trữ các tham số được cung cấp bởi người gọi
  const args = [...arguments].slice(1);

  // Xác định kiểu của ngữ cảnh thực thi, vì có thể truyền null và undefined
  context = context || window;

  // Gán nội dung của người gọi là một thuộc tính của ngữ cảnh thực thi, để đảm bảo không xung đột với các khóa trong ngữ cảnh thực thi
  const fn = Symbol('fn');

  context[fn] = this;

  // Thực thi hàm đã lưu, lúc này phạm vi sẽ được thực thi trong ngữ cảnh của đối tượng gọi, thay đổi con trỏ `this`
  const result = context[fn](...args);

  // Xóa thuộc tính vừa thêm
  delete context[fn];

  // Trả về kết quả thực thi
  return result;
};
```

Sự khác biệt giữa `call` và `apply` chỉ là cách truyền tham số:

```js
fn.call(ctx, arg1, arg2, arg3);
fn.apply(ctx, [arg1, arg2, arg3]);
```

- `call` truyền các tham số dưới dạng riêng lẻ.
- `apply` truyền các tham số dưới dạng một mảng.
