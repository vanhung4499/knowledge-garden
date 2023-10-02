---
title: LeetCode 0576
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-10-03
---

# [0576. Out of Boundary Paths](https://leetcode.com/problems/out-of-boundary-paths/)

- Nhãn: Quy hoạch động
- Độ khó: Trung bình

## Tóm tắt bài toán

**Mô tả**: Cho một lưới kích thước $m \times n$ và một quả bóng. Vị trí ban đầu của quả bóng là $(startRow, startColumn)$. Bạn có thể di chuyển quả bóng đến các ô kề cạnh trong bốn hướng (có thể đi qua biên lưới để ra khỏi lưới). Tối đa có thể di chuyển quả bóng $maxMove$ lần.

Giờ đây, hãy cho biết số lượng đường đi có thể di chuyển quả bóng ra khỏi biên. Vì kết quả có thể rất lớn, hãy trả về kết quả sau khi chia lấy dư cho $10^9 + 7$.

**Ghi chú**:

- $1 \leq m, n \leq 50$.
- $0 \leq maxMove \leq 50$.
- $0 \leq startRow < m$.
- $0 \leq startColumn < n$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: m = 2, n = 2, maxMove = 2, startRow = 0, startColumn = 0
Output: 6
```

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/out_of_boundary_paths_1.png)

## Ý tưởng giải quyết

### Ý tưởng 1: Đệ quy có nhớ

1. Định nghĩa trạng thái của vấn đề là: Từ vị trí $(i, j)$, tối đa sử dụng $moveCount$ bước, số lượng đường đi có thể di chuyển quả bóng ra khỏi biên.
2. Định nghĩa một mảng ba chiều $memo$ kích thước $m \times n \times (maxMove + 1)$ để ghi nhớ số lượng đường đi đã tính toán.
3. Định nghĩa hàm đệ quy $dfs(i, j, moveCount)$ để tính toán số lượng đường đi.
   1. Nếu $(i, j)$ đã ra khỏi biên, có nghĩa là đã tìm thấy một đường đi, trả về số lượng đường đi là $1$.
   2. Nếu đã hết số lần di chuyển, trả về số lượng đường đi là $0$.
   3. Định nghĩa biến $ans$, duyệt qua bốn hướng, tính toán số lượng đường đi từ bốn hướng và cộng vào $ans$, sau đó lấy phần dư.
   4. Trả về số lượng đường đi $ans$.
4. Gọi hàm đệ quy $dfs(startRow, startColumn, maxMove)$ và trả về giá trị trả về của nó.

### Ý tưởng 1: Code

```python
class Solution:
    def findPaths(self, m: int, n: int, maxMove: int, startRow: int, startColumn: int) -> int:
        directions = {(1, 0), (-1, 0), (0, 1), (0, -1)}
        mod = 10 ** 9 + 7

        memo = [[[-1 for _ in range(maxMove + 1)] for _ in range(n)] for _ in range(m)]

        def dfs(i, j, moveCount):
            if i < 0 or i >= m or j < 0 or j >= n:
                return 1
            
            if moveCount == 0:
                return 0

            if memo[i][j][moveCount] != -1:
                return memo[i][j][moveCount]

            ans = 0
            for direction in directions:
                new_i = i + direction[0]
                new_j = j + direction[1]
                ans += dfs(new_i, new_j, moveCount - 1)
                ans %= mod

            memo[i][j][moveCount] = ans
            return ans

        return dfs(startRow, startColumn, maxMove)
```

### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(m \times n \times maxMove)$.
- **Độ phức tạp không gian**: $O(m \times n \times maxMove)$.

### Ý tưởng 2: Quy hoạch động

Chúng ta cần đếm số lượng đường đi có thể di chuyển quả bóng ra khỏi biên từ vị trí $(startRow, startColumn)$ sau tối đa $maxMove$ lần di chuyển. Vì vậy, chúng ta có thể chia bài toán thành các bước và định nghĩa trạng thái.

###### 1. Chia bài toán thành các giai đoạn

Chia bài toán thành các giai đoạn dựa trên vị trí.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[i][j][k]$ là số lượng đường đi có thể di chuyển quả bóng ra khỏi biên từ vị trí $(i, j)$ sau tối đa $k$ lần di chuyển.

###### 3. Công thức chuyển tiếp trạng thái

Vì quả bóng có thể di chuyển theo bốn hướng trên, nên với vị trí $(i, j)$, số lượng đường đi có thể di chuyển quả bóng ra khỏi biên sau tối đa $k$ lần di chuyển phụ thuộc vào số lượng đường đi đã đi qua các vị trí xung quanh trong tối đa $k - 1$ lần di chuyển. Do đó, công thức chuyển tiếp trạng thái là:

$dp[i][j][k] = dp[i - 1][j][k - 1] + dp[i + 1][j][k - 1] + dp[i][j - 1][k - 1] + dp[i][j + 1][k - 1]$.

###### 4. Điều kiện ban đầu

Nếu vị trí $[i, j]$ đã nằm ở biên, chỉ còn một bước nữa là có thể di chuyển ra khỏi biên. Vì vậy, số lượng đường đi có thể di chuyển quả bóng ra khỏi biên từ vị trí $(i, j)$ sau tối đa $k$ lần di chuyển phụ thuộc vào số lượng hướng xung quanh đã đi qua biên. Cũng có thể kiểm tra xem $(i - 1, j)$, $(i + 1, j)$, $(i, j - 1)$, $(i, j + 1)$ đã đi qua biên hay chưa (mỗi hướng đi qua một lần, cộng dồn mỗi lần), sau đó tính toán số lượng đường đi. Sau đó, sử dụng nó làm điều kiện ban đầu.

###### 5. Kết quả cuối cùng

Dựa trên trạng thái đã định nghĩa trước đó, $dp[i][j][k]$ là số lượng đường đi có thể di chuyển quả bóng ra khỏi biên từ vị trí $(i, j)$ sau tối đa $k$ lần di chuyển. Vì vậy, kết quả cuối cùng là $dp[startRow][startColumn][maxMove]$.

### Ý tưởng 2: Code

```python
class Solution:
    def findPaths(self, m: int, n: int, maxMove: int, startRow: int, startColumn: int) -> int:
        directions = {(1, 0), (-1, 0), (0, 1), (0, -1)}
        mod = 10 ** 9 + 7
        
        dp = [[[0 for _ in range(maxMove + 1)] for _ in range(n)] for _ in range(m)]
        for k in range(1, maxMove + 1):
            for i in range(m):
                for j in range(n):
                    for direction in directions:
                        new_i = i + direction[0]
                        new_j = j + direction[1]
                        if 0 <= new_i < m and 0 <= new_j < n:
                            dp[i][j][k] = (dp[i][j][k] + dp[new_i][new_j][k - 1]) % mod
                        else:
                            dp[i][j][k] = (dp[i][j][k] + 1) % mod
        
        return dp[startRow][startColumn][maxMove]
```

### Ý tưởng 2: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(m \times n \times maxMove)$. Ba vòng lặp lồng nhau có độ phức tạp thời gian là $O(m \times n \times maxMove)$.
- **Độ phức tạp không gian**: $O(m \times n \times maxMove)$. Sử dụng mảng ba chiều để lưu trữ trạng thái, vì vậy tổng độ phức tạp không gian là $O(m \times n \times maxMove)$.
