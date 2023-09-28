---
title: LeetCode 0084
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-28
---

# [0084. Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)

- Thẻ: Ngăn xếp, Mảng, Ngăn xếp đơn điệu
- Độ khó: Khó

## Tóm tắt đề bài

Cho một mảng số nguyên không âm `heights`, `heights[i]` được sử dụng để biểu thị chiều cao của cột tương ứng trong biểu đồ cột. Mỗi cột kề nhau và có chiều rộng là 1.

Yêu cầu: Tính toán diện tích của hình chữ nhật lớn nhất mà có thể được hình thành từ các cột trong biểu đồ.

## Ý tưởng giải quyết

Có một số cách tiếp cận để giải quyết bài toán này. Dưới đây là một cách tiếp cận sử dụng ngăn xếp đơn điệu.

- Thêm một phần tử `0` vào cuối mảng `heights` để đảm bảo rằng tất cả các cột đều được xem xét.
- Khởi tạo biến `ans` để lưu kết quả, và một ngăn xếp rỗng `stack`.
- Duyệt qua từng cột trong mảng `heights`:
	- Nếu ngăn xếp không rỗng và chiều cao của cột hiện tại nhỏ hơn hoặc bằng chiều cao của cột đỉnh ngăn xếp, thực hiện các bước sau:
		- Lấy phần tử đỉnh ngăn xếp ra khỏi ngăn xếp, gán cho biến `cur`.
		- Tính toán chỉ số `left` và `right` của hình chữ nhật lớn nhất có thể được tạo thành từ cột hiện tại và cột đỉnh ngăn xếp.
		- Tính diện tích của hình chữ nhật và so sánh với `ans`, lưu giá trị lớn nhất.
	- Đẩy chỉ số của cột hiện tại vào ngăn xếp.
- Trả về kết quả `ans`.

## Code

```python
class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        heights.append(0)
        ans = 0
        stack = []
        for i in range(len(heights)):
            while stack and heights[stack[-1]] >= heights[i]:
                cur = stack.pop(-1)
                left = stack[-1] + 1 if stack else 0
                right = i - 1
                ans = max(ans, (right - left + 1) * heights[cur])
            stack.append(i)

        return ans
```

## Độ phức tạp

- Độ phức tạp thời gian: $O(n)$.
- Độ phức tạp không gian: $O(n)$.
