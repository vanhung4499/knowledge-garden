---
title: Digit DP
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-10-03
date modified: 2023-10-04
---

## 1. Giới thiệu về DP theo chữ số

### 1.1 Giới thiệu về DP theo chữ số

> **Quy hoạch động số học** (gọi tắt là "Digit DP") là à một dạng bài toán quy hoạch động liên quan đến các chữ số, tức là thực hiện tính toán trên các chữ số. Ở đây, chữ số chỉ đến hàng đơn vị, hàng chục, hàng trăm, hàng nghìn, v.v.

DP theo chữ số thường được sử dụng để tính số lượng giá trị thỏa mãn điều kiện cụ thể trong một khoảng $[left, right]$, hoặc để tìm số nhỏ thứ $k$ thỏa mãn điều kiện cụ thể.

DP theo chữ số thường có các đặc điểm sau:

1. Các câu hỏi thường cung cấp một khoảng truy vấn (đôi khi chỉ cung cấp giới hạn trên) là giới hạn thống kê.
2. Khoảng được cung cấp trong câu hỏi thường rất lớn (ví dụ: $10^9$), không thể giải quyết bằng phương pháp thô sơ.
3. Các điều kiện giới hạn được cung cấp trong câu hỏi thường liên quan đến chữ số.
4. Yêu cầu thống kê số lượng giá trị thỏa mãn điều kiện cụ thể hoặc tìm số nhỏ thứ $k$ thỏa mãn điều kiện cụ thể.

Câu hỏi yêu cầu đếm số lượng giá trị thỏa mãn điều kiện cụ thể trong một khoảng $[left, right]$. Nếu chúng ta có thể tìm ra cách tính toán số lượng giá trị thỏa mãn điều kiện cụ thể trong khoảng tiền tố $[0, n]$, chúng ta có thể sử dụng "ý tưởng tổng tiền tố" để tính toán số lượng giá trị thỏa mãn điều kiện cụ thể trong khoảng $[0, left - 1]$ và khoảng $[0, right]$, sau đó trừ hai giá trị này để có được kết quả mong muốn. Tức là: $res[left, right] = res[0, right] - res[0, left - 1]$.

Sau khi sử dụng "ý tưởng tổng tiền tố", vấn đề được chuyển đổi thành tính toán số lượng giá trị thỏa mãn điều kiện cụ thể trong khoảng $[0, n]$.

Tiếp theo, chúng ta sẽ sử dụng ý tưởng cơ bản của DP theo chữ số.

> **Ý tưởng cơ bản của DP theo chữ số**: Chia số trong khoảng thành các chữ số, sau đó xác định từng chữ số một.

Chúng ta chia các chữ số của số trong khoảng thành các chữ số riêng lẻ, sau đó xác định từng chữ số một trong số chúng để tính toán số lượng kịch bản khả thi trong khoảng.

DP theo chữ số có thể được triển khai bằng "đệ quy có nhớ (top-down)" hoặc "duyệt vòng lặp (bottom-up)". Vì DP theo chữ số liên quan đến nhiều tham số cần xem xét, việc sử dụng "đệ quy có nhớ" dễ dàng hơn để truyền tham số, vì vậy ở đây chúng ta sử dụng phương pháp "đệ quy có nhớ" để triển khai.

Khi sử dụng "đệ quy có nhớ", các tham số cần xem xét bao gồm:

1. Vị trí chữ số hiện tại đang xét ($pos$).
2. Tình trạng của chữ số trước (hoặc các chữ số trước đó), ví dụ: tổng của các chữ số trước ($total$), số lần xuất hiện của một số cụ thể ($cnt$), tập hợp các chữ số được chọn từ các chữ số trước đó (thường được sử dụng "nén trạng thái", tức sử dụng một số nguyên nhị phân $state$ để biểu thị).
3. Chữ số trước (hoặc các chữ số trước) có bằng các chữ số trước của giới hạn không ($isLimit$), được sử dụng để giới hạn phạm vi chữ số tìm kiếm lần này.
4. Chữ số trước đã điền số ($isNum$), nếu chữ số trước đã điền số, thì chữ số hiện tại có thể bắt đầu từ $0$; nếu chữ số trước chưa điền số, thì chữ số hiện tại có thể bỏ qua hoặc bắt đầu từ $1$.
5. Số nhỏ nhất ($minX$) và số lớn nhất ($maxX$) mà chữ số hiện tại có thể chọn.

