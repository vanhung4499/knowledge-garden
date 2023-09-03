---
title: Linux Operations
tags:
  - linux
categories: linux
date created: 2023-09-03
date modified: 2023-09-03
---

# Quản trị và vận hành hệ thống Linux

> 💡 Lưu ý: Nếu không có chỉ dẫn cụ thể, các ví dụ trong bài viết này đều áp dụng cho phiên bản CentOS.

## Quản lý mạng

### Không thể truy cập vào tên miền ngoại tuyến

(1) Thêm ánh xạ IP thực tế của máy chủ và tên miền thực tế của máy chủ vào tệp hosts

```shell
echo "192.168.0.1 hostname" >> /etc/hosts
```

Nếu không biết tên miền thực tế của máy chủ, sử dụng lệnh `hostname` để kiểm tra; nếu không biết địa chỉ IP thực tế của máy chủ, sử dụng lệnh `ifconfig` để kiểm tra.

(2) Cấu hình máy chủ DNS đáng tin cậy

Chỉnh sửa tệp `/etc/resolv.conf` với quyền root và thêm nội dung sau:

```shell
nameserver 8.8.8.8
```

> 8.8.8.8 là DNS của Google

(3) Kiểm tra xem có thể ping được www.google.com không

### Cấu hình card mạng

Sử dụng quyền root để chỉnh sửa tệp `/etc/sysconfig/network-scripts/ifcfg-eno16777736X`

Tham khảo cấu hình sau:

```properties
TYPE=Ethernet                        # Loại mạng: Ethernet
BOOTPROTO=none                       # Giao thức khởi động: tự động nhận, tĩnh, không chỉ định
DEFROUTE=yes                         # Bật định tuyến mặc định
IPV4_FAILURE_FATAL=no                # Không bật chế độ phát hiện lỗi IPV4
IPV6INIT=yes                         # Bật IPV6
IPV6_AUTOCONF=yes                    # Tự động cấu hình địa chỉ IPV6
IPV6_DEFROUTE=yes                    # Bật định tuyến mặc định IPV6
IPV6_FAILURE_FATAL=no                # Không bật chế độ phát hiện lỗi IPV6
IPV6_PEERDNS=yes
IPV6_PEERROUTES=yes
IPV6_PRIVACY="no"

NAME=eno16777736                     # Bí danh của thiết bị mạng (phải giống với tên tệp)
UUID=90528772-9967-46da-b401-f82b64b4acbc  # UUID duy nhất của thiết bị mạng
DEVICE=eno16777736                   # Tên thiết bị mạng
ONBOOT=yes                           # Tự động kích hoạt card mạng khi khởi động
IPADDR=192.168.1.199                 # Địa chỉ IP cố định của card mạng
PREFIX=24                            # Mặt nạ mạng
GATEWAY=192.168.1.1                  # Địa chỉ IP cổng mặc định
DNS1=8.8.8.8                         # Địa chỉ IP máy chủ DNS
```

Sau khi chỉnh sửa xong, thực hiện lệnh `systemctl restart network.service` để khởi động lại dịch vụ mạng.

## Bảo trì hệ thống

## Kịch bản tự động hóa

### Kịch bản tự động khởi động Linux

(1) Thêm lệnh vào tệp `/etc/rc.local`

Nếu bạn không muốn di chuyển kịch bản xung quanh hoặc tạo liên kết, bạn có thể thêm lệnh khởi động vào tệp `/etc/rc.local`

1. Đầu tiên, chỉnh sửa kịch bản để tất cả các module của nó có thể chạy đúng khi khởi động từ bất kỳ thư mục nào;
2. Sau đó, thêm một dòng để khởi động kịch bản với đường dẫn tuyệt đối trong `/etc/rc.local`;

Ví dụ:

Chạy lệnh `vim /etc/rc.local`, nhập nội dung sau:

```shell
#!/bin/sh
#
# This script will be executed *after* all the other init scripts.
# You can put your own initialization stuff in here if you don't
# want to do the full Sys V style init stuff.

touch /var/lock/subsys/local
/opt/pjt_test/test.pl
```

(2) Thêm kịch bản tự động khởi động vào thư mục `/etc/rc.d/init.d`

Linux có nhiều tệp tin trong thư mục `/etc/rc.d/init.d`, mỗi tệp tin đều có thể xem nội dung của nó, thực chất là các tệp tin shell hoặc các tệp tin thực thi có thể chạy.

Khi Linux khởi động, nó sẽ tải và chạy các chương trình trong thư mục `/etc/rc.d/init.d`, vì vậy chúng ta có thể đặt các tác vụ muốn chạy tự động vào thư mục này. Các dịch vụ hệ thống được khởi động bằng cách sử dụng cách thức này.

(3) Cài đặt cấu hình chạy cấp độ

```shell
# 98 là số thứ tự khởi động
# 2 là cấp độ chạy hệ thống, bạn có thể tự điều chỉnh, nhưng đừng quên dấu chấm cuối cùng
$ update-rc.d mysql start 98 2 .
```

Bây giờ, hãy truy cập `/etc/rc2.d`, bạn sẽ thấy một liên kết tượng trưng như S98mysql.

(4) Khởi động lại hệ thống và kiểm tra xem cài đặt có hiệu lực không.

(5) Xóa liên kết tượng trưng

Khi bạn muốn xóa liên kết tượng trưng này, có ba cách để làm:

1. Trực tiếp xóa liên kết tương ứng trong `/etc/rc2.d`, đây không phải là cách tốt nhất;
2. Phương pháp khuyến nghị: `update-rc.d -f s10 remove`
3. Nếu bạn không quen với lệnh `update-rc.d`, bạn cũng có thể thử lệnh `rcconf`, nó cũng rất tiện lợi.

#### Lập lịch thực hiện kịch bản

## Cấu hình

### Cài đặt chế độ khởi động Linux

1. Tắt (nhớ không đặt initdefault thành 0, vì điều này sẽ làm cho Linux không thể khởi động)
2. Chế độ người dùng đơn, giống như chế độ an toàn trong Win9X
3. Nhiều người dùng, không có NFS
4. Chế độ nhiều người dùng đầy đủ (chế độ chạy tiêu chuẩn)
5. Thường không sử dụng, trong một số trường hợp đặc biệt có thể sử dụng nó để thực hiện một số công việc
6. X11, tức là vào hệ thống X-Window
7. Khởi động lại (nhớ không đặt initdefault thành 6, vì điều này sẽ làm cho Linux khởi động liên tục)

Cách cài đặt:

```shell
sed -i 's/id:5:initdefault:/id:3:initdefault:/' /etc/inittab
```
