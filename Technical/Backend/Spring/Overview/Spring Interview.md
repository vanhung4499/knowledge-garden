---
title: Spring Interview
tags: [spring, java, backend, interview]
categories: [spring, java, backend, interview]
date created: 2023-07-26
date modified: 2023-07-26
---

# Phỏng vấn Spring

1. Spring Framework là gì? Đặc điểm chính của nó là gì?
2. Dependency Injection trong Spring Framework là gì? Làm thế nào để thực hiện Dependency Injection?
3. Spring AOP là gì? Chức năng của nó là gì? Làm thế nào để sử dụng AOP trong Spring?
4. Bean trong Spring là gì? Làm thế nào để định nghĩa một Bean?
5. Spring MVC là gì? Làm thế nào để sử dụng MVC trong Spring?
6. Spring Boot là gì? Sự khác biệt giữa Spring Boot và Spring Framework là gì?
7. Quản lý giao dịch trong Spring là gì? Làm thế nào để quản lý giao dịch trong Spring?
8. Spring Security là gì? Chức năng chính của nó là gì?
9. Kiểm thử tích hợp trong Spring là gì? Làm thế nào để thực hiện kiểm thử tích hợp trong Spring?
10. Làm thế nào để triển khai dịch vụ web RESTful trong Spring?

## Tổng hợp

### Spring Framework các phiên bản khác nhau có những chức năng chính nào?

| Phiên bản | Chức năng chính                                                                 |
| --------- | ------------------------------------------------------------------------------ |
| Spring 2.5 | Phát hành vào năm 2007. Đây là phiên bản đầu tiên hỗ trợ chú thích.              |
| Spring 3.0 | Phát hành vào năm 2009. Nó tận dụng hoàn toàn các cải tiến trong Java 5 và hỗ trợ JEE6. |
| Spring 4.0 | Phát hành vào năm 2013. Đây là phiên bản đầu tiên hoàn toàn hỗ trợ JAVA 8.       |

### Spring Framework là gì?

- Spring là một framework ứng dụng mã nguồn mở, nhằm giảm độ phức tạp trong việc phát triển ứng dụng.
- Nó là một framework nhẹ, lỏng lẻo.
- Nó có kiến trúc phân lớp, cho phép người dùng lựa chọn các thành phần mà họ cần, đồng thời cung cấp một framework có sự kết hợp.
- Nó có thể tích hợp với các framework khác như Structs, Hibernate, EJB, vì vậy nó còn được gọi là "framework của các framework".

### Liệt kê các ưu điểm của Spring Framework.

- Nhờ kiến trúc phân lớp của Spring Framework, người dùng có thể tự do lựa chọn các thành phần mà họ cần.
- Spring Framework hỗ trợ lập trình POJO (Plain Old Java Object), từ đó mang lại tính liên tục và khả năng kiểm thử.
- Nhờ Dependency Injection và Inversion of Control, việc làm việc với JDBC trở nên đơn giản hơn.
- Nó là mã nguồn mở và miễn phí.

### Spring Framework có những chức năng gì?

- **Nhẹ nhàng** - Spring nhẹ nhàng về mặt mã nguồn và trong suốt.
- **IOC** - Inversion of Control
- **AOP** - Aspect-Oriented Programming cho phép tách biệt logic kinh doanh và dịch vụ hệ thống để đạt được tính chất gắn kết cao.
- **Container** - Spring đảm nhận việc tạo ra và quản lý vòng đời của các đối tượng (Bean).
- **MVC** - Cung cấp tính năng cấu hình cao cho ứng dụng web và dễ dàng tích hợp với các framework khác.
- **Quản lý giao dịch** - Cung cấp một lớp trừu tượng chung để quản lý giao dịch. Hỗ trợ quản lý giao dịch trong môi trường có ít container.
- **Ngoại lệ JDBC** - Lớp trừu tượng JDBC của Spring cung cấp một cấu trúc ngoại lệ, đơn giản hóa việc xử lý lỗi.

### Spring Framework có bao nhiêu module khác nhau và chúng là gì?

