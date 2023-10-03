---
title: Counting DP
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-10-03
date modified: 2023-10-03
---

## 1. Giới thiệu về DP loại đếm

### 1.1 Bài toán đếm

> **Bài toán đếm**: Là vấn đề tính toán số lượng cách thực hiện thỏa mãn các điều kiện cụ thể.

Ở đây, "số lượng cách thực hiện" đề cập đến số lượng phương pháp để giải quyết một vấn đề.

"Bài toán đếm" là một phần quan trọng trong toán tổ hợp, và thường có hai phương pháp giải quyết cổ điển cho loại vấn đề này:

1. Tìm mối quan hệ đệ quy, sau đó sử dụng quy hoạch động để xây dựng công thức đệ quy và tính toán số lượng cách thực hiện.
2. Chuyển vấn đề thành vấn đề toán học và tính toán số lượng kết hợp, ví dụ: số Catalan, mũ nhanh, số hoán vị, số tổ hợp, v.v.

Khi giải quyết vấn đề cụ thể, cần phân tích dựa trên tình huống cụ thể của đề bài. Thông thường, chúng ta sử dụng phương pháp thứ nhất để giải quyết vấn đề này. Điều này là vì:

1. Sử dụng quy hoạch động có thể xử lý hiệu quả các Bài toán đếm quy mô lớn và sử dụng ít thời gian và không gian.
2. Ngay cả khi tìm được số kết hợp, vẫn phải đối mặt với khó khăn trong việc tính toán số kết hợp (tính toán số kết hợp cấp cao khó khăn, hiệu suất tính toán thấp).

Vì vậy, chúng ta thường sử dụng phương pháp "quy hoạch động" để giải quyết Bài toán đếm.

### 1.2 Giới thiệu về DP loại đếm

> **DP loại đếm**: Là một loại vấn đề sử dụng phương pháp quy hoạch động để đếm số lượng cách thực hiện thỏa mãn các điều kiện. Khác với việc tìm giải pháp tối ưu, DP loại đếm yêu cầu đếm tất cả các giải pháp thỏa mãn điều kiện và đảm bảo không trùng lặp và không bỏ sót.

Ý tưởng cốt lõi của DP loại đếm là: sử dụng phương pháp quy hoạch động để tính toán số lượng cách giải quyết vấn đề này. Thông thường, DP loại đếm chỉ quan tâm đến số lượng cách thực hiện, không quan tâm đến chi tiết cách thực hiện.

Ví dụ, từ một ma trận đi từ góc trên bên trái đến góc dưới bên phải, chỉ có thể đi sang phải hoặc đi xuống, có tất cả bao nhiêu đường đi khác nhau. **Lưu ý**: Ở đây chúng ta đang tính số lượng đường đi, chứ không phải cách đi cụ thể.

## 2. Ứng dụng của DP loại đếm

### 2.1 Đường đi khác nhau

#### 2.1.1 Liên kết đề bài

