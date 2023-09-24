---
title: LeetCode 0498
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-24
---

# [498. Diagonal Traverse](https://leetcode.com/problems/diagonal-traverse/)

- Tags: Mảng, Ma trận, Mô phỏng
- Độ khó: Trung bình

## Tóm tắt đề bài

**Mô tả**: Cho một ma trận $mat$ có kích thước $m \times n$.

**Yêu cầu**: Trả về một mảng chứa tất cả các phần tử trong ma trận theo thứ tự duyệt đường chéo.

**Giới hạn**:

- $m = \text{mat.length}$.
- $n = \text{mat[i].length}$.
- $1 \le m, n \le 10^4$.
- $1 \le m \times n \le 10^4$.
- $-10^5 \le \text{mat[i][j]} \le 10^5$.

**Ví dụ**:

- Ví dụ 1:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/diag1-grid.jpg)

```python
Input: mat = [[1,2,3],[4,5,6],[7,8,9]]
Output: [1,2,4,7,5,3,6,8,9]
```

- Ví dụ 2:

```python
Input: mat = [[1,2],[3,4]]
Output: [1,2,3,4]
```

## Ý tưởng giải quyết

### Ý tưởng 1: Tìm quy luật + Xử lý biên

Vấn đề chính của bài toán này là "Tìm quy luật" và "Xử lý biên".

Tìm quy luật:

1. Khi "chỉ số hàng + chỉ số cột" là số chẵn, di chuyển theo hướng từ dưới lên trên. Có thể ghi là hướng "Trên phải" $(-1, +1)$, tức là giảm chỉ số hàng đi $1$, tăng chỉ số cột đi $1$.
2. Khi "chỉ số hàng + chỉ số cột" là số lẻ, di chuyển theo hướng từ trên xuống dưới. Có thể ghi là hướng "Dưới trái" $(+1, -1)$, tức là tăng chỉ số hàng đi $1$, giảm chỉ số cột đi $1$.

Xử lý biên:

1. Khi di chuyển theo hướng "Trên phải":
   1. Nếu đang ở cột cuối cùng, di chuyển xuống dưới, tức là `x += 1`.
   2. Nếu đang ở hàng đầu tiên, di chuyển sang phải, tức là `y += 1`.
   3. Trường hợp còn lại di chuyển theo hướng "Trên phải", tức là `x -= 1`, `y += 1`.
2. Khi di chuyển theo hướng "Dưới trái":
   1. Nếu đang ở hàng cuối cùng, di chuyển sang phải, tức là `y += 1`.
   2. Nếu đang ở cột đầu tiên, di chuyển xuống dưới, tức là `x += 1`.
   3. Trường hợp còn lại di chuyển theo hướng "Dưới trái", tức là `x += 1`, `y -= 1`.

### Ý tưởng 1: Cài đặt

```python
class Solution:
    def findDiagonalOrder(self, mat: List[List[int]]) -> List[int]:
        rows = len(mat)
        cols = len(mat[0])
        count = rows * cols
        x, y = 0, 0
        ans = []

        for i in range(count):
            ans.append(mat[x][y])

            if (x + y) % 2 == 0:
                # Cột cuối cùng
                if y == cols - 1:
                    x += 1
                # Hàng đầu tiên
                elif x == 0:
                    y += 1
                # Hướng trên phải
                else:
                    x -= 1
                    y += 1
            else:
                # Hàng cuối cùng
                if x == rows - 1:
                    y += 1
                # Cột đầu tiên
                elif y == 0:
                    x += 1
                # Hướng dưới trái
                else:
                    x += 1
                    y -= 1
        return ans
```

### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(m \times n)$. Trong đó $m$ và $n$ lần lượt là số hàng và số cột của ma trận.
- **Độ phức tạp không gian**: $O(m \times n)$. Nếu tính cả không gian sử dụng cho mảng kết quả, thì độ phức tạp không gian là $O(m \times n)$. Nếu chỉ tính không gian sử dụng bộ nhớ phụ, thì độ phức tạp không gian là $O(1)$.
