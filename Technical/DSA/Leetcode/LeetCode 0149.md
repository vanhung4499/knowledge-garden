---
title: LeetCode 0149
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-29
---

# [149. Max Points on a Line](https://leetcode.com/problems/max-points-on-a-line/)

- Thẻ: Hình học, Mảng, Bảng băm, Toán học
- Độ khó: Khó

## Tóm tắt đề bài

Cho một mảng `points` chứa tọa độ của `n` điểm trên mặt phẳng, hãy tìm số lượng lớn nhất các điểm nằm trên cùng một đường thẳng.

## Ý tưởng giải quyết

Hai điểm có thể xác định một đường thẳng, giả sử cố định một điểm, ta có thể tính được độ dốc giữa các điểm còn lại với điểm đó. Nếu độ dốc giống nhau, các điểm đó sẽ nằm trên cùng một đường thẳng. Ta có thể sử dụng bảng băm để lưu trữ số lượng điểm trên các đường thẳng khác nhau đi qua một điểm cố định.

Đối với điểm thứ `i`, ta chỉ cần xem xét các điểm ở vị trí `(i+1, n-1)`, vì các điểm trước đó đã được xem xét khi xét điểm `i-1`.

Công thức tính độ dốc là $\frac{dy}{dx} = \frac{y_j - y_i}{x_j - x_i}$.

Vì độ dốc là số thập phân có thể có sai số, nên ta sẽ sử dụng cặp `(dx, dy)` làm khóa của bảng băm.

> Lưu ý:
>
> Cần xử lý trường hợp độ dốc là bội số, trường hợp `dy` và `dx` trái dấu, cũng như xử lý trường hợp đường thẳng đứng (khi `dx` giống nhau) và đường thẳng ngang (khi `dy` giống nhau).

## Độ phức tạp thời gian

- $O(n^2)$, trong đó $n$ là số lượng điểm trong mảng `points`.

## Mã giả

```python
class Solution:
    def maxPoints(self, points: List[List[int]]) -> int:
        n = len(points)
        if n < 3:
            return n
        ans = 0
        for i in range(n):
            line_dict = dict()
            line_dict[0] = 0
            same = 1
            for j in range(i+1, n):
                dx = points[j][0] - points[i][0]
                dy = points[j][1] - points[i][1]
                if dx == 0 and dy == 0:
                    same += 1
                    continue
                gcd_dx_dy = math.gcd(abs(dx), abs(dy))
                if (dx > 0 and dy > 0) or (dx < 0 and dy < 0):
                    dx = abs(dx) // gcd_dx_dy
                    dy = abs(dy) // gcd_dx_dy
                elif dx < 0 and dy > 0:
                    dx = -dx // gcd_dx_dy
                    dy = -dy // gcd_dx_dy
                elif dx > 0 and dy < 0:
                    dx = dx // gcd_dx_dy
                    dy = dy // gcd_dx_dy
                elif dx == 0 and dy != 0:
                    dy = 1
                elif dx != 0 and dy == 0:
                    dx = 1
                key = (dx, dy)
                if key in line_dict:
                    line_dict[key] += 1
                else:
                    line_dict[key] = 1
            ans = max(ans, same + max(line_dict.values()))
        return ans
```
