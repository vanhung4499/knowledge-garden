---
title: NTP
tags:
  - linux
categories: linux
date created: 2023-09-03
date modified: 2023-09-03
---

# Time Server - NTP

## 1. Giới thiệu về NTP

Giao thức mạng thời gian (Network Time Protocol - NTP) là một giao thức mạng để đồng bộ hóa đồng hồ giữa các hệ thống máy tính trong mạng dữ liệu có thời gian biến đổi. NTP nằm ở tầng ứng dụng trong mô hình OSI. Từ năm 1985, NTP là một trong những giao thức Internet cổ nhất vẫn đang được sử dụng. NTP được thiết kế bởi David L. Mills của Đại học Delaware.

**NTP nhằm mục đích đồng bộ thời gian thế giới phối hợp (UTC) trên tất cả các máy tính tham gia với sai số chỉ trong vài mili giây**.

Các điểm chính của NTP:

- Trái đất có tổng cộng 24 múi giờ, với thời gian chuẩn là thời gian Greenwich (GMT).
- Thời gian đúng nhất được tính bằng đồng hồ nguyên tử (Atomic clock), ví dụ như UTC (Coordinated Universal Time).
- Linux hỗ trợ hai loại thời gian, một là thời gian hệ thống tính từ ngày 1/1/1970 và một là thời gian phần cứng được ghi lại trong BIOS.
- Trên Linux, có thể đồng bộ thời gian qua mạng, phổ biến nhất là sử dụng máy chủ NTP, dịch vụ này chạy trên cổng udp 123.
- Các tệp múi giờ được lưu trữ chủ yếu trong thư mục `/usr/share/zoneinfo/`, và múi giờ địa phương được tham khảo trong `/etc/localtime`.
- Máy chủ NTP là một dịch vụ phân cấp, vì vậy máy chủ NTP sẽ đồng bộ thời gian với máy chủ thời gian cấp trên, do đó không thể sử dụng cùng lúc hai lệnh `nptd` và `ntpdate`.
- Trạng thái kết nối của máy chủ NTP có thể được kiểm tra bằng cách sử dụng `ntpstat` và `ntpq -p`.
- Phần mềm khách NTP được cung cấp bởi lệnh `ntpdate`.
- Khi muốn thao tác thời gian thủ công trên Linux, cần sử dụng lệnh `date` để đặt thời gian, sau đó sử dụng `hwclock -w` để ghi thời gian vào BIOS.
- Sai số thời gian giữa các máy chủ NTP không được vượt quá 1000 giây, nếu không dịch vụ NTP sẽ tự động tắt.

