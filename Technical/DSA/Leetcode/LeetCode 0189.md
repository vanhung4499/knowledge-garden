---
title: LeetCode 0189
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-24
---

# [0189. Rotate Array](https://leetcode.com/problems/rotate-array/)

- Nhãn: Mảng, Toán học, Con trỏ hai chiều
- Độ khó: Trung bình

## Đề bài

**Mô tả**: Cho một mảng $nums$ và một số nguyên $k$.

**Yêu cầu**: Di chuyển các phần tử trong mảng sang phải $k$ vị trí.

**Giải thích**:

- $1 \le \text{nums.length} \le 10^5$.
- $-2^{31} \le \text{nums[i]} \le 2^{31} - 1$.
- $0 \le k \le 10^5$.
- Giải quyết bài toán này bằng cách sử dụng thuật toán không sử dụng không gian bổ sung với độ phức tạp $O(1)$.

**Ví dụ**:

- Ví dụ 1:

```
Input: nums = [1,2,3,4,5,6,7], k = 3
Output: [5,6,7,1,2,3,4]
Explanation:
Dịch phải 1 bước: [7,1,2,3,4,5,6]
Dịch phải 2 bước: [6,7,1,2,3,4,5]
Dịch phải 3 bước: [5,6,7,1,2,3,4]
```

- Ví dụ 2:

```
Input: nums = [-1,-100,3,99], k = 2
Output: [3,99,-1,-100]
Explanation: 
Dịch phải 1 bước: [99,-1,-100,3]
Dịch phải 2 bước: [3,99,-1,-100]
```

## Ý tưởng

### Ý tưởng 1: Đảo ngược mảng

Chúng ta có thể tạo một mảng mới và lưu trữ $k$ phần tử cuối cùng của mảng gốc, sau đó lưu trữ $n-k$ phần tử đầu tiên của mảng gốc. Tuy nhiên, yêu cầu của đề bài là không sử dụng không gian bổ sung, vì vậy chúng ta cần thực hiện các thao tác trên mảng gốc.

Một cách để giải quyết vấn đề này là chúng ta có thể đảo ngược toàn bộ mảng, sau đó đảo ngược $k$ phần tử đầu tiên và $n-k$ phần tử còn lại. Kết quả cuối cùng sẽ là mảng đã được xoay.

### Ý tưởng 1: Cài đặt

```python
class Solution:
    def rotate(self, nums: List[int], k: int) -> None:
        n = len(nums)
        k = k % n
        self.reverse(nums, 0, n - 1)
        self.reverse(nums, 0, k - 1)
        self.reverse(nums, k, n - 1)
        
    def reverse(self, nums, left, right):
        while left < right:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
            right -= 1
```

### Ý tưởng 1: Độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$. Đảo ngược mảng có độ phức tạp thời gian là $O(n)$.
- **Độ phức tạp không gian**: $O(1)$.
