---
title: Java Thread Pool
tags: [java, javase, concurrency]
categories: [java, javase, concurrency]
date created: 2023-07-17
date modified: 2023-07-17
---

# Java Thread Pool

## Giới thiệu

### Thread Pool là gì

Thread Pool là một cách xử lý đa luồng, trong quá trình xử lý, nhiệm vụ được thêm vào hàng đợi, sau đó tự động khởi động các nhiệm vụ này khi tạo ra các luồng.

### Tại sao sử dụng Thread Pool

Nếu số lượng yêu cầu đồng thời rất lớn, nhưng mỗi luồng chỉ thực hiện trong một khoảng thời gian ngắn, sẽ xảy ra tình trạng thường xuyên tạo và hủy luồng. Điều này sẽ làm giảm hiệu suất hệ thống đáng kể, có thể tạo ra thời gian và tài nguyên tạo và hủy luồng lớn hơn thời gian thực hiện công việc thực tế.

Chính vì vấn đề này, việc sử dụng Thread Pool là cần thiết. Có một số lợi ích khi sử dụng Thread Pool:

- **Giảm tiêu thụ tài nguyên** - Giảm tiêu thụ tài nguyên bằng cách tái sử dụng các luồng đã được tạo trước đó thay vì tạo và hủy luồng liên tục.
- **Tăng tốc độ phản hồi** - Khi nhiệm vụ đến, nhiệm vụ có thể được thực hiện ngay lập tức mà không cần chờ đợi việc tạo luồng.
- **Tăng tính quản lý của luồng** - Luồng là tài nguyên quý hiếm, nếu tạo ra không kiểm soát, sẽ tiêu thụ tài nguyên hệ thống và làm giảm tính ổn định của hệ thống. Sử dụng Thread Pool có thể thực hiện việc phân bổ, tinh chỉnh và giám sát luồng một cách thống nhất. Tuy nhiên, để sử dụng Thread Pool một cách hợp lý, cần hiểu rõ nguyên lý hoạt động của nó.

## Executor Framework

> Executor Framework là một framework xử lý các nhiệm vụ bất đồng bộ bằng cách gọi, lập lịch, thực thi và kiểm soát một tập hợp các nhiệm vụ.

### Tổng quan về API cốt lõi

Executor Framework có các API cốt lõi sau:

- `Executor` - Giao diện đơn giản để chạy các nhiệm vụ.
- `ExecutorService` - Mở rộng `Executor` interface. Mở rộng khả năng:
  - Hỗ trợ luồng có giá trị trả về;
  - Hỗ trợ quản lý vòng đời của luồng.
- `ScheduledExecutorService` - Mở rộng `ExecutorService` interface. Mở rộng khả năng: hỗ trợ lập lịch thực hiện các nhiệm vụ định kỳ.
- `AbstractExecutorService` - Implement mặc định của `ExecutorService` interface.
- `ThreadPoolExecutor` - Là lớp quan trọng nhất của Executor Framework, nó kế thừa từ lớp `AbstractExecutorService`.
- `ScheduledThreadPoolExecutor` - Implement của `ScheduledExecutorService` interface, là một thread pool có thể lập lịch thực hiện các nhiệm vụ.
- `Executors` - Cung cấp các phương thức tĩnh để tạo ra thread pool và trả về một đối tượng `ExecutorService`.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/exexctor-uml.png)

### Executor

Giao diện `Executor` chỉ định một phương thức `execute`, được sử dụng để chấp nhận một đối tượng `Runnable`.

```java
public interface Executor {
    void execute(Runnable command);
}
```

### ExecutorService

Giao diện `ExecutorService` mở rộng giao diện `Executor`, nó cung cấp các phương thức `invokeAll`, `invokeAny`, `shutdown`, `submit` và nhiều phương thức khác.

