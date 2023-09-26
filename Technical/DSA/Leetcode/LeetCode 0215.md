---
title: LeetCode 0215
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-25
---

# [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)

- Nhãn: Mảng, Chia để trị, Sắp xếp nhanh, Sắp xếp, Heap (Hàng đợi ưu tiên)
- Độ khó: Trung bình

## Ý tưởng

**Mô tả**: Cho một mảng số nguyên chưa được sắp xếp $nums$ và một số nguyên $k$.

**Yêu cầu**: Trả về phần tử lớn thứ $k$ trong mảng.

**Giải thích**:

- Yêu cầu sử dụng thuật toán với độ phức tạp thời gian $O(n)$.
- $1 \le k \le \text{len}(nums) \le 10^5$.
- $-10^4 \le nums[i] \le 10^4$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: [3,2,1,5,6,4], k = 2
Output: 5
```

- Ví dụ 2:

```python
Input: [3,2,3,1,2,4,5,5,6], k = 4
Output: 4
```

## Ý tưởng giải quyết

Đây là một bài toán rất tốt, thường được đặt trong phỏng vấn.

Ý tưởng đầu tiên mà ta có thể nghĩ đến là: sắp xếp mảng và trả về phần tử thứ $k$. Vấn đề chính ở đây là độ phức tạp của phương pháp sắp xếp.

Phương pháp sắp xếp nổi bọt, sắp xếp chọn, sắp xếp chèn có độ phức tạp thời gian $O(n^2)$ quá cao và dễ dẫn đến việc vượt quá thời gian chạy.

Có thể xem xét Heap Sort, sắp xếp trộn, sắp xếp nhanh.

Yêu cầu của bài toán là tìm phần tử lớn thứ $k$, sắp xếp trộn chỉ có thể trả về phần tử thứ $k$ sau khi hoàn tất sắp xếp. Trong khi Heap Sort, sau mỗi lần sắp xếp, một phần tử sẽ được xác định chính xác vị trí của nó, tương tự như sắp xếp nhanh.

### Ý tưởng 1: Heap Sort

Ý tưởng của Heap Sort tăng dần như sau:

1. Xây dựng một max heap (heap ban đầu), đảm bảo giá trị lớn nhất trong $n$ giá trị của mảng nằm ở vị trí đầu tiên.
2. **Điều chỉnh heap**: Hoán đổi vị trí giữa phần tử đầu tiên của dãy $n$ phần tử (phần tử lớn nhất) và phần tử thứ $n$ của dãy. Xây dựng một max heap từ $n - 1$ phần tử đầu tiên của dãy, đảm bảo giá trị lớn nhất trong $n - 1$ giá trị của mảng nằm ở vị trí đầu tiên, từ đó thu được phần tử lớn thứ hai.
3. **Điều chỉnh heap**: Hoán đổi vị trí giữa phần tử đầu tiên của dãy $n - 1$ phần tử (phần tử lớn thứ hai) và phần tử thứ $n - 1$ của dãy. Xây dựng một max heap từ $n - 2$ phần tử đầu tiên của dãy, đảm bảo giá trị lớn nhất trong $n - 2$ giá trị của mảng nằm ở vị trí đầu tiên, từ đó thu được phần tử lớn thứ ba.
4. Tiếp tục như vậy, liên tục hoán đổi vị trí giữa phần tử đầu tiên của dãy $n - i$ phần tử và phần tử thứ $n - i$ của dãy. Xây dựng một max heap từ $n - i - 1$ phần tử đầu tiên của dãy, đảm bảo giá trị lớn nhất trong $n - i - 1$ giá trị của mảng nằm ở vị trí đầu tiên, từ đó thu được phần tử lớn thứ $i + 1$.

### Ý tưởng 1: Mã giả

```python
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        # Điều chỉnh thành max heap
        def heapify(nums, index, end):
            left = index * 2 + 1
            right = left + 1
            while left <= end:
                # Nút hiện tại không phải nút lá
                max_index = index
                if nums[left] > nums[max_index]:
                    max_index = left
                if right <= end and nums[right] > nums[max_index]:
                    max_index = right
                if index == max_index:
                    # Nếu không cần hoán đổi, có nghĩa là hoán đổi đã kết thúc
                    break
                nums[index], nums[max_index] = nums[max_index], nums[index]
                # Tiếp tục điều chỉnh cây con
                index = max_index
                left = index * 2 + 1
                right = left + 1
                
        # Khởi tạo max heap
        def buildMaxHeap(nums):
            size = len(nums)
            # (size-2) // 2 là nút lá cuối cùng, không cần điều chỉnh
            for i in range((size - 2) // 2, -1, -1):
                heapify(nums, i, size - 1)
            return nums

        buildMaxHeap(nums)
        size = len(nums)
        for i in range(k-1):
            nums[0], nums[size-i-1] = nums[size-i-1], nums[0]
            heapify(nums, 0, size-i-2)
        return nums[0]
```

### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times \log n)$.
- **Độ phức tạp không gian**: $O(1)$.

### Ý tưởng 2: Sắp xếp nhanh

Sử dụng sắp xếp nhanh, mỗi lần điều chỉnh, một phần tử sẽ được xác định chính xác vị trí của nó và mảng được chia thành hai mảng con bên trái và bên phải, các phần tử trong mảng con bên trái đều nhỏ hơn phần tử đó, các phần tử trong mảng con bên phải đều lớn hơn phần tử đó.

Vì vậy, chỉ cần phần tử chia lần này là phần tử thứ $k$ thì tìm được kết quả. Và chúng ta chỉ cần quan tâm đến trạng thái sắp xếp của mảng con chứa phần tử lớn thứ $k$, các phần tử không liên quan đến phần tử lớn thứ $k$ có thể bỏ qua. Điều này giúp giảm số bước thực hiện.

### Ý tưởng 2: Mã giả

```python
import random

class Solution:
    # Phân vùng ngẫu nhiên: Chọn một số ngẫu nhiên từ nums[low: high + 1] và sắp xếp di chuyển
    def randomPartition(self, nums: [int], low: int, high: int) -> int:
        # Chọn một số ngẫu nhiên
        i = random.randint(low, high)
        # Hoán đổi số ngẫu nhiên với số thấp nhất
        nums[i], nums[low] = nums[low], nums[i]
        # Chọn số đầu tiên là số ngẫu nhiên, sau đó di chuyển các phần tử lớn hơn số ngẫu nhiên vào bên phải của số ngẫu nhiên, di chuyển các phần tử nhỏ hơn số ngẫu nhiên vào bên trái của số ngẫu nhiên. Cuối cùng, đặt số ngẫu nhiên vào vị trí đúng
        return self.partition(nums, low, high)
    
    # Phân vùng: Chọn phần tử đầu tiên nums[low] là số ngẫu nhiên, sau đó di chuyển các phần tử nhỏ hơn số ngẫu nhiên vào bên trái của số ngẫu nhiên, di chuyển các phần tử lớn hơn số ngẫu nhiên vào bên phải của số ngẫu nhiên. Cuối cùng, đặt số ngẫu nhiên vào vị trí đúng
    def partition(self, nums: [int], low: int, high: int) -> int:        
        # Chọn phần tử đầu tiên là số ngẫu nhiên
        pivot = nums[low]
        
        i, j = low, high
        while i < j:
            # Tìm phần tử đầu tiên nhỏ hơn số ngẫu nhiên từ phải sang trái
            while i < j and nums[j] >= pivot:
                j -= 1
            # Tìm phần tử đầu tiên lớn hơn số ngẫu nhiên từ trái sang phải
            while i < j and nums[i] <= pivot:
                i += 1
            # Hoán đổi các phần tử
            nums[i], nums[j] = nums[j], nums[i]
        
        # Đặt số ngẫu nhiên vào vị trí đúng
        nums[j], nums[low] = nums[low], nums[j]
        return j

    def quickSort(self, nums: [int], low: int, high: int, k: int, size: int) -> [int]:
        if low < high:
            # Phân vùng mảng thành hai mảng con bên trái và bên phải
            pivot_i = self.randomPartition(nums, low, high)
            if pivot_i == size - k:
                return nums[size - k]
            if pivot_i > size - k:
                self.quickSort(nums, low, pivot_i - 1, k, size)
            if pivot_i < size - k:
                self.quickSort(nums, pivot_i + 1, high, k, size)

        return nums[size - k]


    def findKthLargest(self, nums: List[int], k: int) -> int:
        size = len(nums)
        return self.quickSort(nums, 0, len(nums) - 1, k, size)
```

### Ý tưởng 2: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$. Quá trình này được chứng minh trong "Giáo trình thuật toán 9.2: Thuật toán chọn có kỳ vọng tuyến tính".
- **Độ phức tạp không gian**: $O(\log n)$. Chi phí không gian dự phòng của đệ quy là $O(\log n)$.

### Ý tưởng 3: Sử dụng thư viện chuẩn (không khuyến nghị)

Đoạn mã nhanh nhất trong đệ trình là gọi phương thức `sort` của Python. Phương pháp này thích hợp để tiết kiệm thời gian khi tham gia cuộc thi lập trình, nhưng bạn có thể thử viết mã của riêng mình trong quá trình luyện tập hàng ngày.

### Ý tưởng 3: Mã giả

```python
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        nums.sort()
        return nums[len(nums) - k]
```

### Ý tưởng 3: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times \log n)$.
- **Độ phức tạp không gian**: $O(1)$.

### Ý tưởng 4: Hàng đợi ưu tiên

1. Duyệt qua các phần tử trong mảng, đối với mỗi phần tử $num$:
   1. Nếu số lượng phần tử trong hàng đợi ưu tiên nhỏ hơn $k$, thì đưa phần tử hiện tại $num$ vào hàng đợi ưu tiên.
   2. Nếu số lượng phần tử trong hàng đợi ưu tiên lớn hơn hoặc bằng $k$, và phần tử hiện tại $num$ lớn hơn phần tử đầu hàng đợi ưu tiên, thì loại bỏ phần tử đầu hàng đợi ưu tiên và đưa phần tử hiện tại $num$ vào hàng đợi ưu tiên.
2. Sau khi duyệt qua, phần tử đầu tiên trong hàng đợi ưu tiên chính là phần tử lớn thứ $k$.

Trong đây, chúng ta sử dụng thư viện `heapq` của Python để triển khai hàng đợi ưu tiên, bước này cũng có thể triển khai hàng đợi ưu tiên bằng cách viết lại cách triển khai của heap.

### Ý tưởng 4: Mã giả

```python
import heapq
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        res = []
        for num in nums:
            if len(res) < k:
                heapq.heappush(res, num)
            elif num > res[0]:
                heapq.heappop(res)
                heapq.heappush(res, num)
        return heapq.heappop(res)
```

### Ý tưởng 4: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times \log k)$.
- **Độ phức tạp không gian**: $O(k)$.
