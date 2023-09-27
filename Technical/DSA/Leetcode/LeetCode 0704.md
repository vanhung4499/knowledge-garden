---
title: LeetCode 0704
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-26
---

# [0704. Tìm kiếm nhị phân](https://leetcode.com/problems/binary-search/)

- Thẻ: Mảng, Tìm kiếm nhị phân
- Độ khó: Dễ

## Tóm tắt đề bài

**Mô tả**: Cho một mảng $nums$ đã được sắp xếp tăng dần và một giá trị mục tiêu $target$.

**Yêu cầu**: Trả về vị trí của $target$ trong mảng, nếu không tìm thấy thì trả về -1.

**Giải thích**:

- Có thể giả sử tất cả các phần tử trong mảng $nums$ đều không trùng lặp.
- Độ dài của mảng $nums$ nằm trong khoảng từ $[1, 10000]$.
- Mỗi phần tử trong mảng $nums$ nằm trong khoảng từ $[-9999, 9999]$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 xuất hiện trong mảng nums và có chỉ số là 4
```

- Ví dụ 2:

```python
Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 không tồn tại trong mảng nums nên trả về -1
```

## Ý tưởng giải quyết

### Ý tưởng: Tìm kiếm nhị phân

Đặt hai biến `left` và `right` là hai đầu mút của mảng, tức là `left = 0` và `right = len(nums) - 1`, đại diện cho khoảng tìm kiếm là $[left, right]$ (đóng ở bên trái và đóng ở bên phải).

Lấy vị trí giữa của hai biến `left` và `right`, tức là `mid = (left + right) // 2`, trước tiên so sánh giá trị tại vị trí giữa `nums[mid]` với giá trị mục tiêu `target`.

- Nếu `target == nums[mid]`, trả về vị trí giữa trực tiếp.
- Nếu `target > nums[mid]`, đặt `left = mid + 1`, sau đó tiếp tục tìm kiếm trong khoảng bên phải $[mid + 1, right]$.
- Nếu `target < nums[mid]`, đặt `right = mid - 1`, sau đó tiếp tục tìm kiếm trong khoảng bên trái $[left, mid - 1]$.

### Ý tưởng: Mã giả

```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        
        # Tìm kiếm target trong khoảng [left, right]
        while left <= right:
            # Lấy vị trí giữa của khoảng
            mid = (left + right) // 2
            # Nếu tìm thấy giá trị mục tiêu, trả về vị trí giữa
            if nums[mid] == target:
                return mid
            # Nếu nums[mid] nhỏ hơn giá trị mục tiêu, tiếp tục tìm kiếm trong khoảng [mid + 1, right]
            elif nums[mid] < target:
                left = mid + 1
            # Nếu nums[mid] lớn hơn giá trị mục tiêu, tiếp tục tìm kiếm trong khoảng [left, mid - 1]
            else:
                right = mid - 1
        # Không tìm thấy phần tử, trả về -1
        return -1
```

### Ý tưởng: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(\log n)$.
- **Độ phức tạp không gian**: $O(1)$.
