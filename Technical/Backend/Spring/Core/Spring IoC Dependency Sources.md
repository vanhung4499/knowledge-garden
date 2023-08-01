---
title: Spring IoC Dependency Sources
tags: [spring, java, backend, ioc]
categories: [spring, java, backend]
date created: 2023-07-26
date modified: 2023-07-26
---

# Nguồn phụ thuộc của Spring IoC

## Nguồn của việc tìm kiếm phụ thuộc

Nguồn tìm kiếm

| Nguồn                 | Dữ liệu cấu hình                           |
| --------------------- | ------------------------------------------ |
| Spring BeanDefinition | `<bean id ="user" class="xxx.xxx.User">`   |
|                       | `@Bean public User user() {…}`           |
|                       | `BeanDefinitionBuilder`                    |
| Đối tượng Singleton    | Implement API                              |

BeanDefinition tích hợp sẵn trong Spring

| Tên Bean                                                                       | Thể hiện Bean                            | Sử dụng trong                               |
| ------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------- |
| org.springframework.context.annotation.internalConfigurationAnnotationProcessor | Đối tượng ConfigurationClassPostProcessor | Xử lý các lớp cấu hình Spring                 |
| org.springframework.context.annotation.internalAutowiredAnnotationProcessor     | Đối tượng AutowiredAnnotationBeanPostProcessor | Xử lý chú thích @Autowired và @Value            |
| org.springframework.context.annotation.internalCommonAnnotationProcessor        | Đối tượng CommonAnnotationBeanPostProcessor | (Kích hoạt điều kiện) Xử lý chú thích JSR-250, như @PostConstruct |
| org.springframework.context.event.internalEventListenerProcessor                | Đối tượng EventListenerMethodProcessor     | Xử lý các phương thức lắng nghe sự kiện Spring được đánh dấu bằng @EventListener |

Đối tượng Singleton tích hợp sẵn trong Spring

| Tên Bean                   | Thể hiện Bean                  | Sử dụng trong               |
| --------------------------- | ------------------------------ | -------------------------- |
| environment                 | Đối tượng Environment          | Cấu hình bên ngoài và Profiles |
| systemProperties            | Đối tượng java.util.Properties | Thuộc tính hệ thống Java    |
| systemEnvironment           | Đối tượng java.util.Map        | Biến môi trường hệ thống    |
| messageSource               | Đối tượng MessageSource        | Văn bản đa ngôn ngữ         |
| lifecycleProcessor          | Đối tượng LifecycleProcessor   | Xử lý Bean Lifecycle        |
| applicationEventMulticaster | Đối tượng ApplicationEventMulticaster | Truyền phát sự kiện Spring |

## Nguồn của việc tiêm phụ thuộc

| Nguồn                 | Dữ liệu cấu hình                           |
| ---------------------- | ---------------------------------------- |
| Spring BeanDefinition | `<bean id ="user" class="xxx.xxx.User">` |
|                       | `@Bean public User user() {…}`         |
|                       | `BeanDefinitionBuilder`                  |
| Đối tượng Singleton    | Implement API                            |
| Đối tượng không quản lý bởi Spring |                                          |

## Quản lý đối tượng bởi Spring và đối tượng không quản lý bởi Spring

| Nguồn                  | Đối tượng Spring Bean | Quản lý vòng đời | Thông tin cấu hình | Sử dụng trong         |
| --------------------- | --------------------- | --------------- | ----------------- | ---------------------- |
| Spring BeanDefinition | Có                    | Có              | Có                | Tìm kiếm phụ thuộc, tiêm phụ thuộc |
| Đối tượng Singleton    | Có                    | Không           | Không             | Tìm kiếm phụ thuộc, tiêm phụ thuộc |
| Resolvable Dependency | Không                 | Không           | Không             | Tiêm phụ thuộc         |

## BeanDefinition của Spring là nguồn phụ thuộc

- Dữ liệu: BeanDefinition
- Đăng ký: `BeanDefinitionRegistry#registerBeanDefinition`
- Loại: Trì hoãn và không trì hoãn
- Thứ tự: Thứ tự vòng đời Bean theo thứ tự đăng ký

## Đối tượng Singleton là nguồn phụ thuộc

- Yếu tố
  - Nguồn: Đối tượng Java thông thường từ bên ngoài (không nhất thiết phải là POJO)
  - Đăng ký: `SingletonBeanRegistry#registerSingleton`
- Giới hạn
  - Không quản lý vòng đời
  - Không thể triển khai việc khởi tạo đối tượng trì hoãn

## Đối tượng không quản lý bởi Spring là nguồn phụ thuộc

- Yếu tố
  - Đăng ký: `ConfigurableListableBeanFactory#registerResolvableDependency`
- Giới hạn
  - Không quản lý vòng đời
  - Không thể triển khai việc khởi tạo đối tượng trì hoãn
  - Không thể tìm kiếm phụ thuộc

## Cấu hình bên ngoài là nguồn phụ thuộc

- Yếu tố
  - Loại: Nguồn phụ thuộc đối tượng Spring không thông thường
- Giới hạn
  - Không quản lý vòng đời
  - Không thể triển khai việc khởi tạo đối tượng trì hoãn
  - Không thể tìm kiếm phụ thuộc

## Câu hỏi

Nguồn phụ thuộc của việc tiêm và tìm kiếm có giống nhau không?

Không, nguồn phụ thuộc của việc tìm kiếm chỉ giới hạn trong `BeanDefinition` của Spring và đối tượng Singleton, trong khi nguồn phụ thuộc của việc tiêm còn bao gồm Resolvable Dependency và cấu hình bên ngoài được đánh dấu bằng `@Value`.

Có thể đăng ký đối tượng Singleton sau khi bắt đầu Spring IoC container không?

Có thể, việc đăng ký đối tượng Singleton khác với `BeanDefinition`, `BeanDefinition` sẽ bị ảnh hưởng bởi phương thức `ConfigurableListableBeanFactory#freezeConfiguration()`, trong khi đối tượng Singleton không bị giới hạn này.

Nguồn phụ thuộc của việc tiêm phụ thuộc trong Spring bao gồm những gì?

- Spring `BeanDefinition`
- Đối tượng Singleton
- Resolvable Dependency
- Cấu hình bên ngoài được đánh dấu bằng `@Value`
