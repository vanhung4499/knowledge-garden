---
title: Network Interview Part 3
tags: [network, interview]
categories: [network, interview]
date created: 2023-08-18
date modified: 2023-08-18
---

# Network Interview Q&A Part 3

## Quy trình sử dụng Session như thế nào?

Quy trình như sau:

- Khi người dùng đăng nhập, người dùng gửi biểu mẫu chứa tên người dùng và mật khẩu trong yêu cầu HTTP;
- Máy chủ xác minh tên người dùng và mật khẩu, nếu chính xác thì lưu thông tin người dùng vào Redis, nó được gọi là Session ID trong Redis;
- Phản hồi từ máy chủ chứa trường Set-Cookie trong tiêu đề phản hồi, chứa Session ID này, sau đó được lưu trữ trong trình duyệt của người dùng;
- Khi người dùng thực hiện yêu cầu tiếp theo đến cùng một máy chủ, nó sẽ bao gồm giá trị Cookie này, máy chủ nhận được yêu cầu và trích xuất Session ID, sau đó lấy thông tin người dùng từ Redis và tiếp tục thực hiện các hoạt động kinh doanh trước đó.

**Lưu ý**: Vấn đề về bảo mật của Session ID, không được cho phép kẻ tấn công xâm nhập dễ dàng, vì vậy không nên tạo ra một giá trị Session ID dễ đoán. Ngoài ra, cần thường xuyên tạo lại Session ID. Trong các tình huống yêu cầu bảo mật cực cao, chẳng hạn như giao dịch chuyển tiền, ngoài việc sử dụng Session để quản lý trạng thái người dùng, cần phải xác minh lại người dùng, ví dụ như yêu cầu nhập lại mật khẩu hoặc sử dụng mã xác minh qua tin nhắn SMS.

## Khi nào nên sử dụng Session và Cookie (các tình huống phù hợp)?

- Cookie chỉ có thể lưu trữ chuỗi ASCII, trong khi Session có thể lưu trữ bất kỳ loại dữ liệu nào, vì vậy khi xem xét độ phức tạp của dữ liệu, Session là lựa chọn hàng đầu.
- Cookie được lưu trữ trên trình duyệt, dễ bị xem trái phép. Nếu cần lưu trữ một số dữ liệu riêng tư trong Cookie, có thể mã hóa giá trị Cookie, sau đó giải mã trên máy chủ.
- Đối với các trang web lớn, nếu tất cả thông tin người dùng đều được lưu trữ trong Session, thì sẽ tốn nhiều tài nguyên, do đó không khuyến nghị lưu trữ tất cả thông tin người dùng trong Session.

## Sự khác biệt giữa Cookies và Session là gì?

Cookie và Session đều là giải pháp để duy trì trạng thái giữa máy khách và máy chủ.

1. Vị trí lưu trữ khác nhau: Cookie: lưu trữ trên máy khách, Session: lưu trữ trên máy chủ. Dữ liệu lưu trữ trong Session an toàn hơn.
2. Loại dữ liệu lưu trữ khác nhau: Cả hai đều có cấu trúc key-value, nhưng loại dữ liệu của value khác nhau.
   - Cookie: value chỉ có thể là chuỗi ASCII.
   - Session: value có thể là đối tượng.
3. Giới hạn kích thước lưu trữ khác nhau:
   - Cookie: kích thước bị giới hạn bởi trình duyệt, thường là 4KB.
   - Session: lý thuyết là giới hạn bởi bộ nhớ hiện tại.
4. Kiểm soát vòng đời:
   - Vòng đời của Cookie kết thúc khi trình duyệt đóng.
   - Vòng đời của Session là không liên tục, bắt đầu tính từ khi tạo ra, ví dụ trong 20 phút không truy cập vào Session, thì vòng đời của Session bị hủy.

## Bạn có hiểu về cuộc tấn công DDoS không?

Cuộc tấn công DDoS (Distributed Denial of Service) là một cuộc tấn công mà người tấn công sử dụng nhiều máy tính khác nhau để tạo ra một lượng lớn yêu cầu đến một máy chủ hoặc mạng, gây quá tải và làm cho dịch vụ trở nên không khả dụng.

