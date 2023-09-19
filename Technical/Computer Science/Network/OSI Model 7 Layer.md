---
categories: [network, computer-science]
title: OSI Model 7 Layer
date created: 2023-04-30
date modified: 2023-09-17
tags: [network, computer-science]
---

# OSI Model

## Mô hình OSI là gì? 🧐

**Mô hình OSI** (**Open Systems Interconnection Reference Model**) dịch là **mô hình tham chiếu kết nối các hệ thống mở**

Mô hình OSI gồm 7 tầng do Tổ chức Tiêu chuẩn hóa Quốc tế (ISO: International Organization for Standardiztion) phát triển, giải thích thiết kế và truyền thông giao thức mạng máy tính bằng cách chia chúng thành các tầng.

![Pasted image 20230525101959](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230525101959.png)

Nói một cách đơn giản, nó có nghĩa là quá trình giao tiếp trong mạng được chia thành 7 bước. Giao thức cũng được tổ chức theo tầng theo mô hình phân tầng. Đây là một mô hình làm cơ sở cho các hệ thống mạng hiện tại và các hệ thống khác nhau giao tiếp dựa trên mô hình phân tầng này.

> Hiểu theo hướng lập trình thì mô hình OSI như là một interface và sẽ được triển khai thực tế. Mô hình TCP/IP là ví dụ cho việc triển khai theo mô hình OSI!

## Tại sao phải phân cấp?

Lý do các hệ thống được quản lý bằng cách chia chúng thành các hệ thống phân cấp là vì bạn có thể hiểu từng bước của quá trình giao tiếp.

Ngoài ra, bằng cách phân tầng, mỗi tầng có thể đóng một vai trò độc lập. Đó là một phương pháp cho phép bạn xử lý công việc của mình một cách độc lập và tuân thủ tốt các quy tắc khi kết nối với các tầng khác. Sự phân tách vai trò này cho phép các vấn đề ở một tầng được giải quyết mà không ảnh hưởng đến các tầng khác.

Nói cách khác, việc bảo trì có thể được thực hiện suôn sẻ.

Mỗi tầng tiêu thụ từ tầng bên dưới nó và cung cấp cho tầng bên trên các chức năng của tầng hiện tại.

**Ví dụ**:

Công ty A gặp sự cố với tất cả các PC của Nhóm phát triển 1. → Đó có thể là sự cố bộ định tuyến (Network Layer) hoặc sự cố đường dây cung cấp mạng LAN quang (Physical Layer).

Mặt khác, nếu sự cố chỉ xảy ra trên PC của một người thuộc Nhóm phát triển 1 của Công ty A → Đó là sự cố với phần mềm được thực thi (Application) hoặc sự cố với switch (DataLink).

Trong trường hợp trên, nếu xác định được có vấn đề ở tầng đó thì các tầng khác không được động đến và chỉ có tầng xảy ra sự cố đang tiến hành khắc phục.

## OSI 7 Layer

![Pasted image 20230524193948](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230524193948.png)

### 1st Layer - Physical

Tầng Physical theo nghĩa đen bao gồm các công nghệ vận chuyển phần cứng vật lý.  
Nó phục vụ việc gửi và nhận tín hiệu điện và giao tiếp theo đơn vị **BIT** (0 và 1).  
Dữ liệu được truyền qua cáp truyền thông sử dụng các đặc tính điện, cơ và chức năng.

Tầng này không quan tâm dữ liệu là gì hay có lỗi xảy ra hay không, nó chỉ gửi hoặc nhận dữ liệu.  
Nó chuyển đổi dữ liệu thành tín hiệu điện và truyền và nhận chúng.

Thiết bị: Cable, repeater, hub, v.v.

**Tầng này truyền dữ liệu điện qua cáp, repeater, hub**

### 2nd Layer - DataLink

Tầng DataLink quản lý các lỗi và luồng dữ liệu được gửi và nhận ở tầng Physical.  
Đây là tầnng chuyển đổi tín hiệu trả lời vật lý có khả năng gây nhiễu thành kênh liên lạc mà không có lỗi truyền để có thể sử dụng đáng tin cậy ở Layer 3 (Network).

Ở tầng này, giao tiếp bằng địa chỉ MAC.  
Nó được truyền theo đơn vị **FRAME** và thông tin nhận được từ lớp vật lý kèm theo địa chỉ MAC thông qua các thiết bị như bridge và switch.  
Frame là một nhóm dữ liệu xem như là đơn vị truyền ở tầng này.

