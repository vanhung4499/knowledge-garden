---
title: Firewalld
tags:
  - linux
categories: linux
date created: 2023-09-03
date modified: 2023-09-03
---

# Firewalld - Dịch vụ tường lửa

## 1. Lệnh dịch vụ firewalld

```shell
systemctl enable firewalld.service  # Bật dịch vụ (tự động khởi động dịch vụ khi khởi động hệ thống)
systemctl disable firewalld.service # Tắt dịch vụ (không tự động khởi động dịch vụ khi khởi động hệ thống)
systemctl start firewalld.service   # Khởi động dịch vụ
systemctl stop firewalld.service    # Dừng dịch vụ
systemctl restart firewalld.service # Khởi động lại dịch vụ
systemctl reload firewalld.service  # Tải lại cấu hình
systemctl status firewalld.service  # Xem trạng thái dịch vụ
```

## 2. Lệnh firewall-cmd

Lệnh `firewall-cmd` được sử dụng để cấu hình tường lửa.

```shell
firewall-cmd --version                    # Xem phiên bản
firewall-cmd --help                       # Xem trợ giúp
firewall-cmd --state                      # Hiển thị trạng thái
firewall-cmd --reload                     # Cập nhật quy tắc tường lửa
firewall-cmd --get-active-zones           # Xem thông tin vùng hoạt động
firewall-cmd --get-zone-of-interface=eth0 # Xem vùng mà giao diện cụ thể thuộc về
firewall-cmd --panic-on                   # Từ chối tất cả các gói tin
firewall-cmd --panic-off                  # Hủy trạng thái từ chối
firewall-cmd --query-panic                # Kiểm tra trạng thái từ chối

firewall-cmd --zone=public --list-ports   # Xem tất cả các cổng mở
firewall-cmd --zone=public --query-port=80/tcp # Kiểm tra xem cổng 80 TCP có được mở không
firewall-cmd --zone=public --add-port=8080/tcp --permanent # Thêm cổng mở (sử dụng --permanent để áp dụng vĩnh viễn, nếu không sẽ mất hiệu lực sau khi khởi động lại)
firewall-cmd --zone=public --remove-port=80/tcp --permanent # Xóa cổng 80 TCP đã mở vĩnh viễn
```
