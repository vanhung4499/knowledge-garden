---
title: Go Context Cancel
tags:
  - golang
  - interview
categories:
  - golang
  - interview
date created: 2023-10-05
date modified: 2023-10-05
---

# Huỷ bỏ context diễn ra như thế nào?

Gói context không dài, tệp `context.go` chỉ có ít hơn 500 dòng code, trong đó còn có nhiều chú thích dài, vì vậy mã thực tế có khoảng 200 dòng. Đây là một thư viện code rất đáng nghiên cứu.

Hãy xem một bức tranh tổng quan:

![context-3.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/context-3.png)

| Kiểu | Tên | Chức năng |
| --- | --- | --- |
| Context | Interface | Định nghĩa giao diện Context với bốn phương thức |
| emptyCtx | Struct | Triển khai giao diện Context, thực chất là một context trống |
| CancelFunc | Function | Hàm hủy bỏ |
| canceler | Interface | Giao diện hủy bỏ context, định nghĩa hai phương thức |
| cancelCtx | Struct | Có thể bị hủy bỏ |
| timerCtx | Struct | Sẽ bị hủy bỏ khi hết thời gian |
| valueCtx | Struct | Có thể lưu trữ cặp khóa-giá trị |
| Background | Function | Trả về một context trống, thường được sử dụng làm context gốc |
| TODO | Function | Trả về một context trống, thường được sử dụng trong giai đoạn tái cấu trúc khi không có context phù hợp |
| WithCancel | Function | Tạo một context có thể hủy bỏ dựa trên context cha |
| newCancelCtx | Function | Tạo một context có thể hủy bỏ |
| propagateCancel | Function | Truyền xuống quan hệ hủy bỏ giữa các nút context |
| parentCancelCtx | Function | Tìm nút cha đầu tiên có thể hủy bỏ |
| removeChild | Function | Xóa nút con khỏi nút cha |
| init | Function | Khởi tạo gói |
| WithDeadline | Function | Tạo một context có hạn chế thời gian |
| WithTimeout | Function | Tạo một context có thời gian chờ |
| WithValue | Function | Tạo một context lưu trữ cặp khóa-giá trị |

Bảng trên hiển thị tất cả các hàm, giao diện và cấu trúc của context, cho phép nhìn tổng quan toàn bộ. Bạn có thể xem lại sau khi đọc bài viết.

Biểu đồ lớp tổng thể như sau:

![go-context-4.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/go-context-4.png)

## Interface

### Context

Bây giờ chúng ta có thể xem mã nguồn trực tiếp:

```go
type Context interface {
	// Khi context bị hủy hoặc đến hạn chót, trả về một kênh đã đóng
	Done() <-chan struct{}

	// Sau khi kênh Done đóng, trả về lý do hủy context
	Err() error

	// Trả về thời hạn chót của context và xác định liệu có tồn tại hay không
	Deadline() (deadline time.Time, ok bool)

	// Lấy giá trị tương ứng với khóa đã thiết lập trước đó
	Value(key interface{}) interface{}
}
```

`Context` là một giao diện, xác định 4 phương thức, tất cả đều là `idempotent`. Điều này có nghĩa là kết quả của việc gọi liên tiếp nhiều lần cùng một phương thức sẽ là giống nhau.

`Done()` trả về một kênh, có thể biểu thị tín hiệu của việc hủy bỏ context: khi kênh này đóng, có nghĩa là context đã bị hủy bỏ. Lưu ý rằng đây là một kênh chỉ đọc. Chúng ta cũng biết rằng đọc một kênh đã đóng sẽ trả về giá trị zero của kiểu tương ứng. Và không có nơi nào trong mã nguồn mà giá trị được đưa vào kênh này. Nói cách khác, đây là một kênh chỉ đọc. Do đó, trong goroutine con, sau khi đọc giá trị (giá trị zero) từ kênh này, chúng ta có thể thực hiện một số công việc cuối cùng và thoát càng sớm càng tốt.

`Err()` trả về một lỗi, biểu thị lý do kênh đã đóng. Ví dụ như bị hủy bỏ hay vượt quá thời gian chờ.

`Deadline()` trả về thời hạn chót của context, qua đó hàm có thể quyết định liệu có tiếp tục thực hiện các hoạt động tiếp theo hay không. Nếu thời gian quá ngắn, ta có thể không tiếp tục và tránh lãng phí tài nguyên hệ thống. Tất nhiên, cũng có thể sử dụng thời hạn chót này để đặt thời gian chờ cho một hoạt động I/O.

