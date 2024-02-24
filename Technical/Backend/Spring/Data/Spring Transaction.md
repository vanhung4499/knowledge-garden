---
title: Spring Transaction
tags: [spring, java, db, backend]
categories: [spring, java, db, backend]
date created: 2023-07-28
date modified: 2024-02-22
---

# Spring và Transaction

Spring đã triển khai một mô hình lập trình nhất quán cho các API giao dịch như Java Transaction API (JTA), JDBC, Hibernate và Java Persistence API (JPA). Chức năng giao dịch khai báo của Spring cung cấp một cách cấu hình giao dịch rất tiện lợi. Kết hợp với cấu hình tự động của Spring Boot, hầu hết các dự án Spring Boot chỉ cần đánh dấu phương thức với `@Transactional` để kích hoạt cấu hình giao dịch cho phương thức đó.

## Hiểu về giao dịch

Trong lĩnh vực phát triển phần mềm, **giao dịch (transaction)** là một tập hợp các hoạt động hoặc thao tác mà hoàn toàn hoặc không hoàn toàn được thực thi. Giao dịch cho phép bạn kết hợp một số hoạt động thành một đơn vị công việc mà hoặc là xảy ra hoàn toàn hoặc không xảy ra gì cả. Truyền thống, phát triển Java EE có hai lựa chọn cho quản lý giao dịch: **giao dịch toàn cầu** hoặc **giao dịch cục bộ**, cả hai đều có hạn chế lớn.

### Đặc điểm của giao dịch

Giao dịch nên có 4 thuộc tính: nguyên tử, nhất quán, cô lập và bền vững. Bốn thuộc tính này thường được gọi là **ACID**.

- **Nguyên tử (Atomic)**: Một giao dịch là một đơn vị công việc không thể chia rẽ, các hoạt động bao gồm trong giao dịch phải được thực hiện hoàn toàn hoặc không thực hiện gì cả.
- **Nhất quán (Consistent)**: Giao dịch phải làm cho cơ sở dữ liệu chuyển từ một trạng thái nhất quán sang một trạng thái nhất quán khác. Nhất quán và nguyên tử liên quan chặt chẽ với nhau.
- **Cô lập (Isolated)**: Việc thực hiện một giao dịch không thể bị các giao dịch khác can thiệp. Nghĩa là các hoạt động và dữ liệu sử dụng trong một giao dịch đối với các giao dịch khác đang xảy ra đồng thời là cô lập, các giao dịch đang thực hiện đồng thời với nhau không thể can thiệp lẫn nhau.
- **Bền vững (Durable)**: Bền vững còn được gọi là vĩnh cửu (permanence), chỉ rằng một giao dịch đã được xác nhận thì sự thay đổi dữ liệu trong cơ sở dữ liệu phải là vĩnh viễn. Các hoạt động hoặc sự cố tiếp theo không được ảnh hưởng đến nó.

### Giao dịch toàn cầu

Giao dịch toàn cầu cho phép bạn sử dụng nhiều nguồn tài nguyên giao dịch, thường là cơ sở dữ liệu quan hệ và hàng đợi tin nhắn. Máy chủ ứng dụng quản lý giao dịch toàn cầu thông qua JTA, một API phức tạp (một phần vì mô hình ngoại lệ của nó). Ngoài ra, UserTransaction của JTA thường cần được lấy từ JNDI, điều này có nghĩa là bạn cũng cần sử dụng JNDI để sử dụng JTA. Sử dụng giao dịch toàn cầu hạn chế bất kỳ khả năng tái sử dụng mã ứng dụng nào, vì JTA thường chỉ có sẵn trong môi trường máy chủ ứng dụng.

Trước đây, cách ưu tiên để sử dụng giao dịch toàn cầu là thông qua EJB CMT (Container-Managed Transactions). CMT là một quản lý giao dịch dựa trên khai báo (khác với quản lý giao dịch theo chương trình). EJB CMT loại bỏ nhu cầu tìm kiếm JNDI liên quan đến giao dịch, mặc dù việc sử dụng EJB cũng đòi hỏi sử dụng JNDI. Nó loại bỏ phần lớn (nhưng không phải tất cả) việc viết mã Java để điều khiển giao dịch. Nhược điểm rõ ràng của nó là CMT liên quan đến JTA và môi trường máy chủ ứng dụng. Ngoài ra, nó chỉ có sẵn khi bạn chọn triển khai logic kinh doanh trong EJB (hoặc ít nhất là sau một cái nhìn EJB có tính giao dịch). Nói chung, tác động tiêu cực của EJB là quá lớn đến nỗi đề xuất này không hấp dẫn, đặc biệt là khi có những giải pháp thay thế quyền lực cho quản lý giao dịch dựa trên khai báo.

### Giao dịch cục bộ

Giao dịch cục bộ là giao dịch được chỉ định cho một nguồn tài nguyên cụ thể, chẳng hạn như giao dịch quản lý kết nối JDBC. Giao dịch cục bộ có thể dễ dàng sử dụng hơn, nhưng có một nhược điểm rõ ràng: chúng không thể làm việc qua nhiều nguồn tài nguyên giao dịch. Ví dụ, mã quản lý giao dịch sử dụng kết nối JDBC không thể chạy trong một giao dịch JTA toàn cầu. Vì máy chủ ứng dụng không tham gia quản lý giao dịch, nó không thể đảm bảo tính chính xác qua nhiều nguồn tài nguyên (đáng lưu ý là hầu hết các ứng dụng chỉ sử dụng một nguồn tài nguyên giao dịch). Một nhược điểm khác là giao dịch cục bộ có sự xâm nhập vào mô hình lập trình.

### Hỗ trợ giao dịch của Spring

Spring thông qua cơ chế gọi lại để trừu tượng hóa việc thực hiện giao dịch thực sự từ mã có tính giao dịch. Spring đã giải quyết được nhược điểm của giao dịch toàn cầu và cục bộ. Nó cho phép các nhà phát triển sử dụng một mô hình lập trình nhất quán trong bất kỳ môi trường nào. Bạn chỉ cần viết mã một lần, và nó sẽ được hưởng lợi từ các chiến lược quản lý giao dịch khác nhau trong các môi trường khác nhau. Spring cung cấp hỗ trợ cho quản lý giao dịch lập trình và khai báo, trong hầu hết các trường hợp, quản lý giao dịch khai báo được khuyến nghị.

- Quản lý giao dịch lập trình cho phép người dùng xác định chính xác ranh giới giao dịch trong mã
- Quản lý giao dịch khai báo (dựa trên AOP) giúp người dùng tách rời các hoạt động khỏi quy tắc giao dịch

Thông qua quản lý giao dịch lập trình, nhà phát triển có thể sử dụng trừu tượng giao dịch của Spring, nó có thể chạy trên bất kỳ cơ sở giao dịch nào. Sử dụng mô hình khai báo ưu tiên, nhà phát triển thường viết rất ít hoặc không cần viết mã liên quan đến quản lý giao dịch, do đó không phụ thuộc vào API giao dịch của Spring hoặc bất kỳ API giao dịch nào khác.

### Lợi ích của Spring Transaction

Spring Framework ccung cấp một trừu tượng nhất quán cho quản lý giao dịch, mang lại những lợi ích sau:

- Cung cấp mô hình lập trình nhất quán qua các API giao dịch khác nhau, chẳng hạn như Java Transaction API (JTA), JDBC, Hibernate và Java Persistence API (JPA).
- Hỗ trợ quản lý giao dịch theo cách khai báo.
- API dành cho quản lý giao dịch lập trình đơn giản hơn so với các API giao dịch phức tạp (như JTA).
- Tích hợp hoàn hảo với trừu tượng truy cập dữ liệu của Spring.

## Các API cốt lõi

### TransactionManager

Khái niệm quan trọng trong trừu tượng giao dịch của Spring là TransactionManager. TransactionManager được định nghĩa bởi hai interface: `PlatformTransactionManager` cho quản lý giao dịch theo cách truyền thống và `ReactiveTransactionManager` cho quản lý giao dịch phản ứng.

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20220922073737.png)

#### PlatformTransactionManager

Dưới đây là định nghĩa API của `PlatformTransactionManager`:

```java
public interface PlatformTransactionManager extends TransactionManager {

    TransactionStatus getTransaction(TransactionDefinition definition) throws TransactionException;

    void commit(TransactionStatus status) throws TransactionException;

    void rollback(TransactionStatus status) throws TransactionException;
}
```

`PlatformTransactionManager` là một interface SPI, cho phép người dùng sử dụng nó theo cách lập trình. Vì `PlatformTransactionManager` là một interface, nó có thể dễ dàng được MOCK hoặc đặt chỗ theo nhu cầu. Nó không phụ thuộc vào các chiến lược tìm kiếm như JNDI. Định nghĩa của `PlatformTransactionManager` giống như bất kỳ đối tượng (hoặc bean) nào khác trong Spring IoC container. Điều này làm cho việc quản lý giao dịch trong Spring trở thành một trừu tượng có giá trị, ngay cả khi bạn sử dụng JTA. So với việc trực tiếp sử dụng JTA, bạn có thể dễ dàng kiểm thử mã giao dịch.

Tương tự, để phù hợp với triết lý của Spring, bất kỳ phương thức nào của `PlatformTransactionManager` có thể ném ra `TransactionException` (một RuntimeException không được kiểm tra). Lỗi kiến ​​trúc giao dịch hầu như luôn là lỗi nghiêm trọng. Trong một số trường hợp, ứng dụng có thể khôi phục từ lỗi giao dịch và người phát triển có thể chọn bắt và xử lý `TransactionException`. Điểm quan trọng là người phát triển không bị buộc phải làm điều đó.

Phương thức `getTransaction(..)` trả về một đối tượng `TransactionStatus` dựa trên tham số `TransactionDefinition`. Nếu có giao dịch khớp trong ngăn xếp gọi hiện tại, `TransactionStatus` trả về có thể đại diện cho một giao dịch mới hoặc có thể đại diện cho một giao dịch hiện có. Ý nghĩa của trường hợp sau là `TransactionStatus` được liên kết với luồng thực thi, giống như ngữ cảnh giao dịch trong Java EE.

