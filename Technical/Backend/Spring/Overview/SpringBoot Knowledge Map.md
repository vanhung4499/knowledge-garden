---
title: SpringBoot Knowledge Map
tags: [spring, springboot, java, backend]
categories: [spring, springboot, java, backend]
date created: 2023-07-25
date modified: 2024-02-21
---

# Danh sách kiến thức SpringBoot

> 1. Cảnh báo: Bài viết này rất dài, khuyến nghị đánh dấu trước khi xem!
> 2. Giải thích: Phần đầu có 4 mục nhỏ về kiến thức cơ bản của Spring, bao gồm: IOC Container, JavaConfig, Lắng nghe sự kiện, Giải thích SpringFactoriesLoader, chúng chiếm phần lớn nội dung của bài viết này. Mặc dù chúng có thể không có nhiều liên hệ với nhau, nhưng những kiến thức này rất quan trọng để hiểu nguyên lý cốt lõi của Spring Boot. Nếu bạn quen thuộc với Spring Framework, bạn hoàn toàn có thể bỏ qua 4 mục nhỏ này. Chính vì loạt bài viết này được tạo thành từ những điểm kiến thức có vẻ không liên quan, nên được đặt tên là Danh sách kiến thức.

Trong nhiều năm qua trong hệ sinh thái Spring, không gì thú vị hơn framework Spring Boot. Có thể thấy từ tên gọi, mục đích thiết kế ban đầu của framework này là khởi động nhanh ứng dụng Spring. Do đó, ứng dụng Spring Boot về bản chất là một ứng dụng dựa trên Spring Framework, đây là sản phẩm tốt nhất của Spring với triết lý "quy ước trước cấu hình", nó có thể giúp nhà phát triển xây dựng ứng dụng dựa trên hệ sinh thái Spring một cách nhanh chóng và hiệu quả hơn.

Vậy Spring Boot có gì đặc biệt? **Cấu hình tự động**, **phụ thuộc khởi động**, **Actuator**, **interface dòng lệnh (CLI)** là 4 tính năng cốt lõi quan trọng nhất của Spring Boot, trong đó CLI là tính năng tùy chọn của Spring Boot, mặc dù nó rất mạnh mẽ, nhưng cũng đã đưa vào một mô hình phát triển không quá thông thường, do đó, loạt bài viết này chỉ tập trung vào 3 tính năng khác. Như tiêu đề bài viết, bài viết này là phần đầu tiên của loạt bài, sẽ mở cánh cửa Spring Boot cho bạn, tập trung giải thích quá trình khởi động và nguyên lý thực hiện cấu hình tự động. Để nắm bắt phần cốt lõi này, việc hiểu một số kiến thức cơ bản về Spring Framework sẽ giúp bạn hiệu quả hơn.

## 1. Ném đá dẫn lối: Khám phá Container IoC của Spring

Nếu bạn đã xem mã nguồn của phương thức `SpringApplication.run()`, bạn chắc chắn sẽ phát điên với quy trình khởi động dài ngắt ngữ của Spring Boot. Nhìn vào bản chất, SpringApplication chỉ kế thừa quy trình khởi động của một ứng dụng Spring điển hình. Do đó, việc hiểu rõ về Container Spring là chiếc chìa khóa để mở cánh cửa của Spring Boot.

### 1.1. Container IoC của Spring

Bạn có thể coi Container IoC của Spring như một nhà hàng, khi bạn đến nhà hàng, bạn thường sẽ gọi ngay phục vụ: Đặt món! Về nguyên liệu của món ăn? Làm thế nào để từ nguyên liệu tạo ra món ăn? Có thể bạn không quan tâm chút nào. IoC Container cũng tương tự, bạn chỉ cần nói cho nó biết bạn cần một bean nào đó, nó sẽ ném cho bạn một phiên bản tương ứng, về việc bean này có phụ thuộc vào các thành phần khác hay không, làm thế nào để hoàn thành việc khởi tạo của nó, bạn hoàn toàn không cần phải quan tâm.

Để làm một nhà hàng, bạn cần biết nguyên liệu và công thức cho món ăn, tương tự, IoC Container muốn quản lý các đối tượng kinh doanh và mối quan hệ phụ thuộc giữa chúng, cần thông qua một số cách để ghi lại và quản lý thông tin này. Đối tượng `BeanDefinition` đảm nhiệm trách nhiệm này: mỗi bean trong container đều sẽ có một phiên bản BeanDefinition tương ứng, phiên bản này chịu trách nhiệm lưu trữ tất cả thông tin cần thiết về đối tượng bean, bao gồm kiểu lớp của đối tượng bean, liệu nó có phải là một lớp trừu tượng không, phương thức và tham số khởi tạo, các thuộc tính khác, v.v. Khi khách hàng yêu cầu container cung cấp một đối tượng tương ứng, container sẽ sử dụng thông tin này để trả về một phiên bản bean hoàn chỉnh và có thể sử dụng cho khách hàng.

