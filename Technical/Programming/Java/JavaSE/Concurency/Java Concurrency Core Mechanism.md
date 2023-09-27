---
title: Java Concurrency Core Mechanism
tags: [java, javase, concurrency]
categories: [java, javase, concurrency]
date created: 2023-07-16
date modified: 2023-09-26
---

# Cơ chế cốt lõi của Java Concurency

> Hỗ trợ đồng thời trong Java chủ yếu tập trung vào `java.util.concurrent`, viết tắt là J.U.C. Và trái tim của J.U.C là `AQS`.

## Giới thiệu về J.U.C

Gói `java.util.concurrent` (gọi tắt là J.U.C) trong Java cung cấp nhiều lớp công cụ đồng thời và là biểu hiện chính của khả năng đồng thời trong Java (lưu ý, không phải toàn bộ, một số khả năng đồng thời được hỗ trợ trong các gói khác). Chức năng chính của J.U.C có thể được chia thành:

- Lớp nguyên tử (Atomic Class) - Ví dụ: `AtomicInteger`, `AtomicIntegerArray`, `AtomicReference`, `AtomicStampedReference`, v.v.
- Khóa (Lock) - Ví dụ: `ReentrantLock`, `ReentrantReadWriteLock`, v.v.
- Bộ chứa đồng thời (Concurrent Collection) - Ví dụ: `ConcurrentHashMap`, `CopyOnWriteArrayList`, `CopyOnWriteArraySet`, v.v.
- Hàng đợi chặn - Ví dụ: `ArrayBlockingQueue`, `LinkedBlockingQueue`, v.v.
- Hàng đợi không chặn - Ví dụ: `ConcurrentLinkedQueue`, `LinkedTransferQueue`, v.v.
- Khung `Executor` (Thread Pool) - Ví dụ: `ThreadPoolExecutor`, `Executors`, v.v.

Theo quan điểm cá nhân của tôi, khung đồng thời của Java có thể được chia thành các tầng sau.

![JUC Architecture.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/JUC%20Architecture.png)

Từ hình khung đồng thời của Java, không khó để nhận ra rằng các lớp công cụ trong gói J.U.C được xây dựng dựa trên các cơ chế cốt lõi của đồng thời như `synchronized`, `volatile`, `CAS`, `ThreadLocal`. Vì vậy, để hiểu sâu hơn về các tính năng của các lớp công cụ J.U.C, tại sao chúng có các tính năng như vậy, chúng ta phải hiểu trước các cơ chế cốt lõi này.

## synchronized

> `synchronized` là từ khóa trong Java, được sử dụng để thực hiện đồng bộ hóa mutex.
>
> `synchronized` đảm bảo chỉ có một luồng có thể thực thi một phương thức hoặc một khối mã vào cùng một thời điểm.
>
> Nếu không cần các tính năng đồng bộ hóa nâng cao được cung cấp bởi `Lock`, `ReadWriteLock`, nên ưu tiên sử dụng `synchronized`, lý do như sau:
>
> - Từ Java 1.6 trở đi, `synchronized` đã được tối ưu hóa rất nhiều và hiệu suất của nó đã gần bằng với `Lock`, `ReadWriteLock`. Từ xu hướng, trong tương lai, Java vẫn sẽ tiếp tục tối ưu hóa `synchronized`, chứ không phải `ReentrantLock`.
> - `ReentrantLock` là API của Oracle JDK và không nhất thiết được hỗ trợ trong các phiên bản JDK khác; trong khi `synchronized` là một tính năng tích hợp của JVM, được hỗ trợ trong tất cả các phiên bản JDK.

### Ứng dụng của synchronized

`synchronized` có 3 cách sử dụng:

- **Phương thức đồng bộ hóa** - Đối với phương thức đồng bộ thông thường, khóa là đối tượng thể hiện hiện tại.
- **Phương thức tĩnh đồng bộ hóa** - Đối với phương thức tĩnh đồng bộ, khóa là đối tượng `Class` của lớp hiện tại.
- **Khối mã đồng bộ hóa** - Đối với khối mã đồng bộ, khóa là đối tượng được cấu hình trong dấu ngoặc `synchonized`.

> Lưu ý:
>
> Các lớp đồng bộ như `Vector`, `Hashtable` được sử dụng `synchonized` để đảm bảo tính an toàn của luồng. Tuy nhiên, các bộ chứa đồng bộ này không hoàn toàn an toàn với luồng. Trong các tình huống như lặp qua trình duyệt, xóa phần tử dựa trên điều kiện, có thể xảy ra tình huống không an toàn với luồng. Ngoài ra, trước khi tối ưu hóa `synchonized` trong Java 1.6, hiệu suất của nó không cao.
>
> Tóm lại, các bộ chứa đồng bộ này đã không còn được sử dụng trong các chương trình Java hiện đại.

#### Phương thức đồng bộ hóa

❌ Ví dụ sai - Ví dụ chưa được đồng bộ hóa

```java
public class NoSynchronizedDemo implements Runnable {

    public static final int MAX = 100000;

    private static int count = 0;

    public static void main(String[] args) throws InterruptedException {
        NoSynchronizedDemo instance = new NoSynchronizedDemo();
        Thread t1 = new Thread(instance);
        Thread t2 = new Thread(instance);
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println(count);
    }

    @Override
    public void run() {
        for (int i = 0; i < MAX; i++) {
            increase();
        }
    }

    public void increase() {
        count++;
    }

}
// Kết quả đầu ra: Số ngẫu nhiên nhỏ hơn 200000
```

Đồng bộ hóa phương thức của Java được đồng bộ hóa trên đối tượng sở hữu phương thức đó. Điều này có nghĩa là mỗi phương thức đồng bộ hóa của mỗi đối tượng sẽ được đồng bộ hóa trên các đối tượng khác nhau, tức là đối tượng mà phương thức đó thuộc về. Chỉ có một luồng có thể chạy trong khối đồng bộ hóa của phương thức đối tượng. Nếu có nhiều đối tượng tồn tại, một luồng có thể thực hiện các hoạt động trong khối đồng bộ hóa của một đối tượng trong một lần. Một đối tượng một luồng.

```java
public class SynchronizedDemo implements Runnable {

    private static final int MAX = 100000;

    private static int count = 0;

    public static void main(String[] args) throws InterruptedException {
        SynchronizedDemo instance = new SynchronizedDemo();
        Thread t1 = new Thread(instance);
        Thread t2 = new Thread(instance);
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println(count);
    }

    @Override
    public void run() {
        for (int i = 0; i < MAX; i++) {
            increase();
        }
    }

    /**
     * synchronized được sử dụng để đồng bộ hóa phương thức thông thường
     */
    public synchronized void increase() {
        count++;
    }

}
```

【Ví dụ】Ví dụ sai

```java
class Account {
  private int balance;
  // Chuyển khoản
  synchronized void transfer(
      Account target, int amt){
    if (this.balance > amt) {
      this.balance -= amt;
      target.balance += amt;
    }
  }
}
```

Trong đoạn mã này, có hai tài nguyên trong vùng quan trọng (crictial section), lần lượt là số dư của tài khoản chuyển ra `this.balance` và số dư của tài khoản chuyển vào `target.balance`, và được sử dụng một khóa `this`, phù hợp với những gì chúng tôi đã đề cập trước đó, nhiều tài nguyên có thể được bảo vệ bằng một khóa. Tuy nhiên, điều này chỉ là một giải pháp trông có vẻ đúng, tại sao lại như vậy?

