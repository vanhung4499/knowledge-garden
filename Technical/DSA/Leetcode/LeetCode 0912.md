---
title: LeetCode 0912
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-26
---

# [0912. Sort An Array](https://leetcode.com/problems/sort-an-array/)

- Nhãn: Mảng, Phân chia, Sắp xếp thùng, Sắp xếp đếm, Sắp xếp cơ số, Sắp xếp, Heap (hàng đợi ưu tiên), Sắp xếp trộn
- Độ khó: Trung bình

## Tóm tắt đề bài

**Mô tả**: Cho một mảng số nguyên $nums$.

**Yêu cầu**: Sắp xếp mảng theo thứ tự tăng dần.

**Giải thích**:

- $1 \le nums.length \le 5 * 10^4$.
- $-5 * 10^4 \le nums[i] \le 5 * 10^4$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: nums = [5,2,3,1]
Output: [1,2,3,5]
```

- Ví dụ 2:

```python
Input: nums = [5,1,1,2,0,0]
Output: [0,0,1,1,2,5]
```

## Ý tưởng giải quyết

Đây là một bài tốt để ôn tập các thuật toán sắp xếp và kiểm tra độ phức tạp thời gian của các thuật toán. Tôi đã thử nghiệm mười thuật toán sắp xếp. Dưới đây là kết quả:

- Thuật toán quá chậm (độ phức tạp thời gian là $O(n^2)$): Sắp xếp nổi bọt (Bubble Sort), Sắp xếp chọn (Selection Sort), Sắp xếp chèn (Insertion Sort).
- Thuật toán vừa phải (độ phức tạp thời gian là $O(n \times \log n)$): Sắp xếp Shell (Shell Sort), Sắp xếp trộn (Merge Sort), Sắp xếp nhanh (Quick Sort), Sắp xếp heap (Heap Sort).
- Thuật toán vừa phải (độ phức tạp thời gian là $O(n)$): Sắp xếp đếm (Counting Sort), Sắp xếp thùng (Bucket Sort).
- Thuật toán không đúng (Sắp xếp cơ số thông thường chỉ phù hợp cho số không âm): Sắp xếp cơ số (Radix Sort).

### Ý tưởng 1: Sắp xếp nổi bọt (quá chậm)

> **Sắp xếp nổi bọt (Bubble Sort) ý tưởng cơ bản**: Thông qua nhiều lần lặp, thông qua so sánh và trao đổi giữa các phần tử kề nhau, để các phần tử nhỏ hơn dần từ sau lên trước, các phần tử lớn hơn dần từ trước xuống sau.

Giả sử mảng có $n$ phần tử, thuật toán sắp xếp nổi bọt như sau:

1. Lần lặp thứ $1$ "nổi bọt": Thực hiện "nổi bọt" cho $n$ phần tử đầu tiên, để phần tử có giá trị lớn nhất đứng ở vị trí cuối cùng.
	1. So sánh phần tử thứ $1$ và phần tử thứ $2$, nếu phần tử thứ $1$ lớn hơn phần tử thứ $2$, hoán đổi vị trí của hai phần tử.
	2. Tiếp tục so sánh phần tử thứ $2$ và phần tử thứ $3$, nếu phần tử thứ $2$ lớn hơn phần tử thứ $3$, hoán đổi vị trí của hai phần tử.
	3. Tiếp tục quá trình so sánh và hoán đổi cho đến khi so sánh phần tử thứ $n - 1$ và phần tử thứ $n$.
	4. Sau lần lặp này, phần tử lớn nhất trong $n$ phần tử đầu tiên sẽ được đặt ở vị trí cuối cùng.
2. Lần lặp thứ $2$ "nổi bọt": Thực hiện "nổi bọt" cho $n - 1$ phần tử đầu tiên, để phần tử có giá trị lớn nhất thứ $2$ đứng ở vị trí thứ $n - 1$.
	1. So sánh phần tử thứ $1$ và phần tử thứ $2$, nếu phần tử thứ $1$ lớn hơn phần tử thứ $2$, hoán đổi vị trí của hai phần tử.
	2. Tiếp tục so sánh phần tử thứ $2$ và phần tử thứ $3$, nếu phần tử thứ $2$ lớn hơn phần tử thứ $3$, hoán đổi vị trí của hai phần tử.
	3. Tiếp tục quá trình so sánh và hoán đổi cho đến khi so sánh phần tử thứ $n - 2$ và phần tử thứ $n - 1$.
	4. Sau lần lặp này, phần tử lớn nhất thứ $2$ trong $n - 1$ phần tử đầu tiên sẽ được đặt ở vị trí thứ $n - 1$.
3. Tiếp tục lặp lại quá trình trên cho đến khi không có sự hoán đổi nào xảy ra trong một lần lặp. Khi đó, mảng đã được sắp xếp.

### Ý tưởng 1: Code

```python
class Solution:
    def bubbleSort(self, nums: [int]) -> [int]:
        # Lặp qua từng lần "nổi bọt"
        for i in range(len(nums) - 1):
            flag = False    # Cờ hiệu xem có hoán đổi không
            # "Nổi bọt" cho các phần tử trong khoảng chưa được sắp xếp [0, n - i - 1]
            for j in range(len(nums) - i - 1):
                # So sánh hai phần tử kề nhau, nếu phần tử trước lớn hơn phần tử sau, hoán đổi vị trí
                if nums[j] > nums[j + 1]:
                    nums[j], nums[j + 1] = nums[j + 1], nums[j]
                    flag = True
            if not flag:    # Nếu không có hoán đổi nào xảy ra trong lần lặp này, thoát
                break
        
        return nums
    
    def sortArray(self, nums: [int]) -> [int]:
        return self.bubbleSort(nums)
