---
title: JS Labelled Statements
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-01
date modified: 2023-08-01
---

# Câu lệnh nhãn

Câu lệnh nhãn (label statement) được sử dụng để kết hợp với câu lệnh `break` hoặc `continue`. Nhãn là một từ khóa được đặt trước một câu lệnh để tạo một định danh có thể được tham chiếu.

**Lưu ý**: Việc sử dụng nhãn cho vòng lặp hoặc khối mã là rất hiếm. Thông thường, có thể sử dụng cuộc gọi hàm thay vì nhảy qua vòng lặp.

## Cú pháp

```js
identifier: statement;
```

### Tham số

| Tham số      | Mô tả                                                                 |
| ------------ | -------------------------------------------------------------------- |
| `identifier` | Một từ khóa JavaScript hợp lệ không phải là từ khóa được bảo lưu.       |
| `statement`  | Một câu lệnh. `break` có thể được sử dụng với bất kỳ câu lệnh nhãn nào, và `continue` có thể được sử dụng với câu lệnh nhãn của vòng lặp. |

### Mô tả

- Một nhãn có thể được sử dụng để đặt tên duy nhất cho một vòng lặp, sau đó sử dụng câu lệnh `break` hoặc `continue` để chỉ định liệu chương trình có nên thoát khỏi vòng lặp hay tiếp tục thực hiện.

## Ví dụ

### Ví dụ về nhãn

- `identifier` được sử dụng làm nhãn phải là một từ khóa JavaScript hợp lệ và không phải là từ khóa bảo lưu.

```js
var i, j;

loop1: for (i = 0; i < 3; i++) {
  // Vòng lặp đầu tiên được đặt nhãn là "loop1"

  loop2: for (j = 0; j < 3; j++) {
    // Vòng lặp thứ hai được đặt nhãn là "loop2"
    if (i == 1 && j == 1) {
      continue loop1;
    }

    console.log('i = ' + i + ', j = ' + j);
  }
}
```

Kết quả:

```
i = 0, j = 0
i = 0, j = 1
i = 0, j = 2
i = 1, j = 0
i = 2, j = 0
i = 2, j = 1
i = 2, j = 2
```

Trong ví dụ này, vòng lặp ngoài được đặt nhãn là "loop1" và vòng lặp trong được đặt nhãn là "loop2". Khi `i` bằng 1 và `j` bằng 1, câu lệnh `continue loop1` được sử dụng để bỏ qua vòng lặp ngoài và tiếp tục với lần lặp tiếp theo của vòng lặp ngoài.
