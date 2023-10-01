---
title: Recursion
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-10-01
date modified: 2023-10-01
---

## 1. Giới thiệu đệ quy

> **Đệ quy (Recursion)**: Là một phương pháp giải quyết vấn đề bằng cách lặp lại việc chia nhỏ vấn đề gốc thành các vấn đề con cùng loại. Trong hầu hết các ngôn ngữ lập trình, đệ quy có thể được thực hiện bằng cách gọi lại chính hàm đó trong hàm.

Hãy xem xét một ví dụ đơn giản để hiểu về thuật toán đệ quy. Ví dụ tính giai thừa được định nghĩa toán học như sau:

$fact(n) =  \begin{cases} 1 & \text{n = 0} \cr n * fact(n - 1) & \text{n > 0} \end{cases}$

Dựa trên định nghĩa tính giai thừa, chúng ta có thể sử dụng cách gọi lại chính hàm đó để triển khai hàm giai thừa `fact(n)`, mã code triển khai có thể viết như sau:

```python
def fact(n):
    if n == 0:
        return 1
    return n * fact(n - 1)
```

Ví dụ với `n = 6`, quá trình tính toán hàm giai thừa `fact(6):` như sau:

```python
fact(6)
= 6 * fact(5)
= 6 * (5 * fact(4))
= 6 * (5 * (4 * fact(3)))
= 6 * (5 * (4 * (3 * fact(2))))
= 6 * (5 * (4 * (3 * (2 * fact(1)))))
= 6 * (5 * (4 * (3 * (2 * (1 * fact(0))))))
= 6 * (5 * (4 * (3 * (2 * (1 * 1)))))
= 6 * (5 * (4 * (3 * (2 * 1))))
= 6 * (5 * (4 * (3 * 2)))
= 6 * (5 * (4 * 6))
= 6 * (5 * 24)
= 6 * 120
= 720
```

Trong ví dụ trên, chúng ta có thể chia quá trình tính giai thừa thành hai phần:

1. Đầu tiên, chúng ta lặp đi lặp lại gọi hàm chính nó cho đến khi đạt đến điều kiện dừng (tức là `n == 0`).
2. Sau đó, chúng ta trả về kết quả từ lời gọi hàm con ở mức thấp nhất lên mức cao hơn cho đến khi trả về kết quả của vấn đề gốc.

Chúng ta có thể chia đệ quy thành hai phần: "quá trình đệ quy" và "quá trình quay lui".

- "Quá trình đệ quy": Đề cập đến việc chia nhỏ vấn đề gốc thành các vấn đề con cùng loại và giải quyết chúng một cách tuần tự, cho đến khi đạt đến điều kiện dừng, khi đó trả về kết quả của vấn đề con ở mức thấp nhất.
- "Quá trình quay lui": Đề cập đến việc trả về kết quả từ vấn đề con ở mức thấp nhất lên mức cao hơn cho đến khi trả về kết quả của vấn đề gốc.

## 2. Đệ quy và phương pháp suy diễn toán học

Mô hình toán học của đệ quy thực chất là "phương pháp suy diễn toán học". Hãy xem xét lại quy trình chứng minh của phương pháp suy diễn toán học:

1. Chứng minh khi $n = b$ ($b$ là trường hợp cơ bản, thường là $0$ hoặc $1$), mệnh đề đúng.
2. Chứng minh khi $n > b$, giả sử khi $n = k$ mệnh đề đúng, từ đó có thể suy ra khi $n = k + 1$ mệnh đề đúng. Bước này không phải là chứng minh trực tiếp, mà là giả sử khi $n = k$ mệnh đề đúng, sử dụng giả thuyết này, có thể suy luận ra khi $n = k + 1$ mệnh đề đúng.

Thông qua hai bước chứng minh trên, ta có thể nói: khi $n >= b$, mệnh đề đều đúng.

Chúng ta có thể giải thích đệ quy từ góc độ của phương pháp suy diễn toán học:

