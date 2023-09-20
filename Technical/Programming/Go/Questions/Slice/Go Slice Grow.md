---
title: Go Slice Grow
tags:
  - interview
  - golang
categories: golang, interview
date created: 2023-09-20
date modified: 2023-09-20
---

# Go: Slice Grow

Thường thì, việc mở rộng slice xảy ra sau khi thêm các phần tử vào slice bằng cách sử dụng hàm `append`.

Trước tiên, hãy xem nguyên mẫu của hàm `append`:

```go
func append(slice []Type, elems ...Type) []Type
```

Hàm `append` có số lượng tham số biến đổi, do đó có thể thêm nhiều giá trị vào slice, hoặc thêm một slice bằng cách sử dụng `…`.

```go
slice = append(slice, elem1, elem2)
slice = append(slice, anotherSlice...)
```

Hàm `append` trả về một slice mới, và trình biên dịch Go không cho phép gọi hàm `append` mà không sử dụng giá trị trả về.

```go
append(slice, elem1, elem2)
append(slice, anotherSlice...)
```

Vì vậy, cách sử dụng trên là không đúng và sẽ không biên dịch được.

Sử dụng hàm `append` có thể thêm phần tử vào slice, thực tế là thêm phần tử vào mảng gốc. Tuy nhiên, độ dài của mảng gốc là cố định, nếu chỉ số `len-1` trỏ đến phần tử cuối cùng của mảng, không thể thêm phần tử nữa.

Khi đó, slice sẽ được di chuyển đến vị trí bộ nhớ mới, đồng thời độ dài của mảng gốc cũng sẽ tăng lên để chứa các phần tử mới. Đồng thời, để đối phó với việc thêm phần tử trong tương lai, độ dài của mảng gốc mới, tức là sức chứa của slice mới, sẽ có một số `buffer` dư thừa. Nếu không có `buffer`, việc thêm phần tử sẽ gây ra việc di chuyển mảng liên tục, gây tốn kém.

Kích thước `buffer` được dự đoán theo một quy tắc nhất định. Trước phiên bản Go 1.18, hầu hết các bài viết trên mạng mô tả quy tắc mở rộng slice như sau:

> Khi sức chứa của slice gốc nhỏ hơn `1024`, sức chứa của slice mới là gấp đôi sức chứa cũ; khi sức chứa của slice gốc vượt quá `1024`, sức chứa của slice mới là `1.25` lần sức chứa cũ.

Tuy nhiên, sau phiên bản Go 1.18, quy tắc mở rộng slice đã thay đổi thành:

> Khi sức chứa của slice gốc (oldcap) nhỏ hơn 256, sức chứa của slice mới (newcap) là gấp đôi sức chứa cũ; khi sức chứa của slice gốc vượt quá 256, sức chứa của slice mới được tính theo công thức `newcap = oldcap + (oldcap + 3 * 256) / 4`.

Để minh họa quy tắc trên, tôi đã viết một đoạn mã đơn giản:

```go
package main

import "fmt"

func main() {
	s := make([]int, 0)

	oldCap := cap(s)

	for i := 0; i < 2048; i++ {
		s = append(s, i)

		newCap := cap(s)

		if newCap != oldCap {
			fmt.Printf("[%d -> %4d] cap = %-4d  |  after append %-4d  cap = %-4d\n", 0, i-1, oldCap, i, newCap)
			oldCap = newCap
		}
	}
}
```

Tôi tạo một slice rỗng ban đầu, sau đó trong một vòng lặp, tôi liên tục thêm phần tử vào slice. Tôi ghi lại sự thay đổi về sức chứa và mỗi khi sức chứa thay đổi, tôi ghi lại sức chứa cũ, sức chứa sau khi thêm phần tử và các phần tử trong slice tại thời điểm đó. Như vậy, tôi có thể quan sát được sự thay đổi về sức chứa của slice cũ và slice mới, từ đó tìm ra quy tắc.

Kết quả chạy (trước phiên bản 1.18):

