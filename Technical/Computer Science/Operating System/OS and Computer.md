---
categories: [os, computer-science]
title: OS and Computer
date created: 2023-05-29
date modified: 2023-07-10
tags: [os, computer-science]
---

## Hệ điều hành là gì?

Hệ điều hành là phần mềm hệ thống quản lý hiệu quả tài nguyên hệ thống máy tính để tối đa hóa sự thuận tiện cho người dùng và hiệu suất hệ thống.

Nó hoạt động như một giao diện giữa người dùng máy tính và phần cứng máy tính.

Ứng dụng chỉ có thể sử dụng tài nguyên do hệ điều hành cung cấp.

![Pasted image 20230529203122](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230529203122.png)

## Vai trò của hệ điều hành

1. **Quản lý tiến trình và lập lịch CPU (CPU Scheduling and Process Management)**
	- Quản lý các tiến trình được chỉ định quyền sở hữu CPU, tạo và xóa các tiến trình cũng như phân bổ và trả lại tài nguyên.
	- (FIFO, SJF(Shortest Job First), Round Robin Scheduling, priority scheduling, v.v.)
2. **Quản lý bộ nhớ: (Memory Management)**
	- Quản lý lượng bộ nhớ giới hạn sẽ được phân bổ cho các quy trình
3. **Quản lý file (File Management)**
	- Quản lý cách lưu trữ file
	- Tạo, sửa đổi, xóa, chia sẻ, sao lưu, phục hồi, truyền tệp giữa các thiết bị lưu trữ chính và phụ, v.v.
- **Quản lý thiết bị I/O: (I/O Device Management)**
	- Quản lý việc trao đổi dữ liệu giữa các thiết bị I/O, chẳng hạn như chuột, bàn phím, màn hình, v.v.

## Thành phần của hệ điều hành