`Value()` lấy giá trị đã thiết lập trước đó cho khóa tương ứng.

### canceler

Tiếp theo, chúng ta xem một giao diện khác:

```go
type canceler interface {
	cancel(removeFromParent bool, err error)
	Done() <-chan struct{}
}
```

Nếu một Context đã triển khai hai phương thức được định nghĩa ở trên, điều đó có nghĩa là Context đó có thể bị hủy. Trong mã nguồn, có hai loại cấu trúc đã triển khai giao diện canceler: `*cancelCtx` và `*timerCtx`. Lưu ý rằng đó là con trỏ của hai cấu trúc này đã triển khai giao diện canceler.

Lý do thiết kế giao diện Context như vậy:

- Hoạt động "hủy bỏ" nên là một lời đề nghị, không bắt buộc

Người gọi không nên quan tâm hoặc can thiệp vào tình huống của người được gọi, quyết định làm thế nào và khi nào trả về là trách nhiệm của người được gọi. Người gọi chỉ cần gửi thông tin "hủy bỏ", người được gọi sẽ dựa trên thông tin nhận được để đưa ra quyết định tiếp theo, do đó giao diện không định nghĩa phương thức hủy bỏ.

- Hoạt động "hủy bỏ" nên có thể chuyển tiếp

Khi "hủy bỏ" một hàm nào đó, các hàm liên quan cũng nên bị "hủy bỏ". Do đó, phương thức `Done()` trả về một kênh chỉ đọc, tất cả các hàm liên quan đều lắng nghe kênh này. Khi kênh đóng, thông qua "cơ chế phát sóng" của kênh, tất cả người nghe đều nhận được thông báo.

## Struct

### emptyCtx

Sau khi định nghĩa giao diện `Context` trong mã nguồn và cung cấp một cài đặt, chúng ta có thể thấy:

```go
type emptyCtx int

func (*emptyCtx) Deadline() (deadline time.Time, ok bool) {
	return
}

func (*emptyCtx) Done() <-chan struct{} {
	return nil
}

func (*emptyCtx) Err() error {
	return nil
}

func (*emptyCtx) Value(key interface{}) interface{} {
	return nil
}
```

Nhìn vào đoạn mã này, rất đơn giản và dễ hiểu. Mỗi phương thức được triển khai một cách rất đơn giản, hoặc trả về trực tiếp, hoặc trả về giá trị nil.

Vì vậy, thực tế đây là một context trống, không bao giờ bị hủy, không lưu trữ giá trị và không có thời hạn chót.

Nó được đóng gói thành:

```go
var (
	background = new(emptyCtx)
	todo       = new(emptyCtx)
)
```

Và được tiếp cận từ bên ngoài thông qua hai hàm xuất (viết hoa chữ cái đầu):

```go
func Background() Context {
	return background
}

func TODO() Context {
	return todo
}
```

`background` thường được sử dụng trong hàm main làm nút gốc cho tất cả các context.

`todo` thường được sử dụng trong trường hợp không biết truyền context gì. Ví dụ, gọi một hàm yêu cầu tham số context, nhưng không có context nào có sẵn để truyền, bạn có thể truyền `todo`. Điều này thường xảy ra trong quá trình tái cấu trúc, khi thêm một tham số context vào một số hàm, nhưng không biết truyền gì, bạn có thể sử dụng `todo` để "đặt chỗ" và sau đó thay thế bằng context khác.

### cancelCtx

Tiếp theo, chúng ta xem một context quan trọng khác:

```go
type cancelCtx struct {
	Context

	// Các trường được bảo vệ bởi mutex
	mu       sync.Mutex
	done     chan struct{}
	children map[canceler]struct{}
	err      error
}
```

Đây là một Context có thể bị hủy, triển khai giao diện canceler. Nó trực tiếp nhúng giao diện Context như một trường ẩn danh, cho phép nó được coi là một Context.

Trước tiên, chúng ta xem cài đặt của phương thức `Done()`:

```go
func (c *cancelCtx) Done() <-chan struct{} {
	c.mu.Lock()
	if c.done == nil {
		c.done = make(chan struct{})
	}
	d := c.done
	c.mu.Unlock()
	return d
}
```

