---
categories: [network, computer-science]
title: TCP
date created: 2023-05-25
date modified: 2023-07-10
tags: [network, computer-science]
---

## TCP/IP

`TCP/IP` không phải là một giao thức đơn lẻ mà là sự kết hợp giữa giao thức TCP và giao thức IP.  

**Nó bao gồm IP, một giao thức Internet của giao tiếp gói và TCP, một giao thức điều khiển truyền dẫn.**  

IP chỉ cung cấp một địa chỉ logic mà không đảm bảo việc gửi gói và thứ tự các gói được gửi và nhận không được đảm bảo.  

TCP là một giao thức chạy trên IP và đảm bảo việc phân phối dữ liệu cũng như đảm bảo thứ tự dữ liệu được gửi và nhận.

Các giao thức như HTTP, FTP và SMTP dựa trên TCP và vì các giao thức này hoạt động trên IP nên chúng được gọi chung là TCP/IP.

Ngoài ra, sử dụng TCP/IP có nghĩa là tuân theo hệ thống địa chỉ IP và tận dụng các đặc điểm của TCP để tạo kết nối logic giữa người gửi và người nhận và duy trì độ tin cậy.

Nói cách khác, nói về TCP/IP có nghĩa là người gửi gửi dữ liệu đến người nhận bằng địa chỉ IP và liệu dữ liệu có được gửi chính xác không, không quá nhanh và liệu tin nhắn có được nhận chính xác hay không.

Đặc điểm này của TCP là lý do tại sao bạn có thể tải xuống một cái gì đó từ Internet mà không bị gián đoạn hoặc thiếu các phần.

Như vậy, nó là cơ sở cho các giao thức dựa vào việc gửi tất cả dữ liệu một cách đáng tin cậy, chẳng hạn như HTTP, HTTPS, FTP và SMTP.

## TCP (Transmission Control Protocol)

Giao thức TCP nằm ở tầng Transport, Layer 4 của OSI.

![Pasted image 20230525201958](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230525201958.png)

TCP là một giao thức kiểm soát việc truyền thông tin mạng và là một trong những giao thức cốt lõi tạo nên Internet.

Nó cho phép trao đổi truyền dữ liệu đáng tin cậy, có trật tự và không có lỗi giữa các chương trình chạy trên máy tính được kết nối với mạng cục bộ, mạng nội bộ hoặc Internet.

Nó được các trình duyệt web sử dụng để kết nối với máy chủ qua www và cũng được sử dụng để gửi email và truyền tệp.

Trong khi IP không hiểu mối quan hệ giữa các gói và tập trung vào việc tìm đúng đích đến, TCP xác định xem cả hai thiết bị đầu cuối muốn liên lạc đã sẵn sàng để liên lạc hay chưa, liệu dữ liệu đã được truyền đúng chưa, liệu dữ liệu có bị hỏng trên đường đi hay không và người nhận kiểm tra xem bạn đã nhận được bao nhiêu và có thiếu thành phần nào không.  
![Pasted image 20230525222050](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230525222050.png)

Thông tin này được chứa trong TCP Header và nó cũng bao gồm các phần tử có thể liên quan đến đảm bảo độ tin cậy, kiểm soát luồng và kiểm soát tắc nghẽn, chẳng hạn như source port, destination port, sequence number, window size và checksum.

Ngoài ra, dữ liệu mà TCP có thể chứa không bao gồm IP Header và TCP Header được gọi là **Segment**.

![Pasted image 20230525205635](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230525205635.png)

TCP kết nối bằng **PORT** giống như IP.  

Điều này là do bạn cần biết dữ liệu đến một thiết bị đầu cuối sẽ đi vào port nào để thử kết nối.  

Bạn có thể kiểm tra địa chỉ Source Port và địa chỉ Destination Port bằng cách xem TCP Header ở trên.

(Ví dụ: nếu cả hai thiết bị đầu cuối muốn gửi và nhận tài liệu HTTP, thì cổng của thiết bị đầu cuối phải là 80 để truyền dữ liệu.)

## TCP hoạt động thế nào?

