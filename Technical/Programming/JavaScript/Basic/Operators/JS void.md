---
title: JS void
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# void

Toán tử `void` cho phép chèn một biểu thức có tác động phụ vào các vị trí mong đợi giá trị của biểu thức là `undefined`.

Toán tử `void` thường chỉ được sử dụng để lấy giá trị nguyên thủy `undefined`, thường được sử dụng là `void(0)` (tương đương với `void 0`). Trong trường hợp trên, cũng có thể sử dụng biến toàn cục `undefined` để thay thế (giả sử nó vẫn là giá trị mặc định).

```js
console.log(void 0);
// undefined

console.log(void 0);
// undefined
```

## Tác dụng

### Thay thế undefined

Vì `undefined` không phải là một từ khóa và nó bị ghi đè trong trình duyệt IE8và cũng bị ghi đè trong phạm vi hàm trong các phiên bản trình duyệt mới hơn; nên có thể sử dụng `void 0` để thay thế `undefined`.

```js
var undefined = 10;
console.log(undefined);
// Trong trình duyệt IE8-, giá trị là 10, trong trình duyệt mới hơn giá trị là undefined

function t() {
  var undefined = 10;
  console.log(undefined);
}
console.log(t());
// Trên tất cả các trình duyệt, giá trị là 10
```

### URL của khách hàng

Toán tử này thường được sử dụng trong URL của khách hàng, nơi mà có thể viết các biểu thức có tác động phụ và `void` cho phép trình duyệt không hiển thị kết quả tính toán của biểu thức đó. Ví dụ, thường xuyên sử dụng toán tử `void` trong thẻ `<a>` trong mã HTML.

```js
<a href="js:void window.open();">Mở một cửa sổ mới</a>
```

### Ngăn chặn sự kiện mặc định

Cách ngăn chặn sự kiện mặc định là đặt giá trị trả về của sự kiện là `false`.

```js
// Cách thông thường
<a href="http://example.com" onclick="f();return false;">Văn bản</a>
// Tương đương với
<a href="js:void(f())">Văn bản</a>
```
