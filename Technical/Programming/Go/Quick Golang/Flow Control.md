---
categories: [golang, quick-golang]
title: Flow Control
date created: 2023-03-28
date modified: 2023-07-10
tags: [golang, quick-golang]
---

## if-else

**Mô tả:**

- Câu lệnh điều kiện không cần đặt  `()`
- Phải có dấu ngoặc nhọn `{}` và dấu ngoặc nhọn bên trái phải `{`nằm trên cùng một dòng với `if` hoặc `else`
- Sau `if` và trước các câu điều kiện, các câu lệnh khởi tạo biến có thể được thêm vào, cách nhau bởi dấu `;`.

```go
package main

import "fmt"  

func main() {
	if 7 % 2 == 0 {
		fmt.Println("7 is even")
	} else {
		fmt.Println("7 is odd") // 7 is odd
	}

	if 8 % 4 == 0 {
		fmt.Println("8 is divisible by 4") // 8 is divisible by 4
	}

	if num := 9; num < 0 {
		fmt.Println(num, "is negative")
	} else if num < 10 {
		fmt.Println(num, "has 1 digit") // 9 has 1 digit
	} else {
		fmt.Println(num, "has multiple digits")
	}
}
```

## switch

**Mô tả:**

- Dấu ngoặc nhọn bên trái `{` phải nằm trên cùng một dòng với `switch`
- Biểu thức điều kiện không ràng buộc hằng số hoặc số nguyên
- Bạn có thể thêm một câu lệnh khởi tạo biến sau `switch` và sử dụng `;` để tách
- Biểu thức điều kiện không thể được đặt trong trường hợp này, toàn bộ cấu trúc `switch` tương đương với logic của nhiều  `if-else`
- Nhiều tùy chọn kết quả có thể xuất hiện trong một `case`
- Việc thêm từ khóa `fallthrough` vào `case` sẽ tiếp tục thực hiện câu lệnh `case` điều kiện tiếp theo mà không cần xét `case`
- `default` được hỗ trợ trong `switch` , nếu không `case` nào thực thi thì `default` sẽ được chạy.

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	i := 2
	fmt.Print("write ", i, " as ")
	switch i {
		case 1:
			fmt.Println("one")
		case 2:
			fmt.Println("two") // write 2 as two
			fallthrough
		case 3:
			fmt.Println("three") // three
		case 4, 5, 6:
			fmt.Println("four, five, six")
	}

	switch num := 9; num {
		case 1:
			fmt.Println("one")
		default:
			fmt.Println("nine") // nine
	}

	switch time.Now().Weekday() {
		case time.Saturday, time.Sunday:
			fmt.Println("it's the weekend")
		default:
			fmt.Println("it's a weekday") // it's a weekday
	}

	t := time.Now()
	switch {
		case t.Hour() < 12:
			fmt.Println("it's before noon")
		default:
			fmt.Println("it's after noon") // it's after noon
	}
}
```

## for

**Mô tả:**

- Biểu thức điều kiện không cần đặt `()`
- Phải có dấu ngoặc nhọn `{}` và dấu ngoặc nhọn bên trái phải `{`nằm trên cùng một dòng với `for`
- Hỗ trợ `continue` và `break`.

> Không có while hay do-white, for thay luôn why

```go
package main

import (
	"fmt"
)

func main() {
	i := 1
	// chỉ có điều kiện
	for i <= 3 {
		fmt.Println(i)
		i = i + 1
	}

	// khai báo, điều kiện, thay đổi giá trị
	for j := 7; j <= 9; j++ {
		fmt.Println(j)
	}

	// lăp vô hạn
	for {
		fmt.Println("loop")
		break
	}

	// duyệt mảng
	a := [...]int{10, 20, 30, 40}
	for i := range a {
		fmt.Println(i)
	}
	
	for i, v := range a {
		fmt.Println(i, v)
	}

	// duyệt slice
	s := []string{"a", "b", "c"}
	for i := range s {
		fmt.Println(i)
	}

	for i, v := range s {
		fmt.Println(i, v)
	}

	// duyệt map
	m := map[string]int{"a": 10, "b": 20, "c": 30}
	for k := range m {
		fmt.Println(k)
	}

	for k, v := range m {
		fmt.Println(k, v)
	}
}
```

## goto, break, continue

**Các tính năng của goto:**

- Nó chỉ có thể nhảy trong functuon và cần được sử dụng cùng với label;
- Không thể bỏ qua câu lệnh khai báo biến cục bộ
- Nó chỉ có thể nhảy đến phạm vi cùng cấp hoặc phạm vi cấp trên và không thể nhảy vào phạm vi bên trong.

```go
package main

import (
	"fmt"
)

func main() {
	// thoát vòng lặp
	for i := 0; ; i++ {
		if i == 2 {
			goto L1
		}
		fmt.Println(i)
	}

L1:
	fmt.Println("Done")

	// bỏ qua khai báo biến, không cho phép
	// goto L2
	// j := 1
	// L2:
}
```

**Các tính năng của break:**

- Lệnh `break` được sử dụng một mình, nó được sử dụng để nhảy ra khỏi việc thực thi câu lệnh `for`, `switch`, `select` hiện tại
- Lệnh `break` được sử dụng cùng với label, nó được sử dụng để nhảy ra khỏi quá trình thực thi các câu lệnh `for`, `select`, `switch` và được xác định bởi label. Nó có thể được sử dụng để thoát ra khỏi nhiều vòng lặp, nhưng label và phải ở trong cùng một hàm.

```go
package main

import (
	"fmt"
)

func main() {
	// break nhảy tới label，sau đó bỏ qua vòng lặp for
L3:
	for i := 0; ; i++ {
		for j := 0; ; j++ {
			if i >= 2 {
				break L3
			}
			if j > 4 {
				break
			}
			fmt.Println(i, j)
		}
	}
}

// 0 0
// 0 1
// 0 2
// 0 3
// 0 4
// 1 0
// 1 1
// 1 2
// 1 3
// 1 4
```

**Các tính năng của continue:**

- Lệnh `continue` được sử dụng một mình, nó được sử dụng để nhảy ra khỏi lầm lặp hiện tại của vòng lặp `for` hiện tại;
- Lệnh `continue` được sử dụng cùng với một nhãn, nó được sử dụng để nhảy ra khỏi lần lặp hiện tại của câu lệnh `for`, nhưng label và `continue` phải ở trong cùng một hàm.

```go
package main

import (
	"fmt"
)

func main() {
// continue bỏ qua lần lặp hiện tại，thực thi i++
L4:
	for i := 0; ; i++ {
		for j := 0; j < 6; j++ {
			if i > 4 {
				break L4
			}
			if i >= 2 {
				continue L4
			}
			if j > 4 {
				continue
			}
			fmt.Println(i, j)
		}
	}
}

// 0 0
// 0 1
// 0 2
// 0 3
// 0 4
// 1 0
// 1 1
// 1 2
// 1 3
// 1 4
```
