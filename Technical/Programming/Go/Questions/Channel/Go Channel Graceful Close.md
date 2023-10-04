---
title: Go Channel Graceful Close
tags:
  - golang
  - interview
categories:
  - golang
  - interview
date created: 2023-10-04
date modified: 2023-10-04
---

# Go Channel: Graceful Close

Về việc sử dụng channel, có một số khó khăn như sau:

1. Không thể biết được một channel đã được đóng hay chưa mà không thay đổi trạng thái của channel.
2. Đóng một channel đã đóng sẽ gây ra panic. Do đó, việc đóng một channel mà không biết trước trạng thái của nó là rất nguy hiểm.
3. Gửi dữ liệu vào một channel đã đóng sẽ gây ra panic. Do đó, việc gửi dữ liệu vào channel mà không biết trước trạng thái của nó là rất nguy hiểm.

Một hàm kiểm tra đơn giản xem một channel đã được đóng hay chưa:

```go
func IsClosed(ch <-chan T) bool {
	select {
	case <-ch:
		return true
	default:
	}

	return false
}

func main() {
	c := make(chan T)
	fmt.Println(IsClosed(c)) // false
	close(c)
	fmt.Println(IsClosed(c)) // true
}
```

Nhìn vào đoạn code trên, thực tế có nhiều vấn đề. Trước tiên, hàm IsClosed là một hàm có tác động phụ. Mỗi lần gọi, nó sẽ đọc một phần tử từ channel, thay đổi trạng thái của channel. Đây không phải là một hàm tốt, nên hãy làm công việc của nó một cách rõ ràng!

Thứ hai, kết quả trả về từ hàm IsClosed chỉ đại diện cho thời điểm gọi hàm đó, không đảm bảo rằng sau khi gọi hàm, có thể có các goroutine khác thực hiện các hoạt động khác trên channel, thay đổi trạng thái của nó. Ví dụ, hàm IsClosed trả về true, nhưng tại thời điểm đó có một goroutine khác đóng channel, và bạn vẫn giữ thông tin "channel chưa đóng" lỗi thời đó, gửi dữ liệu vào nó sẽ gây ra panic. Tất nhiên, một channel không thể bị đóng hai lần, nếu kết quả trả về từ hàm IsClosed là true, điều đó có nghĩa là channel đã thực sự bị đóng.

Có một nguyên tắc phổ biến khi đóng channel:

> don't close a channel from the receiver side and don't close a channel if the channel has multiple concurrent senders.

Không nên đóng channel từ phía nhận dữ liệu và không nên đóng channel nếu channel có nhiều sender.

Tuy nhiên, điều trên không phải là điều quan trọng nhất, nguyên tắc quan trọng nhất chỉ có một:

> don't close (or send values to) closed channels.

Có hai cách không quá tinh tế để đóng channel:

1. Sử dụng cơ chế defer-recover, đóng channel hoặc gửi dữ liệu vào channel một cách tự tin. Ngay cả khi xảy ra panic, defer-recover sẽ đảm bảo việc đóng channel.
2. Sử dụng sync.Once để đảm bảo chỉ đóng một lần.

Vậy làm sao để đóng channel một cách tinh tế?

Dựa trên số lượng sender và reciever, chia thành các trường hợp sau:

1. 1 sender, 1 reciever
2. 1 sender, M reciever
3. N sender, 1 reciever
4. N sender, M reciever

Đối với trường hợp 1, 2, chỉ có một sender, không cần phải nói nhiều, chỉ cần đóng từ phía sender là được, không có vấn đề. Tập trung vào trường hợp 3, 4.

Trong trường hợp 3, phương pháp tinh tế để đóng channel là: the only receiver says "please stop sending more" by closing an additional signal channel。

Giải pháp là thêm một channel truyền tín hiệu để truyền tín hiệu đóng channel từ reciever. Reciever sẽ gửi tín hiệu đóng channel qua channel tín hiệu. sender nghe thấy tín hiệu đóng channel, sau đó dừng việc gửi dữ liệu. Đoạn mã như sau:

```go
func main() {
	rand.Seed(time.Now().UnixNano())

	const Max = 100000
	const NumSenders = 1000

	dataCh := make(chan int, 100)
	stopCh := make(chan struct{})

	// senders
	for i := 0; i < NumSenders; i++ {
		go func() {
			for {
				select {
				case <- stopCh:
					return
				case dataCh <- rand.Intn(Max):
				}
			}
		}()
	}

	// the receiver
	go func() {
		for value := range dataCh {
			if value == Max-1 {
				fmt.Println("send stop signal to senders.")
				close(stopCh)
				return
			}

			fmt.Println(value)
		}
	}()

	select {
	case <- time.After(time.Hour):
	}
}
```

