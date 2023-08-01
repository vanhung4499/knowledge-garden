---
title: Spring AOP
tags: [spring, java, backend, aop]
categories: [spring, java, backend]
date created: 2023-07-26
date modified: 2023-07-26
---

# Spring AOP

## Khái niệm về AOP

### AOP là gì?

AOP (Aspect-Oriented Programming - Lập trình hướng khía cạnh) là một phương pháp lập trình bổ sung cho OOP (Object-Oriented Programming - Lập trình hướng đối tượng), cung cấp một góc nhìn khác về cấu trúc phần mềm.

Trong OOP, chúng ta sử dụng lớp (class) làm đơn vị cơ bản, trong khi trong AOP, đơn vị cơ bản là **Aspect (khía cạnh)**.

### Thuật ngữ

#### Aspect (Khía cạnh)

`Aspect` gồm có `pointcut` và `advice`, nó không chỉ định nghĩa logic chéo (cross-cutting logic) mà còn định nghĩa các điểm nối (join point). Spring AOP là framework thực hiện khía cạnh, nó sẽ thực hiện logic chéo được định nghĩa trong khía cạnh vào các điểm nối được chỉ định trong khía cạnh.  
Trọng tâm của AOP là làm thế nào để nối các phần mở rộng vào các điểm nối của đối tượng mục tiêu, điều này bao gồm hai công việc:

1. Làm thế nào để định vị các điểm nối cụ thể bằng cách sử dụng pointcut và advice.
2. Làm thế nào để viết mã khía cạnh trong advice.

**Có thể đơn giản coi rằng, một lớp được chú thích bằng @Aspect là một khía cạnh.**

#### Advice (Lời khuyên)

Là một đoạn mã được aspect thêm vào điểm nối cụ thể (tức là điểm nối thỏa mãn quy tắc pointcut). Nhiều framework AOP, bao gồm Spring AOP, sẽ mô phỏng advice như một interceptor và duy trì nhiều advice trên một điểm nối, thực hiện việc chặn từng tầng.  
Ví dụ, để thực hiện xác thực HTTP, chúng ta có thể thêm advice vào mỗi phương thức được đánh dấu bằng @RequestMapping. Khi yêu cầu HTTP đến, nó sẽ trước tiên đi qua advice, ở đây chúng ta có thể phân tích xem yêu cầu HTTP có quyền tương ứng hay không. Nếu có, thì thực hiện Controller, nếu không, ném ra ngoại lệ. Advice ở đây đóng vai trò như một interceptor xác thực.

#### Join point (Điểm nối)

> Một điểm trong quá trình thực thi chương trình, chẳng hạn như việc thực thi một phương thức hoặc xử lý một ngoại lệ. Trong Spring AOP, một điểm nối luôn đại diện cho việc thực thi một phương thức.

Là một thời điểm trong quá trình chạy chương trình, ví dụ như việc thực thi một phương thức hoặc xử lý một ngoại lệ. `Trong Spring AOP, điểm nối luôn đại diện cho việc thực thi một phương thức.`

#### Pointcut (Điểm cắt)

Là một tiền đề (predicate) khớp với các điểm nối. Advice được liên kết với pointcut và được thực hiện trong các điểm nối phù hợp với pointcut.  
`Trong Spring, tất cả các phương thức có thể coi là điểm nối, nhưng chúng ta không muốn thêm advice vào tất cả các phương thức, và vai trò của pointcut là cung cấp một tập hợp các quy tắc (sử dụng AspectJ pointcut expression language) để khớp với điểm nối, và thêm advice vào các điểm nối phù hợp với quy tắc.`

#### Sự khác biệt giữa join point và point cut

Trong Spring AOP, tất cả các phương thức được thực thi đều là join point. Trong khi đó, point cut là một thông tin mô tả, nó điều chỉnh cho join point. Thông qua point cut, chúng ta có thể xác định những join point nào có thể được kết hợp với Advice. Do đó, join point và point cut trong bản chất là hai khía cạnh khác nhau.

