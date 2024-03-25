---
title: Proxy Pattern
tags:
  - design-pattern
categories:
  - design-pattern
date created: 2023-10-06
date modified: 2023-10-06
---

## Ý nghĩa

**Proxy Pattern** là một mẫu thiết kế cấu trúc, nó cung cấp một đối tượng đại diện hoặc thay thế cho một đối tượng khác để kiểm soát truy cập vào đối tượng đó.

- Proxy Pattern giới thiệu một cấp độ trung gian để truy cập đối tượng.
- Một proxy từ xa có thể ẩn chi tiết của một đối tượng ở không gian địa chỉ khác.
- Một proxy ảo có thể tối ưu hóa việc tạo đối tượng theo nhu cầu.
- Một proxy bảo mật và hướng dẫn thông minh cho phép xử lý các nhiệm vụ khác khi truy cập vào đối tượng.

## Ứng dụng

- **Khởi tạo chậm (Proxy ảo)**: Nếu bạn có một đối tượng dịch vụ nặng mà chỉ sử dụng đôi khi sẽ tiêu tốn tài nguyên hệ thống, bạn có thể sử dụng Proxy Pattern.
- **Kiểm soát truy cập (Proxy bảo mật)**: Nếu bạn chỉ muốn cho phép một số khách hàng cụ thể sử dụng đối tượng dịch vụ, trong đó đối tượng có thể là một phần quan trọng của hệ thống hoạt động, bạn có thể sử dụng Proxy Pattern.
- **Triển khai dịch vụ từ xa (Proxy từ xa)**: Áp dụng khi đối tượng dịch vụ nằm trên một máy chủ từ xa.

## Cấu trúc

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210430184301.png)

### Giải thích cấu trúc

1. **Giao diện dịch vụ** (Service Interface) khai báo giao diện dịch vụ. Proxy phải tuân thủ giao diện này để giả mạo thành đối tượng dịch vụ.
2. Lớp **Dịch vụ** (Service) cung cấp một số logic kinh doanh hữu ích.
3. Lớp **Proxy** chứa một biến thành viên tham chiếu đến đối tượng dịch vụ. Proxy hoàn thành nhiệm vụ của nó (như trì hoãn khởi tạo, ghi nhật ký, kiểm soát truy cập và bộ nhớ cache) và sau đó chuyển yêu cầu cho đối tượng dịch vụ. Thông thường, Proxy quản lý toàn bộ vòng đời của đối tượng dịch vụ.
4. **Khách hàng** (Client) có thể tương tác với dịch vụ hoặc proxy thông qua cùng một giao diện, vì vậy bạn có thể sử dụng proxy trong bất kỳ mã nào cần đối tượng dịch vụ.

### Mẫu code cấu trúc

**Subject**: Định nghĩa giao diện chung cho RealSubject và Proxy, điều này cho phép sử dụng Proxy ở bất kỳ nơi nào sử dụng RealSubject.

```java
abstract class Subject {
    public abstract void Request();
}
```

**RealSubject**: Định nghĩa đối tượng thực sự mà Proxy đại diện.

```java
class RealSubject extends Subject {
    @Override
    public void Request() {
        System.out.println("Yêu cầu thực sự");
    }
}
```

**Proxy**: Lưu trữ một tham chiếu để cho phép Proxy truy cập vào đối tượng và cung cấp một giao diện giống như giao diện của Subject, điều này cho phép Proxy được sử dụng để thay thế đối tượng.

```java
class Proxy extends Subject {
    private RealSubject real;

    @Override
    public void Request() {
        if (null == real) {
            real = new RealSubject();
        }
        real.Request();
    }
}
```

## Pseudocode

Ví dụ này mô tả cách sử dụng **Proxy Pattern** để thêm việc khởi tạo chậm và bộ nhớ cache vào thư viện bên thứ ba Netflix (được gọi là TV trong mã giả). Thư viện này cung cấp một lớp tải xuống video. Tuy nhiên, lớp này có hiệu suất rất thấp. Nếu chương trình khách hàng yêu cầu cùng một video nhiều lần, thư viện sẽ tải lại video đó mỗi lần, không lưu trữ file đã tải lần đầu để sử dụng lại.

