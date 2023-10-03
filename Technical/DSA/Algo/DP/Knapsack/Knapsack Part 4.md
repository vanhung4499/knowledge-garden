---
title: Knapsack Part 4
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-10-03
date modified: 2023-10-03
---

## 5. Bài toán cái túi hỗn hợp

> **Bài toán cái túi hỗn hợp**: Có $n$ loại hàng hóa và một cái túi có khối lượng tối đa là $W$, hàng hóa loại thứ $i$ có khối lượng là $weight[i]$, giá trị là $value[i]$, và số lượng là $count[i]$. Trong đó:
>
> 1. Khi $count[i] = -1$, đại diện cho chỉ có $1$ mục hàng.
> 2. Khi $count[i] = 0$, đại diện cho có số lượng hàng hóa vô hạn.
> 3. Khi $count[i] > 0$, đại diện cho có $count[i]$ mục hàng.
>
> Hỏi trong trường hợp tổng khối lượng không vượt quá giới hạn của cái túi, giá trị lớn nhất có thể đạt được là bao nhiêu?

#### Ý tưởng 1: Quy hoạch động

Bài toán cái túi hỗn hợp thực chất là sự kết hợp của ba Bài toán cái túi "0-1", "hoàn chỉnh" và "số lượng hữu hạn". Một số hàng hóa chỉ có thể chọn một mục, một số hàng hóa có thể chọn số lượng không giới hạn, và một số hàng hóa có số lượng cụ thể.

Thực tế, nếu bạn đã hiểu cách giải quyết ba Bài toán cái túi trước đó, chỉ cần kết hợp chúng lại là được.

Hơn nữa, trong Bài toán "số lượng hữu hạn", chúng ta đã sử dụng kỹ thuật "tối ưu nhị phân" để chuyển đổi Bài toán "số lượng hữu hạn" thành Bài toán "0-1". Vì vậy, khi giải quyết Bài toán "cái túi hỗn hợp", chúng ta cũng có thể chuyển đổi Bài toán "số lượng hữu hạn" thành Bài toán "0-1", sau đó chỉ cần phân biệt xem đó là Bài toán "0-1" hay "hoàn chỉnh".

#### Ý tưởng 1: Code

```python
class Solution:
    def mixedPackMethod1(self, weight: [int], value: [int], count: [int], W: int):
        weight_new, value_new, count_new = [], [], []
        
        # Tối ưu nhị phân
        for i in range(len(weight)):
            cnt = count[i]
            # Chuyển đổi Bài toán số lượng hữu hạn thành Bài toán 0-1
            if cnt > 0:
                k = 1
                while k <= cnt:
                    cnt -= k
                    weight_new.append(weight[i] * k)
                    value_new.append(value[i] * k)
                    count_new.append(1)
                    k *= 2
                if cnt > 0:
                    weight_new.append(weight[i] * cnt)
                    value_new.append(value[i] * cnt)
                    count_new.append(1)
            # Bài toán 0-1, thêm trực tiếp
            elif cnt == -1:
                weight_new.append(weight[i])
                value_new.append(value[i])
                count_new.append(1)
            # Bài toán hoàn chỉnh, đánh dấu và thêm
            else:
                weight_new.append(weight[i])
                value_new.append(value[i])
                count_new.append(0)
                
        dp = [0 for _ in range(W + 1)]
        size = len(weight_new)
    
        # Duyệt qua các loại hàng hóa
        for i in range(1, size + 1):
            # Bài toán 0-1
            if count_new[i - 1] == 1:
                # Duyệt qua giới hạn khối lượng của cái túi theo thứ tự ngược (tránh giá trị trạng thái không chính xác)
                for w in range(W, weight_new[i - 1] - 1, -1):
                    # dp[w] lấy giá trị lớn nhất từ tất cả dp[w - weight_new[i - 1]] + value_new[i - 1]
                    dp[w] = max(dp[w], dp[w - weight_new[i - 1]] + value_new[i - 1])
            # Bài toán hoàn chỉnh
            else:
                # Duyệt qua giới hạn khối lượng của cái túi
                for w in range(weight_new[i - 1], W + 1):
                    # dp[w] lấy giá trị lớn nhất từ tất cả dp[w - weight_new[i - 1]] + value_new[i - 1]
                    dp[w] = max(dp[w], dp[w - weight_new[i - 1]] + value_new[i - 1])
                    
        return dp[W]
```

#### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(W \times \sum \log_2{count[i]})$, trong đó $W$ là giới hạn khối lượng của cái túi, $count[i]$ là số lượng hàng hóa thứ $i$.
- **Độ phức tạp không gian**: $O(W)$.

## 6. Bài toán cái túi theo nhóm

> **Bài toán cái túi theo nhóm**: Có $n$ nhóm hàng hóa và một chiếc túi có khối lượng tối đa là $W$. Nhóm hàng hóa thứ $i$ có $group\underline{}count[i]$ mặt hàng, mặt hàng thứ $j$ trong nhóm thứ $i$ có khối lượng là $weight[i][j]$ và giá trị là $value[i][j]$. Chỉ có thể chọn tối đa $1$ mặt hàng từ mỗi nhóm để đặt vào túi. Hỏi trong trường hợp tổng khối lượng không vượt quá giới hạn của túi, giá trị lớn nhất có thể đạt được là bao nhiêu?

### 6.1 Ý tưởng cơ bản của bài toán cái túi theo nhóm

#### Ý tưởng 1: Quy hoạch động + ý tưởng hai chiều

###### 1. Phân đoạn

Phân đoạn theo số thứ tự của loại hàng hóa và giới hạn khối lượng của túi hiện tại.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[i][w]$ là: đặt $i$ nhóm hàng hóa vào một chiếc túi có khối lượng tối đa là $w$, giá trị lớn nhất có thể đạt được.

Trạng thái $dp[i][w]$ là một mảng hai chiều, trong đó chiều thứ nhất đại diện cho "số nhóm hàng hóa hiện tại đang xem xét", chiều thứ hai đại diện cho "giới hạn khối lượng của túi hiện tại", giá trị của mảng hai chiều đại diện cho "giá trị lớn nhất có thể đạt được".

###### 3. Công thức chuyển trạng thái

Vì chúng ta có thể không chọn bất kỳ mặt hàng nào từ nhóm hàng hóa thứ $i - 1$, hoặc có thể chọn bất kỳ mặt hàng từ mặt hàng thứ $0 \sim group\underline{}count[i - 1] - 1$ trong nhóm hàng hóa thứ $i - 1$, nên trạng thái $dp[i][w]$ có thể chọn giá trị lớn nhất từ các lựa chọn sau:

1. Không chọn bất kỳ mặt hàng nào từ nhóm hàng hóa thứ $i - 1$: giá trị lớn nhất có thể đạt được là $dp[i - 1][w]$.
2. Chọn mặt hàng thứ $0$ từ nhóm hàng hóa thứ $i - 1$: giá trị lớn nhất có thể đạt được là $dp[i - 1][w - weight[i - 1][0]] + value[i - 1][0]$.
3. Chọn mặt hàng thứ $1$ từ nhóm hàng hóa thứ $i - 1$: giá trị lớn nhất có thể đạt được là $dp[i - 1][w - weight[i - 1][1]] + value[i - 1][1]$.
4. ……
5. Chọn mặt hàng cuối cùng từ nhóm hàng hóa thứ $i - 1$: giả sử $k =  group\underline{}count[i - 1] - 1$, thì giá trị lớn nhất có thể đạt được là $dp[i - 1][w - weight[i - 1][k]] + value[i - 1][k]$.

Do đó, công thức chuyển trạng thái là:

$dp[i][w] = max \lbrace dp[i - 1][w], dp[i - 1][w - weight[i - 1][k]] + value[i - 1][k] \rbrace , \quad 0 \le k \le group\underline{}count[i - 1]$

###### 4. Điều kiện ban đầu

- Nếu giới hạn khối lượng của túi là $0$, thì bất kể chọn mặt hàng nào, giá trị lớn nhất có thể đạt được là $0$, tức là $dp[i][0] = 0, 0 \le i \le size$.
- Bất kể giới hạn khối lượng của túi là bao nhiêu, giá trị lớn nhất có thể đạt được từ $0$ nhóm hàng hóa là $0$, tức là $dp[0][w] = 0, 0 \le w \le W$.

