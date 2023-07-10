---
categories: [os, computer-science]
title: Process Synchronization
date created: 2023-05-31
date modified: 2023-07-10
tags: [os, computer-science]
---

## Vấn đề

Sau khi đọc dữ liệu từ vị trí lưu trữ dữ liệu, thực hiện thao tác, kết quả của thao tác được lưu trữ lại ở vị trí đã lưu trữ trước đó.

Nếu bạn chỉ đọc dữ liệu thì không có vấn đề gì, nhưng nếu bạn tính toán và sửa đổi dữ liệu, kết quả có thể khác tùy thuộc vào người đọc nó trước.

Đây có thể là sự cố đồng bộ hoá **Synchronization**.

```
load X, reg1
inc   reg1
store X, reg1
```

## 🤼‍♂️ Process Synchronization

> Truy cập đồng thời (concurrent access) dữ liệu được chia sẻ (shared data) có thể gây ra sự không nhất quán (inconsistency) của dữ liệu.

> Do đó, để duy trì tính nhất quán (consistency), cần có một cơ chế xác định việc thực thi có trật tự (orderly execution) giữa các tiến trình hợp tác (cooperating process).

### ✔️ race condition

> Tình huống trong đó nhiều process/thread thao tác cùng lúc với cùng một dữ liệu và kết quả có thể khác nhau tùy thuộc vào thời gian hoặc thứ tự truy cập.

> Để ngăn chặn điều này, các concurrent process phải được đồng bộ hóa (synchronize).

- Có khả năng xảy ra **race condition** giữa Storage-Box và Execution-Box.
	- Trong khi Count++ đang được thực thi, nếu Count-- đọc dữ liệu trước thao tác, thì sau khi các thao tác hoàn thành, chỉ thao tác Count-- được áp dụng. (tức là count bị giảm)

![Pasted image 20230603024637](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230603024637.png)

### Khi nào xảy ra race condition trong OS

#### 1. Interrupt xảy ra trong quá trình thực thi kernel

> ex Initial Counter = 10

Thực thi Count++ trong khi chạy ở kernel mode.

Trong ví dụ đã nêu trên, Count-- Excution Box sẽ chạy khi interrupt xảy ra.  
Khi (No. 2) xảy ra ngắt trong trường hợp dữ liệu được đọc vào CPU Register ở (No. 1), interrupt processing routine được thực thi, Count-- được thực thi và được phản hồi.

Sau đó (No. 3) được thực thi lại, nhưng vì việc đọc từ bước 1 đã kết thúc, Count++ và lưu lại.

![Pasted image 20230603031220](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230603031220.png)

🙋‍♀️ **Expected** : Counter = 10  
💁‍♀️ **Unexpected** : Counter = 11

-> Vì vậy, trong khi tác vụ đang chạy (running), hãy disable interrupt cho đến khi tác vụ kết thúc.

#### 2. Khi xảy ra Context Switch trong khi Process đang chạy ở kernel mode bằng cách thực thi system call

U là user mode, K là kernel mode

