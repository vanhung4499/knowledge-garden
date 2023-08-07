---
title: JS Symbol
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# Symbol

Symbol là một kiểu dữ liệu nguyên thủy trong JavaScript, có tính chất đặc biệt là giá trị của kiểu này có thể được sử dụng để tạo ra các thuộc tính vô danh cho đối tượng.

## Đặc điểm của kiểu dữ liệu

### Kiểm tra kiểu dữ liệu

Giá trị Symbol chỉ có thể được tạo ra bằng cách sử dụng hàm Symbol. Giá trị của kiểu Symbol khi được sử dụng làm tên thuộc tính cho đối tượng đảm bảo không xảy ra xung đột với tên thuộc tính khác.

```js
const symbol = Symbol();

typeof symbol;
// 'symbol'
```

### Không thể khởi tạo đối tượng

Lưu ý rằng không thể sử dụng lệnh `new` để khởi tạo đối tượng trước hàm Symbol, nếu không sẽ gây ra lỗi. Điều này là do giá trị Symbol được tạo ra là một giá trị nguyên thủy, không phải là một đối tượng. Nó tương tự như một kiểu dữ liệu như chuỗi.

```js
new Symbol('symbol');
// TypeError: Symbol is not a constructor
```

### Kiểm tra nguyên mẫu

Sử dụng `instanceof` để kiểm tra mối quan hệ giữa một thể hiện và Symbol.

```js
const symbol = Symbol('foo');

console.log(symbol instanceof Symbol);
// false
```

### Mô tả thể hiện

Hàm Symbol có thể nhận một chuỗi làm tham số, đại diện cho mô tả của thể hiện Symbol. Mục đích chính là để hiển thị trên bảng điều khiển hoặc khi chuyển đổi thành chuỗi để dễ dàng phân biệt.

Nếu tham số của Symbol là một đối tượng, nó sẽ gọi phương thức `toString` của đối tượng đó để chuyển đổi thành chuỗi, sau đó mới tạo ra một giá trị Symbol.

```js
const obj = {
  toString() {
    return 'abc';
  },
};

const sym = Symbol(obj);

console.log(sym);
// Symbol(abc)
```

### Mô tả giống nhau

Lưu ý rằng tham số của hàm `Symbol` chỉ đại diện cho mô tả của giá trị Symbol hiện tại, do đó giá trị trả về của hai hàm `Symbol` với cùng một tham số sẽ không bằng nhau.

```js
// Trường hợp không có tham số
let s1 = Symbol();
let s2 = Symbol();

s1 === s2;
// false, không bằng nhau

// Trường hợp có tham số
let s3 = Symbol('foo');
let s4 = Symbol('foo');

s3 === s4;
// false, không bằng nhau
```

### Phép toán và chuyển đổi kiểu dữ liệu

Giá trị Symbol không thể thực hiện phép toán với các kiểu dữ liệu khác, sẽ gây ra lỗi.

```js
let sym = Symbol('symbol');

'HELLO' +
  sym`HELLO ${
    sym
    // TypeError: Cannot convert a Symbol value to a string
  }`;
// TypeError: Cannot convert a Symbol value to a string
```

Tuy nhiên, giá trị Symbol có thể được chuyển đổi thành chuỗi một cách rõ ràng.

```js
let sym = Symbol('symbol');

String(sym);
// 'Symbol(symbol)'

sym.toString();
// 'Symbol(symbol)'
```

Ngoài ra, giá trị Symbol cũng có thể chuyển đổi thành giá trị boolean, nhưng không thể chuyển đổi thành giá trị số.

```js
let sym = Symbol();
Boolean(sym);
// true
console.log(!sym);
// false

if (sym) {
  // ...
}

Number(sym);
// TypeError: Cannot convert a Symbol value to a number
console.log(sym + 2);
// TypeError: Cannot convert a Symbol value to a number
```

### Tên thuộc tính của đối tượng

Vì mỗi giá trị Symbol là không đồng nhất, điều này có nghĩa là giá trị Symbol có thể được sử dụng làm **định danh**, để làm tên thuộc tính cho đối tượng, đảm bảo không có thuộc tính trùng tên. Điều này rất hữu ích trong trường hợp một đối tượng được tạo bởi nhiều mô-đun khác nhau, để tránh việc ghi đè hoặc che đậy một thuộc tính không cần thiết.

Trong công việc thực tế, chắc chắn sẽ thường xuyên sử dụng các thư viện của người khác, và sau đó, vì không biết tên thuộc tính của một đối tượng nào đó, ta sẽ vô tình ghi đè lên một thuộc tính của đối tượng đó, dẫn đến các lỗi không cần thiết. Nhưng với kiểu dữ liệu Symbol, ta có thể dễ dàng tránh được những sai lầm như vậy.

