---
title: TS Primitive Data Types
tags:
  - ts
categories: ts
date created: 2023-12-28
date modified: 2023-12-28
---

# Kiểu dữ liệu nguyên thủy

Trong JavaScript, có hai loại kiểu dữ liệu: kiểu dữ liệu nguyên thủy (Primitive data types) và kiểu dữ liệu đối tượng (Object types).

Kiểu dữ liệu nguyên thủy bao gồm: boolean, number, string, null, undefined và các kiểu mới như Symbol trong ES6 và BigInt trong ES10.

Phần này tập trung giới thiệu 5 kiểu dữ liệu nguyên thủy đầu tiên trong TypeScript.

## Kiểu boolean

Kiểu boolean là kiểu dữ liệu cơ bản nhất, trong TypeScript, chúng ta sử dụng `boolean` để định nghĩa kiểu dữ liệu boolean:

```ts
let isDone: boolean = false;

// Biên dịch thành công
// Mặc định, các đoạn mã không nhắc đến lỗi biên dịch được cho là biên dịch thành công
```

Lưu ý, việc sử dụng hàm tạo `Boolean` để tạo đối tượng **không phải** là kiểu boolean:

```ts
let createdByNewBoolean: boolean = new Boolean(1);

// Type 'Boolean' is not assignable to type 'boolean'.
//   'boolean' là một kiểu nguyên thủy, trong khi 'Boolean' là một đối tượng bọc. Ưu tiên sử dụng 'boolean' khi có thể.
```

Thực tế, `new Boolean()` trả về một đối tượng `Boolean`:

```ts
let createdByNewBoolean: Boolean = new Boolean(1);
```

Việc gọi trực tiếp `Boolean` cũng có thể trả về một kiểu `boolean`:

```ts
let createdByBoolean: boolean = Boolean(1);
```

Trong TypeScript, `boolean` là kiểu dữ liệu cơ bản trong JavaScript, trong khi `Boolean` là hàm tạo kiểu dữ liệu trong JavaScript. Các kiểu dữ liệu cơ bản khác (ngoại trừ `null` và `undefined`) cũng tương tự và không được bàn thêm chi tiết.

## Kiểu Number

Sử dụng `number` để định nghĩa kiểu dữ liệu số:

```ts
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
// Cách biểu diễn số nhị phân trong ES6
let binaryLiteral: number = 0b1010;
// Cách biểu diễn số bát phân trong ES6
let octalLiteral: number = 0o744;
let notANumber: number = NaN;
let infinityNumber: number = Infinity;
```

Kết quả biên dịch:

```js
var decLiteral = 6;
var hexLiteral = 0xf00d;
// Cách biểu diễn số nhị phân trong ES6
var binaryLiteral = 10;
// Cách biểu diễn số bát phân trong ES6
var octalLiteral = 484;
var notANumber = NaN;
var infinityNumber = Infinity;
```

Trong đó, `0b1010` và `0o744` là [cách biểu diễn số nhị phân và bát phân trong ES6][ES6 中的二进制和八进制表示法], chúng sẽ được biên dịch thành số thập phân.

## Kiểu string

Sử dụng `string` để định nghĩa kiểu dữ liệu chuỗi:

```ts
let myName: string = 'Tom';
let myAge: number = 25;

// Chuỗi mẫu
let sentence: string = `Xin chào, tôi là ${myName}.
Tôi sẽ tròn ${myAge + 1} tuổi vào tháng sau.`;
```

Kết quả biên dịch:

```js
var myName = 'Tom';
var myAge = 25;
// Chuỗi mẫu
var sentence = "Xin chào, tôi là " + myName + ".\nTôi sẽ tròn " + (myAge + 1) + " tuổi vào tháng sau.";
```

Ở đây, <code>&#96;</code> được sử dụng để định nghĩa [chuỗi mẫu trong ES6][ES6 中的模板字符串], và `${expr}` được sử dụng để nhúng biểu thức trong chuỗi mẫu.

## Kiểu void

JavaScript không có khái niệm kiểu Void. Trong TypeScript, có thể sử dụng `void` để chỉ ra một hàm không trả về giá trị nào:

```ts
function alertName(): void {
    alert('Tên của tôi là Tom');
}
```

Việc khai báo một biến kiểu `void` không có ý nghĩa gì, bởi vì bạn chỉ có thể gán nó bằng `undefined` hoặc `null` (chỉ khi --strictNullChecks không được chỉ định):

```ts
let unusable: void = undefined;
```

## Kiểu Null và Undefined

Trong TypeScript, có thể sử dụng `null` và `undefined` để định nghĩa hai kiểu dữ liệu cơ bản này:

```ts
let u: undefined = undefined;
let n: null = null;
```

Sự khác biệt giữa `void` là `undefined` và `null` là chúng là con của tất cả các kiểu. Điều này có nghĩa là biến kiểu `undefined` có thể gán cho biến kiểu `number`:

```ts
// Không có lỗi
let num: number = undefined;
```

```ts
// Cũng không có lỗi
let u: undefined;
let num: number = u;
```

Trong khi biến kiểu `void` không thể gán cho biến kiểu `number`:

```ts
let u: void;
let num: number = u;

// Type 'void' is not assignable to type 'number'.
```
