---
title: JS Map
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# Map

Đối tượng Map lưu trữ các cặp khóa-giá trị. Bất kỳ giá trị (đối tượng hoặc giá trị nguyên thủy) nào cũng có thể được sử dụng làm khóa hoặc giá trị.

Khác với đối tượng Object, đối tượng chỉ có thể sử dụng chuỗi và ký hiệu Symbol làm khóa, trong khi Map có thể sử dụng bất kỳ giá trị nào.

## Cú pháp

```js
new Map([iterable]);
```

| Tham số   | Mô tả                                                                                                                                                  |
| :-------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `iterable` | `Iterable` có thể là một mảng hoặc đối tượng Iterable khác, trong đó mỗi phần tử là một cặp khóa-giá trị hoặc một mảng gồm hai phần tử. Mỗi cặp khóa-giá trị sẽ được thêm vào Map mới. `null` sẽ được coi như `undefined`. |

## Mô tả

So sánh khóa dựa trên thuật toán [SameValueZero](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness): `NaN` được coi là bằng nhau (mặc dù `NaN !== NaN`), tất cả các giá trị khác được xem xét bằng toán tử `===` để xác định xem chúng có bằng nhau hay không.

**So sánh giữa Object và Map**

Một điểm tương đồng giữa Object và Map là cả hai cho phép bạn truy cập vào một giá trị bằng khóa, xóa khóa và kiểm tra xem một khóa có được gán giá trị hay không.

Ngoài sự khác biệt về loại khóa, Map và Object còn có những khác biệt sau đây:

1. Các khóa trong Map được sắp xếp theo thứ tự, trong khi các khóa được thêm vào đối tượng không có thứ tự nhất định.
2. Map có thể sử dụng `size` để lấy số lượng cặp khóa-giá trị, trong khi số lượng cặp khóa-giá trị trong Object chỉ có thể tính thủ công.
3. Map có thể được lặp trực tiếp, trong khi lặp qua Object cần lấy mảng khóa trước, sau đó lặp qua mảng đó.
4. Object có một nguyên mẫu riêng, các tên khóa trên chuỗi nguyên mẫu có thể xung đột với các tên khóa bạn đặt trên đối tượng. Mặc dù từ ES5 trở đi, bạn có thể sử dụng `map = Object.create(null)` để tạo một đối tượng không có nguyên mẫu, nhưng cách sử dụng này không phổ biến.
5. Trong các tình huống liên quan đến việc thêm và xóa cặp khóa-giá trị một cách thường xuyên, Map có một số lợi thế về hiệu suất.

Tuy nhiên, điều này không có nghĩa bạn có thể sử dụng Map một cách tùy ý, đối tượng vẫn là cái được sử dụng phổ biến nhất. Thực tế, các thể hiện Map chỉ phù hợp cho việc lưu trữ các tập hợp (Collections), bạn nên xem xét việc sửa đổi mã gốc của mình - nơi bạn trước đây sử dụng đối tượng để xử lý các tập hợp. Đối tượng nên được sử dụng với các trường và phương thức của nó để làm bản ghi.

Nếu bạn không chắc chọn cái nào, hãy xem xét các câu hỏi sau:

- Trước khi chạy, khóa có không xác định và cần truy vấn khóa một cách động không?
- Tất cả các giá trị có cùng loại và có thể hoán đổi được không?
- Cần sử dụng khóa không phải là chuỗi?
- Có thêm hoặc xóa cặp khóa-giá trị thường xuyên không?
- Có bất kỳ cặp khóa-giá trị nào và chúng dễ dàng thay đổi không?
- Tập hợp này có thể được lặp qua không?

Nếu tất cả các câu hỏi trên đều là "có", thì bạn cần sử dụng Map để lưu trữ tập hợp này. Ngược lại, nếu bạn có một số cặp khóa-giá trị cố định, muốn thao tác độc lập với chúng và phân biệt cách sử dụng chúng, thì bạn cần sử dụng đối tượng.

