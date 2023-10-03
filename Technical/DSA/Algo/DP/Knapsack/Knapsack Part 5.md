---
title: Knapsack Part 5
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-10-03
date modified: 2023-10-03
---

## 8. Bài toán biến thể của bài toán cái túi

### 8.1 Tìm giá trị lớn nhất khi túi đầy

> **Bài toán cái túi tìm giá trị lớn nhất khi túi đầy**: Trong bài toán cái túi với trọng lượng túi là $W$, trọng lượng mỗi món hàng là $weight[i]$, và các mối quan hệ giữa các món hàng (nhóm, phụ thuộc, v.v.), hỏi trong trường hợp túi đầy, giá trị lớn nhất có thể đặt trong túi là bao nhiêu?

Trong bài toán cái túi, có những bài toán không yêu cầu đầy túi, trong khi có những bài toán yêu cầu túi đầy.

Nếu yêu cầu bài toán là "túi đầy", chúng ta có thể thêm một định nghĩa trạng thái và công thức chuyển trạng thái ban đầu. Khi đó, ta có thể khởi tạo $dp[0] = 0$ và $dp[w] = -\infty, 1 \le w \le W$. Điều này đảm bảo giá trị cuối cùng của $dp[W]$ sẽ là giá trị lớn nhất có thể đặt trong túi khi túi đầy.

Điều này là vì: Mảng $dp$ được khởi tạo ban đầu thực sự là "trạng thái hợp lệ" khi không có món hàng nào có thể đặt vào túi.

Nếu không yêu cầu đầy túi, thì:

1. Bất kỳ túi nào với giới hạn trọng lượng, khi không đặt bất kỳ món hàng nào vào, đều có một giải pháp hợp lệ, trong trường hợp này giá trị lớn nhất của các món hàng trong túi là $0$, tức là $dp[w] = 0, 0 \le w \le W$.

Trong khi nếu yêu cầu đầy túi, thì:

1. Chỉ có túi với giới hạn trọng lượng là $0$, khi không đặt bất kỳ món hàng nào vào, mới có thể đầy túi (có một giải pháp hợp lệ), trong trường hợp này giá trị lớn nhất của các món hàng trong túi là $0$, tức là $dp[0] = 0$.
2. Các túi khác với giới hạn trọng lượng, khi đặt món hàng vào, không thể đầy túi (không có giải pháp hợp lệ), trong trường hợp này giá trị lớn nhất của các món hàng trong túi thuộc trạng thái không xác định, giá trị sẽ là $-\infty$, tức là $dp[w] = 0, 0 \le w \le W$.

Điều này giúp chúng ta kiểm tra mối quan hệ giữa $dp[w]$ và $-\infty$ để xác định xem có thể đầy túi hay không khi thực hiện chuyển trạng thái.

Dưới đây, chúng ta sẽ lấy bài toán "cái túi 0-1" tìm giá trị lớn nhất khi túi đầy làm ví dụ.

> **Bài toán "cái túi 0-1" tìm giá trị lớn nhất khi túi đầy**: Có $n$ loại món hàng và một cái túi có trọng lượng tối đa là $W$，loại hàng thứ $i$ có trọng lượng là $weight[i]$，giá trị là $value[i]$，mỗi loại hàng chỉ có một cái. Hỏi trong trường hợp túi đầy, giá trị lớn nhất có thể đặt trong túi là bao nhiêu?

#### Ý tưởng 1: Quy hoạch động + trạng thái một chiều

1. **Phân đoạn**: Phân đoạn theo giới hạn trọng lượng của túi.
2. **Định nghĩa trạng thái**: Định nghĩa trạng thái $dp[w]$ là: Đặt món hàng vào trong một cái túi có trọng lượng tối đa là $w$，túi đầy, giá trị lớn nhất có thể đặt trong túi là bao nhiêu.
3. **Công thức chuyển trạng thái**: $dp[w] = dp[w] + dp[w - weight[i - 1]]$
4. **Điều kiện ban đầu**:
	1. Chỉ có túi với giới hạn trọng lượng là $0$, khi không đặt bất kỳ món hàng nào vào, mới có thể đầy túi (có một giải pháp hợp lệ), trong trường hợp này giá trị lớn nhất của các món hàng trong túi là $0$, tức là $dp[0] = 0$.
	2. Các túi khác với giới hạn trọng lượng, khi đặt món hàng vào, không thể đầy túi (không có giải pháp hợp lệ), trong trường hợp này giá trị lớn nhất của các món hàng trong túi thuộc trạng thái không xác định, giá trị sẽ là $-\infty$, tức là $dp[w] = 0, 0 \le w \le W$.
