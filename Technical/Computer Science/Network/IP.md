---
categories: [network, computer-science]
title: IP
date created: 2023-05-25
date modified: 2023-07-10
tags: [network, computer-science]
---

## IP là gì?

**IP (Internet Protocol)** định nghĩa là **Giao thức Internet** là một giao thức hướng dữ liệu được sử dụng bởi các máy chủ nguồn và đích để truyền dữ liệu trong một liên mạng chuyển mạch gói.

**IP Address** là địa chỉ giao thức của internet. Nó tương tự như địa chỉ nhà hay địa chỉ doanh nghiệp vậy. Các thiết bị phần cứng trong mạng muốn kết nối và giao tiếp với nhau được đều phải có địa chỉ IP.

![Pasted image 20230525164039](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230525164039.png)

## IPv4

### IPv4 Protocol

Giao thức IPv4 là một dịch vụ vận chuyển nỗ lực tối đa không kết nối, không đáng tin cậy. Nỗ lực tốt nhất có nghĩa là các gói IPv4 có thể bị mất hoặc không đúng thứ tự.

Nếu độ tin cậy là quan trọng, IPv4 nên được sử dụng cùng với một giao thức tầng vận chuyển đáng tin cậy như TCP.

### IPv4 Datagram

Datagram của IPv4 là một gói có độ dài thay đổi và bao gồm một header và Payload(Data).

Header dài từ 20 đến 60 byte và chứa thông tin liên quan đến truyền tải như định tuyến.

![Pasted image 20230525164154](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230525164154.png)

Chức năng của từng trường trong IPv4 như sau.

| Field | Ý nghĩa |
| -- | -- |
| Version | Cho biết phiên bản của giao thức IP, IPv4 có giá trị là 4 |
| Header Length | Gói IPv4 có Header thay đổi và người nhận dùng giá trị này để kiểm tra tổng độ dài. |
| Type of Service | Gồm 8 bit và xác định cách router sẽ xử lý datagram. |
| Datagram Length (bytes) | Chiếm 16 bit, là tổng kích thước của IP Datagram (header + data), tính theo byte|
| 16-bit Identifier, Flags, 13-bit Fragmentation offset | Ba trường này liên quan đến việc phân mảnh các gói dữ liệu IP được yêu cầu khi kích thước gói dữ liệu lớn hơn mạng con có thể xử lý. |
| Time-to-live | Số lượng router tối đa mà Datagram có thể truy cập. |
| Upper-layer Protocol | Khi gói dữ liệu đến đích, nó sẽ cho biết tải trọng sẽ được gửi đến giao thức nào. |
| Header checksum | IP sử dụng checksum để kiểm tra header |
| 32-bit Source IP address, 32-bit Destination IP address | Địa chỉ IP nguồn và đích có độ dài 32 bit. |
| Options (if any) | Datagram Header có thể có các tùy chọn lên đến 40 byte. Tùy chọn không bắt buộc. |
| Data | Payload(Data) |

### IPv4 Address

Địa chỉ IPv4 là một địa chỉ IP phổ biến được sử dụng ngày nay.

|Base|IP Address|
|---|---|
|2 Bin|11000000 10101000 00000000 00000001|
|**10 Dec** |**192.168.0.1**|
|16 Hex|C0 A8 00 01|

Địa chỉ IPv4 có thể được biểu thị như trên trong hệ thống địa chỉ 32 bit và thường được biểu thị bằng số thập phân và `.` .

Khi được biểu thị dưới dạng số thập phân, nó được sử dụng bằng cách chia nó thành cách nhóm 8 bit, do đó, nó có thể được biểu thị bằng các số trong phạm vi từ 0 đến 255.

### IPv4 Spicial Address

IPv4 có các địa chỉ được sử dụng cho các mục đích đặc biệt.

| Address | Chức năng |
|---|---|
|Loopback| 127.0.0.8/8 là địa chỉ loopback. Các gói có địa chỉ này không rời khỏi máy chủ, chúng vẫn ở trên máy chủ. Nó thường được sử dụng cho mục đích thử nghiệm và trong số đó, địa chỉ 127.0.0.1 là địa chỉ được sử dụng nhiều nhất để thử nghiệm. |
|Limited-broadcast| 255.255.255.255/32 là địa chỉ broadcast bị hạn chế. Địa chỉ này cho phép máy chủ hoặc router gửi dữ liệu đến bất kỳ thiết bị nào trên mạng. Tuy nhiên, hầu hết các router chặn các gói này để chúng không thể được gửi đi. |
|This-host| 0.0.0.0/32 là địa chỉ this-host. Địa chỉ này đại diện cho mạng hiện tại và được sử dụng khi bạn không biết địa chỉ của chính mình. |
|Private| 10.0.0.0/8, 172.16.0.0/12 và 192.168.0.0/16 được dành làm địa chỉ privte. Những địa chỉ này không tồn tại trên Internet công cộng và chỉ dành cho mục đích sử dụng cá nhân. |
|Multicast| 224.0.0.0/4 được sử dụng cho mục đích phát đa hướng. |