```js
let mySymbol = Symbol();

// Cách viết thứ nhất: Truy cập thuộc tính
let a = {};
a[mySymbol] = 'Hello!';

// Cách viết thứ hai: Khai báo trực tiếp
let b = {
  [mySymbol]: 'Hello!',
};

// Cách viết thứ ba: Phương thức gốc của đối tượng
let c = {};
Object.defineProperty(c, mySymbol, { value: 'Hello!' });

// Cả ba cách trên đều cho kết quả tương tự
a[mySymbol];
// 'Hello!'
```

> ⚠️ Lưu ý, khi sử dụng giá trị Symbol làm tên thuộc tính của đối tượng, không thể sử dụng **toán tử chấm**.

```js
const sym = Symbol();
const a = {};

a.sym = 'Hello!';

console.log(a[sym]);
// undefined

console.log(a['sym']);
// 'Hello!'
```

Trong đoạn mã trên, vì sau toán tử chấm luôn là một chuỗi, nên nó không đọc `sym` như một tên định danh của giá trị Symbol, dẫn đến tên thuộc tính của `a` thực tế là một chuỗi, không phải là một giá trị Symbol.

Tương tự, khi định nghĩa thuộc tính bằng giá trị Symbol bên trong đối tượng, giá trị Symbol phải được đặt trong **dấu ngoặc vuông**.

```js
let sym = Symbol()

let foo = {
  [sym]: function (arg) {...}
}

foo[sym](123)
```

Có thể sử dụng cú pháp viết tắt cho đối tượng.

```js
let foo = {
  [sym](arg) {...}
}
```

kiểu dữ liệu Symbol cũng có thể được sử dụng để định nghĩa một nhóm hằng số, đảm bảo các giá trị hằng số này là không đồng nhất.

```js
const foo = {};

foo.constants = {
  a: Symbol('a'),
  b: Symbol('b'),
  c: Symbol('c'),
};

console.log(foo.constants.a);
// Symbol(a)
```

Cần lưu ý rằng, khi giá trị Symbol được sử dụng làm tên thuộc tính, thuộc tính đó vẫn là một thuộc tính công khai, không phải là thuộc tính riêng tư.

### Không thể liệt kê

Khi Symbol được sử dụng làm tên thuộc tính, thuộc tính đó sẽ không xuất hiện trong vòng lặp `for…in`, `for…of`, cũng không được trả về bởi các phương thức `Object.keys()`, `Object.getOwnPropertyNames()`, `JSON.stringify()`.

Tuy nhiên, nó không phải là thuộc tính riêng tư, có một phương thức `Object.getOwnPropertySymbols` có thể lấy tất cả các tên thuộc tính Symbol của đối tượng cụ thể.

Phương thức `Object.getOwnPropertySymbols` trả về một mảng, thành viên của mảng là các giá trị Symbol được sử dụng làm tên thuộc tính của đối tượng hiện tại.

```js
const foo = {};
let a = Symbol('a');
let b = Symbol('b');

foo[a] = 'Hello';
foo[b] = 'world';

const sym = Object.getOwnPropertySymbols(foo);

console.log(sym);
// [Symbol(a), Symbol(b)]
```

## Phương thức tĩnh

### Symbol.for()

Phương thức `Symbol.for()` sẽ dựa vào khóa được cung cấp để tìm kiếm trong bảng đăng ký Symbol của thời gian chạy và trả về Symbol tương ứng nếu tìm thấy, nếu không, nó sẽ tạo một Symbol mới liên kết với khóa đó và đưa vào bảng đăng ký Symbol toàn cục.

```js
Symbol.for(key);
```

```js
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');

s1 === s2;
// true
```

Cả hai biến trên đều được tạo ra bằng cách sử dụng phương thức `Symbol.for` với cùng một tham số, vì vậy thực tế là chúng là cùng một giá trị.

`Symbol.for` và `Symbol` đều tạo ra một Symbol mới. Sự khác biệt giữa chúng là: `Symbol.for` sẽ được đăng ký trong môi trường toàn cục để tìm kiếm, trong khi `Symbol` không được đăng ký.

`Symbol.for()` không trả về một giá trị Symbol mới mỗi khi được gọi, mà nó sẽ kiểm tra xem khóa đã cho có tồn tại hay không. Nếu không tồn tại, nó sẽ tạo ra một giá trị mới. Nếu tồn tại, nó sẽ trả về cùng một giá trị Symbol.

```js
let s1 = Symbol('foo');
let s2 = Symbol('foo');
let s3 = Symbol.for('foo');
let s4 = Symbol.for('foo');

s1 === s2;
// false

s3 === s4;
// true

s1 === s3;
// false
```

### Symbol.keyFor()

Phương thức `Symbol.keyFor` được sử dụng để lấy khóa liên kết với một giá trị Symbol cụ thể trong bảng đăng ký Symbol.

```js
Symbol.keyFor(sym);
```