![img](https://raw.githubusercontent.com/dunwu/images/dev/cs/java/spring/spring-framework.png)

- **Core Container** - Lớp này chủ yếu là trái tim của Spring Framework. Nó bao gồm các module sau:
  - Spring Core
  - Spring Bean
  - SpEL (Spring Expression Language)
  - Spring Context
- **Data Access/Integration** - Lớp này cung cấp hỗ trợ tương tác với cơ sở dữ liệu. Nó bao gồm các module sau:
  - JDBC (Java DataBase Connectivity)
  - ORM (Object Relational Mapping)
  - OXM (Object XML Mappers)
  - JMS (Java Messaging Service)
  - Transaction
- **Web** - Lớp này cung cấp hỗ trợ cho việc tạo ứng dụng web. Nó bao gồm các module sau:
  - Web
  - Web - Servlet
  - Web - Socket
  - Web - Portlet
- **AOP** - Lớp này hỗ trợ lập trình hướng khía cạnh.
- **Instrumentation** - Lớp này hỗ trợ phát hiện lỗi và triển khai lớp tải.
- **Test** - Lớp này hỗ trợ kiểm thử bằng JUnit và TestNG.
- **Các module khác:**
  - Messaging - Module này hỗ trợ STOMP. Nó cũng hỗ trợ mô hình lập trình chú thích để định tuyến và xử lý tin nhắn STOMP từ khách hàng WebSocket.
  - Aspects - Module này hỗ trợ tích hợp với AspectJ.

### Tệp cấu hình Spring là gì?

Tệp cấu hình Spring là một tệp XML. Tệp này chứa thông tin về các lớp. Nó mô tả cách cấu hình các lớp đó và cách chúng được liên kết với nhau. Tuy nhiên, tệp cấu hình XML dài và khá rườm rà. Nếu không được lập kế hoạch và viết đúng cách, việc quản lý trong các dự án lớn sẽ trở nên rất khó khăn.

### Spring ứng dụng bao gồm những thành phần khác nhau?

Một ứng dụng Spring thông thường bao gồm các thành phần sau:

- **Giao diện (Interfaces)** - Xác định các chức năng.
- **Lớp Bean (Bean Classes)** - Bao gồm các thuộc tính, phương thức setter và getter, hàm, v.v.
- **AOP (Aspect-Oriented Programming) trong Spring** - Cung cấp chức năng lập trình hướng khía cạnh.
- **Tệp cấu hình Bean (Bean Configuration File)** - Chứa thông tin về lớp và cách cấu hình chúng.
- **Chương trình người dùng (User Program)** - Sử dụng các giao diện.

### Có những cách nào để sử dụng Spring?

Có các cách sau để sử dụng Spring:

- Sử dụng làm ứng dụng web Spring hoàn chỉnh.
- Sử dụng làm framework web bên thứ ba, sử dụng lớp trung gian của Spring Framework.
- Sử dụng từ xa.
- Sử dụng làm Java Bean doanh nghiệp, có thể bao bọc các POJO (Plain Old Java Objects) hiện có.

## Core

### IoC

#### IoC là gì? Dependency Injection là gì? Spring IoC là gì?

**IoC** hay còn gọi là **đảo ngược điều khiển** (Inversion of Control, viết tắt là IoC). IoC còn được gọi là **nguyên tắc đảo ngược phụ thuộc** (một trong sáu nguyên tắc thiết kế mẫu), điểm chính của nó là: **chương trình phải phụ thuộc vào giao diện trừu tượng, không nên phụ thuộc vào thực hiện cụ thể**. Chức năng của nó là **giảm độ liên kết giữa các mã**.

Có hai cách để triển khai IoC:

- **Dependency Injection** (DI): Thay vì tạo đối tượng phụ thuộc bên trong lớp bằng cách sử dụng `new()`, DI truyền (hoặc tiêm) đối tượng lớp phụ thuộc đã được tạo ở bên ngoài vào lớp thông qua constructor, tham số hàm và các cách khác.
- **Dependency Lookup**: Đối tượng được quản lý trong container sử dụng API của container để tra cứu các nguồn và đối tác mà nó phụ thuộc.

Spring IoC là một phiên bản triển khai của IoC. DI là nguyên tắc chính của Spring IoC.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230726005212.png)

#### Có những cách triển khai Dependency Injection nào?

Có các cách triển khai Dependency Injection sau:

| Cách triển khai Dependency Injection | Ví dụ cấu hình metadata                                     |
| ----------------------------------- | ---------------------------------------------------------- |
| Setter Injection                    | `<proeprty name="user" ref="userBean"/>`                   |
| Constructor Injection               | `<constructor-arg name="user" ref="userBean" />`           |
| Field Injection                     | `@Autowired User user;`                                    |
| Method Injection                    | `@Autowired public void user(User user) { … }`           |
| Interface Callback Injection        | `class MyBean implements BeanFactoryAware { … }`          |

#### Constructor Injection VS. Setter Injection

| Constructor Injection          | Setter Injection             |
| ------------------------------ | ---------------------------- |
| Không cho phép phần tử bị thiếu | Cho phép phần tử bị thiếu     |
| Không ghi đè thuộc tính setter | Ghi đè thuộc tính setter     |
| Mọi thay đổi tạo ra một đối tượng mới | Mọi thay đổi không tạo ra một đối tượng mới |
| Thích hợp cho việc thiết lập nhiều thuộc tính | Thích hợp cho việc thiết lập ít thuộc tính |

Spring khuyến nghị sử dụng Constructor Injection.

#### BeanFactory VS. ApplicationContext

Trong Spring, có hai loại IoC Container: `BeanFactory` và `ApplicationContext`.

