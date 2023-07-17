---
title: Java Lock
tags: [java, javase, concurrency]
categories: [java, javase, concurrency]
date created: 2023-07-17
date modified: 2023-07-17
---

# Hiểu sâu về khóa đồng thời trong Java

> Bài viết này trước tiên sẽ giải thích khái niệm về các loại khóa trong Java.
>
> Sau đó, giới thiệu về cơ chế cốt lõi của khóa là AQS.
>
> Tiếp theo, tập trung giới thiệu hai giao diện Lock và Condition và các cài đặt của chúng. Lập trình đồng thời có hai vấn đề cốt lõi: đồng bộ và mutex.
>
> **Mutex** có nghĩa là chỉ cho phép một luồng truy cập tài nguyên chung vào cùng một thời điểm;
>
> **Đồng bộ** là cách các luồng giao tiếp và hợp tác với nhau.
>
> Cả hai vấn đề này đều có thể được giải quyết bằng cách sử dụng cơ chế quản lý (synchronized). **Gói J.U.C cung cấp hai giao diện Lock và Condition để triển khai cơ chế quản lý, trong đó Lock được sử dụng để giải quyết vấn đề tương hỗ và Condition được sử dụng để giải quyết vấn đề đồng bộ**.

## Giới thiệu về khóa đồng thời

Một cách phổ biến để đảm bảo an toàn đồng thời là sử dụng các cơ chế khóa (Lock, synchronized) để đồng bộ hóa dữ liệu chia sẻ, đảm bảo chỉ có một luồng có thể thực thi một phương thức hoặc một đoạn mã cùng một thời điểm. Điều này đảm bảo các hoạt động được thực hiện một cách nguyên tử và an toàn cho luồng.

Trong công việc và phỏng vấn, chúng ta thường nghe thấy nhiều loại khóa khác nhau, khiến người nghe mơ hồ. Có nhiều thuật ngữ và khái niệm liên quan đến khóa, nhưng chúng được đưa ra để giải quyết các vấn đề khác nhau và thông qua việc tạo ra một bản tóm tắt đơn giản, chúng ta cũng không khó để hiểu.

### Khóa có thể tái nhập

**Khóa có thể tái nhập cho phép một luồng có thể lấy lại cùng một khóa**. Điều này có nghĩa là một luồng  có được khóa trong phương thức bên ngoài và tự động có được khóa khi nhập phương thức bên trong.

**Khóa có thể tái nhập giúp tránh tình trạng bế tắc ở một mức độ nhất định.**

- `ReentrantLock` và `ReentrantReadWriteLock` là các khóa có thể tái nhập. Điều này rõ ràng từ tên của chúng.
- `synchronized` cũng là một khóa có thể tái nhập.

【Ví dụ】Ví dụ về khóa có thể tái nhập `synchronized`

```java
synchronized void setA() throws Exception{
    Thread.sleep(1000);
    setB();
}

synchronized void setB() throws Exception{
    Thread.sleep(1000);
}
```

Đoạn mã trên là một tình huống điển hình: Nếu khóa không phải là khóa có thể tái nhập, `setB` có thể không được thực thi bởi luồng hiện tại, dẫn đến tình trạng bế tắc.

【Ví dụ】Ví dụ về khóa có thể tái nhập `ReentrantLock`

```java
class Task {

    private int value;
    private final Lock lock = new ReentrantLock();

    public Task() {
        this.value = 0;
    }

    public int get() {
        // Lấy khóa
        lock.lock();
        try {
            return value;
        } finally {
            // Đảm bảo khóa được giải phóng
            lock.unlock();
        }
    }

    public void addOne() {
        // Lấy khóa
        lock.lock();
        try {
            // Lưu ý: Ở đây đã lấy khóa thành công, sau đó vào phương thức get, lại thử lấy khóa,
            // Nếu khóa không thể lặp lại, sẽ dẫn đến tình trạng bế tắc
            value = 1 + get();
        } finally {
            // Đảm bảo khóa được giải phóng
            lock.unlock();
        }
    }

}
```

### Khóa công bằng và khóa không công bằng

- **Khóa công bằng** - Khóa công bằng đảm bảo rằng **nhiều luồng được lấy khóa theo thứ tự yêu cầu**.
- **Khóa không công bằng** - Khóa không công bằng không đảm bảo thứ tự yêu cầu khi lấy khóa. Điều này có thể dẫn đến việc ưu tiên đảo ngược (luồng mới hơn được lấy khóa trước) hoặc tình trạng đói (một luồng luôn bị chặn bởi các luồng khác).

Khóa công bằng có thể giảm hiệu suất vì phải tuân thủ thứ tự yêu cầu, trong khi khóa không công bằng có thể tăng hiệu suất vì không cần tuân thủ thứ tự yêu cầu.

Khóa công bằng và khóa không công bằng trong Java:

- `synchronized` chỉ hỗ trợ khóa không công bằng.
- `ReentrantLock` hỗ trợ khóa không công bằng và khóa công bằng.

### Khóa độc quyền và khóa chia sẻ

Khóa riêng và khóa chia sẻ là một cách nói rộng, thường được gọi là khóa tương hỗ và khóa đọc ghi.

- **Khóa độc quyền** - Khóa độc quyền chỉ cho phép **một luồng duy nhất nắm giữ khóa**.
- **Khóa chia sẻ** - Khóa chia sẻ cho phép **nhiều luồng nắm giữ khóa**.

Khóa độc quyền và khóa chia sẻ trong Java:

- `synchronized` và `ReentrantLock` chỉ hỗ trợ khóa độc quyền.
- `ReentrantReadWriteLock` hỗ trợ khóa chia sẻ và khóa độc quyền. Khóa đọc là khóa chia sẻ, cho phép nhiều luồng đọc cùng một lúc, trong khi khóa ghi là khóa độc quyền, chỉ cho phép một luồng ghi vào cùng một thời điểm.

### Khóa bi quan và khóa lạc quan

Khóa bi quan và khóa lạc quan không chỉ đề cập đến loại cụ thể của khóa, mà còn đề cập đến **chiến lược xử lý đồng thời**.

- **Khóa bi quan** - Khóa bi quan đối xử với đồng thời một cách bi quan, cho rằng: **Các hoạt động đồng thời mà không có khóa sẽ gặp vấn đề**. Khóa bi quan thích hợp cho các tình huống có tần suất ghi cao.
- **Khóa lạc quan** - Khóa lạc quan đối xử với đồng thời một cách lạc quan, cho rằng: **Các hoạt động đồng thời mà không có khóa cũng không gặp vấn đề**. Trong quá trình cập nhật dữ liệu, sẽ liên tục thử nghiệm cập nhật dữ liệu. Khóa lạc quan thích hợp cho các tình huống đọc nhiều, ghi ít.

Khóa bi quan và khóa lạc quan trong Java:

- Khóa bi quan trong Java được thực hiện bằng cách sử dụng `synchronized` và `Lock` để đạt được đồng bộ hóa chặt chẽ. Đây là loại đồng bộ hóa chặt chẽ.
- Khóa lạc quan trong Java được thực hiện bằng cách sử dụng cơ chế `CAS` (Compare and Swap) trong các lớp atomic, như `AtomicInteger`, `AtomicLong`, `AtomicReference`,… Đây là loại đồng bộ hóa lỏng lẻo.

### Khóa thiên vị, khóa nhẹ và khóa nặng

Khóa thiên vị, khóa nhẹ và khóa nặng đề cập đến độ tinh vi của việc kiểm soát khóa. Rõ ràng, độ tinh vi càng cao, chi phí chặn càng thấp và đồng thời càng cao.

Trước Java 1.6, khóa nặng thường chỉ đề cập đến `synchronized`, trong khi khóa nhẹ thường chỉ đề cập đến `volatile`.

Sau Java 1.6, `synchronized` đã được tối ưu hóa đáng kể và đã giới thiệu 4 trạng thái khóa: không khóa, khóa thiên vị, khóa nhẹ và khóa nặng. Khóa có thể nâng cấp từ khóa thiên vị sang khóa nhẹ, sau đó từ khóa nhẹ nâng cấp sang khóa nặng.

- **Khóa thiên vị** - Khóa thiên vị là khi một đoạn mã đồng thời được truy cập bởi một luồng duy nhất, luồng đó sẽ tự động lấy khóa. Điều này giảm chi phí lấy khóa.
- **Khóa nhẹ** - Khóa nhẹ xảy ra khi khóa thiên vị được truy cập bởi một luồng khác, khóa thiên vị sẽ tiến hóa thành khóa nhẹ. Các luồng khác sẽ thử lấy khóa bằng cách quay vòng, không chặn, từ đó tăng hiệu suất.
- **Khóa nặng** - Khóa nặng xảy ra khi khóa nhẹ không thành công sau một số lần quay vòng. Luồng khác sẽ chuyển sang chế độ chặn, điều này giảm hiệu suất.

### Khóa phân đoạn

