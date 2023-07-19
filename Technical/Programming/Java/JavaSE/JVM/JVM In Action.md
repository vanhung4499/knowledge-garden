---
title: JVM In Action
tags: [java, javase, jvm]
categories: [java, javase, jvm]
date created: 2023-07-19
date modified: 2023-07-19
---

# JVM Thực hành

## Tổng quan về Tinh chỉnh JVM

### Các chỉ số hiệu suất GC

Trong quá trình tinh chỉnh JVM, cần xác định mục tiêu tinh chỉnh trước. Từ góc độ hiệu suất, thường quan tâm đến ba chỉ số sau:

- `Thông lượng (throughput)` - Đây là chỉ số hiệu suất cao nhất mà bộ thu gom rác có thể hỗ trợ cho ứng dụng mà không tính đến thời gian tạm dừng hoặc tiêu thụ bộ nhớ.
- `Thời gian tạm dừng (latency)` - Đây là thước đo để rút ngắn thời gian tạm dừng do thu gom rác gây ra hoặc loại bỏ hoàn toàn thời gian tạm dừng do thu gom rác, từ đó tránh rung lắc khi ứng dụng đang chạy.
- `Tần suất thu gom rác` - Bao lâu một lần thu gom rác xảy ra? Thường thì tần suất thu gom rác càng thấp càng tốt, tuy nhiên, tăng kích thước bộ nhớ heap có thể giảm tần suất thu gom rác nhưng đồng thời cũng tăng số lượng đối tượng cần thu gom, dẫn đến tăng thời gian tạm dừng. Do đó, chỉ cần tăng kích thước bộ nhớ heap một cách phù hợp để đảm bảo tần suất thu gom rác bình thường là đủ.

Trong hầu hết các trường hợp, tinh chỉnh sẽ tập trung vào một hoặc hai mục tiêu, hiếm khi có thể đạt được cả ba mục tiêu từ các góc nhìn khác nhau.

### Nguyên tắc tinh chỉnh

Có hai mục tiêu tối ưu hóa GC:

- **Giảm tần suất Full GC**
- **Giảm thời gian thực hiện Full GC**

Nguyên tắc cơ bản của tinh chỉnh GC là: áp dụng các tham số GC khác nhau cho hai máy chủ trở lên, sau đó so sánh hiệu suất của chúng và áp dụng các tham số đã được chứng minh có thể cải thiện hiệu suất hoặc giảm thời gian thực hiện GC cho máy chủ làm việc cuối cùng.

#### Giảm tần suất Minor GC

Nếu không gian thế hệ trẻ nhỏ, khu vực Eden nhanh chóng bị lấp đầy, dẫn đến tần suất Minor GC thường xuyên. Do đó, bạn có thể giảm tần suất Minor GC bằng cách tăng kích thước không gian thế hệ trẻ.

Có thể bạn sẽ có câu hỏi: Nếu mở rộng khu vực Eden, liệu thời gian một lần Minor GC có tăng lên không? Nếu thời gian một lần Minor GC tăng lên, thì khó có thể đạt được hiệu quả tối ưu mà chúng ta mong đợi.

Chúng ta biết rằng thời gian một lần Minor GC bao gồm hai phần: T1 (quét thế hệ trẻ) và T2 (sao chép các đối tượng sống). Giả sử một đối tượng sống trong khu vực Eden trong 500ms và thời gian giữa các lần Minor GC là 300ms, thì thời gian một lần Minor GC là: T1 + T2.

Khi chúng ta mở rộng không gian thế hệ trẻ, thời gian giữa các lần Minor GC có thể mở rộng lên 600ms, điều này có nghĩa là một đối tượng sống trong 500ms sẽ bị thu gom trong khu vực Eden, không còn đối tượng sống để sao chép, do đó thời gian cho lần Minor GC tiếp theo là: hai lần quét thế hệ trẻ, tức là 2T1.

Như vậy, việc mở rộng không gian thế hệ trẻ sẽ tăng thời gian T1, nhưng giảm thời gian T2. Thông thường, trong máy ảo Java, chi phí sao chép đối tượng cao hơn chi phí quét.