Như bạn có thể thấy, cơ chế quản lý giao dịch cụ thể là mờ nhạt đối với Spring, nó không quan tâm đến những điều đó, những điều đó là trách nhiệm của các nền tảng. Vì vậy, một trong những lợi ích của quản lý giao dịch Spring là cung cấp một mô hình lập trình nhất quán cho các API giao dịch khác nhau như JTA, JDBC, Hibernate, JPA. Dưới đây là cách mỗi nền tảng triển khai cơ chế quản lý giao dịch.

#### Giao dịch JDBC

Nếu ứng dụng của bạn sử dụng trực tiếp JDBC để lưu trữ, `DataSourceTransactionManager` sẽ xử lý ranh giới giao dịch cho bạn. Để sử dụng `DataSourceTransactionManager`, bạn cần cấu hình nó trong định nghĩa ngữ cảnh ứng dụng của bạn, như sau:

```xml
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
  <property name="dataSource" ref="dataSource" />
</bean>
```

Thực tế, `DataSourceTransactionManager` quản lý giao dịch bằng cách sử dụng phương thức `commit()` và `rollback()` của `java.sql.Connection`, mà bạn có được từ `DataSource`. Khi giao dịch thành công, `DataSourceTransactionManager` gọi phương thức `commit()` của `Connection`, ngược lại, nó gọi phương thức `rollback()`.

#### Giao dịch Hibernate

Nếu ứng dụng của bạn sử dụng Hibernate để lưu trữ, bạn cần sử dụng `HibernateTransactionManager`. Đối với Hibernate3, bạn cần thêm khai báo bean sau vào định nghĩa ngữ cảnh Spring:

```xml
<bean id="transactionManager" class="org.springframework.orm.hibernate3.HibernateTransactionManager">
  <property name="sessionFactory" ref="sessionFactory" />
</bean>
```

Thuộc tính `sessionFactory` cần được cấu hình để trỏ đến một session factory Hibernate. `HibernateTransactionManager` sẽ chịu trách nhiệm quản lý giao dịch bằng cách ủy quyền cho đối tượng `org.hibernate.Transaction`, mà bạn có được từ Hibernate Session. Khi giao dịch thành công, `HibernateTransactionManager` gọi phương thức `commit()` của `Transaction`, ngược lại, nó gọi phương thức `rollback()`.

#### Giao dịch Java Persistence API (JPA)

Nếu ứng dụng của bạn sử dụng Java Persistence API (JPA), bạn cần sử dụng `JpaTransactionManager` để quản lý giao dịch. Bạn cần cấu hình `JpaTransactionManager` như sau:

```xml
<bean id="transactionManager" class="org.springframework.orm.jpa.JpaTransactionManager">
  <property name="entityManagerFactory" ref="entityManagerFactory" />
</bean>
```

`JpaTransactionManager` chỉ cần một `EntityManagerFactory` (có thể là bất kỳ cài đặt nào của interface `javax.persistence.EntityManagerFactory`). `JpaTransactionManager` sẽ làm việc cùng với `EntityManager` được tạo ra từ `EntityManagerFactory` để xây dựng giao dịch.

#### Giao dịch Java Native API (JTA)

Nếu bạn không sử dụng bất kỳ cơ chế quản lý giao dịch nào được đề cập trên, hoặc bạn vượt qua nhiều nguồn quản lý giao dịch (ví dụ: hai hoặc nhiều nguồn dữ liệu khác nhau), bạn cần sử dụng `JtaTransactionManager`:

```xml
<bean id="transactionManager" class="org.springframework.transaction.jta.JtaTransactionManager">
  <property name="transactionManagerName" value="java:/TransactionManager" />
</bean>
```

`JtaTransactionManager` sẽ ủy quyền cho đối tượng `javax.transaction.UserTransaction` và `javax.transaction.TransactionManager` để quản lý giao dịch. Khi giao dịch thành công, nó sẽ gọi phương thức `commit()` của `UserTransaction`, ngược lại, nó sẽ gọi phương thức `rollback()`.

#### ReactiveTransactionManager

Spring cung cấp một trừu tượng quản lý giao dịch cho ứng dụng phản ứng và ứng dụng sử dụng Kotlin coroutines. Dưới đây là định nghĩa cho chiến lược quản lý giao dịch `ReactiveTransactionManager`:

```java
public interface ReactiveTransactionManager extends TransactionManager {

    Mono<ReactiveTransaction> getReactiveTransaction(TransactionDefinition definition) throws TransactionException;

    Mono<Void> commit(ReactiveTransaction status) throws TransactionException;

    Mono<Void> rollback(ReactiveTransaction status) throws TransactionException;
}
```

`ReactiveTransactionManager` cũng là một interface SPI, cho phép người dùng sử dụng nó theo cách lập trình. Vì `ReactiveTransactionManager` là một interface, nó cũng có thể dễ dàng được MOCK hoặc đặt chỗ theo nhu cầu.

### TransactionDefinition

`PlatformTransactionManager` sử dụng phương thức `getTransaction(TransactionDefinition definition)` để lấy giao dịch, trong đó tham số là một đối tượng `TransactionDefinition`. `TransactionDefinition` định nghĩa các thuộc tính cơ bản của giao dịch. Các thuộc tính này có thể được hiểu là cấu hình cơ bản của giao dịch, mô tả cách áp dụng chiến lược giao dịch cho các phương thức.

Interface `TransactionDefinition` có nội dung như sau:

```java
public interface TransactionDefinition {
    int getPropagationBehavior(); // Trả về hành vi truyền bá của giao dịch
    int getIsolationLevel(); // Trả về mức độ cô lập của giao dịch, TransactionManager sử dụng nó để kiểm soát dữ liệu nào trong giao dịch có thể được nhìn thấy bởi giao dịch khác
    int getTimeout();  // Trả về thời gian giao dịch phải hoàn thành trong bao nhiêu giây
    boolean isReadOnly(); // Giao dịch có chỉ đọc hay không, TransactionManager có thể tối ưu hóa dựa trên giá trị trả về này để đảm bảo giao dịch chỉ đọc
}
```

Chúng ta có thể thấy rằng `TransactionDefinition` được sử dụng để định nghĩa các thuộc tính của giao dịch. Dưới đây là mô tả chi tiết về các thuộc tính giao dịch.

#### Hành vi truyền bá (Propagation Behavior)

Hành vi truyền bá của giao dịch (Propagation Behavior) xác định cách mà giao dịch được truyền bá trong một ngữ cảnh đa giao dịch. Khi một phương thức gọi một phương thức giao dịch khác, bạn cần xác định cách mà giao dịch sẽ được truyền bá từ phương thức gọi đến phương thức được gọi. Spring định nghĩa bảy hành vi truyền bá giao dịch:

| Hành vi truyền bá                 | Ý nghĩa                                                                                                                                                                                                                                                                       |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PROPAGATION_REQUIRED`      | Đánh dấu rằng phương thức hiện tại phải chạy trong một giao dịch. Nếu đã có một giao dịch hiện tại, phương thức sẽ chạy trong giao dịch hiện có. Nếu không có giao dịch hiện tại, một giao dịch mới sẽ được khởi tạo.                                                                                                           |
| `PROPAGATION_SUPPORTS`      | Đánh dấu rằng phương thức hiện tại không yêu cầu một giao dịch, nhưng nếu đã có một giao dịch hiện tại, phương thức sẽ chạy trong giao dịch hiện có.                                                                                                                                                                                       |
| `PROPAGATION_MANDATORY`     | Đánh dấu rằng phương thức hiện tại phải chạy trong một giao dịch. Nếu không có giao dịch hiện tại, một ngoại lệ sẽ được ném ra.                                                                                                                                                                                                           |
| `PROPAGATION_REQUIRED_NEW`  | Đánh dấu rằng phương thức hiện tại phải chạy trong một giao dịch riêng của nó. Một giao dịch mới sẽ được khởi tạo và giao dịch hiện có (nếu có) sẽ bị tạm ngưng.                                                                                                                                                                           |
| `PROPAGATION_NOT_SUPPORTED` | Đánh dấu rằng phương thức hiện tại không yêu cầu một giao dịch. Nếu đã có một giao dịch hiện tại, giao dịch hiện có sẽ bị tạm ngưng trong khi phương thức được thực thi.                                                                                                                                                                 |
| `PROPAGATION_NEVER`         | Đánh dấu rằng phương thức hiện tại không được chạy trong một giao dịch. Nếu đã có một giao dịch hiện tại, một ngoại lệ sẽ được ném ra.                                                                                                                                                                                                   |
| `PROPAGATION_NESTED`        | Đánh dấu rằng phương thức hiện tại phải chạy trong một giao dịch lồng nhau. Giao dịch lồng nhau có thể được gửi riêng biệt và có thể được cam kết hoặc hủy bỏ độc lập với giao dịch chính. Nếu không có giao dịch hiện tại, hành vi này tương tự như `PROPAGATION_REQUIRED`. Lưu ý rằng hành vi này không được hỗ trợ bởi tất cả các nền tảng. |

Ví dụ, giả sử chúng ta có hai phương thức `methodA` và `methodB`:

```java
// Hành vi truyền bá PROPAGATION_REQUIRED
methodA {
    ……
    methodB();
    ……
}
```

```java
// Hành vi truyền bá PROPAGATION_REQUIRED
methodB {
   ……
}
```

Khi sử dụng giao dịch khai báo bằng Spring, Spring sử dụng AOP để hỗ trợ giao dịch khai báo tự động. Dựa trên thuộc tính hành vi truyền bá, Spring sẽ tự động quyết định xem có cần mở một giao dịch mới trước khi gọi phương thức và xem có cần cam kết hoặc hủy bỏ giao dịch sau khi phương thức thực thi.

Khi gọi phương thức `methodB` độc lập:

```java
main {
    metodB();
}
```

Tương đương với:

```java
Main {
    Connection con=null;
    try{
        con = getConnection();
        con.setAutoCommit(false);

        // Gọi phương thức
        methodB();

        // Cam kết giao dịch
        con.commit();
    } Catch(RuntimeException ex) {
        // Hủy bỏ giao dịch
        con.rollback();
    } finally {
        // Giải phóng tài nguyên
        closeCon();
    }
}
```

Spring đảm bảo rằng tất cả các cuộc gọi trong `methodB` đều được thực hiện trên cùng một kết nối. Khi gọi `methodB`, không có giao dịch hiện tại, vì vậy một kết nối mới được lấy và một giao dịch mới được khởi tạo.

Khi gọi `methodA`, trong `methodA` sẽ gọi `methodB`.

Hiệu quả thực thi tương đương với:

```java
main{
    Connection con = null;
    try{
        con = getConnection();
        methodA();
        con.commit();
    } catch(RuntimeException ex) {
        con.rollback();
    } finally {
        closeCon();
    }
}
```

Khi gọi `methodA`, không có giao dịch hiện tại, vì vậy một giao dịch mới được khởi tạo. Khi gọi `methodB` trong `methodA`, đã có một giao dịch hiện tại, vì vậy `methodB` sẽ tham gia vào giao dịch hiện tại.

2. `PROPAGATION_SUPPORTS`: Nếu đã tồn tại một giao dịch, phương thức sẽ hỗ trợ giao dịch hiện tại. Nếu không có giao dịch, phương thức sẽ được thực thi mà không có giao dịch. Tuy nhiên, đối với các TransactionManager đồng bộ hóa giao dịch, `PROPAGATION_SUPPORTS` có một số khác biệt so với việc không sử dụng giao dịch.

```java
// Thuộc tính truyền bá PROPAGATION_REQUIRED
methodA(){
  methodB();
}