Khóa phân đoạn thực chất là một thiết kế khóa, không phải là một loại khóa cụ thể. Ý nghĩa của khóa phân đoạn là chia đối tượng khóa thành nhiều phân đoạn, mỗi phân đoạn được điều khiển độc lập, giúp tăng độ tinh vi của khóa, giảm thiểu tải chờ và tăng cường đồng thời. Điều này dễ hiểu, giống như các trạm thu phí trên đường cao tốc, nếu chỉ có một làn thu phí, tất cả các xe chỉ có thể xếp hàng để thanh toán; nhưng nếu có nhiều làn thu phí, việc phân làn sẽ được thực hiện.

`Hashtable` sử dụng từ khóa `synchronized` để đảm bảo tính toàn vẹn của luồng, khi một luồng truy cập vào dữ liệu của `Hashtable`, `Hashtable` sẽ khóa toàn bộ đối tượng, tất cả các luồng khác chỉ có thể chờ đợi, cách tiếp cận này giảm hiệu suất xử lý.

Trước Java 1.7, `ConcurrentHashMap` là một ví dụ điển hình về khóa phân đoạn. `ConcurrentHashMap` duy trì một mảng `Segment`, thường được gọi là các ngăn phân đoạn.

```java
final Segment<K,V>[] segments;
```

Khi một luồng truy cập vào dữ liệu của `ConcurrentHashMap`, `ConcurrentHashMap` sẽ trước tiên tính toán hashCode để xác định dữ liệu thuộc `Segment` nào (tức là phân đoạn nào), sau đó khóa phân đoạn đó.

### Khóa hiển thị và khóa nội tại

Trước Java 1.5, cơ chế duy nhất để điều phối quyền truy cập đối tượng chia sẻ là sử dụng `synchronized` và `volatile`. Cả hai đều thuộc loại khóa nội tại, nghĩa là việc yêu cầu và giải phóng khóa đều do JVM điều khiển.

Sau Java 1.5, đã thêm cơ chế mới: `ReentrantLock`, `ReentrantReadWriteLock`, những loại khóa này có thể yêu cầu và giải phóng khóa theo ý muốn của chương trình, do đó thường được gọi là khóa hiển thị.

> 💡 Cách sử dụng và nguyên lý của `synchronized` có thể tham khảo tại: [[Java Concurrency Core Mechanism]].
>
> 🔔 Lưu ý: Nếu không cần các tính năng đồng bộ cao cấp mà `ReentrantLock`, `ReentrantReadWriteLock` cung cấp, **nên ưu tiên sử dụng `synchronized`**. Lý do như sau:
>
> - Từ Java 1.6 trở đi, `synchronized` đã được tối ưu hóa rất nhiều, hiệu suất của nó đã gần bằng với `ReentrantLock`, `ReentrantReadWriteLock`.
> - Theo xu hướng, trong tương lai, Java có thể tối ưu hóa `synchronized` hơn là `ReentrantLock`, `ReentrantReadWriteLock`, vì `synchronized` là thuộc tính được tích hợp sẵn trong JVM, nó có thể thực hiện một số tối ưu hóa.
> - `ReentrantLock`, `ReentrantReadWriteLock` yêu cầu yêu cầu và giải phóng khóa được điều khiển bởi chương trình, nếu sử dụng không đúng cách, có thể gây ra tình trạng bế tắc, điều này rất nguy hiểm.

Dưới đây là so sánh giữa khóa hiển thị và khóa nội tại:

- **Yêu cầu và giải phóng khóa chủ động**
	- `synchronized` không thể yêu cầu và giải phóng khóa chủ động. Yêu cầu và giải phóng khóa đều do JVM điều khiển.
	- `ReentrantLock` có thể yêu cầu và giải phóng khóa chủ động. (Nếu quên giải phóng khóa, có thể gây ra tình trạng kẹt)
- **Phản hồi gián đoạn**
	- `synchronized` không thể phản hồi gián đoạn.
	- `ReentrantLock` có thể phản hồi gián đoạn.
- **Cơ chế thời gian chờ**
	- `synchronized` không có cơ chế thời gian chờ.
	- `ReentrantLock` có cơ chế thời gian chờ. `ReentrantLock` có thể đặt thời gian chờ, sau khi hết thời gian chờ, khóa sẽ được giải phóng tự động, tránh việc chờ đợi vô hạn.
- **Hỗ trợ khóa công bằng**
	- `synchronized` chỉ hỗ trợ khóa không công bằng.
	- `ReentrantLock` hỗ trợ khóa không công bằng và khóa công bằng.
- **Hỗ trợ chia sẻ**
	- Phương thức hoặc khối mã được đánh dấu bằng `synchronized` chỉ có thể được truy cập bởi một luồng duy nhất (độc quyền). Nếu luồng này bị chặn, các luồng khác cũng chỉ có thể chờ đợi.
	- `ReentrantLock` có thể kiểm soát điều kiện đồng bộ linh hoạt dựa trên `Condition`.
- **Hỗ trợ phân tách đọc và ghi**
	- `synchronized` không hỗ trợ khóa đọc và ghi tách biệt.
	- `ReentrantReadWriteLock` hỗ trợ khóa đọc và ghi tách biệt, từ đó tách riêng các hoạt động đọc và ghi, tăng hiệu suất đồng thời.

## Lock và Condition

### Tại sao cần sử dụng Lock và Condition

Trong lĩnh vực lập trình đa luồng, có hai vấn đề cốt lõi: **đồng bộ hóa** và **tương tác**. Đồng bộ hóa đảm bảo chỉ có một luồng được phép truy cập vào tài nguyên chung trong cùng một thời điểm. Tương tác xảy ra khi các luồng cần giao tiếp và cộng tác với nhau. Để giải quyết hai vấn đề này, Java SDK cung cấp giao diện `Lock` và `Condition` để triển khai mô hình quản lý tài nguyên.

Synchronized là một cách triển khai của mô hình quản lý tài nguyên, vậy tại sao lại cần Lock và Condition.

Trước JDK 1.6, synchronized chưa được tối ưu hóa và hiệu suất thấp hơn so với Lock. Tuy nhiên, hiệu suất không phải là yếu tố quan trọng nhất khi giới thiệu Lock. Quan trọng nhất là synchronized không thể ngăn chặn deadlock nếu sử dụng không đúng cách.

Synchronized không thể ngăn chặn deadlock bằng cách phá vỡ điều kiện không thể tranh giành. Lý do là khi synchronized yêu cầu tài nguyên và không thể nhận được nó, luồng sẽ chuyển sang trạng thái chờ đợi và không thể giải phóng tài nguyên đã nắm giữ.

Ngược lại, Lock cung cấp một tập hợp các hoạt động khóa không có điều kiện, có thể kiểm tra, có thể định thời gian và có thể bị gián đoạn. Tất cả các hoạt động lấy khóa và giải phóng khóa đều là hoạt động rõ ràng.

- **Có thể phản hồi gián đoạn**. Vấn đề với synchronized là khi một luồng giữ khóa A và không thể lấy khóa B, luồng sẽ chuyển sang trạng thái chờ đợi và không có cơ hội nào để đánh thức luồng chờ đợi. Tuy nhiên, nếu luồng chờ đợi có thể phản hồi tín hiệu gián đoạn, tức là khi chúng ta gửi tín hiệu gián đoạn cho luồng chờ đợi, nó có thể được đánh thức và có cơ hội giải phóng khóa A đã nắm giữ. Điều này phá vỡ điều kiện không thể tranh giành.
- **Hỗ trợ thời gian chờ**. Nếu một luồng không thể lấy khóa trong một khoảng thời gian nhất định, nó sẽ không chuyển sang trạng thái chờ đợi, mà sẽ trả về một lỗi. Điều này cũng có thể phá vỡ điều kiện không thể tranh giành.
- **Không chặn khi lấy khóa**. Nếu không thể lấy khóa, luồng không chuyển sang trạng thái chờ đợi mà trả về trực tiếp. Điều này cũng có thể phá vỡ điều kiện không thể tranh giành.

### Giao diện Lock

Giao diện Lock được định nghĩa như sau:

```java
public interface Lock {
    void lock();
    void lockInterruptibly() throws InterruptedException;
    boolean tryLock();
    boolean tryLock(long time, TimeUnit unit) throws InterruptedException;
    void unlock();
    Condition newCondition();
}
```

- `lock()` - Lấy khóa.
- `unlock()` - Giải phóng khóa.
- `tryLock()` - Thử lấy khóa, chỉ lấy khóa khi không có luồng khác đang giữ khóa.
- `tryLock(long time, TimeUnit unit)` - Tương tự như `tryLock()`, nhưng giới hạn thời gian, nếu không lấy được khóa trong thời gian giới hạn, trả về false.
- `lockInterruptibly()` - Lấy khóa khi không có luồng khác giữ khóa và luồng không bị gián đoạn.
- `newCondition()` - Trả về một đối tượng Condition được liên kết với Lock.

### Condition

**Condition triển khai biến điều kiện trong mô hình quản lý tài nguyên**.