`Advice được thực thi trên join point, trong khi đó, point cut quy định rõ ràng những advice nào có thể được áp dụng lên những joint point`

#### Giới thiệu (Introduction)

Là việc thêm các phương thức hoặc trường hợp mới cho một kiểu dữ liệu. Spring AOP cho phép chúng ta giới thiệu các giao diện (và cài đặt tương ứng) mới cho một bean. Ví dụ, chúng ta có thể sử dụng giới thiệu để thêm giao diện IsModified cho một bean và từ đó đơn giản hóa việc cài đặt caching.

#### Đối tượng mục tiêu (Target)

Là đối tượng mà advice được thêm vào. Đối tượng mục tiêu cũng được gọi là `advised object`.  
`Vì Spring AOP sử dụng proxy thời gian chạy để thực hiện aspect, nên advised object luôn là một đối tượng proxy.`

#### AOP proxy

Là một lớp được thêm vào aspect và các đối tượng khác, tạo ra một đối tượng đã được tăng cường (adviced object) kết hợp giữa lớp gốc và logic tăng cường.  
Trong Spring AOP, một proxy AOP là một đối tượng proxy động JDK hoặc đối tượng proxy CGLIB.

#### Weaving (Việc tạo ra)

Là quá trình kết hợp aspect và các đối tượng khác để tạo ra advised object.  
Có ba phương pháp weaving trong AOP:

- Weaving biên dịch, yêu cầu một trình biên dịch Java đặc biệt.
- Weaving trong quá trình tải lớp, yêu cầu một trình tải lớp đặc biệt.
- Weaving động, thêm tăng cường (advice) cho lớp mục tiêu trong thời gian chạy bằng cách tạo ra một lớp con.  
  Spring sử dụng weaving động và AspectJ sử dụng weaving biên dịch và weaving trong quá trình tải lớp.

### Các loại advice

- Before advice: Là advice được thực hiện trước điểm nối. Mặc dù before advice được thực hiện trước điểm nối, nhưng nó không ngăn chặn việc thực thi điểm nối, trừ khi có ngoại lệ xảy ra (nghĩa là chúng ta không thể quyết định có tiếp tục thực thi mã trong điểm nối hay không trong advice trước).
- After return advice: Là advice được thực hiện sau khi điểm nối trả về một cách bình thường.
- After throwing advice: Là advice được thực hiện sau khi điểm nối ném ra một ngoại lệ.
- After(final) advice: Là advice được thực hiện sau khi điểm nối kết thúc, bất kể có thoát bình thường hay xảy ra ngoại lệ.
- Around advice: Là advice được thực hiện trước và sau điểm nối. Đây là loại advice phổ biến nhất.

### Về AOP Proxy

Spring AOP mặc định sử dụng kỹ thuật proxy động JDK chuẩn để thực hiện proxy AOP, thông qua đó chúng ta có thể tạo ra proxy cho bất kỳ giao diện nào.  
`Nếu cần tạo proxy cho một lớp, chúng ta có thể sử dụng proxy CGLIB.` Khi một đối tượng logic không triển khai giao diện, Spring AOP mặc định sử dụng CGLIB làm proxy AOP. Điều này có nghĩa là nếu chúng ta muốn thêm advice vào một phương thức nhưng phương thức đó không phải là phương thức được cung cấp bởi một giao diện, thì Spring AOP sẽ sử dụng CGLIB để tạo ra proxy động. Vì vậy, Spring AOP khuyến khích lập trình dựa trên giao diện, thực hiện AOP trên giao diện chứ không phải lớp.

### Hiểu rõ về aspect, join point, pointcut và advice

