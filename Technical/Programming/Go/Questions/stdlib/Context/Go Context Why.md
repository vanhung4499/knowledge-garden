---
title: Go Context Why
tags:
  - golang
  - interview
categories:
  - golang
  - interview
date created: 2023-10-05
date modified: 2023-10-05
---

# Context có tác dụng gì?

Go thường được sử dụng để viết các dịch vụ back-end, và thường chỉ cần vài dòng code là có thể xây dựng http server.

Trong server Go, thường mỗi khi có một yêu cầu đến, nhiều goroutine sẽ được khởi động để làm việc cùng nhau: một số đi đến cơ sở dữ liệu để lấy dữ liệu, một số gọi các giao diện dưới cùng để lấy dữ liệu liên quan…

![context-0.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/context-0.png)

Những goroutine này cần chia sẻ dữ liệu cơ bản của yêu cầu, chẳng hạn như token đăng nhập, thời gian chờ tối đa để xử lý yêu cầu (nếu vượt quá giá trị này, dữ liệu sẽ được trả về sau khi yêu cầu đã hết thời gian chờ) và nhiều hơn nữa. Khi yêu cầu bị hủy bỏ hoặc xử lý quá lâu, điều này có thể xảy ra khi người dùng đóng trình duyệt hoặc đã vượt quá thời gian chờ quy định của bên yêu cầu, bên yêu cầu sẽ từ chối kết quả yêu cầu này. Lúc này, tất cả các goroutine đang làm việc cho yêu cầu này cần thoát nhanh chóng, vì "kết quả công việc" của chúng không còn cần thiết nữa. Sau khi tất cả các goroutine liên quan đã thoát, hệ thống có thể thu hồi các tài nguyên liên quan.

Nói thêm một chút, server trong Go thực tế là một "mô hình coroutine", có nghĩa là một coroutine xử lý một yêu cầu. Ví dụ, trong giai đoạn cao điểm của doanh nghiệp, phản hồi từ một dịch vụ dưới cùng có thể chậm đi, trong khi yêu cầu của hệ thống hiện tại không có kiểm soát thời gian chờ, hoặc thời gian chờ được đặt quá lớn, các coroutine đang chờ đợi dữ liệu trả về từ dịch vụ dưới cùng sẽ ngày càng nhiều. Và chúng ta biết rằng, coroutine tiêu tốn tài nguyên hệ thống, kết quả là số coroutine tăng lên, sử dụng bộ nhớ tăng cao, thậm chí có thể dẫn đến dịch vụ không khả dụng. Nghiêm trọng hơn, nó có thể dẫn đến hiệu ứng tuyết rơi, toàn bộ dịch vụ hiển thị không khả dụng, đây chắc chắn là một sự cố cấp độ P0. Lúc này, chắc chắn có người sẽ phải chịu trách nhiệm.

Thực tế là sự cố cấp độ P0 đã được mô tả ở trên có thể được tránh bằng cách thiết lập "thời gian xử lý tối đa cho dịch vụ dưới cùng". Ví dụ, đặt timeout cho dịch vụ dưới cùng là 50ms, nếu sau thời gian này vẫn chưa nhận được dữ liệu trả về, chỉ cần trả về một giá trị mặc định hoặc lỗi cho khách hàng. Ví dụ, trả về một số lượng tồn kho mặc định của sản phẩm. Lưu ý rằng thời gian chờ được đặt ở đây không giống với thời gian chờ đọc và ghi được đặt khi tạo một http client, điều này không được mở rộng ở đây.

Gói context được phát triển để giải quyết các vấn đề trên: truyền giá trị chia sẻ giữa các goroutine, tín hiệu hủy bỏ, thời gian chờ, …

![context-1.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/context-1.png)

Một cách ngắn gọn, trong Go, chúng ta không thể kill coroutine trực tiếp, việc kill coroutine thường được điều khiển bằng cách sử dụng `channel+select`. Tuy nhiên, trong một số tình huống, ví dụ như xử lý một yêu cầu tạo ra nhiều coroutine, các coroutine này có liên quan lẫn nhau: cần chia sẻ một số biến toàn cục, có cùng thời gian chờ chung và có thể đồng thời bị đóng. Sử dụng `channel+select` sẽ gây khó khăn, lúc này chúng ta có thể sử dụng context để thực hiện điều đó.

Nói một cách dễ hiểu: context được sử dụng để giải quyết chức năng **thông báo thoát** và **truyền dữ liệu meta** giữa các goroutine.

【Mở rộng 1】Đưa ra ví dụ về cách sử dụng context trong dự án thực tế.

