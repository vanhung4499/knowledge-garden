---
title: Linked List Basic
tags:
  - dsa
  - data-structure
categories:
  - dsa
  - data-structure
date created: 2023-09-27
date modified: 2023-09-27
---

## 1. Giới thiệu về danh sách liên kết

### 1.1 Định nghĩa danh sách liên kết

> **Danh sách liên kết (Linked List)**: là một cấu trúc dữ liệu tuyến tính. Nó sử dụng một tập hợp các đơn vị lưu trữ bất kỳ (có thể liên tục hoặc không liên tục) để lưu trữ một tập hợp các dữ liệu cùng loại.

Đơn giản, **"Danh sách liên kết"** là cách triển khai cấu trúc dữ liệu danh sách tuyến tính bằng cách liên kết các đơn vị lưu trữ với nhau.

Lấy ví dụ về danh sách liên kết đơn, cách lưu trữ của danh sách liên kết như sau:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230927185253.png)

Như hình trên, danh sách liên kết được tạo bằng cách nối các đơn vị lưu trữ với nhau. Mỗi phần tử dữ liệu không chỉ chứa giá trị của nó mà còn chứa một con trỏ trỏ đến phần tử tiếp theo trong quan hệ logic, con trỏ này được gọi là "con trỏ tiếp theo `next`".

Trong danh sách liên kết, mối quan hệ logic giữa các phần tử dữ liệu được thể hiện thông qua con trỏ. Các phần tử dữ liệu liền kề về mặt logic có thể liền kề về mặt vật lý, nhưng cũng có thể không liền kề về mặt vật lý. Vị trí vật lý của chúng là ngẫu nhiên.

Bây giờ chúng ta sẽ tìm hiểu về ưu điểm và nhược điểm của cấu trúc danh sách liên kết:

- **Ưu điểm**: Không cần phải cấp phát không gian lưu trữ trước, có thể tạm thời yêu cầu không gian lưu trữ khi cần, không gây lãng phí không gian; một số thao tác có hiệu suất thời gian cao hơn so với mảng (chèn, di chuyển, xóa phần tử, v.v.).
    
- **Nhược điểm**: Không chỉ dữ liệu của các phần tử mà con trỏ cũng chiếm không gian lưu trữ, chi phí không gian của cấu trúc danh sách lớn hơn so với cấu trúc mảng.

Tiếp theo, chúng ta sẽ giới thiệu một số loại danh sách liên kết khác ngoài danh sách liên kết đơn.

### 1.2 Danh sách liên kết hai chiều

> **Danh sách liên kết hai chiều (Doubly Linked List)**: là một loại danh sách liên kết, còn được gọi là danh sách liên kết kép. Mỗi nút trong danh sách liên kết hai chiều có hai con trỏ, một con trỏ trỏ đến phần tử kế tiếp và một con trỏ trỏ đến phần tử trước đó.

Bằng cách bắt đầu từ bất kỳ nút nào trong danh sách liên kết hai chiều, ta có thể dễ dàng truy cập vào nút trước đó và nút kế tiếp.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230927185346.png)

### 1.3 Danh sách liên kết vòng

> **Danh sách liên kết vòng (Circular linked list)**: là một loại danh sách liên kết. Nút cuối cùng của danh sách liên kết trỏ đến nút đầu tiên, tạo thành một vòng.

Bất kỳ nút nào trong danh sách liên kết vòng cũng có thể truy cập vào bất kỳ nút khác.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230927185404.png)

Tiếp theo, chúng ta sẽ lấy danh sách liên kết đơn làm ví dụ để giới thiệu các thao tác cơ bản trên danh sách liên kết.

## 2. Các thao tác cơ bản trên danh sách liên kết

Thao tác trên cấu trúc dữ liệu thường bao gồm thêm, xóa, sửa, tìm kiếm - 4 trường hợp. Tương tự, các thao tác trên danh sách liên kết cũng bao gồm các trường hợp này. Hãy cùng xem các thao tác cơ bản trên danh sách liên kết.

### 2.1 Định nghĩa cấu trúc danh sách liên kết

Danh sách liên kết được tạo thành từ việc liên kết các nút thông qua con trỏ `next`, vì vậy trước tiên chúng ta sẽ định nghĩa một lớp nút đơn giản, tức là lớp `ListNode`. Lớp `ListNode` có biến thành viên `val` để lưu trữ giá trị của phần tử dữ liệu và biến con trỏ `next` để trỏ đến phần tử kế tiếp.

Sau đó, chúng ta sẽ định nghĩa lớp danh sách liên kết, tức là lớp `LinkedList`. Lớp `LinkedList` chỉ có một biến nút `head` để đại diện cho nút đầu tiên của danh sách liên kết.

