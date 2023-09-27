---
title: Stack Basic
tags:
  - dsa
  - data-structure
categories:
  - dsa
  - data-structure
date created: 2023-09-27
date modified: 2023-09-27
---

## 1. Giới thiệu về ngăn xếp

> **Ngăn xếp (Stack)** là một cấu trúc dữ liệu dạng danh sách tuyến tính, chỉ cho phép thực hiện các thao tác chèn và xóa trên một đầu của danh sách.

Chúng ta gọi phần cho phép chèn và xóa là **"đỉnh ngăn xếp (top)"**; phần còn lại được gọi là **"đáy ngăn xếp (bottom)"**. Khi không có phần tử nào trong danh sách, ta gọi đó là **"ngăn xếp rỗng"**.

Ngăn xếp có hai thao tác cơ bản: **"thao tác chèn (push)"** và **"thao tác xóa (pop)"**.

- Thao tác chèn vào ngăn xếp còn được gọi là **"đưa vào ngăn xếp"** hoặc **"nhập vào ngăn xếp"**.
- Thao tác xóa khỏi ngăn xếp còn được gọi là **"lấy ra khỏi ngăn xếp"** hoặc **"rút ra khỏi ngăn xếp"**.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230927232719.png)

Đơn giản mà nói, ngăn xếp là một dạng danh sách tuyến tính tuân thủ nguyên tắc **"vào sau ra trước (Last In First Out)"**, viết tắt là **"LIFO"**.

Chúng ta có thể giải thích định nghĩa của ngăn xếp từ hai khía cạnh:

- Khía cạnh thứ nhất là **"danh sách tuyến tính"**.

Ngăn xếp đầu tiên là một danh sách tuyến tính, các phần tử trong ngăn xếp có mối quan hệ tuyến tính với nhau. Các phần tử trong ngăn xếp được đưa vào theo thứ tự $a_1, a_2, …, a_n$. Phần tử đỉnh ngăn xếp là $a_n$.

- Khía cạnh thứ hai là **"nguyên tắc vào sau ra trước"**.

Theo định nghĩa của ngăn xếp, mỗi lần xóa sẽ luôn xóa phần tử đỉnh ngăn xếp hiện tại, tức là phần tử cuối cùng được đưa vào ngăn xếp. Khi thêm phần tử vào ngăn xếp, phần tử đầu tiên được thêm vào sẽ nằm ở đáy ngăn xếp, phần tử cuối cùng được thêm vào sẽ nằm ở đỉnh ngăn xếp. Nghĩa là, việc thêm hoặc xóa phần tử trong ngăn xếp tuân theo nguyên tắc **"vào sau ra trước"**.

## 2. Ngăn xếp lưu trữ theo thứ tự và lưu trữ theo liên kết

Tương tự như danh sách tuyến tính, ngăn xếp có hai phương pháp lưu trữ: **"ngăn xếp theo thứ tự"** và **"ngăn xếp theo liên kết"**.

- **"Ngăn xếp theo thứ tự"**: Đây là cấu trúc lưu trữ ngăn xếp theo thứ tự. Sử dụng một nhóm đơn vị lưu trữ có địa chỉ liên tiếp để lưu trữ các phần tử từ đáy ngăn xếp đến đỉnh ngăn xếp, đồng thời sử dụng con trỏ `top` để chỉ định vị trí của phần tử đỉnh ngăn xếp trong ngăn xếp theo thứ tự.
- **"Ngăn xếp theo liên kết"**: Đây là cấu trúc lưu trữ ngăn xếp theo liên kết. Sử dụng cách thức của danh sách liên kết để triển khai ngăn xếp. Các phần tử trong ngăn xếp được chèn vào trước nút đầu tiên của danh sách liên kết và sử dụng con trỏ `top` để chỉ định phần tử đỉnh ngăn xếp, `top` luôn trỏ đến vị trí của nút đầu tiên trong danh sách liên kết.

Trước khi mô tả cách triển khai cụ thể của ngăn xếp theo thứ tự và theo liên kết, chúng ta hãy xem xét các hoạt động cơ bản của ngăn xếp.

### 2.1 Các hoạt động cơ bản của ngăn xếp

Ngăn xếp, như một loại danh sách tuyến tính, lý thuyết có thể có tất cả các hoạt động đặc trưng của danh sách tuyến tính, nhưng do tính đặc biệt của "vào sau ra trước", nên có một số thay đổi trong các hoạt động của ngăn xếp. Đặc biệt là hoạt động chèn và xóa được thay đổi thành đưa vào ngăn xếp (push) và lấy ra khỏi ngăn xếp (pop).

