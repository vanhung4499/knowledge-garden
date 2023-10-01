---
title: Binary Search Part 1
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-09-26
date modified: 2023-09-26
---

# Tìm kiếm nhị phân phần 1

## 1. Giới thiệu thuật toán tìm kiếm nhị phân

### 1.1 Giới thiệu về thuật toán tìm kiếm nhị phân

> **Thuật toán tìm kiếm nhị phân** (Binary Search Algorithm): còn được gọi là thuật toán tìm kiếm chia đôi, thuật toán tìm kiếm logarit, là một thuật toán tìm kiếm hiệu quả được sử dụng để tìm kiếm một phần tử cụ thể trong một mảng đã được sắp xếp.

Ý tưởng cơ bản của tìm kiếm nhị phân là: thông qua việc xác định khoảng giá trị mà phần tử mục tiêu nằm trong đó, lặp đi lặp lại việc chia đôi khoảng tìm kiếm cho đến khi tìm thấy phần tử hoặc không tìm thấy phần tử đó.

### 1.2 Các bước của thuật toán tìm kiếm nhị phân

Dưới đây là các bước cơ bản của thuật toán tìm kiếm nhị phân:

1. **Khởi tạo**: Đầu tiên, xác định tập dữ liệu đã được sắp xếp mà bạn muốn tìm kiếm. Điều này có thể là một mảng hoặc danh sách, đảm bảo rằng các phần tử trong đó được sắp xếp theo thứ tự tăng dần hoặc giảm dần.
2. **Xác định khoảng tìm kiếm**: Xác định khoảng tìm kiếm ban đầu cho toàn bộ tập dữ liệu, tức là giới hạn trái $left$ và giới hạn phải $right$.
3. **Tính toán phần tử giữa**: Tính toán vị trí phần tử giữa $mid = \lfloor (left + right) / 2 \rfloor$.
4. **So sánh phần tử giữa**: So sánh phần tử mục tiêu $target$ với phần tử giữa $nums[mid]$:
   1. Nếu $target == nums[mid]$, có nghĩa là đã tìm thấy $target$, do đó trả về vị trí của phần tử giữa $mid$.
   2. Nếu $target < nums[mid]$, có nghĩa là phần tử mục tiêu nằm trong nửa bên trái ($[left, mid - 1]$), cập nhật giới hạn phải thành vị trí phần tử giữa trừ 1, tức là $right = mid - 1$.
   3. Nếu $target > nums[mid]$, có nghĩa là phần tử mục tiêu nằm trong nửa bên phải ($[mid + 1, right]$), cập nhật giới hạn trái thành vị trí phần tử giữa cộng 1, tức là $left = mid + 1$.
5. Lặp lại bước 3 và 4, cho đến khi tìm thấy phần tử mục tiêu và trả về vị trí phần tử giữa, hoặc khi khoảng tìm kiếm thu nhỏ đến không còn phần tử (giới hạn trái lớn hơn giới hạn phải), cho biết phần tử mục tiêu không tồn tại, lúc này trả về -1.

Ví dụ, để tìm phần tử mục tiêu 6 trong mảng đã được sắp xếp $[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]$, các bước của thuật toán tìm kiếm nhị phân như sau:

1. **Xác định khoảng tìm kiếm**: Ban đầu, giới hạn trái $left$ là 0 (vị trí đầu của mảng), $right$ là 10 (vị trí cuối của mảng). Khoảng tìm kiếm ban đầu là $[0, 10]$.
2. **Tính toán phần tử giữa**: Vị trí phần tử giữa là 5, tương ứng với phần tử $nums[5] == 5$.
3. **So sánh phần tử giữa**: Vì $6 > nums[5]$, nên phần tử mục tiêu có thể nằm ở nửa bên phải, cập nhật giới hạn trái thành vị trí phần tử giữa cộng 1, tức là $left = 5$. Khoảng tìm kiếm hiện tại là $[5, 10]$.
4. **Tính toán phần tử giữa**: Vị trí phần tử giữa là 7, tương ứng với phần tử $nums[7] == 7$.
5. **So sánh phần tử giữa**: Vì $6 < nums[7]$, nên phần tử mục tiêu có thể nằm ở nửa bên trái, cập nhật giới hạn phải thành vị trí phần tử giữa trừ 1, tức là $right = 6$. Khoảng tìm kiếm hiện tại là $[5, 6]$.
6. **Tính toán phần tử giữa**: Vị trí phần tử giữa là 5, tương ứng với phần tử $nums[5] == 5$.
7. **So sánh phần tử giữa**: Vì $5 == nums[5]$, chính xác là phần tử mà chúng ta đang tìm kiếm, lúc này trả về vị trí phần tử giữa, thuật toán kết thúc.

