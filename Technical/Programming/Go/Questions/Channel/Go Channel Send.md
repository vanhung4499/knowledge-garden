---
title: Go Channel Send
tags: 
categories: 
date created: 2023-09-21
date modified: 2023-09-22
---

# Go Chanel Send

## Phân tích mã nguồn

Quá trình gửi cuối cùng được chuyển đổi thành hàm `chansend`, dưới đây là mã nguồn tương ứng, phần lớn đã được chú thích để dễ hiểu quy trình chính:

```go
// Nằm trong src/runtime/chan.go

func chansend(c *hchan, ep unsafe.Pointer, block bool, callerpc uintptr) bool {
	// Nếu channel là nil
	if c == nil {
		// Không thể chặn, trả về false để chỉ ra rằng không gửi thành công
		if !block {
			return false
		}
		// Goroutine hiện tại bị treo
		gopark(nil, nil, "chan send (nil chan)", traceEvGoStop, 2)
		throw("unreachable")
	}

	// Bỏ qua các phần liên quan đến gỡ lỗi......

	// Kiểm tra nhanh các trường hợp gửi không chặn
	//
	// Nếu channel chưa đóng và không có không gian đệm dư thừa trong channel. Điều này có thể là:
	// 1. Channel không có đệm và không có goroutine đang chờ nhận
	// 2. Channel có đệm nhưng mảng vòng lặp đã đầy
	if !block && c.closed == 0 && ((c.dataqsiz == 0 && c.recvq.first == nil) ||
		(c.dataqsiz > 0 && c.qcount == c.dataqsiz)) {
		return false
	}

	var t0 int64
	if blockprofilerate > 0 {
		t0 = cputicks()
	}

	// Khóa channel để đảm bảo an toàn đồng thời
	lock(&c.lock)

	// Nếu channel đã đóng
	if c.closed != 0 {
		// Mở khóa
		unlock(&c.lock)
		// Panic trực tiếp
		panic(plainError("send on closed channel"))
	}

	// Nếu có goroutine đang chờ nhận trong hàng đợi, sao chép dữ liệu cần gửi vào goroutine nhận
	if sg := c.recvq.dequeue(); sg != nil {
		send(c, sg, ep, func() { unlock(&c.lock) }, 3)
		return true
	}

	// Đối với channel có đệm, nếu còn không gian đệm
	if c.qcount < c.dataqsiz {
		// qp trỏ đến vị trí sendx trong buf
		qp := chanbuf(c, c.sendx)

		// ......

		// Sao chép dữ liệu từ ep vào qp
		typedmemmove(c.elemtype, qp, ep)
		// Tăng giá trị con trỏ gửi lên 1
		c.sendx++
		// Nếu giá trị con trỏ gửi bằng giá trị dung lượng, đặt giá trị con trỏ gửi về 0
		if c.sendx == c.dataqsiz {
			c.sendx = 0
		}
		// Tăng số lượng phần tử trong bộ đệm lên 1
		c.qcount++

		// Mở khóa
		unlock(&c.lock)
		return true
	}

	// Nếu không cần chặn, trả về lỗi trực tiếp
	if !block {
		unlock(&c.lock)
		return false
	}

	// Channel đã đầy, bên gửi sẽ bị chặn. Tiếp theo sẽ tạo một sudog

	// Lấy con trỏ của goroutine hiện tại
	gp := getg()
	mysg := acquireSudog()
	mysg.releasetime = 0
	if t0 != 0 {
		mysg.releasetime = -1
	}

	mysg.elem = ep
	mysg.waitlink = nil
	mysg.g = gp
	mysg.selectdone = nil
	mysg.c = c
	gp.waiting = mysg
	gp.param = nil

	// Goroutine hiện tại vào hàng đợi gửi
	c.sendq.enqueue(mysg)

	// Goroutine hiện tại bị treo
	goparkunlock(&c.lock, "chan send", traceEvGoBlockSend, 3)

	// Bị đánh thức từ đây (channel có cơ hội để gửi)
	if mysg != gp.waiting {
		throw("G waiting list is corrupted")
	}
	gp.waiting = nil
	if gp.param == nil {
		if c.closed == 0 {
			throw("chansend: spurious wakeup")
		}
		// Sau khi bị đánh thức, channel đã đóng. Panic
		panic(plainError("send on closed channel"))
	}
	gp.param = nil
	if mysg.releasetime > 0 {
		blockevent(mysg.releasetime-t0, 2)
	}
	// Gỡ bỏ kết nối channel được gắn với mysg
	mysg.c = nil
	releaseSudog(mysg)
	return true
}
```

