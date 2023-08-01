---
title: Spring IoC
tags: [spring, java, backend, ioc]
categories: [spring, java, backend]
date created: 2023-07-26
date modified: 2023-07-26
---

# Spring IoC

## Giới thiệu về IoC

### IoC là gì

IoC (Inversion of Control) hay còn gọi là "đảo ngược điều khiển" là một nguyên tắc trong lập trình, có ý nghĩa là chương trình không nên phụ thuộc vào việc triển khai cụ thể của một đối tượng, mà nên phụ thuộc vào một giao diện trừu tượng. IoC có tác dụng giảm độ kết nối giữa các đoạn mã.

Có hai cách để triển khai IoC:

- Dependency Injection (DI): Thay vì tạo đối tượng phụ thuộc bên trong lớp bằng cách sử dụng `new()`, chúng ta sẽ tạo đối tượng phụ thuộc bên ngoài và truyền (hoặc chú thích) vào lớp thông qua constructor, tham số của phương thức, v.v.
- Dependency Lookup: Đối tượng được điều khiển bởi container sẽ tìm kiếm các tài nguyên và đối tác mà nó phụ thuộc vào bằng cách sử dụng API của container.

Để hiểu rõ hơn về IoC, có hai điểm quan trọng cần nhớ:

- Ai điều khiển ai và điều khiển cái gì: Trong thiết kế truyền thống của Java SE, chúng ta tự tạo đối tượng phụ thuộc bên trong lớp thông qua `new()`, tức là chương trình chủ động tạo đối tượng phụ thuộc; trong khi đó, trong IoC, một container đặc biệt sẽ tạo các đối tượng này, tức là container điều khiển việc tạo đối tượng; ai điều khiển ai? Tất nhiên là IoC Container điều khiển đối tượng; điều khiển cái gì? Điều quan trọng là điều khiển việc lấy tài nguyên bên ngoài (không chỉ là đối tượng, bao gồm cả tệp tin, v.v.).
- Tại sao lại là "đảo ngược" và những khía cạnh nào bị đảo ngược: Khi chúng ta tự tạo đối tượng phụ thuộc và tìm kiếm đối tác trong ứng dụng truyền thống, chúng ta làm điều này một cách chủ động; trong khi đó, trong tư duy IoC/DI, ứng dụng trở nên bị động, đợi IoC Container tạo và chèn các đối tượng phụ thuộc mà nó cần.

### IoC có thể làm gì

IoC không phải là một công nghệ, mà là một tư duy lập trình, một quy tắc quan trọng trong lập trình hướng đối tượng, nó có thể hướng dẫn chúng ta thiết kế chương trình linh hoạt và giảm độ kết nối giữa các đoạn mã. Trong ứng dụng truyền thống, chúng ta tự tạo đối tượng phụ thuộc và điều khiển chúng, dẫn đến sự kết nối chặt chẽ giữa các lớp và khó kiểm tra; với IoC container, chúng ta chuyển việc tạo và tìm kiếm đối tượng phụ thuộc cho container, dẫn đến sự kết nối lỏng lẻo giữa các đối tượng, giúp việc kiểm tra dễ dàng hơn, thuận tiện cho việc tái sử dụng chức năng và quan trọng hơn là làm cho kiến trúc chương trình trở nên linh hoạt hơn.

Thực tế, sự thay đổi lớn nhất mà IoC mang lại cho lập trình không phải từ mã nguồn, mà từ tư duy. Ứng dụng truyền thống ban đầu là "ông chủ", nó tự mình tìm kiếm tài nguyên cần thiết; nhưng trong tư duy IoC/DI, ứng dụng trở thành "bị động", đợi IoC Container tạo và chèn các tài nguyên phụ thuộc mà nó cần.

IoC tốt nhất được thể hiện qua một trong những quy tắc thiết kế hướng đối tượng - "nguyên tắc Hollywood: 'Đừng tìm chúng tôi, chúng tôi sẽ tìm bạn'"; tức là IoC Container sẽ tìm và chèn các đối tượng phụ thuộc tương ứng, chứ không phải đối tượng tự tìm kiếm.

### IoC Container

IoC Container là một container có khả năng thực hiện dependency injection. IoC Container chịu trách nhiệm khởi tạo, định vị và cấu hình các đối tượng trong ứng dụng và xây dựng các mối quan hệ phụ thuộc giữa chúng. Ứng dụng không cần tạo các đối tượng trực tiếp trong mã, mà IoC Container sẽ thực hiện việc này. Trong Spring, BeanFactory là đại diện thực tế của IoC Container.

Spring IoC container làm thế nào để biết những đối tượng nào được nó quản lý? Điều này cần thông qua tệp cấu hình. Spring IoC container sử dụng cấu hình metadata để khởi tạo và cấu hình các đối tượng trong ứng dụng. Thông thường, chúng ta sử dụng tệp cấu hình dựa trên XML để cấu hình metadata, và Spring hoàn toàn không phụ thuộc vào tệp cấu hình, có thể sử dụng bất kỳ cách nào khác để cấu hình metadata, chẳng hạn như chú thích, cấu hình dựa trên tệp Java, cấu hình dựa trên tệp thuộc tính, v.v.

### Bean

JavaBean là một thành phần có thể tái sử dụng được viết bằng ngôn ngữ JAVA. Để trở thành JavaBean, lớp phải là một lớp cụ thể và công khai, và phải có một constructor không tham số. JavaBean cung cấp các phương thức getter/setter để truy cập các thành viên của nó từ bên ngoài.