5. **Kết quả cuối cùng**: Dựa trên định nghĩa trạng thái của chúng ta, $dp[w]$ biểu thị: Đặt món hàng vào trong một cái túi có trọng lượng tối đa là $w$，túi đầy, giá trị lớn nhất có thể đặt trong túi là bao nhiêu. Kết quả cuối cùng là $dp[W]$，trong đó $W$ là giới hạn trọng lượng của túi.

#### Ý tưởng 1: Code

```python
class Solution:
    # Ý tưởng 1: Quy hoạch động + trạng thái một chiều
    def zeroOnePackJustFillUp(self, weight: [int], value: [int], W: int):
        size = len(weight)
        dp = [float('-inf') for _ in range(W + 1)]
        dp[0] = 0
        
        # Liệt kê qua i loại món hàng
        for i in range(1, size + 1):
            # Liệt kê qua trọng lượng của túi theo thứ tự ngược (tránh sai sót về giá trị trạng thái)
            for w in range(W, weight[i - 1] - 1, -1):
                # dp[w] lấy giá trị lớn nhất của "đặt i - 1 món hàng vào trong một cái túi có trọng lượng tối đa là w" và "đặt i - 1 món hàng vào trong một cái túi có trọng lượng tối đa là w - weight[i - 1] và thêm món hàng thứ i - 1"
                dp[w] = max(dp[w], dp[w - weight[i - 1]] + value[i - 1])
        
        if dp[W] == float('-inf'):
            return -1
        return dp[W]
```

#### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times W)$, trong đó $n$ là số lượng loại món hàng, $W$ là giới hạn trọng lượng của túi.
- **Độ phức tạp không gian**: $O(W)$

### 8.2 Tổng số lượng lời giải

> **Tính tổng số lượng lời giải trong bài toán cái túi**: Trong bài toán cái túi với trọng lượng cái túi là $W$, trọng lượng của mỗi vật phẩm là $weight[i]$, và các mối quan hệ giữa các vật phẩm (nhóm, phụ thuộc, v.v.) trong bài toán cái túi, chúng ta cần tính tổng số lượng lời giải có thể có trong trường hợp tổng trọng lượng không vượt quá giới hạn trọng lượng của cái túi hoặc tổng trọng lượng không vượt quá một giới hạn trọng lượng cụ thể.

Vấn đề này chỉ cần thay đổi phép tính từ "tìm giá trị lớn nhất" thành "tính tổng" trong công thức chuyển trạng thái ban đầu.

Dưới đây chúng ta sẽ lấy ví dụ bài toán cái túi 0-1 để tính tổng số lượng lời giải.

> **Tính tổng số lượng lời giải trong bài toán cái túi 0-1**: Cho $n$ vật phẩm và một cái túi có trọng lượng tối đa $W$. Trọng lượng của vật phẩm thứ $i$ là $weight[i]$, giá trị là $value[i]$, mỗi vật phẩm chỉ có một cái. Hãy tính tổng số lượng lời giải có thể có trong trường hợp tổng trọng lượng không vượt quá giới hạn trọng lượng của cái túi.

- Nếu sử dụng định nghĩa trạng thái hai chiều, chúng ta có thể định nghĩa trạng thái $dp[i][w]$ là: tổng số lượng lời giải có thể có trong trường hợp đặt $i$ vật phẩm vào một cái túi có trọng lượng tối đa là $w$. Công thức chuyển trạng thái là: $dp[i][w] = dp[i - 1][w] + dp[i][w - weight[i - 1]]$.
- Nếu sử dụng định nghĩa trạng thái một chiều, chúng ta có thể định nghĩa trạng thái $dp[w]$ là: tổng số lượng lời giải có thể có trong trường hợp đặt vật phẩm vào một cái túi có trọng lượng tối đa là $w$. Công thức chuyển trạng thái là: $dp[w] = dp[w] + dp[w - weight[i - 1]]$.

Dưới đây chúng ta sử dụng cách định nghĩa trạng thái một chiều để giải quyết bài toán "Tính tổng số lượng lời giải trong bài toán cái túi 0-1".

#### Ý tưởng 2: Quy hoạch động + Trạng thái một chiều

