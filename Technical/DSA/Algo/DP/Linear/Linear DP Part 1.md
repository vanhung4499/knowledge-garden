---
title: Linear DP Part 1
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-10-03
date modified: 2023-10-03
---

## 1. Giới thiệu về Quy hoạch động tuyến tính

> **Quy hoạch động tuyến tính**: Phương pháp quy hoạch động tuyến tính là phương pháp quy hoạch động mà các giai đoạn được chia thành "tuyến tính" (được gọi là "DP tuyến tính").

Nếu trạng thái có nhiều chiều, nhưng mỗi chiều đều được chia thành các giai đoạn tuyến tính, cũng được coi là DP tuyến tính. Ví dụ như bài toán cái túi, DP khoảng cách, DP số chữ số, v.v. đều thuộc loại DP tuyến tính.

Có nhiều cách để chia các bài toán DP tuyến tính.

- Nếu phân loại theo "số chiều của trạng thái", chúng ta có thể chia các bài toán DP tuyến tính thành: bài toán DP tuyến tính một chiều, bài toán DP tuyến tính hai chiều và bài toán DP tuyến tính nhiều chiều.
- Nếu phân loại theo "định dạng đầu vào của bài toán", chúng ta có thể chia các bài toán DP tuyến tính thành: bài toán DP tuyến tính đơn chuỗi, bài toán DP tuyến tính hai chuỗi, bài toán DP tuyến tính ma trận và bài toán DP tuyến tính không có chuỗi.

Trong bài viết này, chúng ta sẽ phân loại các bài toán DP tuyến tính theo định dạng đầu vào của chúng và giải thích từng loại bài toán.

## 2. Vấn đề DP tuyến tính đơn chuỗi

> **Vấn đề DP tuyến tính đơn chuỗi**: Vấn đề có đầu vào là một mảng hoặc một chuỗi duy nhất trong DP tuyến tính. Trạng thái thường được định nghĩa là $dp[i]$, biểu thị:
>
> 1. Các giải pháp liên quan đến "mảng con kết thúc tại vị trí thứ $i$ trong mảng ($nums[0]…nums[i]$)".
> 2. Các giải pháp liên quan đến "mảng con kết thúc tại vị trí thứ $i - 1$ trong mảng ($nums[0]…nums[i - 1]$)".
> 3. Các giải pháp liên quan đến "mảng con bao gồm $i$ phần tử đầu tiên trong mảng ($nums[0]…nums[i - 1]$)".

Sự khác biệt giữa 3 cách định nghĩa trạng thái này là một phần tử $nums[i]$.

1. Trạng thái thứ nhất: Độ dài của mảng con là $i + 1$, mảng con không thể rỗng.
2. Trạng thái thứ hai và trạng thái thứ ba: Hai trạng thái này có cùng mô tả. Độ dài của mảng con là $i$, mảng con có thể rỗng. Khi $i = 0$, trạng thái này được sử dụng để biểu thị mảng rỗng (bao gồm $0$ phần tử đầu tiên trong mảng).

### 2.1 Dãy con tăng dài nhất

Vấn đề DP tuyến tính đơn chuỗi phổ biến nhất trong DP tuyến tính là "**Dãy con tăng dài nhất**" (Longest Increasing Subsequence - LIS).

#### 2.1.1 Liên kết vấn đề

- [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)

#### 2.1.2 Tóm tắt vấn đề

**Mô tả**: Cho một mảng số nguyên $nums$.

**Yêu cầu**: Tìm độ dài của dãy con tăng dài nhất trong mảng.

**Giải thích**:

