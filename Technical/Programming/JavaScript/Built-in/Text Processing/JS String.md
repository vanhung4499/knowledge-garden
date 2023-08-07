---
title: JS String
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# Đối tượng String

Đối tượng String là một hàm tạo được sử dụng để tạo ra một đối tượng đại diện cho một chuỗi ký tự hoặc một chuỗi các ký tự.

Đối tượng String là một đối tượng dùng để làm việc với chuỗi văn bản. Nó cho phép thao tác và định dạng chuỗi văn bản cũng như xác định và định vị các chuỗi con trong chuỗi.

## Cú pháp

**Hàm tạo**

```js
new String([value]);
```

**Hàm chuyển đổi kiểu dữ liệu sang chuỗi**

```js
String([value]);
```

| Tham số | Kiểu dữ liệu | Mô tả                         |
| ------- | ----------- | ---------------------------- |
| `value` | Bất kỳ       | Bất kỳ giá trị có thể chuyển đổi thành chuỗi. |

## Giải thích

### Template literals

Kể từ ECMAScript 2015, chuỗi văn bản cũng có thể được gọi là **template literals**:

```js
const w = 'world'`Hello ${w}!`;
```

### Ký tự thoát

Ngoài các ký tự in được thông thường, một số ký tự có chức năng đặc biệt có thể được đưa vào chuỗi bằng cách sử dụng ký tự thoát:

| Ký tự thoát | Kết quả                 |
| :--------- | :--------------------- |
| `\0`       | Ký tự null              |
| `\'`       | Ký tự nháy đơn          |
| `\"`       | Ký tự nháy kép          |
| `\\`       | Ký tự gạch chéo ngược   |
| `\n`       | Xuống dòng              |
| `\r`       | Về đầu dòng             |
| `\v`       | Ký tự tab dọc           |
| `\t`       | Ký tự tab ngang         |
| `\b`       | Ký tự backspace         |
| `\f`       | Ký tự form feed         |
| `\uXXXX`   | Ký tự Unicode           |
| `\xXX`     | Ký tự Latin-1 (x viết thường) |

Khác với các ngôn ngữ khác, JavaScript không phân biệt giữa việc sử dụng dấu nháy đơn và dấu nháy kép trong chuỗi, vì vậy các ký tự thoát trên đều có thể hoạt động trong cả chuỗi dấu nháy đơn và chuỗi dấu nháy kép.

## Đối tượng nguyên mẫu

### Thuộc tính nguyên mẫu

| Thuộc tính                   | Mô tả                                                                                               |
| ---------------------------- | --------------------------------------------------------------------------------------------------- |
| String.prototype.constructor | Trả về hàm tạo đối tượng đã tạo ra đối tượng này.                                                    |
| String.prototype.length      | Trả về độ dài của chuỗi (số ký tự).                                                                 |
| String.prototype.N           | Dùng để truy cập vào ký tự ở vị trí thứ N, trong đó N là một số nguyên dương nhỏ hơn length và 0. Các thuộc tính này chỉ có thể đọc, không thể chỉnh sửa. |

### Phương thức nguyên mẫu