Cuộc tấn công DDoS có thể gây ra sự cố mạng, làm gián đoạn hoạt động của một trang web hoặc dịch vụ trực tuyến, và gây thiệt hại cho doanh nghiệp hoặc tổ chức.

Để ngăn chặn cuộc tấn công DDoS, có thể áp dụng các biện pháp như:

1) Giới hạn số lượng kết nối SYN mở cùng một lúc.

2) Rút ngắn thời gian chờ SYN mở.

3) Tắt các dịch vụ không cần thiết.

## MTU và MSS là gì?

MTU (maximum transmission unit) là đơn vị truyền tải tối đa, được quy định bởi phần cứng, ví dụ như MTU của Ethernet là 1500 byte.

MSS (maximum segment size) là kích thước phân đoạn tối đa của gói dữ liệu TCP được truyền mỗi lần, thông qua cơ chế thông báo từ bên gửi TCP đến bên nhận TCP về kích thước tối đa dữ liệu TCP có thể gửi trong mỗi phân đoạn. Giá trị MSS được tính bằng cách trừ MTU cho Header IPv4 (20 byte) và Header TCP (20 byte).

## HTTP có cơ chế bộ nhớ cache, nhưng làm thế nào để đảm bảo bộ nhớ cache là mới nhất? (Cơ chế hết hạn bộ nhớ cache)

Hướng dẫn `max-age` xuất hiện trong yêu cầu và thời gian lưu trữ bộ nhớ cache của tài nguyên nhỏ hơn thời gian được chỉ định trong chỉ thị này, thì bộ nhớ cache có thể được chấp nhận.

Hướng dẫn max-age xuất hiện trong phản hồi và đại diện cho thời gian mà tài nguyên được lưu trữ trong máy chủ bộ nhớ cache.

```html
Cache-Control: max-age=31536000
```

Trường Expires cũng có thể được sử dụng để thông báo cho máy chủ bộ nhớ cache về thời điểm tài nguyên sẽ hết hạn.

```html
Expires: Wed, 04 Jul 2012 08:26:05 GMT
```

- Trong HTTP/1.1, chỉ thị max-age được ưu tiên xử lý.
- Trong HTTP/1.0, chỉ thị max-age sẽ bị bỏ qua.

## Thông tin nào được chứa trong tiêu đề TCP?

- Số thứ tự (32 bit): Số thứ tự byte của luồng dữ liệu trên hướng truyền. Số thứ tự ban đầu được thiết lập với một giá trị ban đầu ngẫu nhiên (ISN), sau đó mỗi lần gửi dữ liệu, số thứ tự = ISN + offset của dữ liệu trong luồng byte. Ví dụ, nếu A -> B và ISN = 1024, và dữ liệu đầu tiên 512 byte đã được gửi đến B, thì khi gửi dữ liệu thứ hai, số thứ tự sẽ là 1024 + 512. Được sử dụng để giải quyết vấn đề gói tin bị xáo lộn.
- Số xác nhận (32 bit): Phản hồi từ bên nhận TCP về các gói tin TCP đã gửi từ bên gửi, giá trị là số thứ tự nhận được + 1.
- Độ dài tiêu đề (4 bit): Xác định số lượng từ 4 byte * độ dài tiêu đề, tối đa là 15, tức là 60 byte.
- Cờ (6 bit):
  - URG: Xác định xem con trỏ khẩn cấp có hiệu lực hay không.
  - ACK: Xác định xem số xác nhận có hiệu lực hay không (gói tin xác nhận). Được sử dụng để giải quyết vấn đề mất gói tin.
  - PSH: Gợi ý cho bên nhận lấy dữ liệu từ bộ đệm ngay lập tức.
  - RST: Yêu cầu bên nhận thiết lập lại kết nối (gói tin thiết lập lại).
  - SYN: Yêu cầu thiết lập kết nối (gói tin thiết lập kết nối).
  - FIN: Đóng kết nối (gói tin kết thúc kết nối).
