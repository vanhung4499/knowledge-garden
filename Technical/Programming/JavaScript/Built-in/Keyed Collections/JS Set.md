---
title: JS Set
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# Set

Đối tượng Set cho phép bạn lưu trữ các giá trị duy nhất của bất kỳ loại nào, bất kể là giá trị nguyên thủy hay tham chiếu đối tượng.

## Cú pháp

```js
new Set([iterable]);
```

### Tham số

| Tham số    | Mô tả                                                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------------------------------- |
| `iterable` | Nếu truyền vào một đối tượng có thể lặp lại, tất cả các phần tử của nó sẽ được thêm vào Set mới. Nếu không có tham số này, Set mới sẽ rỗng. |

### Mô tả

Khi thêm giá trị vào Set, không có chuyển đổi kiểu dữ liệu xảy ra, vì vậy `5` và `'5'` được coi là hai giá trị khác nhau. Set sử dụng thuật toán **Same-value equality** để xác định xem hai giá trị có bằng nhau hay không, nó tương tự như toán tử so sánh chính xác (`===`), nhưng khác biệt chính là `NaN` được coi là bằng chính nó, trong khi toán tử so sánh chính xác coi `NaN` không bằng chính nó.

## Đối tượng nguyên mẫu

### Thuộc tính

| Thuộc tính                   | Mô tả                                                                             |
| --------------------------- | -------------------------------------------------------------------------------- |
| `Set.prototype.constructor` | Hàm tạo ra đối tượng, mặc định là hàm Set.                                       |
| `Set.prototype.size`        | Trả về tổng số thành viên của đối tượng Set.                                     |

### Phương thức

Các phương thức của đối tượng Set được chia thành hai loại chính: phương thức thao tác (được sử dụng để thao tác dữ liệu) và phương thức duyệt (được sử dụng để duyệt qua các thành viên).

#### Phương thức tương tác

| Phương thức                          | Mô tả                                                                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `Set.prototype.add(value)`          | Được sử dụng để thêm một giá trị cụ thể vào cuối một đối tượng Set.                                                          |
| `Set.prototype.delete(value)`       | Được sử dụng để xóa một phần tử cụ thể khỏi một đối tượng Set.                                                               |
| `Set.prototype.has(value)`          | Trả về một giá trị boolean để chỉ ra xem giá trị `value` tương ứng có tồn tại trong đối tượng Set hay không.               |
| `Set.prototype.clear()`             | Xóa tất cả các phần tử trong một đối tượng Set.                                                                             |

#### Phương thức duyệt

| Phương thức                            | Mô tả                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Set.prototype.keys()`                | Tương tự như phương thức `values()`, trả về một đối tượng trình lặp mới chứa tất cả các giá trị của các phần tử trong đối tượng Set theo thứ tự chèn.                                                                                                                                                                                                                          |
| `Set.prototype.values()`              | Trả về một đối tượng trình lặp mới chứa tất cả các giá trị của các phần tử trong đối tượng Set theo thứ tự chèn.                                                                                                                                                                                                                                                              |
| `Set.prototype.entries()`             | Trả về một đối tượng trình lặp mới chứa các mục mới, trong đó mỗi mục là một mảng `[value, value]` tương tự nhau, trong đó `value` là mỗi phần tử của đối tượng Set. Mục đích của việc trả về một mảng `[value, value]` là để duy trì cấu trúc API tương tự với đối tượng Map, mặc dù trong trường hợp này, cả `key` và `value` đều có cùng giá trị. |
| `Set.prototype.forEach()`             | Dựa trên thứ tự các phần tử trong tập hợp, thực hiện một hàm gọi lại cho mỗi phần tử.                                                                                                                                                                                                                                                                                        |

Cần lưu ý rằng, thứ tự duyệt qua các phần tử của Set chính là **thứ tự chèn**. Đặc điểm này đôi khi rất hữu ích, ví dụ như sử dụng Set để lưu trữ một danh sách các hàm gọi lại, việc gọi lại sẽ được đảm bảo theo thứ tự đã thêm vào.

Phương thức `keys` và `values` trả về cùng một kết quả, đó là một trình lặp. Vì Set không có tên khóa, chỉ có giá trị (hoặc có thể nói tên khóa và giá trị là cùng một giá trị), nên hành vi của phương thức `keys` và `values` hoàn toàn giống nhau.

##### `Set.prototype.keys()`

Được sử dụng để lấy tất cả các giá trị của các phần tử trong đối tượng Set theo thứ tự chèn.

```js
let set = new Set(['x', 'y', 'z']);

for (let item of set.keys()) {
  console.log(item);
}
// Output: 'x'
// Output: 'y'
// Output: 'z'
```

##### `Set.prototype.values()`

Trả về một đối tượng trình lặp chứa tất cả các giá trị của các phần tử trong đối tượng Set theo thứ tự chèn.

```js
let set = new Set(['x', 'y', 'z']);

