---
title: CF Transaction Notes
tags:
  - codeforum
  - project
categories: 
date created: 2024-04-17
date modified: 2024-04-17
---

# Lưu ý khi sử dụng giao dịch

Về cách sử dụng anntation `@Transactional`, chỉ biết cách sử dụng đúng có thể không đủ, cần biết cả các tình huống mà nó không hoạt động để tránh gặp vấn đề. Bài viết này sẽ kết hợp với một ví dụ đơn giản, chủ yếu để giới thiệu một số trường hợp làm cho giao dịch không hoạt động.

## Cấu hình

Trong trường hợp của bài viết này, chúng ta sẽ sử dụng giao dịch khai báo, trước tiên chúng ta sẽ tạo một dự án Spring Boot, phiên bản `2.2.1.RELEASE`, sử dụng MySQL làm cơ sở dữ liệu mục tiêu, và lựa chọn InnoDB làm engine lưu trữ, cùng với cấp độ cô lập giao dịch là RR (Reapeatable Read).

### 1. Cấu hình dự án

Trong tệp `pom.xml` của dự án, thêm `spring-boot-starter-jdbc`, sẽ tiêm vào một bean `DataSourceTransactionManager`, cung cấp hỗ trợ giao dịch.

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
```

### 2. Cấu hình cơ sở dữ liệu

Mở tệp cấu hình Spring `application.properties`, và đặt thông tin liên quan đến cơ sở dữ liệu như sau:

```properties
## Dữ liệu nguồn
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/story?useUnicode=true&characterEncoding=UTF-8&useSSL=false
spring.datasource.username=root
spring.datasource.password=
```

### 3. Cơ sở dữ liệu

Tạo một cấu trúc bảng đơn giản để kiểm thử:

```sql
CREATE TABLE `money` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT '' COMMENT 'Tên người dùng',
  `money` int(26) NOT NULL DEFAULT '0' COMMENT 'Tiền',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời gian cập nhật',
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=551 DEFAULT CHARSET=utf8mb4;
```

## Trường hợp không hoạt động

### 1. Cơ sở dữ liệu

Điều kiện tiên quyết để giao dịch có hiệu lực là nguồn dữ liệu của bạn phải hỗ trợ giao dịch, ví dụ, MyISAM engine của MySQL không hỗ trợ giao dịch, trong khi InnoDB hỗ trợ giao dịch.

Các trường hợp dưới đây đều dựa trên mysql + Innodb engine.

Để chuẩn bị dữ liệu cho các trường hợp demo tiếp theo, chúng ta sẽ chuẩn bị một số dữ liệu như sau:

```java
@Service
public class NotEffectDemo {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void init() {
        String sql = "replace into money (id, name, money) values" + " (520, 'Khởi tạo', 200)," + "(530, 'Khởi tạo', 200)," +
                "(540, 'Khởi tạo', 200)," + "(550, 'Khởi tạo', 200)";
        jdbcTemplate.execute(sql);
    }
}
```

### 2. Truy cập bên trong lớp

Đơn giản để hiểu, đây chỉ là việc không truy cập trực tiếp vào phương thức B được đánh dấu bằng annotation `@Transactional`, mà thay vào đó là thông qua phương thức A thông thường của lớp, sau đó phương thức A truy cập vào B.

Dưới đây là một trường hợp đơn giản:

```java
/**
 * Không gọi trực tiếp, không hoạt động
 *
 * @param id
 * @return
 * @throws Exception
 */
@Transactional(rollbackFor = Exception.class)
public boolean testCompileException2(int id) throws Exception {
    if (this.updateName(id)) {
        this.query("sau khi cập nhật tên", id);
        if (this.update(id)) {
            return true;
        }
    }

    throw new Exception("Tham số không hợp lệ");
}

public boolean testCall(int id) throws Exception {
    return testCompileException2(id);
}
```

Trong đoạn mã trên, phương thức `testCompileException` được gọi trực tiếp, giao dịch hoạt động bình thường; nếu thông qua phương thức `testCall` để truy cập gián tiếp, thì giao dịch sẽ không hoạt động.

Bên dưới là một trường hợp kiểm tra:

```java
@Component
public class NotEffectSample {
    @Autowired
    private NotEffectDemo notEffectDemo;
    
