---
title: Network Interview Part 5
tags: [network, interview]
categories: [network, interview]
date created: 2023-08-18
date modified: 2023-08-19
---

# Network Interview Q&A Part 5

## Về trạng thái FIN_WAIT_2, CLOSE_WAIT và TIME_WAIT, bạn biết bao nhiêu?

- FIN_WAIT_2:
  - Trạng thái bán đóng.
  - Bên gửi yêu cầu ngắt kết nối vẫn có khả năng nhận dữ liệu, nhưng không còn khả năng gửi dữ liệu.
- CLOSE_WAIT:
  - Trạng thái chờ đóng kết nối.
  - Bên nhận yêu cầu ngắt kết nối nhận được gói FIN sẽ ngay lập tức phản hồi bằng gói ACK để xác nhận đã nhận yêu cầu ngắt kết nối.
  - Nếu bên nhận yêu cầu ngắt kết nối vẫn còn dữ liệu cần gửi đi, nó sẽ chuyển sang trạng thái CLOSE_WAIT.
- TIME_WAIT:
  - Còn được gọi là trạng thái chờ 2MSL.
  - Nếu bên gửi trực tiếp chuyển sang trạng thái CLOSED, và nếu bên nhận không nhận được gói ACK cuối cùng sẽ gửi lại gói FIN sau khi timeout, vì bên gửi đã CLOSED nên bên nhận sẽ không nhận được ACK mà sẽ nhận được gói RST. Vì vậy, mục đích của trạng thái TIME_WAIT là để đảm bảo dữ liệu cuối cùng của quá trình bắt tay không được gửi đến bên kia và gây ra việc gửi lại gói FIN.
  - Trong khoảng thời gian 2MSL, cùng một socket không thể được sử dụng lại, nếu không có thể gây nhầm lẫn dữ liệu với kết nối cũ (nếu cùng một socket giữa kết nối mới và kết nối cũ).

## Bạn hiểu nguyên lý kiểm soát lưu lượng không?

- Mục đích của kiểm soát lưu lượng là cho phía nhận biết khả năng nhận dữ liệu tối đa của mình thông qua trường cửa sổ trong tiêu đề TCP, nhằm giải quyết vấn đề gửi dữ liệu quá nhanh dẫn đến phía nhận không thể nhận được.
- TCP là giao thức hai chiều, hai bên có thể truyền thông đồng thời, vì vậy cả bên gửi và bên nhận đều duy trì một cửa sổ gửi và cửa sổ nhận.
  - Cửa sổ gửi: Giới hạn kích thước dữ liệu mà bên gửi có thể gửi, trong đó kích thước cửa sổ gửi được điều khiển bởi trường cửa sổ trong gói TCP trả về từ bên nhận, bên nhận thông qua trường này thông báo kích thước bộ đệm (bị giới hạn bởi hệ thống, phần cứng, v.v.).
  - Cửa sổ nhận: Đánh dấu kích thước dữ liệu có thể nhận.
- Dữ liệu trong cửa sổ gửi chỉ di chuyển khi nhận được ACK phản hồi cho phần dữ liệu đã gửi. Cửa sổ gửi di chuyển về phía trái khi cạnh trái của nó đã được xác nhận. Cửa sổ nhận cũng chỉ di chuyển khi nhận được dữ liệu và cạnh trái liên tục nhất di chuyển.
- Dữ liệu trong cửa sổ gửi chỉ di chuyển khi nhận được ACK phản hồi cho phần dữ liệu đã gửi. Cửa sổ gửi di chuyển về phía trái khi cạnh trái của nó đã được xác nhận. Cửa sổ nhận cũng chỉ di chuyển khi nhận được dữ liệu và cạnh trái liên tục nhất di chuyển.

## TCP làm gì để đảm bảo truyền dữ liệu đáng tin cậy?

### Câu trả lời thứ nhất

