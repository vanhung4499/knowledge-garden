---
title: Spring JDBC
tags: [spring, java, db, backend]
categories: [spring, java, db, backend]
date created: 2023-07-26
date modified: 2023-07-28
---

# Spring JDBC

JDBC là một giao diện ứng dụng trong ngôn ngữ Java được sử dụng để quy định cách các chương trình khách hàng truy cập vào cơ sở dữ liệu, cung cấp các phương thức để thêm, xóa, sửa và truy vấn cơ sở dữ liệu.

## Ví dụ cơ bản về JDBC

Các bước làm việc cơ bản của JDBC như sau:

1. Tạo lớp thực thể (entity class).
2. Khai báo giao diện DAO cho việc đọc và ghi vào cơ sở dữ liệu. Việc định nghĩa DAO giúp tách biệt tầng dịch vụ (service layer) và tầng dữ liệu (data layer), khi sử dụng DAO, chỉ cần quan tâm đến các phương thức đọc và ghi được công khai, không cần quan tâm đến cách thức lưu trữ dưới tầng dữ liệu. Điều này giúp dễ dàng thay thế cách thức lưu trữ.
3. Tạo một lớp thực thi của giao diện DAO, sử dụng JDBC Template của Spring để thực hiện các phương thức.
4. Cuối cùng, định nghĩa một bean của lớp thực thi DAO và tiêm cấp nguồn dữ liệu vào.

Giả sử chúng ta muốn truy cập vào một bảng dữ liệu MySQL `user` thông qua Spring + JDBC, cấu trúc dữ liệu của bảng `user` như sau:

```sql
-- Tạo bảng người dùng
CREATE TABLE `user` (
    `id`      BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `name`    VARCHAR(255)        NOT NULL DEFAULT '' COMMENT 'Tên người dùng',
    `age`     INT(3)              NOT NULL DEFAULT 0 COMMENT 'Tuổi',
    `address` VARCHAR(255)        NOT NULL DEFAULT '' COMMENT 'Địa chỉ',
    `email`   VARCHAR(255)        NOT NULL DEFAULT '' COMMENT 'Email',
    PRIMARY KEY (`id`),
    UNIQUE (`name`)
) COMMENT = 'Bảng người dùng';

INSERT INTO `user` (`name`, `age`, `address`, `email`)
VALUES ('An', 18, 'HCM', 'xxx@abc.com');
INSERT INTO `user` (`name`, `age`, `address`, `email`)
VALUES ('Binh', 19, 'HN', 'xxx@abc.com');
```

### Định nghĩa thực thể

```java
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Objects;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long id;
    private String name;
    private Integer age;
    private String address;
    private String email;
}
```

### Định nghĩa giao diện DAO

```java
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

/**
 * Giao diện DAO cho bảng user
 */
public interface UserDao {

    // DML
    // -------------------------------------------------------------------
    void insert(User user);

    void batchInsert(List<User> users);

    void deleteByName(String name);

    void deleteAll();

    void update(User user);

    Integer count();

    List<User> list();

    User queryByName(String name);

    JdbcTemplate getJdbcTemplate();

    // DDL
    // -------------------------------------------------------------------
    void truncate();

    void recreateTable();

}
```

### Định nghĩa lớp thực thi DAO

Bằng cách sử dụng `JdbcTemplate` để thực hiện các câu lệnh SQL tương ứng với nguồn dữ liệu, chúng ta có thể hoàn thành các tác vụ truy cập cơ sở dữ liệu.

