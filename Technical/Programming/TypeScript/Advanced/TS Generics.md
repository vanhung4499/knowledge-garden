---
title: TS Generics
tags:
  - ts
categories:
  - ts
date created: 2024-03-15
date modified: 2024-03-15
---

# Generics

Generics là một tính năng cho phép bạn định nghĩa hàm, interface hoặc class mà không cần chỉ định trước kiểu cụ thể, và sau đó chỉ định kiểu cụ thể khi sử dụng.

## Ví dụ đơn giản

Đầu tiên, chúng ta sẽ triển khai một hàm `createArray`, nó có thể tạo ra một mảng có độ dài xác định, đồng thời điền tất cả các mục với một giá trị mặc định:

```ts
function createArray(length: number, value: any): Array<any> {
    let result = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```

Trong ví dụ trên, chúng tôi đã sử dụng [[TS Type Of Array#Kiểu dữ liệu mảng thông qua Generic|generics array]] mà chúng tôi đã đề cập trước đó để định nghĩa kiểu trả về.

Mã này không báo lỗi khi biên dịch, nhưng một nhược điểm rõ ràng là nó không xác định chính xác kiểu trả về:

`Array<any>` cho phép mỗi mục trong mảng là bất kỳ kiểu nào. Nhưng mong đợi của chúng tôi là, mỗi mục trong mảng nên là kiểu của giá trị đầu vào.

Lúc này, generics sẽ có ích:

```ts
function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray<string>(3, 'x'); // ['x', 'x', 'x']
```

Trong ví dụ trên, chúng tôi đã thêm `<T>` sau tên hàm, trong đó `T` được sử dụng để chỉ đại diện cho bất kỳ kiểu đầu vào nào, sau đó nó có thể được sử dụng trong giá trị đầu vào `value: T` và đầu ra `Array<T>`.

Tiếp theo, khi bạn gọi nó, bạn có thể chỉ định rõ ràng rằng kiểu cụ thể của nó là `string`. Tất nhiên, bạn cũng có thể không chỉ định một cách thủ công, mà để suy luận kiểu tự động suy ra:

```ts
function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```

## Nhiều tham số kiểu

Khi định nghĩa generics, bạn có thể định nghĩa nhiều tham số kiểu cùng một lúc:

```ts
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

swap([7, 'seven']); // ['seven', 7]
```

Trong ví dụ trên, chúng tôi đã định nghĩa một hàm `swap` để hoán đổi các phần tử của mảng đầu vào.

## Ràng buộc generics

Khi sử dụng biến generics bên trong hàm, bởi vì không biết trước nó là kiểu gì, nên bạn không thể tự do thao tác các thuộc tính hoặc phương thức của nó:

```ts
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);
    return arg;
}

// index.ts(2,19): error TS2339: Property 'length' does not exist on type 'T'.
```

Trong ví dụ trên, generics `T` có thể không bao gồm thuộc tính `length`, do đó, nó sẽ báo lỗi khi biên dịch.

Lúc này, chúng ta có thể ràng buộc generics, chỉ cho phép hàm này chấp nhận những biến chứa thuộc tính `length`. Đây chính là ràng buộc generics:

```ts
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}
```

Trong ví dụ trên, chúng tôi đã sử dụng `extends` để ràng buộc generics `T` phải tuân thủ hình dạng của interface `Lengthwise`, tức là phải chứa thuộc tính `length`.

Bây giờ, nếu bạn gọi `loggingIdentity` và `arg` đầu vào không chứa `length`, nó sẽ báo lỗi trong giai đoạn biên dịch:

```ts
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}

loggingIdentity(7);

// index.ts(10,17): error TS2345: Argument of type '7' is not assignable to parameter of type 'Lengthwise'.
```

Các tham số kiểu có thể ràng buộc lẫn nhau:

```ts
function copyFields<T extends U, U>(target: T, source: U): T {
    for (let id in source) {
        target[id] = (<T>source)[id];
    }
    return target;
}

let x = { a: 1, b: 2, c: 3, d: 4 };

copyFields(x, { b: 10, d: 20 });
```

Trong ví dụ trên, chúng tôi đã sử dụng hai tham số kiểu, trong đó yêu cầu `T` kế thừa từ `U`, điều này đảm bảo rằng `U` sẽ không xuất hiện các trường không tồn tại trong `T`.

## Generics Interface

[[TS Type Of Function#Sử dụng interface để định nghĩa hàm|Chúng ta đã học trước đó]], có thể sử dụng interface để định nghĩa hình dạng mà một hàm cần phải tuân theo:

```ts
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}
```

Tất nhiên, bạn cũng có thể sử dụng interface chứa generics để định nghĩa hình dạng của hàm:

```ts
interface CreateArrayFunc {
    <T>(length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```

Đi xa hơn, chúng ta có thể đưa tham số generics lên trước tên interface:

```ts
interface CreateArrayFunc<T> {
    (length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc<any>;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```

Lưu ý, khi sử dụng generics interface, bạn cần định nghĩa kiểu của tham số generics.

## Generics Class

Tương tự như generics interface, generics cũng có thể được sử dụng trong định nghĩa kiểu của class:

```ts
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

## Kiểu mặc định cho tham số generics

Bắt đầu từ TypeScript 2.3, chúng ta có thể chỉ định kiểu mặc định cho tham số kiểu trong generics. Khi sử dụng generics mà không chỉ định trực tiếp tham số kiểu trong mã và cũng không thể suy ra từ tham số giá trị thực tế, kiểu mặc định này sẽ được sử dụng.

```ts
function createArray<T = string>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
```