- Window (16 bit): Cửa sổ nhận. Thông báo cho bên kia (bên gửi) biết bộ đệm của mình còn nhận được bao nhiêu byte dữ liệu. Được sử dụng để giải quyết điều khiển luồng.
- Checksum (16 bit): Bên nhận sử dụng CRC để kiểm tra xem toàn bộ đoạn dữ liệu có bị hỏng hay không.

## Các trạng thái kết nối phổ biến là gì?

Các trạng thái kết nối phổ biến trong TCP là:

- CLOSED: Kết nối đã đóng hoặc chưa được mở.
- LISTEN: Máy chủ đang lắng nghe yêu cầu kết nối từ phía khách hàng.
- SYN_SENT: Máy khách đã gửi yêu cầu kết nối và đang chờ phản hồi từ máy chủ.
- SYN_RECEIVED: Máy chủ đã nhận yêu cầu kết nối và gửi lại yêu cầu kết nối.
- ESTABLISHED: Kết nối đã được thiết lập và dữ liệu có thể được truyền qua nó.
- FIN_WAIT_1: Máy khách đã gửi yêu cầu đóng kết nối.
- FIN_WAIT_2: Máy khách đã nhận được phản hồi đóng kết nối từ máy chủ.
- CLOSE_WAIT: Máy chủ đã nhận yêu cầu đóng kết nối từ máy khách và đang chờ máy khách đóng kết nối.
- LAST_ACK: Máy khách đã nhận yêu cầu đóng kết nối từ máy chủ và gửi lại phản hồi đóng kết nối.
- TIME_WAIT: Máy khách và máy chủ đã đóng kết nối và đang chờ các gói tin cuối cùng được xóa khỏi mạng.

## TCP là gì?

TCP (Transmission Control Protocol - Giao thức Điều khiển Truyền tải) là một giao thức truyền tải dựa trên luồng byte, đáng tin cậy và hướng kết nối trong lớp truyền thông.

## Giới thiệu một số trường thông tin trong tiêu đề gói tin TCP và chức năng của chúng?

source port và destination port

> Hai trường này lần lượt là "cổng nguồn" và "cổng đích". Cổng nguồn là cổng địa phương, cổng đích là cổng từ xa.

Có thể hiểu như sau, chúng ta có nhiều phần mềm, mỗi phần mềm tương ứng với một cổng, ví dụ, nếu bạn muốn trao đổi dữ liệu với tôi, chúng ta cần biết cổng của bạn và tôi.

Một cách chính thức hơn:

> Mở rộng: Số cổng ứng dụng và địa chỉ IP của máy chủ ứng dụng được gọi chung là socket. IP: Số cổng, trên Internet, socket định danh duy nhất cho mỗi ứng dụng, cặp socket gồm cổng nguồn + IP nguồn + cổng đích + IP đích được gọi là "cặp socket", một cặp socket là một kết nối, một kết nối giữa một máy khách và một máy chủ.

Số thứ tự (Sequence Number)

> Được gọi là "số thứ tự". Dùng để đánh số từng byte trong luồng byte của giao tiếp TCP, để đảm bảo tính tuần tự của giao tiếp dữ liệu và tránh sự xáo lộn trong mạng. Bên nhận sẽ sử dụng số này để xác nhận và đảm bảo rằng các đoạn dữ liệu được chia tách được đặt đúng vị trí trong gói tin ban đầu. Số thứ tự ban đầu do chính mình quyết định, và các số thứ tự tiếp theo phụ thuộc vào ACK từ phía đối tác: SN_x = ACK_y (số thứ tự của x = ACK gửi cho x).

Nói một cách đơn giản, tương tự như số CMND, và cũng cần gửi vị trí hiện tại của mình vào thời điểm hiện tại, tương tự như địa chỉ trên CMND.

Số xác nhận (Acknowledgement Number)

> Được gọi là "số xác nhận". Số xác nhận là số mà bên nhận mong đợi nhận được kế tiếp. Số xác nhận phải là số thứ tự byte dữ liệu đã nhận thành công lần cuối cộng thêm 1. Chỉ khi cờ ACK trong trường thông tin được đặt là 1, trường số xác nhận mới có giá trị. Chức năng chính của nó là giải quyết vấn đề mất gói tin.

