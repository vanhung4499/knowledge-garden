---
title: JVM Garbage Collection
tags: [java, javase, jvm, gc]
categories: [java, javase, jvm]
date created: 2023-07-18
date modified: 2023-07-18
---

# Thu gom rác trong JVM

> Các vùng nhớ như bộ đếm chương trình, ngăn xếp ảo và ngăn xếp phương thức cùng với các vùng nhớ này đều thuộc về từng luồng riêng biệt và chỉ tồn tại trong suốt vòng đời của luồng. Sau khi luồng kết thúc, các vùng nhớ này cũng sẽ biến mất, do đó không cần thu gom rác cho các vùng nhớ này. **Thu gom rác chủ yếu được thực hiện trên Java Heap và Method Area**.

## Đối tượng còn sống hay đã chết

### Thuật toán đếm tham chiếu

Thêm một bộ đếm tham chiếu cho đối tượng, khi đối tượng được tham chiếu thì bộ đếm tăng lên 1, khi tham chiếu mất hiệu lực thì bộ đếm giảm đi 1. Đối tượng có bộ đếm tham chiếu bằng 0 có thể bị thu gom.

Tuy nhiên, trong trường hợp hai đối tượng tham chiếu lẫn nhau, bộ đếm tham chiếu sẽ không bao giờ bằng 0, dẫn đến không thể thu gom được các đối tượng này.

```java
public class ReferenceCountingGC {
    public Object instance = null;

    public static void main(String[] args) {
        ReferenceCountingGC objectA = new ReferenceCountingGC();
        ReferenceCountingGC objectB = new ReferenceCountingGC();
        objectA.instance = objectB;
        objectB.instance = objectA;
    }
}
```

Vì sự tồn tại của tham chiếu lẫn nhau, nên **Java Virtual Machine không sử dụng thuật toán đếm tham chiếu**.

### Thuật toán phân tích khả năng tiếp cận

Dựa trên các **GC Roots** làm điểm bắt đầu để tìm kiếm, JVM coi các đối tượng mà có thể tiếp cận được từ GC Roots là **còn sống**, các đối tượng không thể tiếp cận được là **đã chết**.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230718153129.png)

**Các đối tượng có thể là GC Roots** bao gồm:

- Đối tượng được tham chiếu trong ngăn xếp ảo
- Đối tượng được tham chiếu trong ngăn xếp phương thức (phương thức Native)
- Đối tượng được tham chiếu trong vùng nhớ phương thức, thuộc tính tĩnh của lớp
- Đối tượng được tham chiếu trong vùng nhớ phương thức, hằng số

### Loại tham chiếu

Dù sử dụng thuật toán đếm tham chiếu để xác định số lượng tham chiếu của đối tượng, hay sử dụng thuật toán phân tích khả năng tiếp cận để xác định xem chuỗi tham chiếu có thể tiếp cận được hay không, việc xác định xem đối tượng có thể bị thu gom hay không đều liên quan đến tham chiếu.

Java có bốn loại tham chiếu với mức độ mạnh yếu khác nhau.

#### Tham chiếu mạnh (Strong Reference)

**Đối tượng được tham chiếu mạnh (Strong Reference) sẽ không bị thu gom bởi bộ thu gom rác.**

Tham chiếu mạnh: Sử dụng cách tạo một đối tượng mới bằng từ khóa `new`.

```java
Object obj = new Object();
```

#### Tham chiếu mềm (Soft Reference)

**Đối tượng được tham chiếu mềm (Soft Reference) chỉ bị thu gom khi bộ nhớ không đủ.**

Tham chiếu mềm: Sử dụng lớp `SoftReference` để tạo tham chiếu mềm.

```java
Object obj = new Object();
SoftReference<Object> sf = new SoftReference<Object>(obj);
obj = null; // Đối tượng chỉ được tham chiếu mềm
```

#### Tham chiếu yếu (Weak Reference)

**Đối tượng được tham chiếu yếu (Weak Reference) sẽ bị thu gom chắc chắn, tức là chỉ tồn tại đến lần thu gom rác tiếp theo.**

Sử dụng lớp `WeakReference` để tạo tham chiếu yếu.

```java
Object obj = new Object();
WeakReference<Object> wf = new WeakReference<Object>(obj);
obj = null;
```

`Entry` trong `WeakHashMap` kế thừa từ `WeakReference`, được sử dụng để thực hiện chức năng bộ nhớ đệm.

```java
private static class Entry<K,V> extends WeakReference<Object> implements Map.Entry<K,V>
```

`ConcurrentCache` trong Tomcat sử dụng `WeakHashMap` để thực hiện chức năng bộ nhớ đệm. `ConcurrentCache` sử dụng bộ nhớ đệm theo thế hệ, đối tượng được sử dụng thường xuyên được đặt trong eden, trong khi đối tượng không được sử dụng thường xuyên được đặt trong longterm. Eden sử dụng `ConcurrentHashMap` để thực hiện, longterm sử dụng `WeakHashMap`, đảm bảo rằng các đối tượng không được sử dụng thường xuyên dễ dàng bị thu gom.

```java
public final class ConcurrentCache<K, V> {

    private final int size;

    private final Map<K, V> eden;

    private final Map<K, V> longterm;

    public ConcurrentCache(int size) {
        this.size = size;
        this.eden = new ConcurrentHashMap<>(size);
        this.longterm = new WeakHashMap<>(size);
    }

    public V get(K k) {
        V v = this.eden.get(k);
        if (v == null) {
            v = this.longterm.get(k);
            if (v != null)
                this.eden.put(k, v);
        }
        return v;
    }

    public void put(K k, V v) {
        if (this.eden.size() >= size) {
            this.longterm.putAll(this.eden);
            this.eden.clear();
        }
        this.eden.put(k, v);
    }
}
```

#### Tham chiếu ảo (Phantom Reference)

Còn được gọi là tham chiếu ma hoặc tham chiếu ảo. Sự tồn tại của một tham chiếu ảo không ảnh hưởng đến thời gian sống của một đối tượng, và không thể truy cập được một thể hiện đối tượng.

**Mục đích duy nhất của việc thiết lập một tham chiếu ảo cho một đối tượng là để nhận được một thông báo hệ thống khi đối tượng đó bị thu gom.**

Sử dụng lớp `PhantomReference` để tạo tham chiếu ảo.

```java
Object obj = new Object();
PhantomReference<Object> pf = new PhantomReference<Object>(obj);
obj = null;
```

### Thu gom vùng phương thức

Vì vùng phương thức chủ yếu chứa các đối tượng trong không gian vĩnh viễn, và tỷ lệ thu gom của các đối tượng trong không gian vĩnh viễn thấp hơn so với không gian trẻ, nên việc thu gom rác trên vùng phương thức không hiệu quả.

