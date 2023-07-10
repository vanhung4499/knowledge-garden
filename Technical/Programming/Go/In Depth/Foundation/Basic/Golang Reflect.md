---
title: Golang Reflect
date created: 2023-07-01
date modified: 2023-07-04
tags: [golang]
---

Mặc dù không phổ biến trong hầu hết các ứng dụng và dịch vụ, nhưng nhiều framework phụ thuộc vào cơ chế phản xạ của ngôn ngữ Go để đơn giản hóa mã nguồn. Vì ngữ pháp của ngôn ngữ Go rất ít và thiết kế đơn giản, nên nó không có khả năng diễn đạt mạnh mẽ, nhưng gói  [`reflect`](https://golang.org/pkg/reflect/) của ngôn ngữ Go có thể khắc phục một số hạn chế của nó về cú pháp.

[`reflect`](https://golang.org/pkg/reflect/) thực hiện khả năng phản chiếu trong run time, cho phép chương trình làm việc với các đối tượng khác nhau. Gói `reflect` chứa hai cặp hàm và kiểu rất quan trọng, hai hàm đó là:

- [`reflect.TypeOf`](https://draveness.me/golang/tree/reflect.TypeOf) để lấy thông tin về kiểu dữ liệu
- [`reflect.ValueOf`](https://draveness.me/golang/tree/reflect.ValueOf) để lấy biểu diễn run time của dữ liệu

Hai kiểu dữ liệu là [`reflect.Type`](https://draveness.me/golang/tree/reflect.Type) và [`reflect.Value`](https://draveness.me/golang/tree/reflect.Value), chúng tương ứng một-một với các hàm:

![Pasted image 20230701213655](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230701213655.png)

Kiểu [`reflect.Type`](https://draveness.me/golang/tree/reflect.Type) là một giao diện được định nghĩa trong gói `reflect`, chúng ta có thể sử dụng hàm [`reflect.TypeOf`](https://draveness.me/golang/tree/reflect.TypeOf) để lấy kiểu của bất kỳ biến nào. Giao diện [`reflect.Type`](https://draveness.me/golang/tree/reflect.Type) định nghĩa một số phương thức thú vị, `MethodByName` có thể lấy tham chiếu của phương thức tương ứng với kiểu hiện tại, `Implements` có thể kiểm tra xem kiểu hiện tại có triển khai một giao diện nào đó hay không:

```go
type Type interface {
        Align() int
        FieldAlign() int
        Method(int) Method
        MethodByName(string) (Method, bool)
        NumMethod() int
        ...
        Implements(u Type) bool
        ...
}
```

Kiểu [`reflect.Value`](https://draveness.me/golang/tree/reflect.Value) trong gói reflect khác với kiểu [`reflect.Type`](https://draveness.me/golang/tree/reflect.Type), nó được khai báo là một cấu trúc. Cấu trúc này không có trường được công khai, nhưng cung cấp các phương thức để lấy hoặc ghi dữ liệu:

```go
type Value struct {
        // Chứa các trường bị lọc hoặc không được export
}

func (v Value) Addr() Value
func (v Value) Bool() bool
func (v Value) Bytes() []byte
...
```

Tất cả các phương thức trong gói `reflect` đều được thiết kế xung quanh hai kiểu reflect.Type và reflect.Value. Chúng ta có thể chuyển đổi một biến thông thường thành reflect.Type và reflect.Value được cung cấp trong gói phản chiếu bằng cách sử dụng [`reflect.TypeOf`](https://draveness.me/golang/tree/reflect.TypeOf) và [`reflect.ValueOf`](https://draveness.me/golang/tree/reflect.ValueOf), sau đó chúng ta có thể sử dụng các phương thức trong gói phản chiếu để thực hiện các thao tác phức tạp trên chúng.

## Ba nguyên tắc quan trọng của phản chiếu

Phản chiếu trong run time là một cách để chương trình kiểm tra cấu trúc của nó trong quá trình chạy. Tính linh hoạt của phản chiếu là một con dao hai lưỡi, phản chiếu như một phương pháp lập trình meta có thể giảm thiểu mã lặp lại, nhưng sử dụng quá nhiều phản chiếu có thể làm cho logic của chương trình trở nên khó hiểu và chậm. Trong phần này, chúng ta sẽ giới thiệu ba nguyên tắc quan trọng của phản chiếu trong ngôn ngữ Go, bao gồm:

1. Có thể phản chiếu từ biến `interface{}` thành đối tượng phản chiếu.
2. Có thể lấy được biến `interface{}` từ đối tượng phản chiếu
3. Để thay đổi đối tượng phản chiếu, giá trị của nó phải có thể được thiết lập.

### Nguyên tắc thứ nhất

Nguyên tắc phản chiếu đầu tiên là chúng ta có thể chuyển đổi biến `interface{}` của ngôn ngữ Go thành đối tượng phản chiếu. Rất nhiều người đọc có thể bị nhầm lẫn với nguyên tắc này - tại sao chúng ta chuyển đổi từ biến `interface{}` thành đối tượng phản chiếu? Khi chúng ta thực hiện `reflect.ValueOf(1)`, mặc dù có vẻ như chúng ta đang lấy loại phản chiếu tương ứng với kiểu dữ liệu cơ bản `int`, nhưng do các phương thức [`reflect.TypeOf`](https://draveness.me/golang/tree/reflect.TypeOf) và [`reflect.ValueOf`](https://draveness.me/golang/tree/reflect.ValueOf) có tham số là kiểu `interface{}`, nên trong quá trình thực thi phương thức, chúng ta thực hiện chuyển đổi kiểu.

Vì các cuộc gọi hàm trong ngôn ngữ Go đều truyền giá trị, biến cơ bản `int` sẽ được chuyển đổi thành kiểu `interface{}`, đó cũng là lý do tại sao nguyên tắc đầu tiên là từ `interface{}` đến đối tượng phản chiếu.

Các hàm [`reflect.TypeOf`](https://draveness.me/golang/tree/reflect.TypeOf) và [`reflect.ValueOf`](https://draveness.me/golang/tree/reflect.ValueOf) đã được đề cập ở trên có thể thực hiện chuyển đổi này, nếu chúng ta coi kiểu của ngôn ngữ Go và kiểu phản chiếu là hai thế giới khác nhau, thì hai hàm này chính là cây cầu kết nối giữa hai thế giới này.

![Pasted image 20230701222309](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230701222309.png)

Chúng ta có thể giới thiệu chức năng của chúng thông qua ví dụ sau, [`reflect.TypeOf`](https://draveness.me/golang/tree/reflect.TypeOf) lấy kiểu của biến author, [`reflect.ValueOf`](https://draveness.me/golang/tree/reflect.ValueOf) lấy giá trị của biến draven. Nếu chúng ta biết kiểu và giá trị của một biến, điều đó có nghĩa là chúng ta biết tất cả thông tin về biến đó.

```go
package main

import (
	"fmt"
	"reflect"
)

func main() {
	author := "draven"
	fmt.Println("TypeOf author:", reflect.TypeOf(author))
	fmt.Println("ValueOf author:", reflect.ValueOf(author))
}
```

```bash
$ go run main.go
TypeOf author: string
ValueOf author: draven
```

Sau khi có kiểu biến, chúng ta có thể sử dụng phương thức `Method` để lấy các phương thức được triển khai bởi kiểu, sử dụng `Field` để lấy tất cả các trường của kiểu. Đối với các kiểu khác nhau, chúng ta cũng có thể gọi các phương thức khác nhau để lấy thông tin liên quan:

- Cấu trúc: Lấy số lượng trường và lấy trường `StructField` thông qua chỉ số và tên trường
- Bảng băm: Lấy kiểu Key của bảng băm
- Hàm hoặc phương thức: Lấy kiểu tham số đầu vào và giá trị trả về
- …

Tóm lại, sử dụng  [`reflect.TypeOf`](https://draveness.me/golang/tree/reflect.TypeOf) và [`reflect.ValueOf`](https://draveness.me/golang/tree/reflect.ValueOf) có thể lấy được đối tượng phản chiếu tương ứng với biến trong ngôn ngữ Go. Khi đã có đối tượng phản chiếu, chúng ta có thể có được dữ liệu và thao tác liên quan đến kiểu hiện tại và thực hiện các phương thức được lấy trong run time.

### Nguyên tắc thứ hai

Nguyên tắc phản chiếu thứ hai là chúng ta có thể lấy biến `interface{}` từ đối tượng phản chiếu. Vì chúng ta có thể chuyển đổi biến kiểu `interface{}` thành đối tượng phản chiếu, nên chắc chắn cần có các phương pháp khác để chuyển đổi đối tượng phản chiếu thành biến kiểu `interface{}`, [`reflect.Value.Interface`](https://draveness.me/golang/tree/reflect.Value.Interface) trong gói [`reflect`](https://golang.org/pkg/reflect/) có thể hoàn thành công việc này:

![Pasted image 20230701223144](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230701223144.png)

Tuy nhiên, việc gọi phương thức [`reflect.Value.Interface`](https://draveness.me/golang/tree/reflect.Value.Interface) chỉ có thể nhận được biến kiểu `interface{}`, nếu muốn khôi phục nó về trạng thái ban đầu, cần thực hiện chuyển đổi kiểu rõ ràng như sau:

```go
v := reflect.ValueOf(1)
v.Interface().(int)
```

Quá trình từ đối tượng phản chiếu thành giá trị interface là quá trình phản chiếu của giá trị interface thành đối tượng phản chiếu, cả hai quá trình đều cần trải qua hai lần chuyển đổi:

- Từ giá trị interface thành đối tượng phản chiếu:
	- Chuyển đổi từ kiểu cơ bản thành kiểu interface
	- Chuyển đổi từ kiểu interface thành đối tượng phản chiếu
- Từ đối tượng phản chiếu thành giá trị interface:
	- Chuyển đổi đối tượng phản chiếu thành kiểu interface
	- Chuyển đổi kiểu rõ ràng thành kiểu gốc

![Pasted image 20230701225153](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230701225153.png)

Tất nhiên, không phải tất cả các biến đều cần trải qua quá trình chuyển đổi kiểu này. Nếu biến chính nó đã có kiểu `interface{}`, thì không cần chuyển đổi kiểu, vì quá trình chuyển đổi kiểu này thường là ngầm định, vì vậy chúng ta không cần quan tâm đến nó, chỉ khi chúng ta cần chuyển đổi đối tượng phản chiếu trở lại kiểu cơ bản mới cần thực hiện chuyển đổi rõ ràng.

### Nguyên tắc thứ ba

Nguyên tắc cuối cùng của phản chiếu trong ngôn ngữ Go liên quan đến khả năng thay đổi giá trị. Nếu chúng ta muốn cập nhật một  [`reflect.Value`](https://draveness.me/golang/tree/reflect.Value), thì giá trị mà nó giữ phải có thể được cập nhật, giả sử chúng ta có đoạn mã sau:

```go
func main() {
	i := 1
	v := reflect.ValueOf(i)
	v.SetInt(10)
	fmt.Println(i)
}
```

```bash
$ go run reflect.go
panic: reflect: reflect.flag.mustBeAssignable using unaddressable value

goroutine 1 [running]:
reflect.flag.mustBeAssignableSlow(0x82, 0x1014c0)
	/usr/local/go/src/reflect/value.go:247 +0x180
reflect.flag.mustBeAssignable(...)
	/usr/local/go/src/reflect/value.go:234
reflect.Value.SetInt(0x100dc0, 0x414020, 0x82, 0x1840, 0xa, 0x0)
	/usr/local/go/src/reflect/value.go:1606 +0x40
main.main()
	/tmp/sandbox590309925/prog.go:11 +0xe0
```

Chạy đoạn mã trên sẽ làm cho chương trình gặp lỗi và báo lỗi "reflect: reflect.flag.mustBeAssignable using unaddressable value", nếu suy nghĩ kỹ, chúng ta có thể nhận ra lý do lỗi: vì cuộc gọi hàm trong ngôn ngữ Go truyền giá trị, đối tượng phản chiếu mà chúng ta nhận được không có liên quan gì đến biến ban đầu, vì vậy việc thay đổi trực tiếp đối tượng phản chiếu không thể thay đổi biến gốc, chương trình sẽ gặp lỗi để tránh sai sót.

Để thay đổi biến gốc, chúng ta chỉ có thể sử dụng phương pháp sau:

```go
func main() {
	i := 1
	v := reflect.ValueOf(&i)
	v.Elem().SetInt(10)
	fmt.Println(i)
}
```

```bash
$ go run reflect.go
10
```

1. Gọi [`reflect.ValueOf`](https://draveness.me/golang/tree/reflect.ValueOf) để lấy con trỏ biến
2. Gọi [`reflect.Value.Elem`](https://draveness.me/golang/tree/reflect.Value.Elem) để lấy biến mà con trỏ trỏ đến
3. Gọi [`reflect.Value.SetInt`](https://draveness.me/golang/tree/reflect.Value.SetInt) để cập nhật giá trị của biến:

Vì cuộc gọi hàm trong ngôn ngữ Go truyền giá trị, chúng ta chỉ có thể thay đổi biến gốc theo cách gián tiếp: trước tiên lấy [`reflect.Value`](https://draveness.me/golang/tree/reflect.Value) tương ứng với con trỏ, sau đó sử dụng phương thức [`reflect.Value.Elem`](https://draveness.me/golang/tree/reflect.Value.Elem) để lấy biến có thể được thiết lập, chúng ta có thể hiểu quá trình này thông qua đoạn mã sau:

```go
func main() {
	i := 1
	v := &i
	*v = 10
}
```

Nếu không thể trực tiếp thay đổi giá trị của biến `i`, chúng ta chỉ có thể lấy địa chỉ của biến `i` và sử dụng `*v` để thay đổi số nguyên được lưu trữ tại địa chỉ đó.

## Các kiểu và giá trị

Trong ngôn ngữ Go, kiểu `interface{}` được biểu diễn bằng cấu trúc [`reflect.emptyInterface`](https://draveness.me/golang/tree/reflect.emptyInterface) trong bên trong ngôn ngữ, trong đó trường `rtype` được sử dụng để đại diện cho kiểu của biến và trường word trỏ đến dữ liệu được đóng gói bên trong:

```go
type emptyInterface struct {
	typ  *rtype
	word unsafe.Pointer
}
```

Hàm [`reflect.TypeOf`](https://draveness.me/golang/tree/reflect.TypeOf) được sử dụng để lấy kiểu của biến sẽ tự động chuyển đổi biến truyền vào thành kiểu [`reflect.emptyInterface`](https://draveness.me/golang/tree/reflect.emptyInterface) và lấy thông tin kiểu được lưu trữ trong đó [`reflect.rtype`](https://draveness.me/golang/tree/reflect.rtype):

```go
func TypeOf(i interface{}) Type {
	eface := *(*emptyInterface)(unsafe.Pointer(&i))
	return toType(eface.typ)
}

func toType(t *rtype) Type {
	if t == nil {
		return nil
	}
	return t
}
```

[`reflect.rtype`](https://draveness.me/golang/tree/reflect.rtype) là một cấu trúc triển khai giao diện [`reflect.Type`](https://draveness.me/golang/tree/reflect.Type), phương thức  [`reflect.rtype.String`](https://draveness.me/golang/tree/reflect.rtype.String) được triển khai để giúp chúng ta lấy tên của kiểu hiện tại.

```go
func (t *rtype) String() string {
	s := t.nameOff(t.str).name()
	if t.tflag&tflagExtraStar != 0 {
		return s[1:]
	}
	return s
}
```

Cách thức triển khai của [`reflect.TypeOf`](https://draveness.me/golang/tree/reflect.TypeOf) thực sự không phức tạp, nó chỉ chuyển đổi biến `interface{}` thành biểu diễn nội bộ [`reflect.emptyInterface`](https://draveness.me/golang/tree/reflect.emptyInterface), sau đó lấy thông tin kiểu tương ứng từ đó.

Hàm  [`reflect.ValueOf`](https://draveness.me/golang/tree/reflect.ValueOf) để lấy giá trị `interface{}` được triển khai cũng rất đơn giản, trong hàm này chúng ta trước tiên gọi [`reflect.escapes`](https://draveness.me/golang/tree/reflect.escapes) để đảm bảo giá trị hiện tại thoát ra khỏi ngăn xếp, sau đó sử dụng  [`reflect.unpackEface`](https://draveness.me/golang/tree/reflect.unpackEface) để lấy cấu trúc [`reflect.Value`](https://draveness.me/golang/tree/reflect.Value) từ giao diện:

```go
func ValueOf(i interface{}) Value {
	if i == nil {
		return Value{}
	}

	escapes(i)

	return unpackEface(i)
}

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

[`reflect.unpackEface`](https://draveness.me/golang/tree/reflect.unpackEface) sẽ chuyển đổi giao diện truyền vào thành [`reflect.emptyInterface`](https://draveness.me/golang/tree/reflect.emptyInterface), sau đó đóng gói kiểu cụ thể và con trỏ thành cấu trúc [`reflect.Value`](https://draveness.me/golang/tree/reflect.Value) và trả về.

Triển khai của [`reflect.TypeOf`](https://draveness.me/golang/tree/reflect.TypeOf) và [`reflect.ValueOf`](https://draveness.me/golang/tree/reflect.ValueOf) đều rất đơn giản. Chúng ta đã phân tích cách triển khai của hai hàm này, bây giờ cần hiểu công việc mà trình biên dịch thực hiện trước khi gọi hàm:

```go
package main

import (
	"reflect"
)

func main() {
	i := 20
	_ = reflect.TypeOf(i)
}
```

```bash
$ go build -gcflags="-S -N" main.go
...
MOVQ	$20, ""..autotmp_20+56(SP) // autotmp = 20
LEAQ	type.int(SB), AX           // AX = type.int(SB)
MOVQ	AX, ""..autotmp_19+280(SP) // autotmp_19+280(SP) = type.int(SB)
LEAQ	""..autotmp_20+56(SP), CX  // CX = 20
MOVQ	CX, ""..autotmp_19+288(SP) // autotmp_19+288(SP) = 20
...
```

Từ đoạn mã ngữ hợp ngữ trên, chúng ta có thể thấy rằng đã có sự chuyển đổi kiểu trước khi gọi hàm, các chỉ thị trên chuyển đổi biến kiểu `int` thành một giao diện chiếm 16 byte từ `autotmp_19+280(SP) ~ autotmp_19+288(SP)`, hai chỉ thị `LEAQ` lần lượt lấy địa chỉ của kiểu `type.int(SB)` và địa chỉ của biến `i`.

Khi chúng ta muốn chuyển đổi một biến thành đối tượng phản chiếu, ngôn ngữ Go sẽ hoàn thành chuyển đổi kiểu trong quá trình biên dịch, chuyển đổi kiểu và giá trị của biến thành `interface{}` và chờ sử dụng gói [`reflect`](https://golang.org/pkg/reflect/) để lấy thông tin được lưu trữ trong giao diện trong quá trình chạy.

## Cập nhật biến

Khi chúng ta muốn cập nhật [`reflect.Value`](https://draveness.me/golang/tree/reflect.Value), chúng ta cần gọi phương thức [`reflect.Value.Set`](https://draveness.me/golang/tree/reflect.Value.Set) để cập nhật đối tượng phản chiếu. Phương thức này sẽ gọi [`reflect.flag.mustBeAssignable`](https://draveness.me/golang/tree/reflect.flag.mustBeAssignable) và [`reflect.flag.mustBeExported`](https://draveness.me/golang/tree/reflect.flag.mustBeExported) để kiểm tra xem đối tượng phản chiếu hiện tại có thể được thiết lập hay không và trường có phải là trường được công khai hay không:

```go
func (v Value) Set(x Value) {
	v.mustBeAssignable()
	x.mustBeExported()
	var target unsafe.Pointer
	if v.kind() == Interface {
		target = v.ptr
	}
	x = x.assignTo("reflect.Set", v.typ, target)
	typedmemmove(v.typ, v.ptr, x.ptr)
}
```

[`reflect.Value.Set`](https://draveness.me/golang/tree/reflect.Value.Set) sẽ gọi [`reflect.Value.assignTo`](https://draveness.me/golang/tree/reflect.Value.assignTo) và trả về một đối tượng phản chiếu mới, con trỏ của đối tượng phản chiếu trả về này sẽ ghi đè lên biến phản chiếu ban đầu.

```go
func (v Value) assignTo(context string, dst *rtype, target unsafe.Pointer) Value {
	...
	switch {
	case directlyAssignable(dst, v.typ):
		...
		return Value{dst, v.ptr, fl}
	case implements(dst, v.typ):
		if v.Kind() == Interface && v.IsNil() {
			return Value{dst, nil, flag(Interface)}
		}
		x := valueInterface(v, false)
		if dst.NumMethod() == 0 {
			*(*interface{})(target) = x
		} else {
			ifaceE2I(dst, x, target)
		}
		return Value{dst, target, flagIndir | flag(Interface)}
	}
	panic(context + ": value of type " + v.typ.String() + " is not assignable to type " + dst.String())
}
```

[`reflect.Value.assignTo`](https://draveness.me/golang/tree/reflect.Value.assignTo) sẽ tạo ra một cấu trúc [`reflect.Value`](https://draveness.me/golang/tree/reflect.Value) mới dựa trên kiểu của đối tượng phản chiếu hiện tại và đối tượng phản chiếu được thiết lập:

- Nếu hai đối tượng phản chiếu có thể được trực tiếp thay thế, nó sẽ trả về đối tượng phản chiếu đích trực tiếp.
- Nếu đối tượng phản chiếu hiện tại là một giao diện và đối tượng đích triển khai giao diện đó, nó sẽ đóng gói đối tượng đích thành một giá trị giao diện đơn giản.

Trong quá trình cập nhật biến, con trỏ trong [`reflect.Value`](https://draveness.me/golang/tree/reflect.Value) trả về sẽ ghi đè lên con trỏ trong đối tượng phản chiếu hiện tại để cập nhật giá trị của biến.

## Triển khai giao diện

Gói [`reflect`](https://golang.org/pkg/reflect/) cung cấp phương thức [`reflect.rtype.Implements`](https://draveness.me/golang/tree/reflect.rtype.Implements) để xác định xem một loại cụ thể có triển khai một giao diện hay không. Để có được kiểu phản chiếu của một cấu trúc trong ngôn ngữ Go, chúng ta có thể sử dụng phương pháp sau:

```go
reflect.TypeOf((*<interface>)(nil)).Elem()
```

Chúng ta sử dụng một ví dụ để giới thiệu cách đánh giá xem một loại cụ thể có triển khai một giao diện nhất định hay không. Giả sử chúng ta cần đánh giá xem đoạn mã sau `CustomError` có triển khai giao diện `error` trong thư viện chuẩn của ngôn ngữ Go hay không:

```go
type CustomError struct{}

func (*CustomError) Error() string {
	return ""
}

func main() {
	typeOfError := reflect.TypeOf((*error)(nil)).Elem()
	customErrorPtr := reflect.TypeOf(&CustomError{})
	customError := reflect.TypeOf(CustomError{})

	fmt.Println(customErrorPtr.Implements(typeOfError)) // #=> true
	fmt.Println(customError.Implements(typeOfError)) // #=> false
}
```

Kết quả chạy đoạn mã trên như chúng ta đã giới thiệu ở phần [[Golang Interface]]:

- `CustomError` không triển khai giao diện `error`.
- `*CustomError` triển khai giao diện `error`

Bất kể kết quả triển khai ở trên như thế nào, hãy cùng phân tích nguyên tắc hoạt động của phương thức  [`reflect.rtype.Implements`](https://draveness.me/golang/tree/reflect.rtype.Implements):

```go
func (t *rtype) Implements(u Type) bool {
	if u == nil {
		panic("reflect: nil type passed to Type.Implements")
	}
	if u.Kind() != Interface {
		panic("reflect: non-interface type passed to Type.Implements")
	}
	return implements(u.(*rtype), t)
}
```

[`reflect.rtype.Implements`](https://draveness.me/golang/tree/reflect.rtype.Implements) sẽ kiểm tra xem loại đến có phải là giao diện hay không, nếu không phải là giao diện hoặc giá trị null, nó sẽ gây ra một sự cố và kết thúc chương trình hiện tại. Nếu không có vấn đề với các tham số, phương thức này sẽ gọi riêng [`reflect.implements`](https://draveness.me/golang/tree/reflect.implements) để xác định xem có mối quan hệ triển khai giữa các loại hay không:

```go
func implements(T, V *rtype) bool {
	t := (*interfaceType)(unsafe.Pointer(T))
	if len(t.methods) == 0 {
		return true
	}
	...
	v := V.uncommon()
	i := 0
	vmethods := v.methods()
	for j := 0; j < int(v.mcount); j++ {
		tm := &t.methods[i]
		tmName := t.nameOff(tm.name)
		vm := vmethods[j]
		vmName := V.nameOff(vm.name)
		if vmName.name() == tmName.name() && V.typeOff(vm.mtyp) == t.typeOff(tm.typ) {
			if i++; i >= len(t.methods) {
				return true
			}
		}
	}
	return false
}
```

Trong trường hợp giao diện không chứa bất kỳ phương thức nào, điều đó có nghĩa là đây là giao diện trống và bất kỳ loại nào cũng sẽ tự động triển khai giao diện và trả về `true` tại thời điểm này.

![Pasted image 20230701233939](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230701233939.png)

Trong các trường hợp khác, vì các phương thức được lưu trữ theo thứ tự bảng chữ cái, [`reflect.implements`](https://draveness.me/golang/tree/reflect.implements) sử dụng hai chỉ mục để lặp qua các giao diện và phương thức của kiểu `i` và `j` để xác định xem kiểu có triển khai giao diện hay không. Vì chỉ có một phép so sánh tối đa (số phương thức của kiểu) sẽ được triển khai, độ phức tạp thời gian của quá trình này là **O(n)**.

> [!NOTE]+ Lưu ý đây là kĩ thuật two pointer  
> Việc hiểu các thuật toán rất quan trọng, vui lòng đọc thêm trong phần [[DSA MOC]]

## Gọi phương thức

Trong một ngôn ngữ tĩnh như Go, việc sử dụng [`reflect`](https://golang.org/pkg/reflect/) để thực hiện gọi phương thức trong run time không phải là một việc dễ dàng. Dưới đây là một đoạn mã sử dụng phản chiếu để gọi hàm `Add(0, 1)`:

```go
func Add(a, b int) int { return a + b }

func main() {
	v := reflect.ValueOf(Add)
	if v.Kind() != reflect.Func {
		return
	}
	t := v.Type()
	argv := make([]reflect.Value, t.NumIn())
	for i := range argv {
		if t.In(i).Kind() != reflect.Int {
			return
		}
		argv[i] = reflect.ValueOf(i)
	}
	result := v.Call(argv)
	if len(result) != 1 || result[0].Kind() != reflect.Int {
		return
	}
	fmt.Println(result[0].Int()) // #=> 1
}
```

1. Sử dụng [`reflect.ValueOf`](https://draveness.me/golang/tree/reflect.ValueOf) để lấy đối tượng phản chiếu tương ứng với hàm `Add`.
2. Gọi  [`reflect.rtype.NumIn`](https://draveness.me/golang/tree/reflect.rtype.NumIn) để lấy số lượng tham số đầu vào của hàm.
3. Sử dụng [`reflect.ValueOf`](https://draveness.me/golang/tree/reflect.ValueOf) lặp lại để thiết lập từng tham số vào mảng `argv`;
4. Gọi phương[`reflect.Value.Call`](https://draveness.me/golang/tree/reflect.Value.Call) của đối tượng phản chiếu `Add` và truyền danh sách tham số.
5. Lấy mảng kết quả và kiểm tra độ dài và kiểu dữ liệu của mảng, sau đó in ra dữ liệu trong mảng.

Sử dụng phản chiếu để gọi phương thức là một quá trình phức tạp. Những gì chỉ cần một dòng mã để thực hiện, bây giờ cần hơn chục dòng mã mới có thể hoàn thành. Tuy nhiên, đây cũng là một trong những chi phí phải trả khi sử dụng tính năng động trong một ngôn ngữ tĩnh.

```go
func (v Value) Call(in []Value) []Value {
	v.mustBe(Func)
	v.mustBeExported()
	return v.call("Call", in)
}
```

[`reflect.Value.Call`](https://draveness.me/golang/tree/reflect.Value.Call) là điểm vào để gọi phương thức trong run time. Nó sử dụng hai phương thức `MustBe` để xác định xem đối tượng phản chiếu hiện tại có phải là một hàm và có được công khai không. Sau đó, nó gọi phương thức [`reflect.Value.call`](https://draveness.me/golang/tree/reflect.Value.call) để thực hiện cuộc gọi phương thức. Quá trình thực hiện của phương thức này được chia thành các phần sau:

1. Kiểm tra tính hợp lệ của tham số đầu vào và kiểu.
2. Đặt các đối tượng phản chiếu của tham số vào ngăn xếp.
3. Gọi hàm bằng con trỏ hàm và tham số.
4. Lấy giá trị trả về từ ngăn xếp.

Chúng ta sẽ phân tích các quy trình sử dụng reflect để gọi hàm theo thứ tự như trên.

### Kiểm tra tham số

Kiểm tra tham số là bước đầu tiên trong quá trình gọi phương thức bằng `reflect`. Trong quá trình kiểm tra tham số, chúng ta sẽ lấy con trỏ hàm hiện tại từ đối tượng `reflect` bằng `unsafe.Pointer`. Nếu con trỏ hàm đó là một phương thức, chúng ta sẽ sử dụng [`reflect.methodReceiver`](https://draveness.me/golang/tree/reflect.methodReceiver) để lấy bộ nhận và con trỏ hàm của phương thức.

```go
func (v Value) call(op string, in []Value) []Value {
	t := (*funcType)(unsafe.Pointer(v.typ))
	...
	if v.flag&flagMethod != 0 {
		rcvr = v
		rcvrtype, t, fn = methodReceiver(op, v, int(v.flag)>>flagMethodShift)
	} else {
		...
	}
	n := t.NumIn()
	if len(in) < n {
		panic("reflect: Call with too few input arguments")
	}
	if len(in) > n {
		panic("reflect: Call with too many input arguments")
	}
	for i := 0; i < n; i++ {
		if xt, targ := in[i].Type(), t.In(i); !xt.AssignableTo(targ) {
			panic("reflect: " + op + " using " + xt.String() + " as type " + targ.String())
		}
	}
```

Phương thức trên cũng kiểm tra số lượng tham số truyền vào và kiểm tra xem kiểu dữ liệu của các tham số có khớp với kiểu dữ liệu trong chữ ký hàm hay không. Bất kỳ không khớp nào sẽ gây ra lỗi và dừng chương trình.

### Chuẩn bị tham số

Sau khi đã xác minh các tham số của phương thức hiện tại, chúng ta sẽ chuyển sang giai đoạn chuẩn bị tham số cho cuộc gọi hàm. Như đã giới thiệu trong phần trước về cuộc gọi hàm, tất cả các tham số của hàm hoặc phương thức sẽ được đặt trên ngăn xếp.

```go
	nout := t.NumOut()
	frametype, _, retOffset, _, framePool := funcLayout(t, rcvrtype)

	var args unsafe.Pointer
	if nout == 0 {
		args = framePool.Get().(unsafe.Pointer)
	} else {
		args = unsafe_New(frametype)
	}
	off := uintptr(0)
	if rcvrtype != nil {
		storeRcvr(rcvr, args)
		off = ptrSize
	}
	for i, v := range in {
		targ := t.In(i).(*rtype)
		a := uintptr(targ.align)
		off = (off + a - 1) &^ (a - 1)
		n := targ.size
		...
		addr := add(args, off, "n > 0")
		v = v.assignTo("reflect.Value.Call", targ, addr)
		*(*unsafe.Pointer)(addr) = v.ptr
		off += n
	}
```

1. Tính toán bố cục ngăn xếp cho các tham số và giá trị trả về của hàm bằng [`reflect.funcLayout`](https://draveness.me/golang/tree/reflect.funcLayout), đó là kích thước mỗi tham số và giá trị trả về.
2. Nếu hàm hiện tại có giá trị trả về, ta sẽ cấp phát một vùng nhớ `args` cho các tham số và giá trị trả về của hàm.
3. Nếu hàm hiện tại là một phương thức, chúng ta sao chép bộ nhận của phương thức vào vùng nhớ `args`.
4. Sao chép các tham số của hàm theo thứ tự vào vùng nhớ `args`.
	1. Tính toán vị trí của từng tham số trong vùng nhớ `args` bằng các thông số trả về từ [`reflect.funcLayout`](https://draveness.me/golang/tree/reflect.funcLayout).
	2. Sao chép các tham số vào vùng nhớ tương ứng.

Chuẩn bị tham số là quá trình tính toán kích thước của các tham số và giá trị trả về và sao chép tất cả các tham số vào vị trí tương ứng trong vùng nhớ. Quá trình này sẽ xem xét sự khác biệt do hàm và phương thức, số lượng giá trị trả về và kiểu dữ liệu của các tham số gây ra.

### Gọi hàm

Sau khi đã chuẩn bị đầy đủ các tham số cần thiết cho cuộc gọi hàm, chúng ta sẽ thực hiện gọi con trỏ hàm. Chúng ta truyền vào con trỏ hàm, vùng nhớ args, kích thước ngăn xếp và vị trí của giá trị trả về:

```go
	call(frametype, fn, args, uint32(frametype.size), uint32(retOffset))
```

Phương thức trên thực tế không tồn tại, nó sẽ được liên kết với hàm [`reflect.reflectcall`](https://draveness.me/golang/tree/reflect.reflectcall) được viết bằng ngôn ngữ hợp ngữ trong quá trình biên dịch. Chúng ta không phân tích cụ thể cài đặt của hàm này ở đây, nhưng bạn đọc quan tâm có thể tự tìm hiểu.

### Xử lý giá trị trả về

Sau khi cuộc gọi hàm kết thúc, chúng ta bắt đầu xử lý giá trị trả về của hàm.

- Nếu hàm không có giá trị trả về, chúng ta sẽ xóa toàn bộ nội dung của vùng nhớ `args` để giải phóng bộ nhớ.
- Nếu hàm hiện tại có giá trị trả về.
	1. Xóa các vùng nhớ liên quan đến các tham số đầu vào trong `args`.
	2. Tạo một mảng `ret` có độ dài `nout` để lưu trữ các giá trị trả về được tạo thành từ các đối tượng reflect.
	3. Lấy kiểu và kích thước của giá trị trả về từ đối tượng hàm, sau đó chuyển đổi dữ liệu trong vùng nhớ args thành kiểu `reflect.Value` và lưu trữ vào mảng ret.

```go
	var ret []Value
	if nout == 0 {
		typedmemclr(frametype, args)
		framePool.Put(args)
	} else {
		typedmemclrpartial(frametype, args, 0, retOffset)
		ret = make([]Value, nout)
		off = retOffset
		for i := 0; i < nout; i++ {
			tv := t.Out(i)
			a := uintptr(tv.Align())
			off = (off + a - 1) &^ (a - 1)
			if tv.Size() != 0 {
				fl := flagIndir | flag(tv.Kind())
				ret[i] = Value{tv.common(), add(args, off, "tv.Size() != 0"), fl}
			} else {
				ret[i] = Zero(tv)
			}
			off += tv.Size()
		}
	}

	return ret
}
```

Mảng `ret` được tạo thành từ các đối tượng [`reflect.Value`](https://draveness.me/golang/tree/reflect.Value) sẽ được trả về cho bộ gọi. Đến đây, quá trình sử dụng `reflect` để gọi hàm kết thúc.

## Tóm tắt

Gói  [`reflect`](https://golang.org/pkg/reflect/) trong ngôn ngữ Go cung cấp cho chúng ta nhiều khả năng, bao gồm cách sử dụng phản chiếu để thay đổi biến động, kiểm tra xem một kiểu có thực hiện một số giao diện nào đó hay không và gọi phương thức động, và nhiều chức năng khác. Bằng cách phân tích nguyên lý của các phương thức trong gói `reflect`, chúng ta có thể hiểu được những hiện tượng trước đây có vẻ kỳ lạ và gây khó hiểu.
