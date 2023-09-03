---
title: Linux CLI Software
tags:
  - linux
categories: linux
date created: 2023-09-03
date modified: 2023-09-03
---

# Quản lý gói phần mềm trên Linux

> Từ khóa: `rpm`, `yum`, `apt-get`

## 1. rpm

> Lệnh rpm được sử dụng để quản lý gói phần mềm RPM. Ban đầu, rpm là một công cụ quản lý các gói phần mềm trên phiên bản Red Hat Linux, nhưng vì nó tuân thủ quy tắc GPL và có tính năng mạnh mẽ và tiện lợi, nên nó đã trở nên phổ biến. Dần dần, nó đã được sử dụng trên các phiên bản phân phối Linux khác. Sự xuất hiện của phương pháp quản lý gói RPM đã làm cho việc cài đặt, nâng cấp và sử dụng Linux dễ dàng hơn.
>
> Tham khảo: http://man.linuxde.net/rpm

Ví dụ:

(1) Cài đặt gói rpm

```
rpm -ivh xxx.rpm
```

(2) Cài đặt gói phần mềm .src.rpm

Loại gói phần mềm này chứa mã nguồn của gói rpm và cần được biên dịch khi cài đặt.

```bash
rpm -i xxx.src.rpm
cd /usr/src/redhat/SPECS
rpmbuild -bp xxx.specs             # một tệp specs có cùng tên với gói phần mềm của bạn
cd /usr/src/redhat/BUILD/xxx/      # một thư mục có cùng tên với gói phần mềm của bạn
./configure                        # bước này giống như biên dịch phần mềm nguồn thông thường, bạn có thể thêm các tham số
make
make install
```

(3) Gỡ bỏ gói rpm

Sử dụng lệnh `rpm -e tên_gói`, tên gói có thể bao gồm phiên bản và các thông tin khác, nhưng không được có đuôi .rpm. Ví dụ, để gỡ bỏ gói phần mềm proftpd-1.2.8-1, bạn có thể sử dụng các định dạng sau:

```bash
rpm -e proftpd-1.2.8-1
rpm -e proftpd-1.2.8
rpm -e proftpd-
rpm -e proftpd
```

Không được sử dụng các định dạng sau:

```bash
rpm -e proftpd-1.2.8-1.i386.rpm
rpm -e proftpd-1.2.8-1.i386
rpm -e proftpd-1.2
rpm -e proftpd-1
```

Đôi khi có thể gặp phải một số lỗi hoặc cảnh báo:

```
... is needed by ...
```

Điều này cho thấy rằng phần mềm này được yêu cầu bởi phần mềm khác và không thể gỡ bỏ một cách tùy ý. Bạn có thể sử dụng rpm -e --nodeps để gỡ bỏ một cách bắt buộc.

(4) Xem các tệp tin và thông tin khác liên quan đến gói rpm

```bash
rpm -qa # Liệt kê tất cả các gói đã cài đặt
```

## 2. yum

> Lệnh yum là công cụ quản lý gói phần mềm dựa trên rpm trong Fedora, Red Hat và SUSE. Nó cho phép quản trị viên hệ thống tương tác và tự động hóa việc cập nhật và quản lý các gói phần mềm RPM. Nó có thể tự động xử lý các phụ thuộc và cài đặt tất cả các gói phụ thuộc cùng một lúc, không cần phải tải và cài đặt từng gói một.
>
> Tham khảo: http://man.linuxde.net/yum

Ví dụ:

Một số lệnh thường sử dụng bao gồm:

- Cài đặt plugin tìm kiếm máy chủ nhanh nhất: `yum install yum-fastestmirror`
- Cài đặt plugin giao diện đồ họa cho yum: `yum install yumex`
- Xem danh sách các nhóm gói có thể cài đặt: `yum grouplist`

**Cài đặt**