1. **Phân chia giai đoạn**: Phân chia giai đoạn theo số thứ tự của các vật phẩm và trọng lượng tối đa của cái túi.
2. **Định nghĩa trạng thái**: Định nghĩa trạng thái $dp[w]$ là tổng số lượng lời giải có thể có trong trường hợp đặt vật phẩm vào một cái túi có trọng lượng tối đa là $w$.
3. **Công thức chuyển trạng thái**: $dp[w] = dp[w] + dp[w - weight[i - 1]]$
4. **Điều kiện ban đầu**: Nếu trọng lượng tối đa của cái túi là $0$, tổng số lượng lời giải có thể có là $1$ (không đặt gì vào túi), tức là $dp[0] = 1$.
5. **Kết quả cuối cùng**: Dựa trên định nghĩa trạng thái, $dp[w]$ là tổng số lượng lời giải có thể có trong trường hợp đặt vật phẩm vào một cái túi có trọng lượng tối đa là $w$. Vậy kết quả cuối cùng là $dp[W]$, trong đó $W$ là trọng lượng tối đa của cái túi.

#### Ý tưởng 2: Code

```python
class Solution:
    # Tính tổng số lượng lời giải trong bài toán cái túi 0-1
    def zeroOnePackNumbers(self, weight: [int], value: [int], W: int):
        size = len(weight)
        dp = [0 for _ in range(W + 1)]
        dp[0] = 1
        
        # Duyệt qua từng vật phẩm
        for i in range(1, size + 1):
            # Duyệt ngược từ trọng lượng tối đa đến trọng lượng của vật phẩm thứ i
            for w in range(W, weight[i - 1] - 1, -1):
                # dp[w] = tổng số lượng lời giải có thể có trong trường hợp đặt i - 1 vật phẩm vào cái túi có trọng lượng tối đa là w + tổng số lượng lời giải có thể có trong trường hợp đặt i vật phẩm vào cái túi có trọng lượng tối đa là w - weight[i - 1]
                dp[w] = dp[w] + dp[w - weight[i - 1]]
                
        return dp[W]
```

#### Ý tưởng 2: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times W)$, trong đó $n$ là số lượng vật phẩm và $W$ là trọng lượng tối đa của cái túi.
- **Độ phức tạp không gian**: $O(W)$.

### 8.3 Tìm số lượng lời giải tối ưu

> **Bài toán cái túi tìm số lượng lời giải tối ưu**: Trong bài toán cái túi với trọng lượng túi $W$, trọng lượng của mỗi vật phẩm là $weight[i]$, giá trị của mỗi vật phẩm là $value[i]$, và có một số quan hệ giữa các vật phẩm (nhóm, phụ thuộc, v.v.). Hỏi trong trường hợp tổng trọng lượng không vượt quá giới hạn của túi, số lượng lời giải để đạt được tổng giá trị lớn nhất là bao nhiêu?

Bằng cách kết hợp hai bài toán "tìm giá trị tối đa của cái túi" và "tìm số lượng lời giải", chúng ta có thể định nghĩa hai trạng thái khác nhau:

1. Định nghĩa $dp[i][w]$ là: Tổng giá trị tối đa có thể đạt được bằng cách đặt $i$ loại vật phẩm vào một cái túi có trọng lượng tối đa là $w$.
2. Định nghĩa $op[i][w]$ là: Số lượng lời giải tối ưu để đặt $i$ loại vật phẩm vào một cái túi có trọng lượng tối đa là $w$.

Dưới đây, chúng ta sẽ lấy ví dụ bài toán "cái túi 0-1" để tìm số lượng lời giải tối ưu.

> **Bài toán cái túi 0-1 tìm số lượng lời giải tối ưu**: Cho $n$ loại vật phẩm và một cái túi có trọng lượng tối đa là $W$. Trọng lượng của vật phẩm thứ $i$ là $weight[i]$, giá trị của vật phẩm là $value[i]$, và mỗi loại vật phẩm chỉ có một cái. Hỏi trong trường hợp tổng trọng lượng không vượt quá giới hạn của túi, số lượng lời giải để đạt được tổng giá trị lớn nhất là bao nhiêu?

#### Ý tưởng 3: Quy hoạch động

1. **Phân đoạn bài toán**: Phân đoạn bài toán theo số thứ tự của loại vật phẩm và trọng lượng tối đa của cái túi.
2. **Định nghĩa trạng thái**:
   1. Định nghĩa $dp[i][w]$ là: Tổng giá trị tối đa có thể đạt được bằng cách đặt $i$ loại vật phẩm vào một cái túi có trọng lượng tối đa là $w$.
   2. Định nghĩa $op[i][w]$ là: Số lượng lời giải tối ưu để đặt $i$ loại vật phẩm vào một cái túi có trọng lượng tối đa là $w$.