```java
public interface ExecutorService extends Executor {

    void shutdown();

    List<Runnable> shutdownNow();

    boolean isShutdown();

    boolean isTerminated();

    boolean awaitTermination(long timeout, TimeUnit unit)
        throws InterruptedException;

    <T> Future<T> submit(Callable<T> task);

    <T> Future<T> submit(Runnable task, T result);

    Future<?> submit(Runnable task);

    <T> List<Future<T>> invokeAll(Collection<? extends Callable<T>> tasks)
        throws InterruptedException;

    <T> List<Future<T>> invokeAll(Collection<? extends Callable<T>> tasks,
                                  long timeout, TimeUnit unit)
        throws InterruptedException;

    <T> T invokeAny(Collection<? extends Callable<T>> tasks)
        throws InterruptedException, ExecutionException;

    <T> T invokeAny(Collection<? extends Callable<T>> tasks,
                    long timeout, TimeUnit unit)
        throws InterruptedException, ExecutionException, TimeoutException;
}
```

So với giao diện `Executor`, giao diện `ExecutorService` mở rộng chức năng như sau:

- Hỗ trợ luồng có giá trị trả về - các phương thức `submit`, `invokeAll`, `invokeAny` đều hỗ trợ truyền vào đối tượng `Callable`.
- Hỗ trợ quản lý vòng đời của luồng - các phương thức `shutdown`, `shutdownNow`, `isShutdown`, `isTerminated`, `awaitTermination` đều hỗ trợ quản lý vòng đời của luồng.

### ScheduledExecutorService

Giao diện `ScheduledExecutorService` mở rộng giao diện `ExecutorService`.

Nó không chỉ hỗ trợ tất cả các chức năng của `ExecutorService`, mà còn hỗ trợ lập lịch thực hiện các nhiệm vụ.

```java
public interface ScheduledExecutorService extends ExecutorService {

    public ScheduledFuture<?> schedule(Runnable command,
                                       long delay, TimeUnit unit);

    public <V> ScheduledFuture<V> schedule(Callable<V> callable,
                                           long delay, TimeUnit unit);

    public ScheduledFuture<?> scheduleAtFixedRate(Runnable command,
                                                  long initialDelay,
                                                  long period,
                                                  TimeUnit unit);

    public ScheduledFuture<?> scheduleWithFixedDelay(Runnable command,
                                                     long initialDelay,
                                                     long delay,
                                                     TimeUnit unit);

}
```

Giao diện này cung cấp các chức năng sau:

- Phương thức `schedule` cho phép thực hiện một nhiệm vụ `Runnable` hoặc `Callable` sau một khoảng thời gian nhất định.
- Phương thức `scheduleAtFixedRate` và `scheduleWithFixedDelay` cho phép thực hiện các nhiệm vụ định kỳ theo khoảng thời gian nhất định.

## ThreadPoolExecutor

Lớp `ThreadPoolExecutor` trong gói `java.util.concurrent` là lớp quan trọng nhất trong framework `Executor`. Vì vậy, bài viết này sẽ tập trung giải thích về lớp này.

### Các trường quan trọng

`ThreadPoolExecutor` có các trường quan trọng sau:

```java
private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));
private static final int COUNT_BITS = Integer.SIZE - 3;
private static final int CAPACITY   = (1 << COUNT_BITS) - 1;
// runState is stored in the high-order bits
private static final int RUNNING    = -1 << COUNT_BITS;
private static final int SHUTDOWN   =  0 << COUNT_BITS;
private static final int STOP       =  1 << COUNT_BITS;
private static final int TIDYING    =  2 << COUNT_BITS;
private static final int TERMINATED =  3 << COUNT_BITS;
```

Giải thích các tham số:

- `ctl` - **Dùng để điều khiển trạng thái hoạt động của thread pool và số lượng thread hiệu quả trong thread pool**. Nó bao gồm hai phần thông tin:
	- Trạng thái hoạt động của thread pool (`runState`)
	- Số lượng thread hiệu quả trong thread pool (`workerCount`)
	- Có thể thấy, `ctl` được sử dụng để lưu trữ kiểu `Integer`, 3 bit cao lưu trạng thái hoạt động (`runState`), 29 bit thấp lưu trữ `workerCount`. `COUNT_BITS` là 29, `CAPACITY` là 1 dịch trái 29 bit trừ 1 (29 số 1), hằng số này đại diện cho giới hạn giá trị của `workerCount`, khoảng 500 triệu.
