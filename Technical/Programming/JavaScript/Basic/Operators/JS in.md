---
title: JS in
tags: [js, programming]
categories: [js, programming]
date created: 2023-07-31
date modified: 2023-08-01
---

# in

Toán tử `in` được sử dụng để kiểm tra xem một thuộc tính có tồn tại trong đối tượng hay không.

## Cú pháp

```js
key in obj;
```

### Tham số

| Tham số   | Mô tả                                                                                   |
| --------- | --------------------------------------------------------------------------------------- |
| `key`     | Tên thuộc tính hoặc chỉ mục mảng (sẽ được chuyển đổi thành chuỗi nếu không phải là Symbol). |
| `object`  | Đối tượng mà ta kiểm tra (hoặc chuỗi nguyên mẫu của nó) xem có chứa thuộc tính đã chỉ định hay không. |

## Ví dụ

### Ví dụ mã

**Mảng**

```js
var cars = new Array('Toyota', 'Nissan', 'Mercedes', 'Buick', 'Porsche');
0 in cars;
// true

1 in cars;
// true

6 in cars;
// false

'Mercedes' in cars;
// false (phải sử dụng chỉ mục, không phải giá trị của phần tử mảng)

'length' in cars;
// true (length là một thuộc tính của mảng)

Symbol.iterator in cars;
// true (mảng có thể lặp, chỉ áp dụng trên ES2015+)
```

**Đối tượng tích hợp sẵn**

```js
'PI' in Math;
// true
```

**Đối tượng tùy chỉnh**

```js
var myCar = { make: 'Honda', model: 'Accord', year: '1998' };
'make' in myCar;
'model' in myCar;
```

Toán tử `in` yêu cầu đối tượng bên phải là một giá trị đối tượng.

Ví dụ: Bạn có thể chỉ định một chuỗi được tạo bằng cách sử dụng hàm tạo `String`, nhưng bạn không thể chỉ định một chuỗi văn bản.

```js
var color1 = new String('green');
'length' in color1;
// true

var color2 = 'coral';
'length' in color2;
// Lỗi (color2 không phải là một đối tượng)
```

### Thuộc tính với giá trị `undefined`

Nếu bạn xóa một thuộc tính bằng toán tử `delete`, toán tử `in` sẽ trả về `false` cho thuộc tính đã bị xóa.

```js
var cars = new Array('Toyota', 'Nissan', 'Mercedes', 'Buick', 'Porsche');
delete cars[3];

3 in cars;
// false
```

Nếu bạn chỉ gán giá trị `undefined` cho một thuộc tính mà không xóa nó, toán tử `in` vẫn trả về `true`.

```js
var cars = new Array('Toyota', 'Nissan', 'Mercedes', 'Buick', 'Porsche');
cars[3] = undefined;

3 in cars;
// true
```

### Thuộc tính kế thừa

Nếu một thuộc tính được kế thừa từ chuỗi nguyên mẫu, toán tử `in` cũng sẽ trả về `true`.

```js
'toString' in {};
// true
```
