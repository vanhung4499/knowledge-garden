---
title: JS JSON stringify
tags: [js, programming, json]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# JSON.stringify()

Phương thức `JSON.stringify()` được sử dụng để chuyển đổi một giá trị JavaScript (đối tượng hoặc mảng) thành một chuỗi JSON. Nếu chỉ định `replacer` là một hàm, nó có thể thay thế giá trị, hoặc nếu chỉ định `replacer` là một mảng, chỉ các thuộc tính được chỉ định sẽ được chuyển đổi thành chuỗi JSON cuối cùng.

## Cú pháp

```js
JSON.stringify( value[, replacer [, space]] )
```

| Tham số     | Kiểu dữ liệu         | Mô tả                                                                                                                                                                                                                                                                                                                                                                         |
| ----------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`     | Bất kỳ kiểu dữ liệu  | Giá trị sẽ được chuyển đổi thành chuỗi JSON.                                                                                                                                                                                                                                                                                                                                   |
| `replacer`  | Tùy chọn, kiểu hàm   | Nếu tham số này là một hàm, trong quá trình chuyển đổi, mỗi thuộc tính của giá trị sẽ trải qua quá trình chuyển đổi và xử lý của hàm này. Nếu tham số này là một mảng, chỉ có các thuộc tính được liệt kê trong mảng này mới được chuyển đổi thành chuỗi JSON cuối cùng. Nếu tham số này là `null` hoặc không được cung cấp, tất cả các thuộc tính của đối tượng sẽ được chuyển đổi. |
| `space`     | Tùy chọn, kiểu chuỗi | Xác định chuỗi khoảng trắng được sử dụng để làm đẹp cho đầu ra JSON (pretty-print); nếu tham số này là một số, nó đại diện cho số lượng khoảng trắng; giá trị tối đa là 10. Nếu tham số này nhỏ hơn 1, không có khoảng trắng nào được sử dụng; nếu tham số này là một chuỗi (10 ký tự đầu tiên của chuỗi), chuỗi đó sẽ được sử dụng làm khoảng trắng; nếu tham số này không được cung cấp (hoặc là `null`), không có khoảng trắng nào được sử dụng.     |

### Giá trị trả về

Một chuỗi JSON đại diện cho giá trị được cung cấp.

## Ví dụ

### Cú pháp cơ bản

- Các thuộc tính của đối tượng không phải là mảng không đảm bảo xuất hiện theo một thứ tự cụ thể trong chuỗi đã được chuẩn hóa.
- Các loại dữ liệu cơ bản trong JavaScript

```js
JSON.stringify(1); // trả về '1'
JSON.stringify(true); // trả về 'true'
JSON.stringify('foo'); // trả về '"foo"'
```

- Các loại dữ liệu phức tạp trong JavaScript

```js
JSON.stringify({ x: 5 }); // trả về '{"x":5}'
JSON.stringify([1, 'false', false]); // trả về '[1,"false",false]'
JSON.stringify({ x: 5, y: 6 }); // trả về "{"x":5,"y":6}"
```

- Các đối tượng bao bọc cho giá trị boolean, số và chuỗi sẽ tự động chuyển đổi thành giá trị nguyên thủy tương ứng trong quá trình chuẩn hóa.

```js
JSON.stringify([new Number(1), new String('false'), new Boolean(false)]);
// '[1,"false",false]'
```

- `undefined`, bất kỳ hàm nào và giá trị `Symbol`, sẽ bị bỏ qua trong quá trình chuẩn hóa (khi xuất hiện trong giá trị thuộc tính của đối tượng không phải là mảng) hoặc được chuyển đổi thành `null` (khi xuất hiện trong mảng).

```js
JSON.stringify({ x: undefined, y: Object, z: Symbol('') });
// '{}'

JSON.stringify([undefined, Object, Symbol('')]);
// '[null,null,null]'
```

- Tất cả các thuộc tính có `Symbol` là khóa sẽ bị bỏ qua hoàn toàn, ngay cả khi `replacer` được chỉ định bắt buộc phải chứa chúng.

```js
JSON.stringify({ [Symbol('foo')]: 'foo' });
// '{}'

