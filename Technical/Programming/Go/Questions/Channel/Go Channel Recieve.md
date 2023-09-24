---
title: Go Channel Recieve
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-22
date modified: 2023-09-22
---

# Go Channel: Recieve

## Phân tích mã nguồn

Trước tiên, chúng ta hãy xem mã nguồn liên quan đến việc nhận giá trị từ channel. Sau khi hiểu quá trình nhận cụ thể, chúng ta sẽ đi vào nghiên cứu chi tiết dựa trên một ví dụ cụ thể.

Có hai cách viết phép nhận, một cách có "ok" để phản ánh xem channel có bị đóng hay không; một cách không có "ok", trong cách viết này, khi nhận giá trị zero value của kiểu tương ứng, không thể biết được giá trị đó là từ người gửi thực sự gửi đến, hay là giá trị zero value mặc định được trả về khi channel bị đóng. Cả hai cách viết đều có các trường hợp sử dụng riêng của chúng.

Sau khi được xử lý bởi trình biên dịch, hai cách viết này tương ứng với hai hàm trong mã nguồn:

```go
// entry points for <- c from compiled code
func chanrecv1(c *hchan, elem unsafe.Pointer) {
	chanrecv(c, elem, true)
}

func chanrecv2(c *hchan, elem unsafe.Pointer) (received bool) {
	_, received = chanrecv(c, elem, true)
	return
}
```

Hàm `chanrecv1` xử lý trường hợp không có "ok", `chanrecv2` trả về giá trị "received" để phản ánh xem channel có bị đóng hay không. Giá trị nhận được được "đặt vào" địa chỉ mà tham số `elem` trỏ tới, giống như cách viết trong C/C++. Nếu mã không quan tâm đến giá trị nhận được, tham số `elem` ở đây sẽ là nil.

Dù sao đi nữa, cuối cùng chúng ta sẽ chuyển đến hàm `chanrecv`:

