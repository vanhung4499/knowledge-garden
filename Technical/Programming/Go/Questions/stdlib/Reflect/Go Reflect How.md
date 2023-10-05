---
title: Go Reflect How
tags:
  - golang
  - interview
categories:
  - golang
  - interview
date created: 2023-10-05
date modified: 2023-10-05
---

# Cách triển khai của reflect trong Go

`interface` là một công cụ mạnh mẽ trong Go để thực hiện trừu tượng hóa. Khi gán một biến giao diện với một kiểu thực thể, giao diện sẽ lưu trữ thông tin về kiểu của thực thể đó. Reflection được thực hiện thông qua thông tin kiểu của giao diện và được xây dựng dựa trên kiểu.

Trong Go, gói `reflect` định nghĩa các loại và các hàm Reflection khác nhau, cho phép kiểm tra thông tin về kiểu và thay đổi giá trị của kiểu trong quá trình chạy.

# Kiểu và giao diện

Trong Go, mỗi biến có một kiểu tĩnh được xác định trong quá trình biên dịch, ví dụ: `int, float64, []int`, v.v. Lưu ý rằng đây là kiểu khai báo, không phải kiểu dữ liệu cơ bản.

Go blog đã đưa ra ví dụ như sau:

```go
type MyInt int

var i int
var j MyInt
```

Mặc dù kiểu cơ bản của `i` và `j` đều là `int`, nhưng chúng có các kiểu tĩnh khác nhau và không thể xuất hiện cùng nhau ở cả hai phía của dấu bằng, trừ khi có chuyển đổi kiểu. Kiểu tĩnh của `j` là `MyInt`.

Reflection chủ yếu liên quan đến kiểu `interface{}`. Về cấu trúc cơ bản của giao diện, bạn có thể tham khảo nội dung về giao diện trong các phần trước, đây chỉ là một bài tóm tắt.

```go
type iface struct {
	tab  *itab
	data unsafe.Pointer
}

type itab struct {
	inter  *interfacetype
	_type  *_type
	link   *itab
	hash   uint32
	bad    bool
	inhash bool
	unused [2]byte
	fun    [1]uintptr
}
```

Trong đó, `itab` bao gồm kiểu cụ thể `_type` và `interfacetype`. `_type` đại diện cho kiểu cụ thể, trong khi `interfacetype` đại diện cho kiểu giao diện mà kiểu cụ thể triển khai.

![reflect-0.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/reflect-0.png)

Thực tế, `iface` mô tả giao diện không rỗng, nó bao gồm các phương thức; trong khi `eface` mô tả giao diện rỗng, không chứa bất kỳ phương thức nào. Trong Go, tất cả các kiểu đều "triển khai" giao diện rỗng.

```go
type eface struct {
    _type *_type
    data  unsafe.Pointer
}
```

So với `iface`, `eface` đơn giản hơn. Nó chỉ duy trì một trường `_type`, đại diện cho kiểu cụ thể mà giao diện rỗng mang. `data` mô tả giá trị cụ thể.

![reflect-1.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/reflect-1.png)

Tiếp tục với ví dụ từ blog chính thức của Go về Reflection, tôi sẽ giải thích chi tiết bằng hình ảnh. Kết hợp cả hai sẽ giúp hiểu rõ hơn. Nhân tiện, đừng sợ văn bản tiếng Anh, đọc tài liệu gốc tiếng Anh là một bước cần thiết để trở thành chuyên gia kỹ thuật.

Hãy làm rõ một điều: biến giao diện có thể lưu trữ bất kỳ biến nào triển khai tất cả các phương thức được định nghĩa trong giao diện.

