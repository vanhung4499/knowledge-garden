---
title: Knapsack Part 2
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-10-03
date modified: 2023-10-03
---

### 3.1 Bài toán cái túi với số lượng vô hạn

> **Bài toán cái túi với số lượng vô hạn**: Có $n$ loại vật phẩm và một cái túi có trọng lượng tối đa là $W$. Vật phẩm thứ $i$ có trọng lượng là $weight[i]$ và giá trị là $value[i]$, số lượng mỗi loại vật phẩm không có giới hạn. Hỏi trong trường hợp tổng trọng lượng không vượt quá trọng lượng tối đa của cái túi, giá trị lớn nhất có thể đạt được là bao nhiêu?

### 3.1 Ý tưởng của bài toán cái túi với số lượng vô hạn

> **Đặc điểm của bài toán cái túi với số lượng vô hạn**: Mỗi loại vật phẩm có số lượng không giới hạn.

Chúng ta có thể tham khảo định nghĩa trạng thái và ý tưởng cơ bản của "bài toán cái túi 0-1" để giải quyết vấn đề cái túi với số lượng vô hạn. Với một cái túi có trọng lượng là $w$, tối đa có thể chứa $\frac{w}{weight[i - 1]}$ vật phẩm thứ $i - 1$. Vì vậy, chúng ta có thể thêm một vòng lặp để duyệt qua số lượng vật phẩm thứ $i - 1$ có thể chọn (từ $0$ đến $\frac{w}{weight[i - 1]}$), từ đó chuyển đổi "bài toán cái túi với số lượng vô hạn" thành "bài toán cái túi 0-1".

#### Ý tưởng 1: Quy hoạch động + duyệt cơ bản hai chiều

###### 1. Phân đoạn

Phân đoạn theo số thứ tự của vật phẩm và trọng lượng tối đa của cái túi.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[i][w]$ là: Đặt $i$ loại vật phẩm đầu tiên vào một cái túi có trọng lượng tối đa là $w$, có thể đạt được giá trị lớn nhất.

Trạng thái $dp[i][w]$ là một mảng hai chiều, trong đó chiều thứ nhất đại diện cho "loại vật phẩm đang xem xét hiện tại", chiều thứ hai đại diện cho "trọng lượng tối đa của cái túi", giá trị trong mảng hai chiều đại diện cho "giá trị lớn nhất có thể đạt được".

###### 3. Công thức chuyển trạng thái

Vì mỗi loại vật phẩm có thể chọn số lượng không giới hạn, nên trạng thái $dp[i][w]$ có thể chọn giá trị lớn nhất từ các lựa chọn sau:

1. Không chọn bất kỳ vật phẩm thứ $i - 1$ nào: Giá trị lớn nhất có thể đạt được là $dp[i - 1][w]$.
2. Chọn $1$ vật phẩm thứ $i - 1$: Giá trị lớn nhất có thể đạt được là $dp[i - 1][w - weight[i - 1]] + value[i - 1]$.
3. Chọn $2$ vật phẩm thứ $i - 1$: Giá trị lớn nhất có thể đạt được là $dp[i - 1][w - 2 \times weight[i - 1]] + 2 \times value[i - 1]$.
4. ……
5. Chọn $k$ vật phẩm thứ $i - 1$: Giá trị lớn nhất có thể đạt được là $dp[i - 1][w - k \times weight[i - 1]] + k \times value[i - 1]$.

> Lưu ý: Điều kiện để chọn $k$ vật phẩm thứ $i - 1$ là $0 \le k \times weight[i - 1] \le w$.

Do đó, công thức chuyển trạng thái là:

$dp[i][w] = max \lbrace dp[i - 1][w - k \times weight[i - 1]] + k \times value[i - 1] \rbrace, \quad 0 \le k \times weight[i - 1] \le w$.

###### 4. Điều kiện ban đầu

- Nếu trọng lượng tối đa của cái túi là $0$, thì bất kể chọn vật phẩm nào, giá trị lớn nhất có thể đạt được sẽ luôn là $0$, tức là $dp[i][0] = 0, 0 \le i \le size$.
- Bất kể trọng lượng tối đa của cái túi là bao nhiêu, giá trị lớn nhất có thể đạt được từ $0$ loại vật phẩm đầu tiên sẽ luôn là $0$, tức là $dp[0][w] = 0, 0 \le w \le W$.

###### 5. Kết quả cuối cùng

Dựa vào định nghĩa trạng thái đã định nghĩa trước đó, $dp[i][w]$ đại diện cho việc đặt $i$ loại vật phẩm đầu tiên vào một cái túi có trọng lượng tối đa là $w$, để đạt được giá trị lớn nhất. Vậy kết quả cuối cùng là $dp[size][W]$, trong đó $size$ là số lượng loại vật phẩm và $W$ là trọng lượng tối đa của cái túi.

