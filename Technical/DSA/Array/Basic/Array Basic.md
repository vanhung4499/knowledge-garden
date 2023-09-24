---
title: Array Basic
tags:
  - data-structure
  - dsa
categories:
  - dsa
  - data-structure
date created: 2023-09-24
date modified: 2023-09-24
---

# Array

## 1. Giới thiệu về mảng

### 1.1 Định nghĩa mảng

> **Mảng (Array)**: Là một cấu trúc dữ liệu dạng danh sách tuyến tính. Nó sử dụng một khối liên tiếp của bộ nhớ để lưu trữ một tập hợp các phần tử cùng kiểu dữ liệu.

Đơn giản mà nói, **"mảng"** là một cách triển khai cấu trúc dữ liệu danh sách tuyến tính theo thứ tự.

Lấy ví dụ với mảng số nguyên, cách lưu trữ của mảng như hình dưới đây.

Như hình trên, giả sử số lượng phần tử trong mảng là , mỗi phần tử trong mảng có một chỉ số tương ứng, bắt đầu từ  và kết thúc ở . Mỗi chỉ số trong mảng tương ứng với một phần tử dữ liệu.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230924172709.png)

Từ hình trên, chúng ta cũng có thể thấy rằng, cách biểu diễn mảng trong máy tính là một khối liên tiếp của không gian lưu trữ. Mỗi phần tử trong mảng chiếm một phần không gian lưu trữ, mỗi phần tử có một địa chỉ bộ nhớ riêng, và các phần tử được xếp chặt chẽ cạnh nhau.

Chúng ta cũng có thể giải thích định nghĩa của mảng từ hai khía cạnh khác nhau.

> 1. **Danh sách tuyến tính**: Danh sách tuyến tính là một cấu trúc dữ liệu trong đó các phần tử được sắp xếp thành một dãy giống như một dòng, các phần tử trên danh sách tuyến tính có cùng kiểu dữ liệu và mỗi phần tử chỉ có hai hướng trước và sau. Mảng là một cấu trúc dữ liệu danh sách tuyến tính, ngoài ra, ngăn xếp, hàng đợi, danh sách liên kết cũng là các cấu trúc dữ liệu danh sách tuyến tính.
> 2. **Không gian liên tục**: Danh sách tuyến tính có hai cách lưu trữ: "lưu trữ tuần tự" và "lưu trữ liên kết". Trong đó, "lưu trữ tuần tự" là khi mảng chiếm một không gian liên tục trong bộ nhớ, các phần tử liền kề trên bộ nhớ vật lý cũng liền kề nhau. Mảng cũng sử dụng lưu trữ tuần tự và lưu trữ liên kết, và lưu trữ các phần tử cùng kiểu dữ liệu.

Tổng hợp hai khía cạnh này, mảng có thể được coi là: một cách triển khai của "danh sách tuyến tính" sử dụng "lưu trữ tuần tự".

### 1.2 Làm thế nào để truy cập ngẫu nhiên vào các phần tử dữ liệu

Một đặc điểm quan trọng của mảng là: **có thể truy cập ngẫu nhiên**. Tức là mảng có thể dựa vào chỉ số để truy cập trực tiếp vào vị trí lưu trữ của một phần tử cụ thể.

Vậy, máy tính làm thế nào để thực hiện truy cập ngẫu nhiên vào các phần tử của mảng?

Máy tính cấp phát một khối lưu trữ liên tục cho mảng, trong đó địa chỉ đầu tiên của mảng được gọi là **"địa chỉ cơ sở"**. Mỗi phần tử trong mảng có một chỉ số tương ứng và địa chỉ bộ nhớ, máy tính sử dụng địa chỉ để truy cập phần tử dữ liệu. Khi máy tính cần truy cập một phần tử cụ thể của mảng, nó sẽ tính toán địa chỉ bộ nhớ tương ứng của phần tử đó bằng **"công thức địa chỉ"**, sau đó truy cập vào địa chỉ bộ nhớ để lấy dữ liệu tương ứng.

