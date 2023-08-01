---
title: JS Block
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Khối

Khối (Block) được sử dụng để kết hợp không có hoặc nhiều hơn một câu lệnh. Khối được định nghĩa bởi cặp dấu ngoặc nhọn `{}` và tạo ra một phạm vi Khối, **các biến được định nghĩa trong Khối sẽ được thu hồi ngay sau khi rời khỏi phạm vi đó**.

```js
{
  StatementList;
}
```

## Phạm vi Khối

Trong ES5, chỉ có **phạm vi toàn cục** và **phạm vi hàm** (function scope), không có phạm vi Khối, điều này gây ra nhiều tình huống không hợp lý:

- Biến trong phạm vi bên trong có thể ghi đè biến trong phạm vi bên ngoài.
- Biến đếm trong vòng lặp có thể rò rỉ thành biến toàn cục.

Do đó, ES6 đã giới thiệu phạm vi Khối, cho phép rõ ràng khai báo hàm trong phạm vi Khối. Trong phạm vi Khối của ES6, câu lệnh khai báo hàm có hành vi tương tự như `let`, không thể tham chiếu từ bên ngoài phạm vi Khối; nhưng khác với lệnh `let`, nó cho phép khai báo hàm trùng tên và tồn tại sự nâng cao biến hàm.

Các đặc điểm của hàm trong phạm vi Khối:

- Cho phép khai báo hàm trong phạm vi Khối.
- Khai báo hàm tương tự như `var`, tức là nó sẽ được nâng cao lên đầu phạm vi toàn cục hoặc phạm vi hàm.
- Hàm được khai báo trong phạm vi bên trong không làm ảnh hưởng đến hàm trong phạm vi bên ngoài.

### var

Biến được khai báo bằng `var` không có phạm vi Khối. Biến được khai báo trong Khối sẽ có phạm vi là hàm hoặc thẻ `<script>`, bạn có thể truy cập biến đó bên ngoài Khối.

Nói cách khác, Khối không tạo ra một phạm vi mới. Mặc dù Khối đơn lẻ là một câu lệnh hợp lệ, nhưng trong JavaScript, bạn không nên sử dụng Khối đơn lẻ vì chúng không xử lý các tác vụ như Khối trong C hoặc Java.

```js
var a = 1;
{
  var a = 2;
}
console.log(a); // 2
```

### let và const

So với var, biến được khai báo bằng `let` và `const` có phạm vi Khối.

```js
let a = 1;
{
  let a = 2;
}
console.log(a); // 1
```

```js
const a = 1;
{
  const a = 2;
}
console.log(a); // 1
```

Lưu ý rằng khai báo hằng số `const c = 2` trong phạm vi Khối không gây ra lỗi cú pháp `SyntaxError: Identifier 'a' has already been declared`, vì đây là một phạm vi mới.

### function

Khai báo hàm cũng bị giới hạn trong phạm vi Khối mà nó được khai báo.

```js
foo('outside'); // TypeError: foo is not a function
{
  function foo(location) {
    console.log('foo is called ' + location);
  }
  foo('inside'); // 'foo is called inside'
}
```
