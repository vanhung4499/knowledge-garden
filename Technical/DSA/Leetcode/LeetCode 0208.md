---
title: LeetCode 0208
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-30
---

# [0208. Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/)

- Thẻ: Thiết kế, Cây tiền tố, Bảng băm, Chuỗi
- Độ khó: Trung bình

## Tóm tắt đề bài

**Yêu cầu**: Triển khai lớp `Trie` để tạo cây tiền tố.

Lớp `Trie`:

- `Trie()` Khởi tạo đối tượng cây tiền tố.
- `void insert(String word)` Chèn chuỗi `word` vào cây tiền tố.
- `boolean search(String word)` Trả về `True` nếu chuỗi `word` có trong cây tiền tố (nghĩa là đã chèn trước đó); ngược lại trả về `False`.
- `boolean startsWith(String prefix)` Trả về `True` nếu một trong các tiền tố của chuỗi `word` đã chèn trước đó là `prefix`; ngược lại trả về `False`.

**Giải thích**:

- $1 \le \text{word.length, prefix.length} \le 2000$.
- `word` và `prefix` chỉ chứa các ký tự chữ cái thường.
- Số lần gọi `insert`, `search` và `startsWith` không vượt quá tổng cộng $3 * 10^4$ lần.

**Ví dụ**:

- Ví dụ 1:

```python
Input:
["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
Output:
[null, null, true, false, true, null, true]

Giải thích:
Trie trie = new Trie();
trie.insert("apple");
trie.search("apple");   // Trả về True
trie.search("app");     // Trả về False
trie.startsWith("app"); // Trả về True
trie.insert("app");
trie.search("app");     // Trả về True
```

## Ý tưởng giải quyết

### Ý tưởng 1: Cây tiền tố (Trie)

Cây tiền tố (Trie) là một cây nhiều nhánh, trong đó mỗi nút chứa một mảng con trỏ `children` trỏ đến các nút con và một biến boolean `isEnd`. `children` được sử dụng để lưu trữ các nút con tương ứng với các ký tự hiện tại, thường có độ dài bằng số lượng ký tự khác nhau, hoặc có thể sử dụng bảng băm thay thế cho mảng con trỏ. `isEnd` được sử dụng để xác định xem nút hiện tại có phải là kết thúc của một chuỗi hay không.

Dưới đây là các bước cụ thể để chèn và tìm kiếm tiền tố:

**Chèn chuỗi**:

- Bắt đầu từ nút gốc, chèn chuỗi vào cây tiền tố. Đối với ký tự cần chèn, có hai trường hợp xảy ra:
  - Nếu nút tương ứng với ký tự đã tồn tại, di chuyển đến nút con và tiếp tục xử lý ký tự tiếp theo.
  - Nếu nút tương ứng với ký tự không tồn tại, tạo một nút mới, lưu trữ nút mới đó trong `children` tại vị trí tương ứng, sau đó di chuyển đến nút con và tiếp tục xử lý ký tự tiếp theo.
- Lặp lại các bước trên cho đến khi xử lý xong ký tự cuối cùng, sau đó đánh dấu nút hiện tại là kết thúc của chuỗi.

**Tìm kiếm tiền tố**:

- Bắt đầu từ nút gốc, tìm kiếm tiền tố trong cây. Đối với ký tự cần tìm kiếm, có hai trường hợp xảy ra:
  - Nếu nút tương ứng với ký tự tồn tại, di chuyển đến nút con và tiếp tục tìm kiếm ký tự tiếp theo.
  - Nếu nút tương ứng với ký tự không tồn tại, có nghĩa là cây tiền tố không chứa tiền tố đó, trả về giá trị `False`.
- Lặp lại các bước trên cho đến khi tìm kiếm xong ký tự cuối cùng, nếu nút hiện tại khác `None` và là kết thúc của một chuỗi, thì cây tiền tố chứa tiền tố đó.

### Ý tưởng 1: Code

```python
class Node:
    def __init__(self):
        self.children = dict()
        self.isEnd = False

class Trie:

    def __init__(self):
        self.root = Node()

    def insert(self, word: str) -> None:
        cur = self.root
        for ch in word:
            if ch not in cur.children:
                cur.children[ch] = Node()
            cur = cur.children[ch]
        cur.isEnd = True 

    def search(self, word: str) -> bool:
        cur = self.root
        for ch in word:
            if ch not in cur.children:
                return False
            cur = cur.children[ch]

        return cur is not None and cur.isEnd

    def startsWith(self, prefix: str) -> bool:
        cur = self.root
        for ch in prefix:
            if ch not in cur.children:
                return False
            cur = cur.children[ch]
        return cur is not None
```

### Ý tưởng 1: Độ phức tạp

- **Độ phức tạp thời gian**: Khởi tạo là $O(1)$. Thời gian chèn và tìm kiếm là $O(|S|)$. Trong đó $|S|$ là độ dài của chuỗi được chèn hoặc tìm kiếm.
- **Độ phức tạp không gian**: $O(|T| \times \sum)$. Trong đó $|T|$ là tổng độ dài của các chuỗi được chèn và $\sum$ là kích thước của bộ ký tự.
