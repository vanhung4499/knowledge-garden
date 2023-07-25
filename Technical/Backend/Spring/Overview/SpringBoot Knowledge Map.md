---
title: SpringBoot Knowledge Map
tags: [spring, springboot, java, backend]
categories: [spring, springboot, java, backend]
date created: 2023-07-25
date modified: 2023-07-26
---

# Bản đồ kiến thức về Spring Boot

> 1. Cảnh báo: Bài viết này rất dài, khuyến nghị đánh dấu và đọc sau, có thể đây là lần cuối viết một bài dài như vậy.
> 2. Giải thích: Có 4 phần nhỏ về kiến thức cơ bản về Spring ở phần trước, bao gồm: IOC Container, JavaConfig, Event Listeners, và SpringFactoriesLoader chi tiết. Chúng chiếm phần lớn nội dung của bài viết này. Mặc dù chúng có thể không có quá nhiều liên kết với nhau, nhưng những kiến thức này là rất quan trọng để hiểu rõ nguyên tắc cốt lõi của Spring Boot. Nếu bạn đã thành thạo với Spring Framework, bạn hoàn toàn có thể bỏ qua 4 phần nhỏ này. Vì loạt bài viết này được tạo thành từ những điểm kiến thức không liên quan nhau, nên được đặt tên là "Bản đồ kiến thức".

Trong vòng hai ba năm qua, Spring Boot framework là điều làm cho cộng đồng Spring hứng thú nhất. Có thể từ cái tên bạn đã có thể nhìn thấy mục đích thiết kế của framework này: khởi động ứng dụng Spring một cách nhanh chóng. Vì vậy, ứng dụng Spring Boot về bản chất là một ứng dụng dựa trên framework Spring, nó là sản phẩm thực hành tốt nhất của triết lý "quy ước quan trọng hơn cấu hình" của Spring. Nó giúp nhà phát triển xây dựng ứng dụng dựa trên hệ sinh thái Spring một cách nhanh chóng và hiệu quả.

Vậy Spring Boot có ma thuật gì? **Tự động cấu hình**, **phụ thuộc khởi động**, **Actuator**, **Command Line Interface (CLI)** là 4 tính năng cốt lõi quan trọng nhất của Spring Boot, trong đó CLI là tính năng tùy chọn của Spring Boot, mặc dù nó mạnh mẽ, nhưng nó cũng giới thiệu một mô hình phát triển không thông thường, vì vậy loạt bài viết này chỉ tập trung vào 3 tính năng còn lại. Như tiêu đề bài viết, phần này sẽ mở cánh cửa của Spring Boot cho bạn, tập trung phân tích quá trình khởi động và nguyên lý thực hiện tự động cấu hình. Để nắm vững nội dung cốt lõi này, hiểu một số kiến thức cơ bản về Spring Framework sẽ giúp bạn tiết kiệm thời gian và công sức.

## 1. Ném gạch để lấy ngọc: Khám phá Spring Container

Nếu bạn đã từng xem mã nguồn của phương thức `SpringApplication.run()`, quá trình khởi động dài dòng của Spring Boot chắc chắn đã làm bạn phát điên. Nhìn qua hiện tượng để nhìn thấy bản chất, `SpringApplication` chỉ là mở rộng quá trình khởi động của một ứng dụng Spring điển hình, do đó, hiểu rõ về Spring Container là chìa khóa để mở cánh cửa của Spring Boot.

### 1.1. Spring Container

Bạn có thể xem Spring Container như một nhà hàng, khi bạn đến nhà hàng, thông thường bạn sẽ gọi phục vụ: Tiểu nhị, gọi món! Còn nguyên liệu món ăn là gì? Làm thế nào để nấu món ăn đó? Có thể bạn hoàn toàn không quan tâm. IoC Container cũng tương tự, bạn chỉ cần nói cho nó biết bạn cần một bean nào đó, nó sẽ trả lại một phiên bản tương ứng (instance) cho bạn, còn việc bean đó có phụ thuộc vào các thành phần khác, cách nào để khởi tạo nó, bạn hoàn toàn không cần quan tâm.

Như một nhà hàng, muốn nấu món ăn, cần biết nguyên liệu và công thức nấu món, tương tự, IoC Container muốn quản lý các đối tượng kinh doanh và mối quan hệ phụ thuộc giữa chúng, cần thông qua một phương pháp nào đó để ghi lại và quản lý thông tin này. Đối tượng `BeanDefinition` đảm nhận trách nhiệm này: Mỗi bean trong container sẽ có một phiên bản BeanDefinition tương ứng, phiên bản này chịu trách nhiệm lưu trữ tất cả thông tin cần thiết về đối tượng bean, bao gồm loại class của đối tượng bean, xem có phải là abstract class hay không, constructor và tham số của nó, các thuộc tính khác v.v. Khi khách hàng yêu cầu đối tượng từ container, container sẽ dựa vào thông tin này để trả về cho khách hàng một phiên bản hoàn chỉnh của đối tượng bean có thể sử dụng được.

Các nguyên liệu đã sẵn sàng (hãy xem BeanDefinition là nguyên liệu), bắt đầu nấu ăn thôi, chờ chút, bạn cần một công thức nữa. `BeanDefinitionRegistry` và `BeanFactory` chính là cuốn sách này, BeanDefinitionRegistry trừu tượng hóa quy trình đăng ký bean, trong khi BeanFactory trừu tượng hóa quy trình quản lý bean. Các lớp triển khai của BeanFactory cụ thể hoá việc đăng ký và quản lý các bean. Mối quan hệ giữa chúng được minh họa trong biểu đồ dưới đây:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230725200019.png)

`DefaultListableBeanFactory` là một cài đặt BeanFactory phổ biến, nó cũng triển khai giao diện BeanDefinitionRegistry, do đó nó đảm nhận công việc đăng ký và quản lý bean. Giao diện BeanFactory chứa các phương thức quản lý bean như getBean, containBean, getType, getAliases, trong khi giao diện BeanDefinitionRegistry chứa các phương thức đăng ký và quản lý BeanDefinition như registerBeanDefinition, removeBeanDefinition, getBeanDefinition.

Dưới đây là một đoạn mã đơn giản để mô phỏng quá trình làm việc của BeanFactory:

```java
// Cài đặt mặc định của container
DefaultListableBeanFactory beanRegistry = new DefaultListableBeanFactory();
// Xây dựng BeanDefinition tương ứng với đối tượng kinh doanh
AbstractBeanDefinition definition = new RootBeanDefinition(Business.class,true);
// Đăng ký định nghĩa bean vào container
beanRegistry.registerBeanDefinition("beanName",definition);
// Nếu có nhiều bean, bạn cũng có thể chỉ định mối quan hệ phụ thuộc giữa các bean
// ........

// Sau đó, bạn có thể lấy phiên bản bean này từ container
// Lưu ý: beanRegistry thực chất triển khai giao diện BeanFactory, vì vậy có thể ép kiểu,
// BeanDefinitionRegistry đơn thuần không thể ép kiểu thành kiểu BeanFactory
BeanFactory container = (BeanFactory)beanRegistry;
Business business = (Business)container.getBean("beanName");
```

Đoạn mã này chỉ để giải thích quá trình làm việc cơ bản của BeanFactory, trong thực tế sẽ phức tạp hơn, ví dụ như mối quan hệ phụ thuộc giữa các bean có thể được xác định trong tệp cấu hình bên ngoài (XML/Properties) hoặc thông qua chú thích. Quá trình làm việc của toàn bộ Spring Container có thể chia thành hai giai đoạn chính:

①, Giai đoạn khởi động container

Khi khởi động container, nó sẽ tải `Configuration MetaData` thông qua một phương pháp nào đó. Ngoài cách trực tiếp thông qua mã nguồn, trong hầu hết các trường hợp, container cần phụ thuộc vào một số lớp tiện ích, ví dụ: `BeanDefinitionReader`. BeanDefinitionReader sẽ phân tích cú pháp và phân tích `Configuration MetaData` đã tải và tổ chức thông tin đã phân tích thành các BeanDefinition tương ứng. Cuối cùng, nó sẽ đăng ký các BeanDefinition này chứa định nghĩa bean vào BeanDefinitionRegistry tương ứng, từ đó hoàn thành quá trình khởi động của container. Giai đoạn này chủ yếu hoàn thành một số công việc chuẩn bị và tập trung vào việc thu thập thông tin quản lý các đối tượng bean. Tất nhiên, một số công việc xác minh hoặc hỗ trợ cũng được hoàn thành trong giai đoạn này.

Hãy xem một ví dụ đơn giản nhé. Trước đây, tất cả các bean được định nghĩa trong tệp cấu hình XML. Đoạn mã dưới đây sẽ mô phỏng cách BeanFactory tải các định nghĩa và quan hệ phụ thuộc của bean từ tệp cấu hình:

```java
// Thường là một lớp triển khai của BeanDefinitionRegistry, ở đây là DefaultListableBeanFactory
BeanDefinitionRegistry beanRegistry = new DefaultListableBeanFactory();
// XmlBeanDefinitionReader triển khai giao diện BeanDefinitionReader, được sử dụng để phân tích tệp XML
XmlBeanDefinitionReader beanDefinitionReader = new XmlBeanDefinitionReaderImpl(beanRegistry);
// Tải tệp cấu hình
beanDefinitionReader.loadBeanDefinitions("classpath:spring-bean.xml");

// Lấy phiên bản bean từ container
BeanFactory container = (BeanFactory)beanRegistry;
Business business = (Business)container.getBean("beanName");
```

②, Giai đoạn khởi tạo bean

Sau giai đoạn một, tất cả các định nghĩa bean đã được đăng ký vào BeanDefinitionRegistry thông qua BeanDefinition. Khi một yêu cầu thông qua phương thức getBean của container yêu cầu một đối tượng cụ thể, hoặc khi container cần gọi getBean một cách ngầm định do mối quan hệ phụ thuộc, hoạt động giai đoạn hai sẽ được kích hoạt: container sẽ kiểm tra xem đối tượng được yêu cầu đã được khởi tạo chưa. Nếu chưa, container sẽ khởi tạo object theo thông tin do BeanDefinition đã cung cấp và tiến hành tiêm các dependency cho nó. Sau khi object này đã được lắp ráp xong, container sẽ ngay lập tức trả về cho phương thức yêu cầu sử dụng.

BeanFactory chỉ là một cách triển khai của Spring Container, nếu không có chỉ định đặc biệt, nó sử dụng chiến lược khởi tạo trì hoãn: chỉ khi truy cập vào một đối tượng cụ thể trong container, nó mới thực hiện khởi tạo và tiêm phụ thuộc cho đối tượng đó. Trong thực tế, chúng ta thường sử dụng một loại container khác: `ApplicationContext`, nó được xây dựng trên nền tảng của BeanFactory, là một container cao cấp hơn, ngoài việc có tất cả các khả năng của BeanFactory, nó còn cung cấp hỗ trợ cho cơ chế lắng nghe sự kiện và hỗ trợ đa ngôn ngữ, v.v. Các đối tượng mà nó quản lý sẽ được khởi tạo và tiêm phụ thuộc vào trong quá trình khởi động của container.

### 1.2. Cơ chế mở rộng của Spring Container

Spring Container có trách nhiệm quản lý vòng đời của tất cả các bean trong container. Trong các giai đoạn khác nhau của vòng đời của bean, Spring cung cấp các điểm mở rộng khác nhau để thay đổi số phận của bean. Trong giai đoạn khởi động của container, `BeanFactoryPostProcessor` cho phép chúng ta thực hiện một số thao tác bổ sung trên thông tin được lưu trữ trong BeanDefinition đã đăng ký trong container trước khi container khởi tạo các đối tượng tương ứng. Điều này có thể bao gồm việc thay đổi một số thuộc tính của định nghĩa bean hoặc thêm thông tin khác.

Nếu muốn tùy chỉnh mở rộng lớp, thường chúng ta cần triển khai giao diện `org.springframework.beans.factory.config.BeanFactoryPostProcessor`. Đồng thời, vì container có thể có nhiều BeanFactoryPostProcessor, chúng ta cũng có thể triển khai giao diện `org.springframework.core.Ordered` để đảm bảo BeanFactoryPostProcessor được thực thi theo thứ tự. Spring cung cấp một số triển khai BeanFactoryPostProcessor, chúng ta sẽ lấy `PropertyPlaceholderConfigurer` làm ví dụ để giải thích quá trình làm việc của nó.

Trong tệp cấu hình XML của dự án Spring, thường có thể thấy nhiều giá trị cấu hình được sử dụng với các placeholder và giá trị mà placeholder đại diện cho được cấu hình riêng trong tệp properties độc lập. Điều này giúp quản lý các cấu hình phân tán trong các tệp XML khác nhau một cách hiệu quả, và cũng thuận tiện cho việc điều chỉnh các giá trị khác nhau theo từng môi trường khác nhau. Chức năng rất hữu ích này được `PropertyPlaceholderConfigurer` chịu trách nhiệm triển khai.

Dựa trên những gì đã được trình bày trước đó, khi BeanFactory hoàn thành việc tải tất cả thông tin cấu hình trong giai đoạn một, các thuộc tính của các đối tượng trong BeanFactory vẫn tồn tại dưới dạng các placeholder, ví dụ `${jdbc.mysql.url}`. Khi `PropertyPlaceholderConfigurer` được áp dụng như một BeanFactoryPostProcessor, nó sẽ sử dụng các giá trị trong tệp cấu hình properties để thay thế các giá trị của các placeholder tương ứng trong BeanDefinition. Khi cần khởi tạo bean, các giá trị thuộc tính trong định nghĩa bean đã được thay thế bằng các giá trị đã được cấu hình. Tất nhiên, việc triển khai thực tế phức tạp hơn mô tả ở trên, ở đây chỉ giải thích nguyên tắc hoạt động chung của nó, chi tiết hơn có thể được tham khảo trong mã nguồn của nó.

Tương tự, còn có `BeanPostProcessor`, tồn tại trong giai đoạn khởi tạo đối tượng. Tương tự như BeanFactoryPostProcessor, nó xử lý tất cả các đối tượng đã được tạo ra và thỏa mãn các điều kiện trong container. Để so sánh, BeanFactoryPostProcessor xử lý định nghĩa bean, trong khi BeanPostProcessor xử lý đối tượng sau khi nó đã được tạo ra. BeanPostProcessor định nghĩa hai phương thức:

```java
public interface BeanPostProcessor {
    // Xử lý trước khi khởi tạo
    Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException;
    // Xử lý sau khi khởi tạo
    Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException;
}
```

Để hiểu thời điểm thực thi hai phương thức này, hãy tìm hiểu vòng đời của bean:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230725202926.png)

Phương thức `postProcessBeforeInitialization()` tương ứng với bước xử lý trước khi khởi tạo và phương thức `postProcessAfterInitialization()` tương ứng với bước xử lý sau khi khởi tạo. Cả hai phương thức đều nhận tham chiếu đến phiên bản đối tượng bean và cung cấp khả năng mở rộng quá trình khởi tạo đối tượng. Trong đó, bạn có thể thực hiện bất kỳ hoạt động nào trên phiên bản được truyền vào. Các tính năng như chú thích, AOP sử dụng rất nhiều `BeanPostProcessor`, ví dụ: nếu có một chú thích tùy chỉnh, bạn có thể triển khai giao diện BeanPostProcessor và kiểm tra xem đối tượng bean có chú thích đó không. Nếu có, bạn có thể thực hiện bất kỳ hoạt động nào trên phiên bản bean này. Điều đó thật đơn giản, phải không?

Hãy xem một ví dụ phổ biến hơn. Trong Spring, chúng ta thường thấy các giao diện Aware khác nhau, chức năng của chúng là sau khi đối tượng được khởi tạo, chúng sẽ chèn các phụ thuộc được xác định trong giao diện Aware vào đối tượng hiện tại. Ví dụ phổ biến nhất là giao diện `ApplicationContextAware`, bất kỳ lớp nào triển khai giao diện này đều có thể truy cập vào đối tượng ApplicationContext. Khi quá trình khởi tạo từng đối tượng trong container đi qua bước tiền xử lý BeanPostProcessor, container sẽ kiểm tra và gọi ApplicationContextAwareProcessor đã được đăng ký trước đó, sau đó gọi phương thức `postProcessBeforeInitialization()` của nó để kiểm tra và đặt các phụ thuộc liên quan đến Aware. Hãy xem mã sau, nó rất đơn giản:

```java
// Mã nguồn từ: org.springframework.context.support.ApplicationContextAwareProcessor
// Phương thức postProcessBeforeInitialization gọi phương thức invokeAwareInterfaces
private void invokeAwareInterfaces(Object bean) {
    if (bean instanceof EnvironmentAware) {
        ((EnvironmentAware) bean).setEnvironment(this.applicationContext.getEnvironment());
    }
    if (bean instanceof ApplicationContextAware) {
        ((ApplicationContextAware) bean).setApplicationContext(this.applicationContext);
    }
    // ......
}
```

Cuối cùng, để tổng kết, phần này đã điểm lại một số nội dung cốt lõi của Spring Container. Các nội dung cốt lõi này đã đủ để bạn hiểu cách Spring Boot khởi động. Nếu bạn gặp phải những kiến thức khó hiểu trong quá trình đọc tiếp theo, hãy quay lại và xem lại kiến thức cốt lõi của Spring, có thể sẽ có hiệu quả không ngờ.

## 2. Củng cố nền tảng: JavaConfig và Annotation phổ biến

### 2.1. JavaConfig

