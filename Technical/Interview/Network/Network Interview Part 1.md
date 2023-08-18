---
title: Network Interview Part 1
date created: 2023-05-29
date modified: 2023-08-18
tags: [network, interview]
categories: [network, interview]
---

# Network Interview Q&A Part 1

## 1. OSI model có bảy tầng là gì và chức năng của từng tầng là gì?

### Tóm tắt ngắn gọn

- Tầng vật lý (Physical Layer): Truyền dữ liệu ở mức vật lý, ví dụ như cáp mạng, tiêu chuẩn card mạng.
- Tầng liên kết dữ liệu (Data Link Layer): Xác định định dạng dữ liệu, cách truyền và cách định danh dữ liệu, ví dụ như địa chỉ MAC của card mạng.
- Tầng mạng (Network Layer): Xác định địa chỉ IP, quản lý chức năng định tuyến, ví dụ như chuyển tiếp dữ liệu giữa các thiết bị khác nhau.
- Tầng vận chuyển (Transport Layer): Cung cấp chức năng truyền dữ liệu từ điểm này đến điểm khác, ví dụ như TCP, UDP.
- Tầng phiên (Session Layer): Điều khiển khả năng giao tiếp giữa các ứng dụng, ví dụ như phân phối dữ liệu từ các phần mềm khác nhau.
- Tầng trình diễn (Presentation Layer): Xác định định dạng dữ liệu, chức năng nén và mã hóa cơ bản.
- Tầng ứng dụng (Application Layer): Bao gồm các ứng dụng phần mềm khác nhau, bao gồm cả ứng dụng web.

### Giải thích

- Ở tầng bốn, dữ liệu giao vận được gọi là **đoạn TCP hoặc dữ liệu người dùng UDP** (Segments).
- Ở tầng ba, dữ liệu mạng được gọi là **gói** (Packages).
- Ở tầng hai, dữ liệu liên kết dữ liệu được gọi là **khung** (Frames).
- Ở tầng một, dữ liệu vật lý được gọi là **luồng bit** (Bits).

### Tóm tắt

- Mô hình bảy tầng mạng là một tiêu chuẩn, không phải là một thực hiện cụ thể.
- Mô hình bốn tầng mạng là một mô hình thực hiện cụ thể.
- Mô hình bốn tầng mạng được tạo ra bằng cách tóm gọn và kết hợp từ mô hình bảy tầng mạng.

## Quá trình yêu cầu HTTP hoàn chỉnh bao gồm những nội dung nào?

### Cách trả lời thứ nhất

- Thiết lập kết nối giữa máy khách và máy chủ.
- Sau khi thiết lập kết nối, máy khách gửi yêu cầu đến máy chủ.
- Máy chủ nhận yêu cầu và cung cấp thông tin phản hồi.
- Trình duyệt của máy khách phân tích và hiển thị nội dung được trả về, sau đó đóng kết nối.

### Cách trả lời thứ hai

- Giải quyết tên miền --> Bắt đầu bắt tay 3 bước TCP --> Sau khi thiết lập kết nối TCP, gửi yêu cầu HTTP --> Máy chủ phản hồi yêu cầu HTTP, trình duyệt nhận mã HTML --> Trình duyệt phân tích mã HTML và yêu cầu các tài nguyên trong mã HTML (như js, css, hình ảnh, v.v.) --> Trình duyệt hiển thị và render trang web cho người dùng.

## Bạn hiểu DNS là gì?  

Giải thích chính thức: DNS (Domain Name System, Hệ thống tên miền) là một cơ sở dữ liệu phân tán trên Internet được sử dụng để ánh xạ tên miền và địa chỉ IP với nhau. Nó giúp người dùng truy cập Internet một cách dễ dàng hơn mà không cần phải nhớ địa chỉ IP mà máy tính có thể đọc trực tiếp.

Quá trình chuyển đổi tên miền chính xác của máy chủ thành địa chỉ IP tương ứng được gọi là giải quyết tên miền (hoặc giải quyết tên máy chủ).

