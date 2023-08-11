---
title: SpringBoot Async
tags: [spring, java, backend]
categories: [spring, java, backend]
date created: 2023-08-11
date modified: 2023-08-11
---

# Hướng dẫn Spring Boot về xử lý yêu cầu bất đồng bộ

## Chú thích `@EnableAsync`

Để sử dụng `@Async`, trước tiên cần sử dụng chú thích `@EnableAsync` để bật tính năng bất đồng bộ trong Spring Boot.

```java
@Configuration
@EnableAsync
public class AppConfig {
}
```

Để biết thêm chi tiết về cấu hình, bạn có thể tham khảo: [`AsyncConfigurer`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/scheduling/annotation/AsyncConfigurer.html)

## Chú thích `@Async`

### Các cách sử dụng được hỗ trợ

(1) **Phương thức không có tham số và không có giá trị trả về**

Bạn có thể sử dụng chú thích `@Async` để đánh dấu phương thức này là phương thức được gọi bất đồng bộ. Nói cách khác, khi chương trình gọi phương thức này, nó sẽ trả về ngay lập tức, trong khi việc thực thi phương thức xảy ra trong tác vụ đã được gửi đến `TaskExecutor` của Spring. Trong trường hợp đơn giản nhất, bạn có thể áp dụng chú thích này cho phương thức trả về void, như ví dụ dưới đây:

```java
@Async
void doSomething() {
    // phần này sẽ được thực thi bất đồng bộ
}
```

(2) **Phương thức có tham số nhưng không có giá trị trả về**

Khác với việc sử dụng chú thích `@Scheduled`, các phương thức này có thể chỉ định các tham số vì chúng được gọi bởi người gọi theo cách "bình thường" trong thời gian chạy, chứ không phải là bởi các tác vụ lập lịch được quản lý bởi container. Ví dụ, đoạn mã dưới đây là một ứng dụng hợp lệ của chú thích `@Async`:

```java
@Async
void doSomething(String s) {
    // phần này sẽ được thực thi bất đồng bộ
}
```

(3) **Phương thức có tham số và có giá trị trả về**

Bạn cũng có thể gọi bất đồng bộ các phương thức trả về giá trị. Tuy nhiên, các phương thức này cần có kiểu trả về là `Future`. Điều này vẫn cung cấp lợi ích của việc thực thi bất đồng bộ để người gọi có thể thực hiện các nhiệm vụ khác trước khi gọi `get()` trên `Future`. Ví dụ dưới đây cho thấy cách sử dụng `@Async` trên phương thức trả về giá trị:

```java
@Async
Future<String> returnSomething(int i) {
    // phần này sẽ được thực thi bất đồng bộ
}
```

### Các cách sử dụng không được hỗ trợ

`@Async` không thể được sử dụng cùng với các gọi lại vòng đời như `@PostConstruct`.

Để khởi tạo bất đồng bộ bean Spring, bạn phải sử dụng một bean khởi tạo riêng biệt và sau đó gọi phương thức được chú thích `@Async` trên mục tiêu, như ví dụ dưới đây:

```java
public class SampleBeanImpl implements SampleBean {

    @Async
    void doSomething() {
        // ...
    }

}

public class SampleBeanInitializer {

    private final SampleBean bean;

    public SampleBeanInitializer(SampleBean bean) {
        this.bean = bean;
    }

    @PostConstruct
    public void initialize() {
        bean.doSomething();
    }

}
```

## Xác định rõ bộ thực thi

Mặc định, khi chú thích `@Async` trên phương thức, bộ thực thi được sử dụng là bộ thực thi được cấu hình khi bật hỗ trợ bất đồng bộ, tức là nếu sử dụng XML hoặc `AsyncConfigurer` (nếu có). Tuy nhiên, nếu bạn cần chỉ định một bộ thực thi khác ngoài giá trị mặc định khi thực thi phương thức cụ thể, bạn có thể sử dụng thuộc tính value của chú thích `@Async`. Ví dụ dưới đây cho thấy cách thực hiện điều này:

```java
@Async("otherExecutor")
void doSomething(String s) {
    // phần này sẽ được thực thi bất đồng bộ bởi "otherExecutor"
}
```

Trong trường hợp này, "otherExecutor" có thể là tên của bất kỳ bean Executor nào trong container Spring, hoặc là tên của bất kỳ qualifier nào liên quan đến bất kỳ Executor nào (ví dụ: sử dụng phần tử `<qualifier>` hoặc chú thích `@Qualifier` của Spring).

## Quản lý ngoại lệ của `@Async`

Khi kiểu trả về của phương thức `@Async` là kiểu `Future`, quản lý ngoại lệ xảy ra trong quá trình thực thi phương thức rất dễ dàng, vì ngoại lệ sẽ được ném ra khi gọi `get()` kết quả. Tuy nhiên, đối với các phương thức trả về kiểu void, ngoại lệ không được bắt và không thể truyền đi. Bạn có thể cung cấp `AsyncUncaughtExceptionHandler` để xử lý các ngoại lệ này. Ví dụ dưới đây cho thấy cách thực hiện điều này:

```java
public class MyAsyncUncaughtExceptionHandler implements AsyncUncaughtExceptionHandler {

    @Override
    public void handleUncaughtException(Throwable ex, Method method, Object... params) {
        // xử lý ngoại lệ
    }
}
```

Mặc định, chỉ ghi lại ngoại lệ. Bạn có thể xác định `AsyncUncaughtExceptionHandler` tùy chỉnh bằng cách sử dụng `AsyncConfigurer` hoặc phần tử `<task:annotation-driven />` trong XML.

## Mã nguồn ví dụ

> Mã nguồn ví dụ: [spring-boot-async](https://github.com/dunwu/spring-boot-tutorial/tree/master/codes/spring-boot-async)

## Tài liệu tham khảo

- [Spring Boot Official Documentation - boot-features-external-config](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-features-external-config)
- [Spring Boot Official Documentation - scheduling-annotation-support](https://docs.spring.io/spring/docs/current/spring-framework-reference/integration.html#scheduling-annotation-support)