Chủ yếu là thu gom rác trong bộ nhớ hằng số và hủy bỏ lớp.

Có nhiều điều kiện để hủy bỏ một lớp, phải đáp ứng ba điều kiện sau và không đảm bảo rằng lớp sẽ bị hủy bỏ:

- Tất cả các thể hiện của lớp đã được thu gom, nghĩa là không có thể hiện của lớp nào tồn tại trong Java Heap.
- `ClassLoader` tải lớp đã bị thu gom.
- Đối tượng `java.lang.Class` tương ứng với lớp không được tham chiếu ở bất kỳ đâu, nghĩa là không thể truy cập vào phương thức của lớp đó ở bất kỳ đâu bằng cách phản chiếu.

Có thể sử dụng tham số `-Xnoclassgc` để kiểm soát việc hủy bỏ lớp.

Trong các tình huống sử dụng nhiều phản chiếu, đại diện động, CGLib và tạo JSP động và OSGi, cần có khả năng hủy bỏ lớp trong máy ảo để đảm bảo không xảy ra lỗi tràn bộ nhớ.

### Thu gom vùng phương thức

Vì vùng phương thức chủ yếu chứa các đối tượng trong không gian vĩnh viễn, và tỷ lệ thu gom của các đối tượng trong không gian vĩnh viễn thấp hơn so với không gian trẻ, nên việc thu gom rác trên vùng phương thức không hiệu quả.

Chủ yếu là thu gom rác trong vùng hằng số và hủy bỏ lớp.

Có nhiều điều kiện để hủy bỏ một lớp, phải đáp ứng ba điều kiện sau và không đảm bảo rằng lớp sẽ bị hủy bỏ:

- Tất cả các thể hiện của lớp đã được thu gom, nghĩa là không có thể hiện của lớp nào tồn tại trong Java Heap.
- `ClassLoader` tải lớp đã bị thu gom.
- Đối tượng `java.lang.Class` tương ứng với lớp không được tham chiếu ở bất kỳ đâu, nghĩa là không thể truy cập vào phương thức của lớp đó ở bất kỳ đâu bằng cách phản chiếu.

Có thể sử dụng tham số `-Xnoclassgc` để kiểm soát việc hủy bỏ lớp.

Trong các tình huống sử dụng nhiều phản chiếu, đại diện động, CGLib và tạo JSP động và OSGi, cần có khả năng hủy bỏ lớp trong máy ảo để đảm bảo không xảy ra lỗi tràn bộ nhớ.

### finalize()

`finalize()` tương tự như hàm hủy trong C++, được sử dụng để thực hiện các công việc như đóng tài nguyên bên ngoài. Tuy nhiên, việc sử dụng `try-finally` hoặc các cách khác có thể tốt hơn và phương thức này có chi phí thực thi cao, không chắc chắn và không đảm bảo thứ tự gọi của các đối tượng, do đó **không nên sử dụng `finalize()`**.

Khi một đối tượng có thể được thu gom, nếu cần thực thi phương thức `finalize()` của đối tượng đó, có thể làm cho đối tượng được tham chiếu lại và tự cứu mình.

## Thuật toán thu gom rác

### Hiệu suất thu gom rác

Có hai chỉ số chính để đánh giá hiệu suất của bộ thu gom rác:

- **Thời gian tạm dừng** - Thời gian mà chương trình không thể hoạt động do quá trình thu gom rác.
- **Thông lượng** - Tổng số công việc mà ứng dụng có thể thực hiện trong một khoảng thời gian cố định. Đối với các ứng dụng quan tâm đến thông lượng, thời gian tạm dừng dài có thể chấp nhận được. Vì các ứng dụng có thống suất cao thường tập trung vào chu kỳ thời gian dài hơn, nên thời gian phản hồi nhanh không được xem xét.

### Đánh dấu - Dọn dẹp (Mark-Sweep)

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230718172452.png)

Đánh dấu các đối tượng cần thu gom, sau đó dọn dẹp các đối tượng đã được đánh dấu.

Nhược điểm:

- Hiệu suất đánh dấu và dọn dẹp đều không cao.
- Tạo ra nhiều mảnh bộ nhớ không liên tục, dẫn đến không thể cấp phát bộ nhớ cho các đối tượng lớn.

### Đánh dấu - Sắp xếp (Mark-Compact)

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230718172523.png)

Di chuyển tất cả các đối tượng còn sống về một đầu, sau đó xóa bỏ bộ nhớ ở phía bên ngoài ranh giới.

Phương pháp này giải quyết được vấn đề về mảnh bộ nhớ không liên tục, nhưng đồng thời tăng chi phí thực hiện của thuật toán nén.

### Sao chép (Copying)

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230718172532.png)

Chia bộ nhớ thành hai phần bằng nhau, chỉ sử dụng một phần trong mỗi lần. Khi phần này đầy, các đối tượng còn sống sẽ được sao chép sang phần còn lại, sau đó xóa bỏ phần đã sử dụng.

Nhược điểm chính là chỉ sử dụng được một nửa bộ nhớ.

Hiện nay, các máy ảo thương mại sử dụng thuật toán này để thu gom thế hệ trẻ, nhưng không phải chia bộ nhớ thành hai phần bằng nhau, mà chia thành một phần Eden lớn hơn và hai phần Survivor nhỏ hơn. Mỗi lần thu gom, các đối tượng còn sống trong Eden và Survivor sẽ được sao chép sang Survivor còn lại, sau đó dọn dẹp Eden và Survivor đã sử dụng. Kích thước mặc định của Eden và Survivor trong HotSpot VM là 8:1 (có thể điều chỉnh bằng tham số` -XX:SurvivorRatio`), đảm bảo sử dụng bộ nhớ hiệu quả đạt 90%. Nếu có hơn 10% đối tượng sống sau mỗi lần thu gom, một Survivor không đủ, và cần sự hỗ trợ từ thế hệ cũ để cấp phát bộ nhớ cho các đối tượng không thể lưu trữ trong Survivor.

## Thuật toán thu gom rác theo thế hệ

Các máy ảo hiện đại sử dụng thuật toán thu gom rác theo thế hệ, chia bộ nhớ thành các thế hệ dựa trên tuổi thọ của đối tượng và sử dụng thuật toán thu gom phù hợp cho từng thế hệ.

Thường thì Java Heap được chia thành thế hệ trẻ và thế hệ già.

- Thế hệ trẻ sử dụng thuật toán **sao chép**.
- Thế hệ già sử dụng thuật toán **đánh dấu - dọn dẹp** hoặc **đánh dấu - sắp xếp**.

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/images/dev/cs/java/javacore/jvm/jvm-hotspot-heap-structure.png" />
</div>

