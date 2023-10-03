---
title: Linear DP Part 2
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-10-03
date modified: 2023-10-03
---

## 4. Bài toán DP tuyến tính ma trận

> **Bài toán DP tuyến tính ma trận**: Bài toán DP tuyến tính có đầu vào là ma trận hai chiều. Trạng thái nói chung có thể được định nghĩa là $dp[i][j]$, được biểu thị dưới dạng: giải pháp liên quan từ "vị trí $(0, 0)$" đến "vị trí $(i, j)$".

### 4.1 Tổng đường đi nhỏ nhất

#### 4.1.1 Liên kết đề bài

- [64. Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/)

#### 4.1.2 Ý nghĩa đề bài

**Mô tả**: Cho một lưới $m \times n$ chứa các số nguyên không âm.

**Yêu cầu**: Tìm một đường đi từ góc trái trên cùng đến góc phải dưới cùng sao cho tổng các số trên đường đi là nhỏ nhất.

**Giải thích**:

- Mỗi lần chỉ được di chuyển xuống hoặc sang phải một ô.
- $m = \text{grid.length}$.
- $n = \text{grid[i].length}$.
- $1 \le m, n \le 200$.
- $0 \le \text{grid[i][j]} \le 100$.

**Ví dụ**:

- Ví dụ 1:

![](https://assets.leetcode.com/uploads/2020/11/05/minpath.jpg)

```python
Input: grid = [[1,3,1],[1,5,1],[4,2,1]]
Output: 7
Explanation: Đường đi 1→3→1→1→1 có tổng nhỏ nhất.
```

- Ví dụ 2:

```python
Input: grid = [[1,2,3],[4,5,6]]
Output: 12
```

#### 4.1.3 Ý tưởng giải quyết

##### Ý tưởng 1: Quy hoạch động

###### 1. Phân chia giai đoạn

Phân chia giai đoạn dựa trên vị trí cuối cùng của đường đi (tọa độ hàng và cột).

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[i][j]$ là: Tổng nhỏ nhất của đường đi từ góc trái trên cùng đến ô $(i, j)$.

###### 3. Công thức chuyển tiếp trạng thái

Ở ô $(i, j)$, chỉ có thể di chuyển từ ô bên trái $(i, j - 1)$ hoặc từ ô phía trên $(i - 1, j)$. Để tìm đường đi có tổng nhỏ nhất, ta chọn ô có tổng nhỏ nhất từ hai ô trên và trái và cộng với giá trị của ô hiện tại.

Công thức chuyển tiếp trạng thái là: $dp[i][j] = \min(dp[i - 1][j], dp[i][j - 1]) + \text{grid}[i][j]$.

###### 4. Điều kiện ban đầu

- Khi chỉ có một hàng, tổng đường đi từ góc trái trên cùng đến ô $(i, j)$ là tổng các ô từ góc trái trên cùng đến ô $(i, j)$.
- Khi chỉ có một cột, tổng đường đi từ góc trái trên cùng đến ô $(i, j)$ là tổng các ô từ góc trái trên cùng đến ô $(i, j)$.

###### 5. Kết quả cuối cùng

Dựa trên định nghĩa trạng thái, trả về $dp[m - 1][n - 1]$ (tổng đường đi nhỏ nhất từ góc trái trên cùng đến góc phải dưới cùng).

##### Ý tưởng 1: Code

```python
class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int:
        m = len(grid)
        n = len(grid[0])
        dp = [[0 for _ in range(n)] for _ in range(m)]
        
        dp[0][0] = grid[0][0]
        for i in range(1, m):
            dp[i][0] = dp[i - 1][0] + grid[i][0]
        for j in range(1, n):
            dp[0][j] = dp[0][j - 1] + grid[0][j]
        
        for i in range(1, m):
            for j in range(1, n):
                dp[i][j] = min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j]
        
        return dp[m - 1][n - 1]
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(m \times n)$. Trong đó $m$ và $n$ lần lượt là số hàng và số cột của lưới. Hai vòng lặp lồng nhau có độ phức tạp thời gian là $O(m \times n)$, vậy tổng độ phức tạp thời gian là $O(m \times n)$.
- **Độ phức tạp không gian**: $O(m \times n)$. Sử dụng một mảng hai chiều để lưu trữ trạng thái, vậy tổng độ phức tạp không gian là $O(m \times n)$.

### 4.2 Hình vuông lớn nhất

#### 4.2.1 Liên kết đề bài

- [221. Maximal Square](https://leetcode.com/problems/maximal-square/)

#### 4.2.2 Ý nghĩa đề bài

**Mô tả**: Cho một ma trận $m \times n$ chứa các ký tự `'0'` và `'1'`.

**Yêu cầu**: Tìm hình vuông lớn nhất chỉ chứa các ký tự `'1'` và trả về diện tích của nó.

**Giải thích**:

- $m = \text{matrix.length}$.
- $n = \text{matrix[i].length}$.
- $1 \le m, n \le 300$.
- $\text{matrix[i][j]}$ là `'0'` hoặc `'1'`.

**Ví dụ**:

- Ví dụ 1:

![](https://assets.leetcode.com/uploads/2020/11/26/max1grid.jpg)

```python
Input: matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]
Output: 4
```

- Ví dụ 2:

![](https://assets.leetcode.com/uploads/2020/11/26/max2grid.jpg)

```python
Input: matrix = [["0","1"],["1","0"]]
Output: 1
```

#### 4.2.3 Ý tưởng giải quyết

##### Ý tưởng 1: Quy hoạch động

###### 1. Phân chia giai đoạn

Phân chia giai đoạn dựa trên tọa độ góc dưới cùng bên phải của hình vuông.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[i][j]$ là cạnh dài nhất của hình vuông chứa toàn ký tự `'1'` và có góc dưới cùng bên phải là $(i, j)$.

###### 3. Công thức chuyển tiếp trạng thái

Chỉ khi $\text{matrix}[i][j] = '1'$, ta mới có thể tạo được hình vuông. Để tạo hình vuông lớn nhất, ta xem xét các hình vuông nhỏ hơn có góc dưới cùng bên phải là $(i-1, j)$, $(i, j-1)$ và $(i-1, j-1)$. Khi đó, cạnh dài nhất của hình vuông tại $(i, j)$ là cạnh dài nhất của các hình vuông nhỏer cộng thêm $1$. Tức là:

$dp[i][j] = \min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1$.

###### 4. Điều kiện ban đầu

- Khi chỉ có một hàng, cạnh dài nhất của hình vuông tại $(i, j)$ là $1$ nếu $\text{matrix}[i][j] = '1'$, ngược lại là $0$.
- Khi chỉ có một cột, cạnh dài nhất của hình vuông tại $(i, j)$ là $1$ nếu $\text{matrix}[i][j] = '1'$, ngược lại là $0$.

###### 5. Kết quả cuối cùng

Dựa trên định nghĩa trạng thái, trả về diện tích của hình vuông lớn nhất, tức là $dp[m-1][n-1]^2$.

##### Ý tưởng 1: Đoạn mã

```python
class Solution:
    def maximalSquare(self, matrix: List[List[str]]) -> int:
        m = len(matrix)
        n = len(matrix[0])
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        max_size = 0
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if matrix[i - 1][j - 1] == '1':
                    dp[i][j] = min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]) + 1
                    max_size = max(max_size, dp[i][j])
        return max_size * max_size
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(m \times n)$, trong đó $m$ và $n$ lần lượt là số hàng và số cột của ma trận. Hai vòng lặp lồng nhau có độ phức tạp thời gian là $O(m \times n)$, vậy tổng độ phức tạp thời gian là $O(m \times n)$.
- **Độ phức tạp không gian**: $O(m \times n)$. Sử dụng một mảng hai chiều để lưu trữ trạng thái, vậy tổng độ phức tạp không gian là $O(m \times n)$.

