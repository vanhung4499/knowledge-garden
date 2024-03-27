---
title: Abstract Factory Pattern Practice
tags:
  - design-pattern
categories: 
date created: 2024-03-26
date modified: 2024-03-26
---

# Abstract Factory Pattern: Nâng cấp Redis Cluster kép, sử dụng abstract proxy

## Giới thiệu

**Code lộn xộn và anh phải chịu trách nhiệm.**

Hầu hết các lập trình viên đều muốn viết code tốt, ngoài việc lập trình là công việc, họ cũng là những người có tinh thần nghề nghiệp. Nhưng nhiều lúc lại khó để bạn giữ vững điều này, giống như: nhận một dự án tệ, chức năng sản phẩm cần gấp, khả năng cá nhân không đủ, và nhiều lý do khác dẫn đến mã nguồn của dự án nặng nề, thường xuyên gặp sự cố, cuối cùng phải từ chức rời đi.

**Đọc nhiều sách, học nhiều kiến thức, đa luồng có thể làm màu mè, nhưng cuối cùng tôi vẫn không viết được mã nguồn tốt!**

Điều này hơi giống việc bạn mua đồ sau khi sửa sang lại ngôi nhà của mình, chiếc ghế sofa gỗ thực sự hàng trăm triệu, nhưng đặt ở đây nó không đẹp. Mãi mãi viết code tệ không nhất thiết là do kiến thức cơ bản không đủ, cũng không nhất thiết là vì "Chức năng cần gấp, tôi không quan tâm đến việc triển khai ngày mai." Thực tế, nhiều lúc là vì kinh nghiệm lập trình của chúng ta còn hạn chế và khả năng kiểm soát kiến trúc không đủ, tôi tin rằng nhu cầu đầu tiên của sản phẩm thường không phức tạp, thậm chí là thấy và hiểu được. Nhưng nếu bạn không xem xét xem sau này sẽ mở rộng ra sao, bạn sẽ thêm các chức năng vào các module nào, thì mã nguồn sau này sẽ bắt đầu lan rộng từ hạt giống tệ đầu tiên bạn đã gieo.

**Kinh nghiệm của bạn khi học các mẫu thiết kế là gì cũng như cách tìm hiểu và sử dụng chúng!**

Các cuốn sách về mẫu thiết kế, hơi giống như giấy phép lái xe của bạn, hướng dẫn trang trí nhà hoặc sách hướng dẫn hẹn hò cho người độc thân. Nhưng! Nếu bạn không áp dụng vào thực tế, bạn chắc chắn sẽ làm cho mã nguồn trở nên **lộn xộn và khó hiểu**. Bởi vì những suy nghĩ hướng dẫn này được trích xuất từ kinh nghiệm thực tế, không có kinh nghiệm lập trình mới có thể nắm bắt được kiến thức như vậy. Vì vậy, trong quá trình học, trước tiên bạn cần có các trường hợp, sau đó kết hợp các trường hợp với công việc thực tế của bạn, thử nghiệm và cải thiện từng bước, từ đó cảm nhận được cảm xúc bên trong và cuối cùng học cách xây dựng mã nguồn tốt.

## Môi trường phát triển

1. JDK 1.8
2. Idea + Maven
3. Code: [vanhung4499/practical-java-design](https://github.com/vanhung4499/practical-java-design)

| Dự án              | Mô tả                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------- |
| demo-design-2-00   | Dự án mô phỏng, giả lập việc nâng cấp từ Redis lên cụm khiến cần phải sửa đổi các lớp |
| demo-design-2-01   | Sử dụng một đống mã để thực hiện yêu cầu kinh doanh, cũng là sử dụng if-else          |
|  demo-design-2-02  | Tối ưu và cải thiện mã thông qua thiết kế mẫu, tạo ra sự so sánh để học hỏi           |

## Giới thiệu về Abstract Factory Pattern

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240326130330.png)  

