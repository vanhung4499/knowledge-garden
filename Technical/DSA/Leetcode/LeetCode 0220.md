---
title: LeetCode 0220
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-29
---

# [0220. Tồn tại cặp phần tử trùng nhau III](https://leetcode-cn.com/problems/contains-duplicate-iii/)

- Thẻ: Array, Bucket Sort, Ordered Set, Sorting, Sliding Window
- Độ khó: Khó

## Tóm tắt đề bài

**Mô tả**: Cho một mảng số nguyên $nums$ và hai số nguyên $k$ và $t$.

**Yêu cầu**: Kiểm tra xem trong mảng có tồn tại hai chỉ số khác nhau $i$ và $j$ sao cho $abs(nums[i] - nums[j]) \le t$ và đồng thời $abs(i - j) \le k$. Nếu thỏa mãn điều kiện thì trả về `True`, ngược lại trả về `False`.

**Giải thích**:

- $0 \le nums.length \le 2 \times 10^4$.
- $-2^{31} \le nums[i] \le 2^{31} - 1$.
- $0 \le k \le 10^4$.
- $0 \le t \le 2^{31} - 1$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums = [1,2,3,1], k = 3, t = 0
Output: True
```

- Ví dụ 2:

```python
Input: nums = [1,0,1,1], k = 1, t = 2
Output: True
```

## Ý tưởng giải quyết

Đề bài yêu cầu thỏa mãn hai yêu cầu, một là yêu cầu về giá trị phần tử ($abs(nums[i] - nums[j]) \le t$), và hai là yêu cầu về phạm vi chỉ số ($abs(i - j) \le k$).

Đối với mỗi vị trí $i$, vị trí $j$ phù hợp phải nằm trong khoảng $[i - k, i + k]$, đồng thời giá trị $nums[j]$ phải nằm trong khoảng $[nums[i] - t, nums[i] + t]$.

Cách đơn giản nhất là sử dụng hai vòng lặp để duyệt qua mảng, vòng lặp bên ngoài duyệt qua vị trí $i$, vòng lặp bên trong duyệt qua các phần tử trong khoảng $[i - k, i + k]$ và kiểm tra xem có thỏa mãn $abs(nums[i] - nums[j]) \le t$ hay không. Tuy nhiên, cách làm này có độ phức tạp thời gian là $O(n \times k)$, trong đó $n$ là độ dài của mảng $nums$.

Chúng ta cần tối ưu phần kiểm tra xem các phần tử liền kề $2 \times k$ có thỏa mãn $abs(nums[i] - nums[j]) \le t$ hay không. Có hai cách để làm điều này: "sắp xếp theo thùng" và "cửa sổ trượt (độ dài cố định)".

### Ý tưởng 1: Sắp xếp theo thùng (bucket sort)

1. Sử dụng ý tưởng sắp xếp theo thùng, đặt kích thước của mỗi thùng là $t + 1$. Chỉ cần sử dụng một vòng lặp để duyệt qua vị trí $i$, sau đó dựa vào $\lfloor \frac{nums[i]}{t + 1} \rfloor$ để quyết định đưa $nums[i]$ vào thùng nào.
2. Như vậy, các phần tử trong cùng một thùng sẽ có độ chênh lệch tuyệt đối nhỏ hơn hoặc bằng $t$. Còn các phần tử liền kề giữa các thùng, chỉ cần kiểm tra xem chênh lệch giữa hai thùng có vượt quá $t$ hay không. Như vậy, ta có thể kiểm tra xem các phần tử liền kề $2 \times k$ có thỏa mãn $abs(nums[i] - nums[j]) \le t$ trong thời gian $O(1)$.
3. Đồng thời, ta cũng cần kiểm tra xem $abs(i - j) \le k$ bằng cách xóa các thùng chứa các phần tử $nums[i - k]$ vượt quá giới hạn. Điều này đảm bảo các phần tử trong thùng luôn thỏa mãn $abs(i - j) \le k$.

Các bước cụ thể như sau:

1. Đặt kích thước của mỗi thùng là $t + 1$. Ta sử dụng một từ điển để lưu trữ các thùng.
2. Duyệt qua các phần tử trong mảng $nums$, với mỗi phần tử $nums[i]$:
   1. Nếu trước khi đưa $nums[i]$ vào thùng, thì thùng đã có phần tử, thì hai phần tử này chắc chắn thỏa mãn $abs(nums[i] - nums[j]) \le t$,
   2. Nếu thùng trước đó không có phần tử, thì đưa $nums[i]$ vào thùng tương ứng.
   3. Kiểm tra xem các thùng bên trái và bên phải có phần tử thỏa mãn $abs(nums[i] - nums[j]) \le t$ hay không.
   4. Sau đó xóa các thùng cũ trước $i - k$, vì các thùng cũ này không còn thỏa mãn $abs(i - j) \le k$ nữa.
3. Nếu có trường hợp thỏa mãn yêu cầu thì trả về `True`, nếu không thỏa mãn yêu cầu sau khi duyệt qua tất cả các phần tử thì trả về `False`.

### Ý tưởng 1: Code

```python
class Solution:
    def containsNearbyAlmostDuplicate(self, nums: List[int], k: int, t: int) -> bool:
        bucket_dict = dict()
        for i in range(len(nums)):
            # Đặt nums[i] vào các thùng có kích thước là t + 1
            num = nums[i] // (t + 1)

            # Nếu thùng đã có phần tử trước đó
            if num in bucket_dict:
                return True

            # Đưa nums[i] vào thùng
            bucket_dict[num] = nums[i]

            # Kiểm tra thùng bên trái có thỏa mãn yêu cầu hay không
            if (num - 1) in bucket_dict and abs(bucket_dict[num - 1] - nums[i]) <= t:
                return True
            # Kiểm tra thùng bên phải có thỏa mãn yêu cầu hay không
            if (num + 1) in bucket_dict and abs(bucket_dict[num + 1] - nums[i]) <= t:
                return True
            # Xóa các thùng cũ trước i - k, vì các thùng này không còn thỏa mãn yêu cầu nữa
            if i >= k:
                bucket_dict.pop(nums[i - k] // (t + 1))

        return False
```

### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$. $n$ là độ dài của mảng đầu vào.
- **Độ phức tạp không gian**: $O(min(n, k))$. Số lượng phần tử tối đa trong các thùng là $min(n, k + 1)$.

### Ý tưởng 2: Cửa sổ trượt (độ dài cố định)

1. Sử dụng một cửa sổ trượt có độ dài cố định là $k$. Mỗi khi duyệt đến $nums[right]$, cửa sổ trượt sẽ chứa tối đa $k$ phần tử trước $nums[right]$. Chỉ cần kiểm tra xem $k$ phần tử đầu tiên trong cửa sổ trượt có nằm trong khoảng $[nums[right] - t, nums[right] + t]$ hay không.
2. Kiểm tra xem $k$ phần tử trong cửa sổ trượt có nằm trong khoảng $[nums[right] - t, nums[right] + t]$ có thể được thực hiện bằng cách sắp xếp cửa sổ trượt và kiểm tra các phần tử liền kề. Điều này giúp giảm độ phức tạp thời gian.

Các bước cụ thể như sau:

1. Sử dụng lớp `SortedList` tự $window$ để duy trì một cửa sổ trượt có độ dài $k$ và đảm bảo các phần tử trong cửa sổ trượt được sắp xếp.
2. $left$ và $right$ đều trỏ đến phần tử đầu tiên của dãy con. Tức là: `left = 0`, `right = 0`.
3. Đưa phần tử hiện tại vào cửa sổ trượt, tức là `window.add(nums[right])`.
4. Khi số phần tử trong cửa sổ trượt lớn hơn $k$, tức là khi $right - left > k$, loại bỏ phần tử bên trái nhất của cửa sổ trượt và di chuyển $left$ sang phải.
5. Khi số phần tử trong cửa sổ trượt nhỏ hơn hoặc bằng $k$:
   1. Sử dụng thuật toán tìm kiếm nhị phân để tìm vị trí $idx$ của $nums[right]$ trong $window$.
   2. Kiểm tra giá trị tuyệt đối của chênh lệch giữa $window[idx]$ và phần tử liền kề bên trái, nếu nhỏ hơn hoặc bằng $t$ thì trả về `True`.
   3. Kiểm tra giá trị tuyệt đối của chênh lệch giữa $window[idx+1]$ và $window[idx]$, nếu nhỏ hơn hoặc bằng $t$ thì trả về `True`.
6. Di chuyển $right$ sang phải.
7. Lặp lại các bước 3-6 cho đến khi $right$ đến cuối mảng. Nếu không tìm thấy trường hợp thỏa mãn yêu cầu sau khi duyệt qua tất cả các phần tử, trả về `False`.

### Ý tưởng 2: Code

```python
from sortedcontainers import SortedList

class Solution:
    def containsNearbyAlmostDuplicate(self, nums: List[int], k: int, t: int) -> bool:
        size = len(nums)
        window = SortedList()
        left, right = 0, 0
        while right < size:
            window.add(nums[right])
            
            if right - left > k:
                window.remove(nums[left])
                left += 1
            
            idx = bisect.bisect_left(window, nums[right])
            
            if idx > 0 and abs(window[idx] - window[idx - 1]) <= t:
                return True
            if idx < len(window) - 1 and abs(window[idx + 1] - window[idx]) <= t:
                return True

            right += 1

        return False
```

### Ý tưởng 2: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times \log (min(n, k)))$.
- **Độ phức tạp không gian**: $O(min(n, k))$.
