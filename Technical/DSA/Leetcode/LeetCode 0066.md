---
title: LeetCode 0066
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-24
---

# [0066. Plus One](https://leetcode.com/problems/plus-one/)

- Nhãn: Mảng, Toán học
- Độ khó: Dễ

## Đề bài

**Mô tả**: Cho một mảng số nguyên không âm, mỗi phần tử trong mảng đại diện cho một chữ số của một số nguyên.

**Yêu cầu**: Tính tổng của số nguyên đó sau khi cộng thêm $1$.

**Giải thích**:

- $1 \le \text{digits.length} \le 100$.
- $0 \le \text{digits[i]} \le 9$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: digits = [1,2,3]
Output: [1,2,4]
Explanation: Mảng đầu vào đại diện cho số 123, sau khi cộng 1 sẽ được 124.
```

- Ví dụ 2:

```python
Input: digits = [4,3,2,1]
Output: [4,3,2,2]
Explanation: Mảng đầu vào đại diện cho số 4321.
```

## Ý tưởng

### Ý tưởng 1: Mô phỏng

Bài toán này coi toàn bộ mảng như một số nguyên, sau đó cộng thêm $1$. Vấn đề thực chất là sử dụng mảng để mô phỏng phép cộng.

Nếu chữ số hàng đơn vị không phải là $9$, chúng ta chỉ cần cộng thêm $1$ vào chữ số hàng đơn vị. Nếu chữ số hàng đơn vị là $9$, chúng ta cần xét trường hợp cần nhớ.

Các bước cụ thể:

1. Thêm $0$ vào đầu mảng.
2. Cộng thêm $1$ vào chữ số hàng đơn vị.
3. Duyệt qua mảng
   1. Nếu chữ số tại vị trí đó lớn hơn hoặc bằng $10$, thì tiến $1$ sang vị trí tiếp theo và tiếp tục xét nhớ.
   2. Nếu chữ số tại vị trí đó nhỏ hơn $10$, thì thoát khỏi vòng lặp.

### Ý tưởng 1: Cài đặt

```python
class Solution:
    def plusOne(self, digits: List[int]) -> List[int]:
        digits = [0] + digits
        digits[-1] += 1
        for i in range(len(digits) - 1, 0, -1):
            if digits[i] < 10:
                break
            else:
                digits[i] = 0
                digits[i - 1] += 1
        
        if digits[0] == 0:
            return digits[1:] 
        return digits
```

### Ý tưởng 1: Độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$. Độ phức tạp thời gian của vòng lặp là $O(n)$.
- **Độ phức tạp không gian**: $O(1)$.
