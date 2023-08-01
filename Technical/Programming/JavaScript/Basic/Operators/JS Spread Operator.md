---
title: JS Spread Operator
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Toán tử mở rộng (Spread Operator)

Toán tử mở rộng cho phép một biểu thức được mở rộng thành nhiều đối số (trong trường hợp gọi hàm), nhiều phần tử (trong trường hợp mảng chữ), hoặc nhiều biến (trong trường hợp gán giá trị).

## Cú pháp

### Gọi hàm

```js
myFunction(...iterableObj);
```

### Mảng chữ hoặc chuỗi

```js
[...iterableObj, '4', 'five', 6];
```

### Đối tượng literal

```js
let iterableObj = { ...obj };
```

Toán tử mở rộng cho phép một biểu thức được mở rộng thành nhiều phần tử riêng lẻ. Khi sử dụng toán tử mở rộng trong gọi hàm, các phần tử của một mảng hoặc một chuỗi sẽ được truyền vào như là các đối số riêng lẻ của hàm. Khi sử dụng toán tử mở rộng trong mảng chữ hoặc chuỗi, các phần tử của một mảng hoặc một chuỗi sẽ được mở rộng thành các phần tử riêng lẻ. Khi sử dụng toán tử mở rộng trong đối tượng chữ, các thuộc tính của một đối tượng sẽ được mở rộng thành các thuộc tính riêng lẻ của một đối tượng mới.

Ví dụ:

```js
function sum(a, b, c) {
  return a + b + c;
}

const numbers = [1, 2, 3];

console.log(sum(...numbers));
// 6

const str = 'hello';

console.log([...str]);
// ['h', 'e', 'l', 'l', 'o']

const obj = { x: 1, y: 2 };

const newObj = { ...obj, z: 3 };

console.log(newObj);
// { x: 1, y: 2, z: 3 }
```

Toán tử mở rộng rất hữu ích khi bạn muốn mở rộng một mảng, một chuỗi hoặc một đối tượng thành các phần tử riêng lẻ hoặc các thuộc tính riêng lẻ. Nó giúp bạn viết mã ngắn gọn và dễ đọc hơn.

# Ứng dụng

### Ứng dụng trong hàm

#### Thay thế cho phương thức `apply` của mảng

Khi chúng ta có một hàm với nhiều biến (đặc biệt là khi chúng ta không biết số lượng biến), đôi khi chúng ta sẽ lưu trữ các biến đó trong một mảng và sử dụng phương thức `apply` để thực thi hàm. Với toán tử mở rộng, chúng ta có một cách tiện lợi hơn (vì việc sử dụng `apply` đòi hỏi phải xác định `this` thủ công, đôi khi không tiện và chính xác).

```js
// ES5
function myFunction(x, y, z) {}
var args = [0, 1, 2];
myFunction.apply(null, args);

// ES6
function myFunction(x, y, z) {}
var args = [0, 1, 2];
myFunction(...args);
```

Cả danh sách tham số và các tham số đều có thể sử dụng cú pháp mở rộng, và có thể sử dụng nhiều lần.

```js
function myFunction(v, w, x, y, z) {}
var args = [0, 1];
myFunction(-1, ...args, 2, ...[3]);
```

#### Giá trị trả về của hàm

Hàm trong JavaScript chỉ có thể trả về một giá trị, nếu cần trả về nhiều giá trị, chỉ có thể trả về một mảng hoặc một đối tượng. Toán tử mở rộng cung cấp một cách giải quyết tạm thời cho vấn đề này.

```js
var dateFields = readDateFields(database);
var d = new Date(...dateFields);
```

Đoạn mã trên lấy một hàng dữ liệu từ cơ sở dữ liệu và sử dụng toán tử mở rộng để truyền trực tiếp vào hàm tạo Date.

### Ứng dụng trong mảng

#### Gộp mảng

Toán tử mở rộng cung cấp cách viết mới để gộp mảng.

```js
// ES5
[1, 2].concat(more)
// ES6
[1, 2, ...more]

var arr1 = ['a', 'b'];
var arr2 = ['c'];
var arr3 = ['d', 'e'];

// Gộp mảng theo cách của ES5
arr1.concat(arr2, arr3);
// ['a', 'b', 'c', 'd', 'e']

// Gộp mảng theo cách của ES6
[...arr1, ...arr2, ...arr3]
// ['a', 'b', 'c', 'd', 'e']
```

#### Sao chép mảng

Chỉ áp dụng sao chép các phần tử của mảng cho các kiểu dữ liệu cơ bản.

```js
let a = [1, 2, 3];
let b = [...a];
```

#### Kết hợp với gán giá trị

Toán tử mở rộng có thể kết hợp với việc gán giá trị cho mảng.

