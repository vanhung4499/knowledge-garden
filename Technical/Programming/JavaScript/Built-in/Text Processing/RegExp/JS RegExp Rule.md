---
title: JS RegExp Rule
tags: [js, programming, regex]
categories: [js, programming, regex]
date created: 2023-08-07
date modified: 2023-08-07
---

# Cú pháp của RegExp

## Ký tự đặc biệt

**Ký tự đặc biệt (Meta-Character)** là các ký tự đặc biệt trong biểu thức chính quy, có ý nghĩa đặc biệt và được sử dụng để xác định mẫu xuất hiện của các ký tự đứng trước (ký tự đứng trước ký tự đặc biệt) trong đối tượng mục tiêu.

| Ký tự        | Tên          | Đối tượng khớp                                                               |
| ------------ | ------------ | ----------------------------------------------------------------------------- |
| `.`          | Dấu chấm     | Một ký tự bất kỳ (ngoại trừ ký tự xuống dòng `\r`, ký tự xuống dòng `\n`, ký tự phân đoạn dòng `\u2028` và ký tự phân đoạn đoạn `\u2029`) |
| `[]`         | Nhóm ký tự   | Một ký tự duy nhất trong danh sách                                               |
| `[^]`        | Nhóm ký tự phủ định | Một ký tự duy nhất không có trong danh sách                                     |
| `?`          | Dấu hỏi      | Khớp 0 hoặc 1 lần                                                              |
| `*`          | Dấu sao      | Khớp 0 hoặc nhiều lần                                                           |
| `+`          | Dấu cộng     | Khớp 1 hoặc nhiều lần                                                           |
| `{min,max}`  | Lượng từ khoảng | Khớp ít nhất min lần và tối đa max lần                                          |
| `^`          | Dấu mũ       | Vị trí bắt đầu của dòng                                                         |
| `$`          | Dấu đô la    | Vị trí kết thúc của dòng                                                        |
| `|`          | Dấu đứng trước | Phân tách hai biểu thức bên trái và bên phải                                      |
| `()`         | Dấu ngoặc    | Giới hạn phạm vi của cấu trúc lựa chọn nhiều, đánh dấu phạm vi ảnh hưởng của lượng từ, là tham chiếu nghịch đảo cho văn bản bắt được |
| `\1,\2…`   | Tham chiếu nghịch đảo | Khớp với văn bản được khớp bởi biểu thức trong ngoặc đơn trước đó                 |

## Nhóm ký tự

### Ký tự đặc biệt trong nhóm ký tự

Bằng cách sử dụng các ký tự nhóm ký tự như `[0-9]`, `[a-z]`, chúng ta có thể dễ dàng biểu thị các ký tự số và chữ cái thường. Đối với các nhóm ký tự phổ biến như vậy, biểu thức chính quy cung cấp cú pháp đơn giản hơn, đó là **nhóm ký tự tắt (Shorthands)**.

Các nhóm ký tự tắt phổ biến bao gồm `\d`, `\w`, `\s`, trong đó:

- `\d` đại diện cho (Digit) các ký tự số
- `\w` đại diện cho (Word) các ký tự từ
- `\s` đại diện cho (Space) các ký tự khoảng trắng

Biểu thức chính quy cũng cung cấp cú pháp tương ứng cho các nhóm ký tự phủ định: `\D`, `\W`, `\S`. Chúng giống nhau về cú pháp, chỉ khác nhau ở chữ hoa, và chúng khớp với các ký tự không thuộc nhóm ký tự tương ứng.

| Ký tự | Mô tả                                                         |
| ----- | ------------------------------------------------------------- |
| `\d`  | Chữ số, tương đương với `[0-9]`                                |
| `\D`  | Không phải chữ số, tương đương với `[^0-9]`                     |
| `\s`  | Ký tự khoảng trắng, tương đương với `[\f\n\r\t\u000B\u0020]`   |
| `\S`  | Không phải ký tự khoảng trắng, tương đương với `[^\f\n\r\t\u000B\u0020]` |
| `\w`  | Chữ cái, chữ số và gạch dưới, tương đương với `[0-9A-Za-z_]`    |
| `\W`  | Không phải chữ cái, chữ số và gạch dưới, tương đương với `[^0-9A-Za-z_]` |

### Ký tự bất kỳ

| Ký tự | Mô tả                                                                                     |
| ----- | ----------------------------------------------------------------------------------------- |
| `.`   | Đại diện cho bất kỳ ký tự nào (ngoại trừ ký tự xuống dòng `\r`, ký tự xuống dòng `\n`, ký tự phân đoạn dòng `\u2028` và ký tự phân đoạn đoạn `\u2029`) |

