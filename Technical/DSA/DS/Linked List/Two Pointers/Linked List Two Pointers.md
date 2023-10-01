---
title: Linked List Two Pointers
tags:
  - dsa
  - data-structure
  - algorithm
categories:
  - dsa
  - data-structure
  - algorithm
date created: 2023-09-27
date modified: 2023-09-27
---

## 1. Giới thiệu về con trỏ kép

Trong phần [[Two Pointers]] ở phần mảng, chúng ta đã học về khái niệm con trỏ kép. Hãy xem xét lại.

> **Con trỏ kép (Two Pointers)**: Đề cập đến việc trong quá trình duyệt các phần tử, không sử dụng một con trỏ duy nhất để truy cập, mà sử dụng hai con trỏ để truy cập, từ đó đạt được mục đích tương ứng. Nếu hai con trỏ có hướng ngược nhau, thì được gọi là "con trỏ đối đầu". Nếu hai con trỏ có cùng hướng, thì được gọi là "con trỏ nhanh-chậm". Nếu hai con trỏ thuộc hai mảng / danh sách khác nhau, thì được gọi là "con trỏ tách rời".

Trong danh sách liên kết đơn, vì việc duyệt các nút chỉ có thể theo hướng con trỏ `next`, nên trong trường hợp của danh sách liên kết, chúng ta thường chỉ sử dụng "con trỏ nhanh-chậm" và "con trỏ tách rời". Các loại con trỏ kép này giải quyết các vấn đề khác nhau và chúng ta sẽ trình bày từng loại một.

## 2. Con trỏ nhanh-chậm với điểm bắt đầu khác nhau

> **Con trỏ nhanh-chậm với điểm bắt đầu khác nhau**: Đề cập đến việc hai con trỏ bắt đầu duyệt danh sách từ cùng một phía, nhưng điểm bắt đầu của hai con trỏ không giống nhau. Con trỏ nhanh `fast` di chuyển `n` bước trước con trỏ chậm `slow`, cho đến khi con trỏ nhanh di chuyển đến cuối danh sách.

### 2.1 Các bước để sử dụng con trỏ nhanh-chậm với điểm bắt đầu khác nhau

1. Sử dụng hai con trỏ `slow` và `fast`. `slow` và `fast` đều trỏ đến nút đầu tiên của danh sách, tức là `slow = head`, `fast = head`.
2. Di chuyển con trỏ nhanh `fast` `n` bước trước. Sau đó, di chuyển cả hai con trỏ nhanh và chậm cùng một bước.
3. Khi con trỏ nhanh di chuyển đến cuối danh sách (tức là `fast == None`), thoát khỏi vòng lặp.

### 2.2 Mẫu code của con trỏ nhanh-chậm với điểm bắt đầu khác nhau

```python
slow = head
fast = head

while n:
    fast = fast.next
    n -= 1
while fast:
    fast = fast.next
    slow = slow.next
```

### 2.3 Phạm vi áp dụng của con trỏ nhanh-chậm với điểm bắt đầu khác nhau

Con trỏ nhanh-chậm với điểm bắt đầu khác nhau chủ yếu được sử dụng để tìm nút thứ k từ cuối danh sách liên kết, xóa nút thứ N từ cuối danh sách, v.v.

### 2.4 Xóa nút thứ N từ cuối danh sách liên kết

#### 2.4.1 Liên kết đến câu hỏi

- [19. Xóa nút thứ N từ cuối danh sách liên kết - LeetCode](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)

#### 2.4.2 Ý tưởng của câu hỏi

**Mô tả**: Cho một nút đầu danh sách liên kết `head`.

**Yêu cầu**: Xóa nút thứ `n` từ cuối danh sách liên kết và trả về nút đầu danh sách liên kết.

**Chú ý**:

- Yêu cầu sử dụng một lần duyệt.
- Số nút trong danh sách liên kết là `sz`.
- $1 \le sz \le 30$.
- $0 \le Node.val \le 100$.
- $1 \le n \le sz$.

**Ví dụ**:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/remove_ex1.jpg)

```python
Input: head = [1,2,3,4,5], n = 2
Output: [1,2,3,5]


Input: head = [1], n = 1
Output: []
```

#### 2.4.3 Ý tưởng giải quyết

##### Ý tưởng 1: Con trỏ nhanh-chậm

Ý tưởng thông thường là duyệt qua danh sách một lần, tính toán độ dài danh sách, sau đó duyệt qua danh sách một lần nữa để đến vị trí tương ứng và xóa nút tại vị trí đó.

