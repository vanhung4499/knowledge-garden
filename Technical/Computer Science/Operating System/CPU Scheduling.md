---
categories: [os, computer-science]
title: CPU Scheduling
date created: 2023-05-31
date modified: 2023-07-10
tags: [os, computer-science]
---

## CPU Scheduling

Đa tiến trình là cần thiết để tối đa hóa việc sử dụng CPU. Tuy nhiên, nếu chỉ có một lõi CPU, tại một thời điểm chỉ có thể chạy một tiến trình. Trong trường hợp này, lập lịch CPU (CPU Scheduling) là bắt buộc.

✔ Nói cách khác, lập lịch CPU là nhiệm vụ xác định thời điểm cấp phát CPU cho tiến trình nào.

### 1. CPU - I/O Burst Cycle

Quá trình thực hiện bao gồm các chu kỳ **CPU Excution** và **I/O Wait**.

![Pasted image 20230531181432](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230531181432.png)

- **CPU burst** : Tình huống trong đó các hoạt động của CPU được thực hiện liên tục trong quá trình thực hiện chương trình
- **I/O Burst** : Tình huống trong đó input/output của I/O Device xảy ra trong khi thực hiện chương trình.
- Tất cả các chương trình là một loạt các CPU và I/O Burst, nhưng tần suất và độ dài của mỗi burst khác nhau tùy thuộc vào loại chương trình.

### CPU Burst Chart

![Pasted image 20230531181818](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230531181818.png)

- **I/O bound job** : Công việc sử dụng CPU ngắn và can thiệp vào I/O ở giữa
    - CPU burst ngắn và nhiều lần (many short CPU bursts)
    - Interactive
    - Thường xuyên
- **CPU bound job** : công việc chỉ sử dụng CPU trong một thời gian dài
    - CPU burst dài và ít lần (few very long CPU bursts)
    - Tần số thấp (thời gian dài)
- CPU bound job sử dụng CPU nhiều, I/O bound job sử dụng CPU ngắn
- ✅ Cần có lịch trình CPU phù hợp (**CPU scheduling**) để xử lý các I/O bound job, CPU bound job trộn lẫn với nhau 
    - CPU bound job dùng CPU và không giải phóng nó, I/O bound job sẽ đợi rất lâu -> Người dùng sẽ phải đợi
    - Nếu có thể, nên ưu tiên các I/O bound job mà tương tác (interactive) với người dùng

### 2. CPU Scheduler

Bất cứ khi nào CPU trở nên nhàn rỗi, OS phải quyết định tiến trình nào trong **Ready Queue** cung cấp cho CPU và chi tiêu bao nhiêu, **kernel code** thực hiện điều này.

Theo thuật toán lập lịch CPU, công việc được thực hiện bởi tiến trình được phân bổ cho CPU theo đơn vị luồng.

Ready Queue không nhất thiết phải là hàng đợi kiểu FIFO và có thể được triển khai dưới dạng cây (tree) hoặc hàng đợi ưu tiên (priority queue). Nói chung, các item trong queue là các Process Controll Block (PCB) của tiến trình.

#### CPU Scheduler cần thiết cho

Sự chuyển trạng thái của tiến trình được mô tả qua hình dưới.

![Pasted image 20230531204627](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230531204627.png)

- Lập lịch ưu tiên: `Interrupt`, `I/O or Event Completion`, `I/O or Event Wait`, `Exit`
- Lập lịch không ưu tiên: `I/O or Event Wait`, `Exit`

Lập lịch CPU có thể xảy ra khi một tiến trình ở trong các tình huống sau:

1. Khi chuyển từ trạng thái chạy (running) sang trạng thái chờ (wating) (ví dụ: I/O)
2. Khi chuyển từ trạng thái chạy (running) sang trạng thái sẵn sàng (ready) (ví dụ: xảy ra interrupt)
3. Khi chuyển từ trạng thái chờ (waiting) sang trạng thái sẵn sàng (ví dụ: I/O complete)
4. Khi chấm dứt (terminated)

#### Lập lịch không ưu tiên (nonpreemptive)

- Trường hợp 1 và 4  
- Khi một CPU được cấp cho một tiến trình, nó được đảm bảo chạy (không thể bị lấy đi) cho đến khi tiến trình kết thúc hoặc một sự kiện như I/O xảy ra.  
- Vì chỉ xảy ra các trao đổi ngữ cảnh cần thiết nên chi phí hoạt động tương đối nhỏ.  
- Hiệu quả thay đổi rất nhiều tùy thuộc vào sự sắp xếp của tiến trình  
- Thời gian đáp ứng có thể dự đoán được  
- Ngay cả các tiến trình thực hiện các tác vụ ngắn cũng phải đợi các tác vụ dài hoàn thành.

