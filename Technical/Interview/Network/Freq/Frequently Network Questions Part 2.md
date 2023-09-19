---
title: Frequently Network Questions Part 2
tags:
  - network
  - interview
categories: " network, interview"
date created: 2023-09-18
date modified: 2023-09-18
---

# Tổng hợp các câu hỏi phỏng vấn mạng máy tính thường gặp (Phần 2)

## TCP và UDP

### Sự khác biệt giữa TCP và UDP (Quan trọng)

1. **Có phải là hướng kết nối hay không**: UDP không cần thiết lập kết nối trước khi truyền dữ liệu. Trong khi đó, TCP cung cấp dịch vụ dựa trên kết nối, yêu cầu thiết lập kết nối trước khi truyền dữ liệu và phải giải phóng kết nối sau khi truyền dữ liệu.
2. **Có đáng tin cậy hay không**: Sau khi nhận được gói tin UDP, máy chủ từ xa không cần phải xác nhận và không đảm bảo không mất dữ liệu và không đảm bảo thứ tự đến. TCP cung cấp dịch vụ truyền tin cậy, trước khi truyền dữ liệu, TCP sẽ thiết lập kết nối thông qua ba bước bắt tay và trong quá trình truyền dữ liệu, có cơ chế xác nhận, cửa sổ, truyền lại và kiểm soát tắc nghẽn. Dữ liệu được truyền qua kết nối TCP không có lỗi, không mất mát, không trùng lặp và đến theo thứ tự.
3. **Có trạng thái hay không**: Điều này tương ứng với "Có đáng tin cậy hay không". TCP là dịch vụ có trạng thái, điều này có nghĩa là TCP sẽ ghi lại trạng thái gửi tin nhắn của mình, ví dụ: tin nhắn đã được gửi, đã được nhận, v.v. Để làm điều này, TCP cần duy trì bảng trạng thái kết nối phức tạp. UDP là dịch vụ không có trạng thái, đơn giản là không quan tâm sau khi gửi đi.
4. **Hiệu suất truyền**: Vì TCP sử dụng các cơ chế kết nối, xác nhận, truyền lại, v.v. nên hiệu suất truyền của TCP thấp hơn nhiều so với UDP.
5. **Hình thức truyền**: TCP là dựa trên luồng byte, UDP là dựa trên đoạn dữ liệu.
6. **Chi phí tiêu đề**: Tiêu đề TCP có kích thước lớn hơn (20-60 byte) so với tiêu đề UDP (8 byte).
7. **Có cung cấp dịch vụ broadcast hoặc multicast không**: TCP chỉ hỗ trợ truyền point-point, UDP hỗ trợ 1-to-1, 1-to-many, many-to-1 và many-to-many.  
8…….

Tham khảo bảng sau để tóm gọn nội dung trên!  

|                                                    | TCP        | UDP          |
| -------------------------------------------------- | ---------- | ------------ |
| Có phải là hướngs kết nối hay không                | Có         | Không        |
| Có đáng tin cậy                                    | Có         | Không        |
| Có trạng thái                                      | Có         | Không        |
| Hiệu suất truyền                                   | Chậm       | Nhanh        |
| Hình thức truyền                                   | Luồng byte | Đoạn dữ liệu |
| Chi phí tiêu đề                                    | 20-60 byte | 8 byte       |
| Có cung cấp dịch vụ broadcast hoặc multicast không | Không      | Có           |

### Khi nào chọn TCP, khi nào chọn UDP?

- **UDP thường được sử dụng cho truyền thông trực tiếp**, ví dụ: âm thanh, video, truyền trực tiếp, v.v. Những tình huống này không đòi hỏi độ chính xác cao trong việc truyền dữ liệu, ví dụ: khi xem video, ngay cả khi mất một hoặc hai khung hình, sự khác biệt thực tế không lớn.
- **TCP được sử dụng cho các tình huống đòi hỏi độ tin cậy cao trong việc truyền dữ liệu**, ví dụ: truyền tập tin, gửi và nhận email, đăng nhập từ xa, v.v.

### HTTP dựa trên TCP hay UDP?

**Câu trả lời cũ:**  
~~**Giao thức HTTP dựa trên giao thức TCP**, vì vậy trước khi gửi yêu cầu HTTP, trước tiên phải thiết lập kết nối TCP thông qua ba bước bắt tay.~~

