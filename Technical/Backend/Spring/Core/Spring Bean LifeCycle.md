---
title: Spring Bean LifeCycle
tags: [spring, java, backend, bean]
categories: [spring, java, backend]
date created: 2023-07-26
date modified: 2023-07-26
---

# Vòng đời của Bean trong Spring

![bean-lifecycle](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230725202926.png)

## Giai đoạn cấu hình thông tin cơ bản của Bean trong Spring

Cấu hình BeanDefinition

- Hướng tới tài nguyên
  - Cấu hình XML
  - Cấu hình từ tài nguyên Properties
- Hướng tới chú thích
- Hướng tới API

## Giai đoạn phân tích thông tin cơ bản của Bean trong Spring

- Phân tích BeanDefinition từ tài nguyên
  - BeanDefinitionReader
  - Trình phân tích XML - BeanDefinitionParser
- Phân tích BeanDefinition từ chú thích
  - AnnotatedBeanDefinitionReader

## Giai đoạn đăng ký Bean trong Spring

Giao diện đăng ký BeanDefinition: BeanDefinitionRegistry

## Giai đoạn hợp nhất BeanDefinition trong Spring

Hợp nhất BeanDefinition

Hợp nhất BeanDefinition cha con

- Tìm kiếm trong BeanFactory hiện tại
- Tìm kiếm theo cấu trúc BeanFactory

## Giai đoạn tải lớp Bean trong Spring

- Tải lớp ClassLoader
- Kiểm soát an ninh Java
- ConfigurableBeanFactory tạm thời ClassLoader

## Giai đoạn trước khi tạo thể hiện Bean trong Spring

Cách tạo thể hiện

- Cách tạo thể hiện truyền thống: Chiến lược tạo thể hiện (InstantiationStrategy)
- Tiêm phụ thuộc qua hàm tạo

## Giai đoạn tạo thể hiện Bean trong Spring

Giai đoạn không phổ biến - Giai đoạn trước khi tạo thể hiện Bean

InstantiationAwareBeanPostProcessor#postProcessBeforeInstantiation

## Giai đoạn sau khi tạo thể hiện Bean trong Spring

Kiểm tra gán giá trị thuộc tính của Bean

InstantiationAwareBeanPostProcessor#postProcessAfterInstantiation

## Giai đoạn trước khi gán giá trị thuộc tính của Bean trong Spring

- Thông tin giá trị thuộc tính của Bean
  - PropertyValues
- Gọi lại trước khi gán giá trị thuộc tính của Bean
  - Spring 1.2 - 5.0: InstantiationAwareBeanPostProcessor#postProcessPropertyValues
  - Spring 5.1: InstantiationAwareBeanPostProcessor#postProcessProperties

## Giai đoạn gọi lại giao diện Aware của Bean trong Spring

Giao diện Aware của Spring:

- BeanNameAware
- BeanClassLoaderAware
- BeanFactoryAware
- EnvironmentAware
- EmbeddedValueResolverAware
- ResourceLoaderAware
- ApplicationEventPublisherAware
- MessageSourceAware
- ApplicationContextAware

## Giai đoạn trước khi khởi tạo Bean trong Spring

Đã hoàn thành:

- Tạo thể hiện Bean
- Gán giá trị thuộc tính của Bean
- Gọi lại giao diện Aware của Bean

Gọi lại phương thức:

- BeanPostProcessor#postProcessBeforeInitialization

## Giai đoạn khởi tạo Bean trong Spring

Khởi tạo Bean (Initialization)

- Phương thức được chú thích @PostConstruct
- Phương thức afterPropertiesSet() của lớp thực hiện InitializingBean
- Phương thức khởi tạo tùy chỉnh

## Giai đoạn sau khi khởi tạo Bean trong Spring

Gọi lại phương thức: BeanPostProcessor#postProcessAfterInitialization

## Giai đoạn hoàn thành khởi tạo Bean trong Spring

Gọi lại phương thức: Spring 4.1+: SmartInitializingSingleton#afterSingletonsInstantiated

## Giai đoạn trước khi hủy Bean trong Spring

Gọi lại phương thức: DestructionAwareBeanPostProcessor#postProcessBeforeDestruction

## Giai đoạn hủy Bean trong Spring

Hủy Bean (Destroy)

- Phương thức được chú thích @PreDestroy
- Phương thức destroy() của lớp thực hiện DisposableBean
- Phương thức hủy tùy chỉnh

## Thu gom rác của Bean trong Spring

Thu gom rác Bean (GC)

- Đóng Spring Container (ApplicationContext)
- Thực hiện GC
- Gọi lại phương thức finalize() được ghi đè bởi Bean của Spring

## Câu hỏi

**Có những trường hợp sử dụng nào cho BeanPostProcessor**?

BeanPostProcessor cung cấp các gọi lại vòng đời trước và sau khi khởi tạo Bean trong Spring, tương ứng với các phương thức postProcessBeforeInitialization và postProcessAfterInitialization, cho phép mở rộng hoặc thay thế Bean mà bạn quan tâm.

Thêm điểm: Các gọi lại Aware liên quan đến ApplicationContext cũng được thực hiện bằng cách sử dụng BeanPostProcessor.

**Sự khác biệt giữa BeanFactoryPostProcessor và BeanPostProcessor là gì**?

BeanFactoryPostProcessor là một bộ xử lý sau BeanFactory (thực tế là ConfigurableListableBeanFactory), được sử dụng để mở rộng BeanFactory hoặc thực hiện việc tìm kiếm phụ thuộc và tiêm phụ thuộc thông qua BeanFactory.

BeanFactoryPostProcessor phải được thực hiện bởi ApplicationContext của Spring và không thể tương tác trực tiếp với BeanFactory.

Trong khi đó, BeanPostProcessor liên quan trực tiếp đến BeanFactory và có mối quan hệ N đến 1 với nó.

**Làm thế nào BeanFactory xử lý vòng đời của Bean**?

Triển khai mặc định của BeanFactory là `DefaultListableBeanFactory`, trong đó vòng đời của Bean được xử lý như sau:

- Giai đoạn đăng ký BeanDefinition - registerBeanDefinition
- Giai đoạn hợp nhất BeanDefinition - getMergedBeanDefinition
- Giai đoạn trước khi tạo thể hiện Bean - resolveBeforeInstantiation
- Giai đoạn tạo thể hiện Bean - createBeanInstance
- Giai đoạn sau khi tạo thể hiện Bean - populateBean
- Giai đoạn trước khi gán giá trị thuộc tính của Bean - populateBean
- Giai đoạn gán giá trị thuộc tính của Bean - populateBean
- Giai đoạn gọi lại giao diện Aware của Bean - initializeBean
- Giai đoạn trước khi khởi tạo Bean - initializeBean
- Giai đoạn khởi tạo Bean - initializeBean
- Giai đoạn sau khi khởi tạo Bean - initializeBean
- Giai đoạn hoàn thành khởi tạo Bean - preInstantiateSingletons
- Giai đoạn trước khi hủy Bean - destroyBean
- Giai đoạn hủy Bean - destroyBean