c.done được tạo ra theo cách "lười biếng", chỉ được tạo khi phương thức Done() được gọi. Một lần nữa, lưu ý rằng phương thức trả về một kênh chỉ đọc và không có nơi nào ghi dữ liệu vào kênh này. Do đó, đọc trực tiếp từ kênh này sẽ chặn goroutine. Thông thường, nó được sử dụng với câu lệnh select. Khi kênh đóng, giá trị zero sẽ được đọc ngay lập tức.

Cài đặt của phương thức `Err()` và `String()` khá đơn giản, không cần nói nhiều. Tôi khuyến nghị bạn xem mã nguồn, rất đơn giản.

Tiếp theo, chúng ta tập trung vào cài đặt của phương thức `cancel()`:

```go
func (c *cancelCtx) cancel(removeFromParent bool, err error) {
    // Phải truyền vào err
	if err == nil {
		panic("context: internal error: missing cancel error")
	}
	c.mu.Lock()
	if c.err != nil {
		c.mu.Unlock()
		return // Đã bị hủy bởi goroutine khác
	}
	// Gán giá trị cho trường err
	c.err = err
	// Đóng kênh, thông báo cho các goroutine khác
	if c.done == nil {
		c.done = closedchan
	} else {
		close(c.done)
	}
	
	// Lặp qua tất cả các con của nó
	for child := range c.children {
	    // Hủy bỏ tất cả các con đệ quy
		child.cancel(false, err)
	}
	// Đặt các con thành nil
	c.children = nil
	c.mu.Unlock()

	if removeFromParent {
	    // Xóa bỏ chính nó khỏi cha
		removeChild(c.Context, c)
	}
}
```

Tổng quan, phương thức `cancel()` đóng vai trò đóng kênh c.done, hủy bỏ tất cả các con của nó đệ quy và xóa bỏ chính nó khỏi cha. Kết quả là thông qua việc đóng kênh, tín hiệu hủy bỏ được truyền cho tất cả các con của nó. Cách goroutine nhận tín hiệu hủy bỏ là thông qua việc chọn đọc `c.done` trong câu lệnh select.

Tiếp theo, chúng ta xem cách tạo một Context có thể hủy:

```go
func WithCancel(parent Context) (ctx Context, cancel CancelFunc) {
	c := newCancelCtx(parent)
	propagateCancel(parent, &c)
	return &c, func() { c.cancel(true, Canceled) }
}

func newCancelCtx(parent Context) cancelCtx {
	return cancelCtx{Context: parent}
}
```

Đây là một phương thức được tiếp cận từ bên ngoài, nhận một Context cha (thường là `background` làm nút gốc) và trả về một Context mới, kênh done của Context mới được tạo ra (như đã đề cập trước đó).

Khi hàm `CancelFunc` được gọi hoặc kênh `done` của nút cha bị đóng (hàm `CancelFunc` của nút cha được gọi), kênh `done` của context con cũng sẽ bị đóng.

Lưu ý đối số được truyền vào hàm `WithCancel()`, đối số đầu tiên là `true`, có nghĩa là khi hủy bỏ, nó cần được xóa khỏi nút cha. Đối số thứ hai là một loại lỗi hủy cố định:

```go
var Canceled = errors.New("context canceled")
```

Chú ý rằng khi gọi phương thức `cancel()` của context con, đối số đầu tiên `removeFromParent` là `false`.

Hàm `removeChild()` sẽ xóa context hiện tại khỏi context cha:

```go
func removeChild(parent Context, child canceler) {
	p, ok := parentCancelCtx(parent)
	if !ok {
		return
	}
	p.mu.Lock()
	if p.children != nil {
		delete(p.children, child)
	}
	p.mu.Unlock()
}
```

Dòng quan trọng nhất là:

```go
delete(p.children, child)
```

Khi nào chúng ta sẽ truyền giá trị `true`? Câu trả lời là khi gọi phương thức `WithCancel()`, tức là khi tạo một context con có thể hủy, hàm `cancelFunc` trả về sẽ truyền giá trị `true`. Kết quả là khi gọi `cancelFunc` trả về, context này sẽ bị "loại bỏ" khỏi nút cha của nó, vì nút cha có thể có nhiều context con, nếu bạn tự hủy bỏ, tôi sẽ cắt đứt mối quan hệ với bạn, không ảnh hưởng đến người khác.