3. **Công thức chuyển trạng thái**:
   1. Nếu $dp[i - 1][w] < dp[i - 1][w - weight[i - 1]] + value[i - 1]$, tức là chọn vật phẩm thứ $i - 1$ sẽ có giá trị cao hơn, lúc này số lượng lời giải $op[i][w]$ sẽ giống với $op[i - 1][w - weight[i - 1]]$, tức là không thay đổi: $op[i][w] = op[i - 1][w - weight[i - 1]]$.
   2. Nếu $dp[i - 1][w] = dp[i - 1][w - weight[i - 1]] + value[i - 1]$, tức là chọn hoặc không chọn vật phẩm thứ $i - 1$ đều có cùng giá trị, lúc này số lượng lời giải $op[i][w]$ sẽ là tổng của hai trường hợp: $op[i][w] = op[i - 1][w] + op[i - 1][w - weight[i - 1]]$.
   3. Nếu $dp[i - 1][w] > dp[i - 1][w - weight[i - 1]] + value[i - 1]$, tức là không chọn vật phẩm thứ $i - 1$ sẽ có giá trị cao hơn, lúc này số lượng lời giải $op[i][w]$ sẽ giống với số lượng lời giải trước đó: $op[i][w] = op[i - 1][w]$.
4. **Điều kiện ban đầu**: Nếu trọng lượng tối đa của cái túi là $0$, tức là không có vật phẩm nào được chọn, số lượng lời giải là $1$ (không chọn gì cả), tức là $dp[0] = 1$.
5. **Kết quả cuối cùng**: Dựa trên định nghĩa trạng thái, $op[i][w]$ là số lượng lời giải tối ưu để đặt $i$ loại vật phẩm vào một cái túi có trọng lượng tối đa là $w$. Kết quả cuối cùng là $op[size][W]$, trong đó $size$ là số lượng loại vật phẩm và $W$ là trọng lượng tối đa của cái túi.

#### Ý tưởng 3: Code

```python
class Solution:
    # Bài toán cái túi 0-1 tìm số lượng lời giải tối ưu ý tưởng 1
    def zeroOnePackMaxProfitNumbers1(self, weight: [int], value: [int], W: int):
        size = len(weight)
        dp = [[0 for _ in range(W + 1)] for _ in range(size + 1)]
        op = [[1 for _ in range(W + 1)] for _ in range(size + 1)]
        
        # Duyệt qua từng loại vật phẩm
        for i in range(1, size + 1):
            # Duyệt qua trọng lượng của túi
            for w in range(W + 1):
                # Vật phẩm thứ i - 1 không thể chứa vào túi
                if w < weight[i - 1]:
                    # dp[i][w] lấy giá trị "tổng giá trị tối đa có thể đạt được bằng cách đặt i - 1 loại vật phẩm vào một cái túi có trọng lượng tối đa là w"
                    dp[i][w] = dp[i - 1][w]
                    op[i][w] = op[i - 1][w]
                else:
                    # Chọn vật phẩm thứ i - 1 để có giá trị cao hơn
                    if dp[i - 1][w] < dp[i - 1][w - weight[i - 1]] + value[i - 1]:
                        dp[i][w] = dp[i - 1][w - weight[i - 1]] + value[i - 1]
                        # Số lượng lời giải tăng lên dựa trên số lượng lời giải trước đó
                        op[i][w] = op[i - 1][w - weight[i - 1]]
                    # Chọn hoặc không chọn vật phẩm thứ i - 1 đều có cùng giá trị
                    elif dp[i - 1][w] == dp[i - 1][w - weight[i - 1]] + value[i - 1]:
                        dp[i][w] = dp[i - 1][w]
                        # Số lượng lời giải = số lượng lời giải không chọn vật phẩm thứ i - 1 + số lượng lời giải chọn vật phẩm thứ i - 1
                        op[i][w] = op[i - 1][w] + op[i - 1][w - weight[i - 1]]
                    # Không chọn vật phẩm thứ i - 1 để có giá trị cao hơn
                    else:
                        dp[i][w] = dp[i - 1][w]
                        # Số lượng lời giải giống với số lượng lời giải trước đó
                        op[i][w] = op[i - 1][w]
                        
        return op[size][W]
```

#### Ý tưởng 3: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times W)$, trong đó $n$ là số lượng loại vật phẩm và $W$ là trọng lượng tối đa của cái túi.
- **Độ phức tạp không gian**: $O(n \times W)$.