> ⚠️ **Lưu ý**: Mặc dù thường nói rằng dấu chấm đại diện cho bất kỳ ký tự nào, nhưng thực tế không phải lúc nào cũng đúng.
>
> Bằng cách sử dụng tính chất phủ định, chúng ta có thể đạt được một số hiệu ứng thông minh. Ví dụ, `[\s\S]`, `[\w\W]`, `[\d\D]` đều có thể đại diện cho bất kỳ ký tự nào.

**Khớp với bất kỳ ký tự**

```js
/./.test('\r');
// false

/[\s\S]/.test('\r');
// true
```

### Ký tự thoát

**Ký tự thoát (Escape)** được biểu diễn bằng dấu gạch chéo ngược `\` kết hợp với ký tự, có tổng cộng 3 trường hợp.

| Ký tự        | Mô tả                       |
| ------------ | --------------------------- |
| `\` + ký tự đặc biệt | Khớp với ký tự đặc biệt      |
| `\` + `]` hoặc `\` + `}` | Không cần thoát ký tự dấu ngoặc vuông phải và dấu ngoặc nhọn phải |
| `\` + ký tự không phải đặc biệt | Đại diện cho một số ký tự đặc biệt không thể in ra |
| `\` + bất kỳ ký tự khác | Mặc định khớp với ký tự này |

<br />

Vì các ký tự đặc biệt có ý nghĩa đặc biệt, nên không thể khớp trực tiếp với chúng. Nếu muốn khớp với chính chúng, cần thêm dấu gạch chéo ngược `\` phía trước.

```js
/1+1/.test('1+1');
// false

/1\+1/.test('1+1');
// true

/\*/.test('*');
// true

