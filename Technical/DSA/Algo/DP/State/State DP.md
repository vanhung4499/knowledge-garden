---
title: State DP
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-10-03
date modified: 2023-10-03
---

## 1. Giới thiệu về Dynamic Programming nén trạng thái

> **Dynamic Programming nén trạng thái**: Được viết tắt là "State DP ", là một phương pháp quy hoạch động được áp dụng trên mảng / chuỗi dữ liệu "quy mô nhỏ" và kết hợp với tính chất "nhị phân" để định nghĩa trạng thái và chuyển trạng thái.

Chúng ta đã học về "liệt kê nhị phân của tập con" trong phần "Kiến thức về toán tử nhị phân". Hãy xem lại cách liệt kê nhị phân của tập con.

### 1.1 Liệt kê nhị phân của tập con

Đối với một tập hợp $S$ có $n$ phần tử, mỗi vị trí trong tập hợp đều có hai trạng thái: chọn hoặc không chọn. Chúng ta có thể sử dụng số nhị phân có độ dài $n$ để biểu diễn tập hợp $S$ hoặc tập con của nó. Mỗi bit nhị phân tương ứng với trạng thái chọn hoặc không chọn một phần tử trong tập hợp.

Ví dụ, với tập hợp $S$ có độ dài $5$, chúng ta có thể sử dụng một số nhị phân có độ dài $5$ để biểu diễn tập hợp $S$ hoặc một tập con của nó.

Ví dụ, số nhị phân $11111_{(2)}$ biểu diễn việc chọn tất cả các phần tử trong tập hợp $S = \lbrace 5, 4, 3, 2, 1 \rbrace$. Bảng dưới đây mô tả:

| Vị trí phần tử trong tập hợp $S$ |  5   |  4   |  3   |  2   |  1   |
| :---------------- | :--: | :--: | :--: | :--: | :--: |
| Giá trị nhị phân tương ứng      |  1   |  1   |  1   |  1   |  1   |
| Trạng thái chọn tương ứng      | Chọn | Chọn | Chọn | Chọn | Chọn |

Ví dụ khác, số nhị phân $10101_{(2)}$ biểu diễn việc chọn các phần tử ở vị trí $1$, $3$ và $5$ của tập hợp $S = \lbrace 5, 4, 3, 2, 1 \rbrace$. Bảng dưới đây mô tả:

| Vị trí phần tử trong tập hợp $S$ |  5   |   4    |  3   |   2    |  1   |
| :---------------- | :--: | :----: | :--: | :----: | :--: |
| Giá trị nhị phân tương ứng      |  1   |   0    |  1   |   0    |  1   |
| Trạng thái chọn tương ứng      | Chọn | Không chọn | Chọn | Không chọn | Chọn |

Số nhị phân $01001_{(2)}$ biểu diễn việc chọn các phần tử ở vị trí $1$ và $4$ của tập hợp $S = \lbrace 5, 4, 3, 2, 1 \rbrace$. Bảng dưới đây mô tả:

| Vị trí phần tử trong tập hợp $S$ |   5    |  4   |   3    |   2    |  1   |
| :---------------- | :----: | :--: | :----: | :----: | :--: |
| Giá trị nhị phân tương ứng      |   0    |  1   |   0    |   0    |  1   |
| Trạng thái chọn tương ứng      | Không chọn | Chọn | Không chọn | Không chọn | Chọn |

Từ các ví dụ trên, chúng ta có thể thấy rằng với tập hợp $S$ có độ dài $5$, chúng ta chỉ cần liệt kê từ $00000$ đến $11111$ (tương ứng với các số từ $0$ đến $2^5 - 1$) một lần duy nhất để có được tất cả các tập con của tập hợp $S$.

Chúng ta có thể mở rộng ví dụ trên cho tập hợp $S$ có độ dài $n$. Tổng kết lại:

- Đối với tập hợp $S$ có độ dài $n$, chúng ta chỉ cần liệt kê từ $0$ đến $2^n - 1$ (tổng cộng $2^n$ trạng thái) để có được tất cả các tập con của tập hợp $S$.