```

### Ý tưởng 1: Độ phức tạp

- **Độ phức tạp thời gian**: $O(n^2)$.
- **Độ phức tạp không gian**: $O(1)$.

### Ý tưởng 2: Sắp xếp chọn (quá chậm)

>**Sắp xếp chọn (Selection Sort) ý tưởng cơ bản**: Chia mảng thành hai phần, bên trái là phần đã sắp xếp và bên phải là phần chưa sắp xếp. Tại mỗi bước, tìm phần tử nhỏ nhất trong phần chưa sắp xếp và đặt nó vào cuối phần đã sắp xếp.

Giả sử mảng có $n$ phần tử, thuật toán sắp xếp chọn như sau:

1. Lần lặp thứ $1$: Tìm phần tử nhỏ nhất trong $n$ phần tử và đặt nó vào vị trí đầu tiên.
2. Lần lặp thứ $2$: Tìm phần tử nhỏ nhất trong $n - 1$ phần tử còn lại và đặt nó vào vị trí thứ $2$.
3. Lặp lại quá trình trên cho đến khi không còn phần tử nào cần sắp xếp.

### Ý tưởng 2: Code

```python
class Solution:
    def selectionSort(self, nums: [int]) -> [int]:
        for i in range(len(nums) - 1):
            # Ghi nhận vị trí của phần tử nhỏ nhất trong phần chưa sắp xếp
            min_i = i
            for j in range(i + 1, len(nums)):
                if nums[j] < nums[min_i]:
                    min_i = j
            # Nếu tìm thấy vị trí của phần tử nhỏ nhất, hoán đổi vị trí của phần tử ở vị trí i và phần tử ở vị trí nhỏ nhất
            if i != min_i:
                nums[i], nums[min_i] = nums[min_i], nums[i]
        return nums

    def sortArray(self, nums: [int]) -> [int]:
        return self.selectionSort(nums)
