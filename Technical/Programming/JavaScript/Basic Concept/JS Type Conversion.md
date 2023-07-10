---
tags: [javascript, js]
title: JS Type Conversion
date created: 2023-07-04
date modified: 2023-07-07
---

JavaScript là một ngôn ngữ động, không cần khai báo kiểu dữ liệu trước như C/C++. Nó cho phép chuyển đổi kiểu dữ liệu **ngầm định** và chuyển đổi kiểu dữ liệu **tường minh**. Khi khai báo một biến, chúng ta chỉ cần sử dụng `var`, `let`, `const` mà không cần quan tâm đến kiểu dữ liệu.

## Quy tắc cơ bản

Để hiểu cách chuyển đổi giữa Number, String, Boolean, Array và Object trong ECMAScript Standard, chúng ta có thể xem xét các quy tắc chuyển đổi sau:

### ToString

> ToString ở đây không phải là phương thức `toString()` của đối tượng, mà chỉ đề cập đến việc chuyển đổi các giá trị khác thành kiểu dữ liệu String.

Dưới đây là một số quy tắc chuyển đổi phổ biến thành kiểu String:

- `null`: Chuyển đổi thành `"null"`
- `undefined`: Chuyển đổi thành `"undefined"`
- Kiểu Boolean:
  - `true` chuyển đổi thành `"true"`
  - `false` chuyển đổi thành `"false"`
- Kiểu Number: Chuyển đổi thành chuỗi số
  - Ví dụ: `10` chuyển đổi thành `"10"`, `1e21` chuyển đổi thành `"1e+21"`
- Kiểu Array: Chuyển đổi thành chuỗi bằng cách nối các phần tử với dấu phẩy `,`, tương đương với việc sử dụng phương thức `Array.prototype.join()`
  - Mảng rỗng chuyển đổi thành chuỗi rỗng `''`
  - Các phần tử `null` và `undefined` trong mảng được coi là chuỗi rỗng `''`
- Kiểu Object: Chuyển đổi thành chuỗi bằng cách sử dụng phương thức `Object.prototype.toString()`, trả về `"[object Object]"`

```js
String(null);
// "null"

String(undefined);
// 'undefined'

String(true);
// 'true'

String(10);
// '10'

String(1e21);
// '1e+21'

String([1, 2, 3]);
// '1,2,3'

String([]);
// ''

String([null]);
// ''

String([1, undefined, 3]);
// '1,,3'

String({});
// '[object Objecr]'
```

### ToNumber

- `null`: Chuyển đổi thành `0`
- `undefined`: Chuyển đổi thành `NaN`
- Kiểu String: Nếu là dạng số, chuyển đổi thành số tương ứng
  - Chuỗi rỗng chuyển đổi thành `0`
  - Nếu không thể chuyển đổi thành số, trả về `NaN`
- Kiểu Boolean:
  - `true` chuyển đổi thành `1`
  - `false` chuyển đổi thành `0`
- Kiểu Array: Mảng trước tiên sẽ được chuyển đổi thành kiểu dữ liệu nguyên thủy (ToPrimitive), sau đó áp dụng quy tắc chuyển đổi tương ứng với kiểu dữ liệu nguyên thủy
- Kiểu Object: Tương tự như mảng, áp dụng quy tắc chuyển đổi tương ứng với kiểu dữ liệu nguyên thủy

```js
Number(null);
// 0

Number(undefined);
// NaN

Number('10');
// 10

Number('10a');
// NaN

Number('');
// 0

Number(true);
// 1

Number(false);
// 0

Number([]);
// 0

Number(['1']);
// 1

Number({});
// NaN
```

### ToBoolean

Trong JavaScript, chỉ có các giá trị sai (falsy) là `false`, bao gồm `false`, `null`, `undefined`, `""`, `0` và `NaN`. Các giá trị khác đều được chuyển đổi thành `true`.

```js
Boolean(null);
// false

Boolean(undefined);
// false

Boolean('');
// flase

Boolean(NaN);
// flase

Boolean(0);
// flase

Boolean([]);
// true

Boolean({});
// true

Boolean(Infinity);
// true
```

