---
title: LeetCode 0054
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-24
---

# [0054. Spiral Matrix](https://leetcode.com/problems/spiral-matrix/)

- Nhãn: Mảng, Ma trận, Mô phỏng
- Độ khó: Trung bình

## Tóm tắt đề bài

**Mô tả**: Cho một ma trận hai chiều kích thước $m \times n$.

**Yêu cầu**: Trả về tất cả các phần tử trong ma trận theo thứ tự xoắn ốc theo chiều kim đồng hồ.

**Giải thích**:

- $m == matrix.length$.
- $n == matrix[i].length$.
- $1 \le m, n \le 10$.
- $-100 \le matrix[i][j] \le 100$.

**Ví dụ**:

- Ví dụ 1:

![](https://assets.leetcode.com/uploads/2020/11/13/spiral1.jpg)

```python
Đầu vào: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Đầu ra: [1,2,3,6,9,8,7,4,5]
```

- Ví dụ 2:

![](https://assets.leetcode.com/uploads/2020/11/13/spiral.jpg)

```python
Đầu vào: matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
Đầu ra: [1,2,3,4,8,12,11,10,9,5,6,7]
```

## Ý tưởng giải quyết

### Ý tưởng 1: Mô phỏng

1. Sử dụng mảng $ans$ để lưu trữ kết quả. Định nghĩa các biên trên, dưới, trái, phải.
2. Tiếp theo, theo thứ tự ngược chiều kim đồng hồ, truy cập các phần tử từ biên.
3. Khi hoàn thành việc truy cập biên hiện tại, cần cập nhật lại vị trí biên, thu hẹp phạm vi để tiện cho việc truy cập lần tiếp theo.
4. Cuối cùng, trả về mảng kết quả $ans$.

### Ý tưởng 1: Code

```python
class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        up, down, left, right = 0, len(matrix)-1, 0, len(matrix[0])-1
        ans = []
        while True:
            for i in range(left, right + 1):
                ans.append(matrix[up][i])
            up += 1
            if up > down:
                break
            for i in range(up, down + 1):
                ans.append(matrix[i][right])
            right -= 1
            if right < left:
                break
            for i in range(right, left - 1, -1):
                ans.append(matrix[down][i])
            down -= 1
            if down < up:
                break
            for i in range(down, up - 1, -1):
                ans.append(matrix[i][left])
            left += 1
            if left > right:
                break
        return ans
```

### Ý tưởng 1: Độ phức tạp

- Độ phức tạp thời gian: $O(m \times n)$. Trong đó $m$ và $n$ lần lượt là số hàng và số cột của ma trận hai chiều.
- Độ phức tạp không gian: $O(m \times n)$. Nếu tính cả không gian sử dụng cho mảng kết quả, thì độ phức tạp không gian là $O(m \times n)$. Nếu không tính, thì độ phức tạp không gian là $O(1)$.