Trong Go, hai giao diện phổ biến nhất là `Reader` và `Writer`:

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}
```

Tiếp theo, là các phép chuyển đổi và gán giữa các giao diện:

```go
var r io.Reader
tty, err := os.OpenFile("/Users/qcrao/Desktop/test", os.O_RDWR, 0)
if err != nil {
    return nil, err
}
r = tty
```

Đầu tiên, khai báo kiểu của `r` là `io.Reader`. Lưu ý rằng đây là kiểu tĩnh của `r`, lúc này kiểu động của nó là `nil`, và giá trị động của nó cũng là `nil`.

Sau đó, câu lệnh `r = tty` sẽ thay đổi kiểu động của `r` thành `*os.File`, và giá trị động của nó trở thành một đối tượng tệp đã mở. Lúc này, `r` có thể được biểu diễn bằng cặp `<giá trị, kiểu>`: `<tty, *os.File>`.

![reflect-2.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/reflect-2.png)

Lưu ý trong hình ảnh trên, mặc dù hàm `fun` chỉ trỏ đến một hàm `Read`, thực tế `*os.File` cũng triển khai giao diện `io.Writer`. Do đó, câu lệnh kiểm tra kiểu sau có thể được thực hiện:

```go
var w io.Writer
w = r.(io.Writer)
```

Lý do sử dụng kiểm tra kiểu là vì kiểu tĩnh của `r` là `io.Reader`, không triển khai giao diện `io.Writer`. Khả năng kiểm tra thành công phụ thuộc vào kiểu động của `r` có phù hợp hay không.

Sau đó, `w` cũng có thể được biểu diễn bằng cặp `<giá trị, kiểu>`: `<tty, *os.File>`. Mặc dù nó giống với `r`, nhưng `w` chỉ có thể gọi các hàm dựa trên kiểu tĩnh của nó là `io.Writer`, nghĩa là chỉ có thể gọi `w.Write()`. Dạng bộ nhớ của `w` được biểu diễn như sau:

![reflect-3.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/reflect-3.png)

So sánh với `r`, chỉ có hàm `fun` thay đổi từ `Read` thành `Write`.

Cuối cùng, một phép gán khác:

```go
var empty interface{}
empty = w
```

Vì `empty` là một giao diện rỗng, nên tất cả các kiểu đều triển khai nó, `w` có thể được gán trực tiếp cho nó mà không cần kiểm tra kiểu.

![reflect-4.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/reflect-4.png)

Từ ba hình ảnh trên, có thể thấy rằng giao diện bao gồm ba phần thông tin: `_type` là thông tin kiểu, `*data` trỏ đến giá trị thực tế của kiểu cụ thể, `itab` chứa thông tin về kiểu cụ thể, bao gồm kích thước, đường dẫn gói và các phương thức được gắn liền với kiểu (không được vẽ trong hình). Bổ sung thêm về cấu trúc `os.File`:

![reflect-5.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/reflect-5.png)

Cuối cùng, chúng ta sẽ thể hiện một mẹo:

Trước tiên, tham khảo mã nguồn, định nghĩa hai cấu trúc `iface` và `eface` giả mạo.

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

type eface struct {
	_type uintptr
	data unsafe.Pointer
}
```

Tiếp theo, chúng ta sẽ ép buộc giải thích nội dung bộ nhớ của biến giao diện thành các kiểu được định nghĩa ở trên, sau đó in ra:

```go
package main

import (
	"os"
	"fmt"
	"io"
	"unsafe"
)

func main() {
	var r io.Reader
	fmt.Printf("initial r: %T, %v\n", r, r)

	tty, _ := os.OpenFile("/Users/qcrao/Desktop/test", os.O_RDWR, 0)
	fmt.Printf("tty: %T, %v\n", tty, tty)

	// Gán giá trị cho r
	r = tty
	fmt.Printf("r: %T, %v\n", r, r)

	rIface := (*iface)(unsafe.Pointer(&r))
	fmt.Printf("r: iface.tab._type = %#x, iface.data = %#x\n", rIface.tab._type, rIface.data)

	// Gán giá trị cho w
	var w io.Writer
	w = r.(io.Writer)
	fmt.Printf("w: %T, %v\n", w, w)

	wIface := (*iface)(unsafe.Pointer(&w))
	fmt.Printf("w: iface.tab._type = %#x, iface.data = %#x\n", wIface.tab._type, wIface.data)

	// Gán giá trị cho empty
	var empty interface{}
	empty = w
	fmt.Printf("empty: %T, %v\n", empty, empty)

	emptyEface := (*eface)(unsafe.Pointer(&empty))
	fmt.Printf("empty: eface._type = %#x, eface.data = %#x\n", emptyEface._type, emptyEface.data)
}
```

