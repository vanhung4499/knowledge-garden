---
title: JavaWeb Summary
tags: [java, javaee, javaweb]
categories: [java, javaee, javaweb]
date created: 2023-07-19
date modified: 2023-07-19
---

# Tổng kết JavaWeb

## Servlet

### Servlet là gì?

Servlet (Server Applet) là một chương trình phục vụ nhỏ hoặc trình kết nối dịch vụ. Servlet là một chương trình chạy ở phía máy chủ được viết bằng Java, có tính năng độc lập với nền tảng và giao thức, chủ yếu được sử dụng để duyệt và tạo dữ liệu tương tác, tạo nội dung Web động.

- Servlet theo nghĩa hẹp là một giao diện được thực hiện bằng Java.
- Servlet theo nghĩa rộng là bất kỳ lớp nào đã thực hiện giao diện Servlet này.

Servlet chạy trên các máy chủ ứng dụng hỗ trợ Java. Về nguyên tắc, Servlet có thể phản hồi bất kỳ loại yêu cầu nào, nhưng trong hầu hết các trường hợp, Servlet chỉ được sử dụng để mở rộng máy chủ Web dựa trên giao thức HTTP.

### Sự khác biệt giữa Servlet và CGI

Trước khi có công nghệ Servlet, Web chủ yếu sử dụng công nghệ CGI. Sự khác biệt giữa chúng như sau:

- Servlet được viết bằng Java, chạy trong quá trình máy chủ và có thể chạy service() bằng cách sử dụng nhiều luồng, một thể hiện có thể phục vụ nhiều yêu cầu và thường không bị hủy bỏ;
- CGI (Common Gateway Interface) là giao diện cổng chung. Nó tạo ra một quá trình mới cho mỗi yêu cầu và bị hủy bỏ sau khi phục vụ hoàn tất, do đó hiệu suất thấp hơn Servlet.

### Phiên bản Servlet và các tính năng chính

| Phiên bản   | Ngày        | JAVA EE/JDK Phiên bản | Tính năng chính                                                      |
| ----------- | ----------- | -------------------- | -------------------------------------------------------------------- |
| Servlet 4.0 | Tháng 10 2017 | JavaEE 8             | HTTP2                                                                |
| Servlet 3.1 | Tháng 5 2013 | JavaEE 7             | I/O không chặn, cơ chế nâng cấp giao thức HTTP                        |
| Servlet 3.0 | Tháng 12 2009 | JavaEE 6, JavaSE 6   | Có thể cắm, dễ phát triển, Servlet không đồng bộ, bảo mật, tải tệp lên |
| Servlet 2.5 | Tháng 10 2005 | JavaEE 5, JavaSE 5   | Phụ thuộc vào JavaSE 5, hỗ trợ chú thích                            |
| Servlet 2.4 | Tháng 11 2003 | J2EE 1.4, J2SE 1.3   | web.xml sử dụng XML Schema                                           |
| Servlet 2.3 | Tháng 8 2001  | J2EE 1.3, J2SE 1.2   | Bộ lọc                                                               |
| Servlet 2.2 | Tháng 8 1999  | J2EE 1.2, J2SE 1.2   | Trở thành tiêu chuẩn J2EE                                            |
| Servlet 2.1 | Tháng 11 1998 | Không xác định       | First official specification, thêm RequestDispatcher, ServletContext |
| Servlet 2.0 |               | JDK 1.1              | Một phần của Java Servlet Development Kit 2.0                        |
| Servlet 1.0 | Tháng 6 1997  |                      |                                                                      |

### Sự khác biệt giữa Servlet và JSP

1. Servlet là một lớp Java chạy trên máy chủ, phụ thuộc vào máy chủ để truyền dữ liệu đến trình duyệt.
2. JSP thực chất là Servlet, mỗi lần chạy, JSP sẽ được biên dịch thành tệp .java, sau đó biên dịch thành tệp .class.
3. Có JSP, Servlet không còn chịu trách nhiệm tạo ra nội dung động, mà chuyển sang điều khiển logic chương trình, điều khiển luồng dữ liệu giữa JSP và JavaBean.
4. JSP tập trung vào giao diện, trong khi Servlet tập trung vào logic điều khiển, trong mô hình kiến trúc MVC, JSP thích hợp để làm vai trò giao diện View, Servlet thích hợp để làm vai trò điều khiển Controller.

### Mô tả vòng đời của Servlet

