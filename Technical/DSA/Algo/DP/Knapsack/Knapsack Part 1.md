---
title: Knapsack Part 1
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-10-03
date modified: 2023-10-03
---

## 1. Giới thiệu về bài toán cái túi

### 1.1 Định nghĩa bài toán cái túi

> **Bài toán cái túi**: Bài toán cái túi là một dạng bài toán DP (quy hoạch động) cổ điển và đặc biệt. Bài toán cái túi có thể được mô tả như sau: Cho một tập hợp các vật phẩm, mỗi vật phẩm có trọng lượng, giá trị và số lượng riêng của nó. Đồng thời, cho một cái túi có khả năng chứa tối đa trọng lượng $W$. Bây giờ, chúng ta cần chọn một số vật phẩm để đặt vào cái túi sao cho tổng trọng lượng không vượt quá giới hạn của túi và tổng giá trị là lớn nhất có thể.

Dựa vào các ràng buộc về vật phẩm, bài toán cái túi có thể được chia thành các dạng khác nhau như: bài toán cái túi 0-1, bài toán cái túi toàn phần, bài toán cái túi nhiều lần, bài toán cái túi theo nhóm và bài toán cái túi kết hợp.

### 1.2 Phương pháp giải bài toán cái túi bằng phương pháp brute force

Phương pháp giải bài toán cái túi bằng phương pháp brute force khá đơn giản. Giả sử có $n$ vật phẩm. Chúng ta sẽ liệt kê tất cả các tổ hợp có thể của $n$ vật phẩm này. Sau đó, kiểm tra xem các vật phẩm trong các tổ hợp này có thể đặt vào cái túi và có thể đạt được tổng giá trị lớn nhất hay không. Phương pháp này có độ phức tạp thời gian là $O(2^n)$.

Độ phức tạp thời gian của phương pháp brute force trong việc giải bài toán cái túi là một hàm số mũ, chúng ta có thể sử dụng phương pháp quy hoạch động để giảm độ phức tạp thời gian.

Dưới đây chúng ta sẽ tìm hiểu cách sử dụng phương pháp quy hoạch động để giải quyết các dạng bài toán cái túi khác nhau.

## 2. Bài toán cái túi 0-1

> **Bài toán cái túi 0-1**: Cho có $n$ vật phẩm và một cái túi có khả năng chứa tối đa trọng lượng $W$. Vật phẩm thứ $i$ có trọng lượng $weight[i]$, giá trị $value[i]$, và chỉ có số lượng là 1. Hãy tìm giá trị tối đa có thể đạt được bằng cách chọn một số vật phẩm để đặt vào cái túi, sao cho tổng trọng lượng không vượt quá giới hạn của túi.

### 2.1 Ý tưởng cơ bản của bài toán cái túi 0-1

> **Đặc điểm của bài toán cái túi 0-1**: Mỗi vật phẩm chỉ có số lượng là 1 nên có thể chọn để đặt vào túi hoặc không đặt vào túi.

#### Ý tưởng 1: Quy hoạch động + ý tưởng cơ bản 2 chiều

###### 1. Phân đoạn

Phân đoạn theo số thứ tự của vật phẩm và trọng lượng tối đa của túi.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[i][w]$ là: Tổng giá trị tối đa có thể đạt được bằng cách đặt $i$ vật phẩm đầu tiên vào một túi có trọng lượng tối đa là $w$.

Trạng thái $dp[i][w]$ là một mảng hai chiều, trong đó chiều thứ nhất đại diện cho "vật phẩm đang xét", chiều thứ hai đại diện cho "trọng lượng tối đa của túi", và giá trị của mảng hai chiều đại diện cho "giá trị tối đa có thể đạt được".

###### 3. Công thức chuyển trạng thái

Đối với vấn đề "đặt $i$ vật phẩm đầu tiên vào một túi có trọng lượng tối đa là $w$ và có thể đạt được giá trị tối đa", nếu chúng ta chỉ xem xét chiến lược đặt vật phẩm thứ $i-1$ (vật phẩm cuối cùng trong $i$ vật phẩm), vấn đề này có thể được chuyển đổi thành một vấn đề liên quan chỉ đến $i-1$ vật phẩm trước đó.

