---
title: Facade Pattern Practice
tags:
  - design-pattern
categories: 
date created: 2024-03-29
date modified: 2024-03-30
---

# Facade Pattern Practice: Phát triển một middleware dựa trên Spring Boot, xử lý Api Whitelist"

## 1. Giới thiệu

**Những gì bạn cảm nhận được dễ dàng, nhất định có người đang chịu đựng điều không dễ dàng của bạn.**

Câu này càng giống như mô tả về cuộc sống, với hàng tá gian nan và thử thách, luôn có người sẵn sàng chở che cho bạn dưới mái nhà che mưa và an toàn tránh gió. Trong nhóm phát triển phần mềm cũng vậy, có những người chỉ đảm nhận các cuộc gọi đơn giản trong CRUD, sử dụng các dịch vụ và lõi mà các lập trình viên cao cấp trong nhóm đã phát triển. Đối với các bạn mới bắt đầu trong ngành lập trình, việc này cũng là một cách tốt để rèn luyện, nhưng khi thời gian phát triển kéo dài, việc chỉ làm những công việc như vậy trở nên khó để phát triển, bạn cũng muốn cố gắng làm những công việc đòi hỏi khó khăn hơn, nhằm tăng cường khả năng kỹ thuật cá nhân.

**Không có ngôn ngữ lập trình tốt nhất, ngôn ngữ chỉ là công cụ.**

Khi bạn đã làm lập trình một thời gian, bạn sẽ không quan tâm đặc biệt đến ngôn ngữ sử dụng, mà là phục vụ dịch vụ mục tiêu gì, sử dụng khả năng thiết kế tốt nhất, tức là sự khôn ngoan trong lập trình, để tạo ra dịch vụ hoàn hảo nhất. Đây cũng là giá trị của các nhà lập trình!

**Thiết kế so với phản thiết kế và thiết kế chuyển tiếp**

Mẫu thiết kế giải quyết vấn đề không hợp lý, không dễ mở rộng, không dễ bảo trì trong chương trình, cũng là vũ khí tiện lợi để loại bỏ hầu hết các câu lệnh `if else`, trong các framework phổ biến chúng ta thường sử dụng nhiều mẫu thiết kế để xây dựng các thành phần, điều này cũng giúp cho việc nâng cấp framework và mở rộng chức năng trở nên dễ dàng hơn. Tuy nhiên! Nếu không thiết kế một cách hợp lý và lạm dụng mẫu thiết kế, sẽ làm cho toàn bộ quá trình lập trình trở nên phức tạp và khó bảo trì hơn, cũng là những gì chúng ta thường gọi là: "phản thiết kế", "thiết kế chuyển tiếp". Và khả năng thiết kế này cũng là kinh nghiệm thu được từ các dự án thực hành, không ngừng cải tiến, tối ưu hóa và tìm ra cách hợp lý nhất, phù hợp với quy mô dịch vụ hiện tại.

## Môi trường phát triển

1. JDK 1.8
2. Idea + Maven
3. Code: [vanhung4499/practical-java-design](https://github.com/vanhung4499/practical-java-design)  

| Dự án             | Mô tả                                                                              |
| ----------------- | ---------------------------------------------------------------------------------- |
| demo-design-10-00 | Dự án mô phỏng kịch bản: Mô phỏng một dự án Spring Boot cung cấp dịch vụ giao diện |
| demo-design-10-01 | Sử dụng một lượng code lớn để triển khai yêu cầu nghiệp vụ                         |
| demo-design-10-02 | Phát triển một middleware dựa trên mẫu thiết kế, đóng gói logic hạt nhân chung     |

## Giới thiệu về Facade Pattern

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240329173100.png)

Facade Pattern, còn được gọi là mẫu thiết kế Cổng thông tin, chủ yếu giải quyết vấn đề giảm độ phức tạp của việc kết hợp các giao diện logic của người gọi. Điều này tạo ra một lớp trung gian giữa người gọi và bên cung cấp giao diện thực tế, dùng để đóng gói logic và cung cấp Api giao diện. Đôi khi Facade Pattern cũng được sử dụng trong lớp middleware, để đóng gói logic phức tạp và chung trong dịch vụ, giúp người gọi chỉ cần quan tâm đến việc phát triển kinh doanh.