#### Thế hệ trẻ

Thế hệ trẻ là nơi tạo ra và hủy bỏ đa số các đối tượng, trong ứng dụng Java thông thường, hầu hết các đối tượng có tuổi thọ ngắn. Nó được chia thành khu vực `Eden`, là nơi đối tượng được cấp phát ban đầu, và hai khu vực `Survivor`, đôi khi được gọi là `from` và `to`, được sử dụng để lưu trữ các đối tượng được giữ lại từ quá trình thu gom nhỏ trước đó.

JVM sẽ chọn ngẫu nhiên một khu vực `Survivor` làm `to`, và trong quá trình thu gom rác, các đối tượng sống sót trong `Eden` và khu vực `from` sẽ được sao chép vào khu vực `to`. Thiết kế này nhằm mục đích ngăn chặn sự phân mảnh bộ nhớ và tiếp tục làm sạch các đối tượng không sử dụng.

Java Virtual Machine sẽ ghi lại số lần sao chép của các đối tượng trong khu vực `Survivor`. Nếu một đối tượng đã được sao chép 15 lần (tương ứng với tham số `-XX:+MaxTenuringThreshold` của máy ảo), đối tượng đó sẽ được thăng chuyển (promote) lên thế hệ già. Ngoài ra, nếu một khu vực `Survivor` đã sử dụng 50% (tương ứng với tham số `-XX:TargetSurvivorRatio` của máy ảo), các đối tượng có số lần sao chép cao hơn cũng sẽ được thăng chuyển lên thế hệ già.

#### Thế hệ già

Thế hệ già chứa các đối tượng có tuổi thọ dài, thường là các đối tượng đã tồn tại trong thế hệ trẻ và đã được sao chép nhiều lần. Khi không còn đủ không gian trong thế hệ trẻ để sao chép các đối tượng, JVM sẽ chuyển chúng trực tiếp vào thế hệ già.

#### Vùng vĩnh viễn

Đây là phần của phương pháp thực hiện của JVM trước đây, lưu trữ các siêu dữ liệu lớp Java, bảng hằng số và bộ đệm chuỗi Intern. Từ JDK 8 trở đi, không còn Vùng vĩnh viễn này nữa.

#### Tham số JVM

Dưới đây là một số tham số JVM cho phép điều chỉnh kích thước của Heap, các thế hệ và các vùng nhớ liên quan:

| Cấu hình           | Mô tả                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `-Xss`             | Kích thước ngăn xếp của máy ảo.                                                                                     |
| `-Xms`             | Giá trị khởi tạo của Heap.                                                                                          |
| `-Xmx`             | Giá trị tối đa của Heap.                                                                                             |
| `-Xmn`             | Kích thước của thế hệ trẻ.                                                                                          |
| `-XX:NewSize`      | Giá trị khởi tạo của thế hệ trẻ.                                                                                     |
| `-XX:MaxNewSize`   | Giá trị tối đa của thế hệ trẻ.                                                                                       |
| `-XX:NewRatio`     | Tỷ lệ giữa thế hệ trẻ và thế hệ già. Mặc định là 2, tức là thế hệ già gấp đôi thế hệ trẻ.                              |
| `-XX:SurvivorRatio`| Tỷ lệ giữa khu vực Eden và khu vực Survivor. Mặc định là 8, tức là khu vực `eden` chiếm 80% kích thước, hai khu vực `survivor` mỗi khu vực chiếm 10% kích thước. |
| `-XX:PermSize`     | Giá trị khởi tạo của Vùng vĩnh viễn.                                                                                    |
| `-XX:MaxPermSize`  | Giá trị tối đa của Vùng vĩnh viễn.                                                                                      |

## Bộ thu gom rác

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/images/dev/cs/java/javacore/jvm/jvm-gc-overview.jpg" />
</div>

Trên đây là 7 bộ thu gom rác trong máy ảo HotSpot, các đường kết nối biểu thị các bộ thu gom rác có thể được sử dụng cùng nhau.

Chú thích: Bộ thu gom rác G1 có thể thu gom bộ nhớ của cả thế hệ trẻ và thế hệ già. Trong khi đó, các bộ thu gom rác khác chỉ có thể thu gom bộ nhớ của một thế hệ cụ thể.

### Bộ thu gom rác tuần tự

Bộ thu gom rác tuần tự (Serial) là bộ thu gom rác cơ bản nhất và có lịch sử phát triển lâu nhất.

Bộ thu gom rác tuần tự là cấu hình mặc định của chế độ `client`. Vì trong chế độ client, bộ nhớ được cấp phát cho máy ảo thường không lớn. Thời gian tạm dừng của bộ thu gom rác Serial khi thu gom thế hệ trẻ vài chục megabyte hoặc cả trăm megabyte có thể kiểm soát trong khoảng hơn một trăm mili giây, miễn là không quá thường xuyên, thời gian tạm dừng này là chấp nhận được.

**Bộ thu gom rác tuần tự sử dụng phương pháp stop-the-world với một luồng để thu gom rác**. Khi không gian bộ nhớ không đủ, bộ thu gom rác tuần tự đặt cờ dừng, chờ tất cả các luồng đều đạt đến điểm an toàn (Safepoint), sau đó luồng ứng dụng tạm dừng, bộ thu gom rác tuần tự bắt đầu làm việc, **sử dụng một luồng để thu gom không gian và sắp xếp lại bộ nhớ**.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230718201633.png)

Luồng đơn nghĩa có nghĩa là độ phức tạp thấp hơn, chiếm ít bộ nhớ hơn và hiệu suất thu gom rác cao; nhưng đồng thời cũng có nghĩa là không thể tận dụng hiệu suất đa nhân. Trên thực tế, bộ thu gom rác tuần tự rất phù hợp với các trường hợp có ít bộ nhớ, CPU đơn lõi hoặc CPU hai lõi.

#### Bộ thu gom rác Serial

> Bật tùy chọn: `-XX:+UseSerialGC`
>
> Sau khi bật tùy chọn này, sử dụng bộ thu gom rác **Serial** + **Serial Old** để thu gom bộ nhớ.

#### Bộ thu gom rác Serial Old

Serial Old là phiên bản của bộ thu gom rác Serial dành cho thế hệ già, cũng được sử dụng cho máy ảo chế độ `client`. Nếu sử dụng trong chế độ `server`, nó có hai mục đích:

- Trong JDK 1.5 và các phiên bản trước đó (trước khi Parallel Old ra đời), nó được sử dụng cùng với bộ thu gom rác Parallel Scavenge.
- Là phương án dự phòng cho bộ thu gom rác CMS, được sử dụng khi xảy ra lỗi thu gom đồng thời Concurrent Mode Failure.