#### Lập lịch ưu tiên (preemptive)

- Trong mọi trường hợp trừ trường hợp không được ưu tiên
- Trong một hệ thống chia sẻ thời gian, cưỡng chế thu hồi CPU từ tiến trình hiện đang chạy khi nó biết rằng lát cắt thời gian của nó đã hết hoặc tiến trình có mức độ ưu tiên cao hơn đã được tạo ra khi kết thúc một [[System Call]] hoặc [[Interrupt]].  
- Hữu ích cho các hệ thống muốn các tiến trình có mức độ ưu tiên cao được xử lý nhanh chóng  
- Hữu ích cho các hệ thống chia sẻ thời gian yêu cầu phản hồi nhanh  
- Hiệu quả vì nó có thể ngăn chặn việc độc quyền sử dụng các tiến trình mất nhiều thời gian xử lý CPU  
- [[Overhead]] xảy ra khi chỉ các tiến trình có mức độ ưu tiên cao tham gia

#### Điều phối (Dispatcher)

**Là module cung cấp quyền kiểm soát nhân CPU cho một tiến trình được chọn bởi bộ lập lịch CPU.**

**Dispatcher làm việc gì?**

- [[Context Switching]] từ tiến trình này sang tiến trình khác  
- Chuyển sang chế độ người dùng (user mode)  
- Nhảy (jump) đến vị trí thích hợp trong chương trình người dùng để khởi động lại chương trình  

**Gửi trễ (dispatch latency)**  

Thời gian cần thiết để dispatcher dừng một tiến trình và bắt đầu một quá trình khác.

![Pasted image 20230601130528](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601130528.png)

**Chuyển ngữ cảnh (Context Switching)**

- Chuyển ngữ cảnh tự nguyện  
	- Xảy ra khi một tiến trình từ bỏ quyền kiểm soát CPU khi yêu cầu một tài nguyên hiện không khả dụng.  
- Chuyển ngữ cảnh ép buộc  
	- Xảy ra khi CPU bị chiếm quyền, chẳng hạn như khi một lát cắt thời gian đã hết hạn hoặc bị ưu tiên cho tiến trình ưu tiên cao hơn.

### 3. Tiêu chí thực hiện lập lịch ( Scheduling Criteria )

Nếu lập lịch là thiết lập một chính sách để sắp xếp nhiều tiến trình theo thứ tự nào đó, thì sẽ có phương pháp sắp xếp tốt và phương pháp sắp xếp xấu. Các tiêu chí theo đó các thuật toán lập lịch có thể được đánh giá được gọi là tiêu chí lập lịch.

Vì nó được tính trên quan điểm CPU nên hiểu rằng nó chỉ được tính cho từng **CPU burst** chứ không tính **từ khi bắt đầu đến khi kết thúc của một process**.

1. Đo hiệu suất từ ​​quan điểm của hệ thống
	1. **Sử dụng CPU (Utilization)**:  
		- Phần trăm thời gian sử dụng CPU mỗi giờ  
		- Bạn nên cố gắng giữ cho CPU luôn chạy.  
	2. **Thông lượng (Throughput)**:  
		- Số tiến trình hoàn thành trong một đơn vị thời gian
2. Đo hiệu năng từ quan điểm của chương trình
	1. **Tổng thời gian xử lý, thời gian quay vòng (Turnaround Time)**:  
		- Lượng thời gian cần thiết để một tiến trình kết thúc sau khi nó được tạo và giải phóng tất cả các tài nguyên mà nó đang sử dụng.  
		- Tổng thời gian tiến trình đợi trong Ready Queue, thời gian tiến trình đang thực thi trên CPU và thời gian thao tác I/O.  
	2. **Thời gian chờ (Waiting Time)**:
		- Lượng thời gian chờ đợi trước khi vào hàng đợi và nhận phân bổ CPU.  
		- Tổng thời gian các tiến trình dành để đợi trong Ready Queue  
	3. **Thời gian đáp ứng (Response Time)**:  
		- Thời gian để được cấp phát CPU lần đầu  
		- Tương tự nhưng khác với thời gian chờ, thời gian chờ là tổng của tất cả thời gian chờ trong Ready Queue, trong khi thời gian đáp ứng chỉ đo một lần chờ cho đến khi CPU được cấp phát lần đầu tiên

✔ Bạn nên chọn một thuật toán tối đa hóa việc sử dụng `CPU Utilization`, `Throughput`, cũng như giảm thiểu  `Turaround Time`, `Waiting Time`, `Response Time`

Tuy nhiên, vì hầu hết các thuật toán lập lịch đều có tính chất đánh đổi (Trade-Off) nên cách tốt nhất là chọn chúng theo ngữ cảnh (context) của bạn.

### 4. Mục tiêu hệ thống

