---
title: JS Continue Statement
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Câu lệnh continue

**Câu lệnh continue** được sử dụng để kết thúc lần lặp hiện tại (hoặc nhãn) của vòng lặp và tiếp tục với lần lặp tiếp theo của vòng lặp.

## Cú pháp

```js
continue [labelname];
```

### Tham số

| Tham số     | Mô tả                             |
| ----------- | ---------------------------------- |
| `labelname` | Tùy chọn, là một định danh liên quan đến nhãn câu lệnh. |

### Mô tả

- Sự khác biệt giữa câu lệnh `continue` và `break` là `continue` không kết thúc lần lặp hiện tại, mà là:
  - Trong vòng lặp `while`, điều kiện kiểm tra được chỉ định ở đầu vòng lặp sẽ được kiểm tra lại và nếu kết quả là `true`, thân vòng lặp sẽ được thực thi từ đầu.
  - Trong vòng lặp `do/while`, chương trình thực hiện nhảy đến cuối vòng lặp, sau đó kiểm tra lại điều kiện lặp và tiếp tục vòng lặp tiếp theo.
  - Trong vòng lặp `for`, trước tiên thực hiện câu lệnh cập nhật, sau đó kiểm tra lại câu điều kiện để xem liệu vòng lặp có tiếp tục thực thi hay không.
  - Trong vòng lặp `for/in`, vòng lặp bắt đầu duyệt qua tên thuộc tính tiếp theo và gán tên thuộc tính này cho biến được chỉ định.
- Câu lệnh `continue` có thể chứa một nhãn tùy chọn để điều khiển chương trình nhảy đến lần lặp tiếp theo của vòng lặp cụ thể, thay vì vòng lặp hiện tại. Điều này yêu cầu câu lệnh `continue` được sử dụng bên trong vòng lặp tương ứng.
- Câu lệnh `continue` không thể được sử dụng bên ngoài thân vòng lặp. Nếu sử dụng ngoài vòng lặp, sẽ gây ra lỗi cú pháp.
- Không được phép có dòng mới giữa câu lệnh `continue` và `labelname`.

## Ví dụ

### Ví dụ mã

Sử dụng `continue` trong câu lệnh `for`

```js
var num = 0;
for (var i = 1; i < 10; i++) {
  if (i % 5 == 0) {
    continue;
  }
  num++;
}
console.log(num);
// 8
```

Sử dụng `continue` trong câu lệnh `while`

```js
i = 0;
n = 0;
while (i < 5) {
  i++;
  if (i === 3) {
    continue;
  }
  n += i;
}
console.log(n);
// 9
```
