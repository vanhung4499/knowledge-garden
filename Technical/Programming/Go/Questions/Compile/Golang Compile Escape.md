---
title: Golang Compile Escape
tags:
  - golang
  - interview
categories:
  - golang
  - interview
date created: 2023-10-05
date modified: 2023-10-05
---

# Golang Compile: Escape

Trong lĩnh vực lập trình, phân tích thoát (escape analysis) là phương pháp để phân tích phạm vi động của con trỏ. Đơn giản mà nói, khi một con trỏ của một đối tượng được tham chiếu bởi nhiều phương thức hoặc luồng, chúng ta gọi con trỏ này đã thoát.

Phân tích thoát trong Go là một quá trình tối ưu và đơn giản hóa quản lý bộ nhớ sau khi biên dịch, nó quyết định xem một biến có được cấp phát trên stack hay trên heap.

Những bạn đã viết C/C++ đều biết rằng, việc sử dụng các hàm phổ biến như malloc và new có thể cấp phát một khối bộ nhớ trên heap, và lập trình viên phải chịu trách nhiệm sử dụng và giải phóng bộ nhớ này. Nếu không cẩn thận, có thể xảy ra rò rỉ bộ nhớ.

Trong Go, chúng ta không cần lo lắng về rò rỉ bộ nhớ. Mặc dù vẫn có hàm new, nhưng bộ nhớ được cấp phát bằng new không nhất thiết phải trên heap. Sự khác biệt giữa heap và stack đã được "làm mờ" đối với lập trình viên, và tất cả điều này được thực hiện bởi trình biên dịch Go.

Nguyên tắc cơ bản của phân tích thoát trong Go là: nếu một hàm trả về một tham chiếu đến một biến, thì biến đó sẽ thoát.

Nói một cách đơn giản, trình biên dịch sẽ phân tích các đặc điểm của mã và vòng đời của mã, và biến trong Go chỉ được cấp phát trên stack khi trình biên dịch có thể chứng minh rằng biến đó sẽ không được tham chiếu lại sau khi hàm trả về. Trong các trường hợp khác, biến sẽ được cấp phát trên heap.

Trong Go, không có từ khóa hoặc hàm nào có thể cho phép biến được cấp phát trên heap trực tiếp. Ngược lại, trình biên dịch quyết định cấp phát biến vào đâu dựa trên phân tích mã nguồn.

Biến có thể được cấp phát trên heap nếu được tham chiếu từ bên ngoài. Nhưng sau khi phân tích thoát được thực hiện, nếu trình biên dịch nhận thấy biến sẽ không được tham chiếu sau khi hàm trả về, nó sẽ cấp phát biến trên stack.

Trình biên dịch sẽ quyết định liệu biến có thoát hay không dựa trên việc biến có được tham chiếu từ bên ngoài hay không:

1. Nếu không có tham chiếu từ bên ngoài, biến sẽ được cấp phát trên stack.
2. Nếu có tham chiếu từ bên ngoài, biến sẽ được cấp phát trên heap.

Khi viết mã C/C++, để tăng hiệu suất, chúng ta thường "nâng cấp" pass-by-value (truyền giá trị) thành pass-by-reference (truyền tham chiếu), nhằm tránh việc chạy hàm xây dựng và trả về một con trỏ trực tiếp.

Bạn chắc chắn còn nhớ, điều này ẩn chứa một lỗ hổng lớn: biến cục bộ được định nghĩa trong hàm, sau đó trả về địa chỉ (con trỏ) của biến cục bộ này. Những biến cục bộ này được cấp phát trên stack (cấp phát bộ nhớ tĩnh), và khi hàm kết thúc, bộ nhớ chiếm bởi biến sẽ bị hủy, bất kỳ hoạt động nào trên giá trị trả về này (như giải tham chiếu) sẽ làm gián đoạn chương trình, thậm chí gây sự cố trực tiếp. Ví dụ như đoạn mã sau:

```c
int *foo ( void )   
{   
    int t = 3;
    return &t;
}
```

Một số bạn có thể biết lỗ hổng trên và sử dụng một cách thông minh hơn: trong hàm, sử dụng hàm new để tạo một biến (cấp phát động bộ nhớ), sau đó trả về địa chỉ của biến này. Vì biến được tạo trên heap, nó sẽ không bị hủy khi hàm kết thúc. Tuy nhiên, điều này có đủ chưa? Khi nào chúng ta nên xóa đối tượng được tạo ra bằng new? Người gọi có thể quên xóa hoặc trực tiếp chuyển giá trị trả về cho hàm khác, sau đó không thể xóa nó nữa, điều này gây ra rò rỉ bộ nhớ. Về lỗ hổng này, mọi người có thể xem "Effective C++" mục 21, rất hay!