**Mẫu thiết kế như vậy cũng thường xuất hiện trong các tính năng sản phẩm mà chúng ta thấy hàng ngày**, giống như vài năm trước khi đăng ký một trang web thường phải nhập nhiều thông tin, bao gồm: Họ tên, biệt danh, số điện thoại, email, địa chỉ, tình trạng hôn nhân và nhiều hơn nữa. Tuy nhiên, hiện nay khi đăng ký thành viên trên một trang web chỉ cần một bước duy nhất, bất kể là sử dụng số điện thoại di động hay Google cũng cung cấp dịch vụ đăng nhập như vậy. Đối với việc phát triển ứng dụng máy chủ, trước đây đã cung cấp một loạt các giao diện, nhưng bây giờ khi đăng ký không cần các thông tin đó, máy chủ sẽ cần đóng gói các giao diện, khi người dùng gọi đăng ký, máy chủ sẽ lấy thông tin người dùng tương ứng (từ các kênh khác nhau), nếu không thể lấy được, máy chủ sẽ yêu cầu người dùng điền thông tin sau (chiến lược tiếp thị để khuyến khích người dùng hoàn thành thông tin để nhận phần thưởng), từ đó tăng lượng đăng ký và tính sôi nổi của người dùng.

## Mô phỏng kịch bản tình huống

Trong ví dụ này, chúng ta mô phỏng một tình huống trong đó tất cả các dịch vụ đều được thêm vào whitelist.

Trên con đường phát triển và mở rộng dự án, mỗi lần phát hành cần phải được kiểm tra và phần kiểm tra này thường được thực hiện bằng cách mở hoặc cắt một phần của whitelist. Vì vậy, nếu mỗi giao diện đều thêm logic như vậy, điều đó sẽ rất phiền toái và khó bảo trì. Ngoài ra, đây là một loại yêu cầu chung có logic chung, rất thích hợp để phát triển thành một thành phần, từ đó quản lý dịch vụ và giúp nhà phát triển tập trung hơn vào việc phát triển chức năng kinh doanh.

Thường thì việc sử dụng Facade Pattern thường được sử dụng trong việc đóng gói và đồng bộ nhiều giao diện phức tạp hoặc để cung cấp dịch vụ một cách thống nhất ra ngoài. Cách sử dụng này cũng tương đối đơn giản và thường được sử dụng nhất trong việc phát triển kinh doanh hàng ngày của chúng ta. Trong ví dụ này, chúng tôi đặt phương pháp thiết kế này ở tầng middleware để làm cho dịch vụ có thể được kiểm soát một cách thống nhất.

### Dự án mô phỏng kịch bản

```shell
design-demo-10-00
├── pom.xml
└── src
    └── main
        ├── java
        │   └── com
        │       └── hnv99
        │           └── design
        │               ├── HelloWorldApplication.java
        │               ├── domain
        │               │   └── UserInfo.java
        │               └── web
        │                   └── HelloWorldController.java
        └── resources
            └── application.yml

```

- Đây là một dự án `SpringBoot` đơn giản, cung cấp một giao diện `HelloWorld` cho phép truy vấn thông tin người dùng `HelloWorldController.queryUserInfo`, chuẩn bị cho việc mở rộng giao diện này để thêm bộ lọc whitelist trong tương lai.

### Mô tả ngắn gọn dự án

#### Định nghĩa giao diện truy vấn cơ bản

```java
@RestController  
public class HelloWorldController {  
  
    @Value("${server.port}")  
    private int port;  
  
    /**  
     * @DoDoor Annotation tùy chỉnh  
     * key: Thuộc tính cần lấy giá trị từ tham số đầu vào, nếu là một đối tượng thì lấy giá trị từ đối tượng đó, nếu là một giá trị đơn thì sử dụng trực tiếp     * returnJson: Giá trị trả về dự định khi bị chặn, là một đối tượng Json     *     * http://localhost:8080/api/queryUserInfo?userId=1001     * http://localhost:8080/api/queryUserInfo?userId=hung     */    @DoDoor(key = "userId", returnJson = "{\"code\":\"1111\",\"info\":\"Người dùng không nằm trong whitelist, bị chặn truy cập!\"}")  
    @GetMapping(path = "/api/queryUserInfo")  
    public UserInfo queryUserInfo(@RequestParam String userId) {  
        return new UserInfo("Error:" + userId, 19, "Thu Duc, HCMC, Vietnam");  
    }  
}
```

