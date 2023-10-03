---
title: Knapsack Part 3
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-10-03
date modified: 2023-10-03
---

## 4. Bài toán cái túi với số lượng hữu hạn

> **Bài toán cái túi với số lượng hữu hạn**: Có $n$ loại hàng hóa và một cái túi có khối lượng tối đa là $W$, hàng hóa loại thứ $i$ có khối lượng là $weight[i]$, giá trị là $value[i]$, và số lượng là $count[i]$ . Hỏi trong trường hợp tổng khối lượng không vượt quá giới hạn của cái túi, giá trị lớn nhất có thể đạt được là bao nhiêu?

### 4.1 Ý tưởng cơ bản của Bài toán cái túi với số lượng hữu hạn

Chúng ta có thể tham khảo cách định nghĩa trạng thái và ý tưởng cơ bản của vấn đề "Bài toán cái túi 0-1" để giải quyết vấn đề này. Đối với một cái túi có khối lượng $w$, tối đa có thể chứa $min \lbrace count[i - 1], \frac{w}{weight[i - 1]} \rbrace$ hàng hóa loại thứ $i - 1$. Vì vậy, chúng ta có thể thêm một vòng lặp để duyệt qua số lượng hàng hóa loại $i - 1$ có thể chọn (từ $0$ đến $min \lbrace count[i - 1], \frac{w}{weight[i - 1]} \rbrace$), từ đó chuyển đổi vấn đề "Bài toán cái túi với số lượng hữu hạn" thành "Bài toán cái túi 0-1".

#### Ý tưởng 1: Quy hoạch động + ý tưởng cơ bản 2 chiều

###### 1. Phân đoạn

Phân đoạn theo số thứ tự của loại hàng hóa và giới hạn khối lượng của cái túi hiện tại.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[i][w]$ như sau: $dp[i][w]$ đại diện cho giá trị lớn nhất có thể đạt được bằng cách đặt $i$ loại hàng hóa vào cái túi có khối lượng tối đa là $w$.

Trạng thái $dp[i][w]$ là một mảng hai chiều, trong đó chiều thứ nhất đại diện cho "loại hàng hóa hiện đang xem xét", chiều thứ hai đại diện cho "giới hạn khối lượng của cái túi hiện tại", giá trị của mảng hai chiều đại diện cho "giá trị lớn nhất có thể đạt được".

###### 3. Công thức chuyển đổi trạng thái

$dp[i][w] = max \lbrace dp[i - 1][w - k \times weight[i - 1]] + k \times value[i - 1] \rbrace, \quad 0 \le k \le min \lbrace count[i - 1], \frac{w}{weight[i - 1]} \rbrace$.

###### 4. Điều kiện ban đầu

- Nếu giới hạn khối lượng của cái túi là $0$, thì bất kể chọn hàng hóa nào, giá trị lớn nhất có thể đạt được sẽ luôn là $0$, tức là $dp[i][0] = 0, 0 \le i \le size$.
- Bất kể giới hạn khối lượng của cái túi là bao nhiêu, giá trị lớn nhất có thể đạt được bằng cách đặt $0$ loại hàng hóa vào cái túi sẽ luôn là $0$, tức là $dp[0][w] = 0, 0 \le w \le W$.

###### 5. Kết quả cuối cùng

Dựa trên trạng thái chúng ta đã định nghĩa trước đó, $dp[i][w]$ đại diện cho giá trị lớn nhất có thể đạt được bằng cách đặt $i$ loại hàng hóa vào cái túi có khối lượng tối đa là $w$. Vì vậy, kết quả cuối cùng là $dp[size][W]$, trong đó $size$ là số lượng loại hàng hóa, $W$ là giới hạn khối lượng của cái túi.

#### Ý tưởng 1: Code

```python
class Solution:
    # Ý tưởng 1: Quy hoạch động + ý tưởng cơ bản 2 chiều
    def multiplePackMethod1(self, weight: [int], value: [int], count: [int], W: int):
        size = len(weight)
        dp = [[0 for _ in range(W + 1)] for _ in range(size + 1)]
        
        # Duyệt qua các loại hàng hóa
        for i in range(1, size + 1):
            # Duyệt qua giới hạn khối lượng của cái túi
            for w in range(W + 1):
                # Duyệt qua số lượng hàng hóa loại i - 1 có thể chọn
                for k in range(min(count[i - 1], w // weight[i - 1]) + 1):
                    # dp[i][w] lấy giá trị lớn nhất từ tất cả dp[i - 1][w - k * weight[i - 1] + k * value[i - 1]
                    dp[i][w] = max(dp[i][w], dp[i - 1][w - k * weight[i - 1]] + k * value[i - 1])
                    
        return dp[size][W]
```

#### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times W \times C)$, trong đó $n$ là số lượng loại hàng hóa, $W$ là giới hạn khối lượng của cái túi, $C$ là độ dài của mảng số lượng hàng hóa. Vì $n \times C = \sum count[i]$, nên độ phức tạp thời gian cũng có thể viết là $O(W \times \sum count[i])$.
- **Độ phức tạp không gian**: $O(n \times W)$.

