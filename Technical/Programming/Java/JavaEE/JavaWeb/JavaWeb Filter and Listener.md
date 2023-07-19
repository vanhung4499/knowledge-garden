---
title: JavaWeb Filter and Listener
tags: [java, javaee, javaweb]
categories: [java, javaee, javaweb]
date created: 2023-07-19
date modified: 2023-07-19
---

# Filter và Listener trong JavaWeb

Sau khi giới thiệu Servlet Specification, bạn không cần quan tâm đến việc giao tiếp mạng Socket, không cần quan tâm đến giao thức HTTP và không cần quan tâm đến cách các lớp kinh doanh của bạn được khởi tạo và gọi, vì những điều này đã được định chuẩn trong Servlet Specification. Bạn chỉ cần quan tâm đến cách triển khai logic kinh doanh của mình. Điều này là điều tốt đối với lập trình viên, nhưng cũng có một số hạn chế. Quy chuẩn có nghĩa là mọi người phải tuân thủ, và điều này có thể dẫn đến việc mọi thứ trở nên giống nhau. Vì vậy, khi thiết kế một quy chuẩn hoặc một middleware, cần xem xét khả năng mở rộng. Servlet Specification cung cấp hai cơ chế mở rộng: **Filter** và **Listener**.

## Filter

**Filter là bộ lọc, giao diện này cho phép bạn tùy chỉnh xử lý thống nhất cho các yêu cầu và phản hồi.**

Filter cung cấp khái niệm chuỗi bộ lọc (Filter Chain), một chuỗi bộ lọc bao gồm nhiều Filter. Yêu cầu từ khách hàng sẽ đi qua tất cả các Filter trong chuỗi trước khi đến Servlet, và phản hồi từ máy chủ sẽ đi qua tất cả các Filter trong chuỗi trước khi đến trình duyệt của khách hàng.

![javaweb-filter.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/javaweb-filter.png)

### Phương thức của Filter

Giao diện Filter có ba phương thức:

- `init`: Khởi tạo Filter
- `destroy`: Hủy Filter
- `doFilter`: Chuyển yêu cầu cho Filter hoặc Servlet tiếp theo trong chuỗi

Phương thức `init` và `destroy` chỉ được gọi một lần; `doFilter` được gọi mỗi khi có yêu cầu từ khách hàng.

```java
public interface Filter {

	/**
	 * Được gọi khi ứng dụng web khởi động, được sử dụng để khởi tạo Filter
	 * @param config
	 *            Có thể lấy thông tin khởi tạo và ServletContext từ đối số này
	 * @throws ServletException
	 */
	public void init(FilterConfig config) throws ServletException;

	/**
	 * Được gọi khi có yêu cầu từ khách hàng
	 *
	 * @param request
	 *            Yêu cầu từ khách hàng
	 * @param response
	 *            Phản hồi từ máy chủ
	 * @param chain
	 *            Chuỗi Filter, sử dụng chain.doFilter(request, response) để chuyển yêu cầu cho Filter hoặc Servlet tiếp theo
	 * @throws ServletException
	 * @throws IOException
	 */
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws ServletException, IOException;

	/**
	 * Được gọi khi ứng dụng web tắt, được sử dụng để giải phóng tài nguyên
	 */
	public void destroy();

}
```

### Cấu hình Filter

Filter cần được cấu hình trong tệp `web.xml` để có hiệu lực. Một Filter cần cấu hình với thẻ `<filter>` và `<filter-mapping>`.

- `<filter>` cấu hình tên Filter, lớp triển khai và các tham số khởi tạo.
- `<filter-mapping>` cấu hình quy tắc sử dụng Filter.
- Thuộc tính `filterName` của `<filter>` và `<filter-mapping>` phải khớp.
- `<url-pattern>` cấu hình quy tắc URL, có thể cấu hình nhiều, có thể sử dụng ký tự đại diện (`*`).
- `<dispatcher>` cấu hình cách đến Servlet, có 4 giá trị: REQUEST, FORWARD, INCLUDE, ERROR. Có thể cấu hình nhiều `<dispatcher>`. Nếu không cấu hình `<dispatcher>` nào, mặc định là REQUEST.
    - REQUEST - chỉ có hiệu lực khi yêu cầu trực tiếp đến Servlet.
    - FORWARD - chỉ có hiệu lực khi Servlet chuyển tiếp yêu cầu đến Filter.
    - INCLUDE - JSP có thể yêu cầu Servlet bằng `<jsp:include>`. Chỉ có hiệu lực trong trường hợp này.
    - ERROR - JSP có thể chỉ định trang xử lý lỗi bằng `<%@ page errorPage="error.jsp" %>`. Chỉ có hiệu lực trong trường hợp này.

