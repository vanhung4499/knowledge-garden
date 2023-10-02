---
title: Greedy
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-10-02
date modified: 2023-10-02
---

## 1. Giới thiệu thuật toán tham lam

### 1.1 Định nghĩa của thuật toán tham lam

> **Thuật toán tham lam (Greedy Algorithm)**: Là một thuật toán luôn lựa chọn lựa chọn tốt nhất trong trạng thái hiện tại ở mỗi bước quyết định, với hy vọng dẫn đến kết quả tốt nhất hoặc tối ưu.

Thuật toán tham lam là một phương pháp cải tiến của "giải quyết từng bước" trong đó chia quá trình giải quyết thành "các bước" và sau đó chọn một "tiêu chí đo lường" dựa trên yêu cầu của bài toán, áp dụng "nguyên tắc tham lam" trong mỗi bước để chọn lựa "lựa chọn tốt nhất / tối ưu hiện tại (lời giải tốt nhất cục bộ)" và hy vọng rằng kết quả cuối cùng cũng là "kết quả tốt nhất / tối ưu (lời giải tốt nhất toàn cục)".

Nói cách khác, thuật toán tham lam không xem xét tới tối ưu toàn cục, mà chỉ tập trung vào từng bước và chọn lựa "lựa chọn tốt nhất / tối ưu hiện tại (lời giải tốt nhất cục bộ)" dựa trên tình huống hiện tại, với hy vọng rằng kết quả cuối cùng cũng là "kết quả tốt nhất / tối ưu (lời giải tốt nhất toàn cục)".

### 1.2 Đặc điểm của thuật toán tham lam

Đối với nhiều bài toán, có thể sử dụng thuật toán tham lam để đạt được lời giải tối ưu hoặc gần đúng của lời giải tối ưu. Tuy nhiên, không phải tất cả các bài toán đều có thể giải quyết bằng thuật toán tham lam.

Nhìn chung, những bài toán có thể giải quyết bằng thuật toán tham lam phải đáp ứng hai đặc điểm sau:

1. **Tính chọn lựa tham lam**: Tức là lời giải tối ưu của một bài toán có thể được tạo ra bằng cách lựa chọn tối ưu cục bộ (chọn lựa tham lam) tại mỗi bước.
2. **Tính tối ưu con cấu trúc**: Tức là lời giải tối ưu của một bài toán chứa lời giải tối ưu của các bài toán con.

#### 1.2.1 Tính chọn lựa tham lam

> **Lựa chọn tham lam**: Đề cập đến việc lựa chọn tốt nhất trong trạng thái hiện tại của một bài toán để đạt được lời giải tối ưu.

Nói cách khác, khi thực hiện lựa chọn, chúng ta chọn lựa trực tiếp lựa chọn tốt nhất hiện tại trong bài toán, mà không cần xem xét lời giải của các bài toán con. Sau khi thực hiện lựa chọn, chúng ta mới giải quyết các bài toán con còn lại.

Thuật toán tham lam trong quá trình lựa chọn có thể phụ thuộc vào lựa chọn trước đó, nhưng không phụ thuộc vào bất kỳ lựa chọn tương lai nào hoặc lời giải của bài toán con. Các bước lựa chọn tham lam không có quá trình quay lại trong quá trình chạy chương trình.

#### 1.2.2 Tính tối ưu con cấu trúc

> **Tối ưu con cấu trúc**: Đề cập đến việc lời giải tối ưu của một bài toán chứa lời giải tối ưu của các bài toán con.

Tính tối ưu con cấu trúc của bài toán là yếu tố quan trọng để xác định xem bài toán có thể giải quyết bằng thuật toán tham lam hay không.

Ví dụ, như hình dưới đây, bài toán gốc $S = \lbrace a_1, a_2, a_3, a_4 \rbrace$, sau bước $a_1$ chúng ta chọn lựa lời giải tốt nhất hiện tại thông qua lựa chọn tham lam, sau đó bài toán trở thành việc giải quyết bài toán con $S_{\text{subproblem}} = \lbrace a_2, a_3, a_4 \rbrace$. Nếu lời giải tối ưu của bài toán gốc có thể được tạo thành từ "lời giải tốt nhất cục bộ thông qua lựa chọn tham lam ở bước $a_1$" và "lời giải tối ưu của bài toán con $S_{\text{subproblem}}$", thì bài toán này đáp ứng tính tối ưu con cấu trúc.

