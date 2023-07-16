---
title: Java Thread Basic
tags: [java, javase, concurrency]
categories: [java, javase, concurrency]
date created: 2023-07-16
date modified: 2023-07-16
---

# Cơ bản về Thread trong Java

> **Keyword**: `Thread`, `Runnable`, `Callable`, `Future`, `wait`, `notify`, `notifyAll`, `join`, `sleep`, `yeild`, `thread state`, `thread communication`

## Giới thiệu về Luồng

### Khái niệm về Tiến trình

Đơn giản mà nói, **tiến trình là một chương trình đang chạy**. Nó là đơn vị cơ bản để hệ điều hành thực hiện việc phân chia tài nguyên. Tiến trình là động, có khả năng thực hiện các hoạt động. Tiến trình là đơn vị cơ bản để hệ điều hành cấp phát tài nguyên.

### Khái niệm về Luồng

Luồng là đơn vị cơ bản để hệ điều hành lập lịch. Luồng cũng được gọi là tiến trình nhẹ (Light Weight Process). Trong một tiến trình, có thể tạo ra nhiều luồng, mỗi luồng có các thuộc tính riêng như bộ đếm, ngăn xếp và biến cục bộ, và có thể truy cập vào các biến bộ nhớ chung.

### Sự khác biệt giữa Tiến trình và Luồng

- Một chương trình có ít nhất một tiến trình, một tiến trình có ít nhất một luồng.
- Luồng được chia nhỏ hơn so với tiến trình, do đó có chi phí thực thi thấp hơn và khả năng đồng thời cao hơn.
- Tiến trình là một thực thể, có tài nguyên độc lập; trong khi nhiều luồng trong cùng một tiến trình chia sẻ tài nguyên của tiến trình.

## Tạo Luồng

Có ba cách để tạo luồng:

- Kế thừa lớp `Thread`
- Thực hiện giao diện `Runnable`
- Thực hiện giao diện `Callable`

### Thread

Cách tạo luồng bằng cách kế thừa lớp `Thread`:

1. Định nghĩa một lớp con của lớp `Thread` và ghi đè phương thức `run` của lớp đó. Phần thân của phương thức `run` đại diện cho nhiệm vụ mà luồng sẽ thực hiện, do đó phương thức `run` được gọi là thân luồng.
2. Tạo một thể hiện của lớp con `Thread`, tức là tạo một đối tượng luồng.
3. Gọi phương thức `start` của đối tượng luồng để khởi động luồng.

```java
public class ThreadDemo {

    public static void main(String[] args) {
        // Tạo các đối tượng luồng
        MyThread tA = new MyThread("Thread-A");
        MyThread tB = new MyThread("Thread-B");
        // Khởi động luồng
        tA.start();
        tB.start();
    }

    static class MyThread extends Thread {

        private int ticket = 5;

        MyThread(String name) {
            super(name);
        }

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

### Runnable

**Việc triển khai giao diện `Runnable` tốt hơn việc kế thừa lớp `Thread`**, vì:

- Java không hỗ trợ đa kế thừa, mỗi lớp chỉ được phép kế thừa một lớp cha, nhưng có thể triển khai nhiều giao diện. Nếu kế thừa lớp `Thread`, không thể kế thừa các lớp khác, điều này không thuận lợi cho việc mở rộng.
- Có thể chỉ cần một khả năng thực thi, không cần kế thừa toàn bộ lớp `Thread` làm tăng chi phí.

Cách tạo luồng bằng cách triển khai giao diện `Runnable`:

1. Định nghĩa một lớp triển khai giao diện `Runnable` và ghi đè phương thức `run` của giao diện đó. Phần thân của phương thức `run` đại diện cho nhiệm vụ mà luồng sẽ thực hiện.
2. Tạo một thể hiện của lớp triển khai `Runnable` và sử dụng nó làm mục tiêu (`target`) cho việc tạo đối tượng `Thread`, đối tượng `Thread` mới này sẽ là đối tượng luồng thực sự.
3. Gọi phương thức `start` của đối tượng luồng để khởi động luồng.

```java
public class RunnableDemo {

    public static void main(String[] args) {
        // Tạo đối tượng luồng
        Thread tA = new Thread(new MyThread(), "Runnable-A");
        Thread tB = new Thread(new MyThread(), "Runnable-B");
        // Khởi động luồng
        tA.start();
        tB.start();
    }

    static class MyThread implements Runnable {

