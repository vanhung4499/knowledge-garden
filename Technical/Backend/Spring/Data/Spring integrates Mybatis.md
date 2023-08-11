---
title: Spring and Mybatis
tags: [spring, java, db, backend]
categories: [spring, java, db, backend]
date created: 2023-08-11
date modified: 2023-08-11
---

# Tích hợp MyBatis với Spring

[MyBatis](http://www.mybatis.org/mybatis-3/) là một framework lớp giữa (ORM) cho phép chúng ta tùy chỉnh câu lệnh SQL, stored procedure và ánh xạ cao cấp. MyBatis giúp tránh việc viết mã JDBC và cấu hình tham số và kết quả truy vấn một cách thủ công. MyBatis cho phép chúng ta sử dụng XML đơn giản hoặc chú thích (annotation) để cấu hình và ánh xạ các kiểu dữ liệu nguyên thủy, giao diện và các đối tượng POJO (Plain Old Java Objects) trong Java thành các bản ghi trong cơ sở dữ liệu.

## Bắt đầu nhanh

Để sử dụng MyBatis, bạn chỉ cần đặt tệp [mybatis-x.x.x.jar](https://github.com/mybatis/mybatis-3/releases) vào classpath.

Nếu bạn sử dụng Maven để xây dựng dự án, bạn cần thêm đoạn mã phụ thuộc sau vào tệp pom.xml:

```xml
<dependency>
  <groupId>org.mybatis</groupId>
  <artifactId>mybatis</artifactId>
  <version>x.x.x</version>
</dependency>
```

### Xây dựng SqlSessionFactory từ XML

Mỗi ứng dụng dựa trên MyBatis đều có một phiên bản SqlSessionFactory làm trung tâm. Chúng ta có thể tạo một phiên bản SqlSessionFactory thông qua SqlSessionFactoryBuilder. SqlSessionFactoryBuilder có thể xây dựng một phiên bản SqlSessionFactory từ tệp cấu hình XML hoặc một phiên bản Configuration được cấu hình trước.

Việc xây dựng phiên bản SqlSessionFactory từ tệp XML rất đơn giản, chúng ta nên sử dụng tệp cấu hình trong classpath. Tuy nhiên, bạn cũng có thể sử dụng bất kỳ luồng đầu vào nào, ví dụ như chuỗi đường dẫn tệp hoặc URL file://. MyBatis bao gồm một lớp tiện ích có tên là Resources, chứa một số phương thức hữu ích để dễ dàng tải tệp cấu hình từ classpath hoặc vị trí khác.

```java
String resource = "org/mybatis/example/mybatis-config.xml";
InputStream inputStream = Resources.getResourceAsStream(resource);
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
```

Tệp cấu hình XML chứa các cài đặt cốt lõi của hệ thống MyBatis, bao gồm nguồn dữ liệu (DataSource) để lấy kết nối cơ sở dữ liệu và quản lý giao dịch (TransactionManager) để quyết định phạm vi và cách điều khiển giao dịch. Chúng ta sẽ tìm hiểu chi tiết về nội dung tệp cấu hình XML sau, ở đây chỉ cung cấp một ví dụ đơn giản:

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

Tất nhiên, còn rất nhiều tùy chọn có thể được cấu hình trong tệp XML, ví dụ trên chỉ liệt kê các phần quan trọng nhất. Lưu ý khai báo đầu tệp XML, nó được sử dụng để xác thực đúng đắn của tài liệu XML. Phần thân của phần tử environment chứa cấu hình quản lý giao dịch và bể kết nối. Phần tử mappers chứa một tập hợp các mapper, các tệp ánh xạ XML của chúng chứa mã SQL và định nghĩa ánh xạ.

### Xây dựng SqlSessionFactory không sử dụng XML

Nếu bạn muốn tạo cấu hình trực tiếp từ mã Java thay vì từ tệp XML, hoặc muốn tạo trình xây dựng cấu hình riêng của mình, MyBatis cung cấp một lớp cấu hình đầy đủ, cung cấp tất cả các tùy chọn cấu hình tương đương với tệp XML.

```java
DataSource dataSource = BlogDataSourceFactory.getBlogDataSource();
TransactionFactory transactionFactory = new JdbcTransactionFactory();
Environment environment = new Environment("development", transactionFactory, dataSource);
Configuration configuration = new Configuration(environment);
configuration.addMapper(BlogMapper.class);
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(configuration);
```

Lưu ý rằng trong ví dụ này, configuration được thêm một lớp mapper. Lớp mapper là một lớp Java chứa các chú thích ánh xạ SQL để tránh phụ thuộc vào tệp ánh xạ XML. Tuy nhiên, do một số hạn chế của chú thích Java và sự phức tạp của một số ánh xạ MyBatis, vẫn cần sử dụng tệp ánh xạ XML để ánh xạ các ánh xạ nâng cao (ví dụ: ánh xạ liên kết lồng nhau). Vì vậy, nếu tồn tại một tệp ánh xạ XML cùng tên, MyBatis sẽ tự động tìm và tải nó (trong ví dụ này, dựa trên classpath và tên lớp BlogMapper.class, sẽ tải BlogMapper.xml). Chi tiết cụ thể sẽ được thảo luận sau.

### Lấy SqlSession từ SqlSessionFactory

Bây giờ đã có SqlSessionFactory, như tên gọi, chúng ta có thể lấy một phiên SqlSession từ đó. SqlSession cung cấp tất cả các phương thức cần thiết để thực thi các câu lệnh SQL trên cơ sở dữ liệu. Bạn có thể sử dụng phiên SqlSession để trực tiếp thực thi các câu lệnh SQL đã được ánh xạ. Ví dụ:

```java
try (SqlSession session = sqlSessionFactory.openSession()) {
  Blog blog = (Blog) session.selectOne("org.mybatis.example.BlogMapper.selectBlog", 101);
}
```

Đúng, cách này hoạt động bình thường và quen thuộc đối với người dùng sử dụng phiên bản cũ của MyBatis. Nhưng bây giờ có một cách tiếp cận đơn giản hơn - sử dụng giao diện khớp với tham số và giá trị trả về của câu lệnh (ví dụ: BlogMapper.class), mã của bạn không chỉ rõ ràng hơn, an toàn hơn về kiểu dữ liệu, mà còn không phải lo lắng về các giá trị chuỗi có thể gây lỗi và chuyển đổi kiểu mạnh.

Ví dụ:

```java
try (SqlSession session = sqlSessionFactory.openSession()) {
  BlogMapper mapper = session.getMapper(BlogMapper.class);
  Blog blog = mapper.selectBlog(101);
}
```

Bây giờ chúng ta hãy tìm hiểu xem đoạn mã này làm gì.

### Khám phá câu lệnh SQL đã được ánh xạ

Bây giờ bạn có thể muốn biết chính xác SqlSession và Mapper thực hiện những thao tác gì, nhưng ánh xạ câu lệnh SQL là một chủ đề rất rộng, có thể chiếm phần lớn tài liệu. Tuy nhiên, để bạn có thể hiểu một cách tổng quan, đây là một số ví dụ.

Trong ví dụ được đề cập ở trên, một câu lệnh có thể được định nghĩa thông qua XML hoặc thông qua chú thích (annotation). Hãy xem cách định nghĩa câu lệnh bằng XML trước, thực tế thì tất cả các tính năng mà MyBatis cung cấp đều có thể được thực hiện bằng ngôn ngữ ánh xạ dựa trên XML, điều này đã giúp MyBatis trở nên phổ biến trong vài năm qua. Nếu bạn đã sử dụng các phiên bản cũ của MyBatis, bạn có thể quen với khái niệm này. Tuy nhiên, so với các phiên bản trước đây, phiên bản mới đã cải tiến nhiều về cấu hình XML, chúng ta sẽ đề cập đến những cải tiến này sau. Dưới đây là một ví dụ về cách định nghĩa câu lệnh ánh xạ bằng ngôn ngữ ánh xạ dựa trên XML, nó có thể được sử dụng trong cuộc gọi SqlSession như trong ví dụ trước:

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

Đối với ví dụ đơn giản này, chúng ta có vẻ đã viết khá nhiều cấu hình, nhưng thực tế không nhiều. Trong một tệp ánh xạ XML, bạn có thể định nghĩa vô số câu lệnh ánh xạ, điều này làm cho phần tiêu đề XML và phần khai báo kiểu tài liệu trở nên không đáng kể. Phần còn lại của tài liệu rõ ràng và dễ hiểu. Nó định nghĩa một câu lệnh ánh xạ có tên "selectBlog" trong không gian tên "org.mybatis.example.BlogMapper", điều này cho phép bạn gọi câu lệnh ánh xạ bằng tên đầy đủ "org.mybatis.example.BlogMapper.selectBlog", giống như trong ví dụ trước:

```java
Blog blog = (Blog) session.selectOne("org.mybatis.example.BlogMapper.selectBlog", 101);
```

Bạn có thể nhận thấy rằng cách tiếp cận này tương tự như việc gọi phương thức của đối tượng Java bằng tên đầy đủ. Như vậy, tên này có thể được ánh xạ trực tiếp vào một lớp ánh xạ cùng tên trong không gian tên và khớp với phương thức có tên, tham số và kiểu trả về tương ứng. Do đó, bạn có thể dễ dàng gọi phương thức trên giao diện ánh xạ như sau:

```java
BlogMapper mapper = session.getMapper(BlogMapper.class);
Blog blog = mapper.selectBlog(101);
```

Phương pháp thứ hai có nhiều ưu điểm, đầu tiên là nó không phụ thuộc vào chuỗi ký tự, nên an toàn hơn một chút; thứ hai, nếu IDE của bạn có tính năng tự động hoàn thành mã, bạn có thể nhanh chóng chọn câu lệnh SQL đã được ánh xạ.

**Gợi ý** **Một số điều về không gian tên**

Trong các phiên bản MyBatis trước đây, không gian tên (namespace) không quan trọng và là tùy chọn. Tuy nhiên, bây giờ, với vai trò ngày càng quan trọng của không gian tên, bạn phải chỉ định không gian tên.

Có hai mục đích của không gian tên, một là sử dụng tên đầy đủ dài hơn để phân tách các câu lệnh khác nhau và cũng để thực hiện việc ràng buộc giao diện như bạn đã thấy ở trên. Ngay cả khi bạn nghĩ rằng bạn không cần ràng buộc giao diện trong lúc này, bạn cũng nên tuân thủ quy định này để tránh việc thay đổi sau này. Trong tương lai, việc đặt không gian tên trong không gian tên gói Java phù hợp sẽ làm mã của bạn trở nên sạch sẽ hơn và giúp bạn sử dụng MyBatis dễ dàng hơn.

**Giải thích về tên:** Để giảm lượng nhập liệu, MyBatis sử dụng quy tắc giải thích tên cho tất cả các yếu tố cấu hình có tên (bao gồm câu lệnh, ánh xạ kết quả, bộ nhớ cache, v.v.).

- Tên đầy đủ (ví dụ: "com.mypackage.MyMapper.selectAllThings") sẽ được sử dụng trực tiếp để tìm kiếm và sử dụng.
- Tên ngắn (ví dụ: "selectAllThings") có thể được sử dụng làm một tham chiếu độc lập nếu nó là duy nhất trong toàn bộ hệ thống. Nếu không duy nhất, có hai hoặc nhiều hơn hai tên giống nhau (ví dụ: "com.foo.selectAllThings" và "com.bar.selectAllThings"), việc sử dụng sẽ gây ra lỗi "Tên ngắn không duy nhất" và bạn sẽ phải sử dụng tên đầy đủ.

Đối với các lớp ánh xạ như BlogMapper, cũng có một cách khác để ánh xạ câu lệnh. Các câu lệnh ánh xạ của chúng có thể không được cấu hình bằng XML, mà thay vào đó có thể được cấu hình bằng chú thích Java. Ví dụ, ví dụ XML trên có thể được thay thế bằng cấu hình sau:

```java
package org.mybatis.example;
public interface BlogMapper {
  @Select("SELECT * FROM blog WHERE id = #{id}")
  Blog selectBlog(int id);
}
```

Sử dụng chú thích để ánh xạ câu lệnh đơn giản làm mã trở nên ngắn gọn hơn, nhưng đối với các câu lệnh phức tạp hơn, chú thích Java không chỉ không đủ mạnh mà còn làm cho câu lệnh SQL phức tạp trở nên rối rắm hơn. Do đó, nếu bạn cần thực hiện một số thao tác phức tạp, tốt nhất là sử dụng XML để ánh xạ câu lệnh.

Việc chọn cách cấu hình ánh xạ và xem xét việc thống nhất cách định nghĩa câu lệnh ánh xạ hoàn toàn phụ thuộc vào bạn và nhóm của bạn. Nói cách khác, đừng bị ràng buộc bởi một cách cấu hình, bạn có thể dễ dàng chuyển đổi giữa cách ánh xạ dựa trên chú thích và XML.

### Phạm vi và vòng đời của các đối tượng

Hiểu rõ phạm vi và vòng đời của các đối tượng đã được thảo luận trước đó là rất quan trọng, vì việc sử dụng sai có thể dẫn đến các vấn đề đồng thời nghiêm trọng.

**Gợi ý** **Vòng đời đối tượng và framework Dependency Injection**

Framework Dependency Injection có thể tạo ra các đối tượng SqlSession và Mapper an toàn đối với luồng và dựa trên giao dịch và tiêm chúng trực tiếp vào bean của bạn, do đó, bạn có thể bỏ qua vòng đời của chúng. Nếu bạn quan tâm đến cách sử dụng MyBatis thông qua framework Dependency Injection, bạn có thể nghiên cứu các dự án con MyBatis-Spring hoặc MyBatis-Guice.

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

Mapper là một giao diện chứa các câu lệnh ánh xạ. Thể hiện của Mapper được lấy từ SqlSession. Mặc dù từ mặt kỹ thuật, phạm vi tối đa của mỗi thể hiện Mapper tương đương với SqlSession mà nó được yêu cầu, nhưng phạm vi tốt nhất cho thể hiện Mapper là phạm vi phương thức. Nghĩa là, thể hiện Mapper nên được lấy trong phương thức gọi chúng và có thể bị vứt bỏ sau khi sử dụng xong. Thể hiện Mapper không cần phải được đóng một cách rõ ràng. Mặc dù giữ thể hiện Mapper trong phạm vi toàn bộ yêu cầu không gây vấn đề gì, nhưng bạn sẽ nhanh chóng nhận ra rằng quản lý quá nhiều tài nguyên giống như SqlSession trên phạm vi này sẽ làm bạn bận rộn. Do đó, tốt nhất là đặt Mapper trong phạm vi phương thức. Như ví dụ dưới đây:

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

Nguyên tắc cơ bản của Mapper là ánh xạ các lớp POJO thành các bảng và cột trong cơ sở dữ liệu, do đó, lớp POJO cần được cấu hình thông qua các chú thích để xác định các thông tin cơ bản. Sau khi cấu hình xong, bạn chỉ cần tạo một interface Mapper kế thừa từ interface cơ bản và bạn có thể bắt đầu sử dụng.

### PageHelper

[PageHelper](https://github.com/pagehelper/Mybatis-PageHelper) là một plugin phân trang chung cho MyBatis.
