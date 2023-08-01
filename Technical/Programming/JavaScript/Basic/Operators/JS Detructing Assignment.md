---
title: JS Detructing Assignment
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Gán giá trị theo mẫu

Cú pháp gán giá trị theo mẫu (Destructuring) là một biểu thức JavaScript, cho phép trích xuất giá trị từ một mảng hoặc thuộc tính từ một đối tượng và gán cho các biến khác nhau.

## Gán giá trị từ mảng

```js
var foo = [];

// Không sử dụng gán giá trị theo mẫu
var one = foo[0];
var two = foo[1];
var three = foo[2];

// Sử dụng gán giá trị theo mẫu
var [one, two, three] = foo;
```

Mã trên cho thấy, có thể trích xuất giá trị từ một mảng và gán cho các biến tương ứng theo vị trí.

Thực chất, cách viết này thuộc về **khớp mẫu** (pattern matching), chỉ cần hai bên của dấu bằng có cùng mẫu, các biến bên trái sẽ được gán giá trị tương ứng.

### Cú pháp cơ bản

Dưới đây là một số ví dụ sử dụng khớp mẫu với mảng lồng nhau.

```js
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo; // 1
bar; // 2
baz; // 3

let [, , third] = ['foo', 'bar', 'baz'];
third; // "baz"

let [x, y] = [1, 2, 3];
x; // 1
y; // 2

let [head, ...tail] = [1, 2, 3, 4];
head; // 1
tail; // [2, 3, 4]

let [x, y, ...z] = ['a'];
x; // "a"
y; // undefined
z; // []
```

#### Gán giá trị không thành công

Nếu không gán giá trị thành công, giá trị của biến sẽ là `undefined`.

```js
let [foo] = [];
let [bar, foo] = [1];
```

#### Gán giá trị không hoàn chỉnh

Nghĩa là mẫu bên trái của dấu bằng chỉ khớp một phần của mảng bên phải.

```js
let [x, y] = [1, 2, 3];
x; // 1
y; // 2

let [a, [b], d] = [1, [2, 3], 4];
a; // 1
b; // 2
d; // 4
```

- Nếu bên phải dấu bằng không phải là một mảng (hoặc chính xác hơn là một cấu trúc không thể lặp), sẽ có lỗi.

### Giá trị mặc định

Gán giá trị theo mẫu cho phép chỉ định giá trị mặc định.

```js
let [foo = true] = [];
foo; // true

let [x, y = 'b'] = ['a']; // x = 'a', y = 'b'
let [x, y = 'b'] = ['a', undefined]; // x = 'a', y = 'b'
```

ES6 sử dụng toán tử so sánh nghiêm ngặt (` === `) để kiểm tra một vị trí có giá trị hay không. Do đó, nếu một thành viên của mảng không nghiêm ngặt bằng `undefined`, giá trị mặc định sẽ không được áp dụng.

```js
let [x = 1] = [undefined];
x; // 1

let [x = 1] = [null];
x; // null
```

Trong ví dụ trên, nếu thành viên của mảng là `null`, giá trị mặc định sẽ không được áp dụng, vì `null` không nghiêm ngặt bằng `undefined`.

Nếu giá trị mặc định là một biểu thức, biểu thức đó sẽ được tính toán lười biếng, tức chỉ khi nào cần sử dụng thì mới tính toán.

```js
function f() {
  console.log('aaa');
}
let [x = f()] = [1];
```

Trong ví dụ trên, vì `x` có thể lấy giá trị, nên hàm `f` không được thực thi. Thực tế, đoạn mã trên tương đương với đoạn mã dưới đây.

```js
let x;
if ([1][0] === undefined) {
  x = f();
} else {
  x = [1][0];
}
```

Giá trị mặc định có thể tham chiếu đến các biến khác trong gán giá trị theo mẫu, nhưng biến đó phải đã được khai báo.

```js
let [x = 1, y = x] = []; // x = 1, y = 1
let [x = 1, y = x] = [2]; // x = 2, y = 2
let [x = 1, y = x] = [1, 2]; // x = 1, y = 2
let [x = y, y = 1] = []; // ReferenceError
```

Ví dụ cuối cùng báo lỗi vì khi `x` sử dụng giá trị mặc định `y`, `y` chưa được khai báo.

