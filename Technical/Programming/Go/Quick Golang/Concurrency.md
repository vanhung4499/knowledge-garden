---
categories: [golang, quick-golang]
title: Concurrency
date created: 2023-07-04
date modified: 2023-07-10
tags: [golang, quick-golang]
---

## goroutine

Đơn vị Concurency của ngôn ngữ Go được gọi là **goroutine** và sử dụng từ khóa `go` để bắt đầu một goroutine.

Từ khóa `go` phải được theo sau bởi hàm, có thể là hàm được đặt tên hoặc hàm không tên và giá trị trả về của hàm sẽ bị bỏ qua.

Việc thực thi `go` không bị chặn (non-blocking).

Trước tiên hãy xem một ví dụ:

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	go spinner(100 * time.Millisecond)
	const n = 45
	fibN := fib(n)
	fmt.Printf("\rFibonacci(%d) = %d\n", n, fibN)
	// Fibonacci(45) = 1134903170
}

func spinner(delay time.Duration) {
	for {
		for _, r := range `-\|/` {
			fmt.Printf("\r%c", r)
			time.Sleep(delay)
		}
	}
}

func fib(x int) int {
	if x < 2 {
		return x
	}
	return fib(x - 1) + fib(x - 2)
}
```

Xét từ kết quả thực thi, giá trị của dãy Fibonacci được tính toán thành công, cho biết chương trình không bị chặn tại `spinner`, và hàm `spinner` tiếp tục in các ký tự trên màn hình, cho biết chương trình đang được thực thi.

Khi giá trị của dãy Fibonacci được tính toán xong, hàm `main` sẽ in kết quả và thoát, đồng thời spinner cũng thoát.

Hãy xem một ví dụ khác, thực hiện vòng lặp 10 lần và in tổng của hai số:

```go
package main

import "fmt"

func Add(x, y int) {
	z := x + y
	fmt.Println(z)
}

func main() {
	for i := 0; i < 10; i++ {
		go Add(i, i)
	}
}
```

Có một vấn đề, không có gì trên màn hình, tại sao?

Điều này phụ thuộc vào cơ chế thực thi của chương trình Go. Khi một chương trình bắt đầu, chỉ có một goroutine duy nhất gọi hàm `main`, được gọi là main goroutine. Các goroutine mới được tạo với từ khóa `go` và được thực thi đồng thời. Khi hàm `main` trở lại, nó không đợi các goroutine khác thực thi xong mà kết thúc tất cả các goroutine một cách cưỡng chế.

Có cách nào để giải quyết nó? Tất nhiên là có, xin vui lòng đọc dưới đây.

## channel

Nói chung, khi viết các chương trình đa luồng (multi threading), bạn sẽ gặp một vấn đề: giao tiếp giữa các thread. Các phương thức giao tiếp phổ biến bao gồm tín hiệu, bộ nhớ dùng chung, v.v. Cơ chế giao tiếp giữa các goroutine là **channel**.

Tại **channel** bằng hàm `make`：

```go
ch := make(chan int) // ch thuộc kiểu chan int
```

Channel hỗ trợ 3 hoạt động chính：`send`，`receive` và `close`.

```go
ch <- x // send
x = <-ch // receive
<-ch // receive and destroy value

close(ch) // close
```

### unbuffered channel

Hàm `make` chấp nhận hai tham số, tham số thứ hai là tham số tùy chọn, cho biết dung lượng channel. Bỏ qua hoặc đặt bằng 0 để tạo unbuffered channel.

Thao tác gửi trên unbuffered channel sẽ bị chặn cho đến khi một goroutine khác thực hiện thao tác nhận trên channel tương ứng. Ngược lại, nếu việc nhận được thực hiện trước, thì goroutine nhận sẽ chặn cho đến khi một con goroutine khác thực hiện việc gửi trên kênh tương ứng.

![Pasted image 20230405135948](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230405135948.png)

Vì vậy, một unbuffered channel là một channel đồng bộ.

Hãy sử dụng một unbuffered channel để giải quyết các vấn đề trong ví dụ trên.

```go
package main

import "fmt"

func Add(x, y int, ch chan int) {
	z := x + y
	ch <- z
}

