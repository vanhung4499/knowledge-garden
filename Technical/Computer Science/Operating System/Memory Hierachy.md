---
categories: [os, computer-science]
title: Memory Hierachy
date created: 2023-05-30
date modified: 2023-07-10
tags: [os, computer-science]
---

Bộ nhớ là nơi mà CPU có thể truy cập trực tiếp

Để một tiến trình chạy, chương trình phải được nạp vào bộ nhớ.

Một không gian lưu trữ địa chỉ và thông tin cần thiết để chạy chương trình và cung cấp bộ nhớ để sử dụng

## Đặc điểm của bộ nhớ

- Locality: Truy cập dữ liệu gần về thời gian hoặc không gian.
	- Vị trí tạm thời (**Temporal locality**): Nếu một số dữ liệu đã được truy cập một lần, rất có khả năng dữ liệu sẽ được truy cập lại trong tương lai gần.
	- Vị trí không gian (**Spatial locality**): Xác suất mà một vị trí bộ nhớ liền kề với vị trí bộ nhớ được truy cập sẽ được truy cập là cao.
- Nó bao gồm các hệ thống phân cấp sử dụng nguyên tắc địa phương.
	- Khi bạn đi lên, thời gian truy cập giảm, tốc độ tăng, chi phí tăng và dung lượng giảm
- Các yếu tố quyết định hiệu suất: dung lượng bộ nhớ (capacity), thời gian truy cập (access time), thời gian chu kỳ (cycle time), băng thông bộ nhớ (bandwidth), chi phí (cost)

## 2. Memory layer = storage layer

✔ Một cấu trúc xác định sự đánh đổi giữa ba đặc điểm chính về dung lượng, tốc độ truy cập và chi phí và điều chỉnh chúng khi cần thiết.

![Pasted image 20230530012718](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230530012718.png)

Theo mô hình trên:

- Dung lượng: càng lên cao càng nhỏ
- Tốc độ truy cập: càng lên cao càng nhanh
- Chi phí: càng lên cao càng đắt

Lý do phân cấp:

- Chia bộ nhớ thành các loại khác nhau khi cần thiết cho phép CPU truy cập bộ nhớ nhanh hơn.
- Hiệu quả tối ưu có thể đạt được bằng cách sử dụng các loại thiết bị lưu trữ khác nhau với các đặc điểm riêng của chúng cùng nhau.

### 1. Register 🚑

- Register lưu trữ dữ liệu cần thiết để CPU xử lý các yêu cầu
	- CPU không có cách nào để tự lưu trữ dữ liệu nên nó không thể chuyển dữ liệu trực tiếp vào bộ nhớ.
	- → Để hoạt động, các register phải được thông qua và đối với điều này, các register có thể trỏ đến các địa chỉ cụ thể hoặc đọc các giá trị.
- Register là bộ nhớ tốc độ cao nằm trên bộ xử lý có chứa dữ liệu sẵn sàng cho quá trình sử dụng (một lượng nhỏ dữ liệu, kết quả trung gian đang được xử lý, v.v.)

#### CPU Internal Register Type

|Kiểu|Ý nghĩa|
|---|---|
|PC (Program Counter)|Chứa địa chỉ của lệnh (instruction) tiếp theo sẽ được thực hiện|
|AC (ACcumulator)|Lưu trữ tạm thời dữ liệu kết quả hoạt động|
|IR (Instruction Register)|Lưu lệnh hiện đang thực hiện|
|SR (Status Register)|Lưu trạng thái hiện tại của CPU|
|MAR (Memory Address Register)|Chứa các địa chỉ để đọc hoặc ghi vào bộ nhớ|
|MBR (Memory Buffer Register)|Lưu dữ liệu đọc từ bộ nhớ hoặc dữ liệu được ghi vào bộ nhớ|
|I/O AR (I/O Address Register)|Lưu địa chỉ của I/O Module theo I/O Device|
|I/O BR (I/O Buffer Register)|Được sử dụng để trao đổi dữ liệu giữa I/O Module và CPU|