- **Xác nhận và gửi lại**: Bên nhận nhận được gói tin sẽ xác nhận, bên gửi sẽ gửi lại nếu không nhận được xác nhận trong một khoảng thời gian.
- **Kiểm tra dữ liệu**: Tiêu đề gói tin TCP có kiểm tra dữ liệu, được sử dụng để kiểm tra xem gói tin có bị hỏng hay không.
- **Chia nhỏ và sắp xếp dữ liệu một cách hợp lý**: TCP sẽ chia nhỏ dữ liệu theo đơn vị truyền tải tối đa (MTU), bên nhận sẽ lưu trữ dữ liệu không theo thứ tự và sắp xếp lại trước khi gửi cho tầng ứng dụng. Trong khi đó, UDP: Gói tin IP lớn hơn 1500 byte, lớn hơn MTU. Trong trường hợp này, tầng IP của bên gửi sẽ chia nhỏ gói tin thành nhiều phần nhỏ, sao cho mỗi phần nhỏ đều nhỏ hơn MTU. Tầng IP của bên nhận sẽ lấy các phần nhỏ để tái tạo gói tin ban đầu. Do tính chất của UDP, nếu một phần dữ liệu bị mất, bên nhận sẽ không thể tái tạo gói tin và dẫn đến việc từ chối gói tin UDP hoàn toàn.
- **Kiểm soát luồng dữ liệu**: Khi bên nhận không kịp xử lý dữ liệu từ bên gửi, có thể thông qua cửa sổ trượt để gợi ý bên gửi giảm tốc độ gửi để tránh mất gói tin.
- **Kiểm soát tắc nghẽn**: Khi mạng bị tắc nghẽn, thông qua cửa sổ tắc nghẽn, giảm số lượng dữ liệu gửi để tránh mất gói tin.

### Câu trả lời thứ hai

- Thiết lập kết nối (cờ): Xác nhận sự tồn tại của thực thể giao tiếp trước khi truyền thông.
- Cơ chế số thứ tự (số thứ tự, số xác nhận): Đảm bảo dữ liệu được truyền theo thứ tự và hoàn chỉnh.
- Kiểm tra dữ liệu (checksum): Kiểm tra toàn bộ dữ liệu bằng kiểm tra tổng CRC.
- Gửi lại khi quá thời gian (bộ hẹn giờ): Đảm bảo dữ liệu không được gửi đi do lỗi liên kết.
- Cơ chế cửa sổ (cửa sổ): Cung cấp kiểm soát lưu lượng để tránh gửi quá nhiều.
- Kiểm soát tắc nghẽn: Tương tự như trên.

### Câu trả lời thứ ba

**Kiểm tra tiêu đề**  
Cơ chế kiểm tra này có thể đảm bảo truyền dữ liệu không bị lỗi không? Câu trả lời là không.

**Lý do**

Theo quy định trong giao thức TCP, tiêu đề TCP có một trường là kiểm tra tổng, bên gửi sẽ tính toán một số bằng cách tính tổng của tiêu đề giả mạo, tiêu đề TCP và dữ liệu TCP, sau đó lưu trữ số này trong trường kiểm tra tổng của tiêu đề. Bên nhận nhận được gói tin TCP sau đó lặp lại quá trình này, sau đó so sánh giá trị kiểm tra tổng tính toán được với giá trị kiểm tra tổng trong tiêu đề nhận được, nếu không khớp thì có nghĩa là dữ liệu bị lỗi trong quá trình truyền.

Đây là cơ chế kiểm tra dữ liệu của TCP. Nhưng cơ chế này có thể đảm bảo phát hiện tất cả các lỗi không? **Rõ ràng không**.

Vì cách kiểm tra này là tổng hợp, tức là lấy một loạt số (TCP quy định là mỗi 16 bit dữ liệu trong dữ liệu được coi là một số) và tính tổng của chúng, sau đó lấy chữ số cuối cùng. Nhưng mọi học sinh tiểu học đều biết A + B = B + A, giả sử trong quá trình truyền có hai số 16 bit trước và sau bị đảo lộn (về cơ bản là tại sao điều này xảy ra? Tôi không biết, có lẽ bộ định tuyến có lỗi? Có lẽ các hạt cao năng trong vũ trụ đập vào cáp? Dù sao, khả năng xảy ra sự cố này không phải là không, vì vậy nó có thể xảy ra), kết quả tính tổng sẽ giống nhau trước và sau khi đảo lộn, điều này có nghĩa là bên nhận sẽ không thể phát hiện ra rằng đây là dữ liệu bị lỗi.

