---
title: Spring Dependency Lookup
tags: [spring, java, backend]
categories: [spring, java, backend]
date created: 2023-07-26
date modified: 2023-07-26
---

# Tìm kiếm phụ thuộc trong Spring

**Tìm kiếm phụ thuộc là cách tìm kiếm phụ thuộc theo cách chủ động hoặc thủ công, thường cần phụ thuộc vào container hoặc API tiêu chuẩn để thực hiện**.

Tìm kiếm phụ thuộc trong IoC có thể được chia thành các loại sau:

- Tìm kiếm theo tên Bean
- Tìm kiếm theo kiểu Bean
- Tìm kiếm theo tên Bean + kiểu Bean
- Tìm kiếm theo chú thích Java

Ngoài ra, tùy thuộc vào đối tượng Bean được tìm kiếm là đối tượng duy nhất hay tập hợp, và liệu có cần tìm kiếm chậm hay không, có các API khác nhau tương ứng.

## Tìm kiếm theo kiểu đối tượng duy nhất

Giao diện tìm kiếm theo kiểu đối tượng duy nhất - `BeanFactory`

- Tìm kiếm theo tên Bean
  - `getBean(String)`
  - Spring 2.5 ghi đè tham số mặc định: `getBean(String, Object…)`
- Tìm kiếm theo kiểu Bean
  - Tìm kiếm Bean theo thời gian thực
    - Spring 3.0 `getBean(Class)`
    - Spring 4.1 ghi đè tham số mặc định: `getBean(Class, Object…)`
  - Tìm kiếm Bean theo thời gian chậm trong Spring 5.1
    - `getBeanProvider(Class)`
    - `getBeanProvider(ResolvableType)`
- Tìm kiếm theo tên Bean + kiểu Bean: `getBean(String, Class)`

## Tìm kiếm theo kiểu tập hợp đối tượng

Giao diện tìm kiếm theo kiểu tập hợp đối tượng - `ListableBeanFactory`

- Tìm kiếm theo kiểu Bean
  - Lấy danh sách tên Bean cùng kiểu
    - `getBeanNamesForType(Class)`
    - Spring 4.2 ghi đè tham số mặc định: `getBeanNamesForType(ResolvableType)`
  - Lấy danh sách các đối tượng Bean cùng kiểu
    - `getBeansOfType(Class)` và các phương thức tương tự
- Tìm kiếm theo chú thích kiểu
  - Lấy danh sách tên Bean có chú thích kiểu
    - `getBeanNamesForAnnotation(Class<? extends Annotation>)`
  - Lấy danh sách các đối tượng Bean có chú thích kiểu
    - `getBeansWithAnnotation(Class<? extends Annotation>)`
  - Lấy đối tượng chú thích kiểu cụ thể cho Bean có tên cụ thể
    - `findAnnotationOnBean(String, Class<? extends Annotation>)`

## Tìm kiếm theo cấu trúc phụ thuộc

Giao diện tìm kiếm theo cấu trúc phụ thuộc - `HierarchicalBeanFactory`

- BeanFactory cha: `getParentBeanFactory()`
- Tìm kiếm theo cấu trúc
  - Tìm kiếm theo tên Bean
    - Dựa trên phương thức `containsLocalBean`
  - Tìm kiếm danh sách các đối tượng Bean cùng kiểu
    - Kiểu đơn: `BeanFactoryUtils#beanOfType`
    - Kiểu tập hợp: `BeanFactoryUtils#beansOfTypeIncludingAncestors`
  - Tìm kiếm danh sách tên Bean dựa trên chú thích Java
    - `BeanFactoryUtils#beanNamesForTypeIncludingAncestors`

## Tìm kiếm phụ thuộc lười biếng

Giao diện tìm kiếm phụ thuộc lười biếng của Bean

- `org.springframework.beans.factory.ObjectFactory`
- `org.springframework.beans.factory.ObjectProvider` (Mở rộng tính năng Java 8 cho Spring 5)
- Giao diện hàm
  - `getIfAvailable(Supplier)`
  - `ifAvailable(Consumer)`
- Mở rộng Stream - stream()

## Tìm kiếm phụ thuộc an toàn