// Thuộc tính truyền bá PROPAGATION_SUPPORTS
methodB(){
  ……
}
```

Khi gọi phương thức `methodB` độc lập, phương thức `methodB` sẽ được thực thi mà không có giao dịch. Khi gọi phương thức `methodA`, phương thức `methodB` sẽ tham gia vào giao dịch của `methodA` và được thực thi trong giao dịch.

3. `PROPAGATION_MANDATORY`: Nếu đã tồn tại một giao dịch, phương thức sẽ hỗ trợ giao dịch hiện tại. Nếu không có giao dịch hoạt động, một ngoại lệ sẽ được ném ra.

```java
// Thuộc tính truyền bá PROPAGATION_REQUIRED
methodA(){
    methodB();
}

// Thuộc tính truyền bá PROPAGATION_MANDATORY
methodB(){
    ……
}
```

Khi gọi phương thức `methodB` độc lập, vì không có giao dịch hoạt động, một ngoại lệ `IllegalTransactionStateException` sẽ được ném ra với thông báo "Transaction propagation 'mandatory' but no existing transaction found". Khi gọi phương thức `methodA`, phương thức `methodB` sẽ tham gia vào giao dịch của `methodA` và được thực thi trong giao dịch.

4. `PROPAGATION_REQUIRES_NEW` luôn mở một giao dịch mới. Nếu một giao dịch đã tồn tại, nó sẽ treo giao dịch hiện có.

```java
// Thuộc tính giao dịch PROPAGATION_REQUIRED
methodA(){
    làmMộtSốViệcA();
    methodB();
    làmMộtSốViệcB();
}

// Thuộc tính giao dịch PROPAGATION_REQUIRES_NEW
methodB(){
    ……
}
```

Gọi phương thức A:

```java
main(){
    methodA();
}
```

Tương đương với

```java
main(){
    TransactionManager tm = null;
    try{
        // Lấy một quản lý giao dịch JTA
        tm = getTransactionManager();
        tm.begin(); // Mở một giao dịch mới
        Transaction ts1 = tm.getTransaction();
        làmMộtSốViệc();
        tm.suspend(); // Treo giao dịch hiện tại
        try{
            tm.begin(); // Mở lại giao dịch thứ hai
            Transaction ts2 = tm.getTransaction();
            methodB();
            ts2.commit(); // Gửi giao dịch thứ hai
        } Catch(RunTimeException ex) {
            ts2.rollback(); // Quay lại giao dịch thứ hai
        } finally {
            // Giải phóng tài nguyên
        }
        // Sau khi methodB thực hiện xong, khôi phục giao dịch đầu tiên
        tm.resume(ts1);
        làmMộtSốViệcB();
        ts1.commit(); // Gửi giao dịch đầu tiên
    } catch(RunTimeException ex) {
        ts1.rollback(); // Quay lại giao dịch đầu tiên
    } finally {
        // Giải phóng tài nguyên
    }
}
```

Ở đây, tôi gọi ts1 là giao dịch bên ngoài và ts2 là giao dịch bên trong. Từ đoạn mã trên, ta có thể thấy ts2 và ts1 là hai giao dịch độc lập, không liên quan đến nhau. Ts2 không phụ thuộc vào thành công của ts1. Nếu phương thức methodA gặp lỗi sau khi gọi phương thức methodB và phương thức doSomeThingB, kết quả của methodB vẫn được gửi. Nhưng các kết quả khác do các đoạn mã khác gây ra sẽ bị quay lại. Để sử dụng PROPAGATION_REQUIRES_NEW, cần sử dụng JtaTransactionManager làm quản lý giao dịch.

5. `PROPAGATION_NOT_SUPPORTED` luôn thực hiện một phương thức mà không có giao dịch và tạm dừng bất kỳ giao dịch nào đang tồn tại. Để sử dụng PROPAGATION_NOT_SUPPORTED, cũng cần sử dụng JtaTransactionManager làm quản lý giao dịch. (Mã ví dụ tương tự như trên, có thể áp dụng tương tự)
6. `PROPAGATION_NEVER` luôn thực hiện một phương thức mà không có giao dịch và nếu có bất kỳ giao dịch nào đang hoạt động, nó sẽ ném ra một ngoại lệ.
7. `PROPAGATION_NESTED` nếu có một giao dịch hoạt động, nó sẽ chạy trong một giao dịch lồng nhau. Nếu không có giao dịch hoạt động, nó sẽ chạy theo thuộc tính `PROPAGATION_REQUIRED`. Đây là một giao dịch lồng nhau, chỉ hỗ trợ `DataSourceTransactionManager` làm quản lý giao dịch khi sử dụng JDBC 3.0 trở lên. Cần có lớp `java.sql.Savepoint` của JDBC driver và một số triển khai của quản lý giao dịch JTA có thể cung cấp chức năng tương tự. Để sử dụng PROPAGATION_NESTED, cần đặt thuộc tính `nestedTransactionAllowed` của `PlatformTransactionManager` thành true; giá trị mặc định của `nestedTransactionAllowed` là false.

Trong ví dụ trên, khi gọi phương thức methodB trước, gọi phương thức setSavepoint để lưu trạng thái hiện tại vào savepoint. Nếu phương thức methodB gọi thất bại, thì sẽ khôi phục lại trạng thái đã lưu trước đó. Tuy nhiên, cần lưu ý rằng giao dịch tại thời điểm này chưa được commit, nếu đoạn mã tiếp theo (phương thức doSomeThingB()) gặp lỗi, thì sẽ rollback tất cả các thao tác của methodB.

Giao dịch lồng nhau là một khái niệm quan trọng, trong đó giao dịch bên trong phụ thuộc vào giao dịch bên ngoài. Khi giao dịch bên ngoài thất bại, các hành động của giao dịch bên trong sẽ bị rollback. Trong khi các hành động của giao dịch bên trong thất bại không gây ra rollback của giao dịch bên ngoài.

Sự khác biệt giữa PROPAGATION_NESTED và PROPAGATION_REQUIRES_NEW: Chúng rất tương tự, đều giống như một giao dịch lồng nhau, nếu không có giao dịch hoạt động, cả hai đều mở một giao dịch mới. Khi sử dụng PROPAGATION_REQUIRES_NEW, giao dịch bên trong và giao dịch bên ngoài giống như hai giao dịch độc lập, sau khi giao dịch bên trong được commit, giao dịch bên ngoài không thể rollback nó. Hai giao dịch không ảnh hưởng lẫn nhau và không phải là một giao dịch lồng nhau thực sự. Đồng thời, nó cần hỗ trợ của quản lý giao dịch JTA.

Khi sử dụng PROPAGATION_NESTED, rollback của giao dịch bên ngoài có thể gây ra rollback của giao dịch bên trong. Trong khi ngoại lệ của giao dịch bên trong không gây ra rollback của giao dịch bên ngoài, đó là một giao dịch lồng nhau thực sự. `DataSourceTransactionManager` sử dụng savepoint để hỗ trợ PROPAGATION_NESTED, cần hỗ trợ JDBC 3.0 trở lên và phiên bản JDK 1.4 trở lên. Các triển khai khác của quản lý giao dịch JTA có thể có cách hỗ trợ khác nhau.

PROPAGATION_REQUIRES_NEW khởi động một giao dịch "nội bộ" mới không phụ thuộc vào môi trường. Giao dịch này sẽ được commit hoặc rollback hoàn toàn mà không phụ thuộc vào giao dịch bên ngoài, nó có phạm vi cô lập riêng, khóa riêng, v.v. Khi giao dịch bên trong bắt đầu thực thi, giao dịch bên ngoài sẽ bị tạm dừng và khi giao dịch bên trong kết thúc, giao dịch bên ngoài sẽ tiếp tục thực thi.

Mặt khác, PROPAGATION_NESTED bắt đầu một giao dịch "lồng nhau" thực sự, nó là một giao dịch con thực sự của giao dịch hiện tại. Khi giao dịch con bắt đầu thực thi, nó sẽ lấy một savepoint. Nếu giao dịch con thất bại, chúng ta sẽ rollback đến savepoint đó. Giao dịch con là một phần của giao dịch bên ngoài, chỉ khi giao dịch bên ngoài kết thúc, giao dịch con mới được commit.

Từ đó có thể thấy, sự khác biệt lớn nhất giữa PROPAGATION_REQUIRES_NEW và PROPAGATION_NESTED là, PROPAGATION_REQUIRES_NEW hoàn toàn là một giao dịch mới, trong khi PROPAGATION_NESTED là một giao dịch con của giao dịch bên ngoài, nếu giao dịch bên ngoài commit, giao dịch con cũng sẽ được commit, quy tắc này cũng áp dụng cho rollback.

PROPAGATION_REQUIRED nên là lựa chọn đầu tiên cho hành vi truyền giao dịch. Nó có thể đáp ứng hầu hết các yêu cầu giao dịch của chúng ta.

#### Các mức độ cô lập

Một khía cạnh quan trọng khác của giao dịch là mức độ cô lập (isolation level). Mức độ cô lập xác định mức độ ảnh hưởng của các giao dịch đồng thời khác đến một giao dịch cụ thể.

1. Vấn đề gây ra bởi các giao dịch đồng thời

Trong các ứng dụng thông thường, nhiều giao dịch chạy đồng thời và thường thao tác trên cùng dữ liệu để hoàn thành nhiệm vụ của mình. Mặc dù sự đồng thời là cần thiết, nhưng nó có thể gây ra các vấn đề sau:

- Đọc dữ liệu bẩn (Dirty reads) - Đọc dữ liệu bẩn xảy ra khi một giao dịch đọc dữ liệu đã được ghi lại bởi một giao dịch khác nhưng chưa được commit. Nếu giao dịch đó bị rollback sau đó, dữ liệu mà giao dịch đầu tiên đã đọc sẽ là không hợp lệ.
- Đọc không nhất quán (Nonrepeatable reads) - Đọc không nhất quán xảy ra khi một giao dịch thực hiện cùng một truy vấn hai lần hoặc nhiều lần nhưng mỗi lần đều nhận được kết quả khác nhau. Điều này thường xảy ra khi một giao dịch khác thực hiện các thay đổi giữa hai lần đọc.
- Đọc giả (Phantom reads) - Đọc giả tương tự như đọc không nhất quán. Nó xảy ra khi một giao dịch đọc một số hàng dữ liệu, sau đó một giao dịch khác chèn thêm dữ liệu vào giữa các hàng đó. Trong các truy vấn sau đó, giao dịch đầu tiên sẽ phát hiện ra rằng có thêm các hàng mà ban đầu không tồn tại.

**Sự khác biệt giữa đọc không nhất quán và đọc giả**

Đọc không nhất quán tập trung vào việc thay đổi:  
Cùng một điều kiện, bạn đọc dữ liệu mà bạn đã đọc trước đó và nhận thấy rằng giá trị đã thay đổi.  
Ví dụ: Trong giao dịch 1, Mary đọc giá trị lương của mình là 1000, nhưng giao dịch này chưa hoàn thành.

```
    con1 = getConnection();
    select salary from employee empId ="Mary";
