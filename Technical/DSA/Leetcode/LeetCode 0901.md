---
title: LeetCode 0901
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-28
---

# [0901. Online Stock Span](https://leetcode.com/problems/online-stock-span/)

- Tags: Stack, Design, Data Stream, Monotonic Stack
- Độ khó: Trung bình

## Ý nghĩa đề bài

Yêu cầu: Viết một lớp `StockSpanner` để thu thập giá cổ phiếu hàng ngày và trả về khoảng giá của cổ phiếu trong ngày hiện tại.

- Khoảng giá cổ phiếu trong ngày hôm nay: Số ngày liên tiếp lớn nhất mà giá cổ phiếu nhỏ hơn hoặc bằng giá cổ phiếu hôm nay (tính từ hôm nay trở về trước, bao gồm cả hôm nay).

Ví dụ: Nếu giá cổ phiếu trong 7 ngày tới là `[100, 80, 60, 70, 60, 75, 85]` thì khoảng giá cổ phiếu sẽ là `[1, 1, 1, 2, 1, 4, 6]`.

## Ý tưởng giải quyết

"Khoảng giá cổ phiếu trong ngày hôm nay" tương đương với "tìm phần tử đầu tiên bên trái mà lớn hơn giá cổ phiếu hiện tại và tính khoảng cách". Để tìm phần tử đầu tiên bên trái mà lớn hơn giá cổ phiếu hiện tại, ta có thể sử dụng "ngăn xếp đơn điệu" để làm. Các bước cụ thể như sau:

- Phương thức khởi tạo: Khởi tạo một ngăn xếp rỗng, tức là `self.stack = []`.
- Tính khoảng giá cổ phiếu trong ngày hôm nay:
  - Khởi tạo khoảng giá `span` là `1`.
  - Nếu giá cổ phiếu hôm nay `price` lớn hơn hoặc bằng phần tử đỉnh ngăn xếp `self.stack[-1][0]`, thực hiện các bước sau:
    - Lấy phần tử đỉnh ngăn xếp ra khỏi ngăn xếp, tức là `top = self.stack.pop()`.
    - Cộng dồn khoảng giá của phần tử đỉnh ngăn xếp vào khoảng giá `span`, tức là `span += top[1]`.
    - Tiếp tục kiểm tra, cho đến khi gặp một giá cổ phiếu hôm nay `price` nhỏ hơn phần tử đỉnh ngăn xếp, sau đó đẩy `[price, span]` vào ngăn xếp.
  - Nếu giá cổ phiếu hôm nay `price` nhỏ hơn phần tử đỉnh ngăn xếp `self.stack[-1][0]`, đẩy `[price, span]` vào ngăn xếp.
  - Cuối cùng, trả về khoảng giá cổ phiếu trong ngày hôm nay `span`.

## Đoạn mã

```python
class StockSpanner:

    def __init__(self):
        self.stack = []

    def next(self, price: int) -> int:
        span = 1
        while self.stack and price >= self.stack[-1][0]:
            top = self.stack.pop()
            span += top[1]
        self.stack.append([price, span])
        return span
```