```go
// Nằm trong src/runtime/chan.go

// Hàm chanrecv nhận các phần tử từ channel c và ghi chúng vào địa chỉ bộ nhớ mà ep trỏ tới.
// Nếu ep là nil, có nghĩa là bỏ qua giá trị nhận được.
// Nếu block == false, tức là nhận không chặn, nếu không có dữ liệu để nhận, trả về (false, false).
// Nếu không, nếu c đang trong trạng thái đã đóng, đặt giá trị tại địa chỉ mà ep trỏ tới thành zero value và trả về (true, false).
// Nếu không, điền giá trị nhận được vào địa chỉ bộ nhớ mà ep trỏ tới và trả về (true, true).
// Nếu ep không rỗng, nó nên trỏ tới heap hoặc stack của người gọi hàm.

func chanrecv(c *hchan, ep unsafe.Pointer, block bool) (selected, received bool) {
	// Bỏ qua nội dung debug ...

	// Nếu channel là nil
	if c == nil {
		// Nếu không chặn, trả về (false, false)
		if !block {
			return
		}
		// Nếu không, nhận một channel nil, treo goroutine
		gopark(nil, nil, "chan receive (nil chan)", traceEvGoStop, 2)
		// Không thể đến đây
		throw("unreachable")
	}

	// Trong trường hợp không chặn, kiểm tra nhanh thất bại, không cần khóa, trả về nhanh
	// Khi chúng ta nhận thấy channel không sẵn sàng:
	// 1. Không có goroutine đang chờ trong hàng đợi gửi sendq
	// 2. Channel có bộ đệm, nhưng buf không có phần tử
	// Sau đó, chúng ta nhận thấy closed == 0, tức là channel chưa đóng.
	// Vì channel không thể mở lại sau khi đã đóng, vì vậy trong trường hợp này, chúng ta có thể tuyên bố nhận thất bại và trả về (false, false)
	if !block && (c.dataqsiz == 0 && c.sendq.first == nil ||
		c.dataqsiz > 0 && atomic.Loaduint(&c.qcount) == 0) &&
		atomic.Load(&c.closed) == 0 {
		return
	}

	var t0 int64
	if blockprofilerate > 0 {
		t0 = cputicks()
	}

	// Khóa
	lock(&c.lock)

	// Channel đã đóng và không có phần tử trong mảng vòng lặp buf
	// Điều này có thể xử lý trường hợp đóng không có bộ đệm và đóng có bộ đệm nhưng buf không có phần tử
	// Nghĩa là ngay cả khi trong trạng thái đã đóng, nhưng trong trường hợp channel có bộ đệm,
	// vẫn có thể nhận được phần tử từ buf
	if c.closed != 0 && c.qcount == 0 {
		if raceenabled {
			raceacquire(unsafe.Pointer(c))
		}
		// Mở khóa
		unlock(&c.lock)
		if ep != nil {
			// Nhận từ một channel đã đóng và không bỏ qua giá trị trả về
			// Giá trị nhận được sẽ là zero value của kiểu đó
			// typedmemclr xóa bộ nhớ tại địa chỉ tương ứng với kiểu
			typedmemclr(c.elemtype, ep)
		}
		// Nhận từ một channel đã đóng, selected trả về true
		return true, false
	}

	// Đợi trong hàng đợi gửi có goroutine tồn tại, có nghĩa là buf đầy
	// Điều này có thể là:
	// 1. Channel không có bộ đệm
	// 2. Channel có bộ đệm, nhưng buf đầy
	// Đối với trường hợp 1, sao chép trực tiếp từ goroutine gửi -> goroutine nhận
	// Đối với trường hợp 2, nhận từ phần tử đầu hàng đợi và đặt giá trị của người gửi vào phần tử cuối hàng đợi (cả hai đều tương ứng với cùng một vị trí trong buf vì hàng đợi đã đầy).
	if sg := c.sendq.dequeue(); sg != nil {
		// Tìm thấy một goroutine gửi đang chờ. Nếu bộ đệm có kích thước 0, nhận giá trị trực tiếp từ người gửi. Nếu không, nhận từ đầu hàng đợi và thêm giá trị của người gửi vào cuối hàng đợi (cả hai đều tương ứng với cùng một vị trí trong buf vì hàng đợi đã đầy).
		recv(c, sg, ep, func() { unlock(&c.lock) }, 3)
		return true, true
	}

	// Channel có bộ đệm và buf có phần tử, có thể nhận bình thường
	if c.qcount > 0 {
		// Trực tiếp lấy phần tử cần nhận từ mảng vòng lặp buf
		qp := chanbuf(c, c.recvx)

		// ...

		// Trong mã, không bỏ qua giá trị cần nhận, không phải "<- ch" mà là "val <- ch", ep trỏ tới val
		if ep != nil {
			typedmemmove(c.elemtype, ep, qp)
		}
		// Xóa giá trị tại vị trí tương ứng trong mảng vòng lặp buf
		typedmemclr(c.elemtype, qp)
		// Di chuyển con trỏ nhận sang phía trước
		c.recvx++
		// Đưa con trỏ nhận về 0
		if c.recvx == c.dataqsiz {
			c.recvx = 0
		}
		// Giảm số lượng phần tử trong mảng buf đi 1
		c.qcount--
		// Mở khóa
		unlock(&c.lock)
		return true, true
	}

	if !block {
		// Nhận không chặn, mở khóa. selected trả về false vì không nhận được giá trị
		unlock(&c.lock)
		return false, false
	}

	// Tiếp theo là trường hợp bị chặn
	// Xây dựng một sudog
	gp := getg()
	mysg := acquireSudog()
	mysg.releasetime = 0
	if t0 != 0 {
		mysg.releasetime = -1
	}

	// Lưu địa chỉ dữ liệu nhận được
	mysg.elem = ep
	mysg.waitlink = nil
	gp.waiting = mysg
	mysg.g = gp
	mysg.selectdone = nil
	mysg.c = c
	gp.param = nil
	// Thêm vào hàng đợi nhận của channel
	c.recvq.enqueue(mysg)
	// Treo goroutine hiện tại
	goparkunlock(&c.lock, "chan receive", traceEvGoBlockRecv, 3)

	// Được đánh thức, tiếp tục thực hiện một số công việc cuối cùng từ đây
	if mysg != gp.waiting {
		throw("G waiting list is corrupted")
	}
	gp.waiting = nil
	if mysg.releasetime > 0 {
		blockevent(mysg.releasetime-t0, 2)
	}
	closed := gp.param == nil
	gp.param = nil
	mysg.c = nil
	releaseSudog(mysg)
	return true, !closed
}
```

