---
title: Quick Python
tags: [python, programming]
categories: [python, programming]
date created: 2023-08-11
date modified: 2023-08-11
---

# Python Quick Start

## Trình thông dịch

Trên hệ điều hành Linux/Unix, trình thông dịch Python thường được cài đặt trong đường dẫn /usr/local/bin/python3.4 hoặc một đường dẫn hợp lệ khác.

Bạn có thể thêm đường dẫn /usr/local/bin vào biến môi trường của hệ điều hành Linux/Unix để có thể khởi động Python bằng cách nhập lệnh sau trong terminal:

```python
/usr/local/bin/python3.4
```

Trên hệ điều hành Linux/Unix, bạn có thể thêm các dòng sau vào đầu tập lệnh Python để tập lệnh Python có thể được thực thi trực tiếp như một tập lệnh SHELL:

```python
#! /usr/bin/env python3.4
```

## Chú thích

Python có ba dạng chú thích:

- Bắt đầu bằng ký tự `#`
- Bắt đầu bằng chuỗi `'''` và kết thúc bằng chuỗi `'''`
- Bắt đầu bằng chuỗi `"""` và kết thúc bằng chuỗi `"""`

```python
# Chú thích một dòng

'''
Đây là chú thích nhiều dòng, bắt đầu bằng ba dấu nháy đơn
Đây là chú thích nhiều dòng, bắt đầu bằng ba dấu nháy đơn
Đây là chú thích nhiều dòng, bắt đầu bằng ba dấu nháy đơn
'''

"""
Đây là chú thích nhiều dòng, bắt đầu bằng ba dấu nháy kép
Đây là chú thích nhiều dòng, bắt đầu bằng ba dấu nháy kép
Đây là chú thích nhiều dòng, bắt đầu bằng ba dấu nháy kép
"""
```

## Kiểu dữ liệu

Python3 có sáu kiểu dữ liệu chuẩn:

- Numbers (Số)
- String (Chuỗi)
- List (Danh sách)
- Tuple (Bộ)
- Sets (Tập hợp)
- Dictionaries (Từ điển)

## Toán tử

Ngôn ngữ Python hỗ trợ các loại toán tử sau:

- Toán tử số học
- Toán tử so sánh
- Toán tử gán giá trị
- Toán tử logic
- Toán tử bit
- Toán tử thành viên
- Toán tử định danh
- Thứ tự ưu tiên của toán tử

### Toán tử số học

| Toán tử | Mô tả                                           | Ví dụ                             |
| ------- | ---------------------------------------------- | --------------------------------- |
| +       | Cộng - Cộng hai đối tượng lại với nhau           | a + b trả về kết quả 31           |
| -       | Trừ - Lấy số âm hoặc trừ một số cho một số khác | a - b trả về kết quả -11          |
| \*      | Nhân - Nhân hai số hoặc trả về một chuỗi lặp lại | a \* b trả về kết quả 210         |
| /       | Chia - Chia x cho y                             | b / a trả về kết quả 2.1          |
| %       | Chia lấy dư - Trả về phần dư của phép chia       | b % a trả về kết quả 1            |
| \*\*    | Lũy thừa - Trả về x mũ y                        | a\*\*b trả về kết quả 10^21       |
| //      | Chia lấy phần nguyên - Trả về phần nguyên của x | 9//2 trả về kết quả 4, 9.0//2.0 trả về kết quả 4.0 |

### Toán tử so sánh

| Toán tử | Mô tả                                                                 | Ví dụ                   |
| ------- | -------------------------------------------------------------------- | ---------------------- |
| ==      | Bằng - So sánh xem hai đối tượng có bằng nhau không                     | (a == b) trả về False. |
| !=      | Khác - So sánh xem hai đối tượng có khác nhau không                     | (a != b) trả về True.  |
| >       | Lớn hơn - Trả về True nếu x lớn hơn y                                  | (a > b) trả về False.  |
| <       | Nhỏ hơn - Trả về True nếu x nhỏ hơn y                                  | (a < b) trả về True.   |
| >=      | Lớn hơn hoặc bằng - Trả về True nếu x lớn hơn hoặc bằng y               | (a >= b) trả về False. |
| <=      | Nhỏ hơn hoặc bằng - Trả về True nếu x nhỏ hơn hoặc bằng y               | (a <= b) trả về True.  |