![os_synchronization_race_condition2](https://raw.githubusercontent.com/vanhung4499/images/master/snap/os_synchronization_race_condition2.png)

-> Không chiếm CPU khi chạy ở kernel mode. Ưu tiên khi từ kernel mode sang user mode.

(Có thể có sai lệch về thời gian cấp phát CPU)

#### 3. Multiprocessor cùng truy cập kernel data trong shared memory

![Pasted image 20230603122809](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230603122809.png)

**(Cách 1)**  
Mỗi lần chỉ cho phép một CPU vào kernel, lock kernel và unlock khi thoát kernel. (Không hiệu quả vì nó lock toàn bộ kernel)

**(Cách 2)**  
Bất cứ khi nào dữ liệu được chia sẻ bên trong kernel được truy cập, hãy lock/unlock dữ liệu đó.

### ✔️ synchronization

Duy trì tính nhất quán (consistency) của shared data ngay cả khi nhiều process/thread đồng thời (concurrency)

### ✔️ critical section

Khu vực chỉ có duy nhất một process/thread có thể vào và thực thi (mutual exclusion) để đảm bảo tính nhất quán của dữ liệu được chia sẻ

- `Problem`: Khi một process nằm trong critical section, tất cả các process khác sẽ không thể vào critical section.

![Pasted image 20230603123515](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230603123515.png)

### Giải quyết critical section problem

Bộ khung cơ bản để giải quyết **critical section problem**

```
do {
    entry section       // lock before accesss shared data - acquire lock
    	critical section 
    exit section        // unlock (allow other process to enter critical-section) - release lock
    	remainder section
} while (1);
```

### Điều kiện để giải quyết critical section problem

Tất cả các điều kiện dưới đây phải được đáp ứng.

- **mutual exclusion** (loại trừ lẫn nhau)  
	- Tại một thời điểm, chỉ có một process/thread có thể chạy trong critical section.  
- **progress** (tiến triển)  
	- Nếu không có gì trong critical section, process muốn vào phải được phép vào critical section.  
- **bounded waiting** (chờ đợi có giới hạn )  
	- Một process/thread không nên đợi vô thời hạn để vào critical section.  
	- Để ngăn chặn tình trạng chết đói (Starvation) của các tiến trình khác

## 💡 Solution

> Đảm bảo mutual exclusion -> sử dụng lock  
> Cạnh tranh để có được một khóa

```
do {
    acquire lock
    	critical section   
    release lock
    	remainder section
} while (1);
```

### 1. spinlock

> Hãy thử nhiều lần cho đến khi bạn có thể khóa

> Khi critical section bị lock và không thể vào được,  
> Trạng thái trong đó thread chiếm CPU bằng cách lặp lại và thử lại cho đến khi critical section được unlock và có thể vào được

#### **Nhược điểm**

- Lãng phí CPU trong khi chờ đợi
- Tình trạng **`Busy-Waiting`**

Giải thích bằng ví dụ sau:

- Ngăn T1 và T2 thực thi cùng lúc thông qua `TestAndSet`

```c++
volatile int lock = 0; // global

void critical() {
    while (test_and_set(&lock) == 1);
    ...critical section
    lock = 0;
 }
```

```
- T1 start) while loop conditional statement, internally lock is changed to 1 and the existing lock is returned 0
- Break out of the loop because the conditional statement is not satisfied
- critical section execution
- Start of T2) while loop conditional statement, internally replace with lock1 and return the original lock 1
- Repeat the loop by satisfying the conditional statement
- T1 returns lock=0 and exits
- Break out of T2 while loop
- critical section execution
- T2 returns lock=0 and exits
```

#### TestAndSet

Một hàm trả về lock hiện tại. Thay đổi lock thành 1 trước khi trả về.

Phần triển khai thực tế không bao gồm code tương ứng.

- Code minh hoạ

```c++
int TestAndSet(int* lockPtr) {
    int oldLock = *lockPtr;
    *lockPtr = 1;
    return oldLock;
}
```

🤔 Nếu 2 thread chạy cùng lúc thì sao??

🙋‍♀️💡 Trợ giúp CPU (Trợ giúp phần cứng)

#### TestAndSet use CPU Narutoic instruction

- Không bị ngắt, gián đoạn giữa chừng khi thực hiện.  
- Chúng không được thực thi đồng thời cho cùng một vùng nhớ.  
	- Ngay cả khi hai hoặc nhiều process/thread gọi cùng một lúc, thì một process/thread sẽ được thực thi trước ở cấp độ CPU, tiếp theo là tiến trình kia.

### 2. Mutex

> Cơ chế đồng bộ hóa để thực thi các hạn chế đối với quyền truy cập vào tài nguyên trong môi trường chạy đa luồng.

> Nghỉ cho đến khi bạn có thể có được lock

> Viết tắt của Mutual Exclusion

#### Sự khác biệt với spinlock

- Nếu spinlock duy trì trạng thái **Busy-Waiting** cho đến khi critical section được unlock và được phép, thì mutex sẽ chuyển sang trạng thái **Block(Sleep)** và cố gắng xin lại quyền khi **Wakeup**.  
- **`Block-Wakeup State`**  
- Mutex Lock bị kiểm soát bên trong theo value và khi không thể lấy được value, nó sẽ đợi trong khi chặn trong hàng đợi. Điều này giảm thiểu sự lãng phí chu kỳ CPU không cần thiết.  

Ngay cả tại thời điểm này, các process/thread vẫn tranh giành khóa mutex.

```
mutex -> lock();
...critical section
mutex -> unlock();
```

**`value`**

- value = 1 phải được tranh giành để hoạt động trong critical section.  
- Tại thời điểm này, value cũng là dữ liệu được chia sẻ mà nhau cố gắng có được.  
- mutex có trạng thái 0 hoặc 1

**`guard`**

- Nó là một thiết bị bảo vệ để ngăn chặn tình trạng **race condition**.  
- Nhìn vào lock và unlock bên dưới, guard được sử dụng để bảo vệ logic thay đổi value.  
- Ngay cả tại thời điểm này, TestAndSet use CPU aNarutoic instruction.

```c++
class Mutex {
    int value = 1;
    int guard = 0;
}
```

Vì vậy, nếu value được giữ bởi ai đó, nó sẽ được đưa vào hàng đợi và nếu có thể lấy được, value được đặt thành 0 để không process nào khác có thể có value đó.

```c++
Mutex::lock() {
    while (test_and_set(&guard));
    if (value == 0) {
    	...enqueue the current thread;
        guard = 0; & go to sleep
    } else {
    	value = 0;
        guard = 0;
    }
}
```

Khi unlock, nếu có hàng đợi, hãy đánh thức một trong số chúng và đặt giá trị thành 1 để có thể lấy lại nếu không có.

```c++
Mutex::unlock() {
    while (test_and_set(&guard));
    if (at least one thread is waiting in the queue) {
    	wake one of them up;
    } else {
    	value = 1;
    }
    guard = 0;
}
```

🤔 Có phải mutex luôn tốt hơn spinlock không?  

🙋‍♀️💡 Trong môi trường đa nhân, spinlock có lợi thế hơn so với mutex nếu các thao tác trong các critical section được hoàn thành nhanh hơn context switch.

### 3. semaphore

> Nó được sử dụng như một phương pháp hạn chế quyền truy cập vào shared resource của nhiều process/thread trong môi trường đa chương trình.

> Một thiết bị cho phép một hoặc nhiều process/thread truy cập vào critical section bằng cơ chế tín hiệu (**signal mechanism**).  
🚩 Mục đích: Quản lý tài nguyên dùng chung, không loại trừ lẫn nhau (Mutual Exclusion)

> Không giống như spinlock và mutex, value là số nguyên (0,1,2,….).  
> Lợi dụng điều này, một hoặc nhiều thread có thể được phép truy cập vào các shared resource.

Khi một thread truy cập vào một resource cụ thể, hàm wait được gọi đầu tiên để kiểm tra xem nó có thể vào critical section hay không.

Nếu critical section có thể truy cập được, process sẽ thoát khỏi trạng thái waiting và đi vào critical section, sau đó signal được gọi để thoát khỏi critical section.

#### Vận hành Semaphore P, V

```
semaphore -> wait();  // P : phát tín hiệu khi vào critical section.
...critical section
semaphore -> signal();  // V : phát tín hiệu khi thoát critical section.
```

#### Phân loại semaphore

- **`Binary Semaphore`**: Semaphore có value 0/1, giống như mutex
- **`Counting Semaphore`**: Semaphore có value có thể lớn hơn 1

```c++
class Semaphore {
    int value = 1;
    int guard = 0;
}
```

**Thao tác `wait`**

Giảm value của semaphore. Nếu value âm, luồng được gọi là block wait (tức là chặn luôn việc chờ), nhưng nếu nó không âm, thì nó sẽ hoạt động.

```c++
Semaphore::wait() {
    while (test_and_set(&guard));
    if (value == 0) {
    	...enqueue the current thread;
        guard = 0; & go to sleep
    } else {
    	value -= 1;
        guard = 0;
    }
}
```

**`Thao tác signal`**

Tăng value của semaphore. Nếu value không dương, luồng bị chặn bởi thao tác wait sẽ được wake.

```c++
Semaphore::signal() {
    while (test_and_set(&guard));
    if (at least one thread is waiting in the queue) {
    	wake one of them up;
    } else {
    	value += 1;
    }
    guard = 0;
}
```

#### Cơ chế Signaling

Semaphores được sử dụng để xác định thứ tự.

Semaphore là một cơ chế báo hiệu (signaling) và ngay cả một luồng chưa có khóa cũng có thể giải phóng khóa thông qua tín hiệu.

**Ví dụ: môi trường đa nhân cpu**

- Tình huống

```c++
class Semaphore {
    int value = 0;
    int guard = 0;
}
```

```
< P1 >
task1
semaphore -> signal()
< P2 >
task2
semaphore -> wait()
task3
```

**Trường hợp 1**

- Chạy task1 và task2  
- task1 kết thúc thực thi trước và gọi signal() -> value = 1  
- Sau đó task2 kết thúc và gọi wait() -> value = 0  
- Chạy task3

**Trường hợp 2**

- Chạy task1 và task2  
- Đầu tiên task2 xong, value = 0 nên không vào được đợi, cho vào queue, block  
- Sau đó, task1 kết thúc thực thi và gọi signal() -> đánh thức P2 đang sleep.  
- Chạy task3

-> There is an order.

-> P2 đợi và P1 gửi tín hiệu.

## ✔️ Ví dụ thực tế

Lấy một nhà hàng làm ví dụ.

```
🍽️ Nhà hàng: Critical Section 
🧍‍♀️ Khách: Process/Thread  
🔒 Khóa cửa nhà hàng: Lock  
💤 Phòng chờ: Queue  
👩‍🍳 Nhân viên: CPU Core
```

### Tình huống 1 - Mutex

Quán ramen nhỏ nên chỉ có một chỗ ngồi. Vì vậy, chỉ một người có thể vào và ăn.

Lúc này, khách hàng 1 Naruto bước vào cửa hàng.  
🙋‍♂️🙆‍♂️ Khách hàng 1 (Naruto): Một Ramen full topping  
Vì đã hết chỗ nên nhân viên phục vụ khóa cửa cửa hàng.  
Sau đó, khách hàng 2 Sasuke đến cửa hàng  
🙋‍♀️🙅‍♀️ Khách hàng 2 (Sasuke): Ohh ㅠㅠ hết chỗ chưa?

Có hai cách Sasuke có thể đợi vào lúc này.

**🌀 1) Tiếp tục gõ cửa cho đến khi có chỗ ngồi. -> spinlock (Đói)**  
Sasuke.. tiếp tục gõ cửa..!! Không có chỗ ngồi ??? Không có chỗ ngồi ???  
**💡 Tình trạng Busy-Waiting**