Vấn đề nằm ở chỗ khóa `this`, khóa này chỉ có thể bảo vệ số dư của chính nó `this.balance`, như bạn không thể sử dụng khóa của gia đình để bảo vệ tài sản của người khác, cũng không thể sử dụng vé của mình để bảo vệ chỗ ngồi của người khác.

Cần đảm bảo rằng **khóa được sử dụng có thể bảo vệ tất cả các tài nguyên được bảo vệ**.

【Ví dụ】Cách đúng

```java
class Account {
  private Object lock；
  private int balance;
  private Account();
  // Truyền cùng một đối tượng khóa khi tạo Account
  public Account(Object lock) {
    this.lock = lock;
  }
  // Chuyển khoản
  void transfer(Account target, int amt){
    // Kiểm tra khóa được chia sẻ bởi tất cả các đối tượng ở đây
    synchronized(lock) {
      if (this.balance > amt) {
        this.balance -= amt;
        target.balance += amt;
      }
    }
  }
}
```

Phương pháp này thực sự có thể giải quyết vấn đề, nhưng có một chút khuyết điểm, nó yêu cầu đối tượng khóa được truyền vào khi tạo đối tượng Account, nếu đối tượng khóa truyền vào khi tạo đối tượng Account không phải là cùng một đối tượng, thì điều đó thật là tồi tệ, sẽ có một tình huống ngớ ngẩn khi sử dụng khóa nhà mình để bảo vệ tài sản của người khác. Trong các tình huống thực tế, mã tạo đối tượng Account có thể phân tán trong nhiều dự án, việc truyền chia sẻ khóa thực sự rất khó.

Phương pháp trên thiếu khả thi trong thực tế, chúng ta cần một phương pháp tốt hơn. Đó chính là **sử dụng Account.class làm khóa chia sẻ**. Account.class được chia sẻ bởi tất cả các đối tượng Account và đối tượng này được tạo ra khi máy ảo Java tải lớp Account, vì vậy chúng ta không cần phải lo lắng về sự duy nhất của nó. Sử dụng Account.class làm khóa chia sẻ, chúng ta không cần truyền vào khi tạo đối tượng nữa, mã ngắn gọn hơn.

【Ví dụ】Cách đúng

```java
class Account {
  private int balance;
  // Chuyển khoản
  void transfer(Account target, int amt){
    synchronized(Account.class) {
      if (this.balance > amt) {
        this.balance -= amt;
        target.balance += amt;
      }
    }
  }
}
```

#### Phương thức tĩnh đồng bộ hoá

Đồng bộ phương thức tĩnh đề cập đến việc đồng bộ trên đối tượng lớp chứa phương thức đó. Vì trong JVM, một lớp chỉ tương ứng với một đối tượng lớp, nên chỉ cho phép một luồng thực thi cùng một lúc trên một phương thức tĩnh trong cùng một lớp.

Đối với các phương thức tĩnh đồng bộ nằm trong các lớp khác nhau, một luồng có thể thực thi các phương thức tĩnh đồng bộ trong mỗi lớp mà không cần chờ đợi. Bất kể phương thức tĩnh đồng bộ nào trong lớp được gọi, chỉ có một luồng có thể thực thi cùng một lúc trên một lớp.

```java
public class SynchronizedDemo2 implements Runnable {

    private static final int MAX = 100000;

    private static int count = 0;

    public static void main(String[] args) throws InterruptedException {
        SynchronizedDemo2 instance = new SynchronizedDemo2();
        Thread t1 = new Thread(instance);
        Thread t2 = new Thread(instance);
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println(count);
    }

    @Override
    public void run() {
        for (int i = 0; i < MAX; i++) {
            increase();
        }
    }

    /**
     * synchronized phương thức tĩnh
     */
    public synchronized static void increase() {
        count++;
    }

}
```

#### Khối mã đồng bộ hoá

Đôi khi bạn không cần đồng bộ toàn bộ phương thức, mà chỉ cần đồng bộ một phần của phương thức. Trong Java, bạn có thể đồng bộ một phần của phương thức.

```java
@ThreadSafe
public class SynchronizedDemo05 implements Runnable {

    private static final int MAX = 100000;

    private static int count = 0;

    public static void main(String[] args) throws InterruptedException {
        SynchronizedDemo05 instance = new SynchronizedDemo05();
        Thread t1 = new Thread(instance);
        Thread t2 = new Thread(instance);
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println(count);
    }

    @Override
    public void run() {
        for (int i = 0; i < MAX; i++) {
            increase();
        }
    }

    /**
     * synchronized đồng bộ khối mã
     */
    public void increase() {
        synchronized (this) {
            count++;
        }
    }

}
```

Lưu ý rằng khối mã đồng bộ trong Java được xây dựng bằng cách đặt đối tượng trong dấu ngoặc đơn. Trong ví dụ trên, chúng ta sử dụng `this`, tức là đối tượng instance gọi phương thức `increase()`. Đối tượng được đặt trong dấu ngoặc đơn được gọi là đối tượng giám sát. Chỉ có một luồng có thể thực thi trong một phương thức Java được đồng bộ với cùng một đối tượng giám sát.

Nếu phương thức là tĩnh, bạn không thể sử dụng đối tượng `this` làm đối tượng giám sát nữa, mà phải sử dụng đối tượng `Class`, như sau:

```java
public class SynchronizedDemo3 implements Runnable {

    private static final int MAX = 100000;

    private static int count = 0;

    public static void main(String[] args) throws InterruptedException {
        SynchronizedDemo3 instance = new SynchronizedDemo3();
        Thread t1 = new Thread(instance);
        Thread t2 = new Thread(instance);
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println(count);
    }

    @Override
    public void run() {
        for (int i = 0; i < MAX; i++) {
            increase();
        }
    }

    /**
     * synchronized đồng bộ khối mã
     */
    public static void increase() {
        synchronized (SynchronizedDemo3.class) {
            count++;
        }
    }

}
```

### Nguyên lý của `synchronized`

**Khối mã `synchronized` được thực hiện bằng cách sử dụng cặp lệnh `monitorenter` và `monitorexit`, và đối tượng `Monitor` là đơn vị cơ bản để thực hiện đồng bộ**. Trước Java 6, việc thực hiện `Monitor` hoàn toàn dựa trên khóa mutex trong hệ điều hành, vì vậy việc đồng bộ là một hoạt động nặng nề vì cần chuyển từ chế độ người dùng sang chế độ kernel.

Nếu `synchronized` chỉ định rõ đối tượng tham số, thì đó là tham chiếu đến đối tượng; nếu không chỉ định rõ, thì đối tượng được sử dụng là đối tượng thực hiện phương thức `synchronized`, hoặc đối tượng `Class` nếu phương thức là tĩnh.

Khối mã `synchronized` trong Java cho phép một luồng thực thi có thể tái nhập vào khối mã `synchronized` mà không gặp vấn đề bế tắc (deadlock).

Khối mã `synchronized` là độc quyền (loại trừ lẫn nhau), có nghĩa là chỉ có một luồng được phép thực thi trong một phương thức Java được đồng bộ với cùng một đối tượng giám sát.

【Ví dụ】

```java
public void foo(Object lock) {
    synchronized (lock) {
      lock.hashCode();
    }
  }
  // Mã Java trên sẽ được biên dịch thành  bytecode sau đây
  public void foo(java.lang.Object);
    Code:
       0: aload_1
       1: dup
       2: astore_2
       3: monitorenter
       4: aload_1
       5: invokevirtual java/lang/Object.hashCode:()I
       8: pop
       9: aload_2
      10: monitorexit
      11: goto          19
      14: astore_3
      15: aload_2
      16: monitorexit
      17: aload_3
      18: athrow
      19: return
    Exception table:
       from    to  target type
           4    11    14   any
          14    17    14   any

```

