---
title: Spring Access Redis
tags: [spring, java, db, backend]
categories: [spring, java, db, backend]
date created: 2023-08-11
date modified: 2023-08-11
---

# Truy cập Redis trong Spring

## Giới thiệu

[Redis](https://redis.io/) là một cơ sở dữ liệu bộ nhớ mở được sử dụng bởi hàng triệu nhà phát triển như một cơ sở dữ liệu, bộ nhớ cache, công cụ xử lý luồng và trung gian tin nhắn.

Trong Spring, dự án [spring-data-redis](https://github.com/spring-projects/spring-data-redis) cung cấp một API để truy cập [Redis](https://redis.io/), giúp việc truy cập trở nên dễ dàng hơn. [spring-data-redis](https://github.com/spring-projects/spring-data-redis) là một dự án con của [spring-data](https://spring.io/projects/spring-data), nó cung cấp các tính năng mạnh mẽ để làm việc với Redis.

Trong dự án [spring-boot](https://github.com/spring-projects/spring-boot), module con [spring-boot-starter-data-redis](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-starters/spring-boot-starter-data-redis) được xây dựng dựa trên [spring-data-redis](https://github.com/spring-projects/spring-data-redis), giúp đơn giản hóa việc cấu hình Redis.

## Bắt đầu nhanh với Spring Boot

### Thêm phụ thuộc

Thêm phụ thuộc vào tệp pom.xml:

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

### Cấu hình nguồn dữ liệu

```properties
spring.redis.database = 0
spring.redis.host = localhost
spring.redis.port = 6379
spring.redis.password =
```

### Định nghĩa đối tượng

```java
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.io.Serializable;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class User implements Serializable {

    private static final long serialVersionUID = 4142994984277644695L;

    private Long id;
    private String name;
    private Integer age;
    private String address;
    private String email;

}
```

### Định nghĩa giao diện CRUD

```java
import java.util.Map;

public interface UserService {

    void batchSetUsers(Map<String, User> users);

    long count();

    User getUser(Long id);

    void setUser(User user);

}
```

### Triển khai giao diện CRUD

```java
import cn.hutool.core.bean.BeanUtil;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UserServiceImpl implements UserService {

    public static final String DEFAULT_KEY = "spring:tutorial:user";

    private final RedisTemplate<String, Object> redisTemplate;

    public UserServiceImpl(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void batchSetUsers(Map<String, User> users) {
        redisTemplate.opsForHash().putAll(DEFAULT_KEY, users);
    }

    @Override
    public long count() {
        return redisTemplate.opsForHash().size(DEFAULT_KEY);
    }

    @Override
    public User getUser(Long id) {
        Object obj = redisTemplate.opsForHash().get(DEFAULT_KEY, id.toString());
        return BeanUtil.toBean(obj, User.class);
    }

    @Override
    public void setUser(User user) {
        redisTemplate.opsForHash().put(DEFAULT_KEY, user.getId().toString(), user);
    }

}
```

### Tạo Application

Tạo ứng dụng, khởi tạo một đối tượng `RedisTemplate`.

```java
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Slf4j
@SpringBootApplication
public class RedisQuickstartApplication {

    @Autowired
    private ObjectMapper objectMapper;

    @Bean
    @Primary
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {

        // Chỉ định các trường cần được tuần tự hóa, field, get và set, cũng như phạm vi của các thuộc tính, ANY bao gồm cả private và public
        objectMapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        // // Chỉ định loại đầu vào được tuần tự hóa, lớp phải không được đánh dấu là final, các lớp được đánh dấu là final như String, Integer, v.v. sẽ gây ra ngoại lệ
        // objectMapper.activateDefaultTyping(new DefaultBaseTypeLimitingValidator(),
        //     ObjectMapper.DefaultTyping.NON_FINAL);

        // Sử dụng Jackson2JsonRedisSerializer để tuần tự hóa và giải tuần tự hóa giá trị redis (mặc định sử dụng cách tuần tự hóa của JDK)
        Jackson2JsonRedisSerializer<Object> serializer = new Jackson2JsonRedisSerializer<>(Object.class);
        serializer.setObjectMapper(objectMapper);

        RedisTemplate<String, Object> template = new RedisTemplate<>();
        // Cấu hình factory kết nối
        template.setConnectionFactory(factory);
        // Giá trị sử dụng tuần tự hóa json
        template.setValueSerializer(serializer);
        // Sử dụng StringRedisSerializer để tuần tự hóa và giải tuần tự hóa khóa redis
        template.setKeySerializer(new StringRedisSerializer());
        // Cấu hình chế độ tuần tự hóa khóa và giá trị hash
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(serializer);
        template.afterPropertiesSet();

        return template;
    }

    public static void main(String[] args) {
        SpringApplication.run(RedisQuickstartApplication.class, args);
    }

}
```

### Kiểm tra

```java
@Slf4j
@SpringBootTest(classes = { RedisQuickstartApplication.class })
public class RedisQuickstartTests {

    @Autowired
    private UserService userService;

    @Test
    public void test() {
        final long SIZE = 1000L;
        Map<String, User> map = new HashMap<>();
        for (long i = 0; i < SIZE; i++) {
            User user = new User(i, RandomUtil.randomChineseName(),
                RandomUtil.randomInt(1, 100),
                RandomUtil.randomEnum(Location.class).name(),
                RandomUtil.randomEmail());
            map.put(String.valueOf(i), user);
        }
        userService.batchSetUsers(map);
        long count = userService.count();
        Assertions.assertThat(count).isEqualTo(SIZE);

        for (int i = 0; i < 100; i++) {
            long id = RandomUtil.randomLong(0, 1000);
            User user = userService.getUser(id);
            log.info("user-{}: {}", id, user.toString());
        }
    }

}
```

## Tài liệu tham khảo

- [Trang chủ Redis](https://redis.io/)
- [Redis Github](https://github.com/redis/redis)
- [spring-data-redis](https://github.com/spring-projects/spring-data-redis)
- [Tài liệu chính thức Spring Data Redis](https://docs.spring.io/spring-data/redis/docs/current/reference/html/)
- [Ví dụ chính thức Spring Data](https://github.com/spring-projects/spring-data-examples/)
