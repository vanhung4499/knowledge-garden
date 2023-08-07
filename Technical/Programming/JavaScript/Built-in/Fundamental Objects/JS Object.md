---
title: JS Object
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# Object

Đối tượng `Object` trong JavaScript là lớp cơ sở cho tất cả các đối tượng trong JavaScript. Điều này có nghĩa là tất cả các đối tượng trong JavaScript đều được tạo ra từ đối tượng Object. Đối tượng Object chủ yếu được sử dụng để đóng gói dữ liệu bất kỳ thành dạng đối tượng.

Một đối tượng cũng có thể được coi là một tập hợp không có thứ tự của các thuộc tính, mỗi thuộc tính là một cặp tên-giá trị. **Tên thuộc tính là một chuỗi, vì vậy chúng ta có thể coi đối tượng là một ánh xạ từ chuỗi đến giá trị**.

## Cú pháp

**Hàm tạo**

```js
new Object([value]);
```

**Hàm chuyển đổi kiểu đối tượng**

```js
Object([value]);
```

| Tham số | Mô tả                                | Kiểu dữ liệu |
| :------ | :----------------------------------- | :---------- |
| value   | Giá trị cần đóng gói thành đối tượng | bất kỳ       |

`Object()` sẽ trả về một đối tượng có kiểu tương ứng với kiểu dữ liệu của tham số `value`:

- Nếu `value` là kiểu dữ liệu nguyên thủy Boolean, Number, String, thì sẽ trả về đối tượng tương ứng, ví dụ: đối tượng Boolean, đối tượng Number, đối tượng String.
- Nếu `value` đã là một đối tượng, thì không thay đổi gì và trả về đối tượng đó.
- Nếu bỏ qua tham số `value`, hoặc `value` là `null`, `undefined`, thì sẽ trả về đối tượng Object không có thuộc tính nào.

`Object()` trả về một đối tượng có kiểu tương ứng với giá trị đã cho. Đối tượng này bao gồm giá trị đã cho.

## Hàm tạo

### Thuộc tính

- `Object.length`: Giá trị là 1
- `Object.prototype`: Đại diện cho đối tượng nguyên mẫu của `Object`

### Phương thức

- [Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is): So sánh hai giá trị xem chúng có giống nhau không
- [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign): Tạo một đối tượng mới bằng cách sao chép một hoặc nhiều thuộc tính có thể liệt kê từ các đối tượng khác nhau
- [Object.create](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create): Tạo một đối tượng mới với đối tượng nguyên mẫu và thuộc tính đã cho
- [Object.keys](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys): Lấy một mảng chứa tên các thuộc tính có thể liệt kê của đối tượng đã cho
- [Object.values](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values): Trả về một mảng chứa tất cả các giá trị thuộc tính có thể liệt kê của đối tượng đã cho
- [Object.entries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries): Lấy một mảng hai chiều chứa các cặp khóa-giá trị của các thuộc tính có thể liệt kê của đối tượng đã cho
- [Object.defineProperties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties): Định nghĩa nhiều thuộc tính cho đối tượng đã cho và chỉ định các mô tả thuộc tính cho chúng
- [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty): Định nghĩa một thuộc tính cho đối tượng đã cho và chỉ định mô tả thuộc tính cho nó
- [Object.getOwnPropertyNames](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames): Lấy một mảng chứa tên các thuộc tính riêng của đối tượng đã cho (bao gồm các thuộc tính không thể liệt kê nhưng không bao gồm các thuộc tính có tên là Symbol)
- [Object.getOwnPropertySymbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols): Lấy một mảng chứa tất cả các thuộc tính riêng có tên là Symbol của đối tượng đã cho
- [Object.getOwnPropertyDescriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor): Lấy mô tả thuộc tính của một thuộc tính riêng của đối tượng đã cho
- [Object.getOwnPropertyDescriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors): Lấy các mô tả thuộc tính của đối tượng đã cho
- [Object.isExtensible](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible): Kiểm tra xem đối tượng đã cho có thể mở rộng được hay không
- [Object.isFrozen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen): Kiểm tra xem đối tượng đã cho có bị đóng băng hay không
- [Object.isSealed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed): Kiểm tra xem đối tượng đã cho có bị niêm phong hay không
- [Object.preventExtensions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions): Đánh dấu đối tượng đã cho là không thể mở rộng
- [Object.freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze): Đánh dấu đối tượng đã cho là bị đóng băng
- [Object.seal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal): Đánh dấu đối tượng đã cho là bị niêm phong
- [Object.getPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf): Lấy đối tượng nguyên mẫu của đối tượng đã cho
- [Object.setPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf): Đặt đối tượng nguyên mẫu cho đối tượng đã cho

## Đối tượng nguyên mẫu

Tất cả các đối tượng trong JavaScript đều được tạo ra từ `Object` và kế thừa các phương thức và thuộc tính từ `Object.prototype`, mặc dù chúng có thể bị ghi đè.

### Thuộc tính

- `Object.prototype.constructor`: Trả về tham chiếu tới hàm tạo Object để tạo ra đối tượng. Lưu ý, giá trị của thuộc tính này là một tham chiếu đến chính hàm, không phải là một chuỗi chứa tên hàm. Giá trị này là một kiểu nguyên thủy chỉ đọc, như `1`, `true`, `'test'`.
- `Object.prototype.__proto__`: Trỏ đến đối tượng được sử dụng làm nguyên mẫu khi đối tượng được khởi tạo.
- `Object.prototype.__noSuchMethod__`: Cho phép định nghĩa và thực thi một hàm khi một thành viên của đối tượng không được xác định được gọi như một phương thức.

### Phương thức

- [Object.prototype.hasOwnProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty): Kiểm tra xem một đối tượng có chứa một thuộc tính cụ thể trong chính nó (không được kế thừa từ nguyên mẫu) hay không.
- [Object.prototype.isPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf): Kiểm tra xem một đối tượng có tồn tại trong chuỗi nguyên mẫu của một đối tượng khác hay không.
- [Object.prototype.propertyIsEnumerable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable): Kiểm tra xem một thuộc tính của một đối tượng có thể liệt kê được hay không.
- [Object.prototype.toLocaleString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString): Được sử dụng bởi các đối tượng con để ghi đè và sử dụng cho mục đích đặc thù của một môi trường ngôn ngữ cụ thể.
- [Object.prototype.toString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString): Trả về một chuỗi biểu diễn đối tượng.
- [Object.prototype.valueOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf): Trả về giá trị nguyên thủy của đối tượng đã cho.

## Ví dụ

Nếu tham số là **kiểu dữ liệu nguyên thủy**, thì trả về đối tượng tương ứng.

```js
const a = new Object(true);
console.log(a);
// Boolean {true}

var b = new Object(8);
console.log(b);
// Number {8}

var c = new Object('string');
console.log(c);
// String {"string"}
```

Nếu tham số đã là một **đối tượng** (`typeof` của tham số trả về `object` hoặc `function`), thì không có thay đổi nào và trả về đối tượng đó.

```js
var a = new Object(Boolean());
console.log(a);
// Boolean{false}

var b = new Object(Number());
console.log(b);
// Number{0}

var c = new Object(String());
console.log(c);
// String{"", length: 0}
```

Nếu **không chỉ định tham số**, hoặc tham số là `null` hoặc `undefined`, thì trả về một đối tượng trống.

```js
var a = new Object();
console.log(a);
// {}

var b = new Object(undefined);
console.log(b);
// {}

var c = new Object(null);
console.log(c);
// {}
```