#### Khối mã đồng bộ

Khi `synchronized` được sử dụng để đồng bộ một khối mã, nó được thực hiện bằng cách sử dụng các lệnh `monitorenter` và `monitorexit`. Khi thực hiện lệnh `monitorenter`, luồng sẽ nắm giữ đối tượng `Monitor`, và khi thoát khỏi lệnh `monitorenter`, luồng sẽ giải phóng đối tượng `Monitor` đó.

#### Phương thức đồng bộ

Khi `synchronized` được sử dụng để đồng bộ một phương thức, một cờ `ACC_SYNCHRONIZED` sẽ được đặt. Khi gọi phương thức, lệnh gọi sẽ kiểm tra xem phương thức có được đặt cờ `ACC_SYNCHRONIZED` hay không. Nếu có, luồng thực thi sẽ nắm giữ đối tượng `Monitor`, sau đó thực thi phương thức. Trong quá trình thực thi phương thức, các luồng khác sẽ không thể truy cập vào đối tượng `Monitor` đó, và khi phương thức thực thi xong, luồng sẽ giải phóng đối tượng `Monitor`.

#### Monitor

Mỗi thể hiện đối tượng sẽ có một `Monitor`, `Monitor` có thể được tạo và hủy cùng với đối tượng. `Monitor` được triển khai bởi `ObjectMonitor`, trong khi `ObjectMonitor` được triển khai bởi tệp `ObjectMonitor.hpp` của C++.

Khi nhiều luồng cùng truy cập vào một đoạn mã đồng bộ, các luồng sẽ được lưu trữ trong danh sách EntryList và các luồng đang bị chặn sẽ được thêm vào danh sách này. Sau đó, khi một luồng nhận được Monitor của đối tượng, Monitor dựa vào Mutex Lock của hệ điều hành để thực hiện việc loại trừ lẫn nhau. Nếu thành công trong việc yêu cầu Mutex, luồng sẽ giữ Mutex này và các luồng khác không thể nhận được Mutex.

Nếu một luồng gọi phương thức `wait()`, nó sẽ giải phóng Mutex hiện tại và chuyển sang danh sách WaitSet để chờ cho lần kích hoạt tiếp theo. Nếu luồng hiện tại hoàn thành phương thức mà không gặp vấn đề gì, nó cũng sẽ giải phóng Mutex.

### Tối ưu hóa của `synchronized`

> **Từ Java 1.6 trở đi, `synchronized` đã được tối ưu rất nhiều và hiệu suất của nó đã gần bằng với `Lock` và `ReadWriteLock`.**

#### Java Object Header

Trong JVM JDK1.6, một thực thể đối tượng trong bộ nhớ heap được chia thành ba phần: tiêu đề đối tượng (object header), dữ liệu thực thể và phần đệm căn chỉnh. Tiêu đề đối tượng Java bao gồm: Mark Word, con trỏ đến lớp và độ dài mảng.

Mark Word ghi lại thông tin liên quan đến đối tượng và khóa. Mark Word có độ dài 64 bit trong JVM 64 bit. Chúng ta cùng nhìn vào cấu trúc lưu trữ header của JVM 64 bit. Hình dưới đây:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230716225926.png)

Chức năng nâng cấp khóa phụ thuộc vào các bit cờ khóa trong mark word và có phải là cờ khóa thiên vị hay không. Khóa đồng bộ `synchronized` bắt đầu từ khóa thiên vị. Khi sự cạnh tranh ngày càng khốc liệt, khóa thiên vị được nâng cấp thành khóa nhẹ, và cuối cùng là khóa nặng, khóa cấp độ.

Java 1.6 đã giới thiệu khóa thiên vị và khóa nhẹ, từ đó `synchronized` có bốn trạng thái:

- **Trạng thái không khóa (unlocked)**
- **Trạng thái khóa thiên vị (biasble)**
- **Trạng thái khóa nhẹ (lightweight locked)**
- **Trạng thái khóa nặng (inflated)**

Khi JVM phát hiện ra các tình huống cạnh tranh khác nhau, nó sẽ tự động chuyển sang cài đặt khóa phù hợp.

Khi không có cạnh tranh xảy ra, mặc định sẽ sử dụng khóa thiên vị. JVM sử dụng thao tác CAS (so sánh và trao đổi) để thiết lập ID luồng trong phần Mark Word của tiêu đề đối tượng, để chỉ ra rằng đối tượng này được thiên vị cho luồng hiện tại, do đó không liên quan đến khóa mutex thực sự. Điều này dựa trên giả định rằng trong nhiều tình huống ứng dụng, hầu hết các đối tượng sẽ bị khóa bởi nhiều nhất một luồng trong suốt vòng đời của nó, việc sử dụng khóa thiên vị có thể giảm thiểu chi phí không cạnh tranh.

Nếu một luồng khác cố gắng khóa một đối tượng đã được thiên vị, JVM sẽ thu hồi (revoke) khóa thiên vị và chuyển sang cài đặt khóa nhẹ. Khóa nhẹ dựa trên thao tác CAS để cố gắng lấy khóa từ Mark Word của đối tượng. Nếu thử nghiệm thành công, luồng sẽ có được khóa trên đối tượng và Mark Word của đối tượng sẽ được cập nhật để đánh dấu là khóa nhẹ (00), cho biết đối tượng đang ở trạng thái khóa nhẹ,  
nếu không, nó tiếp tục nâng cấp thành khoá nặng.

#### Khóa thiên vị

Ý tưởng của khóa thiên vị là ưu tiên **luồng đầu tiên lấy được đối tượng khoá, luồng này không cần thực hiện đồng bộ hóa nữa, thậm chí không cần thực hiện thao tác CAS**.

#### Khóa nhẹ

**Khóa nhẹ** là một khái niệm đối lập với khóa nặng truyền thống, nó **sử dụng thao tác CAS để tránh chi phí của việc sử dụng khóa nặng**. Đối với hầu hết các khóa, không có sự cạnh tranh trong suốt chu kỳ đồng bộ, do đó không cần sử dụng khóa mutex. Thay vào đó, ta có thể sử dụng thao tác CAS để đồng bộ, và chỉ khi thao tác CAS thất bại, ta mới sử dụng khóa mutex.

Khi cố gắng lấy một đối tượng khoá, nếu trạng thái đối tượng khoá được đánh dấu là `0|01`, điều này có nghĩa là đối tượng khoá chưa được khóa (unlocked). Trong trường hợp này, JVM sẽ tạo một Lock Record trong ngăn xếp ảo của luồng hiện tại và sử dụng thao tác CAS để cập nhật Mark Word của đối tượng thành con trỏ Lock Record. Nếu thao tác CAS thành công, luồng sẽ có đối tượng khoá và Mark Word của đối tượng sẽ được cập nhật để đánh dấu là khóa nhẹ (00), cho biết đối tượng đang ở trạng thái khóa nhẹ.

#### Loại bỏ khóa / làm thô khóa

Ngoài tối ưu hóa khóa, Java cũng sử dụng trình biên dịch để tối ưu hóa khóa.

**(1) Loại bỏ khóa**

**Loại bỏ khóa** là quá trình loại bỏ khóa đối với dữ liệu chia sẻ được phát hiện không thể xảy ra cạnh tranh**.