> Để biết thêm chi tiết về NTP, bạn có thể tham khảo: [Linux Private Kitchen of Bird Brother - NTP Time Server](http://cn.linux.vbird.org/linux_server/0440ntp.php)

## 2. Dịch vụ ntpd

> Môi trường: CentOS

### Cài đặt qua yum

Cài đặt NTP trên CentOS rất đơn giản, chỉ cần chạy lệnh sau:

```shell
yum -y install ntp
```

### Cấu hình ntpd

Tệp cấu hình của ntp nằm tại `/etc/ntp.conf`, dưới đây là một cấu hình mẫu:

```shell
# 1. Xử lý vấn đề quyền truy cập, bao gồm cho phép các máy chủ trên cấp trên và nguồn người dùng trong mạng nội bộ:
# restrict default kod nomodify notrap nopeer noquery     # Từ chối người dùng IPv4
# restrict -6 default kod nomodify notrap nopeer noquery  # Từ chối người dùng IPv6
restrict default nomodify notrap nopeer noquery
#restrict 192.168.100.0 mask 255.255.255.0 nomodify # Cho phép nguồn từ cùng mạng (dựa trên cổng mạng và mặt nạ mạng)
restrict 127.0.0.1   # Giá trị mặc định, cho phép nguồn IPv4 từ localhost
restrict ::1         # Giá trị mặc định, cho phép nguồn IPv6 từ localhost

# 2. Đặt nguồn máy chủ NTP
# Bỏ chú thích nguồn NTP mặc định
# server 0.centos.pool.ntp.org iburst
# server 1.centos.pool.ntp.org iburst
# server 2.centos.pool.ntp.org iburst
# server 3.centos.pool.ntp.org iburst
# Đặt nguồn NTP trong nước
server cn.pool.ntp.org prefer # Ưu tiên máy chủ này
server ntp1.aliyun.com
server ntp.sjtu.edu.cn

# 3. Tệp phân tích sai số thời gian và các khóa không sử dụng, không cần thay đổi:
driftfile /var/lib/ntp/drift
keys /etc/ntp/keys
includefile /etc/ntp/crypto/pw
```

> Lưu ý: Nếu thay đổi cấu hình, bạn phải khởi động lại dịch vụ NTP (`systemctl restart ntpd`) để cấu hình mới có hiệu lực.

### Mở rộng giới hạn tường lửa

Cổng dịch vụ NTP là `123`, sử dụng giao thức udp, do đó tường lửa của máy chủ NTP phải mở cổng udp 123 này ra bên ngoài.

Nếu tường lửa sử dụng **`iptables`**, chạy lệnh sau:

```shell
iptables -A INPUT -p UDP -i eth0 -s 192.168.0.0/24 --dport 123 -j ACCEPT
```

Nếu tường lửa sử dụng **`firewalld`**, chạy lệnh sau:

```shell
firewall-cmd --zone=public --add-port=123/udp --permanent
```

### Lệnh dịch vụ ntpd

```shell
systemctl enable ntpd.service  # Bật dịch vụ (tự động khởi động dịch vụ khi khởi động hệ thống)
systemctl disable ntpd.service # Tắt dịch vụ (không tự động khởi động dịch vụ khi khởi động hệ thống)
systemctl start ntpd.service   # Khởi động dịch vụ
systemctl stop ntpd.service    # Dừng dịch vụ
systemctl restart ntpd.service # Khởi động lại dịch vụ
systemctl reload ntpd.service  # Tải lại cấu hình
systemctl status ntpd.service  # Xem trạng thái dịch vụ
```

### Kiểm tra trạng thái dịch vụ ntp

#### Xác minh dịch vụ NTP hoạt động bình thường

Chạy `ntpstat` để kiểm tra xem máy chủ NTP có kết nối với máy chủ NTP cấp trên hay không, nếu thành công, bạn sẽ thấy thông tin tương tự như sau:

```shell
$ ntpstat
synchronised to NTP server (5.79.108.34) at stratum 3
   time correct to within 1129 ms
   polling server every 64 s
```

#### Xem trạng thái của máy chủ NTP và máy chủ NTP cấp trên

```shell
ntpq -p
     remote           refid      st t when poll reach   delay   offset  jitter
==============================================================================
*ntp1.ams1.nl.le 130.133.1.10     2 u   36   64  367  230.801    5.271   2.791
 120.25.115.20   10.137.53.7      2 u   33   64  377   25.930   15.908   3.168
 time.cloudflare 10.21.8.251      3 u   31   64  367  251.109   16.976   3.264
```

## 3. Lệnh ntpdate

> Lưu ý: Dịch vụ NTP là một dịch vụ phân cấp, do đó máy chủ NTP sẽ đồng bộ thời gian với máy chủ thời gian cấp trên. Vì vậy, không thể sử dụng cùng lúc hai lệnh `nptd` và `ntpdate`.

### Đồng bộ thời gian thủ công

Lệnh `ntpdate` là phần mềm khách NTP, nó được sử dụng để yêu cầu đồng bộ thời gian.

Cú pháp:

```shell
/usr/sbin/ntpdate <ntp_server>
```

`ntp_server` có thể được chọn từ [máy chủ NTP trong nước](#máy chủ NTP trong nước).

Ví dụ:

```shell
$ ntpdate cn.pool.ntp.org
11 Feb 10:47:12 ntpdate[30423]: step time server 84.16.73.33 offset -49.894774 sec
```

### Đồng bộ thời gian tự động theo lịch trình

Nếu bạn muốn đồng bộ thời gian tự động theo lịch trình, bạn có thể sử dụng công cụ [Crontab](#crontab). Thực chất là sử dụng crontab để thực hiện định kỳ một lần lệnh đồng bộ thời gian thủ công ntp.

Ví dụ: Chạy lệnh sau, bạn có thể đồng bộ hóa thời gian hệ thống vào mỗi ngày lúc 3 giờ sáng:

```shell
echo "0 3 * * * /usr/sbin/ntpdate cn.pool.ntp.org" >> /etc/crontab # Sửa đổi cấu hình dịch vụ crond
systemctl restart crond # Khởi động lại dịch vụ crond để có hiệu lực
```

## Tài liệu tham khảo

- [Cài đặt và cấu hình NTP Server trên Linux](https://blogd.net/linux/cai-dat-va-cau-hinh-ntp-server-tren-linux/)
- [Configuring NTP Using ntpd Red Hat Enterprise Linux 7](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/system_administrators_guide/ch-configuring_ntp_using_ntpd)
