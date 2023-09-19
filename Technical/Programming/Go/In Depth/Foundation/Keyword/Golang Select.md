---
title: Golang Select
tags:
  - golang
categories: golang
date created: 2023-09-13
date modified: 2023-09-13
---

# Golang Select

`select` là một cuộc gọi hệ thống trong hệ điều hành, chúng ta thường sử dụng các hàm `select`, `poll` và `epoll` để xây dựng mô hình I/O multiplexing nhằm tăng hiệu suất của chương trình. `select` trong ngôn ngữ Go tương tự như `select` trong hệ điều hành, phần này sẽ giới thiệu về các hiện tượng, cấu trúc dữ liệu và nguyên tắc triển khai của từ khóa `select` trong Go.

Trong ngôn ngữ C, hàm `select` cho phép theo dõi trạng thái có thể đọc hoặc ghi của nhiều mô tả tập tin cùng một lúc. Tương tự, `select` trong Go cũng cho phép Goroutine đợi đồng thời nhiều Channel có thể đọc hoặc ghi, trước khi một trong số các tập tin hoặc Channel thay đổi trạng thái, `select` sẽ tiếp tục chặn luồng hoặc Goroutine hiện tại.

![Golang-Select-Channels](https://img.draveness.me/2020-01-19-15794018429532-Golang-Select-Channels.png)

`select` là một cấu trúc điều khiển tương tự như `switch`, khác biệt duy nhất là các biểu thức trong `select` phải là các hoạt động nhận hoặc gửi trên Channel. Đoạn mã dưới đây là một ví dụ về cấu trúc `select` chứa các hoạt động nhận và gửi trên Channel:

```go
func fibonacci(c, quit chan int) {
	x, y := 0, 1
	for {
		select {
		case c <- x:
			x, y = y, x+y
		case <-quit:
			fmt.Println("quit")
			return
		}
	}
}
```

Cấu trúc điều khiển trên sẽ đợi cho đến khi một trong hai biểu thức `c <- x` hoặc `<-quit` trả về. Bất kể biểu thức nào trả về, chương trình sẽ ngay lập tức thực thi mã trong `case` tương ứng. Khi cả hai `case` trong `select` đều được kích hoạt cùng một lúc, một trong số chúng sẽ được thực thi ngẫu nhiên.

## 1. Hiện tượng

Khi sử dụng từ khóa `select` trong Go, chúng ta sẽ gặp hai hiện tượng thú vị:

1. `select` có thể thực hiện các hoạt động nhận và gửi trên Channel mà không chặn;
2. Khi có nhiều Channel đồng thời phản hồi, `select` sẽ thực hiện một trong các trường hợp một cách ngẫu nhiên;

Đây là hai hiện tượng mà chúng ta thường gặp khi học về `select`, chúng ta sẽ tìm hiểu cụ thể về các tình huống và phân tích nguyên tắc thiết kế đằng sau hai hiện tượng này.

### Hoạt động nhận và gửi không chặn

Thông thường, câu lệnh `select` sẽ chặn Goroutine hiện tại và đợi cho đến khi một trong số các Channel có thể nhận hoặc gửi dữ liệu. Tuy nhiên, nếu câu lệnh `select` chứa câu lệnh `default`, thì khi thực thi câu lệnh `select`, chúng ta sẽ gặp hai trường hợp sau:

1. Khi có Channel có thể nhận hoặc gửi, thực hiện trường hợp tương ứng với Channel đó;
2. Khi không có Channel nào có thể nhận hoặc gửi, thực hiện mã trong `default`;

Khi chạy đoạn mã dưới đây, Goroutine hiện tại sẽ không bị chặn, nó sẽ ngay lập tức thực thi mã trong `default`.

```go
func main() {
	ch := make(chan int)
	select {
	case i := <-ch:
		println(i)

	default:
		println("default")
	}
}

$ go run main.go
default
```

Chỉ cần suy nghĩ một chút, chúng ta sẽ nhận ra rằng hiện tượng này được thiết kế rất hợp lý. Mục đích của `select` là theo dõi đồng thời nhiều `case` xem có thể thực hiện hay không, nếu không có Channel nào có thể thực hiện, việc thực hiện `default` là điều đương nhiên.

Hoạt động nhận và gửi không chặn trên Channel vẫn rất cần thiết, trong nhiều tình huống chúng ta không muốn hoạt động trên Channel chặn Goroutine hiện tại, chỉ muốn kiểm tra trạng thái có thể đọc hoặc ghi của Channel. Ví dụ dưới đây minh họa việc này:

```go
errCh := make(chan error, len(tasks))
wg := sync.WaitGroup{}
wg.Add(len(tasks))
for i := range tasks {
    go func() {
        defer wg.Done()
        if err := tasks[i].Run(); err != nil {
            errCh <- err
        }
    }()
}
wg.Wait()

select {
case err := <-errCh:
    return err
default:
    return nil
}
```

Trong đoạn mã trên, chúng ta không quan tâm có bao nhiêu nhiệm vụ thất bại, chỉ quan tâm liệu có nhiệm vụ nào trả về lỗi hay không. Câu lệnh `select` cuối cùng sẽ thực hiện công việc này một cách tốt. Tuy nhiên, việc sử dụng `select` để thực hiện hoạt động nhận và gửi không chặn không phải là thiết kế ban đầu, trong phiên bản ban đầu của Go, việc sử dụng `x, ok := <-c` để thực hiện hoạt động nhận và gửi không chặn, dưới đây là các commit liên quan đến hoạt động nhận và gửi không chặn:

1. [select default](https://github.com/golang/go/commit/79fbbe37a76502e6f5f9647d2d82bab953ab1546) commit đã hỗ trợ từ khóa `default` trong câu lệnh `select`[1](#fn:1).
2. [gc: special case code for single-op blocking and non-blocking selects](https://github.com/golang/go/commit/5038792837355abde32f2e9549ef132fc5ffbd16) commit đã giới thiệu hoạt động nhận và gửi không chặn dựa trên `select`[2](#fn:2).
3. [gc: remove non-blocking send, receive syntax](https://github.com/golang/go/commit/cb584707af2d8803adba88fd9692e665ecd2f059) commit đã xóa cú pháp `x, ok := <-c`[3](#fn:3).
4. [gc, runtime: replace closed(c) with x, ok := <-c](https://github.com/golang/go/commit/8bf34e335686816f7fe7e28614b2c7a3e04e9e7c) commit đã sử dụng cú pháp `x, ok := <-c` thay thế cú pháp `closed(c)` để kiểm tra trạng thái đóng của Channel.

Chúng ta có thể thấy sự phát triển của hoạt động nhận và gửi không chặn từ phiên bản ban đầu đến hiện tại.