Sau khi đọc phần kiến thức lý thuyết trên, tôi tin rằng có nhiều bạn vẫn cảm thấy khá mơ hồ về khái niệm AOP, và không hiểu rõ về các khái niệm trong AOP như aspect, join point, pointcut và advice. Thực sự đây là điều bình thường, vì có quá nhiều khái niệm trong AOP, tôi cũng mất nhiều công sức để hiểu rõ chúng.

Dưới đây, tôi sẽ sử dụng một ví dụ đơn giản để giải thích mối quan hệ giữa aspect, join point, pointcut và advice trong AOP.

Hãy giả sử rằng, trước đây có một thị trấn nhỏ tên là Java, vào một đêm trăng tối và gió mạnh, có một vụ án xảy ra trong thị trấn này. Kẻ thủ ác rất khôn ngoan, không để lại bất kỳ dấu vết quan trọng nào tại hiện trường. Nhưng may mắn thay, ông Wang vừa trở về từ nhà hàng xóm và tình cờ phát hiện ra quá trình thủ ác đang diễn ra, nhưng do đã khuya và thủ ác đang che mặt, ông Wang không nhìn rõ khuôn mặt của thủ ác, chỉ biết rằng thủ ác là một người đàn ông, chiều cao khoảng 7 feet 5 inches. Quan chức địa phương của thị trấn Java dựa trên mô tả của ông Wang, đã ra lệnh cho binh sĩ gác cổng rằng: "Bất kỳ người đàn ông nào có chiều cao 7 feet 5 inches đều phải bị bắt giữ để thẩm vấn." Bin sĩ gác cổng tất nhiên không dám không tuân thủ lệnh của quan chức, chỉ có thể bắt giữ tất cả những người phù hợp với điều kiện của ông Wang.

Hãy xem xét một chút câu chuyện trên và xem AOP có liên quan gì đến nó.  
Trước tiên, chúng ta biết rằng trong Spring AOP, join point đại diện cho tất cả các điểm thực thi phương thức, trong khi pointcut là một mô tả thông tin, nó sửa đổi join point, thông qua pointcut, chúng ta có thể xác định những join point nào có thể được thêm advice. Áp dụng vào ví dụ trên, chúng ta có thể tạo một sự tương ứng đơn giản, join point tương đương với **những người dân trong thị trấn Java**, pointcut tương đương với **lệnh của ông Wang, tức là kẻ thủ ác là một người đàn ông, chiều cao khoảng 7 feet 5 inches**, và advice tương đương với **bắt giữ để thẩm vấn**.  
Tại sao có thể so sánh như vậy?

- join point --> những người dân trong thị trấn Java: Theo định nghĩa, join point là tất cả các điểm có thể được thêm advice, trong Spring AOP, có thể coi tất cả các điểm thực thi phương thức là join point. Trong ví dụ trên, vụ án xảy ra trong thị trấn nhỏ, lý thuyết thì tất cả mọi người trong thị trấn đều có thể là kẻ thủ ác.
- pointcut --> người đàn ông, chiều cao khoảng 7 feet 5 inches: Chúng ta biết rằng tất cả các phương thức (join point) đều có thể được thêm advice, nhưng chúng ta không muốn thêm advice vào tất cả các phương thức, và vai trò của pointcut là cung cấp một tập hợp các quy tắc để khớp với join point và thêm advice vào các join point phù hợp với quy tắc. Tương tự, đối với quan chức địa phương, dù có ngu ngốc đến đâu, ông cũng biết không thể bắt giữ tất cả mọi người trong thị trấn, mà chỉ dựa trên "kẻ thủ ác là một người đàn ông, chiều cao khoảng 7 feet 5 inches", ông mới bắt giữ những người phù hợp với điều kiện đó. Ở đây, "kẻ thủ ác là một người đàn ông, chiều cao khoảng 7 feet 5 inches" là một mệnh đề mô tả, nó giới hạn phạm vi của kẻ thủ ác, những người phù hợp với mệnh đề này là những người tình nghi, cần bị bắt giữ để thẩm vấn.
- advice --> bắt giữ để thẩm vấn: Advice là một hành động, tức là một đoạn mã Java, đoạn mã này được áp dụng cho các join point mà pointcut giới hạn. Tương tự, áp dụng vào ví dụ trên, "bắt giữ để thẩm vấn" là một hành động áp dụng cho những người phù hợp với "người đàn ông, chiều cao khoảng 7 feet 5 inches" trong "thị trấn Java".
- aspect: aspect là sự kết hợp giữa pointcut và advice, vì vậy chúng ta có thể so sánh: **"Dựa trên mô tả của ông Wang, bất kỳ người đàn ông nào có chiều cao 7 feet 5 inches đều phải bị bắt giữ để thẩm vấn"** toàn bộ hành động này có thể coi là một aspect.