```java
package io.github.dunwu.springboot.core.data.jdbc;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Lớp thực thi giao diện DAO cho bảng user
 */
@Repository
public class UserDaoImpl implements UserDao {

    private JdbcTemplate jdbcTemplate;

    public UserDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void insert(User user) {
        jdbcTemplate.update("INSERT INTO user(name, age, address, email) VALUES(?, ?, ?, ?)",
            user.getName(), user.getAge(), user.getAddress(), user.getEmail());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchInsert(List<User> users) {
        String sql = "INSERT INTO user(name, age, address, email) VALUES(?, ?, ?, ?)";

        List<Object[]> params = new ArrayList<>();

        users.forEach(user -> {
            params.add(new Object[] { user.getName(), user.getAge(), user.getAddress(), user.getEmail() });
        });
        jdbcTemplate.batchUpdate(sql, params);
    }

    @Override
    public void deleteByName(String name) {
        jdbcTemplate.update("DELETE FROM user WHERE name = ?", name);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteAll() {
        jdbcTemplate.execute("DELETE FROM user");
    }

    @Override
    public void update(User user) {
        jdbcTemplate.update("UPDATE user SET name=?, age=?, address=?, email=? WHERE id=?",
            user.getName(), user.getAge(), user.getAddress(), user.getEmail(), user.getId());
    }

    @Override
    public Integer count() {
        try {
            return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM user", Integer.class);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public List<User> list() {
        return jdbcTemplate.query("SELECT * FROM user", new BeanPropertyRowMapper<>(User.class));
    }

    @Override
    public User queryByName(String name) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM user WHERE name = ?",
                new BeanPropertyRowMapper<>(User.class), name);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public JdbcTemplate getJdbcTemplate() {
        return jdbcTemplate;
    }

    @Override
    public void truncate() {
        jdbcTemplate.execute("TRUNCATE TABLE user");
    }

    @Override
    public void recreateTable() {
        jdbcTemplate.execute("DROP TABLE IF EXISTS user");

        String sqlStatement =
            "CREATE TABLE IF NOT EXISTS user (\n"
                + "    id      BIGINT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Id',\n"
                + "    name    VARCHAR(255)         NOT NULL DEFAULT '' COMMENT 'Tên người dùng',\n"
                + "    age     INT(3)              NOT NULL DEFAULT 0 COMMENT 'Tuổi',\n"
                + "    address VARCHAR(255)         NOT NULL DEFAULT '' COMMENT 'Địa chỉ',\n"
                + "    email   VARCHAR(255)         NOT NULL DEFAULT '' COMMENT 'Email',\n"
                + "    PRIMARY KEY (id)\n"
                + ") COMMENT = 'Bảng người dùng';";
        jdbcTemplate.execute(sqlStatement);
    }

}
```

### Lớp kiểm thử

```java
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
@Rollback
@SpringBootTest(classes = { SpringBootDataJdbcApplication.class })
public class DataJdbcMysqlDataSourceTest {

    @Autowired
    private UserDao userDAO;

    @BeforeEach
    public void before() {
        userDAO.truncate();
    }

    @Test
    public void insert() {
        userDAO.insert(new User("An", 18, "HCM", "user1@163.com"));
        User linda = userDAO.queryByName("An");
        assertThat(linda).isNotNull();
    }

    @Test
    public void batchInsert() {
        List<User> users = new ArrayList<>();
        users.add(new User('An', 18, 'HCM', 'user1@abc.com'));
        users.add(new User('Binh', 19, 'HN', 'user2@abc.com'));
        users.add(new User('Duc', 18, 'HCM', 'user3@abc.com'));
        users.add(new User('Dat', 18, 'HN', 'user4@abc.com'));

        userDAO.batchInsert(users);
        int count = userDAO.count();
        assertThat(count).isEqualTo(4);

        List<User> list = userDAO.list();
        assertThat(list).isNotEmpty().hasSize(4);
        list.forEach(user -> {
            log.info(user.toString());
        });
    }

    @Test
    public void delete() {
        List<User> users = new ArrayList<>();
        users.add(new User('An', 18, 'HCM', 'user1@abc.com'));
        users.add(new User('Binh', 19, 'HN', 'user2@abc.com'));
        users.add(new User('Duc', 18, 'HCM', 'user3@abc.com'));
        users.add(new User('Dat', 18, 'HN', 'user4@abc.com'));
        userDAO.batchInsert(users);

        userDAO.deleteByName("An");
        User user = userDAO.queryByName("An");
        assertThat(user).isNull();

        userDAO.deleteAll();
        List<User> list = userDAO.list();
        assertThat(list).isEmpty();
    }

    @Test
    public void update() {
        userDAO.insert(new User('An', 18, 'HCM', 'user1@abc.com'));
        User oldUser = userDAO.queryByName("An");
        oldUser.setName("Anh");
        userDAO.update(oldUser);
        User newUser = userDAO.queryByName("Anh");
        assertThat(newUser).isNotNull();
    }

}
```

