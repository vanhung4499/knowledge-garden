---
title: SpringBoot Fundamentals
tags: [spring, springboot, java, backend]
categories: [spring, springboot, java, backend]
date created: 2023-07-26
date modified: 20243-2071-26
---

# Nguyên lý cơ bản của Spring Boot

Spring Boot đã tự động cấu hình cho chúng ta, thật tiện lợi và nhanh chóng, nhưng tôi vẫn không hiểu rõ về nguyên lý khởi động bên trong nó. Lần này, chúng ta sẽ từng bước khám phá bí mật của Spring Boot và làm cho nó không còn bí ẩn nữa.

---

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

Từ đoạn mã trên, chúng ta có thể thấy rằng **Annotation (@SpringBootApplication) và phương thức (SpringApplication.run)** là những nổi bật nhất, vì vậy để khám phá bí mật của Spring Boot, chúng ta chỉ cần bắt đầu từ hai điểm này.

## Bí mật sau @SpringBootApplication

```kotlin
@Target(ElementType.TYPE)            // Phạm vi áp dụng của Annotation, trong đó TYPE được sử dụng để mô tả lớp, giao diện (bao gồm cả loại chú thích gói) hoặc khai báo enum
@Retention(RetentionPolicy.RUNTIME)  // Vòng đời của Annotation, lưu giữ trong tệp class (ba vòng đời)
@Documented                          // Cho biết chú thích này nên được ghi lại trong javadoc
@Inherited                           // Lớp con có thể kế thừa chú thích này
@SpringBootConfiguration             // Kế thừa từ Configuration, chỉ định rằng đây là một lớp chú thích
@EnableAutoConfiguration             // Kích hoạt tính năng chú thích của Spring Boot, một trong bốn công cụ mạnh mẽ của Spring Boot, được hỗ trợ bởi @import
@ComponentScan(excludeFilters = {    // Cài đặt quét đường dẫn (sử dụng cụ thể cần xác nhận)
        @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
        @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {
...
}
```

Mặc dù việc định nghĩa sử dụng nhiều Annotation đã được gắn kết thông tin gốc, nhưng thực tế chỉ có ba Annotation quan trọng:

**@Configuration** (@SpringBootConfiguration khi mở ra để xem, bạn sẽ thấy nó vẫn áp dụng @Configuration)  
**@EnableAutoConfiguration**  
**@ComponentScan**

Vì vậy, nếu chúng ta sử dụng lớp khởi động Spring Boot như sau, toàn bộ ứng dụng Spring Boot vẫn có thể tương đương với lớp khởi động trước đó:

```java
@Configuration
@EnableAutoConfiguration
@ComponentScan
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

Việc viết ba Annotation này mỗi lần khá mệt mỏi, vì vậy chúng ta sẽ viết một @SpringBootApplication để tiện lợi hơn. Tiếp theo, chúng ta sẽ giới thiệu từng Annotation này một cách riêng biệt.

## @Configuration

Chúng ta không xa lạ với @Configuration, nó là cách cấu hình của Spring IoC Container sử dụng JavaConfig. Cộng đồng Spring Boot khuyến nghị sử dụng cách cấu hình dựa trên JavaConfig, vì vậy khi chúng ta đánh dấu @Configuration trên lớp khởi động, nó thực sự là một lớp cấu hình của IoC Container.

Hãy xem một số ví dụ đơn giản để nhớ lại sự khác biệt giữa cách cấu hình XML và JavaConfig:

Mức độ biểu thị:  
Cách cấu hình dựa trên XML như sau:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd"
       default-lazy-init="true">
    <!-- Định nghĩa bean -->
</beans>
```

Còn cách cấu hình dựa trên JavaConfig như sau:

```java
@Configuration
public class MockConfiguration{
    // Định nghĩa bean
}
```

**Bất kỳ lớp Java nào được đánh dấu @Configuration đều là một lớp cấu hình JavaConfig.**

Đăng ký định nghĩa bean:  
Trong cách cấu hình dựa trên XML, chúng ta có:

```csharp
<bean id="mockService" class="..MockServiceImpl">
    ...
</bean>
```

Còn trong cách cấu hình dựa trên JavaConfig, chúng ta có:

```java
@Configuration
public class MockConfiguration{
    @Bean
    public MockService mockService(){
        return new MockServiceImpl();
    }
}
```

**Bất kỳ phương thức nào được đánh dấu @Bean, giá trị trả về của nó sẽ được đăng ký như một định nghĩa bean trong IoC Container của Spring, và tên phương thức sẽ mặc định là id của định nghĩa bean đó.**

Biểu diễn mối quan hệ dependency injection:  
Để biểu diễn mối quan hệ phụ thuộc giữa các bean trong cách cấu hình dựa trên XML, chúng ta thường có:

```jsx
<bean id="mockService" class="..MockServiceImpl">
    <propery name ="dependencyService" ref="dependencyService" />
</bean>

<bean id="dependencyService" class="DependencyServiceImpl"></bean>
```

Trong cách cấu hình dựa trên JavaConfig, chúng ta có:

```java
@Configuration
public class MockConfiguration{
    @Bean
    public MockService mockService(){
        return new MockServiceImpl(dependencyService());
    }

    @Bean
    public DependencyService dependencyService(){
        return new DependencyServiceImpl();
    }
}
```

**Nếu một định nghĩa bean phụ thuộc vào các bean khác, chúng ta chỉ cần gọi phương thức tạo bean phụ thuộc đó trong lớp JavaConfig tương ứng.**

## @ComponentScan

**@ComponentScan là một Annotation quan trọng trong Spring, nó tương ứng với phần tử `<context:component-scan>` trong cấu hình XML. Chức năng của @ComponentScan là tự động quét và tải các thành phần (ví dụ: @Component và @Repository) hoặc định nghĩa bean phù hợp, và cuối cùng tải các định nghĩa bean này vào IoC Container.**

Chúng ta có thể tùy chỉnh phạm vi quét chi tiết bằng cách sử dụng các thuộc tính như basePackages, nếu không chỉ định, Spring Boot sẽ mặc định quét từ gói chứa lớp chứa @ComponentScan.

> Lưu ý: Vì vậy, lớp khởi động của Spring Boot nên được đặt trong gói gốc, vì mặc định không chỉ định basePackages.

## @EnableAutoConfiguration

Annotation **@EnableAutoConfiguration** được cho là quan trọng nhất theo cảm nhận cá nhân của tôi, vì vậy nó được đặt ở cuối để giải thích. Mọi người có còn nhớ các Annotation bắt đầu bằng @Enable mà Spring Framework cung cấp không? Ví dụ: @EnableScheduling, @EnableCaching, @EnableMBeanExport và nhiều hơn nữa. Tư tưởng và phong cách hoạt động của @EnableAutoConfiguration thực sự tương tự với các Annotation này. Để tóm gọn, thông qua việc sử dụng hỗ trợ từ @Import, nó thu thập và đăng ký các định nghĩa bean liên quan đến các tình huống cụ thể.

**@EnableScheduling** sử dụng @Import để tải các định nghĩa bean liên quan đến framework lập lịch của Spring vào IoC Container.  
**@EnableMBeanExport** sử dụng @Import để tải các định nghĩa bean liên quan đến JMX vào IoC Container.  
Và **@EnableAutoConfiguration** cũng sử dụng @Import để tải tất cả các định nghĩa bean phù hợp với điều kiện tự động cấu hình vào IoC Container, chỉ đơn giản như vậy!

@EnableAutoConfiguration là một Annotation kết hợp, định nghĩa chính của nó như sau:

```java
@SuppressWarnings("deprecation")
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import(EnableAutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration {
    ...
}
```

Hai Annotation quan trọng:

**@AutoConfigurationPackage: Gói tự động cấu hình**

**@Import: Nhập các thành phần cấu hình tự động**

#### Annotation AutoConfigurationPackage:

```java
static class Registrar implements ImportBeanDefinitionRegistrar, DeterminableImports {

        @Override
        public void registerBeanDefinitions(AnnotationMetadata metadata,
                BeanDefinitionRegistry registry) {
            register(registry, new PackageImport(metadata).getPackageName());
        }
```

Thực tế, nó đăng ký một định nghĩa Bean.

`new PackageImport(metadata).getPackageName()` thực tế là trả về gói thành phần cùng cấp và con của lớp chương trình chính hiện tại.

