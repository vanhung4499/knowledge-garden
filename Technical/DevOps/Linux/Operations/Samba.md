---
title: Samba
tags:
  - linux
categories: linux
date created: 2023-09-03
date modified: 2023-09-03
---

# Samba

> Samba là một phần mềm miễn phí để triển khai giao thức SMB trên hệ thống Linux và UNIX.
>
> Samba cung cấp khả năng chia sẻ dịch vụ trên các máy tính khác nhau (kể cả các hệ điều hành khác nhau).
>
> Từ khóa: `samba`, `selinux`

## 1. Cài đặt và cấu hình Samba

Trong bài viết này, chúng ta sẽ sử dụng một ví dụ hoàn chỉnh để hướng dẫn cách cấu hình Samba để chia sẻ tệp tin giữa Linux và Windows.

Mục tiêu: Giả sử bạn muốn chia sẻ thư mục /share/fs trên máy chủ Linux.

### 1.1. Kiểm tra xem Samba đã được cài đặt chưa

- CentOS: `rpm -qa | grep samba`
- Ubuntu: `dpkg -l | grep samba`

### 1.2. Cài đặt các công cụ Samba

- CentOS: `yum install -y samba samba-client samba-common`
- Ubuntu: `sudo apt-get install -y samba samba-client`

### 1.3. Cấu hình Samba

Tệp cấu hình dịch vụ Samba là /etc/samba/smb.conf. Nếu không có tệp này, dịch vụ Samba sẽ không khởi động.

Chạy lệnh sau để chỉnh sửa tệp cấu hình:

```bash
vim /etc/samba/smb.conf
```

Sửa đổi cấu hình như sau:

```ini
[global]
        workgroup = SAMBA
        security = user

        passdb backend = tdbsam

        printing = cups
        printcap name = cups
        load printers = yes
        cups options = raw

[homes]
        comment = Home Directories
        valid users = %S, %D%w%S
        browseable = No
        read only = No
        inherit acls = Yes

[printers]
        comment = All Printers
        path = /var/tmp
        printable = Yes
        create mask = 0600
        browseable = No

[print$]
        comment = Printer Drivers
        path = /var/lib/samba/drivers
        write list = @printadmin root
        force group = @printadmin
        create mask = 0664
        directory mask = 0775

[fs]
        comment = share folder
        path = /share/fs
        browseable = yes
        writable = yes
        read only = no
        guest ok = yes
        create mask = 0777
        directory mask = 0777
        public = yes
        valid users = root
```

> Giải thích:
>
> - Tôi đã thêm một thẻ **[fs]** ở đây, đây là cấu hình cho khu vực chia sẻ.
> - Tôi đã đặt thuộc tính `path` thành `/share/fs`, điều này có nghĩa là tôi đang chuẩn bị chia sẻ thư mục `/share/fs`, bạn cần điều chỉnh đường dẫn theo nhu cầu thực tế. Quyền truy cập vào thư mục `/share/fs` phải được đặt thành **777**: `chmod 777 /share/fs`.
> - Các thuộc tính `browseable`, `writable` và các thuộc tính khác khá dễ hiểu, chúng cấu hình quyền truy cập vào thư mục chia sẻ.
> - Thuộc tính `valid users` chỉ định người dùng được phép truy cập, lưu ý rằng người dùng được chỉ định phải là người dùng thực tế trên máy chủ Linux.

### 1.4. Tạo người dùng Samba

Người dùng Samba cần phải là người dùng thực tế trên máy chủ Linux.

```bash
$ sudo smbpasswd -a root
New SMB password:
Retype new SMB password:
Added user root.
```

Nhập mật khẩu người dùng Samba theo hướng dẫn. Khi dịch vụ Samba được cài đặt và khởi động thành công, khi truy cập vào thư mục chia sẻ từ Windows, bạn sẽ được yêu cầu nhập tên người dùng và mật khẩu đã cấu hình ở đây.

- Xem danh sách người dùng có trong máy chủ Samba - `pdbedit -L`
- Xóa một người dùng khỏi dịch vụ Samba - `smbpasswd -x username`

### 1.5. Khởi động dịch vụ Samba

CentOS 6

```bash
$ sudo service samba restart  # Khởi động lại dịch vụ Samba
$ sudo service smb restart    # Khởi động lại dịch vụ Samba
```

CentOS 7