Phần chú thích trong đoạn mã trên khá chi tiết, chúng ta hãy xem kỹ hơn.

- Nếu phát hiện rằng kênh là trống, goroutine hiện tại sẽ bị treo.
- Đối với hoạt động gửi không chặn, nếu kênh chưa đóng và không có không gian đệm dư thừa (giải thích: a. kênh không có bộ đệm và không có goroutine đang chờ nhận; b. kênh có bộ đệm, nhưng mảng vòng lặp đã đầy)

Về điều này, có nhiều chú thích trong mã nguồn runtime. Câu lệnh kiểm tra này được sử dụng để nhanh chóng phát hiện lỗi gửi trong các tình huống không chặn và trả về kết quả nhanh chóng.

```go
if !block && c.closed == 0 && ((c.dataqsiz == 0 && c.recvq.first == nil) || (c.dataqsiz > 0 && c.qcount == c.dataqsiz)) {
	return false
}
```

Chú thích chủ yếu giải thích tại sao phần này không cần khóa, tôi sẽ giải thích chi tiết hơn. Điều kiện `if` trước tiên đọc hai biến: block và c.closed. block là đối số của hàm, không thay đổi; c.closed có thể bị thay đổi bởi goroutine khác, vì không có khóa, đây là hai biểu thức trong điều kiện "và".

Phần cuối, liên quan đến ba biến: c.dataqsiz, c.recvq.first và c.qcount. `c.dataqsiz == 0 && c.recvq.first == nil` đề cập đến kênh không có bộ đệm và không có goroutine đang chờ nhận; `c.dataqsiz > 0 && c.qcount == c.dataqsiz` đề cập đến kênh có bộ đệm, nhưng mảng vòng lặp đã đầy. Ở đây, `c.dataqsiz` thực tế không thay đổi, nó được xác định khi tạo. Không khóa thực sự ảnh hưởng đến `c.qcount` và `c.recvq.first`.

Phần này là hai `word-sized read`, tức là đọc hai từ: `c.closed` và `c.recvq.first` (không có bộ đệm) hoặc `c.qcount` (có bộ đệm).

Khi chúng ta phát hiện `c.closed == 0` là true, tức là kênh chưa được đóng, và sau đó kiểm tra điều kiện thứ ba, nếu thấy `c.recvq.first == nil` hoặc `c.qcount == c.dataqsiz` (bỏ qua `c.dataqsiz` ở đây), chúng ta kết luận rằng thao tác gửi này thất bại và trả về false nhanh chóng.

Phần này liên quan đến hai mục quan sát: kênh chưa được đóng và kênh không sẵn sàng để gửi. Cả hai đều có thể không nhất quán trước và sau quan sát do không khóa. Ví dụ, tôi quan sát trước rằng kênh chưa được đóng, sau đó quan sát rằng kênh không sẵn sàng để gửi, lúc này tôi nghĩ rằng điều kiện if này đã được đáp ứng, nhưng nếu lúc này c.closed trở thành 1, thì thực tế không đáp ứng điều kiện nữa, vì sao bạn không khóa nó!

Tuy nhiên, vì một kênh đã đóng không thể chuyển trạng thái của kênh từ "sẵn sàng để gửi" sang "không sẵn sàng để gửi", vì vậy khi tôi quan sát "không sẵn sàng để gửi", kênh không được đóng. Ngay cả khi `c.closed == 1`, tức là kênh đã đóng giữa hai quan sát này, điều đó chỉ ra rằng giữa hai quan sát này, kênh đáp ứng hai điều kiện: "không đóng" và "không sẵn sàng để gửi", lúc này, tôi có thể trả về false trực tiếp mà không có vấn đề gì.

Phần giải thích này hơi rối, nhưng thực tế làm như vậy để giảm số lần khóa và tăng hiệu suất.