- **Điều kiện dừng đệ quy**: Bước đầu tiên của phương pháp suy diễn toán học là $n = b$, kết quả có thể được suy ra trực tiếp.
- **Quá trình đệ quy**: Bước thứ hai của phương pháp suy diễn toán học là giả sử khi $n = k$ mệnh đề đúng, từ đó có thể suy ra kết quả khi $n = k + 1$. Điều này có nghĩa là, dựa trên kết quả của tầng dưới, ta có thể tính toán kết quả của tầng trên.
- **Quá trình quay lui**: Bước thứ hai của phương pháp suy diễn toán học là suy ra kết quả của vấn đề gốc từ kết quả của vấn đề con.

Thực tế, quá trình suy diễn toán học cũng chính là lý do tại sao chúng ta có thể sử dụng thuật toán đệ quy để giải quyết một số bài toán dạng dãy số. Ví dụ như giai thừa, tổng của n phần tử trong mảng, dãy Fibonacci, v.v.

## 3. Ba bước để thực hiện đệ quy

Như đã đề cập ở trên, ý tưởng cơ bản của đệ quy là: **chia nhỏ vấn đề lớn thành các vấn đề con nhỏ hơn để giải quyết**. Khi viết đệ quy, chúng ta có thể tuân theo quy trình sau:

1. **Viết công thức đệ quy**: Tìm ra quy luật chia nhỏ vấn đề gốc thành các vấn đề con, và viết công thức đệ quy dựa trên quy luật đó.
2. **Xác định điều kiện dừng**: Xác định điều kiện dừng của đệ quy và cách xử lý khi đệ quy kết thúc.
3. **Dịch công thức đệ quy và điều kiện dừng thành mã code**:
   1. Định nghĩa hàm đệ quy (xác định ý nghĩa của hàm, các tham số đầu vào và kết quả trả về, v.v.).
   2. Viết phần thân của hàm đệ quy (trích xuất các phần logic lặp lại, giảm kích thước của vấn đề).
   3. Xác định điều kiện dừng của đệ quy (đưa ra điều kiện dừng đệ quy và cách xử lý khi đạt đến điều kiện đó).

### 3.1 Viết công thức đệ quy

Viết công thức đệ quy là tìm ra quy luật phân rã vấn đề gốc thành các vấn đề con và trừu tượng hóa chúng thành công thức đệ quy.

Khi suy nghĩ về logic đệ quy, chúng ta không cần phải suy nghĩ từng bước của quá trình đệ quy và quay lui từng bước một trong đầu. Có thể chúng ta chưa đệ quy đến đáy ngăn xếp, nhưng trí óc đã bị mơ hồ trước đó.

Trong ví dụ về giai thừa đã được giải thích trước đó, một vấn đề chỉ cần phân rã thành một vấn đề con, chúng ta dễ dàng hiểu được từng bước của "quá trình đệ quy" và "quá trình quay lui".

Nhưng khi chúng ta đối mặt với một vấn đề cần phân rã thành nhiều vấn đề con, không dễ dàng hiểu từng bước của "quá trình đệ quy" và "quá trình quay lui".

Vậy chúng ta nên suy nghĩ như thế nào về "quá trình đệ quy" và "quá trình quay lui", và làm thế nào để viết công thức đệ quy?

Nếu một vấn đề A có thể phân rã thành nhiều vấn đề con B, C, D có cùng cấu trúc với vấn đề gốc, thì các vấn đề con này có thể được giải quyết bằng cùng một phương pháp giải quyết. Chúng ta có thể giả định rằng B, C, D đã được giải quyết và chỉ cần xem xét làm thế nào để giải quyết vấn đề A trên cơ sở đó. Không cần phải suy nghĩ từng bước từ vấn đề con đến vấn đề con con, vấn đề con con đến vấn đề con con con. Điều này giúp việc hiểu đơn giản hơn.