```js
let [first, ...rest] = [1, 2, 3, 4, 5];
console.log(first);
// 1
console.log(rest);
// [2, 3, 4, 5]

let [first, ...rest] = [];
console.log(first);
// undefined
console.log(rest);
// []

let [first, ...rest] = ['foo'];
console.log(first);
// 'foo'
console.log(rest);
// []
```

Nếu sử dụng toán tử mở rộng trong việc gán giá trị cho mảng, nó chỉ có thể được đặt ở vị trí **cuối cùng** của danh sách tham số, nếu không sẽ gây lỗi.

```js
let [...butLast, last] = [1, 2, 3, 4, 5]
// Lỗi

let [first, ...middle, last] = [1, 2, 3, 4, 5];
// Lỗi
```

### Ứng dụng trong chuỗi

Toán tử mở rộng cũng có thể chuyển đổi chuỗi thành một mảng thực sự.

```js
[...'hello'];
// ['h', 'e', 'l', 'l', 'o']
```

Cách viết trên có một lợi ích quan trọng: có thể nhận dạng đúng các ký tự Unicode 32-bit.

```js
'x\uD83D\uDE80y'.length			// 4
[...'x\uD83D\uDE80y'].length	// 3
```

Trong cách viết đầu tiên, JavaScript sẽ nhận dạng ký tự Unicode 32-bit là 2 ký tự, trong khi sử dụng toán tử mở rộng thì không có vấn đề này. Do đó, hàm trả về độ dài chuỗi chính xác có thể được viết như sau.

```js
function length(str) {
  return [...str].length;
}

length('x\uD83D\uDE80y'); // 3
```

Bất kỳ hàm nào liên quan đến các ký tự Unicode 32-bit cũng có vấn đề này. Do đó, tốt nhất là sử dụng toán tử mở rộng để viết lại chúng.

```js
let str = 'x\uD83D\uDE80y';

str.split('').reverse().join('')
// 'y\uDE80\uD83Dx'

[...str].reverse().join('')
// 'y\uD83D\uDE80x'
```

Trong đoạn mã trên, nếu không sử dụng toán tử mở rộng, phép đảo ngược chuỗi sẽ không chính xác.

### Đối tượng triển khai giao diện Iterator

Bất kỳ đối tượng nào triển khai giao diện Iterator cũng có thể được chuyển đổi thành một mảng thực sự bằng toán tử mở rộng.

```js
var nodeList = document.querySelectorAll('div');
var array = [...nodeList];
```

Trong đoạn mã trên, phương thức `querySelectorAll` trả về một đối tượng `nodeList`. Nó không phải là một mảng, mà là một đối tượng giống mảng. Trong trường hợp này, toán tử mở rộng có thể chuyển đổi nó thành một mảng thực sự, vì đối tượng `nodeList` triển khai giao diện Iterator.

Đối với những đối tượng giống mảng không triển khai giao diện Iterator, toán tử mở rộng sẽ không thể chuyển đổi chúng thành một mảng thực sự.

```js
let arrayLike = {
  '0': 'a',
  '1': 'b',
  '2': 'c',
  length: 3,
};

// TypeError: Cannot spread non-iterable object.
let arr = [...arrayLike];
```

Trong đoạn mã trên, `arrayLike` là một đối tượng giống mảng, nhưng không triển khai giao diện Iterator, do đó toán tử mở rộng sẽ báo lỗi. Trong trường hợp này, bạn có thể sử dụng phương thức `Array.from` để chuyển đổi `arrayLike` thành một mảng thực sự.

### Cấu trúc `Map` và `Set`, hàm `Generator`

Toán tử mở rộng gọi giao diện Iterator của cấu trúc dữ liệu bên trong, do đó bất kỳ đối tượng nào triển khai giao diện Iterator đều có thể sử dụng toán tử mở rộng, chẳng hạn như cấu trúc `Map`.

```js
let map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

let arr = [...map.keys()]; // [1, 2, 3]
```

Hàm `Generator` khi chạy sẽ trả về một đối tượng lặp, do đó cũng có thể sử dụng toán tử mở rộng.

```js
var go = function*() {
  yield 1;
  yield 2;
  yield 3;
};

[...go()]; // [1, 2, 3]
```

Trong đoạn mã trên, biến `go` là một hàm `Generator`, khi thực thi sẽ trả về một đối tượng lặp, toán tử mở rộng sẽ chuyển đổi các giá trị được lặp lại bên trong thành một mảng.

```js
var obj = { a: 1, b: 2 };
let arr = [...obj]; // TypeError: Cannot spread non-iterable object
```

Trong đoạn mã trên, `obj` là một đối tượng không triển khai giao diện Iterator, do đó toán tử mở rộng sẽ không thể chuyển đổi nó thành một mảng thực sự.