Khi chúng ta quan sát rằng channel không sẵn sàng để nhận:

1. Đối với channel không có bộ đệm, không có goroutine nào đang chờ trong hàng đợi gửi
2. Đối với channel có bộ đệm, nhưng không có phần tử trong bộ đệm

Sau đó, chúng ta lại quan sát được closed == 0, tức là channel chưa được đóng.

Vì channel không thể được mở lại, nên trong lần quan sát trước đó, channel cũng chưa được đóng, do đó trong trường hợp này, chúng ta có thể thông báo rằng việc nhận thất bại và trả về nhanh chóng. Vì không được chọn và không nhận được dữ liệu, giá trị trả về là (false, false).

- Các hoạt động tiếp theo, đầu tiên chúng ta sẽ khóa một lần, phạm vi khá lớn. Nếu channel đã được đóng và không có phần tử trong mảng vòng lặp buf. Tương ứng với trường hợp đóng không có bộ đệm và đóng có bộ đệm nhưng không có phần tử trong buf, chúng ta trả về giá trị zero value tương ứng, nhưng cờ received là false, thông báo cho người gọi rằng channel này đã được đóng và giá trị bạn nhận không phải là dữ liệu được gửi bình thường từ người gửi. Nhưng nếu nằm trong ngữ cảnh của câu lệnh select, trường hợp này đã được chọn. Rất nhiều tình huống sử dụng channel như tín hiệu thông báo đều rơi vào đây.
- Tiếp theo, nếu có hàng đợi gửi đang chờ, điều đó có nghĩa là channel đã đầy, có thể nhận dữ liệu bình thường trong cả hai trường hợp: channel không có bộ đệm hoặc channel có bộ đệm nhưng buf đã đầy.

Sau đó, gọi hàm recv:

```go
func recv(c *hchan, sg *sudog, ep unsafe.Pointer, unlockf func(), skip int) {
	// Nếu channel không có bộ đệm
	if c.dataqsiz == 0 {
		if raceenabled {
			racesync(c, sg)
		}
		// Nếu không bỏ qua dữ liệu nhận được
		if ep != nil {
			// Sao chép dữ liệu trực tiếp từ goroutine gửi -> goroutine nhận
			recvDirect(c.elemtype, sg, ep)
		}
	} else {
		// channel có bộ đệm, nhưng buf đã đầy.
		// Sao chép phần tử đầu tiên của mảng vòng lặp buf vào địa chỉ nhận dữ liệu
		// Đưa dữ liệu của người gửi vào hàng đợi. Trên thực tế, giá trị recvx và sendx bằng nhau
		// Tìm chỉ mục nhận
		qp := chanbuf(c, c.recvx)
		// …………
		// Sao chép dữ liệu tại chỉ mục nhận vào người nhận
		if ep != nil {
			typedmemmove(c.elemtype, ep, qp)
		}

		// Sao chép dữ liệu của người gửi vào buf
		typedmemmove(c.elemtype, qp, sg.elem)
		// Cập nhật giá trị chỉ mục
		c.recvx++
		if c.recvx == c.dataqsiz {
			c.recvx = 0
		}
		c.sendx = c.recvx
	}
	sg.elem = nil
	gp := sg.g

	// Mở khóa
	unlockf()
	gp.param = unsafe.Pointer(sg)
	if sg.releasetime != 0 {
		sg.releasetime = cputicks()
	}

	// Kích hoạt goroutine gửi. Cần chờ lịch trình
	goready(gp, skip+1)
}
```

