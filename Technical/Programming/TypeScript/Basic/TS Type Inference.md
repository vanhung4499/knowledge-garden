---
title: TS Type Inference
tags:
  - ts
categories: ts
date created: 2023-12-28
date modified: 2023-12-28
---

# Rút trích kiểu dữ liệu

Nếu không chỉ định rõ kiểu dữ liệu, TypeScript sẽ dựa vào quy tắc rút trích kiểu dữ liệu (Type Inference) để suy ra một kiểu dữ liệu.

## Khái niệm về rút trích kiểu dữ liệu

Mã sau mặc dù không chỉ định kiểu dữ liệu, nhưng sẽ báo lỗi trong quá trình biên dịch:

```ts
let myFavoriteNumber = 'seven';
myFavoriteNumber = 7;

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

Thực tế, nó tương đương với:

```ts
let myFavoriteNumber: string = 'seven';
myFavoriteNumber = 7;

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

TypeScript sẽ suy ra một kiểu dữ liệu khi không có chỉ định rõ kiểu, đó chính là rút trích kiểu dữ liệu.

**Nếu không gán giá trị khi khai báo, bất kể sau đó có gán giá trị hay không, TypeScript sẽ suy ra kiểu dữ liệu là `any` và không thực hiện kiểm tra kiểu dữ liệu**:

```ts
let myFavoriteNumber;
myFavoriteNumber = 'seven';
myFavoriteNumber = 7;
```
