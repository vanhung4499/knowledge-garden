---
title: Java Concurent Tools
tags: [java, javase, concurrency]
categories: [java, javase, concurrency]
date created: 2023-07-17
date modified: 2023-07-17
---

# Các lớp tiện ích đồng thời trong Java

> Gói `java.util.concurrent` (viết tắt là J.U.C) trong JDK cung cấp một số lớp tiện ích đồng thời rất hữu ích.

## CountDownLatch

> `CountDownLatch` có nghĩa đen là "khóa đếm giảm". Nó được sử dụng để **điều khiển một luồng chờ đợi nhiều luồng khác**.
>
> `CountDownLatch` duy trì một bộ đếm (count) đại diện cho số lượng sự kiện cần chờ đợi. Phương thức `countDown` giảm giá trị của bộ đếm, đại diện cho một sự kiện đã xảy ra. Luồng gọi phương thức `await` sẽ bị chặn cho đến khi bộ đếm trở thành 0, hoặc luồng đang chờ bị gián đoạn, hoặc thời gian chờ đợi đã hết.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/CountDownLatch.png)

`CountDownLatch` được triển khai dựa trên AQS (`AbstractQueuedSynchronizer`).

Phương thức khởi tạo duy nhất của `CountDownLatch`:

```java
// Khởi tạo bộ đếm
public CountDownLatch(int count) {};
```

Giải thích:

- `count` là giá trị đếm.

Các phương thức quan trọng của `CountDownLatch`:

```java
public void await() throws InterruptedException { };
public boolean await(long timeout, TimeUnit unit) throws InterruptedException { };
public void countDown() { };
```

Giải thích:

- `await()` - Luồng gọi `await()` sẽ bị treo, nó sẽ chờ cho đến khi giá trị đếm trở thành 0 trước khi tiếp tục thực thi.
- `await(long timeout, TimeUnit unit)` - Tương tự như `await()`, chỉ khác là chờ một khoảng thời gian nhất định trước khi tiếp tục thực thi nếu giá trị đếm vẫn chưa trở thành 0.
- `countDown()` - Giảm giá trị đếm đi 1.

Ví dụ:

```java
public class CountDownLatchDemo {

    public static void main(String[] args) {
        final CountDownLatch latch = new CountDownLatch(2);

        new Thread(new MyThread(latch)).start();
        new Thread(new MyThread(latch)).start();

        try {
            System.out.println("Đang chờ 2 luồng con hoàn thành...");
            latch.await();
            System.out.println("2 luồng con đã hoàn thành");
            System.out.println("Tiếp tục thực thi luồng chính");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    static class MyThread implements Runnable {

        private CountDownLatch latch;

        public MyThread(CountDownLatch latch) {
            this.latch = latch;
        }

        @Override
        public void run() {
            System.out.println("Luồng con " + Thread.currentThread().getName() + " đang thực thi");
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("Luồng con " + Thread.currentThread().getName() + " đã hoàn thành");
            latch.countDown();
        }

    }

}
```

## CyclicBarrier

> `CyclicBarrier` có nghĩa đen là "rào chắn lặp lại". `CyclicBarrier` cho phép một nhóm luồng chờ đến một trạng thái (gọi là rào chắn) trước khi cùng tiếp tục thực thi. Tên gọi "rào chắn lặp lại" xuất phát từ việc sau khi tất cả các luồng chờ đã được giải phóng, `CyclicBarrier` có thể được sử dụng lại.
>
> `CyclicBarrier` duy trì một bộ đếm (count). Mỗi lần gọi phương thức `await`, count tăng lên 1, cho đến khi giá trị của count bằng giá trị được thiết lập, tất cả các luồng đang chờ sẽ tiếp tục thực thi cùng nhau.

`CyclicBarrier` được triển khai dựa trên `ReentrantLock` và `Condition`.

Ứng dụng của `CyclicBarrier`: `CyclicBarrier` rất hữu ích trong các thuật toán lặp song song.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/CyclicBarrier.png)

`CyclicBarrier` cung cấp 2 phương thức khởi tạo:

```java
public CyclicBarrier(int parties) {}
public CyclicBarrier(int parties, Runnable barrierAction) {}
```

> Giải thích:
>
> - `parties` - Số lượng luồng cần chờ đến trạng thái rào chắn.
> - `barrierAction` - Hành động được thực thi khi rào chắn đạt trạng thái.

Các phương thức quan trọng của `CyclicBarrier`:

```java
public int await() throws InterruptedException, BrokenBarrierException {}
public int await(long timeout, TimeUnit unit)
        throws InterruptedException,
               BrokenBarrierException,
               TimeoutException {}
// Đặt lại rào chắn về trạng thái ban đầu
public void reset() {}
```

> Giải thích:
>
> - `await()` - Chờ đến khi số lượng luồng gọi `await()` đạt đến giá trị rào chắn. Nếu luồng hiện tại là luồng cuối cùng đến và một hành động rào chắn không rỗng được cung cấp trong hàm tạo, luồng hiện tại sẽ thực thi hành động đó trước khi cho phép các luồng khác tiếp tục. Nếu có ngoại lệ xảy ra trong quá trình hành động rào chắn, ngoại lệ đó sẽ được truyền lại trong luồng hiện tại và rào chắn sẽ bị hỏng.
> - `await(long timeout, TimeUnit unit)` - Tương tự như `await()`, nhưng chờ một khoảng thời gian nhất định trước khi cho phép các luồng đạt đến rào chắn tiếp tục thực thi.
> - `reset()` - Đặt lại rào chắn về trạng thái ban đầu.