- Nói chung, TCP và IP được sử dụng cùng nhau. IP xử lý việc phân phối dữ liệu, trong khi TCP theo dõi và quản lý các gói tin.
- Nó là một giao thức hướng kết nối (**connection-oriented**), hỗ trợ truyền dữ liệu đáng tin cậy.
- Thông qua một quy trình được gọi là bắt tay 3 bước trước (3-way handshake), một kết nối được thiết lập và quá trình giao tiếp bắt đầu.
- Kết nối được giải phóng (phương pháp đường dây ảo) thông qua quá trình bắt tay 4 bước (4-way handshake).  
- Cung cấp cơ chế báo nhận (**Acknowledgement**) :Khi A gửi dữ liệu cho B, B nhận được thì gửi gói tin cho A xác nhận là đã nhận. Nếu không nhận được tin xác nhận thì A sẽ gửi cho đến khi B báo nhận thì thôi. Đảm bảo phục hồi dữ liệu bị mất trên đường truyền ( A gửi B mà không thấy xác nhận sẽ gửi lại)
- Cung cấp cơ chế đánh số thứ tự gói tin (**sequencing**) cho các đơn vị dữ liệu được truyền, sử dụng để ráp các gói tin chính xác ở điểm nhận và loại bỏ gói tin trùng lặp. Nó đảm bảo thứ tự truyền dữ liệu và có thể kiểm tra xem nó đã được nhận chưa.
- Độ tin cậy được đảm bảo thông qua kiểm soát luồng (**flow control**), kiểm soát tắc nghẽn (**Congestion Control**) và kiểm soát lỗi (**Error control**). Tuy nhiên chính vì điều này mà nó có một nhược điểm là tốc độ đường truyền chậm hơn so với UDP.  
- TCP đó cung cấp một mạch ảo có nghĩa là nó phân bổ một đường dẫn hợp lý để truyền các gói bằng cách kết nối người gửi và người nhận.
- Hỗ trợ cơ chế full-duplex ( truyền và nhận dữ liệu cùng một lúc)

### TCP 3-way-handshake : Connection Establish

Bắt tay 3 bước của TCP là quá trình thiết lập kết nối (**Connection Establish**) trước khi bắt đầu truyền thông TCP để đảm bảo độ tin cậy. Quá trình này đảm bảo rằng cả hai bên đều sẵn sàng truyền dữ liệu.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230708004358.png)

**Quy trình A (Client) yêu cầu kết nối với B (Server)**  

1. A(CLOSED) → B(LISTEN) : **SYN(a)**
	- Quá trình A gửi thông báo yêu cầu kết nối (SYN)  
	- Tại thời điểm này, số thứ tự (seq) được chỉ định là số ngẫu nhiên (a) và trong Control Flag thì SYN flag được bật (đặt thành 1) và được truyền đi.  
2. B(SYN_RCV) → A(CLOSED) : **ACK(a+1), SYN(b)**  
	- B đã nhận được thông báo yêu cầu kết nối, đã chấp nhận yêu cầu (ACK) và yêu cầu A cũng đã gửi một thông báo yêu cầu mở port (SYN).
	- Việc chấp nhận thông báo đã nhận được thể hiện bằng cách chỉ định Acknowledgement Number là (Sequence Number + 1). Sau đó, nó truyền Control Flag với các bit cờ SYN và ACK được bật (đặt thành 1).
3. A(ESTABLISHED) → B(SYN_RCV) : **ACK(b+1)**  
	- Cuối cùng, A thiết lập kết nối bằng cách gửi xác nhận chấp nhận (ACK)  
	- Tại thời điểm này, nếu có dữ liệu được truyền, dữ liệu có thể được truyền trong bước này.

Trạng thái PORT cuối cùng: A-ESTABLISHED, B-ESTABLISHED (đã thiết lập kết nối)

### TCP 4-way-handshake : Connection Termination

Bắt tay 4 bước là quá trình giải phóng kết nối (Connection Termination), cũng mục đích đảm bảo độ tin cậy của TCP.

![Pasted image 20230525232625](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230525232625.png)

**A (Client) yêu cầu B (Server) huỷ kết nối**  

1. A(ESTABLISHED) → B(ESTABLISHED) : **FIN**  
	- A gửi flag FIN được bật để đóng kết nối  
	- Giữ kết nối tồn tại cho đến khi B phản hồi bằng cờ FIN  
2. B(CLOSE_WAIT) → A(FIN_WAIT_1) : **ACK**  
	- Trước tiên, B sẽ gửi một thông báo xác nhận (ACK) và đợi cho đến khi quá trình giao tiếp của chính nó kết thúc.  
	- Acknowledgement Number được chỉ định là (Sequence Number + 1) và Control Flag với flag ACK được bật và truyền đi.  
	- Và nếu còn dữ liệu để truyền, nó sẽ tiếp tục truyền. (Phía máy khách cũng rời phiên trong một khoảng thời gian nhất định và đợi các gói trong trường hợp có dữ liệu chưa được nhận từ máy chủ. Đây được gọi là trạng thái TIME_WAIT.)  
3. B(CLOSE_WAIT) → A(FIN_WAIT_2) : **FIN**  
	- Khi quá trình giao tiếp của B kết thúc, nó sẽ gửi một cờ FIN tới quá trình A để chỉ ra rằng có thể kết thúc kết nối.  