- `BeanFactory`: `BeanFactory` là IoC Container cơ bản của Spring. Nó cung cấp khung cấu hình và chức năng cơ bản của Spring container.
- `ApplicationContext`: `ApplicationContext` là một giao diện con của `BeanFactory` với các tính năng ứng dụng bổ sung. Nó mở rộng các giao diện khác để hỗ trợ các tính năng phong phú hơn như quốc tế hóa, truy cập tài nguyên, sự kiện, hỗ trợ AOP dễ dàng hơn, xác định ngữ cảnh ứng dụng trong ứng dụng web, v.v.

Trong thực tế, nên sử dụng `ApplicationContext` làm IoC Container vì nó cung cấp nhiều tính năng hơn so với `BeanFactory`.

#### BeanFactory VS. FactoryBean

**`BeanFactory` là IoC Container cơ bản của Spring**.

`FactoryBean` là một cách để tạo ra bean, giúp thực hiện các logic khởi tạo phức tạp hơn.

#### Các bước chuẩn bị khi khởi động Spring IoC

- Đọc và phân tích thông tin cấu hình IoC.
- Quản lý vòng đời của IoC Container.
- Phát đi sự kiện Spring.
- Quốc tế hóa.
- Và nhiều hơn nữa.

#### Cơ chế triển khai của Spring IoC là gì?

Cơ chế triển khai của Spring IoC là kết hợp giữa mô hình Factory và Reflection.

Ví dụ:

```java
interface Fruit {
     public abstract void eat();
}
class Apple implements Fruit {
    public void eat(){
        System.out.println("Apple");
    }
}
class Orange implements Fruit {
    public void eat(){
        System.out.println("Orange");
    }
}
class Factory {
    public static Fruit getInstance(String ClassName) {
        Fruit f=null;
        try {
            f=(Fruit)Class.forName(ClassName).newInstance();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return f;
    }
}
class Client {
    public static void main(String[] a) {
        Fruit f=Factory.getInstance("com.hnv99.spring.Apple");
        if(f!=null){
            f.eat();
        }
    }
}
```

### Bean

#### Spring Bean là gì?

Trong Spring, các đối tượng được quản lý bởi Spring IoC container và tạo thành phần chính của ứng dụng được gọi là Bean. **Bean là các đối tượng được tạo, cấu hình và quản lý bởi Spring IoC container**. Bean và các mối quan hệ giữa chúng được phản ánh trong các metadata cấu hình được sử dụng bởi container.

Spring IoC container không thể nhận diện các metadata cấu hình. Do đó, các thông tin cấu hình này được chuyển đổi thành định dạng có thể nhận diện được bởi Spring, gọi là `BeanDefinition`.

**`BeanDefinition` là giao diện metadata cấu hình định nghĩa Bean trong Spring**, bao gồm:

- Tên lớp của Bean
- Các yếu tố cấu hình của Bean, như phạm vi, chế độ tự động liên kết, các gọi lại vòng đời, v.v.
- Các tham chiếu Bean khác, còn được gọi là đồng nghiệp (Collaborators) hoặc phụ thuộc (Dependencies)
- Các thiết lập cấu hình, như thuộc tính của Bean

#### Làm cách nào để đăng ký Bean trong Spring?

Có thể đăng ký Bean thông qua `BeanDefinition` hoặc đối tượng singleton bên ngoài.

#### Spring cung cấp các cách cấu hình nào?

- Cấu hình dựa trên XML

Các phụ thuộc và dịch vụ cần thiết cho Bean được chỉ định trong tệp cấu hình XML. Các tệp cấu hình này thường chứa nhiều định nghĩa Bean và các tùy chọn cấu hình cụ thể cho ứng dụng. Thông thường, chúng bắt đầu bằng thẻ `<bean>`. Ví dụ:

```xml
<bean id="studentbean" class="org.edureka.firstSpring.StudentBean">
 <property name="name" value="Edureka"></property>
</bean>
```

- Cấu hình dựa trên Annotation

Có thể cấu hình Bean như là các lớp thành phần chính của chính nó bằng cách sử dụng Annotation thay vì sử dụng XML để mô tả việc tạo và kết hợp Bean. Mặc định, Spring không bật cấu hình Annotation. Vì vậy, bạn cần bật nó trong tệp cấu hình Spring trước khi sử dụng. Ví dụ:

```xml
<beans>
<context:annotation-config/>
<!-- bean definitions go here -->
</beans>
```

- Cấu hình dựa trên Java API

Cấu hình Java của Spring được thực hiện bằng cách sử dụng @Bean và @Configuration.

1. @Bean chơi vai trò tương tự như phần tử `<bean />`.
2. @Configuration lớp cho phép định nghĩa các phụ thuộc giữa các bean bằng cách gọi các phương thức @Bean khác trong cùng một lớp.

