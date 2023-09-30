---
title: LeetCode 0677
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-30
---

# [0677. Map Sum Pairs](https://leetcode.com/problems/map-sum-pairs/)

- Tags: Thiết kế, Cây tiền tố, Bảng băm, Chuỗi
- Độ khó: Trung bình

## Tóm tắt đề bài

**Yêu cầu**: Triển khai lớp MapSum, hỗ trợ hai phương thức `insert` và `sum`:

- `MapSum()` Khởi tạo đối tượng MapSum.
- `void insert(String key, int val)` Chèn cặp khóa `key-val` vào, trong đó chuỗi `key` đại diện cho khóa và số nguyên `val` đại diện cho giá trị. Nếu khóa `key` đã tồn tại, cặp khóa giá trị cũ sẽ bị thay thế bằng cặp khóa giá trị mới.
- `int sum(string prefix)` Trả về tổng giá trị của tất cả các khóa `key` bắt đầu bằng tiền tố `prefix`.

**Giải thích**:

- $1 \le \text{key.length, prefix.length} \le 50$.
- `key` và `prefix` chỉ chứa các ký tự chữ cái thường.
- $1 \le \text{val} \le 1000$.
- Gọi hàm `insert` và `sum` tối đa $50$ lần.

**Ví dụ**:

- Ví dụ 1:

```python
Input:
["MapSum", "insert", "sum", "insert", "sum"]
[[], ["apple", 3], ["ap"], ["app", 2], ["ap"]]
Output:
[null, null, 3, null, 5]

Giải thích:
MapSum mapSum = new MapSum();
mapSum.insert("apple", 3);  
mapSum.sum("ap");           // Trả về 3 (apple = 3)
mapSum.insert("app", 2);    
mapSum.sum("ap");           // Trả về 5 (apple + app = 3 + 2 = 5)
```

## Ý tưởng giải quyết

### Ý tưởng 1: Cây tiền tố (Trie)

Chúng ta có thể xây dựng một cây tiền tố (Trie) để giải quyết bài toán.

- Trong quá trình khởi tạo, chúng ta xây dựng một cây tiền tố (Trie) và thêm biến `value`.
- Khi gọi phương thức chèn, chúng ta lưu trữ `key` trong cây tiền tố và lưu trữ `value` tương ứng trong nút chữ cái tương ứng.
- Khi gọi phương thức tính tổng, chúng ta trước tiên tìm kiếm nút cây tiền tố tương ứng với tiền tố `prefix`, bắt đầu từ nút đó, chúng ta duyệt qua các nút con và tính tổng các `value` của các nút con, sau đó trả về tổng tích lũy.

### Ý tưởng 1: Đoạn mã

```python
class Node:
    def __init__(self):
        self.children = {}
        self.isEnd = False
        self.value = 0

class Trie:
    def __init__(self):
        self.root = Node()

    def insert(self, key, val):
        cur = self.root
        for ch in key:
            if ch not in cur.children:
                cur.children[ch] = Node()
            cur = cur.children[ch]
        cur.isEnd = True
        cur.value = val

    def search(self, prefix):
        cur = self.root
        for ch in prefix:
            if ch not in cur.children:
                return 0
            cur = cur.children[ch]
        return self.dfs(cur)

    def dfs(self, root):
        if not root:
            return 0
        res = root.value
        for node in root.children.values():
            res += self.dfs(node)
        return res


class MapSum:

    def __init__(self):
        self.trie = Trie()

    def insert(self, key: str, val: int) -> None:
        self.trie.insert(key, val)

    def sum(self, prefix: str) -> int:
        return self.trie.search(prefix)

```

### Ý tưởng 1: Độ phức tạp

- **Độ phức tạp thời gian**: Phương thức `insert` có độ phức tạp thời gian là $O(|key|)$, trong đó $|key|$ là độ dài của chuỗi `key`. Phương thức `sum` có độ phức tạp thời gian là $O(|prefix|)$, trong đó $|prefix|$ là độ dài của chuỗi `prefix`.
- **Độ phức tạp không gian**: $O(|T| \times m)$. Trong đó $|T|$ là độ dài lớn nhất của chuỗi `key`, $m$ là số lượng cặp khóa-giá trị `key-val`.