#### Ý tưởng 1: Code

```python
class Solution:
    # Ý tưởng 1: Quy hoạch động + ý tưởng cơ bản hai chiều
    def completePackMethod1(self, weight: [int], value: [int], W: int):
        size = len(weight)
        dp = [[0 for _ in range(W + 1)] for _ in range(size + 1)]
        
        # Duyệt qua từng loại vật phẩm
        for i in range(1, size + 1):
            # Duyệt qua trọng lượng tối đa của cái túi
            for w in range(W + 1):
                # Duyệt qua số lượng vật phẩm thứ i - 1 có thể chọn
                for k in range(w // weight[i - 1] + 1):
                    # dp[i][w] lấy giá trị lớn nhất từ tất cả dp[i - 1][w - k * weight[i - 1] + k * value[i - 1] có thể chọn
                    dp[i][w] = max(dp[i][w], dp[i - 1][w - k * weight[i - 1]] + k * value[i - 1])
        
        return dp[size][W]
```

#### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times W \times \sum\frac{W}{weight[i]})$, trong đó $n$ là số lượng loại vật phẩm, $W$ là trọng lượng tối đa của cái túi, $weight[i]$ là trọng lượng của vật phẩm thứ $i$.
- **Độ phức tạp không gian**: $O(n \times W)$.

### 3.2 Tối ưu công thức chuyển trạng thái của bài toán cái túi với số lượng vô hạn

Trong phương pháp trước đó, đối với mỗi loại vật phẩm, chúng ta phải duyệt qua tất cả các số lượng vật phẩm khả thi $k$, điều này làm tăng đáng kể độ phức tạp thời gian của thuật toán.

Trong thực tế, chúng ta có thể tối ưu công thức chuyển trạng thái trước đó để giảm thiểu độ phức tạp thời gian của thuật toán.

Chúng ta sẽ triển khai công thức chuyển trạng thái trước đó:

$dp[i][w] = \max \lbrace dp[i - 1][w - k \times weight[i - 1]] + k \times value[i - 1] \rbrace, \quad 0 \le k \times weight[i - 1] \le w$

Và chúng ta sẽ triển khai công thức chuyển trạng thái sau khi mở rộng:

$(1) \quad dp[i][w] = \max \begin{cases} dp[i - 1][w] \cr dp[i - 1][w - weight[i - 1]] + value[i - 1]  \cr dp[i - 1][w - 2 \times weight[i - 1]] + 2 \times value[i - 1] \cr …… \cr  \cr dp[i - 1][w - k \times weight[i - 1]] + k \times value[i - 1] \end{cases}, \quad 0 \le k \times weight[i - 1] \le w$  
Và với $dp[i][w -weight[i - 1]]$ chúng ta có:

$(2) \quad dp[i][w - weight[i - 1]] = max \begin{cases} dp[i - 1][w - weight[i - 1]] \cr dp[i - 1][w - 2 \times weight[i - 1]] + value[i - 1] \cr dp[i - 1][w - 3 \times weight[i - 1]] + 2 \times value[i - 1] \cr …… \cr dp[i - 1][w - k \times weight[i - 1]] + (k - 1) \times value[i - 1] \end{cases}, \quad weight[i - 1] \le k \times weight[i - 1] \le w$

Và chúng ta có thể quan sát được:

1. Công thức $(1)$ có tổng cộng $k + 1$ mục, công thức $(2)$ có tổng cộng $k$ mục.
2. Công thức $(2)$ và toàn bộ công thức $(1)$ khác nhau chính xác một giá trị $value[i - 1]$.

Do đó, chúng ta có thể thêm $value[i - 1]$ vào công thức $(2)$, sau đó thay thế vào công thức $(1)$, và ta sẽ có công thức chuyển trạng thái sau khi tối ưu hóa:

$(3) \quad dp[i][w] = \max \lbrace dp[i - 1][w], \quad dp[i][w - weight[i - 1]] + value[i - 1]  \rbrace, \quad 0 \le weight[i - 1] \le w$

Công thức chuyển trạng thái sau khi tối ưu hóa đã loại bỏ sự phụ thuộc vào số lượng vật phẩm, do đó không cần duyệt qua $k$ nữa, giảm ba vòng lặp xuống còn hai vòng lặp.

> Lưu ý: Công thức $(3)$ thỏa mãn điều kiện $0 \le weight[i - 1] \le w$. Khi $w < weight[i - 1]$, $dp[i][w] = dp[i - 1][w]$.

Do đó, công thức chuyển trạng thái là:

$\quad dp[i][w] = \begin{cases}  dp[i - 1][w] & w < weight[i - 1] \cr \max \lbrace dp[i - 1][w], \quad dp[i][w - weight[i - 1]] + value[i - 1]  \rbrace & w \ge weight[i - 1] \end{cases}$

