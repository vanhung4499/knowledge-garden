---
title: Go Map Compare
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-21
date modified: 2023-09-21
---

# Go: Map Compare

Các điều kiện để xác định hai map có sự tương đồng sâu (deep equality) như sau:

```shell
1. Cả hai đều là nil.
2. Không rỗng và có cùng độ dài, trỏ đến cùng một đối tượng thực thể của map.
3. Các key tương ứng trỏ đến các value có sự tương đồng sâu.
```

Sử dụng `map1 == map2` trực tiếp là không đúng. Cách viết này chỉ có thể so sánh xem map có bằng nil hay không.

```go
package main

import "fmt"

func main() {
	var m map[string]int
	var n map[string]int

	fmt.Println(m == nil)
	fmt.Println(n == nil)

	// Không thể biên dịch thành công
	//fmt.Println(m == n)
}
```

Kết quả đầu ra:

```go
true
true
```

Do đó, ta chỉ có thể duyệt qua từng phần tử của map và so sánh xem các phần tử có tương đồng sâu hay không.
