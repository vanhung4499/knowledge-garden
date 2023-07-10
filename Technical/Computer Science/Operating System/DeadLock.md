---
categories: [os, computer-science]
title: DeadLock
date created: 2023-05-31
date modified: 2023-07-10
tags: [os, computer-science]
---

Khóa (lock) là một công cụ (tool) để đảm bảo đồng bộ hóa.

Khi thực thi đồng bộ hóa bằng khóa, chắc chắn có thể xảy ra tác dụng phụ gọi là bế tắc (Deadlock).

Điều quan trọng là deadlock ngăn cản process hoặc thread tiếp tục chạy.

Ngoài ra, khái niệm deadlock xuất hiện khi sử dụng Pessimistic lock như **một giải pháp cho các sự cố đồng thời của máy chủ phân tán** trong DB.

> Pessimistic lock: Để ngăn chặn việc thực hiện đồng thời các hoạt động, một khóa được đặt để ngăn các hoạt động khác can thiệp. Nhược điểm bao gồm hiệu suất chậm hơn và deadlock có thể xảy ra.

## 🚗 Bế tắc (Deadlock)

>Trạng thái trong đó một loạt (hai hoặc nhiều) process/thread bị chặn (block) để chờ tài nguyên (resource) của nhau  

> Tài nguyên (resource): khái niệm bao gồm phần cứng, phần mềm, v.v. ex. I/O device, CPU cycle, memory space, semaphore, v.v.

![Pasted image 20230603171307](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230603171307.png)

Trong hình, số là tài nguyên và ô tô là tiến trình.

Mỗi ô tô cố gắng vượt qua bằng cách đảm bảo có cả hai tài nguyên.

Lúc này, tất cả đều thành công trong việc chiếm giữ một tài nguyên, nhưng sau đó, phương tiện này đã bị phương tiện khác chặn đường và rơi vào bế tắc không thể vượt qua.

Tình huống này khá tệ vì không có xe nào có thể tiếp tục chạy sau đó.

## ✔️ Point 1 : 4 điều kiện để xảy ra Deadlock

Deadlock xảy ra khi tất cả các điều kiện sau được đáp ứng:

### 1)  Mutual exclusion (Loại trừ lẫn nhau)

- Chỉ một tiến trình có thể sử dụng một tài nguyên tại bất kỳ thời điểm nào  
- Đó là, tài nguyên không thể được chia sẻ.

### 2) No preemption (Không có quyền ưu tiên)

- Các tiến trình tự từ bỏ tài nguyên, không bắt buộc.  
- Nghĩa là, chỉ tiến trình đã lấy được tài nguyên mới có thể giải phóng tài nguyên.

### 3) Hold and wait (Giữ và chờ)

- Khi một tiến trình đang giữ một tài nguyên chờ một tài nguyên khác, nó sẽ không giải phóng tài nguyên đang giữ và tiếp tục giữ nó.  
- Nghĩa là, trong khi một tiến trình đã nhận được một hoặc nhiều tài nguyên (hold), nó sẽ chờ thêm các tài nguyên đang được sử dụng bởi các tiến trình khác (wait).

### 4) Circular wait (Chờ vòng tròn)  

- Các chu kỳ phải hình thành giữa các tiến trình đang chờ tài nguyên  
- Nghĩa là các tiến trình chờ tài nguyên của nhau theo kiểu vòng tròn.

## ✔️ Point 2 : Cách OS xử lý Deadlock

Phương pháp đầu tiên được giới thiệu là một phương pháp xử lý mạnh đối với deadlock.

### 1) Deadlock Prevention

- Để đảm bảo rằng không có điều kiện nào trong bốn điều kiện cần thiết của Deadlock được thỏa mãn khi cấp phát tài nguyên.  
- Cách loại bỏ một điều kiện bế tắc thông qua thiết kế ở cấp hệ thống  

**Mutual exclusion**

- Phải đúng đối với các tài nguyên không được chia sẻ  

**No preemption**

- Nếu một tiến trình cần chờ một tài nguyên, thì tài nguyên mà nó đã có sẽ được ưu tiên (làm cho các tiến trình khác có thể được ưu tiên).  
- Tiến trình được khởi động lại khi có sẵn tất cả các tài nguyên cần thiết.  
- Chủ yếu được sử dụng để có thể dễ dàng lưu (save) và khôi phục (restore) trạng thái (state) (CPU, memory)  

**Hold and wait**

- Khi một tiến trình yêu cầu một tài nguyên, nó không được có bất kỳ tài nguyên nào khác
- `Cách 1` | Cách đảm bảo rằng tất cả các tài nguyên cần thiết được cấp phát khi bắt đầu tiến trình (giữ mọi thứ và bắt đầu)
	- <Bất lợi> Các tài nguyên cần thiết sẽ khác nhau cho mỗi bước. Nếu bạn giữ các tài nguyên mà bạn sẽ không sử dụng ngay bây giờ, hiệu quả sử dụng tài nguyên sẽ giảm và nếu tất cả các tài nguyên không được bảo đảm, bạn có thể phải chờ chờ.  