4. A(TIME_WAIT) → B(LAST_ACK) : **ACK**  
	- A gửi một thông báo nói rằng nó đã xác nhận thông báo FIN (ACK)  
	- Khi nhận được thông báo ACK từ A, B sẽ ngắt kết nối port.  

Trạng thái PORT cuối cùng: A-CLOSED, B-CLOSED (ngắt kết nối)

### Flow Control

Một kỹ thuật để giải quyết chênh lệch tốc độ xử lý dữ liệu (luồng) giữa bên gửi và bên nhận.  
Nếu thông lượng truyền của bên truyền > thông lượng của bên nhận, các gói được truyền có thể bị mất ngoài hàng đợi của bên nhận, do đó, lượng truyền gói của bên truyền được kiểm soát.

Có 2 cơ chế để kiểm soát luồng:

**1. Stop and Wait**  

- Phải nhận được xác nhận cho mỗi gói được truyền trước khi có thể truyền gói tiếp theo.  
- Cơ cấu này không hiệu quả. ()  
- Give & Take.

**2. Sliding Window**

- Cơ chế này sử dụng field window size trong TCP Header để xác định kích thước buffer
- Lượng gói gửi = Lượng gói nhận
- Đây là một kỹ thuật tự động điều chỉnh luồng dữ liệu bằng cách cho phép người gửi truyền các segemnt có window size do người nhận đặt mà không cần xác nhận.
- Window size: Kích thước của bộ đệm được tạo bởi cả bên gửi và bên nhận.
- Một kỹ thuật để cải thiện sự kém hiệu quả của Stop and Wait
- Bên gửi có thể truyền nhiều frame liên tiếp ngay cả khi không nhận được Ack.
- Giả sử rằng người gửi có bufer chứa 0,1,2,3,4,5,6 và truyền dữ liệu 0,1, cấu trúc của sliding window thay đổi thành 2,3,4,5,6.
- Tại thời điểm này, nếu nhận được ACK từ bên nhận, bên truyền sẽ biết rằng dữ liệu đã gửi trước dó (0, 1) thường được bên nhận nhận và sliding window của bên truyền sẽ mở rộng giới hạn sang bên phải để chứa gói tin.

### Error Control

Error control bao gồm phát hiện lỗi và truyền lại.  
Nếu một frame bị hỏng hoặc bị mất bằng kỹ thuật ARQ (Automatic Repeat Request), lỗi sẽ được khôi phục thông qua truyền lại.  
Kỹ thuật ARQ có liên quan đến kỹ thuật điều khiển luồng.

**1. Stop and Wait ARQ**

- Đây là phương pháp trong đó bên gửi truyền một frane và bên nhận gửi ACK hoặc NAK tùy theo có lỗi trong frane nhận được hay không.  
- Để nhận dạng, frame dữ liệu và frame ACK được gán số 0 và 1 luân phiên.
- Nếu bên nhận không nhận được dữ liệu, nó sẽ gửi NAK và bên truyền đã nhận được NAK sẽ phải truyền lại dữ liệu.  
- Nếu dữ liệu hoặc ACK bị mất thì sau khoảng thời gian chờ (TIME_OUT) nhất định, bên gửi sẽ truyền lại dữ liệu.

![Pasted image 20230526000654](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230526000654.png)

**2. Go-Back-n ARQ**

- Nếu frame được truyền bị hỏng hoặc bị mất và TIME_OUT xảy ra do mất gói ACK, tất cả các frame sau frame được xác nhận cuối cùng sẽ được truyền lại.
- Sliding window là một kỹ thuật truyền khung liên tục và bên truyền phải có bản sao của tất cả các frane được truyền và phải phân biệt cả ACK và NAK.
- ACK: Gửi khung tiếp theo.
- NAK: Trả về số khung bị hỏng.

![Pasted image 20230526000958](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230526000958.png)

**3. SR(Selective-Reject) ARQ**

- Đây là một kỹ thuật bù đắp cho nhược điểm của việc truyền lại tất cả các frame sau frame cuối cùng được xác nhận của GBn ARQ.  
- SR ARQ chỉ truyền lại các khung bị hỏng, bị mất.  
- Do đó, phải thực hiện sắp xếp lại dữ liệu riêng biệt và cần có bộ đệm riêng.  
- Cần phải sắp xếp dữ liệu nhận được bằng cách đặt bộ đệm ở phía nhận.

### Congestion Control

