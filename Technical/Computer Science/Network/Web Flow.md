---
categories:
  - network
  - computer-science
title: Web Flow
date created: 2023-05-26
date modified: 2023-09-17
tags:
  - network
  - computer-science
---

# Web Flow

> Bài viết này tìm hiểu về luồng xử lý trong môi trường web.

## Quá trình nhập URL để hiển thị trang

Trình duyệt từ nhập URL đến hiển thị trang web chủ yếu được chia thành các giai đoạn sau:

1. Nhập URL
2. Phân giải DNS
3. Thiết lập kết nối TCP
4. Gửi yêu cầu HTTP/HTTPS (thiết lập kết nối TLS nếu sử dụng HTTPS)
5. Máy chủ phản hồi yêu cầu
6. Trình duyệt phân tích cú pháp và hiển thị trang web
7. Kết thúc yêu cầu HTTP và ngắt kết nối TCP

### 1. Nhập URL

URL (Uniform Resource Locator) dùng để định vị tài nguyên trên Internet, thường được gọi là địa chỉ trang web.

Chúng ta nhập trang web chính thức của Google google.com vào thanh địa chỉ và nhấn Enter. Trình duyệt sẽ đưa ra các phán đoán sau về thông tin đã nhập:

1. Kiểm tra xem nội dung đã nhập có phải là liên kết URL hợp lệ hay không.
2. Nếu có, nó sẽ xác định xem URL đã nhập có đầy đủ hay không. Nếu chưa đầy đủ, trình duyệt có thể đoán tên miền và đề xuất hoàn thiện tiền tố hoặc hậu tố.
3. Nếu không, nội dung đã nhập sẽ được sử dụng làm từ khoá tìm kiếm bằng công cụ tìm kiếm mặc định của trình duyệt (đa số là Google).

Hầu hết các trình duyệt sẽ tìm kiếm URL nhập từ lịch sử, dấu trang (bookmark), v.v. và đưa ra đề xuất thông minh.

### 2. Phân giả DNS

Do trình duyệt không thể tìm trực tiếp địa chỉ IP máy chủ tương ứng thông qua tên miền nên nó cần thực hiện phân giải DNS để tìm địa chỉ IP tương ứng để truy cập.

Quá trình phân giải DNS như sau:  

![iterative-dns-lookup](https://raw.githubusercontent.com/vanhung4499/images/master/snap/iterative-dns-lookup.png)

1. Nhập tên miền google.com vào trình duyệt. Hệ điều hành sẽ kiểm tra xem có bản ghi URL này trong bộ đệm của trình duyệt và tệp máy chủ cục bộ hay không. Nếu có, nó sẽ trả về địa chỉ IP tương ứng từ bản ghi và hoàn thành phân giản tên miền.
2. Kiểm tra xem có bản ghi URL này trong bộ đệm của Local DNS Server hay không và nếu có, trả về địa chỉ IP tương ứng từ bản ghi để hoàn tất quá trình phân giải tên miền.
3. Truy vấn bằng cách sử dụng máy chủ DNS được đặt trong tham số TCP/IP. Nếu tên miền được truy vấn có sẵn trong tài nguyên vùng cấu hình cục bộ, kết quả sẽ được trả về để hoàn thành quá trình phân giải tên miền.
4. Kiểm tra xem Local DNS Server có lưu bản ghi URL vào bộ đệm hay không và nếu có, trả về kết quả để hoàn tất quá trình phân giải tên miền.
5. Local DNS Server gửi tin nhắn truy vấn đến Root DNS Server. Sau khi nhận được yêu cầu, Root DNS Server sẽ phản hồi bằng địa chỉ của TLD DNS Server (Top Level Domain). (cụ thể là .com dns server)
6. Local DNS Server gửi thông báo truy vấn đến TLD DNS Server. Sau khi nhận được yêu cầu, máy chủ DNS tên miền cấp cao nhất sẽ phản hồi bằng địa chỉ Authoritative DNS Server. (cụ thể là google)
7. Local DNS Server gửi thông báo truy vấn đến Authoritative DNS Server. Sau khi nhận được yêu cầu, Authoritative DNS Server sẽ phản hồi bằng địa chỉ IP của google.com để hoàn tất quá trình phân giải tên miền.

Truy vấn thường tuân theo quy trình trên. Truy vấn từ máy chủ yêu cầu đến Local DNS Server là truy vấn đệ quy và quy trình truy vấn của máy chủ DNS để có được ánh xạ cần thiết là truy vấn lặp.

### 3. Thiết lập kết nối TCP

> Hầu hết tất cả thông tin liên lạc HTTP trên thế giới đều được thực hiện bởi TCP/IP, một lớp mạng chuyển mạch gói phổ biến được sử dụng bởi các máy tính và thiết bị mạng trên toàn thế giới. Kết nối HTTP thực chất là kết nối TCP và các quy tắc sử dụng của chúng.

Khi trình duyệt lấy được địa chỉ IP của máy chủ, trình duyệt sẽ sử dụng một cổng ngẫu nhiên (1024 < cổng < 65535) để khởi tạo yêu cầu kết nối TCP tới cổng máy chủ 80 (lưu ý: HTTP mặc định là cổng 80, cổng HTTPS 443). Sau khi yêu cầu kết nối này đến máy chủ, kết nối TCP được thiết lập thông qua bắt tay ba bước TCP.

#### 3.1. Bắt tay 3 bước TCP

Trong TCP, khi thiết lập kết nối, tín hiệu SYN được sử dụng để bắt tay. Gói tin SYN đầu tiên được gửi từ máy khách (client), và gói tin SYN đó được máy chủ (server) nhận.

Giả sử có máy khách A và máy chủ B. Chúng ta muốn thiết lập một kết nối truyền dữ liệu đáng tin cậy.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230708004358.png)