    public void testNotEffect() {
        testCall(530, (id) -> notEffectDemo.testCall(530));
    }
    
    private void testCall(int id, CallFunc<Integer, Boolean> func) {
        System.out.println("============ Trường hợp không hoạt động của giao dịch bắt đầu ========== ");
        notEffectDemo.query("trước giao dịch", id);
        try {
            // Giao dịch có thể hoạt động bình thường
            func.apply(id);
        } catch (Exception e) {
        }
        notEffectDemo.query("sau giao dịch", id);
        System.out.println("============ Trường hợp không hoạt động của giao dịch kết thúc ========== \n");
    }

    @FunctionalInterface
    public interface CallFunc<T, R> {
        R apply(T t) throws Exception;
    }
}
```

Kết quả đầu ra như sau:

```
============ Trường hợp không hoạt động của giao dịch bắt đầu ========== 
trước giao dịch >>>> {id=530, name=Khởi tạo, money=200, is_deleted=false, create_at=2020-02-03 13:44:11.0, update_at=2020-02-03 13:44:11.0}
sau khi cập nhật tên >>>> {id=530, name=Update, money=200, is_deleted=false, create_at=2020-02-03 13:44:11.0, update_at=2020-02-03 13:44:11.0}
sau giao dịch >>>> {id=530, name=Update, money=210, is_deleted=false, create_at=2020-02-03 13:44:11.0, update_at=2020-02-03 13:44:11.0}
============ Trường hợp không hoạt động của giao dịch kết thúc ========== 
```

Từ đầu ra trên, chúng ta có thể thấy rằng giao dịch không được rollback, chủ yếu là do không truy cập qua cách thức proxy.

**Đối với tình huống này, giải pháp phổ biến nhất là:**

```java
// Truy cập thông qua cách thức proxy

public boolean testCall(int id) throws Exception {
    return SpringUtil.getBean(this.getClass()).testCompileException2(id);
}
```

### 3. Phương thức private

Đặt annotation `@Transactional` trên phương thức private cũng không hoạt động, vì các phương thức riêng tư không thể truy cập từ bên ngoài, chỉ có thể truy cập từ bên trong. Vì vậy, các trường hợp không hoạt động như trên cũng đương nhiên là không hoạt động ở đây.

```java
/**
 * Annotation trên phương thức private không hoạt động
 *
 * @param id
 * @return
 * @throws Exception
 */
@Transactional
private boolean testSpecialException(int id) throws Exception {
    if (this.updateName(id)) {
        this.query("sau khi cập nhật tên", id);
        if (this.update(id)) {
            return true;
        }
    }

    throw new Exception("Tham số không hợp lệ");
}
```

Trong thực tế, việc sử dụng trực tiếp trong tình huống như trên không thường xuyên xảy ra, vì IDE sẽ cảnh báo!

### 4. Không khớp ngoại lệ

Annotation `@Transactional` mặc định xử lý ngoại lệ Runtime, nghĩa là chỉ khi ném ra ngoại lệ chạy thời gian thì giao dịch mới được kích hoạt rollback, nếu không sẽ không.

```java
/**
 * Ngoại lệ không phải là ngoại lệ chạy thời gian, và không được chỉ định bằng rollbackFor, không hoạt động
 *
 * @param id
 * @return
 * @throws Exception
 */