Như đã đề cập trước đó, giao diện Lock có một phương thức `newCondition()` để trả về một đối tượng Condition được liên kết với Lock. Condition là gì? Nó có tác dụng gì? Phần này sẽ giải thích từng phần một.

Trong một luồng đơn, việc thực thi một đoạn mã có thể phụ thuộc vào một trạng thái nào đó. Nếu không đáp ứng điều kiện trạng thái, mã sẽ không được thực thi (một ví dụ điển hình là câu lệnh `if … else …`). Trong môi trường đa luồng, khi một luồng kiểm tra điều kiện trạng thái, trạng thái có thể thay đổi do hoạt động của các luồng khác. Do đó, cần có cơ chế phối hợp để đảm bảo rằng cùng một lúc, dữ liệu chỉ được sửa đổi bởi một luồng và tất cả các luồng đều nhận biết trạng thái dữ liệu đã được sửa đổi.

Trước JDK 1.5, chúng ta sử dụng các phương thức `wait`、`notify`、`notifyAll` trong lớp `Object` để giao tiếp giữa các luồng (nếu không quen với chúng, bạn có thể tham khảo: [[Java Thread Basic]]).

`wait`、`notify`、`notifyAll` phải được sử dụng kết hợp với `synchronized` và không phù hợp với Lock. Vì vậy, các luồng sử dụng Lock để tương tác với nhau nên sử dụng Condition. Điều này có thể hiểu là, khóa nào sử dụng khóa nào.

#### Đặc điểm của Condition

Giao diện Condition được định nghĩa như sau:

```java
public interface Condition {
    void await() throws InterruptedException;
    void awaitUninterruptibly();
    long awaitNanos(long nanosTimeout) throws InterruptedException;
    boolean await(long time, TimeUnit unit) throws InterruptedException;
    boolean awaitUntil(Date deadline) throws InterruptedException;
    void signal();
    void signalAll();
}
```

Trong đó, `await`、`signal`、`signalAll` tương ứng với `wait`、`notify`、`notifyAll` và có chức năng tương tự. Ngoài ra, Condition cung cấp nhiều tính năng phong phú hơn so với các phương thức điều kiện nội tại (`wait`、`notify`、`notifyAll`):

- Mỗi khóa (Lock) có thể có nhiều Condition, điều này có nghĩa là có thể có nhiều điều kiện trạng thái của khóa.
- Hỗ trợ hàng đợi công bằng hoặc không công bằng.
- Hỗ trợ chờ không bị gián đoạn, các phương thức liên quan: `awaitUninterruptibly()`.
- Hỗ trợ chờ với thời gian giới hạn, các phương thức liên quan: `awaitNanos(long)`、`await(long, TimeUnit)`、`awaitUntil(Date)`.

#### Cách sử dụng Condition

Ở đây, chúng ta sẽ sử dụng Condition để triển khai một mô hình sản xuất và tiêu thụ.

> 🔔 Lưu ý: Trong thực tế, việc giải quyết vấn đề này bằng cách sử dụng các công cụ như `CountDownLatch`, `Semaphore` sẽ dễ dàng hơn và an toàn hơn. Để biết thêm chi tiết, bạn có thể tham khảo [[Java Concurrent Tools]].

Lớp sản phẩm

```java
class Message {

    private final Lock lock = new ReentrantLock();

    private final Condition producedMsg = lock.newCondition();

    private final Condition consumedMsg = lock.newCondition();

    private String message;

    private boolean state;

    private boolean end;

    public void consume() {
        //lock
        lock.lock();
        try {
            // không có tin nhắn mới, chờ tin nhắn mới
            while (!state) { producedMsg.await(); }

            System.out.println("consume message : " + message);
            state = false;
            // tin nhắn đã tiêu thụ, thông báo cho luồng đang chờ
            consumedMsg.signal();
        } catch (InterruptedException ie) {
            System.out.println("Thread interrupted - viewMessage");
        } finally {
            lock.unlock();
        }
    }

    public void produce(String message) {
        lock.lock();
        try {
            // tin nhắn trước chưa được tiêu thụ, chờ cho đến khi nó được tiêu thụ
            while (state) { consumedMsg.await(); }

            System.out.println("produce msg: " + message);
            this.message = message;
            state = true;
            // tin nhắn mới được thêm, thông báo cho luồng đang chờ
            producedMsg.signal();
        } catch (InterruptedException ie) {
            System.out.println("Thread interrupted - publishMessage");
        } finally {
            lock.unlock();
        }
    }

    public boolean isEnd() {
        return end;
    }

    public void setEnd(boolean end) {
        this.end = end;
    }

}
```

Luồng tiêu thụ

```java
class MessageConsumer implements Runnable {

    private Message message;

    public MessageConsumer(Message msg) {
        message = msg;
    }

    @Override
    public void run() {
        while (!message.isEnd()) { message.consume(); }
    }

}
```

Luồng sản xuất

```java
class MessageProducer implements Runnable {

    private Message message;

    public MessageProducer(Message msg) {
        message = msg;
    }

    @Override
    public void run() {
        produce();
    }

    public void produce() {
        List<String> msgs = new ArrayList<>();
        msgs.add("Begin");
        msgs.add("Msg1");
        msgs.add("Msg2");

        for (String msg : msgs) {
            message.produce(msg);
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        message.produce("End");
        message.setEnd(true);
    }

}
```

Kiểm tra

```java
public class LockConditionDemo {

    public static void main(String[] args) {
        Message msg = new Message();
        Thread producer = new Thread(new MessageProducer(msg));
        Thread consumer = new Thread(new MessageConsumer(msg));
        producer.start();
        consumer.start();
    }
}
```

## ReentrantLock

Lớp `ReentrantLock` là một triển khai cụ thể của giao diện `Lock` và, giống như khóa nội tại `synchronized`, nó là một **khóa có thể tái nhập**.

### Đặc điểm của ReentrantLock

Các đặc điểm của `ReentrantLock` như sau:

- `ReentrantLock` cung cấp tính năng **đồng bộ, khả năng nhìn thấy bộ nhớ và khả năng tái nhập** tương tự như `synchronized`.
- `ReentrantLock` hỗ trợ hai chế độ khóa: **khóa công bằng** (fair) và **khóa không công bằng** (non-fair) (mặc định).
- `ReentrantLock` triển khai giao diện `Lock`, cung cấp **tính linh hoạt** mà `synchronized` không có.
	- `synchronized` không thể ngắt một luồng đang chờ lấy khóa.
	- `synchronized` không thể chờ vô thời hạn khi yêu cầu lấy một khóa.

### Cách sử dụng ReentrantLock

Sau khi tìm hiểu về đặc điểm của `ReentrantLock`, chúng ta sẽ tìm hiểu cách sử dụng nó.

#### Phương thức khởi tạo của ReentrantLock

`ReentrantLock` có hai phương thức khởi tạo:

```java
public ReentrantLock() {}
public ReentrantLock(boolean fair) {}
```

- `ReentrantLock()` - Phương thức khởi tạo mặc định sẽ khởi tạo một **khóa không công bằng (NonfairSync)**.
- `ReentrantLock(boolean)` - `new ReentrantLock(true)` sẽ khởi tạo một **khóa công bằng (FairSync)**.

#### Phương thức lock và unlock

- `lock()` - **Lấy khóa mà không có điều kiện**. Nếu luồng hiện tại không thể lấy khóa, luồng hiện tại sẽ chờ đợi cho đến khi có thể lấy được khóa. Nếu khóa không được giữ bởi một luồng khác, luồng hiện tại sẽ lấy khóa và trả về ngay lập tức, đồng thời đặt đếm khóa thành 1.
- `unlock()` - Dùng để **giải phóng khóa**.

> :bell: Lưu ý: Hãy nhớ rằng, việc lấy khóa **`lock()` phải được thực hiện trong khối `try catch` và việc giải phóng khóa `unlock()` phải được đặt trong khối `finally` để đảm bảo rằng khóa sẽ được giải phóng, tránh deadlock.

Ví dụ: Các hoạt động cơ bản của ReentrantLock

```java
public class ReentrantLockDemo {

    public static void main(String[] args) {
        Task task = new Task();
        MyThread tA = new MyThread("Thread-A", task);
        MyThread tB = new MyThread("Thread-B", task);
        MyThread tC = new MyThread("Thread-C", task);
        tA.start();
        tB.start();
        tC.start();
    }

    static class MyThread extends Thread {

        private Task task;

        public MyThread(String name, Task task) {
            super(name);
            this.task = task;
        }

        @Override
        public void run() {
            task.execute();
        }

    }

    static class Task {

        private ReentrantLock lock = new ReentrantLock();

        public void execute() {
            lock.lock();
            try {
                for (int i = 0; i < 3; i++) {
                    System.out.println(lock.toString());

                    // Kiểm tra số lần mà luồng hiện tại giữ khóa
                    System.out.println("\t holdCount: " + lock.getHoldCount());

                    // Kiểm tra số luồng đang chờ lấy khóa
                    System.out.println("\t queuedLength: " + lock.getQueueLength());

                    // Kiểm tra xem khóa có công bằng không
                    System.out.println("\t isFair: " + lock.isFair());

                    // Kiểm tra xem khóa có bị khóa không
                    System.out.println("\t isLocked: " + lock.isLocked());

                    // Kiểm tra xem khóa có được giữ bởi luồng hiện tại không
                    System.out.println("\t isHeldByCurrentThread: " + lock.isHeldByCurrentThread());

                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            } finally {
                lock.unlock();
            }
        }

    }

}
```