![OS-Architecture](https://raw.githubusercontent.com/vanhung4499/images/master/snap/OS-Architecture.svg)

Các phần sọc xanh là hệ điều hành

### GUI

GUI hay Graphic User Interface, tạm dịch là **giao diện đồ họa người dùng**, là thành phần giúp người dùng tương tác trực quan với máy tính thay vì dùng command line.

Hiểu đơn giản là những gì hiện ra màn hình máy tính của bạn là GUI. Windows/macOS/Linux sẽ có GUI khác nhau. Nhưng mục đích chung là giúp người dùng có thể tương tác trực quan hơn. VD: thực hiện xoá file, chỉ chuột phải vào file rồi chọn xoá thay vì dùng lệnh `rm` trong terminal, v.v

 Đối với các máy chủ thường chạy linux và không có GUI (Graphic User Interface) mà chỉ có CUI (Console User Interface), tức là bạn chỉ có một terminal và giao tiếp bằng command line.

### [[System Call]]

Là một giao diện để OS truy cập [[Kernel]]. Được sử dụng khi chương trình (user program) gọi kernel function để yêu cầu dịch vụ từ OS. Khi một user program kích hoạt một chỉ thị với một I/O Request, sau khi xác minh rằng đó là một I/O Request hợp lệ, usermode được chuyển đổi thành kernel mode thông qua một system call và được thực thi. Thông qua quá trình này, quyền truy cập trực tiếp vào tài nguyên máy tính có thể bị chặn và chương trình có thể được bảo vệ khỏi các chương trình khác.

> I/O Request: công việc liên quan đến chức năng nhập/xuất, cơ sở dữ liệu, mạng, truy cập file, v.v  
>

Vì system call là một interface, nên nó có lợi thế là có thể triển khai chương trình mà không phải lo lắng quá nhiều về xử lý khu vực cấp thấp như giao tiếp mạng hoặc cơ sở dữ liệu.

Phần này quá dài, nên đã tách thành bài viết riêng. đọc tiếp [[System Call]]

### Kernel

Kernel là một phần quan trọng của hệ điều hành cung cấp các dịch vụ cần thiết cho các phần khác của hệ điều hành và các chương trình, ứng dụng để chạy.

Khi máy tính được bật, hệ điều hành sẽ chạy cùng lúc. Để phần mềm chạy trên hệ thống máy tính, chương trình phải được tải vào bộ nhớ. Tương tự như vậy, bản thân hệ điều hành cũng là một phần mềm, phải được tải vào bộ nhớ ngay khi bật nguồn. Xem thêm phần [booting](#Booting) ở dưới.

Tuy nhiên, nếu tất cả các chương trình quy mô lớn, chẳng hạn như hệ điều hành, được tải vào bộ nhớ, không gian bộ nhớ hạn chế sẽ bị lãng phí nghiêm trọng.

Do đó, chỉ những thành phần cần thiết của hệ điều hành mới được tải vào bộ nhớ ngay khi bật nguồn, còn những phần khác được tải vào bộ nhớ và được sử dụng khi cần.

Thành phần của hệ điều hành nằm trong bộ nhớ được gọi là kernel.

#### Vai trò của kernel

- Bảo vệ
- Quản lý tài nguyên (resource)
- Trừu tượng

> Tài nguyên (resource): bao gồm những phần vật lý như bộ nhớ CPU, bộ nhớ ảo, bàn phím và chuột và những thứ trừu tượng như luồng, gói, giao thức v.v

Kernel của hệ điều hành thực hiện các tác vụ như lập lịch CPU, quản lý bộ nhớ, quản lý input/output ra và quản lý hệ thống tệp để quản lý hiệu quả các tài nguyên này.

Một hệ điều hành hoạt động trong môi trường đa chương, trong đó một số chương trình có thể được thực hiện đồng thời. Mỗi chương trình yêu cầu các luật bảo mật khác nhau cho phần cứng để ngăn chặn sự cố cản trở việc thực thi các chương trình khác hoặc gây ra xung đột.

Để làm được điều này, hệ điều hành sử dụng chế độ hoạt động kép (Dual-mode Operation) trong đó chế độ người dùng (User Mode) và chế độ hạt nhân (Kernel Mode) được cung cấp.

#### Dual-mode Operation

Người dùng và hệ điều hành chia sẻ tài nguyên hệ thống.

Vì vậy, nếu bạn không hạn chế người dùng, người dùng sẽ có nguy cơ phá hủy các tài nguyên hệ điều hành chính trong bộ nhớ.

Đó là, để hoạt động trơn tru các chức năng của hệ điều hành, một thiết bị bảo vệ hạn chế quyền truy cập của người dùng vào tài nguyên hệ thống là điều cần thiết.

Chế độ hoạt động kép được chia thành chế độ người dùng và chế độ kernel.

1. **Chế độ người dùng (User Mode)**
	- Chế độ người dùng là chế độ trong đó một khu vực mà người dùng chung (người dùng) có thể truy cập bị hạn chế và tài nguyên chương trình không bị xâm phạm.
	- Người dùng có thể viết mã ở chế độ người dùng, chạy các tiến trình, v.v.
	- Bảo mật phần cứng được duy trì bằng cách cho phép các hoạt động có tác động đáng kể đến hệ thống chỉ được thực thi trong chế độ nhân.
	- Để truy cập, bạn phải sử dụng một [[System Call]].

2. **Chế độ hạt nhân (Kernel Mode)**  
	- Chế độ hạt nhân, còn được gọi là chế độ giám sát, chế độ đặc quyền hoặc chế độ hệ thống, là chế độ trong đó hệ điều hành thực thi mã hệ điều hành với quyền kiểm soát của CPU.
	- Ở chế độ kernel, tất cả bộ nhớ trong hệ thống đều có thể truy cập được và tất cả các loại lênh CPU đều có thể được thực thi.
	- Thực thi mã chế độ nhân chẳng hạn như mã hệ điều hành hoặc trình điều khiển thiết bị (device driver).

#### 👨‍💻 modebit

modebit là cờ (flag) có giá trị 0 hoặc 1, dùng để phân tách [[User Mode]] và [[Kernel Mode]]. Đối với I/O Device, nếu hoạt động dựa trên [[User Mode]] thì rất dễ trở thành mục tiêu tấn công.

Nó bảo vệ thiết bị người dùng từ bên ngoài bằng cách cho phép các thiết bị I/O như camera và bàn phím chỉ được sử dụng thông qua hệ điều hành.

![Pasted image 20230601163151](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601163151.png)

### Driver

Driver là phần mềm điều khiển phần cứng.

Sau khi cài đặt hệ điều hành, nhiều phần cứng sẽ không hoạt động được do thiếu driver. Là cầu nối giữ kernel với hardware, để giúp kernel có thể giao tiếp hardware.

## Một số thành phần của máy tính

Bao gồm CPU, DMA, controller, memory, timer, device controller, v.v

### CPU(Central Processing Unit)

- CPU (Central Processing Unit) là bộ não của máy tính, thực hiện các lệnh nó nhận được từ các phần cứng cũng như phần mềm trên thiết bị. Nói một cách cụ thể hơn, bộ vi xử lý này sẽ thực hiện các phép tính liên quan đến số học, đo lường, so sánh, logic, đồng thời nhập hoặc xuất dữ liệu từ các mã lệnh trên máy tính.
- Bao gồm ALU, CU và Register. Giải thích và thực hiện các chỉ thị hiện có trong bộ nhớ đơn giản bằng cách ngắt (interrupt)

#### CU (Control Unit)

Một phần của CPU chỉ đạo các hoạt động của các tiến trình (process). Điều khiển giao tiếp giữa các thiết bị input/output, đọc và diễn giải các chỉ thị và xác định thứ tự xử lý dữ liệu

#### Register

Bộ nhớ tạm thời trong CPU. Do được kết nối trực tiếp với CPU nên tốc độ truy cập nhanh hơn RAM hàng chục đến hàng trăm lần.

Vì CPU không có cách nào để tự lưu trữ dữ liệu nên nó sẽ chuyển dữ liệu qua các register.

HDD → SSD → RAM → Cache → Register

Nếu dữ liệu cần truy có trong register, hãy hit, nếu không, nó được tìm thấy ở phía dưới.

#### ALU (Arithmetic Logic Unit)

Một mạch kỹ thuật số tính toán các phép toán số học của hai số, chẳng hạn như cộng và trừ, và các phép toán logic, chẳng hạn như tổng logic loại trừ và tích logic.

- CPU hoạt động:
	1. Bộ điều khiển nạp các giá trị cần tính vào register.  
	2. Control Unit hướng dẫn ALU tính toán giá trị trong register.  
	3. Bộ điều khiển lưu giá trị tính toán từ register trở lại bộ nhớ.

**[[Interrupt]]**

[[Interrupt]] (**ngắt**) đề cập đến việc dừng CPU trong một thời gian khi có tín hiệu nhất định. interrupt gây ra bởi các thiết bị IO như bàn phím và chuột, gián đoạn trong các phép toán số học chia số cho 0, lỗi xử lý, v.v.

Khi một interrupt xảy ra, nó sẽ chuyển đến ISR (Interrupt Service Routine) nơi tập hợp các hàm xử lý interrupt và thực hiện xử lý interrupt.

Thủ tục Interrupt

- Một interrupt xảy ra trong khi xử lý một tác vụ hiện có.
- Máy tính dừng xử lý hiện tại và lưu trạng thái hiện tại  
- Xử lý thường trình dịch vụ interrupt để xử lý ngắt tương ứng  
- Khôi phục trạng thái của tác vụ trước đó đã được lưu sau khi xử lý interrupt và tiếp tục thực hiện tác vụ trước đó.

> Hàm xử lý interrupt: Một hàm xử lý một interupt khi nó xảy ra. Nó được gọi thông qua IRQ bên trong kernel và chức năng xử lý ngắt có thể được đăng ký thông qua request_irq().

1. Ngắt phần cứng
	- Sau khi ISR thiết kế, nó dừng thực hiện ngắt tuần tự và yêu cầu một system call tới hệ điều hành để đi đến thiết bị mong muốn và truy cập vào một bộ đệm cục bộ nhỏ trên thiết bị để thực hiện công việc.
2. Ngắt phần mềm
	- Còn được gọi là một Trap. Được kích hoạt khi gọi một system call do lỗi tiến trình, v.v.

### DMA (Direct Memory Access Controller)

Một thiết bị phần cứng cho phép I/O Device truy cập trực tiếp vào bộ nhớ. Vì có quá nhiều yêu cầu ngắt chỉ đến với CPU nên nó chặn tải của CPU và tạo gánh nặng cho CPU. Ngăn bộ điều khiển CPU và DMA thực hiện một tác vụ cùng một lúc.

#### Memory

Bộ nhớ là thiết bị lưu dữ liệu, trạng thái, lệnh,… trong mạch điện tử. RAM tương ứng với điều này. CPU chịu trách nhiệm tính toán và bộ nhớ chịu trách nhiệm về lưu trữ.

#### Timer

Thiết lập rằng nhiệm vụ phải được hoàn thành sau vài giây và giới hạn thời gian cho một chương trình cụ thể.

Tồn tại để hạn chế việc chạy các chương trình tốn thời gian.

#### Device Controller

Một CPU nhỏ của các IO Device được kết nối với máy tính.

## Booting

Quá trình khởi động của hệ điều hành như sau:

![Pasted image 20230601160506](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601160506.png)

1. Bật nguồn máy tính.  
2. Bộ xử lý (CPU) đọc dữ liệu từ ROM.
	- ROM bao gồm POST (Power-On Self-Test) và Boot loader.
3. POST kiểm tra trạng thái hiện tại của máy tính, nếu có lỗi quá trình sẽ bị dừng.
4. Boot loader chạy và tìm hệ điều hành được lưu trữ trên hard disk và đưa nó vào RAM.
