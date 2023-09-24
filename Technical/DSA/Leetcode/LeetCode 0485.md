---
title: LeetCode 0485
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-24
---

# [0485. Max Consecutive Ones](https://leetcode.com/problems/max-consecutive-ones/)

- Tags: Mảng
- Độ khó: Dễ

## Tóm tắt đề bài

**Mô tả**: Cho một mảng nhị phân $nums$, mảng chỉ chứa các số $0$ và $1$.

**Yêu cầu**: Tính số lượng số $1$ liên tiếp lớn nhất trong mảng.

**Giới hạn**:

- $1 \le \text{nums.length} \le 10^5$.
- $\text{nums}[i]$ chỉ có thể là $0$ hoặc $1$.

**Ví dụ**:

- Ví dụ 1:

```
Input: nums = [1,1,0,1,1,1]
Output: 3
Explanation: Có hai số $1$ liên tiếp ở đầu và ba số $1$ liên tiếp ở cuối, vì vậy số lượng số $1$ liên tiếp lớn nhất là $3$.
```

- Ví dụ 2:

```
Input: nums = [1,0,1,1,0,1]
Output: 2
```

## Ý tưởng giải quyết

### Ý tưởng 1: Duyệt mảng một lần

1. Sử dụng hai biến $cnt$ và $ans$. $cnt$ để lưu trữ số lượng số $1$ liên tiếp hiện tại, $ans$ để lưu trữ số lượng số $1$ liên tiếp lớn nhất.
2. Tiến hành duyệt qua mảng một lần, đếm số lượng số $1$ liên tiếp hiện tại và cập nhật số lượng số $1$ liên tiếp lớn nhất.
3. Trả về $ans$ là kết quả.

### Ý tưởng 1: Cài đặt

```python
class Solution:
    def findMaxConsecutiveOnes(self, nums: List[int]) -> int:
        ans = 0
        cnt = 0
        for num in nums:
            if num == 1:
                cnt += 1
                ans = max(ans, cnt)
            else:
                cnt = 0
        return ans
```

### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$.
- **Độ phức tạp không gian**: $O(1)$.