Kết quả đầu ra:

```java
java.util.concurrent.locks.ReentrantLock@64fcd88a[Locked by thread Thread-A]
	 holdCount: 1
	 queuedLength: 2
	 isFair: false
	 isLocked: true
	 isHeldByCurrentThread: true
java.util.concurrent.locks.ReentrantLock@64fcd88a[Locked by thread Thread-C]
	 holdCount: 1
	 queuedLength: 1
	 isFair: false
	 isLocked: true
	 isHeldByCurrentThread: true
// ...
```

#### Phương thức tryLock

So với việc lấy khóa mà không có điều kiện, tryLock có cơ chế phòng ngừa lỗi hoàn hảo hơn.

- `tryLock()` - **Cố gắng lấy khóa theo chu kỳ**. Nếu thành công, nó sẽ trả về true; nếu thất bại, nó sẽ trả về false. Điều này có nghĩa là phương thức này sẽ **trả về ngay lập tức** mà không chờ đợi nếu không thể lấy được khóa (khóa đã được lấy bởi luồng khác).
- `tryLock(long, TimeUnit)` - **Cố gắng lấy khóa theo thời gian**. Tương tự như tryLock(), khác biệt duy nhất là phương thức này sẽ **đợi một khoảng thời gian nhất định** nếu không thể lấy được khóa và trả về false sau khoảng thời gian đó. Nếu lấy được khóa từ đầu hoặc trong khoảng thời gian chờ, phương thức sẽ trả về true.

Ví dụ: Thao tác tryLock() của ReentrantLock

Sửa đổi phương thức execute() trong ví dụ trước:

```java
public void execute() {
    if (lock.tryLock()) {
        try {
            for (int i = 0; i < 3; i++) {
               // Làm gì đó...
            }
        } finally {
            lock.unlock();
        }
    } else {
        System.out.println(Thread.currentThread().getName() + " không thể lấy được khóa");
    }
}
```

Ví dụ: Thao tác tryLock(long, TimeUnit) của ReentrantLock

Sửa đổi phương thức execute() trong ví dụ trước:

```java
public void execute() {
    try {
        if (lock.tryLock(2, TimeUnit.SECONDS)) {
            try {
                for (int i = 0; i < 3; i++) {
                    // Làm gì đó...
                }
            } finally {
                lock.unlock();
            }
        } else {
            System.out.println(Thread.currentThread().getName() + " không thể lấy được khóa");
        }
    } catch (InterruptedException e) {
        System.out.println(Thread.currentThread().getName() + " đã vượt quá thời gian chờ lấy khóa");
        e.printStackTrace();
    }
}
```

#### Phương thức lockInterruptibly

- `lockInterruptibly()` - **Cố gắng lấy khóa có thể bị gián đoạn**. Lấy khóa có thể bị gián đoạn cho phép phản hồi gián đoạn trong quá trình lấy khóa. Phương thức này hơi phức tạp hơn các phương thức lấy khóa khác, cần sử dụng hai khối `try-catch` (nếu trong quá trình lấy khóa xảy ra `InterruptedException`, có thể sử dụng mô hình khóa `try-finally` chuẩn).
  - Ví dụ: Giả sử có hai luồng cùng sử dụng `lock.lockInterruptibly()` để lấy một khóa, nếu luồng A lấy được khóa, luồng B sẽ phải chờ đợi. Trong trường hợp này, nếu gọi `threadB.interrupt()` để gián đoạn quá trình chờ đợi của luồng B, thì luồng B sẽ bị gián đoạn. Vì khai báo của `lockInterruptibly()` có ném ra ngoại lệ, nên `lock.lockInterruptibly()` phải được đặt trong khối `try` hoặc khai báo ngoại lệ `InterruptedException` ở bên ngoài phương thức gọi `lockInterruptibly()`.

> :bell: Lưu ý: Khi một luồng đã lấy được khóa, nó sẽ không bị gián đoạn bởi phương thức `interrupt()`. Gọi riêng `interrupt()` không thể gián đoạn luồng đang chạy, chỉ có thể gián đoạn luồng đang bị chặn. Do đó, khi sử dụng `lockInterruptibly()` để lấy một khóa, chỉ khi đang ở trạng thái chờ đợi, mới có thể phản hồi gián đoạn.

Ví dụ: Thao tác lockInterruptibly() của ReentrantLock

Sửa đổi phương thức execute() trong ví dụ trước:

```java
public void execute() {
    try {
        lock.lockInterruptibly();

        for (int i = 0; i < 3; i++) {
            // Làm gì đó...
        }
    } catch (InterruptedException e) {
        System.out.println(Thread.currentThread().getName() + " đã bị gián đoạn");
        e.printStackTrace();
    } finally {
        lock.unlock();
    }
}
```

#### Phương thức newCondition

`newCondition()` - Trả về một phiên bản `Condition` được liên kết với đối tượng `Lock`. Đặc tính và phương thức cụ thể của `Condition` xin vui lòng tham khảo phần dưới [`Condition`](Condition).

### Nguyên lý của ReentrantLock

#### Tính hiệu lực của ReentrantLock

```java
class X {
  private final Lock rtl =
  new ReentrantLock();
  int value;
  public void addOne() {
    // Lấy khóa
    rtl.lock();
    try {
      value+=1;
    } finally {
      // Đảm bảo khóa được giải phóng
      rtl.unlock();
    }
  }
}
```

ReentrantLock có một trường dữ liệu `state` là biến thành viên `volatile`. Khi lấy khóa, nó sẽ đọc và ghi giá trị của biến `state`. Khi giải phóng khóa, nó cũng sẽ đọc và ghi giá trị của biến `state`. Dựa trên quy tắc Happens-Before liên quan:

1. **Quy tắc tuần tự** (Sequential Consistency): Đối với luồng T1, phép `value+=1` Happens-Before phép giải phóng khóa unlock().
2. **Quy tắc biến volatile** (Volatile Variable): Vì phép gán `state = 1` đọc giá trị của biến `state` trước khi gán, nên phép giải phóng khóa unlock() của luồng T1 Happens-Before phép lấy khóa lock() của luồng T2.
3. **Quy tắc truyền tải** (Transitivity): Phép `value+=1` của luồng T1 Happens-Before phép lấy khóa lock() của luồng T2.

#### Cấu trúc dữ liệu của ReentrantLock

Khi đọc mã nguồn của `ReentrantLock`, ta có thể thấy nó có một trường chính:

```java
private final Sync sync;
```

- `sync` - Đối tượng trừu tượng `ReentrantLock.Sync` bên trong, `Sync` kế thừa từ AQS. Nó có hai lớp con:
- `ReentrantLock.FairSync` - Khóa công bằng.
- `ReentrantLock.NonfairSync` - Khóa không công bằng.

Khi xem mã nguồn, ta có thể thấy rằng `ReentrantLock` thực hiện giao diện `Lock` bằng cách gọi các phương thức tương ứng trong `ReentrantLock.FairSync` hoặc `ReentrantLock.NonfairSync`, không cần liệt kê từng phương thức một.

#### Lấy khóa và giải phóng khóa của ReentrantLock

Giao diện lấy khóa và giải phóng khóa của ReentrantLock, từ bề ngoài, là gọi các phương thức tương ứng trong `ReentrantLock.FairSync` hoặc `ReentrantLock.NonfairSync`; từ bản chất, nó dựa trên AQS.

Đọc mã nguồn cẩn thận, ta dễ dàng nhận thấy:

- `void lock()` gọi phương thức lock() của Sync.
- `void lockInterruptibly()` trực tiếp gọi phương thức lấy khóa có thể bị gián đoạn `lockInterruptibly()` của AQS.
- `boolean tryLock()` gọi phương thức `nonfairTryAcquire()` của Sync.
- `boolean tryLock(long time, TimeUnit unit)` trực tiếp gọi phương thức lấy khóa chờ đợi với thời gian chờ `tryAcquireNanos(int arg, long nanosTimeout)` của AQS.
- `void unlock()` trực tiếp gọi phương thức giải phóng khóa `release(int arg)` của AQS.

Việc gọi trực tiếp các phương thức của AQS không được trình bày chi tiết ở đây, vì nguyên lý của chúng đã được trình bày trong phần [Nguyên lý của AQS](Nguyên lý của AQS).

Phương thức `nonfairTryAcquire` trong mã nguồn:

```java
// Cả khóa công bằng và không công bằng đều sử dụng phương thức này để thử lấy khóa
final boolean nonfairTryAcquire(int acquires) {
    final Thread current = Thread.currentThread();
    int c = getState();
    if (c == 0) {
        if (compareAndSetState(0, acquires)) {
         // Nếu trạng thái đồng bộ là 0, thiết lập nó thành acquires và đặt luồng hiện tại là luồng độc quyền
            setExclusiveOwnerThread(current);
            return true;
        }
    }
    else if (current == getExclusiveOwnerThread()) {
        int nextc = c + acquires;
        if (nextc < 0) // Tràn số
            throw new Error("Maximum lock count exceeded");
        setState(nextc);
        return true;
    }
    return false;
}
```

Quá trình xử lý rất đơn giản:

- Nếu trạng thái đồng bộ là 0, thiết lập trạng thái đồng bộ thành acquires và đặt luồng hiện tại là luồng độc quyền, sau đó trả về true, lấy khóa thành công.
- Nếu trạng thái đồng bộ không phải là 0 và luồng hiện tại là luồng độc quyền, thiết lập trạng thái đồng bộ thành giá trị hiện tại cộng với acquires, sau đó trả về true, lấy khóa thành công.
- Ngược lại, trả về false, lấy khóa không thành công.

#### Khóa công bằng và không công bằng

Lớp `ReentrantLock` có hai hàm tạo, một là hàm tạo không tham số và một là hàm tạo với tham số `fair`. Tham số `fair` đại diện cho chiến lược công bằng của khóa, nếu truyền vào `true` thì tạo một khóa công bằng, ngược lại thì tạo một khóa không công bằng.

Mỗi khóa đều tương ứng với một hàng đợi chờ, nếu một luồng không lấy được khóa, nó sẽ vào hàng đợi chờ, khi một luồng giải phóng khóa, cần đánh thức một luồng đang chờ. Nếu là khóa công bằng, chiến lược đánh thức là đánh thức luồng chờ lâu nhất, rất công bằng; nếu là khóa không công bằng, không đảm bảo công bằng, có thể đánh thức luồng chờ ít thời gian hơn.

Phương thức lock() trong khóa công bằng và không công bằng:

Sự khác biệt giữa hai phương thức chỉ là khi yêu cầu một khóa không công bằng, nếu trạng thái đồng bộ là 0, thử thiết lập nó thành 1, nếu thành công, đặt luồng hiện tại là luồng độc quyền; nếu không, giống như khóa công bằng, gọi phương thức AQS để lấy khóa.

```java
// Khóa không công bằng
final void lock() {
    if (compareAndSetState(0, 1))
    // Nếu trạng thái đồng bộ là 0, thiết lập nó thành 1 và đặt luồng hiện tại là luồng độc quyền
        setExclusiveOwnerThread(Thread.currentThread());
    else
    // Gọi phương thức AQS để lấy khóa
        acquire(1);
}

// Khóa công bằng
final void lock() {
    // Gọi phương thức AQS để lấy khóa
    acquire(1);
}
```

## ReentrantReadWriteLock

`ReadWriteLock` được sử dụng trong các tình huống **đọc nhiều, ghi ít**.

`ReentrantReadWriteLock` là một lớp cụ thể của `ReadWriteLock` và là một loại khóa đọc/ghi có thể lặp lại. `ReentrantReadWriteLock` duy trì một cặp khóa đọc và ghi, tách biệt khóa đọc và khóa ghi, giúp tăng hiệu suất đồng thời.

Khóa đọc/ghi không phải là một khái niệm độc quyền của ngôn ngữ Java, mà là một công nghệ phổ biến được sử dụng rộng rãi. Tất cả các khóa đọc/ghi đều tuân thủ ba nguyên tắc cơ bản sau:

- Cho phép nhiều luồng đọc cùng truy cập biến chia sẻ;
- Chỉ cho phép một luồng ghi truy cập biến chia sẻ;
- Nếu một luồng đang ghi, các luồng đọc khác không được phép truy cập biến chia sẻ.

Một điểm khác biệt quan trọng giữa khóa đọc/ghi và khóa độc quyền là **khóa đọc/ghi cho phép nhiều luồng đọc cùng truy cập biến chia sẻ**, trong khi khóa độc quyền không cho phép. Điều này là yếu tố quan trọng giúp khóa đọc/ghi có hiệu suất tốt hơn khóa độc quyền trong các tình huống đọc nhiều, ghi ít. Tuy nhiên, **các hoạt động ghi trong khóa đọc/ghi là độc quyền**, khi một luồng đang ghi, không cho phép các luồng khác thực hiện hoạt động ghi hoặc đọc.

### Tính năng của ReentrantReadWriteLock

Các tính năng của ReentrantReadWriteLock như sau:

- **`ReentrantReadWriteLock` phù hợp với các tình huống đọc nhiều, ghi ít**. Nếu tình huống là ghi nhiều, đọc ít, việc triển khai `ReentrantReadWriteLock` có thể phức tạp hơn so với `ReentrantLock` và có thể làm giảm hiệu suất. Trong trường hợp này, cần phân tích cụ thể từng trường hợp. Vì cả khóa đọc (`ReadLock`) và khóa ghi (`WriteLock`) của `ReentrantReadWriteLock` đều triển khai giao diện `Lock`, việc thay thế bằng `ReentrantLock` cũng khá dễ dàng.
- `ReentrantReadWriteLock` triển khai giao diện `ReadWriteLock`, hỗ trợ việc tách biệt khóa đọc và khóa ghi so với `ReentrantLock`. `ReentrantReadWriteLock` duy trì một cặp khóa đọc và ghi (`ReadLock`, `WriteLock`). Tách biệt khóa đọc và khóa ghi giúp tăng hiệu suất đồng thời. Chiến lược khóa của `ReentrantReadWriteLock` là: **cho phép nhiều hoạt động đọc cùng thời điểm, nhưng chỉ cho phép một hoạt động ghi tại một thời điểm**.
- `ReentrantReadWriteLock` cung cấp khả năng khóa có thể lặp lại cho cả khóa đọc và khóa ghi.
- `ReentrantReadWriteLock` hỗ trợ cả khóa công bằng và khóa không công bằng (mặc định là không công bằng) hai chế độ.

Giao diện `ReadWriteLock` được định nghĩa như sau:

```java
public interface ReadWriteLock {
    Lock readLock();
    Lock writeLock();
}
```

- `readLock` - Trả về khóa (`ReadLock`) để thực hiện hoạt động đọc.
- `writeLock` - Trả về khóa (`WriteLock`) để thực hiện hoạt động ghi.

Có nhiều cách để thực hiện sự tương tác giữa khóa đọc/ghi và khóa ghi, và một số cách thực hiện tùy chọn của `ReadWriteLock` bao gồm:

- **Ưu tiên giải phóng** - Khi một hoạt động ghi giải phóng khóa ghi và cùng lúc có cả luồng đọc và luồng ghi trong hàng đợi, thì ưu tiên được chọn là luồng đọc, luồng ghi hoặc luồng yêu cầu trước nhất?
- **Luồng đọc chen vào** - Nếu khóa đang được một luồng đọc nắm giữ nhưng có một luồng ghi đang chờ đợi, liệu luồng đọc mới có thể lấy quyền truy cập ngay lập tức hay phải đợi sau luồng ghi? Nếu cho phép luồng đọc chen vào trước luồng ghi, điều này sẽ cải thiện tính cạnh tranh song song, nhưng có thể gây ra tình trạng đói luồng (thread starvation).
- **Khả năng lặp lại** - Khóa đọc và khóa ghi có thể lặp lại không?
- **Giảm cấp** - Nếu một luồng nắm giữ khóa ghi, liệu nó có thể nhận khóa đọc mà không cần giải phóng khóa ghi? Điều này có thể làm giảm cấp khóa ghi thành khóa đọc mà không cho phép các luồng ghi khác thay đổi tài nguyên được bảo vệ.
- **Nâng cấp** - Khóa đọc có thể được ưu tiên trước các luồng đọc và ghi khác đang chờ đợi để nâng cấp thành khóa ghi không? Trong hầu hết các triển khai khóa đọc/ghi, không hỗ trợ nâng cấp mà không có hoạt động nâng cấp rõ ràng, vì điều này có thể dẫn đến tình trạng kẹt (deadlock) nếu không có hoạt động nâng cấp rõ ràng.

### Cách sử dụng ReentrantReadWriteLock

Trong phần trước, chúng ta đã tìm hiểu về các tính năng của `ReentrantReadWriteLock`. Tiếp theo, chúng ta sẽ trình bày cách sử dụng cụ thể của nó.

#### Phương thức khởi tạo của ReentrantReadWriteLock

`ReentrantReadWriteLock` cũng giống như `ReentrantLock`, có hai phương thức khởi tạo và cách sử dụng tương tự.

```java
public ReentrantReadWriteLock() {}
public ReentrantReadWriteLock(boolean fair) {}
```