Trình biên dịch JIT trong quá trình biên dịch động của khối mã đồng bộ sẽ sử dụng một kỹ thuật được gọi là phân tích thoát (escape analysis) để xác định xem khối mã đồng bộ sử dụng đối tượng khoá có thể chỉ được truy cập bởi một luồng và không được giải phóng cho các luồng khác hay không.

Nếu được xác định là đúng, trình biên dịch JIT sẽ không tạo mã máy cho việc yêu cầu và giải phóng khóa, điều này có nghĩa là khóa sẽ bị loại bỏ. Trong Java 7 và các phiên bản sau đó, điều này đã được tự động thực hiện và không cần cấu hình thủ công.

Một số mã mà ban đầu không có khóa có thể được tự động tạo ra khóa. Ví dụ, mã nối chuỗi dưới đây đã được tự động tối ưu hóa:

```java
public static String concatString(String s1, String s2, String s3) {
    return s1 + s2 + s3;
}
```

`String` là một lớp không thể thay đổi, trình biên dịch sẽ tự động tối ưu hóa việc nối chuỗi. Trong Java 1.5 trở về trước, nó sẽ được chuyển đổi thành một chuỗi các hoạt động `append()` của đối tượng `StringBuffer`:

```java
public static String concatString(String s1, String s2, String s3) {
    StringBuffer sb = new StringBuffer();
    sb.append(s1);
    sb.append(s2);
    sb.append(s3);
    return sb.toString();
}
```

Mỗi phương thức `append()` đều có một khối mã đồng bộ. JVM quan sát biến sb và sớm nhận ra rằng phạm vi động của nó bị giới hạn trong phương thức `concatString()`. Nghĩa là tất cả các tham chiếu sb không bao giờ thoát ra ngoài phương thức `concatString()`, các luồng khác không thể truy cập vào nó, do đó có thể loại bỏ khóa.

**(2) Tăng cường khoá**

Tương tự như loại bỏ khóa, khi trình biên dịch JIT thấy rằng một số khối mã đồng bộ liên tiếp sử dụng cùng một đối tượng khóa, trình biên dịch JIT sẽ hợp nhất các khối mã đồng bộ này thành một khối mã đồng bộ lớn hơn để tránh hiệu năng giảm do "lặp đi lặp lại việc yêu cầu và giải phóng cùng một đối tượng khóa".

Nếu **một chuỗi hoạt động liên tiếp luôn được thực hiện cho cùng một đối tượng với việc thêm và xóa khóa liên tục**, việc thêm và xóa khóa thường xuyên sẽ làm giảm hiệu năng.

Trong ví dụ mã nguồn ở phần trước, các phương thức `append()` liên tiếp thuộc loại này. Nếu **máy ảo phát hiện rằng có một chuỗi các hoạt động nhỏ nhặt như vậy đều khóa cùng một đối tượng, nó sẽ mở rộng phạm vi khóa (tăng cường) đến bên ngoài chuỗi thao tác**. Với ví dụ mã nguồn ở phần trước, nó sẽ mở rộng từ trước phép `append()` đầu tiên cho đến sau phép `append()` cuối cùng, chỉ cần khóa một lần là đủ.

#### Khoá xoay (Spin Lock)

Việc đồng bộ hóa mutex và chuyển sang trạng thái chặn đòi hỏi nhiều tài nguyên, vì vậy cần cố gắng tránh. Trong nhiều ứng dụng, trạng thái khóa của dữ liệu chia sẻ chỉ tồn tại trong một khoảng thời gian rất ngắn. Ý tưởng của Khoá xoay là khi một luồng yêu cầu khóa dữ liệu chia sẻ, nó sẽ thực hiện một vòng lặp bận rộn (vòng quay) trong một khoảng thời gian nhất định. Nếu trong khoảng thời gian đó luồng có thể nhận được khóa, nó có thể tránh trạng thái chặn.

Mặc dù khóa vòng quay có thể tránh trạng thái chặn và giảm tải, nhưng nó yêu cầu thực hiện vòng lặp bận rộn và chiếm thời gian CPU. Nó chỉ phù hợp với các tình huống mà trạng thái khóa của dữ liệu chia sẻ rất ngắn.

Trong Java 1.6, khóa vòng quay được giới thiệu với tính năng tự điều chỉnh. Tự điều chỉnh có nghĩa là số lần vòng quay không còn cố định nữa, mà được quyết định bởi số lần vòng quay trước đó trên cùng một khóa và trạng thái của chủ sở hữu khóa.

### Những hiểu lầm về sử dụng synchronized

#### Lỗi do việc sử dụng synchronized không đúng phạm vi

```java
public class Interesting {

    volatile int a = 1;
    volatile int b = 1;

    public static void main(String[] args) {
        Interesting interesting = new Interesting();
        new Thread(() -> interesting.add()).start();
        new Thread(() -> interesting.compare()).start();
    }

    public synchronized void add() {
        log.info("add start");
        for (int i = 0; i < 10000; i++) {
            a++;
            b++;
        }
        log.info("add done");
    }

    public void compare() {
        log.info("compare start");
        for (int i = 0; i < 10000; i++) {
            //a luôn bằng b phải không?
            if (a < b) {
                log.info("a:{},b:{},{}", a, b, a > b);
                //Cuối cùng a > b phải luôn là false phải không?
            }
        }
        log.info("compare done");
    }

}
```

【Kết quả】

```
00:31:24.152 [Thread-0] INFO com.hnv99.javacore.concurrent.sync.synchronizedWrongExample1 -- add start
00:31:24.152 [Thread-1] INFO com.hnv99.javacore.concurrent.sync.synchronizedWrongExample1 -- compare start
00:31:24.156 [Thread-0] INFO com.hnv99.javacore.concurrent.sync.synchronizedWrongExample1 -- add done
00:31:24.156 [Thread-1] INFO com.hnv99.javacore.concurrent.sync.synchronizedWrongExample1 -- a:3012,b:3354,false
00:31:24.157 [Thread-1] INFO com.hnv99.javacore.concurrent.sync.synchronizedWrongExample1 -- compare done
```

Lý do gây ra sự lộn xộn này là do hai luồng thực hiện lần lượt các phương thức add và compare, và các phần logic trong các phương thức này không phải là nguyên tử: các phép a++ và b++ có thể xen kẽ trong mã so sánh của phương thức compare; điều cần lưu ý hơn là phép so sánh a < b trong mã nguồn là một dãy ba bước gồm tải a, tải b và so sánh, mặc dù mã nguồn chỉ là một dòng nhưng nó không phải là nguyên tử.

Vì vậy, cách làm đúng là đặt khóa phương thức cho cả add và compare, đảm bảo rằng khi add được thực hiện, compare không thể đọc a và b:

```java
public synchronized void add()
public synchronized void compare()
```

Trước khi sử dụng khóa để giải quyết vấn đề, chúng ta phải làm rõ rằng chúng ta đang bảo vệ logic nào và tình huống thực thi đa luồng như thế nào.

#### Lỗi khi sử dụng synchronized để bảo vệ đối tượng

Trước khi thực hiện khóa, bạn cần hiểu rằng khóa và đối tượng được bảo vệ có cùng mức độ.

Trường tĩnh thuộc về lớp, chỉ có khóa cấp lớp mới có thể bảo vệ; trong khi trường không tĩnh thuộc về thể hiện của lớp, khóa cấp thể hiện có thể bảo vệ.

