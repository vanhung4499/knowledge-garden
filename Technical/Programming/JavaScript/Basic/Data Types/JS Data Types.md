---
title: JS Data Types
date created: 2023-07-04
date modified: 2023-07-22
tags: [js, programming]
categories: [js, programming]
---

JavaScript là một ngôn ngữ **weakly typed** hoặc còn được gọi là ngôn ngữ **động**. Điều này có nghĩa là bạn không cần khai báo kiểu dữ liệu của biến trước, kiểu dữ liệu sẽ được xác định tự động trong quá trình chạy chương trình.

Điều này cũng có nghĩa là bạn có thể sử dụng cùng một tên biến để lưu trữ các kiểu dữ liệu khác nhau:

```js
var foo = 42;
// foo hiện là một số

var foo = 'bar';
// foo hiện là một chuỗi

var foo = true;
// foo hiện là một giá trị boolean
```

💡 Tiêu chuẩn ECMAScript xác định **kiểu dữ liệu nguyên thủy** và **kiểu dữ liệu tham chiếu**, tổng cộng bảy kiểu dữ liệu tích hợp:

- Kiểu dữ liệu nguyên thủy (kiểu cơ bản): truy cập theo giá trị, có thể thao tác với giá trị thực tế được lưu trữ trong biến.
    - **null** (giá trị rỗng)
    - **undefined** (giá trị chưa xác định)
    - **boolean** (giá trị logic)
    - **number** (số)
    - **string** (chuỗi)
    - **symbol** (ký hiệu)
- Kiểu dữ liệu tham chiếu (kiểu phức tạp): giá trị của kiểu tham chiếu được lưu trữ trong bộ nhớ.
    - **object** (đối tượng)
        - **Boolean** (kiểu Boolean)
        - **Number** (kiểu Number)
        - **String** (kiểu String)
        - **Function** (kiểu Function)
        - **Array** (kiểu Array)
        - **Date** (kiểu Date)
        - **RegExp** (kiểu RegExp)
        - **Error** (kiểu Error)

⚠️ **Lưu ý**: Khác với các ngôn ngữ khác, JavaScript không cho phép truy cập trực tiếp vào vị trí bộ nhớ, tức là không thể trực tiếp thao tác với không gian bộ nhớ của đối tượng. Khi thao tác với đối tượng, thực tế là bạn đang thao tác với tham chiếu của đối tượng chứ không phải đối tượng thực tế. Do đó, giá trị kiểu tham chiếu được truy cập theo tham chiếu.

## Kiểu dữ liệu nguyên thủy

### Giá trị null

Giá trị null là một từ vựng, không giống như undefined, nó không phải là một thuộc tính của đối tượng toàn cục.

null là một biểu thị cho sự thiếu vắng, chỉ ra rằng biến không trỏ đến bất kỳ đối tượng hoặc giá trị nào. Nó có thể được coi là một đối tượng chưa được tạo.

🌰 **Ví dụ mã**:

`foo` không tồn tại, nó chưa được định nghĩa hoặc khởi tạo.

```js
foo;
> "ReferenceError: foo is not defined"
```

`foo` hiện đã tồn tại, nhưng nó không có kiểu hoặc giá trị.

```js
var foo = null;
foo;
> null
```

### Giá trị undefined

Giá trị undefined là một thuộc tính của đối tượng toàn cục. Nó là một biến trong phạm vi toàn cầu. Giá trị undefined ban đầu là kiểu dữ liệu nguyên thủy undefined.

```js
var foo;

console.log(foo);
// undefined
```

### Giá trị boolean

Kiểu boolean đại diện cho một thực thể logic, có thể có hai giá trị: true và false.

### Số (Number)

#### Hệ cơ số (base)

- Hệ thập phân: Hệ số mặc định trong JavaScript.
- Hệ bát phân: Chữ số đầu tiên phải là 0, sau đó là các chữ số từ 0 đến 7.
- Hệ thập lục phân: Hai chữ số đầu tiên phải là `0x`, sau đó là các chữ số từ 0 đến 9 và A-F (không phân biệt chữ hoa chữ thường).