- Trạng thái hoạt động - Thread pool có tổng cộng năm trạng thái hoạt động:
	- `RUNNING` - **Trạng thái hoạt động**. Chấp nhận nhiệm vụ mới và xử lý các nhiệm vụ trong hàng đợi chặn.
	- `SHUTDOWN` - **Trạng thái đóng**. Không chấp nhận nhiệm vụ mới, nhưng vẫn có thể xử lý các nhiệm vụ trong hàng đợi chặn.
		- Khi thread pool ở trạng thái `RUNNING`, gọi phương thức `shutdown` sẽ đưa thread pool vào trạng thái này.
		- Phương thức `finalize` cũng sẽ gọi phương thức `shutdown` trong quá trình thực thi để vào trạng thái này.
	- `STOP` - **Trạng thái dừng**. Không chấp nhận nhiệm vụ mới và không xử lý các nhiệm vụ trong hàng đợi. Sẽ ngắt các thread đang xử lý nhiệm vụ. Khi thread pool ở trạng thái `RUNNING` hoặc `SHUTDOWN`, gọi phương thức `shutdownNow` sẽ đưa thread pool vào trạng thái này.
	- `TIDYING` - **Trạng thái dọn dẹp**. Nếu tất cả các nhiệm vụ đã kết thúc, `workerCount` (số lượng thread hiệu quả) là 0, thread pool sẽ chuyển sang trạng thái này và gọi phương thức `terminated` để chuyển sang trạng thái `TERMINATED`.
	- `TERMINATED` - **Trạng thái đã kết thúc**. Sau khi phương thức `terminated` thực thi xong, thread pool sẽ chuyển sang trạng thái này. Mặc định, phương thức `terminated` không làm gì cả. Có thể chuyển sang trạng thái `TERMINATED` khi:
		- Thread pool không ở trạng thái `RUNNING`.
		- Trạng thái thread pool không phải là `TIDYING` hoặc `TERMINATED`.
		- Nếu thread pool ở trạng thái `SHUTDOWN` và `workerQueue` rỗng.
		- `workerCount` là 0.
		- Đặt trạng thái `TIDYING` thành công.

![JavaThreadPoolState.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/JavaThreadPoolState.png)

### Phương thức khởi tạo

`ThreadPoolExecutor` có bốn phương thức khởi tạo, ba phương thức đầu tiên được xây dựng dựa trên phương thức thứ tư. Phương thức thứ tư được định nghĩa như sau:

```java
public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              ThreadFactory threadFactory,
                              RejectedExecutionHandler handler) {
```

Giải thích các tham số:

- `corePoolSize` - **Số lượng thread cố định**. Khi có nhiệm vụ mới được gửi thông qua phương thức `execute`, thread pool sẽ thực hiện các kiểm tra sau:
	- Nếu số lượng thread đang chạy ít hơn `corePoolSize`, thread pool sẽ tạo một thread mới để xử lý nhiệm vụ, ngay cả khi các thread khác trong thread pool đang rảnh rỗi.
	- Nếu số lượng thread trong thread pool lớn hơn hoặc bằng `corePoolSize` và nhỏ hơn `maximumPoolSize`, chỉ khi hàng đợi công việc đầy, thread mới sẽ được tạo để xử lý nhiệm vụ.
	- Nếu `corePoolSize` và `maximumPoolSize` có cùng giá trị, kích thước của thread pool sẽ là cố định. Khi có nhiệm vụ mới được gửi, nếu hàng đợi công việc chưa đầy, nhiệm vụ sẽ được đặt vào hàng đợi và chờ thread rảnh rỗi lấy nhiệm vụ từ hàng đợi và xử lý.
	- Nếu số lượng thread đang chạy lớn hơn hoặc bằng `maximumPoolSize`, khi đó hàng đợi và thread pool đều đầy, thread pool sẽ xử lý nhiệm vụ theo chiến lược từ chối đã được chỉ định.
	- Vì vậy, khi gửi nhiệm vụ, thứ tự kiểm tra là `corePoolSize` => hàng đợi công việc => `maximumPoolSize`.
- `maximumPoolSize` - **Số lượng thread tối đa**.
	- Nếu hàng đợi đầy và số lượng thread đã tạo nhỏ hơn `maximumPoolSize`, thread pool sẽ tạo thêm thread mới để xử lý nhiệm vụ.
	- Đáng lưu ý là: nếu sử dụng hàng đợi công việc vô hạn, tham số này sẽ không có tác dụng.