Các hoạt động cơ bản của ngăn xếp như sau:

- **Khởi tạo ngăn xếp rỗng**: Tạo một ngăn xếp rỗng, xác định kích thước của ngăn xếp `size` và con trỏ `top` trỏ đến phần tử đỉnh ngăn xếp.
- **Kiểm tra ngăn xếp có rỗng hay không**: Khi ngăn xếp rỗng, trả về `True`. Khi ngăn xếp không rỗng, trả về `False`. Thường chỉ được sử dụng trong các hoạt động xóa ngăn xếp và lấy phần tử đỉnh ngăn xếp hiện tại.
- **Kiểm tra ngăn xếp có đầy hay không**: Khi ngăn xếp đầy, trả về `True`. Khi ngăn xếp chưa đầy, trả về `False`. Thường chỉ được sử dụng trong các hoạt động chèn phần tử vào ngăn xếp và lấy phần tử đỉnh ngăn xếp hiện tại.
- **Chèn phần tử (đưa vào ngăn xếp, push)**: Tương đương với việc chèn một phần tử mới vào sau phần tử cuối cùng của danh sách tuyến tính. Và thay đổi con trỏ `top` để chỉ định vị trí của phần tử đỉnh ngăn xếp.
- **Xóa phần tử (lấy ra khỏi ngăn xếp, pop)**: Tương đương với việc xóa phần tử cuối cùng của danh sách tuyến tính. Và thay đổi con trỏ `top` để chỉ định vị trí của phần tử đỉnh ngăn xếp.
- **Lấy phần tử đỉnh ngăn xếp**: Tương đương với việc lấy phần tử cuối cùng của danh sách tuyến tính. Khác với việc chèn và xóa phần tử, hoạt động này không thay đổi con trỏ `top` để chỉ định vị trí của phần tử đỉnh ngăn xếp.

### 2.2 Triển khai ngăn xếp lưu trữ theo thứ tự

Cách đơn giản nhất để triển khai ngăn xếp là sử dụng một mảng để mô tả cấu trúc lưu trữ theo thứ tự của ngăn xếp. Trong `Python`, chúng ta có thể sử dụng danh sách (`list`) để triển khai. Cấu trúc lưu trữ ngăn xếp này cũng được gọi là **"ngăn xếp theo thứ tự"**.

#### 2.2.1 Mô tả cơ bản của ngăn xếp lưu trữ theo thứ tự

Chúng ta đặt `self.top` để trỏ đến vị trí của phần tử đỉnh ngăn xếp.

- **Khởi tạo ngăn xếp rỗng**: Sử dụng danh sách để tạo một ngăn xếp rỗng, xác định kích thước của ngăn xếp `self.size`, và đặt con trỏ `self.top` trỏ đến `-1`, tức là `self.top = -1`.
- **Kiểm tra ngăn xếp có rỗng hay không**: Khi `self.top == -1`, ngăn xếp rỗng, trả về `True`, ngược lại trả về `False`.
- **Kiểm tra ngăn xếp có đầy hay không**: Khi `self.top == self.size - 1`, ngăn xếp đầy, trả về `True`, ngược lại trả về `False`.
- **Chèn phần tử (đưa vào ngăn xếp, push)**: Kiểm tra xem ngăn xếp có đầy hay không, nếu đầy, ném ra ngoại lệ. Nếu ngăn xếp chưa đầy, thêm phần tử mới vào cuối danh sách `self.stack` và di chuyển con trỏ `self.top` sang phải `1` vị trí.
- **Xóa phần tử (lấy ra khỏi ngăn xếp, pop)**: Kiểm tra xem ngăn xếp có rỗng hay không, nếu rỗng, ném ra ngoại lệ. Nếu ngăn xếp không rỗng, xóa phần tử cuối cùng trong danh sách `self.stack` và di chuyển con trỏ `self.top` sang trái `1` vị trí.
- **Lấy phần tử đỉnh ngăn xếp**: Kiểm tra xem ngăn xếp có rỗng hay không, nếu rỗng, ném ra ngoại lệ. Nếu không rỗng, trả về phần tử đỉnh ngăn xếp mà con trỏ `self.top` trỏ đến, tức là `self.stack[self.top]`.

#### 2.2.2 Mã nguồn triển khai ngăn xếp lưu trữ theo thứ tự

