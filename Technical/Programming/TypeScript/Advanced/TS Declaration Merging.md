---
title: TS Declaration Merging
tags:
  - ts
categories:
  - ts
date created: 2024-03-15
date modified: 2024-03-15
---

# Kết hợp khai báo

Nếu bạn định nghĩa hai hàm, giao diện hoặc lớp có cùng tên, chúng sẽ được kết hợp thành một kiểu:

## Kết hợp hàm

[[TS Type Of Function#Overload (Nạp chồng)|Chúng ta đã học trước đó]], chúng ta có thể sử dụng quá tải để định nghĩa nhiều kiểu hàm:

```ts
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

## Kết hợp giao diện

Các thuộc tính trong giao diện sẽ được kết hợp đơn giản vào một giao diện khi kết hợp:

```ts
interface Alarm {
    price: number;
}
interface Alarm {
    weight: number;
}
```

Tương đương với:

```ts
interface Alarm {
    price: number;
    weight: number;
}
```

Lưu ý, **kiểu của các thuộc tính được kết hợp phải là duy nhất**:

```ts
interface Alarm {
    price: number;
}
interface Alarm {
    price: number;  // Mặc dù bị lặp lại, nhưng kiểu là `number`, vì vậy không báo lỗi
    weight: number;
}
```

```ts
interface Alarm {
    price: number;
}
interface Alarm {
    price: string;  // Kiểu không giống nhau, sẽ báo lỗi
    weight: number;
}

// index.ts(5,3): error TS2403: Subsequent variable declarations must have the same type.  Variable 'price' must be of type 'number', but here has type 'string'.
```

Kết hợp phương thức trong giao diện, giống như việc kết hợp hàm:

```ts
interface Alarm {
    price: number;
    alert(s: string): string;
}
interface Alarm {
    weight: number;
    alert(s: string, n: number): string;
}
```

Tương đương với:

```ts
interface Alarm {
    price: number;
    weight: number;
    alert(s: string): string;
    alert(s: string, n: number): string;
}
```

## Kết hợp lớp

Quy tắc kết hợp lớp giống với quy tắc kết hợp giao diện.
