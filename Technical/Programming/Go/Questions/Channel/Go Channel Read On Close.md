---
title: Go Channel Read On Close
tags:
  - golang
  - interview
categories:
  - golang
  - interview
date created: 2023-10-04
date modified: 2023-10-04
---

# Go Channel: Read On Close

Đọc dữ liệu từ một channel có bộ đệm, ngay cả khi channel đã được đóng, vẫn có thể đọc được giá trị hợp lệ. Chỉ khi giá trị trả về `ok` là false, dữ liệu đọc được sẽ không hợp lệ.

```go
func main() {
	ch := make(chan int, 5)
	ch <- 18
	close(ch)
	x, ok := <-ch
	if ok {
		fmt.Println("received: ", x)
	}

	x, ok = <-ch
	if !ok {
		fmt.Println("channel đã đóng, dữ liệu không hợp lệ.")
	}
}
```

Kết quả chạy:

```go
received:  18
channel đã đóng, dữ liệu không hợp lệ.
```

Trước tiên, tạo một channel có bộ đệm, gửi một phần tử vào đó, sau đó đóng channel. Sau đó, thử đọc dữ liệu từ channel hai lần, lần đầu tiên vẫn có thể đọc giá trị bình thường. Lần thứ hai, giá trị `ok` trả về là false, cho thấy channel đã được đóng và không có dữ liệu trong channel.

Quá trình cụ thể có thể tham khảo trong phần [[Go Channel Recieve|Quá trình nhận dữ liệu]].