1. **Không đặt vật phẩm thứ $i-1$ vào túi**: Vấn đề chuyển đổi thành "đặt $i-1$ vật phẩm đầu tiên vào một túi có trọng lượng tối đa là $w$", giá trị tối đa có thể đạt được là $dp[i-1][w]$.
2. **Đặt vật phẩm thứ $i-1$ vào túi**: Vấn đề chuyển đổi thành "đặt $i-1$ vật phẩm đầu tiên vào một túi có trọng lượng tối đa là $w-weight[i-1]$", giá trị tối đa có thể đạt được là $dp[i-1][w-weight[i-1]]$, cộng thêm "giá trị của vật phẩm thứ $i-1$" là $value[i-1]$, giá trị tối đa có thể đạt được là $dp[i-1][w-weight[i-1]]+value[i-1]$.

Tiếp theo, chúng ta cần xem xét điều kiện nào vật phẩm thứ $i-1$ phải thỏa mãn để xem xét xem có đặt vào túi hay không.

1. Nếu trọng lượng tối đa hiện tại của túi không đủ (tức là $w < weight[i-1]$): Vật phẩm thứ $i-1$ không thể đặt vào túi, giá trị của túi $dp[i][w]$ vẫn giữ nguyên giá trị của $dp[i-1][w]$, tức là $dp[i][w] = dp[i-1][w]$.
2. Nếu trọng lượng tối đa hiện tại của túi đủ (tức là $w \ge weight[i-1]$): Vật phẩm thứ $i-1$ có thể xem xét để đặt vào túi hoặc không đặt vào túi, giá trị của túi lấy giá trị lớn nhất của hai trường hợp, tức là $dp[i][w] = \max \lbrace dp[i-1][w], dp[i-1][w-weight[i-1]]+value[i-1] \rbrace$.

Do đó, công thức chuyển trạng thái là:

$dp[i][w] = \begin{cases} dp[i-1][w] & w < weight[i-1] \cr \max \lbrace dp[i-1][w], \quad dp[i-1][w-weight[i-1]]+value[i-1] \rbrace & w \ge weight[i-1] \end{cases}$

###### 4. Điều kiện ban đầu

- Nếu trọng lượng tối đa của túi là $0$, bất kể chọn vật phẩm nào, giá trị tối đa có thể đạt được là $0$, tức là $dp[i][0] = 0, 0 \le i \le size$.
- Bất kể trọng lượng tối đa của túi là bao nhiêu, giá trị tối đa có thể đạt được bằng cách chọn $0$ vật phẩm là $0$, tức là $dp[0][w] = 0, 0 \le w \le W$.

###### 5. Kết quả cuối cùng

Dựa trên trạng thái đã được định nghĩa trước đó, $dp[i][w]$ đại diện cho "tổng giá trị tối đa có thể đạt được bằng cách đặt $i$ vật phẩm đầu tiên vào một túi có trọng lượng tối đa là $w$". Kết quả cuối cùng là $dp[size][W]$, trong đó $size$ là số lượng vật phẩm và $W$ là trọng lượng tối đa của túi.

#### Ý tưởng 1: Code

```python
class Solution:
    # Ý tưởng 1: Quy hoạch động + ý tưởng cơ bản 2 chiều
    def zeroOnePackMethod1(self, weight: [int], value: [int], W: int):
        size = len(weight)
        dp = [[0 for _ in range(W + 1)] for _ in range(size + 1)]
        
        # Liệt kê qua i loại vật phẩm
        for i in range(1, size + 1):
            # Liệt kê qua trọng lượng của túi
            for w in range(W + 1):
                # Vật phẩm thứ i-1 không thể đặt vào túi
                if w < weight[i - 1]:
                    # dp[i][w] lấy giá trị "tổng giá trị tối đa có thể đạt được bằng cách đặt i-1 vật phẩm vào túi có trọng lượng tối đa là w"
                    dp[i][w] = dp[i - 1][w]
                else:
                    # dp[i][w] lấy giá trị lớn nhất của "tổng giá trị tối đa có thể đạt được bằng cách đặt i-1 vật phẩm vào túi có trọng lượng tối đa là w" và "tổng giá trị tối đa có thể đạt được bằng cách đặt i-1 vật phẩm vào túi có trọng lượng tối đa là w-weight[i-1] và đặt vật phẩm thứ i-1 vào túi"
                    dp[i][w] = max(dp[i - 1][w], dp[i - 1][w - weight[i - 1]] + value[i - 1])
                    
        return dp[size][W]
```

#### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times W)$, trong đó $n$ là số lượng vật phẩm và $W$ là trọng lượng tối đa của túi.
- **Độ phức tạp không gian**: $O(n \times W)$.

### 2.2 Tối ưu bằng cách sử dụng mảng trượt cho bài toán cái túi 0-1