## Thuộc tính nguyên mẫu

| Thuộc tính                   | Mô tả                                                                                      |
| :-------------------------- | :---------------------------------------------------------------------------------------- |
| `Map.prototype.constructor` | Trả về một hàm tạo ra nguyên mẫu của thể hiện. Mặc định là hàm Map.                           |
| `Map.prototype.size`        | Trả về số lượng cặp khóa-giá trị của đối tượng Map.                                       |

### size

Thuộc tính `Map.prototype.size` trả về tổng số thành viên trong cấu trúc Map.

```js
const map = new Map();

map.set('foo', true);
map.set('bear', false);

console.log(map.size);
// 2
```

## Phương thức nguyên mẫu

| Phương thức                                      | Mô tả                                                                                                                                                                                                 |
| :---------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Map.prototype.set(key, value)`                  | Được sử dụng để đặt giá trị của khóa trong đối tượng Map và trả về đối tượng Map đó.                                                                                                                   |
| `Map.prototype.get(key)`                         | Được sử dụng để lấy giá trị của một khóa cụ thể trong đối tượng Map.                                                                                                                                   |
| `Map.prototype.has(key)`                         | Được sử dụng để kiểm tra xem khóa đã tồn tại trong Map hay chưa.                                                                                                                                       |
| `Map.prototype.delete(key)`                      | Được sử dụng để xóa giá trị liên quan đến khóa và trả về giá trị đó.                                                                                                                                   |
| `Map.prototype.clear()`                          | Được sử dụng để xóa tất cả các phần tử trong đối tượng Map.                                                                                                                                            |
| `Map.prototype.forEach(callbackFn [,thisArg])`   | Được sử dụng để gọi hàm callback cho mỗi cặp khóa-giá trị trong đối tượng Map theo thứ tự chèn. Nếu `thisArg` được cung cấp, nó sẽ được sử dụng làm giá trị `this` trong hàm callback.                   |
| `Map.prototype.keys()`                           | Trả về một đối tượng `Iterable` mới chứa các khóa của đối tượng Map theo thứ tự chèn.                                                                                                                 |
| `Map.prototype.values()`                         | Trả về một đối tượng `Iterator` mới chứa các giá trị của đối tượng Map theo thứ tự chèn.                                                                                                              |
| `Map.prototype.entries()`                        | Trả về một đối tượng `Iterable` mới chứa các cặp `[khóa, giá trị]` của đối tượng Map theo thứ tự chèn.                                                                                                 |
| `Map.prototype[@@iterator]()`                    | Trả về một đối tượng `MapIterator` mới chứa các mảng `[khóa, giá trị]` của đối tượng Map theo thứ tự chèn.                                                                                             |

### set(key, value)

Phương thức `set` được sử dụng để đặt giá trị cho khóa `key` trong đối tượng Map và trả về đối tượng Map đó. Nếu khóa đã có giá trị, thì giá trị của khóa sẽ được cập nhật, ngược lại sẽ tạo khóa mới.

Phương thức `set` trả về đối tượng Map hiện tại, cho phép viết theo chuỗi.

```js
const map = new Map();

// Khóa là chuỗi
map.set('edition', 6);
// Khóa là số
map.set(262, 'standard');
// Khóa là undefined
map.set(undefined, 'nah');

const m = new Map().set(1, 'a').set(2, 'b').set(3, 'c');
```

### get(key)

Phương thức `get` được sử dụng để đọc giá trị của khóa `key` trong đối tượng Map. Nếu không tìm thấy khóa, phương thức sẽ trả về `undefined`.

```js
const m = new Map();

const hello = function () {
  console.log('hello');
};

m.set(hello, 'Hello ES6!');
// Khóa là một hàm

m.get(hello);
// Hello ES6!
```

### has(key)

Phương thức `has` trả về một giá trị boolean, cho biết một khóa có tồn tại trong đối tượng Map hay không.

```js
const m = new Map();