        private int ticket = 5;

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

### Callable, Future, FutureTask

**Kế thừa lớp Thread và triển khai giao diện Runnable đều không có giá trị trả về**. Do đó, sau khi luồng thực thi xong, không thể nhận được kết quả thực thi. Nhưng nếu muốn nhận được kết quả thực thi, làm cách nào?

Để giải quyết vấn đề này, từ Java 1.5 trở đi, đã cung cấp giao diện `Callable` và `Future`, thông qua chúng ta có thể nhận lại kết quả sau khi luồng đã hoàn thành việc thực thi.

#### Callable

Giao diện `Callable` chỉ khai báo một phương thức, phương thức đó được gọi là `call()`:

```java
public interface Callable<V> {
    /**
     * Computes a result, or throws an exception if unable to do so.
     *
     * @return computed result
     * @throws Exception if unable to compute a result
     */
    V call() throws Exception;
}
```

Để sử dụng `Callable`, thường kết hợp với `ExecutorService`. Trong giao diện `ExecutorService`, có nhiều phiên bản nạp chồng của phương thức `submit`:

```java
<T> Future<T> submit(Callable<T> task);
<T> Future<T> submit(Runnable task, T result);
Future<?> submit(Runnable task);
```

Phiên bản đầu tiên của phương thức `submit` nhận một đối tượng `Callable` làm tham số.

#### Future

`Future` là một cách để hủy bỏ, kiểm tra xem một nhiệm vụ đã hoàn thành chưa và lấy kết quả của nhiệm vụ. Nếu cần, có thể sử dụng phương thức `get` để lấy kết quả thực thi của nhiệm vụ, phương thức này sẽ chặn cho đến khi nhiệm vụ trả về kết quả.

```java
public interface Future<V> {
    boolean cancel(boolean mayInterruptIfRunning);
    boolean isCancelled();
    boolean isDone();
    V get() throws InterruptedException, ExecutionException;
    V get(long timeout, TimeUnit unit)
        throws InterruptedException, ExecutionException, TimeoutException;
}
```

#### FutureTask

Lớp `FutureTask` triển khai giao diện `RunnableFuture`, `RunnableFuture` kế thừa cả giao diện `Runnable` và `Future`.

Vì vậy, `FutureTask` có thể được thực thi như một `Runnable` bởi một luồng, và cũng có thể nhận được giá trị trả về từ `Callable`.

```java
public class FutureTask<V> implements RunnableFuture<V> {
    // ...
    public FutureTask(Callable<V> callable) {}
    public FutureTask(Runnable runnable, V result) {}
}

public interface RunnableFuture<V> extends Runnable, Future<V> {
    void run();
}
```

Thực tế, `FutureTask` là một lớp cài đặt duy nhất của giao diện `Future`.

#### Ví dụ Callable + Future + FutureTask

Cách tạo luồng bằng cách triển khai `Callable`:

1. Tạo một lớp triển khai giao diện `Callable` và triển khai phương thức `call`. Phương thức `call` sẽ là nơi thực hiện công việc của luồng và trả về kết quả.
2. Tạo một đối tượng của lớp triển khai `Callable` và sử dụng `FutureTask` để đóng gói đối tượng `Callable`, `FutureTask` sẽ đóng gói phương thức `call` của `Callable` và giá trị trả về của nó.
3. Sử dụng `FutureTask` làm mục tiêu (`target`) cho việc tạo đối tượng `Thread` và khởi động luồng.
4. Sử dụng phương thức `get` của `FutureTask` để nhận kết quả sau khi luồng thực thi xong.

```java
public class CallableDemo {

    public static void main(String[] args) {
        Callable<Long> callable = new MyThread();
        FutureTask<Long> future = new FutureTask<>(callable);
        new Thread(future, "Callable").start();
        try {
            System.out.println("Thời gian thực hiện nhiệm vụ: " + (future.get() / 1000000) + " milliseconds");
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }

    static class MyThread implements Callable<Long> {

        private int ticket = 10000;

        @Override
        public Long call() {
            long begin = System.nanoTime();
            while (ticket > 0) {
                System.out.println(Thread.currentThread().getName() + " đã bán vé thứ " + ticket);
                ticket--;
            }

            long end = System.nanoTime();
            return (end - begin);
        }

    }

}
```

## Các phương thức cơ bản của Thread

Danh sách các phương thức cơ bản của lớp `Thread`:

| Phương thức          | Mô tả                                                                                                                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `run`               | Thân phương thức thực thi của luồng.                                                                                                                                                                                        |
| `start`             | Phương thức khởi động luồng.                                                                                                                                                                                                |
| `currentThread`     | Trả về tham chiếu đến luồng đang thực thi hiện tại.                                                                                                                                                                        |
| `setName`           | Đặt tên cho luồng.                                                                                                                                                                                                         |
| `getName`           | Trả về tên của luồng.                                                                                                                                                                                                       |
| `setPriority`       | Đặt mức ưu tiên cho luồng. Mức ưu tiên của luồng trong Java nằm trong khoảng từ 1 đến 10. Luồng có mức ưu tiên cao hơn sẽ được ưu tiên thực thi. Có thể sử dụng `thread.setPriority(Thread.MAX_PRIORITY)` để đặt mức ưu tiên tối đa. |
| `getPriority`       | Trả về mức ưu tiên của luồng.                                                                                                                                                                                               |
| `setDaemon`         | Đặt luồng là luồng bảo vệ.                                                                                                                                                                                                 |
| `isDaemon`          | Kiểm tra xem luồng có phải là luồng bảo vệ hay không.                                                                                                                                                                       |
| `isAlive`           | Kiểm tra xem luồng đã khởi động chưa.                                                                                                                                                                                       |
| `interrupt`         | ngắt luồng khác.                                                                                                                                                                                                      |
| `interrupted`       | Kiểm tra xem luồng hiện tại đã bị ngắt hay chưa.                                                                                                                                                                       |
| `join`              | Đợi cho đến khi luồng khác kết thúc.                                                                                                                                                                                        |
| `Thread.sleep`      | Phương thức tĩnh. Đưa luồng đang thực thi vào trạng thái ngủ.                                                                                                                                                               |
| `Thread.yield`      | Phương thức tĩnh. Tạm dừng luồng đang thực thi để cho phép các luồng khác thực thi.                                                                                                                                         |

### Thread Sleep

**Sử dụng phương thức `Thread.sleep` để đưa luồng đang thực thi vào trạng thái ngủ**.

Phương thức `Thread.sleep` nhận một giá trị nguyên đại diện cho số mili giây mà luồng sẽ ngủ.

Phương thức `Thread.sleep` có thể ném ra ngoại lệ `InterruptedException`, vì vậy ngoại lệ này cần được xử lý trong phạm vi cục bộ. Các ngoại lệ khác nếu xảy ra trong luồng cũng cần được xử lý trong phạm vi cục bộ.

```java
public class ThreadSleepDemo {

    public static void main(String[] args) {
        new Thread(new MyThread("Thread A", 500)).start();
        new Thread(new MyThread("Thread B", 1000)).start();
        new Thread(new MyThread("Thread C", 1500)).start();
    }

    static class MyThread implements Runnable {

        /** Tên của luồng */
        private String name;

        /** Thời gian ngủ */
        private int time;

        private MyThread(String name, int time) {
            this.name = name;
            this.time = time;
        }

        @Override
        public void run() {
            try {
                // Ngủ trong khoảng thời gian đã cho
                Thread.sleep(this.time);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(this.name + " đã ngủ " + this.time + " mili giây.");
        }

    }

}
```

### Thread Yield

**Phương thức `Thread.yield` cho phép luồng hiện tại nhường bước cho các luồng khác để thực thi**.

Phương thức này chỉ đề xuất bộ lập lịch luồng, và chỉ có các luồng có cùng mức ưu tiên mới có thể thực thi.

```java
public class ThreadYieldDemo {

    public static void main(String[] args) {
        MyThread t = new MyThread();
        new Thread(t, "Thread A").start();
        new Thread(t, "Thread B").start();
    }

    static class MyThread implements Runnable {

        @Override
        public void run() {
            for (int i = 0; i < 5; i++) {
                try {
                    Thread.sleep(1000);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread().getName() + " đang chạy, i = " + i);
                if (i == 2) {
                    System.out.print("Nhường bước luồng: ");
                    Thread.yield();
                }
            }
        }
    }
}
```

### Thread Stop

> **Phương thức `stop` của lớp `Thread` có khuyết điểm và đã bị loại bỏ**.
>
> Việc sử dụng `Thread.stop` để dừng luồng sẽ làm mở khóa tất cả các monitor đã bị khóa (do `ThreadDeath` không được kiểm tra sẽ lan truyền trên ngăn xếp, điều này là hợp lý). Nếu bất kỳ đối tượng nào được bảo vệ bởi các monitor này ở trạng thái không nhất quán, các đối tượng hỏng sẽ trở nên hiển thị cho các luồng khác, dẫn đến hành vi không xác định.
>
> `Thread.stop` sẽ thực sự bóp chết luồng mà không cho phép nó thở. Nếu luồng đang giữ khóa ReentrantLock, luồng bị dừng sẽ không tự động gọi unlock() để giải phóng khóa, điều này có nghĩa là các luồng khác sẽ không có cơ hội để có được khóa ReentrantLock nữa, điều này thực sự nguy hiểm. Vì vậy, không nên sử dụng phương thức này. Cũng tương tự như các phương thức suspend() và resume(), hai phương thức này cũng không nên được sử dụng, vì vậy ở đây không cần giải thích thêm. Phương thức `Thread.stop` và các phương thức tương tự nên được thay thế bằng việc chỉnh sửa một số biến để chỉ định rằng luồng mục tiêu nên dừng. Luồng mục tiêu nên kiểm tra biến này định kỳ và nếu biến chỉ định rằng nó nên dừng, nó nên trả về từ phương thức thực thi của nó theo một cách có trật tự. Nếu luồng mục tiêu đang chờ một thời gian dài (ví dụ: trên một biến điều kiện), thì nên sử dụng các phương pháp gián đoạn để ngắt chờ đợi.

Khi một luồng đang chạy, luồng khác có thể sử dụng phương thức `interrupt` để ngắt luồng đang chạy.

```java

public class ThreadInterruptDemo {

    public static void main(String[] args) {
        MyThread mt = new MyThread(); // Tạo một đối tượng của lớp Runnable
        Thread t = new Thread(mt, "Luồng"); // Tạo một đối tượng Thread
        t.start(); // Khởi động luồng
        try {
            Thread.sleep(2000); // Ngủ 2 giây
        } catch (InterruptedException e) {
            System.out.println("3, Luồng chính đã bị ngắt");
        }
        t.interrupt(); // Ngắt luồng
    }

    static class MyThread implements Runnable {

        @Override
        public void run() {
            System.out.println("1, Vào phương thức run()");
            try {
                Thread.sleep(10000); // Ngủ 10 giây
                System.out.println("2, Đã hoàn thành việc ngủ");
            } catch (InterruptedException e) {
                System.out.println("3, Luồng MyThread đã bị ngắt");
                return; // Trả về nơi gọi
            }
            System.out.println("4, Phương thức run() kết thúc bình thường");
        }
    }
}
```

Nếu phương thức `run` của một luồng chạy trong một vòng lặp vô hạn và không thực hiện các hoạt động như `sleep` gây ra ngoại lệ `InterruptedException`, thì phương thức `interrupt` của luồng khác sẽ không thể dừng luồng trước thời gian dừng.

Tuy nhiên, việc gọi phương thức `interrupt` sẽ đánh dấu luồng bị ngắt và phương thức `interrupted` sẽ trả về `true`. Do đó, có thể sử dụng phương thức `interrupted` trong vòng lặp để kiểm tra xem luồng có đang bị ngắt không và từ đó dừng luồng trước thời gian dừng.

Có hai cách an toàn để dừng luồng:

- Định nghĩa một cờ `volatile` và sử dụng cờ này để kiểm soát việc dừng luồng trong phương thức `run`.
- Sử dụng phương thức `interrupt` và phương thức `Thread.interrupted` để kiểm soát việc dừng luồng.

【Ví dụ】Sử dụng cờ `volatile` để kiểm soát việc dừng luồng

```java
public class ThreadStopDemo2 {

    public static void main(String[] args) throws Exception {
        MyTask task = new MyTask();
        Thread thread = new Thread(task, "MyTask");
        thread.start();
        TimeUnit.MILLISECONDS.sleep(50);
        task.cancel();
    }

    private static class MyTask implements Runnable {

        private volatile boolean flag = true;

        private volatile long count = 0L;

        @Override
        public void run() {
            System.out.println(Thread.currentThread().getName() + " bắt đầu chạy");
            while (flag) {
                System.out.println(count++);
            }
            System.out.println(Thread.currentThread().getName() + " kết thúc");
        }

        /**
         * Sử dụng cờ `volatile` để kiểm soát việc dừng luồng
         */
        public void cancel() {
            flag = false;
        }

    }

}
```

【Ví dụ】Sử dụng phương thức `interrupt` và phương thức `Thread.interrupted` để kiểm soát việc dừng luồng

```java
public class ThreadStopDemo3 {

    public static void main(String[] args) throws Exception {
        MyTask task = new MyTask();
        Thread thread = new Thread(task, "MyTask");
        thread.start();
        TimeUnit.MILLISECONDS.sleep(50);
        thread.interrupt();
    }

    private static class MyTask implements Runnable {

        private volatile long count = 0L;

        @Override
        public void run() {
            System.out.println(Thread.currentThread().getName() + " bắt đầu chạy");
            // Sử dụng phương thức `Thread.interrupted` và `interrupt` để kiểm soát việc dừng luồng
            while (!Thread.interrupted()) {
                System.out.println(count++);
            }
            System.out.println(Thread.currentThread().getName() + " kết thúc");
        }
    }
}
```

### Daemon Thread

Luồng bảo vệ (Daemon Thread) là một luồng chạy ở nền và không ngăn JVM kết thúc. **Khi tất cả các luồng không phải là luồng bảo vệ kết thúc, chương trình cũng kết thúc và tất cả các luồng bảo vệ cũng bị giết**.

Tại sao cần sử dụng luồng bảo vệ?

- Luồng bảo vệ có mức ưu tiên thấp hơn, được sử dụng để cung cấp dịch vụ cho các đối tượng và luồng khác trong hệ thống. Một ứng dụng điển hình là bộ thu gom rác.

Làm thế nào để sử dụng luồng bảo vệ?

- Có thể sử dụng phương thức `isDaemon` để kiểm tra xem một luồng có phải là luồng bảo vệ hay không.
- Có thể sử dụng phương thức `setDaemon` để đặt một luồng là luồng bảo vệ.
	- Luồng người dùng đang chạy không thể được đặt là luồng bảo vệ, vì vậy `setDaemon` phải được gọi trước `thread.start` để đặt luồng là luồng bảo vệ, nếu không sẽ gây ra ngoại lệ `IllegalThreadStateException`.
	- Một luồng con được tạo ra bởi một luồng bảo vệ vẫn là luồng bảo vệ.
	- Không nên cho rằng tất cả các ứng dụng đều có thể được giao cho luồng bảo vệ để cung cấp dịch vụ, ví dụ như các hoạt động đọc/ghi hoặc tính toán logic.

```java
public class ThreadDaemonDemo {

    public static void main(String[] args) {
        Thread t = new Thread(new MyThread(), "Luồng");
        t.setDaemon(true); // Luồng này chạy ở nền
        System.out.println("Luồng t có phải là luồng bảo vệ không: " + t.isDaemon());
        t.start(); // Khởi động luồng
    }

    static class MyThread implements Runnable {

        @Override
        public void run() {
            while (true) {
                System.out.println(Thread.currentThread().getName() + " đang chạy.");
            }
        }
    }
}
```

## Giao tiếp giữa các luồng

> Khi nhiều luồng có thể làm việc cùng nhau để giải quyết một vấn đề nào đó, nếu một số phần phải hoàn thành trước các phần khác, thì cần phải điều phối các luồng.

### wait/notify/notifyAll

- `wait` - `wait` sẽ tự động giải phóng khóa đối tượng mà luồng hiện tại đang giữ, và yêu cầu hệ điều hành tạm dừng luồng hiện tại, **chuyển luồng từ trạng thái `Running` sang trạng thái `Waiting`**, đợi đến khi có lệnh `notify` / `notifyAll` để đánh thức. Nếu không giải phóng khóa, các luồng khác sẽ không thể vào phương thức đồng bộ hoặc khối đồng bộ của đối tượng, do đó không thể thực hiện lệnh `notify` hoặc `notifyAll` để đánh thức luồng bị tạm dừng, gây ra tình trạng deadlock.
- `notify` - Đánh thức một luồng đang ở trạng thái `Waiting`, và cho phép nó lấy khóa đối tượng, luồng cụ thể nào được đánh thức là do JVM quản lý.
- `notifyAll` - Đánh thức tất cả các luồng đang ở trạng thái `Waiting`, sau đó chúng cần cạnh tranh khóa đối tượng.

> Lưu ý:
>
> - **`wait`、`notify`、`notifyAll` đều là các phương thức trong lớp `Object`**, không phải là `Thread`.
> - **`wait`、`notify`、`notifyAll` chỉ có thể được sử dụng trong phương thức `synchronized` hoặc khối `synchronized`**，nếu không sẽ gây ra `IllegalMonitorStateException` khi chạy.
>
> Tại sao `wait`、`notify`、`notifyAll` không được định nghĩa trong lớp `Thread`? Tại sao `wait`、`notify`、`notifyAll` phải được sử dụng kết hợp với `synchronized`?
>
> Đầu tiên, cần hiểu một số khái niệm cơ bản:
>
> - Mỗi đối tượng Java đều có một **bộ theo dõi (monitor)** tương ứng.
> - Mỗi bộ theo dõi chứa một **khóa đối tượng**, một **hàng đợi chờ (Wait Queue)** và một **hàng đợi đồng bộ (Synchronous Queue)**.
>
> Sau khi hiểu các khái niệm trên, chúng ta hãy quay lại để hiểu hai câu hỏi trước.
>
> Tại sao các phương thức này không được định nghĩa trong lớp `Thread`?
>
> Vì mỗi đối tượng đều có khóa đối tượng, để cho một luồng hiện tại chờ đợi khóa của một đối tượng nào đó, tự nhiên phải thao tác trên đối tượng này (`Object`) chứ không phải trên luồng hiện tại (`Thread`). Vì luồng hiện tại có thể chờ nhiều khóa của nhiều luồng khác nhau, nếu thao tác trên luồng hiện tại (`Thread`), sẽ rất phức tạp.
>
> Tại sao `wait`、`notify`、`notifyAll` phải được sử dụng kết hợp với `synchronized`?
>
> Nếu gọi phương thức `wait` của một đối tượng, luồng hiện tại phải giữ khóa của đối tượng đó, do đó phải gọi phương thức `wait` trong phương thức `synchronized` hoặc khối `synchronized`.

Mẫu sản xuất, tiêu thụ là một ví dụ sử dụng `wait`、`notify`、`notifyAll`:

```java
public class ThreadWaitNotifyDemo02 {

    private static final int QUEUE_SIZE = 10;
    private static final PriorityQueue<Integer> queue = new PriorityQueue<>(QUEUE_SIZE);

    public static void main(String[] args) {
        new Producer("Producer A").start();
        new Producer("Producer B").start();
        new Consumer("Consumer A").start();
        new Consumer("Consumer B").start();
    }

    static class Consumer extends Thread {

        Consumer(String name) {
            super(name);
        }

        @Override
        public void run() {
            while (true) {
                synchronized (queue) {
                    while (queue.size() == 0) {
                        try {
                            System.out.println("Hàng đợi trống, đang chờ dữ liệu");
                            queue.wait();
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                            queue.notifyAll();
                        }
                    }
                    queue.poll(); // Mỗi lần lấy đi phần tử đầu hàng đợi
                    queue.notifyAll();
                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println(Thread.currentThread().getName() + " Lấy đi một phần tử từ hàng đợi, hiện tại hàng đợi còn：" + queue.size() + " phần tử");
                }
            }
        }
    }

    static class Producer extends Thread {

        Producer(String name) {
            super(name);
        }

        @Override
        public void run() {
            while (true) {
                synchronized (queue) {
                    while (queue.size() == QUEUE_SIZE) {
                        try {
                            System.out.println("Hàng đợi đầy, đang chờ chỗ trống");
                            queue.wait();
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                            queue.notifyAll();
                        }
                    }
                    queue.offer(1); // Mỗi lần thêm vào một phần tử
                    queue.notifyAll();
                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println(Thread.currentThread().getName() + " Thêm vào một phần tử vào hàng đợi, hiện tại hàng đợi có：" + queue.size() + " phần tử");
                }
            }
        }
    }
}
```

### join

Trong quá trình thao tác luồng, có thể sử dụng phương thức `join` để buộc một luồng chạy, trong thời gian luồng đó chạy, các luồng khác không thể chạy, phải chờ đến khi luồng đó hoàn thành mới có thể tiếp tục thực hiện.

```java
public class ThreadJoinDemo {

    public static void main(String[] args) {
        MyThread mt = new MyThread(); // Khởi tạo đối tượng con của Runnable
        Thread t = new Thread(mt, "mythread"); // Khởi tạo đối tượng Thread
        t.start(); // Khởi động luồng
        for (int i = 0; i < 50; i++) {
            if (i > 10) {
                try {
                    t.join(); // Luồng bắt buộc chạy
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            System.out.println("Luồng Main chạy --> " + i);
        }
    }

    static class MyThread implements Runnable {

        @Override
        public void run() {
            for (int i = 0; i < 50; i++) {
                System.out.println(Thread.currentThread().getName() + " Chạy, i = " + i); // Lấy tên luồng hiện tại
            }
        }
    }
}
```

### Pipe

Dòng luồng đầu vào/đầu ra của ống và dòng đầu vào/đầu ra thông thường hoặc dòng đầu vào/đầu ra mạng khác biệt là nó chủ yếu được sử dụng để truyền dữ liệu giữa các luồng, với phương tiện truyền là bộ nhớ.  
Dòng luồng đầu vào/đầu ra của ống chủ yếu bao gồm 4 cài đặt cụ thể sau: `PipedOutputStream`, `PipedInputStream`, `PipedReader` và `PipedWriter`, hai cái đầu tiên hướng tới byte, trong khi hai cái sau hướng tới ký tự.

```java
public class Piped {

    public static void main(String[] args) throws Exception {
        PipedWriter out = new PipedWriter();
        PipedReader in = new PipedReader();
        // Kết nối luồng đầu ra và luồng đầu vào, nếu không sẽ gây ra IOException khi sử dụng
        out.connect(in);
        Thread printThread = new Thread(new Print(in), "PrintThread");
        printThread.start();
        int receive = 0;
        try {
            while ((receive = System.in.read()) != -1) {
                out.write(receive);
            }
        } finally {
            out.close();
        }
    }

    static class Print implements Runnable {

        private PipedReader in;

        Print(PipedReader in) {
            this.in = in;
        }

        public void run() {
            int receive = 0;
            try {
                while ((receive = in.read()) != -1) {
                    System.out.print((char) receive);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

## Chu kỳ sống của một luồng

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/JavaThreadLifeCycle.png)

Trong lớp `java.lang.Thread.State`, có **6** trạng thái khác nhau của luồng, tại một thời điểm nhất định, một luồng chỉ có thể ở một trạng thái.

Dưới đây là mô tả của mỗi trạng thái và mối quan hệ giữa các trạng thái:

- **Mới (New)** - Luồng chưa được gọi phương thức `start` sẽ ở trạng thái này. Trạng thái này có nghĩa là: **Luồng đã được tạo nhưng chưa được khởi động**.
- **Sẵn sàng (Runnable)** - Luồng đã được gọi phương thức `start` sẽ ở trạng thái này. Trạng thái này có nghĩa là: **Luồng đã được chạy trong JVM**. Tuy nhiên, ở mức độ hệ điều hành, nó có thể đang chạy hoặc đang chờ lịch trình tài nguyên (ví dụ: tài nguyên bộ xử lý). Vì vậy, trạng thái "sẵn sàng" chỉ có nghĩa là có thể chạy, việc có thực sự chạy hay không phụ thuộc vào lịch trình tài nguyên của hệ điều hành.
- **Bị chặn (Blocked)** - Trạng thái này có nghĩa là: **Luồng đang bị chặn**. Đây là trạng thái khi luồng đang chờ lấy khóa ngầm định (`Monitor lock`) của từ khóa `synchronized`. Khi một phương thức hoặc khối `synchronized` được đánh dấu, chỉ có một luồng có thể thực thi vào một thời điểm, các luồng khác phải chờ đợi, tức là ở trạng thái bị chặn. Khi luồng nắm giữ khóa `synchronized` và luồng đang chờ lấy khóa được giải phóng, luồng bị chặn sẽ chuyển từ trạng thái "bị chặn" sang trạng thái "sẵn sàng" (`RUNNABLE`).
- **Chờ đợi (Waiting)** - Trạng thái này có nghĩa là: **Luồng đang chờ đợi một cách vô thời hạn, cho đến khi được đánh thức bởi một luồng khác**. Sự khác biệt giữa trạng thái bị chặn và trạng thái chờ đợi là trạng thái bị chặn là bị động, nó đang chờ lấy khóa ngầm định (`Monitor lock`). Trong khi trạng thái chờ đợi là chủ động, nó được thực hiện bằng cách gọi phương thức `Object.wait` và các phương thức tương tự.

  | Phương thức vào| Phương thức ra |
  | --- | --- |
  | Phương thức `Object.wait` không có tham số Timeout | Phương thức `Object.notify` / `Object.notifyAll` |
  | Phương thức `Thread.join` không có tham số Timeout | Luồng được gọi thực thi xong |
  | Phương thức `LockSupport.park` (được sử dụng trong gói Java đồng bộ) | Phương thức `LockSupport.unpark` |

- **Chờ một khoảng thời gian (Timed waiting)** - Trạng thái này có nghĩa là: **Luồng không cần chờ đợi một cách vô thời hạn, mà sẽ tự động được đánh thức sau một khoảng thời gian nhất định**.

  | Phương thức vào| Phương thức ra|
  | --- | --- |
  | Phương thức `Thread.sleep` | Kết thúc thời gian chờ |
  | Luồng nắm giữ khóa ngầm định (`Monitor lock`) và gọi phương thức `Object.wait` có Timeout | Kết thúc thời gian chờ / Phương thức `Object.notify` / `Object.notifyAll` |
  | Phương thức `Thread.join` có Timeout | Kết thúc thời gian chờ / Luồng được gọi thực thi xong |
  | Phương thức `LockSupport.parkNanos` | Phương thức `LockSupport.unpark` |
  | Phương thức `LockSupport.parkUntil` | Phương thức `LockSupport.unpark` |

- **Kết thúc (Terminated)** - Luồng thực thi xong phương thức `run`, hoặc thoát khỏi phương thức `run` do ngoại lệ. Trạng thái này có nghĩa là: Luồng đã kết thúc vòng đời.

## Các vấn đề phổ biến về luồng

### Sự khác biệt giữa phương thức sleep, yield và join

- Phương thức `yield`
	- Phương thức `yield` sẽ **chuyển luồng từ trạng thái `Running` sang trạng thái `Runnable`**.
	- Khi gọi phương thức `yield`, chỉ có **các luồng có cùng hoặc cao hơn mức ưu tiên của luồng hiện tại mới có cơ hội được thực thi**.
- Phương thức `sleep`
	- Phương thức `sleep` sẽ **chuyển luồng từ trạng thái `Running` sang trạng thái `Waiting`**.
	- Phương thức `sleep` cần chỉ định thời gian chờ, **sau khi hết thời gian chờ, JVM sẽ chuyển luồng từ trạng thái `Waiting` sang trạng thái `Runnable`**.
	- Khi gọi phương thức `sleep`, **bất kể mức ưu tiên của luồng là gì, tất cả các luồng đều có cơ hội được thực thi**.
	- Phương thức `sleep` không giải phóng "cờ khóa", có nghĩa là nếu có một khối `synchronized`, các luồng khác vẫn không thể truy cập vào dữ liệu chung.
- Phương thức `join`
	- Phương thức `join` sẽ **chuyển luồng từ trạng thái `Running` sang trạng thái `Waiting`**.
	- Khi gọi phương thức `join`, **luồng hiện tại phải chờ đến khi luồng gọi phương thức `join` kết thúc mới có thể tiếp tục thực thi**.

### Tại sao phương thức sleep và yield là tĩnh?

Phương thức `sleep` và `yield` của lớp `Thread` xử lý trạng thái `Running` của luồng.

Vì vậy, việc gọi các phương thức này trên các luồng khác không ở trạng thái `Running` là không có ý nghĩa. Đó là lý do tại sao các phương thức này là tĩnh. Chúng có thể hoạt động trong luồng đang thực thi hiện tại và tránh việc lập trình viên gọi nhầm các phương thức này trên các luồng không phải là luồng đang chạy.

### Luồng Java có thực hiện theo thứ tự ưu tiên luồng không?

Ngay cả khi đặt mức ưu tiên cho luồng, không thể đảm bảo luồng có mức ưu tiên cao sẽ được thực thi trước.

Lý do là mức ưu tiên của luồng phụ thuộc vào hỗ trợ của hệ điều hành. Tuy nhiên, các hệ điều hành khác nhau hỗ trợ mức ưu tiên luồng khác nhau và không thể tương ứng một cách chính xác với mức ưu tiên luồng trong Java.

### Gọi start hai lần cho một luồng sẽ xảy ra điều gì?

Trong Java, không được phép khởi động một luồng hai lần, việc gọi lần thứ hai sẽ ném ra ngoại lệ `IllegalThreadStateException`, đây là một ngoại lệ thời gian chạy, việc gọi nhiều lần start được coi là một lỗi lập trình.

### Sự khác biệt giữa phương thức start và run

- Phương thức `run` là thân của luồng.
- Phương thức `start` sẽ khởi động luồng, sau đó JVM sẽ cho luồng này thực thi phương thức `run`.

### Có thể gọi trực tiếp phương thức run của lớp Thread không?

- Có thể. Tuy nhiên, nếu gọi trực tiếp phương thức `run` của lớp `Thread`, nó sẽ hoạt động như một phương thức thông thường.
- Để thực thi mã của chúng ta trong một luồng mới, chúng ta phải sử dụng phương thức `start` của lớp `Thread`.
