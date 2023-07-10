---
categories: [golang, quick-golang]
title: Map and Struct
date created: 2023-03-31
date modified: 2023-07-10
tags: [golang, quick-golang]
---

## Map

**Map** là một cấu trúc dữ liệu dạng key-value được sử dụng rất phổ biến, được biểu thị bằng bản đồ từ khóa như từ điển, trong Go cú pháp của nó là `map[K]V`. `K` và `V` lần lượt key và value, trong đó khóa phải hỗ trợ toán tử đẳng thức, chẳng hạn như số, chuỗi, v.v.

### Tạo map

Có hai cách để tạo map, cách thứ nhất là sử dụng trực tiếp cú pháp khai báo; cách thứ hai là sử dụng các hàm `make`.

Cách viết trực tiếp:

```go
var m = map[string]int{"a": 1, "b": 2}
fmt.Println(m) // map[a:1 b:2]
```

Tạo bằng hàm `make`:

```go
m1 := make(map[string]int)
fmt.Println(m1)
```

Bạn cũng có thể khởi tạo độ dài của map. Khi đã biết độ dài của map, việc chỉ định trực tiếp độ dài có thể cải thiện hiệu quả thực thi của chương trình.

```go
m2 := make(map[string]int, 10)
fmt.Println(m2)
```

Giá trị mặc định của map là `nil`, và một lỗi sẽ được thông báo khi gán một giá trị cho một khoá trong một `nil` map.

```go
var m3 map[string]int
fmt.Println(m3 == nil, len(m3) == 0) // true true

// m3["a"] = 1
// fmt.Println(m3) // error: assignment to entry in nil map
```

### Sử dụng map

**Thêm phần tử:**

```go
m["c"] = 3
m["d"] = 4
fmt.Println(m) // map[a:1 b:2 c:3 d:4]
```

**Lấy value theo key:**

```go
fmt.Println(m["a"], m["d"]) // 1 4
fmt.Println(m["k"]) // 0
```

Ngay cả khi key không tồn tại, không có lỗi nào được báo cáo. Thay vào đó, giá trị mặc định của kiểu dữ liệu tương ứng được trả về.

**Xoá phần tử**

```go
delete(m, "c")
delete(m, "f") // key không tồn tại, không báo lỗi
fmt.Println(m) // map[a:1 b:2 d:4]
```

**Lấy chiều dài:**

```go
fmt.Println(len(m)) // 3
```

**Kiểm tra xem key có tồn tại không:**

```go
if value, ok := m["d"]; ok {
	fmt.Println(value) // 4
}
```

**Duyệt map:**

```go
for k, v := range m {
	fmt.Println(k, v)
}
```

### Loại tham chiếu

Map là một kiểu tham chiếu, vì vậy khi nó được truyền vào hàm bằng tham chiếu, nó sẽ không tạo bản sao của map, tương tự như các slice và rất hiệu quả.

```go
package main 

import "fmt"

func main() {
	...  
	// Chỉnh sửa map
	modify(m)
	fmt.Println("main: ", m)
	// main: map[a:1 b:2 d:4 e:10]

}

func modify(a map[string]int) {
	a["e"] = 10
	fmt.Println("modify: ", a)
	// modify: map[a:1 b:2 d:4 e:10]
}
```

## Struct

**Struct** là một kiểu tổng hợp (như array) chứa 0 hoặc nhiều biến được đặt tên thuộc bất kỳ kiểu dữ liệu nào và mỗi biến được gọi là trường (field).

### Tạo struct

Đầu tiên sử dụng `type` để định nghĩa một struct `user` có hai field là: `name` và `age`.

```go
type user struct {
	name string
	age int
}
```

Có hai cách để khởi tạo một struct:

Đầu tiên là gán giá trị lần lượt theo thứ tự khai báo các field, ở đây cần lưu ý là thứ tự các field phải nhất quán chặt chẽ.

```go
u1 := user{"hung4499", 24}
fmt.Println(u1) // {hung4499 24}
```

Nhược điểm của điều này là rõ ràng, nếu field thay đổi theo cách này, thì tất cả các phần liên quan đến việc khởi tạo struct này phải được thay đổi tương ứng.

Do đó, nên sử dụng phương pháp thứ hai để khởi tạo theo tên trường.

```go
u := user{
	name: "hung4499",
	age: 24,
}
fmt.Println(u) // {hung4499 24}
```

Các field chưa khởi tạo được gán giá trị mặc định của kiểu tương ứng.

### Sử dụng struct

Sử dụng ký hiệu dấu chấm `.` để truy cập và gán các field.

```go
fmt.Println(u.name, u.age) // hung4499 24
u.name = "kirito4499"
fmt.Println(u.name, u.age) // kirito4499 24
```

Nếu các field của struct có thể so sánh được thì cấu trúc đó cũng có thể so sánh được.

```go
u2 := user{
	age: 24,
	name: "hung4499",
}
fmt.Println(u1 == u) // false
fmt.Println(u1 == u2) // true
```

### Struct lồng nhau

Bây giờ chúng ta đã định nghĩa một struct `user`, giả sử chúng ta định nghĩa thêm hai struct `admin` và `leader`, như sau:

```go
type admin struct {
	name string
	age int
	isAdmin bool
}

type leader struct {
	name string
	age int
	isLeader bool
}
```

Sau đó, vấn đề xảy ra, có hai field `name` và `age` được xác định lặp đi lặp lại nhiều lần.

Sự lười biếng là một đặc điểm đối với các lập trình viên. Có cách nào để sử dụng lại hai lĩnh vực này? Câu trả lời là struct lồng nhau.

Sau khi tối ưu hóa bằng các struct lồng nhau, nó sẽ như thế này:

```go
type admin struct {
	u user
	isAdmin bool
}

type leader struct {
	u user
	isLeader bool
}
```

Code trông clean hơn nhiều.

### Field ẩn danh

Nhưng điều này vẫn chưa hoàn hảo và vẫn còn một chút rắc rối khi truy cập các biến thành viên của struct lồng nhau.

```go
a := admin{
	u: u,
	isAdmin: true,
}
fmt.Println(a) // {{kirito4499 24} true}

a.u.name = "hung4499"
fmt.Println(a.u.name) // hung4499
fmt.Println(a.u.age) // 24
fmt.Println(a.isAdmin) // true
```

Tại thời điểm này, các field ẩn danh cần xuất hiện trên sân khấu, không chỉ định tên, chỉ định kiểu dữ liệu.

```go
type admin1 struct {
	user
	isAdmin bool
}
```

Theo cách này, các biến trung gian có thể được bỏ qua và các field mà chúng ta cần có thể được truy cập trực tiếp.

```go
a1 := admin1{
	user: u,
	isAdmin: true,
}
a1.age = 20
a1.isAdmin = false

fmt.Println(a1) // {{kirito4499 20} false}
fmt.Println(a1.name) // kirito4499
fmt.Println(a1.age) // 20
fmt.Println(a1.isAdmin) // false
```
