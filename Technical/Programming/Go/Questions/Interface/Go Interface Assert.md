---
title: Go Interface Assert
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-21
date modified: 2023-09-21
---

# Go Interface: Assert

Chúng ta biết rằng trong ngôn ngữ Go, không cho phép chuyển đổi kiểu ngầm định, có nghĩa là không cho phép sử dụng biến có kiểu không tương thích ở cả hai bên của dấu `=`.

`Chuyển đổi kiểu` và `khẳng định kiểu` đều là quá trình chuyển đổi một kiểu dữ liệu thành một kiểu dữ liệu khác. Sự khác biệt là, chuyển đổi kiểu là chuyển đổi giữa hai kiểu phải tương thích với nhau. Cú pháp chuyển đổi kiểu là:

><kiểu kết quả> := <kiểu đích> ( <biểu thức> )

```go
package main

import "fmt"

func main() {
	var i int = 9

	var f float64
	f = float64(i)
	fmt.Printf("%T, %v\n", f, f)

	f = 10.8
	a := int(f)
	fmt.Printf("%T, %v\n", a, a)

	// s := []int(i)
}
```

Trong đoạn mã trên, tôi đã định nghĩa một biến kiểu `int` và kiểu `float64`, và thử chuyển đổi giữa chúng, kết quả là thành công: kiểu `int` và kiểu `float64` tương thích với nhau.

Nếu tôi bỏ chú thích khỏi dòng cuối cùng của mã, trình biên dịch sẽ báo lỗi kiểu không tương thích:

```shell
cannot convert i (type int) to type []int
```

# Khẳng định kiểu

Như đã đề cập trước đó, giao diện trống `interface{}` không định nghĩa bất kỳ phương thức nào, do đó, tất cả các kiểu trong Go đều triển khai giao diện trống. Khi một tham số hình thức của một hàm là `interface{}`, trong hàm đó, cần khẳng định kiểu tham số hình thức để lấy được kiểu thực sự của nó.

Cú pháp của khẳng định kiểu là:

> <giá trị kiểu đích>, <tham số boolean> := <biểu thức>.( kiểu đích ) // Khẳng định kiểu an toàn  
><giá trị kiểu đích> := <biểu thức>.( kiểu đích ) // Khẳng định kiểu không an toàn

Chuyển đổi kiểu và khẳng định kiểu có một số điểm tương đồng, nhưng khác nhau ở chỗ khẳng định kiểu là thực hiện trên giao diện.

Hãy xem một ví dụ ngắn:

```go
package main

import "fmt"

type Student struct {
	Name string
	Age int
}

func main() {
	var i interface{} = new(Student)
	s := i.(Student)
	
	fmt.Println(s)
}
```

Trong đoạn mã trên, tôi đã định nghĩa một biến `interface{}` và khẳng định kiểu của nó thành `Student`.

Chạy mã:

```shell
panic: interface conversion: interface {} is *main.Student, not main.Student
```

Đoạn mã trên đã gây ra một `panic`, điều này xảy ra vì `i` là kiểu `*Student`, không phải kiểu `Student`, việc khẳng định kiểu thất bại. Trong một môi trường product, không nên để `panic` như vậy, có thể sử dụng cú pháp "khẳng định an toàn":

```go
func main() {
	var i interface{} = new(Student)
	s, ok := i.(Student)
	if ok {
		fmt.Println(s)
	}
}
```

Như vậy, ngay cả khi khẳng định kiểu thất bại, chương trình cũng không sẽ gây ra `panic`.

Khẳng định kiểu thực tế còn có một dạng khác, đó là sử dụng trong câu lệnh `switch` để kiểm tra kiểu của giao diện. Mỗi `case` sẽ được xem xét theo thứ tự. Khi một `case` được khớp, câu lệnh trong `case` đó sẽ được thực thi, vì vậy thứ tự của các `case` là rất quan trọng, vì có thể có nhiều `case` khớp.

Dưới đây là một ví dụ:

```go
func main() {
	//var i interface{} = new(Student)
	//var i interface{} = (*Student)(nil)
	var i interface{}

	fmt.Printf("%p %v\n", &i, i)

	judge(i)
}

func judge(v interface{}) {
	fmt.Printf("%p %v\n", &v, v)

	switch v := v.(type) {
	case nil:
		fmt.Printf("%p %v\n", &v, v)
		fmt.Printf("nil type[%T] %v\n", v, v)

	case Student:
		fmt.Printf("%p %v\n", &v, v)
		fmt.Printf("Student type[%T] %v\n", v, v)

	case *Student:
		fmt.Printf("%p %v\n", &v, v)
		fmt.Printf("*Student type[%T] %v\n", v, v)

	default:
		fmt.Printf("%p %v\n", &v, v)
		fmt.Printf("unknow\n")
	}
}

type Student struct {
	Name string
	Age int
}
```

