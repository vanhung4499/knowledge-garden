---
title: JS Bitwise Operators
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Toán tử bit

Toán tử dịch bit xem các toán hạng của nó như là một chuỗi nhị phân 32 bit (gồm các số 0 và 1) thay vì là các số thập phân, bát phân hoặc thập lục phân. Ví dụ: số thập phân `9` được biểu diễn nhị phân là `1001`, toán tử dịch bit sẽ thực hiện các phép toán trên biểu diễn nhị phân này, nhưng kết quả trả về là một giá trị số chuẩn của JavaScript.

- Tất cả các số trong JavaScript được lưu trữ dưới dạng số dấu phẩy động 64 bit với gốc là 10. JavaScript không phải là một ngôn ngữ kiểu, khác với nhiều ngôn ngữ lập trình khác, JavaScript không xác định các loại số khác nhau như số nguyên, số ngắn, số dài, số dấu phẩy động, v.v.
- Độ chính xác của số nguyên (không sử dụng dấu chấm hoặc ký hiệu mũ) là tối đa 15 chữ số. Độ chính xác của số dấu phẩy động là tối đa 17 chữ số, nhưng phép tính dấu phẩy động không luôn chính xác 100%.
- Toán tử dịch bit thực hiện các phép toán trực tiếp trên các bit nhị phân của số, nó là một phép toán rất cơ bản, ưu điểm là tốc độ rất nhanh, nhưng nhược điểm là không thể sử dụng trong nhiều trường hợp.
- Toán tử dịch bit chỉ hoạt động với số nguyên, nếu một toán hạng không phải là số nguyên, nó sẽ tự động chuyển đổi thành số nguyên trước khi thực hiện phép toán.
- Trong JavaScript, số được lưu trữ dưới dạng số dấu phẩy động 64 bit, nhưng khi thực hiện phép dịch bit, nó được thực hiện trên số nguyên 32 bit có dấu và kết quả trả về cũng là một số nguyên 32 bit có dấu.

## Các toán tử dịch bit

JavaScript có tổng cộng 7 toán tử dịch bit.

### Toán tử AND bit

Toán tử AND bit (`&`) kết hợp các bit tương ứng trong các số nhị phân theo một cách đặc biệt, nếu cả hai bit tương ứng đều là 1, thì kết quả là 1, nếu bất kỳ bit nào là 0 thì kết quả là 0.

```js
// Biểu diễn nhị phân của 1 là: 00000000 00000000 00000000 00000001
// Biểu diễn nhị phân của 3 là: 00000000 00000000 00000000 00000011
// -----------------------------
// Biểu diễn nhị phân của 1 là: 00000000 00000000 00000000 00000001

console.log(1 & 3);
// 1
```

### Toán tử OR bit

Toán tử OR bit (`|`) khác với toán tử `&` ở chỗ nếu bất kỳ bit tương ứng nào trong hai toán hạng là 1 thì kết quả là 1.

```js
// Biểu diễn nhị phân của 1 là: 00000000 00000000 00000000 00000001
// Biểu diễn nhị phân của 3 là: 00000000 00000000 00000000 00000011
// -----------------------------
// Biểu diễn nhị phân của 3 là: 00000000 00000000 00000000 00000011

console.log(1 | 3);
// 3
```

### Toán tử XOR bit

Toán tử XOR bit (`^`) cho kết quả là 1 nếu chỉ có một trong hai bit tương ứng là 1, các trường hợp khác đều là 0.

```js
// Biểu diễn nhị phân của 1 là: 00000000 00000000 00000000 00000001
// Biểu diễn nhị phân của 3 là: 00000000 00000000 00000000 00000011
// -----------------------------
// Biểu diễn nhị phân của 2 là: 00000000 00000000 00000000 00000010

console.log(1 ^ 3);
// 2
```

### Toán tử NOT bit

Toán tử NOT bit (`~`) là phép đảo bit, 1 thành 0, 0 thành 1, tức là lấy phần đảo của biểu diễn nhị phân.

