---
title: JS Object Type
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-06
---

# Kiểu đối tượng - Object

Các kiểu dữ liệu cơ bản trong JavaScript bao gồm `Undefined`, `Null`, `Boolean`, `String`, `Number` và `Object`, cùng với kiểu `Symbol` được thêm vào từ ES6.

Đối tượng khác biệt với các giá trị kiểu cơ bản bởi nó là một giá trị phức tạp: nó có thể kết hợp nhiều giá trị nguyên thủy hoặc đối tượng khác vào một chỗ, và có thể truy cập vào các giá trị này bằng tên khóa.

Một đối tượng cũng có thể được coi là một **tập hợp không tuần tự** các thuộc tính, mỗi thuộc tính là một cặp khóa-giá trị. Tên thuộc tính có thể là kiểu `String` hoặc kiểu `Symbol`, do đó chúng ta có thể coi đối tượng là một ánh xạ từ chuỗi đến giá trị.

## Tạo đối tượng

**Cách tạo đối tượng:**

- Literal
- Hàm tạo
- `Object.create()`

### Literal

JavaScript cung cấp một phương thức nhanh gọi là "literal" để tạo ra hầu hết các giá trị đối tượng nguyên thuỷ. Việc sử dụng literal chỉ là ẩn đi quy trình cơ bản giống như việc sử dụng toán tử `new`, do đó nó cũng được gọi là đường dẫn cú pháp.

Literal là một bảng ánh xạ gồm nhiều cặp khóa-giá trị, các cặp khóa-giá trị được phân tách bằng dấu hai chấm và toàn bộ bảng ánh xạ được bao quanh bởi dấu ngoặc nhọn.

Các thuộc tính khác nhau được phân tách bằng dấu phẩy, tên thuộc tính có thể là bất kỳ giá trị kiểu `String` hoặc kiểu `Symbol` nào, giá trị thuộc tính có thể là bất kỳ biểu thức kiểu nào, giá trị của biểu thức là giá trị thuộc tính.

```js
const faker = {
  name : 'faker',
  age : 27,
  5 : true
}
```

**Đối tượng chuyển đổi thành chuỗi ký tự**: Sử dụng phương thức đối tượng từ chỗ khai báo đối tượng, tên thuộc tính sẽ tự động chuyển đổi thành chuỗi.

```js
const faker = {
  'name' : 'faker',
  'age' : 27,
  '5' : true,
}
```

### Hàm tạo