**Giải pháp**

Trước khi truyền, hãy sử dụng mã hóa MD5 để có được bản tóm tắt dữ liệu và gửi cùng với dữ liệu đến máy chủ. Máy chủ nhận được dữ liệu sau đó cũng sử dụng mã hóa MD5 để mã hóa dữ liệu, nếu kết quả mã hóa và bản tóm tắt giống nhau, thì coi như không có vấn đề.

## Sự khác biệt giữa TCP và UDP

1. TCP hướng đến việc thiết lập kết nối (như việc gọi điện thoại trước khi thiết lập kết nối); UDP không yêu cầu thiết lập kết nối trước khi gửi dữ liệu.
2. TCP cung cấp dịch vụ đáng tin cậy. Điều này có nghĩa là dữ liệu được truyền qua kết nối TCP không có lỗi, không bị mất, không bị lặp lại và đến đúng thứ tự; UDP cung cấp dịch vụ truyền tin tối đa, tức là không đảm bảo truyền tin đáng tin cậy.
3. TCP hướng đến luồng dữ liệu theo byte, tức là TCP xem dữ liệu như một chuỗi byte không có cấu trúc; UDP hướng đến gói tin.
4. UDP không có kiểm soát tắc nghẽn, vì vậy nếu mạng bị tắc nghẽn, tốc độ gửi từ máy nguồn không giảm (rất hữu ích cho các ứng dụng thời gian thực như điện thoại IP, hội nghị video thời gian thực, v.v.).
5. Mỗi kết nối TCP chỉ có thể là điểm-điểm; UDP hỗ trợ giao tiếp một-đến-một, một-đến-nhiều, nhiều-đến-một và nhiều-đến-nhiều.
6. TCP Header có kích thước 20 byte; UDP Header có kích thước nhỏ, chỉ 8 byte.
7. Kênh truyền thông TCP là kênh full-duplex đáng tin cậy, trong khi UDP là kênh không đáng tin cậy.
8. UDP hướng đến gói tin, bên gửi UDP gửi gói tin từ tầng ứng dụng mà không kết hợp hoặc tách gói tin, chỉ cần thêm đầu ghi và gửi xuống tầng mạng dưới cùng. Đối với bên nhận, sau khi nhận được, nó chỉ cần xóa đầu ghi và chuyển giao cho tầng ứng dụng. Do đó, nó cần kiểm soát kích thước gói tin từ tầng ứng dụng.

	TCP hướng đến luồng byte, nó coi dữ liệu được gửi từ tầng ứng dụng là một luồng byte không có cấu trúc và có thể gửi đi. Bạn có thể tưởng tượng nó như một dòng nước, bên gửi TCP đặt dữ liệu vào "hồ chứa" (bộ đệm) và gửi khi có thể gửi, nếu không thể gửi, nó sẽ chờ đợi TCP xác định kích thước của mỗi đoạn dữ liệu dựa trên tình trạng tắc nghẽn hiện tại của mạng.

## Câu hỏi bổ sung: Bạn đã nghe về khái niệm đóng gói và tách gói chưa? Nó dựa trên TCP hay UDP?

Cả đóng gói và tách gói đều là khái niệm dựa trên TCP. Vì TCP là luồng truyền không có ranh giới, nên cần phải đóng gói và tách gói TCP để đảm bảo dữ liệu gửi và nhận không bị dính lại.

- Đóng gói: Đóng gói là quá trình thêm một tiêu đề gói cho mỗi gói dữ liệu TCP được gửi đi, chia dữ liệu thành tiêu đề và phần thân của gói. Tiêu đề là một cấu trúc có độ dài cố định, chứa thông tin về tổng kích thước của gói dữ liệu.
- Tách gói: Bên nhận sẽ sử dụng thông tin về kích thước trong tiêu đề để cắt gói dữ liệu.

## Các đặc điểm của UDP (kèm theo các đặc điểm của TCP)