Nguyên liệu đã được chuẩn bị (xem BeanDefinition như nguyên liệu), bắt đầu nấu ăn, chờ một chút, bạn cần một công thức, `BeanDefinitionRegistry` và `BeanFactory` chính là công thức này, BeanDefinitionRegistry trừu tượng hóa logic đăng ký bean, trong khi BeanFactory thì trừu tượng hóa logic quản lý bean, và các lớp BeanFactory thực hiện cụ thể nhiệm vụ đăng ký và quản lý bean. Mối quan hệ giữa chúng như hình dưới đây:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230725200019.png)

`DefaultListableBeanFactory` là một triển khai BeanFactory khá phổ biến, đồng thời nó cũng thực hiện interface BeanDefinitionRegistry, do đó nó đảm nhận công việc đăng ký và quản lý Bean. Từ hình, bạn có thể thấy rằng interface BeanFactory chủ yếu bao gồm các phương thức quản lý bean như getBean, containBean, getType, getAliases, v.v., trong khi interface BeanDefinitionRegistry bao gồm các phương thức đăng ký và quản lý BeanDefinition như registerBeanDefinition, removeBeanDefinition, getBeanDefinition, v.v.

Dưới đây là một đoạn mã đơn giản để mô phỏng quá trình làm việc của BeanFactory:

```java
// Triển khai container mặc định
DefaultListableBeanFactory beanRegistry = new DefaultListableBeanFactory();
// Xây dựng BeanDefinition tương ứng dựa trên đối tượng kinh doanh
AbstractBeanDefinition definition = new RootBeanDefinition(Business.class,true);
// Đăng ký định nghĩa bean vào container
beanRegistry.registerBeanDefinition("beanName",definition);
// Nếu có nhiều bean, bạn cũng có thể chỉ định mối quan hệ phụ thuộc giữa các bean
// ........

// Sau đó, bạn có thể lấy phiên bản của bean này từ container
// Lưu ý: beanRegistry ở đây thực sự thực hiện interface BeanFactory, vì vậy nó có thể được chuyển đổi,
// BeanDefinitionRegistry thuần túy không thể chuyển đổi sang kiểu BeanFactory
BeanFactory container = (BeanFactory)beanRegistry;
Business business = (Business)container.getBean("beanName");
```

Đoạn mã này chỉ để minh họa quy trình làm việc cơ bản của BeanFactory, thực tế sẽ phức tạp hơn, ví dụ, mối quan hệ phụ thuộc giữa các bean có thể được định nghĩa trong các tệp cấu hình bên ngoài (XML/Properties) hoặc bằng cách sử dụng chú thích. Quy trình làm việc toàn diện của Container Spring IoC có thể được chia thành hai giai đoạn:

①, Giai đoạn khởi động container

Khi container khởi động, nó sẽ tải `Configuration MetaData` thông qua một số cách. Ngoài việc sử dụng mã một cách trực tiếp, trong hầu hết các trường hợp, container cần phụ thuộc vào một số lớp tiện ích, ví dụ: `BeanDefinitionReader`, BeanDefinitionReader sẽ phân tích và phân tích `Configuration MetaData` đã tải và tổ chức thông tin sau phân tích thành BeanDefinition tương ứng, cuối cùng, các BeanDefinition đã lưu trữ định nghĩa bean sẽ được đăng ký với BeanDefinitionRegistry tương ứng, và công việc khởi động của container sẽ hoàn thành. Giai đoạn này chủ yếu hoàn thành một số công việc chuẩn bị, tập trung hơn vào việc thu thập thông tin quản lý đối tượng bean, tất nhiên, một số công việc xác thực hoặc hỗ trợ cũng được hoàn thành trong giai đoạn này.

Hãy xem một ví dụ đơn giản, trong quá khứ, tất cả các bean đều được định nghĩa trong tệp cấu hình XML, mã sau sẽ mô phỏng cách BeanFactory tải định nghĩa bean và mối quan hệ phụ thuộc từ tệp cấu hình:

```java
// Thường là lớp thực hiện BeanDefinitionRegistry, ở đây chúng tôi sử dụng DefaultListabeBeanFactory
BeanDefinitionRegistry beanRegistry = new DefaultListableBeanFactory();
// XmlBeanDefinitionReader thực hiện interface BeanDefinitionReader, được sử dụng để phân tích tệp XML
XmlBeanDefinitionReader beanDefinitionReader = new XmlBeanDefinitionReaderImpl(beanRegistry);
// Tải tệp cấu hình
beanDefinitionReader.loadBeanDefinitions("classpath:spring-bean.xml");

// Lấy phiên bản bean từ container
BeanFactory container = (BeanFactory)beanRegistry;
Business business = (Business)container.getBean("beanName");
```

②, Giai đoạn khởi tạo bean

Sau giai đoạn đầu tiên, tất cả các định nghĩa bean đều được đăng ký với BeanDefinitionRegistry thông qua BeanDefinition. Khi một yêu cầu nào đó yêu cầu một đối tượng thông qua phương thức getBean của container, hoặc do mối quan hệ phụ thuộc mà container cần gọi getBean một cách ngầm định, nó sẽ kích hoạt hoạt động giai đoạn thứ hai: container sẽ kiểm tra trước xem đối tượng được yêu cầu đã được khởi tạo chưa. Nếu chưa, nó sẽ khởi tạo đối tượng được yêu cầu dựa trên thông tin được cung cấp bởi BeanDefinition đã đăng ký và chèn phụ thuộc vào đối tượng đó. Sau khi đối tượng này được lắp ráp xong, container sẽ ngay lập tức trả nó về cho phương thức yêu cầu để sử dụng.

