---
title: Java ForkJoin
tags: [java, javase, concurrency]
categories: [java, javase, concurrency]
date created: 2023-07-17
date modified: 2023-07-17
---

# Java Fork Join Framework

**Đối với các nhiệm vụ đơn giản song song, bạn có thể giải quyết bằng cách sử dụng "ThreadPoolExecutor + Future". Nếu có mối quan hệ tổng hợp giữa các nhiệm vụ, bất kể là tổng hợp AND hay OR, bạn có thể sử dụng CompletableFuture. Và đối với các nhiệm vụ song song hàng loạt, bạn có thể sử dụng CompletionService.**

## CompletableFuture

### Phương thức runAsync và supplyAsync

CompletableFuture cung cấp bốn phương thức tĩnh để tạo một hoạt động bất đồng bộ.

```java
public static CompletableFuture<Void> runAsync(Runnable runnable)
public static CompletableFuture<Void> runAsync(Runnable runnable, Executor executor)
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier)
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier, Executor executor)
```

Các phương thức không chỉ định Executor sẽ sử dụng ForkJoinPool.commonPool() làm luồng chạy mã bất đồng bộ. Nếu chỉ định một Executor, nó sẽ chạy bằng luồng chạy đã chỉ định. Tất cả các phương thức sau đó đều tương tự.

- Phương thức runAsync không hỗ trợ giá trị trả về.
- Phương thức supplyAsync hỗ trợ giá trị trả về.

## CompletionStage

Giao diện CompletionStage có thể mô tả rõ ràng mối quan hệ thời gian giữa các nhiệm vụ, chẳng hạn như mối quan hệ tuần tự, song song, tổng hợp và hợp nhất.

### Mối quan hệ tuần tự

Giao diện CompletionStage mô tả mối quan hệ tuần tự, chủ yếu là các phương thức thenApply, thenAccept, thenRun và thenCompose.

Các phương thức loạt thenApply có tham số fn có kiểu giao diện `Function<T, R>`, giao diện này có phương thức liên quan đến CompletionStage là `R apply(T t)`, phương thức này không chỉ nhận tham số mà còn hỗ trợ giá trị trả về, vì vậy các phương thức loạt thenApply trả về `CompletionStage`.

Trong khi đó, các phương thức loạt thenAccept có tham số consumer có kiểu giao diện `Consumer<T>`, giao diện này có phương thức liên quan đến `CompletionStage` là void `accept(T t)`, phương thức này hỗ trợ tham số nhưng không hỗ trợ giá trị trả về, vì vậy các phương thức loạt thenAccept trả về `CompletionStage<Void>`.

Các phương thức loạt thenRun có tham số action là Runnable, vì vậy action không nhận tham số và không hỗ trợ giá trị trả về, vì vậy các phương thức loạt thenRun trả về `CompletionStage<Void>`.

Các phương thức này có thể được thực hiện bất đồng bộ bằng cách thêm từ khóa Async. Đáng chú ý là phương thức thenCompose, loạt phương thức này sẽ tạo ra một quy trình con mới, kết quả cuối cùng giống với loạt phương thức thenApply.

### Mô tả mối quan hệ tổng hợp AND

Giao diện CompletionStage mô tả mối quan hệ tổng hợp AND, chủ yếu là các phương thức thenCombine, thenAcceptBoth và runAfterBoth.

```java
CompletionStage<R> thenCombine(other, fn);
CompletionStage<R> thenCombineAsync(other, fn);
CompletionStage<Void> thenAcceptBoth(other, consumer);
CompletionStage<Void> thenAcceptBothAsync(other, consumer);
CompletionStage<Void> runAfterBoth(other, action);
CompletionStage<Void> runAfterBothAsync(other, action);
```

### Mô tả mối quan hệ tổng hợp OR

Giao diện CompletionStage mô tả mối quan hệ tổng hợp OR, chủ yếu là các phương thức applyToEither, acceptEither và runAfterEither.