### Bộ thu gom rác song song

> Bật tùy chọn: `-XX:+UseParallelGC`
>
> Sau khi bật tùy chọn này, sử dụng bộ thu gom rác **Parallel Scavenge** + **Serial Old** để thu gom bộ nhớ.
>
> Bật tùy chọn: `-XX:+UseParallelOldGC`
>
> Sau khi bật tùy chọn này, sử dụng bộ thu gom rác **Parallel Scavenge** + **Parallel Old** để thu gom bộ nhớ.

Các bộ thu gom rác khác đều tập trung vào thời gian tạm dừng, trong khi **bộ thu gom rác song song (Parallel) tập trung vào thông lượng (Throughput)**.

- Thời gian tạm dừng càng ngắn thì càng phù hợp với các chương trình cần tương tác với người dùng, thời gian phản hồi tốt có thể cải thiện trải nghiệm người dùng;
- Trong khi đó, thông lượng cao có thể tận dụng hiệu suất CPU một cách hiệu quả, hoàn thành nhanh nhiệm vụ tính toán của chương trình, chủ yếu phù hợp với các nhiệm vụ tính toán nền mà không cần nhiều tương tác.

```
Thông lượng = Thời gian chạy mã người dùng / (Thời gian chạy mã người dùng + Thời gian thu gom rác)
```

**Bộ thu gom rác song song là bộ thu gom rác mặc định trong chế độ server.**

Bộ thu gom rác song song hoạt động tương tự như bộ thu gom rác tuần tự, đều sử dụng phương pháp stop-the-world, chỉ khác là tạm dừng thực hiện thu gom rác song song. **Bộ thu gom rác song song sử dụng thuật toán sao chép cho thế hệ trẻ và thuật toán đánh dấu-sắp xếp cho thế hệ già**, đồng thời nén bộ nhớ trong quá trình thu gom rác. Bộ thu gom rác song song phù hợp với các tình huống yêu cầu thông lượng cao hơn yêu cầu độ trễ và cung cấp thông lượng tốt nhất trong trường hợp đảm bảo độ trễ tệ nhất.

**Trong các trường hợp quan tâm đến thông lượng và tài nguyên CPU, nên ưu tiên sử dụng bộ thu gom rác Parallel Scavenge + Parallel Old.**

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230718202918.png)

#### Bộ thu gom rác Parallel Scavenge

Bộ thu gom rác Parallel Scavenge cung cấp hai tham số để kiểm soát thông lượng chính xác, đó là:

- `-XX:MaxGCPauseMillis` - Kiểm soát thời gian tạm dừng thu gom rác tối đa, bộ thu gom rác sẽ cố gắng đảm bảo thời gian thu gom rác không vượt quá giá trị được đặt.
- `-XX:GCTimeRatio` - Thiết lập trực tiếp kích thước thông lượng (giá trị là số nguyên lớn hơn 0 và nhỏ hơn 100).

Rút ngắn thời gian tạm dừng được thực hiện bằng cách hy sinh thông lượng và không gian thế hệ trẻ: không gian thế hệ trẻ nhỏ hơn, thu gom rác trở nên thường xuyên hơn, dẫn đến giảm thông lượng.

Bộ thu gom rác Parallel Scavenge còn cung cấp một tham số `-XX:+UseAdaptiveSizePolicy`, đây là một cờ bật, khi bật cờ này, không cần chỉ định kích thước thế hệ trẻ (`-Xmn`), tỷ lệ Eden và Survivor (`-XX:SurvivorRatio`), tuổi đối tượng chuyển lên thế hệ già (`-XX:PretenureSizeThreshold`) và các tham số chi tiết khác, máy ảo sẽ dựa trên thông tin giám sát hiệu suất hiện tại của hệ thống, tự động điều chỉnh các tham số này để cung cấp thời gian tạm dừng tốt nhất hoặc thông lượng tối đa, phương pháp này được gọi là cơ chế điều chỉnh tự động GC (GC Ergonomics).

#### Bộ thu gom rác Parallel Old

Đây là phiên bản của bộ thu gom rác Parallel Scavenge dành cho thế hệ già, sử dụng **nhiều luồng và thuật toán "đánh dấu-sắp xếp"**.

### Bộ thu gom rác đồng thời đánh dấu-xóa

> Bật tùy chọn: `-XX:+UseConcMarkSweepGC`
>
> Sau khi bật tùy chọn này, sử dụng bộ thu gom rác **CMS** + **ParNew** + **Serial Old** để thu gom bộ nhớ.

Bộ thu gom rác đồng thời đánh dấu-xóa nhằm mục tiêu giảm thiểu thời gian tạm dừng.

Sau khi bật tùy chọn này, ParNew được sử dụng để thu gom thế hệ trẻ; CMS được sử dụng để thu gom thế hệ già. Nếu CMS tạo ra quá nhiều mảnh vụn mà không thể chứa được rác lưu động, JVM sẽ gặp phải `Concurrent Mode Failure` , lúc này Serial Old sẽ được sử dụng để thay thế CMS để làm sạch mảnh vụn.

#### Bộ thu gom rác CMS

**Bộ thu gom rác CMS là một bộ thu gom rác đồng thời với mục tiêu giảm thiểu thời gian tạm dừng.**

CMS (Concurrent Mark Sweep), Mark Sweep chỉ đánh dấu-xóa.

##### Cơ chế thu gom của CMS

Bước thu gom của bộ thu gom rác CMS như sau:

1. **Đánh dấu ban đầu**: Chỉ đơn giản là đánh dấu các đối tượng mà GC Roots có thể trực tiếp liên kết đến, nhanh chóng và cần tạm dừng.
2. **Đánh dấu đồng thời**: Quá trình theo dõi GC Roots để tìm các đối tượng sống trong quá trình thực thi ứng dụng, là quá trình tốn thời gian nhất, không cần tạm dừng.
3. **Đánh dấu lại**: Để sửa chữa các đối tượng đã bị thay đổi trong quá trình đánh dấu đồng thời, cần tạm dừng.
4. **Xóa đồng thời**: Thu hồi các đối tượng được xác định là không thể truy cập trong giai đoạn đánh dấu. Không cần tạm dừng.

Trong suốt quá trình thu gom, các luồng thu gom rác có thể chạy song song với các luồng ứng dụng, không cần tạm dừng.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230718203540.png)

##### Bước thu gom thế hệ trẻ của CMS

**(1) Phân chia không gian heap thành ba phần**

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slide1.png)  

Thế hệ trẻ được chia thành một khu vực Eden và hai khu vực Survivor. Thế hệ già là một không gian liên tục. Thu gom đối tượng tại chỗ. Không nén trừ khi có FullGC.

