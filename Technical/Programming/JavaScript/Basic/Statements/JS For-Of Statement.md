---
title: JS For-Of Statement
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Vòng lặp `for…of`

**Vòng lặp `for…of`** tạo một vòng lặp lặp qua các đối tượng có thể lặp (bao gồm `Array`, `Map`, `Set`, `String`, `TypedArray`, đối tượng `arguments`, v.v.), gọi các hàm lặp tùy chỉnh và thực hiện câu lệnh cho mỗi giá trị thuộc tính khác nhau.

## Cú pháp

```js
for (variable of iterable) {
  // câu lệnh
}
```

### Tham số

| Tham số    | Mô tả                                                       |
| ---------- | ---------------------------------------------------------- |
| `variable` | Gán giá trị của các thuộc tính khác nhau cho biến trong mỗi lần lặp |
| `iterable` | Đối tượng được lặp qua các thuộc tính của nó                 |

## Ví dụ

### Lặp qua `Array`

```js
let iterable = [10, 20, 30];

for (let value of iterable) {
  value += 1;
  console.log(value);
}
// 11
// 21
// 31
```

Nếu bạn không muốn thay đổi biến trong khối lệnh, bạn cũng có thể sử dụng `const` thay vì `let`.

```js
let iterable = [10, 20, 30];

for (const value of iterable) {
  console.log(value);
}
// 10
// 20
// 30
```

### Lặp qua `String`

```js
let iterable = 'boo';

for (let value of iterable) {
  console.log(value);
}
// "b"
// "o"
// "o"
```

### Lặp qua `TypedArray`

```js
let iterable = new Uint8Array([0x00, 0xff]);

for (let value of iterable) {
  console.log(value);
}
// 0
// 255
```

### Lặp qua `Map`

```js
let iterable = new Map([["a", 1], ["b", 2], ["c", 3]]);

for (let entry of iterable) {
  console.log(entry);
}
// ["a", 1]
// ["b", 2]
// ["c", 3]

for (let [key, value] of iterable) {
  console.log(value);
}
// 1
// 2
// 3
```

### Lặp qua `Set`

```js
let iterable = new Set([1, 1, 2, 2, 3, 3]);

for (let value of iterable) {
  console.log(value);
}
// 1
// 2
// 3
```

### Lặp qua đối tượng `arguments`

```js
(function() {
  for (let argument of arguments) {
    console.log(argument);
  }
})(1, 2, 3);

// 1
// 2
// 3
```

### Lặp qua tập hợp DOM

Lặp qua tập hợp các phần tử DOM, ví dụ như một đối tượng `NodeList`: Ví dụ dưới đây cho thấy cách thêm lớp "`read`" vào mỗi thẻ p trong thẻ article.

```js
//Lưu ý: Điều này chỉ hoạt động trên các nền tảng đã triển khai NodeList.prototype[Symbol.iterator]
let articleParagraphs = document.querySelectorAll("article > p");

for (let paragraph of articleParagraphs) {
  paragraph.classList.add("read");
}
```

### Đóng iterator

Vòng lặp `for…of` có thể được kết thúc bằng `break`, `continue[4]`, `throw` hoặc `return[5]`. Trong những trường hợp này, iterator sẽ bị đóng.

```js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
}

for (let o of foo()) {
  console.log(o);
  break; // đóng iterator, kích hoạt return
}
```

### Lặp qua generator

Bạn cũng có thể lặp qua một generator:

```js
function* fibonacci() { // một generator function
    let [prev, curr] = [0, 1];
    for (;;) { // while (true) {
        [prev, curr] = [curr, prev + curr];
        yield curr;
    }
}

for (let n of fibonacci()) {
     console.log(n);
    // Khi n lớn hơn hoặc bằng 1000, thoát khỏi vòng lặp
    if (n >= 1000)
        break;
}
```

#### Không nên tái sử dụng generator

Generator không nên được tái sử dụng, ngay cả khi vòng lặp `for…of` được kết thúc sớm, ví dụ bằng từ khóa `break`. Sau khi thoát khỏi vòng lặp, generator sẽ bị đóng và không tạo ra bất kỳ kết quả nào nữa.