- `keepAliveTime` - **Thời gian giữ cho thread sống**.
	- Khi số lượng thread trong thread pool lớn hơn `corePoolSize`, nếu không có nhiệm vụ mới được gửi, các thread ngoài `corePoolSize` sẽ không bị hủy ngay lập tức, mà sẽ chờ đợi cho đến khi thời gian chờ vượt quá `keepAliveTime`.
	- Vì vậy, nếu có nhiều nhiệm vụ và mỗi nhiệm vụ thực thi trong thời gian ngắn, có thể tăng thời gian này để tăng hiệu suất sử dụng thread.
- `unit` - **Đơn vị thời gian của `keepAliveTime`**. Có 7 giá trị khả dụng. Có thể chọn các đơn vị thời gian sau: ngày (`DAYS`), giờ (`HOURS`), phút (`MINUTES`), mili giây (`MILLISECONDS`), micro giây (`MICROSECONDS`, 1/1000 mili giây) và nano giây (`NANOSECONDS`, 1/1000 micro giây).
- `workQueue` - **Hàng đợi công việc chờ thực thi**. Dùng để lưu trữ các nhiệm vụ chờ thực thi. Có thể chọn các hàng đợi chặn sau:
	- `ArrayBlockingQueue` - **Hàng đợi chặn có giới hạn**.
		- Hàng đợi này là **hàng đợi FIFO dựa trên mảng**.
		- Khi tạo hàng đợi này, kích thước phải được chỉ định.
	- `LinkedBlockingQueue` - **Hàng đợi chặn vô hạn**.
		- Hàng đợi này là **hàng đợi FIFO dựa trên danh sách liên kết**.
		- Nếu không chỉ định kích thước hàng đợi khi tạo, giá trị mặc định sẽ là `Integer.MAX_VALUE`.
		- Thông lượng thường cao hơn `ArrayBlockingQueue`.
		- Sử dụng `LinkedBlockingQueue` có nghĩa là `maximumPoolSize` không có tác dụng, kích thước tối đa của thread pool là `corePoolSize`, vì hàng đợi công việc là hàng đợi vô hạn.
		- `Executors.newFixedThreadPool` sử dụng hàng đợi này.
	- `SynchronousQueue` - **Không lưu trữ nhiệm vụ được gửi, mà tạo ngay một thread mới để thực thi nhiệm vụ mới gửi**.
		- Mỗi thao tác chèn phải chờ đến khi một thread khác gọi thao tác xóa, nếu không thì thao tác chèn sẽ bị chặn.
		- Thông lượng thông thường cao hơn `LinkedBlockingQueue`.
		- `Executors.newCachedThreadPool` sử dụng hàng đợi này.
	- `PriorityBlockingQueue` - **Hàng đợi chặn vô hạn có ưu tiên**.
- `threadFactory` - **Nhà máy thread**. Có thể sử dụng nhà máy thread để đặt tên có ý nghĩa hơn cho mỗi thread được tạo ra.
- `handler` - **Chiến lược khi thread pool bị đầy**. Đây là một biến kiểu `RejectedExecutionHandler`. Khi hàng đợi và thread pool đều đầy, có nghĩa là thread pool đang ở trạng thái bão hòa, cần áp dụng một chiến lược để xử lý nhiệm vụ mới được gửi. Thread pool hỗ trợ các chiến lược sau:
	- `AbortPolicy` - Từ chối nhiệm vụ và ném ra ngoại lệ. Đây cũng là chiến lược mặc định.
	- `DiscardPolicy` - Từ chối nhiệm vụ, nhưng không ném ra ngoại lệ.
	- `DiscardOldestPolicy` - Từ chối nhiệm vụ đứng đầu hàng đợi, sau đó thử lại việc thực thi nhiệm vụ (lặp lại quá trình này).
	- `CallerRunsPolicy` - Gọi trực tiếp phương thức `run` và chặn việc thực thi.
	- Nếu không có chiến lược nào phù hợp, cũng có thể tự định nghĩa một chiến lược xử lý bằng cách triển khai giao diện `RejectedExecutionHandler`. Ví dụ: ghi log hoặc lưu trữ các nhiệm vụ không thể xử lý được.