## Gán giá trị theo mẫu cho đối tượng

Gán giá trị theo mẫu không chỉ áp dụng cho mảng mà còn áp dụng cho đối tượng.

```js
let { foo, bar } = { foo: 'aaa', bar: 'bbb' };
foo; // 'aaa'
bar; // 'bbb'
```

Gán giá trị theo mẫu cho đối tượng có một điểm khác biệt quan trọng so với mảng. Các phần tử trong mảng được sắp xếp theo thứ tự và giá trị của biến được xác định bởi vị trí của nó; trong khi các thuộc tính của đối tượng không có thứ tự, **biến phải có cùng tên với thuộc tính** để lấy giá trị đúng.

```js
let { bar, foo } = { foo: 'aaa', bar: 'bbb' };
foo; // 'aaa'
bar; // 'bbb'

let { baz } = { foo: 'aaa', bar: 'bbb' };
baz; // undefined
```

Trong ví dụ đầu tiên, thứ tự hai biến bên trái của dấu bằng không khớp với thứ tự hai thuộc tính cùng tên bên phải, nhưng không ảnh hưởng đến việc lấy giá trị. Ví dụ thứ hai, biến không có thuộc tính tương ứng, dẫn đến không lấy được giá trị, kết quả là `undefined`.

Nếu tên biến không trùng với tên thuộc tính, phải viết như sau.

```js
var { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz; // 'aaa'

let obj = { first: 'hello', last: 'world' };
let { first: f, last: l } = obj;
f; // 'hello'
l; // 'world'
```

Thực tế, điều này chỉ là một cách viết tắt của gán giá trị theo mẫu cho đối tượng.

```js
let { foo: foo, bar: bar } = { foo: 'aaa', bar: 'bbb' };
```

Điều này có nghĩa là cơ chế gán giá trị theo mẫu cho đối tượng là tìm kiếm **thuộc tính cùng tên**, sau đó gán giá trị cho **biến tương ứng**. Thực tế, giá trị được gán là biến `baz`, không phải là mẫu `foo`.

```js
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz; // 'aaa'
foo; // error: foo is not defined
```

Mã trên, `foo` là mẫu khớp, `baz` mới là biến. Giá trị thực sự được gán là biến `baz`, không phải là mẫu `foo`.

Giống như mảng, việc gán giá trị theo mẫu cũng có thể được sử dụng cho đối tượng lồng nhau.

```js
let obj = {
  p: ['Hello', { y: 'World' }],
};

let {
  p: [x, { y }],
} = obj;
x; // 'Hello'
y; // 'World'
```

Lưu ý rằng `p` là mẫu, không phải là biến, do đó không được gán giá trị. Nếu muốn `p` cũng được gán giá trị, có thể viết như sau.

```js
let obj = {
  p: ['Hello', { y: 'World' }],
};

let {
  p,
  p: [x, { y }],
} = obj;
x; // 'Hello'
y; // 'World'
p; // ['Hello', { y: 'World'}]
```

Dưới đây là một ví dụ khác:

```js
var node = {
  loc: {
    start: {
      line: 1,
      column: 5,
    },
  },
};

var {
  loc,
  loc: { start },
  loc: {
    start: { line },
  },
} = node;
line; // 1

loc; // Object { start: Object }
start; // Object { line: 1, column: 5}
```

Đoạn code trên có ba lần gán giá trị thông qua việc giải nén, lần lượt là `loc`, `start` và `line`. Cần lưu ý rằng, trong phần gán giá trị cuối cùng cho thuộc tính `line`, chỉ có `line` là biến, còn `loc` và `start` đều là mẫu, không phải là biến.

Dưới đây là một ví dụ về gán giá trị lồng nhau.

```js
let obj = {};
let arr = [];
({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });

obj; // { prop: 123 }
arr; // [true]
```

Việc giải nén đối tượng cũng có thể chỉ định giá trị mặc định.

```js
var { x = 3 } = {};
x; // 3

var { x, y = 5 } = { x: 1 };
x; // 1
y; // 5

var { x: y = 3 } = {};
y; // 3

var { x: y = 3 } = { x: 5 };
y; // 5

var { message: msg = 'Something went wrong' } = {};
msg; // 'Something went wrong'
```

