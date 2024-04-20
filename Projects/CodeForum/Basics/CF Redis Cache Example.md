---
title: CF Redis Cache Example
tags:
  - project
  - codeforum
categories: 
date created: 2024-04-16
date modified: 2024-04-17
---

# Ví dụ về kĩ thuật Redis Cache

Các ứng dụng internet thường thích tìm kiếm tính đồng thời cao và tính sẵn có cao, vì vậy, vai trò của cache có thể nói là rất quan trọng, giúp cải thiện hiệu suất chương trình một cách đáng kể.

So với local cache như Guava Cache và Caffeine, Redis mạnh mẽ hơn nhiều, chủ yếu thể hiện ở các khía cạnh sau:

- Redis hỗ trợ cụm và triển khai phân tán, có thể mở rộng dung lượng và khả năng tải cho bộ nhớ cache theo chiều ngang, phù hợp cho nhu cầu cache của các hệ thống phân tán lớn.
- Redis hỗ trợ lưu trữ dữ liệu liên tục, có thể lưu trữ dữ liệu cache vào ổ đĩa, đảm bảo dữ liệu không bị mất, ngay cả khi hệ thống bị sập hoặc khởi động lại cũng không gây mất dữ liệu.
- Redis hỗ trợ nhiều cấu trúc dữ liệu, như chuỗi, bảng băm, danh sách, tập hợp và tập hợp có thứ tự, có thể đáp ứng nhu cầu cache khác nhau, cung cấp khả năng cache linh hoạt hơn.
- Redis hỗ trợ đồng bộ chủ từ và cơ chế báo sự canh, có thể thực hiện tính sẵn có cao và khả năng chịu lỗi, cung cấp dịch vụ cache ổn định hơn.
- Redis cung cấp các lệnh xử lý dữ liệu phong phú, như sắp xếp, tổng hợp, đường ống và kịch bản Lua, có thể xử lý dữ liệu cache một cách thuận tiện và hiệu quả hơn.

## Giới thiệu Redis

Redis chính là một cơ sở dữ liệu NoSQL mã nguồn mở, dựa trên bộ nhớ, tuy nhiên không nên gọi nó là cơ sở dữ liệu mà hơn là một middleware, bởi vì với kích thước nhỏ và hiệu suất cao, Redis thích hợp hơn để sử dụng làm thành phần lớp cache trước cơ sở dữ liệu.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240416212408.png)

Redis hỗ trợ nhiều loại cấu trúc dữ liệu, ví dụ như chuỗi String, danh sách List, tập hợp Set, bảng băm Hash, tập hợp có thứ tự ZSet, và nhiều loại khác.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240416213232.png)

Redis hỗ trợ lưu trữ dữ liệu, có thể lưu trữ dữ liệu từ bộ nhớ vào đĩa thông qua snapshot và log, sau đó có thể tải lại vào bộ nhớ khi Redis khởi động lại. Ngoài ra, các tính năng cao cấp như sao chép master-slave, sentinel, và nhiều hơn nữa đã giúp Redis trở thành middleware cache phổ biến nhất.

Tôi thực sự coi trọng của Redis thậm chí coi Redis là một trong bốn món hàng quan trọng của phát triển backend Java, ba món hàng khác là cơ bản Java, Spring Boot và MySQL.

## Tích hợp Redis

**Bước 1: Thêm dependency của Redis vào pom.xml**.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

Mặc định, Spring Boot sử dụng Lettuce làm Redis connection pool, giúp tránh việc tạo và hủy kết nối thường xuyên, nâng cao hiệu suất và độ tin cậy của ứng dụng. Dưới đây là các dependency được bao gồm trong starter:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240416213700.png)

**Bước 2: Thêm cấu hình Redis vào application.yml**, cấu hình đơn giản cho môi trường local là chỉ định host và port. Cấu hình cho môi trường sản xuất có thể tham khảo từ bài hướng dẫn trước.

```yml
redis:
  host: localhost
  port: 6379
  password:

```

**Bước 3: Khởi động dịch vụ Redis local**

Bạn có thể dùng docker hoặc local redis trong máy.

Ví dụ: `redis-cli ping` dùng để kiểm tra xem dịch vụ Redis đã được cài đặt và chạy đúng cách hay không, `redis-server` dùng để khởi động dịch vụ Redis, bạn có thể thấy cổng mặc định là 6379.

**Bước 4: Viết lớp kiểm thử Redis**, kiểm tra nhanh chóng xem Redis có hoạt động trong dự án không.

