---
title: Go Slice vs Array
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-20
date modified: 2023-09-20
---

# Go: Slice vs Array

Slice là một cấu trúc dữ liệu trong Go, nó được mô tả bởi một mảng và các thông tin về độ dài và sức chứa của mảng đó. Slice là một phần của mảng, nó cung cấp một cách để thao tác với một phần của mảng mà không cần sao chép toàn bộ mảng.

Mảng trong Go có độ dài cố định và không thể thay đổi sau khi được khai báo. Trong Go, mảng không được sử dụng phổ biến vì độ dài của mảng là một phần của kiểu dữ liệu, điều này giới hạn khả năng biểu diễn của mảng. Ví dụ, [3]int và [4]int là hai kiểu dữ liệu khác nhau.

Trái lại, slice rất linh hoạt và có thể mở rộng độ dài của nó theo nhu cầu. Kiểu và độ dài của slice không liên quan đến nhau.

Mảng là một phần liên tục trong bộ nhớ, trong khi slice thực chất là một cấu trúc dữ liệu bao gồm ba trường: con trỏ đến mảng, độ dài và sức chứa.

```go
// runtime/slice.go
type slice struct {
	array unsafe.Pointer // con trỏ đến mảng
	len   int // độ dài
	cap   int // sức chứa
}
```

Cấu trúc dữ liệu của slice như sau:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slice.png)

Lưu ý rằng một mảng có thể được trỏ đến bởi nhiều slice cùng một lúc, do đó việc thay đổi một phần tử của một slice có thể ảnh hưởng đến các slice khác.

【Mở rộng 1】  
`[3]int` và `[4]int` có cùng một kiểu dữ liệu không?

Không. Vì độ dài của mảng là một phần của kiểu dữ liệu, điều này khác với slice.

【Mở rộng 2】  
Đoạn mã dưới đây sẽ in ra gì?

```go
package main

import "fmt"

func main() {
	slice := []int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
	s1 := slice[2:5]
	s2 := s1[2:6:7]

	s2 = append(s2, 100)
	s2 = append(s2, 200)

	s1[2] = 20

	fmt.Println(s1)
	fmt.Println(s2)
	fmt.Println(slice)
}
```

Kết quả:

```shell
[2 3 20]
[4 5 6 7 100 200]
[0 1 2 3 20 5 6 7 100 9]
```

`s1` là một phần của `slice` từ chỉ số 2 (đóng) đến chỉ số 5 (mở, thực tế chỉ lấy đến chỉ số 4), có độ dài 3 và sức chứa mặc định đến cuối mảng, là 8.  
`s2` là một phần của `s1` từ chỉ số 2 (đóng) đến chỉ số 6 (mở, thực tế chỉ lấy đến chỉ số 5), có sức chứa đến chỉ số 7 (mở, thực tế chỉ lấy đến chỉ số 6), là 5.

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slice1.png)

Tiếp theo, thêm một phần tử 100 vào cuối `s2`:

```go
s2 = append(s2, 100)
```

Sức chứa của `s2` vừa đủ, nên phần tử mới được thêm trực tiếp. Tuy nhiên, điều này sẽ thay đổi phần tử tương ứng trong mảng gốc và `s1`.

![slice2.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slice2.png)

Tiếp theo, thêm một phần tử 200 vào cuối `s2`:

```go
s2 = append(s2, 100)
```

Lần này, sức chứa của `s2` không đủ, nên cần phải mở rộng. `s2` sẽ tạo một mảng mới, sao chép các phần tử từ vị trí cũ sang vị trí mới và mở rộng sức chứa. Đồng thời, để đối phó với việc mở rộng sức chứa lần sau có thể cần, `s2` sẽ để lại một số `buffer` trong quá trình mở rộng, sức chứa mới sẽ là gấp đôi sức chứa cũ, tức là 10.

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slice2.png)

Cuối cùng, thay đổi phần tử tại chỉ số 2 của `s1`:

```go
s1[2] = 20
```

Lần này chỉ ảnh hưởng đến phần tử tương ứng trong mảng gốc. Nó không ảnh hưởng đến `s2` vì `s2` đã đi xa rồi.

![slice4.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slice4.png)

Một điểm nữa, khi in `s1`, chỉ in ra số phần tử trong `s1`. Nó không in ra toàn bộ mảng dù mảng có nhiều hơn 3 phần tử.