### 2. Cache 🚗

Là nơi dữ liệu hoặc giá trị đã được sử dụng và có khả năng được sử dụng lại.

![Pasted image 20230530015334](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230530015334.png)

- Mục đích cải thiện sự khác biệt về tốc độ giữa CPU và bộ nhớ chính
- Được sử dụng cho hiệu quả hệ thống:
	- Nếu mất nhiều thời gian để truy cập dữ liệu gốc so với thời gian truy cập bộ đệm  
	- Nếu bạn muốn tiết kiệm thời gian tính toán lại các giá trị  
- Bộ nhớ đa năng để giảm bớt tắc nghẽn chênh lệch tốc độ giữa các thiết bị nhanh và chậm

#### CPU Cache

- Bộ nhớ cache được gắn bên trong hoặc bên cạnh chip CPU để tăng tốc độ truy cập vào lượng lớn bộ nhớ chính.
- Quản lý thông qua phần cứng
- Trong CPU hiện đại thường có 3 level cache: L1, L2, L3

![cpu-cache-work](https://raw.githubusercontent.com/vanhung4499/images/master/snap/cpu-cache-work.svg)

#### Disk Cache

- Bộ nhớ cache được tích hợp trong đĩa cứng (chức năng: điều khiển đĩa, giao tiếp với bên ngoài) (bộ nhớ nhỏ lưu dữ liệu vào và ra đĩa)
- Là loại kỹ thuật tồn tại để giảm chi phí trao đổi dữ liệu giữa Disk và RAM

#### Other Cache

- Cache được quản lý bằng phần mềm
- Page Cache: Sao chép bộ nhớ chính của hệ điều hành vào đĩa cứng, vd: web cache

**Để Cache hoạt động hiệu quả, dữ liệu mà nó lưu trữ phải là cục bộ.**

### 3. Main Memory 🛵

- Là bộ nhớ chính của máy tính
- Là thiết bị phần cứng máy tính lưu trữ các giá trị số, lệnh, dữ liệu, v.v. trong máy tính
- **RAM(Random Access Memory)**: Lưu trữ ngắn hạn
	- Thành phần lưu trữ dữ liệu trong một khoảng thời gian ngắn để truy cập nhanh
	- Truy cập thông tin tương ứng bằng cách tải chương trình hoặc tài nguyên do người dùng yêu cầu từ đĩa lưu trữ vào bộ nhớ
	- Khi nguồn điện được duy trì, mọi thứ cần thiết cho hoạt động và vận hành của CPU đều được lưu trữ.
	- Xóa sạch dữ liệu khi tắt nguồn
	- `Random Access`: Có nghĩa là bạn có thể truy cập, đọc và ghi ở cùng một tốc độ từ bất kỳ vị trí nào.
	- Có **DRAM** và **SRAM**, và bộ nhớ chính chủ yếu có nghĩa là DRAM. (SRAM cache hoặc register)
- **ROM(Read Only Memory)** : Lưu trũ vĩnh viễn
	- Bộ nhớ cố định lưu trữ vĩnh viễn các instruction trong máy tính  
	- Giữ lại nội dung đã ghi nhớ khi tắt nguồn  
	- Được sử dụng cho các tính năng và bộ phận không có khả năng thay đổi  
		- Phần mềm: Phần liên quan đến BOOTING
		- Phần cứng: Các lệnh firmware liên quan đến hoạt động của máy in, v.v.  
	- Thay vì được sử dụng làm bộ nhớ chính, ROM chủ yếu được sử dụng để lưu trữ phần mềm hệ thống không có khả năng thay đổi, chẳng hạn như Basic Input Output System (BIOS).

> 🙋‍♀️ DRAM và SRAM là gì?
>
> DRAM - Dynamic RAM
> - bộ nhớ động  
> - Ngay cả khi nguồn điện được cung cấp liên tục, nó vẫn phải được sạc lại định kỳ để duy trì nội dung đã ghi nhớ.
> - Nó chủ yếu được sử dụng cho các thiết bị lưu trữ dung lượng lớn và không tốn kém.
> - Chủ yếu được thể hiện dưới dạng RAM (bộ nhớ chính) gần như là DRAM.  
>
> SRAM - Static RAM
> - Bộ nhớ tĩnh  
> - Miễn là nguồn điện được cung cấp, nội dung được ghi sẽ không bị xóa, do đó không cần phải sạc lại.  
> - Đặc trưng là tốc độ truy cập cao và giá cao, và chủ yếu được sử dụng làm cache hoặc register.

### 4. Secondary Memory 🚲

- Là thiết bị lưu trữ ứng với physical disk
- **HDD(Hard Disk Drive), SSD(Solid State Drive)**
- Dữ liệu đã lưu không mất khi tắt máy tính (non-volatile)
- Không thể trao đổi dữ liệu trực tiếp với CPU  
- Truy cập mất nhiều thời gian  
- Nói chung, phương pháp DMA được sử dụng để lưu trữ dữ liệu trong bộ nhớ chính.  
- Không có quyền truy cập CPU trực tiếp  

> Main Memory so với Secondary Memory
>
> Memory hay Main Memory, có thể được truy cập trực tiếp bởi CPU, nhưng disk hay Secondary Memory, dữ liệu phải được nạp vào Main Memory trước khi CPU có thể sử dụng.
>
> - CPU: bộ não con người
> - Memory: không gian dành cho công việc (ví dụ: bàn, notepad): không gian để CPU xử lý thứ gì đó
> - Disk: không gian để lưu trữ (ví dụ: giá sách, sắp xếp ghi chú)

## Sự cần thiết của việc phân cấp bộ nhớ

### 1. Tốc độ giải mã (decode instruction)

- **Decoding**: Còn được gọi là giải mã, quá trình trả lại thông tin được mã hóa về trạng thái trước khi nó được mã hóa hoặc phương pháp xử lý của nó  
- CPU truy cập bộ nhớ thông qua ba bus  
	- Address Bus: Cho biết CPU sẽ truy cập dữ liệu từ phần nào của bộ nhớ  
	- Data Bus: truyền dữ liệu giữa bộ nhớ và CPU  
	- Control Bus: Truyền tín hiệu điều khiển, chỉ báo truy cập bộ nhớ CPU  
- Khi các giá trị hiện diện trên address bus và data bus, CPU sẽ thực hiện các tác vụ bộ nhớ ngay khi nó gửi tín hiệu điều khiển.  
- Giải mã và truyền tín hiệu điều khiển vào một bộ nhớ, mất nhiều thời gian hơn để giải mã khi sử dụng dung lượng bộ nhớ lớn

![os-memory-decode](https://raw.githubusercontent.com/vanhung4499/images/master/snap/os-memory-decode.svg)

→ Để CPU truy cập dữ liệu nhanh thì bộ nhớ lưu dữ liệu phải nhỏ.  

### 2. Dữ liệu được sử dụng thường xuyên

- Ngay cả khi sử dụng một lượng lớn bộ nhớ, tất cả dữ liệu trong đó không được truy cập đồng đều  
- Dữ liệu được sử dụng thường xuyên vẫn được sử dụng thường xuyên, dữ liệu không được sử dụng thường xuyên tiếp tục được sử dụng không thường xuyên  
	- => OS/CPU → Tự động đọc dữ liệu được sử dụng thường xuyên hoặc có khả năng được sử dụng lại từ memory vào cache.  
- Do lượng dữ liệu thường xuyên sử dụng nhỏ so với tổng lượng dữ liệu nên bộ đệm có thể nhỏ hơn bộ nhớ và bộ nhớ có thể nhỏ hơn đĩa cứng.  

### 3. Tính khả thi về kinh tế  

- Lớp trong cấu trúc phân cấp bộ nhớ càng cao thì càng đắt.  
- Phần cứng đắt tiền chỉ sử dụng dung lượng lớn thực sự cần thiết  
- Sử dụng phần cứng giá rẻ với dung lượng lớn
