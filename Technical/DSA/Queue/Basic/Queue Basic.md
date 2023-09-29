---
title: Queue Basic
tags:
  - dsa
  - data-structure
categories:
  - dsa
  - data-structure
date created: 2023-09-27
date modified: 2023-09-29
---

## 1. Giới thiệu hàng đợi

> **Hàng đợi (Queue)**: Là một cấu trúc dữ liệu dạng danh sách tuyến tính, chỉ cho phép thực hiện thêm phần tử vào một đầu của danh sách và xóa phần tử từ đầu kia của danh sách.

Chúng ta gọi đầu cho phép thêm là **"đuôi (rear)"**; và đầu cho phép xóa là **"đầu (front)"**. Khi danh sách không có phần tử nào, chúng ta gọi nó là **"hàng đợi rỗng"**.

Hàng đợi có hai hoạt động cơ bản: **"thêm phần tử (enqueue)"** và **"xóa phần tử (dequeue)"**.

- Hoạt động thêm phần tử vào hàng đợi còn được gọi là **"enqueue"**.
- Hoạt động xóa phần tử khỏi hàng đợi còn được gọi là **"dequeue"**.

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20211204211538.png)

Đơn giản mà nói, hàng đợi là một danh sách tuyến tính tuân theo nguyên tắc **"vào trước ra trước (First In First Out)"**, viết tắt là **"FIFO"**.

Chúng ta có thể giải thích định nghĩa của hàng đợi từ hai khía cạnh:

- Khía cạnh đầu tiên là **"danh sách tuyến tính"**.

Hàng đợi đầu tiên là một danh sách tuyến tính, các phần tử trong hàng đợi có mối quan hệ tuyến tính với nhau. Các phần tử trong hàng đợi được thêm vào theo tuần tự . Phần tử đầu tiên trong hàng đợi là , phần tử cuối cùng trong hàng đợi là .

- Khía cạnh thứ hai là **"nguyên tắc vào trước ra trước"**.

Theo định nghĩa của hàng đợi, phần tử vào hàng đợi trước nhất sẽ ở đầu hàng đợi, phần tử vào hàng đợi sau cùng sẽ ở cuối hàng đợi. Mỗi lần xóa phần tử khỏi hàng đợi, chúng ta luôn xóa phần tử ở đầu hàng đợi, tức là phần tử vào hàng đợi trước nhất. Nghĩa là, việc thêm phần tử vào hàng đợi hoặc xóa phần tử khỏi hàng đợi được thực hiện theo nguyên tắc **" vào trước ra trước"**.

## 2. Hàng đợi lưu trữ theo tuần tự và lưu trữ theo liên kết

Tương tự như danh sách tuyến tính, hàng đợi có hai phương pháp lưu trữ: **"hàng đợi lưu trữ theo tuần tự"** và **"hàng đợi lưu trữ theo liên kết"**.

- **"Hàng đợi lưu trữ theo tuần tự"**: Sử dụng một nhóm các đơn vị lưu trữ liên tiếp để lưu trữ các phần tử trong hàng đợi từ đầu đến cuối. Đồng thời sử dụng con trỏ `front` để chỉ đến vị trí của phần tử đầu hàng đợi trong hàng đợi, và sử dụng con trỏ `rear` để chỉ đến vị trí của phần tử cuối hàng đợi trong hàng đợi.
- **"Hàng đợi lưu trữ theo liên kết"**: Sử dụng danh sách liên kết đơn để triển khai hàng đợi. Các phần tử trong hàng đợi được thêm vào sau nút đầu tiên của danh sách và sử dụng con trỏ `front` để chỉ đến vị trí của phần tử đầu hàng đợi, và `rear` chỉ đến vị trí của phần tử cuối hàng đợi.

