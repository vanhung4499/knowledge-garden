---
categories: [golang, quick-golang]
title: Function
date created: 2023-03-31
date modified: 2023-07-10
tags: [golang, quick-golang]
---

## Định nghĩa function

Một hàm bao gồm các phần sau: từ khóa `func`, tên hàm, danh sách tham số, danh sách trả về và thân hàm.

```go
func name(param-list) ret-list {
	body
}
```

Một hàm có thể không có tham số và có thể không trả về giá trị.

```go
func funcA() {
	fmt.Println('i am funcA')
}
```

Kiểu của một hàm được gọi là chữ ký hàm (function signature). Khi danh sách tham số và danh sách trả về của hai hàm giống nhau thì kiểu hay chữ kí của hai hàm cũng giống nhau.

```go
func add(x int, y int) int {
	return x + y
}

func sub(x int, y int) (z int) {
	z = x - y
	return
}

fmt.Printf("%T\n", add) // func(int, int) int
fmt.Printf("%T\n", sub) // func(int, int) int
```

## Tham số (parameter)

Nhiều tham số liền kề có kiểu giống nhau có thể rút gọn lại, hàm `add` và `sub` phía trên có thể được viết như sau:

```go
func add(x, y int) int {
	return x + y
} 

func sub(x, y int) (z int) {
	z = x - y
	return
}
```

Các tham số không xác định, sử dụng cú pháp `…type` (giống Javascript). Lưu ý rằng tham số không xác định phải là tham số cuối cùng của hàm.

```go
func funcSum(args ...int) (ret int) {
	for _, arg := range args {
		ret += arg
	}
	return
}

// tham số không xác định
fmt.Println(funcSum(1, 2)) // 3
fmt.Println(funcSum(1, 2, 3)) // 6
```

Bạn cũng có thể sử dụng slice làm tham số, bạn cần sử dụng `…`để mở rộng slice:

```go
// slice làm tham số 
s := []int{1, 2, 3, 4}
fmt.Println(funcSum(s...)) // 10
```

Trên thực tế, sử dụng slice làm tham số chính thức cũng có thể đạt được hiệu quả tương tự, nhưng điểm khác biệt là khi truyền tham số, phải xây dựng một slice và sử dụng không cần `…` sẽ thuận tiện.

```go
func funcSum1(args []int) (ret int) {
	for _, arg := range args {
		ret += arg
	}
	return
}

fmt.Println(funcSum1(s)) // 10
```

## Giá trị trả về (Return Value)

Các hàm có thể trả về một giá trị hoặc nhiều giá trị.

```go
func swap(x, y int) (int, int) {
	return y, x
}

fmt.Println(swap(1, 2)) // 2 1
```

Nếu có một giá trị trả về không mong muốn, hãy sử dụng `_` để bỏ qua nó:

```go
x, _ := swap(1, 2)
fmt.Println(x) // 2
```

Hỗ trợ cho các giá trị trả lại được đặt tên. Nếu bạn sử dụng giá trị trả về có tên, bạn có thể `return` mà không cần tên giá trị trả về.

Ví dụ trước với các tham số không xác định được viết theo cách này:

```go
func funcSum(args ...int) (ret int) {
	for _, arg := range args {
		ret += arg
	}
	return
}
```

Hãy so sánh lại, nếu bạn không sử dụng các giá trị trả về được đặt tên, bạn nên viết như thế nào:

```go

func funcSum(args ...int) int {
	ret := 0
	for _, arg := range args {
		ret += arg
	}
	return ret
}

```

## Hàm ẩn danh (Anonymous function)

Hàm ẩn danh đề cập đến một phương thức thực hiện hàm không cần xác định tên hàm. Nó có thể được gán trực tiếp cho một biến hàm, có thể được sử dụng như một tham số thực tế, cũng có thể được sử dụng như một giá trị trả về và cũng có thể được gọi trực tiếp.

```go
// hàm ẩn danh
sum := func(a, b int) int { return a + b }
fmt.Println(sum(1, 2)) // 3
```

**Sử dụng làm tham số**

```go
// Tham số là hàm
func funcSum2(f func(int, int) int, x, y int) int {
	return f(x, y)
}

fmt.Println(funcSum2(sum, 3, 5)) // 8
```

**Sử dụng dưới dạng giá trị trả về:**

```go
// Trả về một hàm
func wrap(op string) func(int, int) int {
	switch op {
		case "add":
			return func(a, b int) int {
				return a + b
			}
		case "sub":
			return func(a, b int) int {
				return a - b
			}
		default:
			return nil
	}
}

f := wrap("add")
fmt.Println(f(2, 4)) // 6

f := wrap("sub")
fmt.Println(f(2, 4)) // -2
```

**Gọi hàm trực tiếp:**

```go
// Gọi trực tiếp
fmt.Println(func(a, b int) int { return a + b }(4, 5)) // 9
```