Factory Pattern và Factory Method Pattern mặc dù chủ yếu đều nhằm giải quyết vấn đề **chọn interface**. Nhưng trong cách triển khai, Abstract Factory Pattern là một nhà máy trung tâm, tạo ra các nhà máy khác.

Có thể trong công việc lập trình hàng ngày, bạn ít quan tâm đến các mẫu thiết kế như vậy hoặc cấu trúc mã tương tự, nhưng tình huống như vậy luôn hiện diện xung quanh chúng ta, ví dụ như:

1. Sự khác biệt trong việc xuống dòng trên các hệ thống khác nhau
    
    1. Trong hệ điều hành Unix, mỗi dòng kết thúc chỉ có **<xuống dòng>**, tức là `\n`;
    2. Trong hệ điều hành Windows, mỗi dòng kết thúc là **<xuống dòng><về đầu dòng>**, tức là `\n\r`;
    3. Trong hệ điều hành Mac, mỗi dòng kết thúc là **<về đầu dòng>**
    
2. Sự khác biệt trong giao diện của Inteliji IDEA (Win\Mac)

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240326130915.png)

**Ngoài những ví dụ rõ ràng như vậy, chúng ta thường xuyên gặp phải các vấn đề tương tự trong phát triển doanh nghiệp và cần phải xử lý tương thích.** Nhưng đa số những lập trình viên thiếu kinh nghiệm thường dễ dàng thêm các điều kiện `ifelse` để xử lý.

## Mô phỏng kịch bản tình huống

`Đôi khi sự phát triển sơ khai của doanh nghiệp ở giai đoạn đầu cũng làm cho việc xây dựng hệ thống trở nên quan trọng.`

Các ước lượng **QPS thấp**, **áp lực hệ thống nhỏ**, **lưu lượng truy cập không lớn**, **không có nhiều thay đổi lớn trong vòng gần một năm**, v.v được khảo sát trước khi xem xét về thời gian và chi phí đầu tư, thường sẽ không đầu tư nhiều nguồn lực để xây dựng một hệ thống thật hoàn chỉnh. Chỉ cần sử dụng một `Redis` đơn lẻ có thể đáp ứng được tình hình hiện tại.

`Không tự hào về việc nói rằng, ngày mới học tôi có thể xây trang chủ Google trong một ngày. Nhưng khi tôi đủ nhận thức, dù có cho tôi chục năm cũng không thể hoàn thành!`

Nhưng với sự phát triển nhanh chóng của doanh nghiệp vượt xa những gì dự kiến, khả năng tải của hệ thống cũng cần phải được nâng cao theo. Redis đơn lẻ hiện tại không đáp ứng được yêu cầu của hệ thống. Lúc này, cần phải chuyển đổi sang một dịch vụ Redis cụ thể hơn, mặc dù việc này cần sửa đổi nhưng không thể ảnh hưởng đến hoạt động của hệ thống hiện tại và phải chuyển qua một cách suôn sẻ.

Với việc nâng cấp này, các vấn đề có thể dự kiến sẽ có:

1. Nhiều dịch vụ sử dụng Redis cần được nâng cấp cùng một cụm Redis.
2. Cần tương thích với cụm A và cụm B, để dễ dàng sao lưu trong tương lai.
3. Hai cụm cung cấp các interface và method khác nhau, cần phải thực hiện điều chỉnh.
4. Không được ảnh hưởng đến hệ thống đang hoạt động bình thường hiện tại.

### Dự án mô phỏng kịch bản

```shell
design-demo-2-00/
├── pom.xml
└── src
    └── main
        └── java
            └── com
                └── hnv99
                    └── design
                        ├── CacheService.java
                        ├── RedisUtils.java
                        ├── cuisine
                        │   └── impl
                        │       └── CacheServiceImpl.java
                        └── matter
                            ├── EGM.java
                            └── IIR.java
```

### Tóm tắt tình huống

#### Mô phỏng Dịch vụ Redis đơn