- UDP là **không kết nối**.
- UDP sử dụng cơ chế **truyền tin tối đa**, tức là không đảm bảo truyền tin đáng tin cậy, do đó máy chủ không cần duy trì trạng thái kết nối phức tạp (bao gồm nhiều tham số).
- UDP là **hướng đến gói tin**.
- UDP **không có kiểm soát tắc nghẽn**, do đó nếu mạng bị tắc nghẽn, tốc độ gửi từ máy nguồn không giảm (rất hữu ích cho các ứng dụng thời gian thực như điện thoại IP, hội nghị video thời gian thực, v.v.).
- UDP hỗ trợ **giao tiếp một-đến-một, một-đến-nhiều, nhiều-đến-một và nhiều-đến-nhiều**.
- Tiêu đề UDP có **kích thước nhỏ**, chỉ 8 byte, so với tiêu đề TCP có kích thước 20 byte.

Và giờ là một lần nữa về các đặc điểm của TCP:

- **TCP là kết nối hướng**. (Tương tự như việc gọi điện thoại, cần thiết lập kết nối trước khi trò chuyện và sau khi kết thúc cuộc trò chuyện cần giải phóng kết nối).
- Mỗi kết nối TCP chỉ có hai điểm cuối, mỗi kết nối TCP chỉ có thể là điểm-điểm (một-đến-một).
- TCP cung cấp dịch vụ giao hàng đáng tin cậy. Dữ liệu được truyền qua kết nối TCP không có lỗi, không bị mất, không bị lặp lại và đến đúng thứ tự.
- TCP cung cấp giao tiếp full-duplex. TCP cho phép ứng dụng ở cả hai bên của kết nối gửi dữ liệu bất kỳ lúc nào. Cả hai đầu của kết nối TCP đều có bộ đệm gửi và bộ đệm nhận, được sử dụng để tạm thời lưu trữ dữ liệu giao tiếp giữa hai bên.
- TCP là hướng đến luồng byte. Trong TCP, "luồng" (stream) đề cập đến dãy byte truyền vào hoặc truyền ra từ quá trình. "Hướng đến luồng byte" có nghĩa là mặc dù ứng dụng và TCP giao tiếp theo từng khối dữ liệu (có kích thước khác nhau), nhưng TCP xem dữ liệu được giao từ ứng dụng như một luồng byte không có cấu trúc.

## Các giao thức ứng dụng tương ứng với TCP

- FTP (File Transfer Protocol): Định nghĩa giao thức truyền tập tin, sử dụng cổng 21.
- Telnet: Giao thức dùng để đăng nhập từ xa, sử dụng cổng 23.
- SMTP (Simple Mail Transfer Protocol): Định nghĩa giao thức truyền thư đơn giản, máy chủ mở cổng 25.
- POP3 (Post Office Protocol version 3): Đối ứng với SMTP, POP3 được sử dụng để nhận thư.

## Các giao thức ứng dụng tương ứng với UDP

- DNS (Domain Name System): Sử dụng để cung cấp dịch vụ giải quyết tên miền, sử dụng cổng 53.
- SNMP (Simple Network Management Protocol): Giao thức quản lý mạng đơn giản, sử dụng cổng 161.
- TFTP (Trivial File Transfer Protocol): Giao thức truyền tập tin đơn giản, sử dụng cổng 69.

## Các giao thức phổ biến ở tầng liên kết dữ liệu là gì?

| Giao thức | Tên             | Chức năng                                                     |
| -------- | --------------- | ------------------------------------------------------------ |
| ARP      | Giao thức giải địa chỉ (Address Resolution Protocol)     | Lấy địa chỉ vật lý dựa trên địa chỉ IP                        |
| RARP     | Giao thức chuyển đổi địa chỉ ngược (Reverse Address Resolution Protocol) | Lấy địa chỉ IP dựa trên địa chỉ vật lý                        |
| PPP      | Giao thức điểm-điểm (Point-to-Point Protocol)              | Sử dụng để thiết lập kết nối điểm-điểm và gửi dữ liệu thông qua kết nối đó, là một giải pháp chung cho việc kết nối đơn giản giữa các máy chủ, cầu nối và bộ định tuyến |

## Giao thức nào được sử dụng trong lệnh Ping? Nguyên lý hoạt động là gì?