Bean là các đối tượng trong ứng dụng của bạn được quản lý bởi IoC Container. Bean là các đối tượng được khởi tạo, cấu hình và quản lý bởi Spring container. Ngoài ra, bean không khác gì các đối tượng khác trong ứng dụng của bạn. Trong Spring, BeanDefinition đại diện cho bean trong metadata.

### Spring IoC

Trong Spring IoC container, các đối tượng chỉ được khởi tạo bằng cách sử dụng các tham số của constructor, phương thức factory hoặc thuộc tính được thiết lập sau khi đối tượng được tạo hoặc trả về từ phương thức factory. Container sau đó tiêm các phụ thuộc này vào khi tạo bean. Quá trình này thực tế là quá trình ngược của việc kiểm soát phụ thuộc của bean bằng cách sử dụng việc khởi tạo hoặc vị trí của nó bằng cách sử dụng cơ chế trực tiếp của lớp (do đó được gọi là đảo ngược điều khiển).

`org.springframework.beans` và `org.springframework.context` là các gói cơ bản của IoC Container trong Spring.

## IoC Container

Trong Spring, có hai loại IoC Container: `BeanFactory` và `ApplicationContext`.

- `BeanFactory`: **`BeanFactory` là IoC Container cơ bản của Spring**. `BeanFactory` cung cấp khung cấu hình và các chức năng cơ bản của container Spring.
- `ApplicationContext`: **`ApplicationContext` là một giao diện con của `BeanFactory` với các tính năng ứng dụng bổ sung**. Nó mở rộng các giao diện khác để hỗ trợ các tính năng phong phú hơn, như: quốc tế hóa, truy cập tài nguyên, cơ chế sự kiện, hỗ trợ AOP tiện lợi hơn, xác định ngữ cảnh ứng dụng trong ứng dụng web, v.v.

Trong thực tế, chúng ta khuyến nghị sử dụng `ApplicationContext` làm IoC Container, vì nó cung cấp nhiều tính năng hơn so với `BeanFactory`.

Giao diện `org.springframework.context.ApplicationContext` đại diện cho IoC Container của Spring, chịu trách nhiệm khởi tạo, cấu hình và tổ chức các bean. Container sử dụng các metadata cấu hình để xác định các chỉ thị về việc khởi tạo, cấu hình và tổ chức các đối tượng trong ứng dụng. Metadata cấu hình có thể được biểu diễn bằng XML, chú thích Java hoặc mã Java. Nó cho phép bạn biểu thị các đối tượng cấu thành ứng dụng của bạn và các mối quan hệ phụ thuộc phức tạp giữa chúng.

Spring cung cấp một số implement của giao diện `ApplicationContext`, ví dụ:

- **[ClassPathXmlApplicationContext](https://docs.spring.io/spring-framework/docs/5.3.23/javadoc-api/org/springframework/context/support/ClassPathXmlApplicationContext.html)**: Implement của `ApplicationContext`, lấy cấu hình từ classpath.

```java
BeanFactory beanFactory = new ClassPathXmlApplicationContext("classpath.xml");
```

- **[FileSystemXmlApplicationContext](https://docs.spring.io/spring-framework/docs/5.3.23/javadoc-api/org/springframework/context/support/FileSystemXmlApplicationContext.html)**: Implement của `ApplicationContext`, lấy cấu hình từ hệ thống tệp.

```java
BeanFactory beanFactory = new FileSystemXmlApplicationContext("fileSystemConfig.xml");
```

Trong hầu hết các tình huống, không cần tạo ra một hoặc nhiều phiên bản của Spring IoC container bằng cách sử dụng mã người dùng một cách rõ ràng.

Hình ảnh dưới đây mô tả các bước làm việc của IoC Container của Spring:

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200723102456.png)

Việc sử dụng IoC Container có thể chia thành ba bước:

1. **Cấu hình metadata**: Cần cấu hình một số metadata để cho Spring biết bạn muốn container hoạt động như thế nào, cụ thể là làm thế nào để khởi tạo, cấu hình và quản lý các đối tượng JavaBean.
2. **Khởi tạo container**: IoC Container phân tích cú pháp metadata đã cấu hình. Bean Reader của IoC Container đọc và phân tích tệp cấu hình, tạo ra các đối tượng BeanDefinition từ định nghĩa và cấu hình metadata. IoC Container sẽ khởi tạo, cấu hình và tổ chức các đối tượng Bean dựa trên `BeanDefinition`.
3. **Sử dụng container**: Khách hàng tạo ra container và lấy các Bean cần thiết từ container.

### Cấu hình metadata

**Metadata** (Dữ liệu mô tả) còn được gọi là dữ liệu về dữ liệu, là thông tin mô tả về dữ liệu. Trong trường hợp này, metadata là thông tin mô tả về các thuộc tính của dữ liệu.

Có các cách để cấu hình metadata:

- **Cấu hình dựa trên XML**: Đây là cách cấu hình truyền thống của Spring. Thông thường, bạn sẽ sử dụng các phần tử `<bean>` trong phần tử `<beans>` cấu hình metadata. Nhược điểm của phương pháp này là nếu có quá nhiều JavaBean, tệp cấu hình sẽ trở nên rối mắt.
- **[Cấu hình dựa trên chú thích](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-annotation-config)**: Spring 2.5 đã giới thiệu hỗ trợ cho metadata dựa trên chú thích. Điều này giúp đơn giản hóa quá trình cấu hình của bạn.
- **[Cấu hình dựa trên Java](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-java)**: Từ phiên bản Spring 3.0 trở đi, Spring hỗ trợ cấu hình metadata bằng mã Java. Thông thường, bạn sẽ sử dụng các phương thức được chú thích `@Bean` trong các lớp được chú thích `@Configuration` để chỉ định cách tạo đối tượng Bean. Để biết thêm chi tiết, bạn có thể tham khảo các chú thích [`@Configuration`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html), [`@Bean`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Bean.html), [`@Import`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Import.html) và [`@DependsOn`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/DependsOn.html).

Các định nghĩa bean này tương ứng với các đối tượng thực tế trong ứng dụng của bạn. Ví dụ: định nghĩa đối tượng lớp dịch vụ, đối tượng truy cập dữ liệu (DAO), đối tượng biểu diễn (ví dụ: các thực thể hành động Struts), đối tượng cơ sở (ví dụ: Hibernate SessionFactories, hàng đợi JMS), v.v. Thông thường, bạn sẽ không cấu hình các đối tượng miền cấp độ chi tiết trong container, vì việc tạo và tải các đối tượng miền thường là trách nhiệm của DAO và logic kinh doanh. Tuy nhiên, bạn có thể sử dụng tích hợp Spring và AspectJ để cấu hình các đối tượng được tạo ra bên ngoài sự kiểm soát của IoC Container.

Dưới đây là một ví dụ về cấu trúc cơ bản của metadata dựa trên XML:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- Thuộc tính id được sử dụng để định danh duy nhất cho mỗi định nghĩa bean -->
    <!-- Thuộc tính class được sử dụng để chỉ định tên đầy đủ của lớp bean -->
    <bean id="..." class="...">
        <!-- Cấu hình thuộc tính của Bean ở đây -->
    </bean>

    <bean id="..." class="...">
        <!-- Cấu hình thuộc tính của Bean ở đây -->
    </bean>

    <!-- Các định nghĩa Bean khác -->

</beans>
```

### Khởi tạo đối tượng Container

Bạn có thể tải các siêu dữ liệu cấu hình bằng cách chỉ định đường dẫn tài nguyên bên ngoài cho constructor của `ApplicationContext`.

```java
ApplicationContext context = new ClassPathXmlApplicationContext("services.xml", "daos.xml");
```

Ví dụ dưới đây hiển thị tệp cấu hình đối tượng của lớp dịch vụ (services.xml):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- services -->

    <bean id="petStore" class="org.springframework.samples.jpetstore.services.PetStoreServiceImpl">
        <property name="accountDao" ref="accountDao"/>
        <property name="itemDao" ref="itemDao"/>
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>

    <!-- more bean definitions for services go here -->

</beans>
```

Ví dụ dưới đây hiển thị tệp cấu hình đối tượng truy cập dữ liệu (daos.xml):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="accountDao"
        class="org.springframework.samples.jpetstore.dao.jpa.JpaAccountDao">
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>

    <bean id="itemDao" class="org.springframework.samples.jpetstore.dao.jpa.JpaItemDao">
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>

    <!-- more bean definitions for data access objects go here -->

</beans>
```

Trong ví dụ trên, lớp dịch vụ bao gồm lớp `PetStoreServiceImpl` và hai đối tượng truy cập dữ liệu có kiểu `JpaAccountDao` và `JpaItemDao` (dựa trên tiêu chuẩn ánh xạ đối tượng JPA). Phần tử `property name` đề cập đến tên thuộc tính JavaBean, phần tử `ref` đề cập đến tên định nghĩa bean khác. Mối quan hệ giữa các phần tử `id` và `ref` này biểu thị mối quan hệ phụ thuộc giữa các đối tượng cộng tác.

**Spring hỗ trợ định nghĩa Bean bằng cách sử dụng nhiều tệp XML, mỗi tệp XML đại diện cho một lớp logic hoặc mô-đun trong kiến trúc. Bạn có thể sử dụng constructor của `ApplicationContext` để tải định nghĩa bean từ tất cả các đoạn XML này. Hoặc, bạn có thể sử dụng phần tử `<import/>` để tải định nghĩa bean từ một hoặc nhiều tệp khác**. Ví dụ:

```xml
<beans>
    <import resource="services.xml"/>
    <import resource="resources/messageSource.xml"/>
    <import resource="/resources/themeSource.xml"/>

    <bean id="bean1" class="..."/>
    <bean id="bean2" class="..."/>
</beans>
```

Trong ví dụ trên, định nghĩa bean bên ngoài được tải từ ba tệp: `services.xml`, `messageSource.xml` và `themeSource.xml`. Tệp `services.xml` phải nằm trong cùng thư mục hoặc vị trí lớp của tệp XML hiện tại; trong khi `messageSource.xml` và `themeSource.xml` phải nằm trong thư mục con `resources` của thư mục hiện tại. Ký tự `/` trong `/resources` sẽ được bỏ qua. Tuy nhiên, vì các đường dẫn này là tương đối, nên tốt nhất là không sử dụng `/`. Theo Schema của Spring, nội dung của tệp được nhập, bao gồm phần tử `<beans/>` cấp cao nhất, phải là định nghĩa bean XML hợp lệ.

> Lưu ý:
>
> Bạn có thể sử dụng đường dẫn tương đối `"../"` để tham chiếu đến tệp trong thư mục cha. Tuy nhiên, điều này sẽ tạo ra sự phụ thuộc vào các tệp ngoài ứng dụng hiện tại. Đặc biệt, không khuyến khích việc sử dụng tham chiếu này cho URL `classpath:` (ví dụ: `classpath:../services.xml`), trong đó quá trình giải quyết thời gian chạy sẽ chọn thư mục gốc của lớp gần nhất và xem xét thư mục cha của nó. Thay đổi cấu hình classpath có thể dẫn đến việc chọn thư mục khác, không chính xác.
>
> Bạn có thể sử dụng vị trí tài nguyên hoàn toàn xác định thay vì đường dẫn tương đối: ví dụ, `file:C:/config/services.xml` hoặc `classpath:/config/services.xml`. Đề nghị giữ một mức độ gián tiếp cho các đường dẫn tuyệt đối như vậy - ví dụ, bằng cách sử dụng trình giữ chỗ `“${…}”` để tham chiếu đến các tham số JVM được chỉ định tại thời gian chạy.

### Sử dụng Container

`ApplicationContext` có thể duy trì một registry (đăng ký) của các bean khác nhau và các phụ thuộc của chúng. Bằng cách sử dụng phương thức `T getBean(String name, Class T requiredType)`, bạn có thể truy xuất và lấy một phiên bản của bean.

`ApplicationContext` cho phép đọc định nghĩa bean và truy cập chúng, như ví dụ dưới đây:

```java
// tạo và cấu hình các bean
ApplicationContext context = new ClassPathXmlApplicationContext("services.xml", "daos.xml");

// lấy phiên bản đã cấu hình
PetStoreService service = context.getBean("petStore", PetStoreService.class);

// sử dụng phiên bản đã cấu hình
List<String> userList = service.getUsernameList();
```

Biến thể linh hoạt nhất là sử dụng `GenericApplicationContext` kết hợp với một đọc viên ủy quyền - ví dụ, kết hợp với `XmlBeanDefinitionReader` của tệp XML, như ví dụ dưới đây:

```java
GenericApplicationContext context = new GenericApplicationContext();
new XmlBeanDefinitionReader(context).loadBeanDefinitions("services.xml", "daos.xml");
context.refresh();
```

Bạn có thể kết hợp các trình đọc ủy quyền này trên cùng một `ApplicationContext`, để đọc định nghĩa bean từ các nguồn cấu hình khác nhau.

Sau đó, bạn có thể sử dụng `getBean` để truy xuất phiên bản của bean. Giao diện `ApplicationContext` cũng có một số phương thức khác để truy xuất bean, nhưng lý tưởng là mã ứng dụng không nên sử dụng chúng. Trên thực tế, mã ứng dụng không nên gọi phương thức `getBean()` nên không phụ thuộc vào API của Spring. Ví dụ, Spring tích hợp với các framework web để cung cấp dependency injection cho các thành phần của các framework web khác nhau (ví dụ: controllers và các bean quản lý bởi JSF), cho phép bạn khai báo phụ thuộc vào các bean cụ thể thông qua siêu dữ liệu (ví dụ: chú thích tự động kết nối).

### Nguồn phụ thuộc của IoC

#### Bean tùy chỉnh

#### Bean được tích hợp sẵn trong container

#### Phụ thuộc tích hợp trong container

## Cấu hình IoC

### Cấu hình XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
         http://www.springframework.org/schema/beans/spring-beans.xsd">
  <import resource="resource1.xml" />
  <bean id="bean1" class=""></bean>
  <bean id="bean2" class=""></bean>
  <bean name="bean2" class=""></bean>

  <alias alias="bean3" name="bean2"/>
  <import resource="resource2.xml" />
</beans>
```

Giải thích các thẻ:

- `<beans>` là nút gốc của tệp cấu hình Spring.
- `<bean>` được sử dụng để định nghĩa một JavaBean. Thuộc tính `id` là định danh của nó và phải là duy nhất trong tệp; thuộc tính `class` là lớp liên quan đến nó.
- `<alias>` được sử dụng để định nghĩa tên định danh thay thế cho Bean.
- `<import>` được sử dụng để nhập định nghĩa Bean từ các tệp cấu hình khác. Điều này cho phép tải nhiều tệp cấu hình và có thể sử dụng mảng các tệp cấu hình để tải nhiều tệp cùng một lúc.

#### Khởi tạo Container

Quá trình khởi tạo Container bao gồm:

- Xác định nguồn tài nguyên (tệp cấu hình XML)
- Đọc thông tin cấu hình (Resource)
- Chuyển đổi thành dữ liệu có thể nhận biết được bởi Spring (BeanDefinition)

```java
ApplicationContext context =
      new ClassPathXmlApplicationContext(new String[] {"services.xml", "daos.xml"});
```

Kết hợp các tệp cấu hình XML  
Các chức năng của các Bean được định nghĩa trong các tệp cấu hình khác nhau, điều này làm cho việc quản lý chúng khó khăn.  
Nguyên tắc thiết kế Java khuyến khích việc tách biệt trách nhiệm. Điều này cũng áp dụng cho cấu hình, các Bean với chức năng khác nhau nên được tổ chức trong các tệp cấu hình khác nhau. Sau đó, bạn có thể sử dụng thẻ `<import>` để nhập chúng.

```xml
<import resource="classpath:spring/applicationContext.xml"/>
<import resource="/WEB-INF/spring/service.xml"/>
```

#### Sử dụng Container

Cách sử dụng Container là thông qua việc sử dụng `getBean` để truy xuất các JavaBean trong IoC Container.  
Spring cũng cung cấp các phương thức khác để truy xuất Bean, nhưng không khuyến khích sử dụng chúng.

```java
// tạo và cấu hình các bean
ApplicationContext context =
new ClassPathXmlApplicationContext(new String[] {"services.xml", "daos.xml"});
// lấy phiên bản đã cấu hình
PetStoreService service = context.getBean("petStore", PetStoreService.class);
// sử dụng phiên bản đã cấu hình
List<String> userList = service.getUsernameList();
```

### Cấu hình bằng chú thích

Spring 2.5 đã giới thiệu chú thích (annotation). Vì vậy, một câu hỏi được đặt ra: liệu việc sử dụng chú thích để tiêm vào JavaBean có phải là tốt hơn việc sử dụng cấu hình XML không? Không nhất định. Nhưng mọi thứ đều có ưu điểm và nhược điểm của nó, tùy thuộc vào sự lựa chọn của bạn. Hãy xem xét ưu điểm và nhược điểm của chú thích:

**Ưu điểm**: Giảm đáng kể việc cấu hình và cho phép cấu hình chi tiết hơn - chú thích có thể được sử dụng để đánh dấu các lớp, phương thức, trường.

**Nhược điểm**: Việc sử dụng chú thích dẫn đến việc xâm nhập vào mã nguồn và gây ra một số vấn đề.

- Bạn cần thêm chú thích vào mã nguồn và biên dịch nó.
- Chú thích thường phân tán và khó kiểm soát.

> Lưu ý: Trong Spring, việc chú thích được tiêm vào xảy ra trước việc tiêm vào bằng XML, do đó, nếu mục tiêu tiêm vào giống nhau, tiêm vào bằng XML sẽ ghi đè lên tiêm vào bằng chú thích.

#### Kích hoạt chú thích

Spring mặc định không kích hoạt chú thích. Nếu muốn sử dụng chú thích, bạn cần kích hoạt chúng trong tệp XML.  
Cách kích hoạt: Thêm một thẻ đơn giản vào tệp XML.

```xml
<context:annotation-config/>
```

> Lưu ý: `<context:annotation-config/>` chỉ sẽ tìm kiếm trong ngữ cảnh mà nó được định nghĩa. Điều này có nghĩa là nếu bạn đã chỉ định một `WebApplicationContext` cho DispatcherServlet, nó chỉ tìm kiếm chú thích `@Autowired` trong controller mà không kiểm tra các vị trí khác.

#### `@Required`

Chú thích `@Required` chỉ có thể được sử dụng để chú thích các phương thức setter của thuộc tính bean. Các thuộc tính bean bị ảnh hưởng bắt buộc phải được điền vào trong tệp cấu hình XML, nếu không, container sẽ ném ra ngoại lệ `BeanInitializationException`.

```java
public class AnnotationRequired {
    private String name;
    private String sex;

    public String getName() {
        return name;
    }

    /**
     * Chú thích @Required được sử dụng để chú thích phương thức setter của thuộc tính bean,
     * và nó chỉ ra rằng thuộc tính bean bị ảnh hưởng bắt buộc phải được điền vào trong tệp cấu hình XML,
     * nếu không, container sẽ ném ra ngoại lệ BeanInitializationException.
     */
    @Required
    public void setName(String name) {
        this.name = name;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }
}
```

#### `@Autowired`

Chú thích `@Autowired` có thể được sử dụng để chú thích các thuộc tính, phương thức setter và phương thức khởi tạo.

Quá trình tiêm `@Autowired`:

- Phân tích thông tin meta
- Tìm kiếm phụ thuộc
- Tiêm phụ thuộc (trường, phương thức)

> Lưu ý: Chú thích `@Autowired` cũng có thể được sử dụng để chú thích phương thức khởi tạo, nhưng nếu lớp chỉ có một phương thức khởi tạo mặc định, thì không cần thiết. Nếu có nhiều hơn một phương thức khởi tạo, ít nhất một phương thức khởi tạo nên được chú thích để cho container biết phương thức nào phải sử dụng.

Bạn có thể sử dụng chú thích JSR330 `@Inject` để thay thế `@Autowired`.

**Ví dụ:**

```java
public class AnnotationAutowired {
    private static final Logger log = LoggerFactory.getLogger(AnnotationRequired.class);

    @Autowired
    private Apple fieldA;

    private Banana fieldB;

    private Orange fieldC;

    public Apple getFieldA() {
        return fieldA;
    }

    public void setFieldA(Apple fieldA) {
        this.fieldA = fieldA;
    }

    public Banana getFieldB() {
        return fieldB;
    }

    @Autowired
    public void setFieldB(Banana fieldB) {
        this.fieldB = fieldB;
    }

    public Orange getFieldC() {
        return fieldC;
    }

    public void setFieldC(Orange fieldC) {
        this.fieldC = fieldC;
    }

    public AnnotationAutowired() {}

    @Autowired
    public AnnotationAutowired(Orange fieldC) {
        this.fieldC = fieldC;
    }

    public static void main(String[] args) throws Exception {
        AbstractApplicationContext ctx =
                        new ClassPathXmlApplicationContext("spring/spring-annotation.xml");

        AnnotationAutowired annotationAutowired =
                        (AnnotationAutowired) ctx.getBean("annotationAutowired");
        log.debug("fieldA: {}, fieldB:{}, fieldC:{}", annotationAutowired.getFieldA().getName(),
                        annotationAutowired.getFieldB().getName(),
                        annotationAutowired.getFieldC().getName());
        ctx.close();
    }
}
```

Cấu hình trong tệp XML:

```xml
<!-- Test @Autowired -->
<bean id="apple" class="org.zp.notes.spring.beans.annotation.sample.Apple"/>
<bean id="banana" class="org.zp.notes.spring.beans.annotation.sample.Banana"/>
<bean id="orange" class="org.zp.notes.spring.beans.annotation.sample.Orange"/>
<bean id="annotationAutowired" class="org.zp.notes.spring.beans.annotation.sample.AnnotationAutowired"/>
```

#### `@Qualifier`

Trong chú thích `@Autowired`, đã đề cập đến việc nếu có nhiều bean ứng cử viên khớp với kiểu được chú thích, Spring sẽ gặp khó khăn.

Vậy làm thế nào để giải quyết vấn đề này?

Có thể sử dụng `@Qualifier` để chỉ định tên của bean để xác định rõ ràng bean cần thiết.

**Ví dụ:**

```java
public class AnnotationQualifier {
    private static final Logger log = LoggerFactory.getLogger(AnnotationQualifier.class);

    @Autowired
    @Qualifier("dog") /** Xóa dòng này, sẽ gây ra ngoại lệ */
    Animal dog;

    Animal cat;

    public Animal getDog() {
        return dog;
    }

    public void setDog(Animal dog) {
        this.dog = dog;
    }

    public Animal getCat() {
        return cat;
    }

    @Autowired
    public void setCat(@Qualifier("cat") Animal cat) {
        this.cat = cat;
    }

    public static void main(String[] args) throws Exception {
        AbstractApplicationContext ctx =
                new ClassPathXmlApplicationContext("spring/spring-annotation.xml");

        AnnotationQualifier annotationQualifier =
                (AnnotationQualifier) ctx.getBean("annotationQualifier");

        log.debug("Dog name: {}", annotationQualifier.getDog().getName());
        log.debug("Cat name: {}", annotationQualifier.getCat().getName());
        ctx.close();
    }
}

abstract class Animal {
    public String getName() {
        return null;
    }
}

class Dog extends Animal {
    public String getName() {
        return "Dog";
    }
}

class Cat extends Animal {
    public String getName() {
        return "Cat";
    }
}
```

Cấu hình trong tệp XML:

```xml
<!-- Test @Qualifier -->
<bean id="dog" class="org.zp.notes.spring.beans.annotation.sample.Dog"/>
<bean id="cat" class="org.zp.notes.spring.beans.annotation.sample.Cat"/>
<bean id="annotationQualifier" class="org.zp.notes.spring.beans.annotation.sample.AnnotationQualifier"/>
```

#### `@Resource`

Spring hỗ trợ chú thích `@Resource` được định nghĩa trong JSP250. Chú thích này được sử dụng để tiêm bean dựa trên tên được chỉ định.

Nếu không chỉ định tên cho `@Resource`, nó sẽ tìm kiếm bean dựa trên kiểu tương tự như `@Autowired`.

Trong Spring, `CommonAnnotationBeanPostProcessor` được sử dụng để xử lý chú thích `@Resource`.

**Ví dụ:**

```java
public class AnnotationResource {
    private static final Logger log = LoggerFactory.getLogger(AnnotationResource.class);

    @Resource(name = "flower")
    Plant flower;

    @Resource(name = "tree")
    Plant tree;

    public Plant getFlower() {
        return flower;
    }

    public void setFlower(Plant flower) {
        this.flower = flower;
    }

    public Plant getTree() {
        return tree;
    }

    public void setTree(Plant tree) {
        this.tree = tree;
    }

    public static void main(String[] args) throws Exception {
        AbstractApplicationContext ctx =
                        new ClassPathXmlApplicationContext("spring/spring-annotation.xml");

        AnnotationResource annotationResource =
                        (AnnotationResource) ctx.getBean("annotationResource");
        log.debug("type: {}, name: {}", annotationResource.getFlower().getClass(), annotationResource.getFlower().getName());
        log.debug("type: {}, name: {}", annotationResource.getTree().getClass(), annotationResource.getTree().getName());
        ctx.close();
    }
}
```

Cấu hình trong tệp XML:

```xml
<!-- Test @Resource -->
<bean id="flower" class="org.zp.notes.spring.beans.annotation.sample.Flower"/>
<bean id="tree" class="org.zp.notes.spring.beans.annotation.sample.Tree"/>
<bean id="annotationResource" class="org.zp.notes.spring.beans.annotation.sample.AnnotationResource"/>
```

#### `@PostConstruct` và `@PreDestroy`

`@PostConstruct` và `@PreDestroy` là các chú thích được định nghĩa trong JSR 250 để quản lý vòng đời của bean.

Như tên gọi, `@PostConstruct` là một phương thức được gọi sau khi bean được khởi tạo, trong khi `@PreDestroy` là một phương thức được gọi trước khi bean bị hủy.

```java
public class AnnotationPostConstructAndPreDestroy {
    private static final Logger log = LoggerFactory.getLogger(AnnotationPostConstructAndPreDestroy.class);

    @PostConstruct
    public void init() {
        log.debug("Gọi phương thức @PostConstruct");
    }

    @PreDestroy
    public void destroy() {
        log.debug("Gọi phương thức @PreDestroy");
    }
}
```

#### `@Inject`

Từ phiên bản Spring 3.0 trở đi, Spring hỗ trợ các chú thích tiêu chuẩn JSR 330 (dependency injection).

Lưu ý: Để sử dụng các chú thích JSR 330, bạn cần sử dụng các gói jar bên ngoài.

Nếu bạn sử dụng Maven để quản lý các gói jar, chỉ cần thêm phụ thuộc vào file pom.xml:

```xml
<dependency>
  <groupId>javax.inject</groupId>
  <artifactId>javax.inject</artifactId>
  <version>1</version>
</dependency>
```

`@Inject` và `@Autowired` tương tự nhau, có thể sử dụng để chú thích thuộc tính, phương thức setter và phương thức khởi tạo.

**_Ví dụ_**

```java
public class AnnotationInject {
    private static final Logger log = LoggerFactory.getLogger(AnnotationInject.class);
    @Inject
    Apple fieldA;

    Banana fieldB;

    Orange fieldC;

    public Apple getFieldA() {
        return fieldA;
    }

    public void setFieldA(Apple fieldA) {
        this.fieldA = fieldA;
    }

    public Banana getFieldB() {
        return fieldB;
    }

    @Inject
    public void setFieldB(Banana fieldB) {
        this.fieldB = fieldB;
    }

    public Orange getFieldC() {
        return fieldC;
    }

    public AnnotationInject() {}

    @Inject
    public AnnotationInject(Orange fieldC) {
        this.fieldC = fieldC;
    }

    public static void main(String[] args) throws Exception {
        AbstractApplicationContext ctx =
                        new ClassPathXmlApplicationContext("spring/spring-annotation.xml");
        AnnotationInject annotationInject = (AnnotationInject) ctx.getBean("annotationInject");

        log.debug("type: {}, name: {}", annotationInject.getFieldA().getClass(),
                        annotationInject.getFieldA().getName());

        log.debug("type: {}, name: {}", annotationInject.getFieldB().getClass(),
                        annotationInject.getFieldB().getName());

        log.debug("type: {}, name: {}", annotationInject.getFieldC().getClass(),
                        annotationInject.getFieldC().getName());

        ctx.close();
    }
}
```

### Cấu hình Java

Cấu hình Spring IoC Container dựa trên Java cho phép người dùng xác định một lớp để quản lý cấu hình của IoC Container.

Để Spring nhận diện lớp định nghĩa này là một lớp cấu hình Spring, chúng ta cần sử dụng hai chú thích: `@Configuration` và `@Bean`.

Nếu bạn đã quen thuộc với cách cấu hình Spring bằng xml, bạn có thể coi `@Configuration` tương đương với thẻ `<beans>` và `@Bean` tương đương với thẻ `<bean>`.

#### `@Bean`

`@Bean` chỉ có thể được áp dụng cho phương thức hoặc chú thích.

`@Bean` chỉ có thể được định nghĩa trong lớp được chú thích bằng `@Configuration` hoặc `@Component`.

#### Khai báo một bean

Ngoài ra, lớp `@Configuration` cho phép định nghĩa các phụ thuộc bean nội bộ thông qua `@Bean` trong cùng một lớp.

Để khai báo một bean, chỉ cần đánh dấu phương thức setter của thuộc tính bean bằng `@Bean`.

```java
@Configuration
public class AnnotationConfiguration {
    private static final Logger log = LoggerFactory.getLogger(JavaComponentScan.class);

    @Bean
    public Job getPolice() {
        return new Police();
    }

    public static void main(String[] args) {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(AnnotationConfiguration.class);
        ctx.scan("org.zp.notes.spring.beans");
        ctx.refresh();
        Job job = (Job) ctx.getBean("police");
        log.debug("job: {}, work: {}", job.getClass(), job.work());
    }
}

public interface Job {
    String work();
}

@Component("police")
public class Police implements Job {
    @Override
    public String work() {
        return "Catch Criminals";
    }
}
```

Điều này tương đương với cấu hình sau:

```xml
<beans>
	<bean id="police" class="org.zp.notes.spring.ioc.sample.job.Police"/>
</beans>
```

Chú thích `@Bean` được sử dụng để chỉ định một phương thức để khởi tạo, cấu hình và khởi tạo một đối tượng mới được quản lý bởi Spring IoC Container.

Nếu bạn đã quen thuộc với cách cấu hình Spring bằng xml, bạn có thể coi `@Bean` tương đương với thẻ `<bean>`.

`@Bean` chú thích có thể được sử dụng cho bất kỳ bean `@Component` Spring nào, tuy nhiên, thường được sử dụng cho các bean `@Configuration`.

#### `@Configuration`

`@Configuration` là một chú thích cấp lớp, được sử dụng để đánh dấu một lớp là một `BeanDefinition`.

`@Configuration` cho phép khai báo bean thông qua các phương thức công khai được đánh dấu bằng `@Bean`. Ngoài ra, `@Configuration` cho phép định nghĩa các phụ thuộc bean nội bộ thông qua `@Bean` trong cùng một lớp.

```java
@Configuration
public class AppConfig {
    @Bean
    public MyService myService() {
        return new MyServiceImpl();
    }
}
```

Điều này tương đương với cấu hình sau:

```xml
<beans>
	<bean id="myService" class="com.acme.services.MyServiceImpl"/>
</beans>
```

Sử dụng `AnnotationConfigApplicationContext` để khởi tạo IoC Container.

## Quá trình giải quyết phụ thuộc

Container thực hiện quá trình giải quyết phụ thuộc của bean như sau:

- `ApplicationContext` sử dụng metadata cấu hình để tạo và khởi tạo bean. Metadata cấu hình có thể được chỉ định bằng XML, mã Java hoặc chú thích.
- Đối với mỗi bean, các phụ thuộc được biểu diễn dưới dạng thuộc tính, tham số của phương thức khởi tạo hoặc tham số của phương thức tạo đối tượng tĩnh. Những phụ thuộc này được cung cấp cho bean khi nó được tạo ra thực tế.
- Mỗi thuộc tính hoặc tham số của phương thức khởi tạo là một định nghĩa thực tế của giá trị cần thiết, hoặc là một tham chiếu đến một bean khác trong container.
- Mỗi thuộc tính hoặc tham số của phương thức khởi tạo được chuyển đổi từ định dạng được chỉ định sang kiểu thực tế của thuộc tính hoặc tham số đó. Mặc định, Spring có thể chuyển đổi giá trị được cung cấp dưới dạng chuỗi thành tất cả các kiểu dữ liệu cơ bản như int, long, String, boolean, v.v.

Spring container xác nhận cấu hình của mỗi bean khi tạo container. Tuy nhiên, các thuộc tính của bean không được thiết lập trước khi bean thực sự được tạo ra. Singleton bean được tạo ra khi container được tạo và được đặt làm bean mặc định. Ngược lại, chỉ có bean được yêu cầu mới được tạo ra.

Lưu ý: Dependency injection thông qua constructor có thể gây ra vấn đề về phụ thuộc vòng.

Ví dụ: Lớp A được chú thích bằng constructor injection yêu cầu một thể hiện của lớp B, và lớp B được chú thích bằng constructor injection yêu cầu một thể hiện của lớp A. Container Spring sẽ phát hiện vòng phụ thuộc này trong quá trình chạy và ném ra `BeanCurrentlyInCreationException`.

Một giải pháp là sử dụng dependency injection thông qua setter method thay vì constructor injection.

Một giải pháp khác là giải quyết vòng phụ thuộc giữa bean A và bean B bằng cách buộc một trong hai bean được tiêm vào trước khi hoàn toàn khởi tạo. Đây là một tình huống điển hình của việc có gà trước hay có trứng trước.

Spring sẽ kiểm tra các vấn đề cấu hình khi tạo container, chẳng hạn như tham chiếu đến bean không tồn tại hoặc phụ thuộc vòng. Khi tạo bean thực tế, Spring sẽ cố gắng trì hoãn việc thiết lập thuộc tính và giải quyết phụ thuộc càng muộn càng tốt. Điều này có nghĩa là nếu có vấn đề xảy ra khi tạo đối tượng hoặc một trong các phụ thuộc của nó, container Spring đã tạo ra có thể tạo ra ngoại lệ khi bạn yêu cầu đối tượng đó - ví dụ: bean gây ra ngoại lệ vì thiếu hoặc không hợp lệ. Sự trễ này trong việc phát hiện vấn đề cấu hình tiềm năng là lý do mặc định ApplicationContext triển khai việc tạo sẵn các singleton bean. Điều này cho phép phát hiện các vấn đề cấu hình khi tạo ApplicationContext, thay vì sau đó. Bạn vẫn có thể ghi đè hành vi mặc định này để trì hoãn việc khởi tạo các singleton bean thay vì tạo sẵn chúng.

## Thực hành tốt nhất

### Làm thế nào để tiêm Bean singleton vào Bean prototype

Bean được tạo bởi Spring mặc định là singleton, nhưng khi gặp phải kế thừa, điều này có thể bị bỏ qua.

Giả sử có một lớp SayService trừu tượng, trong đó có một trường dữ liệu kiểu ArrayList để lưu trữ dữ liệu trung gian của phương thức xử lý. Mỗi lần gọi phương thức say, dữ liệu mới sẽ được thêm vào data. Có thể coi SayService là có trạng thái, và nếu SayService là singleton, sẽ gây ra lỗi OOM.

```java
/**
 * SayService có trạng thái, nếu SayService là singleton sẽ gây ra lỗi OOM
 */
@Slf4j
public abstract class SayService {

   List<String> data = new ArrayList<>();

   public void say() {
      data.add(IntStream.rangeClosed(1, 1000000)
         .mapToObj(__ -> "a")
         .collect(Collectors.joining("")) + UUID.randomUUID().toString());
      log.info("I'm {} size:{}", this, data.size());
   }

}
```

Tuy nhiên, khi phát triển thực tế, các nhà phát triển đã không suy nghĩ nhiều và chỉ đánh dấu lớp SayHello và SayBye với chú thích @Service, khiến chúng trở thành Bean, mà không xem xét đến việc lớp cha có trạng thái.

```java
@Service
@Slf4j
public class SayBye extends SayService {

   @Override
   public void say() {
      super.say();
      log.info("bye");
   }

}

@Service
@Slf4j
public class SayHello extends SayService {

	@Override
	public void say() {
		super.say();
		log.info("hello");
	}

}
```

Trước khi đánh dấu một lớp với chú thích @Service để quản lý bởi container, hãy đánh giá xem lớp có trạng thái hay không, sau đó đặt Scope phù hợp cho Bean.

Mã gọi:

```java
@Slf4j
@RestController
@RequestMapping("beansingletonandorder")
public class BeanSingletonAndOrderController {

   @Autowired
   List<SayService> sayServiceList;
   @Autowired
   private ApplicationContext applicationContext;

   @GetMapping("test")
   public void test() {
      log.info("====================");
      sayServiceList.forEach(SayService::say);
   }

}
```

Có thể có người nghĩ rằng việc đánh dấu SayHello và SayBye với chú thích @Scope và đặt SCOPE_PROTOTYPE sẽ giải quyết vấn đề trên.

```java
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
```

Tuy nhiên, thực tế vẫn còn vấn đề. Vì chú thích @RestController = @Controller + @ResponseBody, và vì @Controller được đánh dấu với @Component meta-annotation, vì vậy chú thích @RestController thực sự là một Spring Bean.

Bean mặc định là singleton, vì vậy Controller singleton sẽ chỉ nhận Bean Service được tạo ra một lần, ngay cả khi Service được đánh dấu là prototype.

Cách sửa là tiêm Bean bằng cách sử dụng proxy. Điều này có nghĩa là mặc dù Controller là singleton, nhưng mỗi lần có thể lấy Service từ proxy. Điều này cho phép cấu hình prototype thực sự có hiệu lực.

```java
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE, proxyMode = ScopedProxyMode.TARGET_CLASS)
```