Giải thích đơn giản, chúng ta thường quen với việc ghi nhớ tên của một trang web, ví dụ như www.google.com, thay vì ghi nhớ địa chỉ IP của nó, ví dụ: 167.23.10.2.

## 4. Nguyên tắc hoạt động của DNS là gì?

Chuyển đổi tên miền của máy chủ thành địa chỉ IP, nằm trong lớp ứng dụng và sử dụng giao thức UDP. (Giao thức DNS là giao thức ứng dụng, đã được một nhà tuyển dụng hỏi trước đây)

Quá trình:  
Tóm tắt: Bộ nhớ cache của trình duyệt, bộ nhớ cache hệ thống, bộ nhớ cache của bộ định tuyến, bộ nhớ cache của máy chủ DNS, bộ nhớ cache của máy chủ tên miền gốc, bộ nhớ cache của máy chủ tên miền cấp cao nhất, bộ nhớ cache của máy chủ tên miền chính.

1. Khi người dùng nhập tên miền, trình duyệt trước tiên kiểm tra xem bản sao của nó có chứa địa chỉ IP tương ứng trong bộ nhớ cache không, nếu có, quá trình giải quyết kết thúc.
2. Nếu không trúng, trình duyệt kiểm tra xem bộ nhớ cache hệ thống (ví dụ: hosts của Windows) có chứa kết quả giải quyết trước đó không, nếu có, quá trình giải quyết kết thúc.
3. Nếu không có trúng, trình duyệt yêu cầu máy chủ DNS cục bộ giải quyết (LDNS).
4. Nếu LDNS không trúng, nó sẽ trực tiếp yêu cầu máy chủ tên miền gốc để giải quyết. Máy chủ tên miền gốc trả về địa chỉ máy chủ tên miền chính.
5. Lúc này, LDNS gửi yêu cầu đến gTLD (tên miền cấp cao), máy chủ gTLD nhận yêu cầu và trả về địa chỉ của Name Server tương ứng với tên miền đó.
6. Name Server dựa trên bảng ánh xạ tìm địa chỉ IP mục tiêu và trả về cho LDNS.
7. LDNS lưu trữ tên miền này và địa chỉ IP tương ứng vào bộ nhớ cache, sau đó trả kết quả giải quyết cho người dùng. Người dùng lưu trữ kết quả giải quyết vào bộ nhớ cache hệ thống dựa trên giá trị TTL, quá trình giải quyết tên miền kết thúc ở đây.

## Tại sao việc giải quyết tên miền sử dụng giao thức UDP?

Bởi vì UDP nhanh! Giao thức DNS của UDP chỉ cần một yêu cầu và một phản hồi.

Trong khi đó, sử dụng giao thức DNS dựa trên TCP yêu cầu ba bước bắt tay, gửi và nhận dữ liệu, và bốn bước xóa kết nối. Tuy nhiên, giao thức UDP không thể truyền nội dung vượt quá 512 byte.

Tuy nhiên, khi khách hàng truy vấn tên miền từ máy chủ DNS, thông thường nội dung trả về không vượt quá 512 byte, do đó việc truyền bằng UDP là đủ.

## Tại sao việc truyền vùng sử dụng giao thức TCP?

Bởi vì giao thức TCP đáng tin cậy!

Khi bạn sao chép nội dung từ máy chủ DNS chính, bạn có thể sử dụng UDP không đáng tin cậy sao? Vì nội dung truyền bằng giao thức TCP lớn, bạn sẽ sử dụng giao thức UDP có giới hạn chỉ có thể truyền 512 byte? Nếu dữ liệu đồng bộ lớn hơn 512 byte, bạn sẽ làm gì? Vì vậy, sử dụng giao thức TCP là tốt hơn!

## Sự khác biệt giữa kết nối dài và kết nối ngắn trong HTTP