## 5. Bài toán DP tuyến tính không chuỗi

> **Bài toán DP tuyến tính không có chuỗi**: Một bài toán DP tuyến tính có đầu vào không phải là một mảng hoặc chuỗi rõ ràng nhưng vẫn có thể được phân tách thành nhiều bài toán phụ.

### 5.1 Chia số nguyên

#### 5.1.1 Liên kết câu hỏi

- [343. Integer Break](https://leetcode.com/problems/integer-break/)

### 5.1.2 Đề bài

**Mô tả**: Cho một số nguyên dương $n$ , hãy chia nó thành $k (k \ge 2)$ số nguyên dương sao cho tích của các số này là lớn nhất.

**Yêu cầu**: Trả về tích lớn nhất có thể đạt được.

**Giới hạn**:

- $2 \le n \le 58$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: n = 2
Output: 1
Giải thích: 2 = 1 + 1, 1 × 1 = 1.
```

- Ví dụ 2:

```python
Input: n = 10
Output: 36
Giải thích: 10 = 3 + 3 + 4, 3 × 3 × 4 = 36.
```

### 5.1.3 Ý tưởng giải quyết

##### Ý tưởng 1: Quy hoạch động

###### 1. Phân đoạn

Chia theo số nguyên dương.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[i]$ là: Tích lớn nhất có thể đạt được khi chia số nguyên dương $i$ thành ít nhất $2$ số nguyên dương.

###### 3. Công thức truy hồi

Khi $i \ge 2$, giả sử số nguyên dương thứ nhất trong việc chia $i$ là $j(1 \le j < i)$, ta có hai trường hợp:

1. Chia $i$ thành tổng của $j$ và $i - j$, và $i - j$ không được chia thành nhiều số nguyên dương nữa, lúc này tích là: $j \times (i - j)$.
2. Chia $i$ thành tổng của $j$ và $i - j$, và $i - j$ tiếp tục được chia thành nhiều số nguyên dương, lúc này tích là: $j \times dp[i - j]$.

Vậy $dp[i]$ lấy giá trị lớn nhất trong hai trường hợp trên. Tức là: $dp[i] = max(j \times (i - j), j \times dp[i - j])$.

Vì $1 \le j < i$, ta cần duyệt qua $j$ để tìm giá trị lớn nhất của $dp[i]$, công thức truy hồi như sau:

$dp[i] = max_{1 \le j < i}\lbrace max(j \times (i - j), j \times dp[i - j]) \rbrace$.

###### 4. Điều kiện ban đầu

- $0$ và $1$ không thể chia nên $dp[0] = 0, dp[1] = 0$.

###### 5. Kết quả cuối cùng

Dựa vào trạng thái đã định nghĩa, $dp[i]$ là tích lớn nhất có thể đạt được khi chia số nguyên dương $i$ thành ít nhất $2$ số nguyên dương. Vậy kết quả cuối cùng là $dp[n]$.

##### Ý tưởng 1: Code

```python
class Solution:
    def integerBreak(self, n: int) -> int:
        dp = [0 for _ in range(n + 1)]
        for i in range(2, n + 1):
            for j in range(i):
                dp[i] = max(dp[i], (i - j) * j, dp[i - j] * j)
        return dp[n]
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n^2)$.
- **Độ phức tạp không gian**: $O(n)$.