Nói cách khác, nếu lời giải tối ưu của bài toán gốc chứa lời giải tối ưu của bài toán con, thì bài toán này đáp ứng tính tối ưu con cấu trúc.

Sau khi thực hiện lựa chọn tham lam, bài toán gốc có thể được phân rã thành các bài toán con nhỏ hơn để giải quyết, và có thể dẫn xuất lời giải tối ưu của bài toán từ lựa chọn tham lam và lời giải tối ưu của bài toán con.

Ngược lại, nếu không thể dẫn xuất lời giải tối ưu của bài toán từ lời giải tối ưu của bài toán con, thì bài toán này không có tính tối ưu con cấu trúc.

### 1.3 Chứng minh tính đúng đắn của thuật toán tham lam

Phần khó nhất của thuật toán tham lam không nằm ở việc giải quyết bài toán, mà nằm ở việc chứng minh tính đúng đắn của nó. Phương pháp chứng minh thông thường của chúng ta bao gồm "toán học quy nạp" và "chứng minh bằng hoán vị".

> - **Toán học quy nạp**: Đầu tiên tính toán lời giải tại trường hợp biên (ví dụ $n = 1$), sau đó chứng minh rằng với mỗi $n$, $F_{n + 1}$ có thể được suy ra từ $F_n$.
>
> - **Chứng minh bằng hoán vị**: Từ lời giải tối ưu, nếu trao đổi bất kỳ hai phần tử / hai phần tử kề nhau trong lời giải, và kết quả không tốt hơn, thì có thể kết luận rằng lời giải hiện tại là lời giải tối ưu.

Việc xác định xem một bài toán có thể giải quyết bằng thuật toán tham lam hay không, đòi hỏi chúng ta phải có chứng minh toán học chặt chẽ. Tuy nhiên, trong việc giải bài toán hàng ngày hoặc trong phỏng vấn thuật toán, không yêu cầu chúng ta chứng minh tính đúng đắn của thuật toán tham lam.

## 3. Ba bước của thuật toán tham lam

1. **Chuyển đổi vấn đề**: Chuyển đổi vấn đề tối ưu thành một vấn đề có tính chọn lựa tham lam, tức là chọn lựa trước, sau đó giải quyết một vấn đề con còn lại.
2. **Tính chọn lựa tham lam**: Dựa trên yêu cầu của đề bài, lựa chọn một tiêu chí đo lường và áp dụng nguyên tắc tham lam để chọn lựa "lựa chọn tốt nhất / tối ưu hiện tại" trong trạng thái hiện tại, để đạt được lời giải tốt nhất cục bộ.
3. **Tính tối ưu con cấu trúc**: Dựa trên lựa chọn tham lam và lời giải tối ưu của vấn đề con, kết hợp chúng để tạo ra lời giải tối ưu của vấn đề gốc.

## 4. Ứng dụng của thuật toán tham lam

### 4.1 Phân phát bánh quy

#### 4.1.1 Liên kết đề bài

