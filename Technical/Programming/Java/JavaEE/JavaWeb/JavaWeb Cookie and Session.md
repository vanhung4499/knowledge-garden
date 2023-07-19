---
title: JavaWeb Cookie and Session
tags: [java, javaee, javaweb]
categories: [java, javaee, javaweb]
date created: 2023-07-19
date modified: 2023-07-19
---

# JavaWeb - Cookie vs Session

## Cookie

Vì HTTP là một giao thức không trạng thái, máy chủ không biết về danh tính của khách hàng chỉ từ kết nối mạng.

Theo dõi phiên là một kỹ thuật phổ biến trong chương trình web để theo dõi toàn bộ phiên của người dùng. Các kỹ thuật theo dõi phiên thông thường là Cookie và Session.

### Cookie là gì

Cookie thực tế là thông tin văn bản được lưu trữ trên máy khách và chứa thông tin theo dõi khác nhau.

**Các bước làm việc của Cookie:**

1. Khách hàng yêu cầu máy chủ, nếu máy chủ cần ghi lại trạng thái của người dùng, nó sẽ sử dụng phản hồi để cấp phát một Cookie cho trình duyệt khách hàng.
2. Trình duyệt khách hàng sẽ lưu trữ Cookie.
3. Khi trình duyệt lại yêu cầu trang web, trình duyệt sẽ gửi Cookie này cùng với URL yêu cầu đến máy chủ. Máy chủ kiểm tra Cookie này để nhận dạng trạng thái của người dùng.

**_Lưu ý: Chức năng Cookie cần được trình duyệt hỗ trợ, nếu trình duyệt không hỗ trợ Cookie hoặc Cookie bị vô hiệu hóa, chức năng Cookie sẽ không hoạt động._**

Trong Java, Cookie được đóng gói thành lớp `javax.servlet.http.Cookie`.

### Phân tích Cookie

Cookie thường được đặt trong thông tin tiêu đề HTTP (mặc dù JavaScript cũng có thể đặt một Cookie trực tiếp trên trình duyệt).

Servlet đặt Cookie sẽ gửi thông tin tiêu đề như sau:

```http
HTTP/1.1 200 OK
Date: Fri, 04 Feb 2000 21:03:38 GMT
Server: Apache/1.3.9 (UNIX) PHP/4.0b3
Set-Cookie: name=xyz; expires=Friday, 04-Feb-07 22:03:38 GMT;
                 path=/; domain=w3cschool.cc
Connection: close
Content-Type: text/html
```

Như bạn thấy, tiêu đề `Set-Cookie` chứa một cặp tên và giá trị, một ngày và giờ GMT, một đường dẫn và một miền. Tên và giá trị sẽ được mã hóa URL. Trường hợp hết hạn là một chỉ thị cho trình duyệt "quên" Cookie sau thời gian và ngày cụ thể.

Nếu trình duyệt được cấu hình để lưu trữ Cookie, nó sẽ giữ thông tin này cho đến ngày hết hạn. Khi trình duyệt của người dùng trỏ đến bất kỳ trang web nào phù hợp với đường dẫn và miền của Cookie, nó sẽ gửi lại Cookie này đến máy chủ. Tiêu đề của trình duyệt có thể như sau:

```http
GET / HTTP/1.0
Connection: Keep-Alive
User-Agent: Mozilla/4.6 (X11; I; Linux 2.2.6-15apmac ppc)
Host: zink.demon.co.uk:1126
Accept: image/gif, */*
Accept-Encoding: gzip
Accept-Language: en
Accept-Charset: iso-8859-1,*,utf-8
Cookie: name=xyz
```

### Phương thức trong lớp Cookie