```java
@SpringBootTest(classes = QuickForumApplication.class)
public class RedisTemplateDemo {
    @Autowired
    private RedisTemplate<Object, Object> redisTemplate;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Test
    public void testPut() {
        // Thiết lập key và value, và lưu vào Redis
        redisTemplate.opsForValue().set("hnv99", "HungNguyen");
        stringRedisTemplate.opsForList().rightPush("lang", "c++");
        stringRedisTemplate.opsForList().rightPush("lang", "python");
        stringRedisTemplate.opsForList().rightPush("lang", "java");
    }

    @Test
    public void testGet() {
        // Lấy giá trị tương ứng với key từ Redis
        Object value = redisTemplate.opsForValue().get("hnv99");
        System.out.println(value);

        List<String> girls = stringRedisTemplate.opsForList().range("lang", 0, -1);
        System.out.println(girls);
    }
}

```

Giải thích đoạn code trên:

① `@SpringBootTest(classes = QuickForumApplication.class)` chú thích đã chỉ định lớp khởi động của dự án là QuickForumApplication, cho biết lớp này là một bài kiểm tra đơn vị của Spring Boot. `@Autowired` chú thích được sử dụng để inject RedisTemplate và StringRedisTemplate vào lớp kiểm thử.

RedisTemplate và StringRedisTemplate là các connection factory Redis được Spring Boot tự động khởi tạo sẵn, cho phép thao tác nhanh chóng với Redis. RedisTemplate là một lớp generic, có thể thao tác với bất kỳ kiểu dữ liệu nào, trong khi StringRedisTemplate chỉ có thể thao tác với kiểu dữ liệu chuỗi.

② Trong phương thức `testPut()`, sử dụng các phương thức `redisTemplate.opsForValue()` và `stringRedisTemplate.opsForList()` để thực hiện các thao tác với dữ liệu kiểu chuỗi và danh sách trong Redis.

③ Trong phương thức `testGet()`, sử dụng các phương thức `redisTemplate.opsForValue().get("hnv99")` và `stringRedisTemplate.opsForList().range("lang", 0, -1)` để lấy dữ liệu kiểu chuỗi và danh sách từ Redis.

Chạy phương thức testPut trước, sau đó chạy phương thức testGet, kết quả sẽ như sau:

```
HungNguyen
[c++, python, java]
```

## Vận hành Redis

Dưới đây là các ví dụ cụ thể về cách sử dụng RedisTemplate và StringRedisTemplate trong Spring Boot để thao tác với các kiểu dữ liệu trong Redis như chuỗi, danh sách, hash, tập hợp và tập hợp có thứ tự. Điều này giúp cho những người mới tiếp xúc với Redis có thể hiểu rõ hơn về cách thức hoạt động của Redis (những người đã có kinh nghiệm có thể bỏ qua phần này).

### String

String là một trong những kiểu dữ liệu cơ bản nhất trong Redis, có thể lưu trữ bất kỳ loại dữ liệu nào. Trong ví dụ dưới đây, chúng ta inject RedisTemplate và sử dụng phương thức `opsForValue()` để lấy đối tượng thao tác với chuỗi Redis, sau đó sử dụng phương thức `set()` để đặt cặp khóa-giá trị, và sử dụng phương thức `get()` để lấy giá trị tương ứng với khóa.

```java
@Autowired
private RedisTemplate<String, Object> redisTemplate;

public void set(String key, Object value) {
    redisTemplate.opsForValue().set(key, value);
}

public Object get(String key) {
    return redisTemplate.opsForValue().get(key);
}

```

### List

List là một danh sách chuỗi có thứ tự, có thể lưu trữ nhiều chuỗi. Trong ví dụ dưới đây, chúng ta inject StringRedisTemplate và sử dụng phương thức `opsForList()` để lấy đối tượng thao tác với danh sách Redis, sau đó sử dụng phương thức `rightPush()` để thêm phần tử vào cuối danh sách, và sử dụng phương thức `range()` để lấy các phần tử trong danh sách từ chỉ số bắt đầu đến chỉ số kết thúc.

```java
@Autowired
private StringRedisTemplate stringRedisTemplate;

public void push(String key, String value) {
    stringRedisTemplate.opsForList().rightPush(key, value);
}

public List<String> range(String key, int start, int end) {
    return stringRedisTemplate.opsForList().range(key, start, end);
}

```

### Hash