stopCh trong đoạn mã trên là channel tín hiệu, nó chỉ có một sender, do đó có thể đóng trực tiếp. Khi senders nhận được tín hiệu đóng, nhánh "case <- stopCh" sẽ được chọn, thoát khỏi hàm và không gửi thêm dữ liệu nữa.

Cần lưu ý rằng đoạn mã trên không đóng dataCh một cách rõ ràng. Trong ngôn ngữ Go, đối với một channel, nếu cuối cùng không có goroutine nào tham chiếu đến nó, channel sẽ được thu gom bởi gc, bất kể channel có được đóng hay không. Vì vậy, trong trường hợp này, việc đóng channel một cách tinh tế chỉ đơn giản là không đóng channel, để gc làm việc.

Trong trường hợp cuối cùng, phương pháp tinh tế để đóng channel là: any one of them says "let's end the game" by notifying a moderator to close an additional signal channel.

Khác với trường hợp thứ 3, ở đây có M reciever. Nếu tiếp tục sử dụng giải pháp thứ 3, cho reciever đóng trực tiếp stopCh, sẽ có sự đóng channel trùng lặp và gây ra panic. Do đó, cần thêm một người trung gian, M reciever đều gửi "yêu cầu" đóng dataCh cho người trung gian. Khi người trung gian nhận được yêu cầu đầu tiên, nó sẽ gửi lệnh đóng dataCh trực tiếp (bằng cách đóng stopCh), lúc này không có sự đóng channel trùng lặp xảy ra vì stopCh chỉ có một sender. Ngoài ra, N sender ở đây cũng có thể gửi yêu cầu đóng dataCh cho người trung gian.

```go
func main() {
	rand.Seed(time.Now().UnixNano())

	const Max = 100000
	const NumReceivers = 10
	const NumSenders = 1000

	dataCh := make(chan int, 100)
	stopCh := make(chan struct{})

	// Nó phải là một channel có bộ đệm.
	toStop := make(chan string, 1)

	var stoppedBy string

	// người điều hành
	go func() {
		stoppedBy = <-toStop
		close(stopCh)
	}()

	// senders
	for i := 0; i < NumSenders; i++ {
		go func(id string) {
			for {
				value := rand.Intn(Max)
				if value == 0 {
					select {
					case toStop <- "sender#" + id:
					default:
					}
					return
				}

				select {
				case <- stopCh:
					return
				case dataCh <- value:
				}
			}
		}(strconv.Itoa(i))
	}

	// receivers
	for i := 0; i < NumReceivers; i++ {
		go func(id string) {
			for {
				select {
				case <- stopCh:
					return
				case value := <-dataCh:
					if value == Max-1 {
						select {
						case toStop <- "receiver#" + id:
						default:
						}
						return
					}

					fmt.Println(value)
				}
			}
		}(strconv.Itoa(i))
	}

	select {
	case <- time.After(time.Hour):
	}

}
```

Trong đoạn mã, toStop đóng vai trò là trung gian, được sử dụng để nhận yêu cầu đóng dataCh từ senders và receivers.

Ở đây, toStop được khai báo là một channel có bộ đệm. Giả sử toStop được khai báo là một channel không có bộ đệm, thì yêu cầu đóng dataCh đầu tiên có thể bị mất. Bởi vì cả sender và receiver đều gửi yêu cầu thông qua câu lệnh select, nếu goroutine chứa trung gian không sẵn sàng, câu lệnh select sẽ không được chọn và default sẽ được thực thi. Điều này dẫn đến việc yêu cầu đóng dataCh đầu tiên bị mất.

Nếu chúng ta khai báo toStop với dung lượng là Num(senders) + Num(receivers), phần gửi yêu cầu dataCh có thể được viết gọn như sau:

```go
...
toStop := make(chan string, NumReceivers + NumSenders)
...
			value := rand.Intn(Max)
			if value == 0 {
				toStop <- "sender#" + id
				return
			}
...
				if value == Max-1 {
					toStop <- "receiver#" + id
					return
				}
...
```

Gửi yêu cầu trực tiếp đến toStop, vì dung lượng của toStop đủ lớn, nên không cần lo lắng về việc bị chặn, và không cần thêm câu lệnh select với default case để tránh bị chặn.

Có thể thấy, ở đây cũng không có đóng dataCh thực sự, giống như trường hợp thứ 3.

Trên đây là những trường hợp cơ bản nhất, nhưng đã đủ để bao phủ gần như tất cả các trường hợp và biến thể của chúng. Chỉ cần nhớ:

> don't close a channel from the receiver side and don't close a channel if the channel has multiple concurrent senders.

Cùng với nguyên tắc cơ bản:

> don't close (or send values to) closed channels.
