---
title: LeetCode 0239
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-29
---

# [0239. Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)

- Nhãn: Hàng đợi, Mảng, Cửa sổ trượt, Hàng đợi đơn điệu, Hàng đợi ưu tiên (Heap)
- Độ khó: Khó

## Tóm tắt bài toán

**Mô tả**: Cho một mảng số nguyên `nums` và một số nguyên `k`, đại diện cho một cửa sổ trượt có kích thước `k` di chuyển từ vị trí cực trái của mảng đến vị trí cực phải của mảng. Chúng ta chỉ có thể nhìn thấy `k` số trong cửa sổ trượt, và cửa sổ trượt chỉ di chuyển sang phải một vị trí mỗi lần.

**Yêu cầu**: Trả về giá trị lớn nhất trong cửa sổ trượt.

**Giải thích**:

- $1 \le \text{độ dài của mảng nums} \le 10^5$.
- $-10^4 \le \text{nums}[i] \le 10^4$.
- $1 \le k \le \text{độ dài của mảng nums}$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]
Explanation:
Vị trí của cửa sổ trượt                Giá trị lớn nhất
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7
```

- Ví dụ 2:

```python
Input: nums = [1], k = 1
Output: [1]
```

## Ý tưởng giải quyết

Nếu giải quyết bằng cách lặp lại sẽ sử dụng hai vòng lặp lồng nhau, độ phức tạp thời gian là $O(n \times k)$. Dựa trên phạm vi dữ liệu đã cho, chắc chắn sẽ vượt quá thời gian giới hạn.

Chúng ta có thể sử dụng hàng đợi ưu tiên để giải quyết bài toán.

### Ý tưởng 1: Hàng đợi ưu tiên

1. Ban đầu, chúng ta thêm `k` phần tử đầu tiên vào hàng đợi ưu tiên (heap) dưới dạng các cặp giá trị và chỉ số của chúng. Hàng đợi ưu tiên sẽ sắp xếp các phần tử theo giá trị.
2. Sau đó, chúng ta duyệt qua từng phần tử trong mảng từ vị trí `k` đến cuối mảng.
3. Tại mỗi vị trí, chúng ta thêm phần tử hiện tại và chỉ số của nó vào hàng đợi ưu tiên.
4. Sau đó, chúng ta kiểm tra xem phần tử đầu tiên trong hàng đợi ưu tiên có thuộc về cửa sổ trượt hiện tại hay không. Nếu không, chúng ta loại bỏ phần tử này khỏi hàng đợi ưu tiên cho đến khi phần tử đầu tiên thuộc về cửa sổ trượt.
5. Phần tử đầu tiên trong hàng đợi ưu tiên sẽ là giá trị lớn nhất trong cửa sổ trượt hiện tại. Chúng ta thêm giá trị này vào mảng kết quả và tiếp tục di chuyển cửa sổ trượt sang phải.
6. Khi kết thúc quá trình di chuyển cửa sổ trượt, chúng ta trả về mảng kết quả.

### Ý tưởng 1: Code

```python
class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        size = len(nums)
        q = [(-nums[i], i) for i in range(k)]
        heapq.heapify(q)
        res = [-q[0][0]]

        for i in range(k, size):
            heapq.heappush(q, (-nums[i], i))
            while q[0][1] <= i - k:
                heapq.heappop(q)
            res.append(-q[0][0])
        return res
```

### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times \log_2n)$.
- **Độ phức tạp không gian**: $O(k)$.

### Ý tưởng 2: Hàng đợi đơn điệu

Cùng một luồng suy nghĩ như ý tưởng 1, nhưng chúng ta sẽ dùng Hàng đợi đơn điệu để tìm ra số lớn nhất trong cửa sổ trượt.

Hàng đợi đơn điệu thực sự giống với ngăn xếp đơn điệu đã giới thiệu ở [[Monotone Stack]], chúng ta sẽ đẩy các phần tử nhỏ hơn phần tử cần thêm vào ở đuôi hàng đợi. Điều này sẽ đảm bảo phần tử ở đầu hàng đợi ưu tiên luôn là lớn nhất, tương ứng với phần tử lớn nhất trong cửa sổ trượt độ lớn `k`.  

Và khi cửa sổ trượt dịch chuyển qua phải, ta chỉ cần xem rằng chỉ số của phần tử đầu hàng đợi có nằm trong cửa sổ trượt nữa hay không? Nếu không thì chỉ cần phải xoá phần tử ở đầu đi, và mỗi lần chỉ dịch chuyển qua phải 1.

Vì ta cần có thể thêm và xoá phần tử ở cả 2 đầu của hàng đợi nên cần có một cấu trúc dữ liệu gọi là **hàng đợi hai đầu (deque)**. Từ đó **hàng đợi đơn điệu = hàng đợi hai đầu + tính đơn điệu của phần tử**.

Hàng đợi đơn điệu này ứng dụng trong việc tìm kiếm min-max trong một đoạn cụ thể và thường đi kèm với cửa sổ trượt (vì có thể thêm xoá 2 đầu). Nó là sự nâng cấp của ngăn xếp đơn điệu, nên cũng có thể dùng thay cho ngăn xếp đơn điệu. Trong Python, cấu trúc này được triển khai trong `collections.deque`, xem code để hiểu thêm, cách dùng khá đơn giản.

### Ý tưởng 2: Code

```python
class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        ans = []
        queue = collections.deque()
        
        for i in range(len(nums)):
	        # Xây hàng đợi đơn điệu
            while queue and nums[queue[-1]] < nums[i]:
                queue.pop()
            queue.append(i)
			# Loại bỏ phần tử không nằm trong cửa sổ trượt
            if queue[0] <= i - k:
                    queue.popleft()
            # Thêm vào kết quả
            if i >= k - 1:
                ans.append(nums[queue[0]])
                
        return ans
```

### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$.
- **Độ phức tạp không gian**: $O(k)$.
