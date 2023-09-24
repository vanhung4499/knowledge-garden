---
title: LeetCode 0048
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-24
---

# [48. Rotate Image](https://leetcode.com/problems/rotate-image/)

- Nhãn: Mảng, Toán học, Ma trận
- Độ khó: Trung bình

## Tóm tắt đề bài

**Mô tả**: Cho một ma trận hai chiều kích thước $n \times n$ (đại diện cho hình ảnh) $matrix$.

**Yêu cầu**: Xoay ma trận hai chiều $matrix$ theo chiều kim đồng hồ 90°.

**Giải thích**:

- Không được sử dụng không gian mảng phụ.
- $n == matrix.length == matrix[i].length$.
- $1 \le n \le 20$.
- $-1000 \le matrix[i][j] \le 1000$.

**Ví dụ**:

- Ví dụ 1:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/mat1.jpg)

```python
Đầu vào: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Đầu ra: [[7,4,1],[8,5,2],[9,6,3]]
```

- Ví dụ 2:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/mat2.jpg)

```python
Đầu vào: matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
Đầu ra: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]
```

## Ý tưởng giải quyết

### Ý tưởng 1: Xoay trực tiếp

Nếu sử dụng không gian mảng phụ, chỉ cần đặt các phần tử tương ứng vào vị trí tương ứng. Nếu không sử dụng không gian mảng phụ, ta cần quan sát điểm ban đầu và điểm cuối cùng của mỗi vị trí trên ma trận.

Với phần tử thứ $j$ của hàng thứ $i$ trong ma trận, sau khi xoay, nó sẽ xuất hiện ở vị trí thứ $j$ của cột thứ $n − i − 1$. Tức là $matrixnew[j][n − i − 1] = matrix[i][j]$.

Phần tử tại vị trí $matrixnew[j][n - i - 1]$ sau khi xoay sẽ di chuyển đến vị trí thứ $matrix[n − i − 1][n − j − 1]$.

Phần tử tại vị trí $matrix[n − i − 1][n − j − 1]$ sau khi xoay sẽ di chuyển đến vị trí thứ $matrix[n − j − 1][i]$.

Phần tử tại vị trí $matrix[n− j − 1][i]$ sau khi xoay sẽ di chuyển đến vị trí ban đầu $matrix[i][j]$.

Điều này tạo thành một vòng lặp, ta chỉ cần sử dụng một biến tạm thời $temp$ để hoán đổi từng phần tử trong vòng lặp. Trong Python, ta có thể sử dụng cú pháp để hoán đổi trực tiếp.

### Ý tưởng 1: Code

```python
class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        n = len(matrix)

        for i in range(n // 2):
            for j in range((n + 1) // 2):
                matrix[i][j], matrix[n - j - 1][i], matrix[n - i - 1][n - j - 1], matrix[j][n - i - 1] = matrix[n - j - 1][i], matrix[n - i - 1][n - j - 1], matrix[j][n - i - 1], matrix[i][j]
```

### Ý tưởng 1: Độ phức tạp

- Độ phức tạp thời gian: $O(n^2)$.
- Độ phức tạp không gian: $O(1)$.

### Ý tưởng 2: Lật ngang và lật chéo chính

Qua quan sát, ta có thể thấy: ma trận gốc có thể được biến đổi thành ma trận sau một lần "lật ngang" + "lật chéo chính".

### Ý tưởng 2: Code

```python
class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        n = len(matrix)
        
        for i in range(n // 2):
            for j in range(n):
                matrix[i][j], matrix[n - i - 1][j] = matrix[n - i - 1][j], matrix[i][j]
        
        for i in range(n):
            for j in range(i):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
        
```

### Ý tưởng 2: Độ phức tạp

- Độ phức tạp thời gian: $O(n^2)$.
- Độ phức tạp không gian: $O(1)$.
