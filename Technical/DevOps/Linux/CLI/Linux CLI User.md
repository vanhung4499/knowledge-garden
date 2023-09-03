---
title: Linux CLI User
tags:
  - linux
categories: linux
date created: 2023-09-03
date modified: 2023-09-03
---

# Quản lý người dùng trên Linux

> Từ khóa: `groupadd`, `groupdel`, `groupmod`, `useradd`, `userdel`, `usermod`, `passwd`, `su`, `sudo`

## 1. Quản lý người dùng trên Linux

- Tạo nhóm người dùng - Sử dụng [groupadd](#groupadd)
- Xóa nhóm người dùng - Sử dụng [groupdel](#groupdel)
- Sửa đổi thông tin nhóm người dùng - Sử dụng [groupmod](#groupmod)
- Tạo người dùng - Sử dụng [useradd](#useradd)
- Xóa người dùng - Sử dụng [userdel](#userdel)
- Sửa đổi thông tin người dùng - Sử dụng [usermod](#usermod)
- Thiết lập thông tin xác thực người dùng - Sử dụng [passwd](#passwd)
- Chuyển đổi người dùng - Sử dụng [su](#su)
- Sử dụng quyền của người dùng khác để thực thi lệnh không có quyền - Sử dụng [sudo](#sudo)

## 2. Các cách sử dụng của các lệnh phổ biến

### 2.1. groupadd

> Lệnh groupadd được sử dụng để tạo một nhóm người dùng mới và thông tin nhóm người dùng mới sẽ được thêm vào các tệp hệ thống.
>
> Tham khảo: http://man.linuxde.net/groupadd

Ví dụ:

```bash
# Tạo một nhóm mới và gán ID nhóm vào hệ thống
$ groupadd -g 344 jsdigname
```

### 2.2. groupdel

> Lệnh groupdel được sử dụng để xóa một nhóm người dùng đã cho và các tệp hệ thống liên quan sẽ được sửa đổi. Nếu nhóm vẫn chứa một số người dùng, bạn phải xóa các người dùng này trước khi xóa nhóm.
>
> Tham khảo: http://man.linuxde.net/groupdel

Ví dụ:

```bash
$ groupadd damon  # Tạo nhóm người dùng damon
$ groupdel damon  # Xóa nhóm người dùng damon
```

### 2.3. groupmod

> Lệnh groupmod được sử dụng để thay đổi mã nhận dạng hoặc tên của một nhóm. Khi bạn cần thay đổi mã nhận dạng hoặc tên của một nhóm, bạn có thể sử dụng lệnh groupmod để thực hiện công việc này.
>
> Tham khảo: http://man.linuxde.net/groupmod

### 2.4. useradd

> Lệnh useradd được sử dụng để tạo một người dùng hệ thống mới trong Linux. Lệnh useradd được sử dụng để tạo tài khoản người dùng. Sau khi tài khoản được tạo, bạn có thể sử dụng lệnh passwd để đặt mật khẩu cho tài khoản. Thông tin về tài khoản người dùng được lưu trữ trong tệp `/etc/passwd`.
>
> Tham khảo: http://man.linuxde.net/useradd

Ví dụ:

```bash
# Tạo một tài khoản người dùng mới và thêm vào nhóm
$ useradd –g sales jack –G company,employees    # -g: thêm vào nhóm chính, -G: thêm vào các nhóm phụ

# Tạo một tài khoản người dùng mới và đặt ID
$ useradd caojh -u 544
```

### 2.5. userdel

> Lệnh userdel được sử dụng để xóa người dùng đã cho và các tệp liên quan. Nếu không có tùy chọn, chỉ xóa tài khoản người dùng mà không xóa các tệp liên quan.
>
> Tham khảo: http://man.linuxde.net/userdel

Ví dụ:

Lệnh userdel rất đơn giản, ví dụ: nếu bạn có một người dùng có tên là linuxde và thư mục home của người dùng này nằm trong `/var`, bạn có thể xóa người dùng này như sau:

```bash
$ userdel linuxde       # Xóa người dùng linuxde, không xóa thư mục home và các tệp liên quan;
$ userdel -r linuxde    # Xóa người dùng linuxde, cùng với thư mục home và các tệp liên quan;
```

### 2.6. usermod

> Lệnh usermod được sử dụng để thay đổi thông tin cơ bản của người dùng. Lệnh usermod không cho phép bạn thay đổi tên người dùng đang trực tuyến. Khi sử dụng lệnh usermod để thay đổi ID người dùng, bạn phải đảm bảo người dùng không thực thi bất kỳ chương trình nào trên máy tính. Bạn cần thay đổi tệp crontab của người dùng thủ công. Bạn cũng cần thay đổi tệp công việc at của người dùng thủ công. Nếu sử dụng NIS server, bạn cần thay đổi các cài đặt NIS liên quan trên máy chủ.
>
> Tham khảo: http://man.linuxde.net/usermod

Ví dụ:

```bash
# Thêm newuser2 vào nhóm staff
$ usermod -G staff newuser2

# Thay đổi tên người dùng newuser thành newuser1
$ usermod -l newuser1 newuser

# Khóa tài khoản newuser1
$ usermod -L newuser1

# Mở khóa tài khoản newuser1
$ usermod -U newuser1
```

### 2.7. passwd

> Lệnh passwd được sử dụng để đặt thông tin xác thực người dùng, bao gồm mật khẩu người dùng, thời gian hết hạn mật khẩu, v.v. Quản trị viên hệ thống có thể sử dụng nó để quản lý mật khẩu người dùng hệ thống. Chỉ có quản trị viên mới có thể chỉ định tên người dùng, người dùng thông thường chỉ có thể thay đổi mật khẩu của chính họ.
>
> Tham khảo: http://man.linuxde.net/passwd

Ví dụ:

```bash
# Nếu là người dùng thông thường thực hiện passwd, chỉ có thể thay đổi mật khẩu của chính mình.
# Nếu bạn muốn tạo mật khẩu cho người dùng mới sau khi tạo người dùng mới, bạn có thể sử dụng passwd với quyền root.
$ passwd linuxde    # Thay đổi hoặc tạo mật khẩu cho người dùng linuxde;
Changing password for user linuxde.
New UNIX password:          # Nhập mật khẩu mới;
Retype new UNIX password:   # Nhập lại mật khẩu mới;
passwd: all authentication tokens updated successfully. # Thay đổi thành công;

# Người dùng thông thường muốn thay đổi mật khẩu của chính mình, chỉ cần chạy passwd, ví dụ: người dùng hiện tại là linuxde.
$ passwd
Changing password for user linuxde. # Thay đổi mật khẩu cho người dùng linuxde;
(current) UNIX password:   # Nhập mật khẩu hiện tại của linuxde;
New UNIX password:         # Nhập mật khẩu mới;
Retype new UNIX password:  # Nhập lại mật khẩu mới;
passwd: all authentication tokens updated successfully. # Thay đổi thành công;

# Ví dụ: nếu bạn muốn ngăn người dùng thay đổi mật khẩu của mình, bạn có thể sử dụng `-l` để khóa:
$ passwd -l linuxde    # Khóa người dùng linuxde không thể thay đổi mật khẩu;
Locking password for user linuxde.
passwd: Success           # Khóa thành công;

$ su linuxde   # Chuyển đổi sang người dùng linuxde bằng su;
$ passwd      # linuxde thay đổi mật khẩu;
Changing password for user linuxde.
Changing password for linuxde
(current) UNIX password:          # Nhập mật khẩu hiện tại của linuxde;
passwd: Authentication token manipulation error     # Thay đổi không thành công;

$ passwd -d linuxde  # Xóa mật khẩu của linuxde;
Removing password for user linuxde.
passwd: Success                         # Xóa thành công;

$ passwd -S linuxde    # Kiểm tra trạng thái mật khẩu của linuxde;
Empty password.                         # Mật khẩu trống;
```

### 2.8. su

> Lệnh su được sử dụng để chuyển đổi quyền người dùng hiện tại sang quyền người dùng khác, thay đổi khi cần thiết phải nhập tên người dùng và mật khẩu người dùng cần chuyển đổi.
>
> Tham khảo: http://man.linuxde.net/su

Ví dụ:

```bash
# Chuyển đổi quyền sang root và thoát sau khi thực thi lệnh ls:
$ su -c ls root

# Chuyển đổi quyền sang root và chuyển giao `-f` cho shell mới được thực thi:
$ su root -f

# Chuyển đổi quyền sang test và thay đổi thư mục là thư mục home của test:
$ su -test
```

### 2.9. sudo

> Lệnh sudo được sử dụng để thực thi lệnh với quyền của người dùng khác, mặc định là root. Khi sử dụng sudo, người dùng phải nhập mật khẩu trước khi thực thi lệnh và có thời gian hết hạn là 5 phút, sau đó phải nhập lại mật khẩu.
>
> Tham khảo: http://man.linuxde.net/sudo

Ví dụ:

```bash
# Chạy lệnh với quyền của người dùng được chỉ định
$ sudo -u userb ls -l

# Liệt kê quyền hiện tại
$ sudo -l

# Hiển thị cấu hình sudo
$ sudo -L
```

#### 2.9.1. Cấp quyền sudo cho người dùng thông thường

Giả sử bạn muốn cấp quyền sudo cho người dùng thông thường mary:

1. Tệp `/etc/sudoers` chứa thông tin về sudo, nhưng mặc định không có quyền ghi, vì vậy bạn cần cấp quyền ghi: `chmod u+w /etc/sudoers`
2. Thêm `mary ALL=(ALL) ALL` vào tệp, lưu và thoát để cho phép mary có quyền sudo đầy đủ
3. Khôi phục quyền của `/etc/sudoers` về trạng thái mặc định: `chmod u-w /etc/sudoers`

#### 2.9.2. Cấp quyền sudo không yêu cầu mật khẩu

Tương tự như việc cấp quyền sudo cho người dùng thông thường, khác biệt chỉ ở bước 2: `mary ALL=(ALL) NOPASSWD: ALL`.
