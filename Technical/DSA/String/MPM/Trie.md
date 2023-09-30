---
title: Trie
tags:
  - dsa
  - data-structure
categories:
  - dsa
  - data-structure
date created: 2023-09-30
date modified: 2023-09-30
---

# 1. Giới thiệu về Trie

> **Trie** (còn được gọi là cây tiền tố, cây tìm kiếm từ) là một cấu trúc dữ liệu dạng cây. Như tên gọi, nó là một cây giống như một từ điển. Nó là một cách lưu trữ từ điển. Mỗi từ trong từ điển được biểu diễn trong Trie dưới dạng một đường dẫn từ nút gốc, các cạnh trên đường dẫn kết nối các chữ cái lại với nhau để tạo thành chuỗi tương ứng.

Ví dụ dưới đây là một cây Trie, bao gồm 7 từ: `a`, `abc`, `acb`, `acc`, `ach`, `b`, `chb`.

![20220210142323.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20220210142323.png)

Từ hình vẽ, chúng ta có thể thấy rằng cây Trie sử dụng các cạnh để biểu diễn các chữ cái, đường dẫn từ nút gốc đến một nút cụ thể đại diện cho một từ. Ví dụ, 1 → 2 → 6 → 10 biểu diễn từ `acc`. Để đánh dấu từ một cách rõ ràng, chúng ta có thể thêm một đánh dấu `end` (nút màu đỏ trong hình) tại vị trí nút kết thúc của mỗi từ, đại diện cho một từ từ nút gốc đến đó.

Cấu trúc của Trie khá đơn giản, bản chất của nó là một cây nhiều nhánh được sử dụng để tìm kiếm chuỗi nhanh chóng, mỗi nút trên cây chứa con trỏ đến nhiều ký tự. Kết hợp các ký tự đi qua từ nút gốc đến một nút cụ thể sẽ tạo thành chuỗi tương ứng với nút đó.

**Ý tưởng cốt lõi của Trie**: Sử dụng không gian để trao đổi thời gian, sử dụng tiền tố chung của chuỗi để giảm thiểu thời gian tìm kiếm, giảm thiểu so sánh chuỗi không cần thiết, nhằm tăng hiệu suất.

Dưới đây, chúng ta sẽ tóm tắt **các thuộc tính cơ bản của Trie**:

- Nút gốc không chứa ký tự, ngoại trừ nút gốc, mỗi nút chỉ chứa một ký tự.
- Đường dẫn từ nút gốc đến một nút cụ thể sẽ tạo thành chuỗi tương ứng với nút đó.
- Tất cả các nút con của một nút không chứa các chuỗi giống nhau.

## 2. Các thao tác cơ bản trên Trie

Các thao tác cơ bản trên Trie bao gồm **tạo Trie**, **chèn**, **tìm kiếm** và **xóa**. Trong đó, thao tác xóa là thao tác ít được sử dụng nhất, chúng ta sẽ tập trung vào việc tạo Trie, chèn và tìm kiếm.

### 2.1 Cấu trúc của Trie

#### 2.1.1 Cấu trúc nút Trie

Trước tiên, chúng ta sẽ định nghĩa cấu trúc nút Trie.

Như đã đề cập, Trie là một cây nhiều nhánh, và cách triển khai "nhiều nhánh" có thể sử dụng mảng hoặc bảng băm. Tiếp theo, chúng ta sẽ giới thiệu hai cấu trúc nút Trie này.

- Nếu tập ký tự trong chuỗi chỉ chứa các chữ cái tiếng Anh thường, chúng ta có thể sử dụng một mảng có độ dài 26 để biểu diễn nhiều nút con của nút hiện tại, như trong đoạn mã dưới đây.

```python
class Node:                                         # Cấu trúc nút Trie
    def __init__(self):                             # Khởi tạo nút Trie
        self.children = [None for _ in range(26)]    # Khởi tạo các nút con
        self.isEnd = False                          # isEnd được sử dụng để đánh dấu từ kết thúc
```

Trong đoạn mã trên, `self.children` được triển khai bằng mảng, đại diện cho tất cả các nút con của nút hiện tại. `isEnd` được sử dụng để đánh dấu xem từ đã kết thúc hay chưa.