Chúng ta biết rằng `bean` là một khái niệm rất quan trọng trong Spring IOC, nơi mà Spring Container quản lý vòng đời của các bean. Ban đầu, Spring sử dụng cách cấu hình bằng tệp XML để mô tả định nghĩa của bean và các mối quan hệ phụ thuộc giữa chúng. Tuy nhiên, theo sự phát triển của Spring, ngày càng nhiều người cảm thấy không hài lòng với cách tiếp cận này, vì tất cả các lớp kinh doanh trong dự án Spring đều được cấu hình dưới dạng bean trong tệp XML, dẫn đến việc có rất nhiều tệp XML, làm cho dự án trở nên phức tạp và khó quản lý.

Sau đó, dựa trên `Guice` - một framework Dependency Injection chỉ sử dụng Java Annotation thuần tuý, mà hiệu suất rõ ràng vượt trội hơn so với cách cấu hình bằng XML của Spring, thậm chí một số người cho rằng `Guice` có thể hoàn toàn thay thế Spring (tuy nhiên, Guice chỉ là một framework IOC nhẹ, nên vẫn còn lâu mới thay thế hoàn toàn Spring). Chính cảm giác khủng hoảng này đã thúc đẩy Spring và cộng đồng phát triển JavaConfig, một dự án con của Spring và liên tục cải thiện. `JavaConfig` sử dụng mã Java và Annotation để mô tả các mối quan hệ ràng buộc giữa các bean. Ví dụ, dưới đây là cách sử dụng cấu hình XML để mô tả định nghĩa của bean:

```xml
<bean id="bookService" class="com.moondev.service.BookServiceImpl"></bean>
```

Trong khi đó, cấu hình JavaConfig có dạng như sau:

```java
@Configuration
public class MoonBookConfiguration {

    // Bất kỳ phương thức nào được đánh dấu @Bean, giá trị trả về của nó sẽ được đăng ký làm một bean trong Spring Container
    // Tên phương thức mặc định trở thành id của định nghĩa bean
    @Bean
    public BookService bookService() {
        return new BookServiceImpl();
    }
}
```

Nếu hai bean có mối quan hệ phụ thuộc vào nhau, trong cấu hình XML sẽ như sau:

```xml
<bean id="bookService" class="com.moondev.service.BookServiceImpl">
    <property name="dependencyService" ref="dependencyService"/>
</bean>

<bean id="otherService" class="com.moondev.service.OtherServiceImpl">
    <property name="dependencyService" ref="dependencyService"/>
</bean>

<bean id="dependencyService" class="DependencyServiceImpl"/>
```

Trong khi đó, trong JavaConfig sẽ như sau:

```java
@Configuration
public class MoonBookConfiguration {

    // Nếu một bean phụ thuộc vào một bean khác, chỉ cần gọi phương thức tạo bean tương ứng trong lớp JavaConfig
    // Ở đây, chúng ta gọi trực tiếp dependencyService()
    @Bean
    public BookService bookService() {
        return new BookServiceImpl(dependencyService());
    }

    @Bean
    public OtherService otherService() {
        return new OtherServiceImpl(dependencyService());
    }

    @Bean
    public DependencyService dependencyService() {
        return new DependencyServiceImpl();
    }
}
```

Bạn có thể nhận thấy trong ví dụ này, có hai bean phụ thuộc vào dependencyService. Điều này có nghĩa là khi khởi tạo bookService, dependencyService() sẽ được gọi, và khi khởi tạo otherService, dependencyService() cũng sẽ được gọi. Vậy câu hỏi đặt ra là, trong IOC Container, có một hoặc hai phiên bản của dependencyService? Câu trả lời cho câu hỏi này để mọi người tự suy nghĩ, ở đây không tiếp tục trình bày.

### 2.2. @ComponentScan

Annotation `@ComponentScan` tương ứng với phần tử `<context:component-scan>` trong cấu hình XML, nó cho phép kích hoạt quá trình quét các thành phần (component) trong ứng dụng. Spring sẽ tự động quét và đăng ký các bean được cấu hình bằng Annotation vào trong IOC container. Chúng ta có thể sử dụng các thuộc tính như `basePackages` để chỉ định phạm vi quét của `@ComponentScan`. Nếu không chỉ định, mặc định Spring sẽ quét từ package chứa lớp chứa Annotation `@ComponentScan`. Đây cũng là lý do tại sao lớp khởi chạy của Spring Boot thường được đặt trong thư mục `src/main/java`.

### 2.3. @Import

Annotation `@Import` được sử dụng để import các lớp cấu hình vào. Ví dụ đơn giản như sau:

```java
@Configuration
public class MoonBookConfiguration {
    @Bean
    public BookService bookService() {
        return new BookServiceImpl();
    }
}
```

Giả sử có một lớp cấu hình khác, ví dụ: `MoonUserConfiguration`, trong đó có một bean phụ thuộc vào `bookService` trong `MoonBookConfiguration`. Làm thế nào để kết hợp hai bean này lại với nhau? Sử dụng `@Import`:

```java
@Configuration
// Có thể import nhiều lớp cấu hình cùng một lúc, ví dụ: @Import({A.class,B.class})
@Import(MoonBookConfiguration.class)
public class MoonUserConfiguration {
    @Bean
    public UserService userService(BookService bookService) {
        return new BookServiceImpl(bookService);
    }
}
```

Lưu ý rằng, trước phiên bản 4.2, Annotation `@Import` chỉ hỗ trợ import các lớp cấu hình. Tuy nhiên, từ phiên bản 4.2 trở đi, nó cũng hỗ trợ import các lớp thông thường và đăng ký lớp này như một định nghĩa bean trong IOC container.

### 2.4. @Conditional

Annotation `@Conditional` được sử dụng để chỉ định rằng một bean chỉ được khởi tạo hoặc một cấu hình chỉ được kích hoạt khi một điều kiện cụ thể được đáp ứng. Thông thường, nó được sử dụng trên các lớp được đánh dấu bằng `@Component`, `@Service`, `@Configuration` hoặc các phương thức được đánh dấu bằng `@Bean`. Nếu một lớp `@Configuration` được đánh dấu bằng `@Conditional`, tất cả các phương thức được đánh dấu bằng `@Bean` trong lớp đó và các lớp liên quan được import bằng `@Import` cũng sẽ tuân theo các điều kiện đó.

Trong Spring, bạn có thể dễ dàng viết các lớp điều kiện tùy chỉnh của riêng bạn bằng cách triển khai giao diện `Condition` và ghi đè phương thức `matches()`. Ví dụ, lớp điều kiện đơn giản sau chỉ định rằng bean chỉ được tạo ra khi lớp `JdbcTemplate` tồn tại trong classpath:

```java
public class JdbcTemplateCondition implements Condition {

    @Override
    public boolean matches(ConditionContext conditionContext, AnnotatedTypeMetadata annotatedTypeMetadata) {
        try {
            conditionContext.getClassLoader().loadClass("org.springframework.jdbc.core.JdbcTemplate");
            return true;
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return false;
    }
}
```

Khi bạn khai báo bean bằng Java, bạn có thể sử dụng lớp điều kiện tùy chỉnh này:

```java
@Conditional(JdbcTemplateCondition.class)
@Service
public MyService service() {
    ......
}
```

Trong ví dụ này, bean `MyService` chỉ được tạo ra khi điều kiện trong lớp `JdbcTemplateCondition` được đáp ứng. Điều này có nghĩa là việc khai báo bean này sẽ bị bỏ qua nếu không có `JdbcTemplate` tồn tại trong `classpath`.

Spring Boot định nghĩa nhiều điều kiện thú vị và áp dụng chúng vào các lớp cấu hình, tạo nên cơ sở của cấu hình tự động của Spring Boot. Cách Spring Boot áp dụng cấu hình có điều kiện là: định nghĩa nhiều Annotation có điều kiện đặc biệt và áp dụng chúng vào các lớp cấu hình. Dưới đây là một số Annotation có điều kiện mà Spring Boot cung cấp:

| Annotation có điều kiện         | Điều kiện cấu hình được kích hoạt                          |
| ------------------------------- | ------------------------------------------------------- |
| @ConditionalOnBean              | Đã cấu hình một bean cụ thể                              |
| @ConditionalOnMissingBean       | Không có bean cụ thể được cấu hình                       |
| @ConditionalOnClass             | Classpath có một lớp cụ thể                              |
| @ConditionalOnMissingClass      | Classpath không có một lớp cụ thể                         |
| @ConditionalOnExpression        | Kết quả của biểu thức Spring Expression Language là true |
| @ConditionalOnJava              | Phiên bản Java khớp với một giá trị cụ thể hoặc một phạm vi giá trị |
| @ConditionalOnProperty          | Thuộc tính cấu hình cụ thể phải có một giá trị xác định |
| @ConditionalOnResource          | Classpath có một tài nguyên cụ thể                       |
| @ConditionalOnWebApplication    | Đây là một ứng dụng Web                                  |
| @ConditionalOnNotWebApplication | Đây không phải là một ứng dụng Web                        |

### 2.5. @ConfigurationProperties và @EnableConfigurationProperties

