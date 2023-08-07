---
title: JS ArrayBuffer
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-07
date modified: 2023-08-07
---

# ArrayBuffer

Đối tượng ArrayBuffer được sử dụng để đại diện cho một bộ đệm dữ liệu nhị phân nguyên thủy có độ dài cố định.

ArrayBuffer không thể được truy cập trực tiếp, mà phải thông qua các đối tượng **TypedArray** hoặc **DataView** để thao tác với dữ liệu trong bộ đệm. Các đối tượng này sẽ đại diện cho dữ liệu trong bộ đệm dưới dạng các định dạng cụ thể và cho phép đọc và ghi nội dung của bộ đệm.

- Đọc:
  - Chuyển đổi tệp thành dữ liệu ArrayBuffer bằng FileReader
- Ghi:
  - Thao tác thông qua đối tượng TypedArray
  - Thao tác thông qua đối tượng DataView

Mảng trong JavaScript, vì có nhiều chức năng và không giới hạn kiểu dữ liệu, hoặc nó cũng có thể là một mảng thưa thớt. Tuy nhiên, nếu bạn đọc một chuỗi dữ liệu nhị phân từ XHR, FileAPI, Canvas, v.v., nếu sử dụng mảng JavaScript để lưu trữ, nó không chỉ lãng phí không gian mà còn không hiệu quả. Vì vậy, để tương thích với các API mới này và nâng cao khả năng xử lý nhị phân của JavaScript, ArrayBuffer đã được tạo ra.

ArrayBuffer và Array có sự khác biệt lớn:

- ArrayBuffer có kích thước cố định sau khi khởi tạo, trong khi mảng có thể tăng hoặc giảm kích thước tự do.
- Mảng được lưu trữ trong heap, trong khi ArrayBuffer lưu trữ dữ liệu trong stack.
- ArrayBuffer không có các phương thức như `push` và `pop` của mảng.
- ArrayBuffer chỉ có thể đọc, không thể ghi trực tiếp, việc ghi phải thông qua TypedArray hoặc DataView.

Một cách đơn giản, ArrayBuffer là một vùng nhớ, nhưng bạn không thể (hoặc không thuận tiện) truy cập trực tiếp các byte trong nó. Để truy cập ArrayBuffer, bạn cần sử dụng một tham chiếu kiểu TypedArray. (Có thể hiểu ArrayBuffer như một mảng nhanh có kiểu hoặc một mảng có kiểu)

Các trường hợp sử dụng:

- Đọc và hiển thị hình ảnh được tải lên
- Chuyển đổi và tải xuống hình ảnh từ Canvas
- WebGL

## Cú pháp

```js
new ArrayBuffer(length);
```

| Tham số   | Kiểu dữ liệu | Mô tả                                      |
| :-------- | :---------- | :---------------------------------------- |
| `length`  | `Number`    | Kích thước của ArrayBuffer, tính bằng byte. |

Một đối tượng ArrayBuffer với kích thước xác định, nội dung được khởi tạo thành 0.

## Mô tả

Hàm tạo ArrayBuffer được sử dụng để tạo một đối tượng ArrayBuffer với độ dài được chỉ định trong byte.

**Lấy ArrayBuffer từ dữ liệu hiện có**

