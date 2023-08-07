---
title: JS WeakMap
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# WeakMap

Đối tượng WeakMap là một tập hợp các cặp khóa/giá trị, trong đó khóa là một **tham chiếu yếu**. Khóa phải là một **đối tượng**, trong khi giá trị có thể là bất kỳ giá trị nào.

## Cú pháp

```js
new WeakMap([iterable]);
```

Tham số `iterable` là một mảng hoặc một đối tượng có thể duyệt và chứa các cặp khóa/giá trị. Mỗi cặp khóa/giá trị sẽ được thêm vào WeakMap mới. Giá trị `null` sẽ được coi là `undefined`.

## Đặc điểm

### Khóa là đối tượng

```js
const map = new WeakMap();

map.set(1, 2);
// TypeError: Invalid value used as weak map key

map.set(null, 2);
// TypeError: Invalid value used as weak map key
```

### Tham chiếu yếu đến đối tượng

> WeakMaps hold "weak" references to key objects

Đoạn trích trên có nghĩa là **WeakMap giữ các tham chiếu yếu đến các đối tượng khóa**.

WeakMap là một tính năng tham chiếu yếu, nghĩa là WeakMap giữ một tham chiếu yếu đến đối tượng được tham chiếu bởi khóa. Điều này có nghĩa rằng [[JS Garbage Collection|cơ chế thu gom rác]] không xem xét tham chiếu này. Khi tất cả các tham chiếu khác của đối tượng được giữ đã bị xoá, cơ chế thu gom rác sẽ giải phóng bộ nhớ đã dùng cho đối tượng đó. Nói cách khác, khi không còn cần thiết, các khóa và các cặp key-value trong WeakMap sẽ tự động biến mất mà không cần phải xoá tham chiếu bằng tay.

Chính vì đặc điểm này, số lượng thành viên trong WeakMap phụ thuộc vào việc cơ chế thu gom rác có chạy hay không. Trước và sau khi cơ chế thu gom rác chạy, số lượng thành viên có thể khác nhau, và không thể dự đoán được khi nào cơ chế thu gom rác sẽ chạy, do đó ES6 quy định WeakMap không thể được duyệt qua.

Vì vậy, WeakMap không giống như Map, không có các phương thức duyệt qua (tức là không có các phương thức `keys()`, `values()` và `entries()`), cũng không có thuộc tính `size`, và không hỗ trợ phương thức `clear`, vì vậy chỉ có bốn phương thức có sẵn trong WeakMap: `get()`, `set()`, `has()` và `delete()`.

## Phương thức của đối tượng WeakMap

| Phương thức                            | Mô tả                                                                                                                      |
| :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------ |
| `WeakMap.prototype.delete(key)`        | Xóa đối tượng liên quan đến `key`                                                                                          |
| `WeakMap.prototype.get(key)`           | Trả về đối tượng liên quan đến `key` hoặc `undefined`                                                                      |
| `WeakMap.prototype.has(key)`           | Kiểm tra xem có đối tượng liên quan đến `key` hay không                                                                     |
| `WeakMap.prototype.set(key, value)`    | Thiết lập một cặp khóa/giá trị mới trong WeakMap                                                                           |

## Ví dụ sử dụng

```js
const x = new WeakMap();
const y = new WeakMap();

const a = {};
const b = function () {};
const c = window;

x.set(a, 100);
x.set(b, 'BINGO!');

y.set(a, b);
y.set(c, undefined);
y.set(x, y);

x.get(b);
// 'BINGO!'

y.get(b);
// undefined
y.get(c);
// undefined

x.has(b);
// true

y.has(b);
// false
y.has(c);
// true

// delete()
x.has(a);
// true
x.delete(a);
x.has(a);
// false
```