m.set('edition', 6);
m.set(262, 'standard');
m.set(undefined, 'nah');

m.has('edition');
// true
m.has('years');
// false
m.has(262);
// true
m.has(undefined);
// true
```

### delete(key)

Phương thức `delete` được sử dụng để xóa một khóa khỏi đối tượng Map và trả về `true`. Nếu việc xóa không thành công, phương thức sẽ trả về `false`.

```js
const m = new Map();
m.set(undefined, 'nah');
m.has(undefined);
// true

m.delete(undefined);
m.has(undefined);
// false
```

### clear()

Phương thức `clear` được sử dụng để xóa tất cả các thành viên trong đối tượng Map, không có giá trị trả về.

```js
const map = new Map();

map.set('foo', true);
map.set('bar', false);
map.size;
// 2

map.clear();
map.size;
// 0
```

### forEach

Tham số đầu tiên là giá trị (`value`), tiếp theo là khóa (`key`).

```js
const map = new Map();

map.set('1', { a: 1 });
map.set('2', { b: 2 });
map.set('3', { c: 3 });

map.forEach((value, key) => {
  console.log(key, value);
  // 1 { a: 1 }
  // 2 { b: 2 }
  // 3 { c: 3 }
});
```

### keys

Phương thức `keys` trả về một đối tượng `Iterable` chứa các khóa của đối tượng Map theo thứ tự chèn.

```js
const map = new Map();

map.set('1', { a: 1 });
map.set('2', { b: 2 });
map.set('3', { c: 3 });

const keys = map.keys();

for (const key of keys) {
  console.log(key);
  // Sử dụng map.get(key) để lấy giá trị
  // 1
  // 2
  // 3
}
```

### values

Phương thức `values` trả về một đối tượng `Iterator` chứa các giá trị của đối tượng Map theo thứ tự chèn.

```js
const map = new Map();

map.set('1', { a: 1 });
map.set('2', { b: 2 });
map.set('3', { c: 3 });

const values = map.values();

for (const value of values) {
  console.log(value);
  // { a: 1 }
  // { b: 2 }
  // { c: 3 }
}
```

### entries

Phương thức `entries` trả về một đối tượng `Iterable` chứa các cặp `[khóa, giá trị]` của đối tượng Map theo thứ tự chèn.

```js
const map = new Map();

map.set('1', { a: 1 });
map.set('2', { b: 2 });
map.set('3', { c: 3 });

const entries = map.entries();

for ([key, value] of entries) {
  console.log(key, value);
  // 1 { a: 1 }
  // 2 { b: 2 }
  // 3 { c: 3 }
}
```

### MapIterator.next

```js
const map = new Map();

map.set('1', { a: 1 });
map.set('2', { b: 2 });
map.set('3', { c: 3 });

const keys = map.keys();
for (i = 0; i < map.size; i++) {
  key = keys.next().value;

  console.log(key);
  // 1
  // 2
  // 3
}

const values = map.values();
for (i = 0; i < map.size; i++) {
  value = values.next().value;

  console.log(value);
  // { a: 1 }
  // { b: 2 }
  // { c: 3 }
}

const entries = map.entries();
for (i = 0; i < map.size; i++) {
  entry = entries.next().value;

  console.log(entry[0], entry[1]);
  // 1 { a: 1 }
  // 2 { b: 2 }
  // 3 { c: 3 }
}
```

Đối tượng `MapIterator` sẽ gọi phương thức `next()` mỗi khi duyệt qua phần tử tiếp theo. Sau khi duyệt qua toàn bộ đối tượng, vị trí không được đặt lại. Do đó, nếu muốn duyệt qua nhiều lần, cần sử dụng lại các phương thức tương ứng của `map` (`keys()`, `values()` và `entries()`) để lấy lại đối tượng `MapIterator`. Nếu không, iterator sẽ không trả về giá trị.

## Đặc điểm

### Liên kết với địa chỉ bộ nhớ

Các khóa trong Map được liên kết với địa chỉ bộ nhớ.

⚠️ **Lưu ý**: Chỉ khi có một tham chiếu đến cùng một đối tượng, Map mới coi chúng là cùng một khóa.

```js
const map = new Map();

