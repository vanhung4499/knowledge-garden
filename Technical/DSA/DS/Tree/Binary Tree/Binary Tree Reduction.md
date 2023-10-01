---
title: Binary Tree Reduction
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-09-30
date modified: 2023-09-30
---

## 1. Giới thiệu về khôi phục cây nhị phân

> **Khôi phục cây nhị phân**: Đề cập đến việc khôi phục cây nhị phân từ chuỗi duyệt cây.

Từ quá trình duyệt cây nhị phân, ta có thể thấy rằng, cho một cây nhị phân không rỗng, các chuỗi duyệt cây trước, duyệt cây giữa và duyệt cây sau thu được từ cây đó là duy nhất. Vậy nếu biết chuỗi duyệt của các nút, liệu chúng ta có thể xác định được cây nhị phân không? Và liệu cây nhị phân xác định được có duy nhất không?

Trước hết, chúng ta hãy xem xét quy tắc duyệt cây nhị phân trước, duyệt cây giữa và duyệt cây sau.

- Quy tắc duyệt cây nhị phân trước của cây không rỗng:
  1. Truy cập vào nút gốc.
  2. Duyệt cây con trái của nút gốc theo quy tắc duyệt cây nhị phân trước.
  3. Duyệt cây con phải của nút gốc theo quy tắc duyệt cây nhị phân trước.
- Quy tắc duyệt cây nhị phân giữa của cây không rỗng:
  1. Duyệt cây con trái của nút gốc theo quy tắc duyệt cây nhị phân giữa.
  2. Truy cập vào nút gốc.
  3. Duyệt cây con phải của nút gốc theo quy tắc duyệt cây nhị phân giữa.
- Quy tắc duyệt cây nhị phân sau của cây không rỗng:
  1. Duyệt cây con trái của nút gốc theo quy tắc duyệt cây nhị phân sau.
  2. Duyệt cây con phải của nút gốc theo quy tắc duyệt cây nhị phân sau.
  3. Truy cập vào nút gốc.

Hãy xem xét duyệt cây nhị phân trước, trong quá trình duyệt cây nhị phân trước, nút đầu tiên được truy cập là nút gốc, vì vậy thông qua chuỗi duyệt cây trước, chúng ta có thể xác định rằng nút đầu tiên trong chuỗi là nút gốc. Tuy nhiên, từ nút thứ hai trở đi, chúng ta không thể xác định được nó là nút con trái của nút gốc hay nút con phải của nút gốc. Vì vậy, chỉ dựa vào chuỗi duyệt cây trước, chúng ta không thể khôi phục được cây nhị phân.

Tiếp theo, hãy xem xét duyệt cây nhị phân sau, duyệt cây nhị phân sau cũng chỉ có thể xác định nút cuối cùng trong chuỗi là nút gốc, và không thể xác định vị trí của các nút khác trong cây. Vì vậy, chỉ dựa vào chuỗi duyệt cây sau, chúng ta không thể khôi phục được cây nhị phân.

Cuối cùng, chúng ta hãy xem xét duyệt cây nhị phân giữa, duyệt cây nhị phân giữa trước hết duyệt cây con trái của nút gốc, sau đó truy cập vào nút gốc và cuối cùng duyệt cây con phải của nút gốc. Như vậy, nút gốc trong chuỗi duyệt cây giữa sẽ chia chuỗi duyệt cây giữa thành hai phần, phần đầu tiên là chuỗi duyệt cây giữa của cây con trái của nút gốc và phần thứ hai là chuỗi duyệt cây giữa của cây con phải của nút gốc. Tất nhiên, chỉ dựa vào chuỗi duyệt cây giữa, chúng ta không thể khôi phục được cây nhị phân.

Tuy nhiên, nếu chúng ta kết hợp chuỗi duyệt cây trước và chuỗi duyệt cây giữa, chúng ta có thể tìm thấy chuỗi con tương ứng với cây con trái và cây con phải trong chuỗi duyệt cây trước. Trong chuỗi duyệt cây trước, nút đầu tiên của chuỗi con là nút gốc của cây con trái, và trong chuỗi duyệt cây giữa, nút cuối cùng của chuỗi con là nút gốc của cây con phải. Như vậy, chúng ta đã xác định được ba nút trong cây nhị phân.