```

Trong giao dịch 2, người quản lý tài chính thay đổi lương của Mary thành 2000 và commit giao dịch.

```
    con2 = getConnection();
    update employee set salary = 2000;
    con2.commit();
```

Trong giao dịch 1, Mary đọc lại giá trị lương của mình và thấy rằng lương đã thay đổi thành 2000.

```
    //con1
    select salary from employee empId ="Mary";
```

Kết quả đọc hai lần trong cùng một giao dịch không nhất quán, gây ra đọc không nhất quán.

Đọc giả tập trung vào việc thêm hoặc xóa:  
Cùng một điều kiện, số lượng bản ghi đọc lần thứ nhất và lần thứ hai không giống nhau.  
Ví dụ: Hiện có 10 nhân viên có mức lương là 1000. Giao dịch 1 đọc tất cả nhân viên có mức lương là 1000.

```
    con1 = getConnection();
    Select * from employee where salary =1000;
```

Có thêm một giao dịch khác chèn một bản ghi nhân viên mới với mức lương là 1000.

```
    con2 = getConnection();
    Insert into employee(empId,salary) values("Lili",1000);
    con2.commit();
```

Giao dịch 1 đọc lại tất cả nhân viên có mức lương là 1000.

```
    //con1
    select * from employee where salary =1000;
```

Có tổng cộng 11 bản ghi được đọc, gây ra hiện tượng đọc giả.

Tổng kết lại, dường như đọc không nhất quán và đọc giả đều có kết quả đọc hai lần không nhất quán. Nhưng nếu bạn nhìn từ góc độ kiểm soát, sự khác biệt giữa hai trường hợp này là rất lớn.  
Đối với trường hợp đầu tiên, chỉ cần khóa các bản ghi thỏa mãn điều kiện.  
Đối với trường hợp thứ hai, cần khóa các bản ghi thỏa mãn điều kiện và các bản ghi gần kề.

2. Mức độ cô lập

| Mức độ cô lập                   | Ý nghĩa                                                                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ISOLATION_DEFAULT          | Sử dụng mức độ cô lập mặc định của cơ sở dữ liệu                                                                                                                           |
| ISOLATION_READ_UNCOMMITTED | Mức độ cô lập thấp nhất, cho phép đọc các thay đổi chưa được commit, có thể gây ra đọc dữ liệu bẩn, đọc không nhất quán hoặc đọc giả                                                                           |
| ISOLATION_READ_COMMITTED   | Cho phép đọc các thay đổi đã được commit bởi các giao dịch đồng thời, có thể ngăn chặn đọc dữ liệu bẩn, nhưng đọc không nhất quán hoặc đọc giả vẫn có thể xảy ra                                                                         |
| ISOLATION_REPEATABLE_READ  | Đảm bảo kết quả đọc nhiều lần của cùng một trường dữ liệu là nhất quán, trừ khi dữ liệu đó được ghi lại bởi chính giao dịch hiện tại, có thể ngăn chặn đọc dữ liệu bẩn và đọc không nhất quán, nhưng đọc giả vẫn có thể xảy ra                                       |
| ISOLATION_SERIALIZABLE     | Mức độ cô lập cao nhất, tuân thủ đầy đủ các yêu cầu ACID, đảm bảo ngăn chặn đọc dữ liệu bẩn, đọc không nhất quán và đọc giả, đây cũng là mức độ cô lập chậm nhất vì thường được thực hiện bằng cách khóa toàn bộ các bảng liên quan đến giao dịch |

#### Read-only (Chỉ đọc)

Một trong các đặc điểm của giao dịch là nó có phải là giao dịch chỉ đọc hay không. Nếu giao dịch chỉ thực hiện các thao tác đọc trên cơ sở dữ liệu, hệ thống cơ sở dữ liệu có thể tận dụng tính chất chỉ đọc của giao dịch để tối ưu hóa một số hoạt động cụ thể. Bằng cách đặt giao dịch thành chỉ đọc, bạn có thể cung cấp cho cơ sở dữ liệu cơ hội áp dụng các biện pháp tối ưu mà nó cho là phù hợp.

#### Transaction Timeout (Thời gian chờ giao dịch)

Để ứng dụng hoạt động tốt, giao dịch không thể chạy quá lâu. Vì giao dịch có thể liên quan đến việc khóa cơ sở dữ liệu phía sau, giao dịch kéo dài quá lâu sẽ chiếm dụng tài nguyên cơ sở dữ liệu một cách không cần thiết. Thời gian chờ giao dịch là một bộ hẹn giờ cho giao dịch, nếu trong khoảng thời gian nhất định mà giao dịch không hoàn thành, nó sẽ tự động quay lại trạng thái ban đầu, thay vì tiếp tục chờ đợi.

#### Rollback Rules (Quy tắc hoàn tác)

Một trong những khía cạnh cuối cùng của ngũ giác giao dịch là một tập hợp các quy tắc, xác định những ngoại lệ nào sẽ gây ra việc hoàn tác giao dịch và những ngoại lệ nào không. Mặc định, giao dịch chỉ hoàn tác khi gặp phải ngoại lệ thời gian chạy, trong khi không hoàn tác khi gặp phải ngoại lệ kiểu kiểm tra (hành vi này tương tự với hành vi hoàn tác của EJB). Tuy nhiên, bạn có thể khai báo giao dịch sẽ hoàn tác khi gặp phải các ngoại lệ kiểu kiểm tra cụ thể như khi gặp phải ngoại lệ thời gian chạy. Tương tự, bạn cũng có thể khai báo giao dịch sẽ không hoàn tác khi gặp phải các ngoại lệ cụ thể, ngay cả khi chúng là ngoại lệ thời gian chạy.

### TransactionStatus

interface `TransactionStatus` cung cấp một cách đơn giản để điều khiển việc thực thi giao dịch và truy vấn trạng thái giao dịch cho mã giao dịch. Các khái niệm này nên quen thuộc vì chúng là chung cho tất cả các API giao dịch. Dưới đây là một ví dụ về interface `TransactionStatus`:

```java
public interface TransactionStatus extends TransactionExecution, SavepointManager, Flushable {

    @Override
    boolean isNewTransaction();

    boolean hasSavepoint();

    @Override
    void setRollbackOnly();

    @Override
    boolean isRollbackOnly();

    void flush();

    @Override
    boolean isCompleted();
}
```

Có thể thấy rằng interface này mô tả các phương thức để điều khiển việc thực thi giao dịch và truy vấn trạng thái giao dịch một cách đơn giản, và cần áp dụng trạng thái giao dịch tương ứng khi rollback hoặc commit.

### TransactionTemplate

Spring cung cấp hỗ trợ cho giao dịch theo cách lập trình và theo cách khai báo. Giao dịch theo cách lập trình cho phép người dùng xác định rõ ranh giới của giao dịch trong mã nguồn, trong khi giao dịch theo cách khai báo (dựa trên AOP) giúp người dùng tách biệt các hoạt động khỏi quy tắc giao dịch. `TransactionTemplate` là API cốt lõi được sử dụng để hỗ trợ giao dịch theo cách lập trình.

Việc sử dụng `TransactionTemplate` tương tự như việc sử dụng các template Spring khác như JdbcTemplate và HibernateTemplate. Nó sử dụng phương thức gọi lại (callback) để giải phóng ứng dụng khỏi việc xử lý lấy và giải phóng tài nguyên. Giống như các template khác, `TransactionTemplate` là luồng an toàn. Đoạn mã sau đây là một ví dụ về việc sử dụng `TransactionTemplate`:

```java
    TransactionTemplate tt = new TransactionTemplate(); // Tạo một TransactionTemplate mới
    Object result = tt.execute(
        new TransactionCallback(){
            public Object doTransaction(TransactionStatus status){
                updateOperation();
                return resultOfUpdateOperation();
            }
    }); // Thực thi phương thức execute để quản lý giao dịch
