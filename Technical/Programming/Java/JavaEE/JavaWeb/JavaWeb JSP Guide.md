---
title: JavaWeb JSP Guide
tags: [java, javaee, javaweb, jsp]
categories: [java, javaee, javaweb, jsp]
date created: 2023-07-19
date modified: 2023-07-19
---

# Hướng dẫn JSP trong JavaWeb

## Giới thiệu

### JSP là gì

JSP (Java Server Pages) là một công nghệ phát triển trang web động.

Nó sử dụng các thẻ JSP để chèn mã Java vào trong trang web HTML. Các thẻ thường bắt đầu bằng `<%` và kết thúc bằng `%>`.

JSP là một servlet trong Java, được sử dụng chủ yếu để triển khai phần giao diện người dùng của ứng dụng web Java. Nhà phát triển web sử dụng JSP để kết hợp mã HTML, XHTML, các phần tử XML và các lệnh và thao tác JSP nhúng để viết JSP.

JSP có thể sử dụng các thẻ để thực hiện nhiều chức năng, bao gồm truy cập cơ sở dữ liệu, ghi lại thông tin lựa chọn của người dùng, truy cập các thành phần JavaBeans và nhiều hơn nữa. Nó cũng có thể truyền thông tin điều khiển và chia sẻ thông tin giữa các trang web khác nhau.

### Tại sao sử dụng JSP

JSP cũng là một servlet, do đó JSP có thể thực hiện bất kỳ công việc nào mà servlet có thể thực hiện.

JSP có một số lợi ích so với các chương trình CGI tương tự. Đầu tiên, JSP có hiệu suất tốt hơn vì nó có thể nhúng trực tiếp các phần tử động vào trang web HTML mà không cần tham chiếu đến tệp CGI riêng lẻ. Thứ hai, servlet được biên dịch trước và triển khai trên máy chủ, trong khi CGI/Perl phải tải trình thông dịch và tệp mục tiêu trước khi thực thi.

JSP dựa trên API Java Servlets, do đó, JSP có quyền truy cập vào các API mạnh mẽ của Java Enterprise Edition (Java EE), bao gồm JDBC, JNDI, EJB, JAXP và nhiều hơn nữa.

Cuối cùng, JSP là một phần không thể thiếu của Java EE, là một nền tảng ứng dụng doanh nghiệp đầy đủ. Điều này có nghĩa là JSP có thể triển khai các ứng dụng phức tạp nhất bằng cách sử dụng cách đơn giản nhất.

### Ưu điểm của JSP

Dưới đây là một số lợi ích khác của việc sử dụng JSP:

- So với ASP: JSP có hai lợi thế. Đầu tiên, phần động được viết bằng Java, không phải là VB hoặc ngôn ngữ đặc biệt của MS, do đó mạnh mẽ và dễ sử dụng hơn. Thứ hai, JSP dễ dàng di chuyển sang các nền tảng không phải của MS.
- So với Servlet thuần: JSP có thể dễ dàng viết hoặc chỉnh sửa mã HTML mà không cần xử lý nhiều lệnh println.
- So với SSI: SSI không thể sử dụng dữ liệu biểu mẫu, không thể kết nối cơ sở dữ liệu.
- So với JavaScript: Mặc dù JavaScript có thể tạo HTML động trên máy khách, nhưng khó để tương tác với máy chủ, do đó không thể cung cấp các dịch vụ phức tạp như truy cập cơ sở dữ liệu và xử lý hình ảnh.
- So với HTML tĩnh: HTML tĩnh không chứa thông tin động.

## Nguyên lý hoạt động của JSP

**JSP là một servlet**, nhưng hoạt động khác với servlet.

Servlet được biên dịch thành tệp .class trước khi triển khai trên máy chủ, **biên dịch trước và triển khai sau**.

JSP được triển khai trên máy chủ trước khi được biên dịch, **triển khai trước và biên dịch sau**.

Khi trình duyệt khách hàng yêu cầu một trang JSP, trang JSP được biên dịch thành lớp HttpJspPage (lớp con của servlet). Lớp này được lưu trữ tạm thời trên máy chủ trong thư mục làm việc của máy chủ. Do đó, sau khi yêu cầu JSP lần đầu tiên, tốc độ truy cập sẽ nhanh hơn.

### Luồng làm việc của JSP

Máy chủ web cần một công cụ JSP để xử lý trang JSP. Công cụ này được gọi là máy chủ JSP và nó đảm nhiệm việc xử lý yêu cầu JSP. Hướng dẫn này sử dụng Apache với máy chủ JSP nhúng để hỗ trợ phát triển JSP.

Máy chủ JSP hoạt động cùng với máy chủ web để cung cấp môi trường chạy cần thiết và các dịch vụ khác, và có thể nhận diện các phần tử đặc biệt của trang web JSP.

Hình sau hiển thị vị trí của máy chủ JSP và tệp JSP trong ứng dụng web.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/jsp-arch.jpg)

#### Các bước làm việc

Các bước sau đây mô tả cách máy chủ web sử dụng JSP để tạo trang web:

- Giống như bất kỳ trang web thông thường nào, trình duyệt của bạn gửi một yêu cầu HTTP đến máy chủ.
- Máy chủ web nhận ra đây là một yêu cầu cho trang JSP và chuyển yêu cầu đó cho máy chủ JSP. Điều này có thể được thực hiện bằng cách sử dụng URL hoặc tệp .jsp.
- Máy chủ JSP tải tệp JSP từ đĩa và biên dịch chúng thành servlet. Quá trình biên dịch chỉ đơn giản là thay thế tất cả các văn bản mẫu bằng các lệnh println () và chuyển đổi tất cả các yếu tố JSP thành mã Java.
- Máy chủ JSP biên dịch servlet thành lớp thực thi và chuyển yêu cầu gốc cho máy chủ servlet.
- Một thành phần của máy chủ web sẽ gọi máy chủ servlet và sau đó tải và thực thi lớp servlet tương ứng. Trong quá trình thực thi, servlet tạo ra đầu ra được định dạng dưới dạng HTML và nội dung này được nhúng trong phản hồi HTTP và gửi trả lại máy chủ web.
- Máy chủ web trả lại phản hồi HTTP dưới dạng trang web HTML tĩnh.
- Cuối cùng, trình duyệt web xử lý phản hồi HTTP chứa trang web động được tạo ra, giống như xử lý trang web tĩnh.

Các bước trên được biểu thị trong hình sau:

Nói chung, máy chủ JSP sẽ kiểm tra xem tệp JSP tương ứng đã được biên dịch thành servlet chưa và kiểm tra xem tệp JSP có được chỉnh sửa sau khi biên dịch không. Nếu tệp JSP đã được chỉnh sửa sau khi biên dịch hoặc chưa được biên dịch, máy chủ JSP sẽ biên dịch tệp JSP.

## Cú pháp

### Kịch bản

Chương trình kịch bản có thể chứa bất kỳ số lượng câu lệnh Java, biến, phương thức hoặc biểu thức nào, miễn là chúng hợp lệ trong ngôn ngữ kịch bản.

Cú pháp của chương trình kịch bản:

```
<% đoạn mã %>
```

Hoặc, bạn cũng có thể viết câu lệnh XML tương đương như sau:

```
<jsp:scriptlet>
  đoạn mã
</jsp:scriptlet>
```

Bất kỳ văn bản, thẻ HTML hoặc phần tử JSP nào phải được viết bên ngoài chương trình kịch bản.

Dưới đây là một ví dụ, cũng là ví dụ JSP đầu tiên trong hướng dẫn này:

```
<html>
  <head>
    <title>Xin chào</title>
  </head>
  <body>
    Xin chào!<br />
    <% out.println("Địa chỉ IP của bạn là " + request.getRemoteAddr()); %>
  </body>
</html>
```

**Lưu ý:** Hãy đảm bảo rằng Apache Tomcat đã được cài đặt trong thư mục `C:\apache-tomcat-7.0.2` và môi trường chạy đã được cấu hình đúng.

Lưu đoạn mã trên vào tệp hello.jsp, sau đó đặt nó trong thư mục `C:\apache-tomcat-7.0.2\webapps\ROOT`. Mở trình duyệt và nhập `http://localhost:8080/hello.jsp` vào thanh địa chỉ. Kết quả sẽ là:

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/jsp_hello_world.jpg)

#### Vấn đề mã hóa tiếng Việt

Nếu chúng ta muốn hiển thị tiếng Việt đúng, chúng ta cần thêm đoạn mã sau vào đầu tệp JSP: `<>`

```
<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
```

Tiếp theo, chúng ta sẽ sửa đoạn mã trên thành:

```
<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hướng dẫn người mới</title>
  </head>
  <body>
    Xin chào!<br />
    <% out.println("Địa chỉ IP của bạn là " + request.getRemoteAddr()); %>
  </body>
</html>
```

Như vậy, tiếng Việt sẽ được hiển thị đúng.

### Khai báo JSP

Một câu lệnh khai báo có thể khai báo một hoặc nhiều biến, phương thức, để sử dụng trong mã Java sau đó. Trong tệp JSP, bạn phải khai báo các biến và phương thức này trước khi sử dụng chúng.

Cú pháp của câu lệnh khai báo JSP:

```
<%! khai báo; [ khai báo; ]+ ... %>
```

Hoặc, bạn cũng có thể viết câu lệnh XML tương đương như sau:

```
<jsp:declaration>
  đoạn mã
</jsp:declaration>
```

Ví dụ chương trình:

```
<%! int i = 0; %> <%! int a, b, c; %> <%! Circle a = new Circle(2.0); %>
```

### Biểu thức JSP

Một biểu thức JSP chứa một biểu thức kịch bản ngôn ngữ được chuyển đổi thành chuỗi, sau đó được chèn vào vị trí xuất hiện của biểu thức.

Vì giá trị của biểu thức được chuyển đổi thành chuỗi, nên bạn có thể sử dụng biểu thức trong một dòng văn bản mà không cần quan tâm đến nó có phải là một thẻ HTML hay không.

Cú pháp của phần tử biểu thức JSP:

```jsp
<%= biểu thức %>
```

Tương tự, bạn cũng có thể viết câu lệnh XML tương đương như sau:

```jsp
<jsp:expression>
  biểu thức
</jsp:expression>
```

Ví dụ chương trình:

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hướng dẫn người mới</title>
  </head>
  <body>
    <p>
      Hôm nay là: <%= (new java.util.Date()).toLocaleString()%>
    </p>
  </body>
</html>
```

Kết quả sau khi chạy:

```
Hôm nay là: 2016-6-25 13:40:07
```

---

### Chú thích JSP

Chú thích JSP có hai mục đích chính: chú thích mã code và chú thích một đoạn mã code.

Cú pháp của chú thích JSP:

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Ví dụ chú thích JSP</title>
  </head>
  <body>
    <%-- Phần này là chú thích và sẽ không được hiển thị trên trang web --%>
    <p>
      Hôm nay là: <%= (new java.util.Date()).toLocaleString()%>
    </p>
  </body>
</html>
```

Kết quả sau khi chạy:

```
Hôm nay là: 2016-6-25 13:41:26
```

Cú pháp chú thích được sử dụng trong các trường hợp khác nhau:

| **Cú pháp**       | Mô tả                                                      |
| ----------------- | --------------------------------------------------------- |
| `<%-- Chú thích --%>` | Chú thích JSP, nội dung chú thích không được gửi đến trình duyệt hoặc được biên dịch |
| `<!-- Chú thích -->`  | Chú thích HTML, có thể nhìn thấy nội dung chú thích khi xem mã nguồn trang web bằng trình duyệt |
| `<%` | Đại diện cho hằng số `<%` trong kịch bản                      |
| `%>`              | Đại diện cho hằng số `%>` trong kịch bản                      |
| `'`              | Dấu nháy đơn được sử dụng trong thuộc tính                  |
| `"`              | Dấu nháy kép được sử dụng trong thuộc tính                  |

### Câu lệnh điều khiển

JSP cung cấp hỗ trợ đầy đủ cho ngôn ngữ Java. Bạn có thể sử dụng API Java trong chương trình JSP và thậm chí xây dựng các khối mã Java, bao gồm các câu lệnh điều kiện và vòng lặp.

#### Câu lệnh if…else

Một khối if…else, hãy xem ví dụ sau:

```jsp
<%! int day = 3; %> 
<html> 
   <head><title>IF...ELSE Example</title></head> 
   
   <body>
      <% if (day == 1 || day == 7) { %>
         <p> Today is weekend</p>
      <% } else { %>
         <p> Today is not weekend</p>
      <% } %>
   </body> 
</html>
```

Kết quả sau khi chạy:

```
Today is not weekend
```

#### Câu lệnh switch…case

Bây giờ hãy xem khối switch…case, nó khác biệt rất nhiều so với khối if…else. Nó sử dụng out.println() và được đặt trong thẻ chương trình kịch bản, như sau:

```jsp
<%! int day = 3; %> 
<html> 
   <head><title>SWITCH...CASE Example</title></head> 
   
   <body>
      <% 
         switch(day) {
            case 0:
               out.println("It\'s Sunday.");
               break;
            case 1:
               out.println("It\'s Monday.");
               break;
            case 2:
               out.println("It\'s Tuesday.");
               break;
            case 3:
               out.println("It\'s Wednesday.");
               break;
            case 4:
               out.println("It\'s Thursday.");
               break;
            case 5:
               out.println("It\'s Friday.");
               break;
            default:
               out.println("It's Saturday.");
         }
      %>
   </body> 
</html>
```

Kết quả sau khi chạy:

```jsp
It's Wednesday.
```

#### Câu lệnh vòng lặp

Trong chương trình JSP, bạn có thể sử dụng ba loại vòng lặp cơ bản của Java: for, while và do…while.

Hãy xem ví dụ vòng lặp for sau đây, nó sẽ in ra từ "JSP Tutorial" với các kích thước chữ khác nhau:

```jsp
<%! int fontSize; %> 
<html> 
   <head><title>FOR LOOP Example</title></head> 
   
   <body>
      <%for ( fontSize = 1; fontSize <= 3; fontSize++){ %>
         <font color = "green" size = "<%= fontSize %>">
            JSP Tutorial
      </font><br />
      <%}%>
   </body> 
</html>

```

Chuyển ví dụ trên sang vòng lặp while:

```jsp
<%! int fontSize; %> 
<html> 
   <head><title>WHILE LOOP Example</title></head> 
   
   <body>
      <%while ( fontSize <= 3){ %>
         <font color = "green" size = "<%= fontSize %>">
            JSP Tutorial
         </font><br />
         <%fontSize++;%>
      <%}%>
   </body> 
</html>
```

### Toán tử JSP

JSP hỗ trợ tất cả các toán tử logic và toán tử số học của Java.

Bảng dưới đây liệt kê các toán tử thông dụng trong JSP, được sắp xếp theo thứ tự ưu tiên từ cao đến thấp:

|**Loại**|**Toán tử**|**Liên kết**|  
| --------- | -------------------------------- | ---------- | ------ | ------ |  
|Hậu tố|`() [] .` (toán tử chấm)|Trái sang phải|||  
|Tiền tố|`++ - - ! ~`|Phải sang trái|  
|Nhân chia có thể|`* / %`|Trái sang phải|  
|Cộng trừ có thể|`+ -`|Trái sang phải|  
|Dịch chuyển|`>> >>> <<`|Trái sang phải|  
|So sánh|`> >= < <=`|Trái sang phải|  
|Bằng/khác|`== !=`|Trái sang phải|  
|Và|`&`|Trái sang phải|  
|Hoặc|`^`|Trái sang phải|  
|XOR|`|`|Trái sang phải|  
|Và|`&&`|Trái sang phải|  
|Hoặc|`||`|Trái sang phải|  
|Điều kiện|`?:`|Phải sang trái|  
|Gán| `= += -= \*= /= %= >>= <<= &= ^= | =` |Phải sang trái|  
|Dấu phẩy|`,`|Trái sang phải|

### JSP Literals

JSP định nghĩa một số literal sau đây:

- Giá trị boolean: true và false;
- Giá trị số nguyên: giống như trong Java;
- Giá trị số thực: giống như trong Java;
- Chuỗi: bắt đầu và kết thúc bằng dấu nháy đơn hoặc dấu nháy kép;
- Null: null.

## Chỉ thị

Chỉ thị JSP được sử dụng để thiết lập các thuộc tính liên quan đến toàn bộ trang JSP, chẳng hạn như mã hóa trang web và ngôn ngữ kịch bản.

Chỉ thị JSP bắt đầu bằng `<%@` và kết thúc bằng `%>`.

Cú pháp của chỉ thị JSP như sau:

```jsp
<%@ directive attribute="value" %>
```

Bạn có thể có nhiều thuộc tính trong chỉ thị, chúng được đặt dưới dạng cặp key-value và được phân tách bằng dấu phẩy.

Trong JSP, có ba loại chỉ thị:

| **Chỉ thị**             | **Mô tả**                                                 |
| ----------------------- | -------------------------------------------------------- |
| `<%@ page … %>`       | Định nghĩa các thuộc tính phụ thuộc của trang, chẳng hạn như ngôn ngữ kịch bản, trang lỗi, yêu cầu bộ nhớ cache, v.v. |
| `<%@ include … %>`    | Bao gồm các tệp khác vào trang JSP hiện tại.               |
| `<%@ taglib … %>`     | Nhập các định nghĩa thẻ tùy chỉnh, có thể là các thẻ tùy chỉnh do người dùng định nghĩa. |

### Chỉ thị Page

Chỉ thị Page cung cấp các hướng dẫn sử dụng cho trang hiện tại. Một trang JSP có thể chứa nhiều chỉ thị `page`.

Cú pháp của chỉ thị Page:

```jsp
<%@ page attribute="value" %>
```

Tương đương với định dạng XML:

```jsp
<jsp:directive.page attribute="value" />
```

