---
title: Spring Data Source
tags: [spring, java, db, backend]
categories: [spring, java, db, backend]
date created: 2023-07-26
date modified: 2023-07-26
---
# Data Source trong Spring

> Bài viết này dựa trên phiên bản Spring Boot 2.7.3.

## Cấu hình cơ bản Data Source trong Spring Boot

Spring Boot cung cấp một loạt các cấu hình `spring.datasource.*` để điều khiển cấu hình `DataSource`. Người dùng có thể chỉ định cấu hình Data Source trong tệp `application.properties` hoặc `application.yml`. Các cấu hình này được duy trì trong [`DataSourceProperties`](https://github.com/spring-projects/spring-boot/tree/v2.7.4/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/jdbc/DataSourceProperties.java).

Dưới đây là một ví dụ cấu hình Data Source MySQL cơ bản (tất cả các trường đều là bắt buộc):

```properties
# Địa chỉ truy cập cơ sở dữ liệu
spring.datasource.url = jdbc:mysql://localhost:3306/spring_tutorial?serverTimezone=UTC&useUnicode=true&characterEncoding=utf8
# Lớp trình điều khiển cơ sở dữ liệu, đảm bảo lớp trình điều khiển có thể tải được
spring.datasource.driver-class-name = com.mysql.cj.jdbc.Driver
# Tên người dùng cơ sở dữ liệu
spring.datasource.username = root
# Mật khẩu người dùng cơ sở dữ liệu
spring.datasource.password = root
```

Hãy thay thế `url`, `username`, `password` bằng thông tin thực tế.

## Kết nối Data Source nhúng trong Spring Boot

Sử dụng cơ sở dữ liệu nhớ trong bộ nhớ để phát triển ứng dụng thường rất tiện lợi. Rõ ràng, cơ sở dữ liệu nhớ không cung cấp lưu trữ vĩnh viễn. Người dùng cần điền dữ liệu vào cơ sở dữ liệu khi ứng dụng bắt đầu và sẵn sàng loại bỏ dữ liệu khi ứng dụng kết thúc.

Spring Boot có thể tự động cấu hình cơ sở dữ liệu nhúng [H2](https://www.h2database.com/), [HSQL](https://hsqldb.org/) và [Derby](https://db.apache.org/derby/). Người dùng không cần cung cấp bất kỳ URL kết nối nào, chỉ cần bao gồm các phụ thuộc xây dựng cho cơ sở dữ liệu nhúng mà bạn muốn sử dụng. Nếu có nhiều cơ sở dữ liệu nhúng trên lớp đường dẫn, bạn cần thiết lập thuộc tính cấu hình `spring.datasource.embedded-database-connection` để kiểm soát cơ sở dữ liệu nhúng nào được sử dụng. Đặt thuộc tính này thành none sẽ vô hiệu hóa cấu hình tự động cơ sở dữ liệu nhúng.

> Lưu ý: Nếu sử dụng tính năng này trong kiểm thử, dù có bao nhiêu ngữ cảnh ứng dụng, toàn bộ bộ kiểm thử sẽ sử dụng cùng một cơ sở dữ liệu. Nếu bạn muốn đảm bảo mỗi ngữ cảnh có một cơ sở dữ liệu nhúng riêng, bạn nên đặt `spring.datasource.generate-unique-name` thành true.

Dưới đây là một ví dụ về cách kết nối cơ sở dữ liệu nhúng H2.

(1) Thêm các phụ thuộc cần thiết vào `pom.xml`:

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jdbc</artifactId>
</dependency>
<dependency>
  <groupId>com.h2database</groupId>
  <artifactId>h2</artifactId>
</dependency>
```

(2) Cấu hình Data Source:

```properties
spring.datasource.jdbc-url = jdbc:h2:mem:test
spring.datasource.driver-class-name = org.h2.Driver
spring.datasource.username = sa
spring.datasource.password =
```

## Kết nối cơ sở dữ liệu được gom nhóm trong Spring Boot

Trong môi trường sản xuất, vì lý do hiệu suất, thường sử dụng cơ sở dữ liệu được gom nhóm để kết nối nguồn dữ liệu.

Ngoài các cấu hình chung của nguồn dữ liệu trong [`DataSourceProperties`](https://github.com/spring-projects/spring-boot/tree/v2.7.4/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/jdbc/DataSourceProperties.java), Spring Boot cũng hỗ trợ cấu hình các thuộc tính cụ thể của cơ sở dữ liệu bằng cách sử dụng tiền tố tương ứng như `spring.datasource.hikari.*`, `spring.datasource.tomcat.*`, `spring.datasource.dbcp2.*` và `spring.datasource.oracleucp.*`.

Dưới đây là một ví dụ cấu hình cho cơ sở dữ liệu gom nhóm Hikari:

```properties
# Tên của gom nhóm kết nối
spring.datasource.hikari.pool-name = SpringTutorialHikariPool
# Số kết nối tối đa, nếu nhỏ hơn hoặc bằng 0 sẽ được thiết lập lại thành giá trị mặc định 10; nếu lớn hơn 0 và nhỏ hơn 1 sẽ được thiết lập lại thành giá trị của minimum-idle
spring.datasource.hikari.maximum-pool-size = 10
# Số kết nối tối thiểu, giá trị mặc định là 10, nếu nhỏ hơn 0 hoặc lớn hơn maximum-pool-size sẽ được thiết lập lại thành maximum-pool-size
spring.datasource.hikari.minimum-idle = 10
# Thời gian kết nối vượt quá thời gian chờ (theo đơn vị mili giây), nếu nhỏ hơn 250 mili giây sẽ được thiết lập lại thành giá trị mặc định 30 giây
spring.datasource.hikari.connection-timeout = 60000
# Thời gian kết nối không hoạt động tối đa, giá trị mặc định là 600000 (10 phút), nếu lớn hơn hoặc bằng max-lifetime và max-lifetime>0 sẽ được thiết lập lại thành 0; nếu không bằng 0 và nhỏ hơn 10 giây sẽ được thiết lập lại thành 10 giây
# Chỉ khi số kết nối không hoạt động lớn hơn số kết nối tối đa và thời gian không hoạt động vượt quá giá trị này, kết nối mới sẽ được giải phóng
spring.datasource.hikari.idle-timeout = 600000
# Thời gian sống tối đa của kết nối, nếu không bằng 0 và nhỏ hơn 30 giây sẽ được thiết lập lại thành giá trị mặc định 30 phút. Giá trị này nên nhỏ hơn thời gian chờ tối đa được cài đặt trong cơ sở dữ liệu
spring.datasource.hikari.max-lifetime = 540000
```

Spring Boot sẽ kiểm tra xem gom nhóm kết nối có khả dụng hay không theo thứ tự sau, nếu khả dụng, nó sẽ chọn `DataSource` được gom nhóm tương ứng:

HikariCP -> Tomcat pooling `DataSource` -> DBCP2 -> Oracle UCP

Người dùng cũng có thể chỉ định loại nguồn dữ liệu bằng cách sử dụng `spring.datasource.type`.

Ngoài ra, bạn cũng có thể sử dụng `DataSourceBuilder` để cấu hình gom nhóm kết nối khác. Nếu bạn tạo bean `DataSource` tùy chỉnh, Spring Boot sẽ không tự động cấu hình. `DataSourceBuilder` hỗ trợ các gom nhóm kết nối sau:

- HikariCP
- Tomcat pooling `Datasource`
- Commons DBCP2
- Oracle UCP & `OracleDataSource`
- Spring Framework’s `SimpleDriverDataSource`
- H2 `JdbcDataSource`
- PostgreSQL `PGSimpleDataSource`
- C3P0

### Nhúng các phụ thuộc Spring Boot

Bạn có thể sử dụng trình khởi tạo chính thức của Spring Boot ([Spring Initializr](https://start.spring.io/)) để chọn các thành phần bạn cần và tạo một dự án Spring Boot. Hoặc, bạn có thể nhúng các phụ thuộc cần thiết trực tiếp vào file pom.xml:

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jdbc</artifactId>
</dependency>
<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>
</dependency>
```

### Kiểm tra kết nối đến nguồn dữ liệu đơn

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;

import java.sql.Connection;
import javax.sql.DataSource;

@Slf4j
@SpringBootApplication
public class SpringBootDataJdbcApplication implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public SpringBootDataJdbcApplication(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public static void main(String[] args) {
        SpringApplication.run(SpringBootDataJdbcApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        DataSource dataSource = jdbcTemplate.getDataSource();

        Connection connection;
        if (dataSource != null) {
            connection = dataSource.getConnection();
        } else {
            log.error("Không thể kết nối đến nguồn dữ liệu!");
            return;
        }

        if (connection != null) {
            log.info("Url nguồn dữ liệu: {}", connection.getMetaData().getURL());
        } else {
            log.error("Không thể kết nối đến nguồn dữ liệu!");
        }
    }

}
```

Sau khi chạy phương thức `main`, console sẽ hiển thị nội dung sau, cho thấy kết nối đến nguồn dữ liệu thành công:

```
20:50:18.449 [main] [INFO ] i.g.d.s.d.SpringBootDataJdbcApplication.run - Url nguồn dữ liệu: jdbc:mysql://localhost:3306/spring_tutorial?serverTimezone=UTC&useUnicode=true&characterEncoding=utf8
```

## Kết nối đến nhiều nguồn dữ liệu trong Spring Boot

Các phụ thuộc cần thiết để kết nối đến nhiều nguồn dữ liệu trong Spring Boot không khác biệt, sự khác biệt chính nằm trong cấu hình nguồn dữ liệu. Lớp cấu hình nguồn dữ liệu mặc định của Spring Boot là `org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration`. Người dùng chỉ cần chỉ định một số cấu hình spring.datasource cần thiết, lớp `DataSourceAutoConfiguration` sẽ tự động hoàn thành phần còn lại của việc khởi tạo nguồn dữ liệu.

### Cấu hình nhiều nguồn dữ liệu

Trong ví dụ dưới đây, tạo một lớp cấu hình nguồn dữ liệu tùy chỉnh, thông qua việc đọc các cấu hình khác nhau của spring.datasource.xxx để khởi tạo các nguồn dữ liệu khác nhau. Đối với JDBC, quan trọng nhất là khởi tạo `DataSource` và `JdbcTemplate`.

```java
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DataSourceConfig {

    @Primary
    @Bean("mysqlDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.mysql")
    public DataSource mysqlDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Primary
    @Bean("mysqlJdbcTemplate")
    public JdbcTemplate mysqlJdbcTemplate(@Qualifier("mysqlDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    @Bean("h2DataSource")
    @ConfigurationProperties(prefix = "spring.datasource.h2")
    public DataSource h2DataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "h2JdbcTemplate")
    public JdbcTemplate h2JdbcTemplate(@Qualifier("h2DataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

}
```

Cấu hình trong file `application.properties` hoặc `application.yml` cũng phải được cấu hình với tiền tố được chỉ định bởi `@ConfigurationProperties`:

```properties
# Nguồn dữ liệu 1: Mysql
spring.datasource.mysql.jdbc-url = jdbc:mysql://localhost:3306/spring_tutorial?serverTimezone=UTC&useUnicode=true&characterEncoding=utf8&useSSL=false
spring.datasource.mysql.driver-class-name = com.mysql.cj.jdbc.Driver
spring.datasource.mysql.username = root
spring.datasource.mysql.password = root
# Nguồn dữ liệu 2: H2
spring.datasource.h2.jdbc-url = jdbc:h2:mem:test
spring.datasource.h2.driver-class-name = org.h2.Driver
spring.datasource.h2.username = sa
spring.datasource.h2.password =
```

### Kiểm tra kết nối đến nhiều nguồn dữ liệu

```java

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;

import java.sql.Connection;
import java.sql.SQLException;
import javax.sql.DataSource;

@SpringBootApplication
public class SpringBootDataJdbcMultiDataSourceApplication implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(SpringBootDataJdbcMultiDataSourceApplication.class);

    private final UserDao mysqlUserDao;

    private final UserDao h2UserDao;

    public SpringBootDataJdbcMultiDataSourceApplication(@Qualifier("mysqlUserDao") UserDao mysqlUserDao,
        @Qualifier("h2UserDao") UserDao h2UserDao) {
        this.mysqlUserDao = mysqlUserDao;
        this.h2UserDao = h2UserDao;
    }

    public static void main(String[] args) {
        SpringApplication.run(SpringBootDataJdbcMultiDataSourceApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {

        if (mysqlUserDao != null && mysqlUserDao.getJdbcTemplate() != null) {
            printDataSourceInfo(mysqlUserDao.getJdbcTemplate());
            log.info("Kết nối đến nguồn dữ liệu mysql thành công.");
        } else {
            log.error("Kết nối đến nguồn dữ liệu mysql thất bại!");
            return;
        }

        if (h2UserDao != null) {
            printDataSourceInfo(h2UserDao.getJdbcTemplate());
            log.info("Kết nối đến nguồn dữ liệu h2 thành công.");
        } else {
            log.error("Kết nối đến nguồn dữ liệu h2 thất bại!");
            return;
        }

        // Thực thi câu lệnh SQL JDBC trên nguồn dữ liệu chính
        mysqlUserDao.recreateTable();

        // Thực thi câu lệnh SQL JDBC trên nguồn dữ liệu phụ
        h2UserDao.recreateTable();
    }

    private void printDataSourceInfo(JdbcTemplate jdbcTemplate) throws SQLException {

        DataSource dataSource = jdbcTemplate.getDataSource();

        Connection connection;
        if (dataSource != null) {
            connection = dataSource.getConnection();
        } else {
            log.error("Lấy nguồn dữ liệu thất bại!");
            return;
        }

        if (connection != null) {
            log.info("Url nguồn dữ liệu: {}", connection.getMetaData().getURL());
        } else {
            log.error("Kết nối đến nguồn dữ liệu thất bại!");
        }
    }

}
```

Sau khi chạy phương thức `main`, console sẽ hiển thị nội dung sau, cho thấy kết nối đến nhiều nguồn dữ liệu thành công:

```
21:16:44.654 [main] [INFO ] i.g.d.s.d.SpringBootDataJdbcMultiDataSourceApplication.printDataSourceInfo - Url nguồn dữ liệu: jdbc:mysql://localhost:3306/spring_tutorial?serverTimezone=UTC&useUnicode=true&characterEncoding=utf8&useSSL=false
21:16:44.654 [main] [INFO ] i.g.d.s.d.SpringBootDataJdbcMultiDataSourceApplication.run - Kết nối đến nguồn dữ liệu mysql thành công.

21:16:44.726 [main] [INFO ] i.g.d.s.d.SpringBootDataJdbcMultiDataSourceApplication.printDataSourceInfo - Url nguồn dữ liệu: jdbc:h2:mem:test
21:16:44.726 [main] [INFO ] i.g.d.s.d.SpringBootDataJdbcMultiDataSourceApplication.run - Kết nối đến nguồn dữ liệu h2 thành công.
```

## Data Source trong Spring

Nếu dự án của bạn là một dự án Spring truyền thống, bạn cũng có thể dễ dàng thiết lập kết nối nguồn dữ liệu, chỉ cần cấu hình thêm một số thiết lập.

### Nhúng các phụ thuộc Spring

Trong file pom.xml, thêm các phụ thuộc cần thiết:

```xml
    <dependencies>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context-support</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-tx</artifactId>
        </dependency>
    </dependencies>
</project>
```

### Cấu hình Data Source trong Spring

Cấu hình nguồn dữ liệu trong Spring có nhiều cách khác nhau, dưới đây là một số ví dụ:

#### Sử dụng JNDI nguồn dữ liệu

Nếu ứng dụng Spring được triển khai trên máy chủ WEB hỗ trợ JNDI (như WebSphere, JBoss, Tomcat, v.v.), bạn có thể sử dụng JNDI để lấy nguồn dữ liệu.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:jee="http://www.springframework.org/schema/jee"
  xsi:schemaLocation="http://www.springframework.org/schema/beans
            http://www.springframework.org/schema/beans/spring-beans-3.2.xsd
http://www.springframework.org/schema/jee
http://www.springframework.org/schema/jee/spring-jee-3.2.xsd">

  <!-- 1. Sử dụng bean để cấu hình nguồn dữ liệu JNDI -->
  <bean id="dataSource" class="org.springframework.jndi.JndiObjectFactoryBean">
    <property name="jndiName" value="java:comp/env/jdbc/orclight" />
  </bean>

  <!-- 2. Sử dụng thẻ jee để cấu hình nguồn dữ liệu JNDI, tương đương với 1, nhưng cần phải nhập namespace -->
  <jee:jndi-lookup id="dataSource" jndi-name="java:comp/env/jdbc/orclight" />
</beans>
```

#### Sử dụng cơ sở dữ liệu có gom cụm

Spring không cung cấp cơ sở dữ liệu gom nhóm mặc định, bạn cần tự chọn một cơ sở dữ liệu gom nhóm phù hợp. Dưới đây là một ví dụ sử dụng [Druid](https://github.com/alibaba/druid) làm cơ sở dữ liệu gom nhóm:

```xml
<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource"
        init-method="init" destroy-method="close">
    <property name="driverClassName" value="${jdbc.driver}"/>
    <property name="url" value="${jdbc.url}"/>
    <property name="username" value="${jdbc.username}"/>
    <property name="password" value="${jdbc.password}"/>

    <!-- Cấu hình kích thước ban đầu, tối thiểu và tối đa -->
    <property name="initialSize" value="1"/>
    <property name="minIdle" value="1"/>
    <property name="maxActive" value="10"/>

    <!-- Cấu hình thời gian chờ lấy kết nối -->
    <property name="maxWait" value="10000"/>

    <!-- Cấu hình thời gian chạy kiểm tra kết nối không hoạt động và đóng kết nối không hoạt động -->
    <property name="timeBetweenEvictionRunsMillis" value="60000"/>
    <property name="minEvictableIdleTimeMillis" value="300000"/>

    <property name="testWhileIdle" value="true"/>

    <!-- Đảm bảo kết nối lấy được là hợp lệ -->
    <property name="testOnBorrow" value="true"/>
    <property name="testOnReturn" value="false"/>

    <!-- Mở PSCache và cấu hình kích thước PSCache trên mỗi kết nối -->
    <property name="poolPreparedStatements" value="true"/>
    <property name="maxPoolPreparedStatementPerConnectionSize"
              value="20"/>

    <!-- Cấu hình tự động commit -->
    <property name="defaultAutoCommit" value="true"/>

    <!-- Câu truy vấn để kiểm tra tính hợp lệ của kết nối -->
    <property name="validationQuery" value="select 1 "/>
    <property name="filters" value="stat"/>
  </bean>
```

#### Sử dụng Data Source dựa trên JDBC Driver

```xml
<bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
  <property name="driverClassName" value="${jdbc.driver}"/>
  <property name="url" value="${jdbc.url}"/>
  <property name="username" value="${jdbc.username}"/>
  <property name="password" value="${jdbc.password}"/>
</bean>
```

## Cấu hình nguồn dữ liệu trong Spring Boot

> Tài liệu chính thức của Spring Boot về cấu hình cơ sở dữ liệu: https://docs.spring.io/spring-boot/docs/current/reference/html/data.html#data.sql

Thông qua các ví dụ trước đó, chúng ta đã biết cách Spring và Spring Boot kết nối đến nguồn dữ liệu và truy cập cơ sở dữ liệu thông qua JDBC.

Cách cấu hình nguồn dữ liệu trong Spring Boot là thông qua việc chỉ định cấu hình `spring.datasource.*` trong tệp `application.properties` hoặc `application.yml`.

(1) Cách cấu hình cơ bản là chỉ định url, tên người dùng và mật khẩu:

```properties
spring.datasource.url=jdbc:mysql://localhost/test
spring.datasource.username=dbuser
spring.datasource.password=dbpass
```

(2) Cấu hình JNDI

Nếu bạn muốn kết nối đến nguồn dữ liệu thông qua JNDI, bạn có thể sử dụng cách sau:

```properties
spring.datasource.jndi-name=java:jboss/datasources/customers
```

## Lớp DataSourceAutoConfiguration

Rõ ràng, cấu hình của Spring Boot đơn giản hơn, vậy Spring Boot đã làm những công việc gì để làm cho việc tích hợp trở nên dễ dàng hơn? Bí mật nằm trong gói jar `spring-boot-autoconfigure`, trong đó định nghĩa nhiều lớp tự động cấu hình của Spring Boot. Trong số đó, các lớp cấu hình liên quan đến truy cập cơ sở dữ liệu quan trọng bao gồm:

- `DataSourceAutoConfiguration`: Lớp cấu hình tự động cho nguồn dữ liệu
- `JdbcTemplateAutoConfiguration`: Lớp cấu hình tự động cho `JdbcTemplate`
- `DataSourceTransactionManagerAutoConfiguration`: Lớp cấu hình tự động cho quản lý giao dịch nguồn dữ liệu
- `JndiDataSourceAutoConfiguration`: Lớp cấu hình tự động cho nguồn dữ liệu JNDI
- `EmbeddedDataSourceConfiguration`: Lớp cấu hình tự động cho nguồn dữ liệu cơ sở dữ liệu nhúng
- Và nhiều hơn nữa

Các lớp cấu hình tự động này sẽ tạo ra các phiên bản của các lớp cốt lõi dựa trên các điều kiện khác nhau.

`DataSourceAutoConfiguration` là lớp cấu hình tự động cho nguồn dữ liệu, nó có trách nhiệm tạo ra một phiên bản của `DataSource`.

Mã nguồn của `DataSourceAutoConfiguration` như sau (bỏ qua một số mã):

```java
@AutoConfiguration(before = SqlInitializationAutoConfiguration.class)
@ConditionalOnClass({ DataSource.class, EmbeddedDatabaseType.class })
@ConditionalOnMissingBean(type = "io.r2dbc.spi.ConnectionFactory")
@EnableConfigurationProperties(DataSourceProperties.class)
@Import(DataSourcePoolMetadataProvidersConfiguration.class)
public class DataSourceAutoConfiguration {

	@Configuration(proxyBeanMethods = false)
	@Conditional(EmbeddedDatabaseCondition.class)
	@ConditionalOnMissingBean({ DataSource.class, XADataSource.class })
	@Import(EmbeddedDataSourceConfiguration.class)
	protected static class EmbeddedDatabaseConfiguration {
	}

	@Configuration(proxyBeanMethods = false)
	@Conditional(PooledDataSourceCondition.class)
	@ConditionalOnMissingBean({ DataSource.class, XADataSource.class })
	@Import({ DataSourceConfiguration.Hikari.class, DataSourceConfiguration.Tomcat.class,
			DataSourceConfiguration.Dbcp2.class, DataSourceConfiguration.OracleUcp.class,
			DataSourceConfiguration.Generic.class, DataSourceJmxConfiguration.class })
	protected static class PooledDataSourceConfiguration {
  }

	static class PooledDataSourceCondition extends AnyNestedCondition {
    // Bỏ qua
	}

	static class PooledDataSourceAvailableCondition extends SpringBootCondition {
    // Bỏ qua
	}

	static class EmbeddedDatabaseCondition extends SpringBootCondition {
    // Bỏ qua
	}
}
```

Giải thích mã nguồn của lớp `DataSourceAutoConfiguration`:

- `DataSourceProperties` là lớp tùy chọn cấu hình của `DataSourceAutoConfiguration`, cho phép người dùng điều khiển hành vi khởi tạo của `DataSource` thông qua việc thiết lập các tùy chọn.
- `DataSourceAutoConfiguration` sử dụng `@Import` để nhập lớp `DataSourcePoolMetadataProvidersConfiguration`.
- `DataSourceAutoConfiguration` định nghĩa hai lớp nội bộ: `EmbeddedDatabaseConfiguration` và `PooledDataSourceConfiguration`, mỗi lớp đánh dấu một điều kiện khác nhau để tạo ra phiên bản tương ứng.
  - Khi điều kiện của `EmbeddedDatabaseConfiguration` được đáp ứng, lớp `EmbeddedDataSourceConfiguration` sẽ được nhập để khởi tạo nguồn dữ liệu. Thực tế, lớp này tải ClassLoader của trình điều khiển nguồn dữ liệu nhúng để thực hiện khởi tạo.
  - Khi điều kiện của `PooledDataSourceConfiguration` được đáp ứng, các lớp cấu hình `DataSourceConfiguration.Hikari.class`, `DataSourceConfiguration.Tomcat.class`, `DataSourceConfiguration.Dbcp2.class`, `DataSourceConfiguration.OracleUcp.class`, `DataSourceConfiguration.Generic.class`, `DataSourceJmxConfiguration.class` sẽ được nhập. Mỗi lớp tương ứng với một loại cơ sở dữ liệu kết nối theo cách khác nhau. Cụ thể sử dụng loại nào trong số các loại kết nối cơ sở dữ liệu, có thể được chỉ định thông qua cấu hình `spring.datasource.type`. Trong đó, Hikari là cơ sở dữ liệu kết nối mặc định của Spring Boot, spring-boot-starter-data-jdbc đã tích hợp sẵn gói trình điều khiển Hikari. Nếu muốn thay thế bằng cơ sở dữ liệu kết nối khác, điều kiện tiên quyết là phải thủ công nhập gói trình điều khiển tương ứng.
