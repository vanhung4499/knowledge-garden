---
title: TS Any
tags:
  - ts
categories: ts
date created: 2023-12-28
date modified: 2023-12-28
---

# Giá trị bất kỳ

Giá trị bất kỳ (Any) được sử dụng để đại diện cho khả năng gán giá trị cho bất kỳ loại dữ liệu nào.

## Khái niệm về kiểu giá trị bất kỳ

Nếu một biến có kiểu dữ liệu thông thường, thì không được phép thay đổi kiểu dữ liệu trong quá trình gán giá trị:

```ts
let myFavoriteNumber: string = 'seven';
myFavoriteNumber = 7;

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

Tuy nhiên, nếu kiểu dữ liệu là `any`, thì cho phép gán giá trị bất kỳ loại dữ liệu nào.

```ts
let myFavoriteNumber: any = 'seven';
myFavoriteNumber = 7;
```

## Thuộc tính và phương thức của giá trị bất kỳ

Trên giá trị bất kỳ, ta có thể truy cập vào bất kỳ thuộc tính nào:

```ts
let anyThing: any = 'hello';
console.log(anyThing.myName);
console.log(anyThing.myName.firstName);
```

Cũng cho phép gọi bất kỳ phương thức nào:

```ts
let anyThing: any = 'Tom';
anyThing.setName('Jerry');
anyThing.setName('Jerry').sayHello();
anyThing.myName.setFirstName('Cat');
```

Có thể coi, **khi khai báo một biến với kiểu dữ liệu bất kỳ, bất kỳ thao tác nào trên biến đó, kiểu dữ liệu của kết quả trả về cũng là giá trị bất kỳ**.

## Biến chưa khai báo kiểu dữ liệu

**Nếu biến không được khai báo kiểu dữ liệu khi khai báo, thì nó sẽ được xem như là kiểu dữ liệu bất kỳ**:

```ts
let something;
something = 'seven';
something = 7;

something.setName('Tom');
```

Tương đương với

```ts
let something: any;
something = 'seven';
something = 7;

something.setName('Tom');
```
