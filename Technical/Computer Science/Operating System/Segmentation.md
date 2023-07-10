---
categories: [os, computer-science]
title: Segmentation
date created: 2023-05-31
date modified: 2023-07-10
tags: [os, computer-science]
---

## Motivation

- Một số sự thiếu hiệu quả phát sinh trong quá trình **address translation**.

![Pasted image 20230601224159](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601224159.png)

- Trong không gian địa chỉ ảo hiện có, không gian chưa sử dụng Heap và Stack cũng được cấp phát, dẫn đến không hiệu quả.
	1. Không gian bộ nhớ bị lãng phí do kích thước không sử dụng xảy ra.
	2. Như thể hiện trong hình trên, một tiến trình không thể được hỗ trợ trong không gian địa chỉ có bộ nhớ lớn (hơn 16 KB).  
	3. Nhiều mã có thể nhập vào không gian mã và gây ra sự trùng lặp.

- Để giải quyết vấn đề này, ý tưởng về `Segmention` đã ra đời.

## Segmentation

- Phân đoạn (Segmentation) là phương pháp ánh xạ độc lập không gian địa chỉ ảo vào không gian địa chỉ bộ nhớ vật lý theo đơn vị **phân đoạn (segment)**.

![Pasted image 20230601232457](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601232457.png)

- Điều này giải quyết vấn đề không sử dụng hiệu quả giữa heap và stack.
	1. Không còn lãng phí dung lượng bộ nhớ.
	2. Nó có thể hỗ trợ nhiều không gian địa chỉ hơn trước đây.
	3. Các phân đoạn có thể tiết kiệm bộ nhớ trong khi chia sẻ mã giữa các không gian địa chỉ.
- Một phân đoạn (segment) đề cập đến một phần nhất định của bộ nhớ và một không gian địa chỉ chung bao gồm **3 phân đoạn con (Code, Stack, Heap)**.
- Hệ điều hành đặt ba phân đoạn trong bộ nhớ sao cho không gian giữa heap và stack không bị lãng phí.

## Implementation

### Basic

- Bây giờ, hãy xem cách **từ Virtual memory address và tìm physical memory address** trong Segment.
- Địa chỉ ảo có thể được lấy bằng `segment id + offset`.
	- `segment id` có thể được biệt bằng 2 bit trên và `offset` có thể được tính bằng 12 bit dưới của virtual adress.

![Pasted image 20230601225657](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601225657.png)

- Hãy lấy bức ảnh trên làm ví dụ.
- 1. Chuyển đến segment Heap có Segment ID `01` và tìm giá trị **base**. (Base = 26K)
- 2.1. Tính **Offset**. (Hex -> Dec)  
	- 0x068 -> (Dec) (16^1 * 6) + (16^0 * 8) = 104  
- 2.2. Kiểm tra xem có xảy ra lỗi phân đoạn không (segment fault)
	- segment fault: Xảy ra khi chương trình cố gắng truy cập vùng bộ nhớ không được phép (free space) hoặc cố gắng truy cập vùng nhớ theo cách bất hợp pháp
	- Do giá trị **Offset** là 104 nhỏ hơn giá trị Bound 2K (104 < 2000), segmentation fault không xảy ra.  
- 3. Tìm địa chỉ Physical memory. (**base + offset**)
	- Chỉ cần có giá trị **base** và giá trị **offset** và Heap Segment có Segment ID là 01.
	- Vì vậy, địa chỉ bộ nhớ vật lý là **26KB + 104**.

Về mặt mã, các tính toán này có thể được biểu thị như sau:

```
// get top 2 bits of 14-bit VA 2 (2 bit cao của VirtualAddress)
Segment = (VirtualAddress & SEG_MASK) >> SEG_SHIFT 3

// now get offset (12 bit thấp của VA là offset)
Offset = VirtualAddress & OFFSET_MASK

// Kiểm tra Offset vượt quá limit hay không.
if (Offset >= Bounds[Segment])
    RaiseException(PROTECTION_FAULT)
else
    PhysAddr = Base[Segment] + Offset
    Register = AccessMemory(PhysAddr)
```

### Stack

![Pasted image 20230602072656](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230602072656.png)

