---
title: Go Map Float as Key
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-21
date modified: 2023-09-21
---

# Go: Map Float as Key

Về mặt cú pháp, điều này hoàn toàn có thể trong ngôn ngữ Go. Trong Go, bất kỳ kiểu dữ liệu nào có thể so sánh đều có thể được sử dụng làm khóa (key). Trừ một số kiểu dữ liệu như slice, map, functions, các kiểu dữ liệu khác đều được chấp nhận. Cụ thể bao gồm: giá trị boolean, số, chuỗi, con trỏ, kênh, kiểu giao diện, cấu trúc, mảng chỉ chứa các kiểu dữ liệu nêu trên. Đặc điểm chung của các kiểu dữ liệu này là hỗ trợ toán tử `==` và `!=`, khi `k1 == k2`, ta có thể coi k1 và k2 là cùng một khóa. Trong trường hợp là kiểu cấu trúc, chỉ khi giá trị băm (hash) và giá trị chữ của chúng giống nhau, chúng mới được coi là cùng một khóa. Nhiều giá trị chữ giống nhau nhưng giá trị băm không nhất thiết phải giống nhau, ví dụ như tham chiếu.

Ngoài ra, bất kỳ kiểu dữ liệu nào cũng có thể được sử dụng làm giá trị (value), bao gồm cả kiểu dữ liệu map.

Dưới đây là một ví dụ:

```go
func main() {
	m := make(map[float64]int)
	m[1.4] = 1
	m[2.4] = 2
	m[math.NaN()] = 3
	m[math.NaN()] = 3

	for k, v := range m {
		fmt.Printf("[%v, %d] ", k, v)
	}

	fmt.Printf("\nk: %v, v: %d\n", math.NaN(), m[math.NaN()])
	fmt.Printf("k: %v, v: %d\n", 2.400000000001, m[2.400000000001])
	fmt.Printf("k: %v, v: %d\n", 2.4000000000000000000000001, m[2.4000000000000000000000001])

	fmt.Println(math.NaN() == math.NaN())
}
```

Kết quả chạy chương trình:

```shell
[2.4, 2] [NaN, 3] [NaN, 3] [1.4, 1] 
k: NaN, v: 0
k: 2.400000000001, v: 0
k: 2.4, v: 2
false
```

Trong ví dụ này, chúng ta định nghĩa một map với kiểu dữ liệu key là float64 và giá trị là int, và thêm 4 khóa vào map: 1.4, 2.4, NAN, NAN.

Khi in ra, chúng ta cũng in ra 4 khóa. Nếu bạn biết NAN != NAN, thì không có gì lạ. Vì kết quả so sánh không bằng nhau, tự nhiên trong map chúng được coi là hai khóa khác nhau.

Tiếp theo, chúng ta truy vấn một số khóa và phát hiện rằng NAN không tồn tại, 2.400000000001 cũng không tồn tại, trong khi 2.4000000000000000000000001 lại tồn tại.

Có vẻ hơi kỳ lạ, phải không?

Tiếp theo, thông qua mã hợp ngữ, tôi đã phát hiện ra một sự thật như sau:

Khi sử dụng float64 làm khóa, trước tiên nó được chuyển đổi thành kiểu uint64, sau đó mới được thêm vào khóa.

Cụ thể là thông qua hàm `Float64frombits`:

```go
// Float64frombits returns the floating point number corresponding
// the IEEE 754 binary representation b.
func Float64frombits(b uint64) float64 { return *(*float64)(unsafe.Pointer(&b)) }
```

Điều này có nghĩa là chuyển đổi float thành định dạng được quy định bởi IEEE 754. Ví dụ như câu lệnh gán:

```asm
0x00bd 00189 (test18.go:9)      LEAQ    "".statictmp_0(SB), DX
0x00c4 00196 (test18.go:9)      MOVQ    DX, 16(SP)
0x00c9 00201 (test18.go:9)      PCDATA  $0, $2
0x00c9 00201 (test18.go:9)      CALL    runtime.mapassign(SB)
```

