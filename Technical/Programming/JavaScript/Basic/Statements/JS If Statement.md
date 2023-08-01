---
title: JS If Statement
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Câu lệnh if

**Câu lệnh điều kiện được sử dụng để thực hiện các hành động khác nhau dựa trên các điều kiện khác nhau.**

Trong JavaScript, chúng ta có thể sử dụng các câu lệnh điều kiện sau:

- _Câu lệnh if_ - chỉ thực hiện mã code khi điều kiện được chỉ định là `true`
- _Câu lệnh if…else_ - thực hiện mã code khi điều kiện được chỉ định là `true`, và thực hiện mã code khác khi điều kiện là `false`
- _Câu lệnh if…else if…else_ - sử dụng câu lệnh này để chọn một trong nhiều khối mã code để thực thi
- _Câu lệnh switch_ - sử dụng câu lệnh này để chọn một trong nhiều khối mã code để thực thi

Khi một điều kiện logic là đúng, sử dụng câu lệnh `if` để thực hiện một câu lệnh. Khi điều kiện đó là sai, sử dụng mệnh đề `else` tùy chọn để thực hiện một câu lệnh khác.

## Câu lệnh điều kiện đơn

```js
if (condition) {
  statement_1;
}
[else {
  statement_2;
}] // Sử dụng cú pháp khối lệnh nghiêm ngặt được khuyến nghị, mệnh đề else là tùy chọn
```

<br />

| Tham số      | Mô tả                                                                                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `condition`  | Một biểu thức trả về kết quả là `true` hoặc `false` (sẽ được chuyển đổi sang kiểu boolean bởi ECMAScript nếu không phải là kiểu boolean). Nếu điều kiện là `true`, `statement1` sẽ được thực thi; nếu không, `statement2` sẽ được thực thi |
| `statement1` | Một câu lệnh bất kỳ (khối mã), thậm chí có thể là một câu lệnh `if` lồng nhau                                                                                   |

## Câu lệnh điều kiện nhiều tầng

```js
if (condition_1) {
  statement_1;
} [else if (condition_2) {
  statement_2;
}]
...
[else if (condition_n_1) {
  statement_n_1;
}] [else {
  statement_n;
}]
```

Để thực hiện nhiều câu lệnh, bạn có thể sử dụng khối lệnh ({ … }) để nhóm chúng lại.

## Ví dụ

### Không khuyến nghị sử dụng trong biểu thức điều kiện

Không khuyến nghị sử dụng phép gán trong biểu thức điều kiện, vì nó dễ bị nhầm lẫn với phép so sánh bằng.

Không nên sử dụng mã sau:

```js
if ((x = y)) {
  // làm gì đó
}
```

Nếu bạn cần sử dụng phép gán trong biểu thức, thì thường bạn nên thêm một cặp dấu ngoặc bổ sung trước và sau câu lệnh gán.

```js
if ((x = y)) {
  // làm gì đó
}
```

### Giá trị tương đương với giá trị sai

Các giá trị sau sẽ được tính là `false`:

- `false`
- `undefined`
- `null`
- `0`
- `NaN`
- `""`

Khi chúng được chuyển đến câu lệnh điều kiện, tất cả các giá trị khác, bao gồm tất cả các đối tượng, sẽ được tính là đúng.

Đừng nhầm lẫn giữa giá trị boolean nguyên thuỷ `true` và `false` với giá trị đúng và sai của đối tượng `Boolean`.

```js
var b = new Boolean(false);

if (b)
// điều kiện này tính là true

if (b == true)
// điều kiện này tính là false
```