Công thức địa chỉ như sau: **Địa chỉ của phần tử tương ứng với chỉ số  = Địa chỉ cơ sở +  × Kích thước mỗi phần tử**.

### 1.3 Mảng đa chiều

Ở trên, chúng ta chỉ giới thiệu về mảng, còn được gọi là mảng một chiều, trong đó các phần tử dữ liệu cũng là các biến chỉ số. Tuy nhiên, trong thực tế, nhiều thông tin là hai chiều hoặc nhiều chiều, mảng một chiều không đáp ứng được nhu cầu của chúng ta, vì vậy chúng ta có mảng đa chiều.

Lấy mảng hai chiều làm ví dụ, mảng có dạng như hình dưới đây.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230924174454.png)

Mảng hai chiều là một cấu trúc đặc biệt gồm  hàng và  cột của các phần tử dữ liệu, thực chất là một mảng của mảng, được gọi là **"mảng của mảng"**. Kích thước của mảng hai chiều có thể khác nhau. Chiều đầu tiên của mảng đại diện cho hàng, chiều thứ hai đại diện cho cột.

Chúng ta có thể coi mảng hai chiều như một ma trận và xử lý các vấn đề liên quan đến ma trận như chuyển vị ma trận, cộng ma trận, nhân ma trận, v.v.

### 1.4 Cách triển khai mảng trong các ngôn ngữ lập trình khác nhau

Trong các ngôn ngữ lập trình cụ thể, cách triển khai mảng có một số khác biệt.

Mảng trong ngôn ngữ C / C++ gần nhất với định nghĩa mảng trong cấu trúc dữ liệu, sử dụng một khối lưu trữ liên tục chứa các phần tử cùng kiểu dữ liệu. Bất kể dữ liệu cơ bản, cấu trúc hoặc đối tượng, tất cả đều được lưu trữ liên tục trong mảng. Ví dụ:

```C++
int arr[3][4] = {{0, 1, 2, 3}, {4, 5, 6, 7}, {8, 9, 10, 11}};
```

Mảng trong Java khác mảng trong cấu trúc dữ liệu. Mảng trong Java cũng lưu trữ các phần tử cùng kiểu dữ liệu, nhưng không nhất thiết phải liên tục (đối với mảng đa chiều). Ngoài ra, nếu là mảng đa chiều, độ dài của các mảng lồng nhau có thể khác nhau. Ví dụ:

```java
int[][] arr = new int[3][]{ {1,2,3}, {4,5}, {6,7,8,9}};
```

Trong Python gốc, thực tế không có khái niệm mảng, mà thay vào đó sử dụng một cấu trúc dữ liệu gọi là danh sách (list) tương tự như ArrayList trong Java. Trong Python, danh sách có thể chứa các kiểu dữ liệu không giống nhau và độ dài của danh sách cũng có thể khác nhau. Ví dụ:

```python
arr = ['python', 'java', ['asp', 'php'], 'c']
```

## 2. Các thao tác cơ bản trên mảng

Các thao tác trên cấu trúc dữ liệu thường bao gồm thêm, xóa, sửa và tìm kiếm. Dưới đây chúng ta sẽ cùng xem qua 4 thao tác cơ bản trên mảng.

### 2.1 Truy cập phần tử

> **Truy cập phần tử thứ $i$ trong mảng**:
>
> 1. Chỉ cần kiểm tra xem giá trị của $i$ có nằm trong khoảng hợp lệ hay không, tức là $0 \le i \le \text{len(nums)} - 1$. Truy cập vượt quá khoảng này sẽ là truy cập không hợp lệ.
> 2. Khi vị trí hợp lệ, lấy giá trị của phần tử tương ứng.

