---
categories: [os, computer-science]
title: TLB
date created: 2023-06-02
date modified: 2023-07-10
tags: [os, computer-science]
---

## Vấn đề

- Chi phí phát sinh nếu ảo hóa bộ nhớ được hỗ trợ bằng cách sử dụng kỹ thuật phân trang (Paging).
- Truy cập Page Table một lần, Truy cập bộ nhớ thực tế dựa trên Page Table gây lãng phí bộ nhớ.
- Nói cách khác, Paging làm lãng phí bộ nhớ và chậm, vì vậy TLB ra đời để làm cho nó nhanh hơn.

## TLB (Translation Lookaside Buffers)

- `TLB` là một phần của **Memory-Management Unit(MMU)** đóng vai trò là bộ đệm phần cứng lưu danh sánh bản dịch địa chỉ.

![Pasted image 20230602203908](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230602203908.png)

- TLB là bộ đệm phần cứng chứa thông tin VPN(virtual page number) và PFN(physical frame number) được sử dụng thường xuyên theo cặp và sử dụng chúng để giúp chuyển đổi địa chỉ ảo thành địa chỉ thực.
- Sử dụng điều này, CPU truy cập TLB, không phải Page Table, khi thực hiện dịch địa chỉ bằng kỹ thuật phân trang. Nếu thông tin của VPN và PFN mà CPU muốn có trong TLB, nó có thể thực hiện dịch địa chỉ nhanh chóng với thông tin.
- Nói cách khác, vì thông tin liên quan được đưa đến TLB mà không có Page Table, nên có một lợi thế là việc chuyển đổi địa chỉ được thực hiện nhanh chóng.
- Tuy nhiên, nếu thông tin không có trong TLB, thì chắc chắn thông tin đó sẽ được đi lấy từ Page Table.

![Pasted image 20230602204541](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230602204541.png)

- Hình trên là một ví dụ về Paging Hardware sử dụng TLB.
- `TLB hit` (= nếu tồn tại trong TLB ) Chuyển địa chỉ ảo thành địa chỉ thực không cần thông qua Page Table.
- T`LB miss `(= Nếu không có trong TLB) truy vấn thông tin tương ứng với địa chỉ ảo từ Page Table và chuyển nó thành địa chỉ vật lý.

## 🎯 Hoạt động

