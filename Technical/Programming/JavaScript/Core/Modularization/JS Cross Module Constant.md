---
title: JS Cross Module Constant
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Hằng số chuyển qua các module

Vì biến được khai báo bằng `const` chỉ có hiệu lực trong khối mã hiện tại, nếu muốn đặt hằng số chuyển qua các module (tức là chuyển qua nhiều tệp), hoặc một giá trị được chia sẻ bởi nhiều module, bạn có thể sử dụng cú pháp sau.

```js
// constants.js - Khai báo và xuất theo tên
export const a = 1
export const b = 2
export const c = 3

// module1.js - Nhập theo không gian tên
import * as constants from './constants.js'
console.log(constants.a)
// 1
console.log(constants.b)
// 2

// module2.js - Nhập theo tên
import { a, b } from './constants.js'
console.log(a)
// 1
console.log(b)
// 2
```

Nếu có rất nhiều hằng số cần sử dụng, bạn có thể tạo một thư mục `constants` riêng và viết các hằng số khác nhau trong các tệp khác nhau, lưu trong thư mục đó.

```js
// constants/a.js
export const a = {
  a1: 'a1',
  a2: 'a2',
  a3: 'a3'
}

// constants/b.js
export const b = ['b1', 'b2', 'b3', 'b5', 'b6', 'b7']
```

Sau đó, xuất các hằng số từ các tệp này và kết hợp chúng trong tệp `index.js`.

```js
// constants/index.js
export { a } from './a'
export { b } from './b'
```

Khi sử dụng, chỉ cần tải `index.js`.

```js
// module.js
import { a, b } from './constants'
```