```js
var gen = (function*() {
  yield 1;
  yield 2;
  yield 3;
})();
for (let o of gen) {
  console.log(o);
  break; // đóng generator
}

// Generator không nên tái sử dụng, không có ý nghĩa ở đây!
for (let o of gen) {
  console.log(o);
}
```

### Lặp qua các đối tượng có thể lặp khác

Bạn cũng có thể lặp qua các đối tượng đã được thực hiện rõ ràng giao thức có thể lặp:

```js
var iterable = {
  [Symbol.iterator]() {
    return {
      i: 0,
      next() {
        if (this.i < 3) {
          return { value: this.i++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

for (var value of iterable) {
  console.log(value);
}
// 0
// 1
// 2
```

### Sự khác biệt giữa `for…in` và `for…of`

Cả `for…in` và `for…of` đều được sử dụng để lặp qua một cái gì đó. Sự khác biệt chính giữa chúng là cách lặp.

Câu lệnh `for…in` lặp qua các thuộc tính có thể liệt kê của đối tượng theo thứ tự chèn ban đầu.

Câu lệnh `for…of` lặp qua các giá trị được xác định để lặp qua trong đối tượng có thể lặp.

Các ví dụ sau đây cho thấy sự khác biệt giữa vòng lặp `for…of` và vòng lặp `for…in` khi được sử dụng với một mảng.

```js
Object.prototype.objCustom = function() {};
Array.prototype.arrCustom = function() {};

let iterable = [3, 5, 7];
iterable.foo = 'hello';

for (let i in iterable) {
  console.log(i); // logs 0, 1, 2, "foo", "arrCustom", "objCustom"
}

for (let i in iterable) {
  if (iterable.hasOwnProperty(i)) {
    console.log(i); // logs 0, 1, 2, "foo"
  }
}

for (let i of iterable) {
  console.log(i); // logs 3, 5, 7
}
```

```js
Object.prototype.objCustom = function() {};
Array.prototype.arrCustom = function() {};

let iterable = [3, 5, 7];
iterable.foo = 'hello';
```

Mỗi đối tượng sẽ kế thừa thuộc tính `objCustom` và mỗi đối tượng mảng sẽ kế thừa thuộc tính `arrCustom` vì chúng được thêm vào `Object.prototype` và `Array.prototype`. Do kế thừa và chuỗi nguyên mẫu, đối tượng `iterable` kế thừa thuộc tính `objCustom` và `arrCustom`.

```js
for (let i in iterable) {
  console.log(i); // logs 0, 1, 2, "foo", "arrCustom", "objCustom"
}
```

Vòng lặp này chỉ ghi lại các thuộc tính có thể liệt kê của đối tượng `iterable` theo thứ tự chèn ban đầu. Nó không ghi lại các phần tử mảng `3`, `5`, `7` hoặc `hello` vì chúng **không phải** là các thuộc tính có thể liệt kê. Nhưng nó ghi lại các chỉ số mảng và `arrCustom` và `objCustom`. Nếu bạn không hiểu tại sao các thuộc tính này được lặp lại, hãy xem thêm giải thích trong bài viết "Lặp qua mảng và vòng lặp `for…in`".

```js
for (let i in iterable) {
  if (iterable.hasOwnProperty(i)) {
    console.log(i); // logs 0, 1, 2, "foo"
  }
}
```

Vòng lặp này tương tự như vòng lặp trước, nhưng nó sử dụng `hasOwnProperty()` để kiểm tra xem thuộc tính liệt kê tìm thấy có thuộc sở hữu của chính đối tượng hay không (không phải là kế thừa). Nếu có, thuộc tính đó được ghi lại. Các thuộc tính được ghi lại là `0`, `1`, `2` và `foo` vì chúng là thuộc tính riêng của đối tượng (không phải là kế thừa). Thuộc tính `arrCustom` và `objCustom` không được ghi lại vì chúng **được kế thừa**.

```js
for (let i of iterable) {
  console.log(i); // logs 3, 5, 7
}
```

Vòng lặp này lặp qua và ghi lại các giá trị được xác định để lặp qua trong đối tượng có thể lặp `iterable`, đó là các phần tử mảng `3`, `5`, `7`, chứ không phải là bất kỳ thuộc tính của đối tượng nào.
