---
title: SpringBoot Security
tags:
  - spring
  - springboot
  - security
  - backend
categories: 
date created: 2024-02-22
date modified: 2024-02-22
---

# Hướng dẫn nhanh và an toàn với SpringBoot

## Bắt đầu nhanh

(1) Thêm phụ thuộc

```xml
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-security</artifactId>
		</dependency>
```

(2) Thêm cấu hình

```properties
spring.security.user.name = root
spring.security.user.password = root
spring.security.user.roles = USER
```

(3) Sau khi khởi động ứng dụng, khi truy cập bất kỳ đường dẫn nào, bạn sẽ thấy trang dưới đây, nhắc bạn thực hiện thao tác đăng nhập trước. Nhập tên người dùng và mật khẩu đã cấu hình (root/root) để truy cập trang ứng dụng.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240222232957.png)
