---
title: Heap Sort
tags:
  - dsa
  - algorithm
  - data-structure
categories:
  - dsa
  - algorithm
  - data-structure
date created: 2023-09-25
date modified: 2023-09-25
---

# Heap Sort

## 1. Cấu trúc Heap

"Heap sort" là một thuật toán sắp xếp hiệu quả dựa trên cấu trúc "Heap". Trước khi giới thiệu về "Heap sort", chúng ta hãy tìm hiểu về cấu trúc "Heap" trước.

### 1.1 Định nghĩa Heap

> **Heap**: Một loại cây nhị phân hoàn chỉnh thỏa mãn một trong hai điều kiện sau:
>
> - **Max Heap**: Giá trị của mọi nút lớn hơn hoặc bằng giá trị của các nút con của nó.
> - **Min Heap**: Giá trị của mọi nút nhỏ hơn hoặc bằng giá trị của các nút con của nó.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230925152102.png)

### 1.2 Cấu trúc lưu trữ Heap

Cấu trúc logic của Heap là một cây nhị phân hoàn chỉnh. Và chúng ta đã học trong phần [[Binary Tree Basic]] rằng, đối với cây nhị phân hoàn chỉnh (đặc biệt là cây nhị phân đầy đủ), việc sử dụng cấu trúc lưu trữ tuần tự (mảng) để biểu diễn cây nhị phân hoàn chỉnh có thể tận dụng tối đa không gian lưu trữ.

Khi sử dụng cấu trúc lưu trữ tuần tự (mảng) để biểu diễn Heap, quan hệ giữa chỉ mục của các phần tử trong Heap và chỉ mục của mảng như sau:

- Nếu chỉ mục của một nút cây nhị phân (không phải lá) là $i$, thì chỉ mục của nút con trái là $2 \times i + 1$, chỉ mục của nút con phải là $2 \times i + 2$.
- Nếu chỉ mục của một nút cây nhị phân (không phải gốc) là $i$, thì chỉ mục của nút gốc là $\lfloor \frac{i - 1}{2} \rfloor$ (làm tròn xuống).

```python
class MaxHeap:
    def __init__(self):
        self.max_heap = []
```

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230925152208.png)

### 1.3 Truy cập phần tử đỉnh Heap

> **Truy cập phần tử đỉnh Heap**: Đề cập đến việc lấy phần tử đầu tiên trong Heap.

Trong Heap, phần tử đỉnh nằm ở nút gốc, khi chúng ta sử dụng cấu trúc lưu trữ tuần tự (mảng) để biểu diễn Heap, phần tử đỉnh là phần tử đầu tiên của mảng.

```python
class MaxHeap:
    ......
    def peek(self) -> int:
        # Heap lớn trống
        if not self.max_heap:
            return None
        # Trả về phần tử đỉnh Heap
        return self.max_heap[0]
```

Việc truy cập phần tử đỉnh Heap không phụ thuộc vào số lượng phần tử trong mảng, do đó độ phức tạp thời gian là $O(1)$.

### 1.4 Chèn phần tử vào Heap

> **Chèn phần tử vào Heap**: Đề cập đến việc thêm một phần tử mới vào Heap, điều chỉnh cấu trúc Heap để giữ nguyên tính chất của Heap.

Các bước để chèn phần tử vào Heap như sau:

1. Thêm phần tử mới vào cuối Heap, giữ nguyên cấu trúc cây nhị phân hoàn chỉnh.
2. Bắt đầu từ nút chứa phần tử mới chèn, so sánh nút này với nút cha của nó.
   1. Nếu giá trị của nút mới lớn hơn giá trị của nút cha của nó, hoán đổi chúng để giữ tính chất của Heap lớn.
   2. Nếu giá trị của nút mới nhỏ hơn hoặc bằng giá trị của nút cha của nó, điều này có nghĩa là Heap lớn đã đáp ứng yêu cầu, kết thúc quá trình.
3. Lặp lại các bước so sánh và hoán đổi trên, cho đến khi nút mới không còn lớn hơn nút cha của nó hoặc đạt đến nút gốc của Heap.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230925152255.png)

Quá trình này được gọi là "điều chỉnh lên" (Shift Up). Vì phần tử mới chèn sẽ di chuyển lên từng bước cho đến khi tìm được vị trí phù hợp, giữ tính chất được sắp xếp của Heap.

```python
class MaxHeap:
    ......
    def push(self, val: int):
        # Thêm phần tử mới vào cuối Heap
        self.max_heap.append(val)
        
        size = len(self.max_heap)
        # Bắt đầu từ nút chứa phần tử mới chèn, thực hiện điều chỉnh lên
        self.__shift_up(size - 1)
        
    def __shift_up(self, i: int):
        while (i - 1) // 2 >= 0 and self.max_heap[i] > self.max_heap[(i - 1) // 2]:
            self.max_heap[i], self.max_heap[(i - 1) // 2] = self.max_heap[(i - 1) // 2], self.max_heap[i]
            i = (i - 1) // 2
```