TCP Flag

> Tiêu đề TCP có 6 bit cờ, nhiều bit có thể được đặt thành 1 cùng một lúc, chủ yếu được sử dụng để điều khiển trạng thái TCP, lần lượt là URG, ACK, PSH, RST, SYN, FIN.

Tất nhiên chỉ giới thiệu ba trong số đó:

1. **ACK**: Cờ này có thể hiểu là khi bên gửi gửi dữ liệu đến bên nhận, khi gửi, ACK là 0, chỉ ra rằng bên nhận chưa trả lời, khi bên nhận nhận được dữ liệu, ACK được đặt thành 1, bên gửi nhận được sau đó biết rằng bên nhận đã nhận được dữ liệu.
2. **SYN**: Được hiểu là "Số thứ tự đồng bộ", là gói tin đầu tiên trong quá trình bắt tay TCP. Được sử dụng để thiết lập kết nối TCP. Cờ SYN và cờ ACK được sử dụng cùng nhau, khi yêu cầu kết nối, SYN = 1, ACK = 0; khi kết nối được đáp ứng, SYN = 1, ACK = 1; Gói tin này thường được sử dụng để quét cổng. Người quét gửi một gói tin chỉ có SYN, nếu máy chủ phản hồi bằng một gói tin, điều này cho thấy máy chủ tồn tại cổng đó.
3. **FIN**: Được hiểu là bên gửi đã đạt đến cuối dữ liệu, nghĩa là truyền dữ liệu giữa hai bên hoàn tất, không còn dữ liệu để truyền, sau khi gửi gói tin TCP có cờ FIN, kết nối sẽ bị đóng. Gói tin này cũng thường được sử dụng để quét cổng. Bên gửi chỉ còn lại một phần dữ liệu cuối cùng, đồng thời thông báo cho bên nhận rằng không còn dữ liệu để nhận, vì vậy sử dụng cờ FIN để thông báo, bên nhận nhìn thấy FIN này, oh! Đây là dữ liệu cuối cùng để nhận, nhận xong sẽ đóng; **Quá trình chia tay TCP bốn bước là bắt buộc**.

Kích thước cửa sổ (Window size)

> Được gọi là "kích thước cửa sổ trượt". Cửa sổ trượt được sử dụng để kiểm soát lưu lượng dữ liệu.

## Chức năng chính của mô hình bảy tầng OSI là gì?

**Tầng Vật lý (Physical Layer):** Cung cấp kết nối vật lý cho tầng Data Link và thực hiện truyền dẫn bit một cách trong suốt.

**Tầng Data Link (Data Link Layer):** Nhận dữ liệu từ tầng Physical và đóng gói thành các khung (frame) để truyền qua mạng. Đồng thời, kiểm soát lỗi và xác định địa chỉ vật lý của các thiết bị trong mạng.

**Tầng Mạng (Network Layer):** Chuyển tiếp dữ liệu giữa các mạng khác nhau bằng cách xác định địa chỉ mạng và lựa chọn đường đi tối ưu cho gói tin.

**Tầng Giao vận (Transport Layer):** Đảm bảo việc truyền dữ liệu tin cậy và đúng thứ tự giữa hai thiết bị kết nối. Chia dữ liệu thành các đoạn nhỏ hơn và gắn kết các đoạn này lại khi đến đích.

**Tầng Phiên (Session Layer):** Thiết lập, duy trì và kết thúc các phiên giao tiếp giữa các ứng dụng trên các thiết bị khác nhau.

**Tầng Trình diễn (Presentation Layer):** Đảm nhận việc biểu diễn dữ liệu và định dạng trước khi truyền và sau khi nhận dữ liệu. Nó cũng thực hiện mã hóa, nén và giải mã, giúp ứng dụng có thể hiểu và xử lý dữ liệu.

**Tầng Ứng dụng (Application Layer):** Cung cấp các dịch vụ mạng cho người dùng cuối, bao gồm các giao thức và ứng dụng như HTTP, FTP, DNS, SMTP, Telnet, v.v.

## 53、Bạn biết đến những giao thức phổ biến ở tầng ứng dụng không? Hãy đề cập đến một số giao thức mà bạn biết.

