---
title: Spring Annotations
tags: [spring, java, backend]
categories: [spring, java, backend]
date created: 2023-07-26
date modified: 2023-07-26
---

# Spring Annotation

## Lịch sử phát triển của Annotation trong Spring

- Thời kỳ khởi đầu của Annotation: Spring Framework 1.x
- Thời kỳ chuyển tiếp của Annotation: Spring Framework 2.x
- Thời kỳ vàng son của Annotation: Spring Framework 3.x
- Thời kỳ hoàn thiện của Annotation: Spring Framework 4.x
- Thời kỳ hiện tại của Annotation: Spring Framework 5.x

## Phân loại chủ đề chính của Annotation trong Spring

Annotation mô hình Spring

| Annotation Spring | Mô tả chủ đề           | Phiên bản bắt đầu |
| -------------- | ------------------ | -------- |
| @Repository    | Annotation cho mô hình lưu trữ dữ liệu   | 2.0      |
| @Component     | Annotation cho mô hình thành phần chung   | 2.5      |
| @Service       | Annotation cho mô hình dịch vụ       | 2.5      |
| @Controller    | Annotation cho mô hình điều khiển Web | 2.5      |
| @Configuration | Annotation cho mô hình cấu hình     | 3.0      |

Annotation khai báo

| Annotation Spring     | Mô tả chủ đề                                    | Phiên bản bắt đầu |
| --------------- | ------------------------------------------- | -------- |
| @ImportResource | Thay thế phần tử XML `<import>`                    | 2.5      |
| @Import         | Nhập khẩu lớp Configuration                       | 2.5      |
| @ComponentScan  | Quét các lớp được đánh dấu bằng Annotation Spring trong gói chỉ định | 3.1      |

Annotation tiêm nạp phụ thuộc

| Annotation Spring | Mô tả chủ đề                            | Phiên bản bắt đầu |
| ----------- | ----------------------------------- | -------- |
| @Autowired  | Tiêm nạp phụ thuộc Bean, hỗ trợ nhiều cách tìm kiếm phụ thuộc | 2.5      |
| @Qualifier  | Tìm kiếm phụ thuộc chi tiết của @Autowired        | 2.5      |

## Mô hình Annotation trong Spring

- Meta-Annotations (Meta-Annotations)
- Annotation mô hình Spring (Stereotype Annotations)
- Annotation kết hợp Spring (Composed Annotations)
- Đặt tên thuộc tính và ghi đè Annotation trong Spring (Attribute Aliases and Overrides)

## Meta-Annotations (Meta-Annotations) trong Spring

- java.lang.annotation.Documented
- java.lang.annotation.Inherited
- java.lang.annotation.Repeatable

## Annotation mô hình Spring (Stereotype Annotations)

Hiểu về tính "phát sinh" của @Component: Các Annotation được đánh dấu bằng @Component trong XML element <context:component-scan> hoặc Annotation @ComponentScan đã "phát sinh" tính năng của @Component và hỗ trợ tính "phát sinh" đa tầng từ phiên bản Spring Framework 4.0 trở đi.

Ví dụ:

- @Repository
- @Service
- @Controller
- @Configuration
- @SpringBootConfiguration (Spring Boot)

Cơ chế "phát sinh" của @Component

- Thành phần cốt lõi - org.springframework.context.annotation.ClassPathBeanDefinitionScanner
- Nhà cung cấp ứng cử viên quét - org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider
- Xử lý tài nguyên - org.springframework.core.io.support.ResourcePatternResolver
- Tài nguyên - thông tin lớp
- Nhà máy đọc thông tin - org.springframework.core.type.classreading.MetadataReaderFactory
- Thông tin lớp - org.springframework.core.type.ClassMetadata
- Thực hiện bằng ASM - org.springframework.core.type.classreading.ClassMetadataReadingVisitor
- Thực hiện bằng phản chiếu - org.springframework.core.type.StandardAnnotationMetadata
- Thông tin Annotation - org.springframework.core.type.AnnotationMetadata
- Thực hiện bằng ASM - org.springframework.core.type.classreading.AnnotationMetadataReadingVisitor
- Thực hiện bằng phản chiếu - org.springframework.core.type.StandardAnnotationMetadata

## Spring Annotation kết hợp (Composed Annotations)

Annotation kết hợp trong Spring cho phép kết hợp bất kỳ sự kết hợp nào giữa các Annotation mô hình Spring (Stereotype Annotation) và các Annotation chức năng khác của Spring.

## Spring đặt tên thuộc tính Annotation (Attribute Aliases)

## Spring ghi đè thuộc tính Annotation (Attribute Overrides)

## Spring @Enable Module-driven (Kích hoạt động cơ mô-đun)

@Enable Module-driven

@Enable Module-driven là mô hình lập trình dựa trên các Annotation có tiền tố @Enable. Mô-đun được hiểu là một tập hợp các thành phần chức năng có cùng lĩnh vực, tạo thành một đơn vị độc lập. Ví dụ về các mô-đun bao gồm mô-đun Web MVC, mô-đun AspectJ Proxy, mô-đun Caching, mô-đun JMX (Java Management Extensions), mô-đun Async (xử lý bất đồng bộ) và nhiều hơn nữa.

Ví dụ:

- @EnableWebMvc
- @EnableTransactionManagement
- @EnableCaching
- @EnableMBeanExport
- @EnableAsync

Mô hình lập trình dựa trên @Enable Module-driven

- Annotation kích hoạt: @EnableXXX
- Annotation nhập: @Import cụ thể
- Cụ thể thực hiện
- Dựa trên Configuration Class
- Dựa trên giao diện ImportSelector
- Dựa trên giao diện ImportBeanDefinitionRegistrar

## Spring Annotation điều kiện

Annotation điều kiện dựa trên cấu hình - @org.springframework.context.annotation.Profile

- Đối tượng liên quan - Profiles trong org.springframework.core.env.Environment
- Thay đổi cài đặt: Từ phiên bản Spring 4.0 trở đi, @Profile được thực hiện dựa trên @Conditional

Annotation điều kiện dựa trên lập trình - @org.springframework.context.annotation.Conditional

- Đối tượng liên quan - Các cài đặt cụ thể của org.springframework.context.annotation.Condition

Cơ chế thực hiện của @Conditional

- Đối tượng ngữ cảnh - org.springframework.context.annotation.ConditionContext
- Đánh giá điều kiện - org.springframework.context.annotation.ConditionEvaluator
- Giai đoạn cấu hình - org.springframework.context.annotation.ConfigurationCondition.ConfigurationPhase
- Điểm vào đánh giá
  - org.springframework.context.annotation.ConfigurationClassPostProcessor
  - org.springframework.context.annotation.ConfigurationClassParser