Biến `"".statictmp_0(SB)` có giá trị như sau:

```asm
"".statictmp_0 SRODATA size=8
        0x0000 33 33 33 33 33 33 03 40
"".statictmp_1 SRODATA size=8
        0x0000 ff 3b 33 33 33 33 03 40
"".statictmp_2 SRODATA size=8
        0x0000 33 33 33 33 33 33 03 40
```

Chúng ta hãy in ra một số thông tin:

```go
package main

import (
	"fmt"
	"math"
)

func main() {
	m := make(map[float64]int)
	m[2.4] = 2

    fmt.Println(math.Float64bits(2.4))
	fmt.Println(math.Float64bits(2.400000000001))
	fmt.Println(math.Float64bits(2.4000000000000000000000001))
}
```

```shell
4612586738352862003
4612586738352864255
4612586738352862003
```

Chuyển sang hệ số hex:

```shell
0x4003333333333333
0x4003333333333BFF
0x4003333333333333
```

So sánh với `"".statictmp_0`, rõ ràng rồi đúng không? `2.4` và `2.4000000000000000000000001` sau khi được chuyển đổi bằng hàm `math.Float64bits()` có kết quả giống nhau. Tự nhiên, trong map, chúng được coi là cùng một khóa.

Tiếp theo, hãy xem NAN (không phải số):

```go
// NaN trả về một giá trị IEEE 754 "không phải số".
func NaN() float64 { return Float64frombits(uvnan) }
```

Định nghĩa của `uvnan` là:

```go
uvnan    = 0x7FF8000000000001
```

Hàm NAN() trực tiếp gọi `Float64frombits`, truyền vào hằng số cố định `0x7FF8000000000001`, để nhận được giá trị NAN. Vì NAN được tạo ra từ một hằng số cố định, tại sao khi thêm vào map, nó lại được coi là các khóa khác nhau?

Điều này phụ thuộc vào hàm băm của kiểu dữ liệu. Ví dụ, đối với float 64-bit, hàm băm của nó như sau:

```go
func f64hash(p unsafe.Pointer, h uintptr) uintptr {
	f := *(*float64)(p)
	switch {
	case f == 0:
		return c1 * (c0 ^ h) // +0, -0
	case f != f:
		return c1 * (c0 ^ h ^ uintptr(fastrand())) // any kind of NaN
	default:
		return memhash(p, h, 8)
	}
}
```

Trường hợp thứ hai, `f != f` áp dụng cho `NAN`, ở đây còn thêm một số ngẫu nhiên.

Như vậy, tất cả các câu đố đã được giải quyết.

Vì tính chất của NAN:

```shell
NAN != NAN
hash(NAN) != hash(NAN)
```

Do đó, khi tìm kiếm khóa là NAN trong map, không tìm thấy gì; nếu thêm 4 lần NAN vào, vòng lặp sẽ nhận được 4 lần NAN.

Cuối cùng, kết luận: float có thể được sử dụng làm khóa, nhưng do vấn đề về độ chính xác, có thể gây ra những vấn đề kỳ lạ, hãy sử dụng cẩn thận.

---

Trong trường hợp key là một kiểu dữ liệu tham chiếu, để xác định hai key có bằng nhau hay không, cần phải so sánh giá trị băm (hash) của chúng và giá trị chữ của key. Đó là điều được thể hiện trong ví dụ sau:

```go
func TestT(t *testing.T) {
	type S struct {
		ID	int
	}
	s1 := S{ID: 1}
	s2 := S{ID: 1}

	var h = map[*S]int {}
	h[&s1] = 1
	t.Log(h[&s1])
	t.Log(h[&s2])
	t.Log(s1 == s2)
}
```

kết quả thực thi:

```shell
=== RUN   TestT
--- PASS: TestT (0.00s)
    endpoint_test.go:74: 1
    endpoint_test.go:75: 0
    endpoint_test.go:76: true
PASS

Process finished with exit code 0
```