Lưu ý: Vị trí mà `front` và `rear` chỉ đến không hoàn toàn cố định. Đôi khi, để thuận tiện trong thiết kế thuật toán và viết mã ngắn gọn, `front` có thể chỉ đến vị trí trước phần tử đầu hàng đợi. `rear` cũng có thể chỉ đến vị trí sau phần tử cuối hàng đợi. Cụ thể phụ thuộc vào cách triển khai thuật toán.

### 2.2 Triển khai hàng đợi lưu trữ theo tuần tự

Cách đơn giản nhất để triển khai hàng đợi là sử dụng một mảng để lưu trữ các phần tử theo tuần tự. Trong `Python`, chúng ta có thể sử dụng danh sách (`list`) để triển khai.

#### 2.2.1 Mô tả cơ bản của hàng đợi lưu trữ theo tuần tự

Để thuận tiện cho thiết kế thuật toán và mã ngắn gọn, chúng ta định nghĩa rằng: con trỏ `self.front` trỏ đến vị trí trước phần tử đầu hàng đợi, và con trỏ `self.rear` trỏ đến vị trí sau phần tử cuối hàng đợi.

- **Khởi tạo hàng đợi rỗng**: Tạo một hàng đợi rỗng `self.queue`, định nghĩa kích thước hàng đợi `self.size`. Đặt con trỏ `self.front` và `self.rear` đều trỏ đến `-1`. Tức là `self.front = self.rear = -1`.
- **Kiểm tra hàng đợi có rỗng hay không**: Dựa vào vị trí mà con trỏ `self.front` và `self.rear` trỏ đến để kiểm tra. Nếu con trỏ `self.front` và `self.rear` trỏ đến cùng một vị trí, thì hàng đợi rỗng. Ngược lại, hàng đợi không rỗng.
- **Kiểm tra hàng đợi đã đầy hay chưa**: Nếu con trỏ `self.rear` trỏ đến vị trí cuối cùng của hàng đợi, tức là `self.rear == self.size - 1`, thì hàng đợi đã đầy. Ngược lại, hàng đợi chưa đầy.
- **Thêm phần tử (nhập hàng)**: Trước tiên kiểm tra hàng đợi đã đầy chưa, nếu đã đầy thì ném ra ngoại lệ. Nếu hàng đợi chưa đầy, di chuyển con trỏ `self.rear` sang phải một vị trí và gán giá trị. Lúc này, con trỏ `self.rear` trỏ đến phần tử cuối hàng đợi.
- **Xóa phần tử (xuất hàng)**: Trước tiên kiểm tra hàng đợi có rỗng hay không, nếu rỗng thì ném ra ngoại lệ. Nếu không rỗng, gán giá trị của phần tử đầu hàng đợi (tại vị trí `self.front + 1`) bằng `None` và di chuyển con trỏ `self.front` sang phải một vị trí.
- **Lấy giá trị phần tử đầu hàng đợi**: Trước tiên kiểm tra hàng đợi có rỗng hay không, nếu rỗng thì ném ra ngoại lệ. Nếu không rỗng, vì con trỏ `self.front` trỏ đến vị trí trước phần tử đầu hàng đợi, nên phần tử đầu hàng đợi nằm ở vị trí sau `self.front`, trả về `self.queue[self.front + 1]`.
- **Lấy giá trị phần tử cuối hàng đợi**: Trước tiên kiểm tra hàng đợi có rỗng hay không, nếu rỗng thì ném ra ngoại lệ. Nếu không rỗng, vì con trỏ `self.rear` trỏ đến vị trí sau phần tử cuối hàng đợi, nên trả về `self.queue[self.rear]`.

#### 2.2.2 Mã nguồn triển khai hàng đợi lưu trữ theo tuần tự