Ví dụ trên, DemoApplication nằm cùng cấp với gói demo, nhưng lớp demo2 là cấp cha của DemoApplication và nằm cùng cấp với gói example.

Điều này có nghĩa là trong các Bean được tải khi DemoApplication khởi động, nó sẽ không tải demo2. Đây cũng là lý do tại sao chúng ta phải đặt DemoApplication ở cấp cao nhất của dự án.

#### Annotation Import(AutoConfigurationImportSelector.class):

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230726003902.png)

Có thể thấy rõ ràng rằng AutoConfigurationImportSelector kế thừa từ DeferredImportSelector kế thừa từ ImportSelector.

ImportSelector có một phương thức là selectImports.

```dart
@Override
    public String[] selectImports(AnnotationMetadata annotationMetadata) {
        if (!isEnabled(annotationMetadata)) {
            return NO_IMPORTS;
        }
        AutoConfigurationMetadata autoConfigurationMetadata = AutoConfigurationMetadataLoader
                .loadMetadata(this.beanClassLoader);
        AnnotationAttributes attributes = getAttributes(annotationMetadata);
        List<String> configurations = getCandidateConfigurations(annotationMetadata,
                attributes);
        configurations = removeDuplicates(configurations);
        Set<String> exclusions = getExclusions(annotationMetadata, attributes);
        checkExcludedClasses(configurations, exclusions);
        configurations.removeAll(exclusions);
        configurations = filter(configurations, autoConfigurationMetadata);
        fireAutoConfigurationImportEvents(configurations, exclusions);
        return StringUtils.toStringArray(configurations);
    }
```

Có thể thấy ở dòng thứ 9, nó thực sự là tải một tệp bên ngoài có đường dẫn public static final String FACTORIES_RESOURCE_LOCATION = "META-INF/spring.factories". Tệp bên ngoài này chứa nhiều lớp tự động cấu hình.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230726003925.png)

Trong đó, điều quan trọng nhất là `@Import(EnableAutoConfigurationImportSelector.class)`, thông qua `EnableAutoConfigurationImportSelector`, `@EnableAutoConfiguration` có thể giúp ứng dụng Spring Boot tải tất cả các cấu hình `@Configuration` phù hợp vào IoC Container hiện tại được tạo và sử dụng bởi Spring Boot. Giống như một "con bạch tuộc".

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230726004006.png)

### Nhân vật hậu trường của tự động cấu hình: SpringFactoriesLoader

Nhờ sự hỗ trợ của một công cụ trong Spring Framework gọi là SpringFactoriesLoader, @EnableAutoConfiguration mới có thể hoạt động tự động cấu hình một cách thông minh!

SpringFactoriesLoader là một phương pháp mở rộng riêng của Spring Framework, chức năng chính của nó là tải cấu hình từ tệp cấu hình được chỉ định META-INF/spring.factories.

```php
public abstract class SpringFactoriesLoader {
    //...
    public static <T> List<T> loadFactories(Class<T> factoryClass, ClassLoader classLoader) {
        ...
    }


    public static List<String> loadFactoryNames(Class<?> factoryClass, ClassLoader classLoader) {
        ....
    }
}
```

Khi được sử dụng cùng với **@EnableAutoConfiguration**, nó cung cấp chức năng tìm kiếm cấu hình, tức là sử dụng org.springframework.boot.autoconfigure.EnableAutoConfiguration làm khóa tìm kiếm để lấy một nhóm các lớp **@Configuration** tương ứng.

![img](https://upload-images.jianshu.io/upload_images/6430208-fcdfcb56828a015a?imageMogr2/auto-orient/strip%7CimageView2/2/w/1200/format/webp)

Hình trên là một đoạn mã được trích từ tệp cấu hình META-INF/spring.factories trong gói phụ thuộc autoconfigure của Spring Boot, nó giải thích rõ vấn đề.

Vì vậy, "hiệp sĩ ma thuật" tự động cấu hình của **@EnableAutoConfiguration** trở thành: **Tìm kiếm tất cả các tệp cấu hình META-INF/spring.factories trong classpath và sử dụng Java Reflection để khởi tạo các cấu hình IoC dưới dạng JavaConfig đã được đánh dấu @Configuration, sau đó tổng hợp chúng thành một và tải vào IoC Container.**