Trong trường hợp xấu nhất, độ phức tạp thời gian của "chèn phần tử vào Heap" là $O(\log n)$, trong đó $n$ là số lượng phần tử trong Heap, điều này bởi vì chiều cao của Heap là $\log n$.

### 1.5 Xóa phần tử đỉnh Heap

> **Xóa phần tử đỉnh Heap**: Đề cập đến việc loại bỏ phần tử đầu tiên trong Heap và điều chỉnh lại cấu trúc Heap để giữ nguyên tính chất của Heap.

Các bước để xóa phần tử đỉnh Heap như sau:

1. Hoán đổi phần tử đỉnh (tức là nút gốc) với phần tử cuối cùng của Heap.
2. Loại bỏ phần tử cuối cùng của Heap (phần tử đỉnh cũ), tức là loại bỏ nó khỏi Heap.
3. Bắt đầu từ phần tử đỉnh mới, so sánh nó với nút con lớn hơn của nó.
   1. Nếu giá trị của nút hiện tại nhỏ hơn giá trị của nút con lớn hơn, hoán đổi chúng. Bước này được thực hiện để "đẩy" phần tử đỉnh mới xuống vị trí thích hợp, giữ tính chất của Heap lớn.
   2. Nếu giá trị của nút hiện tại lớn hơn hoặc bằng giá trị của nút con lớn hơn, điều này có nghĩa là Heap lớn đã đáp ứng yêu cầu, kết thúc quá trình.
4. Lặp lại các bước so sánh và hoán đổi trên, cho đến khi phần tử đỉnh mới không còn nhỏ hơn nút con của nó hoặc đạt đến đáy của Heap.

Quá trình này được gọi là "điều chỉnh xuống" (Shift Down). Vì phần tử đỉnh mới sẽ di chuyển xuống từng bước cho đến khi tìm được vị trí phù hợp, giữ tính chất được sắp xếp của Heap.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230925152540.png)

```python
class MaxHeap:
    ......        
    def pop(self) -> int:
        # Heap rỗng
        if not self.max_heap:
            raise IndexError("Heap rỗng")
        
        size = len(self.max_heap)
        self.max_heap[0], self.max_heap[size - 1] = self.max_heap[size - 1], self.max_heap[0]
        # Xóa phần tử đỉnh Heap
        val = self.max_heap.pop()
        # Giảm số lượng nút đi 1
        size -= 1 
        
        # Điều chỉnh xuống
        self.__shift_down(0, size)
        
        # Trả về phần tử đỉnh Heap
        return val

    
    def __shift_down(self, i: int, n: int):
        while 2 * i + 1 < n:
            # Chỉ mục của nút con trái và nút con phải
            left, right = 2 * i + 1, 2 * i + 2
            
            # Tìm chỉ mục của nút con lớn hơn trong nút con trái và nút con phải
            if 2 * i + 2 >= n:
                # Chỉ mục của nút con phải vượt quá phạm vi (chỉ có nút con trái)
                larger = left
            else:
                # Cả nút con trái và nút con phải đều tồn tại
                if self.max_heap[left] >= self.max_heap[right]:
                    larger = left
                else:
                    larger = right
            
            # So sánh giá trị của nút hiện tại với nút con lớn hơn
            if self.max_heap[i] < self.max_heap[larger]:
                # Nếu giá trị của nút hiện tại nhỏ hơn giá trị của nút con lớn hơn, hoán đổi chúng
                self.max_heap[i], self.max_heap[larger] = self.max_heap[larger], self.max_heap[i]
                i = larger
            else:
                # Nếu giá trị của nút hiện tại lớn hơn hoặc bằng giá trị của nút con lớn hơn, kết thúc quá trình
                break
```

Thời gian phức tạp của "xóa phần tử đỉnh Heap" thường là $O(\log n)$, trong đó $n$ là số lượng phần tử trong Heap, vì chiều cao của Heap là $\log n$.

## 2. Heap Sort

### 2.1 Ý tưởng thuật toán Heap Sort

> **Ý tưởng cơ bản của thuật toán Heap Sort**:
>
> Sử dụng cấu trúc "Heap" để thiết kế thuật toán sắp xếp. Chuyển mảng thành một "Heap lớn", lặp lại việc lấy ra nút có giá trị lớn nhất từ Heap và duy trì tính chất của Heap lớn cho phần còn lại của Heap.

### 2.2 Các bước của thuật toán Heap Sort

1. **Xây dựng Heap lớn ban đầu**:
   1. Định nghĩa một cấu trúc Heap được triển khai bằng mảng, lưu trữ các phần tử của mảng gốc vào cấu trúc Heap một cách tuần tự (thứ tự ban đầu không thay đổi).
   2. Bắt đầu từ vị trí giữa của mảng, từ phải sang trái, sử dụng "điều chỉnh xuống" để chuyển mảng thành một Heap lớn.