C++ được coi là ngôn ngữ có cú pháp phức tạp nhất, người ta nói không ai có thể nắm vững hoàn toàn cú pháp của C++. Nhưng mọi thứ trong Go lại khác biệt. Mã C++ như ví dụ trên khi đưa vào Go, không gặp vấn đề gì.  

Những vấn đề phát sinh trong C/C++ đã nêu trước đó được coi là điểm mạnh cho ngôn ngữ Go và được đánh giá cao.

Trong C/C++, việc cấp phát động bộ nhớ yêu cầu chúng ta phải thủ công giải phóng, khiến chúng ta phải cẩn thận khi viết chương trình. Điều này có lợi điểm của nó: lập trình viên có thể hoàn toàn kiểm soát bộ nhớ. Tuy nhiên, nó cũng có nhiều nhược điểm: thường xảy ra quên giải phóng bộ nhớ, dẫn đến rò rỉ bộ nhớ. Vì vậy, nhiều ngôn ngữ lập trình hiện đại đã thêm cơ chế thu gom rác.

Thu gom rác trong Go cho phép stack và heap giữ tình trạng vô hình đối với cho lập trình viên. Nó thực sự giải phóng đôi tay của lập trình viên, cho phép họ tập trung vào yêu cầu kinh doanh và viết mã "hiệu quả". Các cơ chế quản lý bộ nhớ phức tạp được giao cho trình biên dịch, trong khi lập trình viên có thể tận hưởng cuộc sống.

Phân tích thoát ra làm việc "thông minh" để cấp phát biến số vào nơi nó nên được đặt. Ngay cả khi bạn sử dụng new để cấp phát bộ nhớ, nếu tôi phát hiện ra rằng sau khi thoát khỏi hàm, bạn không sử dụng nó nữa, tôi sẽ đặt nó trên stack, vì việc cấp phát bộ nhớ trên stack nhanh hơn nhiều so với heap. Ngược lại, ngay cả khi bạn chỉ là một biến thông thường, nhưng sau khi phân tích thoát, tôi phát hiện rằng nó vẫn được tham chiếu ở nơi khác sau khi thoát khỏi hàm, tôi sẽ cấp phát nó trên heap.

Nếu tất cả các biến đều được cấp phát trên heap, heap không thể tự động dọn dẹp giống như stack. Nó sẽ gây ra việc thu gom rác thường xuyên trong Go, và việc thu gom rác sẽ tốn nhiều tài nguyên hệ thống (chiếm 25% dung lượng CPU).

So với stack, heap phù hợp với việc cấp phát bộ nhớ không thể dự đoán được kích thước. Nhưng giá phải trả cho điều này là tốc độ cấp phát chậm hơn và tạo ra phân mảnh bộ nhớ. cấp phát bộ nhớ trên stack chỉ cần hai chỉ thị CPU: "PUSH" và "RELEASE", cấp phát và giải phóng. Trong khi cấp phát bộ nhớ trên heap đầu tiên phải tìm một khối bộ nhớ phù hợp với kích thước, sau đó phải thông qua trình thu gom rác để giải phóng.

Thông qua phân tích thoát ra, chúng ta có thể cố gắng cấp phát các biến không cần phải cấp phát trên heap trực tiếp trên stack. Khi số lượng biến trên heap giảm đi, điều này sẽ giảm bớt chi phí cấp phát bộ nhớ trên heap và giảm áp lực thu gom rác, từ đó tăng tốc độ chạy chương trình.

**Mở rộng 1**: Làm thế nào để kiểm tra xem một biến có thoát hay không?

Có hai phương pháp: sử dụng lệnh go để xem kết quả phân tích thoát và tháo gỡ (disassemble) mã nguồn.

Ví dụ sử dụng đoạn mã sau:

```go
package main

import "fmt"

func foo() *int {
	t := 3
	return &t;
}

func main() {
	x := foo()
	fmt.Println(*x)
}
```

Sử dụng lệnh go:

```shell
go build -gcflags '-m -l' main.go
```

Thêm `-l` để không cho phép hàm foo được nội tuyến. Kết quả như sau:

```shell
# command-line-arguments
src/main.go:7:9: &t escapes to heap
src/main.go:6:7: moved to heap: t
src/main.go:12:14: *x escapes to heap
src/main.go:12:13: main ... argument does not escape
```

Biến `t` trong hàm foo đã thoát, giống như chúng ta dự đoán. Nhưng điều khiến chúng ta thắc mắc là tại sao biến `x` trong hàm main cũng thoát? Điều này là do một số tham số của hàm là kiểu interface, ví dụ như fmt.Println(a …interface{}), trong quá trình biên dịch khó xác định chính xác kiểu của tham số, cũng có thể dẫn đến thoát.

Disassemble mã nguồn:

```shell
go tool compile -S main.go
```

Trong đoạn mã được trích dẫn, kết quả phân tích thoát ra đã được đánh dấu trong hình ảnh. Được ghi chú là biến `t` đã được phân bổ trên heap và đã xảy ra việc thoát ra.

![compile-0.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/compile-0.png)

**Mở rộng 2**: Các biến trong đoạn mã dưới đây có thoát không?

Ví dụ 1:

```go
package main
type S struct {}

func main() {
  var x S
  _ = identity(x)
}

func identity(x S) S {
  return x
}
```

Phân tích: Trong Go, tham số của hàm được truyền bằng giá trị, khi gọi hàm, một bản sao của tham số được tạo trên stack, không có thoát.

Ví dụ 2:

```go
package main

type S struct {}

func main() {
  var x S
  y := &x
  _ = *identity(y)
}

func identity(z *S) *S {
  return z
}
```

Phân tích: Đầu vào của hàm identity là một con trỏ, vì không có tham chiếu đến z, nên z không thoát. Tham chiếu đến x cũng không thoát khỏi phạm vi của hàm main, do đó x cũng không thoát.

Ví dụ 3:

```go
package main

type S struct {}

func main() {
  var x S
  _ = *ref(x)
}

func ref(z S) *S {
  return &z
}
```

Phân tích: z là một bản sao của x, trong hàm ref, z được tham chiếu, vì vậy z không thể được đặt trên stack, nếu không, làm sao tìm thấy z qua tham chiếu ngoài ref, vì vậy z phải thoát ra heap. Mặc dù kết quả của ref bị bỏ qua trong main, nhưng trình biên dịch Go không thông minh đến vậy, nó không thể phân tích được tình huống này. Tuy nhiên, x không bao giờ được tham chiếu, vì vậy x không thoát.

Ví dụ 4: Điều gì sẽ xảy ra nếu bạn gán một tham chiếu cho một thành phần cấu trúc?

```go
package main

type S struct {
  M *int
}

func main() {
  var i int
  refStruct(i)
}

func refStruct(y int) (z S) {
  z.M = &y
  return z
}
```

Phân tích: Trong hàm `refStruct`, chúng ta lấy địa chỉ của `y`, do đó `y` đã thoát.

Ví dụ 5：

```go
package main

type S struct {
  M *int
}

func main() {
  var i int
  refStruct(&i)
}

func refStruct(y *int) (z S) {
  z.M = y
  return z
}
```

Phân tích: Trong hàm main, chúng ta lấy tham chiếu của biến i và truyền nó vào hàm refStruct. Tham chiếu của i được sử dụng trong phạm vi của hàm main, do đó i không thoát ra. So với ví dụ trước, có một chút khác biệt nhỏ, nhưng tác động của chúng lên chương trình là khác nhau: trong ví dụ 4, i được cấp phát trên stack frame của main, sau đó được cấp phát trên stack frame của refStruct, sau đó thoát ra heap và được cấp phát trên heap, tổng cộng 3 lần cấp phát. Trong ví dụ này, i chỉ được cấp phát một lần, sau đó được truyền qua tham chiếu.

Ví dụ 6:

```go
package main

type S struct {
  M *int
}

func main() {
  var x S
  var i int
  ref(&i, &x)
}

func ref(y *int, z *S) {
  z.M = y
}
```

Phân tích: Trong ví dụ này, biến i đã thoát ra. Dựa trên phân tích thoát ra trong ví dụ 5, i không thoát ra. Sự khác biệt giữa hai ví dụ là trong ví dụ 5, S được đặt trong giá trị trả về, và đầu vào chỉ có thể "chảy" vào đầu ra. Trong ví dụ này, S được đặt trong tham số đầu vào, vì vậy phân tích thoát không thành công và i phải thoát ra heap.
