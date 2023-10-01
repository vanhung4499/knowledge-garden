---
tags:
  - algorithm
  - dsa
categories:
  - algorithm
  - dsa
title: DFS
date created: 2023-05-29
date modified: 2023-10-01
---

## 1. Giới thiệu về thuật toán tìm kiếm theo chiều sâu

> **Thuật toán tìm kiếm theo chiều sâu (Depth First Search)**: viết tắt là DFS, là một thuật toán được sử dụng để tìm kiếm trong cây hoặc đồ thị. Thuật toán tìm kiếm theo chiều sâu áp dụng ý tưởng quay lui, bắt đầu từ nút khởi đầu, đi sâu vào một đường đi càng xa càng tốt cho đến khi không thể tiếp tục, sau đó quay lại nút chưa được thăm trước đó, tiếp tục tìm kiếm sâu hơn cho đến khi hoàn thành quá trình tìm kiếm.

Trong thuật toán tìm kiếm theo chiều sâu, việc đi sâu có nghĩa là ưu tiên đi sâu vào một đường đi càng xa càng tốt cho đến khi không thể tiếp tục sâu hơn.

Trong quá trình duyệt theo chiều sâu, chúng ta cần lưu trữ tạm thời các nút kề của nút hiện tại u, để có thể tiếp tục truy cập chúng khi quay lại. Thứ tự các nút được duyệt theo đúng theo nguyên tắc "vào sau ra trước", đây chính là nguyên tắc mà "đệ quy" và "ngăn xếp" tuân theo, do đó thuật toán tìm kiếm theo chiều sâu có thể được thực hiện thông qua "đệ quy" hoặc "ngăn xếp".

## 2. Các bước của thuật toán tìm kiếm theo chiều sâu

Tiếp theo, chúng ta sẽ lấy một đồ thị vô hướng làm ví dụ để giới thiệu các bước của thuật toán tìm kiếm theo chiều sâu.

1. Chọn nút khởi đầu u và đánh dấu nó là đã được thăm.
2. Kiểm tra xem nút hiện tại có phải là nút mục tiêu hay không (tuỳ thuộc vào yêu cầu cụ thể của bài toán).
3. Nếu nút hiện tại u là nút mục tiêu, trả về kết quả.
4. Nếu nút hiện tại u không phải là nút mục tiêu, duyệt qua tất cả các nút kề chưa được thăm của nút hiện tại u.
5. Đối với mỗi nút kề chưa được thăm v, tiếp tục tìm kiếm theo chiều sâu từ nút v (đệ quy).
6. Nếu nút u không có nút kề chưa được thăm, quay lại nút trước đó và tiếp tục tìm kiếm các đường đi khác.
7. Lặp lại các bước 2-6 cho đến khi duyệt qua toàn bộ đồ thị hoặc tìm thấy nút mục tiêu.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20231001152015.png)

## 3. Tìm kiếm theo chiều sâu dựa trên đệ quy

### 3.1 Các bước của thuật toán tìm kiếm theo chiều sâu dựa trên đệ quy

Thuật toán tìm kiếm theo chiều sâu có thể được thực hiện thông qua đệ quy. Dưới đây là các bước của thuật toán tìm kiếm theo chiều sâu dựa trên đệ quy:

1. Định nghĩa biến $graph$ để lưu trữ đồ thị vô hướng dưới dạng mảng lồng nhau, $visited$ là tập hợp các nút đã được đánh dấu. $u$ là nút bắt đầu duyệt cạnh hiện tại. Định nghĩa `def dfs_recursive(graph, u, visited):` là phương thức tìm kiếm theo chiều sâu dựa trên đệ quy.
2. Chọn nút bắt đầu $u$ và đánh dấu nó là đã được thăm bằng cách thêm nút $u$ vào $visited$ (`visited.add(u)`).
3. Kiểm tra xem nút hiện tại $u$ có phải là nút mục tiêu hay không (tuỳ thuộc vào yêu cầu cụ thể của bài toán).
4. Nếu nút hiện tại $u$ là nút mục tiêu, trả về kết quả.
5. Nếu nút hiện tại $u$ không phải là nút mục tiêu, duyệt qua tất cả các nút kề chưa được thăm của nút hiện tại $u$.
6. Đối với mỗi nút kề chưa được thăm $v$, tiếp tục tìm kiếm theo chiều sâu từ nút $v$ (đệ quy), tức là gọi `dfs_recursive(graph, v, visited)`.
7. Nếu nút $u$ không có nút kề chưa được thăm, quay lại nút trước đó và tiếp tục tìm kiếm các đường đi khác.
8. Lặp lại các bước 3-7 cho đến khi duyệt qua toàn bộ đồ thị hoặc tìm thấy nút mục tiêu.

