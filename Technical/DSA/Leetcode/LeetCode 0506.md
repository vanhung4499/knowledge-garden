---
title: LeetCode 0506
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-26
date modified: 2023-09-26
---

# [0506. Relative Ranks](https://leetcode-cn.com/problems/relative-ranks/)

- Thẻ: Mảng, Sắp xếp, Hàng đợi ưu tiên (Heap)
- Độ khó: Dễ

## Tóm tắt bài toán

**Mô tả**: Cho một mảng $score$ có độ dài $n$. Trong đó, $score[i]$ đại diện cho điểm số của người chơi thứ $i$ trong một cuộc thi. Tất cả các điểm số đều khác nhau.

**Yêu cầu**: Tìm ra xếp hạng tương đối của từng người chơi và trao giải cho ba người đứng đầu. Ba người đứng đầu sẽ được trao lần lượt "Huy chương vàng" (`"Gold Medal"`), "Huy chương bạc" (`"Silver Medal"`) và "Huy chương đồng" (`"Bronze Medal"`).

**Chú ý**:

- $n == score.length$.
- $1 \le n \le 10^4$.
- $0 \le score[i] \le 10^6$.
- Tất cả các giá trị trong mảng $score$ đều khác nhau.

**Ví dụ**:

- Ví dụ 1:

```python
Input: score = [5,4,3,2,1]
Output: ["Gold Medal","Silver Medal","Bronze Medal","4","5"]
Explanation: Xếp hạng lần lượt là [1st, 2nd, 3rd, 4th, 5th].
```

- Ví dụ 2:

```python
Input: score = [10,3,8,9,4]
Output: ["Gold Medal","5","Bronze Medal","Silver Medal","4"]
Explanation: Xếp hạng lần lượt là [1st, 5th, 3rd, 2nd, 4th].
```

## Ý tưởng giải quyết

### Ý tưởng 1: Sắp xếp

1. Sắp xếp mảng $score$ theo thứ tự tăng dần.
2. Thay thế ba phần tử ở vị trí đầu tiên bằng các chuỗi tương ứng: `"Gold Medal"`, `"Silver Medal"`, `"Bronze Medal"`.

### Ý tưởng 1: Mã giả

```python
class Solution:
    def shellSort(self, arr):
        size = len(arr)
        gap = size // 2

        while gap > 0:
            for i in range(gap, size):
                temp = arr[i]
                j = i
                while j >= gap and arr[j - gap] < temp:
                    arr[j] = arr[j - gap]
                    j -= gap
                arr[j] = temp
            gap = gap // 2
        return arr

    def findRelativeRanks(self, score: List[int]) -> List[str]:
        nums = score.copy()
        nums = self.shellSort(nums)
        score_map = dict()
        for i in range(len(nums)):
            score_map[nums[i]] = i + 1

        res = []
        for i in range(len(score)):
            if score[i] == nums[0]:
                res.append("Gold Medal")
            elif score[i] == nums[1]:
                res.append("Silver Medal")
            elif score[i] == nums[2]:
                res.append("Bronze Medal")
            else:
                res.append(str(score_map[score[i]]))
        return res
```

### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times \log n)$. Vì sử dụng thuật toán sắp xếp Shell với độ phức tạp thời gian là $O(n \times \log n)$.
- **Độ phức tạp không gian**: $O(n)$.