```bash
$ sudo systemctl start smb.service     # Khởi động dịch vụ Samba
$ sudo systemctl restart smb.service   # Khởi động lại dịch vụ Samba
$ sudo systemctl enable smb.service    # Cấu hình tự động khởi động
$ sudo systemctl status smb.service    # Kiểm tra trạng thái Samba
```

Ubuntu 16.04.3

```
$ sudo service smbd restart
```

### 1.6. Thêm quy tắc tường lửa cho Samba

```
$ sudo firewall-cmd --permanent --zone=public --add-service=samba
$ sudo firewall-cmd --reload
```

### 1.7. Kiểm tra dịch vụ Samba

```
$ smbclient //localhost/fs -U root
```

Nhập mật khẩu người dùng Samba, nếu thành công, bạn sẽ thấy `smb: \>`.

### 1.8. Truy cập vào thư mục chia sẻ dịch vụ Samba

**Windows:**

Truy cập: `\\<địa chỉ IP của bạn>\<đường dẫn chia sẻ của bạn>`:

**Mac:**

Tương tự như Windows, bạn có thể truy cập trực tiếp vào `smb://<địa chỉ IP của bạn>/<đường dẫn chia sẻ của bạn>` trong Finder.

> :point_right: Tham khảo:
>
> - [Hướng dẫn cài đặt và cấu hình Samba trên CentOS 7](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-samba-share-for-a-small-organization-on-centos-7)
> - [Hướng dẫn cài đặt và cấu hình Samba trên Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-samba-share-for-a-small-organization-on-ubuntu-16-04)

## 2. Cấu hình chi tiết

### 2.1. Cấu hình mặc định của Samba