### 3.2 Mã nguồn thực hiện tìm kiếm theo chiều sâu dựa trên đệ quy

```python
class Solution:
    def dfs_recursive(self, graph, u, visited):
        print(u)                        # Truy cập nút
        visited.add(u)                  # Đánh dấu nút u đã được truy cập

        for v in graph[u]:
            if v not in visited:        # Nếu nút v chưa được truy cập
                # Tiếp tục tìm kiếm theo chiều sâu
                self.dfs_recursive(graph, v, visited)
        

graph = {
    "A": ["B", "C"],
    "B": ["A", "C", "D"],
    "C": ["A", "B", "D", "E"],
    "D": ["B", "C", "E", "F"],
    "E": ["C", "D"],
    "F": ["D", "G"],
    "G": []
}

# Tìm kiếm theo chiều sâu dựa trên đệ quy
visited = set()
Solution().dfs_recursive(graph, "A", visited)
```

## 4. Tìm kiếm theo chiều sâu dựa trên ngăn xếp

### 4.1 Các bước của thuật toán tìm kiếm theo chiều sâu dựa trên ngăn xếp

Thuật toán tìm kiếm theo chiều sâu có thể được thực hiện dựa trên ngăn xếp. Đồng thời, để tránh việc duyệt lại các nút, khi lưu trữ các bản ghi truy cập nút trong ngăn xếp, chúng ta sẽ lưu trữ "nút hiện tại" và "chỉ số của nút kề tiếp theo sẽ được truy cập" cùng một lúc. Điều này cho phép chúng ta có thể truy cập trực tiếp đến nút kề tiếp theo thông qua chỉ số mà không cần duyệt qua tất cả các nút kề.

Dưới đây là các bước của thuật toán tìm kiếm theo chiều sâu dựa trên ngăn xếp:

1. Định nghĩa biến $graph$ để lưu trữ đồ thị vô hướng dưới dạng mảng lồng nhau, $visited$ là tập hợp các nút đã được đánh dấu. $start$ là nút bắt đầu duyệt.
2. Chọn nút bắt đầu $u$, kiểm tra xem nút hiện tại $u$ có phải là nút mục tiêu hay không (tuỳ thuộc vào yêu cầu cụ thể của bài toán).
3. Nếu nút hiện tại $u$ là nút mục tiêu, trả về kết quả.
4. Nếu nút hiện tại $u$ không phải là nút mục tiêu, đặt nút $u$ và chỉ số của nút kề tiếp theo sẽ được truy cập là 0 vào ngăn xếp và đánh dấu nút $u$ là đã được truy cập (`stack.append([u, 0])`, `visited.add(u)`).
5. Nếu ngăn xếp không rỗng, lấy phần tử trên cùng của ngăn xếp là nút $u$ và chỉ số của nút kề tiếp theo sẽ được truy cập là $i$.
6. Dựa vào nút $u$ và chỉ số $i$, lấy ra nút kề chưa được truy cập tiếp theo $v$.
7. Đặt nút $u$ và chỉ số của nút kề tiếp theo sẽ được truy cập là $i + 1$ vào ngăn xếp.
8. Truy cập nút $v$ và thực hiện các thao tác liên quan đến nút (tuỳ thuộc vào yêu cầu cụ thể của bài toán).
9. Đặt nút $v$ và chỉ số của nút kề tiếp theo sẽ được truy cập là 0 vào ngăn xếp và đánh dấu nút $v$ là đã được truy cập (`stack.append([v, 0])`, `visited.add(v)`).
10. Lặp lại các bước 5-9 cho đến khi ngăn xếp trống hoặc tìm thấy nút mục tiêu.

### 4.2 Mã nguồn thực hiện tìm kiếm theo chiều sâu dựa trên ngăn xếp