## Spring Boot JDBC

> Ví dụ đầy đủ: [spring-data-jdbc-basics](https://github.com/vanhung4499/spring-tutorial/tree/main/codes/spring-data-jdbc-basics)

### Thêm dependency của Spring Boot

Bạn có thể tạo một dự án Spring Boot bằng cách chọn các thành phần bạn cần trên trang [Spring Initializr](https://start.spring.io/). Hoặc bạn có thể thêm các dependency cần thiết trực tiếp vào file pom.xml:

```xml
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.7</version>
  </parent>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jdbc</artifactId>
    </dependency>
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
    </dependency>
  </dependencies>
```

### Cấu hình nguồn dữ liệu

Sau khi thêm dependency, bạn cần cấu hình nguồn dữ liệu trong file `application.properties` hoặc `application.yml`.

Dưới đây là một ví dụ cấu hình nguồn dữ liệu cơ bản:

```properties
spring.datasource.url = jdbc:mysql://localhost:3306/spring_tutorial?serverTimezone=UTC&useUnicode=true&characterEncoding=utf8
spring.datasource.driver-class-name = com.mysql.cj.jdbc.Driver
spring.datasource.username = root
spring.datasource.password = root
```

Hãy thay thế `url`, `username`, `password` bằng thông tin tương ứng của bạn.

### Kiểm tra

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
            log.error("Không thể kết nối tới nguồn dữ liệu!");
            return;
        }

        if (connection != null) {
            log.info("URL nguồn dữ liệu: {}", connection.getMetaData().getURL());
        } else {
            log.error("Không thể kết nối tới nguồn dữ liệu!");
        }
    }

}
```

Sau khi chạy phương thức `main`, console sẽ hiển thị nội dung sau, cho thấy kết nối tới nguồn dữ liệu thành công:

```
20:50:18.449 [main] [INFO ] i.g.d.s.d.SpringBootDataJdbcApplication.run - URL nguồn dữ liệu: jdbc:mysql://localhost:3306/spring_tutorial?serverTimezone=UTC&useUnicode=true&characterEncoding=utf8
```

## Spring JDBC

`spring-boot-starter-data-jdbc` sử dụng `spring-jdbc` để cung cấp các tính năng JDBC.

### Thêm các phụ thuộc Spring

Thêm các phụ thuộc cần thiết vào file pom.xml:

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

### Cấu hình nguồn dữ liệu dựa trên JDBC Driver

Dưới đây là một ví dụ cấu hình nguồn dữ liệu JDBC cho mysql:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xmlns:jdbc="http://www.springframework.org/schema/jdbc"
    xmlns="http://www.springframework.org/schema/beans"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
            http://www.springframework.org/schema/beans/spring-beans.xsd
            http://www.springframework.org/schema/context
            http://www.springframework.org/schema/context/spring-context.xsd
            http://www.springframework.org/schema/jdbc
            http://www.springframework.org/schema/jdbc/spring-jdbc.xsd">

    <!-- Import file cấu hình -->
    <context:property-placeholder location="classpath:properties/mysql.properties" />

    <!-- Sử dụng nguồn dữ liệu dựa trên JDBC Driver -->
    <!-- (1) Trả về một kết nối mới mỗi khi yêu cầu kết nối. Hiệu suất không cao -->
    <bean id="dataSource1" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="${jdbc.driver}" />
        <property name="url" value="${jdbc.url}" />
        <property name="username" value="${jdbc.username}" />
        <property name="password" value="${jdbc.password}" />
    </bean>

    <!-- (2) Trả về cùng một kết nối mỗi khi yêu cầu kết nối. Không phù hợp cho đa luồng -->
    <bean id="dataSource2" class="org.springframework.jdbc.datasource.SingleConnectionDataSource">
        <property name="driverClassName" value="${jdbc.driver}" />
        <property name="url" value="${jdbc.url}" />
        <property name="username" value="${jdbc.username}" />
        <property name="password" value="${jdbc.password}" />
    </bean>

    <!-- JDBC Template -->
    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
        <constructor-arg ref="dataSource1" />
    </bean>
    <bean id="userDao" class="io.github.dunwu.springboot.data.jdbc.UserDaoImpl">
        <constructor-arg ref="jdbcTemplate" />
    </bean>

    <!-- Khởi tạo cấu trúc bảng dữ liệu -->
    <jdbc:initialize-database data-source="dataSource1" ignore-failures="ALL">
        <jdbc:script location="classpath:sql/schema.sql" />
        <jdbc:script location="classpath:sql/data.sql" />
    </jdbc:initialize-database>
</beans>
```

