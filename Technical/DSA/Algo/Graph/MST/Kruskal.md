---
title: Kruskal
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-10-04
date modified: 2023-10-04
---

## 1. Giới thiệu thuật toán Kruskal

> **Thuật toán Kruskal** ra đời năm 1956, bởi Joseph Kruskal, là một thuật toán để tìm **cây khung nhỏ nhất** của một **đồ thị liên thông vô hướng có trọng số**. Thuật toán này tìm một tập hợp các cạnh tạo thành một cây khung chứa tất cả các đỉnh của đồ thị và có tổng trọng số các cạnh là nhỏ nhất. Thuật toán Kruskal sử dụng ý tưởng tham lam.

Nhắc lại khái niệm "cây khung nhỏ nhất" trong đồ thị là tập hợp các cạnh (gọi tắt là **MST**, viết tắt của "Minimum Spanning Tree") trong đó chúng ta đảm bảo các cạnh sau:

1. Bao gồm tất cả các đỉnh trong đồ thị (gồm $n$ đỉnh).
2. Tạo thành một cấu trúc cây (tức không có chu trình) (gồm $n - 1$ cạnh).
3. Có tổng trọng số nhỏ nhất.

Đối với hai điều kiện đầu, chúng ta có thể giải quyết dễ dàng bằng cấu trúc **[[Disjoint Set Union|Union-Find]]** . Nếu bạn chưa biết về Union-Find hay Disjoint Set hay DSU vui lòng đọc bài viết về cấu trúc [[Disjoint Set Union]] trước.  

Vấn đề quan trọng nằm ở điểm thứ ba, làm thế nào để đảm bảo rằng chúng ta nhận được một cây khung nhỏ nhất.

Ở đây, chúng ta sử dụng cách tiếp cận tham lam:

Sắp xếp tất cả các cạnh theo trọng số từ nhỏ đến lớn, bắt đầu từ cạnh có trọng số nhỏ nhất, nếu cạnh này không tạo thành chu trình với các cạnh khác trong **MST**, thì nó là một phần của cây khung nhỏ nhất và được thêm vào tập hợp **MST**. Nếu không, cạnh này không phải là một phần của cây khung nhỏ nhất và không được thêm vào tập hợp **MST**.

Như vậy, tập hợp các cạnh trong MST cuối cùng sẽ tạo thành cây khung nhỏ nhất. Bây giờ chúng ta hãy xem triển khai thuật toán Kruskal.

## 2. Triển khai thuật toán Kruskal

### 2.1 Các bước triển khai

Tiếp theo ta sẽ xem các bước triển khai thuật toán Kruskal trên một đồ thị liên thông vô hướng có trọng số với $n$ đỉnh và $m$ cạnh.

1. Sắp xếp các cạnh theo trọng số từ nhỏ tới lớn.
	- Có thể dùng bất cứ thuật toán sắp xếp nào nhưng để tối ưu thì phải dùng các thuật toán sắp xếp tối ưu thời gian như Quick Sort, Merge Sort. Nhưng đa số thì chúng ta sẽ dùng luôn thư viện trong các ngôn ngữ để sắp xếp cho đỡ mất thời gian code.
2. Khởi tạo cấu trúc Union-Find để xác định tập hợp của $n$ đỉnh và khởi tạo thêm một mảng kết quả `mst` chứa các cạnh
3. Duyệt tập cạnh đã sắp xếp và để xây dựng cây khung:
	- Với mỗi cạnh $(u, v)$, kiểm tra xem hai đỉnh $u$ và $v$ có cùng thuộc một tập hợp chưa?
		- Nếu không trùng, thêm cạnh vào cây khung tức là `mst` và hợp nhất 2 tập hợp của 2 đỉnh.
		- Nếu trùng, chúng đã nằm trong cây khung, bỏ qua và tiếp tục duyệt
4. Quá trình kết thúc khi đã tìm đủ $n - 1$ cạnh tức là `len(mst) == n - 1` thì dừng lại.

### 2.2 Code triển khai

```python
# Hàm triển khai thuật toán kruskal
# Đồ thị bao gốm số đỉnh là n và tập cạnh là edges có trọng số
def kruskal(n: int, edges: List[Tuple[int, int, int]]) -> int:
    # Sắp xếp tập cạnh theo trọng số
    edges = sorted(edges, key=lambda edge: edge[2])
    # Triển khai Union-Find
    parent = list(range(n))

    # Union-Find: hàm nén đường dẫn
    def find_parent(i):
        if i != parent[i]:
            parent[i] = find_parent(parent[i])
        return parent[i]
    # Lưu trữ tập cạnh và giá trị cây khung nhỏ nhất
    mst_cost = 0
    mst = []
    # Duyệt tập cạnh
    for edge in edges:
        # Tìm tập cha của hai nút
        parent_u = find_parent(edge[0])
        parent_v = find_parent(edge[1])
        # Nếu không cùng chung tập hợp
        if parent_u != parent_v:
            # Thêm cạnh và giá trị vào cây 
            mst_cost += edge[2]
            mst.append(edge)
            # Hợp nhất hai tập
            parent[parent_u] = parent_v
    # Trả về kết quả 
    return mst
```

### 2.3 Phân tích thuật toán Kruskal

Giả sử rằng số nút trong đồ thị là `V`, và số cạnh là `E`. Đầu tiên, không gian cần thiết để giữ tất cả các cạnh là `O(E)`, và cấu trúc Union-Find cũng yêu cầu `O(V)`. Vì vậy tổng độ phức tạp không gian của thuật toán Kruskal là `O(V + E)`.

Độ phức tạp về thời gian chủ yếu dành cho việc sắp xếp `O(ElogE)`. Thời gian cần thiết cho tất cả các hoạt động của thuật toán Union-Find chỉ là `O(1)` và vòng lặp for chỉ là `O(E)`, do đó tổng độ phức tạp về thời gian là `O(ElogE)`.

## 3. Ứng dụng thuật toán Kruskal

Sau đây ta sẽ áp dụng thuật toán kruskal vào giải một số bài trên leetcode.
