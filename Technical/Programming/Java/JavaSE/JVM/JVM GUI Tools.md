---
title: JVM GUI Tools
tags: [java, javase, jvm]
categories: [java, javase, jvm]
date created: 2023-07-19
date modified: 2023-07-19
---

# Công cụ GUI JVM

> Những lập trình viên Java không thể tránh khỏi công việc xác định và sửa lỗi, vì vậy thường xuyên cần sử dụng một số công cụ JVM.
>
> Bài viết này giới thiệu một cách hệ thống về các công cụ GUI JVM thông dụng.

## jconsole

> jconsole là một công cụ GUI đi kèm với JDK. **jconsole (Java Monitoring and Management Console) là một công cụ quản lý và giám sát trực quan dựa trên JMX**.
>
> Chức năng quản lý của jconsole dành cho các MBean JMX, vì MBean có thể được truy cập bằng mã, giao diện quản lý của máy chủ trung gian hoặc bất kỳ phần mềm nào tuân thủ quy tắc JMX.

Lưu ý: Để sử dụng jconsole, ứng dụng Java phải bật JMX.

### Bật JMX

Sau khi bật JMX cho ứng dụng Java, bạn có thể sử dụng `jconsole` hoặc `jvisualvm` để giám sát thông tin cơ bản và tình trạng chạy của chương trình Java.

Cách bật là thêm các tham số sau vào sau lệnh java:

```java
-Dcom.sun.management.jmxremote=true
-Dcom.sun.management.jmxremote.ssl=false
-Dcom.sun.management.jmxremote.authenticate=false
-Djava.rmi.server.hostname=127.0.0.1
-Dcom.sun.management.jmxremote.port=18888
```

- `-Djava.rmi.server.hostname` - Chỉ định máy chủ chạy chương trình Java
- `-Dcom.sun.management.jmxremote.port` - Chỉ định cổng lắng nghe dịch vụ JMX

### Kết nối jconsole

Nếu là quy trình Java cục bộ, jconsole có thể kết nối trực tiếp.

Nếu là quy trình Java từ xa, bạn cần kết nối đến cổng JMX của quy trình Java.

![Kết nối với JMX Agent bằng JMX Service URL](https://raw.githubusercontent.com/vanhung4499/images/master/snap/connectadv.gif)

### Giao diện jconsole

Sau khi mở ứng dụng jconsole, bạn sẽ thấy các tab sau.

- `Overview` - Hiển thị thông tin tổng quan về Java VM và các giá trị giám sát.
- `Memory` - Hiển thị thông tin về việc sử dụng bộ nhớ. Trang bộ nhớ tương đương với lệnh `jstat` trực quan.
- `Threads` - Hiển thị thông tin về việc sử dụng luồng.
- `Classes` - Hiển thị thông tin về việc tải lớp.
- `VM Summary` - Hiển thị thông tin về Java VM.
- `MBeans` - Hiển thị thông tin về MBean.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230719183519.png)

## jvisualvm

> jvisualvm là một công cụ GUI đi kèm với JDK. **jvisualvm (All-In-One Java Troubleshooting Tool) là một công cụ tổng hợp để xử lý sự cố Java**. Nó hỗ trợ các chức năng giám sát, xử lý sự cố và phân tích hiệu suất.