Kết quả chạy:

```go
initial r: <nil>, <nil>
tty: *os.File, &{0xc4200820f0}
r: *os.File, &{0xc4200820f0}
r: iface.tab._type = 0x10bfcc0, iface.data = 0xc420080020
w: *os.File, &{0xc4200820f0}
w: iface.tab._type = 0x10bfcc0, iface.data = 0xc420080020
empty: *os.File, &{0xc4200820f0}
empty: eface._type = 0x10bfcc0, eface.data = 0xc420080020
```

Động cơ và giá trị động của `r, w, empty` đều giống nhau. Không cần giải thích chi tiết nữa, kết hợp với các hình ảnh trước đó, chúng ta có thể nhìn thấy rõ ràng.

# Các hàm reflect cơ bản

Gói `reflect` định nghĩa một giao diện và một cấu trúc, lần lượt là `reflect.Type` và `reflect.Value`, chúng cung cấp nhiều hàm để truy xuất thông tin về kiểu được lưu trữ trong một giao diện.

`reflect.Type` chủ yếu cung cấp thông tin về kiểu, do đó nó liên quan chặt chẽ với `_type`. Trong khi đó, `reflect.Value` kết hợp cả `_type` và `data`, cho phép người lập trình truy xuất và thậm chí thay đổi giá trị của một kiểu.

Gói `reflect` cung cấp hai hàm cơ bản để thực hiện phản chiếu và lấy thông tin về giao diện và cấu trúc đã đề cập:

```go
func TypeOf(i interface{}) Type 
func ValueOf(i interface{}) Value
```

Hàm `TypeOf` được sử dụng để trích xuất thông tin kiểu của giá trị được lưu trữ trong một giao diện. Vì tham số đầu vào của nó là một `interface{}` trống, khi gọi hàm này, đối số thực tế được chuyển đổi thành kiểu `interface{}` trước. Điều này cho phép thông tin kiểu, tập hợp phương thức và thông tin giá trị của đối số thực tế được lưu trữ trong biến `interface{}`.

Hãy xem mã nguồn:

```go
func TypeOf(i interface{}) Type {
	eface := *(*emptyInterface)(unsafe.Pointer(&i))
	return toType(eface.typ)
}
```

Ở đây, `emptyInterface` tương đương với `eface` đã được đề cập (với một số khác biệt nhỏ trong tên trường) và nằm trong gói nguồn khác: trước là gói `reflect`, sau là gói `runtime`. `eface.typ` đại diện cho kiểu động.

```go
type emptyInterface struct {
	typ  *rtype
	word unsafe.Pointer
}
```

Còn về hàm `toType`, nó chỉ thực hiện một phép chuyển đổi kiểu đơn giản:

```go
func toType(t *rtype) Type {
	if t == nil {
		return nil
	}
	return t
}
```

Lưu ý rằng giá trị trả về `Type` thực tế là một giao diện định nghĩa nhiều phương thức để lấy thông tin liên quan đến kiểu, trong khi `*rtype` thực hiện giao diện `Type`.