| Phương thức                                  | Chức năng                                                                                                      |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| public void setDomain(String pattern)        | Phương thức này đặt miền áp dụng cho Cookie.                                                                   |
| public String getDomain()                    | Phương thức này trả về miền áp dụng cho Cookie.                                                                 |
| public void setMaxAge(int expiry)            | Phương thức này đặt thời gian hết hạn của Cookie (tính bằng giây). Nếu không được đặt, Cookie chỉ có hiệu lực trong phiên hiện tại. |
| public int getMaxAge()                       | Phương thức này trả về tuổi thọ tối đa của Cookie (tính bằng giây). Mặc định, -1 có nghĩa là Cookie sẽ tồn tại cho đến khi trình duyệt đóng. |
| public String getName()                      | Phương thức này trả về tên của Cookie.                                                                          |
| public void setValue(String newValue)         | Phương thức này đặt giá trị liên kết với Cookie.                                                               |
| public String getValue()                     | Phương thức này trả về giá trị liên kết với Cookie.                                                            |
| public void setPath(String uri)              | Phương thức này đặt đường dẫn áp dụng cho Cookie. Nếu không chỉ định đường dẫn, tất cả URL trong cùng thư mục (bao gồm các thư mục con) sẽ trả về Cookie. |
| public String getPath()                       | Phương thức này trả về đường dẫn áp dụng cho Cookie.                                                             |
| public void setSecure(boolean flag)          | Phương thức này đặt giá trị boolean, chỉ cho trình duyệt biết rằng Cookie chỉ được truyền trong các giao thức an toàn như HTTPS và SSL. |
| public void setComment(String purpose)        | Phương thức này đặt chú thích mô tả mục đích của Cookie. Chú thích này rất hữu ích khi trình duyệt hiển thị Cookie cho người dùng. |
| public String getComment()                   | Phương thức này trả về chú thích mô tả mục đích của Cookie, nếu Cookie không có chú thích thì trả về null.      |

### Thời hạn của Cookie

`maxAge` của `Cookie` xác định thời hạn hiệu lực của Cookie, tính bằng giây.

Nếu `maxAge` là 0, có nghĩa là xóa Cookie;

Nếu là số âm, chỉ có hiệu lực trong cùng một trình duyệt và trong cửa sổ con mở trong cùng một trình duyệt, sau khi đóng cửa sổ, Cookie sẽ không còn hiệu lực.

Cookie cung cấp phương thức `getMaxAge()` và `setMaxAge(int expiry)` để đọc và ghi thuộc tính `maxAge`.

### Miền của Cookie

Cookie không thể được sử dụng qua các miền khác nhau. Cookie được phát hành bởi tên miền www.google.com sẽ không được gửi đến tên miền www.baidu.com. Điều này được quyết định bởi cơ chế bảo mật và riêng tư của Cookie. Cơ chế bảo mật và riêng tư này ngăn chặn các trang web trái phép truy cập Cookie của các trang web khác.

Thông thường, hai tên miền con của cùng một tên miền cấp 1 cũng không thể sử dụng Cookie lẫn nhau. Nếu muốn cho phép các tên miền con của một tên miền sử dụng Cookie, cần thiết lập tham số domain của Cookie.

Trong Java, sử dụng phương thức `setDomain(String domain)` và `getDomain()` để đặt và lấy domain.

### Đường dẫn của Cookie

Thuộc tính Path xác định đường dẫn mà Cookie được phép truy cập.

Trong Java, sử dụng phương thức `setPath(String uri)` và `getPath()` để đặt và lấy path.

### Thuộc tính bảo mật của Cookie

Giao thức HTTP không chỉ không có trạng thái mà còn không an toàn.

Dữ liệu sử dụng giao thức HTTP được truyền trực tiếp trên mạng mà không được mã hóa, có thể bị chặn. Nếu không muốn Cookie được truyền trong các giao thức không an toàn như HTTP, bạn có thể đặt thuộc tính secure của Cookie thành true. Trình duyệt chỉ truyền Cookie này trong các giao thức an toàn như HTTPS và SSL.

