---
title: JS Comparation Operators
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Toán tử so sánh

Toán tử so sánh so sánh các toán hạng của nó và trả về một giá trị logic dựa trên xem biểu thức có đúng hay không.

Toán tử so sánh có thể chia thành **toán tử quan hệ** và **toán tử bằng nhau**.

- Các toán hạng có thể là số, chuỗi, logic hoặc giá trị đối tượng.
- So sánh chuỗi dựa trên thứ tự từ điển tiêu chuẩn sử dụng giá trị Unicode.
- Trong hầu hết các trường hợp, nếu hai toán hạng không cùng loại, JavaScript sẽ cố gắng chuyển đổi chúng thành loại phù hợp để so sánh. Hành vi này thường xảy ra khi so sánh số làm toán hạng.
- Một ngoại lệ với việc chuyển đổi kiểu là khi sử dụng các toán tử ` === ` và ` !== ` , chúng thực hiện so sánh bằng nhau và khác nhau một cách nghiêm ngặt. Các toán tử này không chuyển đổi kiểu của các toán hạng trước khi kiểm tra tính bằng nhau. Bảng dưới đây mô tả các toán tử so sánh trong ví dụ mã.

## Toán tử quan hệ

| Toán tử   | Mô tả                                          | Ví dụ trả về `true` |
| ---------- | --------------------------------------------- | ------------------ |
| Lớn hơn `>`      | Trả về `true` nếu toán hạng bên trái lớn hơn toán hạng bên phải       | `b > a`            |
| Lớn hơn hoặc bằng `>=` | Trả về `true` nếu toán hạng bên trái lớn hơn hoặc bằng toán hạng bên phải | `b >= a` `a >= 1`  |
| Nhỏ hơn `<`      | Trả về `true` nếu toán hạng bên trái nhỏ hơn toán hạng bên phải       | `a < b` `1 < 2`    |
| Nhỏ hơn hoặc bằng `<=` | Trả về `true` nếu toán hạng bên trái nhỏ hơn hoặc bằng toán hạng bên phải | `a <= b` `b <= 5`  |

## Toán tử bằng nhau

| Toán tử   | Mô tả                                    | Ví dụ trả về `true`             |
| ------------ | --------------------------------------- | ------------------------------ |
| Bằng `==`    | Trả về `true` nếu hai toán hạng bằng nhau | `a == 1` `'1' == 2` `1 == '1'` |
| Không bằng `!=`  | Trả về `true` nếu hai toán hạng không bằng nhau | `a != 2` `b != '1'`            |
| Tuyệt đối bằng ` === `   | Trả về `true` nếu hai toán hạng bằng nhau và cùng loại   | `a === 1`                      |
| Tuyệt đối không bằng ` !== ` | Trả về `true` nếu hai toán hạng không bằng nhau hoặc không cùng loại | `a !== '1'` `1 !== '1'`        |

### Thuật toán so sánh tương đương trừu tượng

