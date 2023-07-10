---
categories: [golang, quick-golang]
title: Array and Slice
date created: 2023-03-30
date modified: 2023-07-10
tags: [golang, quick-golang]
---

## Array

Array hay Mảng có hai thuộc tính:

1. Chiều dài cố định
2. Các phần tử cùng loại

Chính vì chiều dài cố định của nó mà nó được sử dụng ít hơn trong quá trình phát triển so với **slice**. Nhưng **array** là cơ sở của slice, sau khi hiểu array, việc học slice sẽ dễ dàng hơn rất nhiều.

### Declaration and Initialization

Khai báo một mảng có độ dài 3 và kiểu phần tử **int**. Các phần tử mảng được truy cập theo chỉ mục, chỉ số nằm trong khoảng từ 0 đến độ dài của mảng trừ 1 và hàm tích hợp `len` có thể lấy độ dài của mảng.

```go
var a [3]int
// Xuất phần tử đầu
fmt.Println(a[0]) // 0
// Xuất độ dài
fmt.Println(len(a)) // 3
```

Giá trị ban đầu của mảng là giá trị mặc định của kiểu phần tử và mảng cũng có thể được khởi tạo bằng một array literal.

```go
// Khởi tạo mảng trực tiếp
var b [3]int = [3]int{1, 2, 3}
var c [3]int = [3]int{1, 2}
fmt.Println(b) // [1 2 3]
fmt.Println(c[2]) // 0
```

Nếu độ dài mảng không được chỉ định rõ ràng, nhưng `…` được sử dụng, thì độ dài mảng được xác định bởi số lượng phần tử thực tế.

```go
d := [...]int{1, 2, 3, 4, 5}
fmt.Printf("%T\n", d) // [5]int
```

Bạn cũng có thể chỉ định vị trí chỉ số để khởi tạo, nếu độ dài mảng không được chỉ định thì độ dài được xác định bởi chỉ số.

```go
e := [4]int{5, 2: 10}
f := [...]int{2, 4: 6}
fmt.Println(e) // [5 0 10 0]
fmt.Println(f) // [2 0 0 0 6]
```

### Multidimensional Array

Việc khai báo và khởi tạo mảng nhiều chiều cũng vậy, ở đây lấy mảng hai chiều làm ví dụ, lưu ý một điều là chỉ cho phép chiều đầu tiên của mảng nhiều chiều dùng `…`

```go
// Khai báo mảng 2 chiều
var g [4][2]int
// Khai báo và khởi tạo mảng 2 chiều
h := [4][2]int{{10, 11}, {20, 21}, {30, 31}, {40, 41}}
// Khai báo và chỉ khởi tạo phần tử 1 và 3
i := [4][2]int{1: {20, 21}, 3: {40, 41}}
// Khai báo và khởi tạo các phần tử riêng lẻ của mảng bên ngoài và bên trong
j := [...][2]int{1: {0: 20}, 3: {1: 41}}
fmt.Println(g, h, i, j)

// [[0 0] [0 0] [0 0] [0 0]]
// [[10 11] [20 21] [30 31] [40 41]]
// [[0 0] [20 21] [0 0] [40 41]]
// [[0 0] [20 0] [0 0] [0 41]]
```

### Sử dụng

Mảng có thể so sánh được miễn là các phần tử của chúng có thể so sánh được và độ dài mảng là một phần của kiểu mảng.

Vì vậy `[3]int` và `[4]int` là hai kiểu khác nhau.

```go
// So sánh mảng
a1 := [2]int{1, 2}
a2 := [...]int{1, 2}
a3 := [2]int{1, 3}

// a4 := [3]int{1, 2}
fmt.Println(a1 == a2, a1 == a3, a2 == a3) // true false false

// fmt.Println(a1 == a4) // invalid operation: a1 == a4 (mismatched types [2]int and [3]int)
```

Duyệt mảng:

```go
for i, n := range e {
	fmt.Println(i, n)
}
```

### Value type

Array trong Go là một kiểu giá trị, không phải là kiểu tham chiếu, việc gán và truyền tham số sẽ sao chép toàn bộ mảng vào một mảng mới (deep copy).

Như có thể thấy từ đầu ra, nội dung giống nhau, nhưng địa chỉ khác nhau.

```go
package main

import "fmt"

func main() {
	// Sao chép mảng
	x := [2]int{10, 20}
	y := x
	fmt.Printf("x: %p, %v\n", &x, x) // x: 0xc00012e020, [10 20]
	fmt.Printf("y: %p, %v\n", &y, y) // y: 0xc00012e030, [10 20]
	test(x)
}

func test(a [2]int) {
	fmt.Printf("a: %p, %v\n", &a, a) // a: 0xc00012e060, [10 20]
}
```

Hãy xem hàm truyền tham số:

```go
package main

import "fmt"

func main() {
	x := [2]int{10, 20}
	// Sửa đổi mảng
	modify(x)
	fmt.Println("main: ", x) // main: [10 20]
}

func modify(a [2]int) {
	a[0] = 30
	fmt.Println("modify: ", a) // modify: [30 20]
}
```

Cũng có thể thấy từ kết quả rằng trong `modify` dữ liệu của mảng giữa được sửa đổi, trong `main` dữ liệu của mảng không thay đổi.