Việc sử dụng context rất tiện lợi. Trong mã nguồn, có một hàm tạo ra một context gốc:

```go
func Background() Context
```

Background là một context trống, nó không thể bị hủy bỏ, không có giá trị và không có thời gian chờ.

Trong context gốc, có bốn hàm để tạo ra context con:

```go
func WithCancel(parent Context) (ctx Context, cancel CancelFunc)
func WithDeadline(parent Context, deadline time.Time) (Context, CancelFunc)
func WithTimeout(parent Context, timeout time.Duration) (Context, CancelFunc)
func WithValue(parent Context, key, val interface{}) Context
```

context sẽ được truyền qua các hàm. Chỉ cần gọi hàm cancel vào thời điểm thích hợp để gửi tín hiệu hủy bỏ đến các goroutine hoặc gọi hàm Value để lấy giá trị từ context.

Trong tài liệu chính thức, đã đưa ra một số khuyến nghị về việc sử dụng context:

1. Do not store Contexts inside a struct type; instead, pass a Context explicitly to each function that needs it. The Context should be the first parameter, typically named ctx.
2. Do not pass a nil Context, even if a function permits it. Pass context.TODO if you are unsure about which Context to use.
3. Use context Values only for request-scoped data that transits processes and APIs, not for passing optional parameters to functions.
4. The same Context may be passed to functions running in different goroutines; Contexts are safe for simultaneous use by multiple goroutines.

Tôi dịch lại như sau:

1. Không lưu trữ Context trong một cấu trúc dữ liệu. Thay vào đó, truyền Context một cách rõ ràng cho mỗi hàm cần sử dụng nó. Context nên là tham số đầu tiên, thường được đặt tên là ctx.
2. Không truyền một Context nil, ngay cả khi một hàm cho phép điều đó. Hãy truyền context.TODO nếu bạn không chắc chắn về việc sử dụng Context nào.
3. Sử dụng giá trị context chỉ cho dữ liệu phạm vi yêu cầu đi qua các tiến trình và API, không sử dụng cho việc truyền các tham số tùy chọn vào các hàm.
4. Cùng một Context có thể được truyền vào các hàm chạy trên các goroutine khác nhau. Context là an toàn để sử dụng đồng thời bởi nhiều goroutine.

## Truyền dữ liệu chia sẻ

Đối với phát triển web server, chúng ta thường muốn xâu chuỗi toàn bộ quá trình xử lý yêu cầu lại với nhau, điều này phụ thuộc rất nhiều vào biến Thread Local (đối với Go, có thể hiểu là biến chỉ thuộc về một coroutine duy nhất), trong Go không có khái niệm này, do đó cần truyền context khi gọi hàm.

```go
package main

import (
	"context"
	"fmt"
)

func main() {
	ctx := context.Background()
	process(ctx)

	ctx = context.WithValue(ctx, "traceId", "qcrao-2019")
	process(ctx)
}

func process(ctx context.Context) {
	traceId, ok := ctx.Value("traceId").(string)
	if ok {
		fmt.Printf("process over. trace_id=%s\n", traceId)
	} else {
		fmt.Printf("process over. no trace_id\n")
	}
}
```

Kết quả chạy:

```shell
process over. no trace_id
process over. trace_id=qcrao-2019
```

Lần gọi hàm process đầu tiên, ctx là một context trống, nên không thể lấy được giá trị traceId. Lần thứ hai, thông qua hàm `WithValue`, tạo ra một context và gán giá trị cho khóa `traceId`, vì vậy có thể lấy được giá trị đã truyền vào.

Tất nhiên, trong các tình huống thực tế, có thể lấy Request-ID từ một yêu cầu HTTP. Vì vậy, ví dụ dưới đây có thể phù hợp hơn:

```go
const requestIDKey int = 0

func WithRequestID(next http.Handler) http.Handler {
	return http.HandlerFunc(
		func(rw http.ResponseWriter, req *http.Request) {
			// Trích xuất request-id từ header
			reqID := req.Header.Get("X-Request-ID")
			// Tạo context với giá trị. Sử dụng kiểu tùy chỉnh để tránh xung đột
			ctx := context.WithValue(
				req.Context(), requestIDKey, reqID)
			
			// Tạo yêu cầu mới
			req = req.WithContext(ctx)
			
			// Gọi hàm xử lý HTTP
			next.ServeHTTP(rw, req)
		}
	)
}

// Lấy request-id
func GetRequestID(ctx context.Context) string {
	ctx.Value(requestIDKey).(string)
}

func Handle(rw http.ResponseWriter, req *http.Request) {
	// Lấy reqId, sau đó có thể ghi nhật ký và các hoạt động khác
	reqID := GetRequestID(req.Context())
	...
}

func main() {
	handler := WithRequestID(http.HandlerFunc(Handle))
	http.ListenAndServe("/", handler)
}
```

