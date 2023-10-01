---
title: Two Pointers
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-09-27
date modified: 2023-09-27
---

## 1. Giới thiệu về Con trỏ kép

> **Con trỏ kép (Two Pointers)**: Đề cập đến việc sử dụng hai con trỏ để truy cập các phần tử trong quá trình duyệt, thay vì sử dụng một con trỏ duy nhất, từ đó đạt được mục đích tương ứng. Nếu hai con trỏ có hướng ngược nhau, thì được gọi là "con trỏ đối nghịch". Nếu hai con trỏ có cùng hướng, thì được gọi là "con trỏ nhanh/chậm". Nếu hai con trỏ thuộc hai mảng/ danh sách khác nhau, thì được gọi là "con trỏ tách rời".

Trong các vấn đề về khoảng của mảng, độ phức tạp thời gian của thuật toán brute force thường là $O(n^2)$. Tuy nhiên, con trỏ kép sử dụng tính chất "đơn điệu" của khoảng để giảm độ phức tạp thời gian xuống $O(n)$.

## 2. Con trỏ đối nghịch

> **Con trỏ đối nghịch**: Đề cập đến hai con trỏ $left$ và $right$ lần lượt trỏ đến phần tử đầu tiên và phần tử cuối cùng của chuỗi, sau đó $left$ tăng dần và $right$ giảm dần, cho đến khi hai con trỏ có giá trị bằng nhau (tức là $left == right$), hoặc đáp ứng các điều kiện đặc biệt khác.

