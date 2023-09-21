---
title: Go Interface Detect Impl
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-21
date modified: 2023-09-21
---

# Go Interface: Detect Impliment

Thường xuyên thấy một số cách sử dụng kỳ lạ như sau trong các thư viện mã nguồn mở:

```go
var _ io.Writer = (*myWriter)(nil)
```

Khi gặp điều này, có thể cảm thấy mơ hồ và không biết tác giả đang muốn làm gì. Thực tế, đây chính là câu trả lời cho vấn đề này. Trình biên dịch sẽ kiểm tra xem kiểu `*myWriter` có thực hiện giao diện `io.Writer` hay không.

Hãy xem một ví dụ:

```go
package main

import "io"

type myWriter struct {

}

/*func (w myWriter) Write(p []byte) (n int, err error) {
	return
}*/

func main() {
    // Kiểm tra xem kiểu *myWriter có thực hiện giao diện io.Writer hay không
    var _ io.Writer = (*myWriter)(nil)

    // Kiểm tra xem kiểu myWriter có thực hiện giao diện io.Writer hay không
    var _ io.Writer = myWriter{}
}
```

Sau khi chú thích phần định nghĩa hàm Write cho myWriter, chạy chương trình:

```go
src/main.go:14:6: cannot use (*myWriter)(nil) (type *myWriter) as type io.Writer in assignment:
	*myWriter does not implement io.Writer (missing Write method)
src/main.go:15:6: cannot use myWriter literal (type myWriter) as type io.Writer in assignment:
	myWriter does not implement io.Writer (missing Write method)
```

Thông báo lỗi: *myWriter/myWriter không thực hiện giao diện io.Writer, tức là không có phương thức Write.

Bỏ chú thích và chạy chương trình, không có lỗi.

Thực tế, câu gán trên sẽ chuyển đổi kiểu một cách ngầm định, trong quá trình chuyển đổi, trình biên dịch sẽ kiểm tra xem kiểu bên phải của dấu bằng có thực hiện các hàm được quy định trong giao diện bên trái hay không.

Tóm lại, có thể thêm mã tương tự như sau vào mã nguồn để kiểm tra xem kiểu có thực hiện giao diện hay không:

```go
var _ io.Writer = (*myWriter)(nil)
var _ io.Writer = myWriter{}
```
