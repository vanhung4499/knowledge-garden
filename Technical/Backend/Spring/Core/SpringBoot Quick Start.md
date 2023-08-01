---
title: SpringBoot Quick Start
tags: [spring, springboot, java, backend]
categories: [spring, springboot, java, backend]
date created: 2023-07-26
date modified: 2023-07-26
---

# Hướng dẫn nhanh về SpringBoot

## Giới thiệu về Spring Boot

Spring Boot cho phép người dùng dễ dàng tạo ứng dụng Spring.

Mục tiêu của Spring Boot là:

- Cung cấp trải nghiệm khởi đầu nhanh và dễ dàng truy cập cho tất cả các nhà phát triển Spring.
- Sẵn sàng sử dụng ngay lập tức.
- Cung cấp một loạt các tính năng chung không chức năng (như dịch vụ nhúng, bảo mật, chỉ số, kiểm tra sức khỏe và cấu hình bên ngoài) .
- Hoàn toàn không cần tạo mã và không cần cấu hình XML.

## Yêu cầu hệ thống của Spring Boot

Công cụ xây dựng yêu cầu của Spring Boot:

| Công cụ xây dựng | Phiên bản               |
| :--------- | :-------------------- |
| Maven      | 3.5+                  |
| Gradle     | 6.8.x, 6.9.x, và 7.x |

Spring Boot hỗ trợ các máy chủ Servlet sau:

| Tên         | Phiên bản Servlet |
| :----------- | :-------------- |
| Tomcat 9.0   | 4.0             |
| Jetty 9.4    | 3.1             |
| Jetty 10.0   | 4.0             |
| Undertow 2.0 | 4.0             |

## Triển khai dự án Spring Boot đầu tiên

> Phần này sẽ hướng dẫn bạn phát triển một ứng dụng web nhỏ "Hello World!" để hiển thị một số tính năng quan trọng của Spring Boot. Chúng tôi sử dụng Maven để xây dựng dự án này vì hầu hết các IDE hỗ trợ Maven.

### Kiểm tra môi trường

Dự án Spring Boot phụ thuộc vào môi trường Java và Maven, vì vậy trước khi bắt đầu, hãy kiểm tra môi trường của bạn.

Kiểm tra xem Java đã được cài đặt trên máy tính của bạn chưa:

```shell
$ java -version
java version "1.8.0_102"
Java(TM) SE Runtime Environment (build 1.8.0_102-b14)
Java HotSpot(TM) 64-Bit Server VM (build 25.102-b14, mixed mode)
```

Kiểm tra xem Maven đã được cài đặt trên máy tính của bạn chưa:

```shell
$ mvn -v
Apache Maven 3.5.4 (1edded0938998edf8bf061f1ceb3cfdeccf443fe; 2018-06-17T14:33:14-04:00)
Maven home: /usr/local/Cellar/maven/3.3.9/libexec
Java version: 1.8.0_102, vendor: Oracle Corporation
```

### Tạo file pom.xml

Chúng ta cần bắt đầu bằng việc tạo file pom.xml của Maven. pom.xml là tệp cấu hình Maven để xây dựng dự án.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>myproject</artifactId>
    <version>0.0.1-SNAPSHOT</version>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.6.1</version>
    </parent>

    <!-- Các dòng bổ sung sẽ được thêm vào đây... -->

</project>
```

Bạn có thể kiểm tra nó bằng cách chạy lệnh `mvn package`.

### Thêm các phụ thuộc

Spring Boot cung cấp nhiều bộ khởi động (Starters) để đáp ứng các kịch bản sử dụng khác nhau. Người dùng có thể thêm các tệp jar vào classpath. Trong ví dụ của chúng ta, chúng ta sử dụng spring-boot-starter-parent trong phần parent của POM. spring-boot-starter-parent là một bộ khởi động đặc biệt, cung cấp các giá trị mặc định hữu ích cho Maven. Nó cũng cung cấp quản lý phiên bản cho các phụ thuộc, cho phép người dùng không cần chỉ định phiên bản một cách rõ ràng khi sử dụng chúng.

Các bộ khởi động khác cung cấp các tính năng cho các kịch bản sử dụng khác nhau. Ví dụ, nếu chúng ta muốn phát triển một ứng dụng web, chúng ta có thể thêm phụ thuộc spring-boot-starter-web. Trước khi làm điều đó, chúng ta có thể kiểm tra các phụ thuộc Maven hiện có bằng cách chạy lệnh sau:

```shell
$ mvn dependency:tree