## Hủy bỏ goroutine

Hãy tưởng tượng một tình huống: bạn mở trang đặt hàng đồ ăn, trên bản đồ hiển thị vị trí của người giao hàng và cập nhật vị trí đó mỗi giây một lần. Khi ứng dụng kết nối websocket với server (trong thực tế có thể là truy vấn liên tục), server sẽ khởi động một goroutine, tính toán vị trí của người giao hàng và gửi kết quả cho ứng dụng. Nếu người dùng thoát khỏi trang này, server cần "hủy bỏ" quá trình này, thoát khỏi goroutine và thu hồi tài nguyên.

Một cách triển khai server có thể như sau:

```go
func Perform() {
    for {
        calculatePos()
        sendResult()
        time.Sleep(time.Second)
    }
}
```

Nếu bạn muốn triển khai chức năng "hủy bỏ" mà không biết về tính năng context, bạn có thể làm như sau: thêm một biến bool kiểu con trỏ vào hàm, kiểm tra biến bool ở đầu vòng lặp for, nếu giá trị của biến bool thay đổi từ true thành false, thoát khỏi vòng lặp.

Cách làm đơn giản trên có thể đạt được kết quả mong muốn, không có vấn đề gì, nhưng không tinh tế và khi số lượng goroutine tăng lên và có nhiều lồng nhau, điều đó sẽ trở nên rắc rối. Cách làm tinh tế hơn, tất nhiên, sẽ sử dụng context.

```go
func Perform(ctx context.Context) {
    for {
        calculatePos()
        sendResult()

        select {
        case <-ctx.Done():
            // Bị hủy bỏ, trả về ngay
            return
        case <-time.After(time.Second):
            // Chặn trong 1 giây
        }
    }
}
```

Quá trình chính có thể như sau:

```go
ctx, cancel := context.WithTimeout(context.Background(), time.Hour)
go Perform(ctx)

// ...
// Ứng dụng trả về trang, gọi hàm cancel
cancel()
```

Lưu ý một chi tiết, context trả về từ hàm WithTimeout và hàm cancel là hai thực thể riêng biệt. Context không có chức năng hủy bỏ, lý do là hàm hủy bỏ chỉ có thể được gọi từ hàm bên ngoài, ngăn chặn các context con gọi hàm hủy bỏ và từ đó kiểm soát chặt chẽ luồng thông tin: từ context cha chảy vào context con.

# Ngăn chặn rò rỉ goroutine

Trong ví dụ trước đó, goroutine vẫn sẽ thực thi cho đến khi hoàn thành và trả về, chỉ là sẽ lãng phí một số tài nguyên hệ thống. Đây là một ví dụ:

```go
func gen() <-chan int {
	ch := make(chan int)
	go func() {
		var n int
		for {
			ch <- n
			n++
			time.Sleep(time.Second)
		}
	}()
	return ch
}
```

Đây là một goroutine có thể tạo ra các số nguyên vô hạn, nhưng nếu tôi chỉ cần 5 số đầu tiên, thì sẽ xảy ra rò rỉ goroutine:

```go
func main() {
	for n := range gen() {
		fmt.Println(n)
		if n == 5 {
			break
		}
	}
	// ...
}
```

Khi n == 5, chương trình sẽ dừng lại. Nhưng goroutine trong hàm gen sẽ tiếp tục vòng lặp vô hạn và không bao giờ dừng lại. Điều này gây ra rò rỉ goroutine.

Cải thiện ví dụ này bằng cách sử dụng context:

```go
func gen(ctx context.Context) <-chan int {
	ch := make(chan int)
	go func() {
		var n int
		for {
			select {
			case <-ctx.Done():
				return
			case ch <- n:
				n++
				time.Sleep(time.Second)
			}
		}
	}()
	return ch
}

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel() // Tránh quên cancel ở các vị trí khác và gọi nhiều lần không ảnh hưởng

	for n := range gen(ctx) {
		fmt.Println(n)
		if n == 5 {
			cancel()
			break
		}
	}
	// ...
}
```

Thêm một context, gọi hàm cancel trước khi break, để hủy bỏ goroutine. Khi hàm gen nhận được tín hiệu hủy bỏ, nó sẽ thoát ngay lập tức và hệ thống thu hồi tài nguyên.