### Kiểm tra

```java

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.io.IOException;
import java.sql.SQLException;

@SuppressWarnings("all")
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:data/spring-mysql.xml" })
public class MysqlJdbcTest {

    @Autowired
    private ApplicationContext ctx;

    @Before
    public void before() {
        ctx = JdbcDemo.getMysqlApplicationContext();
    }

    @Test
    public void testExecJdbcOper() throws SQLException, IOException {
        UserDao userDao = (UserDaoImpl) ctx.getBean("userDao");
        JdbcDemo.execJdbcOper(userDao);
    }

    @After
    public void after() {
        ((ClassPathXmlApplicationContext) ctx).close();
    }

}
```

## JdbcTemplate API

Spring trích xuất mã mẫu truy cập dữ liệu vào các lớp mẫu. Spring cung cấp 3 lớp mẫu JDBC:

- `JdbcTemplate`: Lớp mẫu JDBC cơ bản nhất của Spring, lớp mẫu này hỗ trợ các chức năng truy cập cơ sở dữ liệu JDBC đơn giản nhất và truy vấn tham số chỉ mục đơn giản.
- `SimpleJdbcTemplate`: Lớp mẫu này sử dụng một số tính năng của Java 5 như tự động đóng gói, kiểu chung và danh sách tham số biến để đơn giản hóa việc sử dụng lớp mẫu JDBC.
- `NamedParameterJdbcTemplate`: Khi thực hiện truy vấn bằng lớp mẫu này, bạn có thể ràng buộc các giá trị truy vấn vào SQL bằng tham số có tên thay vì sử dụng chỉ mục tham số đơn giản.

API cốt lõi nhất định của `spring-jdbc` chính là `JdbcTemplate`, có thể nói rằng hầu hết các truy cập cơ sở dữ liệu JDBC đều xoay quanh lớp này. Spring đã đóng gói sâu lớp truy cập cơ sở dữ liệu vào lớp `JdbcTemplate` bằng cách sử dụng Dependency Injection để cấu hình nguồn dữ liệu và sau đó `JdbcTemplate` chịu trách nhiệm cho việc truy cập dữ liệu cụ thể.

`JdbcTemplate` chủ yếu cung cấp các phương thức sau:

- Phương thức `execute`: Có thể sử dụng để thực thi bất kỳ câu lệnh SQL nào, thường được sử dụng để thực thi các câu lệnh DDL.
- Phương thức `update` và `batchUpdate`: Phương thức `update` được sử dụng để thực hiện các câu lệnh thêm, sửa, xóa; phương thức `batchUpdate` được sử dụng để thực hiện các câu lệnh xử lý hàng loạt.
- Phương thức `query` và `queryForXXX`: Được sử dụng để thực hiện các câu lệnh truy vấn.
- Phương thức `call`: Được sử dụng để thực hiện các câu lệnh liên quan đến stored procedure, function.

