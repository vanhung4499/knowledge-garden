---
title: LeetCode 0059
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-24
---

# [0059. Spiral Matrix II](https://leetcode-cn.com/problems/spiral-matrix-ii/)

- Nhãn: Mảng, Ma trận, Mô phỏng
- Độ khó: Trung bình

## Tóm tắt đề bài

**Mô tả**: Cho một số nguyên dương $n$.

**Yêu cầu**: Tạo ra một ma trận vuông kích thước $n \times n$ chứa tất cả các phần tử từ $1$ đến $n^2$ theo thứ tự xoắn ốc theo chiều kim đồng hồ.

## Ý tưởng giải quyết

### Ý tưởng 1: Mô phỏng

Bài toán này tương tự như bài toán [54.Spiral Matrix](https://leetcode.com/problems/spiral-matrix/).

1. Tạo một ma trận $n \times n$ và khởi tạo tất cả các phần tử bằng $0$.
2. Định nghĩa các biên trên, dưới, trái, phải.
3. Theo thứ tự ngược chiều kim đồng hồ, gán giá trị từ $1$ đến $n^2$ cho ma trận theo vị trí tương ứng.
4. Khi hoàn thành việc gán giá trị cho biên hiện tại, cần cập nhật lại vị trí biên, thu hẹp phạm vi để tiện cho việc gán giá trị lần tiếp theo.
5. Cuối cùng, trả về ma trận.

### Ý tưởng 1: Code

```python
class Solution:
    def generateMatrix(self, n: int) -> List[List[int]]:
        matrix = [[0 for _ in range(n)] for _ in range(n)]
        up, down, left, right = 0, len(matrix) - 1, 0, len(matrix[0]) - 1
        index = 1
        while True:
            for i in range(left, right + 1):
                matrix[up][i] = index
                index += 1
            up += 1
            if up > down:
                break
            for i in range(up, down + 1):
                matrix[i][right] = index
                index += 1
            right -= 1
            if right < left:
                break
            for i in range(right, left - 1, -1):
                matrix[down][i] = index
                index += 1
            down -= 1
            if down < up:
                break
            for i in range(down, up - 1, -1):
                matrix[i][left] = index
                index += 1
            left += 1
            if left > right:
                break
        return matrix
```

### Ý tưởng 1: Độ phức tạp

- Độ phức tạp thời gian: $O(n^2)$.
- Độ phức tạp không gian: $O(n^2)$.
