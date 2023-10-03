---
title: Bit Operation
tags:
  - dsa
  - algorithm
categories:
  - dsa
  - algorithm
date created: 2023-10-02
date modified: 2023-10-02
---

## 1. Giới thiệu về phép toán bit

### 1.1 Phép toán bit và hệ nhị phân

> **Phép toán bit (Bit Operation)**: Trong máy tính, số được lưu trữ dưới dạng "hệ nhị phân (Binary)". Phép toán bit là việc thực hiện các phép toán trực tiếp trên biểu diễn nhị phân của số. Sử dụng phép toán bit trong chương trình có thể cải thiện hiệu suất của chương trình đáng kể.

Trước khi tìm hiểu về phép toán bit trên số nhị phân, chúng ta hãy tìm hiểu về khái niệm "số nhị phân".

> **Số nhị phân (Binary)**: Là số được biểu diễn bằng hai chữ số 0 và 1. Mỗi chữ số 0 hoặc 1 trong số nhị phân được gọi là "bit".

Trong hệ thập phân, chúng ta sử dụng 10 chữ số từ 0 đến 9, và quy tắc cộng là "đầy 10 nhớ 1". Ví dụ:

1. $7_{(10)} + 2_{(10)} = 9_{(10)}$: $7_{(10)}$ cộng với $2_{(10)}$ bằng $9_{(10)}$.
2. $9_{(10)} + 2_{(10)} = 11_{(10)}$: $9_{(10)}$ cộng với $2_{(10)}$ vượt quá 10, theo quy tắc "đầy 10 nhớ 1", kết quả là $11_{(10)}$.

Trong số nhị phân, chúng ta chỉ có 2 chữ số 0 và 1, và quy tắc cộng là "đầy 2 nhớ 1". Ví dụ:

1. $1_{(2)} + 0_{(2)} = 1_{(2)}$: $1_{(2)}$ cộng với $0_{(2)}$ bằng $1_{(2)}$.
2. $1_{(2)} + 1_{(2)} = 10_{(2)}$: $1_{(2)}$ cộng với $1_{(2)}$ vượt quá 2, theo quy tắc "đầy 2 nhớ 1", kết quả là $10_{(2)}$.
3. $10_{(2)} + 1_{(2)} = 11_{(2)}$.

### 1.2 Chuyển đổi số nhị phân

#### 1.2.1 Chuyển đổi từ nhị phân sang thập phân

Trong hệ thập phân, số $2749_{(10)}$ có thể hiểu là $2 \times 1000 + 7 \times 100 + 4 \times 10 + 9 \times 1$, tương đương với $2 \times 10^3 + 7 \times 10^2 + 4 \times 10^1 + 9 \times 10^0$, tức là $2000 + 700 + 40 + 9 = 2749_{(10)}$.

Tương tự, trong số nhị phân, $01101010_{(2)}$ có thể hiểu là $(0 \times 2^7) + (1 \times 2^6) + (1 \times 2^5) + (0 \times 2^4) + (1 \times 2^3) + (0 \times 2^2) + (1 \times 2^1) + (0 \times 2^0)$, tức là $0 + 64 + 32 + 0 + 8 + 0 + 2 + 0 = 106_{(10)}$.

Chúng ta có thể chuyển đổi một số nhị phân sang thập phân bằng cách này.

#### 1.2.2 Chuyển đổi từ thập phân sang nhị phân

Phương pháp chuyển đổi từ thập phân sang nhị phân là: **chia cho hai, lấy phần dư, sắp xếp ngược**.

Chúng ta lấy ví dụ với số thập phân $106_{(10)}$.

$\begin{aligned} 106 \div 2 = 53 & \text{ (dư 0)} \cr 53 \div 2 = 26 & \text{ (dư 1)} \cr 26 \div 2 = 13 & \text{ (dư 0)} \cr 13 \div 2 = 6 & \text{ (dư 1)} \cr 6 \div 2 = 3 & \text{ (dư 0)} \cr 3 \div 2 = 1 & \text{ (dư 1)} \cr 1 \div 2 = 0 & \text{ (dư 1)}  \cr 0 \div 2 = 0 & \text{ (dư 0)} \end{aligned}$

Chúng ta lấy ngược lại từng phần dư tính toán, ta được $01101010_{(2)}$.

## 2. Các phép toán cơ bản trên bit

