---
categories: [golang, quick-golang]
title: Error Handling
date created: 2023-03-31
date modified: 2023-07-10
tags: [golang, quick-golang]
---

## error

Xử lý lỗi là rất quan trọng, loại bỏ và ghi lại lỗi một cách hợp lý có thể đóng vai trò cấp số nhân trong việc khắc phục sự cố.

Có một mẫu tiêu chuẩn để xử lý lỗi trong Go, `error` interface được định nghĩa như sau:

```go
type error interface {
	Error() string
}
```

Đối với hầu hết các hàm, nếu cần trả về một lỗi, thì về cơ bản, `error` sẽ là giá trị cuối cùng trong nhiều giá trị trả về, ví dụ:

```go
package main

import "fmt"

func main() {
	n, err := echo(10)
	if err != nil {
		fmt.Println("error: " + err.Error())
	} else {
		fmt.Println(n)
	}
}

func echo(param int) (int, error) {
	return param, nil
}
```

Chúng ta cũng có thể sử dụng một kiểu `error`, chẳng hạn như gọi phương thức `os.Stat` của thư viện chuẩn và lỗi trả về là kiểu tùy chỉnh:

```go
type PathError struct {
	Op string
	Path string
	Err error
}

func (e *PathError) Error() string {
	return e.Op + " " + e.Path + ": " + e.Err.Error()
}
```

Bạn tạm thời không hiểu cũng không sao, sau khi bạn tìm hiểu interface, sau đó xem lại code này, nó sẽ tự nhiên trở nên rõ ràng.

## defer

Gọi hàm trễ, `defer` theo sau là hàm, nhưng hàm sẽ không được thực thi ngay mà đợi chương trình chứa nó kết thúc (tức là hàm chứa nó thực thi lệnh `return` và tự động trả về goroutine tương ứng `panic`) , hàm `defer` sẽ được thực thi.

Thường được sử dụng để giải phóng tài nguyên, in nhật ký, bắt ngoại lệ, v.v.

```go
func main() {
	f, err := os.Open(filename)
	if err != nil {
		return err
	}
	/**
	** 
	** Nếu file không được mở thành công, thì không cần thực hiện thao tác đóng file
	** Nếu err không phải là nil và đóng file, có thể xảy ra panic
	*/
	defer f.Close()
}
```

Các câu lệnh `defer` thường đi theo cặp, chẳng hạn như mở và đóng, kết nối và ngắt kết nối, khóa và mở khóa.

Câu lệnh `defer` được thực hiện sau câu lệnh `return`.

```go
package main

import (
	"fmt"
)

func main() {
	fmt.Println(triple(4)) // 12
}

func double(x int) (result int) {
	defer func() {
		fmt.Printf("double(%d) = %d\n", x, result)
	}()
	return x + x
}

func triple(x int) (result int) {
	defer func() {
		result += x
	}()

	return double(x)
}
```

Không sử dụng câu lệnh `defer` trong vòng lặp `for`, vì câu lệnh `defer` sẽ không được thực thi cho đến thời điểm cuối cùng của hàm, vì vậy đoạn code sau sẽ không đóng file mỗi lần lặp mà chờ tới cuối hàm rồi đóng nhiều lần.

```go
for _, filename := range filenames {
	f, err := os.Open(filename)
	if err != nil {
		return err
	}
	defer f.Close()
}
```

Một giải pháp là viết một hàm riêng cho thân vòng lặp, để hàm đóng sẽ được gọi mỗi khi vòng lặp được thực thi.

```go
for _, filename := range filenames {
	if err := doFile(filename); err != nil {
		return err
	}
} 

func doFile(filename string) error {
	f, err := os.Open(filename)
	if err != nil {
		return err
	}
	defer f.Close()
}
```

Các câu lệnh `defer` được thực thi theo thứ tự ngược lại với vị trí câu lệnh `defer`, vào sau ra ra trước (FILO giống stack).

```go
package main

import (
	"fmt"
)

func main() {
	defer func() {
		fmt.Println("first")
	}()

	defer func() {
		fmt.Println("second")
	}()

	fmt.Println("done")
}

// done
// second
// first
```

## panic và recover

Nói chung, ghi nhật ký lỗi trong chương trình có thể giúp chúng tôi nhanh chóng xác định vấn đề khi gặp ngoại lệ.

Nhưng vẫn còn một số lỗi nghiêm trọng hơn, chẳng hạn như truy cập mảng ngoài giới hạn, chương trình sẽ chủ động gọi để ném ra một ngoại lệ `panic`, sau đó thoát khỏi chương trình.

Nếu không muốn thoát chương trình, bạn có thể sử dụng `recover` chức năng chụp và khôi phục.

Nó cảm thấy rất khó hiểu, nhưng khi bạn nghĩ về nó một cách cẩn thận, nó thực sự không khác gì `try-catch`.

Chúng ta hãy xem các định nghĩa của hai hàm sau:

```go
func panic(interface{})
func recover() interface{}
```

Hàm `panic` có kiểu tham số là `interface{}`, vì vậy có thể nhận bất kỳ loại tham số nào, chẳng hạn như:

```go
panic(404)
panic("network broken")
panic(Error("file not exists"))
```

Nó cần được thực thi trong hàm `defer`, ví dụ:

```go
package main

import (
	"fmt"
)

func main() {
	G()
}

func G() {
	defer func() {
		fmt.Println("c")
	}()
	F()
	fmt.Println("Continue")
}

func F() {
	defer func() {
		if err := recover(); err != nil {
			fmt.Println("Catch Exception:", err)
		}
		fmt.Println("b")
	}()

	panic("a")
}
```

Kết quả：

```
Catch Exception: a
b
Continue
c
```

Ngoại lệ được đưa vào `F()` bị `G()` bắt và quá trình thực thi có thể tiếp tục bình thường. Nếu `F()` không bị bắt, thì `panic` sẽ được chuyển lên trên, trực tiếp gây ra ngoại lệ trong `G()` và sau đó chương trình sẽ thoát.

Một kịch bản khác là khi chúng ta tự gỡ lỗi chương trình, chúng ta có thể sử dụng `panic` ngắt chương trình và đưa ra một ngoại lệ để khắc phục sự cố.
