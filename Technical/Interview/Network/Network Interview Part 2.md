---
title: Network Interview Part 2
tags: [network, interview]
categories: [network, interview]
date created: 2023-08-18
date modified: 2023-08-18
---

# Network Interview Q&A Part 2

## Làm thế nào để HTTPS đảm bảo an toàn dữ liệu truyền tải và quy trình tổng thể là gì? (Làm thế nào SSL hoạt động để đảm bảo an toàn)

(1) Khách hàng khởi tạo yêu cầu kết nối SSL với máy chủ.  
(2) Máy chủ gửi khóa công khai cho khách hàng và giữ khóa riêng duy nhất.  
(3) Khách hàng sử dụng khóa công khai để mã hóa khóa bí mật đối xứng được sử dụng cho việc truyền thông giữa hai bên và gửi nó cho máy chủ.  
(4) Máy chủ sử dụng khóa riêng duy nhất của mình để giải mã khóa bí mật đối xứng được gửi từ khách hàng.  
(5) Truyền dữ liệu, cả máy chủ và khách hàng sử dụng cùng một khóa bí mật đối xứng để mã hóa và giải mã dữ liệu, đảm bảo an toàn trong quá trình truyền tải dữ liệu. Ngay cả khi bên thứ ba có được gói dữ liệu, họ cũng không thể mã hóa, giải mã hoặc thay đổi nó.

Vì chữ ký số và bản tóm tắt là vũ khí quan trọng để chống lại giả mạo chứng chỉ. "Tóm tắt" là một chuỗi có độ dài cố định được tính toán từ nội dung truyền tải thông qua thuật toán băm. Sau đó, bằng cách sử dụng khóa riêng của bên gửi, tóm tắt này được mã hóa và kết quả mã hóa là "chữ ký số".

Giao thức SSL/TLS hoạt động dựa trên việc sử dụng mã hóa khóa công khai, có nghĩa là khách hàng yêu cầu máy chủ cung cấp khóa công khai, sau đó sử dụng khóa công khai để mã hóa thông tin và máy chủ giải mã bằng khóa riêng của mình.

## Làm thế nào để đảm bảo rằng khóa công khai không bị sửa đổi?

Đặt khóa công khai trong chứng chỉ số. Chỉ cần chứng chỉ là đáng tin cậy, thì khóa công khai cũng là đáng tin cậy.  

Việc tính toán mã hóa khóa công khai quá tốn thời gian, làm thế nào để giảm thời gian tính toán?

Mỗi phiên trò chuyện (session), cả khách hàng và máy chủ đều tạo ra một "khóa trò chuyện" (session key) để sử dụng cho việc mã hóa thông tin. Vì "khóa trò chuyện" là mã hóa đối xứng, nên tốc độ tính toán rất nhanh, và khóa công khai của máy chủ chỉ được sử dụng để mã hóa "khóa trò chuyện" chính nó, từ đó giảm thiểu thời gian tính toán mã hóa.

(1) Khách hàng yêu cầu và xác minh khóa công khai từ máy chủ.  
(2) Cả hai bên thỏa thuận tạo ra "khóa trò chuyện".  
(3) Cả hai bên sử dụng "khóa trò chuyện" để mã hóa giao tiếp. Hai bước trên cùng còn được gọi là "bắt tay" (handshake).

## Các trường chính trong yêu cầu và phản hồi HTTP là gì?

### Yêu cầu (Request)

Tóm tắt:

- Dòng yêu cầu (Request Line)
- Tiêu đề yêu cầu (Request Headers)
- Thân yêu cầu (Request Body)

### Phản hồi (Response)

Tóm tắt:

- Dòng trạng thái (Status Line)
- Tiêu đề phản hồi (Response Headers)
- Thân phản hồi (Response Body)

## Cookie là gì?

Giao thức HTTP là **không trạng thái (stateless)**, chủ yếu để làm cho giao thức HTTP đơn giản nhất có thể và xử lý một lượng lớn giao dịch. HTTP/1.1 đã giới thiệu Cookie để lưu trữ thông tin trạng thái.