- **Dãy con**: Một dãy con được tạo ra bằng cách xóa (hoặc không xóa) các phần tử trong mảng mà không làm thay đổi thứ tự các phần tử còn lại. Ví dụ, $[3,6,2,7]$ là một dãy con của mảng $[0,3,1,6,2,2,7]$.
- $1 \le \text{nums.length} \le 2500$.
- $-10^4 \le \text{nums[i]} \le 10^4$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums = [10,9,2,5,3,7,101,18]
Output: 4
Explanation: Dãy con tăng dài nhất là [2,3,7,101], nên độ dài là 4.
```

- Ví dụ 2:

```python
Input: nums = [0,1,0,3,2,3]
Output: 4
```

#### 2.1.3 Ý tưởng giải quyết

##### Ý tưởng 1: Quy hoạch động

###### 1. Phân chia giai đoạn

Phân chia giai đoạn dựa trên vị trí kết thúc của dãy con.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[i]$ biểu thị: độ dài của dãy con tăng dài nhất kết thúc tại vị trí thứ $i$ trong mảng.

###### 3. Công thức chuyển tiếp trạng thái

Nếu một số nhỏ hơn xuất hiện sau một số lớn hơn, nó sẽ tạo thành một dãy con tăng dài hơn.

Với các phần tử $nums[j]$ và $nums[i]$ thỏa mãn $0 \le j < i$:

- Nếu $nums[j] < nums[i]$, thì $nums[i]$ có thể được thêm vào sau $nums[j]$, trong trường hợp này, độ dài của dãy con tăng dài nhất kết thúc tại vị trí thứ $i$ sẽ là độ dài của dãy con tăng dài nhất kết thúc tại vị trí thứ $j$ cộng thêm $1$, tức là $dp[i] = dp[j] + 1$.
- Nếu $nums[j] \le nums[i]$, thì $nums[i]$ không thể được thêm vào sau $nums[j]$, nên ta có thể bỏ qua.

Tổng kết lại, công thức chuyển tiếp trạng thái là: $dp[i] = \max(dp[i], dp[j] + 1), 0 \le j < i, nums[j] < nums[i]$.

###### 4. Điều kiện ban đầu

Mặc định, mỗi phần tử trong mảng được coi là một dãy con tăng dài nhất có độ dài là $1$, tức là $dp[i] = 1$.

###### 5. Kết quả cuối cùng

Dựa trên định nghĩa trạng thái, $dp[i]$ biểu thị: độ dài của dãy con tăng dài nhất kết thúc tại vị trí thứ $i$ trong mảng. Để tính toán độ dài dãy con tăng dài nhất lớn nhất, ta cần duyệt qua mảng $dp$ và tìm giá trị lớn nhất.

##### Ý tưởng 1: Code quy hoạch động

```python
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        size = len(nums)
        dp = [1 for _ in range(size)]

        for i in range(size):
            for j in range(i):
                if nums[i] > nums[j]:
                    dp[i] = max(dp[i], dp[j] + 1)
        
        return max(dp)
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n^2)$. Vòng lặp lồng nhau có độ phức tạp $O(n^2)$, và việc tìm giá trị lớn nhất có độ phức tạp $O(n)$, vì vậy tổng thời gian phức tạp là $O(n^2)$.
- **Độ phức tạp không gian**: $O(n)$. Sử dụng mảng một chiều để lưu trạng thái, vì vậy không gian phức tạp là $O(n)$.

### 2.2 Tổng con tăng lớn nhất

Trong các vấn đề DP tuyến tính một chuỗi, ngoài các vấn đề liên quan đến dãy con, còn có các vấn đề liên quan đến mảng con.

> **Lưu ý**:
>
> - **Dãy con**: Là một dãy được tạo ra bằng cách xóa (hoặc không xóa) các phần tử trong mảng mà không làm thay đổi thứ tự các phần tử còn lại.
> - **Mảng con**: Là một dãy con liên tiếp trong mảng.

#### 2.2.1 Liên kết vấn đề

- [53. Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)

#### 2.2.2 Tóm tắt vấn đề

**Mô tả**: Cho một mảng số nguyên $nums$.

**Yêu cầu**: Tìm tổng lớn nhất của một mảng con liên tiếp trong mảng.

**Giải thích**:

- **Mảng con**: Là một dãy con liên tiếp trong mảng.
- $1 \le \text{nums.length} \le 10^5$.
- $-10^4 \le \text{nums[i]} \le 10^4$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: Mảng con liên tiếp [4,-1,2,1] có tổng lớn nhất là 6.
```

- Ví dụ 2:

```python
Input: nums = [1]
Output: 1
```

#### 2.2.3 Ý tưởng giải quyết

##### Ý tưởng 1: Quy hoạch động

###### 1. Phân chia giai đoạn

Phân chia giai đoạn dựa trên vị trí kết thúc của mảng con liên tiếp.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[i]$ là tổng lớn nhất của một mảng con liên tiếp kết thúc tại vị trí thứ $i$ trong mảng.

###### 3. Công thức chuyển tiếp trạng thái

Trạng thái $dp[i]$ là tổng lớn nhất của một mảng con liên tiếp kết thúc tại vị trí thứ $i$ trong mảng. Vì vậy, chúng ta có thể thảo luận về $dp[i]$ dựa trên "tổng lớn nhất của mảng con liên tiếp kết thúc tại vị trí thứ $i - 1$" và "giá trị hiện tại của phần tử $nums[i]$".

- Nếu $dp[i - 1] < 0$, tức là "tổng lớn nhất của mảng con liên tiếp kết thúc tại vị trí thứ $i - 1$" + "giá trị hiện tại của phần tử $nums[i]$" < "giá trị hiện tại của phần tử $nums[i]$", tức là $dp[i - 1] + nums[i] < nums[i]$. Vì vậy, lúc này $dp[i]$ sẽ bằng "giá trị hiện tại của phần tử $nums[i]$", tức là $dp[i] = nums[i]$.
- Nếu $dp[i - 1] \ge 0$, tức là "tổng lớn nhất của mảng con liên tiếp kết thúc tại vị trí thứ $i - 1$" + "giá trị hiện tại của phần tử $nums[i]$" >= "giá trị hiện tại của phần tử $nums[i]$", tức là $dp[i - 1] + nums[i] \ge nums[i]$. Vì vậy, lúc này $dp[i]$ sẽ bằng "tổng lớn nhất của mảng con liên tiếp kết thúc tại vị trí thứ $i - 1$" + "giá trị hiện tại của phần tử $nums[i]$", tức là $dp[i] = dp[i - 1] + nums[i]$.

Tổng kết lại, công thức chuyển tiếp trạng thái là:

$dp[i] = \begin{cases} nums[i], &  dp[i - 1] < 0 \cr dp[i - 1] + nums[i] & dp[i - 1] \ge 0 \end{cases}$

###### 4. Điều kiện ban đầu

- Tổng lớn nhất của mảng con kết thúc tại vị trí thứ $0$ là $nums[0]$, tức là $dp[0] = nums[0]$.

###### 5. Kết quả cuối cùng

Dựa trên định nghĩa trạng thái, $dp[i]$ là tổng lớn nhất của một mảng con liên tiếp kết thúc tại vị trí thứ $i$ trong mảng. Vì vậy, kết quả cuối cùng sẽ là giá trị lớn nhất trong tất cả các $dp[i]$, tức là $\max(dp)$.

##### Ý tưởng 1: Code quy hoạch động

```python
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        size = len(nums)
        dp = [0 for _ in range(size)]

        dp[0] = nums[0]
        for i in range(1, size):
            if dp[i - 1] < 0:
                dp[i] = nums[i]
            else:
                dp[i] = dp[i - 1] + nums[i]
        return max(dp)
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$, trong đó $n$ là số lượng phần tử trong mảng $nums$.
- **Độ phức tạp không gian**: $O(n)$.

##### Ý tưởng 2: Quy hoạch động + Tối ưu cuộn

Vì $dp[i]$ chỉ phụ thuộc vào $dp[i - 1]$ và phần tử hiện tại $nums[i]$, chúng ta cũng có thể sử dụng một biến $subMax$ để biểu diễn tổng lớn nhất của một mảng con liên tiếp kết thúc tại vị trí thứ $i$. Sau đó, chúng ta sử dụng biến $ansMax$ để lưu giữ giá trị lớn nhất toàn cục.

##### Ý tưởng 2: Code quy hoạch động

```python
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        size = len(nums)
        subMax = nums[0]
        ansMax = nums[0]

        for i in range(1, size):
            if subMax < 0:
                subMax = nums[i]
            else:
                subMax += nums[i]
            ansMax = max(ansMax, subMax)
        return ansMax
```

##### Ý tưởng 2: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$, trong đó $n$ là số lượng phần tử trong mảng $nums$.
- **Độ phức tạp không gian**: $O(1)$.

### 2.3 Độ dài dãy con Fibonacci dài nhất

Một số vấn đề DP tuyến tính một chuỗi đòi hỏi xem xét hai vị trí kết thúc, và không thể mô tả rõ ràng vấn đề chỉ với một vị trí kết thúc. Trong trường hợp này, chúng ta cần thêm một chiều kết thúc để định nghĩa trạng thái.

#### 2.3.1 Liên kết vấn đề