Code tương ứng như sau:

```python
class Solution:
    def digitDP(self, n: int) -> int:
        # Chuyển n thành chuỗi s
        s = str(n)
        
        @cache
        # pos: vị trí số thứ pos
        # state: tập hợp các số đã chọn trước đó.
        # isLimit: biểu thị xem có bị giới hạn chọn hay không. Nếu đúng, thì số tối đa có thể chọn cho vị trí pos là s[pos] ; nếu sai, thì số tối đa có thể chọn là 9.
        # isNum: biểu thị xem các số trước đó đã được chọn hay chưa. Nếu đúng, thì vị trí hiện tại không thể bỏ qua ; nếu sai, thì vị trí hiện tại có thể bỏ qua.
        def dfs(pos, state, isLimit, isNum):
            if pos == len(s):
                # Nếu isNum là True, thì đây là một phương án hợp lệ
                return int(isNum)
            
            ans = 0
            if not isNum:
                # Nếu isNum là False, thì có thể bỏ qua vị trí hiện tại
                ans = dfs(pos + 1, state, False, False)
            
            # Nếu số trước đó chưa được chọn, thì số nhỏ nhất có thể chọn là 0, ngược lại là 1 (không được có số 0 đứng đầu).
            minX = 0 if isNum else 1
            # Nếu bị giới hạn chọn, thì số lớn nhất có thể chọn là s[pos], ngược lại là 9.
            maxX = int(s[pos]) if isLimit else 9
            
            # Liệt kê các số có thể chọn
            for x in range(minX, maxX + 1): 
                # x không nằm trong tập hợp các số đã chọn, tức là chưa chọn x trước đó
                if (state >> x) & 1 == 0:
                    ans += dfs(pos + 1, state | (1 << x), isLimit and x == maxX, True)
            return ans
    
        return dfs(0, 0, True, False)
```

Tiếp theo, chúng ta sẽ hiểu cụ thể hơn về số học DP và cách giải quyết vấn đề thông qua một ví dụ đơn giản.

### 1.2 Đếm số nguyên đặc biệt

#### 1.2.1 Liên kết đề bài