Trong Java, sử dụng phương thức `setSecure(boolean flag)` và `getSecure()` để đặt và lấy thuộc tính Secure.

### Ví dụ về Cookie

#### Thêm Cookie

Có ba bước để thêm Cookies thông qua Servlet:

1. Tạo đối tượng Cookie: Bạn có thể gọi constructor Cookie với tên và giá trị của cookie, cả hai đều là chuỗi.
2. Đặt thời gian sống tối đa: Bạn có thể sử dụng phương thức `setMaxAge` để chỉ định thời gian mà cookie sẽ tồn tại (tính bằng giây).
3. Gửi Cookie đến tiêu đề HTTP phản hồi: Bạn có thể sử dụng `response.addCookie` để thêm Cookies vào tiêu đề HTTP phản hồi.

AddCookies.java

```java
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/servlet/AddCookies")
public class AddCookies extends HttpServlet {
    private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public AddCookies() {
        super();
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response)
                    throws ServletException, IOException {
        // Tạo Cookie cho tên và URL
        Cookie name = new Cookie("name", URLEncoder.encode(request.getParameter("name"), "UTF-8")); // Mã hóa URL
        Cookie url = new Cookie("url", request.getParameter("url"));

        // Đặt thời gian sống tối đa cho hai Cookie là 24 giờ
        name.setMaxAge(60 * 60 * 24);
        url.setMaxAge(60 * 60 * 24);

        // Thêm hai Cookie vào tiêu đề HTTP phản hồi
        response.addCookie(name);
        response.addCookie(url);

        // Đặt kiểu nội dung phản hồi
        response.setContentType("text/html;charset=UTF-8");

        PrintWriter out = response.getWriter();
        String title = "Ví dụ về Cookie";
        String docType = "<!DOCTYPE html>\n";
        out.println(docType + "<html>\n" + "<head><title>" + title + "</title></head>\n"
                        + "<body bgcolor=\"#f0f0f0\">\n" + "<h1 align=\"center\">" + title
                        + "</h1>\n" + "<ul>\n" + "  <li><b>Tên trang web:</b> " + request.getParameter("name")
                        + "\n</li>" + "  <li><b>URL trang web:</b> " + request.getParameter("url")
                        + "\n</li>" + "</ul>\n" + "</body></html>");
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
                    throws ServletException, IOException {
        doGet(request, response);
    }

}
```

addCookies.jsp

```java
<%@ page language="java" pageEncoding="UTF-8" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
  <meta charset="utf-8">
  <title>Thêm Cookie</title>
</head>
<body>
<form action=/servlet/AddCookies method="GET">
  Tên trang web: <input type="text" name="name">
  <br/>
  URL trang web: <input type="text" name="url"/><br>
  <input type="submit" value="Gửi"/>
</form>
</body>
</html>
```

#### Hiển thị Cookie

Để đọc Cookies, bạn cần tạo một mảng đối tượng `javax.servlet.http.Cookie` bằng cách gọi phương thức `getCookies()` của `HttpServletRequest`. Sau đó, lặp qua mảng và sử dụng phương thức `getName()` và `getValue()` để truy cập vào mỗi cookie và giá trị liên quan.

ReadCookies.java