###### 5. Kết quả cuối cùng

Dựa trên trạng thái đã được định nghĩa trước đó, $dp[i][w]$ đại diện cho việc đặt $i$ nhóm hàng hóa vào một chiếc túi có khối lượng tối đa là $w$, giá trị lớn nhất có thể đạt được. Vì vậy, kết quả cuối cùng là $dp[size][W]$, trong đó $size$ là số lượng loại hàng hóa và $W$ là giới hạn khối lượng của túi.

#### Ý tưởng 1: Code

```python
class Solution:
    # Ý tưởng 1: Quy hoạch động + ý tưởng hai chiều
    def groupPackMethod1(self, group_count: [int], weight: [[int]], value: [[int]], W: int):
        size = len(group_count)
        dp = [[0 for _ in range(W + 1)] for _ in range(size + 1)]
        
        # Liệt kê qua các nhóm hàng hóa trước
        for i in range(1, size + 1):
            # Liệt kê qua các giới hạn khối lượng của túi
            for w in range(W + 1):
                # Liệt kê qua số lượng hàng hóa trong nhóm thứ i - 1
                dp[i][w] = dp[i - 1][w]
                for k in range(group_count[i - 1]):
                    if w >= weight[i - 1][k]:
                        # Lấy giá trị lớn nhất từ tất cả các lựa chọn dp[i - 1][w - weight[i - 1][k]] + value[i - 1][k]
                        dp[i][w] = max(dp[i][w], dp[i - 1][w - weight[i - 1][k]] + value[i - 1][k])
```

#### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times W \times C)$, trong đó $n$ là số lượng nhóm hàng hóa, $W$ là giới hạn khối lượng của túi, $C$ là số lượng hàng hóa trong mỗi nhóm. Vì $n \times C = \sum group\underline{}count[i]$, nên độ phức tạp thời gian cũng có thể viết là $O(W \times \sum group\underline{}count[i])$.
- **Độ phức tạp không gian**: $O(n \times W)$.

### 6.2 Tối ưu mảng trượt cho bài toán cái túi theo nhóm

#### Ý tưởng 2: Quy hoạch động + tối ưu mảng trượt

###### 1. Phân đoạn

Phân đoạn theo giới hạn khối lượng của túi hiện tại.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[w]$ là: đặt hàng hóa vào một chiếc túi có khối lượng tối đa là $w$, giá trị lớn nhất có thể đạt được.

###### 3. Công thức chuyển trạng thái

$dp[w] = max \lbrace dp[w], \quad dp[w - weight[i - 1][k]]  + value[i - 1][k] \rbrace , \quad 0 \le k \le group\underline{}count[i - 1]$

###### 4. Điều kiện ban đầu

- Bất kể giới hạn khối lượng của túi là bao nhiêu, chỉ cần không chọn hàng hóa nào, giá trị lớn nhất có thể đạt được là $0$, tức là $dp[w] = 0, 0 \le w \le W$.

###### 5. Kết quả cuối cùng

Dựa trên trạng thái đã được định nghĩa trước đó, $dp[w]$ đại diện cho việc đặt hàng hóa vào một chiếc túi có khối lượng tối đa là $w$, giá trị lớn nhất có thể đạt được. Vì vậy, kết quả cuối cùng là $dp[W]$, trong đó $W$ là giới hạn khối lượng của túi.

#### Ý tưởng 2: Code

```python
class Solution:
    # Ý tưởng 2: Quy hoạch động + tối ưu mảng trượt
    def groupPackMethod2(self, group_count: [int], weight: [[int]], value: [[int]], W: int):
        size = len(group_count)
        dp = [0 for _ in range(W + 1)]
        
        # Liệt kê qua các nhóm hàng hóa trước
        for i in range(1, size + 1):
            # Liệt kê qua các giới hạn khối lượng của túi (theo thứ tự ngược lại)
            for w in range(W, -1, -1):
                # Liệt kê qua số lượng hàng hóa trong nhóm thứ i - 1
                for k in range(group_count[i - 1]):
                    if w >= weight[i - 1][k]:
                        # Lấy giá trị lớn nhất từ tất cả các lựa chọn dp[w - weight[i - 1][k]] + value[i - 1][k]
                        dp[w] = max(dp[w], dp[w - weight[i - 1][k]] + value[i - 1][k])
                        
        return dp[W]
```