```

`TransactionCallback()` có thể trả về một giá trị. Nếu sử dụng `TransactionCallbackWithoutResult`, thì không có giá trị trả về.

## Quản lý giao dịch theo cách khai báo

> Hầu hết người dùng Spring đều chọn quản lý giao dịch theo cách khai báo. Tùy chọn này ảnh hưởng ít nhất đến mã ứng dụng, do đó phù hợp nhất với lý tưởng của một container nhẹ không xâm nhập.

Quản lý giao dịch theo cách khai báo trong Spring Framework được thực hiện thông qua Spring AOP. Tuy nhiên, vì mã liên quan đến giao dịch được cung cấp cùng với bản phân phối Spring và có thể được sử dụng theo cách mẫu, nên thường không cần hiểu rõ về khái niệm AOP để sử dụng mã này một cách hiệu quả.

Quản lý giao dịch theo cách khai báo trong Spring Framework tương tự như EJB CMT, vì bạn có thể chỉ định hành vi giao dịch (hoặc thiếu nó) cho từng phương thức cụ thể. Nếu cần thiết, bạn có thể gọi `setRollbackOnly()` trong ngữ cảnh giao dịch. Sự khác biệt giữa hai loại quản lý giao dịch là:

- Khác với EJB CMT được liên kết với JTA, quản lý giao dịch theo cách khai báo trong Spring Framework phù hợp với môi trường bất kỳ. Bằng cách điều chỉnh tệp cấu hình, nó có thể sử dụng giao dịch JTA hoặc giao dịch cục bộ bằng JDBC, JPA hoặc Hibernate.
- Bạn có thể áp dụng quản lý giao dịch theo cách khai báo của Spring cho bất kỳ lớp nào, không chỉ là các lớp đặc biệt như EJB.
- Spring cung cấp quy tắc rollback theo cách khai báo, đây là một tính năng không có trong EJB tương đương. Nó cung cấp hỗ trợ cho quy tắc rollback cả trong việc lập trình và khai báo.
- Spring cho phép bạn tùy chỉnh hành vi giao dịch bằng AOP. Ví dụ, bạn có thể chèn hành vi tùy chỉnh trong trường hợp giao dịch bị rollback. Bạn cũng có thể thêm bất kỳ advice nào, bao gồm advice về giao dịch. Trong EJB CMT, bạn không thể ảnh hưởng đến quản lý giao dịch của container trừ khi sử dụng `setRollbackOnly()`.
- Spring không hỗ trợ việc truyền ngữ cảnh giao dịch qua các cuộc gọi từ xa như các máy chủ ứng dụng cao cấp. Nếu bạn cần tính năng này, chúng tôi khuyến nghị sử dụng EJB. Tuy nhiên, hãy cân nhắc kỹ trước khi sử dụng tính năng này, vì thường không muốn giao dịch trải dài qua các cuộc gọi từ xa.

Khái niệm về quy tắc rollback là quan trọng. Chúng cho phép bạn chỉ định những ngoại lệ (và throwable) nào sẽ tự động gây ra việc rollback. Bạn có thể chỉ định nó theo cách khai báo trong tệp cấu hình, thay vì trong mã Java. Do đó, mặc dù bạn vẫn có thể gọi `setRollbackOnly()` trên đối tượng TransactionStatus để rollback giao dịch hiện tại, nhưng thường bạn có thể chỉ định quy tắc rằng MyApplicationException luôn phải gây ra rollback. Lợi ích đáng kể của tùy chọn này là đối tượng kinh doanh không phụ thuộc vào cơ sở hạ tầng giao dịch. Ví dụ, chúng thường không cần nhập các API giao dịch Spring hoặc API Spring khác.

Mặc dù hành vi mặc định của EJB container là tự động rollback giao dịch trên ngoại lệ hệ thống (thường là ngoại lệ chạy thời gian), nhưng EJB CMT không tự động rollback giao dịch trên ngoại lệ ứng dụng (nghĩa là ngoại lệ kiểm tra ngoại lệ khác RemoteException). Mặc dù hành vi mặc định của quản lý giao dịch theo cách khai báo trong Spring tuân theo quy ước EJB (rollback chỉ tự động trên ngoại lệ không kiểm tra), nhưng thường hữu ích để tùy chỉnh hành vi này.

### Triển khai quản lý giao dịch theo cách khai báo của Spring

Về hỗ trợ quản lý giao dịch theo cách khai báo trong Spring Framework, khái niệm quan trọng nhất là hỗ trợ này được kích hoạt thông qua AOP proxy và advice giao dịch được điều khiển bằng siêu dữ liệu (hiện tại là dựa trên XML hoặc dựa trên chú thích). Sự kết hợp giữa AOP và siêu dữ liệu giao dịch tạo ra một proxy AOP, sử dụng `TransactionInterceptor` và các implement của `TransactionManager` thích hợp để điều khiển giao dịch xung quanh cuộc gọi phương thức.

`TransactionInterceptor` của Spring cung cấp quản lý giao dịch cho cả mô hình lập trình lệnh và mô hình lập trình phản ứng. Interceptor phát hiện kiểu quản lý giao dịch yêu cầu bằng cách kiểm tra kiểu trả về của phương thức. Phương thức trả về kiểu phản ứng, chẳng hạn như Publisher hoặc Kotlin Flow (hoặc các loại con của chúng), đủ điều kiện để quản lý giao dịch phản ứng. Tất cả các loại trả về khác, bao gồm void, sử dụng quản lý giao dịch lệnh.

Kiểu quản lý giao dịch ảnh hưởng đến loại quản lý giao dịch cần thiết. Quản lý giao dịch lệnh yêu cầu `PlatformTransactionManager`, trong khi quản lý giao dịch phản ứng sử dụng `ReactiveTransactionManager`.

> `@Transactional` thường được sử dụng cùng với giao dịch được ràng buộc với luồng được quản lý bởi `PlatformTransactionManager`, làm cho giao dịch có sẵn cho tất cả các hoạt động truy cập dữ liệu trong luồng thực thi hiện tại. Lưu ý: Điều này không được truyền cho các luồng mới được khởi động trong phương thức.
>
> Giao dịch phản ứng được quản lý bởi `ReactiveTransactionManager` sử dụng ngữ cảnh Reactor thay vì thuộc tính cục bộ của luồng. Do đó, tất cả các hoạt động truy cập dữ liệu tham gia đều cần được thực hiện trong cùng một luồng Reactor trong cùng một ngữ cảnh Reactor.

### Ví dụ về quản lý giao dịch theo cách khai báo

Xem xét interface và lớp cài đặt đi kèm sau đây. Ví dụ này sử dụng lớp Foo và Bar như các đối tượng giả để bạn có thể tập trung vào việc sử dụng giao dịch mà không cần quan tâm đến mô hình miền cụ thể. Trong trường hợp này, việc lớp DefaultFooService ném một instance UnsupportedOperationException trong thân của mỗi phương thức đã được triển khai là tốt. Hành vi này cho phép bạn xem giao dịch đang được tạo và sau đó rollback để phản hồi UnsupportedOperationException.

Dưới đây là một ví dụ về interface FooService:

```java
// interface dịch vụ mà chúng ta muốn quản lý giao dịch
package x.y.service;

public interface FooService {

    Foo getFoo(String fooName);

    Foo getFoo(String fooName, String barName);

    void insertFoo(Foo foo);

    void updateFoo(Foo foo);

}
```

Dưới đây là một ví dụ về lớp cài đặt cho interface trên:

```java
package x.y.service;

public class DefaultFooService implements FooService {

    @Override
    public Foo getFoo(String fooName) {
        // ...
    }

    @Override
    public Foo getFoo(String fooName, String barName) {
        // ...
    }

    @Override
    public void insertFoo(Foo foo) {
        // ...
    }

    @Override
    public void updateFoo(Foo foo) {
        // ...
    }
}
```

Giả sử hai phương thức đầu tiên của interface FooService, getFoo(String) và getFoo(String, String), phải chạy trong ngữ cảnh giao dịch chỉ đọc, trong khi các phương thức khác insertFoo(Foo) và updateFoo(Foo) phải chạy trong ngữ cảnh giao dịch đọc/ghi. Cấu hình dưới đây sẽ được giải thích chi tiết trong các phần tiếp theo:

```xml
<!-- from the file 'context.xml' -->
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:aop="http://www.springframework.org/schema/aop"
    xmlns:tx="http://www.springframework.org/schema/tx"
    xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/tx
        https://www.springframework.org/schema/tx/spring-tx.xsd
        http://www.springframework.org/schema/aop
        https://www.springframework.org/schema/aop/spring-aop.xsd">

    <!-- this is the service object that we want to make transactional -->
    <bean id="fooService" class="x.y.service.DefaultFooService"/>

    <!-- the transactional advice (what 'happens'; see the <aop:advisor/> bean below) -->
    <tx:advice id="txAdvice" transaction-manager="txManager">
        <!-- the transactional semantics... -->
        <tx:attributes>
            <!-- all methods starting with 'get' are read-only -->
            <tx:method name="get*" read-only="true"/>
            <!-- other methods use the default transaction settings (see below) -->
            <tx:method name="*"/>
        </tx:attributes>
    </tx:advice>

    <!-- ensure that the above transactional advice runs for any execution
        of an operation defined by the FooService interface -->
    <aop:config>
        <aop:pointcut id="fooServiceOperation" expression="execution(* x.y.service.FooService.*(..))"/>
        <aop:advisor advice-ref="txAdvice" pointcut-ref="fooServiceOperation"/>
    </aop:config>

    <!-- don't forget the DataSource -->
    <bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource" destroy-method="close">
        <property name="driverClassName" value="oracle.jdbc.driver.OracleDriver"/>
        <property name="url" value="jdbc:oracle:thin:@rj-t42:1521:elvis"/>
        <property name="username" value="scott"/>
        <property name="password" value="tiger"/>
    </bean>

    <!-- similarly, don't forget the TransactionManager -->
    <bean id="txManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>

    <!-- other <bean/> definitions here -->

