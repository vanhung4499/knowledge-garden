---
title: CF Cachable Annotation
tags:
  - codeforum
  - project
categories: 
date created: 2024-04-17
date modified: 2024-04-17
---

# Cacheable annotation

Trước khi giới thiệu về Caffeine, chúng tôi chủ yếu kết hợp với annotation `@Cachebale` trong Spring để sử dụng bộ nhớ cache ở cấp độ phương thức; chủ đề chính lúc đó là về Caffeine, tiếp theo chúng ta sẽ tập trung vào nhìn kỹ hơn vào các điểm kiến thức liên quan đến annotation cache trong Spring.

Lưu ý quan trọng rằng, các annotation cache trong Spring không giới hạn ở việc triển khai cache dưới, có thể sử dụng Caffeine cũng có thể sử dụng redis, memcache, guava, vv.

---

Spring đã cung cấp một chiến lược cache dựa trên annotation từ phiên bản 3.1, và nó cũng được sử dụng trong dự án.

Các điểm chính của bài viết này bao gồm:

- `@Cacheable`: Nếu dữ liệu trong cache tồn tại, nó sẽ được sử dụng trực tiếp từ cache; nếu không tồn tại, phương thức sẽ được thực thi và kết quả sẽ được đưa vào cache.
- `@CacheEvict`: Xóa dữ liệu cache.
- `@CachePut`: Cập nhật dữ liệu trong cache.

## Sử dụng Cấu Hình

### Ví dụ Sử Dụng

Chúng tôi đã áp dụng bộ nhớ cache cho dịch vụ sidebar, chủ yếu là để đạt được hiệu suất cache tốt nhất.

### Cấu Hình Cốt Lõi

Đối với các annotation cache, chỉ cần thêm phụ thuộc sau đây:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>

```

Tuy nhiên, điều quan trọng cần lưu ý là việc triển khai cụ thể của cache cũng là điều không thể thiếu, ví dụ như kỹ thuật chọn Caffeine làm bộ nhớ cache cục bộ, vì vậy chúng ta cũng thêm:

```java
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
</dependency>
```

## Giới Thiệu annotation Cache

> Về giới thiệu về các annotation, tôi sẽ giả lập một số ví dụ đơn giản và dễ hiểu hơn, không giống với cách triển khai cụ thể của dự án, vui lòng không quan tâm; nếu có bất kỳ câu hỏi nào, việc tạo một dự án khác và chạy thử là lựa chọn tốt nhất.

### 1. `@Cacheable`

Annotation này được sử dụng để trang trí cho phương thức hoặc lớp; khi chúng ta truy cập vào phương thức được trang trí, ưu tiên lấy dữ liệu từ bộ nhớ cache, nếu dữ liệu tồn tại trong cache, nó sẽ trả về trực tiếp từ cache; khi cache không tồn tại, phương thức sẽ được thực thi và kết quả sẽ được ghi vào cache.

annotation này có hai cài đặt cốt lõi khá quan trọng:

```java
	/**
	 * Tương đương với cacheNames
	 */
	@AliasFor("cacheNames")
	String[] value() default {};

	
	@AliasFor("value")
	String[] cacheNames() default {};

	/**
	 * Khóa cache
	 */
	String key() default "";
```

cacheNames có thể hiểu là tiền tố của khóa cache, có thể là biến khóa của thành phần cache; khi key không được thiết lập, nó sẽ được khởi tạo từ các tham số của phương thức, lưu ý rằng key là biểu thức SpEL, vì vậy nếu muốn sử dụng chuỗi, hãy đặt trong dấu ngoặc đơn.  

Một ví dụ sử dụng đơn giản

```java
/**
 * Đầu tiên kiểm tra từ cache, nếu tìm thấy, trả về dữ liệu cache trực tiếp; nếu không, thực thi phương thức và lưu kết quả vào cache
 * <p>
 * redisKey: cacheNames + key được kết hợp --> hỗ trợ SpEL
 * redisValue: kết quả trả về
 *
 * @param name
 * @return
 */
