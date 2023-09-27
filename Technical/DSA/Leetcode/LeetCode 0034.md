---
title: LeetCode 0034
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-26
---

# [0034. Tìm vị trí đầu tiên và cuối cùng của phần tử trong mảng đã sắp xếp](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

- Thẻ: Mảng, Tìm kiếm nhị phân
- Độ khó: Trung bình

## Tóm tắt đề bài

**Mô tả**: Cho một mảng số nguyên $nums$ đã được sắp xếp theo thứ tự không giảm và một giá trị mục tiêu $target$.

**Yêu cầu**: Tìm vị trí bắt đầu và kết thúc của giá trị mục tiêu trong mảng.

**Giải thích**:

- Yêu cầu sử dụng thuật toán có độ phức tạp thời gian là $O(\log n)$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums = [5,7,7,8,8,10], target = 8
Output: [3,4]
```

- Ví dụ 2:

```python
Input: nums = [5,7,7,8,8,10], target = 6
Output: [-1,-1]
```

## Ý tưởng

### Ý tưởng 1: Tìm kiếm nhị phân

Thực hiện hai lần tìm kiếm nhị phân, lần đầu tiên tìm kiếm sang trái càng xa càng tốt. Lần thứ hai tìm kiếm sang phải càng xa càng tốt.

### Ý tưởng 1: Code

```python
class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        ans = [-1, -1]
        n = len(nums)
        if n == 0:
            return ans

        left = 0
        right = n - 1
        while left < right:
            mid = left + (right - left) // 2
            if nums[mid] < target:
                left = mid + 1
            else:
                right = mid

        if nums[left] != target:
            return ans

        ans[0] = left

        left = 0
        right = n - 1
        while left < right:
            mid = left + (right - left + 1) // 2
            if nums[mid] > target:
                right = mid - 1
            else:
                left = mid

        if nums[left] == target:
            ans[1] = left

        return ans
```

### Ý tưởng 1: Độ phức tạp

- **Độ phức tạp thời gian**: $O(\log n)$.
- **Độ phức tạp không gian**: $O(1)$.

### Ý tưởng 2: Sử dụng thư viện

Bản chất thì việc sử dụng thư viện cũng là tìm kiếm nhị phân nhưng chúng ta có thể viết code ngắn gọn hơn nhưng vẫn khuyến khích các bạn tự triển khai để hiểu hơn về tìm kiếm nhị phân. Trong Python, ta dùng `bisect.bisect_left`, trong C++ ta dùng hàm `lower_bound` và `upper_bound`. Các ngôn ngữ tôi không nắm rõ nên không trình bày.

### Ý tưởng 2: Code

```python
class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        l = bisect_left(nums, target)
        r = bisect_left(nums, target + 1)
        return [-1, -1] if l == len(nums) or l >= r else [l, r - 1]
```

```c++
class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        int l = lower_bound(nums.begin(), nums.end(), target) - nums.begin();
        if (l == nums.size() || nums[l] != target) 
            return {-1, -1};
        int r = upper_bound(nums.begin(), nums.end(), target) - nums.begin() - 1;
        return {l, r};
    }
};
```

### Ý tưởng 2: Độ phức tạp

- **Độ phức tạp thời gian**: $O(\log n)$.
- **Độ phức tạp không gian**: $O(1)$.