### Phương thức `execute`

Mặc định, sau khi tạo thread pool, thread pool sẽ không có thread nào, cần gửi nhiệm vụ mới để tạo thread.

Có thể sử dụng phương thức `execute`, đây là phương thức cốt lõi của `ThreadPoolExecutor`, cho phép **gửi một nhiệm vụ đến thread pool để thực thi**.

Quy trình làm việc của phương thức `execute` như sau:

1. Nếu `workerCount < corePoolSize`, thread pool sẽ tạo và khởi động một thread mới để thực thi nhiệm vụ mới gửi.
2. Nếu `workerCount >= corePoolSize` và hàng đợi công việc trong thread pool chưa đầy, nhiệm vụ sẽ được thêm vào hàng đợi đó.
3. Nếu `workerCount >= corePoolSize && workerCount < maximumPoolSize` và hàng đợi công việc trong thread pool đã đầy, thread pool sẽ tạo và khởi động một thread mới để thực thi nhiệm vụ mới gửi.
4. Nếu `workerCount >= maximumPoolSize` và hàng đợi công việc trong thread pool đã đầy, thread pool sẽ xử lý nhiệm vụ theo chiến lược từ chối đã được chỉ định.
	- `AbortPolicy` - Từ chối nhiệm vụ và ném ra ngoại lệ. Đây cũng là chiến lược mặc định.
	- `DiscardPolicy` - Từ chối nhiệm vụ, nhưng không ném ra ngoại lệ.
	- `DiscardOldestPolicy` - Từ chối nhiệm vụ đứng đầu hàng đợi, sau đó thử lại việc thực thi nhiệm vụ (lặp lại quá trình này).
	- `CallerRunsPolicy` - Gọi trực tiếp phương thức `run` và chặn việc thực thi.

![ThreadPoolExcuterExcuute.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/ThreadPoolExcuterExcuute.png)

### Các phương thức quan trọng khác

Trong lớp `ThreadPoolExecutor`, còn một số phương thức quan trọng khác:

- `submit` - Tương tự như `execute`, nhưng dành cho các thread có giá trị trả về. Phương thức `submit` được khai báo trong `ExecutorService` và đã có cài đặt cụ thể trong `AbstractExecutorService`. `ThreadPoolExecutor` sử dụng trực tiếp phương thức `submit` của `AbstractExecutorService`.
- `shutdown` - Không chấm dứt ngay lập tức thread pool, mà chờ cho đến khi tất cả các nhiệm vụ trong hàng đợi công việc được thực thi xong mới chấm dứt, nhưng sẽ không chấp nhận nhiệm vụ mới.
	- Chuyển thread pool sang trạng thái `SHUTDOWN`.
	- Gọi phương thức `interruptIdleWorkers` để yêu cầu ngắt tất cả các worker đang rảnh rỗi.
	- Cuối cùng, gọi phương thức `tryTerminate` để thử chấm dứt thread pool.
- `shutdownNow` - Chấm dứt ngay lập tức thread pool, và cố gắng ngắt các nhiệm vụ đang thực thi, xóa hàng đợi công việc và trả về các nhiệm vụ chưa được thực thi. Khác biệt với phương thức `shutdown` là:
	- Đặt trạng thái thành `STOP`.
	- Ngắt tất cả các worker, bất kể có rảnh rỗi hay không.
	- Lấy ra các nhiệm vụ chưa được thực thi từ hàng đợi chặn và trả về.
- `isShutdown` - Trả về true sau khi gọi phương thức `shutdown` hoặc `shutdownNow`.
- `isTerminaed` - Chỉ khi tất cả các nhiệm vụ đã được đóng, thread pool mới được coi là đã chấm dứt thành công. Khi đó, gọi phương thức `isTerminaed` sẽ trả về true.
- `setCorePoolSize` - Đặt kích thước thread cố định.
- `setMaximumPoolSize` - Đặt kích thước thread tối đa.
- `getTaskCount` - Tổng số nhiệm vụ đã thực thi và chưa thực thi trong thread pool.
- `getCompletedTaskCount` - Số lượng nhiệm vụ đã hoàn thành trong thread pool, giá trị này nhỏ hơn hoặc bằng `taskCount`.
- `getLargestPoolSize` - Số lượng thread tối đa đã tạo trong thread pool. Dữ liệu này cho biết thread pool đã đầy chưa, nghĩa là đã đạt đến `maximumPoolSize`.
- `getPoolSize` - Số lượng thread hiện tại trong thread pool.
- `getActiveCount` - Số lượng thread đang thực thi nhiệm vụ trong thread pool.

