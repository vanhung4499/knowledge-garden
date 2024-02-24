---
title: Spring Bean
tags: [spring, java, backend]
categories: [spring, java, backend]
date created: 2023-07-26
date modified: 2024-02-21
---

# Spring Bean

Trong Spring, các đối tượng được quản lý bởi Spring IoC container và tạo thành phần chính của ứng dụng được gọi là Bean. **Bean là đối tượng được khởi tạo, cấu hình và quản lý bởi Spring IoC container**. Bean và các mối quan hệ phụ thuộc giữa chúng được phản ánh trong các siêu dữ liệu cấu hình mà container sử dụng.

## Định nghĩa Spring Bean

### BeanDefinition

Container của Spring IoC không thể nhận dạng được siêu dữ liệu cấu hình. Để làm điều này, các thông tin cấu hình được chuyển đổi thành đối tượng `BeanDefinition` mà Spring có thể nhận dạng.

**`BeanDefinition` là giao diện thông tin cấu hình định nghĩa Bean trong Spring**, nó bao gồm:

- Tên lớp của Bean
- Các yếu tố cấu hình hành vi của Bean, chẳng hạn như phạm vi, chế độ tự động liên kết, vòng đời, v.v.
- Các tham chiếu Bean khác, còn được gọi là Cộng tác viên (Collaborators) hoặc Phụ thuộc (Dependencies)
- Các cài đặt cấu hình, chẳng hạn như thuộc tính của Bean

#### Thông tin cấu hình BeanDefinition

Thông tin cấu hình BeanDefinition như sau:

| Thuộc tính                                                                                                                                  | Mô tả                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| [Class](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-class)                                  | Tên đầy đủ của lớp, phải là lớp cụ thể, không phải là lớp trừu tượng hoặc giao diện |
| [Name](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-beanname)                                        | Tên hoặc ID của Bean                               |
| [Scope](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-scopes)                                 | Phạm vi của Bean (ví dụ: `singleton`, `prototype`, v.v.) |
| [Constructor arguments](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-collaborators)          | Các đối số của Constructor của Bean (dùng cho Dependency Injection) |
| [Properties](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-collaborators)                     | Các thuộc tính của Bean (dùng cho Dependency Injection) |
| [Autowiring mode](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-autowire)                     | Chế độ tự động liên kết của Bean (ví dụ: theo tên byName) |
| [Lazy initialization mode](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-lazy-init)           | Chế độ khởi tạo lười (khởi tạo hoặc không khởi tạo) |
| [Initialization method](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-lifecycle-initializingbean) | Tên phương thức khởi tạo Bean                      |
| [Destruction method](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-lifecycle-disposablebean)    | Tên phương thức hủy Bean                           |

#### Xây dựng BeanDefinition

Có hai cách để xây dựng BeanDefinition:

- Sử dụng `BeanDefinitionBuilder`
- Sử dụng `AbstractBeanDefinition` và các lớp con của nó