Sasuke tiếp tục gõ cửa.. Nhân viên phải liên tục trả lời, vì vậy cô ấy không thể làm những công việc khác như rửa bát đĩa. Nó không hiệu quả.  

Tuy nhiên, có những lúc phương pháp này nhanh hơn:

- Nếu khách ăn nhanh hơn thời gian đến phòng chờ (= Context Switch)
- Nếu nhà hàng có nhiều nhân viên (= đa nhân cpu)

**💤 2) Chờ trong phòng chờ và vào khi được gọi. -> Block-Wakeup**

Đợi cho đến khi những vị khách đầu tiên bước vào trước.

**💡 Mutex, Block-Wakeup, Blocking-lock**

Naruto ăn xong Pizza.  
🙋‍♂️ Khách hàng 1 (Naruto): Tôi ăn ngon lắm~  
Mở cửa vì khách đang rời đi. **unlock**  

🙋‍♀️ Khách hàng 2 (Sasuke): Này ~~ Còn một chỗ ngồi. Đi vào nào!  
Cuối cùng Sasuke bước vào.

### Tình huống 2 - Semaphore

Nhà hàng được tu sửa, tăng lên 3 chỗ ngồi .  
Nhà hàng treo biển còn 3 ghế trước cửa.  
3 vị khách bước vào.  
Lúc này, một quy tắc được tạo ra trong nhà hàng để chỉ ra chính xác số ghế còn lại. **AKA Quy tắc PV (wait, signal)!**

