---
title: JS Lexical Grammar
date created: 2023-07-04
date modified: 2023-07-31
tags: [js, programming]
categories: [js, programming]
---

ECMAScript mã nguồn được quét từ trái sang phải và được chuyển đổi thành một chuỗi các phần tử đầu vào, bao gồm các từ khóa, các ký tự điều khiển, ký tự kết thúc dòng, chú thích và khoảng trắng.

Tương tự, ECMAScript cũng định nghĩa một số từ khóa, các giá trị chữ và quy tắc tự động thêm dấu chấm phẩy vào cuối dòng.

## Bộ ký tự

Chương trình JavaScript được viết bằng bộ ký tự Unicode. Unicode là siêu tập hợp của ASCII và Latin-1 và hỗ trợ hầu hết các ngôn ngữ đang được sử dụng trên Trái đất. ECMAScript 3 yêu cầu các phiên bản JavaScript phải hỗ trợ Unicode 2.1 và các phiên bản sau, trong khi ECMAScript 5 yêu cầu hỗ trợ Unicode 3 và các phiên bản sau.

### Phân biệt chữ hoa chữ thường

JavaScript là một ngôn ngữ phân biệt chữ hoa chữ thường, có nghĩa là từ khóa, biến, tên hàm và tất cả các định danh (Identifier) phải được viết theo cùng một kiểu chữ hoa chữ thường. Tuy nhiên, cần lưu ý rằng HTML và CSS không phân biệt chữ hoa chữ thường (mặc dù XHTML phân biệt chữ hoa chữ thường), điều đó có nghĩa là khi chúng ta điều khiển thuộc tính HTML bằng JavaScript, `id` và `ID` không khác nhau đối với HTML, nhưng lại khác nhau đối với JavaScript.

🌰 Ví dụ mã:

`abc`, `Abc`, `aBc`, `abC`, `ABC` là năm biến khác nhau.

```js
var abc = 1;
var Abc = 2;
var aBc = 3;
var abC = 4;
var ABC = 5;
console.log(abc, Abc, aBc, abC, ABC); // 1 2 3 4 5
```

### Khoảng trắng, ký tự xuống dòng và ký tự điều khiển định dạng

JavaScript sẽ bỏ qua khoảng trắng giữa các **định danh** (Token) trong chương trình. Trong hầu hết các trường hợp, JavaScript cũng sẽ bỏ qua ký tự xuống dòng. Vì có thể sử dụng khoảng trắng và xuống dòng trong mã, chúng ta có thể sử dụng cách thụt lề gọn gàng và nhất quán để tạo ra một phong cách mã thống nhất, từ đó cải thiện khả năng đọc của mã.

#### Ký tự trắng

Ký tự trắng WhiteSpace

```js
\u0009 Tab ngang <TAB>
\u000B Tab dọc <VT>
\u000C Trang mới <FF>
\u0020 Khoảng trắng <SP>
\u00A0 Khoảng trắng không ngắt <NBSP>
\uFEFF Ký tự đánh dấu thứ tự
```

#### Ký tự kết thúc dòng

Ký tự kết thúc dòng LineTerminator

```js
\u000A Xuống dòng <LF>
\u000D Dấu xuống dòng <CR>
\u2028 Dấu phân cách dòng <LS>
\u2029 Dấu phân đoạn đoạn <PS>
```

⚠️ Lưu ý: Dấu xuống dòng kết hợp với dấu xuống dòng sẽ được chuyển đổi thành một dấu kết thúc dòng duy nhất.

### Chuỗi thoát Unicode

Trong một số phần cứng và phần mềm máy tính, không thể hiển thị hoặc nhập toàn bộ bộ ký tự Unicode. Để tương thích, JavaScript định nghĩa một chuỗi đặc biệt, sử dụng 6 ký tự ASCII để đại diện cho bất kỳ mã Unicode 16 bit nào. Chuỗi thoát Unicode này bắt đầu bằng tiền tố `\u`, sau đó là 4 chữ số thập lục phân (sử dụng số và chữ cái A~F in hoa hoặc thường) và có thể được sử dụng trong các giá trị trực tiếp, biểu thức chính quy và định danh (ngoại trừ từ khóa).