### Toán tử gán giá trị

| Toán tử | Mô tả               | Ví dụ                                        |
| ------- | ------------------ | -------------------------------------------- |
| =       | Gán giá trị đơn giản | c = a + b gán giá trị của a + b cho c         |
| +=      | Gán giá trị cộng    | c += a tương đương với c = c + a               |
| -=      | Gán giá trị trừ     | c -= a tương đương với c = c - a               |
| \*=     | Gán giá trị nhân    | c _= a tương đương với c = c _ a               |
| /=      | Gán giá trị chia    | c /= a tương đương với c = c / a               |
| %=      | Gán giá trị chia dư | c %= a tương đương với c = c % a               |
| \*\*=   | Gán giá trị lũy thừa | c **= a tương đương với c = c ** a             |
| //=     | Gán giá trị chia lấy phần nguyên | c //= a tương đương với c = c // a |

### Toán tử bit

| Toán tử | Mô tả                                                                 | Ví dụ                                                |
| ------- | -------------------------------------------------------------------- | --------------------------------------------------- |
| &       | Toán tử AND - Trả về 1 nếu cả hai bit tương ứng đều là 1, ngược lại trả về 0 | (a & b) trả về kết quả 12, dạng nhị phân: 0000 1100   |
| \|      | Toán tử OR - Trả về 1 nếu một trong hai bit tương ứng là 1               | (a \| b) trả về kết quả 61, dạng nhị phân: 0011 1101 |
| ^       | Toán tử XOR - Trả về 1 nếu hai bit tương ứng khác nhau                   | (a ^ b) trả về kết quả 49, dạng nhị phân: 0011 0001  |
| \~      | Toán tử NOT - Đảo ngược các bit                                        | (\~a) trả về kết quả -61, dạng nhị phân: 1100 0011 |
| <<      | Toán tử dịch trái - Dịch tất cả các bit sang trái                        | a << 2 trả về kết quả 240, dạng nhị phân: 1111 0000 |
| >>      | Toán tử dịch phải - Dịch tất cả các bit sang phải                        | a >> 2 trả về kết quả 15, dạng nhị phân: 0000 1111  |

### Toán tử logic

| Toán tử | Biểu thức logic | Mô tả                                                                 | Ví dụ                            |
| ------- | -------------- | -------------------------------------------------------------------- | ------------------------------- |
| and     | x and y        | AND logic - Trả về giá trị True nếu x là False, ngược lại trả về giá trị y | (a and b) trả về kết quả 20       |
| or      | x or y         | OR logic - Trả về giá trị x nếu x là True, ngược lại trả về giá trị y   | (a or b) trả về kết quả 10        |
| not     | not x          | NOT logic - Trả về giá trị False nếu x là True, ngược lại trả về True  | not(a and b) trả về kết quả False |

### Toán tử thành viên

| Toán tử | Mô tả                                                                 | Ví dụ                                                  |
| ------- | -------------------------------------------------------------------- | ----------------------------------------------------- |
| in      | Trả về True nếu tìm thấy giá trị trong chuỗi hoặc danh sách              | x in y, nếu x có trong y trả về True                   |
| not in  | Trả về True nếu không tìm thấy giá trị trong chuỗi hoặc danh sách        | x not in y, nếu x không có trong y trả về True          |

### Toán tử định danh

| Toán tử | Mô tả                                        | Ví dụ                                                                 |
| ------- | ------------------------------------------- | -------------------------------------------------------------------- |
| is      | Trả về True nếu hai đối tượng cùng tham chiếu | x is y, nếu id(x) bằng id(y) thì **is** trả về kết quả True          |
| is not  | Trả về True nếu hai đối tượng không tham chiếu cùng một đối tượng | x is not y, nếu id(x) không bằng id(y) thì **is not** trả về kết quả True |

### Thứ tự ưu tiên của toán tử