</beans>
```

Hãy xem xét cấu hình trên. Nó giả định rằng bạn muốn làm cho đối tượng dịch vụ fooService bean có tính chất giao dịch. Các ngữ nghĩa giao dịch cần áp dụng được đóng gói trong `<tx:advice/>` định nghĩa. `<tx:advice/>` định nghĩa được đọc là "tất cả các phương thức bắt đầu bằng 'get' sẽ chạy trong ngữ cảnh giao dịch chỉ đọc, tất cả các phương thức khác sẽ chạy với ngữ cảnh giao dịch mặc định". Thuộc tính `transaction-manager` của thẻ `<tx:advice/>` được đặt thành tên của bean TransactionManager sẽ điều khiển giao dịch (trong trường hợp này là bean txManager).

> Nếu tên bean của TransactionManager mà bạn muốn kết nối có tên là transactionManager, bạn có thể bỏ qua thuộc tính transaction-manager trong advice giao dịch (tx:advice/). Nếu tên bean của TransactionManager cần kết nối có bất kỳ tên nào khác, bạn phải sử dụng thuộc tính transaction-manager một cách rõ ràng, như trong ví dụ trước.

`<aop:config/>` đảm bảo rằng lời khuyên giao dịch được định nghĩa bởi `txAdvice` bean sẽ chạy ở vị trí thích hợp trong chương trình. Đầu tiên, bạn định nghĩa một điểm cắt (pointcut) tương ứng với việc thực hiện bất kỳ hoạt động nào được xác định bởi `FooService` interface (fooServiceOperation). Sau đó, bạn sử dụng một advisor để liên kết điểm cắt với `txAdvice`. Kết quả là khi thực hiện fooServiceOperation, lời khuyên được định nghĩa bởi `txAdvice` sẽ chạy.

Một yêu cầu phổ biến là làm cho toàn bộ tầng dịch vụ có tính chất giao dịch. Cách tốt nhất là thay đổi biểu thức điểm cắt để phù hợp với bất kỳ hoạt động nào trong tầng dịch vụ. Ví dụ sau cho thấy cách thực hiện điều này:

```xml
<aop:config>
    <aop:pointcut id="fooServiceMethods" expression="execution(* x.y.service.*.*(..))"/>
    <aop:advisor advice-ref="txAdvice" pointcut-ref="fooServiceMethods"/>
</aop:config>
```

Cấu hình trên được sử dụng để tạo ra một proxy giao dịch xung quanh đối tượng được xác định bởi bean fooService. Proxy được cấu hình với lời khuyên giao dịch để khởi động, tạm dừng, đánh dấu chỉ đọc và các giao dịch khác tùy thuộc vào cấu hình giao dịch liên kết với phương thức đó. Xem xét chương trình kiểm tra được thúc đẩy bởi cấu hình trước đó:

```java
public final class Boot {

    public static void main(final String[] args) throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("context.xml");
        FooService fooService = ctx.getBean(FooService.class);
        fooService.insertFoo(new Foo());
    }
}
```

### Rollback trong một giao dịch khai báo

Trong Spring Framework, cách khuyến nghị để kích hoạt việc rollback giao dịch là ném một ngoại lệ trong ngữ cảnh giao dịch. Spring Transaction Framework sẽ bắt các ngoại lệ chưa được xử lý và xác định xem liệu có đánh dấu giao dịch để rollback hay không.

Trong cấu hình mặc định của nó, Spring Transaction Framework chỉ đánh dấu giao dịch để rollback khi có ngoại lệ chạy thời gian chưa được kiểm tra. Điều này có nghĩa là khi ngoại lệ được ném là một instance của RuntimeException hoặc lớp con của nó. (Mặc định, các instance của Error cũng sẽ dẫn đến việc rollback). Các ngoại lệ kiểm tra được ném từ phương thức giao dịch không gây rollback trong cấu hình mặc định.

Bạn có thể xác định các quy tắc rollback cụ thể bằng cách chỉ định các loại ngoại lệ sẽ dẫn đến việc rollback giao dịch.

> Quy tắc rollback được định nghĩa bằng cách chỉ định mẫu cho các ngoại lệ sẽ dẫn đến việc rollback khi chúng được ném.
>
> Quy tắc rollback có thể được cấu hình trong XML bằng cách sử dụng thuộc tính `rollback-for` và `no-rollback-for`, cho phép chỉ định mẫu dưới dạng chuỗi. Khi sử dụng `@Transactional`, bạn có thể cấu hình quy tắc rollback bằng cách sử dụng các thuộc tính `rollbackFor` / `noRollbackFor` và `rollbackForClassName` / `noRollbackForClassName`, cho phép chỉ định mẫu dưới dạng tham chiếu lớp hoặc chuỗi. Khi loại ngoại lệ được chỉ định là tham chiếu lớp, tên đầy đủ của nó sẽ được sử dụng làm mẫu. Vì vậy, `@Transactional(rollbackFor = example.CustomException.class)` tương đương với `@Transactional(rollbackForClassName = 'example.CustomException')`.

Dưới đây là một đoạn mã XML mô tả cách cấu hình mẫu ngoại lệ để chỉ định rollback cho một số loại Exception đã được kiểm tra:

```xml
<tx:advice id="txAdvice" transaction-manager="txManager">
    <tx:attributes>
        <tx:method name="get*" read-only="true" rollback-for="NoProductInStockException"/>
        <tx:method name="*"/>
    </tx:attributes>
</tx:advice>
```

Nếu bạn không muốn rollback giao dịch khi ngoại lệ được ném, bạn cũng có thể chỉ định quy tắc "không rollback". Ví dụ dưới đây cho biết rằng, ngay cả khi có một InstrumentNotFoundException chưa được xử lý, giao dịch phụ trợ vẫn sẽ được commit.

```xml
<tx:advice id="txAdvice">
    <tx:attributes>
        <tx:method name="updateStock" no-rollback-for="InstrumentNotFoundException"/>
        <tx:method name="*"/>
    </tx:attributes>
</tx:advice>
```

Khi Spring Transaction Framework bắt được ngoại lệ và kiểm tra các quy tắc rollback đã được cấu hình để xác định xem có đánh dấu giao dịch để rollback hay không, quy tắc khớp tốt nhất sẽ quyết định. Vì vậy, trong cấu hình sau, bất kỳ ngoại lệ nào ngoại trừ `InstrumentNotFoundException` đều sẽ dẫn đến việc rollback giao dịch.

```xml
<tx:advice id="txAdvice">
    <tx:attributes>
        <tx:method name="*" rollback-for="Throwable" no-rollback-for="InstrumentNotFoundException"/>
    </tx:attributes>
</tx:advice>
```

Bạn cũng có thể chỉ định rollback theo cách thủ công nếu bạn muốn. Mặc dù đơn giản, quá trình này rất xâm nhập và làm cho mã của bạn phụ thuộc chặt chẽ vào cơ sở hạ tầng giao dịch của Spring Framework. Ví dụ dưới đây cho thấy cách thủ công rollback.

```java
public void resolvePosition() {
    try {
        // một số logic kinh doanh...
    } catch (NoProductInStockException ex) {
        // kích hoạt rollback theo cách thủ công
        TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
    }
}
```

Nếu có thể, chúng tôi khuyến nghị sử dụng rollback theo cách khai báo. Nếu tuyệt đối cần thiết, bạn có thể sử dụng rollback theo cách thủ công, nhưng việc sử dụng nó làm mất tính sạch của kiến trúc dựa trên POJO.

### Cấu hình ngữ cảnh giao dịch khác nhau cho các Bean khác nhau

Giả sử bạn có một tình huống trong đó bạn có nhiều đối tượng dịch vụ và bạn muốn áp dụng cấu hình giao dịch hoàn toàn khác nhau cho mỗi đối tượng. Bạn có thể làm điều này bằng cách định nghĩa các điểm cắt (pointcut) khác nhau với các giá trị `advice-ref` khác nhau trong các phần tử `<aop:advisor/>`.

Ví dụ, giả sử tất cả các lớp dịch vụ của bạn được định nghĩa trong gói gốc `x.y.service`. Để áp dụng cấu hình giao dịch mặc định cho tất cả các bean có tên kết thúc bằng "Service" trong gói này (hoặc các gói con), bạn có thể viết như sau:

```xml
<aop:config>
    <aop:pointcut id="serviceOperation" expression="execution(* x.y.service..*Service.*(..))"/>
    <aop:advisor pointcut-ref="serviceOperation" advice-ref="txAdvice"/>
</aop:config>
```

Trong ví dụ trên, tất cả các bean có tên kết thúc bằng "Service" trong gói `x.y.service` (và các gói con) sẽ có cấu hình giao dịch mặc định. Bạn cũng có thể định nghĩa các điểm cắt khác và liên kết chúng với các `advice` khác nhau để áp dụng cấu hình giao dịch khác nhau cho các bean khác nhau.

Dưới đây là một ví dụ về cách cấu hình hai bean khác nhau với cấu hình giao dịch hoàn toàn khác nhau:

```xml
<aop:config>
    <aop:pointcut id="defaultServiceOperation" expression="execution(* x.y.service.*Service.*(..))"/>
    <aop:pointcut id="noTxServiceOperation" expression="execution(* x.y.service.ddl.DefaultDdlManager.*(..))"/>

    <aop:advisor pointcut-ref="defaultServiceOperation" advice-ref="defaultTxAdvice"/>
    <aop:advisor pointcut-ref="noTxServiceOperation" advice-ref="noTxAdvice"/>
</aop:config>

<!-- bean này sẽ có giao dịch (xem điểm cắt 'defaultServiceOperation') -->
<bean id="fooService" class="x.y.service.DefaultFooService"/>

<!-- bean này cũng sẽ có giao dịch, nhưng với cấu hình giao dịch hoàn toàn khác nhau -->
<bean id="anotherFooService" class="x.y.service.ddl.DefaultDdlManager"/>

<tx:advice id="defaultTxAdvice">
    <tx:attributes>
        <tx:method name="get*" read-only="true"/>
        <tx:method name="*"/>
    </tx:attributes>
</tx:advice>

<tx:advice id="noTxAdvice">
    <tx:attributes>
        <tx:method name="*" propagation="NEVER"/>
    </tx:attributes>