Trước HTTP/3.0, HTTP dựa trên giao thức TCP. Tuy nhiên, HTTP/3.0 sẽ không sử dụng TCP mà thay vào đó sử dụng **giao thức QUIC dựa trên UDP**.

Thay đổi này giải quyết vấn đề chặn đầu hàng (HOL Blocking) trong HTTP/2.0. Chặn đầu hàng là khi nhiều yêu cầu và phản hồi HTTP chia sẻ một kết nối TCP, nếu một yêu cầu hoặc phản hồi bị chặn do tắc nghẽn mạng hoặc mất gói tin, các yêu cầu hoặc phản hồi tiếp theo cũng không thể gửi, dẫn đến hiệu suất kết nối giảm. HTTP/3.0 giải quyết vấn đề chặn đầu hàng một phần bằng cách thiết lập nhiều luồng dữ liệu riêng biệt trên một kết nối, các luồng dữ liệu này không ảnh hưởng lẫn nhau (cơ bản là kết hợp nhiều đường truyền + tuần tự hóa).

Ngoài việc giải quyết vấn đề chặn đầu hàng, HTTP/3.0 cũng giảm thiểu độ trễ trong quá trình bắt tay. Trong HTTP/2.0, để thiết lập một kết nối HTTPS an toàn, cần ba bước bắt tay TCP và một bước bắt tay TLS:

1. Bắt tay TCP: Khách hàng và máy chủ trao đổi gói SYN và ACK để thiết lập một kết nối TCP. Quá trình này mất 1,5 RTT (thời gian đi và về của một gói tin).
2. Bắt tay TLS: Khách hàng và máy chủ trao đổi khóa và chứng chỉ để thiết lập một lớp mã hóa TLS. Quá trình này mất ít nhất 1 RTT (TLS 1.3) hoặc 2 RTT (TLS 1.2).

Vì vậy, việc thiết lập kết nối trong HTTP/2.0 yêu cầu ít nhất 2,5 RTT (TLS 1.3) hoặc 3,5 RTT (TLS 1.2). Trong HTTP/3.0, sử dụng giao thức QUIC (TLS 1.3, TLS 1.3 hỗ trợ cả 0 RTT và 1 RTT) chỉ cần 0-RTT hoặc 1-RTT để thiết lập kết nối mới, điều này có nghĩa là QUIC không cần thời gian trễ bổ sung để thiết lập kết nối mới.

Tham khảo thông tin trong hai liên kết sau:

- https://en.wikipedia.org/wiki/HTTP/3
- https://datatracker.ietf.org/doc/rfc9114/

### Các giao thức sử dụng TCP là gì? Các giao thức sử dụng UDP là gì?

**Các giao thức chạy trên TCP**:

1. **Giao thức HTTP**: Giao thức truyền tải siêu văn bản (HTTP, HyperText Transfer Protocol) là một giao thức được thiết kế để truyền tải siêu văn bản và nội dung đa phương tiện, chủ yếu được sử dụng để giao tiếp giữa trình duyệt web và máy chủ web. Khi chúng ta sử dụng trình duyệt để duyệt web, trang web được tải thông qua yêu cầu HTTP.
2. **Giao thức HTTPS**: Giao thức truyền tải siêu văn bản an toàn hơn (HTTPS, Hypertext Transfer Protocol Secure) là một phiên bản của giao thức HTTP được bảo mật bằng SSL.
3. **Giao thức FTP**: Giao thức truyền tải tập tin (FTP, File Transfer Protocol) là một giao thức được sử dụng để truyền tải tập tin giữa các máy tính, có thể ẩn đi sự khác biệt giữa các hệ điều hành và cách lưu trữ tập tin. Lưu ý: FTP là một giao thức không an toàn vì nó không mã hóa dữ liệu trong quá trình truyền tải. Đề nghị sử dụng giao thức an toàn hơn như SFTP khi truyền tải dữ liệu nhạy cảm.
4. **Giao thức SMTP**: Giao thức truyền tải thư đơn giản (SMTP, Simple Mail Transfer Protocol) là một giao thức được sử dụng để gửi thư điện tử. Lưu ý: Giao thức SMTP chỉ đảm nhận việc gửi thư, không phải nhận thư. Để nhận thư từ máy chủ thư, cần sử dụng giao thức POP3 hoặc IMAP.
5. **Giao thức POP3/IMAP**: Cả hai đều là giao thức dùng để nhận thư. IMAP là một giao thức nâng cao hơn so với POP3, nó mạnh mẽ hơn về chức năng và hiệu suất. IMAP hỗ trợ tìm kiếm thư, đánh dấu, phân loại, lưu trữ và đồng bộ trạng thái thư qua nhiều thiết bị. Hầu hết các khách hàng và máy chủ thư hiện đại đều hỗ trợ IMAP.
6. **Giao thức Telnet**: Dùng để đăng nhập từ xa vào một máy chủ thông qua một thiết bị cuối. Một trong những nhược điểm lớn của giao thức Telnet là tất cả dữ liệu (bao gồm tên người dùng và mật khẩu) được gửi dưới dạng văn bản không mã hóa. Đây là lý do tại sao hiện nay ít sử dụng Telnet và thay vào đó sử dụng giao thức truyền tải mạng an toàn hơn gọi là SSH.
7. **Giao thức SSH**: SSH (Secure Shell) là một giao thức mạng an toàn được sử dụng chủ yếu cho phiên đăng nhập từ xa và các dịch vụ mạng khác. Sử dụng SSH, có thể ngăn chặn thông tin rò rỉ trong quá trình quản lý từ xa. SSH được xây dựng trên giao thức truyền tải đáng tin cậy TCP.  
8…….