## IPv6

### IPv6 Protocol

Giao thức IPv6 là phiên bản mới của giao thức internet được thiết kế để giải quyết tình trạng cạn kiệt địa chỉ trong IPv4, thay đổi hình dạng của gói IP và sửa đổi một số giao thức phụ trợ như ICMP.

### IPv6 Datagram

IPv6 Datagram bao gồm Header và Payload.

Header cơ bản chiếm 40 byte, còn Header mở rộng và Payload(Data) có thể chứa tới 65.535 byte.

![Pasted image 20230525173250](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230525173250.png)

Vai trò của từng trường trong IPv6 như sau:

|Field|기능|
|---|---|
|Version| Phiên bản IP. Với IPv6, nó có giá trị là 6.|
|Traffic class|Tương tự với Type of service của IPv4.|
|Flow label| Được sử dụng để cung cấp xử lý đặc biệt cho các luồng dữ liệu cụ thể. |
|Payload length| Là độ dài của IP Datagram không bao gồm header cơ bản. Do độ dài của header cơ bản của IPv6 được cố định ở 40 byte nên chỉ cần xác định độ dài của payload. |
|Next hdr| Xác định loại header mở rộng đầu tiên hoặc header theo sau header mặc định của datagram, tương tự như Upper-layer Protocol của IPv4.|
|Hop limit| Mục đích như trường Time-to-live của IPv4. |
|Source address(128bits), Destination address(128bits)| Địa chỉ nguồn và địa chỉ đích. |
|Data| Không giống như IPv4, Data (Payload) của IPv6 có cấu trúc và ý nghĩa khác. |

### IPv6 Datagram Payload (Data Field)

![Pasted image 20230525183656](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230525183656.png)

Một gói IPv6 bao gồm một header cơ bản và header mở rộng. Độ dài của header cơ bản được cố định ở mức 40 byte, nhưng có thể gắn tối đa 6 header mở rộng vào header cơ bản để cung cấp các chức năng bổ sung.

- Hop-by-hop
- Destination
- Source Routing
- Frgmentation
- Authentication
- ESP

### IPv6 Address

IPv6 Address là loại địa chỉ IP mới được phát minh để đối phó với tình trạng thiếu địa chỉ IP. Địa chỉ 32 bit (v4) hiện tại đã được mở rộng thành 128 bit (v6).

Hầu hết các thiết bị ngày nay có chức năng mạng (L3 Router, L4 Switch, PC, Server, v.v.) đều hỗ trợ cả địa chỉ IPv4 và IPv6 và đang dần chuyển sang hệ thống địa chỉ IPv6.

|Base|IP Address|
|---|---|
|2 Bin|1111111011110110 … 1111111100000000|
|**16 Hex**|**FEF6:BA98:7654:46E0:AFFF:F210:1124:00F1**|

Địa chỉ IPv6 được biểu thị bằng hệ thập lục phân vì chúng rất dài và chứa nhiều số `0`.  
Trong những trường hợp này, bạn có thể bỏ qua các số 0 đứng đầu và viết tắt. 0082 -> 82, 0FFE -> FFE và 0000 -> 0.

Nếu các nhóm chỉ bao gồm các số `0`, thì có thể bỏ qua

> FFFF:0:0:0:EEEE:AAAA:BBBB -> FFFF::EEEE:AAAA:BBBB

Việc viết tắt trên chỉ có thể được thực hiện một lần cho mỗi địa chỉ và chỉ có thể viết tắt một phần nếu có hai hoặc nhiều khu vực tiếp giáp chỉ có 0.

## Public IP, Private IP

### Public IP

- Địa chỉ IP do Nhà cung cấp dịch vụ Internet (ISP - Internet Service Provider) cung cấp, mở cho thế giới bên ngoài.
- Mỗi Public IP tồn tại độc nhất trên mạng Internet cho cả toàn cầu.
- Vì địa chỉ Public IP được mở ra bên ngoài nên có thể truy cập từ các PC khác được kết nối với Internet. Do đó, khi sử dụng địa chỉ Public IP, cần cài đặt tường lửa hoặc chương trình bảo mật.