1. Máy khách gửi gói SYN (seq = j) đến máy chủ và chuyển sang trạng thái SYN_SEND, chờ xác nhận từ máy chủ.
2. Khi máy chủ nhận được gói SYN, nó phải xác nhận SYN của máy khách (ACK = k + 1) và đồng thời gửi gói SYN (seq = k), tức là gói SYN+ACK. máy chủ chuyển sang trạng thái SYN_RECV.
3. Máy khách nhận gói SYN+ACK từ máy chủ và gửi gói xác nhận ACK (ACK = k + 1) đến máy chủ. Sau khi gói được gửi, máy khách và máy chủ sẽ chuyển sang trạng thái ESTABLISHED và hoàn tất bắt tay ba bước

### 4. Gửi yêu cầu HTTP/HTTPS

Sau khi kết nối TCP được thiết lập, dữ liệu có thể được truyền qua HTTP. Nếu sử dụng HTTPS, một lớp giao thức bổ sung sẽ được thêm vào giữa TCP và HTTP cho các dịch vụ mã hóa và xác thực. HTTPS sử dụng giao thức SSL (Secure Socket Layer) và TLS (Transport Layer Security) để đảm bảo bảo mật thông tin.

- **SSL**
	- Xác thực người dùng và máy chủ để đảm bảo dữ liệu được gửi đến đúng máy khách và máy chủ.
	- Mã hóa dữ liệu giúp ngăn chặn việc bị đánh cắp giữa chừng.
	- Duy trì tính toàn vẹn dữ liệu và đảm bảo rằng dữ liệu không bị thay đổi trong quá trình truyền.
- **TLS**
    - Được sử dụng để cung cấp tính bảo mật và toàn vẹn dữ liệu giữa hai ứng dụng giao tiếp. Giao thức bao gồm hai lớp: Bản ghi TLS và Bắt tay TLS. Lớp dưới là giao thức bản ghi TLS, nằm trên giao thức truyền tải đáng tin cậy (chẳng hạn như TCP).

#### 4.1. Bắt tay TLS

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230917171655.png)

1. Máy khách gửi tin nhắn "client hello", chứa thông tin như: danh sách phiên bản SSL/TLS được hỗ trợ, thuật toán mã hóa được hỗ trợ, phương pháp nén dữ liệu được hỗ trợ, số ngẫu nhiên A.
2. Máy chủ phản hồi bằng một tin nhắn "server hello" chứa thông tin như: phiên bản SSL/TLS đã thỏa thuận, ID phiên, số ngẫu nhiên B, chứng chỉ số (SSL Certificate) của máy chủ (serverCA). Nếu yêu cầu xác thực hai chiều, máy chủ cũng sẽ gửi một thông điệp "client certificate request" yêu cầu chứng chỉ của máy khách.
3. Máy khách xác minh chứng chỉ số của máy chủ. Sau khi xác minh thành công, khách hàng gửi số ngẫu nhiên C, được gọi là pre-master-key, được mã hóa bằng khóa công khai (public key) trong chứng chỉ số của máy chủ. Đồng thời, nếu yêu cầu xác thực hai chiều, máy khách sẽ mã hóa một số ngẫu nhiên clientRandom bằng khóa riêng (private key) và gửi cùng với chứng chỉ của máy khách (clientCA).
1. Máy chủ xác minh chứng chỉ của máy khách và giải mã thành công số ngẫu nhiên clientRandom. Sử dụng số ngẫu nhiên A, số ngẫu nhiên B và số ngẫu nhiên C (pre-master-key), máy chủ tạo ra khóa chính (master-key) và mã hóa một tin nhắn "finish" gửi đến khách hàng.
5. Máy khách tạo khóa chính (master-key) dựa trên cùng số ngẫu nhiên và thuật toán, và mã hóa một tin nhắn "finish" gửi đến máy chủ.
1. Máy chủ và máy khách giải mã thành công, hoàn tất quá trình bắt tay và sau đó các gói dữ liệu được mã hóa và truyền bằng master-key.