```js
// Biểu diễn nhị phân của 1 là: 00000000 00000000 00000000 00000001
// Biểu diễn nhị phân của 3 là: 00000000 00000000 00000000 00000011
// -----------------------------
// Phần đảo của 1 là:       11111111 11111111 11111111 11111110
// Vì bit đầu tiên (bit dấu) là 1, nên số này là một số âm. JavaScript sử dụng biểu diễn bù 2 để biểu diễn số âm, tức là cần trừ đi 1 từ số này, sau đó lấy đảo một lần nữa, rồi thêm dấu âm để có giá trị thập phân tương ứng với số âm này.
// -----------------------------
// Phần đảo của 1 trừ 1:   11111111 11111111 11111111 11111101
// Đảo của phần đảo:       00000000 00000000 00000000 00000010
// Biểu diễn thập phân với dấu: -2

console.log(~1);
// -2
```

**Ghi nhớ đơn giản:** Tổng của một số và đảo của nó bằng -1.

### Dịch trái

Toán tử dịch trái (`<<`) dịch tất cả các bit của giá trị chỉ định sang trái một số lần xác định, quy tắc dịch: **Loại bỏ bit cao, thêm bit 0 ở dưới**, tức là dịch tất cả các số thành hệ nhị phân tương ứng sang trái số lần tương ứng, các bit cao bị loại bỏ (bỏ qua), các bit thấp được điền vào bằng số 0.

```js
// Biểu diễn nhị phân của 1 là: 00000000 00000000 00000000 00000001
// -----------------------------
// Biểu diễn nhị phân của 2 là: 00000000 00000000 00000000 00000010

console.log(1 << 1);
// 2
```

### Dịch phải có dấu

Dịch phải có dấu (`>>`) sẽ dịch các bit của toán hạng chỉ định sang phải một số lần xác định. Các bit bị dịch ra phía bên phải sẽ bị loại bỏ và bit trái nhất sẽ được sao chép để điền vào bên trái. Vì bit trái nhất luôn giống như trước đó, nên bit dấu không thay đổi. Do đó, nó được gọi là **truyền dấu**.

```js
// Biểu diễn nhị phân của 1 là: 00000000 00000000 00000000 00000001
// -----------------------------
// Biểu diễn nhị phân của 0 là: 00000000 00000000 00000000 00000000

console.log(1 >> 1);
// 0
```

### Dịch phải không dấu

Dịch phải không dấu (`>>>`) sẽ dịch toán hạng đầu tiên sang phải một số lần xác định. Các bit bị dịch ra phía bên phải sẽ bị loại bỏ và được điền vào bên trái bằng số 0. Vì bit dấu trở thành 0, nên kết quả luôn là số không âm. (Chú ý: Ngay cả khi dịch 0 bit, kết quả vẫn là số không âm.)

## Tổng kết

| Toán tử     | Cú pháp      | Mô tả                                                                                   |
| ----------- | ------------ | --------------------------------------------------------------------------------------- |
| AND bit     | `a & b`      | Trả về 1 nếu cả `a` và `b` tương ứng là 1, ngược lại trả về 0                             |
| OR bit      | `a \| b`     | Trả về 1 nếu ít nhất một trong `a` và `b` tương ứng là 1, ngược lại trả về 0              |
| XOR bit     | `a ^ b`      | Trả về 1 nếu chỉ có một trong `a` và `b` tương ứng là 1, ngược lại trả về 0              |
| NOT bit     | `~ a`        | Đảo ngược các bit của toán hạng                                                        |
| Dịch trái   | `a << b`     | Dịch tất cả các bit của giá trị `a` sang trái `b` lần, các bit mới được điền vào bằng 0 |
| Dịch phải   | `a >> b`     | Dịch tất cả các bit của giá trị `a` sang phải `b` lần, các bit bị mất đi                 |
| Dịch phải 0 | `a >>> b`    | Dịch tất cả các bit của giá trị `a` sang phải `b` lần, các bit bị mất đi và được điền 0  |