Khi tạo danh sách liên kết rỗng, chúng ta chỉ cần đặt biến nút đầu tiên tương ứng thành liên kết rỗng. Trong `Python`, chúng ta có thể đặt nó thành `None`, các ngôn ngữ khác cũng có các giá trị phổ biến tương tự như `NULL`, `nil`, `0`, v.v.

Mã **"Định nghĩa cấu trúc nút và danh sách liên kết"** như sau:

```python
# Lớp nút
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# Lớp danh sách liên kết
class LinkedList:
    def __init__(self):
        self.head = None
```

### 2.2 Tạo một danh sách liên kết tuyến tính

Quá trình tạo một danh sách liên kết tuyến tính như sau: dựa trên các phần tử dữ liệu của danh sách tuyến tính, tạo động các nút liên kết và nối chúng vào danh sách. Quá trình này được thực hiện như sau:

1. Bắt đầu từ phần tử dữ liệu thứ 1 của danh sách tuyến tính, lấy từng phần tử dữ liệu trong danh sách.
2. Mỗi khi lấy một phần tử dữ liệu, tạo một nút mới cho phần tử đó và chèn nút mới vào cuối danh sách liên kết.
3. Sau khi chèn xong, trả về địa chỉ của nút đầu tiên trong danh sách.

Thời gian để tạo một danh sách liên kết tuyến tính là $O(n)$, trong đó $n$ là độ dài của danh sách tuyến tính.

Mã **"Tạo một danh sách liên kết tuyến tính"** như sau:

```python
# Tạo danh sách từ dữ liệu
def create(self, data):
    self.head = ListNode(0)
    cur = self.head
    for i in range(len(data)):
        node = ListNode(data[i])
        cur.next = node
        cur = cur.next
```

### 2.3 Tính độ dài của danh sách liên kết

Độ dài của danh sách liên kết được định nghĩa là số lượng nút liên kết trong danh sách. Thao tác tính độ dài của danh sách liên kết chỉ cần sử dụng một con trỏ có thể di chuyển theo con trỏ của danh sách. Cách thực hiện cụ thể như sau:

1. Đặt con trỏ `cur` trỏ đến nút đầu tiên của danh sách liên kết.
2. Sau đó, duyệt qua danh sách liên kết theo con trỏ `next`, mỗi khi con trỏ `cur` trỏ đến một nút liên kết, tăng biến đếm lên một lần.
3. Khi `cur` trỏ đến giá trị rỗng, kết thúc duyệt, lúc này giá trị biến đếm chính là độ dài của danh sách liên kết, trả về giá trị đó.

Thời gian để tính độ dài của danh sách liên kết là $O(n)$, trong đó $n$ là số lượng nút liên kết trong danh sách. Các hoạt động cơ bản là di chuyển con trỏ `cur`, số lần thực hiện hoạt động là $n$, do đó độ phức tạp thời gian của thuật toán là $O(n)$.

Mã **"Tính độ dài của danh sách liên kết"** như sau:

```python
# Lấy độ dài của danh sách liên kết
def length(self):
    count = 0
    cur = self.head
    while cur:
        count += 1
        cur = cur.next 
    return count
```

### 2.4 Tìm kiếm phần tử

Tìm kiếm vị trí của phần tử có giá trị `val` trong danh sách liên kết: Trong danh sách liên kết, chúng ta không thể truy cập ngẫu nhiên như mảng, chỉ có thể bắt đầu từ nút đầu tiên `head` và duyệt qua từng nút một. Nếu tìm thấy phần tử, trả về địa chỉ của nút tìm thấy. Ngược lại, trả về `None`.

Thao tác tìm kiếm phần tử có độ phức tạp thời gian là $O(n)$, trong đó $n$ là độ dài của danh sách liên kết. Thao tác cơ bản là di chuyển con trỏ `cur`, số lần thực hiện thao tác là $n$, do đó độ phức tạp thời gian của thuật toán là $O(n)$.

Mã **"Tìm kiếm phần tử trong danh sách liên kết"** như sau:

```python
# Tìm kiếm phần tử
def find(self, val):
    cur = self.head
    while cur:
        if val == cur.val:
            return cur
        cur = cur.next

    return None
```

### 2.5 Chèn phần tử

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230927190608.png)

Có ba loại thao tác chèn phần tử trong danh sách liên kết:

- **Chèn phần tử vào đầu danh sách**: Chèn một nút có giá trị `val` vào trước nút đầu tiên của danh sách liên kết.
- **Chèn phần tử vào cuối danh sách**: Chèn một nút có giá trị `val` vào sau nút cuối cùng của danh sách liên kết.
- **Chèn phần tử vào giữa danh sách**: Chèn một nút có giá trị `val` vào trước nút thứ `i` của danh sách liên kết.

Tiếp theo, chúng ta sẽ trình bày từng loại thao tác này.

#### 2.5.1 Chèn phần tử vào đầu danh sách

Các bước thực hiện thuật toán như sau:

1. Tạo một nút liên kết `node` với giá trị `val`.
2. Gán con trỏ `next` của `node` thành nút đầu tiên của danh sách liên kết `head`.
3. Gán nút đầu tiên của danh sách liên kết `head` thành `node`.

Vì việc chèn một nút vào đầu danh sách liên kết không phụ thuộc vào độ dài của danh sách, nên độ phức tạp thời gian của thuật toán này là .

Đoạn mã sau đây thực hiện việc **"Chèn phần tử có giá trị `val` vào đầu danh sách liên kết"**:

```python
# Chèn vào đầu danh sách
def insertFront(self, val):
    node = ListNode(val)
    node.next = self.head
    self.head = node
```

#### 2.5.2 Chèn phần tử vào cuối danh sách

Các bước thực hiện thuật toán như sau:

1. Tạo một nút liên kết `node` với giá trị `val`.
2. Sử dụng con trỏ `cur` để trỏ đến nút đầu tiên của danh sách liên kết `head`.
3. Di chuyển con trỏ `cur` qua các nút liên kết bằng cách sử dụng con trỏ `next` cho đến khi `cur.next == None`.
4. Gán `cur.next` thành `node` để chèn nút mới vào cuối danh sách.

Vì việc di chuyển con trỏ `cur` từ đầu danh sách đến cuối danh sách mất  bước, nên độ phức tạp thời gian của thuật toán này là .

Đoạn mã sau đây thực hiện việc **"Chèn phần tử có giá trị `val` vào cuối danh sách liên kết"**:

```python
# Chèn vào cuối danh sách
def insertRear(self, val):
    node = ListNode(val)
    cur = self.head
    while cur.next:
        cur = cur.next
    cur.next = node
```

#### 2.5.3 Chèn phần tử vào giữa danh sách

Các bước thực hiện thuật toán như sau:

1. Sử dụng con trỏ `cur` và một biến đếm `count`. Gán con trỏ `cur` trỏ đến nút đầu tiên của danh sách liên kết `head` và gán giá trị ban đầu của `count` là `0`.
2. Duyệt qua các nút liên kết bằng cách di chuyển con trỏ `cur` qua các nút liên kết bằng cách sử dụng con trỏ `next`. Mỗi lần con trỏ `cur` trỏ đến một nút liên kết, tăng giá trị của biến đếm `count` lên `1`.
3. Khi `count == index - 1`, điều này có nghĩa là đã duyệt qua `index - 1` nút liên kết và dừng lại.
4. Tạo một nút liên kết `node` với giá trị `val`.
5. Gán `node.next` thành `cur.next` để chèn nút mới vào giữa danh sách.
6. Gán `cur.next` thành `node` để hoàn thành việc chèn.

Vì việc di chuyển con trỏ `cur` từ đầu danh sách đến nút thứ `i` mất $n$ bước, nên độ phức tạp thời gian của thuật toán này là $O(n)$.

Đoạn mã sau đây thực hiện việc **"Chèn phần tử có giá trị `val` vào trước nút thứ `i` của danh sách liên kết"**:

```python
# Chèn vào giữa danh sách
def insertInside(self, index, val):
    count = 0
    cur = self.head
    while cur and count < index - 1:
        count += 1
        cur = cur.next
        
    if not cur:
        return 'Error'
    
    node = ListNode(val)
    node.next = cur.next
    cur.next = node
```

### 2.6 Thay đổi phần tử

Để thay đổi giá trị phần tử thứ `i` trong danh sách liên kết thành `val`, ta thực hiện các bước sau:

1. Sử dụng con trỏ `cur` và một biến đếm `count`. Gán con trỏ `cur` trỏ đến nút đầu tiên của danh sách liên kết `head` và gán giá trị ban đầu của `count` là `0`.
2. Duyệt qua các nút liên kết bằng cách di chuyển con trỏ `cur` qua các nút liên kết bằng cách sử dụng con trỏ `next`. Mỗi lần con trỏ `cur` trỏ đến một nút liên kết, tăng giá trị của biến đếm `count` lên `1`.
3. Khi `count == index`, điều này có nghĩa là đã duyệt qua `index` nút liên kết và dừng lại.
4. Thay đổi giá trị của `cur` thành `val`.