| Phương thức                          | Mô tả                                                                                                                                                                                                                                  |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| String.fromCharCode()                | Trả về một chuỗi được tạo bằng cách sử dụng các mã UTF-16 được chỉ định.                                                                                                                                                               |
| String.fromCodePoint()               | Trả về một chuỗi được tạo bằng cách sử dụng các mã code point được chỉ định.                                                                                                                                                           |
| String.prototype.charAt()            | Trả về ký tự con ở vị trí chỉ định trong chuỗi.                                                                                                                                                                                        |
| String.prototype.charCodeAt()        | Trả về giá trị Unicode của ký tự con ở vị trí chỉ định trong chuỗi (giá trị nằm trong khoảng từ 0 đến 65535).                                                                                                                          |
| String.prototype.codePointAt()       | Trả về giá trị số nguyên không âm của vị trí đã cho trong chuỗi sử dụng mã hóa UTF-16.                                                                                                                                                 |
| String.prototype.concat()            | Kết hợp một hoặc nhiều chuỗi với chuỗi gốc, tạo thành một chuỗi mới và trả về.                                                                                                                                                         |
| String.prototype.endsWith()          | Kiểm tra xem chuỗi hiện tại có kết thúc bằng một chuỗi khác đã cho hay không, trả về `true` hoặc `false` tùy thuộc vào kết quả kiểm tra.                                                                                               |
| String.prototype.includes()          | Kiểm tra xem một chuỗi có tồn tại trong chuỗi khác hay không, trả về `true` hoặc `false` tùy thuộc vào kết quả kiểm tra.                                                                                                               |
| String.prototype.indexOf()           | Trả về chỉ số đầu tiên của giá trị đã cho trong chuỗi, nếu không tìm thấy trả về -1. Tìm kiếm bắt đầu từ `startIndex`.                                                                                                                 |
| String.prototype.lastIndexOf()       | Trả về chỉ số cuối cùng của giá trị đã cho trong chuỗi, nếu không tìm thấy trả về -1. Tìm kiếm bắt đầu từ `startIndex` và đi ngược lại từ cuối chuỗi.                                                                                  |
| String.prototype.localeCompare()     | Trả về một số để chỉ ra xem một chuỗi tham chiếu có đứng trước, sau hoặc bằng với chuỗi đã cho hay không.                                                                                                                              |
| String.prototype.match()             | Tìm kiếm một chuỗi khớp với một biểu thức chính quy và trả về một mảng các kết quả.                                                                                                                                                    |
| String.prototype.matchAll()          | Trả về một mảng chứa tất cả các kết quả khớp với biểu thức chính quy đã cho.                                                                                                                                                           |
| String.prototype.normalize()         | Chuẩn hóa chuỗi hiện tại theo một hình thức chuẩn Unicode đã cho.                                                                                                                                                                      |
| String.prototype.padEnd()            | Điền vào chuỗi hiện tại với một chuỗi đã cho (nếu cần) để tạo ra một chuỗi mới có độ dài nhất định. Bắt đầu từ cuối chuỗi hiện tại.                                                                                                    |
| String.prototype.padStart()          | Điền vào chuỗi hiện tại với một chuỗi đã cho (nếu cần) để tạo ra một chuỗi mới có độ dài nhất định. Bắt đầu từ đầu chuỗi hiện tại.                                                                                                     |
| String.prototype.repeat()            | Tạo và trả về một chuỗi mới chứa số lượng chuỗi đã cho được nối với nhau.                                                                                                                                                              |
| String.prototype.replace()           | Trả về một chuỗi mới với tất cả các kết quả khớp với mẫu đã cho được thay thế bằng giá trị thay thế đã cho. Mẫu có thể là một chuỗi hoặc biểu thức chính quy, giá trị thay thế có thể là một chuỗi hoặc một hàm được gọi mỗi lần khớp. |
| String.prototype.search()            | Tìm kiếm một biểu thức chính quy hoặc một chuỗi đã cho trong chuỗi và trả về chỉ số của lần xuất hiện đầu tiên.                                                                                                                        |
| String.prototype.slice()             | Trích xuất một phần của chuỗi (một phần của chuỗi), trả về một chuỗi mới.                                                                                                                                                              |
| String.prototype.split()             | Chia một đối tượng chuỗi thành một mảng các chuỗi con bằng cách sử dụng một chuỗi phân tách đã cho để xác định vị trí chia.                                                                                                            |
| String.prototype.startsWith()        | Kiểm tra xem chuỗi có bắt đầu bằng một chuỗi khác đã cho hay không, trả về `true` hoặc `false` tùy thuộc vào kết quả kiểm tra.                                                                                                         |
| String.prototype.substr()            | Trả về một chuỗi con bắt đầu từ vị trí đã cho và có độ dài đã cho.                                                                                                                                                                     |
| String.prototype.substring()         | Trả về một phần của chuỗi từ vị trí bắt đầu đến vị trí kết thúc hoặc từ vị trí bắt đầu đến cuối chuỗi.                                                                                                                                 |
| String.prototype.toLocaleLowerCase() | Trả về giá trị chuỗi gốc đã chuyển đổi thành chữ thường theo quy tắc phụ thuộc vào ngôn ngữ.                                                                                                                                           |
| String.prototype.toLocaleUpperCase() | Trả về giá trị chuỗi gốc đã chuyển đổi thành chữ hoa theo quy tắc phụ thuộc vào ngôn ngữ.                                                                                                                                              |
| String.prototype.toLowerCase()       | Chuyển đổi chuỗi thành chữ thường và trả về.                                                                                                                                                                                           |
| String.prototype.toString()          | Trả về một chuỗi biểu diễn đối tượng cụ thể. Ghi đè phương thức `Object.prototype.toString`.                                                                                                                                           |
| String.prototype.toUpperCase()       | Chuyển đổi chuỗi thành chữ hoa và trả về.                                                                                                                                                                                              |
| String.prototype.trim()              | Loại bỏ khoảng trắng từ cả hai đầu của chuỗi. Trong ngữ cảnh này, khoảng trắng được xem là tất cả các ký tự trống (khoảng trắng, tab, không gian không thể phá vỡ).                                                                    |
| String.prototype.trimEnd()           | Loại bỏ các ký tự trống liên tiếp từ phía bên trái của chuỗi gốc.                                                                                                                                                                      |
| String.prototype.trimStart()         | Loại bỏ các ký tự trống liên tiếp từ phía bên trái của chuỗi gốc.                                                                                                                                                                      |
| String.prototype.valueOf()           | Trả về giá trị nguyên thủy của đối tượng cụ thể. Ghi đè phương thức `Object.prototype.valueOf`.                                                                                                                                        |
| String.raw()                         | Một hàm gắn thẻ cho chuỗi mẫu, tương tự như tiền tố r trong Python và tiền tố @ trong C#, được sử dụng để lấy chuỗi gốc của một chuỗi mẫu.                                                                                             |