Nếu có nhiều đối tượng sống ngắn hạn trong bộ nhớ heap, việc mở rộng không gian thế hệ trẻ sẽ không làm tăng đáng kể thời gian một lần Minor GC. Do đó, thời gian một lần Minor GC phụ thuộc nhiều vào số lượng đối tượng sống sau GC, chứ không phải kích thước của khu vực Eden.

#### Giảm tần suất Full GC

So với Minor GC, Full GC tốn nhiều thời gian hơn. Giảm số lượng đối tượng vào thế hệ già có thể giảm đáng kể tần suất Full GC.

**Giảm số lượng đối tượng lớn:** Nếu một đối tượng chiếm nhiều bộ nhớ, sau khi được tạo trong khu vực Eden, nó sẽ được chuyển trực tiếp vào thế hệ già. Trong các kịch bản kinh doanh thông thường, chúng ta thường lấy một đối tượng lớn từ cơ sở dữ liệu để hiển thị trên giao diện web. Ví dụ, tôi đã gặp một trường hợp nơi một hoạt động kinh doanh truy vấn cùng lúc 60 trường dữ liệu, đối tượng lớn như vậy nếu vượt quá ngưỡng đối tượng lớn tối đa của thế hệ trẻ, sẽ được tạo trực tiếp trong thế hệ già; ngay cả khi nó được tạo trong thế hệ trẻ, do không gian thế hệ trẻ có giới hạn, sau khi trải qua Minor GC, nó cũng sẽ được chuyển vào thế hệ già. Điều này dễ dẫn đến tình trạng Full GC nhiều.

Chúng ta có thể tách đối tượng lớn này ra, chỉ truy vấn các trường quan trọng ban đầu, nếu cần xem các trường khác để hỗ trợ, thực hiện truy vấn thứ hai để hiển thị các trường còn lại.

**Mở rộng không gian heap:** Trong trường hợp không đủ bộ nhớ heap, việc mở rộng không gian heap và đặt kích thước heap khởi tạo là kích thước heap tối đa cũng có thể giảm tần suất Full GC.

#### Giảm thời gian thực hiện Full GC

Thời gian thực hiện Full GC dài hơn nhiều so với Minor GC. Do đó, nếu thời gian thực hiện Full GC quá lâu (hơn 1 giây), có thể gây ra lỗi vượt quá thời gian chờ.

- Nếu **giảm kích thước thế hệ già để giảm thời gian thực hiện Full GC**, có thể gây ra lỗi `OutOfMemoryError` hoặc làm tăng tần suất Full GC.
- Ngoài ra, nếu **tăng kích thước thế hệ già để giảm tần suất Full GC**, thời gian thực hiện Full GC có thể tăng.

Do đó, bạn cần đặt kích thước thế hệ già thành một giá trị "phù hợp".

**Các tham số JVM cần xem xét trong tinh chỉnh GC**

| **Loại**         | **Tham số**         | **Mô tả**                      |
| ---------------- | ------------------- | ------------------------------ |
| Kích thước heap  | `-Xms`              | Kích thước heap khi khởi động  |
|                  | `-Xmx`              | Giới hạn kích thước heap        |
| Kích thước thế hệ trẻ | `-XX:NewRatio`      | Tỷ lệ kích thước thế hệ trẻ và thế hệ già |
|                  | `-XX:NewSize`       | Kích thước thế hệ trẻ           |
|                  | `-XX:SurvivorRatio` | Tỷ lệ kích thước Eden và Survivor |

Các tham số phổ biến nhất trong tinh chỉnh GC là `-Xms`, `-Xmx` và `-XX:NewRatio`. Thông thường, `-Xms` và `-Xmx` là bắt buộc, vì vậy giá trị của `NewRatio` sẽ ảnh hưởng đáng kể đến hiệu suất GC.

Có thể bạn sẽ hỏi **làm thế nào để đặt kích thước của Permanent Generation**. Bạn có thể sử dụng các tham số `-XX:PermSize` và `-XX:MaxPermSize` để đặt kích thước của Permanent Generation, nhưng hãy nhớ chỉ đặt kích thước Permanent Generation khi gặp lỗi `OutOfMemoryError`.

### Quá trình tinh chỉnh GC

Quá trình tinh chỉnh GC có thể được chia thành các bước sau:

#### (1) Giám sát trạng thái GC

Bạn cần giám sát trạng thái GC để kiểm tra các trạng thái GC đang chạy trong hệ thống.

#### (2) Phân tích nhật ký GC

Sau khi kiểm tra trạng thái GC, bạn cần phân tích dữ liệu giám sát và quyết định xem có cần tinh chỉnh GC hay không. Nếu kết quả phân tích cho thấy thời gian chạy GC chỉ từ 0,1 đến 0,3 giây, thì không cần tốn thời gian tinh chỉnh GC, nhưng nếu thời gian chạy GC là từ 1 đến 3 giây, thậm chí lớn hơn 10 giây, thì tinh chỉnh GC là cần thiết.

Tuy nhiên, nếu bạn đã cấp phát khoảng 10GB bộ nhớ cho Java và không thể tiết kiệm bộ nhớ này, thì bạn không thể tinh chỉnh GC. Trước khi tinh chỉnh GC, bạn cần xem xét lý do tại sao bạn cần cấp phát nhiều bộ nhớ này. Nếu bạn cấp phát 1GB hoặc 2GB bộ nhớ và gặp lỗi `OutOfMemoryError`, thì bạn nên thực hiện **bộ nhớ heap (heap dump)** để xác định nguyên nhân gây ra lỗi.

> 🔔 Lưu ý:

> **Bộ nhớ heap (heap dump)** là một tệp dùng để kiểm tra các đối tượng và dữ liệu trong bộ nhớ Java. Tệp này có thể được tạo bằng cách chạy lệnh `jmap` trong JDK. Trong quá trình tạo tệp, tất cả các chương trình Java sẽ tạm dừng, vì vậy không nên tạo tệp trong quá trình chạy của hệ thống.

> Bạn có thể tìm hiểu chi tiết về bộ nhớ heap trên Internet.

#### (3) Chọn bộ thu gom rác phù hợp

Nếu quyết định tinh chỉnh GC, bạn cần chọn một bộ thu gom rác và đặt các tham số JVM phù hợp cho nó. Nếu bạn có nhiều máy chủ, hãy đặt các tham số GC khác nhau trên mỗi máy chủ và so sánh hiệu suất của chúng.

#### (4) Phân tích kết quả

Sau khi đặt các tham số GC, bạn có thể bắt đầu thu thập dữ liệu và phân tích kết quả. Hãy phân tích ít nhất 24 giờ dữ liệu trước khi tiến hành phân tích kết quả. Nếu bạn may mắn đủ, bạn có thể tìm thấy các tham số GC tốt nhất cho hệ thống của mình. Nếu không, bạn cần phân tích các nhật ký đầu ra và kiểm tra việc phân bổ bộ nhớ, sau đó điều chỉnh loại GC/kích thước bộ nhớ để tìm ra các tham số tốt nhất cho hệ thống của bạn.

#### (5) Áp dụng cấu hình tối ưu

Nếu kết quả tinh chỉnh GC làm bạn hài lòng, bạn có thể áp dụng các tham số cho tất cả các máy chủ và kết thúc quá trình tinh chỉnh GC.

Trong các phần tiếp theo, bạn sẽ thấy các công việc cụ thể được thực hiện trong từng bước trên.

## Nhật ký GC

### Lấy nhật ký GC

Có hai cách để lấy nhật ký GC:

- Sử dụng lệnh `jstat` để xem động
- Đặt các tham số liên quan để in nhật ký GC trong container

#### Xem GC bằng lệnh jstat

`jstat -gc` thống kê hành vi của bộ thu gom rác:

```java
jstat -gc 1262
 S0C    S1C     S0U     S1U   EC       EU        OC         OU        PC       PU         YGC    YGCT    FGC    FGCT     GCT
26112.0 24064.0 6562.5  0.0   564224.0 76274.5   434176.0   388518.3  524288.0 42724.7    320    6.417   1      0.398    6.815
```

Bạn cũng có thể đặt một khoảng thời gian cố định để in:

```shell
jstat -gc 1262 2000 20
```

Lệnh này có nghĩa là in thông tin gc của 1262 mỗi 2000ms, tổng cộng in 20 lần.

