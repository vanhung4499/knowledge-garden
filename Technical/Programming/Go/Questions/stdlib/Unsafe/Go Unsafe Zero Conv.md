---
title: Go Unsafe Zero Conv
tags:
  - golang
  - interview
categories:
  - golang
  - interview
date created: 2023-10-05
date modified: 2023-10-05
---

# Cách chuyển đổi không sao chép string và slice byte

Đây là một ví dụ cổ điển. Để thực hiện chuyển đổi giữa chuỗi và slice byte mà không cần sao chép dữ liệu, chúng ta cần hiểu cấu trúc dữ liệu dưới cùng của slice và chuỗi:

```go
type StringHeader struct {
	Data uintptr
	Len  int
}

type SliceHeader struct {
	Data uintptr
	Len  int
	Cap  int
}
```

Đây là các cấu trúc dữ liệu trong gói reflect, đường dẫn: `src/reflect/value.go`. Chỉ cần chia sẻ Data và Len dưới cùng là có thể thực hiện chuyển đổi `zero-copy`.

```go
func string2bytes(s string) []byte {
	return *(*[]byte)(unsafe.Pointer(&s))
}

func bytes2string(b []byte) string {
	return *(*string)(unsafe.Pointer(&b))
}
```

Cơ bản là sử dụng ép kiểu con trỏ, code khá đơn giản, không cần giải thích chi tiết.
