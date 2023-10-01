---
title: Enumeration
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-10-01
date modified: 2023-10-01
---

## 1. Giới thiệu về thuật toán liệt kê

> **Thuật toán liệt kê** (Enumeration Algorithm): còn được gọi là thuật toán duyệt tất cả các trường hợp, là phương pháp liệt kê tất cả các giải pháp có thể của một vấn đề dựa trên tính chất của vấn đề đó. Trong quá trình liệt kê, thuật toán so sánh từng trường hợp với trạng thái mục tiêu để tìm ra các giải pháp thỏa mãn yêu cầu của vấn đề. Trong quá trình liệt kê, không được bỏ sót hoặc lặp lại các trường hợp.

Ý tưởng cốt lõi của thuật toán liệt kê là: thông qua việc liệt kê tất cả các trạng thái của vấn đề, so sánh từng trạng thái đó với trạng thái mục tiêu để tìm ra các giải pháp thỏa mãn điều kiện.

Do thuật toán liệt kê cần liệt kê tất cả các trạng thái của vấn đề để tìm ra các giải pháp thỏa mãn, nên hiệu suất của thuật toán này thường khá thấp khi kích thước của vấn đề tăng lên. Tuy nhiên, thuật toán liệt kê cũng có những ưu điểm riêng:

1. Trong hầu hết các trường hợp, thuật toán liệt kê dễ triển khai và dễ gỡ lỗi.
2. Dựa trên việc xem xét nhiều trạng thái, thậm chí là liệt kê tất cả các trạng thái có thể, nên việc chứng minh tính chính xác của thuật toán cũng khá dễ dàng.

Vì vậy, thuật toán liệt kê thường được sử dụng để giải quyết các vấn đề có kích thước nhỏ hoặc được sử dụng như một phần của thuật toán chính để liệt kê một số thông tin và lưu trữ những thông tin đó, và sự có hay không của thông tin đó ảnh hưởng đáng kể đến hiệu suất của thuật toán chính.

## 2. Phương pháp giải quyết bài toán bằng thuật toán liệt kê

### 2.1 Phương pháp giải quyết bài toán bằng thuật toán liệt kê

Thuật toán liệt kê là một trong những thuật toán tìm kiếm đơn giản nhất và cơ bản nhất. Đây là thuật toán mà chúng ta nên xem xét đầu tiên khi gặp phải một vấn đề.

Vì cài đặt của nó đơn giản đến mức chúng ta thường có thể thử nghiệm giải quyết vấn đề bằng thuật toán liệt kê trước, sau đó dựa trên kết quả đó, chúng ta có thể xem xét các phương pháp tối ưu hóa và cách tiếp cận khác.

Có thể tóm tắt phương pháp giải quyết bài toán bằng thuật toán liệt kê như sau:

1. Xác định đối tượng liệt kê, phạm vi liệt kê và điều kiện kiểm tra, và kiểm tra tính đúng đắn của điều kiện đó.
2. Liệt kê từng trường hợp có thể và kiểm tra xem trạng thái hiện tại có phải là giải pháp của vấn đề không.
3. Xem xét cách tăng cường hiệu suất của thuật toán liệt kê.

Chúng ta có thể cải thiện hiệu suất của thuật toán bằng cách xem xét các yếu tố sau:

1. Nắm bắt bản chất của trạng thái vấn đề và giảm kích thước không gian trạng thái càng nhiều càng tốt.
2. Tăng cường các điều kiện ràng buộc để giới hạn phạm vi liệt kê.
3. Dựa trên một số đặc điểm đặc biệt của vấn đề, chẳng hạn như tính đối xứng, tránh việc tính toán lại các trạng thái cùng bản chất.

### 2.2 Ứng dụng đơn giản của thuật toán liệt kê

Dưới đây là một ví dụ nổi tiếng: "Bài toán mua gà với 100 đồng". Đây là một bài toán được đưa ra bởi nhà toán học Trung Quốc cổ đại Trương Khiếu trong cuốn sách "Toán kinh". Bài toán được mô tả như sau:

> **Bài toán mua gà với 100 đồng**: Một con gà trống có giá 5 đồng, một con gà mái có giá 3 đồng và ba con gà con có giá 1 đồng. Nếu có 100 đồng, hỏi mua được bao nhiêu con gà trống, mái và con gà con?

Dịch sang tiếng Việt, ý nghĩa của bài toán là: một con gà trống có giá 5 đồng, một con gà mái có giá 3 đồng và ba con gà con có giá 1 đồng. Giả sử chúng ta có 100 đồng, hỏi có thể mua được bao nhiêu con gà trống, mái và con gà con?

Dưới đây chúng ta sẽ giải quyết bài toán này dựa trên phương pháp tổng quát của thuật toán liệt kê.

