---
title: Spring Events
tags: [spring, java, backend]
categories: [spring, java, backend]
date created: 2023-07-26
date modified: 2023-07-26
---

# Sự kiện Spring

## Mô hình lập trình sự kiện/nghe sự kiện Java

Mô hình thiết kế - Mô hình quan sát mở rộng

- Đối tượng có thể quan sát được (người gửi thông điệp) - java.util.Observable
- Người quan sát - java.util.Observer

Giao diện chuẩn hóa

- Đối tượng sự kiện - java.util.EventObject
- Người nghe sự kiện - java.util.EventListener

## Mô hình lập trình sự kiện/nghe sự kiện dựa trên giao diện

Ví dụ về cảnh báo/sự kiện

| Công nghệ Java | Giao diện sự kiện                   | Giao diện nghe sự kiện                    |
| -------------- | ---------------------------------- | ---------------------------------------- |
| JavaBeans      | java.beans.PropertyChangeEvent     | java.beans.PropertyChangeListener        |
| Java AWT       | java.awt.event.MouseEvent          | java.awt.event.MouseListener             |
| Java Swing     | javax.swing.event.MenuEvent        | javax.swing.event.MenuListener           |
| Java Preference| java.util.prefs.PreferenceChangeEvent | java.util.prefs.PreferenceChangeListener |

## Mô hình lập trình sự kiện/nghe sự kiện dựa trên chú thích

Ví dụ về chú thích sự kiện/nghe sự kiện

| Công nghệ Java | Chú thích sự kiện                  | Chú thích nghe sự kiện                   |
| -------------- | --------------------------------- | --------------------------------------- |
| Servlet 3.0+   |                                   | @javax.servlet.annotation.WebListener  |
| JPA 1.0+       | @javax.persistence.PostPersist    |                                         |
| Java Common    | @PostConstruct                    |                                         |
| EJB 3.0+       | @javax.ejb.PrePassivate           |                                         |
| JSF 2.0+       | @javax.faces.event.ListenerFor    |                                         |

## Sự kiện tiêu chuẩn của Spring - ApplicationEvent

Mở rộng từ sự kiện tiêu chuẩn Java `java.util.EventObject`

- Tính năng mở rộng: thời gian xảy ra sự kiện
- Mở rộng từ sự kiện ứng dụng Spring - `ApplicationContextEvent`
- Ứng dụng Spring Context (ApplicationContext) là nguồn sự kiện

Các lớp cụ thể:

- `org.springframework.context.event.ContextClosedEvent`
- `org.springframework.context.event.ContextRefreshedEvent`
- `org.springframework.context.event.ContextStartedEvent`
- `org.springframework.context.event.ContextStoppedEvent`

## Nghe sự kiện Spring dựa trên giao diện

Mở rộng từ giao diện sự kiện tiêu chuẩn Java `java.util.EventListener`

- Giao diện mở rộng - `org.springframework.context.ApplicationListener`
- Đặc điểm thiết kế: xử lý sự kiện duy nhất của một loại
- Phương thức xử lý: `onApplicationEvent(ApplicationEvent)`
- Loại sự kiện: `org.springframework.context.ApplicationEvent`

## Nghe sự kiện Spring dựa trên chú thích

Chú thích Spring - `@org.springframework.context.event.EventListener`

| Tính năng            | Mô tả                                         |
| -------------------- | --------------------------------------------- |
| Đặc điểm thiết kế    | Hỗ trợ nhiều loại `ApplicationEvent` không cần ràng buộc giao diện |
| Mục tiêu chú thích   | Phương thức                                    |
| Hỗ trợ thực thi bất đồng bộ | Có hỗ trợ                                    |
| Hỗ trợ sự kiện kiểu thông qua tham số kiểu | Có hỗ trợ                                    |
| Hỗ trợ điều khiển thứ tự | Có hỗ trợ, kết hợp với chú thích `@Order`       |

## Đăng ký ApplicationListener của Spring