Vì vậy, có thể sửa đổi nó bên trong chức năng và ảnh hưởng đến nó bên ngoài chức năng? Câu trả lời là có, **slice** được nói tiếp theo có thể thực hiện được.

## Slice

Một **slice** là một loại tham chiếu có ba thuộc tính: con trỏ, độ dài và dung lượng.

1. Con trỏ: Trỏ tới phần tử đầu tiên mà slice có thể truy cập.
2. Độ dài: số phần tử trong slice.
3. Dung lượng: số phần tử giữa phần tử bắt đầu của slice và phần tử cuối cùng của mảng tầng dưới.

Bạn có bối rối bởi lời giải thích này? Đừng hoảng sợ, hãy giải thích chi tiết.

Cấu trúc cơ bản của nó như sau:

![Pasted image 20230330235608](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230330235608.png)

Hãy xem một ví dụ khác để xem ý nghĩa của từng phần.

![Pasted image 20230330235731](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230330235731.png)

Mảng tầng dưới là một mảng chứa 10 phần tử số nguyên, data1 trỏ đến phần tử thứ 4 của mảng, độ dài là 3 và dung lượng lấy đến phần tử cuối cùng của mảng là 7. data2 trỏ đến phần tử thứ năm của mảng, độ dài là 4 và dung lượng là 6.

### Create slice

Có hai cách để tạo slice:

Cách đầu tiên dựa trên array:

```go
var array = [...]int{1, 2, 3, 4, 5, 6, 7, 8}

s1 := array[3:6]
s2 := array[:5]
s3 := array[4:]
s4 := array[:]

fmt.Printf("s1: %v\n", s1) // s1: [4 5 6]
fmt.Printf("s2: %v\n", s2) // s2: [1 2 3 4 5]
fmt.Printf("s3: %v\n", s3) // s3: [5 6 7 8]
fmt.Printf("s4: %v\n", s4) // s4: [1 2 3 4 5 6 7 8]
```

Cách thứ hai là sử dụng hàm built-in `make` để tạo:

```go
// Dùng make tạo slice
// len: 10, cap: 10
a := make([]int, 10)
// len: 10, cap: 15
b := make([]int, 10, 15)

fmt.Printf("a: %v, len: %d, cap: %d\n", a, len(a), cap(a))
fmt.Printf("b: %v, len: %d, cap: %d\n", b, len(b), cap(b))
```

### Sử dụng Slice

**Duyệt slice**

```go
for i, n := range s1 {
	fmt.Println(i, n)
}
```

**So sánh**

Bạn không thể sử dụng ` == ` để kiểm tra xem slice có cùng thành phần hay không, nhưng các slice có thể được so sánh với con số không. Giá trị mặc định của kiểu slice là 0, cho biết rằng không có mảng tầng dưới tương ứng, đồng thời độ dài và dung lượng đều bằng 0.

Nhưng cũng lưu ý rằng nếu cả chiều dài và dung lượng đều bằng không nhưng giá trị của chúng không nhất thiết phải bằng không.

```go
var s []int
fmt.Println(len(s) == 0, s == nil) // true true
s = nil
fmt.Println(len(s) == 0, s == nil) // true true
s = []int(nil)
fmt.Println(len(s) == 0, s == nil) // true true
s = []int{}
fmt.Println(len(s) == 0, s == nil) // true false
```

Do đó, để đánh giá xem slice có trống hay không, hãy sử dụng hàm `len` thay vì so sánh xem nó có trống hay không.

**Thêm phần tử**

Sử dụng hàm `append`.

```Go
// Thêm phần tử
s5 := append(s4, 9)
fmt.Printf("s5: %v\n", s5)
// s5: [1 2 3 4 5 6 7 8 9]
s6 := append(s4, 10, 11)
fmt.Printf("s6: %v\n", s6)
// s5: [1 2 3 4 5 6 7 8 10 11]
```

Để nối thêm một slice khác, bạn cần thêm sau slice khác dấu ba chấm.

```Go
// Nối slice khác
s7 := []int{12, 13}
s7 = append(s7, s6...)
fmt.Printf("s7: %v\n", s7)
// s7: [12 13 1 2 3 4 5 6 7 8 10 11]
```

**Sao chép**

Sử dụng hàm `copy`。

```Go

// Copy
s8 := []int{1, 2, 3, 4, 5}
s9 := []int{5, 4, 3}
s10 := []int{6}

copy(s8, s9)
fmt.Printf("s8: %v\n", s8) // s8: [5 4 3 4 5]
copy(s10, s9)
fmt.Printf("s10: %v\n", s10) // s10: [5]

```

### Reference type

Như đã nói ở trên khi giới thiệu về mảng, mảng là kiểu giá trị nên toàn bộ nội dung mảng sẽ bị sao chép khi truyền tham số, nếu mảng lớn sẽ ảnh hưởng rất nhiều đến hiệu năng. Việc truyền một slice chỉ sao chép slice đó (chỉ là một tham chiếu), điều này rất hiệu quả.

```Go
package main

import "fmt"

func main() {
	s9 := []int{5, 4, 3}
	// Truyền tham số
	modify(s9)
	fmt.Println("main: ", s9) // main: [30 4 3]
}

func modify(a []int) {
	a[0] = 30
	fmt.Println("modify: ", a) // modify: [30 4 3]
}
```

Các giá trị được sửa đổi trong `modify` sẽ được ảnh hưởng luôn tới `main`.