Nếu channel là không có bộ đệm, chúng ta sẽ sao chép trực tiếp từ ngăn xếp của người gửi vào ngăn xếp của người nhận.

```go
func recvDirect(t *_type, sg *sudog, dst unsafe.Pointer) {
	// dst nằm trên ngăn xếp của chúng ta hoặc heap, src nằm trên ngăn xếp khác.
	src := sg.elem
	typeBitsBulkBarrier(t, uintptr(dst), uintptr(src), t.size)
	memmove(dst, src, t.size)
}
```

Nếu là channel có bộ đệm và buf đã đầy. Điều này có nghĩa là chỉ mục gửi và chỉ mục nhận đã trùng nhau, vì vậy chúng ta cần tìm chỉ mục nhận trước:

```go
// chanbuf(c, i) là con trỏ đến vị trí thứ i trong bộ đệm.
func chanbuf(c *hchan, i uint) unsafe.Pointer {
	return add(c.buf, uintptr(i)*uintptr(c.elemsize))
}
```

Sao chép phần tử tại vị trí đó vào địa chỉ nhận. Sau đó, sao chép dữ liệu đang chờ gửi từ người gửi vào vị trí chỉ mục nhận. Như vậy, quá trình nhận và gửi dữ liệu đã hoàn thành. Tiếp theo, tăng chỉ mục gửi và chỉ mục nhận lên một đơn vị, nếu "vòng lặp" xảy ra, quay trở lại 0.

Cuối cùng, lấy goroutine từ sudog và gọi goready để thay đổi trạng thái của nó thành "runnable", chờ đợi goroutine gửi được đánh thức và chờ lịch trình của bộ lập lịch.

- Sau đó, nếu buf của channel còn chứa dữ liệu, điều đó có nghĩa là có thể nhận dữ liệu một cách bình thường. Lưu ý rằng, ngay cả khi channel đã đóng, cũng có thể điều này xảy ra. Bước này khá đơn giản, chỉ cần sao chép dữ liệu tại vị trí chỉ mục nhận trong buf vào địa chỉ nhận dữ liệu.
- Cuối cùng, khi đến bước cuối cùng, điều này có nghĩa là chúng ta sẽ bị chặn. Tất nhiên, nếu giá trị block được truyền vào là false, thì không bị chặn và chỉ cần trả về.

Đầu tiên, chúng ta tạo một sudog, sau đó lưu trữ các giá trị khác nhau. Lưu ý rằng, địa chỉ nhận dữ liệu sẽ được lưu trữ trong trường `elem`, khi bị đánh thức, dữ liệu nhận được sẽ được lưu trữ tại địa chỉ mà trường này trỏ đến. Sau đó, thêm sudog vào hàng đợi recvq của channel. Gọi hàm goparkunlock để đưa goroutine vào trạng thái đợi.

Phần còn lại của mã là các công việc cuối cùng sau khi goroutine được đánh thức.

## Phân tích ví dụ

Chúng ta sẽ sử dụng ví dụ sau để giải thích quá trình nhận và gửi dữ liệu từ channel:

```go
func goroutineA(a <-chan int) {
	val := <- a
	fmt.Println("G1 received data: ", val)
	return
}

func goroutineB(b <-chan int) {
	val := <- b
	fmt.Println("G2 received data: ", val)
	return
}

func main() {
	ch := make(chan int)
	go goroutineA(ch)
	go goroutineB(ch)
	ch <- 3
	time.Sleep(time.Second)
}
```

Đầu tiên, chúng ta tạo một channel không có bộ đệm, sau đó khởi chạy hai goroutine và truyền channel đã tạo vào. Sau đó, chúng ta gửi dữ liệu 3 vào channel này và sau đó sleep 1 giây trước khi chương trình kết thúc.

