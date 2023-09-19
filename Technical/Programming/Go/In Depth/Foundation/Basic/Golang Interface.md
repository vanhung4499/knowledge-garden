---
categories: 
title: Golang Interface
date created: 2023-07-01
date modified: 2023-09713-04
tags: [golang]
---

Trong ngôn ngữ Go, giao diện (interface) là một tập hợp các phương thức được định nghĩa, nó là một phần quan trọng của ngôn ngữ Go. Sử dụng giao diện giúp chúng ta viết mã dễ kiểm thử, tuy nhiên, rất nhiều kỹ sư hiện tại có kiến thức hạn chế về giao diện trong Go và không hiểu rõ về cơ chế triển khai giao diện, điều này gây trở ngại cho việc phát triển dịch vụ hiệu suất cao.

Phần này sẽ giới thiệu một số vấn đề phổ biến khi sử dụng giao diện và thiết kế và triển khai giao diện, bao gồm chuyển đổi kiểu giao diện, kiểm tra kiểu và cơ chế dynamic dispatch, giúp độc giả hiểu rõ hơn về kiểu giao diện.

## Tổng quan

Trong khoa học máy tính, giao diện là ranh giới chia sẻ giữa các thành phần trong hệ thống máy tính, các thành phần khác nhau có thể trao đổi thông tin trên ranh giới này. Như hình dưới đây, giao diện thực chất là một tầng trung gian mới, bên gọi có thể tách rời khỏi việc triển khai cụ thể, giải phóng sự ràng buộc giữa các tầng trên và dưới, các module ở tầng trên không cần phụ thuộc vào module cụ thể ở tầng dưới, chỉ cần phụ thuộc vào một giao diện đã được định nghĩa trước.  

![Pasted image 20230701110341](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230701110341.png)

Cách lập trình hướng đến giao diện này có sức mạnh rất lớn, chúng ta có thể thấy giao diện trong cả các framework và hệ điều hành. POSIX (Portable Operating System Interface) là một ví dụ điển hình, nó định nghĩa các giao diện chương trình ứng dụng và giao diện dòng lệnh chuẩn, mang lại tính di động cho phần mềm máy tính - chỉ cần hệ điều hành triển khai POSIX, phần mềm máy tính có thể chạy trực tiếp trên các hệ điều hành khác nhau.

Ngoài việc tách rời các thành phần có mối quan hệ phụ thuộc, giao diện còn giúp chúng ta ẩn đi triển khai cụ thể, giảm thiểu sự quan tâm. Trong "Structure and Interpretation of Computer Programs", có một câu nói như sau:

> Con người phải đọc được mã nhưng máy tính mới có thể thực thi

Con người chỉ có khả năng xử lý lượng thông tin hạn chế, việc định nghĩa giao diện tốt sẽ cô lập triển khai cụ thể, cho phép chúng ta tập trung vào đoạn mã hiện tại. SQL là một ví dụ về giao diện, khi chúng ta sử dụng câu lệnh SQL để truy vấn dữ liệu, thực tế không cần quan tâm đến triển khai cụ thể của cơ sở dữ liệu, chúng ta chỉ quan tâm xem kết quả trả về từ SQL có đúng như mong đợi hay không.

![Pasted image 20230701111152](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230701111152.png)

Giao diện trong khoa học máy tính là một khái niệm khá trừu tượng, nhưng trong ngôn ngữ lập trình, khái niệm giao diện cụ thể hơn. Trong ngôn ngữ Go, giao diện là một kiểu dữ liệu được tích hợp sẵn, nó định nghĩa một tập hợp các phương thức, phần này sẽ giới thiệu một số khái niệm cơ bản về giao diện trong ngôn ngữ Go và các vấn đề phổ biến, để chuẩn bị cho việc triển khai cơ chế giao diện sau này.

### Giao diện ẩn

Nhiều ngôn ngữ hướng đối tượng như Java và C# đều có khái niệm về giao diện (interface). Trong Java, giao diện không chỉ có thể định nghĩa các phương thức mà còn có thể định nghĩa biến, các biến này có thể được sử dụng trực tiếp trong các lớp triển khai giao diện. Dưới đây là một ví dụ đơn giản về giao diện trong Java:

```java
public interface MyInterface {
    public String hello = "Hello";
    public void sayHello();
}
```

Trong đoạn mã trên, chúng ta định nghĩa một phương thức `sayHello` và một biến `hello` cần phải được triển khai. Trong đoạn mã dưới đây, lớp `MyInterfaceImpl` triển khai giao diện `MyInterface`:

```java
public class MyInterfaceImpl implements MyInterface {
    public void sayHello() {
        System.out.println(MyInterface.hello);
    }
}
```

Trong Java, lớp phải khai báo rõ ràng rằng nó đang triển khai một giao diện như trên, nhưng trong Go, việc triển khai giao diện không cần phải sử dụng cách tiếp cận tương tự. Đầu tiên, chúng ta hãy tìm hiểu cách định nghĩa giao diện trong Go. Để định nghĩa một giao diện, chúng ta sử dụng từ khóa `interface`, trong giao diện, chúng ta chỉ có thể định nghĩa các phương thức, không thể chứa biến thành viên. Một giao diện phổ biến trong Go có thể được định nghĩa như sau:

```go
type error interface {
	Error() string
}
```

Nếu một kiểu dữ liệu cần phải triển khai giao diện `error`, thì nó chỉ cần triển khai phương thức `Error() string`. Cấu trúc `RPCError` dưới đây là một triển khai của giao diện `error`:

```go
type RPCError struct {
	Code    int64
	Message string
}

func (e *RPCError) Error() string {
	return fmt.Sprintf("%s, code=%d", e.Message, e.Code)
}
```

Bạn có thể nhận thấy rằng đoạn mã trên không có sự xuất hiện của giao diện `error`, điều này làm cho chúng ta tò mò. Tại sao lại như vậy? Why? Trong Go, việc triển khai giao diện là **ngầm định**, chúng ta chỉ cần triển khai phương thức `Error() string` là đã triển khai giao diện `error`. Cáchtriển khaiai giao diện trong Go hoàn toàn khác với Java:

- Trong Java: triển khai giao diện yêu cầu khai báo giao diện một cách rõ ràng và triển khai tất cả các phương thức.
- Trong Go: triển khai tất cả các phương thức của giao diện một cách ngầm định.

Khi sử dụng cấu trúc `RPCError` trên, chúng ta không quan tâm nó đã triển khai các giao diện nào, Go chỉ kiểm tra xem một kiểu cụ thể có triển khai giao diện nào không khi chúng ta truyền tham số, trả về giá trị hoặc gán giá trị cho một biến. Dưới đây là một số ví dụ để minh họa thời điểm kiểm tra kiểu giao diện:

```go
func main() {
	var rpcErr error = NewRPCError(400, "unknown err") // typecheck1
	err := AsErr(rpcErr) // typecheck2
	println(err)
}

func NewRPCError(code int64, msg string) error {
	return &RPCError{ // typecheck3
		Code:    code,
		Message: msg,
	}
}

func AsErr(err error) error {
	return err
}
```