- Phương pháp 1: Đăng ký ApplicationListener như một Spring Bean
- Phương pháp 2: Đăng ký thông qua API ConfigurableApplicationContext

## Trình phát sự kiện Spring

- Phương pháp 1: Phát sự kiện Spring thông qua ApplicationEventPublisher
  - Lấy ApplicationEventPublisher
    - Dependency Injection (Tiêm phụ thuộc)
- Phương pháp 2: Phát sự kiện Spring thông qua ApplicationEventMulticaster
  - Lấy ApplicationEventMulticaster
    - Dependency Injection (Tiêm phụ thuộc)
    - Dependency Lookup (Tìm kiếm phụ thuộc)

## Lan truyền sự kiện theo cấp bậc trong Spring

- Giải thích về lan truyền sự kiện
- Khi ứng dụng Spring có nhiều ApplicationContext cấp bậc (ApplicationContext con) như trong kịch bản Spring WebMVC, Spring Boot hoặc Spring Cloud, quá trình phát sự kiện Spring từ ApplicationContext con có thể lan truyền đến ApplicationContext cha (cho đến ApplicationContext gốc).
- Cách tránh
- Xác định nguồn sự kiện Spring (ApplicationContext) để lọc và xử lý.

## Sự kiện tích hợp sẵn trong Spring

Sự kiện được kế thừa từ ApplicationContextEvent

- ContextRefreshedEvent: Sự kiện ứng dụng Spring đã sẵn sàng
- ContextStartedEvent: Sự kiện ứng dụng Spring đã khởi động
- ContextStoppedEvent: Sự kiện ứng dụng Spring đã dừng
- ContextClosedEvent: Sự kiện ứng dụng Spring đã đóng

## Sự kiện Payload trong Spring 4.2

Sự kiện Payload trong Spring - org.springframework.context.PayloadApplicationEvent

- Sử dụng trong trường hợp đơn giản hóa việc gửi sự kiện Spring, tập trung vào đối tượng nguồn sự kiện
- Phương thức gửi: ApplicationEventPublisher#publishEvent(java.lang.Object)

## Tạo sự kiện tùy chỉnh trong Spring

- Mở rộng org.springframework.context.ApplicationEvent
- Triển khai org.springframework.context.ApplicationListener
- Đăng ký org.springframework.context.ApplicationListener

## Tiêm phụ thuộc ApplicationEventPublisher

- Sử dụng giao diện ApplicationEventPublisherAware
- Sử dụng @Autowired ApplicationEventPublisher

## Tìm kiếm phụ thuộc ApplicationEventMulticaster

Điều kiện tìm kiếm

- Tên Bean: "applicationEventMulticaster"
- Kiểu Bean: org.springframework.context.event.ApplicationEventMulticaster

## Triển khai ApplicationEventPublisher

- Giao diện: org.springframework.context.event.ApplicationEventMulticaster
- Lớp trừu tượng: org.springframework.context.event.AbstractApplicationEventMulticaster
- Lớp triển khai: org.springframework.context.event.SimpleApplicationEventMulticaster

## Phát sự kiện Spring đồng bộ và bất đồng bộ

Dựa trên lớp triển khai - `org.springframework.context.event.SimpleApplicationEventMulticaster`

- Chế độ chuyển đổi: Phương thức `setTaskExecutor(java.util.concurrent.Executor)`
  - Chế độ mặc định: Đồng bộ
  - Chế độ bất đồng bộ: Sử dụng `java.util.concurrent.ThreadPoolExecutor` hoặc tương tự
- Thiếu sót thiết kế: Không tuân thủ giao diện hợp đồng

Dựa trên chú thích - `@org.springframework.context.event.EventListener`

- Chế độ chuyển đổi
  - Chế độ mặc định: Đồng bộ
  - Chế độ bất đồng bộ: Đánh dấu `@org.springframework.scheduling.annotation.Async`
