---
categories: [java]
title: Java Development Environment
date created: 2023-07-08
date modified: 2023-07-11
tags: [Java, JavaSE, JDK]
---

# Java Development Environment

> 📌 **Keyword:** JAVA_HOME, CLASSPATH, Path, Environment Variable, IDE

> Hướng dẫn trực quan hơn: [Set JAVA\_HOME on Windows 7, 8, 10, Mac OS X, Linux | Baeldung](https://www.baeldung.com/java-home-on-windows-7-8-10-mac-os-x-linux)

## Download

Truy cập vào [Java Downloads | Oracle](https://www.oracle.com/java/technologies/downloads/#java8), sau đó tải về phiên bản JDK phù hợp với hệ điều hành của bạn.

## Install

Gói JDK cho Windows là một tệp tin cài đặt exe, chỉ cần chạy tệp tin này và làm theo hướng dẫn để cài đặt.

Gói JDK cho macOS là một tập tin nén dmg, mở nó ra sẽ có tập tin cài đặt và làm theo hướng dẫn như bình thường để cài.

Gói JDK cho Linux chỉ cần giải nén và lưu trữ trên máy.

## Set Environment Variable

### Windows

**My Computer / This PC** > **Properties** > **Advanced** > **Environment Variables**

Thêm các biến môi trường sau:

`JAVA_HOME`: `C:\Program Files (x86)\Java\jdk1.8.0_91` (thay đổi đường dẫn thực tế của bạn)

`CLASSPATH`: `.;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar;` (lưu ý có một dấu chấm ở đầu)

`Path`: `%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin;`

### Linux / macOS

Để chỉnh sửa tập biến môi trường:
- Với Linux, chạy lệnh `vi /etc/profile` 
- Với macOS, chạy lệnh `vi ~/.zshrc` 

Thêm hai dòng sau:

```shell
export JAVA_HOME=path/to/java
export PATH=JAVA_HOME/bin:JAVA_HOME/jre/bin:
```

Chạy lệnh để áp dụng thay đổi:
- Với Linux, chạy lệnh `source /etc/profile` 
- Với macOS, chạy lệnh `source ~/.zshrc` 

## Kiểm tra cài đặt thành công

Chạy lệnh `java -version`, nếu cài đặt thành công, phiên bản Java hiện tại sẽ được hiển thị.

## IDE - Integrated Development Environment

Để làm việc với Java, chọn một IDE phù hợp là rất cần thiết.

IDE (Integrated Development Environment - Môi trường phát triển tích hợp) là một ứng dụng cung cấp môi trường phát triển cho việc lập trình, bao gồm trình soạn thảo mã (code editor), trình biên dịch (compiler), trình gỡ lỗi (debugger) và giao diện người dùng đồ họa (user interface).

Dưới đây là một số IDE phổ biến cho Java:

- Eclipse - Một nền tảng phát triển mở và mở rộng được xây dựng trên Java.
- NetBeans - Một môi trường phát triển tích hợp Java mã nguồn mở, phù hợp cho các ứng dụng máy khách và web.
- IntelliJ IDEA - Cung cấp nhiều tính năng tốt như gợi ý mã, phân tích mã và nhiều hơn nữa.
- MyEclipse - Một IDE Java thương mại phổ biến được phát triển bởi công ty Genuitec.
- EditPlus - Nếu cấu hình đúng trình biên dịch Java "Javac" và trình thông dịch "Java", bạn có thể sử dụng EditPlus để biên dịch và chạy chương trình Java trực tiếp.

## Chương trình đầu tiên: Hello World

Tạo tệp `HelloWorld.java` với nội dung sau:

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
```

Sau khi chạy, kết quả sẽ hiển thị trên cửa sổ điều khiển:

```
Hello World
```
