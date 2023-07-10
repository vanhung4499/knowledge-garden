---
categories: [network, computer-science]
title: HTTP
date created: 2023-05-26
date modified: 2023-07-10
tags: [network, computer-science]
dg-publish: true
---

## HTTP là gì?

- [[Cards/Network/HTTP|HTTP]] (Hypertext Transfer Protocol) là một giao thức theo mô hình client/server để trao đổi dữ liệu trên Internet.
- Nó là một giao thức ở tầng Application và hoạt động trên TCP/IP.
- Có một số loại dữ liệu có thể được gửi qua HTTP, chẳng hạn như HTML, hình ảnh, video, âm thanh và tài liệu văn bản.

![Pasted image 20230527010658](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230527010658.png)

## Cách thức hoạt động của HTTP

![Pasted image 20230527011004](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230527011004.png)

[[HTTP]] về cơ bản có cấu trúc **request/response**.

Khi máy khách (client) gửi HTTP request đến máy chủ (server), máy chủ sẽ gửi lại HTTP response.

Tất cả các giao tiếp giữa máy khách và máy chủ được thực hiện thông qua request và response.

## [[URI]]

[[URI]] (Uniform Resource Identifier) là một giao thức khác độc lập với HTTP.

HTTP là một giao thức vận chuyển và URI là một giao thức để thông báo vị trí của tài nguyên.

Là tên viết tắt của Uniform Resource Identifiers (URI), nó được sử dụng để chỉ ra vị trí của tài nguyên sẽ được truy cập trên World Wide Web (www).

Tài nguyên có thể là bất kỳ thứ gì từ tài liệu HTML, hình ảnh, video, âm thanh và tài liệu văn bản.

[[URI]] được chia thành 2 nhánh: **[[URL]]** và **[[URN]]**

**[[URL]] (Uniform Resource Locator)**

![Pasted image 20230527022534](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230527022534.png)

[[URL]] (Uniform Resource Locator) là **định vị tài nguyên** hay nói dễ hiểu là URL chỉ ra vị trí và cách thức lấy tài nguyên.  

