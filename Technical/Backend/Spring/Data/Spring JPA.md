---
title: Spring JPA
tags: [spring, java, db, backend]
categories: [spring, java, db, backend]
date created: 2023-07-28
date modified: 2023-08-11
---

# JPA trong Spring

JPA cung cấp một mô hình lưu trữ dựa trên POJO cho ánh xạ đối tượng-quan hệ.

- Đơn giản hóa việc phát triển mã lưu trữ dữ liệu.
- Ẩn đi sự khác biệt giữa các API lưu trữ khác nhau trong cộng đồng Java.

## Bắt đầu nhanh

(1) Thêm phụ thuộc vào tệp pom.xml

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

(2) Đặt chú thích khởi chạy

```java
// 【Tùy chọn】Chỉ định thư mục Entity để quét, nếu không chỉ định, sẽ quét toàn bộ thư mục
@EntityScan("com.hnv99.springboot.data.jpa")
// 【Tùy chọn】Chỉ định thư mục Repository để quét, nếu không chỉ định, sẽ quét toàn bộ thư mục
@EnableJpaRepositories(basePackages = {"com.hnv99.springboot.data.jpa"})
// 【Tùy chọn】Bật khả năng kiểm tra JPA, có thể tự động gán một số trường như thời gian tạo, thời gian sửa đổi lần cuối, v.v.
@EnableJpaAuditing
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

(3) Cấu hình

```properties
# Kết nối cơ sở dữ liệu
spring.datasource.url = jdbc:mysql://localhost:3306/spring_tutorial?serverTimezone=UTC&useUnicode=true&characterEncoding=utf8
spring.datasource.driver-class-name = com.mysql.cj.jdbc.Driver
spring.datasource.username = root
spring.datasource.password = root
# Có hiển thị SQL log của JPA hay không
spring.jpa.show-sql = true
# Chiến lược DDL của Hibernate
spring.jpa.hibernate.ddl-auto = create-drop
```

(4) Định nghĩa đối tượng Entity

```java
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Objects;
import javax.persistence.*;

@Entity
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(unique = true)
    private String name;

    private Integer age;

    private String address;

    private String email;

    public User(String name, Integer age, String address, String email) {
        this.name = name;
        this.age = age;
        this.address = address;
        this.email = email;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }

        if (!(o instanceof User)) {
            return false;
        }

        User user = (User) o;

        if (id != null && id.equals(user.id)) {
            return true;
        }

        return name.equals(user.name);
    }

}
```

(5) Định nghĩa Repository

```java
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@RepositoryRestResource(collectionResourceRel = "user", path = "user")
public interface UserRepository extends JpaRepository<User, Long> {

    User findUserById(@PathVariable("id") Long id);

    /**
     * Tìm người dùng theo tên người dùng
     * <p>
     * Ví dụ: http://localhost:8080/user/search/findByName?name=lisi
     *
     * @param name Tên người dùng
     * @return {@link User}
     */
    User findUserByName(@Param("name") String name);

    /**
     * Tìm người dùng theo email
     * <p>
     * Ví dụ: http://localhost:8080/user/search/findByEmail?email=xxx@163.com
     *
     * @param email Email
     * @return {@link User}
     */
    @Query("from User u where u.email=:email")
    List<User> findByEmail(@Param("email") String email);

    /**
     * Xóa người dùng theo tên người dùng
     *
     * @param name Tên người dùng
     */
    @Transactional(rollbackFor = Exception.class)
    void deleteByName(@Param("name") String name);

}
```

(6) Kiểm thử

```java
@Slf4j
@SpringBootTest(classes = { DataJpaApplication.class })
public class DataJpaTests {

    @Autowired
    private UserRepository repository;

    @BeforeEach
    public void before() {
        repository.deleteAll();
    }

    @Test
    public void insert() {
        User user = new User("AA", 18, "NY", "user1@163.com");
        repository.save(user);
        Optional<User> optional = repository.findById(user.getId());
        assertThat(optional).isNotNull();
        assertThat(optional.isPresent()).isTrue();
    }

    @Test
    public void batchInsert() {
        List<User> users = new ArrayList<>();
        users.add(new User("AA", 18, "NY", "user1@163.com"));
        users.add(new User("BB", 19, "HN", "user1@163.com"));
        users.add(new User("CC", 18, "HCM", "user1@163.com"));
        users.add(new User("DD", 20, "CF", "user1@163.com"));
        repository.saveAll(users);

        long count = repository.count();
        assertThat(count).isEqualTo(4);

        List<User> list = repository.findAll();
        assertThat(list).isNotEmpty().hasSize(4);
        list.forEach(this::accept);
    }