```python
class Solution:
    def dfs_stack(self, graph, u):
        print(u)                            # Truy cập nút u
        visited, stack = set(), []          # Sử dụng visited để đánh dấu các nút đã được truy cập, sử dụng ngăn xếp stack để lưu trữ các nút tạm thời
        
        stack.append([u, 0])                # Đặt nút u và chỉ số của nút kề tiếp theo sẽ được truy cập là 0 vào ngăn xếp
        visited.add(u)                      # Đánh dấu nút u là đã được truy cập
        
        while stack:
            u, i = stack.pop()              # Lấy phần tử trên cùng của ngăn xếp là nút u và chỉ số của nút kề tiếp theo sẽ được truy cập là i
            
            if i < len(graph[u]):
                v = graph[u][i]             # Lấy ra nút kề chưa được truy cập tiếp theo v
                stack.append([u, i + 1])    # Đặt nút u và chỉ số của nút kề tiếp theo sẽ được truy cập là i + 1 vào ngăn xếp
                if v not in visited:        # Nếu nút v chưa được truy cập
                    print(v)                # Truy cập nút v
                    stack.append([v, 0])    # Đặt nút v và chỉ số của nút kề tiếp theo sẽ được truy cập là 0 vào ngăn xếp
                    visited.add(v)          # Đánh dấu nút v là đã được truy cập                
        

graph = {
    "A": ["B", "C"],
    "B": ["A", "C", "D"],
    "C": ["A", "B", "D", "E"],
    "D": ["B", "C", "E", "F"],
    "E": ["C", "D"],
    "F": ["D", "G"],
    "G": []
}

# Tìm kiếm theo chiều sâu dựa trên ngăn xếp
Solution().dfs_stack(graph, "A")
```

## 5. Ứng dụng của tìm kiếm theo chiều sâu

### 5.1 Số lượng đảo

#### 5.1.1 Đường dẫn đến bài toán

