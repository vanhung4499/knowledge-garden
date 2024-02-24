---
title: Spring and Mybatis
tags:
  - spring
  - java
  - db
  - backend
categories:
  - spring
  - java
  - db
  - backend
date created: 2023-08-11
date modified: 2024-02-22
---

# Tích hợp MyBatis với Spring

[MyBatis](http://www.mybatis.org/mybatis-3/) là một framework trung gian, hỗ trợ SQL tùy chỉnh, stored procedure và ánh xạ cao cấp. MyBatis loại bỏ hầu như tất cả các mã JDBC và cài đặt tham số thủ công cũng như nhận kết quả trả về. MyBatis có thể sử dụng XML đơn giản hoặc annotation để cấu hình và ánh xạ các kiểu nguyên thủy, interface và POJO (Plain Old Java Objects) thành các bản ghi trong cơ sở dữ liệu.

## Bắt đầu nhanh

Để sử dụng MyBatis, bạn chỉ cần đặt tệp [mybatis-x.x.x.jar](https://github.com/mybatis/mybatis-3/releases) vào classpath.

Nếu bạn sử dụng Maven để xây dựng dự án, hãy thêm mã phụ thuộc sau vào tệp pom.xml:

```xml
<dependency>
  <groupId>org.mybatis</groupId>
  <artifactId>mybatis</artifactId>
  <version>x.x.x</version>
</dependency>
```

### Xây dựng SqlSessionFactory từ XML

Mỗi ứng dụng dựa trên MyBatis đều tập trung vào một thể hiện của SqlSessionFactory. Thể hiện SqlSessionFactory có thể được lấy thông qua SqlSessionFactoryBuilder. Và SqlSessionFactoryBuilder có thể xây dựng SqlSessionFactory từ tệp cấu hình XML hoặc từ một thể hiện Configuration đã được cấu hình trước.

Xây dựng một thể hiện SqlSessionFactory từ tệp XML rất đơn giản, nên sử dụng tệp tài nguyên trong classpath để cấu hình. Tuy nhiên, bạn cũng có thể sử dụng bất kỳ thể hiện InputStream nào, ví dụ như một đường dẫn tệp chuỗi hoặc một InputStream được xây dựng từ URL có dạng file://. MyBatis bao gồm một lớp công cụ có tên là Resources, nó chứa một số phương thức tiện ích, giúp việc tải tệp tài nguyên từ classpath hoặc vị trí khác trở nên dễ dàng hơn.

```java
String resource = "org/mybatis/example/mybatis-config.xml";
InputStream inputStream = Resources.getResourceAsStream(resource);
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
```

Tệp cấu hình XML chứa các thiết lập cốt lõi của hệ thống MyBatis, bao gồm nguồn dữ liệu (DataSource) để lấy thể hiện kết nối cơ sở dữ liệu và quản lý giao dịch (TransactionManager) để quyết định phạm vi và kiểm soát giao dịch. Chúng ta sẽ thảo luận chi tiết về tệp cấu hình XML sau, ở đây chỉ đưa ra một ví dụ đơn giản:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
  PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
  "https://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
  <environments default="development">
    <environment id="development">
      <transactionManager type="JDBC"/>
      <dataSource type="POOLED">
        <property name="driver" value="${driver}"/>
        <property name="url" value="${url}"/>
        <property name="username" value="${username}"/>
        <property name="password" value="${password}"/>
      </dataSource>
    </environment>
  </environments>
  <mappers>
    <mapper resource="org/mybatis/example/BlogMapper.xml"/>
  </mappers>
</configuration>
```

Tất nhiên, còn rất nhiều tùy chọn có thể cấu hình trong tệp XML, ví dụ trên chỉ liệt kê một phần quan trọng nhất. Lưu ý phần khai báo ở đầu tệp XML, nó được sử dụng để xác minh độ chính xác của tài liệu XML. Phần nội dung của phần tử environment chứa cấu hình quản lý giao dịch và kết nối. Phần tử mappers chứa một tập hợp các bản đồ, các tệp ánh xạ XML của các bản đồ này chứa mã SQL và thông tin định nghĩa ánh xạ.

### Xây dựng SqlSessionFactory không sử dụng XML

Nếu bạn muốn tạo cấu hình trực tiếp từ mã Java thay vì từ tệp XML, hoặc muốn tạo trình xây dựng cấu hình của riêng bạn, MyBatis cũng cung cấp một lớp cấu hình đầy đủ, cung cấp tất cả các tùy chọn cấu hình tương đương với tệp XML.

```java
DataSource dataSource = BlogDataSourceFactory.getBlogDataSource();
TransactionFactory transactionFactory = new JdbcTransactionFactory();
Environment environment = new Environment("development", transactionFactory, dataSource);
Configuration configuration = new Configuration(environment);
configuration.addMapper(BlogMapper.class);
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(configuration);
```

Chú ý trong ví dụ này, configuration đã thêm một lớp mapper. Các lớp mapper là các lớp Java chứa các annotation ánh xạ SQL để tránh phụ thuộc vào tệp ánh xạ XML. Tuy nhiên, do một số hạn chế của annotation Java và sự phức tạp của một số ánh xạ MyBatis, để sử dụng hầu hết các ánh xạ nâng cao (ví dụ: ánh xạ kết hợp lồng nhau), bạn vẫn cần sử dụng tệp ánh xạ XML. Do đó, nếu có một tệp ánh xạ XML cùng tên, MyBatis sẽ tự động tìm và tải nó (trong ví dụ này, dựa trên classpath và tên lớp của BlogMapper.class, nó sẽ tải BlogMapper.xml). Chúng ta sẽ thảo luận chi tiết về điều này sau.

### Lấy SqlSession từ SqlSessionFactory

Giờ đây, với SqlSessionFactory, như tên gọi, chúng ta có thể lấy thể hiện của SqlSession. SqlSession cung cấp tất cả các phương thức cần thiết để thực thi lệnh SQL trong cơ sở dữ liệu. Bạn có thể thực thi trực tiếp các lệnh SQL đã ánh xạ thông qua thể hiện SqlSession. Ví dụ:

```java
try (SqlSession session = sqlSessionFactory.openSession()) {
  Blog blog = (Blog) session.selectOne("org.mybatis.example.BlogMapper.selectBlog", 101);
}
```

Đúng là, cách này hoạt động bình thường và quen thuộc với những người dùng phiên bản MyBatis cũ. Nhưng giờ đây, chúng ta có một cách tiếp cận tinh gọn hơn - sử dụng interface phù hợp với tham số và giá trị trả về của câu lệnh đã chỉ định (như BlogMapper.class), mã của bạn không chỉ rõ ràng hơn, an toàn hơn về kiểu, mà còn không cần lo lắng về các giá trị chuỗi có thể gây lỗi và ép kiểu.

Ví dụ:

```java
try (SqlSession session = sqlSessionFactory.openSession()) {
  BlogMapper mapper = session.getMapper(BlogMapper.class);
  Blog blog = mapper.selectBlog(101);
}
```

Giờ đây, chúng ta hãy xem xét những gì đoạn mã này thực sự thực hiện.

### Khám phá câu lệnh SQL đã được ánh xạ

Bây giờ bạn có thể muốn biết SqlSession và Mapper đã thực hiện những thao tác cụ thể nào, nhưng ánh xạ câu lệnh SQL là một chủ đề rất rộng và có thể chiếm phần lớn tài liệu. Tuy nhiên, để bạn có cái nhìn tổng quan, dưới đây là một số ví dụ.

Trong các ví dụ đã đề cập ở trên, một câu lệnh có thể được định nghĩa thông qua XML hoặc thông qua annotation. Chúng ta xem xét cách định nghĩa câu lệnh thông qua XML trước, thực tế tất cả các tính năng của MyBatis đều có thể được thực hiện bằng ngôn ngữ ánh xạ dựa trên XML, điều này đã giúp MyBatis trở nên phổ biến trong nhiều năm qua. Nếu bạn đã sử dụng phiên bản cũ của MyBatis, bạn nên quen thuộc với khái niệm này. Tuy nhiên, so với các phiên bản trước, phiên bản mới đã cải tiến nhiều cấu hình XML, chúng tôi sẽ đề cập đến những cải tiến này sau. Dưới đây là một ví dụ về câu lệnh ánh xạ dựa trên XML, nó nên đáp ứng được yêu cầu gọi SqlSession trong ví dụ trước.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
  PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "https://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="org.mybatis.example.BlogMapper">
  <select id="selectBlog" resultType="Blog">
    select * from Blog where id = #{id}
  </select>
</mapper>
```

Để phục vụ cho ví dụ đơn giản này, chúng ta dường như đã viết khá nhiều cấu hình, nhưng thực ra không phải. Trong một tệp ánh xạ XML, bạn có thể định nghĩa vô số câu lệnh ánh xạ, do đó, phần tiêu đề XML và khai báo loại tài liệu trở nên không đáng kể. Phần còn lại của tài liệu rất trực quan và dễ hiểu. Nó định nghĩa một câu lệnh ánh xạ có tên "selectBlog" trong không gian tên "org.mybatis.example.BlogMapper", do đó, bạn có thể gọi câu lệnh ánh xạ bằng cách sử dụng tên đầy đủ "org.mybatis.example.BlogMapper.selectBlog", giống như trong ví dụ trên:

```java
Blog blog = (Blog) session.selectOne("org.mybatis.example.BlogMapper.selectBlog", 101);
```

Bạn có thể nhận thấy, cách này giống như việc gọi phương thức của một đối tượng Java bằng tên đầy đủ. Do đó, tên này có thể được ánh xạ trực tiếp vào lớp mapper cùng tên trong không gian tên và kết hợp câu lệnh select đã ánh xạ với phương thức có tên, tham số và kiểu trả về phù hợp. Do đó, bạn có thể gọi phương thức trên interface mapper tương ứng một cách dễ dàng, giống như sau:

```java
BlogMapper mapper = session.getMapper(BlogMapper.class);
Blog blog = mapper.selectBlog(101);
```

Cách thứ hai có nhiều lợi thế, đầu tiên, nó không phụ thuộc vào giá trị chuỗi, sẽ an toàn hơn; thứ hai, nếu IDE của bạn có tính năng hoàn thành mã, thì hoàn thành mã có thể giúp bạn nhanh chóng chọn câu lệnh SQL đã ánh xạ.

**Gợi ý** **Bổ sung về không gian tên**

Trong các phiên bản cũ của MyBatis, **không gian tên (Namespaces)**không quan trọng lắm, và là tùy chọn. Nhưng giờ đây, với sự quan trọng ngày càng tăng của không gian tên, bạn phải chỉ định không gian tên.

Không gian tên có hai mục đích, một là sử dụng tên đầy đủ dài hơn để tách biệt các câu lệnh khác nhau, đồng thời cũng thực hiện việc liên kết interface mà bạn đã thấy ở trên. Ngay cả khi bạn nghĩ rằng bạn không cần liên kết interface ngay lúc này, bạn cũng nên tuân theo quy định ở đây, trong trường hợp bạn thay đổi ý kiến sau này. Nhìn chung, chỉ cần đặt không gian tên vào không gian tên gói Java thích hợp, mã của bạn sẽ trở nên gọn gàng hơn và giúp bạn sử dụng MyBatis một cách thuận tiện hơn.

**Giải quyết tên:** Để giảm khối lượng nhập liệu, MyBatis sử dụng quy tắc giải quyết tên sau đây cho tất cả các phần tử cấu hình có tên (bao gồm câu lệnh, ánh xạ kết quả, bộ nhớ cache, v.v.).

- Tên đầy đủ (ví dụ: "com.mypackage.MyMapper.selectAllThings") sẽ được sử dụng trực tiếp để tìm kiếm và sử dụng.
- Tên ngắn (ví dụ: "selectAllThings") nếu duy nhất trên toàn cầu cũng có thể được sử dụng như một tham chiếu riêng lẻ. Nếu không duy nhất, có hai hoặc nhiều tên giống nhau (ví dụ: "com.foo.selectAllThings" và "com.bar.selectAllThings"), thì khi sử dụng sẽ gây ra lỗi "Tên ngắn không duy nhất", trong trường hợp này, bạn phải sử dụng tên đầy đủ.

Đối với các lớp mapper như BlogMapper, còn có một cách khác để hoàn thành ánh xạ câu lệnh. Các câu lệnh mà chúng ánh xạ không cần phải được cấu hình bằng XML, mà có thể được cấu hình bằng annotation Java. Ví dụ, ví dụ XML trên có thể được thay thế bằng cấu hình sau:

```java
package org.mybatis.example;
public interface BlogMapper {
  @Select("SELECT * FROM blog WHERE id = #{id}")
  Blog selectBlog(int id);
}
```

Sử dụng annotation để ánh xạ các câu lệnh đơn giản sẽ làm cho mã của bạn gọn gàng hơn, nhưng đối với các câu lệnh phức tạp hơn một chút, annotation Java không chỉ không đủ mạnh, mà còn làm cho câu lệnh SQL đã phức tạp trở nên rối rắm hơn. Do đó, nếu bạn cần thực hiện một số thao tác phức tạp, bạn nên sử dụng XML để ánh xạ câu lệnh.

Việc chọn phương pháp cấu hình nào để ánh xạ, và liệu nên thống nhất hình thức định nghĩa câu lệnh ánh xạ hay không, hoàn toàn phụ thuộc vào bạn và nhóm của bạn. Nói cách khác, đừng bao giờ bám lấy một phương pháp, bạn có thể dễ dàng di chuyển và chuyển đổi giữa các phương pháp ánh xạ câu lệnh dựa trên annotation và XML.

### Phạm vi và vòng đời

Việc hiểu các phạm vi và vòng đời mà chúng ta đã thảo luận trước đây rất quan trọng, vì việc sử dụng sai có thể dẫn đến các vấn đề đồng thời nghiêm trọng.

**Gợi ý** **Vòng đời đối tượng và framework Dependency Injection**

Framework Dependency Injection có thể tạo ra các SqlSession và mapper an toàn với luồng, dựa trên giao dịch và tiêm chúng trực tiếp vào các bean của bạn, vì vậy bạn có thể bỏ qua vòng đời của chúng. Nếu bạn quan tâm đến cách sử dụng MyBatis thông qua framework Dependency Injection, bạn có thể nghiên cứu các dự án con MyBatis-Spring hoặc MyBatis-Guice.

#### SqlSessionFactoryBuilder

Lớp này có thể được khởi tạo, sử dụng và vứt bỏ, sau khi tạo SqlSessionFactory, bạn không cần nó nữa. Do đó, phạm vi tốt nhất cho một phiên bản SqlSessionFactoryBuilder là phạm vi phương thức (cục bộ). Bạn có thể tái sử dụng SqlSessionFactoryBuilder để tạo nhiều phiên bản SqlSessionFactory, nhưng tốt nhất là không giữ nó mãi mãi để đảm bảo tất cả các tài nguyên phân tích XML có thể được giải phóng cho những việc quan trọng hơn.

#### SqlSessionFactory

Một khi đã tạo SqlSessionFactory, nó nên tồn tại trong suốt thời gian chạy của ứng dụng, không có lý do gì để vứt bỏ nó hoặc tạo một phiên bản mới. Thực hành tốt nhất khi sử dụng SqlSessionFactory là không tạo nhiều lần trong suốt thời gian chạy của ứng dụng, việc tạo lại SqlSessionFactory nhiều lần được coi là một "thói quen xấu" của mã. Do đó, phạm vi tốt nhất cho SqlSessionFactory là phạm vi ứng dụng. Có nhiều cách để làm điều này, cách đơn giản nhất là sử dụng mẫu Singleton hoặc Singleton tĩnh.

#### SqlSession

Mỗi luồng nên có một phiên bản riêng của SqlSession. Phiên bản SqlSession không an toàn đối với luồng, vì vậy không thể chia sẻ nó và phạm vi tốt nhất cho nó là phạm vi yêu cầu hoặc phạm vi phương thức. Tuyệt đối không được đặt tham chiếu của phiên bản SqlSession vào một trường tĩnh của một lớp, thậm chí không được đặt tham chiếu của phiên bản SqlSession vào bất kỳ phạm vi quản lý nào như HttpSession trong framework Servlet. Nếu bạn đang sử dụng một framework web, hãy xem xét việc đặt SqlSession trong một phạm vi tương tự với yêu cầu HTTP. Nói cách khác, mỗi khi nhận được yêu cầu HTTP, bạn có thể mở một phiên SqlSession, sau đó đóng nó sau khi trả về phản hồi. Việc đóng phiên này rất quan trọng, để đảm bảo rằng mỗi lần đóng phiên đều được thực hiện, bạn nên đặt đóng phiên này trong khối finally. Ví dụ dưới đây là một mẫu chuẩn để đảm bảo việc đóng SqlSession:

```java
try (SqlSession session = sqlSessionFactory.openSession()) {
  // Mã logic ứng dụng của bạn
}
```

Tuân thủ mẫu sử dụng này trong tất cả các mã của bạn sẽ đảm bảo tất cả các tài nguyên cơ sở dữ liệu được đóng đúng cách.

#### Thể hiện của Mapper

Mapper là một interface chứa các câu lệnh ánh xạ. Thể hiện của Mapper được lấy từ SqlSession. Mặc dù từ mặt kỹ thuật, phạm vi tối đa của mỗi thể hiện Mapper tương đương với SqlSession mà nó được yêu cầu, nhưng phạm vi tốt nhất cho thể hiện Mapper là phạm vi phương thức. Nghĩa là, thể hiện Mapper nên được lấy trong phương thức gọi chúng và có thể bị vứt bỏ sau khi sử dụng xong. Thể hiện Mapper không cần phải được đóng một cách rõ ràng. Mặc dù giữ thể hiện Mapper trong phạm vi toàn bộ yêu cầu không gây vấn đề gì, nhưng bạn sẽ nhanh chóng nhận ra rằng quản lý quá nhiều tài nguyên giống như SqlSession trên phạm vi này sẽ làm bạn bận rộn. Do đó, tốt nhất là đặt Mapper trong phạm vi phương thức. Như ví dụ dưới đây:

```java
try (SqlSession session = sqlSessionFactory.openSession()) {
  BlogMapper mapper = session.getMapper(BlogMapper.class);
  // Mã logic ứng dụng của bạn
}
```

## Công cụ mở rộng MyBatis

### MyBatis Plus

[MyBatis-Plus](https://github.com/baomidou/mybatis-plus) (gọi tắt là MP) là một công cụ mở rộng cho [MyBatis](https://www.mybatis.org/mybatis-3/), nó chỉ tạo ra các cải tiến mà không thay đổi cấu trúc gốc của MyBatis, nhằm đơn giản hóa quá trình phát triển và tăng hiệu suất.

### Mapper

[Mapper](https://github.com/abel533/Mapper) là một plugin mở rộng CRUD cho MyBatis.

Nguyên tắc cơ bản của Mapper là ánh xạ các lớp POJO thành các bảng và cột trong cơ sở dữ liệu, do đó, lớp POJO cần được cấu hình thông qua các annotation để xác định các thông tin cơ bản. Sau khi cấu hình xong, bạn chỉ cần tạo một interface Mapper kế thừa từ interface cơ bản và bạn có thể bắt đầu sử dụng.

### PageHelper

[PageHelper](https://github.com/pagehelper/Mybatis-PageHelper) là một plugin phân trang chung cho MyBatis.

## Tài liệu tham khảo

- **Chính thức**
    - [Mybatis Github](https://github.com/mybatis/mybatis-3)
    - [Trang chủ Mybatis](http://www.mybatis.org/mybatis-3/)
    - [MyBatis Generator chính thức (mybatis-generator)](https://github.com/mybatis/generator)
    - [MyBatis Tích hợp chính thức với Spring (mybatis-spring)](https://github.com/mybatis/spring)
    - [Mybatis Tích hợp chính thức với Spring Boot (mybatis-spring-boot)](https://github.com/mybatis/spring-boot-starter)
- **Plugin mở rộng**
    - [MyBatis-Plus](https://github.com/baomidou/mybatis-plus) - Plugin mở rộng CRUD, trình tạo mã, trình phân trang và nhiều chức năng khác
    - [Mapper](https://github.com/abel533/Mapper) - Plugin mở rộng CRUD cho Mybatis
    - [PageHelper](https://github.com/pagehelper/Mybatis-PageHelper) - Plugin phân trang chung cho Mybatis
