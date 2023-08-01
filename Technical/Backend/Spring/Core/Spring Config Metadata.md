---
title: Spring Config Metadata
tags: [spring, java, backend]
categories: [spring, java, backend]
date created: 2023-07-26
date modified: 2023-07-26
---

# Cấu hình metadata trong Spring

## Thông tin cấu hình Spring

- Thông tin cấu hình Bean trong Spring - BeanDefinition
- Thông tin cấu hình thuộc tính Bean trong Spring - PropertyValues
- Thông tin cấu hình của container Spring
- Thông tin cấu hình bên ngoài của Spring - PropertySource
- Thông tin cấu hình Profile của Spring - @Profile

## Thông tin cấu hình Bean trong Spring

Thông tin cấu hình Bean - BeanDefinition

- GenericBeanDefinition: BeanDefinition thông thường
- RootBeanDefinition: BeanDefinition không có Parent hoặc BeanDefinition sau khi hợp nhất
- AnnotatedBeanDefinition: BeanDefinition được chú thích bằng Annotation

## Thông tin cấu hình thuộc tính Bean trong Spring

- Thông tin cấu hình thuộc tính Bean - PropertyValues
  - Có thể chỉnh sửa - MutablePropertyValues
  - Thành phần thành viên - PropertyValue
- Lưu trữ ngữ cảnh thuộc tính Bean - AttributeAccessor
- Phần tử thông tin Bean - BeanMetadataElement

## Thông tin cấu hình của container Spring

Thông tin cấu hình XML của Spring - các phần tử beans liên quan

| Thuộc tính phần tử beans       | Giá trị mặc định | Sử dụng trong                                                         |
| ----------------------------- | --------------- | --------------------------------------------------------------------- |
| profile                       | null (trống)   | Giá trị cấu hình Spring Profiles                                       |
| default-lazy-init             | default         | Khi thuộc tính "default-lazy-init" của beans bên ngoài tồn tại, kế thừa giá trị này; nếu không, là "false" |
| default-merge                 | default         | Khi thuộc tính "default-merge" của beans bên ngoài tồn tại, kế thừa giá trị này; nếu không, là "false" |
| default-autowire              | default         | Khi thuộc tính "default-autowire" của beans bên ngoài tồn tại, kế thừa giá trị này; nếu không, là "no" |
| default-autowire-candidates   | null (trống)   | Mẫu tên mặc định của Spring Beans                                     |
| default-init-method           | null (trống)   | Phương thức khởi tạo tùy chỉnh mặc định của Spring Beans                |
| default-destroy-method        | null (trống)   | Phương thức hủy tùy chỉnh mặc định của Spring Beans                    |

Thông tin cấu hình XML của Spring - liên quan đến ApplicationContext

| Phần tử XML                    | Sử dụng trong                             |
| ----------------------------- | ----------------------------------------- |
| `<context:annotation-config />`    | Kích hoạt triển khai chú thích trong Spring |
| `<context:component-scan />`       | Quét các @Component và chú thích tùy chỉnh  |
| `<context:load-time-weaver />`     | Kích hoạt LoadTimeWeaver trong Spring       |
| `<context:mbean-export />`         | Xuất các Spring Beans như JMX Beans        |
| `<context:mbean-server />`         | Sử dụng nền tảng hiện tại là MBeanServer   |
| `<context:property-placeholder />` | Tải tài nguyên cấu hình bên ngoài như thuộc tính Spring |
| `<context:property-override />`    | Ghi đè thuộc tính Spring bằng tài nguyên cấu hình bên ngoài |

## Tải cấu hình Bean trong Spring từ tệp XML

Thực hiện dưới cùng - XmlBeanDefinitionReader

| Phần tử XML           | Sử dụng trong                                                             |
| --------------------- | ------------------------------------------------------------------------ |
| `<beans:beans />`     | Nhiều cấu hình Spring Beans trong một tài nguyên XML duy nhất               |
| `<beans:bean />`      | Định nghĩa một Spring Bean đơn lẻ (BeanDefinition)                          |
| `<beans:alias />`     | Đặt tên định danh cho BeanDefinition (BeanDefinition)                      |
| `<beans:import />`    | Tải tài nguyên cấu hình XML Spring bên ngoài                               |