Ví dụ:

```java
@Configuration
public class StudentConfig {
    @Bean
    public StudentBean myStudent() {
        return new StudentBean();
    }
}
```

#### Spring hỗ trợ những phạm vi Bean nào?

Spring hỗ trợ 5 phạm vi Bean:

- **Singleton** - Mỗi Spring IoC container chỉ có một instance duy nhất.
- **Prototype** - Mỗi lần yêu cầu sẽ tạo ra một instance mới.
- **Request** - Mỗi lần yêu cầu HTTP sẽ tạo ra một instance mới và Bean chỉ có hiệu lực trong yêu cầu HTTP hiện tại.
- **Session** - Mỗi lần yêu cầu HTTP sẽ tạo ra một instance mới và Bean chỉ có hiệu lực trong phiên HTTP hiện tại.
- **Global-session** - Tương tự như phạm vi Session, nhưng chỉ có ý nghĩa trong ứng dụng web dựa trên portlet. Phạm vi Global-session chỉ có hiệu lực trong vòng đời của phiên portlet toàn cầu. Nếu bạn sử dụng phạm vi Global-session trong ứng dụng web, Spring sẽ tự động xem nó như là phạm vi Session.

Các phạm vi cuối cùng ba chỉ có ý nghĩa khi sử dụng ApplicationContext hỗ trợ web.

#### Vòng đời của Spring Bean

![bean-lifecycle](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230725202926.png)

Vòng đời của Bean trong Spring như sau:

1. Spring tạo ra một instance của Bean (tương đương với việc sử dụng `new XXX()`)
2. Spring tiêm giá trị và tham chiếu vào các thuộc tính của Bean
3. Nếu Bean triển khai `BeanNameAware`, Spring sẽ truyền ID của Bean vào phương thức `setBeanName()`
    - Mục đích là để lấy ID của Bean thông qua tham chiếu Bean, nhưng thường ít được sử dụng trong ứng dụng thực tế
4. Nếu Bean triển khai `BeanFactoryAware`, Spring sẽ gọi phương thức `setBeanFactory()` và truyền `BeanFactory` container instance như một tham số.
    - Mục đích là để lấy Spring container, ví dụ như Bean sử dụng Spring container để phát hành sự kiện, nhưng khác với việc Spring container gọi `setBeanFactory()` trước khi nó tự động truyền nó vào, trong khi Spring container gọi `setApplicationContext()` trước khi nó tự động truyền nó vào, Spring container yêu cầu người dùng tự chỉ định (tiêm) tham số `BeanFactory` vào trong `setBeanFactory()`
5. Nếu Bean triển khai `ApplicationContextAware`, Spring container sẽ gọi phương thức `setApplicationContext()` và truyền `ApplicationContext` như một tham số.
    - Mục đích tương tự như `BeanFactory`, nhưng khác ở chỗ Spring container gọi `setApplicationContext()` trước khi nó tự động truyền nó vào, trong khi Spring container yêu cầu người dùng tự chỉ định (tiêm) tham số `ApplicationContext` vào trong `setApplicationContext()`
6. Nếu Bean triển khai `BeanPostProcessor`, Spring sẽ gọi phương thức `postProcessBeforeInitialization()`
    - Mục đích là tăng cường Bean sau khi tạo thành công, ví dụ như sửa đổi Bean, thêm chức năng
7. Nếu Bean triển khai `InitializingBean`, Spring sẽ gọi phương thức `afterPropertiesSet()`, tương đương với việc khai báo phương thức khởi tạo trong tệp cấu hình XML của Bean.
8. Nếu Bean triển khai `BeanPostProcessor`, Spring sẽ gọi phương thức `postProcessAfterInitialization()`
    - `postProcessBeforeInitialization()` được gọi trước khi Bean được khởi tạo, trong khi `postProcessAfterInitialization()` được gọi sau khi Bean được khởi tạo
9. Sau các bước trên, Bean sẽ ở trong ApplicationContext và sẵn sàng được sử dụng cho ứng dụng cho đến khi ApplicationContext bị hủy.
10. Nếu Bean triển khai `DisposableBean`, Spring sẽ gọi phương thức `destroy()`, tương đương với việc khai báo thuộc tính `destroy-method` trong tệp cấu hình XML của Bean.

#### Spring Inner Bean là gì?

Chỉ khi Bean được sử dụng làm thuộc tính của Bean khác, mới có thể khai báo Bean là Inner Bean. Để định nghĩa Bean, metadata cấu hình dựa trên XML của Spring cung cấp sử dụng các phần tử `<property>` hoặc `<constructor-arg>` có chứa phần tử `<bean>`. Inner Bean luôn là ẩn danh và luôn là một Bean nguyên mẫu.

Ví dụ, giả sử chúng ta có một lớp Student, trong đó có tham chiếu đến lớp Person. Ở đây, chúng ta chỉ tạo một instance của lớp Person và sử dụng nó trong lớp Student.

