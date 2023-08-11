---
title: SpringBoot JSON
tags: [spring, java, backend]
categories: [spring, java, backend]
date created: 2023-08-11
date modified: 2023-08-11
---

# Tích hợp Json trong Spring Boot

## Giới thiệu

### Thư viện Json được hỗ trợ bởi Spring Boot

Spring Boot hỗ trợ ba thư viện Json:

- Gson
- Jackson
- JSON-B

**Jackson là thư viện mặc định được Spring Boot khuyến nghị.**

Spring Boot cung cấp cấu hình tự động cho Jackson, Jackson là một phần của `spring-boot-starter-json`. Khi Jackson có trên classpath, nó sẽ tự động cấu hình bean ObjectMapper.

Spring Boot cung cấp cấu hình tự động cho Gson. Khi Gson có trên classpath, nó sẽ tự động cấu hình bean Gson. Cung cấp một số thuộc tính cấu hình `spring.gson.*` để tùy chỉnh cấu hình. Để có sự kiểm soát chi tiết hơn, bạn có thể sử dụng một hoặc nhiều bean `GsonBuilderCustomizer`.

Spring Boot cung cấp cấu hình tự động cho JSON-B. Khi API JSON-B có trên classpath, nó sẽ tự động cấu hình bean Jsonb. Apache Johnzon là một thư viện JSON-B được ưu tiên, nó cung cấp quản lý phụ thuộc.

### Serialize và Deserialize trong Spring Web

Các chú thích sau đây được cung cấp bởi `spring-web`.

#### `@ResponseBody`

Chú thích `@ResponseBody` được sử dụng để chuyển đổi đối tượng trả về từ phương thức của Controller thành định dạng tương ứng và ghi vào phần thân của HTTP Response. Thường được sử dụng trong trường hợp lấy dữ liệu bất đồng bộ. Thông thường, sau khi sử dụng `@RequestMapping`, giá trị trả về sẽ được giải mã thành đường dẫn chuyển hướng, nhưng khi sử dụng `@ResponseBody`, kết quả trả về sẽ không được giải mã thành đường dẫn chuyển hướng, mà được ghi trực tiếp vào phần thân của HTTP Response.

Ví dụ:

```java
@ResponseBody
@RequestMapping(name = "/getInfo", method = RequestMethod.GET)
public InfoDTO getInfo() {
	return new InfoDTO();
}
```

#### `@RequestBody`

Chú thích `@RequestBody` được sử dụng để đọc dữ liệu phần thân của HTTP Request, sử dụng `HttpMessageConverter` mặc định của hệ thống để phân tích cú pháp, sau đó ràng buộc dữ liệu tương ứng vào đối tượng trả về. Sau đó, dữ liệu trả về từ `HttpMessageConverter` sẽ được ràng buộc vào tham số của phương thức trong Controller.

Định dạng mã hóa dữ liệu phần thân của yêu cầu được xác định bởi phần tử `Content-Type` trong phần header.

Ví dụ:

```java
@RequestMapping(name = "/postInfo", method = RequestMethod.POST)
public void postInfo(@RequestBody InfoDTO infoDTO) {
    // ...
}
```

#### `@RestController`

Trước Spring 4:

Nếu muốn trả về một trang cụ thể, cần sử dụng chú thích `@Controller` kết hợp với trình phân giải view `InternalResourceViewResolver`.

Nếu muốn trả về JSON, XML hoặc nội dung mediaType tùy chỉnh đến trang, cần thêm chú thích `@ResponseBody` vào phương thức tương ứng.

Sau Spring 4, đã thêm chú thích `@RestController`:

Nó tương đương với `@Controller` + `@RequestBody`.

Nếu sử dụng chú thích `@RestController` trong Controller, các phương thức trong Controller sẽ không thể trả về trang jsp hoặc html, trình phân giải view cấu hình `InternalResourceViewResolver` sẽ không hoạt động và sẽ trả về nội dung trực tiếp.

## Định nghĩa Serialize và Deserialize Json cho một lớp cụ thể

Nếu bạn sử dụng Jackson để serialize và deserialize dữ liệu JSON, bạn có thể cần viết các lớp `JsonSerializer` và `JsonDeserializer` tùy chỉnh của riêng bạn. Thông thường, việc đăng ký các serializer tùy chỉnh với Jackson được thực hiện thông qua việc đăng ký các module, nhưng Spring Boot cung cấp một cách khác để đăng ký trực tiếp các Spring Bean bằng cách sử dụng chú thích `@JsonComponent`.

