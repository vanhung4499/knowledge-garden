---
title: Spring Environment Abstraction
tags: [spring, java, backend, acceptsProfiles(String…)]
categories: [spring, java, backend]
date created: 2023-07-26
date modified: 2023-07-26
---

# Spring Environment trừu tượng

## Hiểu về Spring Environment trừu tượng

Quản lý thuộc tính cấu hình Spring thống nhất

Spring Framework 3.1 đã giới thiệu Environment trừu tượng, nó quản lý việc lưu trữ thuộc tính cấu hình Spring, bao gồm xử lý các placeholder và chuyển đổi kiểu dữ liệu, không chỉ thay thế hoàn toàn PropertyPlaceholderConfigurer mà còn hỗ trợ nguồn thuộc tính cấu hình phong phú hơn (PropertySource).

Quản lý việc tạo ra các Bean Spring theo điều kiện

Sử dụng thông tin Profiles trong Environment, giúp Spring Container tạo ra các Bean theo điều kiện.

## Các trường hợp sử dụng Interface Environment trong Spring

- Sử dụng để xử lý placeholder thuộc tính
- Sử dụng để chuyển đổi kiểu dữ liệu thuộc tính cấu hình Spring
- Sử dụng để lưu trữ nguồn thuộc tính cấu hình Spring (PropertySource)
- Sử dụng để duy trì trạng thái Profiles

## Xử lý placeholder trong Environment

Xử lý placeholder trước Spring 3.1

- Component: org.springframework.beans.factory.config.PropertyPlaceholderConfigurer
- Interface: org.springframework.util.StringValueResolver

Xử lý placeholder từ Spring 3.1 trở đi

- Component: org.springframework.context.support.PropertySourcesPlaceholderConfigurer
- Interface: org.springframework.beans.factory.config.EmbeddedValueResolver

## Hiểu về Profiles cấu hình điều kiện trong Spring

Cấu hình điều kiện từ Spring 3.1

- API: org.springframework.core.env.ConfigurableEnvironment
- Thay đổi: addActiveProfile(String), setActiveProfiles(String…) và setDefaultProfiles(String…)
- Lấy giá trị: getActiveProfiles() và getDefaultProfiles()
- So sánh: acceptsProfiles(String…) và acceptsProfiles(Profiles)
- Annotation: @org.springframework.context.annotation.Profile

## Sự tái cấu trúc @Profile trong Spring 4

Dựa trên giao diện org.springframework.context.annotation.Condition từ Spring 4

org.springframework.context.annotation.ProfileCondition

## Tiêm nạp Environment

Tiêm nạp trực tiếp

- Sử dụng giao diện EnvironmentAware
- Tiêm nạp Environment bằng @Autowired

Tiêm nạp gián tiếp

- Sử dụng giao diện ApplicationContextAware
- Tiêm nạp ApplicationContext bằng @Autowired

## Tra cứu Environment

Tra cứu trực tiếp

- Sử dụng org.springframework.context.ConfigurableApplicationContext#ENVIRONMENT_BEAN_NAME

Tra cứu gián tiếp

- Sử dụng org.springframework.context.ConfigurableApplicationContext#getEnvironment

## Dependency Injection @Value

Tiêm nạp @Value

Thực hiện - org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor

## Sử dụng chuyển đổi kiểu dữ liệu trong Environment của Spring

Triển khai Environment

- Triển khai cơ bản - org.springframework.core.env.PropertySourcesPropertyResolver
- Phương thức cốt lõi - convertValueIfNecessary(Object, Class)
- Dịch vụ cơ bản - org.springframework.core.convert.ConversionService
- Triển khai mặc định - org.springframework.core.convert.support.DefaultConversionService

## Sử dụng chuyển đổi kiểu dữ liệu trong @Value của Spring

Triển khai @Value

- Triển khai cơ bản - org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor
  - org.springframework.beans.factory.support.DefaultListableBeanFactory#doResolveDependency
- Dịch vụ cơ bản - org.springframework.beans.TypeConverter
  - Triển khai mặc định - org.springframework.beans.TypeConverterDelegate
    - java.beans.PropertyEditor
    - org.springframework.core.convert.ConversionService

## Nguồn thuộc tính cấu hình PropertySource của Spring

- API
  - Nguồn thuộc tính cấu hình đơn - org.springframework.core.env.PropertySource
  - Nguồn thuộc tính cấu hình nhiều - org.springframework.core.env.PropertySources
- Annotation
  - Nguồn thuộc tính cấu hình đơn - @org.springframework.context.annotation.PropertySource
  - Nguồn thuộc tính cấu hình nhiều - @org.springframework.context.annotation.PropertySources
- Liên quan
  - Đối tượng lưu trữ - org.springframework.core.env.MutablePropertySources
  - Phương thức liên quan - org.springframework.core.env.ConfigurableEnvironment#getPropertySources()

## Nguồn thuộc tính cấu hình sẵn có trong Spring

Nguồn PropertySource tích hợp sẵn

| Loại PropertySource                                                  | Mô tả                      |
| -------------------------------------------------------------------- | ------------------------- |
| org.springframework.core.env.CommandLinePropertySource               | Nguồn thuộc tính dòng lệnh          |
| org.springframework.jndi.JndiPropertySource                          | Nguồn thuộc tính JNDI           |
| org.springframework.core.env.PropertiesPropertySource                | Nguồn thuộc tính Properties     |
| org.springframework.web.context.support.ServletConfigPropertySource  | Nguồn thuộc tính Servlet        |
| org.springframework.web.context.support.ServletContextPropertySource | Nguồn thuộc tính ServletContext |
| org.springframework.core.env.SystemEnvironmentPropertySource         | Nguồn thuộc tính môi trường        |

## Mở rộng PropertySource trong Spring dựa trên Annotation

@org.springframework.context.annotation.PropertySource cách thực hiện

- Điểm vào - org.springframework.context.annotation.ConfigurationClassParser#doProcessConfigurationClass
  - org.springframework.context.annotation.ConfigurationClassParser#processPropertySource
- 4.3 Semantic mới
  - Mã hóa ký tự cấu hình thuộc tính - encoding
  - org.springframework.core.io.support.PropertySourceFactory
- Đối tượng phù hợp - org.springframework.core.env.CompositePropertySource

## Mở rộng PropertySource trong Spring dựa trên API

- Tạo PropertySource trước khi khởi động ứng dụng Spring
- Tạo PropertySource sau khi khởi động ứng dụng Spring

## Câu hỏi

Giới thiệu về Interface Environment trong Spring?

- Interface cốt lõi - org.springframework.core.env.Environment
- Interface cha - org.springframework.core.env.PropertyResolver
- Interface có thể cấu hình - org.springframework.core.env.ConfigurableEnvironment
- Trách nhiệm:
  - Quản lý nguồn thuộc tính cấu hình Spring
  - Quản lý Profiles