### 5. Phản hồi từ máy chủ

Khi kết nối từ trình duyệt đến máy chủ web được thiết lập, trình duyệt sẽ gửi yêu cầu HTTP GET đầu tiên và mục tiêu yêu cầu thường là tệp HTML. Sau khi nhận được yêu cầu, máy chủ sẽ gửi lại phản hồi HTTP, bao gồm tiêu đề phản hồi có liên quan và nội dung HTML.

#### 5.1 Mã trạng thái  

Mã trạng thái được tạo thành từ 3 chữ số, chữ số đầu tiên xác định loại phản hồi và có năm giá trị có thể có:

- 1xx: Thông tin - Cho biết yêu cầu đã được chấp nhận và tiếp tục xử lý  
- 2xx: Thành công - Cho biết yêu cầu đã được chấp nhận, hiểu và thành công  
- 3xx: Chuyển hướng - Yêu cầu cần thực hiện thêm thao tác để hoàn thành  
- 4xx: Lỗi từ phía khách hàng - Yêu cầu có lỗi cú pháp hoặc không thể thực hiện  
- 5xx: Lỗi từ phía máy chủ - Máy chủ không thể thực hiện yêu cầu hợp lệ

#### 5.2 Các tiêu đề và trường thông tin yêu cầu phổ biến  

- Cache-Control: must-revalidate, no-cache, private (xác định xem tài nguyên có cần được lưu trữ trong bộ nhớ cache)  
- Connection: keep-alive (duy trì kết nối)  
- Content-Encoding: gzip (loại mã hóa nén nội dung được máy chủ web hỗ trợ)  
- Content-Type: text/html; charset=UTF-8 (loại tệp và định dạng mã ký tự)  
- Date: Sun, 21 Sep 2021 06:18:21 GMT (thời gian máy chủ gửi thông điệp)  
- Transfer-Encoding: chunked (cách máy chủ gửi tài nguyên là gửi theo từng phần)

#### 5.3 Phản hồi HTTP  

- Phản hồi bao gồm bốn phần (dòng trạng thái + tiêu đề phản hồi + dòng trống + thân phản hồi)
- Dòng trạng thái: Phiên bản HTTP + khoảng trắng + mã trạng thái + khoảng trắng + mô tả mã trạng thái + ký tự CR (Enter) + ký tự LF (Newline)  
- Tiêu đề phản hồi: Tên trường + dấu hai chấm + giá trị + ký tự CR + ký tự LF  
- Dòng trống: Ký tự CR + ký tự LF  
- Thân phản hồi: Do người dùng tự thêm vào, ví dụ như nội dung của phần thân của yêu cầu POST.

### 6. Trình duyệt phân tích cú pháp và hiển thị trang web

Quá trình hiển tụ của các trình duyệt khác nhau có thể khác nhau, ở đây chúng ta lấy ví dụ quá trình hiển thị của trình duyệt Chrome.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230917174549.png)

1. Xử lý các thẻ HTML và xây dựng DOM Tree.
2. Xử lý các thẻ CSS và xây dựng CSSOM Tree.
3. Kết hợp DOM và CSSOM thành một Render Tree.
4. Dựa trên Render Tree để bố trí, tính toán thông tin hình học cho mỗi nút.
5. Trình bày các nút lên màn hình.

### 7. Ngắt kết nối TCP

Hiện nay, để tối ưu thời gian yêu cầu, các trang web thường mở kết nối kéo dài (keep-alive) mặc định. Do đó, thời điểm chính xác để đóng một kết nối TCP là khi tab trang web đóng. Quá trình đóng này được gọi là bắt tay bốn bước (four-way handshake). Việc đóng kết nối là một quá trình song hành đầy đủ, thứ tự gửi gói tin không nhất thiết phải giống nhau. Thông thường, việc đóng kết nối được khởi tạo bởi phía máy khách và quá trình diễn ra như sau:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%252520image%25252020230525232625.png)

