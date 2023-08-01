---
title: Spring Validation
tags: [spring, java, backend]
categories: [spring, java, backend]
date created: 2023-07-26
date modified: 2023-07-26
---

# Spring Validation

Java API Specification (JSR303) định nghĩa các tiêu chuẩn kiểm tra Bean, nhưng không cung cấp triển khai. Hibernate Validation là một triển khai của tiêu chuẩn này và bổ sung các chú thích kiểm tra như @Email, @Length, v.v. Spring Validation là một lớp bọc thứ hai của Hibernate Validation, được sử dụng để hỗ trợ kiểm tra tự động các tham số trong Spring MVC.

## Bắt đầu nhanh

### Thêm phụ thuộc

Nếu phiên bản Spring Boot nhỏ hơn 2.3.x, spring-boot-starter-web sẽ tự động thêm phụ thuộc hibernate-validator. Nếu phiên bản Spring Boot lớn hơn 2.3.x, bạn cần thêm phụ thuộc thủ công:

```xml
<dependency>
  <groupId>org.hibernate.validator</groupId>
  <artifactId>hibernate-validator-parent</artifactId>
  <version>6.2.5.Final</version>
</dependency>
```

Đối với dịch vụ web, để tránh ảnh hưởng của các tham số không hợp lệ đến kinh doanh, bạn nên luôn thực hiện kiểm tra tham số trong lớp Controller! Trong hầu hết các trường hợp, tham số yêu cầu có hai dạng như sau:

- Yêu cầu POST, PUT, sử dụng requestBody để truyền tham số;
- Yêu cầu GET, sử dụng requestParam/PathVariable để truyền tham số.

Thực tế, cho dù là kiểm tra tham số requestBody hay kiểm tra cấp độ phương thức, cuối cùng đều gọi Hibernate Validator để thực hiện kiểm tra, Spring Validation chỉ là một lớp bọc.

### Ví dụ về kiểm tra

(1) Đánh dấu chú thích kiểm tra trên đối tượng

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements Serializable {

    @NotNull
    private Long id;

    @NotBlank
    @Size(min = 2, max = 10)
    private String name;

    @Min(value = 1)
    @Max(value = 100)
    private Integer age;

}
```

(2) Khai báo chú thích kiểm tra trên tham số phương thức

```java
@Slf4j
@Validated
@RestController
@RequestMapping("validate1")
public class ValidatorController {

    /**
     * Kiểm tra tham số {@link RequestBody}
     */
    @PostMapping(value = "save")
    public DataResult<Boolean> save(@Valid @RequestBody User entity) {
        log.info("Lưu một bản ghi: {}", JSONUtil.toJsonStr(entity));
        return DataResult.ok(true);
    }

    /**
     * Kiểm tra tham số {@link RequestParam}
     */
    @GetMapping(value = "queryByName")
    public DataResult<User> queryByName(
        @RequestParam("username")
        @NotBlank
        @Size(min = 2, max = 10)
        String name
    ) {
        User user = new User(1L, name, 18);
        return DataResult.ok(user);
    }