- `Cách 2` | Nếu bạn cần tài nguyên, hãy đặt tất cả tài nguyên của bạn và yêu cầu lại  
	- Nói cách khác, các ràng buộc được đưa ra để tài nguyên chỉ có thể được yêu cầu khi tài nguyên đó hoàn toàn không được sở hữu.  

**Circular wait** : Được sử dụng nhiều nhất

- Tất cả các loại tài nguyên được cấp phát theo thứ tự chúng được chỉ định và tài nguyên chỉ được cấp phát theo thứ tự đã chỉ định (thứ tự tăng dần).  
- Ví dụ, để một tiến trình đang giữ tài nguyên Ri bậc 3 được cấp phát tài nguyên Rj bậc 1, trước tiên nó phải giải phóng Ri. (Không có nguy cơ xảy ra chu kỳ)  

**👉 Giảm Utilization, giảm throughput, vấn đề starvation **

### 2) Deadlock Avoidance

- Tài nguyên được cấp phát chỉ khi không có khả năng deadlock bằng cách sử dụng **thông tin bổ sung** về các yêu cầu tài nguyên trong môi trường thực thi.  
	- **Thông tin bổ sung**: tài nguyên hiện có, tài nguyên đã được phân bổ, yêu cầu hoặc trả lại tài nguyên trong tương lai, v.v.  
- Chỉ cấp phát tài nguyên khi trạng thái hệ thống có thể trở lại trạng thái ban đầu  

**Banker algorithm**

- Nó bắt nguồn từ việc các ngân hàng phân bổ tiền mặt để đảm bảo đáp ứng mọi nhu cầu của khách hàng.  
- Nếu có khả năng bế tắc khi yêu cầu tài nguyên được cấp, thuật toán sẽ tiếp tục từ chối yêu cầu cho đến khi cấp phát tài nguyên an toàn.

### 3) Deadlock Detection and recovery

- Cho phép bế tắc xảy ra, nhưng đặt quy trình phát hiện (detection) để nó phục hồi (recover) khi phát hiện bế tắc (Deadlock)

**Chiến lược phục hồi**

- Chấm dứt tiến trình (Buộc chấm dứt tất cả các tiến trình bế tắc) (Nguy cơ mất dữ liệu đang hoạt động cao)  
- Cho phép tạm thời chiếm đoạt tài nguyên.

### 4) Deadlock Ignorance

- DeadLock không phải là trách nhiệm của hệ thống  
- Được chấp nhận bởi hầu hết các OS bao gồm cả UNIX

## ✔️ Bỏ đói (Starvation)

> Đây là trạng thái trong đó tài nguyên mong muốn không được phân bổ liên tục vì mức độ ưu tiên thấp hơn mức ưu tiên của một tiến trình cụ thể. Nó chủ yếu xảy ra trong lập lịch ưu tiên (priority scheduling).

## ✔️ Deadlock ở cấp độ lập trình (với Java)

**🤷‍♀️ Ví dụ về bế tắc trong Java**

```java
public class Main {
    public static void main(String[] args) {
        Object lock1 = new Object();
        Object lock2 = new Object();
 
        // lock1 ưu tiên
        Thread t1 = new Thread(() -> {
            synchronized (lock1) {
                System.out.println("[t1] get lock1");
                synchronized (lock2) {
                    System.out.println("[t1] get lock2");
                }
            }
        });
 
        /*
          lock2 chờ chờ
          Case 1: Thay đổi thứ tự ưu tiên lock2 sau lock1 -> Deadlock do không có chu kỳ X
          Case 2: Trạng thái hold and wait do các nỗ lực chồng chéo để có được khóa | Cô lập mã của bạn để không bị hold and wait
         */
        Thread t2 = new Thread(() -> {
            synchronized (lock2) {
                System.out.println("[t2] get lock2");
                synchronized (lock1) {
                    System.out.println("[t2] get lock1");
                }
            }
        });
 
        t1.start();
        t2.start();
    }
}
```

### 💁‍♀️💡 `Case 1` : Circular wait

> Tất cả các loại tài nguyên được phân bổ theo thứ tự chúng được chỉ định và tài nguyên chỉ được phân bổ theo thứ tự đã chỉ định (thứ tự tăng dần).

Thread t2, giống như t1, ưu tiên lock1 và sau đó thay đổi thứ tự thành ưu tiên lock2.

Điều này ngăn chặn các chu kỳ xảy ra và ngăn chặn các bế tắc.

### 💁‍♀️💡 `Case 2` : Hold and wait

> Nếu bạn cần tài nguyên, hãy đặt tất cả tài nguyên của bạn và yêu cầu lại

Nhìn vào tình huống vấn đề, trong trường hợp của Thread 1, sau khi lấy được lock1, nó sẽ cố gắng chiếm trước lock2.

Nói cách khác, nó ở trạng thái `hold and wait` vì nó cố gắng chiếm trước khóa bằng cách chồng lên nhau.

Vì vậy, bạn có thể triển khai mã để mã có thể được sử dụng riêng mà không cần lồng vào nhau.

## 🔅 Kết luận 🔅

👱‍♂️ Anh: Anh sẽ cho em một quả bóng rổ chứ 🏀?  
👦 Em: Đưa anh quả bóng ⚽️ Anh đưa cho em
