---
title: JS RegExp exec
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# RegExp.prototype.exec()

Phương thức `exec()` của `RegExp.prototype` được thiết kế đặc biệt cho việc tìm kiếm và trích xuất các nhóm trong một chuỗi đã cho. Phương thức này trả về một mảng chứa thông tin về các kết quả tìm kiếm, và trả về `null` nếu không tìm thấy kết quả.

## Cú pháp

```js
RegExp.prototype.exec(str);
```

### Tham số

| Tham số        | Mô tả                                   | Kiểu dữ liệu |
| -------------- | -------------------------------------- | ------------ |
| `regExpObject` | Biểu thức chính quy để tìm kiếm.         | regexp       |
| `str`          | Chuỗi đã cho. Sẽ thực hiện tìm kiếm trong chuỗi này. | string       |

### Giá trị trả về

- Nếu tìm thấy kết quả, phương thức `exec()` trả về một mảng và cập nhật các thuộc tính của đối tượng biểu thức chính quy. Mảng trả về chứa chuỗi khớp hoàn toàn với mẫu tìm kiếm ở vị trí đầu tiên, và các chuỗi khớp với các nhóm trong ngoặc đơn sẽ được điền vào các phần tử tiếp theo của mảng.
- Nếu không tìm thấy kết quả, phương thức `exec()` trả về `null`.

Mảng trả về bao gồm hai thuộc tính bổ sung.

| Thuộc tính | Mô tả                       |
| ---------- | -------------------------- |
| `index`    | Vị trí của kết quả tìm kiếm trong chuỗi   |
| `input`    | Chuỗi được áp dụng biểu thức chính quy |

Giá trị trả về của phương thức `exec()` là một mảng, nếu tìm thấy kết quả khớp, mảng sẽ chứa các thành viên như sau:

- Chỉ số `0`: Lưu trữ chuỗi con khớp đầu tiên
- Thuộc tính `index`: Vị trí bắt đầu của văn bản khớp trong chuỗi
- Thuộc tính `input`: Đối tượng chuỗi đầy đủ (`stringObject`)

Trong IE 6 ~ IE 8, mảng này còn có thuộc tính `lastIndex` bổ sung, được sử dụng để lưu trữ vị trí ký tự tiếp theo của văn bản khớp cuối cùng trong chuỗi.

## Ví dụ

```js
// Khớp "quick brown" theo sau bởi "jumps", bỏ qua các ký tự ở giữa
// Ghi nhớ "brown" và "jumps"
// Không phân biệt chữ hoa chữ thường
let result = regexp.exec('The Quick Brown Fox Jumps Over The Lazy Dog');
let regexp = /quick\s(brown).+?(jumps)/gi;
```

Bảng dưới đây liệt kê kết quả trả về của đoạn mã này:

**Đối tượng Result**

| Thuộc tính/Chỉ số | Mô tả                                        | Ví dụ                                           |
| ---------------- | ------------------------------------------- | ----------------------------------------------- |
| `[0]`            | Chuỗi khớp hoàn toàn                          | `'Quick Brown Fox Jumps'`                       |
| `[1],…,[n]`    | Các nhóm được ghi nhớ trong ngoặc đơn         | `[1] = Brown` `[2] = Jumps`                     |
| `index`          | Vị trí của kết quả khớp trong chuỗi (dựa trên 0) | `4`                                             |
| `input`          | Chuỗi gốc                                    | `'The Quick Brown Fox Jumps Over The Lazy Dog'` |

**Đối tượng RegExp**

| Thuộc tính/Chỉ số | Mô tả                                                                                                                                                              | Ví dụ                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `lastIndex`      | Vị trí bắt đầu tìm kiếm kế tiếp                                                                                                                                   | `25`                       |
| `ignoreCase`     | Có sử dụng cờ 'i' để bỏ qua phân biệt chữ hoa chữ thường trong biểu thức chính quy hay không                                                                                             | `true`                     |
| `global`         | Có sử dụng cờ 'g' để tìm kiếm toàn bộ chuỗi hay không                                                                                                              | `true`                     |
| `multiline`      | Có sử dụng cờ 'm' để tìm kiếm đa dòng (nghĩa là, ^ và $ khớp với đầu và cuối mỗi dòng trong chuỗi (dòng được phân tách bằng \n hoặc \r), không chỉ ở đầu và cuối chuỗi đầu vào) | `false`                    |
| `source`         | Chuỗi biểu thức chính quy                                                                                                                                          | `quick\s(brown).+?(jumps)` |
