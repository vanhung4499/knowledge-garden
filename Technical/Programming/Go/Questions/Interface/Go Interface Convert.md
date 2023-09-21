---
title: Go Interface Convert
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-21
date modified: 2023-09-21
---

# Go Interface: Convert

Trong mã nguồn của `iface`, chúng ta có thể thấy rằng nó bao gồm kiểu của giao diện `interfacetype` và kiểu của thực thể `_type`, cả hai đều là thành viên của trường `itab` của `iface`. Điều này có nghĩa là để tạo ra một `itab`, chúng ta cần cả kiểu của giao diện và kiểu của thực thể.

> <Kiểu giao diện, Kiểu thực thể> -> itable

Khi xác định xem một kiểu có đáp ứng một giao diện nào đó hay không, Go sử dụng tập hợp phương thức của kiểu và tập hợp phương thức của giao diện để so khớp. Nếu tập hợp phương thức của kiểu hoàn toàn chứa tập hợp phương thức của giao diện, thì có thể coi rằng kiểu đó triển khai giao diện đó.

Ví dụ, nếu một kiểu có `m` phương thức và một giao diện có `n` phương thức, thì ta có thể dễ dàng nhận thấy thời gian xác định này có độ phức tạp là `O(mn)`. Go sắp xếp các phương thức trong tập hợp phương thức theo thứ tự từ điển theo tên hàm, vì vậy thời gian thực tế là `O(m+n)`.

Ở đây, chúng ta sẽ khám phá nguyên lý đằng sau việc chuyển đổi một giao diện thành một giao diện khác, tất nhiên, lý do chuyển đổi được thực hiện là do hai kiểu tương thích.

Hãy xem một ví dụ trực tiếp:

```go
package main

import "fmt"

type coder interface {
	code()
	run()
}

type runner interface {
	run()
}

type Gopher struct {
	language string
}

func (g Gopher) code() {
	return
}

func (g Gopher) run() {
	return
}

func main() {
	var c coder = Gopher{}

	var r runner
	r = c
	fmt.Println(c, r)
}
```

Giải thích đơn giản cho đoạn mã trên: Chúng ta định nghĩa hai giao diện: `coder` và `runner`. Chúng ta định nghĩa một kiểu thực thể là `Gopher`, kiểu `Gopher` triển khai hai phương thức là `run()` và `code()`. Trong hàm `main`, chúng ta định nghĩa một biến giao diện `c`, gán cho nó một đối tượng `Gopher`, sau đó gán `c` cho một biến giao diện khác là `r`. Việc gán thành công là do `c` chứa phương thức `run()`. Như vậy, hai biến giao diện đã được chuyển đổi thành công.

Chạy lệnh:

```shell
go tool compile -S ./src/main.go
```

Chúng ta sẽ có được mã hợp ngữ của hàm `main`, có thể thấy dòng lệnh `r = c` thực tế là gọi hàm `runtime.convI2I(SB)`, cũng chính là hàm `convI2I`, để chuyển đổi một `interface` thành một `interface` khác, hãy xem mã nguồn của nó:

```go
func convI2I(inter *interfacetype, i iface) (r iface) {
	tab := i.tab
	if tab == nil {
		return
	}
	if tab.inter == inter {
		r.tab = tab
		r.data = i.data
		return
	}
	r.tab = getitab(inter, tab._type, false)
	r.data = i.data
	return
}
```

Mã nguồn đơn giản, tham số hàm `inter` đại diện cho kiểu giao diện, `i` đại diện cho giao diện được gắn với kiểu thực thể, `r` đại diện cho `iface` mới sau khi chuyển đổi. Dựa vào phân tích trước đó, chúng ta biết rằng `iface` bao gồm các trường `tab` và `data`. Vì vậy, thực tế hàm `convI2I` chỉ cần tìm `tab` và `data` mới cho giao diện.

Chúng ta cũng biết rằng `tab` được tạo thành từ kiểu giao diện `interfacetype` và kiểu thực thể `_type`. Vì vậy, câu lệnh quan trọng nhất là `r.tab = getitab(inter, tab._type, false)`.

Vì vậy, chúng ta hãy xem mã nguồn của hàm `getitab`, chỉ xem phần quan trọng:

```go
func getitab(inter *interfacetype, typ *_type, canfail bool) *itab {
	// ……

    // Tính toán giá trị hash dựa trên inter và typ
	h := itabhash(inter, typ)

	// Kiểm tra hai lần - một lần không khóa, một lần khóa.
	// Trường hợp thông thường sẽ không có xung đột khóa.
	var m *itab
	var locked int
	for locked = 0; locked < 2; locked++ {
		if locked != 0 {
			lock(&ifaceLock)
        }
        
        // Lặp qua một khe trong bảng hash
		for m = (*itab)(atomic.Loadp(unsafe.Pointer(&hash[h]))); m != nil; m = m.link {

            // Nếu tìm thấy itab trong bảng hash (inter và typ cùng trỏ đến)
			if m.inter == inter && m._type == typ {
                // ……
                
				if locked != 0 {
					unlock(&ifaceLock)
				}
				return m
			}
		}
	}

    // Nếu không tìm thấy itab trong bảng hash, tạo một itab mới
	m = (*itab)(persistentalloc(unsafe.Sizeof(itab{})+uintptr(len(inter.mhdr)-1)*sys.PtrSize, 0, &memstats.other_sys))
	m.inter = inter
    m._type = typ
    
    // Thêm vào bảng hash toàn cục
	additab(m, true, canfail)
	unlock(&ifaceLock)
	if m.bad {
		return nil
	}
	return m
}
```