/*/.test('*');
// Lỗi
```

Tuy nhiên, không phải tất cả các ký tự đặc biệt đều cần được thoát. Dấu ngoặc vuông phải `]` và dấu ngoặc nhọn phải `}` không cần được thoát.

```js
/]/.test(']');
// true
/\]/.test(']');
// true

/\}/.test('}');
// true
/}/.test('}');
// true
```

`\` kết hợp với ký tự không phải đặc biệt đại diện cho một số ký tự đặc biệt không thể in ra.

| Ký tự | Mô tả                                                         |
| ----- | ------------------------------------------------------------- |
| `\0`  | Ký tự NUL `\u0000`                                            |
| `[\b]`  | Khớp với ký tự backspace `\u0008`，không nên nhầm lẫn với `\b` |
| `\t`  | Ký tự tab `\u0009`                                            |
| `\n`  | Ký tự xuống dòng `\u000A`                                      |
| `\v`  | Ký tự tab dọc `\u000B`                                        |
| `\f`  | Ký tự trang mới `\u000C`                                       |
| `\r`  | Ký tự carriage return `\u000D`                                 |
| `\xnn`  | Ký tự Latin được chỉ định bởi số hex `nn`                      |
| `\uxxxx` | Ký tự Unicode được chỉ định bởi số hex `xxxx`                   |
| `\cX` | Ký tự điều khiển `^X`，đại diện cho `ctrl-[X]` ，trong đó X là một trong các chữ cái từ A-Z, được sử dụng để khớp với ký tự điều khiển |

`\` kết hợp với bất kỳ ký tự khác, mặc định sẽ khớp với ký tự đó, có nghĩa là dấu gạch chéo ngược `(\)` bị bỏ qua.

```js
/\x/.test('x');
// true

/\y/.test('y');
// true

/\z/.test('z');
// true
```

### Thoát kép

Do tham số của hàm tạo RegExp là một chuỗi, nên trong một số trường hợp, cần thực hiện **thoát kép** cho các ký tự.

Ký tự `\` trong chuỗi biểu thức chính quy thường được thoát thành `\\`.

```js
const reg1 = /\.at/;
// Tương đương với
const reg2 = new RegExp('\\.at');

const reg3 = /name\/age/;
// Tương đương với
const reg4 = new RegExp('name\\/age');

const reg5 = /\w\\hello\\123/;
// Tương đương với
const reg6 = new RegExp('\\w\\\\hello\\\\123');
```

## Tập ký tự

**Tập ký tự (Character Sets)**, còn được gọi là nhóm ký tự hoặc tập hợp ký tự, là một tập hợp các ký tự được biểu thị bằng cặp dấu ngoặc vuông, và nó khớp với bất kỳ một trong các ký tự trong tập hợp đó.

| Ký tự     | Mô tả                                                                                          |
| --------- | ---------------------------------------------------------------------------------------------- |
| `[xyz]`   | Một tập hợp ký tự, còn được gọi là nhóm ký tự. Khớp với bất kỳ một trong các ký tự trong tập hợp đó. Có thể sử dụng dấu gạch ngang để chỉ định một phạm vi. |
| `[^xyz]`  | Một tập hợp ký tự phủ định hoặc bổ sung, còn được gọi là nhóm ký tự phủ định. Khớp với bất kỳ ký tự nào không nằm trong tập hợp đó. Có thể sử dụng dấu gạch ngang để chỉ định một phạm vi. |

<br />

```js
// Khớp với một trong các chữ số từ 0-9
const regexp = /[0123456789]/;

regexp.test('1');
// true

regexp.test('a');
// false
```

Thứ tự các ký tự trong tập hợp không ảnh hưởng đến chức năng của tập hợp ký tự, và việc lặp lại các ký tự không có tác động.

Ba biểu thức sau đây là tương đương.

```js
const regexp1 = /[0123456789]/;

const regexp2 = /[9876543210] /;

const regexp3 = /[1234567890123456789]/;
```

### Phạm vi

Biểu thức chính quy sử dụng dấu gạch ngang `-` để biểu thị phạm vi, giúp rút gọn các nhóm ký tự.

```js
const regexp1 = /[0123456789]/;
// Tương đương với
const regexp2 = /[0-9]/;

const regexp3 = /[abcdefghijklmnopqrstuvwxyz]/;
// Tương đương với
const regexp4 = /[a-z]/;
```

Dấu gạch ngang `-` trong phạm vi được xác định dựa trên mã ASCII, với ký tự có mã nhỏ hơn được đặt trước và ký tự có mã lớn hơn được đặt sau.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230807203519.png)

Vì vậy, `[0-9]` là hợp lệ, trong khi `[9-0]` sẽ gây ra lỗi.

```js
// Khớp với một trong các chữ số từ 0-9
const regexp1 = /[0-9]/;
regexp1.test('1');
// true

const regexp2 = /[9-0]/;
// Lỗi
regexp2.test('1');
```

Trong một nhóm ký tự, bạn có thể liệt kê nhiều phạm vi bằng cách sử dụng nhiều dấu gạch ngang `-`.

```js
const regexp1 = /[0-9a-zA-Z]/;
// Khớp với chữ số, chữ cái viết hoa và chữ cái viết thường
const regexp2 = /[0-9a-fA-F]/;
// Khớp với chữ số và các chữ cái a-f (cả viết hoa và viết thường), thường được sử dụng để kiểm tra ký tự hex

const regexp3 = /[0-9a-fA-F]/.test('d');
// true
const regexp4 = /[0-9a-fA-F]/.test('x');
// false
```

Chỉ có trong nhóm ký tự, dấu gạch ngang `-` là một ký tự đặc biệt, biểu thị một phạm vi. Nếu không, nó chỉ khớp với dấu gạch ngang thông thường.

Nếu dấu gạch ngang `-` xuất hiện ở đầu hoặc cuối nhóm ký tự, nó sẽ được coi là dấu gạch ngang thông thường, không phải một phạm vi.

```js
// Khớp với dấu gạch ngang
/-/.test('-');
// true

/[-]/.test('-');
// true

// Khớp với số từ 0-9 hoặc dấu gạch ngang
/[0-9]/.test('-');
// false

/[0-9-]/.test('-');
// true

/[0-9\-]/.test('-');
// true

/[-0-9]/.test('-');
// true

/[\-0-9]/.test('-');
// true
```

### Phủ định

Một loại khác của nhóm ký tự là **nhóm ký tự phủ định**, được biểu thị bằng ký tự `^` ngay sau dấu ngoặc vuông trái `[`. Nó khớp với bất kỳ ký tự nào không được liệt kê trong nhóm ký tự đó.

Vì vậy, `[^0-9]` khớp với bất kỳ ký tự nào ngoại trừ các ký tự từ 0-9.

```js
// Khớp với chuỗi có chữ số đầu tiên và ký tự không phải chữ số thứ hai
/[0-9][^0-9]/.test('1e');
// true
/[0-9][^0-9]/.test('q2');
// false
```

Trong nhóm ký tự, ký tự `^` biểu thị phủ định, nhưng ngoài nhóm ký tự, ký tự `^` biểu thị một điểm neo dòng (một điểm bắt đầu dòng).

Ký tự `^` là một ký tự đặc biệt, nên trong nhóm ký tự, nếu không nằm ngay sau dấu ngoặc vuông trái `[`, nó có thể đại diện cho chính nó mà không cần thoát.

```js
// Khớp với chuỗi "abc" và ký tự "^"
/[a-c^]/.test('^');
// true

/[a-c\^]/.test('^');
// true

/[\^a-c]/.test('^');
// true
```

Trong nhóm ký tự, chỉ có 4 ký tự `^`, `-`, `[`, `]` có thể được coi là ký tự đặc biệt, các ký tự khác trong nhóm ký tự chỉ đại diện cho chính nó.

```js
/[[1]]/.test('[');
// false

/[[1]]/.test(']');
// false

/[\1]/.test('\\');
// false

/[^^]/.test('^');
// false

/[1-2]/.test('-');
// false

/[\[1\]]/.test('[');
// true

/[\[1\]]/.test(']');
// true

/[\\]/.test('\\');
// true

/[^]/.test('^');
// true

/[1-2\-]/.test('-');
// true
```

## Số lượng từ

Biểu thức chính quy cung cấp các từ chỉ số lượng, để xác định số lần xuất hiện của một mẫu cụ thể.

| Ký tự                                          | Mô tả                                                                         |
| :-------------------------------------------- | :--------------------------------------------------------------------------- |
| `x*`                                          | Tương đương với `x{0,}` (khớp với bất kỳ số lần nào)                                              |
| `x+`                                          | Tương đương với `x{1,}` (khớp ít nhất một lần)                                               |
| `x?`                                          | Tương đương với `x{0,1}` (không khớp hoặc khớp một lần)                                         |
| `x*?` hoặc `x+?`                                | Tương đương với `*` và `+` ký tự, nhưng khớp với lần xuất hiện nhỏ nhất                              |
| `x(?=y)`                                      | Chỉ khớp `x` nếu `x` được theo sau bởi `y` (xem chi tiết tại [Lookahead](#lookahead))     |
| `x(?!y)`                                      | Chỉ khớp `x` nếu `x` không được theo sau bởi `y` (xem chi tiết tại [Lookahead](#lookahead)) |
| `x\|y` (không có `\` ở đây) | Khớp `x` hoặc `y` |
| `x{n}`                                        | Khớp chính xác `n` lần (`n` là số nguyên dương)                                                  |
| `x{n,m}`                                      | Khớp ít nhất `n` lần và tối đa `m` lần (`n` và `m` là số nguyên dương)                          |
| `x{n,}`                                       | Khớp ít nhất `n` lần (`n` là số nguyên dương)                                              |

Mã bưu điện

```js
// Khớp với 6 chữ số mã bưu điện
const regexp = /\d{6}/;
```

Có một số từ trong tiếng Anh Mỹ và tiếng Anh Anh được viết khác nhau, ví dụ như `traveler` và `traveller`, `favor` và `favour`, `color` và `colour`.

```js
// Khớp với cả từ tiếng Anh Mỹ và tiếng Anh Anh
const regexp1 = /travell?er/;

const regexp2 = /favou?r/;

const regexp3 = /colou?r/;
```

Có hai loại giao thức là HTTP và HTTPS:

```js
const regexp1 = /https?/;
```

### Lựa chọn

Dấu gạch chéo ngang `|` trong biểu thức chính quy đại diện cho lựa chọn hoặc trong một cấu trúc lựa chọn, các mẫu con được phân tách bằng dấu gạch chéo ngang `|` cũng được gọi là các nhánh lựa chọn. Trong một cấu trúc lựa chọn, dấu ngoặc `()` được sử dụng để xác định phạm vi của cả cấu trúc lựa chọn. Nếu không có dấu ngoặc, toàn bộ biểu thức được coi là một cấu trúc lựa chọn.

Thứ tự thử khớp của các nhánh lựa chọn là từ trái sang phải, cho đến khi tìm thấy một nhánh khớp. Nếu một nhánh lựa chọn khớp, các nhánh lựa chọn bên phải sẽ bị bỏ qua. Nếu không có nhánh lựa chọn con nào khớp, toàn bộ cấu trúc lựa chọn sẽ không khớp.

```js
/12|23|34/.exec('1');
// null

/12|23|34/.exec('12');
// ['12']

/12|23|34/.exec('23');
// ['23']

/12|23|34/.exec('2334');
// ['23']
```

Địa chỉ IP thường có 3 dấu chấm và 4 phần số, mỗi phần số nằm trong khoảng từ 0 đến 255.

- 0-199: `[01]?\d\d?`
- 200-249: `2[0-4]\d`
- 250-255: `25[0-5]`

Địa chỉ IP:

```js
const ipRegExp = /((2[0-4]\d|25[0-5]|[0-1]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[0-1]?\d\d?)/;

ipRegExp.test('1.1.1.1');
// true

ipRegExp.test('1.1.1');
// false

ipRegExp.test('256.1.1.1');
// false
```

Tương tự, việc khớp thời gian cũng cần được xử lý theo từng phần:

```js
// Tháng (1-12)
0?\d|1[0-2]

// Ngày (1-31)
0?\d|[12]\d|3[01]

// Giờ (0-24)
0?\d|1\d|2[0-4]

// Phút (0-60)
0?\d|[1-5]\d|60
```

Số điện thoại di động thông thường có 11 chữ số, 3 chữ số đầu tiên là phân đoạn, 8 chữ số cuối cùng thông thường không có giới hạn. Ngoài ra, số điện thoại có thể bắt đầu bằng 0 hoặc +86.

- Bắt đầu: `(0|\+86)?`
- 3 chữ số đầu: `13\d|14[579]|15[0-35-9]|17[0135-8]|18\d`
- 8 chữ số cuối: `\d{8}`

```js
const phone = /(0|\+86)?(13\d|14[579]|15[0-35-9]|17[0135-8]|18\d)\d{8}/;

phone.test('13453250661');
// true

phone.test('1913250661');
// false

phone.test('1345325061');
// false
```

Trong cấu trúc lựa chọn, nên tránh sự trùng lặp trong các nhánh lựa chọn, vì điều này sẽ làm tăng đáng kể lượng tính toán phục hồi.

```js
// Ví dụ không chính xác 🙅‍♂️
const regexp = /a|[ab][0-9]|\w/;
```

### Mô hình tham lam

Mặc định, các từ khóa định lượng đều là **mô hình tham lam (Greedy quantifier)**, có nghĩa là chúng sẽ khớp với tất cả các ký tự tiếp theo cho đến khi không thỏa mãn quy tắc khớp nữa.

```js
// Phương thức exec trả về kết quả khớp dưới dạng một mảng
/a+/.exec('aaa');
// ['aaa']
```

### Mô hình lười biếng

**Mô hình lười biếng (Lazy quantifier)** là ngược lại với mô hình tham lam, khi thêm dấu hỏi `?` sau từ khóa định lượng, nó sẽ khớp với ít ký tự nhất có thể, và không tiếp tục khớp nữa khi điều kiện được đáp ứng.

| Ký tự     | Ý nghĩa                        |
| :------- | :---------------------------- |
| `{n}?`   | Khớp `n` lần                  |
| `{n,m}?` | Khớp ít nhất `n` lần và tối đa `m` lần |
| `{n,}?`  | Khớp ít nhất `n` lần           |
| `??`     | Tương đương với `{0,1}`        |
| `*?`     | Tương đương với `{0,}`         |
| `+?`     | Tương đương với `{1,}`         |

<br />

Ví dụ:

```js
/a+?/.exec('aaa');
// ['a']
```

Khớp mã nguồn giữa các thẻ `<script></script>` có vẻ dễ dàng

```js
const regexp = /<script>[\s\S]*<\/script>/;

regexp.exec('<script>alert("1");</script>');
// ["<script>alert("1");</script>"]
```

Nhưng nếu xuất hiện nhiều thẻ `script`, sẽ gặp vấn đề

```js
const regexp = /<script>[\s\S]*<\/script>/;

regexp.exec('<script>alert("1");</script><br><script>alert("2");</script>');
// ["<script>alert("1");</script><br><script>alert("2");</script>"]
```

Nó khớp cả thẻ không hợp lệ `<br>`, lúc này cần sử dụng mô hình lười biếng

```js
const regexp = /<script>[\s\S]*?<\/script>/;

regexp.exec('<script>alert("1");</script><br><script>alert("2");</script>');
// ["<script>alert("1");</script>"]
```

Trong JavaScript, `/* */` là một dạng chú thích trong tài liệu và có thể xuất hiện nhiều lần, lúc này cũng cần sử dụng mô hình lười biếng

```js
const regexp = /\/\*[\s\S]*?\*\//;

