---
title: Go Context Find Value
tags:
  - golang
  - interview
categories:
  - golang
  - interview
date created: 2023-10-05
date modified: 2023-10-05
---

# Quá trình tìm kiếm của context.Value diễn ra như thế nào?

```go
type valueCtx struct {
	Context
	key, val interface{}
}
```

Nó triển khai hai phương thức:

```go
func (c *valueCtx) String() string {
	return fmt.Sprintf("%v.WithValue(%#v, %#v)", c.Context, c.key, c.val)
}

func (c *valueCtx) Value(key interface{}) interface{} {
	if c.key == key {
		return c.val
	}
	return c.Context.Value(key)
}
```

Vì nó trực tiếp nhúng Context như một trường ẩn danh, nên mặc dù nó chỉ triển khai 2 phương thức, các phương thức khác được kế thừa từ context cha. Nhưng nó vẫn là một Context, đây là một đặc điểm của ngôn ngữ Go.

Hàm tạo valueCtx:

```go
func WithValue(parent Context, key, val interface{}) Context {
	if key == nil {
		panic("nil key")
	}
	if !reflect.TypeOf(key).Comparable() {
		panic("key is not comparable")
	}
	return &valueCtx{parent, key, val}
}
```

Yêu cầu về key là có thể so sánh, vì sau đó cần lấy giá trị từ context bằng key, việc so sánh là bắt buộc.

Bằng cách truyền context qua các lớp, cuối cùng tạo thành một cây như sau:

![context-2.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/context-2.png)

Nó giống một danh sách liên kết, chỉ khác là hướng của nó ngược lại: Context trỏ đến nút cha của nó, trong khi danh sách liên kết trỏ đến nút tiếp theo. Bằng cách sử dụng hàm WithValue, có thể tạo ra các nút valueCtx lồng nhau, lưu trữ các biến có thể được chia sẻ giữa các goroutine.

Quá trình lấy giá trị thực tế là một quá trình tìm kiếm đệ quy:

```go
func (c *valueCtx) Value(key interface{}) interface{} {
	if c.key == key {
		return c.val
	}
	return c.Context.Value(key)
}
```

Nó sẽ tìm kiếm theo chuỗi liên kết lên, so sánh key hiện tại với key cần tìm. Nếu trùng khớp, nó sẽ trả về giá trị. Nếu không, nó sẽ tiếp tục tìm kiếm theo context cha cho đến khi đến nút gốc (thường là emptyCtx), rồi trả về nil. Vì vậy, khi sử dụng phương thức Value, cần kiểm tra xem kết quả có phải là nil hay không.

Vì quá trình tìm kiếm diễn ra theo hướng lên, nên không thể lấy giá trị nút con từ nút cha nhưng nút con có thể lấy giá trị của nút cha.

Quá trình tạo nút context bằng `WithValue` thực chất là quá trình tạo nút danh sách liên kết. Hai nút có thể có cùng giá trị key, nhưng chúng là hai nút context khác nhau. Trong quá trình tìm kiếm, chỉ tìm thấy nút context cha gần nhất được gắn vào. Do đó, về tổng thể, những gì được xây dựng bằng `WithValue` thực sự là một danh sách liên kết không hiệu quả.

Nếu bạn đã tham gia vào một dự án, chắc chắn bạn đã gặp phải tình huống khó xử này: trong quá trình xử lý, có nhiều hàm con, goroutine con. Nhiều nơi khác nhau chèn các cặp key-value khác nhau vào context, và cuối cùng sử dụng chúng ở một nơi nào đó.

Bạn thực sự không biết khi nào và ở đâu giá trị được truyền? Những giá trị này có bị "ghi đè" không (lớp dưới cùng là hai nút context khác nhau và khi tìm kiếm sẽ chỉ trả về một kết quả)? Bạn chắc chắn sẽ gặp khó khăn.

Đây cũng là lý do tại sao `context.Value` gây tranh cãi nhiều nhất. Nhiều người khuyến nghị tránh truyền giá trị qua context.
