---
title: Go Channel Struct
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-21
date modified: 2023-09-21
---

# Go Channel Struct

## Cấu trúc dữ liệu

Cấu trúc dữ liệu cơ bản cần xem mã nguồn, phiên bản là go 1.9.2:

```go
type hchan struct {
    // Số lượng phần tử trong chan
    qcount   uint
    // Độ dài của mảng vòng lặp dưới cùng của chan
    dataqsiz uint
    // Con trỏ trỏ đến mảng vòng lặp dưới cùng
    // Chỉ áp dụng cho chan có bộ nhớ đệm
    buf      unsafe.Pointer
    // Kích thước của phần tử trong chan
    elemsize uint16
    // Cờ đóng của chan
    closed   uint32
    // Loại phần tử trong chan
    elemtype *_type // kiểu phần tử
    // Chỉ số của phần tử đã gửi trong mảng vòng lặp
    sendx    uint   // chỉ số gửi
    // Chỉ số của phần tử đã nhận trong mảng vòng lặp
    recvx    uint   // chỉ số nhận
    // Danh sách goroutine đang chờ nhận
    recvq    waitq  // danh sách goroutine đang chờ nhận
    // Danh sách goroutine đang chờ gửi
    sendq    waitq  // danh sách goroutine đang chờ gửi

    // Khóa bảo vệ tất cả các trường trong hchan
    lock mutex
}
```

Ý nghĩa của các trường đã được ghi trong chú thích, và sau đây là một số trường quan trọng:

`buf` trỏ đến mảng vòng lặp dưới cùng, chỉ có chan có bộ nhớ đệm mới có.

`sendx`, `recvx` đều trỏ đến mảng vòng lặp dưới cùng, đại diện cho chỉ số vị trí hiện tại có thể gửi và nhận (tương đối với mảng dưới cùng).

`sendq`, `recvq` lần lượt đại diện cho các goroutine bị chặn, các goroutine này bị chặn vì đã cố gắng đọc từ channel hoặc gửi dữ liệu vào channel.

`waitq` là một danh sách liên kết hai chiều của `sudog`, và `sudog` thực tế là một gói của goroutine:

```go
type waitq struct {
    first *sudog
    last  *sudog
}
```

`lock` được sử dụng để đảm bảo mỗi hoạt động đọc channel hoặc ghi channel đều là nguyên tử.

Ví dụ, cấu trúc dữ liệu của một channel có dung lượng 6 và kiểu phần tử là int như sau:

![channel-0.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/channel-0.png)

# Tạo

Chúng ta biết rằng kênh có hai hướng, gửi và nhận. Lý thuyết thì chúng ta có thể tạo một kênh chỉ để gửi hoặc chỉ để nhận, nhưng sau khi tạo ra kênh như vậy, chúng ta sẽ sử dụng nó như thế nào? Làm sao để nhận dữ liệu từ một kênh chỉ gửi hoặc gửi dữ liệu vào một kênh chỉ nhận?

Nhìn chung, chúng ta sử dụng `make` để tạo một kênh có thể gửi và nhận:

```go
// Kênh không có bộ đệm
ch1 := make(chan int)
// Kênh có bộ đệm
ch2 := make(chan int, 10)
```

Dựa trên phân tích [hợp ngữ](https://mp.weixin.qq.com/s/obnnVkO2EiFnuXk_AIDHWw), chúng ta biết rằng hàm cuối cùng để tạo kênh là `makechan`:

```go
func makechan(t *chantype, size int64) *hchan
```

Dựa trên nguyên mẫu hàm, kênh được tạo ra là một con trỏ. Vì vậy, chúng ta có thể truyền kênh trực tiếp giữa các hàm mà không cần truyền con trỏ của kênh.

Xem xét mã sau:

```go
const hchanSize = unsafe.Sizeof(hchan{}) + uintptr(-int(unsafe.Sizeof(hchan{}))&(maxAlign-1))

func makechan(t *chantype, size int64) *hchan {
	elem := t.elem

	// Bỏ qua mã kiểm tra kích thước và sắp xếp của kênh
	// ...

	var c *hchan
	// Nếu loại phần tử không chứa con trỏ hoặc kích thước bằng 0 (kênh không có bộ đệm)
	// Chỉ cần phân bổ bộ nhớ một lần
	if elem.kind&kindNoPointers != 0 || size == 0 {
		// Nếu cấu trúc hchan không chứa con trỏ, GC sẽ không quét các phần tử trong kênh
		// Chỉ phân bổ bộ nhớ có kích thước "kích thước cấu trúc hchan + kích thước phần tử * số lượng"
		c = (*hchan)(mallocgc(hchanSize+uintptr(size)*elem.size, nil, true))
		// Nếu là kênh có bộ đệm và kích thước phần tử khác 0 (kích thước phần tử bằng 0: struct{})
		if size > 0 && elem.size != 0 {
			c.buf = add(unsafe.Pointer(c), hchanSize)
		} else {
			// Trình phát hiện đua (race detector) sử dụng vị trí này để đồng bộ hóa
			// Cũng ngăn chúng ta trỏ ra ngoài phạm vi phân bổ (xem vấn đề 9401).
			// 1. Nếu không có bộ đệm, buf không được sử dụng, chỉ trỏ đến địa chỉ bắt đầu của kênh
			// 2. Nếu có bộ đệm, nếu nó có thể đến đây, điều đó có nghĩa là phần tử không chứa con trỏ và loại phần tử là struct{} cũng không ảnh hưởng
			// Vì chỉ sử dụng con trỏ nhận và gửi, không sao chép thực sự vào c.buf (điều này sẽ ghi đè nội dung của kênh)
			c.buf = unsafe.Pointer(c)
		}
	} else {
		// Thực hiện hai lần phân bổ bộ nhớ
		c = new(hchan)
		c.buf = newarray(elem, int(size))
	}
	c.elemsize = uint16(elem.size)
	c.elemtype = elem
	// Độ dài mảng vòng lặp
	c.dataqsiz = uint(size)

	// Trả về con trỏ hchan
	return c
}
```

Sau khi tạo một kênh mới, bộ nhớ được phân bổ trên heap, nó sẽ trông như thế này:

![channel-1.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/channel-1.png)
