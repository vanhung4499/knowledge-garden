---
title: Go Map Element Address
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-21
date modified: 2023-09-21
---

# Go: Map Element Address

Không thể lấy địa chỉ của key hoặc value trong map. Đoạn mã sau không thể biên dịch thành công:

```go
package main

import "fmt"

func main() {
	m := make(map[string]int)

	fmt.Println(&m["qcrao"])
}
```

Lỗi biên dịch được báo như sau:

```shell
./main.go:8:14: cannot take the address of m["qcrao"]
```

Nếu ta sử dụng các phương pháp hack khác như `unsafe.Pointer` để lấy địa chỉ của key hoặc value, thì cũng không thể giữ địa chỉ đó trong thời gian dài, vì khi map mở rộng, vị trí của key và value sẽ thay đổi và địa chỉ đã lưu trữ trước đó sẽ không còn hợp lệ nữa.