Các mục tiêu chi tiết của lập lịch CPU khác nhau tùy theo hệ thống.  

1. **Batch System**:  
	- Chỉ chạy một tiến trình tại một thời điểm  
	- Xuyên suốt và sử dụng CPU là rất quan trọng để hoàn thành nhiều công việc nhất có thể.  
2. **Interactive System**:  
	- Một hệ thống trong đó người dùng tương tác trước máy tính  
	- Time Sharing phải được sử dụng  
	- Response Time → Giảm thiểu thời gian tiến trình chờ đợi trong Ready Queue.  
	- Waiting Time → Giảm thiểu thời gian tiến trình chờ đợi trong Wait Queue.  
	- Proportionality → Nó phải đáp ứng những gì người dùng yêu cầu.  
3. **Real-Time System**:  
	- Hệ thống chịu ràng buộc về thời gian  
	- Meeting Deadlines
	- Predictability

## CPU Scheduling Algorithm

### 1. First Come First Served (FCFS)

Tiến trình yêu cầu CPU trước sẽ nhận được CPU trước.

![Pasted image 20230601140534](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601140534.png)

- **Non-Preemptive**  
- Rất đơn giản để viết và dễ hiểu.  
- Thời gian chờ trung bình (Average Waiting Time) có thể dài.  
- Thời gian đáp ứng (Response Time) có thể lâu.  
- Điều này có thể tốt về mặt thời gian xoay vòng (Turnaround Time).  
- Convoy Effect có thể xảy ra.

> Convoy Effect:  
> Hiện tượng trong đó các tiến trình ngắn sẽ chờ lâu do một tiến trình dài.  
> Khi hiệu ứng xảy ra, tốc độ sử dụng CPU và thiết bị giảm.

### 2. Shortest Job First (SJF)

**Phương pháp phân bổ các lõi CPU theo trình tự từ tiến trình với độ dài chu kỳ CPU nhỏ nhất**. Hiểu đơn giản là tiến trình nào ngắn nhất thì chạy trước!

- **Non-Preemptive**
- Thuật toán xác định lập lịch xem xét độ dài của CPU Burst Time  
- Thời gian chờ trung bình có thể giảm.
- Có một vấn đề là khó dự đoán CPU Burst Time của tiến trình tiếp theo.
- Có thể triển khai theo cả 2 kiểu preemptive và non-preemptive

![Pasted image 20230601141244](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601141244.png)

- Non-preemptive: Tiến trình đang chạy chạy đến lúc kết thúc.

![Pasted image 20230601141423](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601141423.png)

- Preemptive: Nếu tiến trình tiếp theo có độ dài ngắn hơn thời gian còn lại của tiến trình hiện đang chạy, thì tiến trình tiếp theo sẽ được thực thi.  
	- Còn được gọi là **SRTF, SRF(Shortest Remaining Time First)**.

### 3. Round Robin Scheduling (RR)

**Thời gian mỗi tiến trình có thể sử dụng CPU liên tục được giới hạn trong một thời gian cụ thể, sau đó CPU được lấy lại từ tiến trình và được phân bổ cho một tiến trình khác trong Ready Queue.**

![Pasted image 20230601141755](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601141755.png)

- **Preemptive**  
	- Nếu quá trình xử lý không được hoàn thành trong thời gian quy định, nó sẽ chuyển sang tiến trình tiếp theo, vì vậy đây là phương pháp ưu tiên.  
- Mỗi tiến trình được phân bổ thời gian CPU bằng nhau để nó chỉ sử dụng CPU trong thời gian đó.  
	- Thời gian phân bổ (time quantum), lát cắt thời gian (time slice): Đơn vị thời gian thực hiện tối thiểu  
- Hiệu quả trong môi trường có nhiều loại tiến trình không đồng nhất chạy cùng nhau  
	- Nếu có n tiến trình và thời gian phân bổ được đặt thành q, thì không có tiến trình nào phải đợi quá `(n-1)*q` lần.  
- **Ngắt hẹn giờ**: Cách lấy lại CPU khi hết thời gian được phân bổ  
- Nó có lợi thế là có thể tăng tốc thời gian phản hồi.  
- Hiệu suất bị ảnh hưởng rất nhiều bởi kích thước của q.  
	- Nếu q lớn: nó hoạt động như FCFS.  
	- Khi q trở nên rất nhỏ: nó được gọi là process sharing, có nghĩa là n tiến trình chạy với tốc độ `1/n` tốc độ của CPU. Chi phí chuyển ngữ cảnh tăng lên.

### 4. Priority

Trong số các tiến trình đang chờ trong Ready Queue, tiến trình có mức ưu tiên cao nhất sẽ được phân bổ CPU trước.

![Pasted image 20230601142454](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601142454.png)