for (let item of set.values()) {
  console.log(item);
}
// Output: 'x'
// Output: 'y'
// Output: 'z'
```

##### `Set.prototype.entries()`

Phương thức `entries` trả về một đối tượng trình lặp mới, trong đó mỗi mục là một mảng `[value, value]` tương tự nhau, trong đó `value` là mỗi phần tử của đối tượng Set. Mục đích của việc trả về một mảng `[value, value]` là để duy trì cấu trúc API tương tự với đối tượng Map, mặc dù trong trường hợp này, cả `key` và `value` đều có cùng giá trị.

```js
let set = new Set(['x', 'y', 'z']);

for (let item of set.entries()) {
  console.log(item);
}
// Output: ["x", "x"]
// Output: ["y", "y"]
// Output: ["z", "z"]
```

Mặc định, đối tượng Set có thể được duyệt qua, và hàm tạo trình lặp mặc định của nó chính là phương thức `values`.

```js
console.log(Set.prototype[Symbol.iterator] === Set.prototype.values); // Output: true
```

Điều này có nghĩa là có thể bỏ qua phương thức `values` và trực tiếp sử dụng vòng lặp `for…of` để duyệt qua Set.

```js
let set = new Set(['x', 'y', 'z']);

for (let x of set) {
  console.log(x);
}
// Output: 'x'
// Output: 'y'
// Output: 'z'
```

##### `Set.prototype.forEach()`

Phương thức `forEach` của đối tượng Set được sử dụng để thực hiện một hàm gọi lại cho mỗi phần tử, không có giá trị trả về.

```js
let set = new Set([1, 2, 3]);

set.forEach((value, key) => console.log(value * 2));
// Output: 2
// Output: 4
// Output: 6
```

Đoạn mã trên cho thấy, tham số của phương thức `forEach` chính là một hàm xử lý. Các tham số của hàm này lần lượt là giá trị khóa, tên khóa và bộ sưu tập chính nó (trong ví dụ trên đã bỏ qua tham số này). Ngoài ra, phương thức `forEach` còn có thể có một tham số thứ hai để chỉ định đối tượng `this` được ràng buộc.

## Ví dụ

### Cú pháp cơ bản

```js
const s = new Set();

[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));

for (let i of s) {
  console.log(i);
}
// Output: 2 3 5 4
```

### Cơ chế kiểm tra nội bộ

**NaN bằng nhau**

Đoạn mã dưới đây thêm hai giá trị `NaN` vào một thể hiện của `Set`, nhưng thực tế chỉ có thể thêm một giá trị. Điều này cho thấy rằng trong `Set`, hai giá trị `NaN` được coi là bằng nhau.

```js
let set = new Set();

let a = NaN;
let b = NaN;

set.add(a);
set.add(b);

console.log(set); // Output: Set{NaN}
```

**Đối tượng không bằng nhau**

Đoạn mã dưới đây cho thấy rằng do hai đối tượng rỗng không bằng nhau, nên chúng được coi là hai giá trị riêng biệt.

```js
let set = new Set();

set.add({});
set.size; // Output: 1

set.add({});
set.size; // Output: 2
```

### Chuyển đổi sang mảng

Phương thức `Array.from` có thể chuyển đổi cấu trúc Set thành một mảng.

```js
const items = new Set([1, 2, 3, 4, 5]);
const array = Array.from(items);
```

### Loại bỏ các phần tử trùng lặp trong mảng

Điều này cung cấp một cách để loại bỏ các phần tử trùng lặp trong một mảng.

```js
const dedupe = array => Array.from(new Set(array));

dedupe([1, 1, 2, 3]); // [1, 2, 3]
```

### Ứng dụng của toán tử mở rộng

Toán tử mở rộng `…` sử dụng vòng lặp `for…of` bên trong, vì vậy nó cũng có thể được sử dụng với cấu trúc Set.

```js
let set = new Set(['red', 'green', 'blue']);

let arr = [...set];

console.log(arr); // Output: ['red', 'green', 'blue']
```

### Các phép hợp, giao và hiệu của tập hợp

Sử dụng Set, bạn có thể dễ dàng thực hiện các phép hợp (Union), giao (Interest) và hiệu (Difference).

```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// Hợp
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// Giao
let interest = new Set([...a].filter(x => b.has(x)));
// Set {2, 3}

// Hiệu
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}
```

### Thay đổi cấu trúc

Nếu bạn muốn thay đổi cấu trúc Set gốc trong quá trình lặp, hiện tại không có phương pháp trực tiếp, nhưng có hai phương pháp thay thế. Một là sử dụng cấu trúc Set gốc để tạo ra một cấu trúc mới, sau đó gán lại cho cấu trúc Set gốc; hai là sử dụng phương thức `Array.from`.

```js
// Phương pháp A
let s1 = new Set([1, 2, 3]);
s1 = new Set([...set].map(val => val * 2));

console.log(set); // Output: 2, 4, 6

// Phương pháp B
let s2 = new Set([1, 2, 3]);
s2 = new Set(Array.from(set, val => val * 2));

console.log(s2);
// Output: 2, 4, 6
```