## Tải cấu hình Bean trong Spring từ tệp Properties

Thực hiện dưới cùng - PropertiesBeanDefinitionReader

| Thuộc tính Properties | Sử dụng trong                                                        |
| --------------------- | ------------------------------------------------------------------- |
| `class`               | Tên đầy đủ của lớp Bean                                              |
| `abstract`            | Xác định xem BeanDefinition có phải là trừu tượng hay không           |
| `parent`              | Xác định tên BeanDefinition cha                                      |
| `lazy-init`           | Xác định xem Bean có được khởi tạo lười biếng hay không                |
| `ref`                 | Tham chiếu đến tên Bean khác                                         |
| `scope`               | Xác định phạm vi của Bean                                            |
| ${n}                  | n biểu thị cho tham số thứ n+1 của hàm tạo                           |

## Sử dụng chú thích Java để tải thông tin cấu hình Spring Bean

Chú thích mẫu Spring

| Chú thích Spring | Mô tả tình huống | Phiên bản bắt đầu |
| ---------------- | ---------------- | ----------------- |
| `@Repository`    | Chú thích mô hình lưu trữ dữ liệu | 2.0 |
| `@Component`     | Chú thích mô hình thành phần chung | 2.5 |
| `@Service`       | Chú thích mô hình dịch vụ | 2.5 |
| `@Controller`    | Chú thích mô hình điều khiển Web | 2.5 |
| `@Configuration` | Chú thích lớp cấu hình | 3.0 |

Chú thích định nghĩa Spring Bean

| Chú thích Spring | Mô tả tình huống | Phiên bản bắt đầu |
| ---------------- | ---------------- | ----------------- |
| `@Bean`      | Thay thế phần tử XML `<bean>` | 3.0 |
| `@DependsOn` | Thay thế thuộc tính XML `<bean depends-on="…"/>` | 3.0 |
| `@Lazy`      | Thay thế thuộc tính XML `<bean lazy-init="true | false" />` | 3.0 |
| `@Primary`   | Thay thế phần tử XML `<bean primary="true | false" />` | 3.0 |
| `@Role`      | Thay thế phần tử XML `<bean role="…" />` | 3.1 |
| `@Lookup`    | Thay thế thuộc tính XML `<bean lookup-method="…">` | 4.1 |

Chú thích tiêm phụ thuộc Spring Bean

| Chú thích Spring | Mô tả tình huống | Phiên bản bắt đầu |
| ---------------- | ---------------- | ----------------- |
| `@Autowired` | Tiêm phụ thuộc Bean, hỗ trợ nhiều cách tìm kiếm phụ thuộc | 2.5 |
| `@Qualifier` | Tìm kiếm phụ thuộc @Autowired chi tiết | 2.5 |

| Chú thích Java | Mô tả tình huống | Phiên bản bắt đầu |
| -------------- | ---------------- | ----------------- |
| `@Resource` | Tương tự như @Autowired | 2.5 |
| `@Inject`   | Tương tự như @Autowired | 2.5 |

Chú thích điều kiện lắp ráp Spring Bean

| Chú thích Spring | Mô tả tình huống | Phiên bản bắt đầu |
| ---------------- | ---------------- | ----------------- |
| `@Profile`     | Lắp ráp điều kiện cấu hình | 3.1 |
| `@Conditional` | Lắp ráp điều kiện lập trình | 4.0 |

Chú thích vòng đời của Spring Bean

| Chú thích Spring | Mô tả tình huống | Phiên bản bắt đầu |
| ---------------- | ---------------- | ----------------- |
| `@PostConstruct` | Thay thế phần tử XML `<bean init-method="…" />` hoặc InitializingBean | 2.5 |
| `@PreDestroy`    | Thay thế phần tử XML `<bean destroy-method="…" />` hoặc DisposableBean | 2.5 |