Cookie là **một dữ liệu nhỏ được máy chủ gửi đến trình duyệt của người dùng và lưu trữ trên máy cục bộ**, nó sẽ được gửi lại cho cùng máy chủ khi trình duyệt gửi yêu cầu tiếp theo, để thông báo cho máy chủ rằng hai yêu cầu đến từ cùng một trình duyệt. Vì mỗi yêu cầu sau đó đều cần mang theo dữ liệu Cookie, điều này sẽ tạo ra một khoản chi phí hiệu suất bổ sung (đặc biệt là trong môi trường di động).

Cookie trước đây được sử dụng để lưu trữ dữ liệu của khách hàng, vì không có phương pháp lưu trữ thích hợp khác và Cookie là phương pháp lưu trữ duy nhất. Tuy nhiên, hiện nay với sự hỗ trợ của các trình duyệt hiện đại, đã có nhiều phương pháp lưu trữ khác nhau, như sử dụng Web storage API (lưu trữ cục bộ và lưu trữ phiên) hoặc IndexedDB.

Cookie xuất hiện vì giao thức HTTP là không trạng thái, có nghĩa là máy chủ không nhớ bạn, có thể là mỗi lần làm mới trang web, bạn phải nhập lại tên người dùng và mật khẩu để đăng nhập. Điều này rõ ràng là không chấp nhận được, vai trò của cookie tương tự như máy chủ gắn một nhãn cho bạn, sau đó mỗi lần bạn gửi yêu cầu đến máy chủ, máy chủ có thể nhận ra cookie của bạn.

Tóm lại, một cookie có thể được coi là một "biến", có dạng tên=giá trị, được lưu trữ trên trình duyệt của người dùng; một phiên là một cấu trúc dữ liệu, trong hầu hết các trường hợp là "map" (key-value pairs), được lưu trữ trên máy chủ.

## Cookie có những ứng dụng và mục đích gì?

- Quản lý trạng thái phiên (như trạng thái đăng nhập của người dùng, giỏ hàng, điểm số trò chơi hoặc các thông tin cần lưu trữ)
- Cài đặt cá nhân hóa (như cài đặt tùy chỉnh của người dùng, chủ đề, v.v.)
- Theo dõi hành vi trình duyệt (như theo dõi và phân tích hành vi người dùng)

## Tổng kết kiến thức về Session

Ngoài việc lưu trữ thông tin người dùng thông qua Cookie trong trình duyệt của người dùng, chúng ta cũng có thể sử dụng Session để lưu trữ trên phía máy chủ, thông tin được lưu trữ trên phía máy chủ sẽ an toàn hơn.

Session có thể được lưu trữ trong tệp trên máy chủ, cơ sở dữ liệu hoặc bộ nhớ. Nó cũng có thể được lưu trữ trong cơ sở dữ liệu Redis, một cơ sở dữ liệu dạng bộ nhớ, để tăng hiệu suất.

Quá trình sử dụng Session để duy trì trạng thái đăng nhập của người dùng như sau:

1. Khi người dùng đăng nhập, người dùng gửi biểu mẫu chứa tên người dùng và mật khẩu, được đặt trong yêu cầu HTTP.
2. Máy chủ xác minh tên người dùng và mật khẩu, nếu chính xác thì lưu trữ thông tin người dùng vào Redis, và tạo ra một Session ID, nó sẽ được gửi lại trong phản hồi HTTP dưới dạng `Set-Cookie`.
3. Khi người dùng sau đó gửi yêu cầu đến cùng máy chủ, nó sẽ mang theo giá trị Cookie này, máy chủ sẽ trích xuất Session ID và lấy thông tin người dùng từ Redis để tiếp tục hoạt động kinh doanh trước đó.

> Lưu ý: Vấn đề về bảo mật của Session ID, không được để cho bên thứ ba tấn công dễ dàng nhận được nó, vì vậy không thể tạo ra một giá trị Session ID dễ dàng đoán được. Ngoài ra, cần thường xuyên tạo lại Session ID. Trong các tình huống yêu cầu bảo mật cao, như chuyển tiền và các hoạt động tương tự, ngoài việc sử dụng Session để quản lý trạng thái người dùng, cần phải xác minh lại người dùng, ví dụ như nhập lại mật khẩu hoặc sử dụng mã xác minh qua tin nhắn văn bản.

