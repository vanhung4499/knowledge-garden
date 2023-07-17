---
title: Java Atomic Class
tags: [java, javase, concurrency]
categories: [java, javase, concurrency]
date created: 2023-07-17
date modified: 2023-07-17
---

# Lớp Atomic trong Java

## Giới thiệu về lớp nguyên tử

### Tại sao cần lớp nguyên tử

Đảm bảo an toàn đa luồng là một vấn đề quan trọng phải giải quyết trong lập trình đa luồng Java. Java đảm bảo tính nguyên tử, tính nhìn thấy và tính tuần tự bằng cách sử dụng ba tính chất chính: tính nguyên tử, tính nhìn thấy và tính tuần tự.

- Cách phổ biến nhất để đảm bảo an toàn đa luồng là sử dụng cơ chế khóa (`Lock`, `synchronized`) để đồng bộ hóa dữ liệu chia sẻ, điều này đảm bảo chỉ có một luồng có thể thực thi một phương thức hoặc một khối mã vào cùng một thời điểm, từ đó đảm bảo tính nguyên tử và an toàn đa luồng. Tuy nhiên, cơ chế khóa có nhược điểm là gây ra hiệu năng kém do việc chặn và đánh thức luồng.
- `volatile` là một cơ chế khóa nhẹ (tự nhiên hiệu năng tốt hơn so với khóa thông thường), nó đảm bảo tính nhìn thấy của biến chia sẻ trong môi trường đa luồng, nhưng không đảm bảo tính nguyên tử. Vì vậy, nó chỉ có thể sử dụng trong một số trường hợp cụ thể.
- Để kết hợp tính nguyên tử và hiệu năng của khóa, Java đã giới thiệu CAS (Compare And Swap) để thực hiện đồng bộ không chặn (còn được gọi là khóa lạc quan). Và dựa trên CAS, Java cung cấp một bộ công cụ biến nguyên tử.

### Tác dụng của lớp nguyên tử

lớp nguyên tử **nhẹ hơn và có độ tinh vi cao hơn khóa**, và là rất quan trọng để triển khai mã đa xử lý hiệu năng cao trên hệ thống đa bộ xử lý. lớp nguyên tử giới hạn phạm vi cạnh tranh chỉ đến một biến duy nhất.

lớp nguyên tử tương đương với một biến `volatile` chung, có thể hỗ trợ các hoạt động đọc / sửa / ghi có điều kiện.

lớp nguyên tử có thể được chia thành 4 nhóm:

- Kiểu cơ bản
	- `AtomicBoolean` - lớp nguyên tử kiểu boolean
	- `AtomicInteger` - lớp nguyên tử kiểu số nguyên
	- `AtomicLong` - lớp nguyên tử kiểu số nguyên dài
- Kiểu tham chiếu
	- `AtomicReference` - lớp nguyên tử kiểu tham chiếu
	- `AtomicMarkableReference` - lớp nguyên tử kiểu tham chiếu có dấu hiệu
	- `AtomicStampedReference` - lớp nguyên tử kiểu tham chiếu có số phiên bản
- Kiểu mảng
	- `AtomicIntegerArray` - lớp nguyên tử kiểu mảng số nguyên
	- `AtomicLongArray` - lớp nguyên tử kiểu mảng số nguyên dài
	- `AtomicReferenceArray` - lớp nguyên tử kiểu mảng tham chiếu
- Kiểu cập nhật thuộc tính
	- `AtomicIntegerFieldUpdater` - Cập nhật thuộc tính nguyên số nguyên nguyên tử.
	- `AtomicLongFieldUpdater` - Cập nhật thuộc tính số nguyên dài nguyên tử.
	- `AtomicReferenceFieldUpdater` - Cập nhật thuộc tính tham chiếu nguyên tử.

> Ở đây không nghiên cứu sâu về CAS, volatile và khóa. Nếu bạn muốn biết thêm chi tiết, bạn có thể tham khảo: [[Java Concurrency Core Mechanism]]

## Kiểu cơ bản

Loại này của lớp nguyên tử được sử dụng cho các kiểu dữ liệu cơ bản trong Java.

- `AtomicBoolean` - lớp nguyên tử kiểu boolean
- `AtomicInteger` - lớp nguyên tử kiểu số nguyên
- `AtomicLong` - lớp nguyên tử kiểu số nguyên dài