Phân tích và đăng ký BeanDefinition của Spring

| Chú thích Spring | Mô tả tình huống | Phiên bản bắt đầu |
| ---------------- | ---------------- | ----------------- |
| Tài nguyên XML        | XmlBeanDefinitionReader        | 1.0      |
| Tài nguyên Properties | PropertiesBeanDefinitionReader | 1.0      |
| Chú thích Java       | AnnotatedBeanDefinitionReader  | 3.0      |

## Thực hiện dưới cấu trúc Spring Bean thông tin cấu hình

### Phân tích và đăng ký BeanDefinition từ tài nguyên XML của Spring

API cốt lõi - XmlBeanDefinitionReader

- Tài nguyên - Resource
- Cơ sở - BeanDefinitionDocumentReader
  - Phân tích XML - Java DOM Level 3 API
  - Phân tích BeanDefinition - BeanDefinitionParserDelegate
  - Đăng ký BeanDefinition - BeanDefinitionRegistry

### Phân tích và đăng ký BeanDefinition từ tài nguyên Properties của Spring

API cốt lõi - PropertiesBeanDefinitionReader

- Tài nguyên
  - Dòng byte - Resource
  - Dòng ký tự - EncodedResouce
- Cơ sở
  - Lưu trữ - java.util.Properties
  - Phân tích BeanDefinition - API triển khai nội bộ
  - Đăng ký BeanDefinition - BeanDefinitionRegistry

### Phân tích và đăng ký BeanDefinition từ chú thích Java của Spring

API cốt lõi - AnnotatedBeanDefinitionReader

- Tài nguyên
  - Đối tượng lớp - java.lang.Class
- Cơ sở
  - Đánh giá điều kiện - ConditionEvaluator
  - Giải quyết phạm vi Bean - ScopeMetadataResolver
  - Phân tích BeanDefinition - Triển khai nội bộ API
  - Xử lý BeanDefinition - AnnotationConfigUtils.processCommonDefinitionAnnotations
  - Đăng ký BeanDefinition - BeanDefinitionRegistry

## Sử dụng tệp XML để tải thông tin cấu hình của Spring IoC Container

Cấu hình XML liên quan đến Spring IoC Container

| Namespace | Module          | URL tài nguyên Schema                                             |
| --------- | --------------- | ---------------------------------------------------------------- |
| beans     | spring-beans    | https://www.springframework.org/schema/beans/spring-beans.xsd     |
| context   | spring-context  | https://www.springframework.org/schema/context/spring-context.xsd |
| aop       | spring-aop      | https://www.springframework.org/schema/aop/spring-aop.xsd         |
| tx        | spring-tx       | https://www.springframework.org/schema/tx/spring-tx.xsd           |
| util      | spring-beans    | beans https://www.springframework.org/schema/util/spring-util.xsd |
| tool      | spring-beans    | https://www.springframework.org/schema/tool/spring-tool.xsd       |

## Sử dụng chú thích Java để tải thông tin cấu hình của Spring IoC Container

Chú thích cấu hình Spring IoC Container

| Chú thích Spring     | Mô tả tình huống                                        | Phiên bản bắt đầu |
| -------------------- | ------------------------------------------------------- | ----------------- |
| `@ImportResource`    | Thay thế phần tử XML `<import>`                         | 3.0               |
| `@Import`            | Nhập Configuration Class                                | 3.0               |
| `@ComponentScan`     | Quét các lớp được chú thích bằng Spring mô hình trong gói | 3.1               |

Chú thích thuộc tính cấu hình Spring IoC

| Chú thích Spring     | Mô tả tình huống                                 | Phiên bản bắt đầu |
| -------------------- | ------------------------------------------------ | ----------------- |
| `@PropertySource`    | Chú thích thuộc tính cấu hình trừu tượng Property | 3.1               |
| `@PropertySources`   | Chú thích tập hợp @PropertySource                 | 4.0               |