</tx:advice>
```

Trong ví dụ trên, bean `fooService` sẽ có cấu hình giao dịch mặc định, trong khi bean `anotherFooService` sẽ có cấu hình giao dịch hoàn toàn khác nhau.

### Cấu hình `<tx:advice/>`

Cấu hình mặc định của `<tx:advice/>` là:

- Propagation được đặt là `REQUIRED`
- Isolation level là `DEFAULT`
- Transaction là read-write
- Transaction timeout mặc định là timeout mặc định của hệ thống giao dịch cơ sở, nếu không hỗ trợ timeout thì là không có timeout.
- Bất kỳ `RuntimeException` nào sẽ gây ra rollback, trong khi bất kỳ `Exception` đã được kiểm tra nào sẽ không gây ra rollback.

Thuộc tính cấu hình của `<tx:advice/>`

| Thuộc tính        | Bắt buộc | Giá trị mặc định | Mô tả                                                                                                           |
|:----------------- |:-------- |:---------------- |:--------------------------------------------------------------------------------------------------------------- |
| `name`            | Có       |                  | Tên phương thức liên quan đến thuộc tính giao dịch. Hỗ trợ ký tự đại diện như `get*`, `handle*`, `on*Event`.    |
| `propagation`     | Không    | `REQUIRED`       | Hành vi truyền giao dịch                                                                                        |
| `isolation`       | Không    | `DEFAULT`        | Mức độ cô lập giao dịch. Chỉ áp dụng cho propagation setting `REQUIRED` hoặc `REQUIRES_NEW`.                    |
| `timeout`         | Không    | -1               | Thời gian timeout giao dịch (đơn vị: giây). Chỉ áp dụng cho propagation setting `REQUIRED` hoặc `REQUIRES_NEW`. |
| `read-only`       | Không    | false            | Giao dịch read-write hoặc read-only.                                                                            |
| `rollback-for`    | Không    |                  | Danh sách các instance `Exception` gây ra rollback (phân cách bằng dấu phẩy).                                   |
| `no-rollback-for` | Không    |                  | Danh sách các instance `Exception` không gây ra rollback (phân cách bằng dấu phẩy).                             |
|                   |          |                  |                                                                                                                 |

### Sử dụng chú thích `@Transactional`

Ngoài phương pháp cấu hình giao dịch dựa trên XML, bạn cũng có thể sử dụng phương pháp dựa trên chú thích.

Dưới đây là một ví dụ về việc sử dụng chú thích `@Transactional`:

```java
@Transactional
public class DefaultFooService implements FooService {

    @Override
    public Foo getFoo(String fooName) {
        // ...
    }

    @Override
    public Foo getFoo(String fooName, String barName) {
        // ...
    }

    @Override
    public void insertFoo(Foo foo) {
        // ...
    }

    @Override
    public void updateFoo(Foo foo) {
        // ...
    }
}
```

Như đã đề cập ở trên, khi sử dụng ở mức lớp, chú thích `@Transactional` cho biết tất cả các phương thức của lớp (và các lớp con của nó) sẽ sử dụng cấu hình giao dịch mặc định. Hoặc, bạn có thể chỉ định chú thích cho từng phương thức riêng lẻ. Lưu ý rằng chú thích ở mức lớp không áp dụng cho các lớp tổ tiên trong cấu trúc lớp; trong trường hợp này, các phương thức kế thừa cần được khai báo lại cục bộ để tham gia chú thích ở mức lớp con.

Khi lớp POJO trên được xác định là bean trong ngữ cảnh Spring, bạn có thể sử dụng chú thích `@EnableTransactionManagement` trong lớp `@Configuration` để các phiên bản bean có tính giao dịch.

Trong cấu hình XML, thẻ `<tx:annotation-driven/>` cung cấp tiện ích tương tự:

```xml
<!-- from the file 'context.xml' -->
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:aop="http://www.springframework.org/schema/aop"
    xmlns:tx="http://www.springframework.org/schema/tx"
    xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/tx
        https://www.springframework.org/schema/tx/spring-tx.xsd
        http://www.springframework.org/schema/aop
        https://www.springframework.org/schema/aop/spring-aop.xsd">

    <!-- this is the service object that we want to make transactional -->
    <bean id="fooService" class="x.y.service.DefaultFooService"/>

    <!-- enable the configuration of transactional behavior based on annotations -->
    <!-- a TransactionManager is still required -->
    <tx:annotation-driven transaction-manager="txManager"/>

    <bean id="txManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <!-- (this dependency is defined somewhere else) -->
        <property name="dataSource" ref="dataSource"/>
    </bean>

    <!-- other <bean/> definitions here -->

</beans>
```

#### Cấu hình `@Transactional`

| Thuộc tính                                                                                                                             | Kiểu dữ liệu                                                                  | Mô tả                                                                                                                         |
| :------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| [value](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#tx-multiple-tx-mgrs-with-attransactional) | `String`                                                                      | Bộ xác định tùy chọn chỉ định transaction manager sẽ được sử dụng.                                                             |
| `transactionManager`                                                                                                                   | `String`                                                                      | Bí danh cho `value`.                                                                                                          |
| `label`                                                                                                                                | Mảng các chuỗi `String` để thêm mô tả biểu đạt cho giao dịch.                                                                      | Nhãn có thể được đánh giá bởi transaction manager để liên kết hành vi cụ thể với giao dịch thực tế.                           |
| [propagation](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#tx-propagation)                     | `enum`: `Propagation`                                                         | Cài đặt truyền giao dịch tùy chọn.                                                                                           |
| `isolation`                                                                                                                            | `enum`: `Isolation`                                                           | Mức độ cô lập tùy chọn. Chỉ áp dụng cho các giá trị propagation là `REQUIRED` hoặc `REQUIRES_NEW`.                            |
| `timeout`                                                                                                                              | `int` (theo đơn vị giây)                                             | Thời gian timeout giao dịch tùy chọn. Chỉ áp dụng cho các giá trị propagation là `REQUIRED` hoặc `REQUIRES_NEW`.                |
| `timeoutString`                                                                                                                        | `String` (theo đơn vị giây)                                          | Tùy chọn khác để chỉ định `timeout` dưới dạng chuỗi `String` - ví dụ: như một placeholder.                                   |
| `readOnly`                                                                                                                             | `boolean`                                                                     | Giao dịch read-write hoặc read-only. Chỉ áp dụng cho các giá trị propagation là `REQUIRED` hoặc `REQUIRES_NEW`.               |
| `rollbackFor`                                                                                                                          | Mảng các đối tượng `Class`, phải là lớp con của `Throwable`.             | Mảng tùy chọn các loại ngoại lệ phải gây ra rollback.                                                                         |
| `rollbackForClassName`                                                                                                                 | Mảng các mẫu tên ngoại lệ.                                             | Mảng tùy chọn các mẫu tên ngoại lệ phải gây ra rollback.                                                                       |
| `noRollbackFor`                                                                                                                        | Mảng các đối tượng `Class`, phải là lớp con của `Throwable`.             | Mảng tùy chọn các loại ngoại lệ không được gây ra rollback.                                                                   |
| `noRollbackForClassName`                                                                                                               | Mảng các mẫu tên ngoại lệ.                                             | Mảng tùy chọn các mẫu tên ngoại lệ không được gây ra rollback.                                                                 |

#### Sử dụng `@Transactional` trong trường hợp nhiều Transaction Manager

Trong một số trường hợp, ứng dụng có thể cần kết nối với nhiều nguồn dữ liệu và tương ứng, cần nhiều Transaction Manager độc lập. Người dùng có thể sử dụng thuộc tính `value` hoặc `transactionManager` của chú thích `@Transactional` để chỉ định một cách có chọn lọc Transaction Manager được sử dụng. Điều này có thể là tên bean hoặc giá trị định danh của Transaction Manager bean.

```java
public class TransactionalService {

    @Transactional("order")
    public void setSomething(String name) { ... }

    @Transactional("account")
    public void doSomething() { ... }

    @Transactional("reactive-account")
    public Mono<Void> doSomethingReactive() { ... }
}
```

Dưới đây là cách định nghĩa Transaction Manager:

```xml
<tx:annotation-driven/>

    <bean id="transactionManager1" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        ...
        <qualifier value="order"/>
    </bean>

    <bean id="transactionManager2" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        ...
        <qualifier value="account"/>
    </bean>

    <bean id="transactionManager3" class="org.springframework.data.r2dbc.connectionfactory.R2dbcTransactionManager">
        ...
        <qualifier value="reactive-account"/>
    </bean>
```

Trong trường hợp này, các phương thức trên `TransactionalService` sẽ chạy trong các Transaction Manager riêng biệt, được phân biệt bởi các định danh order, account và reactive-account. Nếu không tìm thấy Transaction Manager bean được chỉ định một cách rõ ràng, vẫn sẽ sử dụng tên bean mục tiêu mặc định của `<tx:annotation-driven>`.

#### Tạo chú thích kết hợp tùy chỉnh

Nếu bạn thấy mình đang lặp lại các thuộc tính `@Transactional` giống nhau trên nhiều phương thức khác nhau, bạn có thể sử dụng meta-annotation của Spring để tạo chú thích kết hợp tùy chỉnh.

```java
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Transactional(transactionManager = "order", label = "causal-consistency")
public @interface OrderTx {
}

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Transactional(transactionManager = "account", label = "retryable")
public @interface AccountTx {
}
```

Ví dụ sử dụng:

```java
public class TransactionalService {

    @OrderTx
    public void setSomething(String name) {
        // ...
    }