regexp.exec('/*abc*/<br>/*123*/');
// ["/*abc*/"]
```

## Nhóm và tham chiếu ngược

### Nhóm

Các từ khóa định lượng điều khiển số lần xuất hiện của phần tử trước nó, và phần tử này có thể là một ký tự, một nhóm ký tự hoặc một biểu thức.

Nếu một biểu thức được đặt trong dấu ngoặc đơn `()`, phần tử trong ngoặc đơn đó được gọi là **nhóm con**.

**Ví dụ 1**: Nếu muốn chuỗi `ab` xuất hiện 2 lần, ta viết `(ab){2}`. Nếu viết `ab{2}` thì `{2}` chỉ áp dụng cho `b`.

```js
/(ab){2}/.test('abab');
// true

/(ab){2}/.test('abb');
// false

/ab{2}/.test('abab');
// false

/ab{2}/.test('abb');
// true
```

**Ví dụ 2**: Số chứng minh nhân dân có độ dài là 15 hoặc 18 ký tự, nếu chỉ khớp độ dài, có thể viết là `\d{15,18}`, nhưng thực tế đó là sai vì nó bao gồm cả 15, 16, 17 và 18 ký tự.

```js
// Cách viết đúng
var idCard = /\d{15}(\d{3})?/;
```

**Ví dụ 3**: Địa chỉ email được chia thành hai phần bởi ký tự `@`, phần trước là tên người dùng và phần sau là tên miền.

Tên người dùng có thể chứa chữ số, chữ cái và dấu gạch dưới, thường có độ dài từ 1-64 ký tự, do đó biểu thức chính quy có thể được biểu diễn là `/\w{1,64}/`.

Tên miền thường có dạng `a.b.···.c`, trong đó `c` là tên miền chính và các phần còn lại là các tên miền con với số lượng không xác định, do đó biểu thức chính quy có thể được biểu diễn là `/([-a-zA-z0-9]{1,63}\.)+[-a-zA-Z0-9]{1,63}/`.

Vì vậy, biểu thức chính quy cho địa chỉ email như sau:

```js
const email = /\w{1,64}@([-a-zA-z0-9]{1,63}\.)+[-a-zA-Z0-9]{1,63}/;

