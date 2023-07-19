---
title: JVM Command Line Tools
tags: [java, javase, jvm, cli]
categories: [java, javase, jvm]
date created: 2023-07-19
date modified: 2023-07-19
---

# Công cụ dòng lệnh JVM

> Những lập trình viên Java không thể tránh khỏi công việc sửa lỗi, vì vậy thường xuyên cần sử dụng một số công cụ JVM để giám sát và phân tích thông tin JVM. Hiểu và sử dụng các công cụ này sẽ rất hữu ích trong việc sửa lỗi.

Dưới đây là một số công cụ dòng lệnh JDK phổ biến:

| Tên      | Mô tả                                                                                                                    |
| -------- | ----------------------------------------------------------------------------------------------------------------------- |
| `jps`    | Công cụ trạng thái quá trình JVM. Hiển thị thông tin trạng thái của tất cả các quá trình JVM trong hệ thống.                 |
| `jstat`  | Công cụ giám sát thống kê JVM. Giám sát thông tin trạng thái của JVM, bao gồm tải lớp, bộ nhớ, GC, biên dịch JIT, v.v.       |
| `jmap`   | Công cụ phân tích bộ nhớ heap JVM. Sử dụng để in ra biểu đồ đối tượng JVM, thống kê tải lớp. Có thể tạo ra heapdump.        |
| `jstack` | Công cụ xem ngăn xếp JVM. Sử dụng để in ra thông tin luồng và khóa của quá trình JVM. Có thể tạo ra threaddump.             |
| `jhat`   | Sử dụng để phân tích tệp dump được tạo bởi jmap.                                                                         |
| `jinfo`  | Công cụ xem thông tin JVM. Sử dụng để xem và điều chỉnh các thông số quá trình JVM.                                      |
| `jcmd`   | Công cụ gỡ lỗi dòng lệnh JVM. Sử dụng để gửi lệnh gỡ lỗi cho quá trình JVM.                                                 |

## jps