### Ví dụ sử dụng

```java
public class ThreadPoolExecutorDemo {

    public static void main(String[] args) {
        ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(5, 10, 500, TimeUnit.MILLISECONDS,
            new LinkedBlockingQueue<Runnable>(),
            Executors.defaultThreadFactory(),
            new ThreadPoolExecutor.AbortPolicy());

        for (int i = 0; i < 100; i++) {
            threadPoolExecutor.execute(new MyThread());
            String info = String.format("Số lượng thread trong thread pool: %s, số lượng nhiệm vụ đang chờ trong hàng đợi: %s, số lượng nhiệm vụ đã hoàn thành: %s",
                threadPoolExecutor.getPoolSize(),
                threadPoolExecutor.getQueue().size(),
                threadPoolExecutor.getCompletedTaskCount());
            System.out.println(info);
        }
        threadPoolExecutor.shutdown();
    }

    static class MyThread implements Runnable {

        @Override
        public void run() {
            System.out.println(Thread.currentThread().getName() + " đang thực thi");
        }

    }

}
```

## Executors

Lớp `Executors` trong JDK cung cấp một số thread pool đáng chú ý, **đều là các phiên bản tùy chỉnh dựa trên `ThreadPoolExecutor`**.

Trong thực tế, khi sử dụng thread pool, chúng ta thường không sử dụng trực tiếp `ThreadPoolExecutor`, mà sử dụng các phiên bản thread pool được cung cấp sẵn trong JDK.

### newSingleThreadExecutor

**Tạo một thread pool với một thread duy nhất**.

Chỉ tạo một thread làm việc để thực thi các nhiệm vụ, đảm bảo tất cả các nhiệm vụ được thực thi theo thứ tự được chỉ định (FIFO, LIFO, ưu tiên). **Nếu thread duy nhất này bị kết thúc vì một lỗi nào đó, một thread mới sẽ được tạo để thay thế**.

Đặc điểm quan trọng của thread duy nhất là: **đảm bảo thực thi các nhiệm vụ theo thứ tự**.

Ví dụ:

```java
public class SingleThreadExecutorDemo {

    public static void main(String[] args) {
        ExecutorService executorService = Executors.newSingleThreadExecutor();
        for (int i = 0; i < 100; i++) {
            executorService.execute(new Runnable() {
                @Override
                public void run() {
                    System.out.println(Thread.currentThread().getName() + " thực thi");
                }
            });
        }
        executorService.shutdown();
    }

}
```

### newFixedThreadPool

**Tạo một thread pool với kích thước cố định**.

**Mỗi khi gửi một nhiệm vụ, một thread làm việc mới sẽ được tạo, nếu số lượng thread làm việc đạt đến giới hạn tối đa của thread pool, nhiệm vụ gửi sẽ được lưu vào hàng đợi chặn**.

`FixedThreadPool` là một thread pool điển hình và tốt, nó có lợi thế là tăng hiệu suất chương trình và tiết kiệm chi phí tạo thread. Tuy nhiên, khi thread pool không hoạt động, tức là không có nhiệm vụ chạy, nó sẽ không giải phóng thread làm việc và tiếp tục chiếm một số tài nguyên hệ thống.

Ví dụ:

```java
public class FixedThreadPoolDemo {

    public static void main(String[] args) {
        ExecutorService executorService = Executors.newFixedThreadPool(3);
        for (int i = 0; i < 100; i++) {
            executorService.execute(new Runnable() {
                @Override
                public void run() {
                    System.out.println(Thread.currentThread().getName() + " thực thi");
                }
            });
        }
        executorService.shutdown();
    }

}
```

### newCachedThreadPool

**Tạo một thread pool có thể lưu trữ**.