Tham khảo trong [VisualVM: Getting Started](https://visualvm.github.io/gettingstarted.html)

## MAT

[MAT](https://www.eclipse.org/mat/) là viết tắt của Eclipse Memory Analyzer Tool.

MAT cũng có thể lấy được bản snapshot nhị phân của heap. Chức năng này sẽ sử dụng `jps` để liệt kê các tiến trình Java đang chạy để lựa chọn và lấy snapshot. Vì `jps` sẽ liệt kê chính nó, bạn sẽ thấy một tiến trình `jps` đã kết thúc trong danh sách.

MAT có thể được cài đặt độc lập ([trang tải xuống chính thức](http://www.eclipse.org/mat/downloads.php)) hoặc cài đặt như một plugin cho Eclipse IDE.

### Cấu hình MAT

Sau khi giải nén MAT, có một tệp `MemoryAnalyzer.ini` trong thư mục cài đặt.

Trong `MemoryAnalyzer.ini`, có một tham số quan trọng là `Xmx`, đại diện cho bộ nhớ tối đa, mặc định là: `-vmargs -Xmx1024m`

Nếu bạn cố gắng nhập tệp dump vượt quá 1024 M, sẽ xảy ra lỗi:

```shell
An internal error occurred during: "Parsing heap dump from XXX"
```

Trong trường hợp này, bạn có thể điều chỉnh kích thước `Xmx`. Nếu giá trị `Xmx` được đặt quá lớn và bộ nhớ trên máy tính không đủ để hỗ trợ, việc khởi động MAT sẽ gặp lỗi:

```
Failed to create the Java Virtual Machine
```

### Phân tích bằng MAT

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200308092746.png)

Bằng cách nhấp vào "Leak Suspects", bạn có thể truy cập vào trang web rò rỉ bộ nhớ.

(1) Đầu tiên, bạn có thể xem biểu đồ bánh để hiểu tổng quan về việc tiêu thụ bộ nhớ

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200308150556.png)

(2) Thu hẹp phạm vi và tìm điểm nghi ngờ vấn đề

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20160223202154818)

Bạn có thể nhấp vào để xem chi tiết, trong trang chi tiết, "Shortest Paths To the Accumulation Point" cho biết đường dẫn ngắn nhất từ GC root đến điểm tập trung bộ nhớ tiêu thụ. Nếu một điểm tập trung bộ nhớ tiêu thụ có đường dẫn đến GC root, điểm tập trung bộ nhớ tiêu thụ đó sẽ không bị thu gom như rác.

Để tìm ra rò rỉ bộ nhớ, tôi đã lấy hai tệp dump heap, khoảng thời gian giữa hai tệp là một ngày (vì bộ nhớ chỉ tăng nhẹ, nên khó phát hiện vấn đề trong thời gian ngắn). So sánh các đối tượng trong hai tệp, thông qua kết quả so sánh, bạn có thể dễ dàng xác định vị trí rò rỉ bộ nhớ.

MAT mở cùng lúc hai tệp dump heap, mở Histogram cho từng tệp, như hình dưới đây. Trong hình dưới, nút 1 hình chữ nhật được sử dụng để so sánh hai Histogram, sau khi so sánh, chọn Group By package tại nút 2, sau đó so sánh sự thay đổi của các đối tượng. Không khó để nhận thấy rằng heap3.hprof thiếu 64 đối tượng eventInfo so với heap6.hprof, nếu bạn quen với mã nguồn, kết quả như vậy có thể cung cấp một số gợi ý cho lập trình viên. Tôi đã tìm thấy vị trí rò rỉ bộ nhớ cuối cùng dựa trên gợi ý này.  
![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20160223203226362)

## JProfiler

[JProfiler](https://www.ej-technologies.com/products/jprofiler/overview.html) là một công cụ phân tích hiệu suất.

Vì nó là một công cụ trả phí, nên tôi ít sử dụng. Tuy nhiên, nó thực sự mạnh mẽ, dễ sử dụng và có thể tích hợp với Intellij Idea.

## Arthas

[Arthas](https://github.com/alibaba/arthas) là một công cụ chẩn đoán Java mã nguồn mở do Alibaba phát triển, được yêu thích bởi các nhà phát triển. Nó cho phép chẩn đoán vấn đề trực tuyến mà không cần khởi động lại ứng dụng; theo dõi mã nguồn Java một cách động; giám sát trạng thái JVM theo thời gian thực.

Arthas hỗ trợ JDK 6+ và có thể chạy trên Linux/Mac/Windows. Nó sử dụng giao diện dòng lệnh và cung cấp tính năng tự động hoàn thành lệnh `Tab` để dễ dàng xác định và chẩn đoán vấn đề.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200730145030.png)