Dựa trên hệ nhị phân, chúng ta có thể thực hiện các phép toán bit tương ứng trên số nhị phân. Có tổng cộng $6$ phép toán bit cơ bản, bao gồm: "Phép toán AND", "Phép toán OR", "Phép toán XOR", "Phép toán NOT", "Phép toán dịch trái" và "Phép toán dịch phải".

Ở đây, "Phép toán AND", "Phép toán OR", "Phép toán XOR", "Phép toán dịch trái" và "Phép toán dịch phải" là phép toán hai ngôi.

- "Phép toán AND", "Phép toán OR", "Phép toán XOR" là phép toán trên từng bit tương ứng của hai số nhị phân, tức là phép toán hai ngôi.
- "Phép toán dịch trái" và "Phép toán dịch phải" là phép toán dịch các bit của số nhị phân trái hoặc phải, với số bít dịch được chỉ định bên phải, và các bit mới được thêm vào là 0.

Còn "Phép toán NOT" là phép toán một ngôi, áp dụng lên một số nhị phân để đảo ngược từng bit của số đó.

Chúng ta hãy xem các quy tắc của $6$ phép toán bit này trước khi đi vào chi tiết.

| Toán tử              | Mô tả           | Quy tắc                                                                                      |
| ------------------- | -------------- | ----------------------------------------------------------------------------------------- |
| <code>&#124;</code> | Phép toán OR   | Chỉ cần có ít nhất một bit tương ứng là 1, kết quả sẽ là 1.                                     |
| `&`                 | Phép toán AND   | Chỉ khi cả hai bit tương ứng đều là 1, kết quả mới là 1.                                         |
| `<<`                | Phép toán dịch trái     | Dịch trái toàn bộ các bit của số nhị phân. `<<` chỉ định số bit dịch, bit cao bị bỏ đi, bit thấp được thêm vào là 0. |
| `>>`                | Phép toán dịch phải     | Dịch phải toàn bộ các bit của số nhị phân. `>>` chỉ định số bit dịch, bit thấp bị bỏ đi, bit cao được thêm vào là 0. |
| `^`                 | Phép toán XOR | Khi hai bit tương ứng khác nhau, kết quả là 1, khi hai bit tương ứng giống nhau, kết quả là 0.                        |
| `~`                 | Phép toán NOT     | Đảo ngược từng bit của số nhị phân, chuyển 1 thành 0 và 0 thành 1.                           |

### 2.1 Phép toán AND

> **Phép toán AND**: Toán tử AND là `&`. Chức năng của nó là thực hiện phép toán AND trên từng bit tương ứng của hai số nhị phân.

- **Quy tắc phép toán AND**: Chỉ khi cả hai bit tương ứng đều là 1, kết quả mới là 1.
  - `1 & 1 = 1`
  - `1 & 0 = 0`
  - `0 & 1 = 0`
  - `0 & 0 = 0`

Ví dụ, thực hiện phép toán AND trên số nhị phân $01111100_{(2)}$ và $00111110_{(2)}$, kết quả là $00111100_{(2)}$.

### 2.2 Phép toán OR

> **Phép toán OR**: Toán tử OR là `|`. Chức năng của nó là thực hiện phép toán OR trên từng bit tương ứng của hai số nhị phân.

- **Quy tắc phép toán OR**: Chỉ cần có ít nhất một bit tương ứng là 1, kết quả sẽ là 1.
  - `1 | 1 = 1`
  - `1 | 0 = 1`
  - `0 | 1 = 1`
  - `0 | 0 = 0`

Ví dụ, thực hiện phép toán OR trên số nhị phân $01001010_{(2)}$ và $01011011_{(2)}$, kết quả là $01011011_{(2)}$.

### 2.3 Phép toán XOR

> **Phép toán XOR**: Toán tử XOR là `^`. Chức năng của nó là thực hiện phép toán XOR trên từng bit tương ứng của hai số nhị phân.

- **Quy tắc phép toán XOR**: Khi hai bit tương ứng khác nhau, kết quả là 1, khi hai bit tương ứng giống nhau, kết quả là 0.
- `0 ^ 0 = 0`
  
- `1 ^ 0 = 1`
  
- `0 ^ 1 = 1`
  
- `1 ^ 1 = 0`

Ví dụ, thực hiện phép toán XOR trên số nhị phân $01001010_{(2)}$ và $01000101_{(2)}$, kết quả là $00001111_{(2)}$.