```python
class Queue:
    # Khởi tạo hàng đợi rỗng
    def __init__(self, size=100):
        self.size = size
        self.queue = [None for _ in range(size)]
        self.front = -1
        self.rear = -1
        
    # Kiểm tra hàng đợi có rỗng hay không
    def is_empty(self):
        return self.front == self.rear
    
    # Kiểm tra hàng đợi đã đầy hay chưa
    def is_full(self):
        return self.rear + 1 == self.size
    
    # Thêm phần tử (enqueue)
    def enqueue(self, value):
        if self.is_full():
            raise Exception('Hàng đợi đã đầy')
        else:
            self.rear += 1
            self.queue[self.rear] = value
            
    # Xóa phần tử (dequeue)
    def dequeue(self):
        if self.is_empty():
            raise Exception('Hàng đợi rỗng')
        else:
            self.front += 1
            return self.queue[self.front]
        
    # Lấy giá trị phần tử đầu hàng đợi
    def front_value(self):
        if self.is_empty():
            raise Exception('Hàng đợi rỗng')
        else:
            return self.queue[self.front + 1]
    
    # Lấy giá trị phần tử cuối hàng đợi
    def rear_value(self):
        if self.is_empty():
            raise Exception('Hàng đợi rỗng')
        else:
            return self.queue[self.rear]
```

### 2.3 Triển khai hàng đợi lưu trữ vòng theo tuần tự

Trong phần "2.2 Cài đặt lưu trữ tuần tự của hàng đợi", nếu tất cả các vị trí từ `0` đến `size - 1` trong hàng đợi đều được các phần tử chiếm dụng, thì hàng đợi đã đầy (tức là `self.rear == self.size - 1`), và thực hiện thêm phần tử vào hàng đợi sẽ gây ra ngoại lệ hàng đợi đã đầy.

Tuy nhiên, do thao tác xóa phần tử luôn xóa phần tử đầu hàng đợi và di chuyển `self.front` sang phải, trong khi thao tác chèn phần tử lại luôn được thực hiện ở cuối hàng đợi. Qua các thao tác xóa và chèn, hàng đợi di chuyển như là di chuyển toàn bộ hàng đợi sang phải.

Khi con trỏ hàng đợi đến `self.size - 1` thỏa mãn điều kiện `self.rear == self.size - 1`, thì thêm phần tử vào hàng đợi từ vị trí `0` nếu vẫn còn không gian trống phía trước.

Có hai cách để giải quyết vấn đề "tràn giả (pseudo-overflow)":

- Cách thứ nhất: Sau mỗi lần xóa phần tử đầu hàng đợi, di chuyển toàn bộ các phần tử trong hàng đợi sang trái `1` vị trí. Đoạn mã như sau:

```python
# Thao tác xóa
def dequeue(self):
    if self.is_empty():
        raise Exception('Hàng đợi rỗng')
    else:
        value = self.queue[0]
        for i in range(self.rear):
            self.queue[i] = self.queue[i + 1]
        return value
```

Trong trường hợp này, con trỏ đầu hàng đợi dường như không cần thiết vì con trỏ đầu hàng đợi luôn ở vị trí `0` của hàng đợi. Tuy nhiên, vì thao tác xóa liên quan đến việc di chuyển toàn bộ các phần tử trong hàng đợi, thời gian thực hiện của thao tác xóa sẽ tăng từ  lên . Vì vậy, cách tiếp cận này không phải là lựa chọn tốt.

- Cách thứ hai: Tưởng tượng hàng đợi như một danh sách liên kết tuần hoàn, sử dụng phép toán modulo trong toán học để tái sử dụng không gian. Điều này giải quyết vấn đề "tràn giả (pseudo-overflow)".

Khi thực hiện thao tác chèn, nếu vị trí `self.size - 1` trong hàng đợi đã được chiếm dụng, chỉ cần vẫn còn không gian trống phía trước, phần tử mới sẽ được chèn vào từ vị trí `0`.

Chúng ta đặt: `self.size` là số lượng phần tử tối đa của hàng đợi tuần hoàn. Con trỏ đầu hàng đợi `self.front` trỏ vào vị trí trước phần tử đầu hàng đợi, trong khi con trỏ cuối hàng đợi `self.rear` trỏ vào vị trí của phần tử cuối hàng đợi.