### 8.4 Tìm lời giải cụ thể

> **Bài toán cái túi tìm lời giải cụ thể**: Trong bài toán cái túi với trọng lượng túi $W$, trọng lượng của mỗi vật phẩm là $weight[i]$, giá trị của mỗi vật phẩm là $value[i]$, và có một số quan hệ giữa các vật phẩm (nhóm, phụ thuộc, v.v.). Hỏi cần chọn những vật phẩm nào để đặt vào túi, sao cho tổng trọng lượng của chúng không vượt quá giới hạn của túi và tổng giá trị là lớn nhất?

Thường thì bài toán cái túi chỉ tìm kiếm một giá trị tối ưu, nhưng nếu muốn in ra lời giải cụ thể, chúng ta có thể định nghĩa thêm một mảng $path[i][w]$ để ghi lại trạng thái được chọn trong quá trình chuyển trạng thái, từ đó xác định được các vật phẩm cụ thể được chọn.

Dưới đây, chúng ta sẽ lấy ví dụ bài toán "cái túi 0-1" để tìm lời giải cụ thể.

> **Bài toán cái túi 0-1 tìm lời giải cụ thể**: Cho $n$ loại vật phẩm và một cái túi có trọng lượng tối đa là $W$. Trọng lượng của vật phẩm thứ $i$ là $weight[i]$, giá trị của vật phẩm là $value[i]$, và mỗi loại vật phẩm chỉ có một cái. Hỏi cần chọn những vật phẩm nào để đặt vào túi, sao cho tổng trọng lượng của chúng không vượt quá giới hạn của túi và tổng giá trị là lớn nhất?

#### Ý tưởng 4: Quy hoạch động + Ghi lại lời giải

Công thức chuyển trạng thái của bài toán cái túi 0-1 là: $dp[i][w] = max \lbrace dp[i - 1][w], \quad dp[i - 1][w - weight[i - 1]] + value[i - 1] \rbrace$

Chúng ta có thể định nghĩa thêm một mảng $path[i][w]$ để ghi lại trạng thái được chọn trong quá trình chuyển trạng thái.

1. Nếu $path[i][w] = False$, tức là: khi chuyển đến $dp[i][w]$, chọn trạng thái trước đó là $dp[i - 1][w]$ và không bao gồm vật phẩm thứ $i - 1$ trong lời giải cụ thể.
2. Nếu $path[i][w] = True$, tức là: khi chuyển đến $dp[i][w]$, chọn trạng thái trước đó là $dp[i - 1][w - weight[i - 1]] + value[i - 1]$ và bao gồm vật phẩm thứ $i - 1$ trong lời giải cụ thể.

#### Ý tưởng 4: Code

```python
class Solution:    
    # Bài toán cái túi 0-1 tìm lời giải cụ thể
    def zeroOnePackPrintPath(self, weight: [int], value: [int], W: int):
        size = len(weight)
        dp = [[0 for _ in range(W + 1)] for _ in range(size + 1)]
        path = [[False for _ in range(W + 1)] for _ in range(size + 1)]
    
        # Duyệt qua từng loại vật phẩm
        for i in range(1, size + 1):
            # Duyệt qua trọng lượng của túi
            for w in range(W + 1):
                # Vật phẩm thứ i - 1 không thể chứa vào túi
                if w < weight[i - 1]:
                    # dp[i][w] lấy giá trị "tổng giá trị tối đa có thể đạt được bằng cách đặt i - 1 loại vật phẩm vào một cái túi có trọng lượng tối đa là w"
                    dp[i][w] = dp[i - 1][w]
                    path[i][w] = False
                else:
                    # Chọn vật phẩm thứ i - 1 để có giá trị cao hơn
                    if dp[i - 1][w] < dp[i - 1][w - weight[i - 1]] + value[i - 1]:
                        dp[i][w] = dp[i - 1][w - weight[i - 1]] + value[i - 1]
                        # Ghi lại trạng thái chọn thứ i - 1: chọn vật phẩm thứ i - 1
                        path[i][w] = True
                    # Chọn hoặc không chọn vật phẩm thứ i - 1 đều có cùng giá trị
                    elif dp[i - 1][w] == dp[i - 1][w - weight[i - 1]] + value[i - 1]:
                        dp[i][w] = dp[i - 1][w]
                        # Ghi lại trạng thái chọn thứ i - 1: chọn vật phẩm thứ i - 1
                        path[i][w] = True
                    # Không chọn vật phẩm thứ i - 1 để có giá trị cao hơn
                    else:
                        dp[i][w] = dp[i - 1][w]
                        # Ghi lại trạng thái chọn thứ i - 1: không chọn vật phẩm thứ i - 1
                        
        res = []
        i, w = size, W
        while i >= 1 and w >= 0:
            if path[i][w]:
                res.append(str(i - 1))
                w -= weight[i - 1]
            i -= 1
            
        return " ".join(res[::-1])
```