- Nếu kích thước thread pool vượt quá số lượng thread cần xử lý nhiệm vụ, một số thread rảnh sẽ được thu hồi;
- Nếu không có nhiệm vụ mới được gửi trong một khoảng thời gian dài (mặc định là 1 phút), các thread rảnh sẽ tự động kết thúc. Sau khi kết thúc, nếu bạn gửi một nhiệm vụ mới, thread pool sẽ tạo một thread làm việc mới.
- Thread pool này không giới hạn kích thước, kích thước của thread pool hoàn toàn phụ thuộc vào hệ điều hành (hoặc JVM) có thể tạo ra số lượng thread tối đa nào. Do đó, khi sử dụng `CachedThreadPool`, cần chú ý kiểm soát số lượng nhiệm vụ, vì khi có quá nhiều thread chạy cùng một lúc, có thể gây tắc nghẽn hệ thống.

Ví dụ:

```java
public class CachedThreadPoolDemo {

    public static void main(String[] args) {
        ExecutorService executorService = Executors.newCachedThreadPool();
        for (int i = 0; i < 100; i++) {
            executorService.execute(new Runnable() {
                @Override
                public void run() {
                    System.out.println(Thread.currentThread().getName() + " thực thi");
                }
            });
        }
        executorService.shutdown();
    }

}
```

### newScheduleThreadPool

Tạo một thread pool với kích thước không giới hạn. Thread pool này hỗ trợ thực hiện nhiệm vụ theo lịch trình và chu kỳ.

```java
public class ScheduledThreadPoolDemo {

    public static void main(String[] args) {
        schedule();
        scheduleAtFixedRate();
    }

    private static void schedule() {
        ScheduledExecutorService executorService = Executors.newScheduledThreadPool(5);
        for (int i = 0; i < 100; i++) {
            executorService.schedule(new Runnable() {
                @Override
                public void run() {
                    System.out.println(Thread.currentThread().getName() + " thực thi");
                }
            }, 1, TimeUnit.SECONDS);
        }
        executorService.shutdown();
    }

    private static void scheduleAtFixedRate() {
        ScheduledExecutorService executorService = Executors.newScheduledThreadPool(5);
        for (int i = 0; i < 100; i++) {
            executorService.scheduleAtFixedRate(new Runnable() {
                @Override
                public void run() {
                    System.out.println(Thread.currentThread().getName() + " thực thi");
                }
            }, 1, 1, TimeUnit.SECONDS);
        }
        executorService.shutdown();
    }

}
```

### newWorkStealingPool

Giới thiệu từ Java 8.