Ví dụ:

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8" %>
```

#### Thuộc tính

Bảng dưới đây liệt kê các thuộc tính liên quan đến chỉ thị Page:

| **Thuộc tính**           | **Mô tả**                                              |
| ------------------------ | ----------------------------------------------------- |
| buffer                   | Xác định kích thước bộ đệm sử dụng cho đối tượng `out` |
| autoFlush                | Kiểm soát bộ đệm của đối tượng `out`                   |
| contentType              | Xác định kiểu MIME và mã hóa ký tự của trang JSP       |
| errorPage                | Xác định trang xử lý lỗi khi trang JSP gặp lỗi        |
| isErrorPage              | Xác định xem trang hiện tại có phải là trang xử lý lỗi của trang JSP khác hay không |
| extends                  | Xác định lớp mà servlet kế thừa                       |
| import                   | Nhập các lớp Java để sử dụng trong trang JSP            |
| info                     | Xác định thông tin mô tả của trang JSP                 |
| isThreadSafe             | Xác định xem trang JSP có an toàn đối với luồng hay không |
| language                 | Xác định ngôn ngữ kịch bản của trang JSP, mặc định là Java |
| session                  | Xác định xem trang JSP có sử dụng session hay không    |
| isELIgnored              | Xác định xem biểu thức EL có được thực thi hay không   |
| isScriptingEnabled       | Xác định xem các phần tử kịch bản có thể sử dụng hay không |

### Chỉ thị Include

JSP có thể bao gồm các tệp khác bằng chỉ thị `include`.

Các tệp được bao gồm có thể là tệp JSP, tệp HTML hoặc tệp văn bản. Các tệp bao gồm sẽ được biên dịch và thực thi như là một phần của trang JSP.

Cú pháp của chỉ thị Include như sau:

```
<%@ include file="đường dẫn tương đối của tệp" %>
```

Tên tệp trong chỉ thị include thực tế là một đường dẫn URL tương đối.

Nếu bạn không đặt một đường dẫn cho tệp, trình biên dịch JSP sẽ tìm trong thư mục hiện tại mặc định.

Định dạng XML tương đương:

```
<jsp:directive.include file="đường dẫn tương đối của tệp" />
```

### Chỉ thị Taglib

JSP cho phép người dùng định nghĩa các thẻ tùy chỉnh, và một thư viện thẻ tùy chỉnh là một bộ sưu tập các thẻ tùy chỉnh.

Chỉ thị `taglib` được sử dụng để nhập các định nghĩa của thư viện thẻ tùy chỉnh, bao gồm đường dẫn thư viện, tiền tố và các thẻ tùy chỉnh.

Cú pháp của chỉ thị Taglib:

```
<%@ taglib uri="uri" prefix="prefixOfTag" %>
```

Thuộc tính `uri` xác định vị trí của thư viện thẻ, thuộc tính `prefix` xác định tiền tố của thư viện thẻ.

Định dạng XML tương đương:

```
<jsp:directive.taglib uri="uri" prefix="prefixOfTag" />
```

## Các phần tử hành động trong JSP

Các phần tử hành động trong JSP là một nhóm các thẻ tích hợp sẵn trong JSP, chỉ cần viết ít mã đánh dấu là có thể sử dụng các tính năng phong phú được cung cấp bởi JSP. Các phần tử hành động trong JSP là sự trừu tượng và đóng gói các chức năng JSP thông dụng, bao gồm hai loại, phần tử hành động JSP tùy chỉnh và phần tử hành động JSP chuẩn.

Khác với phần tử chỉ thị JSP, phần tử hành động JSP hoạt động trong giai đoạn xử lý yêu cầu. Phần tử hành động JSP được viết dưới cú pháp XML.

Các phần tử hành động JSP có cú pháp duy nhất, tuân thủ tiêu chuẩn XML:

```jsp
<jsp:action_name attribute="value" />
```

Các phần tử hành động cơ bản thường là các hàm được xác định trước, quy định JSP đã định nghĩa một loạt các phần tử hành động chuẩn, chúng có tiền tố JSP, các phần tử hành động chuẩn có thể sử dụng như sau:

| Cú pháp        | Mô tả                                                  |
| -------------- | ----------------------------------------------------- |
| jsp:include    | Chèn một tệp vào trang được yêu cầu.                      |
| jsp:useBean    | Tìm hoặc tạo một JavaBean.                              |
| jsp:setProperty| Thiết lập thuộc tính của JavaBean.                      |
| jsp:getProperty| In ra thuộc tính của một JavaBean.                      |
| jsp:forward    | Chuyển hướng yêu cầu đến một trang mới.                  |
| jsp:plugin     | Tạo ra thẻ OBJECT hoặc EMBED cho Java Plugin dựa trên loại trình duyệt. |
| jsp:element    | Xác định một phần tử XML động.                          |
| jsp:attribute  | Thiết lập thuộc tính của phần tử XML động.              |
| jsp:body       | Thiết lập nội dung của phần tử XML động.                |
| jsp:text       | Sử dụng mẫu để ghi văn bản vào trang JSP và tài liệu.   |

### Các thuộc tính phổ biến

Tất cả các phần tử hành động đều có hai thuộc tính: thuộc tính id và thuộc tính phạm vi (scope).

- Thuộc tính id: thuộc tính id là định danh duy nhất của phần tử hành động, có thể được tham chiếu trong trang JSP. Giá trị id được tạo bởi phần tử hành động có thể được gọi thông qua PageContext.
- Thuộc tính phạm vi: thuộc tính này xác định vòng đời của phần tử hành động. Thuộc tính id và thuộc tính phạm vi có mối quan hệ trực tiếp, thuộc tính phạm vi xác định tuổi thọ của đối tượng liên quan id. Thuộc tính phạm vi có bốn giá trị có thể: (a) page, (b) request, (c) session và (d) application.

### `<jsp:include>`

`<jsp:include>` được sử dụng để bao gồm các tệp tĩnh và động. Hành động này chèn tệp được chỉ định vào trang đang được tạo.

Nếu tệp được bao gồm là một chương trình JSP, chương trình JSP sẽ được thực thi trước, sau đó kết quả thực thi sẽ được bao gồm.

Cú pháp như sau:

```jsp
<jsp:include page="địa chỉ URL tương đối" flush="true" />
```

Trước đó đã giới thiệu về chỉ thị include, chỉ thị include được sử dụng để bao gồm tệp trong quá trình chuyển đổi tệp JSP thành Servlet, trong khi hành động jsp:include khác, thời gian chèn tệp là khi trang được yêu cầu.

Dưới đây là danh sách các thuộc tính liên quan đến hành động include.

| Thuộc tính | Mô tả                                                                 |
| ---------- | -------------------------------------------------------------------- |
| page       | Địa chỉ URL tương đối của tệp được bao gồm.                           |
| flush      | Thuộc tính boolean, xác định xem có xóa bộ đệm trước khi bao gồm tài nguyên hay không. |

Ví dụ:

Dưới đây chúng ta định nghĩa hai tệp **date.jsp** và **main.jsp**, mã như sau:

Mã tệp date.jsp:

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
<p>
  Hôm nay là: <%= (new java.util.Date())%>
</p>
```

Mã tệp main.jsp:

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hướng dẫn lập trình</title>
  </head>
  <body>
    <h2>Ví dụ về hành động include</h2>
    <jsp:include page="date.jsp" flush="true" />
  </body>
</html>
```

Bây giờ đặt hai tệp trên trong thư mục gốc của máy chủ và truy cập vào tệp main.jsp. Kết quả hiển thị như sau:

```jsp
Ví dụ về hành động include

Hôm nay là: 2016-6-25 14:08:17
```

### `<jsp:useBean>`

**jsp:useBean** được sử dụng để tải một JavaBean sẽ được sử dụng trong trang JSP.

Chức năng này rất hữu ích vì nó cho phép chúng ta tận dụng lợi ích của việc sử dụng lại các thành phần Java.

Cú pháp đơn giản nhất của hành động useBean như sau:

```jsp
<jsp:useBean id="name" class="package.class" />
```

Sau khi lớp được tải, chúng ta có thể sử dụng các hành động jsp:setProperty và jsp:getProperty để thay đổi và truy xuất thuộc tính của bean.

Dưới đây là danh sách các thuộc tính liên quan đến hành động useBean.

| Thuộc tính | Mô tả                                                                 |
| ---------- | -------------------------------------------------------------------- |
| class      | Xác định tên gói đầy đủ của Bean.                                     |
| type       | Xác định kiểu biến mà đối tượng sẽ được tham chiếu.                   |
| beanName   | Xác định tên Bean thông qua phương thức instantiate() của java.beans.Beans. |

Trước khi cung cấp các ví dụ cụ thể, hãy xem xét các phần tử hành động jsp:setProperty và jsp:getProperty:

### `<jsp:setProperty>`

jsp:setProperty được sử dụng để thiết lập thuộc tính của một đối tượng Bean đã được khởi tạo, có hai cách sử dụng. Đầu tiên, bạn có thể sử dụng jsp:setProperty bên ngoài (sau) phần tử jsp:useBean, như sau:

```
<jsp:useBean id="myName" ... />
...
<jsp:setProperty name="myName" property="someProperty" .../>
```

Lúc này, bất kể jsp:useBean tìm thấy một Bean hiện có hay tạo một Bean mới, jsp:setProperty sẽ được thực hiện. Cách sử dụng thứ hai là đặt jsp:setProperty trong phần tử jsp:useBean, như sau:

```
<jsp:useBean id="myName" ... >
...
   <jsp:setProperty name="myName" property="someProperty" .../>