```java
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/servlet/ReadCookies")
public class ReadCookies extends HttpServlet {
    private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public ReadCookies() {
        super();
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response)
                    throws ServletException, IOException {
        Cookie cookie = null;
        Cookie[] cookies = null;
        // Lấy mảng Cookie liên quan đến miền này
        cookies = request.getCookies();

        // Đặt kiểu nội dung phản hồi
        response.setContentType("text/html;charset=UTF-8");

        PrintWriter out = response.getWriter();
        String title = "Ví dụ về Xóa Cookie";
        String docType = "<!DOCTYPE html>\n";
        out.println(docType + "<html>\n" + "<head><title>" + title + "</title></head>\n"
                        + "<body bgcolor=\"#f0f0f0\">\n");
        if (cookies != null) {
            out.println("<h2>Tên và giá trị của Cookie</h2>");
            for (int i = 0; i < cookies.length; i++) {
                cookie = cookies[i];
                if ((cookie.getName()).compareTo("name") == 0) {
                    cookie.setMaxAge(0);
                    response.addCookie(cookie);
                    out.print("Cookie đã bị xóa: " + cookie.getName() + "<br/>");
                }
                out.print("Tên: " + cookie.getName() + "，");
                out.print("Giá trị: " + URLDecoder.decode(cookie.getValue(), "utf-8") + " <br/>");
            }
        } else {
            out.println("<h2 class=\"tutheader\">Không tìm thấy Cookie</h2>");
        }
        out.println("</body>");
        out.println("</html>");
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
                    throws ServletException, IOException {
        doGet(request, response);
    }

}
```

#### Xóa Cookie

Trong Java, không có phương thức trực tiếp để xóa Cookie. Để xóa một Cookie, bạn chỉ cần đặt thời gian sống của Cookie đó thành 0. Các bước thực hiện như sau:

1. Đọc một Cookie hiện có và lưu trữ nó trong đối tượng Cookie.
2. Sử dụng phương thức `setMaxAge()` để đặt tuổi của Cookie thành 0 để xóa Cookie hiện có.
3. Thêm Cookie này vào tiêu đề phản hồi.

DeleteCookies.java

```java
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/servlet/DeleteCookies")
public class DeleteCookies extends HttpServlet {
    private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public DeleteCookies() {
        super();
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response)
                    throws ServletException, IOException {
        Cookie cookie = null;
        Cookie[] cookies = null;
        // Lấy mảng Cookie liên quan đến miền này
        cookies = request.getCookies();

        // Đặt kiểu nội dung phản hồi
        response.setContentType("text/html;charset=UTF-8");

        PrintWriter out = response.getWriter();
        String title = "Ví dụ xóa Cookie";
        String docType = "<!DOCTYPE html>\n";
        out.println(docType + "<html>\n" + "<head><title>" + title + "</title></head>\n"
                        + "<body bgcolor=\"#f0f0f0\">\n");
        if (cookies != null) {
            out.println("<h2>Tên và giá trị của Cookie</h2>");
            for (int i = 0; i < cookies.length; i++) {
                cookie = cookies[i];
                if ((cookie.getName()).compareTo("url") == 0) {
                    cookie.setMaxAge(0);
                    response.addCookie(cookie);
                    out.print("Cookie đã xóa: " + cookie.getName() + "<br/>");
                }
                out.print("Tên: " + cookie.getName() + "，");
                out.print("Giá trị: " + cookie.getValue() + " <br/>");
            }
        } else {
            out.println("<h2 class=\"tutheader\">Không tìm thấy Cookie</h2>");
        }
        out.println("</body>");
        out.println("</html>");
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
                    throws ServletException, IOException {
        doGet(request, response);
    }

}
```

## Session

### Session là gì

Khác với Cookie được lưu trữ trên trình duyệt của khách hàng, Session được lưu trữ trên máy chủ.

Nếu Cookie được sử dụng để xác định danh tính của khách hàng bằng cách kiểm tra "thẻ thông hành" trên người khách, thì Session sử dụng "bảng chi tiết khách hàng" trên máy chủ để xác nhận danh tính của khách hàng.

Lớp tương ứng với Session là `javax.servlet.http.HttpSession`. Đối tượng Session được tạo ra khi khách hàng gửi yêu cầu đầu tiên đến máy chủ.

### Các phương thức trong lớp Session

Các phương thức trong lớp `javax.servlet.http.HttpSession`:

| **Phương thức**                                      | **Chức năng**                                                                                                            |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| public Object getAttribute(String name)               | Phương thức này trả về đối tượng có tên đã chỉ định trong session, nếu không có đối tượng nào có tên đã chỉ định, thì trả về null. |
| public Enumeration getAttributeNames()                | Phương thức này trả về một Enumeration chứa tên của tất cả các đối tượng được liên kết với session.                        |
| public long getCreationTime()                         | Phương thức này trả về thời gian tạo session, tính từ thời điểm 0h ngày 1 tháng 1 năm 1970 theo giờ chuẩn Greenwich, tính bằng mili giây. |
| public String getId()                                 | Phương thức này trả về một chuỗi chứa định danh duy nhất được gán cho session.                                             |
| public long getLastAccessedTime()                     | Phương thức này trả về thời gian cuối cùng khách hàng gửi yêu cầu liên quan đến session, tính từ thời điểm 0h ngày 1 tháng 1 năm 1970 theo giờ chuẩn Greenwich, tính bằng mili giây. |
| public int getMaxInactiveInterval()                   | Phương thức này trả về thời gian tối đa mà session được giữ mở khi khách hàng truy cập, tính bằng giây.                        |
| public void invalidate()                              | Phương thức này cho biết session không còn hiệu lực và hủy bỏ bất kỳ đối tượng nào được gắn với nó.                          |
| public boolean isNew()                                | Nếu khách hàng chưa biết về session hoặc nếu khách hàng không tham gia session, phương thức này trả về true.                |
| public void removeAttribute(String name)              | Phương thức này loại bỏ đối tượng có tên đã chỉ định khỏi session.                                                        |
| public void setAttribute(String name, Object value)   | Phương thức này gắn một đối tượng với session bằng cách sử dụng tên đã chỉ định.                                            |
| public void setMaxInactiveInterval(int interval)      | Phương thức này chỉ định thời gian giữa các yêu cầu của khách hàng trước khi session trở thành không hợp lệ, tính bằng giây.   |

### Thời gian hiệu lực của Session

Vì có ngày càng nhiều người dùng truy cập vào máy chủ, do đó số lượng Session cũng ngày càng nhiều. Để tránh tràn bộ nhớ, máy chủ sẽ xóa bỏ các Session không hoạt động trong thời gian dài.

Thời gian chờ của Session được xác định bởi thuộc tính `maxInactiveInterval` và có thể được đọc và ghi bằng cách sử dụng các phương thức `getMaxInactiveInterval()` và `setMaxInactiveInterval(long interval)`.

Thời gian chờ mặc định của Session trong Tomcat là 20 phút. Bạn có thể thay đổi thời gian chờ mặc định của Session bằng cách chỉnh sửa file web.xml.

Ví dụ:

```xml
<session-config>
  <session-timeout>60</session-timeout>
</session-config>
```

### Yêu cầu của Session đối với trình duyệt

Giao thức HTTP là không trạng thái, Session không thể xác định xem có phải là cùng một khách hàng hay không dựa trên kết nối HTTP. Do đó, máy chủ gửi một Cookie có tên là JESSIONID đến trình duyệt khách hàng, giá trị của nó là id của Session (cũng chính là giá trị trả về của HttpSession.getId()). Session sử dụng Cookie này để xác định xem có phải là cùng một người dùng hay không.

Cookie này được máy chủ tạo ra tự động và thuộc tính `maxAge` của nó thường là -1, chỉ có hiệu lực trong cùng một trình duyệt và không chia sẻ giữa các cửa sổ trình duyệt, nó sẽ hết hiệu lực khi trình duyệt được đóng.

### Ghi đè địa chỉ URL

Nguyên tắc của việc ghi đè địa chỉ URL là ghi đè thông tin id của Session của người dùng vào URL. Máy chủ có thể giải mã URL đã ghi đè để nhận diện id của Session. Điều này cho phép sử dụng Session để theo dõi trạng thái người dùng ngay cả khi trình duyệt không hỗ trợ Cookie.

Lớp `HttpServletResponse` cung cấp phương thức `encodeURL(String url)` để thực hiện việc ghi đè địa chỉ URL.