1. Xác định đối tượng liệt kê, phạm vi liệt kê và điều kiện kiểm tra, và kiểm tra tính đúng đắn của điều kiện đó.
   1. Xác định đối tượng liệt kê: Đối tượng liệt kê là số lượng gà trống, gà mái và gà con. Chúng ta có thể sử dụng các biến $x$, $y$, $z$ để đại diện cho số lượng gà trống, gà mái và gà con.
   2. Xác định phạm vi liệt kê: Vì đã mua tổng cộng 100 con gà, nên $0 \le x, y, z \le 100$, do đó phạm vi liệt kê của $x$, $y$, $z$ là $[0, 100]$.
   3. Xác định điều kiện kiểm tra: Dựa trên yêu cầu của bài toán, chúng ta có thể lập ra hai phương trình: $5 \times x + 3 \times y + \frac{z}{3} = 100$ và $x + y + z = 100$. Trong quá trình liệt kê $x$, $y$, $z$, chúng ta có thể sử dụng hai phương trình này để kiểm tra xem trạng thái hiện tại có thỏa mãn yêu cầu của bài toán không.
2. Liệt kê từng trường hợp có thể và kiểm tra xem trạng thái hiện tại có phải là giải pháp của vấn đề không.
   1. Dựa trên đối tượng liệt kê, phạm vi liệt kê và điều kiện kiểm tra đã xác định, chúng ta có thể viết mã tương ứng.

      ```python
      class Solution:
          def buyChicken(self):
              for x in range(101):
                  for y in range(101):
                      for z in range(101):
                          if z % 3 == 0 and 5 * x + 3 * y + z // 3 == 100 and x + y + z == 100:
                              print("Gà trống %s con, gà mái %s con, gà con %s con" % (x, y, z))
      ```

3. Xem xét cách tăng cường hiệu suất của thuật toán liệt kê.
   1. Trong mã trên, chúng ta đã liệt kê $x$, $y$, $z$, nhưng thực tế theo phương trình $x + y + z = 100$, ta có thể tính được $z = 100 - x - y$, từ đó ta không cần phải liệt kê $z$ nữa.
   2. Trong mã trên, phạm vi liệt kê cho $x$ và $y$ là $[0, 100]$, nhưng thực tế nếu hết tiền mua gà trống, ta chỉ có thể mua tối đa 20 con, tương tự, nếu hết tiền mua gà mái, ta chỉ có thể mua tối đa 33 con. Vì vậy, phạm vi liệt kê cho $x$ có thể được thay đổi thành $[0, 20]$, phạm vi liệt kê cho $y$ có thể được thay đổi thành $[0, 33]$.

   ```python
   class Solution:
       def buyChicken(self):
           for x in range(21):
               for y in range(34):
                   z = 100 - x - y
                   if z % 3 == 0 and 5 * x + 3 * y + z // 3 == 100:
                       print("Gà trống %s con, gà mái %s con, gà con %s con" % (x, y, z))
   ```

## 3. Ứng dụng của thuật toán liệt kê

### 3.1 Tổng của hai số

#### 3.1.1 Liên kết đề bài

- [1. Two Sum](https://leetcode.com/problems/two-sum/)

#### 3.1.2 Tóm tắt đề bài

**Mô tả**: Cho một mảng số nguyên `nums` và một giá trị mục tiêu `target`.

**Yêu cầu**: Tìm hai số trong mảng có tổng bằng `target` và trả về chỉ số của hai số đó. Có thể trả về kết quả theo bất kỳ thứ tự nào.

**Giải thích**:

- $2 \le \text{len(nums)} \le 10^4$.
- $-10^9 \le \text{nums[i]} \le 10^9$.
- $-10^9 \le \text{target} \le 10^9$.
- Chỉ có một kết quả hợp lệ.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Vì nums[0] + nums[1] == 9, nên trả về [0, 1].
```

- Ví dụ 2:

```python
Input: nums = [3,2,4], target = 6
Output: [1,2]
```

#### 3.1.3 Ý tưởng giải quyết

Ở đây, tôi sẽ giải thích ý tưởng của thuật toán liệt kê.

##### Ý tưởng 1: Thuật toán liệt kê

1. Sử dụng hai vòng lặp lồng nhau để liệt kê từng số `nums[i]`, `nums[j]` trong mảng và kiểm tra xem `nums[i] + nums[j]` có bằng `target` hay không.
2. Nếu có `nums[i] + nums[j] == target`, thì có nghĩa là trong mảng có hai số có tổng bằng `target`, trả về chỉ số `i`, `j` của hai số đó.

##### Ý tưởng 1: Code

```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if i != j and nums[i] + nums[j] == target:
                    return [i, j]
        return []
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n^2)$
- **Độ phức tạp không gian**: $O(1)$

### 3.2 Đếm số nguyên tố

