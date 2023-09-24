---
title: LeetCode 0724
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-24
---

# [0724. Find Pivot Index](https://leetcode.com/problems/find-pivot-index/)

- Nhãn: Mảng, Tổng tiền tố
- Độ khó: Dễ

## Đề bài

**Mô tả**: Cho một mảng $nums$.

**Yêu cầu**: Tìm vị trí "trung tâm" trong mảng, nghĩa là vị trí mà tổng các phần tử bên trái bằng tổng các phần tử bên phải. Nếu không tìm thấy, trả về $-1$.

**Giải thích**:

- $1 \le \text{nums.length} \le 10^4$.
- $-1000 \le \text{nums[i]} \le 1000$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums = [1, 7, 3, 6, 5, 6]
Output: 3
Explanation:
Vị trí trung tâm là 3.
Tổng các số bên trái sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11,
Tổng các số bên phải sum = nums[4] + nums[5] = 5 + 6 = 11, hai tổng bằng nhau.
```

- Ví dụ 2:

```python
Input: nums = [1, 2, 3]
Output: -1
Explanation:
Không có vị trí trung tâm thỏa mãn trong mảng.
```

## Ý tưởng

### Ý tưởng 1: Duyệt hai lần

Duyệt hai lần, lần đầu tiên tính tổng của toàn bộ mảng. Lần thứ hai duyệt để tìm vị trí mà tổng của các phần tử bên trái bằng một nửa tổng của toàn bộ mảng.

### Ý tưởng 1: Cài đặt

```python
class Solution:
    def pivotIndex(self, nums: List[int]) -> int:
        nums_sum = sum(nums)
        curr_sum = 0
        for i in range(len(nums)):
            if curr_sum * 2 + nums[i] == nums_sum:
                return i
            curr_sum += nums[i]
        return -1
```

### Ý tưởng 1: Độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$. Độ phức tạp thời gian của hai vòng lặp là $O(2 \times n)$, $O(2 \times n) = O(n)$.
- **Độ phức tạp không gian**: $O(1)$.
