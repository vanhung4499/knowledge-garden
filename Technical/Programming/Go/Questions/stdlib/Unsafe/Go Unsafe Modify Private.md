---
title: Go Unsafe Modify Private
tags:
  - golang
  - interview
categories:
  - golang
  - interview
date created: 2023-10-05
date modified: 2023-10-05
---

# Cách sửa đổi thành viên private bằng unsafe

Đối với một cấu trúc, chúng ta có thể sử dụng hàm offset để lấy được offset của thành viên trong cấu trúc, từ đó có thể lấy địa chỉ của thành viên đó, đọc và ghi vào bộ nhớ tại địa chỉ đó để thay đổi giá trị của thành viên.

Ở đây có một sự thật liên quan đến việc phân bổ bộ nhớ: cấu trúc sẽ được phân bổ một khối bộ nhớ liên tục, địa chỉ của cấu trúc cũng đại diện cho địa chỉ của thành viên đầu tiên.

Chúng ta hãy xem một ví dụ:

```go
package main

import (
	"fmt"
	"unsafe"
)

type Programmer struct {
	name     string
	language string
}

func main() {
	p := Programmer{"stefno", "go"}
	fmt.Println(p)

	name := (*string)(unsafe.Pointer(&p))
	*name = "qcrao"

	lang := (*string)(unsafe.Pointer(uintptr(unsafe.Pointer(&p)) + unsafe.Offsetof(p.language)))
	*lang = "Golang"

	fmt.Println(p)
}
```

Chạy mã, đầu ra là:

```shell
{stefno go}
{qcrao Golang}
```

name là thành viên đầu tiên của cấu trúc, vì vậy chúng ta có thể chuyển đổi &p thành `*string`. Điều này cũng giống như khi chúng ta lấy thành viên count của map, chúng ta đã sử dụng cùng một nguyên tắc.

Đối với thành viên riêng tư của cấu trúc, bây giờ chúng ta có cách để thay đổi giá trị của nó bằng unsafe.Pointer.

Tôi đã nâng cấp cấu trúc Programmer bằng cách thêm một trường:

```go
type Programmer struct {
	name     string
	age      int
	language string
}
```

Và đặt nó trong gói khác, điều này có nghĩa là trong hàm main, tất cả ba trường đều là thành viên riêng tư và không thể thay đổi trực tiếp. Nhưng thông qua hàm unsafe.Sizeof(), chúng ta có thể lấy kích thước của thành viên, từ đó tính toán địa chỉ của thành viên và thay đổi trực tiếp trong bộ nhớ.

```go
func main() {
	p := Programmer{"stefno", 18, "go"}
	fmt.Println(p)

	lang := (*string)(unsafe.Pointer(uintptr(unsafe.Pointer(&p)) + unsafe.Sizeof(int(0)) + unsafe.Sizeof(string(""))))
	*lang = "Golang"

	fmt.Println(p)
}
```

Đầu ra:

```shell
{stefno 18 go}
{stefno 18 Golang}
```