2. **Hoán đổi và điều chỉnh Heap**:
   1. Hoán đổi phần tử đỉnh Heap (phần tử thứ nhất) với phần tử cuối cùng của Heap (phần tử cuối cùng), sau đó giảm kích thước của Heap đi $1$.
   2. Sau khi hoán đổi phần tử, do phần tử đỉnh Heap đã thay đổi, cần bắt đầu từ nút gốc và sử dụng "điều chỉnh xuống" để duy trì tính chất của Heap.
3. **Lặp lại hoán đổi và điều chỉnh Heap**:
   1. Lặp lại bước $2$, cho đến khi kích thước của Heap là $1$, khi đó mảng Heap đã được sắp xếp hoàn toàn.

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230925152845.png)

### 2.3 Triển khai mã Heap Sort

```python
class MaxHeap:
    ......
    def __buildMaxHeap(self, nums: [int]):
        size = len(nums)
        # Đầu tiên, thêm các phần tử của mảng nums vào max_heap theo thứ tự
        for i in range(size):
            self.max_heap.append(nums[i])
        
        # Bắt đầu từ nút không phải lá cuối cùng, thực hiện điều chỉnh xuống
        for i in range((size - 2) // 2, -1, -1):
            self.__shift_down(i, size)

    def maxHeapSort(self, nums: [int]) -> [int]:
        # Xây dựng Heap lớn ban đầu dựa trên mảng nums
        self.__buildMaxHeap(nums)
        
        size = len(self.max_heap)
        for i in range(size - 1, -1, -1):
            # Hoán đổi nút gốc với nút cuối cùng của Heap
            self.max_heap[0], self.max_heap[i] = self.max_heap[i], self.max_heap[0]
            # Bắt đầu từ nút gốc, thực hiện điều chỉnh xuống cho Heap hiện tại
            self.__shift_down(0, i)
        
        # Trả về mảng đã được sắp xếp
        return self.max_heap
    
class Solution:
    def maxHeapSort(self, nums: [int]) -> [int]:
        return MaxHeap().maxHeapSort(nums)
        
    def sortArray(self, nums: [int]) -> [int]:
        return self.maxHeapSort(nums)
    
print(Solution().sortArray([10, 25, 6, 8, 7, 1, 20, 23, 16, 19, 17, 3, 18, 14]))
```

### 2.4 Phân tích thuật toán Heap Sort

- **Độ phức tạp thời gian**: $O(n \times \log n)$.
  - Thời gian của thuật toán Heap Sort chủ yếu được tiêu tốn ở hai khía cạnh: "xây dựng Heap lớn ban đầu" và "điều chỉnh xuống".
  - Giả sử cây nhị phân tương ứng với mảng gốc có độ sâu $d$, thuật toán gồm hai vòng lặp độc lập:
     1. Trong vòng lặp đầu tiên, khi xây dựng Heap ban đầu, bắt đầu từ tầng $i = d - 1$ và kết thúc ở tầng $i = 1$, thuật toán thực hiện một lần điều chỉnh Heap cho mỗi nút nhánh. Một lần điều chỉnh Heap cho một nhánh từ tầng $i$ đến tầng $d$ tương ứng với một khoảng cách tối đa mà nút gốc của nhánh đó có thể di chuyển, tức là $d - i$. Nhánh trên tầng $i$ có tối đa $2^{i-1}$ nút, do đó thời gian cần để thực hiện một lần điều chỉnh Heap là tổng của số nút trên tầng đó và khoảng cách tối đa mà chúng có thể di chuyển, tức là $\sum_{i = d - 1}^1 2^{i-1} (d-i) = \sum_{j = 1}^{d-1} 2^{d-j-1} \times j = \sum_{j = 1}^{d-1} 2^{d-1} \times {j \over 2^j} \le n \times \sum_{j = 1}^{d-1} {j \over 2^j} < 2 \times n$. Do đó, thời gian của phần này là $O(n)$.
     2. Trong vòng lặp thứ hai, mỗi lần điều chỉnh Heap, nút có thể di chuyển tối đa là độ sâu của cây nhị phân, tức là $d = \lfloor \log_2(n) \rfloor + 1$. Tổng cộng có $n - 1$ lần điều chỉnh Heap, do đó thời gian của vòng lặp thứ hai là $(n-1)(\lfloor \log_2 (n)\rfloor + 1) = O(n \times \log n)$.
  - Vì vậy, độ phức tạp thời gian của thuật toán Heap Sort là $O(n \times \log n)$.
- **Độ phức tạp không gian**: $O(1)$. Vì trong thuật toán Heap Sort chỉ cần sử dụng một không gian phụ để lưu trữ kích thước của Heap, nên độ phức tạp không gian là $O(1)$.
- **Tính ổn định của thuật toán**: Khi thực hiện "điều chỉnh xuống", vị trí tương đối của các phần tử bằng nhau có thể thay đổi. Do đó, Heap Sort là một thuật toán **không ổn định**.