**(2) Làm thế nào CMS thu gom thế hệ trẻ**

Thế hệ trẻ được đánh dấu màu xanh lá cây, thế hệ già được đánh dấu màu xanh lam. Nếu ứng dụng của bạn đã chạy một thời gian, heap của CMS sẽ trông như thế này. Các đối tượng phân tán trong không gian thế hệ già.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slide2.png)

Với CMS, các đối tượng trong thế hệ già được giải phóng tại chỗ. Chúng không bị di chuyển. Không gian này không bị nén trừ khi có FullGC.

**(3) Thu gom thế hệ trẻ**

Sao chép các đối tượng sống từ Eden và Survivor sang Survivor khác. Tất cả các đối tượng đạt đến ngưỡng tuổi của chúng sẽ được thăng chuyển sang thế hệ già.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slide3.png)  

**(4) Sau khi thu gom thế hệ trẻ**

Sau một lần thu gom rác thế hệ trẻ, Eden và một trong hai Survivor sẽ được làm trống.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slide4.png)  

Các đối tượng mới được thăng chuyển sẽ được hiển thị màu xanh lam trong hình trên, các đối tượng màu xanh lá cây là những đối tượng trẻ chưa thăng chuyển sang thế hệ già.

##### Bước thu gom thế hệ già của CMS

**(1) Thu gom thế hệ già của CMS**

Có hai sự kiện stop the world: đánh dấu ban đầu và đánh dấu lại. Khi thế hệ già đạt đến tỷ lệ sử dụng bộ nhớ cụ thể, CMS bắt đầu thực hiện.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slide5.png)

- Đánh dấu ban đầu là giai đoạn tạm dừng ngắn, chỉ đánh dấu các đối tượng có thể tiếp cận được.
- Đánh dấu đồng thời tìm kiếm đối tượng sống trong quá trình thực thi ứng dụng.
- Cuối cùng, trong giai đoạn đánh dấu lại, tìm kiếm các đối tượng bị mất trong giai đoạn đánh dấu đồng thời trước đó.

**(2) Thu gom thế hệ già - xóa đồng thời**

Các đối tượng chưa được đánh dấu sẽ được giải phóng tại chỗ. Không nén trừ khi có FullGC.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slide6.png)  

**Lưu ý:** Đối tượng chưa được đánh dấu tương đương với đối tượng đã chết.

**(3) Thu gom thế hệ già - sau khi xóa**

Sau giai đoạn xóa, bạn có thể thấy rất nhiều bộ nhớ được giải phóng. Bạn cũng có thể nhận thấy không có hoạt động nén.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slide7.png)  

Cuối cùng, bộ thu gom rác CMS sẽ tiếp tục vào giai đoạn thiết lập lại, chờ đợi thời điểm thu gom rác tiếp theo.

##### Đặc điểm của CMS

Bộ thu gom rác CMS có các nhược điểm sau:

- Thu gom đồng thời - Đồng thời có nghĩa là các luồng ứng dụng và luồng GC có thể chạy song song, không cần tạm dừng.
- Thông lượng thấp - Thời gian tạm dừng thấp được đánh đổi bằng cách hy sinh thông lượng, dẫn đến tỷ lệ sử dụng CPU không cao.
- Không thể xử lý rác lưu động - Có thể xảy ra `Concurrent Mode Failure`. Rác lưu động là rác được tạo ra trong giai đoạn xóa đồng thời do luồng ứng dụng tiếp tục chạy, phần rác này chỉ có thể được thu gom lại trong lần GC tiếp theo. Vì có rác lưu động, cần dành một phần bộ nhớ trống, điều này có nghĩa là bộ thu gom CMS không thể chờ thế hệ già gần đầy mới thu gom như những bộ thu gom khác.
	- Có thể sử dụng `-XX:CMSInitiatingOccupancyFraction` để thay đổi ngưỡng sử dụng bộ nhớ để kích hoạt CMS, nếu giá trị này được đặt quá lớn, dẫn đến không đủ bộ nhớ dự phòng để chứa rác lưu động, sẽ xảy ra `Concurrent Mode Failure` và JVM sẽ tạm thời sử dụng Serial Old để thay thế CMS để làm sạch rác lưu động.
- Đánh dấu - Xóa gây ra sự phân mảnh, thường xuyên xảy ra tình trạng không gian thế hệ già còn trống nhưng không tìm thấy không gian liên tục đủ lớn để cấp phát cho đối tượng hiện tại, phải sớm kích hoạt một lần Full GC.
	- Có thể sử dụng `-XX:+UseCMSCompactAtFullCollection` để kích hoạt việc nén mảnh vụn khi CMS cần thực hiện Full GC, quá trình nén không thể đồng thời, vấn đề mảnh vụn được giải quyết, nhưng thời gian tạm dừng sẽ tăng lên.
	- Có thể sử dụng `-XX:CMSFullGCsBeforeCompaction` để thiết lập số lần Full GC không nén trước khi thực hiện một lần nén (mặc định là 0, có nghĩa là mỗi khi thực hiện Full GC đều phải thực hiện nén mảnh vụn).

#### Bộ thu gom ParNew

> Tùy chọn kích hoạt: `-XX:+UseParNewGC`

Bộ thu gom ParNew thực chất là phiên bản đa luồng của bộ thu gom Serial.

ParNew là bộ thu gom thế hệ trẻ được ưu tiên sử dụng trong chế độ Server của máy ảo Java. Ngoài lý do hiệu suất, chính là do nó là bộ thu gom duy nhất có thể hoạt động cùng với bộ thu gom CMS.

Bộ thu gom ParNew cũng là bộ thu gom mặc định cho thế hệ trẻ khi sử dụng `-XX:+UseConcMarkSweepGC`.

Số luồng mặc định của bộ thu gom ParNew là bằng số lượng CPU, có thể sử dụng tham số `-XX:ParallelGCThreads` để thiết lập số luồng.

### Bộ thu gom G1

> Tùy chọn kích hoạt: `-XX:+UseG1GC`

Các bộ thu gom rác đã được đề cập trước đây thường tập trung vào hiệu suất hoặc thời gian tạm dừng. Tuy nhiên, G1 là một bộ thu gom rác kết hợp cả hiệu suất và thời gian tạm dừng. G1 là bộ thu gom rác mặc định từ Oracle JDK 9 trở đi. G1 có thể thiết lập mục tiêu thời gian tạm dừng một cách trực quan. So với bộ thu gom CMS, G1 có thể không đạt được thời gian tạm dừng tối ưu nhưng cũng tốt hơn trong trường hợp xấu nhất.

