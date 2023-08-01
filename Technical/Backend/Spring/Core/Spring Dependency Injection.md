---
title: Spring Dependency Injection
tags: [spring, java, backend, di]
categories: [spring, java, backend]
date created: 2023-07-26
date modified: 2023-07-26
---

# Dependency Injection trong Spring

DI, viết tắt của Dependency Injection, có nghĩa là "chú trọng vào sự phụ thuộc". Dependency Injection là hình thức phổ biến nhất của Inversion of Control (IoC). Dependency Injection là quá trình mà đối tượng chỉ cần thông qua các tham số của hàm tạo, tham số của phương thức tạo ra từ nhà máy hoặc các phiên bản đối tượng để tạo ra. Sau đó, các phụ thuộc này được tiêm vào khi tạo ra các bean. Quá trình này ngược lại với quá trình tạo ra bean (do đó gọi là "đảo ngược điều khiển"), nó kiểm soát việc khởi tạo hoặc vị trí của các phụ thuộc bằng cách sử dụng cấu trúc tạo đối tượng trực tiếp hoặc mẫu định vị dịch vụ.

Sử dụng DI, mã code trở nên sạch sẽ hơn và giải phóng các mối quan hệ phụ thuộc hiệu quả hơn khi các đối tượng có mối quan hệ phụ thuộc. Đối tượng không tìm kiếm các phụ thuộc của nó và không biết vị trí hoặc loại phụ thuộc. Kết quả là, lớp của bạn trở nên dễ kiểm tra hơn, đặc biệt là khi các mối quan hệ phụ thuộc được định nghĩa trên giao diện hoặc lớp cơ sở trừu tượng, chúng cho phép sử dụng các đối tượng giả hoặc triển khai giả trong các bài kiểm tra đơn vị.

**Container chịu trách nhiệm hoàn toàn về việc lắp ráp các thành phần, nó sẽ chuyển các đối tượng phù hợp với mối quan hệ phụ thuộc thông qua thuộc tính JavaBean hoặc phương thức tạo**.

DI là quá trình mà mối quan hệ phụ thuộc giữa các thành phần được quyết định bởi container trong thời gian chạy. Một cách hình dung, đó là container động cấp phát một mối quan hệ phụ thuộc nào đó vào thành phần. Mục đích của việc tiêm phụ thuộc không phải là mang lại nhiều chức năng hơn cho hệ thống phần mềm, mà là để nâng cao tần suất tái sử dụng thành phần và xây dựng một nền tảng linh hoạt, có thể mở rộng cho hệ thống. Thông qua cơ chế tiêm phụ thuộc, chúng ta chỉ cần cấu hình đơn giản mà không cần bất kỳ mã code nào để chỉ định tài nguyên mục tiêu cần thiết và hoàn thành logic kinh doanh của chính mình mà không cần quan tâm đến tài nguyên cụ thể đến từ đâu và do ai triển khai.

Để hiểu rõ hơn về DI, điều quan trọng là hiểu rõ "ai phụ thuộc vào ai, tại sao cần phụ thuộc, ai tiêm vào ai và tiêm vào cái gì", chúng ta hãy phân tích sâu hơn:

- **Ai phụ thuộc vào ai:** Đương nhiên là ứng dụng phụ thuộc vào container IoC;
- **Tại sao cần phụ thuộc:** Ứng dụng cần container IoC để cung cấp các tài nguyên bên ngoài mà đối tượng cần;
- **Ai tiêm vào ai:** Rõ ràng là container IoC tiêm vào ứng dụng một đối tượng nào đó, đối tượng mà ứng dụng phụ thuộc vào;
- **Tiêm vào cái gì:** Đó là tiêm vào các tài nguyên bên ngoài mà đối tượng cần (bao gồm đối tượng, tài nguyên, dữ liệu hằng số).

## API Dependency Injection trong IoC