## Listener

Trình nghe (Listener) được sử dụng để lắng nghe sự kiện tạo và hủy các đối tượng miền trong ứng dụng web như ServletContext, HttpSession và ServletRequest, cũng như lắng nghe sự kiện thay đổi thuộc tính trong các đối tượng miền này.

Việc sử dụng Listener không đòi hỏi quan tâm đến cách sự kiện xảy ra hoặc cách gọi Listener tương ứng. Chỉ cần nhớ rằng khi sự kiện xảy ra, Listener tương ứng sẽ được gọi. Các máy chủ tuân thủ quy tắc Servlet sẽ tự động hoàn thành công việc tương ứng.

### Phân loại Listener

Trong quy tắc Servlet, đã định nghĩa nhiều loại Trình nghe khác nhau, chúng được sử dụng để lắng nghe các sự kiện từ các đối tượng miền ServletContext, HttpSession và ServletRequest. Các loại Trình nghe này được chia thành ba loại:

1. Trình nghe sự kiện tạo và hủy đối tượng miền.
2. Trình nghe sự kiện thay đổi thuộc tính trong đối tượng miền.
3. Trình nghe sự kiện trạng thái của đối tượng được ràng buộc vào HttpSession.

### Trình nghe tạo và hủy đối tượng

#### HttpSessionListener

Giao diện HttpSessionListener được sử dụng để lắng nghe sự kiện tạo và hủy đối tượng HttpSession.

- Khi một đối tượng Session được tạo, phương thức sessionCreated (HttpSessionEvent se) sẽ được gọi.
- Khi một đối tượng Session bị hủy, phương thức sessionDestroyed (HttpSessionEvent se) sẽ được gọi.

#### ServletContextListener

Giao diện ServletContextListener được sử dụng để lắng nghe sự kiện tạo và hủy đối tượng ServletContext.

Bất kỳ lớp nào triển khai giao diện ServletContextListener đều có thể lắng nghe sự kiện tạo và hủy đối tượng ServletContext.

- Khi đối tượng ServletContext được tạo, phương thức contextInitialized (ServletContextEvent sce) sẽ được gọi.
- Khi đối tượng ServletContext bị hủy, phương thức contextDestroyed (ServletContextEvent sce) sẽ được gọi.

Thời điểm tạo và hủy đối tượng miền ServletContext:

- Tạo: Máy chủ khởi động tạo ServletContext cho mỗi ứng dụng web.
- Hủy: Máy chủ đóng trước khi đóng ServletContext đại diện cho mỗi ứng dụng web.

#### ServletRequestListener

Giao diện ServletRequestListener được sử dụng để lắng nghe sự kiện tạo và hủy đối tượng ServletRequest.

- Khi đối tượng Request được tạo, phương thức requestInitialized (ServletRequestEvent sre) sẽ được gọi.
- Khi đối tượng Request bị hủy, phương thức requestDestroyed (ServletRequestEvent sre) sẽ được gọi.

Thời điểm tạo và hủy đối tượng miền ServletRequest:

- Tạo: Mỗi lần người dùng truy cập, đối tượng request sẽ được tạo.
- Hủy: Khi phiên truy cập hiện tại kết thúc, đối tượng request sẽ bị hủy.

### Trình nghe thay đổi thuộc tính

Trình nghe sự kiện thuộc tính trong đối tượng miền được sử dụng để lắng nghe các sự kiện thay đổi thuộc tính trong đối tượng ServletContext, HttpSession và HttpServletRequest. Ba giao diện Trình nghe thuộc tính miền này là ServletContextAttributeListener, HttpSessionAttributeListener và ServletRequestAttributeListener. Các giao diện này đều định nghĩa ba phương thức để xử lý các sự kiện thêm, xóa và thay thế thuộc tính trong đối tượng được lắng nghe, cùng một sự kiện trong ba giao diện này có cùng tên phương thức, chỉ khác nhau về kiểu tham số được chấp nhận.

#### Phương thức attributeAdded