Bạn có thể lấy tệp cấu hình mặc định từ [đây](https://git.samba.org/samba.git/?p=samba.git;a=blob_plain;f=examples/smb.conf.default;hb=HEAD):

```
$ cp /etc/samba/smb.conf /etc/samba/smb.conf.bak
$ wget "https://git.samba.org/samba.git/?p=samba.git;a=blob_plain;f=examples/smb.conf.default;hb=HEAD" -O /etc/samba/smb.conf
```

Nội dung mặc định của smb.conf như sau:

```ini
[global]
        workgroup = SAMBA
        security = user

        passdb backend = tdbsam

        printing = cups
        printcap name = cups
        load printers = yes
        cups options = raw

[homes]
        comment = Home Directories
        valid users = %S, %D%w%S
        browseable = No
        read only = No
        inherit acls = Yes

[printers]
        comment = All Printers
        path = /var/tmp
        printable = Yes
        create mask = 0600
        browseable = No

[print$]
        comment = Printer Drivers
        path = /var/lib/samba/drivers
        write list = root
        create mask = 0664
        directory mask = 0775
```

### 2.2. Các tham số toàn cầu [global]

```ini
[global]

config file = /usr/local/samba/lib/smb.conf.%m
Giải thích: Tham số config file cho phép bạn sử dụng một tệp cấu hình khác để ghi đè lên tệp cấu hình mặc định. Nếu tệp không tồn tại, thì tham số này sẽ không có hiệu lực. Tham số này rất hữu ích để làm cho cấu hình Samba linh hoạt hơn, cho phép một máy chủ Samba mô phỏng nhiều máy chủ có cấu hình khác nhau. Ví dụ, nếu bạn muốn cho phép máy tính PC1 (tên máy chủ) sử dụng tệp cấu hình riêng của nó khi truy cập vào Samba Server, bạn có thể cấu hình một tệp có tên smb.conf.pc1 cho PC1 trong thư mục /etc/samba/host/ và sau đó thêm vào smb.conf: config file=/etc/samba/host/smb.conf.%m. Điều này có nghĩa là khi PC1 yêu cầu kết nối đến Samba Server, smb.conf.%m sẽ được thay thế bằng smb.conf.pc1. Điều này có nghĩa là đối với PC1, dịch vụ Samba mà nó sử dụng sẽ được xác định bởi smb.conf.pc1, trong khi các máy khác truy cập vào Samba Server vẫn áp dụng smb.conf.

workgroup = WORKGROUP
Giải thích: Đặt workgroup hoặc domain mà Samba Server sẽ tham gia.

server string = Samba Server Version %v
Giải thích: Đặt chuỗi chú thích của Samba Server, có thể là bất kỳ chuỗi nào hoặc để trống. Macro %v đại diện cho hiển thị số phiên bản của Samba.

netbios name = smbserver
Giải thích: Đặt tên NetBIOS của Samba Server. Nếu không được chỉ định, mặc định sẽ sử dụng phần đầu tiên của tên DNS của máy chủ này. Không nên đặt tên netbios name giống với tên workgroup.

interfaces = lo eth0 192.168.12.2/24 192.168.13.2/24
Giải thích: Đặt các giao diện mà Samba Server lắng nghe, có thể là tên giao diện hoặc địa chỉ IP của giao diện đó.

hosts allow = 127.192.168.1 192.168.10.1
Giải thích: Xác định các máy khách được phép kết nối đến Samba Server, các tham số được phân tách bằng dấu cách. Có thể sử dụng một địa chỉ IP hoặc một dải địa chỉ IP. hosts deny và hosts allow là đối nghịch nhau.
Ví dụ:
# Cho phép kết nối từ các máy chủ trong dải 172.17.2.*.*, nhưng loại bỏ máy chủ 172.17.2.50
hosts allow=172.17.2.EXCEPT172.17.2.50
# Cho phép kết nối từ tất cả các máy trong mạng con 172.17.2.0/255.255.0.0
hosts allow=172.17.2.0/255.255.0.0
# Cho phép kết nối từ hai máy tính M1 và M2
hosts allow=M1，M2
# Cho phép kết nối từ tất cả các máy tính trong miền SC
hosts allow=@SC
max connections = 0
Giải thích: max connections được sử dụng để chỉ định số lượng kết nối tối đa đến Samba Server. Nếu vượt quá số lượng kết nối này, các yêu cầu kết nối mới sẽ bị từ chối. Giá trị 0 đại diện cho không giới hạn.

deadtime = 0
Giải thích: deadtime được sử dụng để thiết lập thời gian ngắt kết nối của một kết nối mà không mở bất kỳ tệp nào. Đơn vị là phút, 0 đại diện cho việc Samba Server không tự động ngắt kết nối nào.

time server = yes/no
Giải thích: time server được sử dụng để thiết lập Samba Server làm máy chủ thời gian cho các máy khách Windows.

log file = /var/log/samba/log.%m
Giải thích: Đặt vị trí lưu trữ tệp nhật ký của Samba Server và tên tệp nhật ký. Thêm macro %m (tên máy chủ) vào cuối tên tệp để ghi lại một tệp nhật ký riêng cho mỗi máy truy cập Samba Server. Nếu pc1 và pc2 truy cập vào Samba Server, sẽ có hai tệp nhật ký log.pc1 và log.pc2 trong thư mục /var/log/samba.

max log size = 50
Giải thích: Đặt kích thước tệp nhật ký tối đa của Samba Server, đơn vị là kB, 0 đại diện cho không giới hạn.

security = user
Giải thích: Đặt phương thức xác thực người dùng truy cập Samba Server, có tổng cộng bốn phương thức xác thực.
1. share: Người dùng truy cập Samba Server không cần cung cấp tên người dùng và mật khẩu, độ an toàn thấp.
2. user: Chỉ người dùng được ủy quyền mới có thể truy cập vào thư mục chia sẻ của Samba Server, Samba Server kiểm tra tính chính xác của tài khoản và mật khẩu. Tài khoản và mật khẩu phải được tạo trong Samba Server.
3. server: Dựa vào máy chủ Windows NT/2000 hoặc Samba Server khác để xác thực tài khoản và mật khẩu của người dùng, đây là một phương thức xác thực đại diện. Trong chế độ bảo mật này, quản trị viên hệ thống có thể tập trung tất cả người dùng và mật khẩu Windows vào một hệ thống NT, sử dụng Windows NT để xác thực tất cả người dùng và mật khẩu tự động trên máy chủ từ xa, nếu xác thực thất bại, Samba sẽ sử dụng chế độ bảo mật cấp người dùng như một phương thức thay thế.
4. domain: Cấp độ bảo mật miền, sử dụng máy chủ miền chính (PDC) để xác thực tài khoản.

passdb backend = tdbsam
Giải thích: passdb backend là cơ sở dữ liệu người dùng. Hiện tại có ba cơ sở dữ liệu: smbpasswd, tdbsam và ldapsam. sam có thể là viết tắt của security account manager (quản lý tài khoản bảo mật).

smbpasswd: Phương pháp này sử dụng công cụ smbpasswd của chính Samba để đặt mật khẩu Samba cho người dùng hệ thống (người dùng thực tế hoặc người dùng ảo), và người dùng máy khách sử dụng mật khẩu này để truy cập vào tài nguyên Samba.
1. Tệp smbpasswd mặc định nằm trong thư mục /etc/samba, nhưng đôi khi bạn phải tạo tệp này bằng tay.
2. tdbsam: Phương pháp này sử dụng một tệp cơ sở dữ liệu để xây dựng cơ sở dữ liệu người dùng. Tệp cơ sở dữ liệu có tên passdb.tdb và mặc định nằm trong thư mục /etc/samba. Cơ sở dữ liệu người dùng passdb.tdb có thể được tạo bằng lệnh smbpasswd -a để tạo người dùng Samba, nhưng người dùng Samba cần được tạo trước là người dùng hệ thống. Chúng ta cũng có thể sử dụng lệnh pdbedit để tạo tài khoản Samba. Có nhiều tham số của lệnh pdbedit, chúng ta chỉ liệt kê một số chính.
   pdbedit -a username: Tạo tài khoản Samba mới.
   pdbedit -x username: Xóa tài khoản Samba.
   pdbedit -L: Liệt kê danh sách người dùng Samba, đọc từ tệp cơ sở dữ liệu passdb.tdb.
   pdbedit -Lv: Liệt kê thông tin chi tiết danh sách người dùng Samba.
   pdbedit -c "[D]" -u username: Tạm dừng tài khoản Samba của người dùng này.
   pdbedit -c "[]" -u username: Khôi phục tài khoản Samba của người dùng này.
3. ldapsam: Phương pháp này sử dụng cách quản lý tài khoản dựa trên LDAP để xác thực người dùng. Đầu tiên, bạn cần thiết lập dịch vụ LDAP, sau đó đặt "passdb backend = ldapsam:ldap://LDAP Server"

encrypt passwords = yes/no
Giải thích: Xác định xem mật khẩu xác thực có được mã hóa hay không. Vì hệ điều hành Windows hiện tại đều sử dụng mật khẩu được mã hóa, nên thường phải bật tham số này. Tuy nhiên, tệp cấu hình mặc định đã bật.

smb passwd file = /etc/samba/smbpasswd
Giải thích: Xác định tệp chứa mật khẩu người dùng Samba. Nếu không có tệp smbpasswd, bạn phải tạo tệp này bằng tay.

username map = /etc/samba/smbusers
Giải thích: Xác định ánh xạ tên người dùng, ví dụ có thể chuyển đổi root thành administrator, admin, vv. Tuy nhiên, bạn phải định nghĩa trước trong tệp smbusers. Ví dụ: root = administrator admin, điều này cho phép đăng nhập vào Samba Server bằng tài khoản administrator hoặc admin thay vì root, phù hợp với thói quen người dùng Windows.

guest account = nobody
Giải thích: Đặt tên người dùng guest.

socket options = TCP_NODELAY SO_RCVBUF=8192 SO_SNDBUF=8192
Giải thích: Đặt các tùy chọn socket cho phiên trò chuyện giữa máy chủ và máy khách, có thể tối ưu hóa tốc độ truyền dữ liệu.

domain master = yes/no
Giải thích: Xác định xem Samba Server có trở thành trình duyệt chính của miền hay không, trình duyệt chính của miền có thể quản lý dịch vụ duyệt qua các mạng con.

local master = yes/no
Giải thích: local master xác định xem Samba Server có cố gắng trở thành trình duyệt chính của miền cục bộ hay không. Nếu đặt là no, nó sẽ không bao giờ trở thành trình duyệt chính của miền cục bộ. Tuy nhiên, ngay cả khi đặt là yes, điều này không đồng nghĩa với việc Samba Server sẽ trở thành trình duyệt chính của miền, vẫn cần tham gia vào cuộc bầu cử.

preferred master = yes/no
Giải thích: Đặt Samba Server bắt đầu cuộc bầu cử trình duyệt chính ngay khi khởi động, có thể tăng cơ hội trở thành trình duyệt chính của miền cục bộ. Nếu tham số này được đặt là yes, nên đặt domain master cũng là yes. Khi sử dụng tham số này, hãy lưu ý: Nếu có máy khác trong cùng một mạng con với Samba Server cũng được đặt là trình duyệt chính ưu tiên, các máy này sẽ phát sóng nhiều hơn trên mạng để cạnh tranh trở thành trình duyệt chính, ảnh hưởng đến hiệu suất mạng. Nếu có nhiều máy chủ Samba trong cùng một khu vực, hãy đặt ba tham số trên trên một máy.

os level = 200
Giải thích: Đặt os level của máy chủ Samba. Tham số này quyết định xem Samba Server có cơ hội trở thành trình duyệt chính của miền cục bộ hay không. os level từ 0 đến 255, os level của winNT là 32, os level của win95/98 là 1. os level của Windows 2000 là 64. Nếu đặt là 0, có nghĩa là Samba Server sẽ mất chức năng duyệt. Nếu muốn Samba Server trở thành PDC, hãy đặt os level cao hơn.

domain logons = yes/no
Giải thích: Xác định xem Samba Server có phải là máy chủ miền cục bộ hay không. Cả trình duyệt chính và trình duyệt dự phòng đều cần bật tham số này.

logon . = %u.bat
Giải thích: Khi người dùng đăng nhập bằng máy khách Windows, Samba sẽ cung cấp một tệp đăng nhập. Nếu đặt là %u.bat, mỗi người dùng sẽ có một tệp đăng nhập riêng. Nếu có nhiều người dùng, điều này sẽ gây phiền toái. Bạn có thể đặt thành một tên tệp cụ thể, ví dụ start.bat, sau đó tất cả người dùng sẽ thực hiện start.bat sau khi đăng nhập, không cần đặt một tệp đăng nhập cho mỗi người dùng. Tệp này phải được đặt trong thư mục được định nghĩa trong [netlogon].

wins support = yes/no
Giải thích: Xác định xem máy chủ Samba có cung cấp dịch vụ WINS hay không.

wins server = địa chỉ IP của máy chủ WINS
Giải thích: Xác định xem Samba Server có sử dụng máy chủ WINS khác để cung cấp dịch vụ WINS hay không.

wins proxy = yes/no
Giải thích: Xác định xem Samba Server có bật dịch vụ proxy WINS hay không.

dns proxy = yes/no
Giải thích: Xác định xem Samba Server có bật dịch vụ proxy DNS hay không.

load printers = yes/no
Giải thích: Xác định xem Samba có chia sẻ máy in khi khởi động hay không.

printcap name = cups
Giải thích: Xác định tệp cấu hình máy in được chia sẻ.

printing = cups
Giải thích: Xác định loại máy in được chia sẻ của Samba. Hệ thống in hiện tại hỗ trợ bao gồm: bsd, sysv, plp, lprng, aix, hpux, qnx
```

### 2.3. Các tham số chia sẻ [tên chia sẻ]

```ini
[tên chia sẻ]

comment = Chuỗi tùy ý
Giải thích: Tham số comment được sử dụng để mô tả chia sẻ đó, có thể là bất kỳ chuỗi nào.

path = Đường dẫn thư mục chia sẻ
Giải thích: Tham số path được sử dụng để chỉ định đường dẫn của thư mục chia sẻ. Có thể sử dụng các macro như %u, %m để thay thế tên người dùng Unix và tên Netbios của máy khách, macro được sử dụng chủ yếu cho miền chia sẻ [homes]. Ví dụ: Nếu chúng ta không muốn sử dụng phân đoạn home làm chia sẻ cho khách hàng, mà thay vào đó tạo một thư mục cho mỗi người dùng Linux dưới /home/share/ với tên người dùng của họ làm thư mục chia sẻ của họ, thì path có thể được viết là: path = /home/share/%u. Đường dẫn cụ thể sẽ được thay thế bằng tên người dùng khi người dùng kết nối vào chia sẻ này. Hãy lưu ý rằng đường dẫn tên người dùng này phải tồn tại, nếu không, máy khách sẽ không tìm thấy đường dẫn mạng khi truy cập. Tương tự, nếu chúng ta không phân chia thư mục theo người dùng mà phân chia theo máy khách, tạo một thư mục với tên Netbios của máy khách để làm tài nguyên chia sẻ khác nhau cho các máy trên mạng, chúng ta có thể viết như sau: path = /home/share/%m.

browseable = yes/no
Giải thích: Tham số browseable được sử dụng để xác định xem chia sẻ này có thể duyệt hay không.

writable = yes/no
Giải thích: Tham số writable được sử dụng để xác định xem đường dẫn chia sẻ này có thể ghi hay không.

available = yes/no
Giải thích: Tham số available được sử dụng để xác định xem tài nguyên chia sẻ này có sẵn hay không.

admin users = Người dùng quản trị chia sẻ đó
Giải thích: Tham số admin users được sử dụng để chỉ định người quản trị chia sẻ này (có quyền kiểm soát đầy đủ trên chia sẻ này). Trong Samba 3.0, nếu phương thức xác thực người dùng được đặt thành "security=share", thì tham số này sẽ không có hiệu lực.
Ví dụ: admin users = bobyuan, jane (các người dùng nhiều người được phân tách bằng dấu phẩy).

valid users = Người dùng được phép truy cập chia sẻ đó
Giải thích: Tham số valid users được sử dụng để chỉ định người dùng được phép truy cập vào tài nguyên chia sẻ này.
Ví dụ: valid users = bobyuan, @bob, @tech (các người dùng hoặc nhóm nhiều người được phân tách bằng dấu phẩy, nếu muốn thêm một nhóm, hãy sử dụng "@ + tên nhóm").

invalid users = Người dùng bị cấm truy cập chia sẻ đó
Giải thích: Tham số invalid users được sử dụng để chỉ định người dùng không được phép truy cập vào tài nguyên chia sẻ này.
Ví dụ: invalid users = root, @bob (các người dùng hoặc nhóm nhiều người được phân tách bằng dấu phẩy).

write list = Người dùng được phép ghi vào chia sẻ đó
Giải thích: Tham số write list được sử dụng để chỉ định người dùng có thể ghi tệp vào chia sẻ này.
Ví dụ: write list = bobyuan, @bob

public = yes/no
Giải thích: Tham số public được sử dụng để xác định xem tài nguyên chia sẻ này có cho phép tài khoản guest truy cập hay không.

guest ok = yes/no
Giải thích: Có ý nghĩa tương tự như "public".

Một số chia sẻ đặc biệt:
[homes]
comment = Home Directories
browseable = no
writable = yes
valid users = %S
; valid users = MYDOMAIN\%S

[printers]
comment = All Printers
path = /var/spool/samba
browseable = no
guest ok = no
writable = no
printable = yes

[netlogon]
comment = Network Logon Service
path = /var/lib/samba/netlogon
guest ok = yes
writable = no
share modes = no

[Profiles]
path = /var/lib/samba/profiles
browseable = no
guest ok = yes
```

## 3. Các câu hỏi thường gặp

### 3.1. Bạn có thể không có quyền truy cập vào tài nguyên mạng

Tình huống vấn đề:

- Gặp lỗi **NT_STATUS_ACCESS_DENIED**
- Sau khi đăng nhập thành công vào samba trên Windows, khi nhấp vào thư mục chia sẻ vẫn hiển thị thông báo - Bạn có thể không có quyền truy cập vào tài nguyên mạng.

Các bước giải quyết:

1. Kiểm tra xem có cấu hình các quy tắc tường lửa hay không

```bash
# Một cách là tắt tường lửa bằng cách ép buộc dừng tường lửa
$ sudo service iptables stop

# Một cách khác là cấu hình các quy tắc tường lửa
$ sudo firewall-cmd --permanent --zone=public --add-service=samba
$ sudo firewall-cmd --reload
```

2. Tắt selinux

```bash
# Đặt SELINUX trong tệp /etc/selinux/config thành disabled
$ sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config

# Khởi động lại để có hiệu lực
$ reboot
```

### 3.2. Xóa bộ nhớ cache mật khẩu trên Windows đối với samba

1. Xóa bộ nhớ cache mật khẩu mạng truy cập samba trên Windows
   - Trong cửa sổ dòng lệnh, nhập `control userpasswords2` hoặc `control keymgr.dll`, sau đó chọn 【Advanced】/【Manage Passwords】 và xóa mật khẩu máy tính đã lưu.

2. Xóa bộ nhớ cache dịch vụ samba trên Linux được kết nối từ Windows
   1. Mở cửa sổ dòng lệnh trên Windows.
   2. Nhập `net use`, danh sách các kết nối được lưu trữ sẽ được in ra.
   3. Dựa trên danh sách, xóa từng kết nối: `net use tên kết nối từ xa /del`; hoặc xóa tất cả cùng một lúc: `net use * /del`.
