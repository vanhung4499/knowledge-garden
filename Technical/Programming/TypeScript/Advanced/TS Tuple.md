---
title: TS Tuple
tags:
  - ts
categories:
  - ts
date created: 2024-03-15
date modified: 2024-03-15
---

# Tuple

Mảng kết hợp các đối tượng cùng loại, trong khi tuple (Tuple) kết hợp các đối tượng loại khác nhau.

Tuple bắt nguồn từ các ngôn ngữ lập trình hàm (như F#), nơi mà tuple được sử dụng thường xuyên.

## Ví dụ đơn giản

Định nghĩa một cặp giá trị lần lượt là `string` và `number`:

```ts
let tom: [string, number] = ['Tom', 25];
```

Khi gán hoặc truy cập một phần tử có chỉ mục đã biết, bạn sẽ nhận được kiểu chính xác:

```ts
let tom: [string, number];
tom[0] = 'Tom';
tom[1] = 25;

tom[0].slice(1);
tom[1].toFixed(2);
```

Bạn cũng có thể chỉ gán một mục:

```ts
let tom: [string, number];
tom[0] = 'Tom';
```

Nhưng khi khởi tạo hoặc gán trực tiếp cho một biến kiểu tuple, bạn cần cung cấp tất cả các mục được chỉ định trong kiểu tuple.

```ts
let tom: [string, number];
tom = ['Tom', 25];
```

```ts
let tom: [string, number];
tom = ['Tom'];

// Property '1' is missing in type '[string]' but required in type '[string, number]'.
```

## Phần tử vượt giới hạn

Khi thêm một phần tử vượt giới hạn, kiểu của nó sẽ bị hạn chế thành kiểu liên hiệp của mỗi kiểu trong tuple:

```ts
let tom: [string, number];
tom = ['Tom', 25];
tom.push('male');
tom.push(true);

// Argument of type 'true' is not assignable to parameter of type 'string | number'.
```