    private void accept(User user) { log.info(user.toString()); }

    @Test
    public void delete() {
        List<User> users = new ArrayList<>();
        users.add(new User("AA", 18, "NY", "user1@163.com"));
        users.add(new User("BB", 19, "HN", "user1@163.com"));
        users.add(new User("CC", 18, "HCM", "user1@163.com"));
        users.add(new User("DD", 20, "CF", "user1@163.com"));
        repository.saveAll(users);

        repository.deleteByName("AA");
        assertThat(repository.findUserByName("AA")).isNull();

        repository.deleteAll();
        List<User> list = repository.findAll();
        assertThat(list).isEmpty();
    }

    @Test
    public void findAllInPage() {
        List<User> users = new ArrayList<>();
        users.add(new User("AA", 18, "NY", "user1@163.com"));
        users.add(new User("BB", 19, "HN", "user1@163.com"));
        users.add(new User("CC", 18, "HCM", "user1@163.com"));
        users.add(new User("DD", 20, "CF", "user1@163.com"));
        repository.saveAll(users);

        PageRequest pageRequest = PageRequest.of(1, 2);
        Page<User> page = repository.findAll(pageRequest);
        assertThat(page).isNotNull();
        assertThat(page.isEmpty()).isFalse();
        assertThat(page.getTotalElements()).isEqualTo(4);
        assertThat(page.getTotalPages()).isEqualTo(2);

        List<User> list = page.get().collect(Collectors.toList());
        System.out.println("user list: ");
        list.forEach(System.out::println);
    }