| Toán tử                      | Mô tả                                                   |
| ---------------------------- | ------------------------------------------------------ |
| \*\*                         | Lũy thừa (ưu tiên cao nhất)                             |
| \~ + -                       | Đảo bit, toán tử một ngôi + và - (ưu tiên cuối cùng)     |
| \* / % //                    | Nhân, chia, chia lấy phần dư và chia lấy phần nguyên    |
| + -                          | Cộng và trừ                                            |
| >> <<                        | Dịch phải và dịch trái                                  |
| &                            | Bit AND                                                |
| ^ \|                         | Bit XOR và Bit OR                                      |
| <= < > >=                    | So sánh                                                |
| <> == !=                     | So sánh bằng                                           |
| = %= /= //= -= += \*= \*\*= | Gán giá trị                                            |
| is is not                    | Định danh                                              |
| in not in                    | Thành viên                                              |
| not                          | NOT logic                                              |
| and                          | AND logic                                              |
| or                           | OR logic                                               |

## Câu lệnh điều khiển

### Câu lệnh điều kiện

```python
if condition_1:
    statement_block_1
elif condition_2:
    statement_block_2
else:
    statement_block_3
```

### Câu lệnh lặp

#### Vòng lặp while

```python
while condition:
    statements
```

#### Vòng lặp for

```python
for <biến> in <dãy>:
  <câu lệnh>
```

#### Hàm range()

```python
for i in range(0, 10, 3):
    print(i)
```

#### Câu lệnh break và continue

- Câu lệnh break được sử dụng để thoát khỏi vòng lặp for và while.
- Câu lệnh continue được sử dụng để bỏ qua các câu lệnh còn lại trong khối lệnh hiện tại và tiếp tục vòng lặp tiếp theo.

#### Câu lệnh pass

Câu lệnh pass không làm gì cả. Nó chỉ được sử dụng khi cú pháp yêu cầu một câu lệnh nhưng chương trình không cần thực hiện bất kỳ hành động nào. Ví dụ:

```python
while True:
    pass  # Chờ đợi sự gián đoạn từ bàn phím (Ctrl+C)
```

## Hàm

Trong Python, chúng ta định nghĩa hàm bằng từ khóa def, với cú pháp chung như sau:

```python
def tên_hàm(tham_số):
    khối_lệnh
```

### Phạm vi biến trong hàm

```python
#!/usr/bin/env python3
a = 4  # Biến toàn cục

def print_func1():
    a = 17 # Biến cục bộ
    print("trong print_func a = ", a)
def print_func2():
    print("trong print_func a = ", a)
print_func1()
print_func2()
print("a = ", a)
```

Kết quả chạy của ví dụ trên như sau:

```python
trong print_func a =  17
trong print_func a =  4
a =  4
```

### Tham số từ khóa

Hàm cũng có thể được gọi bằng cách sử dụng các tham số từ khóa kwarg=value. Ví dụ, hàm sau:

```python
def parrot(voltage, state='a stiff', action='voom', type='Norwegian Blue'):
    print("-- Con vẹt này sẽ không", action, end=' ')
    print("nếu bạn đưa", voltage, "vôn qua nó.")
    print("-- Lông đẹp, loại", type)
    print("-- Nó đang", state, "!")
```

Có thể được gọi bằng các cách sau:

```python
parrot(1000)                                          # 1 tham số vị trí
parrot(voltage=1000)                                  # 1 tham số từ khóa
parrot(voltage=1000000, action='VOOOOOM')             # 2 tham số từ khóa
parrot(action='VOOOOOM', voltage=1000000)             # 2 tham số từ khóa
parrot('một triệu', 'không còn sức sống', 'nhảy')         # 3 tham số vị trí
parrot('một ngàn', state='đẩy lên đám hoa')  # 1 tham số vị trí, 1 tham số từ khóa
```

Dưới đây là các cách gọi sai:

```python
parrot()                     # thiếu tham số bắt buộc
parrot(voltage=5.0, 'chết')  # tham số không phải từ khóa sau một tham số từ khóa
parrot(110, voltage=220)     # giá trị trùng lặp cho cùng một tham số
parrot(actor='John Cleese')  # tham số từ khóa không xác định
```

### Danh sách tham số có thể thay đổi