Sử dụng toán tử `new` và hàm tạo `Object` để khởi tạo một đối tượng mới. [[JS This#Ràng buộc hàm tạo|Ràng buộc hàm tạo]]

```js
let faker = new Object();

uzi.name = 'Faker';
uzi.age = 27;
```

#### Tham số là một đối tượng

Nếu tham số là một đối tượng, thì đối tượng đó sẽ được trả về trực tiếp.

Tham số là một đối tượng:

```js
let foo = { a: 1 }

let bar = new Object(foo)

console.log(foo === bar)
// true
```

Tham số là một hàm (đối tượng):

```js
let foo = function(){}

let bar = new Object(foo)

console.log(foo === bar)
// true
```

#### Tham số là một kiểu nguyên thủy

Nếu tham số là một giá trị nguyên thủy, thì một đối tượng bao bọc tương ứng sẽ được trả về.

```js
console.log(new Object('foo'))
// String {0: "f", 1: "o", 2: "o", length: 3, [[PrimitiveValue]]: "foo"}

console.log(new Object(1))
// Number {[[PrimitiveValue]]: 1}

console.log(new Object(true))
// Boolean {[[PrimitiveValue]]: true}
```

### `Object.create()`

Phương thức `Object.create()` được sử dụng để tạo một đối tượng mới với đối tượng đã cho làm đối tượng nguyên mẫu.

📖 **Cú pháp**

```js
Object.create(proto, properties)
```

<br />

| Tham số     | Mô tả                                                         | Kiểu dữ liệu |
| :---------- | :------------------------------------------------------------ | :---------- |
| proto       | Đối tượng nguyên mẫu mà đối tượng mới sẽ trỏ đến               | object      |
| properties  | Tham số tùy chọn. Các thuộc tính có thể liệt kê được thêm vào đối tượng mới (các thuộc tính được định nghĩa trực tiếp trên đối tượng, không phải trên chuỗi nguyên mẫu) | object      |

```js
const object = Object.create(proto, properties)
// object kế thừa các thuộc tính x và y

console.log(object.x);
// 1
```

Có thể sử dụng tham số `null` để tạo một đối tượng mới không có nguyên mẫu, nhưng đối tượng được tạo ra theo cách này sẽ không kế thừa bất kỳ thứ gì, thậm chí không bao gồm các phương thức cơ bản như `toString` và `valueOf`.

Kế thừa đối tượng:

```js
const foo = {}
console.log(Number(foo));
// NaN
```

Không kế thừa bất kỳ thuộc tính và phương thức nào:

```js
const bar = Object.create(null);
// bar không kế thừa bất kỳ thuộc tính và phương thức nào
console.log(Number(bar));
// Uncaught TypeError: Cannot convert object to primitive value
```

Nếu muốn tạo một đối tượng rỗng thông thường (như đối tượng được tạo bằng `{}` hoặc `new Object()`), cần truyền vào `Object.prototype`.

```js
// Ví dụ 1
const foo = {};
console.log(Number(foo))
// NaN

// Ví dụ 2
const bar = Object.create(Object.prototype);
// bar giống với {} và new Object()
console.log( Number(bar) );
// NaN
```

Tham số thứ hai của phương thức `Object.create()` là các mô tả thuộc tính.

```js
const obj = Object.create({ z:3 }, {
  x:{
    value:1,
    writable: false,
    enumerable:true,
    configurable:true
  },
  y:{
    value:2,
    writable: false,
    enumerable:true,
    configurable:true
  }
})

console.log(obj.x, obj.y, obj.z);
// 1 2 3
```

## Cấu thành của đối tượng

Đối tượng là một tập hợp không tuần tự các thuộc tính, bao gồm **tên thuộc tính** và **giá trị thuộc tính**.

### Tên thuộc tính

Tất cả các tên thuộc tính của đối tượng đều là chuỗi, vì vậy có thể có hoặc không có dấu nháy đơn hoặc dấu nháy kép. Nếu không phải là chuỗi, tên thuộc tính sẽ tự động chuyển đổi thành chuỗi.

```js
const foo = { name: 'bar', 123: 'car'}
```

### Giá trị thuộc tính

Giá trị thuộc tính có thể là bất kỳ biểu thức nào, kết quả cuối cùng của biểu thức sẽ là giá trị thuộc tính.

Nếu giá trị thuộc tính là một hàm, thì thuộc tính đó thường được gọi là "phương thức".

```js
const foo = {
  run: function (x) {
    return 2 * x;
  }
}

foo.run(1);
// 2
```

Vì phương thức của đối tượng là một hàm, nên nó cũng có thuộc tính `name`. Thuộc tính `name` của phương thức trả về tên của hàm ngay sau từ khóa `function`. Nếu là hàm vô danh, môi trường ES5 sẽ trả về `undefined`, môi trường ES6 sẽ trả về tên phương thức.

```js
const foo = {
  mth1: function f() {},
  mth2: function () {}
}

foo.mth1.name;
// "f"

foo.mth2.name;
// ES5: undefined

foo.mth2.name;
// ES6: "m2"
```

## Tham chiếu đến đối tượng

Nếu các biến khác nhau trỏ đến cùng một đối tượng, chúng đều là tham chiếu của đối tượng đó, có nghĩa là chúng đều trỏ đến cùng một địa chỉ bộ nhớ. Thay đổi một biến sẽ ảnh hưởng đến tất cả các biến khác.

```js
let foo = {};
let bar = foo;

foo.a = 1;
console.log(bar.a);
// 1

bar.b = 2;
console.log(foo.b);
// 2
```

Nếu hủy tham chiếu của một biến đến đối tượng gốc, điều này sẽ không ảnh hưởng đến biến khác.

```js
let foo = {};
let bar = foo;

foo = 1;
console.log(bar);
// {}
```