### 5.2 Chỉ có hai nút

#### 5.2.1 Liên kết đến đề bài

- [650. 2 Keys Keyboard](https://leetcode.com/problems/2-keys-keyboard/)

#### 5.2.2 Đề bài

**Mô tả**: Ban đầu, trên bảng ghi chỉ có một ký tự `'A'`. Bạn có thể thực hiện hai loại hoạt động sau trên bảng ghi:

- **Copy All (Sao chép tất cả)**: Sao chép tất cả các ký tự trên bảng ghi (không cho phép sao chép một phần ký tự).
- **Paste (Dán)**: Dán ký tự đã sao chép lần trước.

Bây giờ, cho một số nguyên $n$, bạn cần sử dụng số lần ít nhất để in ra chính xác $n$ ký tự `'A'` trên bảng ghi.

**Yêu cầu**: Trả về số lần ít nhất để in ra $n$ ký tự `'A'`.

**Giới hạn**:

- $1 \le n \le 1000$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: 3
Output: 3
Giải thích
Ban đầu, chỉ có một ký tự 'A'.
Bước 1, thực hiện hoạt động Copy All.
Bước 2, thực hiện hoạt động Paste để có được 'AA'.
Bước 3, thực hiện hoạt động Paste để có được 'AAA'.
```

- Ví dụ 2:

```python
Input: n = 1
Output: 0
```

#### 5.2.3 Ý tưởng giải quyết

##### Ý tưởng 1: Quy hoạch động

###### 1. Phân đoạn

Chia theo số lượng ký tự `'A'`.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[i]$ là số lần ít nhất cần thiết để in ra $i$ ký tự `'A'` trên bảng ghi.

###### 3. Công thức truy hồi

1. Đối với $i$ ký tự `'A'`, nếu $i$ chia hết cho một số nguyên $j$ nhỏ hơn $i$, thì có nghĩa là $j$ ký tự `'A'` có thể được sao chép và dán $i/j$ lần để có được $i$ ký tự `'A'`.
2. Số lần ít nhất cần thiết để có được $j$ ký tự `'A'` có thể được lấy từ $dp[j]$.

Vì vậy, ta có thể duyệt qua các ước số của $i$ và tìm giá trị nhỏ nhất trong các trường hợp $dp[j] + i/j$ và $dp[i/j] + j$.

Tổng quát lại, công thức truy hồi là: $dp[i] = \min_{j | i}(dp[i], dp[j] + i/j, dp[i/j] + j)$.

###### 4. Điều kiện ban đầu

- Khi $i = 1$, số lần ít nhất cần thiết là $0$. Vì vậy $dp[1] = 0$.

###### 5. Kết quả cuối cùng

Dựa vào trạng thái đã định nghĩa, $dp[i]$ là số lần ít nhất cần thiết để in ra $i$ ký tự `'A'` trên bảng ghi. Vậy kết quả cuối cùng là $dp[n]$.

##### Ý tưởng 1: Code

```python
import math

class Solution:
    def minSteps(self, n: int) -> int:
        dp = [0 for _ in range(n + 1)]
        for i in range(2, n + 1):
            dp[i] = float('inf')
            for j in range(1, int(math.sqrt(n)) + 1):
                if i % j == 0:
                    dp[i] = min(dp[i], dp[j] + i // j, dp[i // j] + j)

        return dp[n]
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \sqrt{n})$. Vòng lặp bên ngoài có độ phức tạp thời gian là $O(n)$, vòng lặp bên trong có độ phức tạp thời gian là $O(\sqrt{n})$, vì vậy tổng độ phức tạp thời gian là $O(n \sqrt{n})$.
- **Độ phức tạp không gian**: $O(n)$. Sử dụng một mảng một chiều để lưu trạng thái, vì vậy tổng độ phức tạp không gian là $O(n)$.
