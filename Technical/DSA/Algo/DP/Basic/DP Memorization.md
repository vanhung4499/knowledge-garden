---
title: DP Memorization
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-10-02
date modified: 2023-10-02
---

## 1. Giới thiệu kỹ thuật lưu trữ

> **Kỹ thuật lưu trữ (Memorization)**: là một kĩ thuật nhằm tránh việc duyệt lại các trạng thái đã duyệt trước đó bằng cách lưu trữ thông tin trạng thái đã duyệt.

Đệ quy với kỹ thuật lưu trữ là một cách triển khai của quy hoạch động, nó chính là **tính toán từ trên xuống (top-down)** mà tôi đã đề cập trong phần tước. Ngoài ra ta có thể gọi là **DP Top-Down** hoặc trong tiếng việt, nó hay được gọi là **Đệ quy có nhớ** (Tôi thích dùng tên gọi tiếng việt này hơn).

Trong Đệ quy có nhớ, khi thuật toán cần tính toán kết quả của một bài toán con, nó trước tiên kiểm tra xem bài toán đã được tính toán trước đó chưa. Nếu đã tính toán, thuật toán trả về kết quả đã lưu trữ. Nếu chưa tính toán, nó sẽ tính toán bài toán đó và lưu trữ kết quả để sử dụng sau này.

Ví dụ, xét ví dụ về dãy Fibonacci với định nghĩa là: $f(0) = 0, f(1) = 1, f(n) = f(n - 1) + f(n - 2)$. Nếu chúng ta sử dụng thuật toán đệ quy để tính toán số Fibonacci thứ $n$, quá trình đệ quy sẽ như sau:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230307164107.png)

Từ hình trên, ta thấy rằng nếu sử dụng thuật toán đệ quy thông thường, để tính toán $f(5)$, ta cần tính toán $f(3)$ và $f(4)$ trước, và khi tính toán $f(4)$ ta cần tính toán $f(3)$. Điều này dẫn đến việc tính toán lặp lại $f(3)$ nhiều lần, tương tự với $f(0)$, $f(1)$, $f(2)$.

Để tránh tính toán lặp lại, trong quá trình đệ quy, chúng ta có thể sử dụng một bộ nhớ đệm (mảng hoặc bảng băm) để lưu trữ kết quả của $f(k)$ đã tính toán trước đó. Như hình trên, khi gọi đệ quy đến $f(k)$, ta kiểm tra xem kết quả đã được tính toán trước đó chưa. Nếu đã tính toán, ta trực tiếp lấy giá trị từ bộ nhớ đệm và trả về, không cần tiếp tục đệ quy. Điều này giúp tránh tính toán lặp lại.

Code sử dụng phương pháp "**Đệ quy có nhớ**" để giải quyết dãy Fibonacci như sau:

```python
class Solution:
    def fib(self, n: int) -> int:
        # Sử dụng mảng để lưu trữ kết quả đã tính toán
        memo = [0 for _ in range(n + 1)]
        return self.my_fib(n, memo)

    def my_fib(self, n: int, memo: List[int]) -> int:
        if n == 0:
            return 0
        if n == 1:
            return 1
        
        # Kết quả đã tính toán trước đó
        if memo[n] != 0:
            return memo[n]
        
        # Chưa tính toán kết quả
        memo[n] = self.my_fib(n - 1, memo) + self.my_fib(n - 2, memo)
        return memo[n]
```

## 2. Sự khác biệt giữa DP Top-Down và DP Bottom-Up

「DP Top-Down」 và 「DP Bottom-Up」 đều là cách triển khai của quy hoạch động, nhưng có một số khác biệt giữa hai phương pháp này.

> **DP Top-Down**: Giải quyết vấn đề theo hướng "từ trên xuống", sử dụng phương pháp đệ quy tự nhiên trong quá trình code nhưng sử dụng thêm kĩ thuật lưu trữ (memorization) để lưu trữ kết quả của các vấn đề con (thường được lưu trữ trong một mảng hoặc bảng băm) để tránh tính toán trùng lặp.
>
> - Ưu điểm: Mã nguồn rõ ràng, dễ hiểu (vì nó y hệt viết đệ quy thuần), có thể xử lý hiệu quả một số phương trình chuyển trạng thái phức tạp. Một số phương trình chuyển trạng thái rất phức tạp, việc sử dụng DP Top-Down có thể chia nhỏ phương trình chuyển trạng thái phức tạp thành nhiều vấn đề con và giải quyết chúng thông qua gọi đệ quy. Ngoài ra DP Top-Down có thể không phải đi duyệt hết tất cả các trạng thái, nó sẽ chỉ đi tính toán các bài toán con cần thiết mà thôi!
> - Nhược điểm: Có thể gặp vấn đề tràn ngăn xếp nếu đệ quy quá sâu (vì nó là đệ quy).