- **Non-Preemptive + Preemptive**
- Là phương pháp gán mức độ ưu tiên tĩnh/động và gán chúng cho CPU theo thứ tự giảm dần.
	- Nội bộ: thời gian chờ, yêu cầu lưu trữ, số lượng tệp đang sử dụng, tỷ lệ số lần bùng nổ I/O trung bình so với số lần bùng nổ bộ xử lý trung bình  
	- Bên ngoài: tầm quan trọng của tiến trình, người dùng trả nhiều tiền, bộ phận hỗ trợ công việc, các yếu tố chính sách  
- Trong trường hợp của SJF, nó có thể được gọi là lập lịch ưu tiên vì nó hoạt động như thể CPU Burst Time là ưu tiên.  
- Vấn đề :  
	- Chặn vô thời hạn (Indefinite Blocking): Một tiến trình sẵn sàng chạy nhưng không thể sử dụng CPU được coi là bị chặn chờ CPU.  
	- Đói (Starvation): Trong một hệ thống máy tính được tải nặng, các tiến trình có mức độ ưu tiên cao có thể liên tục xuất hiện, ngăn không cho các tiến trình có mức độ ưu tiên thấp giành được CPU.  
- Giải pháp:  
	- Lão hóa (Aging): Tăng dần mức độ ưu tiên của các tiến trình đã chờ đợi trên hệ thống trong một thời gian dài.  
	- Kết hợp lập lịch ưu tiên với lập lịch vòng tròn (lập lịch hàng đợi đa cấp)

### 5. Multilevel Queue

Thuật toán lập lịch trong đó lập lịch ưu tiên được kết hợp với quay vòng.

![Pasted image 20230601143125](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601143125.png)

- **Preemptive**  
- Để quản lý riêng các tiến trình có đặc điểm khác nhau và áp dụng lập lịch phù hợp với đặc điểm của tiến trình, hàng đợi chuẩn bị được chia thành nhiều phần và được quản lý.  
- Mỗi hàng đợi có thuật toán lập lịch trình riêng.  
- Các tiến trình không thể di chuyển giữa các hàng đợi.  
- Để ngăn các hàng đợi có mức độ ưu tiên thấp không thực thi, một Time Quantum khác được đặt cho mỗi hàng đợi.  
	- Hàng đợi có mức độ ưu tiên cao: Time Quantum nhỏ, hàng đợi có mức độ ưu tiên thấp: Time Quantum lớn  
- Hoạt động bằng cách chia thành pre-queue và post-queue  
	- Foreground process: sử dụng phương pháp round robin để rút ngắn thời gian phản hồi  
	- Background process: Sử dụng FCFS vì nó được định hướng tính toán và thời gian phản hồi không đáng kể.  
	- Thông thường, 80% thời gian CPU được phân bổ cho RR ở phía trước và 20% cho FCFS ở phía sau.  
- Vấn đề đói (Starvation) có thể xảy ra.

### 6. Multilevel Feedback Queue

Tương tự như Multilevel Queue, nhưng MFQ cho phép các process di chuyển giữa các queue.

![Pasted image 20230601143638](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601143638.png)

- **Preemptive**  
- Trong hàng đợi đa cấp, các tiến trình đã sử dụng hết lượng thời gian được phân bổ của chúng sẽ được di chuyển xuống và các tiến trình chưa lấp đầy lượng thời gian được để lại ở vị trí hàng đợi ban đầu của chúng.  
- Nó thuận lợi cho các nhiệm vụ ngắn và ưu tiên cho các nhiệm vụ tập trung vào đầu vào/đầu ra.  
- Nó giảm thời gian quay vòng trung bình vì các tiến trình có thời gian xử lý ngắn được xử lý trước.  
- Aging, một giải pháp cho Starvation, có thể được thực hiện.  
- Đây là thuật toán lập lịch CPU phổ biến nhất trong số các thuật toán lập lịch CPU được sử dụng ngày nay vì nó có thể được cấu hình để phù hợp với một hệ thống cụ thể.  
- Nó là thuật toán phức tạp nhất vì nó cần một cách cụ thể để chọn tất cả các giá trị tham số để hoạt động như một bộ lập lịch tốt nhất.

### 7. Highest Response-ratio Next (HRN)

Nó được tạo ra để bổ sung cho thuật toán SJF, nơi xảy ra tình trạng bất bình đẳng về chiếm dụng. Nó hoạt động bằng cách tính toán mức độ ưu tiên.

![Pasted image 20230601144629](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601144629.png)

- **Non-Preemptive**  
Phương pháp tăng mức độ ưu tiên của một tiến trình không được cấp CPU trong một thời gian dài do ưu tiên trong Ready Queue (để bù cho tình trạng đói)  
- Mức độ ưu tiên = (Wait Time + Burst Time) / (Burst Time)
