---
title: JS Array Detection
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# Kiểm tra mảng

Có năm phương pháp thông thường để kiểm tra xem một biến có phải là một mảng hay không:

- Toán tử `typeof`
- Toán tử `instanceof`
- Hàm tạo đối tượng mảng
- `Array.isArray()`
- `Object.prototype.toString()`

## Toán tử `typeof`

```js
var arr = [1,2,3,4]
console.log(typeof arr); // 'object'
```

Phương pháp này hoạt động tốt với các loại thông thường như Function, String, Number, Undefined, nhưng không hoạt động với đối tượng mảng. Toán tử `typeof` trả về `'object'` cho mảng và `null`, nhưng trả về các giá trị khác cho các loại khác.

## Toán tử `instanceof`

```js
var arr = [1,2,3,4,5];
console.log(arr instanceof Array); // true
```

Toán tử này liên quan đến kế thừa trong JavaScript, nó kiểm tra xem chuỗi nguyên mẫu của đối tượng có trỏ đến đối tượng nguyên mẫu của lớp hay không.

## Hàm tạo đối tượng mảng

```js
var arr = [1,2,3,4];
console.log(arr.__proto__.constructor == Array); // true
console.log(arr.constructor == Array); // true
```

Trong các phiên bản trình duyệt cũ của IE, `__proto__` không được định nghĩa và vẫn có một số hạn chế. Vấn đề với `instanceof` và `constructor` là chúng giả định một môi trường thực thi toàn cục duy nhất. Nếu trang web chứa nhiều khung, thì thực tế sẽ có hai môi trường thực thi toàn cục khác nhau, và do đó có hai phiên bản khác nhau của hàm tạo đối tượng mảng. Nếu bạn truyền một mảng từ một khung sang khung khác, mảng được truyền sẽ có hàm tạo đối tượng khác nhau so với mảng được tạo ra một cách tự nhiên trong khung thứ hai.

```js
var iframe = document.createElement('iframe');
document.body.appendChild(iframe);
xArray = window.frames[window.frames.length-1].Array;
var arr = new xArray(1,2,3);
console.log(arr instanceof Array); // false
console.log(arr.constructor === Array); // false
```

## `Array.isArray()`

```js
var arr = [1,2,3,4,5];
console.log(Array.isArray(arr)); // true
```

## `Object.prototype.toString()` (Phương pháp chung)

Phương pháp này hoạt động bằng cách lấy một thuộc tính nội bộ `[[Class]]` của đối tượng, sau đó trả về một chuỗi giống `"[object Array]"` như kết quả. Bằng cách sử dụng phương pháp này kết hợp với `call`, chúng ta có thể lấy được `[[Class]]` của bất kỳ đối tượng nào và so sánh chuỗi để kiểm tra kiểu dữ liệu.

```js
var arr = [1,2,3,4,5];
function isArray(item){
    return Object.prototype.toString.call(item) === '[object Array]';
}
console.log(isArray(arr)); //
```

Việc sử dụng `call` thay đổi ngữ cảnh của `toString` để tham chiếu đến đối tượng được kiểm tra, trả về biểu diễn chuỗi của đối tượng. Sau đó so sánh chuỗi này với `'[object Array]'` để xác định xem đối tượng có phải là một mảng hay không. Tại sao không sử dụng `o.toString()` trực tiếp? Dù mảng kế thừa từ Object và có một phương thức toString, nhưng phương thức này có thể bị ghi đè và không đáp ứng yêu cầu của chúng ta. Trong khi đó, `Object.prototype` là một phần quan trọng của ngôn ngữ JavaScript và ít ai dám chạm vào nó, vì vậy có thể đảm bảo tính "trong sạch" của nó :)

Tài liệu chuẩn JavaScript xác định: giá trị `[[Class]]` chỉ có thể là một trong các chuỗi sau: Arguments, Array, Boolean, Date, Error, Function, JSON, Math, Number, Object, RegExp, String. Phương pháp này thường rất hữu ích khi nhận dạng các đối tượng được tích hợp sẵn, nhưng không nên sử dụng phương pháp này cho các đối tượng tùy chỉnh.