Trong hàm hủy bỏ, tôi biết rằng tất cả các context con của tôi sẽ trở thành "tro bụi" do `c.children = nil`. Tôi không cần phải làm bước này nữa, cuối cùng tất cả các context con của tôi sẽ bị cắt đứt mối quan hệ với tôi, không cần phải làm từng cái một. Ngoài ra, nếu trong quá trình lặp qua các context con, gọi hàm `child.cancel()` với đối số `true`, sẽ gây ra việc lặp và xóa một bản đồ đồng thời, gây ra vấn đề.

Hãy xem hàm `propagateCancel()`:

```go
func propagateCancel(parent Context, child canceler) {
	// Nút cha là một context trống
	if parent.Done() == nil {
		return // parent is never canceled
	}
	// Tìm context cha có thể hủy
	if p, ok := parentCancelCtx(parent); ok {
		p.mu.Lock()
		if p.err != nil {
			// Nút cha đã bị hủy, nút con (context con) cũng cần bị hủy
			child.cancel(false, p.err)
		} else {
			// Nút cha chưa bị hủy
			if p.children == nil {
				p.children = make(map[canceler]struct{})
			}
			// "Gắn" vào nút cha
			p.children[child] = struct{}{}
		}
		p.mu.Unlock()
	} else {
		// Nếu không tìm thấy context cha có thể hủy. Bắt đầu một goroutine để theo dõi tín hiệu hủy của nút cha hoặc nút con
		go func() {
			select {
			case <-parent.Done():
				child.cancel(false, parent.Err())
			case <-child.Done():
			}
		}()
	}
}
```

Phương thức `propagateCancel()` có tác dụng tìm kiếm context cha có thể "gắn kết" và "gắn kết" nó. Điều này cho phép truyền tín hiệu hủy từ trên xuống, hủy đồng thời tất cả các context con đã được "gắn kết".

Chúng ta cần giải thích tại sao có trường hợp `else` xảy ra. `else` đề cập đến trường hợp khi context hiện tại không tìm thấy context cha có thể hủy. Trong trường hợp này, một goroutine mới sẽ được khởi tạo để theo dõi tín hiệu hủy từ context cha hoặc context con.

Có một câu hỏi đặt ra: Tại sao lại có trường hợp `else` này? Vì `parentCancelCtx()` chỉ nhận diện ba loại context: `*cancelCtx`, `*timerCtx`, `*valueCtx`. Nếu nhúng context vào một loại khác, nó sẽ không nhận diện được.

Vì mã nguồn của gói context không nhiều, tôi đã sao chép nó và thêm một số câu lệnh in ra trong phần `else` để kiểm tra những gì đã được nói:

```go
type MyContext struct {
	Context
}

func main() {
	childCancel := true

	parentCtx, parentFunc := WithCancel(Background())
	mctx := MyContext{parentCtx}

	childCtx, childFun := WithCancel(mctx)

	if childCancel {
		childFun()
	} else {
		parentFunc()
	}

	fmt.Println(parentCtx)
	fmt.Println(mctx)
	fmt.Println(childCtx)

	time.Sleep(10 * time.Second)
}
```

Tôi không đưa ra các câu lệnh in ra trong phần `else` mà tôi đã thêm vào. Bạn có thể thử nghiệm bằng cách thêm chúng vào và xem kết quả. Chúng ta hãy xem kết quả in ra của ba context:

```shell
context.Background.WithCancel
{context.Background.WithCancel}
{context.Background.WithCancel}.WithCancel
```

Đúng như dự đoán, mctx, childCtx không giống với parentCtx bình thường, vì nó là một loại cấu trúc tùy chỉnh.

Phần mã `else` này cho thấy nếu chúng ta ép buộc context vào một cấu trúc khác và sử dụng nó làm context cha, Go sẽ khởi tạo một goroutine mới để theo dõi tín hiệu hủy, rõ ràng là một sự lãng phí.

Hãy nói thêm về việc không thể loại bỏ hai case trong câu lệnh select:

```go
select {
	case <-parent.Done():
		child.cancel(false, parent.Err())
	case <-child.Done():
}
```

Trường hợp đầu tiên cho biết nếu context cha bị hủy, thì hủy context con. Nếu loại bỏ trường hợp này, tín hiệu hủy từ context cha sẽ không được truyền đến context con.

