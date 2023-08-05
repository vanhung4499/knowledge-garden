---
title: JS Export
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Export module

Lệnh `export` được sử dụng để xác định các giao diện công khai của module.

## Cách xuất

ECMAScript đặc tả về module hóa cung cấp hai cách để xuất module:

- Xuất theo tên (Named Exports)
- Xuất mặc định (Default Export)

### Xuất theo tên

Thêm từ khóa `export` trước biến được khai báo để xuất biến tương ứng.

**Xuất giá trị đã khai báo trước:**

Cách viết này giúp hiển thị rõ ràng tất cả các module xuất ở cuối tệp. Đây là cách khuyến nghị.

```js
const originModule = true;

export { originModule };
```

**Đổi tên khi xuất:**

Sử dụng từ khóa `as`, cùng một hàm có thể được xuất với nhiều tên biến khác nhau.

```js
export { originModule as newModule };

export { originModule as smartModule };
```

**Khai báo và xuất cùng lúc:**

```js
export var something = true;
export let anything = true;
export const nothing = true;
export function everything (){}
export class interesting = true;
```

### Xuất mặc định

Xuất mặc định cho phép nhà phát triển nhập module mà không cần biết tên module xuất của nguồn module. (Biến được xuất mặc định không thể được nhập bằng tên)

Xuất một giá trị làm giá trị xuất mặc định của nguồn module:

```js
export default something;
```

⚠️ **Lưu ý**: Chỉ nên sử dụng khi nguồn module chỉ có một giá trị xuất.

Kết hợp xuất mặc định và xuất theo tên trong cùng một module không được khuyến nghị, mặc dù nó là hợp lệ theo quy định.

**Mở rộng:**

Về cơ bản, `export default` chỉ là xuất một biến hoặc phương thức có tên `default`, sau đó hệ thống cho phép bạn đặt tên bất kỳ cho nó.

Vì vậy, cách viết dưới đây là hợp lệ.

Xuất module:

```js
function add(x, y) {
  return x * y;
}

export { add as default };
// Tương đương với
// export default add;
```

Nhập module:

```js
import { default as foo } from 'modules';
// Tương đương với
// import foo from 'modules';
```

Chính vì `export default` thực sự chỉ xuất một biến có tên `default`, nên sau nó không thể là câu lệnh khai báo biến.

# Đặc điểm của module

### Mối quan hệ tương ứng

Cần lưu ý rằng lệnh `export` quy định các giao diện **được xuất ra ngoài**, phải tương ứng một cách một mối với các biến trong module.

```js
// Lỗi
export 1

// Lỗi
const foo = 1
export foo
```

Cả hai cách viết trên đều gây lỗi, vì cả hai đều xuất giá trị `1`, trong khi `1` chỉ là một giá trị và không phải là một giao diện được xuất ra ngoài.

```js
export var foo = 1;

var bar = 1;
export { bar };

var baz = 1;
export { baz as bat };
```

Các tệp script khác có thể sử dụng giao diện này để lấy giá trị `1`. Các giao diện này thiết lập mối quan hệ một một giữa tên giao diện và biến trong module.

Tương tự, các hàm và lớp cũng phải tuân thủ cách viết này.

```js
// Lỗi
function foo(){}
export foo

// Đúng
export function bar(){}

// Đúng
function baz(){}
export { baz }
```

Ngoài ra, các giao diện được xuất bằng lệnh `export` và giá trị tương ứng của chúng có mối quan hệ ràng buộc động, có nghĩa là thông qua giao diện đó, có thể lấy giá trị thời gian thực của biến trong module.

### Xuất ở đầu module

Lệnh `export` có thể xuất hiện ở bất kỳ vị trí nào trong module, miễn là ở đầu module.

Nếu nằm trong phạm vi khối mã, nó sẽ gây lỗi, và lệnh `import` cũng tương tự. Điều này là do nằm trong khối mã điều kiện, không thể thực hiện **tối ưu tĩnh**, vi phạm thiết kế ban đầu của ES6 module.

```js
function foo() {
  export default 'bar';
  // Lỗi cú pháp
}

foo();
```