> 1. Nếu Type(x) giống với Type(y), thì
>    1. Nếu Type(x) là Undefined, trả về `true`.
>    2. Nếu Type(x) là Null, trả về `true`.
>    3. Nếu Type(x) là Number, thì
>       1. Nếu x là NaN, trả về `false`.
>       2. Nếu y là NaN, trả về `false`.
>       3. Nếu x có cùng giá trị Number với y, trả về `true`.
>       4. Nếu x là +0 và y là -0, trả về `true`.
>       5. Nếu x là -0 và y là +0, trả về `true`.
>       6. Trả về `false`.
>    4. Nếu Type(x) là String,
>       1. Nếu x và y là cùng một chuỗi ký tự (cùng độ dài và cùng các ký tự ở các vị trí tương ứng), trả về `true`.
>       2. Ngược lại, trả về `false`.
>    5. Nếu Type(x) là Boolean,
>       1. Nếu x và y đều là `true` hoặc đều là `false`, trả về `true`.
>       2. Ngược lại, trả về `false`.
>    6. Nếu x và y tham chiếu đến cùng một đối tượng, trả về `true`. Ngược lại, trả về `false`.
> 2. Nếu x là null và y là undefined, trả về `true`.
> 3. Nếu x là undefined và y là null, trả về `true`.
> 4. Nếu Type(x) là Number và Type(y) là String, trả về kết quả của so sánh `x == ToNumber(y)`.
> 5. Nếu Type(x) là String và Type(y) là Number, trả về kết quả của so sánh `ToNumber(x) == y`.
> 6. Nếu Type(x) là Boolean, trả về kết quả của so sánh `ToNumber(x) == y`.
> 7. Nếu Type(y) là Boolean, trả về kết quả của so sánh `x == ToNumber(y)`.
> 8. Nếu Type(x) là String hoặc Number và Type(y) là Object, trả về kết quả của so sánh `x == ToPrimitive(y)`.
> 9. Nếu Type(x) là Object và Type(y) là String hoặc Number, trả về kết quả của so sánh `ToPrimitive(x) == y`.
> 10. Trả về `false`.

Theo định nghĩa tương đương trên:

- So sánh chuỗi có thể được thực hiện theo cách này: `'' + a == '' + b`
- So sánh số có thể được thực hiện theo cách này: `+a == +b`
- So sánh boolean có thể được thực hiện theo cách này: `!a == !b`

Các phép so sánh tương đương đảm bảo các điều sau:

- `A !== B` tương đương với `!(A == B)`
- `A == B` tương đương với `B == A`, trừ khi thứ tự đánh giá của A và B.

Toán tử bằng nhau không luôn là bắc cầu. Ví dụ, hai đối tượng String khác nhau nhưng đều biểu diễn cùng một giá trị chuỗi được coi là bằng nhau bởi toán tử ` == `, nhưng hai đối tượng chuỗi không bằng nhau.

- `new String('a') == 'a'` và `'a' == new String('a')` đều là `true`
- `new String('a') == new String('a')` là `false`

So sánh chuỗi được thực hiện bằng cách đơn giản kiểm tra xem chuỗi các đơn vị mã ký tự có giống nhau không. Nó không thực hiện định nghĩa bằng nhau phức tạp hơn dựa trên ngữ nghĩa hoặc thứ tự sắp xếp được định nghĩa trong quy tắc Unicode. Do đó, các giá trị chuỗi được coi là bằng nhau theo tiêu chuẩn Unicode có thể được phát hiện là không bằng nhau. Trong thực tế, thuật toán này giả định rằng hai chuỗi đã ở dạng chuẩn hóa.

### So sánh giữa các kiểu dữ liệu tham chiếu

```js
const a = function() {};
const b = function() {};

console.log(a === b);
// false

console.log([] === []);
// false

console.log({} === {});
// false
```

Khi chúng ta truy cập vào giá trị của một kiểu dữ liệu tham chiếu (đối tượng, mảng, hàm, v.v.), chúng ta trước tiên lấy con trỏ địa chỉ của đối tượng đó từ ngăn xếp, sau đó lấy dữ liệu cần thiết từ bộ nhớ heap.

Biến `a` thực tế lưu trữ một con trỏ đến đối tượng trong bộ nhớ heap, trong khi biến `b` lưu trữ một con trỏ đến đối tượng khác trong bộ nhớ heap. Mặc dù giá trị của hai đối tượng này là giống nhau, chúng là các đối tượng độc lập chiếm không gian bộ nhớ riêng biệt, nên chúng không bằng nhau.

Khi gán giá trị của một biến kiểu dữ liệu tham chiếu cho một biến khác, địa chỉ con trỏ không gian bộ nhớ của biến trước được sao chép, vì vậy cả hai đều trỏ đến cùng một đối tượng trong bộ nhớ heap.