Student.java

```java
public class Student {
    private Person person;
    //Setters and Getters
}
public class Person {
    private String name;
    private String address;
    //Setters and Getters
}
```

bean.xml

```xml
<bean id=“StudentBean" class="com.edureka.Student">
    <property name="person">
        <!--This is inner bean -->
        <bean class="com.edureka.Person">
            <property name="name" value=“Scott"></property>
            <property name="address" value=“Bangalore"></property>
        </bean>
    </property>
</bean>
```

#### Spring Wiring là gì?

Khi các Bean được kết hợp với nhau trong Spring container, quá trình này được gọi là Wiring hoặc Bean Wiring. Spring container cần biết những Bean nào cần và container nên sử dụng Dependency Injection để kết hợp các Bean lại với nhau.

#### Có những cách nào để tự động kết hợp (autowire) Bean trong Spring?

Spring container có thể tự động kết hợp các Bean. Điều này có nghĩa là container sẽ tự động giải quyết các phụ thuộc của Bean bằng cách kiểm tra nội dung của BeanFactory.

Có các chế độ tự động kết hợp (autowire) khác nhau:

- **no** - Đây là cấu hình mặc định, không có tự động kết hợp. Cần sử dụng tham chiếu Bean rõ ràng để kết hợp.
- **byName** - Tự động kết hợp dựa trên tên của Bean. Nó sẽ kết hợp các thuộc tính của Bean với các Bean được định nghĩa trong tệp XML có cùng tên.
- **byType** - Tự động kết hợp dựa trên kiểu của Bean. Nếu kiểu thuộc tính khớp với tên Bean trong tệp XML, nó sẽ kết hợp thuộc tính đó.
- **constructor** - Tự động kết hợp bằng cách gọi hàm tạo của lớp. Nó có nhiều tham số.
- **autodetect** - Đầu tiên, container thử kết hợp bằng cách sử dụng autowire constructor, nếu không thành công, container sẽ thử kết hợp bằng cách sử dụng autowire byType.

#### Hạn chế của autowiring là gì?

- Khả năng ghi đè: Bạn luôn có thể sử dụng các phần tử `<constructor-arg>` và `<property>` để chỉ định các phụ thuộc, điều này sẽ ghi đè việc tự động kết hợp.
- Kiểu dữ liệu cơ bản: Các thuộc tính đơn giản (như kiểu dữ liệu cơ bản, chuỗi và lớp) không thể tự động kết hợp.
- Tính không chính xác: Luôn nên ưu tiên sử dụng kết hợp rõ ràng để tránh sự không chính xác của tự động kết hợp.

### AOP

#### AOP là gì?

AOP (Aspect-Oriented Programming), hay còn gọi là lập trình hướng khía cạnh, là một phương pháp lập trình trong đó chúng ta tập trung vào các khía cạnh giao diện chung của hệ thống, gọi là các khía cạnh (aspects), thay vì tập trung vào các lớp riêng lẻ.

#### Aspect, Advice, Pointcut, JointPoint và Advice trong AOP là gì?

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230726010348.png)

- **Aspect** - Aspect là một lớp thực hiện các vấn đề giao cắt trong chương trình, ví dụ như quản lý giao dịch. Aspect có thể là một lớp thông thường được cấu hình trong tệp cấu hình Bean của Spring hoặc có thể được đánh dấu là một Aspect bằng cách sử dụng @Aspect annotation.
- **Advice** - Advice là hành động được thực hiện tại một điểm giao cắt cụ thể. Trong lập trình, chúng được thực hiện trong các phương thức được kích hoạt khi một điểm giao cắt cụ thể trong ứng dụng được đạt đến. Advice có thể được coi như các interceptor (chặn) hoặc filter (bộ lọc) trong Spring.
- **Pointcut** - Pointcut là một biểu thức chính quy (regular expression) xác định các điểm giao cắt nơi Advice sẽ được áp dụng. Spring Framework sử dụng AspectJ Pointcut Expression Language để xác định các điểm giao cắt mà Advice sẽ được áp dụng.
- **JointPoint** - JointPoint là một điểm thực thi trong chương trình, ví dụ như việc gọi một phương thức hoặc xảy ra một ngoại lệ. Trong Spring AOP, JointPoint luôn là một phương thức của một đối tượng.

#### Advice là gì?

Hành động được thực hiện bởi Aspect tại một điểm nối cụ thể được gọi là Advice. Spring AOP sử dụng một Advice như một interceptor, duy trì một loạt các interceptor "xung quanh" JoinPoint.

#### Có những loại Advice nào trong AOP?