Nó sẽ xây dựng một `ForkJoinPool` bên trong và sử dụng thuật toán [Work-Stealing](https://en.wikipedia.org/wiki/Work_stealing) để thực hiện các nhiệm vụ song song, không đảm bảo thứ tự xử lý.

## Best Practice cho Thread Pool

### Xác định số lượng thread

Thường thì nhiệm vụ thực thi đa luồng có thể được chia thành hai loại: CPU-bound (tập trung vào CPU) và I/O-bound (tập trung vào I/O). Dựa trên loại nhiệm vụ khác nhau, chúng ta sẽ tính toán số lượng thread theo cách khác nhau.

**Nhiệm vụ tập trung vào CPU:** Loại nhiệm vụ này tốn nhiều tài nguyên CPU, có thể đặt số lượng thread là N (số lõi CPU) + 1. Thread thứ N+1 được tạo ra để đảm bảo rằng nếu có sự cố xảy ra và thread bị tạm dừng, CPU vẫn có thể được sử dụng hiệu quả. Khi không có nhiệm vụ nào đang chạy, CPU sẽ trống rải và thread thứ N+1 có thể sử dụng thời gian trống của CPU.

**Nhiệm vụ tập trung vào I/O:** Loại nhiệm vụ này sử dụng nhiều thời gian để xử lý I/O, trong thời gian đó thread không sử dụng CPU để xử lý. Vì vậy, trong ứng dụng tập trung vào I/O, chúng ta có thể cấu hình nhiều thread hơn, cụ thể là 2N.

### Sử dụng hàng đợi có giới hạn

Không khuyến nghị sử dụng các phương thức của `Executors` vì lý do quan trọng nhất là: nhiều phương thức mặc định sử dụng `LinkedBlockingQueue` không giới hạn. Trong tình huống tải cao, hàng đợi không giới hạn có thể dễ dàng gây ra OOM (Out of Memory), và OOM sẽ làm cho tất cả các yêu cầu không thể xử lý được, đây là một vấn đề chết người. Vì vậy, **rất khuyến nghị sử dụng hàng đợi có giới hạn**.

Trong "Hướng dẫn phát triển Java của Alibaba", nói rõ rằng không được sử dụng các phương thức này để tạo thread pool, mà nên tạo thread pool bằng cách sử dụng `new ThreadPoolExecutor` thủ công. Quy tắc này được đưa ra vì nó dễ dẫn đến sự cố sản xuất, ví dụ: `newFixedThreadPool` và `newCachedThreadPool` có thể gây ra vấn đề OOM nếu không kiểm soát được số lượng nhiệm vụ.

【Ví dụ】OOM với `newFixedThreadPool`

```java
ThreadPoolExecutor threadPool = (ThreadPoolExecutor) Executors.newFixedThreadPool(1);
printStats(threadPool);
for (int i = 0; i < 100000000; i++) {
	threadPool.execute(() -> {
		String payload = IntStream.rangeClosed(1, 1000000)
			.mapToObj(__ -> "a")
			.collect(Collectors.joining("")) + UUID.randomUUID().toString();
		try {
			TimeUnit.HOURS.sleep(1);
		} catch (InterruptedException e) {
		}
		log.info(payload);
	});
}

threadPool.shutdown();
threadPool.awaitTermination(1, TimeUnit.HOURS);
```

`newFixedThreadPool` sử dụng hàng đợi công việc là `LinkedBlockingQueue` và mặc định là hàng đợi không giới hạn `Integer.MAX_VALUE` kích thước. Nếu có nhiều nhiệm vụ và thực thi chậm, hàng đợi có thể nhanh chóng tràn đầy, gây ra OOM.

【Ví dụ】OOM với `newCachedThreadPool`

```java
ThreadPoolExecutor threadPool = (ThreadPoolExecutor) Executors.newCachedThreadPool();
printStats(threadPool);
for (int i = 0; i < 100000000; i++) {
    threadPool.execute(() -> {
        String payload = UUID.randomUUID().toString();
        try {
            TimeUnit.HOURS.sleep(1);
        } catch (InterruptedException e) {
        }
        log.info(payload);
    });
}
threadPool.shutdown();
threadPool.awaitTermination(1, TimeUnit.HOURS);
```

`newCachedThreadPool` có số lượng luồng tối đa là `Integer.MAX_VALUE`, có thể coi như không có giới hạn, trong khi hàng đợi công việc của nó là `SynchronousQueue`, một hàng đợi chặn không có không gian lưu trữ. Điều này có nghĩa là, chỉ cần có yêu cầu đến, chúng ta phải tìm một luồng công việc để xử lý, nếu không có luồng trống, chúng ta sẽ tạo ra một luồng mới.

Nếu có nhiều nhiệm vụ đến, sẽ tạo ra nhiều luồng. Chúng ta biết rằng luồng cần được phân bổ một không gian bộ nhớ nhất định làm ngăn xếp luồng, ví dụ 1MB, do đó việc tạo ra vô hạn luồng sẽ dẫn đến OOM.

### Nhiệm vụ quan trọng nên được tùy chỉnh chiến lược từ chối

Sử dụng hàng đợi có giới hạn, khi có quá nhiều nhiệm vụ, bể luồng sẽ kích hoạt chính sách từ chối thực thi. Chính sách từ chối mặc định của bể luồng sẽ gây ra `RejectedExecutionException`, đây là một ngoại lệ trong thời gian chạy và trình biên dịch không buộc phải `catch` nó, do đó nhà phát triển rất dễ bỏ qua. Vì vậy, **hãy cẩn thận khi sử dụng chính sách từ chối mặc định**. Nếu các tác vụ được xử lý bởi bể luồng rất quan trọng, khuyến nghị tự tạo ra chính sách từ chối riêng; và trong công việc thực tế, thường kết hợp với chiến lược giảm cấp.
