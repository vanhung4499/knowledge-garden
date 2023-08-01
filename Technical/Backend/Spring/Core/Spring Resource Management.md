---
title: Spring Resource Management
tags: [spring, java, backend]
categories: [spring, java, backend]
date created: 2023-07-26
date modified: 2023-07-26
---

# Quản lý tài nguyên trong Spring

> Phiên bản 6.0.3

## Giao diện Resource

So với cơ chế truy cập URL tương đối tiêu chuẩn, giao diện `org.springframework.core.io.Resource` trong Spring trừu tượng hóa cách truy cập tài nguyên cơ bản và cung cấp một cách tiếp cận tốt hơn.

```java
public interface Resource extends InputStreamSource {

    boolean exists();

    boolean isReadable();

    boolean isOpen();

    boolean isFile();

    URL getURL() throws IOException;

    URI getURI() throws IOException;

    File getFile() throws IOException;

    ReadableByteChannel readableChannel() throws IOException;

    long contentLength() throws IOException;

    long lastModified() throws IOException;

    Resource createRelative(String relativePath) throws IOException;

    String getFilename();

    String getDescription();
}
```

Như định nghĩa của giao diện `Resource`, nó mở rộng giao diện `InputStreamSource`. Các phương thức cốt lõi của `Resource` như sau:

- `getInputStream()` - Xác định và mở tài nguyên hiện tại, trả về `InputStream` của tài nguyên hiện tại. Mỗi lần gọi đều trả về một `InputStream` mới. Người gọi phải đảm bảo đóng luồng.
- `exists()` - Kiểm tra xem tài nguyên hiện tại có tồn tại thực sự hay không.
- `isOpen()` - Kiểm tra xem tài nguyên hiện tại có phải là một `InputStream` đã mở hay không. Nếu là true, `InputStream` không thể đọc nhiều lần và phải chỉ đọc một lần và đóng để tránh rò rỉ tài nguyên. Trả về false cho tất cả các triển khai tài nguyên thông thường, trừ `InputStreamResource`.
- `getDescription()` - Trả về mô tả của tài nguyên hiện tại. Mô tả tài nguyên được sử dụng để xuất thông báo lỗi khi xử lý tài nguyên gặp lỗi. Thông thường, mô tả tài nguyên là tên tệp được giới hạn đầy đủ hoặc URL thực tế của tài nguyên hiện tại.

Các giao diện tài nguyên Spring phổ biến:

| Loại         | Giao diện                                                  |
| ------------ | --------------------------------------------------------- |
| InputStream | `org.springframework.core.io.InputStreamSource`           |
| Tài nguyên chỉ đọc | `org.springframework.core.io.Resource`                    |
| Tài nguyên có thể ghi | `org.springframework.core.io.WritableResource`            |
| Tài nguyên mã hóa | `org.springframework.core.io.support.EncodedResource`     |
| Tài nguyên ngữ cảnh | `org.springframework.core.io.ContextResource`             |

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20221223155859.png)

## Cài đặt tài nguyên tích hợp sẵn

Spring bao gồm một số cài đặt tài nguyên tích hợp sẵn:

| Nguồn tài nguyên                                                                                                                                           | Tiền tố                       | Mô tả                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`UrlResource`](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#resources-implementations-urlresource)                       | `file:`、`https:`、`ftp:` v.v. | `UrlResource` đóng gói một đối tượng `java.net.URL`, **được sử dụng để truy cập bất kỳ đối tượng nào có thể truy cập qua URL**, chẳng hạn như tệp, mục tiêu HTTPS, mục tiêu FTP v.v. Tất cả các URL có thể được biểu diễn dưới dạng chuỗi chuẩn hóa, do đó có thể sử dụng tiền tố chuẩn hóa thích hợp để chỉ ra sự khác biệt giữa các loại URL. Điều này bao gồm: `file`: được sử dụng để truy cập đường dẫn hệ thống tệp; `https`: được sử dụng để truy cập tài nguyên qua giao thức HTTPS; `ftp`: được sử dụng để truy cập tài nguyên qua FTP v.v. |
| [`ClassPathResource`](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#resources-implementations-classpathresource)           | `classpath:`                 | `ClassPathResource` **tải tài nguyên từ đường dẫn lớp**. Nó sử dụng bộ tải lớp của luồng hiện tại, bộ tải lớp được chỉ định hoặc bất kỳ lớp nào được chỉ định để tải tài nguyên.                                                                                                                                                                                                                             |
| [`FileSystemResource`](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#resources-implementations-filesystemresource)         | `file:`                      | `FileSystemResource` **là cài đặt tài nguyên của `java.io.File`**. Nó cũng hỗ trợ `java.nio.file.Path` và áp dụng chuyển đổi chuỗi đường dẫn chuẩn của Spring. `FileSystemResource` hỗ trợ giải quyết thành tệp và URL.                                                                                                                                                                                |
| [`PathResource`](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#resources-implementations-pathresource)                     | Không có                     | `PathResource` là cài đặt tài nguyên của `java.nio.file.Path`.                                                                                                                                                                                                                                                                                                       |
| [`ServletContextResource`](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#resources-implementations-servletcontextresource) | Không có                     | `ServletContextResource` **là cài đặt tài nguyên của `ServletContext`**. Nó đại diện cho một đường dẫn tương đối trong thư mục gốc ứng dụng web tương ứng.                                                                                                                                                                                                                                                  |
| [`InputStreamResource`](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#resources-implementations-inputstreamresource)       | Không có                     | `InputStreamResource` **là cài đặt tài nguyên của `InputStream` được chỉ định**. Lưu ý: Nếu `InputStream` đã được mở, thì không thể đọc nhiều lần từ luồng đó.                                                                                                                                                                                                                                    |
| [`ByteArrayResource`](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#resources-implementations-bytearrayresource)           | Không có                     | `ByteArrayResource` là cài đặt tài nguyên của mảng byte được chỉ định. Nó tạo một `ByteArrayInputStream` cho mảng byte đã cho. |

# Giao diện ResourceLoader

Giao diện `ResourceLoader` được sử dụng để tải các đối tượng `Resource`. Định nghĩa của nó như sau:

```java
public interface ResourceLoader {

    Resource getResource(String location);

    ClassLoader getClassLoader();
}
```

Spring cung cấp các cài đặt chính của `ResourceLoader`:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20221223164745.png)

Trong Spring, tất cả các `ApplicationContext` đều triển khai giao diện `ResourceLoader`. Do đó, tất cả các `ApplicationContext` có thể sử dụng phương thức `getResource()` để lấy đối tượng `Resource`.

【Ví dụ】

```java
// Nếu không chỉ định tiền tố tài nguyên, Spring sẽ cố gắng trả về tài nguyên phù hợp
Resource template = ctx.getResource("some/resource/path/myTemplate.txt");
// Nếu chỉ định tiền tố classpath:, Spring sẽ bắt buộc sử dụng ClassPathResource
Resource template = ctx.getResource("classpath:some/resource/path/myTemplate.txt");
// Nếu chỉ định tiền tố file: hoặc http:, Spring sẽ bắt buộc sử dụng UrlResource
Resource template = ctx.getResource("file:///some/resource/path/myTemplate.txt");
Resource template = ctx.getResource("http://myhost.com/resource/path/myTemplate.txt");
```

Bảng dưới đây liệt kê chiến lược tải tài nguyên của Spring dựa trên các đường dẫn vị trí:

| Tiền tố       | Ví dụ                             | Mô tả                                 |
| ------------ | -------------------------------- | :----------------------------------- |
| `classpath:` | `classpath:com/myapp/config.xml` | Tải từ lớp đường dẫn                 |
| `file:`      | `file:///data/config.xml`        | Tải từ hệ thống tệp theo URL          |
| `http:`      | `http://myserver/logo.png`       | Tải từ URL                           |
| Không có      | `/data/config.xml`               | Được xác định bởi triển khai ApplicationContext |

## Giao diện ResourcePatternResolver

Giao diện `ResourcePatternResolver` là một sự mở rộng của giao diện `ResourceLoader` và được sử dụng để giải quyết các đối tượng `Resource` dựa trên mẫu vị trí.

```java
public interface ResourcePatternResolver extends ResourceLoader {

    String CLASSPATH_ALL_URL_PREFIX = "classpath*:";

    Resource[] getResources(String locationPattern) throws IOException;
}
```

`PathMatchingResourcePatternResolver` là một cài đặt độc lập có thể được sử dụng bên ngoài `ApplicationContext` và cũng có thể được sử dụng bởi `ResourceArrayPropertyEditor` để điền vào thuộc tính bean `Resource[]`. `PathMatchingResourcePatternResolver` có thể giải quyết một đường dẫn vị trí tài nguyên đã cho thành một hoặc nhiều đối tượng `Resource` phù hợp.

> Lưu ý: Mọi `ApplicationContext` mặc định trong Spring đều là một trường hợp của `PathMatchingResourcePatternResolver`, nó triển khai giao diện `ResourcePatternResolver`.

## Giao diện ResourceLoaderAware

Giao diện `ResourceLoaderAware` là một giao diện gọi lại đặc biệt được sử dụng để đánh dấu các đối tượng cung cấp tham chiếu `ResourceLoader`. Giao diện `ResourceLoaderAware` được định nghĩa như sau:

```java
public interface ResourceLoaderAware {
    void setResourceLoader(ResourceLoader resourceLoader);
}
```

Khi một lớp triển khai `ResourceLoaderAware` được triển khai trong một ứng dụng (như một bean được quản lý bởi Spring), nó sẽ được nhận dạng bởi ApplicationContext là một `ResourceLoaderAware` và sau đó, ApplicationContext sẽ gọi `setResourceLoader(ResourceLoader)` và cung cấp chính nó là đối số (lưu ý rằng tất cả các ApplicationContext trong Spring đều triển khai giao diện `ResourceLoader`).

Vì ApplicationContext là một `ResourceLoader`, bean cũng có thể triển khai giao diện `ApplicationContextAware` và trực tiếp sử dụng ApplicationContext được cung cấp để tải tài nguyên. Tuy nhiên, nó thường tốt hơn sử dụng giao diện `ResourceLoader` đặc biệt nếu bạn chỉ cần điều này. Mã sẽ chỉ kết nối với giao diện tải tài nguyên (có thể coi là một giao diện tiện ích) và không kết nối với toàn bộ giao diện ApplicationContext.

## Phụ thuộc tài nguyên

Nếu bean muốn xác định và cung cấp đường dẫn tài nguyên thông qua một quá trình động, thì bean có thể sử dụng giao diện `ResourceLoader` hoặc `ResourcePatternResolver` để tải tài nguyên. Ví dụ, hãy xem xét việc tải một mẫu nào đó, trong đó tài nguyên cần thiết phụ thuộc vào vai trò của người dùng. Nếu tài nguyên là tĩnh, việc loại bỏ hoàn toàn việc sử dụng giao diện `ResourceLoader` (hoặc `ResourcePatternResolver`) và cho phép bean tiết lộ các thuộc tính `Resource` mà nó cần và mong đợi được tiêm vào chúng là có ý nghĩa.

Lý do làm cho việc tiêm các thuộc tính này trở nên đơn giản là vì tất cả các ngữ cảnh ứng dụng đều đăng ký và sử dụng một `PropertyEditor` đặc biệt của JavaBeans, nó có thể chuyển đổi chuỗi đường dẫn `String` thành đối tượng `Resource`. Ví dụ, lớp MyBean dưới đây có một thuộc tính mẫu kiểu `Resource`.

【Ví dụ】

```xml
<bean id="myBean" class="example.MyBean">
    <property name="template" value="some/resource/path/myTemplate.txt"/>
</bean>
```

Lưu ý rằng đường dẫn tài nguyên mẫu được tham chiếu trong cấu hình không có tiền tố, vì ngữ cảnh ứng dụng chính nó sẽ được sử dụng làm `ResourceLoader`, và tài nguyên sẽ được tải dựa trên loại cụ thể của ngữ cảnh.

Nếu muốn bắt buộc sử dụng một loại tài nguyên cụ thể, bạn có thể sử dụng tiền tố. Hai ví dụ sau đây cho thấy cách bắt buộc sử dụng `ClassPathResource` và `UrlResource` (được sử dụng để truy cập tệp hệ thống tệp).

```xml
<property name="template" value="classpath:some/resource/path/myTemplate.txt">
<property name="template" value="file:///some/resource/path/myTemplate.txt"/>
```

Có thể tải tệp tài nguyên `myTemplate.txt` bằng cách sử dụng chú thích `@Value`, ví dụ:

```java
@Component
public class MyBean {

    private final Resource template;

    public MyBean(@Value("${template.path}") Resource template) {
        this.template = template;
    }

    // ...
}
```

`PropertyEditor` của Spring sẽ tải đối tượng `Resource` dựa trên chuỗi đường dẫn tệp và tiêm vào phương thức khởi tạo của MyBean.

Nếu muốn tải nhiều tệp tài nguyên, bạn có thể sử dụng tiền tố `classpath*:`. Ví dụ: `classpath*:/config/templates/*.txt`.

```java
@Component
public class MyBean {

    private final Resource[] templates;

    public MyBean(@Value("${templates.path}") Resource[] templates) {
        this.templates = templates;
    }

    // ...
}
```

## Ngữ cảnh ứng dụng và đường dẫn tài nguyên

### Xây dựng ngữ cảnh ứng dụng

Constructor của ngữ cảnh ứng dụng (cho một loại ngữ cảnh ứng dụng cụ thể) thường nhận chuỗi hoặc mảng chuỗi là đường dẫn tài nguyên, chẳng hạn như các tệp XML tạo thành định nghĩa ngữ cảnh.

【Ví dụ】

```java
ApplicationContext ctx = new ClassPathXmlApplicationContext("conf/appContext.xml");
ApplicationContext ctx = new FileSystemXmlApplicationContext("conf/appContext.xml");
ApplicationContext ctx = new FileSystemXmlApplicationContext("classpath:conf/appContext.xml");
ApplicationContext ctx = new ClassPathXmlApplicationContext(
                new String[] {"services.xml", "daos.xml"}, MessengerService.class);
```

### Xây dựng ngữ cảnh ứng dụng với ký tự đại diện

Các đường dẫn tài nguyên trong constructor của ApplicationContext có thể là một đường dẫn duy nhất (tương ứng một-đến-một với tài nguyên mục tiêu); hoặc có thể là một mẫu với ký tự đại diện - có thể chứa tiền tố classpath\*:, hoặc một tiền tố hoặc mẫu chính quy kiểu ant (sử dụng PathMatcher của Spring để khớp).

Ví dụ:

```java
ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath*:conf/appContext.xml");
```

Sử dụng tiền tố `classpath*` để lấy tất cả các tài nguyên khớp với tên tệp (thực tế là gọi phương thức ClassLoader.getResources(…)), sau đó xây dựng ngữ cảnh ứng dụng cuối cùng từ các tài nguyên đã tìm thấy.

Trong phần còn lại của đường dẫn, tiền tố `classpath*:` có thể kết hợp với PathMatcher, ví dụ: `classpath*:META-INF/*-beans.xml`.

## Câu hỏi

Các loại tài nguyên phổ biến trong cấu hình Spring là gì?

- Tài nguyên XML
- Tài nguyên Properties
- Tài nguyên YAML
