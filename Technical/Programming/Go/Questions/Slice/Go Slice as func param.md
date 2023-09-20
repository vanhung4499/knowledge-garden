---
title: Go Slice as func param
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-20
date modified: 2023-09-20
---

# Go: Slice as function parameter

Trong phần trước, chúng ta đã nói rằng slice thực chất là một cấu trúc dữ liệu, bao gồm ba thành phần: len, cap, array. Lần lượt đại diện cho độ dài của slice, dung lượng và địa chỉ dữ liệu gốc.

Khi slice được sử dụng làm tham số cho một hàm, nó chỉ là một cấu trúc dữ liệu thông thường. Điều này dễ hiểu: nếu chúng ta truyền slice trực tiếp, đối số thực sự không bị thay đổi bởi các hoạt động trong hàm; nếu chúng ta truyền con trỏ slice, đối với người gọi, slice gốc sẽ bị thay đổi.

Cần lưu ý rằng, bất kể chúng ta truyền slice hay con trỏ slice, nếu chúng ta thay đổi dữ liệu của mảng gốc, nó sẽ phản ánh vào dữ liệu gốc của đối số slice. Tại sao chúng ta có thể thay đổi dữ liệu của mảng gốc? Điều này dễ hiểu: dữ liệu gốc trong slice là một con trỏ trong cấu trúc dữ liệu slice, mặc dù cấu trúc dữ liệu slice không bị thay đổi, tức là địa chỉ dữ liệu gốc không thay đổi. Tuy nhiên, thông qua con trỏ trỏ đến dữ liệu gốc, chúng ta có thể thay đổi dữ liệu gốc của slice mà không gặp vấn đề.

Chúng ta có thể lấy địa chỉ của mảng thông qua trường array của slice. Trong mã, chúng ta thay đổi giá trị các phần tử của mảng gốc bằng các hoạt động như `s[i] = 10`.

Ngoài ra, cần lưu ý rằng trong Go, tham số của hàm chỉ truyền giá trị, không truyền tham chiếu.

Hãy xem một đoạn mã ví dụ:

```go
package main

import "fmt"

func main() {
	s := []int{1, 1, 1}
	f(s)
	fmt.Println(s)
}

func f(s []int) {
	// i chỉ là một bản sao, không thể thay đổi giá trị của các phần tử trong s
	/*for _, i := range s {
		i++
	}
	*/

	for i := range s {
		s[i] += 1
	}
}
```

Chạy chương trình, kết quả là:

```shell
[2 2 2]
```

Thật sự đã thay đổi dữ liệu gốc của slice ban đầu. Ở đây, chúng ta truyền một bản sao của slice, `s` trong hàm `f` chỉ là một bản sao của `s` trong hàm `main`. Trong `f`, tác động lên `s` không làm thay đổi `s` ở bên ngoài của hàm `main`.

Để thực sự thay đổi slice bên ngoài, chúng ta chỉ có thể gán slice mới trả về cho slice gốc, hoặc truyền con trỏ đến slice cho hàm. Hãy xem một ví dụ khác:

```go
package main

import "fmt"

func myAppend(s []int) []int {
	// Mặc dù `s` đã thay đổi ở đây, nhưng nó không ảnh hưởng đến `s` ở hàm bên ngoài
	s = append(s, 100)
	return s
}

func myAppendPtr(s *[]int) {
	// Sẽ thay đổi `s` bên ngoài
	*s = append(*s, 100)
	return
}

func main() {
	s := []int{1, 1, 1}
	newS := myAppend(s)

	fmt.Println(s)
	fmt.Println(newS)

	s = newS

	myAppendPtr(&s)
	fmt.Println(s)
}
```

Kết quả chạy là:

```shell
[1 1 1]
[1 1 1 100]
[1 1 1 100 100]
```

Trong hàm `myAppend`, mặc dù chúng ta đã thay đổi `s`, nhưng nó chỉ là một giá trị truyền vào, không ảnh hưởng đến `s` bên ngoài. Do đó, kết quả in ra dòng đầu tiên vẫn là `[1 1 1]`.

`newS` là một slice mới, được tạo từ `s`. Do đó, nó in ra kết quả sau khi thêm một phần tử `100`: `[1 1 1 100]`.

Cuối cùng, chúng ta gán `newS` cho `s`, lúc này `s` mới thực sự trở thành một slice mới. Sau đó, chúng ta truyền con trỏ đến `s` cho hàm `myAppendPtr`, lần này `s` thực sự bị thay đổi: `[1 1 1 100 100]`.
