---
title: TS Type Of Object Interfaces
tags:
  - ts
categories: ts
date created: 2023-12-28
date modified: 2023-12-28
---

# Kiểu dữ liệu của đối tượng - Interface

Trong TypeScript, chúng ta sử dụng interface (giao diện) để định nghĩa kiểu dữ liệu của đối tượng.

## Khái niệm về interface

Trong ngôn ngữ hướng đối tượng, interface là một khái niệm quan trọng, nó đại diện cho hành vi của một đối tượng, trong khi cách triển khai cụ thể được triển khai bởi các lớp.

Trong TypeScript, interface là một khái niệm rất linh hoạt, ngoài việc sử dụng để trừu tượng hành vi của một phần của một lớp, nó cũng thường được sử dụng để mô tả "hình dạng" của một đối tượng.

## Ví dụ đơn giản

```ts
interface Person {
    name: string;
    age: number;
}

let tom: Person = {
    name: 'Tom',
    age: 25
};
```

Trong ví dụ trên, chúng ta định nghĩa một interface `Person`, sau đó định nghĩa một biến `tom`, kiểu dữ liệu của nó là `Person`. Như vậy, chúng ta giới hạn `tom` phải có hình dạng giống với interface `Person`.

Interface thường được viết hoa chữ cái đầu. [Một số ngôn ngữ lập trình khuyến khích việc thêm tiền tố `I` vào tên interface](https://msdn.microsoft.com/en-us/library/8bc1fexb%28v=vs.71%29.aspx).

Không được phép thiếu một số thuộc tính khi gán giá trị cho biến:

```ts
interface Person {
    name: string;
    age: number;
}

let tom: Person = {
    name: 'Tom'
};

// index.ts(6,5): error TS2322: Type '{ name: string; }' is not assignable to type 'Person'.
//   Property 'age' is missing in type '{ name: string; }'.
```

Cũng không được phép có thêm các thuộc tính khác:

```ts
interface Person {
    name: string;
    age: number;
}

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};

// index.ts(9,5): error TS2322: Type '{ name: string; age: number; gender: string; }' is not assignable to type 'Person'.
//   Object literal may only specify known properties, and 'gender' does not exist in type 'Person'.
```

Như vậy, **khi gán giá trị, hình dạng của biến phải giống với hình dạng của interface**.

## Thuộc tính tùy chọn

Đôi khi chúng ta muốn không yêu cầu khớp hoàn toàn với một hình dạng, trong trường hợp này chúng ta có thể sử dụng thuộc tính tùy chọn:

```ts
interface Person {
    name: string;
    age?: number;
}

let tom: Person = {
    name: 'Tom'
};
```

```ts
interface Person {
    name: string;
    age?: number;
}

let tom: Person = {
    name: 'Tom',
    age: 25
};
```

Ý nghĩa của thuộc tính tùy chọn là thuộc tính đó có thể không tồn tại.

Tuy nhiên, **vẫn không được phép thêm thuộc tính chưa được định nghĩa**:

```ts
interface Person {
    name: string;
    age?: number;
}

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};

// examples/playground/index.ts(9,5): error TS2322: Type '{ name: string; age: number; gender: string; }' is not assignable to type 'Person'.
//   Object literal may only specify known properties, and 'gender' does not exist in type 'Person'.
```

## Thuộc tính tùy ý

Đôi khi chúng ta muốn một interface cho phép có bất kỳ thuộc tính nào, chúng ta có thể sử dụng cú pháp sau:

```ts
interface Person {
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    name: 'Tom',
    gender: 'male'
};
```

Chúng ta sử dụng `[propName: string]` để định nghĩa một thuộc tính tùy ý có giá trị kiểu `string`.

Cần lưu ý rằng, **khi đã định nghĩa thuộc tính tùy ý, các thuộc tính bắt buộc và tùy chọn phải là một phần con của kiểu dữ liệu của thuộc tính tùy ý**:

```ts
interface Person {
    name: string;
    age?: number;
    [propName: string]: string;
}

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};

// index.ts(3,5): error TS2411: Property 'age' of type 'number' is not assignable to string index type 'string'.
// index.ts(7,5): error TS2322: Type '{ [x: string]: string | number; name: string; age: number; gender: string; }' is not assignable to type 'Person'.
//   Index signatures are incompatible.
//     Type 'string | number' is not assignable to type 'string'.
//       Type 'number' is not assignable to type 'string'.
```

Trong ví dụ trên, giá trị của thuộc tính tùy ý có kiểu `string`, nhưng thuộc tính tùy chọn `age` có giá trị kiểu `number`, `number` không phải là một phần con của kiểu `string`, nên báo lỗi.

Ngoài ra, trong thông báo lỗi, chúng ta có thể thấy rằng kiểu của `{ name: 'Tom', age: 25, gender: 'male' }` được suy ra là `{ [x: string]: string | number; name: string; age: number; gender: string; }`, đây là sự kết hợp giữa kiểu liên hợp và interface.

Một interface chỉ có thể định nghĩa một thuộc tính tùy ý. Nếu interface có nhiều loại thuộc tính, chúng ta có thể sử dụng kiểu liên kết trong thuộc tính tùy ý:

```ts
interface Person {
    name: string;
    age?: number;
    [propName: string]: string | number;
}

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};
```

## Thuộc tính chỉ đọc

Đôi khi chúng ta muốn một số trường trong đối tượng chỉ có thể được gán giá trị khi tạo đối tượng, chúng ta có thể sử dụng từ khóa `readonly` để định nghĩa thuộc tính chỉ đọc:

```ts
interface Person {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    id: 89757,
    name: 'Tom',
    gender: 'male'
};

tom.id = 9527;

// index.ts(14,5): error TS2540: Cannot assign to 'id' because it is a constant or a read-only property.
```

Trong ví dụ trên, thuộc tính `id` được định nghĩa là chỉ đọc bằng từ khóa `readonly`, sau đó được gán giá trị, nên báo lỗi.

**Lưu ý, ràng buộc chỉ đọc áp dụng cho lần gán đầu tiên của đối tượng, không phải cho lần gán đầu tiên của thuộc tính chỉ đọc**:

```ts
interface Person {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    name: 'Tom',
    gender: 'male'
};

tom.id = 89757;

// index.ts(8,5): error TS2322: Type '{ name: string; gender: string; }' is not assignable to type 'Person'.
//   Property 'id' is missing in type '{ name: string; gender: string; }'.
// index.ts(13,5): error TS2540: Cannot assign to 'id' because it is a constant or a read-only property.
```

Trong ví dụ trên, thông báo lỗi xuất hiện hai lần. Lần đầu tiên là khi gán giá trị cho `tom`, không gán giá trị cho `id`.

Lần thứ hai là khi gán giá trị cho `tom.id`, vì nó là thuộc tính chỉ đọc, nên báo lỗi.
