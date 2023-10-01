---
title: LeetCode 0303
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-10-01
---

# [0303. Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/)

- Nhãn: Thiết kế, Mảng, Tổng tiền tố
- Độ khó: Dễ

## Tóm tắt đề bài

**Mô tả**: Cho một mảng số nguyên `nums`.

**Yêu cầu**: Triển khai lớp `NumArray` có thể xử lý nhiều truy vấn tính tổng trong khoảng `[left, right]`.

Lớp `NumArray`:

- `NumArray(int[] nums)`: Khởi tạo đối tượng với mảng `nums`.
- `int sumRange(int i, int j)`: Trả về tổng các phần tử trong mảng `nums` từ chỉ số `left` đến `right` bao gồm cả `left` và `right` (nghĩa là `nums[left] + nums[left + 1] + … + nums[right]`).

**Giải thích**:

- $1 \le nums.length \le 10^4$.
- $-10^5 \le nums[i] \le 10^5$.
- $0 \le left \le right < nums.length$.
- Số lần gọi phương thức `sumRange` không vượt quá $10^4$.

**Ví dụ**:

- Ví dụ 1:

```python
Cho    nums = [-2, 0, 3, -5, 2, -1]

Tổng   sumRange(0, 2) -> 1
Tổng   sumRange(2, 5) -> -1
Tổng   sumRange(0, 5) -> -3
```

## Ý tưởng giải quyết

### Ý tưởng 1: cây phân đoạn (Segment Tree)

- Dựa trên mảng `nums`, xây dựng một cây phân đoạn. Mỗi nút của cây phân đoạn lưu trữ ranh giới trái và phải của khoảng hiện tại và tổng của khoảng đó.

Thời gian xây dựng cây phân đoạn là $O(\log n)$, thời gian truy vấn một khoảng là $O(\log n)$. Tổng thời gian là $O(\log n)$.

Ý tưởng này chỉ nhằm mục đích làm quen với cây phân đoạn (segment tree). Cách đơn giản hơn ở ý tưởng sau.

### Ý tưởng 1: Code

```python
# Lớp nút cây phân đoạn
class SegTreeNode:
    def __init__(self, val=0):
        self.left = -1                              # Ranh giới trái của khoảng
        self.right = -1                             # Ranh giới phải của khoảng
        self.val = val                              # Giá trị của nút (tổng của khoảng)
        
        
# Lớp cây phân đoạn
class SegmentTree:
    # Phương thức khởi tạo cây phân đoạn
    def __init__(self, nums, function):
        self.size = len(nums)
        self.tree = [SegTreeNode() for _ in range(4 * self.size)]  # Mảng lưu trữ SegTreeNode
        self.nums = nums                            # Dữ liệu gốc
        self.function = function                    # function là một hàm, phương thức tổng hợp của khoảng trái và phải
        if self.size > 0:
            self.__build(0, 0, self.size - 1)
        
    # Phương thức cập nhật điểm: thay đổi nums[i] thành val
    def update_point(self, i, val):
        self.nums[i] = val
        self.__update_point(i, val, 0)
    
    # Phương thức truy vấn khoảng: truy vấn giá trị của khoảng [q_left, q_right]
    def query_interval(self, q_left, q_right):
        return self.__query_interval(q_left, q_right, 0)
    
    # Phương thức lấy mảng nums: trả về mảng nums
    def get_nums(self):
        for i in range(self.size):
            self.nums[i] = self.query_interval(i, i)
        return self.nums
    
    
    # Các phương thức triển khai bên trong
    
    # Triển khai phương thức xây dựng cây phân đoạn: chỉ số lưu trữ của nút là index, khoảng của nút là [left, right]
    def __build(self, index, left, right):
        self.tree[index].left = left
        self.tree[index].right = right
        if left == right:                           # Nút lá, giá trị của nút là giá trị phần tử tại vị trí tương ứng
            self.tree[index].val = self.nums[left]
            return
    
        mid = left + (right - left) // 2            # Điểm chia nút trái và phải
        left_index = index * 2 + 1                  # Chỉ số lưu trữ của nút con trái
        right_index = index * 2 + 2                 # Chỉ số lưu trữ của nút con phải
        self.__build(left_index, left, mid)         # Đệ quy tạo cây con trái
        self.__build(right_index, mid + 1, right)   # Đệ quy tạo cây con phải
        self.__pushup(index)                        # Cập nhật giá trị khoảng của nút lên trên
    
    
    # Triển khai phương thức cập nhật điểm: thay đổi nums[i] thành val. Chỉ số lưu trữ của nút là index, khoảng của nút là [left, right]
    def __update_point(self, i, val, index):
        left = self.tree[index].left
        right = self.tree[index].right
        
        if left == right:
            self.tree[index].val = val              # Nút lá, cập nhật giá trị của nút thành val
            return
        
        mid = left + (right - left) // 2            # Điểm chia nút trái và phải
        left_index = index * 2 + 1                  # Chỉ số lưu trữ của nút con trái
        right_index = index * 2 + 2                 # Chỉ số lưu trữ của nút con phải
        if i <= mid:                                # Cập nhật giá trị của nút trong cây con trái
            self.__update_point(i, val, left_index)
        else:                                       # Cập nhật giá trị của nút trong cây con phải
            self.__update_point(i, val, right_index)
        
        self.__pushup(index)                        # Cập nhật giá trị khoảng của nút lên trên
        
    
    # Triển khai phương thức truy vấn khoảng: tìm kiếm giá trị của khoảng [q_left, q_right] trong khoảng [left, right] của cây
    def __query_interval(self, q_left, q_right, index):
        left = self.tree[index].left
        right = self.tree[index].right
        
        if left >= q_left and right <= q_right:     # Khoảng của nút nằm trong khoảng [q_left, q_right]
            return self.tree[index].val             # Trả về giá trị của nút
        if right < q_left or left > q_right:        # Khoảng của nút không liên quan đến [q_left, q_right]
            return 0
    
        mid = left + (right - left) // 2            # Điểm chia nút trái và phải
        left_index = index * 2 + 1                  # Chỉ số lưu trữ của nút con trái
        right_index = index * 2 + 2                 # Chỉ số lưu trữ của nút con phải
        res_left = 0                                # Kết quả truy vấn cây con trái
        res_right = 0                               # Kết quả truy vấn cây con phải
        if q_left <= mid:                           # Truy vấn trong cây con trái
            res_left = self.__query_interval(q_left, q_right, left_index)
        if q_right > mid:                           # Truy vấn trong cây con phải
            res_right = self.__query_interval(q_left, q_right, right_index)
        
        return self.function(res_left, res_right)   # Trả về kết quả tính toán tổng của giá trị các nút con trái và phải
    
    # Triển khai phương thức cập nhật lên trên: giá trị khoảng của nút có chỉ số index bằng tổng giá trị của nút con trái và phải
    def __pushup(self, index):
        left_index = index * 2 + 1                  # Chỉ số lưu trữ của nút con trái
        right_index = index * 2 + 2                 # Chỉ số lưu trữ của nút con phải
        self.tree[index].val = self.function(self.tree[left_index].val, self.tree[right_index].val)


class NumArray:

    def __init__(self, nums: List[int]):
        self.STree = SegmentTree(nums, lambda x, y: x + y)


    def sumRange(self, left: int, right: int) -> int:
        return self.STree.query_interval(left, right)
```