#### Ý tưởng 2: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times W \times C)$, trong đó $n$ là số lượng nhóm hàng hóa, $W$ là giới hạn khối lượng của túi, $C$ là số lượng hàng hóa trong mỗi nhóm. Vì $n \times C = \sum group\underline{}count[i]$, nên độ phức tạp thời gian cũng có thể viết là $O(W \times \sum group\underline{}count[i])$.
- **Độ phức tạp không gian**: $O(W)$.

## 7. Bài toán cái túi hai chiều

> **Bài toán túi hai chiều**：Có $n$ món hàng và một cái túi có khối lượng tối đa là $W$ và dung tích tối đa là $V$. Món hàng thứ $i$ có khối lượng là $weight[i]$ và dung tích là $volume[i]$, giá trị là $value[i]$, mỗi món hàng chỉ có một cái. Hỏi trong trường hợp tổng khối lượng không vượt quá giới hạn của túi và tổng dung tích không vượt quá giới hạn của túi, giá trị tối đa có thể đặt trong túi là bao nhiêu?

### 7.1 Ý tưởng cơ bản của bài toán túi hai chiều

Chúng ta có thể tham khảo ý tưởng cơ bản và cách tiếp cận của bài toán "cái túi 0-1" và thêm một chiều để biểu thị dung tích của món hàng.

#### Ý tưởng 1: Quy hoạch động + ý tưởng ba chiều

###### 1. Phân đoạn

Phân đoạn theo số thứ tự của món hàng, giới hạn khối lượng của túi và giới hạn dung tích của túi.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[i][w][v]$ là: Đặt $i$ món hàng vào trong một cái túi có khối lượng tối đa là $w$ và dung tích tối đa là $v$, giá trị tối đa có thể đạt được.

###### 3. Công thức chuyển trạng thái

$dp[i][w][v] = max(dp[i - 1][w][v], dp[i - 1][w - weight[i - 1]][v - volume[i - 1]] + value[i - 1]), \quad 0 \le weight[i - 1] \le w, 0 \le volume[i - 1] \le v$

> Lưu ý: Sử dụng "định nghĩa trạng thái" và "công thức chuyển trạng thái" này thường dẫn đến việc vượt quá giới hạn bộ nhớ yêu cầu, vì vậy chúng ta thường sử dụng "mảng trượt" để tối ưu không gian của thuật toán.

###### 4. Điều kiện ban đầu

- Nếu giới hạn khối lượng của túi là $0$ hoặc giới hạn dung tích của túi là $0$, thì bất kể chọn món hàng nào, giá trị tối đa có thể đạt được sẽ luôn là $0$, tức là:
	- $dp[i][w][0] = 0, 0 \le i \le size, 0 \le w \le W$
	- $dp[i][0][v] = 0, 0 \le i \le size, 0 \le v \le V$
- Bất kể giới hạn khối lượng của túi là bao nhiêu, giá trị tối đa có thể đạt được từ $0$ món hàng đầu tiên sẽ luôn là $0$, tức là:
	- $dp[0][w][v] = 0, 0 \le w \le W, 0 \le v \le V$

###### 5. Kết quả cuối cùng

Dựa trên "định nghĩa trạng thái" của chúng ta, $dp[i][w][v]$ biểu thị: Đặt $i$ món hàng vào trong một cái túi có khối lượng tối đa là $w$ và dung tích tối đa là $v$, giá trị tối đa có thể đạt được. Kết quả cuối cùng là $dp[size][W][V]$, trong đó $size$ là số lượng loại món hàng, $W$ là giới hạn khối lượng của túi và $V$ là giới hạn dung tích của túi.

#### Ý tưởng 1: Code