```shell
[0 ->   -1] cap = 0     |  after append 0     cap = 1   
[0 ->    0] cap = 1     |  after append 1     cap = 2   
[0 ->    1] cap = 2     |  after append 2     cap = 4   
[0 ->    3] cap = 4     |  after append 4     cap = 8   
[0 ->    7] cap = 8     |  after append 8     cap = 16  
[0 ->   15] cap = 16    |  after append 16    cap = 32  
[0 ->   31] cap = 32    |  after append 32    cap = 64  
[0 ->   63] cap = 64    |  after append 64    cap = 128 
[0 ->  127] cap = 128   |  after append 128   cap = 256 
[0 ->  255] cap = 256   |  after append 256   cap = 512 
[0 ->  511] cap = 512   |  after append 512   cap = 1024
[0 -> 1023] cap = 1024  |  after append 1024  cap = 1280
[0 -> 1279] cap = 1280  |  after append 1280  cap = 1696
[0 -> 1695] cap = 1696  |  after append 1696  cap = 2304
```

Kết quả chạy (phiên bản 1.18):

```shell
[0 ->   -1] cap = 0     |  after append 0     cap = 1
[0 ->    0] cap = 1     |  after append 1     cap = 2   
[0 ->    1] cap = 2     |  after append 2     cap = 4   
[0 ->    3] cap = 4     |  after append 4     cap = 8   
[0 ->    7] cap = 8     |  after append 8     cap = 16  
[0 ->   15] cap = 16    |  after append 16    cap = 32  
[0 ->   31] cap = 32    |  after append 32    cap = 64  
[0 ->   63] cap = 64    |  after append 64    cap = 128 
[0 ->  127] cap = 128   |  after append 128   cap = 256 
[0 ->  255] cap = 256   |  after append 256   cap = 512 
[0 ->  511] cap = 512   |  after append 512   cap = 848 
[0 ->  847] cap = 848   |  after append 848   cap = 1280
[0 -> 1279] cap = 1280  |  after append 1280  cap = 1792
[0 -> 1791] cap = 1792  |  after append 1792  cap = 2560
```

Dựa vào kết quả trên, chúng ta có thể thấy các quy tắc như sau (trước phiên bản 1.18):

- Khi sức chứa của slice gốc (oldcap) nhỏ hơn 1024, sức chứa của slice mới (newcap) là gấp đôi sức chứa cũ.
- Khi sức chứa của slice gốc (oldcap) lớn hơn hoặc bằng 1024, sức chứa của slice mới (newcap) là 1.25 lần sức chứa cũ.

Tuy nhiên, sau phiên bản 1.18, quy tắc đã thay đổi như sau:

- Khi sức chứa của slice gốc (oldcap) nhỏ hơn 256, sức chứa của slice mới (newcap) là gấp đôi sức chứa cũ.
- Khi sức chứa của slice gốc (oldcap) lớn hơn hoặc bằng 256, sức chứa của slice mới (newcap) được tính theo công thức newcap = oldcap + (oldcap + 3 * 256) / 4.

Cần lưu ý rằng quy tắc này chỉ áp dụng cho việc mở rộng slice khi thêm phần tử vào. Quy tắc này giúp chúng ta hiểu rõ hơn về cách slice mở rộng và sử dụng slice một cách hiệu quả.

Bằng cách xem mã nguồn, chúng ta có thể xem rõ quy tắc mở rộng slice.

Trong phiên bản Go 1.9.5:

```go
// go 1.9.5 src/runtime/slice.go:82
func growslice(et *_type, old slice, cap int) slice {
    // ……
    newcap := old.cap
	doublecap := newcap + newcap
	if cap > doublecap {
		newcap = cap
	} else {
		if old.len < 1024 {
			newcap = doublecap
		} else {
			for newcap < cap {
				newcap += newcap / 4
			}
		}
	}
	// ……
	
	capmem = roundupsize(uintptr(newcap) * ptrSize)
	newcap = int(capmem / ptrSize)
}
```

Trong phiên bản Go 1.18:

```go
// go 1.18 src/runtime/slice.go:178
func growslice(et *_type, old slice, cap int) slice {
    // ……
    newcap := old.cap
	doublecap := newcap + newcap
	if cap > doublecap {
		newcap = cap
	} else {
		const threshold = 256
		if old.cap < threshold {
			newcap = doublecap
		} else {
			for 0 < newcap && newcap < cap {
                // Chuyển từ việc mở rộng 2 lần cho slice nhỏ
				// sang việc mở rộng 1.25 lần cho slice lớn. Công thức này
				// tạo ra một sự chuyển đổi mượt mà giữa hai trường hợp.
				newcap += (newcap + 3*threshold) / 4
			}
			if newcap <= 0 {
				newcap = cap
			}
		}
	}
	// ……
    
	capmem = roundupsize(uintptr(newcap) * ptrSize)
	newcap = int(capmem / ptrSize)
}
```