Điểm đặc biệt lớn nhất của G1 là sự giới thiệu của khái niệm phân vùng, làm mờ khái niệm theo thế hệ và tận dụng tài nguyên của các chu kỳ thu gom rác khác nhau, giải quyết nhiều khuyết điểm của các bộ thu gom khác, kể cả CMS.

#### Thế hệ và phân vùng

Các bộ thu gom rác cũ thông thường thực hiện thu gom theo thế hệ, trong đó Java Heap được chia thành thế hệ trẻ, thế hệ già và thế hệ vĩnh cửu. Phạm vi thu gom là toàn bộ thế hệ trẻ hoặc toàn bộ thế hệ già.

G1 loại bỏ thế hệ vĩnh cửu và chia thế hệ trẻ và thế hệ già thành nhiều vùng độc lập có kích thước bằng nhau, thế hệ trẻ và thế hệ già không còn được cách ly vật lý. G1 có thể thu gom trực tiếp thế hệ trẻ và thế hệ già cùng một lúc.

<div align="center">
<img src="https://raw.githubusercontent.com/dunwu/images/dev/cs/java/javacore/jvm/jvm-gc-g1-heap-allocation.png" />
</div>

Bằng cách giới thiệu khái niệm vùng, một khối bộ nhớ được chia thành nhiều khối nhỏ, mỗi khối nhỏ có thể được thu gom rác độc lập. Phương pháp chia này mang lại tính linh hoạt lớn, cho phép mô hình thời gian tạm dừng có thể dự đoán được. Bằng cách ghi lại thời gian thu gom rác của mỗi vùng và không gian thu được từ việc thu gom rác trước đó, và duy trì một danh sách ưu tiên, mỗi lần dựa trên thời gian thu gom cho phép, ưu tiên thu gom vùng có giá trị cao nhất.

Mỗi vùng đều có một Remembered Set để ghi lại các vùng mà các đối tượng tham chiếu đến. Bằng cách sử dụng Remembered Set, không cần quét toàn bộ heap để phân tích khả năng tiếp cận.

#### Cơ chế thu gom của G1

Nếu không tính toán việc duy trì Remembered Set, quá trình hoạt động của bộ thu gom G1 có thể chia thành các bước sau:

1. **Đánh dấu ban đầu**
2. **Đánh dấu đồng thời**
3. **Đánh dấu cuối cùng** - Để sửa chữa phần đánh dấu bị thay đổi trong quá trình đánh dấu đồng thời do hoạt động của chương trình người dùng, máy ảo ghi lại các thay đổi này trong Remembered Set Logs của các luồng và sau đó hợp nhất dữ liệu Remembered Set Logs vào Remembered Set. Bước này yêu cầu tạm dừng luồng, nhưng có thể thực hiện song song.
4. **Thu gom lựa chọn** - Đầu tiên, sắp xếp giá trị thu gom và chi phí của mỗi vùng, dựa trên thời gian tạm dừng GC mà người dùng mong muốn. Thực tế, bước này cũng có thể được thực hiện song song với chương trình người dùng, nhưng vì chỉ thu gom một phần vùng, thời gian tạm dừng là do người dùng kiểm soát và tăng hiệu suất thu gom.

Có những đặc điểm sau:

- Tích hợp không gian: Tổng thể là một bộ thu gom dựa trên thuật toán "đánh dấu - sắp xếp", từ một góc nhìn cục bộ (giữa hai vùng) dựa trên thuật toán "sao chép". Điều này có nghĩa là không có mảnh không gian bị phân mảnh được tạo ra trong quá trình chạy.
- Thời gian tạm dừng có thể dự đoán được: Cho phép người dùng chỉ định rõ ràng rằng trong một khoảng thời gian M mili giây, thời gian tiêu tốn cho GC không được vượt quá N mili giây.

#### Quy trình thu gom thế hệ trẻ chi tiết của G1

**（1）G1 khởi tạo không gian heap**

Heap là một khối bộ nhớ được chia thành nhiều vùng có kích thước cố định.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slide8.png)  

Khi máy ảo Java khởi động, kích thước vùng được chọn. Thông thường, máy ảo Java sẽ chọn khoảng 2000 vùng có kích thước tương đương, mỗi vùng có kích thước từ 1 đến 32M.

**（2）Phân vùng không gian heap của G1**

Thực tế, các vùng này được ánh xạ thành các vùng Eden, Survivor và Old logic.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slide9.png)  

Màu sắc trong hình chỉ ra vùng nào được liên kết với vai trò gì. Đối tượng hoạt động được phân tán (sao chép, di chuyển) từ một vùng sang một vùng khác. Các vùng được thiết kế để thu gom theo cách song song, có thể tạm dừng hoặc không tạm dừng tất cả các luồng người dùng khác.

Có thể phân vùng rõ ràng thành Eden, Survivor và Old. Ngoài ra, có một loại vùng thứ tư được gọi là *vùng cực lớn (Humongous regions)*. Các vùng này được thiết kế để giữ 50% hoặc nhiều hơn kích thước vùng tiêu chuẩn. Chúng được lưu trữ trong một tập hợp các vùng liên tục. Cuối cùng, loại vùng cuối cùng là các vùng không được sử dụng trong không gian heap.

**Lưu ý:** Khi viết bài này, việc thu gom đối tượng cực lớn vẫn chưa được tối ưu hóa. Do đó, bạn nên tránh tạo đối tượng có kích thước lớn như vậy.

**（3）Thế hệ trẻ của G1**

Không gian heap được chia thành khoảng 2000 vùng. Tối thiểu là 1M, tối đa là 32M. Vùng màu xanh lá cây giữ các đối tượng thế hệ già, vùng màu xanh lam giữ các đối tượng thế hệ trẻ.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slide10.png)  
**Lưu ý:** Không cần phải là các vùng liên tục như các bộ thu gom cũ.

**（4）Thu gom thế hệ trẻ của G1**

Các đối tượng hoạt động được sao chép (di chuyển) sang một hoặc nhiều vùng Survivor. Nếu đạt đến ngưỡng thăng cấp tổng, đối tượng sẽ được thăng cấp vào vùng Old.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slide11.png)  

Đây là một sự tạm dừng stop the world. Tính toán lại kích thước Eden và Survivor cho lần thu gom rác thế hệ trẻ tiếp theo. Việc giữ lại thông tin kiểm tra giúp tính toán kích thước. Các vấn đề tương tự thời gian tạm dừng mục tiêu sẽ được xem xét.

Phương pháp này làm cho việc điều chỉnh kích thước vùng trở nên dễ dàng, tăng hoặc giảm theo nhu cầu.

**（5）Kết thúc thu gom thế hệ trẻ của G1**