```java
CompletionStage applyToEither(other, fn);
CompletionStage applyToEitherAsync(other, fn);
CompletionStage acceptEither(other, consumer);
CompletionStage acceptEitherAsync(other, consumer);
CompletionStage runAfterEither(other, action);
CompletionStage runAfterEitherAsync(other, action);
```

Dưới đây là một đoạn mã ví dụ cho việc sử dụng phương thức applyToEither() để mô tả mối quan hệ tổng hợp OR.

```java
CompletableFuture<String> f1 =
  CompletableFuture.supplyAsync(()->{
    int t = getRandom(5, 10);
    sleep(t, TimeUnit.SECONDS);
    return String.valueOf(t);
});

CompletableFuture<String> f2 =
  CompletableFuture.supplyAsync(()->{
    int t = getRandom(5, 10);
    sleep(t, TimeUnit.SECONDS);
    return String.valueOf(t);
});

CompletableFuture<String> f3 =
  f1.applyToEither(f2,s -> s);

System.out.println(f3.join());
```

### Xử lý ngoại lệ

Mặc dù các phương thức fn, consumer, action không cho phép ném ra ngoại lệ kiểm tra được, nhưng không thể ngăn chặn chúng ném ra ngoại lệ chạy, ví dụ như đoạn mã dưới đây, việc thực thi `7/0` sẽ gây ra ngoại lệ chia cho 0. Trong lập trình không đồng bộ, chúng ta có thể sử dụng try{}catch{} để bắt và xử lý ngoại lệ, nhưng trong lập trình bất đồng bộ, làm thế nào để xử lý ngoại lệ?

```java
CompletableFuture<Integer>
  f0 = CompletableFuture.
    .supplyAsync(()->(7/0))
    .thenApply(r->r*10);
System.out.println(f0.join());
```

Giao diện CompletionStage cung cấp một giải pháp rất đơn giản để xử lý ngoại lệ, so sánh với try{}catch{}, phương pháp này còn đơn giản hơn. Dưới đây là các phương thức liên quan, chúng hỗ trợ xử lý ngoại lệ và cho phép viết theo kiểu chuỗi.

```java
CompletionStage exceptionally(fn);
CompletionStage<R> whenComplete(consumer);
CompletionStage<R> whenCompleteAsync(consumer);
CompletionStage<R> handle(fn);
CompletionStage<R> handleAsync(fn);
```

Dưới đây là một đoạn mã ví dụ cho việc sử dụng phương thức exceptionally() để xử lý ngoại lệ. exceptionally() tương tự như khối catch{} trong try{}catch{}, nhưng vì hỗ trợ viết theo kiểu chuỗi, nên nó đơn giản hơn. Vì có try{}catch{}, nên chắc chắn còn khối finally{}, whenComplete() và handle() là tương tự như finally{} trong try{}finally{}. Dù có ngoại lệ xảy ra hay không, cả hai đều thực thi callback consumer và fn. Khác biệt giữa whenComplete() và handle() là whenComplete() không hỗ trợ trả về kết quả, trong khi handle() hỗ trợ trả về kết quả.

```java
CompletableFuture<Integer>
  f0 = CompletableFuture
    .supplyAsync(()->7/0))
    .thenApply(r->r*10)
    .exceptionally(e->0);
System.out.println(f0.join());
```

## Fork/Join

Fork/Join là một framework tính toán song song, chủ yếu được sử dụng để hỗ trợ mô hình nhiệm vụ chia để trị. Trong framework tính toán này, **Fork tương ứng với việc phân chia nhiệm vụ trong mô hình chia để trị, Join tương ứng với việc kết hợp kết quả**. Fork/Join framework chủ yếu bao gồm hai phần, một phần là **thread pool ForkJoinPool để xử lý nhiệm vụ chia để trị**, và một phần là **nhiệm vụ chia để trị ForkJoinTask**. Mối quan hệ giữa hai phần này tương tự như ThreadPoolExecutor và Runnable, cả hai đều có thể hiểu là gửi nhiệm vụ đến thread pool, chỉ khác là nhiệm vụ chia để trị có loại riêng biệt là ForkJoinTask.