- [873. Length of Longest Fibonacci Subsequence](https://leetcode.com/problems/length-of-longest-fibonacci-subsequence/)

#### 2.3.2 Tóm tắt vấn đề

**Mô tả**: Cho một mảng số nguyên $arr$ được sắp xếp tăng dần.

**Yêu cầu**: Tìm độ dài dãy con Fibonacci dài nhất trong mảng. Nếu không có dãy con Fibonacci, trả về 0.

**Giải thích**:

- **Dãy con Fibonacci**: Nếu dãy $X_1, X_2, …, X_n$ thỏa mãn:
  - $n \ge 3$;
  - Với mọi $i + 2 \le n$, ta có $X_i + X_{i+1} = X_{i+2}$.

  thì gọi dãy đó là dãy con Fibonacci.

- **Dãy con Fibonacci**: Là một dãy con liên tiếp trong mảng thỏa mãn dãy con Fibonacci. Ví dụ: $A = [3, 4, 5, 6, 7, 8]$. Dãy con Fibonacci của $A$ là $[3, 5, 8]$.
- $3 \le \text{arr.length} \le 1000$.
- $1 \le \text{arr[i]} < \text{arr[i + 1]} \le 10^9$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: arr = [1,2,3,4,5,6,7,8]
Output: 5
Explanation: Dãy con Fibonacci dài nhất là [1,2,3,5,8].
```

- Ví dụ 2:

```python
Input: arr = [1,3,7,11,12,14,18]
Output: 3
Explanation: Có 3 dãy con Fibonacci dài nhất là [1,11,12], [3,11,14] và [7,11,18].
```

#### 2.3.3 Ý tưởng giải quyết

##### Ý tưởng 1: Duyệt tất cả các cặp (vượt quá giới hạn thời gian)

Giả sử $arr[i]$ và $arr[j]$ là hai phần tử trong mảng $arr$ và thỏa mãn $arr[i] + arr[j] = arr[k]$ với $k > j$.

Dựa trên $arr[i]$ và $arr[j]$, chúng ta có thể xác định giá trị tiếp theo trong dãy Fibonacci là $arr[i] + arr[j]$.

Vì mảng đã được sắp xếp tăng dần, nếu chúng ta tìm thấy $arr[i] + arr[j]$ trong mảng $arr$ và $arr[i] + arr[j] = arr[k]$ với $k > j$ thì chúng ta có thể tạo ra một dãy Fibonacci dài hơn.

Để tìm dãy Fibonacci dài nhất, chúng ta sẽ duyệt qua tất cả các cặp $(arr[i], arr[j])$ và kiểm tra xem có thể tạo ra dãy Fibonacci dài hơn không.

##### Ý tưởng 1: Code

```python
class Solution:
    def lenLongestFibSubseq(self, arr: List[int]) -> int:
        size = len(arr)
        ans = 0
        for i in range(size):
            for j in range(i + 1, size):
                temp_ans = 0
                temp_i = i
                temp_j = j
                k = j + 1
                while k < size:
                    if arr[temp_i] + arr[temp_j] == arr[k]:
                        temp_ans += 1
                        temp_i = temp_j
                        temp_j = k
                    k += 1
                if temp_ans > ans:
                    ans = temp_ans

        if ans > 0:
            return ans + 2
        else:
            return ans
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n^3)$, trong đó $n$ là số lượng phần tử trong mảng $arr$.
- **Độ phức tạp không gian**: $O(1)$.

##### Ý tưởng 2: Sử dụng bảng băm

Với $arr[i]$ và $arr[j]$, chúng ta có thể kiểm tra xem $arr[i] + arr[j]$ có tồn tại trong mảng $arr$ hay không bằng cách sử dụng một bảng băm. Bảng băm này sẽ lưu trữ các giá trị trong mảng $arr$ và chỉ mất $O(1)$ thời gian để kiểm tra một giá trị có tồn tại trong bảng băm hay không.

##### Ý tưởng 2: Code

```python
class Solution:
    def lenLongestFibSubseq(self, arr: List[int]) -> int:
        size = len(arr)
        ans = 0
        idx_map = dict()
        for idx, value in enumerate(arr):
            idx_map[value] = idx
        
        for i in range(size):
            for j in range(i + 1, size):
                temp_ans = 0
                temp_i = i
                temp_j = j
                while arr[temp_i] + arr[temp_j] in idx_map:
                    temp_ans += 1
                    k = idx_map[arr[temp_i] + arr[temp_j]]
                    temp_i = temp_j
                    temp_j = k

                if temp_ans > ans:
                    ans = temp_ans

        if ans > 0:
            return ans + 2
        else:
            return ans
```

##### Ý tưởng 2: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n^2)$, trong đó $n$ là số lượng phần tử trong mảng $arr$.
- **Độ phức tạp không gian**: $O(n)$.

##### Ý tưởng 3: Quy hoạch động + Bảng băm

###### 1. Phân chia giai đoạn

Phân chia giai đoạn dựa trên hai vị trí kết thúc của dãy con Fibonacci.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[i][j]$ là độ dài dãy con Fibonacci dài nhất kết thúc tại vị trí thứ $i$ và vị trí thứ $j$ trong mảng.

###### 3. Công thức chuyển tiếp trạng thái

Độ dài dãy con Fibonacci dài nhất kết thúc tại vị trí thứ $j$ và vị trí thứ $k$ = Tìm $i$ sao cho $arr[i] + arr[j] = arr[k]$ và $i < j < k$ và cộng thêm $1$ vào độ dài dãy con Fibonacci dài nhất kết thúc tại vị trí thứ $i$ và vị trí thứ $j$.