    @AccountTx
    public void doSomething() {
        // ...
    }
}
```

Trong ví dụ trên, chúng ta sử dụng cú pháp để định nghĩa định danh transaction manager và nhãn giao dịch, nhưng chúng ta cũng có thể bao gồm hành vi truyền giao dịch, quy tắc rollback, timeout và các tính năng khác.

#### Truyền giao dịch

Trong giao dịch được quản lý bởi Spring, hãy lưu ý sự khác biệt giữa giao dịch vật lý và giao dịch logic, cũng như cách cài đặt truyền được áp dụng cho sự khác biệt này.

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20220928114544.png)

`PROPAGATION_REQUIRED` buộc thực hiện giao dịch vật lý, nếu không có giao dịch tồn tại, nó sẽ thực hiện trong phạm vi cục bộ của phạm vi hiện tại hoặc tham gia vào giao dịch "bên ngoài" đã được xác định bởi phạm vi lớn hơn. Đây là một cài đặt mặc định tốt trong các lịch trình gọi phổ biến trong cùng một luồng (ví dụ: một facade dịch vụ gọi nhiều phương thức repository, trong đó tất cả các nguồn tài nguyên cần tham gia vào giao dịch cấp dịch vụ).

Khi propagation được đặt là PROPAGATION_REQUIRED, một phạm vi giao dịch logic sẽ được tạo ra cho mỗi phương thức áp dụng cài đặt này. Mỗi phạm vi giao dịch logic này có thể xác định riêng biệt trạng thái rollback duy nhất, phạm vi giao dịch bên ngoài không phụ thuộc vào phạm vi giao dịch bên trong. Trong trường hợp hành vi PROPAGATION_REQUIRED tiêu chuẩn, tất cả các phạm vi này được ánh xạ vào cùng một giao dịch vật lý. Do đó, chỉ đánh dấu rollback được đặt trong phạm vi giao dịch bên trong thực sự ảnh hưởng đến cơ hội giao dịch bên ngoài thực sự được gửi đi.

Tuy nhiên, trong trường hợp chỉ định rollback được đặt trong phạm vi giao dịch bên trong và phạm vi giao dịch bên ngoài chưa quyết định về việc rollback chính nó, việc rollback (do phạm vi giao dịch bên trong gây ra một cách im lặng) là không mong muốn. Trong trường hợp này, một `UnexpectedRollbackException` tương ứng sẽ được ném ra. Điều này là hành vi mong đợi, vì vậy người gọi giao dịch không bao giờ bị đánh lừa rằng việc thực hiện commit đã xảy ra khi thực tế không có. Vì vậy, nếu một phạm vi giao dịch bên trong (không được biết đến bên ngoài) tắt giao dịch chỉ định rollback, người gọi bên ngoài vẫn gọi commit. Người gọi bên ngoài cần nhận `UnexpectedRollbackException` để chỉ rõ rằng rollback đã xảy ra.

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20220928115243.png)

PROPAGATION_REQUIRES_NEW luôn sử dụng một giao dịch vật lý riêng cho mỗi phạm vi giao dịch ảnh hưởng, không bao giờ tham gia vào giao dịch hiện có của phạm vi bên ngoài. Trong sắp xếp này, giao dịch tài nguyên cơ sở được xem là khác nhau, do đó có thể được gửi riêng lẻ hoặc rollback, giao dịch bên ngoài không bị ảnh hưởng bởi trạng thái rollback của giao dịch bên trong, khóa giao dịch bên trong được giải phóng ngay sau khi hoàn thành. Một giao dịch nội bộ độc lập cũng có thể khai báo cấp độ cô lập, timeout và chỉ đọc riêng của nó, thay vì kế thừa các tính năng của giao dịch bên ngoài.

## Trừu tượng hóa ngoại lệ JDBC

Spring sẽ chuyển đổi các ngoại lệ liên quan đến thao tác dữ liệu thành `DataAccessException`.

Spring nhận biết các mã lỗi như thế nào?

Spring sử dụng `SQLErrorCodeSQLExceptionTranslator` để phân tích mã lỗi.

Định nghĩa ErrorCode (trong tệp sql-error-codes.xml)

## Thực hành tốt nhất về giao dịch trong Spring

### Transactional không hoạt động trong Spring

Một vấn đề dễ bị bỏ qua khi sử dụng chú thích `@Transactional` để bật giao dịch khai báo là giao dịch có thể không hoạt động.

Nguyên tắc hoạt động của `@Transactional`:

#### Phương thức `@Transactional` phải là public

Nguyên tắc thứ nhất: Trừ khi được cấu hình đặc biệt (ví dụ: sử dụng AspectJ để tĩnh hóa AOP), **chỉ có `@Transactional` được định nghĩa trên phương thức `public` mới có thể hoạt động**. Lý do là Spring mặc định sử dụng cách thức tăng cường động để thực hiện AOP, tăng cường các phương thức mục tiêu, và phương thức `private` không thể được tăng cường. Do đó, Spring không thể tăng cường logic xử lý giao dịch động.

【Ví dụ】Lỗi sử dụng `@Transactional` - Trường hợp 1

```java
	@Transactional
	void createUserPrivate(UserEntity entity) {
		userRepository.save(entity);
		if (entity.getName().contains("test")) { throw new RuntimeException("invalid username!"); }
	}

	//Phương thức private
	public int createUserWrong1(String name) {
		try {
			this.createUserPrivate(new UserEntity(name));
		} catch (Exception ex) {
			log.error("create user failed because {}", ex.getMessage());
		}
		return userRepository.findByName(name).size();
	}
```

Khi truyền vào một thực thể người dùng có tên là "test", một ngoại lệ sẽ được ném ra, nhưng `@Transactional` không hoạt động và không gây ra rollback.

#### Phải gọi thông qua Bean được Spring tiêm vào

Nguyên tắc thứ hai: **Phải gọi phương thức mục tiêu thông qua lớp được tạo ra bởi proxy từ bên ngoài để nó có thể hoạt động**.

【Ví dụ】Lỗi sử dụng `@Transactional` - Trường hợp 2

```java
	//Tự gọi
	public int createUserWrong2(String name) {
		try {
			this.createUserPublic(new UserEntity(name));
		} catch (Exception ex) {
			log.error("create user failed because {}", ex.getMessage());
		}
		return userRepository.findByName(name).size();
	}

	//Có thể lan truyền ngoại lệ
	@Transactional
	public void createUserPublic(UserEntity entity) {
		userRepository.save(entity);
		if (entity.getName().contains("test")) { throw new RuntimeException("invalid username!"); }
	}
```

Khi truyền vào một thực thể người dùng có tên là "test", một ngoại lệ sẽ được ném ra, nhưng `@Transactional` không hoạt động và không gây ra rollback.

Giải thích: Spring sử dụng công nghệ AOP để tăng cường bytecode của phương thức, và để gọi phương thức đã được tăng cường, bạn phải gọi từ đối tượng proxy.

### Giao dịch được áp dụng nhưng không được hoàn tác

Việc thực hiện xử lý giao dịch bằng AOP có thể hiểu là sử dụng `try…catch…` để bao bọc các phương thức được đánh dấu bằng chú thích `@Transactional`. Khi phương thức gặp phải ngoại lệ và thỏa mãn **một số điều kiện**, chúng ta có thể đặt lại giao dịch trong khối `catch`, nếu không có ngoại lệ, giao dịch sẽ được gửi đi.

"một số điều kiện" chủ yếu bao gồm hai điểm:

Thứ nhất, chỉ khi ngoại lệ được truyền ra khỏi phương thức được đánh dấu bằng chú thích @Transactional, giao dịch mới được hoàn tác. Trong lớp TransactionAspectSupport của Spring có một phương thức invokeWithinTransaction, nơi xử lý logic giao dịch.

Thứ hai, theo mặc định, **chỉ khi có RuntimeException (ngoại lệ không kiểm tra) hoặc Error xảy ra, Spring mới hoàn tác giao dịch**.

```java
@Service
@Slf4j
public class UserService {

	@Autowired
	private UserRepository userRepository;

	// Ngoại lệ không thể truyền ra khỏi phương thức, dẫn đến không hoàn tác giao dịch
	@Transactional
	public void createUserWrong1(String name) {
		try {
			userRepository.save(new UserEntity(name));
			throw new RuntimeException("error");
		} catch (Exception ex) {
			log.error("create user failed", ex);
		}
	}

	// Ngay cả khi có ngoại lệ kiểm tra, giao dịch cũng không thể hoàn tác
	@Transactional
	public void createUserWrong2(String name) throws IOException {
		userRepository.save(new UserEntity(name));
		otherTask();
	}

	// Vì tệp không tồn tại, sẽ luôn ném ra một IOException
	private void otherTask() throws IOException {
		Files.readAllLines(Paths.get("file-that-not-exist"));
	}

}
```

Trong phương thức createUserWrong1, một RuntimeException sẽ được ném ra, nhưng vì phương thức đã bắt tất cả các ngoại lệ trong khối catch, ngoại lệ không thể truyền ra khỏi phương thức, do đó giao dịch không thể hoàn tác.

Trong phương thức createUserWrong2, trong quá trình đăng ký người dùng, cũng có một hoạt động đọc tệp, nếu hoạt động đọc tệp thất bại, chúng ta muốn hoạt động ghi cơ sở dữ liệu của người dùng bị hoàn tác. Mặc dù không bắt ngoại lệ ở đây, nhưng vì phương thức otherTask ném ra một ngoại lệ kiểm tra, createUserWrong2 truyền ra một ngoại lệ kiểm tra, do đó giao dịch cũng không được hoàn tác.

【Giải pháp 1】Nếu bạn muốn tự bắt ngoại lệ và xử lý, không có vấn đề gì, **bạn có thể thiết lập lại `TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();` để đặt giao dịch hiện tại vào trạng thái hoàn tác**:

```java
@Transactional
public void createUserRight1(String name) {
   try {
      userRepository.save(new UserEntity(name));
      throw new RuntimeException("error");
   } catch (Exception ex) {
      log.error("create user failed", ex);
      TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
   }
}
```

【Giải pháp 2】Trong chú thích, khai báo `@Transactional(rollbackFor = Exception.class)`, mong muốn gặp tất cả các Exception đều hoàn tác giao dịch (để vượt qua giới hạn mặc định không hoàn tác ngoại lệ kiểm tra):

```java
@Transactional(rollbackFor = Exception.class)
public void createUserRight2(String name) throws IOException {
   userRepository.save(new UserEntity(name));
   otherTask();
}
```

### Tinh chỉnh cách truyền giao dịch

Nếu phương thức liên quan đến nhiều hoạt động cơ sở dữ liệu và bạn muốn thực hiện chúng như các giao dịch độc lập để gửi hoặc hoàn tác, thì chúng ta cần xem xét việc tinh chỉnh cách truyền giao dịch bằng cách sử dụng thuộc tính `Propagation` của chú thích `@Transactional`.

```java
/**
 * {@link Propagation#REQUIRES_NEW} đại diện cho việc thực hiện một giao dịch mới và tạm ngừng giao dịch hiện tại khi đến phương thức này
 */
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void createSubUserWithExceptionRight(UserEntity entity) {
   log.info("createSubUserWithExceptionRight start");
   userRepository.save(entity);
   throw new RuntimeException("invalid status");
}
```