Lớp Proxy triển khai cùng một giao diện với tải xuống ban đầu và chuyển tiếp tất cả công việc cho tải xuống ban đầu. Tuy nhiên, lớp Proxy sẽ lưu trữ tất cả các bản ghi tải xuống và nếu chương trình yêu cầu cùng một tệp tin nhiều lần, nó sẽ trả về tệp tin được lưu trữ trong bộ nhớ cache.

```java
// Giao diện dịch vụ từ xa.
interface ThirdPartyTVLib is
    method listVideos()
    method getVideoInfo(id)
    method downloadVideo(id)

// Triển khai cụ thể của trình kết nối dịch vụ này. Các phương thức của lớp này có thể yêu cầu thông tin từ Netflix. Tốc độ yêu cầu phụ thuộc vào kết nối Internet giữa người dùng và Netflix. Nếu có nhiều yêu cầu được gửi cùng một lúc, ngay cả khi thông tin yêu cầu giống nhau, tốc độ của chương trình sẽ giảm.
class ThirdPartyTVClass implements ThirdPartyTVLib is
    method listVideos() is
        // Gửi yêu cầu API đến Netflix.

    method getVideoInfo(id) is
        // Lấy thông tin metadata của video.

    method downloadVideo(id) is
        // Tải một tệp video từ Netflix.

// Để tiết kiệm băng thông mạng, chúng ta có thể lưu kết quả yêu cầu vào bộ nhớ cache và lưu trữ trong một khoảng thời gian nhất định. Tuy nhiên, bạn có thể không thể đặt mã này trực tiếp vào lớp dịch vụ. Ví dụ, lớp này có thể là một phần của thư viện bên thứ ba hoặc có chữ ký "final". Vì vậy, chúng ta sẽ đặt mã cache vào một lớp Proxy mới triển khai giao diện của lớp dịch vụ. Khi lớp Proxy nhận được yêu cầu thực tế, nó mới chuyển tiếp yêu cầu đó cho đối tượng dịch vụ.
class CachedTVClass implements ThirdPartyTVLib is
    private field service: ThirdPartyTVLib
    private field listCache, videoCache
    field needReset

    constructor CachedTVClass(service: ThirdPartyTVLib) is
        this.service = service

    method listVideos() is
        if (listCache == null || needReset)
            listCache = service.listVideos()
        return listCache

    method getVideoInfo(id) is
        if (videoCache == null || needReset)
            videoCache = service.getVideoInfo(id)
        return videoCache

    method downloadVideo(id) is
        if (!downloadExists(id) || needReset)
            service.downloadVideo(id)

// Lớp GUI đã tương tác trực tiếp với đối tượng dịch vụ không cần thay đổi, miễn là nó chỉ tương tác thông qua giao diện. Chúng ta có thể an toàn chuyển đối tượng Proxy thay cho đối tượng dịch vụ thực, vì cả hai đều triển khai cùng một giao diện.
class TVManager is
    protected field service: ThirdPartyTVLib

    constructor TVManager(service: ThirdPartyTVLib) is
        this.service = service

    method renderVideoPage(id) is
        info = service.getVideoInfo(id)
        // Hiển thị trang video.

    method renderListPanel() is
        list = service.listVideos()
        // Hiển thị danh sách hình thu nhỏ video.

    method reactOnUserInput() is
        renderVideoPage()
        renderListPanel()

// Ứng dụng có thể cấu hình Proxy trong thời gian chạy.
class Application is
    method init() is
        aTVService = new ThirdPartyTVClass()
        aTVProxy = new CachedTVClass(aTVService)
        manager = new TVManager(aTVProxy)
        manager.reactOnUserInput()
```

## Ví dụ

**Ví dụ sử dụng:** Mặc dù Proxy Pattern không phổ biến trong hầu hết các chương trình Java, nhưng nó vẫn rất hữu ích trong một số trường hợp đặc biệt. Khi bạn muốn thêm hành vi bổ sung cho một đối tượng hiện có mà không cần sửa đổi mã khách hàng, mẫu này là không thể thay thế.