BeanFactory chỉ là một cách triển khai của container IoC Spring, trừ khi được chỉ định cụ thể, nó sẽ sử dụng chiến lược khởi tạo trễ: chỉ khi truy cập vào một đối tượng nào đó trong container, đối tượng đó mới được khởi tạo và tiêm phụ thuộc. Tuy nhiên, trong các tình huống thực tế, chúng tôi thường sử dụng một loại container khác: `ApplicationContext`. Nó được xây dựng trên cơ sở BeanFactory, là một loại container cấp cao hơn. Ngoài tất cả khả năng của BeanFactory, nó còn cung cấp hỗ trợ cho cơ chế lắng nghe sự kiện cũng như hỗ trợ đa ngôn ngữ, v.v. Tất cả các bean mà nó quản lý, đều hoàn thành khởi tạo và tiêm phụ thuộc khi container khởi động.

### 1.2. Cơ chế kế thừa của Spring Container

Container IoC chịu trách nhiệm quản lý vòng đời của tất cả các bean trong container, và tại các giai đoạn khác nhau của vòng đời bean, Spring cung cấp các điểm kế thừa khác nhau để thay đổi số phận của bean. Trong giai đoạn khởi động của container, `BeanFactoryPostProcessor` cho phép chúng ta thực hiện một số hoạt động bổ sung trên thông tin được lưu trong BeanDefinition đã đăng ký với container trước khi container khởi tạo các đối tượng tương ứng, chẳng hạn như sửa đổi một số thuộc tính của định nghĩa bean hoặc thêm thông tin khác, v.v.

Nếu bạn muốn tùy chỉnh lớp kế thừa, thường cần triển khai interface `org.springframework.beans.factory.config.BeanFactoryPostProcessor`, đồng thời, vì có thể có nhiều BeanFactoryPostProcessor trong container, bạn có thể cần triển khai interface `org.springframework.core.Ordered` để đảm bảo BeanFactoryPostProcessor được thực hiện theo thứ tự. Spring cung cấp một số ít triển khai BeanFactoryPostProcessor, và chúng tôi sẽ sử dụng `PropertyPlaceholderConfigurer` để minh họa quy trình làm việc tổng thể của nó.

Trong tệp cấu hình XML của dự án Spring, bạn thường thấy nhiều giá trị cấu hình sử dụng placeholder, và giá trị mà placeholder đại diện được cấu hình riêng biệt trong tệp properties riêng biệt, điều này cho phép quản lý tập trung các cấu hình rải rác trong các tệp XML khác nhau, và cũng thuận tiện cho việc cấu hình giá trị khác nhau theo môi trường khác nhau bởi nhóm vận hành. Chức năng rất hữu ích này được thực hiện bởi PropertyPlaceholderConfigurer.

Theo như đã nói ở trên, khi BeanFactory hoàn thành việc tải tất cả thông tin cấu hình ở giai đoạn đầu tiên, các thuộc tính của đối tượng được lưu trong BeanFactory vẫn tồn tại dưới dạng placeholder, chẳng hạn như `${jdbc.mysql.url}`. Khi PropertyPlaceholderConfigurer được áp dụng như một BeanFactoryPostProcessor, nó sẽ sử dụng các giá trị trong tệp cấu hình properties để thay thế giá trị thuộc tính mà placeholder trong BeanDefinition tương ứng đại diện. Khi cần khởi tạo bean, giá trị thuộc tính trong định nghĩa bean đã được thay thế bằng giá trị mà chúng tôi đã cấu hình. Tất nhiên, việc triển khai của nó phức tạp hơn mô tả ở trên, ở đây chỉ để minh họa nguyên tắc làm việc tổng thể, bạn có thể tham khảo mã nguồn của nó để biết thêm chi tiết.

Tương tự, còn có `BeanPostProcessor`, nó tồn tại trong giai đoạn khởi tạo đối tượng. Giống như BeanFactoryPostProcessor, nó sẽ xử lý tất cả các đối tượng đã khởi tạo và đáp ứng điều kiện trong container. Đơn giản so sánh, BeanFactoryPostProcessor xử lý định nghĩa bean, trong khi BeanPostProcessor xử lý đối tượng sau khi hoàn thành khởi tạo bean. BeanPostProcessor định nghĩa hai interface:

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

Phương thức `postProcessBeforeInitialization()` và `postProcessAfterInitialization()` tương ứng với các bước xử lý trước và xử lý sau trong hình sẽ thực thi. Cả hai phương thức này đều truyền vào tham chiếu của đối tượng bean, cung cấp sự thuận tiện lớn cho việc kế thừa quá trình khởi tạo đối tượng của container, ở đây bạn có thể thực hiện bất kỳ hoạt động nào trên đối tượng được truyền vào. Chức năng của chú thích, AOP, v.v., đều sử dụng nhiều `BeanPostProcessor`, chẳng hạn như một chú thích tùy chỉnh, bạn hoàn toàn có thể triển khai interface BeanPostProcessor, trong đó xác định xem có chú thích nào trên đầu của đối tượng bean không, nếu có, bạn có thể thực hiện bất kỳ hoạt động nào trên đối tượng bean này, hãy nghĩ xem, có đơn giản không?