Hoặc chúng ta cũng có thể đơn giản so sánh từ góc độ ngữ pháp. Khi học tiếng Anh, chúng ta thường tiếp xúc với các khái niệm như "tính từ quan hệ", "câu bị động" và tương tự. Vì vậy, có thể làm một sự so sánh không chính xác rằng `joinpoint` có thể được coi là một `tân ngữ`, trong khi `pointcut` có thể tương tự như một tính từ quan hệ để trang trí cho `joinpoint`. Do đó, toàn bộ khía cạnh (`aspect`) có thể được miêu tả như sau: "Các hoạt động advice tương ứng sẽ được áp dụng vào các joinpoint thoả mãn điều kiện của pointcut".

## Hỗ trợ @AspectJ

**`@AspectJ`** là một phong cách lập trình AOP sử dụng các chú thích Java để triển khai.

AOP theo phong cách @AspectJ được giới thiệu trong AspectJ 5 và được Spring hỗ trợ.

### Kích hoạt hỗ trợ @AspectJ

@AspectJ có thể được kích hoạt bằng cách sử dụng cấu hình XML hoặc chú thích, và trong cả hai trường hợp, chúng ta phải đảm bảo rằng aspectjweaver.jar được có trong classpath.

#### Kích hoạt @AspectJ bằng cách sử dụng Java Configuration

```java
@Configuration
@EnableAspectJAutoProxy
public class AppConfig {
}
```

#### Kích hoạt @AspectJ bằng cách sử dụng XML

```
<aop:aspectj-autoproxy/>
```

### Định nghĩa aspect (khía cạnh)

Khi một Bean được chú thích bằng **@Aspect**, Spring framework sẽ tự động thu thập những Bean này và thêm chúng vào Spring AOP, ví dụ:

```java
@Component
@Aspect
public class MyTest {
}
```

`Lưu ý, chỉ sử dụng chú thích @Aspect mà không có chú thích khác như @Component sẽ không chuyển đổi một đối tượng Java thành một Bean, do đó chúng ta cần sử dụng các chú thích tương tự như @Component.`  
`Lưu ý, nếu một lớp được chú thích bằng @Aspect, thì lớp đó sẽ không thể là advised object của aspect khác, vì khi sử dụng @Aspect, lớp đó sẽ được loại trừ khỏi cơ chế auto-proxying.`

### Khai báo pointcut

Một khai báo pointcut bao gồm hai phần:

- Một chữ ký phương thức, bao gồm tên phương thức và các tham số liên quan.
- Một biểu thức pointcut, được sử dụng để chỉ định những phương thức thực thi mà chúng ta quan tâm (và do đó có thể thêm advice vào).

Trong AOP theo phong cách @AspectJ, chúng ta sử dụng một phương thức để mô tả pointcut, ví dụ:

```java
@Pointcut("execution(* com.xys.service.UserService.*(..))") // Biểu thức pointcut
private void dataAccessOperation() {} // Chữ ký pointcut
```

`Phương thức này phải không có giá trị trả về.`  
`Phương thức này chính là chữ ký pointcut, biểu thức pointcut được chỉ định bằng chú thích @Pointcut.`  
Trên đây, chúng ta đơn giản chỉ định một pointcut, pointcut này mô tả: khớp với tất cả các phương thức trong gói **com.xys.service.UserService**.