Bạn có thể sử dụng chú thích `@JsonComponent` trực tiếp trên lớp `JsonSerializer` hoặc `JsonDeserializer`. Bạn cũng có thể sử dụng nó trên lớp chứa serializer/deserializer như một lớp nội bộ, như ví dụ dưới đây:

```java
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import org.springframework.boot.jackson.JsonComponent;

@JsonComponent
public class Example {

    @JsonSerialize(using = Serializer.class)
    public static class Serializer extends JsonSerializer<SomeObject> {
        // ...
    }

    @JsonDeserialize(using = Deserializer.class)
    public static class Deserializer extends JsonDeserializer<SomeObject> {
        // ...
    }

}
```

Tất cả các bean `@JsonComponent` trong `ApplicationContext` sẽ tự động đăng ký với Jackson. Vì `@JsonComponent` được chú thích bằng `@Component`, nên các quy tắc quét thành phần thông thường được áp dụng.

Spring Boot cũng cung cấp các lớp cơ sở `JsonObjectSerializer` và `JsonObjectDeserializer` ([`JsonObjectSerializer`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/jackson/JsonObjectSerializer.html) và [`JsonObjectDeserializer`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/jackson/JsonObjectDeserializer.html)) để cung cấp các phương pháp thay thế hữu ích cho phiên bản chuẩn của Jackson khi serialize đối tượng. Để biết thêm thông tin chi tiết, hãy xem Javadoc của [`JsonObjectSerializer`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/jackson/JsonObjectSerializer.html) và [`JsonObjectDeserializer`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/jackson/JsonObjectDeserializer.html).

## @JsonTest

Sử dụng `@JsonTest` trong Spring Boot giúp dễ dàng kiểm thử serialize và deserialize.

`@JsonTest` tương đương với việc sử dụng các cấu hình tự động sau:

```
org.springframework.boot.autoconfigure.cache.CacheAutoConfiguration org.springframework.boot.autoconfigure.gson.GsonAutoConfiguration org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration org.springframework.boot.autoconfigure.jsonb.JsonbAutoConfiguration org.springframework.boot.test.autoconfigure.json.JsonTestersAutoConfiguration
```

Ví dụ sử dụng `@JsonTest`:

```java
@JsonTest
@RunWith(SpringRunner.class)
public class SimpleJsonTest {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private JacksonTester<InfoDTO> json;

    @Test
    public void testSerialize() throws Exception {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        InfoDTO infoDTO = new InfoDTO("JSON Test", "1.0.0", sdf.parse("2019-01-01 12:00:00"));
        JsonContent<InfoDTO> jsonContent = json.write(infoDTO);
        log.info("json content: {}", jsonContent.getJson());
        // Hoặc sử dụng kiểm tra dựa trên JSON path
        assertThat(jsonContent).hasJsonPathStringValue("@.appName");
        assertThat(jsonContent).extractingJsonPathStringValue("@.appName").isEqualTo("JSON Test");
        assertThat(jsonContent).hasJsonPathStringValue("@.version");
        assertThat(jsonContent).extractingJsonPathStringValue("@.version").isEqualTo("1.0.0");
        assertThat(jsonContent).hasJsonPathStringValue("@.date");
        assertThat(jsonContent).extractingJsonPathStringValue("@.date").isEqualTo("2019-01-01 12:00:00");
    }

    @Test
    public void testDeserialize() throws Exception {
        String content = "{\"appName\":\"JSON Test\",\"version\":\"1.0.0\",\"date\":\"2019-01-01\"}";
        InfoDTO actual = json.parseObject(content);
        assertThat(actual.getAppName()).isEqualTo("JSON Test");
        assertThat(actual.getVersion()).isEqualTo("1.0.0");
    }
}
```

## Cấu hình json trong Spring Boot

### Cấu hình cho Jackson

