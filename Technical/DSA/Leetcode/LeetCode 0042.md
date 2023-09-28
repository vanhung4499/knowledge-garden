---
title: LeetCode 0042
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-28
---

# [0042. Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/)

- Nhãn: Stack, Mảng, Con trỏ kép, Quy hoạch động, Stack đơn điệu
- Độ khó: Khó

## Tóm tắt đề bài

**Mô tả**: Cho `n` số nguyên không âm biểu thị đồ thị chiều cao của `n` cột có chiều rộng `1`, được biểu diễn bằng mảng `height`, trong đó `height[i]` biểu thị chiều cao của cột thứ `i`.

**Yêu cầu**: Tính toán số lượng nước mà đồ thị có thể nhận được sau khi mưa.

**Giải thích**:

- $n == height.length$.
- $1 \le n \le 2 * 10^4$.
- $0 \le height[i] \le 10^5$.

**Ví dụ**:

- Ví dụ 1:

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/10/22/rainwatertrap.png)

```python
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: Trên là đồ thị chiều cao được biểu diễn bằng mảng [0,1,0,2,1,0,1,3,2,1,2,1]. Trong trường hợp này, có thể nhận được 6 đơn vị nước (phần màu xanh biểu thị nước mưa).
```

- Ví dụ 2:

```python
Input: height = [4,2,0,3,2,5]
Output: 9
```

## Ý tưởng

### Ý tưởng 1: Stack đơn điệu

1. Duyệt qua mảng chiều cao `height`.
2. Nếu chiều cao cột hiện tại nhỏ hơn hoặc bằng chiều cao cột đỉnh của stack, thì đẩy chiều cao cột hiện tại vào stack.
3. Nếu chiều cao cột hiện tại lớn hơn chiều cao cột đỉnh của stack, tiếp tục đẩy cột đỉnh của stack ra khỏi stack cho đến khi chiều cao cột hiện tại nhỏ hơn hoặc bằng chiều cao cột đỉnh của stack.
4. Giả sử cột hiện tại là `C`, cột bị đẩy ra khỏi stack là `B`, cột đỉnh mới của stack là `A`. Khi đó:
	1. Cột hiện tại `C` là cột đầu tiên mà cột bị đẩy ra khỏi stack `B` tìm thấy từ bên phải có chiều cao lớn hơn cột hiện tại. Vì vậy, có thể mở rộng chiều rộng từ cột bị đẩy ra khỏi stack `B` sang phải đến cột hiện tại `C`.
	2. Cột đỉnh mới của stack `A` là cột đầu tiên mà cột bị đẩy ra khỏi stack `B` tìm thấy từ bên trái có chiều cao lớn hơn cột hiện tại. Vì vậy, có thể mở rộng chiều rộng từ cột bị đẩy ra khỏi stack `B` sang trái đến cột đỉnh mới của stack `A`.
5. Sau khi đẩy ra khỏi stack, sử dụng cột đỉnh mới của stack `A` làm biên trái, sử dụng cột hiện tại `C` làm biên phải, sử dụng hiệu chênh lệch chiều cao giữa biên trái và biên phải với chiều cao cột bị đẩy ra khỏi stack `B` làm chiều cao, tính toán diện tích có thể nhận được nước. Sau đó, ghi lại và cập nhật diện tích tích lũy.

### Ý tưởng 1: Code

```python
class Solution:
    def trap(self, height: List[int]) -> int:
        ans = 0
        stack = []
        size = len(height)
        for i in range(size):
            while stack and height[i] > height[stack[-1]]:
                cur = stack.pop(-1)
                if stack:
                    left = stack[-1] + 1
                    right = i - 1
                    high = min(height[i], height[stack[-1]]) - height[cur]
                    ans += high * (right - left + 1)
                else:
                    break
            stack.append(i)
        return ans
```

### Ý tưởng 1: Độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$, trong đó $n$ là độ dài của mảng `height`.
- **Độ phức tạp không gian**: $O(n)$.

### Ý tưởng 2: Con trỏ kép

Từ hình ảnh ví dụ, ta có thể thấy rằng với cột `i` , nếu có 1 cột bên trái `l` và 1 cột bên phải `r` cao hơn thì chắc chắn cột `i` sẽ bị chìm trong nước. Lượng nước ngập trên cột `i` sẽ là từ độ cao cột `i` tới độ cao nhỏ hơn giữa cột `l` và `r`, tức là `min(height[l], height[r]) - height[i]` . Từ đó ta sẽ duyệt từng cột và tính toán lượng nước còn đọng lại trên mỗi cột sử dụng con trỏ kép!

1. Sử dụng con trỏ kép đối ngịch `left` và `right`. `left` ở đầu và `right` ở cuối. Đi kèm đó `leftMax` và `rightMax` ứng với độ cao 2 cột lớn nhất ở 2 đầu trong quá trình duyệt.
2. Duyệt mảng `height` dựa vào con trỏ kép `left`, `right`.
3. Với mỗi lần duyệt có 2 trường hợp xảy ra:
	1. Cột `leftMax` thấp hơn `rightMax`, nên ta sẽ tính nước đọng ở cột `left` (đơn giản là vì leftMax thấp hơn nên nước sẽ chảy ra hết ở độ cao `leftMax`). Lượng nước đọng lại sẽ phải xem xét tới cột `left + 1`, nếu `leftMax > height[left + 1] > hight[i]` thì lượng nước chỉ cao tới `height[left + 1]`, còn không thì sẽ cao tới `leftMax`, cộng thêm vào kết quả `ans`.
	2. Cột `leftMax` cao hơn `rightMax`, suy luận tương tự trường hợp trên
4. Khi quá trình duyệt kết thúc (tức `left >= right`), trả về kết quả `ans`.

### Ý tưởng 2: Code

```python
class Solution:
    def trap(self, height: List[int]) -> int:
        if not height:
            return 0
        left, right = 0, len(height) - 1
        leftMax, rightMax = height[left], height[right]
        res = 0
        while left < right:
            if leftMax < rightMax:
                left += 1
                leftMax = max(leftMax, height[left])
                res += leftMax - height[left]
            else:
                right -= 1
                rightMax = max(rightMax, height[right])
                res += rightMax - height[right]
        return res
```

### Ý tưởng 2: Độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$, trong đó $n$ là độ dài của mảng `height`.
- **Độ phức tạp không gian**: $O(1)$.