### 4.2 Tối ưu bằng cách sử dụng mảng trượt cho Bài toán cái túi với số lượng hữu hạn

Trong vấn đề "Bài toán cái túi với số lượng vô hạn", chúng ta đã thành công trong việc loại bỏ sự phụ thuộc vào số lượng hàng hóa $k$ bằng cách tối ưu "Công thức chuyển đổi trạng thái", từ đó giảm chiều của độ phức tạp thời gian.

Trong vấn đề "Bài toán cái túi với số lượng hữu hạn", khi chúng ta đang tính toán $dp[i][w]$, chúng ta không thể biết được đã sử dụng bao nhiêu mục hàng hóa loại $i - 1$ và liệu hàng hóa loại $i - 1$ còn số lượng còn lại để chọn hay không. Điều này dẫn đến việc chúng ta không thể tối ưu "Công thức chuyển đổi trạng thái" để giảm độ phức tạp thời gian của vấn đề "Bài toán cái túi với số lượng hữu hạn".

Tuy nhiên, chúng ta có thể tham khảo cách tối ưu "Bài toán cái túi với số lượng vô hạn" + "Mảng trượt" để giảm chiều của độ phức tạp không gian của thuật toán.

#### Ý tưởng 2: Quy hoạch động + Tối ưu bằng mảng trượt

###### 1. Phân đoạn

Phân đoạn theo giới hạn khối lượng của cái túi hiện tại.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[w]$ như sau: $dp[w]$ đại diện cho giá trị lớn nhất có thể đạt được bằng cách đặt hàng hóa vào cái túi có khối lượng tối đa là $w$.

###### 3. Công thức chuyển đổi trạng thái

$dp[w] = max \lbrace dp[w - k \times weight[i - 1]] + k \times value[i - 1] \rbrace, \quad 0 \le k \le min \lbrace count[i - 1], \frac{w}{weight[i - 1]} \rbrace$

###### 4. Điều kiện ban đầu

- Bất kể giới hạn khối lượng của cái túi là bao nhiêu, nếu không chọn hàng hóa nào, giá trị lớn nhất có thể đạt được sẽ luôn là $0$, tức là $dp[w] = 0, 0 \le w \le W$.

###### 5. Kết quả cuối cùng

Dựa trên trạng thái chúng ta đã định nghĩa trước đó, $dp[w]$ đại diện cho giá trị lớn nhất có thể đạt được bằng cách đặt hàng hóa vào cái túi có khối lượng tối đa là $w$. Vì vậy, kết quả cuối cùng là $dp[W]$, trong đó $W$ là giới hạn khối lượng của cái túi.

#### Ý tưởng 2: Code

```python
class Solution:
    # Ý tưởng 2: Quy hoạch động + Tối ưu bằng mảng trượt
    def multiplePackMethod2(self, weight: [int], value: [int], count: [int], W: int):
        size = len(weight)
        dp = [0 for _ in range(W + 1)]
        
        # Duyệt qua giới hạn khối lượng của cái túi
        for w in range(1, W + 1):
            # Duyệt qua các loại hàng hóa
            for i in range(1, size + 1):
                # Duyệt qua số lượng hàng hóa loại i - 1 có thể chọn
                for k in range(min(count[i - 1], w // weight[i - 1]) + 1):
                    # dp[w] lấy giá trị lớn nhất từ tất cả dp[w - k * weight[i - 1]] + k * value[i - 1]
                    dp[w] = max(dp[w], dp[w - k * weight[i - 1]] + k * value[i - 1])
                    
        return dp[W]
```

#### Ý tưởng 2: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times W \times C)$, trong đó $n$ là số lượng loại hàng hóa, $W$ là giới hạn khối lượng của cái túi, $C$ là độ dài của mảng số lượng hàng hóa. Vì $n \times C = \sum count[i]$, nên độ phức tạp thời gian cũng có thể viết là $O(W \times \sum count[i])$.
- **Độ phức tạp không gian**: $O(W)$.

### 4.3 Tối ưu bằng cách sử dụng phân tích nhị phân cho Bài toán cái túi với số lượng hữu hạn

Trong "Ý tưởng 2", chúng ta đã tối ưu không gian bằng cách sử dụng mảng trượt. Tuy nhiên, chúng ta vẫn không thể tối ưu thời gian của thuật toán.

Tuy nhiên, chúng ta có thể tối ưu thời gian bằng cách sử dụng phân tích nhị phân cho số lượng hàng hóa. Phương pháp này được gọi là "tối ưu nhị phân".

> **Tối ưu nhị phân**: Đơn giản là chia số lượng hàng hóa $count[i]$ thành "các loại hàng hóa lớn được tạo thành từ $2^0, 2^1, 2^2, …, 2^m$ hàng hóa đơn lẻ" và "số lượng hàng hóa còn lại không đủ $2$ mũ nguyên của số lượng hàng hóa, được tạo thành từ $count[i] - 2^{\lfloor \log_2(count[i] + 1) \rfloor - 1}$ hàng hóa đơn lẻ".