Dựa trên quá trình giải quyết trước đó, ta có thể thấy rằng: khi chúng ta xử lý lần lượt từng vật phẩm từ $1$ đến $n$, "kết quả xử lý cho $i$ vật phẩm" chỉ phụ thuộc vào "kết quả xử lý cho $i-1$ vật phẩm", và không phụ thuộc vào các kết quả xử lý trước đó.

Điều này có nghĩa là trong quá trình chuyển trạng thái, chúng ta chỉ cần lưu trữ trạng thái của giai đoạn trước đó và trạng thái hiện tại của giai đoạn hiện tại, điều này có thể được thực hiện bằng cách sử dụng hai mảng một chiều để lưu trữ tất cả các trạng thái của hai giai đoạn liên tiếp. Điều này được gọi là "tối ưu hóa bằng cách sử dụng mảng trượt" (rolling array).

#### Ý tưởng 2: Quy hoạch động + Tối ưu hóa bằng cách sử dụng mảng trượt

###### 1. Phân đoạn

Phân đoạn theo trọng lượng tối đa của túi.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[w]$ là: Tổng giá trị tối đa có thể đạt được bằng cách đặt các vật phẩm vào một túi có trọng lượng tối đa là $w$.

###### 3. Công thức chuyển trạng thái

$dp[w] = \begin{cases} dp[w] & w < weight[i-1] \cr \max \lbrace dp[w], dp[w-weight[i-1]]+value[i-1] \rbrace & w \ge weight[i-1] \end{cases}$

Trong quá trình tính toán lần thứ $i$ trước đó, $dp[w]$ lưu trữ "tất cả các trạng thái của giai đoạn thứ $i-1$". Sau khi tính toán lần thứ $i$, $dp[w]$ lưu trữ "tất cả các trạng thái của giai đoạn thứ $i$".

Để đảm bảo rằng trong quá trình tính toán lần thứ $i$, $dp[w]$ được tính toán từ $dp[w]$ và $dp[w-weight[i-1]]$, chúng ta cần lặp lại việc tính toán $dp[w]$ theo thứ tự ngược từ $W$ đến $weight[i-1]$.

###### 4. Điều kiện ban đầu

- Với bất kỳ trọng lượng tối đa của túi nào, nếu không chọn bất kỳ vật phẩm nào, giá trị tối đa có thể đạt được là $0$, tức là $dp[w] = 0, 0 \le w \le W$.

###### 5. Kết quả cuối cùng

Dựa trên trạng thái đã được định nghĩa trước đó, $dp[w]$ đại diện cho "tổng giá trị tối đa có thể đạt được bằng cách đặt các vật phẩm vào một túi có trọng lượng tối đa là $w$". Kết quả cuối cùng là $dp[W]$, trong đó $W$ là trọng lượng tối đa của túi.

#### Ý tưởng 2: Code

```python
class Solution:
    # Ý tưởng 2: Quy hoạch động + Tối ưu hóa bằng cách sử dụng mảng trượt
    def zeroOnePackMethod2(self, weight: [int], value: [int], W: int):
        size = len(weight)
        dp = [0 for _ in range(W + 1)]
        
        # Liệt kê qua i loại vật phẩm
        for i in range(1, size + 1):
            # Lặp ngược từ W đến weight[i-1]
            for w in range(W, weight[i - 1] - 1, -1):
                # dp[w] lấy giá trị lớn nhất của "tổng giá trị tối đa có thể đạt được bằng cách đặt i-1 vật phẩm vào túi có trọng lượng tối đa là w" và "tổng giá trị tối đa có thể đạt được bằng cách đặt i-1 vật phẩm vào túi có trọng lượng tối đa là w-weight[i-1] và đặt vật phẩm thứ i-1 vào túi"
                dp[w] = max(dp[w], dp[w - weight[i - 1]] + value[i - 1])
                
        return dp[W]
```

#### Ý tưởng 2: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times W)$, trong đó $n$ là số lượng vật phẩm và $W$ là trọng lượng tối đa của túi.
- **Độ phức tạp không gian**: $O(W)$.

### 2.3 Ứng dụng của bài toán cái túi 0-1

#### 2.3.1 Liên kết đề bài

- [416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/)

#### 2.3.2 Tóm tắt đề bài

**Mô tả**: Cho một mảng chứa các số nguyên dương.

**Yêu cầu**: Kiểm tra xem có thể chia mảng này thành hai tập con sao cho tổng các phần tử trong hai tập con đều bằng nhau.

**Giải thích**:

- $1 \le \text{nums.length} \le 200$.
- $1 \le \text{nums[i]} \le 100$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums = [1,5,11,5]
Output: true
Explanation: Mảng có thể chia thành [1, 5, 5] và [11].
```

- Ví dụ 2:

```python
Input: nums = [1,2,3,5]
Output: false
Explanation: Mảng không thể chia thành hai tập con có tổng bằng nhau.
```

#### 2.3.3 Ý tưởng giải quyết

##### Ý tưởng 1: Quy hoạch động

Vấn đề này có thể chuyển thành "bài toán cái túi 0-1".

1. Gọi tổng các phần tử trong mảng là $sum$, và gọi nửa tổng là $target = \frac{sum}{2}$, coi nó như là trọng lượng tối đa của cái túi trong "bài toán cái túi 0-1".
2. Coi các phần tử trong mảng là các vật phẩm trong "bài toán cái túi 0-1".
3. Trọng lượng của vật phẩm thứ $i$ là $nums[i]$, và giá trị của nó cũng là $nums[i]$.
4. Vì trọng lượng và giá trị của vật phẩm bằng nhau, nếu có thể đầy đủ cái túi có trọng lượng tối đa là $target$, thì giá trị lớn nhất cũng sẽ là $target$.

Vấn đề này sẽ trở thành: Cho một mảng $nums$ đại diện cho các vật phẩm, và trọng lượng tối đa của cái túi là $target = \frac{sum}{2}$. Trọng lượng của vật phẩm thứ $i$ là $nums[i]$, và giá trị của nó cũng là $nums[i]$, mỗi vật phẩm chỉ có một cái. Hỏi trong trường hợp tổng trọng lượng không vượt quá trọng lượng tối đa của cái túi, có thể đầy đủ cái túi để đạt được giá trị lớn nhất không?

###### 1. Phân đoạn

Phân đoạn theo trọng lượng tối đa của cái túi hiện tại.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[w]$ là: Chọn một số phần tử từ mảng $nums$, đặt vào cái túi có trọng lượng tối đa là $w$, để đạt được tổng trọng lượng lớn nhất là bao nhiêu.

###### 3. Công thức chuyển tiếp

$dp[w] = \begin{cases} dp[w] & w < nums[i - 1] \cr \max \lbrace dp[w], \quad dp[w - nums[i - 1]] + nums[i - 1] \rbrace & w \ge nums[i - 1] \end{cases}$

###### 4. Điều kiện ban đầu

- Bất kể trọng lượng tối đa của cái túi là bao nhiêu, nếu không chọn bất kỳ vật phẩm nào, giá trị lớn nhất có thể đạt được sẽ luôn là $0$, tức là $dp[w] = 0, 0 \le w \le W$.

###### 5. Kết quả cuối cùng

Dựa vào trạng thái đã định nghĩa trước đó, $dp[target]$ đại diện cho việc chọn một số phần tử từ mảng $nums$, đặt vào cái túi có trọng lượng tối đa là $target = \frac{sum}{2}$, để đạt được tổng trọng lượng lớn nhất.

Vì vậy, cuối cùng chỉ cần kiểm tra xem $dp[target]$ có bằng $target$ không. Nếu $dp[target] == target$, tức là tập con của tập hợp có thể chính xác đạt được tổng $target$, trong trường hợp này trả về `True`；ngược lại trả về `False`.

##### Ý tưởng 1: Code

```python
class Solution:
    # Ý tưởng 2: Quy hoạch động + tối ưu mảng trượt
    def zeroOnePackMethod2(self, weight: [int], value: [int], W: int):
        size = len(weight)
        dp = [0 for _ in range(W + 1)]
        
        # Duyệt qua từng vật phẩm
        for i in range(1, size + 1):
            # Duyệt ngược từ trọng lượng tối đa của cái túi (tránh lỗi trạng thái)
            for w in range(W, weight[i - 1] - 1, -1):
                # dp[w] lấy giá trị lớn nhất giữa "giá trị lớn nhất của việc đặt i - 1 vật phẩm vào cái túi có trọng lượng w" và "giá trị lớn nhất của việc đặt i - 1 vật phẩm vào cái túi có trọng lượng w - weight[i - 1], sau đó đặt vật phẩm thứ i - 1 vào"
                dp[w] = max(dp[w], dp[w - weight[i - 1]] + value[i - 1])
                
        return dp[W]

    def canPartition(self, nums: List[int]) -> bool:
        sum_nums = sum(nums)
        if sum_nums & 1:
            return False

        target = sum_nums // 2
        return self.zeroOnePackMethod2(nums, nums, target) == target
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times target)$, trong đó $n$ là số lượng phần tử trong mảng $nums$, $target$ là nửa tổng của toàn bộ phần tử trong mảng.
- **Độ phức tạp không gian**: $O(target)$.