- Ở đây, chúng tôi cung cấp một dịch vụ truy vấn cơ bản, thông qua tham số đầu vào `userId`, để truy vấn thông tin người dùng. Tiếp theo, chúng tôi sẽ mở rộng whitelist ở đây, chỉ có người dùng được chỉ định mới có thể truy vấn, các người dùng khác không thể truy vấn được.

#### Thiết lập lớp khởi chạy Application

```java
@SpringBootApplication
@Configuration
public class HelloWorldApplication {

    public static void main(String[] args) {
        SpringApplication.run(HelloWorldApplication.class, args);
    }

}
```

- Đây là lớp khởi chạy thông thường của `SpringBoot`. Cần thêm một chú thích cấu hình `@Configuration` để có thể đọc cấu hình whitelist sau này.

## Triển khai code hàng loạt

Trong nhiều trường hợp, cách đơn giản nhất để xử lý tình huống như vậy là chỉnh sửa code nguồn trực tiếp.

Thêm các khối `if` lặp lại gần như là cách nhanh nhất và cũng là cách chậm nhất để thực hiện yêu cầu. **Nhanh** ở đây là vì việc sửa đổi nội dung hiện tại nhanh chóng, **chậm** là nếu có hàng trăm loại nội dung tương tự cần phải sửa đổi và mở rộng, việc bảo trì sẽ trở nên chậm chạp hơn.

### Cấu trúc dự án

```java
design-demo-10-01
├── pom.xml
└── src
    └── main
        └── java
            └── com
                └── hnv99
                    └── design
                        └── HelloWorldController.java
```

- Triển khai trên là một ví dụ về một lớp giao diện API, trong đó có tính năng whitelist được thêm vào, nhưng có nhiều giao diện tương tự như vậy cần phải được chỉnh sửa, đó là lý do quan trọng tại sao không nên sử dụng cách tiếp cận này.

### Triển khai code

```java
public class HelloWorldController {  
  
    public UserInfo queryUserInfo(@RequestParam String userId) {  
  
        // Xây dựng whitelist  
        List<String> userList = new ArrayList<String>();  
        userList.add("1001");  
        userList.add("aaaa");  
        userList.add("ccc");  
        if (!userList.contains(userId)) {  
            return new UserInfo("1111", "Người dùng không nằm trong whitelist và bị chặn!");  
        }  
        return new UserInfo("Error:" + userId, 19, "Thu Duc, HCMC, Vietnam");  
    }  
}
```

- Trong đoạn code này, code của whitelist chiếm một phần lớn, nhưng đây không phải là logic mà là vì chúng ta cần thực hiện kiểm tra trước khi phát hành.
- Nếu bạn thường xuyên làm việc với yêu cầu như vậy hàng ngày, bạn có thể tối ưu hóa cách tiếp cận của mình theo mẫu thiết kế này để làm cho việc mở rộng và loại bỏ sau này dễ dàng hơn.

## Tái cấu trúc theo Facade Pattern

Tiếp theo là việc sử dụng facade pattern để tối ưu code, cũng có thể gọi là một cách nhỏ để tái cấu trúc code.

Trong lần tái cấu trúc này, điểm trọng yếu là sử dụng facade pattern, kết hợp với cách phát triển trung gian tùy chỉnh middleware trong SpringBoot, để xử lý thống nhất tất cả các điểm cần whitelist.

Trong các triển khai tiếp theo, các kiến thức sau sẽ được đề cập:

1. Cách phát triển middleware trung gian tùy chỉnh trong SpringBoot.
2. Lập trình hướng khía cạnh AOP và sử dụng annotation tùy chỉnh.
3. Truyền thông tin cấu hình tùy chỉnh từ bên ngoài, SpringBoot và Spring khác nhau trong việc lấy cấu hình whitelist.