map.set(['a'], 555);

map.get(['a']);
// undefined
```

Trong ví dụ trên, phương thức `set` và `get` được gọi trên cùng một khóa, nhưng thực tế lại là hai giá trị khác nhau do địa chỉ bộ nhớ của mảng khác nhau. Do đó, phương thức `get` không thể đọc giá trị và trả về `undefined`.

Hai phiên bản khác nhau của cùng một giá trị trong Map được coi là hai khóa khác nhau.

```js
const map = new Map();

const a = ['foo'];
const b = ['foo'];

map.set(a, 123).set(b, 456);

map.get(a);
// 123

map.get(b);
// 456
```

Thực tế, khóa của Map được liên kết với địa chỉ bộ nhớ, chỉ cần địa chỉ bộ nhớ khác nhau, nó sẽ được coi là hai khóa khác nhau. Điều này giải quyết vấn đề **xung đột tên thuộc tính (Clash)** khi mở rộng thư viện của người khác. Khi chúng ta mở rộng một thư viện của người khác và sử dụng đối tượng làm khóa, chúng ta không cần phải lo lắng về việc các thuộc tính của chúng ta trùng tên với các thuộc tính của tác giả gốc.

### Sử dụng giá trị cơ bản làm khóa

Nếu khóa của Map là một giá trị cơ bản (số, chuỗi, giá trị boolean), chỉ cần hai giá trị bằng nhau một cách nghiêm ngặt, Map sẽ coi chúng là cùng một khóa, bao gồm `0` và `-0`.

Ngoài ra, cần lưu ý rằng mặc dù `NaN` không bằng chính nó theo nghĩa nghiêm ngặt, nhưng Map coi nó là cùng một khóa.

```js
const map = new Map();

map.set(-0, 123);
map.get(-0);
// 123

map.set(true, 1);
map.set('true', 2);
map.get(true);
// 1

map.set(undefined, 3);
map.set(null, 4);
map.get(undefined);
// 3

map.set(NaN, 123);
map.get(NaN);
// 123
```

### Sử dụng Set hoặc Map làm khóa

Sử dụng Set làm tham số

```js
const payload = new Set([
  ['foo', 1],
  ['bar', 2],
]);

const map = new Map(payload);

map.get('foo');
// 1
```

Sử dụng Map làm tham số

```js
const payload = new Map([['baz'], 3]);
const map = new Map(payload);

map.get('baz');
// 3
```

Nếu gán giá trị cho cùng một khóa nhiều lần, giá trị sau sẽ ghi đè lên giá trị trước.

```js
const map = new Map();

map.set(1, 'foo').set(1, 'baz');

map.get(1);
// 'baz'
```

### Sử dụng NaN làm khóa

`NaN` cũng có thể được sử dụng làm khóa trong đối tượng Map, mặc dù `NaN` không bằng bất kỳ giá trị nào, kể cả chính nó (`NaN !== NaN` trả về `true`). Tuy nhiên, ví dụ dưới đây cho thấy rằng hai giá trị `NaN` được coi là cùng một khóa trong đối tượng Map.

```js
const map = new Map();
map.set(NaN, 'Not a number');

map.get(NaN);
// 'Not a number'

const otherNaN = Number('foo');
map.get(otherNaN);
// 'Not a number'
```

## Ứng dụng thực tế

### Hợp nhất các đối tượng Map

Khi hợp nhất hai đối tượng Map, nếu có các khóa trùng lặp, giá trị của khóa sau sẽ ghi đè lên giá trị của khóa trước.

Toán tử mở rộng (`…`) thực chất là chuyển đổi đối tượng Map thành một mảng.

```js
const first = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

