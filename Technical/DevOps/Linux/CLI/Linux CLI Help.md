---
title: Linux CLI Help
tags: [linux]
categories: [linux]
date created: 2023-09-03
date modified: 2023-09-03
---

# Xem thông tin trợ giúp về Linux Command

> Trong Linux có rất nhiều lệnh, việc nhớ tất cả chúng là một việc khó khăn. Vì vậy, tôi nghĩ bước đầu tiên để học Linux là hiểu cách tìm kiếm nhanh thông tin trợ giúp về các lệnh.
>
> Từ khóa: `help`, `whatis`, `info`, `which`, `whereis`, `man`

## 1. Điểm chính khi xem thông tin trợ giúp về lệnh Linux

- Xem thông tin trợ giúp về lệnh nội bộ của Shell - Sử dụng [help](#help)
- Xem mô tả ngắn gọn về lệnh - Sử dụng [whatis](#whatis)
- Xem mô tả chi tiết về lệnh - Sử dụng [info](#info)
- Xem vị trí của lệnh - Sử dụng [which](#which)
- Xác định vị trí các chương trình nhị phân, tệp mã nguồn và trang tài liệu man liên quan đến một lệnh - Sử dụng [whereis](#whereis)
- Xem hướng dẫn sử dụng lệnh (bao gồm giải thích, cách sử dụng và thông tin khác) - Sử dụng [man](#man)
- Chỉ nhớ một phần từ khóa của lệnh - Sử dụng man -k

> Lưu ý: Dưới đây là một số tài liệu hướng dẫn lệnh Linux tiếng Việt:
>
> - [Tổng hợp các câu lệnh trong Linux - Top 37 Linux Command](https://vietnix.vn/cac-cau-lenh-trong-linux/)
> - [Những lệnh Linux cơ bản ai cũng cần biết](https://quantrimang.com/cong-nghe/mot-so-lenh-linux-co-ban-60400)

## 2. Cách sử dụng phổ biến của các lệnh

### 2.1. help

> Lệnh help được sử dụng để xem thông tin trợ giúp về các lệnh nội bộ của Shell. Đối với thông tin trợ giúp về các lệnh bên ngoài, chỉ có thể sử dụng lệnh man hoặc info để xem.
>
> Tham khảo: http://man.linuxde.net/help

### 2.2. whatis

> Lệnh whatis được sử dụng để tra cứu chức năng của một lệnh.
>
> Tham khảo: http://man.linuxde.net/whatis

Ví dụ:

```bash
# Xem mô tả ngắn gọn về lệnh man
$ whatis man

# Xem mô tả ngắn gọn về các lệnh bắt đầu bằng "loca"
$ whatis -w "loca*"
```

### 2.3. info

> Lệnh info là lệnh trợ giúp trong định dạng info của Linux.
>
> Tham khảo: http://man.linuxde.net/info

Ví dụ:

```bash
# Xem thông tin chi tiết về lệnh man
$ info man
```

### 2.4. which

> Lệnh which được sử dụng để tìm và hiển thị đường dẫn tuyệt đối của một lệnh cụ thể. Biến môi trường PATH chứa các thư mục cần duyệt để tìm kiếm lệnh. Lệnh which sẽ tìm kiếm trong các thư mục này. Điều này có nghĩa là bạn có thể xem xem một lệnh cụ thể có tồn tại hay không và lệnh cụ thể đó được thực thi từ đâu.
>
> Tham khảo: http://man.linuxde.net/which

Ví dụ:

```bash
which pwd # Tìm đường dẫn của lệnh
```

Giải thích: Lệnh which sẽ tìm kiếm trong các thư mục được cấu hình trong biến môi trường PATH. Do đó, các cấu hình PATH khác nhau sẽ tìm thấy các lệnh khác nhau!

```bash
[root@localhost ~]# which cd
cd: shell built-in command
```

Lệnh cd này thường được sử dụng nhưng lại không tìm thấy! Tại sao vậy? Điều này là do cd là một lệnh được xây dựng sẵn trong bash! Nhưng lệnh which mặc định tìm trong các thư mục được quy định trong biến môi trường $PATH, vì vậy tất nhiên sẽ không tìm thấy!

### 2.5. whereis

> Lệnh whereis được sử dụng để xác định đường dẫn của các chương trình nhị phân, tệp mã nguồn và trang tài liệu man liên quan đến một lệnh cụ thể.
>
> Lệnh whereis chỉ tìm kiếm theo tên chương trình và chỉ tìm kiếm các tệp nhị phân (tham số -b), tệp hướng dẫn man (tham số -m) và tệp mã nguồn (tham số -s). Nếu bỏ qua tham số, lệnh sẽ trả về tất cả thông tin.
>
> Tham khảo: http://man.linuxde.net/whereis

Ví dụ:

```bash
whereis git # Tìm kiếm tất cả các tệp liên quan
```

### 2.6. man

> Lệnh man là lệnh trợ giúp trong Linux, cho phép xem trợ giúp về các lệnh, tệp cấu hình và trợ giúp lập trình khác nhau.
>
> Tham khảo: http://man.linuxde.net/man

Ví dụ:

```bash
$ man date # Xem trợ giúp về lệnh date
$ man 3 printf # Xem trợ giúp về lệnh printf trong phần 3
$ man -k keyword # Tìm kiếm lệnh dựa trên một phần từ khóa
```

#### 2.6.1. Điểm chính của lệnh man

Trong trợ giúp của lệnh man, bạn có thể sử dụng phím page up và page down để cuộn lên và xuống.

Trong trợ giúp của lệnh man, tài liệu trợ giúp được chia thành 9 danh mục khác nhau. Một số từ khóa có thể thuộc nhiều danh mục, vì vậy chúng ta cần chỉ định danh mục cụ thể để xem. (Thường thì các lệnh bash thuộc danh mục 1).

Các danh mục trang của lệnh man (phổ biến là danh mục 1 và danh mục 3):

1. Chương trình thực thi hoặc lệnh shell
2. Các cuộc gọi hệ thống (hàm được cung cấp bởi kernel)
3. Các cuộc gọi thư viện (hàm trong thư viện chương trình)
4. Các tệp đặc biệt (thường nằm trong /dev)
5. Định dạng và quy ước tệp tin, chẳng hạn như /etc/passwd
6. Trò chơi
7. Các mục lục (bao gồm gói macro và quy ước, chẳng hạn như man(7), groff(7))
8. Các lệnh quản lý hệ thống (thường chỉ dành cho người dùng root)
9. Các chương trình kernel [không chuẩn]

Như đã đề cập trước đó, sử dụng whatis sẽ hiển thị danh mục tài liệu cụ thể mà lệnh thuộc về:

```bash
$ whatis printf
printf (1) - format and print data
printf (1p) - write formatted output
printf (3) - formatted output conversion
printf (3p) - print formatted output
printf [builtins](1) - bash built-in commands, see bash(1)
```

Chúng ta có thể thấy printf thuộc cả danh mục 1 và danh mục 3; trang trong danh mục 1 là trợ giúp về các lệnh và tệp thực thi; trong khi trang trong danh mục 3 là hướng dẫn về thư viện hàm thông thường. Nếu chúng ta muốn xem cách sử dụng printf trong ngôn ngữ lập trình C, chúng ta có thể chỉ định xem trợ giúp trong danh mục 3:

```bash
$ man 3 printf
```
