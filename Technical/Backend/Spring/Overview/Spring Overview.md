---
title: Spring Overview
tags: [spring, java, backend]
categories: [spring, java, backend]
date created: 2023-07-25
date modified: 2023-07-25
---

# Tổng quan về Spring Framework

## Spring Framework là gì?

Spring là một framework Java mã nguồn mở, mục tiêu của nó là đơn giản hóa việc phát triển ứng dụng doanh nghiệp.

Spring Framework cung cấp nhiều tính năng, bao gồm dependency injection, aspect-oriented programming, data access, transaction management, web application development, v.v. Bằng cách sử dụng Spring, nhà phát triển có thể tập trung vào việc triển khai logic kinh doanh mà không cần quan tâm đến các chi tiết kỹ thuật cơ bản.

Spring Framework là một framework nhẹ, nó có một core container rất nhỏ gọn chỉ bao gồm một số lượng ít các lớp và giao diện, nhưng nó cung cấp nhiều module mở rộng có thể linh hoạt chọn lựa theo nhu cầu. Spring Framework được thiết kế với sự kết hợp lỏng lẻo, có thể tích hợp dễ dàng với các framework và thư viện khác như Hibernate, MyBatis, Struts, v.v.

Các tính năng chính của Spring:

1. **Nhẹ nhàng và không xâm nhập**: Core container của Spring Framework rất nhỏ gọn và không bắt buộc nhà phát triển tuân theo một mô hình lập trình cụ thể.
2. **Dependency Injection**: Spring Framework cho phép quản lý các mối quan hệ phụ thuộc giữa các đối tượng thông qua dependency injection, giảm sự ràng buộc giữa các lớp.
3. **Aspect-Oriented Programming**: Spring Framework cung cấp hỗ trợ cho AOP (Aspect-Oriented Programming), cho phép triển khai các khía cạnh giao diện mà không cần sửa đổi logic kinh doanh.
4. **Quản lý giao dịch**: Spring Framework cung cấp hỗ trợ quản lý giao dịch, cho phép quản lý giao dịch đa nguồn dữ liệu.
5. **Phát triển ứng dụng web**: Spring Framework cung cấp hỗ trợ cho MVC (Model-View-Controller), giúp dễ dàng phát triển ứng dụng web.
6. **Dễ kiểm thử**: Thiết kế lỏng lẻo và hỗ trợ dependency injection của Spring Framework giúp dễ dàng kiểm thử đơn vị và kiểm thử tích hợp.

## Tại sao sử dụng Spring?

Dưới đây là những lợi ích chính khi sử dụng Spring Framework:

- Spring cho phép nhà phát triển sử dụng POJO (Plain Old Java Objects) để phát triển ứng dụng doanh nghiệp. Việc chỉ sử dụng POJO giúp bạn không cần phải sử dụng một sản phẩm container EJB như một máy chủ ứng dụng, thay vào đó bạn có thể sử dụng một servlet container mạnh mẽ như Tomcat hoặc một số sản phẩm thương mại khác.
- Spring được tổ chức theo một mô hình đơn vị. Ngay cả khi có rất nhiều gói và lớp, bạn chỉ cần chọn phần bạn cần và bỏ qua phần còn lại.
- Spring không làm bạn làm công việc trùng lặp một cách vô ích, nó thực sự tận dụng các công nghệ hiện có như các framework ORM, framework ghi log, JEE, Quartz và JDK Timer, các công nghệ hiển thị khác.
- Kiểm thử một ứng dụng viết bằng Spring rất dễ dàng, vì mã phụ thuộc vào môi trường được đặt trong framework này. Ngoài ra, việc sử dụng POJO theo kiểu JavaBean giúp việc tiêm cấp dữ liệu kiểm thử trở nên dễ dàng hơn.
- Framework web của Spring được thiết kế tốt, cung cấp một framework MVC tốt cho việc phát triển ứng dụng web, thay thế tốt cho các framework web như Struts hoặc các framework web ít phổ biến khác.
- Spring cung cấp một API thuận tiện để chuyển đổi các ngoại lệ của các công nghệ cụ thể (ví dụ: ngoại lệ được ném bởi JDBC, Hibernate hoặc JDO) thành các ngoại lệ không kiểm tra nhất quán.
- Container IOC nhẹ thường nhẹ hơn, đặc biệt là so với các container EJB. Điều này có lợi cho việc phát triển và triển khai ứng dụng trên các máy tính có tài nguyên bộ nhớ và CPU hạn chế.
- Spring cung cấp một giao diện quản lý giao dịch nhất quán, có thể thu nhỏ thành một giao dịch cục bộ (ví dụ: sử dụng một cơ sở dữ liệu duy nhất) và mở rộng thành một giao dịch toàn cầu (ví dụ: sử dụng JTA).