Công thức chuyển tiếp trạng thái: $dp[j][k] = \max_{(A[i] + A[j] = A[k], \quad i < j < k)}(dp[i][j] + 1)$.

###### 4. Điều kiện ban đầu

Mọi cặp phần tử liên tiếp trong mảng có thể tạo thành một dãy con Fibonacci có độ dài là $2$, nên $dp[i][j] = 2$.

###### 5. Kết quả cuối cùng

Dựa trên định nghĩa trạng thái, $dp[i][j]$ là độ dài dãy con Fibonacci dài nhất kết thúc tại vị trí thứ $i$ và vị trí thứ $j$ trong mảng. Để tính toán độ dài dãy con Fibonacci dài nhất, chúng ta sẽ duyệt qua tất cả các trạng thái $dp[i][j]$ và tìm giá trị lớn nhất.

Vì đề bài yêu cầu dãy con Fibonacci có độ dài ít nhất là $3$, nên nếu giá trị lớn nhất tìm được là $2$ hoặc nhỏ hơn, chúng ta sẽ trả về $0$.

##### Ý tưởng 3: Code

```python
class Solution:
    def lenLongestFibSubseq(self, arr: List[int]) -> int:
        size = len(arr)
        
        dp = [[0 for _ in range(size)] for _ in range(size)]
        ans = 0

        # Khởi tạo dp
        for i in range(size):
            for j in range(i + 1, size):
                dp[i][j] = 2

        idx_map = {}
        # Tạo bảng băm để tra cứu giá trị trong mảng arr
        for idx, value in enumerate(arr):
            idx_map[value] = idx

        for i in range(size):
            for j in range(i + 1, size):
                if arr[i] + arr[j] in idx_map:    
                    # Lấy chỉ số của arr[i] + arr[j], tức là phần tử tiếp theo trong dãy Fibonacci
                    k = idx_map[arr[i] + arr[j]]
                    
                    dp[j][k] = max(dp[j][k], dp[i][j] + 1)
                    ans = max(ans, dp[j][k])
                    

        if ans >= 3:
            return ans
        return 0
```

##### Ý tưởng 3: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n^2)$, trong đó $n$ là số lượng phần tử trong mảng $arr$.
- **Độ phức tạp không gian**: $O(n^2)$.

## 3. Vấn đề DP tuyến tính hai chuỗi

> **Vấn đề DP tuyến tính hai chuỗi**: Vấn đề có đầu vào là hai mảng hoặc hai chuỗi duy nhất trong DP tuyến tính. Trạng thái thường được định nghĩa là $dp[i][j]$, biểu thị:
>
> 1. Các giải pháp liên quan đến "mảng con kết thúc tại vị trí thứ $i$ trong mảng thứ nhất ($nums1[0]…nums1[i]$)" và "mảng con kết thúc tại vị trí thứ $j$ trong mảng thứ hai ($nums2[0]…nums2[j]$)".
> 2. Các giải pháp liên quan đến "mảng con kết thúc tại vị trí thứ $i - 1$ trong mảng thứ nhất ($nums1[0]…nums1[i - 1]$)" và "mảng con kết thúc tại vị trí thứ $j - 1$ trong mảng thứ hai ($nums2[0]…nums2[j - 1]$)".
> 3. Các giải pháp liên quan đến "mảng con bao gồm $i$ phần tử đầu tiên trong mảng thứ nhất ($nums1[0]…nums1[i - 1]$)" và "mảng con bao gồm $j$ phần tử đầu tiên trong mảng thứ hai ($nums2[0]…nums2[j - 1]$)".

Sự khác biệt giữa 3 cách định nghĩa trạng thái này là một phần tử $nums1[i]$ hoặc $nums2[j]$.

1. Trạng thái thứ nhất: Độ dài của mảng con là $i + 1$ hoặc $j + 1$ và không thể rỗng.
2. Trạng thái thứ hai và trạng thái thứ ba: Hai trạng thái này có cùng mô tả. Độ dài của mảng con là $i$ hoặc $j$ và có thể rỗng. Khi $i = 0$ hoặc $j = 0$, trạng thái này được sử dụng để biểu diễn mảng rỗng (bao gồm $0$ phần tử đầu tiên trong mảng).

### 3.1 Tìm dãy con chung dài nhất

Vấn đề DP tuyến tính trong hai chuỗi có vấn đề cổ điển nhất là "Tìm dãy con chung dài nhất (Longest Common Subsequence, gọi tắt là LCS)".

