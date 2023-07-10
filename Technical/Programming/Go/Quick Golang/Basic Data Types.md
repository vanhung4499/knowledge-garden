---
categories: [golang]
title: Basic Data Types
date created: 2023-03-28
date modified: 2023-07-10
tags: [golang]
---

Các kiểu dữ liệu của Go được chia thành bốn loại chính:

Các kiểu dữ liệu của Go được chia thành bốn loại chính:

1. **Basic Type:** number, string và boolean
2. **Aggregate type:** array và struct.
3. **Reference type:**  pointer, slice, map, func và channel.
4. **Interface type:**  interface.

Trong số đó, các loại cơ bản (basic type) được chia thành:

1. **Các kiểu số nguyên:** int8, uint8, byte, int16, uint16, int32, uint32, int64, uint64, int, uint, uintptr.
2. **Kiểu dấu phẩy động:** float32, float64.
3. **Các loại phức hợp:** phức64, phức128.
4. **Boolean:** bool.
5. **Xâu, chuỗi:** string.
6. **Định danh** rune.

## Integer

Có 12 loại số nguyên, được chia thành số nguyên có dấu và số nguyên không dấu, để tiện theo dõi, xem bảng sau đây:

Kiểu | Độ lớn（byte） | Phạm vi
---|---|---
int8 | 1 | -128 ~ 127
uint8 | 1 | 0~255
byte | 1 | 0~255
int16 | 2 | -32768~32767
uint16 | 2 | 0~65535
int32 | 4 | -2147483648~2147483647
uint32 | 4 | 0~4294967295
int64 | 8 | -9223372036854775808~9223372036854775807
uint64 | 8 | 0~18446744073709551615
int | 4/8 | như trên
uint | 4/8 | như trên
uintptr | 4/8 | như trên，uint đủ để lưu trữ một pointer

Nói chung, khi tôi code, tôi thường chỉ sử dụng **int** và **uint** và chỉ sử dụng kiểu **int8** trừ khi có nhu cầu rõ ràng về độ dài.

### Type Conversion

Cho dù đó là phép toán số học hay phép toán logic, Go yêu cầu kiểu dữ liệu của các toán hạng phải giống nhau, nếu không sẽ báo lỗi.

```go
var a int = 10  
var b int32 = 20  
  
fmt.Println(a + b)
// Error invalid operation: a + b (mismatched types int and int32)
```

Khi viết code, công cụ phát triển sẽ nhắc nhở bạn về điều này và nó cũng sẽ viết mã để chuyển đổi kiểu bắt buộc, điều này thật tuyệt.

```go
var a int = 10  
var b int32 = 20  
fmt.Println(a + int(b)) // Xuất ra 30
```

Nhưng một điều cần lưu ý là khi chuyển đổi kiểu dấu chấm động thành kiểu số nguyên, có thể xảy ra hiện tượng mất độ chính xác.

```go
var c float32 = 10.23
fmt.Println(int(c)) // Xuất ra 10
```

### Numerical [[Operator]]

Các toán tử số học bao gồm: `+`, `-`, `*`, `/`và `%`.

Toán tử `%` modulo chỉ có thể được sử dụng với số nguyên và dấu của phần dư giống với số bị chia.

```go
fmt.Println(5 % 3)   // 2
fmt.Println(-5 % -3) // -2
```

Đối với toán tử `/` chia, nếu cả hai toán hạng đều là số nguyên thì kết quả cũng là số nguyên.

```go
fmt.Println(5 / 3)     // 1
fmt.Println(5.0 / 3.0) // 1.6666666666666667
```

### Comparison [[Operator]]

Các toán tử so sánh bao gồm: `>`, `>=`, `<`, `<=`, ` ==` và `!=`.

Các kiểu dữ liệu khác nhau không thể so sánh được, nhưng số nguyên có thể được so sánh trực tiếp với kí tự.

```go
var i int32  
var j int64  
i, j = 1, 2  
  
// if i == j { // Error invalid operation: i == j (mismatched types int32 and int64)  
//     fmt.Println("i and j are equal.")  
// }  
if i == 1 || j == 2 {  
    fmt.Println("equal.")  
}
```

### Bit [[Operator]]

Toán tử bitwise bao gồm : `&`, `|`, `^`, `&` ,`^` và `<<`,`>>` (giống như C/C++/Java)

Tôi sẽ không giới thiệu quá nhiều về điều này và nó hiếm khi được sử dụng trong quy trình phát triển thông thường.

