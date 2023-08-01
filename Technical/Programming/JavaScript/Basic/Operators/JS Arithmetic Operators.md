---
title: Arithmetic Operators
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Toán tử số học

Toán tử số học được sử dụng để thực hiện các phép tính số học trên các giá trị số (literal hoặc biến) và trả về một giá trị số.

Các toán tử số học tiêu chuẩn bao gồm cộng `+`, trừ `-`, nhân `*` và chia `/`.

Khi các toán hạng là số thực, các toán tử này hoạt động giống như trong hầu hết các ngôn ngữ lập trình khác (lưu ý đặc biệt là chia cho 0 sẽ tạo ra `Infinity`).

| Toán tử | Mô tả                                                             | Ví dụ                                      |
| :------ | :--------------------------------------------------------------- | :---------------------------------------- |
| `+`     | Phép cộng                                                         | `1 + 1 = 2`                               |
| `-`     | Phép trừ                                                          | `2 - 1 = 1`                               |
| `*`     | Phép nhân                                                         | `3 * 3 = 9`                               |
| `/`     | Phép chia                                                         | `10 / 5 = 2`                              |
| `%`     | Phép chia lấy dư, trả về giá trị dư sau khi chia                    | `12 % 5 = 2`                              |
| `++`    | Toán tử tăng (toán tử cập nhật), bao gồm tăng trước và tăng sau     | Xem chi tiết tại [[JS Update Expressions]] |
| `--`    | Toán tử giảm (toán tử cập nhật), bao gồm giảm trước và giảm sau     | Xem chi tiết tại [[JS Update Expressions]] |
| `-`     | Toán tử âm, trả về giá trị âm của toán hạng                        | `-foo`                                    |
| `+`     | Toán tử dương, nếu toán hạng không phải là số trước khi thực hiện, sẽ cố gắng chuyển đổi nó thành số | `+foo`                                    |
| `**`    | Toán tử mũ, tính toán giá trị của cơ số (base) mũ với số mũ (exponent) | `2 ** 3 = 8`                              |

## Ví dụ thực hành

```js
console.log(-9 % 2);
// -1

console.log(1 + -+(+(+-+1)));
// 2
```

### Triển khai toán tử mũ

```js
function calculateExponent(base, exponent) {
  if (exponent === 1) {
    return base;
  } else {
    return base * calculateExponent(base, exponent - 1);
  }
}
```