```java
@Slf4j
public class synchronizedWrongExample2 {

    public static void main(String[] args) {
        synchronized_wrong_example2 demo = new synchronized_wrong_example2();
        System.out.println(demo.wrong(1000000));
        System.out.println(demo.right(1000000));
    }

    public int wrong(int count) {
        Data.reset();
        IntStream.rangeClosed(1, count).parallel().forEach(i -> new Data().wrong());
        return Data.getCounter();
    }

    public int right(int count) {
        Data.reset();
        IntStream.rangeClosed(1, count).parallel().forEach(i -> new Data().right());
        return Data.getCounter();
    }

    private static class Data {

        @Getter
        private static int counter = 0;
        private static Object locker = new Object();

        public static int reset() {
            counter = 0;
            return counter;
        }

        public synchronized void wrong() {
            counter++;
        }

        public void right() {
            synchronized (locker) {
                counter++;
            }
        }

    }

}
```

Trong phương thức `wrong`, việc thử thêm khóa synchronized cấp đối tượng cho một đối tượng tĩnh không đảm bảo an toàn đa luồng.

#### Vấn đề do độ tinh vi của khóa

Để tối đa hóa hiệu suất đồng thời, chúng ta nên giảm phạm vi khóa càng nhỏ càng tốt.

Nếu sau khi xem xét kỹ lưỡng phạm vi áp dụng khóa mà hiệu suất vẫn không đáp ứng yêu cầu, chúng ta cần xem xét vấn đề về độ tinh vi của khóa, tức là phân biệt các tình huống đọc và ghi cũng như xung đột truy cập tài nguyên, và xem xét việc sử dụng khóa theo cách bi quan hoặc lạc quan.

```java
public class synchronizedWrongExample3 {

    public static void main(String[] args) {
        Demo demo = new Demo();
        demo.wrong();
        demo.right();
    }

    private static class Demo {

        private List<Integer> data = new ArrayList<>();

        private void slow() {
            try {
                TimeUnit.MILLISECONDS.sleep(10);
            } catch (InterruptedException e) {
            }
        }

        public int wrong() {
            long begin = System.currentTimeMillis();
            IntStream.rangeClosed(1, 1000).parallel().forEach(i -> {
                synchronized (this) {
                    slow();
                    data.add(i);
                }
            });
            log.info("took:{}", System.currentTimeMillis() - begin);
            return data.size();
        }

        public int right() {
            long begin = System.currentTimeMillis();
            IntStream.rangeClosed(1, 1000).parallel().forEach(i -> {
                slow();
                synchronized (data) {
                    data.add(i);
                }
            });
            log.info("took:{}", System.currentTimeMillis() - begin);
            return data.size();
        }

    }

}
```

## volatile

### Điểm chính của volatile

`volatile` là một phiên bản nhẹ của `synchronized`, nó đảm bảo tính "nhìn thấy" của biến chia sẻ trong phát triển đa nhân.

Biến được đánh dấu bằng `volatile` có các đặc điểm sau:

- **Tính nhìn thấy của luồng** - Đảm bảo tính nhìn thấy của biến chia sẻ khi các luồng khác nhau thực hiện thao tác trên biến này, tức là một luồng sửa đổi một biến chia sẻ, luồng khác có thể đọc giá trị đã được sửa đổi đó.
- **Ngăn chặn việc sắp xếp lại chỉ thị**.
- **Không đảm bảo tính nguyên tử**.

Chúng ta biết rằng an toàn luồng yêu cầu tính nhìn thấy, tính nguyên tử và tính tuần tự của thứ tự. `volatile` không đảm bảo tính nguyên tử, do đó nó không thể đảm bảo an toàn luồng một cách toàn diện.

### Ứng dụng của volatile

Nếu từ khóa `volatile` được sử dụng đúng cách, nó có thể giảm thiểu chi phí sử dụng và thực thi so với `synchronized`, vì nó không gây ra việc lập lịch và chuyển đổi ngữ cảnh luồng. Tuy nhiên, **`volatile` không thể thay thế `synchronized` vì nó không đảm bảo tính nguyên tử của các hoạt động**.

Thường thì, **việc sử dụng `volatile` phải đáp ứng hai điều kiện sau**:

- **Thao tác ghi không phụ thuộc vào giá trị hiện tại của biến**.
- **Biến không được chứa trong biểu thức có chứa biến khác**.

【Ví dụ】Cờ trạng thái

```java
volatile boolean flag = false;

while(!flag) {
    doSomething();
}

public void setFlag() {
    flag = true;
}
```

【Ví dụ】Sử dụng khóa kép để triển khai mẫu Singleton an toàn luồng

```java
class Singleton {
    private volatile static Singleton instance = null;

    private Singleton() {}

    public static Singleton getInstance() {
        if(instance==null) {
            synchronized (Singleton.class) {
                if(instance==null)
                    instance = new Singleton();
            }
        }
        return instance;
    }
}
```

### Nguyên lý của volatile

Quan sát mã hợp ngữ được tạo ra khi thêm từ khóa `volatile` và không có từ khóa `volatile`, ta nhận thấy rằng **khi thêm từ khóa `volatile`, một chỉ thị tiền tố `lock` được thêm vào**. **Chỉ thị tiền tố `lock` trong thực tế là một rào cản bộ nhớ**, nó cung cấp 3 chức năng:

- Nó đảm bảo các chỉ thị sau nó không được xếp vào vị trí trước rào cản bộ nhớ, và các chỉ thị trước nó không được xếp vào vị trí sau rào cản bộ nhớ; tức là khi đến lệnh chứa rào cản bộ nhớ này, các hoạt động phía trước đã hoàn thành;
- Nó buộc việc sửa đổi dữ liệu trong cache phải được ghi ngay lập tức vào bộ nhớ chính;
- Nếu là hoạt động ghi, nó sẽ khiến cho hàng cache tương ứng trong CPU khác trở thành không hợp lệ.

### Vấn đề của volatile

Trong các điểm chính của `volatile`, đã đề cập rằng **`volatile` không đảm bảo tính nguyên tử, do đó `volatile` không đảm bảo an toàn luồng**.

Vậy làm thế nào để đảm bảo an toàn luồng? Có hai giải pháp:

- `volatile` + `synchronized` - có thể tham khảo: 【Ví dụ】Sử dụng khóa kép để triển khai mẫu Singleton an toàn luồng
- Sử dụng lớp nguyên tử thay thế `volatile`

## CAS

### Điểm chính của CAS

Đồng bộ hoá Mutex (Mutal Exclusion) là biện pháp đảm bảo tính chính xác trong đa luồng phổ biến nhất.

**Vấn đề chính của đồng bộ hoá loại trừ lẫn nhau là vấn đề hiệu suất do việc chặn và đánh thức luồng gây ra**, do đó, nó còn được gọi là đồng bộ hoá chặn. Đồng bộ hóa loại trừ lẫn nhau là một chiến lược đồng thời bi quan, luôn tin rằng miễn là các biện pháp đồng bộ hóa chính xác không được thực hiện, thì chắc chắn sẽ xảy ra sự cố. Bất kể dữ liệu được chia sẻ có thật sự có cuộc tranh giành hay không, nó vẫn phải được khóa (mô hình khái niệm được thảo luận ở đây, trên thực tế, máy ảo tối ưu hóa phần lớn việc khóa không cần thiết), chuyển chế độ từ người dùng sang kernel, duy trì bộ điếm khóa và kiểm tra xem có luồng đã bị chặn cần được kích hoạt hay không.

Cùng với sự phát triển của tập lệnh phần cứng, chúng ta có thể sử dụng chiến lược đồng thời lạc quan dựa trên phát hiện xung đột: thực hiện hoạt động trước, nếu không có luồng khác cạnh tranh dữ liệu chia sẻ, thì hoạt động sẽ thành công, nếu không, thực hiện biện pháp bù (liên tục thử lại cho đến khi thành công). Chiến lược đồng thời lạc quan này không yêu cầu chặn luồng, do đó được gọi là đồng bộ không chặn.