Ví dụ:

```java
public class CyclicBarrierDemo {

    final static int N = 4;

    public static void main(String[] args) {
        CyclicBarrier barrier = new CyclicBarrier(N,
            new Runnable() {
                @Override
                public void run() {
                    System.out.println("Luồng hiện tại: " + Thread.currentThread().getName());
                }
            });

        for (int i = 0; i < N; i++) {
            MyThread myThread = new MyThread(barrier);
            new Thread(myThread).start();
        }
    }

    static class MyThread implements Runnable {

        private CyclicBarrier cyclicBarrier;

        MyThread(CyclicBarrier cyclicBarrier) {
            this.cyclicBarrier = cyclicBarrier;
        }

        @Override
        public void run() {
            System.out.println("Luồng " + Thread.currentThread().getName() + " đang ghi dữ liệu...");
            try {
                Thread.sleep(3000); // Giả lập việc ghi dữ liệu
                System.out.println("Luồng " + Thread.currentThread().getName() + " đã ghi dữ liệu xong, đang chờ các luồng khác ghi xong");
                cyclicBarrier.await();
            } catch (InterruptedException | BrokenBarrierException e) {
                e.printStackTrace();
            }
        }

    }

}
```

## Semaphore

> `Semaphore` có nghĩa đen là "nguồn tín hiệu". `Semaphore` được sử dụng để kiểm soát số lượng đồng thời của một đoạn mã.
>
> `Semaphore` quản lý một tập hợp các quyền ảo (permit), số lượng quyền ban đầu có thể được chỉ định thông qua phương thức khởi tạo. Mỗi lần gọi phương thức `acquire` sẽ lấy một quyền, nếu không có quyền nào sẵn có thì sẽ chờ; và phương thức `release` sẽ giải phóng một quyền.

Ứng dụng của `Semaphore`:

- `Semaphore` có thể được sử dụng để triển khai bể tài nguyên, ví dụ như bể kết nối cơ sở dữ liệu.
- `Semaphore` có thể được sử dụng để biến bất kỳ loại bộ chứa nào thành bộ chứa chặn có giới hạn.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Semaphore.png)

`Semaphore` cung cấp 2 phương thức khởi tạo:

```java
// Tham số permits đại diện cho số lượng quyền, tức là số lượng luồng được phép truy cập cùng một lúc
public Semaphore(int permits) {}
// Tham số fair xác định xem Semaphore có hoạt động công bằng hay không
public Semaphore(int permits, boolean fair) {}
```

> Giải thích:
>
> - `permits` - Khởi tạo một số lượng quyền cố định và mặc định không công bằng.
> - `fair` - Xác định xem Semaphore có hoạt động công bằng hay không. Công bằng có nghĩa là cho phép luồng chờ lâu hơn được ưu tiên lấy quyền.

Các phương thức quan trọng của `Semaphore`:

```java
// Lấy 1 quyền
public void acquire() throws InterruptedException {}
// Lấy một số lượng quyền
public void acquire(int permits) throws InterruptedException {}
// Giải phóng 1 quyền
public void release() {}
// Giải phóng một số lượng quyền
public void release(int permits) {}
```

Giải thích:

- `acquire()` - Lấy 1 quyền.
- `acquire(int permits)` - Lấy một số lượng quyền.
- `release()` - Giải phóng 1 quyền.
- `release(int permits)` - Giải phóng một số lượng quyền.

Ví dụ:

```java
public class SemaphoreDemo {

    private static final int THREAD_COUNT = 30;

    private static ExecutorService threadPool = Executors.newFixedThreadPool(THREAD_COUNT);

    private static Semaphore semaphore = new Semaphore(10);

    public static void main(String[] args) {
        for (int i = 0; i < THREAD_COUNT; i++) {
            threadPool.execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        semaphore.acquire();
                        System.out.println("Lưu dữ liệu");
                        semaphore.release();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            });
        }

        threadPool.shutdown();
    }

}
```

## Tổng kết

- `CountDownLatch` và `CyclicBarrier` đều được sử dụng để chờ đợi giữa các luồng, chỉ khác nhau ở điểm chính:
	- `CountDownLatch` thường được sử dụng khi một luồng A chờ đợi cho đến khi một số luồng khác hoàn thành nhiệm vụ trước khi nó tiếp tục thực thi.
	- `CyclicBarrier` thường được sử dụng khi một nhóm luồng cần chờ đến một trạng thái cụ thể trước khi cùng tiếp tục thực thi.
	- Ngoài ra, `CountDownLatch` không thể tái sử dụng, trong khi `CyclicBarrier` có thể tái sử dụng.
- `Semaphore` tương tự như khóa, nó được sử dụng để kiểm soát quyền truy cập vào một tập hợp tài nguyên.
