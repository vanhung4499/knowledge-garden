---
title: Go Map Thread Safety
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-21
date modified: 2023-09-21
---

# Go: Map Thread Safety

Map không an toàn đối với luồng (thread-safe).

Trong quá trình tìm kiếm, gán, lặp qua và xóa, map sẽ kiểm tra cờ ghi (write flag). Nếu cờ ghi được đặt (bằng 1), nó sẽ gây ra panic ngay lập tức. Các hàm gán và xóa sẽ đặt cờ ghi trước khi kiểm tra và sau đó thực hiện các thao tác tiếp theo.

Kiểm tra cờ ghi:

```go
if h.flags&hashWriting == 0 {
	throw("concurrent map writes")
}
```

Đặt cờ ghi:

```go
h.flags |= hashWriting
```