```

### Ý tưởng 2: Độ phức tạp

- **Độ phức tạp thời gian**: $O(n^2)$.
- **Độ phức tạp không gian**: $O(1)$.

### Ý tưởng 3: Sắp xếp chèn (Insertion Sort) (Quá chậm)

> **Ý tưởng cơ bản của sắp xếp chèn (Insertion Sort)**: Chia mảng thành hai phần, phần bên trái là một mảng đã được sắp xếp và phần bên phải là một mảng chưa được sắp xếp. Mỗi lần lấy một phần tử từ mảng chưa được sắp xếp và chèn nó vào đúng vị trí trong mảng đã được sắp xếp.

Giả sử mảng có n phần tử, các bước của thuật toán sắp xếp chèn như sau:

1. Ban đầu, mảng đã được sắp xếp chỉ có một phần tử là phần tử đầu tiên của mảng ban đầu.
2. Lần lượt lấy từng phần tử trong mảng chưa được sắp xếp và chèn nó vào đúng vị trí trong mảng đã được sắp xếp.
3. Để chèn một phần tử vào mảng đã được sắp xếp, ta so sánh phần tử đó với các phần tử trong mảng đã được sắp xếp từ phải qua trái. Nếu phần tử đó nhỏ hơn các phần tử đã được sắp xếp, ta dịch chuyển các phần tử sang phải để tạo chỗ trống cho phần tử đó và chèn phần tử đó vào vị trí thích hợp.
4. Lặp lại quá trình trên cho đến khi tất cả các phần tử trong mảng chưa được sắp xếp đều được chèn vào mảng đã được sắp xếp.

### Ý tưởng 3: Code

```python
class Solution:
    def insertionSort(self, nums: [int]) -> [int]:
        # Duyệt qua từng phần tử trong mảng chưa được sắp xếp
        for i in range(1, len(nums)):
            temp = nums[i]
            j = i
            # Duyệt từ phải qua trái trong mảng đã được sắp xếp
            while j > 0 and nums[j - 1] > temp:
                # Dịch chuyển các phần tử sang phải để tạo chỗ trống cho phần tử đang xét
                nums[j] = nums[j - 1]
                j -= 1
            # Chèn phần tử vào vị trí thích hợp
            nums[j] = temp

        return nums

    def sortArray(self, nums: [int]) -> [int]:
        return self.insertionSort(nums)
```

### Ý tưởng 3: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n^2)$.
- **Độ phức tạp không gian**: $O(1)$.

### Ý tưởng 4: Sắp xếp Shell (Shell Sort) (Hoạt động)

> **Ý tưởng cơ bản của sắp xếp Shell (Shell Sort)**: Chia mảng thành các mảng con bằng cách chọn một khoảng cách nhất định, sau đó sắp xếp từng mảng con bằng thuật toán sắp xếp chèn. Tiếp tục giảm khoảng cách và sắp xếp lại các mảng con cho đến khi khoảng cách là 1, sau đó sắp xếp toàn bộ mảng bằng thuật toán sắp xếp chèn.

Giả sử mảng có n phần tử, các bước của thuật toán sắp xếp Shell như sau:

1. Chọn một khoảng cách giữa các phần tử.
2. Chia mảng thành các mảng con dựa trên khoảng cách này, bắt đầu từ phần tử thứ 1 và cách nhau khoảng cách.
3. Sắp xếp từng mảng con bằng thuật toán sắp xếp chèn.
4. Giảm khoảng cách và chia lại mảng thành các mảng con mới, sau đó sắp xếp lại các mảng con.
5. Lặp lại quá trình trên cho đến khi khoảng cách là 1, sau đó sắp xếp toàn bộ mảng bằng thuật toán sắp xếp chèn.

### Ý tưởng 4: Code

```python
class Solution:
    def shellSort(self, nums: [int]) -> [int]:
        size = len(nums)
        gap = size // 2
        # Chia mảng thành các nhóm dựa trên khoảng cách
        while gap > 0:
            # Sắp xếp từng nhóm bằng thuật toán sắp xếp chèn
            for i in range(gap, size):
                # temp là phần tử đầu tiên của mảng con không có thứ tự
                temp = nums[i]
                j = i
                # Duyệt từ phải sang trái qua các phần tử của mảng con có thứ tự
                while j >= gap and nums[j - gap] > temp:
                    # Di chuyển các phần tử bên phải vị trí chèn trong mảng con
                    nums[j] = nums[j - gap]
                    j -= gap
                # Chèn phần tử vào vị trí thích hợp
                nums[j] = temp
            # Giảm khoảng cách
            gap = gap // 2
        return nums

    def sortArray(self, nums: [int]) -> [int]:
        return self.shellSort(nums)
