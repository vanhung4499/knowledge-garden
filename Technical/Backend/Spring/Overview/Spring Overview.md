---
title: Spring Overview
tags: [spring, java, backend]
categories: [spring, java, backend]
date created: 2023-07-25
date modified: 2024-02-21
---

# Tổng quan về Spring Framework

## Giới thiệu về Spring Framework

Spring Framework là framework phát triển ứng dụng Java doanh nghiệp phổ biến nhất. Đây là giải pháp nhẹ và toàn diện để xây dựng các ứng dụng doanh nghiệp.

Khi nói về kích cỡ và tính minh bạch, Spring được coi là nhẹ. Phiên bản cơ bản của Spring Framework có kích thước khoảng 2 MB.

Các tính năng cốt lõi của Spring Framework có thể được sử dụng để phát triển bất kỳ ứng dụng Java nào, nhưng để xây dựng ứng dụng web trên nền tảng Java EE thì cần phải mở rộng. Mục tiêu của Spring Framework là làm cho việc phát triển J2EE trở nên dễ dàng hơn, bằng cách khuyến khích thực hành lập trình tốt dựa trên mô hình lập trình POJO.

Các nguyên tắc thiết kế của Spring Framework bao gồm:

- Luôn luôn tạo điều kiện cho việc lựa chọn
- Thể hiện tinh thần bao dung
- Duy trì khả năng tương thích ngược
- Tập trung vào thiết kế API
- Theo đuổi chất lượng mã nguồn nghiêm ngặt

## Tại sao sử dụng Spring

Dưới đây là các lợi ích chính khi sử dụng Spring Framework:

- Spring cho phép các nhà phát triển xây dựng ứng dụng doanh nghiệp bằng cách sử dụng POJOs. Lợi ích của việc chỉ sử dụng POJOs là bạn không cần một sản phẩm chứa EJB, như một máy chủ ứng dụng, nhưng bạn có thể chọn sử dụng một chứa servlet mạnh mẽ, như Tomcat hoặc một số sản phẩm thương mại.
- Spring được tổ chức trong một mô hình đơn vị. Ngay cả khi số lượng gói và lớp rất lớn, bạn chỉ cần chọn những phần bạn cần và bỏ qua phần còn lại.
- Spring không làm bạn lãng phí công sức làm việc lặp đi lặp lại, nó thực sự tận dụng một số công nghệ hiện có, như một số framework ORM, framework ghi log, JEE, Quartz và bộ hẹn giờ JDK, công nghệ xem khác.
- Việc kiểm tra một ứng dụng được viết bằng Spring rất dễ dàng, vì mã phụ thuộc vào môi trường đã được đưa vào framework này. Hơn nữa, bằng cách sử dụng POJOs theo phong cách JavaBean, việc tiêm dữ liệu kiểm tra dựa trên sự phụ thuộc trở nên dễ dàng hơn.
- Web framework của Spring là một web MVC framework được thiết kế tốt, cung cấp một lựa chọn thay thế tốt cho các web framework, như Structs hoặc các framework web khác ít phổ biến hơn.
- Spring cung cấp một API thuận tiện để dịch các ngoại lệ cụ thể cho công nghệ (ví dụ, các ngoại lệ được ném bởi JDBC, Hibernate, hoặc JDO) thành các ngoại lệ không được kiểm tra đồng nhất.
- Chứa IOC nhẹ thường rất nhẹ, đặc biệt là khi so sánh với các chứa EJB. Điều này thuận lợi cho việc phát triển và triển khai ứng dụng trên các máy tính có tài nguyên bộ nhớ và CPU hạn chế.
- Spring cung cấp một giao diện quản lý giao dịch nhất quán, giao diện này có thể thu nhỏ thành một giao dịch cục bộ (ví dụ, sử dụng một cơ sở dữ liệu duy nhất) và mở rộng thành một giao dịch toàn cầu (ví dụ, sử dụng JTA).

## Ý tưởng cốt lõi