@Cacheable(cacheNames = "say", key = "'p_'+ #name")
public String sayHello(String name) {
    return "hello+" + name + "-->" + UUID.randomUUID().toString();
}

```

Nếu chúng ta truyền tham số là hung, thì khóa cache sẽ là `say::p_hung`

Ngoài ba giá trị cài đặt trên, những người xem kiểm tra mã nguồn annotation `@Cacheable` có thể thấy còn cài đặt `condition`, điều này chỉ ra rằng chỉ khi điều kiện được thiết lập thì mới ghi vào cache

```java
/**
 * Chỉ ghi vào cache khi điều kiện được thiết lập
 *
 * @param age
 * @return
 */
@Cacheable(cacheNames = "condition", key = "#age", condition = "#age % 2 == 0")
public String setByCondition(int age) {
    return "condition:" + age + "-->" + UUID.randomUUID().toString();
}
```

Trong trường hợp trên, chỉ khi age là số chẵn, cache mới được sử dụng; nếu không, không có cache nào được ghi vào.

Tiếp theo là tham số `unless`, từ tên có thể thấy rằng nó chỉ ghi vào cache khi không đáp ứng điều kiện

```java
/**
 * Không ghi vào cache khi không đáp ứng điều kiện
 *
 * @param age
 * @return
 */
@Cacheable(cacheNames = "unless", key = "#age", unless = "#age % 2 == 0")
public String setUnless(int age) {
    return "unless:" + age + "-->" + UUID.randomUUID().toString();
}

```

```java
/**
 * Không ghi vào cache khi không đáp ứng điều kiện
 *
 * @param age
 * @return
 */
@Cacheable(cacheNames = "unless", key = "#age", unless = "#age % 2 == 0")
public String setUnless(int age) {
    return "unless:" + age + "-->" + UUID.randomUUID().toString();
}
```

### 2. [@CachePut](/CachePut )

Không quan tâm có cache hay không, phương thức sẽ ghi kết quả trả về vào cache; thích hợp cho việc cập nhật cache.

```java
/**
 * Không quan tâm có cache hay không, phương thức sẽ ghi vào cache
 *
 * @param age
 * @return
 */
@CachePut(cacheNames = "t4", key = "#age")
public String cachePut(int age) {
    return "t4:" + age + "-->" + UUID.randomUUID().toString();
}
```

### 3. [@CacheEvict](/CacheEvict )

Annotation này làm rõ việc xóa cache.

```java
/**
 * Vô hiệu hóa cache
 *
 * @param name
 * @return
 */
@CacheEvict(cacheNames = "say", key = "'p_'+ #name")
public String evict(String name) {
    return "evict+" + name + "-->" + UUID.randomUUID().toString();
}
```

### 4. [@Caching](/Caching )

Trong thực tế, chúng ta thường gặp trường hợp cần cập nhật nhiều cache khi dữ liệu thay đổi, cho trường hợp này, có thể sử dụng `@Caching`.

```java
/**
 * Kết hợp caching, thêm cache và vô hiệu hóa các cache khác
 *
 * @param age
 * @return
 */
@Caching(cacheable = @Cacheable(cacheNames = "caching", key = "#age"), evict = @CacheEvict(cacheNames = "t4", key = "#age"))
public String caching(int age) {
    return "caching: " + age + "-->" + UUID.randomUUID().toString();
}
```

Ở trên là hoạt động kết hợp:

- Lấy dữ liệu từ cache `caching::age`, nếu không tồn tại thì thực thi phương thức và ghi vào cache;
- Vô hiệu hóa cache `t4::age`.

### 5. Khi có ngoại lệ, cache sẽ thế nào?

Các trường hợp trên đều là các tình huống bình thường, khi phương thức ném ra một ngoại lệ, cách thức hoạt động của cache sẽ như thế nào?

```java
/**
 * Dùng để kiểm tra khi có ngoại lệ, liệu có ghi vào cache không
 *
 * @param age
 * @return
 */
