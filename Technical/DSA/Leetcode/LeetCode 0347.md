---
title: LeetCode 0347
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-29
---

# [0347. Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)

- Nhãn: Mảng, Bảng băm, Chia để trị, Sắp xếp theo thùng, Đếm, Lựa chọn nhanh, Sắp xếp, Hàng đợi ưu tiên (Heap)
- Độ khó: Trung bình

## Tóm tắt đề bài

**Mô tả**: Cho một mảng số nguyên $nums$ và một số nguyên $k$.

**Yêu cầu**: Trả về $k$ phần tử phổ biến nhất trong mảng. Có thể trả về kết quả theo bất kỳ thứ tự nào.

**Giải thích**:

- $1 \le \text{độ dài của mảng nums} \le 10^5$.
- $k$ có giá trị trong khoảng $[1, \text{số lượng phần tử khác nhau trong mảng}]$.
- Đề bài đảm bảo kết quả là duy nhất, nghĩa là tập hợp $k$ phần tử phổ biến nhất trong mảng là duy nhất.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]
```

- Ví dụ 2:

```python
Input: nums = [1], k = 1
Output: [1]
```

## Ý tưởng giải quyết

### Ý tưởng: Bảng băm + Hàng đợi ưu tiên

1. Sử dụng bảng băm để ghi lại tần số xuất hiện của các phần tử trong mảng.
2. Sau đó, chuyển bảng băm thành một mảng mới bằng cách loại bỏ các phần tử trùng lặp. Độ phức tạp thời gian là $O(n)$, độ phức tạp không gian là $O(n)$.
3. Sử dụng hàng đợi ưu tiên để xây dựng một hàng đợi ưu tiên, với mức ưu tiên là tần số của phần tử. Lúc này, phần tử đầu hàng đợi ưu tiên chính là phần tử có tần số cao nhất. Độ phức tạp thời gian là $O(n)$, độ phức tạp không gian là $O(n)$.
4. Thêm phần tử đầu hàng đợi ưu tiên vào mảng kết quả và thực hiện thao tác dequeue. Độ phức tạp thời gian là $O(\log n)$.
   - Thao tác dequeue: Hoán đổi phần tử đầu hàng đợi ưu tiên với phần tử cuối cùng, sau đó loại bỏ phần tử cuối cùng khỏi hàng đợi ưu tiên. Tiếp tục điều chỉnh hàng đợi ưu tiên.
5. Lặp lại bước 4 cho đến khi kết thúc $k$ lần. Độ phức tạp thời gian điều chỉnh $k$ lần là $O(n \times \log n)$.

### Ý tưởng 1: Code

```python
class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:

    	# Đếm tần suất xuất hiện của các phần tử
        nums_dict = defaultdict(int)
        for num in nums:
            nums_dict[num] += 1

        # Chuyển bảng băm thành mảng mới
        new_nums = list(set(nums))
        size = len(new_nums)

        # Xây dựng hàng đợi ưu tiên
        queue = []
        for num in new_nums:
            heapq.heappush(queue, (-nums_dict[num], num))
        
        res = []
        for _ in range(k):
            res.append(heapq.heappop(queue)[1])
        return res
```

### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times \log n)$.
- **Độ phức tạp không gian**: $O(n)$.

### Ý tưởng 2: Dùng thư viện

Dự trên ý tưởng 1, các bước thực hiện của nó hoàn toàn có thể xử lý bởi `Counter` trong thư viện `collections` của Python trong 1 dòng lệnh, xem code để rõ hơn.

### Ý tưởng 2: Code

```python
class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        return [x[0] for x in Counter(nums).most_common(k)]
```

### Ý tưởng 2: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times \log n)$.
- **Độ phức tạp không gian**: $O(n)$.