const second = new Map([
  [1, 'uno'],
  [2, 'dos'],
]);

const merged = new Map([...first, ...second]);
```

### Chuyển đổi Map thành mảng

Cách đơn giản nhất để chuyển đổi đối tượng Map thành một mảng là sử dụng toán tử mở rộng (`…`).

```js
const map = new Map().set(true, 1).set({ foo: 2 }, ['abc']);

console.log([...map]);
// [ [true, 1], [ { foo: 2}, ['abc'] ] ]
```

### Chuyển đổi mảng thành Map

Để chuyển đổi một mảng thành một đối tượng Map, chỉ cần truyền mảng vào hàm tạo Map.

```js
const m = new Map([
  [true, 7],
  [{ foo: 3 }, ['abc']],
]);

console.log(m);
// Map {
//	true => 7,
//  Object {foo: 3} => ['abc']
// }
```

### Chuyển đổi Map thành Object

Nếu tất cả các khóa trong Map đều là chuỗi, bạn có thể chuyển đổi nó thành một đối tượng.

```js
function toObject(strMap) {
  let o = Object.create(null);
  for (let [k, v] of strMap) {
    o[k] = v;
  }
  return o;
}

const m = new Map().set('yes', true).set('no', false);

console.log(toObject(m));
// {'yes': true, 'no': false}
```

### Chuyển đổi Object thành Map

```js
function toMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

const m = toMap({ yes: true, no: false });

console.log(m);
// Map {"yes" => true, "no" => false}
```

### Chuyển đổi Map thành JSON

Chuyển đổi Map thành JSON phải xem xét hai trường hợp. Trường hợp thứ nhất là khi tất cả các khóa trong Map đều là chuỗi, bạn có thể chọn chuyển đổi thành JSON đối tượng.

```js
const toJSON = (strMap) => JSON.stringify(toObject(strMap));

let m = new Map().set('yes', true).set('no', false);

console.log(toJSON(m));
// '{"yes": true, "no": false}'
```

Trường hợp thứ hai là khi Map có các khóa không phải là chuỗi, bạn có thể chọn chuyển đổi thành JSON mảng.

```js
const toArrayJSON = (map) => JSON.stringify([...map]);

let m = new Map().set(true, 1).set({ foo: 2 }, ['abc']);

console.log(toArrayJSON(m));
// '[[true], 1], [{'foo': 2}, ['abc']]'
```

### Chuyển đổi từ JSON thành Map

```js
const toMap = (jsonStr) => new Map(JSON.parse(jsonStr));

console.log(toMap('{"yes": true, "no": false}'));
// Map {'yes' => true, 'no': false}
```

Tuy nhiên, có một trường hợp đặc biệt: JSON là một mảng và mỗi thành viên của mảng lại là một mảng có hai thành viên. Trong trường hợp này, nó có thể được chuyển đổi một cách tương ứng thành Map. Điều này thường xảy ra khi chuyển đổi từ mảng thành JSON.

```js
const toMap = (jsonStr) => new Map(JSON.parse(jsonStr));

console.log(toMap('[[true, 7], [{"foo": 3}, ["abc"]]]'));
// Map(true => 7, Object {foo: 3} => ['abc'])
```

### Thay thế if-else

```js
const timemap = new Map([
  [0, 'Chủ nhật'],
  [1, 'Thứ hai'],
  [2, 'Thứ ba'],
  [3, 'Thứ tư'],
  [4, 'Thứ năm'],
  [5, 'Thứ sáu'],
  [6, 'Thứ bảy'],
]);

// Sử dụng useEffect của React Hooks
const [time, setTime] = setState(new Date());

useEffect(() => {
  clearInterval();
  setInterval(() => {
    setTimeout(new Date());
  }, 1000);
});

const res = (timemap.get(time.getDay()) || '') + time.toLacleTimeString();
```