Các lớp trên đều hỗ trợ kỹ thuật CAS ([compare-and-swap](https://en.wikipedia.org/wiki/Compare-and-swap)), ngoài ra, `AtomicInteger` và `AtomicLong` còn hỗ trợ các phép toán số học.

> 💡 Gợi ý:
>
> Mặc dù Java chỉ cung cấp `AtomicBoolean`, `AtomicInteger` và `AtomicLong`, nhưng bạn có thể mô phỏng các biến nguyên tử cho các kiểu dữ liệu cơ bản khác. Để mô phỏng các biến nguyên tử cho các kiểu dữ liệu cơ bản khác, bạn có thể chuyển đổi các kiểu `short` hoặc `byte` thành kiểu `int`, và sử dụng `Float.floatToIntBits`, `Double.doubleToLongBits` để chuyển đổi số dấu chấm động.
>
> Vì cách triển khai và cách sử dụng của `AtomicBoolean`, `AtomicInteger` và `AtomicLong` tương đồng, vì vậy bài viết này chỉ tập trung vào `AtomicInteger`.

### **Cách sử dụng `AtomicInteger`**

```java
public final int get() // Lấy giá trị hiện tại
public final int getAndSet(int newValue) // Lấy giá trị hiện tại và đặt giá trị mới
public final int getAndIncrement()// Lấy giá trị hiện tại và tăng lên 1
public final int getAndDecrement() // Lấy giá trị hiện tại và giảm đi 1
public final int getAndAdd(int delta) // Lấy giá trị hiện tại và cộng thêm giá trị mong đợi
boolean compareAndSet(int expect, int update) // Nếu giá trị đầu vào (update) bằng giá trị mong đợi, thì đặt giá trị đó là giá trị đầu vào
public final void lazySet(int newValue) // Đặt giá trị cuối cùng là newValue, sử dụng lazySet có thể làm cho các luồng khác vẫn có thể đọc giá trị cũ trong một khoảng thời gian ngắn sau khi đặt giá trị mới.
```

Ví dụ sử dụng `AtomicInteger`:

```java
public class AtomicIntegerDemo {

    public static void main(String[] args) throws InterruptedException {
        ExecutorService executorService = Executors.newFixedThreadPool(5);
        AtomicInteger count = new AtomicInteger(0);
        for (int i = 0; i < 1000; i++) {
            executorService.submit((Runnable) () -> {
                System.out.println(Thread.currentThread().getName() + " count=" + count.get());
                count.incrementAndGet();
            });
        }

        executorService.shutdown();
        executorService.awaitTermination(30, TimeUnit.SECONDS);
        System.out.println("Final Count is : " + count.get());
    }
}
```

### **Triển khai của `AtomicInteger`**

Đọc mã nguồn của `AtomicInteger`, bạn có thể thấy các định nghĩa sau:

```java
private static final Unsafe unsafe = Unsafe.getUnsafe();
private static final long valueOffset;

static {
	try {
		valueOffset = unsafe.objectFieldOffset
			(AtomicInteger.class.getDeclaredField("value"));
	} catch (Exception ex) { throw new Error(ex); }
}

private volatile int value;
```

> Giải thích:
>
> - `value` - Thuộc tính value được đánh dấu bằng `volatile`, điều này đảm bảo các thay đổi đối với value trong môi trường đa luồng có thể nhìn thấy bởi tất cả các luồng.
> - `valueOffset` - Độ lệch của thuộc tính value, thông qua độ lệch này, chúng ta có thể nhanh chóng xác định đến trường value, đây là yếu tố quan trọng trong việc triển khai `AtomicInteger`.
> - `unsafe` - Một thuộc tính kiểu Unsafe, nó cung cấp khả năng CAS cho `AtomicInteger`.

## Kiểu tham chiếu

Trong Java, dữ liệu được chia thành hai loại: **kiểu dữ liệu cơ bản** và **kiểu dữ liệu tham chiếu** (nếu bạn không hiểu về việc chia loại dữ liệu trong Java, bạn có thể tham khảo: [[Java Basic Data Type]]).

Ở phần trước, đã đề cập đến lớp nguyên tử dành cho kiểu dữ liệu cơ bản, nhưng nếu muốn thực hiện các hoạt động nguyên tử trên kiểu dữ liệu tham chiếu thì làm thế nào? Java cũng cung cấp các lớp nguyên tử tương ứng:

- `AtomicReference` - lớp nguyên tử kiểu tham chiếu
- `AtomicMarkableReference` - lớp nguyên tử kiểu tham chiếu có dấu hiệu
- `AtomicStampedReference` - lớp nguyên tử kiểu tham chiếu có số phiên bản

> Lớp `AtomicStampedReference` trong các lớp nguyên tử kiểu tham chiếu, giải quyết hoàn toàn vấn đề ABA, khả năng CAS khác tương đối, vì vậy nó là lớp đáng chú ý nhất. Vì vậy, phần này chỉ tập trung vào `AtomicStampedReference`.

Ví dụ: Sử dụng `AtomicReference` để triển khai một khóa xoay tự động đơn giản

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

    /**
     * Khóa xoay tự động đơn giản dựa trên {@link AtomicReference}
     */
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

    /**
     * Sử dụng khóa xoay tự động {@link SpinLock} để xử lý đồng thời dữ liệu
     */
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

Cách triển khai của lớp nguyên tử dựa trên cơ chế CAS, và cơ chế CAS có vấn đề ABA (nếu bạn không hiểu về vấn đề ABA, bạn có thể tham khảo: [[Java Concurrency Core Mechanism]]). Chính vì vấn đề ABA mà `AtomicMarkableReference` và `AtomicStampedReference` ra đời.

`AtomicMarkableReference` sử dụng một giá trị boolean làm dấu hiệu, khi thay đổi, giá trị này chuyển đổi giữa true / false. Chiến lược này không giải quyết vấn đề ABA một cách cơ bản, nhưng có thể giảm thiểu khả năng xảy ra vấn đề ABA. Thường được sử dụng trong các tình huống như bộ nhớ cache hoặc mô tả trạng thái.

```java
public class AtomicMarkableReferenceDemo {

    private final static String INIT_TEXT = "abc";

    public static void main(String[] args) throws InterruptedException {

        final AtomicMarkableReference<String> amr = new AtomicMarkableReference<>(INIT_TEXT, false);

        ExecutorService executorService = Executors.newFixedThreadPool(3);
        for (int i = 0; i < 10; i++) {
            executorService.submit(new Runnable() {
                @Override
                public void run() {
                    try {
                        Thread.sleep(Math.abs((int) (Math.random() * 100)));
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }

                    String name = Thread.currentThread().getName();
                    if (amr.compareAndSet(INIT_TEXT, name, amr.isMarked(), !amr.isMarked())) {
                        System.out.println(Thread.currentThread().getName() + " đã thay đổi đối tượng!");
                        System.out.println("Đối tượng mới là: " + amr.getReference());
                    }
                }
            });
        }

        executorService.shutdown();
        executorService.awaitTermination(3, TimeUnit.SECONDS);
    }

}
```

`AtomicStampedReference` sử dụng một giá trị nguyên làm phiên bản, trước khi thay đổi, nó so sánh phiên bản. Nếu giống nhau, mới thực hiện sửa đổi. Chiến lược này giải quyết vấn đề ABA một cách cơ bản.

```java
public class AtomicStampedReferenceDemo {

    private final static String INIT_REF = "pool-1-thread-3";

    private final static AtomicStampedReference<String> asr = new AtomicStampedReference<>(INIT_REF, 0);

    public static void main(String[] args) throws InterruptedException {

        System.out.println("Đối tượng ban đầu là: " + asr.getReference());

        ExecutorService executorService = Executors.newFixedThreadPool(3);
        for (int i = 0; i < 3; i++) {
            executorService.execute(new MyThread());
        }

        executorService.shutdown();
        executorService.awaitTermination(3, TimeUnit.SECONDS);
    }

    static class MyThread implements Runnable {

        @Override
        public void run() {
            try {
                Thread.sleep(Math.abs((int) (Math.random() * 100)));
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            final int stamp = asr.getStamp();
            if (asr.compareAndSet(INIT_REF, Thread.currentThread().getName(), stamp, stamp + 1)) {
                System.out.println(Thread.currentThread().getName() + " đã thay đổi đối tượng!");
                System.out.println("Đối tượng mới là: " + asr.getReference());
            }
        }

    }

}
```

## Kiểu mảng

Java cung cấp các lớp nguyên tử cho mảng như sau:

- `AtomicIntegerArray` - Lớp nguyên tử cho mảng số nguyên
- `AtomicLongArray` - Lớp nguyên tử cho mảng số long
- `AtomicReferenceArray` - Lớp nguyên tử cho mảng tham chiếu

Tại sao lại cần có các lớp nguyên tử cho mảng khi đã có các lớp nguyên tử cho kiểu dữ liệu cơ bản và kiểu tham chiếu?  

Lớp nguyên tử cho mảng cung cấp cú pháp truy cập với tính năng `volatile` cho **các phần tử của mảng**. Điều này không có trong mảng thông thường - **mảng có kiểu `volatile` chỉ có tính năng `volatile` trên tham chiếu của mảng**.

Ví dụ: Ví dụ về việc sử dụng `AtomicIntegerArray` (cách sử dụng `AtomicLongArray` và `AtomicReferenceArray` tương tự)

```java
public class AtomicIntegerArrayDemo {

    private static AtomicIntegerArray atomicIntegerArray = new AtomicIntegerArray(10);

    public static void main(final String[] arguments) throws InterruptedException {

        System.out.println("Giá trị ban đầu: ");
        for (int i = 0; i < atomicIntegerArray.length(); i++) {
            atomicIntegerArray.set(i, i);
            System.out.print(atomicIntegerArray.get(i) + " ");
        }
        System.out.println();

        Thread t1 = new Thread(new Increment());
        Thread t2 = new Thread(new Compare());
        t1.start();
        t2.start();

        t1.join();
        t2.join();

        System.out.println("Giá trị cuối cùng: ");
        for (int i = 0; i < atomicIntegerArray.length(); i++) {
            System.out.print(atomicIntegerArray.get(i) + " ");
        }
        System.out.println();
    }

    static class Increment implements Runnable {

        @Override
        public void run() {

            for (int i = 0; i < atomicIntegerArray.length(); i++) {
                int value = atomicIntegerArray.incrementAndGet(i);
                System.out.println(Thread.currentThread().getName() + ", index = " + i + ", value = " + value);
            }
        }

    }

    static class Compare implements Runnable {

        @Override
        public void run() {
            for (int i = 0; i < atomicIntegerArray.length(); i++) {
                boolean swapped = atomicIntegerArray.compareAndSet(i, 2, 3);
                if (swapped) {
                    System.out.println(Thread.currentThread().getName() + " swapped, index = " + i + ", value = 3");
                }
            }
        }

    }

}
```

## Kiểu cập nhật thuộc tính

Có ba lớp trong Java hỗ trợ các hoạt động cập nhật trường dựa trên cơ chế phản chiếu:

- `AtomicIntegerFieldUpdater` - Lớp nguyên tử cập nhật trường kiểu số nguyên.
- `AtomicLongFieldUpdater` - Lớp nguyên tử cập nhật trường kiểu số long.
- `AtomicReferenceFieldUpdater` - Lớp nguyên tử cập nhật trường kiểu tham chiếu.

Các lớp này có một số hạn chế trong việc sử dụng:

- Vì các lớp nguyên tử cập nhật trường của đối tượng là các lớp trừu tượng, nên mỗi lần sử dụng, chúng ta phải sử dụng phương thức tĩnh `newUpdater()` để tạo một đối tượng cập nhật và cung cấp thông tin về lớp và trường mà chúng ta muốn cập nhật.
- Trường phải được khai báo với từ khóa `volatile`.
- Không thể sử dụng cho trường tĩnh (`static`).
- Không thể sử dụng cho trường hằng (`final`).

```java
public class AtomicReferenceFieldUpdaterDemo {

    static User user = new User("begin");

    static AtomicReferenceFieldUpdater<User, String> updater =
        AtomicReferenceFieldUpdater.newUpdater(User.class, String.class, "name");

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
            if (updater.compareAndSet(user, "begin", "end")) {
                try {
                    TimeUnit.SECONDS.sleep(1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread().getName() + " đã thay đổi name = " + user.getName());
            } else {
                System.out.println(Thread.currentThread().getName() + " đã bị thread khác thay đổi");
            }
        }

    }

    static class User {

        volatile String name;

        public User(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }

        public User setName(String name) {
            this.name = name;
            return this;
        }

    }

}
```

## Bộ tích luỹ nguyên tử

Có bốn lớp trong Java được sử dụng để thực hiện các phép cộng dồn nguyên tử, đó là `DoubleAccumulator`, `DoubleAdder`, `LongAccumulator` và `LongAdder`. Các lớp này chỉ được sử dụng để thực hiện các phép cộng dồn và có tốc độ nhanh hơn so với các kiểu dữ liệu nguyên tử, nhưng không hỗ trợ phương thức `compareAndSet()`. Nếu bạn chỉ cần thực hiện các phép cộng dồn, sử dụng các lớp cộng dồn nguyên tử sẽ có hiệu suất tốt hơn, nhưng đồng thời sẽ tiêu tốn nhiều không gian bộ nhớ hơn.

`LongAdder` bao gồm một biến `base` và một mảng `cell[]`.

- Khi chỉ có một luồng ghi và không có sự cạnh tranh, `LongAdder` sẽ trực tiếp sử dụng biến `base` làm biến nguyên tử và sửa đổi biến bằng phép toán CAS.
- Khi có nhiều luồng ghi cạnh tranh, ngoại trừ một luồng ghi chiếm biến `base`, các luồng ghi khác sẽ ghi giá trị sửa đổi vào mảng `cell[]` của chính mình.

Chúng ta có thể thấy rằng giá trị trả về sau khi thực hiện các phép toán trên `LongAdder` chỉ là một giá trị gần đúng, nhưng giá trị cuối cùng trả về từ `LongAdder` là một giá trị chính xác. Do đó, trong một số tình huống yêu cầu thời gian thực tương đối cao, `LongAdder` không thể thay thế `AtomicInteger` hoặc `AtomicLong`.
