---
title: Spring Data Integration
tags: [spring, java, db, backend]
categories: [spring, java, db, backend]
date created: 2023-08-11
date modified: 2023-08-11
---

# Tổng quan về Spring Data

Mục tiêu chính của Spring Data Repository là giảm đáng kể mã lặp lại khi truy cập vào lưu trữ.

## Khái niệm cốt lõi

Repository là một giao diện cốt lõi của Spring Data. Giao diện này chủ yếu được sử dụng như một giao diện đánh dấu để xác định loại dữ liệu sẽ được sử dụng và giúp bạn khám phá các giao diện kế thừa giao diện này. Giao diện `CrudRepository` và `ListCrudRepository` cung cấp các chức năng CRUD phức tạp cho các lớp thực thể được quản lý. `ListCrudRepository` cung cấp các phương thức tương tự, nhưng chúng trả về `List` trong khi các phương thức của `CrudRepository` trả về `Iterable`.

Giao diện `CrudRepository` được định nghĩa như sau:

```java
public interface CrudRepository<T, ID> extends Repository<T, ID> {

  <S extends T> S save(S entity);

  Optional<T> findById(ID primaryKey);

  Iterable<T> findAll();

  long count();

  void delete(T entity);

  boolean existsById(ID primaryKey);

  // … more functionality omitted.
}
```

> Dự án Spring Data cũng cung cấp các giao diện trừu tượng cho một số công nghệ lưu trữ cụ thể, chẳng hạn như JpaRepository hoặc MongoRepository. Các giao diện này mở rộng CrudRepository và tiếp cận các chức năng cơ bản của công nghệ lưu trữ cụ thể.

Ngoài `CrudRepository`, còn có một giao diện `PagingAndSortingRepository` mở rộng thêm các phương thức để đơn giản hóa việc truy cập phân trang vào thực thể:

```java
public interface PagingAndSortingRepository<T, ID>  {

  Iterable<T> findAll(Sort sort);

  Page<T> findAll(Pageable pageable);
}
```

【Ví dụ】Để truy cập trang thứ hai của User với kích thước trang là 20, bạn có thể thực hiện như sau:

```java
PagingAndSortingRepository<User, Long> repository = // … get access to a bean
Page<User> users = repository.findAll(PageRequest.of(1, 20));
```

Ngoài các phương thức truy vấn, cũng có sẵn các phương thức truy vấn cho việc đếm và xóa.

【Ví dụ】Đếm theo họ

```java
interface UserRepository extends CrudRepository<User, Long> {
  long countByLastname(String lastname);
}
```

【Ví dụ】Xóa theo họ

```java
interface UserRepository extends CrudRepository<User, Long> {

  long deleteByLastname(String lastname);

  List<User> removeByLastname(String lastname);
}
```

## Phương thức truy vấn

Để truy vấn cơ sở dữ liệu bằng Spring Data, bạn cần thực hiện bốn bước sau:

1. Khai báo một giao diện mở rộng `Repository` hoặc một giao diện con của nó và chỉ định kiểu dữ liệu chung (lớp thực thể và kiểu ID), như ví dụ dưới đây:

   ```java
   interface PersonRepository extends Repository<Person, Long> { … }
   ```

2. Trong giao diện, khai báo các phương thức truy vấn

   ```java
   interface PersonRepository extends Repository<Person, Long> {
     List<Person> findByLastname(String lastname);
   }
   ```