## Chú thích (comment)

JavaScript không thực thi các chú thích.

Chúng ta có thể thêm chú thích để giải thích JavaScript hoặc cải thiện khả năng đọc của mã.

### Chú thích một dòng

Chú thích một dòng bắt đầu bằng hai dấu gạch chéo `//`

```js
// let a;
```

### Chú thích nhiều dòng

Chú thích nhiều dòng, còn được gọi là chú thích khối, bắt đầu bằng `/*` và kết thúc bằng `*/`

```js
/*
Đoạn mã dưới đây
Khai báo biến và
gán giá trị
*/


let a;

a = 1;
```

Chú thích khối `/**/` có thể được viết trên nhiều dòng, nhưng không thể lồng nhau, nếu lồng nhau sẽ gây lỗi.

```js
// Error

/*
Chú thích 1
/*
Chú thích 1.1
 */
 */
```

Chú thích khối `/**/` cũng có thể chứa các ký tự xuất hiện trong biểu thức chính quy, vì vậy chú thích khối không an toàn cho các khối mã đã được chú thích.

```js
/*  
    var rm_a = /a*/.match(s);  
*/
```

### Ngăn chặn thực thi

Chú thích có thể được sử dụng để ngăn chặn việc thực thi một dòng mã (có thể sử dụng cho mục đích gỡ lỗi):

```js
// var a = 1;
var a = 2;
```

### Chú thích cuối dòng

Trong ví dụ dưới đây, chúng ta đặt chú thích ở cuối dòng mã:

```js
var x = 5; // Khai báo x và gán giá trị 5 cho nó
var y = x + 2; // Khai báo y và gán giá trị x+2 cho nó
```

## Giá trị trực tiếp

**Giá trị trực tiếp** trong JavaScript, còn được gọi là **Literal**, là dữ liệu có thể được sử dụng trực tiếp trong chương trình.

Có một số giá trị trực tiếp chính:

**Giá trị trống**

```js
null;
```

**Giá trị boolean**

```js
true;
false;
```

**Giá trị số**

```js
// Thập phân
1234567890;
```

⚠️ Lưu ý: Giá trị số thập phân có thể bắt đầu bằng 0, nhưng nếu chữ số cao nhất sau 0 nhỏ hơn 8, giá trị sẽ được coi là số bát phân thay vì báo lỗi.

```js
// Nhị phân
0b10000000000000000000000000000000;
// 2147483648
```

Số nhị phân được biểu thị bằng tiền tố 0 theo sau là chữ B (0b hoặc 0B). Nếu sau 0b có chứa số khác 0 hoặc 1, sẽ gây ra lỗi.

```js
// Bát phân
0o755;
// 493
```

Số bát phân được biểu thị bằng tiền tố 0 theo sau là chữ O (0o hoặc 0O). Nếu có số không thuộc `01234567`, sẽ gây ra lỗi.

```js
// Thập lục phân
0xfffffffffffffffff;
// 295147905179352830000
```

Số thập lục phân được biểu thị bằng tiền tố 0 theo sau là chữ X (0x hoặc 0X). Nếu có số không thuộc `0123456789ABCDEF`, sẽ gây ra lỗi.

**Giá trị chuỗi (string)**

```js
'foo';
'bar';

// Chuỗi thoát thập lục phân
'\xA9'; // "©"
// Chuỗi thoát Unicode
'\u00A9'; // "©"
```

**Giá trị đối tượng (object)**

```js
var o = { a: 'foo', b: 'bar', c: 42 };

// Cách viết tắt trong ES6
var a = 'foo',
  b = 'bar',
  c = 42;
var o = { a, b, c };

// Không cần phải viết như thế này
var o = { a: a, b: b, c: c };
```

**Giá trị mảng (array)**

