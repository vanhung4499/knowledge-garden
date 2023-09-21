---
title: Go Interface Polymorphism
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-21
date modified: 2023-09-21
---

# Go Interface: Polymorphism

Ngôn ngữ Go không thiết kế các khái niệm như hàm ảo, hàm thuần ảo, kế thừa, đa kế thừa, nhưng thông qua giao diện, nó đã một cách tinh tế hỗ trợ các tính chất hướng đối tượng.

Đa hình là một hành vi trong thời gian chạy, nó có các đặc điểm sau:

> 1. Một kiểu có khả năng có nhiều kiểu khác nhau.
> 2. Cho phép các đối tượng khác nhau phản ứng linh hoạt với cùng một thông điệp.
> 3. Xử lý các đối tượng theo cách chung chung.
> 4. Ngôn ngữ không động phải triển khai thông qua kế thừa và giao diện.

Hãy xem một ví dụ về mã nguồn thể hiện tính đa hình:

```go
package main

import "fmt"

func main() {
	qcrao := Student{age: 18}
	whatJob(&qcrao)

	growUp(&qcrao)
	fmt.Println(qcrao)

	stefno := Programmer{age: 100}
	whatJob(stefno)

	growUp(stefno)
	fmt.Println(stefno)
}

func whatJob(p Person) {
	p.job()
}

func growUp(p Person) {
	p.growUp()
}

type Person interface {
	job()
	growUp()
}

type Student struct {
	age int
}

func (p Student) job() {
	fmt.Println("I am a student.")
	return
}

func (p *Student) growUp() {
	p.age += 1
	return
}

type Programmer struct {
	age int
}

func (p Programmer) job() {
	fmt.Println("I am a programmer.")
	return
}

func (p Programmer) growUp() {
	// Lập trình viên già nhanh quá ^_^
	p.age += 10
	return
}
```

Trong mã nguồn này, trước tiên chúng ta định nghĩa một giao diện `Person`, bao gồm hai phương thức:

```go
job()
growUp()
```

Sau đó, chúng ta định nghĩa hai cấu trúc `Student` và `Programmer`, đồng thời, kiểu `*Student` và `Programmer` triển khai hai phương thức được định nghĩa trong giao diện `Person`. Lưu ý rằng kiểu `*Student` triển khai giao diện, trong khi kiểu `Student` không triển khai.

Tiếp theo, chúng ta định nghĩa hai hàm với tham số là giao diện `Person`:

```go
func whatJob(p Person)
func growUp(p Person)
```

Trong hàm `main`, chúng ta tạo đối tượng `Student` và `Programmer`, sau đó chúng ta truyền chúng vào hàm `whatJob` và `growUp`. Trong các hàm này, chúng ta gọi trực tiếp các phương thức của giao diện, khi thực thi, nó sẽ xem xét loại thực thể cuối cùng được truyền vào là gì và gọi phương thức được triển khai bởi loại thực thể đó. Như vậy, các đối tượng khác nhau phản ứng với cùng một thông điệp, đa hình được thực hiện.

Để rõ hơn, trong hàm `whatJob()` hoặc `growUp()`, giao diện `person` được gắn với kiểu thực thể `*Student` hoặc `Programmer`. Dựa trên mã nguồn `iface`, nó sẽ gọi trực tiếp hàm được lưu trữ trong mảng `fun`, tương tự như `s.tab->fun[0]`. Vì mảng `fun` lưu trữ các hàm được triển khai bởi kiểu thực thể, khi chuyển đối tượng khác nhau, thực tế là gọi các triển khai hàm khác nhau, từ đó thực hiện đa hình.

Chạy mã nguồn:

```shell
I am a student.
{19}
I am a programmer.
{100}
```