```js
// Hệ thập phân
var num1 = 10;

// Hệ bát phân 56
var num2 = 070;

// Hệ thập phân, vì có số vượt quá 7, nên đây là 79
var num3 = 079;

// Hệ thập lục phân 31
var num4 = 0x1f;
```

⚠️ **Lưu ý**: Hệ bát phân không có hiệu lực trong chế độ nghiêm ngặt `"use strict"`, nó sẽ gây ra lỗi trong JavaScript, hãy tránh sử dụng nó.

#### Số dấu chấm động (floating point number)

```js
var num = 0.1 + 0.2;
var sum = '2.3' * 100;

console.log(num);
// 0.30000000000000004

console.log(sum);
// 229.99999999999997
```

Ví dụ trên thể hiện rằng số dấu chấm động trong JavaScript dễ mất mát độ chính xác trong quá trình tính toán. Điều này không chỉ tồn tại trong JavaScript, chúng ta nên sử dụng các lớp xử lý số học chuyên dụng để xử lý vấn đề này, ví dụ như lớp BigDecimal trong Java.

#### Phạm vi số

Phạm vi của số trong JavaScript là số lượng chữ số có hiệu lực, nó đủ để sử dụng và chúng ta chỉ cần biết một số điểm sau đây:

- `Number.MIN_VALUE` hoặc `Number.NEGATIVE_INFINITY`: Đại diện cho giá trị nhỏ nhất trong JavaScript.
- `Number.MAX_VALUE` hoặc `Number.POSITIVE_INFINITY`: Đại diện cho giá trị lớn nhất trong JavaScript.
- `Infinity`: Đại diện cho vô cùng dương.
- `-Infinity`: Đại diện cho vô cùng âm.

### Chuỗi (String)

Kiểu dữ liệu chuỗi trong JavaScript được sử dụng để biểu diễn dữ liệu văn bản. Nó là một tập hợp các phần tử số nguyên không dấu 16 bit. Mỗi phần tử trong chuỗi chiếm một vị trí trong chuỗi. Chỉ số của phần tử đầu tiên là 0, phần tử tiếp theo là chỉ số 1, và cứ tiếp tục như vậy. Độ dài của chuỗi là số lượng phần tử trong chuỗi.

```js
'foo';
'bar';
'1234';
'one line \n another line';
"John's cat";
```

### Ký hiệu (Symbol)

Ký hiệu (Symbol) là một loại dữ liệu được định nghĩa trong phiên bản 6 của ECMAScript. Đặc điểm của kiểu dữ liệu này là giá trị của nó có thể được sử dụng để tạo ra thuộc tính vô danh của đối tượng. Kiểu dữ liệu này thường được sử dụng làm giá trị khóa cho thuộc tính của đối tượng được sử dụng bên trong lớp hoặc đối tượng.

```js
var myPrivateMethod = Symbol();

this[myPrivateMethod] = function () {
  // ...
};
```

## Kiểu dữ liệu tham chiếu

Kiểu tham chiếu thường được gọi là lớp (Class), có nghĩa là khi gặp giá trị tham chiếu, chúng ta đang xử lý với đối tượng.

Trong tiêu chuẩn ECMA-262, không có khái niệm **lớp** mà thay vào đó định nghĩa **định nghĩa đối tượng**, tương đương với khái niệm lớp trong các ngôn ngữ lập trình khác.

Đối tượng được tạo bằng cách sử dụng toán tử `new` kết hợp với tên đối tượng cần khởi tạo.

Ví dụ, đoạn mã sau tạo một thể hiện của đối tượng Object:

```js
var o = new Object();
```

Cú pháp này tương tự với ngôn ngữ Java, nhưng khi có nhiều hơn một tham số, ECMAScript yêu cầu sử dụng dấu ngoặc đơn.

Nếu không có tham số, như ví dụ dưới đây, dấu ngoặc có thể được bỏ qua:

```js
var o = new Object();
```

Mặc dù dấu ngoặc không bắt buộc, nhưng để tránh nhầm lẫn, nên sử dụng dấu ngoặc.

---

**Tài liệu tham khảo**:

- [📖 Symbol Glossary](https://developer.mozilla.org/docs/Glossary/Symbol)
- [📖 Global Objects](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects)
