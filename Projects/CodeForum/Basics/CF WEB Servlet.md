---
title: CF WEB Servlet
tags: 
categories: 
date created: 2024-04-17
date modified: 2024-04-17
---

# WEB Servlet

Trong dự án, đã thực hiện nhiều hoạt động sử dụng bộ ba thành phần web, trong đó có filter; nếu nhắc đến filter, thì cũng cần giới thiệu về hai thành phần liên quan khác cho mọi người.  

Tiếp theo, chúng ta sẽ chủ yếu xem xét về cách sử dụng Servlet và bốn cách đăng ký Servlet tùy chỉnh:

- Annotation `@WebServlet`
- Định nghĩa bean `ServletRegistrationBean`
- Thêm động qua `ServletContext`
- Mô hình bean Spring thông thường

## Ví dụ sử dụng trong dự án

Trong phong dự án, một `HealthServlet` được viết đặc biệt, chức năng chính là để kiểm tra tình trạng sức khỏe của dịch vụ. Trong các dịch vụ web nhỏ, phương pháp để kiểm tra xem ứng dụng còn sống hay không có một phương án là gọi một giao diện dịch vụ theo định kỳ để xác định liệu nó có trả về bình thường hay không, hoặc kết quả trả về có phù hợp không.

Việc triển khai cụ thể cũng khá đơn giản:

```java
@WebServlet(urlPatterns = "/check")  
public class HealthServlet extends HttpServlet {  
  
    @Override  
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {  
        PrintWriter writer = resp.getWriter();  
        writer.write("ok");  
        writer.flush();  
        writer.close();  
    }
}
```

Việc truy cập vào giao diện trên cũng rất đơn giản, chỉ cần `http://127.0.0.1:8080/check`

## Kiến thức về Servlet

Tự định nghĩa một Servlet khá đơn giản, thường thấy là kế thừa từ `HttpServlet`, sau đó ghi đè các phương thức như `doGet`, `doPost` và các phương thức tương tự. Tuy nhiên, điểm chính là làm thế nào để các Servlet tùy chỉnh này được Spring Boot nhận diện và sử dụng, đó là điều quan trọng. Dưới đây là bốn cách đăng ký:

### 1. @WebServlet

Trên Servlet tùy chỉnh, thêm annotation Servlet3+ `@WebServlet`, để khai báo rằng lớp này là một Servlet. Tương tự như cách đăng ký Filter, sử dụng annotation này cần kết hợp với `@ServletComponentScan` của Spring Boot, nếu không, annotation trên sẽ không có hiệu lực:

```java
/**
 * Sử dụng annotation để định nghĩa và đăng ký một Servlet tùy chỉnh
 */
@WebServlet(urlPatterns = "/annotation")
public class AnnotationServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String name = req.getParameter("name");
        PrintWriter writer = resp.getWriter();
        writer.write("[AnnotationServlet] welcome " + name);
        writer.flush();
        writer.close();
    }
}
```

Phía trên là một ví dụ đơn giản về Servlet kiểm tra, nhận tham số yêu cầu `name`, và trả về `welcome xxx`. Để annotation trên có hiệu lực, cần cấu hình trong lớp khởi chạy như sau:

```java
@ServletComponentScan
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class);
    }
}
```

Sau đó, khởi động kiểm tra, kết quả như sau:

```bash
➜  ~ curl http://localhost:8080/annotation\?name\=hung
# Kết quả đầu ra
[AnnotationServlet] welcome hung%
```

### 2. ServletRegistrationBean

Trong quá trình đăng ký Filter, chúng ta biết có một cách là định nghĩa một Bean Spring `FilterRegistrationBean` để đóng gói Filter tùy chỉnh của chúng ta, từ đó cho phép Spring Container quản lý Filter của chúng ta. Tương tự, trong Servlet, cũng có một bean đóng gói tương tự: `ServletRegistrationBean`.

Đầu tiên, định nghĩa bean tùy chỉnh như sau, lưu ý rằng lớp không có annotation:

```java
public class RegisterBeanServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String name = req.getParameter("name");
        PrintWriter writer = resp.getWriter();
        writer.write("[RegisterBeanServlet] welcome " + name);
        writer.flush();
        writer.close();
    }
}
```

Tiếp theo, chúng ta cần định nghĩa một `ServletRegistrationBean` để nó giữ một thể hiện của `RegisterBeanServlet`:

```java
@Bean
public ServletRegistrationBean servletBean() {
    ServletRegistrationBean registrationBean = new ServletRegistrationBean();
    registrationBean.addUrlMappings("/register");
    registrationBean.setServlet(new RegisterBeanServlet());
    return registrationBean;
}
```