Cuối cùng, một lựa chọn ít được sử dụng nhất là cho phép hàm gọi số lượng tham số có thể thay đổi. Các tham số này được đóng gói vào một tuple (xem về tuple và chuỗi). Trước các tham số có thể thay đổi này, có thể có từ không đến nhiều tham số thông thường:

```python
def arithmetic_mean(*args):
    sum = 0
    for x in args:
        sum += x
    return sum
```

### Giá trị trả về

Hàm trong Python trả về giá trị bằng cách sử dụng câu lệnh return, và có thể gán giá trị của hàm cho một biến cụ thể:

```python
def return_sum(x,y):
    c = x + y
    return c
```

## Xử lý ngoại lệ

Câu lệnh try được sử dụng để xử lý ngoại lệ theo cách sau:

- Đầu tiên, thực hiện khối lệnh try (các lệnh nằm giữa từ khóa try và từ khóa except).
- Nếu không có ngoại lệ xảy ra, các lệnh except sẽ được bỏ qua và khối lệnh try sẽ kết thúc.
- Nếu có ngoại lệ xảy ra trong quá trình thực hiện khối lệnh try, các phần còn lại của khối lệnh try sẽ bị bỏ qua. Nếu loại ngoại lệ trùng khớp với tên được chỉ định sau từ khóa except, khối lệnh except tương ứng sẽ được thực hiện. Cuối cùng, các lệnh sau câu lệnh try sẽ được thực hiện.
- Nếu một ngoại lệ không trùng khớp với bất kỳ except nào, ngoại lệ đó sẽ được chuyển tiếp cho câu lệnh try ở cấp trên.

```python
import sys

try:
    f = open('myfile.txt')
    s = f.readline()
    i = int(s.strip())
except OSError as err:
    print("Lỗi OS: {0}".format(err))
except ValueError:
    print("Không thể chuyển đổi dữ liệu thành số nguyên.")
except:
    print("Lỗi không xác định:", sys.exc_info()[0])
    raise
finally:
    # Các hành động dọn dẹp
```

### Ném ngoại lệ

Python sử dụng câu lệnh raise để ném một ngoại lệ cụ thể. Ví dụ:

```python
>>> raise NameError('HiThere')
Traceback (most recent call last):
  File "<stdin>", line 1, in ?
NameError: HiThere
```

### Tạo ngoại lệ tùy chỉnh

Bạn có thể tạo một lớp ngoại lệ tùy chỉnh bằng cách kế thừa từ lớp Exception. Ngoại lệ nên được kế thừa trực tiếp từ Exception hoặc từ các lớp kế thừa của Exception.

Khi tạo một module có thể gây ra nhiều loại ngoại lệ khác nhau, một phương pháp thông thường là tạo một lớp ngoại lệ cơ bản cho gói đó, sau đó tạo các lớp con khác nhau cho các trường hợp lỗi khác nhau:

```python
class Error(Exception):
    """Lớp cơ sở cho các ngoại lệ trong module này."""
    pass

class InputError(Error):
    """Ngoại lệ được ném khi có lỗi trong dữ liệu đầu vào.

    Thuộc tính:
        expression -- biểu thức đầu vào mà lỗi xảy ra
        message -- giải thích về lỗi
    """

    def __init__(self, expression, message):
        self.expression = expression
        self.message = message

class TransitionError(Error):
    """Ngoại lệ được ném khi một hoạt động cố gắng chuyển trạng thái không được phép.

    Thuộc tính:
        previous -- trạng thái trước khi chuyển
        next -- trạng thái mới được thử
        message -- giải thích về tại sao chuyển trạng thái cụ thể không được phép
    """

    def __init__(self, previous, next, message):
        self.previous = previous
        self.next = next
        self.message = message
```

Hầu hết các tên ngoại lệ đều kết thúc bằng "Error", giống như tên chuẩn của các ngoại lệ.

## Lập trình hướng đối tượng

### Giới thiệu về lập trình hướng đối tượng

- **Lớp (Class):** Mô tả một tập hợp các đối tượng có cùng thuộc tính và phương thức. Nó xác định các thuộc tính và phương thức chung của tập hợp đối tượng đó. Đối tượng là một thể hiện của lớp.
    
