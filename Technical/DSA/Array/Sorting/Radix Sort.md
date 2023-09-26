---
title: Radix Sort
tags: 
categories: 
date created: 2023-09-25
date modified: 2023-09-25
---

## 1. Ý tưởng của thuật toán sắp xếp cơ số

> **Thuật toán sắp xếp cơ số (Radix Sort)**:
>
> Chia các số nguyên thành các chữ số riêng lẻ và sắp xếp từng chữ số theo thứ tự từ thấp đến cao, từ đó đạt được sắp xếp của toàn bộ dãy số.

## 2. Các bước của thuật toán sắp xếp cơ số

Thuật toán sắp xếp cơ số có thể sử dụng phương pháp "Ưu tiên chữ số thấp nhất trước (Least Significant Digit First)" hoặc "Ưu tiên chữ số cao nhất trước (Most Significant Digit First)". Phương pháp "Ưu tiên chữ số thấp nhất trước" là phương pháp phổ biến nhất.

Dưới đây, chúng ta sẽ lấy phương pháp "Ưu tiên chữ số thấp nhất trước" làm ví dụ để giải thích các bước của thuật toán.

1. **Xác định số chữ số lớn nhất trong dãy số**：Duyệt qua các phần tử của mảng và tìm giá trị lớn nhất, sau đó xác định số chữ số của giá trị lớn nhất.
2. **Từ chữ số thấp nhất (chữ số đơn vị) đến chữ số cao nhất, sắp xếp từng chữ số**：
   1. Định nghĩa một mảng thùng $buckets$ có độ dài $10$ để đại diện cho $10$ chữ số từ $0$ đến $9$.
   2. Dựa trên chữ số hiện tại của từng phần tử, đặt phần tử vào thùng tương ứng với chữ số đó.
   3. Xóa mảng gốc và lấy các phần tử từ thùng theo thứ tự, thêm vào mảng gốc.

Chúng ta lấy ví dụ với dãy số sau để minh họa các bước của thuật toán sắp xếp cơ số.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230925180437.png)

## 3. Cài đặt thuật toán sắp xếp cơ số

```python
class Solution:
    def radixSort(self, nums: [int]) -> [int]:
        # Xác định số chữ số lớn nhất trong dãy số
        size = len(str(max(nums)))
        
        # Từ chữ số thấp nhất đến chữ số cao nhất, sắp xếp từng chữ số
        for i in range(size):
            # Định nghĩa một mảng thùng buckets có độ dài 10 để đại diện cho 10 chữ số từ 0 đến 9
            buckets = [[] for _ in range(10)]
            # Dựa trên chữ số hiện tại của từng phần tử, đặt phần tử vào thùng tương ứng với chữ số đó
            for num in nums:
                buckets[num // (10 ** i) % 10].append(num)
            # Xóa mảng gốc và lấy các phần tử từ thùng theo thứ tự, thêm vào mảng gốc
            nums.clear()
            for bucket in buckets:
                for num in bucket:
                    nums.append(num)
                    
        # Hoàn thành sắp xếp, trả về mảng kết quả
        return nums
    
    def sortArray(self, nums: [int]) -> [int]:
        return self.radixSort(nums)
```

## 4. Phân tích thuật toán sắp xếp cơ số

- **Độ phức tạp thời gian**: $O(n \times k)$. Trong đó $n$ là số lượng phần tử cần sắp xếp và $k$ là số chữ số. $k$ phụ thuộc vào cách chọn hệ cơ số và số lượng chữ số của phần tử lớn nhất trong dãy số. Vì vậy, độ phức tạp thời gian của thuật toán sắp xếp cơ số là $O(n \times k)$.
- **Độ phức tạp không gian**: $O(n + k)$. Vì thuật toán sắp xếp cơ số sử dụng một mảng thùng để lưu trữ các phần tử, nên độ phức tạp không gian của thuật toán là $O(n + k)$.
- **Tính ổn định của thuật toán**: Tính ổn định của thuật toán sắp xếp cơ số phụ thuộc vào tính ổn định của thuật toán sắp xếp trong từng thùng. Nếu thuật toán sắp xếp trong từng thùng là ổn định (ví dụ: sắp xếp chèn), và giữ nguyên thứ tự tương đối của các phần tử bằng nhau trong quá trình kết hợp các phần tử từ các thùng, thì thuật toán sắp xếp cơ số là một thuật toán **ổn định**. Ngược lại, nếu không giữ nguyên thứ tự tương đối của các phần tử bằng nhau trong quá trình kết hợp các phần tử từ các thùng, thì thuật toán sắp xếp cơ số là một thuật toán **không ổn định**.