Kết quả khi thử nghiệm request như sau:

```bash
➜  ~ curl 'http://localhost:8080/register?name=hung'
# Kết quả đầu ra
[RegisterBeanServlet] welcome hung%
```

### 3. ServletContext

Phương pháp này, trong thực tế, không được sử dụng quá nhiều trong việc đăng ký Servlet, ý tưởng chính là sau khi ServletContext được khởi tạo, sử dụng phương thức `javax.servlet.ServletContext#addServlet(java.lang.String, java.lang.Class<? extends javax.servlet.Servlet>)` để thêm một Servlet một cách tự động.

Vì vậy, chúng ta cần tìm một thời điểm thích hợp, nhận một thể hiện của `ServletContext`, và đăng ký Servlet. Trong sinh động của Spring Boot, có thể sử dụng `ServletContextInitializer`.

> ServletContextInitializer chủ yếu được RegistrationBean thực hiện để đăng ký Servlet, Filter hoặc EventListener vào bên trong container ServletContext. Thiết kế của những ServletContextInitializer này chủ yếu là để quản lý các thực thể này bởi Spring IoC container.

Dưới đây là một ví dụ về cách thực hiện:

```java
public class ContextServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String name = req.getParameter("name");
        PrintWriter writer = resp.getWriter();
        writer.write("[ContextServlet] welcome " + name);
        writer.flush();
        writer.close();
    }
}

@Component
public class SelfServletConfig implements ServletContextInitializer {
    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        ServletRegistration initServlet = servletContext.addServlet("contextServlet", ContextServlet.class);
        initServlet.addMapping("/context");
    }
}
```

Kết quả kiểm tra như sau:

```bash
➜  ~ curl 'http://localhost:8080/context?name=hung'
# Kết quả đầu ra
[ContextServlet] welcome hung%
```

### 4. Bean

Phương pháp đăng ký này không được sạch sẽ, nhưng cũng có thể đạt được mục đích đăng ký Servlet, nhưng cần cẩn thận vì có một số điểm cần lưu ý.

