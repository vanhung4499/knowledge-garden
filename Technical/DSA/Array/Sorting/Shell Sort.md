---
title: Shell Sort
tags: 
categories: 
date created: 2023-09-25
date modified: 2023-09-25
---

# Sắp xếp Shell

## 1. Ý tưởng của thuật toán sắp xếp Shell

> **Thuật toán sắp xếp Shell (Shell Sort)**:
>
> Chia mảng thành các phần tử con bằng cách chọn một khoảng cách giữa các phần tử (gọi là gap). Mỗi phần tử con được sắp xếp bằng cách sử dụng thuật toán sắp xếp chèn. Sau đó, khoảng cách giữa các phần tử được giảm dần và quá trình sắp xếp được lặp lại cho đến khi khoảng cách giảm xuống 1, khi đó mảng đã được sắp xếp.
>

Trong thuật toán sắp xếp Shell, mỗi lần sắp xếp một phần tử con, phần tử đó được chèn vào vị trí thích hợp trong phần tử con đã được sắp xếp. Sau đó, khoảng cách giữa các phần tử con được giảm dần, cho đến khi khoảng cách giảm xuống 1, khi đó mảng đã được sắp xếp.

## 2. Các bước của thuật toán sắp xếp Shell

Giả sử mảng có n phần tử, các bước của thuật toán sắp xếp Shell như sau:

1. Chọn một khoảng cách ban đầu (gọi là gap).
2. Chia mảng thành các phần tử con bằng cách lấy các phần tử cách nhau gap đơn vị.
3. Sử dụng thuật toán sắp xếp chèn để sắp xếp từng phần tử con.
4. Giảm khoảng cách gap và lặp lại bước 2 và bước 3 cho đến khi khoảng cách gap giảm xuống 1.
5. Cuối cùng, sử dụng thuật toán sắp xếp chèn để sắp xếp toàn bộ mảng.

Chúng ta lấy ví dụ với mảng $[9, 8, 3, 7, 5, 6, 4, 1]$ để minh họa toàn bộ quá trình sắp xếp Shell.

- Sắp xếp lại các phần tử ở khoảng n/2

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230925111813.png)

- Sắp xếp lại tất cả các phần tử ở khoảng n/2  
![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230925111928.png)
- Sắp xếp lại các phần tử ở khoảng n/4

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230925112024.png)

- Tất cả các phần tử trong mảng nằm ở khoảng hiện tại đều được so sánh.  
![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230925112039.png)
- Sắp xếp lại tất cả các phần tử ở khoảng n/4  
![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230925112107.png)

- Sắp xếp lại các phần tử ở khoảng n/8

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230925112227.png)

## 3. Cài đặt thuật toán sắp xếp Shell

```python
class Solution:
    def shellSort(self, nums: [int]) -> [int]:
        size = len(nums)
        gap = size // 2
        # Chia mảng thành các phần tử con
        while gap > 0:
            # Sắp xếp từng phần tử con
            for i in range(gap, size):
                # temp là phần tử đầu tiên của phần tử con chưa được sắp xếp
                temp = nums[i]
                j = i
                # Duyệt từ phải sang trái trong phần tử con đã được sắp xếp
                while j >= gap and nums[j - gap] > temp:
                    # Di chuyển các phần tử lớn hơn phần tử đang xét sang phải một vị trí
                    nums[j] = nums[j - gap]
                    j -= gap
                # Chèn phần tử đang xét vào vị trí thích hợp
                nums[j] = temp
            # Giảm khoảng cách gap
            gap = gap // 2
        return nums

    def sortArray(self, nums: [int]) -> [int]:
        return self.shellSort(nums)
```

## 4. Phân tích thuật toán sắp xếp Shell

- **Trường hợp tốt nhất**: $O(n \log^2 n)$. Trong trường hợp tốt nhất (khi mảng đã được sắp xếp tăng dần ban đầu), mỗi phần tử chỉ được so sánh với một phần tử khác và không cần di chuyển phần tử nào, do đó số lần so sánh là nhỏ nhất, bằng $∑^n_{i = 2}1 = n − 1$. Khi sử dụng thuật toán sắp xếp chèn để sắp xếp từng phần tử con, số lần so sánh và di chuyển phần tử trong mỗi phần tử con là nhỏ nhất khi mảng đã được sắp xếp tăng dần. Do đó, số lần so sánh và di chuyển phần tử trong toàn bộ mảng là nhỏ nhất khi mảng đã được sắp xếp tăng dần. Tổng số lần so sánh và di chuyển phần tử trong toàn bộ mảng là $O(n \log^2 n)$.
- **Trường hợp xấu nhất**: $O(n^2)$. Trong trường hợp xấu nhất (khi mảng đã được sắp xếp giảm dần ban đầu), mỗi phần tử cần so sánh với $i - 1$ phần tử khác và di chuyển $i - 1$ phần tử, tổng số lần so sánh và di chuyển phần tử là lớn nhất, bằng $∑^n_{i=2}(i − 1) = \frac{n(n−1)}{2}$. Khi sử dụng thuật toán sắp xếp chèn để sắp xếp từng phần tử con, số lần so sánh và di chuyển phần tử trong mỗi phần tử con là lớn nhất khi mảng đã được sắp xếp giảm dần. Do đó, số lần so sánh và di chuyển phần tử trong toàn bộ mảng là lớn nhất khi mảng đã được sắp xếp giảm dần. Tổng số lần so sánh và di chuyển phần tử trong toàn bộ mảng là $O(n^2)$.
- **Trường hợp trung bình**: $O(n^2)$. Trong trường hợp trung bình, không có một phân tích toán học chính xác cho thuật toán sắp xếp Shell. Tuy nhiên, thực nghiệm cho thấy thuật toán sắp xếp Shell có thể đạt được hiệu suất tốt hơn so với sắp xếp chèn và sắp xếp nhanh trong một số trường hợp. Do đó, độ phức tạp trung bình của thuật toán sắp xếp Shell là $O(n^2)$.
- **Không gian bộ nhớ**: $O(1)$. Thuật toán sắp xếp Shell được thực hiện trực tiếp trên mảng ban đầu, chỉ sử dụng các biến con trỏ $i$, $j$ và biến tham chiếu đến phần tử đầu tiên của phần tử con chưa được sắp xếp.
- **Tính ổn định của thuật toán**: Trong quá trình sắp xếp từng phần tử con, mỗi phần tử được chèn vào bên phải các phần tử bằng nhau, không làm thay đổi thứ tự tương đối của các phần tử bằng nhau. Tuy nhiên, khi sắp xếp toàn bộ mảng, các phần tử bằng nhau có thể được di chuyển trong các phần tử con khác nhau. Do đó, thuật toán sắp xếp Shell là một thuật toán **không ổn định**.