Để thuận tiện cho việc trình bày, các hoạt động thêm, sửa, xóa và truy vấn dưới đây đều xoay quanh một bảng có tên là `user` (cột id là khóa chính tự tăng) và thực thể dữ liệu của bảng như sau:

```java
public class User {
    private Integer id;
    private String name;
    private Integer age;

    // Bỏ qua getter/setter
}
```

Thực thể dữ liệu chỉ cần là một Java Bean thuần túy, không cần bất kỳ chú thích nào.

### Phương thức execute

Sử dụng phương thức execute để thực thi câu lệnh DDL, tạo một cơ sở dữ liệu có tên là `test` và sau đó tạo một bảng có tên là `user` trong cơ sở dữ liệu này.

```java
public void recreateTable() {
    jdbcTemplate.execute("DROP DATABASE IF EXISTS test");
    jdbcTemplate.execute("CREATE DATABASE test");
    jdbcTemplate.execute("USE test");
    jdbcTemplate.execute("DROP TABLE if EXISTS user");
    jdbcTemplate.execute("DROP TABLE if EXISTS user");
    // @formatter:off
    StringBuilder sb = new StringBuilder();
    sb.append("CREATE TABLE user (id int (10) unsigned NOT NULL AUTO_INCREMENT,\n")
        .append("name varchar (64) NOT NULL DEFAULT '',\n")
        .append("age tinyint (3) NOT NULL DEFAULT 0,\n")
        .append("PRIMARY KEY (ID));\n");
    // @formatter:on
    jdbcTemplate.execute(sb.toString());
}
```

### Phương thức update

Thêm dữ liệu

```java
public void insert(String name, Integer age) {
    jdbcTemplate.update("INSERT INTO user(name, age) VALUES(?, ?)", name, age);
}
```

Xóa dữ liệu

```java
public void delete(String name) {
    jdbcTemplate.update("DELETE FROM user WHERE name = ?", name);
}
```

Sửa dữ liệu

```java
public void update(User user) {
    jdbcTemplate.update("UPDATE USER SET name=?, age=? WHERE id=?", user.getName(), user.getAge(), user.getId());
}
```

Xử lý hàng loạt

```java
public void batchInsert(List<User> users) {
    String sql = "INSERT INTO user(name, age) VALUES(?, ?)";

    List<Object[]> params = new ArrayList<>();

    users.forEach(item -> {
        params.add(new Object[] {item.getName(), item.getAge()});
    });
    jdbcTemplate.batchUpdate(sql, params);
}
```

### Phương thức query

Truy vấn đối tượng duy nhất

```java
public User queryByName(String name) {
    try {
        return jdbcTemplate
            .queryForObject("SELECT * FROM user WHERE name = ?", new BeanPropertyRowMapper<>(User.class), name);
    } catch (EmptyResultDataAccessException e) {
        return null;
    }
}
```

Truy vấn nhiều đối tượng

```java
public List<User> list() {
    return jdbcTemplate.query("select * from USER", new BeanPropertyRowMapper(User.class));
}
```

Lấy giá trị duy nhất của một cột hoặc các hàm như count, avg, sum

```java
public Integer count() {
    try {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM user", Integer.class);
    } catch (EmptyResultDataAccessException e) {
        return null;
    }
}
```

## Cấu hình SpringBoot JDBC

### Lớp JdbcTemplateAutoConfiguration

`JdbcTemplateAutoConfiguration` là lớp tự động cấu hình cho `JdbcTemplate`, nó có nhiệm vụ khởi tạo `JdbcTemplate`.

```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass({ DataSource.class, JdbcTemplate.class })
@ConditionalOnSingleCandidate(DataSource.class)
@AutoConfigureAfter(DataSourceAutoConfiguration.class)
@EnableConfigurationProperties(JdbcProperties.class)
@Import({ JdbcTemplateConfiguration.class, NamedParameterJdbcTemplateConfiguration.class })
public class JdbcTemplateAutoConfiguration {

}
```

