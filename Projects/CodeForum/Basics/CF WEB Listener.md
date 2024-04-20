---
title: CF WEB Listener
tags:
  - project
  - codeforum
categories: 
date created: 2024-04-17
date modified: 2024-04-17
---

# WEB Listener

Trong dự án hiện tại, chúng tôi chủ yếu sử dụng web listener để thực hiện thống kê số người trực tuyến trực tiếp, tuy nhiên, giải pháp thống kê này hiện chỉ phù hợp với các trường hợp đơn máy chủ, chủ yếu là để mọi người xem một ví dụ về cách sử dụng web listener. Trong bài hướng dẫn này, chúng ta sẽ tập trung vào các điểm liên quan đến listener.

### Ví dụ sử dụng

Mã nguồn: `com.hnv99.forum.web.hook.listener.OnlineUserCountListener`

Về cách thức thống kê số người trực tuyến trong Listener trên, xem chi tiết trong bài hướng dẫn sau: [[CF Count Online User]]

## JavaWeb Listener

### Các điểm cơ bản

Trong môi trường WEB, Listener chủ yếu chia thành ba loại chính (chủ yếu là nghe ba đối tượng miền):

**Listener cho việc tạo và hủy ba đối tượng miền:**

- ServletContextListener
   - Tạo ServletContext khi máy chủ khởi động
   - Loại bỏ ServletContext khi máy chủ tắt
- HttpSessionListener (Đây chính là Listener chủ yếu được sử dụng trong cộng đồng kỹ thuật)
   - Tạo và loại bỏ phiên HttpSession
- ServletRequestListener
   - Tạo và hủy ServletRequset của yêu cầu web

**Listener cho việc thay đổi thuộc tính của ba đối tượng miền (thêm, loại bỏ, thay thế thuộc tính):**

- ServletContextAttributeListener
- HttpSessionAttributeListener
- ServletRequestAttributeListener

**Listener cho việc thay đổi trạng thái của JavaBean trong HttpSession (ràng buộc, hủy ràng buộc, bất hoạt, kích hoạt):**

- HttpSessionBindingListener
- HttpSessionActivationListener

### Ví dụ sử dụng

Việc sử dụng cụ thể khá đơn giản, chủ yếu là triển khai các giao diện trên và thêm logic kinh doanh thực tế vào các phương thức kích hoạt tương ứng.

#### 1. Annotation WebListener

Annotation `@WebListener` là một annotation được cung cấp bởi Servlet3+, có thể đánh dấu một lớp là Listener. Cách sử dụng không khác biệt nhiều so với Listener và Filter trước đó.

```java
@WebListener
public class AnoContextListener implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("@WebListener context initialized");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("@WebListener context destroyed");
    }
}

```

Do annotation WebListener không phải là tiêu chuẩn của Spring, vì vậy để nhận diện nó, bạn cần thêm annotation `@ServletComponentScan` vào lớp khởi chạy.

```java
@ServletComponentScan
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class);
    }
}

```

#### 2. Bean

Cách sử dụng thứ hai là coi Listener như một bean Spring thông thường, Spring Boot sẽ tự động đóng gói nó thành đối tượng `ServletListenerRegistrationBean`.

```java
@Component
public class BeanContextListener implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("Bean context initialized");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("Bean context destroyed");
    }
}

```

#### 3. ServletListenerRegistrationBean

Thay vào đó, bạn có thể sử dụng cấu hình Java để chủ động đặt một đối tượng Listener thông thường vào trong đối tượng `ServletListenerRegistrationBean`, tạo thành một bean Spring

```java
public class ConfigContextListener implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("Config context initialized");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("Config context destroyed");
    }
}

```

Phần quan trọng là tạo bean dưới đây:

```java
@Bean
public ServletListenerRegistrationBean configContextListener() {
    ServletListenerRegistrationBean bean = new ServletListenerRegistrationBean();
    bean.setListener(new ConfigContextListener());
    return bean;
}

```

#### 4. ServletContextInitializer

Ở đây, chúng ta sử dụng ServletContextInitializer để chủ động thêm Listener vào ServletContext khi nó được tạo ra, tạo hiệu ứng đăng ký chủ động.

```java
public class SelfContextListener implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("ServletContextInitializer context initialized");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("ServletContextInitializer context destroyed");
    }
}

@Component
public class ExtendServletConfigInitializer implements ServletContextInitializer {
    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        servletContext.addListener(SelfContextListener.class);
    }
}

```

Lưu ý rằng ExtendServletConfigInitializer được đăng ký chủ động vào thời điểm khởi động, vì vậy ưu tiên của nó sẽ cao nhất.

### Tóm tắt

Kiến thức về người nghe Java web không phức tạp, và trong các cảnh báo thực tế hiện nay, các trường hợp sử dụng thực tế cũng rất ít. Các điểm liên quan đã được giới thiệu có thể được xem là tùy chọn, chỉ cần đọc qua là đủ. Tuy nhiên, trong cộng đồng kỹ thuật, cũng cung cấp một ví dụ thực hành sử dụng HttpSessionListener, thực hiện tính toán số người trực tuyến theo thời gian thực, bạn có thể xem qua nếu quan tâm:

- [[CF Count Online User]]