- `ReentrantReadWriteLock()` - Phương thức khởi tạo mặc định sẽ tạo ra một **khóa không công bằng (NonfairSync)**. Trong khóa không công bằng, thứ tự mà các luồng nhận khóa là không xác định. Việc giảm cấp từ khóa ghi thành khóa đọc là có thể, nhưng việc tăng cấp từ khóa đọc thành khóa ghi là không thể (điều này có thể dẫn đến tình trạng kẹt).
- `ReentrantReadWriteLock(boolean)` - `new ReentrantLock(true)` sẽ tạo ra một **khóa công bằng (FairSync)**. Với khóa công bằng, luồng chờ lâu nhất sẽ được ưu tiên nhận khóa. Nếu khóa đang được một luồng đọc nắm giữ, và một luồng ghi đang chờ đợi, luồng đọc mới có thể nhận quyền truy cập ngay lập tức hoặc phải đợi sau luồng ghi. Nếu cho phép luồng đọc chen vào trước luồng ghi, điều này sẽ cải thiện tính cạnh tranh song song, nhưng có thể gây ra tình trạng đói luồng (thread starvation).

#### Ví dụ về cách sử dụng ReentrantReadWriteLock

Trong phần Tính năng của `ReentrantReadWriteLock`, chúng ta đã giới thiệu rằng khóa đọc/ghi (ReadLock, WriteLock) của `ReentrantReadWriteLock` cũng triển khai giao diện `Lock`, do đó cách sử dụng riêng của chúng tương tự như `ReentrantLock` và không được trình bày ở đây.

Sự khác biệt chính giữa `ReentrantReadWriteLock` và `ReentrantLock` nằm ở cách sử dụng khóa đọc và khóa ghi cùng nhau. Ví dụ dưới đây sẽ giải thích điều này thông qua một tình huống sử dụng điển hình.

【Ví dụ】Sử dụng `ReadWriteLock` để triển khai một bộ nhớ cache không giới hạn với kiểu dữ liệu tổng quát

```java
/**
 * Triển khai đơn giản của bộ nhớ cache không giới hạn
 * <p>
 * Sử dụng WeakHashMap để lưu trữ các cặp khóa-giá trị. WeakHashMap lưu trữ các đối tượng dưới dạng tham chiếu yếu, JVM sẽ tự động xóa các đối tượng tham chiếu yếu không được tham chiếu.
 */
static class UnboundedCache<K, V> {

    private final Map<K, V> cacheMap = new WeakHashMap<>();

    private final ReadWriteLock cacheLock = new ReentrantReadWriteLock();

    public V get(K key) {
        cacheLock.readLock().lock();
        V value;
        try {
            value = cacheMap.get(key);
            String log = String.format("%s đọc dữ liệu %s:%s", Thread.currentThread().getName(), key, value);
            System.out.println(log);
        } finally {
            cacheLock.readLock().unlock();
        }
        return value;
    }

    public V put(K key, V value) {
        cacheLock.writeLock().lock();
        try {
            cacheMap.put(key, value);
            String log = String.format("%s ghi dữ liệu %s:%s", Thread.currentThread().getName(), key, value);
            System.out.println(log);
        } finally {
            cacheLock.writeLock().unlock();
        }
        return value;
    }

    public V remove(K key) {
        cacheLock.writeLock().lock();
        try {
            return cacheMap.remove(key);
        } finally {
            cacheLock.writeLock().unlock();
        }
    }

    public void clear() {
        cacheLock.writeLock().lock();
        try {
            this.cacheMap.clear();
        } finally {
            cacheLock.writeLock().unlock();
        }
    }

}
```

Giải thích:

- Sử dụng `WeakHashMap` thay vì `HashMap` để lưu trữ các cặp khóa-giá trị. `WeakHashMap` lưu trữ các đối tượng dưới dạng tham chiếu yếu, JVM sẽ tự động xóa các đối tượng tham chiếu yếu không được tham chiếu.
- Trước khi ghi dữ liệu vào `Map`, khóa ghi được sử dụng để khóa. Sau khi ghi xong, khóa ghi được giải phóng.
- Trước khi đọc dữ liệu từ `Map`, khóa đọc được sử dụng để khóa. Sau khi đọc xong, khóa đọc được giải phóng.

Kiểm tra tính an toàn đa luồng:

```java
public class ReentrantReadWriteLockDemo {

    static UnboundedCache<Integer, Integer> cache = new UnboundedCache<>();

    public static void main(String[] args) {
        ExecutorService executorService = Executors.newCachedThreadPool();
        for (int i = 0; i < 20; i++) {
            executorService.execute(new MyThread());
            cache.get(0);
        }
        executorService.shutdown();
    }

    /** Mỗi luồng nhiệm vụ ghi 3 giá trị ngẫu nhiên vào cache, key cố định */
    static class MyThread implements Runnable {

        @Override
        public void run() {
            Random random = new Random();
            for (int i = 0; i < 3; i++) {
                cache.put(i, random.nextInt(100));
            }
        }

    }

}
```

Giải thích: Trong ví dụ này, chúng ta sử dụng một `ExecutorService` để khởi chạy 20 nhiệm vụ đồng thời. Mỗi nhiệm vụ sẽ ghi 3 giá trị ngẫu nhiên vào cache, với key cố định. Sau đó, luồng chính sẽ đọc giá trị đầu tiên trong cache.

Kết quả đầu ra:

```
main đọc dữ liệu 0:null
pool-1-thread-1 ghi dữ liệu 0:16
pool-1-thread-1 ghi dữ liệu 1:58
pool-1-thread-1 ghi dữ liệu 2:50
main đọc dữ liệu 0:16
pool-1-thread-1 ghi dữ liệu 0:85
pool-1-thread-1 ghi dữ liệu 1:76
pool-1-thread-1 ghi dữ liệu 2:46
pool-1-thread-2 ghi dữ liệu 0:21
pool-1-thread-2 ghi dữ liệu 1:41
pool-1-thread-2 ghi dữ liệu 2:63
main đọc dữ liệu 0:21
main đọc dữ liệu 0:21
//...
```

### Nguyên lý hoạt động của ReentrantReadWriteLock

Sau khi tìm hiểu về nguyên lý hoạt động của `ReentrantLock`, việc hiểu về `ReentrantReadWriteLock` sẽ dễ dàng hơn nhiều.

#### Cấu trúc dữ liệu của ReentrantReadWriteLock

Đọc mã nguồn của `ReentrantReadWriteLock`, ta có thể thấy rằng nó có ba trường cốt lõi:

```java
/** Lớp nội cung cấp khóa đọc */
private final ReentrantReadWriteLock.ReadLock readerLock;
/** Lớp nội cung cấp khóa ghi */
private final ReentrantReadWriteLock.WriteLock writerLock;
/** Thực hiện tất cả cơ chế đồng bộ */
final Sync sync;

public ReentrantReadWriteLock.WriteLock writeLock() { return writerLock; }
public ReentrantReadWriteLock.ReadLock  readLock()  { return readerLock; }
```

- `sync` - đối tượng lớp nội `ReentrantReadWriteLock.Sync`. Tương tự như `ReentrantLock`, nó có hai lớp con: `ReentrantReadWriteLock.FairSync` và `ReentrantReadWriteLock.NonfairSync`, lần lượt đại diện cho cài đặt khóa công bằng và không công bằng.
- `readerLock` - đối tượng lớp nội `ReentrantReadWriteLock.ReadLock`, đây là một khóa đọc.
- `writerLock` - đối tượng lớp nội `ReentrantReadWriteLock.WriteLock`, đây là một khóa ghi.

#### Lấy khóa và giải phóng khóa của ReentrantReadWriteLock

```java
public static class ReadLock implements Lock, java.io.Serializable {

    // Gọi phương thức lấy khóa chia sẻ của AQS
    public void lock() {
        sync.acquireShared(1);
    }

    // Gọi phương thức giải phóng khóa chia sẻ của AQS
    public void unlock() {
        sync.releaseShared(1);
    }
}

public static class WriteLock implements Lock, java.io.Serializable {

    // Gọi phương thức lấy khóa độc quyền của AQS
    public void lock() {
        sync.acquire(1);
    }

    // Gọi phương thức giải phóng khóa độc quyền của AQS
    public void unlock() {
        sync.release(1);
    }
}
```

## StampedLock

ReadWriteLock hỗ trợ hai chế độ: khóa đọc và khóa ghi. Trong khi đó, StampedLock hỗ trợ ba chế độ: **khóa ghi**, **khóa đọc bi quan** và **đọc lạc quan**. Trong đó, ý nghĩa của khóa ghi và khóa đọc bi quan trong StampedLock rất giống với ý nghĩa của khóa ghi và khóa đọc trong ReadWriteLock, cho phép nhiều luồng đọc bi quan cùng lúc, nhưng chỉ cho phép một luồng ghi, khóa ghi và khóa đọc bi quan là đối kháng. Tuy nhiên, điểm khác biệt là: sau khi khóa ghi hoặc khóa đọc bi quan trong StampedLock thành công, nó sẽ trả về một con dấu (stamp); sau đó, khi giải phóng khóa, cần truyền con dấu này.