Như bạn đã thấy, nếu chỉ xem nửa đầu của mã nguồn, thì những quy tắc về `newcap` mà các bài viết trên mạng đề cập là đúng. Tuy nhiên, nửa sau của mã nguồn cũng thực hiện một quá trình "căn chỉnh bộ nhớ" cho `newcap`, điều này liên quan đến chiến lược phân bổ bộ nhớ. Sau khi hoàn tất quá trình căn chỉnh bộ nhớ, sức chứa của slice mới sẽ lớn hơn hoặc bằng `newcap` được tạo ra từ nửa đầu của mã nguồn.

Sau đó, mã nguồn yêu cầu bộ quản lý bộ nhớ Go cấp phát bộ nhớ, sao chép dữ liệu từ slice cũ sang và thêm các phần tử append vào mảng cơ sở mới.

Cuối cùng, `growslice` trả về một slice mới cho người gọi hàm, với độ dài không thay đổi nhưng sức chứa đã tăng lên.

【Mở rộng 1】

Hãy xem ví dụ:

```go
package main

import "fmt"

func main() {
    s := []int{5}
    s = append(s, 7)
    s = append(s, 9)
    x := append(s, 11)
    y := append(s, 12)
    fmt.Println(s, x, y)
}
```

|Code|Mô tả trạng thái slice|
|---|---|
|s := []int{5}|s chỉ có một phần tử, `[5]`|
|s = append(s, 7)|s mở rộng, sức chứa tăng lên 2, `[5, 7]`|
|s = append(s, 9)|s mở rộng, sức chứa tăng lên 4, `[5, 7, 9]`. Lưu ý, lúc này s có độ dài là 3, chỉ có 3 phần tử|
|x := append(s, 11)|Vì mảng cơ sở của s vẫn còn chỗ trống, nên không cần mở rộng. Như vậy, mảng cơ sở trở thành `[5, 7, 9, 11]`. Lưu ý, lúc này s = `[5, 7, 9]`, sức chứa là 4; x = `[5, 7, 9, 11]`, sức chứa là 4. Ở đây, s không thay đổi|
|y := append(s, 12)|Ở đây vẫn là thêm phần tử vào cuối của s, vì độ dài của s là 3, sức chứa là 4, nên chỉ cần điền số 12 vào vị trí chỉ số 3 của mảng cơ sở. Kết quả: s = `[5, 7, 9]`, y = `[5, 7, 9, 12]`, x = `[5, 7, 9, 12]`, cả x và y đều có độ dài là 4, sức chứa cũng là 4|

Vì vậy, kết quả thực thi chương trình là:

```shell
[5 7 9] [5 7 9 12] [5 7 9 12]
```

Cần lưu ý rằng, sau khi thực hiện hàm append, một slice hoàn toàn mới được trả về và không ảnh hưởng đến slice được truyền vào.

【Mở rộng 2】

Chúng ta hãy xem một ví dụ cuối:

```go
package main

import "fmt"

func main() {
	s := []int{1,2}
	s = append(s,4,5,6)
	fmt.Printf("len=%d, cap=%d",len(s),cap(s))
}
```

Kết quả chạy là:

```shell
len=5, cap=6
```

Nếu theo như các bài viết trên mạng đã tổng kết: khi độ dài của slice gốc nhỏ hơn 1024, sức chứa tăng gấp đôi mỗi lần. Khi thêm phần tử 4, sức chứa tăng lên 4; khi thêm phần tử 5, sức chứa không thay đổi; khi thêm phần tử 6, sức chứa tăng gấp đôi, trở thành 8.

Vậy kết quả chạy của đoạn mã trên sẽ là:

```shell
len=5, cap=8
```

Điều này là sai! Hãy xem xét kỹ hơn, tại sao lại như vậy, và xem lại mã nguồn:

```go
// go 1.9.5 src/runtime/slice.go:82
func growslice(et *_type, old slice, cap int) slice {
    // ……
    newcap := old.cap
	doublecap := newcap + newcap
	if cap > doublecap {
		newcap = cap
	} else {
		// ……
	}
	// ……
	
	capmem = roundupsize(uintptr(newcap) * ptrSize)
	newcap = int(capmem / ptrSize)
}
```