Khi giá trị của một số thuộc tính cần được cấu hình, chúng ta thường tạo các mục cấu hình trong tệp `application.properties` và sử dụng Annotation `@Value` để lấy giá trị cấu hình đó trong bean. Ví dụ, đoạn mã sau cấu hình nguồn dữ liệu:

```java
// Cấu hình jdbc
jdbc.mysql.url=jdbc:mysql://localhost:3306/sampledb
jdbc.mysql.username=root
jdbc.mysql.password=123456
......

// Cấu hình nguồn dữ liệu
@Configuration
public class HikariDataSourceConfiguration {

    @Value("jdbc.mysql.url")
    public String url;
    @Value("jdbc.mysql.username")
    public String user;
    @Value("jdbc.mysql.password")
    public String password;

    @Bean
    public HikariDataSource dataSource() {
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(url);
        hikariConfig.setUsername(user);
        hikariConfig.setPassword(password);
        // Các dòng mã bị bỏ qua
        return new HikariDataSource(hikariConfig);
    }
}
```

Cách sử dụng Annotation `@Value` để tiêm giá trị vào thuộc tính thường đơn giản và nếu cùng một cấu hình được sử dụng ở nhiều nơi, việc bảo trì có thể trở nên không thuận tiện (nếu bạn muốn thay đổi tên cấu hình này, bạn sẽ phải thay đổi ở nhiều nơi). Đối với cấu hình phức tạp hơn, Spring Boot cung cấp một cách triển khai thanh lịch hơn, đó là sử dụng Annotation `@ConfigurationProperties`. Chúng ta có thể viết lại đoạn mã trên như sau:

```java
@Component
// Có thể sử dụng @PropertySource("classpath:jdbc.properties") để chỉ định tệp cấu hình
@ConfigurationProperties("jdbc.mysql")
// Tiền tố = jdbc.mysql, sẽ tìm các mục cấu hình jdbc.mysql.* trong tệp cấu hình
public class JdbcConfig {
    public String url;
    public String username;
    public String password;
}

@Configuration
public class HikariDataSourceConfiguration {

    @Autowired
    public JdbcConfig config;

    @Bean
    public HikariDataSource dataSource() {
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(config.url);
        hikariConfig.setUsername(config.username);
        hikariConfig.setPassword(config.password);
        // Các dòng mã bị bỏ qua
        return new HikariDataSource(hikariConfig);
    }
}
```

Annotation `@ConfigurationProperties` rất linh hoạt trong việc xử lý cấu hình phức tạp hơn. Ví dụ, nếu có tệp cấu hình như sau:

```java
#App
app.menus[0].title=Home
app.menus[0].name=Home
app.menus[0].path=/
app.menus[1].title=Login
app.menus[1].name=Login
app.menus[1].path=/login

app.compiler.timeout=5
app.compiler.output-folder=/temp/

app.error=/error/
```

Chúng ta có thể định nghĩa một lớp cấu hình như sau để nhận các thuộc tính này:

```java
@Component
@ConfigurationProperties("app")
public class AppProperties {

    public String error;
    public List<Menu> menus = new ArrayList<>();
    public Compiler compiler = new Compiler();

    public static class Menu {
        public String name;
        public String path;
        public String title;
    }

    public static class Compiler {
        public String timeout;
        public String outputFolder;
    }
}
```

Annotation `@EnableConfigurationProperties` cho phép hỗ trợ lồng nhúng `@ConfigurationProperties` và mặc định sẽ tiêm lớp Properties tương ứng như một bean vào trong IOC container, nghĩa là không cần thêm Annotation `@Component` trên lớp Properties tương ứng.

## 3. Cắt sắt như bùn: Giải thích chi tiết về SpringFactoriesLoader

JVM cung cấp 3 loại ClassLoader: `BootstrapClassLoader`, `ExtClassLoader` và `AppClassLoader` tương ứng với việc tải các thư viện lõi của Java, các thư viện mở rộng và các thư viện trên đường dẫn lớp của ứng dụng (CLASSPATH). JVM sử dụng mô hình ủy quyền kép để tải lớp, chúng ta cũng có thể triển khai ClassLoader riêng của mình bằng cách kế thừa java.lang.classloader.

Mô hình ủy quyền kép là gì? Khi một ClassLoader nhận nhiệm vụ tải lớp, nó sẽ trước tiên ủy quyền vụ này cho ClassLoader cha của nó để hoàn thành, do đó nhiệm vụ tải cuối cùng sẽ được chuyển đến BootstrapClassLoader ở đỉnh cùng, chỉ khi ClassLoader cha không thể hoàn thành nhiệm vụ tải , nó mới cố gắng tự tải lớp.

Một lợi ích của việc sử dụng mô hình ủy quyền kép là đảm bảo các ClassLoader khác nhau sử dụng cùng một đối tượng, điều này đảm bảo tính an toàn của loại hình lõi của Java, ví dụ: tải lớp `java.lang.Object` trong gói rt.jar, bất kể ClassLoader nào tải lớp này, cuối cùng đều được ủy quyền cho BootstrapClassLoader ở đỉnh cùng để tải, điều này đảm bảo rằng bất kỳ ClassLoader nào cũng nhận được cùng một đối tượng Object. Xem mã nguồn của ClassLoader, bạn sẽ hiểu rõ hơn về mô hình ủy quyền kép:

```java
protected Class<?> loadClass(String name, boolean resolve) {
    synchronized (getClassLoadingLock(name)) {
    // Đầu tiên, kiểm tra xem lớp đã được tải chưa, nếu tìm thấy lớp trong bộ nhớ cache của JVM, trả về trực tiếp
    Class<?> c = findLoadedClass(name);
    if (c == null) {
        try {
            // Tuân thủ mô hình ủy quyền kép, trước tiên sẽ tìm kiếm từ ClassLoader cha theo đệ quy,
            // cho đến khi ClassLoader cha là BootstrapClassLoader
            if (parent != null) {
                c = parent.loadClass(name, false);
            } else {
                c = findBootstrapClassOrNull(name);
            }
        } catch (ClassNotFoundException e) {}
        if (c == null) {
            // Nếu vẫn không tìm thấy, thử tìm kiếm bằng phương thức findClass
            // findClass được để lại để người phát triển tự triển khai, nghĩa là
            // khi triển khai ClassLoader tùy chỉnh, chỉ cần ghi đè phương thức này
           c = findClass(name);
        }
    }
    if (resolve) {
        resolveClass(c);
    }
    return c;
    }
}
```

Tuy nhiên, mô hình ủy quyền kép không thể giải quyết tất cả các vấn đề về lớp tải, ví dụ, Java cung cấp nhiều giao diện nhà cung cấp dịch vụ (Service Provider Interface - SPI), cho phép bên thứ ba cung cấp cài đặt cho các giao diện này. Các SPI phổ biến bao gồm JDBC, JNDI, JAXP, v.v. Các giao diện SPI này được cung cấp bởi thư viện lõi của Java, nhưng được cài đặt bởi bên thứ ba. Vấn đề ở đây là giao diện SPI là một phần của thư viện lõi của Java và được tải bởi BootstrapClassLoader; trong khi các lớp Java cài đặt SPI thường được tải bởi AppClassLoader. BootstrapClassLoader không thể tìm thấy các lớp cài đặt SPI vì nó chỉ tải các thư viện lõi của Java. Nó cũng không thể ủy quyền cho AppClassLoader vì nó là lớp tải trên cùng. Điều này có nghĩa là mô hình ủy quyền kép không thể giải quyết vấn đề này.

ClassLoader của ngữ cảnh luồng (`ContextClassLoader`) giải quyết vấn đề này một cách hoàn hảo. Từ tên gọi, có thể hiểu lầm rằng nó là một loại trình tải lớp mới, nhưng thực tế chỉ là một biến của lớp Thread và có thể được thiết lập và truy xuất thông qua `setContextClassLoader(ClassLoader cl)` và `getContextClassLoader()`. Nếu không thiết lập gì cả, trình tải lớp ngữ cảnh của luồng trong ứng dụng Java sẽ mặc định là AppClassLoader. Khi sử dụng giao diện SPI trong thư viện lõi, trình tải lớp tải được chuyển qua lớp tải ngữ cảnh của luồng, điều này cho phép tải thành công các lớp cài đặt SPI. Lớp tải ngữ cảnh của luồng được sử dụng trong nhiều cài đặt SPI. Tuy nhiên, trong JDBC, bạn có thể thấy một cách triển khai trực tiếp hơn, ví dụ, trong phương thức `loadInitialDrivers()` của DriverManager trong `java.sql.Driver`, bạn có thể thấy cách JDK tải các trình điều khiển:

```java
for (String aDriver : driversList) {
    try {
        // Sử dụng trực tiếp AppClassLoader
        Class.forName(aDriver, true, ClassLoader.getSystemClassLoader());
    } catch (Exception ex) {
        println("DriverManager.Initialize: load failed: " + ex);
    }
}
```

