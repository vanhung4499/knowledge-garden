---
title: Linux CLI Net
tags:
  - linux
categories: linux
date created: 2023-09-03
date modified: 2023-09-03
---

# Quản lý mạng trên Linux

> Từ khóa: `curl`, `wget`, `telnet`, `ip`, `hostname`, `ifconfig`, `route`, `ssh`, `ssh-keygen`, `firewalld`, `iptables`, `host`, `nslookup`, `nc`/`netcat`, `ping`, `traceroute`, `netstat`

## 1. Điểm cần nhớ về ứng dụng mạng trên Linux

- Tải xuống file - Sử dụng [curl](#curl) hoặc [wget](#wget)
- Đăng nhập vào máy chủ từ xa và quản lý máy chủ từ xa bằng telnet - Sử dụng [telnet](#telnet)
- Xem hoặc điều khiển các thiết bị mạng, định tuyến, chính sách định tuyến và đường hầm trên máy chủ Linux - Sử dụng [ip](#ip)
- Xem và cấu hình tên máy chủ của hệ thống - Sử dụng [hostname](#hostname)
- Xem và cấu hình các thông số mạng của giao diện mạng trong kernel Linux - Sử dụng [ifconfig](#ifconfig)
- Xem và cấu hình bảng định tuyến mạng trong kernel Linux - Sử dụng [route](#route)
- Kết nối vào máy chủ từ xa bằng giao thức SSH - Sử dụng SSH
- Tạo, quản lý và chuyển đổi khóa xác thực SSH - Sử dụng [ssh-keygen](#ssh-keygen)
- Xem và cấu hình tường lửa trên CentOS 7 - Sử dụng [firewalld](#firewalld)
- Xem và cấu hình tường lửa trên CentOS 7 trở về trước - Sử dụng [iptables](#iptables)
- Xem thông tin tên miền - Sử dụng [host](#host), [nslookup](#nslookup)
- Thiết lập định tuyến - Sử dụng [nc/netcat](#ncnetcat)
- Kiểm tra kết nối mạng giữa các máy chủ - Sử dụng [ping](#ping)
- Theo dõi đường truyền dữ liệu trên mạng - Sử dụng [traceroute](#traceroute)
- Xem thông tin cổng đang hoạt động - Sử dụng [netstat](#netstat)

## 2. Cách sử dụng các lệnh thông dụng

### 2.1. curl

> Lệnh curl được sử dụng để tải xuống file từ URL. Nó hỗ trợ nhiều giao thức như HTTP, HTTPS, ftp và cung cấp nhiều tính năng như POST, cookies, xác thực, tải xuống một phần của file, chuỗi User-Agent, giới hạn tốc độ, kích thước file, thanh tiến trình và nhiều tính năng khác. Curl có thể hỗ trợ trong việc tự động hóa quy trình xử lý trang web và truy xuất dữ liệu.
>
> Tham khảo: http://man.linuxde.net/curl

Ví dụ:

```bash
# Tải xuống file
$ curl http://man.linuxde.net/text.iso --silent

# Tải xuống file và lưu vào đường dẫn cụ thể, hiển thị tiến trình
$ curl http://man.linuxde.net/test.iso -o filename.iso --progress
########################################## 100.0%
```

### 2.2. wget

> Lệnh wget được sử dụng để tải xuống file từ URL.
>
> Tham khảo: http://man.linuxde.net/wget

Ví dụ:

```bash
# Tải xuống một file đơn lẻ
$ wget http://www.linuxde.net/testfile.zip
```

### 2.3. telnet

> Lệnh telnet được sử dụng để đăng nhập vào máy chủ từ xa và quản lý máy chủ từ xa.
>
> Tham khảo: http://man.linuxde.net/telnet

Ví dụ:

```bash
telnet 192.168.2.10
Trying 192.168.2.10...
Connected to 192.168.2.10 (192.168.2.10).
Escape character is '^]'.

    localhost (Linux release 2.6.18-274.18.1.el5 #1 SMP Thu Feb 9 12:45:44 EST 2012) (1)

login: root
Password:
Login incorrect
```

### 2.4. ip

> Lệnh ip được sử dụng để xem hoặc điều khiển các thiết bị mạng, định tuyến, chính sách định tuyến và đường hầm trên máy chủ Linux. Đây là một công cụ cấu hình mạng mạnh mẽ và mới hơn trên Linux.
>
> Tham khảo: http://man.linuxde.net/ip

Ví dụ:

```bash
$ ip link show                     # Xem thông tin giao diện mạng
$ ip link set eth0 upi             # Bật card mạng
$ ip link set eth0 down            # Tắt card mạng
$ ip link set eth0 promisc on      # Bật chế độ promiscuous cho card mạng
$ ip link set eth0 promisc offi    # Tắt chế độ promiscuous cho card mạng
$ ip link set eth0 txqueuelen 1200 # Đặt độ dài hàng đợi cho card mạng
$ ip link set eth0 mtu 1400        # Đặt kích thước gói tin tối đa cho card mạng
$ ip addr show     # Xem thông tin IP của card mạng
$ ip addr add 192.168.0.1/24 dev eth0 # Đặt địa chỉ IP cho card mạng eth0 là 192.168.0.1
$ ip addr del 192.168.0.1/24 dev eth0 # Xóa địa chỉ IP của card mạng eth0

$ ip route show # Xem bảng định tuyến hệ thống
$ ip route add default via 192.168.1.254   # Đặt định tuyến mặc định cho hệ thống
$ ip route list                 # Xem thông tin định tuyến
$ ip route add 192.168.4.0/24  via  192.168.0.254 dev eth0 # Đặt gateway cho mạng 192.168.4.0 là 192.168.0.254, dữ liệu đi qua giao diện eth0
$ ip route add default via  192.168.0.254  dev eth0        # Đặt gateway mặc định là 192.168.0.254
$ ip route del 192.168.4.0/24   # Xóa gateway cho mạng 192.168.4.0
$ ip route del default          # Xóa định tuyến mặc định
$ ip route delete 192.168.1.0/24 dev eth0 # Xóa định tuyến
```

### 2.5. hostname

> Lệnh hostname được sử dụng để xem và đặt tên máy chủ của hệ thống. Biến môi trường HOSTNAME cũng lưu trữ tên máy chủ hiện tại. Sau khi sử dụng lệnh hostname để đặt tên máy chủ, hệ thống sẽ không lưu trữ tên máy chủ mới vĩnh viễn, sau khi khởi động lại máy, tên máy chủ sẽ trở về tên cũ. Nếu muốn thay đổi tên máy chủ vĩnh viễn, cần chỉnh sửa các nội dung liên quan trong `/etc/hosts` và `/etc/sysconfig/network`.
>
> Tham khảo: http://man.linuxde.net/hostname

Ví dụ:

```bash
$ hostname
AY1307311912260196fcZ
```

### 2.6. ifconfig

> Lệnh ifconfig được sử dụng để xem và cấu hình các thông số mạng của giao diện mạng trong kernel Linux. Cấu hình được thực hiện bằng lệnh ifconfig sẽ không tồn tại sau khi khởi động lại máy chủ. Để lưu trữ cấu hình trên, cần chỉnh sửa tệp cấu hình của giao diện mạng.
>
> Tham khảo: http://man.linuxde.net/ifconfig

Ví dụ:

```bash
# Xem thông tin thiết bị mạng (trạng thái hoạt động)
[root@localhost ~]# ifconfig
eth0      Link encap:Ethernet  HWaddr 00:16:3E:00:1E:51
          inet addr:10.160.7.81  Bcast:10.160.15.255  Mask:255.255.240.0
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:61430830 errors:0 dropped:0 overruns:0 frame:0
          TX packets:88534 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:3607197869 (3.3 GiB)  TX bytes:6115042 (5.8 MiB)

lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
          UP LOOPBACK RUNNING  MTU:16436  Metric:1
          RX packets:56103 errors:0 dropped:0 overruns:0 frame:0
          TX packets:56103 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0
          RX bytes:5079451 (4.8 MiB)  TX bytes:5079451 (4.8 MiB)
```

### 2.7. route

> Lệnh route được sử dụng để xem và cấu hình bảng định tuyến mạng trong kernel Linux. Lệnh route được sử dụng chủ yếu để cấu hình định tuyến tĩnh. Để thiết lập giao tiếp giữa hai mạng con khác nhau, cần có một máy chủ định tuyến kết nối hai mạng hoặc một cổng mạng nằm trên cả hai mạng.
>
> Tham khảo: http://man.linuxde.net/route

Ví dụ:

```bash
# Xem bảng định tuyến hiện tại
route
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
112.124.12.0    *               255.255.252.0   U     0      0        0 eth1
10.160.0.0      *               255.255.240.0   U     0      0        0 eth0
192.168.0.0     10.160.15.247   255.255.0.0     UG    0      0        0 eth0
172.16.0.0      10.160.15.247   255.240.0.0     UG    0      0        0 eth0
10.0.0.0        10.160.15.247   255.0.0.0       UG    0      0        0 eth0
default         112.124.15.247  0.0.0.0         UG    0      0        0 eth1

# Thêm một đường tuyến
route add -net 224.0.0.0 netmask 240.0.0.0 dev eth0    # Thêm một gateway / cấu hình gateway
route add -net 224.0.0.0 netmask 240.0.0.0 reject      # Từ chối một đường tuyến
route del -net 224.0.0.0 netmask 240.0.0.0             # Xóa một bản ghi định tuyến
route add default gw 192.168.120.240                   # Thêm một gateway mặc định
route del default gw 192.168.120.240                   # Xóa gateway mặc định
```

### 2.8. ssh

> Lệnh ssh là công cụ kết nối khách hàng trong gói phần mềm openssh, cho phép kết nối từ xa an toàn vào máy chủ.
>
> Tham khảo: http://man.linuxde.net/ssh

Ví dụ:

```bash
# Kết nối vào máy chủ từ xa
ssh user1@172.24.210.101
# Kết nối vào máy chủ từ xa và chỉ định cổng
ssh -p 2211 root@140.206.185.170
```

Đọc thêm: [Câu chuyện đằng sau ssh](https://linux.cn/article-8476-1.html)

### 2.9. ssh-keygen

> Lệnh ssh-keygen được sử dụng để tạo, quản lý và chuyển đổi khóa xác thực ssh, hỗ trợ hai loại khóa xác thực RSA và DSA.
>
> Tham khảo: http://man.linuxde.net/ssh-keygen

### 2.10. firewalld

> Lệnh firewalld là phần mềm tường lửa trên Linux (mặc định trên CentOS 7).
>
> Tham khảo: https://www.cnblogs.com/moxiaoan/p/5683743.html

#### 2.10.1. Cách sử dụng cơ bản của firewalld

- Khởi động - systemctl start firewalld
- Tắt - systemctl stop firewalld
- Xem trạng thái - systemctl status firewalld
- Vô hiệu hóa khi khởi động - systemctl disable firewalld
- Kích hoạt khi khởi động - systemctl enable firewalld

#### 2.10.2. Sử dụng systemctl quản lý dịch vụ firewalld

systemctl là công cụ quản lý dịch vụ chính trên CentOS 7, kết hợp chức năng của service và chkconfig.

- Khởi động một dịch vụ - systemctl start firewalld.service
- Tắt một dịch vụ - systemctl stop firewalld.service
- Khởi động lại một dịch vụ - systemctl restart firewalld.service
- Hiển thị trạng thái của một dịch vụ - systemctl status firewalld.service
- Kích hoạt một dịch vụ khi khởi động - systemctl enable firewalld.service
- Vô hiệu hóa một dịch vụ khi khởi động - systemctl disable firewalld.service
- Kiểm tra xem dịch vụ có được kích hoạt khi khởi động hay không - systemctl is-enabled firewalld.service
- Liệt kê các dịch vụ đã được kích hoạt - systemctl list-unit-files|grep enabled
- Liệt kê các dịch vụ khởi động thất bại - systemctl --failed

#### 2.10.3. Cấu hình firewalld-cmd

- Xem phiên bản - firewall-cmd --version
- Xem trợ giúp - firewall-cmd --help
- Xem trạng thái - firewall-cmd --state
- Xem tất cả các cổng đã mở - firewall-cmd --zone=public --list-ports
- Cập nhật các quy tắc tường lửa - firewall-cmd --reload
- Xem thông tin về các vùng - firewall-cmd --get-active-zones
- Xem vùng mà một giao diện thuộc về - firewall-cmd --get-zone-of-interface=eth0
- Tắt tất cả các gói tin - firewall-cmd --panic-on
- Bật trạng thái tắt tất cả - firewall-cmd --panic-off
- Kiểm tra xem trạng thái tắt tất cả đã được bật hay chưa - firewall-cmd --query-panic

#### 2.10.4. Mở một cổng trong tường lửa

- Thêm (--permanent để lưu trữ vĩnh viễn, không sử dụng sẽ mất khi khởi động lại) - firewall-cmd --zone=public --add-port=80/tcp --permanent
- Tải lại cấu hình - firewall-cmd --reload
- Kiểm tra - firewall-cmd --zone= public --query-port=80/tcp
- Xóa - firewall-cmd --zone= public --remove-port=80/tcp --permanent

### 2.11. iptables

> Lệnh iptables là phần mềm tường lửa thông dụng trên Linux, là một phần của dự án netfilter. Nó có thể được cấu hình trực tiếp hoặc thông qua nhiều giao diện và giao diện đồ họa.
>
> Tham khảo: http://man.linuxde.net/iptables

Ví dụ:

```bash
# Mở một cổng cụ thể
iptables -A INPUT -s 127.0.0.1 -d 127.0.0.1 -j ACCEPT               # Cho phép giao tiếp loopback (cho phép truy cập từ máy chủ vào chính nó)
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT    # Cho phép giao tiếp đã thiết lập hoặc liên quan
iptables -A OUTPUT -j ACCEPT         # Cho phép tất cả giao tiếp từ máy chủ ra ngoài
iptables -A INPUT -p tcp --dport 22 -j ACCEPT    # Cho phép truy cập vào cổng 22 (SSH)
iptables -A INPUT -p tcp --dport 80 -j ACCEPT    # Cho phép truy cập vào cổng 80 (HTTP)
iptables -A INPUT -p tcp --dport 21 -j ACCEPT    # Cho phép truy cập vào cổng 21 (FTP)
iptables -A INPUT -p tcp --dport 20 -j ACCEPT    # Cho phép truy cập vào cổng 20 (FTP)
iptables -A INPUT -j reject       # Từ chối tất cả các luật truy cập không được phép
iptables -A FORWARD -j REJECT     # Từ chối tất cả các luật truy cập không được phép

# Chặn một địa chỉ IP
iptables -I INPUT -s 123.45.6.7 -j DROP       # Chặn một địa chỉ IP cụ thể
iptables -I INPUT -s 123.0.0.0/8 -j DROP      # Chặn một dải địa chỉ IP
iptables -I INPUT -s 124.45.0.0/16 -j DROP    # Chặn một dải địa chỉ IP
iptables -I INPUT -s 123.45.6.0/24 -j DROP    # Chặn một dải địa chỉ IP

# Xem các luật iptables đã được thêm
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

### 2.12. host

> Lệnh host là công cụ phân tích tên miền thông qua truy vấn DNS, được sử dụng để kiểm tra xem hệ thống DNS hoạt động đúng hay không.
>
> Tham khảo: http://man.linuxde.net/host

Ví dụ:

```bash
[root@localhost ~]# host www.jsdig.com
www.jsdig.com is an alias for host.1.jsdig.com.
host.1.jsdig.com has address 100.42.212.8

[root@localhost ~]# host -a www.jsdig.com
Trying "www.jsdig.com"
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 34671
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
;www.jsdig.com.               IN      ANY

;; ANSWER SECTION:
www.jsdig.com.        463     IN      CNAME   host.1.jsdig.com.

Received 54 bytes from 202.96.104.15#53 in 0 ms
```

### 2.13. nslookup

> Lệnh nslookup là công cụ phân tích tên miền thông qua truy vấn DNS, được sử dụng để kiểm tra thông tin DNS.
>
> Tham khảo: http://man.linuxde.net/nslookup

Ví dụ:

```bash
[root@localhost ~]# nslookup www.jsdig.com
Server:         202.96.104.15
Address:        202.96.104.15#53

Non-authoritative answer:
www.jsdig.com canonical name = host.1.jsdig.com.
Name:   host.1.jsdig.com
Address: 100.42.212.8
```

### 2.14. nc/netcat

> Lệnh nc (viết tắt của netcat) được sử dụng để thiết lập và quản lý kết nối mạng.
>
> Tham khảo: http://man.linuxde.net/nc_netcat

Ví dụ:

```bash
# Quét cổng TCP
[root@localhost ~]# nc -v -z -w2 192.168.0.3 1-100
192.168.0.3: inverse host lookup failed: Unknown host
(UNKNOWN) [192.168.0.3] 80 (http) open
(UNKNOWN) [192.168.0.3] 23 (telnet) open
(UNKNOWN) [192.168.0.3] 22 (ssh) open

# Quét cổng UDP
[root@localhost ~]# nc -u -z -w2 192.168.0.1 1-1000
```

### 2.15. ping

> Lệnh ping được sử dụng để kiểm tra kết nối mạng giữa các máy chủ. Khi thực hiện lệnh ping, nó sẽ sử dụng giao thức ICMP để gửi yêu cầu phản hồi từ máy chủ đích. Nếu máy chủ từ xa hoạt động bình thường, nó sẽ trả lời yêu cầu đó, từ đó ta biết máy chủ hoạt động đúng.
>
> Tham khảo: http://man.linuxde.net/ping

Ví dụ:

```bash
[root@AY1307311912260196fcZ ~]# ping www.jsdig.com
PING host.1.jsdig.com (100.42.212.8) 56(84) bytes of data.
64 bytes from 100-42-212-8.static.webnx.com (100.42.212.8): icmp_seq=1 ttl=50 time=177 ms
64 bytes from 100-42-212-8.static.webnx.com (100.42.212.8): icmp_seq=2 ttl=50 time=178 ms
64 bytes from 100-42-212-8.static.webnx.com (100.42.212.8): icmp_seq=3 ttl=50 time=174 ms
64 bytes from 100-42-212-8.static.webnx.com (100.42.212.8): icmp_seq=4 ttl=50 time=177 ms
...Nhấn Ctrl+C để kết thúc

--- host.1.jsdig.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 2998ms
rtt min/avg/max/mdev = 174.068/176.916/178.182/1.683 ms
```

### 2.16. traceroute

> Lệnh traceroute được sử dụng để theo dõi toàn bộ đường dẫn truyền dữ liệu của gói tin trên mạng, mặc định kích thước gói tin gửi là 40 byte.
>
> Tham khảo: http://man.linuxde.net/traceroute

Ví dụ:

```bash
traceroute www.58.com
traceroute đến www.58.com (211.151.111.30), tối đa 30 bước, gói tin 40 byte
 1  unknown (192.168.2.1)  3.453 ms  3.801 ms  3.937 ms
 2  221.6.45.33 (221.6.45.33)  7.768 ms  7.816 ms  7.840 ms
 3  221.6.0.233 (221.6.0.233)  13.784 ms  13.827 ms 221.6.9.81 (221.6.9.81)  9.758 ms
 4  221.6.2.169 (221.6.2.169)  11.777 ms 122.96.66.13 (122.96.66.13)  34.952 ms 221.6.2.53 (221.6.2.53)  41.372 ms
 5  219.158.96.149 (219.158.96.149)  39.167 ms  39.210 ms  39.238 ms
 6  123.126.0.194 (123.126.0.194)  37.270 ms 123.126.0.66 (123.126.0.66)  37.163 ms  37.441 ms
 7  124.65.57.26 (124.65.57.26)  42.787 ms  42.799 ms  42.809 ms
 8  61.148.146.210 (61.148.146.210)  30.176 ms 61.148.154.98 (61.148.154.98)  32.613 ms  32.675 ms
 9  202.106.42.102 (202.106.42.102)  44.563 ms  44.600 ms  44.627 ms
10  210.77.139.150 (210.77.139.150)  53.302 ms  53.233 ms  53.032 ms
11  211.151.104.6 (211.151.104.6)  39.585 ms  39.502 ms  39.598 ms
12  211.151.111.30 (211.151.111.30)  35.161 ms  35.938 ms  36.005 ms
```

### 2.17. netstat

> Lệnh netstat được sử dụng để in ra thông tin trạng thái hệ thống mạng trên Linux, giúp bạn biết được tình trạng mạng của toàn bộ hệ thống Linux.
>
> Tham khảo: http://man.linuxde.net/netstat

Ví dụ:

```bash
# Liệt kê tất cả các cổng (bao gồm cả cổng lắng nghe và không lắng nghe)
netstat -a     # Liệt kê tất cả các cổng
netstat -at    # Liệt kê tất cả các cổng TCP
netstat -au    # Liệt kê tất cả các cổng UDP

# Liệt kê tất cả các Sockets đang lắng nghe
netstat -l        # Chỉ hiển thị cổng lắng nghe
netstat -lt       # Chỉ liệt kê tất cả các cổng TCP đang lắng nghe
netstat -lu       # Chỉ liệt kê tất cả các cổng UDP đang lắng nghe
netstat -lx       # Chỉ liệt kê tất cả các cổng UNIX đang lắng nghe

# Hiển thị thông tin thống kê cho mỗi giao thức
netstat -s   # Hiển thị thông tin thống kê cho tất cả các cổng
netstat -st   # Hiển thị thông tin thống kê cho cổng TCP
netstat -su   # Hiển thị thông tin thống kê cho cổng UDP
```
