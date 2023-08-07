---
title: JS eval
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# eval

Hàm `eval()` được sử dụng để tính toán và thực thi mã JavaScript được biểu diễn dưới dạng chuỗi. Hàm `eval()` cho phép JavaScript thực thi mã nguồn JavaScript một cách động.

Hàm `eval()` thuộc về đối tượng `Global` và được hỗ trợ bởi tất cả các trình duyệt phổ biến.

## Cú pháp

```js
eval(code);
```

| Tham số | Kiểu dữ liệu | Mô tả                            |
| ------- | ------------ | -------------------------------- |
| `code`  | Kiểu `String` | Chuỗi chứa mã JavaScript hợp lệ |

⚠️ **Lưu ý**: Tham số `code` phải là một chuỗi nguyên thủy, không phải là một đối tượng `String`. Nếu tham số `code` không phải là một chuỗi nguyên thủy, hàm `eval()` sẽ không thực thi mã và trả về nó mà không thay đổi.

Nếu mã JavaScript trong tham số `code` không hợp lệ, nó sẽ gây ra một ngoại lệ.

Giá trị trả về của hàm `eval()` có thể là bất kỳ kiểu dữ liệu nào, phụ thuộc vào mã JavaScript cụ thể trong tham số `code`.

## Giải thích

- Mã được truyền vào hàm `eval()` được thực thi trong ngữ cảnh và phạm vi của nơi gọi `eval()` (nghĩa là phạm vi không thay đổi).
- Hãy đảm bảo mã trong tham số `code` được đáng tin cậy, nếu không, việc sử dụng hàm `eval()` có thể gây ra các vấn đề về bảo mật.

## Ví dụ

```js
let x = 2,
  y = 39,
  z = '42';

eval('x + y + 1');
// 42

eval(z);
// 42
```
