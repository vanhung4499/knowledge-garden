---
title: JS Boolean
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# Boolean

Đối tượng Boolean là một bao bọc cho giá trị boolean, biểu thị hai giá trị `true` và `false`.

## Cú pháp

**Hàm tạo**

```js
new Boolean(value);
```

**Hàm chuyển đổi sang kiểu boolean**

```js
Boolean(value);
```

| Tham số | Mô tả                                                             | Kiểu dữ liệu |
| :------ | :--------------------------------------------------------------- | :---------- |
| value   | Tham số tùy chọn. Giá trị sẽ được đặt trong đối tượng Boolean hoặc giá trị sẽ được chuyển đổi sang kiểu boolean | bất kỳ      |

- Khi gọi như một hàm tạo (với toán tử `new`), `Boolean()` sẽ chuyển đổi tham số thành một giá trị boolean và trả về một đối tượng Boolean chứa giá trị đó.
- Khi gọi như một hàm (không có toán tử `new`), `Boolean()` chỉ chuyển đổi tham số thành một giá trị boolean nguyên thủy và trả về giá trị đó.

## Mô tả

- Nếu tham số của hàm tạo Boolean không phải là một giá trị boolean, tham số đó sẽ được chuyển đổi thành một giá trị boolean.
- Nếu tham số là `0`, `-0`, `null`, `false`, `NaN`, `undefined` hoặc chuỗi rỗng (`""`), đối tượng Boolean được tạo ra sẽ có giá trị `false`. Bất kỳ giá trị khác, bao gồm bất kỳ đối tượng nào hoặc chuỗi `"false"`, đều tạo ra một đối tượng Boolean có giá trị `true`.
- Không nhầm lẫn giữa giá trị boolean nguyên thủy `true` và `false` với đối tượng Boolean có giá trị `true` và `false`.
- Bất kỳ đối tượng nào có giá trị khác `undefined` hoặc `null`, bao gồm đối tượng Boolean có giá trị `false`, cũng được coi là `true` trong các câu lệnh điều kiện.

```js
const foo = new Boolean(false);

if (foo) {
  // ...vẫn hoạt động
}
```

Giá trị boolean nguyên thủy (giá trị gốc của Boolean) không bị ảnh hưởng bởi quy tắc này.

```js
var foo = false;
if (foo) {
  // ...không hoạt động
}
```

Không nên sử dụng phương pháp tạo đối tượng Boolean để chuyển đổi một giá trị không phải boolean thành giá trị boolean. Sử dụng hàm Boolean mới là cách đúng.

```js
// Không tốt
var bad = new Boolean(expression);

// Tốt
var good = Boolean(expression);
```

## Ví dụ

Tạo đối tượng Boolean với giá trị `false`

```js
// không có tham số
var bNoParam = Boolean();
// 0
var bZero = Boolean(0);
// null
var bNull = Boolean(null);
// chuỗi rỗng
var bEmptyString = Boolean('');
// undefined
var bUndefined = Boolean(undefined);
// false
var bfalse = Boolean(false);
```

Tạo đối tượng Boolean với giá trị `true`

```js
// true
var btrue = Boolean(true);
// chuỗi "true"
var btrueString = Boolean('true');
// chuỗi "false"
var bfalseString = Boolean('false');
// chuỗi
var bSuLin = Boolean('Su Lin');
// mảng
var bArrayProto = new Boolean([]);
// đối tượng
var bObjProto = new Boolean({});
```