- Nếu phát hiện rằng kênh đã đóng, trực tiếp panic.
- Nếu có thể lấy một sudog từ hàng đợi nhận recvq (đại diện cho một goroutine), có nghĩa là kênh hiện tại là trống, không có phần tử, vì vậy mới có người nhận đang chờ. Lúc này, hàm send sẽ được gọi để sao chép phần tử trực tiếp từ ngăn xếp của người gửi sang ngăn xếp của người nhận, hoạt động chính được thực hiện bởi hàm `sendDirect`.

```go
// Hàm send xử lý thao tác gửi vào một kênh trống

// ep trỏ đến phần tử được gửi, sẽ được sao chép trực tiếp vào ngăn xếp của người nhận
// Sau đó, goroutine của người nhận sẽ được đánh thức
// c phải là trống (vì có goroutine đang chờ, chắc chắn là trống)
// c phải được khóa, sau khi thao tác gửi hoàn thành, hàm unlockf sẽ được sử dụng để mở khóa
// sg phải đã được lấy ra khỏi hàng đợi chờ
// ep phải không rỗng và trỏ đến heap hoặc ngăn xếp của người gọi

func send(c *hchan, sg *sudog, ep unsafe.Pointer, unlockf func(), skip int) {
	// Bỏ qua một số phần không cần thiết
	// ...

	// sg.elem trỏ đến vị trí lưu trữ giá trị đã nhận, ví dụ val <- ch, nó sẽ trỏ đến &val
	if sg.elem != nil {
		// Sao chép trực tiếp bộ nhớ (từ người gửi đến người nhận)
		sendDirect(c.elemtype, sg, ep)
		sg.elem = nil
	}
	// Goroutine được gắn với sudog
	gp := sg.g
	// Mở khóa
	unlockf()
	gp.param = unsafe.Pointer(sg)
	if sg.releasetime != 0 {
		sg.releasetime = cputicks()
	}
	// Đánh thức goroutine của người nhận. Tham số skip và in stack liên quan, tạm thời bỏ qua
	goready(gp, skip+1)
}
```

Tiếp tục xem hàm `sendDirect`:

```go
// Gửi dữ liệu vào một kênh không có bộ đệm hoặc kênh không có phần tử (không có bộ đệm hoặc bộ đệm nhưng trống)
// sẽ dẫn đến một goroutine trực tiếp thao tác trên ngăn xếp của goroutine khác
// Vì GC giả định việc ghi vào ngăn xếp chỉ xảy ra khi goroutine đang chạy và được ghi bởi goroutine hiện tại
// Vì vậy, thực tế là vi phạm giả định này. Điều này có thể gây ra một số vấn đề, vì vậy cần sử dụng write barrier để tránh

func sendDirect(t *_type, sg *sudog, src unsafe.Pointer) {
	// src trên ngăn xếp của goroutine hiện tại, dst là ngăn xếp của goroutine khác

	// Sao chép trực tiếp bộ nhớ
	// Nếu ngăn xếp đích đã bị thu hẹp, sau khi chúng ta đọc sg.elem
	// chúng ta không thể thay đổi giá trị thực sự của vị trí dst nữa
	// Do đó, cần có một barrier trước và sau khi đọc và ghi
	dst := sg.elem
	typeBitsBulkBarrier(t, uintptr(dst), uintptr(src), t.size)
	memmove(dst, src, t.size)
}
```

Điều này liên quan đến việc một goroutine trực tiếp ghi vào ngăn xếp của một goroutine khác, thông thường, các goroutine khác nhau có các ngăn xếp riêng biệt. Điều này vi phạm một số giả định của GC. Để tránh vấn đề, một rào cản ghi đã được thêm vào trong quá trình ghi, đảm bảo hoàn thành ghi một cách chính xác. Lợi ích của việc này là giảm số lần sao chép bộ nhớ: không cần sao chép vào buf của kênh trước, gửi trực tiếp từ người gửi đến người nhận, không có trung gian nào lợi dụng lợi nhuận, tăng hiệu suất, hoàn hảo.

Sau đó, mở khóa, đánh thức người nhận và chờ lịch trình của bộ lập lịch, người nhận cũng có thể tiếp tục thực hiện mã sau thao tác nhận.

- Nếu `c.qcount < c.dataqsiz`, có nghĩa là bộ đệm khả dụng (chắc chắn là kênh có bộ đệm). Đầu tiên, lấy vị trí mà phần tử gửi đang chờ được gửi đến:

```go
qp := chanbuf(c, c.sendx)

// Trả về địa chỉ của phần tử thứ i trong hàng đợi vòng lặp
func chanbuf(c *hchan, i uint) unsafe.Pointer {
	return add(c.buf, uintptr(i)*uintptr(c.elemsize))
}
```

`c.sendx` trỏ đến vị trí của phần tử gửi tiếp theo trong mảng vòng lặp, sau đó gọi hàm `typedmemmove` để sao chép nó vào mảng vòng lặp. Sau đó, `c.sendx` tăng lên 1 và tổng số phần tử tăng lên 1: `c.qcount++`, cuối cùng, mở khóa và trả về.

- Nếu không đáp ứng các điều kiện trên, có nghĩa là kênh đã đầy. Cho dù kênh này có bộ đệm hay không, cần "khóa" người gửi (goroutine bị chặn). Nếu block là false, mở khóa trực tiếp và trả về false.
- Cuối cùng là trường hợp thực sự cần bị chặn. Đầu tiên, tạo một sudog, đưa nó vào hàng đợi (trường sendq của kênh). Sau đó, gọi `goparkunlock` để đưa goroutine hiện tại vào trạng thái chờ đợi và mở khóa, chờ đến thời điểm thích hợp để đánh thức lại.

Sau khi đánh thức, tiếp tục thực hiện từ dòng mã ngay sau `goparkunlock`.

Ở đây có một số hoạt động gắn kết, sudog được gắn với goroutine thông qua trường g, và goroutine được gắn với sudog thông qua trường waiting, sudog cũng được gắn với địa chỉ của phần tử gửi đang chờ thông qua trường elem, và trường c được gắn với kênh mà goroutine đã "rơi vào" tại đây.

Vì vậy, địa chỉ của phần tử gửi đang chờ thực sự được lưu trữ trong cấu trúc sudog, tức là trong goroutine hiện tại.

# Phân tích ví dụ

Okay, sau khi xem xét mã nguồn, chúng ta tiếp tục phân tích ví dụ. Đoạn mã như sau:

```go
func goroutineA(a <-chan int) {
	val := <- a
	fmt.Println("goroutine A received data: ", val)
	return
}

func goroutineB(b <-chan int) {
	val := <- b
	fmt.Println("goroutine B received data: ", val)
	return
}

func main() {
	ch := make(chan int)
	go goroutineA(ch)
	go goroutineB(ch)
	ch <- 3
	time.Sleep(time.Second)

	ch1 := make(chan struct{})
}
```

Trong phần gửi, chúng ta đã nói rằng G1 và G2 hiện đang bị treo, đang chờ sự cứu giúp từ sender. Ở dòng 17, goroutine chính gửi một phần tử 3 vào ch, hãy xem những gì sẽ xảy ra tiếp theo.

Dựa trên kết quả phân tích mã nguồn trước đó, chúng ta biết rằng sender sẽ nhận thấy recvq của ch có receiver đang chờ đợi, nên nó sẽ lấy một sudog từ recvq, "đề cử" sudo đầu tiên trong recvq và thêm nó vào hàng đợi goroutine có thể chạy của P.

Sau đó, sender sao chép phần tử gửi vào địa chỉ elem của sudog, cuối cùng gọi goready để đánh thức G1, thay đổi trạng thái của nó thành runnable.

![channel-2.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/channel-2.png)

Khi lập lịch ghé thăm G1, G1 chuyển sang trạng thái running và thực hiện mã tiếp theo của goroutineA. G biểu thị cho các goroutine khác có thể có.

Thực tế ở đây liên quan đến việc một goroutine viết vào ngăn xếp của một goroutine khác. Có hai receiver đang đợi trên một đầu của kênh, và lúc này một sender sẽ gửi dữ liệu vào kênh. Để tăng hiệu suất, không cần thông qua bộ đệm của kênh để trung chuyển, chỉ cần sao chép dữ liệu từ địa chỉ nguồn sang địa chỉ đích là đủ, hiệu suất cao!

![channel-3.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/channel-3.png)

Hình trên là một hình minh họa, `3` sẽ được sao chép vào một vị trí trên ngăn xếp của G1, chính là địa chỉ của val, được lưu trữ trong trường elem.
