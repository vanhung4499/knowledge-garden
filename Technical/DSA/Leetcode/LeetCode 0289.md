---
title: LeetCode 0289
tags:
  - dsa
  - leetcode
categories:
  - dsa
  - leetcode
date created: 2023-09-24
date modified: 2023-09-24
---

# [0289. Game Of Life](https://leetcode.com/problems/game-of-life/)

- Nhãn: Mảng, Ma trận, Mô phỏng
- Độ khó: Trung bình

## Tóm tắt đề bài

**Mô tả**: Cho một ma trận hai chiều $m \times n$ `board`, mỗi ô trong ma trận đại diện cho một tế bào sống hoặc tế bào chết. Mỗi tế bào có hai trạng thái: sống ($1$) hoặc chết ($0$).

**Yêu cầu**: Áp dụng các quy tắc sau để cập nhật trạng thái của tất cả các tế bào trong ma trận sau mỗi đơn vị thời gian:

- Bất kỳ tế bào sống nào có ít hơn hai tế bào sống xung quanh sẽ chết.
- Bất kỳ tế bào sống nào có hai hoặc ba tế bào sống xung quanh sẽ sống tiếp.
- Bất kỳ tế bào sống nào có nhiều hơn ba tế bào sống xung quanh sẽ chết.
- Bất kỳ tế bào chết nào có chính xác ba tế bào sống xung quanh sẽ sống lại.

**Yêu cầu**: Trả về trạng thái của ma trận sau khi đã cập nhật.

**Giải thích**:

- $m == board.length$.
- $n == board[i].length$.
- $1 \le m, n \le 25$.
- $board[i][j]$ là $0$ hoặc $1$.

**Ví dụ**:

- Ví dụ 1:

```python
Đầu vào: board = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]
Đầu ra: [[0,0,0],[1,0,1],[0,1,1],[0,1,0]]
```

- Ví dụ 2:

```python
Đầu vào: board = [[1,1],[1,0]]
Đầu ra: [[1,1],[1,1]]
```

## Ý tưởng giải quyết

### Ý tưởng 1: Mô phỏng

Vì trạng thái tiếp theo của một ô tế bào phụ thuộc vào trạng thái của các ô xung quanh nó, nên không thể thay đổi trực tiếp trên ma trận ban đầu. Cần tạo một ma trận mới để lưu trữ trạng thái tiếp theo.

- Đầu tiên, duyệt qua từng ô trong ma trận ban đầu.
- Đối với mỗi ô, đếm số lượng ô sống xung quanh nó.
- Dựa vào số lượng ô sống xung quanh, cập nhật trạng thái tiếp theo của ô đó trong ma trận mới.
- Cuối cùng, gán ma trận mới cho ma trận ban đầu.

### Ý tưởng 1: Code

```python
class Solution:
    def gameOfLife(self, board: List[List[int]]) -> None:
        m, n = len(board), len(board[0])
        directions = [(0, 1), (0, -1), (1, 0), (-1, 0), (1, 1), (-1, -1), (1, -1), (-1, 1)]

        def count_live_neighbors(row, col):
            count = 0
            for direction in directions:
                new_row, new_col = row + direction[0], col + direction[1]
                if 0 <= new_row < m and 0 <= new_col < n and abs(board[new_row][new_col]) == 1:
                    count += 1
            return count

        for row in range(m):
            for col in range(n):
                live_neighbors = count_live_neighbors(row, col)
                if board[row][col] == 1 and (live_neighbors < 2 or live_neighbors > 3):
                    board[row][col] = -1
                if board[row][col] == 0 and live_neighbors == 3:
                    board[row][col] = 2

        for row in range(m):
            for col in range(n):
                if board[row][col] == -1:
                    board[row][col] = 0
                elif board[row][col] == 2:
                    board[row][col] = 1
```

### Ý tưởng 1: Độ phức tạp

- Độ phức tạp thời gian: $O(m \times n)$, trong đó $m$ và $n$ lần lượt là số hàng và số cột của ma trận.
- Độ phức tạp không gian: $O(1)$.
