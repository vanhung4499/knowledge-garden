---
title: Sunday
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-09-30
date modified: 2023-09-30
---

## 1. Giới thiệu về thuật toán Sunday

**"Sunday algorithm"** là một thuật toán tìm kiếm chuỗi con trong chuỗi, được Daniel M.Sunday đề xuất vào năm 1990.

> **Ý tưởng của thuật toán Sunday**: Đối với chuỗi văn bản `T` và chuỗi mẫu `p` đã cho, trước tiên ta tiền xử lý chuỗi mẫu `p`. Sau đó, trong quá trình so khớp, khi gặp một ký tự trong chuỗi văn bản `T` không khớp với chuỗi mẫu `p`, dựa trên chiến lược khởi đầu, ta có thể bỏ qua một số trường hợp không khớp và dịch chuyển chuỗi mẫu sang phải một số vị trí.

Ý tưởng của thuật toán Sunday tương tự như thuật toán Boyer Moore. Tuy nhiên, khác biệt của Sunday algorithm là việc so khớp diễn ra từ trái sang phải và khi chuỗi mẫu `p` không khớp, ta quan tâm đến ký tự tiếp theo trong chuỗi văn bản `T` tham gia so khớp. Khi gặp một ký tự không khớp trong chuỗi văn bản `T`, ta có thể di chuyển chuỗi mẫu `p` sang phải nhanh chóng.

Khi gặp ký tự không khớp, ta có thể di chuyển nhanh sang phải dựa trên hai trường hợp sau:

- **Trường hợp 1: Ký tự tiếp theo của chuỗi văn bản `T` sau ký tự cuối cùng của chuỗi mẫu `p[m - 1]` xuất hiện trong chuỗi mẫu `p`**.
    - Trong trường hợp này, ta có thể căn chỉnh chuỗi mẫu `p` sao cho ký tự `T[i + m]` trùng với vị trí cuối cùng xuất hiện của nó trong chuỗi mẫu `p`, như hình dưới đây.
    - **Số vị trí di chuyển sang phải = Vị trí tiếp theo của ký tự cuối cùng của chuỗi văn bản `T` - Vị trí xuất hiện cuối cùng của ký tự `T[i + m]` trong chuỗi mẫu `p`**.
    - Lưu ý: Vị trí tiếp theo của ký tự cuối cùng của chuỗi văn bản `T` thực chất là "độ dài chuỗi mẫu".

![20220128165756.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20220128165756.png)

- **Trường hợp 2: Ký tự tiếp theo của chuỗi văn bản `T` sau ký tự cuối cùng của chuỗi mẫu `p[m - 1]` không xuất hiện trong chuỗi mẫu `p`**.
    - Trong trường hợp này, ta có thể di chuyển toàn bộ chuỗi mẫu sang phải, như hình dưới đây.
    - **Số vị trí di chuyển sang phải = Độ dài toàn bộ chuỗi mẫu + 1**.

![20220128165811.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20220128165811.png)

## 2. Các bước của thuật toán Sunday

Các bước của thuật toán Sunday được mô tả như sau:

- Tính độ dài của chuỗi văn bản `T` là `n` và độ dài của chuỗi mẫu `p` là `m`.
- Tiến hành tiền xử lý chuỗi mẫu `p` và tạo bảng di chuyển `bc_table`.
- Căn chỉnh phần đầu của chuỗi mẫu `p` với chuỗi văn bản `T`, đặt `i` trỏ đến vị trí bắt đầu của chuỗi văn bản, tức là `i = 0`. `j` trỏ đến vị trí bắt đầu của chuỗi mẫu, tức là `j = 0`, sau đó so sánh từ vị trí bắt đầu của chuỗi mẫu.
    - Nếu ký tự tại vị trí `T[i + j]` của chuỗi văn bản `T` trùng với ký tự tại vị trí `p[j]` của chuỗi mẫu `p`, tiếp tục so sánh ký tự tiếp theo.
        - Nếu đã so khớp hết toàn bộ chuỗi mẫu, trả về vị trí bắt đầu của chuỗi mẫu `p` trong chuỗi văn bản `T`.
    - Nếu ký tự tại vị trí `T[i + j]` của chuỗi văn bản `T` không trùng với ký tự tại vị trí `p[j]` của chuỗi mẫu `p`, ta thực hiện:
        - Dựa trên bảng di chuyển `bc_table` và ký tự `T[i + m]` tương ứng với vị trí cuối cùng của chuỗi mẫu trong chuỗi văn bản `T`, tính toán số vị trí có thể di chuyển `bc_table[T[i + m]]`, sau đó di chuyển chuỗi mẫu sang phải.