Từ vấn đề A đến quá trình phân rã thành vấn đề con B, C, D thực chất là "quá trình đệ quy". Từ giải pháp của vấn đề con B, C, D quay lui giải pháp của vấn đề A thực chất là "quá trình quay lui". Nếu hiểu rõ "làm thế nào để phân rã vấn đề con" và "làm thế nào để giải quyết vấn đề gốc dựa trên vấn đề con", chúng ta đã hiểu rõ "quá trình đệ quy" và "quá trình quay lui" của đệ quy.

Sau đó, chúng ta chỉ cần xem xét mối quan hệ giữa vấn đề gốc và vấn đề con, chúng ta có thể viết công thức đệ quy trên cơ sở đó.

### 3.2 Xác định điều kiện dừng

Điều kiện dừng của đệ quy cũng được gọi là điểm dừng. Sau khi viết công thức đệ quy, chúng ta cần xác định điều kiện dừng của đệ quy và cách xử lý khi đệ quy kết thúc.

Nếu không có điều kiện dừng của đệ quy, hàm sẽ tiếp tục đệ quy mà không bao giờ kết thúc, và chương trình sẽ bị lỗi và dừng hoạt động. Thông thường, điều kiện dừng của đệ quy là giá trị biên của vấn đề.

Khi xác định điều kiện dừng, chúng ta nên cung cấp cách xử lý khi đạt đến điều kiện dừng. Thông thường, trong tình huống này, giải pháp cho vấn đề là rõ ràng và dễ dàng. Ví dụ, trong giai thừa, `fact(0) = 1`. Trong dãy Fibonacci, `f(1) = 1, f(2) = 2`.

### 3.3 Dịch công thức đệ quy và điều kiện dừng thành mã code

Sau khi viết công thức đệ quy và xác định điều kiện dừng, chúng ta có thể dịch chúng thành mã code. Bước này cũng có thể được chia thành 3 bước:

1. **Định nghĩa hàm đệ quy**: Xác định ý nghĩa của hàm đệ quy, các tham số đầu vào và kết quả trả về, v.v.
2. **Viết phần thân của hàm đệ quy**: Trích xuất các phần logic lặp lại, giảm kích thước của vấn đề.
3. **Xác định điều kiện dừng của đệ quy**: Đưa ra điều kiện dừng đệ quy và cách xử lý khi đạt đến điều kiện đó.

#### 3.3.1 Định nghĩa hàm đệ quy

Khi định nghĩa hàm đệ quy, chúng ta phải rõ ràng về ý nghĩa của hàm đệ quy, tức là hiểu rõ các tham số được truyền vào và kết quả cuối cùng cần giải quyết vấn đề gì.

Ví dụ, hàm giai thừa `fact(n)`, tham số được truyền vào của hàm này là kích thước của vấn đề `n`, và kết quả cuối cùng trả về là giá trị giai thừa của `n`.

#### 3.3.2 Viết phần thân của hàm đệ quy

Sau khi phân chia vấn đề gốc thành các vấn đề con và dựa trên mối quan hệ giữa vấn đề gốc và vấn đề con, chúng ta có thể suy luận được công thức đệ quy tương ứng. Sau đó, dựa trên công thức đệ quy, chúng ta có thể chuyển đổi thành phần thân của đệ quy.

#### 3.3.3 Xác định điều kiện dừng của đệ quy

Bước này thực chất là chuyển đổi các điều kiện dừng đệ quy và cách xử lý tương ứng trong "3.2 Xác định điều kiện dừng" thành các câu lệnh điều kiện và câu lệnh thực hiện tương ứng trong code.

#### 3.3.4 Code đệ quy

Dựa trên các bước viết đệ quy trên, chúng ta có thể viết Code của thuật toán đệ quy. Code đệ quy như sau:

```python
def recursion(large_problem):
    if base_case:
        base_case_handling
    
    return recursion(small_problem)
```

## 4. Những điểm cần lưu ý khi sử dụng đệ quy

### 4.1 Tránh tràn ngăn xếp

