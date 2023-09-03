---
title: Systemd
tags:
  - linux
categories: linux
date created: 2023-09-03
date modified: 2023-09-03
---

# Systemd

> Được dịch từ: [Systemd Tutorial: Part One](http://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-commands.html) và [Systemd Tutorial: Part Two](http://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-part-two.html)

Systemd là một công cụ hệ thống trên Linux, được sử dụng để khởi động các tiến trình phục vụ (daemon) và đã trở thành cấu hình tiêu chuẩn trên hầu hết các bản phân phối Linux.

Bài viết này giới thiệu cách sử dụng cơ bản của Systemd, được chia thành hai phần. Phần này giới thiệu các lệnh chính của Systemd, [phần tiếp theo](http://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-part-two.html) sẽ giới thiệu cách sử dụng Systemd trong thực tế.

## 1. Lý do ra đời

Trong quá khứ, quá trình khởi động của Linux được thực hiện bởi quá trình [`init`](https://en.wikipedia.org/wiki/Init).

Dưới đây là các lệnh được sử dụng để khởi động dịch vụ.

```bash
$ sudo /etc/init.d/apache2 start
# Hoặc
$ service apache2 start
```

Phương pháp này có hai nhược điểm.

Thứ nhất, nó mất thời gian khởi động. Quá trình `init` khởi động tuần tự, chỉ khi tiến trình trước hoàn thành, tiến trình tiếp theo mới được khởi động.

Thứ hai, tập lệnh khởi động phức tạp. Quá trình `init` chỉ thực hiện tập lệnh khởi động, không quan tâm đến các vấn đề khác. Tập lệnh phải xử lý tất cả các trường hợp, điều này thường làm cho tập lệnh trở nên dài dòng.

## 2. Tổng quan về Systemd

Systemd được tạo ra để giải quyết các vấn đề trên. Mục tiêu thiết kế của nó là cung cấp một giải pháp toàn diện cho việc khởi động và quản lý hệ thống.

Theo quy ước của Linux, chữ `d` là viết tắt của từ "daemon". Systemd có ý nghĩa là nó sẽ quản lý toàn bộ hệ thống.

Khi sử dụng Systemd, không cần sử dụng `init` nữa. Systemd thay thế `initd` và trở thành quá trình đầu tiên của hệ thống (PID = 1), các tiến trình khác là con của nó.

```bash
$ systemctl --version
```

Lệnh trên sẽ hiển thị phiên bản của Systemd.

Ưu điểm của Systemd là mạnh mẽ và dễ sử dụng, nhược điểm là phức tạp và rất lớn. Trên thực tế, vẫn còn nhiều người phản đối việc sử dụng Systemd, lý do là nó quá phức tạp, liên kết mạnh mẽ với các phần khác của hệ điều hành và vi phạm triết lý "keep simple, keep stupid" của [Unix](http://www.ruanyifeng.com/blog/2009/06/unix_philosophy.html).

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snapbg2016030703.png)

(Trong hình trên là sơ đồ kiến trúc của Systemd)

## 3. Quản lý hệ thống

Systemd không phải là một lệnh, mà là một nhóm lệnh, liên quan đến quản lý hệ thống.

### 3.1. systemctl

`systemctl` là lệnh chính của Systemd, được sử dụng để quản lý hệ thống.

```bash
# Khởi động lại hệ thống
$ sudo systemctl reboot

# Tắt hệ thống, ngắt nguồn
$ sudo systemctl poweroff

# Dừng CPU
$ sudo systemctl halt

# Tạm dừng hệ thống
$ sudo systemctl suspend

# Đưa hệ thống vào chế độ ngủ đông
$ sudo systemctl hibernate

# Đưa hệ thống vào chế độ ngủ tương tác
$ sudo systemctl hybrid-sleep

# Khởi động vào chế độ cứu hộ (chế độ người dùng đơn)
$ sudo systemctl rescue
```

### 3.2. systemd-analyze

Lệnh `systemd-analyze` được sử dụng để xem thời gian khởi động.

```bash
# Xem thời gian khởi động
$ systemd-analyze

# Xem thời gian khởi động của từng dịch vụ
$ systemd-analyze blame

# Hiển thị biểu đồ dòng thời gian quá trình khởi động
$ systemd-analyze critical-chain

# Hiển thị biểu đồ dòng thời gian khởi động của dịch vụ cụ thể
$ systemd-analyze critical-chain atd.service
```

### 3.3. hostnamectl

Lệnh `hostnamectl` được sử dụng để xem thông tin máy chủ hiện tại.

```bash
# Xem thông tin máy chủ hiện tại
$ hostnamectl

# Đặt tên máy chủ.
$ sudo hostnamectl set-hostname rhel7
```

### 3.4. localectl

Lệnh `localectl` được sử dụng để xem cài đặt địa phương.

```bash
# Xem cài đặt địa phương
$ localectl

# Đặt các thông số địa phương.
$ sudo localectl set-locale LANG=en_GB.utf8
$ sudo localectl set-keymap en_GB
```

### 3.5. timedatectl

Lệnh `timedatectl` được sử dụng để xem cài đặt múi giờ hiện tại.

```bash
# Xem cài đặt múi giờ hiện tại
$ timedatectl

# Liệt kê tất cả các múi giờ có sẵn
$ timedatectl list-timezones

# Đặt múi giờ hiện tại
$ sudo timedatectl set-timezone America/New_York
$ sudo timedatectl set-time YYYY-MM-DD
$ sudo timedatectl set-time HH:MM:SS
```

### 3.6. loginctl

Lệnh `loginctl` được sử dụng để xem người dùng đăng nhập hiện tại.

```bash
# Liệt kê phiên đăng nhập hiện tại
$ loginctl list-sessions

# Liệt kê người dùng đăng nhập hiện tại
$ loginctl list-users

# Hiển thị thông tin về người dùng cụ thể
$ loginctl show-user ruanyf
```

## 4. Unit

### 4.1. Ý nghĩa

Systemd có thể quản lý tất cả các tài nguyên hệ thống. Các tài nguyên khác nhau được gọi chung là Unit (đơn vị).

Unit được chia thành 12 loại.

- Service unit: Dịch vụ hệ thống
- Target unit: Nhóm các Unit khác nhau
- Device Unit: Thiết bị phần cứng
- Mount Unit: Điểm gắn kết hệ thống tệp
- Automount Unit: Điểm gắn kết tự động
- Path Unit: Tệp hoặc đường dẫn
- Scope Unit: Tiến trình bên ngoài không được khởi động bởi Systemd
- Slice Unit: Nhóm tiến trình
- Snapshot Unit: Snapshot của Systemd, cho phép chuyển đổi đến một snapshot cụ thể
- Socket Unit: Socket truyền thông giữa các tiến trình
- Swap Unit: Tệp swap
- Timer Unit: Bộ định thời

Lệnh `systemctl list-units` được sử dụng để xem tất cả các Unit trên hệ thống hiện tại.

```bash
# Liệt kê các Unit đang chạy
$ systemctl list-units

# Liệt kê tất cả các Unit, bao gồm các Unit không có tệp cấu hình hoặc không khởi động thành công
$ systemctl list-units --all

# Liệt kê tất cả các Unit không chạy
$ systemctl list-units --all --state=inactive

# Liệt kê tất cả các Unit không khởi động thành công
$ systemctl list-units --failed

# Liệt kê tất cả các Unit đang chạy, loại là service
$ systemctl list-units --type=service
```

### 4.2. Trạng thái của Unit

Lệnh `systemctl status` được sử dụng để xem trạng thái hệ thống và trạng thái của một Unit cụ thể.

```bash
# Hiển thị trạng thái hệ thống
$ systemctl status

# Hiển thị trạng thái của một Unit cụ thể
$ sysystemctl status bluetooth.service

# Hiển thị trạng thái của một Unit cụ thể trên máy chủ từ xa
$ systemctl -H root@rhel7.example.com status httpd.service
```

Ngoài lệnh `status`, `systemctl` còn cung cấp ba phương thức đơn giản để truy vấn trạng thái, chủ yếu được sử dụng trong các câu lệnh điều kiện trong kịch bản.

```bash
# Hiển thị xem một Unit cụ thể có đang chạy không
$ systemctl is-active application.service

# Hiển thị xem một Unit cụ thể có đang gặp lỗi khởi động không
$ systemctl is-failed application.service

# Hiển thị xem một Unit cụ thể có liên kết khởi động không
$ systemctl is-enabled application.service
```

### 4.3. Quản lý Unit

Đối với người dùng, những lệnh phổ biến nhất để khởi động và dừng Unit (chủ yếu là dịch vụ) như sau.

```bash
# Khởi động một dịch vụ ngay lập tức
$ sudo systemctl start apache.service

# Dừng một dịch vụ ngay lập tức
$ sudo systemctl stop apache.service

# Khởi động lại một dịch vụ
$ sudo systemctl restart apache.service

# Dừng tất cả các tiến trình con của một dịch vụ
$ sudo systemctl kill apache.service

# Tải lại tệp cấu hình của một dịch vụ
$ sudo systemctl reload apache.service

# Tải lại tất cả các tệp cấu hình đã chỉnh sửa
$ sudo systemctl daemon-reload

# Hiển thị tất cả các tham số cơ bản của một Unit
$ systemctl show httpd.service

# Hiển thị giá trị của một thuộc tính cụ thể của một Unit
$ systemctl show -p CPUShares httpd.service

# Thiết lập một thuộc tính cụ thể của một Unit
$ sudo systemctl set-property httpd.service CPUShares=500
```

### 4.4. Mối quan hệ phụ thuộc

Các Unit có mối quan hệ phụ thuộc với nhau: A phụ thuộc vào B, điều này có nghĩa là khi Systemd khởi động A, nó cũng sẽ khởi động B.

Lệnh `systemctl list-dependencies` liệt kê tất cả các phụ thuộc của một Unit.

```bash
$ systemctl list-dependencies nginx.service
```

Kết quả đầu ra của lệnh trên có một số phụ thuộc là loại Target (xem chi tiết bên dưới) và mặc định không được mở rộng. Nếu muốn mở rộng Target, cần sử dụng tham số `--all`.

```bash
$ systemctl list-dependencies --all nginx.service
```

## 5. Các tệp cấu hình Unit

### 5.1. Tổng quan

Mỗi Unit đều có một tệp cấu hình, cho biết cách Systemd khởi động Unit đó.

Systemd mặc định đọc tệp cấu hình từ thư mục `/etc/systemd/system/`. Tuy nhiên, hầu hết các tệp trong thư mục này đều là liên kết tượng trưng, trỏ đến thư mục `/usr/lib/systemd/system/`, nơi chứa các tệp cấu hình thực sự.

Lệnh `systemctl enable` được sử dụng để tạo liên kết tượng trưng giữa hai thư mục trên.

```bash
$ sudo systemctl enable clamd@scan.service
# Tương đương với
$ sudo ln -s '/usr/lib/systemd/system/clamd@scan.service' '/etc/systemd/system/multi-user.target.wants/clamd@scan.service'
```

Nếu tệp cấu hình đặt cấu hình khởi động khi khởi động, lệnh `systemctl enable` tương đương với kích hoạt khởi động khi khởi động.

Tương ứng với điều đó, lệnh `systemctl disable` được sử dụng để hủy liên kết tượng trưng giữa hai thư mục, tương đương với việc vô hiệu hóa khởi động khi khởi động.

```bash
$ sudo systemctl disable clamd@scan.service
```

Tiến trình Systemd cần tải lại tệp cấu hình sau khi thay đổi tệp cấu hình và khởi động lại để thay đổi có hiệu lực.

```bash
$ sudo systemctl daemon-reload
$ sudo systemctl restart httpd.service
```

### 5.2. Trạng thái của tệp cấu hình

Lệnh `systemctl list-unit-files` được sử dụng để liệt kê tất cả các tệp cấu hình.

```bash
# Liệt kê tất cả các tệp cấu hình
$ systemctl list-unit-files

# Liệt kê các tệp cấu hình của loại cụ thể
$ systemctl list-unit-files --type=service
```

Lệnh này sẽ xuất ra một danh sách.

```bash
$ systemctl list-unit-files

UNIT FILE              STATE
chronyd.service        enabled
clamd@.service         static
clamd@scan.service     disabled
```

Danh sách này hiển thị trạng thái của mỗi tệp cấu hình, có tổng cộng bốn trạng thái.

- enabled: Đã tạo liên kết khởi động
- disabled: Không tạo liên kết khởi động
- static: Tệp cấu hình không có phần `[Install]` (không thể thực thi), chỉ có thể là phụ thuộc của các tệp cấu hình khác
- masked: Tệp cấu hình này bị cấm tạo liên kết khởi động

Lưu ý rằng từ trạng thái của tệp cấu hình không thể biết được Unit đó có đang chạy hay không. Điều này phải được kiểm tra bằng lệnh `systemctl status` như đã đề cập ở trên.

```bash
$ systemctl status bluetooth.service
```

Sau khi chỉnh sửa tệp cấu hình, SystemD cần tải lại tệp cấu hình và khởi động lại để thay đổi có hiệu lực.

```bash
$ sudo systemctl daemon-reload
$ sudo systemctl restart httpd.service
```

### 5.3. Định dạng tệp cấu hình

Tệp cấu hình chỉ là tệp văn bản thông thường, có thể mở bằng trình chỉnh sửa văn bản.

Lệnh `systemctl cat` có thể được sử dụng để xem nội dung của tệp cấu hình.

```bash
$ systemctl cat atd.service

[Unit]
Description=ATD daemon

[Service]
Type=forking
ExecStart=/usr/bin/atd

[Install]
WantedBy=multi-user.target
```

Từ đầu ra trên, có thể thấy rằng tệp cấu hình được chia thành một số khối. Dòng đầu tiên của mỗi khối là tên khối được đặt trong dấu ngoặc vuông, ví dụ `[Unit]`. Lưu ý rằng tên khối và tên trường trong tệp cấu hình phân biệt chữ hoa chữ thường.

Bên trong mỗi khối là một số cặp khóa-giá trị được nối bằng dấu bằng.

```bash
[Section]
Directive1=value
Directive2=value

. . .
```

Lưu ý rằng không có khoảng trắng trước và sau dấu bằng trong cặp khóa-giá trị.

### 5.4. Các khối trong tệp cấu hình

Khối `[Unit]` thường là khối đầu tiên trong tệp cấu hình, được sử dụng để xác định siêu dữ liệu của Unit và cấu hình quan hệ với các Unit khác. Các trường chính của nó bao gồm:

- `Description`: Mô tả ngắn gọn
- `Documentation`: Đường dẫn tới tài liệu
- `Requires`: Các Unit mà Unit hiện tại phụ thuộc vào, nếu chúng không chạy, Unit hiện tại sẽ không khởi động thành công
- `Wants`: Các Unit liên quan đến Unit hiện tại, nếu chúng không chạy, Unit hiện tại sẽ không khởi động thành công
- `BindsTo`: Tương tự như `Requires`, nhưng nếu các Unit được chỉ định thoát ra, Unit hiện tại sẽ dừng lại
- `Before`: Nếu các Unit được chỉ định trong trường này cũng cần khởi động, chúng phải được khởi động sau Unit hiện tại
- `After`: Nếu các Unit được chỉ định trong trường này cũng cần khởi động, chúng phải được khởi động trước Unit hiện tại
- `Conflicts`: Các Unit được chỉ định ở đây không thể chạy cùng với Unit hiện tại
- `Condition…`: Các điều kiện mà Unit hiện tại phải thỏa mãn để chạy, nếu không, nó sẽ không chạy
- `Assert…`: Các điều kiện mà Unit hiện tại phải thỏa mãn để chạy, nếu không, nó sẽ báo lỗi khi khởi động

Khối `[Install]` thường là khối cuối cùng trong tệp cấu hình, được sử dụng để xác định cách khởi động và xem xét khởi động khi khởi động. Các trường chính của nó bao gồm:

- `WantedBy`: Giá trị của nó là một hoặc nhiều Target, khi Unit hiện tại được kích hoạt, liên kết tượng trưng sẽ được đặt trong thư mục `/etc/systemd/system` trong các thư mục con được tạo thành từ tên Target + `.wants` hậu tố
- `RequiredBy`: Giá trị của nó là một hoặc nhiều Target, khi Unit hiện tại được kích hoạt, liên kết tượng trưng sẽ được đặt trong thư mục `/etc/systemd/system` trong các thư mục con được tạo thành từ tên Target + `.required` hậu tố
- `Alias`: Tên thay thế cho Unit hiện tại có thể được sử dụng để khởi động
- `Also`: Các Unit sẽ được kích hoạt cùng với Unit hiện tại khi nó được kích hoạt

Khối `[Service]` được sử dụng để cấu hình dịch vụ, chỉ có các Unit loại Service mới có khối này. Các trường chính của nó bao gồm:

- `Type`: Xác định hành vi tiến trình khi khởi động. Có các giá trị sau:
  - `Type=simple`: Giá trị mặc định, thực thi lệnh `ExecStart` để khởi động tiến trình chính
  - `Type=forking`: Tạo một tiến trình con từ tiến trình cha bằng cách sử dụng fork, sau đó tiến trình cha sẽ thoát ngay lập tức
  - `Type=oneshot`: Tiến trình một lần, Systemd sẽ đợi cho đến khi dịch vụ hiện tại thoát ra trước khi tiếp tục thực hiện các bước tiếp theo
  - `Type=dbus`: Dịch vụ hiện tại được khởi động thông qua D-Bus
  - `Type=notify`: Dịch vụ hiện tại thông báo cho Systemd khi nó đã khởi động xong, sau đó Systemd sẽ tiếp tục thực hiện các bước tiếp theo
  - `Type=idle`: Dịch vụ hiện tại chỉ chạy khi không có tác vụ khác đang chạy
- `ExecStart`: Lệnh khởi động dịch vụ hiện tại
- `ExecStartPre`: Các lệnh chạy trước khi khởi động dịch vụ hiện tại
- `ExecStartPost`: Các lệnh chạy sau khi khởi động dịch vụ hiện tại
- `ExecReload`: Lệnh chạy khi tái khởi động dịch vụ hiện tại
- `ExecStop`: Lệnh chạy khi dừng dịch vụ hiện tại
- `ExecStopPost`: Các lệnh chạy sau khi dừng dịch vụ hiện tại
- `RestartSec`: Số giây chờ giữa các lần khởi động lại tự động
- `Restart`: Xác định khi nào Systemd sẽ tự động khởi động lại dịch vụ hiện tại, các giá trị có thể là `always` (luôn khởi động lại), `on-success`, `on-failure`, `on-abnormal`, `on-abort`, `on-watchdog`
- `TimeoutSec`: Số giây chờ trước khi Systemd dừng dịch vụ hiện tại
- `Environment`: Xác định biến môi trường

## 6. Target

Khi khởi động máy tính, cần khởi động nhiều Unit. Nếu mỗi lần khởi động đều phải liệt kê tất cả các Unit cần khởi động, điều này rõ ràng rất bất tiện. Giải pháp của Systemd là Target.

Đơn giản nói, Target là một nhóm Unit, bao gồm nhiều Unit liên quan. Khi khởi động một Target, Systemd sẽ khởi động tất cả các Unit trong đó. Theo cách này, khái niệm Target tương tự như "điểm trạng thái", khởi động một Target tương tự như khởi động đến một trạng thái cụ thể.

Trong chế độ khởi động truyền thống của `init`, có khái niệm RunLevel, tương tự với vai trò của Target. Tuy nhiên, RunLevel là đối kháng, không thể khởi động nhiều RunLevel cùng một lúc, trong khi nhiều Target có thể khởi động cùng một lúc.

```bash
# Xem tất cả các Target trên hệ thống hiện tại
$ systemctl list-unit-files --type=target

# Xem tất cả các Unit được bao gồm trong một Target
$ systemctl list-dependencies multi-user.target

# Xem Target mặc định khi khởi động
$ systemctl get-default

# Đặt Target mặc định khi khởi động
$ sudo systemctl set-default multi-user.target

# Khi chuyển đổi Target, mặc định không tắt các tiến trình được khởi động bởi Target trước đó,
# lệnh systemctl isolate thay đổi hành vi này,
# tắt tất cả các tiến trình không thuộc Target sau khi chuyển đổi
$ sudo systemctl isolate multi-user.target
```

Mối quan hệ giữa Target và RunLevel truyền thống như sau.

```bash
Traditional runlevel      New target name     Symbolically linked to...

Runlevel 0           |    runlevel0.target -> poweroff.target
Runlevel 1           |    runlevel1.target -> rescue.target
Runlevel 2           |    runlevel2.target -> multi-user.target
Runlevel 3           |    runlevel3.target -> multi-user.target
Runlevel 4           |    runlevel4.target -> multi-user.target
Runlevel 5           |    runlevel5.target -> graphical.target
Runlevel 6           |    runlevel6.target -> reboot.target
```

Có một số khác biệt chính giữa nó và quá trình `init`.

**（1）RunLevel mặc định** (được cài đặt trong tệp `/etc/inittab`) bây giờ được thay thế bằng Target mặc định (được đặt trong `/etc/systemd/system/default.target`), thường là liên kết tượng trưng đến `graphical.target` (giao diện đồ họa) hoặc `multi-user.target` (dòng lệnh đa người dùng).

**（2）Vị trí các tập lệnh khởi động** trước đây là thư mục `/etc/init.d`, liên kết tượng trưng đến các thư mục RunLevel khác nhau (ví dụ: `/etc/rc3.d`, `/etc/rc5.d`), bây giờ được đặt trong thư mục `/lib/systemd/system` và `/etc/systemd/system`.

**（3）Vị trí tệp cấu hình** trước đây, tệp cấu hình của quá trình `init` là `/etc/inittab`, các tệp cấu hình dịch vụ được lưu trữ trong thư mục `/etc/sysconfig`. Bây giờ, các tệp cấu hình chính được lưu trữ chủ yếu trong thư mục `/lib/systemd`, các thay đổi trong thư mục `/etc/systemd` có thể ghi đè lên cài đặt ban đầu.

## 7. Quản lý nhật ký

Systemd quản lý tất cả các nhật ký khởi động của các Unit. Lợi ích của việc này là có thể sử dụng chỉ một lệnh `journalctl` để xem tất cả các nhật ký (nhật ký hạt nhân và nhật ký ứng dụng). Tệp cấu hình nhật ký được lưu trữ trong `/etc/systemd/journald.conf`.

`journalctl` rất mạnh mẽ và có nhiều cách sử dụng.

```bash
# Xem tất cả các nhật ký (theo mặc định, chỉ lưu trữ nhật ký khởi động hiện tại)
$ sudo journalctl

# Xem nhật ký hạt nhân (không hiển thị nhật ký ứng dụng)
$ sudo journalctl -k

# Xem nhật ký khởi động hiện tại của hệ thống
$ sudo journalctl -b
$ sudo journalctl -b -0

# Xem nhật ký khởi động trước đó (cần thay đổi cài đặt)
$ sudo journalctl -b -1

# Xem nhật ký trong khoảng thời gian cụ thể
$ sudo journalctl --since="2012-10-30 18:17:16"
$ sudo journalctl --since "20 min ago"
$ sudo journalctl --since yesterday
$ sudo journalctl --since "2015-01-10" --until "2015-01-11 03:00"
$ sudo journalctl --since 09:00 --until "1 hour ago"

# Hiển thị 10 dòng nhật ký mới nhất
$ sudo journalctl -n

# Hiển thị số dòng nhật ký cụ thể
$ sudo journalctl -n 20

# Hiển thị nhật ký mới nhất theo thời gian thực
$ sudo journalctl -f

# Xem nhật ký của một dịch vụ cụ thể
$ sudo journalctl -u nginx.service
$ sudo journalctl -u nginx.service --since today

# Hiển thị nhật ký mới nhất của một dịch vụ cụ thể theo thời gian thực
$ sudo journalctl -u nginx.service -f

# Kết hợp hiển thị nhật ký của nhiều dịch vụ
$ journalctl -u nginx.service -u php-fpm.service --since today

# Xem nhật ký với mức ưu tiên cụ thể (và các mức ưu tiên cao hơn), có 8 mức ưu tiên
# 0: emerg
# 1: alert
# 2: crit
# 3: err
# 4: warning
# 5: notice
# 6: info
# 7: debug
$ sudo journalctl -p err -b

# Mặc định, nhật ký được phân trang, sử dụng --no-pager để hiển thị trên đầu ra tiêu chuẩn bình thường
$ sudo journalctl --no-pager

# Đầu ra dưới dạng JSON (một dòng)
$ sudo journalctl -b -u nginx.service -o json

# Đầu ra dưới dạng JSON (nhiều dòng), dễ đọc hơn
$ sudo journalctl -b -u nginx.service -o json-pretty

# Hiển thị dung lượng đĩa đã sử dụng cho nhật ký
$ sudo journalctl --disk-usage

# Xác định dung lượng tối đa của tệp nhật ký
$ sudo journalctl --vacuum-size=1G

# Xác định thời gian lưu trữ tệp nhật ký
$ sudo journalctl --vacuum-time=1years
```

## 8. Thực hành

### 8.1. Khởi động cùng hệ thống

Đối với các phần mềm hỗ trợ Systemd, khi cài đặt, nó sẽ tự động thêm một tệp cấu hình vào thư mục `/usr/lib/systemd/system`.

Nếu bạn muốn phần mềm đó khởi động cùng hệ thống, hãy thực hiện lệnh sau (ví dụ với `httpd.service`).

```bash
$ sudo systemctl enable httpd
```

Lệnh trên tương đương với việc tạo một liên kết tượng trưng trong thư mục `/etc/systemd/system`, trỏ đến tệp `httpd.service` trong `/usr/lib/systemd/system`.

Điều này xảy ra vì khi khởi động, `Systemd` chỉ thực thi các tệp cấu hình trong thư mục `/etc/systemd/system`. Điều này cũng có nghĩa là nếu bạn đặt tệp cấu hình đã chỉnh sửa vào thư mục đó, bạn có thể ghi đè lên cài đặt ban đầu.

### 8.2. Khởi động dịch vụ

Sau khi đặt khởi động cùng hệ thống, phần mềm sẽ không khởi động ngay lập tức. Bạn cần thực thi lệnh `systemctl start` để chạy phần mềm đó ngay bây giờ (ví dụ với `httpd`).

```bash
$ sudo systemctl start httpd
```

Sau khi thực hiện lệnh trên, có thể xảy ra lỗi khi khởi động, vì vậy hãy sử dụng lệnh `systemctl status` để kiểm tra trạng thái của dịch vụ đó.

```bash
$ sudo systemctl status httpd

httpd.service - The Apache HTTP Server
Loaded: loaded (/usr/lib/systemd/system/httpd.service; enabled)
Active: active (running) since Fri 2014-12-05 12:18:22 JST; 7min ago
Main PID: 4349 (httpd)
Status: "Total requests: 1; Current requests/sec: 0; Current traffic:   0 B/sec"
CGroup: /system.slice/httpd.service
        ├─4349 /usr/sbin/httpd -DFOREGROUND
        ├─4350 /usr/sbin/httpd -DFOREGROUND
        ├─4351 /usr/sbin/httpd -DFOREGROUND
        ├─4352 /usr/sbin/httpd -DFOREGROUND
        ├─4353 /usr/sbin/httpd -DFOREGROUND
        └─4354 /usr/sbin/httpd -DFOREGROUND

Dec 05 12:18:22 localhost.localdomain systemd[1]: Starting The Apache HTTP Server...
Dec 05 12:18:22 localhost.localdomain systemd[1]: Started The Apache HTTP Server.
Dec 05 12:22:40 localhost.localdomain systemd[1]: Started The Apache HTTP Server.
```

Các thông tin trong đầu ra trên có ý nghĩa như sau:

- Dòng `Loaded`: Vị trí tệp cấu hình, liệu có được đặt khởi động cùng hệ thống hay không
- Dòng `Active`: Đang chạy
- Dòng `Main PID`: PID chính của quá trình
- Dòng `Status`: Trạng thái hiện tại của phần mềm do chính ứng dụng cung cấp
- Khối `CGroup`: Tất cả các tiến trình con của ứng dụng
- Khối nhật ký: Nhật ký của ứng dụng

### 8.3. Dừng dịch vụ

Để dừng dịch vụ đang chạy, bạn cần thực hiện lệnh `systemctl stop`.

```bash
$ sudo systemctl stop httpd.service
```

Đôi khi, lệnh này có thể không phản hồi và dịch vụ không dừng lại. Trong trường hợp này, bạn phải "giết tiến trình" bằng cách gửi tín hiệu `kill` đến tiến trình đang chạy.

```bash
$ sudo systemctl kill httpd.service
```

Ngoài ra, để khởi động lại dịch vụ, bạn cần thực hiện lệnh `systemctl restart`.

```bash
$ sudo systemctl restart httpd.service
```

### 8.4. Đọc tệp cấu hình

Cách một dịch vụ khởi động hoàn toàn phụ thuộc vào tệp cấu hình của nó. Dưới đây là một số nội dung của tệp cấu hình.

Trước đó đã nói rằng tệp cấu hình chủ yếu được lưu trữ trong thư mục `/usr/lib/systemd/system`, cũng có thể nằm trong thư mục `/etc/systemd/system`. Tìm tệp cấu hình và mở nó bằng trình chỉnh sửa văn bản.

Lệnh `systemctl cat` có thể được sử dụng để xem tệp cấu hình, dưới đây là một ví dụ với tệp `sshd.service`, nó được sử dụng để khởi động một máy chủ SSH để cho phép người dùng đăng nhập qua SSH.

```bash
$ systemctl cat sshd.service

[Unit]
Description=OpenSSH server daemon
Documentation=man:sshd(8) man:sshd_config(5)
After=network.target sshd-keygen.service
Wants=sshd-keygen.service

[Service]
EnvironmentFile=/etc/sysconfig/sshd
ExecStart=/usr/sbin/sshd -D $OPTIONS
ExecReload=/bin/kill -HUP $MAINPID
Type=simple
KillMode=process
Restart=on-failure
RestartSec=42s

[Install]
WantedBy=multi-user.target
```

Có thể thấy, tệp cấu hình được chia thành một số khối, mỗi khối chứa một số cặp khóa-giá trị.

Dưới đây là giải thích từng khối.

- Khối `[Unit]`: Mô tả, tài liệu, các phụ thuộc và yêu cầu của Unit
- Khối `[Service]`: Tệp môi trường, lệnh khởi động, lệnh tái tải, kiểu dịch vụ, chế độ giết tiến trình, khởi động lại khi lỗi, thời gian khởi động lại
- Khối `[Install]`: Được yêu cầu bởi Target nào

### 8.5. Khối [Unit]: Thứ tự khởi động và mối quan hệ phụ thuộc

Trong khối [Unit], trường Description cung cấp mô tả đơn giản về dịch vụ hiện tại, trong khi trường Documentation cung cấp vị trí tài liệu.

Cài đặt tiếp theo là thứ tự khởi động và mối quan hệ phụ thuộc, điều này rất quan trọng.

> Trường After: Điều này cho biết nếu cần khởi động network.target hoặc sshd-keygen.service, thì sshd.service nên khởi động sau chúng.

Tương tự, có một trường Before để xác định sshd.service nên khởi động trước các dịch vụ nào.

Lưu ý rằng trường After và Before chỉ liên quan đến thứ tự khởi động, không liên quan đến mối quan hệ phụ thuộc.

Ví dụ, một ứng dụng web cần lưu trữ dữ liệu trong cơ sở dữ liệu postgresql. Trong tệp cấu hình, nó chỉ xác định rằng nó nên khởi động sau postgresql, mà không xác định phụ thuộc vào postgresql. Khi triển khai, vì một lý do nào đó, postgresql cần khởi động lại. Trong quá trình dừng dịch vụ, ứng dụng web sẽ không thể thiết lập kết nối cơ sở dữ liệu.

Để thiết lập mối quan hệ phụ thuộc, bạn cần sử dụng trường Wants và Requires.

> Trường Wants: Điều này cho biết sshd.service có mối quan hệ "yếu" với sshd-keygen.service, tức là nếu sshd-keygen.service không khởi động thành công hoặc dừng lại, điều đó không ảnh hưởng đến việc tiếp tục thực thi sshd.service.

Trường Requires đại diện cho mối quan hệ "mạnh" hơn, tức là nếu dịch vụ đó không khởi động thành công hoặc thoát ra một cách bất thường, thì sshd.service cũng phải thoát.

Lưu ý rằng trường Wants và Requires chỉ liên quan đến mối quan hệ phụ thuộc, không liên quan đến thứ tự khởi động, mặc định chúng được khởi động cùng nhau.

### 8.6. Khối [Service]: Hành vi khởi động dịch vụ

Khối [Service] xác định cách khởi động dịch vụ hiện tại.

#### 8.6.1. Lệnh khởi động

Nhiều phần mềm có tệp tham số môi trường riêng của chúng, tệp này có thể được đọc bằng trường `EnvironmentFile`.

> Trường `EnvironmentFile`: Xác định tệp tham số môi trường của dịch vụ hiện tại. Các cặp khóa=giá trị trong tệp này có thể được truy xuất trong tệp cấu hình hiện tại bằng cách sử dụng `$key`.

Trong ví dụ trên, tệp tham số môi trường của sshd là `/etc/sysconfig/sshd`.

Trường quan trọng nhất trong tệp cấu hình là `ExecStart`.

> Trường `ExecStart`: Xác định lệnh được thực thi khi khởi động quá trình.

Trong ví dụ trên, khi khởi động `sshd`, lệnh được thực thi là `/usr/sbin/sshd -D $OPTIONS`, trong đó biến `$OPTIONS` được lấy từ tệp tham số môi trường được chỉ định bởi trường `EnvironmentFile`.

Có một số trường tương tự như sau.

- Trường `ExecReload`: Lệnh được thực thi khi khởi động lại dịch vụ
- Trường `ExecStop`: Lệnh được thực thi khi dừng dịch vụ
- Trường `ExecStartPre`: Lệnh được thực thi trước khi khởi động dịch vụ
- Trường `ExecStartPost`: Lệnh được thực thi sau khi khởi động dịch vụ
- Trường `ExecStopPost`: Lệnh được thực thi sau khi dừng dịch vụ

Xem ví dụ dưới đây.

```
[Service]
ExecStart=/bin/echo execstart1
ExecStart=
ExecStart=/bin/echo execstart2
ExecStartPost=/bin/echo post1
ExecStartPost=/bin/echo post2
```

Trong tệp cấu hình trên, trường thứ hai `ExecStart` được đặt là giá trị rỗng, tương đương với việc hủy bỏ cài đặt của trường đầu tiên, kết quả chạy như sau.

```
execstart2
post1
post2
```

Trước tất cả các thiết lập khởi động, bạn có thể thêm một dấu gạch ngang (`-`) để "ngăn lỗi", có nghĩa là khi có lỗi xảy ra, nó sẽ không ảnh hưởng đến việc thực thi các lệnh khác. Ví dụ, `EnvironmentFile=-/etc/sysconfig/sshd` (lưu ý dấu gạch ngang sau dấu bằng) có nghĩa là ngay cả khi tệp `/etc/sysconfig/sshd` không tồn tại, nó cũng sẽ không gây ra lỗi.

#### 8.6.2. Loại khởi động

Trường `Type` xác định loại khởi động. Nó có thể có các giá trị sau.

- simple (giá trị mặc định): Quá trình được khởi động bởi trường `ExecStart` là quá trình chính
- forking: Trường `ExecStart` sẽ khởi động bằng cách sử dụng `fork()`, lúc này quá trình cha sẽ thoát và quá trình con sẽ trở thành quá trình chính
- oneshot: Tương tự như `simple`, nhưng chỉ thực thi một lần duy nhất, Systemd sẽ đợi nó thực thi xong trước khi khởi động các dịch vụ khác
- dbus: Tương tự như `simple`, nhưng sẽ đợi tín hiệu D-Bus trước khi khởi động
- notify: Tương tự như `simple`, sau khi khởi động xong, nó sẽ gửi tín hiệu thông báo, sau đó Systemd mới khởi động các dịch vụ khác
- idle: Tương tự như `simple`, nhưng sẽ đợi cho đến khi tất cả các tác vụ khác thực thi xong mới khởi động dịch vụ này. Một trong những trường hợp sử dụng là để đảm bảo đầu ra của dịch vụ này không bị trộn lẫn với đầu ra của các dịch vụ khác

Dưới đây là một ví dụ với loại `oneshot`, khi máy tính xách tay khởi động, cần tắt touchpad, tệp cấu hình có thể được viết như sau.

```
[Unit]
Description=Switch-off Touchpad

[Service]
Type=oneshot
ExecStart=/usr/bin/touchpad-off

[Install]
WantedBy=multi-user.target
```

Trong tệp cấu hình trên, loại khởi động được đặt là `oneshot`, điều này có nghĩa là dịch vụ chỉ cần chạy một lần, không cần chạy liên tục.

Nếu sau khi tắt, muốn mở lại vào một thời điểm sau, tệp cấu hình sẽ được sửa như sau.

```
[Unit]
Description=Switch-off Touchpad

[Service]
Type=oneshot
ExecStart=/usr/bin/touchpad-off start
ExecStop=/usr/bin/touchpad-off stop
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

Trong tệp cấu hình trên, trường `RemainAfterExit` được đặt là `yes`, cho biết sau khi quá trình thoát, dịch vụ vẫn tiếp tục chạy. Điều này có nghĩa là khi bạn dừng dịch vụ bằng lệnh `systemctl stop`, lệnh được chỉ định bởi trường `ExecStop` sẽ được thực thi, từ đó mở lại touchpad.

#### 8.6.3. Hành vi khởi động lại

Khối [Service] có một số trường xác định hành vi khởi động lại.

> Trường `KillMode`: Xác định cách Systemd dừng dịch vụ sshd.

Trong ví dụ trên, `KillMode` được đặt là `process`, chỉ dừng quá trình chính mà không dừng bất kỳ quá trình con sshd nào, có nghĩa là các phiên SSH mà các quá trình con đã mở vẫn giữ kết nối. Thiết lập này không phổ biến, nhưng quan trọng đối với sshd, nếu không, khi bạn dừng dịch vụ, nó sẽ kết thúc cả phiên SSH mà bạn đã mở.

Trường `KillMode` có thể có các giá trị sau.

- control-group (giá trị mặc định): Tất cả các quá trình con trong nhóm điều khiển hiện tại sẽ bị dừng
- process: Chỉ dừng quá trình chính
- mixed: Quá trình chính sẽ nhận được tín hiệu SIGTERM, các quá trình con sẽ nhận tín hiệu SIGKILL
- none: Không có quá trình nào bị dừng, chỉ thực thi lệnh dừng dịch vụ.

Tiếp theo là trường `Restart`.

> Trường `Restart`: Xác định cách Systemd khởi động lại dịch vụ sau khi sshd kết thúc.

Trong ví dụ trên, `Restart` được đặt là `on-failure`, chỉ khởi động lại sshd khi có bất kỳ lỗi ngoài ý muốn nào xảy ra. Nếu sshd dừng lại một cách bình thường (ví dụ: khi thực thi lệnh `systemctl stop`), nó sẽ không khởi động lại.

Trường `Restart` có thể có các giá trị sau.

- no (giá trị mặc định): Không khởi động lại sau khi kết thúc
- on-success: Chỉ khởi động lại khi kết thúc một cách bình thường (mã trạng thái kết thúc là 0)
- on-failure: Chỉ khởi động lại khi kết thúc không bình thường (mã trạng thái kết thúc không phải là 0), bao gồm bị kết thúc bởi tín hiệu và vượt quá thời gian chờ
- on-abnormal: Chỉ khởi động lại khi bị kết thúc bởi tín hiệu và vượt quá thời gian chờ
- on-abort: Chỉ khởi động lại khi bị kết thúc bởi tín hiệu không được bắt được
- on-watchdog: Chỉ khởi động lại khi vượt quá thời gian chờ
- always: Luôn luôn khởi động lại bất kể lý do kết thúc là gì

Đối với các tiến trình bảo vệ, khuyến nghị đặt `Restart` là `on-failure`. Đối với các dịch vụ cho phép kết thúc với lỗi, có thể đặt `Restart` là `on-abnormal`.

Cuối cùng là trường `RestartSec`.

> Trường `RestartSec`: Xác định số giây mà Systemd cần chờ trước khi khởi động lại dịch vụ. Trong ví dụ trên, nó được đặt là 42 giây.

### 8.7. Khối [Install]

Khối [Install] xác định cách cài đặt tệp cấu hình này, tức là cách để khởi động cùng với hệ thống.

Trường `WantedBy`: Xác định Target mà dịch vụ này thuộc về.

Target có ý nghĩa là một nhóm dịch vụ, đại diện cho một nhóm dịch vụ. `WantedBy=multi-user.target` có nghĩa là dịch vụ sshd thuộc về Target `multi-user.target`.

Thiết lập này rất quan trọng, vì khi chạy lệnh `systemctl enable sshd.service`, một liên kết tượng trưng cho `sshd.service` sẽ được tạo trong thư mục `multi-user.target.wants` trong thư mục `/etc/systemd/system`.

Systemd có Target khởi động mặc định.

```bash
$ systemctl get-default
multi-user.target
```

Kết quả trên cho biết Target khởi động mặc định là `multi-user.target`. Tất cả các dịch vụ trong nhóm này sẽ được khởi động cùng với hệ thống. Đây là lý do tại sao lệnh `systemctl enable` có thể thiết lập khởi động cùng với hệ thống.

Khi sử dụng Target, lệnh `systemctl list-dependencies` và `systemctl isolate` cũng rất hữu ích.

```bash
# Xem tất cả các dịch vụ thuộc multi-user.target
$ systemctl list-dependencies multi-user.target

# Chuyển sang một Target khác
# shutdown.target là trạng thái tắt máy
$ sudo systemctl isolate shutdown.target
```

Nói chung, có hai Target phổ biến: `multi-user.target`, đại diện cho trạng thái dòng lệnh đa người dùng; và `graphical.target`, đại diện cho trạng thái đồ họa, phụ thuộc vào `multi-user.target`. Tài liệu chính thức có một biểu đồ phụ thuộc Target rất rõ ràng [tại đây](https://www.freedesktop.org/software/systemd/man/bootup.html#System%20Manager%20Bootup).

### 8.8. Tệp cấu hình của Target

Target cũng có tệp cấu hình riêng của nó.

```bash
$ systemctl cat multi-user.target

[Unit]
Description=Multi-User System
Documentation=man:systemd.special(7)
Requires=basic.target
Conflicts=rescue.service rescue.target
After=basic.target rescue.service rescue.target
AllowIsolate=yes
```

Chú ý rằng tệp cấu hình của Target không có lệnh khởi động.

Các trường chính trong kết quả trên có ý nghĩa như sau.

- Trường `Requires`: Yêu cầu cùng chạy với `basic.target`.
- Trường `Conflicts`: Trường xung đột. Nếu `rescue.service` hoặc `rescue.target` đang chạy, `multi-user.target` sẽ không thể chạy và ngược lại.
- Trường `After`: Đại diện cho `multi-user.target` sẽ khởi động sau `basic.target`, `rescue.service`, `rescue.target` nếu chúng đã được khởi động.
- Trường `AllowIsolate`: Cho phép sử dụng lệnh `systemctl isolate` để chuyển sang `multi-user.target`.

### 8.9. Khởi động lại sau khi sửa đổi tệp cấu hình

Sau khi sửa đổi tệp cấu hình, bạn cần tải lại tệp cấu hình và khởi động lại dịch vụ liên quan.

```bash
# Tải lại tệp cấu hình
$ sudo systemctl daemon-reload

# Khởi động lại dịch vụ liên quan
$ sudo systemctl restart foobar
```