Dòng 14 trong chương trình tạo một channel không có bộ đệm, chúng ta chỉ xem một số trường quan trọng trong cấu trúc của chan để hiểu tổng quan về trạng thái của chan. Ban đầu, không có gì trong chan:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/channel-4.png)

Tiếp theo, dòng 15 và 16 tạo hai goroutine và mỗi goroutine thực hiện một phép nhận. Dựa vào phân tích mã nguồn trước đó, chúng ta biết rằng cả hai goroutine (sau đây gọi là G1 và G2) đều bị chặn ở phép nhận. G1 và G2 sẽ được treo trong hàng đợi recq của channel, tạo thành một danh sách liên kết hai chiều vòng.

Trước dòng 17 của chương trình, cấu trúc dữ liệu của chan nhìn tổng thể như sau:

![channel5.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/channel5.png)

`buf` trỏ đến một mảng có độ dài 0, qcount là 0, cho thấy không có phần tử nào trong channel. Chú ý đến `recvq` và `sendq`, chúng là cấu trúc waitq, và waitq thực tế là một danh sách liên kết hai chiều, các phần tử trong danh sách là sudog, trong đó có trường `g`, `g` đại diện cho một goroutine, vì vậy sudog có thể coi là một goroutine. recvq lưu trữ các goroutine bị chặn khi cố gắng đọc từ channel, trong khi sendq lưu trữ các goroutine bị chặn khi cố gắng ghi vào channel.

Lúc này, chúng ta có thể thấy rằng recvq có hai goroutine treo, đó là G1 và G2 đã khởi chạy trước đó. Vì không có goroutine nhận, và channel là loại không có bộ đệm, nên G1 và G2 bị chặn. Không có goroutine nào bị chặn trong sendq.

Cấu trúc dữ liệu của `recvq` như sau:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/channel-6.png)

Tiếp tục nhìn tổng thể trạng thái của chan:

![channel-7.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/channel-7.png)

G1 và G2 đã bị treo, trạng thái là `WAITING`. Điều này không phải là trọng tâm của bài viết hôm nay, nhưng chắc chắn sẽ có bài viết liên quan sau này. Ở đây, tôi chỉ giải thích đơn giản rằng goroutine là một coroutine ở mức người dùng, được quản lý bởi Go runtime. So với luồng kernel được quản lý bởi hệ điều hành, goroutine nhẹ hơn nhiều, cho phép chúng ta dễ dàng tạo hàng ngàn goroutine.

Một luồng kernel có thể quản lý nhiều goroutine, khi một trong số chúng bị chặn, luồng kernel có thể lập lịch để chạy các goroutine khác, luồng kernel không bị chặn. Đây chính là mô hình `M:N` thông thường:

![channel-8.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/channel-8.png)

Mô hình `M:N` thường bao gồm ba phần: M, P, G. M là luồng kernel, chịu trách nhiệm chạy goroutine, P là ngữ cảnh, lưu trữ ngữ cảnh cần thiết để chạy goroutine, nó cũng duy trì danh sách goroutine có thể chạy (runnable), G là goroutine đang chờ chạy. M và P là cơ sở để G chạy.

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/channel-8.png)

Tiếp tục với ví dụ. Giả sử chúng ta chỉ có một M, khi G1 (`go goroutineA(ch)`) chạy đến `val := <- a`, nó chuyển từ trạng thái running sang trạng thái waiting (kết quả sau khi gọi gopark):

![channel-10.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/channel-10.png)

G1 không còn liên quan đến M nữa, nhưng lập lịch viên không để M rảnh rỗi, nên nó tiếp tục lập lịch để chạy một goroutine khác:

![channel-11.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/channel-11.png)

G2 cũng gặp phải tình huống tương tự. Bây giờ G1 và G2 đều bị treo, đang chờ một sender gửi dữ liệu vào channel để được giải thoát.