**Các giao thức chạy trên UDP**:

1. **Giao thức DHCP**: Giao thức cấu hình máy chủ động (DHCP, Dynamic Host Configuration Protocol) là một giao thức được sử dụng để cấu hình địa chỉ IP động.
2. **DNS**: **Hệ thống tên miền (DNS, Domain Name System) chuyển đổi tên miền dễ đọc của con người (ví dụ: www.google.com) thành địa chỉ IP dễ đọc của máy chủ (ví dụ: 216.58.217.36).** Có thể hiểu nó như một cuốn danh bạ được thiết kế cho Internet. Thực tế, DNS hỗ trợ cả giao thức UDP và TCP.  
3…….

### TCP Three-Way Handshake và Four-Way Handshake (Rất quan trọng)

**Các câu hỏi liên quan**:

- Tại sao cần có ba lần bắt tay?
- Tại sao phải gửi lại SYN trong lần bắt tay thứ hai sau khi đã gửi ACK?
- Tại sao cần bốn lần chia tay?
- Tại sao không thể kết hợp ACK và FIN mà máy chủ gửi thành một lần chia tay ba lần?
- Nếu ACK của máy chủ không được gửi đến máy khách trong lần chia tay thứ hai, điều gì sẽ xảy ra?
- Tại sao máy khách cần chờ 2 * MSL (tuổi thọ gói tin tối đa) trước khi chuyển sang trạng thái CLOSED sau lần chia tay thứ tư?

**Câu trả lời tham khảo**:

### Làm thế nào TCP đảm bảo tính tin cậy của việc truyền tải? (Quan trọng)

Vui lòng đọc: [[TCP Reliability Guarantee]]

## IP

### Vai trò của giao thức IP là gì?

**IP (Internet Protocol, Giao thức Internet)** là một trong những giao thức quan trọng nhất trong giao thức TCP/IP, thuộc tầng mạng, có vai trò chính là định nghĩa định dạng gói dữ liệu, định tuyến và địa chỉ hóa gói dữ liệu để chúng có thể được truyền qua mạng và đến đúng đích.

Hiện tại, IP chủ yếu được chia thành hai phiên bản, một là IPv4 đã được sử dụng từ trước đến nay, một là IPv6 mới hơn, hiện tại cả hai phiên bản này đều đang được sử dụng, nhưng IPv6 đã được đề xuất để thay thế IPv4.

### IP Address là gì? Cách hoạt động của địa chỉ IP?

Mỗi thiết bị hoặc miền kết nối vào Internet đều được gán một **địa chỉ IP (Internet Protocol address)** làm định danh duy nhất. Mỗi địa chỉ IP là một chuỗi ký tự, ví dụ: 192.168.1.1 (IPv4), 2001:0db8:85a3:0000:0000:8a2e:0370:7334 (IPv6).

Khi thiết bị mạng gửi gói tin IP, gói tin chứa **địa chỉ IP nguồn** và **địa chỉ IP đích**. Địa chỉ IP nguồn được sử dụng để xác định thiết bị hoặc miền gửi gói tin, trong khi địa chỉ IP đích được sử dụng để xác định thiết bị hoặc miền nhận gói tin. Điều này tương tự như một lá thư có địa chỉ đích và địa chỉ trả lời.