[INFO] com.example:myproject:jar:0.0.1-SNAPSHOT
```

Lệnh mvn dependency:tree in ra cấu trúc cây các phụ thuộc của dự án. Chúng ta có thể thấy rằng spring-boot-starter-parent không cung cấp bất kỳ phụ thuộc nào. Để thêm các phụ thuộc cần thiết, chúng ta cần chỉnh sửa file pom.xml và thêm phụ thuộc spring-boot-starter-web vào phần `<dependencies>`:

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

### Viết mã

Để chạy ứng dụng, chúng ta cần tạo một lớp khởi động. Mặc định, Maven sẽ biên dịch mã nguồn từ `src/main/java`, vì vậy bạn cần tạo cấu trúc thư mục đó và thêm một tệp có tên `src/main/java/MyApplication.java` với nội dung sau:

```java
@RestController
@EnableAutoConfiguration
public class MyApplication {

    @RequestMapping("/")
    String home() {
        return "Hello World!";
    }

    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }

}
```

Giải thích:

- Annotation `@RestController` cho biết lớp này được sử dụng để xử lý các yêu cầu Rest.
- Annotation `@RequestMapping` cung cấp thông tin về "định tuyến". Nó cho biết rằng bất kỳ yêu cầu HTTP nào có đường dẫn `/` đều phải được ánh xạ vào phương thức `home`. Annotation `@RestController` cho biết rằng chuỗi kết quả sẽ được trả về trực tiếp cho người gọi.
- Annotation `@EnableAutoConfiguration` cho biết rằng Spring Boot sẽ tự động cấu hình dựa trên các phụ thuộc bạn đã thêm.

Phần `main` của Spring Boot gọi phương thức `run` của `SpringApplication` để khởi động ứng dụng. `SpringApplication` sẽ khởi động ứng dụng của chúng ta, khởi động Spring và sau đó khởi động máy chủ web Tomcat được cấu hình tự động. Chúng ta cần truyền `MyApplication.class` làm tham số cho phương thức `run` để cho biết đây là lớp khởi động. Chúng ta cũng truyền mảng `args` để tiếp tục truyền các tham số dòng lệnh nếu có.

### Chạy ví dụ

Bây giờ, ứng dụng của bạn nên hoạt động. Vì bạn đã sử dụng spring-boot-starter-parent trong POM, bạn có một mục tiêu chạy hữu ích để khởi động ứng dụng. Từ thư mục gốc của dự án, gõ lệnh `mvn spring-boot:run` để khởi động ứng dụng. Bạn sẽ thấy đầu ra tương tự như sau:

```shell
$ mvn spring-boot:run

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::  (v2.6.1)
....... . . .
....... . . . (log output here)
....... . . .
........ Started MyApplication in 2.222 seconds (JVM running for 6.514)
```

Nếu bạn mở trình duyệt web và truy cập vào địa chỉ localhost:8080, bạn sẽ thấy đầu ra sau:

```
Hello World!
```

Để thoát ứng dụng, hãy nhấn `ctrl-c`.

### Tạo file jar thực thi

Để tạo một file jar thực thi, chúng ta cần thêm spring-boot-maven-plugin vào file pom.xml của chúng ta. Để làm điều này, hãy chèn đoạn mã sau vào phần dependencies:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

Lưu file pom.xml và chạy lệnh mvn package từ dòng lệnh, như sau:

```shell
$ mvn package

[INFO] Scanning for projects...
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] Building myproject 0.0.1-SNAPSHOT
[INFO] ------------------------------------------------------------------------
[INFO] .... ..
[INFO] --- maven-jar-plugin:2.4:jar (default-jar) @ myproject ---
[INFO] Building jar: /Users/developer/example/spring-boot-example/target/myproject-0.0.1-SNAPSHOT.jar
[INFO]
[INFO] --- spring-boot-maven-plugin:2.6.1:repackage (default) @ myproject ---
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

Nếu bạn kiểm tra thư mục target, bạn sẽ thấy file `myproject-0.0.1-SNAPSHOT.jar`. Kích thước của file này khoảng 10 MB. Nếu bạn muốn xem bên trong, bạn có thể sử dụng lệnh jar tvf, như sau:

```shell
$ jar tvf target/myproject-0.0.1-SNAPSHOT.jar
```

Bạn cũng nên thấy một file nhỏ hơn có tên `myproject-0.0.1-SNAPSHOT.jar.original` trong thư mục target. Đây là file jar gốc được Maven tạo ra trước khi Spring Boot tái đóng gói.

Để chạy ứng dụng này, hãy sử dụng lệnh java -jar, như sau:

```
$ java -jar target/myproject-0.0.1-SNAPSHOT.jar

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::  (v2.6.1)
....... . . .
....... . . . (log output here)
....... . . .
........ Started MyApplication in 2.536 seconds (JVM running for 2.864)
```

Giống như trước đây, để thoát khỏi ứng dụng, hãy nhấn `ctrl-c`.

## Tạo dự án Spring Boot bằng SPRING INITIALIZR

### Tạo dự án

Tạo dự án cơ bản bằng công cụ `SPRING INITIALIZR`