Khi sử dụng thư viện json của Jackson trong Spring Boot, bạn có thể sử dụng các thuộc tính cấu hình sau (tương ứng với lớp [`JacksonProperties`](https://github.com/spring-projects/spring-boot/tree/v2.1.1.RELEASE/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/jackson/JacksonProperties.java)):

```properties
spring.jackson.date-format= # Date format string or a fully-qualified date format class name. For instance, `yyyy-MM-dd HH:mm:ss`.
spring.jackson.default-property-inclusion= # Controls the inclusion of properties during serialization. Configured with one of the values in Jackson's JsonInclude.Include enumeration.
spring.jackson.deserialization.*= # Jackson on/off features that affect the way Java objects are deserialized.
spring.jackson.generator.*= # Jackson on/off features for generators.
spring.jackson.joda-date-time-format= # Joda date time format string. If not configured, "date-format" is used as a fallback if it is configured with a format string.
spring.jackson.locale= # Locale used for formatting.
spring.jackson.mapper.*= # Jackson general purpose on/off features.
spring.jackson.parser.*= # Jackson on/off features for parsers.
spring.jackson.property-naming-strategy= # One of the constants on Jackson's PropertyNamingStrategy. Can also be a fully-qualified class name of a PropertyNamingStrategy subclass.
spring.jackson.serialization.*= # Jackson on/off features that affect the way Java objects are serialized.
spring.jackson.time-zone= #  Time zone used when formatting dates. For instance, "America/Los_Angeles" or "GMT+10".
spring.jackson.visibility.*= # Jackson visibility thresholds that can be used to limit which methods (and fields) are auto-detected.

```

### Cấu hình cho Gson

Khi sử dụng thư viện json của Gson trong Spring Boot, bạn có thể sử dụng các thuộc tính cấu hình sau (tương ứng với lớp [`GsonProperties`](https://github.com/spring-projects/spring-boot/tree/v2.1.1.RELEASE/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/gson/GsonProperties.java)):

```properties
spring.gson.date-format= # Format to use when serializing Date objects.
spring.gson.disable-html-escaping= # Whether to disable the escaping of HTML characters such as '<', '>', etc.
spring.gson.disable-inner-class-serialization= # Whether to exclude inner classes during serialization.
spring.gson.enable-complex-map-key-serialization= # Whether to enable serialization of complex map keys (i.e. non-primitives).
spring.gson.exclude-fields-without-expose-annotation= # Whether to exclude all fields from consideration for serialization or deserialization that do not have the "Expose" annotation.
spring.gson.field-naming-policy= # Naming policy that should be applied to an object's field during serialization and deserialization.
spring.gson.generate-non-executable-json= # Whether to generate non executable JSON by prefixing the output with some special text.
spring.gson.lenient= # Whether to be lenient about parsing JSON that doesn't conform to RFC 4627.
spring.gson.long-serialization-policy= # Serialization policy for Long and long types.
spring.gson.pretty-printing= # Whether to output serialized JSON that fits in a page for pretty printing.
spring.gson.serialize-nulls= # Whether to serialize null fields.
```

## Sử dụng Fastjson trong Spring Boot

Nhiều lập trình viên Java trong nước thích sử dụng thư viện Fastjson của Alibaba làm thư viện json. Vậy làm thế nào để thay thế thư viện mặc định Jackson bằng Fastjson trong Spring Boot?

Bạn cần thực hiện các bước sau:

(1) Thêm dependency của Fastjson vào file pom.xml:

```xml
<dependency>
	<groupId>com.alibaba</groupId>
	<artifactId>fastjson</artifactId>
	<version>1.2.54</version>
</dependency>
```

(2) Triển khai interface WebMvcConfigurer và tùy chỉnh phương thức `configureMessageConverters`. Ví dụ như sau:

```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    /**
     * Tùy chỉnh message converter
     * @param converters
     */
    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        // Xóa message converter mặc định của Jackson
        converters.removeIf(converter -> converter instanceof MappingJackson2HttpMessageConverter);

        // Cấu hình FastJson
        FastJsonConfig config = new FastJsonConfig();
        config.setSerializerFeatures(SerializerFeature.QuoteFieldNames, SerializerFeature.WriteEnumUsingToString,
            SerializerFeature.WriteMapNullValue, SerializerFeature.WriteDateUseDateFormat,
            SerializerFeature.DisableCircularReferenceDetect);

        // Thêm FastJsonHttpMessageConverter
        FastJsonHttpMessageConverter fastJsonHttpMessageConverter = new FastJsonHttpMessageConverter();
        fastJsonHttpMessageConverter.setFastJsonConfig(config);
        List<MediaType> fastMediaTypes = new ArrayList<>();
        fastMediaTypes.add(MediaType.APPLICATION_JSON_UTF8);
        fastJsonHttpMessageConverter.setSupportedMediaTypes(fastMediaTypes);
        converters.add(fastJsonHttpMessageConverter);

        // Thêm StringHttpMessageConverter, giải quyết vấn đề mã hóa tiếng Việt
        StringHttpMessageConverter stringHttpMessageConverter = new StringHttpMessageConverter(Charset.forName("UTF-8"));
        converters.add(stringHttpMessageConverter);
    }

    // ...
}
```
