---
title: Go Map Delete
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-21
date modified: 2023-09-21
---

Hàm thực hiện thao tác ghi (write) ở cấp độ thấp nhất là `mapdelete`:

```go
func mapdelete(t *maptype, h *hmap, key unsafe.Pointer) 
```

Tùy thuộc vào loại key khác nhau, thao tác xóa sẽ được tối ưu thành các hàm cụ thể hơn:

|Loại key|Xóa|
|---|---|
|uint32|`mapdelete_fast32(t *maptype, h *hmap, key uint32)`|
|uint64|`mapdelete_fast64(t *maptype, h *hmap, key uint64)`|
|string|`mapdelete_faststr(t *maptype, h *hmap, ky string)`|

Tất nhiên, chúng ta chỉ quan tâm đến hàm `mapdelete`. Đầu tiên, nó sẽ kiểm tra cờ flags của hmap. Nếu cờ ghi được đặt thành 1, nó sẽ gây ra panic trực tiếp, vì điều này cho thấy có một goroutine khác đang thực hiện hoạt động ghi đồng thời.

Tính toán giá trị hash của key và tìm bucket tương ứng. Kiểm tra xem map có đang trong quá trình mở rộng hay không, nếu có, thực hiện một lần di chuyển.

Thao tác xóa cũng là một vòng lặp hai lớp, trung tâm vẫn là tìm vị trí chính xác của key. Quá trình tìm kiếm tương tự nhau, duyệt qua từng cell trong bucket.

Sau khi tìm thấy vị trí tương ứng, thực hiện thao tác "xóa" trên key hoặc value:

```go
// Xóa key
if t.indirectkey {
	*(*unsafe.Pointer)(k) = nil
} else {
	typedmemclr(t.key, k)
}

// Xóa value
if t.indirectvalue {
	*(*unsafe.Pointer)(v) = nil
} else {
	typedmemclr(t.elem, v)
}
```

Cuối cùng, giảm giá trị count đi 1, đặt giá trị tophash tương ứng của vị trí đó thành `Empty`.

Mã nguồn này cũng khá đơn giản, bạn có thể xem mã nguồn để hiểu rõ hơn.