Tóm tắt đơn giản: Hàm `getitab` sẽ tìm kiếm trong bảng hash itab toàn cục dựa trên `interfacetype` và `_type`. Nếu tìm thấy, nó sẽ trả về trực tiếp; nếu không, nó sẽ tạo một itab mới dựa trên `interfacetype` và `_type` đã cho và chèn vào bảng hash itab. Điều này cho phép lần sau có thể truy cập itab trực tiếp.

Hàm này tìm kiếm hai lần và khóa lần thứ hai, điều này là do nếu không tìm thấy trong lần đầu tiên và không tìm thấy itab tương ứng trong lần thứ hai, cần tạo một itab mới và ghi vào bảng hash, vì vậy cần khóa. Điều này đảm bảo rằng các goroutine khác cũng đang tìm kiếm cùng một itab và không tìm thấy trong lần thứ hai sẽ bị treo, sau đó sẽ tìm thấy itab được ghi vào bảng hash bởi goroutine đầu tiên.

Hãy xem mã nguồn của hàm `additab`:

```go
// Kiểm tra _type có đáp ứng interface_type và tạo cấu trúc itab tương ứng, sau đó đặt nó vào bảng hash
func additab(m *itab, locked, canfail bool) {
	inter := m.inter
	typ := m._type
	x := typ.uncommon()

	// Cả inter và typ đều có phương thức được sắp xếp theo tên,
	// và tên giao diện là duy nhất,
	// vì vậy có thể lặp qua cả hai cùng một lúc;
    // vòng lặp này có độ phức tạp O(ni+nt) chứ không phải O(ni*nt).
	ni := len(inter.mhdr)
	nt := int(x.mcount)
	xmhdr := (*[1 << 16]method)(add(unsafe.Pointer(x), uintptr(x.moff)))[:nt:nt]
	j := 0
	for k := 0; k < ni; k++ {
		i := &inter.mhdr[k]
		itype := inter.typ.typeOff(i.ityp)
		name := inter.typ.nameOff(i.name)
		iname := name.name()
		ipkg := name.pkgPath()
		if ipkg == "" {
			ipkg = inter.pkgpath.name()
		}
		for ; j < nt; j++ {
			t := &xmhdr[j]
            tname := typ.nameOff(t.name)
            // Kiểm tra tên phương thức có khớp không
			if typ.typeOff(t.mtyp) == itype && tname.name() == iname {
				pkgPath := tname.pkgPath()
				if pkgPath == "" {
					pkgPath = typ.nameOff(x.pkgpath).name()
				}
				if tname.isExported() || pkgPath == ipkg {
					if m != nil {
                        // Lấy địa chỉ hàm và thêm vào mảng fun của itab
						ifn := typ.textOff(t.ifn)
						*(*unsafe.Pointer)(add(unsafe.Pointer(&m.fun[0]), uintptr(k)*sys.PtrSize)) = ifn
					}
					goto nextimethod
				}
			}
		}
        // ……
        
		m.bad = true
		break
	nextimethod:
	}
	if !locked {
		throw("invalid itab locking")
    }

    // Tính toán giá trị hash
    h := itabhash(inter, typ)
    // Thêm vào danh sách liên kết hash
	m.link = hash[h]
	m.inhash = true
	atomicstorep(unsafe.Pointer(&hash[h]), unsafe.Pointer(m))
}
```

Hàm `additab` kiểm tra xem `interfacetype` và `_type` mà `itab` nắm giữ có khớp hay không, tức là kiểm tra xem `_type` đã triển khai đầy đủ các phương thức của `interfacetype`, tức là kiểm tra phần trùng lắp trong danh sách phương thức của `interfacetype`. Lưu ý rằng có một vòng lặp lồng nhau trong đó, ban đầu có vẻ số lần lặp là `ni * nt`, nhưng do danh sách phương thức của cả `inter` và `typ` đã được sắp xếp theo tên phương thức, nên thực tế chỉ có `ni + nt` lần lặp được thực hiện. Điều này được thực hiện bằng cách sử dụng một kỹ thuật nhỏ: vòng lặp thứ hai không bắt đầu từ 0, mà bắt đầu từ vị trí đã duyệt qua trong lần lặp trước đó.

Hàm tính giá trị hash khá đơn giản:

```golang
func itabhash(inter *interfacetype, typ *_type) uint32 {
	h := inter.typ.hash
	h += 17 * typ.hash
	return h % hashSize
}
```

Giá trị `hashSize` là 1009.

Nói chung, khi gán một kiểu thực thể cho một giao diện, các hàm `conv` sẽ được gọi, ví dụ như gán cho giao diện trống sẽ gọi các hàm `convT2E`, gán cho giao diện không trống sẽ gọi các hàm `convT2I`. Những hàm này khá tương tự:

> 1. Khi chuyển đổi từ kiểu cụ thể sang giao diện trống, trường `_type` được sao chép trực tiếp từ kiểu nguồn; gọi `mallocgc` để cấp phát một khối bộ nhớ mới, sau đó sao chép giá trị vào đó và trỏ `data` đến khối bộ nhớ mới này.
> 2. Khi chuyển đổi từ kiểu cụ thể sang giao diện không trống, tham số `tab` được tạo sẵn bởi trình biên dịch trong quá trình biên dịch, trường `tab` của giao diện mới trỏ trực tiếp đến `itab` của tham số đầu vào; gọi `mallocgc` để cấp phát một khối bộ nhớ mới, sau đó sao chép giá trị vào đó và trỏ `data` đến khối bộ nhớ mới này.
> 3. Đối với chuyển đổi từ giao diện sang giao diện, `itab` được lấy bằng cách gọi hàm `getitab`. Chỉ cần tạo một lần và sau đó lấy trực tiếp từ bảng hash.