email.test('q@qq.com');
// true

email.test('q@qq');
// false

email.test('q@a.qq.com');
// true
```

### Nhóm bắt

Dấu ngoặc đơn `()` không chỉ cho phép nhóm các phần tử lại mà còn lưu trữ nội dung của mỗi nhóm phù hợp, và sau đó có thể tham chiếu đến nội dung đã bắt được sau khi khớp hoàn tất. Vì đã bắt được nội dung, chức năng này được gọi là **nhóm bắt**.

Ví dụ, để khớp với chuỗi ngày tháng như `2016-06-23`

```js
const regexp = /(\d{4})-(\d{2})-(\d{2})/;
```

Khác với trước đây, ba giá trị năm, tháng và ngày được đặt trong dấu ngoặc đơn, từ trái sang phải là nhóm bắt thứ nhất, thứ hai và thứ ba, tương ứng với nhóm bắt thứ nhất, thứ hai và thứ ba.

JavaScript có 9 thuộc tính hàm xây dựng được sử dụng để lưu trữ các nhóm bắt.

`RegExp.$1`, `RegExp.$2`, `RegExp.$3` đến `RegExp.$9` được sử dụng để lưu trữ các nhóm bắt tương ứng từ nhất đến chín.

Khi gọi phương thức `exec()` hoặc `test()`, các thuộc tính này sẽ được tự động điền vào.

```js
/(\d{4})-(\d{2})-(\d{2})/.test('2016-06-23');
// true