## Ý tưởng cốt lõi

Hai ý tưởng chính của Spring là IoC và AOP.

### IoC (Inversion of Control - Đảo ngược điều khiển)

IoC là một khái niệm chung, có thể được biểu thị bằng nhiều cách khác nhau, và dependency injection chỉ là một ví dụ cụ thể của IoC.

Khi phát triển một ứng dụng Java phức tạp, các lớp của ứng dụng nên độc lập với các lớp Java khác để tăng tính tái sử dụng của chúng và dễ dàng kiểm thử khi chạy các bài kiểm tra đơn vị. Dependency injection (hoặc có thể gọi là wiring) giúp kết nối các lớp này với nhau và giữ cho chúng độc lập cùng một lúc.

Vậy dependency injection là gì? Hãy tách hai từ này ra và xem xét. Phần "dependency" chuyển đổi thành mối quan hệ giữa hai lớp. Ví dụ, lớp A phụ thuộc vào lớp B. Bây giờ, hãy xem xét phần "injection". Tất cả những gì nó có nghĩa là lớp B sẽ được "inject" vào lớp A thông qua IoC.

Dependency injection có thể xảy ra bằng cách truyền tham số vào constructor hoặc thông qua việc sử dụng setter method sau khi tạo đối tượng. Vì dependency injection là một phần quan trọng của Spring Framework, tôi sẽ giải thích khái niệm này bằng một ví dụ tốt trong một chương riêng.

### AOP (Aspect-Oriented Programming - Lập trình hướng khía cạnh)

Một thành phần quan trọng của Spring Framework là framework AOP (Aspect-Oriented Programming). Một chức năng bao gồm nhiều điểm trong một chương trình được gọi là một khía cạnh (aspect), và những khía cạnh này là độc lập với logic kinh doanh của ứng dụng. Có nhiều ví dụ về khía cạnh, như ghi log, quản lý giao dịch, bảo mật, và bộ nhớ cache, v.v.

Trong OOP, đơn vị modular quan trọng là lớp, trong khi trong AOP, đơn vị modular quan trọng là khía cạnh (aspect). AOP giúp bạn tách biệt khía cạnh từ các đối tượng mà chúng ảnh hưởng, trong khi dependency injection giúp bạn tách biệt các đối tượng của ứng dụng từ nhau.

Module AOP của Spring Framework cung cấp cách triển khai lập trình hướng khía cạnh, cho phép bạn xác định các phương thức chặn và điểm cắt, từ đó thực hiện việc tách rời mã nên được tách rời một cách sạch sẽ. Tôi sẽ thảo luận thêm về các khái niệm AOP của Spring trong một chương riêng.

## Kiến trúc của Spring

Spring Framework hiện tại có **20** gói JAR, có thể chia thành **6** module chính.

Spring Framework cung cấp rất nhiều tính năng phong phú, do đó kiến trúc tổng thể cũng rất lớn. Trong quá trình phát triển ứng dụng thực tế, không nhất thiết phải sử dụng tất cả các tính năng, mà có thể chọn các module Spring phù hợp theo nhu cầu.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/spring-framework.png)

### Core Container

IoC container là trung tâm của Spring Framework. Container Spring sử dụng dependency injection để quản lý các thành phần của ứng dụng và tạo ra các liên kết giữa các thành phần tương tác với nhau. Điều này giúp các đối tượng trở nên đơn giản, dễ hiểu, dễ tái sử dụng và dễ kiểm thử.  
Spring cung cấp một số implement của container, có thể chia thành hai loại:

#### BeanFactory

Được định nghĩa bởi giao diện `org.springframework.beans.factory.BeanFactory`. Đây là container đơn giản nhất, cung cấp hỗ trợ cơ bản cho dependency injection.

#### ApplicationContext

Được định nghĩa bởi giao diện `org.springframework.context.ApplicationContext`. Đây là container được xây dựng dựa trên BeanFactory và cung cấp các dịch vụ hướng ứng dụng như khả năng phân tích thông tin văn bản từ tệp thuộc tính và khả năng phát đi sự kiện ứng dụng cho các người nghe sự kiện quan tâm.  
**_Lưu ý: BeanFactory thường ở cấp quá thấp đối với phần lớn ứng dụng, vì vậy ApplicationContext được sử dụng phổ biến hơn trong quá trình phát triển. Đề nghị sử dụng ApplicationContext container trong quá trình phát triển._**

Spring cung cấp nhiều implement của ApplicationContext, nhưng phổ biến nhất có thể gặp là:  

- `ClassPathXmlApplicationContext`: Tải định nghĩa context từ tệp XML trên classpath, xem tệp định nghĩa context như một tài nguyên lớp.
- `FileSystemXmlApplicationContext`: Tải định nghĩa context từ tệp XML trên hệ thống tệp và tải định nghĩa context.  
- `XmlWebApplicationContext`: Tải định nghĩa context từ tệp XML trong ứng dụng web và tải định nghĩa context.

**_Ví dụ_**

```java
ApplicationContext context = new FileSystemXmlApplicationContext("D:\Temp\build.xml");
ApplicationContext context2 = new ClassPathXmlApplicationContext("build.xml");
```

Như bạn có thể thấy, việc tải `FileSystemXmlApplicationContext` và `ClassPathXmlApplicationContext` rất tương đồng. Sự khác biệt là: `FileSystemXmlApplicationContext` tìm kiếm tệp build.xml trong đường dẫn hệ thống tệp đã chỉ định, trong khi `ClassPathXmlApplicationContext` tìm kiếm tệp build.xml trong tất cả các đường dẫn lớp (bao gồm cả tệp JAR). Bằng cách tham chiếu đến ApplicationContext, bạn có thể dễ dàng gọi phương thức getBean() để lấy Bean từ container Spring.

**Các gói JAR liên quan**

- `spring-core`, `spring-beans`: Cung cấp phần cơ bản của framework, bao gồm IoC và tính năng dependency injection.
- `spring-context`: Xây dựng trên `spring-core`, `spring-beans`. Cung cấp một cách tiếp cận theo kiểu framework để truy cập đối tượng. Nó cũng hỗ trợ các tính năng tương tự Java EE như EJB, JMX và remoting cơ bản. Giao diện ApplicationContext là trọng tâm của nó.
- `spring-context-support`: Tích hợp các thư viện bên thứ ba vào Spring application context.
- `spring-expression`: Cung cấp một ngôn ngữ biểu thức mạnh mẽ để truy vấn và thao tác đồ thị đối tượng tại thời gian chạy.

### AOP và Instrumentation

**Các gói JAR liên quan**

- `spring-aop`: Cung cấp hỗ trợ phong phú cho lập trình hướng khía cạnh.
- `spring-aspects`: Cung cấp tích hợp với AspectJ.
- `spring-instrument`: Cung cấp hỗ trợ cho instrumentation và classloading.
- `spring-instrument-tomcat`: Bao gồm proxy instrumentation của Spring cho Tomcat.

### Messaging

**Các gói JAR liên quan**

- `spring-messaging`: Bao gồm các chức năng xử lý tin nhắn của Spring như Message, MessageChannel, MessageHandler.

### Data Access / Integration

Data Access/Integration bao gồm các module JDBC / ORM / OXM / JMS và Transaction.

**Các gói JAR liên quan**