Hai ý tưởng công nghệ cốt lõi nhất của Spring là: IoC và Aop

### IoC

`IoC` tương đương với `Inversion of Control`, nghĩa là "Đảo ngược quyền kiểm soát".

Công nghệ được Spring công nhận nhất là mô hình **Dependency Injection (DI)** của kiểm soát đảo ngược (IoC). Kiểm soát đảo ngược (IoC) là một khái niệm chung, có thể được biểu đạt bằng nhiều cách khác nhau, và Dependency Injection chỉ là một ví dụ cụ thể của kiểm soát đảo ngược.

Khi viết một ứng dụng Java phức tạp, các lớp ứng dụng nên độc lập với các lớp Java khác càng nhiều càng tốt để tăng khả năng tái sử dụng của các lớp này, và khi thực hiện kiểm tra đơn vị, có thể kiểm tra chúng độc lập với các lớp khác. Dependency Injection (hoặc đôi khi được gọi là wiring) giúp dính các lớp này lại với nhau và đồng thời giữ cho chúng độc lập.

Vậy Dependency Injection là gì? Hãy chia hai từ này ra để xem. Phần phụ thuộc ở đây được chuyển thành mối liên kết giữa hai lớp. Ví dụ, lớp A phụ thuộc vào lớp B. Bây giờ, hãy xem phần thứ hai, Injection. Tất cả điều này có nghĩa là lớp B sẽ được Inject vào lớp A thông qua IoC.

Dependency Injection có thể xảy ra bằng cách truyền tham số vào hàm tạo, hoặc thông qua việc sử dụng phương thức setter sau khi tạo. Vì Dependency Injection là một phần cốt lõi của Spring Framework, nên tôi sẽ giải thích khái niệm này trong một chương riêng bằng cách sử dụng một số ví dụ tốt.

### Aop

Một thành phần chính của Spring Framework là **Lập trình hướng khía cạnh (Aspect-Oriented Programming)**. Những chức năng kéo dài qua nhiều điểm trong một chương trình được gọi là **cross-cutting concerns**, những điểm này về mặt khái niệm độc lập với logic nghiệp vụ của ứng dụng. Có rất nhiều ví dụ tốt và phổ biến về khía cạnh, như ghi log, giao dịch khai báo, bảo mật và bộ nhớ cache, v.v.

Trong OOP, đơn vị mô-đun hóa chính là lớp, trong khi trong AOP, đơn vị mô-đun hóa chính là khía cạnh. AOP giúp bạn tách biệt các cross-cutting concerns khỏi các đối tượng mà chúng ảnh hưởng, trong khi Dependency Injection giúp bạn tách biệt các đối tượng ứng dụng của mình khỏi nhau.

Module AOP của Spring Framework cung cấp một triển khai lập trình hướng khía cạnh, cho phép bạn xác định các phương thức chặn và điểm cắt, có thể thực hiện chức năng tách rõ ràng các đoạn mã nên được tách biệt. Tôi sẽ thảo luận thêm về các khái niệm liên quan đến Spring AOP trong một chương riêng.

## Kiến trúc Spring

Spring Framework hiện tại có **20** gói JAR, có thể chia thành **6** module chính.

Spring Framework cung cấp rất nhiều tính năng, do đó toàn bộ kiến trúc cũng rất lớn.  
Trong quá trình phát triển ứng dụng thực tế của chúng ta, không nhất thiết phải sử dụng tất cả các tính năng, mà có thể chọn các mô-đun Spring phù hợp theo nhu cầu.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/spring-framework.png)

### Core Container

Container IoC là trung tâm của Spring Framework. Container spring sử dụng dependency injection để quản lý các thành phần tạo nên ứng dụng, nó tạo các liên kết giữa các thành phần hợp tác với nhau. Không nghi ngờ gì, những đối tượng này sẽ đơn giản hơn, dễ hiểu hơn, dễ tái sử dụng và kiểm tra hơn.  
Spring đi kèm với một số triển khai container, có thể phân loại thành hai loại:

#### BeanFactory

Được định nghĩa bởi interface `org.springframework.beans.factory.BeanFactory`.  
Đây là container đơn giản nhất, cung cấp hỗ trợ DI cơ bản.

#### ApplicationContext

Được định nghĩa bởi interface org.springframework.context.ApplicationContext.  
Nó được xây dựng trên cơ sở BeanFactory và cung cấp các dịch vụ hướng ứng dụng, chẳng hạn như khả năng phân giải thông tin văn bản từ các tệp thuộc tính, cũng như công khai sự kiện ứng dụng cho các người nghe sự kiện quan tâm.  
**_Chú ý: BeanFactory thường quá cơ bản đối với hầu hết các ứng dụng, vì vậy ApplicationContext được sử dụng rộng rãi hơn. Khuyến nghị sử dụng container ApplicationContext trong phát triển._**

Spring đi kèm với nhiều ApplicationContext, những cái mà bạn có thể gặp phải bao gồm:  
`ClassPathXmlApplicationContext`: Tải định nghĩa context từ tệp cấu hình XML dưới đường dẫn lớp.  
`FileSystemXmlApplicationContext`: Đọc tệp cấu hình XML dưới hệ thống tệp và tải định nghĩa context.  
`XmlWebApplicationContext`: Đọc tệp cấu hình XML dưới ứng dụng web và tải định nghĩa context.

**_Ví dụ_**

```java
`ApplicationContext context = new FileSystemXmlApplicationContext("D:\Temp\build.xml"); ApplicationContext context2 = new ClassPathXmlApplicationContext("build.xml");`
```

Bạn có thể thấy, việc tải `FileSystemXmlApplicationContext` và `ClassPathXmlApplicationContext` rất giống nhau.  
Sự khác biệt là: cái đầu tìm tệp build.xml dưới đường dẫn hệ thống tệp cụ thể; trong khi cái sau tìm tệp build.xml dưới tất cả các đường dẫn lớp (bao gồm cả các tệp JAR).  
Thông qua việc tham chiếu đến ApplicationContext, bạn có thể dễ dàng gọi phương thức getBean() để lấy Bean từ container Spring.

**Gói jar liên quan**

- `spring-core`, `spring-beans`, cung cấp phần cơ bản của framework, bao gồm các tính năng IoC và dependency injection.
    
- `spring-context`, xây dựng trên `spring-core`, `spring-beans`. Nó cung cấp một cách truy cập đối tượng theo kiểu framework. Nó cũng hỗ trợ các tính năng tương tự như Java EE, chẳng hạn như: EJB, JMX và remoting cơ bản. Interface ApplicationContext là trọng tâm của nó.
    
- `springcontext-support`, tích hợp thư viện bên thứ ba vào Spring application context.
    
- `spring-expression`, cung cấp một ngôn ngữ biểu thức mạnh mẽ để truy vấn và thao tác đồ thị đối tượng tại thời gian chạy.

### AOP và Instrumentation

**Các gói jar liên quan**

- `spring-aop`, cung cấp hỗ trợ phong phú cho lập trình hướng khía cạnh.
- `spring-aspects`, cung cấp sự tích hợp với AspectJ.
- `spring-instrument`, cung cấp hỗ trợ cho instrumentation lớp và class loader.
- `spring-instrument-tomcat`, bao gồm hỗ trợ instrumentation Spring cho Tomcat.

### Messaging

**Các gói jar liên quan**

- `spring-messaging`, bao gồm các chức năng xử lý tin nhắn của Spring, như Message, MessageChannel, MessageHandler.

### Data Access / Integration

Lớp Data Access/Integration bao gồm các mô-đun JDBC / ORM / OXM / JMS và Transaction.

**Các gói jar liên quan**