### Vô hiệu hóa Cookie trong Session

Chỉnh sửa `META-INF/context.xml` như sau:

```xml
<Context path="/SessionNotes" cookies="true">
</Context>
```

Sau khi triển khai, TOMCAT sẽ không tạo ra Cookie có tên JESSIONID và Session sẽ không sử dụng Cookie để xác định. Thay vào đó, Session sẽ chỉ sử dụng URL đã ghi đè để xác định.

### Ví dụ về Session

#### Theo dõi Session

SessionTrackServlet.java

```java
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/servlet/SessionTrackServlet")
public class SessionTrackServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public void doGet(HttpServletRequest request, HttpServletResponse response)
                    throws ServletException, IOException {
        // Nếu session không tồn tại, tạo một session mới
        HttpSession session = request.getSession(true);
        // Lấy thời gian tạo session
        Date createTime = new Date(session.getCreationTime());
        // Lấy thời gian truy cập cuối cùng của trang web
        Date lastAccessTime = new Date(session.getLastAccessedTime());

        // Định dạng đầu ra của ngày tháng
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        String title = "Ví dụ Servlet Session";
        Integer visitCount = new Integer(0);
        String visitCountKey = new String("visitCount");
        String userIDKey = new String("userID");
        String userID = new String("admin");

        // Kiểm tra xem có khách truy cập mới không
        if (session.isNew()) {
            session.setAttribute(userIDKey, userID);
        } else {
            visitCount = (Integer) session.getAttribute(visitCountKey);
            visitCount = visitCount + 1;
            userID = (String) session.getAttribute(userIDKey);
        }
        session.setAttribute(visitCountKey, visitCount);

        // Đặt kiểu nội dung phản hồi
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        String docType = "<!DOCTYPE html>\n";
        out.println(docType + "<html>\n" + "<head><title>" + title + "</title></head>\n"
                        + "<body bgcolor=\"#f0f0f0\">\n" + "<h1 align=\"center\">" + title
                        + "</h1>\n" + "<h2 align=\"center\">Thông tin Session</h2>\n"
                        + "<table border=\"1\" align=\"center\">\n" + "<tr bgcolor=\"#949494\">\n"
                        + "  <th>Thông tin Session</th><th>Giá trị</th></tr>\n" + "<tr>\n" + "  <td>id</td>\n"
                        + "  <td>" + session.getId() + "</td></tr>\n" + "<tr>\n"
                        + "  <td>Thời gian tạo</td>\n" + "  <td>" + df.format(createTime) + "  </td></tr>\n"
                        + "<tr>\n" + "  <td>Thời gian truy cập cuối cùng</td>\n" + "  <td>" + df.format(lastAccessTime)
                        + "  </td></tr>\n" + "<tr>\n" + "  <td>ID người dùng</td>\n" + "  <td>" + userID
                        + "  </td></tr>\n" + "<tr>\n" + "  <td>Thống kê truy cập:</td>\n" + "  <td>" + visitCount
                        + "</td></tr>\n" + "</table>\n" + "</body></html>");
    }
}
```

web.xml

```xml
<servlet>
  <servlet-name>SessionTrackServlet</servlet-name>
  <servlet-class>SessionTrackServlet</servlet-class>
</servlet>
<servlet-mapping>
  <servlet-name>SessionTrackServlet</servlet-name>
  <url-pattern>/servlet/SessionTrackServlet</url-pattern>
</servlet-mapping>
```

#### Xóa dữ liệu Session

Khi bạn hoàn thành dữ liệu session của một người dùng, bạn có một số lựa chọn sau:

**Xóa một thuộc tính cụ thể:** Bạn có thể gọi phương thức `removeAttribute(String name)` để xóa giá trị liên kết với một khóa cụ thể.

**Xóa toàn bộ session:** Bạn có thể gọi phương thức `invalidate()` để hủy bỏ toàn bộ session.