Tầng DataLink chịu trách nhiệm kiểm soát luồng và kiểm soát lỗi.  
Kiểm soát luồng là để đảm bảo sự khác biệt về tốc độ giữa gửi và nhận dữ liệu.  
Kiểm soát lỗi phát hiện và sửa lỗi truyền trong lớp vật lý.  
Nó cũng truyền lại các gói không được nhận chính xác.

Nó cũng chịu trách nhiệm sắp xếp thứ tự, nghĩa là gán số sê-ri cho các gói (packet) hoặc ACK.

Tầng DataLink đảm bảo đường truyền đáng tin cậy giữa các node (Point to Point).  
Có nhiều giao thức khác nhau như HDLC, Ethernet, wireless LAN, mobile communication và ATM, v.v

Thiết bị : bridge và switch

**Phát hiện lỗi, truyền lại, điều khiển luồng, sắp xếp thứ tự, v.v. của dữ liệu trong tầng physical sẽ tạo ra một frame đáng tin cậy và truyền frame bằng cách gán địa chỉ MAC cho nó.**

### 3rd Layer - Network

Chức năng quan trọng nhất ở tầng Network là khả năng chuyển dữ liệu đến đích một cách an toàn và nhanh chóng. **(theo lộ trình)**  
Nó là tầng cung cấp địa chỉ IP mà chúng ta thường biết, và có nhiều loại giao thức được sử dụng ở đây và các phương pháp định tuyến khác nhau.

Đơn vị của tầng Network là **PACKET** hay là gói tin.

Các tuyến được chọn thông qua các thuật toán định tuyến để xác định địa chỉ và chuyển tiếp các gói dọc theo các tuyến.  
Bộ định tuyến (router) được sử dụng chủ yếu, nhưng gần đây cũng có các bộ chuyển mạch L3 (switch) được trang bị chức năng định tuyến giữa các thiết bị L2.

Tầng Network đóng vai trò tìm đường mỗi khi nó đi qua một số node.  
Nó cung cấp các phương tiện chức năng và thủ tục để truyền dữ liệu có độ dài khác nhau qua mạng và trong quá trình đó, Quality of Service (QoS) theo yêu cầu của tầng Transport.

Tầng này thực hiện định tuyến (kiểm soát đường dẫn), kiểm soát luồng, kiểm soát lỗi, phân đoạn, kết nối mạng, v.v.  
Địa chỉ logic **(IP)** là địa chỉ có cấu trúc được chỉ định trực tiếp từ network manager và có thứ bậc.

Thiết bị: Router, L3 switch, IP router, v.v.

**Định tuyến chọn đường dẫn tối ưu để chuyển tiếp các gói và gán địa chỉ IP**

### 4th Layer - Transport

Đây là tầng mà cho phép giao tiếp end to end. Vì vậy, nó là tầng cốt lõi nhất và nó cũng là một tầng phức tạp.  
Nó thường sử dụng giao thức TCP và mở các cổng để các ứng dụng có thể truyền tải.  
Nếu dữ liệu được nhận từ tầng dưới, tầng này sẽ tổng hợp dữ liệu và truyền nó lên tầng trên.

Đơn vị của tầng này là **SEGMENT**.

Thiết lập kết nối giữa các tiến trình (process) đang chạy trên máy chủ không nối mạng.  
Nó hỗ trợ giao tiếp đầu cuối (end to end) giữa máy chủ và các tiến trình ứng dụng ở cả hai đầu.

Tầng Transport cho phép dữ liệu được truyền giữa hai đầu.  
Thông tin được truyền giữa Session Layer - Transport Layer - Network Layer mà không làm thay đổi nội dung bất kể phương pháp điều khiển nào được sử dụng ở tầng trên hay tầng dưới.

Tầng vận chuyển sử dụng sơ đồ kiểm soát lỗi dựa trên số thứ tự (sequence number). Nó cũng kiểm soát tính hợp lệ của các kết nối cụ thể.  
Một số giao thức có trạng thái (stateful) và hướng kết nối (connection oriented).  
Điều này có nghĩa là lớp vận chuyển xác minh rằng các gói hợp lệ để truyền và truyền lại các gói không truyền được.

Giao thức: TCP, UDP, SCTP, v.v.

**Tầng thấp nhất xử lý giao tiếp đầu cuối (End to End), truyền dữ liệu hiệu quả và đáng tin cậy giữa đầu cuối, thực hiện phát hiện và khôi phục lỗi, kiểm soát luồng và kiểm tra dự phòng**