| Loại tìm kiếm phụ thuộc | Cài đặt đại diện                    | An toàn |
| ---------------------- | ---------------------------------- | ------- |
| Tìm kiếm theo kiểu đơn | `BeanFactory#getBean`              | Không   |
|                        | `ObjectFactory#getObject`          | Không   |
|                        | `ObjectProvider#getIfAvailable`    | Có      |
|                        |                                    |         |
| Tìm kiếm theo kiểu tập  | `ListableBeanFactory#getBeansOfType` | Có      |
|                        | `ObjectProvider#stream`             | Có      |

Lưu ý: Sự an toàn của tìm kiếm phụ thuộc theo cấu trúc phụ thuộc vào giao diện `BeanFactory` mà nó mở rộng, đơn lẻ hoặc tập hợp.

## Phụ thuộc có sẵn được tìm kiếm

Phụ thuộc có sẵn được tìm kiếm trong `AbstractApplicationContext`

| Bean                        | Tên Bean                           | Sử dụng trong mã lệnh |
| --------------------------- | ---------------------------------- | -------------------- |
| environment                 | Đối tượng Environment               | Cấu hình bên ngoài và Profiles |
| systemProperties            | Đối tượng java.util.Properties     | Thuộc tính hệ thống Java |
| systemEnvironment           | Đối tượng java.util.Map            | Biến môi trường hệ điều hành |
| messageSource               | Đối tượng MessageSource             | Văn bản đa ngôn ngữ |
| lifecycleProcessor          | Đối tượng LifecycleProcessor        | Xử lý Bean Lifecycle |
| applicationEventMulticaster | Đối tượng ApplicationEventMulticaster | Truyền tải sự kiện Spring |

Phụ thuộc có sẵn được tìm kiếm trong ApplicationContext dựa trên chú thích (một phần)

| Tên Bean                                                                       | Đối tượng Bean                                   | Sử dụng trong mã lệnh                                         |
| ------------------------------------------------------------------------------ | ------------------------------------------------ | ------------------------------------------------------------ |
| org.springframework.context.annotation.internalConfigurationAnnotationProcessor | Đối tượng ConfigurationClassPostProcessor        | Xử lý các lớp cấu hình Spring                                |
| org.springframework.context.annotation.internalAutowiredAnnotationProcessor     | Đối tượng AutowiredAnnotationBeanPostProcessor   | Xử lý các chú thích @Autowired và @Value                      |
| org.springframework.context.annotation.internalCommonAnnotationProcessor        | Đối tượng CommonAnnotationBeanPostProcessor      | (Kích hoạt điều kiện) Xử lý các chú thích JSR-250 như @PostConstruct |
| org.springframework.context.event.internalEventListenerProcessor                | Đối tượng EventListenerMethodProcessor           | Xử lý các phương thức lắng nghe sự kiện Spring được chú thích bằng @EventListener |
| org.springframework.context.event.internalEventListenerFactory                  | Đối tượng DefaultEventListenerFactory            | Chuyển đổi phương thức lắng nghe sự kiện @EventListener thành ApplicationListener |
| org.springframework.context.annotation.internalPersistenceAnnotationProcessor   | Đối tượng PersistenceAnnotationBeanPostProcessor | (Kích hoạt điều kiện) Xử lý các chú thích JPA                |

## Các ngoại lệ kinh điển trong tìm kiếm phụ thuộc

Các lớp con của `BeansException`

| Loại ngoại lệ                        | Điều kiện kích hoạt (ví dụ)                        | Ví dụ tình huống                               |
| ------------------------------------ | ------------------------------------------------- | ---------------------------------------------- |
| `NoSuchBeanDefinitionException`      | Khi tìm kiếm Bean không tồn tại trong container    | `BeanFactory#getBeanObjectFactory#getObject`    |
| `NoUniqueBeanDefinitionException`    | Khi tìm kiếm theo kiểu Bean, container có nhiều hơn | `BeanFactory#getBean(Class)`                    |
| `BeanInstantiationException`       | Khi Bean tương ứng với kiểu không phải là lớp cụ thể | `BeanFactory#getBean`                           |
| `BeanCreationException`              | Khi khởi tạo Bean                                | Lỗi khi thực hiện phương thức khởi tạo Bean     |
| `BeanDefinitionStoreException`       | Khi cấu hình `BeanDefinition` không hợp lệ         | Không thể mở tài nguyên cấu hình XML            |
