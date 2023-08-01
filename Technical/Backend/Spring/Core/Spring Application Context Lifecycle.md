---
title: Spring Application Context Lifecycle
tags: [spring, java, backend]
categories: [spring, java, backend]
date created: 2023-07-26
date modified: 2023-07-26
---

# Vòng đời của Spring Application Context

## Chuẩn bị giai đoạn khởi động của Spring Application Context

Phương thức AbstractApplicationContext#prepareRefresh()

- Thời gian khởi động - startupDate
- Trạng thái - closed(false), active(true)
- Khởi tạo PropertySources - initPropertySources()
- Kiểm tra các thuộc tính bắt buộc trong Environment
- Khởi tạo bộ lắng nghe sự kiện
- Khởi tạo tập hợp sự kiện Spring sớm

## Giai đoạn tạo BeanFactory

Phương thức AbstractApplicationContext#obtainFreshBeanFactory()

- Làm mới BeanFactory của Spring Application Context - refreshBeanFactory()
  - Hủy hoặc đóng BeanFactory nếu đã tồn tại
  - Tạo BeanFactory - createBeanFactory()
  - Thiết lập Id của BeanFactory
  - Thiết lập "Cho phép định nghĩa BeanDefinition trùng lặp" - customizeBeanFactory(DefaultListableBeanFactory)
  - Thiết lập "Cho phép tham chiếu vòng (phụ thuộc)" - customizeBeanFactory(DefaultListableBeanFactory)
  - Tải BeanDefinition - loadBeanDefinitions(DefaultListableBeanFactory) phương thức
  - Liên kết BeanFactory mới với Spring Application Context
- Trả về BeanFactory của Spring Application Context - getBeanFactory()

## Giai đoạn chuẩn bị BeanFactory

Phương thức AbstractApplicationContext#prepareBeanFactory(ConfigurableListableBeanFactory)

- Liên kết ClassLoader
- Thiết lập trình xử lý biểu thức Bean
- Thêm PropertyEditorRegistrar - ResourceEditorRegistrar
- Thêm ApplicationContextAwareProcessor - triển khai Aware callback interface BeanPostProcessor
- Bỏ qua Aware callback interface như là giao diện phụ thuộc
- Đăng ký ResolvableDependency - BeanFactory, ResourceLoader, ApplicationEventPublisher và ApplicationContext
- Đăng ký ApplicationListenerDetector
- Đăng ký LoadTimeWeaverAwareProcessor
- Đăng ký đối tượng Singleton - Environment, Java System Properties và biến môi trường OS

## Giai đoạn xử lý sau BeanFactory

- Phương thức AbstractApplicationContext#postProcessBeanFactory(ConfigurableListableBeanFactory)
  - Được ghi đè bởi lớp con
- Phương thức AbstractApplicationContext#invokeBeanFactoryPostProcessors(ConfigurableListableBeanFactory)
  - Gọi các phương thức xử lý sau BeanFactoryPostProcessor hoặc BeanDefinitionRegistry
  - Đăng ký LoadTimeWeaverAwareProcessor

## Giai đoạn đăng ký BeanPostProcessor của BeanFactory

Phương thức AbstractApplicationContext#registerBeanPostProcessors(ConfigurableListableBeanFactory)

- Đăng ký các BeanPostProcessor có thứ tự ưu tiên (PriorityOrdered)
- Đăng ký các BeanPostProcessor có thứ tự (Ordered)
- Đăng ký các BeanPostProcessor thông thường
- Đăng ký MergedBeanDefinitionPostProcessor
- Đăng ký ApplicationListenerDetector

## Khởi tạo Bean tích hợp sẵn: MessageSource

Phương thức AbstractApplicationContext#initMessageSource()

## Khởi tạo Bean tích hợp sẵn: Trình phát sóng sự kiện Spring

Phương thức AbstractApplicationContext#initApplicationEventMulticaster()