@Cacheable(cacheNames = "exception", key = "#age")
@Cacheable(cacheNames = "say", key = "'p_yihuihui'")
public int exception(int age) {
    return 10 / age;
}
```

Theo kết quả thực nghiệm, khi `age==0`, cả hai cache đều không thành công.

### 6. Test Cases

Tiếp theo là xác nhận xem các chú thích cache có hoạt động như mô tả trên không.

```java
@RestController
public class IndexRest {
    @Autowired
    private BasicDemo helloService;

    @GetMapping(path = {"", "/"})
    public String hello(String name) {
        return helloService.sayHello(name);
    }
}
```

Trên đây chủ yếu là xác nhận chú thích `@Cacheable`. Nếu cache không trúng, kết quả trả về mỗi lần nên khác nhau. Tuy nhiên, khi truy cập thực tế, bạn sẽ thấy rằng kết quả trả về luôn là giống nhau.

```bash
curl http://localhost:8080/?name=yihuihui
```

**Vô hiệu hóa Cache**

```java
@GetMapping(path = "evict")
public String evict(String name) {
    return helloService.evict(String.valueOf(name));
}
```

Vô hiệu hóa cache, cần phối hợp với case trên.

```bash
curl http://localhost:8080/evict?name=yihuihui
curl http://localhost:8080/?name=yihuihui
```

Các trường hợp kiểm tra còn lại là dễ hiểu, nên cũng cung cấp mã tương ứng.

```java
@GetMapping(path = "condition")
public String t1(int age) {
    return helloService.setByCondition(age);
}

@GetMapping(path = "unless")
public String t2(int age) {
    return helloService.setUnless(age);
}

@GetMapping(path = "exception")
public String exception(int age) {
    try {
        return String.valueOf(helloService.exception(age));
    } catch (Exception e) {
        return e.getMessage();
    }
}

@GetMapping(path = "cachePut")
public String cachePut(int age) {
    return helloService.cachePut(age);
}
```

### 7. Tổng kết

#### Mã nguồn ví dụ

Mã nguồn ví dụ cho các trường hợp kiểm tra có thể tìm thấy dưới đây:

- [https://github.com/liuyueyi/spring-boot-demo/tree/master/spring-boot/125-cache-ano](https://github.com/liuyueyi/spring-boot-demo/tree/master/spring-boot/125-cache-ano)

#### Tóm tắt kiến thức

Cuối cùng, hãy tổng kết lại một số chú thích cache mà Spring cung cấp:

- `@Cacheable`: Nếu cache tồn tại, thì lấy từ cache; nếu không, thực thi phương thức và lưu kết quả vào cache.
- `@CacheEvit`: Xóa cache.
- `@CachePut`: Cập nhật cache.
- `@Caching`: Kết hợp các chú thích.

#### Mở rộng kiến thức

Vẫn còn một điểm quan trọng chưa được đề cập, là làm thế nào để đặt thời gian hết hạn cho cache? Trong dự án này, cấu hình cache được quản lý bởi Caffeine, được định nghĩa cốt lõi trong `ForumCoreAutoConfig`.

```java
@Bean("caffeineCacheManager")
public CacheManager cacheManager() {
    CaffeineCacheManager cacheManager = new CaffeineCacheManager();
    cacheManager.setCaffeine(Caffeine.newBuilder()
            // Thiết lập thời gian hết hạn, hết hạn sau năm phút sau khi ghi vào
            .expireAfterWrite(5, TimeUnit.MINUTES)
            // Khởi tạo kích thước không gian cache
            .initialCapacity(100)
            // Số lượng tối đa của cache
            .maximumSize(200)
    );
    return cacheManager;
}
```

Tuy nhiên, cần lưu ý rằng nếu bạn sử dụng Redis để làm cache, thì thời gian hết hạn của các loại cache khác nhau thường không giống nhau. Vậy thì làm thế nào để thiết lập thời gian hết hạn cho các cache này?