```python
class Stack:
    # Khởi tạo ngăn xếp rỗng
    def __init__(self, size=100):
        self.stack = []
        self.size = size
        self.top = -1    
        
    # Kiểm tra ngăn xếp có rỗng hay không
    def is_empty(self):
        return self.top == -1
    
    # Kiểm tra ngăn xếp có đầy hay không
    def is_full(self):
        return self.top + 1 == self.size
    
    # Thêm phần tử vào ngăn xếp
    def push(self, value):
        if self.is_full():
            raise Exception('Ngăn xếp đã đầy')
        else:
            self.stack.append(value)
            self.top += 1
    
    # Lấy phần tử khỏi ngăn xếp
    def pop(self):
        if self.is_empty():
            raise Exception('Ngăn xếp rỗng')
        else:
            self.stack.pop()
            self.top -= 1
    
    # Lấy phần tử đỉnh ngăn xếp
    def peek(self):
        if self.is_empty():
            raise Exception('Ngăn xếp rỗng')
        else:
            return self.stack[self.top]
```

### 2.3 Triển khai ngăn xếp lưu trữ theo liên kết

Cấu trúc lưu trữ ngăn xếp theo thứ tự có một ưu điểm là không cần di chuyển các phần tử khi ngăn xếp đầy hoặc cần điều chỉnh lại không gian lưu trữ. Thay vào đó, ngăn xếp có thể được triển khai bằng cách sử dụng cấu trúc lưu trữ theo liên kết. Trong `Python`, chúng ta có thể triển khai bằng cách tạo các nút liên kết `Node`. Cấu trúc lưu trữ ngăn xếp này còn được gọi là **"ngăn xếp theo liên kết"**.

#### 2.3.1 Mô tả cơ bản của ngăn xếp lưu trữ theo liên kết

Chúng ta đặt `self.top` để trỏ đến vị trí của phần tử đỉnh ngăn xếp.

- **Khởi tạo ngăn xếp rỗng**: Sử dụng danh sách để tạo một ngăn xếp rỗng, và đặt con trỏ `self.top` trỏ đến `None`, tức là `self.top = None`.
- **Kiểm tra ngăn xếp có rỗng hay không**: Khi `self.top == None`, ngăn xếp rỗng, trả về `True`, ngược lại trả về `False`.
- **Chèn phần tử (đưa vào ngăn xếp, push)**: Tạo một nút liên kết với giá trị `value`, chèn vào trước nút đầu tiên của danh sách liên kết và di chuyển con trỏ `self.top` để trỏ đến nút mới.
- **Xóa phần tử (lấy ra khỏi ngăn xếp, pop)**: Kiểm tra xem ngăn xếp có rỗng hay không, nếu rỗng, ném ra ngoại lệ. Nếu ngăn xếp không rỗng, sử dụng biến `cur` để lưu trữ nút đầu tiên mà con trỏ `self.top` đang trỏ đến, sau đó di chuyển con trỏ `self.top` sang phải `1` vị trí và xóa nút `cur`.
- **Lấy phần tử đỉnh ngăn xếp**: Kiểm tra xem ngăn xếp có rỗng hay không, nếu rỗng, ném ra ngoại lệ. Nếu không rỗng, trả về giá trị của nút đỉnh ngăn xếp mà con trỏ `self.top` đang trỏ đến, tức là `self.top.value`.

#### 2.3.2 Mã nguồn triển khai ngăn xếp lưu trữ theo liên kết

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None
        
class Stack:
    # Khởi tạo ngăn xếp rỗng
    def __init__(self):
        self.top = None
    
    # Kiểm tra ngăn xếp có rỗng hay không
    def is_empty(self):
        return self.top == None
    
    # Thêm phần tử vào ngăn xếp
    def push(self, value):
        cur = Node(value)
        cur.next = self.top
        self.top = cur
    
    # Lấy phần tử khỏi ngăn xếp
    def pop(self):
        if self.is_empty():
            raise Exception('Ngăn xếp rỗng')
        else:
            cur = self.top
            self.top = self.top.next
            del cur
    
    # Lấy phần tử đỉnh ngăn xếp
    def peek(self):
        if self.is_empty():
            raise Exception('Ngăn xếp rỗng')
        else:
            return self.top.value