Nếu muốn thực hiện chỉ một lần duyệt, có thể sử dụng con trỏ nhanh-chậm. Đặt con trỏ nhanh di chuyển `n` bước trước, sau đó con trỏ nhanh và chậm cùng di chuyển một bước. Khi con trỏ nhanh đến cuối danh sách, con trỏ chậm sẽ chính xác đến vị trí nút thứ `n` từ cuối danh sách. Xóa nút tại vị trí đó.

Cần lưu ý rằng nút cần xóa có thể là nút đầu tiên. Có thể xem xét tạo một nút `dummy` mới trước khi duyệt, cho nút `dummy` mới trỏ đến nút `head` cũ. Điều này có nghĩa là nếu nút cần xóa là nút đầu tiên, chỉ cần xóa nút `head` cũ. Khi trả về kết quả, có thể trả về nút head mới. Đây cũng là một kĩ thuật xử lý sử dụng rất nhiều khi gặp các bài tập liên quan tới danh sách liên kết.

##### Ý tưởng 1: Code

```python
class Solution:
    def removeNthFromEnd(self, head: ListNode, n: int) -> ListNode:
        dummy = ListNode(0, head)
        fast = head
        slow = newHead
        while n:
            fast = fast.next
            n -= 1
        while fast:
            fast = fast.next
            slow = slow.next
        slow.next = slow.next.next
        return dummy.next
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$.
- **Độ phức tạp không gian**: $O(1)$.

## 3. Con trỏ nhanh-chậm với bước đi không đều

> **Con trỏ nhanh-chậm với bước đi không đều**: Đề cập đến việc hai con trỏ bắt đầu duyệt danh sách từ cùng một phía, hai con trỏ có cùng điểm bắt đầu, nhưng bước đi của hai con trỏ không đều nhau. Ví dụ, con trỏ chậm `slow` di chuyển `1` bước mỗi lần, con trỏ nhanh `fast` di chuyển `2` bước mỗi lần. Đến khi con trỏ nhanh di chuyển đến cuối danh sách, thì dừng lại.

### 3.1 Các bước để sử dụng con trỏ nhanh-chậm với bước đi không đều

1. Sử dụng hai con trỏ `slow` và `fast`. Cả hai con trỏ đều trỏ đến nút đầu tiên của danh sách, tức là `slow = head`, `fast = head`.
2. Trong vòng lặp, di chuyển cả hai con trỏ nhanh và chậm cùng một bước, nhưng bước đi của chúng không đều nhau. Ví dụ, con trỏ chậm di chuyển `1` bước, tức là `slow = slow.next`. Con trỏ nhanh di chuyển `2` bước, tức là `fast = fast.next.next`.
3. Khi con trỏ nhanh di chuyển đến cuối danh sách (tức là `fast == None`), thoát khỏi vòng lặp.

### 3.2 Mẫu code của con trỏ nhanh-chậm với bước đi không đều

```python
fast = head
slow = head

while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
```

### 3.3 Phạm vi áp dụng của con trỏ nhanh-chậm với bước đi không đều

Con trỏ nhanh-chậm với bước đi không đều thích hợp để tìm điểm giữa của danh sách liên kết, kiểm tra và phát hiện xem danh sách liên kết có vòng hay không, tìm điểm giao của hai danh sách liên kết, v.v.

### 3.4 Điểm giữa của danh sách liên kết

#### 3.4.1 Liên kết đến câu hỏi

- [876. Điểm giữa của danh sách liên kết - LeetCode](https://leetcode.com/problems/middle-of-the-linked-list/)

#### 3.4.2 Ý tưởng của câu hỏi

**Mô tả**: Cho một nút đầu của danh sách liên kết `head`.

**Yêu cầu**: Trả về nút giữa của danh sách liên kết. Nếu có hai nút giữa, trả về nút giữa thứ hai.

**Chú ý**:

- Số nút trong danh sách liên kết nằm trong khoảng từ `1` đến `100`.

**Ví dụ**:

```python
Input: [1,2,3,4,5]
Output: Nút giữa của danh sách này là nút 3 (dạng chuỗi: [3,4,5])
Giải thích: Trả về giá trị của nút là 3.
Chú ý rằng chúng ta trả về một đối tượng ListNode có giá trị ans, với:
ans.val = 3, ans.next.val = 4, ans.next.next.val = 5, và ans.next.next.next = NULL.