Giải thích mã nguồn của lớp `JdbcTemplateAutoConfiguration`:

- `@AutoConfigureAfter(DataSourceAutoConfiguration.class)` chỉ định rằng `JdbcTemplateAutoConfiguration` phải chạy sau khi `DataSourceAutoConfiguration` hoàn thành, điều này có nghĩa là việc khởi tạo `JdbcTemplate` phải xảy ra sau khi `DataSource` được khởi tạo.
- `JdbcProperties` là lớp cấu hình cho `JdbcTemplateAutoConfiguration`, cho phép người dùng điều chỉnh cách khởi tạo `JdbcTemplate` bằng cách thiết lập các tùy chọn.
- `@Import({ JdbcTemplateConfiguration.class, NamedParameterJdbcTemplateConfiguration.class })` chỉ định rằng cần import hai lớp cấu hình `JdbcTemplateConfiguration` và `NamedParameterJdbcTemplateConfiguration`, công việc cụ thể của việc khởi tạo `JdbcTemplate` cũng được thực hiện trong hai lớp cấu hình này.

### Lớp JdbcTemplateConfiguration

Mã nguồn của lớp `JdbcTemplateConfiguration` như sau:

```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnMissingBean(JdbcOperations.class)
class JdbcTemplateConfiguration {

	@Bean
	@Primary
	JdbcTemplate jdbcTemplate(DataSource dataSource, JdbcProperties properties) {
		JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
		JdbcProperties.Template template = properties.getTemplate();
		jdbcTemplate.setFetchSize(template.getFetchSize());
		jdbcTemplate.setMaxRows(template.getMaxRows());
		if (template.getQueryTimeout() != null) {
			jdbcTemplate.setQueryTimeout((int) template.getQueryTimeout().getSeconds());
		}
		return jdbcTemplate;
	}

}
```

Giải thích mã nguồn của lớp `JdbcTemplateConfiguration`: Trong `JdbcTemplateConfiguration`, `JdbcTemplate` được khởi tạo dựa trên `DataSource` và `JdbcProperties`.

### Lớp NamedParameterJdbcTemplateConfiguration

Mã nguồn của lớp `NamedParameterJdbcTemplateConfiguration` như sau:

```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnSingleCandidate(JdbcTemplate.class)
@ConditionalOnMissingBean(NamedParameterJdbcOperations.class)
class NamedParameterJdbcTemplateConfiguration {

	@Bean
	@Primary
	NamedParameterJdbcTemplate namedParameterJdbcTemplate(JdbcTemplate jdbcTemplate) {
		return new NamedParameterJdbcTemplate(jdbcTemplate);
	}

}
```

Giải thích mã nguồn của lớp `NamedParameterJdbcTemplateConfiguration`: Trong `NamedParameterJdbcTemplateConfiguration`, `NamedParameterJdbcTemplate` được khởi tạo dựa trên `JdbcTemplate`.

## spring-data-jdbc

Dự án Spring Data bao gồm hỗ trợ lưu trữ JDBC và tự động tạo SQL cho các phương thức trên `CrudRepository`. Đối với các truy vấn phức tạp hơn, nó cung cấp chú thích `@Query`.

Khi các phụ thuộc cần thiết tồn tại trên classpath, Spring Boot sẽ tự động cấu hình lưu trữ JDBC của Spring Data. Chúng có thể được thêm vào dự án thông qua một phụ thuộc duy nhất `spring-boot-starter-data-jdbc`. Nếu cần thiết, bạn có thể điều khiển cấu hình Spring Data JDBC bằng cách thêm chú thích `@EnableJdbcRepositories` hoặc một lớp con của `JdbcConfiguration` vào ứng dụng.

> Để biết thêm chi tiết về Spring Data JDBC, bạn có thể tham khảo [Spring Data JDBC](http://spring.io/projects/spring-data-jdbc).