- **Biến lớp (Class variable):** Biến lớp là biến được chia sẻ giữa tất cả các thể hiện của lớp. Biến lớp được định nghĩa trong lớp nhưng bên ngoài bất kỳ phương thức nào. Biến lớp thường không được sử dụng như biến thể hiện.
    
- **Thành viên dữ liệu (Data member):** Biến lớp hoặc biến thể hiện được sử dụng để lưu trữ dữ liệu.
    
- **Phương thức ghi đè (Method overriding):** Nếu phương thức kế thừa không đáp ứng yêu cầu của lớp con, bạn có thể ghi đè phương thức đó để thay đổi cách thức hoạt động.
    
- **Biến thể hiện (Instance variable):** Biến thể hiện được định nghĩa trong phương thức và chỉ có giá trị cho thể hiện hiện tại của lớp.
    
- **Kế thừa (Inheritance):** Kế thừa là quá trình một lớp con kế thừa các thuộc tính và phương thức từ một lớp cha. Điều này giúp tái sử dụng mã và tạo ra mối quan hệ "is-a" giữa các lớp.
    
- **Phương thức (Method):** Phương thức là một hàm được định nghĩa trong lớp và được sử dụng để thực hiện các hành động trên đối tượng của lớp.
    
- **Đối tượng (Object):** Thể hiện của một lớp. Đối tượng bao gồm hai thành phần: các biến lớp và các phương thức.

### Định nghĩa lớp

Cú pháp của lớp như sau:

```python
class ClassName:
    <statement-1>
    .
    .
    .
    <statement-N>
```

Sau khi khởi tạo một lớp, bạn có thể truy cập vào các thuộc tính của nó. Thực tế, sau khi tạo một lớp, bạn có thể truy cập vào các thuộc tính của nó bằng tên của lớp.

### Đối tượng lớp

Đối tượng lớp hỗ trợ hai loại hoạt động: tham chiếu thuộc tính và khởi tạo.

Tham chiếu thuộc tính được sử dụng với cú pháp tiêu chuẩn giống như việc tham chiếu thuộc tính trong Python: **obj.name**.

Sau khi tạo đối tượng lớp, tất cả các tên trong không gian tên của lớp đều là tên thuộc tính hợp lệ. Vì vậy, nếu định nghĩa lớp như sau:

```python
#!/usr/bin/python3

class MyClass:
    """Một ví dụ đơn giản về lớp"""
    i = 12345
    def f(self):
        return 'hello world'

# Khởi tạo lớp
x = MyClass()

# Truy cập thuộc tính và phương thức của lớp
print("Thuộc tính i của lớp MyClass là:", x.i)
print("Phương thức f của lớp MyClass trả về:", x.f())
```

Khởi tạo lớp:

```python
# Khởi tạo lớp
x = MyClass()
# Truy cập thuộc tính và phương thức của lớp
```

Trên đây đã tạo một đối tượng lớp mới và gán đối tượng này cho biến cục bộ x, x là một đối tượng trống.

Kết quả khi thực thi chương trình là:

```
Thuộc tính i của lớp MyClass là: 12345
Phương thức f của lớp MyClass trả về: hello world
```

Nhiều lớp thường có xu hướng tạo đối tượng với trạng thái ban đầu. Vì vậy, lớp có thể định nghĩa một phương thức đặc biệt có tên là **init**() (phương thức khởi tạo), như sau:

```python
def __init__(self):
    self.data = []
```

Nếu lớp định nghĩa phương thức **init**(), thì hoạt động khởi tạo lớp sẽ tự động gọi phương thức **init**(). Vì vậy, trong ví dụ dưới đây, bạn có thể tạo một đối tượng mới như sau:

```python
x = MyClass()
```

Tất nhiên, phương thức **init**() có thể có tham số và tham số được truyền vào hoạt động khởi tạo lớp. Ví dụ:

```python
>>> class Complex:
...     def __init__(self, phanThuc, phanAo):
...         self.thuc = phanThuc
...         self.ao = phanAo
...
>>> x = Complex(3.0, -4.5)
>>> x.thuc, x.ao
(3.0, -4.5)
```

### Phương thức của lớp

