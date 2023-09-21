---
title: Go Interface iface and eface
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-21
date modified: 2023-09-21
---

# Go Interface: iface and eface

`iface` và `eface` là hai cấu trúc dữ liệu cơ bản trong Go để mô tả các giao diện. Sự khác biệt giữa chúng là `iface` mô tả giao diện chứa các phương thức, trong khi `eface` là một giao diện trống không chứa bất kỳ phương thức nào: `interface{}`.

Xem mã nguồn:

```go
type iface struct {
	tab  *itab
	data unsafe.Pointer
}

type itab struct {
	inter  *interfacetype
	_type  *_type
	link   *itab
	hash   uint32 // sao chép của _type.hash. Được sử dụng cho các câu lệnh switch kiểu.
	bad    bool   // kiểu không triển khai giao diện
	inhash bool   // đã thêm itab này vào hash chưa?
	unused [2]byte
	fun    [1]uintptr // kích thước có thể thay đổi
}
```

`iface` duy trì hai con trỏ bên trong, `tab` trỏ đến một thực thể `itab`, nó đại diện cho kiểu của giao diện và kiểu thực thể được gán cho giao diện này. `data` trỏ đến giá trị cụ thể của giao diện, thường là một con trỏ đến bộ nhớ heap.

Hãy xem kỹ cấu trúc `itab`: Trường `_type` mô tả kiểu thực thể, bao gồm cách căn chỉnh bộ nhớ, kích thước, v.v. Trường `inter` mô tả kiểu giao diện. Trường `fun` chứa địa chỉ của các phương thức tương ứng với kiểu dữ liệu cụ thể, thực hiện việc phân phối động của phương thức gọi giao diện. Thông thường, bảng này sẽ được cập nhật mỗi khi gán một giá trị cho giao diện hoặc lấy bảng itab từ bộ nhớ cache.

Ở đây chỉ liệt kê các phương thức liên quan đến kiểu thực thể và giao diện, các phương thức khác của kiểu thực thể không xuất hiện ở đây. Nếu bạn đã học qua C++, bạn có thể so sánh với khái niệm hàm ảo.

Ngoài ra, bạn có thể thấy lạ, tại sao mảng `fun` có kích thước là 1, nếu giao diện có nhiều phương thức thì sao? Thực tế, đây là địa chỉ của phương thức đầu tiên, nếu có nhiều phương thức, chúng sẽ được lưu trữ trong không gian bộ nhớ sau đó. Từ góc nhìn của hợp ngữ, bạn có thể truy cập các con trỏ hàm này bằng cách tăng địa chỉ, không có ảnh hưởng gì. Lưu ý rằng các phương thức này được sắp xếp theo thứ tự từ điển của tên hàm.

Hãy xem tổng quan cấu trúc `iface` trong sơ đồ sau:

![interface0.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/interface0.png)

Tiếp theo, hãy xem mã nguồn của `eface`:

```go
type eface struct {
    _type *_type
    data  unsafe.Pointer
}
```

So với `iface`, `eface` đơn giản hơn. Nó chỉ duy trì một trường `_type`, đại diện cho kiểu thực thể mà giao diện trống này chứa. `data` mô tả giá trị cụ thể.

![interface1.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/interface1.png)

Chúng ta hãy xem một ví dụ:

```go
package main

import "fmt"

func main() {
	x := 200
	var any interface{} = x
	fmt.Println(any)

	g := Gopher{"Go"}
	var c coder = g
	fmt.Println(c)
}

type coder interface {
	code()
	debug()
}

type Gopher struct {
	language string
}

func (p Gopher) code() {
	fmt.Printf("I am coding %s language\n", p.language)
}

func (p Gopher) debug() {
	fmt.Printf("I am debuging %s language\n", p.language)
}
```

Chạy lệnh sau để in ra hợp ngữ:

```shell
go tool compile -S ./src/main.go
```

Chúng ta có thể thấy rằng hai hàm được gọi trong hàm `main`:

```shell
func convT2E64(t *_type, elem unsafe.Pointer) (e eface)
func convT2I(tab *itab, elem unsafe.Pointer) (i iface)
```

Các tham số của hai hàm này có thể liên quan đến các trường của cấu trúc `iface` và `eface`: cả hai hàm "tạo" các tham số để tạo thành giao diện cuối cùng.

Như một bổ sung, hãy xem cấu trúc `_type`:

```go
type _type struct {
    // Kích thước của kiểu dữ liệu
	size       uintptr
    ptrdata    uintptr
    // Giá trị hash của kiểu dữ liệu
    hash       uint32
    // Cờ của kiểu dữ liệu, liên quan đến phản chiếu
    tflag      tflag
    // Căn chỉnh bộ nhớ liên quan
    align      uint8
    fieldalign uint8
    // Loại kiểu, ví dụ như bool, slice, struct, v.v.
	kind       uint8
	alg        *typeAlg
	// Liên quan đến GC
	gcdata    *byte
	str       nameOff
	ptrToThis typeOff
}
```

Các loại dữ liệu khác nhau trong Go được quản lý dựa trên trường `_type`, với các trường bổ sung để quản lý:

```go
type arraytype struct {
	typ   _type
	elem  *_type
	slice *_type
	len   uintptr
}

type chantype struct {
	typ  _type
	elem *_type
	dir  uintptr
}

type slicetype struct {
	typ  _type
	elem *_type
}

type structtype struct {
	typ     _type
	pkgPath name
	fields  []structfield
}
```

Các định nghĩa cấu trúc này của các loại dữ liệu là cơ sở cho việc triển khai phản chiếu (reflect).
