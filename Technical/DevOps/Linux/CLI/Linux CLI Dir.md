---
title: Linux CLI Dir
tags: [linux]
categories: [linux]
date created: 2023-09-03
date modified: 2023-09-03
---

# Quản lý Thư mục và Tệp tin trong Linux

> Từ khóa: `cd`, `ls`, `pwd`, `mkdir`, `rmdir`, `tree`, `touch`, `ln`, `rename`, `stat`, `file`, `chmod`, `chown`, `locate`, `find`, `cp`, `scp`, `mv`, `rm`

## 1. Cơ chế làm việc với Thư mục và Tệp tin trong Linux

Cấu trúc thư mục Linux có cấu trúc cây, với thư mục gốc là `/`. Dưới đây là một sơ đồ minh họa các thư mục và chức năng của chúng:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snapsnaplinux-system-directoies-poster.webp)

### 1.2. Thuộc tính Tệp tin Linux

Hệ điều hành Linux là một hệ thống đa người dùng, các người dùng khác nhau có các quyền truy cập khác nhau vào cùng một tệp tin (bao gồm cả thư mục). Để bảo vệ tính bảo mật của hệ thống, Linux áp đặt các quy tắc khác nhau cho quyền truy cập của người dùng khác nhau vào cùng một tệp tin.  
Trong Linux, bạn có thể sử dụng lệnh `ll` hoặc `ls -l` để hiển thị thuộc tính của một tệp tin và người sở hữu và nhóm của tệp tin đó, ví dụ:

```bash
$ ls -l
total 64
dr-xr-xr-x 2 root root 4096 Dec 14 2012 bin
dr-xr-xr-x 4 root root 4096 Apr 19 2012 boot
```

Trong ví dụ trên, thuộc tính đầu tiên của tệp tin `bin` được đại diện bởi ký tự `d`. Ký tự `d` trong Linux đại diện cho tệp tin là một thư mục.  
Trong Linux, ký tự đầu tiên xác định loại tệp tin, bao gồm thư mục, tệp tin, liên kết tệp tin, v.v.

- Khi là `d`, đó là thư mục
- Khi là `-`, đó là tệp tin
- Khi là `l`, đó là liên kết tệp tin
- Khi là `b`, đó là tệp tin thiết bị lưu trữ có thể ghi
- Khi là `c`, đó là tệp tin thiết bị nối tiếp, chẳng hạn như bàn phím, chuột (đọc tệp tin duy nhất)

Các ký tự tiếp theo, được nhóm chia thành các nhóm 3 ký tự, đại diện cho các quyền `rwx`. Trong đó, `r` đại diện cho quyền đọc (read), `w` đại diện cho quyền ghi (write), `x` đại diện cho quyền thực thi (execute). Lưu ý rằng vị trí của ba quyền này không thay đổi, nếu không có quyền, sẽ có dấu trừ `-`.

Mỗi tệp tin có thuộc tính được xác định bởi 10 ký tự đầu tiên (như hình dưới đây).

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap20230903004052.png)

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap20230903003657.png)

Từ trái sang phải, các số từ 0 đến 9 được sử dụng để đại diện cho các thuộc tính khác nhau.

- Chữ số 0 xác định loại tệp tin
- Chữ số 1-3 xác định quyền sở hữu (chủ sở hữu tệp tin) của tệp tin đó.
- Chữ số 4-6 xác định quyền sở hữu nhóm (người dùng cùng nhóm với chủ sở hữu) của tệp tin đó.
- Chữ số 7-9 xác định quyền của người dùng khác.

Chữ số 1, 4 và 7 đại diện cho quyền đọc; nếu được biểu thị bằng ký tự "r", có quyền đọc; nếu biểu thị bằng ký tự "-", không có quyền đọc.  
Chữ số 2, 5 và 8 đại diện cho quyền ghi; nếu được biểu thị bằng ký tự "w", có quyền ghi; nếu biểu thị bằng ký tự "-", không có quyền ghi.  
Chữ số 3, 6 và 9 đại diện cho quyền thực thi; nếu được biểu thị bằng ký tự "x", có quyền thực thi; nếu biểu thị bằng ký tự "-", không có quyền thực thi.

