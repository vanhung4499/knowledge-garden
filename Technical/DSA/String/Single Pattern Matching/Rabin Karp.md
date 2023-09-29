---
title: Rabin Karp
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-09-29
date modified: 2023-09-30
---

## 1. Giới thiệu thuật toán Rabin Karp

> **Thuật toán Rabin Karp**: Thường được gọi là thuật toán RK. Được đặt theo tên hai nhà phát minh của nó là Michael Oser Rabin và Richard Manning Karp. Thuật toán RK là một thuật toán tìm kiếm chuỗi trong chuỗi được đề xuất bởi họ vào năm 1987, sử dụng hàm băm để tìm kiếm chuỗi mẫu trong văn bản.

## 2. Các bước của thuật toán Rabin Karp

### 2.1 Các bước chung của thuật toán Rabin Karp

1. Cho văn bản `T` và chuỗi mẫu `p`, tính độ dài của văn bản `T` là `n` và độ dài của chuỗi mẫu `p` là `m`.
2. Sử dụng thuật toán băm để tính giá trị băm của chuỗi mẫu `p`.
3. Sử dụng thuật toán băm cuộn để tính giá trị băm của `n - m + 1` chuỗi con trong văn bản `T`.
4. So sánh giá trị băm của từng chuỗi con với giá trị băm của chuỗi mẫu.
   1. Nếu giá trị băm của chuỗi con hiện tại không khớp với giá trị băm của chuỗi mẫu, tiếp tục tìm kiếm.
   2. Nếu giá trị băm của chuỗi con hiện tại khớp với giá trị băm của chuỗi mẫu, kiểm tra từng ký tự của chuỗi con và chuỗi mẫu để xác nhận sự khớp (tránh xung đột băm).
      1. Nếu từng ký tự của chuỗi con và chuỗi mẫu khớp, cho biết chuỗi con hiện tại và chuỗi mẫu khớp.
      2. Nếu từng ký tự của chuỗi con và chuỗi mẫu không khớp, tiếp tục tìm kiếm.
5. Nếu không tìm thấy khớp, trả về giá trị `-1`.

### 2.2 Thuật toán băm cuộn

Một bước quan trọng trong việc thực hiện thuật toán RK là **"Thuật toán băm cuộn"**, thông qua thuật toán băm cuộn, thời gian tính toán giá trị băm của chuỗi con được giảm từ $O(m)$ xuống còn $O(1)$, từ đó cải thiện hiệu suất của toàn bộ thuật toán.

Thuật toán băm cuộn trong thuật toán RK chủ yếu sử dụng ý tưởng **"Rabin fingerprint"**. Ý tưởng này sử dụng giá trị băm của từng ký tự trong chuỗi con và cũng có thể tính toán nhanh giá trị băm của chuỗi con kế tiếp dựa trên giá trị băm của chuỗi con trước đó, từ đó giúp tính toán giá trị băm của chuỗi con chỉ với độ phức tạp $O(1)$.

Dưới đây là một ví dụ để giải thích ý tưởng này.

Giả sử chuỗi chỉ chứa `d` ký tự và chúng ta có thể sử dụng hệ số `d` để biểu diễn giá trị băm của chuỗi con.

Ví dụ, nếu chuỗi chỉ chứa `26` chữ cái viết thường từ `a` đến `z`, chúng ta có thể sử dụng hệ `26` để biểu diễn chuỗi, trong đó `a` được biểu diễn bằng `0`, `b` được biểu diễn bằng `1`, và tiếp tục như vậy, `z` được biểu diễn bằng `25`.

Ví dụ, giá trị băm của chuỗi `cat` có thể được biểu diễn như sau:

$\begin{aligned} Hash(cat) &= c \times 26 \times 26 + a \times 26 + t \times 1 \cr &= 2 \times 26 \times 26 + 0 \times 26 + 19 \times 1 \cr &= 1371 \end{aligned}$

Phương pháp tính giá trị băm này có một đặc điểm: khi tính toán giá trị băm của chuỗi con kế tiếp, chúng ta có thể sử dụng giá trị băm của chuỗi con trước đó.

Ví dụ, nếu chuỗi con kế tiếp của `cat` là `ate`. Theo cách tính giá trị băm trên, giá trị băm của `ate` là:

$\begin{aligned} Hash(ate) &= a \times 26 \times 26 + t \times 26 + e \times 1 \cr &= 0 \times 26 \times 26 + 19 \times 26 + 4 \times 1 \cr &= 498 \end{aligned}$

Nếu tính giá trị băm của `ate` bằng cách sử dụng giá trị băm của chuỗi con trước đó `cat`, giá trị băm của `ate` sẽ là:

$\begin{aligned} Hash(ate) &= (Hash(cat) - c \times 26 \times 26) \times 26 + e \times 26 \cr &= (1371 - 2 \times 26 \times 26) \times 26 + 4 \times 1 \cr &= 498 \end{aligned}$

Có thể thấy, hai cách tính giá trị băm này cho kết quả giống nhau. Nhưng cách tính thứ hai không cần duyệt qua chuỗi con, chỉ cần tính toán từng ký tự để có được giá trị băm của toàn bộ chuỗi con. Điều này giúp giảm độ phức tạp tính toán giá trị băm của chuỗi con xuống còn $O(1)$. Sau đó, chúng ta có thể sử dụng thuật toán băm cuộn để nhanh chóng tính toán giá trị băm của chuỗi con.

## 3. Cài đặt thuật toán Rabin Karp

```python
# T là chuỗi văn bản, p là chuỗi mẫu, d là số lượng ký tự trong bộ ký tự, q là số nguyên tố
def rabinKarp(T: str, p: str, d, q) -> int:
    n, m = len(T), len(p)
    if n < m:
        return -1
    
    hash_p, hash_t = 0, 0
    
    for i in range(m):
        hash_p = (hash_p * d + ord(p[i])) % q           # Tính giá trị băm của chuỗi mẫu p
        hash_t = (hash_t * d + ord(T[i])) % q           # Tính giá trị băm của chuỗi con đầu tiên trong văn bản T
    
    power = pow(d, m - 1) % q                           # power được sử dụng để loại bỏ ký tự khi cuộn
    
    for i in range(n - m + 1):
        if hash_p == hash_t:                            # Kiểm tra giá trị băm của chuỗi mẫu p và chuỗi con
            match = True                                # Nếu giá trị băm bằng nhau, kiểm tra từng ký tự của chuỗi mẫu và chuỗi con để xác nhận khớp (tránh xung đột băm)
            for j in range(m):
                if T[i + j] != p[j]:
                    match = False                       # Nếu có ký tự không khớp giữa chuỗi mẫu và chuỗi con, kiểm tra không thành công, thoát khỏi vòng lặp
                    break
            if match:                                   # Nếu từng ký tự của chuỗi mẫu và chuỗi con khớp, trả về vị trí bắt đầu khớp
                return i
        if i < n - m:                                   # Tính giá trị băm của chuỗi con kế tiếp
            hash_t = (hash_t - power * ord(T[i])) % q   # Loại bỏ ký tự T[i]
            hash_t = (hash_t * d + ord(T[i + m])) % q   # Thêm ký tự T[i + m]
            hash_t = (hash_t + q) % q                   # Đảm bảo hash_t >= 0
        
    return -1
```

## 4. Phân tích thuật toán RK

Thuật toán RK có thể coi là một cải tiến của thuật toán BF. Trong thuật toán BF, mỗi ký tự đều cần được so sánh. Trong thuật toán RK, việc kiểm tra xem giá trị băm của chuỗi mẫu có bằng giá trị băm của mỗi chuỗi con được thực hiện trong thời gian $O(1)$. Tổng cộng cần so sánh `n - m + 1` chuỗi con, do đó thời gian chạy của thuật toán RK là $O(n)$. So với thuật toán BF, hiệu suất của thuật toán RK được cải thiện đáng kể.

Tuy nhiên, nếu có xung đột xảy ra, hiệu suất của thuật toán sẽ giảm. Trường hợp xấu nhất là mỗi lần so sánh giá trị băm của chuỗi mẫu và chuỗi con đều bằng nhau, nhưng mỗi lần đều xảy ra xung đột, điều này đòi hỏi kiểm tra từng ký tự của chuỗi mẫu và chuỗi con để xác nhận khớp, tổng số lần so sánh sẽ là `m * (n - m + 1)`, thời gian chạy sẽ trở thành $O(m * n)$.
