---
title: Linux CLI File
tags: [linux]
categories: [linux]
date created: 2023-09-03
date modified: 2023-09-03
---

# Xem và chỉnh sửa nội dung tệp trên Linux

> Từ khóa: `cat`, `head`, `tail`, `more`, `less`, `sed`, `vi`, `grep`

## 1. Điểm cần lưu ý khi xem và chỉnh sửa nội dung tệp trên Linux

- Kết nối các tệp và in chúng ra thiết bị đầu ra tiêu chuẩn - Sử dụng [cat](#cat)
- Hiển thị một số dòng đầu của tệp được chỉ định - Sử dụng [head](#head)
- Hiển thị một số dòng cuối của tệp được chỉ định, thường được sử dụng để in nội dung tệp nhật ký theo thời gian thực - Sử dụng [tail](#tail)
- Hiển thị nội dung tệp, hiển thị mỗi lần một màn hình - Sử dụng [more](#more)
- Hiển thị nội dung tệp, hiển thị mỗi lần một màn hình - Sử dụng [less](#less)
- Tự động chỉnh sửa một hoặc nhiều tệp; đơn giản hóa việc thao tác lặp lại trên tệp; viết chương trình chuyển đổi v.v. - Sử dụng [sed](#sed)
- Trình chỉnh sửa văn bản - Sử dụng [vi](#vi)
- Tìm kiếm văn bản bằng biểu thức chính quy và in ra các dòng khớp - Sử dụng [grep](#grep)

## 2. Các cách sử dụng phổ biến của các lệnh

### 2.1. cat

> Lệnh cat được sử dụng để kết nối các tệp và in chúng ra thiết bị đầu ra tiêu chuẩn.
>
> Tham khảo: http://man.linuxde.net/cat

Ví dụ:

```bash
cat m1              # Hiển thị nội dung của tệp ml trên màn hình
cat m1 m2           # Đồng thời hiển thị nội dung của tệp ml và m2
cat m1 m2 > file    # Kết hợp nội dung của tệp ml và m2 và lưu vào tệp file
```

### 2.2. head

> Lệnh head được sử dụng để hiển thị nội dung đầu của tệp. Mặc định, lệnh head hiển thị 10 dòng đầu của tệp.
>
> Tham khảo: http://man.linuxde.net/head

### 2.3. tail

> Lệnh tail được sử dụng để hiển thị nội dung cuối của tệp. Mặc định, lệnh tail hiển thị 10 dòng cuối của tệp. Nếu có nhiều tệp được chỉ định, lệnh sẽ hiển thị tiêu đề tên tệp trước mỗi tệp. Nếu không chỉ định tệp hoặc tên tệp là "-", lệnh sẽ đọc từ đầu vào tiêu chuẩn.
>
> Tham khảo: http://man.linuxde.net/tail

Ví dụ:

```bash
tail file           # Hiển thị 10 dòng cuối của tệp file
tail -n +20 file    # Hiển thị nội dung của tệp file từ dòng 20 đến cuối tệp
tail -c 10 file     # Hiển thị 10 ký tự cuối cùng của tệp file
```

### 2.4. more

> Lệnh more là một bộ lọc văn bản dựa trên trình chỉnh sửa vi, nó hiển thị nội dung của tệp văn bản theo trang trên toàn màn hình và hỗ trợ các phím tắt tìm kiếm từ khóa trong vi. Lệnh more hiển thị một trang văn bản mỗi lần, khi đầy màn hình, nó sẽ dừng lại và hiển thị một thông báo dưới cùng của màn hình, cho biết phần trăm đã hiển thị của tệp: --More--(XX%). Bạn có thể sử dụng các phím tắt sau để trả lời thông báo:
>
> - Nhấn phím Space: Hiển thị trang văn bản tiếp theo.
> - Nhấn phím Enter: Chỉ hiển thị dòng văn bản tiếp theo.
> - Nhấn phím /: Sau đó nhập một mẫu để tìm kiếm tiếp theo trong văn bản.
> - Nhấn phím H: Hiển thị màn hình trợ giúp với thông tin liên quan.
> - Nhấn phím B: Hiển thị trang văn bản trước đó.
> - Nhấn phím Q: Thoát khỏi lệnh more.
>
> Tham khảo: http://man.linuxde.net/more

Ví dụ:

```bash
# Hiển thị nội dung của tệp file, xóa màn hình trước khi hiển thị và hiển thị phần trăm đã hiển thị của tệp ở dưới cùng màn hình.
more -dc file

# Hiển thị nội dung của tệp file, hiển thị mỗi 10 dòng và xóa màn hình trước khi hiển thị.
more -c -10 file
```

### 2.5. less

> Lệnh less có chức năng tương tự như lệnh more, cả hai đều được sử dụng để duyệt nội dung của tệp văn bản. Tuy nhiên, lệnh less cho phép người dùng di chuyển lên hoặc xuống trong tệp, trong khi lệnh more chỉ cho phép di chuyển xuống. Khi sử dụng lệnh less để hiển thị tệp, bạn có thể sử dụng phím PageUp để di chuyển lên trang trước, phím PageDown để di chuyển xuống trang tiếp theo. Để thoát khỏi chương trình less, bạn nên nhấn phím Q.
>
> Tham khảo: http://man.linuxde.net/less

Ví dụ:

```bash
less /var/log/shadowsocks.log
```

### 2.6. sed

> sed là một trình biên tập luồng, nó là một công cụ xử lý văn bản mạnh mẽ, hoạt động tốt với biểu thức chính quy và có nhiều chức năng. Khi xử lý, nó lưu trữ dòng đang xử lý trong bộ đệm tạm thời được gọi là "không gian mẫu" (pattern space), sau đó sử dụng lệnh sed để xử lý nội dung của bộ đệm. Sau khi hoàn thành xử lý, nội dung của bộ đệm được gửi đến màn hình. Sau đó, nó tiếp tục xử lý dòng tiếp theo, lặp lại quá trình này cho đến khi kết thúc tệp. Nội dung tệp không thay đổi trừ khi bạn sử dụng chuyển hướng để lưu đầu ra. Sed chủ yếu được sử dụng để tự động chỉnh sửa một hoặc nhiều tệp; đơn giản hóa thao tác lặp lại trên tệp; viết chương trình chuyển đổi v.v.
>
> Tham khảo: http://man.linuxde.net/sed

Ví dụ:

```bash
# Thay thế chuỗi trong văn bản
sed 's/book/books/' file

# Sử dụng tùy chọn -n và lệnh p để chỉ in các dòng đã thay thế
sed -n 's/test/TEST/p' file

# Tùy chọn chỉnh sửa tệp trực tiếp -i, sẽ thay thế từ "book" đầu tiên trong mỗi dòng của tệp bằng "books"
sed -i 's/book/books/g' file

# Sử dụng hậu tố /g sẽ thay thế tất cả các khớp trong mỗi dòng
sed 's/book/books/g' file

# Xóa các dòng trống trong tệp
sed '/^$/d' file

# Xóa dòng thứ 2 của tệp
sed '2d' file

# Xóa từ dòng thứ 2 đến cuối tệp
sed '2,$d' file

# Xóa dòng cuối cùng của tệp
sed '$d' file

# Xóa tất cả các dòng bắt đầu bằng "test" trong tệp
sed '/^test/'d file
```

### 2.7. vi

> Lệnh vi là một trình chỉnh sửa toàn màn hình phổ biến nhất trên hệ điều hành UNIX và các hệ điều hành tương tự UNIX. Trình chỉnh sửa vi trên Linux được gọi là vim, đây là phiên bản nâng cao của vi (vi Improved), hoàn toàn tương thích với trình chỉnh sửa vi và cung cấp nhiều tính năng nâng cao hơn.
>
> Tham khảo: http://man.linuxde.net/vi
>
> Đọc thêm: [Hướng dẫn sử dụng Vim](https://github.com/dunwu/OS/blob/master/docs/vim.md)

### 2.8. grep

> grep (global search regular expression (RE) and print out the line) là một công cụ tìm kiếm văn bản mạnh mẽ, nó sử dụng biểu thức chính quy để tìm kiếm văn bản và in ra các dòng khớp.
>
> Tham khảo: http://man.linuxde.net/grep

Ví dụ:

```bash
# Tìm kiếm đệ quy văn bản trong nhiều thư mục (đây là công cụ yêu thích của các lập trình viên để tìm kiếm mã nguồn):
$ grep "class" . -R -n

# Bỏ qua ký tự hoa thường trong mẫu khớp
$ echo "hello world" | grep -i "HELLO"

# Khớp nhiều mẫu:
$ grep -e "class" -e "vitural" file

# Chỉ tìm kiếm trong tất cả các tệp .php và .html trong thư mục
$ grep "main()" . -r --include *.{php,html}

# Loại bỏ tất cả các tệp README khỏi kết quả tìm kiếm
$ grep "main()" . -r --exclude "README"

# Loại bỏ các tệp được liệt kê trong danh sách filelist khỏi kết quả tìm kiếm
$ grep "main()" . -r --exclude-from filelist
```