Điều kiện để giá trị mặc định có hiệu lực là giá trị thuộc tính của đối tượng phải chính xác bằng `undefined`.

```js
var { x = 3 } = { x: undefined };
x; // 3

var { x = 3 } = { x: null };
x; // null
```

Trong đoạn code trên, nếu thuộc tính `x` có giá trị `null`, nó không chính xác bằng `undefined`, dẫn đến giá trị mặc định không có hiệu lực.

Nếu việc giải nén thất bại, giá trị của biến sẽ là `undefined`.

```js
let { foo } = { bar: 'baz' };
foo; // undefined
```

Nếu mẫu giải nén là một đối tượng lồng nhau và thuộc tính con không tồn tại trong thuộc tính cha, sẽ xảy ra lỗi.

```js
// Lỗi
let {
  foo: { bar },
} = { baz: 'baz' };
```

Trong đoạn code trên, thuộc tính `foo` của đối tượng bên trái không tồn tại. Việc truy cập thuộc tính con `bar` trong mẫu giải nén sẽ gây ra lỗi. Hãy xem đoạn code dưới đây.

```js
let _tmp = { baz: 'baz' };
_tmp.foo.bar; // Lỗi
```

Nếu bạn muốn sử dụng một biến đã được khai báo cho việc giải nén, bạn phải rất cẩn thận.

```js
// Sai
let x;
{x} = {x： 1}；
// SyntaxError: syntax error
```

Đoạn code trên sẽ gây ra lỗi, vì trình thông dịch JavaScript sẽ hiểu `{x}` là một khối mã, dẫn đến lỗi cú pháp. Chỉ khi không đặt dấu ngoặc nhọn ở đầu dòng, tránh việc JavaScript hiểu nó là một khối mã, bạn mới có thể giải quyết vấn đề này.

```js
// Đúng
let x;
({ x } = { X: 1 });
```

Đoạn code trên đặt toàn bộ câu lệnh giải nén trong một cặp dấu ngoặc tròn, điều này cho phép nó hoạt động đúng. Về mối quan hệ giữa dấu ngoặc tròn và giải nén.

Giải nén đối tượng cho phép không đặt bất kỳ tên biến nào trong mẫu. Do đó, bạn có thể viết các biểu thức cha kỳ lạ.

```js
({} = [true, false]);
({} = 'abc');
({} = []);
```

Đoạn code trên mặc dù không có ý nghĩa gì, nhưng cú pháp là hợp lệ và có thể thực thi.

Giải nén đối tượng cũng cho phép dễ dàng gán các phương thức của đối tượng hiện có cho một biến.

```js
let { log, sin, cos } = Math;
```

Đoạn code trên gán các phương thức logarit, sin và cos của đối tượng Math cho các biến tương ứng, giúp việc sử dụng chúng trở nên dễ dàng hơn.

Vì mảng thực chất là một đối tượng đặc biệt, nên bạn cũng có thể giải nén các thuộc tính của mảng.

```js
let arr = [1, 2, 3];
let { 0: first, [arr.length - 1]: last } = arr;
first; // 1
last; // 3
```

Đoạn code trên giải nén một mảng thành đối tượng. Giá trị của khóa 0 trong mảng là 1, `[arr.length - 1]` là khóa 2, tương ứng với giá trị 3. Cú pháp trong dấu ngoặc vuông là "biểu thức tên thuộc tính".

## Giải nén gán giá trị cho chuỗi

Chuỗi cũng có thể được giải nén gán giá trị, điều này xảy ra vì chuỗi được chuyển đổi thành một đối tượng giống mảng.

```js
const [a, b, c, d, e] = 'hello';
a; // 'h'
b; // 'e'
c; // 'l'
d; // 'l'
e; // 'o'
```

Đối tượng giống mảng có một thuộc tính `length`, do đó bạn cũng có thể giải nén gán giá trị cho thuộc tính này.

```js
let { length: len } = 'hello';
len; // 5
```

## Giải nén gán giá trị cho số và giá trị boolean

Trong quá trình giải nén gán giá trị, nếu giá trị bên phải là số hoặc giá trị boolean, nó sẽ được chuyển đổi thành một đối tượng trước.

```js
let { toString: s } = 123;
s === Number.prototype.toString; // true

let { toString: s } = true;
s === Boolean.prototype.toString; // true
```