Hash là một cấu trúc dữ liệu key-value, có thể lưu trữ nhiều trường và giá trị tương ứng. Trong ví dụ dưới đây, chúng ta sử dụng phương thức `opsForHash()` để lấy đối tượng thao tác với băm Redis, sau đó sử dụng phương thức `put()` để thêm trường và giá trị tương ứng vào băm, và sử dụng phương thức `get()` để lấy giá trị của trường cụ thể.

```java
@Autowired
private RedisTemplate<String, Object> redisTemplate;

public void hset(String key, String field, Object value) {
    redisTemplate.opsForHash().put(key, field, value);
}

public Object hget(String key, String field) {
    return redisTemplate.opsForHash().get(key, field);
}

```

### Set

Set là một tập hợp không thứ tự các chuỗi, có thể lưu trữ nhiều chuỗi. Trong ví dụ dưới đây, chúng ta inject StringRedisTemplate và sử dụng phương thức `opsForSet()` để lấy đối tượng thao tác với tập hợp Redis, sau đó sử dụng phương thức `add()` để thêm phần tử vào tập hợp, và sử dụng phương thức `members()` để lấy tất cả các phần tử trong tập hợp.

```java
@Autowired
private StringRedisTemplate stringRedisTemplate;

public void sadd(String key, String value) {
    stringRedisTemplate.opsForSet().add(key, value);
}

public Set<String> smembers(String key) {
    return stringRedisTemplate.opsForSet().members(key);
}

```

### Sorted Set

Sorted Set là một tập hợp có thứ tự của các chuỗi, mỗi chuỗi được gán một điểm số và có thể sắp xếp theo điểm số. Trong ví dụ dưới đây, chúng ta sử dụng phương thức `opsForZSet()` để lấy đối tượng thao tác với tập hợp có thứ tự Redis, sau đó sử dụng phương thức `add()` để thêm phần tử và điểm số tương ứng vào tập hợp, và sử dụng phương thức `range()` để lấy các phần tử trong tập hợp từ chỉ số bắt đầu đến chỉ số kết thúc.

```java
@Autowired
private RedisTemplate<String, Object> redisTemplate;

public void zadd(String key, String value, double score) {
    redisTemplate.opsForZSet().add(key, value, score);
}

public Set<Object> zrange(String key, long start, long end) {
    return redisTemplate.opsForZSet().range(key, start, end);
}
```

## Ví dụ về Redis trong dự án

Hiện tại, trong dự án có tổng cộng hai nơi sử dụng bộ nhớ cache Redis. Một nơi sẽ sử dụng Redis để lưu trữ thông tin phiên của người dùng, và nơi khác sẽ sử dụng Redis để lưu trữ sitemap (một tập tin XML được sử dụng để mô tả cấu trúc và nội dung của trang web đối với các công cụ tìm kiếm, bao gồm các trang trong trang web, nội dung văn bản, hình ảnh, video và thông tin khác, giúp các công cụ tìm kiếm có thể index trang web một cách hiệu quả hơn, đơn giản hơn là, giúp các công cụ tìm kiếm tìm kiếm nội dung của trang web dự án một cách tốt hơn).

Trước đó, trong các hướng dẫn đã đề cập đến lớp RedisClient, lớp này là sự đóng gói dựa trên RedisTemplate, được sử dụng để giảm bớt chi phí sử dụng. Tôi sẽ kết hợp với các hoạt động cụ thể và mã nguồn để giúp mọi người hiểu rõ hơn. Hãy cùng phân tích chi tiết lớp này.

### Tiêm vào RedisTemplate

Mở mã nguồn của RedisClient, bạn sẽ thấy đoạn code sau:

```java
private static RedisTemplate<String, String> template;

public static void register(RedisTemplate<String, String> template) {
    RedisClient.template = template;
}

```

1. Một biến tĩnh kiểu RedisTemplate với các tham số là String, String.
2. Một phương thức tĩnh register, nó sẽ được gọi trong lớp ForumCoreAutoConfig:

```java
@Configuration
@ComponentScan(basePackages = "com.hnv99.forum.core")
public class ForumCoreAutoConfig {

    public ForumCoreAutoConfig(RedisTemplate<String, String> redisTemplate) {
        RedisClient.register(redisTemplate);
    }
}

```

Trong đoạn code này, chúng ta định nghĩa một lớp cấu hình Spring ForumCoreAutoConfig, trong đó có một phương thức khởi tạo có tham số `RedisTemplate<String, String> redisTemplate`.

Trong phương thức khởi tạo, chúng ta gọi `RedisClient.register(redisTemplate)` để đăng ký redisTemplate vào RedisClient.