    @Test
    public void update() {
        User oldUser = new User("AA", 18, "NY", "user1@163.com");
        oldUser.setName("AAA");
        repository.save(oldUser);

        User newUser = repository.findUserByName("AAA");
        assertThat(newUser).isNotNull();
    }

}
```

## Các chú thích JPA phổ biến

### Entity

#### `@Entity`

#### `@MappedSuperclass`

Khi nhiều entity có các trường thuộc tính chung, ví dụ như id, có thể trích xuất chúng thành một lớp cha và sử dụng `@MappedSuperclass` để đánh dấu lớp cơ sở của entity.

#### `@Table`

Khi tên entity và tên bảng không khớp, bạn có thể sử dụng `@Table(name="CUSTOMERS")` để chỉ định tên bảng một cách rõ ràng.

### Primary Key

#### `@Id`

Chú thích `@Id` được sử dụng để khai báo thuộc tính của entity là khóa chính trong cơ sở dữ liệu.

#### `@GeneratedValue`

`@GeneratedValue` được sử dụng để đánh dấu chiến lược sinh khóa chính, thông qua thuộc tính `strategy`.

Mặc định, JPA tự động chọn chiến lược sinh khóa chính phù hợp nhất với cơ sở dữ liệu cơ sở. Ví dụ, SQL Server tương ứng với identity, MySQL tương ứng với auto increment.

Trong `javax.persistence.GenerationType`, có các chiến lược sau để lựa chọn:

```java
public enum GenerationType {
    TABLE,
    SEQUENCE,
    IDENTITY,
    AUTO
}
```

- `IDENTITY`: Sử dụng cách tăng tự động ID của cơ sở dữ liệu để tạo khóa chính, Oracle không hỗ trợ cách này.
- `AUTO`: JPA tự động chọn chiến lược phù hợp, đây là giá trị mặc định.
- `SEQUENCE`: Sử dụng chuỗi để tạo khóa chính, thông qua chú thích `@SequenceGenerator` để chỉ định tên chuỗi, MySQL không hỗ trợ cách này.
- `TABLE`: Sử dụng bảng để tạo khóa chính, framework sử dụng bảng để mô phỏng chuỗi tạo khóa chính, việc sử dụng chiến lược này giúp ứng dụng dễ dàng di chuyển cơ sở dữ liệu.

#### `@SequenceGenerator`

`@SequenceGenerator` được sử dụng để chỉ định tên chuỗi khi sử dụng chiến lược `SEQUENCE` để sinh khóa chính.

### Mapping

#### `@Column`

Khi tên thuộc tính entity và tên cột trong cơ sở dữ liệu không khớp, bạn có thể sử dụng `@Column` để chỉ định rõ ràng. Nó cũng có thể thiết lập một số thuộc tính.

```java
@Column(length = 10, nullable = false, unique = true)
```

```java
@Column(columnDefinition = "INT(3)")
private int age;
```

Các tham số được hỗ trợ bởi `@Column`:

- `unique`: Xác định xem trường có phải là duy nhất hay không, mặc định là false. Nếu bảng có một trường cần định danh duy nhất, bạn có thể sử dụng cả hai chú thích `@Column` và `@UniqueConstraint`.
- `nullable`: Xác định xem trường có thể chứa giá trị null hay không, mặc định là true.
- `insertable`: Xác định xem trường có cần chèn giá trị của nó khi sử dụng câu lệnh INSERT hay không.
- `updatable`: Xác định xem trường có cần cập nhật giá trị của nó khi sử dụng câu lệnh UPDATE hay không. `insertable` và `updatable` thường được sử dụng cho các trường chỉ đọc, ví dụ như khóa chính và khóa ngoại. Những trường này thường được tự động tạo ra.
- `columnDefinition`: Xác định câu lệnh SQL tạo trường khi tạo bảng. Thường được sử dụng khi tạo định nghĩa bảng từ Entity.
- `table`: Xác định tên bảng chứa trường khi có nhiều bảng được ánh xạ. Giá trị mặc định là tên bảng chính của entity.
- `length`: Xác định độ dài của trường, chỉ có hiệu lực khi kiểu trường là `varchar`. Giá trị mặc định là 255 ký tự.
- `precision` và `scale`: Xác định độ chính xác của trường, chỉ có hiệu lực khi kiểu trường là `double`. `precision` đại diện cho tổng số chữ số của giá trị, `scale` đại diện cho số chữ số sau dấu thập phân.

#### `@JoinTable`

#### `@JoinColumn`

### Quan hệ

Ánh xạ bảng (mối quan hệ hai chiều)

- `@OneToOne`: Mối quan hệ một một
- `@OneToMany`: Mối quan hệ một nhiều
- `@ManyToMany` (không khuyến nghị, thay vào đó sử dụng đối tượng trung gian, chia mối quan hệ nhiều nhiều thành hai mối quan hệ một nhiều)

Ánh xạ trường (mối quan hệ một chiều):

- `@Embedded`, `@Embeddable`: Mối quan hệ nhúng (một chiều)
- `@ElementCollection`: Mối quan hệ một nhiều với tập hợp (một chiều)

#### `@OneToOne`

`@OneToOne` đại diện cho mối quan hệ một một.

#### `@OneToMany`

`@OneToMany` đại diện cho mối quan hệ một nhiều.

#### `@ManyToOne`

`@ManyToOne` đại diện cho mối quan hệ nhiều một.

#### `@ManyToMany`

`@ManyToMany` đại diện cho mối quan hệ nhiều nhiều.

#### `@OrderBy`

## Truy vấn

Có các phương thức sau để truy vấn:

- Truy vấn theo tên phương thức
    
- Truy vấn bằng chú thích `@Query`
    
- Truy vấn SQL động
    
- Truy vấn bằng Example

`JpaRepository` cung cấp các truy vấn tích hợp sẵn như sau:

- `List<T> findAll();` - Trả về tất cả các entity
- `List<T> findAllById(Iterable<ID> var1);` - Trả về tất cả các entity với id đã chỉ định
- `T getOne(ID var1);` - Trả về entity với id đã chỉ định, nếu không tìm thấy, trả về null.
- `List<T> findAll(Sort var1);` - Trả về tất cả các entity, sắp xếp theo thứ tự chỉ định.
- `Page<T> findAll(Pageable var1);` - Trả về danh sách entity, phân trang theo `Pageable`.

### Phương thức truy vấn bằng tên

Spring Data sử dụng tên phương thức và tên tham số để tự động tạo câu truy vấn JPQL.

```java
public interface UserRepository extends JpaRepository<User, Integer> {
    public User findByName(String name);
}
```

Tên phương thức và tên tham số phải tuân theo một số quy tắc nhất định để Spring Data JPA có thể tự động chuyển đổi thành JPQL:

- Tên phương thức thường chứa nhiều thuộc tính thực thể để truy vấn, các thuộc tính có thể được kết nối bằng `AND` và `OR`, cũng hỗ trợ `Between`, `LessThan`, `GreaterThan`, `Like`;
- Tên phương thức có thể bắt đầu bằng `findBy`, `getBy`, `queryBy`;
- Kết quả truy vấn có thể được sắp xếp, tên phương thức chứa OrderBy+thuộc tính+ASC (DESC);
- Có thể giới hạn kết quả truy vấn bằng `Top`, `First`;
- Một số tham số đặc biệt có thể xuất hiện trong danh sách tham số, như `Pageable`, `Sort`

Ví dụ:

```java
// Truy vấn theo tên, và sắp xếp theo tên tăng dần
List<Person> findByLastnameOrderByFirstnameAsc(String name);