## Giai đoạn làm mới Spring Application Context

Phương thức AbstractApplicationContext#onRefresh()

Được ghi đè bởi các lớp con

- org.springframework.web.context.support.AbstractRefreshableWebApplicationContext#onRefresh()
- org.springframework.web.context.support.GenericWebApplicationContext#onRefresh()
- org.springframework.boot.web.reactive.context.ReactiveWebServerApplicationContext#onRefresh()
- org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext#onRefresh()
- org.springframework.web.context.support.StaticWebApplicationContext#onRefresh()

## Giai đoạn đăng ký trình lắng nghe sự kiện Spring

Phương thức AbstractApplicationContext#registerListeners()

- Thêm các đối tượng ApplicationListener liên quan đến ngữ cảnh ứng dụng hiện tại (tập hợp)
- Thêm các Bean ApplicationListener đã đăng ký trong BeanFactory
- Phát sóng sự kiện Spring sớm

## Giai đoạn hoàn thành việc khởi tạo BeanFactory

Phương thức AbstractApplicationContext#finishBeanFactoryInitialization(ConfigurableListableBeanFactory)

- Liên kết BeanFactory với Bean ConversionService, nếu có
- Thêm đối tượng StringValueResolver
- Tìm kiếm Bean LoadTimeWeaverAware phụ thuộc
- Đặt ClassLoader tạm thời của BeanFactory thành null
- Đóng băng cấu hình BeanFactory
- Khởi tạo các Bean không trễ đơn lẻ

## Giai đoạn hoàn thành việc làm mới Spring Application Context

Phương thức AbstractApplicationContext#finishRefresh()

- Xóa bộ nhớ cache của ResourceLoader - clearResourceCaches() @since 5.0
- Khởi tạo đối tượng LifecycleProcessor - initLifecycleProcessor()
- Gọi phương thức LifecycleProcessor#onRefresh()
- Phát sóng sự kiện ứng dụng ngữ cảnh Spring đã được làm mới - ContextRefreshedEvent
- Quản lý các Bean sống trên MBeanServer

## Giai đoạn khởi động Spring Application Context

Phương thức AbstractApplicationContext#start()

- Khởi động LifecycleProcessor
  - Tìm kiếm các Bean Lifecycle
  - Khởi động các Bean Lifecycle
- Phát sóng sự kiện ứng dụng ngữ cảnh Spring đã được khởi động - ContextStartedEvent

## Giai đoạn dừng của Spring Application Context

Phương thức AbstractApplicationContext#stop()

- Dừng LifecycleProcessor
  - Tìm kiếm các Bean Lifecycle
  - Dừng các Bean Lifecycle
- Phát sóng sự kiện ứng dụng ngữ cảnh Spring đã dừng - ContextStoppedEvent

## Giai đoạn đóng của Spring Application Context

Phương thức AbstractApplicationContext#close()

- Trạng thái - active(false), closed(true)
- Hủy bỏ việc quản lý Live Beans trên JMX
  - LiveBeansView.unregisterApplicationContext(ConfigurableApplicationContext)
- Phát sóng sự kiện ứng dụng ngữ cảnh Spring đã đóng - ContextClosedEvent
- Dừng LifecycleProcessor
  - Tìm kiếm các Bean Lifecycle
  - Dừng các Bean Lifecycle
- Hủy bỏ các Spring Beans
- Đóng BeanFactory
- Gọi onClose()
- Đăng ký luồng Shutdown Hook (nếu đã đăng ký)

## Câu hỏi

**Có những giai đoạn nào trong vòng đời của Spring Application Context?**

- Giai đoạn làm mới - ConfigurableApplicationContext#refresh()
- Giai đoạn khởi động - ConfigurableApplicationContext#start()
- Giai đoạn dừng - ConfigurableApplicationContext#stop()
- Giai đoạn đóng - ConfigurableApplicationContext#close()