Trong HTTP/1.0, mặc định sử dụng kết nối ngắn. Điều này có nghĩa là mỗi khi khách hàng và máy chủ thực hiện một hoạt động HTTP, một kết nối mới được thiết lập và kết thúc khi nhiệm vụ hoàn thành.

Tuy nhiên, từ HTTP/1.1 trở đi, mặc định sử dụng kết nối dài để duy trì tính năng kết nối.

## TCP liên kết gói và gỡ gói là gì? Nguyên nhân xảy ra?

Một nhiệm vụ hoàn chỉnh có thể bị chia thành nhiều gói để gửi qua TCP, hoặc nhiều gói nhỏ có thể được đóng gói thành một gói dữ liệu lớn, đây là vấn đề về gỡ gói và liên kết gói của TCP.

##### Nguyên nhân

1. Kích thước dữ liệu được ghi bởi ứng dụng lớn hơn kích thước bộ đệm gửi của socket.
2. Chia thành các đoạn TCP có kích thước MSS (Maximum Segment Size) (MSS = Độ dài đoạn TCP - Độ dài tiêu đề TCP).
3. Gói dữ liệu Ethernet lớn hơn MTU và phải được chia thành các đoạn IP (MTU: Maximum Transmission Unit - Độ dài gói dữ liệu tối đa mà một lớp giao thức truyền thông cụ thể có thể chuyển tiếp).

##### Giải pháp

1. Độ dài thông điệp cố định.
2. Thêm ký tự đặc biệt như xuống dòng hoặc dấu cách vào cuối gói để phân tách.
3. Chia thông điệp thành phần tiêu đề và phần cuối.
4. Sử dụng các giao thức phức tạp khác như giao thức RTMP.

## Tại sao máy chủ lưu trữ chức năng bộ nhớ đệm này và cách thực hiện?

**Lý do**

- Giảm áp lực cho máy chủ: Bằng cách lưu trữ các tài nguyên phổ biến trong bộ nhớ đệm, máy chủ có thể giảm tải và giảm thời gian xử lý yêu cầu từ khách hàng.
- Giảm độ trễ khi khách hàng truy cập tài nguyên: Bộ nhớ đệm thường nằm trong bộ nhớ và việc truy xuất từ bộ nhớ đệm nhanh hơn. Ngoài ra, máy chủ bộ nhớ đệm có thể nằm gần vị trí vật lý của khách hàng, ví dụ như bộ nhớ đệm trình duyệt.

**Cách thực hiện**

- Sử dụng máy chủ proxy để lưu trữ bộ nhớ đệm: Máy chủ proxy lưu trữ các tài nguyên phổ biến từ máy chủ gốc và phục vụ các yêu cầu từ khách hàng bằng cách truy xuất từ bộ nhớ đệm.
- Sử dụng bộ nhớ đệm trình duyệt: Trình duyệt web cũng có khả năng lưu trữ bộ nhớ đệm để lưu trữ các tài nguyên đã truy cập trước đó. Khi khách hàng yêu cầu tài nguyên, trình duyệt trước tiên kiểm tra xem tài nguyên có trong bộ nhớ đệm không và trả về từ bộ nhớ đệm nếu có.

## Phương thức yêu cầu HTTP, bạn biết bao nhiêu?

Trong **yêu cầu HTTP**, khách hàng gửi một **dòng yêu cầu** đầu tiên trong **thông điệp yêu cầu**, bao gồm phương thức.

Theo tiêu chuẩn HTTP, yêu cầu HTTP có thể sử dụng nhiều phương thức khác nhau.

HTTP/1.0 xác định ba phương thức yêu cầu: GET, POST và HEAD.

HTTP/1.1 thêm sáu phương thức yêu cầu: OPTIONS, PUT, PATCH, DELETE, TRACE và CONNECT.