- Dependency Injection API cung cấp các cách để tiêm phụ thuộc vào các bean:
  - Tiêm phụ thuộc theo tên bean
  - Tiêm phụ thuộc theo kiểu bean
  - Tiêm phụ thuộc vào các bean được xây dựng sẵn trong container
  - Tiêm phụ thuộc vào các đối tượng không phải là bean
  - Tiêm phụ thuộc vào kiểu
    - Tiêm phụ thuộc thời gian thực
    - Tiêm phụ thuộc trì hoãn

## Mô hình Dependency Injection

Mô hình Dependency Injection có thể chia thành hai loại: mô hình tiêm phụ thuộc thủ công và mô hình tiêm phụ thuộc tự động.

### Mô hình tiêm phụ thuộc thủ công

Mô hình tiêm phụ thuộc thủ công: cấu hình hoặc lập trình trước để sắp xếp quy tắc tiêm phụ thuộc

- Cấu hình thông tin meta từ tài nguyên XML
- Cấu hình thông tin meta từ chú thích Java
- Cấu hình thông tin meta từ API

### Mô hình tiêm phụ thuộc tự động

Mô hình tiêm phụ thuộc tự động còn được gọi là tự động gắn kết. Tự động gắn kết (Autowiring) là khả năng của Spring container tự động gắn kết các mối quan hệ giữa các bean. Spring có thể tự động phân giải các đối tác (bean khác) bằng cách kiểm tra nội dung của `ApplicationContext`.

- Tự động gắn kết có thể giảm đáng kể việc cấu hình các thuộc tính hoặc tham số của hàm tạo.
- Tự động gắn kết có thể được cập nhật cùng với sự phát triển của đối tượng.

> Lưu ý: Do tồn tại một số hạn chế và nhược điểm của tự động gắn kết, Spring không khuyến nghị sử dụng tự động gắn kết.

#### Chiến lược tự động gắn kết

Khi sử dụng dữ liệu cấu hình dựa trên XML, bạn có thể sử dụng thuộc tính `autowire` của phần tử `<bean/>` để chỉ định chế độ tự động gắn kết cho bean. Có các chế độ tự động gắn kết sau:

| Chế độ       | Mô tả                                                                 |
| ------------ | --------------------------------------------------------------------- |
| `no`         | Giá trị mặc định, không kích hoạt tự động gắn kết, cần chỉ định đối tác gắn kết thủ công. |
| `byName`     | Tìm kiếm đối tác gắn kết bằng tên của thuộc tính được gắn kết và thiết lập đối tượng vào thuộc tính đó. |
| `byType`     | Tìm kiếm đối tác gắn kết bằng kiểu của thuộc tính được gắn kết và thiết lập đối tượng vào thuộc tính đó. |
| `constructor`| Đặc biệt cho kiểu `byType`, được sử dụng cho các tham số của hàm tạo. |

`org.springframework.beans.factory.config.AutowireCapableBeanFactory` là một giao diện con của `BeanFactory`, nó là giao diện được sử dụng trong Spring để thực hiện tự động gắn kết.

#### Quá trình tiêm phụ thuộc bằng @Autowired

- Phân tích thông tin meta
- Tìm kiếm phụ thuộc
- Tiêm phụ thuộc (trường, phương thức)

#### Hạn chế và nhược điểm của tự động gắn kết

Tự động gắn kết có các hạn chế và nhược điểm sau:

- Các phụ thuộc rõ ràng trong cài đặt thuộc tính và tham số hàm tạo sẽ ghi đè lên tự động gắn kết. Bạn không thể tự động gắn kết các thuộc tính đơn giản như kiểu dữ liệu cơ bản, chuỗi và lớp (và mảng các thuộc tính đơn giản này).
- Tự động gắn kết không chính xác như gắn kết rõ ràng. Spring sẽ cố gắng tránh kết quả không rõ ràng.
- Công cụ tạo tài liệu của Spring có thể không thể phân tích thông tin tự động gắn kết.
- Khi có nhiều bean cùng kiểu tồn tại, tự động gắn kết sẽ gặp vấn đề. Có thể có nhiều định nghĩa bean trong container khớp với kiểu được chỉ định bởi phương thức Setter hoặc tham số hàm tạo. Đối với mảng, tập hợp hoặc đối tượng Map, điều này không phải là vấn đề. Tuy nhiên, đối với các phụ thuộc mong muốn giá trị duy nhất, nếu không có định nghĩa bean duy nhất có sẵn, sẽ gây ra ngoại lệ.