Tại sao nói rằng khóa lạc quan cần **sự phát triển của tập lệnh phần cứng** để thực hiện? Bởi vì cần có tính nguyên tử trong hai bước hoạt động và phát hiện xung đột. Điều này được thực hiện bởi phần cứng, nếu sử dụng đồng bộ chặn để đảm bảo, nó sẽ không có ý nghĩa. Thao tác nguyên tử được hỗ trợ phổ biến nhất là: CAS.

**CAS (Compare And Swap), ý nghĩa từ chính là so sánh và hoán đổi. CAS có 3 toán hạng, lần lượt là: giá trị bộ nhớ M, giá trị kỳ vọng E và giá trị cập nhật U. Chỉ khi mà giá trị bộ nhớ M và giá trị kỳ vọng E bằng nhau thì mới sửa đổi giá trị bộ nhớ M thành U, nếu không thì không làm gì cả**.

### Ứng dụng của CAS

**CAS chỉ phù hợp với các trường hợp ít xung đột luồng**.

Các tình huống ứng dụng điển hình của CAS là:

- Lớp Atomic (Atomic Class)
- Khoá xoay (Spin Lock)

#### Lớp Atomic

> Lớp nguyên tử là ứng dụng điển hình nhất của CAS trong Java.

Hãy xem một đoạn mã thông thường.

```java
if(a==b) {
    a++;
}
```

Nếu giá trị của `a` bị thay đổi trước khi thực hiện `a++`, thì sao? Liệu chúng ta có thể nhận được giá trị kỳ vọng không? Nguyên nhân gây ra vấn đề này là do trong môi trường song song, đoạn mã trên không phải là hoạt động nguyên tử và có thể bị chiếm lấy bất cứ lúc nào bởi các luồng khác.

Giải quyết vấn đề này theo cách cổ điển nhất là sử dụng phương thức `incrementAndGet` của lớp nguyên tử.

```java
public class AtomicIntegerDemo {

    public static void main(String[] args) throws InterruptedException {
        ExecutorService executorService = Executors.newFixedThreadPool(3);
        final AtomicInteger count = new AtomicInteger(0);
        for (int i = 0; i < 10; i++) {
            executorService.execute(new Runnable() {
                @Override
                public void run() {
                    count.incrementAndGet();
                }
            });
        }

        executorService.shutdown();
        executorService.awaitTermination(3, TimeUnit.SECONDS);
        System.out.println("Final Count is : " + count.get());
    }

}
```

Gói J.U.C cung cấp `AtomicBoolean`, `AtomicInteger`, `AtomicLong` tương ứng với các hoạt động nguyên tử trên kiểu dữ liệu `Boolean`, `Integer`, và `Long`. Các hoạt động tương tự như ví dụ trên, không lặp lại ở đây.

#### Spin Lock (Khóa xoay)

Spin Lock (Khóa xoay) được thực hiện bằng cách sử dụng lớp Atomic (thực chất là CAS) để tạo ra khóa xoay.

Khóa xoay là một loại khóa mà luồng sẽ kiểm tra liên tục biến khóa xem có khả dụng hay không cho đến khi thành công. Vì luồng duy trì việc thực thi trong tiến trình này, nên đây là một loại chờ bận rộn. Một khi đã có được khóa xoay, luồng sẽ giữ khóa đó cho đến khi tường minh giải phóng khóa xoay.

Ví dụ: Ví dụ không an toàn đối với luồng

```java
public class AtomicReferenceDemo {

    private static int ticket = 10;

    public static void main(String[] args) {
        ExecutorService executorService = Executors.newFixedThreadPool(3);
        for (int i = 0; i < 5; i++) {
            executorService.execute(new MyThread());
        }
        executorService.shutdown();
    }

    static class MyThread implements Runnable {

        @Override
        public void run() {
            while (ticket > 0) {
                System.out.println(Thread.currentThread().getName() + " đã bán vé thứ " + ticket);
                ticket--;
            }
        }

    }

}
```

Kết quả đầu ra:

```
pool-1-thread-2 đã bán vé thứ 10
pool-1-thread-1 đã bán vé thứ 10
pool-1-thread-3 đã bán vé thứ 10
pool-1-thread-1 đã bán vé thứ 8
pool-1-thread-2 đã bán vé thứ 9
pool-1-thread-1 đã bán vé thứ 6
pool-1-thread-3 đã bán vé thứ 7
pool-1-thread-1 đã bán vé thứ 4
pool-1-thread-2 đã bán vé thứ 5
pool-1-thread-1 đã bán vé thứ 2
pool-1-thread-3 đã bán vé thứ 3
pool-1-thread-2 đã bán vé thứ 1
```

Rõ ràng, đã xảy ra tình huống bán vé trùng lặp.

【Ví dụ】Sử dụng khóa xoay để đảm bảo an toàn đối với luồng

Có thể sử dụng khóa xoay này để đảm bảo an toàn đối với luồng, dưới đây sử dụng `AtomicReference` để triển khai một khóa xoay.

```java
public class AtomicReferenceDemo2 {

    private static int ticket = 10;

    public static void main(String[] args) {
        threadSafeDemo();
    }

    private static void threadSafeDemo() {
        SpinLock lock = new SpinLock();
        ExecutorService executorService = Executors.newFixedThreadPool(3);
        for (int i = 0; i < 5; i++) {
            executorService.execute(new MyThread(lock));
        }
        executorService.shutdown();
    }

    static class SpinLock {

        private AtomicReference<Thread> atomicReference = new AtomicReference<>();

        public void lock() {
            Thread current = Thread.currentThread();
            while (!atomicReference.compareAndSet(null, current)) {}
        }

        public void unlock() {
            Thread current = Thread.currentThread();
            atomicReference.compareAndSet(current, null);
        }

    }

    static class MyThread implements Runnable {

        private SpinLock lock;

        public MyThread(SpinLock lock) {
            this.lock = lock;
        }

        @Override
        public void run() {
            while (ticket > 0) {
                lock.lock();
                if (ticket > 0) {
                    System.out.println(Thread.currentThread().getName() + " đã bán vé thứ " + ticket);
                    ticket--;
                }
                lock.unlock();
            }
        }

    }

}
```

Kết quả đầu ra:

```
pool-1-thread-2 đã bán vé thứ 10
pool-1-thread-1 đã bán vé thứ 9
pool-1-thread-3 đã bán vé thứ 8
pool-1-thread-2 đã bán vé thứ 7
pool-1-thread-3 đã bán vé thứ 6
pool-1-thread-1 đã bán vé thứ 5
pool-1-thread-2 đã bán vé thứ 4
pool-1-thread-1 đã bán vé thứ 3
pool-1-thread-3 đã bán vé thứ 2
pool-1-thread-1 đã bán vé thứ 1
```

### Nguyên lý của CAS

Trong Java, chúng ta chủ yếu sử dụng thao tác CAS (Compare and Swap) được cung cấp bởi lớp `Unsafe`. Thao tác CAS trong `Unsafe` phụ thuộc vào các chỉ thị phần cứng **`Atomic::cmpxchg`** được triển khai bởi JVM cho từng hệ điều hành khác nhau. Triển khai của `Atomic::cmpxchg` sử dụng thao tác CAS trong ngôn ngữ ghi nhớ và sử dụng tín hiệu `lock` do CPU cung cấp để đảm bảo tính nguyên tử.

