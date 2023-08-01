---
title: JS String Operator
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Toán tử chuỗi

Toán tử chuỗi (được biểu diễn bằng dấu cộng `+`) được sử dụng để nối hai giá trị chuỗi lại với nhau. Các toán hạng được đặt ở hai bên của toán tử và kết quả trả về là một chuỗi mới, là sự kết hợp của hai chuỗi đó.

```js
var foo = 'Hello' + ' ' + 'world!';

console.log(foo);
// 'Hello world!'
```

Toán tử viết tắt (`+=`) cũng có thể được sử dụng để nối chuỗi, ví dụ:

```js
var foo = 'Hello';

foo += ' thế giới!';
// Tương đương với foo = foo + ' world!'

console.log(foo);
// "Hello world!"
```