Thực tế, giải thích về lớp tải ngữ cảnh của luồng (Thread Context ClassLoader) chủ yếu là để mọi người không cảm thấy mơ hồ khi nhìn thấy `Thread.currentThread().getClassLoader()` và `Thread.currentThread().getContextClassLoader()`. Ngoài việc lấy ClassLoader từ các framework cấp thấp, hai phương thức này thường giống nhau trong hầu hết các tình huống kinh doanh, chỉ cần biết chúng tồn tại để giải quyết vấn đề gì là đủ.

Ngoài việc tải lớp, classloader còn có một chức năng quan trọng khác, đó là tải tài nguyên. Nó có thể đọc bất kỳ tệp tài nguyên nào từ gói jar, ví dụ: phương thức `ClassLoader.getResources(String name)` được sử dụng để đọc tệp tài nguyên từ gói jar, mã của nó như sau:

```java
public Enumeration<URL> getResources(String name) throws IOException {
    Enumeration<URL>[] tmp = (Enumeration<URL>[]) new Enumeration<?>[2];
    if (parent != null) {
        tmp[0] = parent.getResources(name);
    } else {
        tmp[0] = getBootstrapResources(name);
    }
    tmp[1] = findResources(name);
    return new CompoundEnumeration<>(tmp);
}
```

Cảm thấy hơi quen mắt phải không? Đúng vậy, logic của nó thực tế là giống như logic của việc tải lớp. Trước tiên, kiểm tra xem bộ tải lớp cha có rỗng hay không, nếu không rỗng thì uỷ quyền cho bộ tải lớp cha để thực hiện nhiệm vụ tìm kiếm tài nguyên, cho đến khi đến BootstrapClassLoader, cuối cùng mới đến lượt tự mình tìm kiếm. Và các trình tải lớp khác nhau chịu trách nhiệm quét các gói jar ở các đường dẫn khác nhau, giống như việc tải lớp, cuối cùng sẽ quét qua toàn bộ các gói jar và tìm ra các tệp tài nguyên phù hợp.

Phương thức `findResources(name)` của lớp ClassLoader sẽ duyệt qua tất cả các gói jar mà nó chịu trách nhiệm tải, và tìm ra các tệp nguồn có tên là name trong các gói jar đó. Tại đây, nguồn có thể là bất kỳ loại tệp nào, thậm chí là file `.class`. Ví dụ dưới đây được sử dụng để tìm kiếm tệp `Array.class`:

```java
// Tìm tệp Array.class
public static void main(String[] args) throws Exception{
    // Đường dẫn đầy đủ của Array.class
    String name = "java/sql/Array.class";
    Enumeration<URL> urls = Thread.currentThread().getContextClassLoader().getResources(name);
    while (urls.hasMoreElements()) {
        URL url = urls.nextElement();
        System.out.println(url.toString());
    }
}
```

Sau khi chạy, kết quả sẽ như sau:

```
$JAVA_HOME/jre/lib/rt.jar!/java/sql/Array.class
```

Dựa trên URL của tệp tài nguyên, bạn có thể xây dựng tệp tương ứng để đọc nội dung tài nguyên.

Khi nhìn thấy điều này, bạn có thể cảm thấy khá lạ lẫm, vì tôi đã nói sẽ giải thích về `SpringFactoriesLoader`, nhưng lại bắt đầu bằng việc giải thích về ClassLoader. Hãy xem mã nguồn của nó, bạn sẽ hiểu:

```java
public static final String FACTORIES_RESOURCE_LOCATION = "META-INF/spring.factories";
// Định dạng tệp spring.factories là: key=value1,value2,value3
// Tìm tệp META-INF/spring.factories trong tất cả các gói jar
// Sau đó, phân tích tệp để lấy tất cả các giá trị value cho key=factoryClass
public static List<String> loadFactoryNames(Class<?> factoryClass, ClassLoader classLoader) {
    String factoryClassName = factoryClass.getName();
    // Lấy URL của tệp tài nguyên
    Enumeration<URL> urls = (classLoader != null ? classLoader.getResources(FACTORIES_RESOURCE_LOCATION) : ClassLoader.getSystemResources(FACTORIES_RESOURCE_LOCATION));
    List<String> result = new ArrayList<String>();
    // Duyệt qua tất cả các URL
    while (urls.hasMoreElements()) {
        URL url = urls.nextElement();
        // Phân tích tệp properties dựa trên URL tài nguyên
        Properties properties = PropertiesLoaderUtils.loadProperties(new UrlResource(url));
        String factoryClassNames = properties.getProperty(factoryClassName);
        // Tạo danh sách và trả về
        result.addAll(Arrays.asList(StringUtils.commaDelimitedListToStringArray(factoryClassNames)));
    }
    return result;
}
```

Với kiến thức về ClassLoader đã được trình bày trước đó, khi hiểu mã nguồn này, bạn sẽ cảm thấy mọi thứ rõ ràng hơn: nó tìm kiếm tất cả các tệp cấu hình `META-INF/spring.factories` trong mỗi gói jar trong `CLASSPATH`, sau đó phân tích tệp properties và trả về các giá trị cấu hình tương ứng. Cần lưu ý rằng, nó không chỉ tìm kiếm trong đường dẫn ClassPath, mà còn quét tất cả các gói jar trong tất cả các đường dẫn, chỉ có tệp này chỉ xuất hiện trong các gói jar trong ClassPath. Hãy xem nội dung của tệp `spring.factories` một chút:

```java
// Đến từ `org.springframework.boot.autoconfigure` trong `META-INF/spring.factories`
// EnableAutoConfiguration sẽ được giải thích sau, nó được sử dụng để kích hoạt chức năng tự động cấu hình của Spring Boot
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.admin.SpringApplicationAdminJmxAutoConfiguration,\
org.springframework.boot.autoconfigure.aop.AopAutoConfiguration,\
org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration\
```

Sau khi chạy `loadFactoryNames(EnableAutoConfiguration.class, classLoader)`, bạn sẽ nhận được một danh sách các lớp `@Configuration`, bạn có thể khởi tạo các lớp này bằng phản chiếu và tiêm vào bên trong IOC Container. Cuối cùng, container sẽ có một loạt các lớp cấu hình JavaConfig được đánh dấu bằng `@Configuration`.

Đây chính là `SpringFactoriesLoader`, nó thực chất là một phương pháp mở rộng riêng của Spring Framework, tương tự như SPI, nhiều chức năng cốt lõi của Spring Boot dựa trên nó, hy vọng rằng mọi người có thể hiểu được.

## 4. Một vũ khí khác: Cơ chế lắng nghe sự kiện của Spring Container

Trong quá khứ, cơ chế lắng nghe sự kiện thường được sử dụng trong lập trình giao diện đồ họa, ví dụ như: nhấp chuột vào nút, nhập nội dung vào ô văn bản, v.v. được gọi là sự kiện. Khi sự kiện xảy ra, ứng dụng sẽ phản ứng tương ứng. Trên máy chủ, cơ chế lắng nghe sự kiện được sử dụng nhiều hơn cho thông báo bất đồng bộ, giám sát và xử lý ngoại lệ. Java cung cấp hai lớp cơ bản để triển khai cơ chế lắng nghe sự kiện: lớp sự kiện tùy chỉnh mở rộng từ `java.util.EventObject` và lớp lắng nghe sự kiện mở rộng từ `java.util.EventListener`. Hãy xem một ví dụ đơn giản: giám sát thời gian thực hiện một phương thức.

Đầu tiên, định nghĩa loại sự kiện, thường là mở rộng từ EventObject, các trạng thái tương ứng thường được đóng gói trong lớp này khi sự kiện xảy ra:

```java
public class MethodMonitorEvent extends EventObject {
    // Thời gian, được sử dụng để ghi lại thời gian bắt đầu thực thi phương thức
    public long timestamp;

    public MethodMonitorEvent(Object source) {
        super(source);
    }
}
```

Sau khi sự kiện được phát hành, lắng nghe sự kiện tương ứng có thể xử lý loại sự kiện này. Chúng ta có thể phát hành một sự kiện "begin" trước khi phương thức bắt đầu thực thi và phát hành một sự kiện "end" sau khi phương thức kết thúc. Tương ứng, lắng nghe sự kiện cần cung cấp phương thức để xử lý hai trường hợp này:

```java
// 1. Định nghĩa giao diện lắng nghe sự kiện
public interface MethodMonitorEventListener extends EventListener {
    // Xử lý sự kiện được phát hành trước khi phương thức bắt đầu thực thi
    public void onMethodBegin(MethodMonitorEvent event);
    // Xử lý sự kiện được phát hành khi phương thức kết thúc
    public void onMethodEnd(MethodMonitorEvent event);
}
// 2. Triển khai giao diện lắng nghe sự kiện: xử lý như thế nào
public class AbstractMethodMonitorEventListener implements MethodMonitorEventListener {

    @Override
    public void onMethodBegin(MethodMonitorEvent event) {
        // Ghi lại thời gian bắt đầu thực thi phương thức
        event.timestamp = System.currentTimeMillis();
    }

    @Override
    public void onMethodEnd(MethodMonitorEvent event) {
        // Tính thời gian thực hiện phương thức
        long duration = System.currentTimeMillis() - event.timestamp;
        System.out.println("Thời gian thực hiện: " + duration);
    }
}
```

