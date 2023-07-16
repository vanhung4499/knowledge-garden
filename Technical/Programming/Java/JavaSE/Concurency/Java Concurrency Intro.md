---
title: Java Concurrency Intro
tags: [java, javase, concurrency]
categories: [java, javase, concurrency]
date created: 2023-07-10
date modified: 2023-07-16
---

# Giới thiệu về Concurrency trong Java

> **Keyword**: `Process`, `Thread`, `Thread-Safe`, `Performance`, `Deadlock`, `Starvation`, `Context Switch`
>
> **Tóm tắt**: Lập trình đa luồng không chỉ riêng của ngôn ngữ Java,mà là một mô hình lập trình đã được phát triển. Java chỉ thực hiện mô hình công việc đa luồng theo cách riêng của nó. Để học lập trình đa luồng trong Java, bạn nên hiểu các khái niệm cơ bản về đa luồng và sau đó tìm hiểu sâu hơn về các tính chất và những vấn đề liên quan khi làm việc với đa luồng. Khi bạn hiểu được những điều này, bạn sẽ hiểu tại sao các công cụ đa luồng trong Java được thiết kế như thế nào và giải quyết vấn đề gì. Bằng cách học từng phần như vậy, bạn sẽ dễ dàng nắm vững kiến thức về đa luồng và xây dựng một hệ thống kiến thức vững chắc.

## Khái niệm về Đa luồng

Lập trình đa luồng (Multi-Threading) có nhiều thuật ngữ và khái niệm tương tự, dễ gây nhầm lẫn. Phần này sẽ giúp bạn hiểu rõ các khái niệm và sự khác biệt giữa chúng.

### Đa luồng và Song song

Đa luồng (Multi-Threading) và song song (Parallel) là hai khái niệm dễ gây nhầm lẫn nhất, vậy làm sao để hiểu được sự khác biệt giữa chúng? Sự khác biệt quan trọng nhất nằm ở việc liệu chúng có diễn ra **đồng thời** hay không:

- **Đa luồng**: Đa luồng là khả năng xử lý nhiều tác vụ cùng một lúc, nhưng không nhất thiết phải diễn ra đồng thời.
- **Song song**: Song song là khả năng xử lý nhiều tác vụ cùng một lúc.

Dưới đây là một ví dụ thực tế giúp bạn hiểu rõ hơn:

- Bạn đang ăn cơm, điện thoại reo, bạn chỉ ngừng ăn sau khi ăn xong mới nhận cuộc gọi, điều này cho thấy bạn không hỗ trợ đa luồng cũng không hỗ trợ song song.
- Bạn đang ăn cơm, điện thoại reo, bạn ngừng ăn để nhận cuộc gọi, sau khi nhận xong bạn tiếp tục ăn cơm, điều này cho thấy bạn hỗ trợ đa luồng.
- Bạn đang ăn cơm, điện thoại reo, bạn vừa nghe điện thoại vừa ăn cơm, điều này cho thấy bạn hỗ trợ song song.

### Đồng bộ và Bất đồng bộ

- **Đồng bộ (synchronous)**: Đồng bộ là khi gửi một cuộc gọi và chưa nhận được kết quả, cuộc gọi sẽ không trả về cho đến khi nhận được kết quả. Nhưng một khi cuộc gọi trả về, bạn đã nhận được kết quả.
- **Bất đồng bộ (asynchronous)**: Ngược lại, bất đồng bộ là khi gửi một cuộc gọi và không chờ kết quả. Thay vào đó, cuộc gọi sẽ trả về ngay lập tức mà không có kết quả. Nói cách khác, sau khi gửi một cuộc gọi bất đồng bộ, người gọi không nhận được kết quả ngay lập tức. Thay vào đó, người được gọi sẽ thông báo cho người gọi thông qua trạng thái hoặc thông báo.

Dưới đây là một ví dụ để minh họa:

- Cuộc gọi đồng bộ giống như việc gọi điện thoại: Nếu không cúp máy, cuộc gọi sẽ không kết thúc.
- Cuộc gọi bất đồng bộ giống như việc gửi tin nhắn: Sau khi gửi tin nhắn, bạn có thể làm việc khác; khi nhận được tin nhắn trả lời, điện thoại sẽ thông báo cho bạn bằng cách rung hoặc kêu.

### Chặn và Không chặn

Chặn và không chặn liên quan đến trạng thái của chương trình khi chờ kết quả (tin nhắn, giá trị trả về):

- **Chặn (Blocking)**: Khi chờ kết quả trả về, luồng hiện tại sẽ bị treo. Luồng gọi chỉ trở lại sau khi nhận được kết quả.
- **Không chặn (Non-Blocking)**: Ngược lại, không chặn có nghĩa là khi chờ kết quả, luồng hiện tại không bị treo. Nó sẽ tiếp tục thực hiện các công việc khác trong khi chờ kết quả.

Dưới đây là một ví dụ để minh họa:

- Cuộc gọi chặn giống như việc gọi điện thoại: Cuộc gọi chỉ kết thúc khi bạn nhận được kết quả.
- Cuộc gọi không chặn giống như việc gửi tin nhắn: Sau khi gửi tin nhắn, bạn có thể làm việc khác trong khi chờ tin nhắn trả lời.

### Tiến trình và Luồng

- **Tiến trình (Process)**: Tiến trình là một hoạt động chạy độc lập với một tập hợp các tài nguyên. Tiến trình là đơn vị cơ bản để phân chia và quản lý tài nguyên trong hệ điều hành. Một tiến trình có thể được coi như một chương trình đang chạy.
- **Luồng (Thread)**: Luồng là đơn vị nhỏ nhất của tiến trình. Một tiến trình có thể chứa nhiều luồng. Luồng chia sẻ cùng tài nguyên với các luồng khác trong cùng một tiến trình.

