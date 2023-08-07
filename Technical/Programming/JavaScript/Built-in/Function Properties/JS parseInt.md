---
title: JS parseInt
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# parseInt

Hàm `parseInt()` được sử dụng để **chuyển đổi một chuỗi thành số nguyên và trả về kết quả**. Hàm này có thể xem chuỗi đó là một số được biểu diễn dưới dạng cơ số được chỉ định.

Hàm này thuộc về đối tượng `Global` và được hỗ trợ bởi tất cả các trình duyệt phổ biến.

## Cú pháp

```js
parseInt(numString [, radix])
```

| Tham số      | Kiểu dữ liệu | Mô tả                                                         |
| ------------ | ------------ | ------------------------------------------------------------ |
| `numString`  | Kiểu `String`| Chuỗi cần chuyển đổi thành số nguyên.                          |
| `radix`      | Kiểu `Number`| Tùy chọn, cơ số được chỉ định (trong khoảng từ `2` đến `36`).   |

Ví dụ: Nếu `radix` là `2`, chuỗi sẽ được xem như là hệ nhị phân; nếu `radix` là `8`, chuỗi sẽ được xem như là hệ bát phân; nếu `radix` là `16`, chuỗi sẽ được xem như là hệ thập lục phân.

Nếu không cung cấp tham số `radix`, hàm `parseInt()` sẽ dựa vào tiền tố của `numString` để xác định cơ số chuyển đổi. Nếu tiền tố là `0x`, chuỗi sẽ được chuyển đổi thành hệ thập lục phân; nếu tiền tố là `0`, chuỗi sẽ được chuyển đổi thành hệ bát phân; trong các trường hợp khác, chuỗi sẽ được chuyển đổi thành hệ thập phân.

- Hàm `parseInt()` trả về kiểu `Number`, **trả về số nguyên đã chuyển đổi**.
  - Nếu chuỗi chỉ định chứa các ký tự không phải số, hàm `parseInt()` sẽ chuyển đổi một phần của chuỗi (từ đầu chuỗi cho đến khi gặp ký tự không phải số) thành số nguyên.
  - Nếu chuỗi bắt đầu bằng ký tự không phải số, hàm sẽ trả về `NaN`.

## Ví dụ

- Sử dụng `parseInt()` bình thường, tất cả đều trả về 15

```js
// Nhị phân
parseInt('1111', 2);

// Bát phân
parseInt('17', 8);
parseInt(021, 8);

// Thập phân
parseInt('015', 10);
parseInt(15.99, 10);
parseInt('15,123', 10);
parseInt('15 * 3', 10);
parseInt('15e2', 10);
parseInt('15px', 10);

parseInt('12', 13);

// Thập lục phân
parseInt('0xF', 16);
parseInt('F', 16);
parseInt('FXX123', 16);
```

- Tất cả đều trả về `NaN`

```js
parseInt('Hello', 8);
// không phải là một số

parseInt('546', 2);
// ngoại trừ 0 và 1, các số khác không hợp lệ trong hệ nhị phân
```
