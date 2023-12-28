---
title: TS Union Types
tags:
  - ts
categories: ts
date created: 2023-12-28
date modified: 2023-12-28
---

# Kiểu liên hợp

Kiểu liên hợp (Union Types) đại diện cho giá trị có thể thuộc một trong nhiều kiểu dữ liệu khác nhau.

## Ví dụ đơn giản

```ts
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
myFavoriteNumber = 7;
```

```ts
let myFavoriteNumber: string | number;
myFavoriteNumber = true;

// index.ts(2,1): error TS2322: Type 'boolean' is not assignable to type 'string | number'.
//   Type 'boolean' is not assignable to type 'number'.
```

Kiểu liên hợp sử dụng dấu `|` để phân tách các kiểu dữ liệu.

Ý nghĩa của `let myFavoriteNumber: string | number` là cho phép `myFavoriteNumber` có kiểu dữ liệu là `string` hoặc `number`, nhưng không thể là kiểu dữ liệu khác.

## Truy cập thuộc tính hoặc phương thức của kiểu liên hợp

Khi TypeScript không chắc chắn biến kiểu liên hợp thuộc về kiểu dữ liệu nào, chúng ta **chỉ có thể truy cập vào các thuộc tính hoặc phương thức chung của các kiểu dữ liệu trong kiểu liên hợp đó**:

```ts
function getLength(something: string | number): number {
    return something.length;
}

// index.ts(2,22): error TS2339: Property 'length' does not exist on type 'string | number'.
//   Property 'length' does not exist on type 'number'.
```

Trong ví dụ trên, `length` không phải là thuộc tính chung của `string` và `number`, nên sẽ báo lỗi.

Việc truy cập vào thuộc tính chung của `string` và `number` thì không có vấn đề:

```ts
function getString(something: string | number): string {
    return something.toString();
}
```

Biến kiểu liên hợp sẽ được suy ra một kiểu dữ liệu dựa trên quy tắc rút trích kiểu:

```ts
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
console.log(myFavoriteNumber.length); // 5
myFavoriteNumber = 7;
console.log(myFavoriteNumber.length); // Báo lỗi biên dịch

// index.ts(5,30): error TS2339: Property 'length' does not exist on type 'number'.
```

Trong ví dụ trên, dòng thứ hai `myFavoriteNumber` được suy ra là kiểu `string`, nên truy cập thuộc tính `length` không bị lỗi.

Còn dòng thứ tư `myFavoriteNumber` được suy ra là kiểu `number`, nên khi truy cập thuộc tính `length` sẽ bị lỗi.

## Tham khảo

- [Advanced Types # Union Types](http://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types)