- [Từ chuỗi Base64](https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#Appendix.3A_Decode_a_Base64_string_to_Uint8Array_or_ArrayBuffer)
- [Từ tệp cục bộ](<https://developer.mozilla.org/en-US/docs/Web/API/FileReader#readAsArrayBuffer()>)

## Thuộc tính và phương thức tĩnh

### Thuộc tính

| Thuộc tính                       | Mô tả                                                                 |
| -------------------------------- | -------------------------------------------------------------------- |
| `ArrayBuffer.length`             | Thuộc tính `length` của hàm tạo ArrayBuffer, có giá trị là 1.          |
| `get ArrayBuffer[@@species]`    | Trả về hàm tạo ArrayBuffer.                                          |
| `ArrayBuffer.prototype`          | Đối tượng nguyên mẫu của ArrayBuffer, cho phép thêm thuộc tính cho nó. |

### Phương thức

| Phương thức                                         | Mô tả                                                                                                                  |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `ArrayBuffer.isView(arg)`                           | Trả về `true` nếu đối số là một phiên bản xem ArrayBuffer, ví dụ như một đối tượng mảng kiểu hoặc đối tượng `DataView`; ngược lại trả về `false`. |
| `ArrayBuffer.transfer(oldBuffer [, newByteLength]);` | Trả về một đối tượng ArrayBuffer mới, nội dung được lấy từ dữ liệu trong `oldBuffer` và cắt hoặc bổ sung 0 dựa trên `newByteLength`. |
| `ArrayBuffer.slice()`                               | Tương tự như `ArrayBuffer.prototype.slice()`.                                                                         |

## Thuộc tính và phương thức của ArrayBuffer

### Thuộc tính

| Thuộc tính                         | Mô tả                                                                                     |
| ---------------------------------- | ---------------------------------------------------------------------------------------- |
| `ArrayBuffer.prototype.constructor` | Chỉ định hàm tạo ra một nguyên mẫu đối tượng. Giá trị ban đầu là hàm tạo sẵn có của ArrayBuffer. |
| `ArrayBuffer.prototype.byteLength`  | Kích thước của mảng tính bằng byte. Được xác định khi mảng được tạo và không thể thay đổi. **Chỉ đọc**.       |

### Phương thức

| Phương thức                       | Mô tả                                                                                                                                                                                                 |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ArrayBuffer.prototype.slice()` | Trả về một `ArrayBuffer` mới, chứa một bản sao byte của `ArrayBuffer` ban đầu, từ vị trí `begin` (bao gồm) đến vị trí `end` (không bao gồm). Nếu `begin` hoặc `end` là số âm, nó sẽ đại diện cho vị trí từ cuối mảng, chứ không phải từ đầu mảng. |

## Ví dụ

### Ví dụ mã

Dưới đây là một ví dụ tạo một bộ nhớ đệm 8 byte và sử dụng một `Int32Array` để tham chiếu đến nó:

```js
const buffer = new ArrayBuffer(8);
const view = new Int32Array(buffer);
```

### Tạo các view

ArrayBuffer được sử dụng để lưu trữ nhiều loại dữ liệu khác nhau. Mỗi loại dữ liệu có cách lưu trữ riêng, được gọi là **view**.

Hiện tại, JavaScript cung cấp các loại view sau:

- Int8Array: Số nguyên có dấu 8 bit, chiều dài 1 byte.
- Uint8Array: Số nguyên không dấu 8 bit, chiều dài 1 byte.
- Int16Array: Số nguyên có dấu 16 bit, chiều dài 2 byte.
- Uint16Array: Số nguyên không dấu 16 bit, chiều dài 2 byte.
- Int32Array: Số nguyên có dấu 32 bit, chiều dài 4 byte.
- Uint32Array: Số nguyên không dấu 32 bit, chiều dài 4 byte.
- Float32Array: Số thực 32 bit, chiều dài 4 byte.
- Float64Array: Số thực 64 bit, chiều dài 8 byte.

Mỗi loại view đều có một hằng số BYTES_PER_ELEMENT, biểu thị số byte mà kiểu dữ liệu này chiếm.

```js
Int8Array.BYTES_PER_ELEMENT;
// 1
Uint8Array.BYTES_PER_ELEMENT;
// 1
//...
```

Mỗi loại view đều là một hàm tạo, có nhiều phương thức để tạo ra chúng.

```js
// Kết quả trên trình duyệt:
> Int32Array
> function Int32Array() { [native code] }
```

### Thực hiện ghi vào ArrayBuffer bằng TypeArray

```js
const typedArray1 = new Int8Array(8);
typeArray1[0] = 32;

const typedArray2 = new Int8Array(typedArray1);
typedArray2[1] = 42;

console.log(typedArray1);
// Int8Array [32, 0, 0, 0, 0, 0, 0, 0]

console.log(typedArray2);
// Int8Array [32, 42, 0, 0, 0, 0, 0, 0]
```

### Thực hiện ghi vào ArrayBuffer bằng DataView

```js
const buffer = new ArrayBuffer(16);
const viwe = new DataView(buffer);

view.setInt8(2, 42);
console.log(view.getInt8(2));
// 42
```

