---
categories: [golang, quick-golang]
title: Method
date created: 2023-04-01
date modified: 2023-09-21
tags: [golang, quick-golang]
---

Bài viết này sẽ nói về phương thức, phương thức có thể được coi là một hàm cụ thể, là bước đầu tiên trong lập trình hướng đối tượng Go. Để sử dụng một phương thức tốt, cần có tư tưởng lập trình hướng đối tượng.

## Statement

Việc khai báo một phương thức cũng tương tự như một hàm, điểm khác biệt giữa chúng là: khi một phương thức được định nghĩa, một tham số sẽ được thêm vào giữa `func` và tên phương thức, và tham số này là **receiver**, vì vậy phương thức chúng ta định nghĩa sẽ được liên kết với **receiver** , hay gọi phương thức của **receiver** này.

```go
type Person struct {
	name string
}

func (p Person) String() string {
	return "person name is " + p.name
}
```

Tham số được thêm vào giữa `func` và tên phương thức `(p Person)`  là **receiver**. Bây giờ chúng ta nói rằng kiểu `Person` có một phương thức `String`.

Cách gọi rất đơn giản, chỉ cần sử dụng các biến kiểu và toán tử `.` để gọi.

```go
p := Person{name: "hungnv"}

fmt.Println(p.String()) // person name is hungnv
```

## Value Receiver và Pointer Receiver

Có hai loại receiver trong ngôn ngữ Go: Value Receiver và Pointer Receiver.

Phương thức được xác định bởi value receiver thực sự là một bản sao của receiver khi được gọi, vì vậy mọi thao tác trên giá trị sẽ không ảnh hưởng đến biến ban đầu.

```go
func main() {
	p := Person{name: "hung"}
	// gọi phương thức
	fmt.Println(p.String()) // person name is hung
	
	// chỉnh sửa giá trị
	p.Modify()
	fmt.Println(p.String()) // person name is hung
}

// value receiver
func (p Person) Modify() {
	p.name = "kirito"
}
```

Tiếp theo, chúng ta hãy xem tác dụng của việc sử dụng pointer receiver:

```go
func main() {
	p := Person{name: "hung"}
	// gọi phương thức
	fmt.Println(p.String()) // person name is hung

	// chỉnh sửa giá trị
	p.ModifyP()
	fmt.Println(p.String()) // person name is kirito
}

// pointer receiver
func (p *Person) ModifyP() {
	p.name = "kirito"
}
```

Có thể thấy rằng giá trị ban đầu đã bị thay đổi, điều này thực sự giống như việc truyền tham số hàm.

Bạn có để ý rằng khi chúng ta gọi phương thức có pointer receiver, chúng ta cũng sử dụng biến giá trị chứ không phải con trỏ, thông thường nó sẽ được viết như sau:

```go
(&p).ModifyP()
fmt.Println(p.String())
```

Tương tự, nếu nó là một phương thức nhận giá trị, thì nó cũng có thể gọi được bằng cách sử dụng một con trỏ:

```go
(&p).Modify()
fmt.Println(p.String())
```

Lý do là trình biên dịch tự động dịch cho chúng ta, điều này tạo sự tiện lợi cho các lập trình viện.

## Method Value và Method Expression

Các gọi một phương thức đã được giới thiệu ở trên, sử dụng trực tiếp toán tử `.`, chẳng hạn như: `p.String()`.

Tiếp theo, tôi sẽ giới thiệu hai kiểu gọi:

### Method Value

 Phương thức `p.Add` có thể được gán cho một biến, tương đương với một hàm, liên kết phương thức với receiver. Sau đó, hàm có thể được gọi bằng cách cung cấp tham số chứ không phải bằng cách cung cấp receiver.

```go
type Point struct {
	x, y int
}

func main() {
	// method  variable
	p1 := Point{1, 2}
	q1 := Point{3, 4}
	f := p1.Add
	fmt.Println(f(q1)) // {4 6}
}

func (p Point) Add(q Point) Point {
	return Point{p.x + q.x, p.y + q.y}
}
```

### Method Expression

Một Method Expression được viết là  `T.f` hoặc `(*T).f`, ở đây `T` là kiểu dữ liệu và `f` là một biến hàm.

Bởi vì phương thức gọi phải cung cấp một receiver, phương thức này tương đương với việc thay thế receiver bằng tham số đầu tiên của hàm, vì vậy nó có thể được gọi giống như một hàm.

```go
f1 := Point.Add  
fmt.Println(f1(p1, q1)) // {4 6}
```