- [455. Assign Cookies](https://leetcode.com/problems/assign-cookies/)

#### 4.1.2 Ý nghĩa của đề bài

**Mô tả**: Một người cha tuyệt vời đang phân phát bánh quy cho các đứa trẻ. Đối với mỗi đứa trẻ `i`, có một giá trị tham lam `g[i]`, tức là đứa trẻ đó muốn có một chiếc bánh quy có kích thước nhỏ nhất. Đối với mỗi chiếc bánh quy `j`, có một giá trị kích thước `s[j]`. Chỉ khi `s[j] > g[i]`, chúng ta mới có thể phân phát chiếc bánh quy `j` cho đứa trẻ `i`. Mỗi đứa trẻ chỉ được nhận tối đa một chiếc bánh quy.

Giờ đây, chúng ta được cung cấp mảng `g` đại diện cho giá trị tham lam của tất cả các đứa trẻ và mảng `s` đại diện cho kích thước của tất cả các chiếc bánh quy.

**Yêu cầu**: Hãy cố gắng đáp ứng số lượng đứa trẻ càng nhiều càng tốt và tính toán giá trị tối đa này.

**Chú ý**:

- $1 \le g.length \le 3 * 10^4$.
- $0 \le s.length \le 3 * 10^4$.
- $1 \le g[i], s[j] \le 2^{31} - 1$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: g = [1,2,3], s = [1,1]
Output: 1
Explanation: Bạn có ba đứa trẻ và hai chiếc bánh quy nhỏ, giá trị tham lam của 3 đứa trẻ lần lượt là: 1, 2, 3. Mặc dù bạn có hai chiếc bánh quy, nhưng vì kích thước của chúng đều là 1, bạn chỉ có thể đáp ứng nhu cầu của đứa trẻ có giá trị tham lam là 1. Vì vậy, đáp án là 1.
```

- Ví dụ 2:

```python
Input: g = [1,2], s = [1,2,3]
Output: 2
Explanation: Bạn có hai đứa trẻ và ba chiếc bánh quy, giá trị tham lam của 2 đứa trẻ lần lượt là 1, 2. Số lượng và kích thước bánh quy bạn có đủ để đáp ứng nhu cầu của tất cả các đứa trẻ. Vì vậy, đáp án là 2.
```

#### 4.1.3 Ý tưởng giải quyết

##### Ý tưởng 1: Thuật toán tham lam

Để đáp ứng số lượng đứa trẻ càng nhiều càng tốt và một chiếc bánh quy không thể chia thành hai nửa, chúng ta nên cố gắng để đứa trẻ có độ tham lam nhỏ nhất ăn chiếc bánh quy nhỏ nhất, điều này sẽ để lại những chiếc bánh quy lớn hơn cho đứa trẻ có độ tham lam lớn hơn.

Vì vậy, từ quan điểm của thuật toán tham lam, chúng ta nên sắp xếp mảng `g` theo thứ tự tăng dần và sắp xếp mảng `s` theo thứ tự tăng dần, và với mỗi đứa trẻ, chúng ta nên chọn chiếc bánh quy nhỏ nhất mà đáp ứng được độ tham lam của đứa trẻ đó.

Dưới đây là quá trình giải quyết bài toán bằng cách sử dụng ba bước của thuật toán tham lam.

1. **Chuyển đổi vấn đề**: Chuyển đổi vấn đề gốc thành việc khi đứa trẻ có độ tham lam nhỏ nhất chọn được chiếc bánh quy nhỏ nhất mà đáp ứng được độ tham lam của đứa trẻ đó, sau đó giải quyết vấn đề chọn lựa cho đứa trẻ còn lại (vấn đề con).
2. **Tính chọn lựa tham lam**: Đối với đứa trẻ hiện tại, chọn chiếc bánh quy có kích thước nhỏ nhất để đáp ứng độ tham lam của đứa trẻ đó.
3. **Tính tối ưu con cấu trúc**: Với chiến lược tham lam trên, chọn lựa tham lam của đứa trẻ hiện tại + lời giải tối ưu của vấn đề con, chính là lời giải tối ưu của vấn đề gốc. Nghĩa là với chiến lược tham lam, chúng ta có thể đạt được số lượng đứa trẻ được đáp ứng nhu cầu là lớn nhất.

Dưới đây là mã giải quyết bài toán bằng thuật toán tham lam.

##### Ý tưởng 1: Code

```python
class Solution:
    def findContentChildren(self, g: List[int], s: List[int]) -> int:
        g.sort()
        s.sort()
        index_g, index_s = 0, 0
        res = 0
        while index_g < len(g) and index_s < len(s):
            if g[index_g] <= s[index_s]:
                res += 1
                index_g += 1
                index_s += 1
            else:
                index_s += 1   

        return res
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(m \times \log m + n \times \log n)$, trong đó $m$ và $n$ lần lượt là độ dài của mảng `g` và `s`.
- **Độ phức tạp không gian**: $O(\log m + \log n)$.

### 4.2 Các ứng dụng của thuật toán tham lam

#### 4.2.1 Phân phối bánh quy

##### 4.2.1.1 Liên kết đề bài

- [455. Phân phối bánh quy - LeetCode](https://leetcode-cn.com/problems/assign-cookies/)

##### 4.2.1.2 Ý nghĩa của đề bài

**Mô tả**: Một người cha tốt đã phân phát bánh quy cho các đứa trẻ. Đối với mỗi đứa trẻ `i`, có một giá trị đội ăn `g[i]`, tức là đứa trẻ đó muốn có một chiếc bánh quy có kích thước nhỏ nhất. Đối với mỗi chiếc bánh quy `j`, có một giá trị kích thước `s[j]`. Chỉ khi `s[j] > g[i]`, chúng ta mới có thể phân phát chiếc bánh quy `j` cho đứa trẻ `i`. Mỗi đứa trẻ chỉ được nhận tối đa một chiếc bánh quy.

Giờ đây, chúng ta được cung cấp mảng `g` đại diện cho giá trị đội ăn của tất cả các đứa trẻ và mảng `s` đại diện cho kích thước của tất cả các chiếc bánh quy.

**Yêu cầu**: Hãy cố gắng đáp ứng số lượng đứa trẻ càng nhiều càng tốt và tính toán giá trị tối đa này.

**Chú ý**:

- $1 \le g.length \le 3 * 10^4$.
- $0 \le s.length \le 3 * 10^4$.
- $1 \le g[i], s[j] \le 2^{31} - 1$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: g = [1,2,3], s = [1,1]
Output: 1
Explanation: Bạn có ba đứa trẻ và hai chiếc bánh quy nhỏ, giá trị đội ăn của 3 đứa trẻ lần lượt là: 1, 2, 3. Mặc dù bạn có hai chiếc bánh quy, nhưng vì kích thước của chúng đều là 1, bạn chỉ có thể đáp ứng nhu cầu của đứa trẻ có giá trị đội ăn là 1. Vì vậy, đáp án là 1.
```

- Ví dụ 2:

```python
Input: g = [1,2], s = [1,2,3]
Output: 2
Explanation: Bạn có hai đứa trẻ và ba chiếc bánh quy, giá trị đội ăn của 2 đứa trẻ lần lượt là 1, 2. Số lượng và kích thước bánh quy bạn có đủ để đáp ứng nhu cầu của tất cả các đứa trẻ. Vì vậy, đáp án là 2.
```

##### 4.2.1.3 Ý tưởng giải quyết

###### Ý tưởng 1: Thuật toán tham lam

Vấn đề này có thể được chuyển đổi thành việc chọn số lượng đứa trẻ càng nhiều càng tốt và không có sự chồng chéo giữa các đoạn. Vấn đề này trở thành việc tìm số lượng đoạn không chồng chéo tối đa trong tất cả các đoạn.

Từ quan điểm của thuật toán tham lam, chúng ta nên sắp xếp các đoạn theo thứ tự kết thúc. Mỗi lần chọn đoạn kết thúc sớm nhất, sau đó chọn số lượng đoạn không chồng chéo tối đa trong các đoạn còn lại.

Dưới đây là quá trình giải quyết bài toán bằng cách sử dụng ba bước của thuật toán tham lam.

1. **Chuyển đổi vấn đề**: Chuyển đổi vấn đề gốc thành việc chọn số lượng đoạn không chồng chéo tối đa trong tất cả các đoạn (vấn đề con).
2. **Tính chọn lựa tham lam**: Mỗi lần chọn, chọn đoạn kết thúc sớm nhất.
3. **Tính tối ưu con cấu trúc**: Với chiến lược tham lam trên, chọn lựa tham lam hiện tại + lời giải tối ưu của vấn đề con, chính là lời giải tối ưu của vấn đề gốc. Nghĩa là với chiến lược tham lam, chúng ta có thể đạt được số lượng đoạn không chồng chéo tối đa.

Dưới đây là mã giải quyết bài toán bằng thuật toán tham lam.

###### Ý tưởng 1: Mã giải quyết

```python
class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        if not intervals:
            return 0
        intervals.sort(key=lambda x: x[1])
        end_pos = intervals[0][1]
        count = 1
        for i in range(1, len(intervals)):
            if end_pos <= intervals[i][0]:
                count += 1
                end_pos = intervals[i][1]

        return len(intervals) - count
```

###### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times \log n)$, trong đó $n$ là số lượng đoạn.
- **Độ phức tạp không gian**: $O(\log n)$.

### 4.2 Không có khoảng chồng chéo

#### 4.2.1 Liên kết đề bài

- [435. Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)

#### 4.2.2 Ý tưởng giải quyết

##### Ý tưởng 1: Thuật toán tham lam

Chúng ta có thể thay đổi cách suy nghĩ một chút về bài toán này. Đề bài yêu cầu loại bỏ một số khoảng chồng chéo để chỉ còn lại các khoảng không chồng chéo.

Chúng ta có thể đặt câu hỏi: "Làm thế nào để có số lượng khoảng không chồng chéo còn lại là nhiều nhất?" Đáp án sẽ là: "Tổng số khoảng trừ đi số lượng khoảng chồng chéo còn lại là nhiều nhất".

Với cách suy nghĩ theo thuật toán tham lam, chúng ta sẽ chọn khoảng kết thúc sớm nhất và sau đó chọn số lượng khoảng lớn nhất trong khoảng thời gian còn lại.

Chúng ta sẽ sử dụng thuật toán tham lam để giải quyết bài toán này.

1. **Chuyển đổi vấn đề**: Chuyển đổi vấn đề gốc thành việc chọn số lượng khoảng không chồng chéo còn lại là nhiều nhất trong khoảng thời gian còn lại (vấn đề con).
2. **Thuộc tính lựa chọn tham lam**: Mỗi lần chọn, chúng ta sẽ chọn khoảng kết thúc sớm nhất. Khoảng được chọn lúc này sẽ là một trong các khoảng tối ưu của vấn đề gốc.
3. **Thuộc tính cấu trúc tối ưu**: Với chiến lược tham lam trên, việc chọn khoảng kết thúc sớm nhất và sau đó chọn số lượng khoảng lớn nhất trong khoảng thời gian còn lại sẽ là lời giải tối ưu cho vấn đề con. Đồng thời, lời giải tối ưu cho vấn đề con cũng là lời giải tối ưu cho vấn đề gốc.

Các bước giải quyết bài toán bằng thuật toán tham lam như sau:

1. Sắp xếp tập hợp các khoảng theo thứ tự tăng dần của vị trí kết thúc, và sau đó duy trì hai biến, một là vị trí kết thúc của khoảng không chồng chéo hiện tại `end_pos`, hai là số lượng khoảng không chồng chéo `count`. Ban đầu, `end_pos` được gán bằng vị trí kết thúc của khoảng đầu tiên, `count` được gán bằng 1.
2. Duyệt qua từng khoảng. Với mỗi khoảng `intervals[i]`:
   1. Nếu `end_pos <= intervals[i][0]`, tức là `end_pos` nhỏ hơn hoặc bằng vị trí bắt đầu của khoảng, thì có một khoảng không chồng chéo xuất hiện. Tăng giá trị `count` lên 1 và cập nhật `end_pos` thành vị trí kết thúc của khoảng mới.
3. Trả về giá trị `len(intervals) - count` là kết quả.

##### Ý tưởng 1: Mã giả

```python
class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        if not intervals:
            return 0
        intervals.sort(key=lambda x: x[1])
        end_pos = intervals[0][1]
        count = 1
        for i in range(1, len(intervals)):
            if end_pos <= intervals[i][0]:
                count += 1
                end_pos = intervals[i][1]

        return len(intervals) - count
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(n \times \log n)$, trong đó $n$ là số lượng khoảng.
- **Độ phức tạp không gian**: $O(\log n)$.