### 2.4 Phép toán NOT

> **Phép toán NOT**: Toán tử NOT là `~`. Chức năng của nó là đảo ngược từng bit của một số nhị phân.

- **Quy tắc phép toán NOT**: Đảo ngược từng bit của số nhị phân, chuyển 1 thành 0 và 0 thành 1.
  - `~0 = 1`
  - `~1 = 0`

Ví dụ, thực hiện phép toán NOT trên số nhị phân $01101010_{(2)}$, kết quả như hình dưới đây:

### 2.5 Phép toán dịch trái và dịch phải

> **Phép toán dịch trái (SHL)**: Toán tử dịch trái là `<<`. Chức năng của nó là dịch trái toàn bộ các bit của một số nhị phân (bit cao bị bỏ đi, bit thấp được thêm vào là 0).

Ví dụ, thực hiện phép toán dịch trái $1$ bit trên số nhị phân $01101010_{(2)}$, kết quả là $11010100_{(2)}$.

> **Phép toán dịch phải (SHR)**: Toán tử dịch phải là `>>`. Chức năng của nó là dịch phải toàn bộ các bit của một số nhị phân (bit thấp bị bỏ đi, bit cao được thêm vào là 0).

Ví dụ, thực hiện phép toán dịch phải $1$ bit trên số nhị phân $01101010_{(2)}$, kết quả là $00110101_{(2)}$.

## 3. Ứng dụng của phép toán bit

### 3.1 Các phép toán bit thông dụng

#### 3.1.1 Kiểm tra số chẵn lẻ

Một số nguyên là chẵn nếu và chỉ nếu bit cuối cùng của số đó là $0$. Tương tự, một số nguyên là lẻ nếu và chỉ nếu bit cuối cùng của số đó là $1$. Do đó, chúng ta có thể sử dụng phép toán AND với $1$ để kiểm tra xem một số có phải là chẵn hay lẻ.

1. `(x & 1) == 0` cho số chẵn.
2. `(x & 1) == 1` cho số lẻ.

#### 3.1.2 Lấy các bit cụ thể từ số nhị phân

Nếu chúng ta muốn lấy ra một số bit cụ thể từ một số nhị phân $X$, sao cho các bit lấy ra giữ nguyên giá trị ban đầu và các bit còn lại bằng $0$, chúng ta có thể sử dụng một số nhị phân khác $Y$, trong đó các bit tương ứng với vị trí lấy ra bằng $1$ và các bit còn lại bằng $0$. Sau đó, chúng ta thực hiện phép toán "AND bit" giữa hai số này (`X & Y`), từ đó ta có được số mong muốn.

Ví dụ, nếu chúng ta muốn lấy ra $4$ bit cuối cùng của số nhị phân $X = 01101010_{(2)}$, chúng ta chỉ cần thực hiện phép toán "AND bit" giữa $X = 01101010_{(2)}$ và $Y = 00001111_{(2)}$ (4 bit cuối cùng bằng $1$, các bit khác bằng $0$), tức là `01101010 & 00001111 == 00001010`. Kết quả `00001010` chính là số mong muốn (tức là $4$ bit cuối cùng của số nhị phân $01101010_{(2)}$).

#### 3.1.3 Đặt các bit cụ thể thành 1

Nếu chúng ta muốn đặt một số bit cụ thể trong một số nhị phân $X$ thành $1$, giữ nguyên giá trị ban đầu của các bit khác, chúng ta có thể sử dụng một số nhị phân khác $Y$, trong đó các bit tương ứng với vị trí được chọn bằng $1$ và các bit còn lại bằng $0$. Sau đó, chúng ta thực hiện phép toán "hoặc bit" giữa hai số này (`X | Y`), từ đó ta có được số mong muốn.

Ví dụ, nếu chúng ta muốn đặt $4$ bit cuối cùng của số nhị phân $X = 01101010_{(2)}$ thành $1$, giữ nguyên giá trị ban đầu của các bit khác, chúng ta chỉ cần thực hiện phép toán "OR bit" giữa $X = 01101010_{(2)}$ và $Y = 00001111_{(2)}$ (4 bit cuối cùng bằng $1$, các bit khác bằng $0$), tức là `01101010 | 00001111 = 01101111`. Kết quả `01101111` chính là số mong muốn (tức là $4$ bit cuối cùng của số nhị phân $01101010_{(2)}$ được đặt thành $1$, giữ nguyên giá trị ban đầu của các bit khác).