- Hạn chế triển khai: Không thể chuyển đổi đồng bộ/bất đồng bộ một cách linh hoạt

## Xử lý ngoại lệ sự kiện Spring 4.1

Giao diện xử lý lỗi Spring 3.0 - org.springframework.util.ErrorHandler

Sử dụng trong trường hợp

- Sự kiện Spring (Events)
  - SimpleApplicationEventMulticaster hỗ trợ từ Spring 4.1 trở đi
- Lập lịch cục bộ Spring (Scheduling)
  - org.springframework.scheduling.concurrent.ConcurrentTaskScheduler
  - org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler

## Cơ chế triển khai sự kiện/nghe sự kiện trong Spring

Lớp cốt lõi - `org.springframework.context.event.SimpleApplicationEventMulticaster`

- Mô hình thiết kế: Mở rộng mô hình quan sát
  - Đối tượng quan sát - org.springframework.context.ApplicationListener
    - Thêm thông qua API
    - Tìm kiếm phụ thuộc
  - Đối tượng thông báo - org.springframework.context.ApplicationEvent
- Chế độ thực thi: Đồng bộ/ Bất đồng bộ
- Xử lý ngoại lệ: org.springframework.util.ErrorHandler
- Xử lý kiểu chung: org.springframework.core.ResolvableType

## Câu hỏi

**Sự kiện trong Spring Boot**

| Loại sự kiện                            | Khi nào sự kiện xảy ra                                |
| ----------------------------------- | ------------------------------------------------------- |
| ApplicationStartingEvent            | Khi ứng dụng Spring Boot đã bắt đầu                     |
| ApplicationStartedEvent             | Khi ứng dụng Spring Boot đã bắt đầu                     |
| ApplicationEnvironmentPreparedEvent | Khi môi trường của Spring Boot đã được chuẩn bị         |
| ApplicationPreparedEvent            | Khi ứng dụng Spring Boot đã được chuẩn bị               |
| ApplicationReadyEvent               | Khi ứng dụng Spring Boot đã sẵn sàng                     |
| ApplicationFailedEvent              | Khi ứng dụng Spring Boot không khởi động thành công       |

**Sự kiện trong Spring Cloud**

| Loại sự kiện                   | Khi nào sự kiện xảy ra                                |
| -------------------------- | ------------------------------------------------------- |
| EnvironmentChangeEvent     | Khi thuộc tính cấu hình của môi trường thay đổi           |
| HeartbeatEvent             | Khi client DiscoveryClient gửi heartbeat             |
| InstancePreRegisteredEvent | Khi trước khi đăng ký instance                      |
| InstanceRegisteredEvent    | Khi sau khi đăng ký instance                       |
| RefreshEvent               | Khi RefreshEndpoint được gọi                       |
| RefreshScopeRefreshedEvent | Khi Refresh Scope Bean được làm mới                 |

**Giao diện/Thành phần cốt lõi của Spring Event**?

- Sự kiện Spring - org.springframework.context.ApplicationEvent
- Nghe sự kiện Spring - org.springframework.context.ApplicationListener
- Trình phát sự kiện Spring - org.springframework.context.ApplicationEventPublisher
- Trình phát sự kiện đa kênh Spring - org.springframework.context.event.ApplicationEventMulticaster

**Trường hợp sử dụng xử lý sự kiện đồng bộ và bất đồng bộ trong Spring**?

- Sự kiện đồng bộ Spring - Đa số các trường hợp sử dụng Spring, ví dụ như ContextRefreshedEvent
- Sự kiện bất đồng bộ Spring - Chủ yếu sử dụng @EventListener với @Async, để xử lý bất đồng bộ, không chặn luồng chính, ví dụ như nhiệm vụ tính toán dữ liệu lâu dài. Không nên thay đổi đối tượng taskExecutor liên quan trong SimpleApplicationEventMulticaster trừ khi người sử dụng hiểu rõ cơ chế sự kiện Spring, nếu không có thể gây ra hành vi bất thường.