Khi chèn một từ vào Trie, chúng ta cần chuyển đổi các ký tự trong từ thành số và tạo nút ký tự tương ứng, sau đó chèn nút đó vào mảng có độ dài 26.

- Nếu tập ký tự trong chuỗi không chỉ chứa chữ cái thường, mà còn chứa cả chữ cái hoa và các ký tự khác, chúng ta có thể sử dụng bảng băm để biểu diễn nhiều nút con của nút hiện tại, như trong đoạn mã dưới đây.

```python
class Node:                                     # Cấu trúc nút Trie
    def __init__(self):                         # Khởi tạo nút Trie
        self.children = dict()                  # Khởi tạo các nút con
        self.isEnd = False                      # isEnd được sử dụng để đánh dấu từ kết thúc
```

Trong đoạn mã trên, `self.children` được triển khai bằng bảng băm, đại diện cho tất cả các nút con của nút hiện tại. `isEnd` được sử dụng để đánh dấu xem từ đã kết thúc hay chưa. Khi chèn một từ vào Trie, chúng ta chỉ cần tạo nút ký tự tương ứng với các ký tự trong từ và chèn nút đó vào bảng băm tương ứng.

Dưới đây, để thống nhất mã và viết dễ dàng, tất cả mã trong bài viết này sẽ sử dụng bảng băm để biểu diễn nhiều nút con của nút hiện tại.

#### 2.1.2 Cấu trúc cơ bản của Trie

Sau khi định nghĩa cấu trúc nút Trie, chúng ta sẽ định nghĩa cấu trúc cơ bản của Trie. Trong quá trình khởi tạo Trie, chúng ta định nghĩa một nút gốc và nút gốc này không lưu trữ ký tự. Trong các thao tác chèn và tìm kiếm, chúng ta sẽ bắt đầu từ nút gốc của Trie. Đoạn mã dưới đây mô tả cấu trúc cơ bản của Trie.

```python
class Trie:                                     # Trie

    # Khởi tạo Trie
    def __init__(self):                         # Khởi tạo Trie
        self.root = Node()                      # Khởi tạo nút gốc (nút gốc không lưu trữ ký tự)
```

### 2.2 Tạo và chèn vào Trie

Tạo Trie đề cập đến việc chèn tất cả các từ trong mảng chuỗi vào Trie. Trong khi chèn đề cập đến việc chèn một từ vào Trie.

#### 2.2.1 Thao tác chèn vào Trie

Trước khi giải thích về việc tạo Trie, chúng ta hãy xem cách chèn một từ vào Trie. Các bước cụ thể như sau:

- Lặp qua từng ký tự `ch` trong từ và bắt đầu chèn từ nút con của nút gốc của Trie (nút gốc không chứa ký tự).
- Nếu không tồn tại nút con với khóa `ch` trong nút hiện tại, tạo một nút mới và lưu trữ nó trong nút con của nút hiện tại, tức là `cur.children[ch] = Node()`, sau đó cho nút hiện tại trỏ đến nút mới và tiếp tục xử lý ký tự tiếp theo.
- Nếu tồn tại nút con với khóa `ch` trong nút hiện tại, chỉ định nút hiện tại trỏ đến nút với khóa `ch` và tiếp tục xử lý ký tự tiếp theo.
- Khi hoàn thành xử lý từ, đánh dấu nút hiện tại là kết thúc của từ.

```python
# Chèn một từ vào Trie
def insert(self, word: str) -> None:
    cur = self.root
    for ch in word:                         # Lặp qua từng ký tự trong từ
        if ch not in cur.children:          # Nếu không tồn tại nút con với khóa ch
            cur.children[ch] = Node()       # Tạo một nút mới và lưu trữ trong nút con của nút hiện tại
        cur = cur.children[ch]              # Cho nút hiện tại trỏ đến nút mới và tiếp tục xử lý ký tự tiếp theo
    cur.isEnd = True                        # Đánh dấu nút hiện tại là kết thúc của từ
```

#### 2.2.2 Tạo Trie

Việc tạo Trie khá đơn giản, các bước cụ thể như sau:

- Khởi tạo một Trie, tức là `trie = Trie()`.
- Lặp qua tất cả các từ trong mảng chuỗi và chèn chúng vào Trie.

```python
trie = Trie()
for word in words:
    trie.insert(word)
```

### 2.3 Thao tác tìm kiếm trên Trie

#### 2.3.1 Tìm kiếm từ trong Trie

Việc tìm kiếm một từ trong Trie thực ra tương tự như thao tác chèn vào Trie. Các bước cụ thể như sau:

- Lặp qua từng ký tự trong từ và bắt đầu tìm kiếm từ nút gốc của Trie.
- Nếu không tồn tại nút con với khóa `ch` trong nút hiện tại, có nghĩa là từ không tồn tại, trả về `False`.
- Nếu tồn tại nút con với khóa `ch` trong nút hiện tại, chỉ định nút hiện tại trỏ đến nút với khóa `ch` và tiếp tục tìm kiếm ký tự tiếp theo.
- Khi hoàn thành xử lý từ, kiểm tra xem nút hiện tại có đánh dấu kết thúc từ hay không. Nếu có, có nghĩa là từ đó tồn tại trong Trie, trả về `True`. Ngược lại, có nghĩa là từ không tồn tại trong Trie, trả về `False`.

```python
# Tìm kiếm một từ trong Trie
def search(self, word: str) -> bool:
    cur = self.root
    for ch in word:                         # Lặp qua từng ký tự trong từ
        if ch not in cur.children:          # Nếu không tồn tại nút con với khóa ch
            return False                    # Trả về False
        cur = cur.children[ch]              # Chỉ định nút hiện tại trỏ đến nút với khóa ch và tiếp tục tìm kiếm ký tự tiếp theo

    return cur is not None and cur.isEnd    # Kiểm tra xem nút hiện tại có đánh dấu kết thúc từ hay không
```

#### 2.3.2 Tìm kiếm tiền tố trong Trie

Việc tìm kiếm một tiền tố trong Trie tương tự như thao tác tìm kiếm từ trong Trie, khác biệt là không cần kiểm tra xem nút hiện tại có đánh dấu kết thúc từ hay không.

```python
# Tìm kiếm một tiền tố trong Trie
def startsWith(self, prefix: str) -> bool:
    cur = self.root
    for ch in prefix:                       # Lặp qua từng ký tự trong tiền tố
        if ch not in cur.children:          # Nếu không tồn tại nút con với khóa ch
            return False                    # Trả về False
        cur = cur.children[ch]              # Chỉ định nút hiện tại trỏ đến nút với khóa ch và tiếp tục tìm kiếm ký tự tiếp theo
    return cur is not None                  # Kiểm tra xem nút hiện tại có tồn tại hay không
```

## 3. Mã nguồn triển khai Trie

```python
class Node:                                     # Node của Trie
    def __init__(self):                         # Khởi tạo Node
        self.children = dict()                  # Khởi tạo các Node con
        self.isEnd = False                      # isEnd được sử dụng để đánh dấu kết thúc từ
        
        
class Trie:                                     # Trie
    
    # Khởi tạo Trie
    def __init__(self):                         # Khởi tạo Trie
        self.root = Node()                      # Khởi tạo Node gốc (Node gốc không lưu trữ ký tự)

    # Chèn một từ vào Trie
    def insert(self, word: str) -> None:
        cur = self.root
        for ch in word:                         # Lặp qua từng ký tự trong từ
            if ch not in cur.children:          # Nếu không tồn tại Node con với khóa ch
                cur.children[ch] = Node()       # Tạo một Node mới và lưu trữ trong Node con của Node hiện tại
            cur = cur.children[ch]              # Cho Node hiện tại trỏ đến Node mới và tiếp tục xử lý ký tự tiếp theo
        cur.isEnd = True                        # Đánh dấu Node hiện tại là kết thúc của từ

    # Tìm kiếm một từ trong Trie
    def search(self, word: str) -> bool:
        cur = self.root
        for ch in word:                         # Lặp qua từng ký tự trong từ
            if ch not in cur.children:          # Nếu không tồn tại Node con với khóa ch
                return False                    # Trả về False
            cur = cur.children[ch]              # Chỉ định Node hiện tại trỏ đến Node với khóa ch và tiếp tục tìm kiếm ký tự tiếp theo

        return cur is not None and cur.isEnd    # Kiểm tra xem Node hiện tại có đánh dấu kết thúc từ hay không

    # Tìm kiếm một tiền tố trong Trie
    def startsWith(self, prefix: str) -> bool:
        cur = self.root
        for ch in prefix:                       # Lặp qua từng ký tự trong tiền tố
            if ch not in cur.children:          # Nếu không tồn tại Node con với khóa ch
                return False                    # Trả về False
            cur = cur.children[ch]              # Chỉ định Node hiện tại trỏ đến Node với khóa ch và tiếp tục tìm kiếm ký tự tiếp theo
        return cur is not None                  # Kiểm tra xem Node hiện tại có tồn tại hay không
```