> Chi tiết về hạn chế và nhược điểm của tự động gắn kết, bạn có thể tham khảo tài liệu chính thức: [Limitations and Disadvantages of Autowiring section](https://docs.spring.io/spring/docs/5.2.2.RELEASE/spring-frameworkreference/core.html#beans-autowired-exceptions)

## Các phương thức Dependency Injection

Dependency Injection có các phương thức sau:

| Phương thức Dependency Injection | Ví dụ cấu hình meta |
| ------------------------------- | ------------------ |
| Setter Method Injection          | `<property name="user" ref="userBean"/>`           |
| Constructor Injection            | `<constructor-arg name="user" ref="userBean" />`   |
| Field Injection                  | `@Autowired User user;`                            |
| Method Injection                 | `@Autowired public void user(User user) { … }`   |
| Interface Callback Injection     | `class MyBean implements BeanFactoryAware { … }` |

### Constructor Injection (Tiêm phụ thuộc qua hàm tạo)

- Chế độ thủ công
  - Cấu hình thông tin meta từ tài nguyên XML
  - Cấu hình thông tin meta từ chú thích Java
  - Cấu hình thông tin meta từ Java API
- Chế độ tự động
  - constructor

Constructor Injection (Tiêm phụ thuộc qua hàm tạo) được thực hiện bằng cách sử dụng các hàm tạo với nhiều tham số để gọi qua container, mỗi tham số đại diện cho một phụ thuộc. Việc gọi các phương thức tạo đối tượng tĩnh với các tham số cụ thể cũng tương đương, và trong cuộc thảo luận này, xử lý các tham số của hàm tạo và phương thức tạo đối tượng tĩnh được thực hiện tương tự.

Dưới đây là một ví dụ về Constructor Injection:

```java
public class SimpleMovieLister {

    // SimpleMovieLister phụ thuộc vào MovieFinder
    private final MovieFinder movieFinder;

    // Hàm tạo để Spring container có thể tiêm phụ thuộc MovieFinder
    public SimpleMovieLister(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // Logic kinh doanh sử dụng MovieFinder được tiêm vào bị bỏ qua...
}
```

Phân tích tham số hàm tạo khớp với kiểu của tham số. Nếu không có sự mơ hồ tiềm ẩn trong các tham số của hàm tạo trong định nghĩa bean, thứ tự các tham số trong định nghĩa bean là thứ tự các tham số được cung cấp cho hàm tạo tương ứng khi tạo ra đối tượng.

```
package x.y;

public class ThingOne {

    public ThingOne(ThingTwo thingTwo, ThingThree thingThree) {
        // ...
    }
}
```

Giả sử ThingTwo và ThingThree không có mối quan hệ kế thừa, không có sự mơ hồ tiềm ẩn. Do đó, cấu hình sau hoạt động bình thường mà không cần chỉ định chỉ mục hoặc kiểu của tham số hàm tạo trong phần tử `<constructor-arg/>`.

```xml
<beans>
    <bean id="beanOne" class="x.y.ThingOne">
        <constructor-arg ref="beanTwo"/>
        <constructor-arg ref="beanThree"/>
    </bean>

    <bean id="beanTwo" class="x.y.ThingTwo"/>

    <bean id="beanThree" class="x.y.ThingThree"/>
</beans>
```

Khi tham chiếu đến một bean khác, kiểu là đã biết và có thể khớp (giống như ví dụ trước). Khi sử dụng kiểu đơn giản như `<value>true</value>`, Spring không thể xác định kiểu của giá trị, do đó không thể khớp theo kiểu mà không có sự trợ giúp. Xem ví dụ lớp sau:

```java
package examples;

public class ExampleBean {

    // Số năm để tính Ultimate Answer
    private final int years;

    // Câu trả lời cho Life, the Universe, and Everything
    private final String ultimateAnswer;

    public ExampleBean(int years, String ultimateAnswer) {
        this.years = years;
        this.ultimateAnswer = ultimateAnswer;
    }
}
```

Khớp kiểu tham số hàm tạo

Trong tình huống trên, nếu bạn sử dụng thuộc tính `type` để chỉ định rõ kiểu của tham số hàm tạo, container có thể sử dụng khớp kiểu đơn giản như ví dụ sau:

```xml
<bean id="exampleBean" class="examples.ExampleBean">
    <constructor-arg type="int" value="7500000"/>
    <constructor-arg type="java.lang.String" value="42"/>
</bean>
```

Khớp chỉ mục tham số hàm tạo

Bạn có thể sử dụng thuộc tính `index` để chỉ định rõ chỉ mục của tham số hàm tạo, như ví dụ sau:

```xml
<bean id="exampleBean" class="examples.ExampleBean">
    <constructor-arg index="0" value="7500000"/>
    <constructor-arg index="1" value="42"/>
</bean>
```

Khớp tên tham số hàm tạo

```xml
<bean id="exampleBean" class="examples.ExampleBean">
    <constructor-arg name="years" value="7500000"/>
    <constructor-arg name="ultimateAnswer" value="42"/>
</bean>
```

Bạn có thể sử dụng `@ConstructorProperties` để chỉ định rõ tên của các tham số hàm tạo.

```java
package examples;

public class ExampleBean {

    // Các trường bị bỏ qua

    @ConstructorProperties({"years", "ultimateAnswer"})
    public ExampleBean(int years, String ultimateAnswer) {
        this.years = years;
        this.ultimateAnswer = ultimateAnswer;
    }
}
```

### Setter Method Injection (Tiêm phụ thuộc qua phương thức setter)

- Chế độ thủ công
  - Cấu hình thông tin meta từ tài nguyên XML
  - Cấu hình thông tin meta từ chú thích Java
  - Cấu hình thông tin meta từ Java API
- Chế độ tự động
  - byName
  - byType

Setter Method Injection (Tiêm phụ thuộc qua phương thức setter) được thực hiện bằng cách sử dụng setter method trên bean sau khi container đã tạo ra bean bằng cách gọi constructor không tham số hoặc phương thức tạo đối tượng tĩnh không tham số.

Dưới đây là một ví dụ về một lớp chỉ có thể tiêm phụ thuộc thông qua setter:

```java
public class SimpleMovieLister {

    // SimpleMovieLister phụ thuộc vào MovieFinder
    private MovieFinder movieFinder;

    // Phương thức setter để Spring container có thể tiêm phụ thuộc MovieFinder
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // Logic kinh doanh sử dụng MovieFinder được tiêm vào bị bỏ qua...
}
```

Trong Spring, bạn có thể kết hợp cả Constructor Injection (Tiêm phụ thuộc qua hàm tạo) và Setter Method Injection (Tiêm phụ thuộc qua phương thức setter). Đề nghị sử dụng Constructor Injection cho các phụ thuộc bắt buộc và sử dụng Setter Method Injection hoặc phương thức cấu hình cho các phụ thuộc tùy chọn. Lưu ý rằng việc sử dụng chú thích `@Required` trên phương thức setter có thể được sử dụng để đánh dấu thuộc tính là phụ thuộc bắt buộc; tuy nhiên, việc sử dụng Constructor Injection được khuyến nghị hơn để làm việc này.

### Field Injection (Tiêm phụ thuộc qua trường)

Chế độ thủ công (Cấu hình thông tin meta từ chú thích Java)

- `@Autowired`
- `@Resource`
- `@Inject` (tùy chọn)

Field Injection (Tiêm phụ thuộc qua trường) là việc tiêm phụ thuộc bằng cách sử dụng trực tiếp trường trên bean. Trong Spring, bạn có thể sử dụng các chú thích như `@Autowired`, `@Resource` hoặc `@Inject` (tùy chọn) để chỉ định việc tiêm phụ thuộc qua trường.

Dưới đây là một ví dụ về Field Injection:

```java
public class SimpleMovieLister {

    // SimpleMovieLister phụ thuộc vào MovieFinder
    @Autowired
    private MovieFinder movieFinder;

    // Logic kinh doanh sử dụng MovieFinder được tiêm vào bị bỏ qua...
}
```

Trong ví dụ trên, `@Autowired` được sử dụng để chỉ định việc tiêm phụ thuộc vào trường `movieFinder`. Bạn cũng có thể sử dụng `@Resource` hoặc `@Inject` để thực hiện việc này.

Lưu ý rằng Field Injection có thể làm cho mã của bạn dễ đọc hơn và ngắn gọn hơn, nhưng nó cũng có thể làm cho việc kiểm tra đơn vị trở nên khó khăn hơn. Nên cân nhắc việc sử dụng Constructor Injection hoặc Setter Method Injection để tăng tính kiểm thử và khả năng thay thế.

### Method Injection (Tiêm phụ thuộc qua phương thức)

Chế độ thủ công (Cấu hình thông tin meta từ chú thích Java)

- `@Autowired`
- `@Resource`
- `@Inject` (tùy chọn)
- `@Bean`

Method Injection (Tiêm phụ thuộc qua phương thức) là quá trình tiêm phụ thuộc bằng cách gọi trực tiếp các phương thức trên bean sau khi container đã tạo ra bean bằng cách gọi constructor không tham số hoặc phương thức tạo đối tượng tĩnh không tham số.

Dưới đây là một ví dụ về Method Injection:

```java
public class SimpleMovieLister {

    // SimpleMovieLister phụ thuộc vào MovieFinder
    private MovieFinder movieFinder;

    // Phương thức setter để Spring container có thể tiêm phụ thuộc MovieFinder
    @Autowired
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // Logic kinh doanh sử dụng MovieFinder được tiêm vào bị bỏ qua...
}
```

Trong ví dụ trên, `@Autowired` được sử dụng để chỉ định việc tiêm phụ thuộc vào phương thức `setMovieFinder()`. Bạn cũng có thể sử dụng `@Resource` hoặc `@Inject` để thực hiện việc này. Ngoài ra, bạn cũng có thể sử dụng `@Bean` để chỉ định phương thức tạo đối tượng trong một `@Configuration` class.

### Interface Callback Injection (Tiêm phụ thuộc qua giao diện callback)

Interface Callback Injection (Tiêm phụ thuộc qua giao diện callback) là quá trình tiêm phụ thuộc bằng cách triệu hồi các giao diện callback trong bean. Spring cung cấp một số giao diện callback được tích hợp sẵn để tiêm phụ thuộc vào các bean.

Dưới đây là một số giao diện callback tích hợp sẵn trong Spring:

| Giao diện callback               | Mô tả                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| `BeanFactoryAware`               | Lấy đối tượng `BeanFactory` của container - `BeanFactory`     |
| `ApplicationContextAware`        | Lấy đối tượng `ApplicationContext` của ứng dụng Spring         |
| `EnvironmentAware`               | Lấy đối tượng `Environment` của ứng dụng Spring                |
| `ResourceLoaderAware`            | Lấy đối tượng `ResourceLoader` để tải tài nguyên               |
| `BeanClassLoaderAware`           | Lấy `ClassLoader` để tải lớp của bean                          |
| `BeanNameAware`                  | Lấy tên của bean hiện tại                                     |
| `MessageSourceAware`             | Lấy đối tượng `MessageSource` để hỗ trợ đa ngôn ngữ trong Spring |
| `ApplicationEventPublisherAware` | Lấy đối tượng `ApplicationEventPublisher` để phát ra các sự kiện trong Spring |
| `EmbeddedValueResolverAware`     | Lấy đối tượng `StringValueResolver` để xử lý các giá trị thay thế |

### Lựa chọn Dependency Injection (Tiêm phụ thuộc)

- Ít phụ thuộc: Constructor Injection (Tiêm phụ thuộc qua hàm tạo)
- Nhiều phụ thuộc: Setter Method Injection (Tiêm phụ thuộc qua phương thức setter)
- Tiện ích: Field Injection (Tiêm phụ thuộc qua trường)
- Khai báo lớp: Method Injection (Tiêm phụ thuộc qua phương thức)

## Giới hạn và Trì hoãn Tiêm

### Giới hạn Tiêm

- Sử dụng chú thích `@Qualifier` để giới hạn
  - Giới hạn bằng tên Bean
  - Giới hạn bằng nhóm
- Mở rộng giới hạn bằng chú thích `@Qualifier`
  - Tạo chú thích tùy chỉnh: Ví dụ như `@LoadBalanced` của Spring Cloud

### Trì hoãn Tiêm

- Sử dụng `ObjectFactory`
- Sử dụng `ObjectProvider` (được khuyến nghị)

## Kiểu dữ liệu Dependency Injection

### Kiểu cơ bản

- Kiểu dữ liệu cơ bản: `boolean`, `byte`, `char`, `short`, `int`, `float`, `long`, `double`
- Kiểu dữ liệu đơn giản: `Number`, `Character`, `Boolean`, `Enum`, `Locale`, `Charset`, `Currency`, `Properties`, `UUID`
- Kiểu dữ liệu thông thường: `Object`, `String`, `TimeZone`, `Calendar`, `Optional`, vv.
- Kiểu dữ liệu Spring: `Resource`, `InputSource`, `Formatter`, vv.

### Kiểu dữ liệu tham chiếu

Kiểu mảng: Kiểu dữ liệu cơ bản, kiểu dữ liệu đơn giản, kiểu dữ liệu thông thường, mảng kiểu String

Kiểu Collection:

- `Collection`: `List`, `Set`
- `Map`: `Properties`

## Quá trình xử lý phụ thuộc

Điểm vào: `DefaultListableBeanFactory#resolveDependency`

Mô tả phụ thuộc: `DependencyDescriptor`

Bộ xử lý đối tượng ứng cử viên tùy chỉnh: `AutowireCandidateResolver`

Bộ xử lý `@Autowired`, `@Value`, `@javax.inject.Inject`: `AutowiredAnnotationBeanPostProcessor`

Bộ xử lý chung cho chú thích: `CommonAnnotationBeanPostProcessor`

- Chú thích Tiêm
  - `javax.xml.ws.WebServiceRef`
  - `javax.ejb.EJB`
  - `javax.annotation.Resources`
- Chú thích vòng đời
  - `javax.annotation.PostConstruct`
  - `javax.annotation.PreDestroy`

Chú thích Tiêm phụ thuộc tùy chỉnh:

- Xử lý vòng đời
  - `InstantiationAwareBeanPostProcessor`
  - `MergedBeanDefinitionPostProcessor`
- Siêu dữ liệu
  - `InjectionMetadata`
  - `InjectionMetadata.InjectedElement`

## Tìm kiếm phụ thuộc VS Tiêm phụ thuộc

| Loại          | Xử lý phụ thuộc | Độ phức tạp | Xâm nhập mã   | Phụ thuộc API     | Đọc được |
| ------------- | ------------- | ----------- | ------------- | ----------------- | -------- |
| Tìm kiếm phụ thuộc | Chủ động      | Tương đối phức tạp | Xâm nhập vào logic kinh doanh | Phụ thuộc vào API của container | Tốt      |
| Tiêm phụ thuộc   | Bị động        | Tương đối thuận tiện | Thấp xâm nhập | Không phụ thuộc vào API của container | Trung bình |
