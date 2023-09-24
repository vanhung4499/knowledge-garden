---
title: LeetCode 0073
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-24
---

# [73. Set Matrix Zeroes](https://leetcode.com/problems/set-matrix-zeroes/)

- Tags: Mảng, Bảng băm, Ma trận
- Độ khó: Trung bình

## Tóm tắt đề bài

**Mô tả**: Cho một ma trận kích thước $m \times n$.

**Yêu cầu**: Nếu một phần tử là $0$, hãy đặt tất cả các phần tử trong hàng và cột của nó thành $0$.

**Giải thích**:

- Vui lòng sử dụng giải thuật "tại chỗ".
- $m == matrix.length$.
- $n == matrix[0].length$.
- $1 \le m, n \le 200$.
- $-2^{31} \le matrix[i][j] \le 2^{31} - 1$.
- **Nâng cao**:
  - Một giải pháp trực quan là sử dụng không gian phụ $O(m \times n)$, nhưng đây không phải là một giải pháp tốt.
  - Một giải pháp cải tiến đơn giản là sử dụng không gian phụ $O(m + n)$, nhưng đây vẫn không phải là giải pháp tốt nhất.
  - Bạn có thể tìm ra một giải pháp chỉ sử dụng không gian hằng số không?

**Ví dụ**:

- Ví dụ 1:

```
Đầu vào: matrix = [[1,1,1],[1,0,1],[1,1,1]]
Đầu ra: [[1,0,1],[0,0,0],[1,0,1]]
```

- Ví dụ 2:

```
Đầu vào: matrix = [[1,1,1],[1,0,1],[1,1,1]]
Đầu ra: [[1,0,1],[0,0,0],[1,0,1]]
```

## Ý tưởng giải quyết

### Ý tưởng 1: Sử dụng biến đánh dấu

Một cách trực quan là sử dụng hai mảng để đánh dấu hàng và cột xuất hiện $0$, nhưng điều này sẽ tốn không gian $O(m + n)$, không đáp ứng yêu cầu.

Xem xét việc sử dụng các phần tử của mảng để ghi lại trạng thái xuất hiện $0$.

1. Đặt hai biến $flag\underline{}row0$ và $flag\underline{}col0$ để đánh dấu xem hàng đầu tiên và cột đầu tiên có xuất hiện $0$ hay không.
2. Tiếp theo, chúng ta sử dụng hàng đầu tiên và cột đầu tiên của mảng để đánh dấu trạng thái $0$.
3. Duyệt qua từng phần tử của mảng, nếu một phần tử nào đó xuất hiện $0$, chúng ta sử dụng các vị trí tương ứng của hàng đầu tiên và cột đầu tiên của mảng để lưu trữ đánh dấu $0$.
4. Tiếp theo, duyệt qua từng phần tử của mảng, dựa vào đánh dấu $0$ của hàng đầu tiên và cột đầu tiên để đặt các phần tử tương ứng thành $0$.
5. Cuối cùng, dựa vào đánh dấu $0$ của hàng đầu tiên và cột đầu tiên để đặt hàng đầu tiên và cột đầu tiên thành $0$.

### Ý tưởng 1: Code

```python
class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        m = len(matrix)
        n = len(matrix[0])
        flag_col0 = False
        flag_row0 = False
        for i in range(m):
            if matrix[i][0] == 0:
                flag_col0 = True
                break

        for j in range(n):
            if matrix[0][j] == 0:
                flag_row0 = True
                break

        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][j] == 0:
                    matrix[i][0] = matrix[0][j] = 0

        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][0] == 0 or matrix[0][j] == 0:
                    matrix[i][j] = 0

        if flag_col0:
            for i in range(m):
                matrix[i][0] = 0

        if flag_row0:
            for j in range(n):
                matrix[0][j] = 0
```

### Ý tưởng 1: Độ phức tạp

- Độ phức tạp thời gian: $O(m \times n)$.
- Độ phức tạp không gian: $O(1)$.
