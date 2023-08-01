---
title: SpringBoot Properties Loading
tags: [spring, springboot, java, backend]
categories: [spring, springboot, java, backend]
date created: 2023-07-26
date modified: 2023-07-26
---

# Chi tiết về việc tải thuộc tính trong Spring Boot

## Thứ tự tải thuộc tính

Spring Boot tải thuộc tính theo thứ tự sau:

1. [Cấu hình toàn cầu của Devtools](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#using-boot-devtools-globalsettings) (khi devtools được kích hoạt `~/.spring-boot-devtools.properties`).
2. Cấu hình từ chú thích `@TestPropertySource` trong môi trường kiểm thử.
3. Thuộc tính trong môi trường kiểm thử: [`@SpringBootTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html) và các chú thích kiểm thử khác.
4. Tham số dòng lệnh.
5. Thuộc tính `SPRING_APPLICATION_JSON`.
6. Tham số khởi tạo của `ServletConfig`.
7. Tham số khởi tạo của `ServletContext`.
8. Thuộc tính JNDI từ các thuộc tính được cấu hình thông qua `java:comp/env`.
9. Thuộc tính hệ thống Java (`System.getProperties()`).
10. Biến môi trường hệ điều hành.
11. Thuộc tính ngẫu nhiên từ `RandomValuePropertySource` với các thuộc tính có định dạng `random.*`.
12. Cấu hình ngoài jar: `application-{profile}.properties` hoặc `application-{profile}.yml`.
13. Cấu hình trong jar: `application-{profile}.properties` hoặc `application-{profile}.yml`.
14. Cấu hình ngoài jar: `application.properties` hoặc `application.yml`.
15. Cấu hình trong jar: `application.properties` hoặc `application.yml`.
16. Cấu hình được liên kết với `@PropertySource`.
17. Thuộc tính mặc định (được chỉ định bằng `SpringApplication.setDefaultProperties`).

## Thuộc tính ngẫu nhiên

Lớp `RandomValuePropertySource` được sử dụng để cấu hình giá trị ngẫu nhiên.

Ví dụ:

```properties
my.secret=${random.value}
my.number=${random.int}
my.bignumber=${random.long}
my.uuid=${random.uuid}
my.number.less.than.ten=${random.int(10)}
my.number.in.range=${random.int[1024,65536]}
```

## Thuộc tính dòng lệnh

Mặc định, `SpringApplication` sẽ lấy các tham số `--` (ví dụ: `--server.port=9000`) và thêm thuộc tính này vào `Environment` của Spring.

Nếu bạn không muốn tải thuộc tính từ dòng lệnh, bạn có thể vô hiệu hóa nó bằng cách sử dụng `SpringApplication.setAddCommandLineProperties(false)`.

## Tệp thuộc tính ứng dụng

`SpringApplication` sẽ tự động tải thuộc tính từ tệp cấu hình `application.properties` trong các đường dẫn sau và đưa các thuộc tính này vào `Environment` của Spring.

1. Thư mục `/config` trong thư mục hiện tại.
2. Thư mục hiện tại.
3. Gói `/config` trong classpath.
4. Gốc classpath.

> Lưu ý:
>
> Các tệp cấu hình trong danh sách trên sẽ được ghi đè bởi các tệp cấu hình sau. Bạn có thể sử dụng tệp cấu hình YAML để thay thế tệp cấu hình properties.

Nếu bạn không muốn sử dụng `application.properties` làm tên tệp cấu hình, bạn có thể sử dụng biến môi trường `spring.config.name` để thay thế:

```
$ java -jar myproject.jar --spring.config.name=myproject
```

Bạn cũng có thể sử dụng biến môi trường `spring.config.location` để chỉ định đường dẫn của tệp cấu hình:

```properties
$ java -jar myproject.jar --spring.config.location=classpath:/default.properties,classpath:/override.properties
```

## Thuộc tính theo profile

Nếu bạn định nghĩa các tệp cấu hình theo định dạng `application-{profile}.properties`, chúng sẽ được coi là cấu hình đặc biệt cho môi trường `profile` tương ứng.

Bạn có thể kích hoạt profile bằng cách sử dụng tham số `spring.profiles.active`. Nếu không có profile nào được kích hoạt, mặc định sẽ tải cấu hình từ `application-default.properties`.

## Placeholder trong thuộc tính

Giá trị trong `application.properties` sẽ được lọc qua `Environment`, vì vậy bạn có thể tham chiếu đến các thuộc tính đã được định nghĩa trước đó.

```
app.name=MyApp
app.description=${app.name} là một ứng dụng Spring Boot
```

> Lưu ý: Bạn có thể sử dụng kỹ thuật này để tạo biến thuộc tính Spring Boot. Xem chi tiết: [Section 77.4, “Use ‘Short’ Command Line Arguments](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto-use-short-command-line-arguments)

## Thuộc tính YAML

Spring Framework có hai lớp hỗ trợ tải tệp YAML.

- `YamlPropertiesFactoryBean` chuyển cấu hình từ tệp YAML thành `Properties`.
- `YamlMapFactoryBean` chuyển cấu hình từ tệp YAML thành `Map`.

Ví dụ 1:

```yaml
environments:
  dev:
    url: http://dev.example.com
    name: Developer Setup
  prod:
    url: http://another.example.com
    name: My Cool App
```

Tương đương với:

```properties
environments.dev.url=http://dev.example.com
environments.dev.name=Developer Setup
environments.prod.url=http://another.example.com
environments.prod.name=My Cool App
```

YAML hỗ trợ cú pháp danh sách, tương đương với `[index]` trong thuộc tính:

```yaml
my:
  servers:
    - dev.example.com
    - another.example.com
```

Tương đương với:

```properties
my.servers[0]=dev.example.com
my.servers[1]=another.example.com
```

### Truy cập thuộc tính

Lớp `YamlPropertySourceLoader` chuyển cấu hình YAML thành `PropertySource` trong lớp `Environment` của Spring. Sau đó, bạn có thể truy cập các thuộc tính được cấu hình trong YAML bằng cách sử dụng chú thích `@Value` như các thuộc tính trong tệp properties.

### Cấu hình đa profile

```yaml
server:
  address: 192.168.1.100
---
spring:
  profiles: development
server:
  address: 127.0.0.1
---
spring:
  profiles: production & eu-central
server:
  address: 192.168.1.120
```

### Nhược điểm của YAML

Lưu ý rằng các thuộc tính được chú thích trong YAML không thể truy cập bằng chú thích `@PropertySource`. Vì vậy, nếu dự án của bạn sử dụng một số tệp thuộc tính tùy chỉnh, hãy tránh sử dụng YAML.

## Tiền tố thuộc tính

```java
package com.example;

import java.net.InetAddress;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix="acme")
public class AcmeProperties {

    private boolean enabled;

    private InetAddress remoteAddress;

    private final Security security = new Security();

    public boolean isEnabled() { ... }

    public void setEnabled(boolean enabled) { ... }

    public InetAddress getRemoteAddress() { ... }

    public void setRemoteAddress(InetAddress remoteAddress) { ... }

    public Security getSecurity() { ... }

    public static class Security {

        private String username;

        private String password;

        private List<String> roles = new ArrayList<>(Collections.singleton("USER"));

        public String getUsername() { ... }

        public void setUsername(String username) { ... }

        public String getPassword() { ... }

        public void setPassword(String password) { ... }

        public List<String> getRoles() { ... }

        public void setRoles(List<String> roles) { ... }

    }
}
```

Tương đương với việc cấu hình các thuộc tính sau:

- `acme.enabled`
- `acme.remote-address`
- `acme.security.username`
- `acme.security.password`
- `acme.security.roles`

Sau đó, bạn cần sử dụng chú thích `@EnableConfigurationProperties` để chèn lớp thuộc tính vào lớp cấu hình.

```java
@Configuration
@EnableConfigurationProperties(AcmeProperties.class)
public class MyConfiguration {
}
```

## Quy tắc ràng buộc thuộc tính lỏng lẻo

Spring Boot có quy tắc ràng buộc tên thuộc tính linh hoạt.

Các khóa thuộc tính sau đây là tương đương:

| Thuộc tính                            | Ghi chú     |
| ----------------------------------- | -------- |
| `acme.my-project.person.first-name` | Phân cách bằng `-` |
| `acme.myProject.person.firstName`   | Tên kiểu lạc đà |
| `acme.my_project.person.first_name` | Phân cách bằng `_` |
| `ACME_MYPROJECT_PERSON_FIRSTNAME`   | Chữ in hoa |

## Chuyển đổi thuộc tính

Nếu bạn cần chuyển đổi kiểu dữ liệu, bạn có thể cung cấp một bean `ConversionService` (một bean có tên là `conversionService`) hoặc cấu hình thuộc tính tùy chỉnh (một bean `CustomEditorConfigurer`) hoặc chuyển đổi tùy chỉnh (các bean được chú thích bằng `@ConfigurationPropertiesBinding`).

### Chuyển đổi đơn vị thời gian

Spring sử dụng lớp `java.time.Duration` để đại diện cho thời gian, áp dụng các quy tắc sau:

- Một số long mặc định được coi là mili giây, trừ khi được chỉ định bằng `@DurationUnit`.
- Định dạng chuẩn ISO-8601 (được triển khai bởi [`java.time.Duration`](https://docs.oracle.com/javase/8/docs/api//java/time/Duration.html#parse-java.lang.CharSequence-)).
- Bạn cũng có thể sử dụng các đơn vị hỗ trợ sau:
  - `ns` - nanosecond (nanogisecond)
  - `us` - microsecond (microsecond)
  - `ms` - millisecond (mili giây)
  - `s` - second (giây)
  - `m` - minute (phút)
  - `h` - hour (giờ)
  - `d` - day (ngày)

Ví dụ:

```java
@ConfigurationProperties("app.system")
public class AppSystemProperties {

    @DurationUnit(ChronoUnit.SECONDS)
    private Duration sessionTimeout = Duration.ofSeconds(30);

    private Duration readTimeout = Duration.ofMillis(1000);

    public Duration getSessionTimeout() {
        return this.sessionTimeout;
    }

    public void setSessionTimeout(Duration sessionTimeout) {
        this.sessionTimeout = sessionTimeout;
    }

    public Duration getReadTimeout() {
        return this.readTimeout;
    }

    public void setReadTimeout(Duration readTimeout) {
        this.readTimeout = readTimeout;
    }

}
```

### Chuyển đổi kích thước dữ liệu

Spring sử dụng lớp `DataSize` để đại diện cho kích thước dữ liệu, áp dụng các quy tắc sau:

- Giá trị long (mặc định coi là byte).
- Bạn cũng có thể sử dụng các đơn vị hỗ trợ sau:
  - `B` - byte
  - `KB` - kilobyte
  - `MB` - megabyte
  - `GB` - gigabyte
  - `TB` - terabyte

Ví dụ:

```java
@ConfigurationProperties("app.io")
public class AppIoProperties {

    @DataSizeUnit(DataUnit.MEGABYTES)
    private DataSize bufferSize = DataSize.ofMegabytes(2);

    private DataSize sizeThreshold = DataSize.ofBytes(512);

    public DataSize getBufferSize() {
        return this.bufferSize;
    }

    public void setBufferSize(DataSize bufferSize) {
        this.bufferSize = bufferSize;
    }

    public DataSize getSizeThreshold() {
        return this.sizeThreshold;
    }

    public void setSizeThreshold(DataSize sizeThreshold) {
        this.sizeThreshold = sizeThreshold;
    }

}
```

## Kiểm tra thuộc tính

```java
@ConfigurationProperties(prefix="acme")
@Validated
public class AcmeProperties {

	@NotNull
	private InetAddress remoteAddress;

	@Valid
	private final Security security = new Security();

	// ... getters and setters

	public static class Security {

		@NotEmpty
		public String username;

		// ... getters and setters

	}

}
```

Bạn cũng có thể tạo một bean kiểm tra tùy chỉnh có tên là `configurationPropertiesValidator`. Phương thức nhận `@Bean` phải được khai báo là `static`.

## Mã nguồn ví dụ