| STT    | Phương thức | Mô tả                                                         |
| :----- | :--------- | :----------------------------------------------------------- |
| 1      | GET        | Yêu cầu thông tin trang web cụ thể và trả về thân thể của nó.  |
| 2      | HEAD       | Tương tự như GET, nhưng chỉ trả về tiêu đề mà không có thân thể. |
| 3      | POST       | Gửi dữ liệu từ khách hàng lên máy chủ để xử lý (ví dụ: gửi biểu mẫu hoặc tải lên tệp). Dữ liệu được chứa trong thân thể yêu cầu. Yêu cầu POST có thể dẫn đến việc tạo mới tài nguyên và / hoặc thay đổi tài nguyên hiện có. |
| 4      | PUT        | Gửi dữ liệu từ khách hàng để thay thế hoặc tạo mới tài nguyên tại địa chỉ xác định. Dữ liệu được chứa trong thân thể yêu cầu. |
| 5      | DELETE     | Yêu cầu máy chủ xóa tài nguyên tại địa chỉ xác định.          |
| 6      | CONNECT    | Được sử dụng để thiết lập một kết nối mạng riêng tư qua một máy chủ proxy. |
| 7      | OPTIONS    | Yêu cầu máy chủ cung cấp thông tin về các tùy chọn được hỗ trợ trên tài nguyên được yêu cầu. |
| 8      | TRACE      | Yêu cầu máy chủ gửi lại yêu cầu ban đầu từ khách hàng, cho phép khách hàng xem xét hoặc gỡ lỗi các biến đổi được thực hiện trên yêu cầu khi đi qua các máy chủ trung gian. |
| 9      | PATCH      | Sử dụng để cập nhật một phần của tài nguyên tại địa chỉ xác định. Dữ liệu được chứa trong thân thể yêu cầu. |

## Sự khác biệt giữa GET và POST, bạn biết những gì?

1. GET là phương thức để lấy dữ liệu, trong khi POST là phương thức để thay đổi dữ liệu.
2. GET đặt dữ liệu yêu cầu trên URL, được phân tách bằng dấu ? và các tham số được phân tách bằng dấu &. Điều này làm cho GET không an toàn hơn POST. Trong khi đó, POST đặt dữ liệu yêu cầu trong phần thân của gói HTTP (request body), làm cho POST an toàn hơn GET.
3. Kích thước dữ liệu yêu cầu của GET có giới hạn là 2KB (thực tế phụ thuộc vào trình duyệt), trong khi POST lý thuyết không có giới hạn.
4. GET tạo ra một gói dữ liệu TCP, trình duyệt gửi cả tiêu đề HTTP và dữ liệu cùng một lúc. Máy chủ phản hồi 200 (trả về dữ liệu). Trong khi đó, POST tạo ra hai gói dữ liệu TCP, trình duyệt gửi trước tiêu đề, máy chủ phản hồi 100 tiếp tục, sau đó trình duyệt gửi dữ liệu và máy chủ phản hồi 200 OK (trả về dữ liệu).
5. Yêu cầu GET có thể được lưu trữ trong bộ nhớ cache của trình duyệt, trong khi POST không thể, trừ khi được cấu hình thủ công.
6. Sự khác biệt cốt lõi: GET là phương thức idempotent, trong khi POST không phải là phương thức idempotent.

   > Idempotent là một thuộc tính trong toán học và lập trình, nghĩa là một hoạt động hoặc hàm có thể được áp dụng nhiều lần mà không ảnh hưởng đến kết quả. Đơn giản nói, nghĩa là các yêu cầu giống nhau sẽ cho kết quả giống nhau.

Đúng vì những khác biệt này, không nên và **không được sử dụng phương thức GET để thay đổi dữ liệu**. Vì GET là phương thức idempotent, **trong môi trường mạng không ổn định, nó sẽ cố gắng thử lại**. Nếu sử dụng GET để thêm dữ liệu, có nguy cơ xảy ra **thao tác trùng lặp**, và thao tác trùng lặp này có thể gây ra tác động phụ (trình duyệt và hệ điều hành không biết rằng bạn đang sử dụng GET để thực hiện thao tác thêm).

