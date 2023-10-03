---
title: LeetCode 0403
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-10-03
---

# [0403. Frog Jump](https://leetcode.com/problems/frog-jump/)

- Nhãn: Mảng, Quy hoạch động
- Độ khó: Khó

## Tóm tắt đề bài

**Mô tả**: Một con ếch muốn băng qua sông, sông được chia thành các ô, mỗi ô có thể chứa một viên đá (hoặc không có đá). Con ếch chỉ có thể nhảy vào các ô có đá, không thể nhảy vào các ô không có đá.

Cho một mảng `stones` được sắp xếp theo thứ tự tăng dần, trong đó `stones[i]` đại diện cho số thứ tự của viên đá thứ `i`. Giả sử số thứ tự của viên đá đầu tiên là `0` (tức `stones[0] == 0`).

Ban đầu, con ếch đứng trên viên đá thứ nhất (tức `stones[0]`), và chỉ có thể nhảy `1` đơn vị (tức chỉ có thể nhảy từ ô thứ `0` đến ô thứ `1`).

Nếu con ếch nhảy về phía trước `k` đơn vị ở bước trước thì nó chỉ có thể nhảy về phía trước `k - 1`, `k` hoặc `k + 1` đơn vị ở bước tiếp theo.

**Yêu cầu**: Xác định xem con ếch có thể băng qua sông thành công không (tức có thể nhảy lên viên đá cuối cùng không). Nếu có, trả về `True` ; nếu không, trả về `False`.

**Giới hạn**:

- $2 \le \text{stones.length} \le 2000$.
- $0 \le \text{stones[i]} \le 2^{31} - 1$.
- $stones[0] == 0$.
- Mảng `stones` được sắp xếp theo thứ tự tăng dần.

**Ví dụ**:

- Ví dụ 1:

```python
Input: stones = [0,1,3,5,6,8,12,17]
Output: true
Explanation: Con ếch có thể băng qua sông thành công bằng cách nhảy như sau: nhảy `1` đơn vị đến viên đá thứ `2`, sau đó nhảy `2` đơn vị đến viên đá thứ `3`, tiếp theo nhảy `2` đơn vị đến viên đá thứ `4`, sau đó nhảy `3` đơn vị đến viên đá thứ `6`, nhảy `4` đơn vị đến viên đá thứ `7`, cuối cùng, nhảy `5` đơn vị đến viên đá thứ `8` (tức viên đá cuối cùng).
```

## Ý tưởng giải quyết

### Ý tưởng 1: Quy hoạch động

Theo đề bài, nếu con ếch nhảy `k` đơn vị từ ô trước đó, thì ở bước tiếp theo, con ếch chỉ có thể nhảy `k - 1`, `k` hoặc `k + 1` đơn vị.

Chúng ta có thể sử dụng quy hoạch động để xác định xem con ếch có thể nhảy đến ô cuối cùng hay không. Ta có thể chia bài toán thành các giai đoạn, định nghĩa trạng thái và tìm công thức chuyển trạng thái.

###### 1. Chia giai đoạn

Chia giai đoạn dựa trên số lượng viên đá.

###### 2. Định nghĩa trạng thái

Định nghĩa trạng thái `dp[i][k]` để biểu diễn: con ếch có thể nhảy `k` đơn vị để đến viên đá thứ `i` hay không.

###### 3. Công thức chuyển trạng thái

1. Vòng lặp bên ngoài duyệt qua từng viên đá `i`, với mỗi viên đá `i`, sử dụng vòng lặp bên trong duyệt qua tất cả các viên đá `j` trước đó.
2. Tính khoảng cách từ viên đá `j` trước đó đến viên đá `i` hiện tại là `k`.
3. Nếu con ếch có thể nhảy từ viên đá `j` trước đó đến viên đá `i` hiện tại bằng cách nhảy `k - 1`, `k` hoặc `k + 1` đơn vị, thì con ếch cũng có thể nhảy từ viên đá `j` đến viên đá `i` bằng cách nhảy `k` đơn vị. Điều này có nghĩa là, nếu `dp[j][k - 1]` hoặc `dp[j][k]` hoặc `dp[j][k + 1]` là `True`, thì `dp[i][k]` cũng là `True`.
   - Tức là: `dp[i][k] = dp[j][k - 1] or dp[j][k] or dp[j][k + 1]`.

###### 4. Điều kiện ban đầu

Ban đầu, con ếch đứng trên viên đá đầu tiên (tức `stones[0]`), và chỉ có thể nhảy `0` đơn vị để đến viên đá đầu tiên, nên `dp[0][0] = True`.

###### 5. Kết quả cuối cùng

Dựa trên định nghĩa trạng thái, `dp[i][k]` biểu diễn: con ếch có thể nhảy `k` đơn vị để đến viên đá thứ `i` hay không. Nếu `dp[size - 1][k]` là `True`, thì con ếch có thể nhảy đến viên đá cuối cùng thành công (tức có thể nhảy lên viên đá cuối cùng). Nếu không, thì con ếch không thể nhảy đến viên đá cuối cùng.

### Ý tưởng 1: Cài đặt quy hoạch động

```python
class Solution:
    def canCross(self, stones: List[int]) -> bool:
        n = len(stones)
        dp = [[False] * (n + 1) for _ in range(n)]
        dp[0][0] = True
        for i in range(n):
            for j in range(i):
                k = stones[i] - stones[j]
                if k <= 0 or k > j + 1:
                    continue
                dp[i][k] = dp[j][k - 1] or dp[j][k] or dp[j][k + 1]
                if dp[n - 1][k]:
                    return True
        return False   
```

### Ý tưởng 1: Độ phức tạp

- **Độ phức tạp thời gian**: $O(n^2)$. Vòng lặp lồng nhau có độ phức tạp $O(n^2)$, do đó tổng độ phức tạp thời gian là $O(n^2)$.
- **Độ phức tạp không gian**: $O(n^2)$. Sử dụng một mảng hai chiều để lưu trạng thái, do đó tổng độ phức tạp không gian là $O(n^2)$.