console.log(RegExp.$1);
// '2016'

console.log(RegExp.$2);
// '06'

console.log(RegExp.$3);
// '23'

console.log(RegExp.$4);
// ''
```

Phương thức `exec()` được thiết kế đặc biệt để sử dụng với nhóm bắt, mảng trả về bởi phương thức này, phần tử đầu tiên là chuỗi khớp với toàn bộ mẫu, các phần tử khác là chuỗi khớp với các nhóm bắt trong mẫu.

```js
/(\d{4})-(\d{2})-(\d{2})/.exec('2016-06-23');
// ["2016-06-23", "2016", "06", "23"]
```

Nội dung bắt được bởi nhóm bắt không chỉ có thể được **sử dụng để trích xuất dữ liệu**, mà còn có thể được **sử dụng để thay thế**.

Phương thức `replace()` được sử dụng để thay thế dữ liệu, phương thức này nhận hai tham số, tham số đầu tiên là nội dung cần tìm kiếm và tham số thứ hai là nội dung thay thế.

```js
'2000-01-01'.replace(/-/g, '.');
// 2000.01.01
```

Trong phương thức `replace()`, cũng có thể tham chiếu đến nhóm bằng cách sử dụng `$num`, trong đó `num` là số thứ tự của nhóm tương ứng.

Chuyển đổi định dạng `2000-01-01` thành `01-01-2000`:

```js
'2000-01-01'.replace(/(\d{4})-(\d{2})-(\d{2})/g, '$3-$2-$1');
//'01-01-2000'
```

### Tham chiếu ngược

Trong tiếng Anh, nhiều từ có chứa các chữ cái trùng lặp, ví dụ như `shoot` hoặc `beep`. Nếu muốn kiểm tra xem một từ có chứa các chữ cái trùng lặp hay không, chúng ta cần sử dụng **tham chiếu ngược (back-reference)**.

Tham chiếu ngược cho phép chúng ta tham chiếu đến văn bản đã bắt được từ nhóm bên trong biểu thức chính quy, và có dạng `\num`, trong đó `num` là số thứ tự của nhóm được tham chiếu.

```js
// Chữ cái lặp lại
/([a-z])\1/

/([a-z])\1/.test('aa');
// true

/([a-z])\1/.test('ab');
// false
```

Tham chiếu ngược có thể được sử dụng để thiết lập mối quan hệ giữa các phần tử. Thẻ mở và thẻ đóng của một thẻ HTML là tương ứng với nhau.

```js
// Thẻ mở
const startIndex = /<([^>]+)>/

// Nội dung thẻ
const content = /[\s\S]*?/

// Khớp cặp thẻ
const couple = /<([^>]+)>[\s\S]*?<\/\1>/

/<([^>]+)>[\s\S]*?<\/\1>/.test('<a>123</a>');
// true