func main() {
	ch := make(chan int)
	for i := 0; i < 10; i++ {
		go Add(i, i, ch)
	}
	for i := 0; i < 10; i++ {
		fmt.Println(<-ch)
	}
}
```

Kết quả có thể được xuất ra bình thường.

`main` goroutine sẽ bị block, cho đến khi nó đọc giá trị từ channel, chương trình tiếp tục thực thi và cuối cùng thoát.

### buffered channel

Tạo một channel với bộ đệm với dung lượng 5:

```go
ch := make(chan int, 5)
```

Thao tác gửi trên **buffered channel** sẽ chèn một phần tử vào cuối channel và thao tác nhận sẽ loại bỏ một phần tử khỏi phần đầu của channel. Nếu channel đầy, việc gửi sẽ bị block cho đến khi một goroutine khác thực hiện việc nhận. Ngược lại, nếu channel trống, việc nhận sẽ chặn cho đến khi một goroutine khác thực hiện gửi.

![Pasted image 20230405135926](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230405135926.png)

Bạn có cảm thấy rằng, trên thực tế, các buffered channel giống như các hàng đợi (queue).

### Unidirection channel (channel một chiều)

Kiểu `chan<- int` là channel chỉ có thể gửi và kiểu `<-chan int` là channel chỉ có thể nhận.

Bất kỳ channel hai chiều nào cũng có thể được sử dụng làm channel một chiều.

Một điều cần lưu ý nữa là `close` chỉ có thể được sử dụng trên channel gửi và sẽ báo lỗi nếu nó được sử dụng trên channel nhận.

Xem ví dụ về channel một chiều:

```go
package main

import "fmt"

func counter(out chan<- int) {
	for x := 0; x < 10; x++ {
		out <- x
	}
	close(out)
}

func squarer(out chan<- int, in <-chan int) {
	for v := range in {
		out <- v * v
	}
	close(out)
}

func printer(in <-chan int) {
	for v := range in {
		fmt.Println(v)
	}
}

func main() {
	n := make(chan int)
	s := make(chan int)
	go counter(n)
	go squarer(s, n)
	printer(s)
}
```

## sync

Package `sync` cung cấp hai kiểu: `sync.Mutex` và `sync.RWMutex`, kiểu thứ nhất là một mutex và kiểu thứ hai là read-write mutex.

Khi một goroutine lấy được `Mutex`, những goroutine khác chỉ có thể đợi cho đến khi mutex được giải phóng bất kể đọc hay viết.

```go
package main

import (
	"fmt"
	"sync"
	"time"
)

func main() {
	var mutex sync.Mutex
	wg := sync.WaitGroup{}

	// main goroutine có được mutex đầu tiên
	fmt.Println("Locking (G0)")
	mutex.Lock()
	fmt.Println("locked (G0)")
	
	wg.Add(3)
	for i := 1; i < 4; i++ {
		go func(i int) {
			// Do main goroutine đã bị lock lúc đầu nên chương trình sẽ dừng ở đây 5s
			fmt.Printf("Locking (G%d)\n", i)
			mutex.Lock()
			fmt.Printf("locked (G%d)\n", i)
			
			time.Sleep(time.Second * 2)
			mutex.Unlock()
			fmt.Printf("unlocked (G%d)\n", i)
			
			wg.Done()
		}(i)
	}

	// main goroutine được mutex unlock sau 5 giây
	time.Sleep(time.Second * 5)
	fmt.Println("ready unlock (G0)")
	mutex.Unlock()
	fmt.Println("unlocked (G0)")

	wg.Wait()
}
```

`RWMutex` thuộc mô hình một lần ghi nhiều lần đọc cổ điển, khi mutex đọc bị chiếm dụng, nó sẽ ngăn ghi nhưng không ngăn đọc. Mutex ghi ngăn chặn cả viết và đọc.

```go
package main

import (
	"fmt"
	"sync"
	"time"
)

func main() {
	var rwMutex sync.RWMutex
	wg := sync.WaitGroup{}

	Data := 0
	wg.Add(20)
	
	for i := 0; i < 10; i++ {
		go func(t int) {
			// Sau lần chạy đầu tiên, viết unlock.
            // Khi lặp đến lần thứ hai, sau khi chặn đọc, goroutine không bị chặn và đọc thành công.
			fmt.Println("Locking")
			rwMutex.RLock()
			defer rwMutex.RUnlock()
			fmt.Printf("Read data: %v\n", Data)
			wg.Done()
			time.Sleep(2 * time.Second)
		}(i)

		go func(t int) {
			// Dưới mutex ghi, nó cần được unlock trước
			rwMutex.Lock()
			defer rwMutex.Unlock()
			Data += t
			fmt.Printf("Write Data: %v %d \n", Data, t)
			wg.Done()
			time.Sleep(2 * time.Second)
		}(i)
	}

	wg.Wait()
}
```