Trong đoạn mã trên, đối tượng bao gồm số và giá trị boolean đều có thuộc tính `toString`, do đó biến `s` sẽ nhận được giá trị tương ứng.

Quy tắc giải nén gán giá trị là, nếu giá trị bên phải của dấu bằng không phải là đối tượng hoặc mảng, nó sẽ được chuyển đổi thành đối tượng trước. Vì `undefined` và `null` không thể chuyển đổi thành đối tượng, nên khi giải nén gán giá trị cho chúng sẽ gây ra lỗi.

```js
let { prop: x } = undefined; // TypeError
let { prop: y } = null; // TypeError
```

## Giải nén gán giá trị cho tham số của hàm

Các tham số của hàm cũng có thể sử dụng giải nén gán giá trị.

```js
function add([x, y]) {
  return x + y;
}

add([1, 2]); // 3
```

Trong đoạn mã trên, tham số của hàm `add` ban đầu là một mảng, nhưng khi truyền tham số vào, mảng sẽ được giải nén thành các biến `x` và `y`. Đối với mã bên trong hàm, chúng chỉ cần quan tâm đến các biến `x` và `y`.

Dưới đây là một ví dụ khác.

```js
[
  [1, 2],
  [3, 4],
].map(([a, b]) => a + b);
// [3, 7]
```

Giải nén gán giá trị cho tham số của hàm cũng có thể sử dụng giá trị mặc định.

```js
function move({ x = 0, y = 0 } = {}) {
  return [x, y];
}

move({ x: 3, y: 8 }); // [3, 8]
move({ x: 3 }); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]
```

Trong đoạn mã trên, tham số của hàm `move` là một đối tượng và thông qua việc giải nén, chúng ta nhận được giá trị của biến `x` và `y`. Nếu giải nén thất bại, `x` và `y` sẽ có giá trị mặc định.

Chú ý, cách viết dưới đây sẽ có kết quả khác.

```js
function move({ x, y } = { x: 0, y: 0 }) {
  return [x, y];
}

move({ x: 3, y: 8 }); // [3, 8]
move({ x: 3 }); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]
```

Trong đoạn mã trên, chúng ta chỉ định giá trị mặc định cho tham số của hàm `move`, chứ không phải cho biến `x` và `y`, do đó kết quả sẽ khác so với cách viết trước đó.

`undefined` sẽ kích hoạt giá trị mặc định của tham số hàm.

```js
[1, undefined, 3].map((x = 'yes') => x);
// [1, 'yes', 3]
```

## Vấn đề với dấu ngoặc đơn

Mặc dù giải nén gán giá trị rất tiện lợi, nhưng việc phân tích nó không dễ dàng. Đối với trình biên dịch, không thể biết một biểu thức là mẫu hay biểu thức từ đầu, phải phân tích đến dấu bằng (hoặc không phân tích được) mới biết được.

Vấn đề đó làm cho việc đặt dấu ngoặc đơn vào mẫu trở nên phức tạp. Quy tắc của ES6 là, chỉ khi có thể gây ra sự không rõ ràng trong việc giải nén, mới không được sử dụng dấu ngoặc đơn.

Tuy nhiên, quy tắc này thực sự khó phân biệt và xử lý. Do đó, khuyến nghị là chỉ khi có thể, hãy không đặt dấu ngoặc đơn vào mẫu.

### Trường hợp không được sử dụng dấu ngoặc đơn

#### Câu lệnh khai báo biến

```js
// Tất cả đều báo lỗi
let [(a)] = [1];

let {x: (c)} = {};
let ({x: c}) = {};
let {(x: c)} = {};
let {(x): c} = {};

let { o: ({ p: p }) } = { o: { p: 2 } }
```

Có 6 câu lệnh trên đều báo lỗi, vì chúng đều là **câu lệnh khai báo biến**, mẫu không được sử dụng dấu ngoặc đơn.

#### Tham số của hàm

Tham số của hàm cũng thuộc loại câu lệnh khai báo biến, do đó không được sử dụng dấu ngoặc đơn.

```js
// Lỗi
function f([(z)]) { return z; }
// Lỗi
function f([z, (x)]) { return x; }
```

#### Mẫu trong câu lệnh gán giá trị

