---
title: iptables
tags:
  - linux
categories: linux
date created: 2023-09-03
date modified: 2023-09-03
---

# Iptables

> _iptables_ là một công cụ dòng lệnh để cấu hình tường lửa trong Linux, là một phần của dự án [netfilter](https://en.wikipedia.org/wiki/Netfilter). Nó có thể được cấu hình trực tiếp hoặc thông qua nhiều giao diện và giao diện đồ họa khác nhau.
>
> Từ "iptables" cũng thường được sử dụng để chỉ tường lửa cấp kernel. iptables được sử dụng cho [ipv4](https://en.wikipedia.org/wiki/Ipv4), trong khi _ip6tables_ được sử dụng cho [ipv6](https://en.wikipedia.org/wiki/Ipv6).
>
> [nftables](https://wiki.archlinux.org/index.php/Nftables) đã được tích hợp vào [Linux kernel 3.13](http://www.phoronix.com/scan.php?page=news_item&px=MTQ5MDU) và sẽ thay thế iptables trở thành công cụ tường lửa chính trên Linux.
>
> Môi trường: CentOS 7

## 1. Giới thiệu

**iptables có thể phát hiện, sửa đổi, chuyển tiếp, chuyển hướng và loại bỏ các gói tin IPv4**.

Mã lọc gói tin IPv4 được tích hợp sẵn trong kernel và được tổ chức thành một tập hợp các **bảng** với mục đích khác nhau. Mỗi **bảng** bao gồm một tập hợp các **chuỗi** được sắp xếp theo thứ tự duyệt qua các quy tắc. Mỗi quy tắc bao gồm một điều kiện kiểm tra tiềm năng và một hành động tương ứng (gọi là **mục tiêu**), nếu điều kiện kiểm tra là đúng, hành động sẽ được thực hiện. Điều này có nghĩa là các điều kiện phải khớp.

## 2. Cài đặt iptables

(1) Tắt firewalld

CentOS 7 mặc định cài đặt firewalld làm tường lửa, việc sử dụng iptables khuyến nghị tắt và vô hiệu hóa firewalld.

```bash
systemctl stop firewalld
systemctl disable firewalld
```

(2) Cài đặt iptables

```
yum install -y iptables-services
```

(3) Quản lý dịch vụ

- Kiểm tra trạng thái dịch vụ: `systemctl status iptables`
- Kích hoạt dịch vụ: `systemctl enable iptables`
- Vô hiệu hóa dịch vụ: `systemctl disable iptables`
- Khởi động dịch vụ: `systemctl start iptables`
- Khởi động lại dịch vụ: `systemctl restart iptables`
- Dừng dịch vụ: `systemctl stop iptables`

## 3. Các lệnh

Cú pháp cơ bản:

```
iptables(options)(parameters)
```

Giải thích các tùy chọn cơ bản:

| Tham số | Ý nghĩa                                                      |
| ------- | ------------------------------------------------------------ |
| -P      | Đặt chính sách mặc định: iptables -P INPUT (DROP)            |
| -F      | Xóa tất cả các quy tắc trong chuỗi                           |
| -L      | Xem tất cả các quy tắc trong chuỗi                           |
| -A      | Thêm một quy tắc mới vào cuối chuỗi                          |
| -I      | num Thêm một quy tắc mới vào đầu chuỗi                       |
| -D      | num Xóa một quy tắc trong chuỗi                              |
| -s      | Khớp với địa chỉ IP/MASK nguồn, dấu thanh "!" nghĩa là ngoại trừ địa chỉ IP này |
| -d      | Khớp với địa chỉ IP đích                                     |
| -i      | Tên card mạng, khớp với dữ liệu vào từ card mạng này         |
| -o      | Tên card mạng, khớp với dữ liệu ra từ card mạng này           |
| -p      | Khớp với giao thức, ví dụ: tcp, udp, icmp                    |
| --dport | num Khớp với cổng đích                                      |
| --sport | num Khớp với cổng nguồn                                      |

Cú pháp:

```bash
iptables -t tên_bảng <-A/I/D/R> tên_chuỗi [số_quy_tắc] <-i/o tên_card_mạng> -p tên_giao_thức <-s địa_chỉ_nguồn/MASK> --sport cổng_nguồn <-d địa_chỉ_đích/MASK> --dport cổng_đích -j hành_động
```

## 4. Ví dụ về iptables

### 4.1. Xóa tất cả các quy tắc và đếm số lần

```shell
iptables -F  # Xóa tất cả các quy tắc tường lửa
iptables -X  # Xóa các chuỗi tùy chỉnh của người dùng
iptables -Z  # Đặt lại số lần đếm về 0
```

### 4.2. Cấu hình cho phép kết nối cổng ssh

```shell
iptables -A INPUT -s 192.168.1.0/24 -p tcp --dport 22 -j ACCEPT
# 22 là cổng ssh của bạn, -s 192.168.1.0/24 cho phép kết nối từ dải mạng này, các địa chỉ IP từ dải mạng khác sẽ không thể kết nối. -j ACCEPT cho phép kết nối như vậy
```

### 4.3. Cho phép sử dụng địa chỉ loopback

```shell
iptables -A INPUT -i lo -j ACCEPT
# Địa chỉ loopback là 127.0.0.1, được sử dụng trên máy cục bộ, cho phép cả vào và ra
iptables -A OUTPUT -o lo -j ACCEPT
```

### 4.4. Đặt quy tắc mặc định

```shell
iptables -P INPUT DROP # Đặt mặc định không cho phép vào
iptables -P FORWARD DROP # Mặc định không cho phép chuyển tiếp
iptables -P OUTPUT ACCEPT # Mặc định cho phép ra
```

### 4.5. Cấu hình whitelist

```shell
iptables -A INPUT -p all -s 192.168.1.0/24 -j ACCEPT  # Cho phép máy trong mạng nội bộ truy cập
iptables -A INPUT -p all -s 192.168.140.0/24 -j ACCEPT  # Cho phép máy trong mạng nội bộ truy cập
iptables -A INPUT -p tcp -s 183.121.3.7 --dport 3380 -j ACCEPT # Cho phép máy 183.121.3.7 truy cập cổng 3380 của máy này
```

### 4.6. Mở các cổng dịch vụ tương ứng

```shell
iptables -A INPUT -p tcp --dport 80 -j ACCEPT # Mở cổng 80, vì web thường sử dụng cổng này
iptables -A INPUT -p icmp --icmp-type 8 -j ACCEPT # Cho phép ping
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT # Cho phép các kết nối đã thiết lập
```

### 4.7. Lưu các quy tắc vào tệp cấu hình

```shell
cp /etc/sysconfig/iptables /etc/sysconfig/iptables.bak # Sao lưu trước khi thay đổi, hãy giữ thói quen tốt này
iptables-save > /etc/sysconfig/iptables
cat /etc/sysconfig/iptables
```

### 4.8. Liệt kê các quy tắc đã thiết lập

> iptables -L [-t tên_bảng][tên_chuỗi]

- Bốn tên bảng là `raw`, `nat`, `filter`, `mangle`
- Năm tên chuỗi là `INPUT`, `OUTPUT`, `FORWARD`, `PREROUTING`, `POSTROUTING`
- Bảng filter bao gồm ba chuỗi `INPUT`, `OUTPUT`, `FORWARD`

```shell
iptables -L -t nat                  # Liệt kê tất cả các quy tắc trên bảng nat
#            ^ -t chỉ định, phải là raw, nat, filter, mangle
iptables -L -t nat  --line-numbers  # Liệt kê quy tắc với số thứ tự
iptables -L INPUT

iptables -L -nv  # Xem danh sách chi tiết hơn
```

### 4.9. Xóa các quy tắc hiện có

```shell
iptables -F INPUT  # Xóa tất cả các quy tắc trên chuỗi INPUT
iptables -X INPUT  # Xóa chuỗi chỉ định, chuỗi này không được tham chiếu bởi bất kỳ quy tắc nào khác và không có quy tắc nào trên nó.
                   # Nếu không chỉ định tên chuỗi, tất cả các chuỗi không được tích hợp sẽ bị xóa.
iptables -Z INPUT  # Đặt lại tất cả các bộ đếm trên chuỗi hoặc tất cả các chuỗi trong bảng.
```

### 4.10. Xóa các quy tắc đã thêm

```shell
# Thêm một quy tắc
iptables -A INPUT -s 192.168.1.5 -j DROP
```

Hiển thị tất cả các quy tắc iptables theo số thứ tự, thực hiện:

```shell
iptables -L -n --line-numbers
```

Ví dụ, để xóa quy tắc số 8 trong chuỗi INPUT, thực hiện:

```shell
iptables -D INPUT 8
```

### 4.11. Mở các cổng cụ thể

```shell
iptables -A INPUT -s 127.0.0.1 -d 127.0.0.1 -j ACCEPT               # Cho phép sử dụng giao diện loopback (cho phép truy cập máy cục bộ)
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT    # Cho phép các kết nối đã thiết lập hoặc liên quan
iptables -A OUTPUT -j ACCEPT         # Cho phép tất cả các truy cập ra khỏi máy
iptables -A INPUT -p tcp --dport 22 -j ACCEPT    # Cho phép truy cập vào cổng 22 (cổng SSH)
iptables -A INPUT -p tcp --dport 80 -j ACCEPT    # Cho phép truy cập vào cổng 80
iptables -A INPUT -p tcp --dport 21 -j ACCEPT    # Cho phép truy cập vào cổng 21 của dịch vụ FTP
iptables -A INPUT -p tcp --dport 20 -j ACCEPT    # Cho phép truy cập vào cổng 20 của dịch vụ FTP
iptables -A INPUT -j reject       # Từ chối các quy tắc không được phép khác
iptables -A FORWARD -j REJECT     # Từ chối các quy tắc không được phép khác
```

### 4.12. Chặn địa chỉ IP

```shell
iptables -A INPUT -p tcp -m tcp -s 192.168.0.8 -j DROP  # Chặn máy chủ độc hại (ví dụ, 192.168.0.8)
iptables -I INPUT -s 123.45.6.7 -j DROP       # Chặn một địa chỉ IP cụ thể
iptables -I INPUT -s 123.0.0.0/8 -j DROP      # Chặn một dải IP từ 123.0.0.1 đến 123.255.255.254
iptables -I INPUT -s 124.45.0.0/16 -j DROP    # Chặn một dải IP từ 123.45.0.1 đến 123.45.255.254
iptables -I INPUT -s 123.45.6.0/24 -j DROP    # Chặn một dải IP từ 123.45.6.1 đến 123.45.6.254
```

### 4.13. Xác định giao diện mạng cho gói tin đi ra

Chỉ có tác dụng đối với các chuỗi OUTPUT, FORWARD, POSTROUTING.

```shell
iptables -A FORWARD -o eth0
```

### 4.14. Liệt kê các quy tắc đã thêm

```shell
iptables -L -n -v
Chain INPUT (policy DROP 48106 packets, 2690K bytes)
 pkts bytes target     prot opt in     out     source               destination
 5075  589K ACCEPT     all  --  lo     *       0.0.0.0/0            0.0.0.0/0
 191K   90M ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           tcp dpt:22
1499K  133M ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           tcp dpt:80
4364K 6351M ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0           state RELATED,ESTABLISHED
 6256  327K ACCEPT     icmp --  *      *       0.0.0.0/0            0.0.0.0/0

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination

Chain OUTPUT (policy ACCEPT 3382K packets, 1819M bytes)
 pkts bytes target     prot opt in     out     source               destination
 5075  589K ACCEPT     all  --  *      lo      0.0.0.0/0            0.0.0.0/0
```

### 4.15. Kích hoạt quy tắc chuyển mạng

Cho phép mạng công cộng `210.14.67.7` truy cập vào mạng nội bộ `192.168.188.0/24`

```shell
iptables -t nat -A POSTROUTING -s 192.168.188.0/24 -j SNAT --to-source 210.14.67.127
```

### 4.16. Ánh xạ cổng

Ánh xạ cổng 2222 trên máy cục bộ thành cổng 22 của máy ảo trong mạng nội bộ

```shell
iptables -t nat -A PREROUTING -d 210.14.67.127 -p tcp --dport 2222  -j DNAT --to-dest 192.168.188.115:22
```

### 4.17. Khớp chuỗi

Ví dụ, chúng ta muốn chặn chuỗi "test" trong tất cả các kết nối TCP và kết thúc kết nối khi chuỗi này xuất hiện:

```shell
iptables -A INPUT -p tcp -m string --algo kmp --string "test" -j REJECT --reject-with tcp-reset
iptables -L

# Chain INPUT (policy ACCEPT)
# target     prot opt source               destination
# REJECT     tcp  --  anywhere             anywhere            STRING match "test" ALGO name kmp TO 65535 reject-with tcp-reset
#
# Chain FORWARD (policy ACCEPT)
# target     prot opt source               destination
#
# Chain OUTPUT (policy ACCEPT)
# target     prot opt source               destination
```

### 4.18. Ngăn chặn tấn công từ các loại sâu Windows

```shell
iptables -I INPUT -j DROP -p tcp -s 0.0.0.0/0 -m string --algo kmp --string "cmd.exe"
```

### 4.19. Ngăn chặn tấn công SYN flood

```shell
iptables -A INPUT -p tcp --syn -m limit --limit 5/second -j ACCEPT
```