Trong quá trình biên dịch, Go kiểm tra kiểu mã chỉ khi cần thiết. Đoạn mã trên tổng cộng kích hoạt ba lần kiểm tra kiểu:

1. Gán một biến kiểu `*RPCError` cho một biến `rpcErr` kiểu `error`
2. Truyền một biến kiểu `*RPCError` cho một hàm `AsErr` với đối số kiểu `error`
3. Trả về một biến kiểu `*RPCError` từ hàm `NewRPCError` với kiểu trả về là `error`

Từ quá trình kiểm tra kiểu, chúng ta có thể thấy rằng trình biên dịch chỉ kiểm tra kiểu khi cần thiết, khi một kiểu triển khai giao diện, chỉ cần triển khai tất cả các phương thức của giao diện, không cần phải khai báo rõ ràng như trong các ngôn ngữ lập trình khác như Java.

### Kiểu

Giao diện (interface) cũng là một kiểu dữ liệu trong ngôn ngữ Go, nó có thể xuất hiện trong việc định nghĩa biến, tham số và giá trị trả về của các hàm và có thể áp dụng các ràng buộc cho chúng. Tuy nhiên, trong Go có hai loại giao diện hơi khác nhau, một loại là giao diện với một tập hợp các phương thức và loại khác là `interface{}` không chứa bất kỳ phương thức nào:

![Pasted image 20230701135225](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230701135225.png)