    /**
     * Kiểm tra tham số {@link PathVariable}
     */
    @GetMapping(value = "detail/{id}")
    public DataResult<User> detail(@PathVariable("id") @Min(1L) Long id) {
        User user = new User(id, "Lý Tứ", 18);
        return DataResult.ok(user);
    }

}
```

(3) Nếu tham số yêu cầu không đáp ứng các quy tắc kiểm tra, sẽ ném ra ngoại lệ `ConstraintViolationException` hoặc `MethodArgumentNotValidException`.

### Xử lý ngoại lệ thống nhất

Trong quá trình phát triển dự án thực tế, thường sẽ sử dụng xử lý ngoại lệ thống nhất để trả về một thông báo thân thiện hơn.

```java
@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Xử lý tất cả các ngoại lệ không xác định
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(Throwable.class)
    public Result handleException(Throwable e) {
        log.error("Ngoại lệ không xác định", e);
        return new Result(ResultStatus.HTTP_SERVER_ERROR.getCode(), e.getMessage());
    }

    /**
     * Xử lý ngoại lệ kiểm tra tham số yêu cầu (truyền tham số thông thường)
     *
     * @param e ConstraintViolationException
     * @return {@link DataResult}
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ ConstraintViolationException.class })
    public Result handleConstraintViolationException(final ConstraintViolationException e) {
        log.error("ConstraintViolationException", e);
        List<String> errors = new ArrayList<>();
        for (ConstraintViolation<?> violation : e.getConstraintViolations()) {
            Path path = violation.getPropertyPath();
            List<String> pathArr = StrUtil.split(path.toString(), ',');
            errors.add(pathArr.get(0) + " " + violation.getMessage());
        }
        return new Result(ResultStatus.REQUEST_ERROR.getCode(), CollectionUtil.join(errors, ","));
    }

    /**
     * Xử lý ngoại lệ kiểm tra tham số yêu cầu
     *
     * @param e MethodArgumentNotValidException
     * @return {@link DataResult}
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ MethodArgumentNotValidException.class })
    private Result handleMethodArgumentNotValidException(final MethodArgumentNotValidException e) {
        log.error("MethodArgumentNotValidException", e);
        List<String> errors = new ArrayList<>();
        for (ObjectError error : e.getBindingResult().getAllErrors()) {
            errors.add(((FieldError) error).getField() + " " + error.getDefaultMessage());
        }
        return new Result(ResultStatus.REQUEST_ERROR.getCode(), CollectionUtil.join(errors, ","));
    }

}
```

## Sử dụng nâng cao

### Kiểm tra theo nhóm

Trong dự án thực tế, có thể có nhiều phương thức sử dụng cùng một lớp DTO để nhận tham số, nhưng các quy tắc kiểm tra có thể khác nhau. Trong trường hợp này, việc đơn giản chỉ thêm chú thích kiểm tra trên trường của lớp DTO không thể giải quyết vấn đề này. Do đó, spring-validation hỗ trợ tính năng kiểm tra theo nhóm, được sử dụng đặc biệt để giải quyết vấn đề này.

(1) Định nghĩa các nhóm

```java
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface AddCheck { }

@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface EditCheck { }
```

(2) Đánh dấu chú thích kiểm tra trên đối tượng

```java
@Data
public class User2 {

    @NotNull(groups = EditCheck.class)
    private Long id;

    @NotNull(groups = { AddCheck.class, EditCheck.class })
    @Size(min = 2, max = 10, groups = { AddCheck.class, EditCheck.class })
    private String name;

    @IsMobile(message = "Không phải là số điện thoại hợp lệ", groups = { AddCheck.class, EditCheck.class })
    private String mobile;

}
```

(3) Kiểm tra theo nhóm trong phương thức

```java
@Slf4j
@Validated
@RestController
@RequestMapping("validate2")
public class ValidatorController2 {

    /**
     * Kiểm tra tham số {@link RequestBody}
     */
    @PostMapping(value = "add")
    public DataResult<Boolean> add(@Validated(AddCheck.class) @RequestBody User2 entity) {
        log.info("Thêm một bản ghi: {}", JSONUtil.toJsonStr(entity));
        return DataResult.ok(true);
    }

    /**
     * Kiểm tra tham số {@link RequestBody}
     */
    @PostMapping(value = "edit")
    public DataResult<Boolean> edit(@Validated(EditCheck.class) @RequestBody User2 entity) {
        log.info("Chỉnh sửa một bản ghi: {}", JSONUtil.toJsonStr(entity));
        return DataResult.ok(true);
    }

}
```

### Kiểm tra lồng nhau

Trong các ví dụ trước, các trường trong lớp DTO đều là kiểu dữ liệu cơ bản và kiểu String. Tuy nhiên, trong thực tế, có thể có một trường là một đối tượng, trong trường hợp này, chúng ta có thể sử dụng kiểm tra lồng nhau.

Ví dụ, khi lưu thông tin User, cùng với đó còn có thông tin Job. Lưu ý rằng trường tương ứng trong lớp DTO phải được đánh dấu bằng chú thích @Valid.

```java
@Data
public class UserDTO {

    @Min(value = 10000000000000000L, groups = Update.class)
    private Long userId;

    @NotNull(groups = {Save.class, Update.class})
    @Length(min = 2, max = 10, groups = {Save.class, Update.class})
    private String userName;

    @NotNull(groups = {Save.class, Update.class})
    @Length(min = 6, max = 20, groups = {Save.class, Update.class})
    private String account;

    @NotNull(groups = {Save.class, Update.class})
    @Length(min = 6, max = 20, groups = {Save.class, Update.class})
    private String password;

    @NotNull(groups = {Save.class, Update.class})
    @Valid
    private Job job;

    @Data
    public static class Job {

        @Min(value = 1, groups = Update.class)
        private Long jobId;