![img](http://www.runoob.com/wp-content/uploads/2014/07/Servlet-LifeCycle.jpg)

Vòng đời của Servlet như sau:

1. **Load** - Yêu cầu HTTP đầu tiên đến máy chủ được gửi đến Servlet container. Container sử dụng trình tải lớp để tải servlet tương ứng với lớp servlet;
2. **Khởi tạo** - Servlet được khởi tạo bằng cách gọi phương thức **init()**.
3. **Phục vụ** - Servlet gọi phương thức **service()** để xử lý yêu cầu của khách hàng.
4. **Hủy** - Servlet được hủy bằng cách gọi phương thức **destroy()**.
5. **Gỡ cài đặt** - Servlet được thu gom bởi bộ thu gom rác của JVM.

### Làm thế nào để thực hiện chế độ đơn luồng của servlet

```java
<%@ page isThreadSafe="false" %>
```

### Làm thế nào để lấy tham số truy vấn hoặc dữ liệu biểu mẫu mà người dùng gửi trong servlet

- Sử dụng phương thức **getParameter()** của HttpServletRequest.
- Sử dụng phương thức **getParameterValues()** của HttpServletRequest.
- Sử dụng phương thức **getParameterMap()** của HttpServletRequest.

### Các phương thức chính của request

- **setAttribute(String name, Object)**: Đặt giá trị tham số của request với tên là name.
- **getAttribute(String name)**: Trả về giá trị thuộc tính được chỉ định bởi name của request.
- **getAttributeNames()**: Trả về tập hợp tên của tất cả các thuộc tính của request, kết quả là một đối tượng Enum.
- **getCookies()**: Trả về tất cả các đối tượng Cookie của khách hàng, kết quả là một mảng Cookie.
- **getCharacterEncoding()**: Trả về kiểu mã hóa ký tự của yêu cầu.
- **getContentLength()**: Trả về độ dài của phần thân yêu cầu.
- **getHeader(String name)**: Trả về thông tin tiêu đề được định nghĩa bởi giao thức HTTP.
- **getHeaders(String name)**: Trả về tất cả các giá trị của tiêu đề yêu cầu được chỉ định bởi name, kết quả là một đối tượng Enum.
- **getHeaderNames()**: Trả về tất cả các tên tiêu đề yêu cầu, kết quả là một đối tượng Enum.
- **getInputStream()**: Trả về luồng đầu vào của yêu cầu, được sử dụng để lấy dữ liệu từ yêu cầu.
- **getMethod()**: Trả về phương thức mà khách hàng sử dụng để truyền dữ liệu đến máy chủ.
- **getParameter(String name)**: Trả về giá trị của tham số được chỉ định bởi name mà khách hàng truyền đến máy chủ.
- **getParameterNames()**: Trả về tập hợp tên của tất cả các tham số mà khách hàng truyền đến máy chủ, kết quả là một đối tượng Enum.
- **getParameterValues(String name)**: Trả về tất cả các giá trị của tham số được chỉ định bởi name mà khách hàng truyền đến máy chủ.
- **getProtocol()**: Trả về tên giao thức mà khách hàng sử dụng để truyền dữ liệu đến máy chủ.
- **getQueryString()**: Trả về chuỗi truy vấn.
- **getRequestURI()**: Trả về địa chỉ của khách hàng gửi yêu cầu.
- **getRemoteAddr()**: Trả về địa chỉ IP của khách hàng.
- **getRemoteHost()**: Trả về tên của khách hàng.
- **getSession([Boolean create])**: Trả về phiên liên quan đến yêu cầu.
- **getServerName()**: Trả về tên máy chủ.
- **getServletPath()**: Trả về đường dẫn của tệp script mà khách hàng yêu cầu.
- **getServerPort()**: Trả về số cổng của máy chủ.
- **removeAttribute(String name)**: Xóa một thuộc tính của yêu cầu.

## JSP

### Đối tượng tích hợp trong JSP

1. **request**: Chứa thông tin **yêu cầu từ phía khách hàng**.
2. **response**: Chứa thông tin **phản hồi từ máy chủ đến khách hàng**.
3. **session**: Chủ yếu được sử dụng để **phân biệt thông tin và trạng thái của mỗi người dùng**.
4. **pageContext**: Quản lý **các thuộc tính của trang**.
5. **application**: Được tạo khi máy chủ khởi động và kết thúc khi máy chủ dừng, **lưu trữ dữ liệu chung của toàn bộ hệ thống ứng dụng**, là một đối tượng chia sẻ (nhiều người dùng trong cùng một container chia sẻ một đối tượng application).
6. **out**: Dùng để **xuất dữ liệu đến khách hàng**.
7. **config**: Đối tượng cấu hình đoạn mã, được sử dụng để **khởi tạo các tham số cấu hình của Servlet**.
8. **page**: Đại diện cho **trang JSP hiện tại**.
9. **exception**: Xử lý lỗi và ngoại lệ xảy ra trong quá trình thực thi tệp JSP, chỉ có thể sử dụng trong **trang lỗi**.

### Phạm vi của JSP

1. **page**: Một trang JSP duy nhất.
2. **request**: Một yêu cầu từ khách hàng.
3. **session**: Một phiên làm việc.
4. **application**: Từ khi máy chủ khởi động đến khi dừng.

### 7 hướng dẫn hành động trong JSP và chức năng của chúng

1. **jsp:forward**: Thực hiện chuyển hướng trang, chuyển tiếp yêu cầu đến trang tiếp theo.
2. **jsp:param**: Sử dụng để truyền tham số, phải được sử dụng cùng với các thẻ hỗ trợ tham số khác.
3. **jsp:include**: Sử dụng để **động nhập một trang JSP khác**.
4. **jsp:plugin**: Sử dụng để **tải xuống JavaBean hoặc Applet để thực thi trên khách hàng**.
5. **jsp:useBean**: Tìm kiếm hoặc tạo một JavaBean.
6. **jsp:setProperty**: Đặt giá trị thuộc tính của JavaBean.
7. **jsp:getProperty**: Lấy giá trị thuộc tính của JavaBean.

### Sự khác biệt giữa INCLUDE động và INCLUDE tĩnh trong JSP

- **INCLUDE tĩnh**: Sử dụng cú pháp include giả để thực hiện, **không kiểm tra sự thay đổi của tệp đã bao gồm**, phù hợp cho việc bao gồm các trang **tĩnh <%@ include file="tên trang.html" %>**. **Trước tiên hợp nhất sau đó biên dịch**.
- **INCLUDE động**: Sử dụng hành động jsp:include để thực hiện **<jsp:include page="tên trang.jsp" flush="true">**, nó **luôn kiểm tra sự thay đổi trong tệp đã bao gồm**, phù hợp cho việc bao gồm các trang **động**, và có thể **chứa tham số**. **Trước tiên biên dịch sau đó hợp nhất**.

## Nguyên lý

### Sự khác biệt giữa chuyển tiếp yêu cầu (forward) và chuyển hướng (redirect)

- Hiệu suất:
    - Forward > Redirect
- Hiển thị:
    - Redirect: Hiển thị URL mới
    - Forward: Địa chỉ URL không thay đổi
- Dữ liệu:
    - Forward: Có thể chia sẻ dữ liệu trong request
    - Redirect: Không thể chia sẻ dữ liệu
- Số lần yêu cầu:
    - Redirect: 2 lần
    - Forward: 1 lần

### Sự khác biệt giữa yêu cầu GET và POST

- GET:
    - Lấy dữ liệu từ máy chủ, thường không được sử dụng cho các hoạt động ghi.
    - Dữ liệu được truyền qua URL, có giới hạn kích thước dữ liệu truyền.
    - Dữ liệu yêu cầu được đính kèm vào URL, được phân tách bằng dấu ? và các tham số được phân tách bằng dấu &.
    - Bảo mật kém.
- POST:
    - Gửi dữ liệu đến máy chủ, thường được sử dụng cho các hoạt động ghi.
    - Dữ liệu truyền qua phần thân của yêu cầu HTTP, không giới hạn kích thước dữ liệu truyền.
    - Dữ liệu yêu cầu không được hiển thị trong URL.
    - Bảo mật cao.
    - Dữ liệu yêu cầu được gửi trong phần thân yêu cầu HTTP.

### Sau khi người dùng nhập URL vào trình duyệt, điều gì xảy ra? Hãy viết quy trình yêu cầu và phản hồi

1. Phân giải tên miền
2. Ba bước bắt tay TCP
3. Trình duyệt gửi yêu cầu HTTP đến máy chủ
4. Trình duyệt gửi thông tin tiêu đề yêu cầu
5. Máy chủ xử lý yêu cầu
6. Máy chủ tạo phản hồi
7. Máy chủ gửi thông tin tiêu đề phản hồi
8. Máy chủ gửi dữ liệu
9. Đóng kết nối TCP

### Web Service là gì?

1. Web Service là một ứng dụng mà nó **tiết lộ một API có thể được gọi thông qua Web**.
2. Nó dựa trên giao thức HTTP để truyền dữ liệu, cho phép các ứng dụng chạy trên các máy chủ khác nhau giao tiếp và trao đổi dữ liệu hoặc tích hợp với nhau.

### Có những công nghệ nào để theo dõi phiên?

Vì giao thức HTTP ban đầu không có trạng thái, máy chủ cần theo dõi phiên của người dùng để phân biệt giữa các yêu cầu khác nhau. Dưới đây là một số công nghệ để theo dõi phiên:

- **URL rewriting**: Thêm thông tin phiên vào URL như một tham số trong yêu cầu.
- **Cookie**: Lưu trữ thông tin phiên trong cookie, được gửi và nhận bởi trình duyệt.
- **HttpSession**: Tạo phiên làm việc cho mỗi người dùng và lưu trữ thông tin phiên trên máy chủ.
- **Hidden form fields**: Thêm thông tin phiên vào các trường ẩn trong biểu mẫu HTML.
- **Session ID trong URL**: Thêm ID phiên vào URL của yêu cầu.
- **Token-based authentication**: Sử dụng mã thông báo để xác thực và theo dõi phiên.

### Có những mã trạng thái kết quả phản hồi nào và ý nghĩa của chúng?

- `1xx`: Mã trạng thái thông tin
- `2xx`: Mã trạng thái thành công
    - 200: Yêu cầu thành công
    - 204: Yêu cầu thành công nhưng không có dữ liệu mới
    - 206: Yêu cầu thành công và trả về một phần dữ liệu
- `3xx`: Mã trạng thái chuyển hướng
    - 301: Chuyển hướng vĩnh viễn
    - 302: Chuyển hướng tạm thời
    - 304: Máy chủ không thay đổi dữ liệu yêu cầu
- `4xx`: Mã trạng thái lỗi từ phía khách hàng
    - 400: Yêu cầu chứa cú pháp không hợp lệ
    - 401: Yêu cầu yêu cầu xác thực qua HTTP
    - 403: Truy cập tới tài nguyên bị từ chối bởi máy chủ
    - 404: Không tìm thấy tài nguyên yêu cầu trên máy chủ
- `5xx`: Mã trạng thái lỗi từ phía máy chủ
    - 500: Lỗi máy chủ trong quá trình xử lý yêu cầu
    - 503: Máy chủ tạm thời quá tải hoặc đang bảo trì, không thể xử lý yêu cầu

### Tài liệu XML được định nghĩa dưới bao nhiêu hình thức? Những hình thức này khác nhau như thế nào? Có những cách nào để phân tích tài liệu XML?

(1) tài liệu XML có hai hình thức ràng buộc:

1. Ràng buộc DTD
2. Ràng buộc Schema

(2) Sự khác biệt giữa các hình thức tài liệu XML:

1. DTD không tuân thủ cú pháp cấu trúc XML, trong khi Schema tuân thủ cú pháp cấu trúc XML.
2. DTD có tính mở rộng kém hơn, tài liệu XML chỉ có thể tham chiếu đến một tệp DTD. Schema có thể tham chiếu đến nhiều tệp.
3. DTD không hỗ trợ không gian tên (hiểu là cấu trúc gói), Schema hỗ trợ không gian tên.
4. DTD hỗ trợ ít dữ liệu hơn, Schema hỗ trợ nhiều kiểu dữ liệu hơn.

(3) Có ba cách chính để phân tích XML:

- Phân tích DOM:
	- (a) Tải toàn bộ tài liệu XML vào bộ nhớ, tạo thành cấu trúc cây, tạo đối tượng.
	- (b) Dễ gây lỗi tràn bộ nhớ.
	- (c) Có thể thực hiện thêm, xóa, sửa.
- Phân tích SAX:
	- (a) Đọc và phân tích đồng thời.
	- (b) Không thể thực hiện thêm, xóa, sửa.
- Phân tích DOM4J (sử dụng trong Hibernate):
	- (a) Cho phép phân tích SAX tạo ra cấu trúc cây.
	- (b) Các API chính:
		- 1) SAXReader.read(xxx.xml) đại diện cho việc phân tích tài liệu XML, trả về đối tượng Document.
		- 2) Document.getRootElement(), trả về nút gốc của tài liệu, là đối tượng Element.
		- 3) Element:
			- .element(…): Lấy phần tử con đầu tiên có tên được chỉ định. Có thể không chỉ định tên.
			- .elements(…): Lấy tất cả các phần tử con có tên được chỉ định. Có thể không chỉ định tên.
			- .getText(): Lấy nội dung văn bản của phần tử hiện tại.
			- .elementText(…): Lấy giá trị văn bản của phần tử con có tên được chỉ định.
			- .addElement(): Thêm nút con.
			- .setText(): Đặt nội dung của thẻ con.
		- 4) XMLWriter.write(".."): Ghi ra.
		- 5) XMLWriter.close(): Đóng luồng đầu ra.
