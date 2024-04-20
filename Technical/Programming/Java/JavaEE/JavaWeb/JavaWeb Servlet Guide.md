---
title: JavaWeb Servlet Guide
tags: [java, javaee, javaweb, servlet]
categories: [java, javaee, javaweb, servlet]
date created: 2023-07-19
date modified: 2023-07-19
---

# Hướng dẫn Servlet trong JavaWeb

## Giới thiệu về JavaWeb

### Ứng dụng Web

Web, trong tiếng Anh có nghĩa là trang web, được sử dụng để chỉ tài nguyên trên máy chủ Internet mà người dùng có thể truy cập.

Ứng dụng Web là một loại ứng dụng mà người dùng có thể truy cập thông qua Web. Lợi ích lớn nhất của ứng dụng này là người dùng dễ dàng truy cập ứng dụng mà không cần cài đặt phần mềm khác.

Các tài nguyên Web trên Internet mà người dùng có thể truy cập chia thành hai loại:

- Tài nguyên web tĩnh: Dữ liệu trong trang web luôn không thay đổi. Các tệp tài nguyên tĩnh phổ biến: html, css, các loại hình ảnh (jpg, png)
- Tài nguyên web động: Dữ liệu trong trang web được tạo ra bởi chương trình và sẽ khác nhau tại các thời điểm khác nhau. Công nghệ tài nguyên động phổ biến: JSP/Servlet, ASP, PHP

### Các máy chủ Web phổ biến