| Giao thức | Tên                                         | Cổng mặc định                   | Giao thức dưới                                                  |
| --------- | ------------------------------------------- | ------------------------------- | --------------------------------------------------------------- |
| HTTP      | Giao thức truyền tải siêu văn bản           | 80                              | TCP                                                             |
| HTTPS     | Giao thức truyền tải siêu văn bản an toàn   | 443                             | TCP                                                             |
| Telnet    | Giao thức đăng nhập từ xa                   | 23                              | TCP                                                             |
| FTP       | Giao thức truyền tập tin                    | 20 (dữ liệu) và 21 (điều khiển) | TCP                                                             |
| TFTP      | Giao thức truyền tập tin đơn giản           | 69                              | UDP                                                             |
| SMTP      | Giao thức truyền thư đơn giản (dùng để gửi) | 25                              | TCP                                                             |
| POP       | Giao thức thư tín (dùng để nhận)            | 110                             | TCP                                                             |
| DNS       | Dịch vụ phân giải tên miền                  | 53                              | TCP (khi truy vấn DNS server)  <br>UDP (khi truy vấn từ client) |

## Sau khi thiết lập một kết nối TCP với máy chủ, trình duyệt có đóng kết nối sau khi hoàn thành một yêu cầu HTTP không? Trong trường hợp nào kết nối sẽ bị đóng?

Trong HTTP/1.0, một máy chủ sẽ đóng kết nối TCP sau khi gửi một phản hồi HTTP. Tuy nhiên, việc thiết lập và đóng kết nối TCP sau mỗi yêu cầu sẽ tốn kém. Vì vậy, mặc dù không có quy định trong tiêu chuẩn, **một số máy chủ hỗ trợ Header Connection: keep-alive**. Điều này có nghĩa là sau khi hoàn thành một yêu cầu HTTP, kết nối TCP được sử dụng cho yêu cầu đó sẽ không bị đóng. Điều này cho phép kết nối được sử dụng lại cho các yêu cầu HTTP tiếp theo mà không cần thiết lập lại kết nối TCP, và giảm thiểu chi phí SSL nếu kết nối được duy trì.

**Kết nối duy trì** (Keep-Alive): Vì lợi ích của việc duy trì kết nối TCP, HTTP/1.1 đã thêm Connection header vào tiêu chuẩn và mặc định bật kết nối duy trì, trừ khi yêu cầu có Connection: close, trong trường hợp đó, trình duyệt và máy chủ sẽ duy trì kết nối TCP trong một khoảng thời gian nhất định sau khi hoàn thành yêu cầu HTTP, không đóng kết nối ngay sau khi hoàn thành một yêu cầu.

Mặc định, khi thiết lập kết nối TCP, nó sẽ không bị đóng, chỉ khi yêu cầu HTTP có khai báo Connection: close thì kết nối mới được đóng sau khi hoàn thành yêu cầu.

## Thông tin liên quan đến bắt tay ba bước(Three-way Handshake)

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230818223538.png)

Ba bước bắt tay (Three-way Handshake) thực chất là quá trình thiết lập một kết nối TCP, trong đó khách hàng và máy chủ gửi tổng cộng 3 gói tin. Ba bước bắt tay chủ yếu được sử dụng để xác nhận khả năng nhận và gửi của cả hai bên, và chuẩn bị số thứ tự khởi tạo của mình cho việc truyền tin đáng tin cậy. Thực tế là nó kết nối đến cổng được chỉ định trên máy chủ, thiết lập kết nối TCP và đồng bộ số thứ tự và số xác nhận của cả hai bên, trao đổi thông tin về "kích thước cửa sổ TCP".

### Câu trả lời thứ nhất

Ban đầu, khách hàng ở trạng thái "Closed" và máy chủ ở trạng thái "Listen", thực hiện ba bước bắt tay như sau:

- Bước 1: Khách hàng gửi một gói tin SYN với số thứ tự khởi tạo của khách hàng (ISN(c)) đến máy chủ. Lúc này, khách hàng ở trạng thái "SYN_SEND".

    Trong tiêu đề, cờ SYN được đặt thành 1, số thứ tự ban đầu là seq = x. Gói tin SYN không mang dữ liệu, nhưng nó sẽ tiêu thụ một số thứ tự.