## Floating point number

Có hai kiểu dấu chấm động, cụ thể là **float32** và **float64**.

Các chữ số dấu chấm động được tự động suy ra là **float64**.

```go
f := 10.0   // Kiểu float64
```

Khi thực hiện các thao tác so sánh trên các số dấu chấm động, tổng không thể được sử dụng ` == ` trực tiếp ` != ` và kết quả sẽ không ổn định. Thư viện tiêu chuẩn toán học nên được sử dụng để thay thế.

## Complex Number

Có hai loại số phức là **complex64** và **complex128**.

Có 3 hàm tích hợp để thao tác với các số phức, đó là:

1. `complex`: Tạo số phức.
2. `real`: Lấy phần thực của một số phức.
3. `imag`: Lấy phần ảo của một số phức.

```go
var x complex64 = 3 + 5i  
var y complex128 = complex(3.5, 10)  

fmt.Println(real(x), imag(x)) // 3 5  
fmt.Println(real(y), imag(y)) // 3.5 10
```

## Boolean

Từ khóa của kiểu Boolean là bool, có hai giá trị: true và false.

```go
ok := truefmt.Println(ok)
```

Boolean và số nguyên không thể chuyển đổi cho nhau.

```go
var e bool
e = bool(1)    // Error: cannot convert 1 (type untyped int) to type bool
```

Phần điều kiện của câu lệnh `if` và `for` phải là một giá trị hoặc biểu thức Boolean. Nếu bạn đã từng viết code Python trước đây thì phải chú ý điểm này, tôi từng đi vào vết xe đổ này.

```go
m := 1
// if m { // Error non-bool m (type int) used as if condition
//     fmt.Println("is true")
// }
if m == 1 {
	fmt.Println("m is 1")
}
```

## String

Từ khóa kiểu string là **string**, đây cũng là một kiểu nguyên thủy.

String có thể được khởi tạo trực tiếp thông qua chuỗi:

```go
s1 := "hello"  
s2 := "world"
```

Sử dụng `` ` `` để xác định các chuỗi thô chưa thoát hỗ trợ các dòng mới:

```go
s := `row1\r\n
row2`
fmt.Println(s)
//row1\r\n
//row2
```

Nối chuỗi

```go
s3 := s1 + s2
fmt.Println(s3)
```

Lấy độ dài chuỗi:

```go
fmt.Println(len(s3))
```

Lấy các ký tự theo chỉ số:

```go
fmt.Println(s3[4])
```

Chuỗi con:

```go
fmt.Println(s3[2:4])
fmt.Println(s3[:4])
fmt.Println(s3[2:])  
fmt.Println(s3[:])
```

Chuỗi là bất biến nên nếu bạn thay đổi trị cho chuỗi thì sẽ báo lỗi:

```go
s3[0] = "H"    // cannot assign to s3[0] (strings are immutable)
```

Duyệt chuỗi:

```go
s4 := "gâu"

// Duyệt chuỗi mảng byte
for i := 0; i < len(s4); i++ {
	fmt.Println(i, s4[i])
}

// Kết quả:  
// 0 103
// 1 195
// 2 162
// 3 117
  
// Duyệt chuỗi dùng range 
for i, v := range s4 {
	fmt.Println(i, v)
}
  
// Kết quả:  
// 0 103
// 1 226
// 3 117
```

Sự khác biệt giữa hai có thể được nhìn thấy từ các kết quả, đầu tiên là duyệt qua mảng byte; thứ hai là duyệt qua ký tự Unicode.

Lặp qua các mảng byte, kiểu ký tự là byte và độ dài là 1. Mặc dù độ dài của chuỗi là 3 về mặt trực quan, nhưng các ký tự tiếng VIỆT chiếm 2 ký tự trong mã hóa UTF-8, vì vậy tổng độ dài là 4.

Duyệt trong Unicode, kiểu ký tự là **rune**.

Hai kiểu ký tự được hỗ trợ trong Go, một là **byte**, định danh của **uint8**, đại diện cho giá trị của một byte đơn của chuỗi UTF-8; loại còn lại là **rune**, định danh của **int32**, đại diện cho một ký tự Unicode đơn.

Cuối cùng, một điểm nữa, các tệp nguồn của Go được mã hóa bằng UTF-8, vì vậy chúng ta phải chọn UTF-8 trong định dạng mã hóa, nếu không có thể xảy ra một số lỗi không thể giải thích được.