// Truy vấn theo tên và sử dụng phân trang
Page<User> findByLastname(String lastname, Pageable pageable);

// Truy vấn 10 người dùng đầu tiên thỏa mãn điều kiện
List<User> findFirst10ByLastname(String lastname, Sort sort);

// Sử dụng And để kết hợp truy vấn
List<Person> findByFirstnameAndLastname(String firstname, String lastname);

// Sử dụng Or để truy vấn
List<Person> findDistinctPeopleByLastnameOrFirstname(String lastname, String firstname);

// Sử dụng like để truy vấn, name phải chứa % hoặc ?
public User findByNameLike(String name);
```

| Từ khóa             | Ví dụ                                                      | Đoạn JPQL tương ứng                                             |
| ------------------- | --------------------------------------------------------- | ------------------------------------------------------------------ |
| `And`               | `findByLastnameAndFirstname`                              | `… where x.lastname = ?1 and x.firstname = ?2`                     |
| `Or`                | `findByLastnameOrFirstname`                               | `… where x.lastname = ?1 or x.firstname = ?2`                      |
| `Is,Equals`         | `findByFirstname,findByFirstnameIs,findByFirstnameEquals` | `… where x.firstname = 1?`                                         |
| `Between`           | `findByStartDateBetween`                                  | `… where x.startDate between 1? and ?2`                            |
| `LessThan`          | `findByAgeLessThan`                                       | `… where x.age < ?1`                                               |
| `LessThanEqual`     | `findByAgeLessThanEqual`                                  | `… where x.age <= ?1`                                              |
| `GreaterThan`       | `findByAgeGreaterThan`                                    | `… where x.age > ?1`                                               |
| `GreaterThanEqual`  | `findByAgeGreaterThanEqual`                               | `… where x.age >= ?1`                                              |
| `After`             | `findByStartDateAfter`                                    | `… where x.startDate > ?1`                                         |
| `Before`            | `findByStartDateBefore`                                   | `… where x.startDate < ?1`                                         |
| `IsNull`            | `findByAgeIsNull`                                         | `… where x.age is null`                                            |
| `IsNotNull,NotNull` | `findByAge(Is)NotNull`                                    | `… where x.age not null`                                           |
| `Like`              | `findByFirstnameLike`                                     | `… where x.firstname like ?1`                                      |
| `NotLike`           | `findByFirstnameNotLike`                                  | `… where x.firstname not like ?1`                                  |
| `StartingWith`      | `findByFirstnameStartingWith`                             | `… where x.firstname like ?1` (tham số được bao bọc bởi `%` ở cuối)  |
| `EndingWith`        | `findByFirstnameEndingWith`                               | `… where x.firstname like ?1` (tham số được bao bọc bởi `%` ở đầu) |
| `Containing`        | `findByFirstnameContaining`                               | `… where x.firstname like ?1` (tham số được bao bọc bởi `%` ở cả hai đầu)     |
| `OrderBy`           | `findByAgeOrderByLastnameDesc`                            | `… where x.age = ?1 order by x.lastname desc`                      |
| `Not`               | `findByLastnameNot`                                       | `… where x.lastname <> ?1`                                         |
| `In`                | `findByAgeIn(Collection<Age> ages)`                       | `… where x.age in ?1`                                              |
| `NotIn`             | `findByAgeNotIn(Collection<Age> age)`                     | `… where x.age not in ?1`                                          |
| `True`              | `findByActiveTrue()`                                      | `… where x.active = true`                                          |
| `False`             | `findByActiveFalse()`                                     | `… where x.active = false`                                         |
| `IgnoreCase`        | `findByFirstnameIgnoreCase`                               | `… where UPPER(x.firstame) = UPPER(?1)`                            |

### Phương thức truy vấn theo Example

Spring Data JPA cho phép tạo một đối tượng Example dựa trên thực thể để xây dựng câu truy vấn JPQL. Tuy nhiên, phương thức này không linh hoạt và chỉ hỗ trợ các điều kiện AND, không thể sử dụng OR, các điều kiện lớn hơn, nhỏ hơn, hoặc between.

Kế thừa `JpaRepository`

```java
<S extends T> List<S> findAll(Example<S> var1);
<S extends T> List<S> findAll(Example<S> var1, Sort var2);
```

```java
public List<User> getByExample(String name) {
    Department dept = new Department();
    dept.setId(1);

    User user = new User();
    user.setName(name);
    user.setDepartment(dept);
    Example<User> example = Example.of(user);
    List<User> list = userDao.findAll(example);
    return list;
}
```

Trong đoạn mã trên, đầu tiên tạo một đối tượng User và thiết lập các điều kiện truy vấn, trong đó tên là tham số name và id của phòng ban là 1. Sau đó, sử dụng `Example.of` để xây dựng câu truy vấn dựa trên đối tượng này.

Trong hầu hết các trường hợp, truy vấn không phải là truy vấn khớp hoàn toàn, ExampleMatcher cung cấp các điều kiện chỉ định. Ví dụ, để lấy tất cả các người dùng bắt đầu bằng xxx, bạn có thể sử dụng mã sau:

```java
ExampleMatcher matcher = ExampleMatcher.matching().withMatcher("xxx",
    GenericPropertyMatchers.startsWith().ignoreCase());
