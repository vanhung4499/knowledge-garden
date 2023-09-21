---
title: Go Map Delete On Range
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-21
date modified: 2023-09-21
---

# Go: Map Delete on Range

Map không phải là một cấu trúc dữ liệu an toàn đối với luồng (thread-safe). Đọc và ghi cùng một map đồng thời là hành vi không xác định, nếu được phát hiện, nó sẽ gây ra panic.

Trên đây đã nói về trường hợp nhiều goroutine cùng đọc và ghi vào cùng một map. Nếu trong cùng một goroutine, ta xóa key trong khi đang lặp qua map, không có sự kiểm tra đồng thời đọc và ghi, lý thuyết là có thể làm như vậy. Tuy nhiên, kết quả của việc lặp qua map có thể không giống nhau, có thể kết quả lặp qua bao gồm các key đã bị xóa, hoặc không bao gồm, điều này phụ thuộc vào thời gian xóa key: trước hoặc sau khi lặp qua bucket chứa key đó.

Nhìn chung, điều này có thể được giải quyết bằng cách sử dụng khóa đọc và ghi (read-write lock): `sync.RWMutex`.

Trước khi đọc, gọi hàm `RLock()` để khóa đọc, sau khi đọc xong, gọi hàm `RUnlock()` để mở khóa. Trước khi ghi, gọi hàm `Lock()` để khóa ghi, sau khi ghi xong, gọi hàm `Unlock()` để mở khóa.

Ngoài ra, ta có thể sử dụng `sync.Map`, đây là một map an toàn đối với luồng (thread-safe) và có thể được sử dụng.
