---
title: LeetCode 0075
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-26
---

# [0075. Sort Colors](https://leetcode.com/problems/sort-colors/)

- Nhãn: Mảng, Con trỏ kép, Sắp xếp
- Độ khó: Trung bình

## Tóm tắt đề bài

**Mô tả**: Cho một mảng số nguyên $nums$, các phần tử chỉ có thể là $0$, $1$, $2$, tương ứng với màu đỏ, màu trắng và màu xanh lam.

**Yêu cầu**: Sắp xếp mảng sao cho các phần tử màu đỏ nằm trước, màu trắng nằm ở giữa và màu xanh lam nằm cuối.

**Giải thích**:

- Yêu cầu không sử dụng các hàm thư viện tiêu chuẩn và chỉ sử dụng không gian hằng số, chỉ cần duyệt mảng một lần để giải quyết.
- $n$ là độ dài của mảng $nums$.
- $1 \le n \le 300$.
- $nums[i]$ có giá trị là $0$, $1$ hoặc $2$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums = [2,0,2,1,1,0]
Output: [0,0,1,1,2,2]
```

- Ví dụ 2:

```python
Input: nums = [2,0,1]
Output: [0,1,2]
```

## Ý tưởng giải quyết

### Ý tưởng 1: Con trỏ kép + ý tưởng sắp xếp nhanh

Trong thuật toán sắp xếp nhanh, quá trình phân vùng sử dụng con trỏ kép để di chuyển các phần tử lớn hơn phần tử cơ sở $pivot$ sang bên phải của mảng và di chuyển các phần tử nhỏ hơn phần tử cơ sở $pivot$ sang bên trái của mảng. Như vậy, mảng được chia thành ba phần: phần nhỏ hơn phần tử cơ sở, phần tử cơ sở và phần lớn hơn phần tử cơ sở.

Chúng ta có thể áp dụng quá trình phân vùng trong thuật toán sắp xếp nhanh để giải quyết bài toán này. Chọn số $1$ làm phần tử cơ sở $pivot$, sau đó chia mảng thành ba phần: $0$ (phần nhỏ hơn $1$), $1$ (phần bằng $1$) và $2$ (phần lớn hơn $1$). Các bước cụ thể như sau:

1. Sử dụng hai con trỏ $left$ và $right$, $left$ đại diện cho cuối phần tử màu đỏ đã được xử lý, $right$ đại diện cho đầu phần tử màu xanh lam đã được xử lý.
2. Sử dụng một con trỏ $index$ để duyệt qua mảng, nếu gặp $nums[index] == 0$, hoán đổi $nums[index]$ và $nums[left]$, đồng thời di chuyển $left$ sang phải. Nếu gặp $nums[index] == 2$, hoán đổi $nums[index]$ và $nums[right]$, đồng thời di chuyển $right$ sang trái.
3. Tiếp tục duyệt qua mảng cho đến khi $index$ di chuyển đến vị trí $right$ thì dừng. Sau khi duyệt xong, lúc này, phần bên trái của $left$ là màu đỏ, phần bên phải của $right$ là màu xanh lam.

Lưu ý: Khi di chuyển, cần kiểm tra vị trí của $index$ và $left$, vì phần bên trái của $left$ là mảng đã được xử lý, nên cần kiểm tra vị trí của $index$ có nhỏ hơn $left$ hay không, nếu nhỏ hơn thì cần cập nhật vị trí của $index$.

### Ý tưởng 1: Code

```python
class Solution:
    def sortColors(self, nums: List[int]) -> None:
        left = 0
        right = len(nums) - 1
        index = 0
        while index <= right:
            if index < left:
                index += 1
            elif nums[index] == 0:
                nums[index], nums[left] = nums[left], nums[index]
                left += 1
            elif nums[index] == 2:
                nums[index], nums[right] = nums[right], nums[index]
                right -= 1
            else:
                index += 1
```

### Ý tưởng 1: Độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$.
- **Độ phức tạp không gian**: $O(1)$.