```java
  
public class RedisUtils {  
  
    private Logger logger = LoggerFactory.getLogger(RedisUtils.class);  
  
    private Map<String, String> dataMap = new ConcurrentHashMap<>();  
  
    public String get(String key) {  
        logger.info("Redis lấy dữ liệu key：{}", key);  
        return dataMap.get(key);  
    }  
    public void set(String key, String value) {  
        logger.info("Redis ghi dữ liệu key：{} val：{}", key, value);  
        dataMap.put(key, value);  
    }  
    public void set(String key, String value, long timeout, TimeUnit timeUnit) {  
        logger.info("Redis ghi dữ liệu key：{} val：{} timeout：{} timeUnit：{}", key, value, timeout, timeUnit.toString());  
        dataMap.put(key, value);  
    }  
    public void del(String key) {  
        logger.info("Redis xóa dữ liệu key：{}", key);  
        dataMap.remove(key);  
    }  
}
```

- Mô phỏng chức năng của Redis, tức là giả định rằng tất cả các hệ thống hiện tại đang sử dụng dịch vụ này.
- Tên lớp và phương thức đã cố định được sử dụng trong từng hệ thống kinh doanh, việc thay đổi đôi khi hơi phức tạp.

#### Mô phỏng Cụm EGM

```java
public class EGM {  
  
    private Logger logger = LoggerFactory.getLogger(EGM.class);  
  
    private Map<String, String> dataMap = new ConcurrentHashMap<>();  
  
    public String gain(String key) {  
        logger.info("EGM lấy dữ liệu key：{}", key);  
        return dataMap.get(key);  
    }  
    public void set(String key, String value) {  
        logger.info("EGM ghi dữ liệu key：{} val：{}", key, value);  
        dataMap.put(key, value);  
    }  
    public void setEx(String key, String value, long timeout, TimeUnit timeUnit) {  
        logger.info("EGM ghi dữ liệu key：{} val：{} timeout：{} timeUnit：{}", key, value, timeout, timeUnit.toString());  
        dataMap.put(key, value);  
    }  
    public void delete(String key) {  
        logger.info("EGM xóa dữ liệu key：{}", key);  
        dataMap.remove(key);  
    }
}
```

- Mô phỏng một dịch vụ cụm, nhưng tên phương thức không giống với các phương thức được sử dụng trong từng hệ thống kinh doanh. Giống như bạn sử dụng macOS, tôi sử dụng Windows. Cùng làm một việc nhưng lại có cách thực hiện khác nhau.

#### Mô phỏng Cụm IIR

```java
  
public class IIR {  
  
    private Logger logger = LoggerFactory.getLogger(IIR.class);  
  
    private Map<String, String> dataMap = new ConcurrentHashMap<>();  
  
    public String get(String key) {  
        logger.info("IIR lấy dữ liệu key：{}", key);  
        return dataMap.get(key);  
    }  
    public void set(String key, String value) {  
        logger.info("IIR ghi dữ liệu key：{} val：{}", key, value);  
        dataMap.put(key, value);  
    }  
    public void setExpire(String key, String value, long timeout, TimeUnit timeUnit) {  
        logger.info("IIR ghi dữ liệu key：{} val：{} timeout：{} timeUnit：{}", key, value, timeout, timeUnit.toString());  
        dataMap.put(key, value);  
    }  
    public void del(String key) {  
        logger.info("IIR xóa dữ liệu key：{}", key);  
        dataMap.remove(key);  
    }  
}
```

- Đây là một dịch vụ cụm khác, đôi khi trong quá trình phát triển doanh nghiệp có thể có hai dịch vụ cụm khác nhau. Ở đây, chúng tôi cũng đang tạo ra một ví dụ mô phỏng, vì vậy chúng tôi đã thêm hai dịch vụ cung cấp cùng một chức năng nhưng khác nhau, để học về Abstract Factory Pattern.

