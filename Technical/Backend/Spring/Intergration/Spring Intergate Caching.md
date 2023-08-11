---
title: Spring Intergate Caching
tags: [spring, java, backend]
categories: [spring, java, backend]
date created: 2023-08-11
date modified: 2023-08-11
---

# Spring tích hợp Middleware Cache

> Spring cung cấp một trừu tượng hóa cho tính năng bộ nhớ cache, cho phép bạn linh hoạt thay thế triển khai bộ nhớ cache ở mức độ thấp hơn và tiếp cận cùng một giao diện cache ở mức độ cao hơn.

## Giao diện Cache

API cache của Spring được cung cấp dưới dạng các chú thích.

### Bật chú thích

Spring cung cấp chức năng chú thích cho tính năng bộ nhớ cache, nhưng bạn phải bật chú thích.  
Bạn có hai lựa chọn:  
(1) Khai báo trong xml  
Giống như trong ví dụ spring-ehcache.xml ở phần trước, sử dụng `<cache:annotation-driven/>`

```xml
<cache:annotation-driven cache-manager="cacheManager"/>
```

(2) Sử dụng chú thích đánh dấu  
Bạn cũng có thể sử dụng chú thích để đánh dấu một lớp và sử dụng chú thích cache trong lớp đó.  
Ví dụ:

```java
@Configuration
@EnableCaching
public class AppConfig {
}
```

### Sử dụng chú thích cache

Hỗ trợ cache của Spring tương tự như hỗ trợ giao dịch.  
Đầu tiên, sử dụng chú thích để đánh dấu phương thức, tương đương với việc xác định điểm chạm, sau đó sử dụng kỹ thuật Aop để truy cập vào tham số và giá trị trả về của phương thức trước và sau khi gọi phương thức, từ đó thực hiện logic cache.  
Dưới đây là ba chú thích phương thức cấp độ:

#### @Cacheable

Chỉ định phương thức được chú thích có thể được lưu trữ trong bộ nhớ cache: Khi gọi phương thức lần đầu tiên, kết quả của nó sẽ được lưu trữ trong bộ nhớ cache, và trong khoảng thời gian hiệu lực của bộ nhớ cache, việc truy cập phương thức này sẽ trả về kết quả từ bộ nhớ cache mà không thực hiện lại đoạn mã trong phương thức.  
Chú thích này có thể sử dụng thuộc tính `condition` để đặt điều kiện, nếu không đáp ứng điều kiện, không sử dụng khả năng cache, thực hiện trực tiếp phương thức.  
Có thể sử dụng thuộc tính `key` để chỉ định quy tắc tạo khóa.

#### @CachePut

Khác với `@Cacheable`, `@CachePut` không chỉ lưu trữ kết quả của phương thức trong bộ nhớ cache, mà còn thực hiện đoạn mã trong phương thức.  
Nó hỗ trợ các thuộc tính và cách sử dụng tương tự như `@Cacheable`.

#### @CacheEvict

Ngược lại với `@Cacheable`, `@CacheEvict` chỉ định rằng phương thức được chú thích được sử dụng để xóa dữ liệu cache không hợp lệ hoặc không sử dụng.  
Dưới đây là một ví dụ về cách sử dụng cơ bản của `@Cacheable`、`@CacheEvict` và `@CachePut`:

```java
@Service
public class UserService {
    // @Cacheable có thể đặt nhiều cache, ví dụ: @Cacheable({"books", "isbns"})
    @Cacheable(value={"users"}, key="#user.id")
    public User findUser(User user) {
        return findUserInDB(user.getId());
    }

    @Cacheable(value = "users", condition = "#user.getId() <= 2")
    public User findUserInLimit(User user) {
        return findUserInDB(user.getId());
    }

    @CachePut(value = "users", key = "#user.getId()")
    public void updateUser(User user) {
        updateUserInDB(user);
    }

    @CacheEvict(value = "users")
    public void removeUser(User user) {
        removeUserInDB(user.getId());
    }

    @CacheEvict(value = "users", allEntries = true)
    public void clear() {
        removeAllInDB();
    }
}
```

#### @Caching

Nếu bạn muốn sử dụng cùng một chú thích cache (`@Cacheable`, `@CacheEvict` hoặc `@CachePut`) nhiều lần để chú thích một phương thức, bạn cần sử dụng `@Caching`.

```java
@Caching(evict = { @CacheEvict("primary"), @CacheEvict(cacheNames="secondary", key="#p0") })
public Book importBooks(String deposit, Date date)
```

