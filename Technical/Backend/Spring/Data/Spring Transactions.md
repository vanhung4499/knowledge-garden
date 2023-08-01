---
title: Spring Transactions
tags: [spring, java, db, backend]
categories: [spring, java, db, backend]
date created: 2023-07-28
date modified: 2023-07-28
---

# Spring và giao dịch

Spring cung cấp một mô hình lập trình nhất quán cho các API giao dịch như Java Transaction API (JTA), JDBC, Hibernate và Java Persistence API (JPA). Spring cung cấp tính năng giao dịch khai báo, cho phép cấu hình giao dịch một cách dễ dàng. Kết hợp với tính năng tự động cấu hình của Spring Boot, hầu hết các dự án Spring Boot chỉ cần đánh dấu phương thức với chú thích `@Transactional` để kích hoạt cấu hình giao dịch cho phương thức đó.

## Hiểu về giao dịch

Trong lĩnh vực phát triển phần mềm, giao dịch là một tập hợp các hoạt động hoặc thao tác mà hoàn toàn hoặc không hoàn toàn được thực hiện. Giao dịch cho phép bạn kết hợp một số hoạt động thành một đơn vị công việc mà hoặc là tất cả xảy ra hoặc không xảy ra. Truyền thống, trong phát triển Java EE, bạn có hai lựa chọn để quản lý giao dịch: giao dịch toàn cầu hoặc giao dịch cục bộ, cả hai đều có những hạn chế lớn.

### Đặc điểm của giao dịch

Giao dịch nên có 4 thuộc tính: nguyên tử, nhất quán, cô lập và bền vững. Bốn thuộc tính này thường được gọi là ACID.

- **Nguyên tử (Atomic)**: Một giao dịch là một đơn vị công việc không thể chia tách, các hoạt động trong giao dịch phải được thực hiện hoặc không được thực hiện.
- **Nhất quán (Consistent)**: Giao dịch phải đưa cơ sở dữ liệu từ một trạng thái nhất quán sang một trạng thái nhất quán khác. Nhất quán và nguyên tử có mối quan hệ chặt chẽ.
- **Cô lập (Isolated)**: Một giao dịch đang thực thi không được can thiệp bởi các giao dịch khác. Các hoạt động và dữ liệu trong một giao dịch phải được cô lập và không bị ảnh hưởng bởi các giao dịch song song khác.
- **Bền vững (Durable)**: Bền vững còn được gọi là vĩnh cửu (permanence), chỉ rằng một giao dịch đã được xác nhận thì sự thay đổi dữ liệu trong cơ sở dữ liệu phải là vĩnh viễn. Các hoạt động hoặc sự cố tiếp theo không được ảnh hưởng đến nó.

### Giao dịch toàn cầu

Giao dịch toàn cầu cho phép bạn sử dụng nhiều nguồn tài nguyên giao dịch, thường là cơ sở dữ liệu quan hệ và hàng đợi tin nhắn. Máy chủ ứng dụng quản lý giao dịch toàn cầu thông qua JTA, một API phức tạp (một phần vì mô hình ngoại lệ của nó). Ngoài ra, UserTransaction của JTA thường cần được lấy từ JNDI, điều này có nghĩa là bạn cũng cần sử dụng JNDI để sử dụng JTA. Sử dụng giao dịch toàn cầu hạn chế bất kỳ khả năng tái sử dụng mã ứng dụng nào, vì JTA thường chỉ có sẵn trong môi trường máy chủ ứng dụng.

Trước đây, cách ưu tiên để sử dụng giao dịch toàn cầu là thông qua EJB CMT (Container-Managed Transactions). CMT là một quản lý giao dịch dựa trên khai báo (khác với quản lý giao dịch theo chương trình). EJB CMT loại bỏ nhu cầu tìm kiếm JNDI liên quan đến giao dịch, mặc dù việc sử dụng EJB cũng đòi hỏi sử dụng JNDI. Nó loại bỏ phần lớn (nhưng không phải tất cả) việc viết mã Java để điều khiển giao dịch. Nhược điểm rõ ràng của nó là CMT liên quan đến JTA và môi trường máy chủ ứng dụng. Ngoài ra, nó chỉ có sẵn khi bạn chọn triển khai logic kinh doanh trong EJB (hoặc ít nhất là sau một cái nhìn EJB có tính giao dịch). Nói chung, tác động tiêu cực của EJB là quá lớn đến nỗi đề xuất này không hấp dẫn, đặc biệt là khi có những giải pháp thay thế quyền lực cho quản lý giao dịch dựa trên khai báo.

### Giao dịch cục bộ