Lệnh Ping được thực hiện dựa trên giao thức ICMP (Internet Control Message Protocol) ở tầng mạng. Bằng cách gửi một **gói tin yêu cầu ICMP Echo** đến máy chủ đích, nếu máy chủ đích có thể truy cập được, nó sẽ nhận được gói tin này và phản hồi bằng một **gói tin đáp ứng ICMP Echo**.

Mở rộng: Giới thiệu về gói tin ICMP. Gói tin ICMP được chia thành hai loại:

1. Gói tin báo lỗi ICMP, bao gồm:
   - Đích không thể đạt được (Destination Unreachable)
   - Vượt quá thời gian (Time Exceeded)
   - Vấn đề về tham số (Parameter Problem)
   - Thay đổi tuyến đường (Redirect)
2. Gói tin yêu cầu ICMP:
   - Yêu cầu và đáp ứng Echo: Gửi một **gói tin yêu cầu Echo ICMP** đến máy chủ đích và nhận lại một **gói tin đáp ứng Echo ICMP**.
   - Yêu cầu và đáp ứng Time Stamp: Yêu cầu thời gian hiện tại của máy chủ đích và nhận lại một dấu thời gian 32 bit.

## Cơ chế điều khiển lưu lượng bằng cửa sổ trượt trong TCP là gì?

> Điều khiển lưu lượng là để kiểm soát tốc độ gửi của bên gửi, đảm bảo bên nhận có đủ thời gian để nhận. TCP sử dụng cửa sổ trượt để thực hiện điều khiển lưu lượng.

Trong TCP, cửa sổ trượt được sử dụng để điều khiển truyền thông, kích thước của cửa sổ trượt cho biết **bên nhận còn bao nhiêu bộ đệm để nhận dữ liệu**. Bên gửi có thể xác định số byte dữ liệu nên gửi dựa trên kích thước của cửa sổ trượt. Khi cửa sổ trượt bằng 0, bên gửi thường không thể gửi thêm dữ liệu, trừ khi có hai trường hợp ngoại lệ, một trường hợp là có thể gửi dữ liệu khẩn cấp.

> Ví dụ, cho phép người dùng kết thúc quá trình chạy trên máy từ xa. Trường hợp khác là bên gửi có thể gửi một gói tin 1 byte để thông báo cho bên nhận khai báo lại byte tiếp theo mà nó muốn nhận và kích thước cửa sổ trượt của bên gửi.

## Có thể giải thích về RTO, RTT và tái truyền sau quá thời gian chờ không?

- Tái truyền sau quá thời gian chờ: Khi bên gửi gửi một gói tin và không nhận được gói tin xác nhận trong thời gian dài, nó cần gửi lại gói tin đó. Có thể có một số trường hợp sau:
  - Dữ liệu gửi không thể đến được bên nhận, vì vậy không có phản hồi.
  - Bên nhận nhận được dữ liệu, nhưng gói tin ACK bị mất trong quá trình trả về.
  - Bên nhận từ chối hoặc loại bỏ dữ liệu.
- RTO: Thời gian từ lần gửi dữ liệu trước đó, do không nhận được phản hồi ACK trong thời gian dài, đến lần gửi lại tiếp theo. Đây là khoảng thời gian tái truyền.
  - Thông thường, mỗi lần tái truyền, RTO là gấp đôi khoảng thời gian tái truyền trước đó, đơn vị đo thường là RTT. Ví dụ: 1RTT, 2RTT, 4RTT, 8RTT……
  - Sau khi số lần tái truyền đạt đến giới hạn, quá trình tái truyền sẽ dừng lại.
- RTT: Khoảng thời gian từ khi gửi dữ liệu cho đến khi nhận được phản hồi ACK từ bên nhận, tức là thời gian một gói tin dữ liệu đi và về trong mạng. Kích thước không ổn định.

## Tấn công XSS là gì?

XSS (Cross-Site Scripting) là một phương pháp tấn công mà kẻ tấn công sẽ thay đổi trang web và chèn mã độc hại vào đó. Khi người dùng truy cập vào trang web đó, mã độc sẽ được thực thi trên trình duyệt của người dùng và kẻ tấn công có thể kiểm soát trình duyệt để thực hiện các hành động độc hại. Cách phòng chống tấn công XSS:

1) Giới hạn độ dài chuỗi đầu vào trên phía máy chủ và phía người dùng.

2) Xử lý chuỗi đầu vào trên phía máy chủ và phía người dùng để tránh các ký tự đặc biệt như "<", ">", vv được mã hóa.  

Phòng chống XSS yêu cầu phải lọc dữ liệu đầu vào.

## Cuộc tấn công CSRF là gì? Bạn có biết không?

CSRF (Cross-Site Request Forgery) là một phương pháp tấn công mà kẻ tấn công sẽ sử dụng yêu cầu từ một trang web khác để thực hiện các hành động xâm nhập trái phép trên tài khoản của người dùng. CSRF có thể hiểu như sau: kẻ tấn công đánh cắp danh tính của bạn và sử dụng nó để gửi yêu cầu độc hại đến một trang web khác. Các hành động mà CSRF có thể thực hiện bao gồm gửi email, gửi tin nhắn, thực hiện giao dịch chuyển tiền, thậm chí đánh cắp thông tin tài khoản.

## Làm thế nào để phòng chống cuộc tấn công CSRF?

**Sử dụng framework bảo mật** như Spring Security.  
**Sử dụng cơ chế token**. Kiểm tra token trong yêu cầu HTTP, nếu không có token hoặc token không chính xác, coi đó là cuộc tấn công CSRF và từ chối yêu cầu đó.  
**Sử dụng mã xác nhận**. Thông thường, mã xác nhận có thể ngăn chặn hiệu quả cuộc tấn công CSRF, nhưng trong nhiều trường hợp, vì lợi ích của trải nghiệm người dùng, mã xác nhận chỉ được sử dụng như một phương tiện hỗ trợ, không phải là giải pháp chính.  
**Nhận dạng referer**. Trong tiêu đề HTTP có một trường gọi là Referer, nó ghi lại địa chỉ nguồn của yêu cầu HTTP. Nếu Referer là một trang web khác, có thể là cuộc tấn công CSRF, từ chối yêu cầu đó. Tuy nhiên, máy chủ không phải lúc nào cũng có thể nhận được Referer. Nhiều người dùng hạn chế việc gửi Referer để bảo vệ quyền riêng tư. Trong một số trường hợp, trình duyệt cũng không gửi Referer, ví dụ như chuyển từ HTTPS sang HTTP.

1) Xác minh nguồn yêu cầu;

2) Thêm mã xác nhận cho các hoạt động quan trọng;

3) Thêm token vào địa chỉ yêu cầu và xác minh token đó.

## Lỗ hổng tải lên tệp xảy ra như thế nào? Bạn đã từng trải qua không?

Lỗ hổng tải lên tệp xảy ra khi người dùng tải lên một tệp tin có thể thực thi và từ đó có khả năng thực thi các lệnh trên máy chủ. Nhiều framework và dịch vụ bên thứ ba đã từng bị phát hiện có lỗ hổng tải lên tệp tin, ví dụ như Struts2 và các trình soạn thảo văn bản phong phú khác. Kẻ tấn công có thể tải lên mã độc và tiềm ẩn nguy cơ xâm nhập vào máy chủ.

## Làm thế nào để phòng chống lỗ hổng tải lên tệp tin?

- Thiết lập thư mục tải lên không thể thực thi.
- Kiểm tra loại tệp tin. Khi kiểm tra loại tệp tin, có thể kết hợp sử dụng MIME Type, kiểm tra phần mở rộng tệp tin và các phương pháp khác. Vì không thể đơn giản dựa vào phần mở rộng tệp tin để xác định loại tệp tin được tải lên, vì kẻ tấn công có thể thay đổi phần mở rộng của tệp tin thực thi thành hình ảnh hoặc các loại phần mở rộng khác để lừa người dùng thực thi tệp tin.
- Kiểm tra danh sách trắng loại tệp tin được tải lên, chỉ cho phép tải lên các loại tệp tin đáng tin cậy.
- Đổi tên tệp tin tải lên để kẻ tấn công không thể đoán được đường dẫn truy cập tệp tin tải lên, tăng đáng kể chi phí tấn công và ngăn chặn các cuộc tấn công thành công trên các tệp tin như shell .php .rar .ara.
- Giới hạn kích thước tệp tin tải lên.
- Thiết lập tên miền riêng cho máy chủ tệp tin.

