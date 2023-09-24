---
title: Go Scheduler When
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-22
date modified: 2023-09-22
---

# Khi nào xảy ra lập lịch groutine?

Trong bốn trường hợp, goroutine có thể được lập lịch, nhưng không nhất thiết phải lập lịch, chỉ là Go scheduler có cơ hội để lập lịch.

| Trường hợp                                              | Giải thích                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sử dụng từ khóa `go`                                    | Khi sử dụng từ khóa `go` để tạo một goroutine mới, Go scheduler sẽ xem xét lập lịch                                                                                                                                                                                        |
| GC (Thu gom rác)                                        | Vì goroutine thực hiện GC cũng cần chạy trên M, nên việc lập lịch sẽ xảy ra. Ngoài ra, Go scheduler cũng thực hiện nhiều lập lịch khác, ví dụ: lập lịch goroutine không liên quan đến truy cập heap. GC chỉ thu gom bộ nhớ trên heap, không quan tâm đến bộ nhớ trên stack |
| System call (Gọi hệ thống)                              | Khi goroutine thực hiện một system call, nó sẽ chặn M, vì vậy lập lịch sẽ xảy ra và một goroutine mới sẽ được lập lịch để thực thi                                                                                                                                         |
| Memory synchronization access (Truy cập đồng bộ bộ nhớ) | Các hoạt động atomic, mutex, channel và các hoạt động tương tự có thể làm goroutine bị chặn, do đó lập lịch sẽ xảy ra. Khi điều kiện đạt được (ví dụ: một goroutine khác mở khóa), goroutine sẽ được lập lịch để tiếp tục thực thi                                         |
