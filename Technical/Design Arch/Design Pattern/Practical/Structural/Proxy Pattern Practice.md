---
title: Proxy Pattern Practice
tags:
  - design-pattern
categories: 
date created: 2024-03-30
date modified: 2024-03-30
---

## Giới thiệu

**Vượt qua chướng ngại mà bạn không thể!**

Thời kỳ chướng ngại trong quá trình học lập trình thường xuyên xảy ra do bạn không thể nhìn thấy hướng đi phía trước. Lúc này, bạn rất hy vọng có ai đó nói với bạn rằng, bạn còn thiếu gì và phải nỗ lực hướng đi nào. Và nguyên nhân chính gây ra vấn đề này thường là do công việc phát triển hàng ngày quá phụ thuộc vào việc sao chép từ quá khứ, sự lặp đi lặp lại hàng ngày. Không có nhiều thách thức và không tham gia vào các kịch bản kinh doanh lớn, ngoài các yếu tố phát triển kinh doanh hàng ngày này, thiếu không khí công nghệ và chia sẻ công nghệ trong nhóm cũng như thiếu đam mê của chính bạn đối với việc học tập công nghệ, dẫn đến việc luôn bị nghẹt đầu dưới mức chặn, khó nâng cao.

**Tham gia công ty nhỏ hay lớn, bạn chọn cái nào?**

Bỏ qua tiền lương, bạn sẽ chọn cái gì? Một số người đề xuất công ty nhỏ, vì có thể tiếp xúc với mọi môi trường, cũng có người đề xuất công ty lớn, vì kích thước chuẩn có thể học hỏi nhiều hơn. Đôi khi sự phát triển của bạn trong công nghệ cũng chậm lại do lựa chọn khác nhau của bạn, công ty nhỏ thực sự sẽ tiếp xúc với mọi môi trường, nhưng thường nếu bạn làm kích thước công việc không lớn, thì công nghệ bạn sử dụng sẽ ít hơn, độ sâu nghiên cứu công nghệ cũng sẽ thấp hơn. Trong công ty lớn, đôi khi bạn không cần quan tâm đến việc triển khai và duy trì một cụm máy chủ, việc phát triển một middleware đầy đủ dịch vụ giám sát và cảnh báo và nhiều hơn nữa, nhưng nếu bạn muốn tìm hiểu về công nghệ này, nó được công khai bên trong và bạn có thể tiếp cận nhiều kiến thức công nghệ không giới hạn. Điều này quan trọng nhất là mở rộng tầm nhìn và sự nghiệp.

**Ngoài việc phát triển CRUD trong kinh doanh, có những công nghệ mà bạn thực sự khó tiếp cận!**

Có thể nhiều bạn nghĩ rằng phát triển công nghệ chỉ là việc đáp ứng yêu cầu của sản phẩm, viết vài CRUD, và nếu không biết điều gì, chỉ cần tra cứu trên mạng là xong. Nhưng luôn có cảm giác những câu hỏi của người khác giống như việc tái tạo tên lửa. Tuy nhiên, trong các kịch bản kinh doanh với quy mô lớn và số lượng người dùng cao, mỗi lần tối ưu hóa, cải thiện hiệu suất, đều giống như giải một bài toán toán học, cần lặp đi lặp lại, tận dụng tối đa hiệu suất. Không ngừng nghiên cứu, tìm ra thiết kế tốt nhất. Ngoài những cải thiện và tối ưu hóa này, còn có một loạt các công nghệ rộng lớn khác mà bạn có thể bị bỏ qua nếu chỉ tập trung vào CRUD: bao gồm lập trình byte code, kiến trúc thiết kế dựa trên miền (DDD), phát triển middleware theo mô hình Proxy, nguyên lý triển khai máy ảo JVM và nhiều hơn nữa.

## Môi trường phát triển

1. JDK 1.8
2. Idea + Maven
3. Code: [vanhung4499/practical-java-design](https://github.com/vanhung4499/practical-java-design)  

| Dự án             | Mô tả                                                     |
| ----------------- | --------------------------------------------------------- |
| demo-design-12-00 | Mô phỏng phần lớp proxy của middleware phát triển MyBatis |

## Giới thiệu về Proxy Pattern

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240330144518.png)

Proxy Pattern có chút giống như mối quan hệ giữa ông chủ và người làm, cũng giống như mối quan hệ giữa nhà phân phối và đại lý bán hàng. Mục tiêu chính của mẫu này là cung cấp dịch vụ proxy tiện lợi cho việc truy cập vào tài nguyên cũng như hoạt động của các đối tượng lớp. Mẫu này thường xuất hiện trong hệ thống của chúng ta, hoặc trong các thành phần mà bạn đã sử dụng, chúng cung cấp một cách rất đơn giản và dễ sử dụng để kiểm soát các dịch vụ cần phải viết rất nhiều code lệnh để sử dụng ban đầu.