/<([^>]+)>[\s\S]*?<\/\1>/.test('<a>123</b>');
// false
```

### Nhóm không bắt

Ngoài nhóm bắt, biểu thức chính quy còn cung cấp **nhóm không bắt (non-capturing group)**, được biểu diễn bằng `(?:)`. Nhóm không bắt chỉ được sử dụng để giới hạn phạm vi hoạt động mà không bắt bất kỳ văn bản nào.

Ví dụ, để khớp với chuỗi `abcabc`, thông thường, có thể viết là `(abc){2}`, nhưng vì không cần bắt văn bản, chỉ cần giới hạn phạm vi của từ khóa định lượng, nên nên viết là `(?:abc){2}`.

```js
/(abc){2}/.test('abcabc');
// true

/(?:abc){2}/.test('abcabc');
// true
```

Vì nhóm không bắt không bắt văn bản, tương ứng với điều đó, nó cũng không có số thứ tự nhóm bắt.

```js
/(abc){2}/.test('abcabc');
// true
console.log(RegExp.$1);
// 'abc'

/(?:abc){2}/.test('abcabc');
// true
console.log(RegExp.$1);
// ''
```

Nhóm không bắt cũng không thể sử dụng tham chiếu ngược.

```js
/(?:123)\1/.test('123123');
// false

/(123)\1/.test('123123');
// true
```

Nhóm bắt và nhóm không bắt có thể xuất hiện cùng một biểu thức chính quy.

```js
/(\d)(\d)(?:\d)(\d)(\d)/.exec('12345');
// ["12345", "1", "2", "4", "5"]
```

### Khẳng định và phủ định

Trong biểu thức chính quy, có một số cấu trúc không thực sự khớp với văn bản, mà chỉ kiểm tra xem một điều kiện nào đó bên trái/phải vị trí hiện tại có đúng hay không. Các cấu trúc này được gọi là **khẳng định (assertion)**, còn được gọi là **mốc (anchor)**. Có ba loại khẳng định phổ biến:

- Biên từ
- Bắt đầu và kết thúc
- Nhìn xung quanh

### Biên từ

Trong xử lý văn bản, việc thay thế từ đơn có thể thường xuyên xảy ra, ví dụ như thay thế `row` bằng `line`. Tuy nhiên, nếu thay thế trực tiếp, không chỉ tất cả các từ `row` bị thay thế thành `line`, mà cả `row` bên trong từ cũng bị thay thế thành `line`. Để giải quyết vấn đề này, cần có cách để xác định từ `row` mà không phải là chuỗi `row`.

Để giải quyết vấn đề này, biểu thức chính quy cung cấp **biên từ (word boundary)**, được ký hiệu là `\b`, nó khớp với vị trí biên từ, không phải ký tự. `\b` khớp với một bên là ký tự từ `\w`, một bên là ký tự không phải từ `\W`.

Tương ứng với `\b`, còn có `\B`, đại diện cho không phải biên từ, nhưng thực tế thì `\B` ít được sử dụng.

```js
/\ban\b/.test('an apple');
// true

/\ban\b/.test('a an');
// true

/\ban\b/.test('an');
// true

/\ban\b/.test('and');
// false

/\ban\b/.test('ban');
// false
```

### Bắt đầu và kết thúc

Khẳng định phổ biến khác là `^` và `$`, chúng lần lượt khớp với vị trí bắt đầu và kết thúc của chuỗi, vì vậy chúng có thể được sử dụng để kiểm tra xem toàn bộ chuỗi có khớp với biểu thức hay không.

```js
// Khớp với từ đầu tiên
/^\w*/.exec('first word\nsecond word\nthird word');
// ['first']

// Khớp với từ cuối cùng
/\w*$/.exec('first word\nsecond word\nthird word');
// ['word']

/^a$/.test('a\n');
// false

/^a$/.test('a');
// true
```

`^` và `$` thường được sử dụng để loại bỏ khoảng trắng dư thừa ở đầu và cuối chuỗi, tương tự như phương thức `trim()` của đối tượng chuỗi `String`.

```js
function fnTrim(str) {
  str.replace(/^\s+|\s+$/, '');
}
console.log(fnTrim('      hello world   '));
// 'hello world'
```

### Nhìn xung quanh

**Nhìn xung quanh (Look-around)**, có thể được mô tả như việc dừng lại tại một vị trí và nhìn xung quanh. Nhìn xung quanh tương tự như biên từ, trong đó văn bản bên cạnh phải thỏa mãn một số điều kiện, nhưng nó không khớp với bất kỳ ký tự nào.

Nhìn xung quanh được chia thành **nhìn xung quanh theo chiều thuận (positive look-ahead)** và **nhìn xung quanh theo chiều phủ định (negative look-ahead)**.

| Ký tự     | Mô tả                                                         |
| :------- | :----------------------------------------------------------- |
| `x(?=y)` | Nhìn xung quanh theo chiều thuận, chỉ khớp với `x` nếu `x` được theo sau bởi `y` |
| `x(?!y)` | Nhìn xung quanh theo chiều phủ định, chỉ khớp với `x` nếu `x` không được theo sau bởi `y` |

<br />

```js
/a(?=b)/.exec('abc');
// ['a']

/a(?=b)/.exec('ac');
// null