- [2376. Count Special Integers](https://leetcode.com/problems/count-special-integers/)

#### 1.2.2 Tóm tắt bài toán

**Mô tả**: Cho một số nguyên dương $n$.

**Yêu cầu**: Đếm số lượng số nguyên đặc biệt trong đoạn $[1, n]$.

**Giải thích**:

- **Số nguyên đặc biệt**: Nếu mỗi chữ số của một số nguyên dương là duy nhất, thì số đó được gọi là số nguyên đặc biệt.
- $1 \le n \le 2 \times 10^9$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: n = 20
Output: 19
Giải thích: Trừ số 11, tất cả các số nguyên trong đoạn từ 1 đến 20 đều là số nguyên đặc biệt. Vì vậy, có tổng cộng 19 số nguyên đặc biệt.
```

- Ví dụ 2:

```python
Input: n = 5
Output: 5
Giải thích: Tất cả các số nguyên từ 1 đến 5 đều là số nguyên đặc biệt.
```

#### 1.2.3 Ý tưởng giải quyết

##### Ý tưởng 1: Quy hoạch động + DP theo chữ số

Chuyển đổi số $n$ thành chuỗi $s$, định nghĩa hàm đệ quy `def dfs(pos, state, isLimit, isNum):` để xây dựng số lượng các phương án hợp lệ cho tất cả các chữ số từ vị trí $pos$ trở đi. Tiếp theo, thực hiện đệ quy theo các bước sau:

1. Bắt đầu đệ quy từ `dfs(0, 0, True, False)`. `dfs(0, 0, True, False)` có ý nghĩa:
	1. Bắt đầu xây dựng từ vị trí $0$.
	2. Ban đầu không sử dụng số nào (tức tập hợp số đã chọn trước đó là $0$).
	3. Ban đầu bị ràng buộc bởi chữ số cao nhất của $n$.
	4. Ban đầu chưa điền số nào.
2. Nếu gặp $pos == len(s)$, tức là đã đến cuối chuỗi số, lúc này:
	1. Nếu $isNum == True$, có nghĩa là phương án hiện tại đáp ứng yêu cầu, trả về số phương án là $1$.
	2. Nếu $isNum == False$, có nghĩa là phương án hiện tại không đáp ứng yêu cầu, trả về số phương án là $0$.
3. Nếu $pos \ne len(s)$, định nghĩa số phương án $ans$ và gán giá trị ban đầu là $0$, tức là: `ans = 0`.
4. Nếu gặp $isNum == False$, có nghĩa là các chữ số trước đó chưa được điền số, chữ số hiện tại có thể bỏ qua, trong trường hợp này số phương án bằng số phương án khi chưa điền số ở vị trí $pos + 1$, tức là: `ans = dfs(i + 1, state, False, False)`.
5. Nếu $isNum == True$, chữ số hiện tại phải điền một số. Lúc này:
	1. Dựa vào $isNum$ và $isLimit$ để quyết định số nhỏ nhất có thể chọn cho chữ số hiện tại ($minX$) và số lớn nhất có thể chọn ($maxX$),
	2. Sau đó, duyệt qua các số có thể điền vào từ khoảng $[minX, maxX]$.
	3. Nếu số chưa được chọn trước đó ($x$) không nằm trong tập hợp các số đã chọn trước đó ($state$), số phương án được cộng thêm số phương án sau khi chọn số $x$ cho chữ số hiện tại, tức là: `ans += dfs(pos + 1, state | (1 << x), isLimit and x == maxX, True)`.
		1. `state | (1 << x)` biểu thị tập hợp các số đã chọn trước đó $state$ cộng với $x$.
		2. `isLimit and x == maxX` biểu thị chữ số $pos + 1$ bị ràng buộc bởi các chữ số trước và chữ số $pos$.
		3. $isNum == True$ biểu thị chữ số $pos$ đã chọn số.

##### Ý tưởng 1: Code

```python
class Solution:
    def countSpecialNumbers(self, n: int) -> int:
        # Chuyển n thành chuỗi s
        s = str(n)
        
        @cache
        # pos: vị trí số thứ pos
        # state: tập hợp các số đã chọn trước đó.
        # isLimit: biểu thị xem có bị giới hạn chọn hay không. Nếu đúng, thì số tối đa có thể chọn cho vị trí pos là s[pos] ; nếu sai, thì số tối đa có thể chọn là 9.
        # isNum: biểu thị xem các số trước đó đã được chọn hay chưa. Nếu đúng, thì vị trí hiện tại không thể bỏ qua ; nếu sai, thì vị trí hiện tại có thể bỏ qua.
        def dfs(pos, state, isLimit, isNum):
            if pos == len(s):
                # Nếu isNum là True, thì đây là một phương án hợp lệ
                return int(isNum)
            
            ans = 0
            if not isNum:
                # Nếu isNum là False, thì có thể bỏ qua vị trí hiện tại
                ans = dfs(pos + 1, state, False, False)
            
            # Nếu số trước đó chưa được chọn, thì số nhỏ nhất có thể chọn là 0, ngược lại là 1 (không được có số 0 đứng đầu).
            minX = 0 if isNum else 1
            # Nếu bị giới hạn chọn, thì số lớn nhất có thể chọn là s[pos], ngược lại là 9.
            maxX = int(s[pos]) if isLimit else 9
            
            # Liệt kê các số có thể chọn
            for x in range(minX, maxX + 1): 
                # x không nằm trong tập hợp các số đã chọn, tức là chưa chọn x trước đó
                if (state >> x) & 1 == 0:
                    ans += dfs(pos + 1, state | (1 << x), isLimit and x == maxX, True)
            return ans
    
        return dfs(0, 0, True, False)
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(\log n \times 10 \times 2^{10})$, trong đó $n$ là số nguyên cho trước.
- **Độ phức tạp không gian**: $O(\log n \times 2^{10})$.

### 2.2 Số lượng số 1

#### 2.2.1 Liên kết đề bài

- [233. Number of Digit One](https://leetcode.com/problems/number-of-digit-one/)

#### 2.2.2 Tóm tắt đề bài

**Mô tả**: Cho một số nguyên $n$.

**Yêu cầu**: Đếm số lượng số $1$ xuất hiện trong tất cả các số nguyên không âm nhỏ hơn hoặc bằng $n$.

**Giải thích**:

- $0 \le n \le 10^9$.

**Ví dụ**:

- Ví dụ 1:

```python
Input: n = 13
Output: 6
```

- Ví dụ 2:

```python
Input: n = 0
Output: 0
```

#### 2.2.3 Ý tưởng giải quyết

##### Ý tưởng 1: Quy hoạch động + DP theo chữ số

Chuyển đổi số $n$ thành chuỗi $s$, định nghĩa hàm đệ quy `def dfs(pos, cnt, isLimit):` để xây dựng số lượng các số $1$ xuất hiện trong tất cả các chữ số từ vị trí $pos$ trở đi. Tiếp theo, thực hiện đệ quy theo các bước sau:

1. Bắt đầu đệ quy từ `dfs(0, 0, True)`. `dfs(0, 0, True)` có ý nghĩa:
   1. Bắt đầu xây dựng từ vị trí $0$.
   2. Số lượng số $1$ xuất hiện trước đó là $0$.
   3. Ban đầu bị ràng buộc bởi chữ số cao nhất của $n$.
2. Nếu gặp $pos == len(s)$, tức là đã đến cuối chuỗi số, lúc này: trả về số lượng số $1$ đã đếm được $cnt$.
3. Nếu $pos \ne len(s)$, định nghĩa số phương án $ans$ và gán giá trị ban đầu là $0$, tức là: `ans = 0`.
4. Bắt đầu tính toán số phương án:
   1. Vì không cần xét trường hợp số $0$ đứng đầu nên số nhỏ nhất có thể chọn cho chữ số hiện tại ($minX$) là $0$.
   2. Dựa vào $isLimit$ để quyết định số lớn nhất có thể chọn cho chữ số hiện tại ($maxX$).
   3. Sau đó, duyệt qua các số có thể điền vào từ khoảng $[minX, maxX]$.
   4. Số phương án được cộng thêm số phương án sau khi chọn số $d$ cho chữ số hiện tại, tức là: `ans += dfs(pos + 1, cnt + (d == 1), isLimit and d == maxX)`。
      1. `cnt + (d == 1)` biểu thị số lượng số $1$ đã xuất hiện trước đó cộng thêm số lượng số $1$ xuất hiện ở chữ số hiện tại.
      2. `isLimit and d == maxX` biểu thị chữ số $pos + 1$ bị ràng buộc bởi các chữ số trước và chữ số $pos$.
5. Số phương án cuối cùng là `dfs(0, 0, True)`, trả về giá trị đó.

##### Ý tưởng 1: Code

```python
class Solution:
    def countDigitOne(self, n: int) -> int:
        # Chuyển n thành chuỗi s
        s = str(n)
        
        @cache
        # pos: vị trí số thứ pos
        # cnt: số lượng số 1 đã xuất hiện trước đó.
        # isLimit: biểu thị xem có bị giới hạn chọn hay không. Nếu đúng, thì số tối đa có thể chọn cho vị trí pos là s[pos] ; nếu sai, thì số tối đa có thể chọn là 9.
        def dfs(pos, cnt, isLimit):
            if pos == len(s):
                return cnt
            
            ans = 0            
            # Không cần xét trường hợp số 0 đứng đầu, nên số nhỏ nhất có thể chọn là 0
            minX = 0
            # Nếu bị giới hạn chọn, thì số lớn nhất có thể chọn là s[pos], ngược lại là 9.
            maxX = int(s[pos]) if isLimit else 9
            
            # Liệt kê các số có thể chọn
            for d in range(minX, maxX + 1): 
                ans += dfs(pos + 1, cnt + (d == 1), isLimit and d == maxX)
            return ans
    
        return dfs(0, 0, True)
```

##### Ý tưởng 1: Phân tích độ phức tạp

- **Độ phức tạp thời gian**: $O(\log n)$.
- **Độ phức tạp không gian**: $O(\log n)$.