#### Đặt tham số in GC

Trước khi chạy JVM, bạn có thể đặt các tham số để in nhật ký GC. Thông thường có các cách sau để đặt các tham số JVM:

```
-XX:+PrintGC In nhật ký GC
-XX:+PrintGCDetails In nhật ký chi tiết GC
-XX:+PrintGCTimeStamps In nhật ký thời gian GC (dưới dạng dấu thời gian cơ sở)
-XX:+PrintGCDateStamps In nhật ký thời gian GC (dưới dạng ngày tháng, ví dụ 2013-05-04T21:53:59.234+0800)
-XX:+PrintHeapAtGC In thông tin heap trước và sau khi GC
-verbose:gc -Xloggc:../logs/gc.log Đường dẫn đến tệp nhật ký
```

Nếu nhật ký GC kéo dài trong thời gian dài, chúng ta khó có thể xem xét hiệu suất GC tổng thể dưới dạng văn bản. Trong trường hợp này, chúng ta có thể sử dụng công cụ [GCView](https://sourceforge.net/projects/gcviewer/) để mở tệp nhật ký và xem hiệu suất GC tổng thể dưới giao diện đồ họa.

【Ví dụ】Cài đặt Tomcat

```shell
JAVA_OPTS="-server -Xms2000m -Xmx2000m -Xmn800m -XX:PermSize=64m -XX:MaxPermSize=256m -XX:SurvivorRatio=4
-verbose:gc -Xloggc:$CATALINA_HOME/logs/gc.log
-Djava.awt.headless=true
-XX:+PrintGCTimeStamps -XX:+PrintGCDetails
-Dsun.rmi.dgc.server.gcInterval=600000 -Dsun.rmi.dgc.client.gcInterval=600000
-XX:+UseConcMarkSweepGC -XX:MaxTenuringThreshold=15"
```

- `-Xms2000m -Xmx2000m -Xmn800m -XX:PermSize=64m -XX:MaxPermSize=256m`  
  Xms là kích thước heap ban đầu của JVM khi khởi động, Xmx là kích thước heap tối đa của JVM, xmn là kích thước của thế hệ trẻ, permsize là kích thước ban đầu của permgen, MaxPermSize là kích thước tối đa của permgen.
- `-XX:SurvivorRatio=4`  
  SurvivorRatio là tỷ lệ kích thước của khu vực Eden và khu vực Survivor trong không gian mới, mặc định là 8, tức là tỷ lệ giữa hai khu vực Survivor và một khu vực Eden là 2: 8, một khu vực Survivor chiếm 1/10 của không gian trẻ. Giảm tham số này sẽ làm tăng kích thước khu vực survivor, giúp đối tượng ở lại khu vực survivor lâu hơn, giảm số lượng đối tượng vào thế hệ già. Ý tưởng của việc loại bỏ khu vực survivor là để đưa nhanh chóng các dữ liệu không thể thu gom được vào thế hệ già, tăng tần suất thu gom của thế hệ già, giảm khả năng thế hệ già bùng nổ, điều này được thực hiện bằng cách đặt -XX:SurvivorRatio thành một giá trị lớn (ví dụ: 65536).
- `-verbose:gc -Xloggc:$CATALINA_HOME/logs/gc.log`  
  Ghi thông tin về mỗi lần thu gom rác của máy ảo vào tệp nhật ký, tên tệp được chỉ định bởi file, định dạng tệp là tệp phẳng, nội dung giống với -verbose:gc.
- `-Djava.awt.headless=true` Chế độ Headless là một chế độ cấu hình của hệ thống. Trong chế độ này, hệ thống thiếu thiết bị hiển thị, bàn phím hoặc chuột.
- `-XX:+PrintGCTimeStamps -XX:+PrintGCDetails`  
  Đặt định dạng nhật ký GC
- `-Dsun.rmi.dgc.server.gcInterval=600000 -Dsun.rmi.dgc.client.gcInterval=600000`  
  Xác định khoảng thời gian gc khi gọi rmi
- `-XX:+UseConcMarkSweepGC -XX:MaxTenuringThreshold=15` Sử dụng cách thu gom song song, sau 15 lần gc nhỏ, nó sẽ vào thế hệ già

### Phân tích nhật ký GC

Nhật ký GC trẻ:

```java
2016-07-05T10:43:18.093+0800: 25.395: [GC [PSYoungGen: 274931K->10738K(274944K)] 371093K->147186K(450048K), 0.0668480 secs] [Times: user=0.17 sys=0.08, real=0.07 secs]
```

Nhật ký GC đầy đủ:

```java
2016-07-05T10:43:18.160+0800: 25.462: [Full GC [PSYoungGen: 10738K->0K(274944K)] [ParOldGen: 136447K->140379K(302592K)] 147186K->140379K(577536K) [PSPermGen: 85411K->85376K(171008K)], 0.6763541 secs] [Times: user=1.75 sys=0.02, real=0.68 secs]
```

Dựa trên nhật ký trên, PSYoungGen, ParOldGen, PSPermGen thuộc bộ thu gom song song. Trong đó, PSYoungGen biểu thị sự thay đổi bộ nhớ trẻ trước và sau khi gc; ParOldGen biểu thị sự thay đổi bộ nhớ già trước và sau khi gc; PSPermGen biểu thị sự thay đổi bộ nhớ vĩnh viễn trước và sau khi gc. gc trẻ chủ yếu là để thu gom bộ nhớ trẻ, thời gian hoạt động ngắn; full gc sẽ thu gom toàn bộ bộ nhớ heap, thời gian hoạt động lâu, vì vậy thường cố gắng giảm số lần full gc.

Dựa trên hai biểu đồ trên, rõ ràng thấy nhật ký gc được tạo thành bởi:

GC trẻ

![img](https://raw.githubusercontent.com/dunwu/images/dev/snap/20220107093538.jfif)

Full GC

![img](https://raw.githubusercontent.com/dunwu/images/dev/snap/20220107093543.jfif)

#### CPU cao

Bước xác định:

(1) Chạy lệnh top -c, tìm id của tiến trình có CPU cao nhất

(2) Xuất thông tin stack của ứng dụng Java bằng lệnh jstack PID.

Ví dụ:

```java
jstack 6795

"Low Memory Detector" daemon prio=10 tid=0x081465f8 nid=0x7 runnable [0x00000000..0x00000000]
        "CompilerThread0" daemon prio=10 tid=0x08143c58 nid=0x6 waiting on condition [0x00000000..0xfb5fd798]
        "Signal Dispatcher" daemon prio=10 tid=0x08142f08 nid=0x5 waiting on condition [0x00000000..0x00000000]
        "Finalizer" daemon prio=10 tid=0x08137ca0 nid=0x4 in Object.wait() [0xfbeed000..0xfbeeddb8]

        at java.lang.Object.wait(Native Method)

        - waiting on <0xef600848> (a java.lang.ref.ReferenceQueue$Lock)

        at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:116)

        - locked <0xef600848> (a java.lang.ref.ReferenceQueue$Lock)

        at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:132)

        at java.lang.ref.Finalizer$FinalizerThread.run(Finalizer.java:159)

        "Reference Handler" daemon prio=10 tid=0x081370f0 nid=0x3 in Object.wait() [0xfbf4a000..0xfbf4aa38]

        at java.lang.Object.wait(Native Method)

        - waiting on <0xef600758> (a java.lang.ref.Reference$Lock)

        at java.lang.Object.wait(Object.java:474)

        at java.lang.ref.Reference$ReferenceHandler.run(Reference.java:116)

        - locked <0xef600758> (a java.lang.ref.Reference$Lock)

        "VM Thread" prio=10 tid=0x08134878 nid=0x2 runnable

        "VM Periodic Task Thread" prio=10 tid=0x08147768 nid=0x8 waiting on condition
```

Trong tệp nhật ký stack được in, tid và nid có ý nghĩa như sau:

```
nid: số hiệu luồng Linux tương ứng (tid) trong hệ điều hành Linux, tức là số thập lục phân được chuyển đổi từ số thập lục phân trước đó
tid: Đây nên là địa chỉ duy nhất trong quy tắc bộ nhớ jmm của jvm
```

Trong trường hợp CPU cao, tìm luồng tương ứng, thường được xác định bằng nid. Và nếu xảy ra vấn đề như deadlock, thường sử dụng tid để xác định.

(3) In nid của luồng CPU cao

Lệnh để xem thông tin tiến trình cụ thể của luồng như sau:

top -H -p 6735

```java
top - 14:20:09 up 611 days,  2:56,  1 user,  load average: 13.19, 7.76, 7.82
Threads: 6991 total,  17 running, 6974 sleeping,   0 stopped,   0 zombie
%Cpu(s): 90.4 us,  2.1 sy,  0.0 ni,  7.0 id,  0.0 wa,  0.0 hi,  0.4 si,  0.0 st
KiB Mem:  32783044 total, 32505008 used,   278036 free,   120304 buffers
KiB Swap:        0 total,        0 used,        0 free. 4497428 cached Mem

  PID USER      PR  NI    VIRT    RES    SHR S %CPU %MEM     TIME+ COMMAND
 6800 root      20   0 27.299g 0.021t   7172 S 54.7 70.1 187:55.61 java
 6803 root      20   0 27.299g 0.021t   7172 S 54.4 70.1 187:52.59 java
 6798 root      20   0 27.299g 0.021t   7172 S 53.7 70.1 187:55.08 java
 6801 root      20   0 27.299g 0.021t   7172 S 53.7 70.1 187:55.25 java
 6797 root      20   0 27.299g 0.021t   7172 S 53.1 70.1 187:52.78 java
 6804 root      20   0 27.299g 0.021t   7172 S 53.1 70.1 187:55.76 java
 6802 root      20   0 27.299g 0.021t   7172 S 52.1 70.1 187:54.79 java
 6799 root      20   0 27.299g 0.021t   7172 S 51.8 70.1 187:53.36 java
 6807 root      20   0 27.299g 0.021t   7172 S 13.6 70.1  48:58.60 java
11014 root      20   0 27.299g 0.021t   7172 R  8.4 70.1   8:00.32 java
10642 root      20   0 27.299g 0.021t   7172 R  6.5 70.1   6:32.06 java
 6808 root      20   0 27.299g 0.021t   7172 S  6.1 70.1 159:08.40 java
11315 root      20   0 27.299g 0.021t   7172 S  3.9 70.1   5:54.10 java
12545 root      20   0 27.299g 0.021t   7172 S  3.9 70.1   6:55.48 java
23353 root      20   0 27.299g 0.021t   7172 S  3.9 70.1   2:20.55 java
24868 root      20   0 27.299g 0.021t   7172 S  3.9 70.1   2:12.46 java
 9146 root      20   0 27.299g 0.021t   7172 S  3.6 70.1   7:42.72 java
```

Có thể thấy luồng chiếm CPU cao, nhưng chúng không cao lắm, không thể trực tiếp xác định lớp cụ thể. nid là số thập lục phân, vì vậy chúng ta cần lấy ID thập lục phân của luồng:

```
printf "%x\n" 6800
```

```
Kết quả đầu ra:45cd
```

Sau đó, tìm vị trí của nid trong nhật ký stack được in:

```java
"catalina-exec-5692" daemon prio=10 tid=0x00007f3b05013800 nid=0x45cd waiting on condition [0x00007f3ae08e3000]
   java.lang.Thread.State: TIMED_WAITING (parking)
        at sun.misc.Unsafe.park(Native Method)
        - parking to wait for  <0x00000006a7800598> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
        at java.util.concurrent.locks.LockSupport.parkNanos(LockSupport.java:226)
        at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.awaitNanos(AbstractQueuedSynchronizer.java:2082)
        at java.util.concurrent.LinkedBlockingQueue.poll(LinkedBlockingQueue.java:467)
        at org.apache.tomcat.util.threads.TaskQueue.poll(TaskQueue.java:86)
        at org.apache.tomcat.util.threads.TaskQueue.poll(TaskQueue.java:32)
        at java.util.concurrent.ThreadPoolExecutor.getTask(ThreadPoolExecutor.java:1068)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1130)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:615)
        at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
        at java.lang.Thread.run(Thread.java:745)
```

## Cấu hình GC

> Vui lòng tham khảo tài liệu chính thức để biết chi tiết các tham số: [JavaHotSpot VM Options](http://www.oracle.com/technetwork/java/javase/tech/vmoptions-jsp-140102.html). Ở đây chỉ liệt kê các tham số thông dụng.

### Cấu hình kích thước Heap

**Cấu hình cho phần Young Generation rất quan trọng.**

Có ba giới hạn về kích thước Heap trong JVM:

1. Giới hạn của kiểu dữ liệu của hệ điều hành liên quan (32-bit hay 64-bit).
2. Giới hạn của bộ nhớ ảo có sẵn trong hệ thống.
3. Giới hạn của bộ nhớ vật lý có sẵn trong hệ thống.

```
Tổng kích thước Heap = Kích thước Young Generation + Kích thước Old Generation + Kích thước Permanent Generation
```

- Thường thì Permanent Generation có kích thước cố định là `64m`. Có thể cấu hình bằng `-XX:PermSize`.
- Thường thì Young Generation chiếm 3/8 tổng kích thước Heap. Có thể cấu hình bằng `-Xmn`.

### Cấu hình bộ nhớ JVM

| Cấu hình            | Mô tả                                                                 |
| ------------------- | --------------------------------------------------------------------- |
| `-Xss`              | Kích thước Stack của JVM.                                               |
| `-Xms`              | Giá trị khởi tạo kích thước Heap.                                       |
| `-Xmx`              | Giá trị tối đa của kích thước Heap.                                      |
| `-Xmn`              | Kích thước Young Generation.                                            |
| `-XX:NewSize`       | Giá trị khởi tạo kích thước Young Generation.                           |
| `-XX:MaxNewSize`    | Giá trị tối đa của kích thước Young Generation.                          |
| `-XX:NewRatio`      | Tỷ lệ giữa Young Generation và Old Generation. Mặc định là 2.            |
| `-XX:SurvivorRatio` | Tỷ lệ giữa Eden Space và Survivor Space trong Young Generation. Mặc định là 8. |
| `-XX:PermSize`      | Giá trị khởi tạo kích thước Permanent Generation.                       |
| `-XX:MaxPermSize`   | Giá trị tối đa của kích thước Permanent Generation.                      |

### Cấu hình GC

| Cấu hình                        | Mô tả                                                                                          |
| ------------------------------- | ---------------------------------------------------------------------------------------------- |
| `-XX:+UseSerialGC`              | Sử dụng Serial + Serial Old garbage collector.                                                 |
| `-XX:+UseParallelGC`            | Sử dụng Parallel Scavenge + Parallel Old garbage collector.                                    |
| ~~`-XX:+UseParallelOldGC`~~     | ~~Sử dụng Parallel Old garbage collector (không còn sử dụng từ JDK 5 trở đi)~~                  |
| `-XX:+UseParNewGC`              | Sử dụng ParNew + Serial Old garbage collector.                                                 |
| `-XX:+UseConcMarkSweepGC`       | Sử dụng CMS + ParNew + Serial Old garbage collector.                                           |
| `-XX:+UseG1GC`                  | Sử dụng G1 garbage collector.                                                                   |
| `-XX:ParallelCMSThreads`        | Số lượng luồng được sử dụng cho Concurrent Mark Sweep garbage collector.                        |

### Các tham số chung cho garbage collector

| Cấu hình                     | Mô tả                                                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------------------- |
| `PretenureSizeThreshold`     | Kích thước đối tượng được thăng cấp lên Old Generation. Mặc định là 0. Ví dụ: `-XX:PretenureSizeThreshold=10M` |
| `MaxTenuringThreshold`       | Tuổi tối đa để thăng cấp lên Old Generation. Mặc định là 15. Ví dụ: `-XX:MaxTenuringThreshold=10`         |
| `DisableExplicitGC`          | Vô hiệu hóa `System.gc()`                                                                             |

### JMX

Khi bật JMX, bạn có thể sử dụng `jconsole` hoặc `jvisualvm` để giám sát thông tin cơ bản và tình trạng chạy của chương trình Java.

```java
-Dcom.sun.management.jmxremote=true
-Dcom.sun.management.jmxremote.ssl=false
-Dcom.sun.management.jmxremote.authenticate=false
-Djava.rmi.server.hostname=127.0.0.1
-Dcom.sun.management.jmxremote.port=18888
```

`-Djava.rmi.server.hostname` chỉ định máy chủ chạy chương trình Java, `-Dcom.sun.management.jmxremote.port` chỉ định cổng lắng nghe dịch vụ.

### DEBUG từ xa

Nếu bật tính năng Debug từ xa cho ứng dụng Java, bạn cần chỉ định các tham số sau:

```java
-Xdebug
-Xnoagent
-Djava.compiler=NONE
-Xrunjdwp:transport=dt_socket,address=28888,server=y,suspend=n
```

address là cổng lắng nghe Debug từ xa.

### HeapDump

```java
-XX:-OmitStackTraceInFastThrow -XX:+HeapDumpOnOutOfMemoryError
```

### Cấu hình phụ trợ

| Cấu hình                              | Mô tả                                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------------------------ |
| `-XX:+PrintGCDetails`                 | In log của GC.                                                                             |
| `-Xloggc:<filename>`                  | Chỉ định tên tệp log GC.                                                                   |
| `-XX:+HeapDumpOnOutOfMemoryError`      | Tạo Heap Dump khi gặp lỗi OutOfMemoryError.                                                |
| `-XX:HeapDumpPath=<path>`              | Chỉ định đường dẫn lưu Heap Dump.                                                           |
| `-XX:+PrintCommandLineFlags`           | In các cờ dòng lệnh JVM đã được sử dụng.                                                    |
| `-XX:+PrintFlagsFinal`                 | In các cờ JVM cuối cùng đã được sử dụng.                                                    |
| `-XX:+PrintCompilation`                | In thông tin về quá trình biên dịch JIT.                                                    |
| `-XX:+PrintGCApplicationStoppedTime`   | In thời gian dừng ứng dụng do GC.                                                           |
| `-XX:+PrintGCApplicationConcurrentTime`| In thời gian chạy ứng dụng trước và sau khi GC.                                             |
| `-XX:+PrintSafepointStatistics`        | In thống kê về Safepoint.                                                                  |
| `-XX:+PrintTenuringDistribution`       | In thông tin về phân phối tuổi của đối tượng trong Young Generation.                        |
| `-XX:+PrintAdaptiveSizePolicy`         | In thông tin về chính sách kích thước thích ứng của GC.                                      |
| `-XX:+PrintReferenceGC`                | In thông tin về việc thu gom rác của các tham chiếu.                                        |
| `-XX:+PrintStringDeduplicationStatistics` | In thông tin về thống kê chuỗi đã được giảm trùng.                                        |
| `-XX:+PrintCompilationStatistics`      | In thông tin về thống kê biên dịch.                                                         |
| `-XX:+PrintNMTStatistics`              | In thông tin về thống kê Native Memory Tracking.                                           |
| `-XX:+UnlockDiagnosticVMOptions`       | Mở khóa các tùy chọn chẩn đoán của JVM.                                                     |
| `-XX:+UnlockExperimentalVMOptions`     | Mở khóa các tùy chọn thử nghiệm của JVM.                                                    |
| `-XX:+UnlockCommercialFeatures`        | Mở khóa các tính năng thương mại của JVM.                                                   |
| `-XX:+UseLargePages`                   | Sử dụng trang lớn (large pages) cho bộ nhớ.                                                 |
| `-XX:+UseStringDeduplication`          | Sử dụng giảm trùng chuỗi (String Deduplication).                                            |
| `-XX:MaxJavaStackTraceDepth=<depth>`   | Giới hạn độ sâu của Stack Trace khi in log.                                                 |
| `-XX:OnError="<cmd>;<cmd>"`            | Chạy các lệnh khi gặp lỗi.                                                                  |
| `-XX:OnOutOfMemoryError="<cmd>;<cmd>"` | Chạy các lệnh khi gặp lỗi OutOfMemoryError.                                                 |
| `-XX:ErrorFile=<file>`                 | Chỉ định tệp để ghi thông tin lỗi.                                                          |
| `-XX:NativeMemoryTracking=<mode>`      | Bật chế độ theo dõi bộ nhớ Native. Các giá trị mode có thể là `summary`, `detail`, `summary+detail`. |