Cần chú ý rằng, chúng ta không định nghĩa Bean RedisTemplate trong lớp cấu hình này, mà sử dụng cơ chế tự động cấu hình của Spring Boot. Spring Boot sẽ tự động tạo ra và cấu hình một thể hiện RedisTemplate dựa trên cấu hình của chúng ta, và sau đó tiêm nó vào phương thức khởi tạo của lớp này. Trong lớp này, chúng ta có thể sử dụng RedisTemplate được tiêm vào mà không cần quan tâm đến cách nó được tạo ra và cấu hình.

Nếu bạn đặt một điểm đánh dấu gỡ lỗi trong phương thức khởi tạo của ForumCoreAutoConfig và chạy debug, bạn sẽ thấy một dòng log như sau:

> o.s.b.f.s.DefaultListableBeanFactory.createArgumentArray(ConstructorResolver.java:808) - Autowiring by type from bean name 'com.jnv99.forum.core.ForumCoreAutoConfig' via constructor to bean named 'stringRedisTemplate'

Dòng log này cho biết khi Spring container tự động cấu hình bean ForumCoreAutoConfig, nó sẽ cố gắng tự động tiêm vào tham số của phương thức khởi tạo `RedisTemplate<String, String> redisTemplate`.

Về trạng thái tự động của Spring Boot, tôi sẽ viết một tài liệu riêng để giải thích chi tiết hơn, **tạm thời tạo ra một chỗ trống ở đây**.

### Sử dụng RedisClient

Như đã đề cập trước đó, hiện tại dự án có hai nơi sử dụng bộ nhớ cache Redis: phiên người dùng và sitemap.

#### Trước tiên, hãy xem phiên người dùng.

1. Sau khi xác minh mã xác thực thành công, phương thức setStrWithExpire của RedisClient sẽ được gọi:

```java
    /**
     * Cache writing with expiration time
     *
     * @param key
     * @param value
     * @param expire in seconds
     * @return
     */
    public static Boolean setStrWithExpire(String key, String value, Long expire) {
        return template.execute(new RedisCallback<Boolean>() {
            @Override
            public Boolean doInRedis(RedisConnection redisConnection) throws DataAccessException {
                return redisConnection.setEx(keyBytes(key), expire, valBytes(value));
            }
        });
    }
```

Phương thức này được sử dụng để liên kết một giá trị kiểu chuỗi với key đã cho và thiết lập thời gian hết hạn. Trong phương thức này, chúng ta sử dụng phương thức execute của RedisTemplate để thực hiện lệnh Redis. RedisCallback là một giao diện gọi lại, chúng ta cần triển khai phương thức doInRedis, trong đó chúng ta viết lệnh Redis. Trong phương thức này, chúng ta gọi phương thức setEx của RedisConnection để lưu trữ cặp key-value trong Redis và thiết lập thời gian hết hạn. Cuối cùng, chúng ta trả về giá trị của phương thức setEx làm giá trị trả về của phương thức, đại diện cho việc lưu trữ SET có thành công hay không.

Cần lưu ý rằng, keyBytes và valBytes là các phương thức được sử dụng để chuyển đổi kiểu chuỗi của key và value thành mảng byte.

```java
    /**
     * Generate cache keys for codeforum
     *
     * @param key
     * @return
     */
    public static byte[] keyBytes(String key) {
        nullCheck(key);
        key = KEY_PREFIX + key;
        return key.getBytes(CODE);
    }

    /**
     * Serialization of cache values for codeforum
     *
     * @param val
     * @param <T>
     * @return
     */
    public static <T> byte[] valBytes(T val) {

        if (val instanceof String) {
            return ((String) val).getBytes(CODE);
        } else {
            return JsonUtil.toStr(val).getBytes(CODE);
        }
    }
```

Quá trình nghiệp vụ tương ứng trong dự án là sau khi đăng nhập mã xác thực, phiên sẽ được lưu trữ.

2. Khi người dùng đăng xuất, phương thức del của RedisClient sẽ được gọi để xóa phiên.

```java
public static void del(String key) {
    template.execute((RedisCallback<Long>) con -> con.del(keyBytes(key)));
}
```

3. Khi người dùng đăng nhập, phương thức getStr của RedisClient sẽ được gọi để lấy ID người dùng dựa trên phiên.

```java
public static String getStr(String key) {
    return template.execute((RedisCallback<String>) con -> {
        byte[] val = con.get(keyBytes(key));
        return val == null ? null : new String(val);
    });
}

```