- Nếu di chuyển đến cuối cùng mà không tìm thấy trường hợp khớp, trả về `-1`.

## 3. Cài đặt thuật toán Sunday

### 3.1 Cài đặt bảng di chuyển

Cài đặt bảng di chuyển khá đơn giản, tương tự như cách tạo bảng di chuyển trong thuật toán Horspool. Các bước cụ thể như sau:

- Sử dụng một bảng băm `bc_table`, `bc_table[bad_char]` đại diện cho số lượng vị trí có thể di chuyển sang phải khi gặp ký tự không phù hợp.
- Duyệt qua chuỗi mẫu `p`, với mỗi ký tự hiện tại `p[i]` làm khóa, số lượng vị trí có thể di chuyển sang phải (`m - i`) làm giá trị và lưu vào bảng băm. Nếu có ký tự trùng lặp, giá trị mới sẽ ghi đè lên giá trị đã lưu trước đó. Kết quả là bảng băm sẽ lưu trữ số lượng vị trí có thể di chuyển sang phải từ vị trí cuối cùng xuất hiện của ký tự trong chuỗi mẫu.

Đoạn mã dưới đây là cài đặt của việc tạo bảng di chuyển:

```python
# Tạo bảng di chuyển
# bc_table[bad_char] đại diện cho số lượng vị trí có thể di chuyển sang phải khi gặp ký tự không phù hợp
def generateBadCharTable(p: str):
    m = len(p)
    bc_table = dict()
    
    for i in range(m):                      # Duyệt đến vị trí cuối cùng m - 1
        bc_table[p[i]] = m - i              # Cập nhật số lượng vị trí có thể di chuyển sang phải khi gặp ký tự không phù hợp
    return bc_table
```

### 3.2 Cài đặt toàn bộ thuật toán Sunday

```python
# Thuật toán Sunday, T là chuỗi văn bản, p là chuỗi mẫu
def sunday(T: str, p: str) -> int:
    n, m = len(T), len(p)
    
    bc_table = generateBadCharTable(p)          # Tạo bảng di chuyển
    
    i = 0
    while i <= n - m:
        j = 0
        if T[i: i + m] == p:
            return i                            # Kết thúc so khớp, trả về vị trí của chuỗi mẫu p trong chuỗi văn bản T
        if i + m >= n:
            return -1
        i += bc_table.get(T[i + m], m + 1)      # Di chuyển sang phải nhanh chóng dựa trên bảng di chuyển
    return -1                                   # Không tìm thấy khớp

# Tạo bảng di chuyển
# bc_table[bad_char] đại diện cho số lượng vị trí có thể di chuyển sang phải khi gặp ký tự không phù hợp
def generateBadCharTable(p: str):
    m = len(p)
    bc_table = dict()
    
    for i in range(m):                      # Duyệt đến vị trí cuối cùng m - 1
        bc_table[p[i]] = m - i              # Cập nhật số lượng vị trí có thể di chuyển sang phải khi gặp ký tự không phù hợp
    return bc_table

print(sunday("abbcfdddbddcaddebc", "aaaaa"))
print(sunday("abbcfdddbddcaddebc", "bcf"))
```

### 4. Phân tích thuật toán Sunday

- Trong trường hợp trung bình, thuật toán Sunday có độ phức tạp thời gian là O(n), tuy nhiên trong trường hợp xấu nhất, độ phức tạp thời gian có thể là O(n * m).