```go
type Type interface {
    // Các phương thức sau đây có thể được gọi bởi tất cả các loại

    // Trả về số byte mà biến của kiểu này chiếm sau khi căn chỉnh
    Align() int

    // Trả về số byte mà trường của kiểu struct này chiếm sau khi căn chỉnh
    FieldAlign() int

    // Trả về phương thức thứ `i` (tham số đầu vào) trong tập hợp phương thức của kiểu
    Method(int) Method

    // Trả về phương thức theo tên
    MethodByName(string) (Method, bool)

    // Trả về số lượng phương thức xuất hiện trong tập hợp phương thức của kiểu
    NumMethod() int

    // Trả về tên của kiểu
    Name() string

    // Trả về đường dẫn của kiểu, ví dụ: encoding/base64
    PkgPath() string

    // Trả về kích thước của kiểu, tương tự như unsafe.Sizeof
    Size() uintptr

    // Trả về biểu diễn chuỗi của kiểu
    String() string

    // Trả về giá trị kiểu của kiểu
    Kind() Kind

    // Kiểm tra xem kiểu có triển khai giao diện u không
    Implements(u Type) bool

    // Kiểm tra xem kiểu có thể gán cho u không
    AssignableTo(u Type) bool

    // Kiểm tra xem kiểu có thể chuyển đổi sang u không
    ConvertibleTo(u Type) bool

    // Kiểm tra xem kiểu có thể so sánh được không
    Comparable() bool

    // Các phương thức sau đây chỉ có thể được gọi bởi các loại cụ thể
    // Ví dụ: Key, Elem chỉ có thể được gọi bởi kiểu Map

    // Trả về số bit mà kiểu này chiếm
    Bits() int

    // Trả về hướng của kênh, chỉ có kiểu Chan mới có thể gọi
    ChanDir() ChanDir

    // Kiểm tra xem kiểu có phải là biến tham số không, chỉ có kiểu func mới có thể gọi
    // Ví dụ: nếu t là kiểu func(x int, y ... float64)
    // thì t.IsVariadic() == true
    IsVariadic() bool

    // Trả về kiểu phần tử bên trong, chỉ có các kiểu Array, Chan, Map, Ptr, hoặc Slice mới có thể gọi
    Elem() Type

    // Trả về trường thứ i của kiểu struct, chỉ có kiểu struct mới có thể gọi
    // Nếu i vượt quá số lượng trường, sẽ panic
    Field(i int) StructField

    // Trả về trường nhúng của kiểu struct
    FieldByIndex(index []int) StructField

    // Trả về trường dựa trên tên
    FieldByName(name string) (StructField, bool)

    // FieldByNameFunc trả về trường với tên phù hợp với hàm func
    FieldByNameFunc(match func(string) bool) (StructField, bool)

    // Trả về kiểu tham số thứ i của hàm, chỉ có kiểu func mới có thể gọi
    In(i int) Type

    // Trả về kiểu key của map, chỉ có kiểu map mới có thể gọi
    Key() Type

    // Trả về độ dài của mảng, chỉ có kiểu Array mới có thể gọi
    Len() int

    // Trả về số lượng trường của kiểu struct, chỉ có kiểu Struct mới có thể gọi
    NumField() int

    // Trả về số lượng tham số đầu vào của hàm
    NumIn() int

    // Trả về số lượng giá trị trả về của hàm
    NumOut() int

    // Trả về kiểu của giá trị trả về thứ i của hàm
    Out(i int) Type

    // Trả về phần chung của kiểu
    common() *rtype

    // Trả về phần không chung của kiểu
    uncommon() *uncommonType
}
```

Giao diện `Type` định nghĩa một loạt các phương thức để truy xuất thông tin về kiểu. Qua các phương thức này, ta có thể lấy được nhiều thông tin khác nhau về kiểu. Để hiểu rõ khả năng của giao diện `Type`, cần đọc qua tất cả các phương thức đã được đề cập ở trên.

Lưu ý rằng phương thức thứ hai từ cuối trong tập hợp phương thức của giao diện `Type`, `common`, trả về một kiểu `rtype`. Đây là cùng một kiểu như `_type` đã được đề cập trong bài viết trước, và mã nguồn cũng có chú thích rằng hai phải được duy trì đồng bộ:

```go
// rtype must be kept in sync with ../runtime/type.go:/^type._type.
```

```go
type rtype struct {
	size       uintptr
	ptrdata    uintptr
	hash       uint32
	tflag      tflag
	align      uint8
	fieldAlign uint8
	kind       uint8
	alg        *typeAlg
	gcdata     *byte
	str        nameOff
	ptrToThis  typeOff
}
```

Tất cả các kiểu đều bao gồm trường `rtype`, đại diện cho thông tin chung của các kiểu khác nhau. Ngoài ra, các kiểu khác nhau còn bao gồm các phần riêng biệt của chúng.

Ví dụ, `arrayType` và `chanType` đều bao gồm `rtype`, nhưng `arrayType` còn bao gồm thông tin liên quan đến mảng như slice và độ dài, trong khi `chanType` bao gồm trường `dir` để chỉ định hướng của kênh.