Hàm này có các tham số lần lượt là `kiểu phần tử, slice cũ, sức chứa tối thiểu của slice mới`.

Trong ví dụ, `s` ban đầu chỉ có 2 phần tử, `len` và `cap` đều là 2. Sau khi `append` ba phần tử, độ dài trở thành 5, sức chứa tối thiểu cần là 5, tức là khi gọi hàm `growslice`, tham số thứ ba được truyền là 5, tức là `cap=5`. Một mặt, `doublecap` là gấp đôi sức chứa của slice gốc, bằng 4. Thỏa mãn điều kiện `if` đầu tiên, vì vậy `newcap` trở thành 5.

Tiếp theo, gọi hàm `roundupsize`, truyền vào giá trị 40. (Trong mã nguồn, `ptrSize` đại diện cho kích thước của một con trỏ, trên máy 64-bit là 8 byte).

Chúng ta tiếp tục xem xét về việc căn chỉnh bộ nhớ, và trích xuất mã của hàm `roundupsize`:

```go
// src/runtime/msize.go:13
func roundupsize(size uintptr) uintptr {
	if size < _MaxSmallSize {
		if size <= smallSizeMax-8 {
			return uintptr(class_to_size[size_to_class8[(size+smallSizeDiv-1)/smallSizeDiv]])
		} else {
			//……
		}
	}
    //……
}

const _MaxSmallSize = 32768
const smallSizeMax = 1024
const smallSizeDiv = 8
```

Rõ ràng, chúng ta sẽ trả về kết quả của biểu thức này:

```go
class_to_size[size_to_class8[(size+smallSizeDiv-1)/smallSizeDiv]]
```

Đây là hai `slice` liên quan đến việc phân bổ bộ nhớ trong mã nguồn Go. `class_to_size` được sử dụng để lấy kích thước của `object` được phân vùng thông qua `spanClass`. Còn `size_to_class8` biểu thị `spanClass` tương ứng với kích thước `size`.

```go
var size_to_class8 = [smallSizeMax/smallSizeDiv + 1]uint8{0, 1, 2, 3, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 22, 23, 23, 23, 23, 24, 24, 24, 24, 25, 25, 25, 25, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 28, 28, 28, 28, 28, 28, 28, 28, 29, 29, 29, 29, 29, 29, 29, 29, 30, 30, 30, 30, 30, 30, 30, 30, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32}

var class_to_size = [_NumSizeClasses]uint16{0, 8, 16, 24, 32, 48, 64, 80, 96, 112, 128, 144, 160, 176, 192, 208, 224, 240, 256, 288, 320, 352, 384, 416, 448, 480, 512, 576, 640, 704, 768, 896, 1024, 1152, 1280, 1408, 1536, 1792, 2048, 2304, 2688, 3072, 3200, 3456, 4096, 4864, 5376, 6144, 6528, 6784, 6912, 8192, 9472, 9728, 10240, 10880, 12288, 13568, 14336, 16384, 18432, 19072, 20480, 21760, 24576, 27264, 28672, 32768}
```

Chúng ta truyền vào `size` có giá trị là 40. Vì vậy, `(size+smallSizeDiv-1)/smallSizeDiv = 5` ; phần tử có chỉ số `5` của mảng `size_to_class8` là `5` ; phần tử có chỉ số `5` của mảng `class_to_size` là `48`.

Cuối cùng, sức chứa mới của slice là `6`:

```go
newcap = int(capmem / ptrSize) // 6
```

Còn về hai `mảng ma thuật` trên, chúng ta sẽ không đi vào chi tiết.

【Mở rộng 2】  
Thêm phần tử vào một `nil slice` sẽ xảy ra gì? Tại sao?

Thực tế, `nil slice` hoặc `empty slice` đều có thể mở rộng bằng cách gọi hàm append để có được một mảng cơ sở mới. Cuối cùng, cả hai đều gọi hàm `mallocgc` để yêu cầu bộ nhớ từ bộ quản lý bộ nhớ của Go, sau đó gán cho `nil slice` hoặc `empty slice` ban đầu, và biến thành một real `slice`.
