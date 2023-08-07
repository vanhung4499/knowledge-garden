---
title: JS RegExp test
tags: [js, programming]
categories: [js, programming]s
date created: 2023-08-07
date modified: 2023-08-07
---

# RegExp.prototype.test()

Phương thức `test()` thực hiện một tìm kiếm để kiểm tra xem biểu thức chính quy có khớp với chuỗi đã cho hay không.

## Cú pháp

```js
regExpObject.test(str);
```

| Tham số        | Kiểu dữ liệu | Mô tả                                   |
| -------------- | ------------ | -------------------------------------- |
| `regExpObject` | `RegExp`     | Biểu thức chính quy để kiểm tra.         |
| `str`          | `String`     | Chuỗi đã cho. Sẽ thực hiện tìm kiếm trong chuỗi này. |

Phương thức trả về `true` nếu biểu thức chính quy khớp với chuỗi đã cho, ngược lại trả về `false`.

## Mô tả

- Lưu ý rằng mỗi lần thực hiện phương thức `test()` chỉ tìm kiếm tối đa một kết quả. Nếu tìm thấy, phương thức sẽ trả về `true` ngay lập tức, ngược lại trả về `false`.
- Nếu biểu thức chính quy có cờ toàn cục `g`, phương thức `test()` vẫn chỉ tìm kiếm tối đa một kết quả, nhưng khi gọi lại phương thức `test()` trên cùng một đối tượng biểu thức chính quy, nó sẽ tìm kiếm kết quả tiếp theo.

Lý do là: Nếu `regExpObject` có cờ toàn cục `g`, phương thức `test()` không bắt đầu tìm kiếm từ đầu chuỗi, mà bắt đầu từ chỉ mục được chỉ định bởi thuộc tính `regExpObject.lastIndex`. Giá trị mặc định của thuộc tính này là 0, vì vậy lần đầu tiên vẫn tìm kiếm từ đầu chuỗi. Khi tìm thấy một kết quả, phương thức `test()` sẽ thay đổi giá trị của thuộc tính `regExpObject.lastIndex` thành chỉ mục của ký tự tiếp theo sau kết quả khớp cuối cùng trong chuỗi. Khi gọi lại phương thức `test()` lần nữa, nó sẽ bắt đầu tìm kiếm từ chỉ mục này, từ đó tìm thấy kết quả tiếp theo.

Do đó, sau khi sử dụng phương thức `test()` để tìm kiếm một lần, nếu bạn muốn sử dụng lại phương thức `test()` để tìm kiếm từ đầu chuỗi, bạn cần thiết lập lại giá trị của thuộc tính `regExpObject.lastIndex` thành 0. Nếu phương thức `test()` không tìm thấy bất kỳ văn bản khớp nào nữa, nó sẽ tự động đặt lại thuộc tính `regExpObject.lastIndex` thành 0.

## Ví dụ

### Ví dụ mã

Một ví dụ đơn giản, kiểm tra xem "hello" có xuất hiện ở đầu chuỗi hay không, trả về giá trị boolean.

```js
let str = 'hello world!';

let result = /^hello/.test(str);

console.log(result); // true
```

### Sử dụng `test()` với biểu thức chính quy có cờ toàn cục

Nếu biểu thức chính quy có cờ toàn cục, việc thực hiện `test()` sẽ thay đổi giá trị của thuộc tính `lastIndex` của biểu thức chính quy. Khi liên tiếp gọi phương thức `test()`, các lần gọi sau sẽ tìm kiếm từ vị trí `lastIndex` của biểu thức chính quy, (`exec()` cũng thay đổi giá trị `lastIndex` của biểu thức chính quy).

Ví dụ dưới đây thể hiện hành vi này:

```js
var regex = /foo/g;

// regex.lastIndex là 0
regex.test('foo'); // true

// regex.lastIndex hiện tại là 3
regex.test('foo'); // false
```
