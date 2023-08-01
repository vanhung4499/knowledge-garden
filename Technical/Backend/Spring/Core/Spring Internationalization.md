---
title: Spring Internationalization
tags: [spring, java, backend]
categories: [spring, java, backend]
date created: 2023-07-26
date modified: 2023-07-26
---

# Spring Quốc tế hóa

## Các trường hợp sử dụng Quốc tế hóa trong Spring

- Văn bản Quốc tế thông thường
- Văn bản Quốc tế cho Bean Validation
- Hiển thị trang web
- Thông báo lỗi trong Web MVC

## Giao diện Quốc tế hóa trong Spring

- Giao diện cốt lõi: `org.springframework.context.MessageSource`
- Khái niệm chính
  - Mã mẫu văn bản (code)
  - Tham số mẫu văn bản (args)
  - Khu vực (Locale)

## MessageSource có cấu trúc phân cấp

- Xem lại giao diện phân cấp trong Spring
  - `org.springframework.beans.factory.HierarchicalBeanFactory`
  - `org.springframework.context.ApplicationContext`
  - `org.springframework.beans.factory.config.BeanDefinition`
- Giao diện Quốc tế hóa phân cấp trong Spring
  - `org.springframework.context.HierarchicalMessageSource`

## Cài đặt tiêu chuẩn Quốc tế hóa Java

Giao diện cốt lõi:

- Cài đặt trừu tượng - `java.util.ResourceBundle`
- Cài đặt tài nguyên Properties - `java.util.PropertyResourceBundle`
- Cài đặt danh sách - `java.util.ListResourceBundle`

Tính năng chính của `ResourceBundle`:

- Thiết kế Key-Value
- Thiết kế phân cấp
- Thiết kế bộ nhớ đệm
- Kiểm soát mã hóa ký tự - `java.util.ResourceBundle.Control` (@since 1.6)
- Mở rộng Control SPI - `java.util.spi.ResourceBundleControlProvider` (@since 1.8)

## Định dạng văn bản Java

- Giao diện cốt lõi
  - java.text.MessageFormat
- Cách sử dụng cơ bản
  - Thiết lập mẫu định dạng tin nhắn - new MessageFormat(…)
  - Định dạng - format(new Object[]{…})
- Mẫu định dạng tin nhắn
  - Phần tử định dạng: {ArgumentIndex (,FormatType,(FormatStyle))}
  - FormatType: Loại định dạng tin nhắn, tùy chọn, mỗi loại chọn một trong số number, date, time và choice
  - FormatStyle: Kiểu định dạng tin nhắn, tùy chọn, bao gồm: short, medium, long, full, integer, currency, percent
- Tính năng nâng cao
  - Thiết lập lại mẫu định dạng tin nhắn
  - Thiết lập lại java.util.Locale
  - Thiết lập lại java.text.Format

## Cài đặt sẵn MessageSource

- Cài đặt MessageSource dựa trên ResourceBundle + MessageFormat
- org.springframework.context.support.ResourceBundleMessageSource
- Cài đặt MessageSource dựa trên Properties + MessageFormat có thể tải lại
- org.springframework.context.support.ReloadableResourceBundleMessageSource

## Sự phụ thuộc MessageSource tích hợp sẵn

- Các Bean phụ thuộc MessageSource có thể được đăng ký trước
- Tên Bean được đăng ký trước là "messageSource", kiểu Bean là MessageSource
- Cài đặt tích hợp sẵn - DelegatingMessageSource
- Tìm kiếm MessageSource theo cấp bậc

## Câu hỏi

**Tại sao Spring Boot cần tạo Bean MessageSource mới?**

- Cài đặt MessageSource tích hợp sẵn được quyết định bởi các lớp triển khai của AbstractApplicationContext
- Spring Boot sử dụng cấu hình bên ngoài để đơn giản hóa việc xây dựng Bean MessageSource
- Spring Boot phổ biến việc sử dụng Bean Validation

**Có những giao diện Quốc tế hóa nào trong Spring?**

- Giao diện cốt lõi - MessageSource
- Giao diện phân cấp - `org.springframework.context.HierarchicalMessageSource`

**Có những cài đặt sẵn nào cho MessageSource trong Spring?**

- `org.springframework.context.support.ResourceBundleMessageSource`
- `org.springframework.context.support.ReloadableResourceBundleMessageSource`
- `org.springframework.context.support.StaticMessageSource`
- `org.springframework.context.support.DelegatingMessageSource`

**Làm thế nào để cấu hình tự động cập nhật MessageSource?**

Công nghệ chính

- Java NIO 2: `java.nio.file.WatchService`
- Java Concurrency: `java.util.concurrent.ExecutorService`
- Spring: `org.springframework.context.support.AbstractMessageSource`