- Bước 2: Máy chủ nhận được gói tin SYN từ khách hàng, nếu đồng ý kết nối, máy chủ sẽ gửi một gói tin SYN của riêng mình như là phản hồi, đồng thời chỉ định số thứ tự khởi tạo của máy chủ (ISN(s)). Đồng thời, máy chủ sẽ sử dụng ISN của khách hàng + 1 làm giá trị ACK, cho biết máy chủ đã nhận được gói tin SYN của khách hàng. Lúc này, máy chủ ở trạng thái "SYN_RCVD".

    Trong gói tin xác nhận, cờ SYN và ACK đều được đặt thành 1, số thứ tự xác nhận là ack = x + 1, số thứ tự khởi tạo là seq = y.

- Bước 3: Khách hàng nhận được gói tin SYN + ACK từ máy chủ, biết rằng nó có thể gửi gói tin dữ liệu với số thứ tự tiếp theo, sau đó gửi một gói tin ACK như là phản hồi. Tất nhiên, khách hàng cũng sẽ sử dụng ISN của máy chủ + 1 làm giá trị ACK, cho biết nó đã nhận được gói tin SYN của máy chủ. Lúc này, khách hàng ở trạng thái "ESTABLISHED". Máy chủ cũng ở trạng thái "ESTABLISHED". Khi đó, cả hai bên đã thiết lập kết nối.

    Trong gói tin ACK, cờ xác nhận được đặt thành 1, số thứ tự xác nhận là ack = y + 1, số thứ tự là seq = x + 1 (ban đầu là seq = x, vì đây là gói tin thứ hai, nên phải +1). Gói tin ACK có thể mang dữ liệu, nếu không có dữ liệu, thì không tiêu thụ số thứ tự.

Khi khách hàng gửi yêu cầu kết nối, nó sẽ kích hoạt ba bước bắt tay.

### Câu trả lời thứ hai

- **Trạng thái ban đầu**: Khách hàng ở trạng thái "closed" (đóng), máy chủ ở trạng thái "listen" (lắng nghe).
- **Bước 1**: Khách hàng gửi một gói tin yêu cầu, gửi cờ SYN = 1 (đồng bộ) và số thứ tự khởi tạo của khách hàng (seq = x) đến máy chủ. Sau khi gửi xong, khách hàng chuyển sang trạng thái "SYN_SEND" (gửi SYN).
- **Bước 2**: Máy chủ nhận được gói tin yêu cầu SYN từ khách hàng, nếu đồng ý kết nối, máy chủ sẽ gửi một gói tin SYN của riêng mình như là phản hồi, đồng thời chỉ định số thứ tự khởi tạo của máy chủ (seq = y). Đồng thời, máy chủ sẽ sử dụng số thứ tự xác nhận (ack) là ISN của khách hàng + 1, cho biết máy chủ đã nhận được gói tin SYN của khách hàng. Lúc này, máy chủ ở trạng thái "SYN_RCVD" (nhận SYN).
- **Bước 3**: Khách hàng nhận được gói tin SYN của máy chủ và gửi một gói tin ACK như là phản hồi. Trong gói tin ACK, khách hàng sử dụng số thứ tự xác nhận (ack) là ISN của máy chủ + 1, cho biết khách hàng đã nhận được gói tin SYN của máy chủ. Lúc này, khách hàng và máy chủ đều ở trạng thái "ESTABLISHED" (đã thiết lập kết nối).

## Tại sao cần ba bước bắt tay, hai bước không đủ?

Để hiểu rõ vấn đề này, chúng ta cần hiểu mục đích của ba bước bắt tay và liệu có thể sử dụng hai bước bắt tay để đạt được cùng mục đích.