Các tình huống tương tự có thể được nhận biết như sau:

1. Lớp truy cập cơ sở dữ liệu của bạn thường cung cấp một ứng dụng cơ bản hơn để giảm thiểu số lượng kết nối cơ sở dữ liệu khi mở rộng dịch vụ.
2. Một số middleware mà bạn đã sử dụng như; framework RPC, khi nhận được mô tả giao diện từ file jar, middleware sẽ tạo ra lớp proxy tương ứng khi khởi động dịch vụ. Khi gọi giao diện, thực tế là thông qua lớp proxy gửi thông tin qua socket.
3. Ngoài ra, như MyBatis mà chúng ta thường sử dụng, cơ bản là việc xác định giao diện mà không cần viết lớp cài đặt, bạn có thể thực hiện các thao tác thêm, sửa, xóa, truy vấn trong các câu lệnh SQL trong tệp xml hoặc chú thích tùy chỉnh.

## Mô phỏng Trường hợp Thực tế

![demo-design-12-02.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/demo-design-12-02.png)

**Trong ví dụ này, chúng tôi mô phỏng phần sinh ra lớp proxy trong MyBatis-Spring.**

Trong việc sử dụng MyBatis, bạn chỉ cần định nghĩa interface mà không cần viết lớp cài đặt để thực hiện các thao tác thêm, sửa, xóa và truy vấn. Đối với những bạn còn thắc mắc, trong chương này, bạn có thể học được phần này. Tiếp theo, chúng ta sẽ mô tả quá trình lõi để triển khai một lớp proxy như vậy và giao nó cho Spring quản lý, để giải thích Proxy Pattern.

Trong thực tế, các tình huống như vậy không phổ biến trong phát triển doanh nghiệp vì chúng áp dụng cùng một triết lý cho việc phát triển middleware. Tuy nhiên, nhiều bạn trẻ thường làm phát triển doanh nghiệp, do đó hiểu biết về việc đăng ký và quản lý bean của Spring cũng như về việc tạo và gọi ngược proxy sẽ ít hơn. Tuy nhiên, bạn có thể sử dụng chương này như một cơ hội để bắt đầu học hỏi từ cơ bản và từ từ tìm hiểu.

## Triển khai Proxy Pattern

Tiếp theo, chúng tôi sẽ sử dụng Proxy Pattern để mô phỏng quá trình triển khai một lớp proxy trong MyBatis, cho phép bạn chỉ cần định nghĩa giao diện mà không cần viết lớp cài đặt để thực hiện các thao tác thêm, sửa, xóa và truy vấn trong cơ sở dữ liệu.

Dưới đây là một số điểm cần chú ý:

1. `BeanDefinitionRegistryPostProcessor`: Đây là một interface của Spring được sử dụng để xử lý đăng ký định nghĩa bean.
2. `GenericBeanDefinition`: Định nghĩa thông tin của bean, trong trường hợp này, chúng tôi sử dụng `ScannedGenericBeanDefinition` trong MyBatis-Spring.
3. `FactoryBean`: Là một lớp xử lý cho nhà máy bean, được sử dụng trong trường hợp này.

### Cấu trúc Dự án

```java
design-demo-12-00
├── pom.xml
└── src
    ├── main
    │   ├── java
    │   │   └── com
    │   │       └── hnv99
    │   │           └── design
    │   │               ├── IUserDao.java
    │   │               └── agent
    │   │                   ├── MapperFactoryBean.java
    │   │                   ├── RegisterBeanFactory.java
    │   │                   └── Select.java
    │   └── resources
    │       └── spring-config.xml
    └── test
        └── java
            └── com
                └── hnv99
                    └── design
                        └── ApiTest.java
```      

**Cấu trúc Mô hình Middleware Proxy**

![Cấu trúc Mô hình Middleware Proxy](https://raw.githubusercontent.com/vanhung4499/images/master/snap/itstack-demo-design-12-03.png)

- Mô hình này không có nhiều lớp, nhưng tất cả đều là các lớp xử lý cốt lõi được trừu tượng hóa. Nhiệm vụ chính là tạo ra proxy cho lớp và đăng ký nó vào Spring.
- Phía trên cùng của hình ảnh là phần triển khai về Middleware, phía dưới là phần sử dụng các chức năng.

### Triển khai code

#### Chú thích Tự định nghĩa

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD})
public @interface Select {