1. **Khởi tạo hàng đợi rỗng**: Tạo một hàng đợi rỗng, định nghĩa kích thước hàng đợi là `self.size + 1`. Đặt con trỏ đầu hàng đợi `self.front` và con trỏ cuối hàng đợi `self.rear` đều trỏ vào `0`, tức là `self.front = self.rear = 0`.
2. **Kiểm tra hàng đợi có rỗng hay không**: Dựa trên vị trí mà con trỏ đầu hàng đợi `self.front` và con trỏ cuối hàng đợi `self.rear` trỏ đến để kiểm tra. Theo thỏa thuận, nếu con trỏ đầu hàng đợi `self.front` và con trỏ cuối hàng đợi `self.rear` trùng nhau, thì hàng đợi rỗng. Ngược lại, hàng đợi không rỗng.
3. **Kiểm tra hàng đợi có đầy hay không**: Con trỏ đầu hàng đợi ở vị trí sau con trỏ cuối hàng đợi, tức là `(self.rear + 1) % self.size == self.front`, thì hàng đợi đã đầy. Ngược lại, hàng đợi chưa đầy.
4. **Chèn phần tử (thêm vào cuối hàng đợi)**: Trước tiên, kiểm tra hàng đợi đã đầy chưa, nếu đã đầy thì ném ra ngoại lệ. Nếu chưa đầy, di chuyển con trỏ cuối hàng đợi `self.rear` sang phải `1` vị trí và thực hiện phép gán. Lúc này, con trỏ cuối hàng đợi `self.rear` trỏ vào phần tử cuối hàng đợi.
5. **Xóa phần tử (xóa phần tử đầu hàng đợi)**: Trước tiên, kiểm tra hàng đợi có rỗng không, nếu rỗng thì ném ra ngoại lệ. Nếu không rỗng, gán giá trị `None` cho phần tử mà con trỏ đầu hàng đợi `self.front` trỏ vào và di chuyển con trỏ đầu hàng đợi `self.front` sang phải `1` vị trí.
6. **Lấy phần tử đầu hàng đợi**: Trước tiên, kiểm tra hàng đợi có rỗng không, nếu rỗng thì ném ra ngoại lệ. Nếu không rỗng, vì con trỏ đầu hàng đợi `self.front` trỏ vào vị trí trước phần tử đầu hàng đợi, nên phần tử đầu hàng đợi nằm ở vị trí sau `self.front`, trả về `self.queue[(self.front + 1) % self.size]`.
7. **Lấy phần tử cuối hàng đợi**: Trước tiên, kiểm tra hàng đợi có rỗng không, nếu rỗng thì ném ra ngoại lệ. Nếu không rỗng, vì con trỏ cuối hàng đợi `self.rear` trỏ vào vị trí cuối hàng đợi, nên trả về `self.queue[self.rear]`.

#### 2.3.1 Mô tả cơ bản của lưu trữ tuần hoàn của hàng đợi

Dưới đây là mô tả cơ bản của lưu trữ tuần hoàn của hàng đợi:

Chúng ta đặt: `self.size` là số lượng phần tử tối đa của hàng đợi tuần hoàn. Con trỏ đầu hàng đợi `self.front` trỏ vào vị trí trước phần tử đầu hàng đợi, trong khi con trỏ cuối hàng đợi `self.rear` trỏ vào vị trí của phần tử cuối hàng đợi.