Các đối tượng hoạt động được sao chép vào vùng Survivor hoặc vùng Old.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slide12.png)  

Các đối tượng mới được thăng cấp gần đây được hiển thị dưới dạng màu xanh đậm. Các vùng Survivor được hiển thị dưới dạng màu xanh lá cây.

Tóm lại quá trình thu gom thế hệ trẻ của G1:

- Không gian heap là một khối bộ nhớ độc lập được chia thành nhiều vùng.
- Thế hệ trẻ của bộ nhớ được tạo thành từ một nhóm các vùng không liên tục. Điều này làm cho việc điều chỉnh kích thước trở nên dễ dàng.
- Thu gom rác thế hệ trẻ là một sự kiện stop the world, tất cả các luồng ứng dụng đều tạm dừng trong quá trình này.
- Thu gom rác thế hệ trẻ sử dụng nhiều luồng để thu gom song song.
- Các đối tượng hoạt động được sao chép vào vùng Survivor hoặc vùng Old.

#### Quá trình thu gom thế hệ già của G1

**Bước 1: Gắn nhãn ban đầu (Initial Mark)**

Thu gom rác trong thế hệ già của G1 đảm nhiệm việc gắn nhãn cho các đối tượng hoạt động. Được ghi lại trong tệp nhật ký với tên *GC pause (young)(inital-mark)*.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slide13.png)

**Bước 2: Gắn nhãn song song (Concurrent Mark)**

Nếu có các vùng trống (được đánh dấu bằng "X"), chúng sẽ được xóa ngay trong giai đoạn gắn nhãn lại. Đồng thời, thông tin kiểm tra sự sống cũng được tính toán tại giai đoạn này.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slide14.png)

**Bước 3: Gắn nhãn lại (Remark)**

Các vùng trống được xóa và thu gom. Tính toán sự sống của tất cả các vùng trong quá trình này.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slide15.png)

**Bước 4: Sao chép/Thu dọn (Copy/Cleanup)**

G1 chọn các vùng có độ sống thấp nhất để thu gom, những vùng này có thể được thu gom nhanh nhất. Sau đó, các vùng này sẽ được thu gom trong quá trình thu gom rác trong thế hệ già. Được ghi lại trong nhật ký với tên *[GC pause (mixed)]*. Vì vậy, cả thế hệ già và đa thế hệ cùng được thu gom cùng một lúc.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slide16.png)

**Bước 5: Sau quá trình sao chép/Thu dọn**

Các vùng được chọn đã được thu gom và nén vào các vùng màu xanh đậm và màu xanh lá cây được hiển thị trong hình.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/slide17.png)

### Tổng kết

|     Bộ thu gom     | Tuần tự/Đồng thời/Phân tán | Thế hệ trẻ/Thế hệ già | Thu gom thuật toán | Mục tiêu |                  Ứng dụng phù hợp                  |
| :----------------: | :-----------------------: | :------------------: | :----------------: | :------: | :------------------------------------------------: |
|     **Serial**     |          Tuần tự          |       Thế hệ trẻ      |       Sao chép      |  Ưu tiên tốc độ đáp ứng  |   Môi trường Client với một CPU trong chế độ Client   |
|   **Serial Old**   |          Tuần tự          |       Thế hệ già      |    Đánh dấu-đóng gói   |  Ưu tiên tốc độ đáp ứng  | Môi trường Client với một CPU, dự phòng cho CMS  |
|     **ParNew**     |    Tuần tự + Đồng thời    |       Thế hệ trẻ      |       Sao chép      |  Ưu tiên tốc độ đáp ứng  |   Môi trường Server với nhiều CPU, kết hợp với CMS   |
| **Parallel Scavenge** |    Tuần tự + Đồng thời    |       Thế hệ trẻ      |       Sao chép      |  Ưu tiên hiệu suất  | Các tác vụ chạy nền không cần nhiều tương tác |
|   **Parallel Old**  |    Tuần tự + Đồng thời    |       Thế hệ già      |    Đánh dấu-đóng gói   |  Ưu tiên hiệu suất  | Các tác vụ chạy nền không cần nhiều tương tác |
|      **CMS**       |    Đồng thời + Đồng thời   |       Thế hệ già      |    Đánh dấu-xóa     |  Ưu tiên tốc độ đáp ứng  | Ứng dụng Java tập trung trên các trang web hoặc dịch vụ máy chủ B/S |
|       **G1**       |    Đồng thời + Đồng thời   | Thế hệ trẻ + Thế hệ già | Đánh dấu-đóng gói + Sao chép | Ưu tiên tốc độ đáp ứng |  Ứng dụng dành cho máy chủ, thay thế CMS trong tương lai  |

## Chiến lược cấp phát và thu gom bộ nhớ

cấp phát bộ nhớ cho đối tượng được thực hiện trên heap. Đa phần các đối tượng được cấp phát trên khu vực Eden của thế hệ trẻ, trong một số trường hợp cũng có thể được cấp phát trực tiếp trên khu vực của thế hệ già.

### Minor GC

**Khi không gian trong khu vực Eden không đủ, Minor GC sẽ được kích hoạt**.

**Minor GC xảy ra trên thế hệ trẻ**, vì thời gian sống của các đối tượng trên thế hệ trẻ ngắn, nên Minor GC thường xuyên xảy ra và thực hiện nhanh chóng.

Quy trình của Minor GC:

1. Ứng dụng Java liên tục tạo ra các đối tượng, thường được cấp phát trên khu vực Eden. Khi không gian trong Eden không đủ (đạt đến ngưỡng đã định), Minor GC sẽ được kích hoạt. Các đối tượng vẫn còn được tham chiếu (hình vuông màu xanh lá cây) sẽ được sao chép vào khu vực Survivor mà JVM chọn, trong khi các đối tượng không còn được tham chiếu (hình vuông màu vàng) sẽ được thu gom.
2. Sau một lần Minor GC, khu vực Eden sẽ trở thành trống rỗng cho đến khi đạt đến điều kiện kích hoạt Minor GC lần tiếp theo. Lúc này, khu vực Survivor khác sẽ trở thành khu vực `To`, các đối tượng còn sống trong khu vực Eden và khu vực `From` sẽ được sao chép vào khu vực `To`, và độ tuổi của đối tượng sống sẽ được tăng thêm 1.
3. Quá trình tương tự như bước 2 sẽ xảy ra nhiều lần, cho đến khi một số đối tượng đạt đến ngưỡng tuổi, khi đó quá trình "thăng cấp" (Promotion) sẽ xảy ra, các đối tượng vượt quá ngưỡng sẽ được thăng cấp vào thế hệ già. Ngưỡng này có thể được chỉ định bằng tham số `-XX:MaxTenuringThreshold`.