> Lưu ý rằng, ở đây sử dụng thuật ngữ "đọc lạc quan" thay vì "khóa đọc lạc quan", để nhắc nhở rằng hoạt động "đọc lạc quan" này không có khóa, do đó so với khóa đọc của ReadWriteLock, hoạt động "đọc lạc quan" có hiệu năng tốt hơn một chút.

Hiệu năng của StampedLock tốt hơn ReadWriteLock chủ yếu là do StampedLock hỗ trợ cách đọc lạc quan.

- ReadWriteLock cho phép nhiều luồng cùng đọc, nhưng khi nhiều luồng cùng đọc, tất cả các hoạt động ghi sẽ bị chặn;
- StampedLock cung cấp việc đọc lạc quan, cho phép một luồng có thể nhận khóa ghi, tức là không phải tất cả các hoạt động ghi đều bị chặn.

Đối với các tình huống đọc nhiều, ghi ít, StampedLock có hiệu năng tốt, và trong các tình huống đơn giản, nó có thể thay thế ReadWriteLock. Tuy nhiên, StampedLock chỉ là một phần con của ReadWriteLock, khi sử dụng, vẫn cần lưu ý một số điểm.

- **StampedLock không hỗ trợ việc tái nhập (reentrant)**
- Không hỗ trợ biến điều kiện cho khóa đọc bi quan và khóa ghi của StampedLock.
- Nếu một luồng bị chặn trên readLock() hoặc writeLock() của StampedLock và sau đó gọi phương thức interrupt() của luồng đó, điều này sẽ dẫn đến tăng CPU. **Khi sử dụng StampedLock, không bao giờ gọi phương thức interrupt(), nếu cần hỗ trợ chức năng interrupt, hãy sử dụng readLockInterruptibly() và writeLockInterruptibly() có thể bị chặn**.

【Ví dụ】Khi StampedLock bị chặn, gọi interrupt() dẫn đến tăng CPU

```java
final StampedLock lock = new StampedLock();
Thread T1 = new Thread(() -> {
  // Nhận khóa ghi
  lock.writeLock();
  // Luôn bị chặn ở đây, không giải phóng khóa ghi
  LockSupport.park();
});
T1.start();
// Đảm bảo T1 nhận khóa ghi
Thread.sleep(100);
Thread T2 = new Thread(() ->
  // Bị chặn ở khóa đọc bi quan
  lock.readLock()
);
T2.start();
// Đảm bảo T2 bị chặn ở khóa đọc
Thread.sleep(100);
// Ngắt luồng T2
// Dẫn đến tăng CPU trong luồng T2
T2.interrupt();
T2.join();
```

【Ví dụ】Mẫu đọc StampedLock:

```java
final StampedLock sl = new StampedLock();

// Đọc lạc quan
long stamp = sl.tryOptimisticRead();
// Đọc vào biến cục bộ của phương thức
......
// Kiểm tra con dấu
if (!sl.validate(stamp)) {
  // Nâng cấp thành khóa đọc bi quan
  stamp = sl.readLock();
  try {
    // Đọc vào biến cục bộ của phương thức
    .....
  } finally {
    // Giải phóng khóa đọc bi quan
    sl.unlockRead(stamp);
  }
}
// Sử dụng biến cục bộ của phương thức để thực hiện hoạt động kinh doanh
......
```

【Ví dụ】Mẫu ghi StampedLock:

```java
long stamp = sl.writeLock();
try {
  // Ghi vào biến chia sẻ
  ......
} finally {
  sl.unlockWrite(stamp);
}
```

## AQS

`AbstractQueuedSynchronizer` (viết tắt là AQS) là một **bộ đồng bộ hàng đợi trừu tượng**, như tên gọi của nó, chức năng chính của nó là xử lý đồng bộ. Nó là cơ sở triển khai cho khóa đồng thời và nhiều công cụ đồng bộ khác (như `ReentrantLock`, `ReentrantReadWriteLock`, `CountDownLatch`, `Semaphore`, `FutureTask`, v.v.).

### Điểm chính của AQS

**AQS cung cấp hỗ trợ cho khóa độc quyền và khóa chia sẻ**.

Các khóa liên quan trong gói `java.util.concurrent.locks` (các khóa phổ biến như `ReentrantLock`, `ReadWriteLock`) đều được triển khai dựa trên AQS. Những khóa này không kế thừa trực tiếp từ AQS, mà định nghĩa một lớp `Sync` để kế thừa AQS. Tại sao lại như vậy? Bởi vì khóa dành cho người dùng, trong khi bộ đồng bộ dành cho điều khiển luồng, vì vậy việc tách riêng hai khía cạnh này giúp tách biệt những gì mà hai khóa này quan tâm.

### Ứng dụng của AQS

**AQS cung cấp hỗ trợ cho khóa độc quyền và khóa chia sẻ**.

#### API của khóa độc quyền

Các API chính để lấy và giải phóng khóa độc quyền như sau:

```java
public final void acquire(int arg)
public final void acquireInterruptibly(int arg)
public final boolean tryAcquireNanos(int arg, long nanosTimeout)
public final boolean release(int arg)
```

- `acquire` - Lấy khóa độc quyền.
- `acquireInterruptibly` - Lấy khóa độc quyền có thể bị gián đoạn.
- `tryAcquireNanos` - Thử lấy khóa độc quyền có thể bị gián đoạn trong khoảng thời gian nhất định. Nó sẽ trả về true trong ba trường hợp sau:
    - Trong khoảng thời gian nhất định, luồng hiện tại lấy khóa thành công.
    - Luồng hiện tại bị gián đoạn trong khoảng thời gian nhất định.
    - Kết thúc khoảng thời gian nhất định mà vẫn chưa lấy được khóa, trả về false.
- `release` - Giải phóng khóa độc quyền.

#### API của khóa chia sẻ

Các API chính để lấy và giải phóng khóa chia sẻ như sau:

```java
public final void acquireShared(int arg)
public final void acquireSharedInterruptibly(int arg)
public final boolean tryAcquireSharedNanos(int arg, long nanosTimeout)
public final boolean releaseShared(int arg)
```

- `acquireShared` - Lấy khóa chia sẻ.
- `acquireSharedInterruptibly` - Lấy khóa chia sẻ có thể bị gián đoạn.
- `tryAcquireSharedNanos` - Thử lấy khóa chia sẻ có thể bị gián đoạn trong khoảng thời gian nhất định.
- `releaseShared` - Giải phóng khóa chia sẻ.

### Nguyên lý hoạt động của AQS

> Các điểm chính của AQS:
>
> - AQS sử dụng một biến nguyên `volatile` để **duy trì trạng thái đồng bộ**. Ý nghĩa của trạng thái được gán bởi lớp con.
> - AQS duy trì một danh sách liên kết kép FIFO để lưu trữ các luồng chờ không thành công.
>
> AQS cung cấp hai hoạt động cơ bản "lấy" và "giải phóng", và cung cấp một loạt các phương thức kiểm tra và xử lý, một số điểm chính là:
>
> - Trạng thái có thể là độc quyền hoặc chia sẻ;
> - Khi trạng thái được lấy, các luồng khác phải chờ đợi;
> - Khi trạng thái được giải phóng, các luồng chờ đợi được đánh thức;
> - Cách thoát khỏi việc chờ đợi khi không thể chờ đợi.
>
> Việc luồng có thể nhận trạng thái hay không, cách giải phóng trạng thái, không phải là AQS quan tâm, mà phải được thực hiện bởi lớp con cụ thể.

#### Cấu trúc dữ liệu của AQS

Đọc mã nguồn của AQS, ta có thể thấy rằng: AQS kế thừa từ `AbstractOwnableSynchronizer`.

```java
public abstract class AbstractQueuedSynchronizer
    extends AbstractOwnableSynchronizer
    implements java.io.Serializable {

    /** Đầu hàng đợi, được tải lười biếng. Chỉ có thể được sửa đổi bằng phương thức setHead. */
    private transient volatile Node head;
    /** Đuôi hàng đợi, được tải lười biếng. Chỉ có thể được thêm mới bằng phương thức enq. */
    private transient volatile Node tail;
    /** Trạng thái đồng bộ */
    private volatile int state;
}
```

- `state` - AQS sử dụng một biến nguyên `volatile` để **duy trì trạng thái đồng bộ**.
    - Ý nghĩa của trạng thái này được xác định bởi lớp con, ví dụ: trong `ReentrantLock`, giá trị trạng thái này đại diện cho số lần lấy khóa của chủ sở hữu luồng, trong `Semaphore`, giá trị trạng thái này đại diện cho số lượng permit còn lại.
- `head` và `tail` - AQS **duy trì một danh sách liên kết kép FIFO để quản lý trạng thái đồng bộ**. Đây là một hàng đợi FIFO hai chiều, được truy cập thông qua con trỏ `head` và `tail`. Khi một luồng không thể lấy khóa, nó sẽ được thêm vào cuối hàng đợi.