```

## 3. Ứng dụng của ngăn xếp

Ngăn xếp là một cấu trúc dữ liệu và thuật toán phổ biến nhất trong các ứng dụng và chương trình. Ngăn xếp được sử dụng chủ yếu trong hai lĩnh vực:

- Sử dụng ngăn xếp để lưu trữ và truy xuất thông tin một cách dễ dàng, do đó nó thường được sử dụng làm cấu trúc lưu trữ tạm thời trong các thuật toán và chương trình.
  - Ví dụ: ngăn xếp cuộc gọi hàm trong hệ điều hành, chức năng điều hướng trang web trong trình duyệt.
- Quy tắc LIFO (Last In First Out) của ngăn xếp đảm bảo thứ tự lưu trữ và truy xuất cụ thể.
  - Ví dụ: đảo ngược thứ tự một tập hợp các phần tử, lập lịch tàu hỏa.

Dưới đây là một số ví dụ điển hình về ứng dụng của ngăn xếp.

### 3.1 Vấn đề khớp ngoặc

#### 3.1.1 Liên kết đề bài

- [20. Valid Parentheses - LeetCode](https://leetcode.com/problems/valid-parentheses/)

#### 3.1.2 Tóm tắt đề bài

**Mô tả**: Cho một chuỗi `s` chỉ bao gồm các ký tự `'('`, `')'`, `'{'`, `'}'`, `'['`, `']'`.

**Yêu cầu**: Kiểm tra xem chuỗi `s` có hợp lệ (tức là các cặp ngoặc có khớp nhau) hay không.

**Giải thích**:

- Chuỗi hợp lệ phải thỏa mãn:
  1. Cặp ngoặc trái phải phải khớp nhau theo cùng một loại.
  2. Cặp ngoặc trái phải phải được đóng theo đúng thứ tự.

**Ví dụ**:

```python
Input: s = "()"
Output: True


Input: s = "()[]{}"
Output: True
```

#### 3.2.3 Ý tưởng giải quyết

##### Ý tưởng 1: Ngăn xếp

Việc khớp ngoặc là một ứng dụng kinh điển của "ngăn xếp". Chúng ta có thể sử dụng ngăn xếp để giải quyết bài toán này. Cách làm cụ thể như sau:

1. Đầu tiên, kiểm tra xem độ dài chuỗi có phải là số chẵn hay không. Vì ngoặc xuất hiện theo cặp, nên độ dài của chuỗi phải là số chẵn. Nếu độ dài chuỗi là số lẻ, có thể ngay lập tức kết luận rằng các ngoặc trong chuỗi `s` không khớp, trả về `False`.
2. Sử dụng ngăn xếp `stack` để lưu trữ các ngoặc trái chưa khớp. Tiếp theo, lặp qua từng ký tự trong chuỗi `s`.
   1. Nếu gặp ngoặc trái, đưa nó vào ngăn xếp.
   2. Nếu gặp ngoặc phải, kiểm tra xem phần tử đầu tiên trong ngăn xếp có phải là ngoặc trái tương ứng với ngoặc phải hiện tại không.
      1. Nếu là ngoặc trái tương ứng, loại bỏ nó khỏi ngăn xếp và tiếp tục lặp.
      2. Nếu không phải là ngoặc trái tương ứng, có nghĩa là các ngoặc trong chuỗi `s` không khớp, trả về `False`.
3. Sau khi lặp qua tất cả các ký tự trong chuỗi `s`, kiểm tra xem ngăn xếp có rỗng hay không.
   1. Nếu ngăn xếp rỗng, có nghĩa là các ngoặc trong chuỗi `s` khớp nhau, trả về `True`.
   2. Nếu ngăn xếp không rỗng, có nghĩa là các ngoặc trong chuỗi `s` không khớp, trả về `False`.

##### Ý tưởng 1: Mã giả

```python
class Solution:
    def isValid(self, s: str) -> bool:
        if len(s) % 2 == 1:
            return False
        stack = list()
        for ch in s:
            if ch == '(' or ch == '[' or ch == '{':
                stack.append(ch)
            elif ch == ')':
                if len(stack) !=0 and stack[-1] == '(':
                    stack.pop()
                else:
                    return False
            elif ch == ']':
                if len(stack) !=0 and stack[-1] == '[':
                    stack.pop()
                else:
                    return False
            elif ch == '}':
                if len(stack) !=0 and stack[-1] == '{':
                    stack.pop()
                else:
                    return False
        if len(stack) == 0:
            return True
        else:
            return False
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$.
- **Độ phức tạp không gian**: $O(1)$.