Giao dịch cục bộ là giao dịch được chỉ định cho một nguồn tài nguyên cụ thể, chẳng hạn như giao dịch quản lý kết nối JDBC. Giao dịch cục bộ có thể dễ dàng sử dụng hơn, nhưng có một nhược điểm rõ ràng: chúng không thể làm việc qua nhiều nguồn tài nguyên giao dịch. Ví dụ, mã quản lý giao dịch sử dụng kết nối JDBC không thể chạy trong một giao dịch JTA toàn cầu. Vì máy chủ ứng dụng không tham gia quản lý giao dịch, nó không thể đảm bảo tính chính xác qua nhiều nguồn tài nguyên (đáng lưu ý là hầu hết các ứng dụng chỉ sử dụng một nguồn tài nguyên giao dịch). Một nhược điểm khác là giao dịch cục bộ có sự xâm nhập vào mô hình lập trình.

### Hỗ trợ giao dịch của Spring

Spring trừu tượng hóa việc triển khai giao dịch thực tế khỏi mã giao dịch. Spring giải quyết nhược điểm của giao dịch toàn cầu và giao dịch cục bộ. Nó cho phép nhà phát triển sử dụng cùng một mô hình lập trình nhất quán trong bất kỳ môi trường nào. Bạn chỉ cần viết mã một lần và nó có thể tận dụng các chiến lược quản lý giao dịch khác nhau từ các môi trường khác nhau. Spring cung cấp hỗ trợ cho quản lý giao dịch dựa trên mã và khai báo, tuy nhiên, trong hầu hết các trường hợp, khuyến nghị sử dụng quản lý giao dịch dựa trên khai báo.

- Quản lý giao dịch dựa trên mã cho phép người dùng xác định rõ ranh giới giao dịch trong mã.
- Quản lý giao dịch dựa trên khai báo (dựa trên AOP) giúp người dùng tách biệt hoạt động khỏi quy tắc giao dịch.

Với quản lý giao dịch dựa trên mã, người phát triển có thể sử dụng trừu tượng giao dịch của Spring, nó có thể chạy trên bất kỳ cơ sở giao dịch nào dưới nó. Sử dụng mô hình khai báo ưu tiên, người phát triển thường chỉ viết ít hoặc không viết mã liên quan đến quản lý giao dịch, do đó không phụ thuộc vào API giao dịch của Spring hoặc bất kỳ API giao dịch nào khác.

### Lợi ích của giao dịch Spring

Spring Framework cung cấp một trừu tượng giao dịch nhất quán, với những lợi ích sau:

- Cùng một mô hình lập trình nhất quán qua các API giao dịch khác nhau, chẳng hạn như Java Transaction API (JTA), JDBC, Hibernate và Java Persistence API (JPA).
- Hỗ trợ quản lý giao dịch dựa trên khai báo.
- API quản lý giao dịch cho việc lập trình đơn giản hơn so với các API giao dịch phức tạp như JTA.
- Tích hợp hoàn hảo với trừu tượng truy cập dữ liệu của Spring.

## Các API cốt lõi

### TransactionManager

Khái niệm quan trọng trong trừu tượng giao dịch của Spring là TransactionManager. TransactionManager được định nghĩa bởi hai giao diện: `PlatformTransactionManager` cho quản lý giao dịch theo cách truyền thống và `ReactiveTransactionManager` cho quản lý giao dịch phản ứng.

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

`PlatformTransactionManager` là một giao diện SPI, cho phép người dùng sử dụng nó theo cách lập trình. Vì `PlatformTransactionManager` là một giao diện, nó có thể dễ dàng được MOCK hoặc đặt chỗ theo nhu cầu. Nó không phụ thuộc vào các chiến lược tìm kiếm như JNDI. Định nghĩa của `PlatformTransactionManager` giống như bất kỳ đối tượng (hoặc bean) nào khác trong Spring IoC container. Điều này làm cho việc quản lý giao dịch trong Spring trở thành một trừu tượng có giá trị, ngay cả khi bạn sử dụng JTA. So với việc trực tiếp sử dụng JTA, bạn có thể dễ dàng kiểm thử mã giao dịch.

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

`JpaTransactionManager` chỉ cần một `EntityManagerFactory` (có thể là bất kỳ cài đặt nào của giao diện `javax.persistence.EntityManagerFactory`). `JpaTransactionManager` sẽ làm việc cùng với `EntityManager` được tạo ra từ `EntityManagerFactory` để xây dựng giao dịch.

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

`ReactiveTransactionManager` cũng là một giao diện SPI, cho phép người dùng sử dụng nó theo cách lập trình. Vì `ReactiveTransactionManager` là một giao diện, nó cũng có thể dễ dàng được MOCK hoặc đặt chỗ theo nhu cầu.

### TransactionDefinition

`PlatformTransactionManager` sử dụng phương thức `getTransaction(TransactionDefinition definition)` để lấy giao dịch, trong đó tham số là một đối tượng `TransactionDefinition`. `TransactionDefinition` định nghĩa các thuộc tính cơ bản của giao dịch. Các thuộc tính này có thể được hiểu là cấu hình cơ bản của giao dịch, mô tả cách áp dụng chiến lược giao dịch cho các phương thức.

Giao diện `TransactionDefinition` có nội dung như sau:

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