JSON.stringify({ [Symbol.for('foo')]: 'foo' }, [Symbol.for('foo')]);
// '{}'

JSON.stringify({ [Symbol.for('foo')]: 'foo' }, function (k, v) {
  if (typeof k === 'symbol') {
    return 'a symbol';
  }
});
// undefined
```

- Các thuộc tính không thể liệt kê sẽ bị bỏ qua.

```js
JSON.stringify(
  Object.create(null, {
    x: { value: 'x', enumerable: false },
    y: { value: 'y', enumerable: true },
  })
);

// "{"y":"y"}"
```

### Tham số `replacer`

Tham số `replacer` có thể là một hàm hoặc một mảng. Khi là một hàm, nó có hai tham số, khóa (key) và giá trị (value) sẽ được chuyển đổi thành chuỗi JSON.

- Nếu trả về một giá trị kiểu `Number`, nó sẽ được chuyển đổi thành chuỗi tương ứng và được thêm vào chuỗi JSON.
- Nếu trả về một giá trị kiểu `String`, chuỗi đó sẽ được thêm vào chuỗi JSON làm giá trị thuộc tính.
- Nếu trả về một giá trị kiểu `Boolean`, `true` hoặc `false` sẽ được thêm vào chuỗi JSON làm giá trị thuộc tính.
- Nếu trả về bất kỳ đối tượng nào khác, đối tượng đó sẽ được chuyển đổi đệ quy thành chuỗi JSON và mỗi thuộc tính sẽ được gọi bằng phương thức `replacer`. Trừ khi đối tượng đó là một hàm, trong trường hợp này nó sẽ không được chuyển đổi thành chuỗi JSON.
- Nếu trả về `undefined`, giá trị thuộc tính sẽ không được xuất hiện trong chuỗi JSON.

**Lưu ý: Không thể sử dụng phương thức `replacer` để loại bỏ giá trị từ một mảng (`values`). Nếu trả về `undefined` hoặc một hàm, nó sẽ bị thay thế bằng `null`.**

#### Ví dụ (khi tham số là một hàm)

```js
function replacer(key, value) {
  if (typeof value === 'string') {
    return undefined;
  }
  return value;
}

var foo = { foundation: 'Mozilla', model: 'box', week: 45, transport: 'car', month: 7 };

var jsonString = JSON.stringify(foo, replacer); // {"week": 45,"month": 7}
```

#### Ví dụ (khi tham số là một mảng)

Nếu `replacer` là một mảng, các giá trị trong mảng đại diện cho các tên thuộc tính sẽ được chuyển đổi thành chuỗi JSON.

```js
JSON.stringify(foo, ['week', 'month']);
// '{"week": 45,"month":7}', chỉ giữ lại giá trị thuộc tính "week" và "month"
```

### Tham số `space`

Tham số `space` được sử dụng để điều khiển khoảng trắng trong chuỗi kết quả. Nếu là một số, thì trong quá trình chuyển đổi thành chuỗi, mỗi cấp độ sẽ được thụt lề bằng số khoảng trắng tương ứng (tối đa 10 khoảng trắng); nếu là một chuỗi, mỗi cấp độ sẽ được thụt lề bằng chuỗi đó (hoặc 10 ký tự đầu tiên của chuỗi).

```js
JSON.stringify({ a: 2 }, null, ' '); // '{\n "a": 2\n}'
```

Sử dụng tab (`\t`) để thụt lề:

```js
JSON.stringify({ uno: 1, dos: 2 }, null, '\t');
//'{            \
//    "uno": 1, \
//    "dos": 2  \
//}'
```

### Phương thức `toJSON`

Nếu một đối tượng được chuyển đổi thành chuỗi có phương thức `toJSON`, thì phương thức `toJSON` sẽ ghi đè hành vi chuyển đổi mặc định của đối tượng đó: không phải đối tượng được chuyển đổi, mà là giá trị trả về từ phương thức `toJSON` sẽ được chuyển đổi.

```js
var obj = {
  foo: 'foo',
  toJSON: function () {
    return 'bar';
  },
};

JSON.stringify(obj); // '"bar"'
JSON.stringify({ x: obj }); // '{"x": "bar"}'
```
