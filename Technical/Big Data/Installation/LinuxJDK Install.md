---
title: LinuxJDK Install
tags:
  - linux
  - java
  - jdk
categories: 
date created: 2024-03-22
date modified: 2024-03-22
---

# Cài đặt JDK trên Linux

>**Môi trường hệ thống**: centos 7.6
>
>**Phiên bản JDK**: jdk 1.8.0_20
>
> Bạn có thể dùng Linux trên máy ảo hoặc máy thật tuỳ ý

### 1. Tải về và giải nén

Truy cập [trang chủ](https://www.oracle.com/technetwork/java/javase/downloads/index.html) để tải về phiên bản JDK cần thiết, ở đây tôi tải về phiên bản [JDK 1.8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html), sau khi tải về, tiến hành giải nén:

```shell
[root@ java]# tar -zxvf jdk-8u201-linux-x64.tar.gz
```

### 2. Đặt biến môi trường

```shell
[root@ java]# vi /etc/profile
```

Thêm cấu hình sau:

```shell
export JAVA_HOME=/usr/java/jdk1.8.0_201  
export JRE_HOME=${JAVA_HOME}/jre  
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib  
export PATH=${JAVA_HOME}/bin:$PATH
```

Thực hiện lệnh `source` để cấu hình có hiệu lực ngay lập tức:

```shell
[root@ java]# source /etc/profile
```

### 3. Kiểm tra xem cài đặt đã thành công chưa

```shell
[root@ java]# java -version
```

Nếu hiển thị thông tin phiên bản tương ứng, điều đó có nghĩa là cài đặt đã thành công.

```shell
java version "1.8.0_201"
Java(TM) SE Runtime Environment (build 1.8.0_201-b09)
Java HotSpot(TM) 64-Bit Server VM (build 25.201-b09, mixed mode)
```
