---
categories: [os, computer-science]
title: Paging
date created: 2023-05-31
date modified: 2023-07-10
tags: [os, computer-science]
---

## Concept of Paging

- `Paging` (Phân trang) là phương pháp phân chia không gian địa chỉ ảo của một tiến trình thành các phần có kích thước cố định và phân bổ chúng vào bộ nhớ. Lúc này, đơn vị kích thước cố định được gọi là `page` (trang).
- Khi một `page` của không gian ảo này được phân bổ cho bộ nhớ thực, nó được gọi là `page frame` (khung trang).
- Nói cách khác, nó có nghĩa là một tiến trình được thực thi trong một không gian có kích thước cố định được gọi là một `page` trong bộ nhớ ảo (virtual memory) và một `frame` trong bộ nhớ vật lý (physical memory).

## Advantages Of Paging

- **Flexibility**: Hỗ trợ hiệu quả việc trừu tượng hóa không gian địa chỉ.
	- Không cần phải lo lắng về khối lượng phát triển và sử dụng của heap và stack.  
- **Simplicity**: Dễ dàng quản lý không gian trống.
	- Các trang bộ nhớ ảo và khung trang có cùng kích thước.
	- Nó rất dễ dàng để phân bổ và giữ không gian trống.

## A Simple Paging

- **128-byte physical memory** with 16 bytes `page frames`
- **64-byte address space** with 16 bytes `pages`

![Pasted image 20230602140424](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230602140424.png)

Trong hình trên, bạn có thể thấy rằng không gian địa chỉ ảo bao gồm 4 `page` được chia thành 8 `page frame`.

## How To Store Address Translation

Để sử dụng kỹ thuật phân trang, bạn phải có một bảng trang `Page Table` ghi nhớ vị trí của các trang của một tiến trình trong không gian địa chỉ ảo ở đâu trong bộ nhớ vậy lý.

![Pasted image 20230602140708](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230602140708.png)

- `Page table` ghi lại vị trí các trang của không gian địa chỉ ảo ứng với vị trí trong bộ nhớ vật lý.
	- Per-process structure (cấu trúc theo quy trình)
	- Nó được lưu trữ trong vùng bộ nhớ của OS.

## Address Translation

- Hãy xem cách lấy bản dịch địa chỉ bằng kỹ thuật Paging.
- Có hai yếu tố cho một không gian địa chỉ ảo.
	- VPN: **V**irtual **P**age **N**umber -> 2 bit cao đại diện cho một trang.
	- Offset: Offset trong Page -> 4 bit còn lại thể hiện offset.

![Pasted image 20230602141501](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230602141501.png)

- Example: virtual address **21** in 64-byte address space

![Pasted image 20230602141529](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230602141529.png)

- A Simple 64-byte Address Space

![Pasted image 20230602141544](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230602141544.png)

- Thông qua Page table, tìm Virtual Page và Physic Page frame thứ i.
	- Vì giá trị của 2 bit cao trong VPN là 1, nên nó tương ứng với Page 1, bắt đầu ở vị trí 16  
- Tìm địa chỉ bộ nhớ trong Page thông qua Offset.
	- Vì giá trị offset là 5, nên kết quả là 16 + 5 = 21

## Example: Address Translation

- The virtual address 21 in 64-byte address space

![Pasted image 20230602142631](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230602142631.png)

- Trong không gian địa chỉ ảo, từ Virtual Addres tìm ra giá trị VPN và thông qua Page table tìm được giá trị PFN trong không gian địa chỉ vậy lý.
	- VPN: 01 -> Page Table 01 là 7 (= giá trị PFN)
	- PFN = Physical Frame Number (= PPN, Physical Page Number)
	- Offet của không gian địa chỉ ảo và không gian địa chỉ vật lý là như nhau (chúng có cùng kích cỡ)

## Where Are Page Tables Stored?