Khi một thuộc tính được thêm vào đối tượng được lắng nghe, máy chủ web gọi phương thức attributeAdded của Trình nghe sự kiện để xử lý. Phương thức này nhận một tham số kiểu sự kiện, Trình nghe có thể sử dụng tham số này để truy cập đối tượng miền đang thêm thuộc tính và đối tượng thuộc tính được lưu trữ trong miền.

Cú pháp đầy đủ của Trình nghe thuộc tính miền:

```java
public void attributeAdded(ServletContextAttributeEvent scae)
public void attributeReplaced(HttpSessionBindingEvent hsbe)
public void attributeRmoved(ServletRequestAttributeEvent srae)
```

#### Phương thức attributeRemoved

Khi một thuộc tính trong đối tượng được lắng nghe bị xóa, máy chủ web gọi phương thức attributeRemoved của Trình nghe sự kiện để xử lý.

Cú pháp đầy đủ của Trình nghe thuộc tính miền:

```java
public void attributeRemoved(ServletContextAttributeEvent scae)
public void attributeRemoved(HttpSessionBindingEvent hsbe)
public void attributeRemoved(ServletRequestAttributeEvent srae)
```

#### Phương thức attributeReplaced

Khi một thuộc tính trong đối tượng miền Trình nghe bị thay thế, máy chủ web gọi phương thức attributeReplaced của Trình nghe sự kiện để xử lý.

Cú pháp đầy đủ của Trình nghe thuộc tính miền:

```java
public void attributeReplaced(ServletContextAttributeEvent scae)
public void attributeReplaced(HttpSessionBindingEvent hsbe)
public void attributeReplaced(ServletRequestAttributeEvent srae)
```

### Trình nghe trạng thái của đối tượng trong Session

Các đối tượng được lưu trữ trong miền Session có thể có nhiều trạng thái:

- Được ràng buộc (session.setAttribute("bean", Object)) vào Session.
- Được gỡ bỏ ràng buộc (session.removeAttribute("bean")) khỏi Session.
- Được lưu trữ cùng với đối tượng Session trong một thiết bị lưu trữ.
- Được khôi phục cùng với đối tượng Session từ một thiết bị lưu trữ.

Quy tắc Servlet đã định nghĩa hai giao diện Trình nghe đặc biệt HttpSessionBindingListener và HttpSessionActivationListener để giúp đối tượng JavaBean hiểu về các trạng thái này trong miền Session.

Các lớp triển khai hai giao diện này không cần đăng ký trong tệp web.xml.

#### HttpSessionBindingListener

Đối tượng JavaBean triển khai giao diện HttpSessionBindingListener có thể nhận biết sự kiện ràng buộc hoặc gỡ bỏ ràng buộc của chính nó vào Session.

- Khi đối tượng được ràng buộc vào đối tượng HttpSession, máy chủ web gọi phương thức valueBound(HttpSessionBindingEvent event) của đối tượng này.
- Khi đối tượng được gỡ bỏ ràng buộc khỏi đối tượng HttpSession, máy chủ web gọi phương thức valueUnbound(HttpSessionBindingEvent event) của đối tượng này.

#### HttpSessionActivationListener

Đối tượng JavaBean triển khai giao diện HttpSessionActivationListener có thể nhận biết sự kiện hoạt hóa (giải nén) và bất hoạt hóa (nén) của chính nó.

- Khi đối tượng JavaBean được ràng buộc vào đối tượng HttpSession và sẽ được nén trước khi đối tượng HttpSession được nén xuống đĩa, máy chủ web gọi phương thức sessionWillPassivate(HttpSessionEvent event) của đối tượng này. Điều này giúp đối tượng JavaBean biết rằng nó sẽ được nén cùng với đối tượng HttpSession xuống đĩa.
- Khi đối tượng JavaBean được ràng buộc vào đối tượng HttpSession và sẽ được giải nén sau khi đối tượng HttpSession được giải nén từ đĩa, máy chủ web gọi phương thức sessionDidActivate(HttpSessionEvent event) của đối tượng này. Điều này giúp đối tượng JavaBean biết rằng nó sẽ được giải nén cùng với đối tượng HttpSession từ đĩa trở lại bộ nhớ.

## Filter và Listener

Sự khác biệt cơ bản giữa Filter và Listener:

- **Filter là can thiệp vào quá trình**, nó là một phần của quá trình, dựa trên hành vi quá trình.
- **Listener dựa trên trạng thái**, bất kỳ thay đổi hành vi nào cũng có cùng một trạng thái, sự kiện được kích hoạt là như nhau.