## Bạn đã nghe về nguyên tắc kiểm soát tắc nghẽn chưa?

- Mục tiêu của kiểm soát tắc nghẽn là ngăn chặn việc chất lượng dữ liệu quá tải vào mạng gây quá tải tài nguyên mạng (bộ định tuyến, switch, v.v.). Vì kiểm soát tắc nghẽn liên quan đến toàn bộ liên kết mạng, nên nó thuộc về kiểm soát toàn cầu. Kiểm soát tắc nghẽn sử dụng cửa sổ tắc nghẽn.
- Thuật toán kiểm soát tắc nghẽn TCP:
  - Bắt đầu chậm và tránh tắc nghẽn: Khám phá mức độ tắc nghẽn của mạng trước khi tăng kích thước cửa sổ tắc nghẽn. Giả sử kích thước cửa sổ là d, mỗi lần nhận được một ACK, tăng 1, chính xác nhận được d ACK, vì vậy tăng d, chính xác là gấp đôi, cho đến khi đạt đến ngưỡng ssthresh, phần này là giai đoạn bắt đầu chậm. Khi đạt đến ngưỡng, tăng kích thước cửa sổ tắc nghẽn theo từng đơn vị MSS, khi gặp tắc nghẽn (không nhận được ACK), giảm ngưỡng ssthresh xuống một nửa và tiếp tục tăng, giai đoạn này được gọi là tránh tắc nghẽn.
  - Truyền lại nhanh & Khôi phục nhanh: Bỏ qua.
  - Cuối cùng, cửa sổ tắc nghẽn sẽ hội tụ vào giá trị ổn định.

## Làm thế nào để phân biệt kiểm soát lưu lượng và kiểm soát tắc nghẽn?

- Kiểm soát lưu lượng là sự thỏa thuận giữa hai bên trong giao tiếp; kiểm soát tắc nghẽn liên quan đến toàn bộ mạng lưới giao tiếp.
- Kiểm soát lưu lượng yêu cầu cả hai bên duy trì một cửa sổ gửi và cửa sổ nhận, đối với bất kỳ bên nào, kích thước cửa sổ nhận được quyết định bởi chính nó, trong khi kích thước cửa sổ gửi được xác định bởi giá trị cửa sổ trong các phản hồi TCP của bên nhận; kiểm soát tắc nghẽn điều chỉnh kích thước cửa sổ tắc nghẽn dựa trên việc gửi một lượng dữ liệu thử nghiệm để xem tình trạng mạng và tự điều chỉnh.
- Kích thước cửa sổ gửi thực tế cuối cùng = min {kích thước cửa sổ kiểm soát lưu lượng, kích thước cửa sổ tắc nghẽn}.

## Các mã trạng thái HTTP phổ biến bao gồm gì?

| Mã trạng thái | Loại                             | Ý nghĩa                       |
| ------ | -------------------------------- | -------------------------- |
| 1XX    | Informational（Thông tin）    | Yêu cầu đã nhận được và đang được xử lý         |
| 2XX    | Success（Thành công）            | Yêu cầu đã được xử lý thành công           |
| 3XX    | Redirection（Chuyển hướng）      | Yêu cầu cần thực hiện thêm thao tác để hoàn thành |
| 4XX    | Client Error（Lỗi từ phía khách hàng） | Máy chủ không thể xử lý yêu cầu         |
| 5XX    | Server Error（Lỗi từ phía máy chủ） | Máy chủ gặp lỗi khi xử lý yêu cầu           |

## 1xx Thông tin

**100 Continue** ：Cho biết cho đến nay mọi thứ đều bình thường, khách hàng có thể tiếp tục gửi yêu cầu hoặc bỏ qua phản hồi này.

## 2xx Thành công