> **[jps (JVM Process Status Tool)](https://docs.oracle.com/en/java/javase/11/tools/jps.html#GUID-6EB65B96-F9DD-4356-B825-6146E9EEC81E) là công cụ trạng thái quá trình JVM**. Nó hiển thị thông tin trạng thái của tất cả các quá trình JVM trong hệ thống. jps sử dụng giao thức RMI để truy vấn trạng thái của các quá trình JVM từ xa đã bật dịch vụ RMI.

### Cách sử dụng lệnh jps

```shell
jps [option] [hostid]
jps [-help]
```

Nếu không chỉ định hostid, nó sẽ mặc định là máy chủ hiện tại.

Các tùy chọn thông dụng:

- `option` - Tùy chọn để chỉ định thông tin quá trình JVM mà người dùng muốn truy vấn.
	- `-m` - Hiển thị các tham số được truyền cho phương thức main().
	- `-l` - Hiển thị tên đầy đủ của lớp chính và đường dẫn tới tệp jar nếu quá trình thực thi từ tệp jar.
	- `-v` - Hiển thị các tham số được truyền cho JVM.
	- `-q` - Chỉ hiển thị ID JVM cục bộ.
	- `-V` - Chỉ hiển thị định danh JVM cục bộ.
- `hostid` - Tên máy chủ đã đăng ký trong bảng đăng ký RMI. Nếu không chỉ định hostid, nó sẽ mặc định là máy chủ hiện tại.

Cả `option` và `hostid` đều có thể không cần thiết.

### Ví dụ sử dụng jps

【Ví dụ】Liệt kê các quá trình Java cục bộ

```shell
$ jps
18027 Java2Demo.JAR
18032 jps
18005 jstat
```

【Ví dụ】Liệt kê các ID quá trình Java cục bộ

```shell
$ jps -q
8841
1292
5398
```

【Ví dụ】Liệt kê các ID quá trình Java cục bộ và hiển thị tên đầy đủ của lớp chính và đường dẫn tới tệp jar nếu quá trình thực thi từ tệp jar

```shell
$ jps -l remote.domain
3002 /opt/jdk1.7.0/demo/jfc/Java2D/Java2Demo.JAR
2857 sun.tools.jstatd.jstatd
```

## jstat

> **[jstat (JVM statistics Monitoring)](https://docs.oracle.com/en/java/javase/11/tools/jstat.html) là công cụ giám sát thống kê JVM**. jstat được sử dụng để giám sát thông tin trạng thái của JVM, bao gồm tải lớp, bộ nhớ, thu gom rác, biên dịch JIT, v.v.

### Cách sử dụng lệnh jstat

Cú pháp lệnh:

```shell
jstat [option] VMID [interval] [count]
```

Các tùy chọn thông dụng:

- `option` - Tùy chọn để chỉ định thông tin JVM mà người dùng muốn truy vấn.
	- `-class` - Giám sát số lượng lớp đã tải, đã hủy, dung lượng tổng và thời gian tải lớp.
	- `-compiler` - Hiển thị thông tin biên dịch JIT.
	- `-gc` - Giám sát tình trạng heap Java, bao gồm dung lượng, dung lượng đã sử dụng, thời gian GC, v.v.
	- `-gccapacity` - Hiển thị dung lượng và sử dụng của các thế hệ.
	- `-gcmetacapacity` - Hiển thị kích thước Metaspace.
	- `-gcnew` - Hiển thị thông tin về thế hệ mới.
	- `-gcnewcapacity` - Hiển thị kích thước và sử dụng của thế hệ mới.
	- `-gcold` - Hiển thị thông tin về thế hệ cũ và thế hệ Permanent.
	- `-gcoldcapacity` - Hiển thị kích thước của thế hệ cũ.
	- `-gcutil` - Hiển thị thống kê thu gom rác.
	- `-gccause` - Hiển thị thông tin thu gom rác và nguyên nhân gây ra thu gom rác cuối cùng hoặc đang xảy ra.
	- `-printcompilation` - In thông tin về việc biên dịch JIT.
- `VMID` - Nếu quá trình JVM là cục bộ, VMID và LVMID sẽ giống nhau. Nếu quá trình JVM là từ xa, định dạng VMID phải là `[protocol:][//]lvmid[@hostname[:port]/servername]`.
- `interval` - Khoảng thời gian giữa các lần truy vấn.
- `count` - Số lần truy vấn.

> 【Tham khảo】Để biết thêm chi tiết, bạn có thể tham khảo tài liệu chính thức: [jstat](https://docs.oracle.com/en/java/javase/11/tools/jstat.html)

### Ví dụ sử dụng jstat

#### Thống kê tải lớp

Sử dụng lệnh `jstat -class pid` để xem thông tin thống kê tải lớp.

【Tham số】

- Loaded - Số lượng lớp đã tải
- Bytes - Dung lượng chiếm bởi lớp
- Unloaded - Số lượng lớp chưa tải
- Bytes - Dung lượng chiếm bởi lớp chưa tải
- Time - Thời gian

【Ví dụ】Xem thông tin tải lớp

```shell
$ jstat -class 7129
Loaded  Bytes  Unloaded  Bytes     Time
 26749 50405.3      873  1216.8      19.75
```

#### Thống kê biên dịch

Sử dụng lệnh `jstat -compiler pid` để xem thông tin thống kê biên dịch.

【Ví dụ】

```shell
$ jstat -compiler 7129
Compiled Failed Invalid   Time   FailedType FailedMethod
   42030      2       0   302.53          1 org/apache/felix/framework/BundleWiringImpl$BundleClassLoader findClass
```

【Tham số】

- Compiled - Số lượng phương thức đã được biên dịch
- Failed - Số lượng phương thức biên dịch thất bại
- Invalid - Số lượng phương thức không hợp lệ
- Time - Thời gian
- FailedType - Loại lỗi biên dịch
- FailedMethod - Phương thức gây ra lỗi biên dịch

#### Thống kê GC

Sử dụng lệnh `jstat -gc pid time` để xem thông tin thống kê GC.

【Ví dụ】Lấy mẫu 7 lần với khoảng thời gian là 250ms và hiển thị kết quả sử dụng `-gcutil` option.

```shell
$ jstat -gcutil 21891 250 7
  S0     S1     E      O      M     CCS    YGC     YGCT    FGC    FGCT     GCT
  0.00  97.02  70.31  66.80  95.52  89.14      7    0.300     0    0.000    0.300
  0.00  97.02  86.23  66.80  95.52  89.14      7    0.300     0    0.000    0.300
  0.00  97.02  96.53  66.80  95.52  89.14      7    0.300     0    0.000    0.300
 91.03   0.00   1.98  68.19  95.89  91.24      8    0.378     0    0.000    0.378
 91.03   0.00  15.82  68.19  95.89  91.24      8    0.378     0    0.000    0.378
 91.03   0.00  17.80  68.19  95.89  91.24      8    0.378     0    0.000    0.378
 91.03   0.00  17.80  68.19  95.89  91.24      8    0.378     0    0.000    0.378
```

【Ví dụ】Lấy mẫu 4 lần với khoảng thời gian là 1s và hiển thị kết quả sử dụng `-gc` option.

```shell
$ jstat -gc 25196 1s 4
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT
20928.0 20928.0  0.0    0.0   167936.0  8880.5   838912.0   80291.2   106668.0 100032.1 12772.0 11602.2    760   14.332  580   656.218  670.550
20928.0 20928.0  0.0    0.0   167936.0  8880.5   838912.0   80291.2   106668.0 100032.1 12772.0 11602.2    760   14.332  580   656.218  670.550
20928.0 20928.0  0.0    0.0   167936.0  8880.5   838912.0   80291.2   106668.0 100032.1 12772.0 11602.2    760   14.332  580   656.218  670.550
20928.0 20928.0  0.0    0.0   167936.0  8880.5   838912.0   80291.2   106668.0 100032.1 12772.0 11602.2    760   14.332  580   656.218  670.550
```

Giải thích các tham số:

- `S0C` - Dung lượng của Survivor Space 0 (KB)
- `S1C` - Dung lượng của Survivor Space 1 (KB)
- `S0U` - Dung lượng đã sử dụng của Survivor Space 0 (KB)
- `S1U` - Dung lượng đã sử dụng của Survivor Space 1 (KB)
- `EC` - Dung lượng của Eden Space (KB)
- `EU` - Dung lượng đã sử dụng của Eden Space (KB)
- `OC` - Dung lượng của Old Space (KB)
- `OU` - Dung lượng đã sử dụng của Old Space (KB)
- `MC` - Dung lượng của Metaspace (KB)
- `MU` - Dung lượng đã sử dụng của Metaspace (KB)
- `YGC` - Số lần thu gom rác trong thế hệ trẻ từ khi ứng dụng bắt đầu
- `YGCT` - Thời gian đã sử dụng để thu gom rác trong thế hệ trẻ (giây)
- `FGC` - Số lần thu gom rác trong thế hệ cũ và thế hệ Permanent từ khi ứng dụng bắt đầu
- `FGCT` - Thời gian đã sử dụng để thu gom rác trong thế hệ cũ và thế hệ Permanent (giây)
- `GCT` - Tổng thời gian đã sử dụng để thu gom rác (giây)

Chú ý: Bạn có thể xem chi tiết về các tham số tại địa chỉ sau: http://docs.oracle.com/javase/8/docs/technotes/tools/unix/jstat.html

## jmap

> **[jmap (JVM Memory Map)](https://docs.oracle.com/en/java/javase/11/tools/jmap.html) là công cụ ánh xạ bộ nhớ JVM**. jmap được sử dụng để tạo ra bản chụp heapdump (thường được gọi là heapdump hoặc tệp dump). jmap không chỉ tạo ra tệp dump, mà còn có thể truy vấn hàng đợi `finalize`, thông tin về Java heap và permanent generation, chẳng hạn như tỷ lệ sử dụng hiện tại, loại bộ sưu tập đang sử dụng, v.v.

### Cú pháp lệnh jmap

```shell
jmap [option] pid
```

Các tùy chọn `option`:

- `-dump` - Tạo ra bản chụp heapdump. `-dump:live` chỉ lưu trữ các đối tượng còn sống trong heap.
- `-finalizerinfo` - Hiển thị thông tin về các đối tượng đang chờ thực thi phương thức `finalize` trong hàng đợi F-Queue.
- `-heap` - Hiển thị thông tin chi tiết về Java heap.
- `-histo` - Hiển thị thống kê về số lượng đối tượng trong heap, bao gồm tên lớp, số lượng thể hiện và dung lượng tổng. `-histo:live` chỉ thống kê các đối tượng còn sống trong heap.
- `-permstat` - Hiển thị thống kê về permanent generation.
- `-F` - Khi `-dump` không phản hồi, buộc tạo ra bản chụp heapdump.

### Ví dụ sử dụng jmap

#### Tạo bản chụp heapdump

Tạo bản chụp heapdump vào tệp, định dạng được chỉ định bởi `format`, chỉ lưu trữ các đối tượng còn sống, tên tệp được chỉ định bởi `file`.

```shell
$ jmap -dump:live,format=b,file=dump.hprof 28920
Dumping heap to /home/xxx/dump.hprof ...
Heap dump file created
```

Đuôi tệp `dump.hprof` được sử dụng để sau này có thể mở trực tiếp bằng các công cụ như MAT (Memory Analysis Tool).

#### Xem lớp có số lượng thể hiện nhiều nhất

```shell
$ jmap -histo 29527 | head -n 6

 num     #instances         #bytes  class name
----------------------------------------------
   1:      13673280     1438961864  [C
   2:       1207166      411277184  [I
   3:       7382322      347307096  [Ljava.lang.Object;
```

#### Xem thông tin heap của quá trình cụ thể

Lưu ý: Trong trường hợp sử dụng CMS GC, việc thực thi `jmap -heap PID` có thể làm treo quá trình Java.

```shell
$ jmap -heap 12379
Attaching to process ID 12379, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 17.0-b16

using thread-local object allocation.
Parallel GC with 6 thread(s)

Heap Configuration:
   MinHeapFreeRatio = 40
   MaxHeapFreeRatio = 70
   MaxHeapSize      = 83886080 (80.0MB)
   NewSize          = 1310720 (1.25MB)
   MaxNewSize       = 17592186044415 MB
   OldSize          = 5439488 (5.1875MB)
   NewRatio         = 2
   SurvivorRatio    = 8
   PermSize         = 20971520 (20.0MB)
   MaxPermSize      = 88080384 (84.0MB)

Heap Usage:
PS Young Generation
Eden Space:
   capacity = 9306112 (8.875MB)
   used     = 5375360 (5.1263427734375MB)
   free     = 3930752 (3.7486572265625MB)
   57.761608714788736% used
From Space:
   capacity = 9306112 (8.875MB)
   used     = 3425240 (3.2665634155273438MB)
   free     = 5880872 (5.608436584472656MB)
   36.80634834397007% used
To Space:
   capacity = 9306112 (8.875MB)
   used     = 0 (0.0MB)
   free     = 9306112 (8.875MB)
   0.0% used
PS Old Generation
   capacity = 55967744 (53.375MB)
   used     = 48354640 (46.11457824707031MB)
   free     = 7613104 (7.2604217529296875MB)
   86.39733629427693% used
PS Perm Generation
   capacity = 62062592 (59.1875MB)
   used     = 60243112 (57.452308654785156MB)
   free     = 1819480 (1.7351913452148438MB)
   97.06831451706046% used
```

## jstack

> **[jstack (Stack Trace for Java)](https://docs.oracle.com/en/java/javase/11/tools/jstack.html) là một công cụ theo dõi ngăn xếp Java**. jstack được sử dụng để in ra các ngăn xếp của các luồng trong quá trình Java, cũng như các khóa mà các luồng này đang giữ, và có thể tạo ra một bản chụp nhanh của các luồng trong thời điểm hiện tại của máy ảo Java (thường được gọi là tệp threaddump hoặc javacore).

Mục đích chính của việc tạo bản chụp nhanh là để xác định nguyên nhân gây ra sự tắc nghẽn của các luồng trong quá trình thực thi, chẳng hạn như deadlock giữa các luồng, vòng lặp vô hạn, chờ đợi lâu dẹp do yêu cầu tài nguyên bên ngoài, v.v.

Thường thì `jstack` được sử dụng kết hợp với các lệnh như `top -Hp pid` hoặc `pidstat -p pid -t` để xem trạng thái cụ thể của từng luồng. Nó cũng thường được sử dụng để khắc phục các vấn đề liên quan đến deadlock.

Khi một luồng bị tắc nghẽn, việc sử dụng `jstack` để xem ngăn xếp gọi của từng luồng sẽ giúp bạn biết chính xác luồng không phản hồi đang làm gì ở nền, hoặc đang chờ tài nguyên gì. Nếu chương trình Java gặp sự cố và tạo ra tệp core, công cụ `jstack` có thể được sử dụng để lấy thông tin về ngăn xếp Java và ngăn xếp native của tệp core, từ đó dễ dàng biết được lý do gây ra sự cố và vị trí của vấn đề trong chương trình. Ngoài ra, công cụ `jstack` cũng có thể gắn kết vào một chương trình Java đang chạy để xem thông tin ngăn xếp Java và native của chương trình đang chạy. Nếu chương trình Java đang chạy hiện trạng treo, thì `jstack` sẽ rất hữu ích.

### Cú pháp lệnh jstack

Cú pháp lệnh:

```shell
jstack [option] pid
```

Các tùy chọn `option`:

- `-F` - Khi yêu cầu đầu ra bình thường không được đáp ứng, buộc đầu ra ngăn xếp của luồng.
- `-l` - Hiển thị thông tin bổ sung về khóa ngoại trừ ngăn xếp.
- `-m` - In tất cả thông tin ngăn xếp của khung Java và JNI.

### Tệp threaddump

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200730112431.png)

Một tệp threaddump có thể được chia thành năm phần.

#### Phần 1: Full thread dump identifier

Phần này là phần đầu tiên của nội dung, hiển thị thời gian tạo tệp threaddump và thông tin phiên bản JVM.

```
2017-10-19 10:46:44
Full thread dump Java HotSpot(TM) 64-Bit Server VM (24.79-b02 mixed mode):
```

#### Phần 2: Java EE middleware, third party & custom application Threads

Đây là phần trung tâm của toàn bộ tệp, hiển thị thông tin về các luồng được sử dụng trong các ứng dụng Java EE (như tomcat, resin, v.v.) và các ứng dụng tùy chỉnh.

```
"resin-22129" daemon prio=10 tid=0x00007fbe5c34e000 nid=0x4cb1 waiting on condition [0x00007fbe4ff7c000]
   java.lang.Thread.State: WAITING (parking)
    at sun.misc.Unsafe.park(Native Method)
    at java.util.concurrent.locks.LockSupport.park(LockSupport.java:315)
    at com.caucho.env.thread2.ResinThread2.park(ResinThread2.java:196)
    at com.caucho.env.thread2.ResinThread2.runTasks(ResinThread2.java:147)
    at com.caucho.env.thread2.ResinThread2.run(ResinThread2.java:118)
```

Giải thích các tham số:

- `"resin-22129"` **Tên luồng:** Nếu bạn tạo một luồng bằng cách sử dụng lớp `java.lang.Thread`, tên luồng sẽ có dạng Thread-(số), ở đây là luồng được tạo bởi resin.
- `daemon` **Loại luồng:** Luồng có thể là luồng bảo vệ (daemon) hoặc luồng không phải là luồng bảo vệ (non-daemon), thường là luồng bảo vệ.
- `prio=10` **Ưu tiên luồng:** Mặc định là 5, số càng lớn ưu tiên càng cao.
- `tid=0x00007fbe5c34e000` **ID luồng JVM:** Định danh duy nhất của luồng trong JVM, có thể lấy bằng cách sử dụng `java.lang.Thread.getId()`, thường được tăng tự động.
- `nid=0x4cb1` **ID luồng hệ thống:** Tương ứng với ID luồng hệ thống (Native Thread ID), có thể xem bằng lệnh `top`, ID luồng hiện trạng là dạng thập lục phân.
- `waiting on condition` **Trạng thái luồng hệ thống:** Đây là trạng thái của luồng hệ thống.
- `[0x00007fbe4ff7c000]` **Địa chỉ ngăn xếp bắt đầu:** Địa chỉ bắt đầu của ngăn xếp luồng gọi.
- `java.lang.Thread.State: WAITING (parking)` **Trạng thái luồng JVM:** Đây là trạng thái của luồng ở mức mã nguồn.
- **Thông tin ngăn xếp cuộc gọi của luồng:** Dưới đây là thông tin ngăn xếp cuộc gọi của luồng hiện tại, được sử dụng để phân tích mã nguồn. Thông tin ngăn xếp nên được đọc từ dưới lên, vì thứ tự gọi chương trình là từ dưới lên.

#### Phần 3: HotSpot VM Thread

Phần này hiển thị thông tin về các luồng hệ thống trong JVM, được sử dụng để thực hiện các hoạt động nội bộ. Dưới đây là một số luồng được sử dụng phổ biến:

##### "Attach Listener"

Luồng này được sử dụng để nhận lệnh từ bên ngoài, thực thi lệnh và trả kết quả cho người gọi. Thông thường xuất hiện trong các ứng dụng desktop.

```
"Attach Listener" daemon prio=5 tid=0x00007fc6b6800800 nid=0x3b07 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE
```

##### "DestroyJavaVM"

Luồng thực thi `main()` sẽ gọi phương thức `jni_DestroyJavaVM()` trong JNI, sau đó sẽ kích hoạt luồng "DestroyJavaVM" và chờ đợi thông báo từ các luồng khác (luồng Java và luồng native) để thông báo cho nó biết khi nào nó có thể gỡ bỏ JVM.

```
"DestroyJavaVM" prio=5 tid=0x00007fc6b3001000 nid=0x1903 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE
```

##### "Service Thread"

Luồng này được sử dụng để khởi động dịch vụ.

```
"Service Thread" daemon prio=10 tid=0x00007fbea81b3000 nid=0x5f2 runnable [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE
```

##### "CompilerThread"

Luồng này được sử dụng để gọi JITing, biên dịch và tải/xóa lớp. Thông thường JVM sẽ khởi động nhiều luồng để xử lý công việc này, số sau dấu # trong tên luồng cũng sẽ tăng dần, ví dụ như CompilerThread1.

```
"C2 CompilerThread1" daemon prio=10 tid=0x00007fbea814b000 nid=0x5f1 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C2 CompilerThread0" daemon prio=10 tid=0x00007fbea8142000 nid=0x5f0 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE
```

##### "Signal Dispatcher"

Nhiệm vụ của luồng Attach Listener là nhận lệnh JVM từ bên ngoài. Khi lệnh được nhận thành công, nó sẽ được chuyển đến luồng Signal Dispatcher để phân phối đến các module khác nhau để xử lý lệnh và trả về kết quả.

```
"Signal Dispatcher" daemon prio=10 tid=0x00007fbea81bf800 nid=0x5ef runnable [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE
```

##### "Finalizer"

Luồng này được sử dụng để gọi phương thức `finalize()` của đối tượng trước khi thu gom rác. Một số điểm quan trọng về luồng Finalizer:

- Chỉ khi một vòng thu gom rác bắt đầu, phương thức `finalize()` mới được gọi; do đó không phải tất cả các đối tượng đều được gọi phương thức `finalize()`;
- Luồng này cũng là một luồng bảo vệ, nghĩa là nếu không có luồng không phải là luồng bảo vệ khác trong JVM, JVM sẽ thoát mà không cần phải chờ đến khi luồng này hoàn thành phương thức `finalize()`;
- JVM trong quá trình thu gom rác sẽ đóng gói các đối tượng không còn tham chiếu thành đối tượng Finalizer (thực hiện bằng cách triển khai Reference của Java), và đưa vào ReferenceQueue để luồng Finalizer xử lý; cuối cùng, luồng này sẽ đặt tham chiếu của đối tượng là null để thu gom rác có thể thu hồi.

```
"Finalizer" daemon prio=10 tid=0x00007fbea80da000 nid=0x5eb in Object.wait() [0x00007fbeac044000]
   java.lang.Thread.State: WAITING (on object monitor)
    at java.lang.Object.wait(Native Method)
    at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:135)
    - locked <0x00000006d173c1a8> (a java.lang.ref.ReferenceQueue$Lock)
    at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:151)
    at java.lang.ref.Finalizer$FinalizerThread.run(Finalizer.java:209)
```

##### "Reference Handler"

JVM sẽ tạo luồng Reference Handler ngay sau khi tạo luồng chính, ưu tiên của nó là 10, nó chủ yếu được sử dụng để xử lý việc thu hồi các đối tượng tham chiếu (soft reference, weak reference, phantom reference) của chính nó.

```
"Reference Handler" daemon prio=10 tid=0x00007fbea80d8000 nid=0x5ea in Object.wait() [0x00007fbeac085000]
   java.lang.Thread.State: WAITING (on object monitor)
    at java.lang.Object.wait(Native Method)
    at java.lang.Object.wait(Object.java:503)
    at java.lang.ref.Reference$ReferenceHandler.run(Reference.java:133)
    - locked <0x00000006d173c1f0> (a java.lang.ref.Reference$Lock)
```

##### "VM Thread"

Đây là luồng gốc của JVM, theo chú thích trong tệp vmThread.hpp, đây là một đối tượng duy nhất (luồng gốc) mà tất cả các luồng khác sẽ sử dụng để thực hiện một số hoạt động của JVM (như làm sạch rác, v.v.). Trong cấu trúc của luồng VM, có một hàng đợi VMOperationQueue, tất cả các hoạt động VM (vm_operation) sẽ được lưu trữ trong hàng đợi này, luồng VMThread chính nó là một luồng, nhiệm vụ của nó là thực hiện một vòng lặp tự lặp (cụ thể có thể tham khảo void VMThread::loop() trong VMThread.cpp), hàm loop() lấy các hoạt động VM (VM_Operation) hiện tại từ hàng đợi VMOperationQueue theo độ ưu tiên và gọi hàm evaluate() của nó để thực hiện logic kinh doanh của loại hoạt động đó.  
Các loại hoạt động VM được xác định trong vm_operations.hpp, ví dụ: ThreadStop, ThreadDump, PrintThreads, GenCollectFull, GenCollectFullConcurrent, CMS_Initial_Mark, CMS_Final_Remark… Những người quan tâm có thể tự mình xem các tệp nguồn.

```
"VM Thread" prio=10 tid=0x00007fbea80d3800 nid=0x5e9 runnable
```

#### Phần 4: Luồng GC HotSpot

Luồng trong JVM được sử dụng để thu hồi tài nguyên, bao gồm các loại luồng sau:

##### "VM Periodic Task Thread"

Đây là luồng được sử dụng cho việc lập lịch các nhiệm vụ định kỳ trong JVM, nó được tạo bởi WatcherThread và là một đối tượng duy nhất. Luồng này được sử dụng khá thường xuyên trong JVM, ví dụ: giám sát bộ nhớ định kỳ, giám sát tình trạng hoạt động của JVM.

```
"VM Periodic Task Thread" prio=10 tid=0x00007fbea82ae800 nid=0x5fa waiting on condition
```

Bạn có thể sử dụng lệnh jstat để xem thông tin về GC, ví dụ: để xem một quy trình cụ thể không có tham chiếu cần thiết để sống sót, bạn có thể sử dụng lệnh `jstat -gcutil 250 7`. Trong đó, pid là id của quy trình, số 250 và 7 biểu thị in thông tin mỗi 250 mili giây, tổng cộng in 7 lần. Điều này rất hữu ích để ngăn chặn rò rỉ bộ nhớ do việc sử dụng trực tiếp thư viện native trong mã ứng dụng hoặc một số công cụ giám sát bên thứ ba.

##### "GC task thread#0 (ParallelGC)"

Đây là luồng thu gom rác, luồng này sẽ chịu trách nhiệm thu gom rác. Thông thường, JVM sẽ khởi động nhiều luồng để xử lý công việc này, số sau dấu # trong tên luồng cũng sẽ tăng dần.

```
"GC task thread#0 (ParallelGC)" prio=5 tid=0x00007fc6b480d000 nid=0x2503 runnable

"GC task thread#1 (ParallelGC)" prio=5 tid=0x00007fc6b2812000 nid=0x2703 runnable

"GC task thread#2 (ParallelGC)" prio=5 tid=0x00007fc6b2812800 nid=0x2903 runnable

"GC task thread#3 (ParallelGC)" prio=5 tid=0x00007fc6b2813000 nid=0x2b03 runnable
```

Nếu bạn đã thêm cờ `-XX:+UseConcMarkSweepGC` trong JVM, nó sẽ sử dụng luồng GC theo cách CMS (Concurrent Mark-Sweep). Dưới đây là các loại luồng trong chế độ này:

##### "Gang worker#0 (Parallel GC Threads)"

Luồng thu gom rác gốc GC task thread#0 (ParallelGC) được thay thế bằng Gang worker#0 (Parallel GC Threads). Gang worker là luồng JVM sử dụng để thu gom rác trong thế hệ trẻ (minor gc).

```
"Gang worker#0 (Parallel GC Threads)" prio=10 tid=0x00007fbea801b800 nid=0x5e4 runnable

"Gang worker#1 (Parallel GC Threads)" prio=10 tid=0x00007fbea801d800 nid=0x5e7 runnable
```

##### "Concurrent Mark-Sweep GC Thread"

Đây là luồng thu gom rác đánh dấu đồng thời (CMS GC), luồng này chủ yếu dùng cho việc thu gom rác trong thế hệ già.

```
"Concurrent Mark-Sweep GC Thread" prio=10 tid=0x00007fbea8073800 nid=0x5e8 runnable
```

##### "Surrogate Locker Thread (Concurrent GC)"

Luồng này chủ yếu được sử dụng kết hợp với bộ thu gom rác CMS, nó là một luồng bảo vệ và chịu trách nhiệm đồng bộ trạng thái đối tượng Reference (ví dụ: tham chiếu yếu, tham chiếu mềm) giữa lớp Java và lõi JVM.

```
"Surrogate Locker Thread (Concurrent GC)" daemon prio=10 tid=0x00007fbea8158800 nid=0x5ee waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE
```

Ở đây, chúng ta lấy ví dụ với WeakHashMap để giải thích. Đầu tiên, có một điểm quan trọng:

- WeakHashMap tương tự như HashMap, nó có một mảng Entry[];
- Entry trong WeakHashMap có một cấu trúc kế thừa đặc biệt: Entry->WeakReference->Reference;
- Reference có một đối tượng khóa toàn cục: Lock, còn được gọi là pending_lock, lưu ý: đây là một đối tượng tĩnh;
- Reference có một biến tĩnh: pending;
- Reference có một lớp nội bộ tĩnh: ReferenceHandler, luồng này được khởi tạo và khởi động trong khối static, sau khi khởi động, nó chuyển sang trạng thái chờ đợi trong một khối đồng bộ Lock;
- WeakHashMap cũng khởi tạo một hàng đợi ReferenceQueue.

Giả sử, trong WeakHashMap đã lưu trữ nhiều tham chiếu đối tượng, khi JVM thực hiện CMS GC, nó sẽ tạo một luồng ConcurrentMarkSweepThread (CMST) để thực hiện GC. Cùng lúc đó, CMST sẽ tạo và khởi động một luồng SurrogateLockerThread (SLT) và đưa nó vào trạng thái chờ đợi.  

Khi CMST bắt đầu GC, nó sẽ gửi một thông báo cho SLT để nó lấy khóa toàn cục của đối tượng Reference ở mức Java: Lock. Cho đến khi CMS GC hoàn tất, JVM sẽ đưa tất cả các đối tượng WeakReference thuộc WeakHashMap đã bị thu hồi vào thuộc tính pending của Reference (sau mỗi lần GC hoàn tất, pending gần như không bao giờ là null), sau đó thông báo cho SLT giải phóng và thông báo cho khóa toàn cục: Lock. Lúc này, luồng ReferenceHandler được kích hoạt để chạy phương thức run, thoát khỏi trạng thái chờ đợi và bắt đầu làm việc.  

Luồng ReferenceHandler này sẽ di chuyển tất cả các đối tượng WeakReference trong pending vào các hàng đợi tương ứng của chúng (hàng đợi là một cấu trúc liên kết). Khi chúng ta gọi phương thức get, put dữ liệu hoặc gọi phương thức size trên WeakHashMap lần sau, WeakHashMap sẽ lấy từng WeakReference trong hàng đợi ReferenceQueue và so sánh với mảng Entry[], nếu tìm thấy giống nhau, điều đó có nghĩa rằng đối tượng được lưu trữ trong Entry đã bị GC, sau đó loại bỏ Entry từ mảng Entry[].

#### Phần 5: Số lượng tham chiếu toàn cục JNI

Phần này chủ yếu liên quan đến việc thu hồi các đối tượng được tham chiếu trong mã native nhưng không có tham chiếu cần thiết trong mã Java. Điều này rất hữu ích để ngăn chặn rò rỉ bộ nhớ do việc sử dụng trực tiếp thư viện native trong mã ứng dụng hoặc một số công cụ giám sát bên thứ ba.

```
JNI global references: 830
```

Bài viết tiếp theo sẽ giới thiệu một ví dụ về cách tìm ra luồng CPU 100%.

### Trạng thái của luồng hệ thống

Có các trạng thái sau đây cho luồng hệ thống:

#### deadlock

Luồng bị kẹt, thường ám chỉ nhiều luồng gọi nhau trong quá trình sử dụng tài nguyên mà không thể giải phóng, dẫn đến việc chờ đợi mãi mãi.

【Ví dụ】Ví dụ về deadlock

```
"DEADLOCK_TEST-1" daemon prio=6 tid=0x000000000690f800 nid=0x1820 waiting for monitor entry [0x000000000805f000]
   java.lang.Thread.State: BLOCKED (on object monitor)
                at com.nbp.theplatform.threaddump.ThreadDeadLockState$DeadlockThread.goMonitorDeadlock(ThreadDeadLockState.java:197)
                - waiting to lock <0x00000007d58f5e60> (a com.nbp.theplatform.threaddump.ThreadDeadLockState$Monitor)
                at com.nbp.theplatform.threaddump.ThreadDeadLockState$DeadlockThread.monitorOurLock(ThreadDeadLockState.java:182)
                - locked <0x00000007d58f5e48> (a com.nbp.theplatform.threaddump.ThreadDeadLockState$Monitor)
                at com.nbp.theplatform.threaddump.ThreadDeadLockState$DeadlockThread.run(ThreadDeadLockState.java:135)

   Locked ownable synchronizers:
                - None

"DEADLOCK_TEST-2" daemon prio=6 tid=0x0000000006858800 nid=0x17b8 waiting for monitor entry [0x000000000815f000]
   java.lang.Thread.State: BLOCKED (on object monitor)
                at com.nbp.theplatform.threaddump.ThreadDeadLockState$DeadlockThread.goMonitorDeadlock(ThreadDeadLockState.java:197)
                - waiting to lock <0x00000007d58f5e78> (a com.nbp.theplatform.threaddump.ThreadDeadLockState$Monitor)
                at com.nbp.theplatform.threaddump.ThreadDeadLockState$DeadlockThread.monitorOurLock(ThreadDeadLockState.java:182)
                - locked <0x00000007d58f5e60> (a com.nbp.theplatform.threaddump.ThreadDeadLockState$Monitor)
                at com.nbp.theplatform.threaddump.ThreadDeadLockState$DeadlockThread.run(ThreadDeadLockState.java:135)

   Locked ownable synchronizers:
                - None

"DEADLOCK_TEST-3" daemon prio=6 tid=0x0000000006859000 nid=0x25dc waiting for monitor entry [0x000000000825f000]
   java.lang.Thread.State: BLOCKED (on object monitor)
                at com.nbp.theplatform.threaddump.ThreadDeadLockState$DeadlockThread.goMonitorDeadlock(ThreadDeadLockState.java:197)
                - waiting to lock <0x00000007d58f5e48> (a com.nbp.theplatform.threaddump.ThreadDeadLockState$Monitor)
                at com.nbp.theplatform.threaddump.ThreadDeadLockState$DeadlockThread.monitorOurLock(ThreadDeadLockState.java:182)
                - locked <0x00000007d58f5e78> (a com.nbp.theplatform.threaddump.ThreadDeadLockState$Monitor)
                at com.nbp.theplatform.threaddump.ThreadDeadLockState$DeadlockThread.run(ThreadDeadLockState.java:135)

   Locked ownable synchronizers:
                - None
```

#### runnable

Thường ám chỉ rằng luồng đang trong trạng thái thực thi, luồng này đang sử dụng tài nguyên và đang xử lý một hoạt động nào đó, ví dụ như truy vấn cơ sở dữ liệu thông qua câu lệnh SQL, ghi dữ liệu vào một tệp tin nào đó.

#### blocked

Luồng đang trong trạng thái chặn, ám chỉ rằng luồng hiện tại đang trong quá trình thực thi và cần một tài nguyên mà nó đã chờ đợi trong thời gian dài nhưng không thể nhận được, được quản lý bởi bộ quản lý luồng của hệ thống, có thể hiểu là luồng chờ đợi quá thời gian cho tài nguyên.

【Ví dụ】Ví dụ về blocked

```
"BLOCKED_TEST pool-1-thread-2" prio=6 tid=0x0000000007673800 nid=0x260c waiting for monitor entry [0x0000000008abf000]
   java.lang.Thread.State: BLOCKED (on object monitor)
                at com.nbp.theplatform.threaddump.ThreadBlockedState.monitorLock(ThreadBlockedState.java:43)
                - waiting to lock <0x0000000780a000b0> (a com.nbp.theplatform.threaddump.ThreadBlockedState)
                at com.nbp.theplatform.threaddump.ThreadBlockedState$2.run(ThreadBlockedState.java:26)
                at java.util.concurrent.ThreadPoolExecutor$Worker.runTask(ThreadPoolExecutor.java:886)
                at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:908)
                at java.lang.Thread.run(Thread.java:662)
   Locked ownable synchronizers:
                - <0x0000000780b0c6a0> (a java.util.concurrent.locks.ReentrantLock$NonfairSync)
"BLOCKED_TEST pool-1-thread-3" prio=6 tid=0x00000000074f5800 nid=0x1994 waiting for monitor entry [0x0000000008bbf000]
   java.lang.Thread.State: BLOCKED (on object monitor)
                at com.nbp.theplatform.threaddump.ThreadBlockedState.monitorLock(ThreadBlockedState.java:42)
                - waiting to lock <0x0000000780a000b0> (a com.nbp.theplatform.threaddump.ThreadBlockedState)
                at com.nbp.theplatform.threaddump.ThreadBlockedState$3.run(ThreadBlockedState.java:34)
                at java.util.concurrent.ThreadPoolExecutor$Worker.runTask(ThreadPoolExecutor.java:886
                at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:908)
                at java.lang.Thread.run(Thread.java:662)
   Locked ownable synchronizers:
                - <0x0000000780b0e1b8> (a java.util.concurrent.locks.ReentrantLock$NonfairSync)
```

#### waiting on condition

Luồng đang chờ tài nguyên hoặc chờ điều kiện nào đó xảy ra, nguyên nhân cụ thể cần phân tích kết hợp với thông tin ngăn xếp dưới đây.

(1) Nếu thông tin ngăn xếp rõ ràng là mã ứng dụng, đóng góp của ngăn xếp cho thấy luồng đang chờ tài nguyên, thường là đọc một nguồn tài nguyên lớn và tài nguyên này đã được khóa, luồng chuyển sang trạng thái chờ đợi, chờ đọc tài nguyên hoặc chờ thực hiện của các luồng khác.

(2) Nếu có nhiều luồng đang ở trạng thái này và thông tin ngăn xếp cho thấy đang chờ đợi đọc/ghi mạng, điều này có thể do mạng bị chặn dẫn đến luồng không thể thực thi. Điều này có thể là dấu hiệu của một chướng ngại về mạng:

- Mạng rất bận, gần như tiêu thụ hết băng thông, vẫn có rất nhiều dữ liệu đang chờ đọc/ghi mạng;
- Mạng có thể không bận, nhưng do định tuyến hoặc tường lửa, gói tin không thể đến đúng cách;

Vì vậy, cần kết hợp với các công cụ quan sát hiệu suất hệ thống để phân tích tổng thể, ví dụ: sử dụng netstat để thống kê số gói tin gửi trong một đơn vị thời gian, xem xem có vượt quá giới hạn băng thông mạng hiện tại hay không; quan sát tỷ lệ sử dụng CPU, xem thời gian CPU ở trạng thái hệ thống có lớn hơn đáng kể so với thời gian CPU ở trạng thái người dùng không. Tất cả những điều này đều chỉ ra chướng ngại về mạng do giới hạn băng thông mạng.

(3) Một trường hợp phổ biến khác là luồng đang trong trạng thái sleep, chờ đợi thời gian sleep kết thúc để được đánh thức.

【Ví dụ】Ví dụ về trạng thái chờ đợi

```
 "IoWaitThread" prio=6 tid=0x0000000007334800 nid=0x2b3c waiting on condition [0x000000000893f000]
   java.lang.Thread.State: WAITING (parking)
                at sun.misc.Unsafe.park(Native Method)
                - parking to wait for  <0x00000007d5c45850> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
                at java.util.concurrent.locks.LockSupport.park(LockSupport.java:156)
                at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(AbstractQueuedSynchronizer.java:1987)
                at java.util.concurrent.LinkedBlockingDeque.takeFirst(LinkedBlockingDeque.java:440)
                at java.util.concurrent.LinkedBlockingDeque.take(LinkedBlockingDeque.java:629)
                at com.nbp.theplatform.threaddump.ThreadIoWaitState$IoWaitHandler2.run(ThreadIoWaitState.java:89)
                at java.lang.Thread.run(Thread.java:662)
```

#### waiting for monitor entry or in Object.wait()

Monitor là phương tiện chính để thực hiện đồng bộ và tương tác giữa các luồng trong Java, nó có thể được coi là khóa của đối tượng hoặc lớp, mỗi đối tượng chỉ có một Monitor.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/java-monitor.png)

Từ hình trên, ta có thể thấy rằng mỗi Monitor chỉ có thể thuộc về một luồng tại một thời điểm, luồng đó được gọi là "Active Thread", trong khi các luồng khác được gọi là "Waiting Thread", chúng đang chờ đợi trong hai hàng đợi "Entry Set" và "Wait Set". Trong đó, luồng đang chờ đợi trong hàng đợi "Entry Set" có trạng thái là `waiting for monitor entry`, trong khi luồng đang chờ đợi trong hàng đợi "Wait Set" có trạng thái là `in Object.wait()`.

**(1) Luồng trong hàng đợi "Entry Set".**

Chúng ta gọi đoạn mã được bảo vệ bằng từ khóa `synchronized` là khu vực nguy hiểm, ví dụ:

```java
synchronized(obj) {
}
```

Khi một luồng yêu cầu vào khu vực nguy hiểm, nó sẽ vào hàng đợi "Entry Set", có hai trường hợp xảy ra:

- Monitor không được sở hữu bởi bất kỳ luồng nào khác và không có luồng nào đang chờ đợi trong hàng đợi "Entry Set". Luồng hiện tại trở thành chủ sở hữu của Monitor tương ứng với lớp hoặc đối tượng, và thực thi mã trong khu vực nguy hiểm; lúc này, luồng được hiển thị trong Thread Dump với trạng thái "Runnable".
- Monitor đã được một luồng khác sở hữu, luồng hiện tại đang chờ đợi trong hàng đợi "Entry Set". Lúc này, luồng được hiển thị trong Thread Dump với trạng thái "waiting for monitor entry".

Việc thiết lập khu vực nguy hiểm nhằm đảm bảo tính nguyên tử và tính toàn vẹn của mã bên trong, nhưng vì khu vực nguy hiểm chỉ cho phép một luồng đi qua vào bất kỳ thời điểm nào, điều này ngược lại với mục đích ban đầu của việc sử dụng nhiều luồng. Nếu có nhiều synchronized được sử dụng trong chương trình đa luồng hoặc sử dụng chúng không đúng cách, sẽ dẫn đến nhiều luồng đang chờ đợi trong hàng đợi "Entry Set", gây giảm hiệu suất của hệ thống. Nếu bạn phát hiện điều này trong Thread Dump, hãy xem xét mã nguồn và cải thiện nó.

**(2) Luồng trong hàng đợi "Wait Set"**

Khi một luồng đã giành được Monitor và vào khu vực nguy hiểm, nếu nó nhận thấy điều kiện tiếp tục chạy chưa được đáp ứng, nó sẽ gọi phương thức wait() của đối tượng (thường là đối tượng được bảo vệ bằng từ khóa synchronized), từ bỏ Monitor và vào hàng đợi "Wait Set". Chỉ khi một luồng khác gọi phương thức notify() hoặc notifyAll() trên đối tượng đó, các luồng trong hàng đợi "Wait Set" mới có cơ hội cạnh tranh, nhưng chỉ có một luồng duy nhất nhận được Monitor của đối tượng, và trở lại trạng thái chạy. Các luồng trong hàng đợi "Wait Set" trong Thread Dump sẽ hiển thị trạng thái là in Object.wait(). Thông thường, khi CPU bận rộn, chú ý đến các luồng ở trạng thái "Runnable", ngược lại, chú ý đến các luồng ở trạng thái "waiting for monitor entry".

### Ví dụ về việc sử dụng jstack

#### Tìm luồng Java tốn nhiều CPU nhất trong một quy trình Java

(1) Tìm quy trình Java

Giả sử tên ứng dụng là myapp:

```shell
$ jps | grep myapp
29527 myapp.jar
```

Nhận được ID quy trình là 21711

(2) Tìm luồng tốn nhiều CPU nhất trong quy trình đó, có thể sử dụng `ps -Lfp pid` hoặc `ps -mp pid -o THREAD, tid, time` hoặc `top -Hp pid`

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/170402_A57i_111708.png)  
Cột TIME là thời gian CPU mà từng luồng Java đã tiêu thụ, luồng có thời gian CPU lâu nhất là luồng có ID 21742, sử dụng

```shell
printf "%x\n" 21742
```

Nhận được giá trị thập lục phân của 21742 là 54ee, sẽ sử dụng nó ở bước tiếp theo.

(3) Sử dụng jstack để in thông tin ngăn xếp của luồng

Cuối cùng, đến lượt jstack, nó được sử dụng để in thông tin ngăn xếp của quy trình 21711, sau đó grep theo giá trị thập lục phân của luồng, như sau:

```shell
$ jstack 21711 | grep 54ee
"PollIntervalRetrySchedulerThread" prio=10 tid=0x00007f950043e000 nid=0x54ee in Object.wait() [0x00007f94c6eda000]
```

Có thể thấy CPU đã được tiêu thụ trong `PollIntervalRetrySchedulerThread` trong phương thức `Object.wait()`.

> Lưu ý: Trong ví dụ trên, mặc định chỉ hiển thị một dòng thông tin, nhưng trong nhiều trường hợp chúng ta muốn xem ngăn xếp gọi chi tiết hơn. Có thể sử dụng `-A <num>` để chỉ định số dòng hiển thị. Ví dụ: `jstack -l <pid> | grep <thread-hex-id> -A 10`

(4) Phân tích mã

Tôi đã tìm trong mã của mình và xác định được đoạn mã sau:

```java
// Idle wait
getLog().info("Thread [" + getName() + "] is idle waiting...");
schedulerThreadState = PollTaskSchedulerThreadState.IdleWaiting;
long now = System.currentTimeMillis();
long waitTime = now + getIdleWaitTime();
long timeUntilContinue = waitTime - now;
synchronized(sigLock) {
	try {
    	if(!halted.get()) {
    		sigLock.wait(timeUntilContinue);
    	}
    }
	catch (InterruptedException ignore) {
    }
}
```

Đây là đoạn mã chờ rảnh của luồng lập lịch truy vấn, dòng `sigLock.wait(timeUntilContinue)` tương ứng với `Object.wait()` ở trên.

#### Tạo tệp threaddump

Có thể sử dụng lệnh `jstack -l <pid> > <file-path>` để tạo tệp threaddump

【Ví dụ】Tạo tệp threaddump cho quy trình Java có ID 8841.

```
jstack -l 8841 > /home/threaddump.txt
```

## jinfo

> **[jinfo (JVM Configuration info)](https://docs.oracle.com/en/java/javase/11/tools/jinfo.html)** là một công cụ để xem và điều chỉnh thông tin cấu hình của máy ảo Java (JVM) trong thời gian thực. jinfo được sử dụng để xem và điều chỉnh các tham số chạy của JVM như các tham số `-X` (được hiển thị trong jvm_args), `-XX` (được hiển thị trong VM Flags) và các tham số `-D` (được lấy từ System Properties) có thể được truy cập từ mức Java.

Lệnh jinfo có định dạng như sau:

```shell
jinfo [option] pid
```

Các tùy chọn `option`:

- `-flag` - Hiển thị giá trị của tham số args được chỉ định.
- `-sysprops` - Hiển thị các thuộc tính hệ thống, tương đương với `System.getProperties()`.

【Ví dụ】Ví dụ về việc sử dụng jinfo

```shell
$ jinfo -sysprops 29527
Attaching to process ID 29527, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.222-b10
...
```

## jhat

> **jhat (JVM Heap Analysis Tool)** là một công cụ để phân tích bản chụp bộ nhớ heap của máy ảo Java (JVM). jhat được sử dụng để phân tích các tệp dump được tạo bằng lệnh jmap. jhat tích hợp sẵn một máy chủ HTTP/HTML nhỏ, cho phép xem kết quả phân tích dump trong trình duyệt web.
>
> Lưu ý: Thông thường, không nên phân tích trực tiếp trên máy chủ vì jhat là quá trình tốn thời gian và tài nguyên máy tính. Thay vào đó, tệp dump được tạo ra trên máy chủ có thể được phân tích bằng các công cụ như jvisualvm, Eclipse Memory Analyzer, IBM HeapAnalyzer.

Định dạng lệnh:

```shell
jhat [dumpfile]
```
