---
title: Spring Access MongoDB
tags:
  - spring
  - java
  - db
  - backend
  - mongodb
categories:
  - spring
  - java
  - db
  - backend
date created: 2023-08-11
date modified: 20243-20228-11
---

# Truy cập MongoDB bằng Spring

## Giới thiệu

[MongoDB](https://www.mongodb.org/) là một cơ sở dữ liệu dựa trên việc lưu trữ tệp phân tán. Nó được viết bằng ngôn ngữ C++. MongoDB nhằm cung cấp một giải pháp lưu trữ dữ liệu có hiệu suất cao và có khả năng mở rộng cho các ứng dụng web. MongoDB lưu trữ dữ liệu dưới dạng tài liệu, cấu trúc dữ liệu bao gồm các cặp khóa-giá trị. Tài liệu MongoDB tương tự như đối tượng JSON. Giá trị của trường có thể chứa các tài liệu khác, mảng và mảng tài liệu.

Trong Spring, dự án [spring-data-mongodb](https://github.com/spring-projects/spring-data-mongodb) cung cấp một interface API để truy cập vào MongoDB và cung cấp cách tiếp cận dễ dàng. Spring Data MongoDB tập trung vào một mô hình trung tâm dựa trên POJO để tương tác với `DBCollection` của MongoDB và dễ dàng viết lớp truy cập dữ liệu dạng `Repository`.

Dự án [spring-boot](https://github.com/spring-projects/spring-boot) có một mô-đun con [spring-boot-starter-data-mongodb](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-starters/spring-boot-starter-data-mongodb) dựa trên dự án [spring-data-mongodb](https://github.com/spring-projects/spring-data-mongodb), cung cấp một cách tiếp cận đơn giản hóa cho việc cấu hình MongoDB.

## Bắt đầu nhanh với Spring Boot

### Thêm phụ thuộc

Thêm phụ thuộc vào file pom.xml:

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

### Cấu hình nguồn dữ liệu

```properties
spring.data.mongodb.host = localhost
spring.data.mongodb.port = 27017
spring.data.mongodb.database = test
spring.data.mongodb.username = root
spring.data.mongodb.password = root
```

### Định nghĩa đối tượng

Định nghĩa một lớp `Customer` có ba thuộc tính: `id`, `firstName` và `lastName`.

```java
import org.springframework.data.annotation.Id;

public class Customer {

    @Id
    public String id;

    public String firstName;

    public String lastName;

    public Customer(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    @Override
    public String toString() {
        return String.format(
            "Customer[id=%s, firstName='%s', lastName='%s']",
            id, firstName, lastName);
    }

}
```

[spring-data-mongodb](https://github.com/spring-projects/spring-data-mongodb) sẽ ánh xạ lớp `Customer` vào một bộ sưu tập có tên là `customer`. Nếu bạn muốn thay đổi tên của bộ sưu tập, bạn có thể sử dụng chú thích `@Document` trên lớp.

### Tạo Repository

[spring-data-mongodb](https://github.com/spring-projects/spring-data-mongodb) kế thừa khả năng của dự án [Spring Data Commons](https://github.com/spring-projects/spring-data-commons), vì vậy bạn có thể sử dụng API chung của nó - `Repository`.

Đầu tiên, hãy định nghĩa một lớp `CustomerRepository`, kế thừa từ interface `MongoRepository` và chỉ định các tham số kiểu của nó: `Customer` và `String`. interface `MongoRepository` hỗ trợ nhiều phương thức thao tác, bao gồm CRUD và truy vấn phân trang. Trong ví dụ dưới đây, chúng ta định nghĩa hai phương thức truy vấn:

```java
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface CustomerRepository extends MongoRepository<Customer, String> {

    Customer findByFirstName(String firstName);
    List<Customer> findByLastName(String lastName);

}
```

### Tạo Application

Tạo một lớp khởi chạy ứng dụng Spring Boot có tên là Application và trong phương thức main của nó, sử dụng đối tượng CustomerRepository để truy cập MongoDB.

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DataMongodbApplication implements CommandLineRunner {

    @Autowired
    private CustomerRepository repository;

    public static void main(String[] args) {
        SpringApplication.run(DataMongodbApplication.class, args);
    }

    @Override
    public void run(String... args) {

        repository.deleteAll();

        // save a couple of customers
        repository.save(new Customer("Alice", "Smith"));
        repository.save(new Customer("Bob", "Smith"));

        // fetch all customers
        System.out.println("Customers found with findAll():");
        System.out.println("-------------------------------");
        for (Customer customer : repository.findAll()) {
            System.out.println(customer);
        }
        System.out.println();

        // fetch an individual customer
        System.out.println("Customer found with findByFirstName('Alice'):");
        System.out.println("--------------------------------");
        System.out.println(repository.findByFirstName("Alice"));

        System.out.println("Customers found with findByLastName('Smith'):");
        System.out.println("--------------------------------");
        for (Customer customer : repository.findByLastName("Smith")) {
            System.out.println(customer);
        }
    }

}

```

Sau khi chạy phương thức main của DataMongodbApplication, kết quả tương tự như sau:

```
Customers found with findAll():
-------------------------------
Customer(id=63d6157b265e7c5e48077f63, firstName=Alice, lastName=Smith)
Customer(id=63d6157b265e7c5e48077f64, firstName=Bob, lastName=Smith)

Customer found with findByFirstName('Alice'):
--------------------------------
Customer(id=63d6157b265e7c5e48077f63, firstName=Alice, lastName=Smith)
Customers found with findByLastName('Smith'):
--------------------------------
Customer(id=63d6157b265e7c5e48077f63, firstName=Alice, lastName=Smith)
Customer(id=63d6157b265e7c5e48077f64, firstName=Bob, lastName=Smith)
```

## Tài liệu tham khảo

- [Trang chủ MongoDB](https://www.mongodb.com/)
- [MongoDB Github](https://github.com/mongodb/mongo)
- [Khóa học miễn phí chính thức của MongoDB](https://university.mongodb.com/)
- [spring-data-mongodb trên Github](https://github.com/spring-projects/spring-data-mongodb)
- [Tài liệu chính thức của Spring Data MongoDB](https://docs.spring.io/spring-data/mongodb/docs/current/reference/html/)
- [Ví dụ chính thức của Spring Data](https://github.com/spring-projects/spring-data-examples/)
- [Truy cập dữ liệu với MongoDB](https://spring.io/guides/gs/accessing-data-mongodb/)
- [Truy cập dữ liệu MongoDB với REST](https://spring.io/guides/gs/accessing-mongodb-data-rest/)
