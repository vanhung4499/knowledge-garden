---
categories: [golang, quick-golang]
date created: 2023-03-28
date modified: 2023-07-20
title: Variables and declaration
tags: [golang, quick-golang]
---

## Variable

 Biến trong Golang thường đặt theo phong cách "short name" (vd x, y) và "cammel case" và case-sensitive (phân biệt chữ hoa chữ thường )

Nó phải bắt đầu bằng một chữ cái hoặc dấu gạch dưới và chữ cái đầu tiên là chữ hoa hay chữ thường đều có ý nghĩa đặc biệt. Chữ in hoa có thể trích dẫn bên ngoài package, chữ thường chỉ sử dụng bên trong package, điều này sẽ tiếp tục được chia sẻ trong các bài viết sau.

### Statement

Đầu tiên sử dụng từ khóa `var` để khai báo các biến:

```go
var name type = expression
```

Trái ngược với C và các ngôn ngữ phong cách như C (C++, C#, Java), kiểu đứng sau tên biến. Lúc mới chuyển qua Go, tôi đã không quen với điều này.

Kiểu dữ liệu (type) và biểu thức (expression) có thể bỏ qua một, nhưng không thể bỏ qua cả hai. Nếu kiểu dữ liệu bị bỏ qua, kiểu dữ liệu được xác định bởi biểu thức khởi tạo; nếu biểu thức bị bỏ qua, giá trị khởi tạo là giá trị `0` của loại tương ứng.

Tức là `0` cho kiểu số, `false` cho boolean, `""` cho chuỗi , `nil` cho interface và reference (slice, pointer, map, channel, function) và đối với các loại hỗn hợp như array hoặc structure thì tất cả các phần tử hoặc thành viên của nó đều bằng 0 ứng với kiểu dữ liệu.

```go
// Nếu không có giá trị ban đầu, giá trị mặc định bằng 0 sẽ được gán 
var v1 int  
var v2 string  
var v3 bool  
var v4 [10]int // arrat
var v5 []int   // slice  
var v6 struct {  
    e int  
}  
var v7 *int           // pointer  
var v8 map[string]int // map，key kiểu string value kiểu int 
var v9 func(e int) int  
fmt.Println(v1, v2, v3, v4, v5, v6, v7, v8, v9)  
  
// Kết quả  
// 0  false [0 0 0 0 0 0 0 0 0 0] [] {0} <nil> map[] <nil>
```

Vì vậy, không có biến chưa được khởi tạo trong Go.

Khai báo một biến duy nhất:

```go
var a = "initial"  
fmt.Println(a)  
  
var d = true  
fmt.Println(d)
```

Khai báo nhiều biến cùng lúc:

```go
var b, c int = 1, 2  
fmt.Println(b, c)
```

Nên khai báo nhiều biến cùng lúc theo nhóm:

```go
var (  
    b1, c1 int  
    b2, c2 = 3, 4  
)  
fmt.Println(b1, c1)  
fmt.Println(b2, c2)
```

Cách thứ hai là khai báo biến ngắn (short variable declaration):

```go
name := expression
```

Khai báo với `:=` trình biên dịch Go sẽ tự động suy ra kiểu dữ liệu của biến. Lưu ý  sự khác biệt giữa **:=** và **=**, **:=** là khai báo và gán, **=** chỉ là phép gán.

Cách khởi tạo này rất tiện lợi và thường được sử dụng khi khai báo, khởi tạo biến cục bộ.

Ví dụ:

```go
f := "short"
fmt.Println(f)
```

nhiều biến:

```go
g, h := 5, "hung"
fmt.Println(g, h)
```

Một điều lưu ý là khi khai báo nhiều biến thì phải có ít nhất một biến mới, nếu không sẽ báo lỗi.

```go
var i int
// i := 100 // Error: no new variables on left side of :=
i, j := 100, 101 // Biến j mới, không gây lỗi
fmt.Println(i, j)
```

Cách thứ ba sử dụng hàm `new` :

```go
p := new(T)
```

Khởi tạo giá trị mặc định của `T` và trả về địa chỉ của nó.

Trước tiên tôi sẽ nói về cách lấy địa chỉ của biến, nó thực sự rất đơn giản, chỉ cần `&` (giống C và C++).

Khai báo một biến kiểu số nguyên rồi lấy địa chỉ của nó:

```go
// Pointer  
k := 6  
l := &k         // l là con trỏ số nguyên，trỏ tới k  
fmt.Println(*l) // Xuất ra 6  
*l = 7
fmt.Println(k)  // Xuất ra 7
```

Khai báo biến sử dụng hàm `new` :

```go
var p = new(int)
fmt.Println(*p) // Giá trị mặc định của số nguyên: 0
*p = 8
fmt.Println(*p) // Xuất ra 8
```

Hãy cùng xem một ví dụ khác, hai hàm sau là tương đương nhau, chỉ khác là khai báo `new` dùng ít biến trung gian hơn.

```go
func newInt() *int {  
    return new(int)  
}  
  
func newInt1() *int {  
    var p int  
    return &p  
}
```

### Assignment

Dùng **=** để gán:

Ví dụ:

```go
var m, n int
m = 9
n = 10
fmt.Println(m, n)
```

Phép gán nhiều biến:

```go
var m, n int
m = 9
n = 10
m, n = n, m // swap, multiple assignment
fmt.Println(m, n)
```

Tính năng này giống Python thực sự rất hữu ích, bạn thử nghĩ xem, bạn không thể làm điều này bằng ngôn ngữ C. Để đạt được hiệu quả tương tự, bạn phải sử dụng một biến trung gian.

Nếu có những biến không cần thiết thì sử dụng định danh rỗng `_` ( Blank Identifier) để bỏ qua, trong ngôn ngữ Go nếu một biến được khai báo nhưng không được sử dụng thì chương trình sẽ báo lỗi.

```go
// Blank Identifier 
r := [5]int{1, 2, 3, 4, 5}
for _, v := range r {  
    // fmt.Println(i, v)  
    // fmt.Println(v)   // Không dùng i thì sẽ báo lỗi: i declared but not used  
    fmt.Println(v) // Bỏ qua index  
}
```

### [[Scope]]

Phạm vi biến (scope) được chia thành toàn cục (global) và cục bộ (local), và biến cục bộ sẽ ghi đè lên biến toàn cục:

```go
// global variable
var gg = "global" 

func main() {
	// local variable
	fmt.Println(gg) // xuất ra biến global
	gg = "local"
	fmt.Println(gg) // xuất ra biến local
}
```

Khi sử dụng các câu lệnh điều khiển luồng (flow control statement), cần đặc biệt chú ý đến phạm vi của các biến:

```go
// Phạm vi trong câu lệnh điều liện
if f, err := os.Open("./00_hello.go"); err != nil {  
    fmt.Println(err)  
}  
f.Close()
// Eror: f.Close undefined (type string has no field or method Close)
```

Cách viết đúng:

```go
file, err := os.Open("00_hello.go")  
if err != nil {  
    fmt.Println(err)  
}  
file.Close()
```

## Constant

Một hằng đại diện cho một giá trị không đổi trong quá trình thực thi chương trình.

### [[Statement]]

Sử dụng từ khóa `const` để khai báo, và cú pháp tương tự như biến. Không sử dụng `:=` để khai báo hằng!

Nói chung, khi đặt tên cho một hằng số, nên đặt một cái tên có ý nghĩa rõ ràng.

```go
const Pi float64 = 3.14159265358979323846
```

Khai báo một hằng đơn:

```go
// Khai báo hằng và gán giá trị
const n = 500000000
// Sử dụng một biểu thức có thể tính giá trị ở giai đoạn biên dịch và gán giá trị
const d = 3e20 / n
fmt.Println(d)
// Float constant
const zero = 0.0
```

Khai báo nhiều hằng

```go
// Khai báo hằng và gán giá trị
const a, b, c = 3, 4, "foo"  
fmt.Println(a, b, c)  
  
// Nhiều hằng số
const (  
    size int64 = 1024  
    eof        = -1
)  
fmt.Println(size, eof)
```

### iota

Việc khai báo hằng cũng có thể sử dụng trình tạo hằng **iota**, hàm này không hiển thị giá trị của hằng mà bắt đầu từ 0 và thêm từng mục 1 vào.

```go
// Bắt đầu từ 0, mỗi lần tăng 1 
const (  
    a0 = iota // 0  
    a1 = iota // 1  
    a2 = iota // 2  
)  
fmt.Println(a0, a1, a2)  
  
// Viết tắt, biểu thức giống nhau, có thể bỏ qua cái sau  
const (  
    b0 = iota // 0  
    b1        // 1  
    b2        // 2  
)  
fmt.Println(b0, b1, b2)  
  
const (  
    b         = iota      // 0  
    c float32 = iota * 10 // 10  
    d         = iota      // 2  
)  
fmt.Println(b, c, d)
```

Đặt `iota` lại về 0 ở đầu `const`.

```go
// iota được đặt lại về 0 ở đầu mỗi const 
const x = iota // 0  
fmt.Println(x)  
  
// Như trên  
const y = iota // 0  
fmt.Println(y)
```

Nó cũng có thể được sử dụng như một kiểu liệt kê, chẳng hạn như 7 ngày trong tuần, mỗi ngày được biểu thị bằng một con số, thì bạn có thể khai báo như sau:

```go
const (  
    Sunday    = iota // 0  
    Monday           // 1  
    Tuesday          // 2  
    Wednesday        // 3  
    Thursday         // 4  
    Friday           // 5  
    Saturday         // 6  
)  
fmt.Println(Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday)
```
