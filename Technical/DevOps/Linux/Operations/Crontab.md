---
title: Crontab
tags:
  - linux
categories: linux
date created: 2023-09-03
date modified: 2023-09-03
---

# Lệnh crontab - Công việc định kỳ

> Môi trường: CentOS

Bằng lệnh `crontab`, chúng ta có thể thực hiện các lệnh hệ thống hoặc các tập lệnh shell script cụ thể vào các khoảng thời gian cố định. Đơn vị thời gian có thể là phút, giờ, ngày, tháng, tuần và bất kỳ sự kết hợp nào của chúng. Lệnh này rất hữu ích cho các công việc định kỳ như phân tích nhật ký hoặc sao lưu dữ liệu.

## Dịch vụ crond

Linux sử dụng dịch vụ crond để hỗ trợ crontab.

### Kiểm tra dịch vụ `crond`

Sử dụng lệnh `systemctl list-unit-files` để kiểm tra xem dịch vụ `crond` đã được cài đặt chưa.

```shell
$ systemctl list-unit-files | grep crond
crond.service                               enabled
```

Nếu trạng thái là enabled, có nghĩa là dịch vụ đang chạy.

### Lệnh dịch vụ crond

Khởi động dịch vụ crond tự động khi khởi động hệ thống: `chkconfig crond on`

Hoặc, bạn có thể khởi động thủ công bằng các lệnh sau:

```shell
systemctl enable crond.service  # Bật dịch vụ (tự động khởi động dịch vụ khi khởi động hệ thống)
systemctl disable crond.service # Tắt dịch vụ (không tự động khởi động dịch vụ khi khởi động hệ thống)
systemctl start crond.service   # Khởi động dịch vụ
systemctl stop crond.service    # Dừng dịch vụ
systemctl restart crond.service # Khởi động lại dịch vụ
systemctl reload crond.service  # Tải lại cấu hình
systemctl status crond.service  # Xem trạng thái dịch vụ
```

## Lệnh crontab

### Lệnh crontab

Cú pháp lệnh crontab như sau:

```shell
crontab [-u user] file crontab [-u user] [ -e | -l | -r ]
```

Giải thích:

- `-u user`: Để đặt dịch vụ crontab cho một người dùng cụ thể.
- `file`: file là tên tệp lệnh, đại diện cho danh sách công việc crontab và tải chúng vào crontab. Nếu không chỉ định tệp này trong dòng lệnh, lệnh crontab sẽ lấy lệnh từ đầu vào tiêu chuẩn (bàn phím) và tải chúng vào crontab.
- `-e`: Chỉnh sửa nội dung tệp crontab của một người dùng cụ thể. Nếu không chỉ định người dùng, nó sẽ chỉnh sửa tệp crontab của người dùng hiện tại.
- `-l`: Hiển thị nội dung tệp crontab của một người dùng cụ thể. Nếu không chỉ định người dùng, nó sẽ hiển thị nội dung tệp crontab của người dùng hiện tại.
- `-r`: Xóa tệp crontab của một người dùng cụ thể từ thư mục `/var/spool/cron`. Nếu không chỉ định người dùng, nó sẽ xóa tệp crontab của người dùng hiện tại.
- `-i`: Hiển thị thông báo xác nhận khi xóa tệp crontab của người dùng.

Có hai cách để thêm công việc định kỳ:

- Nhập `crontab -e` và thêm công việc tương ứng, sau đó lưu và thoát.
- Chỉnh sửa trực tiếp tệp `/etc/crontab`, tức là `vi /etc/crontab`, và thêm công việc tương ứng.

### Tệp crontab

Các công việc crontab cần thực hiện được lưu trong tệp `/etc/crontab`.

Định dạng tệp crontab như sau:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap20230903104747.png)

#### Các trường chuẩn

**Dấu phẩy** được sử dụng để phân tách danh sách. Ví dụ, trong trường thứ 5 (thứ trong tuần), sử dụng `MON,WED,FRI` để chỉ thứ Hai, thứ Tư và thứ Sáu.

**Dấu gạch ngang** được sử dụng để xác định phạm vi. Ví dụ, `2000-2010` đại diện cho mỗi năm trong khoảng từ năm 2000 đến năm 2010, bao gồm cả năm 2000 và năm 2010.

Ký tự **percent (%)** trong lệnh sẽ được thay thế bằng ký tự xuống dòng, tất cả dữ liệu sau ký tự percent đầu tiên sẽ được gửi như đầu vào tiêu chuẩn cho lệnh.

| Trường         | Bắt buộc | Giá trị cho phép         | Ký tự đặc biệt cho phép |
| :------------- | :------- | :---------------------- | :--------------------- |
| Phút           | Có       | 0–59                    | `*`,`-`                |
| Giờ            | Có       | 0–23                    | `*`,`-`                |
| Ngày trong tháng | Có       | 1–31                    | `*`,`-`                |
| Tháng          | Có       | 1–12 hoặc JAN–DEC       | `*`,`-`                |
| Ngày trong tuần | Có       | 0–6 hoặc SUN–SAT        | `*`,`-`                |

Ví dụ tệp `/etc/crontab`:

```shell
SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=root

# For details see man 4 crontabs

# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * user-name  command to be executed

# Mỗi hai giờ thực hiện tập lệnh /home/hello.sh với quyền root
0 */2 * * * root /home/hello.sh
```

### Ví dụ về crontab

#### Ví dụ 1: Thực hiện myCommand mỗi 1 phút

```shell
* * * * * myCommand
```

#### Ví dụ 2: Thực hiện vào lúc 3 và 15 phút mỗi giờ

```shell
3,15 * * * * myCommand
```

#### Ví dụ 3: Thực hiện từ 8 giờ đến 11 giờ vào lúc 3 và 15 phút

```shell
3,15 8-11 * * * myCommand
```

#### Ví dụ 4: Thực hiện vào lúc 3 và 15 phút mỗi ngày 1, 10 và 22

```shell
3,15 8-11 1,10,22 * * myCommand
```

#### Ví dụ 5: Thực hiện vào lúc 3 và 15 phút vào ngày thứ 2

```shell
3,15 8-11 * * 1 myCommand
```

#### Ví dụ 6: Thực hiện vào lúc 23:30 hàng ngày để khởi động lại smb

```shell
30 23 * * * /etc/init.d/smb restart
```

#### Ví dụ 7: Thực hiện vào lúc 4:45 hàng tháng vào ngày 1, 10 và 22 để khởi động lại smb

```shell
45 4 1,10,22 * * /etc/init.d/smb restart
```

#### Ví dụ 8: Thực hiện vào lúc 1:10 hàng tuần vào thứ 7 và chủ nhật để khởi động lại smb

```shell
10 1 * * 6,0 /etc/init.d/smb restart
```

#### Ví dụ 9: Thực hiện từ 18:00 đến 23:00 hàng ngày mỗi 30 phút để khởi động lại smb

```shell
0,30 18-23 * * * /etc/init.d/smb restart
```

#### Ví dụ 10: Thực hiện vào lúc 23:00 thứ 7 hàng tuần để khởi động lại smb

```shell
0 23 * * 6 /etc/init.d/smb restart
```

#### Ví dụ 11: Thực hiện mỗi giờ để khởi động lại smb

```shell
* */1 * * * /etc/init.d/smb restart
```

#### Ví dụ 12: Thực hiện từ 23:00 đến 7:00 sáng hôm sau, mỗi giờ khởi động lại smb

```shell
0 23-7 * * * /etc/init.d/smb restart
```