ForkJoinTask là một lớp trừu tượng, nó có nhiều phương thức, phương thức quan trọng nhất là fork() và join(). Phương thức fork() sẽ thực hiện một nhiệm vụ con một cách bất đồng bộ, trong khi đó phương thức join() sẽ chặn luồng hiện tại để chờ kết quả thực thi của nhiệm vụ con. ForkJoinTask có hai lớp con là RecursiveAction và RecursiveTask, từ tên bạn có thể biết được, cả hai đều sử dụng phương pháp đệ quy để xử lý nhiệm vụ chia để trị. Cả hai lớp con này đều định nghĩa phương thức trừu tượng compute(), nhưng khác biệt là compute() của RecursiveAction không có giá trị trả về, trong khi compute() của RecursiveTask có giá trị trả về. Cả hai lớp con này cũng là lớp trừu tượng, khi sử dụng, bạn cần định nghĩa lớp con để mở rộng chúng.

### Nguyên lý hoạt động của ForkJoinPool

Nguyên lý hoạt động của Fork/Join parallel computing chính là ForkJoinPool, vì vậy chúng ta sẽ giới thiệu nguyên lý hoạt động của ForkJoinPool.

Sau khi học các bài viết trước trong series này, bạn đã biết rằng ThreadPoolExecutor về bản chất là một triển khai của mô hình producer-consumer, bên trong nó có một hàng đợi nhiệm vụ, hàng đợi này là phương tiện giao tiếp giữa producer và consumer; ThreadPoolExecutor có thể có nhiều luồng công việc, nhưng tất cả các luồng công việc này đều chia sẻ một hàng đợi nhiệm vụ.

ForkJoinPool cũng là một triển khai của mô hình producer-consumer, nhưng thông minh hơn. Bạn có thể tham khảo hình vẽ nguyên lý hoạt động của ForkJoinPool dưới đây để hiểu nguyên lý hoạt động của nó. ThreadPoolExecutor chỉ có một hàng đợi nhiệm vụ, trong khi ForkJoinPool có nhiều hàng đợi nhiệm vụ. Khi chúng ta gửi nhiệm vụ thông qua phương thức invoke() hoặc submit() của ForkJoinPool, ForkJoinPool sẽ dựa trên một quy tắc định tuyến nhất định để gửi nhiệm vụ vào một hàng đợi nhiệm vụ. Nếu nhiệm vụ tạo ra các nhiệm vụ con trong quá trình thực thi, các nhiệm vụ con sẽ được gửi vào hàng đợi nhiệm vụ tương ứng với luồng công việc.

Nếu hàng đợi nhiệm vụ tương ứng với luồng công việc trống rỗng, liệu luồng công việc đó có công việc để làm không? Không, ForkJoinPool hỗ trợ một cơ chế gọi là "**đánh cắp nhiệm vụ**" (task stealing). Nếu luồng công việc trống rỗng, nó có thể "đánh cắp" nhiệm vụ từ hàng đợi nhiệm vụ của luồng công việc khác, ví dụ như trong hình dưới đây, luồng T2 tương ứng với hàng đợi nhiệm vụ đã trống rỗng, nó có thể "đánh cắp" nhiệm vụ từ hàng đợi nhiệm vụ của luồng T1. Như vậy, tất cả các luồng công việc đều không bị rảnh rỗi.

Hàng đợi nhiệm vụ trong ForkJoinPool sử dụng hàng đợi hai đầu, công việc được lấy từ hai đầu hàng đợi khác nhau, điều này giúp tránh nhiều cuộc cạnh tranh dữ liệu không cần thiết. Những gì chúng tôi giới thiệu ở đây chỉ là nguyên lý đơn giản, triển khai của ForkJoinPool phức tạp hơn nhiều so với những gì chúng tôi giới thiệu ở đây, nếu bạn quan tâm, chúng tôi khuyến nghị xem mã nguồn của nó.
