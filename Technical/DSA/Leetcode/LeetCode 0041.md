---
title: LeetCode 0041
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-29
---

# [0041. First Missing Positive](https://leetcode.com/problems/first-missing-positive/)

- Thẻ: Mảng, Bảng băm
- Độ khó: Khó

## Tóm tắt đề bài

**Mô tả**: Cho một mảng số nguyên chưa được sắp xếp `nums`.

**Yêu cầu**: Tìm số nguyên dương nhỏ nhất không xuất hiện trong mảng.

**Giới hạn**:

- $1 \le \text{nums.length} \le 5 \times 10^5$.
- $-2^{31} \le \text{nums[i]} \le 2^{31} - 1$.
- Yêu cầu thực hiện với độ phức tạp thời gian $O(n)$ và chỉ sử dụng không gian bổ sung cấp số nhân.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums = [1,2,0]
Output: 3
```

- Ví dụ 2:

```python
Input: nums = [3,4,-1,1]
Output: 2
```

## Ý tưởng giải quyết

### Ý tưởng 1: Bảng băm, bảng băm trong chính mảng

Nếu sử dụng bảng băm thông thường, chúng ta chỉ cần duyệt qua mảng một lần, lưu trữ các số nguyên tương ứng vào bảng băm và kiểm tra từ `1` trở đi xem số nguyên dương tương ứng có xuất hiện trong bảng băm hay không. Tuy nhiên, phương pháp này có độ phức tạp không gian là $O(n)$, không đáp ứng yêu cầu về không gian bổ sung cấp số nhân.

Chúng ta có thể coi mảng hiện tại như một bảng băm. Một mảng có độ dài `n` tương ứng với các giá trị phần tử từ `[1, n + 1]`, trong đó còn thiếu một phần tử.

1. Chúng ta có thể duyệt qua mảng một lần, đặt phần tử hiện tại vào vị trí tương ứng của nó (ví dụ: phần tử có giá trị `1` đặt vào vị trí thứ `0` của mảng, phần tử có giá trị `2` đặt vào vị trí thứ `1` của mảng, và cứ tiếp tục như vậy).
2. Sau đó, chúng ta duyệt qua mảng một lần nữa. Nếu gặp phần tử đầu tiên không bằng chỉ số + 1, đó chính là số nguyên dương nhỏ nhất bị thiếu.
3. Nếu duyệt qua mảng mà không tìm thấy số nguyên dương bị thiếu, thì số nguyên dương bị thiếu là `n + 1`.
4. Cuối cùng, chúng ta trả về số nguyên dương bị thiếu mà chúng ta đã tìm thấy.

### Ý tưởng 1: Code

```python
class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        size = len(nums)

        for i in range(size):
            while 1 <= nums[i] <= size and nums[i] != nums[nums[i] - 1]:
                index1 = i
                index2 = nums[i] - 1
                nums[index1], nums[index2] = nums[index2], nums[index1]

        for i in range(size):
            if nums[i] != i + 1:
                return i + 1
        return size + 1
```

### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$, trong đó $n$ là số lượng phần tử trong mảng `nums`.
- **Độ phức tạp không gian**: $O(1)$.