1. Truy cập: `http://start.spring.io/`
2. Chọn công cụ xây dựng `Maven Project`, phiên bản Spring Boot `1.5.10` và một số thông tin cơ bản về dự án, có thể tham khảo hình ảnh dưới đây:

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/start.spring.io.png)

3. Nhấp vào `Generate Project` để tải xuống tệp nén dự án
4. Giải nén tệp nén, trong đó đã có một dự án hoàn chỉnh.

Nếu bạn sử dụng Intellij làm IDE, bạn có thể sử dụng SPRING INITIALIZR trực tiếp, tham khảo hình ảnh dưới đây:

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/intellij-spring-initializr.gif)

### Giải thích về dự án

**Các tệp quan trọng**

- Lớp `Chapter1Application` trong đường dẫn `src/main/java` là điểm vào của chương trình.
- Tệp `application.properties` trong đường dẫn `src/main/resources` là tệp cấu hình của dự án.
- Lớp `Chapter01ApplicationTests` trong đường dẫn `src/test/java` là điểm vào của việc kiểm thử chương trình.

**pom.xml**

Trong tệp pom.xml, phần tử parent được chỉ định như sau, cho biết dự án này kế thừa cấu hình Maven của `spring-boot-starter-parent` (chủ yếu là chỉ định phiên bản các phụ thuộc và plugin phổ biến).

```xml
<parent>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-starter-parent</artifactId>
 <version>1.5.10.RELEASE</version>
 <relativePath/> <!-- lookup parent from repository -->
</parent>
```

Ngoài ra, tệp pom.xml mặc định có hai phụ thuộc và một plugin.

```xml
<dependencies>
 <dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
 </dependency>

 <dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
 </dependency>
</dependencies>

<build>
 <plugins>
  <plugin>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-maven-plugin</artifactId>
  </plugin>
 </plugins>
</build>
```

- `spring-boot-starter-web`: Module cốt lõi, bao gồm hỗ trợ tự động cấu hình, ghi nhật ký và YAML.
- `spring-boot-starter-test`: Module kiểm thử, bao gồm JUnit, Hamcrest, Mockito.
- `spring-boot-maven-plugin`: Plugin Spring Boot, cung cấp một loạt các hoạt động Maven liên quan đến Spring Boot.
  - `spring-boot:build-info`: Tạo tệp thông tin xây dựng build-info.properties được sử dụng bởi Actuator.
  - `spring-boot:repackage`: Mục tiêu mặc định. Đóng gói lại file jar/war có thể chạy được sau khi thực hiện `mvn package`, đồng thời giữ lại file jar/war được tạo bởi `mvn package` với đuôi .origin.
  - `spring-boot:run`: Chạy ứng dụng Spring Boot.
  - `spring-boot:start`: Quản lý vòng đời ứng dụng Spring Boot trong giai đoạn `mvn integration-test`.
  - `spring-boot:stop`: Quản lý vòng đời ứng dụng Spring Boot trong giai đoạn `mvn integration-test`.

### Viết dịch vụ REST

- Tạo một `package`, đặt tên là `io.github.zp.springboot.chapter1.web` (thay đổi tên theo dự án của bạn)
- Tạo một lớp `HelloController` với nội dung như sau:

```java
@RestController
public class HelloController {

    @RequestMapping("/hello")
    public String index() {
        return "Hello World";
    }

}
```

- Khởi động chương trình chính `XXXApplication`, mở trình duyệt và truy cập vào `http://localhost:8080/hello`, bạn sẽ thấy trang web hiển thị `Hello World`.

### Viết các ca kiểm thử đơn vị

Trong lớp `XXXApplicationTests`, viết một ca kiểm thử đơn giản để mô phỏng yêu cầu HTTP, như sau:

```java
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = MockServletContext.class)
@WebAppConfiguration
public class SpringBootHelloWorldApplicationTest {

    private MockMvc mvc;

    @Before
    public void setUp() {
        mvc = MockMvcBuilders.standaloneSetup(new HelloController()).build();
    }

    @Test
    public void getHello() throws Exception {
        mvc.perform(MockMvcRequestBuilders.get("/hello").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(equalTo("Hello World")));
    }

}
```

Sử dụng `MockServletContext` để xây dựng một `WebApplicationContext` trống, điều này cho phép chúng ta tạo và chuyển `HelloController` vào hàm `MockMvcBuilders.standaloneSetup()` trong hàm `@Before`.

- Lưu ý import các nội dung sau để sử dụng các hàm `status()`, `content()`, `equalTo()`:

```java
import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
```

Với điều này, chúng ta đã hoàn thành mục tiêu, xây dựng một dự án Spring Boot trống bằng Maven, sau đó sử dụng module web để xử lý yêu cầu đơn giản.

### Mã nguồn ví dụ
