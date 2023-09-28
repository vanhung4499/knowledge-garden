---
title: LeetCode 0503
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-28
---

# [0503. Next Greater Element II](https://leetcode.com/problems/next-greater-element-ii/)

- Thẻ: Ngăn xếp, Mảng, Ngăn xếp đơn điệu
- Độ khó: Trung bình

## Tóm tắt đề bài

Cho một mảng vòng `nums` (phần tử tiếp theo của phần tử cuối cùng là phần tử đầu tiên của mảng).

Yêu cầu: Đưa ra phần tử lớn tiếp theo của mỗi phần tử. Nếu không tồn tại, đưa ra `-1`.

- Phần tử lớn tiếp theo của số `x`: Theo thứ tự duyệt qua mảng, đó là số lớn hơn nó đầu tiên sau nó. Điều này có nghĩa là bạn nên tìm kiếm số lớn tiếp theo của nó một cách vòng tròn.

## Ý tưởng giải quyết

Cách tiếp cận đầu tiên là tìm kiếm trực tiếp theo yêu cầu đề bài. Duyệt qua mảng `nums` và tìm số đầu tiên bên phải của `nums[i]` mà lớn hơn `nums[i]`. Độ phức tạp thời gian của phương pháp này là $O(n^2)$.

Cách tiếp cận thứ hai là sử dụng ngăn xếp đơn điệu. Duyệt qua mảng `nums`, xây dựng ngăn xếp đơn điệu để tìm số lớn tiếp theo của mỗi phần tử trong `nums`. Sau đó, lưu trữ kết quả vào một mảng. Độ phức tạp thời gian của phương pháp này là $O(n)$.

Vì mảng `nums` là một mảng vòng, ta có thể sao chép `nums` thành một bản sao và nối nó vào cuối, tạo thành một mảng có độ dài `len(nums) * 2`, hoặc sử dụng phép chia lấy dư để ánh xạ chỉ số vào khoảng từ `0` đến `len(nums) * 2 - 1`.

Cụ thể như sau:

- Sử dụng mảng `res` để lưu kết quả, khởi tạo tất cả các giá trị ban đầu là `-1`. Sử dụng ngăn xếp `stack` để biểu diễn ngăn xếp đơn điệu.
- Duyệt qua mảng `nums`, đối với phần tử hiện tại:
  - Nếu giá trị phần tử hiện tại nhỏ hơn giá trị phần tử đỉnh ngăn xếp, thì phần tử hiện tại và phần tử đỉnh ngăn xếp có cùng giá trị "phần tử lớn tiếp theo". Đưa chỉ số phần tử hiện tại vào ngăn xếp.
  - Nếu giá trị phần tử hiện tại lớn hơn giá trị phần tử đỉnh ngăn xếp, thì phần tử hiện tại là "phần tử lớn tiếp theo" của phần tử đỉnh ngăn xếp. Tiếp tục đẩy phần tử ra khỏi ngăn xếp cho đến khi giá trị phần tử hiện tại nhỏ hơn giá trị phần tử đỉnh ngăn xếp.
    - Khi đẩy phần tử ra khỏi ngăn xếp, phần tử đó là "phần tử lớn tiếp theo" của phần tử hiện tại. Lưu giá trị phần tử hiện tại vào mảng kết quả `res` tại vị trí tương ứng với phần tử đỉnh ngăn xếp.
- Trả về mảng kết quả `res`.

## Code

```python
class Solution:
    def nextGreaterElements(self, nums: List[int]) -> List[int]:
        size = len(nums)
        res = [-1] * size
        stack = []
        for i in range(size * 2):
            while stack and nums[i % size] > nums[stack[-1]]:
                index = stack.pop()
                res[index] = nums[i % size]
            stack.append(i % size)

        return res
```

## Ý tưởng: Độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$.
- **Độ phức tạp không gian**: $O(n)$.