Đồng thời, nút gốc của cây con trái và cây con phải trong chuỗi duyệt cây giữa cũng có thể chia chuỗi duyệt cây giữa thành hai phần. Như vậy, chúng ta có thể tiếp tục quá trình này cho đến khi xác định được tất cả các nút trong chuỗi duyệt cây trước.

Cần lưu ý rằng: **Nếu biết chuỗi duyệt cây trước và chuỗi duyệt cây giữa của một cây nhị phân, chúng ta có thể xác định cây nhị phân duy nhất.**

Tương tự, **nếu biết chuỗi duyệt cây giữa và chuỗi duyệt cây sau của một cây nhị phân, chúng ta cũng có thể xác định cây nhị phân duy nhất.** Phương pháp tương tự như xây dựng cây nhị phân từ chuỗi duyệt cây trước và chuỗi duyệt cây giữa, chỉ khác nhau ở chỗ nút gốc của cây được xác định dựa trên phần tử cuối cùng trong chuỗi duyệt cây sau.

Tương tự, **nếu biết chuỗi duyệt cây giữa và chuỗi duyệt cây theo tầng của một cây nhị phân, chúng ta cũng có thể xác định cây nhị phân duy nhất.**

Cần lưu ý rằng: **Nếu biết chuỗi duyệt cây trước và chuỗi duyệt cây sau của một cây nhị phân, chúng ta không thể xác định cây nhị phân duy nhất.** Điều này là do không có chuỗi duyệt cây giữa, không thể xác định phần bên trái và phải của cây.

## 2. Xây dựng cây nhị phân từ chuỗi duyệt theo thứ tự trước và thứ tự giữa

- **Mô tả**: Cho trước chuỗi duyệt theo thứ tự trước và chuỗi duyệt theo thứ tự giữa của một cây nhị phân.
- **Yêu cầu**: Xây dựng cây nhị phân từ các chuỗi đã cho.
- **Chú ý**: Giả sử không có các phần tử trùng lặp trong cây.

### 2.1 Quá trình xây dựng cây nhị phân từ chuỗi duyệt theo thứ tự trước và thứ tự giữa

Thứ tự duyệt theo thứ tự trước của cây nhị phân là: gốc - cây con trái - cây con phải. Thứ tự duyệt theo thứ tự giữa của cây nhị phân là: cây con trái - gốc - cây con phải.

Dựa vào thứ tự duyệt theo thứ tự trước, chúng ta có thể tìm được vị trí của gốc trong chuỗi duyệt trước. Sau đó, trong chuỗi duyệt theo thứ tự giữa, chúng ta có thể tìm được vị trí tương ứng của gốc, từ đó chia chuỗi duyệt giữa thành hai phần: chuỗi duyệt giữa của cây con trái và chuỗi duyệt giữa của cây con phải. Đồng thời, chúng ta cũng biết được số lượng phần tử trong mỗi chuỗi duyệt giữa.

Tiếp theo, chúng ta xây dựng nút hiện tại và đệ quy xây dựng cây con trái và cây con phải. Trong quá trình đệ quy, chúng ta sẽ tiếp tục chia chuỗi duyệt giữa thành hai phần và xây dựng cây con trái và cây con phải.

Quá trình xây dựng cây nhị phân từ chuỗi duyệt theo thứ tự trước và thứ tự giữa có thể được mô tả như sau:

1. Từ chuỗi duyệt theo thứ tự trước, chúng ta tìm vị trí của gốc tại `preorder[0]`.
2. Tìm vị trí tương ứng của gốc trong chuỗi duyệt theo thứ tự giữa là `inorder[k]`, từ đó chúng ta có thể chia cây thành cây con trái và cây con phải và biết được số lượng phần tử trong mỗi cây con.
3. Chia chuỗi duyệt theo thứ tự trước thành hai phần: chuỗi duyệt theo thứ tự trước của cây con trái và chuỗi duyệt theo thứ tự trước của cây con phải.
4. Xây dựng nút hiện tại và đệ quy xây dựng cây con trái và cây con phải, trong đó chuỗi duyệt theo thứ tự trước của cây con trái là `preorder[1: k + 1]`, chuỗi duyệt theo thứ tự giữa của cây con trái là `inorder[0: k]`, số lượng phần tử của cây con trái là `k`. Tương tự, chuỗi duyệt theo thứ tự trước của cây con phải là `preorder[k + 1:]`, chuỗi duyệt theo thứ tự giữa của cây con phải là `inorder[k + 1:]`, số lượng phần tử của cây con phải là `n - k - 1`.
5. Trả về nút hiện tại.