Trường hợp thứ hai là nếu context con tự hủy, thì thoát khỏi câu lệnh select này và không quan tâm đến tín hiệu hủy từ context cha. Nếu loại bỏ trường hợp này, có thể xảy ra tình huống context cha không bao giờ bị hủy, và goroutine này sẽ bị rò rỉ. Tuy nhiên, nếu context cha bị hủy, việc hủy lặp lại context con không gây ảnh hưởng đáng kể.

### timerCtx

`timerCtx` dựa trên `cancelCtx`, chỉ khác nhau là nó có một `time.Timer` và một `deadline`. `Timer` sẽ tự động hủy bỏ context khi đến thời hạn.

```go
type timerCtx struct {
	cancelCtx
	timer *time.Timer // Dưới cancelCtx.mu.

	deadline time.Time
}
```

`timerCtx` ban đầu là một `cancelCtx`, vì vậy nó có khả năng hủy bỏ. Hãy xem phương thức `cancel()`:

```go
func (c *timerCtx) cancel(removeFromParent bool, err error) {
	// Gọi trực tiếp phương thức hủy bỏ của cancelCtx
	c.cancelCtx.cancel(false, err)
	if removeFromParent {
		// Xóa bỏ context con khỏi context cha
		removeChild(c.cancelCtx.Context, c)
	}
	c.mu.Lock()
	if c.timer != nil {
		// Dừng timer để tránh hủy bỏ lại khi đến thời hạn
		c.timer.Stop()
		c.timer = nil
	}
	c.mu.Unlock()
}
```

Phương thức tạo `timerCtx`:

```go
func WithTimeout(parent Context, timeout time.Duration) (Context, CancelFunc) {
	return WithDeadline(parent, time.Now().Add(timeout))
}
```

Hàm `WithTimeout` gọi trực tiếp `WithDeadline`, truyền thời hạn là thời điểm hiện tại cộng với `timeout`, tức là thời gian từ bây giờ cho đến khi hết `timeout`. Nói cách khác, `WithDeadline` cần thời gian tuyệt đối. Hãy xem nó:

```go
func WithDeadline(parent Context, deadline time.Time) (Context, CancelFunc) {
	if cur, ok := parent.Deadline(); ok && cur.Before(deadline) {
		// Nếu thời hạn của context cha sớm hơn thời gian chỉ định. Tạo một context có thể hủy.
		// Lý do là khi context cha hết hạn, hàm hủy sẽ tự động được gọi và context con cũng sẽ bị hủy.
		// Vì vậy, không cần xử lý riêng cho việc tự động gọi hàm hủy của context con khi hết hạn.
		return WithCancel(parent)
	}
	
	// Tạo `timerCtx`
	c := &timerCtx{
		cancelCtx: newCancelCtx(parent),
		deadline:  deadline,
	}
	// Gắn kết với context cha
	propagateCancel(parent, c)
	
	// Tính thời gian còn lại đến thời hạn
	d := time.Until(deadline)
	if d <= 0 {
		// Hủy bỏ trực tiếp
		c.cancel(true, DeadlineExceeded) // Thời hạn đã qua
		return c, func() { c.cancel(true, Canceled) }
	}
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.err == nil {
		// Sau thời gian d, `timer` sẽ tự động gọi hàm hủy. Tự động hủy bỏ
		c.timer = time.AfterFunc(d, func() {
			c.cancel(true, DeadlineExceeded)
		})
	}
	return c, func() { c.cancel(true, Canceled) }
}
```

Vẫn cần gắn kết context con với context cha, để khi context cha hủy bỏ, tín hiệu hủy bỏ được truyền xuống context con. Có một trường hợp đặc biệt là nếu deadline của context con muộn hơn deadline của context cha, tức là nếu context cha tự động hủy bỏ khi hết hạn, thì context con sẽ bị hủy bỏ chắc chắn, vì nó đã bị hủy bỏ trước khi deadline đến.

Dòng mã quan trọng nhất là:

```go
c.timer = time.AfterFunc(d, func() {
	c.cancel(true, DeadlineExceeded)
})
```

`c.timer` sẽ tự động gọi hàm hủy sau khoảng thời gian `d`, và truyền lỗi `DeadlineExceeded` vào hàm hủy:

```go
var DeadlineExceeded error = deadlineExceededError{}

type deadlineExceededError struct{}

func (deadlineExceededError) Error() string   { return "context deadline exceeded" }
```

Đó là lỗi vượt quá thời hạn.