```python
# Đọc giá trị phần tử thứ i từ mảng nums
def value(nums, i):
    if 0 <= i <= len(nums) - 1:
        print(nums[i])
        
arr = [0, 5, 2, 3, 7, 1, 6]
value(arr, 3)
```

Thao tác "truy cập phần tử" không phụ thuộc vào số lượng phần tử trong mảng, do đó, độ phức tạp thời gian của thao tác này là $O(1)$.

### 2.2 Tìm kiếm phần tử

> **Tìm vị trí phần tử có giá trị $val$ trong mảng**:
>
> 1. Thiết lập một vòng lặp dựa trên chỉ số, so sánh $val$ với phần tử dữ liệu hiện tại $nums[i]$.
> 2. Trả về chỉ số của phần tử khi tìm thấy.
> 3. Trả về một giá trị đặc biệt (ví dụ $-1$) khi không tìm thấy sau khi duyệt qua toàn bộ mảng.

```python
# Tìm vị trí xuất hiện đầu tiên của phần tử có giá trị val trong mảng nums
def find(nums, val):
    for i in range(len(nums)):
        if nums[i] == val:
            return i
    return -1

arr = [0, 5, 2, 3, 7, 1, 6]
print(find(arr, 5))
```

Trong thao tác "tìm kiếm phần tử", nếu mảng không được sắp xếp, chúng ta chỉ có thể tìm kiếm bằng cách so sánh $val$ với từng phần tử trong mảng, còn được gọi là tìm kiếm tuyến tính. Thao tác tìm kiếm tuyến tính phụ thuộc vào số lượng phần tử trong mảng, do đó độ phức tạp thời gian của thao tác này là $O(n)$.

### 2.3 Chèn phần tử

Thao tác chèn phần tử được chia thành hai loại: "Chèn phần tử có giá trị $val$ vào cuối mảng" và "Chèn phần tử có giá trị $val$ vào vị trí thứ $i$ trong mảng".

> **Chèn phần tử có giá trị $val$ vào cuối mảng**:
>
> 1. Nếu mảng chưa đầy, ta đặt $val$ vào vị trí trống cuối cùng của mảng và cập nhật số lượng phần tử trong mảng.
> 2. Nếu mảng đã đầy, thao tác chèn sẽ thất bại. Tuy nhiên, trong Python, danh sách (list) đã được xử lý khác, nếu mảng đã đầy, nó sẽ cấp phát thêm không gian mới để chèn.

Trong Python, danh sách (list) đã được đóng gói trực tiếp với thao tác chèn vào cuối, chỉ cần gọi phương thức `append`.

![Chèn phần tử](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210916222517.png)

```python
arr = [0, 5, 2, 3, 7, 1, 6]
val = 4
arr.append(val)
print(arr)
```

Thao tác "chèn phần tử vào cuối mảng" không phụ thuộc vào số lượng phần tử trong mảng, do đó, độ phức tạp thời gian của thao tác này là $O(1)$.

> **Chèn phần tử có giá trị $val$ vào vị trí thứ $i$ trong mảng**:
>
> 1. Kiểm tra xem vị trí chèn $i$ có hợp lệ hay không, tức là $0 \le i \le \text{len(nums)}$.
> 2. Sau khi xác định vị trí hợp lệ, thường thì vị trí thứ $i$ đã có dữ liệu (trừ khi $i = \text{len(nums)}$), ta cần di chuyển các phần tử từ vị trí $i$ đến $\text{len(nums)} - 1$ sang phải một vị trí.
> 3. Sau đó, gán giá trị $val$ vào vị trí thứ $i$ và cập nhật số lượng phần tử trong mảng.

Trong Python, danh sách (list) đã được đóng gói trực tiếp với thao tác chèn vào giữa, chỉ cần gọi phương thức `insert`.

![Chèn phần tử vào giữa](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210916224032.png)

```python
arr = [0, 5, 2, 3, 7, 1, 6]
i, val = 2, 4
arr.insert(i, val)
print(arr)
```