Hãy xem một ví dụ phổ biến hơn, trong Spring, bạn thường thấy nhiều interface Aware khác nhau, mục đích của chúng là sau khi hoàn thành khởi tạo đối tượng, chúng sẽ chèn phụ thuộc được định nghĩa trong interface Aware vào đối tượng hiện tại. Chẳng hạn như interface `ApplicationContextAware` phổ biến nhất, các lớp triển khai interface này đều có thể nhận được một đối tượng ApplicationContext. Khi quá trình khởi tạo mỗi đối tượng trong container đi đến bước xử lý trước của BeanPostProcessor, container sẽ phát hiện ra ApplicationContextAwareProcessor đã đăng ký trước đó, sau đó nó sẽ gọi phương thức postProcessBeforeInitialization() của nó, kiểm tra và thiết lập phụ thuộc Aware liên quan. Hãy xem mã, có đơn giản không:

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

## 2. Củng cố nền tảng: JavaConfig và các Annotation phổ biến

### 2.1. JavaConfig

Chúng ta biết rằng `bean` là một khái niệm rất cốt lõi trong Spring IOC, và Spring Container chịu trách nhiệm quản lý vòng đời của bean. Ban đầu, Spring sử dụng tệp cấu hình XML để mô tả định nghĩa của bean cũng như mối quan hệ phụ thuộc giữa chúng, nhưng với sự phát triển của Spring, ngày càng nhiều người không hài lòng với cách tiếp cận này, bởi vì tất cả các lớp dịch vụ của dự án Spring đều được cấu hình dưới dạng bean trong các tệp XML, tạo ra một số lượng lớn tệp XML, khiến dự án trở nên phức tạp và khó quản lý.

Sau đó, `Guice`, một framework phụ thuộc Injection dựa trên Java Annotation thuần túy, ra đời, hiệu suất của nó rõ ràng vượt trội so với Spring sử dụng cách tiếp cận XML, thậm chí một số người cho rằng `Guice` có thể hoàn toàn thay thế Spring (tuy `Guice` chỉ là một framework IOC nhẹ nhàng, việc thay thế Spring vẫn còn xa). Chính cảm giác khủng hoảng này đã thúc đẩy Spring và cộng đồng giới thiệu và liên tục hoàn thiện dự án con `JavaConfig`, nó dựa trên mã Java và Annotation để mô tả mối quan hệ liên kết phụ thuộc giữa các bean. Ví dụ, dưới đây là cách sử dụng cấu hình XML để mô tả định nghĩa bean:

```xml
<bean id="bookService" class="com.moondev.service.BookServiceImpl"></bean>
```

Trong khi đó, cấu hình JavaConfig có dạng như sau:

```java
@Configuration
public class MoonBookConfiguration {

    // Bất kỳ phương thức nào được đánh dấu với @Bean, giá trị trả về của nó sẽ được đăng ký như một bean trong Spring IOC Container
    // Tên phương thức mặc định trở thành id của định nghĩa bean
    @Bean
    public BookService bookService() {
        return new BookServiceImpl();
    }
}
```

Nếu hai bean có mối quan hệ phụ thuộc, trong cấu hình XML sẽ như sau:

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

    // Nếu một bean phụ thuộc vào một bean khác, chỉ cần gọi phương thức tạo bean phụ thuộc tương ứng trong lớp JavaConfig
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

Bạn có thể chú ý rằng trong ví dụ này, có hai bean đều phụ thuộc vào dependencyService, tức là khi khởi tạo bookService, chúng ta sẽ gọi `dependencyService()`, và khi khởi tạo otherService, chúng ta cũng sẽ gọi `dependencyService()`. Vậy câu hỏi đặt ra là: trong trường hợp này, trong IOC Container có một hoặc hai instance của dependencyService? Câu hỏi này để cho mọi người suy nghĩ, chúng tôi sẽ không đi sâu vào đây.

### 2.2. @ComponentScan

Annotation `@ComponentScan` tương ứng với phần tử `<context:component-scan>` trong cấu hình XML, đại diện cho việc kích hoạt quét thành phần, Spring sẽ tự động quét tất cả các bean được cấu hình thông qua annotation, sau đó đăng ký chúng vào IOC Container. Chúng ta có thể chỉ định phạm vi quét tự động của `@ComponentScan`thông qua các thuộc tính như `basePackages`, nếu không chỉ định, nó sẽ mặc định quét từ package chứa lớp khai báo `@ComponentScan`. Chính vì điều này, lớp khởi động SpringBoot thường mặc định nằm trong `src/main/java`.

### 2.3. @Import

Annotation `@Import` được sử dụng để nhập các lớp cấu hình, hãy xem một ví dụ đơn giản:

```java
@Configuration
public class MoonBookConfiguration {
    @Bean
    public BookService bookService() {
        return new BookServiceImpl();
    }
}
```

Bây giờ có một lớp cấu hình khác, ví dụ: `MoonUserConfiguration`, trong lớp cấu hình này có một bean phụ thuộc vào bookService trong `MoonBookConfiguration`. Làm thế nào để kết hợp hai bean này lại với nhau? Chúng ta có thể sử dụng `@Import`:

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