Sự khác biệt giữa tiến trình và luồng:

- Một chương trình ít nhất có một tiến trình, một tiến trình ít nhất có một luồng.
- Luồng chia nhỏ hơn tiến trình, do đó chi phí thực thi thấp hơn và khả năng đồng thời cao hơn.
- Tiến trình là một thực thể độc lập, có tài nguyên riêng; trong khi các luồng trong cùng một tiến trình chia sẻ tài nguyên của tiến trình đó.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230715210906.png)

JVM chạy trong một tiến trình duy nhất và các luồng trong JVM chia sẻ heap của tiến trình đó. Điều này giải thích tại sao một số luồng có thể truy cập vào cùng một đối tượng. Luồng chia sẻ heap và có ngăn xếp riêng. Điều này giải thích cách một luồng gọi một phương thức và làm thế nào biến cục bộ của nó được bảo vệ. Tuy nhiên, heap không an toàn đối với luồng và cần được đồng bộ hóa để đảm bảo an toàn luồng.

### Điều kiện cạnh tranh và Vùng quan trọng

- **Điều kiện cạnh tranh (Race Condition)**: Khi hai luồng cạnh tranh cho cùng một tài nguyên, nếu thứ tự truy cập tài nguyên quan trọng, thì có điều kiện cạnh tranh xảy ra.
    
- **Vùng quan trọng** (Critical Sections)**: Đoạn mã gây ra điều kiện cạnh tranh được gọi là vùng quan trọng.

### Giám sát

Giám sát (Monitor) là quản lý biến chia sẻ và quá trình thao tác trên biến chia sẻ, giúp chúng hỗ trợ đồng thời.

Java sử dụng công nghệ giám sát, từ khóa synchronized và các phương thức wait(), notify(), notifyAll() là các thành phần của giám sát. **Giám sát và Semaphore là tương đương, có nghĩa là giám sát có thể thực hiện Semaphore và Semaphore cũng có thể thực hiện giám sát**.

## Đặc điểm của đa luồng

Công nghệ ngày càng tiến bộ, hiệu suất của CPU, bộ nhớ và thiết bị I/O cũng ngày càng cải thiện. Tuy nhiên, vẫn tồn tại một mâu thuẫn cốt lõi: **CPU, bộ nhớ và thiết bị I/O có tốc độ khác nhau**. CPU nhanh hơn bộ nhớ, bộ nhớ nhanh hơn thiết bị I/O.

Lý thuyết thùng gỗ cho chúng ta biết: một thùng gỗ có thể chứa bao nhiêu nước, phụ thuộc vào tấm gỗ ngắn nhất. Tương tự, hiệu suất chung của chương trình phụ thuộc vào hoạt động chậm nhất (tức là hoạt động I/O), vì vậy việc cải thiện hiệu suất CPU và bộ nhớ một cách đơn lẻ là vô ích.

