---
categories: [golang, quick-golang]
title: Interface
date created: 2023-04-02
date modified: 2023-07-10
tags: [golang, quick-golang]
---

## Kiểu Interface

Các kiểu dữ liệu được giới thiệu trước đây đều là các kiểu cụ thể, trong khi interface là kiểu trừu tượng, là tập hợp của nhiều khai báo phương thức. Trong Go, chúng ta nói rằng một object triển khai một interface miễn là nó triển khai tất cả các phương thức mà interface yêu cầu.

Trước tiên hãy xem một ví dụ:

```go
package main

import "fmt"

// Định nghĩa interface Duck, bao gồm một phương thức Eat
type Duck interface {
	Eat()
}

// Định nghĩa struct Cat và triển khai phương thức Eat
type Cat struct{}

func (c *Cat) Eat() {
	fmt.Println("cat eat")
}

// Định nghĩa struct Dog và triển khai phương thức Eat
type Dog struct{}

func (d *Dog) Eat() {
	fmt.Println("dog eat")
}

func main() {
	var c Duck = &Cat{}
	c.Eat()

	var d Duck = &Dog{}
	d.Eat()
  
	s := []Duck{
		&Cat{},
		&Dog{},
	}
	for _, n := range s {
		n.Eat()
	}
}
```

Các interface được khai báo bằng từ khóa `type`:

```go
type Duck interface {
	Eat()
}
```

Interface chứa một phương thức `Eat()`, và sau đó định nghĩa hai struct `Cat` và `Dog`, tương ứng triển khai phương thức `Eat`.

```go
// Định nghĩa interface Duck, bao gồm một phương thức Eat
type Duck interface {
	Eat()
}

// Định nghĩa struct Cat và triển khai phương thức Eat
type Cat struct{}

func (c *Cat) Eat() {
	fmt.Println("cat eat")
}  
```

Duyệt qua một slice kiểu interface, bạn có thể gọi trực tiếp phương thức tương ứng thông qua kiểu interface:

```go
s := []Duck{
	&Cat{},
	&Dog{},
}
for _, n := range s {
	n.Eat()
}

// Kết quả:
// cat eat
// dog eat
```

## Gán Interface

Có hai trường hợp gán interface:

1. Gán thể hiện của struct cho interface
2. Gán một interface cho một interface khác

Hãy nói về nó một cách riêng biệt:

### Gán thể hiện của struct cho interface

Vẫn sử dụng ví dụ trên, vì `Cat` triển interface `Eat` nên bạn có thể gán trực tiếp thể hiện của `Cat` cho interface.

```go
var c Duck = &Cat{}
c.Eat()
```

Bạn phải truyền con trỏ struct vào đây, nếu truyền trực tiếp struct sẽ báo lỗi:

```go
var c Duck = Cat{}
c.Eat()
```

```
# command-line-arguments
./interface.go:25:6: cannot use Cat{} (type Cat) as type Duck in assignment:
Cat does not implement Duck (Eat method has pointer receiver)
```

Nhưng còn chiều ngược lại thì sao? Ví dụ: sử dụng struct để triển khai interface và sử dụng con trỏ struct để gán giá trị:

```go
// Định nghĩa struct Cat và triển khai phương thức Eat
type Cat struct{}

func (c Cat) Eat() {
	fmt.Println("cat eat")
}

var c Duck = &Cat{}
c.Eat() // cat eat
```

Không có vấn đề gì, nó có thể được thực thi bình thường.

### Gán một interface cho một interface khác

Vẫn ở ví dụ trên, bạn có thể gán trực tiếp giá trị `c` của `d`:

```go
var c Duck = &Cat{}
c.Eat()

var d Duck = c
d.Eat()
```

Tiếp theo, tôi định nghĩa một interface khác `Duck1`, chứa hai phương thức `Eat` và `Walk`, sau đó struct `Dog` triển khai hai phương thức, nhưng `Cat` chỉ triển khai phương thức `Eat`.