Tóm lại, trong hệ thống hiện tại của chúng ta, đã có sử dụng dịch vụ Redis một cách rộng rãi. Tuy nhiên, do hệ thống không đáp ứng được sự phát triển nhanh chóng của kinh doanh, vì vậy cần chuyển sang sử dụng dịch vụ cụm. Khi đó, có hai dịch vụ cụm cần phải tương thích, và đồng thời phải đảm bảo sự thay đổi của tất cả các hệ thống kinh doanh mà không ảnh hưởng đến việc sử dụng trực tuyến.

## Sử dụng dịch vụ đơn cụm

Dưới đây là cách sử dụng dịch vụ Redis đơn cụm trong mô phỏng hiện tại, và sau này sẽ thay đổi mã nguồn ở đây.

### Định nghĩa interface

```java
public interface CacheService {

    String get(final String key);

    void set(String key, String value);

    void set(String key, String value, long timeout, TimeUnit timeUnit);

    void del(String key);

}
```

### Triển khai

```java
public class CacheServiceImpl implements CacheService {

    private RedisUtils redisUtils = new RedisUtils();

    public String get(String key) {
        return redisUtils.get(key);
    }

    public void set(String key, String value) {
        redisUtils.set(key, value);
    }

    public void set(String key, String value, long timeout, TimeUnit timeUnit) {
        redisUtils.set(key, value, timeout, timeUnit);
    }

    public void del(String key) {
        redisUtils.del(key);
    }

}

```

- Hiện tại mã nguồn cho việc sử dụng dịch vụ Redis đơn cụm trong tình huống hiện tại không có vấn đề gì và khá đơn giản. Tuy nhiên, khi tất cả các hệ thống kinh doanh đều sử dụng nó, việc cần phải thay đổi sẽ không dễ dàng. Ở đây bạn có thể suy nghĩ và xem làm thế nào để thực hiện sửa đổi một cách hợp lý.

## Triển khai code

**Thực sự không có logic nào không giải quyết được bằng if-else, nếu không được thì thêm một dòng nữa!**

Trong cách triển khai hiện tại, không cần phải thay đổi cấu trúc lớp, tức là cấu trúc lớp vẫn giữ nguyên như đã được định nghĩa ở trên. Chúng ta sẽ sử dụng một trường loại để phân biệt xem Redis nào đang được sử dụng, và đó sẽ là điều kiện quyết định cho việc sử dụng. Có thể nói cách triển khai hiện tại rất khó sử dụng, các hệ thống sử dụng đều cần phải thay đổi nhiều, ở đây chỉ là một ví dụ.

### Cấu trúc dự án

```shell
design-demo-2-01/
├── pom.xml
└── src
    └── main
        └── java
            └── com
                └── hnv99
                    └── design
                        ├── CacheService.java
                        └── cuisine
                            └── impl
                                └── CacheServiceImpl.java
```

- Lúc này chỉ có hai lớp, cấu trúc lớp rất đơn giản. Và các chức năng mở rộng bổ sung mà chúng tôi cần chỉ được triển khai trong `CacheServiceImpl`.

### Triển khai ifelse

```java
  
public class CacheServiceImpl implements CacheService {  
  
    private RedisUtils redisUtils = new RedisUtils();  
  
    private EGM egm = new EGM();  
  
    private IIR iir = new IIR();  
  
    public String get(String key, int redisType) {  
  
        if (1 == redisType) {  
            return egm.gain(key);  
        }  
        if (2 == redisType) {  
            return iir.get(key);  
        }  
        return redisUtils.get(key);  
    }  
    
    public void set(String key, String value, int redisType) {  
  
        if (1 == redisType) {  
            egm.set(key, value);  
            return;  
        }  
        if (2 == redisType) {  
            iir.set(key, value);  
            return;  
        }  
        redisUtils.set(key, value);  
    }
    
    public void set(String key, String value, long timeout, TimeUnit timeUnit, int redisType) {  
  
        if (1 == redisType) {  
            egm.setEx(key, value, timeout, timeUnit);  
            return;  
        }  
        if (2 == redisType) {  
            iir.setExpire(key, value, timeout, timeUnit);  
            return;  
        }  
        redisUtils.set(key, value, timeout, timeUnit);  
    }  
    public void del(String key, int redisType) {  
  
        if (1 == redisType) {  
            egm.delete(key);  
            return;  
        }  
        if (2 == redisType) {  
            iir.del(key);  
            return;  
        }  
        redisUtils.del(key);  
    }  
  
}
```

