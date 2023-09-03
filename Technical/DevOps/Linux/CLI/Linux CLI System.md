---
title: Linux CLI System
tags:
  - linux
categories: linux
date created: 2023-09-03
date modified: 2023-09-03
---

# Quản lý hệ thống trên Linux

> Từ khóa: `lsb_release`, `reboot`, `exit`, `shutdown`, `date`, `mount`, `umount`, `ps`, `kill`, `systemctl`, `service`, `crontab`

## 1. Quản lý hệ thống Linux

- Xem phiên bản phân phối Linux
  - Sử dụng [lsb_release](#lsb_release) (lệnh này áp dụng cho tất cả các phiên bản Linux)
  - Sử dụng `cat /etc/redhat-release` (phương pháp này chỉ áp dụng cho các phiên bản Linux dựa trên Redhat)
- Xem thông tin CPU - Sử dụng `cat /proc/cpuinfo`
- Khởi động lại hệ thống Linux - Sử dụng [reboot](#reboot)
- Thoát khỏi shell và trả về giá trị cho trạng thái thoát - Sử dụng [exit](#exit)
- Tắt hệ thống - Sử dụng [shutdown](#shutdown)
- Xem hoặc thiết lập thời gian và ngày tháng hệ thống - Sử dụng [date](#date)
- Mount hệ thống tệp - Sử dụng [mount](#mount)
- Unmount hệ thống tệp - Sử dụng [umount](#umount)
- Xem trạng thái hiện tại của quá trình hệ thống - Sử dụng [ps](#ps)
- Xóa quá trình đang chạy hiện tại - Sử dụng [kill](#kill)
- Khởi động, dừng, khởi động lại, tắt, hiển thị dịch vụ hệ thống (Centos7) - Sử dụng [systemctl](#systemctl)
- Khởi động, dừng, khởi động lại, tắt, hiển thị dịch vụ hệ thống (trước Centos7) - Sử dụng [service](#service)
- Quản lý các tác vụ thực hiện định kỳ - Sử dụng [crontab](#crontab)

## 2. Các cách sử dụng phổ biến của các lệnh

### 2.1. lsb_release

lsb_release không phải là lệnh mặc định của bash, nếu muốn sử dụng, bạn cần cài đặt trước.

Cách cài đặt:

1. Chạy `yum provides lsb_release` để xem các gói hỗ trợ lệnh lsb_release.
2. Chọn phiên bản phù hợp và chạy lệnh cài đặt tương tự: `yum install -y redhat-lsb-core-4.1-27.el7.centos.1.x86_64`

### 2.2. reboot

> Lệnh reboot được sử dụng để khởi động lại hệ thống Linux đang chạy.
>
> Tham khảo: http://man.linuxde.net/reboot

Ví dụ:

```bash
reboot        # Khởi động lại máy.
reboot -w     # Giả lập việc khởi động lại (chỉ ghi nhận, không thực sự khởi động lại).
```

### 2.3. exit

> Lệnh exit được sử dụng để thoát khỏi shell và trả về giá trị cho trạng thái thoát. Trong shell script, nó có thể dùng để kết thúc việc thực thi của tập lệnh hiện tại. Lệnh exit khiến shell thoát với giá trị trạng thái đã chỉ định. Nếu không có tham số giá trị trạng thái, shell sẽ thoát với giá trị trạng thái mặc định. Giá trị trạng thái 0 đại diện cho thành công, các giá trị khác đại diện cho thất bại.
>
> Tham khảo: http://man.linuxde.net/exit

Ví dụ:

```bash
# Thoát khỏi shell hiện tại
[root@localhost ~]# exit
logout

# Trong script, điều hướng đến thư mục của script trước khi thoát
cd $(dirname $0) || exit 1

# Trong script, kiểm tra số lượng tham số, nếu không khớp, in ra cách sử dụng và thoát
if [ "$#" -ne "2" ]; then
    echo "usage: $0 <area> <hours>"
    exit 2
fi

# Trong script, xóa tệp tạm khi thoát
trap "rm -f tmpfile; echo Bye." EXIT

# Kiểm tra mã thoát của lệnh trước
./mycommand.sh
EXCODE=$?
if [ "$EXCODE" == "0" ]; then
    echo "O.K"
fi
```

### 2.4. shutdown

> Lệnh shutdown được sử dụng để tắt hệ thống. Lệnh shutdown sẽ đóng tất cả các chương trình và tùy thuộc vào yêu cầu của người dùng, thực hiện lại khởi động hoặc tắt máy.
>
> Tham khảo: http://man.linuxde.net/shutdown

Ví dụ:

```bash
# Tắt máy ngay lập tức
shutdown -h now

# Tắt máy sau 5 phút và gửi thông báo cảnh báo cho người dùng đang đăng nhập
shutdown +5 "System will shutdown after 5 minutes"
```

### 2.5. date

> Lệnh date được sử dụng để hiển thị hoặc đặt thời gian và ngày của hệ thống.
>
> Tham khảo: http://man.linuxde.net/date

Ví dụ:

```bash
# Định dạng đầu ra
date +"%Y-%m-%d"
2009-12-07

# Hiển thị ngày hôm qua
date -d "1 day ago" +"%Y-%m-%d"
2012-11-19

# Hiển thị sau 2 giây
date -d "2 second" +"%Y-%m-%d %H:%M.%S"
2012-11-20 14:21.31

# 1234567890 giây đã trôi qua
date -d "1970-01-01 1234567890 seconds" +"%Y-%m-%d %H:%m:%S"
2009-02-13 23:02:30

# Chuyển đổi từ định dạng thông thường
date -d "2009-12-12" +"%Y/%m/%d %H:%M.%S"
2009/12/12 00:00.00

# Chuyển đổi định dạng apache
date -d "Dec 5, 2009 12:00:37 AM" +"%Y-%m-%d %H:%M.%S"
2009-12-05 00:00.37

# Thay đổi thời gian sau khi chuyển đổi định dạng
date -d "Dec 5, 2009 12:00:37 AM 2 year ago" +"%Y-%m-%d %H:%M.%S"
2007-12-05 00:00.37

# Thêm hoặc trừ thời gian
date +%Y%m%d                   # Hiển thị ngày hôm kia
date -d "+1 day" +%Y%m%d       # Hiển thị ngày hôm qua
date -d "-1 day" +%Y%m%d       # Hiển thị ngày mai
date -d "-1 month" +%Y%m%d     # Hiển thị tháng trước
date -d "+1 month" +%Y%m%d     # Hiển thị tháng sau
date -d "-1 year" +%Y%m%d      # Hiển thị năm trước
date -d "+1 year" +%Y%m%d      # Hiển thị năm sau

# Đặt thời gian
date -s                        # Đặt thời gian hiện tại, chỉ có quyền root mới có thể đặt, người dùng khác chỉ có thể xem
date -s 20120523               # Đặt thành ngày 20120523, thời gian cụ thể sẽ được đặt thành 00:00:00
date -s 01:01:01               # Đặt thời gian cụ thể, không thay đổi ngày tháng
date -s "01:01:01 2012-05-23"  # Có thể đặt toàn bộ thời gian
date -s "01:01:01 20120523"    # Có thể đặt toàn bộ thời gian
date -s "2012-05-23 01:01:01"  # Có thể đặt toàn bộ thời gian
date -s "20120523 01:01:01"    # Có thể đặt toàn bộ thời gian

# Đôi khi cần kiểm tra thời gian mà một nhóm lệnh mất
#!/bin/bash

start=$(date +%s)
nmap man.linuxde.net &> /dev/null

end=$(date +%s)
difference=$(( end - start ))
echo $difference seconds.
```

### 2.6. mount

> Lệnh mount được sử dụng để gắn kết hệ thống tệp vào điểm gắn kết được chỉ định. Lệnh này thường được sử dụng để gắn kết đĩa CD-ROM, cho phép truy cập vào dữ liệu trên đĩa CD-ROM vì khi bạn chèn đĩa CD-ROM vào, Linux không tự động gắn kết, bạn phải sử dụng lệnh mount của Linux để gắn kết thủ công.
>
> Tham khảo: http://man.linuxde.net/mount > https://blog.csdn.net/weishujie000/article/details/76531924

Ví dụ:

```bash
# Gắn kết /dev/hda1 vào /mnt
mount /dev/hda1 /mnt

# Gắn kết /dev/hda1 vào /mnt với chế độ chỉ đọc
mount -o ro /dev/hda1 /mnt

# Gắn kết file image.iso trên /tmp vào /mnt/cdrom bằng chế độ loop
# Phương pháp này cho phép xem nội dung của file ISO Linux thông qua mạng mà không cần ghi ra đĩa CD
mount -o loop /tmp/image.iso /mnt/cdrom
```

### 2.7. umount

> Lệnh umount được sử dụng để gỡ bỏ hệ thống tệp đã được gắn kết. Bạn có thể sử dụng tên thiết bị hoặc điểm gắn kết để umount hệ thống tệp, tuy nhiên nên sử dụng điểm gắn kết để tránh sự nhầm lẫn khi sử dụng gắn kết nhiều điểm (một thiết bị, nhiều điểm gắn kết).
>
> Tham khảo: http://man.linuxde.net/umount

Ví dụ:

```bash
# Gỡ bỏ bằng tên thiết bị
umount -v /dev/sda1
/dev/sda1 umounted

# Gỡ bỏ bằng điểm gắn kết
umount -v /mnt/mymount/
/tmp/diskboot.img umounted
```

### 2.8. ps

> Lệnh ps được sử dụng để báo cáo trạng thái hiện tại của các tiến trình trên hệ thống. Nó có thể được sử dụng kết hợp với lệnh kill để dừng, xóa các chương trình không cần thiết. Lệnh ps là lệnh cơ bản và mạnh mẽ nhất để xem tiến trình, sử dụng lệnh này, bạn có thể xác định các tiến trình đang chạy và trạng thái của chúng, xem xem tiến trình đã kết thúc chưa, tiến trình có bị treo không, tiến trình nào sử dụng quá nhiều tài nguyên và nhiều thông tin khác. Tóm lại, hầu hết thông tin có thể được lấy thông qua việc thực hiện lệnh này.
>
> Tham khảo: http://man.linuxde.net/ps

Ví dụ:

```bash
# Sắp xếp tiến trình theo lượng tài nguyên bộ nhớ sử dụng
ps aux | sort -rnk 4

# Sắp xếp tiến trình theo lượng tài nguyên CPU sử dụng
ps aux | sort -nk 3
```

### 2.9. kill

> Lệnh kill được sử dụng để xóa chương trình hoặc công việc đang chạy. Kill có thể gửi thông tin chỉ định đến chương trình. Thông tin mặc định là SIGTERM(15), có thể sử dụng để kết thúc chương trình. Nếu chương trình vẫn không thể kết thúc, bạn có thể sử dụng thông tin SIGKILL(9) để cố gắng xóa chương trình một cách bắt buộc. Số hiệu chương trình hoặc công việc có thể được xem thông qua lệnh ps hoặc lệnh job.
>
> Tham khảo: http://man.linuxde.net/kill

Ví dụ:

```bash
# Liệt kê tất cả tên thông báo
kill -l
 1) SIGHUP       2) SIGINT       3) SIGQUIT      4) SIGILL
 5) SIGTRAP      6) SIGABRT      7) SIGBUS       8) SIGFPE
 9) SIGKILL     10) SIGUSR1     11) SIGSEGV     12) SIGUSR2
13) SIGPIPE     14) SIGALRM     15) SIGTERM     16) SIGSTKFLT
17) SIGCHLD     18) SIGCONT     19) SIGSTOP     20) SIGTSTP
21) SIGTTIN     22) SIGTTOU     23) SIGURG      24) SIGXCPU
25) SIGXFSZ     26) SIGVTALRM   27) SIGPROF     28) SIGWINCH
29) SIGIO       30) SIGPWR      31) SIGSYS      34) SIGRTMIN
35) SIGRTMIN+1  36) SIGRTMIN+2  37) SIGRTMIN+3  38) SIGRTMIN+4
39) SIGRTMIN+5  40) SIGRTMIN+6  41) SIGRTMIN+7  42) SIGRTMIN+8
43) SIGRTMIN+9  44) SIGRTMIN+10 45) SIGRTMIN+11 46) SIGRTMIN+12
47) SIGRTMIN+13 48) SIGRTMIN+14 49) SIGRTMIN+15 50) SIGRTMAX-14
51) SIGRTMAX-13 52) SIGRTMAX-12 53) SIGRTMAX-11 54) SIGRTMAX-10
55) SIGRTMAX-9  56) SIGRTMAX-8  57) SIGRTMAX-7  58) SIGRTMAX-6
59) SIGRTMAX-5  60) SIGRTMAX-4  61) SIGRTMAX-3  62) SIGRTMAX-2
63) SIGRTMAX-1  64) SIGRTMAX

# Sử dụng ps để tìm tiến trình, sau đó sử dụng kill để kết thúc
ps -ef | grep vim
root      3268  2884  0 16:21 pts/1    00:00:00 vim install.log
root      3370  2822  0 16:21 pts/0    00:00:00 grep vim

kill 3268
kill 3268
-bash: kill: (3268) - Không có tiến trình nào như vậy
```

### 2.10. systemctl

> Lệnh systemctl là công cụ quản lý dịch vụ hệ thống, thực tế nó kết hợp hai lệnh service và chkconfig lại với nhau.
>
> Tham khảo: http://man.linuxde.net/systemctl

Ví dụ:

```bash
# 1. Khởi động dịch vụ nfs
systemctl start nfs-server.service

# 2. Thiết lập tự động khởi động khi máy khởi động
systemctl enable nfs-server.service

# 3. Tắt tự động khởi động khi máy khởi động
systemctl disable nfs-server.service

# 4. Xem trạng thái hiện tại của dịch vụ
systemctl status nfs-server.service

# 5. Khởi động lại dịch vụ
systemctl restart nfs-server.service

# 6. Liệt kê tất cả các dịch vụ đã khởi động
systemctl list -units --type=service

# 7. Mở cổng 22 trong tường lửa
iptables -I INPUT -p tcp --dport 22 -j accept

# 8. Tắt hoàn toàn tường lửa
sudo systemctl status firewalld.service
sudo systemctl stop firewalld.service
sudo systemctl disable firewalld.service
```

### 2.11. service

> Lệnh service là công cụ tiện ích để điều khiển các dịch vụ hệ thống trên các bản phân phối tương thích với Redhat Linux. Nó được sử dụng để khởi động, dừng, khởi động lại và tắt các dịch vụ hệ thống, cũng như hiển thị trạng thái hiện tại của tất cả các dịch vụ hệ thống.
>
> Tham khảo: http://man.linuxde.net/service

Ví dụ:

```bash
service network status
Cấu hình thiết bị:
lo eth0
Thiết bị hoạt động hiện tại:
lo eth0

service network restart
Đang tắt giao diện eth0:                                        [  Đồng ý  ]
Đang tắt giao diện loopback:                                             [  Đồng ý  ]
Đang cấu hình tham số mạng:                                             [  Đồng ý  ]
Đang khởi động giao diện loopback:                                             [  Đồng ý  ]
Đang khởi động giao diện eth0:                                            [  Đồng ý  ]
```

### 2.12. crontab

> Lệnh crontab được sử dụng để gửi và quản lý các tác vụ được thực hiện định kỳ của người dùng. Nó tương tự như công việc lập lịch trong Windows, sau khi cài đặt hệ điều hành, dịch vụ này sẽ được cài đặt mặc định và tiến trình crond sẽ tự động khởi chạy. Tiến trình crond sẽ kiểm tra định kỳ mỗi phút xem có tác vụ nào cần thực hiện không, nếu có, nó sẽ tự động thực hiện tác vụ đó.
>
> Tham khảo: http://man.linuxde.net/crontab

Ví dụ:

```bash
# Thực hiện lệnh command mỗi 1 phút
* * * * * command

# Thực hiện vào lúc 3 và 15 phút mỗi giờ
3,15 * * * * command

# Thực hiện từ 8 giờ đến 11 giờ vào lúc 3 và 15 phút
3,15 8-11 * * * command

# Thực hiện vào lúc 3 và 15 phút mỗi 2 ngày
3,15 8-11 */2 * * command

# Thực hiện vào lúc 3 và 15 phút vào mỗi thứ 2 trong tuần
3,15 8-11 * * 1 command

# Khởi động lại smb vào lúc 21:30 hàng ngày
30 21 * * * /etc/init.d/smb restart

# Khởi động lại smb vào ngày 1, 10, 22 hàng tháng
45 4 1,10,22 * * /etc/init.d/smb restart

# Khởi động lại smb vào lúc 1:10 vào thứ 7 và chủ nhật hàng tuần
10 1 * * 6,0 /etc/init.d/smb restart

# Khởi động lại smb mỗi 30 phút từ 18:00 đến 23:00 hàng ngày
0,30 18-23 * * * /etc/init.d/smb restart

# Khởi động lại smb vào lúc 23:00 vào thứ 7 hàng tuần
0 23 * * 6 /etc/init.d/smb restart

# Khởi động lại smb mỗi giờ
* */1 * * * /etc/init.d/smb restart

# Khởi động lại smb từ 23:00 đến 7:00 hàng ngày
* 23-7/1 * * * /etc/init.d/smb restart

# Khởi động lại smb vào ngày 4 hàng tháng và từ thứ 2 đến thứ 4 lúc 11:00
0 11 4 * mon-wed /etc/init.d/smb restart

# Khởi động lại smb vào lúc 4:00 ngày 1 tháng 1
0 4 1 jan * /etc/init.d/smb restart

# Thực hiện tất cả các tập lệnh trong thư mục `/etc/cron.hourly` mỗi giờ
01 * * * * root run-parts /etc/cron.hourly
```