Lưu ý rằng giao diện `Type` triển khai phương thức `String()`, đáp ứng giao diện `fmt.Stringer`. Do đó, khi sử dụng `fmt.Println`, kết quả sẽ là kết quả của `String()`. Ngoài ra, nếu `%T` được sử dụng làm tham số định dạng trong `fmt.Printf()`, kết quả sẽ là kết quả của `reflect.TypeOf`, đại diện cho kiểu động. Ví dụ:

```go
fmt.Printf("%T", 3) // int
```

---

Sau khi đã trình bày về hàm `TypeOf`, chúng ta sẽ tiếp tục xem xét hàm `ValueOf`. Giá trị trả về `reflect.Value` đại diện cho biến thực tế được lưu trữ trong `interface{}`, nó cung cấp thông tin về biến thực tế đó. Các phương thức liên quan thường cần kết hợp thông tin về kiểu và giá trị. Ví dụ, để trích xuất thông tin về trường của một cấu trúc, ta cần sử dụng thông tin về trường và thông tin về vị trí (offset) được giữ bởi kiểu `_type` (cụ thể là `structType`), cùng với nội dung mà `*data` trỏ tới - giá trị thực tế của cấu trúc.

Mã nguồn như sau:

```go
func ValueOf(i interface{}) Value {
	if i == nil {
		return Value{}
	}
	
   // ……
	return unpackEface(i)
}

// Giải nén eface
func unpackEface(i interface{}) Value {
	e := (*emptyInterface)(unsafe.Pointer(&i))

	t := e.typ
	if t == nil {
		return Value{}
	}
	
	f := flag(t.Kind())
	if ifaceIndir(t) {
		f |= flagIndir
	}
	return Value{t, e.word, f}
}
```

Từ mã nguồn, ta có thể thấy rằng quá trình khá đơn giản: trước tiên, chúng ta chuyển đổi `i` thành kiểu `*emptyInterface`, sau đó chúng ta sử dụng trường `typ` và `word` cùng với một trường cờ để tạo thành một cấu trúc `Value`. Đây chính là giá trị trả về của hàm `ValueOf`, nó bao gồm con trỏ đến cấu trúc kiểu, địa chỉ dữ liệu thực tế và các cờ.

Cấu trúc `Value` định nghĩa nhiều phương thức, cho phép trực tiếp thao tác với dữ liệu thực tế mà trường `ptr` của `Value` trỏ tới:

```go
// Thiết lập trường len của slice, nếu kiểu không phải là slice, sẽ panic
func (v Value) SetLen(n int)

// Thiết lập trường cap của slice
func (v Value) SetCap(n int)

// Thiết lập cặp khóa-giá trị của map
func (v Value) SetMapIndex(key, val Value)

// Trả về giá trị tại vị trí chỉ mục i của slice, string, array
func (v Value) Index(i int) Value

// Trả về giá trị của trường nội bộ trong cấu trúc dựa trên tên
func (v Value) FieldByName(name string)

// ……
```

Cấu trúc `Value` còn nhiều phương thức khác. Ví dụ:

```go
// Trả về giá trị kiểu int
func (v Value) Int() int64

// Trả về số lượng trường (thành viên) trong cấu trúc
func (v Value) NumField() int

// Thử gửi dữ liệu vào kênh (không chặn)
func (v Value) TrySend(x reflect.Value) bool

// Gọi hàm (hoặc phương thức) mà giá trị v đại diện cho, thông qua danh sách tham số in
func (v Value) Call(in []Value) (r []Value)

// Gọi hàm có tham số biến đổi độ dài có thể thay đổi
func (v Value) CallSlice(in []Value) []Value
```

Không liệt kê tất cả, nhưng có rất nhiều. Bạn có thể xem mã nguồn trong `src/reflect/value.go`, tìm kiếm `func (v Value)` để xem thêm.

Ngoài ra, thông qua các phương thức `Type()` và `Interface()`, ta có thể kết nối `interface`, `Type` và `Value`. Phương thức `Type()` cũng có thể trả về thông tin kiểu của biến, tương đương với hàm `reflect.TypeOf()`. Phương thức `Interface()` có thể chuyển đổi `Value` trở lại thành `interface` ban đầu.

![reflect-6.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/reflect-6.png)

