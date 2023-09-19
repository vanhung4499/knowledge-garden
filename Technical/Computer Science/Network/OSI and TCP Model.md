---
title: OSI and TCP Model
tags:
  - network
  - computer-science
categories: network, computer-science
date created: 2023-09-17
date modified: 2023-09-17
---

# OSI and TCP/IP Model

## ## Mô hình OSI 7 tầng

**Mô hình OSI 7 tầng** là một mô hình phân lớp mạng được đề xuất bởi Tổ chức Tiêu chuẩn Hóa Quốc tế (ISO). Cấu trúc chung và chức năng của mỗi tầng được mô tả như sau:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap20230917101937.png)

Mỗi tầng tập trung vào một nhiệm vụ cụ thể và cần sử dụng các chức năng được cung cấp bởi tầng dưới. Ví dụ, tầng vận chuyển cần sử dụng chức năng định tuyến và địa chỉ của tầng mạng để biết dữ liệu được truyền đến đâu.

**Mô hình OSI có cấu trúc rõ ràng và lý thuyết hoàn chỉnh, nhưng nó phức tạp và không thực tế, và một số chức năng xuất hiện lặp lại trong nhiều tầng.**

Hình ảnh trên có thể trừu tượng, dưới đây là một hình ảnh trực quan hơn mà tôi đã tìm thấy trên Google, rất tuyệt vời!

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/snap20230917102001.png)

**Vậy tại sao mô hình OSI 7 tầng, một mô hình đáng kinh ngạc như vậy, lại không thể vượt qua mô hình TCP/IP 4 tầng?**

Thực sự, mô hình OSI 7 tầng đã được hỗ trợ bởi một số công ty lớn và thậm chí một số chính phủ quốc gia. Với nền tảng đó, tại sao nó lại thất bại? Tôi nghĩ rằng có một số nguyên nhân chính sau đây:

1. Các chuyên gia của OSI thiếu kinh nghiệm thực tế, họ thiếu động lực kinh doanh khi hoàn thành tiêu chuẩn OSI.
2. Cài đặt giao thức của OSI quá phức tạp và hiệu suất hoạt động thấp.
3. Chu kỳ đặt tiêu chuẩn của OSI quá dài, dẫn đến các thiết bị sản xuất theo tiêu chuẩn OSI không thể nhanh chóng nhập vào thị trường (vào đầu những năm 90, mặc dù toàn bộ tiêu chuẩn quốc tế OSI đã được đề ra, nhưng Internet dựa trên TCP/IP đã thành công hoạt động trên quy mô toàn cầu).
4. Phân lớp của OSI không hợp lý, một số chức năng xuất hiện lặp lại trong nhiều lớp.

Mặc dù mô hình OSI 7 tầng đã thất bại, nhưng nó vẫn cung cấp nền tảng lý thuyết tốt. Để hiểu rõ hơn về phân lớp mạng, việc học mô hình OSI 7 tầng vẫn rất cần thiết.

## Mô hình TCP/IP 4 tầng

**Mô hình TCP/IP** là một mô hình hiện đang được sử dụng rộng rãi, chúng ta có thể coi mô hình TCP/IP là phiên bản tinh gọn của mô hình 7 tầng OSI, gồm 4 tầng sau:

1. Tầng ứng dụng
2. Tầng vận chuyển
3. Tầng mạng
4. Tầng giao diện mạng

Cần lưu ý rằng, chúng ta không thể khớp hoàn toàn mô hình 4 tầng TCP/IP và mô hình 7 tầng OSI, nhưng có thể tương ứng một cách đơn giản như hình dưới đây:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap20230917103051.png)

### Tầng ứng dụng (Application layer)

**Tầng ứng dụng nằm trên tầng vận chuyển và cung cấp dịch vụ trao đổi thông tin giữa các ứng dụng trên hai thiết bị cuối.** Nó xác định định dạng trao đổi thông tin và gửi tin nhắn cho tầng vận chuyển để vận chuyển. Chúng ta gọi các đơn vị dữ liệu trao đổi ở tầng ứng dụng là message.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap20230917110343.png)

Giao thức tầng ứng dụng xác định các quy tắc truyền thông mạng, và các ứng dụng mạng khác nhau yêu cầu các giao thức tầng ứng dụng khác nhau. Trong Internet, có nhiều giao thức tầng ứng dụng, chẳng hạn như giao thức HTTP hỗ trợ ứng dụng Web, giao thức SMTP hỗ trợ email, v.v.