Trong quá trình thực thi chương trình, đệ quy được thực hiện bằng cách sử dụng ngăn xếp. Mỗi lần đệ quy đều cần một không gian ngăn xếp để lưu trữ các bản ghi gọi hàm. Mỗi khi gọi một hàm, một khung ngăn xếp mới được thêm vào. Mỗi khi trở lại từ một hàm, một khung ngăn xếp sẽ bị loại bỏ. Vì không gian ngăn xếp trong hệ thống không vô hạn, nếu số lần gọi đệ quy quá nhiều, có thể gây ra tràn ngăn xếp.

Để tránh tràn ngăn xếp, chúng ta có thể giới hạn độ sâu tối đa của đệ quy bằng cách đặt một giới hạn cho số lần gọi đệ quy. Khi số lần gọi đệ quy vượt quá giới hạn này (ví dụ: 100), chúng ta không tiếp tục đệ quy nữa mà trả về một thông báo lỗi.

Tuy nhiên, cách làm này không thể hoàn toàn tránh được tràn ngăn xếp và không thể giải quyết tất cả các vấn đề, vì số lần gọi đệ quy tối đa phụ thuộc vào không gian ngăn xếp còn lại trong hệ thống, mà không thể tính toán trước.

Nếu việc sử dụng đệ quy không thể giải quyết vấn đề, chúng ta có thể xem xét chuyển đổi thuật toán đệ quy thành thuật toán không đệ quy (tức là thuật toán lặp) để giải quyết vấn đề tràn ngăn xếp.

### 4.2 Tránh tính toán trùng lặp

Khi sử dụng thuật toán đệ quy, có thể xảy ra vấn đề tính toán trùng lặp.

Ví dụ, định nghĩa dãy Fibonacci như sau:

$f(n) = \begin{cases} 0 & n = 0 \cr 1 & n = 1 \cr f(n - 2) + f(n - 1) & n > 1 \end{cases}$

Quá trình đệ quy tương ứng với định nghĩa trên được minh họa trong hình sau:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230307164107.png)

Từ hình, chúng ta có thể thấy: để tính toán $f(5)$, chúng ta cần tính toán $f(3)$ và $f(4)$ trước, và khi tính toán $f(4)$, chúng ta cần tính toán $f(3)$ một lần nữa. Điều này dẫn đến việc tính toán $f(3)$ nhiều lần. Tương tự, $f(0)$, $f(1)$ và $f(2)$ cũng được tính toán nhiều lần, dẫn đến vấn đề tính toán trùng lặp.

Để tránh tính toán trùng lặp, chúng ta có thể sử dụng một bộ nhớ đệm (bảng băm, tập hợp hoặc mảng) để lưu trữ các giá trị $f(k)$ đã được tính toán trước đó. Khi đệ quy gọi đến $f(k)$, trước tiên kiểm tra xem đã tính toán kết quả trước đó chưa. Nếu đã tính toán, chỉ cần lấy giá trị từ bộ nhớ đệm và trả về, thay vì tiếp tục đệ quy xuống. Điều này giúp tránh tính toán trùng lặp.

## 5. Ứng dụng của đệ quy

### 5.1 Dãy Fibonacci

#### 5.1.1 Liên kết đề bài

