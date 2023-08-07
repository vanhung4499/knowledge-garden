---
title: JS Math
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# Math

Đối tượng `Math` là một đối tượng toàn cục được tích hợp sẵn trong JavaScript, nó cung cấp một số hàm và hằng số toán học cơ bản và phổ biến.

Khác với các đối tượng toàn cục khác, đối tượng `Math` không phải là một hàm khởi tạo, tất cả các thuộc tính và phương thức của đối tượng `Math` đều là tĩnh.

```js
new Math(); // Uncaught TypeError: Math is not a constructor
```

## Thuộc tính

Đối tượng Math có 8 thuộc tính, chủ yếu bao gồm ba loại hằng số: **[logarithm](#logarithm)**, **[pi](#pi)** và **[square root](#square-root)**.

### Logarithm

|   Thuộc tính   |                      Mô tả                       |
| :------------ | :---------------------------------------------- |
|   `Math.E`    | Cơ số tự nhiên của logarithm, tương đương với e  |
|  `Math.LN2`   | Logarithm tự nhiên của 2                         |
|  `Math.LN10`  | Logarithm tự nhiên của 10                        |
| `Math.LOG2E`  | Logarithm cơ số 2 của e                           |
| `Math.LOG10E` | Logarithm cơ số 10 của e                          |

### Pi

|  Thuộc tính  |          Mô tả          |
| :---------- | :--------------------- |
| `Math.PI`   | Số pi (xấp xỉ 3.14159) |

### Square root

|      Thuộc tính      |                       Mô tả                        |
| :------------------ | :------------------------------------------------ |
|  `Math.SQRT2`       | Căn bậc hai của 2 (xấp xỉ 1.414)                   |
| `Math.SQRT1_2`      | Căn bậc hai của 0.5, tức là nghịch đảo căn bậc hai của 2 (xấp xỉ 0.707) |

## Phương thức

Đối tượng Math có tổng cộng 18 phương thức tĩnh, chủ yếu bao gồm sáu loại: **[giá trị tối đa](#giá-trị-tối-đa)**, **[làm tròn](#làm-tròn)**, **[số ngẫu nhiên](#số-ngẫu-nhiên)**, **[giá trị tuyệt đối](#giá-trị-tuyệt-đối)**, **[hàm lượng giác](#hàm-lượng-giác)** và **[lũy thừa căn bậc](#lũy-thừa-căn-bậc)**.

Các hàm này liên quan đến việc chuyển đổi kiểu ngầm định `Number()`, nếu vượt quá phạm vi, chúng sẽ trả về `NaN`.

### Giá trị tối đa

|                      Phương thức                     |                                                                 Mô tả                                                                  |
| :------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| `Math.max([value1 [, value2, …]])`                | Trả về giá trị lớn nhất trong một tập hợp các số. Nếu không có tham số nào được truyền vào, nó sẽ trả về `-Infinity`. Nếu bất kỳ tham số nào là `NaN` hoặc không thể chuyển đổi thành số, nó sẽ trả về `NaN`. |
| `Math.min([value1 [, value2, …]])`                | Trả về giá trị nhỏ nhất trong một tập hợp các số. Nếu không có tham số nào được truyền vào, nó sẽ trả về `Infinity`. Nếu bất kỳ tham số nào là `NaN` hoặc không thể chuyển đổi thành số, nó sẽ trả về `NaN`.  |

### Làm tròn

|      Phương thức     |                                                                 Mô tả                                                                  |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------------ |
| `Math.ceil()`       | Trả về số nguyên lớn nhất lớn hơn hoặc bằng một số đã cho. (Làm tròn lên)                                                               |
| `Math.floor()`      | Trả về số nguyên nhỏ nhất nhỏ hơn hoặc bằng một số đã cho. (Làm tròn xuống)                                                             |
| `Math.round()`      | Trả về số nguyên gần nhất của một số đã cho sau khi làm tròn.                                                                          |

### Số ngẫu nhiên

|      Phương thức      |                                                                                   Mô tả                                                                                   |
| :------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Math.random()`      | Trả về một số thực ngẫu nhiên trong khoảng [0, 1), tức là từ 0 (bao gồm 0) đến trước 1 (loại trừ 1), sau đó có thể tỉ lệ lại thành khoảng mong muốn. Cách thức triển khai chọn hạt giống ban đầu cho thuật toán tạo số ngẫu nhiên, nó không thể được chọn hoặc thiết lập lại bởi người dùng. |

### Giá trị tuyệt đối

|     Phương thức    |           Mô tả           |
| :--------------- | :----------------------- |
| `Math.abs()`     | Trả về giá trị tuyệt đối của tham số. |

### Lũy thừa căn bậc

|          Phương thức         |                      Mô tả                       | Ví dụ |
| :------------------------- | :---------------------------------------------- | --- |
|    `Math.exp(num)`         | Trả về giá trị của $e^x$ (trong đó $x$ là tham số) | $e^x$ |
| `Math.pow(base, exponent)` | Trả về giá trị của cơ số (base) mũ số mũ (exponent) | $x^2$ |
|    `Math.log(num)`         | Trả về giá trị logarithm tự nhiên của một số     | $\log(x)$ |
|    `Math.sqrt(num)`        | Trả về căn bậc hai của một số                     | $\sqrt[2]{x}$ |

### Hàm lượng giác

| Phương thức              | Mô tả                                  |
|:------------------------ |:-------------------------------------- |
| `Math.sin(num)`          | Trả về giá trị sin của một số          |
| `Math.cos(num)`          | Trả về giá trị cos của một số          |
| `Math.tan(num)`          | Trả về giá trị tan của một số          |
| `Math.asin(num)`         | Trả về giá trị arcsin của một số       |
| `Math.acos(num)`         | Trả về giá trị arccos của một số       |
| `Math.atan(num)`         | Trả về giá trị arctan của một số       |
| `Math.atan2(num1, num2)` | Trả về giá trị arctan của tỷ lệ hai số |
