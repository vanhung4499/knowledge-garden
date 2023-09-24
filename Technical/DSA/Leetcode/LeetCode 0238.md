---
title: LeetCode 0238
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-24
---

# [238. Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/)

- Tags: Mảng, Tổng tiền tố
- Độ khó: Trung bình

## Tóm tắt đề bài

**Mô tả**: Cho một mảng số nguyên $nums$.

**Yêu cầu**: Trả về một mảng $answer$, trong đó $answer[i]$ bằng tích của tất cả các phần tử trong mảng $nums$ ngoại trừ $nums[i]$.

**Giới hạn**:

- Dữ liệu đảm bảo tích của tất cả các phần tử tiền tố và hậu tố của mảng $nums$ đều nằm trong phạm vi số nguyên 32 bit.
- Không được sử dụng phép chia và giải quyết vấn đề trong thời gian $O(n)$.
- **Nâng cao**: Giải quyết vấn đề trong không gian phụ $O(1)$.
- $2 \le \text{nums.length} \le 10^5$.
- $-30 \le \text{nums[i]} \le 30$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums = [1,2,3,4]
Output: [24,12,8,6]
```

- Ví dụ 2:

```python
Input: nums = [-1,1,0,-3,3]
Output: [0,0,9,0,0]
```

## Ý tưởng giải quyết

### Ý tưởng 1: Duyệt mảng hai lần

1. Tạo một mảng $res$ có cùng độ dài với mảng $nums$.
2. Duyệt mảng $nums$ từ trái sang phải, tính tích của các phần tử bên trái $nums[i]$ và lưu vào mảng $res$.
3. Duyệt mảng $nums$ từ phải sang trái, tính tích của các phần tử bên phải $nums[i]$ và nhân với giá trị ban đầu của $res[i]$ để có kết quả cuối cùng.

### Ý tưởng 1: Cài đặt

```python
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        res = [1] * n

        left = 1
        for i in range(n):
            res[i] *= left
            left *= nums[i]

        right = 1
        for i in range(n-1, -1, -1):
            res[i] *= right
            right *= nums[i]
        return res
```

### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$.
- **Độ phức tạp không gian**: $O(1)$.