```
yum install              # Cài đặt tất cả
yum install package1     # Cài đặt gói phần mềm cụ thể package1
yum groupinsall group1   # Cài đặt nhóm chương trình group1
```

**Cập nhật và nâng cấp**

```
yum update               # Cập nhật tất cả
yum update package1      # Cập nhật gói phần mềm cụ thể package1
yum check-update         # Kiểm tra các gói phần mềm có thể cập nhật
yum upgrade package1     # Nâng cấp gói phần mềm cụ thể package1
yum groupupdate group1   # Nâng cấp nhóm chương trình group1
```

**Tìm kiếm và hiển thị**

```
yum info package1      # Hiển thị thông tin về gói phần mềm package1
yum list               # Hiển thị tất cả các gói phần mềm đã cài đặt và có thể cài đặt
yum list package1      # Hiển thị thông tin về việc cài đặt gói phần mềm cụ thể package1
yum groupinfo group1   # Hiển thị thông tin về nhóm chương trình group1
yum search <keyword>   # Tìm kiếm gói phần mềm
```

**Gỡ bỏ phần mềm**

```
yum remove <package_name>          # Gỡ bỏ gói phần mềm package_name
yum groupremove group1             # Gỡ bỏ nhóm chương trình group1
yum deplist package1               # Xem các phụ thuộc của gói phần mềm package1
```

**Xóa bộ nhớ cache**

```
yum clean packages       # Xóa các gói phần mềm trong bộ nhớ cache
yum clean headers        # Xóa các header trong bộ nhớ cache
yum clean oldheaders     # Xóa các header cũ trong bộ nhớ cache
```

## 3. apt-get

> Lệnh apt-get là công cụ quản lý gói phần mềm APT trong phiên bản Debian Linux. Tất cả các phiên bản phân phối dựa trên Debian đều sử dụng hệ thống quản lý gói này. Gói deb có thể chứa các tệp tin ứng dụng và tương tự như các tệp tin cài đặt trên Windows.
>
> Tham khảo: http://man.linuxde.net/apt-get

Ví dụ:

Bước đầu tiên khi sử dụng lệnh apt-get là nhập các kho phần mềm cần thiết, kho phần mềm của Debian là tập hợp tất cả các gói phần mềm Debian và chúng tồn tại trên một số trang web công cộng trên Internet. Bạn thêm địa chỉ của chúng vào để apt-get có thể tìm kiếm phần mềm bạn muốn. /etc/apt/sources.list là tệp cấu hình chứa danh sách các địa chỉ này, định dạng của nó như sau:

`deb [địa chỉ web hoặc ftp][tên phiên bản] [main/contrib/non-free]`  
Ubuntu là một phiên bản dựa trên Debian, chúng ta sử dụng lệnh apt-get để lấy danh sách này, dưới đây là một số lệnh thường sử dụng mà tôi đã tổ chức:

Sau khi chỉnh sửa /etc/apt/sources.list hoặc /etc/apt/preferences, chạy lệnh này.

```bash
# Cập nhật apt-get
apt-get update

# Cài đặt một gói phần mềm
apt-get install packagename

# Gỡ bỏ một gói phần mềm đã cài đặt (giữ lại các tệp cấu hình)
apt-get remove packagename

# Gỡ bỏ một gói phần mềm đã cài đặt (xóa các tệp cấu hình)
apt-get –purge remove packagename

# Nếu bạn cần không gian, bạn có thể sử dụng lệnh này để xóa các phần mềm đã bị xóa
apt-get autoclean apt

# Xóa các gói phần mềm đã cài đặt
apt-get clean

# Cập nhật tất cả các gói phần mềm đã cài đặt
apt-get upgrade

# Nâng cấp hệ thống lên phiên bản mới
apt-get dist-upgrade
```

## 4. Tài liệu tham khảo

- http://man.linuxde.net/rpm
- http://man.linuxde.net/yum
- http://man.linuxde.net/apt-get