### 5th Layer - Session

Một kết nối logic cho dữ liệu để giao tiếp. (Nó còn được gọi là cổng giao tiếp.)  
Tuy nhiên, vì kết nối có thể được thiết lập và kết thúc ngay cả trong tầng transport, là tầng ngay bên dưới nó, nên có một giới hạn để xác định chính xác tầng nào mà giao tiếp đã bị ngắt kết nối.  
Vì vậy, tầng session nên được xem từ quan điểm ứng dụng độc lập với lớp vận chuyển.

Các chức năng chính của nó là thiết lập phiên, duy trì, kết thúc, khôi phục trong trường hợp gián đoạn truyền, v.v.  
Lớp Session cung cấp một cách để các tiến trình ứng dụng ở cả hai đầu quản lý các giao tiếp.  
Có các giao tiếp như duplex, half-duplex, and full-duplex và nó thực hiện check-pointing, idle, shutdown, và restart process.  
Tầng này chịu trách nhiệm tạo và huỷ các phiên TCP/IP.

**Đồng bộ hóa người dùng giao tiếp và hàng loạt lệnh khôi phục lỗi. Thiết lập/duy trì/dừng phiên giao tiếp.**

### 6th Layer - Presentation

Biểu diễn dữ liệu cung cấp tính độc lập với các tiến trình ứng dụng khác và mã hóa nó.

Tầng presentation chịu trách nhiệm dịch giữa các mã, giảm tải cho tầng application xử lý các khác biệt chính về dữ liệu trong hệ thống của người dùng.  
Các hoạt động như mã hóa MIME và mã hóa diễn ra ở tầng này.  
Ví dụ: nó thực hiện các chức năng như chuyển đổi tệp tài liệu sang bảng mã ASCII và phân biệt xem dữ liệu là TEXT, GIF hay JPG.

**Hoàn thành lệnh của người dùng và trình bày kết quả. Thực hiện các chức năng đóng gói/nén/mã hóa**

### 7th Layer - Application

Điểm đến cuối cùng là một giao thức như HTTP, FTP hoặc POP3.  
Các gói truyền thông được xử lý bởi các giao thức được liệt kê ở trên và các trình duyệt cũng như thư là những ứng dụng giúp bạn dễ dàng sử dụng các giao thức này.  
Nghĩa là, cả hai đầu của mọi giao tiếp đều là các giao thức như HTTP.

Tầng application liên quan trực tiếp đến tiến trình ứng dụng để thực hiện các dịch vụ ứng dụng chung.  
Một dịch vụ ứng dụng điển hình cung cấp sự chuyển đổi giữa các tiến trình ứng dụng liên quan.  
Cung cấp giao diện người dùng hướng tới người dùng cho một số đối tượng giao thức truyền thông cơ bản.  
Nó thường thực hiện các chức năng như chuyển tập tin và trao đổi tin nhắn.

Giao thức: HTTP, FTP, SMTP, POP3, IMAP, Telnet, v.v.

**Chịu trách nhiệm về phần UI của phần mềm mạng và phần đầu vào/đầu ra (I/O) của người dùng**

## Frame Packet Segment Datagram

### PDU (Protocol Data Unit)

![Pasted image 20230526151239](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230526151239.png)

Đơn vị dữ liệu giao thức. Trong giao tiếp dữ liệu, nó đề cập đến thông tin điều khiển được gắn với dữ liệu được truyền bởi lớp trên. Nó là đơn vị dữ liệu trong mỗi lớp.

- Physical Layer: Bit
- DataLink Layer: Frame
- Network Layer: Packet
- Transport Layer: Segment
- Session, Presentation, Application Layer: Message (Data)

**Đóng gói dữ liệu**

![Pasted image 20230526151551](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230526151551.png)

PDU bao gồm SDU(Service Data Unit) và PCI(Protocol Control Information). SDU là dữ liệu được truyền, PCI là thông tin điều khiển. PCI bao gồm địa chỉ người gửi và người nhận, mã phát hiện lỗi và thông tin kiểm soát giao thức. Thêm thông tin điều khiển vào dữ liệu được gọi là đóng gói (Encapsulation).

Nói cách khác, đóng gói đề cập đến chức năng gói dữ liệu được truyền trong một thứ khác để truyền qua một mạng nhất định, sau đó bóc phần được bọc và truyền dữ liệu đó khi truyền qua mạng.