@Transactional
public boolean testCompleException(int id) throws Exception {
    if (this.updateName(id)) {
        this.query("sau khi cập nhật tên", id);
        if (this.update(id)) {
            return true;
        }
    }

    throw new Exception("Tham số không hợp lệ");
}
```

Trường hợp kiểm tra như sau:

```java
public void testNotEffect() {
    testCall(520, (id) -> notEffectDemo.testCompleException(520));
}
```

Kết quả đầu ra như sau, giao dịch không rollback (nếu muốn giải quyết vấn đề này, chỉ cần thiết lập thuộc tính rollbackFor của `@Transactional`):

```
============ Trường hợp không hoạt động của giao dịch bắt đầu ========== 
trước giao dịch >>>> {id=520, name=Khởi tạo, money=200, is_deleted=false, create_at=2020-02-03 13:44:11.0, update_at=2020-02-03 13:44:11.0}
sau khi cập nhật tên >>>> {id=520, name=Update, money=200, is_deleted=false, create_at=2020-02-03 13:44:11.0, update_at=2020-02-03 13:44:11.0}
sau giao dịch >>>> {id=520, name=Update, money=210, is_deleted=false, create_at=2020-02-03 13:44:11.0, update_at=2020-02-03 13:44:11.0}
============ Trường hợp không hoạt động của giao dịch kết thúc ========== 
```

### 5. Đa luồng

Tình huống này có thể không phổ biến, khi trong phương thức được đánh dấu giao dịch, một luồng con được bắt đầu để thực hiện các hoạt động cơ sở dữ liệu, lúc này giao dịch cũng không hoạt động.

Dưới đây là hai tình huống khác nhau: một là luồng con ném ra ngoại lệ, luồng chính ok; hai là luồng con ok, luồng chính ném ra ngoại lệ.

#### a. Trường hợp 1

```java
/**
 * Luồng con ném ra ngoại lệ, luồng chính không thể bắt, dẫn đến giao dịch không hoạt động
 *
 * @param id
 * @return
 */
@Transactional(rollbackFor = Exception.class)
public boolean testMultThread(int id) throws InterruptedException {
    new Thread(new Runnable() {
        @Override
        public void run() {
            updateName(id);
            query("sau khi cập nhật tên", id);
        }
    }).start();

    new Thread(new Runnable() {
        @Override
        public void run() {
            boolean ans = update(id);
            query("sau khi cập nhật id", id);
            if (!ans) {
                throw new RuntimeException("Không thể cập nhật ans");
            }
        }
    }).start();

    Thread.sleep(1000);
    System.out.println("------- Luồng con --------");

    return true;
}
```

Trong tình huống trên, rất dễ hiểu tại sao không hoạt động, ngoại lệ của luồng con không được nắm bắt bởi luồng bên ngoài, cuộc gọi phương thức `testMultThread` không ném ra ngoại lệ, do đó không kích hoạt rollback giao dịch.

```java
public void testNotEffect() {
    testCall(540, (id) -> notEffectDemo.testMultThread(540));
}
```

Kết quả đầu ra như sau:

```
============ Trường hợp không hoạt động của giao dịch bắt đầu ========== 
trước giao dịch >>>> {id=540, name=Khởi tạo, money=200, is_deleted=false, create_at=2020-02-03 13:44:11.0, update_at=2020-02-03 13:44:11.0}
sau khi cập nhật tên >>>> {id=540, name=Update, money=200, is_deleted=false, create_at=2020-02-03 13:44:11.0, update_at=2020-02-03 13:44:11.0}
Exception in thread "Thread-3" java.lang.RuntimeException: Không thể cập nhật ans
	at com.git.hui.boot.jdbc.demo.NotEffectDemo$2.run(NotEffectDemo.java:112)
	at java.lang.Thread.run(Thread.java:748)
sau khi cập nhật id >>>> {id=540, name=Update, money=210, is_deleted=false, create_at=2020-02-03 13:44:11.0, update_at=2020-02-03 13:44:11.0}
------- Luồng con --------
sau giao dịch >>>> {id=540, name=Update, money=210, is_deleted=false, create_at=2020-02-03 13:44:11.0, update_at=2020-02-03 13:44:11.0}
============ Trường hợp không hoạt động của giao dịch kết thúc ========== 
```

#### b. Trường hợp 2

```java
/**
 * Luồng con ném ra ngoại lệ, luồng chính không thể bắt, dẫn đến giao dịch không hoạt động
 *
 * @param id
 * @return
 */
