---
title: LeetCode 0167
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-26
date modified: 2023-09-26
---

# [0167. Tổng hai số II - Mảng đã sắp xếp](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)

- Thẻ: Mảng, Con trỏ kép, Tìm kiếm nhị phân
- Độ khó: Trung bình

## Tóm tắt đề bài

**Mô tả**: Cho một mảng số nguyên $numbers$ được sắp xếp theo thứ tự tăng dần và một giá trị mục tiêu $target$.

**Yêu cầu**: Tìm hai số trong mảng có tổng bằng $target$ và trả về chỉ số của hai số đó trong mảng.

**Giải thích**:

- $2 \le \text{{numbers.length}} \le 3 \times 10^4$.
- $-1000 \le \text{{numbers[i]}} \le 1000$.
- $numbers$ được sắp xếp theo thứ tự không giảm.
- $-1000 \le \text{{target}} \le 1000$.
- Chỉ có một kết quả duy nhất.

**Ví dụ**:

- Ví dụ 1:

```python
Input: numbers = [2,7,11,15], target = 9
Output: [1,2]
Explanation: 2 + 7 = 9. Vì vậy, index1 = 1, index2 = 2. Trả về [1, 2].
```

- Ví dụ 2:

```python
Input: numbers = [2,3,4], target = 6
Output: [1,3]
Explanation: 2 + 4 = 6. Vì vậy, index1 = 1, index2 = 3. Trả về [1, 3].
```

## Ý tưởng

### Ý tưởng 1: Tìm kiếm nhị phân

Vì mảng đã được sắp xếp, nên có thể sử dụng tìm kiếm nhị phân để giảm độ phức tạp thời gian. Cách làm cụ thể như sau:

1. Sử dụng một vòng lặp duy nhất để duyệt qua mảng, lần lượt chọn một số cố định, tức là $numbers[i]$.
2. Sau đó, sử dụng tìm kiếm nhị phân để tìm số thứ hai thỏa mãn yêu cầu.
3. Sử dụng hai con trỏ $left$ và $right$. $left$ trỏ đến phần tử đầu tiên của mảng, $right$ trỏ đến phần tử có giá trị lớn nhất trong mảng.
4. Kiểm tra tổng của số thứ nhất $numbers[i]$ và số giữa hai con trỏ $numbers[mid]$ với giá trị mục tiêu.
   1. Nếu $numbers[mid] + numbers[i] < target$, loại bỏ khoảng không thể có $[left, mid]$, tiếp tục tìm kiếm trong khoảng $[mid + 1, right]$.
   2. Nếu $numbers[mid] + numbers[i] \ge target$, số thứ hai có thể nằm trong khoảng $[left, mid]$, tiếp tục tìm kiếm trong khoảng $[left, mid]$.
5. Tiếp tục cho đến khi $left$ và $right$ di chuyển đến cùng một vị trí dừng lại. Nếu $numbers[left] + numbers[i] == target$, trả về vị trí của hai số $[left + 1, i + 1]$ (chỉ số bắt đầu từ $1$).
6. Nếu không tìm thấy, trả về $[-1, -1]$.

### Ý tưởng 1: Code

```python
class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        for i in range(len(numbers)):
            left, right = i + 1, len(numbers) - 1
            while left < right:
                mid = left + (right - left) // 2
                if numbers[mid] + numbers[i] < target:
                    left = mid + 1
                else:
                    right = mid
            if numbers[left] + numbers[i] == target:
                return [i + 1, left + 1]

        return [-1, -1]
```

### Ý tưởng 1: Độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times \log n)$.
- **Độ phức tạp không gian**: $O(1)$.

### Ý tưởng 2: Con trỏ kép

Có thể sử dụng con trỏ kép để giảm độ phức tạp thời gian. Cách làm cụ thể như sau:

1. Sử dụng hai con trỏ $left$ và $right$. $left$ trỏ đến phần tử đầu tiên của mảng, $right$ trỏ đến phần tử có giá trị lớn nhất trong mảng.
2. Kiểm tra tổng của hai phần tử tại vị trí $left$ và $right$ với giá trị mục tiêu.
   1. Nếu tổng bằng giá trị mục tiêu, trả về vị trí của hai phần tử.
   2. Nếu tổng lớn hơn giá trị mục tiêu, di chuyển $right$ sang trái để giảm tổng.
   3. Nếu tổng nhỏ hơn giá trị mục tiêu, di chuyển $left$ sang phải để tăng tổng.
3. Tiếp tục cho đến khi $left$ và $right$ di chuyển đến cùng một vị trí dừng lại.
4. Nếu không tìm thấy, trả về $[-1, -1]$.

### Ý tưởng 2: Code

```python
class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        left = 0
        right = len(numbers) - 1
        while left < right:
            total = numbers[left] + numbers[right]
            if total == target:
                return [left + 1, right + 1]
            elif total < target:
                left += 1
            else:
                right -= 1
        return [-1, -1]
```

### Ý tưởng 2: Độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$.
- **Độ phức tạp không gian**: $O(1)$. Chỉ sử dụng một số biến hằng số để lưu trữ.