- **200 OK**
- **204 No Content** ：Yêu cầu đã được xử lý thành công, nhưng phản hồi không chứa phần thân của thực thể. Thường được sử dụng khi chỉ cần gửi thông tin từ máy khách đến máy chủ mà không cần trả về dữ liệu.
- **206 Partial Content** ：Chỉ ra rằng khách hàng đã thực hiện yêu cầu phạm vi, và phản hồi chứa nội dung của thực thể được chỉ định bởi Content-Range.

## 3xx Chuyển hướng

- **301 Moved Permanently** ：Chuyển hướng vĩnh viễn
- **302 Found** ：Chuyển hướng tạm thời
- **303 See Other** ：Tương tự như 302, nhưng yêu cầu khách hàng sử dụng phương thức GET để truy xuất tài nguyên.
- **304 Not Modified** ：Nếu yêu cầu chứa các điều kiện như If-Match, If-Modified-Since, If-None-Match, If-Range, If-Unmodified-Since và không đáp ứng các điều kiện đó, máy chủ sẽ trả về mã trạng thái 304.
- **307 Temporary Redirect** ：Chuyển hướng tạm thời, tương tự như 302, nhưng yêu cầu khách hàng không được thay đổi từ phương thức POST sang GET.

## 4xx Lỗi từ phía khách hàng

- **400 Bad Request** ：Yêu cầu chứa lỗi cú pháp.
- **401 Unauthorized** ：Mã trạng thái này chỉ ra rằng yêu cầu gửi đi yêu cầu thông tin xác thực (xác thực cơ bản, xác thực tiêu hóa). Nếu đã thực hiện một yêu cầu trước đó, nó chỉ ra rằng xác thực của người dùng đã thất bại.
- **403 Forbidden** ：Yêu cầu bị từ chối.
- **404 Not Found**

## 5xx Lỗi từ phía máy chủ

- **500 Internal Server Error** ：Máy chủ gặp lỗi khi xử lý yêu cầu.
- **503 Service Unavailable** ：Máy chủ tạm thời không khả dụng do quá tải hoặc đang trong quá trình bảo trì.

## Lý do và cách giải quyết khi máy chủ có nhiều kết nối close_wait?

Trạng thái close_wait xảy ra khi máy chủ nhận được FIN nhưng không gửi FIN của riêng mình trong quá trình bốn bước của TCP. Có hai lý do chính khiến máy chủ có nhiều kết nối close_wait:

* Xử lý nhiều thời gian gây chậm trễ, chưa thể hoàn thành xử lý công việc; hoặc vẫn còn dữ liệu cần gửi; hoặc logic kinh doanh của máy chủ có vấn đề, không thực hiện phương thức close().
* Tiến trình cha tạo ra tiến trình con, tiến trình con kế thừa socket, xử lý khi nhận được FIN nhưng tiến trình cha không xử lý tín hiệu này, dẫn đến việc tham chiếu socket không bằng 0 và không thể thu hồi.

Cách giải quyết:

* Dừng ứng dụng.
* Sửa lỗi trong chương trình.

## Máy tính có thể sử dụng tối đa bao nhiêu cổng và có thể thay đổi không? Nếu muốn sử dụng cổng vượt quá giới hạn này thì phải làm sao?

Máy tính có thể sử dụng tối đa 65536 cổng. Điều này liên quan đến độ dài 16 bit của số cổng nguồn và đích trong tiêu đề gói tin TCP, có thể biểu thị 2^16 = 65536 cổng khác nhau. Tuy nhiên, 1024 cổng đầu tiên (từ 0 đến 1023) được dành riêng cho các dịch vụ nổi tiếng, do đó thực tế chỉ còn lại ít hơn 65536 cổng.

Đối với máy chủ, số cổng mà nó có thể mở phụ thuộc vào số lượng tệp mở được của Linux và có thể cấu hình thông qua MaxUserPort.

Nếu muốn sử dụng cổng vượt quá giới hạn này, bạn có thể thực hiện các biện pháp sau:

* Tăng giới hạn số lượng cổng mở được trên máy chủ.
* Sử dụng nhiều địa chỉ IP để mở rộng số lượng cổng có thể sử dụng.
* Sử dụng kỹ thuật NAT (Network Address Translation) để ánh xạ nhiều cổng nội bộ sang một cổng ngoại vi.
