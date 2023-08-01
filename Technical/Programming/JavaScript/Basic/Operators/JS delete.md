---
title: JS delete
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# delete

Toán tử `delete` được sử dụng để xóa một thuộc tính của đối tượng. Khi không còn tham chiếu nào đến thuộc tính đó, nó sẽ được tự động giải phóng.

## Cú pháp

```js
delete expression;
```

`expression` là kết quả tính toán của một thuộc tính.

```js
delete object.property;
delete object['property'];
```

## Tham số

| Tham số     | Mô tả                                                                 |
| ----------- | --------------------------------------------------------------------- |
| `object`    | Tên đối tượng hoặc biểu thức tính toán kết quả là đối tượng.            |
| `property`  | Thuộc tính cần xóa.                                                    |

#### Giá trị trả về

Trả về `true` cho tất cả các trường hợp, trừ khi thuộc tính là một thuộc tính **không thể cấu hình** (non-configurable), trong trường hợp đó, trong chế độ không nghiêm ngặt (non-strict mode), nó sẽ trả về `false`.

> ⚠️ Lưu ý: Khác với ý nghĩa thông thường của việc xóa, toán tử `delete` không liên quan trực tiếp đến việc giải phóng bộ nhớ. Quản lý bộ nhớ được thực hiện thông qua việc ngắt kết nối tham chiếu.
>
> Xem [[JSMemory Model]] để biết thêm thông tin.

## Giải thích

Toán tử `delete` được sử dụng để xóa một thuộc tính từ một đối tượng.

Nếu xóa thành công, nó sẽ trả về `true`, ngược lại sẽ trả về `false`.

Tuy nhiên, có một số trường hợp cần chú ý:

- Nếu thuộc tính mà bạn cố gắng xóa **không tồn tại**, thì `delete` sẽ không có tác dụng, nhưng vẫn trả về `true`.
- Nếu trong chuỗi nguyên mẫu của đối tượng có một thuộc tính cùng tên với thuộc tính cần xóa, sau khi xóa thuộc tính, đối tượng sẽ sử dụng thuộc tính trên chuỗi nguyên mẫu (nghĩa là, `delete` chỉ tác động vào thuộc tính của chính đối tượng đó).
- Bất kỳ thuộc tính nào được khai báo bằng `var` không thể xóa khỏi phạm vi toàn cục hoặc phạm vi của một hàm.
  - Điều này có nghĩa là `delete` không thể xóa bất kỳ hàm nào trong phạm vi toàn cục (bất kể hàm đó là khai báo bằng khai báo hàm hoặc biểu thức hàm).
  - Trừ khi hàm đó không ở trong phạm vi toàn cục, hàm trong một đối tượng có thể bị xóa bằng cách sử dụng `delete`.
- Bất kỳ thuộc tính nào được khai báo bằng `let` hoặc `const` không thể xóa khỏi phạm vi mà nó được khai báo.
- Thuộc tính không thể cấu hình (non-configurable) không thể bị xóa. Điều này có nghĩa là các thuộc tính của các đối tượng tích hợp sẵn như `Math`, `Array` và `Object`, cũng như các thuộc tính được đặt thành không thể cấu hình bằng `Object.defineProperty()`, không thể bị xóa.

## Ví dụ

```js
var Employee = {
  age: 28,
  name: 'abc',
  designation: 'developer',
};

console.log(delete Employee.name);
// true
console.log(delete Employee.age);
// true

// Khi cố gắng xóa một thuộc tính không tồn tại
// Vẫn trả về true
console.log(delete Employee.salary);
// true
```