</jsp:useBean>
```

Lúc này, jsp:setProperty chỉ được thực hiện khi tạo mới một Bean, nếu sử dụng một phiên bản hiện có thì jsp:setProperty sẽ không được thực hiện.

Hành động jsp:setProperty có bốn thuộc tính sau đây:

| Thuộc tính | Mô tả                                                                                                                                                                                                                                                                                                                                                                        |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name       | Thuộc tính name là bắt buộc. Nó chỉ ra Bean nào sẽ được thiết lập thuộc tính.                                                                                                                                                                                                                                                                                                |
| property   | Thuộc tính property là bắt buộc. Nó chỉ ra thuộc tính nào sẽ được thiết lập. Có một cách sử dụng đặc biệt: nếu giá trị của property là "\*", tất cả các tham số yêu cầu khớp với tên và tên thuộc tính của Bean sẽ được chuyển đến phương thức set tương ứng của thuộc tính.                                                                                                                                                 |
| value      | Thuộc tính value là tùy chọn. Thuộc tính này được sử dụng để chỉ định giá trị của thuộc tính Bean. Dữ liệu chuỗi sẽ được tự động chuyển đổi thành số, boolean, Boolean, byte, Byte, char, Character trong lớp đích thông qua phương thức valueOf tiêu chuẩn. Ví dụ, giá trị thuộc tính boolean và Boolean (ví dụ "true") sẽ được chuyển đổi thông qua Boolean.valueOf, giá trị thuộc tính int và Integer (ví dụ "42") sẽ được chuyển đổi thông qua Integer.valueOf. 　　 value và param không thể được sử dụng cùng nhau, nhưng có thể sử dụng bất kỳ cái nào. |
| param      | Thuộc tính param là tùy chọn. Nó chỉ định tham số yêu cầu nào sẽ được sử dụng làm giá trị thuộc tính của Bean. Nếu yêu cầu hiện tại không có tham số, không có gì xảy ra, hệ thống sẽ không chuyển null cho phương thức set thuộc tính của Bean. Do đó, bạn có thể cho phép Bean cung cấp giá trị thuộc tính mặc định của nó và chỉ thay đổi giá trị thuộc tính mặc định khi yêu cầu tham số xác định một giá trị mới.                                                                                                                      |

### `<jsp:getProperty>`

Hành động jsp:getProperty trích xuất giá trị của thuộc tính Bean đã chỉ định, chuyển đổi thành chuỗi và sau đó in ra. Cú pháp như sau:

```
<jsp:useBean id="myName" ... />
...
<jsp:getProperty name="myName" property="someProperty" .../>
```

Dưới đây là danh sách các thuộc tính liên quan đến hành động getProperty:

| Thuộc tính | Mô tả                                      |
| ---------- | ----------------------------------------- |
| name       | Tên thuộc tính Bean cần truy xuất.         |
| property   | Chỉ ra thuộc tính của Bean cần truy xuất. |

Ví dụ:

Trong ví dụ sau, chúng ta sử dụng một Bean:

```java
package com.runoob.main;

public class TestBean {
   private String message = "Hướng dẫn lập trình";

   public String getMessage() {
      return(message);
   }
   public void setMessage(String message) {
      this.message = message;
   }
}
```

Biên dịch tệp ví dụ trên TestBean.java:

```
$ javac TestBean.java
```

Sau khi biên dịch hoàn tất, một tệp **TestBean.class** sẽ được tạo ra trong thư mục hiện tại, sao chép tệp này vào **WebContent/WEB-INF/classes/com/runoob/main** của dự án JSP hiện tại (đường dẫn gói com/runoob/main, nếu không có, bạn cần tạo thủ công).

Dưới đây là một ví dụ đơn giản, nó chức năng là tải một Bean, sau đó thiết lập / đọc thuộc tính message của nó.

Bây giờ hãy gọi Bean này trong tệp main.jsp:

```
<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hướng dẫn lập trình</title>
  </head>
  <body>
    <h2>Jsp sử dụng Bean Java</h2>
    <jsp:useBean id="test" class="com.runoob.main.TestBean" />

    <jsp:setProperty name="test" property="message" value="Hướng dẫn lập trình..." />

    <p>Thông báo đầu ra....</p>

    <jsp:getProperty name="test" property="message" />
  </body>
</html>
```

Truy cập trình duyệt, thực hiện tệp trên, kết quả hiển thị như sau:

```
Thông báo đầu ra....

Hướng dẫn lập trình...
```

### `<jsp:forward>`

Hành động jsp:forward chuyển hướng yêu cầu đến một trang khác. Thẻ jsp:forward chỉ có một thuộc tính là page. Cú pháp như sau:

```
<jsp:forward page="địa chỉ URL tương đối" />
```

Dưới đây là các thuộc tính liên quan đến forward:

| Thuộc tính | Mô tả                                                                                                                          |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| page       | Địa chỉ URL tương đối của trang mới.                                                                                           |

Ví dụ:

Trong ví dụ sau, chúng ta sử dụng hai tệp, lần lượt là date.jsp và main.jsp.

Mã tệp date.jsp như sau:

```
<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
<p>
  Hôm nay là: <%= (new java.util.Date()).toLocaleString()%>
</p>
```

Mã tệp main.jsp như sau:

```
<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hướng dẫn lập trình</title>
  </head>
  <body>
    <h2>Ví dụ về hành động forward</h2>
    <jsp:forward page="date.jsp" />
  </body>
</html>
```

Bây giờ đặt hai tệp trên trong thư mục gốc của máy chủ và truy cập vào tệp main.jsp. Kết quả hiển thị như sau:

```
Hôm nay là: 2016-6-25 14:37:25
```

### `<jsp:plugin>`

Hành động jsp:plugin được sử dụng để tạo ra các thẻ OBJECT hoặc EMBED dựa trên loại trình duyệt để chạy Java Applet yêu cầu Java Plugin.

Nếu plugin cần thiết không tồn tại, nó sẽ tải plugin, sau đó thực thi thành phần Java. Các thành phần Java có thể là applet hoặc JavaBean.

Hành động plugin có nhiều thuộc tính tương ứng với các phần tử HTML để định dạng thành phần Java. Phần tử param có thể được sử dụng để truyền tham số cho Applet hoặc Bean.

Dưới đây là một ví dụ về việc sử dụng phần tử plugin:

```jsp
<jsp:plugin type="applet" codebase="dirname" code="MyApplet.class"
                           width="60" height="80">
   <jsp:param name="fontcolor" value="red" />
   <jsp:param name="background" value="black" />

   <jsp:fallback>
      Unable to initialize Java Plugin
   </jsp:fallback>

</jsp:plugin>
```

Nếu bạn quan tâm, bạn có thể thử nghiệm việc sử dụng applet để kiểm tra phần tử hành động `jsp:plugin`, phần tử `<fallback>` là một phần tử mới, nó được sử dụng để gửi thông báo lỗi cho người dùng khi xảy ra lỗi với thành phần.

### `<jsp:element>` 、 `<jsp:attribute>`、`<jsp:body>`

Các phần tử hành động `<jsp:element>` 、 `<jsp:attribute>` và `<jsp:body>` được sử dụng để định nghĩa động các phần tử XML. Động là rất quan trọng, điều này có nghĩa là các phần tử XML được tạo ra tại thời gian biên dịch không phải là tĩnh.

Dưới đây là một ví dụ về việc định nghĩa động các phần tử XML:

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hướng dẫn lập trình</title>
  </head>
  <body>
    <jsp:element name="xmlElement">
      <jsp:attribute name="xmlElementAttr">
        Giá trị thuộc tính
      </jsp:attribute>
      <jsp:body>
        Nội dung chính của phần tử XML
      </jsp:body>
    </jsp:element>
  </body>
</html>
```

Truy cập vào trang sau đây trong trình duyệt, kết quả hiển thị như sau:

```jsp
<xmlElement xmlElementAttr="Giá trị thuộc tính">
   Nội dung chính của phần tử XML
</xmlElement>
```

### `<jsp:text>`

Hành động `<jsp:text>` cho phép sử dụng mẫu để ghi văn bản vào trang JSP và tài liệu. Cú pháp như sau:

```jsp
<jsp:text>data template</jsp:text>
```

Mẫu văn bản trên không thể chứa các phần tử khác, chỉ có thể chứa văn bản và biểu thức EL (chú ý: biểu thức EL sẽ được giới thiệu trong các chương sau). Lưu ý, trong tệp XML, bạn không thể sử dụng biểu thức như ${whatever > 0}, vì ký tự> là không hợp lệ. Bạn có thể sử dụng biểu thức ${whatever gt 0} hoặc giá trị nhúng trong một phần CDATA.

```jsp
<jsp:text><![CDATA[<br>]]></jsp:text>
```

Nếu bạn cần khai báo DOCTYPE trong XHTML, bạn phải sử dụng phần tử hành động `<jsp:text>`, ví dụ như sau:

```jsp
<jsp:text><![CDATA[<!DOCTYPE html
PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"DTD/xhtml1-strict.dtd">]]>
</jsp:text>
<head><title>jsp:text action</title></head>
<body>

<books><book><jsp:text>
    Welcome to JSP Programming
</jsp:text></book></books>

</body>
</html>
```

## Biểu thức EL

Biểu thức EL (Expression Language) là một đoạn mã được đặt trong dấu `${}` để dễ dàng truy cập vào các đối tượng. Biểu thức EL được viết trong mã HTML của JSP, không được viết trong các đoạn mã JSP được bao quanh bởi`<%` và `%>`.

Ngôn ngữ biểu thức JSP (EL) cho phép truy cập dữ liệu được lưu trữ trong JavaBean một cách dễ dàng. Biểu thức JSP EL có thể được sử dụng để tạo ra biểu thức số học và biểu thức logic. Trong biểu thức JSP EL, bạn có thể sử dụng số nguyên, số thực, chuỗi, các hằng số true, false và null.

### Cú pháp đơn giản

