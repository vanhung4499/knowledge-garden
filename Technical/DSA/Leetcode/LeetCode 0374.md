---
title: LeetCode 0374
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-26
date modified: 2023-09-26
---

# [0374. Đoán số](https://leetcode.com/problems/guess-number-higher-or-lower/)

- Thẻ: Tìm kiếm nhị phân, Tương tác
- Độ khó: Dễ

## Ý tưởng

**Mô tả**: Trò chơi đoán số. Cho một số nguyên $n$ và một giao diện `def guess(num: int) -> int:`. Đề bài sẽ chọn một số $x$ ngẫu nhiên từ $1 \sim n$. Chúng ta chỉ có thể sử dụng giao diện để kiểm tra xem số đoán của chúng ta có đúng không.

**Yêu cầu**: Trả về số $x$ mà đề bài đã chọn.

**Giải thích**:

- `def guess(num: int) -> int:` giá trị trả về:
  - $-1$: Số tôi chọn nhỏ hơn số bạn đoán, tức là $pick < num$;
  - $1$: Số tôi chọn lớn hơn số bạn đoán, tức là $pick > num$;
  - $0$: Số tôi chọn giống số bạn đoán. Chúc mừng! Bạn đã đoán đúng! $pick == num$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: n = 10, pick = 6
Output: 6
```

- Ví dụ 2:

```python
Input: n = 1, pick = 1
Output: 1
```

## Ý tưởng

### Ý tưởng 1: Tìm kiếm nhị phân

Sử dụng hai con trỏ $left$ và $right$. $left$ trỏ đến số $1$, $right$ trỏ đến số $n$. Mỗi lần kiểm tra từ giữa và gọi giao diện để đoán xem đúng không.

- Nếu số đoán lớn hơn số đã chọn, thì dịch con trỏ $right$ sang trái, tức là `right = mid - 1`, tiếp tục kiểm tra từ giữa;
- Nếu số đoán nhỏ hơn số đã chọn, thì dịch con trỏ $left$ sang phải, tức là `left = mid + 1`, tiếp tục kiểm tra từ giữa;
- Nếu đoán đúng, thì trả về số đó.

### Ý tưởng 1: Code Tìm kiếm nhị phân

```python
class Solution:
    def guessNumber(self, n: int) -> int:
        left = 1
        right = n
        while left <= right:
            mid = left + (right - left) // 2
            ans = guess(mid)
            if ans == 1:
                left = mid + 1
            elif ans == -1:
                right = mid - 1
            else:
                return mid
        return 0
```

### Ý tưởng 1: Độ phức tạp

- **Độ phức tạp thời gian**: $O(\log n)$. Độ phức tạp thời gian của thuật toán tìm kiếm nhị phân là $O(\log n)$.
- **Độ phức tạp không gian**: $O(1)$. Chỉ sử dụng một số biến hằng số để lưu trữ.