#### Ý tưởng 4: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times W)$, trong đó $n$ là số lượng loại vật phẩm và $W$ là trọng lượng tối đa của cái túi.
- **Độ phức tạp không gian**: $O(n \times W)$.

### 8.5 Tìm lời giải cụ thể theo thứ tự từ điển nhỏ nhất

Ở đây, "thứ tự từ điển nhỏ nhất" có nghĩa là khi sắp xếp các lời giải chọn vật phẩm theo thứ tự từ $0$ đến $size - 1$, thì lời giải đó có thứ tự từ điển nhỏ nhất.

Chúng ta sẽ tiếp tục lấy ví dụ bài toán "cái túi 0-1" để tìm lời giải cụ thể theo thứ tự từ điển nhỏ nhất.

Để đảm bảo "thứ tự từ điển nhỏ nhất", chúng ta có thể đảo ngược thứ tự của các vật phẩm, từ $0$ đến $size - 1$ thành $size - 1$ đến $0$. Sau đó, khi trả về lời giải cụ thể, chúng ta có thể đảo ngược lại thứ tự bằng cách sử dụng $i = size - 1$.

Điều này giúp chúng ta chọn các vật phẩm có số thứ tự lớn hơn trước, từ đó đảm bảo rằng lời giải chọn vật phẩm theo thứ tự từ $0$ đến $size - 1$ có thứ tự từ điển nhỏ nhất.

#### Ý tưởng 5: Code

```python
class Solution:
    # Bài toán cái túi 0-1 tìm lời giải cụ thể, yêu cầu thứ tự từ điển nhỏ nhất
    def zeroOnePackPrintPathMinOrder(self, weight: [int], value: [int], W: int):
        size = len(weight)
        dp = [[0 for _ in range(W + 1)] for _ in range(size + 1)]
        path = [[False for _ in range(W + 1)] for _ in range(size + 1)]
        
        weight.reverse()
        value.reverse()
        
        # Duyệt qua từng loại vật phẩm
        for i in range(1, size + 1):
            # Duyệt qua trọng lượng của túi
            for w in range(W + 1):
                # Vật phẩm thứ i - 1 không thể chứa vào túi
                if w < weight[i - 1]:
                    # dp[i][w] lấy giá trị "tổng giá trị tối đa có thể đạt được bằng cách đặt i - 1 loại vật phẩm vào một cái túi có trọng lượng tối đa là w"
                    dp[i][w] = dp[i - 1][w]
                    path[i][w] = False
                else:
                    # Chọn vật phẩm thứ i - 1 để có giá trị cao hơn
                    if dp[i - 1][w] < dp[i - 1][w - weight[i - 1]] + value[i - 1]:
                        dp[i][w] = dp[i - 1][w - weight[i - 1]] + value[i - 1]
                        # Ghi lại trạng thái chọn thứ i - 1: chọn vật phẩm thứ i - 1
                        path[i][w] = True
                    # Chọn hoặc không chọn vật phẩm thứ i - 1 đều có cùng giá trị
                    elif dp[i - 1][w] == dp[i - 1][w - weight[i - 1]] + value[i - 1]:
                        dp[i][w] = dp[i - 1][w]
                        # Ghi lại trạng thái chọn thứ i - 1: chọn vật phẩm thứ i - 1
                        path[i][w] = True
                    # Không chọn vật phẩm thứ i - 1 để có giá trị cao hơn
                    else:
                        dp[i][w] = dp[i - 1][w]
                        # Ghi lại trạng thái chọn thứ i - 1: không chọn vật phẩm thứ i - 1
                        
        res = []
        i, w = size, W
        while i >= 1 and w >= 0:
            if path[i][w]:
                res.append(str(size - i))
                w -= weight[i - 1]
            i -= 1
            
        return " ".join(res)
```

#### Ý tưởng 5: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times W)$, trong đó $n$ là số lượng loại vật phẩm và $W$ là trọng lượng tối đa của cái túi.
- **Độ phức tạp không gian**: $O(n \times W)$.