#### Các định danh của pointcut (designator)

Biểu thức pointcut trong AspectJ5 bao gồm các định danh (designator) và các tham số hoạt động. Ví dụ, trong biểu thức pointcut "execution(\* greetTo(..))", **execution** là định danh, và trong ngoặc đơn là **greetTo(..)** là các tham số hoạt động.

##### execution

Khớp với việc thực thi của join point, ví dụ "execution(\* hello(..))" đại diện cho việc khớp với tất cả các phương thức hello() trong lớp mục tiêu. Đây là định danh pointcut cơ bản nhất.

##### within

Khớp với tất cả các join point trong một gói cụ thể, ví dụ `within(com.xys.*)` đại diện cho tất cả các điểm nối trong gói com.xys, tức là tất cả các phương thức của tất cả các lớp trong gói đó. Trong khi `within(com.xys.service.*Service)` đại diện cho tất cả các điểm nối trong gói com.xys.service với tên kết thúc bằng Service.

##### this và target

this được sử dụng để khớp với một bean, bean đó (proxy AOP của Spring) là một phiên bản của một kiểu cụ thể. Trong khi target khớp với một đối tượng mục tiêu (target object, tức là lớp gốc cần thêm advice), đối tượng này là một phiên bản của một kiểu cụ thể.

##### bean

Khớp với tất cả các phương thức trong bean có tên là giá trị chỉ định, ví dụ:

```
bean(*Service) // Khớp với tất cả các phương thức trong bean có hậu tố là Service
bean(myService) // Khớp với tất cả các phương thức trong bean có tên là myService
```

##### args

Khớp với các phương thức có tham số thỏa mãn yêu cầu. Ví dụ:

```java
@Pointcut("within(com.xys.demo2.*)")
public void pointcut2() {
}

@Before(value = "pointcut2()  &&  args(name)")
public void doSomething(String name) {
    logger.info("---page: {}---", name);
}
```

```java
@Service
public class NormalService {
    private Logger logger = LoggerFactory.getLogger(getClass());

    public void someMethod() {
        logger.info("---NormalService: someMethod invoked---");
    }

    public String test(String name) {
        logger.info("---NormalService: test invoked---");
        return "Dịch vụ hoạt động bình thường";
    }
}
```

Khi phương thức NormalService.test được thực thi, advice `doSomething` sẽ được thực hiện và tham số name của phương thức test sẽ được truyền vào `doSomething`.

Ví dụ phổ biến:

```java
// Khớp với các phương thức chỉ có một tham số name
@Before(value = "aspectMethod()  &&  args(name)")
public void doSomething(String name) {
}

// Khớp với các phương thức có tham số đầu tiên là name
@Before(value = "aspectMethod()  &&  args(name, ..)")
public void doSomething(String name) {
}

// Khớp với các phương thức có tham số thứ hai là name
Before(value = "aspectMethod()  &&  args(*, name, ..)")
public void doSomething(String name) {
}
```

##### @annotation

Khớp với các phương thức được chú thích bằng chú thích cụ thể đã chỉ định, ví dụ:

```java
@Pointcut("@annotation(com.xys.demo1.AuthChecker)")
public void pointcut() {
}
```

sẽ khớp với các phương thức được chú thích bằng `AuthChecker`.

#### Các biểu thức pointcut phổ biến

##### Khớp với chữ ký phương thức

```java
// Khớp với tất cả các phương thức trong gói chỉ định
execution(* com.xys.service.*(..))

// Khớp với tất cả các phương thức trong lớp chỉ định trong gói hiện tại
execution(* UserService.*(..))

// Khớp với tất cả các phương thức public trong gói chỉ định
execution(public * com.xys.service.*(..))

// Khớp với tất cả các phương thức public trong gói chỉ định và có kiểu trả về là int
execution(public int com.xys.service.*(..))

// Khớp với tất cả các phương thức public trong gói chỉ định, có tham số đầu tiên là String và kiểu trả về là int
execution(public int com.xys.service.*(String name, ..))
```