        @NotNull(groups = {Save.class, Update.class})
        @Length(min = 2, max = 10, groups = {Save.class, Update.class})
        private String jobName;

        @NotNull(groups = {Save.class, Update.class})
        @Length(min = 2, max = 10, groups = {Save.class, Update.class})
        private String position;
    }

    /**
     * Nhóm kiểm tra khi lưu
     */
    public interface Save {
    }

    /**
     * Nhóm kiểm tra khi cập nhật
     */
    public interface Update {
    }
}
```

Kiểm tra lồng nhau có thể kết hợp với kiểm tra theo nhóm. Ngoài ra, kiểm tra lồng nhau cũng sẽ kiểm tra từng phần tử trong tập hợp, ví dụ như trường `List<Job>` sẽ kiểm tra từng đối tượng Job trong danh sách.

### Tạo chú thích kiểm tra tùy chỉnh

(1) Tạo chú thích kiểm tra tùy chỉnh `@IsMobile`

```java
@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
@Retention(RUNTIME)
@Constraint(validatedBy = MobileValidator.class)
public @interface IsMobile {

    String message();

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
```

(2) Triển khai giao diện `ConstraintValidator`, viết trình phân tích cho chú thích kiểm tra `@IsMobile`

```java
public class MobileValidator implements ConstraintValidator<IsMobile, String> {

    @Override
    public void initialize(IsMobile isMobile) { }

    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        if (StrUtil.isBlank(s)) {
            return false;
        } else {
            return ValidatorUtil.isMobile(s);
        }
    }

}
```

### Tùy chỉnh kiểm tra

Có thể tạo kiểm tra tùy chỉnh bằng cách triển khai giao diện `org.springframework.validation.Validator`.

Có các điểm sau:

- Triển khai phương thức `supports`
- Triển khai phương thức `validate`
  - Sử dụng đối tượng `Errors` để thu thập lỗi
    - `ObjectError`: Lỗi của đối tượng (Bean)
    - `FieldError`: Lỗi của thuộc tính (Property) của đối tượng (Bean)
  - Sử dụng `ObjectError` và `FieldError` để liên kết với `MessageSource` để lấy thông báo lỗi cuối cùng

```java
@Component
public class CustomValidator implements Validator {

    private final CustomValidatorConfig validatorConfig;

    public CustomValidator(CustomValidatorConfig validatorConfig) {
        this.validatorConfig = validatorConfig;
    }