Tóm tắt: Hàm `TypeOf()` trả về một giao diện, giao diện này định nghĩa một loạt các phương thức để lấy thông tin về kiểu. Hàm `ValueOf()` trả về một biến cấu trúc, bao gồm thông tin về kiểu và giá trị thực tế.

Hãy xem một hình ảnh để tóm tắt:

![reflect-7.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/reflect-7.png)

Trong hình ảnh trên, `rtype` triển khai giao diện `Type` và đại diện cho phần chung của tất cả các kiểu. Cấu trúc `emptyInterface` và `eface` thực chất là cùng một thứ, và `rtype` thực chất là `_type`, chỉ có một số trường có tên khác nhau, ví dụ như trường `word` trong `emptyInterface` và trường

# Ba luật của reflection

Theo blog chính thức của Go về phản chiếu, có ba luật của phản chiếu:

>1. Reflection goes from interface value to reflection object.

>2. Reflection goes from reflection object to interface value.

>3. To modify a reflection object, the value must be settable.

Luật đầu tiên là cơ bản nhất: phản chiếu là cơ chế để xác định kiểu và giá trị được lưu trữ trong giao diện. Điều này có thể được thực hiện bằng cách sử dụng hàm `TypeOf` và `ValueOf`.

Luật thứ hai thực tế là cơ chế ngược lại của luật thứ nhất. Nó chuyển đổi giá trị trả về từ `ValueOf` thành biến giao diện bằng cách sử dụng hàm `Interface()`.

Hai luật đầu tiên đề cập đến việc chuyển đổi giữa `biến giao diện` và `đối tượng phản chiếu`. Đối tượng phản chiếu thực tế là `reflect.Type` và `reflect.Value` như đã đề cập ở trên.

Luật thứ ba không dễ hiểu: nếu muốn thao tác một biến phản chiếu, nó phải có thể được thiết lập. Khả năng thiết lập của biến phản chiếu là do nó lưu trữ chính giá trị ban đầu của biến, điều này có nghĩa là các thao tác trên biến phản chiếu sẽ phản ánh vào biến gốc. Nếu biến phản chiếu không thể đại diện cho biến gốc, việc thao tác trên biến phản chiếu sẽ không ảnh hưởng đến biến gốc, điều này có thể gây nhầm lẫn cho người sử dụng. Vì vậy, trường hợp thứ hai không được phép ở mức ngôn ngữ.

Dưới đây là một ví dụ kinh điển:

```go
var x float64 = 3.4
v := reflect.ValueOf(x)
v.SetFloat(7.1) // Lỗi: sẽ gây ra panic.
```

Việc thực thi mã trên sẽ gây ra panic, nguyên nhân là biến phản chiếu `v` không thể đại diện cho `x` chính xác. Tại sao? Vì khi gọi `reflect.ValueOf(x)`, tham số được truyền vào trong hàm chỉ là một bản sao, là truyền giá trị, do đó `v` chỉ đại diện cho một bản sao của `x`, vì vậy việc thao tác trên `v` bị cấm.

Khả năng thiết lập là một thuộc tính của biến phản chiếu `Value`, nhưng không phải tất cả các `Value` đều có thể được thiết lập.

Tương tự như trong các hàm thông thường, khi muốn thay đổi biến được truyền vào, ta sử dụng con trỏ để giải quyết.

```go
var x float64 = 3.4
p := reflect.ValueOf(&x)
fmt.Println("Kiểu của p:", p.Type())
fmt.Println("Khả năng thiết lập của p:", p.CanSet())
```

Kết quả là:

```go
Kiểu của p: *float64
Khả năng thiết lập của p: false
```

`p` vẫn không đại diện cho `x`, chỉ khi gọi `p.Elem()` thì mới thực sự đại diện cho `x`, từ đó ta có thể thao tác trực tiếp trên `x`:

```go
v := p.Elem()
v.SetFloat(7.1)
fmt.Println(v.Interface()) // 7.1
fmt.Println(x) // 7.1
```

Về luật thứ ba, hãy nhớ một câu: Để thao tác trên biến gốc, biến phản chiếu `Value` phải giữ địa chỉ của biến gốc.
