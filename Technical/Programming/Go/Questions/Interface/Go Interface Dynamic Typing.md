---
title: Go Interface Dynamic Typing
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-21
date modified: 2023-09-21
---

# Go Interface: Dynamic Typing

Từ mã nguồn, chúng ta có thể thấy rằng `iface` bao gồm hai trường: `tab` là con trỏ bảng giao diện, trỏ đến thông tin về kiểu dữ liệu; `data` là con trỏ dữ liệu, trỏ đến dữ liệu cụ thể. Chúng được gọi lần lượt là `kiểu động` và `giá trị động`. Giá trị giao diện bao gồm `kiểu động` và `giá trị động`.

【Mở rộng 1】So sánh kiểu giao diện với `nil`

Giá trị không của giao diện là khi cả `kiểu động` và `giá trị động` đều là `nil`. Chỉ khi cả hai phần này đều là `nil`, giá trị giao diện mới được coi là `giá trị giao diện == nil`.

Xem một ví dụ:

```go
package main

import "fmt"

type Coder interface {
	code()
}

type Gopher struct {
	name string
}

func (g Gopher) code() {
	fmt.Printf("%s is coding\n", g.name)
}

func main() {
	var c Coder
	fmt.Println(c == nil)
	fmt.Printf("c: %T, %v\n", c, c)

	var g *Gopher
	fmt.Println(g == nil)

	c = g
	fmt.Println(c == nil)
	fmt.Printf("c: %T, %v\n", c, c)
}
```

Kết quả:

```shell
true
c: <nil>, <nil>
true
false
c: *main.Gopher, <nil>
```

Ban đầu, `c` có `kiểu động` và `giá trị động` đều là `nil`, `g` cũng là `nil`. Khi gán `g` cho `c`, `kiểu động` của `c` trở thành `*main.Gopher`, mặc dù `giá trị động` của `c` vẫn là `nil`, nhưng khi so sánh `c` với `nil`, kết quả là `false`.

【Mở rộng 2】  
Hãy xem một ví dụ và xem kết quả của nó:

```go
package main

import "fmt"

type MyError struct {}

func (i MyError) Error() string {
	return "MyError"
}

func main() {
	err := Process()
	fmt.Println(err)

	fmt.Println(err == nil)
}

func Process() error {
	var err *MyError = nil
	return err
}
```

Kết quả chạy chương trình:

```shell
<nil>
false
```

Ở đây, chúng ta định nghĩa một cấu trúc `MyError`, triển khai hàm `Error() string`, từ đó triển khai giao diện `error`. Hàm `Process()` trả về một giao diện `error`, trong đó có chứa chuyển đổi kiểu ngầm định. Vì vậy, mặc dù giá trị của nó là `nil`, nhưng kiểu của nó là `*MyError`, khi so sánh với `nil`, kết quả là `false`.

【Mở rộng 3】Làm thế nào để in ra kiểu động và giá trị động của giao diện?

Xem mã nguồn trực tiếp:

```go
package main

import (
	"unsafe"
	"fmt"
)

type iface struct {
	itab, data uintptr
}

func main() {
	var a interface{} = nil

	var b interface{} = (*int)(nil)

	x := 5
	var c interface{} = (*int)(&x)
	
	ia := *(*iface)(unsafe.Pointer(&a))
	ib := *(*iface)(unsafe.Pointer(&b))
	ic := *(*iface)(unsafe.Pointer(&c))

	fmt.Println(ia, ib, ic)

	fmt.Println(*(*int)(unsafe.Pointer(ic.data)))
}
```

Trong mã nguồn, chúng ta trực tiếp định nghĩa một cấu trúc `iface`, sử dụng hai con trỏ để mô tả `itab` và `data`, sau đó ép buộc giải thích nội dung của a, b, c trong bộ nhớ thành `iface` tự định nghĩa. Cuối cùng, chúng ta có thể in ra địa chỉ của kiểu động và giá trị động.

Kết quả chạy chương trình như sau:

```shell
{0 0} {17426912 0} {17426912 842350714568}
5
```

Kiểu động và giá trị động của a đều là 0, tức là nil; Kiểu động của b và c giống nhau, đều là `*int`; Cuối cùng, giá trị động của c là 5.
