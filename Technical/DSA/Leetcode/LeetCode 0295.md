---
title: LeetCode 0295
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-29
---

# [0295. Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/)

- Nhãn: Thiết kế, Con trỏ kép, Luồng dữ liệu, Sắp xếp, Hàng đợi ưu tiên (Heap)
- Độ khó: Khó

## Tóm tắt đề bài

**Mô tả**: Thiết kế một cấu trúc dữ liệu hỗ trợ hai thao tác sau:

- `void addNum(int num)`: Thêm một số nguyên vào cấu trúc dữ liệu.
- `double findMedian()`: Trả về trung vị của tất cả các số hiện tại.

## Ý tưởng giải quyết

Sử dụng một hàng đợi ưu tiên lớn `queMax` để lưu trữ các số lớn hơn trung vị và một hàng đợi ưu tiên nhỏ `queMin` để lưu trữ các số nhỏ hơn trung vị. Ở đây `queMax` sẽ là Min Heap còn `queMin` sẽ là Max Heap để duy 2 phần tử ở giữa.

- Khi số lượng phần tử là số chẵn: `queMin` và `queMax` có cùng số lượng phần tử, trung vị là trung bình cộng của hai phần tử đầu hàng đợi.
- Khi số lượng phần tử là số lẻ: `queMin` có một phần tử nhiều hơn `queMax`, trung vị là phần tử đầu hàng đợi `queMin`.

Để đáp ứng các yêu cầu trên, khi thực hiện thao tác `addNum`, chúng ta cần xử lý các trường hợp sau:

- `num > max{queMin}`: Khi đó `num` lớn hơn trung vị, ta thêm số này vào hàng đợi ưu tiên lớn `queMax`. Trung vị mới sẽ lớn hơn trung vị cũ, do đó có thể cần di chuyển phần tử nhỏ nhất trong `queMax` vào `queMin`.
- `num ≤ max{queMin}`: Khi đó `num` nhỏ hơn hoặc bằng trung vị, ta thêm số này vào hàng đợi ưu tiên nhỏ `queMin`. Trung vị mới sẽ nhỏ hơn hoặc bằng trung vị cũ, do đó có thể cần di chuyển phần tử lớn nhất trong `queMin` vào `queMax`.

## Code

```python
import heapq

class MedianFinder:

    def __init__(self):
        self.queMin = []
        self.queMax = []s

    def addNum(self, num: int) -> None:
        if not self.queMin or num < -self.queMin[0]:
            heapq.heappush(self.queMin, -num)
            if len(self.queMax) + 1 < len(self.queMin):
                heapq.heappush(self.queMax, -heapq.heappop(self.queMin))
        else:
            heapq.heappush(self.queMax, num)
            if len(self.queMax) > len(self.queMin):
                heapq.heappush(self.queMin, -heapq.heappop(self.queMax))

    def findMedian(self) -> float:
        if len(self.queMin) > len(self.queMax):
            return -self.queMin[0]
        return (-self.queMin[0] + self.queMax[0]) / 2
```

## Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(\log n)$ cho mỗi thao tác `addNum` và `findMedian`.
- **Độ phức tạp không gian**: $O(n)$.