- **Khởi tạo hàng đợi rỗng**: Tạo một hàng đợi rỗng, định nghĩa kích thước hàng đợi là `self.size + 1`. Đặt con trỏ đầu hàng đợi `self.front` và con trỏ cuối hàng đợi `self.rear` đều trỏ vào `0`, tức là `self.front = self.rear = 0`.
- **Kiểm tra hàng đợi có rỗng hay không**: Dựa trên vị trí mà con trỏ đầu hàng đợi `self.front` và con trỏ cuối hàng đợi `self.rear` trỏ đến để kiểm tra. Theo thỏa thuận, nếu con trỏ đầu hàng đợi `self.front` và con trỏ cuối hàng đợi `self.rear` trùng nhau, thì hàng đợi rỗng. Ngược lại, hàng đợi không rỗng.
- **Kiểm tra hàng đợi có đầy hay không**: Con trỏ đầu hàng đợi ở vị trí sau con trỏ cuối hàng đợi, tức là `(self.rear + 1) % self.size == self.front`, thì hàng đợi đã đầy. Ngược lại, hàng đợi chưa đầy.
- **Chèn phần tử (thêm vào cuối hàng đợi)**: Trước tiên, kiểm tra hàng đợi đã đầy chưa, nếu đã đầy thì ném ra ngoại lệ. Nếu chưa đầy, di chuyển con trỏ cuối hàng đợi `self.rear` sang phải `1` vị trí và thực hiện phép gán. Lúc này, con trỏ cuối hàng đợi `self.rear` trỏ vào phần tử cuối hàng đợi.
- **Xóa phần tử (xóa phần tử đầu hàng đợi)**: Trước tiên, kiểm tra hàng đợi có rỗng không, nếu rỗng thì ném ra ngoại lệ. Nếu không rỗng, gán giá trị `None` cho phần tử mà con trỏ đầu hàng đợi `self.front` trỏ vào và di chuyển con trỏ đầu hàng đợi `self.front` sang phải `1` vị trí.
- **Lấy phần tử đầu hàng đợi**: Trước tiên, kiểm tra hàng đợi có rỗng không, nếu rỗng thì ném ra ngoại lệ. Nếu không rỗng, vì con trỏ đầu hàng đợi `self.front` trỏ vào vị trí trước phần tử đầu hàng đợi, nên phần tử đầu hàng đợi nằm ở vị trí sau `self.front`, trả về `self.queue[(self.front + 1) % self.size]`.
- **Lấy phần tử cuối hàng đợi**: Trước tiên, kiểm tra hàng đợi có rỗng không, nếu rỗng thì ném ra ngoại lệ. Nếu không rỗng, vì con trỏ cuối hàng đợi `self.rear` trỏ vào vị trí cuối hàng đợi, nên trả về `self.queue[self.rear]`.

#### 2.3.2 Mã nguồn triển khai lưu trữ của hàng đợi vòng theo tuần tự

```python
class Queue:
    # Khởi tạo hàng đợi rỗng
    def __init__(self, size=100):
        self.size = size + 1
        self.queue = [None for _ in range(size + 1)]
        self.front = 0
        self.rear = 0
        
    # Kiểm tra hàng đợi có rỗng hay không
    def is_empty(self):
        return self.front == self.rear
    
    # Kiểm tra hàng đợi có đầy hay không
    def is_full(self):
        return (self.rear + 1) % self.size == self.front
    
    # Thêm phần tử vào cuối hàng đợi
    def enqueue(self, value):
        if self.is_full():
            raise Exception('Hàng đợi đã đầy')
        else:
            self.rear = (self.rear + 1) % self.size
            self.queue[self.rear] = value
            
    # Xóa phần tử đầu hàng đợi
    def dequeue(self):
        if self.is_empty():
            raise Exception('Hàng đợi rỗng')
        else:
            self.queue[self.front] = None
            self.front = (self.front + 1) % self.size
            return self.queue[self.front]
        
    # Lấy phần tử đầu hàng đợi
    def front_value(self):
        if self.is_empty():
            raise Exception('Hàng đợi rỗng')
        else:
            value = self.queue[(self.front + 1) % self.size]
            return value
        
    # Lấy phần tử cuối hàng đợi
    def rear_value(self):
        if self.is_empty():
            raise Exception('Hàng đợi rỗng')
        else:
            value = self.queue[self.rear]
            return value
```

### 2.3 Cài đặt hàng đợi lưu trữ theo liên kết