#### 3.2.1 Liên kết đề bài

- [204. Count Primes](https://leetcode.com/problems/count-primes/)

#### 3.2.2 Tóm tắt đề bài

**Mô tả**: Cho một số nguyên không âm $n$.

**Yêu cầu**: Đếm số lượng số nguyên tố nhỏ hơn $n$.

**Giải thích**:

- $0 \le n \le 5 * 10^6$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: n = 10
Output: 4
Explanation: Có tổng cộng 4 số nguyên tố nhỏ hơn 10, đó là 2, 3, 5, 7.
```

- Ví dụ 2:

```python
Input: n = 1
Output: 0
```

#### 3.2.3 Ý tưởng giải quyết

Ở đây, tôi sẽ giải thích ý tưởng của thuật toán liệt kê (lưu ý: sẽ bị vượt quá thời gian chạy, chỉ giải thích ý tưởng của thuật toán liệt kê).

##### Ý tưởng 1: Thuật toán liệt kê (vượt quá thời gian chạy)

Đối với mỗi số $x$ nhỏ hơn $n$ , chúng ta có thể liệt kê từng số trong khoảng $[2, x - 1]$ để kiểm tra xem số đó có phải là ước của $x$ hay không, tức là có thể chia hết cho $x$ hay không. Nếu có, thì số $x$ không phải là số nguyên tố. Nếu không, thì số $x$ là số nguyên tố.

Chúng ta có thể kiểm tra xem số $x$ có phải là số nguyên tố bằng cách liệt kê từng số trong khoảng $[2, \sqrt x]$ và kiểm tra xem số đó có phải là ước của $x$ hay không.

Sử dụng thuật toán liệt kê, thời gian kiểm tra một số duy nhất là $O(\sqrt{n})$, thời gian kiểm tra $n$ số là $O(n \sqrt{n})$.

##### Ý tưởng 1: Code

```python
class Solution:
    def isPrime(self, x):
        for i in range(2, int(pow(x, 0.5)) + 1):
            if x % i == 0:
                return False
        return True

    def countPrimes(self, n: int) -> int:
        cnt = 0
        for x in range(2, n):
            if self.isPrime(x):
                cnt += 1
        return cnt
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times \sqrt{n})$.
- **Độ phức tạp không gian**: $O(1)$.

### 3.3 Đếm số lượng bộ ba tổng bình phương

#### 3.3.1 Liên kết đề bài

- [1925. Count Square Sum Triples](https://leetcode.com/problems/count-square-sum-triples/)

#### 3.3.2 Tóm tắt đề bài

**Mô tả**: Cho một số nguyên $n$.

**Yêu cầu**: Hãy trả về số lượng bộ ba $(a, b, c)$ sao cho $1 \le a, b, c \le n$ và $a^2 + b^2 = c^2$.

**Giải thích**:

- **Bộ ba tổng bình phương**: Đề cập đến bộ ba số nguyên $(a, b, c)$ thỏa mãn $a^2 + b^2 = c^2$.
- $1 \le n \le 250$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: n = 5
Output: 2
Explanation: Có tổng cộng 2 bộ ba tổng bình phương là (3,4,5) và (4,3,5).
```

- Ví dụ 2:

```python
Input: n = 10
Output: 4
Explanation: Có tổng cộng 4 bộ ba tổng bình phương là (3,4,5), (4,3,5), (6,8,10) và (8,6,10).
```

#### 3.3.3 Ý tưởng giải quyết

Ở đây, tôi sẽ giải thích ý tưởng của thuật toán liệt kê.

##### Ý tưởng 1: Thuật toán liệt kê

Chúng ta có thể liệt kê các số nguyên $a$ và $b$ trong khoảng $[1, n]$ và kiểm tra xem $a^2 + b^2$ có nhỏ hơn hoặc bằng $n$ và là một số bình phương hoàn chỉnh hay không.

Trong quá trình liệt kê, chúng ta duy trì một biến `cnt` để đếm số lượng bộ ba tổng bình phương. Nếu thỏa mãn yêu cầu, chúng ta tăng biến đếm `cnt` lên $1$. Cuối cùng, chúng ta trả về giá trị đếm đó làm kết quả.

Thời gian kiểm tra một số duy nhất trong thuật toán liệt kê là $O(\sqrt{n})$, thời gian kiểm tra $n$ số là $O(n \sqrt{n})$.

##### Ý tưởng 1: Code

```python
class Solution:
    def countTriples(self, n: int) -> int:
        cnt = 0
        for a in range(1, n + 1):
            for b in range(1, n + 1):
                c = int(sqrt(a * a + b * b + 1))
                if c <= n and a * a + b * b == c * c:
                    cnt += 1
        return cnt
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n^2)$.
- **Độ phức tạp không gian**: $O(1)$.