Input: [1,2,3,4,5,6]
Output: Nút giữa của danh sách này là nút 4 (dạng chuỗi: [4,5,6])
Giải thích: Vì danh sách có hai nút giữa, giá trị lần lượt là 3 và 4, chúng ta trả về nút giữa thứ hai.
```

#### 3.4.3 Ý tưởng giải quyết

##### Ý tưởng 1: Con trỏ đơn

Duyệt qua danh sách một lần, đếm số lượng nút là `n`, sau đó duyệt đến vị trí `n / 2` và trả về nút giữa.

##### Ý tưởng 1: Code

```python
class Solution:
    def middleNode(self, head: ListNode) -> ListNode:
        n = 0
        curr = head
        while curr:
            n += 1
            curr = curr.next
        k = 0
        curr = head
        while k < n // 2:
            k += 1
            curr = curr.next
        return curr
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$.
- **Độ phức tạp không gian**: $O(1)$.

##### Ý tưởng 2: Con trỏ nhanh-chậm

Sử dụng con trỏ nhanh-chậm với bước đi không đều để tìm điểm giữa của danh sách liên kết. Cách thực hiện cụ thể như sau:

1. Sử dụng hai con trỏ `slow` và `fast`. Cả hai con trỏ đều trỏ đến nút đầu tiên của danh sách, tức là `slow = head`, `fast = head`.
2. Trong vòng lặp, di chuyển cả hai con trỏ nhanh và chậm cùng một bước. Con trỏ chậm di chuyển `1` bước, tức là `slow = slow.next`. Con trỏ nhanh di chuyển `2` bước, tức là `fast = fast.next.next`.
3. Khi con trỏ nhanh di chuyển đến cuối danh sách (tức là `fast == None`), thoát khỏi vòng lặp. Lúc này, con trỏ chậm sẽ trỏ đến vị trí giữa của danh sách.
4. Trả về con trỏ chậm.

##### Ý tưởng 2: Code

```python
class Solution:
    def middleNode(self, head: ListNode) -> ListNode:
        fast = head
        slow = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        return slow
```

##### Ý tưởng 2: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$.
- **Độ phức tạp không gian**: $O(1)$.

### 3.5 Kiểm tra xem danh sách liên kết có vòng hay không

#### 3.5.1 Liên kết đến câu hỏi

- [141. Kiểm tra xem danh sách liên kết có vòng hay không - LeetCode](https://leetcode.com/problems/linked-list-cycle/)

#### 3.5.2 Ý tưởng của câu hỏi

**Mô tả**: Cho một nút đầu của danh sách liên kết `head`.

**Yêu cầu**: Kiểm tra xem danh sách liên kết có chứa vòng hay không. Nếu có vòng, trả về `True` , ngược lại trả về `False`.

**Chú ý**:

- Số nút trong danh sách liên kết nằm trong khoảng từ `0` đến `10^4`.
- $-10^5 \le \text{Node.val} \le 10^5$.
- `pos` có thể là `-1` hoặc một chỉ mục hợp lệ trong danh sách liên kết.

**Ví dụ**:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/circularlinkedlist.png)

```python
Input: head = [3,2,0,-4], pos = 1
Output: True
Giải thích: Danh sách liên kết có một vòng, đuôi của nó được kết nối với nút thứ hai.
```

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/circularlinkedlist_test2.png)

```python
Input: head = [1,2], pos = 0
Output: True
Giải thích: Danh sách liên kết có một vòng, đuôi của nó được kết nối với nút đầu tiên.
```

#### 3.5.3 Ý tưởng giải quyết

##### Ý tưởng 1: Bảng băm

Ý tưởng đơn giản nhất là duyệt qua tất cả các nút, trước mỗi lần duyệt nút, sử dụng bảng băm để kiểm tra xem nút đã được truy cập chưa. Nếu đã truy cập, có nghĩa là có vòng, nếu chưa truy cập, thì thêm nút đó vào bảng băm và tiếp tục duyệt.

##### Ý tưởng 1: Code

```python
class Solution:
    def hasCycle(self, head: ListNode) -> bool:
        nodeset = set()

        while head:
            if head in nodeset:
                return True
            nodeset.add(head)
            head = head.next
        return False
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$.
- **Độ phức tạp không gian**: $O(n)$.

##### Ý tưởng 2: Con trỏ nhanh-chậm (Thuật toán Floyd)

Phương pháp này tương tự như khi chạy trên đường chạy. Hai người cùng xuất phát từ cùng một vị trí, nếu đường chạy có vòng (đường chạy hình tròn), người chạy nhanh sẽ luôn đuổi kịp người chạy chậm.

Dựa trên ý tưởng trên, Floyd sử dụng hai con trỏ, một con trỏ chậm (rùa) di chuyển một bước mỗi lần, con trỏ nhanh (thỏ) di chuyển hai bước (hai bước hoặc nhiều bước là tương đương). Nếu hai con trỏ gặp nhau tại một nút nào đó ngoài nút đầu tiên của danh sách (nghĩa là bằng nhau), thì có nghĩa là danh sách có vòng, ngược lại, nếu (con trỏ nhanh) đến một nút không có con trỏ tiếp theo, thì có nghĩa là không có vòng.

##### Ý tưởng 2: Code

```python
class Solution:
    def hasCycle(self, head: ListNode) -> bool:
        if head == None or head.next == None:
            return False

        slow = head
        fast = head.next

        while slow != fast:
            if fast == None or fast.next == None:
                return False
            slow = slow.next
            fast = fast.next.next

        return True