Đối với cấu trúc dữ liệu có sự thay đổi dữ liệu lớn trong quá trình sử dụng, hoặc thực hiện thao tác chèn và xóa thường xuyên, cấu trúc lưu trữ dựa trên liên kết phù hợp hơn so với lưu trữ tuần tự.

Vì vậy, chúng ta có thể sử dụng cấu trúc lưu trữ dựa trên liên kết để triển khai hàng đợi.

1. Chúng ta sử dụng một danh sách liên kết tuyến tính để biểu diễn hàng đợi, trong đó mỗi phần tử trong hàng đợi tương ứng với một nút liên kết trong danh sách liên kết.
2. Chúng ta đặt nút đầu tiên của danh sách liên kết là con trỏ đầu hàng đợi `front` và xác định con trỏ cuối hàng đợi `rear` là con trỏ tới nút cuối cùng của danh sách liên kết.
3. Cuối cùng, chúng ta giới hạn chỉ có thể thực hiện thao tác xóa ở đầu danh sách liên kết và thao tác chèn ở cuối danh sách liên kết, từ đó tạo thành một hàng đợi.

#### 2.3.1 Mô tả cơ bản của hàng đợi lưu trữ theo liên kết

![20211204211644.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20211204211644.png)

Chúng ta đặt: con trỏ đầu hàng đợi `self.front` trỏ vào vị trí trước phần tử đầu hàng đợi, trong khi con trỏ cuối hàng đợi `self.rear` trỏ vào vị trí của phần tử cuối hàng đợi.

- **Khởi tạo hàng đợi rỗng**: Tạo một nút đầu tiên của danh sách liên kết `self.head`, đặt con trỏ đầu hàng đợi `self.front` và con trỏ cuối hàng đợi `self.rear` đều trỏ vào `head`. Tức là `self.front = self.rear = head`.
- **Kiểm tra hàng đợi có rỗng hay không**: Dựa trên vị trí mà con trỏ đầu hàng đợi `self.front` và con trỏ cuối hàng đợi `self.rear` trỏ đến để kiểm tra. Theo thỏa thuận, nếu con trỏ đầu hàng đợi `self.front` bằng con trỏ cuối hàng đợi `self.rear`, thì hàng đợi rỗng. Ngược lại, hàng đợi không rỗng.
- **Chèn phần tử (thêm vào cuối hàng đợi)**: Tạo một nút liên kết với giá trị `value`, chèn vào cuối danh sách liên kết và di chuyển con trỏ cuối hàng đợi `self.rear` theo danh sách liên kết `1` vị trí đến cuối danh sách liên kết. Lúc này, con trỏ cuối hàng đợi `self.rear` trỏ vào phần tử cuối hàng đợi.
- **Xóa phần tử (xóa phần tử đầu hàng đợi)**: Trước tiên, kiểm tra hàng đợi có rỗng không, nếu rỗng thì ném ra ngoại lệ. Nếu không rỗng, lấy nút liên kết tiếp theo của con trỏ đầu hàng đợi `self.front` và di chuyển con trỏ đầu hàng đợi `self.front` theo danh sách liên kết `1` vị trí. Nếu nút liên kết tiếp theo của con trỏ đầu hàng đợi `self.front` là con trỏ cuối hàng đợi `self.rear`, thì hàng đợi rỗng, lúc này, gán con trỏ cuối hàng đợi `self.rear` bằng con trỏ đầu hàng đợi `self.front`.
- **Lấy phần tử đầu hàng đợi**: Trước tiên, kiểm tra hàng đợi có rỗng không, nếu rỗng thì ném ra ngoại lệ. Nếu không rỗng, vì con trỏ đầu hàng đợi `self.front` trỏ vào vị trí trước phần tử đầu hàng đợi, nên phần tử đầu hàng đợi nằm ở vị trí sau `self.front`, trả về `self.front.next.value`.
- **Lấy phần tử cuối hàng đợi**: Trước tiên, kiểm tra hàng đợi có rỗng không, nếu rỗng thì ném ra ngoại lệ. Nếu không rỗng, vì con trỏ cuối hàng đợi `self.rear` trỏ vào vị trí cuối hàng đợi, nên trả về `self.rear.value`.