## Một kết nối TCP có thể tương ứng với bao nhiêu yêu cầu HTTP?

Nếu duy trì kết nối, một kết nối TCP có thể gửi nhiều yêu cầu HTTP.

## Có thể gửi các yêu cầu HTTP cùng một lúc trong một kết nối TCP không? Ví dụ: Gửi ba yêu cầu và nhận ba phản hồi cùng một lúc không?

Trong HTTP/1.1, một kết nối TCP chỉ có thể xử lý một yêu cầu tại một thời điểm, có nghĩa là hai yêu cầu không thể chồng chéo với nhau, thời gian từ khi bắt đầu đến khi kết thúc của hai yêu cầu bất kỳ trong cùng một kết nối TCP không thể chồng chéo.

Mặc dù HTTP/1.1 có kỹ thuật Pipelining để gửi nhiều yêu cầu cùng một lúc, nhưng do mặc định bị tắt trong trình duyệt, nên có thể coi đây là không khả thi. Trong HTTP/2, với tính năng Multiplexing, nhiều yêu cầu HTTP có thể được thực hiện song song trên cùng một kết nối TCP.

Vì vậy, trong thời đại của HTTP/1.1, trình duyệt làm cách nào để cải thiện hiệu suất tải trang? Có hai điểm chính:

- Giữ kết nối TCP đã thiết lập với máy chủ và xử lý tuần tự nhiều yêu cầu trên cùng một kết nối.
- Thiết lập nhiều kết nối TCP với máy chủ.

## Trình duyệt có giới hạn số lượng kết nối TCP được thiết lập với cùng một Host không?

Đúng. Trình duyệt có giới hạn số lượng kết nối TCP được thiết lập với cùng một Host.

Ví dụ, Chrome cho phép tối đa sáu kết nối TCP đến cùng một Host. Tuy nhiên, các trình duyệt khác có một số khác biệt nhất định. Giới hạn này được áp dụng để tránh quá tải máy chủ và tối ưu hóa hiệu suất tải trang.

Nếu các tài nguyên được yêu cầu từ cùng một Host và là HTTPS, trình duyệt có thể thương lượng với máy chủ để sử dụng giao thức HTTP/2, trong đó Multiplexing cho phép nhiều yêu cầu được thực hiện trên cùng một kết nối TCP.

Nếu không thể sử dụng HTTP/2 hoặc HTTPS (vì HTTP/2 thường được triển khai trên HTTPS), trình duyệt sẽ thiết lập nhiều kết nối TCP với cùng một Host. Số lượng kết nối TCP tối đa được thiết lập phụ thuộc vào cấu hình của trình duyệt và các yếu tố khác nhau. Tuy nhiên, nó cũng có giới hạn để tránh quá tải và tối ưu hóa hiệu suất.

## Quá trình hiển thị trang chủ sau khi nhập địa chỉ URL vào trình duyệt?

> - Dựa trên tên miền, thực hiện giải quyết DNS;
> - Nhận địa chỉ IP đã giải quyết và thiết lập kết nối TCP;
> - Gửi yêu cầu HTTP đến địa chỉ IP;
> - Máy chủ xử lý yêu cầu;
> - Trả về kết quả phản hồi;
> - Đóng kết nối TCP;
> - Trình duyệt phân tích cú pháp HTML;
> - Trình duyệt tạo bố cục và hiển thị.

## Nhập URL vào thanh địa chỉ trình duyệt và nhấn Enter, quá trình đằng sau sẽ thực hiện những bước kỹ thuật nào?

### Câu trả lời thứ nhất

