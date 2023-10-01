---
title: LeetCode 0307
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-10-01
---

# [0307. Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/)

- Nhãn: Thiết kế, Cây Fenwick, Cây phân đoạn, Mảng
- Độ khó: Trung bình

## Tóm tắt đề bài

**Mô tả**: Cho một mảng `nums`.

**Yêu cầu**:

1. Thực hiện hai loại truy vấn:
   1. Yêu cầu cập nhật giá trị của phần tử `nums[index]` thành `val`.
   2. Yêu cầu trả về tổng các phần tử trong mảng `nums` trong khoảng `[left, right]` (bao gồm `left` và `right`). Trong đó $left \le right$.
2. Triển khai lớp `NumArray`:
   1. `NumArray(int[] nums)`: Khởi tạo đối tượng với mảng số nguyên `nums`.
   2. `void update(int index, int val)`: Cập nhật giá trị của `nums[index]` thành `val`.
   3. `int sumRange(int left, int right)`: Trả về tổng các phần tử trong mảng `nums` từ chỉ số `left` đến chỉ số `right` (bao gồm cả `left` và `right`) (tức là `nums[left] + nums[left + 1] + … + nums[right]`).

**Giải thích**:

- $1 \le nums.length \le 3 * 10^4$.
- $-100 \le nums[i] \le 100$.
- $0 <= index < num.length$.
- $0 \le left \le right < nums.length$.
- Số lần gọi phương thức `update` và `sumRange` không vượt quá $3 * 10^4$.

**Ví dụ**:

- Ví dụ 1:

```
Cho    nums = [1, 3, 5]

Tổng   sumRange(0, 2) -> 9  
Cập nhật    update(1, 2)  
Tổng   sumRange(0, 2) -> 8  
```

## Ý tưởng giải quyết

### Ý tưởng 1: Cây phân đoạn

- Dựa trên mảng `nums`, xây dựng một cây phân đoạn. Mỗi nút của cây phân đoạn lưu trữ ranh giới trái và phải của khoảng hiện tại và tổng của khoảng đó.
- Để cập nhật giá trị của một phần tử, ta cập nhật giá trị tại nút tương ứng trong cây phân đoạn.
- Để tính tổng của một khoảng, ta tìm kiếm trong cây phân đoạn các nút tương ứng với khoảng và tính tổng các giá trị của các nút đó.
- Thời gian xây dựng cây phân đoạn là $O(n)$, thời gian cập nhật một phần tử là $O(\log n)$, thời gian tính tổng của một khoảng là $O(\log n)$.

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


    def update(self, index: int, val: int) -> None:
        self.STree.update_point(index, val)


    def sumRange(self, left: int, right: int) -> int:
        return self.STree.query_interval(left, right)
```
