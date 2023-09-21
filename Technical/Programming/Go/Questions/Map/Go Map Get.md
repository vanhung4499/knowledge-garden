---
title: Go Map Get
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-21
date modified: 2023-09-21
---

# Go: Map Get

Trong ngôn ngữ Go, có hai cú pháp để đọc một map: có dấu phẩy và không có dấu phẩy. Khi key mà ta muốn truy vấn không tồn tại trong map, cú pháp có dấu phẩy sẽ trả về một biến bool để cho biết key có tồn tại trong map hay không; trong khi đó, cú pháp không có dấu phẩy sẽ trả về giá trị zero của kiểu dữ liệu tương ứng với key. Nếu kiểu dữ liệu của value là int, giá trị trả về sẽ là 0; nếu kiểu dữ liệu của value là string, giá trị trả về sẽ là chuỗi rỗng.

```go
package main

import "fmt"

func main() {
	ageMap := make(map[string]int)
	ageMap["qcrao"] = 18

    // Cú pháp không có dấu phẩy
	age1 := ageMap["stefno"]
	fmt.Println(age1)

    // Cú pháp có dấu phẩy
	age2, ok := ageMap["stefno"]
	fmt.Println(age2, ok)
}
```

Kết quả chạy chương trình:

```shell
0
0 false
```

Trước đây, tôi cũng thấy rất kỳ diệu, làm thế nào để thực hiện điều này? Thực tế, điều này được thực hiện bởi trình biên dịch: sau khi phân tích mã nguồn, nó sẽ ánh xạ hai cú pháp này thành hai hàm khác nhau ở mức thấp.

```go
// src/runtime/hashmap.go
func mapaccess1(t *maptype, h *hmap, key unsafe.Pointer) unsafe.Pointer
func mapaccess2(t *maptype, h *hmap, key unsafe.Pointer) (unsafe.Pointer, bool)
```

Trong mã nguồn, tên hàm không quan trọng, chỉ cần thêm hậu tố 1 hoặc 2, hoàn toàn không quan tâm đến cách đặt tên theo quy tắc trong "Code Complete". Từ khai báo hai hàm trên, ta cũng có thể thấy sự khác biệt, hàm `mapaccess2` có một biến bool nữa trong danh sách giá trị trả về, nhưng mã của hai hàm này hoàn toàn giống nhau, chỉ khác nhau ở việc thêm false hoặc true vào cuối danh sách giá trị trả về.

Ngoài ra, dựa trên loại key khác nhau, trình biên dịch cũng sẽ thay thế các hàm tìm kiếm, chèn và xóa bằng các hàm cụ thể hơn để tối ưu hiệu suất:

|Loại key|Tìm kiếm|
|---|---|
|uint32|`mapaccess1_fast32(t *maptype, h *hmap, key uint32) unsafe.Pointer`|
|uint32|`mapaccess2_fast32(t *maptype, h *hmap, key uint32) (unsafe.Pointer, bool)`|
|uint64|`mapaccess1_fast64(t *maptype, h *hmap, key uint64) unsafe.Pointer`|
|uint64|`mapaccess2_fast64(t *maptype, h *hmap, key uint64) (unsafe.Pointer, bool)`|
|string|`mapaccess1_faststr(t *maptype, h *hmap, ky string) unsafe.Pointer`|
|string|`mapaccess2_faststr(t *maptype, h *hmap, ky string) (unsafe.Pointer, bool)`|

Các hàm này có kiểu tham số là uint32, uint64 hoặc string, bởi vì trong hàm, trình biên dịch đã biết trước loại key và bố cục bộ nhớ là rõ ràng, do đó có thể tiết kiệm rất nhiều thao tác và tăng hiệu suất.

Các hàm này được định nghĩa trong tệp `src/runtime/hashmap_fast.go`.
