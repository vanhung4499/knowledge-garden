---
title: Go Unsafe Pointer
tags:
  - golang
  - interview
categories:
  - golang
  - interview
date created: 2023-10-05
date modified: 2023-10-05
---

# Sự khác biệt giữa con trỏ thường và con trỏ không unsafe.Pointer

Một trong những tác giả của ngôn ngữ Go, Ken Thompson, cũng là tác giả của ngôn ngữ C. Vì vậy, Go có thể coi là một ngôn ngữ họ C, nó có nhiều đặc điểm tương tự như C, và con trỏ là một trong số đó.

Tuy nhiên, con trỏ trong Go có nhiều hạn chế so với con trỏ trong C. Điều này đương nhiên là vì lý do an toàn, vì các ngôn ngữ hiện đại như Java/Python sợ lập trình viên mắc lỗi, không có con trỏ (ở đây là con trỏ rõ ràng). Đừng nói đến việc như C/C++ cần phải dọn dẹp "rác" bằng tay. Vì vậy, với Go, đã có con trỏ là rất tốt rồi, mặc dù nó có nhiều hạn chế.

So với tính linh hoạt của con trỏ trong ngôn ngữ C, con trỏ trong Go có một số hạn chế. Nhưng đây cũng là điểm thành công của Go: vừa có thể tận hưởng sự tiện lợi của con trỏ, vừa tránh được nguy hiểm của con trỏ.

Hạn chế thứ nhất: "Con trỏ trong Go không thể thực hiện phép toán số học".

Hãy xem một ví dụ đơn giản:

```go
a := 5
p := &a

p++
p = &a + 3
```

Mã trên sẽ không được biên dịch và sẽ báo lỗi biên dịch: "invalid operation", tức là không thể thực hiện phép toán số học trên con trỏ.

Hạn chế thứ hai: "Không thể chuyển đổi giữa các loại con trỏ khác nhau".

Ví dụ ngắn dưới đây cũng sẽ báo lỗi biên dịch:

```go
func main() {
	a := int(100)
	var f *float64
	
	f = &a
}
```

Sẽ báo lỗi biên dịch như sau:

```shell
cannot use &a (type *int) as type *float64 in assignment
```

Hạn chế thứ ba: "Không thể so sánh các con trỏ khác nhau".

Chỉ khi hai con trỏ có cùng loại hoặc có thể chuyển đổi sang nhau, mới có thể so sánh chúng. Ngoài ra, con trỏ có thể được so sánh trực tiếp với `nil` bằng `==` và `!=`.

Hạn chế thứ tư: "Không thể gán giá trị của con trỏ từ các biến con trỏ khác nhau".

Điều này tương tự như hạn chế thứ ba.

unsafe.Pointer trong gói unsafe:

```go
type ArbitraryType int

type Pointer *ArbitraryType
```

Dựa vào tên, "Arbitrary" có nghĩa là bất kỳ, tức là con trỏ có thể trỏ đến bất kỳ loại nào, thực tế nó tương tự như `void*` trong ngôn ngữ C.

Gói unsafe cung cấp 2 khả năng quan trọng:

> 1. Con trỏ của bất kỳ loại nào và unsafe.Pointer có thể chuyển đổi sang nhau.
> 2. Kiểu uintptr và unsafe.Pointer có thể chuyển đổi sang nhau.

![unsafe-0.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/unsafe-0.png)

Con trỏ không thể thực hiện trực tiếp phép toán số học, nhưng có thể chuyển đổi nó thành uintptr, thực hiện phép toán số học trên kiểu uintptr, sau đó chuyển đổi lại thành kiểu con trỏ.

```go
// uintptr là một kiểu số nguyên, đủ lớn để lưu trữ
type uintptr uintptr
```

Một điều cần lưu ý là uintptr không có ý nghĩa con trỏ, có nghĩa là đối tượng mà nó trỏ đến sẽ bị thu gom bởi garbage collector. Trong khi đó, unsafe.Pointer có ý nghĩa con trỏ, có thể bảo vệ đối tượng mà nó trỏ đến không bị thu gom khi cần thiết.

Một số hàm trong gói unsafe được thực hiện trong quá trình biên dịch, vì vậy, trình biên dịch "biết rõ" về các hoạt động phân bổ bộ nhớ. Trong đường dẫn `/usr/local/go/src/cmd/compile/internal/gc/unsafe.go`, bạn có thể thấy cách Go xử lý các hàm trong gói unsafe trong quá trình biên dịch.