- Quá trình xử lý ở đây rất đơn giản, chủ yếu chọn cụm Redis nào dựa trên loại.
- Mặc dù cách triển khai đơn giản nhưng lại gây rắc rối cho người dùng và cũng khó đối phó với việc mở rộng và bảo trì liên tục sau này.

### Kiểm thử

Tiếp theo, chúng tôi viết unit test thông qua Junit, nhấn mạnh rằng việc viết các bài unit test tốt hàng ngày có thể cải thiện tốt hơn tính mạnh mẽ của hệ thống.

**Viết lớp kiểm tra:**

```java
public class ApiTest {  
  
    @Test  
    public void test_CacheService() {  
  
        CacheService cacheService = new CacheServiceImpl();  
  
        cacheService.set("user_name_01", "Hung", 1);  
        String val01 = cacheService.get("user_name_01", 1);  
        System.out.println("Kết quả kiểm tra: " + val01);  
  
    }  
}
```

**Kết quả:**

```shell
2024-03-26 15:01:39.193	INFO	main		(EGM.java:21)	|	EGM ghi dữ liệu key：user_name_01 val：Hung
2024-03-26 15:01:39.197	INFO	main		(EGM.java:16)	|	EGM lấy dữ liệu key：user_name_01
Kết quả kiểm tra: Hung
```

- Đánh giá từ kết quả, nó chạy bình thường và không có vấn đề gì. Nhưng một khi code như vậy được tạo và chạy thì thực sự rất khó để thay đổi nó!

## Tái cấu trúc Abstract Factory Pattern

Tiếp theo, chúng ta sẽ tối ưu mã lệnh bằng cách sử dụng Abstract Factory Pattern, đây thực chất là một cải tiến nhỏ.

Abstract Factory sẽ được tạo và truy cập bằng cách sử dụng một lớp proxy. Lớp đang được proxy là lớp thao tác Redis hiện tại, cho phép lớp này gọi dịch vụ dữ liệu cho các cụm A và B mà không cần bất kỳ sửa đổi nào.

Ngoài ra, điều cần lưu ý quan trọng là vì các cụm A và B có các phương thức khác nhau ở một số khía cạnh, nên cần phải tạo một bộ chuyển đổi interface. Lớp chuyển đổi này đóng vai trò như một nhà máy trong nhà máy, tạo ra các dịch vụ trừu tượng để thống nhất các dịch vụ khác nhau cho cùng một mục đích nghiệp vụ. Khía cạnh này tương tự như mẫu thiết kế Factory Method đã thảo luận trong chương trước và có thể được tham khảo thêm thông tin.

### Cấu trúc dự án

```shell
design-demo-2-02/
├── pom.xml
└── src
    ├── main
    │   └── java
    │       └── com
    │           └── hnv99
    │               └── design
    │                   ├── CacheService.java
    │                   ├── factory
    │                   │   ├── ICacheAdapter.java
    │                   │   ├── JDKInvocationHandler.java
    │                   │   ├── JDKProxy.java
    │                   │   └── impl
    │                   │       ├── EGMCacheAdapter.java
    │                   │       └── IIRCacheAdapter.java
    │                   ├── impl
    │                   │   └── CacheServiceImpl.java
    │                   └── util
    │                       └── ClassLoaderUtils.java
    └── test
        └── java
            └── com
                └── hnv99
                    └── design
                        └── ApiTest.java

```

**Cấu trúc Abstract Factory Pattern**

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240326161552.png)

```java
CacheService proxy_EGM = JDKProxy.getProxy(CacheServiceImpl.class, new EGMCacheAdapter());
```

Trong dự án, có một số điểm chính như sau:

- `ICacheAdapter`: Định nghĩa adapter interface, đóng gói các tên gọi phương thức khác nhau trong hai cụm Redis. `EGMCacheAdapter`, `IIRCacheAdapter`.  
- `JDKProxy`, `JDKInvocationHandler`: là định nghĩa và cách triển khai của lớp proxy. Phần này cũng là một cách triển khai khác của Abstract Factory. Bằng cách này, bạn có thể triển khai các phương thức Redis gốc thông qua việc gọi proxy, điều này giúp kiểm soát việc sử dụng bộ đệm bằng cách điều khiển các đối tượng tham số đầu vào khác nhau.

**OK**, sau đó tôi sẽ giải thích cách triển khai cụ thể của một số lớp.

### Triển khai code

#### Định nghĩa adapter interface

```java
public interface ICacheAdapter {

    String get(String key);

    void set(String key, String value);

    void set(String key, String value, long timeout, TimeUnit timeUnit);

    void del(String key);

}
```

- Chức năng chính của lớp này là cho phép tất cả các nhà cung cấp trong các cụm hoạt động dưới tên gọi phương thức thống nhất. Điều này cũng thuận tiện cho việc mở rộng sau này.

#### Triển khai dịch vụ cụm

**EGMCacheAdapter**

```java
public class EGMCacheAdapter implements ICacheAdapter {

    private EGM egm = new EGM();

    public String get(String key) {
        return egm.gain(key);
    }

    public void set(String key, String value) {
        egm.set(key, value);
    }

    public void set(String key, String value, long timeout, TimeUnit timeUnit) {
        egm.setEx(key, value, timeout, timeUnit);
    }

    public void del(String key) {
        egm.delete(key);
    }
}

```

**IIRCacheAdapter**

```java
public class IIRCacheAdapter implements ICacheAdapter {

    private IIR iir = new IIR();

    public String get(String key) {
        return iir.get(key);
    }

    public void set(String key, String value) {
        iir.set(key, value);
    }

    public void set(String key, String value, long timeout, TimeUnit timeUnit) {
        iir.setExpire(key, value, timeout, timeUnit);
    }

    public void del(String key) {
        iir.del(key);
    }

}

```

- Cả hai triển khai đều rất dễ dàng, đều được đóng gói với phương thức giống nhau.

#### Định nghĩa lớp proxy cho abstract factory và triển khai

**JDKProxy**

```java
public static <T> T getProxy(Class<T> interfaceClass, ICacheAdapter cacheAdapter) throws Exception {
    InvocationHandler handler = new JDKInvocationHandler(cacheAdapter);
    ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
    Class<?>[] classes = interfaceClass.getInterfaces();
    return (T) Proxy.newProxyInstance(classLoader, new Class[]{classes[0]}, handler);
}

```

- Chức năng chính ở đây là hoàn thiện lớp proxy, đồng thời, cụm nào được sử dụng sẽ được truyền qua các tham số bên ngoài.

**JDKInvocationHandler**

```java
public class JDKInvocationHandler implements InvocationHandler {

    private ICacheAdapter cacheAdapter;

    public JDKInvocationHandler(ICacheAdapter cacheAdapter) {
        this.cacheAdapter = cacheAdapter;
    }

    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        return ICacheAdapter.class.getMethod(method.getName(), ClassLoaderUtils.getClazzByArgs(args)).invoke(cacheAdapter, args);
    }

}

```

- Việc triển khai lớp proxy thực sự rất đơn giản. Các hoạt động của phương thức được thực hiện bằng cách thâm nhập vào dịch vụ cụm đến.
- Ngoài ra `invoke`, bằng cách sử dụng phương pháp phản chiếu để lấy tên phương thức và gọi hàm phương thức tương ứng, việc sử dụng tổng thể sẽ được đơn giản hóa.
- Tại thời điểm này, chúng tôi đã hoàn thành việc triển khai chức năng tổng thể và phần abstract factory cũng có thể được triển khai bằng phương pháp không proxy.

