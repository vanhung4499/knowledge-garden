---
title: JS Module Compound
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Cách viết phức hợp của nhập/xuất module

Nếu trong một module, nhập và xuất cùng một module, lệnh `import` và lệnh `export` có thể được viết cùng nhau.

## Xuất toàn bộ module

Nhập toàn bộ module `module`, sau đó xuất toàn bộ module đó.

```js
export * from 'module'
```

## Xuất một phần giao diện của module

Nhập `foo` và `bar` từ module `module`, sau đó xuất hai giao diện đó.

```js
export { foo, bar } from 'module'

// Có thể hiểu là
// import { foo, bar } from 'module'
// export { foo, bar }
```

Thực tế, cách viết này chỉ đơn giản là Xuất hai giao diện này ra bên ngoài, module hiện tại không thể sử dụng trực tiếp hai giao diện này.

## Xuất với đổi tên giao diện

Đổi tên giao diện nhập từ module `module`, nhập giao diện `foo` và xuất với tên `newFoo`.

```js
export { foo as newFoo } from 'module'
```

## Xuất module mặc định

```js
export { default } from 'module'
```

## Xuất module đổi tên thành module có tên

```js
export { foo as default } from './module'

// Tương đương với
// import { foo } from './module'
// export default foo
```

## Xuất module mặc định thành module có tên

```js
export { default as foo } from './module'
```

## Trường hợp không có cách viết phức hợp tương ứng

Ba cách viết dưới đây không có cách viết phức hợp tương ứng:

- Xuất giao diện đổi tên
- Xuất module mặc định
- Xuất cả module toàn bộ và một phần giao diện

```js
// Xuất giao diện đổi tên
import * as foo from './module'

// Xuất module mặc định
import foo from './module'

// Xuất cả module toàn bộ và một phần giao diện
import foo , { namedFoo } from './module'
```

Để đảm bảo tính đối xứng của hình thức, hiện tại đã có đề xuất để bổ sung ba cách viết phức hợp tương ứng.

```js
export * as foo from './module'

export foo from './module'

export foo , { namedFoo } from './module'
```