## Cơ chế hoạt động của Session là gì?

Cơ chế hoạt động của session là sau khi người dùng đăng nhập thành công, máy chủ sẽ tạo ra một session tương ứng. Sau khi tạo session, nó sẽ gửi session id cho khách hàng và lưu trữ nó trên máy chủ. Mỗi khi khách hàng truy cập máy chủ, nó sẽ gửi session id này, máy chủ sẽ tìm và trích xuất session tương ứng từ bộ nhớ, từ đó tiếp tục hoạt động.

## So sánh Cookie và Session

HTTP là một giao thức không trạng thái, do đó cần phải có một cách để duy trì trạng thái kết nối. Dưới đây là một tóm tắt về Cookie và Session.

- **Cookie**

  Cookie là phương pháp để duy trì trạng thái trên phía khách hàng.

  Đơn giản, Cookie là một chuỗi được gửi từ máy chủ đến khách hàng và được khách hàng lưu trữ. Để duy trì phiên làm việc, máy chủ có thể đặt chuỗi Cookie trong phần Set-Cookie của phản hồi cho yêu cầu của khách hàng. Sau khi nhận được Cookie, khách hàng lưu trữ chuỗi này và gửi nó kèm theo các yêu cầu sau đó để được nhận dạng.

  Ngoài những điều đã đề cập ở trên, Cookie có hai hình thức lưu trữ trên phía khách hàng. Một là Cookie phiên làm việc, nghĩa là lưu trữ chuỗi Cookie trên bộ nhớ và tự động xóa khi đóng trình duyệt. Hai là Cookie lưu trữ, nghĩa là lưu trữ trên đĩa cứng của khách hàng, thời gian hiệu lực được chỉ định trong phần đầu phản hồi từ máy chủ. Trong thời gian hiệu lực, khách hàng có thể truy xuất trực tiếp từ bộ nhớ địa phương. Cần lưu ý rằng Cookie lưu trữ trên đĩa cứng có thể được chia sẻ bởi nhiều trình duyệt proxy.

- **Session**

  Session là phương pháp để duy trì trạng thái trên phía máy chủ.

  Đầu tiên, cần phải hiểu rằng Session được lưu trữ trên máy chủ và có thể được lưu trữ trong cơ sở dữ liệu, tệp tin hoặc bộ nhớ. Mỗi người dùng có một Session riêng biệt, nơi ghi lại hoạt động của người dùng trên phía khách hàng. Chúng ta có thể hiểu rằng mỗi người dùng có một Session ID duy nhất, được sử dụng như một khóa băm cho tệp tin Session, thông qua giá trị này, chúng ta có thể xác định dữ liệu cụ thể trong Session. Dữ liệu này bao gồm các hoạt động của người dùng.

Khi máy chủ cần nhận dạng khách hàng, nó cần kết hợp với Cookie. Mỗi lần yêu cầu HTTP được gửi đi, khách hàng đều gửi thông tin Cookie tương ứng đến máy chủ. Trên thực tế, hầu hết các ứng dụng sử dụng Cookie để thực hiện theo dõi phiên. Khi tạo phiên lần đầu tiên, máy chủ sẽ thông báo cho khách hàng trong giao thức HTTP rằng cần ghi lại một Session ID trong Cookie. Sau đó, mỗi lần yêu cầu được gửi đi, Session ID này được gửi đến máy chủ để xác định người dùng. Nếu trình duyệt của khách hàng vô hiệu hóa Cookie, một kỹ thuật gọi là URL rewriting sẽ được sử dụng để theo dõi phiên, có nghĩa là mỗi lần giao tiếp HTTP, một tham số như sid=xxxxx sẽ được thêm vào URL để máy chủ xác định người dùng, từ đó giúp người dùng tự động điền thông tin như tên người dùng.

## Hiểu về tấn công SQL injection?