![Con trỏ đối nghịch](https://qcdn.itcharge.cn/images/20230906165407.png)

### 2.1 Bước giải bằng con trỏ đối nghịch

1. Sử dụng hai con trỏ $left$ và $right$. $left$ trỏ đến phần tử đầu tiên của chuỗi, tức là $left = 0$, $right$ trỏ đến phần tử cuối cùng của chuỗi, tức là $right = len(nums) - 1$.
2. Trong vòng lặp, di chuyển hai con trỏ theo chiều ngược nhau. Khi đáp ứng một số điều kiện, di chuyển con trỏ trái sang phải, $left += 1$. Khi đáp ứng một số điều kiện khác, di chuyển con trỏ phải sang trái, $right -= 1$.
3. Cho đến khi hai con trỏ gặp nhau (tức là $left == right$), hoặc đáp ứng các điều kiện đặc biệt khác, thoát khỏi vòng lặp.

### 2.2 Mẫu Code cho con trỏ đối nghịch

```python
left, right = 0, len(nums) - 1

while left < right:
    if đáp ứng điều kiện đặc biệt:
        return giá trị thỏa mãn điều kiện
    elif đáp ứng điều kiện 1:
        left += 1
    elif đáp ứng điều kiện 2:
        right -= 1

return không tìm thấy hoặc tìm thấy giá trị tương ứng
```

### 2.3 Phạm vi áp dụng của con trỏ đối nghịch

Con trỏ đối nghịch thường được sử dụng để giải quyết các vấn đề về mảng hoặc chuỗi đã được sắp xếp:

- Tìm kiếm một tập hợp các phần tử thỏa mãn một số ràng buộc trong mảng đã sắp xếp: ví dụ như tìm kiếm nhị phân, tổng các số, v.v.
- Giải quyết các vấn đề về đảo ngược chuỗi: đảo ngược chuỗi, số Palindrome, đảo ngược nhị phân, v.v.

Dưới đây, chúng ta sẽ giải thích cách sử dụng con trỏ đối nghịch để giải quyết các vấn đề cụ thể.

### 2.4 Tổng hai số II - Mảng đã sắp xếp

#### 2.4.1 Liên kết đề bài

- [167. Tổng hai số II - Mảng đã sắp xếp - LeetCode](https://leetcode-cn.com/problems/two-sum-ii-input-array-is-sorted/)

#### 2.4.2 Ý tưởng

**Mô tả**: Cho một mảng số nguyên $numbers$ được sắp xếp theo thứ tự tăng dần và một giá trị mục tiêu $target$.

**Yêu cầu**: Tìm hai số trong mảng có tổng bằng $target$ và trả về chỉ số của hai số đó trong mảng.

**Giải thích**:

- $2 \leq numbers.length \leq 3 * 10^4$.
- $-1000 \leq numbers[i] \leq 1000$.
- $numbers$ được sắp xếp theo thứ tự không giảm.
- $-1000 \leq target \leq 1000$.
- Chỉ có một cặp số thỏa mãn yêu cầu.

**Ví dụ**:

- Ví dụ 1:

```python
Input: numbers = [2,7,11,15], target = 9
Output: [1,2]
Explanation: 2 + 7 = 9. Vì vậy, chỉ số của hai số là 1 và 2.
```

- Ví dụ 2:

```python
Input: numbers = [2,3,4], target = 6
Output: [1,3]
Explanation: 2 + 4 = 6. Vì vậy, chỉ số của hai số là 1 và 3.
```

#### 2.4.3 Ý tưởng giải quyết

Nếu ta duyệt qua từng cặp số trong mảng và kiểm tra xem tổng của chúng có bằng $target$ hay không, thì độ phức tạp thời gian sẽ là $O(n^2)$. Ta có thể sử dụng con trỏ đối nghịch để giảm độ phức tạp thời gian xuống $O(n)$.

##### Ý tưởng 1: Con trỏ đối nghịch

Ta có thể sử dụng hai con trỏ $left$ và $right$ để giải quyết bài toán này. Cụ thể như sau:

1. Đặt hai con trỏ $left$ và $right$. $left$ trỏ đến phần tử đầu tiên của mảng, tức là $left = 0$, $right$ trỏ đến phần tử cuối cùng của mảng, tức là $right = len(numbers) - 1$.
2. Kiểm tra tổng của hai phần tử tại vị trí $left$ và $right$.
   - Nếu tổng bằng $target$, trả về [left + 1, right + 1].
   - Nếu tổng lớn hơn $target$, di chuyển con trỏ $right$ sang trái.
   - Nếu tổng nhỏ hơn $target$, di chuyển con trỏ $left$ sang phải.
3. Lặp lại bước 2 cho đến khi hai con trỏ gặp nhau (tức là $left == right$) hoặc không tìm thấy cặp số thỏa mãn yêu cầu.
4. Nếu không tìm thấy, trả về [-1, -1].

##### Ý tưởng 1: Code

```python
class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        left = 0
        right = len(numbers) - 1
        while left < right:
            total = numbers[left] + numbers[right]
            if total == target:
                return [left + 1, right + 1]
            elif total < target:
                left += 1
            else:
                right -= 1
        return [-1, -1]
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$.
- **Độ phức tạp không gian**: $O(1)$. Chỉ sử dụng một số biến để lưu trữ.

### 2.5 Xác định xâu đối xứng

#### 2.5.1 Liên kết đề bài

- [125. Xác định xâu đối xứng - LeetCode](https://leetcode.com/problems/valid-palindrome/)

#### 2.5.2 Ý tưởng

**Mô tả**: Cho một xâu ký tự $s$.

**Yêu cầu**: Kiểm tra xem xâu có phải là xâu đối xứng hay không (chỉ xem xét các ký tự chữ cái và số trong xâu và bỏ qua sự khác biệt về chữ hoa và chữ thường).

**Giải thích**:

- Xâu đối xứng: Xâu có thể đọc từ trái sang phải và từ phải sang trái mà không thay đổi nghĩa.
- $1 \leq s.length \leq 2 * 10^5$.
- $s$ chỉ chứa các ký tự ASCII in được.

**Ví dụ**:

```python
Input: "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" là xâu đối xứng.


Input: "race a car"
Output: false
Explanation: "raceacar" không phải là xâu đối xứng.
```

#### 2.5.3 Ý tưởng giải quyết

##### Ý tưởng 1: Con trỏ đối nghịch

1. Sử dụng hai con trỏ $left$ và $right$. $left$ trỏ đến vị trí đầu tiên của xâu, tức là $left = 0$, $right$ trỏ đến vị trí cuối cùng của xâu, tức là $right = len(s) - 1$.
2. Kiểm tra xem hai ký tự tại vị trí $left$ và $right$ có phải là chữ cái hoặc số không. Bằng cách di chuyển $left$ sang phải và $right$ sang trái, loại bỏ các ký tự khác chữ cái và số.
3. Kiểm tra xem $s[left]$ có bằng $s[right]$ hay không (lưu ý không phân biệt chữ hoa và chữ thường).

   - Nếu bằng nhau, di chuyển $left$ sang phải và $right$ sang trái, tiếp tục kiểm tra.
   - Nếu không bằng nhau, thì xâu không phải là xâu đối xứng, trả về $False$.

4. Nếu $left$ và $right$ gặp nhau (tức là $left == right$), thoát khỏi vòng lặp, xâu là xâu đối xứng, trả về $True$.

##### Ý tưởng 1: Code

```python
class Solution:
    def isPalindrome(self, s: str) -> bool:
        left = 0
        right = len(s) - 1
        
        while left < right:
            if not s[left].isalnum():
                left += 1
                continue
            if not s[right].isalnum():
                right -= 1
                continue
            
            if s[left].lower() == s[right].lower():
                left += 1
                right -= 1
            else:
                return False
        return True
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(len(s))$.
- **Độ phức tạp không gian**: $O(len(s))$.

### 2.6 Đựng nước nhiều nhất trong một khung

#### 2.6.1 Liên kết đề bài

- [11. Đựng nước nhiều nhất trong một khung - LeetCode](https://leetcode-cn.com/problems/container-with-most-water/)

#### 2.6.2 Ý tưởng

**Mô tả**: Cho $n$ số nguyên không âm $a_1, a_2, …, a_n$, mỗi số đại diện cho một điểm $(i, a_i)$ trên hệ tọa độ. Vẽ $n$ đoạn thẳng đứng trong hệ tọa độ, đoạn thẳng thứ $i$ có hai đầu mút lần lượt là $(i, a_i)$ và $(i, 0)$.

**Yêu cầu**: Tìm hai đoạn thẳng trong số đó sao cho chúng cùng với trục $x$ tạo thành một khung có thể chứa nhiều nước nhất.

**Giải thích**:

- $n == height.length$.
- $2 \leq n \leq 10^5$.
- $0 \leq height[i] \leq 10^4$.

**Ví dụ**:

![](https://aliyun-lc-upload.oss-cn-hangzhou.aliyuncs.com/aliyun-lc-upload/uploads/2018/07/25/question_11.jpg)

```python
Input: [1,8,6,2,5,4,8,3,7]
Output: 49 
Explanation: đoạn thẳng đứng trong hình trên đại diện cho mảng đầu vào [1,8,6,2,5,4,8,3,7]. Trong trường hợp này, khung có thể chứa nước (được biểu thị bằng phần màu xanh lá cây) nhiều nhất là 49.
```

#### 2.6.3 Ý tưởng giải quyết

##### Ý tưởng 1: Con trỏ đối nghịch

Từ ví dụ, ta có thể thấy rằng nếu xác định được hai đoạn thẳng ở hai đầu, khung chứa nước được xác định bởi "độ cao của đoạn thẳng thấp hơn * khoảng cách giữa hai đoạn thẳng". Vì vậy, chúng ta cần làm cho "độ cao của đoạn thẳng thấp hơn" là cao nhất có thể để khung chứa nước đạt được là lớn nhất.

Chúng ta có thể sử dụng con trỏ đối nghịch để giải quyết. Di chuyển con trỏ của đoạn thẳng thấp hơn để có được các độ cao và diện tích khác nhau, cuối cùng lấy diện tích lớn nhất. Cụ thể như sau:

1. Sử dụng hai con trỏ $left$ và $right$. $left$ trỏ đến vị trí đầu tiên của mảng, tức là $left = 0$, $right$ trỏ đến vị trí cuối cùng của mảng, tức là $right = len(height) - 1$.
2. Tính toán diện tích của $left$ và $right$, đồng thời cập nhật và duy trì diện tích lớn nhất.
3. So sánh độ cao của $left$ và $right$.

   - Nếu độ cao của $left$ nhỏ hơn, di chuyển con trỏ $left$ sang phải.
   - Nếu độ cao của $right$ nhỏ hơn, di chuyển con trỏ $right$ sang trái.

4. Nếu gặp $left == right$, thoát khỏi vòng lặp, cuối cùng trả về diện tích lớn nhất.

##### Ý tưởng 1: Code

```python
class Solution:
    def maxArea(self, height: List[int]) -> int:
        left = 0
        right = len(height) - 1
        ans = 0
        while left < right:
            area = min(height[left], height[right]) * (right-left)
            ans = max(ans, area)
            if height[left] < height[right]:
                left += 1
            else:
                right -= 1
        return ans
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$.
- **Độ phức tạp không gian**: $O(1)$.

## 3. Con trỏ nhanh/chậm

> **Con trỏ nhanh/chậm** (Fast and Slow Pointers): Đề cập đến việc sử dụng hai con trỏ bắt đầu từ cùng một vị trí trong chuỗi và di chuyển với các bước khác nhau. Con trỏ di chuyển nhanh được gọi là "con trỏ nhanh (fast pointer)", con trỏ di chuyển chậm được gọi là "con trỏ chậm (slow pointer)". Hai con trỏ di chuyển với tốc độ và chiến lược khác nhau cho đến khi con trỏ nhanh di chuyển đến cuối chuỗi, hoặc hai con trỏ gặp nhau, hoặc đáp ứng các điều kiện đặc biệt khác.

![Con trỏ nhanh/chậm](https://qcdn.itcharge.cn/images/20230906173808.png)

### 3.1 Bước giải bằng con trỏ nhanh/chậm

1. Sử dụng hai con trỏ $slow$ và $fast$. $slow$ thường trỏ đến vị trí đầu tiên của chuỗi, tức là $slow = 0$ và $fast$ thường trỏ đến vị trí thứ hai của chuỗi, tức là $fast = 1$.
2. Trong vòng lặp, di chuyển hai con trỏ theo các bước khác nhau. Khi đáp ứng một số điều kiện, di chuyển con trỏ chậm sang phải, tức là $slow += 1$. Khi đáp ứng một số điều kiện khác, di chuyển con trỏ nhanh sang phải, tức là $fast += 1$.
3. Khi con trỏ nhanh di chuyển đến cuối chuỗi (tức là $fast == len(nums) - 1$), hoặc hai con trỏ gặp nhau, hoặc đáp ứng các điều kiện đặc biệt khác, thoát khỏi vòng lặp.

### 3.2 Code mẫu cho con trỏ nhanh/chậm

```python
slow = 0
fast = 1
while chưa duyệt hết:
    if đáp ứng điều kiện đặc biệt:
        slow += 1
    fast += 1
trả về giá trị phù hợp
```

### 3.3 Phạm vi áp dụng của con trỏ nhanh/chậm

Con trỏ nhanh/chậm thường được sử dụng để xử lý việc di chuyển và xóa các phần tử trong mảng hoặc đánh giá xem có vấn đề về chu kỳ hoặc độ dài trong danh sách liên kết hay không. Về phương pháp con trỏ kép liên quan đến danh sách liên kết, chúng tôi sẽ giải thích chi tiết ở chương danh sách liên kết.

Tuy nhiên, chúng ta sẽ giải thích cách sử dụng con trỏ nhanh/chậm để giải quyết các vấn đề cụ thể dựa trên ví dụ cụ thể.

### 3.4 Xóa các phần tử trùng lặp trong mảng đã sắp xếp

#### 3.4.1 Liên kết đề bài

- [26. Xóa các phần tử trùng lặp trong mảng đã sắp xếp - LeetCode](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array/)

#### 3.4.2 Ý tưởng

**Mô tả**: Cho một mảng đã sắp xếp $nums$.

**Yêu cầu**: Xóa các phần tử trùng lặp trong mảng $nums$ sao cho mỗi phần tử chỉ xuất hiện một lần. Trả về độ dài của mảng mới.

**Giải thích**:

- Không được sử dụng mảng phụ, chỉ được sửa đổi mảng gốc và sử dụng không gian phụ $O(1)$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums = [1,1,2]
Output: 2, nums = [1,2,_]
Explanation: Hàm phải trả về độ dài mới là 2 và hai phần tử đầu của mảng nums đã được thay đổi thành 1 và 2. Không cần quan tâm đến các phần tử sau độ dài mới.
```

- Ví dụ 2:

```python
Input: nums = [0,0,1,1,1,2,2,3,3,4]
Output: 5, nums = [0,1,2,3,4]
Explanation: Hàm phải trả về độ dài mới là 5 và năm phần tử đầu của mảng nums đã được thay đổi thành 0, 1, 2, 3 và 4. Không cần quan tâm đến các phần tử sau độ dài mới.
```

#### 3.4.3 Ý tưởng giải quyết

##### Ý tưởng 1: Con trỏ nhanh/chậm

Vì mảng đã được sắp xếp, nên các phần tử trùng lặp sẽ nằm cạnh nhau.

Để xóa các phần tử trùng lặp, thực tế là di chuyển các phần tử không trùng lặp vào bên trái của mảng. Ta có thể sử dụng con trỏ nhanh/chậm để giải quyết. Cụ thể như sau:

1. Định nghĩa hai con trỏ nhanh/chậm $slow$ và $fast$. $slow$ thường trỏ đến vị trí cuối cùng của mảng sau khi xóa các phần tử trùng lặp, $fast$ thường trỏ đến vị trí hiện tại.
2. Đặt $slow$ ở phía sau và $fast$ ở phía trước. Đặt $slow = 0$ và $fast = 1$.
3. So sánh giá trị của $slow$ và $fast$.
   - Nếu giá trị của $slow$ và $fast$ khác nhau, di chuyển $slow$ sang phải một bước và sao chép giá trị của $fast$ vào $slow$.
4. Di chuyển $fast$ sang phải một bước.
5. Lặp lại bước 3 và 4 cho đến khi $fast$ đạt đến cuối mảng.
6. Trả về $slow + 1$ là độ dài mới của mảng.

##### Ý tưởng 1: Code

```python
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        if len(nums) <= 1:
            return len(nums)
        
        slow, fast = 0, 1

        while (fast < len(nums)):
            if nums[slow] != nums[fast]:
                slow += 1
                nums[slow] = nums[fast]
            fast += 1
            
        return slow + 1
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$.
- **Độ phức tạp không gian**: $O(1)$.

## 4. Con trỏ tách rời

> **Con trỏ tách rời**: Hai con trỏ thuộc hai mảng khác nhau và di chuyển trong hai mảng khác nhau.

![Con trỏ tách rời](https://qcdn.itcharge.cn/images/20230906180852.png)

### 4.1 Các bước giải quyết bằng Con trỏ tách rời

1. Sử dụng hai con trỏ $left\underline{}1$, $left\underline{}2$. $left\underline{}1$ trỏ đến phần tử đầu tiên của mảng thứ nhất, tức là $left\underline{}1 = 0$, $left\underline{}2$ trỏ đến phần tử đầu tiên của mảng thứ hai, tức là $left\underline{}2 = 0$.
2. Khi thỏa mãn một số điều kiện nhất định, di chuyển cả hai con trỏ sang phải, tức là $left\underline{}1 += 1$, $left\underline{}2 += 1$.
3. Khi thỏa mãn một số điều kiện khác, di chuyển con trỏ $left\underline{}1$ sang phải, tức là $left\underline{}1 += 1$.
4. Khi thỏa mãn một số điều kiện khác, di chuyển con trỏ $left\underline{}2$ sang phải, tức là $left\underline{}2 += 1$.
5. Khi một trong hai mảng đã được duyệt qua hoặc thỏa mãn một số điều kiện đặc biệt, thoát khỏi vòng lặp.

### 4.2 Mẫu Code cho Con trỏ tách rời

```python
left_1 = 0
left_2 = 0

while left_1 < len(nums1) and left_2 < len(nums2):
    if điều kiện 1:
        left_1 += 1
        left_2 += 1
    elif điều kiện 2:
        left_1 += 1
    elif điều kiện 3:
        left_2 += 1
```

### 4.3 Phạm vi sử dụng Con trỏ tách rời

Con trỏ tách rời thường được sử dụng để xử lý việc kết hợp mảng đã được sắp xếp, tìm giao, hợp của hai mảng.

Dưới đây, chúng ta sẽ giải quyết vấn đề cụ thể bằng cách sử dụng Con trỏ tách rời.

### 4.4 Giao của hai mảng

#### 4.4.1 Liên kết đến vấn đề

- [349. Giao của hai mảng - LeetCode](https://leetcode-cn.com/problems/intersection-of-two-arrays/)

#### 4.4.2 Ý tưởng

**Mô tả**: Cho hai mảng $nums1$ và $nums2$.

**Yêu cầu**: Trả về giao của hai mảng. Các phần tử trùng lặp chỉ được tính một lần.

**Giải thích**:

- $1 \le nums1.length, nums2.length \le 1000$.
- $0 \le nums1[i], nums2[i] \le 1000$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums1 = [1,2,2,1], nums2 = [2,2]
Output: [2]
```

- Ví dụ 2:

```python
Input: nums1 = [4,9,5], nums2 = [9,4,9,8,4]
Output: [9,4]
Explanation: [4,9] cũng là một đáp án hợp lệ
```

#### 4.4.3 Ý tưởng giải quyết

##### Ý tưởng 1: Con trỏ tách rời

1. Sắp xếp mảng $nums1$, $nums2$ trước.
2. Sử dụng hai con trỏ $left\underline{}1$, $left\underline{}2$. $left\underline{}1$ trỏ đến phần tử đầu tiên của mảng thứ nhất, tức là $left\underline{}1 = 0$, $left\underline{}2$ trỏ đến phần tử đầu tiên của mảng thứ hai, tức là $left\underline{}2 = 0$.
3. Nếu $nums1[left\underline{}1] == nums2[left\underline{}2]$, thêm nó vào mảng kết quả (chú ý loại bỏ các phần tử trùng lặp) và di chuyển $left\underline{}1$ và $left\underline{}2$ sang phải.
4. Nếu $nums1[left\underline{}1] < nums2[left\underline{}2]$, di chuyển $left\underline{}1$ sang phải.
5. Nếu $nums1[left\underline{}1] > nums2[left\underline{}2]$, di chuyển $left\underline{}2$ sang phải.
6. Trả về mảng kết quả cuối cùng.

##### Ý tưởng 1: Code

```python
class Solution:
    def intersection(self, nums1: List[int], nums2: List[int]) -> List[int]:
        nums1.sort()
        nums2.sort()

        left_1 = 0
        left_2 = 0
        res = []
        while left_1 < len(nums1) and left_2 < len(nums2):
            if nums1[left_1] == nums2[left_2]:
                if nums1[left_1] not in res:
                    res.append(nums1[left_1])
                left_1 += 1
                left_2 += 1
            elif nums1[left_1] < nums2[left_2]:
                left_1 += 1
            elif nums1[left_1] > nums2[left_2]:
                left_2 += 1
        return res
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$.
- **Độ phức tạp không gian**: $O(1)$.

## 5. Tổng kết về con trỏ kép

Con trỏ kép được chia thành "con trỏ đối đầu", "con trỏ nhanh và chậm", "con trỏ tách rời".

- **Con trỏ đối ngịch**: Hai con trỏ di chuyển theo hướng ngược nhau. Thích hợp để giải quyết các vấn đề tìm kiếm một nhóm phần tử thỏa mãn một số ràng buộc trong một mảng đã được sắp xếp, hoặc các vấn đề đảo ngược chuỗi.
- **Con trỏ nhanh và chậm**: Hai con trỏ di chuyển theo cùng một hướng. Thích hợp để giải quyết các vấn đề di chuyển, xóa phần tử trong một mảng, hoặc các vấn đề liên quan đến chuỗi như kiểm tra xem có chuỗi con nào có độ dài bằng k trong một chuỗi cho trước hay không.
- **Con trỏ tách rời**: Hai con trỏ thuộc hai mảng / danh sách khác nhau. Thích hợp để giải quyết các vấn đề liên quan đến việc kết hợp mảng đã được sắp xếp, tìm giao, hợp của hai mảng.