**Các giao thức tầng ứng dụng phổ biến**:

- **HTTP (Hypertext Transfer Protocol, Giao thức truyền tải siêu văn bản)**: Dựa trên giao thức TCP, là một giao thức được sử dụng để truyền tải siêu văn bản và nội dung đa phương tiện, chủ yếu được thiết kế để giao tiếp giữa trình duyệt web và máy chủ web. Khi chúng ta sử dụng trình duyệt để duyệt web, trang web được tải thông qua các yêu cầu HTTP.
- **SMTP (Simple Mail Transfer Protocol, Giao thức truyền tải thư đơn giản)**: Dựa trên giao thức TCP, là một giao thức được sử dụng để gửi thư điện tử. Lưu ý rằng SMTP chỉ chịu trách nhiệm cho việc gửi thư, không phải là việc nhận thư. Để nhận thư từ máy chủ thư, cần sử dụng giao thức POP3 hoặc IMAP.
- **POP3/IMAP (Giao thức nhận thư)**: Dựa trên giao thức TCP, cả hai đều là giao thức chịu trách nhiệm cho việc nhận thư. IMAP là một giao thức mới hơn và mạnh mẽ hơn so với POP3. Nó hỗ trợ tìm kiếm, đánh dấu, phân loại, lưu trữ thư và đồng bộ hóa trạng thái thư giữa nhiều thiết bị. Hầu hết các ứng dụng thư điện tử hiện đại và máy chủ thư đều hỗ trợ IMAP.
- **FTP (File Transfer Protocol, Giao thức truyền tải tập tin)**: Dựa trên giao thức TCP, là một giao thức được sử dụng để truyền tải tập tin giữa các máy tính. Nó có thể ẩn đi sự khác biệt về hệ điều hành và cách lưu trữ tập tin. Lưu ý rằng FTP là một giao thức không an toàn vì dữ liệu không được mã hóa trong quá trình truyền tải. Khi truyền tải dữ liệu nhạy cảm, nên sử dụng các giao thức an toàn hơn như SFTP.
- **Telnet (Giao thức đăng nhập từ xa)**: Dựa trên giao thức TCP, được sử dụng để đăng nhập vào máy chủ từ xa thông qua một terminal. Một trong những nhược điểm lớn nhất của giao thức Telnet là tất cả dữ liệu (bao gồm tên người dùng và mật khẩu) được gửi dưới dạng văn bản không mã hóa, điều này có tiềm năng gây nguy hiểm về mặt bảo mật. Đó là lý do tại sao hiện nay ít sử dụng Telnet và thay vào đó sử dụng giao thức truyền tải an toàn SSH.
- **SSH (Secure Shell Protocol, Giao thức truyền tải an toàn)**: Dựa trên giao thức TCP, cung cấp truy cập và truyền tải an toàn thông qua việc sử dụng mã hóa và cơ chế xác thực. Nó được sử dụng để truy cập và điều khiển từ xa các máy chủ và thiết bị mạng một cách an toàn.
- **RTP (Real-time Transport Protocol, Giao thức truyền tải thời gian thực)**: Thường dựa trên giao thức UDP, nhưng cũng hỗ trợ giao thức TCP. Nó cung cấp chức năng truyền tải dữ liệu thời gian thực từ điểm này đến điểm khác, nhưng không đảm bảo chất lượng truyền tải thời gian thực và không có tính năng dự trữ tài nguyên, các chức năng này được thực hiện bởi WebRTC.
- **DNS (Domain Name System, Hệ thống tên miền)**: Dựa trên giao thức UDP, được sử dụng để giải quyết vấn đề ánh xạ tên miền và địa chỉ IP.

Để biết thêm thông tin chi tiết về các giao thức này, vui lòng xem bài viết [[Application Layer Protocol|Tổng quan về các giao thức lớp ứng dụng (Application layer)]].

### Tầng vận chuyển (Transport layer)

**Tầng vận chuyển có nhiệm vụ chính là cung cấp dịch vụ truyền dữ liệu thông qua mạng giữa hai tiến trình trên hai thiết bị cuối.** Ứng dụng sử dụng dịch vụ này để truyền các thông điệp ở tầng ứng dụng. "Dịch vụ chung" có nghĩa là không chỉ dành riêng cho một ứng dụng mạng cụ thể, mà nhiều ứng dụng có thể sử dụng cùng một dịch vụ vận chuyển.

**Các giao thức phổ biến ở tầng vận chuyển**:

- **TCP (Transmisson Control Protocol, giao thức điều khiển truyền tải)**: Cung cấp dịch vụ truyền dữ liệu **định kết nối** và **đáng tin cậy**.
- **UDP (User Datagram Protocol, giao thức dữ liệu người dùng)**: Cung cấp dịch vụ truyền dữ liệu **không định kết nối** và **không đảm bảo đáng tin cậy**.

### Tầng mạng (Network layer)

**Tầng mạng có trách nhiệm cung cấp dịch vụ truyền thông giữa các máy chủ khác nhau trên mạng chuyển gói.** Khi gửi dữ liệu, tầng mạng đóng gói các đoạn tin hoặc báo cáo dữ liệu người dùng từ tầng vận chuyển thành các gói và gửi chúng đi. Trong kiến trúc TCP/IP, vì tầng mạng sử dụng giao thức IP, nên các gói cũng được gọi là datagram IP, viết tắt là datagram.

⚠️ Lưu ý: **Đừng nhầm lẫn giữa "datagram UDP" ở tầng vận chuyển và "datagram IP" ở tầng mạng**.

Tầng mạng cũng có nhiệm vụ chọn đúng định tuyến để các gói dữ liệu từ tầng vận chuyển của máy chủ nguồn có thể đi qua các bộ định tuyến trong tầng mạng để tìm máy chủ đích.

Ở đây, cần nhấn mạnh rằng từ "mạng" trong tầng mạng không phải là mạng cụ thể mà chúng ta thường nói, mà là tên của tầng thứ ba trong mô hình kiến trúc mạng máy tính.

Internet là một mạng được kết nối bởi nhiều mạng không đồng nhất thông qua các bộ định tuyến. Internet sử dụng giao thức mạng là giao thức Internet (IP) và nhiều giao thức chọn định tuyến khác, do đó tầng mạng trong Internet cũng được gọi là **tầng Internet** hoặc **tầng IP**.

**Các giao thức phổ biến ở tầng mạng**:

- **IP (Internet Protocol, giao thức Internet)**: Là một trong những giao thức quan trọng nhất trong giao thức TCP/IP, chịu trách nhiệm định dạng gói tin, định tuyến và địa chỉ để chúng có thể truyền qua mạng và đến đúng đích. Hiện tại, giao thức IP chủ yếu được chia thành hai phiên bản: IPv4 (phiên bản cũ) và IPv6 (phiên bản mới hơn), cả hai phiên bản đều được sử dụng, nhưng IPv6 được đề xuất để thay thế IPv4.
- **ARP (Address Resolution Protocol, giao thức giải địa chỉ)**: Giao thức ARP giải quyết vấn đề chuyển đổi địa chỉ mạng và địa chỉ liên kết trong tầng mạng. Vì một datagram IP luôn cần biết điểm tiếp theo (đích tiếp theo trên mặt vật lý) khi truyền qua mạng, nhưng địa chỉ IP thuộc về địa chỉ logic, còn địa chỉ MAC mới là địa chỉ vật lý. Giao thức ARP giải quyết một số vấn đề liên quan đến chuyển đổi địa chỉ IP sang địa chỉ MAC.
- **ICMP (Internet Control Message Protocol, giao thức điều khiển thông điệp Internet)**: Là một giao thức dùng để truyền tải trạng thái mạng và thông báo lỗi, thường được sử dụng để chẩn đoán và khắc phục sự cố mạng. Ví dụ, công cụ Ping sử dụng giao thức ICMP để kiểm tra kết nối mạng.
- **NAT (Network Address Translation, giao thức chuyển đổi địa chỉ mạng)**: Giao thức NAT được sử dụng trong quá trình chuyển đổi địa chỉ từ mạng nội bộ sang mạng bên ngoài. Cụ thể, trong một mạng con nhỏ (LAN), các máy chủ sử dụng cùng một địa chỉ IP trong LAN đó, nhưng khi ra khỏi LAN và vào mạng rộng (WAN), cần một địa chỉ IP duy nhất để định danh LAN đó trên toàn bộ Internet.
- **OSPF (Open Shortest Path First, giao thức đường đi ngắn nhất mở)**: Là một giao thức cổng nội bộ (IGP) và cũng là một giao thức định tuyến động phổ biến, dựa trên thuật toán trạng thái liên kết và xem xét các yếu tố như băng thông và độ trễ của liên kết để chọn đường đi tốt nhất.
- **RIP (Routing Information Protocol, giao thức thông tin định tuyến)**: Là một giao thức cổng nội bộ (IGP) và cũng là một giao thức định tuyến động, dựa trên thuật toán vector khoảng cách, sử dụng số lượng nhảy cố định làm tiêu chí đo, chọn đường đi có số lượng nhảy ít nhất là đường đi tốt nhất.
- **BGP (Border Gateway Protocol, giao thức cổng biên giới)**: Là một giao thức định tuyến trao đổi thông tin về khả năng đạt được tầng mạng (Network Layer Reachability Information, NLRI) giữa các miền định tuyến, có tính linh hoạt và có khả năng mở rộng cao.