#### 3.1.4 Đảo ngược các bit cụ thể

Nếu chúng ta muốn đảo ngược một số bit cụ thể trong một số nhị phân $X$, chúng ta có thể sử dụng một số nhị phân khác $Y$, trong đó các bit tương ứng với vị trí được chọn bằng $1$ và các bit còn lại bằng $0$. Sau đó, chúng ta thực hiện phép toán "XOR bit" giữa hai số này (`X ^ Y`), từ đó ta có được số mong muốn.

Ví dụ, nếu chúng ta muốn đảo ngược $4$ bit cuối cùng của số nhị phân $X = 01101010_{(2)}$, chúng ta chỉ cần thực hiện phép toán "xor bit" giữa $X = 01101010_{(2)}$ và $Y = 00001111_{(2)}$ (4 bit cuối cùng bằng $1$, các bit khác bằng $0$), tức là `01101010 ^ 00001111 = 01100101`. Kết quả `01100101` chính là số mong muốn (tức là $4$ bit cuối cùng của số nhị phân $01101010_{(2)}$ được đảo ngược).

#### 3.1.5 Hoán đổi hai số

Chúng ta có thể sử dụng phép toán XOR để hoán đổi hai số (chỉ áp dụng cho việc hoán đổi hai số nguyên).

```python
a, b = 10, 20
a ^= b
b ^= a
a ^= b
print(a, b)
```

#### 3.1.6 Đặt bit cuối cùng có giá trị 1 trong số nhị phân thành 0

Nếu chúng ta muốn đặt bit cuối cùng có giá trị 1 của một số nhị phân $X$ thành $0$, chúng ta chỉ cần thực hiện phép toán `X & (X - 1)`.

Ví dụ, cho $X = 01101100_{(2)}$, $X - 1 = 01101011_{(2)}$, vì vậy `X & (X - 1) = 01101100 & 01101011 = 01101000`. Kết quả là $01101000_{(2)}$ (tức là bit phải nhất của $X$ được chuyển thành $0$).

#### 3.1.7 Đếm số bit 1 trong số nhị phân

Từ 3.1.6, chúng ta biết rằng bằng cách sử dụng phép toán `X & (X - 1)`, chúng ta có thể chuyển bit phải nhất của số nhị phân $X$ thành $0$. Nếu chúng ta tiếp tục thực hiện phép toán `X & (X - 1)` cho đến khi $X$ trở thành $0$, và đếm số lần thực hiện phép toán, chúng ta có thể tính được số bit bằng $1$ trong số nhị phân.

Code cụ thể như sau:

```python
class Solution:
    def hammingWeight(self, n: int) -> int:
        cnt = 0
        while n:
            n = n & (n - 1)
            cnt += 1
        return cnt
```

#### 3.1.8 Kiểm tra xem một số có phải là lũy thừa của 2 không

Bằng cách kiểm tra điều kiện `X & (X - 1) == 0`, chúng ta có thể xác định xem số $X$ có phải là một lũy thừa của $2$ hay không.

Điều này là vì:

1. Mọi lũy thừa của $2$ có một bit cao nhất bằng $1$ và tất cả các bit khác đều bằng $0$ trong biểu diễn nhị phân. Ví dụ: $4_{(10)} = 00000100_{(2)}$, $8_{(10)} = 00001000_{(2)}$.
2. Một số không phải là lũy thừa của $2$ nếu nó có nhiều hơn một bit bằng $1$ trong biểu diễn nhị phân. Ví dụ: $5_{(10)} = 00000101_{(2)}$, $6_{(10)} = 00000110_{(2)}$.

Tiếp theo, chúng ta sử dụng phép toán `X & (X - 1)` để chuyển bit phải nhất của số ban đầu thành $0$, và thu được giá trị mới:

1. Nếu số ban đầu là lũy thừa của $2$, sau khi thực hiện phép toán `X & (X - 1)`, giá trị mới sẽ có tất cả các bit bằng $0$, và giá trị mới sẽ là $0$.
2. Nếu số đó không phải là lũy thừa của $2$, sau khi thực hiện phép toán `X & (X - 1)`, giá trị mới vẫn có các bit khác $0$, và giá trị mới sẽ khác $0$.