![img](https://raw.githubusercontent.com/dunwu/images/dev/snap/20201225170052.jpg)

Để tận dụng hiệu suất cao của CPU một cách hợp lý, cân bằng sự chênh lệch tốc độ giữa ba yếu tố này, kiến trúc máy tính, hệ điều hành và trình biên dịch đã đóng góp, chủ yếu là:

- **CPU đã được gia tăng bộ nhớ cache** để cân bằng sự chênh lệch về tốc độ giữa nó và bộ nhớ;
- **Hệ điều hành đã thêm các tiến trình, luồng** để phân chia thời gian sử dụng CPU, từ đó làm cân bằng sự chênh lệch về tốc độ giữa CPU và thiết bị I/O;
- **Trình biên dịch đã tối ưu hóa thứ tự thực hiện các chỉ thị** để tận dụng cache một cách hợp lý.

Trong đó, tiến trình và luồng cho phép máy tính và chương trình có khả năng xử lý đồng thời các nhiệm vụ.

Lợi ích của đa luồng bao gồm:

- Tăng cường sử dụng tài nguyên
- Tăng tốc độ phản hồi của chương trình

### Tăng cường sử dụng tài nguyên

Hãy tưởng tượng một ứng dụng cần đọc và xử lý tệp từ hệ thống tệp cục bộ. Ví dụ, việc đọc một tệp từ đĩa cần mất 5 giây và xử lý một tệp cần mất 2 giây. Xử lý hai tệp sẽ mất:

```
Đọc tệp A trong 5 giây
Xử lý tệp A trong 2 giây
Đọc tệp B trong 5 giây
Xử lý tệp B trong 2 giây
---------------------
Tổng cộng 14 giây
```

Khi đọc tệp từ đĩa, hầu hết thời gian của CPU được sử dụng để chờ đĩa đọc dữ liệu. Trong thời gian này, CPU rất trống rải. Nó có thể làm một số công việc khác. Bằng cách thay đổi thứ tự các hoạt động, ta có thể tận dụng tốt hơn tài nguyên CPU. Xem xét thứ tự sau:

```
Đọc tệp A trong 5 giây
Đọc tệp B trong 5 giây + Xử lý tệp A trong 2 giây
Xử lý tệp B trong 2 giây
---------------------
Tổng cộng 12 giây
```

CPU chờ cho đến khi tệp đầu tiên được đọc xong. Sau đó, nó bắt đầu đọc tệp thứ hai. Trong khi tệp thứ hai đang được đọc, CPU xử lý tệp đầu tiên. Hãy nhớ rằng trong quá trình chờ đĩa đọc tệp, CPU rất trống trải.

Nói chung, CPU có thể làm một số công việc khác trong quá trình chờ I/O. Điều này không nhất thiết phải là I/O đĩa. Nó cũng có thể là I/O mạng hoặc đầu vào từ người dùng. Thông thường, I/O mạng và I/O đĩa chậm hơn nhiều so với I/O CPU và bộ nhớ.

### Tăng tốc độ phản hồi của chương trình

Một mục tiêu phổ biến khác của việc chuyển đổi từ ứng dụng đơn luồng sang ứng dụng đa luồng là tạo ra một ứng dụng phản hồi nhanh hơn. Hãy tưởng tượng một ứng dụng máy chủ, nó lắng nghe các yêu cầu đến từ một cổng. Khi một yêu cầu đến, nó xử lý yêu cầu đó và sau đó quay trở lại lắng nghe.

Luồng chính của máy chủ được mô tả như sau:

```java
while (server is active) {
    listen for request
    process request
}
```

Nếu một yêu cầu mất nhiều thời gian để xử lý, trong thời gian đó, không có yêu cầu mới nào có thể được gửi đến máy chủ. Yêu cầu chỉ có thể được chấp nhận khi máy chủ đang lắng nghe. Một thiết kế khác là cho luồng lắng nghe chuyển yêu cầu cho luồng công nhân (worker thread) và sau đó ngay lập tức quay trở lại việc lắng nghe. Luồng công nhân có thể xử lý yêu cầu và gửi phản hồi cho khách hàng. Thiết kế này được mô tả như sau:

```java
while (server is active) {
    listen for request
    hand request to worker thread
}
```

Theo cách này, luồng máy chủ nhanh chóng quay trở lại việc lắng nghe. Do đó, nhiều khách hàng hơn có thể gửi yêu cầu đến máy chủ. Ứng dụng này cũng trở nên phản hồi nhanh hơn.

Tương tự, điều này cũng áp dụng cho ứng dụng trên máy tính để bàn. Nếu bạn nhấp vào một nút để bắt đầu một tác vụ tốn thời gian, luồng này phải thực hiện tác vụ và cập nhật cửa sổ và nút. Trong quá trình thực hiện tác vụ, ứng dụng có vẻ như không phản hồi. Ngược lại, tác vụ có thể được chuyển đến luồng công nhân. Khi luồng công nhân đang bận rộn xử lý tác vụ, luồng cửa sổ có thể tự do phản hồi yêu cầu của người dùng khác. Khi luồng công nhân hoàn thành tác vụ, nó gửi tín hiệu cho luồng cửa sổ. Luồng cửa sổ có thể cập nhật cửa sổ ứng dụng và hiển thị kết quả của tác vụ. Đối với người dùng, ứng dụng có thiết kế với luồng công nhân sẽ phản hồi nhanh hơn.

### Vấn đề của đa luồng

Mọi thứ đều có lợi và hại, và đa luồng cũng không phải là ngoại lệ.

Chúng ta đã biết được những lợi ích của đa luồng: tăng cường sử dụng tài nguyên, tăng tốc độ phản hồi của chương trình. Tuy nhiên, cũng cần nhận thức về những vấn đề mà đa luồng gây ra, chủ yếu bao gồm:

- Vấn đề an toàn
- Vấn đề hoạt động
- Vấn đề hiệu suất

Chúng sẽ được trình bày chi tiết trong các phần tiếp theo.

### Vấn đề an toàn

Vấn đề quan trọng nhất trong đa luồng là vấn đề an toàn đa luồng.

**An toàn đa luồng**: Đảm bảo tính chính xác của chương trình, đảm bảo kết quả xử lý đa luồng đáp ứng các kỳ vọng.

An toàn đa luồng yêu cầu đảm bảo một số tính chất cơ bản:

- **Tính nhìn thấy** - Khi một luồng thay đổi một biến chia sẻ, trạng thái của biến đó có thể được các luồng khác nhìn thấy ngay lập tức, thường được hiểu là đồng bộ trạng thái từ luồng cục bộ của luồng vào bộ nhớ chính, `volatile` đảm bảo tính nhìn thấy.
- **Tính nguyên tử** - Đơn giản nói là các hoạt động liên quan không bị can thiệp bởi các luồng khác, thường được thực hiện thông qua cơ chế đồng bộ hóa (khóa: `synchronized`, `Lock`).
- **Tính tuần tự** - Đảm bảo ngữ nghĩa tuần tự bên trong một luồng, tránh tái sắp xếp các chỉ thị.

### Vấn đề của bộ nhớ đệm và tính nhìn thấy

> Một luồng thay đổi một biến chia sẻ, luồng khác có thể không nhìn thấy sự thay đổi đó, gọi là **tính nhìn thấy**.

Trong thời đại một lõi, tất cả các luồng đều chạy trên cùng một CPU, việc đồng bộ dữ liệu giữa bộ nhớ và CPU dễ dàng giải quyết. Vì tất cả các luồng đều làm việc trên bộ nhớ chung của CPU, việc ghi của một luồng vào bộ nhớ sẽ được luồng khác nhìn thấy ngay lập tức. Ví dụ, trong hình dưới đây, luồng A và luồng B đều làm việc trên cùng một bộ nhớ CPU, vì vậy khi luồng A cập nhật giá trị của biến V, luồng B sẽ nhìn thấy giá trị mới (giá trị đã được luồng A ghi).

<p align="center">
	<img src="https://raw.githubusercontent.com/vanhung4499/images/master/snap/Drawing%202023-07-16%2011.47.05.excalidraw.png" />
</p>

Trong thời đại đa lõi, mỗi CPU có bộ nhớ cache riêng của mình, việc đồng bộ dữ liệu giữa bộ nhớ và CPU trở nên khó khăn hơn, khi nhiều luồng chạy trên các CPU khác nhau, các luồng này sẽ làm việc trên các bộ nhớ cache khác nhau. Ví dụ trong hình dưới đây, luồng A làm việc trên bộ nhớ cache CPU-1, trong khi luồng B làm việc trên bộ nhớ cache CPU-2. Rõ ràng, khi đó luồng A thay đổi giá trị của biến V, đối với luồng B, giá trị của biến V không còn tính nhìn thấy.

<p align="center">
	<img src="https://raw.githubusercontent.com/vanhung4499/images/master/snap/Drawing%202023-07-16%2013.17.00.excalidraw.png" />
</p>

【Ví dụ】Một ví dụ về vấn đề không an toàn đối với luồng

Dưới đây, chúng ta sẽ sử dụng một đoạn mã để xác minh vấn đề về tính nhìn thấy trong môi trường đa nhân. Đoạn mã dưới đây, mỗi lần thực hiện phương thức `add10K()`, sẽ lặp lại 10000 lần phép toán count+=1. Trong phương thức `calc()`, chúng ta tạo ra hai luồng, mỗi luồng gọi một lần phương thức `add10K()`. Hãy suy nghĩ xem kết quả của việc thực hiện phương thức `calc()` sẽ là bao nhiêu?

```java
public class Test {
  private long count = 0;
  private void add10K() {
    int idx = 0;
    while(idx++ < 10000) {
      count += 1;
    }
  }
  public static long calc() {
    final Test test = new Test();
    // Tạo ra hai luồng, thực hiện phép toán add()
    Thread th1 = new Thread(()->{
      test.add10K();
    });
    Thread th2 = new Thread(()->{
      test.add10K();
    });
    // Khởi động hai luồng
    th1.start();
    th2.start();
    // Chờ hai luồng thực hiện xong
    th1.join();
    th2.join();
    return count;
  }
}
```

Trực giác cho chúng ta biết rằng kết quả sẽ là 20000, vì trong một luồng đơn, gọi hai lần phương thức add10K() thì giá trị của count sẽ là 20000, nhưng thực tế kết quả thực hiện `calc()` là một số ngẫu nhiên từ 10000 đến 20000. Tại sao vậy?

Chúng ta giả định rằng luồng A và luồng B bắt đầu thực hiện cùng nhau, vì vậy lần đầu tiên cả hai đều đọc count=0 vào bộ nhớ đệm CPU của mình, sau khi thực hiện count+=1, giá trị trong bộ nhớ đệm CPU của mỗi luồng đều là 1, sau đó ghi vào bộ nhớ, chúng ta sẽ thấy rằng giá trị trong bộ nhớ là 1, không phải là 2 như chúng ta mong đợi. Sau đó, vì mỗi bộ nhớ đệm CPU đều có giá trị của count, hai luồng đều dựa trên giá trị count trong bộ nhớ đệm CPU của mình để tính toán, dẫn đến giá trị cuối cùng của count đều nhỏ hơn 20000. Đây chính là vấn đề về tính nhìn thấy của bộ nhớ đệm.

Nếu thay đổi lặp lại 10000 lần phép toán `count+=1` thành lặp lại 1 tỷ lần, bạn sẽ nhận thấy hiệu quả rõ ràng hơn, giá trị cuối cùng của `count` gần 1 tỷ, không phải 2 tỷ. Nếu lặp lại 10000 lần, giá trị count gần 20000, nguyên nhân là hai luồng không được khởi động cùng một lúc, có một khoảng thời gian chênh lệch.

<p align="center">
	<img src="https://raw.githubusercontent.com/vanhung4499/images/master/snap/Drawing%202023-07-16%2013.32.35.excalidraw.png" />
</p>

### Vấn đề về tính nguyên tử do chuyển đổi luồng

Vì IO quá chậm, các hệ điều hành ban đầu đã phát minh ra khái niệm "đa tiến trình" (multi-process), cho phép một tiến trình thực hiện một đoạn mã nhỏ trong một khoảng thời gian (gọi là "time slice").

Trong một time slice, nếu một tiến trình thực hiện một hoạt động IO như đọc tập tin, lúc này tiến trình có thể được gán nhãn là "trạng thái ngủ" và nhường quyền sử dụng CPU. Khi tập tin được đọc vào bộ nhớ, hệ điều hành sẽ kích hoạt lại tiến trình ngủ và sau khi tỉnh dậy, tiến trình này có cơ hội để lấy lại quyền sử dụng CPU.

Tiến trình ở đây giải phóng quyền sử dụng CPU khi chờ IO để CPU có thể làm việc khác trong khoảng thời gian chờ đó, từ đó tăng tỷ lệ sử dụng CPU; ngoài ra, nếu có một tiến trình khác đọc tệp vào thời điểm này, hoạt động đọc tệp sẽ được xếp hàng, khi hoàn thành một hoạt động đọc của một tiến trình, trình điều khiển đĩa sẽ khởi động ngay lập tức hoạt động đọc tiếp theo, từ đó tăng tỷ lệ sử dụng IO.

Hệ điều hành ban đầu được xây dựng dựa trên khái niệm "tiến trình" để lập lịch CPU, các tiến trình khác nhau không chia sẻ không gian bộ nhớ và do đó để chuyển nhiệm vụ giữa các tiến trình phải chuyển mã ánh xạ bộ nhớ. Tuy nhiên, tất cả các luồng được tạo ra bởi một tiến trình chia sẻ cùng một không gian bộ nhớ, do đó chi phí của việc chuyển nhiệm vụ (**Context Switching**) giữa các luồng rất thấp. Hệ điều hành hiện đại dựa trên luồng nhẹ hơn để lập lịch và khi ta nói về "chuyển nhiệm vụ" ngày nay thì thực ra là "chuyển luồng".

Chương trình đồng thời Java dựa trên đa luồng, tự nhiên cũng liên quan đến việc chuyển đổi nhiệm vụ, có lẽ bạn không nghĩ đến việc chuyển đổi nhiệm vụ có thể là nguồn gốc của các lỗi kỳ quái trong lập trình đồng thời. Thời điểm chuyển đổi nhiệm vụ thường là khi time slice kết thúc, chúng ta hiện đang sử dụng ngôn ngữ lập trình cấp cao (high level), trong ngôn ngữ lập trình cấp cao, một câu lệnh thường cần nhiều hơn một chỉ thị CPU (CPU Instruction) để hoàn thành, ví dụ như `count += 1` trong đoạn mã trên, ít nhất cần ba chỉ thị CPU.

- Chỉ thị 1: Đầu tiên, cần tải biến count từ bộ nhớ vào thanh ghi CPU;
- Chỉ thị 2: Sau đó, thực hiện phép cộng 1 trong thanh ghi;
- Chỉ thị 3: Cuối cùng, ghi kết quả từ thanh ghi vào bộ nhớ (do cơ chế bộ nhớ cache, có thể ghi vào bộ nhớ cache CPU chứ không phải bộ nhớ).

Hệ điều hành thực hiện việc chuyển đổi nhiệm vụ có thể xảy ra sau khi một chỉ thị **CPU** được thực thi, đúng vậy, là chỉ thị CPU chứ không phải câu lệnh trong ngôn ngữ cấp cao. Đối với ba chỉ thị trên, giả sử count=0, nếu luồng A chuyển đổi sau khi hoàn thành chỉ thị 1 và tiếp tục theo chuỗi như hình dưới đây, ta sẽ nhận ra cả hai luồng đã thực hiện phép toán count+=1, tuy nhiên kết quả thu được không phải là 2 như mong muốn mà lại là 1.

<p align="center">
	<img src="https://raw.githubusercontent.com/vanhung4499/images/master/snap/Drawing%202023-07-16%2013.53.50.excalidraw.png" />
</p>

Tiềm thức của chúng ta cho rằng hoạt động `count += 1` là một thao tác không thể chia tách, giống như một nguyên tử, việc chuyển đổi luồng có thể xảy ra trước khi `count += 1`, hoặc sau khi `count += 1`, nhưng không bao giờ xảy ra ở giữa. **Chúng ta gọi tính chất mà một hoặc nhiều hoạt động không bị gián đoạn trong quá trình CPU thực hiện là tính nguyên tử (Atomicity)**. Các hoạt động nguyên tử mà CPU đảm bảo là cấp độ chỉ thị CPU, không phải toán tử trong ngôn ngữ lập trình cấp cao, đây là điều mà chúng ta không thể hiểu được. Do đó, trong nhiều trường hợp, chúng ta cần đảm bảo tính nguyên tử của hoạt động ở mức ngôn ngữ lập trình cao cấp.

### Vấn đề về thứ tự do tối ưu hóa biên dịch

Vậy trong lập trình đồng thời còn có các kỹ thuật khác có thể vi phạm trực giác và dẫn đến các lỗi kỳ quái không? Có, đó là tính tuân thủ thứ tự. Như tên gọi, tính tuân thủ thứ tự đề cập đến việc chương trình thực thi theo thứ tự các câu lệnh trong mã nguồn. Để tối ưu hiệu suất, trình biên dịch đôi khi sẽ thay đổi thứ tự các câu lệnh trong chương trình, ví dụ: trong chương trình `a = 6; b = 7;`, trình biên dịch có thể tối ưu thành `b = 7; a = 6;`, trong ví dụ này, trình biên dịch đã thay đổi thứ tự các câu lệnh nhưng không ảnh hưởng đến kết quả cuối cùng của chương trình. Tuy nhiên, đôi khi tối ưu hóa của trình biên dịch và trình thông dịch có thể dẫn đến các lỗi không mong muốn.

Trong Java, một ví dụ cổ điển là sử dụng kiểm tra kép để tạo đối tượng duy nhất, ví dụ mã sau: trong phương thức getInstance() để lấy một thể hiện, chúng ta kiểm tra xem instance có null không, nếu có, chúng ta sẽ khóa Singleton.class và kiểm tra lại xem instance có null không, nếu vẫn null, chúng ta sẽ tạo một thể hiện của Singleton.

```java
public class Singleton {
  static Singleton instance;
  static Singleton getInstance(){
    if (instance == null) {
      synchronized(Singleton.class) {
        if (instance == null)
          instance = new Singleton();
        }
    }
    return instance;
  }
}
```

Giả sử có hai luồng A và B cùng gọi phương thức getInstance(), cả hai đều nhận thấy `instance == null`, sau đó cả hai đều khóa Singleton.class, tại thời điểm này JVM đảm bảo chỉ có một luồng có thể khóa thành công (giả sử là luồng A), luồng còn lại sẽ ở trạng thái chờ (giả sử là luồng B); luồng A sẽ tạo một thể hiện Singleton, sau đó giải phóng khóa, sau khi giải phóng khóa, luồng B được đánh thức, luồng B sẽ thử khóa và lần này sẽ thành công, sau khi khóa thành công, luồng B kiểm tra `instance == null` và nhận thấy đã tạo một thể hiện của Singleton, vì vậy luồng B sẽ không tạo một thể hiện Singleton nữa.

Điều gì không hoàn hảo trong phương thức getInstance() này? Vấn đề nằm ở phép toán new, chúng ta nghĩ rằng phép toán new sẽ làm như sau:

1. Cấp phát một khối bộ nhớ M;
2. Khởi tạo đối tượng Singleton trên bộ nhớ M;
3. Gán địa chỉ M cho biến instance.

Tuy nhiên, thực tế đường đi thực thi tối ưu hóa lại như sau:

1. Cấp phát một khối bộ nhớ M;
2. Gán địa chỉ M cho biến instance;
3. Cuối cùng, khởi tạo đối tượng Singleton trên bộ nhớ M.

Tối ưu hóa này sẽ gây ra vấn đề gì? Giả sử luồng A thực hiện trước phương thức getInstance(), khi thực hiện xong chỉ thị 2 thì xảy ra chuyển đổi luồng, chuyển đổi sang luồng B; nếu lúc này luồng B cũng thực hiện phương thức getInstance(), thì khi thực hiện kiểm tra đầu tiên, luồng B sẽ nhận thấy `instance != null`, vì vậy nó sẽ trả về instance, nhưng lúc này instance chưa được khởi tạo, nếu chúng ta truy cập vào biến thành viên của instance, có thể gây ra `NullPointerException`.

<p align="center">
	<img src="https://raw.githubusercontent.com/vanhung4499/images/master/snap/Drawing%202023-07-16%2014.20.26.excalidraw.png" />
</p>

### Các phương pháp đảm bảo an toàn đồng thời

#### Đồng bộ hóa Mutex (Đồng bộ hóa chặn)

Đồng bộ hóa Mutex là biện pháp bảo đảm an toàn đồng thời phổ biến nhất.

**Đồng bộ hóa đề cập đến việc đảm bảo rằng dữ liệu chia sẻ chỉ được truy cập bởi một luồng duy nhất trong cùng một thời điểm**.

Đồng bộ hóa là một phương pháp để thực hiện đồng bộ. Critical Sections (Vùng quan trọng), Mutex và bộ Semaphore là các cách chính để thực hiện đồng bộ.

Ví dụ điển hình là sử dụng `synchronized` hoặc `Lock`.

**Vấn đề chính của đồng bộ hóa mutex là hiệu suất bị ảnh hưởng bởi việc chặn và đánh thức luồng**. Đồng bộ hóa mutex thuộc về một chiến lược đồng thời bi quan, luôn cho rằng nếu không thực hiện biện pháp đồng bộ hợp lý, sẽ xảy ra vấn đề. Dù có cạnh tranh dữ liệu chia sẻ hay không, nó vẫn phải thực hiện khóa (trong mô hình khái niệm này, máy ảo sẽ tối ưu hóa một phần lớn khóa không cần thiết), chuyển đổi giữa chế độ người dùng và chế độ kernel, duy trì bộ đếm khóa và kiểm tra xem có luồng bị chặn cần được đánh thức hay không.

#### Đồng bộ hóa không chặn

Với sự phát triển của tập lệnh phần cứng, chúng ta có thể sử dụng chiến lược đồng thời lạc quan dựa trên phát hiện xung đột: thực hiện hoạt động trước, nếu không có luồng khác cạnh tranh với dữ liệu chia sẻ, thì hoạt động sẽ thành công, nếu không, thì thực hiện biện pháp bù (lặp lại liên tục cho đến khi thành công). Điều này được gọi là chiến lược đồng thời lạc quan không chặn.

Tuy nhiên, để thực hiện chiến lược đồng thời lạc quan, cần sự phát triển của bộ chỉ thị phần cứng. Cần có tính nguyên tử trong quá trình thực hiện các hoạt động và phát hiện xung đột. Điều này do phần cứng thực hiện, nếu sử dụng đồng bộ hóa để đảm bảo, nó sẽ mất đi ý nghĩa.

Các chỉ thị khóa lạc quan phổ biến bao gồm:

- Kiểm tra và đặt (Test-and-Set)
- Lấy và tăng (Fetch-and-Increment)
- Trao đổi (Swap)
- So sánh và trao đổi (CAS)
- Tải - liên kết, lưu trữ - điều kiện (Load-linked / Store-Conditional)

Ứng dụng điển hình trong Java: Các lớp nguyên tử trong gói J.U.C (dựa trên hoạt động CAS của lớp `Unsafe`).

#### Không đồng bộ

Để đảm bảo an toàn đồng thời, không nhất thiết phải đồng bộ hóa. Đồng bộ chỉ đảm bảo tính chính xác khi có cạnh tranh dữ liệu chia sẻ, nếu một phương thức không liên quan đến dữ liệu chia sẻ, thì không cần đồng bộ.

Các phương pháp **không đồng bộ** trong Java bao gồm:

- Mã có thể lặp lại - còn được gọi là mã thuần túy. Nếu một phương thức có thể dự đoán được kết quả, tức là chỉ cần cùng một dữ liệu đầu vào, nó sẽ trả về cùng một kết quả, thì nó đáp ứng tính chất có thể lặp lại và tự nhiên là an toàn đồng thời.
- Lưu trữ cục bộ của luồng - sử dụng `ThreadLocal` để tạo một bản sao cục bộ của biến chia sẻ cho mỗi luồng, bản sao này chỉ có thể được truy cập bởi luồng hiện tại, các luồng khác không thể truy cập, do đó nó tự nhiên là an toàn đồng thời.

## Vấn đề về tính hoạt động

### Deadlock

#### Deadlock là gì?

Deadlock xảy ra khi nhiều luồng đang chờ đợi lẫn nhau để giải phóng khóa.

Deadlock xảy ra khi một luồng bị chặn vô thời hạn vì khóa mà nó yêu cầu đang được một luồng khác nắm giữ, và luồng đó lại đang chờ đợi luồng ban đầu giải phóng một khóa khác.

<p align="center">
  <img src="https://raw.githubusercontent.com/dunwu/images/dev/cs/java/javacore/concurrent/deadlock.png">
</p>

#### Tránh Deadlock

(1) Sắp xếp khóa theo thứ tự

Khi nhiều luồng cần cùng một số khóa, nhưng lại được khóa theo thứ tự khác nhau, Deadlock rất dễ xảy ra.

Nếu có thể đảm bảo tất cả các luồng đều nhận được các khóa theo cùng một thứ tự, thì Deadlock sẽ không xảy ra.

Sắp xếp khóa theo thứ tự là một cách hiệu quả để tránh Deadlock. Tuy nhiên, cách này yêu cầu bạn biết trước tất cả các khóa có thể được sử dụng (chú ý: và sắp xếp chúng theo đúng thứ tự), nhưng đôi khi không thể dự đoán được.

(2) Giải phóng khóa sau một khoảng thời gian

Một cách khác để tránh Deadlock là thêm thời gian chờ (timeout) khi cố gắng lấy khóa. Điều này có nghĩa là nếu một luồng không thể lấy được tất cả các khóa cần thiết trong khoảng thời gian đã cho, nó sẽ từ bỏ yêu cầu khóa đó. Nếu một luồng không thành công trong việc nhận tất cả các khóa cần thiết trong thời gian đã cho, nó sẽ quay lại và giải phóng tất cả các khóa đã nhận được, sau đó chờ một khoảng thời gian ngẫu nhiên trước khi thử lại. Thời gian chờ ngẫu nhiên này cho phép các luồng khác có cơ hội thử lấy các khóa tương tự và cho phép ứng dụng tiếp tục chạy khi không lấy được khóa (Quay lại và lặp lại logic của khóa trước đó).

(3) Kiểm tra Deadlock

Kiểm tra Deadlock là một cơ chế phòng ngừa Deadlock tốt hơn, chủ yếu áp dụng cho các tình huống không thể thực hiện việc sắp xếp khóa theo thứ tự và không thể sử dụng thời gian chờ khóa.

Mỗi khi một luồng nhận được một khóa, nó sẽ ghi lại thông tin liên quan đến luồng và khóa trong cấu trúc dữ liệu liên quan (bảng băm, đồ thị, v.v.). Ngoài ra, mỗi khi một luồng yêu cầu khóa, nó cũng cần được ghi lại trong cấu trúc dữ liệu này.

Khi một luồng không thành công trong việc yêu cầu khóa, nó có thể duyệt qua đồ thị khóa để kiểm tra xem có xảy ra Deadlock không.

Nếu phát hiện Deadlock, có hai cách xử lý:

- Giải phóng tất cả các khóa, quay lại và chờ một khoảng thời gian ngẫu nhiên trước khi thử lại. Điều này tương tự như việc thêm thời gian chờ khi yêu cầu khóa, nhưng chỉ thực hiện khi Deadlock đã xảy ra, chứ không phải do yêu cầu khóa vượt quá thời gian chờ. Mặc dù có thời gian chờ và quay lại, nhưng nếu có nhiều luồng cạnh tranh cùng một số lượng lớn khóa, chúng vẫn có thể Deadlock lặp lại.
- Một giải pháp tốt hơn là đặt độ ưu tiên cho các luồng này, cho phép một (hoặc một số) luồng quay lại, trong khi các luồng còn lại tiếp tục giữ các khóa cần thiết như không có Deadlock. Nếu các luồng được gán cùng một độ ưu tiên không thay đổi, cùng một nhóm luồng sẽ luôn có độ ưu tiên cao hơn. Để tránh vấn đề này, bạn có thể đặt độ ưu tiên ngẫu nhiên khi Deadlock xảy ra.

### Livelock

#### Livelock là gì

Livelock là một tình huống lặp đi lặp lại, hai hoặc nhiều luồng sẽ liên tục lặp lại một đoạn mã cụ thể. Mã dự kiến ​​sẽ cung cấp cơ hội cho các luồng khác tiếp tục hỗ trợ luồng hiện tại.

Hãy tưởng tượng một ví dụ như sau: hai người gặp nhau trong một hành lang hẹp, cả hai đều lịch sự và cố gắng di chuyển sang một bên để để người kia đi trước. Nhưng cuối cùng, họ vẫn tiếp tục dao động sang trái và phải vì cả hai đều di chuyển cùng một hướng cùng một lúc.

<p align="center">
  <img src="https://raw.githubusercontent.com/dunwu/images/dev/cs/java/javacore/concurrent/livelock.png">
</p>

Như hình minh họa: hai luồng muốn truy cập vàotài nguyên chung được chia sẻ thông qua đối tượng Worker, nhưng khi họ thấy Worker khác (gọi trên một luồng khác) cũng "hoạt động", họ sẽ cố gắng chuyển giao tài nguyên đó cho người khác và chờ cho nó kết thúc. Nếu ban đầu chúng ta làm cho cả hai Worker đều "hoạt động", chúng sẽ gặp vấn đề về Livelock.

#### Tránh Livelock

Giải quyết vấn đề "Livelock" khá đơn giản, chỉ cần nhường đường và chờ một khoảng thời gian ngẫu nhiên. Vì thời gian chờ là ngẫu nhiên, nên khả năng xảy ra va chạm lần thứ hai sau khi đã xảy ra va chạm lần đầu tiên là rất thấp. Phương pháp "chờ một khoảng thời gian ngẫu nhiên" mặc dù đơn giản, nhưng rất hiệu quả, thậm chí còn được sử dụng trong các thuật toán nổi tiếng về đồng thuận phân tán như Raft.

### Đói (Starvation)

#### Đói là gì

- Các luồng ưu tiên cao chiếm hết thời gian CPU của các luồng ưu tiên thấp.
- Luồng bị chặn vĩnh viễn trong trạng thái chờ để vào khối đồng bộ, vì các luồng khác luôn tiếp tục truy cập vào khối đồng bộ đó trước.
- Luồng đang chờ một đối tượng hoàn thành (gọi wait() trên đối tượng đó) cũng bị chặn vĩnh viễn, vì các luồng khác luôn được đánh thức trước.

<p align="center">
  <img src="https://raw.githubusercontent.com/dunwu/images/dev/cs/java/javacore/concurrent/starvation-and-fairness.png">
</p>

Ví dụ kinh điển về vấn đề đói là vấn đề của triết gia. Như hình minh họa: có năm triết gia đang ăn, mỗi người cần hai cái nĩa để ăn. Khi 2 và 4 đang ăn, 1, 3 và 5 sẽ không bao giờ có cơ hội ăn, chỉ có thể nhìn vào món ăn trên đĩa và đói đến chết.

#### Giải quyết vấn đề đói

Java không thể đảm bảo 100% tính công bằng, nhưng chúng ta vẫn có thể cải thiện tính công bằng giữa các luồng thông qua cấu trúc đồng bộ giữa các luồng.

Có ba phương án:

- Đảm bảo tài nguyên đủ:
- Phân phối tài nguyên một cách công bằng:
- Tránh luồng giữ khóa trong thời gian dài:

Ba phương án này, phương án một và phương án ba có giới hạn ứng dụng, vì trong nhiều tình huống, không thể giải quyết được sự khan hiếm của tài nguyên hoặc giảm thời gian thực thi của luồng giữ khóa. Phương án hai có ứng dụng tương đối rộng rãi hơn.

Vậy làm thế nào để phân phối tài nguyên một cách công bằng? Trong lập trình đồng thời, chủ yếu sử dụng khóa công bằng. Khóa công bằng là một cơ chế theo thứ tự đến trước đến trước, việc chờ đợi của luồng được sắp xếp theo thứ tự, các luồng ở phía trước hàng đợi sẽ được ưu tiên nhận tài nguyên.

## Vấn đề về hiệu suất

Việc thực thi đồng thời có chắc chắn nhanh hơn việc thực thi tuần tự không? Số luồng càng nhiều thì thực thi càng nhanh?

Câu trả lời là: **Việc thực thi đồng thời không chắc chắn nhanh hơn thực thi tuần tự**. Bởi vì có chi phí tạo luồng và chi phí chuyển đổi ngữ cảnh giữa các luồng.

### Chuyển đổi ngữ cảnh (Context Switching)

#### Chuyển đổi ngữ cảnh là gì?

Khi CPU chuyển từ việc thực thi một luồng sang việc thực thi một luồng khác, CPU cần lưu trữ trạng thái dữ liệu cục bộ, con trỏ chương trình và các trạng thái khác của luồng hiện tại và tải dữ liệu cục bộ, con trỏ chương trình và các trạng thái khác của luồng tiếp theo cần thực thi. Quá trình này được gọi là "chuyển đổi ngữ cảnh".

#### Cách giảm thiểu chuyển đổi ngữ cảnh

- Lập trình không khóa - Khi nhiều luồng cạnh tranh với nhau để giành khóa, sẽ gây ra chuyển đổi ngữ cảnh. Vì vậy, khi xử lý dữ liệu đa luồng, có thể tránh sử dụng khóa bằng cách chia dữ liệu thành các phân đoạn theo thuật toán băm và xử lý các phân đoạn khác nhau trong các luồng khác nhau.
- Thuật toán CAS - Gói Atomic của Java sử dụng thuật toán CAS để cập nhật dữ liệu mà không cần khóa.
- Sử dụng ít luồng nhất có thể - Tránh tạo ra các luồng không cần thiết, ví dụ: nhiệm vụ ít nhưng tạo ra nhiều luồng để xử lý, điều này sẽ dẫn đến tình trạng nhiều luồng đang chờ đợi.
- Sử dụng Coroutines - Triển khai lập lịch nhiều nhiệm vụ trong một luồng duy nhất và chuyển đổi giữa các nhiệm vụ trong luồng duy nhất đó.

### Hạn chế tài nguyên

#### Hạn chế tài nguyên là gì

Hạn chế tài nguyên là khi tốc độ thực thi của chương trình bị hạn chế bởi tài nguyên phần cứng hoặc phần mềm của máy tính.

#### Vấn đề gây ra bởi hạn chế tài nguyên

Trong lập trình đồng thời, nguyên tắc để tăng tốc độ thực thi mã là chuyển đổi các phần mã tuần tự trong mã thành thực thi đồng thời, nhưng nếu một phần mã tuần tự được chuyển đổi thành thực thi đồng thời nhưng vẫn tuần tự do hạn chế tài nguyên, chương trình không chỉ không thể tăng tốc độ thực thi mà còn chậm hơn, vì đã tăng thêm thời gian chuyển đổi ngữ cảnh và lập lịch tài nguyên.

#### Cách giải quyết vấn đề hạn chế tài nguyên

Trong lập trình đồng thời trong trường hợp hạn chế tài nguyên, điều chỉnh mức độ đồng thời của chương trình dựa trên hạn chế tài nguyên cụ thể.

- Đối với hạn chế tài nguyên phần cứng, có thể xem xét sử dụng cụm để thực thi chương trình song song.
- Đối với hạn chế tài nguyên phần mềm, có thể xem xét sử dụng bể tài nguyên để tái sử dụng tài nguyên.

## Tóm tắt

Lập trình đồng thời có thể được tóm tắt thành ba vấn đề cốt lõi: phân công, đồng bộ hóa và khóa.

- **Phân công**: Đề cập đến cách hiệu quả để phân chia nhiệm vụ và giao cho các luồng.
- **Đồng bộ hóa (Synchronization)**: Đề cập đến cách các luồng làm việc cùng nhau.
- **Loại trừ lẫn nhau (Mutual exclusion)**: Đảm bảo chỉ cho phép một luồng truy cập vào tài nguyên chung trong một thời điểm.