#### 1.2.1. Chủ sở hữu và nhóm của Tệp tin Linux

```bash
$ ls -l
total 64
dr-xr-xr-x   2 root root 4096 Dec 14  2012 bin
dr-xr-xr-x   4 root root 4096 Apr 19  2012 boot
```

- Đối với tệp tin, nó có một chủ sở hữu cụ thể, tức là người dùng sở hữu tệp tin đó.
- Đồng thời, trong hệ thống Linux, người dùng được phân loại thành các nhóm, một người dùng thuộc một hoặc nhiều nhóm.
- Tệp tin chủ sở hữu và nhóm tệp tin xác định quyền truy cập khác nhau của người dùng vào cùng một tệp tin.
- Do đó, hệ thống Linux xác định quyền truy cập khác nhau cho chủ sở hữu tệp tin, người dùng cùng nhóm với chủ sở hữu và người dùng khác vào cùng một tệp tin.
- Trong ví dụ trên, tệp tin `bin` là một thư mục, chủ sở hữu và nhóm của nó đều là root, chủ sở hữu có quyền đọc, ghi và thực thi; người dùng cùng nhóm khác có quyền đọc và thực thi; người dùng khác cũng có quyền đọc và thực thi.

## 2. Quản lý Thư mục và Tệp tin trong Linux

### 2.1. Quản lý Thư mục

