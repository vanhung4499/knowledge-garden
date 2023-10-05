---
title: Go Unsafe Len
tags: 
categories: 
date created: 2023-10-05
date modified: 2023-10-05
---

# Cách sử dụng unsfae để lấy độ dài của slice và map

## Lấy độ dài của slice

Từ bài viết trước về slice, chúng ta đã biết cấu trúc của slice header:

```go
// runtime/slice.go
type slice struct {
    array unsafe.Pointer // con trỏ tới các phần tử
    len   int            // độ dài
    cap   int            // dung lượng
}
```

Khi tạo một slice bằng cách gọi hàm make, thực tế là gọi hàm makeslice, nó trả về một slice:

```go
func makeslice(et *_type, len, cap int) slice
```

Vì vậy, chúng ta có thể chuyển đổi giữa unsafe.Pointer và uintptr để lấy các giá trị của slice.

```go
func main() {
	s := make([]int, 9, 20)
	var Len = *(*int)(unsafe.Pointer(uintptr(unsafe.Pointer(&s)) + uintptr(8)))
	fmt.Println(Len, len(s)) // 9 9

	var Cap = *(*int)(unsafe.Pointer(uintptr(unsafe.Pointer(&s)) + uintptr(16)))
	fmt.Println(Cap, cap(s)) // 20 20
}
```

Quá trình chuyển đổi Len và cap như sau:

```go
Len: &s => con trỏ => uintptr => con trỏ => *int => int
Cap: &s => con trỏ => uintptr => con trỏ => *int => int
```

## Lấy độ dài của map

Tiếp tục xem lại map từ bài viết trước:

```go
type hmap struct {
	count     int
	flags     uint8
	B         uint8
	noverflow uint16
	hash0     uint32

	buckets    unsafe.Pointer
	oldbuckets unsafe.Pointer
	nevacuate  uintptr

	extra *mapextra
}
```

Khác với slice, hàm makemap trả về con trỏ của hmap, chú ý rằng đây là con trỏ:

```go
func makemap(t *maptype, hint int64, h *hmap, bucket unsafe.Pointer) *hmap
```

Chúng ta vẫn có thể chuyển đổi giữa unsafe.Pointer và uintptr để lấy các giá trị của hmap, chỉ khác là count trở thành con trỏ cấp hai:

```go
func main() {
	mp := make(map[string]int)
	mp["qcrao"] = 100
	mp["stefno"] = 18

	count := **(**int)(unsafe.Pointer(&mp))
	fmt.Println(count, len(mp)) // 2 2
}
```

Quá trình chuyển đổi count như sau:

```go
&mp => con trỏ => **int => int
```