### Tầng giao diện mạng (Network interface layer)

Chúng ta có thể coi tầng giao diện mạng là sự kết hợp của tầng liên kết dữ liệu và tầng vật lý trong mô hình OSI.

1. Tầng liên kết dữ liệu (data link layer) thường được gọi là tầng liên kết (link layer) (truyền dữ liệu giữa hai máy tính luôn diễn ra trên từng đoạn liên kết). **Tầng liên kết dữ liệu có nhiệm vụ chuyển đổi các datagram IP từ tầng mạng thành các khung dữ liệu và truyền chúng qua các đoạn liên kết giữa hai nút kề nhau. Mỗi khung dữ liệu bao gồm dữ liệu và các thông tin điều khiển cần thiết (như thông tin đồng bộ, thông tin địa chỉ, kiểm soát lỗi, v.v.).**
2. **Tầng vật lý có nhiệm vụ thực hiện việc truyền dòng bit qua các nút tính toán liền kề, cố gắng che giấu sự khác biệt về phương tiện truyền và thiết bị vật lý.**

## Lý do phân tầng trong mạng

Ở cuối bài viết này, tôi muốn nói về "Tại sao mạng cần phân tầng?".

Khi nói đến phân tầng, chúng ta có thể bắt đầu bằng việc phân chia một hệ thống phần mềm phía sau thành ba tầng (hệ thống phức tạp có thể có nhiều tầng hơn):

1. Repository (Truy cập cơ sở dữ liệu)
2. Service (Xử lý logic kinh doanh)
3. Controller (Giao tiếp dữ liệu giữa frontend và backend)

**Hệ thống phức tạp cần phân tầng vì mỗi tầng cần tập trung vào một loại công việc cụ thể**.

Được rồi, hãy quay lại câu hỏi: "Tại sao mạng cần phân tầng?" Tôi nghĩ rằng có ba lý do chính:

1. **Các tầng độc lập lẫn nhau**: Các tầng độc lập lẫn nhau, không cần quan tâm đến cách thức triển khai của các tầng khác, chỉ cần biết cách gọi chức năng được cung cấp bởi tầng dưới (có thể hiểu đơn giản là gọi API). **Điều này tương tự như việc phân chia hệ thống khi phát triển, mỗi tầng chỉ quan tâm đến việc gọi các chức năng được cung cấp bởi các tầng dưới mà không cần biết cách chúng được triển khai**.
2. **Tăng tính linh hoạt toàn cầu**: Mỗi tầng có thể sử dụng công nghệ phù hợp nhất để triển khai, miễn là bạn đảm bảo chức năng và giao diện của mình không thay đổi. **Điều này tương tự như nguyên tắc của chúng ta khi phát triển hệ thống, yêu cầu sự gắn kết cao và sự phụ thuộc thấp**.
3. **Giải quyết vấn đề lớn thành các vấn đề nhỏ hơn**: Phân tầng cho phép chia nhỏ các vấn đề phức tạp thành nhiều vấn đề nhỏ hơn, rõ ràng hơn và dễ giải quyết hơn. Điều này làm cho việc thiết kế, triển khai và chuẩn hóa hệ thống mạng phức tạp trở nên dễ dàng hơn. **Điều này tương tự như khi phát triển, chúng ta thường chia nhỏ chức năng hệ thống và giải quyết các vấn đề phức tạp thành các vấn đề nhỏ hơn, dễ hiểu hơn và có định nghĩa ranh giới rõ ràng hơn**.

Tôi nhớ được một câu nói rất nổi tiếng trong thế giới máy tính, tôi muốn chia sẻ nó:

> Bất kỳ vấn đề nào trong lĩnh vực khoa học máy tính cũng có thể được giải quyết bằng cách thêm một tầng trung gian gián tiếp, toàn bộ hệ thống máy tính được thiết kế theo cấu trúc phân tầng từ trên xuống dưới.