Giao diện lắng nghe sự kiện định nghĩa các phương thức xử lý cho các sự kiện được phát hành trước khi phương thức bắt đầu và sau khi phương thức kết thúc. Quan trọng nhất là các phương thức này chỉ nhận tham số MethodMonitorEvent, cho thấy lớp lắng nghe sự kiện chỉ đảm nhận việc lắng nghe và xử lý sự kiện tương ứng. Sau khi có sự kiện và lắng nghe sự kiện, chỉ cần phát hành sự kiện và cho phép lắng nghe tương ứng lắng nghe và xử lý. Thông thường, chúng ta sẽ có một nguồn phát sự kiện, nó là nguồn sự kiện trong chính nó và trong thời điểm thích hợp, nó sẽ phát hành sự kiện tương ứng cho lắng nghe sự kiện tương ứng:

```java
public class MethodMonitorEventPublisher {

    private List<MethodMonitorEventListener> listeners = new ArrayList<MethodMonitorEventListener>();

    public void methodMonitor() {
        MethodMonitorEvent eventObject = new MethodMonitorEvent(this);
        publishEvent("begin", eventObject);
        // Giả lập việc thực thi phương thức: ngủ 5 giây
        TimeUnit.SECONDS.sleep(5);
        publishEvent("end", eventObject);

    }

    private void publishEvent(String status, MethodMonitorEvent event) {
        // Tránh việc lắng nghe bị loại bỏ trong quá trình xử lý sự kiện, ở đây làm một bản sao để đảm bảo an toàn
        List<MethodMonitorEventListener> copyListeners = new ArrayList<MethodMonitorEventListener>(listeners);
        for (MethodMonitorEventListener listener : copyListeners) {
            if ("begin".equals(status)) {
                listener.onMethodBegin(event);
            } else {
                listener.onMethodEnd(event);
            }
        }
    }

    public static void main(String[] args) {
        MethodMonitorEventPublisher publisher = new MethodMonitorEventPublisher();
        publisher.addEventListener(new AbstractMethodMonitorEventListener());
        publisher.methodMonitor();
    }
    // Các phương thức triển khai bị lược bỏ
    public void addEventListener(MethodMonitorEventListener listener) {}
    public void removeEventListener(MethodMonitorEventListener listener) {}
    public void removeAllListeners() {}
```

Đối với nguồn phát sự kiện (nguồn sự kiện), thường cần quan tâm đến hai điểm:

1. Phát hành sự kiện vào thời điểm thích hợp. Phương thức methodMonitor() trong ví dụ này là nguồn sự kiện, nó phát hành sự kiện MethodMonitorEvent vào hai thời điểm trước khi phương thức bắt đầu thực thi và sau khi phương thức kết thúc. Sự kiện được phát hành tại mỗi thời điểm sẽ được chuyển đến lắng nghe sự kiện tương ứng để xử lý. Trong việc triển khai cụ thể, cần lưu ý rằng việc phát hành sự kiện là tuần tự, để không ảnh hưởng đến hiệu suất xử lý, logic xử lý của lắng nghe sự kiện nên đơn giản.
2. Quản lý lắng nghe sự kiện. Lớp publisher cung cấp các phương thức đăng ký và gỡ bỏ lắng nghe sự kiện, điều này cho phép khách hàng quyết định xem có cần đăng ký một lắng nghe sự kiện mới hay gỡ bỏ một lắng nghe sự kiện cụ thể. Nếu không cung cấp phương thức gỡ bỏ, các ví dụ lắng nghe đã đăng ký sẽ vẫn được tham chiếu bởi MethodMonitorEventPublisher, ngay cả khi nó đã không còn được sử dụng nữa, nó vẫn tồn tại trong danh sách lắng nghe của nguồn sự kiện, điều này có thể dẫn đến rò rỉ bộ nhớ tiềm ẩn.

#### Cơ chế lắng nghe sự kiện trong Spring Container

Tất cả các loại sự kiện trong ApplicationContext của Spring đều kế thừa từ `org.springframework.context.ApplicationEvent`, tất cả các lắng nghe sự kiện trong container đều triển khai `org.springframework.context.ApplicationListener` và được đăng ký dưới dạng bean trong container. Khi một sự kiện ApplicationEvent hoặc một loại con của nó được phát hành trong container, các ApplicationListener đã đăng ký trong container sẽ xử lý các sự kiện này.

Bạn đã đoán được rồi đúng không?

ApplicationEvent kế thừa từ EventObject, Spring cung cấp một số triển khai mặc định, ví dụ: `ContextClosedEvent` đại diện cho sự kiện được phát hành khi container sắp đóng, `ContextRefreshedEvent` đại diện cho sự kiện được phát hành khi container được khởi tạo hoặc làm mới, v.v.

Container sử dụng ApplicationListener làm giao diện lắng nghe sự kiện, nó kế thừa từ EventListener. Khi ApplicationContext khởi động, nó sẽ tự động nhận dạng và tải các bean kiểu ApplicationListener. Khi có sự kiện được phát hành trong container, các ApplicationListener đã đăng ký sẽ được thông báo về các sự kiện này.

Giao diện ApplicationContext kế thừa từ giao diện ApplicationEventPublisher, giao diện này cung cấp phương thức `void publishEvent(ApplicationEvent event)` để định nghĩa, không khó nhận ra rằng ApplicationContext đóng vai trò như một nguồn phát sự kiện. Nếu quan tâm, bạn có thể xem mã nguồn của phương thức `AbstractApplicationContext.publishEvent(ApplicationEvent event)`: ApplicationContext chịu trách nhiệm cho việc phát hành sự kiện và quản lý lắng nghe sự kiện bằng cách sử dụng một triển khai của giao diện ApplicationEventMulticaster. Khi container khởi động, nó sẽ kiểm tra xem trong container có đối tượng ApplicationEventMulticaster có tên là applicationEventMulticaster không. Nếu có, nó sẽ sử dụng triển khai này, nếu không, nó sẽ khởi tạo một SimpleApplicationEventMulticaster mặc định làm triển khai.

Cuối cùng, nếu chúng ta cần phát hành sự kiện trong container, chỉ cần tiêm phụ thuộc vào ApplicationEventPublisher: triển khai giao diện ApplicationEventPublisherAware hoặc ApplicationContextAware (hãy xem lại phần Aware trong bài viết trước).

## 5. Tuyệt vời: Làm sáng tỏ nguyên tắc cấu hình tự động

Lớp khởi động của ứng dụng Spring Boot thường được đặt trong thư mục gốc `src/main/java`, ví dụ như lớp `MoonApplication`:

```java
@SpringBootApplication
public class MoonApplication {

    public static void main(String[] args) {
        SpringApplication.run(MoonApplication.class, args);
    }
}
```