Thao tác "chèn phần tử vào giữa mảng" phụ thuộc vào số lượng phần tử trong mảng do số lần di chuyển phần tử, do đó, độ phức tạp thời gian trung bình và tệ nhất của thao tác này là $O(n)$.

### 2.4 Thay đổi phần tử

> **Thay đổi giá trị của phần tử thứ $i$ trong mảng thành $val$**:
>
> 1. Cần kiểm tra xem vị trí $i$ có hợp lệ hay không, tức là $0 \le i \le \text{len(nums)} - 1$.
> 2. Gán giá trị $val$ cho phần tử thứ $i$.

![Thay đổi phần tử](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210916224722.png)

```python
def change(nums, i, val):
    if 0 <= i <= len(nums) - 1:
        nums[i] = val
        
arr = [0, 5, 2, 3, 7, 1, 6]
i, val = 2, 4
change(arr, i, val)
print(arr)
```

Thao tác "thay đổi phần tử" tương tự như thao tác "truy cập phần tử", không phụ thuộc vào số lượng phần tử trong mảng, do đó, độ phức tạp thời gian của thao tác này là $O(1)$.

### 2.5 Xóa phần tử

Xóa phần tử trong mảng có ba trường hợp: "Xóa phần tử cuối mảng", "Xóa phần tử ở vị trí thứ $i$ trong mảng" và "Xóa phần tử dựa trên điều kiện".

> **Xóa phần tử cuối mảng**:
>
> 1. Chỉ cần giảm số lượng phần tử đi một đơn vị.

Trong Python, danh sách (list) đã được đóng gói trực tiếp với thao tác xóa phần tử cuối mảng, chỉ cần gọi phương thức `pop` mà không truyền tham số.

![Xóa phần tử cuối](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210916233914.png)

```python
arr = [0, 5, 2, 3, 7, 1, 6]
arr.pop()
print(arr)
```

Thao tác "xóa phần tử cuối mảng" không phụ thuộc vào số lượng phần tử trong mảng, do đó, độ phức tạp thời gian của thao tác này là $O(1)$.

> **Xóa phần tử ở vị trí thứ $i$ trong mảng**:
>
> 1. Kiểm tra xem chỉ số $i$ có hợp lệ hay không, tức là $0 \le i \le \text{len(nums)} - 1$.
> 2. Nếu chỉ số hợp lệ, di chuyển các phần tử từ vị trí $i + 1$ đến vị trí $\text{len(nums)} - 1$ sang trái một vị trí.
> 3. Sau đó, cập nhật số lượng phần tử trong mảng.

Trong Python, danh sách (list) đã được đóng gói trực tiếp với thao tác xóa phần tử ở vị trí giữa mảng, chỉ cần truyền chỉ số làm tham số cho phương thức `pop`.

![Xóa phần tử ở giữa](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210916234013.png)

```python
arr = [0, 5, 2, 3, 7, 1, 6]
i = 3
arr.pop(i)
print(arr)
```

Thao tác "xóa phần tử ở giữa mảng" cũng liên quan đến việc di chuyển phần tử, và số lần di chuyển phần tử phụ thuộc vào số lượng phần tử trong mảng, do đó, độ phức tạp thời gian trung bình và tệ nhất của thao tác này là $O(n)$.

> **Xóa phần tử dựa trên điều kiện**: Trường hợp này thường không chỉ định vị trí của phần tử cần xóa, mà thay vào đó chỉ định một điều kiện và xóa tất cả các phần tử thỏa mãn điều kiện đó. Thao tác này cũng sử dụng vòng lặp để kiểm tra từng phần tử và xóa phần tử khi tìm thấy.

```python
arr = [0, 5, 2, 3, 7, 1, 6]
arr.remove(5)
print(arr)
```