- **Before** - Advice này được thực thi trước khi phương thức joinpoint được gọi và được đánh dấu bằng @Before annotation.
- **After Returning** - Advice này được thực thi sau khi phương thức joinpoint hoàn thành một cách bình thường và được đánh dấu bằng @AfterReturning annotation.
- **After Throwing** - Advice này chỉ được thực thi khi phương thức joinpoint ném ra một ngoại lệ và được đánh dấu bằng @AfterThrowing annotation.
- **After (finally)** - Advice này được thực thi sau khi phương thức joinpoint hoàn thành, bất kể có ngoại lệ xảy ra hay không, và được đánh dấu bằng @After annotation.
- **Around** - Advice này được thực thi trước và sau khi phương thức joinpoint được gọi và được đánh dấu bằng @Around annotation.

#### Sự khác biệt giữa concern và cross-cutting concern trong Spring AOP là gì?

- **Concern**: Concern là hành vi mà chúng ta muốn xác định trong một module cụ thể của ứng dụng. Nó có thể được định nghĩa là các chức năng mà chúng ta muốn thực hiện.
    
- **Cross-cutting concern**: Cross-cutting concern là một hành vi áp dụng cho toàn bộ ứng dụng và ảnh hưởng đến toàn bộ ứng dụng. Ví dụ, ghi log, bảo mật và truyền dữ liệu là những vấn đề mà hầu hết các module của ứng dụng cần qu

#### AOP có những cách triển khai nào?

Có hai phương pháp chính để triển khai AOP:

- Đại diện tĩnh - Được thực hiện bằng cách sử dụng các lệnh được cung cấp bởi framework AOP để biên dịch và tạo ra các lớp đại diện AOP trong quá trình biên dịch, do đó còn được gọi là tăng cường thời gian biên dịch;
    - Thêu vào thời gian biên dịch (thực hiện bởi trình biên dịch đặc biệt)
    - Thêu vào thời gian tải lớp (thực hiện bởi lớp tải đặc biệt).
- Đại diện động - Tạo ra các lớp đại diện AOP tạm thời trong bộ nhớ trong quá trình chạy, do đó còn được gọi là tăng cường thời gian chạy.
    - Đại diện động JDK
    - CGLIB

#### Sự khác biệt giữa Spring AOP và AspectJ AOP là gì?

Spring AOP dựa trên việc tạo động proxy; AspectJ dựa trên việc tạo động bytecode.  
Spring AOP chỉ hỗ trợ Pointcut ở mức phương thức; AspectJ hỗ trợ Pointcut ở mức thuộc tính.

#### Hiểu về Proxy trong Spring

Đối tượng được tạo ra sau khi áp dụng Advice vào đối tượng mục tiêu được gọi là Proxy. Trong trường hợp của đối tượng khách hàng, đối tượng mục tiêu và đối tượng proxy là cùng một.

```
Advice + Target Object = Proxy
```

#### Weaving là gì?

Weaving là quá trình liên kết một aspect với các loại ứng dụng hoặc đối tượng khác để tạo ra một đối tượng advice. Trong Spring AOP, weaving được thực hiện trong thời gian chạy. Xem hình ảnh sau:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230726011516.png)

## Chú thích (Annotation)

### Bạn đã sử dụng những chú thích Spring quan trọng nào?

- **@Controller** - Được sử dụng cho các lớp điều khiển trong dự án Spring MVC.
- **@Service** - Được sử dụng cho các lớp dịch vụ.
- **@RequestMapping** - Được sử dụng để cấu hình ánh xạ URI trong các phương thức xử lý điều khiển.
- **@ResponseBody** - Được sử dụng để gửi đối tượng dưới dạng phản hồi, thường được sử dụng để gửi dữ liệu XML hoặc JSON như phản hồi.
- **@PathVariable** - Được sử dụng để ánh xạ giá trị động từ URI vào tham số của phương thức xử lý.
- **@Autowired** - Được sử dụng để tự động nạp các phụ thuộc trong bean của Spring.
- **@Qualifier** - Sử dụng cùng với @Autowired để tránh sự nhầm lẫn khi có nhiều phiên bản của cùng một loại bean.
- **@Scope** - Được sử dụng để cấu hình phạm vi của bean trong Spring.
- **@Configuration**, **@ComponentScan** và **@Bean** - Được sử dụng cho cấu hình dựa trên Java.
- **@Aspect**, **@Before**, **@After**, **@Around**, **@Pointcut** - Được sử dụng cho lập trình hướng khía cạnh (AOP).

### Làm thế nào để kích hoạt chú thích tự động trong Spring?

Mặc định, chú thích tự động không được kích hoạt trong Spring container. Do đó, để sử dụng chú thích tự động, chúng ta phải kích hoạt nó bằng cách cấu hình phần tử `<context:annotation-config />` trong tệp cấu hình Spring.

### Sự khác nhau giữa @Component, @Controller, @Repository, @Service là gì?