Example<User> example = Example.of(user, matcher);
```

### Sắp xếp (Sort)

Đối tượng Sort được sử dụng để chỉ định thứ tự sắp xếp, cách đơn giản nhất để tạo đối tượng Sort là truyền vào một danh sách tên thuộc tính (không phải tên cột trong cơ sở dữ liệu, mà là tên thuộc tính). Mặc định sẽ sắp xếp theo thứ tự tăng dần.

```java
Sort sort = new Sort("id");
//Sort sort = new Sort(Direction.DESC, "id");
return userDao.findAll(sort);
```

Hibernate sẽ xây dựng điều kiện sắp xếp dựa trên đối tượng Sort, Sort("id") đại diện cho sắp xếp theo id theo thứ tự tăng dần.

Các phương thức khởi tạo Sort khác bao gồm:

- `public Sort(String… properties)`: Sắp xếp theo danh sách thuộc tính chỉ định theo thứ tự tăng dần.
- `public Sort(Sort.Direction direction, String… properties)`: Sắp xếp theo danh sách thuộc tính chỉ định theo thứ tự được chỉ định bởi direction, direction là một enum có `Direction.ASC` và `Direction.DESC`.
- `public Sort(Sort.Order… orders)`: Có thể tạo bằng cách sử dụng các phương thức tĩnh của Order:
  - `public static Sort.Order asc(String property)`
  - `public static Sort.Order desc(String property)`

### Phân trang (Page và Pageable)

Giao diện Pageable được sử dụng để xây dựng truy vấn phân trang, PageRequest là một lớp triển khai của nó, có thể tạo PageRequest bằng cách sử dụng các phương thức tạo của nó:

Lưu ý rằng tôi đang sử dụng spring boot 2.0.2, phiên bản jpa là 2.0.8, cách thao tác với phiên bản mới khác với phiên bản trước đó.

- `public static PageRequest of(int page, int size)`
- `public static PageRequest of(int page, int size, Sort sort)`: Cũng có thể thêm sắp xếp vào PageRequest
- `public static PageRequest of(int page, int size, Direction direction, String… properties)`: Hoặc tùy chỉnh quy tắc sắp xếp

Trang bắt đầu từ 0, đại diện cho trang truy vấn, size đại diện cho số hàng mong muốn trên mỗi trang.

Spring Data luôn trả về đối tượng Page cho truy vấn phân trang, đối tượng Page cung cấp các phương thức phổ biến sau:

- `int getTotalPages()`: Tổng số trang
- `long getTotalElements()`: Trả về tổng số phần tử
- `List<T> getContent()`: Trả về tập kết quả truy vấn lần này

## Core API

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230811152211.png)