- Vấn đề 1: **Kích thước yêu cầu của Page table có thể lớn hơn nhiều** so với việc sử dụng Segment Table hoặc base & bound register được sử dụng trong phân bổ kích thước thay đổi.
- Ví dụ: nếu xem xét không gian địa chỉ ảo (address space) `32 bit` với các page `4KB`,
	- Địa chỉ ảo này được chia thành VPN `20 bit` và offset `12 bit`.
	- Để dễ hiểu, `address space` là 32 bit và xem là `Virtual address space`.
	- `VPN` = số trang = tổng kích thước / kích thước trang = 2^32 / 2^12 = 2^20 = `20bit`
	- offset = address size - VPN = 32bit - 20bit = `12bit` (2^32 / 2^20 = 2^12)
	- 4 MB = 2^20 entries * 4 Bytes per page table entry
- Page Table cho mỗi tiến trình **được lưu trữ trong bộ nhớ ảo của OS**.

## What Is In The Page Table?

- Page Table là gì?
- `Page table` là một cấu trúc dữ liệu được sử dụng để ánh xạ (chuyển đổi) địa chỉ ảo thành địa chỉ bộ nhớ vậy lý.
	- Cấu trúc đơn giản nhất cho việc này là sử dụng mảng một chiều.
- `VPN` lập chỉ mục mảng `page table` của tiến trình và tra cứu các `page table entries(PTE)` của chỉ mục đó để chuyển đổi.
	- Ở đây có thể coi PTE là thông tin của từng trang trong bảng trang.

## Example: x86 Page Table Entry

![Pasted image 20230602145456](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230602145456.png)

- Page table entries(PTE) chứa nhiều thông tin khác nhau.

> Hãy nhìn từ chỉ số 0.

- Present bit: Một bit kiểm tra xem trang hiện có tồn tại trong bộ nhớ hoặc đĩa thực hay không.
- Read/Write bit (Protection bit): Bit xác định xem trang có được phép ghi hay không.
- U/S (User/supervisor bit): Bit cho biết tiến trình User Mode có thể truy cập trang hay không
- PWT, PCD, PAT, G: Các bit xác định cách bộ nhớ đệm phần cứng hoạt động cho trang
- A (Accessed bit) (Reference bit): Thông tin về việc nó có được tham chiếu gần đây hay không (được sử dụng trong chính sách thay thế trang)
- D (Dirty bit): thông tin về việc trang có bị sửa đổi hay không
- Phần còn lại bao gồm **Page frame number** (= Page Base Address, `PFN`).

## Paging: **Too Slow**

- Quá trình chuyển đổi địa chỉ ảo thành địa chỉ bộ nhớ vật lý có thể được tóm tắt như sau.

![Pasted image 20230602150910](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230602150910.png)

1. Sau khi tìm ra VPN và offset từ địa chỉ ảo của tiến trình, hãy mang thông tin PTE từ bảng trang của tiến trình làm giá trị VPN của tiến trình.
2. Page Frame Number (PFN) được trích xuất từ ​​Page Table Entry (PTE).
3. Sử dụng PFN và offset để lấy địa chỉ bộ nhớ thực.

- Vấn đề 2: Tuy nhiên, quá trình này gây ra sự cố làm **giảm hiệu suất máy tính**.
	- Để tìm vị trí của PTE mong muốn, cần có vị trí bắt đầu của Page Table.
	- Đối với mọi tham chiếu bộ nhớ, Paging yêu cầu OS thực hiện thêm một tham chiếu bộ nhớ. (For every memory reference, paging requires the OS to perform one extra memory reference.)
	- Nghĩa là, cần có quyền truy cập bộ nhớ bổ sung vì thông tin chuyển đổi địa chỉ được yêu cầu để mang dữ liệu từ bộ nhớ vật lý.

## Review

- Paging giải quyết vấn đề phân mảnh bên ngoài của segmentaion, một phương pháp phân bổ kích thước thay đổi và có ưu điểm là mang lại tính linh hoạt.
- Tuy nhiên, nếu paging được sử dụng quá mức, như đã đề cập trong vấn đề 2, việc truy cập bộ nhớ trở nên quá thường xuyên, điều này có thể làm giảm hiệu suất.
- Vì thông tin chuyển đổi địa chỉ được yêu cầu để mang dữ liệu từ bộ nhớ vật lý, nên có thể xảy ra truy cập bộ nhớ bổ sung và lãng phí bộ nhớ.
 - [[TLB]] **(Translation Lookaside Buffer)** ra đời để giải quyết hai vấn đề này.