Trong phạm vi nội bộ của lớp, sử dụng từ khóa def có thể định nghĩa một phương thức cho lớp. Khác với việc định nghĩa hàm thông thường, phương thức của lớp phải bao gồm tham số self và phải là tham số đầu tiên:

```python
#!/usr/bin/python3

# Định nghĩa lớp
class People:
    # Định nghĩa thuộc tính cơ bản
    name = ''
    age = 0
    # Định nghĩa thuộc tính riêng tư, thuộc tính riêng tư không thể truy cập trực tiếp từ bên ngoài lớp
    __weight = 0
    # Định nghĩa phương thức khởi tạo
    def __init__(self, n, a, w):
        self.name = n
        self.age = a
        self.__weight = w
    def speak(self):
        print("%s nói: Tôi %d tuổi." %(self.name, self.age))

# Khởi tạo lớp
p = People('W3Cschool', 10, 30)
p.speak()
```

Kết quả khi thực thi chương trình là:

```
W3Cschool nói: Tôi 10 tuổi.
```

### Kế thừa

Python cũng hỗ trợ kế thừa lớp, nếu một ngôn ngữ không hỗ trợ kế thừa, thì lớp không có ý nghĩa gì. Định nghĩa lớp con như sau:

```python
class DerivedClassName(BaseClassName1):
    <statement-1>
    .
    .
    .
    <statement-N>
```

Lưu ý về thứ tự các lớp cơ sở trong dấu ngoặc tròn, nếu các lớp cơ sở có cùng tên phương thức và lớp con không chỉ định, Python sẽ tìm kiếm từ trái sang phải để tìm phương thức.

BaseClassName (tên lớp cơ sở trong ví dụ) phải nằm trong cùng một phạm vi với lớp con. Ngoài ra, bạn cũng có thể sử dụng biểu thức, đặc biệt hữu ích khi lớp cơ sở được định nghĩa trong một Module khác:

```python
class DerivedClassName(modname.BaseClassName):
```

**Ví dụ**

```python
#!/usr/bin/python3

# Định nghĩa lớp
class People:
    # Định nghĩa thuộc tính cơ bản
    name = ''
    age = 0
    # Định nghĩa thuộc tính riêng tư, không thể truy cập từ bên ngoài lớp
    __weight = 0
    # Định nghĩa phương thức khởi tạo
    def __init__(self, n, a, w):
        self.name = n
        self.age = a
        self.__weight = w
    def speak(self):
        print("%s nói: Tôi %d tuổi." %(self.name, self.age))

# Kế thừa đơn giản
class Student(People):
    grade = ''
    def __init__(self, n, a, w, g):
        # Gọi phương thức khởi tạo của lớp cha
        People.__init__(self, n, a, w)
        self.grade = g
    # Ghi đè phương thức của lớp cha
    def speak(self):
        print("%s nói: Tôi %d tuổi, tôi đang học lớp %d" %(self.name, self.age, self.grade))

s = Student('ken', 10, 60, 3)
s.speak()
```

Kết quả khi thực thi chương trình là:

```
ken nói: Tôi 10 tuổi, tôi đang học lớp 3
```

### Đa kế thừa

Python cũng hỗ trợ hạn chế đa kế thừa. Định nghĩa lớp đa kế thừa như ví dụ dưới đây:

```python
class DerivedClassName(Base1, Base2, Base3):
    <statement-1>
    .
    .
    .
    <statement-N>
```

Lưu ý về thứ tự các lớp cơ sở trong dấu ngoặc tròn, nếu các lớp cơ sở có cùng tên phương thức và lớp con không chỉ định, Python sẽ tìm kiếm từ trái sang phải để tìm phương thức.

