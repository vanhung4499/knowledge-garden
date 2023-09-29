---
title: LeetCode 0622
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-29
---

# [0622. Design Circular Queue](https://leetcode.com/problems/design-circular-queue/)

- Nhãn: Thiết kế, Hàng đợi, Mảng, Liên kết
- Độ khó: Trung bình

## Ý tưởng

**Yêu cầu**: Thiết kế và triển khai một hàng đợi vòng, hỗ trợ các thao tác sau:

- `MyCircularQueue(k)`: Hàm khởi tạo, thiết lập độ dài hàng đợi là `k`.
- `Front`: Lấy phần tử đầu hàng đợi. Nếu hàng đợi rỗng, trả về `-1`.
- `Rear`: Lấy phần tử cuối hàng đợi. Nếu hàng đợi rỗng, trả về `-1`.
- `enQueue(value)`: Thêm một phần tử vào hàng đợi vòng. Nếu thành công, trả về `True`.
- `deQueue()`: Xóa một phần tử khỏi hàng đợi vòng. Nếu thành công, trả về `True`.
- `isEmpty()`: Kiểm tra xem hàng đợi có rỗng không.
- `isFull()`: Kiểm tra xem hàng đợi có đầy không.

**Giải pháp**:

Có thể sử dụng mảng hoặc danh sách liên kết để triển khai hàng đợi vòng.

### Ý tưởng 1: Sử dụng mảng

Tạo một mảng `queue` có kích thước `k + 1`. Lưu trữ con trỏ `front` và `rear` của hàng đợi, và `capacity` của hàng đợi là `k + 1` (ở đây tại sao lại sử dụng `k + 1`, vì cần để kiểm tra rỗng và đầy, cần để trống một chỗ).

Sau đó, triển khai các giao diện của hàng đợi vòng:

1. `MyCircularQueue(k)`:
   1. Khởi tạo mảng `queue` có kích thước `k + 1`.
   2. Khởi tạo `front` và `rear` bằng `0`.
2. `Front`:
   1. Kiểm tra xem hàng đợi có rỗng không. Nếu hàng đợi rỗng, trả về `-1`.
   2. Nếu không rỗng, trả về phần tử đầu hàng đợi.
3. `Rear`:
   1. Kiểm tra xem hàng đợi có rỗng không. Nếu hàng đợi rỗng, trả về `-1`.
   2. Nếu không rỗng, trả về phần tử cuối hàng đợi.
4. `enQueue(value)`:
   1. Nếu hàng đợi đã đầy, không thể thêm, trả về `False`.
   2. Nếu hàng đợi chưa đầy, di chuyển con trỏ `rear` sang phải một vị trí và thực hiện thêm. Sau đó, trả về `True`.
5. `deQueue()`:
   1. Nếu hàng đợi rỗng, không thể xóa, trả về `False`.
   2. Nếu hàng đợi không rỗng, gán giá trị của phần tử trỏ bởi con trỏ `front` thành `None`, và di chuyển `front` sang phải một vị trí. Sau đó, trả về `True`.
6. `isEmpty()`:
   1. Nếu `rear` bằng `front`, hàng đợi rỗng, trả về `True`.
   2. Nếu không, hàng đợi không rỗng, trả về `False`.
7. `isFull()`:
   1. Nếu `(rear + 1) % capacity` bằng `front`, hàng đợi đã đầy, trả về `True`.
   2. Nếu không, hàng đợi chưa đầy, trả về `False`.

### Ý tưởng 1: Code

```python
class MyCircularQueue:

    def __init__(self, k: int):
        self.capacity = k + 1
        self.queue = [0 for _ in range(k + 1)]
        self.front = 0
        self.rear = 0

    def enQueue(self, value: int) -> bool:
        if self.isFull():
            return False
        self.rear = (self.rear + 1) % self.capacity
        self.queue[self.rear] = value
        return True

    def deQueue(self) -> bool:
        if self.isEmpty():
            return False
        self.front = (self.front + 1) % self.capacity
        return True

    def Front(self) -> int:
        if self.isEmpty():
            return -1
        return self.queue[(self.front + 1)  % self.capacity]

    def Rear(self) -> int:
        if self.isEmpty():
            return -1
        return self.queue[self.rear]

    def isEmpty(self) -> bool:
        return self.front == self.rear

    def isFull(self) -> bool:
        return (self.rear + 1) % self.capacity == self.front
```

### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(1)$. Độ phức tạp thời gian của việc khởi tạo và mỗi thao tác đều là $O(1)$.
- **Độ phức tạp không gian**: $O(k)$. Trong đó $k$ là số lượng phần tử của hàng đợi đã cho.
