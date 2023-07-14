---
title: Java Collections Stream
tags: [java, javase, collection]
categories: [java, javase]
date created: 2023-07-15
date modified: 2023-07-15
---

# Java Containers: Stream

## Giới thiệu về Stream

Trong Java 8, `Collection` đã thêm hai phương thức luồng mới là `stream()` và `parallelStream()`.

`Stream` tương đương với phiên bản nâng cao của `Iterator`, nó cho phép chúng ta thực hiện các hoạt động tổng hợp (Aggregate Operation) và hoạt động dữ liệu hàng loạt (Bulk Data Operation) trên tập hợp một cách dễ dàng và hiệu quả bằng cách sử dụng biểu thức Lambda.

## Phân loại các hoạt động Stream

Các hoạt động trong Stream được chia thành hai loại chính: hoạt động trung gian (Intermediate operations) và hoạt động kết thúc (Terminal operations).

Hoạt động trung gian có thể được chia thành hai loại: hoạt động không có trạng thái (Stateless) và hoạt động có trạng thái (Stateful). Hoạt động không có trạng thái là những hoạt động mà xử lý các phần tử không phụ thuộc vào các phần tử trước đó, trong khi hoạt động có trạng thái là những hoạt động mà chỉ có thể tiếp tục khi đã xử lý tất cả các phần tử.

Hoạt động kết thúc có thể được chia thành hai loại: hoạt động cắt ngắn (Short-circuiting) và hoạt động không cắt ngắn (Unshort-circuiting). Hoạt động cắt ngắn là những hoạt động mà kết quả cuối cùng có thể được trả về khi gặp một số phần tử thỏa mãn điều kiện, trong khi hoạt động không cắt ngắn là những hoạt động mà phải xử lý tất cả các phần tử trước khi có kết quả cuối cùng.

## Triển khai Stream

![img](https://raw.githubusercontent.com/dunwu/images/dev/snap/20201205174140.jpg)

`BaseStream` và `Stream` là hai giao diện cấp cao nhất của Stream. `BaseStream` định nghĩa các phương thức cơ bản của Stream, chẳng hạn như spliterator, isParallel, v.v. Trong khi đó, `Stream` định nghĩa các phương thức hoạt động thông dụng của Stream, chẳng hạn như map, filter, v.v.

Giao diện `Sink` định nghĩa quy ước về mối quan hệ giữa các hoạt động Stream, bao gồm các phương thức begin(), end(), cancellationRequested(), accept(). `ReferencePipeline` cuối cùng sẽ tổ chức toàn bộ chuỗi hoạt động Stream thành một chuỗi gọi, và mối quan hệ giữa các hoạt động Stream trên chuỗi gọi này được định nghĩa bởi giao diện Sink.

`ReferencePipeline` là một lớp cấu trúc, nó sử dụng các lớp nội bộ để tổ chức các hoạt động Stream. Nó định nghĩa các lớp nội bộ Head, StatelessOp và StatefulOp, triển khai các phương thức của giao diện BaseStream và Stream. Lớp Head chủ yếu được sử dụng để định nghĩa hoạt động nguồn dữ liệu, khi gọi phương thức names.stream() lần đầu tiên, đối tượng Head sẽ được tạo ra, đây là hoạt động nguồn dữ liệu; sau đó là các hoạt động trung gian, bao gồm các đối tượng StatelessOp và StatefulOp, tại thời điểm này, các Stage chưa được thực hiện, mà chỉ tạo ra một danh sách liên kết Stage cho các hoạt động trung gian trước đó; khi chúng ta gọi hoạt động kết thúc, một Stage cuối cùng sẽ được tạo ra, và thông qua Stage này, các hoạt động trung gian trước đó sẽ được kích hoạt, bắt đầu từ Stage cuối cùng và tiếp tục đệ quy để tạo ra một chuỗi Sink.

## Xử lý Stream song song

Stream có hai cách xử lý dữ liệu: xử lý tuần tự và xử lý song song.