Thường khi bạn cần chỉ định một giá trị thuộc tính trong một thẻ JSP, bạn chỉ cần sử dụng một chuỗi đơn giản:

```
<jsp:setProperty name="box" property="perimeter" value="100" />
```

EL cho phép bạn chỉ định một biểu thức để biểu diễn giá trị thuộc tính. Cú pháp đơn giản của biểu thức như sau:

```
${expr}
```

Ở đây, expr đề cập đến biểu thức. Trong biểu thức JSP EL, các toán tử phổ biến là "." và "[]". Hai toán tử này cho phép bạn truy cập vào các thuộc tính của JavaBean thông qua JSP nhúng.

Ví dụ, thẻ `<jsp:setProperty>` trên có thể được viết lại bằng cách sử dụng ngôn ngữ biểu thức như sau:

```
<jsp:setProperty
  name="box"
  property="perimeter"
  value="${2*box.width+2*box.height}"
/>
```

Khi trình biên dịch JSP gặp phần tử "${}" trong thuộc tính, nó sẽ tạo mã để tính toán biểu thức này và tạo ra một giá trị thay thế cho giá trị của biểu thức.

Bạn cũng có thể sử dụng ngôn ngữ biểu thức trong văn bản mẫu của thẻ. Ví dụ, thẻ `<jsp:text>` đơn giản chỉ chèn văn bản trong thân thẻ vào đầu ra JSP:

```
<jsp:text>
  <h1>Hello JSP!</h1>
</jsp:text>
```

Bây giờ, sử dụng biểu thức trong thân thẻ, như sau:

```
<jsp:text>
  Box Perimeter is: ${2*box.width + 2*box.height}
</jsp:text>
```

Trong biểu thức EL, bạn có thể sử dụng dấu ngoặc đơn để tổ chức các biểu thức con. Ví dụ `${(1 + 2) * 3}` bằng 9, nhưng `${1 + (2 * 3)}` bằng 7.

Để tắt việc đánh giá biểu thức EL, bạn cần sử dụng chỉ thị page để đặt giá trị của thuộc tính isELIgnored thành true:

```
<%@ page isELIgnored ="true|false" %>
```

Điều này sẽ làm cho biểu thức EL bị bỏ qua. Nếu đặt thành false, máy chủ sẽ tính toán biểu thức EL.

### Các toán tử cơ bản trong EL

Biểu thức EL hỗ trợ hầu hết các toán tử số học và logic được cung cấp bởi Java:

| **Toán tử** | **Mô tả**                           |
| ----------- | ---------------------------------- |
| .           | Truy cập vào thuộc tính của Bean hoặc mục nhập bản đồ |
| []          | Truy cập vào phần tử của mảng hoặc danh sách |
| ( )         | Nhóm một biểu thức con để thay đổi ưu tiên |
| +           | Cộng                                |
| -           | Trừ hoặc âm                         |
| \*          | Nhân                                |
| / hoặc div  | Chia                                |
| % hoặc mod  | Chia lấy dư                         |
| == hoặc eq  | Kiểm tra bằng                        |
| != hoặc ne  | Kiểm tra không bằng                   |
| < hoặc lt   | Kiểm tra nhỏ hơn                     |
| > hoặc gt   | Kiểm tra lớn hơn                      |
| <= hoặc le  | Kiểm tra nhỏ hơn hoặc bằng            |
| >= hoặc ge  | Kiểm tra

## Biểu thức EL

Biểu thức EL (Expression Language) là một đoạn mã được đặt trong cặp `${}` để dễ dàng truy cập vào các đối tượng. Biểu thức EL được viết trong mã HTML của JSP, không được viết trong các đoạn mã JSP được bao bọc bởi `<%` và `%>`.

EL trong JSP cho phép truy cập dữ liệu được lưu trữ trong các JavaBean trở nên đơn giản hơn. EL trong JSP có thể được sử dụng để tạo ra biểu thức số học và biểu thức logic. Trong biểu thức EL, bạn có thể sử dụng các kiểu dữ liệu như số nguyên, số thực, chuỗi, các hằng số true, false và null.

### Cú pháp đơn giản

Thường thì khi bạn cần chỉ định giá trị của một thuộc tính trong một thẻ JSP, bạn chỉ cần sử dụng một chuỗi đơn giản:

```
<jsp:setProperty name="box" property="perimeter" value="100" />
```

EL cho phép bạn chỉ định một biểu thức để biểu diễn giá trị của thuộc tính. Cú pháp đơn giản của biểu thức như sau:

```
${biểu_thức}
```

Trong đó, biểu_thức là biểu thức cần tính toán. Trong EL, các toán tử thông dụng là "." và "[]". Hai toán tử này cho phép bạn truy cập vào các thuộc tính của đối tượng JSP nhúng.

Ví dụ, thẻ `<jsp:setProperty>` ở trên có thể được viết lại bằng cú pháp biểu thức như sau:

```
<jsp:setProperty
  name="box"
  property="perimeter"
  value="${2*box.width+2*box.height}"
/>
```

Khi trình biên dịch JSP gặp định dạng "${}" trong thuộc tính, nó sẽ tạo mã để tính toán biểu thức này và tạo một giá trị thay thế cho biểu thức.

Bạn cũng có thể sử dụng biểu thức EL trong văn bản mẫu của thẻ. Ví dụ, thẻ `<jsp:text>` đơn giản chỉ chèn văn bản trong thân thẻ vào đầu ra JSP:

```
<jsp:text>
  <h1>Hello JSP!</h1>
</jsp:text>
```

Bây giờ, bạn có thể sử dụng biểu thức trong thân thẻ `<jsp:text>` như sau:

```
<jsp:text>
  Box Perimeter is: ${2*box.width + 2*box.height}
</jsp:text>
```

Trong biểu thức EL, bạn có thể sử dụng dấu ngoặc đơn để nhóm các biểu thức con. Ví dụ, `${(1 + 2) * 3}` bằng 9, nhưng `${1 + (2 * 3)}` bằng 7.

Nếu bạn muốn tắt việc đánh giá biểu thức EL, bạn có thể sử dụng chỉ thị page và đặt giá trị của thuộc tính isELIgnored thành true:

```
<%@ page isELIgnored ="true|false" %>
```

Điều này sẽ làm cho biểu thức EL bị bỏ qua. Nếu đặt thành false, container sẽ tính toán biểu thức EL.

### Các toán tử cơ bản trong EL

Biểu thức EL hỗ trợ hầu hết các toán tử số học và logic được cung cấp bởi Java:

| **Toán tử** | **Mô tả**                           |
| ----------- | ----------------------------------- |
| .           | Truy cập vào thuộc tính của Bean hoặc mục nhập ánh xạ |
| []          | Truy cập vào phần tử của một mảng hoặc danh sách |
| ( )         | Nhóm một biểu thức con để thay đổi thứ tự ưu tiên |
| +           | Cộng                                 |
| -           | Trừ hoặc âm                          |
| \*          | Nhân                                 |
| / hoặc div  | Chia                                 |
| % hoặc mod  | Chia lấy dư                          |
| == hoặc eq  | Kiểm tra bằng nhau                    |
| != hoặc ne  | Kiểm tra không bằng nhau              |
| < hoặc lt   | Kiểm tra nhỏ hơn                     |
| > hoặc gt   | Kiểm tra lớn hơn                      |
| <= hoặc le  | Kiểm tra nhỏ hơn hoặc bằng            |
| >= hoặc ge  | Kiểm tra lớn hơn hoặc bằng            |
| && hoặc and | Kiểm tra logic và                    |
| \|\| hoặc or | Kiểm tra logic hoặc                   |
| ! hoặc not  | Kiểm tra phủ định                     |
| empty       | Kiểm tra rỗng                        |

### Các hàm trong EL

EL trong JSP cho phép bạn sử dụng các hàm trong biểu thức. Các hàm này phải được định nghĩa trong thư viện thẻ tùy chỉnh. Cú pháp sử dụng hàm như sau:

```
${ns:func(param1, param2, ...)}
```

Ở đây, ns là tên không gian (namespace), func là tên của hàm, param1 là tham số thứ nhất, param2 là tham số thứ hai, và cứ tiếp tục như vậy. Ví dụ, có hàm fn:length được định nghĩa trong thư viện JSTL, bạn có thể lấy độ dài của một chuỗi như sau:

```
${fn:length("Get my length")}
```

Để sử dụng các hàm trong bất kỳ thư viện thẻ nào, bạn cần cài đặt các thư viện này trên máy chủ và sử dụng thẻ `<taglib>` để bao gồm các thư viện này trong tệp JSP.

### Đối tượng ẩn trong EL của JSP

EL trong JSP hỗ trợ các đối tượng ẩn sau đây:

| **Đối tượng ẩn**     | **Mô tả**                       |
| ------------------- | ------------------------------ |
| pageScope           | Phạm vi của page                |
| requestScope        | Phạm vi của request             |
| sessionScope        | Phạm vi của session             |
| applicationScope    | Phạm vi của application         |
| param               | Tham số của đối tượng Request, là một chuỗi |
| paramValues         | Tham số của đối tượng Request, là một mảng chuỗi |
| header              | Header HTTP, là một chuỗi              |
| headerValues        | Header HTTP, là một mảng chuỗi         |
| initParam           | Tham số khởi tạo ngữ cảnh               |
| cookie              | Giá trị của cookie                     |
| pageContext         | pageContext của trang hiện tại         |