> **DP Bottom-Up**: Giải quyết vấn đề theo hướng "từ dưới lên", sử dụng phương pháp lặp trong quá trình code, trong quá trình này lưu trữ kết quả của mỗi vấn đề con (thường được lưu trữ trong một mảng hoặc bảng băm) để tránh tính toán trùng lặp.
>
> - Ưu điểm: Tránh được vấn đề đệ quy quá sâu, không gặp vấn đề tràn ngăn xếp. Thứ tự tính toán rõ ràng, dễ thực hiện.
> - Nhược điểm: Không thể xử lý một số phương trình chuyển trạng thái phức tạp. Một số phương trình chuyển trạng thái rất phức tạp, nếu sử dụng phương pháp bottom-up để tính toán, việc triển khai mã nguồn sẽ trở nên rất khó khăn. Ngoài ra gần như phương pháp này sẽ phải tính toán tất cả các trạng thái, bao gồm các trạng thái không cần dùng.

Dựa trên ưu điểm và nhược điểm của DP Top-Down và DP Bottom-Up, chúng ta có thể sử dụng hai phương pháp này trong các tình huống khác nhau.

DP Top-Down phù hợp với các tình huống sau:

1. Phương trình chuyển trạng thái của vấn đề phức tạp, mối quan hệ đệ quy không rõ ràng.
2. Vấn đề phù hợp với dạng đệ quy và độ sâu đệ quy không quá sâu.

DP Bottom-Up phù hợp với các tình huống sau:

1. Phương trình chuyển trạng thái của vấn đề đơn giản, mối quan hệ đệ quy rõ ràng.
2. Vấn đề không phù hợp với dạng đệ quy, hoặc độ sâu đệ quy quá sâu có thể gây ra tràn ngăn xếp.

> [!Info]  
> - Quan trọng là bạn hiểu được quy hoạch động còn viết code theo hướng tiếp cận nào cũng sẽ giải quyết được bài toán.
> - Dựa vào các bài trên LeetCode tôi đã làm thì gần như bạn có thể viết cả 2 cách tiếp cận đối với các bài toán DP.

## 3. Các bước để giải quyết vấn đề bằng DP Top-Down

Khi sử dụng DP Top-Down để giải quyết vấn đề, chúng ta có thể tuân theo các bước sau:

1. Xác định các trạng thái của vấn đề và xác định phương trình chuyển trạng thái. Điều này đòi hỏi phải hiểu rõ vấn đề và quyết định cách biểu diễn các trạng thái và quy tắc chuyển đổi giữa chúng.
2. Tạo ra một bộ nhớ để lưu trữ kết quả của các vấn đề con. Bộ nhớ này có thể là một mảng hoặc một bảng băm, nơi chúng ta có thể lưu trữ kết quả tính toán để tránh tính toán trùng lặp.
3. Định nghĩa một hàm đệ quy để giải quyết vấn đề. Trong hàm đệ quy, chúng ta sẽ kiểm tra xem kết quả của vấn đề đã được tính toán trước đó và lưu trữ trong bộ nhớ chưa. Nếu đã có, chúng ta sẽ trả về kết quả đó. Nếu chưa, chúng ta sẽ tính toán kết quả và lưu trữ vào bộ nhớ trước khi trả về.
4. Trong hàm chính, chúng ta gọi hàm đệ quy và trả về kết quả cuối cùng.

Bằng cách tuân theo các bước này, chúng ta có thể sử dụng DP Top-Down để giải quyết các vấn đề phức tạp một cách hiệu quả và tránh tính toán trùng lặp.

### 4.1 Ứng dụng của DP Top-Down

#### 4.1.1 Tổng mục tiêu

##### 4.1.1.1 Đề bài