#### Tiếp theo, xem xét phần sitemap.

1. Khi lấy sitemap, phương thức hGetAll của RedisClient sẽ được gọi

```java
    public static <T> Map<String, T> hGetAll(String key, Class<T> clz) {
        Map<byte[], byte[]> records = template.execute((RedisCallback<Map<byte[], byte[]>>) con -> con.hGetAll(keyBytes(key)));
        if (records == null) {
            return Collections.emptyMap();
        }

        Map<String, T> result = Maps.newHashMapWithExpectedSize(records.size());
        for (Map.Entry<byte[], byte[]> entry : records.entrySet()) {
            if (entry.getKey() == null) {
                continue;
            }

            result.put(new String(entry.getKey()), toObj(entry.getValue(), clz));
        }
        return result;
    }
```

Trong phương thức này, chúng ta sử dụng phương thức execute của RedisTemplate để thực thi lệnh Redis. chúng ta sử dụng interface RedisCallback làm hàm gọi lại, thông qua biểu thức Lambda để thực hiện phương thức doInRedis trong đó. Trong phương thức doInRedis, chúng ta gọi phương thức hGetAll của RedisConnection để lấy tất cả các trường và giá trị trong bảng băm. Phương thức hGetAll trả về một đối tượng `Map<byte[], byte[]>`, trong đó cả key và value đều là kiểu mảng byte.

Trong phương thức này, chúng ta đầu tiên kiểm tra xem records có phải là null hay không, nếu là null, chúng ta trả về một đối tượng Map trống không thể thay đổi. Nếu records không phải là null, chúng ta duyệt qua tất cả các trường và giá trị trong đó và chuyển chúng thành chuỗi và đối tượng kiểu đã chỉ định. Trong quá trình chuyển đổi, chúng ta sử dụng phương thức toObj, phương thức này được sử dụng để chuyển đổi giá trị kiểu mảng byte thành đối tượng kiểu đã chỉ định. Cuối cùng, chúng ta lưu trữ tất cả các trường và giá trị vào một đối tượng Map mới và trả về nó.

2. Khi thêm bài viết, phương thức hSet của RedisClient sẽ được gọi:

```java
/**
 * Sets the value of a specified field in a specified hash table and returns the result of the set operation.
 * @param key The key name of the hash table
 * @param field The field name of the hash table
 * @param ans The value of the hash table field
 * @param <T> The type of the value of the hash table field
 * @return The result of the set operation. Returns true if the set operation is successful, otherwise returns false.
 */
public static <T> Boolean hSet(String key, String field, T ans) {
    return template.execute(new RedisCallback<Boolean>() {
        @Override
        public Boolean doInRedis(RedisConnection redisConnection) throws DataAccessException {
            String save;
            // Check if ans is of type String
            if (ans instanceof String) {
                // If it's a String, assign it to save
                save = (String) ans;
            } else {
                // If it's not a String, convert it to a JSON-formatted string
                save = JsonUtil.toStr(ans);
            }
            // Call the hSet method of the RedisConnection instance to set the value of the specified hash table field, and return the result of the set operation
            return redisConnection.hSet(keyBytes(key), valBytes(field), valBytes(save));
        }
    });
}

```

Trong phương thức này, chúng ta sử dụng phương thức execute của RedisTemplate để thực thi lệnh Redis. chúng ta sử dụng giao diện RedisCallback làm hàm gọi lại và thực hiện phương thức doInRedis bên trong nó thông qua lớp nội danh. Trong phương thức doInRedis, chúng ta đầu tiên chuyển đổi ans thành chuỗi save, sau đó gọi phương thức hSet của RedisConnection để thiết lập giá trị của trường bảng băm chỉ định. Phương thức hSet trả về một giá trị kiểu Boolean, biểu thị cho việc thiết lập có thành công hay không.

Lưu ý rằng trong phương thức này, chúng ta sử dụng toán tử instanceof để kiểm tra xem ans có phải là kiểu String không. Nếu là kiểu String, chúng ta chuyển nó trực tiếp thành chuỗi save, ngược lại chúng ta chuyển nó thành chuỗi định dạng JSON.

3. Khi xoá bài viết, phương thức hDel của RedisClient sẽ được gọi:

```java
/**
 * Deletes a specified field from a specified hash table and returns the result of the delete operation.
 * @param key The key name of the hash table
 * @param field The field name of the hash table
 * @return The result of the delete operation. Returns true if the delete operation is successful, otherwise returns false.
 */
public static <T> Boolean hDel(String key, String field) {
    return template.execute(new RedisCallback<Boolean>() {
        @Override
        public Boolean doInRedis(RedisConnection connection) throws DataAccessException {
            // Call the hDel method of the RedisConnection instance to delete the specified field from the specified hash table, and return the result of the delete operation
            return connection.hDel(keyBytes(key), valBytes(field)) > 0;
        }
    });
}

```

4. Khi khởi tạo sitemap, trước tiên sẽ gọi phương thức del của RedisClient, điều này đã được đề cập ở trên, ở đây tôi sẽ bỏ qua, sau đó sẽ gọi phương thức hMSet của RedisClient.

```java
/**
 * Sets multiple fields to multiple values in a hash stored at the specified key.
 * @param key The key of the hash table.
 * @param fields The fields and their corresponding values to be set in the hash table.
 * @param <T> The type of values in the hash table fields.
 */
public static <T> void hMSet(String key, Map<String, T> fields) {
    // Create an empty hash table 'val'
    Map<byte[], byte[]> val = Maps.newHashMapWithExpectedSize(fields.size());
    // Convert the input fields and their values to byte array types and add them to 'val'
    for (Map.Entry<String, T> entry : fields.entrySet()) {
        val.put(valBytes(entry.getKey()), valBytes(entry.getValue()));
    }
    // Use the execute method of RedisTemplate to execute Redis commands
    template.execute((RedisCallback<Object>) connection -> {
        // Call the hMSet method of the RedisConnection instance to set multiple fields in the hash table at once
        connection.hMSet(keyBytes(key), val);
        return null;
    });
}

```

Trong phương thức doInRedis, chúng ta thiết lập giá trị của nhiều trường bảng băm cùng một lúc bằng cách gọi phương thức hMSet của RedisConnection.

Lưu ý rằng trong phương thức này, chúng ta sử dụng phương thức `Maps.newHashMapWithExpectedSize` để tạo một bảng băm rỗng val, sau đó chúng ta chuyển đổi các trường và giá trị tương ứng thành mảng byte và thêm chúng vào val. Cuối cùng, chúng ta sử dụng phương thức hMSet của RedisConnection để thiết lập giá trị của nhiều trường bảng băm cùng một lúc.

Nếu bạn muốn công cụ tìm kiếm nhanh chóng index nội dung trang web, sitemap sẽ rất hữu ích, Google là nơi gửi sitemap.

Để tăng cường việc index của công nghệ thông tin trên các công cụ tìm kiếm, chúng ta đã phát triển một công cụ tự động tạo sitemap. Bạn có thể xem nó trong `SitemapServiceImpl`.

```java
/**
 * Uses a timer solution to refresh the site map every day at 5:15 AM to ensure data consistency.
 */
@Scheduled(cron = "0 15 5 * * ?")
public void autoRefreshCache() {
    log.info("Starting to refresh the URL addresses of sitemap.xml to avoid data inconsistency issues!");
    refreshSitemap();
    log.info("Refresh completed!");
}
```

## Tổng kết

Redis là một hệ thống lưu trữ dữ liệu trong bộ nhớ cache cao cấp, hỗ trợ nhiều cấu trúc dữ liệu bao gồm chuỗi, danh sách, bảng băm, tập hợp và tập hợp có thứ tự. Trong Spring Boot, chúng ta có thể sử dụng Redis làm cache để cải thiện hiệu suất và tốc độ phản hồi của ứng dụng.

Spring Boot cung cấp `spring-boot-starter-data-redis`, giúp tích hợp Redis vào ứng dụng trở nên dễ dàng. Chỉ cần thêm starter này vào tệp `pom.xml`, sau đó thêm thông tin kết nối Redis vào tệp cấu hình là có thể sử dụng được.

Chúng ta có thể sử dụng `RedisTemplate` để thực thi các lệnh Redis. Lớp này cung cấp nhiều phương thức như opsForValue, opsForList, opsForHash, execute, vv., để thực hiện các loại lệnh Redis khác nhau.

Trong dự án, chúng ta sử dụng Redis để cache session và sitemap, sử dụng hai cấu trúc dữ liệu của Redis là chuỗi và bảng băm. Các tính năng cao cấp khác của Redis như các cấu trúc dữ liệu khác và các chức năng như publish/subscribe, transaction, Lua script, vv., sẽ được giới thiệu trong mã nguồn và hướng dẫn tiếp theo, hãy chờ đợi nhé!