- Không giống như phần `Code` và `Heap`, `Stack` mở rộng về phía sau nên việc chuyển đổi địa chỉ phải khác.
	- `Code` và `Heap` mang `Sign` `Positive`, trong khi Stack mang dấu `Negative`.  
- Base Register của Stack Segment bắt đầu ở địa chỉ cao nhất.
- 1. Chuyển đến khu vực Ngăn xếp có Segemnt ID 10 và tìm giá trị Base. (Base= 36K)
- 2 - 1. Tính **Offset**. (Hex -> Dec)
	- 0xA00 -> (Dec) (16^2 * 10) + (16^1 * 0) + (16^0 * 0) = 2560  
- 2-2. Kiểm tra xem có xảy ra lỗi phân đoạn không.
	- Do giá trị Offset 104 nhỏ hơn giá trị Giới hạn 3K (2560 < 3000), lỗi phân đoạn không xảy ra.  
- 3. Tìm địa chỉ bộ nhớ vật lý. (base - offset)
	- Trong Stack, thay vì thêm 2560 vào Base 36KB, hãy trừ nó đi.
	- Vì vậy, địa chỉ bộ nhớ vậy lý là **36KB - 2560**.

### Code Sharing

![Pasted image 20230602073359](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230602073359.png)

- Các segment có thể được chia sẻ giữa các không gian địa chỉ với sự hỗ trợ phần cứng bổ sung.
- Vì vậy, nhiều tiến trình có thể chia sẻ **code segment**, **code segment** này **có thể được đọc và thực thi nhưng không thể thay đổi giá trị**.
- Nghĩa là, **code segment** được chỉ định có thể được truy cập (read & excute), nhưng không thể thay đổi giá trị.

## Problem of Segmentation(OS Support)

- OS xử lý vấn đề Context-Switch như thế nào?
	- Giá trị của các segment register (base & bound register) được lưu và khôi phục.  
- Làm thế nào để nó tương tác với OS khi số lượng phân đoạn tăng hoặc giảm?
	- Tình huống: Khi không gian Heap không đủ và không gian Heap cần được tăng bởi `malloc()`
	- Giải pháp: Sử dụng system call `sbrk()` để tăng dung lượng. (`sbrk()` là hàm tăng hoặc giảm Heap)
- Làm cách nào để quản lý dung lượng trống trong bộ nhớ vật lý?
	- Vì mỗi tiến trình trình có kích thước khác nhau nên mỗi segment cũng có kích thước khác nhau. Điều này gây ra vấn đề phân mảnh bên ngoài (**external fragmentaion**).  

![Pasted image 20230602134342](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230602134342.png)

- Tình huống: Đang cố cấp phát một segment có kích thước 20KB trong bộ nhớ bên trái.
- Tuy nhiên, mặc dù có toàn bộ dung lượng trống 24 KB, nhưng không thể phân bổ dung lượng có kích thước 20 KB cho các segment không liền kề 16 KB, 4 KB và 4 KB.
- Để giải quyết vấn đề này, HĐH sắp xếp lại các segment hiện có trong bộ nhớ vật lý bằng phương pháp có tên là `Compaction` như trong hình ở giữa. Tuy nhiên, phương pháp `Compaction` có một vấn đề là hiệu suất thấp do chi phí.
- Vì vậy, như thể hiện trong hình bên phải, không gian trống có thể được quản lý bằng cách loại bỏ phân mảnh bên ngoài (external fragment) thành các segment có kích thước cố định thông qua một kỹ thuật gọi là **[[Paging]]** (Phân trang).
- Tuy nhiên, **[[Paging]]** cũng có vấn đề về sự phân mảnh bên trong (internal fragmentation).
- Vấn đề với internal fragmentation là như sau: Khi có yêu cầu 15KB, 16KB được cung cấp dưới dạng 8KB * 2 lần và 1KB dung lượng không sử dụng được tạo. Tại thời điểm này, 1KB này là vấn đề phân mảnh bên trong.

**## Review**

- Segment làm tăng hiệu quả của không gian bộ nhớ bằng cách tách thành từng Segment (Stack, Heap, Code) để giải quyết không gian chưa sử dụng giữa Stack và Heap.
- Tuy nhiên, có một vấn đề về phân mảnh bên ngoài và kỹ thuật phân trang đã được sử dụng để giải quyết vấn đề này.