Vì vậy, chúng ta có thể xác định xem số đó có phải là lũy thừa của $2$ hay không bằng cách kiểm tra xem giá trị mới có bằng $0$ hay không.

### 3.2 Tổng kết các phép toán thường dùng trong bit

| Chức năng                                 | Phép toán bit                                          | Ví dụ                      |
| ----------------------------------------- | ------------------------------------------------------- | ------------------------- |
| **Thay đổi bit cuối cùng `1` thành `0`**   | <code>x & (x - 1)</code>                                | `100101000 -> 100100000`  |
| **Bỏ đi các bit bên trái của bit `1` đầu tiên từ phải** | <code>x & (x ^ (x - 1))</code> hoặc <code>x & (-x)</code> | `100101000 -> 1000`       |
| **Bỏ đi bit cuối cùng**                    | <code>x &gt;&gt; 1</code>                               | `101101 -> 10110`         |
| **Lấy bit thứ `k` từ phải**                | <code>x &gt;&gt; (k - 1) & 1</code>                     | `1101101 -> 1, k = 4`     |
| **Lấy `3` bit cuối cùng**                   | <code>x & 7</code>                                      | `1101101 -> 101`          |
| **Lấy `k` bit cuối cùng**                   | <code>x & 15</code>                                     | `1101101 -> 1101, k = 4`  |
| **Chỉ giữ lại các bit `1` liên tiếp từ phải** | <code>(x ^ (x + 1)) &gt;&gt; 1</code>                   | `100101111 -> 1111`       |
| **Đảo bit thứ `k` từ phải**                | <code>x ^ (1 &lt;&lt; (k - 1))</code>                   | `101001 -> 101101, k = 3` |
| **Thêm một bit `0` vào cuối**              | <code>x &lt;&lt; 1</code>                               | `101101 -> 1011010`       |
| **Thêm một bit `1` vào cuối**              | <code>(x &lt;&lt; 1) + 1</code>                         | `101101 -> 1011011`       |
| **Đặt bit thứ `k` từ phải thành `0`**      | <code>x & ~(1 &lt;&lt; (k - 1))</code>                  | `101101 -> 101001, k = 3` |
| **Đặt bit thứ `k` từ phải thành `1`**      | <code>x &#124; (1 &lt;&lt; (k - 1))</code>              | `101001 -> 101101, k = 3` |
| **Đặt bit `0` đầu tiên từ phải thành `1`** | <code>x &#124; (x + 1)</code>                           | `100101111 -> 100111111`  |
| **Đặt các bit `0` liên tiếp từ phải thành `1`** | <code>x &#124; (x - 1)</code>                           | `11011000 -> 11011111`    |
| **Đặt các bit `1` liên tiếp từ phải thành `0`** | <code>x & (x + 1)</code>                                | `100101111 -> 100100000`  |
| **Đặt bit cuối cùng thành `0`**            | <code>x &#124; 1 - 1</code>                             | `101101 -> 101100`        |
| **Đặt bit cuối cùng thành `1`**            | <code>x &#124; 1</code>                                 | `101100 -> 101101`        |
| **Đặt `k` bit cuối cùng thành `1`**        | <code>x &#124; (1 &lt;&lt; k - 1)</code>                | `101001 -> 101111, k = 4` |
| **Đảo bit cuối cùng**                      | <code>x ^ 1</code>                                      | `101101 -> 101100`        |
| **Đảo `k` bit cuối cùng**                   | <code>x ^ (1 &lt;&lt; k - 1)</code>                     | `101001 -> 100110, k = 4` |

### 3.3 Liệt kê tập con bằng cách đếm nhị phân

Ngoài các phép toán thông thường đã đề cập ở trên, chúng ta thường sử dụng trạng thái $0$ hoặc $1$ của các bit từ $1$ đến $n$ trong một số nhị phân để biểu diễn một tập hợp gồm các phần tử từ $1$ đến $n$. Nghĩa là chúng ta sử dụng phép liệt kê nhị phân để liệt kê các tập con.

#### 3.3.1 Giới thiệu về phép liệt kê nhị phân

Hãy để tôi giới thiệu về khái niệm "tập con".

- **Tập con**: Nếu mọi phần tử của tập $A$ đều là phần tử của tập $S$, thì ta gọi tập $A$ là tập con của tập $S$. Ta có thể ký hiệu là $A \in S$.

