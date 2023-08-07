---
title: JS RegExp
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# Đối tượng RegExp

Biểu thức chính quy (Regular Expression) sử dụng một chuỗi duy nhất để mô tả và khớp với một loạt các chuỗi phù hợp với một quy tắc cú pháp. Trong nhiều trình chỉnh sửa văn bản, biểu thức chính quy thường được sử dụng để tìm kiếm và thay thế các chuỗi phù hợp với một mẫu.

Hàm tạo RegExp tạo ra một đối tượng biểu thức chính quy, được sử dụng để khớp văn bản với một mẫu.

## Cú pháp

**Biểu thức chính quy dạng chữ**

- Phần văn bản biểu thức chính quy được **đặt trong cặp dấu gạch chéo `/`**
- Tham số biểu thức chính quy **không sử dụng dấu ngoặc kép**

```js
/pattern/afgls;
```

**Hàm chuyển đổi biểu thức chính quy**

```js
RegExp(pattern [, flags])
```

**Hàm tạo**

- Mẫu chuỗi để khớp (pattern)
- Chuỗi cờ tùy chọn (flags)

```js
new RegExp('at', 'gim');
```

Cả hai tham số của hàm tạo RegExp đều là **chuỗi**. Bất kỳ biểu thức nào được định nghĩa bằng cách sử dụng dạng chữ cũng có thể sử dụng hàm tạo.

```js
// Khớp tất cả các trường hợp của chuỗi 'at'
var regexp1 = /at/g;
// Tương tự như trên
var regexp2 = new RegExp('at', 'g');
```

Biểu thức chính quy trong JavaScript `RegExp` bao gồm hai phần (tham số): `pattern` (phần văn bản) và `flags` (phần mô hình khớp).

### Quy tắc văn bản

Xem chi tiết quy tắc văn bản biểu thức chính quy.

### Mô hình khớp

Mô hình khớp của biểu thức chính quy hỗ trợ 3 cờ sau:

| Cờ   | Mô hình                             | Mô tả                                                             |
| ---- | ----------------------------------- | ---------------------------------------------------------------- |
| `g`  | Mô hình toàn cục (global)            | Có nghĩa là mô hình sẽ được áp dụng cho tất cả các chuỗi, thay vì dừng ngay khi tìm thấy một kết quả khớp đầu tiên |
| `i`  | Mô hình không phân biệt chữ hoa/thường | Có nghĩa là mô hình sẽ bỏ qua sự phân biệt chữ hoa/thường khi xác định kết quả khớp |
| `m`  | Mô hình nhiều dòng (multiline)       | Có nghĩa là mô hình sẽ tiếp tục tìm kiếm các kết quả khớp trong các dòng tiếp theo khi đến cuối một dòng văn bản |

## Mô tả

- Theo quy định của ECMAScript 3, một biểu thức chính quy trực tiếp sẽ được chuyển đổi thành một đối tượng `RegExp` khi nó được thực thi, và mỗi lần thực hiện biểu thức chính quy trong cùng một đoạn mã sẽ trả về cùng một đối tượng. Quy định của ECMAScript 5 lại ngược lại, mỗi lần thực hiện biểu thức chính quy trong cùng một đoạn mã sẽ trả về một đối tượng mới. IE6-8 luôn tuân theo quy định của ECMAScript 5, vì vậy không có vấn đề tương thích.

* Vì **biểu thức chính quy trực tiếp không hỗ trợ biến**, nếu biến xuất hiện trong biểu thức chính quy, chỉ có thể sử dụng hàm tạo `RegExp` kết hợp với việc nối chuỗi để nối biến vào tham số của hàm tạo `RegExp`.

```js
// Ví dụ
let variable = 'low';

let regexp = new RegExp('^Hel' + variable + 'orld$', 'gim');
console.log(regexp); // /^Helloworld$/gim
```

- Từ ECMAScript 6 trở đi, khi tham số đầu tiên là một biểu thức chính quy và tham số cờ thứ hai tồn tại, `new RegExp(/ab+c/, 'i')` không còn ném ra ngoại lệ `TypeError` ("Không hỗ trợ cờ khi tạo từ biểu thức chính quy khác") nữa, thay vào đó, nó sẽ tạo một biểu thức chính quy mới với các tham số này.
- Khi tạo đối tượng biểu thức chính quy bằng cách sử dụng hàm tạo, cần tuân thủ quy tắc thoát ký tự thông thường (thêm dấu gạch chéo \ phía trước). Ví dụ, hai cách sau đây tương đương nhau:

```js
// Ví dụ 1
let regexp = new RegExp('\\w+');

// Ví dụ 2
let regexp = /\w+/;
```

## Đối tượng nguyên mẫu

### Thuộc tính nguyên mẫu

Mỗi đối tượng `RegExp` instance bao gồm 5 thuộc tính sau:

|              Thuộc tính              | Mô tả                                                                                   |
| :----------------------------------: | -------------------------------------------------------------------------------------- |
| `RegExp.prototype.constructor`       | Hàm tạo đối tượng biểu thức chính quy này.                                              |
|   `RegExp.prototype.global`          | Xác định xem mô hình khớp có áp dụng cho tất cả các chuỗi trong văn bản mục tiêu hay không. |
| `RegExp.prototype.ignoreCase`        | Xác định xem trong quá trình khớp chuỗi, có bỏ qua sự phân biệt chữ hoa chữ thường hay không. |
|  `RegExp.prototype.lastIndex`        | Số nguyên, chỉ ra vị trí ký tự của kết quả khớp tiếp theo sau khi bắt đầu tìm kiếm.           |
|  `RegExp.prototype.multiline`        | Xác định xem mô hình khớp có áp dụng cho nhiều dòng trong văn bản hay không (ảnh hưởng đến `^` và `$`). |
|   `RegExp.prototype.source`          | Biểu diễn chuỗi của biểu thức chính quy, trả về dưới dạng biểu diễn chữ, không phải là mẫu chuỗi được truyền vào hàm tạo. |

```js
// Ví dụ
var regexp = new RegExp('\\[bc\\]at', 'i');

// global
console.log(regexp.global); // false

// ignoreCase
console.log(regexp.ignoreCase); // true

// multiline
console.log(regexp.multiline); // false

// lastIndex
console.log(regexp.lastIndex); // 0

// source
console.log(regexp.source); // '\[bc\]at'
```

### Phương thức nguyên mẫu

| Phương thức                                                                 | Mô tả                                                                                   |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| RegExp.prototype.exec() | Thực hiện một tìm kiếm khớp trong một chuỗi đã cho. Trả về một mảng kết quả hoặc `null`. |
| RegExp.prototype.test() | Thực hiện một tìm kiếm để kiểm tra xem biểu thức chính quy có khớp với chuỗi đã cho hay không. Trả về `true` hoặc `false`. |

## Hàm tạo

### Thuộc tính

Các thuộc tính của hàm tạo `RegExp` được coi là thuộc tính tĩnh, các thuộc tính này thay đổi dựa trên hoạt động biểu thức chính quy gần nhất được thực hiện.

Có hai cách để truy cập chúng, đó là **tên thuộc tính dài** và **tên thuộc tính ngắn**. Hầu hết các tên thuộc tính ngắn không phải là các định danh hợp lệ trong ECMAScript, vì vậy chúng phải được truy cập bằng cú pháp dấu ngoặc vuông.

| Tên thuộc tính dài | Tên thuộc tính ngắn | Mô tả                                                                                   |
| ----------------- | ------------------ | -------------------------------------------------------------------------------------- |
| `input`           | `$_`               | Chuỗi cuối cùng cần khớp                                                               |
| `lastMatch`       | `$&`               | Kết quả khớp cuối cùng                                                                 |
| `lastParen`       | `$+`               | Nhóm bắt cuối cùng được khớp                                                           |
| `leftContext`     | `$\``              | Văn bản trước `lastMatch` trong chuỗi `input`                                          |
| `multiline`       | `$*`               | Giá trị boolean, xác định xem tất cả các biểu thức chính quy có sử dụng chế độ đa dòng hay không |
| `rightContext`    | `$'`               | Văn bản sau `lastMatch` trong chuỗi `input`                                             |

Sử dụng các thuộc tính này, bạn có thể trích xuất thông tin cụ thể hơn từ các hoạt động `exec()` hoặc `test()`.

```js
// Hàm test() được sử dụng để kiểm tra xem một chuỗi có khớp với biểu thức chính quy hay không và trả về một giá trị boolean
let text = 'this has been a short summer';
let regexp = /(.)hort/g;

if (regexp.test(text)) {
  console.log(RegExp.input); // 'this has been a short summer'
  console.log(RegExp.leftContext); // 'this has been a '
  console.log(RegExp.rightContext); // ' summer'
  console.log(RegExp.lastMatch); // 'short'
  console.log(RegExp.lastParen); // 's'
  console.log(RegExp.multiline); // false

  console.log(RegExp['$_']); // 'this has been a short summer'
  console.log(RegExp['$`']); // 'this has been a '
  console.log(RegExp["$'"]); // ' summer'
  console.log(RegExp['$&']); // 'short'
  console.log(RegExp['$+']); // 's'
  console.log(RegExp['$*']); // false
}
```

JavaScript có 9 thuộc tính của hàm tạo để lưu trữ các nhóm bắt, khi gọi phương thức `exec()` hoặc `test()`, các thuộc tính này sẽ được tự động điền vào.

Lý thuyết, `RegExp.$0` nên lưu trữ toàn bộ văn bản khớp của biểu thức chính quy, nhưng nó không tồn tại và có giá trị là `undefined`.

```js
// RegExp.$1\RegExp.$2\RegExp.$3... đến RegExp.$9 lưu trữ lần lượt các nhóm bắt khớp thứ nhất, thứ hai... thứ chín
var text = 'this has been a short summer';
var pattern = /(..)or(.)/g;
if (pattern.test(text)) {
  console.log(RegExp.$1); // sh
  console.log(RegExp.$2); // t
}
```