Bạn có thể sử dụng các đối tượng này trong biểu thức EL giống như sử dụng biến. Dưới đây là một số ví dụ để hiểu rõ hơn về khái niệm này.

### Đối tượng pageContext

Đối tượng pageContext là tham chiếu đến đối tượng pageContext trong JSP. Thông qua đối tượng pageContext, bạn có thể truy cập đối tượng request. Ví dụ, để truy cập chuỗi truy vấn được truyền vào request, bạn có thể sử dụng:

```
${pageContext.request.queryString}
```

### Đối tượng Scope

Các biến pageScope, requestScope, sessionScope, applicationScope được sử dụng để truy cập các biến được lưu trữ trong các phạm vi tương ứng.

Ví dụ, nếu bạn muốn truy cập biến box được lưu trữ trong phạm vi applicationScope, bạn có thể truy cập bằng cách sử dụng applicationScope.box.

### Đối tượng param và paramValues

Đối tượng param và paramValues được sử dụng để truy cập giá trị của các tham số, thông qua việc sử dụng phương thức request.getParameter và request.getParameterValues.

Ví dụ, để truy cập tham số có tên là order, bạn có thể sử dụng biểu thức như sau: `${param.order}` hoặc `${param["order"]}`.

Ví dụ dưới đây cho thấy cách truy cập vào tham số username trong request:

```
<%@ page import="java.io.*,java.util.*" %> <% String title = "Accessing Request
Param"; %>
<html>
  <head>
    <title><% out.print(title); %></title>
  </head>
  <body>
    <center>
      <h1><% out.print(title); %></h1>
    </center>
    <div align="center">
      <p>${param["username"]}</p>
    </div>
  </body>
</html>
```

Đối tượng param trả về một chuỗi duy nhất, trong khi paramValues trả về một mảng chuỗi.

### Đối tượng header và headerValues

Đối tượng header và headerValues được sử dụng để truy cập các header thông tin, thông qua việc sử dụng phương thức request.getHeader và request.getHeaders.

Ví dụ, để truy cập header user-agent, bạn có thể sử dụng biểu thức như sau: `${header.user-agent}` hoặc `${header["user-agent"]}`.

Ví dụ dưới đây cho thấy cách truy cập vào header user-agent:

```
<%@ page import="java.io.*,java.util.*" %> <% String title = "User Agent
Example"; %>
<html>
  <head>
    <title><% out.print(title); %></title>
  </head>
  <body>
    <center>
      <h1><% out.print(title); %></h1>
    </center>
    <div align="center">
      <p>${header["user-agent"]}</p>
    </div>
  </body>
</html>
```

Kết quả chạy sẽ như sau:

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/jsp-expression-language.jpg)

Đối tượng header trả về một giá trị duy nhất, trong khi headerValues trả về một mảng chuỗi.

## JSTL

Thư viện Thẻ Chuẩn JSP (JSTL) là một bộ thẻ JSP, nó đóng gói các chức năng cốt lõi thông dụng của ứng dụng JSP.

JSTL hỗ trợ các tác vụ chung và có cấu trúc như lặp, kiểm tra điều kiện, thao tác tài liệu XML, thẻ quốc tế hóa, thẻ SQL. Ngoài ra, nó cung cấp một khung làm việc để sử dụng các thẻ tùy chỉnh tích hợp với JSTL.

Dựa trên chức năng mà các thẻ JSTL cung cấp, chúng có thể được chia thành 5 loại.

- **Thẻ cốt lõi**
- **Thẻ định dạng**
- **Thẻ SQL**
- **Thẻ XML**
- **Hàm JSTL**

### Cài đặt thư viện JSTL

Bước cài đặt thư viện JSTL trên Apache Tomcat như sau:

Tải xuống gói nén từ thư viện thẻ chuẩn Apache (jakarta-taglibs-standard-current.zip).

