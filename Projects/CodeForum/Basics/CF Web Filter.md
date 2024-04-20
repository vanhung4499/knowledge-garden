---
title: CF Web Filter
tags: 
categories: 
date created: 2024-04-17
date modified: 2024-04-17
---

# WEB Filter

Trong dự án của chúng tôi, chúng tôi sử dụng bộ lọc (Filter) để nhận dạng danh tính người dùng và lưu thông tin người dùng đã được nhận dạng vào ngữ cảnh ThreadLocal tương ứng. Điều này cho phép bất kỳ nơi nào trong chuỗi yêu cầu sau này cũng có thể trực tiếp lấy thông tin của người dùng đăng nhập hiện tại.

Tiếp theo, hãy xem cách mà bộ lọc Filter, một trong ba thành phần chính của Java WEB, hoạt động trong dự án kỹ thuật của chúng tôi.

## Kịch bản ứng dụng

Đường dẫn lớp thực: `com.hnv99.forum.web.hook.filter.ReqRecordFilter`

### 1. Kiến thức cơ bản về Filter

Trước khi đi vào phân tích mã nguồn ở trên, cần giới thiệu một số kiến thức cơ bản liên quan đến Filter.

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/00.jpg)

Filter được gọi là bộ lọc, chủ yếu được sử dụng để chặn các yêu cầu http và thực hiện một số công việc khác.

#### Giải thích quy trình

Sau khi một yêu cầu http đến

- Đầu tiên, đi vào filter, thực hiện logic nghiệp vụ liên quan
- Nếu được phép, tiếp tục vào Servlet logic. Sau khi Servlet hoàn thành, trở lại Filter, cuối cùng trả về cho người gửi yêu cầu
- Nếu không được phép, trả về trực tiếp mà không cần gửi yêu cầu cho Servlet

#### Các tình huống sử dụng

Dựa trên quy trình trên, có thể suy ra các tình huống sử dụng cụ thể:

- Tại tầng filter, để lấy danh tính của người dùng
- Có thể xem xét thực hiện một số kiểm tra thông thường (như kiểm tra tham số, kiểm tra referer, kiểm soát quyền truy cập, v.v.) tại tầng filter
- Có thể thực hiện công việc liên quan đến quản trị hệ thống, bảo mật (ví dụ: theo dõi toàn bộ chuỗi, có thể phân bổ một traceId ở tầng filter; hoặc thực hiện việc giới hạn tốc độ tại đây)

### 2. Hướng dẫn sử dụng

Việc sử dụng cơ bản của filter khá đơn giản, chỉ cần thực hiện giao diện Filter, như sau:

```java
@Slf4j
@WebFilter(urlPatterns = "/*", filterName = "reqRecordFilter", asyncSupported = true)
public class ReqRecordFilter implements Filter {
    private static Logger REQ_LOG = LoggerFactory.getLogger("req");

    @Autowired
    private GlobalInitService globalInitService;

    @Autowired
    private StatisticsSettingService statisticsSettingService;

    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        long start = System.currentTimeMillis();
        HttpServletRequest request = null;
        try {
            request = this.initReqInfo((HttpServletRequest) servletRequest);
            CrossUtil.buildCors(request, (HttpServletResponse) servletResponse);
            filterChain.doFilter(request, servletResponse);
        } finally {
            buildRequestLog(ReqInfoContext.getReqInfo(), request, System.currentTimeMillis() - start);
            ReqInfoContext.clear();
        }
    }

    @Override
    public void destroy() {
    }

    // ... 
}

```

Ở đây có ba phương thức:

- `init`: Được thực hiện khi khởi tạo
- `destroy`: Được thực hiện khi hủy
- `doFilter`: Tập trung vào đây, các yêu cầu phù hợp với quy tắc của filter sẽ đi qua
    - Ba tham số, chú ý đến tham số thứ ba FilterChain, đây là [[Chain of Responsibility Pattern|mô hình thiết kế chuỗi trách nhiệm]] kinh điển
    - Thực hiện `filterChain.doFilter(servletRequest, servletResponse)` đại diện cho việc tiếp tục thực hiện yêu cầu; nếu không thực hiện lệnh này, điều này có nghĩa là yêu cầu HTTP của lần này đã kết thúc ở đây, không tiếp tục nữa.

### 3. Đăng ký filter

Việc đăng ký filter vào Spring container có nhiều cách sử dụng, ngoài cách sử dụng `@WebFilter` như trên, còn có một số cách sử dụng khác được giới thiệu dưới đây.

#### 3.1 WebFilter Annotation

Sử dụng WebFilter Annotation, gắn vào filter mà bạn tự triển khai, trong đó có một số tham số cần lưu ý:

Thuộc tính phổ biến của WebFilter như sau, trong đó `urlPatterns` là thuộc tính phổ biến nhất, chỉ định rằng filter này áp dụng cho những url nào (mặc định là tất cả các yêu cầu)

| Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| filterName | String | Xác định thuộc tính tên của filter, tương đương với `<filter-name>` |
| value | String[] | Thuộc tính này tương đương với thuộc tính urlPatterns. Nhưng không nên sử dụng cả hai cùng một lúc. |
| urlPatterns | String[] | Xác định một tập hợp các mẫu URL cho filter. Tương đương với thẻ `<url-pattern>` |
| servletNames | String[] | Xác định filter sẽ áp dụng cho những Servlet nào. Giá trị là giá trị của thuộc tính name trong [@WebServlet](/WebServlet) hoặc giá trị trong `<servlet-name>` trong web.xml. |
| dispatcherTypes | DispatcherType | Xác định chế độ chuyển tiếp của filter. Các giá trị cụ thể bao gồm: ASYNC, ERROR, FORWARD, INCLUDE, REQUEST. |
| initParams | WebInitParam[] | Xác định một tập hợp các tham số khởi tạo cho filter, tương đương với thẻ `<init-param>` |
| asyncSupported | boolean | Khai báo xem filter có hỗ trợ chế độ hoạt động bất đồng bộ hay không, tương đương với thẻ `<async-supported>` |
| description | String | Thông tin mô tả của filter, tương đương với thẻ `<description>` |
| displayName | String | Tên hiển thị của filter, thường được sử dụng với các công cụ, tương đương với thẻ `<display-name>` |

Khi sử dụng chú thích này, hãy chú ý rằng bạn cần thêm chú thích `@ServletComponentScan` vào lớp khởi động / cấu hình để kích hoạt.

#### 3.2 FilterRegistrationBean

Cách tiếp theo sẽ đơn giản hơn, đặc biệt là khi xác định ưu tiên filter, không như cách sử dụng `@WebFilter` như trên.

```java
@Bean
public FilterRegistrationBean<Filter> orderFilter() {
    FilterRegistrationBean<Filter> filter = new FilterRegistrationBean<>();
    filter.setName("reqRecordFilter");
    filter.setUrlPatterns(Arrays.asList("/**"));
    filter.setFilter(new ReqRecordFilter());
    // Xác định ưu tiên
    filter.setOrder(-1);
    return filter;
}
```

**Chú ý:** [**@WebFilter**](/WebFilter) kết hợp với [**@Order**](/Order) để xác định thứ tự của filter có thể không hiệu quả. Xem chi tiết tại:

- [**Hướng dẫn sử dụng Filter trong Spring Boot | Blog của Yī Huī Huī**](https://spring.hhui.top/spring-blog/2019/10/16/191016-SpringBoot%E7%B3%BB%E5%88%97%E6%95%99%E7%A8%8Bweb%E7%AF%87%E4%B9%8B%E8%BF%87%E6%BB%A4%E5%99%A8Filter%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97/#a-Filter%E4%BE%9D%E8%B5%96Bean%E6%B3%A8%E5%85%A5%E9%97%AE%E9%A2%98)
- [**Hướng dẫn sử dụng Filter trong Spring Boot mở rộng | Blog của Yī Huī Huī**](https://spring.hhui.top/spring-blog/2019/10/18/191018-SpringBoot%E7%B3%BB%E5%88%97%E6%95%99%E7%A8%8Bweb%E7%AF%87%E4%B9%8B%E8%BF%87%E6%BB%A4%E5%99%A8Filter%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97%E6%89%A9%E5%B1%95%E7%AF%87/)

### 4. Mô tả ví dụ

Trong ví dụ này, chúng ta sẽ xem xét cụ thể về cách filter hoạt động trong dự án, trong filter này, chủ yếu thực hiện ba công việc:  

- Nhận diện danh tính và lưu danh tính vào ngữ cảnh `ReqInfoContext`
	- Xem tại [[CF Session Cookie]]  
- Ghi lại thông tin yêu cầu
	- Xem tại [[CF Web Filter Logging]]
- Thêm hỗ trợ đa tài nguyên (CORS)
	- Xem tại [[CF CORS]]

## Tổng kết

### 1. Sử dụng Filter

**Cách thức triển khai Filter tùy chỉnh**

- Triển khai giao diện Filter
- Trong phương thức doFilter, gọi rõ ràng `chain.doFilter(request, response);` để cho phép yêu cầu tiếp tục; nếu không, có nghĩa là yêu cầu bị lọc.  

**Đăng ký và có hiệu lực**

- `@ServletComponentScan` tự động quét Filter được đánh dấu bằng `@WebFilter`.
- Tạo Bean: `FilterRegistrationBean` để bọc Filter tùy chỉnh.

### 2. IoC/DI

Trong Spring Boot, Filter có thể được sử dụng giống như một Bean thông thường, có thể được Autowired để chúng ta có thể Inject các Bean Spring phụ thuộc.

### 3. Ưu tiên

Bằng cách tạo Bean `FilterRegistrationBean`, chúng ta có thể chỉ định ưu tiên, như sau:

```java
@Bean
public FilterRegistrationBean<OrderFilter> orderFilter() {
    FilterRegistrationBean<OrderFilter> filter = new FilterRegistrationBean<>();
    filter.setName("orderFilter");
    filter.setFilter(new OrderFilter());
    filter.setOrder(-1);
    return filter;
}

```

Ngoài ra, cần chú ý rằng Filter được đánh dấu bằng `@WebFilter` có ưu tiên là `2147483647` (ưu tiên thấp nhất).

**Lưu ý:**

- **@Order không thể chỉ định ưu tiên của Filter.**
- **@Order không thể chỉ định ưu tiên của Filter.**
