---
title: JS Try Statement
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Câu lệnh try-catch

Câu lệnh `try…catch` được sử dụng để đặt mã có thể gây ra lỗi vào trong khối `try` và xử lý ngoại lệ tương ứng.

Câu lệnh `try…catch` bao gồm một khối `try` chứa một hoặc nhiều câu lệnh, và ít nhất một khối `catch` hoặc một khối `finally`, hoặc cả hai.

Dưới đây là ba dạng khai báo `try`:

- `try…catch`
- `try…finally`
- `try…catch…finally`

## catch

Khối `catch` chứa các câu lệnh được thực thi khi một ngoại lệ được ném ra từ khối `try`. Nếu có bất kỳ câu lệnh nào trong khối `try` (hoặc trong hàm được gọi từ khối `try`) ném ra một ngoại lệ, quyền điều khiển sẽ ngay lập tức chuyển đến khối `catch`. Nếu không có ngoại lệ nào được ném ra từ khối `try`, khối `catch` sẽ được bỏ qua.

🌰 **Ví dụ:**

```js
try {
  console.log('1: start');

  throw 'Đây là một lỗi';

  console.log('2: end');
} catch (err) {
  console.log('3:', err);
}

// Kết quả:
// 1: start
// 3: Đây là một lỗi
```

Khối `catch` chỉ định một biến (trong ví dụ trên là `err`) để lưu giá trị được chỉ định bởi câu lệnh `throw`. Biến này chỉ tồn tại trong khối `catch` và được thêm vào phạm vi hiện tại khi khối `catch` được thực thi. Sau khi khối `catch` thực thi xong, biến này không còn khả dụng.

Từ kết quả, ta có thể thấy rằng nếu có bất kỳ câu lệnh nào trong khối `try` (hoặc trong hàm được gọi từ khối `try`) ném ra một ngoại lệ, quyền điều khiển sẽ ngay lập tức chuyển đến khối `catch`.

## finally

Khối `finally` được thực thi sau khối `try` và khối `catch`, nhưng trước khi khối `try` tiếp theo được khai báo.

⚠️ **Lưu ý**: Khối `finally` luôn được thực thi, bất kể có ngoại lệ nào được ném ra hay không.

```js
function fn() {
  try {
    return 1;
  } catch (err) {
    return 2;
  } finally {
    console.log(3);
  }
}

console.log(fn());
// Kết quả:
// 3
// 1
```

Từ kết quả, ta thấy rằng khối `finally` được thực thi trước khi giá trị được trả về từ khối `try`.

```js
function fn() {
  try {
    throw 'Đây là một lỗi';
  } catch (err) {
    console.log(1, err)

    return 2;
  } finnally {
    console.log(3);
  }
}

console.log(fn());
// Kết quả:
// 1 Đây là một lỗi
// 3
// 2
```

Các câu lệnh trước `return` được thực thi trước, sau đó là khối `finally`, và cuối cùng là giá trị được trả về từ `return`.

> ⚠️ **Lưu ý**: Nếu khối `finally` trả về một giá trị, giá trị đó sẽ trở thành giá trị trả về của toàn bộ câu lệnh `try-catch-finally`, bất kể có câu lệnh `return` trong khối `try` và `catch` hay không. Điều này bao gồm cả việc ném ra ngoại lệ từ khối `catch`.

## Xử lý lồng nhau

Bạn có thể lồng nhau một hoặc nhiều câu lệnh `try`. Nếu câu lệnh `try` bên trong không có khối `catch`, thì chương trình sẽ chuyển đến khối `catch` của câu lệnh `try` bên ngoài.

```js
try {
  try {
    throw 'Đây là một lỗi';
  } finally {
    console.log(1);
  }
} catch (err) {
  console.log(2, err);
}

// Kết quả:
// 1
// 2 Đây là một lỗi
```

Lồng một câu lệnh `try-catch-finally` trong khối `try`.

```js
try {
  try {
    throw 'Đây là một lỗi';
  } catch (err) {
    console.error(1, err);

    throw err;
  } finally {
    console.log(2);

    return 3;
  }
} catch (err) {
  console.error(4, err.message);
}

// Kết quả:
// 1 Đây là một lỗi
// 2
```

Vì câu lệnh `return` trong khối `finally`, nên ngoại lệ `this is a error` bên ngoài không được ném ra. Giá trị trả về từ khối `catch` cũng áp dụng tương tự.

## Biến định danh ngoại lệ

Khi một ngoại lệ được ném ra từ khối `try`, _`exception_var`_ (như `err` trong `catch (err)`) được sử dụng để lưu trữ giá trị được chỉ định bởi câu lệnh `throw`. Bạn có thể sử dụng biến này để lấy thông tin về ngoại lệ được ném ra.

Biến này chỉ tồn tại trong khối `catch`. Nghĩa là khi bạn vào khối `catch`, biến này được tạo ra và thêm vào phạm vi hiện tại, và sau khi khối `catch` thực thi xong, biến này không còn khả dụng.