```

### Ý tưởng 4: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: Trung bình từ $O(n \times \log n)$ đến $O(n^2)$.
- **Độ phức tạp không gian**: $O(1)$.

### Ý tưởng 5: Sắp xếp trộn (Merge Sort)

> **Ý tưởng cơ bản của sắp xếp trộn (Merge Sort)**: Sử dụng phương pháp chia để trị, trước tiên chia đều mảng hiện tại thành hai nửa, sau đó kết hợp hai mảng đã sắp xếp thành một mảng đã sắp xếp.

Giả sử mảng có $n$ phần tử, thuật toán sắp xếp trộn có các bước như sau:

1. **Quá trình chia**: Đầu tiên, chia đều mảng hiện tại thành hai nửa bằng cách đệ quy cho đến khi độ dài của mảng con là $1$.
	1. Tìm vị trí trung tâm của mảng và chia mảng thành hai mảng con $left\underline{}nums$ và $right\underline{}nums$.
	2. Đệ quy chia mảng con $left\underline{}nums$ và $right\underline{}nums$.
	3. Cuối cùng, mảng được chia thành $n$ mảng con đã được sắp xếp có độ dài $1$.
2. **Quá trình trộn**: Bắt đầu từ các mảng con đã được sắp xếp có độ dài $1$, kết hợp lần lượt hai mảng con đã sắp xếp cho đến khi có một mảng đã sắp xếp có độ dài $n$.
	1. Sử dụng một mảng $nums$ để lưu trữ mảng đã được kết hợp.
	2. Sử dụng hai con trỏ $left\underline{}i$ và $right\underline{}i$ để trỏ đến vị trí bắt đầu của hai mảng con đã sắp xếp $left\underline{}nums$ và $right\underline{}nums$.
	3. So sánh hai phần tử mà con trỏ đang trỏ đến, lấy phần tử nhỏ hơn và thêm vào mảng kết quả $nums$, sau đó di chuyển con trỏ đến vị trí tiếp theo.
	4. Lặp lại bước 3 cho đến khi một trong hai con trỏ đến cuối mảng con.
	5. Thêm các phần tử còn lại của mảng con còn lại vào mảng kết quả $nums$.
	6. Trả về mảng đã được kết hợp $nums$.

### Ý tưởng 5: Code

```python
class Solution:
    # Quá trình trộn
    def merge(self, left_nums: [int], right_nums: [int]):
        nums = []
        left_i, right_i = 0, 0
        while left_i < len(left_nums) and right_i < len(right_nums):
            # Thêm phần tử nhỏ hơn của hai mảng con đã sắp xếp vào mảng kết quả
            if left_nums[left_i] < right_nums[right_i]:
                nums.append(left_nums[left_i])
                left_i += 1
            else:
                nums.append(right_nums[right_i])
                right_i += 1
        
        # Nếu mảng con trái còn phần tử, thêm vào mảng kết quả
        while left_i < len(left_nums):
            nums.append(left_nums[left_i])
            left_i += 1
        
        # Nếu mảng con phải còn phần tử, thêm vào mảng kết quả
        while right_i < len(right_nums):
            nums.append(right_nums[right_i])
            right_i += 1
        
        # Trả về mảng đã được kết hợp
        return nums

    # Quá trình chia
    def mergeSort(self, nums: [int]) -> [int]:
        # Trả về mảng gốc nếu số phần tử nhỏ hơn hoặc bằng 1
        if len(nums) <= 1:
            return nums
        
        mid = len(nums) // 2                        # Tìm vị trí trung tâm của mảng
        left_nums = self.mergeSort(nums[0: mid])    # Đệ quy chia mảng con trái và sắp xếp
        right_nums =  self.mergeSort(nums[mid:])    # Đệ quy chia mảng con phải và sắp xếp
        return self.merge(left_nums, right_nums)    # Kết hợp các mảng con đã sắp xếp lên trên

    def sortArray(self, nums: [int]) -> [int]:
        return self.mergeSort(nums)
