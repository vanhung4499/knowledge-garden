---
title: Go Channel Ops
tags:
  - golang
  - interview
categories:
  - golang
  - interview
date created: 2023-10-04
date modified: 2023-10-04
---

# Go Channel: Operations

Tóm tắt kết quả của các hoạt động trên channel:

| Hoạt động | Channel nil | Channel đã đóng | Channel không nil, chưa đóng |
| --- | --- | --- | --- |
| close | panic | panic | Đóng bình thường |
| Đọc <- ch | Bị chặn | Đọc giá trị zero value tương ứng | Bị chặn hoặc đọc dữ liệu bình thường. Bị chặn nếu channel không có dữ liệu trong trường hợp channel có bộ đệm hoặc không có người gửi trong trường hợp channel không có bộ đệm. |
| Ghi ch <- | Bị chặn | panic | Bị chặn hoặc ghi dữ liệu bình thường. Bị chặn nếu channel không có người nhận trong trường hợp channel không có bộ đệm hoặc bộ đệm của channel đầy trong trường hợp channel có bộ đệm. |

Tóm tắt, có ba trường hợp gây ra panic: ghi vào một channel đã đóng, đóng một channel nil, đóng lại một channel đã đóng.

Đọc hoặc ghi vào một channel nil sẽ bị chặn.