#### @CacheConfig

Khác với các chú thích cache trước đó, đây là một chú thích cấp lớp.  
Nếu tất cả các hoạt động của lớp đều là hoạt động cache, bạn có thể sử dụng `@CacheConfig` để chỉ định lớp, giảm bớt một số cấu hình.

```java
@CacheConfig("books")
public class BookRepositoryImpl implements BookRepository {
	@Cacheable
	public Book findBook(ISBN isbn) {...}
}
```

## Lưu trữ bộ nhớ cache

Spring cho phép tích hợp nhiều loại bộ nhớ cache khác nhau thông qua cấu hình. Người dùng có thể chọn loại bộ nhớ cache phù hợp với nhu cầu cụ thể.

Các loại bộ nhớ cache khác nhau có hiệu năng và tính năng khác nhau. Nếu bạn muốn hiểu rõ hơn về cơ chế cụ thể, bạn có thể tham khảo: [Hiểu rõ nguyên lý bộ nhớ cache](https://dunwu.github.io/javatech/#/technology/cache/cache-theory?id=hi%e1%bb%83u-r%e1%bb%95-nguy%c3%aan-l%c3%bd-b%e1%bb%99-nh%e1%bb%9b-cache). Ở đây, chúng tôi sẽ không đi vào chi tiết.

### Sử dụng ConcurrentHashMap làm bộ nhớ cache

Cấu hình tham khảo:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:cache="http://www.springframework.org/schema/cache" xmlns:p="http://www.springframework.org/schema/p"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
         http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd
         http://www.springframework.org/schema/cache http://www.springframework.org/schema/cache/spring-cache.xsd">

  <description>Sử dụng ConcurrentHashMap làm bộ nhớ cache trong Spring</description>

  <!--Cấu hình tham khảo: https://docs.spring.io/spring/docs/current/spring-framework-reference/integration.html#cache-store-configuration-->

  <context:component-scan base-package="io.github.dunwu.spring.cache"/>

  <bean id="simpleCacheManager" class="org.springframework.cache.support.SimpleCacheManager">
    <property name="caches">
      <set>
        <bean class="org.springframework.cache.concurrent.ConcurrentMapCacheFactoryBean" p:name="default"/>
        <bean class="org.springframework.cache.concurrent.ConcurrentMapCacheFactoryBean" p:name="users"/>
      </set>
    </property>
  </bean>

  <cache:annotation-driven cache-manager="simpleCacheManager"/>
</beans>
```

### Sử dụng Ehcache làm bộ nhớ cache

Cấu hình tham khảo:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:cache="http://www.springframework.org/schema/cache"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
         http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd
         http://www.springframework.org/schema/cache http://www.springframework.org/schema/cache/spring-cache.xsd">

  <description>Sử dụng EhCache làm bộ nhớ cache trong Spring</description>

  <!--Cấu hình tham khảo: https://docs.spring.io/spring/docs/current/spring-framework-reference/integration.html#cache-store-configuration-->

  <context:component-scan base-package="io.github.dunwu.spring.cache"/>

  <bean id="ehcache" class="org.springframework.cache.ehcache.EhCacheManagerFactoryBean">
    <property name="configLocation" value="classpath:ehcache/ehcache.xml"/>
  </bean>

  <bean id="ehcacheCacheManager" class="org.springframework.cache.ehcache.EhCacheCacheManager">
    <property name="cacheManager" ref="ehcache"/>
  </bean>

  <cache:annotation-driven cache-manager="ehcacheCacheManager"/>
</beans>
```

Cấu hình trong tệp ehcache.xml hoàn toàn tuân thủ các tiêu chuẩn cấu hình chính thức của Ehcache.

### Sử dụng Caffeine làm bộ nhớ cache

Cấu hình tham khảo:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:cache="http://www.springframework.org/schema/cache"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
         http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd
         http://www.springframework.org/schema/cache http://www.springframework.org/schema/cache/spring-cache.xsd">

  <description>Sử dụng Caffeine làm bộ nhớ cache trong Spring</description>

  <!--Cấu hình tham khảo: https://docs.spring.io/spring/docs/current/spring-framework-reference/integration.html#cache-store-configuration-->

  <context:component-scan base-package="io.github.dunwu.spring.cache"/>

  <bean id="caffeineCacheManager" class="org.springframework.cache.caffeine.CaffeineCacheManager"/>

  <cache:annotation-driven cache-manager="caffeineCacheManager"/>
</beans>
```
