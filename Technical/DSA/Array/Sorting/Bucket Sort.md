---
title: Bucket Sort
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-09-25
date modified: 2023-09-25
---

# Sắp xếp theo thùng

## 1. Ý tưởng của thuật toán sắp xếp theo thùng

> **Thuật toán sắp xếp theo thùng (Bucket Sort)**:
>
> Phân tán các phần tử trong mảng cần sắp xếp vào các "thùng" khác nhau, sau đó sắp xếp các phần tử trong từng thùng riêng biệt.

## 2. Các bước của thuật toán sắp xếp theo thùng

1. **Xác định số lượng thùng**: Dựa trên phạm vi giá trị của mảng cần sắp xếp, chia mảng thành $k$ thùng, mỗi thùng tương ứng với một khoảng giá trị.
2. **Phân phối các phần tử**: Duyệt qua mảng cần sắp xếp và phân phối từng phần tử vào thùng tương ứng dựa trên giá trị của nó.
3. **Sắp xếp từng thùng**: Sắp xếp các phần tử trong từng thùng riêng biệt (có thể sử dụng các thuật toán sắp xếp như sắp xếp chèn, sắp xếp trộn, sắp xếp nhanh, v.v.).
4. **Kết hợp các phần tử trong các thùng**: Kết hợp các phần tử đã được sắp xếp trong các thùng theo thứ tự khoảng giá trị để tạo thành một mảng đã sắp xếp hoàn chỉnh.

Chúng ta lấy ví dụ với mảng $[11, 9, 21, 8, 17, 19, 13, 1, 24, 12]$ để minh họa toàn bộ quá trình sắp xếp theo thùng.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230925175852.png)

## 3. Cài đặt thuật toán sắp xếp theo thùng

```python
class Solution:
    def insertionSort(self, nums: [int]) -> [int]:
        # Duyệt qua khoảng chưa được sắp xếp
        for i in range(1, len(nums)):
            temp = nums[i]
            j = i
            # Duyệt từ phải sang trái trong khoảng đã sắp xếp
            while j > 0 and nums[j - 1] > temp:
                # Dịch phải các phần tử trong khoảng đã sắp xếp
                nums[j] = nums[j - 1]
                j -= 1
            # Chèn phần tử vào vị trí thích hợp
            nums[j] = temp
            
        return nums

    def bucketSort(self,  nums: [int], bucket_size=5) -> [int]:
        # Tìm giá trị nhỏ nhất và lớn nhất trong mảng
        nums_min, nums_max = min(nums), max(nums)
        # Xác định số lượng thùng là (lớn nhất - nhỏ nhất) // kích thước mỗi thùng + 1
        bucket_count = (nums_max - nums_min) // bucket_size + 1
        # Định nghĩa mảng thùng
        buckets = [[] for _ in range(bucket_count)]

        # Duyệt qua mảng cần sắp xếp và phân phối từng phần tử vào thùng tương ứng
        for num in nums:
            buckets[(num - nums_min) // bucket_size].append(num)

        # Sắp xếp từng thùng riêng biệt và kết hợp các phần tử đã sắp xếp trong các thùng
        res = []
        for bucket in buckets:
            self.insertionSort(bucket)
            res.extend(bucket)
        
        # Trả về mảng đã sắp xếp
        return res

    def sortArray(self, nums: [int]) -> [int]:
        return self.bucketSort(nums)
```

## 4. Phân tích thuật toán sắp xếp theo thùng

- **Độ phức tạp thời gian**: $O(n)$. Khi số lượng phần tử đầu vào là $n$, số lượng thùng là $m$, số lượng phần tử trong mỗi thùng là $k = \frac{n}{m}$, thời gian sắp xếp trong mỗi thùng là $O(k \times \log k)$. Tổng thời gian sắp xếp các thùng là $m \times O(k \times \log k) = m \times O(\frac{n}{m} \times \log \frac{n}{m}) = O(n \times \log \frac{n}{m})$. Khi số lượng thùng $m$ tiến dần đến số lượng phần tử $n$, $\log \frac{n}{m}$ là một hằng số nhỏ, do đó thời gian sắp xếp theo thùng gần tiến đến $O(n)$.
- **Độ phức tạp không gian**: $O(n + m)$. Vì thuật toán sắp xếp theo thùng sử dụng không gian phụ, nên độ phức tạp không gian của thuật toán là $O(n + m)$.
- **Tính ổn định của thuật toán**: Tính ổn định của thuật toán sắp xếp theo thùng phụ thuộc vào thuật toán sắp xếp được sử dụng trong từng thùng. Nếu thuật toán sắp xếp trong từng thùng là ổn định (ví dụ: sắp xếp chèn), và giữ nguyên thứ tự tương đối của các phần tử bằng nhau trong quá trình kết hợp các phần tử từ các thùng, thì thuật toán sắp xếp theo thùng là một thuật toán **ổn định**. Ngược lại, nếu không giữ nguyên thứ tự tương đối của các phần tử bằng nhau trong quá trình kết hợp các phần tử từ các thùng, thì thuật toán sắp xếp theo thùng là một thuật toán **không ổn định**.