```go

type Duck1 interface {
	Eat()
	Walk()
}

// Định nghĩa struct Dog và triển khai phương thức Eat và Walk
type Dog struct{}

func (d *Dog) Eat() {
	fmt.Println("dog eat")
}

func (d *Dog) Walk() {
	fmt.Println("dog walk")
}

```

Sau đó khi gán giá trị `Duck1` thì `Duck` có thể sử dụng , nếu không sẽ báo lỗi.

```go
var c1 Duck1 = &Dog{}
var c2 Duck = c1
c2.Eat()
```

Do đó, biến interface `c1` đã khởi tạo được gán trực tiếp cho một biến interface `c2` khác và tập phương thức của `c2` bắt buộc phải là tập con của tập phương thức của `c1`.

## Empty Interface

Một interface có 0 phương thức được gọi là interface trống và nó được ký hiệu là `interface {}`. Vì interface trống có 0 phương thức, nên tất cả các kiểu đều triển khai interface trống.

```go
func main() {
	// empty interface
	s1 := "Hello World"
	i := 50

	strt := struct {
		name string
	}{
		name: "AlwaysBeta",
	}

	test(s1)
	test(i)
	test(strt)
}

func test(i interface{}) {
	fmt.Printf("Type = %T, value = %v\n", i, i)
}
```

## Type assertion

Type assertion là một thao tác trên một giá trị interface, cú pháp như sau:

```go
x.(T)
```

Ở đây `x` là một biểu thức kiểu interface và `T` là một kiểu dữ liệu.

Chức năng là đánh giá xem kiểu dữ liệu linh hoạt của toán hạng có thoả mãn kiểu dữ liệu đã chỉ định hay không.

Có hai trường hợp:

1. `T` là kiểu dữ liệu cụ thể
2. `T` là kiểu interface

Dưới đây là một số ví dụ:

### Kiểu dữ liệu cụ thể

Type assertion sẽ kiểm tra `x` xem kiểu động của có phải là `T` không, nếu có thì xuất giá trị của `x`, nếu không thì thông báo `panic`.

```go
func main() {
	var n interface{} = 55
	assert(n) // 55
	
	var n1 interface{} = "hello"
	assert(n1) // panic: interface conversion: interface {} is string, not int
}

func assert(i interface{}) {
	s := i.(int)
	fmt.Println(s)
}
```

### Kiểu interface

Xác nhận kiểu sẽ kiểm tra xem kiểu của `x` có thỏa mãn kiểu interface  `T` hay không, và nếu có thì xuất giá trị của `x`, giá trị này có thể là bản sao của thể hiện liên kết hoặc bản sao của con trỏ; nếu không, chương trình là trực tiếp báo `panic`.

```go
func main() {
	assertInterface(c) // &{}
}

func assertInterface(i interface{}) {
	s := i.(Duck)
	fmt.Println(s)
}

```

Nếu có hai giá trị nhận được, thì assertion sẽ không gặp sự cố khi không thành công, nhưng sẽ trả về một giá trị boolean bổ sung, thường được đặt tên là `ok`, để cho biết liệu assertion có thành công hay không.

```go
func main() {
	var n1 interface{} = "hello"
	assertFlag(n1)
}

func assertFlag(i interface{}) {
	if s, ok := i.(int); ok {
		fmt.Println(s)
	}
}
```

### Type Query

Cú pháp tương tự như type assertion, chỉ cần thay thế trực tiếp `T` bằng từ khóa `type`.

Có hai chức năng chính:

1. Truy vấn kiểu cơ bản của một biến interface
2. Truy vấn xem biến interface này có triển khai các interface khác

```go

func main() {
	SearchType(44) // Int: 44
	SearchType("hung") // String: hung
	SearchType(c) // dog eat
	SearchType(44.99) // Unknown type
}

func SearchType(i interface{}) {
	switch v := i.(type) {
		case string:
			fmt.Printf("String: %s\n", i.(string))
		case int:
			fmt.Printf("Int: %d\n", i.(int))
		case Duck:
			v.Eat()
		default:
			fmt.Printf("Unknown type\n")
	}
}

```