Tham số `sym` là một phiên bản Symbol được lưu trữ trong bảng đăng ký Symbol.

```js
const s1 = Symbol.for('s1');
Symbol.keyFor(s1);
// 's1'

const s2 = Symbol();
Symbol.keyFor(s2);
// undefined
```

⚠️ Lưu ý rằng hàm này được sử dụng để tìm thông tin đăng ký của một giá trị Symbol. Nếu bạn sử dụng hàm `Symbol()` để tạo một giá trị Symbol, dù bạn có truyền tham số hay không, bạn sẽ không tìm thấy thông tin đăng ký của nó. Nói cách khác, giá trị Symbol được tạo bằng `Symbol()` là không có đăng ký. Nhưng giá trị Symbol được tạo bằng `Symbol.for()` sẽ có thông tin đăng ký.

## Giá trị tích hợp sẵn

Ngoài các giá trị Symbol do người dùng tự định nghĩa, ES6 còn cung cấp 11 giá trị Symbol tích hợp sẵn, được sử dụng bên trong ngôn ngữ.

- [Symbol.hasInstance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance)
- [Symbol.isConcatSpreadable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/isConcatSpreadable)
- [Symbol.iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator)
- [Symbol.match](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/match)
- [Symbol.replace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/replace)
- [Symbol.search](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/search)
- [Symbol.species](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species)
- [Symbol.split](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/split)
- [Symbol.toPrimitive](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive)
- [Symbol.toStringTag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag)
- [Symbol.unscopables](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/unscopables)

## Cài đặt thủ công

Cài đặt thủ công của Symbol:

```js
(function() {
  var root = this;

  var generateName = (function() {
    var postfix = 0;
    return function(descString) {
      postfix++;
      return '@@' + descString + '_' + postfix;
    };
  })();

  var SymbolPolyfill = function Symbol(description) {
    if (this instanceof SymbolPolyfill) throw new TypeError('Symbol is not a constructor');

    var descString = description === undefined ? undefined : String(description);

    var symbol = Object.create({
      toString: function() {
        return this.__Name__;
      },
      valueOf: function() {
        return this;
      },
    });

    Object.defineProperties(symbol, {
      __Description__: {
        value: descString,
        writable: false,
        enumerable: false,
        configurable: false,
      },
      __Name__: {
        value: generateName(descString),
        writable: false,
        enumerable: false,
        configurable: false,
      },
    });

    return symbol;
  };

  var forMap = {};

  Object.defineProperties(SymbolPolyfill, {
    for: {
      value: function(description) {
        var descString = description === undefined ? undefined : String(description);
        return forMap[descString]
          ? forMap[descString]
          : (forMap[descString] = SymbolPolyfill(descString));
      },
      writable: true,
      enumerable: false,
      configurable: true,
    },
    keyFor: {
      value: function(symbol) {
        for (var key in forMap) {
          if (forMap[key] === symbol) return key;
        }
      },
      writable: true,
      enumerable: false,
      configurable: true,
    },
  });

  root.SymbolPolyfill = SymbolPolyfill;
})();
```

Không thể cài đặt các tính năng sau:

1. Sử dụng `typeof`, kết quả là `"symbol"`. Vì chúng ta không thể thay đổi kết quả của toán tử `typeof` trong ES5, nên không thể cài đặt.
2. Hàm Symbol có thể nhận một chuỗi làm tham số, đại diện cho mô tả của thể hiện Symbol. Điều này không thể cài đặt.
3. Giá trị Symbol không thể thực hiện phép toán với các kiểu dữ liệu khác, sẽ gây ra lỗi. Không thể cài đặt tính năng này.
4. Giá trị Symbol có thể được chuyển đổi thành chuỗi một cách rõ ràng. Không thể cài đặt tính năng này.
5. Khi Symbol được sử dụng làm tên thuộc tính, thuộc tính đó sẽ không xuất hiện trong vòng lặp `for…in`, `for…of`, cũng không được trả về bởi các phương thức `Object.keys()`, `Object.getOwnPropertyNames()`, `JSON.stringify()`. Không thể cài đặt tính năng này.

## Tổng kết

- Giá trị Symbol chỉ có thể được tạo ra bằng cách sử dụng hàm `Symbol()`.
- Tham số của `Symbol()` chỉ đại diện cho mô tả của giá trị Symbol hiện tại, và việc gọi với cùng một tham số sẽ trả về các giá trị Symbol khác nhau.
- Không thể sử dụng lệnh `new` trước hàm `Symbol()`.
- Tên thuộc tính của đối tượng có thể là giá trị Symbol, giúp tránh xung đột tên thuộc tính.
- Giá trị Symbol không thể sử dụng toán tử chấm để truy cập.
- Có một số ứng dụng của Symbol, ví dụ như sử dụng làm tên thuộc tính để tránh xung đột, hoặc làm các hằng số không trùng lặp.
