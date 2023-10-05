---
title: Go Reflect Compare
tags:
  - golang
  - interview
categories:
  - golang
  - interview
date created: 2023-10-05
date modified: 2023-10-05
---

Trong ngôn ngữ Go, có một hàm có thể thực hiện chức năng này:

```go
func DeepEqual(x, y interface{}) bool
```

Tham số của hàm `DeepEqual` là hai `interface`, tức là có thể nhập bất kỳ loại dữ liệu nào và trả về true hoặc false để chỉ ra hai biến đầu vào có "cùng độ sâu" hay không.

Đầu tiên, hãy hiểu rằng nếu hai biến có các loại khác nhau, ngay cả khi các loại cơ bản giống nhau và giá trị tương ứng cũng giống nhau, thì hai biến đó cũng không "cùng độ sâu".

Trong mã nguồn, có chú thích rất rõ ràng về hàm DeepEqual, liệt kê các trường hợp so sánh khác nhau của DeepEqual, đây là một tóm tắt:

|Loại dữ liệu|Trường hợp cùng độ sâu|
|---|---|
|Mảng| Các phần tử tại cùng chỉ mục "cùng độ sâu" |
|Struct| Các trường tương ứng, bao gồm cả trường công khai và trường không công khai, "cùng độ sâu" |
|Func| Chỉ khi cả hai đều là nil |
|Interface| Các giá trị cụ thể được lưu trữ "cùng độ sâu" |
|Bản đồ (Map)|1. Cả hai đều là nil; 2. Không rỗng, có cùng độ dài, trỏ đến cùng một đối tượng bản đồ hoặc các khóa tương ứng trỏ đến các giá trị "cùng độ sâu" |
|Con trỏ (Pointer)|1. Kết quả so sánh bằng == là true; 2. Đối tượng được trỏ đến "cùng độ sâu" |
|Slice|1. Cả hai đều là nil; 2. Không rỗng, có cùng độ dài, phần tử đầu tiên trỏ đến cùng một mảng cơ sở, tức là &x[0] == &y[0], hoặc các phần tử tương ứng "cùng độ sâu" |
|Số, bool, chuỗi và kênh| Kết quả so sánh bằng == là true |

Thường thì, việc triển khai DeepEqual chỉ cần đệ quy gọi == để so sánh hai biến xem chúng có thực sự "cùng độ sâu" hay không.

Tuy nhiên, có một số trường hợp ngoại lệ: ví dụ như loại dữ liệu func không thể so sánh, chỉ khi cả hai loại func đều là nil, mới được coi là "cùng độ sâu"; loại dữ liệu float cũng không thể so sánh bằng == do độ chính xác, và các struct, interface, mảng chứa func hoặc float.

Đối với con trỏ, khi hai con trỏ có giá trị bằng nhau, chúng được coi là "cùng độ sâu" vì nội dung mà chúng trỏ đến là giống nhau, ngay cả khi nội dung mà chúng trỏ đến là func hoặc float.

Tương tự, hai biến trỏ đến cùng một slice hoặc map cũng được coi là "cùng độ sâu", không quan tâm đến nội dung cụ thể của slice hoặc map.

Đối với các loại dữ liệu "có chuỗi", chẳng hạn như danh sách liên kết vòng, trong quá trình so sánh xem hai biến có "cùng độ sâu" hay không, cần đánh dấu nội dung đã so sánh trước đó, ngay lập tức dừng so sánh và xác định hai biến là "cùng độ sâu" nếu đã so sánh hai con trỏ trước đó. Điều này được thực hiện để ngừng so sánh kết quả và tránh rơi vào vòng lặp vô hạn.

Hãy xem mã nguồn:

```go
func DeepEqual(x, y interface{}) bool {
	if x == nil || y == nil {
		return x == y
	}
	v1 := ValueOf(x)
	v2 := ValueOf(y)
	if v1.Type() != v2.Type() {
		return false
	}
	return deepValueEqual(v1, v2, make(map[visit]bool), 0)
}
```

Trước tiên, kiểm tra xem có một trong hai biến là nil hay không, trong trường hợp này, chỉ khi cả hai đều là nil, hàm mới trả về true.

Tiếp theo, sử dụng reflection để lấy đối tượng reflection của x và y, và ngay lập tức so sánh loại của chúng, theo như đã tóm tắt ở trên, đây thực sự là loại động, nếu loại khác nhau, hàm sẽ trả về false.

Cuối cùng, nội dung quan trọng nhất nằm trong hàm con `deepValueEqual`.

Mã khá dài, nhưng ý tưởng khá đơn giản và rõ ràng: trung tâm là một câu lệnh switch, nhận diện các loại đầu vào khác nhau, đệ quy gọi hàm deepValueEqual tới khi đạt đến các loại dữ liệu cơ bản như int, string để so sánh trực tiếp và trả về true hoặc false từng bước, cuối cùng nhận được kết quả so sánh "cùng độ sâu".

Thực tế, các loại so sánh khác nhau khá tương đồng, ở đây chỉ trích một ví dụ phức tạp hơn một chút về so sánh của loại dữ liệu map:

```go
// Hàm deepValueEqual
// ...

case Map:
	if v1.IsNil() != v2.IsNil() {
		return false
	}
	if v1.Len() != v2.Len() {
		return false
	}
	if v1.Pointer() == v2.Pointer() {
		return true
	}
	for _, k := range v1.MapKeys() {
		val1 := v1.MapIndex(k)
		val2 := v2.MapIndex(k)
		if !val1.IsValid() || !val2.IsValid() || !deepValueEqual(v1.MapIndex(k), v2.MapIndex(k), visited, depth+1) {
			return false
		}
	}
	return true
	
// ...
```

Ý tưởng so sánh map tương tự như đã tóm tắt ở trên, không cần nói thêm gì. Lưu ý rằng `visited` là một map, ghi lại các cặp so sánh đã thực hiện trong quá trình đệ quy:

```go
type visit struct {
	a1  unsafe.Pointer
	a2  unsafe.Pointer
	typ Type
}

map[visit]bool
```

Trong quá trình so sánh, ngay khi phát hiện cặp so sánh đã xuất hiện trong map, hàm sẽ ngay lập tức xác định kết quả so sánh "cùng độ sâu" là true.