- [Tomcat](http://tomcat.apache.org/)
- [Jetty](http://www.eclipse.org/jetty/)
- [Resin](https://caucho.com/)
- [Apache](http://httpd.apache.org/)
- [Nginx](http://nginx.org/en/)
- [WebSphere](https://www.ibm.com/cloud/websphere-application-platform)
- [WebLogic](https://www.oracle.com/middleware/technologies/weblogic.html)
- JBoss

## Giới thiệu về Servlet

### Servlet là gì

Servlet (Server Applet) là một chương trình máy chủ được viết bằng Java, có tính năng độc lập với nền tảng và giao thức. Chức năng chính của Servlet là tương tác và tạo ra dữ liệu trang web động.

- Servlet theo nghĩa hẹp chỉ đề cập đến một Interface được triển khai bằng Java.
- Servlet theo nghĩa rộng hơn đề cập đến bất kỳ lớp nào triển khai Interface Servlet đó.

Servlet chạy trên các máy chủ ứng dụng hỗ trợ Java. Về cơ bản, Servlet có thể phản hồi bất kỳ loại yêu cầu nào, nhưng hầu hết các trường hợp, Servlet chỉ được sử dụng để mở rộng máy chủ Web dựa trên giao thức HTTP.

### Sự khác biệt giữa Servlet và CGI

Trước khi có công nghệ Servlet, Web chủ yếu sử dụng công nghệ CGI. Sự khác biệt giữa chúng như sau:

- Servlet được viết bằng Java, chạy trong quá trình máy chủ và có thể chạy service() bằng cách sử dụng nhiều luồng, một thể hiện có thể phục vụ nhiều yêu cầu và thường không bị hủy bỏ.
- CGI (Common Gateway Interface) là Interface cổng thông tin chung. Nó tạo một quá trình mới cho mỗi yêu cầu và bị hủy sau khi dịch vụ hoàn thành, do đó hiệu suất thấp hơn Servlet.

### Phiên bản Servlet và tính năng chính

| Phiên bản   | Ngày        | JAVA EE/JDK Phiên bản | Tính năng chính                                                      |
| ----------- | ----------- | -------------------- | -------------------------------------------------------------------- |
| Servlet 4.0 | Tháng 10/2017 | JavaEE 8             | HTTP2                                                                |
| Servlet 3.1 | Tháng 5/2013 | JavaEE 7             | I/O không chặn, cơ chế nâng cấp giao thức HTTP                        |
| Servlet 3.0 | Tháng 12/2009| JavaEE 6, JavaSE 6   | Có thể cắm, dễ phát triển, Servlet không đồng bộ, bảo mật, tải tệp lên |
| Servlet 2.5 | Tháng 10/2005| JavaEE 5, JavaSE 5   | Phụ thuộc vào JavaSE 5, hỗ trợ chú thích                            |
| Servlet 2.4 | Tháng 11/2003| J2EE 1.4, J2SE 1.3   | web.xml sử dụng XML Schema                                            |
| Servlet 2.3 | Tháng 8/2001 | J2EE 1.3, J2SE 1.2   | Bộ lọc                                                               |
| Servlet 2.2 | Tháng 8/1999 | J2EE 1.2, J2SE 1.2   | Trở thành tiêu chuẩn J2EE                                             |
| Servlet 2.1 | Tháng 11/1998| Không xác định       | Tiêu chuẩn đầu tiên, thêm RequestDispatcher, ServletContext          |
| Servlet 2.0 |               | JDK 1.1              | Một phần của Java Servlet Development Kit 2.0                        |
| Servlet 1.0 | Tháng 6/1997 |                      |                                                                      |

### Nhiệm vụ của Servlet

Servlet thực hiện các nhiệm vụ chính sau:

- Đọc dữ liệu rõ ràng được gửi từ máy khách (trình duyệt). Điều này bao gồm các biểu mẫu HTML trên trang web hoặc có thể là biểu mẫu từ applet hoặc chương trình khách HTTP tùy chỉnh.
- Đọc dữ liệu ẩn được gửi từ máy khách (trình duyệt). Điều này bao gồm cookies, kiểu phương tiện và định dạng nén mà trình duyệt hiểu được và nhiều hơn nữa.
- Xử lý dữ liệu và tạo ra kết quả. Quá trình này có thể yêu cầu truy cập cơ sở dữ liệu, thực hiện cuộc gọi RMI hoặc CORBA, gọi dịch vụ Web hoặc tính toán trực tiếp để tạo ra phản hồi tương ứng.
- Gửi dữ liệu rõ ràng (tài liệu) đến máy khách (trình duyệt). Định dạng tài liệu có thể là nhiều loại, bao gồm tệp văn bản (HTML hoặc XML), tệp nhị phân (hình ảnh GIF), Excel và nhiều hơn nữa.
- Gửi phản hồi HTTP ẩn cho máy khách (trình duyệt). Điều này bao gồm thông báo loại tài liệu được trả về cho trình duyệt hoặc khách hàng khác (ví dụ: HTML), thiết lập cookies và thông số bộ nhớ cache và các nhiệm vụ tương tự.

### Vòng đời của Servlet

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230719191524.png)

Vòng đời của Servlet như sau:

1. **Tải** - Yêu cầu HTTP đầu tiên đến máy chủ được gửi đến Servlet container. Bằng cách sử dụng trình tải lớp, máy chủ tải servlet tương ứng với lớp servlet;
2. **Khởi tạo** - Servlet được khởi tạo bằng cách gọi phương thức **init()**.
3. **Phục vụ** - Servlet gọi phương thức **service()** để xử lý yêu cầu từ khách hàng.
4. **Hủy bỏ** - Servlet kết thúc bằng cách gọi phương thức **destroy()**.
5. **Gỡ bỏ** - Servlet được thu gom bởi bộ thu gom rác của JVM.

## Servlet API

### Gói Servlet

Java Servlet được viết bằng Java và chạy trên máy chủ web có hỗ trợ quy định Servlet. Servlet có thể được tạo bằng cách sử dụng gói **javax.servlet** và **javax.servlet.http**, đây là một phần tiêu chuẩn của Java Enterprise Edition (Java EE), là một phiên bản mở rộng của thư viện Java dành cho các dự án phát triển lớn.

Java Servlet được tạo và biên dịch giống như bất kỳ lớp Java nào khác. Sau khi bạn cài đặt gói Servlet và thêm chúng vào Classpath của máy tính, bạn có thể biên dịch Servlet bằng trình biên dịch Java của JDK hoặc bất kỳ trình biên dịch nào khác.

### Interface Servlet

Interface Servlet định nghĩa năm phương thức sau:

```java
public interface Servlet {
    void init(ServletConfig var1) throws ServletException;

    ServletConfig getServletConfig();

    void service(ServletRequest var1, ServletResponse var2) throws ServletException, IOException;

    String getServletInfo();

    void destroy();
}
```

#### Phương thức init()

Phương thức init() được thiết kế để chỉ được gọi một lần. Nó được gọi khi Servlet được tạo lần đầu tiên và không được gọi lại cho mỗi yêu cầu của người dùng. Do đó, nó được sử dụng để khởi tạo một lần duy nhất, tương tự như phương thức init() của Applet.

Servlet được tạo khi người dùng gọi URL tương ứng với Servlet đó, nhưng bạn cũng có thể chỉ định Servlet được tải khi máy chủ khởi động.

Khi người dùng gọi một Servlet, một phiên bản Servlet được tạo ra và mỗi yêu cầu của người dùng sẽ tạo ra một luồng mới và chuyển cho phù hợp với phương thức doGet() hoặc doPost(). Phương thức init() đơn giản chỉ tạo hoặc tải dữ liệu mà sẽ được sử dụng trong suốt vòng đời của Servlet.

Định nghĩa phương thức init() như sau:

```java
public void init() throws ServletException {
  // Mã khởi tạo...
}
```

#### Phương thức service()

**Phương thức service() là phương thức chính để thực hiện các nhiệm vụ thực tế**. Servlet container (tức là máy chủ web) gọi phương thức service() để xử lý yêu cầu từ khách hàng (trình duyệt) và gửi phản hồi được định dạng trở lại cho khách hàng.

Phương thức service() có hai tham số: ServletRequest và ServletResponse. ServletRequest được sử dụng để đóng gói thông tin yêu cầu, ServletResponse được sử dụng để đóng gói thông tin phản hồi, do đó **thực chất hai lớp này là đóng gói giao thức truyền thông**.

Mỗi khi máy chủ nhận được một yêu cầu Servlet, máy chủ sẽ tạo ra một luồng mới và gọi phương thức service(). Phương thức service() kiểm tra loại yêu cầu HTTP (GET, POST, PUT, DELETE, v.v.) và gọi các phương thức doGet(), doPost(), doPut(), doDelete() tương ứng khi cần thiết.

Dưới đây là đặc điểm của phương thức này:

```java
public void service(ServletRequest request,
                    ServletResponse response)
      throws ServletException, IOException{
}
```

Phương thức service() được gọi bởi container, phương thức service() sẽ gọi doGet(), doPost(), doPut(), doDelete() tùy thuộc vào loại yêu cầu. Vì vậy, bạn không cần làm gì trong phương thức service(), bạn chỉ cần ghi đè doGet() hoặc doPost() dựa trên loại yêu cầu từ khách hàng.

Phương thức doGet() và doPost() là hai phương thức phổ biến nhất trong mỗi yêu cầu dịch vụ. Dưới đây là đặc điểm của hai phương thức này.

#### Phương thức doGet()

Yêu cầu GET xuất phát từ một yêu cầu URL bình thường hoặc từ một biểu mẫu HTML không chỉ định METHOD, nó được xử lý bởi phương thức doGet().

```java
public void doGet(HttpServletRequest request,
                  HttpServletResponse response)
    throws ServletException, IOException {
    // Mã Servlet
}
```

#### Phương thức doPost()

Yêu cầu POST xuất phát từ một biểu mẫu HTML chỉ định METHOD là POST, nó được xử lý bởi phương thức doPost().

```java
public void doPost(HttpServletRequest request,
                   HttpServletResponse response)
    throws ServletException, IOException {
    // Mã Servlet
}
```

#### Phương thức destroy()

Phương thức destroy() chỉ được gọi một lần, được gọi khi vòng đời của Servlet kết thúc. Phương thức destroy() cho phép Servlet đóng kết nối cơ sở dữ liệu, dừng các luồng nền, ghi danh sách cookie hoặc bộ đếm nhấp chuột vào đĩa và thực hiện các hoạt động làm sạch tương tự.

Sau khi gọi phương thức destroy(), đối tượng servlet được đánh dấu để thu gom rác. Phương thức destroy() được định nghĩa như sau:

```java
  public void destroy() {
    // Mã hủy bỏ...
  }
```

## Servlet và Mã trạng thái HTTP

### Mã trạng thái HTTP

Định dạng của yêu cầu HTTP và phản hồi HTTP là tương tự nhau, có cấu trúc như sau:

- Dòng trạng thái ban đầu + ký tự xuống dòng (CR + LF)
- Không hoặc nhiều dòng tiêu đề + ký tự xuống dòng
- Một dòng trống, tức là ký tự xuống dòng
- Một thân tin nhắn tùy chọn, ví dụ: tệp, dữ liệu truy vấn hoặc đầu ra truy vấn

Ví dụ, tiêu đề phản hồi từ máy chủ như sau:

```http
HTTP/1.1 200 OK
Content-Type: text/html
Header2: ...
...
HeaderN: ...
  (Blank Line)
<!doctype ...>
<html>
<head>...</head>
<body>
...
</body>
</html>
```

Dòng trạng thái bao gồm phiên bản HTTP (trong trường hợp này là HTTP/1.1), một mã trạng thái (trong trường hợp này là 200) và một thông báo ngắn tương ứng với mã trạng thái (trong trường hợp này là OK).

Dưới đây là danh sách mã trạng thái HTTP có thể được trả về từ máy chủ web và thông tin liên quan:

- `1**`: Mã trạng thái thông tin
- `2**`: Mã trạng thái thành công
  - 200: Yêu cầu thành công
  - 204: Chỉ ra yêu cầu thành công nhưng không có thông tin mới được trả về
  - 206: Chỉ ra máy chủ đã hoàn thành một phần yêu cầu GET tài nguyên
- `3**`: Mã trạng thái chuyển hướng
  - 301: Chuyển hướng vĩnh viễn
  - 302: Chuyển hướng tạm thời
  - 304: Máy chủ cho phép yêu cầu truy cập tài nguyên, nhưng không đáp ứng điều kiện
- `4**`: Mã trạng thái lỗi từ phía khách hàng
  - 400: Cú pháp yêu cầu chứa lỗi
  - 401: Yêu cầu gửi yêu cầu cần xác thực qua HTTP
  - 403: Truy cập vào tài nguyên yêu cầu bị máy chủ từ chối
  - 404: Không tìm thấy tài nguyên yêu cầu trên máy chủ
- `5**`: Mã trạng thái lỗi từ phía máy chủ
  - 500: Máy chủ gặp lỗi khi thực hiện yêu cầu
  - 503: Máy chủ tạm thời quá tải hoặc đang được bảo trì, không thể xử lý yêu cầu

### Cách đặt mã trạng thái HTTP

Dưới đây là các phương thức có sẵn để đặt mã trạng thái HTTP trong chương trình Servlet. Các phương thức này có sẵn thông qua đối tượng `HttpServletResponse`.

| Số thứ tự | Phương thức & Mô tả                                                                                                                                                                                                                   |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1         | **public void setStatus ( int statusCode )** Phương thức này đặt một mã trạng thái tùy ý. Phương thức setStatus nhận một int (mã trạng thái) làm tham số. Nếu phản hồi của bạn chứa một mã trạng thái đặc biệt và tài liệu, hãy chắc chắn gọi setStatus trước khi thực sự trả lại bất kỳ nội dung nào bằng PrintWriter. |
| 2         | **public void sendRedirect(String url)** Phương thức này tạo ra một phản hồi 302, cùng với một tiêu đề _Location_ chứa URL tài liệu mới.                                                                                                                                                        |
| 3         | **public void sendError(int code, String message)** Phương thức này gửi một mã trạng thái (thường là 404), cùng với một thông điệp ngắn được định dạng tự động trong tài liệu HTML và gửi đến khách hàng.                                                                                          |

### Ví dụ về mã trạng thái HTTP

Dưới đây là một ví dụ về việc gửi mã lỗi 407 đến trình duyệt khách hàng, trình duyệt sẽ hiển thị thông báo "Cần xác thực !!!".

```java
// Import the required java libraries
import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.util.*;

// Extend HttpServlet class
public class showError extends HttpServlet {

  // Method to handle GET method request
  public void doGet(HttpServletRequest request,
                    HttpServletResponse response)
            throws ServletException, IOException
  {
      // Set the error code and reason
      response.sendError(407, "Need authentication!!!" );
  }
  // Method to handle POST method request
  public void doPost(HttpServletRequest request,
                     HttpServletResponse response)
      throws ServletException, IOException {
     doGet(request, response);
  }
}
```

Bây giờ, gọi Servlet trên sẽ hiển thị kết quả sau:

```http
HTTP Status 407 - Need authentication!!!
type Status report
message Need authentication!!!
description The client must first authenticate itself with the proxy (Need authentication!!!).
Apache Tomcat/5.5.29
```