Đôi khi chúng ta gặp phải vấn đề như sau: cho trước một tập $S$, hãy liệt kê tất cả các tập con có thể có của nó.

Có nhiều phương pháp để liệt kê các tập con, ở đây tôi giới thiệu một phương pháp đơn giản và hiệu quả: "Thuật toán liệt kê tập con theo hệ nhị phân".

Đối với một tập $S$ có $n$ phần tử, mỗi vị trí của mỗi phần tử có hai trạng thái: được chọn và không được chọn. Chúng ta có thể sử dụng số nhị phân có độ dài $n$ để biểu diễn tập $S$ hoặc tập con của $S$. Mỗi chữ số nhị phân tương ứng với trạng thái chọn hoặc không chọn của một phần tử trong tập. Với phần tử thứ $i$ trong tập, chữ số nhị phân tại vị trí tương ứng là $1$ đại diện cho việc chọn phần tử đó, và $0$ đại diện cho việc không chọn phần tử đó.

Ví dụ, với tập $S = \lbrace 5, 4, 3, 2, 1 \rbrace$ có độ dài $5$, chúng ta có thể sử dụng một số nhị phân có độ dài $5$ để biểu diễn tập đó.

Ví dụ, số nhị phân $11111_{(2)}$ biểu diễn việc chọn phần tử thứ $1$, $2$, $3$, $4$, $5$ trong tập, tức là tập $\lbrace 5, 4, 3, 2, 1 \rbrace$, tức là tập $S$ chính nó. Bảng dưới đây minh họa:

| Vị trí phần tử trong tập S |  5   |  4   |  3   |  2   |  1   |
| :----------------------- | :--: | :--: | :--: | :--: | :--: |
| Giá trị nhị phân tương ứng |  1   |  1   |  1   |  1   |  1   |
| Trạng thái tương ứng      | Chọn | Chọn | Chọn | Chọn | Chọn |

Ví dụ khác, số nhị phân $10101_{(2)}$ biểu diễn việc chọn phần tử thứ $1$, $3$, $5$ trong tập, tức là tập $\lbrace 5, 3, 1 \rbrace$. Bảng dưới đây minh họa:

| Vị trí phần tử trong tập S |  5   |   4    |  3   |   2    |  1   |
| :----------------------- | :--: | :----: | :--: | :----: | :--: |
| Giá trị nhị phân tương ứng |  1   |   0    |  1   |   0    |  1   |
| Trạng thái tương ứng      | Chọn | Không chọn | Chọn | Không chọn | Chọn |

Ví dụ khác, số nhị phân $01001_{(2)}$ biểu diễn việc chọn phần tử thứ $1$, $4$ trong tập, tức là tập $\lbrace 4, 1 \rbrace$. Bảng dưới đây minh họa:

| Vị trí phần tử trong tập S |   5    |  4   |   3    |   2    |  1   |
| :----------------------- | :----: | :--: | :----: | :----: | :--: |
| Giá trị nhị phân tương ứng |   0    |  1   |   0    |   0    |  1   |
| Trạng thái tương ứng      | Không chọn | Chọn | Không chọn | Không chọn | Chọn |

Từ những ví dụ trên, ta có thể suy ra: Đối với tập $S$ có độ dài $5$, chúng ta chỉ cần liệt kê từ $00000$ đến $11111$ (tương ứng với từ $0$ đến $2^n - 1$ ở hệ thập phân) một lần duy nhất để có được tất cả các tập con của tập $S$.

#### 3.3.2 Code liệt kê tập con bằng cách đếm nhị phân

```python
class Solution:
    def subsets(self, S):                   # Trả về tất cả các tập con của tập hợp S
        n = len(S)                          # n là số phần tử của tập hợp S
        sub_sets = []                       # sub_sets dùng để lưu trữ tất cả các tập con
        for i in range(1 << n):             # Liệt kê từ 0 đến 2^n - 1
            sub_set = []                    # sub_set dùng để lưu trữ tập con hiện tại
            for j in range(n):              # Liệt kê phần tử thứ i
                if i >> j & 1:              # Nếu bit thứ i được đặt thành 1, tức là chọn phần tử đó
                    sub_set.append(S[j])    # Thêm phần tử đã chọn vào tập con sub_set
            sub_sets.append(sub_set)        # Thêm tập con sub_set vào mảng tất cả các tập con sub_sets
        return sub_sets                     # Trả về tất cả các tập con
```
