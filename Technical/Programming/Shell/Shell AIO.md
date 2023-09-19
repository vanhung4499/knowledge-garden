---
title: Shell AIO
tags:
  - shell
  - programming
categories: shell, programming
date created: 2023-09-04
date modified: 2023-09-04
---

# Shell AIO

> Vì bash là trình thông dịch shell mặc định của Linux, có thể nói bash là cơ sở của lập trình shell.
>
> _Bài viết này tập trung giới thiệu cú pháp của bash, không giới thiệu bất kỳ lệnh Linux nào_.

```
███████╗██╗  ██╗███████╗██╗     ██╗
██╔════╝██║  ██║██╔════╝██║     ██║
███████╗███████║█████╗  ██║     ██║
╚════██║██╔══██║██╔══╝  ██║     ██║
███████║██║  ██║███████╗███████╗███████╗
```

## Giới thiệu

### Shell là gì

- Shell là một chương trình được viết bằng ngôn ngữ C, nó là cầu nối giữa người dùng và Linux.
- Shell vừa là ngôn ngữ lệnh, vừa là ngôn ngữ lập trình.
- Shell chỉ một loại ứng dụng, ứng dụng này cung cấp một giao diện, người dùng sử dụng giao diện này để truy cập vào dịch vụ của nhân Linux.

Sh là loại Shell Unix đầu tiên của Ken Thompson, Windows Explorer là một loại Shell giao diện đồ họa điển hình.

### Shell script là gì

Shell script (shell script) là một loại chương trình kịch bản được viết cho shell, thường có phần mở rộng tệp là `.sh`.

Trong ngành công nghiệp, shell thường chỉ đề cập đến shell script, nhưng shell và shell script là hai khái niệm khác nhau.

### Môi trường Shell

Lập trình Shell giống như lập trình Java, PHP, chỉ cần một trình soạn thảo văn bản để viết mã và một trình thông dịch mã lệnh để thực thi.

Có nhiều loại trình thông dịch Shell, phổ biến nhất là:

- [sh](https://www.gnu.org/software/bash/) - Bourne Shell. sh là shell mặc định của Unix.
- [bash](https://www.gnu.org/software/bash/) - Bourne Again Shell. bash là shell mặc định của Linux.
- [fish](https://fishshell.com/) - Shell dòng lệnh thông minh và thân thiện với người dùng.
- [xiki](http://xiki.org/) - Làm cho giao diện điều khiển shell thân thiện hơn và mạnh mẽ hơn.
- [zsh](http://www.zsh.org/) - Shell và ngôn ngữ kịch bản mạnh mẽ.

#### Chỉ định trình thông dịch kịch bản

Trong shell script, `#!` cho biết chương trình được chỉ định sau đường dẫn là trình thông dịch shell để thực thi tệp script. `#!` được gọi là [shebang (còn được gọi là Hashbang)](https://en.wikipedia.org/wiki/Shebang_(Unix)).

Vì vậy, bạn có thể thấy các chú thích như sau trong shell:

- Chỉ định trình thông dịch sh

```shell
#!/bin/sh
```

- Chỉ định trình thông dịch bash

```shell
#!/bin/bash
```

> **Chú ý**
>
> Cách chỉ định trình thông dịch trên là phổ biến, nhưng đôi khi bạn cũng có thể thấy cách sau:
>
> ```shell
> #!/usr/bin/env bash
> ```
>
> Lợi ích của cách này là hệ thống sẽ tự động tìm chương trình bạn chỉ định (trong trường hợp này là `bash`) trong biến môi trường `PATH`. So với cách đầu tiên, bạn nên sử dụng cách này nếu có thể, vì đường dẫn của chương trình là không xác định. Cách viết này cũng có một lợi ích khác, biến môi trường `PATH` của hệ điều hành có thể được cấu hình để trỏ đến phiên bản khác của chương trình. Ví dụ, sau khi cài đặt phiên bản mới của `bash`, chúng tôi có thể thêm đường dẫn của nó vào `PATH` để "ẩn" phiên bản cũ. Nếu bạn sử dụng `#!/bin/bash`, hệ thống sẽ chọn phiên bản cũ của `bash` để thực thi tệp script, trong khi nếu bạn sử dụng `#!/usr/bin/env bash`, nó sẽ sử dụng phiên bản mới hơn.

### Chế độ

Shell có hai chế độ là tương tác và không tương tác.

#### Chế độ tương tác

> Đơn giản mà nói, bạn có thể hiểu chế độ tương tác của shell là thực thi dòng lệnh.

Khi bạn thấy điều sau đây, điều đó cho thấy shell đang ở chế độ tương tác:

```shell
user@host:~$
```

Sau đó, bạn có thể nhập một chuỗi lệnh Linux như `ls`, `grep`, `cd`, `mkdir`, `rm`, v.v.

#### Chế độ không tương tác

> Đơn giản mà nói, bạn có thể hiểu chế độ không tương tác của shell là thực thi shell script.

Trong chế độ không tương tác, shell đọc lệnh từ tệp tin hoặc ống và thực thi.

Khi trình thông dịch shell thực thi xong lệnh cuối cùng trong tệp tin, quá trình shell kết thúc và trở lại quá trình cha.

Bạn có thể sử dụng các lệnh sau để chạy shell ở chế độ không tương tác:

```shell
sh /path/to/script.sh
bash /path/to/script.sh
source /path/to/script.sh
./path/to/script.sh
```

Trong ví dụ trên, `script.sh` là một tệp văn bản thông thường chứa các lệnh mà trình thông dịch shell có thể nhận dạng và thực thi, `sh` và `bash` là các chương trình trình thông dịch shell. Bạn có thể sử dụng bất kỳ trình soạn thảo nào bạn thích để tạo `script.sh` (vim, nano, Sublime Text, Atom, v.v.).

Ngoài ra, bạn cũng có thể sử dụng lệnh `chmod` để cấp quyền thực thi cho tệp tin và chạy tệp tin script trực tiếp:

```shell
chmod +x /path/to/script.sh # Cấp quyền thực thi cho script
/path/to/test.sh
```

Cách tiếp cận này yêu cầu dòng đầu tiên của tệp tin script chỉ định chương trình chạy script đó, ví dụ:

**💻 『Mã nguồn minh họa』**

```shell
#!/usr/bin/env bash
echo "Hello, world!"
```

Trong ví dụ trên, chúng ta sử dụng lệnh `echo` hữu ích để in ra chuỗi lên màn hình.

## Cú pháp cơ bản

### Trình thông dịch

Mặc dù đã đề cập đến `#!` hai lần trước đó, nhưng để đảm bảo rằng điều quan trọng được nói ba lần, tôi sẽ nhấn mạnh một lần nữa:

Trong shell script, `#!` cho biết chương trình được chỉ định sau đường dẫn là trình thông dịch shell để thực thi tệp script. `#!` được gọi là [shebang (còn được gọi là Hashbang)](https://zh.wikipedia.org/wiki/Shebang).

`#!` xác định rằng tệp script có thể được thực thi như một tệp tin thực thi độc lập, mà không cần nhập `sh`, `bash`, `python`, `php`, v.v. vào trước dòng lệnh đó.

```shell
# Cả hai cách sau đây đều có thể chỉ định trình thông dịch shell là bash, cách thứ hai tốt hơn
#!/bin/bash
#!/usr/bin/env bash
```

### Chú thích

Chú thích giúp giải thích mã của bạn có tác dụng gì và tại sao lại viết như vậy.

Trong cú pháp shell, chú thích là một loại câu lệnh đặc biệt, được bỏ qua bởi trình thông dịch shell.

- Chú thích một dòng - Bắt đầu bằng `#` và kết thúc ở cuối dòng.
- Chú thích nhiều dòng - Bắt đầu bằng `:<<EOF` và kết thúc ở `EOF`.

**💻 『Mã nguồn minh họa』**

```shell
#--------------------------------------------
# Ví dụ chú thích trong shell
#--------------------------------------------

# echo 'Đây là chú thích một dòng'

########## Đây là dòng phân cách ##########

:<<EOF
echo 'Đây là chú thích nhiều dòng'
echo 'Đây là chú thích nhiều dòng'
echo 'Đây là chú thích nhiều dòng'
EOF
```

### echo

echo được sử dụng để in ra chuỗi.

In ra chuỗi thông thường:

```shell
echo "hello, world"
# Output: hello, world
```

In ra chuỗi chứa biến:

```shell
echo "hello, \"hung\""
# Output: hello, "hung"
```

In ra chuỗi chứa biến:

```shell
name=hung
echo "hello, \"${name}\""
# Output: hello, "hung"
```

In ra chuỗi chứa ký tự xuống dòng:

```shell
# In ra chuỗi chứa ký tự xuống dòng
echo "YES\nNO"
#  Output: YES\nNO

echo -e "YES\nNO" # -e bật chế độ escape
#  Output:
#  YES
#  NO
```

In ra chuỗi mà không xuống dòng:

```shell
echo "YES"
echo "NO"
#  Output:
#  YES
#  NO

echo -e "YES\c" # -e bật chế độ escape \c không xuống dòng
echo "NO"
#  Output:
#  YESNO
```

Định hướng đầu ra vào tệp tin:

```shell
echo "test" > test.txt
```

In ra kết quả thực thi:

```shell
echo `pwd`
#  Output:(đường dẫn thư mục hiện tại)
```

**💻 『Mã nguồn minh họa』**

```shell
#!/usr/bin/env bash

# In ra chuỗi thông thường
echo "hello, world"
#  Output: hello, world

# In ra chuỗi chứa biến
echo "hello, \"hung\""
#  Output: hello, "hung"

# In ra chuỗi chứa biến
name=hung
echo "hello, \"${name}\""
#  Output: hello, "hung"

# In ra chuỗi chứa ký tự xuống dòng
echo "YES\nNO"
#  Output: YES\nNO
echo -e "YES\nNO" # -e bật chế độ escape
#  Output:
#  YES
#  NO

# In ra chuỗi mà không xuống dòng
echo "YES"
echo "NO"
#  Output:
#  YES
#  NO

echo -e "YES\c" # -e bật chế độ escape \c không xuống dòng
echo "NO"
#  Output:
#  YESNO

# Định hướng đầu ra vào tệp tin
echo "test" > test.txt

# In ra kết quả thực thi
echo `pwd`
#  Output:(đường dẫn thư mục hiện tại)

```

### printf

printf được sử dụng để định dạng chuỗi đầu ra.

Mặc định, printf không tự động thêm ký tự xuống dòng như echo, nếu cần xuống dòng, bạn có thể thêm `\n` thủ công.

**💻 『Mã nguồn minh họa』**

```shell
# Dùng dấu nháy đơn
printf '%d %s\n' 1 "abc"
#  Output:1 abc

# Dùng dấu nháy kép
printf "%d %s\n" 1 "abc"
#  Output:1 abc

# Không dùng dấu nháy
printf %s abcdef
#  Output: abcdef(Không xuống dòng)

# Định dạng chỉ định một tham số, nhưng các tham số thừa vẫn được định dạng theo cách đó
printf "%s\n" abc def
#  Output:
#  abc
#  def

printf "%s %s %s\n" a b c d e f g h i j
#  Output:
#  a b c
#  d e f
#  g h i
#  j

# Nếu không có tham số, %s được thay thế bằng NULL, %d được thay thế bằng 0
printf "%s and %d \n"
#  Output:
#   and 0

# Định dạng đầu ra
printf "%-10s %-10s %-10s\n" Tên Giới\ tính Cân\ nặng
printf "%-10s %-10s %-10.2f\n" Hung Nam 66.1234
printf "%-10s %-10s %-10.2f\n" Phong Nam 48.6543
printf "%-10s %-10s %-10.2f\n" Na Nữ 47.9876
#  Output:
#  Tên        Giới tính  Cân nặng
#  Hung       Nam        66.12
#  Phong      Nam        48.65
#  Na         Nữ         47.99
```

#### Các ký tự thoát của printf

| Chuỗi   | Mô tả                                                                                                                                                                                          |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `\a`    | Ký tự cảnh báo, thường là ký tự BEL ASCII                                                                                                                                                      |
| `\b`    | Ký tự backspace                                                                                                                                                                                |
| `\c`    | Không hiển thị ký tự xuống dòng cuối cùng trong kết quả đầu ra (chỉ có hiệu lực trong chuỗi tham số của định dạng %b) và bỏ qua bất kỳ ký tự, tham số tiếp theo và ký tự trong chuỗi định dạng |
| `\f`    | Ký tự xuống trang (formfeed)                                                                                                                                                                   |
| `\n`    | Ký tự xuống dòng                                                                                                                                                                               |
| `\r`    | Ký tự carriage return                                                                                                                                                                          |
| `\t`    | Ký tự tab ngang                                                                                                                                                                                |
| `\v`    | Ký tự tab dọc                                                                                                                                                                                  |
| `\\`    | Ký tự backslash chính nó                                                                                                                                                                       |
| `\ddd`  | Ký tự đại diện cho giá trị bát phân từ 1 đến 3 chữ số. Chỉ có hiệu lực trong chuỗi định dạng                                                                                                   |
| `\0ddd` | Ký tự đại diện cho giá trị bát phân từ 1 đến 3 chữ số                                                                                                                                          |

## Biến

Giống như nhiều ngôn ngữ lập trình khác, bạn có thể tạo biến trong bash.

Trong bash, không có kiểu dữ liệu cụ thể. Biến trong bash có thể lưu trữ một số, một ký tự, một chuỗi và nhiều hơn nữa. Bạn không cần phải khai báo biến trước, gán giá trị cho biến sẽ tự động tạo biến.

### Quy tắc đặt tên biến

- Tên biến chỉ có thể sử dụng chữ cái, số và dấu gạch dưới, ký tự đầu tiên không thể là số.
- Không có khoảng trắng, có thể sử dụng dấu gạch dưới (\_) thay thế.
- Không sử dụng các ký tự đặc biệt.
- Không sử dụng các từ khóa của bash (có thể sử dụng lệnh `help` để xem từ khóa được bảo lưu).

### Khai báo biến

Cú pháp truy cập biến là: `${var}` và `$var`.

Dấu ngoặc nhọn bên ngoài tên biến là tùy chọn, có thể có hoặc không, nhưng nên sử dụng dấu ngoặc nhọn để giúp trình thông dịch nhận biết ranh giới của biến, vì vậy khuyến nghị sử dụng dấu ngoặc nhọn.

```shell
word="hello"
echo ${word}
# Output: hello
```

### Biến chỉ đọc

Bạn có thể sử dụng lệnh `readonly` để định nghĩa biến là biến chỉ đọc, giá trị của biến chỉ đọc không thể thay đổi.

```shell
rword="hello"
echo ${rword}
readonly rword
# rword="bye"  # Nếu bỏ chú thích, sẽ bị lỗi khi thực thi
```

### Xóa biến

Bạn có thể sử dụng lệnh `unset` để xóa biến. Sau khi xóa biến, bạn không thể sử dụng lại biến đó. Lệnh `unset` không thể xóa biến chỉ đọc.

```shell
dword="hello"  # Khai báo biến
echo ${dword}  # In giá trị biến
# Output: hello

unset dword    # Xóa biến
echo ${dword}
# Output: (rỗng)
```

### Loại biến

- **Biến cục bộ** - Biến cục bộ chỉ có hiệu lực trong một script cụ thể. Chúng không thể được truy cập bởi các chương trình hoặc script khác.
- **Biến môi trường** - Biến môi trường là biến mà tất cả các chương trình hoặc script trong phiên làm việc hiện tại đều có thể nhìn thấy. Để tạo biến môi trường, bạn sử dụng từ khóa `export`, các script shell cũng có thể định nghĩa biến môi trường.

Các biến môi trường phổ biến:

| Biến        | Mô tả                                           |
| ----------- | ---------------------------------------------- |
| `$HOME`     | Thư mục người dùng hiện tại                      |
| `$PATH`     | Danh sách thư mục được phân tách bằng dấu chấm phẩy, shell sẽ tìm kiếm các lệnh trong các thư mục này |
| `$PWD`      | Thư mục làm việc hiện tại                        |
| `$RANDOM`   | Số ngẫu nhiên từ 0 đến 32767                    |
| `$UID`      | ID người dùng hiện tại (kiểu số)                 |
| `$PS1`      | Chuỗi dấu nhắc chính                            |
| `$PS2`      | Chuỗi dấu nhắc phụ                              |

[Bảng này](http://tldp.org/LDP/Bash-Beginners-Guide/html/sect_03_02.html###sect_03_02_04) cung cấp một danh sách biến môi trường Bash phổ biến hơn.

**💻 『Mã nguồn minh họa』**

```shell
#!/usr/bin/env bash

################### Khai báo biến ###################
name="world"
echo "hello ${name}"
# Output: hello world

################### In biến ###################
folder=$(pwd)
echo "current path: ${folder}"

################### Biến chỉ đọc ###################
rword="hello"
echo ${rword}
# Output: hello
readonly rword
# rword="bye"  # Nếu bỏ chú thích, sẽ bị lỗi khi thực thi

################### Xóa biến ###################
dword="hello" # Khai báo biến
echo ${dword} # In giá trị biến
# Output: hello

unset dword # Xóa biến
echo ${dword}
# Output: (rỗng)

################### Biến hệ thống ###################
echo "UID:$UID"
echo LOGNAME:$LOGNAME
echo User:$USER
echo HOME:$HOME
echo PATH:$PATH
echo HOSTNAME:$HOSTNAME
echo SHELL:$SHELL
echo LANG:$LANG

################### Biến tùy chỉnh ###################
days=10
user="admin"
echo "$user logged in $days days ago"
days=5
user="root"
echo "$user logged in $days days ago"
# Output:
# admin logged in 10 days ago
# root logged in 5 days ago

################### Đọc danh sách từ biến ###################
colors="Red Yellow Blue"
colors=$colors" White Black"

for color in $colors
do
	echo " $color"
done
```

## Chuỗi

### Dấu nháy đơn và dấu nháy kép

Trong shell, chuỗi có thể được bao bọc bằng dấu nháy đơn `''` hoặc dấu nháy kép `""`, hoặc không cần dùng dấu nháy.

- Đặc điểm của dấu nháy đơn:
  - Dấu nháy đơn không nhận diện biến.
  - Dấu nháy đơn không thể chứa dấu nháy đơn đơn lẻ (dù có sử dụng ký tự escape), nhưng có thể xuất hiện theo cặp, được sử dụng để nối chuỗi.
- Đặc điểm của dấu nháy kép:
  - Dấu nháy kép nhận diện biến.
  - Dấu nháy kép có thể chứa ký tự escape.

Tóm lại, khuyến nghị sử dụng dấu nháy kép.

### Nối chuỗi

```shell
# Nối chuỗi bằng dấu nháy đơn
name1='white'
str1='hello, '${name1}''
str2='hello, ${name1}'
echo ${str1}_${str2}
# Output:
# hello, white_hello, ${name1}

# Nối chuỗi bằng dấu nháy kép
name2="black"
str3="hello, "${name2}""
str4="hello, ${name2}"
echo ${str3}_${str4}
# Output:
# hello, black_hello, black
```

### Lấy độ dài chuỗi

```shell
text="12345"
echo ${#text}
# Output:
# 5
```

### Cắt chuỗi con

```shell
text="12345"
echo ${text:2:2}
# Output:
# 34
```

Cắt 2 ký tự từ vị trí thứ 3 của chuỗi

### Tìm kiếm chuỗi con

```shell
#!/usr/bin/env bash

text="hello"
echo `expr index "${text}" ll`

# Thực thi: ./str-demo5.sh
# Output:
# 3
```

Tìm vị trí bắt đầu của chuỗi con `ll` trong chuỗi `hello`.

**💻 『Mã nguồn ví dụ』**

```shell
#!/usr/bin/env bash

################### Ghép chuỗi với dấu nháy đơn ###################
name1='white'
str1='hello, '${name1}''
str2='hello, ${name1}'
echo ${str1}_${str2}
# Output:
# hello, white_hello, ${name1}

################### Ghép chuỗi với dấu nháy kép ###################
name2="black"
str3="hello, "${name2}""
str4="hello, ${name2}"
echo ${str3}_${str4}
# Output:
# hello, black_hello, black

################### Lấy độ dài chuỗi ###################
text="12345"
echo "${text} có độ dài là: ${#text}"
# Output:
# 12345 có độ dài là: 5

# Lấy chuỗi con
text="12345"
echo ${text:2:2}
# Output:
# 34

################### Tìm kiếm chuỗi con ###################
text="hello"
echo `expr index "${text}" ll`
# Output:
# 3

################### Kiểm tra chuỗi có chứa chuỗi con hay không ###################
result=$(echo "${str}" | grep "feature/")
if [[ "$result" != "" ]]; then
	echo "feature/ là chuỗi con của ${str}"
else
	echo "feature/ không là chuỗi con của ${str}"
fi

################### Cắt chuỗi bên trái của từ khóa ###################
full_branch="feature/1.0.0"
branch=`echo ${full_branch#feature/}`
echo "branch là ${branch}"

################### Cắt chuỗi bên phải của từ khóa ###################
full_version="0.0.1-SNAPSHOT"
version=`echo ${full_version%-SNAPSHOT}`
echo "version là ${version}"

################### Tách chuỗi thành mảng ###################
str="0.0.0.1"
OLD_IFS="$IFS"
IFS="."
array=( ${str} )
IFS="$OLD_IFS"
size=${#array[*]}
lastIndex=`expr ${size} - 1`
echo "Độ dài mảng: ${size}"
echo "Phần tử cuối cùng của mảng: ${array[${lastIndex}]}"
for item in ${array[@]}
do
	echo "$item"
done

################### Kiểm tra chuỗi có rỗng hay không ###################
#-n Kiểm tra độ dài khác không
#-z Kiểm tra độ dài bằng không

str=testing
str2=''
if [[ -n "$str" ]]
then
	echo "Chuỗi $str không rỗng"
else
	echo "Chuỗi $str rỗng"
fi

if [[ -n "$str2" ]]
then
	echo "Chuỗi $str2 không rỗng"
else
	echo "Chuỗi $str2 rỗng"
fi

#	Output:
#	Chuỗi testing không rỗng
#	Chuỗi  rỗng

################### So sánh chuỗi ###################
str=hello
str2=world
if [[ $str = "hello" ]]; then
	echo "str bằng hello"
else
	echo "str không bằng hello"
fi

if [[ $str2 = "hello" ]]; then
	echo "str2 bằng hello"
else
	echo "str2 không bằng hello"
fi
```

## Mảng

Bash chỉ hỗ trợ mảng một chiều.

Chỉ số mảng bắt đầu từ 0 và có thể là số nguyên hoặc biểu thức số học, giá trị phải lớn hơn hoặc bằng 0.

### Tạo mảng

```shell
# Cách khác nhau để tạo mảng
nums=([2]=2 [0]=0 [1]=1)
colors=(red yellow "dark blue")
```

### Truy cập phần tử mảng

- **Truy cập một phần tử mảng:**

```shell
echo ${nums[1]}
# Output: 1
```

- **Truy cập tất cả các phần tử mảng:**

```shell
echo ${colors[*]}
# Output: red yellow dark blue

echo ${colors[@]}
# Output: red yellow dark blue
```

Có một sự khác biệt quan trọng (và tinh vi) giữa hai dòng trên:

Để in từng phần tử của mảng trên một dòng riêng biệt, chúng ta sử dụng lệnh `printf`:

```shell
printf "+ %s\n" ${colors[*]}
# Output:
# + red
# + yellow
# + dark
# + blue
```

Tại sao `dark` và `blue` mỗi cái chiếm một dòng? Hãy thử đặt trong dấu ngoặc kép:

```shell
printf "+ %s\n" "${colors[*]}"
# Output:
# + red yellow dark blue
```

Bây giờ tất cả các phần tử đều được in trên cùng một dòng - điều này không phải là những gì chúng ta muốn! Hãy thử `${colors[@]}`

```shell
printf "+ %s\n" "${colors[@]}"
# Output:
# + red
# + yellow
# + dark blue
```

Trong dấu ngoặc kép, `${colors[@]}` mở rộng thành từng phần tử của mảng là một đối số riêng biệt; khoảng trắng trong các phần tử mảng được giữ nguyên.

- **Truy cập một phần của mảng:**

```shell
echo ${nums[@]:0:2}
# Output:
# 0 1
```

Trong ví dụ trên, `${array[@]}` mở rộng thành toàn bộ mảng, `:0:2` lấy các phần tử của mảng từ vị trí 0 và có độ dài là 2.

### Truy cập độ dài của mảng

```shell
echo ${#nums[*]}
# Output:
# 3
```

### Thêm phần tử vào mảng

Thêm phần tử vào mảng cũng rất đơn giản:

```shell
colors=(white "${colors[@]}" green black)
echo ${colors[@]}
# Output:
# white red yellow dark blue green black
```

Trong ví dụ trên, `${colors[@]}` mở rộng thành toàn bộ mảng và được gán vào câu lệnh gán phức hợp, sau đó, phép gán cho mảng `colors` ghi đè lên giá trị ban đầu của nó.

### Xóa phần tử khỏi mảng

Sử dụng lệnh `unset` để xóa một phần tử khỏi mảng:

```shell
unset nums[0]
echo ${nums[@]}
# Output:
# 1 2
```

**💻 『Mã nguồn ví dụ』**

```shell
#!/usr/bin/env bash

################### Tạo mảng ###################
nums=( [ 2 ] = 2 [ 0 ] = 0 [ 1 ] = 1 )
colors=( red yellow "dark blue" )

################### Truy cập một phần tử mảng ###################
echo ${nums[1]}
# Output: 1

################### Truy cập tất cả các phần tử mảng ###################
echo ${colors[*]}
# Output: red yellow dark blue

echo ${colors[@]}
# Output: red yellow dark blue

printf "+ %s\n" ${colors[*]}
# Output:
# + red
# + yellow
# + dark
# + blue

printf "+ %s\n" "${colors[*]}"
# Output:
# + red yellow dark blue

printf "+ %s\n" "${colors[@]}"
# Output:
# + red
# + yellow
# + dark blue

################### Truy cập một phần của mảng ###################
echo ${nums[@]:0:2}
# Output:
# 0 1

################### Truy cập độ dài của mảng ###################
echo ${#nums[*]}
# Output:
# 3

################### Thêm phần tử vào mảng ###################
colors=( white "${colors[@]}" green black )
echo ${colors[@]}
# Output:
# white red yellow dark blue green black

################### Xóa phần tử khỏi mảng ###################
unset nums[ 0 ]
echo ${nums[@]}
# Output:
# 1 2
```

## Toán tử

### Toán tử số học

Bảng dưới đây liệt kê các toán tử số học phổ biến, giả sử biến x có giá trị là 10 và biến y có giá trị là 20:

| Toán tử | Mô tả                                          | Ví dụ                            |
| ------- | --------------------------------------------- | ------------------------------ |
| +       | Phép cộng                                      | `expr $x + $y` kết quả là 30.     |
| -       | Phép trừ                                       | `expr $x - $y` kết quả là -10.    |
| \*      | Phép nhân                                      | `expr $x * $y` kết quả là 200.    |
| /       | Phép chia                                      | `expr $y / $x` kết quả là 2.      |
| %       | Lấy phần dư                                    | `expr $y % $x` kết quả là 0.      |
| =       | Gán giá trị                                    | `x=$y` sẽ gán giá trị của biến y cho biến x. |
| ==      | So sánh bằng. Sử dụng để so sánh hai số, nếu giống nhau thì trả về true.     | `[ $x == $y ]` trả về false.    |
| !=      | So sánh khác nhau. Sử dụng để so sánh hai số, nếu khác nhau thì trả về true. | `[ $x != $y ]` trả về true.     |

**Lưu ý:** Biểu thức điều kiện phải được đặt trong dấu ngoặc vuông và phải có khoảng trắng, ví dụ: `[$x==$y]` là sai, phải viết thành `[ $x == $y ]`.

**💻 『Mã nguồn ví dụ』**

```shell
x=10
y=20

echo "x=${x}, y=${y}"

val=`expr ${x} + ${y}`
echo "${x} + ${y} = $val"

val=`expr ${x} - ${y}`
echo "${x} - ${y} = $val"

val=`expr ${x} \* ${y}`
echo "${x} * ${y} = $val"

val=`expr ${y} / ${x}`
echo "${y} / ${x} = $val"

val=`expr ${y} % ${x}`
echo "${y} % ${x} = $val"

if [[ ${x} == ${y} ]]
then
  echo "${x} = ${y}"
fi
if [[ ${x} != ${y} ]]
then
  echo "${x} != ${y}"
fi

#  Output:
#  x=10, y=20
#  10 + 20 = 30
#  10 - 20 = -10
#  10 * 20 = 200
#  20 / 10 = 2
#  20 % 10 = 0
#  10 != 20
```

### Toán tử quan hệ

Toán tử quan hệ chỉ hỗ trợ số, không hỗ trợ chuỗi trừ khi giá trị chuỗi là số.

Bảng dưới đây liệt kê các toán tử quan hệ phổ biến, giả sử biến x có giá trị là 10 và biến y có giá trị là 20:

| Toán tử | Mô tả                                          | Ví dụ                            |
| ------- | --------------------------------------------- | ------------------------------ |
| `-eq`   | Kiểm tra hai số có bằng nhau không, nếu bằng nhau thì trả về true.                   | `[ $a -eq $b ]` trả về false.  |
| `-ne`   | Kiểm tra hai số có khác nhau không, nếu khác nhau thì trả về true.                 | `[ $a -ne $b ]` trả về true.  |
| `-gt`   | Kiểm tra số bên trái có lớn hơn số bên phải không, nếu có thì trả về true.     | `[ $a -gt $b ]` trả về false. |
| `-lt`   | Kiểm tra số bên trái có nhỏ hơn số bên phải không, nếu có thì trả về true.     | `[ $a -lt $b ]` trả về true.  |
| `-ge`   | Kiểm tra số bên trái có lớn hơn hoặc bằng số bên phải không, nếu có thì trả về true. | `[ $a -ge $b ]` trả về false. |
| `-le`   | Kiểm tra số bên trái có nhỏ hơn hoặc bằng số bên phải không, nếu có thì trả về true. | `[ $a -le $b ]` trả về true.   |

**💻 『Mã nguồn ví dụ』**

```shell
x=10
y=20

echo "x=${x}, y=${y}"

if [[ ${x} -eq ${y} ]]; then
   echo "${x} -eq ${y} : x bằng y"
else
   echo "${x} -eq ${y}: x không bằng y"
fi

if [[ ${x} -ne ${y} ]]; then
   echo "${x} -ne ${y}: x không bằng y"
else
   echo "${x} -ne ${y}: x bằng y"
fi

if [[ ${x} -gt ${y} ]]; then
   echo "${x} -gt ${y}: x lớn hơn y"
else
   echo "${x} -gt ${y}: x không lớn hơn y"
fi

if [[ ${x} -lt ${y} ]]; then
   echo "${x} -lt ${y}: x nhỏ hơn y"
else
   echo "${x} -lt ${y}: x không nhỏ hơn y"
fi

if [[ ${x} -ge ${y} ]]; then
   echo "${x} -ge ${y}: x lớn hơn hoặc bằng y"
else
   echo "${x} -ge ${y}: x nhỏ hơn y"
fi

if [[ ${x} -le ${y} ]]; then
   echo "${x} -le ${y}: x nhỏ hơn hoặc bằng y"
else
   echo "${x} -le ${y}: x lớn hơn y"
fi

#  Output:
#  x=10, y=20
#  10 -eq 20: x không bằng y
#  10 -ne 20: x không bằng y
#  10 -gt 20: x không lớn hơn y
#  10 -lt 20: x nhỏ hơn y
#  10 -ge 20: x nhỏ hơn y
#  10 -le 20: x nhỏ hơn hoặc bằng y
```

### Toán tử boolean

Bảng dưới đây liệt kê các toán tử boolean phổ biến, giả sử biến x có giá trị là 10 và biến y có giá trị là 20:

| Toán tử | Mô tả                                                | Ví dụ                                       |
| ------- | --------------------------------------------------- | ------------------------------------------ |
| `!`     | Phủ định, nếu biểu thức là true thì trả về false, ngược lại trả về true. | `[ ! false ]` trả về true.                  |
| `-o`    | Logic OR, nếu một trong hai biểu thức là true thì trả về true.           | `[ $a -lt 20 -o $b -gt 100 ]` trả về true.  |
| `-a`    | Logic AND, cả hai biểu thức đều là true thì trả về true.                 | `[ $a -lt 20 -a $b -gt 100 ]` trả về false. |

**💻 『Mã nguồn ví dụ』**

```shell
x=10
y=20

echo "x=${x}, y=${y}"

if [[ ${x} != ${y} ]]; then
   echo "${x} != ${y} : x không bằng y"
else
   echo "${x} != ${y}: x bằng y"
fi

if [[ ${x} -lt 100 && ${y} -gt 15 ]]; then
   echo "${x} nhỏ hơn 100 và ${y} lớn hơn 15 : trả về true"
else
   echo "${x} nhỏ hơn 100 và ${y} lớn hơn 15 : trả về false"
fi

if [[ ${x} -lt 100 || ${y} -gt 100 ]]; then
   echo "${x} nhỏ hơn 100 hoặc ${y} lớn hơn 100 : trả về true"
else
   echo "${x} nhỏ hơn 100 hoặc ${y} lớn hơn 100 : trả về false"
fi

if [[ ${x} -lt 5 || ${y} -gt 100 ]]; then
   echo "${x} nhỏ hơn 5 hoặc ${y} lớn hơn 100 : trả về true"
else
   echo "${x} nhỏ hơn 5 hoặc ${y} lớn hơn 100 : trả về false"
fi

#  Output:
#  x=10, y=20
#  10 != 20 : x không bằng y
#  10 nhỏ hơn 100 và 20 lớn hơn 15 : trả về true
#  10 nhỏ hơn 100 hoặc 20 lớn hơn 100 : trả về true
#  10 nhỏ hơn 5 hoặc 20 lớn hơn 100 : trả về false
```

### Toán tử logic

Dưới đây là các toán tử logic trong Shell, giả sử biến x có giá trị là 10 và biến y có giá trị là 20:

| Toán tử | Mô tả     | Ví dụ                                             |
| ------- | --------- | ------------------------------------------------- |
| `&&`    | Logic AND | `[[ ${x} -lt 100 && ${y} -gt 100 ]]` trả về false |
| `||`    | Logic OR  | `[[ ${x} -lt 100 || ${y} -gt 100 ]]` trả về true  |

**💻 『Mã nguồn ví dụ』**

```shell
x=10
y=20

echo "x=${x}, y=${y}"

if [[ ${x} -lt 100 && ${y} -gt 100 ]]
then
   echo "${x} -lt 100 && ${y} -gt 100 trả về true"
else
   echo "${x} -lt 100 && ${y} -gt 100 trả về false"
fi

if [[ ${x} -lt 100 || ${y} -gt 100 ]]
then
   echo "${x} -lt 100 || ${y} -gt 100 trả về true"
else
   echo "${x} -lt 100 || ${y} -gt 100 trả về false"
fi

#  Output:
#  x=10, y=20
#  10 -lt 100 && 20 -gt 100 trả về false
#  10 -lt 100 || 20 -gt 100 trả về true
```

### Toán tử chuỗi

Bảng dưới đây liệt kê các toán tử chuỗi phổ biến, giả sử biến a có giá trị là "abc" và biến b có giá trị là "efg":

| Toán tử | Mô tả                                                | Ví dụ                                      |
| ------- | --------------------------------------------------- | ----------------------------------------- |
| `=`     | Kiểm tra hai chuỗi có bằng nhau không, nếu bằng nhau thì trả về true.                   | `[ $a = $b ]` trả về false.                |
| `!=`    | Kiểm tra hai chuỗi có khác nhau không, nếu khác nhau thì trả về true.                 | `[ $a != $b ]` trả về true.                |
| `-z`    | Kiểm tra độ dài của chuỗi có bằng 0 không, nếu bằng 0 thì trả về true.                 | `[ -z $a ]` trả về false.                  |
| `-n`    | Kiểm tra độ dài của chuỗi có khác 0 không, nếu khác 0 thì trả về true.                 | `[ -n $a ]` trả về true.                   |
| `str`   | Kiểm tra chuỗi có rỗng không, nếu không rỗng thì trả về true.                          | `[ $a ]` trả về true.                      |

**💻 『Mã nguồn ví dụ』**

```shell
x="abc"
y="xyz"

echo "x=${x}, y=${y}"

if [[ ${x} = ${y} ]]; then
   echo "${x} = ${y} : x bằng y"
else
   echo "${x} = ${y}: x không bằng y"
fi

if [[ ${x} != ${y} ]]; then
   echo "${x} != ${y} : x không bằng y"
else
   echo "${x} != ${y}: x bằng y"
fi

if [[ -z ${x} ]]; then
   echo "-z ${x} : Độ dài chuỗi là 0"
else
   echo "-z ${x} : Độ dài chuỗi không phải là 0"
fi

if [[ -n "${x}" ]]; then
   echo "-n ${x} : Độ dài chuỗi không phải là 0"
else
   echo "-n ${x} : Độ dài chuỗi là 0"
fi

if [[ ${x} ]]; then
   echo "${x} : Chuỗi không rỗng"
else
   echo "${x} : Chuỗi rỗng"
fi

#  Output:
#  x=abc, y=xyz
#  abc = xyz: x không bằng y
#  abc != xyz : x không bằng y
#  -z abc : Độ dài chuỗi không phải là 0
#  -n abc : Độ dài chuỗi không phải là 0
#  abc : Chuỗi không rỗng
```

### Toán tử kiểm tra tệp tin

Toán tử kiểm tra tệp tin được sử dụng để kiểm tra các thuộc tính của tệp tin Unix.

Mô tả kiểm tra thuộc tính như sau:

| Toán tử  | Mô tả                                                                        | Ví dụ                           |
| -------- | --------------------------------------------------------------------------- | ------------------------------ |
| `-b file` | Kiểm tra xem tệp tin có phải là tệp thiết bị khối hay không, nếu đúng thì trả về true. | `[ -b $file ]` trả về false.    |
| `-c file` | Kiểm tra xem tệp tin có phải là tệp thiết bị ký tự hay không, nếu đúng thì trả về true. | `[ -c $file ]` trả về false.    |
| `-d file` | Kiểm tra xem tệp tin có phải là thư mục hay không, nếu đúng thì trả về true.       | `[ -d $file ]` trả về false.    |
| `-f file` | Kiểm tra xem tệp tin có phải là tệp thông thường (không phải thư mục hoặc thiết bị) hay không, nếu đúng thì trả về true. | `[ -f $file ]` trả về true.     |
| `-g file` | Kiểm tra xem tệp tin có được đặt cờ SGID hay không, nếu đúng thì trả về true.       | `[ -g $file ]` trả về false.    |
| `-k file` | Kiểm tra xem tệp tin có được đặt cờ Sticky Bit hay không, nếu đúng thì trả về true. | `[ -k $file ]` trả về false.    |
| `-p file` | Kiểm tra xem tệp tin có phải là ống thông tin (named pipe) hay

## Câu điều khiển

### Câu điều kiện

Tương tự như các ngôn ngữ lập trình khác, câu điều kiện trong Bash cho phép chúng ta quyết định xem một hành động có được thực hiện hay không. Kết quả phụ thuộc vào một biểu thức được đặt trong cặp dấu `[[ ]]`.

Biểu thức được bao bọc trong `[[ ]]` (trong `sh` là `[ ]`) được gọi là **lệnh kiểm tra** hoặc **nguyên tố**. Những biểu thức này giúp chúng ta kiểm tra kết quả của một điều kiện. Bạn có thể tìm thấy câu trả lời về sự khác biệt giữa dấu ngoặc vuông đơn và kép trong bash tại [đây](http://serverfault.com/a/52050).

Có hai loại biểu thức điều kiện: `if` và `case`.

#### `if`

(1) Câu lệnh `if`

Câu lệnh `if` trong Bash hoạt động tương tự như các ngôn ngữ khác. Nếu biểu thức trong dấu ngoặc vuông là đúng, thì mã giữa `then` và `fi` sẽ được thực thi. `fi` đánh dấu kết thúc của khối mã điều kiện.

```shell
# Ghi trên một dòng
if [[ 1 -eq 1 ]]; then echo "Kết quả của 1 -eq 1 là: đúng"; fi
# Output: Kết quả của 1 -eq 1 là: đúng

# Ghi trên nhiều dòng
if [[ "abc" -eq "abc" ]]
then
  echo "Kết quả của "abc" -eq "abc" là: đúng"
fi
# Output: Kết quả của abc -eq abc là: đúng
```

(2) Câu lệnh `if else`

Tương tự, chúng ta cũng có thể sử dụng câu lệnh `if..else`, ví dụ:

```shell
if [[ 2 -ne 1 ]]; then
  echo "đúng"
else
  echo "sai"
fi
# Output: đúng
```

(3) Câu lệnh `if elif else`

Đôi khi, câu lệnh `if..else` không đáp ứng được yêu cầu của chúng ta. Đừng quên câu lệnh `if..elif..else`, nó cũng rất tiện lợi để sử dụng.

**💻 『Mã nguồn ví dụ』**

```shell
x=10
y=20
if [[ ${x} > ${y} ]]; then
   echo "${x} > ${y}"
elif [[ ${x} < ${y} ]]; then
   echo "${x} < ${y}"
else
   echo "${x} = ${y}"
fi
# Output: 10 < 20
```

#### `case`

Nếu bạn cần xử lý nhiều trường hợp khác nhau và thực hiện các hành động khác nhau cho từng trường hợp, thì sử dụng câu lệnh `case` sẽ hữu ích hơn việc lồng `if`. Sử dụng `case` để giải quyết các điều kiện phức tạp, có dạng như sau:

**💻 『Mã nguồn ví dụ』**

```shell
exec
case ${oper} in
  "+")
    val=`expr ${x} + ${y}`
    echo "${x} + ${y} = ${val}"
  ;;
  "-")
    val=`expr ${x} - ${y}`
    echo "${x} - ${y} = ${val}"
  ;;
  "*")
    val=`expr ${x} \* ${y}`
    echo "${x} * ${y} = ${val}"
  ;;
  "/")
    val=`expr ${x} / ${y}`
    echo "${x} / ${y} = ${val}"
  ;;
  *)
    echo "Phép toán không xác định!"
  ;;
esac
```

Mỗi trường hợp tương ứng với một biểu thức mẫu. Dấu `|` được sử dụng để phân tách các mẫu khác nhau, dấu `)` được sử dụng để kết thúc một chuỗi mẫu. Câu lệnh tương ứng với mẫu đầu tiên khớp sẽ được thực thi. Dấu `*` đại diện cho bất kỳ mẫu nào không khớp với các mẫu được đưa ra trước đó. Các khối lệnh phải được phân tách bằng `;;`.

## Vòng lặp

Vòng lặp không lạ lẫm. Tương tự như các ngôn ngữ lập trình khác, vòng lặp trong bash là một khối mã được lặp đi lặp lại cho đến khi điều kiện điều khiển trở thành sai.

Bash có bốn loại vòng lặp: `for`, `while`, `until` và `select`.

#### Vòng lặp `for`

`for` rất giống với nó trong C. Nó có dạng như sau:

```shell
for arg in elem1 elem2 ... elemN
do
  ### Câu lệnh
done
```

Trong mỗi lần lặp, `arg` sẽ được gán giá trị từ `elem1` đến `elemN`. Các giá trị này cũng có thể là các ký tự đại diện hoặc [mở rộng dấu ngoặc nhọn](https://github.com/denysdovhan/bash-handbook/tree/master#brace-expansion).

Tất nhiên, chúng ta cũng có thể viết vòng lặp `for` trên một dòng, nhưng điều này yêu cầu phải có một dấu chấm phẩy trước `do`, như sau:

```shell
for i in {1..5}; do echo $i; done
```

Ngoài ra, nếu bạn cảm thấy cú pháp `for..in..do` hơi lạ lẫm, bạn cũng có thể sử dụng `for` giống như trong C, ví dụ:

```shell
for (( i = 0; i < 10; i++ )); do
  echo $i
done
```

Khi chúng ta muốn thực hiện cùng một hành động trên tất cả các tệp trong một thư mục, `for` rất hữu ích. Ví dụ, nếu chúng ta muốn di chuyển tất cả các tệp có đuôi `.bash` vào thư mục `script` và cấp quyền thực thi cho chúng, script của chúng ta có thể được viết như sau:

**💻 『Mã nguồn ví dụ』**

```shell
DIR=/home/zp
for FILE in ${DIR}/*.sh; do
  mv "$FILE" "${DIR}/scripts"
done
# Di chuyển tất cả các tệp .bash trong thư mục /home/zp vào /home/zp/scripts
```

#### Vòng lặp `while`

Vòng lặp `while` kiểm tra một điều kiện, và chỉ thực thi một khối lệnh khi điều kiện đó là _đúng_. Điều kiện được kiểm tra trong `while` tương tự như trong câu lệnh `if..then` với [nguyên tố](https://github.com/denysdovhan/bash-handbook/tree/master#primary-and-combining-expressions) được sử dụng. Vì vậy, một vòng lặp `while` có dạng như sau:

```shell
while [[ condition ]]
do
  ### Câu lệnh
done
```

Tương tự như vòng lặp `for`, nếu chúng ta viết `do` và điều kiện kiểm tra trên cùng một dòng, chúng ta phải thêm một dấu chấm phẩy trước `do`.

**💻 『Mã nguồn ví dụ』**

```shell
### In bình phương của các số từ 0 đến 9
x=0
while [[ ${x} -lt 10 ]]; do
  echo $((x * x))
  x=$((x + 1))
done
# Output:
# 0
# 1
# 4
# 9
# 16
# 25
# 36
# 49
# 64
# 81
```

#### Vòng lặp `until`

Vòng lặp `until` tương tự như vòng lặp `while`, nhưng ngược lại. Nó kiểm tra một điều kiện và chỉ thực thi một khối lệnh khi điều kiện đó là _sai_:

**💻 『Mã nguồn ví dụ』**

```shell
x=0
until [[ ${x} -ge 5 ]]; do
  echo ${x}
  x=`expr ${x} + 1`
done
# Output:
# 0
# 1
# 2
# 3
# 4
```

#### Vòng lặp `select`

Vòng lặp `select` giúp chúng ta tạo một menu cho người dùng. Cú pháp của nó gần giống với vòng lặp `for`:

```shell
select answer in elem1 elem2 ... elemN
do
  ### Câu lệnh
done
```

`select` sẽ in ra các giá trị `elem1..elemN` và số thứ tự của chúng trên màn hình, sau đó yêu cầu người dùng nhập vào. Thông thường, bạn sẽ thấy `$?` (biến `PS3`). Kết quả lựa chọn của người dùng sẽ được lưu vào biến `answer`. Nếu `answer` là một số trong khoảng từ `1` đến `N`, thì câu lệnh sẽ được thực thi và sau đó sẽ tiếp tục vòng lặp - trừ khi bạn không muốn điều đó, bạn có thể sử dụng câu lệnh `break`.

**💻 『Mã nguồn ví dụ』**

```shell
#!/usr/bin/env bash

PS3="Chọn trình quản lý gói: "
select ITEM in bower npm gem pip
do
echo -n "Nhập tên gói: " && read PACKAGE
case ${ITEM} in
  bower) bower install ${PACKAGE} ;;
  npm) npm install ${PACKAGE} ;;
  gem) gem install ${PACKAGE} ;;
  pip) pip install ${PACKAGE} ;;
esac
break # Tránh lặp vô hạn
done
```

Ví dụ này đầu tiên hỏi người dùng muốn sử dụng trình quản lý gói nào. Sau đó, nó hỏi người dùng muốn cài đặt gói nào và sau cùng thực hiện thao tác cài đặt.

Khi chạy script này, bạn sẽ nhận được đầu ra như sau:

```shell
$ ./my_script
1) bower
2) npm
3) gem
4) pip
Chọn trình quản lý gói: 2
Nhập tên gói: gitbook-cli
```

#### `break` và `continue`

Nếu bạn muốn kết thúc vòng lặp sớm hoặc bỏ qua một lần lặp cụ thể, bạn có thể sử dụng câu lệnh `break` và `continue` của shell. Chúng có thể được sử dụng trong bất kỳ vòng lặp nào.

> Câu lệnh `break` được sử dụng để kết thúc vòng lặp hiện tại.
>
> Câu lệnh `continue` được sử dụng để bỏ qua một lần lặp.

**💻 『Mã nguồn ví dụ』**

```shell
# Tìm số nguyên dương đầu tiên trong khoảng từ 0 đến 9 chia hết cho cả 2 và 3
i=1
while [[ ${i} -lt 10 ]]; do
  if [[ $((i % 3)) -eq 0 ]] && [[ $((i % 2)) -eq 0 ]]; then
    echo ${i}
    break;
  fi
  i=`expr ${i} + 1`
done
# Output: 6
```

**💻 『Mã nguồn ví dụ』**

```shell
# In ra các số lẻ trong khoảng từ 0 đến 10
for (( i = 0; i < 10; i ++ )); do
  if [[ $((i % 2)) -eq 0 ]]; then
    continue;
  fi
  echo ${i}
done
# Output:
# 1
# 3
# 5
# 7
# 9
```

## Hàm

Cú pháp định nghĩa hàm trong bash như sau:

```shell
[ function ] funname [()] {
    action;
    [return int;]
}
```

> 💡 Lưu ý:
>
> 1. Từ khóa `function` có thể có hoặc không khi định nghĩa hàm.
> 2. Lệnh `return` được sử dụng để trả về giá trị từ hàm, giá trị trả về chỉ có thể là số nguyên (từ 0-255). Nếu không có lệnh `return`, shell sẽ trả về kết quả của lệnh cuối cùng làm giá trị trả về của hàm.
> 3. Giá trị trả về của hàm có thể được lấy sau khi gọi hàm bằng biến `$?`.
> 4. Tất cả các hàm phải được định nghĩa trước khi sử dụng. Điều này có nghĩa là hàm phải được đặt ở đầu script, cho đến khi trình thông dịch shell gặp nó lần đầu tiên, sau đó mới có thể sử dụng hàm bằng cách gọi tên của nó.

**💻 『Mã nguồn ví dụ』**

```shell
#!/usr/bin/env bash

calc(){
  PS3="chọn phép toán: "
  select oper in + - \* / # Tạo menu chọn phép toán
  do
  echo -n "nhập số thứ nhất: " && read x # Đọc tham số đầu vào
  echo -n "nhập số thứ hai: " && read y # Đọc tham số đầu vào
  exec
  case ${oper} in
    "+")
      return $((${x} + ${y}))
    ;;
    "-")
      return $((${x} - ${y}))
    ;;
    "*")
      return $((${x} * ${y}))
    ;;
    "/")
      return $((${x} / ${y}))
    ;;
    *)
      echo "${oper} không được hỗ trợ!"
      return 0
    ;;
  esac
  break
  done
}
calc
echo "kết quả là: $?" # Lấy giá trị trả về của hàm calc
```

Kết quả thực thi:

```shell
$ ./function-demo.sh
1) +
2) -
3) *
4) /
chọn phép toán: 3
nhập số thứ nhất: 10
nhập số thứ hai: 10
kết quả là: 100
```

### Tham số vị trí

**Tham số vị trí** là các biến được tạo ra khi gọi một hàm và truyền tham số cho nó.

Bảng biến tham số vị trí:

| Biến           | Mô tả                                  |
| -------------- | -------------------------------------- |
| `$0`           | Tên script                             |
| `$1 … $9`      | Tham số thứ 1 đến tham số thứ 9        |
| `${10} …`      | Tham số thứ 10 trở đi                  |
| `$*` hoặc `$@` | Tất cả các tham số trừ `$0`            |
| `$#`           | Số lượng tham số trừ `$0`              |
| `$FUNCNAME`    | Tên hàm (chỉ có giá trị bên trong hàm) |

**💻 『Mã nguồn ví dụ』**

```shell
#!/usr/bin/env bash

x=0
if [[ -n $1 ]]; then
  echo "Tham số thứ nhất là: $1"
  x=$1
else
  echo "Tham số thứ nhất là rỗng"
fi

y=0
if [[ -n $2 ]]; then
  echo "Tham số thứ hai là: $2"
  y=$2
else
  echo "Tham số thứ hai là rỗng"
fi

paramsFunction(){
  echo "Tham số thứ nhất của hàm: $1"
  echo "Tham số thứ hai của hàm: $2"
}
paramsFunction ${x} ${y}
```

Kết quả thực thi:

```shell
$ ./function-demo2.sh
Tham số thứ nhất là rỗng
Tham số thứ hai là rỗng
Tham số thứ nhất của hàm: 0
Tham số thứ hai của hàm: 0

$ ./function-demo2.sh 10 20
Tham số thứ nhất là: 10
Tham số thứ hai là: 20
Tham số thứ nhất của hàm: 10
Tham số thứ hai của hàm: 20
```

Chạy `./variable-demo4.sh hello world`, sau đó trong script, đọc tham số thứ nhất bằng `$1`, tham số thứ hai bằng `$2`…

### Xử lý tham số của hàm

Ngoài ra, còn một số ký tự đặc biệt được sử dụng để xử lý tham số:

| Xử lý tham số | Mô tả                                             |
| ------------ | ------------------------------------------------ |
| `$#`         | Trả về số lượng tham số                             |
| `$*`         | Trả về tất cả các tham số                           |
| `$$`         | Trả về ID tiến trình hiện tại của script            |
| `$!`         | Trả về ID của tiến trình cuối cùng chạy ở nền       |
| `$@`         | Trả về tất cả các tham số                           |
| `$-`         | Trả về các tùy chọn hiện tại của Shell, tương tự `set` |
| `$?`         | Trả về giá trị trả về của hàm                       |

**💻 『Mã nguồn ví dụ』**

```shell
runner() {
  return 0
}

name=zp
paramsFunction(){
  echo "Tham số thứ nhất của hàm: $1"
  echo "Tham số thứ hai của hàm: $2"
  echo "Số lượng tham số được truyền vào script: $#"
  echo "Tất cả các tham số:"
  printf "+ %s\n" "$*"
  echo "ID tiến trình hiện tại của script: $$"
  echo "ID của tiến trình cuối cùng chạy ở nền: $!"
  echo "Tất cả các tham số:"
  printf "+ %s\n" "$@"
  echo "Các tùy chọn hiện tại của Shell: $-"
  runner
  echo "Giá trị trả về của hàm runner: $?"
}
paramsFunction 1 "abc" "hello, \"zp\""
#  Output:
#  Tham số thứ nhất của hàm: 1
#  Tham số thứ hai của hàm: abc
#  Số lượng tham số được truyền vào script: 3
#  Tất cả các tham số:
#  + 1 abc hello, "zp"
#  ID tiến trình hiện tại của script: 26400
#  ID của tiến trình cuối cùng chạy ở nền:
#  Tất cả các tham số:
#  + 1
#  + abc
#  + hello, "zp"
#  Các tùy chọn hiện tại của Shell: hB
#  Giá trị trả về của hàm runner: 0
```

## Mở rộng Shell

_Mở rộng_ xảy ra sau khi một dòng lệnh được chia thành các _token_. Nó là cơ chế để thực hiện các phép tính toán, lưu kết quả thực thi của lệnh, và nhiều hơn nữa.

Nếu bạn quan tâm, bạn có thể đọc thêm về [mở rộng shell](https://www.gnu.org/software/bash/manual/bash.html###Shell-Expansions).

#### Mở rộng dấu ngoặc nhọn

Mở rộng dấu ngoặc nhọn cho phép tạo ra bất kỳ chuỗi nào. Nó tương tự như _mở rộng tên tệp_ , ví dụ:

```shell
echo beg{i,a,u}n ### begin began begun
```

Mở rộng dấu ngoặc nhọn cũng có thể được sử dụng để tạo ra một phạm vi có thể lặp lại.

```shell
echo {0..5} ### 0 1 2 3 4 5
echo {00..8..2} ### 00 02 04 06 08
```

#### Thay thế lệnh

Thay thế lệnh cho phép chúng ta đánh giá một lệnh và thay thế kết quả của nó vào một lệnh khác hoặc một biểu thức gán giá trị. Khi một lệnh được bao quanh bởi `` hoặc `$()`, thay thế lệnh sẽ được thực thi. Ví dụ:

```shell
now=`date +%T`
### hoặc
now=$(date +%T)

echo $now ### 19:08:26
```

#### Mở rộng số học

Trong bash, thực hiện các phép tính toán là rất tiện lợi. Biểu thức số học phải được bao quanh bởi `$(())`. Cú pháp mở rộng số học là:

```shell
result=$(( ((10 + 5*3) - 7) / 2 ))
echo $result ### 9
```

Trong biểu thức số học, không cần sử dụng tiền tố `$` cho biến:

```shell
x=4
y=7
echo $(( x + y ))     ### 11
echo $(( ++x + y++ )) ### 12
echo $(( x + y ))     ### 13
```

#### Dấu nháy đơn và nháy kép

Dấu nháy đơn và nháy kép có một số khác biệt quan trọng. Trong dấu nháy kép, các tham chiếu biến hoặc thay thế lệnh sẽ được mở rộng. Trong dấu nháy đơn, không có mở rộng nào xảy ra. Ví dụ:

```shell
echo "Your home: $HOME" ### Your home: /Users/<username>
echo 'Your home: $HOME' ### Your home: $HOME
```

Khi biến cục bộ và biến môi trường chứa khoảng trắng, việc mở rộng chúng trong dấu nháy đơn cần được chú ý. Ví dụ:

```shell
INPUT="A string  with   strange    whitespace."
echo $INPUT   ### A string with strange whitespace.
echo "$INPUT" ### A string  with   strange    whitespace.
```

Khi gọi lệnh `echo` lần thứ nhất, nó nhận 5 tham số riêng biệt - `$INPUT` được chia thành các từ riêng biệt và `echo` in ra một khoảng trắng giữa mỗi từ. Trong trường hợp thứ hai, lệnh `echo` chỉ nhận một tham số duy nhất (giá trị `$INPUT` đầy đủ, bao gồm cả khoảng trắng).

Dưới đây là một ví dụ nghiêm trọng hơn:

```shell
FILE="Favorite Things.txt"
cat $FILE   ### Cố gắng in ra hai tệp: `Favorite` và `Things.txt`
cat "$FILE" ### In ra một tệp: `Favorite Things.txt`
```

Mặc dù vấn đề này có thể được giải quyết bằng cách đổi tên FILE thành `Favorite-Things.txt`, nhưng nếu giá trị này đến từ một biến môi trường, từ một tham số vị trí, hoặc từ một lệnh khác (`find`, `cat`, v.v.), thì sao? Do đó, nếu đầu vào _có thể_ chứa khoảng trắng, hãy luôn luôn đặt biểu thức trong dấu nháy.

## Luồng và Chuyển hướng

Bash có các công cụ mạnh mẽ để xử lý việc làm việc chung giữa các chương trình. Sử dụng luồng, chúng ta có thể gửi đầu ra của một chương trình đến một chương trình hoặc tệp tin khác, từ đó, chúng ta có thể dễ dàng ghi nhật ký hoặc thực hiện các công việc khác mà chúng ta muốn.

Ống (Pipe) cho phép chúng ta tạo ra một dây chuyền truyền tải, làm cho việc kiểm soát thực thi của chương trình trở nên khả thi.

Việc học cách sử dụng các công cụ mạnh mẽ và cao cấp này là rất quan trọng.

### Luồng vào, luồng ra

Bash nhận đầu vào và tạo ra đầu ra dưới dạng chuỗi ký tự hoặc **luồng ký tự**. Các luồng này có thể được định tuyến đến tệp tin hoặc luồng khác.

Có ba mô tả tệp tin:

| Mã     | Mô tả      | Mô tả         |
| ------ | ----------- | ------------- |
| `0`    | `stdin`    | Đầu vào chuẩn |
| `1`    | `stdout`   | Đầu ra chuẩn  |
| `2`    | `stderr`   | Đầu ra lỗi    |

### Chuyển hướng

Chuyển hướng (Redirect) cho phép chúng ta kiểm soát nguồn đầu vào của một lệnh đến đâu và đầu ra kết quả đến đâu. Các toán tử sau được sử dụng trong việc Chuyển hướng luồng điều khiển:

| Toán tử | Mô tả                                                         |
| ------- | ------------------------------------------------------------ |
| `>`     | Chuyển hướng đầu ra                                          |
| `&>`    | Chuyển hướng đầu ra và đầu ra lỗi                            |
| `&>>`   | Chuyển hướng đầu ra và đầu ra lỗi dưới dạng gắn thêm         |
| `<`     | Chuyển hướng đầu vào                                         |
| `<<`    | Cú pháp [Here Document](http://tldp.org/LDP/abs/html/here-docs.html) |
| `<<<`   | Chuỗi [Here](http://www.tldp.org/LDP/abs/html/x17837.html)   |

Dưới đây là một số ví dụ về việc sử dụng chuyển hướng:

```shell
### Kết quả của lệnh ls sẽ được ghi vào tệp tin list.txt
ls -l > list.txt

### Gắn thêm đầu ra vào tệp tin list.txt
ls -a >> list.txt

### Tất cả thông báo lỗi sẽ được ghi vào tệp tin errors.txt
grep da * 2> errors.txt

### Đọc đầu vào từ tệp tin errors.txt
less < errors.txt
```

### Tệp tin `/dev/null`

Nếu muốn thực thi một lệnh nhưng không muốn hiển thị kết quả đầu ra trên màn hình, bạn có thể Chuyển hướng đầu ra đến /dev/null:

```shell
$ command > /dev/null
```

/dev/null là một tệp tin đặc biệt, nội dung được ghi vào nó sẽ bị loại bỏ; nếu cố gắng đọc nội dung từ tệp tin này, bạn sẽ không đọc được gì cả. Tuy nhiên, tệp tin /dev/null rất hữu ích, việc Chuyển hướng đầu ra của lệnh đến nó sẽ có hiệu quả "vô hiệu hóa đầu ra".

Nếu muốn ẩn stdout và stderr, bạn có thể viết như sau:

```shell
$ command > /dev/null 2>&1
```

## Debug

Shell cung cấp các công cụ để gỡ lỗi các tập lệnh.

Nếu bạn muốn chạy một tập lệnh trong chế độ gỡ lỗi, bạn có thể sử dụng một tùy chọn đặc biệt trong shebang của nó:

```
#!/bin/bash options
```

options là một số tùy chọn có thể thay đổi hành vi của shell. Dưới đây là một số tùy chọn có thể hữu ích cho bạn:

| Ngắn gọn | Tên          | Mô tả                                                      |
| -------- | ------------ | ---------------------------------------------------------- |
| `-f`     | noglob       | Vô hiệu hóa mở rộng tên tệp (globbing)                      |
| `-i`     | interactive  | Chạy tập lệnh trong chế độ _tương tác_                       |
| `-n`     | noexec       | Đọc các lệnh nhưng không thực thi (kiểm tra cú pháp)         |
| `-t`     | —            | Thoát sau khi thực thi lệnh đầu tiên                         |
| `-v`     | verbose      | In ra mỗi lệnh trước khi thực thi nó                        |
| `-x`     | xtrace       | In ra mỗi lệnh và các tham số mở rộng của nó trước khi thực thi |

Ví dụ, nếu chúng ta chỉ định `-x` trong tập lệnh của mình, như sau:

```shell
#!/bin/bash -x

for (( i = 0; i < 3; i++ )); do
  echo $i
done
```

Điều này sẽ in ra giá trị của biến và một số thông tin hữu ích khác trên `stdout`:

```shell
$ ./my_script
+ (( i = 0 ))
+ (( i < 3 ))
+ echo 0
0
+ (( i++  ))
+ (( i < 3 ))
+ echo 1
1
+ (( i++  ))
+ (( i < 3 ))
+ echo 2
2
+ (( i++  ))
+ (( i < 3 ))
```

Đôi khi chúng ta chỉ cần gỡ lỗi một phần của tập lệnh. Trong trường hợp này, sử dụng lệnh `set` sẽ rất tiện lợi. Lệnh này cho phép bạn bật hoặc tắt các tùy chọn. Sử dụng `-` để bật tùy chọn và `+` để tắt tùy chọn:

**💻 『Mã nguồn mẫu』**

```shell
# Bật chế độ gỡ lỗi
set -x
for (( i = 0; i < 3; i++ )); do
  printf ${i}
done
# Tắt chế độ gỡ lỗi
set +x
#  Output:
#  + (( i = 0 ))
#  + (( i < 3 ))
#  + printf 0
#  0+ (( i++  ))
#  + (( i < 3 ))
#  + printf 1
#  1+ (( i++  ))
#  + (( i < 3 ))
#  + printf 2
#  2+ (( i++  ))
#  + (( i < 3 ))
#  + set +x

for i in {1..5}; do printf ${i}; done
printf "\n"
#  Output: 12345
```

## Tài liệu tham khảo

- [awesome-shell](https://github.com/alebcay/awesome-shell) - Danh sách tài nguyên về shell
- [awesome-bash](https://github.com/awesome-lists/awesome-bash) - Danh sách tài nguyên về bash
- [bash-handbook](https://github.com/denysdovhan/bash-handbook)
- [bash-guide](https://github.com/vuuihc/bash-guide) - Hướng dẫn cơ bản về cách sử dụng bash
- [bash-it](https://github.com/Bash-it/bash-it) - Một framework đáng tin cậy để sử dụng hàng ngày, phát triển và duy trì các tập lệnh shell và các lệnh tùy chỉnh của bạn
- [dotfiles.github.io](http://dotfiles.github.io/) - Cung cấp các bộ sưu tập dotfiles cho bash và các shell khác, cũng như liên kết đến các framework shell
- [Hướng dẫn Shell của tutorialspoint](https://www.tutorialspoint.com/unix/shell_scripting.htm)
- [shellcheck](https://github.com/koalaman/shellcheck) - Một công cụ phân tích tĩnh cho shell script, thực chất là một công cụ lint cho bash/sh/zsh.

Cuối cùng, trên Stack Overflow, có rất nhiều câu hỏi về bash trong [thẻ bash](https://stackoverflow.com/questions/tagged/bash), bạn có thể học hỏi từ những câu hỏi đó và cũng có thể đặt câu hỏi của riêng bạn khi gặp vấn đề.