Vì việc di chuyển con trỏ `cur` từ đầu danh sách đến nút thứ `i` mất $n$ bước, nên độ phức tạp thời gian của thuật toán này là $O(n)$.

Đoạn mã sau đây thực hiện việc **"Thay đổi giá trị phần tử thứ `i` trong danh sách liên kết thành `val`"**:

```python
# Thay đổi phần tử
def change(self, index, val):
    count = 0
    cur = self.head
    while cur and count < index:
        count += 1
        cur = cur.next
        
    if not cur:
        return 'Error'
    
    cur.val = val
```

### 2.7 Xóa phần tử

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230927190855.png)

Thao tác xóa phần tử trong danh sách liên kết cũng có ba trường hợp:

- **Xóa phần tử ở đầu danh sách**: Xóa nút đầu tiên của danh sách liên kết.
- **Xóa phần tử ở cuối danh sách**: Xóa nút cuối cùng của danh sách liên kết.
- **Xóa phần tử ở giữa danh sách**: Xóa nút thứ `i` trong danh sách liên kết.

Tiếp theo, chúng ta sẽ trình bày từng trường hợp.

#### 2.7.1 Xóa phần tử ở đầu danh sách

Phương pháp xóa phần tử ở đầu danh sách rất đơn giản, các bước cụ thể như sau:

- Di chuyển `self.head` sang phải một bước bằng con trỏ `next`.

Vì chỉ liên quan đến một bước di chuyển, nên độ phức tạp thời gian của thuật toán này là $O(1)$.

Đoạn mã sau đây thực hiện **"Xóa phần tử ở đầu danh sách"**:

```python
# Xóa phần tử ở đầu danh sách
def removeFront(self):
    if self.head:
        self.head = self.head.next
```

#### 2.7.2 Xóa phần tử ở cuối danh sách

Phương pháp xóa phần tử ở cuối danh sách cũng khá đơn giản, các bước cụ thể như sau:

- Sử dụng con trỏ `cur` di chuyển đến nút thứ `2` từ cuối danh sách.
- Gán con trỏ `next` của nút này thành `None`.

Vì số lần di chuyển đến cuối danh sách là $n$, nên độ phức tạp thời gian của thuật toán này là $O(n)$.

Đoạn mã sau đây thực hiện **"Xóa phần tử ở cuối danh sách"**:

```python
# Xóa phần tử ở cuối danh sách
def removeRear(self):
    if not self.head.next:
        return 'Error'

    cur = self.head
    while cur.next.next:
        cur = cur.next
    cur.next = None
```

#### 2.7.3 Xóa phần tử ở giữa danh sách

Phương pháp xóa phần tử ở giữa danh sách cũng khá đơn giản, các bước cụ thể như sau:

1. Sử dụng con trỏ `cur` di chuyển đến nút thứ `i - 1` trong danh sách.
2. Gán con trỏ `next` của `cur` thành con trỏ `next` của nút thứ `i`.

Đoạn mã sau đây thực hiện **"Xóa phần tử thứ `i` trong danh sách"**:

```python
# Xóa phần tử ở giữa danh sách
def removeInside(self, index):
    count = 0
    cur = self.head
    
    while cur.next and count < index - 1:
        count += 1
        cur = cur.next
        
    if not cur:
        return 'Error'
        
    del_node = cur.next
    cur.next = del_node.next
```

---

Đến đây, chúng ta đã hoàn thành phần giới thiệu cơ bản về danh sách liên kết. Tiếp theo, chúng ta sẽ làm một bản tóm tắt.

## 3. Tóm tắt về danh sách liên kết

Danh sách liên kết là một cấu trúc dữ liệu cơ bản và đơn giản nhất. **"Danh sách liên kết"** là một cấu trúc lưu trữ dữ liệu dạng liên kết để thực hiện các hoạt động trên dữ liệu tuyến tính. Nó sử dụng một tập hợp các đơn vị lưu trữ tùy ý (có thể liên tục hoặc không liên tục) để lưu trữ một tập hợp dữ liệu cùng loại.

Ưu điểm lớn nhất của danh sách liên kết là khả năng linh hoạt trong việc thêm và xóa các phần tử. Thời gian thực hiện các hoạt động truy cập và thay đổi phần tử trong danh sách liên kết là $O(n)$, thời gian thực hiện các hoạt động chèn và xóa phần tử ở đầu danh sách là $O(1)$, thời gian thực hiện các hoạt động chèn và xóa phần tử ở cuối danh sách là $O(n)$. Trong trường hợp thông thường, thời gian thực hiện các hoạt động chèn và xóa phần tử là $O(n)$.
