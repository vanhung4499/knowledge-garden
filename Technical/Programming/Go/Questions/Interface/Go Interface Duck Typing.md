---
title: Go Interface Duck Typing
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-21
date modified: 2023-09-21
---

# Go Interface and Duck Typing

Hãy xem định nghĩa trong Wikipedia:

> If it looks like a duck, swims like a duck, and quacks like a duck, then it probably is a duck.

Dịch: Nếu nó trông giống vịt, bơi như vịt và kêu như vịt, thì có thể nó là một con vịt.

`Duck Typing` là một chiến lược suy luận đối tượng trong ngôn ngữ lập trình động, nó tập trung vào cách đối tượng có thể được sử dụng, chứ không phải vào kiểu dữ liệu của đối tượng đó. Trong Go, một ngôn ngữ tĩnh, Duck Typing được hỗ trợ hoàn hảo thông qua việc sử dụng giao diện (interface).

Ví dụ, trong ngôn ngữ động như Python, ta có thể định nghĩa một hàm như sau:

```python
def hello_world(coder):
    coder.say_hello()
```

Khi gọi hàm này, ta có thể truyền vào bất kỳ kiểu dữ liệu nào, miễn là nó triển khai phương thức `say_hello()`. Nếu không triển khai, lúc chạy chương trình sẽ gây ra lỗi.

Tuy nhiên, trong ngôn ngữ tĩnh như Java, C++, ta phải khai báo rõ ràng rằng một đối tượng triển khai một giao diện cụ thể trước khi sử dụng nó ở bất kỳ đâu cần giao diện đó. Nếu bạn gọi hàm `hello_world` trong chương trình của bạn và truyền vào một kiểu dữ liệu không triển khai phương thức `say_hello()`, lúc biên dịch sẽ không thông qua. Điều này làm cho ngôn ngữ tĩnh an toàn hơn so với ngôn ngữ động.

Sự khác biệt giữa ngôn ngữ động và ngôn ngữ tĩnh đã được thể hiện ở đây. Ngôn ngữ tĩnh có thể phát hiện lỗi không khớp kiểu trong quá trình biên dịch, không giống như ngôn ngữ động, chỉ báo lỗi khi chạy đến dòng mã đó. Tôi muốn nhấn mạnh rằng đây cũng là lý do tại sao tôi không thích sử dụng Python. Tất nhiên, ngôn ngữ tĩnh yêu cầu lập trình viên phải khai báo kiểu dữ liệu cho từng biến trong quá trình viết mã, điều này tăng công việc và làm tăng độ dài mã. Ngôn ngữ động không yêu cầu điều này, cho phép người viết mã tập trung hơn vào logic kinh doanh và mã ngắn hơn, điều này rõ ràng đối với những lập trình viên Python.

Go, là một ngôn ngữ tĩnh hiện đại, có lợi thế sau. Nó mang lại tiện ích của ngôn ngữ động và đồng thời thực hiện kiểm tra kiểu tĩnh. Go sử dụng một phương pháp trung gian: không yêu cầu khai báo rõ ràng rằng một đối tượng triển khai một giao diện cụ thể, chỉ cần triển khai các phương thức liên quan là đủ, trình biên dịch sẽ phát hiện ra.

Hãy xem một ví dụ:

Đầu tiên, định nghĩa một giao diện và một hàm có tham số là giao diện:

```go
type IGreeting interface {
	sayHello()
}

func sayHello(i IGreeting) {
	i.sayHello()
}
```

Tiếp theo, định nghĩa hai cấu trúc:

```go
type Go struct {}
func (g Go) sayHello() {
	fmt.Println("Hi, I am GO!")
}

type PHP struct {}
func (p PHP) sayHello() {
	fmt.Println("Hi, I am PHP!")
}
```

Cuối cùng, trong hàm main, gọi hàm `sayHello()`:

```go
func main() {
	golang := Go{}
	php := PHP{}

	sayHello(golang)
	sayHello(php)
}
```

Kết quả chương trình:

```shell
Hi, I am GO!
Hi, I am PHP!
```

Trong hàm main, khi gọi hàm `sayHello()`, chúng ta truyền vào các đối tượng `golang` và `php`, chúng không khai báo rõ ràng rằng chúng triển khai giao diện `IGreeting`, chỉ cần triển khai phương thức `sayHello()` theo yêu cầu của giao diện. Trong thực tế, trình biên dịch sẽ tự động chuyển đổi các đối tượng `golang` và `php` thành kiểu `IGreeting`, đây cũng là khả năng kiểm tra kiểu tĩnh của ngôn ngữ.

Nhân tiện, hãy nhắc lại một số đặc điểm của ngôn ngữ động:

> - Kiểu dữ liệu của biến không được xác định trước, chỉ được xác định trong quá trình chạy.
> - Hàm và phương thức có thể chấp nhận bất kỳ kiểu dữ liệu nào là tham số và không kiểm tra kiểu dữ liệu khi gọi.
> - Không cần triển khai giao diện.

Tóm lại, `Duck Typing` là một phong cách trong ngôn ngữ lập trình động, trong đó ý nghĩa hợp lệ của một đối tượng không phụ thuộc vào việc kế thừa từ một lớp cụ thể hoặc triển khai một giao diện cụ thể, mà phụ thuộc vào `tập hợp các phương thức và thuộc tính hiện tại` của nó. Go, là một ngôn ngữ tĩnh, thực hiện Duck Typing thông qua việc sử dụng giao diện, và trình biên dịch Go thực hiện việc chuyển đổi ngầm định này.