### Full GC

**Full GC xảy ra trên thế hệ già**, đối tượng trên thế hệ già có tuổi sống lâu hơn thế hệ trẻ, do đó Full GC xảy ra ít và tốc độ thực hiện cũng chậm hơn Minor GC nhiều.

#### Chiến lược cấp phát bộ nhớ

**(1) Ưu tiên cấp phát đối tượng trên Eden**

Trong hầu hết các trường hợp, đối tượng được cấp phát trên khu vực Eden của thế hệ trẻ. Khi không gian trong Eden không đủ, Minor GC sẽ được kích hoạt. Điều này đảm bảo rằng đối tượng có tuổi sống ngắn được thu gom nhanh chóng.

**(2) Đối tượng lớn trực tiếp vào thế hệ già**

Đối tượng lớn là những đối tượng cần có không gian liên tục, ví dụ như chuỗi dài và mảng lớn.

Việc cấp phát đối tượng lớn sẽ kích hoạt thu gom rác trước để có đủ không gian liên tục để cấp phát cho đối tượng lớn.

`-XX:PretenureSizeThreshold` được sử dụng để định nghĩa kích thước ngưỡng, nếu đối tượng lớn hơn ngưỡng này, nó sẽ được cấp phát trực tiếp trên thế hệ già, tránh việc sao chép nhiều bộ nhớ giữa khu vực Eden và khu vực Survivor.

**(3) Đối tượng tồn tại lâu vào thế hệ già**

Đối tượng được định nghĩa với bộ đếm tuổi, đối tượng sinh ra trong Eden và sống sót qua Minor GC sẽ được chuyển sang khu vực Survivor, và tuổi đối tượng sẽ tăng lên 1.

`-XX:MaxTenuringThreshold` được sử dụng để định nghĩa ngưỡng tuổi.

**(4) Xác định tuổi của đối tượng động**

Máy ảo không yêu cầu tuổi của đối tượng phải đạt đến `MaxTenuringThreshold` mới có thể thăng cấp vào thế hệ già. Nếu tổng kích thước của tất cả các đối tượng cùng tuổi trong khu vực Survivor lớn hơn một nửa không gian của Survivor, các đối tượng có tuổi lớn hơn hoặc bằng tuổi này có thể trực tiếp thăng cấp vào thế hệ già mà không cần đợi đến tuổi yêu cầu.

**(5) Bảo đảm cấp phát không gian**

Trước khi thực hiện Minor GC, máy ảo sẽ kiểm tra xem không gian liên tục lớn nhất có sẵn trong thế hệ già có lớn hơn tổng không gian của tất cả các đối tượng trong thế hệ trẻ hay không. Nếu điều kiện này đúng, Minor GC có thể được thực hiện một cách an toàn. Nếu không đúng, máy ảo sẽ kiểm tra xem cài đặt `HandlePromotionFailure` có cho phép thất bại bảo đảm không. Nếu cho phép, máy ảo sẽ kiểm tra xem không gian liên tục lớn nhất có sẵn trong thế hệ già có lớn hơn kích thước trung bình của các đối tượng đã thăng cấp vào thế hệ già trước đó hay không. Nếu lớn hơn, máy ảo sẽ thử thực hiện một lần Minor GC, mặc dù điều này có rủi ro. Nếu nhỏ hơn hoặc `HandlePromotionFailure` không cho phép rủi ro, máy ảo sẽ thực hiện Full GC.

#### Điều kiện kích hoạt Full GC

Đối với Minor GC, điều kiện kích hoạt rất đơn giản, khi không gian trong khu vực Eden đầy, một Minor GC sẽ được kích hoạt. Trong khi đó, Full GC phức tạp hơn và có các điều kiện sau:

**(1) Gọi `System.gc()`**

Việc gọi phương thức này đề nghị máy ảo thực hiện Full GC, mặc dù chỉ là đề nghị và không chắc chắn, nhưng trong nhiều trường hợp nó sẽ kích hoạt Full GC, tăng tần suất Full GC và tạo ra nhiều lần tạm dừng không đều. Do đó, rất khuyến khích không sử dụng phương thức này nếu không cần thiết, để máy ảo tự quản lý bộ nhớ của nó. Có thể vô hiệu hóa việc gọi `System.gc()` bằng cách sử dụng `-XX:DisableExplicitGC`.

**(2) Không gian trong thế hệ già không đủ**

Trường hợp phổ biến là khi đối tượng lớn trực tiếp vào thế hệ già, đối tượng trường hợp lâu dài vào thế hệ già, khi thực hiện Full GC sau khi không gian vẫn không đủ, sẽ ném ra `java.lang.OutOfMemoryError: Java heap space`. Để tránh Full GC do các nguyên nhân trên, khi tối ưu hóa, hãy cố gắng để đối tượng được thu gom trong giai đoạn Minor GC, để đối tượng sống lâu hơn trong thế hệ trẻ và không tạo ra đối tượng hoặc mảng quá lớn.

**(3) Không gian trong vùng phương thức không đủ**

Vùng phương thức trong khu vực dữ liệu chạy thời gian (Runtime Data Area) của JVM, trong HotSpot JVM thường được gọi là **vùng không thay đổi** (PermGen), vùng không thay đổi chứa thông tin mô tả lớp, hằng số, biến tĩnh, v.v. Khi có nhiều lớp được tải, lớp phản chiếu và phương thức được gọi, vùng không thay đổi có thể bị đầy, nếu không được cấu hình để sử dụng CMS GC, Full GC cũng sẽ được thực hiện. Nếu Full GC vẫn không thể thu gom được, JVM sẽ ném ra lỗi `java.lang.OutOfMemoryError: PermGen space`. Để tránh tình trạng vùng không thay đổi bị đầy gây ra Full GC, có thể tăng kích thước của Perm Gen hoặc chuyển sang sử dụng CMS GC.

**(4) Kích thước trung bình của Minor GC vượt quá không gian còn lại trong thế hệ già**

Nếu số liệu thống kê cho thấy kích thước trung bình của Minor GC trước đó lớn hơn không gian còn lại trong thế hệ già, thì không sẽ kích hoạt Minor GC mà sẽ chuyển sang kích hoạt Full GC.

**(5) Kích thước đối tượng lớn hơn không gian trống của khu vực To và thế hệ già**

Khi sao chép từ khu vực `Eden` và khu vực `From` sang khu vực `To`, nếu kích thước đối tượng lớn hơn bộ nhớ khả dụng của khu vực `To`, thì đối tượng sẽ được chuyển vào thế hệ già, và bộ nhớ khả dụng của thế hệ già nhỏ hơn kích thước của đối tượng.