Dựa vào công thức chuyển trạng thái trên, chúng ta có thể thấy rằng công thức này rất giống với công thức chuyển trạng thái của bài toán cái túi 0-1 trong "Ý tưởng 1".

> Điểm khác biệt duy nhất là:
>
> 1. Trạng thái trong bài toán cái túi 0-1 là $dp[i - 1][w - weight[i - 1]] + value[i - 1]$, đây là trạng thái ở giai đoạn thứ $i - 1$.
> 2. Trạng thái trong bài toán cái túi với số lượng vô hạn là $dp[i][w - weight[i - 1]] + value[i - 1]$, đây là trạng thái ở giai đoạn thứ $i$.

#### Ý tưởng 2: Quy hoạch động + Tối ưu công thức chuyển trạng thái

###### 1. Phân đoạn

Phân đoạn theo số thứ tự của vật phẩm và trọng lượng tối đa của cái túi.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[i][w]$ là: Đặt $i$ loại vật phẩm đầu tiên vào một cái túi có trọng lượng tối đa là $w$, có thể đạt được giá trị lớn nhất.

Trạng thái $dp[i][w]$ là một mảng hai chiều, trong đó chiều thứ nhất đại diện cho "loại vật phẩm đang xem xét hiện tại", chiều thứ hai đại diện cho "trọng lượng tối đa của cái túi", giá trị trong mảng hai chiều đại diện cho "giá trị lớn nhất có thể đạt được".

###### 3. Công thức chuyển trạng thái

$\quad dp[i][w] = \begin{cases}  dp[i - 1][w] & w < weight[i - 1] \cr \max \lbrace dp[i - 1][w], \quad dp[i][w - weight[i - 1]] + value[i - 1]  \rbrace & w \ge weight[i - 1] \end{cases}$

###### 4. Điều kiện ban đầu

- Nếu trọng lượng tối đa của cái túi là $0$, thì bất kể chọn vật phẩm nào, giá trị lớn nhất có thể đạt được sẽ luôn là $0$, tức là $dp[i][0] = 0, 0 \le i \le size$.
- Bất kể trọng lượng tối đa của cái túi là bao nhiêu, giá trị lớn nhất có thể đạt được từ $0$ loại vật phẩm đầu tiên sẽ luôn là $0$, tức là $dp[0][w] = 0, 0 \le w \le W$.

###### 5. Kết quả cuối cùng

Dựa vào định nghĩa trạng thái đã định nghĩa trước đó, $dp[i][w]$ đại diện cho việc đặt $i$ loại vật phẩm đầu tiên vào một cái túi có trọng lượng tối đa là $w$, để đạt được giá trị lớn nhất. Vậy kết quả cuối cùng là $dp[size][W]$, trong đó $size$ là số lượng loại vật phẩm và $W$ là trọng lượng tối đa của cái túi.

#### Ý tưởng 2: Code

```python
class Solution:
    # Ý tưởng 2: Quy hoạch động + Tối ưu công thức chuyển trạng thái
    def completePackMethod2(self, weight: [int], value: [int], W: int):
        size = len(weight)
        dp = [[0 for _ in range(W + 1)] for _ in range(size + 1)]
        
        # Duyệt qua từng loại vật phẩm
        for i in range(1, size + 1):
            # Duyệt qua trọng lượng tối đa của cái túi
            for w in range(W + 1):
                # Vật phẩm thứ i - 1 không thể chọn
                if w < weight[i - 1]:
                    # dp[i][w] lấy giá trị lớn nhất từ tất cả dp[i - 1][w] có thể chọn
                    dp[i][w] = dp[i - 1][w]
                else:
                    # dp[i][w] lấy giá trị lớn nhất từ tất cả dp[i - 1][w] và dp[i][w - weight[i - 1]] + value[i - 1] có thể chọn
                    dp[i][w] = max(dp[i - 1][w], dp[i][w - weight[i - 1]] + value[i - 1])
                    
        return dp[size][W]
```

#### Ý tưởng 2: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times W)$, trong đó $n$ là số lượng loại vật phẩm, $W$ là trọng lượng tối đa của cái túi.
- **Độ phức tạp không gian**: $O(n \times W)$.

### 3.3 Tối ưu hóa mảng trượt cho bài toán cái túi đầy đủ

Bằng cách quan sát phương trình chuyển trạng thái trong "Ý tưởng 2":

$dp[i][w] = \begin{cases}  dp[i - 1][w] & w < weight[i - 1] \cr max \lbrace dp[i - 1][w], \quad dp[i][w - weight[i - 1]] + value[i - 1]  \rbrace & w \ge weight[i - 1] \end{cases}$