```python
#!/usr/bin/python3

# Định nghĩa lớp
class People:
    # Định nghĩa thuộc tính cơ bản
    name = ''
    age = 0
    # Định nghĩa thuộc tính riêng tư, không thể truy cập từ bên ngoài lớp
    __weight = 0
    # Định nghĩa phương thức khởi tạo
    def __init__(self, n, a, w):
        self.name = n
        self.age = a
        self.__weight = w
    def speak(self):
        print("%s nói: Tôi %d tuổi." %(self.name, self.age))

# Kế thừa đơn giản
class Student(People):
    grade = ''
    def __init__(self, n, a, w, g):
        # Gọi phương thức khởi tạo của lớp cha
        People.__init__(self, n, a, w)
        self.grade = g
    # Ghi đè phương thức của lớp cha
    def speak(self):
        print("%s nói: Tôi %d tuổi, tôi đang học lớp %d" %(self.name, self.age, self.grade))

# Lớp khác, chuẩn bị cho đa kế thừa
class Speaker():
    topic = ''
    name = ''
    def __init__(self, n, t):
        self.name = n
        self.topic = t
    def speak(self):
        print("Tôi tên là %s, tôi là một diễn giả, chủ đề diễn thuyết của tôi là %s" %(self.name, self.topic))

# Đa kế thừa
class Sample(Speaker, Student):
    a =''
    def __init__(self, n, a, w, g, t):
        Student.__init__(self, n, a, w, g)
        Speaker.__init__(self, n, t)

test = Sample("Tim", 25, 80, 4, "Python")
test.speak()   # Gọi phương thức của lớp cha đứng trước trong danh sách, mặc định gọi phương thức của lớp cha đứng trước
```

Kết quả khi thực thi chương trình là:

```
Tôi tên là Tim, tôi là một diễn giả, chủ đề diễn thuyết của tôi là Python
```

### Ghi đè phương thức

Nếu phương thức của lớp cha không đáp ứng được yêu cầu của bạn, bạn có thể ghi đè phương thức của lớp cha trong lớp con. Ví dụ:

```python
#!/usr/bin/python3

class Parent:        # Định nghĩa lớp cha
   def myMethod(self):
      print ('Gọi phương thức của lớp cha')

class Child(Parent): # Định nghĩa lớp con
   def myMethod(self):
      print ('Gọi phương thức của lớp con')

c = Child()          # Tạo một đối tượng của lớp con
c.myMethod()         # Gọi phương thức ghi đè trong lớp con
```

Kết quả khi thực thi chương trình là:

```
Gọi phương thức của lớp con
```

### Thuộc tính và phương thức của lớp

#### Thuộc tính riêng tư của lớp

**\_\_private_attrs**: Bắt đầu bằng hai dấu gạch dưới, khai báo thuộc tính này là thuộc tính riêng tư, không thể sử dụng hoặc truy cập trực tiếp từ bên ngoài lớp. Trong các phương thức bên trong lớp, sử dụng **self.\_\_private_attrs**.

#### Phương thức của lớp

Trong phạm vi nội bộ của lớp, sử dụng từ khóa def để định nghĩa một phương thức cho lớp. Khác với việc định nghĩa hàm thông thường, phương thức của lớp phải bao gồm tham số self và phải là tham số đầu tiên.

#### Phương thức riêng tư của lớp

**\_\_private_method**: Bắt đầu bằng hai dấu gạch dưới, khai báo phương thức này là phương thức riêng tư, không thể gọi từ bên ngoài lớp. Trong lớp, gọi **self.\_\_private_methods** để sử dụng phương thức này.

Ví dụ:

```python
#!/usr/bin/python3

class JustCounter:
    __secretCount = 0  # Thuộc tính riêng tư
    publicCount = 0    # Thuộc tính công khai

    def count(self):
        self.__secretCount += 1
        self.publicCount += 1
        print(self.__secretCount)

counter = JustCounter()
counter.count()
counter.count()
print(counter.publicCount)
print(counter.__secretCount)  # Lỗi, không thể truy cập thuộc tính riêng tư từ bên ngoài lớp
```

Kết quả khi thực thi chương trình là:

```
1
2
2
Traceback (most recent call last):
  File "test.py", line 16, in <module>
    print(counter.__secretCount)  # Lỗi, không thể truy cập thuộc tính riêng tư từ bên ngoài lớp
AttributeError: 'JustCounter' object has no attribute '__secretCount'
```

#### Phương thức đặc biệt của lớp:

- \_\_init__: Phương thức khởi tạo, được gọi khi tạo đối tượng
- \_\_del__: Phương thức hủy, được sử dụng khi giải phóng đối tượng
- \_\_repr__: Phương thức in, chuyển đổi
- \_\_setitem__: Gán giá trị theo chỉ mục
- \_\_getitem__: Lấy giá trị theo chỉ mục
- \_\_len__: Lấy độ dài
- \_\_cmp__: So sánh
- \_\_call__: Gọi như một hàm
- \_\_add__: Phép cộng
- \_\_sub__: Phép trừ
- \_\_mul__: Phép nhân
- \_\_div__: Phép chia
- \_\_mod__: Phép chia lấy dư
- \_\_pow__: Phép lũy thừa

#### Nạp chồng toán tử

Python cũng hỗ trợ nạp chồng toán tử, bạn có thể nạp chồng các phương thức đặc biệt của lớp để thực hiện các phép toán. Ví dụ:

```python
#!/usr/bin/python3

class Vector:
   def __init__(self, a, b):
      self.a = a
      self.b = b

   def __str__(self):
      return 'Vector (%d, %d)' % (self.a, self.b)

   def __add__(self,other):
      return Vector(self.a + other.a, self.b + other.b)

v1 = Vector(2,10)
v2 = Vector(5,-2)
print(v1 + v2)
```

Kết quả khi thực thi chương trình là:

```
Vector(7,8)
```

## Tổng quan về thư viện tiêu chuẩn

### Giao diện hệ điều hành

Module os cung cấp nhiều hàm liên quan đến hệ điều hành.

```python
>>> import os
>>> os.getcwd()      # Trả về thư mục làm việc hiện tại
'C:\\Python34'
>>> os.chdir('/server/accesslogs')   # Thay đổi thư mục làm việc hiện tại
>>> os.system('mkdir today')   # Thực thi lệnh hệ thống mkdir
0
```

### Ký tự đại diện tệp

Module glob cung cấp một hàm để tạo danh sách tệp từ việc tìm kiếm đại diện tệp trong thư mục:

```python
>>> import glob
>>> glob.glob('*.py')
['primes.py', 'random.py', 'quote.py']
```

### Tham số dòng lệnh

Các tập lệnh công cụ chung thường gọi các tham số dòng lệnh. Các tham số dòng lệnh này được lưu trữ dưới dạng danh sách trong biến argv của Module sys. Ví dụ, sau khi thực thi `python demo.py one two three` trong dòng lệnh, bạn sẽ nhận được kết quả sau:

```python
>>> import sys
>>> print(sys.argv)
['demo.py', 'one', 'two', 'three']
```

### Định hướng đầu ra lỗi và kết thúc chương trình

sys cũng có các thuộc tính stdin, stdout và stderr, ngay cả khi stdout được chuyển hướng, bạn vẫn có thể sử dụng stderr để hiển thị cảnh báo và thông báo lỗi.

```python
>>> sys.stderr.write('Cảnh báo, không tìm thấy tệp nhật ký, bắt đầu tạo mới\n')
Cảnh báo, không tìm thấy tệp nhật ký, bắt đầu tạo mới
```

### Kết hợp chuỗi với biểu thức chính quy

Module re cung cấp các công cụ biểu thức chính quy cho xử lý chuỗi nâng cao. Biểu thức chính quy cung cấp một giải pháp ngắn gọn và tối ưu cho việc tìm kiếm và xử lý phức tạp:

```python
>>> import re
>>> re.findall(r'\bf[a-z]*', 'which foot or hand fell fastest')
['foot', 'fell', 'fastest']
>>> re.sub(r'(\b[a-z]+) \1', r'\1', 'cat in the the hat')
'cat in the hat'
```

### Toán học

Module math cung cấp truy cập vào các hàm thư viện C cơ bản cho phép tính toán dấu phẩy động:

```python
>>> import math
>>> math.cos(math.pi / 4)
0.70710678118654757
>>> math.log(1024, 2)
10.0
```

# Tài liệu tham khảo

- https://github.com/vinta/awesome-python - Tài nguyên tuyệt vời
- https://github.com/scrapy/scrapy - Framework web crawler Python
- https://github.com/faif/python-patterns - Mẫu thiết kế Python
- https://github.com/kennethreitz/python-guide - Thực hành tốt nhất với Python