Các thiết bị mạng sẽ dựa vào địa chỉ IP đích để xác định đích đến của gói tin và chuyển tiếp gói tin đến mạng hoặc mạng con đích, từ đó thực hiện việc giao tiếp giữa các thiết bị.

Cách tiếp cận dựa trên địa chỉ IP là cơ sở của việc giao tiếp trên Internet, cho phép gói tin được chuyển tiếp qua các mạng khác nhau, từ đó đạt được kết nối mạng toàn cầu. Tính duy nhất và tính toàn cầu của địa chỉ IP đảm bảo rằng mỗi thiết bị trong mạng có thể được xác định và xử lý bằng địa chỉ IP duy nhất của nó.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230918181510.png)

### IP Address Filtering là gì?

**IP Address Filtering (Lọc địa chỉ IP)** đơn giản là giới hạn hoặc chặn quyền truy cập từ các địa chỉ IP cụ thể hoặc dải địa chỉ IP. Ví dụ, nếu một địa chỉ IP tấn công dịch vụ hình ảnh của bạn, bạn có thể cấm địa chỉ IP đó truy cập vào dịch vụ hình ảnh.

Lọc địa chỉ IP là một biện pháp bảo mật mạng đơn giản, thực tế thường được kết hợp với các biện pháp bảo mật mạng khác như xác thực, ủy quyền, mã hóa, v.v. Sử dụng lọc địa chỉ IP một mình không đảm bảo an ninh mạng toàn diện.

### Sự khác nhau giữa IPv4 và IPv6 là gì?

**IPv4 (Internet Protocol version 4)** là phiên bản địa chỉ IP phổ biến hiện nay, định dạng của nó là bốn nhóm số được phân tách bằng dấu chấm, ví dụ: 123.89.46.72. IPv4 sử dụng địa chỉ 32 bit làm địa chỉ Internet của nó, có khoảng 4,2 tỷ (2^32) địa chỉ IP khả dụng.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230918181615.png)

Đương nhiên, số lượng này không đủ! Để giải quyết vấn đề cạn kiệt địa chỉ IP, giải pháp cơ bản nhất là sử dụng phiên bản IP mới với không gian địa chỉ lớn hơn - **IPv6 (Internet Protocol version 6)**. Địa chỉ IPv6 sử dụng định dạng phức tạp hơn, sử dụng một nhóm số và chữ cái được phân tách bằng dấu hai chấm hoặc dấu hai chấm kép, ví dụ: 2001:0db8:85a3:0000:0000:8a2e:0370:7334. IPv6 sử dụng địa chỉ Internet 128 bit, có khoảng 2^128 (39 chữ số bắt đầu bằng 3, kinh khủng như vậy) địa chỉ IP khả dụng.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230918181645.png)

Ngoài không gian địa chỉ lớn hơn, IPv6 còn có những ưu điểm như:

- **Tự động cấu hình địa chỉ không trạng thái (Stateless Address Autoconfiguration - SLAAC)**: Thiết bị có thể tự động tạo địa chỉ IPv6 duy nhất toàn cầu bằng cách kết hợp định danh giao diện và tiền tố mạng, mà không cần phụ thuộc vào máy chủ DHCP (Dynamic Host Configuration Protocol), giúp đơn giản hóa cấu hình và quản lý mạng.
- **NAT (Network Address Translation, Chuyển đổi địa chỉ mạng) trở thành tùy chọn**: Tài nguyên địa chỉ IPv6 phong phú, có thể cung cấp cho mỗi thiết bị trên toàn cầu một địa chỉ riêng.
- **Cải tiến cấu trúc tiêu đề**: Cấu trúc tiêu đề IPv6 đơn giản hơn và hiệu quả hơn so với IPv4, giảm thiểu chi phí xử lý và cải thiện hiệu suất mạng.
- **Tiêu đề mở rộng tùy chọn**: Cho phép thêm các tiêu đề mở rộng khác nhau vào tiêu đề IPv6 để triển khai các chức năng và tùy chọn khác nhau.
- **ICMPv6 (Internet Control Message Protocol for IPv6)**: ICMPv6 trong IPv6 cải tiến so với ICMP trong IPv4, bao gồm cải tiến các chức năng như khám phá hàng xóm, khám phá MTU đường truyền, tăng cường độ tin cậy và hiệu suất mạng.
- ……

### NAT có vai trò gì?

