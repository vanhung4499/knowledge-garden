---
title: Spring JPA
tags: [spring, java, db, backend]
categories: [spring, java, db, backend]
date created: 2023-07-28
date modified: 2024-02-22
---

# JPA trong Spring

JPA cung cấp một mô hình lưu trữ dựa trên POJO cho ánh xạ Entity-Relation.

- Đơn giản hóa việc phát triển mã giao tiếp với cơ sở dữ liệu.
- Che giấu sự khác biệt giữa các API cơ sở dữ liệu khác nhau cho cộng đồng Java

## Bắt đầu nhanh

(1) Thêm phụ thuộc vào tệp pom.xml

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

(2) Đặt annotation khởi chạy

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
# Có in ra nhật ký SQL JPA hay không
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
     * Ví dụ: http://localhost:8080/user/search/findByName?name=hung
     *
     * @param name Tên người dùng
     * @return {@link User}
     */
    User findUserByName(@Param("name") String name);

    /**
     * Tìm người dùng theo email
     * <p>
     * Ví dụ: http://localhost:8080/user/search/findByEmail?email=abc@gmail.com
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

(6) Test

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
        User user = new User("AA", 18, "NY", "user1@gmail.com");
        repository.save(user);
        Optional<User> optional = repository.findById(user.getId());
        assertThat(optional).isNotNull();
        assertThat(optional.isPresent()).isTrue();
    }

    @Test
    public void batchInsert() {
        List<User> users = new ArrayList<>();
        users.add(new User("AA", 18, "NY", "user1@gmail.com"));
        users.add(new User("BB", 19, "HN", "user1@gmail.com"));
        users.add(new User("CC", 18, "HCM", "user1@gmail.com"));
        users.add(new User("DD", 20, "CF", "user1@gmail.com"));
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
        users.add(new User("AA", 18, "NY", "user1@gmail.com"));
        users.add(new User("BB", 19, "HN", "user1@gmail.com"));
        users.add(new User("CC", 18, "HCM", "user1@gmail.com"));
        users.add(new User("DD", 20, "CF", "user1@gmail.com"));
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
        users.add(new User("AA", 18, "NY", "user1@gmail.com"));
        users.add(new User("BB", 19, "HN", "user1@gmail.com"));
        users.add(new User("CC", 18, "HCM", "user1@gmail.com"));
        users.add(new User("DD", 20, "CF", "user1@gmail.com"));
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
        User oldUser = new User("AA", 18, "NY", "user1@gmail.com");
        oldUser.setName("AAA");
        repository.save(oldUser);

        User newUser = repository.findUserByName("AAA");
        assertThat(newUser).isNotNull();
    }

}
```

## Các annotation JPA phổ biến

### Entity

#### `@Entity`

#### `@MappedSuperclass`

Khi nhiều entity có các trường thuộc tính chung, ví dụ như id, có thể trích xuất chúng thành một lớp cha và sử dụng `@MappedSuperclass` để đánh dấu lớp cơ sở của entity.

#### `@Table`

Khi tên entity và tên bảng không khớp, bạn có thể sử dụng `@Table(name="CUSTOMERS")` để chỉ định tên bảng một cách rõ ràng.

### Primary Key

#### `@Id`

annotation `@Id` được sử dụng để khai báo thuộc tính của entity là khóa chính trong cơ sở dữ liệu.

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
- `SEQUENCE`: Sử dụng chuỗi để tạo khóa chính, thông qua annotation `@SequenceGenerator` để chỉ định tên chuỗi, MySQL không hỗ trợ cách này.
- `TABLE`: Sử dụng bảng để tạo khóa chính, framework sử dụng bảng để mô phỏng chuỗi tạo khóa chính, việc sử dụng chiến lược này giúp ứng dụng dễ dàng di chuyển cơ sở dữ liệu.

#### `@SequenceGenerator`

`@SequenceGenerator` được sử dụng để chỉ định tên chuỗi khi sử dụng chiến lược `SEQUENCE` để sinh khóa chính.

### Thực thể

#### `@Column`

Khi thuộc tính entity của bạn không giống với tên trường trong cơ sở dữ liệu, bạn có thể sử dụng `@Column` để chỉ định rõ ràng, nó cũng có thể đặt một số thuộc tính

```java
@Column(length = 10, nullable = false, unique = true)
```

```java
@Column(columnDefinition = "INT(3)")
private int age;
```

Các tham số mà `@Column` hỗ trợ:

- Thuộc tính `unique` biểu thị trường này có phải là định danh duy nhất hay không, mặc định là false. Nếu có một trường trong bảng cần định danh duy nhất, thì bạn có thể sử dụng thẻ này hoặc `@UniqueConstraint` trong thẻ `@Table`.
- Thuộc tính `nullable` biểu thị trường này có thể có giá trị `null`hay không, mặc định là true.
- Thuộc tính `insertable` biểu thị khi sử dụng `INSERT` để chèn dữ liệu, có cần chèn giá trị của trường này hay không.
- Thuộc tính `updatable` biểu thị khi sử dụng `UPDATE` để cập nhật dữ liệu, có cần cập nhật giá trị của trường này hay không. `insertable`và `updatable` thường được sử dụng cho các thuộc tính chỉ đọc, như khóa chính và khóa ngoại, v.v. Giá trị của các trường này thường được tạo tự động.
- Thuộc tính `columnDefinition` biểu thị câu lệnh SQL tạo trường khi tạo bảng, thường được sử dụng khi tạo định nghĩa bảng thông qua Entity.
- Thuộc tính `table` biểu thị khi ánh xạ nhiều bảng, chỉ định trường trong bảng. Giá trị mặc định là tên của bảng chính.
- Thuộc tính `length` biểu thị độ dài của trường, khi loại trường là `varchar`, thuộc tính này mới có hiệu lực, mặc định là 255 ký tự.
- Thuộc tính `precision` và thuộc tính `scale` biểu thị độ chính xác, khi loại trường là `double`, `precision` biểu thị độ dài tổng cộng của giá trị, `scale` biểu thị số chữ số chiếm dụng bởi dấu phẩy.

#### `@JoinTable`

#### `@JoinColumn`

### Mối quan hệ

Ánh xạ mối quan hệ giữa các bảng (ánh xạ hai chiều)

- `@OneToOne`: Mối quan hệ một một (1-1)
- `@OneToMany`: Mối quan hệ một nhiều (1-n)
- `@ManyToMany`: Mối quan hệ nhiều nhiều (n-n) (không khuyến nghị, thay vào đó sử dụng đối tượng trung gian, chia mối quan hệ nhiều nhiều thành hai mối quan hệ một nhiều)

Ánh xạ trường (ánh xạ một chiều):

- `@Embedded`, `@Embeddable`: Mối quan hệ nhúng (ánh xạ một chiều)
- `@ElementCollection`: Mối quan hệ một-nhiều với tập hợp (ánh xạ một chiều)

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

Có các cách truy vấn sau:

- Truy vấn theo tên phương thức
    
- Truy vấn bằng cách sử dụng annotation `@Query`
    
- Truy vấn bằng cách sử dụng SQL động
    
- Truy vấn theo phong cách Example

`JpaRepository` cung cấp các truy vấn tích hợp sẵn như sau:

- `List<T> findAll();` - Trả về tất cả các entity
- `List<T> findAllById(Iterable<ID> var1);` - Trả về tất cả các entity với id đã chỉ định
- `T getOne(ID var1);` - Trả về entity với id đã chỉ định, nếu không tìm thấy, trả về null.
- `List<T> findAll(Sort var1);` - Trả về tất cả các entity, sắp xếp theo thứ tự chỉ định.
- `Page<T> findAll(Pageable var1);` - Trả về danh sách entity, phân trang theo `Pageable`.

### Truy vấn bằng tên phương thức

Spring Data tự động xây dựng một truy vấn JPA QQL dựa trên tên phương thức và tên tham số.

```java
public interface UserRepository extends JpaRepository<User, Integer> {
    public User findByName(String name);
}
```

Tên phương thức và tên tham số cần tuân theo một số quy tắc nhất định để Spring Data JPA có thể tự động chuyển đổi thành JPQL:

- Tên phương thức thường bao gồm nhiều thuộc tính thực thể để truy vấn, các thuộc tính có thể được kết nối với nhau bằng `AND` và `OR`, cũng hỗ trợ `Between`, `LessThan`, `GreaterThan`, `Like`;
    
- Tên phương thức có thể bắt đầu bằng `findBy`, `getBy`, `queryBy`;
    
- Kết quả truy vấn có thể được sắp xếp, tên phương thức bao gồm OrderBy+ thuộc tính +ASC (DESC);
    
- Có thể sử dụng `Top`, `First` để giới hạn tập kết quả truy vấn;
    
- Một số tham số đặc biệt có thể xuất hiện trong danh sách tham số, như `Pageeable`, `Sort`.

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

### Truy vấn bằng annotation @Query

Annotation `@Query` cho phép sử dụng JPQL trên các phương thức.

Các thao tác được thực hiện đối với tên đối tượng và tên thuộc tính đối tượng, chứ không phải tên bảng và tên trường trong cơ sở dữ liệu.

```java
@Query("select u from User u where u.name=?1 and u.department.id=?2")
public User findUser(String name, Integer departmentId);
```

```java
@Query("from User u where u.name=?1 and u.department.id=?2")
public User findUser(String name, Integer departmentId);
```

Nếu bạn muốn sử dụng SQL thay vì JPSQL, bạn có thể sử dụng thuộc tính `nativeQuery`, đặt giá trị là true.

```java
@Query(value="select * from user where name=?1 and department_id=?2", nativeQuery=true)
public User nativeQuery(String name, Integer departmentId);
```

Dù là JPQL hay SQL, cả hai đều hỗ trợ "tham số đặt tên":

```java
@Query(value="select * from user where name=:name and department_id=:departmentId", nativeQuery=true)
public User nativeQuery2(String name, Integer departmentId);
```

Nếu kết quả truy vấn SQL hoặc JPQL không phải là Entity, bạn có thể sử dụng mảng `Object[]` để thay thế, ví dụ như thống kê số lượng người dùng theo từng phần

```java
@Query(value="select department_id,count(*) from user group by department_id", nativeQuery=true)
public List<Object[]> queryUserCount();
```

Truy vấn này sẽ trả về một mảng, loại đối tượng phụ thuộc vào kết quả truy vấn, trong ví dụ này, trả về loại `String` và `BigInteger`.

Khi truy vấn, bạn có thể sử dụng `Pageable` và `Sort` để hoàn thành việc phân trang và sắp xếp.

```java
@Query("select u from User u where department.id=?1")
public Page<User> QueryUsers(Integer departmentId, Pageable page);
```

`@Query` cũng cho phép các câu lệnh SQL cập nhật, xóa, trong trường hợp này, bạn phải sử dụng kèm với `@Modifying`, ví dụ:

```java
@Modifying
@Query("update User u set u.name= ?1 where u.id= ?2")
int updateName(String name, Integer id);
```

### Truy vấn bằng SQL động

Truy vấn SQL động rất hữu ích khi bạn cần xây dựng truy vấn dựa trên một số điều kiện đầu vào không xác định trước. Spring Data JPA hỗ trợ truy vấn SQL động thông qua các tiện ích như `Criteria API` và `Specifications`.

1. **Criteria API**: Criteria API cho phép bạn xây dựng truy vấn SQL động và an toàn kiểu trong cùng một lúc. Bạn có thể tạo ra các truy vấn phức tạp mà không cần phải lo lắng về các vấn đề về chuỗi hoặc SQL Injection.
2. **Specifications**: Specifications là một phương pháp khác để tạo ra các truy vấn SQL động trong Spring Data JPA. Specifications được xây dựng trên Criteria API và đơn giản hóa việc tạo ra các truy vấn phức tạp.

Ví dụ về việc sử dụng Specifications:

```java
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
}

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> findUsers(String name, Integer age) {
        return userRepository.findAll((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (name != null) {
                predicates.add(cb.equal(root.get("name"), name));
            }
            if (age != null) {
                predicates.add(cb.equal(root.get("age"), age));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        });
    }
}
```

Trong ví dụ trên, chúng ta tạo ra một truy vấn SQL động dựa trên các tham số `name` và `age`. Nếu một tham số nào đó không được cung cấp, chúng ta sẽ không thêm điều kiện tương ứng vào truy vấn.

Để biết thêm chi tiết, bạn có thể tham khảo bài viết: [SpringDataJpa 中的复杂查询和动态查询，多表查询](https://juejin.cn/post/6844904160807092237) (bài viết này được viết bằng tiếng Trung, nhưng bạn có thể sử dụng công cụ dịch trực tuyến để hiểu nội dung).

### Truy vấn bằng phương pháp Example

Phương thức này cho phép tạo ra một đối tượng Example từ một entity, và Spring Data sẽ sử dụng đối tượng Example này để xây dựng câu lệnh JPQL. Tuy nhiên, việc sử dụng phương thức này có hạn chế về tính linh hoạt - các điều kiện chỉ được kết hợp bằng AND, không thể sử dụng OR, cũng như không thể sử dụng các toán tử so sánh như lớn hơn, nhỏ hơn, between, v.v. trong các điều kiện.

Kế thừa `JpaRepository`

```java
<S extends T> List<S> findAll(Example<S> var1);
<S extends T> List<S> findAll(Example<S> var1, Sort var2);
```

Ví dụ về việc sử dụng Example:

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

Trong đoạn mã trên, chúng ta tạo ra một đối tượng User và đặt các điều kiện truy vấn: tên là tham số `name` và id của phòng ban là 1. Chúng ta sử dụng `Example.of` để xây dựng truy vấn này.

Đối với hầu hết các truy vấn, chúng ta không chỉ muốn tìm kiếm các kết quả khớp hoàn toàn. `ExampleMatcher` cung cấp thêm các điều kiện. Ví dụ, nếu bạn muốn tìm tất cả người dùng có tên bắt đầu bằng "xxx", bạn có thể xây dựng truy vấn như sau:

```java
ExampleMatcher matcher = ExampleMatcher.matching().withMatcher("xxx",
    GenericPropertyMatchers.startsWith().ignoreCase());
Example<User> example = Example.of(user, matcher);
```

### Sắp xếp (Sort)

Đối tượng Sort được sử dụng để chỉ định thứ tự sắp xếp. Cách đơn giản nhất để tạo một đối tượng Sort là truyền vào một danh sách tên thuộc tính (không phải tên cột trong cơ sở dữ liệu, mà là tên thuộc tính). Thứ tự sắp xếp mặc định là tăng dần.

```java
Sort sort = new Sort("id");
//Sort sort = new Sort(Direction.DESC, "id");
return userDao.findAll(sort);
```

Hibernate sẽ xây dựng điều kiện sắp xếp dựa trên đối tượng Sort. `Sort.by("id")` có nghĩa là sắp xếp theo `id` theo thứ tự tăng dần.

Các phương thức khởi tạo khác của Sort bao gồm:

- `Sort.by(String… properties)`: Sắp xếp tăng dần theo danh sách thuộc tính đã chỉ định.
- `Sort.by(Sort.Direction direction, String… properties)`: Sắp xếp theo danh sách thuộc tính đã chỉ định, thứ tự sắp xếp được xác định bởi `direction`, `direction` là một kiểu Enum, có `Sort.Direction.ASC` và `Sort.Direction.DESC`.
- `Sort.by(Sort.Order… orders)`: Bạn cũng có thể tạo đối tượng Sort bằng cách sử dụng các phương thức tĩnh của `Sort.Order`như `Sort.Order.asc(String property)` và `Sort.Order.desc(String property)`.

### Phân trang (Page và Pageable)

Interface Pageable được sử dụng để xây dựng truy vấn phân trang, PageRequest là một lớp triển khai của nó, bạn có thể tạo PageRequest bằng cách sử dụng các phương thức tĩnh sau:

Lưu ý rằng tôi đang sử dụng spring boot 2.0.2, phiên bản jpa là 2.0.8, cách thao tác với phiên bản mới khác với phiên bản trước đó.

- `public static PageRequest of(int page, int size)`: : Tạo một yêu cầu phân trang mới với số lượng phần tử cụ thể trên mỗi trang.
- `public static PageRequest of(int page, int size, Sort sort)`: Tạo một yêu cầu phân trang mới với số lượng phần tử cụ thể trên mỗi trang và sắp xếp cụ thể.
- `public static PageRequest of(int page, int size, Direction direction, String… properties)`: Tạo một yêu cầu phân trang mới với số lượng phần tử cụ thể trên mỗi trang và sắp xếp tuỳ chỉnh.

Trong đó, `page` bắt đầu từ 0, biểu thị trang cần truy vấn, `size` chỉ số lượng dòng mong muốn trên mỗi trang.

Truy vấn phân trang của Spring Data luôn trả về một đối tượng Page. Đối tượng Page cung cấp các phương thức thường được sử dụng sau:

- `int getTotalPages()`: Tổng số trang
- `long getTotalElements()`: Trả về tổng số phần tử
- `List<T> getContent()`: Trả về tập kết quả truy vấn lần này

## Core API

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230811152211.png)

## Tài liệu tham khảo

- [Trang chủ của Spring](https://spring.io/)
- [Tài liệu chính thức của Spring Framework](https://docs.spring.io/spring-framework/docs/current/spring-framework-reference/index.html)
- [Tài liệu chính thức của Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/html/data.html)
