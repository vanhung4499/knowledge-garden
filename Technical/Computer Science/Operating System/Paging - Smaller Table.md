---
categories: [os, computer-science]
title: Paging - Smaller Table
date created: 2023-05-31
date modified: 2023-07-10
tags: [os, computer-science]
---

## Motivation

- Xử lý tiến trình yêu cầu nhiều page hơn những gì TLB có thể quản lý
- Hãy xem cách giảm dung lượng bộ nhớ được sử dụng cho các Page Table.

## Paging: Linear Tables

- `Linear (Page) Tables` (Page table tuyến tính): Nói chung, có một Page table cho mọi tiến trình trong hệ thống.
- Ví dụ: `không gian địa chỉ ảo (address space)` 32 bit với page 4KB (2^12) và `Page table entry` 4 byte.

![Pasted image 20230603010132](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230603010132.png)

- **Page Table size = (address space size / page size) x Page table entry size**.
	- `address space size`: 32-bit = 2^32
	- `page size`: 4KB = 2^12
	- `Page table entry size`: 4B = 4byte = 2^2
- Tính toán -> Page Table size = (2^32 / 2^12) x 2^2 = 2^20 x 2^2 = 1MByte x 4Byte = 4MByte (mỗi tiến trình)
- Điều này có nghĩa là cần có tổng cộng 4MByte Page Table cho một tiến trình.
- Tóm lại, Page Table quá lớn và đang sử dụng quá nhiều bộ nhớ.

## 1. Large Page: Smaller Table

- Hãy xem cách tiết kiệm bộ nhớ bằng cách giảm kích thước của Page table trong trường hợp Page table quá lớn.
- Một cách để giảm kích thước của Page table là tăng kích thước của page để giảm kích thước Page table.
- Ví dụ: Không gian địa chỉ ảo 32 bit với page 16KB và Page table entry là 4 byte.  

(Trước đó, page size là 4KB và page size hiện tại là 16KB)

![Pasted image 20230603010923](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230603010923.png)

- Qua ví dụ trên, với `Page table size` = 1MByte, có thể thấy bộ nhớ tiết kiệm được do kích thước page table nhỏ hơn so với ví dụ trước.
- Tuy nhiên, có một vấn đề là **internal fragmentation** xảy ra do chính trang đó không được sử dụng đúng mức (do page size lớn). (Đó là rất nhiều không lãng phí)
	- **Internal fragmentation** đề cập đến không gian còn lại của một tiến trình bởi vì khi cấp phát bộ nhớ, nó sẽ cấp phát nhiều bộ nhớ hơn nhu cầu của tiến trình. (Ví dụ) Khi 10 KB bộ nhớ được phân bổ và dung lượng mà tiến trình yêu cầu là 7 KB, 3 KB còn lại bị lãng phí)  
- Kích thước trang lớn hơn có nghĩa là ít trang hơn, điều đó có nghĩa là bộ nhớ sẽ hết nhanh chóng.
- Tóm lại, tăng kích thước của trang không phải là một giải pháp hoàn chỉnh.

### Problem

- Ví dụ: Page có kích thước 1KB và không gian địa chỉ ảo có kích thước 16KB.

![Pasted image 20230603011525](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230603011525.png)

- Bạn có thể thấy rằng có 4 Page Table được sử dụng, 1 cho Code, 1 cho Heap và 2 cho Stack.

![Pasted image 20230603011719](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230603011719.png)

- TRong ví dụ trên là trừ 4 page table tất cả các page table khác đều không được sử dụng (un-used). (Màu tối: vùng chưa sử dụng)

## 2. Hybrid Approach: Paging and Segments

- Trong tình huống này, một cách khác để giảm kích thước của Page Table là sử dụng nó cùng với kỹ thuật **Paging** và **Segmentation**.
- Để giảm chi phí bộ nhớ của các page table  
	`base register` được sử dụng để trỏ đến page table của địa chỉ thực.  
	`bound register` được sử dụng để chỉ ra phần cuối của page table.

![Pasted image 20230603012412](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230603012412.png)

### Simple Example

- Hãy tìm hiểu cách sử dụng `Paging` và `Segments` thông qua ví dụ sau.

![Pasted image 20230603012626](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230603012626.png)

- Ví dụ. Giả sử rằng mỗi Process có ba Page table được liên kết.
	- Giả sử rằng kích thước page là `4KB`, kích thước của không gian địa chỉ ảo là `32 bit` và chỉ có 3 trong 4 segment được sử dụng.
	- Khi Process đang chạy, `base register` của segment này chứa địa chỉ vật lý của linear page table cho segment đó.

### TLB miss

- Phần cứng có thể lấy địa chỉ vật lý (physical address) từ Page Table.
	- Phần cứng sử dụng các segment bit (SN) để xác định cặp base & bound nào sẽ sử dụng.
	- Sau đó, phần cứng lấy địa chỉ vật lý và kết hợp nó với VPN để tạo thành địa chỉ của Page Table Entry (PTE) như sau:

![Pasted image 20230603013335](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230603013335.png)

- Ví dụ trên có `Code Segment` (10) và giá trị VPN là 4.
- Ngay cả khi TLB miss xảy ra ở đây, việc dịch địa chỉ có thể được thực hiện bằng cách sử dụng các segment bit.
- Sự khác biệt so với kỹ thuật paging hiện tại là vì thanh ghi bound có giá trị cuối của page table, nên không cần duy trì không gian page table chưa sử dụng, điều này có thể giảm lãng phí bộ nhớ.

### Problem

- Tuy nhiên, phương pháp Hybrid Approach này có một vấn đề.
- Và nếu bạn có một Heap lớn nhưng không được sử dụng thường xuyên, thì vẫn có quá nhiều page table có thể bị lãng phí.
- Vấn đề này một lần nữa là phân mảnh bên ngoài (external fragmentation).

## 3. Multi-level Page Table

- Lần này, hãy xem `Multi-level Page Table`, một phương pháp loại bỏ không gian không sử dụng khỏi page table khỏi bộ nhớ.
- Phương pháp này cũng được sử dụng trong hệ điều hành thực và được cho là hoạt động rất hiệu quả.
- Giải thích: Biến Linear page table thành thứ gì đó giống như Tree.
	- Cắt page table thành các đơn vị kích thước page.
	- Nếu tất cả các page của các Page Table entry không hợp lệ (nếu thậm chí không có một mục nhập hợp lệ nào), thì page table tương ứng sẽ không được cấp phát.  
	- Để theo dõi xem một page trong page table có hợp lệ hay không, nó sử dụng một cấu trúc mới được gọi là `Page Directory`.

### **Page Directory**

- Tìm hiểu `Multi-level Page Tables` thông qua ví dụ sau.

![Pasted image 20230603014438](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230603014438.png)

- Trong phần mô tả khái niệm ở trên, người ta nói rằng nếu thậm chí không có entry hợp lệ nào sau khi cắt page table thành các page, page table sẽ không được duy trì.
	- Trong ví dụ trên, vì `PFN202` và `PFN203` không hợp lệ, bạn có thể thấy rằng page table không được cấp phát.  
- Vai trò của `Page Directory` là cho biết vị trí của các page trong page table và liệu có các page hợp lệ trong page table hay không.

### Page directory entry

- Page Directory chỉ có một **page entry** trên mỗi **page**. (Nói cách khác, có thể thấy nó đóng vai trò giống như phần đầu của page table và base register)
	- Và Page Directory bao gồm một số Page Directory Entry (PDE).  
- PDE có `bit hợp lệ` và `page frame number (PFN)`.
	- Invalid: Có nghĩa là không có trang nào hợp lệ trong số tất cả các trang trong page table.
	- Valid: Điều đó có nghĩa là ít nhất một PTE của trang tương ứng được chỉ ra bởi PDE này là hợp lệ.

### Advantage & Disadvantage

#### Advantage

- Chỉ cấp phát page-table space tương ứng với address space đang sử dụng.
- Khi OS cần cấp phát hoặc mở rộng page table, nó có thể lấy free page tiếp theo.

#### Disadvantage

- Trong trường hợp TLB miss, cần có hai lần tải bộ nhớ để lấy thông tin chuyển đổi chính xác từ page table.
- Điều này được gọi là **Time-space trade-off**.
	- Smaller page table size
	- TLB miss -> two loads from memory -> one for the page directory, and one for the PTE itself  
- Và vì nó phức tạp hơn phương pháp hiện có nên nó được gọi là độ phức tạp gia tăng (**Increased complexity**).

## Review

- Trong bài đăng này, tôi đã tóm tắt cách giảm dung lượng bộ nhớ được sử dụng cho page table khi xử lý một tiến trình yêu cầu nhiều page hơn TLB có thể quản lý.
- Sau khi hiểu và sắp xếp các khái niệm, điểm mạnh và điểm yếu của `Multi-level Page Table`, tôi chắc chắn đã hiểu sâu hơn trước.  
	(Ngay cả khi tôi sắp xếp phần liên quan đến tính toán, tôi quyết định bỏ qua nó vì tôi cảm thấy khó sắp xếp khái niệm OS tiếp theo sau bài đăng này)  
	(Hãy tổ chức các khái niệm CS trước và tải lên bổ sung sau khi thời gian cho phép)
- Nếu cho rằng từ trước đến nay page table được lưu trữ trong bộ nhớ thì khái niệm `Swapping` tiếp theo là giải thích trường hợp page table được lưu trữ trong đĩa (disk) chứ không phải trong bộ nhớ (memory).