1. Kiểm tra bộ nhớ cache của trình duyệt để xem có bản lưu trữ nào cho tên miền đã được lưu trữ trước đó không. Nếu không có,
2. Kiểm tra tệp hosts trên máy tính,
3. Gọi API, trong Linux sử dụng hàm Socket gethostbyname,
4. Gửi yêu cầu DNS đến máy chủ DNS để truy vấn máy chủ DNS cục bộ, trong quá trình này sử dụng giao thức UDP,
5. Nếu trong cùng một mạng con, sử dụng giao thức ARP để truy vấn địa chỉ MAC của máy chủ DNS. Nếu không, truy vấn DNS của cổng mặc định. Nếu vẫn không tìm thấy, tiếp tục truy vấn máy chủ DNS gốc cho đến khi nhận được địa chỉ IP (có hơn 400 máy chủ DNS gốc trên toàn cầu, do 13 tổ chức khác nhau quản lý),
6. Lúc này, chúng ta đã có địa chỉ IP của máy chủ và số cổng mặc định, HTTP mặc định là 80 và HTTPS là 443. Đầu tiên, thử gửi yêu cầu HTTP, sau đó sử dụng Socket để thiết lập kết nối TCP,
7. Sau khi thiết lập kết nối thành công qua ba lần bắt tay, bắt đầu truyền dữ liệu. Nếu đúng là giao thức HTTP, chỉ cần trả về kết quả là xong,
8. Nếu không phải là giao thức HTTP, máy chủ sẽ trả về một thông báo chuyển hướng bắt đầu bằng số 5, cho biết đang sử dụng giao thức HTTPS. Điều này có nghĩa là địa chỉ IP không thay đổi, nhưng số cổng đã thay đổi từ 80 thành 443. Tiếp theo, thực hiện bốn lần bắt tay để đóng kết nối,
9. Tiếp tục quá trình trên, ngoài việc thay đổi số cổng từ 80 thành 443, còn sử dụng công nghệ mã hóa SSL để đảm bảo an toàn dữ liệu truyền qua mạng, đảm bảo không bị thay đổi hoặc thay thế trong quá trình truyền,
10. Lần này vẫn là ba lần bắt tay, thống nhất thuật toán xác thực, mã hóa và kiểm tra trong quá trình này cũng sẽ kiểm tra chứng chỉ bảo mật CA của đối tác,
11. Sau khi xác nhận không có lỗi, bắt đầu giao tiếp, máy chủ sẽ trả về dữ liệu của trang web bạn muốn truy cập. Trong quá trình này, trình duyệt sẽ phân tích cú pháp và hiển thị giao diện, liên quan đến công nghệ ajax, cho đến khi chúng ta nhìn thấy trang web đầy màu sắc.

## Hãy nói về quá trình giải quyết DNS, cụ thể hơn

- Khi yêu cầu được khởi tạo, nếu trình duyệt là Chrome, trước tiên nó sẽ tìm kiếm xem đã có **bản lưu trữ nào của tên miền tương ứng với địa chỉ IP** chưa. Nếu có, trình duyệt sẽ bỏ qua quá trình giải quyết DNS và sử dụng địa chỉ IP đã lưu trữ. Nếu không, nó sẽ **tìm trong tệp hosts trên ổ cứng** xem có không. Nếu có, trình duyệt sẽ sử dụng địa chỉ IP trong tệp hosts.
    
- Nếu không tìm thấy địa chỉ IP tương ứng trong tệp hosts, trình duyệt sẽ gửi một **yêu cầu DNS đến máy chủ DNS cục bộ**. **Máy chủ DNS cục bộ thường được cung cấp bởi nhà cung cấp dịch vụ Internet của bạn**, chẳng hạn như China Telecom, China Mobile, v.v.
    
- Khi yêu cầu DNS cho tên miền bạn nhập vào đến máy chủ DNS cục bộ, máy chủ DNS cục bộ sẽ **trước tiên kiểm tra bản lưu trữ của mình**. Nếu có bản lưu trữ, nó có thể trả kết quả trực tiếp từ bản lưu trữ và kết thúc quá trình giải quyết DNS. Nếu không, máy chủ DNS cục bộ sẽ tiếp tục **gửi yêu cầu đến máy chủ DNS gốc**.
    