#### 3.1.1 Liên kết đề bài

- [1143. Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/)

#### 3.1.2 Tóm tắt đề bài

**Mô tả**: Cho hai chuỗi $text1$ và $text2$.

**Yêu cầu**: Trả về độ dài của dãy con chung dài nhất của hai chuỗi. Nếu không có dãy con chung, trả về $0$.

**Giải thích**:

- **Dãy con**: Chuỗi mới được tạo thành bằng cách xóa một số ký tự từ chuỗi gốc mà không thay đổi thứ tự tương đối của các ký tự.
- **Dãy con chung**: Dãy con mà hai chuỗi có chung.
- $1 \le text1.length, text2.length \le 1000$.
- $text1$ và $text2$ chỉ chứa các ký tự tiếng Anh thường.

**Ví dụ**:

- Ví dụ 1:

```python
Input: text1 = "abcde", text2 = "ace" 
Output: 3  
Explanation: Dãy con chung dài nhất là "ace", có độ dài là 3.
```

- Ví dụ 2:

```python
Input: text1 = "abc", text2 = "abc"
Output: 3
Explanation: Dãy con chung dài nhất là "abc", có độ dài là 3.
```

#### 3.1.3 Ý tưởng giải quyết

##### Ý tưởng 1: Quy hoạch động

###### 1. Phân chia giai đoạn

Phân chia giai đoạn dựa trên vị trí cuối cùng của hai chuỗi.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[i][j]$ là: Độ dài của dãy con chung dài nhất của "chuỗi con được tạo thành từ $i$ ký tự đầu tiên của $text1$" và "chuỗi con được tạo thành từ $j$ ký tự đầu tiên của $text2$" là $dp[i][j]$.

###### 3. Công thức chuyển tiếp trạng thái

Duyệt qua hai vòng lặp để duyệt qua các ký tự của $text1$ và $text2$, công thức chuyển tiếp trạng thái như sau:

1. Nếu $text1[i - 1] = text2[j - 1]$, tức là hai chuỗi con có ký tự cuối cùng giống nhau, vậy độ dài của dãy con chung tăng lên $1$. Tức là: $dp[i][j] = dp[i - 1][j - 1] + 1$.
2. Nếu $text1[i - 1] \ne text2[j - 1]$, tức là hai chuỗi con có ký tự cuối cùng khác nhau, vậy $dp[i][j]$ cần xem xét hai trường hợp sau và lấy trường hợp lớn nhất: $dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])$.
	1. Độ dài của dãy con chung của "chuỗi con được tạo thành từ $i - 1$ ký tự đầu tiên của $text1$" và "chuỗi con được tạo thành từ $j$ ký tự đầu tiên của $text2$". Tức là $dp[i - 1][j]$.
	2. Độ dài của dãy con chung của "chuỗi con được tạo thành từ $i$ ký tự đầu tiên của $text1$" và "chuỗi con được tạo thành từ $j - 1$ ký tự đầu tiên của $text2$". Tức là $dp[i][j - 1]$.

###### 4. Điều kiện ban đầu

1. Khi $i = 0$, chuỗi con của $text1$ là chuỗi rỗng, độ dài của dãy con chung giữa chuỗi rỗng và chuỗi $text2$ là $0$, tức là $dp[0][j] = 0$.
2. Khi $j = 0$, chuỗi con của $text2$ là chuỗi rỗng, độ dài của dãy con chung giữa chuỗi $text1$ và chuỗi rỗng là $0$, tức là $dp[i][0] = 0$.

###### 5. Kết quả cuối cùng

Dựa trên định nghĩa trạng thái, trả về $dp[size1][size2]$ (tức là độ dài của dãy con chung dài nhất của $text1$ và $text2$), trong đó $size1$ và $size2$ lần lượt là độ dài của $text1$ và $text2$.

##### Ý tưởng 1: Code