> 💻 Ví dụ mã nguồn BeanDefinition: [BeanDefinitionTests](https://github.com/dunwu/spring-tutorial/blob/master/codes/core/spring-core-ioc/src/test/java/io/github/dunwu/spring/core/bean/BeanDefinitionTests.java)

### Đặt tên cho Spring Bean

#### Quy tắc đặt tên Spring Bean

Mỗi Bean có một hoặc nhiều định danh (identifiers), các định danh này phải là duy nhất trong container chứa Bean. Thông thường, một Bean chỉ có một định danh, nếu cần thêm, có thể sử dụng các bí danh (Alias) để mở rộng.

Trong cấu hình dựa trên XML, bạn **có thể sử dụng thuộc tính `id`, `name` hoặc cả hai để chỉ định định danh cho Bean**. Thông thường, định danh của Bean bao gồm các chữ cái và cho phép các ký tự đặc biệt. Nếu muốn giới thiệu các bí danh cho Bean, bạn có thể sử dụng dấu phẩy (",") hoặc dấu chấm phẩy (";") để phân tách chúng trong thuộc tính `name`.

Trong Spring, **việc chỉ định thuộc tính `id` và `name` cho Bean không bắt buộc**. Nếu không chỉ định, Spring sẽ tự động gán một tên duy nhất cho Bean. Mặc dù tên của Bean không bị giới hạn, nhưng **đề xuất sử dụng kiểu đặt tên CamelCase cho Bean**.

#### Trình tạo tên Bean của Spring

Spring cung cấp hai trình tạo tên Bean:

- `DefaultBeanNameGenerator`: Trình tạo tên Bean mặc định và chung chung.
- `AnnotationBeanNameGenerator`: Trình tạo tên Bean dựa trên quét chú thích.

```java
public interface BeanNameGenerator {
   String generateBeanName(BeanDefinition definition, BeanDefinitionRegistry registry);
}
```

#### Bí danh (Alias) Spring Bean

Spring hỗ trợ sử dụng thuộc tính `<alias>` để đặt bí danh cho Bean.

Tác dụng của bí danh Bean (Alias):

- Tái sử dụng lại `BeanDefinition` hiện có
- Cung cấp các tên phù hợp với từng tình huống, ví dụ:
  - `<alias name="myApp-dataSource" alias="subsystemA-dataSource"/>`
  - `<alias name="myApp-dataSource" alias="subsystemB-dataSource"/>`

```xml
<bean id="user" class="io.github.dunwu.spring.core.bean.entity.person.User">
  <!-- properties omitted -->
</bean>
<alias name="user" alias="aliasUser" />
```

## Vòng đời của Spring Bean

![bean-lifecycle](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230725202926.png)

1. Spring tạo ra một Bean (tương đương với việc khởi tạo một đối tượng mới).
    
2. Spring tiêm giá trị và tham chiếu vào các thuộc tính tương ứng của Bean.
    
3. Nếu Bean triển khai `BeanNameAware`, Spring sẽ truyền ID của Bean vào phương thức `setBeanName`.
    
4. Nếu Bean triển khai `BeanFactoryAware`, Spring sẽ gọi phương thức `setBeanFactory` và chuyển tham chiếu đến đối tượng `BeanFactory` của container.
    
5. Nếu Bean triển khai `ApplicationContextAware`, Spring sẽ gọi phương thức `setApplicationContext` và chuyển tham chiếu đến đối tượng `ApplicationContext` của container.
    
6. Nếu Bean triển khai `BeanPostProcessor`, Spring sẽ gọi phương thức `postProcessBeforeInitialization` để thực hiện bất kỳ xử lý nào trước khi Bean được khởi tạo.
    
7. Nếu Bean triển khai `InitializingBean`, Spring sẽ gọi phương thức `afterPropertiesSet` sau khi tất cả các thuộc tính của Bean được thiết lập.
    
8. Nếu Bean triển khai `BeanPostProcessor`, Spring sẽ gọi phương thức `postProcessAfterInitialization` để thực hiện bất kỳ xử lý nào sau khi Bean được khởi tạo.
    
9. Sau các bước trên, Bean sẽ tồn tại trong context và sẵn sàng sử dụng cho ứng dụng cho đến khi context bị hủy.
    
10. Nếu Bean triển khai `DisposableBean`, Spring sẽ gọi phương thức `destroy` trước khi Bean bị hủy.

## Đăng ký Spring Bean

Đăng ký Spring Bean thực chất là đăng ký `BeanDefinition` vào container IoC.

### Thông tin cấu hình XML

Đây là cách cấu hình truyền thống của Spring. Thông tin cấu hình được đặt trong thẻ `<bean>`.

Nhược điểm là khi có quá nhiều JavaBean, tệp cấu hình sẽ trở nên rối mắt.

### Thông tin cấu hình bằng Annotation

Sử dụng các Annotation như `@Bean`, `@Component`, `@Import` để đăng ký Spring Bean.

### Thông tin cấu hình bằng Java API

- Đăng ký theo tên: `BeanDefinitionRegistry#registerBeanDefinition(String,Bean

## Spring Bean Instantiation

Cách tạo instance của Spring Bean:

- Cách thông thường
  - Sử dụng constructor (thông qua cấu hình XML, Java Annotation và Java API)
  - Sử dụng phương thức tĩnh (thông qua cấu hình XML, Java Annotation và Java API)
  - Sử dụng phương thức tạo Bean của Bean Factory (thông qua cấu hình XML, Java Annotation và Java API)
  - Sử dụng `FactoryBean` (thông qua cấu hình XML, Java Annotation và Java API)
- Cách đặc biệt
  - Sử dụng `ServiceLoaderFactoryBean` (thông qua cấu hình XML, Java Annotation và Java API)
  - Sử dụng `AutowireCapableBeanFactory#createBean(java.lang.Class, int, boolean)`
  - Sử dụng `BeanDefinitionRegistry#registerBeanDefinition(String,BeanDefinition)`

## Spring Bean Initialization and Destruction

Cách khởi tạo và hủy Bean trong Spring có các phương thức sau:

1. Sử dụng các Annotation `@PostConstruct` và `@PreDestroy` để chỉ định phương thức khởi tạo và hủy Bean tương ứng.
2. Implement interface `InitializingBean` và sử dụng phương thức `afterPropertiesSet()` để viết phương thức khởi tạo; Implement interface `DisposableBean` và sử dụng phương thức `destroy()` để viết phương thức hủy.
3. Tự định nghĩa phương thức khởi tạo và hủy
   - Cấu hình XML: `<bean init-method="init" destroy="destroy" … />`
   - Java Annotation: `@Bean(initMethod = "init", destroyMethod = "destroy")`
   - Java API: `AbstractBeanDefinition#setInitMethodName(String)` và `AbstractBeanDefinition#setDestroyMethodName(String)` để định nghĩa phương thức khởi tạo và hủy

Lưu ý: Nếu cùng tồn tại, thứ tự thực hiện sẽ tuân theo thứ tự được định nghĩa.

Bean Lazy Initialization

- Cấu hình XML: `<bean lazy-init="true" … />`
- Annotation: `@Lazy`

Spring cung cấp interface `BeanPostProcessor` với hai phương thức `postProcessBeforeInitialization` và `postProcessAfterInitialization`. `postProcessBeforeInitialization` được gọi trước khi phương thức khởi tạo của Bean được gọi, `postProcessAfterInitialization` được gọi sau khi phương thức khởi tạo của Bean được gọi. Cả hai phương thức đều có hai tham số:

- `bean`: Đối tượng Bean hiện tại;
- `beanName`: Tên của Bean trong container.

## Spring Bean Garbage Collection

Quá trình thu gom rác của Spring Bean:

1. Đóng Spring container (ApplicationContext).
2. Thực hiện GC (Garbage Collection).
3. Gọi lại phương thức `finalize()` của Bean.

## Phạm vi của Spring Bean

| Scope                                                                                                                         | Mô tả                                                                                                                                                                                                                                                        |
| :---------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [singleton](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-scopes-singleton)     | (Mặc định) Phạm vi một định nghĩa Bean đến một instance duy nhất cho mỗi container Spring IoC.                                                                                                                                                             |
| [prototype](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-scopes-prototype)     | Phạm vi một định nghĩa Bean đến bất kỳ số lượng instance nào.                                                                                                                                                                                                 |
| [request](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-scopes-request)         | Phạm vi một định nghĩa Bean đến vòng đời của một HTTP request duy nhất. Tức là, mỗi HTTP request sẽ có một instance riêng của Bean được tạo ra từ một định nghĩa Bean duy nhất. Chỉ hợp lệ trong ngữ cảnh của một Spring `ApplicationContext` hỗ trợ web. |
| [session](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-scopes-session)         | Phạm vi một định nghĩa Bean đến vòng đời của một HTTP `Session`. Chỉ hợp lệ trong ngữ cảnh của một Spring `ApplicationContext` hỗ trợ web.                                                                                                                 |
| [application](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-scopes-application) | Phạm vi một định nghĩa Bean đến vòng đời của một `ServletContext`. Chỉ hợp lệ trong ngữ cảnh của một Spring `ApplicationContext` hỗ trợ web.                                                                                                                |
| [websocket](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#websocket-stomp-websocket-scope)     | Phạm vi một định nghĩa Bean đến vòng đời của một `WebSocket`. Chỉ hợp lệ trong ngữ cảnh của một Spring `ApplicationContext` hỗ trợ web.                                                                                                                     |
