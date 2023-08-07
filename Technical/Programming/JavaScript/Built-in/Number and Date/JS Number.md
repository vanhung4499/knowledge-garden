---
title: JS Number
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# Number

Đối tượng `Number` trong JavaScript là biểu diễn đối tượng của giá trị số nguyên.

## Cú pháp

**Hàm tạo**

```js
new Number([value]);
```

**Hàm chuyển đổi kiểu số**

```js
Number([value]);
```

| Tham số | Kiểu dữ liệu | Mô tả                                      |
| ------- | ------------ | ------------------------------------------ |
| `value` | Tùy chọn     | Giá trị bất kỳ để biểu diễn một số, mặc định là 0. |

Nếu tham số `value` không thể chuyển đổi thành số hợp lệ, kết quả trả về sẽ là `NaN`.

- Nếu hàm `Number()` được sử dụng như một hàm tạo cho đối tượng `Number`, nó sẽ tạo một đối tượng `Number` mới (kiểu Number). Đối tượng `Number` này biểu diễn giá trị số được chỉ định bởi tham số.
- Nếu hàm `Number()` được sử dụng như một hàm thông thường, nó sẽ trả về giá trị số đã được chuyển đổi sang kiểu dữ liệu Number.

⚠️ **Lưu ý**: Trong hầu hết các trường hợp, bạn không cần phải tạo một đối tượng `Number` bằng từ khóa `new`, vì trong JavaScript, đối tượng Number và kiểu dữ liệu Number là tương đương, bạn có thể sử dụng tất cả các thuộc tính và phương thức của đối tượng Number trên biến kiểu dữ liệu Number trực tiếp.

## Hàm tạo

### Thuộc tính

|           Thuộc tính           |                           Mô tả                            |
| :---------------------------: | :--------------------------------------------------------: |
|        `Number.EPSILON`        | Giá trị khoảng cách nhỏ nhất giữa 1 và số lớn hơn 1 (Number). |
|   `Number.MAX_SAFE_INTEGER`   |       Biểu diễn số nguyên an toàn lớn nhất trong JavaScript (253 - 1).        |
|      `Number.MAX_VALUE`       |        Biểu diễn giá trị số lớn nhất trong JavaScript.        |
|      `Number.MIN_VALUE`       | Biểu diễn giá trị số nhỏ nhất có thể biểu diễn trong JavaScript (gần 5e-324). |
|         `Number.NaN`          |                  Giá trị đặc biệt "không phải số".                  |
| `Number.NEGATIVE_INFINITY` | Giá trị đặc biệt âm vô cùng, được trả về khi có tràn số. |
| `Number.POSITIVE_INFINITY` | Giá trị đặc biệt dương vô cùng, được trả về khi có tràn số. |
|     `Number.prototype`      |          Đại diện cho nguyên mẫu của đối tượng Number.          |

### Phương thức

|        Phương thức        |                                 Mô tả                                  |
| :----------------------: | :--------------------------------------------------------------------: |
|    `Number.isNaN()`     | Xác định xem giá trị được truyền vào có phải là `NaN` và có kiểu Number không. |
|   `Number.isFinite()`   |            Kiểm tra xem đối số được truyền vào có phải là số hữu hạn hay không.             |
|  `Number.isInteger()`   |                 Kiểm tra xem đối số được truyền vào có phải là số nguyên hay không.                 |
| `Number.isSafeInteger()` | Xác định xem giá trị được truyền vào có phải là số nguyên an toàn (trong khoảng từ -(253 - 1) đến 253 - 1) hay không. |
|  `Number.parseFloat()`  |                Phân tích một chuỗi thành một số dấu phẩy động.                |
|   `Number.parseInt()`   |            Phân tích một chuỗi thành một số nguyên dựa trên một hệ cơ số.            |

## Đối tượng nguyên mẫu

|          Thuộc tính          |                             Mô tả                             |
| :--------------------------: | :------------------------------------------------------------: |
| `Number.prototype.toExponential()`  | Trả về một chuỗi biểu diễn số dưới dạng số mũ. |
|    `Number.prototype.toFixed()`     |        Sử dụng định dạng số cố định để định dạng một số.         |
| `Number.prototype.toLocaleString()` | Trả về một chuỗi biểu diễn số dưới dạng chuỗi phù hợp với ngôn ngữ. |
|  `Number.prototype.toPrecision()`   | Trả về một chuỗi biểu diễn số với độ chính xác xác định. |
|    `Number.prototype.toString()`    |   Trả về một chuỗi biểu diễn số dưới dạng chuỗi.   |
|    `Number.prototype.valueOf()`     |   Trả về giá trị nguyên thủy được đóng gói bởi đối tượng Number.   |

## Ví dụ

Tạo đối tượng Number mới

```js
const lamborghini = new Number(5);
// 5
const porsche = new Number('5.3');
// 5.3
const maserati = new Number();
// 0
const ferrari = new Number('Ferrari');
// NaN
```

Chuyển đổi dữ liệu thành kiểu dữ liệu Number (là giá trị số nguyên, không phải đối tượng Number)

```js
var lamborghini = Number(5);
// 5
var porsche = Number('5.3');
// 5.3
var maserati = Number();
// 0
var ferrari = Number('Ferrari');
// NaN
```