- [62. Unique Paths](https://leetcode.com/problems/unique-paths/)

#### 2.1.2 Tóm tắt đề bài

**Mô tả**: Cho hai số nguyên $m$ và $n$, đại diện cho một bảng có kích thước $m \times n$, một robot đang đứng ở góc trái trên của bảng, robot chỉ có thể di chuyển sang phải hoặc xuống dưới một bước.

**Yêu cầu**: Tính số lượng đường đi khác nhau mà robot có thể đi từ góc trái trên đến góc phải dưới của bảng.

**Giới hạn**:

- $1 \le m, n \le 100$.
- Kết quả đảm bảo nhỏ hơn hoặc bằng $2 \times 10^9$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: m = 3, n = 7
Output: 28
```

![](https://assets.leetcode.com/uploads/2018/10/22/robot_maze.png)

- Ví dụ 2:

```python
Input: m = 3, n = 2
Output: 3
Explanation:
Có 3 đường đi từ góc trái trên đến góc phải dưới.
1. Sang phải -> Xuống dưới -> Xuống dưới
2. Xuống dưới -> Xuống dưới -> Sang phải
3. Xuống dưới -> Sang phải -> Xuống dưới
```

#### 2.1.3 Ý tưởng giải quyết

##### Ý tưởng 1: Quy hoạch động

###### 1. Phân chia giai đoạn

Phân chia giai đoạn dựa trên vị trí kết thúc của đường đi (tạo thành cặp tọa độ hàng và cột).

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[i][j]$ là số lượng đường đi từ góc trái trên đến vị trí $(i, j)$.

###### 3. Công thức chuyển trạng thái

Vì chúng ta chỉ có thể đi sang phải hoặc xuống dưới một bước, nên để đi đến $(i, j)$, chúng ta chỉ có thể đi từ $(i - 1, j)$ xuống dưới một bước; hoặc từ $(i, j - 1)$ sang phải một bước. Vì vậy, ta có thể viết công thức chuyển trạng thái như sau: $dp[i][j] = dp[i - 1][j] + dp[i][j - 1]$, với $i > 0, j > 0$.

###### 4. Điều kiện ban đầu

- Để đi từ góc trái trên đến $(0, 0)$ chỉ có một cách, tức là $dp[0][0] = 1$.
- Các phần tử trong hàng đầu tiên chỉ có một đường đi (chỉ có thể đi từ phần tử trước đó sang phải), vì vậy $dp[0][j] = 1$.
- Tương tự, các phần tử trong cột đầu tiên chỉ có một đường đi (chỉ có thể đi từ phần tử trên đó xuống dưới), vì vậy $dp[i][0] = 1$.

###### 5. Kết quả cuối cùng

Dựa trên định nghĩa trạng thái, kết quả cuối cùng là $dp[m - 1][n - 1]$, tức là số lượng đường đi từ góc trái trên đến góc phải dưới $(m - 1, n - 1)$ là $dp[m - 1][n - 1]$.

##### Ý tưởng 1: Code quy hoạch động

```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        dp = [[0 for _ in range(n)] for _ in range(m)]
        
        for j in range(n):
            dp[0][j] = 1
        for i in range(m):
            dp[i][0] = 1

        for i in range(1, m):
            for j in range(1, n):
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
        
        return dp[m - 1][n - 1]
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(m \times n)$. Điều kiện ban đầu được gán trong thời gian $O(m + n)$, hai vòng lặp lồng nhau được thực hiện trong thời gian $O(m \times n)$, vì vậy tổng thời gian là $O(m \times  n)$.
- **Độ phức tạp không gian**: $O(m \times n)$. Chúng ta sử dụng một mảng hai chiều để lưu trữ trạng thái, vì vậy độ phức tạp không gian là $O(m \times n)$. Tuy nhiên, trạng thái $dp[i][j]$ chỉ phụ thuộc vào giá trị phía trên $dp[i - 1][j]$ và bên trái $dp[i][j - 1]$, và chúng ta duyệt qua các phần tử theo thứ tự từ trên xuống dưới, từ trái qua phải. Vì vậy, chúng ta có thể sử dụng một mảng một chiều có độ dài $m$ để lưu trữ trạng thái, từ đó giảm độ phức tạp không gian xuống $O(m)$

### 2.2 Phân tích số nguyên

#### 2.2.1 Liên kết đề bài

- [343. Integer Break](https://leetcode.com/problems/integer-break/)

#### 2.2.2 Tóm tắt đề bài

**Mô tả**: Cho một số nguyên dương $n$，phân tích số $n$ thành tổng của $k$ số nguyên dương ($k \ge 2$) và tìm cách nhân các số này để có được tích lớn nhất.

**Yêu cầu**: Trả về tích lớn nhất có thể đạt được.

**Giới hạn**:

- $2 \le n \le 58$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: n = 2
Output: 1
Explanation: 2 = 1 + 1, 1 × 1 = 1。
```

- Ví dụ 2:

```python
Input: n = 10
Output: 36
Explanation: 10 = 3 + 3 + 4, 3 × 3 × 4 = 36。
```

#### 2.2.3 Ý tưởng giải quyết

##### Ý tưởng 1: Quy hoạch động

###### 1. Phân chia giai đoạn

Phân chia giai đoạn dựa trên số nguyên dương để phân tích.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[i]$ là tích lớn nhất có thể đạt được bằng cách phân tích số nguyên dương $i$ thành ít nhất $2$ số nguyên dương.

###### 3. Công thức chuyển trạng thái

Khi $i \ge 2$，giả sử số nguyên dương thứ $1$ trong phân tích của $i$ là $j(1 \le j < i)$，ta có hai trường hợp:

1. Phân tích $i$ thành tổng của $j$ và $i - j$，và $i - j$ không được phân tích thành nhiều số nguyên dương, lúc này tích là：$j \times (i - j)$。
2. Phân tích $i$ thành tổng của $j$ và $i - j$，và $i - j$ tiếp tục được phân tích thành nhiều số nguyên dương, lúc này tích là：$j \times dp[i - j]$。

Vậy $dp[i]$ lấy giá trị lớn nhất trong hai trường hợp trên. Tức là：$dp[i] = max(j \times (i - j), j \times dp[i - j])$。

Vì $1 \le j < i$，ta cần duyệt qua $j$ để tìm giá trị lớn nhất của $dp[i]$，nên công thức chuyển trạng thái như sau：

$dp[i] = max_{1 \le j < i}\lbrace max(j \times (i - j), j \times dp[i - j]) \rbrace$。

###### 4. Điều kiện ban đầu

- $0$ và $1$ không thể phân tích, nên $dp[0] = 0, dp[1] = 0$。

###### 5. Kết quả cuối cùng

Dựa trên định nghĩa trạng thái, $dp[i]$ là tích lớn nhất có thể đạt được bằng cách phân tích số nguyên dương $i$ thành ít nhất $2$ số nguyên dương. Vậy kết quả cuối cùng là $dp[n]$。

##### Ý tưởng 1: Code quy hoạch động

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

- **Độ phức tạp thời gian**: $O(n^2)$。
- **Độ phức tạp không gian**: $O(n)$。