- [200. Number of Islands](https://leetcode.com/problems/number-of-islands/)

#### 5.1.2 Đề bài

**Mô tả**: Cho một lưới hai chiều `grid` được tạo bởi các ký tự `'1'` (đất) và `'0'` (nước).

**Yêu cầu**: Hãy tính số lượng đảo trong lưới.

**Giải thích**:

- Đảo luôn bị bao quanh bởi nước và mỗi đảo chỉ có thể được tạo thành từ các đất kề nhau theo hướng ngang và/hoặc dọc.
- Ngoài ra, bạn có thể giả định rằng cả bốn cạnh của lưới đều bị bao quanh bởi nước.
- $m$ là số hàng của lưới.
- $n$ là số cột của lưới.
- $1 \le m, n \le 300$.
- Giá trị của `grid[i][j]` là `'0'` hoặc `'1'`.

**Ví dụ**:

- Ví dụ 1:

```python
Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1
```

- Ví dụ 2:

```python
Input: grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3
```

#### 5.1.3 Ý tưởng giải quyết

Nếu xem các ký tự `'1'` kề nhau theo hướng ngang và/hoặc dọc như là một khối liên thông, thì bài toán này yêu cầu chúng ta tìm số lượng khối liên thông.

Chúng ta có thể sử dụng tìm kiếm theo chiều sâu hoặc tìm kiếm theo chiều rộng để giải quyết.

##### Ý tưởng 1: Tìm kiếm theo chiều sâu

1. Duyệt qua lưới `grid`.
2. Đối với mỗi ký tự `'1'`, duyệt qua bốn hướng trên, dưới, trái, phải và đặt ký tự này thành `'0'` để đảm bảo không duyệt lại.
3. Nếu vượt quá biên, trả về 0.
4. Đối với phần tử $(i, j)$, các vị trí đệ quy sẽ là $(i - 1, j)$, $(i, j - 1)$, $(i + 1, j)$, $(i, j + 1)$ bốn hướng. Mỗi lần đệ quy đến cuối, tăng biến đếm lên một lần.
5. Số lượng lần đệ quy tìm kiếm theo chiều sâu chính là số lượng đảo chúng ta cần tìm.

##### Ý tưởng 1: Code

```python
class Solution:
    def dfs(self, grid, i, j):
        n = len(grid)
        m = len(grid[0])
        if i < 0 or i >= n or j < 0 or j >= m or grid[i][j] == '0':
            return 0
        grid[i][j] = '0'
        self.dfs(grid, i + 1, j)
        self.dfs(grid, i, j + 1)
        self.dfs(grid, i - 1, j)
        self.dfs(grid, i, j - 1)

    def numIslands(self, grid: List[List[str]]) -> int:
        count = 0
        for i in range(len(grid)):
            for j in range(len(grid[0])):
                if grid[i][j] == '1':
                    self.dfs(grid, i, j)
                    count += 1
        return count
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(m \times n)$. Trong đó, $m$ và $n$ lần lượt là số hàng và số cột.
- **Độ phức tạp không gian**: $O(m \times n)$.

### 5.2 Sao chép đồ thị

#### 5.2.1 Liên kết đến bài toán

- [133. Clone Graph](https://leetcode.com/problems/clone-graph/)

#### 5.2.2 Đề bài

**Mô tả**: Cho một đồ thị vô hướng được biểu diễn dưới dạng danh sách kề (mảng hai chiều), trong đó `adjList[i]` đại diện cho danh sách kề của nút có giá trị `i + 1`, `adjList[i][j]` đại diện cho nút có giá trị `i + 1` và nút kề có giá trị `adjList[i][j]`.

**Yêu cầu**: Trả về một bản sao sâu của đồ thị đó.

**Giải thích**:

- Đồ thị luôn bị bao quanh bởi nước và mỗi đảo chỉ có thể được tạo thành từ các đất kề nhau theo hướng ngang và/hoặc dọc.
- Bạn có thể giả định rằng giá trị của `Node.val` là duy nhất, `1 ≤ Node.val ≤ 100`.
- Đồ thị là đồ thị liên thông, bạn có thể truy cập tất cả các nút từ nút đã cho.

**Ví dụ**:

```python
Input: adjList = [[2,4],[1,3],[2,4],[1,3]]
Output: [[2,4],[1,3],[2,4],[1,3]]
Explanation:
Có 4 nút trong đồ thị.
Nút 1 có giá trị là 1, có hai nút kề: nút 2 và 4.
Nút 2 có giá trị là 2, có hai nút kề: nút 1 và 3.
Nút 3 có giá trị là 3, có hai nút kề: nút 2 và 4.
Nút 4 có giá trị là 4, có hai nút kề: nút 1 và 3.
```

```python
Input: adjList = [[2],[1]]
Output: [[2],[1]]
```

#### 5.2.3 Ý tưởng giải quyết

Sao chép sâu của đồ thị có nghĩa là xây dựng một đồ thị có cấu trúc và giá trị giống với đồ thị ban đầu, nhưng các nút không phải là tham chiếu của nút ban đầu, tức là mỗi nút đều được tạo mới.

Có thể sử dụng tìm kiếm theo chiều sâu hoặc tìm kiếm theo chiều rộng để giải quyết.

##### Ý tưởng 1: Tìm kiếm theo chiều sâu

1. Sử dụng từ điển `visitedDict` để lưu trữ các nút đã được truy cập trong đồ thị gốc và đồ thị sao chép, với cặp khóa-giá trị là "nút đã được truy cập trong đồ thị gốc: nút tương ứng trong đồ thị sao chép".
2. Bắt đầu từ nút đã cho, sử dụng tìm kiếm theo chiều sâu để duyệt qua đồ thị gốc.
   1. Nếu nút hiện tại đã được truy cập, trả về nút tương ứng trong đồ thị sao chép.
   2. Nếu nút hiện tại chưa được truy cập, tạo một nút mới và lưu trữ trong `visitedDict`.
   3. Duyệt qua danh sách các nút kề của nút hiện tại, đệ quy gọi tìm kiếm theo chiều sâu trên các nút kề và thêm vào danh sách nút kề của nút sao chép.
3. Kết thúc đệ quy, trả về nút sao chép.

##### Ý tưởng 1: Code

```python
class Solution:
    def cloneGraph(self, node: 'Node') -> 'Node':
        if not node:
            return node
        visitedDict = dict()

        def dfs(node: 'Node') -> 'Node':
            if node in visitedDict:
                return visitedDict[node]

            clone_node = Node(node.val, [])
            visitedDict[node] = clone_node
            for neighbor in node.neighbors:
                clone_node.neighbors.append(dfs(neighbor))
            return clone_node

        return dfs(node)
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n)$. Trong đó, $n$ là số lượng nút trong đồ thị.
- **Độ phức tạp không gian**: $O(n)$.