- Bước bắt tay thứ nhất: Khách hàng gửi gói tin mạng và máy chủ nhận được. Điều này cho phép máy chủ kết luận: khả năng gửi của khách hàng, khả năng nhận của máy chủ là bình thường.
- Bước bắt tay thứ hai: Máy chủ gửi gói tin và khách hàng nhận được. Điều này cho phép khách hàng kết luận: khả năng nhận, gửi của máy chủ, khả năng nhận, gửi của khách hàng là bình thường. Tuy nhiên, máy chủ vẫn chưa thể xác nhận khả năng nhận của khách hàng có bình thường hay không.
- Bước bắt tay thứ ba: Khách hàng gửi gói tin và máy chủ nhận được. Điều này cho phép máy chủ kết luận: khả năng nhận, gửi của khách hàng là bình thường, khả năng nhận, gửi của máy chủ cũng là bình thường.

Do đó, cần ba bước bắt tay để xác nhận khả năng nhận và gửi của cả hai bên.

Hãy tưởng tượng nếu chỉ sử dụng hai bước bắt tay, thì có thể xảy ra tình huống như sau:

> Ví dụ khách hàng gửi yêu cầu kết nối, nhưng do gói tin yêu cầu kết nối bị mất nên không nhận được xác nhận. Sau đó, khách hàng gửi lại yêu cầu kết nối lần thứ hai. Khi nhận được xác nhận, kết nối được thiết lập. Sau khi truyền dữ liệu xong, kết nối được giải phóng. Tổng cộng khách hàng đã gửi hai gói tin yêu cầu kết nối, trong đó gói tin đầu tiên bị mất, gói tin thứ hai đến được máy chủ. Tuy nhiên, gói tin đầu tiên bị mất chỉ là do **nằm lâu tại một số điểm mạng, trì hoãn đến một thời điểm sau khi kết nối được giải phóng**. Lúc này, máy chủ sai lầm rằng khách hàng lại gửi yêu cầu kết nối mới, do đó gửi gói tin xác nhận để đồng ý thiết lập kết nối mới. Trong trường hợp này, khách hàng bỏ qua gói tin xác nhận từ máy chủ và không gửi dữ liệu, trong khi máy chủ tiếp tục chờ đợi khách hàng gửi dữ liệu, lãng phí tài nguyên.

## Khái niệm hàng đợi bán kết nối là gì?

Khi máy chủ nhận được SYN từ khách hàng lần đầu tiên, nó sẽ ở trạng thái SYN_RCVD, tại thời điểm này hai bên chưa hoàn toàn thiết lập kết nối. Máy chủ sẽ đặt yêu cầu kết nối này vào một **hàng đợi**, chúng ta gọi hàng đợi này là hàng đợi bán kết nối.

Tất nhiên, còn có một **hàng đợi kết nối đầy đủ**, đó là những kết nối đã hoàn thành ba bước bắt tay và thiết lập kết nối. Nếu hàng đợi đầy, có thể xảy ra hiện tượng mất gói tin.

Ở đây, chúng ta cũng bổ sung một chút về vấn đề **số lần gửi lại SYN-ACK**: Sau khi máy chủ gửi gói tin SYN-ACK, nếu không nhận được gói tin xác nhận từ khách hàng, máy chủ sẽ gửi lại lần đầu tiên và chờ một khoảng thời gian. Nếu sau một khoảng thời gian vẫn không nhận được gói tin xác nhận từ khách hàng, máy chủ sẽ gửi lại lần thứ hai. Nếu số lần gửi lại vượt quá số lần gửi lại tối đa được quy định trong hệ thống, thông tin kết nối này sẽ bị xóa khỏi hàng đợi bán kết nối. Lưu ý rằng thời gian chờ giữa các lần gửi lại không nhất thiết phải giống nhau, thường sẽ tăng theo cấp số nhân, ví dụ thời gian chờ là 1s, 2s, 4s, 8s…

## ISN (Initial Sequence Number) có cố định không?

Khi một bên gửi gói tin SYN để thiết lập kết nối, nó chọn một số thứ tự ban đầu cho kết nối. ISN thay đổi theo thời gian, vì vậy mỗi kết nối sẽ có một ISN khác nhau. ISN có thể được coi như một bộ đếm 32 bit, nhưng nó không chỉ là một bộ đếm đơn giản, thường tăng 1 sau khoảng thời gian 4ms.