Nhìn vào bài viết [WEB三大组件之Filter在技术派中的应用（已完成）](https://www.yuque.com/itwanger/az7yww/tlxgqguw9ocxkhs5), có thể nhớ được rằng có thể thêm annotation `@Component` trực tiếp trên Filter, khi Spring Container quét các Bean, nó sẽ tìm tất cả các lớp con của Filter và tự động đóng gói chúng vào `FilterRegistrationBean`, từ đó thực hiện việc đăng ký.

Vậy liệu Servlet của chúng ta có thể làm điều này không? Chúng ta sẽ thử nghiệm:

```java
@Component
public class BeanServlet1 extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String name = req.getParameter("name");
        PrintWriter writer = resp.getWriter();
        writer.write("[BeanServlet1] welcome " + name);
        writer.flush();
        writer.close();
    }
}
```

Bây giờ vấn đề đặt ra là, Servlet trên không có quy tắc ánh xạ URL, làm thế nào để gửi yêu cầu cho nó? Để xác định xem Servlet trên đã được đăng ký hay không, dựa trên một số liên kết quan trọng trong mã nguồn của Filter đã được tìm thấy, chúng ta tìm thấy nơi đăng ký thực tế `ServletContextInitializerBeans#addAsRegistrationBean`:

```java
// org.springframework.boot.web.servlet.ServletContextInitializerBeans#addAsRegistrationBean(org.springframework.beans.factory.ListableBeanFactory, java.lang.Class<T>, java.lang.Class<B>, org.springframework.boot.web.servlet.ServletContextInitializerBeans.RegistrationBeanAdapter<T>)

@Override
public RegistrationBean createRegistrationBean(String name, Servlet source, int totalNumberOfSourceBeans) {
    String url = (totalNumberOfSourceBeans != 1) ? "/" + name + "/" : "/";
    if (name.equals(DISPATCHER_SERVLET_NAME)) {
        url = "/"; // always map the main dispatcherServlet to "/"
    }
    ServletRegistrationBean<Servlet> bean = new ServletRegistrationBean<>(source, url);
    bean.setName(name);
    bean.setMultipartConfig(this.multipartConfig);
    return bean;
}
```

Từ mã nguồn trên, có thể thấy rằng URL của Servlet này có thể là `/`, hoặc là `/beanName/`.

Tiếp theo, chúng ta sẽ thử nghiệm:

```bash
➜  ~ curl 'http://localhost:8080/?name=yihuihui'
{"timestamp":"2019-11-22T00:52:00.448+0000","status":404,"error":"Not Found","message":"No message available","path":"/"}%

➜  ~ curl 'http://localhost:8080/beanServlet1?name=yihuihui'
{"timestamp":"2019-11-22T00:52:07.962+0000","status":404,"error":"Not Found","message":"No message available","path":"/beanServlet1"}%                                          

➜  ~ curl 'http://localhost:8080/beanServlet1/?name=yihuihui'
{"timestamp":"2019-11-22T00:52:11.202+0000","status":404,"error":"Not Found","message":"No message available","path":"/beanServlet1/"}%
```

Sau đó, khi chúng ta định nghĩa một Servlet khác:

```java
@Component
public class BeanServlet2 extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String name = req.getParameter("name");
        PrintWriter writer = resp.getWriter();
        writer.write("[BeanServlet2] welcome " + name);
        writer.flush();
        writer.close();
    }
}
```

Thử nghiệm lại:

```bash
➜  ~ curl 'http://localhost:8080/beanServlet1?name=yihuihui'
{"timestamp":"2019-11-22T00:54:12.692+0000","status":404,"error":"Not Found","message":"No message available","path":"/beanServlet1"}%                                          

➜  ~ curl 'http://localhost:8080/beanServlet1/?name=yihuihui'
[BeanServlet1] welcome yihuihui%                                                                                                                                                

➜  ~ curl 'http://localhost:8080/beanServlet2/?name=yihuihui'
[BeanServlet2] welcome yihuihui%
```

Từ kết quả thực nghiệm, có thể thấy rằng khi sử dụng phương pháp này để đăng ký Servlet, URL của Servlet sẽ là `beanName + '/'`.

**Lưu ý:**  
Một vấn đề cần lưu ý là khi chỉ định một Servlet, dựa trên phân tích mã nguồn trước đó, Servlet này sẽ phản hồi yêu cầu `http://localhost:8080/`, nhưng tại sao lại là 404? Vấn đề chính là ưu tiên của Servlet, Servlet được đăng ký theo cách này có ưu tiên thấp hơn ưu tiên của Servlet Spring Web, yêu cầu cùng URL được gửi trước sẽ được chia cho Servlet của Spring, để kiểm chứng điều này, chỉ cần hai bước:

- Comment `@Component` trên lớp `BeanServlet2`.
- Thêm annotation `@Order(-10000)` trên lớp `BeanServlet1`.

Sau đó, thử nghiệm lại, kết quả như sau:

```bash
➜  ~ curl 'http://localhost:8080/?name=yihuihui'
[BeanServlet1] welcome yihuihui%

➜  ~ curl 'http://localhost:8080?name=yihuihui'
[BeanServlet1] welcome yihuihui%
```

## Tổng kết

**Mã nguồn ví dụ**

- Dự án: [https://github.com/liuyueyi/spring-boot-demo](https://github.com/liuyueyi/spring-boot-demo)
- Thư mục: [https://github.com/liuyueyi/spring-boot-demo/tree/master/spring-boot/211-web-servlet](https://github.com/liuyueyi/spring-boot-demo/tree/master/spring-boot/211-web-servlet)

**Bốn cách đăng ký**

Ở đây, chúng ta đã giới thiệu bốn cách để đăng ký Servlet:

Hai cách đăng ký phổ biến:

- Đặt annotation `@WebServlet` trên lớp Servlet, sau đó đặt `@ServletComponentScan` trên lớp khởi chạy, đảm bảo rằng các annotation Servlet3+ có thể được nhận diện bởi Spring.
- Chuyển giao thực thể Servlet tùy chỉnh cho bean `ServletRegistrationBean`.

Hai cách đăng ký không phổ biến:

- Triển khai interface `ServletContextInitializer`, đăng ký Servlet tùy chỉnh thông qua `ServletContext.addServlet`.
- Đăng ký Servlet trực tiếp như một bean thông thường cho Spring.
   - Khi dự án chỉ có một Servlet kiểu này, nó sẽ phản hồi URL: '/', nhưng lưu ý rằng khi không chỉ định ưu tiên, trong tình huống mặc định, ưu tiên của Servlet của Spring cao hơn, vì vậy nó sẽ không nhận được yêu cầu.
   - Khi dự án có nhiều Servlet kiểu này, URL tương ứng sẽ là `beanName + '/'`, lưu ý rằng '/' ở phía sau là bắt buộc.