- Địa chỉ tải xuống chính thức: <http://archive.apache.org/dist/jakarta/taglibs/standard/binaries/>
- Địa chỉ tải xuống từ trang web của chúng tôi: [jakarta-taglibs-standard-1.1.2.zip](http://static.runoob.com/download/jakarta-taglibs-standard-1.1.2.tar.gz)

Tải xuống và giải nén gói **jakarta-taglibs-standard-1.1.2.zip**, sau đó sao chép hai tệp jar **standard.jar** và **jstl.jar** từ thư mục **jakarta-taglibs-standard-1.1.2/lib/** vào thư mục **/WEB-INF/lib/**.

Sao chép các tệp tld từ thư mục tld mà bạn muốn sử dụng vào thư mục WEB-INF.

Tiếp theo, chúng ta thêm cấu hình sau vào tệp web.xml:

```
<?xml version="1.0" encoding="UTF-8"?>
<web-app
  version="2.4"
  xmlns="http://java.sun.com/xml/ns/j2ee"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee
        http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd"
>
  <jsp-config>
    <taglib>
      <taglib-uri>http://java.sun.com/jsp/jstl/fmt</taglib-uri>
      <taglib-location>/WEB-INF/fmt.tld</taglib-location>
    </taglib>
    <taglib>
      <taglib-uri>http://java.sun.com/jsp/jstl/fmt-rt</taglib-uri>
      <taglib-location>/WEB-INF/fmt-rt.tld</taglib-location>
    </taglib>
    <taglib>
      <taglib-uri>http://java.sun.com/jsp/jstl/core</taglib-uri>
      <taglib-location>/WEB-INF/c.tld</taglib-location>
    </taglib>
    <taglib>
      <taglib-uri>http://java.sun.com/jsp/jstl/core-rt</taglib-uri>
      <taglib-location>/WEB-INF/c-rt.tld</taglib-location>
    </taglib>
    <taglib>
      <taglib-uri>http://java.sun.com/jsp/jstl/sql</taglib-uri>
      <taglib-location>/WEB-INF/sql.tld</taglib-location>
    </taglib>
    <taglib>
      <taglib-uri>http://java.sun.com/jsp/jstl/sql-rt</taglib-uri>
      <taglib-location>/WEB-INF/sql-rt.tld</taglib-location>
    </taglib>
    <taglib>
      <taglib-uri>http://java.sun.com/jsp/jstl/x</taglib-uri>
      <taglib-location>/WEB-INF/x.tld</taglib-location>
    </taglib>
    <taglib>
      <taglib-uri>http://java.sun.com/jsp/jstl/x-rt</taglib-uri>
      <taglib-location>/WEB-INF/x-rt.tld</taglib-location>
    </taglib>
  </jsp-config>
</web-app>
```

Để sử dụng bất kỳ thư viện nào, bạn phải bao gồm thẻ `<taglib>` trong phần đầu của mỗi tệp JSP.

### Thẻ cốt lõi

Thẻ cốt lõi là những thẻ JSTL phổ biến nhất. Cú pháp để sử dụng thư viện thẻ cốt lõi như sau:

```jsp
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
```

| Thẻ                                                                 | Mô tả                                                                 |
| :------------------------------------------------------------------- | :------------------------------------------------------------------- |
| [`<c:out>`](https://www.tutorialspoint.com/jsp/jstl_core_out_tag.htm)        | Dùng để hiển thị dữ liệu trong JSP             |
| [`<c:set>`](https://www.tutorialspoint.com/jsp/jstl_core_set_tag.htm)        | Dùng để lưu trữ dữ liệu                                                |
| [`<c:remove>`](https://www.tutorialspoint.com/jsp/jstl_core_remove_tag.htm)  | Dùng để xóa dữ liệu                                                    |
| [`<c:catch>`](https://www.tutorialspoint.com/jsp/jstl_core_catch_tag.htm)    | Dùng để xử lý ngoại lệ gây ra lỗi và lưu trữ thông tin lỗi              |
| [`<c:if>`](https://www.tutorialspoint.com/jsp/jstl_core_if_tag.htm)          | Tương tự như câu lệnh if trong các chương trình thông thường           |
| [`<c:choose>`](https://www.tutorialspoint.com/jsp/jstl_core_choose_tag.htm)  | Là thẻ cha cho các thẻ `<c:when>` và `<c:otherwise>`                    |
| [`<c:when>`](https://www.tutorialspoint.com/jsp/jstl_core_choose_tag.htm)    | Là thẻ con của `<c:choose>`, dùng để kiểm tra điều kiện có đúng hay không |
| [`<c:otherwise>`](https://www.tutorialspoint.com/jsp/jstl_core_choose_tag.htm) | Là thẻ con của `<c:choose>`, được thực hiện khi các `<c:when>` trước đó không đúng |
| [`<c:import>`](https://www.tutorialspoint.com/jsp/jstl_core_import_tag.htm)  | Dùng để lấy nội dung từ một URL và hiển thị nó trên trang JSP            |
| [`<c:forEach>`](https://www.tutorialspoint.com/jsp/jstl_core_foreach_tag.htm) | Thẻ lặp cơ bản, chấp nhận nhiều loại tập hợp                             |
| [`<c:forTokens>`](https://www.tutorialspoint.com/jsp/jstl_core_foreach_tag.htm) | Tách chuỗi thành các phần tử và lặp để xuất ra                          |
| [`<c:param>`](https://www.tutorialspoint.com/jsp/jstl_core_param_tag.htm)    | Được sử dụng để truyền tham số cho trang được bao gồm hoặc chuyển hướng   |
| [`<c:redirect>`](https://www.tutorialspoint.com/jsp/jstl_core_redirect_tag.htm) | Chuyển hướng đến một URL mới.                                           |
| [`<c:url>`](https://www.tutorialspoint.com/jsp/jstl_core_url_tag.htm)        | Tạo URL với các tham số truy vấn tùy chọn                                |

### Thẻ định dạng

Thư viện thẻ định dạng JSTL cung cấp các thẻ để định dạng và xuất dữ liệu văn bản, ngày tháng, thời gian, số. Cú pháp để sử dụng thư viện thẻ định dạng như sau:

```
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
```

| Thẻ                                                                                     | Mô tả                                                             |
| :--------------------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| [`<fmt:formatNumber>`](https://www.tutorialspoint.com/jsp/jstl_format_formatnumber_tag.htm)     | Định dạng số theo định dạng hoặc độ chính xác                      |
| [`<fmt:parseNumber>`](https://www.tutorialspoint.com/jsp/jstl_format_parsenumber_tag.htm)       | Phân tích một chuỗi đại diện cho số, tiền tệ hoặc phần trăm         |
| [`<fmt:formatDate>`](https://www.tutorialspoint.com/jsp/jstl_format_formatdate_tag.htm)         | Định dạng ngày tháng theo kiểu hoặc mẫu đã cho                     |
| [`<fmt:parseDate>`](https://www.tutorialspoint.com/jsp/jstl_format_parsedate_tag.htm)           | Phân tích một chuỗi đại diện cho ngày hoặc thời gian               |
| [`<fmt:bundle>`](https://www.tutorialspoint.com/jsp/jstl_format_bundle_tag.htm)                 | Ràng buộc tài nguyên                                                |
| [`<fmt:setLocale>`](https://www.tutorialspoint.com/jsp/jstl_format_setlocale_tag.htm)           | Xác định ngôn ngữ                                                   |
| [`<fmt:setBundle>`](https://www.tutorialspoint.com/jsp/jstl_format_setbundle_tag.htm)           | Ràng buộc tài nguyên                                                |
| [`<fmt:timeZone>`](https://www.tutorialspoint.com/jsp/jstl_format_timezone_tag.htm)             | Xác định múi giờ                                                    |
| [`<fmt:setTimeZone>`](https://www.tutorialspoint.com/jsp/jstl_format_settimezone_tag.htm)       | Xác định múi giờ                                                    |
| [`<fmt:message>`](https://www.tutorialspoint.com/jsp/jstl_format_message_tag.htm)               | Hiển thị thông tin từ tệp cấu hình tài nguyên                      |
| [`<fmt:requestEncoding>`](https://www.tutorialspoint.com/jsp/jstl_format_requestencoding_tag.htm) | Thiết lập mã ký tự của yêu cầu                                      |

### Thẻ SQL

Thư viện thẻ SQL JSTL cung cấp các thẻ để tương tác với cơ sở dữ liệu quan hệ (Oracle, MySQL, SQL Server, v.v.). Cú pháp để sử dụng thư viện thẻ SQL như sau:

```
<%@ taglib prefix="sql" uri="http://java.sun.com/jsp/jstl/sql" %>
```

| Thẻ                                                                                       | Mô tả                                                             |
| :----------------------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| [`<sql:setDataSource>`](https://www.tutorialspoint.com/jsp/jstl_sql_setdatasource_tag.htm)         | Xác định nguồn dữ liệu                                           |
| [`<sql:query>`](https://www.tutorialspoint.com/jsp/jstl_sql_query_tag.htm)                         | Thực thi câu lệnh truy vấn SQL                                    |
| [`<sql:update>`](https://www.tutorialspoint.com/jsp/jstl_sql_update_tag.htm)                       | Thực thi câu lệnh cập nhật SQL                                    |
| [`<sql:param>`](https://www.tutorialspoint.com/jsp/jstl_sql_param_tag.htm)                         | Đặt tham số trong câu lệnh SQL                                    |
| [`<sql:dateParam>`](https://www.tutorialspoint.com/jsp/jstl_sql_dateparam_tag.htm)                 | Đặt tham số ngày trong câu lệnh SQL                               |
| [`<sql:transaction>`](https://www.tutorialspoint.com/jsp/jstl_sql_transaction_tag.htm)             | Cung cấp hành vi cơ sở dữ liệu lồng nhau trong một kết nối chia sẻ |

### Các thẻ XML

Thư viện thẻ XML JSTL cung cấp các thẻ để tạo và thao tác với tài liệu XML. Cú pháp để tham chiếu thư viện thẻ XML như sau:

```
<%@ taglib prefix="x" uri="http://java.sun.com/jsp/jstl/xml" %>
```

Trước khi sử dụng các thẻ XML, bạn cần sao chép các gói liên quan đến XML và XPath vào thư mục `<Tomcat installation directory>\lib` của bạn:

- XercesImpl.jar

  Đường dẫn tải về: <http://www.apache.org/dist/xerces/j/>

- xalan.jar

  Đường dẫn tải về: <http://xml.apache.org/xalan_j/index.htm>

| Thẻ                                                                     | Mô tả                                                        |
| :---------------------------------------------------------------------- | :---------------------------------------------------------- |
| [`<x:out>`](https://www.tutorialspoint.com/jsp/jstl_xml_out_tag.htm)             | Tương tự như, nhưng chỉ sử dụng cho biểu thức XPath |
| [`<x:parse>`](https://www.tutorialspoint.com/jsp/jstl_xml_parse_tag.htm)         | Phân tích cú pháp dữ liệu XML                                |
| [`<x:set>`](https://www.tutorialspoint.com/jsp/jstl_xml_set_tag.htm)             | Đặt biểu thức XPath                                         |
| [`<x:if>`](https://www.tutorialspoint.com/jsp/jstl_xml_if_tag.htm)               | Kiểm tra biểu thức XPath, nếu đúng, thực hiện nội dung trong thân, nếu không, bỏ qua thân |
| [`<x:forEach>`](https://www.tutorialspoint.com/jsp/jstl_xml_foreach_tag.htm)     | Lặp lại các nút trong tài liệu XML                           |
| [`<x:choose>`](https://www.tutorialspoint.com/jsp/jstl_xml_choose_tag.htm)       | Thẻ cha của <x:when> và <x:otherwise>                        |
| [`<x:when>`](https://www.tutorialspoint.com/jsp/jstl_xml_choose_tag.htm)         | Thẻ con của <x:choose>, được sử dụng để kiểm tra điều kiện    |
| [`<x:otherwise>`](https://www.tutorialspoint.com/jsp/jstl_xml_choose_tag.htm)    | Thẻ con của <x:choose>, được thực hiện khi <x:when> trả về false |
| [`<x:transform>`](https://www.tutorialspoint.com/jsp/jstl_xml_transform_tag.htm) | Áp dụng biến đổi XSL vào tài liệu XML                        |
| [`<x:param>`](https://www.tutorialspoint.com/jsp/jstl_xml_param_tag.htm)         | Được sử dụng cùng với <x:transform>, để đặt các bảng kiểu XSL |

### Các hàm JSTL

JSTL bao gồm một loạt các hàm tiêu chuẩn, hầu hết là các hàm xử lý chuỗi chung. Cú pháp để tham chiếu thư viện hàm JSTL như sau:

```
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
```

| Hàm                                                                                       | Mô tả                                                     |
| :----------------------------------------------------------------------------------------- | :------------------------------------------------------- |
| [fn:contains()](https://www.tutorialspoint.com/jsp/jstl_function_contains.htm)                     | Kiểm tra xem chuỗi đầu vào có chứa chuỗi con đã chỉ định hay không |
| [fn:containsIgnoreCase()](https://www.tutorialspoint.com/jsp/jstl_function_containsignoreCase.htm) | Kiểm tra xem chuỗi đầu vào có chứa chuỗi con đã chỉ định hay không (không phân biệt chữ hoa chữ thường) |
| [fn:endsWith()](https://www.tutorialspoint.com/jsp/jstl_function_endswith.htm)                     | Kiểm tra xem chuỗi đầu vào có kết thúc bằng hậu tố đã chỉ định hay không |
| [fn:escapeXml()](https://www.tutorialspoint.com/jsp/jstl_function_escapexml.htm)                   | Bỏ qua các ký tự có thể được sử dụng làm thẻ XML            |
| [fn:indexOf()](https://www.tutorialspoint.com/jsp/jstl_function_indexof.htm)                       | Trả về vị trí xuất hiện đầu tiên của chuỗi đã chỉ định trong chuỗi đầu vào |
| [fn:join()](https://www.tutorialspoint.com/jsp/jstl_function_join.htm)                             | Kết hợp các phần tử trong mảng thành một chuỗi và trả về   |
| [fn:length()](https://www.tutorialspoint.com/jsp/jstl_function_length.htm)                         | Trả về độ dài của chuỗi đầu vào                            |
| [fn:replace()](https://www.tutorialspoint.com/jsp/jstl_function_replace.htm)                       | Thay thế vị trí đã chỉ định trong chuỗi đầu vào bằng chuỗi đã chỉ định và trả về |
| [fn:split()](https://www.tutorialspoint.com/jsp/jstl_function_split.htm)                           | Phân tách chuỗi thành một mảng con các chuỗi bằng dấu phân cách đã chỉ định và trả về |
| [fn:startsWith()](https://www.tutorialspoint.com/jsp/jstl_function_startswith.htm)                 | Kiểm tra xem chuỗi đầu vào có bắt đầu bằng tiền tố đã chỉ định hay không |
| [fn:substring()](https://www.tutorialspoint.com/jsp/jstl_function_substring.htm)                   | Trả về một phần con của chuỗi                              |
| [fn:substringAfter()](https://www.tutorialspoint.com/jsp/jstl_function_substringafter.htm)         | Trả về một phần con của chuỗi sau chuỗi con đã chỉ định    |
| [fn:substringBefore()](https://www.tutorialspoint.com/jsp/jstl_function_substringbefore.htm)       | Trả về một phần con của chuỗi trước chuỗi con đã chỉ định  |
| [fn:toLowerCase()](https://www.tutorialspoint.com/jsp/jstl_function_tolowercase.htm)               | Chuyển đổi các ký tự trong chuỗi thành chữ thường           |
| [fn:toUpperCase()](https://www.tutorialspoint.com/jsp/jstl_function_touppercase.htm)               | Chuyển đổi các ký tự trong chuỗi thành chữ hoa               |
| [fn:trim()](https://www.tutorialspoint.com/jsp/jstl_function_trim.htm)                             | Loại bỏ khoảng trắng ở đầu và cuối chuỗi                   |

## Thẻ Taglib

### Thẻ tùy chỉnh JSP

Thẻ tùy chỉnh là một phần tử ngôn ngữ JSP do người dùng xác định. Khi trang JSP chứa một thẻ tùy chỉnh, nó sẽ được chuyển đổi thành một servlet, thẻ sẽ được chuyển đổi thành các hoạt động trên một đối tượng được gọi là tag handler khi servlet được thực thi.

Mở rộng thẻ JSP cho phép bạn tạo ra các thẻ mới và chèn trực tiếp vào một trang JSP. Quy tắc thẻ tùy chỉnh đơn giản được giới thiệu trong quy tắc JSP 2.0.

Bạn có thể kế thừa lớp SimpleTagSupport và ghi đè phương thức doTag() để phát triển một thẻ tùy chỉnh đơn giản nhất.

### Tạo thẻ "Hello"

Tiếp theo, chúng ta muốn tạo một thẻ tùy chỉnh gọi là <ex:Hello>, định dạng của thẻ như sau:

```
<ex:Hello />
```

Để tạo một thẻ tùy chỉnh JSP, bạn phải trước tiên tạo một lớp Java xử lý thẻ. Vì vậy, hãy tạo một lớp HelloTag như sau:

```
package com.runoob;
import javax.servlet.jsp.tagext.*;
import javax.servlet.jsp.*;
import java.io.*;
public class HelloTag extends SimpleTagSupport {
   public void doTag() throws JspException, IOException {
      JspWriter out = getJspContext().getOut();
      out.println("Hello Custom Tag!");
   }
}
```

Đoạn mã trên ghi đè phương thức doTag(), trong phương thức này, chúng ta sử dụng phương thức getJspContext() để lấy đối tượng JspContext hiện tại và chuyển "Hello Custom Tag!" cho đối tượng JspWriter.

Biên dịch lớp trên và sao chép nó vào thư mục CLASSPATH của môi trường. Cuối cùng, tạo thẻ thư viện như sau: `<Tomcat installation directory>webapps\ROOT\WEB-INF\custom.tld`.

```
<taglib>
  <tlib-version>1.0</tlib-version>
  <jsp-version>2.0</jsp-version>
  <short-name>Example TLD</short-name>
  <tag>
    <name>Hello</name>
    <tag-class>com.runoob.HelloTag</tag-class>
    <body-content>empty</body-content>
  </tag>
</taglib>
```

Tiếp theo, chúng ta có thể sử dụng thẻ Hello trong tệp JSP:

```
<%@ taglib prefix="ex" uri="WEB-INF/custom.tld"%>
<html>
  <head>
    <title>A sample custom tag</title>
  </head>
  <body>
    <ex:Hello />
  </body>
</html>
```

Chương trình trên sẽ xuất ra kết quả sau:

```
Hello Custom Tag!
```

### Truy cập vào nội dung thẻ

Bạn có thể bao gồm nội dung thông điệp trong thẻ tùy chỉnh giống như thư viện thẻ tiêu chuẩn. Ví dụ, nếu chúng ta muốn bao gồm nội dung trong thẻ Hello tùy chỉnh của chúng ta, định dạng như sau:

```
<ex:Hello>
  Đây là nội dung thông điệp
</ex:Hello>
```

Chúng ta có thể sửa đổi lớp xử lý thẻ như sau:

```java
package com.runoob;

import javax.servlet.jsp.tagext.*;
import javax.servlet.jsp.*;
import java.io.*;

public class HelloTag extends SimpleTagSupport {

   StringWriter sw = new StringWriter();
   public void doTag()
      throws JspException, IOException
    {
       getJspBody().invoke(sw);
       getJspContext().getOut().println(sw.toString());
    }

}
```

Tiếp theo, chúng ta cần sửa đổi tệp TLD như sau:

```
<taglib>
  <tlib-version>1.0</tlib-version>
  <jsp-version>2.0</jsp-version>
  <short-name>Example TLD with Body</short-name>
  <tag>
    <name>Hello</name>
    <tag-class>com.runoob.HelloTag</tag-class>
    <body-content>scriptless</body-content>
  </tag>
</taglib>
```

Bây giờ chúng ta có thể sử dụng thẻ đã được sửa đổi trong JSP, như sau:

```
<%@ taglib prefix="ex" uri="WEB-INF/custom.tld"%>
<html>
  <head>
    <title>Một thẻ tùy chỉnh ví dụ</title>
  </head>
  <body>
    <ex:Hello>
      Đây là nội dung thông điệp
    </ex:Hello>
  </body>
</html>
```

Chương trình trên sẽ xuất ra kết quả sau:

```
Đây là nội dung thông điệp
```

### Thuộc tính tùy chỉnh của thẻ

Bạn có thể thiết lập các thuộc tính khác nhau trong thẻ tùy chỉnh của mình. Để nhận giá trị của thuộc tính, lớp xử lý thẻ tùy chỉnh phải triển khai các phương thức setter, giống như trong JavaBean, như sau:

```java
package com.runoob;

import javax.servlet.jsp.tagext.*;
import javax.servlet.jsp.*;
import java.io.*;

public class HelloTag extends SimpleTagSupport {

   private String message;

   public void setMessage(String msg) {
      this.message = msg;
   }

   StringWriter sw = new StringWriter();

   public void doTag()
      throws JspException, IOException
    {
       if (message != null) {
          /* Sử dụng thông điệp từ thuộc tính */
          JspWriter out = getJspContext().getOut();
          out.println( message );
       }
       else {
          /* Sử dụng thông điệp từ nội dung thẻ */
          getJspBody().invoke(sw);
          getJspContext().getOut().println(sw.toString());
       }
   }

}
```

Tên thuộc tính là "message", vì vậy phương thức setter là setMessage(). Bây giờ chúng ta hãy thêm thuộc tính này vào tệp TLD bằng cách sử dụng phần tử `<attribute>` như sau:

```
<taglib>
  <tlib-version>1.0</tlib-version>
  <jsp-version>2.0</jsp-version>
  <short-name>Example TLD with Body</short-name>
  <tag>
    <name>Hello</name>
    <tag-class>com.runoob.HelloTag</tag-class>
    <body-content>scriptless</body-content>
    <attribute>
      <name>message</name>
    </attribute>
  </tag>