```js
[1954, 1974, 1990, 2014];
```

**Giá trị biểu thức chính quy (regular expression)**

Một giá trị trực tiếp biểu thức chính quy trống, phải có một nhóm không bắt buộc trống để tránh bị coi là ký hiệu chú thích dòng.

```js
/ab+c/g

/(?:)/
```

**Giá trị chuỗi mẫu (string template)**

```js
`string text``string text line 1
 string text line 2``string text ${expression} string text`;
```

## Định danh (Identifier)

**Định danh** là tên của biến, hàm, thuộc tính hoặc tham số hàm. Định danh có thể là một hoặc nhiều ký tự được kết hợp theo các quy tắc định dạng sau đây.

- Ký tự đầu tiên phải là một chữ cái, dấu gạch dưới (`_`) hoặc dấu đô la (`$`).
- Các ký tự khác có thể là chữ cái, dấu gạch dưới, dấu đô la hoặc số.

Các chữ cái trong định danh cũng có thể chứa các ký tự chữ mở rộng ASCII hoặc Unicode, nhưng chúng ta không khuyến nghị việc này.

Theo quy ước, định danh ECMAScript được viết theo kiểu chữ hoa chữ thường theo kiểu gồm chữ cái đầu tiên viết thường và chữ cái đầu tiên của mỗi từ sau viết hoa.

```js
const firstSecond = 123;

const myCar = 'Toyota';

const doSomethingImportant = function () {};
```

Mặc dù không ai bắt buộc phải sử dụng định dạng này, nhưng để phù hợp với cách đặt tên hàm và đối tượng được tích hợp sẵn trong ECMAScript, nên coi đó là một phong cách tốt nhất.

⚠️ Lưu ý: Không thể sử dụng từ khóa, từ khóa bảo lưu, `true`, `false` và `null` làm định danh.

## Từ khóa và từ khóa bảo lưu

Giống như bất kỳ ngôn ngữ lập trình nào khác, JavaScript giữ lại một số định danh cho riêng nó. Những từ khóa này không thể được sử dụng làm định danh thông thường. Mặc dù có một số sách tham khảo sai lệch, có vẻ như từ khóa và từ khóa bảo lưu là hai thứ khác nhau, nhưng thực tế không phải như vậy, từ khóa chỉ là một phần của từ khóa bảo lưu.

Từ khóa bao gồm từ khóa, từ khóa bảo lưu, hằng số rỗng và hằng số giá trị boolean.

### Từ khóa bảo lưu

- Từ khóa Keyword
- Từ khóa bảo lưu FutureReservedWord
- Hằng số rỗng NullLiteral
- Hằng số giá trị boolean BooleanLiteral

### Từ khóa (Keyword)

Các từ khóa sau đã được triển khai trong tiêu chuẩn ES6

```js
break do instanceof typeof

case else new var

catch finally return void

continue for switch while

debugger function this with

default if throw delete

in try class extends

const export import
```

### Từ khóa bảo lưu

Những từ khóa sau là từ khóa bảo lưu của ECMAScript 6, nhưng trong phiên bản ECMAScript 3, từ khóa bảo lưu không giống như vậy. Nếu bạn muốn mã của mình chạy trên trình thông dịch dựa trên ECMAScript 3, bạn nên tránh sử dụng những từ khóa bảo lưu sau làm định danh.

```js
abstract boolean byte char

constdouble enum final float

goto implements int interfacelong

native package private protected

public short static super

throw transient volatile synchronized
```

**Biến và hàm được định nghĩa trước**

Ngoài ra, JavaScript đã định nghĩa trước nhiều biến toàn cầu và hàm, nên nên tránh sử dụng tên của chúng làm định danh.

```js
String Number Boolean Array

Date Function Math Object

RegExp Error EvalError JSON

Infinity NaN isNaN isFinite

undefined arguments parseInt parseFloat

eval decodeURI encodeURI decodeURIComponent

encodeURIComponent RangeError ReferenceError

TypeError URIError SyntaxError
```