### Ý tưởng 2: Tổng tiền tố (Prefix Sum)

Tổng tiền tố (prefix sum) là một phương pháp để tính tổng của một đoạn trong $O(1)$. Cách thực hiện của nó rất dễ hiểu:  

Xét với dãy số A: $a_1, a_2, a_3, …, a_n$  
Xây dựng dãy S: với $s_i = \sum_{1}^i a_i = a_1 + a_2 + … + a_n$

Với dãy S, tổng của đoạn $(l,r)$ sẽ là $\sum_{i=l}^{r} a_i = s_r - s_{l-1}$

Từ đó ta áp dụng vào bài toán này. Lưu ý rằng mảng trong Python bắt đầu bằng chỉ số 0 nên ta sẽ thêm 1 số 0 ở đầu cho dễ xử lý.

Thuật toán này chỉ cần duyệt mảng một lần để xây dựng mảng tổng tiền tố `prefixSum` với chi phí $O(n)$, và mất $O(1)$ để tính tổng của một đoạn. Chung quy lại thì độ phức tạp thời gian là $O(n)$.

### Ý tưởng 2: Code

```python
class NumArray:

    def __init__(self, nums: List[int]):
	    # Thêm 0 ở đầu để xử lý tính toán thuận tiện hơn
        self.prefixSum = [0] * (len(nums) + 1)
        # Vị trí đã dịch qua phải
        for i in range(len(nums)):
            self.prefixSum[i + 1] = self.prefixSum[i] + nums[i]


    def sumRange(self, left: int, right: int) -> int:
	    # Vị trí đã dịch qua phải
        return self.prefixSum[right + 1] - self.prefixSum[left]
```

Trong Python có hàm `accumulate` để xử lý việc tính tổng tiền tố ta có thể rút gọn code lại thêm:

```python
class NumArray:

    def __init__(self, nums: List[int]):
	    self.prefixSum = [0] + list(accumulate(nums))nums[i]


    def sumRange(self, left: int, right: int) -> int:
        return self.prefixSum[right + 1] - self.prefixSum[left]
```