## Extensible XML authoring để mở rộng các phần tử SpringXML

Mở rộng XML của Spring

- Viết tệp Schema XML: Xác định cấu trúc XML
- Triển khai NamespaceHandler tùy chỉnh: Liên kết namespace
- Triển khai BeanDefinitionParser tùy chỉnh: Phân tích phần tử XML và BeanDefinition
- Đăng ký mở rộng XML: Liên kết namespace và XML Schema

## Nguyên lý Extensible XML authoring

### Thời điểm kích hoạt

- AbstractApplicationContext#obtainFreshBeanFactory
  - AbstractRefreshableApplicationContext#refreshBeanFactory
    - AbstractXmlApplicationContext#loadBeanDefinitions
      - …
        - XmlBeanDefinitionReader#doLoadBeanDefinitions
          - …
            - BeanDefinitionParserDelegate#parseCustomElement

### Quy trình cốt lõi

BeanDefinitionParserDelegate#parseCustomElement(org.w3c.dom.Element, BeanDefinition)

- Lấy namespace
- Phân tích NamespaceHandler thông qua namespace
- Xây dựng ParserContext
- Phân tích phần tử, lấy BeanDefinition

## Sử dụng tệp Properties để tải cấu hình hóa bên ngoài

Điều khiển bằng chú thích

- @org.springframework.context.annotation.PropertySource
- @org.springframework.context.annotation.PropertySources

Lập trình API

- org.springframework.core.env.PropertySource
- org.springframework.core.env.PropertySources

## Sử dụng tệp YAML để tải cấu hình hóa bên ngoài

Lập trình API

- org.springframework.beans.factory.config.YamlProcessor
  - org.springframework.beans.factory.config.YamlMapFactoryBean
  - org.springframework.beans.factory.config.YamlPropertiesFactoryBean

## Câu hỏi

**Spring có những XML Schema tích hợp sẵn nào?**

| Namespace | Module          | URL tài nguyên Schema                                             |
| --------- | --------------- | ---------------------------------------------------------------- |
| beans     | spring-beans    | https://www.springframework.org/schema/beans/spring-beans.xsd     |
| context   | spring-context  | https://www.springframework.org/schema/context/spring-context.xsd |
| aop       | spring-aop      | https://www.springframework.org/schema/aop/spring-aop.xsd         |
| tx        | spring-tx       | https://www.springframework.org/schema/tx/spring-tx.xsd           |
| util      | spring-beans    | beans https://www.springframework.org/schema/util/spring-util.xsd |
| tool      | spring-beans    | https://www.springframework.org/schema/tool/spring-tool.xsd       |

**Các thông tin cấu hình của Spring bao gồm những gì?**

- Thông tin cấu hình Bean: Phân tích BeanDefinition thông qua phương tiện (ví dụ: XML, Properties)
- Thông tin cấu hình của IoC Container: Điều khiển hành vi của IoC Container thông qua phương tiện (ví dụ: XML, Properties), chẳng hạn như chạy dựa trên chú thích, AOP, v.v.
- Cấu hình hóa bên ngoài: Điều khiển PropertySource thông qua phương tiện trừu tượng (ví dụ: Properties, YAML)
- Spring Profile: Cung cấp nhánh điều kiện thông qua cấu hình hóa bên ngoài

**Nhược điểm của Extensible XML authoring là gì?**

- Độ phức tạp cao: Nhà phát triển cần hiểu rõ XML Schema, spring.handlers, spring.schemas và API của Spring
- Hỗ trợ yếu cho các phần tử lồng nhau: Thường cần sử dụng đệ quy hoặc phương pháp phân tích lồng (con) phần tử
- Hiệu suất xử lý XML kém: Spring XML dựa trên DOM Level 3 API, API này dễ hiểu nhưng hiệu suất kém
- Khó khả thi để di chuyển khung XML: Khó để tương thích với khung XML hiệu suất cao và tiện ích, chẳng hạn như JAXB