### Vấn đề của CAS

Nói chung, CAS có hiệu suất cao hơn so với khóa. Bởi vì CAS là một thuật toán không chặn, nên nó tránh được thời gian chờ đợi khi luồng bị chặn và kích hoạt.

Tuy nhiên, mọi thứ đều có lợi và hại, CAS cũng tồn tại ba vấn đề lớn:

- Vấn đề ABA
- Thời gian lặp dài và chi phí cao
- Chỉ có thể bảo đảm tính nguyên tử cho một biến chia sẻ duy nhất

#### Vấn đề ABA

**Nếu một biến được đọc lần đầu với giá trị A, sau đó thay đổi thành B và sau đó lại được thay đổi trở lại thành A, thì hoạt động CAS sẽ sai lầm nghĩ rằng nó chưa bao giờ bị thay đổi**.

Gói J.U.C cung cấp một lớp tham chiếu nguyên tử có dấu **`AtomicStampedReference` để giải quyết vấn đề này**, nó có thể bảo vệ tính chính xác của CAS thông qua việc kiểm soát phiên bản của giá trị biến. Trong hầu hết các tình huống, vấn đề ABA không ảnh hưởng tới tính chính xác của chương trình song song. Nếu muốn giải quyết vấn đề ABA, sử dụng **đồng bộ tuần tự truyền thống có thể hiệu quả hơn so với lớp nguyên tử**.

#### Thời gian lặp lại kéo dài và tốn kém

**CAS xoay (thử liên tục cho tới khi thành công) sẽ gây ra khối lượng công việc rất lớn cho CPU nếu không thành công trong khoảng thời gian dài**.

Nếu JVM có khả năng hỗ trợ chỉ thị `pause` được cung cấp bởi bộ xử lý, hiệu suất sẽ được nâng cao một chút. Chỉ thị `pause` có hai tác dụng:

- Nó có thể trì hoãn việc thực thi các chỉ thị trong pipeline (de-pipeline), giúp CPU không tiêu tốn quá nhiều nguồn lực để thực thi và khoảng thời gian trì hoãn phụ thuộc vào phiên bản cụ thể của việc triển khai, trên một số bộ xử lý, khoảng thời gian trì hoãn là 0.
- Nó có thể tránh việc xóa luồng pipeline của CPU (CPU pipeline flush) khi thoát khỏi vòng lặp do xung đột tuần tự hóa bộ nhớ (memory order violation), từ đó nâng cao hiệu suất của CPU.

So sánh tiêu tốn nguồn lực CPU, ngay cả khi không có công dụng nào, vẫn sẽ làm một số công việc vô ích.

#### Chỉ đảm bảo tính nguyên tử của một biến chia sẻ

Khi thực hiện các hoạt động trên một biến chia sẻ, chúng ta có thể sử dụng phương pháp CAS lặp để đảm bảo tính nguyên tử của hoạt động. Tuy nhiên, khi thao tác trên nhiều biến chia sẻ, CAS lặp không thể đảm bảo tính nguyên tử của các hoạt động. Lúc này, ta có thể sử dụng khóa.

Hoặc còn một cách thông minh hơn là kết hợp nhiều biến chia sẻ thành một biến duy nhất để thực hiện các hoạt động. Ví dụ: có hai biến chia sẻ `i = 2` và `j = a`, kết hợp lại thành `ij = 2a`, sau đó sử dụng CAS để thao tác với `ij`. Từ phiên bản Java 1.5 trở đi, JDK cung cấp lớp `AtomicReference` để đảm bảo tính nguyên tử giữa các đối tượng được tham chiếu, bạn có thể gom nhiều biến vào trong một object và tiến hành CAS.

## ThreadLocal

> **`ThreadLocal` là một lớp công cụ để lưu trữ bản sao cục bộ của luồng**.
>
> Để đảm bảo an toàn cho luồng, không nhất thiết phải đồng bộ hóa. Đồng bộ chỉ đảm bảo tính chính xác khi tranh chấp dữ liệu được chia sẻ, nếu một phương thức không liên quan đến dữ liệu được chia sẻ, thì tự nhiên không cần đồng bộ hóa.
>
> Có các **phương án không có đồng bộ** trong Java:
>
> - **Mã có thể tái nhập** - còn gọi là mã nguyên thuỷ. Nếu một phương thức, kết quả trả về của nó có thể dự đoán được, tức là chỉ cần nhập vào dữ liệu giống nhau, kết quả trả về sẽ giống nhau, điều này thoải mãn tính tái nhập và tất nhiên là an toàn cho luồng.
> - **Lưu trữ riêng từng luồng** - Sử dụng `ThreadLocal`, tạo ra một bản sao cục bộ cho biến được chia sẻ trong mỗi luồng. Bản sao này chỉ có thể được truy cập thông qua luồng hiện tại và các luồng khác không thể truy cập, do đó tự nhiên là an toàn cho luồng.

### Ứng dụng của ThreadLocal

Các phương thức của `ThreadLocal`:

```java
public class ThreadLocal<T> {
    public T get() {}
    public void set(T value) {}
    public void remove() {}
    public static <S> ThreadLocal<S> withInitial(Supplier<? extends S> supplier) {}
}
```

> Giải thích:
>
> - `get` - Dùng để lấy bản sao biến được lưu trữ trong `ThreadLocal` trong luồng hiện tại.
> - `set` - Dùng để thiết lập bản sao biến trong luồng hiện tại.
> - `remove` - Dùng để xóa bản sao biến trong luồng hiện tại. Nếu sau đó, biến cục bộ của luồng này được đọc lại, giá trị sẽ được khởi tạo lại thông qua việc gọi phương thức `initialValue`, trừ khi giá trị đã được thiết lập bởi một luồng nằm ở giữa. Điều này có thể dẫn đến việc gọi phương thức `initialValue` nhiều lần trong cùng một luồng.
>- `initialValue` – Đặt giá trị ban đầu cho ThreadLocal khi gọi hàm `get`, yêu cầu viết lại phương thức `initialValue`.

ThreadLocal thông thường được sử dụng để ngăn chặn việc chia sẻ các biến Singleton hoặc biến toàn cục có thể thay đổi. Các tình huống ứng dụng điển hình bao gồm: quản lý kết nối cơ sở dữ liệu, phiên làm việc.

【Ví dụ】Kết nối cơ sở dữ liệu

```java
private static ThreadLocal<Connection> connectionHolder = new ThreadLocal<Connection>() {
    @Override
    public Connection initialValue() {
        return DriverManager.getConnection(DB_URL);
    }
};

public static Connection getConnection() {
    return connectionHolder.get();
}
```

【Ví dụ】Quản lý phiên làm việc

```java
private static final ThreadLocal<Session> sessionHolder = new ThreadLocal<>();

public static Session getSession() {
    Session session = (Session) sessionHolder.get();
    try {
        if (session == null) {
            session = createSession();
            sessionHolder.set(session);
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
    return session;
}
```

【Ví dụ】Đầy đủ về việc sử dụng `ThreadLocal`

```java
public class ThreadLocalDemo {

    private static ThreadLocal<Integer> threadLocal = new ThreadLocal<Integer>() {
        @Override
        protected Integer initialValue() {
            return 0;
        }
    };

    public static void main(String[] args) {
        ExecutorService executorService = Executors.newFixedThreadPool(10);
        for (int i = 0; i < 10; i++) {
            executorService.execute(new MyThread());
        }
        executorService.shutdown();
    }

    static class MyThread implements Runnable {

        @Override
        public void run() {
            int count = threadLocal.get();
            for (int i = 0; i < 10; i++) {
                try {
                    count++;
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            threadLocal.set(count);
            threadLocal.remove();
            System.out.println(Thread.currentThread().getName() + " : " + count);
        }

    }

}
```