```

### Ý tưởng 5: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times \log n)$.
- **Độ phức tạp không gian**: $O(n)$.

### Ý tưởng 6: Sắp xếp nhanh (Quick Sort)

> **Ý tưởng cơ bản của sắp xếp nhanh (Quick Sort)**: Sử dụng phương pháp chia để trị, chọn một phần tử trong mảng làm "phần tử chốt" và sắp xếp các phần tử trong mảng sao cho các phần tử nhỏ hơn "phần tử chốt" nằm bên trái và các phần tử lớn hơn "phần tử chốt" nằm bên phải. Sau đó, tiếp tục sắp xếp các phần tử bên trái và bên phải "phần tử chốt" theo cùng phương pháp cho đến khi mảng đã được sắp xếp.

Giả sử mảng có $n$ phần tử, thuật toán sắp xếp nhanh có các bước như sau:

1. **Phân hoạch**: Chọn một phần tử trong mảng làm "phần tử chốt" và sắp xếp các phần tử trong mảng sao cho các phần tử nhỏ hơn "phần tử chốt" nằm bên trái và các phần tử lớn hơn "phần tử chốt" nằm bên phải.
	1. Chọn một phần tử làm "phần tử chốt" (ở đây chọn phần tử đầu tiên trong mảng làm "phần tử chốt", tức $pivot = nums[low]$).
	2. Sử dụng hai con trỏ $i$ và $j$ để duyệt mảng, $i$ bắt đầu từ đầu mảng, $j$ bắt đầu từ cuối mảng.
	3. Di chuyển con trỏ $j$ từ phải sang trái, tìm phần tử đầu tiên nhỏ hơn "phần tử chốt".
	4. Di chuyển con trỏ $i$ từ trái sang phải, tìm phần tử đầu tiên lớn hơn "phần tử chốt".
	5. Hoán đổi vị trí của hai phần tử mà con trỏ $i$ và $j$ đang trỏ đến.
	6. Lặp lại bước 3 đến bước 5 cho đến khi con trỏ $i$ và $j$ gặp nhau, sau đó đặt "phần tử chốt" vào vị trí cuối cùng của mảng con đã phân hoạch.
2. **Đệ quy chia**: Sau khi phân hoạch xong, tiếp tục sắp xếp các phần tử bên trái và bên phải "phần tử chốt" bằng cùng phương pháp.
	1. Dựa vào vị trí "phần tử chốt" để chia mảng thành hai mảng con.
	2. Đệ quy sắp xếp các mảng con bên trái và bên phải, cho đến khi mỗi mảng chỉ còn một phần tử, sau đó kết hợp các mảng con đã sắp xếp.

### Ý tưởng 6: Code

```python
import random

class Solution:
    # Phân hoạch ngẫu nhiên: Chọn một phần tử ngẫu nhiên từ nums[low: high + 1] và thực hiện phân hoạch
    def randomPartition(self, nums: [int], low: int, high: int) -> int:
        # Chọn một phần tử ngẫu nhiên
        i = random.randint(low, high)
        # Hoán đổi vị trí của phần tử ngẫu nhiên và phần tử đầu tiên
        nums[i], nums[low] = nums[low], nums[i]
        # Sắp xếp phần tử trong mảng sao cho các phần tử nhỏ hơn "phần tử chốt" nằm bên trái và các phần tử lớn hơn "phần tử chốt" nằm bên phải, sau đó đặt "phần tử chốt" vào vị trí cuối cùng của mảng con đã phân hoạch
        return self.partition(nums, low, high)
    
    # Phân hoạch: Sắp xếp các phần tử trong mảng sao cho các phần tử nhỏ hơn "phần tử chốt" nằm bên trái và các phần tử lớn hơn "phần tử chốt" nằm bên phải, sau đó đặt "phần tử chốt" vào vị trí cuối cùng của mảng con đã phân hoạch
    def partition(self, nums: [int], low: int, high: int) -> int:        
        # Chọn phần tử đầu tiên làm "phần tử chốt"
        pivot = nums[low]
        
        i, j = low, high
        while i < j:
            # Di chuyển con trỏ j từ phải sang trái, tìm phần tử đầu tiên nhỏ hơn "phần tử chốt"
            while i < j and nums[j] >= pivot:
                j -= 1
            # Di chuyển con trỏ i từ trái sang phải, tìm phần tử đầu tiên lớn hơn "phần tử chốt"
            while i < j and nums[i] <= pivot:
                i += 1
            # Hoán đổi vị trí của hai phần tử mà con trỏ i và j đang trỏ đến
            nums[i], nums[j] = nums[j], nums[i]
        
        # Đặt "phần tử chốt" vào vị trí cuối cùng của mảng con đã phân hoạch
        nums[j], nums[low] = nums[low], nums[j]
        return j

    def quickSort(self, nums: [int], low: int, high: int) -> [int]:
        if low < high:
            # Dựa vào vị trí "phần tử chốt" để chia mảng thành hai mảng con
            pivot_i = self.partition(nums, low, high)
            # Đệ quy sắp xếp các mảng con bên trái và bên phải
            self.quickSort(nums, low, pivot_i - 1)
            self.quickSort(nums, pivot_i + 1, high)

        return nums

    def sortArray(self, nums: [int]) -> [int]:
        return self.quickSort(nums, 0, len(nums) - 1)