##### Khớp với chữ ký kiểu

```java
// Khớp với tất cả các phương thức trong gói chỉ định, không bao gồm các gói con
within(com.xys.service.*)

// Khớp với tất cả các phương thức trong gói chỉ định, bao gồm cả các gói con
within(com.xys.service..*)

// Khớp với tất cả các phương thức trong lớp chỉ định
within(UserService)

// Khớp với tất cả các phương thức được triển khai trong các lớp thực hiện một giao diện cụ thể
within(UserDao+)
```

##### Khớp với tên Bean

```java
// Khớp với tất cả các phương thức trong các Bean có tên kết thúc bằng chỉ định
bean(*Service)
```

##### Kết hợp biểu thức pointcut

```java
// Khớp với các Bean có tên kết thúc bằng Service hoặc ServiceImpl
bean(*Service || *ServiceImpl)

// Khớp với các Bean có tên kết thúc bằng Service và trong gói com.xys.service
bean(*Service) && within(com.xys.service.*)
```

### Khai báo advice

Advice được liên kết với một biểu thức pointcut và sẽ được thực thi trước/sau/không gian xung quanh việc thực thi các join point tương ứng. `Biểu thức pointcut có thể là một tham chiếu đơn giản đến một tên pointcut hoặc là một biểu thức pointcut đầy đủ`.  
Dưới đây là một số ví dụ về cách khai báo advice.

#### Before advice

```java
@Component
@Aspect
public class BeforeAspectTest {
    // Định nghĩa một Pointcut, sử dụng hàm biểu thức pointcut để chỉ định các join point nào sẽ sử dụng advice.
    @Pointcut("execution(* com.xys.service.UserService.*(..))")
    public void dataAccessOperation() {
    }
}
```

```java
@Component
@Aspect
public class AdviseDefine {
    // Định nghĩa advice
    @Before("com.xys.aspect.PointcutDefine.dataAccessOperation()")
    public void doBeforeAccessCheck(JoinPoint joinPoint) {
        System.out.println("*****Before advice, method: " + joinPoint.getSignature().toShortString() + " *****");
    }
}
```

Ở đây, **@Before** tham chiếu đến một pointcut, tức là "com.xys.aspect.PointcutDefine.dataAccessOperation()" là tên của một pointcut.  
Nếu chúng ta muốn advice sử dụng một pointcut tích hợp sẵn, chúng ta có thể:

```java
@Component
@Aspect
public class AdviseDefine {
    // Định nghĩa pointcut và advice cùng lúc
    @Before("within(com.xys.service..*)")
    public void doAccessCheck(JoinPoint joinPoint) {
        System.out.println("*****doAccessCheck, Before advice, method: " + joinPoint.getSignature().toShortString() + " *****");
    }
}
```

#### Around advice

Around advice khá đặc biệt, nó có thể thêm các hoạt động khác nhau trước/sau một phương thức và thậm chí có thể quyết định khi nào, làm thế nào và liệu có gọi phương thức tương ứng hay không.

```java
@Component
@Aspect
public class AdviseDefine {
    // Định nghĩa advice
    @Around("com.xys.aspect.PointcutDefine.dataAccessOperation()")
    public Object doAroundAccessCheck(ProceedingJoinPoint pjp) throws Throwable {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        // Bắt đầu
        Object retVal = pjp.proceed();
        stopWatch.stop();
        // Kết thúc
        System.out.println("invoke method: " + pjp.getSignature().getName() + ", elapsed time: " + stopWatch.getTotalTimeMillis());
        return retVal;
    }
}
```

Around advice tương tự như before advice, chỉ khác là chúng ta thay chú thích **@Before** bằng **@Around**.