Thao tác "xóa phần tử dựa trên điều kiện" cũng liên quan đến việc di chuyển phần tử, và số lần di chuyển phần tử phụ thuộc vào số lượng phần tử trong mảng, do đó, độ phức tạp thời gian trung bình và tệ nhất của thao tác này là $O(n)$.

---

Đến đây, chúng ta đã hoàn thành phần kiến thức cơ bản về mảng. Tiếp theo, chúng ta sẽ tóm tắt lại những điểm chính.

## 3. Tóm tắt kiến thức cơ bản về mảng

Mảng là cấu trúc dữ liệu cơ bản và đơn giản nhất. Mảng là cơ sở để lưu trữ cấu trúc dữ liệu dạng danh sách theo thứ tự. Nó sử dụng một khối liên tiếp của bộ nhớ để lưu trữ một tập hợp các dữ liệu cùng loại.

Đặc điểm quan trọng nhất của mảng là hỗ trợ truy cập ngẫu nhiên. Thời gian truy cập và thay đổi phần tử trong mảng có độ phức tạp thời gian là $O(1)$, thời gian chèn và xóa phần tử ở cuối mảng cũng là $O(1)$, trong trường hợp chèn và xóa phần tử thông thường thì độ phức tạp thời gian là $O(n)$.

Mảng là một công cụ quan trọng trong lập trình và giải quyết các vấn đề. Nắm vững kiến thức cơ bản về mảng sẽ giúp bạn hiểu và sử dụng hiệu quả cấu trúc dữ liệu này trong các ứng dụng thực tế.

## 4. Các bài tập cơ bản về mảng

### 4.1 Các bài tập về thao tác trên mảng

| Số bài | Tiêu đề | Giải pháp | Nhãn | Độ khó |
| :------ | :------ | :------ | :------ | :------ |
| 0189 | [Rotate Array](https://leetcode.com/problems/rotate-array/) | [[LeetCode 0189]] | Mảng, Toán học, Hai con trỏ | Trung bình |
| 0066 | [Plus One](https://leetcode.com/problems/plus-one/) | [[LeetCode 0066]] | Mảng, Toán học | Dễ |
| 0724 | [Find Pivot Index](https://leetcode.com/problems/find-pivot-index/) | [[LeetCode 0724]] | Mảng, Tổng tiền tố | Dễ |
| 0485 | [Max Consecutive Ones](https://leetcode.com/problems/max-consecutive-ones/) | [[LeetCode 0485]] | Mảng | Dễ |
| 0238 | [Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/) | [[LeetCode 0238]] | Mảng, Tổng tiền tố | Trung bình |

### 4.2 Các bài tập về mảng hai chiều

| Số bài | Tiêu đề | Giải pháp | Nhãn | Độ khó |
| :------ | :------ | :------ | :------ | :------ |
| 0498 | [Diagonal Traverse](https://leetcode.com/problems/diagonal-traverse/) | [[LeetCode 0498]] | Mảng, Ma trận, Mô phỏng | Trung bình |
| 0048 | [Rotate Image](https://leetcode.com/problems/rotate-image/) | [[LeetCode 0048]] | Mảng, Toán học, Ma trận | Trung bình |
| 0073 | [Set Matrix Zeroes](https://leetcode.com/problems/set-matrix-zeroes/) | [[LeetCode 0073]] | Mảng, Bảng băm, Ma trận | Trung bình |
| 0054 | [Set Matrix Zeroes](https://leetcode.com/problems/set-matrix-zeroes/) | [[LeetCode 0054]] | Mảng, Ma trận, Mô phỏng | Trung bình |
| 0059 | [Spiral Matrix II](https://leetcode.com/problems/spiral-matrix-ii/) | [[LeetCode 0059]] | Mảng, Ma trận, Mô phỏng | Trung bình |
| 0289 | [Game of Life](https://leetcode.com/problems/game-of-life/) | [[LeetCode 0289]] | Mảng, Ma trận, Mô phỏng | Trung bình |