/a(?!b)/.exec('abc');
// null

/a(?!b)/.exec('ac');
// ['a']

/a(?=b)b/.exec('abc');
// ['ab']
```

Mặc dù nhìn xung quanh cũng sử dụng dấu ngoặc đơn, nhưng nó không liên quan đến số thứ tự của nhóm bắt; tuy nhiên, nếu cấu trúc nhìn xung quanh chứa dấu ngoặc bắt, nó sẽ ảnh hưởng đến nhóm bắt.

```js
/ab(?=cd)/.exec('abcd');
// ['ab']

/ab(?=(cd))/.exec('abcd');
// ['ab','cd']
```

### Chế độ khớp

**Chế độ khớp (Match Mode)** là các quy tắc được sử dụng trong quá trình khớp. Đặt một chế độ cụ thể có thể thay đổi cách nhận dạng biểu thức chính quy.

### Chế độ không phân biệt chữ hoa chữ thường

Mặc định, biểu thức chính quy là **phân biệt chữ hoa chữ thường**. Bằng cách đặt cờ `i`, có thể **bỏ qua chữ hoa chữ thường (ignore case)**.

```js
/ab/.test('aB');
// false

/ab/i.test('aB');
// true
```

### Chế độ đa dòng

Mặc định, các ký tự `^` và `$` trong biểu thức chính quy khớp với vị trí bắt đầu và kết thúc của chuỗi toàn bộ. Bằng cách đặt cờ `m`, chế độ đa dòng được bật, chúng cũng có thể khớp với vị trí bắt đầu và kết thúc của một dòng văn bản.

```js
// Ví dụ 1
/world$/.test('hello world\n');
// false

/world$/m.test('hello world\n');
// true

// Ví dụ 2
/^b/.test('a\nb');
// false

/^b/m.test('a\nb');
// true
```

### Chế độ toàn cục

Mặc định, sau khi khớp thành công lần đầu tiên, đối tượng biểu thức chính quy sẽ dừng lại. Cờ `g` biểu thị **khớp toàn cục (global)**, khi đặt cờ `g`, đối tượng biểu thức chính quy sẽ khớp với tất cả các kết quả phù hợp, chủ yếu được sử dụng cho tìm kiếm và thay thế.

```js
'1a,2a,3a'.replace(/a/, 'b');
// '1b,2a,3a'

'1a,2a,3a'.replace(/a/g, 'b');
// '1b,2b,3b'
```

## Ưu tiên

Bảng dưới đây liệt kê thứ tự ưu tiên của các ký tự trong biểu thức chính quy, từ trên xuống dưới, ưu tiên giảm dần (giá trị ưu tiên càng cao, ưu tiên càng lớn).

| Ký tự                             | Tên ký tự           | Ưu tiên |
| :------------------------------- | :----------------- | :----- |
| `\` | Ký tự thoát | 5                 |
| `()` `(?!)` `(?=)` `[]`          | Dấu ngoặc, tập ký tự, nhìn xung quanh | 4      |
| `*` `+` `?` `{n}` `{n,}` `{n,m}` | Ký tự lặp               | 3      |
| `^` `$`                          | Vị trí bắt đầu và kết thúc của chuỗi       | 2      |
| `\|`                             | Lựa chọn               | 1      |

Do một trong các chức năng của dấu ngoặc là giới hạn phạm vi hoạt động của ký tự lặp, nên mức ưu tiên của nó cao hơn ký tự lặp.

```js
/ab{2}/.test('abab');
// false

/(ab){2}/.test('abab');
// true
```

Dấu `|` có mức ưu tiên thấp nhất, thấp hơn cả vị trí bắt đầu và kết thúc của chuỗi.

```js
/^ab|cd$/.test('abc');
// true

/^(ab|cd)$/.test('abc');
// false
```

## Giới hạn

Mặc dù biểu thức chính quy trong JavaScript khá mạnh mẽ, nhưng so với một số ngôn ngữ khác, nó thiếu một số tính năng.

Dưới đây là một số hạn chế của biểu thức chính quy trong JavaScript:

- Nhóm ký tự POSIX (chỉ hỗ trợ nhóm ký tự thông thường và nhóm ký tự loại trừ)
- Hỗ trợ Unicode (chỉ hỗ trợ một ký tự Unicode duy nhất)
- Giới hạn khớp với đầu và cuối chuỗi bằng `\A` và `\Z` (chỉ hỗ trợ `^` và `$`)
- Nhìn xung quanh theo chiều ngược (chỉ hỗ trợ nhìn xung quanh theo chiều thuận)
- Nhóm bắt có tên (chỉ hỗ trợ các nhóm bắt được đánh số từ 0-9)
- Chế độ đa dòng và chế độ chú thích (chỉ hỗ trợ `m`, `i`, `g`)
- Phạm vi mẫu
- Mẫu văn bản thuần túy
