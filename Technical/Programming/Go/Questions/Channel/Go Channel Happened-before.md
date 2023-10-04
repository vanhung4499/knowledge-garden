---
title: Go Channel Happened-before
tags:
  - golang
  - interview
categories:
  - golang
  - interview
date created: 2023-10-04
date modified: 2023-10-04
---

# Go Channel: `happened-before`

Định nghĩa từ Wikipedia:

> In computer science, the `happened-before` relation (denoted: ->) is a relation between the result of two events, such that if one event should happen before another event, the result must reflect that, even if those events are in reality executed out of order (usually to optimize program flow).

`happened-before` (kéo theo) là một mối quan hệ trong khoa học máy tính, được ký hiệu là ->, đại diện cho mối quan hệ giữa kết quả của hai sự kiện. Nếu một sự kiện xảy ra trước một sự kiện khác, kết quả phải phản ánh mối quan hệ đó, ngay cả khi các sự kiện thực tế được thực hiện không theo thứ tự (thường để tối ưu hóa luồng chương trình).

Đơn giản mà nói, nếu sự kiện a và sự kiện b có mối quan hệ `happened-before`, tức là a -> b, thì kết quả sau khi hoàn thành của a và b phải phản ánh mối quan hệ đó. Vì các trình biên dịch và CPU hiện đại thực hiện các tối ưu hóa khác nhau, bao gồm việc sắp xếp lại mã nguồn, sắp xếp lại bộ nhớ, v.v. Trong mã đồng thời, giới hạn `happened-before` trở nên rất quan trọng.

Mối quan hệ `happened-before` của việc gửi (send), hoàn thành gửi (send finished), nhận (receive) và hoàn thành nhận (receive finished) trên channel như sau:

1. Sự kiện `send` thứ n xác định `happened before` sự kiện `receive finished` thứ n, bất kể channel có đệm hay không.
2. Đối với channel có đệm với dung lượng m, sự kiện `receive` thứ n xác định `happened before` sự kiện `send finished` thứ n+m.
3. Đối với channel không có đệm, sự kiện `receive` thứ n xác định `happened before` sự kiện `send finished` thứ n.
4. Sự kiện channel close chắc chắn `happend before` khi receiver nhận được thông báo.

Chúng ta hãy giải thích từng điều một.

Điều 1, từ góc độ mã nguồn, việc send không nhất thiết phải `happened-before` receive, vì đôi khi receive xảy ra trước, sau đó goroutine bị treo, sau đó được đánh thức bởi sender và send xảy ra sau đó. Nhưng dù sao, để hoàn thành việc nhận, việc gửi phải xảy ra trước.

Điều 2, đối với channel có bộ đệm, khi send thứ n+m xảy ra, có hai trường hợp sau đây:

- Nếu receive thứ n chưa xảy ra. Khi đó, channel đã đầy, send sẽ bị chặn. Khi receive thứ n xảy ra, sender goroutine sẽ được đánh thức và tiếp tục quá trình gửi. Do đó, `receive` thứ n chắc chắn `happened-before` `send finished` thứ n+m.
- Nếu `receive` thứ n đã xảy ra, điều này đã đáp ứng yêu cầu.

Điều 3, điều này cũng dễ hiểu. Nếu send thứ n bị chặn, sender goroutine bị treo, và khi receive thứ n đến, nó xảy ra trước send finished thứ n. Nếu send thứ n không bị chặn, điều đó có nghĩa là receive thứ n đã đợi từ trước đó, nó không chỉ happened before send finished, mà còn happened before send.

Điều 4, nhớ lại mã nguồn, trước tiên đặt giá trị closed = 1, sau đó đánh thức goroutine đang chờ và sao chép giá trị không.

Chúng ta hãy xem ví dụ sau:

```go
var done = make(chan bool)
var msg string

func aGoroutine() {
	msg = "hello, world"
	done <- true
}

func main() {
	go aGoroutine()
	<-done
	println(msg)
}
```

Trước tiên, chúng ta định nghĩa một channel `done` và một chuỗi `msg` cần được in ra. Trong hàm `main`, chúng ta khởi chạy một goroutine, chờ nhận một giá trị từ `done`, sau đó thực hiện việc in `msg`. Nếu không có dòng code `<-done` trong hàm `main`, giá trị của `msg` sẽ là rỗng vì goroutine `aGoroutine` không có đủ thời gian để được lên lịch và gán giá trị cho `msg` trước khi chương trình chính kết thúc. Trong Go, goroutine chính không chờ đợi các goroutine khác khi nó kết thúc.

Khi chúng ta thêm dòng code `<-done` vào, chương trình sẽ bị chặn tại đó. Nó sẽ chỉ tiếp tục khi goroutine `aGoroutine` gửi một giá trị vào `done`. Khi đó, `msg` đã được gán giá trị trước đó, do đó khi thực hiện in `msg`, nó sẽ in ra `hello, world`.

Điều này phụ thuộc vào mối quan hệ happened before đã được đề cập ở trên. Sự kiện gửi đầu tiên chắc chắn happened before sự kiện nhận đầu tiên hoàn thành, có nghĩa là `done <- true` xảy ra trước `<-done`. Điều này có nghĩa là sau khi hàm `main` thực hiện `<-done`, khi thực hiện dòng code `println(msg)`, `msg` đã được gán giá trị trước đó, do đó sẽ in ra kết quả mong muốn.

Tiếp theo, chúng ta có thể sử dụng quy tắc happened before thứ 3 đã đề cập trước đó để sửa đổi mã nguồn:

```go
var done = make(chan bool)
var msg string

func aGoroutine() {
	msg = "hello, world"
	<-done
}

func main() {
	go aGoroutine()
	done <- true
	println(msg)
}
```

Chúng ta vẫn có kết quả tương tự, tại sao? Theo quy tắc thứ 3, đối với channel không có bộ đệm, sự kiện nhận đầu tiên chắc chắn happened before sự kiện gửi đầu tiên hoàn thành. Điều này có nghĩa là trước khi `done <- true` hoàn thành, `<-done` đã xảy ra, có nghĩa là `msg` đã được gán giá trị trước đó. Do đó, cuối cùng cũng sẽ in ra `hello, world`.
