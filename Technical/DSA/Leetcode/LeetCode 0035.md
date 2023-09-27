---
title: LeetCode 0035
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-26
---

# [0035. Tìm vị trí chèn](https://leetcode.com/problems/search-insert-position/)

- Thẻ: Mảng, Tìm kiếm nhị phân
- Độ khó: Dễ

## Ý tưởng

**Mô tả**: Cho một mảng đã được sắp xếp $nums$ và một giá trị mục tiêu $target$.

**Yêu cầu**: Tìm vị trí của giá trị mục tiêu trong mảng và trả về chỉ số tương ứng. Nếu không tìm thấy, trả về vị trí mà giá trị mục tiêu sẽ được chèn vào mảng theo thứ tự.

**Giải thích**:

- $1 \le \text{{nums.length}} \le 10^4$.
- $-10^4 \le \text{{nums[i]}} \le 10^4$.
- $nums$ là một mảng đã được sắp xếp theo thứ tự tăng dần và không có phần tử trùng lặp.
- $-10^4 \le \text{{target}} \le 10^4$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums = [1,3,5,6], target = 5
Output: 2
```

## Ý tưởng

### Ý tưởng 1: Tìm kiếm nhị phân

Đặt hai con trỏ ở hai đầu mảng, tức là `left = 0`, `right = len(nums) - 1`, đại diện cho phạm vi tìm kiếm là $[left, right]$ (đóng bên trái và bên phải).

Lấy vị trí trung tâm $mid$ của hai con trỏ và so sánh giá trị tại vị trí trung tâm $nums[mid]$ với giá trị mục tiêu $target$.

- Nếu $target == nums[mid]$, thì vị trí trung tâm hiện tại là vị trí mục tiêu cần chèn vào mảng.
- Nếu $target > nums[mid]$, thì đặt con trỏ bên trái là $mid + 1$, sau đó tiếp tục tìm kiếm trong phạm vi bên phải $[mid + 1, right]$.
- Nếu $target < nums[mid]$, thì đặt con trỏ bên phải là $mid - 1$, sau đó tiếp tục tìm kiếm trong phạm vi bên trái $[left, mid - 1]$.

Tiếp tục tìm kiếm cho đến khi tìm thấy giá trị mục tiêu và trả về vị trí cần chèn vào mảng, hoặc dừng tìm kiếm khi $left > right$, lúc này vị trí của $left$ chính là vị trí cần chèn vào mảng.

### Ý tưởng 1: Code Tìm kiếm nhị phân

```python
class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        size = len(nums)
        left, right = 0, size - 1

        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1

        return left
```

### Ý tưởng 1: Độ phức tạp

- **Độ phức tạp thời gian**: $O(\log n)$. Độ phức tạp thời gian của thuật toán tìm kiếm nhị phân là $O(\log n)$.
- **Độ phức tạp không gian**: $O(1)$. Chỉ sử dụng một số biến hằng số để lưu trữ.