## 4. Phân tích thuật toán của Trie

Giả sử độ dài của từ là `n`, độ dài của tiền tố là `m`, số ký tự trong tập hợp ký tự là `d`, thì:

- **Chèn một từ**: Độ phức tạp thời gian là $O(n)$; nếu sử dụng mảng, độ phức tạp không gian là $O(d^n)$, nếu sử dụng bảng băm, độ phức tạp không gian là $O(n)$.
- **Tìm kiếm một từ**: Độ phức tạp thời gian là $O(n)$; độ phức tạp không gian là $O(1)$.
- **Tìm kiếm một tiền tố**: Độ phức tạp thời gian là $O(m)$; độ phức tạp không gian là $O(1)$.

## 5. Ứng dụng của Trie

Một ứng dụng điển hình của Trie là trong các công cụ tìm kiếm. Khi nhập một phần nội dung vào công cụ tìm kiếm, công cụ sẽ tự động hiển thị một số nội dung tìm kiếm liên quan. Chúng ta có thể chọn nội dung tìm kiếm mà chúng ta muốn mà không cần nhập toàn bộ nội dung. Chức năng này giúp tiết kiệm thời gian tìm kiếm.

Ví dụ, khi chúng ta nhập "Trie" vào công cụ tìm kiếm, các nội dung tìm kiếm liên quan với tiền tố "Trie" sẽ được hiển thị dưới.

Cơ chế cơ bản để thực hiện chức năng này là Trie. Tất nhiên, các công cụ tìm kiếm như Google, Bing, … đã thực hiện nhiều cải tiến và tối ưu hóa phía sau chức năng này, nhưng cơ sở cơ bản nhất của nó vẫn là cấu trúc dữ liệu "Trie".

Ngoài ra, chúng ta có thể chia ứng dụng của Trie thành các loại sau:

- **Tìm kiếm chuỗi**: Lưu trữ thông tin liên quan về một số chuỗi đã biết (từ điển) trong Trie và tìm kiếm xem một số chuỗi có xuất hiện, tần suất xuất hiện hay không.
- **Thống kê tiền tố**: Thống kê số lượng từ tiền tố của một chuỗi, chỉ cần thống kê số lượng từ xuất hiện trên đường đi từ nút gốc đến nút lá, cũng có thể xác định xem một từ có phải là tiền tố của một từ khác hay không.
- **Vấn đề tiền tố chung dài nhất**: Sử dụng Trie để giải quyết vấn đề tiền tố chung dài nhất của nhiều chuỗi. Khi lưu trữ nhiều chuỗi trên một Trie, độ dài của tiền tố chung dài nhất của hai chuỗi chính là độ dài của nút tổ tiên chung gần nhất của chúng, do đó chuyển thành vấn đề tổ tiên chung gần nhất.
- **Sắp xếp chuỗi**: Sắp xếp chuỗi bằng cách sử dụng Trie. Ví dụ, cho nhiều tên duy nhất chỉ bao gồm một từ, sắp xếp chúng theo thứ tự từ điển từ nhỏ đến lớn. Sử dụng mảng để tạo Trie, tất cả các nút con của nút Trie đều được sắp xếp theo thứ tự chữ cái. Sau đó, duyệt Trie theo thứ tự tiền tự, chuỗi tương ứng sẽ là kết quả được sắp xếp theo thứ tự từ điển.