Như vậy, chúng ta có thể thấy rằng, với một mảng có độ dài 10, chúng ta chỉ cần tìm kiếm 3 lần để tìm thấy phần tử mục tiêu. Trong khi nếu duyệt mảng theo thứ tự từ đầu đến cuối, trong trường hợp xấu nhất, chúng ta có thể cần tìm kiếm 10 lần để tìm thấy phần tử mục tiêu.

Một ví dụ hình ảnh khác:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/202309261337792.png)

## 2. Tìm kiếm nhị phân đơn giản

Dưới đây là một ví dụ đơn giản để giải thích ý tưởng và mã của thuật toán tìm kiếm nhị phân.

- Liên kết đề bài: [704. Binary Search](https://leetcode.com/problems/binary-search/)

### 2.1 Ý nghĩa của đề bài

**Mô tả**: Cho một mảng $nums$ được sắp xếp theo thứ tự tăng dần và một giá trị mục tiêu $target$.

**Yêu cầu**: Trả về vị trí của $target$ trong mảng, nếu không tìm thấy thì trả về $-1$.

**Chú ý**:

- Bạn có thể giả định rằng tất cả các phần tử trong $nums$ là duy nhất.
- $n$ sẽ nằm trong khoảng $[1, 10000]$.
- Mỗi phần tử trong $nums$ sẽ nằm trong khoảng $[-9999, 9999]$.

**Ví dụ**:

```python
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 xuất hiện trong nums và có chỉ số là 4


Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 không tồn tại trong nums, nên trả về -1
```

### 2.2 Ý tưởng giải quyết

#### Ý tưởng 1: Tìm kiếm nhị phân

1. Đặt giới hạn trái và giới hạn phải là hai đầu của mảng, tức là $left = 0$ và $right = len(nums) - 1$, đại diện cho khoảng tìm kiếm là $[left, right]$ (khoảng trái đóng phải đóng).
2. Lấy vị trí giữa giữa hai nút $mid$, so sánh giá trị ở vị trí giữa $nums[mid]$ với giá trị mục tiêu $target$.
   1. Nếu $target == nums[mid]$, trả về vị trí giữa.
   2. Nếu $target > nums[mid]$, đặt nút trái là $mid + 1$, sau đó tiếp tục tìm kiếm trong khoảng bên phải $[mid + 1, right]$.
   3. Nếu $target < nums[mid]$, đặt nút phải là $mid - 1$, sau đó tiếp tục tìm kiếm trong khoảng bên trái $[left, mid - 1]$.
3. Nếu giới hạn trái lớn hơn giới hạn phải, khoảng tìm kiếm thu nhỏ thành rỗng, có nghĩa là phần tử mục tiêu không tồn tại, lúc này trả về $-1$.

#### Ý tưởng 1: Code

```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        
        # Tìm kiếm target trong khoảng [left, right]
        while left <= right:
            # Lấy vị trí giữa
            mid = (left + right) // 2
            # Nếu tìm thấy giá trị mục tiêu, trả về vị trí giữa
            if nums[mid] == target:
                return mid
            # Nếu nums[mid] nhỏ hơn giá trị mục tiêu, tiếp tục tìm kiếm trong khoảng [mid + 1, right]
            elif nums[mid] < target:
                left = mid + 1
            # Nếu nums[mid] lớn hơn giá trị mục tiêu, tiếp tục tìm kiếm trong khoảng [left, mid - 1]
            else:
                right = mid - 1
        # Không tìm thấy phần tử, trả về -1
        return -1
```

#### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(\log n)$.
- **Độ phức tạp không gian**: $O(1)$.