- [509. Fibonacci Number - LeetCode](https://leetcode.com/problems/fibonacci-number/)

#### 5.1.2 Ý nghĩa đề bài

**Mô tả**: Cho một số nguyên `n`.

**Yêu cầu**: Tính toán số Fibonacci thứ `n`.

**Giải thích**:

- Dãy Fibonacci được định nghĩa như sau:
  - `f(0) = 0, f(1) = 1`.
  - `f(n) = f(n - 1) + f(n - 2)`, với `n > 1`.

**Ví dụ**:

- Ví dụ 1:

```python
Input: n = 2
Output: 1
Explanation: F(2) = F(1) + F(0) = 1 + 0 = 1
```

- Ví dụ 2:

```python
Input: n = 3
Output: 2
Explanation: F(3) = F(2) + F(1) = 1 + 1 = 2
```

#### 5.1.3 Ý tưởng giải quyết

##### Ý tưởng 1: Thuật toán đệ quy

Dựa trên chiến lược ba bước đệ quy của chúng ta, viết mã đệ quy tương ứng.

1. Viết công thức đệ quy: `f(n) = f(n - 1) + f(n - 2)`.
2. Xác định điều kiện dừng đệ quy: `f(0) = 0, f(1) = 1`.
3. Chuyển đổi thành mã đệ quy:
   1. Định nghĩa hàm đệ quy: `fib(self, n)` đại diện cho tham số đầu vào là kích thước của vấn đề `n`, và trả về kết quả là số Fibonacci thứ `n`.
   2. Viết phần chính của đệ quy: `return self.fib(n - 1) + self.fib(n - 2)`.
   3. Xác định điều kiện dừng đệ quy:
      1. `if n == 0: return 0`
      2. `if n == 1: return 1`

##### Ý tưởng 1: Code

```python
class Solution:
    def fib(self, n: int) -> int:
        if n == 0:
            return 0
        if n == 1:
            return 1
        return self.fib(n - 1) + self.fib(n - 2)
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O((\frac{1 + \sqrt{5}}{2})^n)$.
- **Độ phức tạp không gian**: $O(n)$. Độ phức tạp không gian của mỗi lần đệ quy là $O(1)$, độ sâu của ngăn xếp gọi là $n$, do đó tổng độ phức tạp không gian là $O(n)$.

### 5.2 Độ sâu tối đa của cây nhị phân

#### 5.2.1 Liên kết đề bài

- [104. Maximum Depth of Binary Tree - LeetCode](https://leetcode.com/problems/maximum-depth-of-binary-tree/)

#### 5.2.2 Ý nghĩa đề bài

**Mô tả**: Cho một nút gốc của cây nhị phân `root`.

**Yêu cầu**: Tìm độ sâu tối đa của cây nhị phân đó.

**Giải thích**:

- **Độ sâu của cây nhị phân**: Số lượng nút từ nút gốc đến nút lá xa nhất trên đường đi dài nhất.
- **Nút lá**: Nút không có nút con.

**Ví dụ**:

- Ví dụ 1:

```python
Input: [3,9,20,null,null,15,7]
Corresponding binary tree:
            3
           / \
          9  20
            /  \
           15   7
Output: 3
Explanation: Độ sâu tối đa của cây nhị phân này là 3
```

#### 5.2.3 Ý tưởng giải quyết

##### Ý tưởng 1: Thuật toán đệ quy

Dựa trên chiến lược ba bước đệ quy của chúng ta, viết mã đệ quy tương ứng.

1. Viết công thức đệ quy: `Độ sâu tối đa của cây nhị phân hiện tại = max(Độ sâu tối đa của cây nhị phân con bên trái, Độ sâu tối đa của cây nhị phân con bên phải) + 1`.
   - Tức là: Đầu tiên tính toán độ sâu của cây con bên trái và cây con bên phải, sau đó tính toán độ sâu của nút hiện tại.
2. Xác định điều kiện dừng đệ quy: Cây nhị phân hiện tại là rỗng.
3. Chuyển đổi thành mã đệ quy:
   1. Định nghĩa hàm đệ quy: `maxDepth(self, root)` đại diện cho tham số đầu vào là nút gốc của cây nhị phân `root`, và trả về kết quả là độ sâu tối đa của cây nhị phân đó.
   2. Viết phần chính của đệ quy: `return max(self.maxDepth(root.left), self.maxDepth(root.right)) + 1`.
   3. Xác định điều kiện dừng đệ quy: `if not root: return 0`.

##### Ý tưởng 1: Code

```python
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        
        return max(self.maxDepth(root.left), self.maxDepth(root.right)) + 1
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$, trong đó $n$ là số lượng nút trong cây nhị phân.
- **Độ phức tạp không gian**: $O(n)$. Hàm đệ quy cần sử dụng không gian ngăn xếp, không gian ngăn xếp phụ thuộc vào độ sâu đệ quy, trong trường hợp xấu nhất độ sâu đệ quy là $n$, do đó độ phức tạp không gian là $O(n)$.