- @Component: Đánh dấu một lớp Java là một bean. Đây là cấu trúc chung cho bất kỳ thành phần quản lý nào của Spring. Cơ chế quét thành phần của Spring hiện tại có thể tìm thấy nó và kéo nó vào môi trường ứng dụng.
- @Controller: Đánh dấu một lớp là một điều khiển Spring Web MVC. Bean được đánh dấu sẽ tự động được nhập vào trong container IoC.
- @Service: Chú thích này là một sự đặc biệt hóa của chú thích @Component. Nó không cung cấp bất kỳ hành vi bổ sung nào so với chú thích @Component. Bạn có thể sử dụng @Service trong các lớp dịch vụ thay vì @Component vì nó chỉ định ý định một cách rõ ràng hơn.
- @Repository: Chú thích này là một sự đặc biệt hóa của chú thích @Component với mục đích tương tự và chức năng tương tự. Nó cung cấp lợi ích bổ sung cho DAO. Nó nhập các DAO vào trong container IoC và cho phép chuyển đổi ngoại lệ không kiểm tra thành Spring DataAccessException.

### Ý nghĩa của chú thích @Required là gì?

@Required được áp dụng cho các phương thức setter của thuộc tính bean. Chú thích này chỉ ra rằng thuộc tính bean bắt buộc phải được cung cấp giá trị trong cấu hình hoặc được tự động nạp bằng cách sử dụng autowiring. Nếu thuộc tính bean chưa được cung cấp giá trị, container sẽ ném ra ngoại lệ BeanInitializationException.

Ví dụ:

```java
public class Employee {
    private String name;
    @Required
    public void setName(String name){
        this.name=name;
    }
    public string getName(){
        return name;
    }
}
```

### Ý nghĩa của chú thích @Autowired là gì?

@Autowired cho phép kiểm soát chính xác hơn về việc nạp tự động nên diễn ra ở đâu và như thế nào. Chú thích này được sử dụng để tự động nạp bean thông qua autowiring trên các phương thức setter, constructor, thuộc tính hoặc phương thức với tên tùy ý và nhiều tham số. Theo mặc định, nó sẽ tự động nạp theo kiểu.

```java
public class Employee {
    private String name;
    @Autowired
    public void setName(String name) {
        this.name=name;
    }
    public string getName(){
        return name;
    }
}
```

### Ý nghĩa của chú thích @Qualifier là gì?

Khi bạn tạo nhiều phiên bản bean cùng loại và chỉ muốn autowire một bean cụ thể, bạn có thể sử dụng @Qualifier chung với @Autowired để loại bỏ sự mơ hồ.

Ví dụ, ở đây chúng ta có hai lớp, Employee và EmpAccount. Trong EmpAccount, chúng ta sử dụng @Qualifier để chỉ định rằng nó phải autowire bean có id là emp1.

Employee.java

```java
public class Employee {
    private String name;
    @Autowired
    public void setName(String name) {
        this.name=name;
    }
    public string getName() {
        return name;
    }
}
```

EmpAccount.java

```java
public class EmpAccount {
    private Employee emp;

    @Autowired
    @Qualifier(emp1)
    public void showName() {
        System.out.println(“Employee name : ”+emp.getName);
    }
}
```

### Ý nghĩa của chú thích @RequestMapping là gì?

Chú thích @RequestMapping được sử dụng để ánh xạ các phương thức xử lý yêu cầu HTTP cụ thể vào các lớp/ phương thức xử lý tương ứng trong điều khiển. Chú thích này có thể được áp dụng ở hai cấp:

- Cấp lớp: Ánh xạ URL của yêu cầu.
- Cấp phương thức: Ánh xạ URL và phương thức yêu cầu HTTP.

Ví dụ:

```java
@Controller
@RequestMapping("/employees")
public class EmployeeController {
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public String getEmployee(@PathVariable("id") int id) {
        // Xử lý yêu cầu
        return "employee";
    }
}
```

## Dữ liệu

### Spring DAO được sử dụng để làm gì?

Spring DAO giúp làm cho việc truy cập dữ liệu với các công nghệ như JDBC, Hibernate hoặc JDO dễ dàng hơn theo một cách thống nhất. Điều này giúp người dùng dễ dàng chuyển đổi giữa các công nghệ liên quan đến sự bền vững. Nó cũng cho phép bạn viết mã mà không cần quan tâm đến việc xử lý các ngoại lệ khác nhau của từng công nghệ.

### Liệt kê các ngoại lệ mà Spring DAO ném ra

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/spring-data-access-exception.png)

### Có những lớp nào trong API JDBC của Spring?

- JdbcTemplate
- SimpleJdbcTemplate
- NamedParameterJdbcTemplate
- SimpleJdbcInsert
- SimpleJdbcCall

### Có những cách nào để truy cập Hibernate bằng Spring?

Chúng ta có thể sử dụng Spring để truy cập Hibernate theo hai cách:

1. Sử dụng Hibernate Template và inversion of control (IoC) với callback.
2. Mở rộng HibernateDAOSupport và áp dụng interceptor AOP.

### Liệt kê các loại quản lý giao dịch mà Spring hỗ trợ.

Spring hỗ trợ hai loại quản lý giao dịch:

1. Quản lý giao dịch theo cách lập trình: Trong quá trình này, giao dịch được quản lý bằng cách lập trình. Nó cung cấp sự linh hoạt lớn cho bạn, nhưng khó khăn trong việc bảo trì.
2. Quản lý giao dịch theo cách khai báo: Trong trường hợp này, quản lý giao dịch được tách biệt với mã kinh doanh. Nó chỉ cần sử dụng chú thích hoặc cấu hình dựa trên XML để quản lý giao dịch.

### Spring hỗ trợ ORM nào?

- Hibernate
- iBatis
- JPA (Java Persistence API)
- JDO (Java Data Objects)
- OJB (Object Relational Bridge)

## MVC

### Spring MVC Framework được sử dụng để làm gì?

Spring MVC Framework cung cấp một kiến trúc Model-View-Controller (MVC) và các thành phần sẵn có để phát triển ứng dụng web linh hoạt và lỏng lẻo. Mô hình MVC giúp tách biệt các khía cạnh khác nhau của ứng dụng, chẳng hạn như logic nhập, logic kinh doanh và logic giao diện người dùng, đồng thời cung cấp sự liên kết lỏng lẻo giữa tất cả các yếu tố này.

### Mô tả quy trình làm việc của DispatcherServlet

Quy trình làm việc của DispatcherServlet có thể được mô tả bằng một sơ đồ như sau:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230726012657.png)

1. Gửi yêu cầu HTTP đến máy chủ, yêu cầu được bắt bởi front controller `DispatcherServlet`.
2. `DispatcherServlet` phân tích cú pháp URL của yêu cầu dựa trên cấu hình trong tệp **-servlet.xml**, từ đó nhận được định danh tài nguyên yêu cầu (URI). Sau đó, dựa trên URI đó, nó gọi `HandlerMapping` để lấy tất cả các đối tượng liên quan (bao gồm đối tượng Handler và các interceptor tương ứng) được cấu hình cho Handler đó, và trả về dưới dạng đối tượng `HandlerExecutionChain`.
3. `DispatcherServlet` dựa trên Handler nhận được, chọn một `HandlerAdapter` phù hợp. (Lưu ý: Nếu thành công lấy được `HandlerAdapter`, tại thời điểm này, việc thực hiện phương thức preHandler(…) của interceptor sẽ bắt đầu).
4. Trích xuất dữ liệu mô hình từ `Request`, điền vào các tham số của Handler và bắt đầu thực hiện Handler (Controller). Trong quá trình điền vào tham số của Handler, dựa trên cấu hình của bạn, Spring sẽ thực hiện một số công việc bổ sung cho bạn:
    - HttpMessageConverter: Chuyển đổi thông điệp yêu cầu (như dữ liệu JSON, XML) thành một đối tượng và chuyển đổi đối tượng thành thông điệp phản hồi mong muốn.
    - Data Conversion: Chuyển đổi dữ liệu yêu cầu. Ví dụ: Chuyển đổi `String` thành `Integer`, `Double`, v.v.
    - Data Formatting: Định dạng dữ liệu yêu cầu. Ví dụ: Chuyển đổi chuỗi thành số đã định dạng hoặc ngày tháng đã định dạng.
    - Data Validation: Kiểm tra tính hợp lệ của dữ liệu (độ dài, định dạng, v.v.), kết quả kiểm tra được lưu trữ trong `BindingResult` hoặc `Error`.
5. Sau khi Handler (Controller) thực hiện xong, trả về một đối tượng `ModelAndView` cho `DispatcherServlet`.
6. Dựa trên `ModelAndView` trả về, chọn một `ViewResolver` phù hợp (phải được đăng ký trong Spring container) và trả về cho `DispatcherServlet`.
7. `ViewResolver` kết hợp `Model` và `View` để tạo ra kết quả hiển thị.
8. `View` chịu trách nhiệm trả kết quả hiển thị về cho client.

### Giới thiệu về WebApplicationContext

WebApplicationContext là một phiên bản mở rộng của ApplicationContext. Nó có các tính năng bổ sung cần thiết cho ứng dụng web. Nó khác với ApplicationContext thông thường trong việc xử lý chủ đề và xác định servlet nào liên kết với nó.

## Tài liệu

- [Top 50 Spring Interview Questions and Answers in 2023 | Edureka](https://www.edureka.co/blog/interview-questions/spring-interview-questions/)
- [Spring Interview Questions and Answers | DigitalOcean](https://www.digitalocean.com/community/tutorials/spring-interview-questions-and-answers)