### ToPrimitive

> Phương thức ToPrimitive được sử dụng để chuyển đổi kiểu dữ liệu tham chiếu thành kiểu dữ liệu nguyên thủy.

🔬 Khi giá trị là kiểu dữ liệu tham chiếu, phương thức `@@ToPrimitive(hint)` được gọi để xác định kiểu dữ liệu mục tiêu.

- Nếu giá trị đầu vào là kiểu Number, phương thức `valueOf()` của đối tượng sẽ được gọi trước. Nếu giá trị trả về là kiểu dữ liệu nguyên thủy, quá trình `@@ToPrimitive` kết thúc. Nếu giá trị trả về không phải kiểu dữ liệu nguyên thủy, phương thức `toString()` của đối tượng sẽ được gọi tiếp theo. Nếu giá trị trả về là kiểu dữ liệu nguyên thủy, quá trình `@@ToPrimitive` kết thúc. Nếu giá trị trả về vẫn là kiểu dữ liệu tham chiếu, một ngoại lệ sẽ được ném ra.
- Nếu giá trị đầu vào là kiểu String, phương thức `toString()` của đối tượng sẽ được gọi trước, sau đó là phương thức `valueOf()`.

<br />

```js
[1, 2] ==
  '1,2'[(1, 2)] // true
    .valueOf() // "[1,2]"
    [(1, 2)].toString(); // "1,2"

const a = {};
a == '[object Object]'; // true
a.valueOf().toString(); // "[object Object]"
```