### Kiểm thử

**Viết Unit Test:**

```java
public class ApiTest {  
  
    @Test  
    public void test_CacheService() throws Exception {  
  
        // Tạo proxy cho EGM Cache  
        CacheService proxy_EGM = JDKProxy.getProxy(CacheServiceImpl.class, new EGMCacheAdapter());  
        proxy_EGM.set("user_name_01", "Hung");  
        String val01 = proxy_EGM.get("user_name_01");  
        System.out.println("Kết quả kiểm tra: " + val01);  
  
        // Tạo proxy cho IIR Cache  
        CacheService proxy_IIR = JDKProxy.getProxy(CacheServiceImpl.class, new IIRCacheAdapter());  
        proxy_IIR.set("user_name_01", "Hung");  
        String val02 = proxy_IIR.get("user_name_01");  
        System.out.println("Kết quả kiểm tra: " + val02);  
  
    }  
}
```

- Trong mã kiểm thử, bằng cách truyền vào loại cụm khác nhau, chúng ta có thể gọi các phương thức của các cụm khác nhau. `JDKProxy.getProxy(CacheServiceImpl.class, new EGMCacheAdapter());`
- Nếu có yêu cầu mở rộng sau này, bạn cũng có thể bổ sung theo cách này, đồng thời đối với việc sửa đổi, không cần sửa đổi phương thức gốc, giảm thiểu chi phí sửa đổi.

**Kết quả**

```shell
2024-03-26 15:39:35.719	INFO	main		(EGM.java:21)	|	EGM ghi dữ liệu key：user_name_01 val：Hung
2024-03-26 15:39:35.721	INFO	main		(EGM.java:16)	|	EGM lấy dữ liệu key：user_name_01
Kết quả kiểm tra: Hung
2024-03-26 15:39:35.722	INFO	main		(IIR.java:22)	|	IIR ghi dữ liệu key：user_name_01 val：Hung
2024-03-26 15:39:35.723	INFO	main		(IIR.java:17)	|	IIR lấy dữ liệu key：user_name_01
Kết quả kiểm tra: Hung
```

- Kết quả chạy bình thường, mã này đáp ứng được yêu cầu mở rộng, đồng thời năng lực kỹ thuật của bạn cũng để lại ấn tượng sâu sắc với sếp.
- Hãy nâng cao khả năng tự nghiên cứu và phát triển không phải chịu áp lực từ bên ngoài viết code lặp đi lặp lại. nếu đã thành thạo nhiều kỹ năng, bạn có thể lập một kế hoạch hoàn chỉnh ngay cả trong những tình huống khẩn cấp.

## Tổng kết

- Mẫu thiết kế trừu tượng làm việc để giải quyết vấn đề khi trong một họ sản phẩm, có nhiều loại sản phẩm khác nhau (cụm Redis, hệ điều hành) và phải chọn interface. Và tình huống này cũng rất phổ biến trong phát triển kinh doanh, chỉ là có thời gian đôi khi không được trừu tượng hóa chúng ra.
- "Code của bạn chỉ là được lấp đầy bằng ifelse!" Khi bạn biết khi nào và trong trường hợp nào cần phải tối ưu hóa mã bằng cách sử dụng mẫu thiết kế trừu tượng, bạn có thể hoàn thành chức năng của mình và nâng cao tính mở rộng và tính dễ hiểu của mã của mình.
- Vậy nên, mẫu thiết kế này đáp ứng được các điểm: nguyên tắc trách nhiệm đơn lẻ, nguyên tắc mở đóng, tách biệt, v.v. Tuy nhiên, khi hoạt động kinh doanh tiếp tục mở rộng, nó có thể gây ra sự phức tạp trong việc triển khai lớp. Nhưng cũng có thể nói rằng đó không phải là một thiếu sót, bởi vì thiếu sót này có thể được giảm bớt khi đưa ra các phương pháp thiết kế khác, các lớp proxy và việc tạo và tải tự động.