Đây là một kỹ thuật để giải quyết việc truyền dữ liệu của người gửi và tốc độ xử lý dữ liệu của mạng.  
Nếu một bộ định tuyến bị quá tải dữ liệu và không thể xử lý tất cả dữ liệu, các máy chủ sẽ truyền lại, điều này chỉ làm tăng thêm tắc nghẽn, dẫn đến tràn hoặc mất dữ liệu.  
Khái niệm kiểm soát tắc nghẽn là kiểm soát tốc độ truyền dữ liệu được gửi từ người gửi để tránh tắc nghẽn mạng.

**1. AIMD (Additive Increase Multicative Decrease)**

- Đây được gọi là thuật toán tăng/giảm tổng sản phẩm.  
- Nó bắt đầu bằng cách gửi một gói lúc đầu và nếu gói được truyền đến mà không gặp sự cố, thì tăng window size lên 1. Nếu truyền gói không thành công hoặc xảy ra TIME_OUT, window size sẽ giảm đi một nửa.  
- Phương pháp này là công bằng.  
- Khi nhiều máy chủ chia sẻ một mạng, người vào sau sẽ gặp bất lợi lúc đầu, nhưng có một đặc điểm là hội tụ về trạng thái cân bằng theo thời gian.  
- Vấn đề là không thể sử dụng băng thông cao của mạng ban đầu và không thể phát hiện trước tắc nghẽn mạng và băng thông chỉ bị giảm sau khi mạng bị tắc nghẽn.

**2. Slow Start**

- Mặc dù AIMD hoạt động hiệu quả xung quanh thông lượng của mạng, nhưng nó có nhược điểm là mất quá nhiều thời gian để tăng tốc độ truyền ban đầu.
- Slow Start, giống như AIMD, bắt đầu bằng cách gửi từng gói một. Phương pháp này tăng kích thước cửa sổ lên 1 cho mỗi gói ACK nếu gói đến mà không gặp sự cố. Tức là sau một RTT (Round Trip Time), kích thước cửa sổ tăng gấp đôi.  
- Do đó, hình dạng của đồ thị trở thành hàm mũ (2^n).  
- Nếu tắc nghẽn xảy ra, giảm window size xuống còn 1.  
- Lúc đầu, không có thông tin để dự đoán dung lượng của mạng, nhưng một khi tắc nghẽn xảy ra, thông lượng của mạng có thể được dự đoán ở một mức độ nào đó, do đó window size được tăng lên dưới dạng hàm mũ cho đến một nửa window size nơi xảy ra tắc nghẽn.

![Pasted image 20230526002849](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230526002849.png)

- Kích thước của cửa sổ được tăng lên gấp 2 lần cho đến khi đạt đến ngưỡng xác định (threshold).
- Mặc dù tên Slow Start được sử dụng, nhưng kích thước của dữ liệu được truyền tăng theo cấp số nhân vì nó tăng gấp đôi cho mỗi lần truyền.
- Khi window size đạt đến giá trị threshold, nó sẽ chuyển sang giai đoạn tránh tắc nghẽn (**Congestion Avoidance**).  

![Pasted image 20230526003335](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230526003335.png)

- **Congestion Avoidance**:
	- Sau khi window size đạt đến giá trị giới hạn, khả năng mất dữ liệu sẽ tăng lên.
	- Do đó, để tránh điều này, window size được tăng tuyến tính thêm 1.  
	- Khi không nhận được ACK từ bên nhận trong một khoảng thời gian nhất định.  
		- Xuất hiện thời gian chờ: Đã xảy ra tắc nghẽn mạng.  
		- Nếu nó được công nhận là tắc nghẽn  
			- Giảm window size về 1.  
			- Đồng thời, giảm threshold xuống một nửa window size khi xảy ra mất gói.
- **Fast Recovery**
	- Khi nó trở nên tắc nghẽn, đây là phương pháp giảm một nửa window size thay vì giảm xuống 1 và tăng tuyến tính.  
	- Nếu phương pháp **fast recovery** được áp dụng, nó sẽ hoạt động theo phương pháp **AIMD** thuần túy sau khi gặp tắc nghẽn một lần.
- **Fast Retransmit**
	- Khi bên nhận nhận được một gói, nó sẽ gửi một gói ACK ngay cả khi gói tiếp theo đến mà gói đầu tiên không đến. Tuy nhiên, số thứ tự của gói tiếp theo của gói cuối cùng đã đến theo thứ tự được tải trên gói ACK và được gửi đi. Do đó, nếu một gói bị mất ở giữa, bên truyền sẽ nhận được gói ACK có số thứ tự trùng lặp. Nếu điều này được phát hiện, gói của trình tự vi phạm có thể được truyền lại.
	- Fast Retransmit truyền lại khi nhận được ba (3 ACK) gói có trình tự trùng lặp. Và hiện tượng này được coi là tắc nghẽn nhẹ và window size giảm đi một nửa.