![tlb work](https://raw.githubusercontent.com/vanhung4499/images/master/snap/2023060220061123.png)

## TLB entry (Có gì trong TLB?)

![Pasted image 20230602204807](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230602204807.png)

- TLB được quản lý theo **Full Associative** method.
	- Một TLB điển hình có thể có 32, 64 hoặc 128 entry.
	- Phần cứng tìm kiếm song song toàn bộ TLB để tìm chuyển đổi mong muốn
	- Other bits : valid bits , protection bits, address-space identifier, dirty bit
- Tóm lại, một TLB được sử dụng thường xuyên có thông tin VPN(virtual page number) và  PFN(Page Frame Number) theo cặp và đó là Bộ đệm phần cứng giúp chuyển đổi địa chỉ bằng cách sử dụng thông tin này.

## Example: Accessing An Array

Tôi lấy ví dụ sau để thấy TLB cải thiện hiệu suất bộ nhớ như thế nào.

![Pasted image 20230602205735](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230602205735.png)

- Giả định: Giả sử rằng kích thước của Page là 16 byte và kích thước của không gian địa chỉ ảo là 8 bit (2^8=196 byte).
- Số trang hiện có trong không gian địa chỉ ảo là 16 (Virtual Address Space Size / Page size).
- Vì kiểu dữ liệu int là 4 byte nên tổng kích thước mảng là 40 byte khi áp dụng cho câu lệnh for. (Nếu mảng bắt đầu tại địa chỉ ảo 100, Page Table sẽ như hình bên trái)

1. Câu lệnh for được chạy và khi a[0] được yêu cầu, VPN = 6 (a[0] ~ a[2]) tăng lên.
2. Khi a[3] được yêu cầu, nó sẽ bị bỏ lỡ vì nó không có trong VPN = 6 và tăng lên VPN = 7 (a[3] ~ a[6]).
3. Kết luận có 3 lần `miss` và 7 lần hit `nên` kết luận tỷ lệ TLB Hit rate = 70%.
	- 3 lần miss là a[0], a[3], a[7] và 7 lần trúng là a[1], a[2], a[4], a[5], a[6], a [8 ], a[9].
		- Khi một yêu cầu đến mảng a, nếu VPN không có giá trị tương ứng, sẽ xảy ra lỗi và nếu một yêu cầu lại đến mảng a sau khi truy cập một lần, thì chúng được coi là một lần truy cập vì thông tin chuyển đổi đã tồn tại trong TLB sau lần đầu.
		- Ở đây, vì kích thước của trang là 16 byte, tỷ lệ trúng là 70%, nhưng nếu số lượng phần tử trong mảng tăng nhiều hơn mức này, nó sẽ gần bằng 100%.
- Truy vấn địa chỉ thành công trong TLB được gọi là lần `TLB Hit`.  
- Trong trường hợp không có trong TLB, tổng cộng có 10 lần lặp lại xảy ra và mỗi lần lặp lại yêu cầu quyền truy cập vào Page Table để thực hiện dịch địa chỉ.
- Tuy nhiên, như thể hiện trong hình trên, trong trường hợp của TLB, chỉ có 3 `TLB miss` trong số 10 lần truy cập vào mảng a xảy ra, vì vậy chỉ cần 3 lần truy cập vào Page Table dịch địa chỉ.

TLB cải thiện hiệu suất do **Spatial Locality**.

## Locality

- `Temporal Locality` có nghĩa là có khả năng cao truy cập dữ liệu được truy cập gần đây. Nó có thể được tìm thấy chủ yếu trong các lệnh lặp đi lặp lại.
	- Phần cứng tận dụng lợi thế của Locality bằng cách lưu trữ thông tin trong một bộ nhớ đệm (cache).
	- Vì kích thước của bộ đệm nhỏ, thông tin được lưu trữ nhanh chóng trong bộ nhớ, nhưng nếu kích thước của bộ đệm tăng lên, thì nó không thể nhanh được.

![Pasted image 20230602211529](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230602211529.png)

- `Spatial Locality` có nghĩa là nếu một phần tử được truy cập, thì có khả năng cao sẽ truy cập các phần tử xung quanh nó.
	- Khi truy cập dữ liệu như mảng, nó được truy cập tuần tự (truy cập liên tiếp), vì vậy nếu một phần tử apple được truy cập, thì khả năng cao là các phần tử xung quanh apple sẽ được truy cập vào lần tiếp theo.

![Pasted image 20230602211714](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230602211714.png)

## Effective Access Time(EAT)

- Hãy xem cách tính thời gian truy cập bộ nhớ thực tế (EAT).
- Giả sử ví dụ sau:
	- TLB hit ratio $\alpha$ = 80%
	- TLB search : 20 ns (Thời gian tìm kiếm thông tin trong TLB)
	- Memory access : 100 ns (Thời gian truy cập bộ nhớ một lần để tìm nạp dữ liệu)
- `EAT` = 0.80 x (20 + 100) + 0.20 x (20 + 100 + 100) = 140 ns
	- `(20 + 100)` : Trường hợp TLB Hit, TLB Search + Memory Access.
	- `(20 + 100 + 100)` : Trường hợp TLB Miss, TLB search + Page table search + Memory access .
- Đơn vị là `ns`

## TLB Issue: Context Switching

Hãy xem điều gì sẽ xảy ra nếu Context Switching xảy ra khi sử dụng TLB thông qua ví dụ sau.

![Pasted image 20230602233715](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230602233715.png)

- Thông tin dịch địa chỉ cho VPN 10 trong `Process A` được lưu trữ trong TLB.
- Để tham khảo, mỗi tiến trình có bộ nhớ ảo riêng.

![Pasted image 20230602234135](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230602234135.png)

- Tại thời điểm này, Context Switching xảy ra và nó được chuyển sang `Process B`. `Process B` cũng có thông tin chuyển đổi địa chỉ cho VPN 10 được lưu trữ trong TLB.
- Trong trường hợp này, cả tiến trình A và B đều có cùng VPN là 10, nhưng PFN thì khác.

![Pasted image 20230603000238](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230603000238.png)

- Tuy nhiên, khi thông tin được lưu trữ trong TLB như trên, không thể biết thông tin nào là thông tin của tiến trình nào.
- Một vấn đề phát sinh khi các tiến trình truy cập vào một nơi không nằm trong không gian địa chỉ của nhau, vì vậy cần có một cách để giải quyết vấn đề này.

## To Solve Problem

- Để giải quyết vấn đề trên, thêm thông tin `ASID` (Address Space Identifier) trong TLB với sự trợ giúp của phần cứng.

![Pasted image 20230603000932](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230603000932.png)

- `ASID` được cung cấp trong TLB để phân biệt đây là thông tin của tiến trình nào.
- Thông qua đó, các thông tin `ASID` khác nhau được lưu trữ cho từng tiến trình để có thể thực hiện thành công việc dịch địa chỉ.

## Another Case

Ở trên, chúng ta đã thấy một ví dụ trong đó các VPN giống nhau, nhưng lần này, hãy xem xét trường hợp các PFN giống nhau.

![Pasted image 20230603001128](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230603001128.png)

- Giả sử ví dụ trên, `Process 1` và `Process 2` có cùng giá trị PFN là 101
	- VPN của `Process 1` là 10, VPN của `Process 2` là 50.  
- Vì hai tiến trình có cùng giá trị PFN nên chúng có thể chia sẻ một trang.
- Sau đó, do việc sử dụng bộ nhớ có thể giảm đi, nên có thể bảo đảm nhiều không gian bộ nhớ hơn trước.
- Tuy nhiên, để xác định đó là tiến trình nào, giá trị `ASID` cũng được lưu.

## TLB Replacement Policy

- Nếu một tiến trình mới được thực thi khi không gian lưu trữ trong TLB đã đầy, hãy tìm hiểu tiến trình nào sẽ bị loại trừ và một tiến trình mới sẽ được chèn vào.
- Đầu tiên, mục tiêu là giảm thiểu **TLB miss rate**. (Tương tự như cải thiện tỷ lệ TLB hit rate)
- Thông thường, có hai cách tiếp cận đơn giản. (LRU, Random policy)
- `LRU` (Least-recently-used): Đây là phương pháp loại bỏ các tiến trình không được sử dụng gần đây (được sử dụng trong quá khứ và hiện không được sử dụng).
	- LRU tận dụng lợi thế `Temporal Locality` được mô tả ở trên.  
- `Random policy`: Như tên gợi ý, đây là một phương pháp loại bỏ dữ liệu ngẫu nhiên.

### Example: LRU

- Hãy xem xét quá trình giảm thiểu TLB miss rate bằng cách sử dụng phương pháp LRU.

![Pasted image 20230603002009](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230603002009.png)

- Reference Row: Điều này có nghĩa là một số mới nhất định (tiến trình) được thực hiện tuần tự.
- Khi `process 2` xảy ra ở lượt thứ 4, bạn có thể thấy rằng `process 7` không được sử dụng trong thời gian dài nhất sẽ bị loại bỏ và `process 2` được thế vào.
- Theo cách này, tiến trình không được sử dụng gần đây nhất sẽ được xuất và một tiến trình mới được đưa vào thay thế.
- Vì 11 lần miss xảy ra trong số 18, chúng tôi có thể kết luận rằng `TLB miss ratio` = 11/18 = 0,61 = 61%.
