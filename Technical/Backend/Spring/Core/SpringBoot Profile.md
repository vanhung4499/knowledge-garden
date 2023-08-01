---
title: SpringBoot Profile
tags: [spring, springboot, java, backend]
categories: [spring, springboot, java, backend]
date created: 2023-07-26
date modified: 2023-07-26
---

# Profile trong Spring Boot

> Một ứng dụng thường cần có các cấu hình và xử lý mã logic khác nhau cho từng môi trường khác nhau. Spring Boot cung cấp hỗ trợ đơn giản cho việc này.
>
> Từ khóa: `@Profile`, `spring.profiles.active`

## Cấu hình cho từng môi trường

### Cấu hình bằng properties

Giả sử, một ứng dụng có các môi trường là: dev, test, prod

Chúng ta có thể thêm 4 tệp cấu hình:

- `applcation.properties` - Cấu hình chung
- `application-dev.properties` - Cấu hình cho môi trường phát triển
- `application-test.properties` - Cấu hình cho môi trường kiểm thử
- `application-prod.properties` - Cấu hình cho môi trường sản xuất

Trong tệp `applcation.properties`, chúng ta có thể sử dụng cấu hình sau để kích hoạt profile:

```properties
spring.profiles.active = test
```

### Cấu hình bằng yml

Tương tự như tệp properties, chúng ta cũng có thể thêm 4 tệp cấu hình:

- `applcation.yml` - Cấu hình chung
- `application-dev.yml` - Cấu hình cho môi trường phát triển
- `application-test.yml` - Cấu hình cho môi trường kiểm thử
- `application-prod.yml` - Cấu hình cho môi trường sản xuất

Trong tệp `applcation.yml`, chúng ta có thể sử dụng cấu hình sau để kích hoạt profile:

```yml
spring:
  profiles:
    active: prod
```

Ngoài ra, tệp yml cũng có thể hoàn thành tất cả cấu hình cho các profile trong cùng một tệp:

```yml
# Kích hoạt profile prod
spring:
  profiles:
    active: prod
# Cũng có thể kích hoạt nhiều profile cùng lúc
# spring.profiles.active: prod,proddb,prodlog
---
# Cấu hình cho môi trường dev
spring:
  profiles: dev

# Bỏ qua cấu hình

---
spring:
  profiles: test

# Bỏ qua cấu hình

---
spring.profiles: prod
spring.profiles.include:
  - proddb
  - prodlog

---
spring:
  profiles: proddb

# Bỏ qua cấu hình

---
spring:
  profiles: prodlog
# Bỏ qua cấu hình
```

Lưu ý: Sử dụng `---` để phân tách giữa các profile khác nhau.

## Phân biệt mã code cho từng môi trường

Sử dụng chú thích `@Profile` cho phép chỉ định lớp hoặc phương thức chỉ hoạt động trong môi trường Profile cụ thể.

### Chú thích lớp

```java
@Configuration
@Profile("production")
public class JndiDataConfig {

    @Bean(destroyMethod="")
    public DataSource dataSource() throws Exception {
        Context ctx = new InitialContext();
        return (DataSource) ctx.lookup("java:comp/env/jdbc/datasource");
    }
}
```

### Chú thích tùy chỉnh

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Profile("production")
public @interface Production {
}
```

### Chú thích phương thức

```java
@Configuration
public class AppConfig {

    @Bean("dataSource")
    @Profile("development")
    public DataSource standaloneDataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.HSQL)
            .addScript("classpath:com/bank/config/sql/schema.sql")
            .addScript("classpath:com/bank/config/sql/test-data.sql")
            .build();
    }

    @Bean("dataSource")
    @Profile("production")
    public DataSource jndiDataSource() throws Exception {
        Context ctx = new InitialContext();
        return (DataSource) ctx.lookup("java:comp/env/jdbc/datasource");
    }
}
```

## Kích hoạt profile

### Kích hoạt profile bằng plugin

```
spring-boot:run -Drun.profiles=prod
```

### Kích hoạt profile bằng phương thức main

```
--spring.profiles.active=prod
```

### Kích hoạt profile bằng file jar

```
java -jar -Dspring.profiles.active=prod *.jar
```

### Kích hoạt profile trong mã Java

Kích hoạt profile trực tiếp bằng biến môi trường:

```java
System.setProperty("spring.profiles.active", "test");
```

Kích hoạt profile trong Spring container:

```java
AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
ctx.getEnvironment().setActiveProfiles("development");
ctx.register(SomeConfig.class, StandaloneDataConfig.class, JndiDataConfig.class);
ctx.refresh();
```

## Mã nguồn ví dụ
