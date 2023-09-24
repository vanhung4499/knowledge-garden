---
title: Go Channel Close
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-22
date modified: 2023-09-22
---

# Go Channel: Close

Khi đóng một channel, hàm `closechan` sẽ được thực thi:

```go
func closechan(c *hchan) {
	// Đóng một channel nil, panic
	if c == nil {
		panic(plainError("close of nil channel"))
	}

	// Khóa channel
	lock(&c.lock)
	// Nếu channel đã được đóng
	if c.closed != 0 {
		unlock(&c.lock)
		// panic
		panic(plainError("close of closed channel"))
	}

	// …………

	// Thay đổi trạng thái đã đóng
	c.closed = 1

	var glist *g

	// Giải phóng tất cả sudog trong hàng đợi nhận của channel
	for {
		// Lấy một sudog từ hàng đợi nhận
		sg := c.recvq.dequeue()
		// Nếu không còn sudog nào, thoát khỏi vòng lặp
		if sg == nil {
			break
		}

		// Nếu elem không nil, có nghĩa là receiver chưa bỏ qua việc nhận dữ liệu
		// Gán giá trị zero value tương ứng cho nó
		if sg.elem != nil {
			typedmemclr(c.elemtype, sg.elem)
			sg.elem = nil
		}
		if sg.releasetime != 0 {
			sg.releasetime = cputicks()
		}
		// Lấy goroutine
		gp := sg.g
		gp.param = nil
		if raceenabled {
			raceacquireg(gp, unsafe.Pointer(c))
		}
		// Liên kết với nhau, tạo thành danh sách liên kết
		gp.schedlink.set(glist)
		glist = gp
	}

	// Giải phóng tất cả sudog trong hàng đợi gửi của channel
	// Nếu có, các goroutine này sẽ panic
	for {
		// Lấy một sudog từ hàng đợi gửi
		sg := c.sendq.dequeue()
		if sg == nil {
			break
		}

		// Sender sẽ panic
		sg.elem = nil
		if sg.releasetime != 0 {
			sg.releasetime = cputicks()
		}
		gp := sg.g
		gp.param = nil
		if raceenabled {
			raceacquireg(gp, unsafe.Pointer(c))
		}
		// Liên kết với nhau, tạo thành danh sách liên kết
		gp.schedlink.set(glist)
		glist = gp
	}
	// Mở khóa
	unlock(&c.lock)

	// Sẵn sàng tất cả các goroutine sau khi đã giải phóng khóa channel.
	// Duyệt qua danh sách liên kết
	for glist != nil {
		// Lấy goroutine cuối cùng
		gp := glist
		// Di chuyển tới goroutine tiếp theo để đánh thức
		glist = glist.schedlink.ptr()
		gp.schedlink = 0
		// Đánh thức goroutine tương ứng
		goready(gp, 3)
	}
}
```

Logic đóng channel khá đơn giản. Đối với một channel, recvq và sendq lưu trữ các sender và receiver đang bị chặn. Sau khi đóng channel, đối với receiver đang chờ, nó sẽ nhận được giá trị zero value tương ứng. Đối với sender đang chờ, nó sẽ panic trực tiếp. Do đó, không thể đóng channel một cách vô thận khi không biết liệu channel còn receiver hay không.

Hàm close trước tiên khóa channel, sau đó nối tất cả các sender và receiver treo trên channel thành một danh sách liên kết sudog, sau đó mở khóa. Cuối cùng, đánh thức tất cả các sudog đã được nối.

Sau khi được đánh thức, sender sẽ tiếp tục thực thi mã sau hàm goparkunlock trong hàm chansend, rất không may, nó phát hiện rằng channel đã bị đóng, và panic. Receiver, tuy nhiên, may mắn hơn, hoàn thành một số công việc cuối cùng và trả về. Ở đây, selected trả về true, trong khi giá trị trả về received phụ thuộc vào việc channel đã đóng hay chưa. Nếu channel đã đóng, received trả về false, ngược lại trả về true. Trong trường hợp phân tích của chúng ta, received trả về false.
