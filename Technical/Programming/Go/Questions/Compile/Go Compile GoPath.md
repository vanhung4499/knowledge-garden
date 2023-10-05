---
title: Golang Compile GoPath
tags:
  - golang
  - interview
categories:
  - golang
  - interview
date created: 2023-10-05
date modified: 2023-10-05
---

# Golang Compile: GoRoot and GoPath

GoRoot là đường dẫn cài đặt của Go. Trên macOS hoặc Unix, nó thường nằm trong đường dẫn `/usr/local/go`. Hãy xem những gì đã được cài đặt ở đây:

![go-compile-1.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/go-compile-1.png)

Trong thư mục bin:

![compile-2.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/compile-2.png)

Trong thư mục pkg:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/go-compile-3.png)

Thư mục công cụ Go bao gồm các công cụ quan trọng như trình biên dịch `compile` và trình liên kết `link`:

![compile-4.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/compile-4.png)

GoPath được sử dụng để cung cấp một đường dẫn để tìm kiếm các tệp nguồn `.go`, nó là khái niệm của một không gian làm việc và có thể được thiết lập với nhiều thư mục. Theo yêu cầu chính thức của Go, GoPath cần chứa ba thư mục:

```shell
src
pkg
bin
```

Thư mục src chứa các tệp nguồn, thư mục pkg chứa các tệp thư viện được biên dịch từ mã nguồn và có phần mở rộng là `.a`, và thư mục bin chứa các tệp thực thi.