</taglib>
```

Bây giờ chúng ta có thể sử dụng thuộc tính message trong tệp JSP như sau:

```
<%@ taglib prefix="ex" uri="WEB-INF/custom.tld"%>
<html>
  <head>
    <title>Một thẻ tùy chỉnh ví dụ</title>
  </head>
  <body>
    <ex:Hello message="Đây là thẻ tùy chỉnh" />
  </body>
</html>
```

Chương trình trên sẽ xuất ra kết quả sau:

```
Đây là thẻ tùy chỉnh
```

Bạn cũng có thể bao gồm các thuộc tính sau:

| Thuộc tính  | Mô tả                                                     |
| :---------- | :------------------------------------------------------- |
| name        | Xác định tên thuộc tính. Tên thuộc tính của mỗi thẻ phải là duy nhất. |
| required    | Xác định xem thuộc tính có bắt buộc hay tùy chọn hay không, nếu đặt là false thì là tùy chọn. |
| rtexprvalue | Khai báo xem thuộc tính có hiệu lực trong biểu thức chạy hay không. |
| type        | Xác định kiểu lớp Java của thuộc tính. Mặc định là **String**. |
| description | Mô tả thuộc tính                                          |
| fragment    | Nếu khai báo thuộc tính này, giá trị thuộc tính sẽ được xem như là một **JspFragment**. |

Dưới đây là một ví dụ về khai báo thuộc tính liên quan:

```
.....
<attribute>
  <name>attribute_name</name>
  <required>false</required>
  <type>java.util.Date</type>
  <fragment>false</fragment>
</attribute>
.....
```

Nếu bạn sử dụng hai thuộc tính, hãy sửa đổi tệp TLD như sau:

```
.....
<attribute>
  <name>attribute_name1</name>
  <required>false</required>
  <type>java.util.Boolean</type>
  <fragment>false</fragment>
</attribute>
<attribute>
  <name>attribute_name2</name>
  <required>true</required>
  <type>java.util.Date</type>
</attribute>
.....
```