    String value() default "";  // Câu lệnh SQL

}
```   

- Ở đây, chúng tôi định nghĩa một chú thích tùy chỉnh để mô phỏng chức năng trong MyBatis-Spring, cho phép sử dụng ở mức phương thức.

#### Dao

```java
public interface IUserDao {

    @Select("select userName from user where id = #{uId}")
    String queryUserInfo(String uId);

}
```

- Chúng tôi định nghĩa một giao diện Dao và thêm chú thích tùy chỉnh vào đó. Điều này giống như bạn sử dụng trong các thành phần MyBatis của mình.
- Phía trên là phần chuẩn bị của chúng tôi, sau đó chúng tôi bắt đầu triển khai phần chức năng middleware.

#### Định nghĩa lớp Proxy

```java
public class MapperFactoryBean<T> implements FactoryBean<T> {

    private Logger logger = LoggerFactory.getLogger(MapperFactoryBean.class);

    private Class<T> mapperInterface;

    public MapperFactoryBean(Class<T> mapperInterface) {
        this.mapperInterface = mapperInterface;
    }

    @Override
    public T getObject() throws Exception {
        InvocationHandler handler = (proxy, method, args) -> {
            Select select = method.getAnnotation(Select.class);
            logger.info("SQL：{}", select.value().replace("#{uId}", args[0].toString()));
            return args[0] + ", 小傅哥, bugstack.cn - Duy trì, chia sẻ, phát triển, để bản thân và người khác đều có thể hưởng lợi!";
        };
        return (T) Proxy.newProxyInstance(this.getClass().getClassLoader(), new Class[]{mapperInterface}, handler);
    }

    @Override
    public Class<?> getObjectType() {
        return mapperInterface;
    }

    @Override
    public boolean isSingleton() {
        return true;
    }

}
```      

- Nếu bạn đã đọc code nguồn của MyBatis, bạn sẽ thấy một lớp như thế này: `MapperFactoryBean`. Ở đây, chúng tôi cũng mô phỏng một lớp như vậy, trong đó chúng tôi triển khai định nghĩa cho lớp proxy của chúng tôi.
- Thừa kế từ `FactoryBean`, cung cấp đối tượng bean, cũng là phương thức; `T getObject()`.
- Trong phương thức `getObject()`, chúng tôi cung cấp lớp proxy cũng như mô phỏng xử lý của chúng tôi đối với câu lệnh sql, bao gồm cách chúng tôi xử lý khi người dùng gọi phương thức của lớp dao.
- Ngoài ra, chúng tôi cũng cung cấp một hàm xây dựng để truyền vào lớp cần được lập ủy, `Class<T> mapperInterface`, điều này cũng được sử dụng trong MyBatis.
- Hàm `getObjectType()` cung cấp phản hồi loại đối tượng và `isSingleton()` trả về true nếu lớp là đơn lẻ.

#### Đăng ký định nghĩa Bean vào Container Spring

```java
public class RegisterBeanFactory implements BeanDefinitionRegistryPostProcessor {
    
    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {
        
        GenericBeanDefinition beanDefinition = new GenericBeanDefinition();
        beanDefinition.setBeanClass(MapperFactoryBean.class);
        beanDefinition.setScope("singleton");
        beanDefinition.getConstructorArgumentValues().addGenericArgumentValue(IUserDao.class);

        BeanDefinitionHolder definitionHolder = new BeanDefinitionHolder(beanDefinition, "userDao");
        BeanDefinitionReaderUtils.registerBeanDefinition(definitionHolder, registry);
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory configurableListableBeanFactory) throws BeansException {
        // left intentionally blank
    }

}
```     

- Ở đây, chúng tôi chuyển giao bean proxy cho Spring container quản lý, điều này cũng giúp chúng tôi dễ dàng lấy được bean proxy. Phần này là code nguồn về quá trình đăng ký một bean trong Spring.
- `GenericBeanDefinition`, được sử dụng để định nghĩa thông tin cơ bản của một bean `setBeanClass(MapperFactoryBean.class);`, cũng bao gồm thông tin có thể được truyền vào hàm tạo `addGenericArgumentValue(IUserDao.class);`
- Cuối cùng, sử dụng `BeanDefinitionReaderUtils.registerBeanDefinition`, để đăng ký bean, cũng là đăng ký vào `DefaultListableBeanFactory`.

#### Cấu hình spring-config

```java 
<?xml version="1.0" encoding="UTF-8"?>  
<beans xmlns="http://www.springframework.org/schema/beans"  
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd"  
       default-autowire="byName">  
  
    <bean id="userDao" class="com.hnv99.design.agent.RegisterBeanFactory"/>  
  
