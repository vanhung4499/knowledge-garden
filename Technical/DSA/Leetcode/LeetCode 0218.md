---
title: LeetCode 0218
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-29
---

# [0218. The Skyline Problem](https://leetcode.com/problems/the-skyline-problem/)

- Nhãn: Fenwick Tree, Segment Tree, Array, Divide and Conquer, Ordered Set, Sweep Line, Heap (Priority Queue)
- Độ khó: Khó

## Tóm tắt bài toán

**Mô tả**: Đường chân trời của một thành phố được tạo thành từ việc quan sát các tòa nhà trong thành phố từ một khoảng cách xa.

Cho một mảng `buildings` gồm các tọa độ và chiều cao của các tòa nhà. Mỗi phần tử `buildings[i] = [left_i, right_i, height_i]` đại diện cho tọa độ `x` bên trái của tòa nhà thứ `i`, tọa độ `x` bên phải của tòa nhà thứ `i` và chiều cao của tòa nhà thứ `i`.

**Yêu cầu**: Trả về đường chân trời được tạo thành từ các tòa nhà này.

- Đường chân trời: Một danh sách các điểm "quyết định" được sắp xếp theo tọa độ `x`, có định dạng `[[x1, y1], [x2, y2], [x3, y3], …]`.
- Điểm quyết định: Điểm bắt đầu của đoạn ngang. Điểm cuối cùng trong danh sách là điểm cuối cùng của tòa nhà bên phải, với tọa độ `y` luôn là `0`, chỉ được sử dụng để đánh dấu điểm cuối của đường chân trời. Ngoài ra, mọi đoạn ngang giữa hai tòa nhà liền kề trên mặt đất cũng được coi là một phần của đường chân trời.

**Lưu ý**: Đường chân trời không được chứa các đoạn ngang có cùng chiều cao liên tiếp.

**Ví dụ**:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/merged.jpg)

- Hình A hiển thị tất cả các tòa nhà và chiều cao của chúng.
- Hình B hiển thị đường chân trời được tạo thành từ các tòa nhà này. Các điểm đỏ trong hình B đại diện cho các điểm quyết định trong danh sách kết quả.

## Ý tưởng giải quyết

Có thể thấy rằng: Tọa độ `x` của các điểm quyết định nằm trên biên trái và biên phải của các tòa nhà.

Chúng ta có thể lưu trữ tọa độ cao nhất của biên trái và biên phải vào mảng `points`, sau đó sắp xếp theo tọa độ `x` và chiều cao.

Sau đó, chúng ta sử dụng một "cột quét" song song với trục y, quét từ trái sang phải qua tất cả các tọa độ. Điều này sẽ chia các tòa nhà thành các hình chữ nhật đều nhau.

Dễ thấy: Hai tọa độ liền kề `x` và chiều cao tạo thành một hình chữ nhật. Tọa độ `x` của hai tọa độ liền kề có thể lấy từ mảng đã được sắp xếp `points` và chiều cao của hình chữ nhật có thể được duy trì bằng một hàng đợi ưu tiên (heap) `max_heap`. Sử dụng mảng `ans` để lưu trữ kết quả.

Khi quét từ trái sang phải:

- Khi gặp biên trái của tòa nhà, có nghĩa là sẽ tồn tại một cạnh phía bên phải. Lúc này, chúng ta thêm chiều cao vào hàng đợi ưu tiên lớn `max_heap`.
- Khi gặp biên phải của tòa nhà, có nghĩa rằng cạnh phía bên trái từ trước đã kết thúc, lúc này chúng ta loại bỏ chiều cao từ hàng đợi ưu tiên `max_heap`.

Vì ba cạnh có cùng chiều cao nên chúng ta sử dụng biến `prev` để lưu trữ chiều cao trước đó.

- Nếu chiều cao hiện tại `curr` bằng chiều cao trước đó `prev`, chúng ta bỏ qua.
- Nếu chiều cao hiện tại `curr` khác chiều cao trước đó `prev`, chúng ta thêm nó vào mảng kết quả `ans` và cập nhật `prev` thành chiều cao hiện tại `curr`.

Cuối cùng, trả về kết quả `ans`.

## Code

```python
from sortedcontainers import SortedList

class Solution:
    def getSkyline(self, buildings: List[List[int]]) -> List[List[int]]:
        ans = []
        points = []
        for building in buildings:
            left, right, hight = building[0], building[1], building[2]
            points.append([left, -hight])
            points.append([right, hight])
        points.sort(key=lambda x:(x[0], x[1]))

        prev = 0
        max_heap = SortedList([prev])

        for point in points:
            x, height = point[0], point[1]
            if height < 0:
                max_heap.add(-height)
            else:
                max_heap.remove(height)

            curr = max_heap[-1]
            if curr != prev:
                ans.append([x, curr])
                prev = curr
        return ans
```