- Thay đổi thư mục làm việc - Sử dụng [cd](app://obsidian.md/index.html#cd)
- Xem thông tin thư mục - Sử dụng [ls](app://obsidian.md/index.html#ls)
- Hiển thị đường dẫn tuyệt đối của thư mục hiện tại - Sử dụng [pwd](app://obsidian.md/index.html#pwd)
- Hiển thị cây thư mục - Sử dụng [tree](app://obsidian.md/index.html#tree)
- Tạo thư mục mới - Sử dụng [mkdir](app://obsidian.md/index.html#mkdir)
- Xóa thư mục - Sử dụng [rmdir](app://obsidian.md/index.html#rmdir)

### 2.2. Quản lý Tệp tin

- Tạo tệp tin trống - Sử dụng [touch](app://obsidian.md/index.html#touch)
- Tạo liên kết cho tệp tin - Sử dụng [ln](app://obsidian.md/index.html#ln)
- Đổi tên nhiều tệp tin cùng một lúc - Sử dụng [rename](app://obsidian.md/index.html#rename)
- Hiển thị thông tin chi tiết của tệp tin - Sử dụng [stat](app://obsidian.md/index.html#stat)
- Xác định loại tệp tin - Sử dụng [file](app://obsidian.md/index.html#file)
- Đặt quyền truy cập cho tệp tin hoặc thư mục - Sử dụng [chmod](app://obsidian.md/index.html#chmod)
- Đặt chủ sở hữu hoặc nhóm cho tệp tin hoặc thư mục - Sử dụng [chown](app://obsidian.md/index.html#chown)
- Tìm kiếm tệp tin hoặc thư mục - Sử dụng [locate](app://obsidian.md/index.html#locate)
- Tìm kiếm tệp tin trong thư mục cụ thể - Sử dụng [find](app://obsidian.md/index.html#find)
- Tìm kiếm đường dẫn tuyệt đối của một lệnh - Sử dụng [which](app://obsidian.md/index.html#which)
- Tìm kiếm các tệp tin, chương trình, v.v. liên quan đến một lệnh - Sử dụng [whereis](app://obsidian.md/index.html#whereis)

### 2.3. Quản lý chung cho Thư mục và Tệp tin

- Sao chép tệp tin hoặc thư mục - Sử dụng [cp](app://obsidian.md/index.html#cp)
- Sao chép tệp tin hoặc thư mục đến máy chủ từ xa - Sử dụng [scp](app://obsidian.md/index.html#scp)
- Di chuyển tệp tin hoặc thư mục - Sử dụng [mv](app://obsidian.md/index.html#mv)
- Xóa tệp tin hoặc thư mục - Sử dụng [rm](app://obsidian.md/index.html#rm)

## 3. Cách sử dụng của các lệnh phổ biến

### 3.1. cd

> Lệnh cd được sử dụng để chuyển đổi thư mục làm việc.
>
> Tham khảo: http://man.linuxde.net/cd

Ví dụ:

```bash
cd          # Chuyển đến thư mục chính của người dùng
cd ~        # Chuyển đến thư mục chính của người dùng
cd -        # Chuyển đến thư mục làm việc trước đó
cd ..       # Chuyển đến thư mục cha
cd ../..    # Chuyển đến thư mục cha của thư mục cha
```

### 3.2. ls

> Lệnh ls được sử dụng để hiển thị thông tin về thư mục.
>
> Tham khảo: http://man.linuxde.net/ls

Ví dụ:

```bash
ls        # Liệt kê các tệp tin hiện có trong thư mục hiện tại
ls -l     # Liệt kê thông tin chi tiết về các tệp tin hiện có trong thư mục hiện tại
ls -la    # Liệt kê thông tin chi tiết về tất cả các tệp tin (bao gồm cả tệp tin ẩn)
ls -lh    # Liệt kê thông tin chi tiết và hiển thị kích thước tệp tin dễ đọc
ls -lt    # Liệt kê thông tin chi tiết về các tệp tin và thư mục theo thời gian sửa đổi
ls -ltr   # Liệt kê thông tin chi tiết về các tệp tin và thư mục theo thời gian sửa đổi (đảo ngược)
ls --color=auto     # Liệt kê các tệp tin và sắp xếp màu sắc cho từng loại tệp tin
```

### 3.3. pwd

> Lệnh pwd được sử dụng để hiển thị đường dẫn tuyệt đối của thư mục hiện tại.
>
> Tham khảo: http://man.linuxde.net/pwd

### 3.4. mkdir

> Lệnh mkdir được sử dụng để tạo thư mục.
>
> Tham khảo: http://man.linuxde.net/mkdir

Ví dụ:

```bash
# Tạo thư mục con test trong thư mục hiện tại
mkdir test

# Tạo thư mục con test trong thư mục hiện tại; đặt quyền truy cập là chủ sở hữu có quyền đọc, ghi và thực thi, nhóm người dùng cùng nhóm có quyền đọc và thực thi, người dùng khác không có quyền truy cập
mkdir -m 750 test
```

### 3.5. rmdir

> Lệnh rmdir được sử dụng để xóa thư mục trống.
>
> Tham khảo: http://man.linuxde.net/rmdir

Ví dụ:

```bash
# Xóa thư mục con test và thư mục cha zp
rmdir -p zp/test
```

### 3.6. tree

> Lệnh tree được sử dụng để hiển thị cây thư mục.
>
> Tham khảo: http://man.linuxde.net/tree

Ví dụ:

```bash
# Liệt kê tên tệp tin cấp 1 trong thư mục /private
tree /private -L 1
/private/
├── etc
├── tftpboot
├── tmp
└── var

# Bỏ qua các thư mục
tree -I node_modules            # Bỏ qua thư mục node_modules trong thư mục hiện tại
tree -P node_modules            # Liệt kê cấu trúc thư mục của thư mục node_modules trong thư mục hiện tại
tree -P node_modules -L 2       # Hiển thị cây thư mục của thư mục node_modules trong thư mục hiện tại với độ sâu 2
tree -L 2 > /home/www/tree.txt  # Lưu kết quả cây thư mục hiện tại vào tệp tree.txt

# Bỏ qua nhiều thư mục
tree -I 'node_modules|icon|font' -L 2
```

### 3.7. touch

> Lệnh touch có hai chức năng: một là cập nhật nhãn thời gian của tệp tin đã tồn tại thành thời gian hiện tại của hệ thống (mặc định), dữ liệu của tệp tin sẽ được giữ nguyên; hai là tạo tệp tin trống.
>
> Tham khảo: http://man.linuxde.net/touch

Ví dụ:

```bash
touch ex2
```

### 3.8. ln

> Lệnh ln được sử dụng để tạo liên kết cho tệp tin, có hai loại liên kết là liên kết cứng và liên kết mềm, loại liên kết mặc định là liên kết cứng. Nếu muốn tạo liên kết mềm, bạn phải sử dụng tùy chọn "-s".
>
> 🔔 Lưu ý: Tệp tin liên kết mềm không phải là một tệp tin độc lập, nó chia sẻ nhiều thuộc tính với tệp tin nguồn, do đó việc đặt quyền truy cập cho tệp tin liên kết mềm không có ý nghĩa.
>
> Tham khảo: http://man.linuxde.net/ln

Ví dụ:

```bash
# Liên kết tệp tin m2.c trong thư mục /usr/mengqc/mub1 với tệp tin a2.c trong thư mục /usr/liu
cd /usr/mengqc
ln /mub1/m2.c /usr/liu/a2.c

# Tạo liên kết mềm từ thư mục /usr/mengqc/mub1 đến tệp tin abc trong thư mục /usr/liu
# Sau khi thực hiện lệnh này, đường dẫn /usr/mengqc/mub1 sẽ được lưu trữ trong tệp tin có tên /usr/liu/abc
ln -s /usr/mengqc/mub1 /usr/liu/abc
```

### 3.9. rename

> Lệnh rename được sử dụng để đổi tên nhiều tệp tin cùng một lúc bằng cách thay thế chuỗi.
>
> Tham khảo: http://man.linuxde.net/rename

Ví dụ:

```bash
# Đổi tên tệp tin main1.c thành main.c
rename main1.c main.c main1.c

rename "s/AA/aa/" *             # Thay thế chuỗi AA trong tên tệp tin thành aa
rename "s//.html//.php/" *      # Thay thế phần mở rộng .html thành .php
rename "s/$//.txt/" *           # Thêm phần mở rộng .txt vào tên tất cả các tệp tin
rename "s//.txt//" *            # Xóa phần mở rộng .txt khỏi tên tất cả các tệp tin
```

### 3.10. stat

> Lệnh stat được sử dụng để hiển thị thông tin trạng thái của tệp tin. Lệnh stat cung cấp thông tin chi tiết hơn so với lệnh ls.
>
> Tham khảo: http://man.linuxde.net/stat

Ví dụ:

```bash
stat myfile
```

### 3.11. file

> Lệnh file được sử dụng để xác định loại của tệp tin được cung cấp. Lệnh file kiểm tra tệp tin dựa trên ba quá trình: kiểm tra hệ thống tệp tin, kiểm tra số phép màu và kiểm tra ngôn ngữ.
>
> Tham khảo: http://man.linuxde.net/file

Ví dụ:

```bash
file install.log          # Hiển thị loại tệp tin
file -b install.log       # Không hiển thị tên tệp tin
file -i install.log       # Hiển thị loại MIME
file -L /var/spool/mail   # Hiển thị loại tệp tin của liên kết tượng trưng
```

### 3.12. chmod

> Lệnh chmod được sử dụng để thay đổi quyền truy cập của tập tin hoặc thư mục trong hệ thống. Trong họ hàng hệ thống UNIX, quyền truy cập vào tập tin hoặc thư mục được phân biệt bằng ba quyền chung là đọc, ghi và thực thi, cùng với ba quyền đặc biệt khác có thể sử dụng. Người dùng có thể sử dụng lệnh chmod để thay đổi quyền truy cập của tập tin và thư mục, có thể sử dụng cả cách thiết lập bằng chữ hoặc số. Quyền truy cập của liên kết biểu tượng không thể thay đổi, nếu người dùng thay đổi quyền truy cập của liên kết biểu tượng, sự thay đổi sẽ áp dụng cho tập tin gốc được liên kết.
>
> Tham khảo: http://man.linuxde.net/chmod

Mở rộng kiến thức:

Trong Linux, người dùng được chia thành: chủ sở hữu, nhóm (Group) và người khác (other). Trong hệ thống Linux, mặc định, tất cả các tài khoản và người dùng thông thường, cũng như thông tin liên quan đến root, được ghi lại trong tệp `/etc/passwd`. Mật khẩu của mỗi người được ghi lại trong tệp `/etc/shadow`. Ngoài ra, tất cả các tên nhóm được ghi lại trong `/etc/group`!

Biểu đồ phân tích quyền truy cập của tệp tin Linux

```bash
  -rw-r--r--   1 user  staff   651 Oct 12 12:53 .gitmodules
# ↑╰┬╯╰┬╯╰┬╯
# ┆ ┆  ┆  ╰┈ 0 Người khác
# ┆ ┆  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ g Nhóm
# ┆ ╰┈┈┈┈ u Chủ sở hữu
# ╰┈┈ Chữ cái đầu tiên `d` đại diện cho thư mục, `-` đại diện cho tệp thông thường
```

Ví dụ: rwx 　 rw-　 r--

r=Quyền đọc　　//Giá trị＝ 4  
w=Quyền ghi　　//Giá trị＝ 2  
x=Quyền thực thi　　//Giá trị＝ 1

Ví dụ:

```bash
chmod u+x,g+w f01　　# Đặt quyền thực thi cho chính mình và cho phép thành viên nhóm ghi vào tệp f01
chmod u=rwx,g=rw,o=r f01
chmod 764 f01
chmod a+x f01　　    # Đặt quyền thực thi cho tệp f01 cho cả chủ sở hữu, nhóm và người khác

# Đặt quyền 755 cho tất cả các tệp tin và thư mục trong /home/wwwroot/
chmod -R  755 /home/wwwroot/*
```

### 3.13. chown

> Lệnh chown thay đổi chủ sở hữu và nhóm sở hữu của một tệp tin hoặc thư mục cụ thể. Lệnh này có thể cấp quyền cho một người dùng cụ thể, khiến người dùng đó trở thành chủ sở hữu của tệp tin được chỉ định hoặc thay đổi nhóm sở hữu của tệp tin. Người dùng có thể là tên người dùng hoặc người dùng D, và nhóm người dùng có thể là tên nhóm hoặc id nhóm. Tên tệp tin có thể là danh sách các tệp tin phân tách bằng khoảng trắng và có thể chứa ký tự đại diện.
>
> Chỉ có chủ sở hữu tệp tin và người dùng siêu người dùng mới có thể sử dụng lệnh này.
>
> Tham khảo: http://man.linuxde.net/chown

Ví dụ:

```bash
# Đặt chủ sở hữu của thư mục /usr/meng và tất cả các tệp tin và thư mục con thành liu
chown -R liu /usr/meng
```

### 3.14. locate

> Lệnh locate và lệnh slocate được sử dụng để tìm kiếm tệp tin hoặc thư mục.
>
> Lệnh locate thực chất là một cách viết khác của lệnh find -name, nhưng nó nhanh hơn nhiều vì nó không tìm kiếm trong các thư mục cụ thể, mà thay vào đó tìm kiếm trong cơ sở dữ liệu /var/lib/locatedb, cơ sở dữ liệu này chứa thông tin về tất cả các tệp tin trong hệ thống. Linux tự động tạo cơ sở dữ liệu này và cập nhật mỗi ngày, vì vậy khi sử dụng lệnh locate, không thể tìm thấy các tệp tin đã thay đổi gần đây nhất. Để tránh tình trạng này, bạn có thể sử dụng lệnh updatedb để cập nhật cơ sở dữ liệu thủ công trước khi sử dụng lệnh locate.
>
> Tham khảo: http://man.linuxde.net/locate_slocate

Ví dụ:

```bash
locate pwd      # Tìm kiếm tất cả các tệp tin liên quan đến pwd
locate /etc/sh  # Tìm kiếm tất cả các tệp tin bắt đầu bằng sh trong thư mục etc
```

### 3.15. find

> Lệnh find được sử dụng để tìm kiếm tệp tin trong thư mục được chỉ định. Bất kỳ chuỗi nào đứng trước các tham số sẽ được coi là tên thư mục cần tìm kiếm. Nếu không có tham số nào được đặt, lệnh find sẽ tìm kiếm tất cả các thư mục con và tệp tin trong thư mục hiện tại và hiển thị chúng.
>
> Tham khảo: http://man.linuxde.net/find

```bash
# Tìm kiếm tất cả các tệp tin trong thư mục hiện tại có nội dung chứa "140.206.111.111"
find . -type f -name "*" | xargs grep "140.206.111.111"

# Liệt kê tất cả các tệp tin và thư mục trong thư mục hiện tại và các thư mục con
find .

# Tìm kiếm tất cả các tệp tin trong thư mục /home có phần mở rộng là .txt
find /home -name "*.txt"
# Tương tự như trên, nhưng không phân biệt chữ hoa chữ thường
find /home -iname "*.txt"

# Tìm kiếm tất cả các tệp tin trong thư mục hiện tại và các thư mục con có phần mở rộng là .txt hoặc .pdf
find . -name "*.txt" -o -name "*.pdf"

# Tìm kiếm các tệp tin hoặc thư mục phù hợp với mẫu đường dẫn
find /usr/ -path "*local*"

# Tìm kiếm các tệp tin hoặc thư mục phù hợp với biểu thức chính quy
find . -regex ".*\(\.txt\|\.pdf\)$"
# Tương tự như trên, nhưng không phân biệt chữ hoa chữ thường
find . -iregex ".*\(\.txt\|\.pdf\)$"

# Tìm kiếm các tệp tin trong thư mục /home không có phần mở rộng là .txt
find /home ! -name "*.txt"
```

### 3.16. cp

> Lệnh cp được sử dụng để sao chép một hoặc nhiều tệp tin hoặc thư mục đến một tệp tin hoặc thư mục đích. Nó có thể sao chép một tệp tin đơn thành một tệp tin cụ thể với tên đã chỉ định hoặc sao chép vào một thư mục đã tồn tại. Lệnh cp cũng hỗ trợ sao chép nhiều tệp tin cùng một lúc, trong trường hợp này, tham số đích phải là một thư mục đã tồn tại, nếu không sẽ xảy ra lỗi.
>
> Tham khảo: http://man.linuxde.net/cp

Ví dụ:

#### 3.16.1. Tham số

- Tệp tin nguồn: Xác định danh sách các tệp tin nguồn. Mặc định, lệnh cp không thể sao chép thư mục, nếu muốn sao chép thư mục, phải sử dụng tùy chọn `-R`.
- Tệp tin đích: Xác định tệp tin đích. Khi có nhiều tệp tin nguồn, tệp tin đích phải là một thư mục đã tồn tại.

Ví dụ:

```bash
# Sao chép tệp tin file vào thư mục /usr/men/tmp và đổi tên thành file1
cp file /usr/men/tmp/file1

# Sao chép tất cả các tệp tin và thư mục trong /usr/men và các thư mục con vào thư mục /usr/zh
cp -r /usr/men /usr/zh

# Sao chép tất cả các tệp tin và thư mục trong /usr/men vào thư mục /usr/zh, bất kể có tệp tin trùng lặp hay không
cp -rf /usr/men/* /usr/zh

# Sao chép tất cả các tệp tin trong /usr/men có tiền tố là m và có phần mở rộng là .c vào thư mục /usr/zh
cp -i /usr/men m*.c /usr/zh
```

### 3.17. scp

> Lệnh scp được sử dụng để sao chép tệp tin từ xa trên Linux. Nó tương tự như lệnh cp, nhưng lệnh cp chỉ có thể sao chép trên cùng một máy và không thể sao chép qua các máy chủ khác, trong khi scp thực hiện việc truyền tải qua mạng được mã hóa. Điều này có thể ảnh hưởng đến tốc độ một chút. Khi ổ đĩa của máy chủ trở thành chỉ đọc read only system, bạn có thể sử dụng scp để di chuyển tệp tin ra khỏi máy chủ. Ngoài ra, scp không tốn nhiều tài nguyên và không tăng gánh nặng hệ thống, điều này khác với rsync. Mặc dù rsync có tốc độ nhanh hơn scp một chút, nhưng khi có nhiều tệp tin nhỏ, rsync sẽ gây ra tải I/O ổ cứng cao, trong khi scp gần như không ảnh hưởng đến việc sử dụng hệ thống bình thường.

示例：

```bash
# Sao chép tệp tin vào thư mục được chỉ định trên máy chủ từ xa
scp <file> <user>@<ip>:<url>
scp test.txt root@192.168.0.1:/opt

# Sao chép thư mục vào thư mục được chỉ định trên máy chủ từ xa
scp -r <folder> <user>@<ip>:<url>
scp -r test root@192.168.0.1:/opt
```

#### 3.17.1. Sao chép không cần mật khẩu

(1) Tạo cặp khóa công khai và khóa riêng ssh

```
ssh-keygen -t rsa
```

(2) Sao chép nội dung của tệp `~/.ssh/id_rsa.pub` trên máy chủ A vào tệp `~/.ssh/authorized_keys` trên máy chủ B.

```bash
# Thực hiện lệnh sau trên máy chủ A
scp ~/.ssh/id_rsa.pub root@192.168.0.2:~/.ssh/id_rsa.pub.tmp

# Thực hiện lệnh sau trên máy chủ B
cat ~/.ssh/id_rsa.pub.tmp >> ~/.ssh/authorized_keys
rm ~/.ssh/id_rsa.pub.tmp
```

### 3.18. mv

> Lệnh mv được sử dụng để đổi tên tệp tin hoặc thư mục, hoặc di chuyển tệp tin từ một thư mục đến thư mục khác. Source đại diện cho tệp tin hoặc thư mục nguồn, target đại diện cho tệp tin hoặc thư mục đích. Nếu di chuyển một tệp tin vào một tệp tin đích đã tồn tại, nội dung của tệp tin đích sẽ bị ghi đè.
>
> Tham khảo: http://man.linuxde.net/mv

Ví dụ:

```bash
mv file1.txt /home/office/                      # Di chuyển một tệp tin đơn
mv file2.txt file3.txt file4.txt /home/office/  # Di chuyển nhiều tệp tin
mv *.txt /home/office/                          # Di chuyển tất cả các tệp tin có phần mở rộng là .txt
mv dir1/ /home/office/                          # Di chuyển thư mục
mv /usr/men/* .                                 # Di chuyển tất cả các tệp tin trong thư mục chỉ định vào thư mục hiện tại

mv file1.txt file2.txt          # Đổi tên tệp tin
mv dir1/ dir2/                  # Đổi tên thư mục
mv -v *.txt /home/office        # Hiển thị thông tin di chuyển
mv -i file1.txt /home/office    # Hỏi trước khi ghi đè tệp tin

mv -uv *.txt /home/office       # Chỉ di chuyển nếu tệp nguồn mới hơn tệp đích
mv -vn *.txt /home/office       # Không ghi đè lên bất kỳ tệp tin nào đã tồn tại
mv -f *.txt /home/office        # Ghi đè lên tệp tin đã tồn tại mà không cần xác nhận
mv -bv *.txt /home/office       # Tạo bản sao khi di chuyển
```

### 3.19. rm

> Lệnh rm được sử dụng để xóa một hoặc nhiều tệp tin hoặc thư mục trong một thư mục. Đối với tệp tin liên kết, chỉ xóa tệp tin liên kết và tệp tin gốc vẫn được giữ nguyên.
>
> Tham khảo: http://man.linuxde.net/rm

```bash
rm test.txt               # Xóa tệp tin
rm -i test.txt test2.txt  # Xóa tệp tin với yêu cầu xác nhận
rm -r *                   # Xóa tất cả các tệp tin và thư mục trong thư mục hiện tại
rm -r testdir             # Xóa tất cả các tệp tin và thư mục trong thư mục
rm -rf testdir            # Xóa tất cả các tệp tin và thư mục trong thư mục mà không cần xác nhận
rm -v testdir             # Hiển thị thông tin chi tiết về quá trình xóa
```