Output: count = 10

### Nguyên lý của ThreadLocal

#### Cấu trúc lưu trữ

**Trong lớp `Thread`, có một thành viên kiểu `ThreadLocal.ThreadLocalMap` được duy trì**. Thành viên này được sử dụng để lưu trữ bản sao biến riêng của luồng hiện tại.

`ThreadLocalMap` là một lớp con của `ThreadLocal`, nó duy trì một mảng các đối tượng `Entry`. **`Entry` kế thừa từ `WeakReference`**, do đó nó là tham chiếu yếu. Entry được sử dụng để lưu giữ cặp khóa-giá trị, trong đó:

- Khóa là đối tượng ThreadLocal;
- Giá trị là đối tượng (bản sao biến) được chuyển vào.

```java
public class Thread implements Runnable {
    // ...
    ThreadLocal.ThreadLocalMap threadLocals = null;
    // ...
}

static class ThreadLocalMap {
    // ...
    static class Entry extends WeakReference<ThreadLocal<?>> {
        /** The value associated with this ThreadLocal. */
        Object value;

        Entry(ThreadLocal<?> k, Object v) {
            super(k);
            value = v;
        }
    }
    // ...
}
```

#### Cách giải quyết xung đột Hash

Mặc dù `ThreadLocalMap` có cấu trúc dữ liệu tương tự như một `Map`, nhưng nó không triển khai giao diện của `Map`. Nó không hỗ trợ phương thức `next` trong giao diện của `Map`, điều này có nghĩa là cách giải quyết xung đột Hash trong `ThreadLocalMap` không phải là **dùng danh sách liên kết**.

Thực tế, **`ThreadLocalMap` sử dụng phương pháp tìm kiếm tuyến tính để giải quyết xung đột Hash**. Phương pháp tìm kiếm tuyến tính được hiểu là dựa vào giá trị hashcode ban đầu của key để xác định vị trí của các thành phần trong mảng table. Nếu vị trí này đã bị chiếm bởi một key khác, thuật toán sẽ sử dụng một khoảng cố định để tìm kiếm vị trí tiếp theo và tiếp tục kiểm tra cho đến khi tìm được vị trí rỗng để lưu trữ.

#### Vấn đề rò rỉ bộ nhớ

Lớp `Entry` trong `ThreadLocalMap` kế thừa từ lớp `WeakReference`, do đó **key (đối tượng ThreadLocal) là weak reference và value (bản sao biến) là strong reference**.

- Nếu không có tham chiếu mạnh bên ngoài để giữ chúng, đối tượng ThreadLocal sẽ được thu hồi trong lần GC tiếp theo.
- Lúc này, key trong `Entry` đã được thu hồi nhưng value vẫn còn tồn tại do là strong reference. Nếu luồng tạo ra ThreadLocal tiếp tục hoạt động, value sẽ không bao giờ được thu hồi và gây **rò rỉ bộ nhớ**.

Vậy làm sao để tránh rò rỉ bộ nhớ? Phương pháp đó là: **sau khi sử dụng phương thức `set` của `ThreadLocal`, gọi phương thức `remove` một cách tường minh**.

```java
ThreadLocal<String> threadLocal = new ThreadLocal();
try {
    threadLocal.set("xxx");
    // ...
} finally {
    threadLocal.remove();
}
```

### Sai lầm về ThreadLocal

ThreadLocal được sử dụng để cô lập biến giữa các luồng và chia sẻ giữa các phương thức hoặc lớp.

Như đã đề cập ở trên, ThreadLocal là một công cụ để cô lập luồng. Như vậy, việc sử dụng ThreadLocal có đảm bảo an toàn tuyệt đối không?

#### Các ví dụ sai về ThreadLocal

Sử dụng Spring Boot để tạo một ứng dụng web, sử dụng ThreadLocal để lưu trữ một giá trị Integer, đại diện cho thông tin người dùng cần được lưu trong luồng. Giá trị này ban đầu là null.

```java
    private ThreadLocal<Integer> currentUser = ThreadLocal.withInitial(() -> null);

    @GetMapping("wrong")
    public Map<String, String> wrong(@RequestParam("id") Integer userId) {
        // Trước khi đặt thông tin người dùng, truy vấn thông tin người dùng trong ThreadLocal một lần
        String before = Thread.currentThread().getName() + ":" + currentUser.get();
        // Đặt thông tin người dùng vào ThreadLocal
        currentUser.set(userId);
        // Sau khi đặt thông tin người dùng, truy vấn lại thông tin người dùng trong ThreadLocal một lần nữa
        String after = Thread.currentThread().getName() + ":" + currentUser.get();
        // Tổng hợp và xuất kết quả của hai lần truy vấn
        Map<String, String> result = new HashMap<>();
        result.put("before", before);
        result.put("after", after);
        return result;
    }
```

【Kỳ vọng】Dựa trên logic code, chúng ta mong đợi giá trị nhận được trong lần đầu tiên luôn là null.

【Thực tế】

Để dễ tái hiện, thiết lập số luồng làm việc của Tomcat thành 1:

```

server.tomcat.max-threads=1

```

- Khi truy cập id = 1, kết quả như mong đợi.
- Khi truy cập id = 2, giá trị "before" không phải là null mà là 1, không khớp với kỳ vọng.

【Phân tích】Sự khác biệt giữa thực tế và kỳ vọng

Chương trình Spring Boot chạy trong Tomcat và các luồng thực thi chương trình sẽ được xử lí bởi các luồng công việc của Tomcat. Các luồng công việc này dựa vào một bộ xử lí đa luồng. **Bộ xử lí đa luồng sẽ tái sử dụng một số lượng cố định các luồng, khi có việc tái sử dụng luồng, rất có thể giá trị nhận được từ ThreadLocal là giá trị còn lại từ yêu cầu của người dùng khác trong quá khứ. Lúc này, thông tin người dùng trong ThreadLocal chính là thông tin của người dùng khác**.

**Không thể cho rằng không có việc bật đa luồng một cách rõ ràng sẽ không gây ra vấn đề an toàn luồng**. Khi sử dụng các công cụ như ThreadLocal để lưu trữ dữ liệu, cần chú ý đặt biệt là sau khi mã code chạy xong, phải điều chỉnh và xóa dữ liệu đã được thiết lập một cách rõ ràng.

#### Sửa lỗi ThreadLocal

```java
    @GetMapping("right")
    public Map<String, String> right(@RequestParam("id") Integer userId) {
        String before = Thread.currentThread().getName() + ":" + currentUser.get();
        currentUser.set(userId);
        try {
            String after = Thread.currentThread().getName() + ":" + currentUser.get();
            Map<String, String> result = new HashMap<>();
            result.put("before", before);
            result.put("after", after);
            return result;
        } finally {
            // Trong khối finally, xóa dữ liệu trong ThreadLocal để đảm bảo không có sự truyền dữ liệu sai.
            currentUser.remove();
        }
    }
```

### InheritableThreadLocal

Lớp `InheritableThreadLocal` là một lớp con của lớp `ThreadLocal`.

Mỗi luồng trong `ThreadLocal` có dữ liệu riêng. Khác với `ThreadLocal`, `InheritableThreadLocal` cho phép một luồng và tất cả các luồng con được tạo ra từ nó có thể truy cập vào dữ liệu đã lưu.