Khách vừa bước vào vừa la gọi **P**.  
🙋‍♂️ Khách hàng 1 (Naruto), 🙋‍♀️ Khách hàng 2 (Sasuke), 🙋 Khách hàng 3 (Sakura): **PPP**~  
Số ghế còn lại là 0.

Lúc này khách hàng 4 tới muộn Hinata.  
🤦 Khách hàng 4 Hinata: Ah~~ Tiếc quá. Hinata cũng có thể tiếp tục gõ cửa hoặc đợi trong phòng chờ.  
Thời điểm Hinata đi vào phòng chờ, số ghế còn lại trở thành -1.

Sakura ăn nhanh nhanh! Naruto, người đến đầu, ăn xong trước Sasuke và rời nhà hàng.  
🙋 Khách hàng 3 (Sakura): **V**~~  
Khi Sakura rời đi vào lúc này, thấy Hinata đang ở trong phòng chờ. wake up Hinata.

## ✔️ Mutex vs (binary) semaphore

- `mutex`
	- Chỉ người giữ khóa (lock) mới có thể mở khóa.  
	- **priority inheritance**.  
- `semaphore`
	- Một luồng không nhận được khóa thông qua cơ chế signal cũng có thể giải phóng khóa thông qua **Signaling**.  
- Triển khai
	- Mutex được khuyến nghị nếu chỉ cần loại trừ lẫn nhau (mutual exclusion)  
	- Semaphores được khuyến nghị nếu cần đồng bộ hóa thứ tự thực hiện giữa các thread.