```python
class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        size1 = len(text1)
        size2 = len(text2)
        dp = [[0 for _ in range(size2 + 1)] for _ in range(size1 + 1)]
        for i in range(1, size1 + 1):
            for j in range(1, size2 + 1):
                if text1[i - 1] == text2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

        return dp[size1][size2]
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times m)$, trong đó $n$ và $m$ lần lượt là độ dài của chuỗi $text1$ và $text2$. Hai vòng lặp lồng nhau có độ phức tạp thời gian là $O(n \times m)$, vậy tổng độ phức tạp thời gian là $O(n \times m)$.
- **Độ phức tạp không gian**: $O(n \times m)$. Sử dụng một mảng hai chiều để lưu trữ trạng thái, vậy tổng độ phức tạp không gian là $O(n \times m)$.

### 3.2 Dãy con chung dài nhất

#### 3.2.1 Liên kết đề bài

- [718. Maximum Length of Repeated Subarray](https://leetcode.com/problems/maximum-length-of-repeated-subarray/)

#### 3.2.2 Tóm tắt đề bài

**Mô tả**: Cho hai mảng số nguyên $nums1$ và $nums2$.

**Yêu cầu**: Tính độ dài của dãy con chung dài nhất giữa hai mảng.

**Giải thích**:

- $1 \le nums1.length, nums2.length \le 1000$.
- $0 \le nums1[i], nums2[i] \le 100$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums1 = [1,2,3,2,1], nums2 = [3,2,1,4,7]
Output: 3
Explanation: Dãy con chung dài nhất là [3,2,1].
```

- Ví dụ 2:

```python
Input: nums1 = [0,0,0,0,0], nums2 = [0,0,0,0,0]
Output: 5
```

#### 3.2.3 Ý tưởng giải quyết

##### Ý tưởng 1: Quy hoạch động

###### 1. Phân chia giai đoạn

Phân chia giai đoạn dựa trên vị trí cuối cùng của hai mảng.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[i][j]$ là: Độ dài của dãy con chung dài nhất giữa "mảng con gồm $i$ phần tử đầu tiên của $nums1$" và "mảng con gồm $j$ phần tử đầu tiên của $nums2$".

###### 3. Công thức chuyển tiếp trạng thái

1. Nếu $nums1[i - 1] = nums2[j - 1]$, tức là hai phần tử cuối cùng của hai mảng con giống nhau, vậy độ dài của dãy con chung tăng lên $1$. Tức là: $dp[i][j] = dp[i - 1][j - 1] + 1$.
2. Nếu $nums1[i - 1] \ne nums2[j - 1]$, tức là hai phần tử cuối cùng của hai mảng con khác nhau, vậy $dp[i][j] = 0$.

###### 4. Điều kiện ban đầu

- Khi $i = 0$, mảng con của $nums1$ là mảng rỗng, độ dài của dãy con chung giữa mảng rỗng và mảng $nums2$ là $0$, tức là $dp[0][j] = 0$.
- Khi $j = 0$, mảng con của $nums2$ là mảng rỗng, độ dài của dãy con chung giữa mảng $nums1$ và mảng rỗng là $0$, tức là $dp[i][0] = 0$.

###### 5. Kết quả cuối cùng

- Dựa trên định nghĩa trạng thái, trả về giá trị lớn nhất trong tất cả các $dp[i][j]$ là kết quả cuối cùng.

##### Ý tưởng 1: Code