Dưới đây là một số ví dụ về Proxy Pattern trong thư viện chuẩn Java:

- [`java.lang.reflect.Proxy`](http://docs.oracle.com/javase/8/docs/api/java/lang/reflect/Proxy.html)
- [`java.rmi.*`](http://docs.oracle.com/javase/8/docs/api/java/rmi/package-summary.html)
- [`javax.ejb.EJB`](http://docs.oracle.com/javaee/7/api/javax/ejb/EJB.html) (Xem [bình luận](http://stackoverflow.com/questions/25514361/when-using-ejb-does-each-managed-bean-get-its-own-ejb-instance))
- [`javax.inject.Inject`](http://docs.oracle.com/javaee/7/api/javax/inject/Inject.html) (Xem [bình luận](http://stackoverflow.com/questions/29651008/field-getobj-returns-all-nulls-on-injected-cdi-managed-beans-while-manually-i/29672591#29672591))
- [`javax.persistence.PersistenceContext`](http://docs.oracle.com/javaee/7/api/javax/persistence/PersistenceContext.html)

**Cách nhận biết:** Proxy Pattern sẽ chuyển giao tất cả công việc thực tế cho một số đối tượng khác. Trừ khi Proxy là một lớp con của một dịch vụ, mỗi phương thức Proxy cuối cùng sẽ tham chiếu đến một đối tượng dịch vụ.

### Ví dụ: Sử dụng annotation, reflect và proxy để loại bỏ mã lặp lại

Giả sử ngân hàng cung cấp một số giao diện API, yêu cầu chúng ta không sử dụng JSON để tuần tự hóa tham số, mà là ghép các tham số lại thành một chuỗi lớn.

Theo thứ tự được cung cấp trong tài liệu API của ngân hàng, chúng ta ghép tất cả các tham số thành dữ liệu có độ dài cố định, sau đó ghép chúng lại thành một chuỗi hoàn chỉnh. Vì mỗi loại tham số có độ dài cố định, nếu không đạt được độ dài, chúng ta cần thực hiện xử lý điền đầy:

- Tham số kiểu chuỗi không đạt đến độ dài yêu cầu sẽ được điền bằng gạch dưới bên phải, tức là nội dung chuỗi sẽ nằm bên trái;
- Tham số kiểu số không đạt đến độ dài yêu cầu sẽ được điền bằng số 0 bên trái, tức là số thực tế sẽ nằm bên phải;
- Biểu diễn số tiền cần làm tròn xuống 2 chữ số thập phân, tính theo đơn vị xuống còn phần xuống, và cũng được điền bằng số 0 bên trái như kiểu số.  

Tất cả các tham số đều được thực hiện phép MD5 để tạo chữ ký (trong ví dụ này, chúng ta không xem xét việc thêm salt).

#### Phiên bản có vấn đề

```java
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.http.client.fluent.Request;
import org.apache.http.entity.ContentType;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;

public class BankService {

    public static String createUser(String name, String identity, String mobile, int age) throws IOException {
        StringBuilder stringBuilder = new StringBuilder();
        // Chuỗi được căn trái, các vị trí thừa được điền bằng dấu gạch dưới
        stringBuilder.append(String.format("%-10s", name).replace(' ', '_'));
        // Chuỗi được căn trái, các vị trí thừa được điền bằng dấu gạch dưới
        stringBuilder.append(String.format("%-18s", identity).replace(' ', '_'));
        // Số được căn phải, các vị trí thừa được điền bằng số 0
        stringBuilder.append(String.format("%05d", age));
        // Chuỗi được căn trái, các vị trí thừa được điền bằng dấu gạch dưới
        stringBuilder.append(String.format("%-11s", mobile).replace(' ', '_'));
        // Cuối cùng, thêm MD5 làm chữ ký
        stringBuilder.append(DigestUtils.md2Hex(stringBuilder.toString()));
        return Request.Post("http://localhost:45678/reflection/bank/createUser")
                .bodyString(stringBuilder.toString(), ContentType.APPLICATION_JSON)
                .execute().returnContent().asString();
    }

    public static String pay(long userId, BigDecimal amount) throws IOException {
        StringBuilder stringBuilder = new StringBuilder();
        // Số được căn phải, các vị trí thừa được điền bằng số 0
        stringBuilder.append(String.format("%020d", userId));
        // Số tiền được làm tròn xuống 2 chữ số thập phân, tính theo đơn vị xuống còn phần xuống, được căn phải, các vị trí thừa được điền bằng số 0
        stringBuilder.append(String.format("%010d", amount.setScale(2, RoundingMode.DOWN).multiply(new BigDecimal("100")).longValue()));
        // Cuối cùng, thêm MD5 làm chữ ký
        stringBuilder.append(DigestUtils.md2Hex(stringBuilder.toString()));
        return Request.Post("http://localhost:45678/reflection/bank/pay")
                .bodyString(stringBuilder.toString(), ContentType.APPLICATION_JSON)
                .execute().returnContent().asString();
    }
}
```

Trong phiên bản mã trên, chúng ta gặp các vấn đề sau:

- Có sự lặp lại trong xử lý logic cho ba loại dữ liệu chuẩn, chỉ cần một chút không cẩn thận là có thể gây ra lỗi;
- Quá trình xử lý bao gồm việc nối chuỗi, tạo chữ ký và gửi yêu cầu được lặp lại trong tất cả các phương thức;
- Các loại tham số thực tế của phương thức và thứ tự không nhất thiết phải giống với yêu cầu giao diện, dễ gây lỗi;
- Mã cứng cho từng tham số, không thể kiểm tra một cách rõ ràng. Nếu có hàng chục hoặc hàng trăm tham số, khả năng gây lỗi rất cao.

#### Phiên bản tối ưu

Để giải quyết các vấn đề trong phiên bản mã trên, chúng ta có thể sử dụng Proxy Pattern kết hợp với annotation, refect và proxy để loại bỏ mã lặp lại và tăng tính linh hoạt của mã. Dưới đây là một phiên bản tối ưu hơn:

【Annotation 1】

```java
import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
@Inherited
public @interface BankAPI {

    String desc() default "";

    String url() default "";

}
```

【Annotation 2】

```java
import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@Documented
@Inherited
public @interface BankAPIField {

    int order() default -1;

    int length() default -1;

    String type() default "";

}
```

【Lớp trừu tượng】

```java
abstract class AbstractAPI {}
```

【Lớp dịch dịch vụ】

```java
@Slf4j
public class BetterBankService {

    public static String createUser(String name, String identity, String mobile, int age) throws IOException {
        CreateUserAPI createUserAPI = new CreateUserAPI();
        createUserAPI.setName(name);
        createUserAPI.setIdentity(identity);
        createUserAPI.setAge(age);
        createUserAPI.setMobile(mobile);
        return remoteCall(createUserAPI);
    }

    public static String pay(long userId, BigDecimal amount) throws IOException {
        PayAPI payAPI = new PayAPI();
        payAPI.setUserId(userId);
        payAPI.setAmount(amount);
        return remoteCall(payAPI);
    }

    private static String remoteCall(AbstractAPI api) throws IOException {
        // Lấy địa chỉ yêu cầu từ chú thích BankAPI
        BankAPI bankAPI = api.getClass().getAnnotation(BankAPI.class);
        bankAPI.url();
        StringBuilder stringBuilder = new StringBuilder();
        Arrays.stream(api.getClass().getDeclaredFields()) // Lấy tất cả các trường
            .filter(field -> field.isAnnotationPresent(BankAPIField.class)) // Lọc các trường được đánh dấu bằng chú thích
            .sorted(Comparator.comparingInt(a -> a.getAnnotation(BankAPIField.class).order())) // Sắp xếp các trường theo thứ tự trong chú thích
            .peek(field -> field.setAccessible(true)) // Cho phép truy cập vào các trường riêng tư
            .forEach(field -> {
                // Lấy chú thích
                BankAPIField bankAPIField = field.getAnnotation(BankAPIField.class);
                Object value = "";
                try {
                    // Sử dụng phản chiếu để lấy giá trị của trường
                    value = field.get(api);
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
                // Định dạng chuỗi theo cách phù hợp dựa trên kiểu trường
                switch (bankAPIField.type()) {
                    case "S": {
                        stringBuilder.append(
                            String.format("%-" + bankAPIField.length() + "s", value.toString()).replace(' ', '_'));
                        break;
                    }
                    case "N": {
                        stringBuilder.append(
                            String.format("%" + bankAPIField.length() + "s", value.toString()).replace(' ', '0'));
                        break;
                    }
                    case "M": {
                        if (!(value instanceof BigDecimal)) {
                            throw new RuntimeException(
                                String.format("{} của {} phải là BigDecimal", api, field));
                        }
                        stringBuilder.append(String.format("%0" + bankAPIField.length() + "d",
                            ((BigDecimal) value).setScale(2, RoundingMode.DOWN)
                                .multiply(new BigDecimal("100"))
                                .longValue()));
                        break;
                    }
                    default:
                        break;
                }
            });
        // Logic chữ ký
        stringBuilder.append(DigestUtils.md2Hex(stringBuilder.toString()));
        String param = stringBuilder.toString();
        long begin = System.currentTimeMillis();
        // Gửi yêu cầu
        String result = Request.Post("http://localhost:45678/reflection" + bankAPI.url())
            .bodyString(param, ContentType.APPLICATION_JSON)
            .execute().returnContent().asString();
        log.info("Gọi API ngân hàng {} url:{} tham số:{} thời gian:{}ms", bankAPI.desc(), bankAPI.url(), param,
            System.currentTimeMillis() - begin);
        return result;
    }

}
```

【Annotation cho giao diện API 1】

```java
import lombok.Data;

@BankAPI(url = "/bank/createUser", desc = "Giao diện tạo người dùng")
@Data
public class CreateUserAPI extends AbstractAPI {

    @BankAPIField(order = 1, type = "S", length = 10)
    private String name;
    @BankAPIField(order = 2, type = "S", length = 18)
    private String identity;
    @BankAPIField(order = 4, type = "S", length = 11)
    private String mobile;
    @BankAPIField(order = 3, type = "N", length = 5)
    private int age;

}
```

【Annotation cho giao diện API 2】

```java
import lombok.Data;

import java.math.BigDecimal;

@BankAPI(url = "/bank/pay", desc = "Giao diện thanh toán")
@Data
public class PayAPI extends AbstractAPI {

    @BankAPIField(order = 1, type = "N", length = 20)
    private long userId;
    @BankAPIField(order = 2, type = "M", length = 10)
    private BigDecimal amount;

}
```

## Mối quan hệ với các mẫu thiết kế khác

- [[Adapter Pattern]] cung cấp các giao diện khác nhau cho các đối tượng được đóng gói, [[Proxy Pattern]] cung cấp cùng một giao diện cho đối tượng, và [[Decorator Pattern]] cung cấp giao diện được tăng cường cho đối tượng.
- [[Facade Pattern]] và [[Proxy Pattern]] có điểm tương đồng trong việc lưu trữ một thực thể phức tạp và tự khởi tạo nó. Tuy nhiên, *Proxy* và đối tượng dịch vụ của nó tuân theo cùng một giao diện, cho phép nó và đối tượng dịch vụ có thể hoán đổi, điều này khác với *Facade*.
- [[Decorator Pattern]] và [[Proxy Pattern]] có cấu trúc tương tự nhau, nhưng mục đích của chúng rất khác nhau. Cả hai mẫu này đều dựa trên nguyên tắc tổ hợp, tức là một đối tượng nên giao phần công việc cho một đối tượng khác. Sự khác biệt giữa hai mẫu này là *Proxy* thường tự quản lý vòng đời của đối tượng dịch vụ của nó, trong khi *Decorator* luôn được khách hàng kiểm soát quá trình tạo ra nó.