```

##### Ý tưởng 2: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$.
- **Độ phức tạp không gian**: $O(1)$.

## 4. Con trỏ kép tách rời

> **Con trỏ kép tách rời**: Hai con trỏ thuộc hai danh sách liên kết khác nhau, và hai con trỏ di chuyển trong hai danh sách liên kết tương ứng.

### 4.1 Các bước để sử dụng Con trỏ kép tách rời

1. Sử dụng hai con trỏ `left_1` và `left_2`. `left_1` trỏ đến nút đầu tiên của danh sách thứ nhất, tức là `left_1 = list1`, `left_2` trỏ đến nút đầu tiên của danh sách thứ hai, tức là `left_2 = list2`.
2. Khi đáp ứng một số điều kiện nhất định, di chuyển cả hai con trỏ cùng một bước sang phải, tức là `left_1 = left_1.next`, `left_2 = left_2.next`.
3. Khi đáp ứng một số điều kiện khác, di chuyển con trỏ `left_1` sang phải, tức là `left_1 = left_1.next`.
4. Khi đáp ứng một số điều kiện khác, di chuyển con trỏ `left_2` sang phải, tức là `left_2 = left_2.next`.
5. Khi một trong hai danh sách liên kết đã được duyệt qua hoặc đáp ứng một số điều kiện đặc biệt, thoát khỏi vòng lặp.

### 4.2 Mẫu mã giả của Con trỏ kép tách rời

```python
left_1 = list1
left_2 = list2

while left_1 and left_2:
    if điều kiện 1:
        left_1 = left_1.next
        left_2 = left_2.next
    elif điều kiện 2:
        left_1 = left_1.next
    elif điều kiện 3:
        left_2 = left_2.next
```

### 4.3 Phạm vi áp dụng của Con trỏ kép tách rời

Con trỏ kép tách rời thường được sử dụng để hợp nhất hai danh sách liên kết đã được sắp xếp.

### 4.4 Hợp nhất hai danh sách liên kết đã được sắp xếp

#### 4.4.1 Liên kết đến câu hỏi

- [21. Hợp nhất hai danh sách liên kết đã được sắp xếp - LeetCode](https://leetcode.com/problems/merge-two-sorted-lists/)

#### 4.4.2 Ý tưởng của câu hỏi

**Mô tả**: Cho hai danh sách liên kết đã được sắp xếp theo thứ tự tăng dần, `list1` và `list2`.

**Yêu cầu**: Hợp nhất hai danh sách liên kết thành một danh sách liên kết đã được sắp xếp.

**Chú ý**:

- Số lượng nút trong hai danh sách liên kết nằm trong khoảng từ `0` đến `50`.
- $-100 \le \text{Node.val} \le 100$.
- `list1` và `list2` đều đã được sắp xếp theo thứ tự tăng dần.

**Ví dụ**:

![](https://assets.leetcode.com/uploads/2020/10/03/merge_ex1.jpg)

```python
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]
```

#### 4.4.3 Ý tưởng giải quyết

##### Ý tưởng 1: Sắp xếp trộn

Sử dụng ý tưởng của sắp xếp trộn, các bước cụ thể như sau:

1. Sử dụng nút giả `dummy_head` để tạo một nút đầu mới và sử dụng con trỏ `curr` để duyệt qua danh sách.
2. Sau đó, so sánh giá trị của nút đầu của `list1` và `list2`, thêm nút nhỏ hơn vào danh sách đã hợp nhất và di chuyển con trỏ của danh sách đó sang phải.
3. Lặp lại bước trước cho đến khi một trong hai danh sách đã được duyệt qua.
4. Liên kết danh sách còn lại vào danh sách đã hợp nhất.
5. Trả về nút sau nút giả `dummy_head` là nút đầu của danh sách đã hợp nhất.

##### Ý tưởng 1: Mã

```python
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        dummy_head = ListNode(-1)

        curr = dummy_head
        while list1 and list2:
            if list1.val <= list2.val:
                curr.next = list1
                list1 = list1.next
            else:
                curr.next = list2
                list2 = list2.next
            curr = curr.next

        curr.next = list1 if list1 is not None else list2

        return dummy_head.next
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$.
- **Độ phức tạp không gian**: $O(1)$.