Trong hàm `main`, có ba dòng khác nhau, hãy chạy từng dòng một, chú thích hai dòng còn lại, và nhận được ba kết quả chạy:

```shell
// --- var i interface{} = new(Student)
0xc4200701b0 [Name: ], [Age: 0]
0xc4200701d0 [Name: ], [Age: 0]
0xc420080020 [Name: ], [Age: 0]
*Student type[*main.Student] [Name: ], [Age: 0]

// --- var i interface{} = (*Student)(nil)
0xc42000e1d0 <nil>
0xc42000e1f0 <nil>
0xc42000c030 <nil>
*Student type[*main.Student] <nil>

// --- var i interface{}
0xc42000e1d0 <nil>
0xc42000e1e0 <nil>
0xc42000e1f0 <nil>
nil type[<nil>] <nil>
```

Đối với dòng lệnh đầu tiên:

```go
var i interface{} = new(Student)
```

`i` là một kiểu `*Student`, khớp với case thứ ba, từ ba địa chỉ in ra, thực tế là ba biến khác nhau. Trong hàm `main` có một biến cục bộ `i`; khi gọi hàm, thực tế là sao chép một bản sao của tham số, do đó trong hàm cũng có một biến `v`, là bản sao của `i`; sau khi khẳng định, lại tạo ra một bản sao mới. Vì vậy, cuối cùng ba biến in ra đều có địa chỉ khác nhau.

Đối với dòng lệnh thứ hai:

```go
var i interface{} = (*Student)(nil)
```

Ở đây, ý muốn chỉ ra là `i` có kiểu động là `(*Student)`, dữ liệu là `nil`, kiểu của nó không phải là `nil`, kết quả so sánh với `nil` cũng là `false`.

Dòng lệnh cuối cùng:

```go
var i interface{}
```

Lần này, `i` mới là kiểu `nil`.

【Mở rộng 1】  
Tham số của hàm `fmt.Println` là `interface{}`. Đối với các kiểu dữ liệu có sẵn, hàm sẽ sử dụng phương pháp liệt kê để xác định kiểu thực tế của chúng, sau đó chuyển đổi thành chuỗi và in ra. Đối với các kiểu dữ liệu tự định nghĩa, trước tiên sẽ xác định xem kiểu đó có triển khai phương thức `String()` hay không. Nếu có, hàm sẽ trực tiếp in ra kết quả của phương thức `String()`. Nếu không, hàm sẽ sử dụng phản chiếu để duyệt qua các thành viên của đối tượng và in ra.

Hãy xem một ví dụ ngắn, rất đơn giản, đừng lo lắng:

```go
package main

import "fmt"

type Student struct {
	Name string
	Age int
}

func main() {
	var s = Student{
		Name: "qcrao",
		Age: 18,
	}

	fmt.Println(s)
}
```

Vì cấu trúc `Student` không triển khai phương thức `String()`, nên `fmt.Println` sẽ duyệt qua các thành viên của đối tượng và in ra:

```shell
{qcrao 18}
```

Thêm một phương thức `String()`:

```go
func (s Student) String() string {
	return fmt.Sprintf("[Name: %s], [Age: %d]", s.Name, s.Age)
}
```

Kết quả in ra:

```shell
[Name: qcrao], [Age: 18]
```

In ra theo phương thức mà chúng ta tự định nghĩa.

【Mở rộng 2】  
Đối với ví dụ trên, nếu thay đổi như sau:

```go
func (s *Student) String() string {
	return fmt.Sprintf("[Name: %s], [Age: %d]", s.Name, s.Age)
}
```

Chú ý rằng hai phương thức có người nhận khác nhau, bây giờ cấu trúc `Student` chỉ có một phương thức `String()` với người nhận là kiểu con trỏ. Kết quả in ra:

```shell
{qcrao 18}
```

Tại sao?

> Kiểu `T` chỉ có phương thức với người nhận là `T`; trong khi kiểu `*T` có phương thức với người nhận là `T` và `*T`. Cú pháp `T` có thể gọi phương thức của `*T` chỉ là một cú pháp đặc biệt của `Go`.

Vì vậy, khi cấu trúc `Student` có phương thức `String()` với người nhận là kiểu giá trị, có thể in ra theo định dạng tùy chỉnh bằng cách sử dụng:

```go
fmt.Println(s)
fmt.Println(&s)
```

Nếu cấu trúc `Student` có phương thức `String()` với người nhận là kiểu con trỏ, chỉ có thể in ra theo định dạng tùy chỉnh bằng cách sử dụng:

```go
fmt.Println(&s)
```