### Cấu trúc dự án

```java
design-demo-10-02
├── pom.xml
└── src
    └── main
        ├── java
        │   └── com
        │       └── hnv99
        │           └── design
        │               └── door
        │                   ├── DoJointPoint.java
        │                   ├── annotation
        │                   │   └── DoDoor.java
        │                   └── config
        │                       ├── StarterAutoConfigure.java
        │                       ├── StarterService.java
        │                       └── StarterServiceProperties.java
        └── resources
            └── META-INF
                └── spring.factories
```

**Cấu trúc mô hình của facade pattern**

![Cấu trúc mô hình của facade pattern](https://raw.githubusercontent.com/vanhung4499/images/master/snap/itstack-demo-design-10-03.png)

- Trên đây là cách triển khai middleware của facade pattern, bên phải là để lấy cấu hình từ tệp cấu hình, bên trái là xử lý khía cạnh.
- Facade pattern có thể là bao bọc các giao diện để cung cấp giao diện dịch vụ hoặc bao bọc logic để cung cấp khả năng phục vụ giao diện thông qua annotation tùy chỉnh.

### Triển khai code

#### Lớp cấu hình dịch vụ

```java 
public class StarterService {

    private String userStr;

    public StarterService(String userStr) {
        this.userStr = userStr;
    }

    public String[] split(String separatorChar) {
        return StringUtils.split(this.userStr, separatorChar);
    }

}
```     

- Nội dung của lớp này khá đơn giản chỉ là để lấy thông tin cấu hình.

#### Định nghĩa chú thích lớp cấu hình

```java 
@ConfigurationProperties("practical.door")  
public class StarterServiceProperties {  
  
    private String userStr;  
  
    public String getUserStr() {  
        return userStr;  
    }  
    public void setUserStr(String userStr) {  
        this.userStr = userStr;  
    }  
}
```     

- Được sử dụng để định nghĩa thông tin cấu hình `practical.door` sẽ được thêm vào trong `application.yml` sau này.

#### Lấy thông tin cấu hình tùy chỉnh

```java
@Configuration  
@ConditionalOnClass(StarterService.class)  
@EnableConfigurationProperties(StarterServiceProperties.class)  
public class StarterAutoConfigure {  
  
    @Autowired  
    private StarterServiceProperties properties;  
  
    @Bean  
    @ConditionalOnMissingBean    @ConditionalOnProperty(prefix = "practical.door", value = "enabled", havingValue = "true")  
    StarterService starterService() {  
        return new StarterService(properties.getUserStr());  
    }  
}
```     

- Đoạn code trên là về việc lấy thông tin cấu hình, chủ yếu là về định nghĩa các chú thích như `@Configuration`, `@ConditionalOnClass`, `@EnableConfigurationProperties`, phần này chủ yếu là kết hợp với SpringBoot.

#### Định nghĩa AOP Annotation

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface DoDoor {

    String key() default "";

    String returnJson() default "";

}
```       

- Đây là định nghĩa của chú thích khía cạnh cho mẫu thiết kế facade. Sau này, chúng ta sẽ thêm chú thích này vào các phương thức cần mở rộng whitelist.
- Ở đây cung cấp hai đối số đầu vào, **key**: lấy một trường nhất định như ID người dùng, **returnJson**: xác định nội dung cụ thể sẽ được trả về sau khi chặn whitelist.

#### Logic AOP whitelist

```java
@Aspect
@Component
public class DoJoinPoint {

    private Logger logger = LoggerFactory.getLogger(DoJoinPoint.class);

    @Autowired
    private StarterService starterService;

    @Pointcut("@annotation(com.hnv99.design.door.annotation.DoDoor)")
    public void aopPoint() {
    }

    @Around("aopPoint()")
    public Object doRouter(ProceedingJoinPoint jp) throws Throwable {
        //Lấy phương thức
        Method method = getMethod(jp);
        DoDoor door = method.getAnnotation(DoDoor.class);
        //Lấy giá trị trường
        String keyValue = getFiledValue(door.key(), jp.getArgs());
        logger.info("practical door handler method：{} value：{}", method.getName(), keyValue);
        if (null == keyValue || keyValue.isEmpty()) return jp.proceed();
        // Lấy nội dung cấu hình
        String[] split = starterService.split(",");
        //Lọc theo whitelist
        for (String str : split) {
            if (keyValue.equals(str)) {
                return jp.proceed();
            }
        }
        // Chặn
        return returnObject(door, method);
    }

    private Method getMethod(JoinPoint jp) throws NoSuchMethodException {
        Signature sig = jp.getSignature();
        MethodSignature methodSignature = (MethodSignature) sig;
        return getClass(jp).getMethod(methodSignature.getName(), methodSignature.getParameterTypes());
    }

    private Class<? extends Object> getClass(JoinPoint jp) throws NoSuchMethodException {
        return jp.getTarget().getClass();
    }

    //Trả về đối tượng
    private Object returnObject(DoDoor doGate, Method method) throws IllegalAccessException, InstantiationException {
        Class<?> returnType = method.getReturnType();
        String returnJson = doGate.returnJson();
        if ("".equals(returnJson)) {
            return returnType.newInstance();
        }
        return JSON.parseObject(returnJson, returnType);
    }

    //Lấy giá trị thuộc tính
    private String getFiledValue(String filed, Object[] args) {
        String filedValue = null;
        for (Object arg : args) {
            try {
                if (null == filedValue || filedValue.isEmpty()) {
                    filedValue = BeanUtils.getProperty(arg, filed);
                } else {
                    break;
                }
            } catch (Exception e) {
                if (args.length == 1) {
                    return args[0].toString();
                }
            }
        }
        return filedValue;
    }

}

```

- Trong đoạn code này, bao gồm nhiều nội dung, nhưng logic cốt lõi chính là: `Object doRouter(ProceedingJoinPoint jp)`. Dưới đây chúng ta sẽ đi vào từng phần một.

**@Pointcut("@annotation(org.itstack.demo.design.door.annotation.DoDoor)")**

- Định nghĩa điểm cắt, ở đây chúng ta sử dụng đường dẫn chú thích, nghĩa là tất cả các phương thức được chú thích bằng chú thích này sẽ được quản lý bởi khía cạnh.

**getFieldValue**

- Lấy giá trị của một khóa cụ thể, nghĩa là lấy một thuộc tính từ tham số đầu vào, ở đây chủ yếu là lấy ID người dùng, và thực hiện kiểm tra whitelist.

**returnObject**

- Trả về đối tượng sau khi đã chặn, nghĩa là khi người dùng không phải là một trong các người dùng trong whitelist, thì trả về một số thông tin nhất định để thông báo.

**doRouter**

- Logic cốt lõi của khía cạnh, phần này chủ yếu là kiểm tra xem ID người dùng hiện tại có trong whitelist không. Nếu có thì cho phép `jp.proceed();`, nếu không thì trả về thông tin chặn do chúng ta xác định trước.

### Kiểm thử

Trong phần này, chúng ta sẽ thực hiện kiểm tra trong dự án `demo-design-10-00`, thông qua việc nhập jar, cấu hình chú thích.

#### Import POM

```java
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>itstack-demo-design-10-02</artifactId>
</dependency>
```           

- Đóng gói dự án trung gian, cung cấp dịch vụ jar bên ngoài.

#### Cấu hình application.yml

```java
# Cấu hình trung gian tùy chỉnh
practical:
  door:
    enabled: true
    userStr: 1001,aaaa,ccc # ID người dùng trong whitelist, phân cách bằng dấu phẩy
```        

- Ở đây chúng ta chủ yếu là bật công tắc whitelist và cung cấp ID người dùng trong whitelist, phân cách bằng dấu phẩy.

#### Thêm chú thích tùy chỉnh vào Controller

```java 
/**
 * http://localhost:8080/api/queryUserInfo?userId=1001
 * http://localhost:8080/api/queryUserInfo?userId=小团团
 */
@DoDoor(key = "userId", returnJson = "{\"code\":\"1111\",\"info\":\"Non-white-listed users are intercepted and cannot be accessed!\"}")
@RequestMapping(path = "/api/queryUserInfo", method = RequestMethod.GET)
public UserInfo queryUserInfo(@RequestParam String userId) {
    return new UserInfo("Error:" + userId, 19, "Thu Duc, HCMC, Vietnam");
}
```    

- Phần quan trọng ở đây là việc thêm chú thích tùy chỉnh `@DoDoor`, nó là cách thực hiện middleware hóa của chúng tôi trong mẫu thiết kế facade.
- key: Trường cần lấy giá trị từ tham số đầu vào, nếu là một đối tượng thì lấy giá trị từ đối tượng đó, nếu là một giá trị đơn thì sử dụng trực tiếp.
- returnJson: Giá trị trả về được thiết lập trước khi chặn, là một đối tượng Json trả về.

#### Khởi động Spring Boot

```shell

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::        (v2.1.2.RELEASE)

2024-03-30 01:30:36.594  INFO 38118 --- [           main] com.hnv99.design.HelloWorldApplication   : Starting HelloWorldApplication on iMac-Pro.local with PID 38118 (/Users/kirito4499/Desktop/Projects/JAVA/practical-java-design/design-demo-10-00/target/classes started by kirito4499 in /Users/kirito4499/Desktop/Projects/JAVA/practical-java-design)
2024-03-30 01:30:36.599  INFO 38118 --- [           main] com.hnv99.design.HelloWorldApplication   : No active profile set, falling back to default profiles: default
2024-03-30 01:30:37.563  INFO 38118 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
...
```         

- Khởi động bình thường, Spring Boot đã được khởi động và sẵn sàng phục vụ bên ngoài.

#### Kiểm tra giao diện API

**Người dùng trong whitelist**

[http://localhost:8080/api/queryUserInfo?userId=1001](http://localhost:8080/api/queryUserInfo?userId=1001)

```json
{"code":"0000","info":"success","name":"Error:1001","age":19,"address":"Thu Duc, HCMC, Vietnam"}
```   

- Kết quả kiểm tra lần này là bình thường, chúng ta có thể nhận được dữ liệu từ API.

**Người dùng không nằm trong whitelist**

[http://localhost:8080/api/queryUserInfo?userId=abcd](http://localhost:8080/api/queryUserInfo?userId=abcd)

```java
{"code":"1111","info":"Người dùng không nằm trong whitelist, bị chặn truy cập!","name":null,"age":null,"address":null}
```  

- Lần này chúng ta thay đổi `userId` thành `abcd`, kết quả trả về là thông tin bị chặn. Thông tin này chính là thông tin mà chúng ta đã định nghĩa trong chú thích tùy chỉnh: `@DoDoor(key = "userId", returnJson = "{\"code\":\"1111\",\"info\":\"Người dùng không nằm trong whitelist và bị chặn!\"}")`.

## Tổng kết

- Trong phần trước, chúng ta đã sử dụng một cách middleware để triển khai mẫu thiết kế facade. Thiết kế này có thể cải thiện tính cách ly và khả năng tái sử dụng của mã, không chỉ linh hoạt trong việc sử dụng mà còn giảm rủi ro từ việc phát triển mỗi hệ thống đều cần một dịch vụ như vậy.
- Có thể bạn cảm thấy rằng việc kiểm soát danh sách trắng như vậy chỉ là một ví dụ đơn giản, liệu có cần thiết không. Nhưng thường một bắt đầu nhỏ có thể ảnh hưởng đến việc mở rộng vô hạn sau này. Trong thực tế, phát triển kinh doanh thường phức tạp hơn nhiều, không thể đơn giản như vậy. Vì vậy, việc sử dụng mẫu thiết kế để làm cho cấu trúc mã trở nên sạch sẽ và ngăn nắp là quan trọng.
- Đôi khi không phải là mẫu thiết kế không hữu ích, mà là kinh nghiệm lập trình của chính bạn không đủ để làm chủ. Sau cùng, những kiến thức này đều được tinh chế từ một số thực tiễn hoạt động, nhưng nếu bạn có thể học và thực hành theo cách tiếp cận theo loạt bài viết này, bạn vẫn có thể nâng cao khả năng thiết kế của mình.
