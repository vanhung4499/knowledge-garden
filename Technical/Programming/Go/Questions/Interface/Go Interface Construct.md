---
title: Go Interface Construct
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-21
date modified: 2023-09-21
---

# Go Interface: Constrcut

Chúng ta đã xem qua mã nguồn của `iface` và `eface` và hiểu rằng `iface` quan trọng nhất là `itab` và `_type`.

Để tìm hiểu rõ hơn về cách xây dựng giao diện, tiếp theo tôi sẽ sử dụng vũ khí của hợp ngữ để khám phá sự thật đằng sau.

Hãy xem một ví dụ mã nguồn:

```go
package main

import "fmt"

type Person interface {
	growUp()
}

type Student struct {
	age int
}

func (p Student) growUp() {
	p.age += 1
	return
}

func main() {
	var qcrao = Person(Student{age: 18})

	fmt.Println(qcrao)
}
```

Chạy lệnh:

```shell
go tool compile -S main.go
```

Ta được mã hợp ngữ của hàm main như sau:

```asm
0x0000 00000 (./src/main.go:30) TEXT    "".main(SB), $80-0
0x0000 00000 (./src/main.go:30) MOVQ    (TLS), CX
0x0009 00009 (./src/main.go:30) CMPQ    SP, 16(CX)
0x000d 00013 (./src/main.go:30) JLS     157
0x0013 00019 (./src/main.go:30) SUBQ    $80, SP
0x0017 00023 (./src/main.go:30) MOVQ    BP, 72(SP)
0x001c 00028 (./src/main.go:30) LEAQ    72(SP), BP
0x0021 00033 (./src/main.go:30) FUNCDATA$0, gclocals·69c1753bd5f81501d95132d08af04464(SB)
0x0021 00033 (./src/main.go:30) FUNCDATA$1, gclocals·e226d4ae4a7cad8835311c6a4683c14f(SB)
0x0021 00033 (./src/main.go:31) MOVQ    $18, ""..autotmp_1+48(SP)
0x002a 00042 (./src/main.go:31) LEAQ    go.itab."".Student,"".Person(SB), AX
0x0031 00049 (./src/main.go:31) MOVQ    AX, (SP)
0x0035 00053 (./src/main.go:31) LEAQ    ""..autotmp_1+48(SP), AX
0x003a 00058 (./src/main.go:31) MOVQ    AX, 8(SP)
0x003f 00063 (./src/main.go:31) PCDATA  $0, $0
0x003f 00063 (./src/main.go:31) CALL    runtime.convT2I64(SB)
0x0044 00068 (./src/main.go:31) MOVQ    24(SP), AX
0x0049 00073 (./src/main.go:31) MOVQ    16(SP), CX
0x004e 00078 (./src/main.go:33) TESTQ   CX, CX
0x0051 00081 (./src/main.go:33) JEQ     87
0x0053 00083 (./src/main.go:33) MOVQ    8(CX), CX
0x0057 00087 (./src/main.go:33) MOVQ    $0, ""..autotmp_2+56(SP)
0x0060 00096 (./src/main.go:33) MOVQ    $0, ""..autotmp_2+64(SP)
0x0069 00105 (./src/main.go:33) MOVQ    CX, ""..autotmp_2+56(SP)
0x006e 00110 (./src/main.go:33) MOVQ    AX, ""..autotmp_2+64(SP)
0x0073 00115 (./src/main.go:33) LEAQ    ""..autotmp_2+56(SP), AX
0x0078 00120 (./src/main.go:33) MOVQ    AX, (SP)
0x007c 00124 (./src/main.go:33) MOVQ    $1, 8(SP)
0x0085 00133 (./src/main.go:33) MOVQ    $1, 16(SP)
0x008e 00142 (./src/main.go:33) PCDATA  $0, $1
0x008e 00142 (./src/main.go:33) CALL    fmt.Println(SB)
0x0093 00147 (./src/main.go:34) MOVQ    72(SP), BP
0x0098 00152 (./src/main.go:34) ADDQ    $80, SP
0x009c 00156 (./src/main.go:34) RET
0x009d 00157 (./src/main.go:34) NOP
0x009d 00157 (./src/main.go:30) PCDATA  $0, $-1
0x009d 00157 (./src/main.go:30) CALL    runtime.morestack_noctxt(SB)
0x00a2 00162 (./src/main.go:30) JMP     0
```

Chúng ta bắt đầu từ dòng 10, nếu không hiểu các dòng mã hợp ngữ trước đó, bạn có thể quay lại xem hai bài viết trước trên tài khoản công khai, ở đây tôi sẽ bỏ qua.

|Dòng mã hợp ngữ|Mô tả|
|---|---|
|10-14|Xây dựng các tham số cho cuộc gọi `runtime.convT2I64(SB)`|

Chúng ta hãy xem hàm này có dạng tham số như thế nào:

```go
func convT2I64(tab *itab, elem unsafe.Pointer) (i iface) {
	// ……
}
```

`convT2I64` sẽ xây dựng một `interface`, cụ thể là giao diện `Person` của chúng ta.

Tham số đầu tiên được đặt tại vị trí `(SP)`, ở đây nó được gán địa chỉ của `go.itab."".Student,"".Person(SB)`.

Chúng ta tìm thấy nó trong mã hợp ngữ được tạo ra:

```asm
go.itab."".Student,"".Person SNOPTRDATA dupok size=40
        0x0000 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  
        0x0010 00 00 00 00 00 00 00 00 da 9f 20 d4              
        rel 0+8 t=1 type."".Person+0
        rel 8+8 t=1 type."".Student+0
```

Kích thước của nó là 40 byte, để nhớ lại:

```go
type itab struct {
	inter  *interfacetype // 8 byte
	_type  *_type // 8 byte
	link   *itab // 8 byte
	hash   uint32 // 4 byte
	bad    bool   // 1 byte
	inhash bool   // 1 byte
	unused [2]byte // 2 byte
	fun    [1]uintptr // kích thước có thể thay đổi // 8 byte
}
```

Tổng cộng các trường kích thước lại, kích thước của cấu trúc `itab` là 40 byte. Chuỗi số trên thực tế là nội dung đã được tuần tự hóa của `itab`, lưu ý rằng hầu hết các số là 0, từ 24 byte trở đi, 4 byte `da 9f 20 d4` thực tế là giá trị `hash` của `itab`, được sử dụng để kiểm tra xem hai kiểu có giống nhau không.

Hai dòng tiếp theo là các chỉ thị liên kết, đơn giản là kết hợp tất cả các tệp nguồn lại với nhau, gán một vị trí toàn cầu cho mỗi biểu tượng. Ý nghĩa ở đây cũng khá rõ ràng: 8 byte đầu tiên cuối cùng lưu trữ địa chỉ của `type."".Person`, tương ứng với trường `inter` trong `itab`, đại diện cho kiểu giao diện; 8-16 byte cuối cùng cuối cùng lưu trữ địa chỉ của `type."".Student`, tương ứng với trường `_type` trong `itab`, đại diện cho kiểu cụ thể.

Tham số thứ hai đơn giản hơn, nó là địa chỉ của số `18`, điều này cũng được sử dụng khi khởi tạo cấu trúc `Student`.

|Dòng mã hợp ngữ|Hoạt động|
|---|---|
|15|Gọi `runtime.convT2I64(SB)`|  

Chúng ta sẽ xem đoạn mã sau:

```go
func convT2I64(tab *itab, elem unsafe.Pointer) (i iface) {
	t := tab._type
	
	//...
	
	var x unsafe.Pointer
	if *(*uint64)(elem) == 0 {
		x = unsafe.Pointer(&zeroVal[0])
	} else {
		x = mallocgc(8, t, false)
		*(*uint64)(x) = *(*uint64)(elem)
	}
	i.tab = tab
	i.data = x
	return
}
```

Đoạn mã này khá đơn giản, nó gán `tab` cho trường `tab` của `iface`; phần `data` được cấp phát một khối bộ nhớ trên heap, sau đó sao chép giá trị `18` từ `elem` vào đó. Như vậy, `iface` đã được xây dựng.

|Dòng mã hợp ngữ|Mô tả|
|---|---|
|17|Gán `i.tab` cho `CX`|
|18|Gán `i.data` cho `AX`|
|19-21|Kiểm tra xem `i.tab` có phải là nil hay không, nếu không phải, di chuyển `CX` 8 byte, tức là gán trường `_type` của `itab` cho `CX`, đây là kiểu cụ thể của giao diện, cuối cùng sẽ được sử dụng làm đối số cho hàm `fmt.Println`|

Sau đó, là cuộc gọi hàm `fmt.Println` và công việc chuẩn bị tham số trước đó, không cần nói thêm.

Như vậy, chúng ta đã hoàn thành quá trình xây dựng một `interface`.

【Mở rộng 1】  
Làm thế nào để in ra giá trị `hash` của kiểu giao diện?

Ở đây, tôi tham khảo một bài viết được dịch bởi Cao Đại Thần, bạn có thể tham khảo trong tài liệu tham khảo. Cách làm cụ thể như sau:

```go
type iface struct {
	tab  *itab
	data unsafe.Pointer
}
type itab struct {
	inter uintptr
	_type uintptr
	link uintptr
	hash  uint32
	_     [4]byte
	fun   [1]uintptr
}

func main() {
	var qcrao = Person(Student{age: 18})

	iface := (*iface)(unsafe.Pointer(&qcrao))
	fmt.Printf("iface.tab.hash = %#x\n", iface.tab.hash)
}
```

Chúng ta đã định nghĩa một phiên bản "giả mạo" của `iface` và `itab`, tôi gọi nó là "giả mạo" vì một số cấu trúc dữ liệu quan trọng trong `itab` đã không được mở rộng, ví dụ như `_type`, so sánh với định nghĩa chính thức sẽ thấy điều này, nhưng phiên bản "giả mạo" vẫn hoạt động, vì `_type` chỉ là một con trỏ.

Trong hàm `main`, trước tiên chúng ta xây dựng một đối tượng giao diện `qcrao`, sau đó chuyển đổi kiểu ép buộc và cuối cùng đọc giá trị `hash`, rất tuyệt vời! Bạn cũng có thể thử làm điều này.

Kết quả chạy:

```shell
iface.tab.hash = 0xd4209fda
```

Đáng lưu ý là khi xây dựng giao diện `qcrao`, ngay cả khi tôi thay đổi giá trị `age` thành giá trị khác, giá trị `hash` vẫn không thay đổi, điều này có thể dự đoán được, giá trị `hash` chỉ phụ thuộc vào các trường và phương thức của nó.