> ISN = M + F(localhost, localport, remotehost, remoteport) (M là bộ đếm), ISN nên được xác định bằng công thức này, F là thuật toán băm, không phải là một bộ đếm đơn giản.

Mục đích của việc chọn số thứ tự này là để ngăn chặn các gói tin bị trì hoãn trong mạng sau này lại được truyền đi và dẫn đến một bên trong kết nối hiểu sai về nó.

**Một trong những chức năng quan trọng của ba bước bắt tay là trao đổi ISN (Initial Sequence Number) giữa khách hàng và máy chủ để cho nhau biết cách lắp ráp dữ liệu theo thứ tự khi nhận dữ liệu tiếp theo. Nếu ISN là cố định, kẻ tấn công dễ dàng đoán được số xác nhận tiếp theo, do đó ISN được tạo động.**

## Trong quá trình ba bước bắt tay, có thể mang dữ liệu không?

Thực tế là trong lần thứ ba của bước bắt tay, có thể mang dữ liệu. Tuy nhiên, **lần thứ nhất và lần thứ hai của bước bắt tay không thể mang dữ liệu**.

Tại sao lại như vậy? Mọi người có thể đặt câu hỏi, nếu lần thứ nhất của bước bắt tay có thể mang dữ liệu, nếu có ai đó muốn tấn công máy chủ một cách độc hại, thì họ có thể đặt nhiều dữ liệu vào gói tin SYN đầu tiên. Vì kẻ tấn công không quan tâm đến khả năng nhận và gửi của máy chủ, sau đó họ có thể liên tục gửi gói tin SYN, điều này sẽ khiến máy chủ phải mất rất nhiều thời gian và bộ nhớ để nhận các gói tin này.

Nghĩa là, **lần thứ nhất của bước bắt tay không thể chứa dữ liệu, một trong những lý do đơn giản là nó sẽ làm cho máy chủ dễ bị tấn công hơn. Đối với lần thứ ba, lúc này khách hàng đã ở trạng thái ESTABLISHED. Đối với khách hàng, họ đã thiết lập kết nối và cũng đã biết khả năng nhận và gửi của máy chủ là bình thường, vì vậy việc mang dữ liệu không có vấn đề gì.**

## Tấn công SYN là gì?

**Phân bổ tài nguyên của máy chủ được thực hiện trong quá trình hai bước bắt tay, trong khi tài nguyên của khách hàng được phân bổ trong quá trình hoàn tất ba bước bắt tay**, vì vậy máy chủ dễ bị tấn công SYN. Tấn công SYN là khi Client trong một khoảng thời gian ngắn giả mạo một lượng lớn địa chỉ IP không tồn tại và liên tục gửi gói tin SYN đến Server, Server sẽ gửi lại gói tin xác nhận và chờ Client xác nhận, do địa chỉ nguồn không tồn tại, nên Server phải tiếp tục gửi lại cho đến khi hết thời gian chờ, các gói tin SYN giả mạo này sẽ chiếm giữ hàng đợi kết nối chưa hoàn tất trong thời gian dài, dẫn đến việc các yêu cầu SYN bình thường bị từ chối do hàng đợi đầy, gây tắc nghẽn mạng hoặc thậm chí là làm hỏng hệ thống. Tấn công SYN là một dạng tấn công DoS/DDoS.

Phát hiện tấn công SYN rất dễ dàng, khi bạn thấy một lượng lớn trạng thái bán kết nối (half-open connection) trên máy chủ, đặc biệt là địa chỉ IP nguồn ngẫu nhiên, bạn có thể kết luận đó là một cuộc tấn công SYN. Trên Linux/Unix, bạn có thể sử dụng lệnh netstat có sẵn trong hệ thống để phát hiện tấn công SYN.

```
netstat -n -p TCP | grep SYN_RECV
```

Có một số phương pháp phòng chống tấn công SYN phổ biến như sau:

- Rút ngắn thời gian chờ (SYN Timeout)
- Tăng số lượng kết nối bán tối đa
- Bảo vệ qua cổng định tuyến
- Sử dụng công nghệ SYN cookies
