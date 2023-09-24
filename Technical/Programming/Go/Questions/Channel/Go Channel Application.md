---
title: Go Channel Application
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-22
date modified: 2023-09-22
---

# Go Channel: Application

Kết hợp giữa Channel và goroutine là một công cụ mạnh mẽ trong lập trình đồng thời của Go. Ứng dụng thực tế của Channel thường khiến người ta ngạc nhiên, thông qua việc kết hợp với select, cancel, timer và các thành phần khác, nó có thể thực hiện nhiều chức năng khác nhau. Tiếp theo, chúng ta sẽ tìm hiểu về các ứng dụng của channel.

# Tín hiệu dừng

Chúng ta đã nói rất nhiều về "cách đóng channel một cách tinh tế" trong phần trước, vì vậy chúng ta sẽ bỏ qua phần này.

Có nhiều tình huống trong đó channel được sử dụng để gửi tín hiệu dừng, thường là đóng một channel hoặc gửi một phần tử vào channel để thông báo cho phía nhận biết thông tin này và thực hiện một số hoạt động khác.

# Lập lịch công việc

Kết hợp với timer, có hai cách chơi chính: thực hiện kiểm soát thời gian chờ và thực hiện định kỳ một nhiệm vụ nào đó.

Đôi khi, chúng ta cần thực hiện một hoạt động nào đó, nhưng không muốn nó mất quá nhiều thời gian, một timer đơn giản có thể giải quyết vấn đề này:

```go
select {
	case <-time.After(100 * time.Millisecond):
	case <-s.stopc:
		return false
}
```

Sau 100 ms, nếu s.stopc vẫn chưa đọc được dữ liệu hoặc đã bị đóng, chúng ta sẽ kết thúc ngay lập tức. Đây là một ví dụ từ mã nguồn của etcd, cách viết như vậy thấy khá phổ biến.

Thực hiện một nhiệm vụ định kỳ cũng khá đơn giản:

```go
func worker() {
	ticker := time.Tick(1 * time.Second)
	for {
		select {
		case <- ticker:
			// Thực hiện nhiệm vụ định kỳ
			fmt.Println("Thực hiện nhiệm vụ định kỳ sau 1 giây")
		}
	}
}
```

Mỗi giây, nhiệm vụ định kỳ sẽ được thực hiện một lần.

# Tách biệt nguồn sản xuất và người tiêu dùng

Khi dịch vụ khởi động, chúng ta khởi động n worker như là một pool goroutine, các goroutine này làm việc trong một vòng lặp vô hạn `for {}`, tiêu thụ công việc từ một channel cụ thể và thực hiện:

```go
func main() {
	taskCh := make(chan int, 100)
	go worker(taskCh)

    // Gửi công việc vào channel
	for i := 0; i < 10; i++ {
		taskCh <- i
	}

    // Chờ 1 giờ
	select {
	case <-time.After(time.Hour):
	}
}

func worker(taskCh <-chan int) {
	const N = 5
	// Khởi động 5 goroutine làm việc
	for i := 0; i < N; i++ {
		go func(id int) {
			for {
				task := <- taskCh
				fmt.Printf("hoàn thành công việc: %d bởi worker %d\n", task, id)
				time.Sleep(time.Second)
			}
		}(i)
	}
}
```

5 goroutine làm việc liên tục lấy công việc từ hàng đợi công việc, nguồn sản xuất chỉ cần gửi công việc vào channel và không quan tâm đến việc tiêu thụ.

Kết quả chương trình:

```shell
hoàn thành công việc: 1 bởi worker 4
hoàn thành công việc: 2 bởi worker 2
hoàn thành công việc: 4 bởi worker 3
hoàn thành công việc: 3 bởi worker 1
hoàn thành công việc: 0 bởi worker 0
hoàn thành công việc: 6 bởi worker 0
hoàn thành công việc: 8 bởi worker 3
hoàn thành công việc: 9 bởi worker 1
hoàn thành công việc: 7 bởi worker 4
hoàn thành công việc: 5 bởi worker 2
```

# Kiểm soát số lượng đồng thời

Đôi khi chúng ta cần thực hiện hàng trăm nhiệm vụ theo lịch trình, ví dụ như thực hiện các nhiệm vụ tính toán ngoại tuyến theo thành phố hàng ngày. Tuy nhiên, số lượng đồng thời không thể quá cao vì quá trình thực hiện nhiệm vụ phụ thuộc vào một số tài nguyên bên thứ ba và có giới hạn về tốc độ yêu cầu. Trong trường hợp này, chúng ta có thể sử dụng channel để kiểm soát số lượng đồng thời.

Xem ví dụ dưới đây:

```go
var limit = make(chan int, 3)

func main() {
    // …………
    for _, w := range work {
        go func() {
            limit <- 1
            w()
            <-limit
        }()
    }
    // …………
}
```

Chúng ta tạo một channel có bộ đệm với dung lượng là 3. Tiếp theo, chúng ta lặp qua danh sách các nhiệm vụ và mỗi nhiệm vụ sẽ khởi động một goroutine để thực hiện. Việc thực sự thực hiện nhiệm vụ và truy cập vào tài nguyên bên thứ ba được thực hiện trong hàm w(). Trước khi thực hiện w(), chúng ta phải lấy "giấy phép" từ limit, chỉ khi lấy được giấy phép, chúng ta mới có thể thực hiện w(). Sau khi hoàn thành nhiệm vụ, chúng ta trả lại "giấy phép". Điều này giúp kiểm soát số lượng goroutine đồng thời.

Ở đây, `limit <- 1` được đặt trong hàm con bên trong thay vì bên ngoài vì:

> Nếu đặt bên ngoài, nó sẽ kiểm soát số lượng goroutine của hệ thống và có thể làm chặn vòng lặp for, ảnh hưởng đến logic kinh doanh.

> limit thực sự không liên quan đến logic, chỉ là tinh chỉnh hiệu suất, đặt nó bên trong và bên ngoài có ý nghĩa ngữ nghĩa khác nhau.

Một điều cần lưu ý khác là nếu w() gặp lỗi panic, "giấy phép" có thể không được trả lại. Do đó, chúng ta cần sử dụng defer để đảm bảo điều này.
