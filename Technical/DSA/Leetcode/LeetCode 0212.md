---
title: LeetCode 0212
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-30
---

# [0212. Word Search II](https://leetcode.com/problems/word-search-ii/)

- Nhãn: Cây Trie, Mảng, Chuỗi, Quay lui, Ma trận
- Độ khó: Khó

## Ý tưởng giải quyết

- Đầu tiên, chúng ta sẽ lưu tất cả các từ trong danh sách từ `words` vào cây Trie.
- Sau đó, chúng ta sẽ duyệt qua từng ký tự `board[i][j]` trong ma trận ký tự `board`.
- Từ mỗi ô hiện tại, chúng ta sẽ thực hiện tìm kiếm theo chiều sâu từ các hướng trên, dưới, trái, phải. Mỗi khi đi qua một ô, chúng ta sẽ thay đổi ký tự của ô đó thành một ký tự đặc biệt để tránh việc duyệt qua lại, sau khi tìm kiếm theo chiều sâu hoàn tất, chúng ta sẽ phục hồi ký tự của ô đó.
  - Nếu đường đi hiện tại chính xác là một từ trong danh sách `words`, chúng ta sẽ thêm từ đó vào mảng kết quả.
  - Nếu đường đi hiện tại là tiền tố của một từ trong danh sách `words`, chúng ta sẽ tiếp tục tìm kiếm.
  - Nếu không phải là tiền tố của từ trong danh sách `words`, chúng ta sẽ dừng tìm kiếm.
- Cuối cùng, chúng ta sẽ trả về mảng kết quả.

## Code

```python
class Trie:

    def __init__(self):
        """
        Khởi tạo cấu trúc dữ liệu Trie.
        """
        self.children = dict()
        self.isEnd = False
        self.word = ""


    def insert(self, word: str) -> None:
        """
        Chèn một từ vào cây Trie.
        """
        cur = self
        for ch in word:
            if ch not in cur.children:
                cur.children[ch] = Trie()
            cur = cur.children[ch]
        cur.isEnd = True
        cur.word = word


    def search(self, word: str) -> bool:
        """
        Trả về True nếu từ có trong cây Trie, ngược lại trả về False.
        """
        cur = self
        for ch in word:
            if ch not in cur.children:
                return False
            cur = cur.children[ch]

        return cur is not None and cur.isEnd

class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        trie_tree = Trie()
        for word in words:
            trie_tree.insert(word)

        directs = [(0, 1), (0, -1), (1, 0), (-1, 0)]
        rows = len(board)
        cols = len(board[0])

        def dfs(cur, row, col):
            ch = board[row][col]
            if ch not in cur.children:
                return

            cur = cur.children[ch]
            if cur.isEnd:
                ans.add(cur.word)

            board[row][col] = "#"
            for direct in directs:
                new_row = row + direct[0]
                new_col = col + direct[1]
                if 0 <= new_row < rows and 0 <= new_col < cols:
                    dfs(cur, new_row, new_col)
            board[row][col] = ch

        ans = set()
        for i in range(rows):
            for j in range(cols):
                dfs(trie_tree, i, j)

        return list(ans)
```