> Đối với các kiểu dữ liệu tham chiếu khác nhau, quy tắc của ToPrimitive sẽ khác nhau, ví dụ như đối tượng Date sẽ gọi phương thức `toString()` trước, chi tiết có thể tham khảo [ECMAScript6 Specification on ToPrimitive](https://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive)
>
> Cách triển khai ToPrimitive trong JavaScript có thể tham khảo tại [ToPrimitive](https://juejin.im/post/59ad2585f265da246a20e026#heading-1)

## Chuyển đổi kiểu dữ liệu tường minh

JavaScript cung cấp các hàm chuyển đổi kiểu dữ liệu tường minh như:

- Chuyển đổi thành kiểu Number
  - `Number(mix)`
  - `parseInt(string, radix)`
  - `parseFloat(string)`
- Chuyển đổi thành kiểu String
  - `toString(radix)`
  - `String(mix)`
- Chuyển đổi thành kiểu Boolean
  - `Boolean(mix)`

## Chuyển đổi kiểu ngầm định

Trong JavaScript, khi toán tử được sử dụng, nếu **hai giá trị không phù hợp**, CPU sẽ không thể thực hiện phép tính. Trong trường hợp này, trình biên dịch sẽ tự động chuyển đổi kiểu dữ liệu của hai giá trị của toán tử để chúng trở thành cùng một kiểu dữ liệu trước khi tính toán.

Cách chuyển đổi kiểu dữ liệu ngầm định mà không cần người phát triển thực hiện gọi là **chuyển đổi kiểu ngầm định**.

Chuyển đổi kiểu dữ liệu ngầm định trong JavaScript chủ yếu có ba trường hợp:

- Chuyển đổi thành kiểu Boolean
- Chuyển đổi thành kiểu Number
- Chuyển đổi thành kiểu String

Giá trị sẽ được chuyển đổi sang kiểu Boolean khi được sử dụng trong **điều kiện logic** và **phép toán logic**.

Bảng quy tắc chuyển đổi kiểu Boolean:

| Giá trị dữ liệu      | Giá trị sau khi chuyển đổi |
| :------------------ | :------------------------ |
| Số `0`              | `false`                   |
| `NaN`               | `false`                   |
| Chuỗi rỗng `""`     | `false`                   |
| `null`              | `false`                   |
| `undefined`         | `false`                   |
| Số khác `!0`        | `true`                    |
| Chuỗi không rỗng `!""` | `true`                    |
| Đối tượng không phải `!null` | `true`                    |

⚠️ **Lưu ý**: Giá trị của đối tượng được tạo bằng toán tử `new` sẽ được chuyển đổi ngầm định sang giá trị Boolean là `true`.

Hai toán tử phủ định liên tiếp có thể chuyển đổi một số thành kiểu Boolean.

```js
!!undefined;
// false

!!null;
// false

!!1;
// true

!!'';
// false

!!'Hello';
// true

!!{};
// true

!![];
// true

!!function () {};
// true
```

### Môi trường chạy

Nhiều hàm tích hợp mong đợi kiểu dữ liệu của tham số là cố định, ví dụ như `alert(value)`, nó mong đợi `value` là kiểu dữ liệu String, nhưng nếu chúng ta truyền vào một kiểu dữ liệu Number hoặc Object hoặc bất kỳ kiểu dữ liệu không phải String nào khác, thì chuyển đổi kiểu dữ liệu ngầm định sẽ xảy ra. Đây là ảnh hưởng của môi trường chạy đến việc chuyển đổi kiểu dữ liệu.

Các phương thức tương tự bao gồm:

- `alert()`
- `parseInt()`

### Toán tử

#### Toán tử cộng

Khi toán tử cộng được sử dụng như một toán tử một ngôi, nó sẽ chuyển đổi giá trị đó thành kiểu Number.

```js
' ' +
// 0

'0' +
// 0

'10' +
// 10

'String' +
// NaN

true +
// 1

false +
// 0

undefined +
// 0

null +
// 0

[] +
// 0

![] +
// 0

[1] +
// 1

[1, 2] +
// NaN

[[1]] +
// 1

[[1, 2]] +
// NaN

{} +
// NaN

function () {};
// NaN

+'' +
// 0
```

Khi toán tử cộng được sử dụng như một toán tử hai ngôi, nó sẽ chuyển đổi giá trị theo kiểu dữ liệu của hai bên của toán tử.

Đầu tiên, khi một giá trị đối tượng tham chiếu được sử dụng trong toán tử cộng hai ngôi, nó liên quan đến việc chuyển đổi thành kiểu dữ liệu nguyên thủy. Trên thực tế, khi một đối tượng thực hiện một phép toán như cộng, nếu nó là kiểu nguyên thủy, thì không cần chuyển đổi. Nếu không, sẽ tuân theo các quy tắc sau:

- Gọi phương thức `valueOf()` của thể hiện, nếu có giá trị trả về là kiểu dữ liệu cơ bản, dừng quá trình ở đây; nếu không, tiếp tục
- Gọi phương thức `toString()` của thể hiện, nếu có giá trị trả về là kiểu dữ liệu cơ bản, dừng quá trình ở đây; nếu không, tiếp tục
- Không có giá trị nguyên thủy trả về, sẽ báo lỗi

Nếu cả hai bên của toán tử đều là kiểu dữ liệu nguyên thủy, thì sẽ tuân theo các quy tắc sau:

- **Toán tử nối chuỗi**: Nếu hai toán hạng chỉ cần một toán hạng là kiểu String, thì toán hạng còn lại sẽ được chuyển đổi thành kiểu String bằng cách gọi phương thức `String()` và sau đó nối chuỗi.
- **Toán tử số học**: Nếu cả hai toán hạng đều không phải là kiểu String, cả hai toán hạng sẽ được chuyển đổi thành kiểu Number bằng cách gọi phương thức `Number()` ngầm định (nếu không thể chuyển đổi thành số, nó sẽ trở thành `NaN`) và sau đó thực hiện phép toán cộng.

Việc chuyển đổi thành kiểu Number và kiểu String đều tuân theo một nguyên tắc: Nếu giá trị đó là kiểu dữ liệu nguyên thủy, nó sẽ được chuyển đổi trực tiếp thành kiểu String hoặc kiểu Number. Nếu giá trị đó là kiểu dữ liệu tham chiếu, thì trước tiên nó sẽ được chuyển đổi thành kiểu dữ liệu nguyên thủy bằng một phương pháp cố định, sau đó chuyển đổi thành kiểu String hoặc kiểu Number. [ToPrimitive](#ToPrimitive)

⚠️ **Lưu ý**: Khi `{}` được sử dụng với toán tử cộng, `{}` trước đó sẽ được JavaScript hiểu là một khối trống và bỏ qua nó.

```js
"1" + 1             // "11"
"1" + "1"           // "11"
"1" + true          // "1true"
"1" + NaN           // "NaN"
"1" + []            // "1"
"1" + {}            // "1[object Object]"
"1" + function(){}  // "1function(){}"
"1" + new Boolean() // "1false"

1 + NaN             // NaN
1 + "true"          // "1true"
1 + true            // 2
1 + undefined       // NaN
1 + null            // 1

1 + []              // "1"
1 + [1, 2]          // "11,2"
1 + {}              // "1[object Object]"
1 + function(){}    // "1function(){}"
1 + Number()        // 1
1 + String()        // "1"

[] + []             // ""
{} + {}             // "[object Object][object Object]"
{} + []             // 0
{a: 0} + 1          // 1
[] + {}             // "[object Object]"
[] + !{}            // "false"
![] + []            // "false"
'' + {}             // "[object Object]"
{} + ''             // 0
[]["map"] + []      // "function map(){ [native code] }"
[]["a"] + []        // "undefined"
[][[]] + []         // "undefined"
+!![] + []          // 1
+!![]               // 1
1-{}                // NaN
1-[]                // 1
true - 1            // 0
{} - 1              // -1
[] !== []           // true
[]['push'](1)       // 1

(![]+[])[+[]]       // "f"
(![]+[])[+!![]]     // "a"
```

#### Toán tử so sánh bằng

Toán tử so sánh bằng ` == ` sẽ chuyển đổi giá trị đối tượng thành kiểu dữ liệu nguyên thủy trước khi so sánh.

- Nếu một trong hai giá trị là giá trị Boolean, trước khi so sánh, giá trị đó sẽ được chuyển đổi thành giá trị số.
- Nếu một trong hai giá trị là chuỗi, và giá trị còn lại là số, chuỗi sẽ được chuyển đổi thành số bằng cách sử dụng hàm `Number()`.
- Nếu một trong hai giá trị là đối tượng và giá trị còn lại không phải là đối tượng, thì phương thức `valueOf()` của đối tượng sẽ được gọi và kết quả thu được sẽ được so sánh theo các quy tắc trước đó.
- `null` và `undefined` được coi là bằng nhau.
- Nếu một giá trị là `NaN`, kết quả sẽ là `false`.
- Nếu cả hai giá trị đều là đối tượng, chúng sẽ được so sánh xem chúng có trỏ đến cùng một đối tượng hay không.

```js
'1' == true; // true
'1' == 1; // true
'1' == {}; // false
'1' == []; // false

undefined == undefined; // true
undefined == null; // true
null == null; // true
```

#### Toán tử so sánh

[Toán tử so sánh](../expressions/comparation-operators): sẽ chuyển đổi các kiểu dữ liệu khác thành kiểu Number trước khi so sánh (ngoại trừ đối tượng kiểu Date).

- Nếu cả hai giá trị đều là số, thì sẽ thực hiện so sánh **số**.
- Nếu cả hai giá trị đều là chuỗi, thì sẽ thực hiện so sánh **giá trị mã ASCII** của chuỗi.
  - Nếu chuỗi có nhiều ký tự, thì so sánh từ trái sang phải theo thứ tự.
- Nếu chỉ có một giá trị là số, thì giá trị còn lại sẽ được chuyển đổi thành số và thực hiện so sánh **số**.
- Nếu một giá trị là đối tượng, thì phương thức `valueOf()` sẽ được gọi (nếu đối tượng không có phương thức `valueOf()` thì phương thức `toString()` sẽ được gọi), kết quả thu được sẽ được so sánh theo các quy tắc trước đó.
- Nếu một giá trị là giá trị Boolean, thì nó sẽ được chuyển đổi thành **số** trước khi so sánh.

📍 `NaN` là một giá trị rất đặc biệt, nó không bằng bất kỳ giá trị kiểu dữ liệu nào, bao gồm chính nó, đồng thời khi so sánh với bất kỳ kiểu dữ liệu nào khác cũng trả về `false`.

```js
5 > 10;
// false

'2' > 10;
// false

'2' > '10';
// true

'abc' > 'b';
// false

'abc' > 'aad';
// true
```

**Bảng chuyển đổi kiểu dữ liệu nguyên thủy JavaScript**

| Giá trị nguyên thủy | Chuyển đổi thành kiểu số | Chuyển đổi thành kiểu chuỗi | Chuyển đổi thành kiểu Boolean |
| :----------------- | :---------------------- | :-------------------------- | :---------------------------- |
| false              | 0                       | "false"                     | false                         |
| true               | 1                       | "true"                      | true                          |
| 0                  | 0                       | "0"                         | <span style="color:red">true</span>   |
| 1                  | 1                       | "1"                         | true                          |
| "0"                | <span style="color:red">0</span>                       | "0"                         | <span style="color:red">true</span>   |
| "000"              | <span style="color:red">0</span>                       | "000"                       | <span style="color:red">true</span>   |
| "1"                | 1                       | "1"                         | true                          |
| NaN                | NaN                     | "NaN"                       | false                         |
| Infinity           | Infinity                | "Infinity"                  | true                          |
| -Infinity          | -Infinity               | "-Inifinity"                | true                          |
| ""                 | <span style="color:red">0</span>                       | ""                          | <span style="color:red">false</span>  |
| " "                | 0                       | " "                         | true                          |
| "20"               | 20                      | "20"                        | true                          |
| "Hello"            | NaN                     | "Hello"                     | true                          |
| []                 | 0                       | ""                          | true                          |
| [20]               | 20                      | "20"                        | true                          |
| [10, 20]           | NaN                     | "10,20"                     | true                          |
| ["Hello"]          | NaN                     | "Hello"                     | true                          |
| ["Hello", "World"] | NaN                     | "Hello,World"               | true                          |
| function(){}       | NaN                     | "function(){}"              | true                          |
| {}                 | NaN                     | "[object Object]"           | true                          |
| null               | 0                       | "null"                      | false                         |
| undefined          | NaN                     | "undefined"                 | false                         |

## Câu hỏi thường gặp

> `(a==1)&&(a==2)&&(a==3)` có thể trả về `true` không?

Thực tế là có thể, chính vì trong trường hợp so sánh ` == `, chuyển đổi kiểu dữ liệu ngầm định sẽ xảy ra. Nếu tham số không phải là một đối tượng kiểu Date, chuyển đổi kiểu dữ liệu sẽ được thực hiện, trước tiên là `valueOf()` sau đó là `toString()`. Vì vậy, chỉ cần thay đổi phương thức `valueOf()` hoặc `toString()` mặc định của đối tượng là có thể đạt được kết quả như vậy:

```js
const a = {
  num: 0,
  valueOf: function () {
    return (this.num += 1);
  },
};

const eq = a == 1 && a == 2 && a == 3;
console.log(eq);
// true

// Hoặc thay đổi phương thức toString
const num = 0;
Function.prototype.toString = function () {
  return ++num;
};
function a() {}

// Hoặc thay đổi phương thức toPrimitive (kiểu Symbol) trong ES6
const a = {
  [Symbol.toPrimitive]: (function (i) {
    return function () {
      return ++i;
    };
  })(0),
};
```

Mỗi lần so sánh bằng, phương thức `valueOf()` sẽ được gọi một lần, giá trị tự tăng 1, vì vậy nó có thể đạt được kết quả như mong muốn.

Ngoài ra, phép trừ cũng tương tự:

```js
const a = {
  num: 4,
  valueOf: function () {
    return (this.num -= 1);
  },
};

const res = a == 3 && a == 2 && a == 1;
console.log(res);
```