@Transactional(rollbackFor = Exception.class)
public boolean testMultThread2(int id) throws InterruptedException {
    new Thread(new Runnable() {
        @Override
        public void run() {
            updateName(id);
            query("sau khi cập nhật tên", id);
        }
    }).start();

    new Thread(new Runnable() {
        @Override
        public void run() {
            boolean ans = update(id);
            query("sau khi cập nhật id", id);
        }
    }).start();

    Thread.sleep(1000);
    System.out.println("------- Luồng con --------");

    update(id);
    query("sau khi cập nhật id ở bên ngoài", id);

    throw new RuntimeException("Không thể cập nhật ans");
}
```

Dường như không có vấn đề gì với đoạn mã trên, vứt ra một luồng, rollback giao dịch, nhưng không may là các thay đổi từ hai luồng con không nằm trong cùng một giao dịch và sẽ không được rollback.

```java
public void testNotEffect() {
    testCall(550, (id) -> notEffectDemo.testMultThread2(550));
}
```

Từ kết quả đầu ra dưới đây, chúng ta cũng có thể thấy rằng các thay đổi từ các luồng con không nằm trong cùng một giao dịch và không bị rollback.

```
============ Trường hợp không hoạt động của giao dịch bắt đầu ========== 
trước giao dịch >>>> {id=550, name=Khởi tạo, money=200, is_deleted=false, create_at=2020-02-03 13:52:38.0, update_at=2020-02-03 13:52:38.0}
sau khi cập nhật tên >>>> {id=550, name=Update, money=200, is_deleted=false, create_at=2020-02-03 13:52:38.0, update_at=2020-02-03 13:52:40.0}
sau khi cập nhật id >>>> {id=550, name=Update, money=210, is_deleted=false, create_at=2020-02-03 13:52:38.0, update_at=2020-02-03 13:52:40.0}
------- Luồng con --------
sau khi cập nhật id ở bên ngoài >>>> {id=550, name=Update, money=220, is_deleted=false, create_at=2020-02-03 13:52:38.0, update_at=2020-02-03 13:52:41.0}
Exception in thread "Thread-3" java.lang.RuntimeException: Không thể cập nhật ans
	at com.git.hui.boot.jdbc.demo.NotEffectDemo$2.run(NotEffectDemo.java:122)
	at java.lang.Thread.run(Thread.java:748)
============ Trường hợp không hoạt động của giao dịch kết thúc ========== 
```

### 6. Thuộc tính truyền tải

Trong bài viết trước về các thuộc tính truyền tải, đã giới thiệu một số trong số chúng không thực hiện giao dịch, vì vậy cũng cần chú ý đặc biệt vào đó. Chi tiết có thể tham khảo bài viết [200202-SpringBoot系列教程之事务传递属性](http://spring.hhui.top/spring-blog/2020/02/02/200202-SpringBoot%E7%B3%BB%E5%88%97%E6%95%99%E7%A8%8B%E4%B9%8B%E4%BA%8B%E5%8A%A1%E4%BC%A0%E9%80%92%E5%B1%9E%E6%80%A7/)

### 7. Lớp không được quản lý bởi Spring

Đó là khi sử dụng các lớp của chúng ta mà không được quản lý bởi Spring, như sau:

```java
public class DemoService {
    /**
     * Chú thích trên phương thức riêng tư không hoạt động
     *
     * @param id
     * @return
     * @throws Exception
     */
    @Transactional
    public boolean testSpecialException(int id) throws Exception {
        if (this.updateName(id)) {
            this.query("sau khi cập nhật tên", id);
            if (this.update(id)) {
                return true;
            }
        }
    
        throw new Exception("Tham số không hợp lệ");
    }
}

@Service
public class DemoService2 {
	DemoService demoService = new DemoService();
    public void test() {
    	demoService.testSpecialException(1);
    }
}
```

Vì DemoService ở trên không được quản lý bởi Spring, nên không tạo ra lớp proxy tương ứng, do đó giao dịch sẽ không hoạt động.