### Private IP  

- Nó còn được gọi là IP cục bộ hoặc IP ảo là địa chỉ IP của mạng được cấp cho công ty hoặc tổ chức cho phép họ tạo mạng cục bộ riêng.
- Do vấn đề số lượng địa chỉ IPv4 hữu hạn, private IP là một IP được chia subnet, do đó, nó được các router cấp cho PC hoặc thiết bị trên mạng cục bộ.

 Trong số tất cả các dải IP, các dải sau đây được thiết lập là dải Private IP, do đó người dùng có thể tùy ý gán và sử dụng chúng và chúng không được kết nối với nhau trên Internet.

| Class | Scope |
|---|---|
| A class | 10.0.0.1 ~ 10.255.255.255     |
| B class | 172.16.0.1 ~ 172.31.255.255   |
| C class | 192.168.0.1 ~ 192.168.255.255 |

Phương thức gán địa chỉ IP trong công ty hay gia đình bằng Private IP và gán IP cố định cho router, v.v. rồi truy cập Internet đã trở nên phổ biến và hầu hết các thiết bị đầu cuối hiện nay đều được gán Private IP và truy cập Internet thông qua một router.

Router có một địa chỉ Public IP.  
PC hoặc laptop có địa chỉ private IP và có thể truy cập Internet thông qua router.

### Sự khác Private IP riêng và Public IP

|          | Public IP                             | Private IP                    |
| -------- | ------------------------------------- | ----------------------------- |
| Host     | Internet Service Provider (ISP)       | Router                        |
| Cấp phát | Máy chủ cá nhân hoặc công ty (router) | Thiết bị cá nhân hoặc công ty |
| Độc quyền | Duy nhất trên internet                | Duy nhất trong một mạng           |
| Truy cập  | Có thể truy cập Nội bộ/Bên ngoài      | Không có quyền truy cập bên ngoài |

### NAT

- **Network Address Translation** và đóng vai trò chuyển đổi pubic IP và private IP trong tầng network, lớp thứ ba của OSI.  
- Do thiếu địa chỉ trong IPv4, nó được sử dụng để lưu địa chỉ Public IP và chặn sự xâm nhập từ bên ngoài.

Có hai loại NAT: Basic NAT và NAPT, và NAT thường đề cập đến là phương pháp NAPT.

### NAPT

- NAPT viết tắt của **Network Address Port Translation**, một phương pháp trong đó nhiều thiết bị đầu cuối có địa chỉ private IP được kết nối với Internet thông qua một địa chỉ public IP duy nhất.  
- Nó được sử dụng cho mục đích lưu địa chỉ public IP và sử dụng quy tắc 1:N Translation. (1 = Puclic IP, Private N = IP)  
- Nếu bạn sử dụng phương pháp NAPT, bạn chỉ cần kết nối với Internet như sau.

![Pasted image 20230525194905](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230525194905.png)

#### (Private IP -> Public IP)

1. Khi một thiết bị đầu cuối có địa chỉ Private IP muốn truyền ra Internet, nó sẽ phân bổ một IP và public PORT cho IP và private PORT và tạo thông tin tương ứng trong NAT Binding Table.
2. Tham khảo Bảng ràng buộc NAT, địa chỉ IP riêng được chuyển đổi thành địa chỉ IP công cộng và được truyền ra Internet.

#### (Public IP -> Private IP)

3. Tham khảo NAT Binding Table, địa chỉ public IP được chuyển đổi thành địa chỉ private IP và được truyền đến thiết bị đầu cuối.

### Static IP

- Static IP được cấp phát cho máy tính  
- Sau khi được cấp phát, địa chỉ IP không thể được cấp phát cho thiết bị khác cho đến khi nó được trả lại.  
- Khi muốn vận hành một máy chủ trên Internet, bạn phải gán Public IP là IP tĩnh, nếu bạn không nhận được Public IP thì người khác không thể truy cập vào máy chủ của bạn, còn nếu bạn không cấp Static IP thì bạn sẽ không thể kết nối với máy chủ của người khác.

### Dynamic IP

- Thay vì cấp phát Static IP cho thiết bị, IP sẽ được cấp phát luân phiên giữa các IP còn lại khi sử dụng máy tính.