- `spring-jdbc`, cung cấp một lớp trừu tượng JDBC.
- `spring-tx`, hỗ trợ quản lý giao dịch lập trình và khai báo.
- `spring-orm`, cung cấp tập API ánh xạ đối tượng quan hệ phổ biến, như JPA, JDO, Hibernate.
- `spring-oxm`, cung cấp một lớp trừu tượng để hỗ trợ các triển khai ánh xạ đối tượng/XML, như JAXB, Castor, XMLBeans, JiBX và XStream.
- `spring-jms`, bao gồm các chức năng sản xuất và tiêu thụ tin nhắn.

### Web

**Các gói jar liên quan**

- `spring-web`, cung cấp các chức năng cơ bản hướng web, như tải nhiều tệp, khởi tạo container IoC bằng người nghe Servlet. Một context ứng dụng hướng ứng dụng web.
- `spring-webmvc`, bao gồm cả MVC và triển khai dịch vụ web REST.
- `spring-webmvc-portlet`, cung cấp triển khai MVC trong môi trường Portlet và các chức năng phản ánh của `spring-webmvc`.

### Test

**Các gói jar liên quan**

- `spring-test`, hỗ trợ kiểm thử đơn vị và kiểm thử tích hợp cho các thành phần Spring bằng cách sử dụng Junit và TestNG.

## Thuật ngữ

- **Ứng dụng**: là sản phẩm hoàn chỉnh có thể hoàn thành các chức năng mà chúng ta cần, ví dụ như trang web mua sắm, hệ thống OA.
- **Framework**: là sản phẩm bán thành phẩm có thể hoàn thành một số chức năng nhất định, ví dụ, chúng ta có thể sử dụng framework để phát triển trang web mua sắm; framework thực hiện một phần chức năng, chúng tôi thực hiện một phần chức năng, và sau đó ứng dụng được tạo ra. Hơn nữa, framework quy định kiến trúc tổng thể của bạn khi phát triển ứng dụng, cung cấp một số chức năng cơ bản, cũng quy định cách tạo và cách làm việc của các lớp và đối tượng, từ đó đơn giản hóa quá trình phát triển của chúng tôi, cho phép chúng tôi tập trung vào phát triển logic kinh doanh.
- **Thiết kế không xâm nhập**: từ góc độ của framework, nếu không cần kế thừa từ các lớp cung cấp bởi framework, thiết kế này có thể được coi là thiết kế không xâm nhập, nếu kế thừa từ các lớp framework, đó là thiết kế xâm nhập, nếu sau này muốn thay đổi framework, mã đã viết trước đó hầu như không thể tái sử dụng, nếu là thiết kế không xâm nhập thì mã đã viết trước đó vẫn có thể tiếp tục sử dụng.
- **Nhẹ và nặng**: Nhẹ là tương đối với nặng, nhẹ thường là không xâm nhập, phụ thuộc rất ít, sử dụng rất ít tài nguyên, triển khai đơn giản, vv, thực tế là rất dễ sử dụng, còn nặng thì ngược lại.
- **POJO**: POJO (Plain Old Java Objects) là các đối tượng Java đơn giản, chúng có thể chứa logic kinh doanh hoặc logic lưu trữ, nhưng không đóng vai trò đặc biệt nào và không kế thừa hay không thực hiện bất kỳ lớp hoặc interface nào của các framework Java khác.
- **Container**: Trong cuộc sống hàng ngày, container chỉ là một loại dụng cụ chứa đựng, từ góc độ thiết kế chương trình, đó là đối tượng chứa đựng các đối tượng khác, vì có các hoạt động như đặt vào, lấy ra, v.v., nên container cũng phải quản lý vòng đời của các đối tượng.
- **Đảo ngược kiểm soát**: tức Inversion of Control, viết tắt là IoC, đảo ngược kiểm soát còn có một tên khác là dependency injection, đó là container điều khiển mối quan hệ giữa các chương trình, chứ không phải là việc điều khiển trực tiếp bằng mã chương trình như truyền thống.
- **JavaBean**: thường chỉ các đối tượng quản lý bởi container, trong Spring, nó chỉ các đối tượng quản lý bởi container IoC Spring.