```python
class Solution:
    # Ý tưởng 1: Quy hoạch động + ý tưởng ba chiều
    def twoDCostPackMethod1(self, weight: [int], volume: [int], value: [int], W: int, V: int):
        size = len(weight)
        dp = [[[0 for _ in range(V + 1)] for _ in range(W + 1)] for _ in range(size + 1)]
    
        # Liệt kê qua i loại món hàng
        for i in range(1, N + 1):
            # Liệt kê qua khối lượng của túi
            for w in range(W + 1):
                # Liệt kê qua dung tích của túi
                for v in range(V + 1):
                    # Món hàng thứ i - 1 không thể đặt vào
                    if w < weight[i - 1] or v < volume[i - 1]:
                        # dp[i][w][v] lấy giá trị lớn nhất của "đặt i - 1 món hàng vào trong một cái túi có khối lượng tối đa là w và dung tích tối đa là v"
                        dp[i][w][v] = dp[i - 1][w][v]
                    else:
                        # dp[i][w][v] lấy giá trị lớn nhất của tất cả dp[w - weight[i - 1]][v - volume[i - 1]] + value[i - 1]
                        dp[i][w][v] = max(dp[i - 1][w][v], dp[i - 1][w - weight[i - 1]][v - volume[i - 1]] + value[i - 1])
                        
        return dp[size][W][V]
```

#### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times W \times V)$, trong đó $n$ là số lượng loại món hàng, $W$ là giới hạn khối lượng của túi và $V$ là giới hạn dung tích của túi.
- **Độ phức tạp không gian**: $O(n \times W \times V)$.

### 7.2 Tối ưu không gian bằng cách sử dụng mảng trượt

#### Ý tưởng 2: Quy hoạch động + tối ưu không gian bằng cách sử dụng mảng trượt

###### 1. Phân đoạn

Phân đoạn theo giới hạn khối lượng của túi và giới hạn dung tích của túi.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[w][v]$ là: Đặt món hàng vào trong một cái túi có khối lượng tối đa là $w$ và dung tích tối đa là $v$, giá trị tối đa có thể đạt được.

###### 3. Công thức chuyển trạng thái

$dp[w][v] = max \lbrace dp[w][v], \quad dp[w - weight[i - 1]][v - volume[i - 1]]  + value[i - 1] \rbrace , \quad 0 \le weight[i - 1] \le w, 0 \le volume[i - 1] \le v$

###### 4. Điều kiện ban đầu

- Nếu giới hạn khối lượng của túi là $0$ hoặc giới hạn dung tích của túi là $0$, thì bất kể chọn món hàng nào, giá trị tối đa có thể đạt được sẽ luôn là $0$, tức là:
	- $dp[w][0] = 0, 0 \le w \le W$
	- $dp[0][v] = 0, 0 \le v \le V$

###### 5. Kết quả cuối cùng

Dựa trên "định nghĩa trạng thái" của chúng ta, $dp[w][v]$ biểu thị: Đặt món hàng vào trong một cái túi có khối lượng tối đa là $w$ và dung tích tối đa là $v$, giá trị tối đa có thể đạt được. Kết quả cuối cùng là $dp[W][V]$, trong đó $W$ là giới hạn khối lượng của túi và $V$ là giới hạn dung tích của túi.

#### Ý tưởng 2: Code

```python
class Solution:        
    # Ý tưởng 2: Quy hoạch động + tối ưu không gian bằng cách sử dụng mảng trượt
    def twoDCostPackMethod2(self, weight: [int], volume: [int], value: [int], W: int, V: int):
        size = len(weight)
        dp = [[0 for _ in range(V + 1)] for _ in range(W + 1)]
        
        # Liệt kê qua khối lượng của túi
        for i in range(1, N + 1):
            # Liệt kê qua khối lượng của túi theo thứ tự ngược
            for w in range(W, weight[i - 1] - 1, -1):
                # Liệt kê qua dung tích của túi theo thứ tự ngược
                for v in range(V, volume[i - 1] - 1, -1):
                    # dp[w][v] lấy giá trị lớn nhất của tất cả dp[w - weight[i - 1]][v - volume[i - 1]] + value[i - 1]
                    dp[w][v] = max(dp[w][v], dp[w - weight[i - 1]][v - volume[i - 1]] + value[i - 1])
                    
        return dp[W][V]
```

#### Ý tưởng 2: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times W \times V)$, trong đó $n$ là số lượng loại món hàng, $W$ là giới hạn khối lượng của túi và $V$ là giới hạn dung tích của túi.
- **Độ phức tạp không gian**: $O(W \times V)$