    /**
     * Validator chỉ áp dụng cho đối tượng Person
     */
    @Override
    public boolean supports(Class<?> clazz) {
        return Person.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        ValidationUtils.rejectIfEmpty(errors, "name", "name.empty");

        List<Field> fields = getFields(target.getClass());
        for (Field field : fields) {
            Annotation[] annotations = field.getAnnotations();
            for (Annotation annotation : annotations) {
                if (annotation.annotationType().getAnnotation(Valid.class) != null) {
                    try {
                        ValidatorRule validatorRule = validatorConfig.findRule(annotation);
                        if (validatorRule != null) {
                            validatorRule.valid(annotation, target, field, errors);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    private List<Field> getFields(Class<?> clazz) {
        // Mảng Field
        List<Field> fields = new ArrayList<>();
        // Nếu kiểu class không rỗng
        while (clazz != null) {
            // Thêm thuộc tính vào mảng thuộc tính
            Collections.addAll(fields, clazz.getDeclaredFields());
            clazz = clazz.getSuperclass();
        }
        return fields;
    }

}
```

### Chế độ thất bại nhanh (Fail Fast)

Mặc định, Spring Validation sẽ kiểm tra tất cả các trường và sau đó mới ném ra ngoại lệ. Bạn có thể bật chế độ Fail Fast bằng cách cấu hình đơn giản, trong đó nếu kiểm tra thất bại, nó sẽ ngay lập tức trả về kết quả.

```java
@Bean
public Validator validator() {
    ValidatorFactory validatorFactory = Validation.byProvider(HibernateValidator.class)
            .configure()
            // Chế độ thất bại nhanh
            .failFast(true)
            .buildValidatorFactory();
    return validatorFactory.getValidator();
}
```

## Nguyên lý của Spring Validation

### Các tình huống sử dụng Spring Validation

- Kiểm tra thông thường của Spring (Validator)
- Ràng buộc dữ liệu của Spring (DataBinder)
- Ràng buộc tham số của Spring Web (WebDataBinder)
- Kiểm tra tham số phương thức trong Spring WebMVC/WebFlux

### Thiết kế giao diện Validator

- Trách nhiệm giao diện
  - Giao diện kiểm tra nội bộ của Spring, kiểm tra đối tượng mục tiêu bằng cách lập trình
- Phương thức chính
  - `supports(Class)`: Kiểm tra xem lớp mục tiêu có thể được kiểm tra hay không
  - `validate(Object, Errors)`: Kiểm tra đối tượng mục tiêu và đưa ra thông báo lỗi vào đối tượng Errors
- Các thành phần đi kèm
  - Bộ thu thập lỗi: `org.springframework.validation.Errors`
  - Lớp tiện ích Validator: `org.springframework.validation.ValidationUtils`

### Thiết kế giao diện Errors

- Trách nhiệm giao diện
  - Giao diện thu thập lỗi ràng buộc và kiểm tra dữ liệu, có mối quan hệ mạnh với Java Bean và các thuộc tính của nó.
- Phương thức chính
  - Phương thức `reject` (nạp chồng): Thu thập thông tin lỗi
  - Phương thức `rejectValue` (nạp chồng): Thu thập thông tin lỗi trong trường của đối tượng
- Các thành phần đi kèm
  - Mô tả lỗi Java Bean: `org.springframework.validation.ObjectError`
  - Mô tả lỗi thuộc tính Java Bean: `org.springframework.validation.FieldError`

### Nguồn thông tin lỗi của Errors

Các bước tạo thông tin lỗi

- Chọn giao diện Errors (ví dụ: `org.springframework.validation.BeanPropertyBindingResult`)
- Gọi phương thức reject hoặc rejectValue
- Lấy đối tượng ObjectError hoặc FieldError từ đối tượng Errors
- Liên kết code và args trong ObjectError hoặc FieldError với giao diện MessageSource (ví dụ: `ResourceBundleMessageSource`)

### Nguyên lý thực hiện kiểm tra trong Spring Web

#### Cơ chế thực hiện kiểm tra tham số RequestBody

Trong Spring MVC, `RequestResponseBodyMethodProcessor` được sử dụng để phân tích các tham số được đánh dấu bằng `@RequestBody` và xử lý giá trị trả về của các phương thức được đánh dấu bằng `@ResponseBody`. Trong đó, logic thực hiện kiểm tra tham số nằm trong phương thức `resolveArgument()`:

```java
@Override
public Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
    NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception {

    parameter = parameter.nestedIfOptional();
    Object arg = readWithMessageConverters(webRequest, parameter, parameter.getNestedGenericParameterType());
    String name = Conventions.getVariableNameForParameter(parameter);

    if (binderFactory != null) {
        WebDataBinder binder = binderFactory.createBinder(webRequest, arg, name);
        if (arg != null) {
            // Thử thực hiện kiểm tra tham số
            validateIfApplicable(binder, parameter);
            if (binder.getBindingResult().hasErrors() && isBindExceptionRequired(binder, parameter)) {
                // Nếu có lỗi kiểm tra, ném ra MethodArgumentNotValidException
                throw new MethodArgumentNotValidException(parameter, binder.getBindingResult());
            }
        }
        if (mavContainer != null) {
            mavContainer.addAttribute(BindingResult.MODEL_KEY_PREFIX + name, binder.getBindingResult());
        }
    }

    return adaptArgumentIfNecessary(arg, parameter);
}
```

Có thể thấy, `resolveArgument()` gọi hàm `validateIfApplicable()` để thực hiện kiểm tra tham số.

```java
protected void validateIfApplicable(WebDataBinder binder, MethodParameter parameter) {
    // Lấy các chú thích của tham số, như @RequestBody, @Valid, @Validated
    Annotation[] annotations = parameter.getParameterAnnotations();
    for (Annotation ann : annotations) {
        // Trước tiên, thử lấy chú thích @Validated
        Validated validatedAnn = AnnotationUtils.getAnnotation(ann, Validated.class);
        // Nếu có chú thích @Validated, bắt đầu kiểm tra trực tiếp.
        // Nếu không có, kiểm tra xem trước tham số có chú thích bằng Valid không.
        if (validatedAnn != null || ann.annotationType().getSimpleName().startsWith("Valid")) {
            Object hints = (validatedAnn != null ? validatedAnn.value() : AnnotationUtils.getValue(ann));
            Object[] validationHints = (hints instanceof Object[] ? (Object[]) hints : new Object[] {hints});
            // Thực hiện kiểm tra
            binder.validate(validationHints);
            break;
        }
    }
}
```

Đoạn mã trên giải thích lý do tại sao Spring có thể hỗ trợ cùng lúc hai chú thích `@Validated` và `@Valid`.

Tiếp theo, xem xét cài đặt của `WebDataBinder.validate()`:

```typescript
@Override
public void validate(Object target, Errors errors, Object... validationHints) {
    if (this.targetValidator != null) {
        processConstraintViolations(
            // Ở đây, Hibernate Validator được gọi để thực hiện kiểm tra thực tế
            this.targetValidator.validate(target, asValidationGroups(validationHints)), errors);
    }
}
```

Từ đoạn mã trên, có thể thấy rằng Spring thực tế là đóng gói dựa trên Hibernate Validator để thực hiện kiểm tra.

#### Cơ chế thực hiện kiểm tra tham số cấp phương thức

Spring hỗ trợ việc chặn và kiểm tra dựa trên phương thức bằng cách sử dụng công nghệ AOP. Cụ thể, nó sử dụng `MethodValidationPostProcessor` để đăng ký động một khía cạnh AOP, sau đó sử dụng `MethodValidationInterceptor` để tăng cường các phương thức điểm cắt.

```java
public class MethodValidationPostProcessor extends AbstractBeanFactoryAwareAdvisingPostProcessor implements InitializingBean {
    @Override
    public void afterPropertiesSet() {
        // Tạo một khía cạnh cho tất cả các Bean được đánh dấu bằng @Validated
        Pointcut pointcut = new AnnotationMatchingPointcut(this.validatedAnnotationType, true);
        // Tạo Advisor để tăng cường
        this.advisor = new DefaultPointcutAdvisor(pointcut, createMethodValidationAdvice(this.validator));
    }

    // Tạo Advice, thực chất là một MethodInterceptor
    protected Advice createMethodValidationAdvice(@Nullable Validator validator) {
        return (validator != null ? new MethodValidationInterceptor(validator) : new MethodValidationInterceptor());
    }
}
```

Tiếp theo, xem xét `MethodValidationInterceptor`:

```java
public class MethodValidationInterceptor implements MethodInterceptor {
    @Override
    public Object invoke(MethodInvocation invocation) throws Throwable {
        // Bỏ qua các phương thức không cần tăng cường
        if (isFactoryBeanMetadataMethod(invocation.getMethod())) {
            return invocation.proceed();
        }
        // Xác định thông tin nhóm
        Class<?>[] groups = determineValidationGroups(invocation);
        ExecutableValidator execVal = this.validator.forExecutables();
        Method methodToValidate = invocation.getMethod();
        Set<ConstraintViolation<Object>> result;
        try {
            // Kiểm tra tham số đầu vào của phương thức, cuối cùng vẫn dựa trên Hibernate Validator để thực hiện kiểm tra
            result = execVal.validateParameters(
                invocation.getThis(), methodToValidate, invocation.getArguments(), groups);
        }
        catch (IllegalArgumentException ex) {
            ...
        }
        // Nếu có lỗi, ném ra ConstraintViolationException
        if (!result.isEmpty()) {
            throw new ConstraintViolationException(result);
        }
        // Gọi phương thức thực tế
        Object returnValue = invocation.proceed();
        // Kiểm tra giá trị trả về, cuối cùng vẫn dựa trên Hibernate Validator để thực hiện kiểm tra
        result = execVal.validateReturnValue(invocation.getThis(), methodToValidate, returnValue, groups);
        // Nếu có lỗi, ném ra ConstraintViolationException
        if (!result.isEmpty()) {
            throw new ConstraintViolationException(result);
        }
        return returnValue;
    }
}
```

Thực tế, cho dù là kiểm tra tham số RequestBody hay kiểm tra cấp phương thức, cuối cùng đều sử dụng Hibernate Validator để thực hiện kiểm tra, và Spring Validation chỉ là một lớp bao bọc.

## Câu hỏi

**Spring có những thành phần chính nào trong việc kiểm tra dữ liệu?**

- Validator: `org.springframework.validation.Validator`
- Errors: `org.springframework.validation.Errors`
- Mô tả lỗi Java Bean: `org.springframework.validation.ObjectError`
- Mô tả lỗi thuộc tính Java Bean: `org.springframework.validation.FieldError`
- Adapter cho Bean Validation: `org.springframework.validation.beanvalidation.LocalValidatorFactoryBean`
