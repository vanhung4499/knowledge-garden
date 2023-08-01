---
title: JS Expressions
tags: [js, programming]
categories: [js, programming]
date created: 2023-07-31
date modified: 2023-07-31
---

## Literal

Giá trị chữ (Literal), còn được gọi là giá trị trực tiếp, đề cập đến các giá trị dữ liệu được sử dụng trực tiếp trong chương trình.

```js
// Giá trị Null trực tiếp
const n = null;

// Giá trị Undefined trực tiếp
const u = undefined;

// Giá trị Boolean trực tiếp
const b1 = true;
const b2 = false;

// Giá trị Number trực tiếp
const num = 1;
const nan = NaN;

// Giá trị String trực tiếp
const hello = 'xin chào';
const world = 'thế giới';

// Giá trị Regexp trực tiếp
const reg = /mẫu/;

// Giá trị Template Literal trực tiếp
const temp = `xin chào, ${world}`
```

## Biểu thức khởi tạo mảng

**Biểu thức khởi tạo mảng** là một cách tạo ra một mảng mới bằng cách sử dụng một cặp dấu ngoặc vuông và một danh sách các phần tử được phân tách bằng dấu phẩy. Kết quả của việc khởi tạo là một mảng mới được tạo ra.

### Phân tách bằng dấu phẩy

Các phần tử của mảng được phân tách bằng dấu phẩy và có giá trị là giá trị của biểu thức.

Mảng rỗng: `[]` nghĩa là mảng không có phần tử nào.

Mảng có hai phần tử: phần tử đầu tiên là 3, phần tử thứ hai là 7.

```js
[1 + 2, 3 + 4]
```

### Mảng lồng nhau

Các biểu thức khởi tạo mảng có thể chứa các biểu thức khởi tạo mảng khác. Điều này có nghĩa là các biểu thức này có thể được lồng nhau.

```js
var matrix = [[1, 2, 3],[4, 5, 6],[7, 8, 9]]
```

### Có thể bỏ qua phần tử

Các phần tử giữa các dấu phẩy trong mảng có thể được bỏ qua và các vị trí bị bỏ qua này sẽ được điền bằng giá trị không tồn tại.

```js
var sparseArray = [1, , , , 5]

// Tương đương với
// [1, empty x 3, 5]
```

Ở cuối danh sách phần tử của mảng, bạn có thể để lại một dấu phẩy đơn, trong trường hợp này, một giá trị `undefined` mới sẽ không được tạo ra.

```js
const arr = [1, 2, 3, ]

console.log(arr)
// [1, 2, 3]
````

### Gán giá trị theo chỉ mục

Khi gán giá trị cho một chỉ mục trong mảng, chỉ có vị trí chỉ mục được gán giá trị, các vị trí chỉ mục chưa được gán giá trị sẽ được coi là trống `empty`, không phải là `undefined`.

```js
let arr = [0, 1]

arr[10] = 10

console.log(arr);
// [0, 1, empty x 8, 10]

console.log(arr.length);
// 11

ary.filter(x => x === undefined);
// []
```

## Biểu thức khởi tạo đối tượng

Biểu thức khởi tạo đối tượng và biểu thức khởi tạo mảng thực tế là việc tạo ra một đối tượng hoặc một mảng mới. Những biểu thức khởi tạo này thường được gọi là **đối tượng trực tiếp** và **mảng trực tiếp**. Tuy nhiên, khác với giá trị trực tiếp của boolean, chúng không phải là biểu thức nguyên thủy vì chúng chứa các thành phần hoặc phần tử là các biểu thức con.

Biểu thức khởi tạo đối tượng và biểu thức khởi tạo mảng rất giống nhau, chỉ khác nhau ở chỗ dấu ngoặc vuông được thay thế bằng dấu ngoặc nhọn và mỗi biểu thức con bao gồm tên thuộc tính và dấu hai chấm là tiền tố.

```js
// Một đối tượng có hai thuộc tính thành viên
var p = {
  x: 2.3,
  y: -1.2,
};

// Một đối tượng rỗng
var q = {};

// Thuộc tính thành viên của q giống với p
q.x = 2.3;
q.y = -1.2;
```

Biểu thức khởi tạo đối tượng cũng có thể lồng nhau.

```js
var rectangle = {
  upperLeft: { x: 2, y: 2 },
  lowRight: { x: 4, y: 5 },
};
```

Khi tính giá trị của biểu thức khởi tạo đối tượng trong JavaScript, các biểu thức con trong biểu thức đối tượng cũng được tính toán và chúng không nhất thiết phải chứa giá trị hằng số: chúng có thể là bất kỳ biểu thức JavaScript nào.

Tương tự, tên thuộc tính trong biểu thức đối tượng có thể là một chuỗi thay vì một định danh (điều này hữu ích trong những trường hợp chỉ có thể sử dụng từ khóa bảo lưu hoặc một số định danh không hợp lệ làm tên thuộc tính).

```js
var side = 1;
var square = {
  upperLeft: {
    x: p.x,
    y: p.y,
  },
  lowerRight: {
    x: p.x + side,
    y: p.y + side,
  },
};
```

## Truy cập thuộc tính

Biểu thức truy cập thuộc tính được sử dụng để truy cập giá trị của một thuộc tính của đối tượng hoặc một phần tử của mảng.

JavaScript định nghĩa hai cú pháp cho việc truy cập thuộc tính.

### Cú pháp

- Cú pháp đầu tiên là một biểu thức theo sau là một dấu chấm và một từ khóa. Biểu thức xác định đối tượng và từ khóa xác định tên của thuộc tính cần truy cập.

```js
expression.identifier
```

- Cú pháp thứ hai sử dụng dấu ngoặc vuông, trong dấu ngoặc vuông là một biểu thức khác (cú pháp này áp dụng cho cả đối tượng và mảng). Biểu thức thứ hai xác định tên của thuộc tính cần truy cập hoặc chỉ mục của phần tử mảng cần truy cập.

```js
expression[expression]
```

Dù sử dụng cú pháp truy cập thuộc tính nào, biểu thức trước dấu chấm và dấu ngoặc vuông luôn được tính toán trước.

- Nếu kết quả tính toán là `null` hoặc `undefined`, biểu thức sẽ gây ra một lỗi loại không hợp lệ, vì hai giá trị này không thể chứa bất kỳ thuộc tính nào.
- Nếu kết quả tính toán không phải là một đối tượng, JavaScript sẽ chuyển đổi nó thành một đối tượng.
- Nếu biểu thức đứng trước dấu chấm và dấu ngoặc vuông được theo sau bởi một từ khóa, nó sẽ tìm kiếm giá trị của thuộc tính được chỉ định bởi từ khóa đó và trả về nó làm giá trị của toàn bộ biểu thức.
- Nếu biểu thức đứng trước dấu chấm và dấu ngoặc vuông được theo sau bởi một cặp dấu ngoặc vuông, nó sẽ tính toán giá trị của biểu thức trong dấu ngoặc vuông và chuyển đổi nó thành một chuỗi.

Dù trong trường hợp nào, nếu thuộc tính được truy cập không tồn tại, giá trị của biểu thức truy cập thuộc tính sẽ là `undefined`.

### Ví dụ

```js
var a = {x: 1, y: {z: 3}};
// Một đối tượng ví dụ

var b = [a, 4, [5, 6]];
// Một mảng ví dụ chứa đối tượng trên

console.log(a.x);
// 1

console.log(a.y.z);
// 3

console.log(a["x"]);
// 1

console.log(b[1]);
// 4

console.log(b[2]["1"]);
// 6

console.log(b[0].x);
// 1
```