```python
class Solution:
    def findLength(self, nums1: List[int], nums2: List[int]) -> int:
        size1 = len(nums1)
        size2 = len(nums2)
        dp = [[0 for _ in range(size2 + 1)] for _ in range(size1 + 1)]
        res = 0
        for i in range(1, size1 + 1):
            for j in range(1, size2 + 1):
                if nums1[i - 1] == nums2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                if dp[i][j] > res:
                    res = dp[i][j]

        return res
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times m)$. Trong đó $n$ là độ dài của mảng $nums1$, $m$ là độ dài của mảng $nums2$. Hai vòng lặp lồng nhau có độ phức tạp thời gian là $O(n \times m)$, vậy tổng độ phức tạp thời gian là $O(n \times m)$.
- **Độ phức tạp không gian**: $O(n \times m)$. Sử dụng một mảng hai chiều để lưu trữ trạng thái, vậy tổng độ phức tạp không gian là $O(n \times m)$.

### 3.3 Khoảng cách chỉnh sửa

#### 3.3.1 Liên kết đề bài

- [72. Edit Distance](https://leetcode.com/problems/edit-distance/)

#### 3.3.2 Tóm tắt đề bài

**Mô tả**: Cho hai từ $word1$ và $word2$.

Một từ có thể thực hiện ba loại thao tác sau:

- Thêm một ký tự
- Xóa một ký tự
- Thay thế một ký tự

**Yêu cầu**: Tính số lần thao tác tối thiểu để chuyển từ $word1$ thành $word2$.

**Giải thích**:

- $0 \le word1.length, word2.length \le 500$.
- $word1$ và $word2$ chỉ chứa các ký tự thường.

**Ví dụ**:

- Ví dụ 1:

```python
Input: word1 = "horse", word2 = "ros"
Output: 3
Explanation:
horse -> rorse (thay 'h' bằng 'r')
rorse -> rose (xóa 'r')
rose -> ros (xóa 'e')
```

- Ví dụ 2:

```python
Input: word1 = "intention", word2 = "execution"
Output: 5
Explanation:
intention -> inention (xóa 't')
inention -> enention (thay 'i' bằng 'e')
enention -> exention (thay 'n' bằng 'x')
exention -> exection (thay 'n' bằng 'c')
exection -> execution (thêm 'u')
```

#### 3.3.3 Ý tưởng giải quyết

##### Ý tưởng 1: Quy hoạch động

###### 1. Phân chia giai đoạn

Phân chia giai đoạn dựa trên vị trí cuối cùng của hai từ.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[i][j]$ là: Số lần thao tác tối thiểu để chuyển từ "từ con gồm $i$ ký tự đầu tiên của $word1$" thành "từ con gồm $j$ ký tự đầu tiên của $word2$".

###### 3. Công thức chuyển tiếp trạng thái

1. Nếu hai ký tự hiện tại giống nhau ($word1[i - 1] = word2[j - 1]$), không cần thêm, xóa hoặc thay thế. $dp[i][j] = dp[i - 1][j - 1]$.
2. Nếu hai ký tự hiện tại khác nhau ($word1[i - 1] \ne word2[j - 1]$), $dp[i][j]$ lấy giá trị nhỏ nhất trong ba trường hợp sau:
   1. Thay thế ($word1[i - 1]$ thay thế bằng $word2[j - 1]$): Số lần thao tác tối thiểu phụ thuộc vào "từ con gồm $i - 1$ ký tự đầu tiên của $word1$" chuyển thành "từ con gồm $j - 1$ ký tự đầu tiên của $word2$", cộng thêm một lần thay thế, tức là $dp[i][j] = dp[i - 1][j - 1] + 1$.
   2. Thêm ($word1$ thêm một ký tự vào vị trí thứ $i - 1$): Số lần thao tác tối thiểu phụ thuộc vào "từ con gồm $i - 1$ ký tự đầu tiên của $word1$" chuyển thành "từ con gồm $j$ ký tự đầu tiên của $word2$", cộng thêm một lần thêm, tức là $dp[i][j] = dp[i - 1][j] + 1$.
   3. Xóa ($word1$ xóa ký tự thứ $i - 1$): Số lần thao tác tối thiểu phụ thuộc vào "từ con gồm $i$ ký tự đầu tiên của $word1$" chuyển thành "từ con gồm $j - 1$ ký tự đầu tiên của $word2$", cộng thêm một lần xóa, tức là $dp[i][j] = dp[i][j - 1] + 1$.

Tổng hợp các trường hợp trên, công thức chuyển tiếp trạng thái là:

$dp[i][j] = \begin{cases} dp[i - 1][j - 1] & word1[i - 1] = word2[j - 1] \cr min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]) + 1 & word1[i - 1] \ne word2[j - 1] \end{cases}$

###### 4. Điều kiện ban đầu

- Khi $i = 0$, "từ con gồm $0$ ký tự đầu tiên của $word1$" là một từ rỗng, cần thực hiện $j$ lần thêm để chuyển thành "từ con gồm $j$ ký tự đầu tiên của $word2$", tức là $dp[0][j] = j$.
- Khi $j = 0$, "từ con gồm $0$ ký tự đầu tiên của $word2$" là một từ rỗng, cần thực hiện $i$ lần xóa để chuyển từ "từ con gồm $i$ ký tự đầu tiên của $word1$" thành từ rỗng, tức là $dp[i][0] = i$.

###### 5. Kết quả cuối cùng

Dựa trên định nghĩa trạng thái, trả về giá trị nhỏ nhất trong tất cả các $dp[i][j]$ là kết quả cuối cùng.

##### Ý tưởng 1: Code

```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        size1 = len(word1)
        size2 = len(word2)
        dp = [[0 for _ in range(size2 + 1)] for _ in range(size1 + 1)]

        for i in range(size1 + 1):
            dp[i][0] = i
        for j in range(size2 + 1):
            dp[0][j] = j
        for i in range(1, size1 + 1):
            for j in range(1, size2 + 1):
                if word1[i - 1] == word2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    dp[i][j] = min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]) + 1
        return dp[size1][size2]
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times m)$. Trong đó $n$ là độ dài của từ $word1$, $m$ là độ dài của từ $word2$. Hai vòng lặp lồng nhau có độ phức tạp thời gian là $O(n \times m)$, vậy tổng độ phức tạp thời gian là $O(n \times m)$.
- **Độ phức tạp không gian**: $O(n \times m)$. Sử dụng một mảng hai chiều để lưu trữ trạng thái, vậy tổng độ phức tạp không gian là $O(n \times m)$.