### 1.2 Định nghĩa trạng thái và chuyển trạng thái

#### 1.2.1 Định nghĩa trạng thái

Trong DP nén trạng thái, chúng ta thường sử dụng số nhị phân để biểu diễn trạng thái một chiều, tức là tình trạng lựa chọn của mỗi phần tử trong tập hợp.

Tương tự như thuật toán "liệt kê tất cả các tập con nhị phân", chúng ta sử dụng một "số nhị phân có độ dài $n$" để biểu diễn "tất cả các trạng thái lựa chọn của $n$ phần tử trong tập hợp".

Mỗi bit nhị phân trong số đó tương ứng với trạng thái lựa chọn của một phần tử trong tập hợp. Nếu bit thứ $i$ của số nhị phân đó là $1$, có nghĩa là phần tử thứ $i$ trong tập hợp được chọn trong trạng thái đó. Ngược lại, nếu bit thứ $i$ của số nhị phân đó là $0$, có nghĩa là phần tử thứ $i$ trong tập hợp không được chọn trong trạng thái đó.

#### 1.2.2 Chuyển trạng thái

Thường thì, DP nén trạng thái có hai cách chuyển trạng thái:

1. Liệt kê tất cả các tập con: Với một trạng thái, liệt kê tất cả các tập con của nó, hoặc liệt kê tất cả các vị trí của các phần tử, tìm ra tập con có số lượng phần tử ít hơn một phần tử so với trạng thái hiện tại. Sau đó, dựa trên giá trị của tập con và mối quan hệ giữa tập con và trạng thái, cập nhật giá trị của trạng thái hiện tại.
2. Liệt kê tất cả các tập siêu: Với một trạng thái, liệt kê tất cả các tập siêu của nó. Sau đó, dựa trên giá trị của tập siêu và mối quan hệ giữa tập siêu và trạng thái, cập nhật giá trị của trạng thái hiện tại.

Trong đó, phương pháp "liệt kê tất cả các tập con" là phương pháp phổ biến nhất.

### 1.3 Điều kiện sử dụng DP nén trạng thái

Đối với tập hợp có số phần tử không vượt quá $n$, tổng số trạng thái có thể có là $2^n$. Vì số lượng trạng thái tăng theo cấp số mũ khi $n$ tăng lên, nên DP nén trạng thái chỉ phù hợp để giải quyết các vấn đề với quy mô dữ liệu nhỏ (thường là $n \le 20$). Khi $n$ quá lớn, việc sử dụng DP nén trạng thái có thể gây ra thời gian chạy quá lâu.

## 2. Các thao tác bit thường dùng trong DP nén trạng thái

Trong DP nén trạng thái, trạng thái một chiều là một tập hợp, và chúng ta thực hiện các hoạt động trên tập hợp hoặc chuyển đổi giữa các trạng thái.

Vì chúng ta sử dụng số nhị phân để định nghĩa trạng thái tập hợp, nên để thực hiện các hoạt động trên tập hợp, chúng ta sử dụng các phép toán bit.

Dưới đây là một số phép toán bit thường được sử dụng, trong đó $n$ là số phần tử trong tập hợp, $A$ và $B$ là hai số nhị phân tương ứng với hai tập hợp, $i$ là vị trí của một phần tử.

- Số lượng trạng thái: `1 << n`
- Thêm phần tử thứ $i$ vào tập hợp $A$ (đặt bit thứ $i$ của số nhị phân bằng $1$): `A = A | (1 << i)`
- Xóa phần tử thứ $i$ khỏi tập hợp $A$ (đặt bit thứ $i$ của số nhị phân bằng $0$): `A = A & ~(1 << i)`
- Kiểm tra xem tập hợp $A$ có chọn phần tử thứ $i$ hay không (kiểm tra bit thứ $i$ của số nhị phân có bằng $1$ không): `if A & (1 << i):` hoặc `if (A >> i) & 1:`
- Đặt tập hợp $A$ thành tập rỗng: `A = 0`
- Đặt tập hợp $A$ thành tập hợp đầy đủ: `A = 1 << n`
- Tính tập bù của tập hợp $A$: `A = A ^ ((1 << n) - 1)`
- Tính tập hợp hợp của tập hợp $A$ và tập hợp $B$: `A | B`
- Tính tập hợp giao của tập hợp $A$ và tập hợp $B$: `A & B`
- Liệt kê tất cả các tập con của tập hợp $A$ (bao gồm $A$):

    ```python
    subA = A						# Bắt đầu từ tập hợp A
    while subA > 0:					
        ...
        subA = (subB - 1) & A		# Lấy tập con tiếp theo
    ```