1. Bên gửi đóng kết nối gửi một gói FIN để đóng việc truyền dữ liệu từ bên gửi đến bên nhận. Điều này có nghĩa là bên gửi cho bên nhận biết rằng: "Tôi sẽ không gửi dữ liệu nữa cho bạn" (nếu có bất kỳ gói tin nào được gửi trước gói FIN mà không nhận được gói ACK xác nhận tương ứng, bên gửi vẫn sẽ gửi lại các gói tin đó).
2. Bên nhận gói FIN sẽ gửi một gói ACK cho bên gửi, xác nhận số thứ tự là số thứ tự đã nhận + 1 (giống như SYN, một gói FIN chiếm một số thứ tự).
3. Bên nhận gửi một gói FIN để đóng việc truyền dữ liệu từ bên nhận đến bên gửi. Điều này cho bên gửi biết rằng: "Dữ liệu của tôi cũng đã được gửi hết, tôi sẽ không gửi thêm dữ liệu nữa cho bạn".
4. Bên gửi nhận được gói FIN và gửi một gói ACK cho bên nhận, xác nhận số thứ tự là số thứ tự đã nhận + 1. Khi đó, quá trình bốn bước tiếp xúc hoàn tất.

## Tìm hiểu thêm xử lý phản hồi từ Server

> Phần này là đào sâu thêm về bước 5 phản hồi từ server trong phần trước

### Xử lý các tác vụ trang web trước trong máy chủ ứng dụng web (WAS - Web Application Server) và cơ sở dữ liệu (Database)

- Nếu một mình máy chủ web (Web Server) xử lý tất cả các xử lý logic và quản lý dữ liệu thì khả năng cao là máy chủ sẽ bị quá tải. Vì vậy, WAS đóng vai trò trợ lý giúp máy chủ hoạt động.

> Web Server: Một máy chủ nhận các yêu cầu về nội dung tĩnh (HTML, CSS, IMAGE, v.v.) và xử lý và cung cấp chúng
>
> Web Application Server: Máy chủ nhận, xử lý và cung cấp nội dung động (JSP, ASP, PHP, v.v.) => Được kết nối trực tiếp tới DB Server để truy vấn dữ liệu  

> ![[Extras/Media/Pasted image 20230526234657.png]]

### Web Server vs WAS

#### Web Server

> Máy chủ nhận, xử lý và cung cấp nội dung tĩnh (HTML, CSS, IMAGE, v.v.)

- Vì Web Server chỉ có thể xử lý nội dung tĩnh, nên khi nội dung động được yêu cầu, nó sẽ yêu cầu WAS, nhận phản hồi và gửi nó đến máy client.

👉 **Ví dụ về Web Server** : Apache Server, Nginx, v.v

#### WAS (Web Application Server)

> Máy chủ nhận, xử lý và cung cấp nội dung động (JSP, ASP, PHP, v.v.) (có thể cung cấp tài nguyên tĩnh)

- WAS = Web Server + Web Container
- Phần mềm trung gian thực thi các ứng dụng trên máy tính hoặc thiết bị thông qua HTTP
- Kết nối trực tiếp với DB Server

👉 **Ví dụ về WAS**: Tomcat, JBoss, Jeus, Web Sphere, v.v.

👉 **Sự cần thiết của WAS**

Các trang web chứa cả nội dung tĩnh và động.

Nội dung động phù hợp phải được tạo và cung cấp theo yêu cầu của người dùng. Ví dụ, tên hiển thị trên màn hình có thể thay đổi theo thông tin đăng nhập.

Tại thời điểm này, nếu bạn chỉ sử dụng Web Server, bạn phải truy vấn, tính toán trước tất cả các giá trị cho yêu cầu của người dùng và cung cấp dịch vụ. Tuy nhiên, các nguồn lực là hoàn toàn không đủ để làm điều này.

Do đó, tài nguyên có thể được sử dụng hiệu quả bằng cách truy vấn dữ liệu đáp ứng yêu cầu từ DB thông qua WAS, đồng thời tạo và cung cấp kết quả theo logic nghiệp vụ.

#### 👉 Web Service Architecture

![Pasted image 20230527004740](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230527004740.png)

**[ WAS + DB ]**

- Vì WAS có thể cung cấp cả nội dung động và tĩnh nên hệ thống có thể được cấu hình mà không cần máy chủ web.
- Tuy nhiên, nếu tất cả các vai trò được gán cho WAS, có những lo ngại rằng logic ứng dụng đắt tiền nhất có thể khó thực hiện do tài nguyên tĩnh làm quá tải máy chủ.

![was_and_db](https://raw.githubusercontent.com/vanhung4499/images/master/snap/was_and_db.png)

**[ WEB + WAS + DB ]**

- Nội dung tĩnh được Web Server xử lý và yêu cầu WAS xử lý nội dung logic động.  
- Khi hệ thống được phân chia như vậy, nếu sử dụng nhiều tài nguyên tĩnh, máy chủ web có thể được mở rộng và nếu sử dụng nhiều tài nguyên động, WAS có thể được mở rộng để quản lý tài nguyên hiệu quả.

![web_and_was_db](https://raw.githubusercontent.com/vanhung4499/images/master/snap/web_and_was_db.png)