Cần lưu ý rằng, trước phiên bản 4.2, annotation `@Import` chỉ hỗ trợ nhập các lớp cấu hình, nhưng sau phiên bản 4.2, nó hỗ trợ nhập các lớp thông thường và đăng ký lớp này như một định nghĩa bean vào IOC Container.

### 2.4. @Conditional

Annotation `@Conditional` chỉ ra rằng chỉ khi một điều kiện nào đó được thỏa mãn, một bean sẽ được khởi tạo hoặc một số cấu hình sẽ được kích hoạt. Nó thường được sử dụng trên các lớp được đánh dấu bởi các annotation như `@Component`, `@Service`, `@Configuration`, hoặc trên các phương thức được đánh dấu bởi `@Bean`. Nếu một lớp `@Configuration` được đánh dấu với `@Conditional`, thì tất cả các phương thức được đánh dấu `@Bean` và các lớp liên quan được nhập bởi annotation `@Import` sẽ tuân theo các điều kiện này.

Trong Spring, bạn có thể dễ dàng viết lớp điều kiện của riêng mình, chỉ cần thực hiện interface `Condition` và ghi đè phương thức `matches()`của nó. Ví dụ, lớp điều kiện đơn giản dưới đây chỉ có hiệu lực khi lớp `JdbcTemplate` tồn tại trong `Classpath`:

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

Trong ví dụ này, bean MyService chỉ được tạo khi điều kiện của lớp `JdbcTemplateCondition` được thỏa mãn. Điều này nghĩa là việc tạo bean MyService phụ thuộc vào việc `JdbcTemplate` có mặt trong `classpath` hay không, nếu không, khai báo bean này sẽ bị bỏ qua.

`Spring Boot` đã định nghĩa nhiều điều kiện thú vị và áp dụng chúng vào các lớp cấu hình, những lớp cấu hình này tạo nên cơ sở của cấu hình tự động trong `Spring Boot`. Phương pháp mà `Spring Boot` sử dụng để cấu hình có điều kiện là: định nghĩa nhiều annotation có điều kiện đặc biệt và áp dụng chúng lên các lớp cấu hình. Dưới đây là một số annotation có điều kiện mà `Spring Boot` cung cấp:

|Annotation có điều kiện|Điều kiện để cấu hình có hiệu lực|
|---|---|
|@ConditionalOnBean|Cấu hình một bean cụ thể|
|@ConditionalOnMissingBean|Không cấu hình một bean cụ thể|
|@ConditionalOnClass|Có một lớp cụ thể trong Classpath|
|@ConditionalOnMissingClass|Không có một lớp cụ thể trong Classpath|
|@ConditionalOnExpression|Biểu thức Spring Expression Language trả về true|
|@ConditionalOnJava|Phiên bản Java phù hợp với một giá trị cụ thể hoặc phạm vi|
|@ConditionalOnProperty|Một thuộc tính cấu hình cụ thể có một giá trị rõ ràng|
|@ConditionalOnResource|Có một tài nguyên cụ thể trong Classpath|
|@ConditionalOnWebApplication|Đây là một ứng dụng Web|
|@ConditionalOnNotWebApplication|Đây không phải là một ứng dụng Web|

### 2.5. @ConfigurationProperties và @EnableConfigurationProperties

Khi giá trị của một số thuộc tính cần được cấu hình, chúng ta thường tạo các mục cấu hình mới trong tệp `application.properties`, sau đó sử dụng annotation `@Value` trong bean để lấy giá trị cấu hình. Ví dụ như đoạn mã cấu hình nguồn dữ liệu (datasource) dưới đây:

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