- Liệt kê tất cả các tập con của tập hợp đầy đủ:

    ```python
    for state in range(1 << n):		# state là tập con
        for i in range(n):			# Liệt kê phần tử thứ i
            if (state >> i) & i:	# Nếu bit thứ i của state bằng 1, thì tương ứng với việc chọn phần tử đó trong tập hợp
                ...
    ```

### 3.1 Ứng dụng của DP nén trạng thái

#### 3.1.1 Liên kết đề bài

- [1879. Minimum XOR Sum of Two Arrays](https://leetcode.com/problems/minimum-xor-sum-of-two-arrays/)

#### 3.1.2 Ý tưởng

**Mô tả**: Cho hai mảng số nguyên $nums1$ và $nums2$, cả hai mảng đều có độ dài $n$.

**Yêu cầu**: Sắp xếp lại các phần tử trong mảng $nums2$ sao cho tổng XOR của hai mảng là nhỏ nhất. Trả về tổng XOR sau khi sắp xếp lại.

**Giải thích**:

- **Tổng XOR của hai mảng**: $(nums1[0] \oplus nums2[0]) + (nums1[1] \oplus nums2[1]) + … + (nums1[n - 1] \oplus nums2[n - 1])$ (chỉ số bắt đầu từ $0$).
- Ví dụ, với $[1, 2, 3]$ và $[3, 2, 1]$, tổng XOR của hai mảng là $(1 \oplus 3) + (2 \oplus 2) + (3 \oplus 1) + (3 \oplus 1) = 2 + 0 + 2 = 4$.
- $n = \text{len}(nums1) = \text{len}(nums2)$.
- $1 \leq n \leq 14$.
- $0 \leq nums1[i], nums2[i] \leq 10^7$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums1 = [1,2], nums2 = [2,3]
Output: 2
Explanation: Sắp xếp lại nums2 thành [3,2].
Tổng XOR là (1 XOR 3) + (2 XOR 2) = 2 + 0 = 2.
```

- Ví dụ 2:

```python
Input: nums1 = [1,0,3], nums2 = [5,3,4]
Output: 8
Explanation: Sắp xếp lại nums2 thành [5,4,3].
Tổng XOR là (1 XOR 5) + (0 XOR 4) + (3 XOR 3) = 4 + 4 + 0 = 8.
```

#### 3.1.3 Ý tưởng giải quyết

##### Ý tưởng 1: DP nén trạng thái

Vì mảng $nums2$ có thể được sắp xếp lại, chúng ta có thể giữ nguyên thứ tự các phần tử trong mảng $nums1$ và kết hợp phần tử thứ $i$ trong mảng $nums1$ với tất cả các phần tử chưa được chọn trong mảng $nums2$ để tìm ra tổng XOR nhỏ nhất.

Vì kích thước của hai mảng $nums1$ và $nums2$ nằm trong khoảng $[1, 14]$, chúng ta có thể sử dụng "nén trạng thái" để biểu diễn trạng thái chọn phần tử trong mảng $nums2$.

"Nén trạng thái" là việc sử dụng một số nhị phân có $n$ bit để biểu diễn trạng thái chọn phần tử trong một mảng.

Nếu bit thứ $i$ của số nhị phân là $1$, điều đó có nghĩa là phần tử thứ $i$ trong mảng $nums2$ được chọn trong trạng thái đó. Ngược lại, nếu bit thứ $i$ là $0$, điều đó có nghĩa là phần tử thứ $i$ trong mảng $nums2$ không được chọn trong trạng thái đó.

Ví dụ:

1. $nums2 = \lbrace 1, 2, 3, 4 \rbrace, \text{state} = (1001)_2$, đại diện cho việc chọn phần tử thứ $1$ và thứ $4$, tức là $1$ và $4$.
2. $nums2 = \lbrace 1, 2, 3, 4, 5, 6 \rbrace, \text{state} = (011010)_2$, đại diện cho việc chọn phần tử thứ $2$, thứ $4$ và thứ $5$, tức là $2$, $4$ và $5$.

Như vậy, chúng ta có thể giải quyết bài toán này bằng cách sử dụng quy hoạch động.

###### 1. Phân chia giai đoạn

Phân chia giai đoạn dựa trên trạng thái chọn phần tử trong mảng $nums$.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái hiện tại là $\text{state}$, trong đó $\text{state}$ đại diện cho trạng thái chọn phần tử trong mảng $nums2$ và $\text{count}(\text{state})$ là số lượng phần tử được chọn trong trạng thái đó.

Chúng ta có thể định nghĩa trạng thái $dp[\text{state}]$ như sau: $\text{state}$ là trạng thái chọn phần tử trong mảng $nums2$ và đã chọn $count(\text{state})$ phần tử đầu tiên trong mảng $nums1$, tổng XOR nhỏ nhất có thể tạo ra.

###### 3. Công thức chuyển tiếp trạng thái

Đối với trạng thái hiện tại $dp[\text{state}]$, nó chắc chắn được tính từ trạng thái có ít hơn một phần tử được chọn. Chúng ta có thể liệt kê các trạng thái ít hơn một phần tử được chọn và tìm ra tổng XOR nhỏ nhất có thể tạo ra.

Ví dụ: $nums2 = \lbrace 1, 2, 3, 4 \rbrace$, $\text{state} = (1001)_2$, đại diện cho việc chọn phần tử thứ $1$ và thứ $4$, tức là $1$ và $4$. Khi đó, $\text{state}$ chỉ có thể chuyển từ $\text{(1000)}_2$ và $\text{(0001)}_2$, chúng ta chỉ cần duyệt qua hai trạng thái này và tìm tổng XOR nhỏ nhất.

Do đó, công thức chuyển tiếp trạng thái là: $dp[state] = min(dp[state], \quad dp[state \oplus (1 \text{ <}\text{< } i)] + (nums1[i] \oplus nums2[one\underline{}cnt - 1]))$, trong đó bit thứ $i$ của $\text{state}$ chắc chắn là $1$, $one\underline{}cnt$ là số lượng bit $1$ trong $\text{state}$.

###### 4. Điều kiện ban đầu

- Vì chúng ta đang tìm kiếm giá trị nhỏ nhất, chúng ta có thể khởi tạo tất cả các trạng thái ban đầu là giá trị lớn nhất.
- Khi chưa chọn bất kỳ phần tử nào, tổng XOR là $0$, vì vậy chúng ta khởi tạo $dp[0] = 0$.

###### 5. Kết quả cuối cùng

Dựa trên định nghĩa trạng thái, $dp[\text{state}]$ đại diện cho trạng thái chọn phần tử trong mảng $nums2$ và đã chọn $count(\text{state})$ phần tử đầu tiên trong mảng $nums1$, tổng XOR nhỏ nhất có thể tạo ra. Vì vậy, kết quả cuối cùng là $dp[\text{states} - 1]$, trong đó $\text{states} = 1 \text{ <}\text{< } n$.

##### Ý tưởng 1: Code

```python
class Solution:
    def minimumXORSum(self, nums1: List[int], nums2: List[int]) -> int:
        ans = float('inf')
        size = len(nums1)
        states = 1 << size

        dp = [float('inf') for _ in range(states)]
        dp[0] = 0
        for state in range(states):
            one_cnt = bin(state).count('1')
            for i in range(size):
                if (state >> i) & 1:
                    dp[state] = min(dp[state], dp[state ^ (1 << i)] + (nums1[i] ^ nums2[one_cnt - 1]))
        
        return dp[states - 1]
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(2^n \times n)$, trong đó $n$ là độ dài của mảng $nums1$ và $nums2$.
- **Độ phức tạp không gian**: $O(2^n)$.

### 3.2 Tổng AND lớn nhất của mảng

#### 3.2.1 Liên kết đề bài

- [2172. Maximum AND Sum of Array](https://leetcode.com/problems/maximum-and-sum-of-array/)

#### 3.2.2 Ý tưởng

**Mô tả**: Cho một mảng số nguyên $nums$ có độ dài $n$ và một số nguyên $numSlots$ thỏa mãn $2 \times numSlots \ge n$. Có tổng cộng $numSlots$ rổ, được đánh số từ $1$ đến $numSlots$.

Bây giờ, chúng ta cần phân chia tất cả $n$ số nguyên trong $nums$ vào các rổ này, với mỗi rổ tối đa chứa $2$ số nguyên.

**Yêu cầu**: Trả về tổng AND lớn nhất có thể đạt được khi đặt tất cả các số trong $nums$ vào $numSlots$ rổ.

**Giải thích**:

- **Tổng AND**: Tổng của phép AND giữa mỗi số và chỉ số rổ tương ứng.
  - Ví dụ, đặt các số $[1, 3]$ vào rổ $1$, $[4, 6]$ vào rổ $2$, tổng AND của phép AND giữa mỗi số và chỉ số rổ tương ứng là $(1 \text{ AND } 1) + (3 \text{ AND } 1) + (4 \text{ AND } 2) + (6 \text{ AND } 2) = 1 + 1 + 0 + 2 = 4$.
- $n = \text{len}(nums)$.
- $1 \leq numSlots \leq 9$.
- $1 \leq n \leq 2 \times numSlots$.
- $1 \leq nums[i] \leq 15$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums = [1,2,3,4,5,6], numSlots = 3
Output: 9
Explanation: Một phân chia hợp lệ là đặt [1, 4] vào rổ 1, [2, 6] vào rổ 2, [3, 5] vào rổ 3.
Tổng AND là (1 AND 1) + (4 AND 1) + (2 AND 2) + (6 AND 2) + (3 AND 3) + (5 AND 3) = 1 + 0 + 2 + 2 + 3 + 1 = 9.
```

- Ví dụ 2:

```python
Input: nums = [1,3,10,4,7,1], numSlots = 9
Output: 24
Explanation: Một phân chia hợp lệ là đặt [1, 1] vào rổ 1, [3] vào rổ 3, [4] vào rổ 4, [7] vào rổ 7, [10] vào rổ 9.
Tổng AND là (1 AND 1) + (1 AND 1) + (3 AND 3) + (4 AND 4) + (7 AND 7) + (10 AND 9) = 1 + 1 + 3 + 4 + 7 + 8 = 24.
Lưu ý, rổ 2, 5, 6 và 8 là rỗng, và điều này là hợp lệ.
```

#### 3.2.3 Ý tưởng giải quyết

##### Ý tưởng 1: Quy hoạch động nén trạng thái

Mỗi rổ tối đa chứa $2$ số nguyên, vì vậy chúng ta có thể chia một rổ thành hai rổ, và tổng số rổ là $2 \times numSlots$, mỗi rổ chứa tối đa $1$ số nguyên.

Do đó, chúng ta có thể sử dụng "trạng thái nén" để biểu diễn việc chọn số nguyên trong mỗi rổ.

"Trạng thái nén" là việc sử dụng một số nhị phân có $n \times numSlots$ bit để biểu diễn việc chọn số nguyên trong mỗi rổ. Nếu bit thứ $i$ của số nhị phân là $1$, điều đó có nghĩa là số nguyên thứ $i$ trong mảng $nums$ được chọn trong rổ tương ứng. Ngược lại, nếu bit thứ $i$ là $0$, điều đó có nghĩa là số nguyên thứ $i$ trong mảng $nums$ không được chọn trong rổ tương ứng.

Chúng ta có thể giải quyết bài toán này bằng cách sử dụng quy hoạch động.

###### 1. Phân chia giai đoạn

Phân chia giai đoạn dựa trên trạng thái chọn số nguyên trong mỗi rổ.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái hiện tại là $\text{state}$, trong đó $\text{state}$ đại diện cho trạng thái chọn số nguyên trong mỗi rổ và $\text{count}(\text{state})$ là số lượng số nguyên được chọn trong trạng thái đó.

Chúng ta có thể định nghĩa trạng thái $dp[\text{state}]$ như sau: $\text{state}$ là trạng thái chọn số nguyên trong mỗi rổ và đã chọn $count(\text{state})$ số nguyên đầu tiên trong mảng $nums$, tổng AND lớn nhất có thể đạt được.

###### 3. Công thức chuyển tiếp trạng thái

Đối với trạng thái hiện tại $dp[\text{state}]$, nó chắc chắn được tính từ trạng thái có ít hơn một số nguyên được chọn. Chúng ta có thể liệt kê các trạng thái ít hơn một số nguyên được chọn và tìm tổng AND lớn nhất có thể đạt được.

Ví dụ: $nums = \lbrace 1, 2, 3, 4 \rbrace$, $\text{state} = (1001)_2$, đại diện cho việc chọn số nguyên thứ $1$ và thứ $4$, tức là $1$ và $4$. Khi đó, $\text{state}$ chỉ có thể chuyển từ $\text{(1000)}_2$ và $\text{(0001)}_2$, chúng ta chỉ cần duyệt qua hai trạng thái này và tìm tổng AND lớn nhất có thể đạt được.

Do đó, công thức chuyển tiếp trạng thái là: $dp[\text{state}] = \max(dp[\text{state}], dp[\text{state} \oplus (1 \text{ <}\text{< } i)] + ((i // 2 + 1) \text{ AND } nums[one\underline{}cnt - 1]))$, trong đó:

1. Bit thứ $i$ của $\text{state}$ chắc chắn là $1$.
2. $\text{state} \oplus (1 \text{ <}\text{< } i)$ là trạng thái có ít hơn một số nguyên được chọn.
3. $i // 2 + 1$ là số thứ tự của rổ.
4. $nums[one\underline{}cnt - 1]$ là số nguyên đang xét.

###### 4. Điều kiện ban đầu

- Ban đầu, khi chưa chọn bất kỳ số nguyên nào, tổng AND lớn nhất có thể đạt được là $0$, nghĩa là $dp[0] = 0$.

###### 5. Kết quả cuối cùng

Dựa trên định nghĩa trạng thái, $dp[\text{state}]$ đại diện cho trạng thái chọn số nguyên trong mỗi rổ và đã chọn $count(\text{state})$ số nguyên đầu tiên trong mảng $nums$, tổng AND lớn nhất có thể đạt được. Vì vậy, kết quả cuối cùng là $\max(dp)$.

> Lưu ý: Khi $one\underline{}cnt > \text{len}(nums)$, không thể tính $dp[\text{state}]$ bằng cách truy hồi, vì vậy cần bỏ qua.

##### Ý tưởng 1: Code

```python
class Solution:
    def maximumANDSum(self, nums: List[int], numSlots: int) -> int:
        states = 1 << (numSlots * 2)
        dp = [0 for _ in range(states)]

        for state in range(states):
            one_cnt = bin(state).count('1')
            if one_cnt > len(nums):
                continue
            for i in range(numSlots * 2):
                if (state >> i) & 1:
                    dp[state] = max(dp[state], dp[state ^ (1 << i)] + ((i // 2 + 1) & nums[one_cnt - 1]))
        
        return max(dp)
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(2^m \times m)$, trong đó $m = 2 \times numSlots$.
- **Độ phức tạp không gian**: $O(2^m)$.