Chúng ta có thể thấy rằng chúng ta chỉ cần sử dụng hàng hiện tại (hàng $i$) của $dp[i][w]$, $dp[i][w - weight[i - 1]]$, và hàng trước đó (hàng $i - 1$) của $dp[i - 1][w]$.

Do đó, chúng ta không cần lưu trữ tất cả các giai đoạn của trạng thái. Chúng ta chỉ cần sử dụng một mảng một chiều $dp[w]$ để lưu trữ các trạng thái của giai đoạn trước đó và tối ưu hóa không gian bằng cách sử dụng kỹ thuật "mảng trượt" (loại bỏ chiều đầu tiên của trạng thái lập trình động).

#### Ý tưởng 3: Lập trình động + Tối ưu hóa mảng trượt

###### 1. Chia thành các giai đoạn

Chia các giai đoạn dựa trên giới hạn trọng lượng hiện tại của túi.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái $dp[w]$ là: giá trị tối đa có thể đạt được bằng cách đặt các mặt hàng vào túi với giới hạn trọng lượng là $w$.

###### 3. Phương trình chuyển trạng thái

$dp[w] = \begin{cases}  dp[w] & w < weight[i - 1] \cr max \lbrace dp[w], \quad dp[w - weight[i - 1]]  + value[i - 1] \rbrace & w \ge weight[i - 1] \end{cases}$

> Lưu ý: Ở đây, $dp[w - weight[i - 1]]$ là "giá trị trạng thái của giai đoạn thứ $i$" sau khi tính toán vòng lặp thứ $i$.

Vì chúng ta cần sử dụng $dp[w - weight[i - 1]]$ tính toán trong vòng lặp thứ $i$ khi tính toán $dp[w]$, chúng ta cần tính toán $dp[w]$ theo "thứ tự chuyển tiếp" (từ $0 \sim W$) để có được kết quả chính xác.

Khi $w < weight[i - 1]$, $dp[w]$ chỉ có thể lấy giá trị của giai đoạn trước đó $dp[w]$, tức là giá trị không thay đổi. Phần này có thể bỏ qua. Do đó, khi tính toán $dp[w]$ theo thứ tự chuyển tiếp, chúng ta chỉ cần bắt đầu lặp từ $weight[i - 1]$.

###### 4. Điều kiện ban đầu

- Bất kể giới hạn trọng lượng của túi là bao nhiêu, nếu không chọn mặt hàng nào, giá trị tối đa có thể đạt được luôn là $0$, tức là $dp[w] = 0, 0 \le w \le W$.

###### 5. Kết quả cuối cùng

Dựa trên trạng thái được định nghĩa trước đó, $dp[w]$ biểu thị giá trị tối đa có thể đạt được bằng cách đặt các mặt hàng vào túi với giới hạn trọng lượng là $w$. Kết quả cuối cùng là $dp[W]$, trong đó $W$ là giới hạn trọng lượng của túi.

#### Ý tưởng 3: Code

```python
class Solution:
    # Ý tưởng 3: Lập trình động + Tối ưu hóa mảng trượt
    def completePackMethod3(self, weight: [int], value: [int], W: int):
        size = len(weight)
        dp = [0 for _ in range(W + 1)]
        
        # Liệt kê các mặt hàng đầu tiên
        for i in range(1, size + 1):
            # Lặp qua trọng lượng của túi theo thứ tự chuyển tiếp
            for w in range(weight[i - 1], W + 1):
                # dp[w] lấy giá trị lớn nhất giữa "giá trị tối đa đạt được bằng cách đặt các mặt hàng đầu tiên vào túi với giới hạn trọng lượng là w" và "giá trị tối đa đạt được bằng cách đặt các mặt hàng đầu tiên vào túi với giới hạn trọng lượng là w - weight[i - 1], sau đó thêm 1 mặt hàng của mặt hàng thứ i - 1"
                dp[w] = max(dp[w], dp[w - weight[i - 1]] + value[i - 1])
                
        return dp[W]
```

> Bằng cách so sánh mã cho "Tối ưu hóa mảng trượt cho bài toán cái túi 0-1" và "Tối ưu hóa mảng trượt cho bài toán cái túi đầy đủ", chúng ta có thể thấy rằng sự khác biệt duy nhất nằm ở:
>
> 1. Mã cho "Tối ưu hóa mảng trượt cho bài toán cái túi 0-1" sử dụng phương pháp "lặp ngược từ $W \sim weight[i - 1]$".
> 2. Mã cho "Tối ưu hóa mảng trượt cho bài toán cái túi đầy đủ" sử dụng phương pháp "lặp theo thứ tự chuyển tiếp từ $weight[i - 1] \sim W$".

#### Ý tưởng 3: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times W)$, trong đó $n$ là số lượng loại mặt hàng và $W$ là giới hạn trọng lượng của túi.
- **Độ phức tạp không gian**: $O(W)$.