- `spring-jdbc`: Cung cấp một lớp trừu tượng JDBC.
- `spring-tx`: Hỗ trợ quản lý giao dịch theo cách lập trình và khai báo.
- `spring-orm`: Cung cấp một tập hợp các API phổ biến cho ánh xạ đối tượng quan hệ như JPA, JDO, Hibernate.
- `spring-oxm`: Cung cấp một lớp trừu tượng để hỗ trợ ánh xạ đối tượng/XML, bao gồm JAXB, Castor, XMLBeans, JiBX và XStream.
- `spring-jms`: Bao gồm các chức năng sản xuất và tiêu thụ tin nhắn.

### Web

**Các gói JAR liên quan**

- `spring-web`: Cung cấp các tính năng cơ bản dành cho web như tải lên nhiều tệp, khởi tạo container IoC bằng Servlet Listener. Là một ApplicationContext dành cho web.
- `spring-webmvc`: Bao gồm cài đặt MVC và REST web service.
- `spring-webmvc-portlet`: Cung cấp cài đặt MVC trong môi trường Portlet và là một phiên bản của `spring-webmvc` chứa các tính năng tương tự.

### Test

**Các gói JAR liên quan**

- `spring-test`: Hỗ trợ việc kiểm thử đơn vị và kiểm thử tích hợp của các thành phần Spring bằng JUnit và TestNG.

## Thuật ngữ

- **Ứng dụng**: Là sản phẩm hoàn chỉnh có thể thực hiện các chức năng mà chúng ta cần, ví dụ như trang web mua sắm, hệ thống OA.
- **Framework**: Là một sản phẩm bán thành phẩm có thể thực hiện một số chức năng nhất định, ví dụ như chúng ta có thể sử dụng framework để phát triển trang web mua sắm; framework thực hiện một phần chức năng, chúng ta thực hiện một phần chức năng, từ đó tạo ra ứng dụng. Ngoài ra, framework quy định cấu trúc tổng thể khi phát triển ứng dụng, cung cấp một số chức năng cơ bản và quy định cách tạo và làm việc với lớp và đối tượng, từ đó đơn giản hóa quá trình phát triển, cho phép chúng ta tập trung vào phát triển logic kinh doanh.
- **Thiết kế không xâm nhập**: Từ góc độ của framework, nghĩa là không cần kế thừa các lớp mà khung cung cấp, thiết kế này có thể coi là thiết kế không xâm nhập. Nếu kế thừa các lớp của khung, đó là thiết kế xâm nhập, nếu muốn thay đổi khung đã viết trước đó, mã đã viết trước đó gần như không thể sử dụng lại. Nếu thiết kế không xâm nhập, mã đã viết trước đó vẫn có thể tiếp tục sử dụng.
- **Nhẹ và nặng**: Nhẹ là so với nặng, nhẹ thường là không xâm nhập, không phụ thuộc vào nhiều thứ, tài nguyên chiếm ít, triển khai đơn giản và còn nhiều điều tương tự. Trái lại, nặng thì ngược lại.
- **POJO**: POJO (Plain Old Java Objects) là đối tượng Java đơn giản, nó có thể chứa logic kinh doanh hoặc logic lưu trữ, nhưng không đóng vai trò đặc biệt hoặc kế thừa hoặc thực hiện bất kỳ lớp hoặc giao diện của các framework Java khác.
- **Container**: Trong cuộc sống hàng ngày, container là một loại đồ vật để chứa đồ, từ góc độ thiết kế chương trình, container là đối tượng chứa đối tượng, vì có các hoạt động như đặt vào, lấy ra và các hoạt động tương tự, nên container cũng phải quản lý vòng đời của đối tượng.
- **Inversion of Control (IoC)**: Được viết tắt là IoC, Inversion of Control (Đảo ngược điều khiển) còn được gọi là Dependency Injection (Tiêm phụ thuộc), nghĩa là việc điều khiển mối quan hệ giữa các chương trình bằng cách sử dụng bộ chứa, thay vì việc điều khiển trực tiếp bằng mã chương trình như trong cách thực hiện truyền thống.
- **JavaBean**: Thông thường chỉ đối tượng được quản lý bởi bộ chứa, trong Spring nghĩa là đối tượng được quản lý bởi bộ chứa Spring IoC.