```

### Ý tưởng 6: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times \log n)$.
- **Độ phức tạp không gian**: $O(n)$.

### Ý tưởng 7: Sắp xếp vun đống (Heap Sort)

> **Ý tưởng cơ bản của sắp xếp heap (Heap Sort)**: Sử dụng cấu trúc dữ liệu heap để thiết kế thuật toán sắp xếp. Chuyển mảng thành một max heap, lặp lại việc lấy ra phần tử lớn nhất từ heap và duy trì tính chất heap cho phần còn lại của mảng.

Giả sử mảng có $n$ phần tử, thuật toán sắp xếp heap có các bước như sau:

1. **Xây dựng heap ban đầu**:
	1. Định nghĩa một mảng để lưu trữ cấu trúc dữ liệu heap và sao chép các phần tử của mảng gốc vào mảng heap (giữ nguyên thứ tự ban đầu).
	2. Bắt đầu từ vị trí giữa của mảng, từ phải sang trái, lần lượt thực hiện việc "điều chỉnh xuống" để chuyển mảng thành một max heap.
2. **Hoán đổi và điều chỉnh heap**:
	1. Hoán đổi phần tử đầu tiên của heap (phần tử thứ nhất) với phần tử cuối cùng (phần tử cuối cùng của mảng), sau đó giảm kích thước của heap đi $1$.
	2. Sau khi hoán đổi phần tử, do phần tử đầu tiên của heap thay đổi, cần thực hiện "điều chỉnh xuống" từ gốc của heap để duy trì tính chất heap.
3. **Lặp lại việc hoán đổi và điều chỉnh heap**:
	1. Lặp lại bước $2$, cho đến khi kích thước của heap là $1$, tức là mảng đã được sắp xếp hoàn chỉnh theo thứ tự tăng dần.

### Ý tưởng 7: Code

```python
class Solution:
    # Điều chỉnh heap
    def heapify(self, arr, index, end):
        left = index * 2 + 1
        right = left + 1
        while left <= end:
            # Nút hiện tại là nút không lá
            max_index = index
            if arr[left] > arr[max_index]:
                max_index = left
            if right <= end and arr[right] > arr[max_index]:
                max_index = right
            if index == max_index:
                # Nếu không cần hoán đổi, tức là đã hoán đổi xong
                break
            arr[index], arr[max_index] = arr[max_index], arr[index]
            # Tiếp tục điều chỉnh cây con
            index = max_index
            left = index * 2 + 1
            right = left + 1

    # Xây dựng max heap ban đầu
    def buildMaxHeap(self, arr):
        size = len(arr)
        # (size-2) // 2 là nút không lá cuối cùng, không cần điều chỉnh
        for i in range((size - 2) // 2, -1, -1):
            self.heapify(arr, i, size - 1)
        return arr

    # Sắp xếp heap tăng dần, ý tưởng như sau:
    # 1. Xây dựng max heap ban đầu
    # 2. Hoán đổi nút gốc (nút đầu tiên) với nút cuối cùng, sau đó điều chỉnh từ nút gốc đến nút thứ hai từ cuối cùng để lấy giá trị lớn nhất
    # 3. Tiếp tục hoán đổi nút gốc với nút thứ hai từ cuối cùng, sau đó điều chỉnh từ nút gốc đến nút thứ ba từ cuối cùng để lấy giá trị thứ hai lớn nhất
    # 4. Tiếp tục như vậy, cho đến khi hoàn thành hoán đổi nút gốc với nút thứ hai từ đầu tiên
    def maxHeapSort(self, arr):
        self.buildMaxHeap(arr)
        size = len(arr)
        for i in range(size):
            arr[0], arr[size-i-1] = arr[size-i-1], arr[0]
            self.heapify(arr, 0, size-i-2)
        return arr

    def sortArray(self, nums: List[int]) -> List[int]:
        return self.maxHeapSort(nums)
```

### Ý tưởng 7: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times \log n)$.
- **Độ phức tạp không gian**: $O(1)$.

### Ý tưởng 8: Sắp xếp đếm (Counting Sort)

> **Ý tưởng cơ bản của sắp xếp đếm (Counting Sort)**: Thông qua việc đếm số lần xuất hiện của mỗi phần tử trong mảng, dựa trên thông tin đếm này, sắp xếp các phần tử của mảng vào vị trí đúng để đạt được mục đích sắp xếp.

Giả sử mảng có $n$ phần tử, thuật toán sắp xếp đếm được thực hiện như sau:

1. **Tính toán phạm vi sắp xếp**: Duyệt qua mảng để tìm phần tử lớn nhất $nums\underline{}max$ và phần tử nhỏ nhất $nums\underline{}min$ trong mảng, tính toán phạm vi sắp xếp là $nums\underline{}max - nums\underline{}min + 1$.
2. **Định nghĩa mảng đếm**: Định nghĩa một mảng đếm $counts$ có kích thước bằng phạm vi sắp xếp, dùng để đếm số lần xuất hiện của mỗi phần tử. Trong đó:
    - Chỉ số $num - nums\underline{}min$ của mảng đếm đại diện cho giá trị của phần tử $num$.
    - Giá trị $counts[num - nums\underline{}min]$ của mảng đếm đại diện cho số lần xuất hiện của phần tử $num$.

3. **Thống kê số lần xuất hiện của các phần tử trong mảng**: Duyệt qua mảng $nums$, đếm số lần xuất hiện của mỗi phần tử trong mảng đếm bằng cách tăng giá trị $counts[num - nums\underline{}min]$ lên $1$.
4. **Tạo mảng tích lũy**: Bắt đầu từ phần tử thứ $1$ của mảng đếm, tích lũy giá trị của mỗi phần tử bằng tổng giá trị của phần tử trước đó và chính nó. Lúc này, $counts[num - nums\underline{}min]$ đại diện cho vị trí cuối cùng mà phần tử có giá trị $num$ xuất hiện trong mảng sắp xếp.
5. **Điền ngược vào mảng kết quả**: Duyệt qua mảng $nums$ theo thứ tự ngược, điền mỗi phần tử $num$ vào vị trí đúng.
    - Điền vào vị trí $counts[num - nums\underline{}min]$ của mảng kết quả $res$.
    - Sau khi điền, giảm giá trị tại vị trí tương ứng trong mảng tích lũy, để có được vị trí đặt phần tử $num$ tiếp theo.

### Ý tưởng 8: Code

```python
class Solution:
    def countingSort(self, nums: [int]) -> [int]:
        # Tính toán phạm vi sắp xếp từ mảng đầu vào
        nums_min, nums_max = min(nums), max(nums)
        size = nums_max - nums_min + 1
        counts = [0 for _ in range(size)]
        
        # Thống kê số lần xuất hiện của các phần tử trong mảng
        for num in nums:
            counts[num - nums_min] += 1
        
        # Tạo mảng tích lũy
        for i in range(1, size):
            counts[i] += counts[i - 1]

        # Điền ngược vào mảng kết quả
        res = [0 for _ in range(len(nums))]
        for i in range(len(nums) - 1, -1, -1):
            num = nums[i]
            # Đặt phần tử num vào vị trí đúng trong mảng kết quả
            res[counts[num - nums_min] - 1] = num
            # Giảm giá trị tại vị trí tương ứng trong mảng tích lũy, để có được vị trí đặt phần tử num tiếp theo
            counts[nums[i] - nums_min] -= 1

        return res

    def sortArray(self, nums: [int]) -> [int]:
        return self.countingSort(nums)
```

### Ý tưởng 8: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n + k)$. Trong đó, $k$ là phạm vi giá trị của mảng đầu vào.
- **Độ phức tạp không gian**: $O(k)$. Trong đó, $k$ là phạm vi giá trị của mảng đầu vào.

### Ý tưởng 9: Sắp xếp xô (Bucket Sort)

> **Ý tưởng cơ bản của sắp xếp xô (Bucket Sort)**: Chia các phần tử trong mảng thành các "xô" (bucket) và sau đó sắp xếp riêng từng xô.

Giả sử mảng có $n$ phần tử, thuật toán sắp xếp xô được thực hiện như sau:

1. **Xác định số lượng xô**: Dựa trên phạm vi giá trị của mảng đầu vào, chia mảng thành $k$ xô, mỗi xô tương ứng với một khoảng giá trị.
2. **Phân phối các phần tử**: Duyệt qua mảng đầu vào, phân phối từng phần tử vào xô tương ứng dựa trên giá trị của nó.
3. **Sắp xếp từng xô**: Sắp xếp riêng từng xô, có thể sử dụng các thuật toán sắp xếp như sắp xếp chèn, sắp xếp trộn, sắp xếp nhanh, v.v.
4. **Kết hợp các phần tử trong các xô**: Kết hợp các phần tử đã được sắp xếp trong các xô theo thứ tự khoảng giá trị để tạo thành một mảng đã sắp xếp hoàn chỉnh.

### Ý tưởng 9: Code

```python
class Solution:
    def insertionSort(self, nums: [int]) -> [int]:
        # Duyệt qua phạm vi chưa được sắp xếp
        for i in range(1, len(nums)):
            temp = nums[i]
            j = i
            # Duyệt từ phải sang trái trong phạm vi đã được sắp xếp
            while j > 0 and nums[j - 1] > temp:
                # Di chuyển các phần tử sang phải một vị trí
                nums[j] = nums[j - 1]
                j -= 1
            # Đặt phần tử hiện tại vào vị trí đúng
            nums[j] = temp
            
        return nums

    def bucketSort(self,  nums: [int], bucket_size=5) -> [int]:
        # Tính toán phạm vi giá trị của mảng đầu vào
        nums_min, nums_max = min(nums), max(nums)
        # Xác định số lượng xô bằng cách chia phạm vi giá trị cho kích thước mỗi xô
        bucket_count = (nums_max - nums_min) // bucket_size + 1
        # Khởi tạo mảng xô
        buckets = [[] for _ in range(bucket_count)]

        # Phân phối các phần tử vào xô tương ứng dựa trên giá trị của chúng
        for num in nums:
            buckets[(num - nums_min) // bucket_size].append(num)

        # Sắp xếp từng xô riêng biệt và kết hợp các phần tử đã sắp xếp trong các xô
        res = []
        for bucket in buckets:
            self.insertionSort(bucket)
            res.extend(bucket)
        
        # Trả về mảng đã sắp xếp
        return res

    def sortArray(self, nums: [int]) -> [int]:
        return self.bucketSort(nums)
```

### Ý tưởng 9: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$.
- **Độ phức tạp không gian**: $O(n + m)$. Trong đó, $m$ là số lượng xô.

### Ý tưởng 10: Sắp xếp cơ số (Radix Sort)

> **Ý tưởng cơ bản của sắp xếp cơ số (Radix Sort)**: Chia các số thành các chữ số riêng biệt và sau đó sắp xếp từng chữ số theo thứ tự từ thấp đến cao.

Chúng ta sẽ lấy ví dụ với phương pháp ưu tiên số thấp nhất để giải thích các bước của thuật toán sắp xếp cơ số.

1. **Xác định số lượng chữ số lớn nhất trong dãy số**: Duyệt qua các phần tử của mảng, tìm giá trị lớn nhất và xác định số lượng chữ số của nó.
2. **Từ chữ số thấp nhất (đơn vị) đến chữ số cao nhất, sắp xếp từng chữ số một**:
   1. Định nghĩa một mảng xô có kích thước 10, mỗi xô đại diện cho một chữ số từ 0 đến 9.
   2. Dựa trên chữ số hiện tại của mỗi phần tử, đặt phần tử vào xô tương ứng.
   3. Xóa mảng ban đầu và sau đó lấy các phần tử từ các xô theo thứ tự và thêm vào mảng ban đầu.
3. **Trả về mảng đã được sắp xếp**.

### Ý tưởng 10: Code

```python
class Solution:
    def radixSort(self, nums: [int]) -> [int]:
        # Xác định số lượng chữ số lớn nhất trong dãy số
        max_num = max(nums)
        max_digit = len(str(max_num))
        
        # Sắp xếp từng chữ số một
        for i in range(max_digit):
            # Định nghĩa một mảng xô có kích thước 10
            buckets = [[] for _ in range(10)]
            # Dựa trên chữ số hiện tại của mỗi phần tử, đặt phần tử vào xô tương ứng
            for num in nums:
                digit = (num // (10 ** i)) % 10
                buckets[digit].append(num)
            # Xóa mảng ban đầu và sau đó lấy các phần tử từ các xô theo thứ tự và thêm vào mảng ban đầu
            nums.clear()
            for bucket in buckets:
                nums.extend(bucket)
        
        # Trả về mảng đã được sắp xếp
        return nums
    
    def sortArray(self, nums: [int]) -> [int]:
        return self.radixSort(nums)
```

### Ý tưởng 10: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times k)$. Trong đó, $n$ là số lượng phần tử cần sắp xếp và $k$ là số lượng chữ số lớn nhất trong dãy số.
- **Độ phức tạp không gian**: $O(n + k)$.
