---
title: TS Type Assertion
tags:
  - ts
categories:
  - ts
date created: 2023-12-30
date modified: 2023-12-30
---

# Type Assertion

Khẳng định kiểu (Type Assertion) được sử dụng để xác định một giá trị có kiểu dữ liệu cụ thể.

## Cú pháp

```ts
value as type
```

hoặc

```ts
<type>value
```

Trong cú pháp tsx (phiên bản ts của jsx trong React), chúng ta phải sử dụng cú pháp đầu tiên, tức là `value as type`.

Cú pháp dạng `<Foo>` trong tsx thường được sử dụng để đại diện cho một `ReactNode`, trong ts ngoài việc sử dụng để khẳng định kiểu dữ liệu, cũng có thể được sử dụng để đại diện cho một [[TS Generics|generic]].

Vì vậy, chúng tôi khuyến nghị rằng khi sử dụng Khẳng định kiểu, hãy sử dụng cú pháp `value as type`, và tôi sẽ tuân thủ nguyên tắc này trong hướng dẫn này.

## Mục đích của Type Assertion

Type Assertion thường được sử dụng cho các mục đích sau:

- Chuyển đổi kiểu dữ liệu: Khẳng định kiểu cho phép chúng ta chuyển đổi một giá trị từ kiểu dữ liệu này sang kiểu dữ liệu khác.
- Gợi ý kiểu dữ liệu: Trong một số trường hợp, TypeScript không thể xác định chính xác kiểu dữ liệu của một giá trị. Khẳng định kiểu có thể được sử dụng để gợi ý kiểu dữ liệu cho TypeScript.
- Xác định kiểu dữ liệu: Trong một số trường hợp, chúng ta có thể biết chính xác kiểu dữ liệu của một giá trị và sử dụng Khẳng định kiểu để xác định kiểu dữ liệu đó.

### Chuyển đổi một kiểu liên hợp thành một trong các kiểu

[[TS Union Types#Truy cập thuộc tính hoặc phương thức của kiểu liên hợp|Như đã đề cập trước đó]], khi TypeScript không chắc chắn biến của một kiểu liên hợp thuộc loại nào, chúng ta **chỉ có thể truy cập các thuộc tính hoặc phương thức chung của tất cả các kiểu trong kiểu liên hợp đó**:

```ts
interface Cat {
    name: string;
    run(): void;
}
interface Fish {
    name: string;
    swim(): void;
}

function getName(animal: Cat | Fish) {
    return animal.name;
}
```

Tuy nhiên, đôi khi chúng ta thực sự cần truy cập vào một thuộc tính hoặc phương thức đặc biệt của một trong các kiểu khi kiểu vẫn chưa xác định, ví dụ:

```ts
interface Cat {
    name: string;
    run(): void;
}
interface Fish {
    name: string;
    swim(): void;
}

function isFish(animal: Cat | Fish) {
    if (typeof animal.swim === 'function') {
        return true;
    }
    return false;
}

// index.ts:11:23 - error TS2339: Property 'swim' does not exist on type 'Cat | Fish'.
//   Property 'swim' does not exist on type 'Cat'.
```

Trong ví dụ trên, khi truy cập `animal.swim` sẽ gây ra lỗi.

Trong trường hợp này, chúng ta có thể sử dụng Type Assertion để khẳng định `animal` là `Fish`:

```ts
interface Cat {
    name: string;
    run(): void;
}
interface Fish {
    name: string;
    swim(): void;
}

function isFish(animal: Cat | Fish) {
    if (typeof (animal as Fish).swim === 'function') {
        return true;
    }
    return false;
}
```

Điều này giúp giải quyết vấn đề lỗi khi truy cập `animal.swim`.

Tuy nhiên, Type Assertion chỉ có thể "lừa dối" trình biên dịch TypeScript, không thể tránh được runtime error, thậm chí việc sử dụng Type Assertion sai cũng có thể gây ra runtime error:

```ts
interface Cat {
    name: string;
    run(): void;
}
interface Fish {
    name: string;
    swim(): void;
}

function swim(animal: Cat | Fish) {
    (animal as Fish).swim();
}

const tom: Cat = {
    name: 'Tom',
    run() { console.log('run') }
};
swim(tom);
// Uncaught TypeError: animal.swim is not a function`
```

Ví dụ trên không báo lỗi khi biên dịch, nhưng gặp runtime error:

```text
Uncaught TypeError: animal.swim is not a function`
```

Lý do là `(animal as Fish).swim()` đã ẩn đi trường hợp `animal` có thể là `Cat`, và chúng ta đã khẳng định trực tiếp `animal` là `Fish`, trình biên dịch TypeScript tin tưởng vào khẳng định của chúng ta, vì vậy không có lỗi biên dịch khi gọi `swim()`.

Tuy nhiên, hàm `swim` chấp nhận tham số là `Cat | Fish`, nếu tham số được truyền vào là biến kiểu `Cat`, vì `Cat` không có phương thức `swim`, điều này sẽ gây ra runtime error.

Tóm lại, khi sử dụng Type Assertion, chúng ta phải cẩn thận và tránh sử dụng phương thức hoặc truy cập thuộc tính sâu, để giảm thiểu runtime error không cần thiết.