Tấn công SQL injection là khi kẻ tấn công chèn mã SQL độc hại vào trong yêu cầu HTTP. Khi máy chủ sử dụng các tham số để xây dựng câu lệnh SQL cho cơ sở dữ liệu, câu lệnh SQL độc hại cũng được xây dựng và thực thi trong cơ sở dữ liệu.

Ví dụ, khi người dùng đăng nhập và nhập tên người dùng là `abcxyz` và mật khẩu là `' or '1'='1'`, nếu máy chủ xây dựng câu lệnh SQL bằng cách sử dụng các tham số, câu lệnh SQL sẽ trở thành:

`select * from user where name = 'abcxyz' and password = '' or '1'='1'`

Dù tên người dùng và mật khẩu là gì, câu lệnh truy vấn sẽ trả về danh sách người dùng không rỗng. Để ngăn chặn tấn công SQL injection, chúng ta cần thực hiện các biện pháp sau:

Trên phía web:

1) Kiểm tra tính hợp lệ của dữ liệu đầu vào.

2) Giới hạn độ dài chuỗi đầu vào.

Trên phía máy chủ:

1) Không nối chuỗi SQL.

2) Sử dụng PrepareStatement để chuẩn bị trước câu lệnh SQL.

3) Kiểm tra tính hợp lệ của dữ liệu đầu vào. (Tại sao máy chủ cần kiểm tra tính hợp lệ? Nguyên tắc quan trọng nhất là không tin tưởng bên ngoài, ngăn chặn kẻ tấn công vượt qua yêu cầu từ phía web).

4) Lọc các ký tự đặc biệt trong các tham số cần thiết cho câu lệnh SQL, ví dụ như dấu nháy đơn, dấu nháy kép.

## RARP là gì? Nguyên tắc hoạt động

Tóm tắt: RARP (Reverse Address Resolution Protocol) là một giao thức mạng ở tầng mạng, hoạt động ngược lại với ARP. RARP cho phép các máy chủ chỉ biết địa chỉ phần cứng của mình biết địa chỉ IP tương ứng. RARP gửi một địa chỉ vật lý cần giải thích ngược và mong nhận lại địa chỉ IP tương ứng từ máy chủ RARP cung cấp thông tin cần thiết.

Nguyên tắc:  
(1) Mỗi thiết bị trên mạng đều có một địa chỉ phần cứng duy nhất, thường là địa chỉ MAC được cấp phát bởi nhà sản xuất thiết bị. Máy chủ đọc địa chỉ MAC từ card mạng và sau đó gửi một gói tin broadcast yêu cầu RARP trả lời với địa chỉ IP của máy chủ đó.

(2) Máy chủ RARP nhận được yêu cầu RARP và gán một địa chỉ IP cho máy chủ đó, sau đó gửi phản hồi RARP cho máy chủ.

(3) Sau khi nhận được phản hồi RARP, máy tính sử dụng địa chỉ IP nhận được để giao tiếp.

## 32. Phạm vi cổng hiệu quả là từ bao nhiêu đến bao nhiêu?

Cổng từ 0 đến 1023 được gọi là cổng nổi tiếng (well-known port), ví dụ như HTTP là 80, FTP là 20 (cổng dữ liệu) và 21 (cổng điều khiển).

UDP và TCP sử dụng 2 byte để lưu trữ số cổng, vì vậy phạm vi số cổng hiệu quả là từ 0 đến 65535. Phạm vi cổng động là từ 1024 đến 65535.

## Tại sao cần phân chia TCP/IP thành 5 tầng (hoặc 7 tầng)? Trả lời mở.

Trả lời: Kinh nghiệm của ARPANET cho thấy, đối với các giao thức mạng phức tạp, cấu trúc của chúng nên được tổ chức theo cấp bậc.

Lợi ích của việc phân tầng:

① Các tầng được phân tách độc lập với nhau.

② Linh hoạt và dễ dàng thay đổi.

③ Cấu trúc có thể được phân tách.

④ Dễ dàng triển khai và bảo trì.

⑤ Thúc đẩy công việc chuẩn hóa.

## Phương thức truy vấn DNS có những loại nào?

Có hai loại phương thức truy vấn DNS chính:

- Recursive Query (Truy vấn đệ quy): Máy khách gửi yêu cầu truy vấn DNS đến máy chủ DNS và yêu cầu máy chủ DNS giải quyết toàn bộ quá trình truy vấn cho nó.
- Iterative Query (Truy vấn lặp lại): Máy khách gửi yêu cầu truy vấn DNS đến máy chủ DNS và yêu cầu máy chủ DNS chỉ cung cấp thông tin cơ bản. Nếu máy chủ DNS không có thông tin, nó sẽ chỉ định cho máy khách truy vấn máy chủ DNS khác để tiếp tục truy vấn.

## Các trường cache riêng và chung trong HTTP? Bạn có biết không?

private chỉ định rằng tài nguyên được lưu trữ như là bộ nhớ cache riêng, chỉ có thể được sử dụng bởi một người dùng duy nhất, thường được lưu trữ trong trình duyệt của người dùng.

```html
Cache-Control: private
```

public chỉ định rằng tài nguyên được lưu trữ như là bộ nhớ cache chung, có thể được sử dụng bởi nhiều người dùng, thường được lưu trữ trong máy chủ proxy.

```html
Cache-Control: public
```

## Phương thức GET có cách viết tham số cố định không?

Trong quy ước, chúng ta viết các tham số sau dấu `?` và phân tách bằng dấu `&`.

Chúng ta biết rằng quá trình phân tích thông điệp là thông qua việc nhận dữ liệu TCP, sử dụng các công cụ như regex để trích xuất Header và Body, từ đó trích xuất các tham số.

Ví dụ, thêm token vào header để xác minh quyền truy cập của người dùng.

Nói cách khác, chúng ta có thể tự thỏa thuận cách viết tham số, miễn là máy chủ có thể hiểu được, vì cơ bản không thay đổi.

## Giới hạn độ dài của phương thức GET là gì?

Thông tin trên mạng thường nói rằng tham số nhập vào thanh địa chỉ trình duyệt có giới hạn.

Đầu tiên, cần lưu ý rằng giao thức HTTP không giới hạn độ dài của Header và URL, hạn chế URL chủ yếu do trình duyệt và máy chủ.

Lý do của máy chủ là xử lý URL dài sẽ tiêu tốn nhiều tài nguyên, vì vậy, vì hiệu suất và an ninh (ngăn chặn tấn công bằng cách tạo URL dài độc hại) mà giới hạn độ dài URL.

## Phương thức POST an toàn hơn GET?

Một số người nói rằng POST an toàn hơn GET vì dữ liệu không hiển thị trên thanh địa chỉ.

Tuy nhiên, từ góc độ truyền tải, cả hai đều không an toàn vì HTTP được truyền dữ liệu dưới dạng văn bản rõ ràng trên mạng, chỉ cần bắt gói dữ liệu trên các nút mạng là có thể nhận được toàn bộ dữ liệu.

Để truyền dữ liệu an toàn, chúng ta cần mã hóa, tức là sử dụng HTTPS.

## Phương thức POST có tạo ra hai gói dữ liệu TCP không? Bạn có biết không?

Một số bài viết đề cập rằng POST sẽ gửi header và body riêng biệt, gửi header trước, sau đó máy chủ trả về mã trạng thái 100 trước khi gửi body.

Giao thức HTTP không rõ ràng chỉ định rằng POST sẽ tạo ra hai gói dữ liệu TCP, và thực tế kiểm tra (Chrome) cho thấy header và body không được gửi riêng biệt.

Vì vậy, việc gửi header và body riêng biệt là hành vi của một số trình duyệt hoặc framework, không phải là hành vi bắt buộc của POST.

## 40. Session là gì?

Ngoài việc lưu trữ thông tin người dùng thông qua Cookie trong trình duyệt người dùng, chúng ta cũng có thể lưu trữ thông tin người dùng trên máy chủ bằng cách sử dụng Session, thông tin được lưu trữ trên máy chủ an toàn hơn.

Session có thể được lưu trữ trong tệp trên máy chủ, cơ sở dữ liệu hoặc bộ nhớ. Cũng có thể lưu trữ Session trong cơ sở dữ liệu bộ nhớ như Redis để tăng hiệu suất.
