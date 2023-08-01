---
title: JS Logical Operators
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Toán tử logic

Toán tử logic thường được sử dụng để thực hiện các phép toán logic trên các toán hạng và thường được kết hợp với các toán tử quan hệ. Toán tử logic kết hợp nhiều biểu thức quan hệ thành một biểu thức phức tạp hơn. Có ba loại toán tử logic là toán tử logic và `&&`, toán tử logic hoặc `||` và toán tử logic phủ định `!`.

## Toán tử logic AND

**Toán tử logic AND** được biểu diễn bằng hai dấu và `&&`, có hai toán hạng. Chỉ khi cả hai toán hạng đều là `true`, kết quả mới trả về `true` , ngược lại trả về `false`.

**Bảng chân trị của toán tử logic và**

| Toán hạng thứ nhất | Toán hạng thứ hai | Kết quả |
| :----------- | :----------- | :------ |
| `true`       | `true`       | `true`  |
| `true`       | `false`      | `false` |
| `false`      | `true`       | `false` |
| `false`      | `false`      | `false` |

Toán tử logic và có thể được áp dụng cho bất kỳ kiểu dữ liệu nào, không chỉ giới hạn ở giá trị boolean.

⚠️ **Lưu ý**: Toán tử logic và là một **toán tử ngắn mạch**, nghĩa là nếu toán hạng đầu tiên có thể xác định kết quả, thì không cần tính toán toán hạng thứ hai.

Đối với toán tử logic và:

- Nếu toán hạng đầu tiên là `false`, thì bất kể giá trị của toán hạng thứ hai là gì, kết quả đều là `false`, và trả về giá trị của toán hạng đầu tiên.
- Nếu toán hạng đầu tiên là `true`, thì kết quả sẽ có cùng giá trị logic với toán hạng thứ hai, và trả về giá trị của toán hạng thứ hai.

Trong thế giới JavaScript:

Ngoại trừ `false`、`undefined`、`null`、`+0`、`-0`、`NaN`、`''` ，tất cả các giá trị khác đều là giá trị đúng.

Ví dụ:

```js
var a = true && true;
// true

var b = true && false;
// false

var c = false && true;
//false

var d = false && 3 == 4;
// false

var e = 'Cat' && 'Dog';
// 'Dog'

var f = false && 'Cat';
// false

var g = 'Cat' && false;
// false
```

Toán tử logic và có thể được sử dụng liên tiếp nhiều lần, trả về giá trị của biểu thức đầu tiên có giá trị boolean là `false`.

```js
console.log(true && 'foo' && '' && 4 && 'foo' && true);
// ''
```

**Có thể sử dụng toán tử logic và thay thế cho cấu trúc `if-else`**

```js
if (a == b) {
  doSomething();
}

// Tương đương với
a == b && doSomething();
```

Hoặc:

```js
// Kiểm tra xem đối tượng có tồn tại trước khi lấy giá trị
const foo = a && a.b;
```

Toán tử logic và thường được sử dụng trong việc xử lý hàm gọi lại (callback).

Nếu không truyền giá trị cho tham số `a` thì `a` sẽ là giá trị mặc định `undefined`, là giá trị sai, vì vậy không thực hiện `a()` để tránh lỗi, nếu truyền giá trị cho tham số `a` thì thực hiện hàm `a()`.

```js
function fn(a) {
  if (a) {
    a();
  }
}
// Tương đương với
function fn(a) {
  a && a();
}
```

# Toán tử logic OR

**Toán tử logic OR** được biểu diễn bằng hai dấu gạch chéo ngang `||`, có hai toán hạng. Chỉ khi cả hai toán hạng đều là `false`, kết quả mới trả về `false`, ngược lại trả về `true`.

**Bảng chân trị của toán tử logic hoặc**

| Toán hạng thứ nhất | Toán hạng thứ hai | Kết quả |
| :----------- | :----------- | :------ |
| `true`       | `true`       | `true`  |
| `true`       | `false`      | `true` |
| `false`      | `true`       | `true` |
| `false`      | `false`      | `false` |

Tương tự như toán tử logic và, toán tử logic hoặc cũng có thể áp dụng cho bất kỳ kiểu dữ liệu nào, không chỉ giới hạn ở giá trị boolean. Nếu một trong hai toán hạng không phải là giá trị boolean, thì toán tử logic hoặc không nhất thiết trả về giá trị boolean.

Toán tử logic hoặc cũng là một toán tử ngắn mạch, nghĩa là nếu toán hạng đầu tiên có thể xác định kết quả, thì không cần tính toán toán hạng thứ hai.

Đối với toán tử logic hoặc, nếu toán hạng đầu tiên là `true`, thì bất kể giá trị của toán hạng thứ hai là gì, kết quả đều là `true`, và trả về giá trị của toán hạng đầu tiên; nếu toán hạng đầu tiên là `false`, thì kết quả sẽ có cùng giá trị logic với toán hạng thứ hai, và trả về giá trị của toán hạng thứ hai.

```js
var a = true || true;
// true

var b = false || true;
// true

var c = true || false;
// true

var d = false || 3 == 4;
// false

var e = 'Cat' || 'Dog';
// Cat

var f = false || 'Cat';
// Cat

var g = 'Cat' || false;
// Cat
```

Toán tử logic hoặc cũng có thể được sử dụng liên tiếp nhiều lần, trả về giá trị của biểu thức đầu tiên có giá trị boolean là `true`.

```js
console.log(false || 0 || '' || 4 || 'foo' || true); // 4
```

Toán tử logic hoặc thường được sử dụng để đặt giá trị mặc định cho biến.

```js
// Nếu không có đối tượng được truyền vào tham số p, thì thiết lập tham số đó là một đối tượng rỗng
function fn(p) {
  p = p || {};
}
```

# Toán tử logic NOT

**Toán tử logic NOT** được biểu diễn bằng dấu chấm than `!` và có thể áp dụng cho bất kỳ giá trị nào trong ECMAScript. Dù giá trị đó thuộc loại dữ liệu nào, toán tử này sẽ trả về một giá trị boolean. Toán tử logic phủ định đầu tiên sẽ chuyển đổi toán hạng của nó thành giá trị boolean, sau đó đảo ngược giá trị đó.

```js
console.log(!null);
// true

console.log(!undefined);
// true

console.log(!0);
// true

console.log(!NaN);
// true

console.log(!'');
// true

console.log(!'123');
// false

console.log(!Infinity);
// false

console.log(!{ a: 1 });
// false
```

Toán tử logic phủ định chuyển đổi toán hạng thành giá trị boolean theo cùng quy tắc chuyển đổi của hàm ép kiểu `Boolean()`, chỉ khác là kết quả cuối cùng được đảo ngược. Nếu sử dụng hai toán tử logic phủ định liên tiếp, thực tế là mô phỏng hành vi của hàm ép kiểu `Boolean()`.

```js
console.log(!!undefined);
// false

console.log(!!null);
// false

console.log(!!0);
// false

console.log(!!-0);
// false

console.log(!!NaN);
// false

console.log(!!'');
// false

console.log(!!false);
// false
```

```js
console.log(!!{});
// true

console.log(!![]);
// true

console.log(!!new Boolean(false));
// true

console.log(!!false);
// false

console.log(!!new Boolean(null));
// true

console.log(!!null);
// false
```