- Máy chủ DNS cục bộ tiếp tục gửi yêu cầu đến máy chủ tên miền, trong ví dụ này là máy chủ tên miền .com. Khi máy chủ tên miền .com nhận được yêu cầu, nó sẽ không trả về trực tiếp một cặp tên miền và địa chỉ IP, mà thay vào đó nó sẽ cho máy chủ DNS cục bộ biết địa chỉ máy chủ giải quyết tên miền của bạn.
    
- Cuối cùng, máy chủ DNS cục bộ gửi yêu cầu đến máy chủ giải quyết tên miền. Lúc này, nó sẽ nhận được một cặp tên miền và địa chỉ IP tương ứng. Máy chủ DNS cục bộ không chỉ trả về địa chỉ IP cho máy tính người dùng, mà còn lưu trữ cặp tên miền và địa chỉ IP này trong bộ nhớ cache để sử dụng cho các yêu cầu sau, giúp tăng tốc truy cập mạng.

## 18、Load balancing DNS là chiến lược gì?

Khi một trang web có đủ người dùng, nếu mọi yêu cầu tài nguyên đều nằm trên cùng một máy chủ, máy chủ đó có thể bị quá tải và gặp sự cố bất kỳ lúc nào. Giải pháp để xử lý vấn đề này là sử dụng công nghệ cân bằng tải DNS. Nguyên tắc của nó là trong **máy chủ DNS, cấu hình nhiều địa chỉ IP cho cùng một tên miền. Khi trả lời truy vấn DNS, máy chủ DNS sẽ trả về các kết quả giải quyết khác nhau từ các địa chỉ IP được ghi trong tệp DNS theo thứ tự, định tuyến yêu cầu của khách hàng đến các máy chủ khác nhau**, từ đó đạt được mục tiêu cân bằng tải. Ví dụ, có thể dựa trên tải của mỗi máy chủ, khoảng cách địa lý từ máy chủ đến vị trí của người dùng, v.v.

## Sự khác biệt giữa HTTPS và HTTP

1. Dữ liệu được truyền bằng giao thức HTTP là không được mã hóa, tức là dạng văn bản thô, do đó việc sử dụng giao thức HTTP để truyền tải thông tin riêng tư là không an toàn. HTTPS là một giao thức mạng được xây dựng dựa trên SSL+HTTP, cho phép truyền tải dữ liệu được mã hóa và xác thực danh tính, nên an toàn hơn giao thức HTTP.
2. Giao thức HTTPS yêu cầu cần có chứng chỉ từ cơ quan chứng thực (CA), và chứng chỉ miễn phí thường ít, do đó cần phải trả phí để có chứng chỉ.
3. HTTP và HTTPS sử dụng các cách kết nối hoàn toàn khác nhau và sử dụng cổng khác nhau, cổng 80 cho HTTP và cổng 443 cho HTTPS.

## SSL/TLS là gì?

SSL đại diện cho Secure Sockets Layer (Lớp ổ cắm bảo mật). Đây là một giao thức được sử dụng để mã hóa và xác thực dữ liệu được gửi giữa ứng dụng (như trình duyệt) và máy chủ web. SSL/TLS bao gồm cả xác thực và mã hóa. Cơ chế mã hóa HTTPS là một cơ chế mã hóa kết hợp giữa mã hóa khóa chia sẻ và mã hóa khóa công khai.

Chức năng của giao thức SSL/TLS: xác thực người dùng và dịch vụ, mã hóa dữ liệu, duy trì tính toàn vẹn dữ liệu là một giao thức ứng dụng hoạt động ở tầng ứng dụng để mã hóa và giải mã yêu cầu và phản hồi, mã hóa và giải mã yêu cầu và phản hồi cần hai khóa khác nhau, nên được gọi là mã hóa không đối xứng; mã hóa và giải mã đều sử dụng cùng một khóa là mã hóa đối xứng.