**NAT (Network Address Translation, Chuyển đổi địa chỉ mạng)** chủ yếu được sử dụng để chuyển đổi địa chỉ IP giữa các mạng khác nhau. Nó cho phép ánh xạ địa chỉ IP riêng tư (như địa chỉ IP được sử dụng trong mạng nội bộ) thành địa chỉ IP công khai (địa chỉ IP được sử dụng trên Internet) hoặc ngược lại, từ đó thực hiện việc nhiều thiết bị trong mạng nội bộ có thể truy cập Internet thông qua một địa chỉ IP công khai duy nhất.

NAT không chỉ giúp giảm thiểu vấn đề cạn kiệt địa chỉ IPv4, mà còn giúp ẩn danh cấu trúc mạng nội bộ, không cho phép mạng bên ngoài truy cập trực tiếp vào các thiết bị trong mạng nội bộ, từ đó nâng cao tính bảo mật của mạng nội bộ.

![NAT thực hiện chuyển đổi địa chỉ IP](https://raw.githubusercontent.com/vanhung4499/images/master/snap/network-address-translation.png)

## ARP

### MAC Address là gì?

MAC Address (Media Access Control Address) là địa chỉ kiểm soát truy cập phương tiện. Trong khi mỗi tài nguyên trên Internet được định danh bằng địa chỉ IP duy nhất, mỗi thiết bị mạng được định danh bằng địa chỉ MAC duy nhất.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230918182115.png)

Có thể hiểu rằng địa chỉ MAC là số CMND thực sự của một thiết bị mạng, trong khi địa chỉ IP chỉ là một cách định vị không trùng lặp (ví dụ: John sống tại số nhà 123 đường ABC, địa chỉ IP là địa chỉ IP của John, số CMND mới là địa chỉ MAC của John). Địa chỉ MAC cũng có một số tên gọi khác như địa chỉ LAN, địa chỉ vật lý, địa chỉ Ethernet, v.v.

> Một điểm cần lưu ý là không chỉ tài nguyên mạng mới có địa chỉ IP, các thiết bị mạng cũng có địa chỉ IP, ví dụ như router. Tuy nhiên, theo cấu trúc, vai trò của các thiết bị mạng như router là hình thành một mạng, thường là mạng nội bộ, nên địa chỉ IP mà chúng sử dụng thường là địa chỉ IP nội bộ. Khi các thiết bị trong mạng nội bộ giao tiếp với các thiết bị bên ngoài mạng nội bộ, chúng cần sử dụng giao thức NAT.

Địa chỉ MAC có độ dài 6 byte (48 bit) và có không gian địa chỉ lên đến 2^48 (hơn 280 nghìn tỷ tỷ). Địa chỉ MAC được quản lý và phân phối bởi IEEE. Lý thuyết, địa chỉ MAC trên card mạng của một thiết bị là vĩnh viễn. Các nhà sản xuất card mạng mua không gian địa chỉ MAC của mình từ IEEE (24 bit đầu của địa chỉ MAC), đảm bảo rằng không có địa chỉ MAC nào bị trùng lặp. Còn 24 bit sau được quản lý bởi các nhà sản xuất, đảm bảo rằng các card mạng sản xuất không có địa chỉ MAC trùng lặp.

Địa chỉ MAC có tính di động và vĩnh viễn. Số CMND là một số duy nhất xác định vĩnh viễn danh tính của một người, không thay đổi dù người đó ở đâu. Trong khi địa chỉ IP không có tính chất này, khi một thiết bị chuyển mạng, địa chỉ IP của nó có thể thay đổi, có nghĩa là vị trí của nó trên Internet đã thay đổi.

Cuối cùng, hãy nhớ rằng địa chỉ MAC có một địa chỉ đặc biệt: FF-FF-FF-FF-FF-FF (địa chỉ toàn 1), địa chỉ này đại diện cho địa chỉ broadcast.

### ARP giải quyết vấn đề gì và trạng thái của nó?

ARP (Address Resolution Protocol) giải quyết vấn đề chuyển đổi giữa địa chỉ mạng và địa chỉ liên kết. Vì một datagram IP cần biết địa chỉ tiếp theo (đích vật lý tiếp theo trên đường truyền vật lý), nhưng địa chỉ IP thuộc về địa chỉ logic, trong khi địa chỉ MAC mới là địa chỉ vật lý. ARP giải quyết một số vấn đề liên quan đến chuyển đổi địa chỉ IP sang địa chỉ MAC.

### Nguyên tắc hoạt động của ARP là gì?

> TODO