## Thực hành tốt nhất

### Lấy phần nguyên

Sử dụng `~`、`>>`、`<<`、`>>>`、`|` để lấy phần nguyên.

```js
console.log(~~6.83); // 6
console.log(6.83 >> 0); // 6
console.log(6.83 << 0); // 6
console.log(6.83 | 0); // 6
// Không thể lấy phần nguyên của số âm bằng >>>
console.log(6.83 >>> 0); // 6
```

### Hoán đổi giá trị

Sử dụng XOR bit `^` để hoán đổi giá trị.

```js
var a = 5;
var b = 8;

a ^= b;
b ^= a;
a ^= b;

console.log(a); // 8
console.log(b); // 5
```

XOR cũng thường được sử dụng trong mã hóa.

### Chuyển đổi giá trị thập phân sang nhị phân

```js
var number = 3;
var result = number.toString(2);

var result2 = (14).toString(2);
// "1110"
```

### Chuyển đổi giá trị màu

Sử dụng `&`、`>>`、`|` để chuyển đổi giữa giá trị màu RGB và giá trị màu hex.

```js
/**
 * Chuyển đổi giá trị màu hex sang RGB
 * @param  {String} hex Giá trị màu hex
 * @return {String}     Giá trị màu RGB
 */
function hexToRGB(hex) {
  var hexx = hex.replace('#', '0x');
  var r = hexx >> 16;
  var g = (hexx >> 8) & 0xff;
  var b = hexx & 0xff;
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Chuyển đổi giá trị màu RGB sang giá trị màu hex
 * @param  {String} rgb Giá trị màu RGB
 * @return {String}     Giá trị màu hex
 */
function RGBToHex(rgb) {
  var rgbArr = rgb.split(/[^\d]+/);
  var color = (rgbArr[1] << 16) | (rgbArr[2] << 8) | rgbArr[3];
  return '#' + color.toString(16);
}

// -------------------------------------------------
hexToRGB('#ffffff'); // 'rgb(255,255,255)'
RGBToHex('rgb(255,255,255)'); // '#ffffff'
```

### Kiểm tra dấu

```js
function isPos(n) {
  return n === n >>> 0 ? true : false;
}
isPos(-1); // false
isPos(1); // true
```

### Kiểm tra dấu giống nhau

Thường, chúng ta sử dụng `x * y > 0` để so sánh xem hai số có cùng dấu hay không. Nhưng nếu sử dụng XOR bit `^`, tốc độ tính toán sẽ nhanh hơn.

```js
console.log(-17 ^ (9 > 0));
// false
```

### Kiểm tra số lẻ hay chẵn

Sử dụng toán tử `&` để kiểm tra một số là lẻ hay chẵn.

Nếu biểu diễn số `n` dưới dạng nhị phân, chỉ cần kiểm tra bit nhị phân cuối cùng là 1 hay 0 là được.

```js
// Số chẵn & 1 = 0
// Số lẻ & 1 = 1
console.log(2 & 1); // 0
console.log(3 & 1); // 1
```

### Kiểm tra sự tồn tại của chỉ mục

Đây là một kỹ thuật phổ biến, ví dụ như kiểm tra một số có tồn tại trong một mảng hay không:

```js
// Nếu url chứa dấu ? thì thêm dấu & vào sau, ngược lại thêm dấu ? vào sau
url += ~url.indexOf('?') ? '&' : '?';
```

Vì: `~-1 === 0`

-1 được biểu diễn nhị phân là toàn bit 1, sau khi thực hiện phép NOT bit `~`, kết quả sẽ trở thành toàn bit 0. Điều này cho thấy rằng số có toàn bit 1 trong bộ nhớ được biểu diễn như thế nào. Các số khác không có toàn bit 1, vì vậy kết quả của phép NOT bit sẽ không phải là 0. Do đó, chúng ta có thể sử dụng tính chất này để kiểm tra `indexOf`, giúp mã nguồn trở nên ngắn gọn hơn.
