---
title: LeetCode 0169
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-26
---

# [0169. Majority Element](https://leetcode.com/problems/majority-element/)

- Thẻ: Mảng, Bảng băm, Phân chia, Đếm, Sắp xếp
- Độ khó: Dễ

## Tóm tắt bài toán

**Mô tả**: Cho một mảng `nums` có kích thước $n$.

**Yêu cầu**: Trả về phần tử xuất hiện nhiều nhất trong mảng.

**Chú ý**:

- $n == nums.length$.
- $1 \le n \le 5 * 10^4$.
- $-10^9 \le nums[i] \le 10^9$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums = [3,2,3]
Output: 3
```

- Ví dụ 2:

```python
Input: nums = [2,2,1,1,1,2,2]
Output: 2
```

## Ý tưởng giải quyết

### Ý tưởng 1: Bảng băm

1. Duyệt qua mảng `nums`.
2. Đối với mỗi phần tử `num`, sử dụng bảng băm để đếm số lần xuất hiện của từng phần tử.
3. Duyệt qua bảng băm, tìm phần tử có số lần xuất hiện nhiều nhất.

### Ý tưởng 1: Mã giả

```python
class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        numDict = dict()
        for num in nums:
            if num in numDict:
                numDict[num] += 1
            else:
                numDict[num] = 1
        max = float('-inf')
        max_index = -1
        for num in numDict:
            if numDict[num] > max:
                max = numDict[num]
                max_index = num
        return max_index
```

### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$.
- **Độ phức tạp không gian**: $O(n)$.
