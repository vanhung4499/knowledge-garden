---
title: LeetCode 0283
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-25
---

# [0283. Move Zeroes](https://leetcode.com/problems/move-zeroes/)

- Thẻ: Array, Two Pointers
- Độ khó: Dễ

## Đề bài

**Mô tả**: Cho một mảng số nguyên $nums$.

**Yêu cầu**: Di chuyển tất cả các số $0$ về cuối mảng và duy trì thứ tự tương đối của các số khác $0$.

**Giải thích**:

- Chỉ được thực hiện trên mảng gốc.
- $1 \le \text{nums.length} \le 10^4$.
- $-2^{31} \le \text{nums[i]} \le 2^{31} - 1$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums = [0,1,0,3,12]
Output: [1,3,12,0,0]
```

- Ví dụ 2:

```python
Input: nums = [0]
Output: [0]
```

## Ý tưởng

### Ý tưởng 1: Sắp xếp nổi bọt (Bubble Sort)

Ý tưởng của thuật toán là sử dụng sắp xếp nổi bọt để di chuyển các số $0$ về cuối mảng.

Chúng ta có thể sử dụng ý tưởng của thuật toán sắp xếp nổi bọt để di chuyển các phần tử có giá trị $0$ về cuối mảng.

Vì kích thước dữ liệu là $10^4$, và độ phức tạp thời gian của thuật toán sắp xếp nổi bọt là $O(n^2)$. Vì vậy, phương pháp này sẽ gây ra thời gian chạy quá lâu.

### Ý tưởng 2: Con trỏ kép

Sử dụng hai con trỏ $slow$ và $fast$. $slow$ trỏ đến cuối mảng các số khác $0$ đã được xử lý, $fast$ trỏ đến phần tử hiện tại đang xử lý.

Di chuyển con trỏ $fast$ từ trái sang phải, mỗi khi gặp phần tử khác $0$, hoán đổi giá trị của con trỏ $slow$ và $fast$, đồng thời di chuyển con trỏ $slow$ sang phải.

Khi kết thúc vòng lặp, tất cả các số $0$ đã được di chuyển về phía cuối mảng và vẫn duy trì được thứ tự tương đối của các số khác $0$.

## Giải pháp

### Giải pháp 1: Sắp xếp nổi bọt (Bubble Sort)

```python
class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        for i in range(len(nums)):
            for j in range(len(nums) - i - 1):
                if nums[j] == 0 and nums[j + 1] != 0:
                    nums[j], nums[j + 1] = nums[j + 1], nums[j]
```

### Giải pháp 2: Con trỏ kép

```python
class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        slow = 0
        fast = 0
        while fast < len(nums):
            if nums[fast] != 0:
                nums[slow], nums[fast] = nums[fast], nums[slow]
                slow += 1
            fast += 1
```

## Đánh giá độ phức tạp

### Đánh giá độ phức tạp của giải pháp 1

- Thời gian: $O(n^2)$.
- Không gian: $O(1)$.

### Đánh giá độ phức tạp của giải pháp 2

- Thời gian: $O(n)$.
- Không gian: $O(1)$.
