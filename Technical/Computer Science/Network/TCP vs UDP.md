---
categories: 
title: TCP vs UDP
date created: 2023-05-26
date modified: 2023-07-10
tags: [network, computer-science]
---

## Điểm chung

- Đều sử dụng PORT
- Dùng checksum để kiểm tra lỗi dữ liệu

## Khác biệt

|                     | **TCP**                                     | **UDP**                                     |
| ------------------- | ------------------------------------------- | ------------------------------------------- |
| **Kiểu kết nối**    | Dịch vụ hướng kết nối (connection oriented) | Dịc vụ không kết nối (conection less)       |
| **Chuyển mạch gói** | Phương pháp đường ảo                        | Phương pháp datagram                        |
| **Thứ tự gói**      | Đảm bảo thứ tự                              | Thứ tự giao hàng có thể thay đổi            |
| **Vận chuyển**      | Đảm bảo nhận được gói (ACK)                 | Không đảm bảo nhận được gói                 |
| **Truyền lại**      | Truyền lại nếu mất gói                      | Không truyền lại vì không xác định được mất gói|
| **Cách giao tiếp**  | 1:1 Point-to-Point                          | 1:1 / 1:N / N:N Unicast/Multicast/Broadcast |
| **Dộ tin cậy**      | Đáng tin cậy                                | Không đáng tin cậy                          |
| **Tốc độ**          | Chậm                                        | Nhanh                                       |