- [494. Target Sum](https://leetcode.com/problems/target-sum/)

##### 4.1.1.2 Tóm tắt đề bài

**Mô tả**: Cho một mảng số nguyên `nums` và một số nguyên `target`. Độ dài của mảng không vượt quá 20. Thêm dấu `+` hoặc `-` vào trước mỗi số trong mảng để tạo thành một biểu thức.

**Yêu cầu**: Trả về số lượng biểu thức khác nhau mà kết quả của biểu thức đó bằng `target`.

**Giải thích**:

- Ví dụ 1:

```python
Input: nums = [1,1,1,1,1], target = 3
Output: 5
Explanation: Có tổng cộng 5 cách để biểu diễn kết quả là 3.
-1 + 1 + 1 + 1 + 1 = 3
+1 - 1 + 1 + 1 + 1 = 3
+1 + 1 - 1 + 1 + 1 = 3
+1 + 1 + 1 - 1 + 1 = 3
+1 + 1 + 1 + 1 - 1 = 3
```

- Ví dụ 2:

```python
Input: nums = [1], target = 1
Output: 1
```

##### 4.1.1.3 Ý tưởng giải quyết

##### Ý tưởng 1: Tìm kiếm theo chiều sâu (quá thời gian)

Sử dụng tìm kiếm theo chiều sâu để thử tất cả các trường hợp `+` và `-` cho mỗi số. Các bước cụ thể như sau:

1. Định nghĩa hàm `dfs(i, cur_sum)` để tính số lượng biểu thức khác nhau từ vị trí `i` đến cuối mảng, có tổng là `cur_sum`.
2. Nếu vị trí `i` đã đến cuối mảng:
   - Nếu `cur_sum` bằng `target`, trả về 1.
   - Nếu `cur_sum` không bằng `target`, trả về 0.
3. Gọi đệ quy hàm `dfs(i + 1, cur_sum - nums[i])` để tính số lượng biểu thức từ vị trí `i + 1` đến cuối mảng, có tổng là `cur_sum - nums[i]`.
4. Gọi đệ quy hàm `dfs(i + 1, cur_sum + nums[i])` để tính số lượng biểu thức từ vị trí `i + 1` đến cuối mảng, có tổng là `cur_sum + nums[i]`.
5. Tổng số lượng biểu thức từ vị trí `i` đến cuối mảng, có tổng là `cur_sum`, là tổng của kết quả từ 3 và 4. Trả về kết quả này.
6. Kết quả cuối cùng là `dfs(0, 0)`. Trả về kết quả này.

##### Ý tưởng 1: Code

```python
class Solution:
    def findTargetSumWays(self, nums: List[int], target: int) -> int:
        size = len(nums)

        def dfs(i, cur_sum):
            if i == size:
                if cur_sum == target:
                    return 1
                else:
                    return 0
            ans = dfs(i + 1, cur_sum - nums[i]) + dfs(i + 1, cur_sum + nums[i])
            return ans
        
        return dfs(0, 0)
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(2^n)$, trong đó $n$ là độ dài của mảng `nums`.
- **Độ phức tạp không gian**: $O(n)$, độ sâu của đệ quy không vượt quá $n$.

##### Ý tưởng 2: DP Top-Down

Trong ý tưởng 1, chúng ta sử dụng tìm kiếm theo chiều sâu để thử tất cả các trường hợp, nhưng nó vượt quá thời gian cho các bộ test lớn. Vì vậy, chúng ta cần sử dụng DP Top-Down để tránh việc tìm kiếm trùng lặp.

Ở đây, chúng ta sử dụng một bảng băm `table` để lưu trữ các vị trí `i` đã được duyệt qua và số lượng biểu thức tương ứng với tổng hiện tại `cur_sum`. Các bước cụ thể như sau:

1. Định nghĩa hàm `dfs(i, cur_sum)` để tính số lượng biểu thức khác nhau từ vị trí `i` đến cuối mảng, có tổng là `cur_sum`.
2. Nếu vị trí `i` đã đến cuối mảng:
   - Nếu `cur_sum` bằng `target`, trả về 1.
   - Nếu `cur_sum` không bằng `target`, trả về 0.
3. Nếu vị trí `i` và tổng `cur_sum` đã được lưu trong bảng `table`, trả về số lượng biểu thức tương ứng.
4. Nếu vị trí `i` và tổng `cur_sum` chưa được lưu trong bảng `table`, thực hiện các bước sau:
   - Gọi đệ quy hàm `dfs(i + 1, cur_sum - nums[i])` để tính số lượng biểu thức từ vị trí `i + 1` đến cuối mảng, có tổng là `cur_sum - nums[i]`.
   - Gọi đệ quy hàm `dfs(i + 1, cur_sum + nums[i])` để tính số lượng biểu thức từ vị trí `i + 1` đến cuối mảng, có tổng là `cur_sum + nums[i]`.
   - Tổng số lượng biểu thức từ vị trí `i` đến cuối mảng, có tổng là `cur_sum`, là tổng của kết quả từ 3 và 4. Lưu kết quả này vào bảng `table`.
   - Trả về kết quả từ 3 và 4.
5. Kết quả cuối cùng là `dfs(0, 0)`. Trả về kết quả này.

##### Ý tưởng 2: Code

```python
class Solution:
    def findTargetSumWays(self, nums: List[int], target: int) -> int:
        size = len(nums)
        table = dict()

        def dfs(i, cur_sum):
            if i == size:
                if cur_sum == target:
                    return 1
                else:
                    return 0
                    
            if (i, cur_sum) in table:
                return table[(i, cur_sum)]
            
            cnt = dfs(i + 1, cur_sum - nums[i]) + dfs(i + 1, cur_sum + nums[i])
            table[(i, cur_sum)] = cnt
            return cnt

        return dfs(0, 0)
```

##### Ý tưởng 2: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(2^n)$, trong đó $n$ là độ dài của mảng `nums`.
- **Độ phức tạp không gian**: $O(n)$, độ sâu của đệ quy không vượt quá $n$.

### 4.2 Số Tribonacci thứ N

#### 4.2.1 Liên kết đề bài

- [1137. N-th Tribonacci Number](https://leetcode.com/problems/n-th-tribonacci-number/)

#### 4.2.2 Tóm tắt đề bài

**Mô tả**: Cho một số nguyên `n`.

**Yêu cầu**: Trả về số Tribonacci thứ `n`.

**Giải thích**:

- Tribonacci số: $T_0 = 0, T_1 = 1, T_2 = 1$ và với $n >= 0$, $T_{n + 3} = T_{n} + T_{n+1} + T_{n+2}$.
- $0 \le n \le 37$.
- Đáp án đảm bảo là một số nguyên 32 bit, tức là $answer \le 2^{31} - 1$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: n = 4
Output: 4
Explanation:
T_3 = 0 + 1 + 1 = 2
T_4 = 1 + 1 + 2 = 4
```

- Ví dụ 2:

```python
Input: n = 25
Output: 1389537
```

#### 4.2.3 Ý tưởng giải quyết

##### Ý tưởng 1: DP Top-Down

1. Định nghĩa trạng thái của vấn đề là số Tribonacci thứ `n`. Phương trình chuyển trạng thái là $T_0 = 0, T_1 = 1, T_2 = 1$ và với $n >= 0$, $T_{n + 3} = T_{n} + T_{n+1} + T_{n+2}$.
2. Định nghĩa một mảng `memo` có độ dài `n + 1` để lưu trữ các số Tribonacci đã tính toán.
3. Định nghĩa hàm đệ quy `my_tribonacci(n, memo)`.
   1. Khi `n = 0` hoặc `n = 1` hoặc `n = 2`, trả về kết quả tương ứng.
   2. Khi `n > 2`, kiểm tra xem đã tính toán `T(n)` chưa, tức là kiểm tra `memo[n]` có bằng `0` không.
      1. Nếu `memo[n] != 0`, tức là đã tính toán `T(n)`, trả về `memo[n]`.
      2. Nếu `memo[n] = 0`, tức là chưa tính toán `T(n)`, gọi đệ quy hàm `my_tribonacci(n - 3, memo)`、`my_tribonacci(n - 2, memo)` và `my_tribonacci(n - 1, memo)`, lưu kết quả vào `memo[n]` và trả về `memo[n]`.

##### Ý tưởng 1: Code

```python
class Solution:
    def tribonacci(self, n: int) -> int:
        # Sử dụng mảng để lưu trữ các số Tribonacci đã tính toán
        memo = [0 for _ in range(n + 1)]
        return self.my_tribonacci(n, memo)
    
    def my_tribonacci(self, n: int, memo: List[int]) -> int:
        if n == 0:
            return 0
        if n == 1 or n == 2:
            return 1
        
        if memo[n] != 0:
            return memo[n]
        memo[n] = self.my_tribonacci(n - 3, memo) + self.my_tribonacci(n - 2, memo) + self.my_tribonacci(n - 1, memo)
        return memo[n]
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$.
- **Độ phức tạp không gian**: $O(n)$.
