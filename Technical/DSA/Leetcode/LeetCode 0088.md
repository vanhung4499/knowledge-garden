---
title: LeetCode 0088
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-26
---

# [0088. Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/)

- Thẻ: Mảng, Con trỏ kép, Sắp xếp
- Độ khó: Dễ

## Tóm tắt bài toán

**Mô tả**: Cho hai mảng đã sắp xếp $nums1$ và $nums2$.

**Yêu cầu**: Gộp mảng $nums2$ vào mảng $nums1$ sao cho $nums1$ trở thành một mảng đã sắp xếp.

**Chú ý**:

- Mảng $nums1$ có kích thước $m + n$, trong đó $m$ phần tử đầu tiên là các phần tử của mảng $nums1$. Mảng $nums2$ có kích thước $n$.
- $nums1.length == m + n$.
- $nums2.length == n$.
- $0 \le m, n \le 200$.
- $1 \le m + n \le 200$.
- $-10^9 \le nums1[i], nums2[j] \le 10^9$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]
Explanation: Cần gộp [1,2,3] và [2,5,6].
Kết quả gộp là [1,2,2,3,5,6], các phần tử in đậm là các phần tử của mảng nums1.
```

- Ví dụ 2:

```python
Input: nums1 = [1], m = 1, nums2 = [], n = 0
Output: [1]
Explanation: Cần gộp [1] và [].
Kết quả gộp là [1].
```

## Ý tưởng giải quyết

### Ý tưởng 1: Con trỏ nhanh và chậm

1. Sử dụng hai con trỏ $index1$ và $index2$ để trỏ vào cuối mảng $nums1$ và $nums2$, và sử dụng một con trỏ $index$ để trỏ vào cuối mảng $nums1$.
2. Từ cuối mảng, so sánh giá trị hiện tại của $nums1[index1]$ và $nums2[index2]$, lưu giá trị lớn hơn vào $nums1[index]$, sau đó tiếp tục duyệt về phía trước.
3. Cuối cùng, gán các phần tử còn lại trong mảng $nums2$ vào vị trí tương ứng trong mảng $nums1$.

### Ý tưởng 1: Code

```python
class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        index1 = m - 1
        index2 = n - 1
        index = m + n - 1
        while index1 >= 0 and index2 >= 0:
            if nums1[index1] < nums2[index2]:
                nums1[index] = nums2[index2]
                index2 -= 1
            else:
                nums1[index] = nums1[index1]
                index1 -= 1
            index -= 1

        nums1[:index2+1] = nums2[:index2+1]
```

### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(m + n)$.
- **Độ phức tạp không gian**: $O(m + n)$.