#### 2.3.2 Mã cài đặt lưu trữ chuỗi của hàng đợi

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None
        
class Queue:
    # Khởi tạo hàng đợi rỗng
    def __init__(self):
        head = Node(0)
        self.front = head
        self.rear = head
    
    # Kiểm tra hàng đợi có rỗng hay không
    def is_empty(self):
        return self.front == self.rear
    
    # Thêm phần tử vào cuối hàng đợi
    def enqueue(self, value):
        node = Node(value)
        self.rear.next = node
        self.rear = node
    
    # Xóa phần tử đầu hàng đợi
    def dequeue(self):
        if self.is_empty():
            raise Exception('Hàng đợi rỗng')
        else:
            node = self.front.next
            self.front.next = node.next
            if self.rear == node:
                self.rear = self.front
            value = node.value
            del node
            return value
            
    # Lấy phần tử đầu hàng đợi
    def front_value(self):
        if self.is_empty():
            raise Exception('Hàng đợi rỗng')
        else:
            return self.front.next.value
        
    # Lấy phần tử cuối hàng đợi
    def rear_value(self):
        if self.is_empty():
            raise Exception('Hàng đợi rỗng')
        else:
            return self.rear.value
```

## 3. Ứng dụng của hàng đợi

Hàng đợi là một cấu trúc dữ liệu phụ được sử dụng rộng rãi trong các thuật toán và chương trình. Nó có nhiều ứng dụng trong cuộc sống hàng ngày như xếp hàng mua vé, giao dịch ngân hàng và đăng ký dịch vụ.

Ứng dụng của hàng đợi trong lĩnh vực khoa học máy tính chủ yếu được thể hiện ở hai khía cạnh sau:

1. Giải quyết vấn đề không khớp tốc độ giữa máy chủ và thiết bị ngoại vi.
	- Ví dụ: Giải quyết vấn đề không khớp tốc độ giữa máy chủ và máy in. Khi máy chủ gửi dữ liệu đến máy in, tốc độ gửi dữ liệu nhanh hơn tốc độ in, nếu gửi dữ liệu trực tiếp đến máy in sẽ không hiệu quả. Do đó, có thể thiết lập một hàng đợi lưu trữ dữ liệu in, dữ liệu sẽ được ghi vào hàng đợi theo tuần tự và máy in sẽ lấy dữ liệu từ hàng đợi theo nguyên tắc "vào trước ra trước". Điều này đảm bảo việc in dữ liệu đúng và tăng hiệu suất của máy chủ.

2. Giải quyết vấn đề cạnh tranh tài nguyên hệ thống do nhiều người dùng gây ra.
	- Ví dụ: Trong một hệ thống máy tính với nhiều thiết bị đầu cuối, khi nhiều người dùng cần chạy các chương trình riêng của họ, họ sẽ gửi yêu cầu sử dụng CPU tới hệ điều hành thông qua các thiết bị đầu cuối. Hệ điều hành thường sắp xếp các yêu cầu này theo tuần tự thời gian và đưa chúng vào một hàng đợi. Sau đó, CPU sẽ được cấp cho người dùng đầu hàng của hàng đợi để sử dụng. Khi chương trình tương ứng hoàn thành hoặc hết thời gian được cấp, nó sẽ rời khỏi hàng đợi và CPU sẽ được cấp cho người dùng tiếp theo trong hàng đợi. Điều này đảm bảo rằng các yêu cầu của người dùng được đáp ứng và CPU hoạt động một cách bình thường.
	- Ngoài ra, hàng đợi còn được sử dụng trong các ứng dụng như bộ đệm vòng trong Linux, hàng đợi Disruptor có hiệu suất cao, GCD và NSOperationQueue trong iOS đều sử dụng cấu trúc hàng đợi.