Ví dụ, nếu số lượng hàng hóa thứ $i$ là $31$, sử dụng phương pháp "tối ưu nhị phân", chúng ta có thể chia thành $31 = 1 + 2 + 4 + 8 + 16$ tổng cộng $5$ hàng hóa. Điều này có nghĩa là chúng ta đã chia thành $5$ hàng hóa lớn:

1. Hàng hóa lớn thứ $1$ gồm $1$ hàng hóa loại $i$.
2. Hàng hóa lớn thứ $2$ gồm $2$ hàng hóa loại $i$.
3. Hàng hóa lớn thứ $3$ gồm $4$ hàng hóa loại $i$.
4. Hàng hóa lớn thứ $4$ gồm $8$ hàng hóa loại $i$.
5. Hàng hóa lớn thứ $5$ gồm $16$ hàng hóa loại $i$.

Với $5$ hàng hóa lớn này, chúng ta có thể tạo ra bất kỳ số lượng hàng hóa từ $0$ đến $31$.

Bằng cách này, thay vì phải lặp lại $32$ lần (từ $0$ đến $31$) để xem xét số lượng hàng hóa thứ $i$, chúng ta chỉ cần lặp lại $5$ lần.

Dưới đây là một số ví dụ khác:

1. Nếu số lượng hàng hóa thứ $i$ là $6$, chúng ta có thể chia thành $6 = 1 + 2 + 3$ tổng cộng $3$ hàng hóa.
2. Nếu số lượng hàng hóa thứ $i$ là $8$, chúng ta có thể chia thành $8 = 1 + 2 + 4 + 1$ tổng cộng $4$ hàng hóa.
3. Nếu số lượng hàng hóa thứ $i$ là $18$, chúng ta có thể chia thành $18 = 1 + 2 + 4 + 8 + 3$ tổng cộng $5$ hàng hóa.

Sau khi tối ưu nhị phân, độ phức tạp thời gian của thuật toán giảm từ $O(W \times \sum count[i])$ xuống còn $O(W \times \sum \log_2{count[i]})$.

#### Ý tưởng 3: Quy hoạch động + Tối ưu nhị phân

###### 1. Phân đoạn

Phân đoạn theo giới hạn khối lượng của cái túi hiện tại.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[w]$ như sau: $dp[w]$ đại diện cho giá trị lớn nhất có thể đạt được bằng cách đặt hàng hóa vào cái túi có khối lượng tối đa là $w$.

###### 3. Công thức chuyển đổi trạng thái

$dp[w] = max \lbrace dp[w - weight \underline{ } new[i - 1]] + value \underline{ } new[i - 1] \rbrace$

###### 4. Điều kiện ban đầu

- Bất kể giới hạn khối lượng của cái túi là bao nhiêu, nếu không chọn hàng hóa nào, giá trị lớn nhất có thể đạt được sẽ luôn là $0$, tức là $dp[w] = 0, 0 \le w \le W$.

###### 5. Kết quả cuối cùng

Dựa trên trạng thái chúng ta đã định nghĩa trước đó, $dp[w]$ đại diện cho giá trị lớn nhất có thể đạt được bằng cách đặt hàng hóa vào cái túi có khối lượng tối đa là $w$. Vì vậy, kết quả cuối cùng là $dp[W]$, trong đó $W$ là giới hạn khối lượng của cái túi.

#### Ý tưởng 3: Mã

```python
class Solution:
    # Ý tưởng 3: Quy hoạch động + Tối ưu nhị phân
    def multiplePackMethod3(self, weight: [int], value: [int], count: [int], W: int):
        weight_new, value_new = [], []
        
        # Tối ưu nhị phân
        for i in range(len(weight)):
            cnt = count[i]
            k = 1
            while k <= cnt:
                cnt -= k
                weight_new.append(weight[i] * k)
                value_new.append(value[i] * k)
                k *= 2
            if cnt > 0:
                weight_new.append(weight[i] * cnt)
                value_new.append(value[i] * cnt)
        
        dp = [0 for _ in range(W + 1)]
        size = len(weight_new)
        
        # Duyệt qua giới hạn khối lượng của cái túi
        for w in range(1, W + 1):
            # Duyệt qua các loại hàng hóa
            for i in range(1, size + 1):
                # Nếu khối lượng hàng hóa lớn hơn giới hạn khối lượng của cái túi, bỏ qua
                if weight_new[i - 1] > w:
                    continue
                # dp[w] lấy giá trị lớn nhất từ tất cả dp[w - weight_new[i - 1]] + value_new[i - 1]
                dp[w] = max(dp[w], dp[w - weight_new[i - 1]] + value_new[i - 1])
                    
        return dp[W]
```

#### Ý tưởng 3: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(W \times \sum \log_2{count[i]})$, trong đó $W$ là giới hạn khối lượng của cái túi, $count[i]$ là số lượng hàng hóa thứ $i$.
- **Độ phức tạp không gian**: $O(W)$.
