---
title: URI
tags:
  - network
  - computer-science
categories: network, computer-science
date created: 2023-09-17
date modified: 2023-09-17
---

# URI

URI (Uniform Resource Identifier) là một giao thức khác độc lập với HTTP.

HTTP là một giao thức vận chuyển và URI là một giao thức để thông báo vị trí của tài nguyên.

Là tên viết tắt của Uniform Resource Identifiers (URI), nó được sử dụng để chỉ ra vị trí của tài nguyên sẽ được truy cập trên World Wide Web (www).

Tài nguyên có thể là bất kỳ thứ gì từ tài liệu HTML, hình ảnh, video, âm thanh và tài liệu văn bản.

URI được chia thành 2 nhánh: **URL** và **URN**

## URL (Uniform Resource Locator)

![Pasted image 20230527022534](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%2520image%252020230527022534.png)

URL (Uniform Resource Locator) là **định vị tài nguyên** hay nói dễ hiểu là URL chỉ ra vị trí và cách thức lấy tài nguyên.  

- [https://google.com]( https://google.com ) : Đây là URL vì vừa chỉ ra địa chỉ tài nguyên ( https, http, file hay ssh…) vừa chỉ ra được giao thức truy cập tài nguyên. Đây cũng có thể gọi là URI).
- [google.com]( https://google.com ) : Đây không là URL vì không chỉ ra được giao thức truy cập. Đây cũng có thể gọi là URI.

## URN ( Uniform Resource Name )

URN ( Uniform Resource Name ) là **định danh tài nguyên** hay nói dễ hiểu là nó chỉ ra tên của tài nguyên.

- [org/img.png:](http://stg.org/img.png:) Đây là URN vì nó sẽ cung cấp cho ta định danh của tài nguyên này trên mạng, khác URL ở chỗ URN này sẽ không chỉ cho ta chính xác sử dụng giao thức hay cách nào để lấy tài nguyên.

## Tóm tắt

Giống như con người để xác thực một ai đó chúng ta cần tên và địa chỉ của người đó thì URL sẽ có nhiệm vụ là chỉ ra địa chỉ và phương thức để đi đến người đó, còn URN sẽ có nhiệm vụ xác định tên của người đó.

![Pasted image 20230527022830](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%2520image%252020230527022830.png)
