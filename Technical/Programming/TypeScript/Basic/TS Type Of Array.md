---
title: TS Type Of Array
tags:
  - ts
categories: ts
date created: 2023-12-28
date modified: 2023-12-28
---

# Kiểu dữ liệu mảng

Trong TypeScript, có nhiều cách để định nghĩa kiểu dữ liệu mảng, khá linh hoạt.

## Cách định nghĩa bằng "kiểu + dấu ngoặc vuông"

Cách đơn giản nhất là sử dụng "kiểu + dấu ngoặc vuông" để định nghĩa kiểu dữ liệu mảng:

```ts
let fibonacci: number[] = [1, 1, 2, 3, 5];
```

Trong mảng, không cho phép xuất hiện các kiểu dữ liệu khác:

```ts
let fibonacci: number[] = [1, '1', 2, 3, 5];

// Type 'string' is not assignable to type 'number'.
```

Các tham số của một số phương thức của mảng cũng sẽ bị giới hạn theo kiểu dữ liệu đã định nghĩa trong khi khai báo:

```ts
let fibonacci: number[] = [1, 1, 2, 3, 5];
fibonacci.push('8');

// Argument of type '"8"' is not assignable to parameter of type 'number'.
```

Trong ví dụ trên, phương thức `push` chỉ cho phép truyền vào tham số kiểu `number`, nhưng lại truyền một tham số kiểu `"8"`, nên báo lỗi. Ở đây, `"8"` là một kiểu dữ liệu chuỗi con, sẽ được giới thiệu chi tiết trong các chương sau.

## Kiểu dữ liệu mảng thông qua Generic

Chúng ta cũng có thể sử dụng Generic của mảng `Array<elemType>` để định nghĩa kiểu dữ liệu mảng:

```ts
let fibonacci: Array<number> = [1, 1, 2, 3, 5];
```

Về Generic, bạn có thể tham khảo chương [Generic](../advanced/generics.md).

## Sử dụng interface để định nghĩa mảng

Interface cũng có thể được sử dụng để mô tả kiểu dữ liệu mảng:

```ts
interface NumberArray {
    [index: number]: number;
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5];
```

`NumberArray` đại diện cho việc chỉ cần kiểu dữ liệu của chỉ số là số, thì kiểu dữ liệu của giá trị cũng phải là số.

Mặc dù interface cũng có thể được sử dụng để mô tả mảng, nhưng chúng ta thường không sử dụng cách này, vì nó phức tạp hơn hai cách trước.

Tuy nhiên, có một trường hợp ngoại lệ, đó là khi sử dụng để mô tả mảng giống như mảng của lớp.

## Mảng giống như lớp

Mảng giống như lớp (Array-like Object) không phải là kiểu dữ liệu mảng, ví dụ như `arguments`:

```ts
function sum() {
    let args: number[] = arguments;
}

// Type 'IArguments' is missing the following properties from type 'number[]': pop, push, concat, join, and 24 more.
```

Trong ví dụ trên, `arguments` thực tế là một mảng giống như lớp, không thể mô tả bằng cách sử dụng mảng thông thường, mà phải sử dụng interface:

```ts
function sum() {
    let args: {
        [index: number]: number;
        length: number;
        callee: Function;
    } = arguments;
}
```

Trong ví dụ này, chúng ta không chỉ ràng buộc kiểu dữ liệu của giá trị khi chỉ số là số, mà còn ràng buộc nó phải có hai thuộc tính `length` và `callee`.

Thực tế, các mảng giống như lớp thông thường đã có các interface tương ứng, như `IArguments`, `NodeList`, `HTMLCollection`, v.v.:

```ts
function sum() {
    let args: IArguments = arguments;
}
```

Trong đó, `IArguments` là một kiểu dữ liệu được định nghĩa sẵn trong TypeScript, thực tế nó chính là:

```ts
interface IArguments {
    [index: number]: any;
    length: number;
    callee: Function;
}
```

Về các đối tượng được tích hợp sẵn, bạn có thể tham khảo chương [[TS Built-in Objects]].

## Ứng dụng của any trong mảng

Một cách thường gặp là sử dụng `any` để cho phép xuất hiện bất kỳ kiểu dữ liệu nào trong mảng:

```ts
let list: any[] = ['vanhung4499', 25, { website: 'http://vanhung4499.com' }];
```