```js
// Tất cả đều báo lỗi
({ p: a } = { p: 42 });
[a] = [5];
```

Các đoạn mã trên đặt một phần mẫu trong dấu ngoặc đơn, dẫn đến báo lỗi.

```js
// Lỗi
[{ p: a }, { x: c }] = [{}, {}];
```

Đoạn mã trên đặt một phần mẫu trong dấu ngoặc đơn, dẫn đến báo lỗi.

### Trường hợp được sử dụng dấu ngoặc đơn

Chỉ có một trường hợp duy nhất được sử dụng dấu ngoặc đơn: phần không phải mẫu của câu lệnh gán giá trị có thể sử dụng dấu ngoặc đơn.

```js
[b] = [3]; // Đúng
({ p: d } = {}); // Đúng
[parseInt.prop] = [3]; // Đúng
```

## Các ứng dụng

### Hoán đổi giá trị của các biến

```js
let x = 1;
let y = 2;

[x, y] = [x, y];
```

Đoạn mã trên hoán đổi giá trị của các biến x và y. Cách viết này không chỉ ngắn gọn mà còn dễ đọc, ý nghĩa rõ ràng.

### Trả về nhiều giá trị từ hàm

Hàm chỉ có thể trả về một giá trị, nếu muốn trả về nhiều giá trị, chỉ có thể đặt chúng trong một mảng hoặc đối tượng và trả về. Với giải nén gán giá trị, việc lấy các giá trị này trở nên rất dễ dàng.

```js
// Trả về một mảng
function example() {
  return [1, 2, 3];
}
let [a, b, c] = example();

// Trả về một đối tượng
function example() {
  return {
    foo: 1,
    bar: 2,
  };
}
let { foo, bar } = example();
```

### Định nghĩa tham số của hàm

Giải nén gán giá trị có thể dễ dàng ánh xạ một nhóm tham số với các biến.

```js
// Tham số là một nhóm giá trị có thứ tự
function f({x, y, z}) { ... }
f([1, 2, 3]);

// Tham số là một nhóm giá trị không có thứ tự
function f({x, y, z}) {...}
f({z: 3, y: 2, x: 1});
```

### Trích xuất dữ liệu từ JSON

Giải nén gán giá trị rất hữu ích để trích xuất dữ liệu từ đối tượng JSON.

```js
let jsonData = {
  id: 42,
  status: 'ok',
  data: [867, 3509],
};

let { id, status, data: number } = jsonData;

console.log(id, status, number);
// 42, "ok", [867, 5309]
```

Đoạn mã trên giúp trích xuất nhanh chóng các giá trị từ đối tượng JSON.

### Giá trị mặc định cho tham số của hàm

```js
jQuery.ajax = function(
  url,
  {
    async = true,
    beforeSend = function() {},
    cache = true,
    complete = function() {},
    crossDomain = false,
    global = true,
    // ... more config
  }
) {
  // ... do stuff
};
```

Việc chỉ định giá trị mặc định cho các tham số giúp tránh việc viết lại các câu lệnh như `var foo = config.foo || 'default foo';` trong thân hàm.

### Lặp qua cấu trúc Map

Bất kỳ đối tượng nào triển khai giao diện Iterator đều có thể được lặp qua bằng vòng lặp `for…of`. Cấu trúc Map hỗ trợ giao diện Iterator mặc định, kết hợp với giải nén gán giá trị, việc lấy tên khóa và giá trị của khóa trở nên rất dễ dàng.

```js
var map = new Map();
map.set('first', 'hello');
map.set('second', 'world!');

for (let [key, value] of map) {
  console.log(key + ' is ' + value);
}
// first is hello
// second is world
```

Nếu chỉ muốn lấy tên khóa hoặc chỉ muốn lấy giá trị khóa, bạn có thể viết như sau.

```js
// Lấy tên khóa
for (let [key] of map) {
  // ...
}

// Lấy giá trị khóa
for (let [, value] of map) {
  // ...
}
```

### Nhập các phương thức cụ thể từ một mô-đun

Khi tải một mô-đun, thường cần chỉ định các phương thức đầu vào. Giải nén gán giá trị giúp cho câu lệnh nhập trở nên rõ ràng.

```js
const { SourceMapConsumer, SourceNode } = require('source-map');
```