</beans>
```    

- Tiếp theo, thêm cấu hình bean vào tệp cấu hình của chúng tôi. Trong việc sử dụng Mybatis, thường sẽ cấu hình gói dao được quét, điều này sẽ giúp giảm thiểu phần cấu hình này.

### Kiểm thử

#### Viết Lớp kiểm tra

```java
public class ApiTest {  
  
    private Logger logger = LoggerFactory.getLogger(ApiTest.class);  
  
    @Test  
    public void testIUserDao() {  
        BeanFactory beanFactory = new ClassPathXmlApplicationContext("spring-config.xml");  
        IUserDao userDao = beanFactory.getBean("userDao", IUserDao.class);  
        String res = userDao.queryUserInfo("100001");  
        logger.info("Kết quả kiểm thử: {}", res);  
    }  
}
```

- Quá trình kiểm thử khá đơn giản, chúng ta chỉ cần tải BeanFactory và lấy đối tượng của lớp đại diện của chúng tôi từ ngữ cảnh, sau đó gọi phương thức và trả về kết quả.
- Bạn có thể thấy trong quá trình này chúng tôi không cần một lớp thực thi nào cho giao diện, mà thay vào đó sử dụng cách tiếp cận đại diện để tạo ra một lớp thực thi và giao nó cho Spring quản lý.

#### Kết quả

```shell
2024-03-30 15:45:40.579	INFO	main		(AbstractApplicationContext.java:583)	|	Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@9e0d30c1: startup date [Sat Mar 30 15:45:40 ICT 2024]; root of context hierarchy
2024-03-30 15:45:40.622	INFO	main		(XmlBeanDefinitionReader.java:317)	|	Loading XML bean definitions from class path resource [spring-config.xml]
2024-03-30 15:45:40.741	INFO	main		(DefaultListableBeanFactory.java:821)	|	Overriding bean definition for bean 'userDao' with a different definition: replacing [Generic bean: class [com.hnv99.design.agent.RegisterBeanFactory]; scope=; abstract=false; lazyInit=false; autowireMode=1; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null; defined in class path resource [spring-config.xml]] with [Generic bean: class [com.hnv99.design.agent.MapperFactoryBean]; scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null]
2024-03-30 15:45:40.792	INFO	main		(MapperFactoryBean.java:23)	|	SQL：select userName from user where id = 100001
2024-03-30 15:45:40.793	INFO	main		(ApiTest.java:18)	|	Kết quả kiểm thử: 100001
```

- Từ kết quả kiểm thử, chúng ta có thể thấy rằng chúng tôi đã in ra câu lệnh SQL, phần này được lấy từ chú thích tùy chỉnh; `select userName from user where id = 100001`, chúng tôi đã thực hiện việc điều chỉnh đơn giản. Trong framework MyBatis, điều này sẽ được chuyển giao cho lớp thực thi của `SqlSession` để xử lý logic và trả về dữ liệu cơ sở dữ liệu được thao tác.
- Kết quả kiểm thử của chúng tôi là một kết quả cố định, nếu bạn muốn nghiên cứu sâu hơn, bạn có thể thử liên kết với lớp xử lý cơ sở dữ liệu để làm cho framework này trở nên hoàn thiện hơn.

## Tổng kết

- Trong phần giới thiệu về Proxy Pattern, chúng ta đã sử dụng một ví dụ về việc phát triển một phần của `mybatis-spring` middleware để thể hiện sức mạnh của Proxy Pattern. Do đó, chúng ta đã đề cập đến một số điểm kiến thức về việc tạo lớp Proxy và đăng ký bean trong Spring, những điểm này có thể ít được sử dụng trong việc phát triển doanh nghiệp hàng ngày, nhưng lại rất phổ biến trong việc phát triển middleware.
- Proxy Pattern không chỉ được sử dụng trong việc phát triển middleware mà còn có thể là sự bọc gói của dịch vụ, các thành phần IoT vv., biến các dịch vụ phức tạp thành các cuộc gọi nhẹ nhàng, sử dụng bộ nhớ cache. Bạn có thể hiểu nó như công tắc điện trong nhà của bạn, chúng ta không thể kết nối dây điện 220v bằng tay, nhưng có thể sử dụng công tắc để tránh điện giật.
- Phương thức thiết kế Proxy có thể làm cho code trở nên gọn gàng, sạch sẽ và dễ bảo trì hơn. Mặc dù việc phát triển phần này đã tăng thêm rất nhiều lớp và bao gồm cả việc xử lý đăng ký bean của chính mình, nhưng middleware như vậy có tính tái sử dụng cao và thông minh hơn, có thể mở rộng một cách dễ dàng đến các ứng dụng dịch vụ khác nhau.
