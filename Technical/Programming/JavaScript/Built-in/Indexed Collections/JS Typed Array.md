---
title: JS Typed Array
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# Typed Array

Typed Array trong JavaScript là một đối tượng giống mảng và cung cấp cơ chế để truy cập vào dữ liệu nhị phân gốc. Như bạn có thể đã biết, mảng trong JavaScript có thể tăng và giảm kích thước một cách linh hoạt và có thể lưu trữ bất kỳ giá trị JavaScript nào. Trình duyệt JavaScript thực hiện một số tối ưu hóa nội bộ để các thao tác trên mảng có thể diễn ra nhanh chóng. Tuy nhiên, khi các ứng dụng web trở nên mạnh mẽ hơn, đặc biệt là một số tính năng mới như chỉnh sửa âm thanh, video, truy cập dữ liệu nguyên thủy của WebSockets, rõ ràng là việc sử dụng Typed Array để nhanh chóng và dễ dàng thao tác với dữ liệu nhị phân gốc sẽ rất hữu ích.

Tuy nhiên, không nên nhầm lẫn Typed Array với mảng thông thường, vì gọi `Array.isArray()` trên Typed Array sẽ trả về `false`. Hơn nữa, không phải tất cả các phương thức có sẵn cho mảng thông thường cũng được hỗ trợ bởi Typed Array (như `push` và `pop`).

Typed Array có thể được sử dụng để xử lý dữ liệu nhị phân từ các gốc như giao thức mạng, định dạng tệp nhị phân và bộ đệm đồ họa gốc. Typed Array cũng có thể được sử dụng để quản lý dữ liệu nhị phân trong bộ nhớ với bố cục byte đã biết.

## Buffer và view: Kiến trúc Typed Array

Để đạt được sự linh hoạt và hiệu suất tối đa, Typed Array của JavaScript (Typed Arrays) chia thành hai phần: buffer (bộ nhớ đệm) và view (chế độ xem). Một bộ nhớ đệm (được triển khai bởi đối tượng `ArrayBuffer`) mô tả một khối dữ liệu. Bộ nhớ đệm không có định dạng cụ thể và không cung cấp cơ chế để truy cập nội dung của nó. Để truy cập vào bộ nhớ chứa trong đối tượng bộ nhớ đệm, bạn cần sử dụng view. View cung cấp ngữ cảnh - tức là kiểu dữ liệu, vị trí bắt đầu và số phần tử - để chuyển đổi dữ liệu thành Typed Array thực sự.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230807223138.png)

### ArrayBuffer

`ArrayBuffer` là một loại dữ liệu được sử dụng để đại diện cho một bộ đệm dữ liệu nhị phân chung và có độ dài cố định. Bạn không thể trực tiếp thao tác nội dung của một `ArrayBuffer`; bạn cần tạo một view của Typed Array hoặc một `DataView` mô tả định dạng dữ liệu bộ đệm, và sử dụng chúng để đọc và ghi nội dung của bộ đệm.

### View

view Typed Array là một view của đối tượng `ArrayBuffer`, cho phép truy cập và thao tác với dữ liệu trong bộ đệm. Tất cả các loại mảng đều có độ dài cố định.

| Kiểu                | Kích thước (theo byte) | Mô tả                      | Kiểu Web IDL        | Tương đương C type |
| ------------------- | ---------------------- | ------------------------- | ------------------- | ----------------- |
| `Int8Array`         | 1                      | Số nguyên có dấu 8 bit    | byte                | int8_t            |
| `Uint8Array`        | 1                      | Số nguyên không dấu 8 bit | octet               | uint8_t           |
| `Uint8ClampedArray` | 1                      | Số nguyên không dấu 8 bit (Clamped) | octet               | uint8_t           |
| `Int16Array`        | 2                      | Số nguyên có dấu 16 bit   | short               | int16_t           |
| `Uint16Array`       | 2                      | Số nguyên không dấu 16 bit | unsigned short      | uint16_t          |
| `Int32Array`        | 4                      | Số nguyên có dấu 32 bit   | long                | int32_t           |
| `Uint32Array`       | 4                      | Số nguyên không dấu 32 bit | unsigned short      | uint32_t          |
| `Float32Array`      | 4                      | Số thực 32 bit theo tiêu chuẩn IEEE | unrestricted float  | float             |
| `Float64Array`      | 8                      | Số thực 64 bit theo tiêu chuẩn IEEE | unrestricted double | double            |

### DataView

`DataView` là một giao diện cấp thấp cung cấp các giao diện đọc và ghi dữ liệu tùy ý trong bộ đệm. Điều này hữu ích khi làm việc với các loại dữ liệu khác nhau, chẳng hạn như xem Typed Array chạy trong chế độ thứ tự byte cục bộ (xem [Endianness](https://developer.mozilla.org/en-US/docs/Glossary/Endianness)), có thể điều chỉnh thứ tự byte bằng cách sử dụng `DataView`. Mặc định là thứ tự byte lớn (Big-Endian), nhưng bạn có thể gọi các giao diện đọc và ghi để chuyển sang thứ tự byte nhỏ (Little-Endian).

## Ví dụ

### Sử dụng view và bộ đệm

Trước tiên, chúng ta tạo một bộ đệm có độ dài cố định là 16 byte:

```js
var buffer = new ArrayBuffer(16);
```

Bây giờ chúng ta có một khối nhớ được khởi tạo với giá trị 0, hiện tại chưa thể làm nhiều thao tác. Hãy xác nhận độ dài byte của dữ liệu:

```js
if (buffer.byteLength === 16) {
  console.log("Yes, it's 16 bytes.");
} else {
  console.log("Oh no, it's the wrong size!");
}
```

Trước khi bắt đầu thao tác với bộ đệm này, chúng ta cần tạo một view. Chúng ta sẽ tạo một view định dạng dữ liệu trong bộ đệm thành một mảng số nguyên có dấu 32 bit:

```js
var int32View = new Int32Array(buffer);
```

Bây giờ chúng ta có thể truy cập các phần tử trong mảng như một mảng thông thường:

```js
for (var i = 0; i < int32View.length; i++) {
  int32View[i] = i * 2;
}
```

Mã này sẽ điền mảng với các giá trị 0, 2, 4 và 6 (tổng cộng 4 phần tử 4 byte, vì vậy tổng độ dài là 16 byte).

### Nhiều view của cùng một dữ liệu

Thú vị hơn, bạn có thể tạo nhiều xem trên cùng một dữ liệu. Ví dụ: dựa trên mã trên, chúng ta có thể thêm mã sau:

```js
var int16View = new Int16Array(buffer);

for (var i = 0; i < int16View.length; i++) {
  console.log('Entry ' + i + ': ' + int16View[i]);
}
```

Ở đây, chúng ta tạo một xem số nguyên 2 byte, chia sẻ bộ đệm 4 byte của xem số nguyên 32 bit ở trên, sau đó in ra dữ liệu trong bộ đệm dưới dạng số nguyên 2 byte, chúng ta sẽ nhận được đầu ra là 0, 0, 2, 0, 4, 0, 6, 0.

Vậy nếu chúng ta làm như sau?

```js
int16View[0] = 32;
console.log('Entry 0 in the 32-bit array is now ' + int32View[0]);
```

Kết quả sẽ là "Entry 0 in the 32-bit array is now 32". Đó là, hai mảng này đều là các xem của cùng một dữ liệu được hiển thị theo các định dạng khác nhau. Bạn có thể sử dụng bất kỳ loại xem nào được định nghĩa trong các view.