**Đặt thời gian chờ của session:** Bạn có thể gọi phương thức `setMaxInactiveInterval(int interval)` để đặt thời gian chờ của session riêng lẻ.

**Đăng xuất người dùng:** Nếu bạn sử dụng máy chủ hỗ trợ servlet 2.4, bạn có thể gọi `logout` để đăng xuất khách hàng của máy chủ web và đánh dấu tất cả các session của tất cả người dùng là không hợp lệ.

**Cấu hình trong web.xml:** Ngoài các phương pháp trên, bạn cũng có thể cấu hình thời gian chờ của session trong file web.xml như sau:

```xml
<session-config>
  <session-timeout>15</session-timeout>
</session-config>
```

Trong ví dụ trên, thời gian chờ mặc định là 15 phút, đơn vị là phút. Điều này sẽ ghi đè thời gian chờ mặc định của session trong Tomcat là 30 phút.

Trong một Servlet, phương thức `getMaxInactiveInterval()` sẽ trả về thời gian chờ của session, đơn vị là giây. Vì vậy, nếu bạn cấu hình thời gian chờ session là 15 phút trong web.xml, thì `getMaxInactiveInterval()` sẽ trả về 900.

## Cookie vs Session

### Cách truy cập

Cookie chỉ có thể lưu trữ chuỗi ASCII, nếu cần lưu trữ ký tự Unicode hoặc dữ liệu nhị phân, cần mã hóa bằng cách sử dụng UTF-8, GBK hoặc BASE64.

Session có thể lưu trữ bất kỳ loại dữ liệu nào, thậm chí là bất kỳ lớp Java nào. Session có thể được coi là một lớp bao gồm các đối tượng Java.

### Bảo mật và riêng tư

Cookie được lưu trữ trên trình duyệt của khách hàng, một số chương trình khách hàng có thể xem, sao chép hoặc sửa đổi nội dung của Cookie.

Session được lưu trữ trên máy chủ, đối với khách hàng là không rõ ràng, không có nguy cơ rò rỉ thông tin nhạy cảm.

### Thời gian hiệu lực

Sử dụng Cookie có thể đảm bảo đăng nhập trong thời gian dài, chỉ cần đặt thuộc tính `maxAge` của Cookie thành một số lớn.

Trong lý thuyết, Session cũng có thể duy trì đăng nhập trong thời gian dài bằng cách đặt một giá trị lớn, nhưng do Session phụ thuộc vào Cookie có tên `JESSIONID`, mà thuộc tính `maxAge` của Cookie `JESSIONID` mặc định là -1, chỉ cần đóng trình duyệt là Session sẽ hết hiệu lực. Do đó, Session không thể đảm bảo thông tin luôn hiệu lực mãi mãi. Sử dụng ghi đè địa chỉ URL cũng không thể đảm bảo.

### Tài nguyên máy chủ

Vì Session được lưu trữ trên máy chủ, mỗi người dùng sẽ tạo ra một Session. Nếu có nhiều người dùng truy cập đồng thời, sẽ tạo ra nhiều Session, tiêu tốn nhiều bộ nhớ.

Cookie được lưu trữ trên trình duyệt của khách hàng, do đó không tốn tài nguyên máy chủ.

### Hỗ trợ trình duyệt

Cookie cần được hỗ trợ bởi trình duyệt để sử dụng.

Nếu trình duyệt không hỗ trợ Cookie, cần sử dụng Session và ghi đè địa chỉ URL.

Cần lưu ý rằng tất cả các URL sử dụng chương trình Session phải được ghi đè bằng `response.encodeURL(StringURL)` hoặc `response.encodeRedirectURL(String URL)`, nếu không, việc theo dõi Session sẽ không hoạt động.

### Chuyển qua tên miền khác

- Cookie hỗ trợ chuyển qua tên miền khác.
- Session không hỗ trợ chuyển qua tên miền khác.