Các thuộc tính được tiêm bằng annotation `@Value` thường khá đơn giản, nhưng nếu một cấu hình được sử dụng ở nhiều nơi, việc duy trì cũng trở nên khó khăn (hãy tưởng tượng nếu có hàng chục nơi sử dụng một cấu hình nào đó, và bây giờ bạn muốn thay đổi tên, bạn sẽ làm gì?). Đối với các cấu hình phức tạp hơn, Spring Boot cung cấp một cách thực hiện tinh tế hơn, đó là annotation `@ConfigurationProperties`. Chúng ta có thể viết lại đoạn mã trên như sau:

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
        // Bỏ qua một số đoạn mã
        return new HikariDataSource(hikariConfig);
    }
}
```

`@ConfigurationProperties` rất tiện lợi khi xử lý các cấu hình phức tạp hơn, chẳng hạn như tệp cấu hình sau:

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

Bạn có thể định nghĩa lớp cấu hình sau để nhận các thuộc tính này:

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

Annotation `@EnableConfigurationProperties` cho biết sự hỗ trợ nhúng của `@ConfigurationProperties`. Theo mặc định, nó sẽ đưa lớp Properties tương ứng vào IOC container dưới dạng một bean, tức là không cần phải thêm annotation `@Component` vào lớp Properties tương ứng.

## 3. Cắt sắt như bùn: Giải thích chi tiết về SpringFactoriesLoader

JVM cung cấp 3 loại class loader: `BootstrapClassLoader`, `ExtClassLoader`, `AppClassLoader` để tải lớp thư viện cốt lõi Java, thư viện kế thừa và thư viện lớp của ứng dụng (đường dẫn `CLASSPATH`) tương ứng. JVM sử dụng mô hình ủy quyền cho cha mẹ (parent delegation model) để tải lớp, và chúng ta cũng có thể tạo class loader của riêng mình bằng cách kế thừa từ `java.lang.classloader`.

Mô hình ủy quyền cho cha mẹ là gì? Khi một class loader nhận nhiệm vụ tải lớp, nó sẽ trước tiên giao nhiệm vụ đó cho class loader cha của mình để hoàn thành. Do đó, cuối cùng nhiệm vụ tải sẽ được chuyển đến class loader ở cấp độ cao nhất, `BootstrapClassLoader`. Chỉ khi class loader cha không thể hoàn thành nhiệm vụ tải lớp, class loader này mới thử tải lớp bằng chính nó.

Một lợi ích của việc sử dụng mô hình ủy quyền cho cha mẹ là đảm bảo rằng các đối tượng thu được từ các class loader khác nhau đều là cùng một đối tượng. Điều này giúp đảm bảo tính an toàn của kiểu dữ liệu trong thư viện cốt lõi Java. Ví dụ, khi tải lớp `java.lang.Object` nằm trong gói rt.jar, bất kể class loader nào tải lớp này, cuối cùng nó đều được ủy quyền cho `BootstrapClassLoader` ở cấp độ cao nhất để tải. Điều này đảm bảo rằng bất kỳ class loader nào cũng sẽ nhận được cùng một đối tượng Object. Khi xem mã nguồn của ClassLoader, bạn sẽ có cái nhìn trực quan hơn về mô hình ủy quyền cho cha mẹ:

```java
protected Class<?> loadClass(String name, boolean resolve) {
    synchronized (getClassLoadingLock(name)) {
    // Đầu tiên, kiểm tra xem lớp này đã được tải hay chưa.
    // Nếu tìm thấy lớp này trong bộ nhớ đệm JVM, thì trả về ngay lập tức.
    Class<?> c = findLoadedClass(name);
    if (c == null) {
        try {
            // Tuân theo mô hình ủy quyền cho cha mẹ, đầu tiên sẽ tìm từ class loader cha thông qua đệ quy,
            // cho đến khi class loader cha là BootstrapClassLoader.
            if (parent != null) {
                c = parent.loadClass(name, false);
            } else {
                c = findBootstrapClassOrNull(name);
            }
        } catch (ClassNotFoundException e) {}
        if (c == null) {
            // Nếu vẫn không tìm thấy, thử tìm qua phương thức findClass.
            // Phương thức findClass được dành cho nhà phát triển tự triển khai,
            // tức là, khi tạo class loader tùy chỉnh, bạn chỉ cần ghi đè phương thức này.
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

Tuy nhiên, mô hình ủy quyền cho cha mẹ không thể giải quyết tất cả các vấn đề liên quan đến class loader. Ví dụ, Java cung cấp nhiều interface cung cấp dịch vụ (`Service Provider Interface`, SPI), cho phép bên thứ ba cung cấp các triển khai cho các interface này. Các SPI phổ biến bao gồm JDBC, JNDI, JAXP, v.v. interface của các SPI này được cung cấp bởi thư viện cốt lõi, nhưng được triển khai bởi bên thứ ba, điều này tạo ra một vấn đề: interface SPI là một phần của thư viện cốt lõi Java, được `BootstrapClassLoader` tải; các lớp Java triển khai SPI thường được `AppClassLoader` tải. `BootstrapClassLoader` không thể tìm thấy lớp triển khai SPI, vì nó chỉ tải thư viện cốt lõi Java. Nó cũng không thể ủy quyền cho `AppClassLoader`, vì nó là class loader ở cấp độ cao nhất. Nói cách khác, mô hình ủy quyền cho cha mẹ không thể giải quyết vấn đề này.

Class loader ngữ cảnh của luồng (`ContextClassLoader`) giải quyết được vấn đề này. Từ tên, bạn có thể hiểu lầm rằng đây là một loại class loader mới. Trên thực tế, nó chỉ là một biến của lớp Thread, có thể được thiết lập và lấy thông qua các phương thức `setContextClassLoader(ClassLoader cl)` và `getContextClassLoader()`. Nếu không thiết lập gì, class loader ngữ cảnh của luồng trong ứng dụng Java mặc định sẽ là `AppClassLoader`. Khi thư viện cốt lõi sử dụng interface SPI, class loader được truyền đi sử dụng class loader ngữ cảnh của luồng, từ đó có thể tải thành công lớp triển khai SPI. Class loader ngữ cảnh của luồng được sử dụng trong nhiều triển khai SPI. Tuy nhiên, trong JDBC, bạn có thể thấy một cách triển khai trực tiếp hơn. Ví dụ, trong quản lý driver JDBC `java.sql.Driver`, trong phương thức `loadInitialDrivers()`, bạn có thể thấy trực tiếp cách JDK tải driver:

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

Thực ra, mục đích chính khi giải thích về class loader ngữ cảnh của luồng là để khi bạn gặp `Thread.currentThread().getClassLoader()` và `Thread.currentThread().getContextClassLoader()`, bạn sẽ không cảm thấy bối rối. Ngoại trừ việc class loader thu được từ nhiều khung sườn cơ sở có thể khác nhau khi sử dụng hai phương thức này, trong hầu hết các tình huống khác, chúng đều giống nhau. Bạn chỉ cần biết rằng nó tồn tại để giải quyết vấn đề gì.

Ngoài việc tải class, class loader còn có một chức năng rất quan trọng khác, đó là tải tài nguyên. Nó có thể đọc bất kỳ tệp tài nguyên nào từ gói jar, ví dụ, phương thức `ClassLoader.getResources(String name)`được sử dụng để đọc tệp tài nguyên trong gói jar, mã của nó như sau:

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

Bạn có cảm giác quen thuộc không? Đúng vậy, logic của nó thực sự giống với logic tải lớp. Đầu tiên, nó kiểm tra xem class loader cha có rỗng không, nếu không rỗng thì ủy quyền cho class loader cha thực hiện nhiệm vụ tìm kiếm tài nguyên, cho đến khi đến BootstrapClassLoader, cuối cùng mới đến lượt nó tự tìm kiếm. Và class loader khác nhau sẽ quét các gói jar ở các đường dẫn khác nhau, giống như tải class, cuối cùng nó sẽ quét tất cả các gói jar, tìm thấy các tệp tài nguyên phù hợp.

Phương thức `findResources(name)` của class loader sẽ duyệt qua tất cả các gói jar mà nó có trách nhiệm tải, tìm thấy các tệp tài nguyên có tên là name trong gói jar. Tài nguyên ở đây có thể là bất kỳ tệp nào, thậm chí là tệp .class, ví dụ dưới đây, được sử dụng để tìm tệp Array.class:

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

Khi chạy, bạn có thể nhận được kết quả sau:

```
$JAVA_HOME/jre/lib/rt.jar!/java/sql/Array.class
```

Dựa vào URL của tệp tài nguyên, bạn có thể tạo tệp tương ứng để đọc nội dung tài nguyên.

Đến đây, bạn có thể thấy rất lạ, bạn không phải đang giải thích `SpringFactoriesLoader` sao? Tại sao lại nói một đống về ClassLoader? Hãy xem mã nguồn của nó, bạn sẽ hiểu:

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

Với kiến thức về ClassLoader từ trước, việc hiểu đoạn mã này trở nên dễ dàng hơn: Tìm kiếm tất cả các tệp cấu hình `META-INF/spring.factories` từ mỗi gói Jar trong `CLASSPATH`, sau đó phân tích tệp properties, tìm thấy cấu hình với tên chỉ định và trả về. Điều cần lưu ý là, ở đây không chỉ tìm kiếm trong đường dẫn ClassPath, mà còn quét tất cả các gói Jar ở tất cả các đường dẫn, nhưng tệp này chỉ có trong các gói jar trong Classpath. Hãy xem nội dung của tệp `spring.factories`:

```java
// Từ META-INF/spring.factories dưới org.springframework.boot.autoconfigure
// EnableAutoConfiguration sẽ được giới thiệu sau, nó được sử dụng để kích hoạt chức năng cấu hình tự động của Spring Boot
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.admin.SpringApplicationAdminJmxAutoConfiguration,\
org.springframework.boot.autoconfigure.aop.AopAutoConfiguration,\
org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration\

```

Sau khi thực hiện `loadFactoryNames(EnableAutoConfiguration.class, classLoader)`, chúng tôi nhận được một nhóm các lớp `@Configuration`,  
chúng tôi có thể khởi tạo các lớp này thông qua phản xạ sau đó tiêm vào container IOC, cuối cùng trong container sẽ có một loạt các lớp cấu hình dưới dạng JavaConfig được đánh dấu với `@Configuration`.

Đó chính là `SpringFactoriesLoader`, về bản chất, nó là một phương pháp kế thừa riêng của Spring Framework, tương tự như SPI, nhiều chức năng cốt lõi của Spring Boot trên cơ sở Spring đều dựa trên điều này, hy vọng mọi người có thể hiểu.

## 4. Một vũ khí khác: Cơ chế lắng nghe sự kiện của Spring Container

Trước đây, cơ chế nghe sự kiện thường được sử dụng nhiều trong lập trình giao diện đồ họa, ví dụ: **Click** nút, **nhập** nội dung vào hộp văn bản, v.v., được gọi là sự kiện, và khi sự kiện được kích hoạt, ứng dụng phản ứng theo một cách nhất định, có nghĩa là ứng dụng đã nghe sự kiện này. Trên máy chủ, cơ chế nghe sự kiện thường được sử dụng nhiều hơn để thông báo không đồng bộ cũng như giám sát và xử lý ngoại lệ. Java cung cấp hai lớp cơ bản để thực hiện cơ chế nghe sự kiện: loại sự kiện tùy chỉnh kế thừa từ `java.util.EventObject`, người nghe sự kiện kế thừa từ `java.util.EventListener`. Hãy xem một ví dụ đơn giản: giám sát thời gian thực hiện của một phương thức.

Đầu tiên, hãy định nghĩa loại sự kiện, phương pháp thông thường là kế thừa EventObject, cùng với sự kiện, trạng thái tương ứng thường được đóng gói trong lớp này:

```java
public class MethodMonitorEvent extends EventObject {
    // Thời gian, được sử dụng để ghi lại thời gian bắt đầu thực thi phương thức
    public long timestamp;

    public MethodMonitorEvent(Object source) {
        super(source);
    }
}
```

Sau khi sự kiện được phát hành, người nghe tương ứng có thể xử lý loại sự kiện này, chúng tôi có thể phát hành một sự kiện bắt đầu trước khi phương thức bắt đầu thực hiện và phát hành một sự kiện kết thúc sau khi phương thức thực hiện xong, tương ứng, người nghe sự kiện cần cung cấp phương thức để xử lý các sự kiện nhận được trong hai trường hợp này:

```java
// 1. Định nghĩa interface lắng nghe sự kiện
public interface MethodMonitorEventListener extends EventListener {
    // Xử lý sự kiện được phát hành trước khi phương thức bắt đầu thực thi
    public void onMethodBegin(MethodMonitorEvent event);
    // Xử lý sự kiện được phát hành khi phương thức kết thúc
    public void onMethodEnd(MethodMonitorEvent event);
}
// 2. Triển khai interface lắng nghe sự kiện: xử lý như thế nào
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

Interface lắng nghe sự kiện định nghĩa các phương thức xử lý cho các sự kiện được phát hành trước khi phương thức bắt đầu và sau khi phương thức kết thúc. Quan trọng nhất là các phương thức này chỉ nhận tham số MethodMonitorEvent, cho thấy lớp lắng nghe sự kiện chỉ đảm nhận việc lắng nghe và xử lý sự kiện tương ứng. Sau khi có sự kiện và lắng nghe sự kiện, chỉ cần phát hành sự kiện và cho phép lắng nghe tương ứng lắng nghe và xử lý. Thông thường, chúng ta sẽ có một nguồn phát sự kiện, nó là nguồn sự kiện trong chính nó và trong thời điểm thích hợp, nó sẽ phát hành sự kiện tương ứng cho lắng nghe sự kiện tương ứng:

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

Container sử dụng ApplicationListener làm interface lắng nghe sự kiện, nó kế thừa từ EventListener. Khi ApplicationContext khởi động, nó sẽ tự động nhận dạng và tải các bean kiểu ApplicationListener. Khi có sự kiện được phát hành trong container, các ApplicationListener đã đăng ký sẽ được thông báo về các sự kiện này.

Interface ApplicationContext kế thừa từ interface ApplicationEventPublisher, interface này cung cấp phương thức `void publishEvent(ApplicationEvent event)` để định nghĩa, không khó nhận ra rằng ApplicationContext đóng vai trò như một nguồn phát sự kiện. Nếu quan tâm, bạn có thể xem mã nguồn của phương thức `AbstractApplicationContext.publishEvent(ApplicationEvent event)`: ApplicationContext chịu trách nhiệm cho việc phát hành sự kiện và quản lý lắng nghe sự kiện bằng cách sử dụng một triển khai của interface ApplicationEventMulticaster. Khi container khởi động, nó sẽ kiểm tra xem trong container có đối tượng ApplicationEventMulticaster có tên là applicationEventMulticaster không. Nếu có, nó sẽ sử dụng triển khai này, nếu không, nó sẽ khởi tạo một SimpleApplicationEventMulticaster mặc định làm triển khai.

Cuối cùng, nếu chúng ta cần phát hành sự kiện trong container, chỉ cần tiêm phụ thuộc vào ApplicationEventPublisher: triển khai interface ApplicationEventPublisherAware hoặc ApplicationContextAware (hãy xem lại phần Aware trong bài viết trước).

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

Trong quá trình khởi tạo, điều quan trọng nhất là sử dụng SpringFactoriesLoader để tìm các lớp triển khai của hai interface `ApplicationContextInitializer` và `ApplicationListener` được cấu hình trong tệp `spring.factories`, để xây dựng các thể hiện tương ứng sau này. Mục đích chính của `ApplicationContextInitializer` là cấu hình hoặc xử lý thêm cho thể hiện `ConfigurableApplicationContext` trước khi nó được làm mới. `ConfigurableApplicationContext` kế thừa từ `ApplicationContext` và cung cấp khả năng cấu hình cho `ApplicationContext`.

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

Toàn bộ quy trình khởi động ứng dụng Spring Boot được đóng gói trong phương thức SpringApplication.run, quy trình này thực sự rất dài và phức tạp, nhưng về bản chất chỉ là kế thừa trên nền tảng khởi động của Spring Container. Hãy xem mã nguồn theo cách này:

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

Theo luồng logic này, bạn có thể tìm thấy ở ② trong mã nguồn của phương thức prepareEnvironment() dòng mã `listeners.environmentPrepared(environment);` tức là phương thức thứ hai của interface SpringApplicationRunListener, và không ngạc nhiên, nó lại phát ra một sự kiện khác là ApplicationEnvironmentPreparedEvent. Tiếp theo sẽ xảy ra gì, bạn có thể tự tìm hiểu được rồi đúng không?

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