## Dấu chấm phẩy

JavaScript sử dụng dấu chấm phẩy (`;`) để phân tách các câu lệnh, điều này rất quan trọng để cải thiện khả năng đọc và sắp xếp mã.

Có những nơi dấu chấm phẩy có thể được bỏ qua, nhưng cũng có những nơi không thể bỏ qua dấu chấm phẩy.

- **Hai câu lệnh được viết trên hai dòng, dấu chấm phẩy đầu tiên có thể bỏ qua**

```js
a = 3;
b = 4;
```

- **Hai câu lệnh được viết trên cùng một dòng, dấu chấm phẩy đầu tiên không thể bỏ qua**

```js
a = 3;
b = 4;
```

Tuy nhiên, JavaScript không thêm dấu chấm phẩy ở mọi nơi xuống dòng, chỉ khi thiếu dấu chấm phẩy mà mã không thể được phân tích đúng, JavaScript mới thêm dấu chấm phẩy. Nói cách khác, nếu câu lệnh hiện tại và ký tự không phải là khoảng trắng không thể được phân tích là một thực thể duy nhất, JavaScript sẽ thêm dấu chấm phẩy ở cuối dòng câu lệnh hiện tại.

🌰 Ví dụ mã:

```js
var a;
a = 3;
console.log(a);
```

JavaScript sẽ phân tích như sau:

```js
var a;
a = 3;
console.log(a);
```

### Tự động điền dấu chấm phẩy

JavaScript không tự động điền dấu chấm phẩy ở mọi dòng xuống hàng, chỉ khi mã không thể được phân tích đúng nếu thiếu dấu chấm phẩy, JavaScript mới tự động điền dấu chấm phẩy. Nói cách khác, nếu câu lệnh hiện tại và ký tự không phải khoảng trắng tiếp theo không thể được phân tích là một thể thống nhất, JavaScript sẽ điền dấu chấm phẩy ở cuối dòng câu lệnh hiện tại.

- Khi gặp một ký tự kết thúc dòng không cho phép hoặc `}` , một dấu chấm phẩy sẽ được chèn vào trước đó.

🌰 **Ví dụ mã**:

```js
{ 1 2 } 3

// Sẽ được chuyển đổi thành
{ 1 2 ;} 3;
```

Khi gặp kết thúc luồng đầu vào của dòng mã và không thể chuyển đổi một luồng đầu vào duy nhất thành một chương trình hoàn chỉnh, một dấu chấm phẩy sẽ được chèn vào cuối.

Trong đoạn mã dưới đây, do có một ký tự kết thúc dòng giữa `b` và `++`, nên `++` không được coi là toán tử tăng sau biến `b`.

🌰 **Ví dụ mã**:

```js
a = b;
++c;

// Sẽ được chuyển đổi thành
a = b;
++c;
```

Khi câu lệnh chứa cú pháp kết thúc dòng (tức là câu lệnh được ngay sau đó là xuống dòng), một dấu chấm phẩy sẽ được chèn vào cuối dòng.

Các câu lệnh tuần tự có quy tắc **không có cú pháp kết thúc dòng** bao gồm:

- Toán tử tăng sau ( `++` và `--` )
- `continue`
- `break`
- `return`
- `yield`, `yield*`
- `module`

```js
return;

a + b;

// Sẽ được chuyển đổi thành

return;

a + b;
```

```js
x;
++y;

// Được phân tích thành
x;
++y;

// Ý định ban đầu
x++;
y;
```

Mặc dù dấu chấm phẩy không bắt buộc, nhưng tốt nhất là không bỏ qua nó, vì việc thêm dấu chấm phẩy có thể tránh nhiều lỗi, việc không có dấu chấm phẩy ở cuối dòng có thể dẫn đến lỗi nén. Việc thêm dấu chấm phẩy cũng có thể cải thiện hiệu suất mã trong một số trường hợp, vì điều này giúp trình phân tích không cần mất thời gian đoán nơi chèn dấu chấm phẩy.