Trong Go, [`runtime.iface`](https://draveness.me/golang/tree/runtime.iface) được sử dụng để biểu diễn giao diện với tập hợp các phương thức, và [`runtime.eface`](https://draveness.me/golang/tree/runtime.eface) được sử dụng để biểu diễn giao diện `interface{}` không chứa bất kỳ phương thức nào. Mặc dù cả hai đều được khai báo bằng từ khóa `interface`, nhưng vì giao diện `interface{}` rất phổ biến trong Go, nên sử dụng một loại đặc biệt trong quá trình triển khai.

Cần lưu ý rằng, khác với `void *` trong ngôn ngữ C, kiểu `interface{}` **không phải là kiểu bất kì**. Nếu chúng ta chuyển đổi kiểu thành `interface{}`, kiểu của biến cũng sẽ thay đổi trong quá trình chạy, và khi truy cập kiểu của biến, chúng ta sẽ nhận được `interface{}`.

```go
package main

func main() {
	type Test struct{}
	v := Test{}
	Print(v)
}

func Print(v interface{}) {
	println(v)
}
```

Trong đoạn mã trên, hàm không chấp nhận bất kỳ kiểu dữ liệu nào, chỉ chấp nhận giá trị kiểu `interface{}`. Khi gọi hàm `Print`, tham số `v` sẽ được chuyển đổi kiểu, từ kiểu `Test` ban đầu sang kiểu `interface{}`. Chúng ta sẽ tìm hiểu cách triển khai chuyển đổi kiểu sau.

### Con trỏ và giao diện

Trong Go, khi sử dụng cùng lúc con trỏ và giao diện, có một số vấn đề gây khó hiểu. Giao diện không giới hạn việc triển khai bởi bộ nhận (reciever), do đó chúng ta có thể thấy một phương thức được triển khai bằng hai cách khác nhau:

![Pasted image 20230701142246](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230701142246.png)

Điều này xảy ra vì cấu trúc và con trỏ là hai loại dữ liệu khác nhau. Tương tự như việc chúng ta không thể truyền một cấu trúc vào một hàm chấp nhận con trỏ, trong việc triển khai giao diện, hai loại này cũng không thể được coi là tương đương. Mặc dù hai loại này khác nhau, nhưng hai cách triển khai trong hình trên không thể tồn tại cùng một lúc, trình biên dịch Go sẽ báo lỗi "method redeclared" khi một phương thức được triển khai bởi cả cấu trúc và con trỏ.

Đối với cấu trúc Cat, nó có thể chọn kiểu nhận khi triển khai giao diện, cấu trúc hoặc con trỏ cấu trúc, và cũng có thể khởi tạo dưới dạng cấu trúc hoặc con trỏ. Đoạn mã dưới đây tóm tắt cách sử dụng cấu trúc và con trỏ cấu trúc để triển khai giao diện và cách sử dụng cấu trúc và con trỏ cấu trúc để khởi tạo biến.

```go
type Cat struct {}
type Duck interface { ... }

func (c  Cat) Quack {}  // Triển khai giao diện bằng cấu trúc
func (c *Cat) Quack {}  // Triển khai giao diện bằng con trỏ cấu trúc

var d Duck = Cat{}      // Khởi tạo biến bằng cấu trúc
var d Duck = &Cat{}     // Khởi tạo biến bằng con trỏ cấu trúc
```

Có tổng cộng bốn trường hợp khi triển khai giao diện và khởi tạo biến, tuy nhiên, không phải trường hợp nào cũng được kiểm tra bởi trình biên dịch:

| |  Triển khai giao diện bằng cấu trúc | Triển khai giao diện bằng con trỏ cấu trúc  |
|:---:|:---:|:---:|
| Khởi tạo biến bằng cấu trúc | Vượt qua | Thất bại |
| Khởi tạo biến bằng con trỏ cấu trúc | Vượt qua | Vượt qua |

Chỉ có trường hợp sử dụng con trỏ để triển khai giao diện và khởi tạo biến bằng con trỏ mới không thể vượt qua kiểm tra của trình biên dịch. Ba trường hợp còn lại đều có thể triển khai một cách bình thường. Khi kiểu triển khai giao diện giống với kiểu được trả về khi biến được khởi tạo, mã sẽ biên dịch bình thường:

- Cả bộ nhận phương thức và kiểu khởi tạo đều là cấu trúc;
- Kiểu bộ nhận và khởi tạo phương thức đều là con trỏ cấu trúc;

Tại sao một trường hợp có thể thông qua kiểm tra và một trường hợp không thể thông qua kiểm tra? Trước tiên chúng ta hãy xem tình huống có thể vượt qua kiểm tra của trình biên dịch: bộ nhận phương thức là một cấu trúc và biến được khởi tạo là một con trỏ cấu trúc:

```go
type Cat struct{}

func (c Cat) Quack() {
	fmt.Println("meow")
}

func main() {
	var c Duck = &Cat{}
	c.Quack()
}
```

Biến được coi là một con trỏ `&Cat{}` có thể ngầm định nhận được địa chỉ của cấu trúc mà nó trỏ đến, do đó có thể gọi các phương thức `Walk` và `Quack` trên cấu trúc. Chúng ta có thể hiểu cách gọi này tương tự như `d->Walk()` và `d->Speak()` trong ngôn ngữ C, nghĩa là trước tiên lấy địa chỉ của cấu trúc mà con trỏ trỏ đến, sau đó triển khai phương thức tương ứng.

Tuy nhiên, nếu chúng ta hoán đổi bộ nhận phương thức và kiểu khởi tạo trong đoạn mã trên, mã sẽ không thể vượt qua quá trình biên dịch:

```go
type Duck interface {
	Quack()
}

type Cat struct{}

func (c *Cat) Quack() {
	fmt.Println("meow")
}

func main() {
	var c Duck = Cat{}
	c.Quack()
}
```

```bash
$ go build interface.go
./interface.go:20:6: cannot use Cat literal (type Cat) as type Duck in assignment:
	Cat does not implement Duck (Quack method has pointer receiver)
```

Trình biên dịch sẽ cảnh báo rằng kiểu `Cat` không triển khai giao diện `Duck`, và bộ nhận phương thức `Quack` là một con trỏ. Hai thông báo lỗi này khá khó hiểu đối với những người mới tiếp xúc với Go. Để hiểu rõ vấn đề này, trước tiên chúng ta cần biết rằng trong Go, khi truyền tham số, tham số được truyền bằng giá trị.

![Pasted image 20230701151827](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230701151827.png)

Như hình trên, trong đoạn mã trên, dù biến `c` được khởi tạo là kiểu `Cat{}` hay `&Cat{}`, khi gọi `c.Quack()`, giá trị sẽ được sao chép:

- Trong trường hợp `&Cat{}`, điều này có nghĩa là sao chép một con trỏ `&Cat{}` mới, con trỏ này trỏ đến cùng một cấu trúc và chỉ định duy nhất. Do đó, trình biên dịch có thể ngầm định giải tham chiếu biến (dereference) để truy cập cấu trúc mà con trỏ đang trỏ đến.
- Trong trường hợp `Cat{}`, điều này có nghĩa là phương thức `Quack()` sẽ nhận một `Cat{}` hoàn toàn mới. Vì phương thức có bộ nhận là `*Cat`, trình biên dịch sẽ không tạo ra một con trỏ mới. Ngay cả khi trình biên dịch có thể tạo ra một con trỏ mới, con trỏ này cũng không trỏ đến cấu trúc ban đầu mà gọi phương thức.

Phân tích trên giải thích hiện tượng với kiểu con trỏ. Khi chúng ta sử dụng con trỏ để triển khai giao diện, chỉ có biến con trỏ mới có thể thực thi giao diện. Khi chúng ta sử dụng cấu trúc để triển khai giao diện, cả con trỏ và cấu trúc đều có thể thực thi giao diện. Tuy nhiên, điều này không có nghĩa là chúng ta nên luôn sử dụng cấu trúc để triển khai giao diện. Vấn đề này không quan trọng trong thực tế, ở đây chúng ta chỉ muốn giải thích nguyên tắc đằng sau hiện tượng này.

### nil vs non-nil

Chúng ta có thể hiểu câu **`interface{}` không phải là kiểu bất kì** trong Go thông qua một ví dụ. Trong đoạn mã dưới đây, biến `s` được khởi tạo trong hàm `main` với kiểu `*TestStruct`, và vì giá trị mặc định của con trỏ là `nil`, biến s sau khi được khởi tạo cũng là `nil`:

```go
package main

type TestStruct struct{}

func NilOrNot(v interface{}) bool {
	return v == nil
}

func main() {
	var s *TestStruct
	fmt.Println(s == nil)      // #=> true
	fmt.Println(NilOrNot(s))   // #=> false
}
```

```bash
$ go run main.go
true
false
```

Chúng ta có thể tóm tắt kết quả thực thi của đoạn mã trên như sau:

- So sánh biến trên với `nil` sẽ trả về `true`.
- Truyền biến trên vào hàm `NilOrNot` và so sánh với `nil` sẽ trả về `false`

Nguyên nhân của hiện tượng trên là do sự chuyển đổi kiểu ngầm định xảy ra khi gọi hàm `NilOrNot`, ngoài việc truyền tham số vào phương thức, việc gán giá trị cho biến cũng sẽ kích hoạt sự chuyển đổi kiểu ngầm định. Trong quá trình chuyển đổi kiểu, kiểu `*TestStruct` sẽ được chuyển đổi thành kiểu `interface{}`, biến sau khi chuyển đổi không chỉ chứa giá trị ban đầu mà còn chứa thông tin về kiểu dữ liệu `TestStruct`, do đó biến sau khi chuyển đổi không bằng `nil`.

## Cấu trúc dữ liệu

Tôi tin rằng bạn đọc đã có một số hiểu biết về giao diện trong ngôn ngữ Go, tiếp theo chúng ta sẽ giới thiệu cấu trúc dữ liệu của giao diện ở mức độ mã nguồn và chỉ thị hợp ngữ.

Ngôn ngữ Go chia kiểu giao diện thành hai loại dựa trên việc giao diện có chứa một tập hợp các phương thức hay không:

- Sử dụng cấu trúc  [`runtime.iface`](https://draveness.me/golang/tree/runtime.iface) để biểu diễn giao diện chứa các phương thức.
- Sử dụng cấu trúc [`runtime.eface`](https://draveness.me/golang/tree/runtime.eface) để biểu diễn kiểu `interface{}` không chứa bất kỳ phương thức nào.

Cấu trúc [`runtime.eface`](https://draveness.me/golang/tree/runtime.eface) được định nghĩa trong Go như sau:

```go
type eface struct { // 16 byte
	_type *_type
	data  unsafe.Pointer
}
```

Vì kiểu `interface{}` không chứa bất kỳ phương thức nào, nên cấu trúc của nó cũng đơn giản hơn, chỉ chứa hai con trỏ trỏ đến dữ liệu và kiểu dữ liệu. Từ cấu trúc trên, chúng ta cũng có thể suy ra rằng - bất kỳ kiểu dữ liệu nào trong Go cũng có thể chuyển đổi thành `interface{}`.

Cấu trúc khác để biểu diễn giao diện là [`runtime.iface`](https://draveness.me/golang/tree/runtime.iface), cấu trúc này có con trỏ `data` trỏ đến dữ liệu gốc, nhưng quan trọng hơn là trường `tab` có kiểu  [`runtime.itab`](https://draveness.me/golang/tree/runtime.itab).

```go
type iface struct { // 16 byte
	tab  *itab
	data unsafe.Pointer
}
```

Tiếp theo chúng ta sẽ phân tích chi tiết hai kiểu này trong giao diện ngôn ngữ Go, đó là [`runtime._type`](https://draveness.me/golang/tree/runtime._type)và [`runtime.itab`](https://draveness.me/golang/tree/runtime.itab).

### Cấu trúc type

[`runtime._type`](https://draveness.me/golang/tree/runtime._type) là biểu diễn trong runtime của kiểu trong ngôn ngữ Go. Dưới đây là cấu trúc `_type` trong gói runtime, nó chứa nhiều thông tin về kiểu như kích thước, băm, căn chỉnh và kiểu.

```go
type _type struct {
	size       uintptr
	ptrdata    uintptr
	hash       uint32
	tflag      tflag
	align      uint8
	fieldAlign uint8
	kind       uint8
	equal      func(unsafe.Pointer, unsafe.Pointer) bool
	gcdata     *byte
	str        nameOff
	ptrToThis  typeOff
}
```

- Trường `size` lưu trữ kích thước của kiểu, cung cấp thông tin cho việc phân bổ bộ nhớ
- Trường `hash` giúp chúng ta xác định nhanh xem hai kiểu có bằng nhau hay không
- Trường `equal` được sử dụng để xác định xem nhiều đối tượng của kiểu hiện tại có bằng nhau hay không, trường này đã được chuyển từ cấu trúc `typeAlg` để giảm kích thước gói nhị phân Go

Chúng ta chỉ cần có một cái nhìn tổng quan về các trường trong cấu trúc [`runtime._type`](https://draveness.me/golang/tree/runtime._type), không cần hiểu rõ ý nghĩa và tác dụng của tất cả các trường.

### Cấu trúc itab

[`runtime.itab`](https://draveness.me/golang/tree/runtime.itab) là một phần quan trọng của kiểu giao diện, mỗi [`runtime.itab`](https://draveness.me/golang/tree/runtime.itab) chiếm 32 byte, chúng ta có thể coi nó là sự kết hợp giữa kiểu giao diện và kiểu cụ thể, chúng được biểu diễn bằng hai trường `inter` và `_type`:

```go
type itab struct { // 32 byte
	inter *interfacetype
	_type *_type
	hash  uint32
	_     [4]byte
	fun   [1]uintptr
}
```

Ngoài hai trường `inter` và `_type` để biểu diễn kiểu, hai trường khác trong cấu trúc trên cũng có vai trò của riêng chúng:

- `hash` là bản sao của `_type.hash`, khi chúng ta muốn chuyển đổi kiểu giao diện thành kiểu cụ thể, chúng ta có thể sử dụng trường này để nhanh chóng kiểm tra xem kiểu mục tiêu và kiểu cụ thể [`runtime._type`](https://draveness.me/golang/tree/runtime._type) có giống nhau hay không.
- `fun` là một mảng có kích thước động, nó là một bảng hàm ảo được sử dụng để dynamic dispatch, lưu trữ một tập hợp các con trỏ hàm. Mặc dù biến này được khai báo là một mảng có kích thước cố định, nhưng khi sử dụng, chúng ta sẽ lấy dữ liệu từ con trỏ gốc, vì vậy số lượng phần tử được lưu trữ trong mảng fun là không xác định

Chúng ta sẽ giới thiệu việc sử dụng trường `hash` trong kiểm tra kiểu, và cách các con trỏ hàm được lưu trữ trong mảng `fun` được sử dụng trong dynamic dispatch.

## Chuyển đổi kiểu

Bây giờ chúng ta sẽ tìm hiểu cách khởi tạo và truyền giao diện thông qua một số ví dụ để hiểu sâu hơn. Chương này sẽ giới thiệu sự khác biệt giữa việc sử dụng kiểu con trỏ và kiểu cấu trúc khi triển khai giao diện. Hai cách triển khai giao diện khác nhau này sẽ dẫn đến việc trình biên dịch Go tạo mã hợp ngữ khác nhau, từ đó ảnh hưởng đến quá trình xử lý cuối cùng.

### Kiểu con trỏ

Trước tiên, chúng ta quay lại ví dụ về giao diện `Duck` ở đầu chương, chúng ta sử dụng chỉ thị `//go:noinline` để ngăn việc biên dịch nội tuyến của phương thức `Quack()`:

```go
package main

type Duck interface {
	Quack()
}

type Cat struct {
	Name string
}

//go:noinline
func (c *Cat) Quack() {
	println(c.Name + " meow")
}

func main() {
	var c Duck = &Cat{Name: "draven"}
	c.Quack()
}
```

Chúng ta sử dụng trình biên dịch để biên dịch mã nguồn trên thành mã hợp ngữ, loại bỏ một số chỉ thị không cần thiết để hiểu nguyên lý giao diện và giữ lại mã liên quan đến câu lệnh gán `var c Duck = &Cat{Name: "draven"}`. Ở đây, chúng ta sẽ phân tích các phần mã hợp ngữ được tạo ra thành ba phần để phân tích:

1. Khởi tạo cấu trúc `Cat`.
2. Quá trình chuyển đổi kiểu được kích hoạt bởi câu lệnh gán.
3. Gọi phương thức `Quack()` của giao diện.

Chúng ta hãy phân tích quá trình khởi tạo cấu trúc `Cat` đầu tiên:

```go
LEAQ	type."".Cat(SB), AX                ;; AX = &type."".Cat
MOVQ	AX, (SP)                           ;; SP = &type."".Cat
CALL	runtime.newobject(SB)              ;; SP + 8 = &Cat{}
MOVQ	8(SP), DI                          ;; DI = &Cat{}
MOVQ	$6, 8(DI)                          ;; StringHeader(DI.Name).Len = 6
LEAQ	go.string."draven"(SB), AX         ;; AX = &"draven"
MOVQ	AX, (DI)                           ;; StringHeader(DI.Name).Data = &"draven"
```

1. Lấy con trỏ kiểu cấu trúc `Cat` và đặt nó vào ngăn xếp làm tham số.
2. Gọi hàm [`runtime.newobject`](https://draveness.me/golang/tree/runtime.newobject) bằng `CALL` , hàm này sẽ sử dụng con trỏ kiểu cấu trúc `Cat` làm tham số đầu vào, cấp phát một không gian bộ nhớ mới và trả lại con trỏ cho không gian bộ nhớ này về SP+8.
3. SP+8 hiện lưu trữ một con trỏ tới cấu trúc `Cat`, sao chép con trỏ trên ngăn xếp vào thanh ghi `DI` để dễ thao tác.
4. Vì `Cat` chỉ chứa một biến kiểu chuỗi `Name`, nên địa chỉ chuỗi  `&"draven"` và độ dài chuỗi `6` sẽ được đặt vào cấu trúc. Ba chỉ thị hợp ngữ cuối cùng tương đương với `cat.Name = "draven"`;

Biểu diễn của một chuỗi trong runtime là một con trỏ cộng với độ dài của chuỗi Trong chương trước, [[Golang String]] đã giới thiệu các nguyên tắc triển khai và biểu diễn cơ bản của nó, nhưng ở đây chúng ta cần xem xét biểu diễn của cấu trúc `Cat` trong bộ nhớ:

![Pasted image 20230701173430](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230701173430.png)

Vì cấu trúc `Cat` chỉ chứa một chuỗi, và trong Go, mỗi chuỗi chiếm 16 byte, nên kích thước của mỗi cấu trúc `Cat` là 16 byte. Sau khi khởi tạo cấu trúc `Cat`, chúng ta sẽ tiếp tục quá trình chuyển đổi từ `*Cat` sang kiểu `Duck`:

```go
LEAQ	go.itab.*"".Cat,"".Duck(SB), AX    ;; AX = *itab(go.itab.*"".Cat,"".Duck)
MOVQ	DI, (SP)                           ;; SP = AX
```

Quá trình chuyển đổi khá đơn giản, `Duck` là một giao diện chứa các phương thức, và nó được biểu diễn bằng cấu trúc [`runtime.iface`](https://draveness.me/golang/tree/runtime.iface) ở mức dưới. Cấu trúc [`runtime.iface`](https://draveness.me/golang/tree/runtime.iface) bao gồm hai trường, một là con trỏ đến dữ liệu và một là trường tab để biểu diễn mối quan hệ giữa giao diện và cấu trúc. Chúng ta đã khởi tạo con trỏ cấu trúc `Cat` ở SP+8, và mã này chỉ đơn giản là sao chép con trỏ [`runtime.itab`](https://draveness.me/golang/tree/runtime.itab) được tạo ra trong quá trình biên dịch vào SP:

![Pasted image 20230701185332](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230701185332.png)

Tại thời điểm này, chúng ta sẽ thấy rằng SP ~ SP+16 cùng nhau tạo thành cấu trúc [`runtime.iface`](https://draveness.me/golang/tree/runtime.iface) và chính [`runtime.iface`](https://draveness.me/golang/tree/runtime.iface) này trên ngăn xếp là tham số đầu vào đầu tiên của phương thức `Quack`.

```go
CALL    "".(*Cat).Quack(SB)                ;; SP.Quack()
```

Đoạn mã trên sẽ triển khai gọi phương thức trực tiếp thông qua chỉ thị `CALL`, và bạn có thể nhận ra một vấn đề: Tại sao chúng ta gọi `Duck.Quack` trong mã nguồn nhưng mã hợp ngữ được tạo ra lại là `*Cat.Quack`?

Điều này là do trình biên dịch Go sẽ tối ưu hóa một số cuộc gọi phương thức động bằng cách thay thế chúng bằng cuộc gọi trực tiếp đến phương thức mục tiêu, nhằm giảm thiểu các chi phí hiệu năng bổ sung. Nếu chúng ta vô hiệu hóa tối ưu hóa của trình biên dịch, chúng ta sẽ thấy quá trình gọi phương thức động, và chúng ta sẽ phân tích quá trình gọi phương thức động và các chi phí hiệu năng bổ sung trong các phần tiếp theo.

### Kiểu cấu trúc

Đến đây chúng ta tiếp tục sửa code ở phần trước, sử dụng kiểu cấu trúc để hiện thực giao diện `Duck` và khởi tạo biến kiểu cấu trúc:

```go
package main

type Duck interface {
	Quack()
}

type Cat struct {
	Name string
}

//go:noinline
func (c Cat) Quack() {
	println(c.Name + " meow")
}

func main() {
	var c Duck = Cat{Name: "draven"}
	c.Quack()
}
```

Nếu chúng ta khởi tạo biến bằng kiểu con trỏ `&Cat{Name: "draven"}`, mã nguồn vẫn có thể được biên dịch và tạo ra mã hợp ngữ tương tự như trong phần trước, vì vậy ở đây chúng ta sẽ không phân tích trường hợp này.

Khi biên dịch mã nguồn trên, chúng ta sẽ thu được các mã hợp ngữ như sau. Để dễ hiểu và phân tích, các mã hợp ngữ đã được rút gọn, nhưng không ảnh hưởng đến quá trình thực thi cụ thể. Tương tự như phần trước, chúng ta sẽ chia quá trình thực thi mã hợp ngữ thành các phần sau:

1. Khởi tạo cấu trúc `Cat`
2. Hoàn thành quá trình chuyển đổi từ `Cat` sang kiểu `Duck`
3. Gọi phương thức `Quack` của giao diện

Trước tiên, chúng ta sẽ xem xét phần mã hợp ngữ được sử dụng để khởi tạo cấu trúc `Cat`:

```go
XORPS   X0, X0                          ;; X0 = 0
MOVUPS  X0, ""..autotmp_1+32(SP)        ;; StringHeader(SP+32).Data = 0
LEAQ    go.string."draven"(SB), AX      ;; AX = &"draven"
MOVQ    AX, ""..autotmp_1+32(SP)        ;; StringHeader(SP+32).Data = AX
MOVQ    $6, ""..autotmp_1+40(SP)        ;; StringHeader(SP+32).Len = 6
```

Đoạn mã hợp ngữ này sẽ khởi tạo cấu trúc `Cat` trên ngăn xếp, trong khi mã nguồn trong phần trước đã cấp phát 16 byte bộ nhớ trên heap cho cấu trúc Cat. Trên ngăn xếp chỉ có một con trỏ trỏ đến cấu trúc `Cat`.

Sau khi khởi tạo cấu trúc, chúng ta tiếp tục vào giai đoạn chuyển đổi kiểu, trình biên dịch sẽ truyền địa chỉ của `go.itab."".Cat,"".Duck` và con trỏ trỏ đến cấu trúc Cat `vào` dưới dạng tham số vào hàm [`runtime.convT2I`](https://draveness.me/golang/tree/runtime.convT2I):

```go
LEAQ	go.itab."".Cat,"".Duck(SB), AX     ;; AX = &(go.itab."".Cat,"".Duck)
MOVQ	AX, (SP)                           ;; SP = AX
LEAQ	""..autotmp_1+32(SP), AX           ;; AX = &(SP+32) = &Cat{Name: "draven"}
MOVQ	AX, 8(SP)                          ;; SP + 8 = AX
CALL	runtime.convT2I(SB)                ;; runtime.convT2I(SP, SP+8)
```

Hàm này sẽ lấy thông tin về `go.itab` từ `runtime.itab` và cấp phát một vùng nhớ dựa trên kích thước của kiểu, sau đó sao chép nội dung của con trỏ `elem` vào vùng nhớ đích:

```go
func convT2I(tab *itab, elem unsafe.Pointer) (i iface) {
	t := tab._type
	x := mallocgc(t.size, t, true)
	typedmemmove(t, x, elem)
	i.tab = tab
	i.data = x
	return
}
```

Hàm [`runtime.convT2I`](https://draveness.me/golang/tree/runtime.convT2I) sẽ trả về một [`runtime.iface`](https://draveness.me/golang/tree/runtime.iface), bao gồm con trỏ đến [`runtime.iface`](https://draveness.me/golang/tree/runtime.iface), và biến `Cat`. Sau khi hàm trả về, trên ngăn xếp của hàm `main` sẽ chứa các giá trị sau:

![Pasted image 20230701194308](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230701194308.png)

Các giá trị [`runtime.itab`](https://draveness.me/golang/tree/runtime.itab) và con trỏ `Cat` được lưu trữ trong SP và SP+8 là các tham số đầu vào của hàm [`runtime.convT2I`](https://draveness.me/golang/tree/runtime.convT2I). Giá trị trả về của hàm này, một [`runtime.iface`](https://draveness.me/golang/tree/runtime.iface) có kích thước 16 byte, được lưu trữ tại SP+16. SP+32 chứa con trỏ cấu trúc Cat trên ngăn xếp, nó sẽ được sao chép vào heap trong quá trình thực thi hàm [`runtime.convT2I`](https://draveness.me/golang/tree/runtime.convT2I).

Cuối cùng, chúng ta sẽ gọi phương thức `Quack()` của giao diện được triển khai bởi cấu trúc `Cat` bằng các chỉ thị sau:

```go
MOVQ	16(SP), AX ;; AX = &(go.itab."".Cat,"".Duck)
MOVQ	24(SP), CX ;; CX = &Cat{Name: "draven"}
MOVQ	24(AX), AX ;; AX = AX.fun[0] = Cat.Quack
MOVQ	CX, (SP)   ;; SP = CX
CALL	AX         ;; CX.Quack()
```

Các chỉ thị hợp ngữ này rất dễ hiểu. `MOVQ 24(AX), AX` là chỉ thị quan trọng nhất, nó lấy con trỏ của phương thức `Cat.Quack` từ cấu trúc `runtime.itab` để sử dụng làm đối số cho chỉ thị `CALL`. Byte thứ 24 của biến giao diện chứa vị trí bắt đầu của mảng `itab.fun`, và vì Duck chỉ chứa một phương thức, nên `itab.fun[0]` chứa con trỏ đến phương thức `Quack`.

## Kiểm tra kiểu

Trong phần này, chúng ta sẽ tìm hiểu cách chuyển đổi một kiểu giao diện thành một kiểu cụ thể. Chúng ta sẽ xem xét hai trường hợp dựa trên việc giao diện có chứa phương thức hay không.

### Giao diện không rỗng

Đầu tiên, chúng ta sẽ phân tích trường hợp giao diện chứa phương thức. Giao diện `Duck` là một giao diện không rỗng, chúng ta sẽ phân tích quá trình chuyển đổi từ `Duck` thành cấu trúc `Cat`:

```go
func main() {
	var c Duck = &Cat{Name: "draven"}
	switch c.(type) {
	case *Cat:
		cat := c.(*Cat)
		cat.Quack()
	}
}
```

Chúng ta sẽ phân tích mã hợp ngữ thành hai phần: phần khởi tạo biến và phần kiểm tra kiểu. Phần mã hợp ngữ khởi tạo biến như sau:

```go
00000 TEXT	"".main(SB), ABIInternal, $32-0
...
00029 XORPS	X0, X0
00032 MOVUPS	X0, ""..autotmp_4+8(SP)
00037 LEAQ	go.string."draven"(SB), AX
00044 MOVQ	AX, ""..autotmp_4+8(SP)
00049 MOVQ	$6, ""..autotmp_4+16(SP)
```

0037 ~ 0049 là ba chỉ thị để khởi tạo biến `Duck`, khởi tạo cấu trúc `Cat` được triển khai từ SP+8 đến SP+24. Do trình biên dịch Go đã tối ưu mã, nên không có quá trình xây dựng [`runtime.iface`](https://draveness.me/golang/tree/runtime.iface) trong mã nguồn, nhưng điều này không ảnh hưởng nhiều đến quá trình kiểm tra kiểu và chuyển đổi. Bây giờ chúng ta sẽ tiếp tục vào phần chuyển đổi kiểu:

```go
00058 CMPL  go.itab.*"".Cat,"".Duck+16(SB), $593696792
                                        ;; if (c.tab.hash != 593696792) {
00068 JEQ   80                          ;;
00070 MOVQ  24(SP), BP                  ;;      BP = SP+24
00075 ADDQ  $32, SP                     ;;      SP += 32
00079 RET                               ;;      return
                                        ;; } else {
00080 LEAQ  ""..autotmp_4+8(SP), AX     ;;      AX = &Cat{Name: "draven"}
00085 MOVQ  AX, (SP)                    ;;      SP = AX
00089 CALL  "".(*Cat).Quack(SB)         ;;      SP.Quack()
00094 JMP   70                          ;;      ...
                                        ;;      BP = SP+24
                                        ;;      SP += 32
                                        ;;      return
                                        ;; }
```

Câu lệnh switch sẽ tạo ra các chỉ thị hợp ngữ để so sánh giá trị `hash` của kiểu mục tiêu với giá trị `itab.hash` trong biến giao diện:

- Nếu hai giá trị bằng nhau, có nghĩa là kiểu cụ thể của biến là `Cat`, chúng ta sẽ nhảy đến nhánh tại địa chỉ 0080 để hoàn thành quá trình chuyển đổi kiểu.
	 1. Lấy con trỏ cấu trúc `Cat` được lưu trữ tại SP+8.
	 2. Sao chép con trỏ cấu trúc vào đỉnh ngăn xếp.
	 3. Gọi phương thức `Quack`.
	 4. Khôi phục ngăn xếp và trở về.
- Nếu kiểu cụ thể trong biến giao diện không phải là `Cat`, chúng ta sẽ khôi phục ngăn xếp và trở về ngay lập tức.

![Pasted image 20230701200639](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230701200639.png)

Trong hình trên, chúng ta có thể thấy tình trạng của ngăn xếp khi gọi phương thức `Quack`, trong đó cấu trúc `Cat` được lưu trữ từ SP+8 ~ SP+24, và con trỏ `Cat` được lưu trữ trên đỉnh ngăn xếp và trỏ đến cấu trúc đã nêu trên.

### Giao diện rỗng

Khi chúng ta sử dụng giao diện trống `interface{}` để kiểm tra kiểu, nếu không tắt tùy chọn tối ưu hóa của trình biên dịch Go, các chỉ thị hợp ngữ được tạo ra sẽ tương tự. Trình biên dịch sẽ bỏ qua quá trình chuyển đổi cấu trúc `Cat` thành [`runtime.eface`](https://draveness.me/golang/tree/runtime.eface):

```go
func main() {
	var c interface{} = &Cat{Name: "draven"}
	switch c.(type) {
	case *Cat:
		cat := c.(*Cat)
		cat.Quack()
	}
}
```

Nếu tắt tùy chọn tối ưu hóa của trình biên dịch, mã hợp ngữ được tạo ra trong quá trình kiểm tra kiểu sẽ không trực tiếp lấy thông tin về kiểu cụ thể từ biến, mà sẽ lấy từ `eface._type`. Tuy nhiên, các chỉ thị hợp ngữ vẫn sẽ sử dụng giá trị `hash` của kiểu mục tiêu để so sánh với kiểu của biến.

## Dynamic dispatch

Dynamic dispatch là quá trình chọn triển khai hoạt động đa hình cụ thể (phương thức hoặc hàm) trong quá trình chạy, nó là một tính năng phổ biến trong ngôn ngữ hướng đối tượng. Mặc dù Go không phải là ngôn ngữ hướng đối tượng theo nghĩa chính xác, nhưng việc giới thiệu giao diện đã mang đến cho nó tính năng dynamic dispatch này. Khi gọi phương thức của một kiểu giao diện, nếu không thể xác định kiểu giao diện trong quá trình biên dịch, Go sẽ quyết định trong quá trình chạy kiểu cụ thể nào được gọi.

Trong đoạn mã dưới đây, hàm `main` gọi phương thức `Quack` hai lần:

- Lần đầu tiên gọi với kiểu giao diện `Duck`, cần thông qua dynamic dispatch trong quá trình chạy
- Lần thứ hai gọi với kiểu cụ thể `*Cat`, trình biên dịch sẽ xác định hàm cụ thể được gọi:

```go
func main() {
	var c Duck = &Cat{Name: "draven"}
	c.Quack()
	c.(*Cat).Quack()
}
```

Do tối ưu hóa của trình biên dịch ảnh hưởng đến việc hiểu các chỉ thị gốc, nên cần sử dụng cờ biên dịch `-N` để tắt tối ưu hóa. Nếu không chỉ định cờ này, trình biên dịch sẽ viết lại mã, có một số sai lệch so với quá trình thực thi ban đầu, ví dụ:

- Vì tham số `tab` trong kiểu giao diện không được sử dụng, nên quá trình tối ưu hóa bỏ qua quá trình chuyển đổi từ `Cat` sang `Duck`.
- Vì kiểu cụ thể của biến đã được xác định, nên nhánh có thể gây ra sự sụp đổ khi chuyển đổi từ kiểu giao diện `Duck` sang kiểu cụ thể `*Cat` được loại bỏ.
- …

Trước khi phân tích cách gọi phương thức `Quack` theo hai cách khác nhau, chúng ta cần hiểu cách `Cat` được khởi tạo và dữ liệu nằm trên ngăn xếp sau khi khởi tạo:

```go
LEAQ	type."".Cat(SB), AX
MOVQ	AX, (SP)
CALL	runtime.newobject(SB)              ;; SP + 8 = new(Cat)
MOVQ	8(SP), DI                          ;; DI = SP + 8
MOVQ	DI, ""..autotmp_2+32(SP)           ;; SP + 32 = DI
MOVQ	$6, 8(DI)                          ;; StringHeader(cat).Len = 6
LEAQ	go.string."draven"(SB), AX         ;; AX = &"draven"
MOVQ	AX, (DI)                           ;; StringHeader(cat).Data = AX
MOVQ	""..autotmp_2+32(SP), AX           ;; AX = &Cat{...}
MOVQ	AX, ""..autotmp_1+40(SP)           ;; SP + 40 = &Cat{...}
LEAQ	go.itab.*"".Cat,"".Duck(SB), CX    ;; CX = &go.itab.*"".Cat,"".Duck
MOVQ	CX, "".c+48(SP)                    ;; iface(c).tab = SP + 48 = CX
MOVQ	AX, "".c+56(SP)                    ;; iface(c).data = SP + 56 = AX
```

Quá trình khởi tạo mã này thực tế không khác biệt quá nhiều so với quá trình trong hai phần trước, nó trước tiên khởi tạo con trỏ của cấu trúc `Cat`, sau đó đóng gói `Cat` và `tab` thành một cấu trúc [`runtime.iface`](https://draveness.me/golang/tree/runtime.iface). Chúng ta hãy xem xét tình trạng ngăn xếp sau khi khởi tạo:

![Pasted image 20230701204256](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230701204256.png)

- SP là kiểu `Cat` và cũng là đối số của phương thức `runtime.newobject`
- SP+8 là giá trị trả về của phương thức [`runtime.newobject`](https://draveness.me/golang/tree/runtime.newobject), tức là con trỏ đến cấu trúc Cat trên heap.
- SP+32, SP+40 là bản sao của SP+8, hai con trỏ này đều trỏ đến cấu trúc `Cat` trên heap.
- SP+48 ~ SP+64 là cấu trúc biến giao diện  [`runtime.iface`](https://draveness.me/golang/tree/runtime.iface), bao gồm con trỏ cấu trúc tab và con trỏ `*Cat`.

Sau quá trình khởi tạo, chúng ta tiến vào quá trình dynamic dispatch, câu lệnh `c.Quack()` được mở rộng thành các chỉ thị hợp ngữ sẽ xác định con trỏ hàm trong run time.

```go
MOVQ	"".c+48(SP), AX                    ;; AX = iface(c).tab
MOVQ	24(AX), AX                         ;; AX = iface(c).tab.fun[0] = Cat.Quack
MOVQ	"".c+56(SP), CX                    ;; CX = iface(c).data
MOVQ	CX, (SP)                           ;; SP = CX = &Cat{...}
CALL	AX                                 ;; SP.Quack()
```

Quá trình thực thi mã này có thể chia thành ba bước sau:

1. Lấy con trỏ của phương thức `Cat.Quack` được lưu trữ trong `tab.func[0]` của biến giao diện.
2. Dữ liệu của biến giao diện trong  [`runtime.iface`](https://draveness.me/golang/tree/runtime.iface) sẽ được sao chép lên đỉnh ngăn xếp.
3. Con trỏ phương thức sẽ được sao chép vào thanh ghi và được kích hoạt bằng chỉ thị `CALL`:

Câu lệnh `c.(*Cat).Quack()` tạo ra các chỉ thị hợp ngữ phức tạp hơn, nhưng phần đầu của mã chỉ là chuyển đổi kiểu, chuyển đổi kiểu giao diện thành kiểu `*Cat`, chỉ có hai dòng cuối cùng mới liên quan đến việc gọi hàm:

```go
MOVQ	"".c+56(SP), AX                    ;; AX = iface(c).data = &Cat{...}
MOVQ	"".c+48(SP), CX                    ;; CX = iface(c).tab
LEAQ	go.itab.*"".Cat,"".Duck(SB), DX    ;; DX = &&go.itab.*"".Cat,"".Duck
CMPQ	CX, DX                             ;; CMP(CX, DX)
JEQ	163
JMP	201
MOVQ	AX, ""..autotmp_3+24(SP)           ;; SP+24 = &Cat{...}
MOVQ	AX, (SP)                           ;; SP = &Cat{...}
CALL	"".(*Cat).Quack(SB)                ;; SP.Quack()
```

Các dòng mã sau chỉ đơn giản là sao chép con trỏ `Cat` lên đỉnh ngăn xếp và gọi phương thức `Quack`. Con trỏ hàm cho lần gọi này đã được xác định tại thời điểm biên dịch, do đó không cần tìm kiếm động các triển khai phương thức khi chạy:

```go
MOVQ	"".c+48(SP), AX                    ;; AX = iface(c).tab
MOVQ	24(AX), AX                         ;; AX = iface(c).tab.fun[0] = Cat.Quack
MOVQ	"".c+56(SP), CX                    ;; CX = iface(c).data
```

Sự khác biệt giữa các chỉ thị lắp ráp tương ứng với hai lệnh gọi phương thức là chi phí bổ sung do việc dynamic dispatch mang lại. Những chi phí bổ sung này không thể bỏ qua trong các dịch vụ có độ trễ thấp và yêu cầu thông lượng cao. Hãy cùng phân tích chi tiết sự ảnh hưởng của các chỉ thị lắp ráp bổ sung này đến hiệu suất.

### Benchmark

Hai phương thức `BenchmarkDirectCall` và `BenchmarkDynamicDispatch` trong đoạn mã dưới đây sẽ gọi phương thức của cấu trúc và gọi phương thức của giao diện tương ứng. Khi gọi phương thức trên giao diện, dynamic dispatch sẽ được sử dụng. Chúng ta sẽ sử dụng cuộc gọi trực tiếp làm tiêu chuẩn để phân tích chi phí bổ sung do dynamic dispatch mang lại:

```go
func BenchmarkDirectCall(b *testing.B) {
	c := &Cat{Name: "draven"}
	for n := 0; n < b.N; n++ {
		// MOVQ	AX, "".c+24(SP)
		// MOVQ	AX, (SP)
		// CALL	"".(*Cat).Quack(SB)
		c.Quack()
	}
}

func BenchmarkDynamicDispatch(b *testing.B) {
	c := Duck(&Cat{Name: "draven"})
	for n := 0; n < b.N; n++ {
		// MOVQ	"".d+56(SP), AX
		// MOVQ	24(AX), AX
		// MOVQ	"".d+64(SP), CX
		// MOVQ	CX, (SP)
		// CALL	AX
		c.Quack()
	}
}
```

Chúng ta sẽ chạy lệnh sau, sử dụng 1 CPU để chạy mã trên, mỗi bài kiểm tra sẽ được thực hiện 3 lần:

```go
$ go test -gcflags=-N -benchmem -test.count=3 -test.cpu=1 -test.benchtime=1s -bench=.
goos: darwin
goarch: amd64
pkg: github.com/golang/playground
BenchmarkDirectCall      	500000000	         3.11 ns/op	       0 B/op	       0 allocs/op
BenchmarkDirectCall      	500000000	         2.94 ns/op	       0 B/op	       0 allocs/op
BenchmarkDirectCall      	500000000	         3.04 ns/op	       0 B/op	       0 allocs/op
BenchmarkDynamicDispatch 	500000000	         3.40 ns/op	       0 B/op	       0 allocs/op
BenchmarkDynamicDispatch 	500000000	         3.79 ns/op	       0 B/op	       0 allocs/op
BenchmarkDynamicDispatch 	500000000	         3.55 ns/op	       0 B/op	       0 allocs/op
```

- Khi gọi phương thức của cấu trúc, mỗi lần gọi mất khoảng ~3.03ns;
- Khi sử dụng dynamic dispatch, mỗi lần gọi mất khoảng ~3.58ns

Dựa trên dữ liệu trên và trong trường hợp tắt tối ưu hóa của trình biên dịch, có thể thấy rằng các chỉ thị lắp ráp được tạo ra bởi dynamic dispatch tạo ra khoảng ~18% chi phí bổ sung về hiệu suất.

Những chi phí bổ sung này không ảnh hưởng quá nhiều đến một hệ thống phức tạp. Một dự án không thể chỉ sử dụng dynamic dispatch và nếu chúng ta bật tối ưu hóa của trình biên dịch, chi phí bổ sung của dynamic dispatch sẽ giảm xuống khoảng ~5%, điều này giúp giảm thiểu ảnh hưởng tổng thể đến hiệu suất ứng dụng. Vì vậy, so với lợi ích của việc sử dụng giao diện, chi phí bổ sung của dynamic dispatch thường có thể bị bỏ qua.

Các bài kiểm tra hiệu suất trên được xây dựng dựa trên việc triển khai và gọi phương thức trên con trỏ cấu trúc. Khi chúng ta thay thế con trỏ cấu trúc bằng cấu trúc, sẽ có sự khác biệt lớn hơn.

```go
func BenchmarkDirectCall(b *testing.B) {
	c := Cat{Name: "draven"}
	for n := 0; n < b.N; n++ {
		// MOVQ	AX, (SP)
		// MOVQ	$6, 8(SP)
		// CALL	"".Cat.Quack(SB)
		c.Quack()
	}
}

func BenchmarkDynamicDispatch(b *testing.B) {
	c := Duck(Cat{Name: "draven"})
	for n := 0; n < b.N; n++ {
		// MOVQ	16(SP), AX
		// MOVQ	24(SP), CX
		// MOVQ	AX, "".d+32(SP)
		// MOVQ	CX, "".d+40(SP)
		// MOVQ	"".d+32(SP), AX
		// MOVQ	24(AX), AX
		// MOVQ	"".d+40(SP), CX
		// MOVQ	CX, (SP)
		// CALL	AX
		c.Quack()
	}
}
```

Khi chúng ta chạy lại các bài kiểm tra hiệu suất như trên, chúng ta sẽ nhận được kết quả như sau:

```go
$ go test -gcflags=-N -benchmem -test.count=3 -test.cpu=1 -test.benchtime=1s .
goos: darwin
goarch: amd64
pkg: github.com/golang/playground
BenchmarkDirectCall      	500000000	         3.15 ns/op	       0 B/op	       0 allocs/op
BenchmarkDirectCall      	500000000	         3.02 ns/op	       0 B/op	       0 allocs/op
BenchmarkDirectCall      	500000000	         3.09 ns/op	       0 B/op	       0 allocs/op
BenchmarkDynamicDispatch 	200000000	         6.92 ns/op	       0 B/op	       0 allocs/op
BenchmarkDynamicDispatch 	200000000	         6.91 ns/op	       0 B/op	       0 allocs/op
BenchmarkDynamicDispatch 	200000000	         7.10 ns/op	       0 B/op	       0 allocs/op
```

Thời gian trung bình để gọi phương thức trực tiếp và sử dụng con trỏ gần như như nhau, khoảng ~3.09ns, trong khi gọi phương thức sử dụng dynamic dispatch mất khoảng ~6.98ns, tốn thêm khoảng ~125% thời gian so với gọi trực tiếp. Chúng ta cũng có thể thấy từ các chỉ thị lắp ráp tạo ra rằng chi phí bổ sung của dynamic dispatch cao hơn nhiều.

| | Gọi trực tiếp | Dynamic Dispatch |
|---|:---:|:---:|
|Con trỏ|~3.03ns|~3.58ns|
|Cấu trúc|~3.09ns|~6.98ns|

Từ bảng trên, chúng ta có thể thấy rằng chi phí bổ sung khi sử dụng cấu trúc để triển khai giao diện lớn hơn khi sử dụng con trỏ. Đồng thời, hiệu suất của dynamic dispatch trên cấu trúc cũng rất kém, điều này cũng nhắc chúng ta nên tránh sử dụng cấu trúc để triển khai giao diện.

Sự khác biệt hiệu suất lớn khi sử dụng cấu trúc không chỉ là vấn đề của giao diện, sự khác biệt hiệu suất chủ yếu do Go sử dụng truyền giá trị trong quá trình gọi hàm, và quá trình dynamic dispatch chỉ làm tăng ảnh hưởng của việc sao chép tham số.

## Tóm tắt

Trong phần này, chúng ta đã đề cập đến những vấn đề phổ biến khi sử dụng giao diện trong Go, chẳng hạn như sự khác biệt khi triển khai giao diện bằng các loại dữ liệu khác nhau và chuyển đổi kiểu ngầm định khi gọi hàm. Chúng ta cũng đã phân tích quá trình chuyển đổi kiểu giao diện, kiểm tra kiểu và dynamic dispatch, tin rằng nội dung của phần này sẽ giúp bạn hiểu sâu hơn về giao diện trong Go.