![JavaAQSLinkedList.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/JavaAQSLinkedList.png)

Tiếp theo, hãy xem mã nguồn của `Node`.

```java
static final class Node {
    /** Node này đang ở chế độ chia sẻ */
    static final Node SHARED = new Node();
    /** Node này đang ở chế độ độc quyền */
    static final Node EXCLUSIVE = null;

    /** Trạng thái chờ đợi của luồng, có các giá trị: 0, 1, -1, -2, -3 */
    volatile int waitStatus;
    static final int CANCELLED =  1;
    static final int SIGNAL    = -1;
    static final int CONDITION = -2;
    static final int PROPAGATE = -3;

    /** Node trước */
    volatile Node prev;
    /** Node sau */
    volatile Node next;
    /** Luồng đang chờ khóa */
    volatile Thread thread;

  	/** Liên quan đến việc chia sẻ node */
    Node nextWaiter;
}
```

Rõ ràng, `Node` là một danh sách liên kết kép.

- `waitStatus` - `Node` sử dụng một biến nguyên `volatile` để **duy trì trạng thái của nút luồng trong hàng đợi đồng bộ của AQS**. `waitStatus` có năm giá trị trạng thái:
    - `CANCELLED(1)` - Trạng thái này đại diện cho việc luồng của nút này có thể bị hủy bỏ do vượt quá thời gian chờ hoặc bị gián đoạn. Khi nút này ở trạng thái này, nó sẽ được loại bỏ khỏi hàng đợi.
    - `SIGNAL(-1)` - Trạng thái này đại diện cho việc nút sau sẽ bị treo, do đó sau khi nút hiện tại giải phóng khóa hoặc bị hủy bỏ, nút sau sẽ được đánh thức (`unparking`).
    - `CONDITION(-2)` - Trạng thái này đại diện cho việc luồng của nút này đang chờ điều kiện, nó không được coi là một nút trên hàng đợi đồng bộ cho đến khi nó được đánh thức (`signal`) và trạng thái của nó được đặt thành 0, sau đó nó sẽ quay lại trạng thái chờ đợi.
    - `PROPAGATE(-3)` - Trạng thái này đại diện cho việc `acquireShared` tiếp theo không cần truyền điều kiện.
    - 0 - Không phải là trạng thái trên.

#### Lấy và giải phóng khóa độc quyền

##### Lấy khóa độc quyền

AQS sử dụng phương thức `acquire(int arg)` để lấy khóa độc quyền. Quá trình lấy khóa độc quyền diễn ra như sau:

1. Cố gắng lấy trạng thái đồng bộ. Nếu thành công, kết thúc phương thức và trả về.
2. Nếu không thành công, AQS sẽ liên tục thử chèn luồng hiện tại vào cuối hàng đợi đồng bộ chờ đợi cho đến khi thành công.
3. Tiếp theo, AQS sẽ liên tục thử lấy khóa độc quyền cho các nút luồng trong hàng đợi chờ.

![AQSBefore.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/AQSBefore.png)

![AQSAcquire.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/AQSAcquire.png)

##### Giải phóng khóa độc quyền

AQS sử dụng phương thức `release(int arg)` để giải phóng khóa độc quyền. Quá trình giải phóng khóa độc quyền diễn ra như sau:

1. Cố gắng lấy trạng thái đồng bộ của luồng giải phóng. Nếu không thành công, kết thúc phương thức và trả về.
2. Nếu thành công, AQS sẽ cố gắng đánh thức các nút luồng sau của nút hiện tại.

##### Lấy khóa độc quyền có thể bị gián đoạn

AQS sử dụng phương thức `acquireInterruptibly(int arg)` để lấy khóa độc quyền có thể bị gián đoạn.

Phương thức `acquireInterruptibly(int arg)` và phương thức `acquire(int arg)` rất giống nhau, khác biệt duy nhất là nó sẽ **kiểm tra xem luồng hiện tại có bị gián đoạn không bằng cách sử dụng `Thread.interrupted`**. Nếu có, nó sẽ ném ra ngoại lệ gián đoạn (`InterruptedException`) ngay lập tức.

##### Lấy khóa độc quyền với thời gian chờ giới hạn

AQS sử dụng phương thức `tryAcquireNanos(int arg)` để lấy khóa độc quyền với thời gian chờ giới hạn.

Phương thức `tryAcquireNanos` và phương thức `acquire` rất giống nhau, khác biệt duy nhất là nó sẽ tính toán thời gian kết thúc dựa trên thời gian chờ và thời gian hiện tại. Trong quá trình lấy khóa, nó sẽ liên tục kiểm tra xem có vượt quá thời gian chờ hay không, nếu vượt quá, nó sẽ trả về false; nếu không vượt quá, nó sẽ sử dụng `LockSupport.parkNanos` để chặn luồng hiện tại.

#### Lấy và giải phóng khóa chia sẻ

##### Lấy khóa chia sẻ

AQS sử dụng phương thức `acquireShared(int arg)` để lấy khóa chia sẻ.

Phương thức `acquireShared` và phương thức `acquire` có cùng quy trình, khác biệt duy nhất là điều kiện vòng lặp và hoạt động xóa nút khỏi hàng đợi.

Điều kiện thành công để lấy khóa chia sẻ như sau:

- `tryAcquireShared(arg)` trả về giá trị lớn hơn hoặc bằng 0 (điều này có nghĩa là permit của khóa chia sẻ vẫn chưa được sử dụng hết).
- Nút hiện tại có nút trước là nút đầu danh sách.

##### Giải phóng khóa chia sẻ

AQS sử dụng phương thức `releaseShared(int arg)` để giải phóng khóa chia sẻ.

`releaseShared` đầu tiên sẽ cố gắng giải phóng trạng thái đồng bộ, nếu thành công, nó sẽ đánh thức một hoặc nhiều nút luồng sau của nút hiện tại.

##### Lấy khóa chia sẻ có thể bị gián đoạn

AQS sử dụng phương thức `acquireSharedInterruptibly(int arg)` để lấy khóa chia sẻ có thể bị gián đoạn.

Phương thức `acquireSharedInterruptibly` và phương thức `acquireInterruptibly` rất giống nhau, không cần giải thích thêm.

##### Lấy khóa chia sẻ với thời gian chờ giới hạn

AQS sử dụng phương thức `tryAcquireSharedNanos(int arg)` để lấy khóa chia sẻ với thời gian chờ giới hạn.

Phương thức `tryAcquireSharedNanos` và phương thức `tryAcquireNanos` rất giống nhau, không cần giải thích thêm.

## Deadlock

### Deadlock là gì

Deadlock là một trạng thái cụ thể của chương trình, trong đó các thực thể đang chờ đợi lẫn nhau vì sự phụ thuộc vòng lặp, không có thực thể nào có thể tiếp tục điều hướng. Deadlock không chỉ xảy ra giữa các luồng, mà cũng có thể xảy ra giữa các quy trình sở hữu tài nguyên. Thông thường, chúng ta tập trung vào deadlock giữa các luồng trong các tình huống đa luồng, chỉ đề cập đến deadlock giữa các quy trình sở hữu tài nguyên khi tài nguyên là độc quyền.

### Cách xác định Deadlock

Cách phổ biến nhất để xác định deadlock là sử dụng các công cụ như jstack để lấy stack trace của các luồng, sau đó xác định các phụ thuộc lẫn nhau giữa chúng để tìm ra deadlock. Nếu deadlock rõ ràng, thì thường có thể xác định trực tiếp bằng jstack, và các công cụ như JConsole thậm chí có thể phát hiện deadlock trong giao diện đồ họa có hạn.

Nếu bạn đang phát triển công cụ quản lý riêng của mình, cần quét quy trình dịch vụ, xác định deadlock một cách tự động, bạn có thể xem xét sử dụng API quản lý chuẩn của Java, `ThreadMXBean`, nó cung cấp trực tiếp phương thức `findDeadlockedThreads()` để xác định deadlock.

### Cách tránh Deadlock

Cơ bản, deadlock xảy ra vì:

- Sự cạnh tranh, giống như Monitor trong Java, đều là độc quyền.
- Giữ cạnh tranh lâu dài, không giải phóng trước khi sử dụng xong, cũng không thể bị chiếm giữ bởi luồng khác.
- Phụ thuộc vòng lặp, nhiều thực thể phụ thuộc vào nhau qua việc giữ khóa.

Do đó, chúng ta có thể phân tích cách tránh deadlock và phương pháp.

(1) Tránh một luồng cùng lúc giữ nhiều khóa.

Tránh một luồng giữ cùng lúc nhiều tài nguyên, cố gắng đảm bảo mỗi khóa chỉ giữ một tài nguyên.

Thử sử dụng khóa có thời gian chờ (`lock.tryLock(timeout)`) để tránh việc giữ khóa mãi mãi.

Đối với khóa cơ sở dữ liệu, việc khóa và mở khóa phải nằm trong một kết nối cơ sở dữ liệu, nếu không, có thể xảy ra tình huống không thể mở khóa.
