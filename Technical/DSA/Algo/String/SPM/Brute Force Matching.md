---
title: String Brute Force
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-09-29
date modified: 2023-09-29
---

## 1. Giới thiệu thuật toán Brute Force

> **Thuật toán Brute Force**: Thường được viết tắt là BF. Trong tiếng Việt, còn được gọi là thuật toán khớp mẫu thô, hoặc thuật toán khớp mẫu trâu bò.

- **Ý tưởng của thuật toán BF**: Cho chuỗi văn bản `T` và mẫu `p`, ta bắt đầu so sánh từ ký tự đầu tiên của chuỗi văn bản với ký tự đầu tiên của mẫu. Nếu hai ký tự này bằng nhau, ta tiếp tục so sánh các ký tự tiếp theo theo thứ tự. Nếu không bằng nhau, ta di chuyển chuỗi văn bản `T` sang ký tự tiếp theo và bắt đầu so sánh lại từ đầu mẫu `p`. Tiếp tục quá trình này cho đến khi so sánh thành công tất cả các ký tự của mẫu `p` với một chuỗi con liên tiếp trong chuỗi văn bản `T`, thì ta xác định rằng mẫu `p` xuất hiện trong chuỗi văn bản `T`. Ngược lại, nếu không thành công, ta kết luận rằng mẫu `p` không xuất hiện trong chuỗi văn bản `T`.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230929210759.png)

## 2. Các bước thực hiện thuật toán Brute Force

1. Cho chuỗi văn bản `T` và mẫu `p`, tính độ dài của chuỗi văn bản `T` là `n` và độ dài của mẫu `p` là `m`.
2. Dùng hai con trỏ `i` và `j` để duyệt qua chuỗi văn bản `T` và mẫu `p`. Bắt đầu so sánh ký tự `T[i]` với ký tự `p[j]`.
   - Nếu hai ký tự này bằng nhau, tiếp tục so sánh `T[i+1]` với `p[j+1]`. Tiếp tục quá trình này cho đến khi so sánh thành công tất cả các ký tự của mẫu `p`.
   - Nếu hai ký tự này không bằng nhau, di chuyển con trỏ `i` về vị trí bắt đầu của lần so sánh trước đó và con trỏ `j` về vị trí đầu tiên của mẫu `p`.
3. Khi duyệt qua toàn bộ chuỗi văn bản `T` hoặc mẫu `p`, dừng quá trình tìm kiếm.

## 3. Cài đặt thuật toán Brute Force

```python
def bruteForce(T: str, p: str) -> int:
    n, m = len(T), len(p)
    
    i, j = 0, 0                     # i là vị trí hiện tại trong chuỗi văn bản T, j là vị trí hiện tại trong mẫu p
    while i < n and j < m:          # Khi i hoặc j đạt đến cuối chuỗi, dừng tìm kiếm
        if T[i] == p[j]:            # Nếu hai ký tự bằng nhau, tiếp tục so sánh ký tự tiếp theo
            i += 1
            j += 1
        else:
            i = i - (j - 1)         # Nếu không bằng nhau, di chuyển i đến vị trí bắt đầu của lần so sánh trước đó
            j = 0                   # Đặt j về vị trí đầu tiên của mẫu p

    if j == m:
        return i - j                # Nếu tìm thấy mẫu, trả về vị trí bắt đầu của mẫu
    else:
        return -1                   # Nếu không tìm thấy mẫu, trả về -1
```

## 4. Phân tích thuật toán Brute Force

Thuật toán BF rất đơn giản và dễ hiểu, nhưng hiệu suất của nó rất thấp. Điều này chủ yếu do trong quá trình so sánh có thể xảy ra quay lui: khi gặp một cặp ký tự không khớp, mẫu `p` quay trở lại vị trí ban đầu và chuỗi văn bản `T` cũng quay trở lại vị trí bắt đầu của lần so sánh trước đó, sau đó tiếp tục so sánh lại từ đầu mẫu `p`.

Sau khi quay lui, một số phần của chuỗi văn bản và mẫu không cần thiết phải so sánh lại. Do chiến lược này, hiệu suất của thuật toán BF rất thấp. Trường hợp xấu nhất là mỗi lần so sánh đều không khớp ở cuối mẫu `p`, mỗi lần so sánh cần thực hiện `m` lần, tổng số lần so sánh là `m * (n - m + 1)`. Vì vậy, độ phức tạp thời gian xấu nhất của thuật toán BF là $O(m \times n)$.

Trong trường hợp tốt nhất (khớp mẫu ngay lần so sánh đầu tiên), độ phức tạp thời gian tốt nhất của thuật toán BF là $O(m)$.

Trong trường hợp trung bình, dựa trên nguyên lý xác suất bình đẳng, số lần so sánh trung bình là $\frac{(n + m)}{2}$, vì vậy độ phức tạp thời gian trung bình của thuật toán BF là $O(n + m)$.