### 2.2 Mã nguồn thực hiện xây dựng cây nhị phân từ chuỗi duyệt theo thứ tự trước và thứ tự giữa

```python
class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> TreeNode:
        def createTree(preorder, inorder, n):
            if n == 0:
                return None
            k = 0
            while preorder[0] != inorder[k]:
                k += 1
            node = TreeNode(inorder[k])
            node.left = createTree(preorder[1: k + 1], inorder[0: k], k)
            node.right = createTree(preorder[k + 1:], inorder[k + 1:], n - k - 1)
            return node
        return createTree(preorder, inorder, len(inorder))
```

## 3. Xây dựng cây nhị phân từ chuỗi duyệt theo thứ tự giữa và thứ tự sau

- **Mô tả**: Cho trước chuỗi duyệt theo thứ tự giữa và chuỗi duyệt theo thứ tự sau của một cây nhị phân.
- **Yêu cầu**: Xây dựng cây nhị phân từ các chuỗi đã cho.
- **Chú ý**: Giả sử không có các phần tử trùng lặp trong cây.

### 3.1 Quá trình xây dựng cây nhị phân từ chuỗi duyệt theo thứ tự giữa và thứ tự sau

Thứ tự duyệt theo thứ tự giữa của cây nhị phân là: cây con trái - gốc - cây con phải. Thứ tự duyệt theo thứ tự sau của cây nhị phân là: cây con trái - cây con phải - gốc.

Dựa vào thứ tự duyệt theo thứ tự sau, chúng ta có thể tìm được vị trí của gốc trong chuỗi duyệt sau. Sau đó, trong chuỗi duyệt theo thứ tự giữa, chúng ta có thể tìm được vị trí tương ứng của gốc, từ đó chia chuỗi duyệt giữa thành hai phần: chuỗi duyệt giữa của cây con trái và chuỗi duyệt giữa của cây con phải. Đồng thời, chúng ta cũng biết được số lượng phần tử trong mỗi chuỗi duyệt giữa.

Tiếp theo, chúng ta xây dựng nút hiện tại và đệ quy xây dựng cây con trái và cây con phải. Trong quá trình đệ quy, chúng ta sẽ tiếp tục chia chuỗi duyệt giữa thành hai phần và xây dựng cây con trái và cây con phải.

Quá trình xây dựng cây nhị phân từ chuỗi duyệt theo thứ tự giữa và thứ tự sau có thể được mô tả như sau:

1. Từ chuỗi duyệt theo thứ tự sau, chúng ta tìm vị trí của gốc tại `postorder[n-1]`.
2. Tìm vị trí tương ứng của gốc trong chuỗi duyệt theo thứ tự giữa là `inorder[k]`, từ đó chúng ta có thể chia cây thành cây con trái và cây con phải và biết được số lượng phần tử trong mỗi cây con.
3. Chia chuỗi duyệt theo thứ tự giữa thành hai phần: chuỗi duyệt theo thứ tự giữa của cây con trái và chuỗi duyệt theo thứ tự giữa của cây con phải.
4. Xây dựng nút hiện tại và đệ quy xây dựng cây con trái và cây con phải, trong đó chuỗi duyệt theo thứ tự giữa của cây con trái là `inorder[0: k]`, chuỗi duyệt theo thứ tự sau của cây con trái là `postorder[0: k]`, số lượng phần tử của cây con trái là `k`. Tương tự, chuỗi duyệt theo thứ tự giữa của cây con phải là `inorder[k + 1: n]`, chuỗi duyệt theo thứ tự sau của cây con phải là `postorder[k: n - 1]`, số lượng phần tử của cây con phải là `n - k - 1`.
5. Trả về nút hiện tại.

### 3.2 Mã nguồn thực hiện xây dựng cây nhị phân từ chuỗi duyệt theo thứ tự giữa và thứ tự sau

```python
class Solution:
    def buildTree(self, inorder: List[int], postorder: List[int]) -> TreeNode:
        def createTree(inorder, postorder, n):
            if n == 0:
                return None
            k = 0
            while postorder[n - 1] != inorder[k]:
                k += 1
            node = TreeNode(inorder[k])
            node.right = createTree(inorder[k + 1: n], postorder[k: n - 1], n - k - 1)
            node.left = createTree(inorder[0: k], postorder[0: k], k)
            return node
        return createTree(inorder, postorder, len(postorder))
```