## Ví dụ

### Lấy một ký tự từ một chuỗi

Có hai cách để lấy một ký tự từ một chuỗi. Cách đầu tiên là sử dụng phương thức charAt:

```js
return 'cat'.charAt(1);
// "a"
```

Cách thứ hai là xem chuỗi như một đối tượng giống một mảng, trong đó mỗi ký tự tương ứng với một chỉ số số:

```js
return 'cat'[1];
('a');
```

Sử dụng dấu ngoặc để truy cập vào chuỗi không thể xóa hoặc thêm vào nó, vì các thuộc tính tương ứng với chuỗi không được đọc hoặc cấu hình. (Xem thêm thông tin tại Object.defineProperty)

### Chuỗi dài

Đôi khi, mã của bạn có thể chứa các chuỗi rất dài. Bạn có thể muốn viết các chuỗi như vậy thành nhiều dòng, thay vì để một dòng kéo dài vô tận hoặc bị gập lại bởi trình chỉnh sửa. Có hai cách để làm điều này.

Bạn có thể sử dụng toán tử `+` để kết nối nhiều chuỗi lại với nhau.

```js
let longString =
  'This is a very long string which needs ' +
  'to wrap across multiple lines because ' +
  'otherwise my code is unreadable.';
```

Bạn có thể sử dụng ký tự gạch chéo ngược (`\`) ở cuối mỗi dòng để chỉ ra rằng chuỗi sẽ tiếp tục ở dòng tiếp theo. Hãy đảm bảo rằng sau ký tự gạch chéo ngược không có khoảng trắng hoặc bất kỳ ký tự nào khác ngoại trừ ký tự xuống dòng; nếu không, ký tự gạch chéo ngược sẽ không hoạt động.

```js
let longString =
  'This is a very long string which needs \
to wrap across multiple lines because \
otherwise my code is unreadable.';
```

Hoặc sử dụng chuỗi mẫu được cung cấp bởi ES6+.

```js
let longString = `This is a very long string which needs
to wrap across multiple lines because
otherwise my code is unreadable.`;
```