Trong đó, `@SpringBootApplication` kích hoạt quá trình quét thành phần và tự động cấu hình. `SpringApplication.run` được sử dụng để khởi động ứng dụng. `@SpringBootApplication` là một `Annotation` kết hợp, nó kết hợp ba `Annotation` hữu ích lại với nhau:

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = {
        @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
        @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {
    // ......
}
```

`@SpringBootConfiguration` tương đương với `@Configuration`, đây là một `Annotation` của Spring, chỉ định rằng lớp này là một lớp cấu hình `JavaConfig`. `@ComponentScan` kích hoạt quá trình quét thành phần, như đã được đề cập chi tiết trong phần trước. Tại đây, chúng ta tập trung vào `@EnableAutoConfiguration`.

`@EnableAutoConfiguration` cho biết chức năng tự động cấu hình của Spring Boot đã được bật. Spring Boot sẽ suy luận ra các bean bạn cần dựa trên các phụ thuộc của ứng dụng, các bean tùy chỉnh và xem xét có tồn tại một số lớp trong classpath hay không, sau đó đăng ký chúng vào IOC Container. Vậy làm sao `@EnableAutoConfiguration` có thể suy luận ra yêu cầu của bạn? Đầu tiên, hãy xem định nghĩa của nó:

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import(EnableAutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration {
    // ......
}
```

Bạn nên tập trung vào `@Import(EnableAutoConfigurationImportSelector.class)`. Như đã đề cập trước đó, `@Import` được sử dụng để nhập lớp và đăng ký nó như một bean vào container. Ở đây, nó sẽ nhập `EnableAutoConfigurationImportSelector` như một bean và đưa nó vào container, lớp này sẽ tải tất cả các cấu hình `@Configuration` phù hợp vào container. Hãy xem mã nguồn của nó:

```java
public String[] selectImports(AnnotationMetadata annotationMetadata) {
    // Bỏ qua phần mã nguồn lớn và chỉ giữ lại một dòng mã quan trọng
    // Lưu ý: Trong phiên bản gần đây nhất của Spring Boot, dòng mã này đã được đóng gói trong một phương thức riêng
    // Vui lòng tham khảo kiến thức liên quan đến SpringFactoriesLoader trong phần trước
    List<String> factories = new ArrayList<String>(new LinkedHashSet<String>(
        SpringFactoriesLoader.loadFactoryNames(EnableAutoConfiguration.class, this.beanClassLoader)));
}
```

Lớp này sẽ quét tất cả các gói jar và tải tất cả các lớp cấu hình phù hợp vào container, mỗi lớp cấu hình sẽ quyết định dựa trên các cấu hình điều kiện xem có nên được kích hoạt hay không. Hãy xem nội dung của tệp `META-INF/spring.factories`:

```java
// Đến từ `org.springframework.boot.autoconfigure` trong `META-INF/spring.factories`
// Key được cấu hình là EnableAutoConfiguration, giống với mã nguồn
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,\
org.springframework.boot.autoconfigure.aop.AopAutoConfiguration,\
org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration\
.....
```

Ví dụ với `DataSourceAutoConfiguration`, hãy xem cách Spring Boot tự động cấu hình:

```java
@Configuration
@ConditionalOnClass({ DataSource.class, EmbeddedDatabaseType.class })
@EnableConfigurationProperties(DataSourceProperties.class)
@Import({ Registrar.class, DataSourcePoolMetadataProvidersConfiguration.class })
public class DataSourceAutoConfiguration {
}
```

Hãy tìm hiểu một số điểm quan trọng:

- `@ConditionalOnClass({ DataSource.class, EmbeddedDatabaseType.class })`: Chỉ kích hoạt cấu hình này khi có lớp DataSource hoặc EmbeddedDatabaseType trong Classpath, nếu không, cấu hình này sẽ bị bỏ qua.
- `@EnableConfigurationProperties(DataSourceProperties.class)`: Đưa lớp cấu hình mặc định của DataSource vào IOC container, DataSourceProperties được định nghĩa như sau:

```java
// Cung cấp hỗ trợ cho thông tin cấu hình của datasource, tất cả các tiền tố cấu hình là: spring.datasource
@ConfigurationProperties(prefix = "spring.datasource")
public class DataSourceProperties  {
    private ClassLoader classLoader;
    private Environment environment;
    private String name = "testdb";
    ......
}
```

- `@Import({ Registrar.class, DataSourcePoolMetadataProvidersConfiguration.class })`: Nhập các cấu hình bổ sung khác, hãy lấy `DataSourcePoolMetadataProvidersConfiguration` làm ví dụ:

```java
@Configuration
public class DataSourcePoolMetadataProvidersConfiguration {

    @Configuration
    @ConditionalOnClass(org.apache.tomcat.jdbc.pool.DataSource.class)
    static class TomcatDataSourcePoolMetadataProviderConfiguration {
        @Bean
        public DataSourcePoolMetadataProvider tomcatPoolDataSourceMetadataProvider() {
            .....
        }
    }
  ......
}
```

`DataSourcePoolMetadataProvidersConfiguration` là một lớp cấu hình cho nhà cung cấp của bể kết nối cơ sở dữ liệu, nghĩa là nếu `org.apache.tomcat.jdbc.pool.DataSource.class` tồn tại trong Classpath, sẽ sử dụng bể kết nối tomcat-jdbc, nếu `HikariDataSource.class` tồn tại trong Classpath, sẽ sử dụng bể kết nối Hikari.

Đây chỉ là một phần nhỏ của `DataSourceAutoConfiguration`, nhưng đủ để giải thích cách Spring Boot sử dụng cấu hình điều kiện để thực hiện tự động cấu hình. Nhìn lại, `@EnableAutoConfiguration` đã nhập `EnableAutoConfigurationImportSelector` làm bean vào container, và lớp này sẽ tải tất cả các cấu hình `@Configuration` phù hợp vào container. Mỗi cấu hình sẽ quyết định dựa trên cấu hình điều kiện để xem có nên kích hoạt hay không, từ đó thực hiện tự động cấu hình.

Quá trình này rất rõ ràng, nhưng có một vấn đề lớn bị bỏ qua: `EnableAutoConfigurationImportSelector.selectImports()` được thực hiện khi nào? Trên thực tế, phương thức này sẽ được thực hiện trong quá trình khởi động của container: `AbstractApplicationContext.refresh()`. Chi tiết hơn sẽ được giải thích trong phần tiếp theo.

## 6. Hướng dẫn ​​khởi động: Bí mật của việc khởi động ứng dụng Spring Boot

### 6.1 Khởi tạo SpringApplication

Quá trình khởi động của Spring Boot được chia thành hai bước: khởi tạo đối tượng SpringApplication và thực thi phương thức run của đối tượng đó. Hãy xem quá trình khởi tạo của SpringApplication, trong phương thức khởi tạo của SpringApplication, nó gọi phương thức `initialize(Object[] sources)`, mã như sau:

```java
private void initialize(Object[] sources) {
     if (sources != null && sources.length > 0) {
         this.sources.addAll(Arrays.asList(sources));
     }
     // Kiểm tra xem có phải là dự án Web không
     this.webEnvironment = deduceWebEnvironment();
     setInitializers((Collection) getSpringFactoriesInstances(ApplicationContextInitializer.class));
     setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));
     // Tìm lớp main
     this.mainApplicationClass = deduceMainApplicationClass();
}
```

Trong quá trình khởi tạo, điều quan trọng nhất là sử dụng SpringFactoriesLoader để tìm các lớp triển khai của hai giao diện `ApplicationContextInitializer` và `ApplicationListener` được cấu hình trong tệp `spring.factories`, để xây dựng các thể hiện tương ứng sau này. Mục đích chính của `ApplicationContextInitializer` là cấu hình hoặc xử lý thêm cho thể hiện `ConfigurableApplicationContext` trước khi nó được làm mới. `ConfigurableApplicationContext` kế thừa từ `ApplicationContext` và cung cấp khả năng cấu hình cho `ApplicationContext`.

Việc triển khai `ApplicationContextInitializer` rất đơn giản vì nó chỉ có một phương thức, nhưng trong hầu hết các trường hợp, chúng ta không cần phải tạo ra một `ApplicationContextInitializer` tùy chỉnh. Ngay cả trong Spring Boot, nó cũng chỉ đăng ký hai triển khai mặc định. Sau cùng, Spring Container đã rất thành công và ổn định, bạn không cần phải thay đổi nó.

Và mục đích của `ApplicationListener` thì không cần phải nói nhiều, nó là một cách triển khai framework của Spring cho cơ chế lắng nghe sự kiện trong Java. Nội dung chi tiết đã được trình bày kỹ trong phần giới thiệu về cơ chế lắng nghe sự kiện trong Spring ở phần trước. Đến đây là nói chuyện chính, nếu bạn muốn thêm một bộ lắng nghe vào ứng dụng Spring Boot thì phải làm như thế nào?

Spring Boot cung cấp hai cách để thêm trình lắng nghe tùy chỉnh:

- Sử dụng phương thức `SpringApplication.addListeners(ApplicationListener… listeners)` hoặc `SpringApplication.setListeners(Collection<ApplicationListener<?>> listeners)` để thêm một hoặc nhiều trình lắng nghe tùy chỉnh.
- Vì quá trình khởi tạo của SpringApplication đã lấy được các lớp triển khai của ApplicationListener từ `spring.factories`, vì vậy chúng ta chỉ cần thêm cấu hình mới trong tệp `META-INF/spring.factories` của gói jar của chúng ta:

```
org.springframework.context.ApplicationListener=\
com.moondev.listeners.xxxxListener\
```

Về quá trình khởi tạo của SpringApplication, chúng ta chỉ nói đến đây.

### 6.2 Quy trình khởi động của Spring Boot

Toàn bộ quy trình khởi động ứng dụng Spring Boot được đóng gói trong phương thức SpringApplication.run, quy trình này thực sự rất dài và phức tạp, nhưng về bản chất chỉ là mở rộng trên nền tảng khởi động của Spring Container. Hãy xem mã nguồn theo cách này:

```
public ConfigurableApplicationContext run(String... args) {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        ConfigurableApplicationContext context = null;
        FailureAnalyzers analyzers = null;
        configureHeadlessProperty();
        // ①
        SpringApplicationRunListeners listeners = getRunListeners(args);
        listeners.starting();
        try {
            // ②
            ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
            ConfigurableEnvironment environment = prepareEnvironment(listeners,applicationArguments);
            // ③
            Banner printedBanner = printBanner(environment);
            // ④
            context = createApplicationContext();
            // ⑤
            analyzers = new FailureAnalyzers(context);
            // ⑥
            prepareContext(context, environment, listeners, applicationArguments,printedBanner);
            // ⑦
            refreshContext(context);
            // ⑧
            afterRefresh(context, applicationArguments);
            // ⑨
            listeners.finished(context, null);
            stopWatch.stop();
            return context;
        }
        catch (Throwable ex) {
            handleRunFailure(context, listeners, analyzers, ex);
            throw new IllegalStateException(ex);
        }
    }
```

① Sử dụng SpringFactoriesLoader để tìm và tải tất cả các SpringApplicationRunListeners, thông qua việc gọi phương thức starting() thông báo cho tất cả các SpringApplicationRunListeners: Ứng dụng bắt đầu khởi động. SpringApplicationRunListeners thực chất là một bộ phát sự kiện, nó phát các sự kiện ứng dụng khác nhau (ApplicationEvent) tại các thời điểm khác nhau trong quá trình khởi động ứng dụng Spring Boot. Nếu có bất kỳ người nghe sự kiện (ApplicationListener) nào quan tâm đến các sự kiện này, nó có thể nhận và xử lý chúng. Bạn còn nhớ quá trình khởi tạo khi SpringApplication tải một loạt ApplicationListener không? Quá trình khởi động này không có mã phát sự kiện, thực chất đã được thực hiện ở đây, trong SpringApplicationRunListeners.

Phân tích đơn giản về quy trình thực hiện, trước hết hãy xem mã nguồn của SpringApplicationRunListener:

```java
public interface SpringApplicationRunListener {

    // Được gọi ngay khi phương thức run được thực thi, có thể sử dụng để khởi tạo công việc rất sớm
    void starting();

    // Được gọi sau khi môi trường đã được chuẩn bị và trước khi ApplicationContext được tạo
    void environmentPrepared(ConfigurableEnvironment environment);

    // Được gọi ngay sau khi ApplicationContext được tạo
    void contextPrepared(ConfigurableApplicationContext context);

    // Được gọi sau khi ApplicationContext đã được tải, trước khi thực hiện refresh
    void contextLoaded(ConfigurableApplicationContext context);

    // Được gọi trước khi phương thức run kết thúc
    void finished(ConfigurableApplicationContext context, Throwable exception);

}
```

SpringApplicationRunListener chỉ có một lớp triển khai: EventPublishingRunListener. Phần mã nguồn ở ① chỉ nhận được một phiên bản của EventPublishingRunListener, hãy xem nội dung của phương thức starting():

```java
public void starting() {
    // Phát ra một sự kiện ApplicationStartedEvent
    this.initialMulticaster.multicastEvent(new ApplicationStartedEvent(this.application, this.args));
}
```

Theo luồng logic này, bạn có thể tìm thấy ở ② trong mã nguồn của phương thức prepareEnvironment() dòng mã `listeners.environmentPrepared(environment);` tức là phương thức thứ hai của giao diện SpringApplicationRunListener, và không ngạc nhiên, nó lại phát ra một sự kiện khác là ApplicationEnvironmentPreparedEvent. Tiếp theo sẽ xảy ra gì, bạn có thể tự tìm hiểu được rồi đúng không?

② Tạo và cấu hình `Environment` sẽ được ứng dụng sử dụng. Environment được sử dụng để mô tả môi trường chạy hiện tại của ứng dụng, nó trừu tượng hóa hai khía cạnh: cấu hình (profile) và thuộc tính (properties). Những người có kinh nghiệm phát triển sẽ không xa lạ với hai khái niệm này: các môi trường khác nhau (ví dụ: môi trường sản xuất, môi trường staging) có thể sử dụng các tệp cấu hình khác nhau, và thuộc tính có thể được lấy từ các nguồn như tệp cấu hình, biến môi trường, tham số dòng lệnh, v.v. Do đó, khi Environment đã sẵn sàng, bạn có thể truy cập tài nguyên từ Environment bất kỳ lúc nào trong ứng dụng.

Tóm lại, hai dòng mã ở ② chủ yếu thực hiện các công việc sau:

- Kiểm tra xem Environment có tồn tại không, nếu không tồn tại thì tạo mới (nếu là dự án web thì tạo `StandardServletEnvironment`, ngược lại tạo `StandardEnvironment`).
- Cấu hình Environment: cấu hình profile và properties.
- Gọi phương thức `environmentPrepared()` của SpringApplicationRunListener để thông báo cho người nghe sự kiện: Environment của ứng dụng đã sẵn sàng.

③, Khi ứng dụng Spring Boot khởi động, nó sẽ in ra dòng thông tin như sau:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::        (v1.5.6.RELEASE)
```

Nếu bạn muốn thay đổi dòng thông tin này thành dòng thông tin tùy chỉnh của riêng mình, bạn có thể nghiên cứu về cách triển khai Banner, nhưng nhiệm vụ này để cho bạn tự thực hiện.

④, Tạo ApplicationContext dựa trên loại dự án là web hay không web.

⑤, Tạo một loạt `FailureAnalyzer`, quá trình này vẫn là sử dụng SpringFactoriesLoader để tìm và tạo các instance của các class triển khai FailureAnalyzer. FailureAnalyzer được sử dụng để phân tích lỗi và cung cấp thông tin chẩn đoán liên quan.

⑥, Khởi tạo ApplicationContext, chủ yếu thực hiện các công việc sau:

- Đặt Environment đã chuẩn bị tốt cho ApplicationContext.
- Lặp qua tất cả các ApplicationContextInitializer và gọi phương thức `initialize()` để xử lý ApplicationContext đã được tạo.
- Gọi phương thức `contextPrepared()` của SpringApplicationRunListener để thông báo cho người nghe sự kiện: ApplicationContext đã sẵn sàng.
- Tải tất cả các bean vào container.
- Gọi phương thức `contextLoaded()` của SpringApplicationRunListener để thông báo cho người nghe sự kiện: ApplicationContext đã được tải.

⑦, Gọi phương thức `refresh()` của ApplicationContext để hoàn tất quá trình khởi tạo của container IoC. Từ tên gọi, "refresh" có nghĩa là làm mới container, nhưng điều đó có nghĩa là gì? Hãy xem mã nguồn dưới đây:

```
// Trích từ một dòng mã trong phương thức refresh()
invokeBeanFactoryPostProcessors(beanFactory);
```

Hãy xem cài đặt của phương thức này:

```
protected void invokeBeanFactoryPostProcessors(ConfigurableListableBeanFactory beanFactory) {
    PostProcessorRegistrationDelegate.invokeBeanFactoryPostProcessors(beanFactory, getBeanFactoryPostProcessors());
    ......
}
```

Nó lấy tất cả các `BeanFactoryPostProcessor` để thực hiện một số thao tác bổ sung trên container. BeanFactoryPostProcessor cho phép chúng ta thực hiện một số thao tác bổ sung trên thông tin được lưu trữ trong BeanDefinition đã đăng ký trong container trước khi đối tượng tương ứng được khởi tạo. Phương thức `getBeanFactoryPostProcessors()` ở đây trả về 3 Processor:

```
ConfigurationWarningsApplicationContextInitializer$ConfigurationWarningsPostProcessor
SharedMetadataReaderFactoryContextInitializer$CachingMetadataReaderFactoryPostProcessor
ConfigFileApplicationListener$PropertySourceOrderingPostProcessor
```

Dù có nhiều lớp triển khai của BeanFactoryPostProcessor, tại sao chỉ có 3 ở đây? Vì trong quá trình khởi tạo, chỉ có 3 trong số các ApplicationContextInitializer và ApplicationListener đã được đề cập ở trên thực hiện một số thao tác tương tự như sau:

```
public void initialize(ConfigurableApplicationContext context) {
    context.addBeanFactoryPostProcessor(new ConfigurationWarningsPostProcessor(getChecks()));
}
```

Sau đó, bạn có thể tiếp tục vào phương thức `PostProcessorRegistrationDelegate.invokeBeanFactoryPostProcessors()`, phương thức này không chỉ duyệt qua 3 BeanFactoryPostProcessor đã đề cập ở trên mà còn lấy bean có kiểu `BeanDefinitionRegistryPostProcessor`: `org.springframework.context.annotation.internalConfigurationAnnotationProcessor`, tương ứng với lớp `ConfigurationClassPostProcessor`. `ConfigurationClassPostProcessor` được sử dụng để phân tích và xử lý các chú thích khác nhau, bao gồm: @Configuration, @ComponentScan, @Import, @PropertySource, @ImportResource, @Bean. Khi xử lý chú thích `@import`, nó sẽ gọi `EnableAutoConfigurationImportSelector.selectImports()` như đã đề cập trong phần "Tự động cấu hình" ở trên. Tôi sẽ không giải thích chi tiết các phần khác, nếu bạn quan tâm, bạn có thể tham khảo tài liệu tham khảo 6.

⑧, Tìm và thực thi CommandLineRunner và ApplicationRunner đã được đăng ký trong context hiện tại, nếu có.

⑨, Thực thi phương thức `finished()` của tất cả SpringApplicationRunListener.

Đó là toàn bộ quy trình khởi động của Spring Boot, trung tâm của nó vẫn là sự khởi tạo và khởi động của Spring Container, hiểu rõ quy trình khởi động của Spring Container, quy trình khởi động của Spring Boot sẽ không còn là vấn đề khó khăn nữa.