3. Sử dụng [JavaConfig](https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#repositories.create-instances.java-config) hoặc [Cấu hình XML](https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#repositories.create-instances) để tạo các đối tượng proxy cho các giao diện này

   ```java
   @EnableJpaRepositories
   class Config { … }
   ```

4. Tiêm vào đối tượng `Repository` và sử dụng nó

   ```java
   class SomeClient {

     private final PersonRepository repository;

     SomeClient(PersonRepository repository) {
       this.repository = repository;
     }

     void doSomething() {
       List<Person> persons = repository.findByLastname("Matthews");
     }
   }
   ```

## Định nghĩa Repository

Đầu tiên, bạn cần định nghĩa một giao diện Repository, giao diện này phải mở rộng từ Repository và chỉ định các kiểu dữ liệu chung (lớp thực thể và kiểu ID). Nếu bạn muốn tiếp cận các phương thức CRUD cho thực thể này, bạn có thể mở rộng giao diện CrudRepository.

### Tinh chỉnh định nghĩa Repository

Spring Data cung cấp nhiều loại Repository để đáp ứng các tình huống yêu cầu khác nhau.

`CrudRepository` cung cấp các chức năng CRUD.

`ListCrudRepository` tương tự như `CrudRepository`, nhưng các phương thức trả về một `List` thay vì `Iterable` để sử dụng dễ dàng hơn.

Nếu bạn sử dụng framework phản ứng, bạn có thể sử dụng `ReactiveCrudRepository` hoặc `RxJava3CrudRepository`.

`CoroutineCrudRepository` hỗ trợ tính năng coroutine của Kotlin.

`PagingAndSortingRepository` cung cấp chức năng phân trang và sắp xếp.

Nếu bạn không muốn mở rộng các giao diện Spring Data, bạn có thể sử dụng chú thích `@RepositoryDefinition` trên giao diện Repository của bạn. Khi làm như vậy, bạn có thể thay đổi kiểu trả về của các phương thức. Nếu có thể, Spring Data sẽ tuân thủ kiểu trả về. Ví dụ, đối với các phương thức trả về nhiều thực thể, bạn có thể chọn `Iterable<T>`, `List<T>`, `Collection<T>` hoặc danh sách `VAVR`.

Khi tạo một giao diện Repository tùy chỉnh, bạn phải đánh dấu nó với `@NoRepositoryBean`. Điều này ngăn Spring Data cố gắng tạo một phiên bản của nó và thất bại vì nó không thể xác định thực thể của Repository vì nó vẫn chứa một biến kiểu chung.

Dưới đây là ví dụ về cách chọn lọc các phương thức CRUD (trong trường hợp này là findById và save):

```java
@NoRepositoryBean
interface MyBaseRepository<T, ID> extends Repository<T, ID> {

  Optional<T> findById(ID id);

  <S extends T> S save(S entity);
}

interface UserRepository extends MyBaseRepository<User, Long> {
  User findByEmailAddress(EmailAddress emailAddress);
}
```

### Sử dụng nhiều module Spring Data

Đôi khi, trong chương trình cần sử dụng nhiều module Spring Data. Trong trường hợp này, cần phải phân biệt công nghệ lưu trữ. Khi phát hiện nhiều nhà máy Repository trên đường dẫn lớp, Spring Data chuyển sang chế độ cấu hình nghiêm ngặt.

Nếu Repository được định nghĩa mở rộng từ Repository trong một module cụ thể, nó sẽ là ứng cử viên hợp lệ cho module Spring Data cụ thể đó.

Nếu lớp thực thể sử dụng chú thích loại cụ thể của module, nó sẽ là ứng cử viên hợp lệ cho module Spring Data cụ thể đó. module Spring Data chấp nhận chú thích bên thứ ba (ví dụ: `@Entity` của JPA) hoặc cung cấp chú thích riêng (ví dụ: `@Document` cho Spring Data MongoDB và Spring Data Elasticsearch).

Ví dụ dưới đây cho thấy một Repository sử dụng giao diện cụ thể cho module JPA:

```java
interface MyRepository extends JpaRepository<User, Long> { }

@NoRepositoryBean
interface MyBaseRepository<T, ID> extends JpaRepository<T, ID> { … }

interface UserRepository extends MyBaseRepository<User, Long> { … }
```

MyRepository và UserRepository mở rộng JpaRepository. Chúng là ứng cử viên hợp lệ cho module Spring Data JPA.

Ví dụ dưới đây cho thấy một Repository sử dụng giao diện chung:

```java
interface AmbiguousRepository extends Repository<User, Long> { … }

@NoRepositoryBean
interface MyBaseRepository<T, ID> extends CrudRepository<T, ID> { … }

interface AmbiguousUserRepository extends MyBaseRepository<User, Long> { … }
```

AmbiguousRepository và AmbiguousUserRepository chỉ mở rộng Repository và CrudRepository. Mặc dù điều này tốt khi chỉ sử dụng một module Spring Data duy nhất, nhưng khi có nhiều module, không thể phân biệt được Repository này nên liên kết với module Spring Data cụ thể nào.

Ví dụ dưới đây cho thấy một Repository sử dụng lớp thực thể được chú thích:

```java
interface PersonRepository extends Repository<Person, Long> { … }

@Entity
class Person { … }

interface UserRepository extends Repository<User, Long> { … }

@Document
class User { … }
```

PersonRepository tham chiếu đến Person, nó được đánh dấu bằng chú thích @Entity của JPA, do đó Repository này rõ ràng thuộc về Spring Data JPA. UserRepository tham chiếu đến User, nó được đánh dấu bằng chú thích @Document của Spring Data MongoDB.

Ví dụ lỗi dưới đây cho thấy một Repository sử dụng lớp thực thể có chú thích kết hợp:

```java
interface JpaPersonRepository extends Repository<Person, Long> { … }

interface MongoDBPersonRepository extends Repository<Person, Long> { … }

@Entity
@Document
class Person { … }
```

Trong ví dụ này, lớp thực thể sử dụng chú thích của cả JPA và Spring Data MongoDB. Đã định nghĩa hai Repository: JpaPersonRepository và MongoDBPersonRepository. Một cái cho JPA và một cái cho MongoDB. Spring Data không còn có thể phân biệt được Repository, điều này dẫn đến hành vi không xác định.

Phương pháp phân biệt Repository cuối cùng là xác định phạm vi quét gói của Repository.

```java
@EnableJpaRepositories(basePackages = "com.acme.repositories.jpa")
@EnableMongoRepositories(basePackages = "com.acme.repositories.mongo")
class Configuration { … }
```

## Định nghĩa các phương thức truy vấn

Repository proxy có hai phương thức để tạo ra các truy vấn cụ thể cho lưu trữ từ tên phương thức:

- Tạo truy vấn trực tiếp từ tên phương thức.
- Sử dụng truy vấn được định nghĩa thủ công.

Các tùy chọn có sẵn phụ thuộc vào lưu trữ thực tế. Tuy nhiên, phải có một chiến lược để quyết định tạo ra truy vấn thực tế nào.

### Chiến lược truy vấn

Các chiến lược sau có sẵn cho cơ sở hạ tầng Repository để giải quyết các truy vấn. Trong Java configuration, bạn có thể sử dụng thuộc tính queryLookupStrategy của chú thích EnableJpaRepositories. Một số cơ sở dữ liệu cụ thể có thể không hỗ trợ một số chiến lược.

- `CREATE`: Cố gắng tạo truy vấn cụ thể cho lưu trữ từ tên phương thức.
- `USE_DECLARED_QUERY`: Cố gắng tìm kiếm truy vấn đã được khai báo, nếu không tìm thấy sẽ ném ra ngoại lệ.
- `CREATE_IF_NOT_FOUND` (mặc định): Kết hợp `CREATE` và `USE_DECLARED_QUERY`.

### Tạo truy vấn

Spring Data có một cơ chế xây dựng truy vấn tích hợp sẵn, có thể tự động ánh xạ các phương thức phù hợp với các quy tắc về tên và tham số.

```java
interface PersonRepository extends Repository<Person, Long> {

  List<Person> findByEmailAddressAndLastname(EmailAddress emailAddress, String lastname);

  // Kích hoạt cờ distinct cho truy vấn
  List<Person> findDistinctPeopleByLastnameOrFirstname(String lastname, String firstname);
  List<Person> findPeopleDistinctByLastnameOrFirstname(String lastname, String firstname);

  // Kích hoạt bỏ qua việc phân biệt chữ hoa chữ thường cho một thuộc tính cụ thể
  List<Person> findByLastnameIgnoreCase(String lastname);
  // Kích hoạt bỏ qua việc phân biệt chữ hoa chữ thường cho tất cả các thuộc tính phù hợp
  List<Person> findByLastnameAndFirstnameAllIgnoreCase(String lastname, String firstname);

  // Kích hoạt ORDER BY tĩnh cho một truy vấn
  List<Person> findByLastnameOrderByFirstnameAsc(String lastname);
  List<Person> findByLastnameOrderByFirstnameDesc(String lastname);
}
```

Phân tích tên phương thức truy vấn thành chủ ngữ và vị ngữ. Phần đầu tiên (find…By, exists…By) xác định chủ ngữ của truy vấn, phần thứ hai tạo thành vị ngữ. Chủ ngữ có thể chứa các biểu thức mở rộng hơn. Bất kỳ văn bản nào giữa `find` (hoặc từ khóa giới thiệu khác) và `By` được coi là mô tả, trừ khi sử dụng một trong các từ khóa giới hạn kết quả như `Distinct` để đặt cờ khác nhau trên truy vấn được tạo ra hoặc `Top`/`First` để giới hạn kết quả truy vấn.

> Tham khảo:
>
> [Các từ khóa chủ ngữ truy vấn được hỗ trợ bởi Spring Data](https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#appendix.query.method.subject)
>
> [Các từ khóa vị ngữ truy vấn được hỗ trợ bởi Spring Data](https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#appendix.query.method.predicate)

## Tạo các phiên bản Repository

## Tự định nghĩa triển khai Repository

## Mở rộng Spring Data