- [https://google.com]( https://google.com ) : Đây là URL vì vừa chỉ ra địa chỉ tài nguyên ( https, http, file hay ssh…) vừa chỉ ra được giao thức truy cập tài nguyên. Đây cũng có thể gọi là URI).
- [google.com]( https://google.com ) : Đây không là URL vì không chỉ ra được giao thức truy cập. Đây cũng có thể gọi là URI.

**[[URN]] ( Uniform Resource Name )**

[[URN]] ( Uniform Resource Name ) là **định danh tài nguyên** hay nói dễ hiểu là nó chỉ ra tên của tài nguyên.

- [org/img.png:](http://stg.org/img.png:) Đây là URN vì nó sẽ cung cấp cho ta định danh của tài nguyên này trên mạng, khác URL ở chỗ URN này sẽ không chỉ cho ta chính xác sử dụng giao thức hay cách nào để lấy tài nguyên.

**Tóm lại**

Giống như con người để xác thực một ai đó chúng ta cần tên và địa chỉ của người đó thì [[URL]] sẽ có nhiệm vụ là chỉ ra địa chỉ và phương thức để đi đến người đó, còn [[URN]] sẽ có nhiệm vụ xác định tên của người đó.

![Pasted image 20230527022830](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230527022830.png)

## Quá trình phát triển HTTP (HTTP/1.0 - HTTTP/3)

Về cơ bản, HTTP được sử dụng để giao tiếp dịch vụ web dưới dạng tầng ứng dụng phía trên tầng vận chuyển. Làm thế nào mà trang web này bắt đầu?

**Phát minh ra [[WWW]]**  

HTTP là giao thức cơ bản của World Wide Web. Nó được phát minh bởi Tim Berners-Lee từ năm 1989 đến năm 1991 và ban đầu được gọi là Mesh, nhưng được đổi tên thành World Wide Web (WWW) trong quá trình triển khai vào năm 1990.

### 🥚 HTTP/0.9

> Giao thức một dòng

HTTP/0.9 tuân theo kiến ​​trúc client-server thực sự đơn giản.

- Request: bao gồm một dòng duy nhất  
- URL: Chỉ có phương thức GET

```http
<!-- HTTP request -->
GET /mypage.html
 
<!-- HTTP response -->
<html>
Simple HTML Page
</html>
```

**Đặc điểm**

- Không có HTTP Header -> tức là chỉ có thể gửi các tệp HTML  
- Không có trạng thái hoặc mã lỗi

### 🥚 HTTP/1.0

> Thêm khả năng mở rộng, mở rộng chức năng HTTP hiện có

Vì HTTP /0.9 rất hạn chế, một số nỗ lực của nhà phát triển nhằm tăng khả năng mở rộng đã nhanh chóng được thực hiện và HTTP /1.0 đã ra đời.

**Đặc điểm**

- Thông tin phiên bản được bao gồm trong mỗi yêu cầu.  
- Phương thức request đã được mở rộng thành ba loại: **GET, HEAD và POST**.  
- **Status code** được bao gồm ở đầu mỗi response để trình duyệt có thể biết và hành động dựa trên sự thành công hay thất bại của request.  
- Khái niệm về HTTP Header đã xuất hiện. Điều này cho phép truyền siêu dữ liệu từ máy chủ và trình duyệt, làm cho giao thức trở nên linh hoạt và có thể mở rộng.  
- Sự ra đời của HTTP Header mới (nhờ **Content-Type**) giúp truyền các file không phải HTML.

```http
<!-- HTTP request -->
GET /mypage.html HTTP/1.0
User-Agent: NCSA_Mosaic/2.0 (Windows 3.1)
 
<!-- HTTP response -->
200 OK
Date: Tue, 15 Nov 1994 08:12:31 GMT
Server: CERN/3.0 libwww/2.17
Content-Type: text/html
<HTML>
A page with an image
  <IMG SRC="/myimage.gif">
</HTML>
```

### 🐣 HTTP/1.1

> HTTP được chuẩn hóa (Giao thức chuẩn)

HTTP/1.1 đã làm rõ sự mơ hồ và đưa ra nhiều cải tiến.

**Đặc điểm HTTP/1.1**

#### 1. Persistent connection (keep-alive)

Trong HTTP/1.0, theo mặc định, một request được xử lý cho mỗi kết nối và kết nối TCP bị chấm dứt ngay lập tức khi nhận được response.

Khi các trang web trở nên phức tạp hơn, khi các yêu cầu HTTP được thực hiện nhiều lần trong một trang, quy trình bắt tay TCP mới phải được thực hiện mỗi lần, điều này làm chậm tốc độ. (tăng [[RTT]])

- Phương pháp mạch ảo TCP đảm bảo độ tin cậy, nhưng có nhược điểm là chậm.

Vì vậy, theo mặc định, kết nối tcp được thiết lập một lần, sau đó sử dụng lại.

![Pasted image 20230527204249](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230527204249.png)

**Keep-Alive Header**

Lúc này nếu thời gian duy trì kết nối càng lâu thì server xảy ra quá tải nên thời gian duy trì kết nối bị hạn chế.

(HTTP/1.0 cũng có tính năng này, nhưng nó không được chuẩn hóa và được chuẩn hóa từ HTTP/1.1 và được đặt làm tùy chọn cơ bản.)

#### 2. Pipelining

Trước đây, khi gửi nhiều yêu cầu, nếu một yêu cầu và phản hồi được hoàn thành trước khi gửi yêu cầu tiếp theo, thì kỹ thuật đường ống dẫn giúp giảm độ trễ giao tiếp bằng cách cho phép gửi yêu cầu thứ hai trước khi phản hồi cho yêu cầu đầu tiên được truyền hoàn toàn.

Cải thiện độ trễ bằng cách cho phép gửi nhiều yêu cầu cùng một lúc.

![Pasted image 20230527205222](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230527205222.png)

#### 3. Cache-control

Khi giao tiếp với HTTP, máy Client dành thời gian đi qua mạng và máy Server tiêu tốn thời gian hoặc tải cần thiết để xử lý yêu cầu.

Trong quá trình này, nếu dữ liệu mà client nhận được trước đó và dữ liệu mới được yêu cầu giống nhau, thì có thể lãng phí khi thực hiện cùng một quy trình như trước đây.

Một phương pháp có thể được sử dụng như một giải pháp để giảm lãng phí đó là **Cache-Control** do HTTP cung cấp. Bằng cách sử dụng Cache-Control một cách thích hợp, tùy thuộc vào tình huống, máy chủ có thể giảm tải và máy khách có thể tiết kiệm thời gian đi qua mạng.

Đôi khi cần cung cấp các chỉ thị cụ thể cho máy chủ hoặc máy khách để lưu vào bộ nhớ đệm HTTP. Cache-Control header được sử dụng cho mục đích này.﻿

#### 4. Compression/Decompression (Encoding)

Đây là chức năng cho phép Client và Server tối ưu được tốc độ và băng thông khi trao đổi thông tin. Cơ chế compress (nén) phổ biến nhất là gzip và Deflate.

![Pasted image 20230527215935](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230527215935.png)

### 🐣 HTTP/2

> Giao thức cho hiệu suất tốt hơn  
> **HTTP over SPDY**

**HTTP HOL(Head-Of-Line) Blocking**

![Pasted image 20230528141310](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230528141310.png)

Mặc dù HTTP/1.1 rất linh hoạt và có thể mở rộng, nhưng nó phải được xử lý tuần tự vì nó được thiết kế để xử lý một yêu cầu trong một kết nối trong khi dựa trên giao thức TCP/IP. Để giải quyết vấn đề này, kỹ thuật pipelining đã được giới thiệu, nhưng vì phản hồi phải được gửi theo **FIFO (First In, First Out)**, nếu phản hồi của yêu cầu đầu tiên tới máy chủ bị trì hoãn, thì phản hồi của các yêu cầu tiếp theo cũng bị trì hoãn. Đây chính là hiện tượng HOLB.

#### ✔️ SPDY

Do những vấn đề này (sự chậm trễ), Google đã triển khai và phát hành giao thức SPDY (viết tắt của Speedy) trong nửa đầu năm 2010.

🚩 Mục tiêu: Giảm độ trễ tải trang web.

![Pasted image 20230527220804](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230527220804.png)

**Đặc điểm của HTTP/2**

- HTTP/2 hoạt động dựa trên giao thức có tên là SPDY.
- Và SPDY luôn hoạt động trên **[[TLS]]**(**Transport Layer Security**) (tức là bắt buộc phải có **[[HTTPS]]**)

#### 1. Binary Framing  

- HTTP/1.1 là một giao thức dựa trên văn bản được viết bằng mã ASCII, dễ đọc nhưng làm tăng kích thước dữ liệu.  
- Vì HTTP/2 chuyển đổi dữ liệu thành dạng nhị phân và truyền dữ liệu đó nên quá trình phân tích cú pháp sẽ nhanh hơn và ít xảy ra lỗi hơn.

![Pasted image 20230527223401](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230527223401.png)

#### 2. Request Response Multiplexing

- HTTP/1.1 có thể xử lý một yêu cầu trong một kết nối TCP và phản hồi cho yêu cầu phải được xử lý tuần tự. Vì vậy, vấn đề tương tự như HOLB đã xảy ra.
- HTTP/2 giải quyết vấn đề trên bằng ghép kênh (multiplexing).
- HTTP/2 có thể xử lý nhiều yêu cầu trong một kết nối TCP vì nó được chia nhỏ thành các đơn vị gọi là **stream**, **message** và **frame**.

![Pasted image 20230527224032](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230527224032.png)

- **Stream**: stream dạng byte hai chiều được truyền trong một kết nối đã thiết lập; nhiều stream có thể tồn tại trên cùng một kết nối TCP.
- **Message**: Một chuỗi hoàn chỉnh các frame được ánh xạ tới một message yêu cầu hoặc phản hồi logic.
- **Frame**: Đơn vị giao tiếp nhỏ nhất trong HTTP/2. Mỗi đơn vị nhỏ nhất chứa một frame header. Ở mức tối thiểu, frame header này xác định stream chứa frame đó. HEADERS Type Frame và DATA Type Frame.

![Pasted image 20230527224341](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230527224341.png)

Như thể hiện trong hình trên, nhiều stream song song (ba) có thể tồn tại trong cùng một kết nối TCP. Khi các luồng được trộn lẫn và truyền đi, chúng được kết hợp lại ở phía server bằng cách sử dụng **stream number**.

#### 3. HTTP Header Data Compression

Nó nén các header tồn tại với nội dung rất giống nhau giữa các yêu cầu liên tiếp trong khi loại bỏ chi phí không cần thiết bằng cách không truyền lại các trường trùng lặp với nội dung của header trước đó.

Tại thời điểm này, một phương pháp nén header được gọi là **HPACK** sử dụng kỹ thuật Mã hóa Huffman **([[Huffman Coding]])** để chỉ truyền lại phần đã thay đổi.

#### 4. Server Push

Công nghệ server push, dự đoán yêu cầu của máy khách và đặt dữ liệu (tài nguyên) mà máy khách sẽ yêu cầu trước vào bộ đệm của máy khách.

Ví dụ: HTML bao gồm các tệp css hoặc js, nhưng trước đây, cả HTML và css đều phải được yêu cầu để nhận được. Trong HTTP/2, khi yêu cầu HTML và phản hồi, máy chủ cũng có thể đẩy tệp css và cung cấp nó trước.

![Pasted image 20230529131853](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230529131853.png)

### 🐥 HTTP/3

> HTTP over QUIC

HTTP/3 đã được công bố năm. RFC 9114

HTTP/3 xuất hiện để giải quyết vấn đề gì? Đó là bởi vì HTTP/2 vẫn chạy trên TCP dưới dạng **TLS**(Transport Layer Security), vì vậy các sự cố với nó vẫn đang tiếp diễn.

**Vì TCP là một giao thức hướng kết nối (connection-oriented) và hướng đến độ tin cậy (reliable)** nên nó thực hiện truyền lại khi xảy ra mất dữ liệu. Và vì các gói phải được xử lý theo thứ tự nên xảy ra hiện tượng thắt cổ chai trong quá trình truyền lại.

Và bản thân TCP cung cấp khả năng kiểm soát luồng và kiểm soát tắc nghẽn

- Kiểm soát luồng  
	- Kiểm soát tốc độ xử lý dữ liệu của bên gửi và bên nhận tránh tràn bộ nhớ đệm bên nhận  
	- Nó ngăn các sự cố xảy ra ở đầu nhận bằng cách gửi quá nhiều dữ liệu ở đầu gửi quá nhanh.
- Điều khiển tắc nghẽn  
	- Để ngăn chặn sự gia tăng quá mức số lượng gói trong mạng  
	- Khi lưu lượng thông tin quá lớn, một số lượng nhỏ các gói tin được truyền đi để ngăn chặn sự tắc nghẽn. (Kiểm soát tốc độ, Tăng tốc từ từ.)

Tuy nhiên, điều này gây chậm trễ khi môi trường Internet tốt.

#### ✔️ QUIC

- HTTP/3 hoạt động trên cơ sở một giao thức gọi là **QUIC**.  
- **QUIC** dựa trên UDP. Đây là một giao thức giúp cải thiện hiệu suất bằng cách triển khai trực tiếp chức năng do Google cung cấp vào năm 2013 để đảm bảo độ tin cậy (reliable) của TCP trong UDP.
- Nghĩa là bản thân UDP không đảm bảo độ tin cậy, nhưng độ tin cậy có thể được đảm bảo thông qua định nghĩa bổ sung.

```
UDP + Retransmit, Congestion Control, Flow Control, v.v. (directly implemented) = QUIC
```

Cuối cùng, HTTP/3 đã có thể giải quyết các vấn đề hiện có bằng cách sử dụng giao thức dựa trên UDP thay vì TCP.

![htt3](https://raw.githubusercontent.com/vanhung4499/images/master/snap/http3.gif)

- Kết nối đầu tiên (1-RTT): Gửi thông tin cần thiết để kết nối cùng một lúc.
- Kết nối tiếp theo (0-RTT): Lưu một kết nối thành công vào bộ đệm và sử dụng thông tin đã lưu trong bộ đệm cho kết nối tiếp theo.  
- Các luồng trong một kết nối hoạt động hoàn toàn độc lập -> sự cố của một luồng không ảnh hưởng đến các luồng khác
- Mỗi kết nối được xác định bằng cách sử dụng một **UUID(Connection ID)** duy nhất thay vì dựa trên IP.  
	- Vì vậy, trên nền TCP, khi chuyển từ Wi-Fi sang môi trường di động, địa chỉ IP sẽ thay đổi và kết nối phải được thiết lập lại.  
	- Trong QUIC, vì nó dựa trên ID nên kết nối vẫn nguyên vẹn.

![Pasted image 20230528141509](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230528141509.png)

## Đặc điểm của HTTP

### Không kết nối (Connectionless)

Máy khách gửi yêu cầu đến máy chủ, khi máy chủ nhận được yêu cầu và phản hồi, nó sẽ đóng kết nối.

- Nó có ưu điểm là giảm gánh nặng cho máy chủ do không kết nối liên tục nhưng không thể biết được trạng thái trước đó của máy khách.
- Nếu thông tin trạng thái trước đó trở nên không xác định, thông tin nhật ký không thể được duy trì ngay cả khi đăng nhập thành công.

Kể từ HTTP 1.1, trạng thái kết nối liên tục là mặc định và các header yêu cầu phải được sửa đổi một cách rõ ràng để tắt nó.

(Lưu ý) **Keep-Alive**

Keep-Alive của giao thức HTTP là một field HTTP header và được sử dụng để kích hoạt các kết nối liên tục không được hỗ trợ trong HTTP/1.0.

- HTTP Request

```http
Connection: Keep-Alive
```

- HTTP Response

```http
Connection: Keep-Alive
Keep-Alive: max=5, timeout=120 
```

Một header Keep-Alive có thể được gửi thêm.

- Tham số max của Keep-Alive cho biết kết nối sẽ được duy trì cho bao nhiêu giao dịch HTTP.  
- Tham số timeout cho biết kết nối sẽ được duy trì trong bao lâu và trong ví dụ trên, kết nối được duy trì trong 120s = 2 phút.

### Không trạng thái (Stateless)

Một đặc điểm bắt nguồn từ không kết nối, trong đó mỗi request được coi là độc lập.

- Vì máy chủ không duy trì trạng thái của máy khách nên nó sử dụng [[Cookie]], [[Session]], v.v. để xác thực và nhận dạng máy khách.

## HTTP Request

Một HTTP Request bao gồm 3 phần chính:

- Start Line (Status Line)
- Headers
- Body

![Pasted image 20230528142129](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230528142129.png)

### Start Line (Status Line)

Là dòng đầu tiên của một yêu cầu HTTP, start line cũng bao gồm ba phần.

```http
GET /search HTTP/1.1
```

1. HTTP Method
	- Phần xác định hành động dự định của yêu cầu  
	- Các phương thức HTTP bao gồm GET, POST, PUT, DELETE và OPTIONS.
	- Nó chủ yếu được sử dụng với GET và POST.  
2. Request target
	- URL mục tiêu mà yêu cầu được gửi đến  
3. HTTP Version
	- Là phiên bản HTTP được sử dụng, chẳng hạn như 1.0, 1.1, 2.0, v.v.

### Headers

- Phần chứa thông tin bổ sung của request
	- Ví dụ: tổng độ dài của nội dung request (Content-Length), v.v.  
- Nó được tạo thành từ các cặp **Key:Value**
	- `HOST: google.com` => Key = HOST, Value = google.com
- Header bao gồm 3 phần: general headers, request headers, entity headers.

```http
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Type: application/json
Content-Length: 257
Host: google.com
User-Agent: HTTPie/0.9.3
```

- Host: Url máy chủ của đích mà yêu cầu được gửi đến (ví dụ: google.com)
- User-Agent: Thông tin về ứng dụng khách gửi yêu cầu (ví dụ: thông tin về trình duyệt web)
- Accept: Loại phản hồi mà yêu cầu có thể nhận được
- Connection: Phần hướng dẫn client và server tiếp tục duy trì hay ngắt kết nối mạng sau khi yêu cầu kết thúc.
- Content-Type: Loại nội dung được gửi theo yêu cầu (ví dụ: application/json nếu JSON được gửi)
- Content-Length: Độ dài của phần nội dung

### Body

Đây là nội dung thực của yêu cầu. Có nhiều request không có body.

Ví dụ: các yêu cầu GET thường không có phần thân.

```http
POST /payment-sync HTTP/1.1
Accept: application/json
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 83
Content-Type: application/json
Host: intropython.com
User-Agent: HTTPie/0.9.3

{
    "imp_uid": "imp_1234567890",
    "merchant_uid": "order_id_8237352",
    "status": "paid"
}
```

## HTTP Response

Response cũng giống như request bao gồm ba phần chính.

- Start Line (Status Line)
- Headers
- Body

![Pasted image 20230528143307](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230528143307.png)

### Start Line (Status Line)

Đây là một phần hiển thị ngắn gọn trạng thái của phản hồi và bao gồm 3 phần.

```http
HTTP/1.1 404 Not Found
```

1. HTTP Version
2. Status code: Mã biểu thị trạng thái phản hồi (ví dụ: 200, 404)
3. Status text: Mô tả ngắn gọn về trạng thái phản hồi (ví dụ: "OK"., "Not Found")

### Headers

Tương tự như request header. Tuy nhiên, có những header key chỉ được sử dụng trong response.

Ví dụ: header Server được sử dụng thay vì User-Agent.

### Body

Nó thường giống như body của request.

Giống như các request, không phải tất cả các response đều có body. Phần body trống nếu không có dữ liệu cần truyền.

```http
HTTP/1.1 200 OK
Date: Sat, 17 Oct 2020 07:32:39 GMT
Content-Type: application/json
Content-Length: 332
Connection: close
Server: gunicorn/19.9.0
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true

{
  "args": {}, 
  "data": "Hello", 
  "files": {}, 
  "form": {}, 
  "headers": {
    "Content-Length": "5", 
    "Content-Type": "text/plain", 
    "Host": "httpbin.org", 
    "X-Amzn-Trace-Id": "Root=1-5f8a9e17-1755758a691e5b0051977312"
  }, 
  "json": null, 
  "origin": "121.131.70.240", 
  "url": "https://httpbin.org/post"
}
```

## HTTP Method

### An toàn (Safe)

HTTP là một tập hợp các phương thức được coi là an toàn.

Mục đích của các phương pháp an toàn là có thể thông báo cho người dùng khi một phương pháp không an toàn đang được sử dụng có thể gây ảnh hưởng đến máy chủ.

Nếu chỉ đọc, nó được coi là một phương thức an toàn và các phương thức GET, HEAD và OPTIONS được định nghĩa là các phương thức an toàn.

**Nói cách khác, các phương thức không sửa đổi tài nguyên được cho là an toàn.**

### Bình thường (Idempotent)

Idempotency có nghĩa là nhiều yêu cầu giống hệt nhau sẽ có cùng kết quả.

PUT, DELETE, TRACE và GET, HEAD, OPTIONS là Idempotency.

### Có thể lưu vào bộ đệm (Cacheable)

Cho biết rằng phản hồi có thể được lưu trữ để sử dụng lại trong tương lai.

Các phương thức an toàn không phụ thuộc vào các phản hồi hiện tại hoặc có thẩm quyền được xác định là có thể lưu vào bộ đệm.

GET, HEAD, POST và PATCH có thể được lưu vào bộ đệm, nhưng trên thực tế, chỉ **GET** và **HEAD** được sử dụng để lưu vào bộ nhớ đệm.

## HTTP Method Type

### Các phương thức HTTP

|HTTP Method|Mode|Giải thích|
|---|---|---|
|**GET**|**GET** [request-uri]**?query_string** HTTP/1.1  <br>Host:[Hostname] or [IP]|Nó là một dạng yêu cầu **truy vấn thông tin** từ phía máy chủ từ URI (URL).|
|**HEAD**|**HEAD** [request-uri] HTTP/1.1  <br>Host:[Hostname] or [IP]|Nó giống như GET, nhưng không có BODY trong response và chỉ có status code và HEAD được phản hồi. <br>- Khi bạn chỉ muốn tìm mà không nhận tài nguyên <br>- Khi kiểm tra status code của response nếu đối tượng tồn tại <br>- Nó được sử dụng cho các mục đích như kiểm tra xem tài nguyên có bị sửa đổi hay không bằng cách xem response header của máy chủ.|  
|**POST**|**POST** [request-uri] HTTP/1.1 <br>Host:[Hostname] or [IP] <br>**Content-Length:[Length in Bytes] <br>Content-Type:[Content Type] <br>[Data]**| **Tạo (CREATE)** tài nguyên được yêu cầu. <br>Để gửi Input Data tới server. <br>(HTML form được sử dụng)|
|**PUT**|**PUT** [request-uri] HTTP/1.1 <br>Host:[Hostname] or [IP] <br>**Content-Length:[Length in Bytes] <br>Content-Type:[Content Type] <br>[Data]**|**Cập nhật (UPDATE)** tài nguyên được yêu cầu. <br>Máy chủ kiểm tra phần body của request. <br>- Để tạo một tài nguyên mới được xác định qua URL <br>- Nếu tài nguyên qua URL tồn tại, hãy thay thế và sử dụng nó|  
|**PATCH**|**PATCH** [request-uri] HTTP/1.1 <br>Host:[Hostname] or [IP] <br>**Content-Length:[Length in Bytes] <br>Content-Type:[Content Type] <br>[Data]**|Tương tự như PUT, sử dụng khi **cập nhật (UPDATE)** tài nguyên được yêu cầu. <br>PUT sẽ thay đổi **toàn bộ** Resource được yêu cầu, còn PATCH chỉ thay đổi **một phần** Resource.|  
|**DELETE**|**DELETE** [request-uri] HTTP/1.1 <br>Host:[Hostname] or [IP]|**Xoá Resource** theo yêu cầu. <br>(Không được sử dụng trên hầu hết các máy chủ vì lý do an toàn = không phải lúc nào dữ liệu cũng được bảo đảm)|  
|**CONNECT**|**CONNECT** [request-uri] HTTP/1.1 <br>Host:[Hostname] or [IP]|Phương pháp này bắt đầu **kết nối hai chiều** với tài nguyên được yêu cầu. <br>- Khi một client yêu cầu proxy server cho một kết nối TCP đến đích mong muốn, proxy server sẽ thay client khách tạo kết nối. <br>- Sau khi kết nối được thiết lập bởi server, proxy server sẽ liên tục ủy quyền luồng TCP đến server và từ client.|  
|**TRACE**|**TRACE** [request-uri] HTTP/ 1.1 <br>Host: [Hostname] or [IP]|Việc Request Packet có thể xảy ra khi gói yêu cầu từ máy khách đi qua Firewall, Proxy Server, Gateway, v.v.. <br>Tại thời điểm này, bạn có thể thấy **Request Packet của Packet cuối cùng khi nó đến Server**.. <br>- Nói cách khác, Original Data và Data khi đến máy chủ có thể được kiểm tra thông qua phản hồi của máy chủ. <br>Người nhận cuối cùng của request phải trả lại response có **sataus code 200 (OK)** cho người gửi.|  
|**OPTIONS** [](https://github.com/hongcheol/CS-study/tree/main/Network)|**OPTIONS** [request-uri] HTTP/ 1.1 <br>Host: [Hostname] or [IP] [](https://github.com/hongcheol/CS-study/tree/main/Network)|Sử dụng để kiểm tra các loại phương pháp được hỗ trợ của Target Server.|

### POST vs PUT

POST thường được sử dụng để **INSERT** còn PUT dùng để **UPDATE** dữ liệu/tài nguyên.

Ngoài ra, POST không phải là Idempotent và PUT là Idempotent.

Nghĩa là, nếu cùng một tài nguyên được POST nhiều lần, tài nguyên máy chủ sẽ thay đổi, nhưng trong trường hợp có nhiều PUT, không có thay đổi nào xảy ra.

Ví dụ: POST được sử dụng khi máy khách không chỉ định vị trí của tài nguyên. (/chó)

Do đó, nếu yêu cầu sau đây được thực hiện nhiều lần, thì mỗi lần một con chó mới được tạo và các tài nguyên mới như `dogs/3` và `dogs/4` cũng được tạo mỗi lần. đó không phải là Idempotent.

```http
POST /dogs HTTP/1.1

{ "name": "blue", "age": 5 }
```

Mặt khác, với PUT, máy khách chỉ định rõ ràng vị trí của tài nguyên `dogs/3`

Do đó, bất kể nó được thực thi bao nhiêu lần, vị trí của tài nguyên được chỉ định và không có tài nguyên mới nào được tạo và vì cùng một tài nguyên `/dogs/3` được sửa đổi, nên nó là Idempotent.

```http
PUT /dogs/3 HTTP/1.1

{ "name": "blue", "age": 5 }
```

### PUT vs PATCH

PUT sẽ **thay thế toàn bộ tài nguyên** thì PATCH chỉ **thay đổi một phần tài nguyên** nên được đánh giá là phù hợp hơn về mặt ngữ nghĩa so với PUT trong các yêu cầu **UPDATE**.

Ngoài ra, trong khi PUT là idempotent, PATCH thì không.

- Vì PUT cập nhật toàn bộ tài nguyên, nên nó là idempotent, khi PUT được xử lý giống hệt nhau cho cùng một tài nguyên.
- Mặt khác, với PATCH, idempotent không thể được đảm bảo do một phần tài nguyên bị thay đổi.

### GET vs POST

![Pasted image 20230528182909](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230528182909.png)

#### GET Method

- Khi gửi request, dữ liệu cần thiết được truyền qua query param ở cuối URL, sau `?` theo dạng các cặp key-value các nhau bởi `&`.  
- Vì thông tin được hiển thị như trong URL, nên nó tương đối kém an toàn hơn phương thức POST.  
- Bộ nhớ đệm là có thể sử dụng.  
	- Khi bạn yêu cầu nội dung tĩnh như js, css hoặc hình ảnh, trình duyệt sẽ lưu yêu cầu vào bộ đệm và khi yêu cầu tương tự xảy ra, dữ liệu được lưu trong bộ nhớ cache sẽ được sử dụng thay vì gửi yêu cầu đến máy chủ.
- Tốc độ truyền tương đối nhanh hơn phương thức POST.  
- Ngay cả khi bạn thực hiện cùng một yêu cầu nhiều lần, bạn sẽ nhận được kết quả tương tự. (Idempotent)  
- Có giới hạn về lượng dữ liệu được truyền. (Có giới hạn độ dài yêu cầu GET cho mỗi trình duyệt)  
- Khi yêu cầu Nhận thành công, nó trả về status code **200 (Ok)** cùng với nhiều loại dữ liệu khác nhau (html, txt, v.v.) cũng như XML và JSON.  
- Một bản ghi lich sử để lại trong trình duyệt.  
- Bạn có thể thêm vào bookmark.

#### POST Method

- Thay vì đính kèm dữ liệu vào cuối URL và gửi đến máy chủ, nó sẽ được lưu trong body.  
- Chỉ định loại nội dung qua **Content-Type** header.  
- Vì dữ liệu không bị lộ trong URL nên nó tương đối an toàn hơn phương thức GET.
- Vì dữ liệu được chứa trong phần thân nên lượng dữ liệu được gửi đến máy chủ là không giới hạn.  
- Không có dữ liệu nào được hiển thị trong URL, vì vậy không thể lưu vào bộ nhớ đệm.  
- Mã hóa trên máy khách và giải mã trên máy chủ. (khi được mã hoá)  
- Việc tạo tài nguyên qua POST request sẽ trả về status code **201 (Created)**.  
- Không lưu lịch sử trình duyệt.  
- Không thể thêm vào bookmark.

#### So sánh

|HTTP Method|GET|POST|
|:-:|:-:|:-:|
|Cache|✅|❌|
|Browser History|✅|❌|
|Bookmark|✅|❌|
|Limit Data|✅|❌|
|HTTP Status Code|200(Ok)|201(Created)|
|Use|Find Resource|Create Resource|
|Query Param|In HTTP header|In HTTP Body|
|Idempotent|✅|❌|

## HTTP Status Code

HTTP Status Code được tạo thành từ ba chữ số và chữ số đầu tiên được cung cấp từ 1 đến 5.

Trường hợp đầu số là 4 và 5 là thông tin mà người quản trị cần biết ngay vì không phải là trường hợp bình thường.

### 1XX: Information response

### 2XX: Successful response

### 3XX: Redirection message

### 4XX: Client error response

### 5XX: Server error response
