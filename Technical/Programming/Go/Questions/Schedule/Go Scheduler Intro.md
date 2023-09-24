---
title: Go Scheduler Intro
tags:
  - golang
  - interview
categories: golang, interview
date created: 2023-09-22
date modified: 2023-09-22
---

# Go Scheduler Introdution

## Scheduler là gì?

Quá trình thực thi của chương trình Go được chia thành hai lớp: Go Program (chương trình Go) và Runtime (thời gian chạy), tức là chương trình người dùng và thời gian chạy. Chúng được liên kết với nhau thông qua các cuộc gọi hàm để thực hiện quản lý bộ nhớ, giao tiếp qua channel, tạo goroutine và các chức năng khác. Các cuộc gọi hệ thống của chương trình người dùng sẽ được Runtime chặn lại để giúp nó thực hiện lập lịch và công việc liên quan đến thu gom rác.

Mối quan hệ toàn cảnh giữa chúng được biểu diễn trong hình sau:

![scheduler-5.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/scheduler-5.png)

## Tại sao cần Scheduler?

Scheduler của Go có thể coi là một phần quan trọng nhất của Runtime Go. Runtime duy trì tất cả các goroutine và sử dụng scheduler để lập lịch. Goroutine và thread là độc lập nhau, nhưng goroutine cần phụ thuộc vào thread để thực thi.

Hiệu suất thực thi của chương trình Go và việc lập lịch của scheduler là không thể tách rời.

## Nguyên lý hoạt động của Scheduler

Thực tế, đối với hệ điều hành, tất cả các chương trình đều đang thực thi nhiều luồng. Việc lập lịch goroutine để thực thi trên các luồng chỉ là một khái niệm ở mức độ runtime, trên mức độ trên hệ điều hành.

Có ba cấu trúc cơ bản để triển khai lập lịch goroutine: g, m và p.

`g` đại diện cho một goroutine, bao gồm các trường liên quan đến stack của goroutine, trạng thái hiện tại của goroutine và địa chỉ chỉ thị hiện tại, tức là giá trị PC.

`m` đại diện cho một luồng kernel, bao gồm các trường như goroutine đang chạy và các trường khác.

`p` đại diện cho một bộ xử lý ảo (Processor), nó duy trì một hàng đợi g đang chạy và m cần có p để chạy.

Tất nhiên, còn một cấu trúc quan trọng khác là `sched`, nó quản lý toàn bộ hệ thống.

Khi Runtime bắt đầu, nó sẽ khởi động một số G: G cho thu gom rác, G cho lập lịch, G để chạy mã người dùng; và sẽ tạo một M để bắt đầu thực thi G. Theo thời gian, nhiều G khác sẽ được tạo ra và nhiều M khác cũng sẽ được tạo ra.

Tuy nhiên, trong phiên bản Go ban đầu, không có cấu trúc p, `m` phải lấy g cần chạy từ một hàng đợi toàn cục, vì vậy nó cần một khóa toàn cục. Khi có nhiều goroutine cần chạy cùng một lúc, khóa trở thành một điểm bottleneck. Sau đó, trong phiên bản được triển khai bởi Dmitry Vyokov, cấu trúc p được thêm vào. Mỗi p riêng biệt duy trì một hàng đợi g đang chạy, giải quyết vấn đề khóa toàn cục trước đây.

Mục tiêu của Go scheduler:

> For scheduling goroutines onto kernel threads.

![scheduler-6.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/scheduler-6.png)

Ý tưởng cốt lõi của Go scheduler là:

1. Tái sử dụng các luồng;
2. Giới hạn số lượng luồng đang chạy (không tính luồng bị chặn) là N, N bằng số lõi CPU.
3. Có runqueues riêng tư cho từng luồng và có thể lấy goroutine từ các luồng khác để chạy, khi một luồng bị chặn, runqueues có thể được chuyển cho luồng khác.

Tại sao cần có thành phần P, không thể đặt runqueues trực tiếp trên M sao?

> You might wonder now, why have contexts at all? Can’t we just put the runqueues on the threads and get rid of contexts? Not really. The reason we have contexts is so that we can hand them off to other threads if the running thread needs to block for some reason.

> An example of when we need to block, is when we call into a syscall. Since a thread cannot both be executing code and be blocked on a syscall, we need to hand off the context so it can keep scheduling.

Khi một luồng bị chặn, các goroutine được gắn kết với nó sẽ được chuyển sang các luồng khác.

Go scheduler sẽ khởi động một luồng nền gọi là sysmon, để theo dõi các goroutine chạy quá lâu (hơn 10 ms) và lập lịch chúng vào global runqueues. Đây là một hàng đợi toàn cầu, có ưu tiên thấp để trừng phạt

![scheduler-7.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/scheduler-7.png)

### Tổng quan

Thường khi nói về Go scheduler, chúng ta sẽ đề cập đến mô hình GPM. Hãy xem từng phần một.

Hình sau đây cho thấy thông tin phần cứng trên máy mac của tôi, chỉ có 4 lõi.

![CleanShot 2023-09-22 at 09.45.26@2x.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/CleanShot%202023-09-22%20at%2009.45.26%402x.png)

Tuy nhiên, với Hyper-Threading, 1 lõi có thể trở thành 8 lõi, vì vậy khi tôi chạy chương trình sau trên máy mac của mình, nó sẽ in ra 8.

```go
func main() {
	// NumCPU trả về số lõi logic mà tiến trình hiện tại có thể sử dụng
	fmt.Println(runtime.NumCPU())
}
```

Vì NumCPU trả về số lõi logic, không phải số lõi vật lý, nên kết quả cuối cùng là 8.

Khi chạy một chương trình Go cục bộ, mỗi lõi logic sẽ được gán cho một P (Logical Processor); đồng thời, mỗi P sẽ được gán cho một M (Machine, đại diện cho luồng kernel), các luồng kernel này vẫn được lập lịch bởi lập lịch OS.

Tóm lại, khi tôi khởi động một chương trình Go cục bộ, tôi sẽ có 8 luồng hệ thống để thực hiện các nhiệm vụ, mỗi luồng sẽ đi kèm với một P.

Trong quá trình khởi tạo, chương trình Go sẽ có một G (Goroutine ban đầu) để thực thi. G sẽ được thực thi trên M, trong khi luồng kernel sẽ được lập lịch trên lõi CPU và G sẽ được lập lịch trên M.

G, P, M đã được đề cập, còn hai thành phần quan trọng khác chưa được đề cập: Global Runnable Queue (GRQ) và Local Runnable Queue (LRQ). LRQ lưu trữ goroutine có thể chạy cục bộ (tức là trên P cụ thể), trong khi GRQ lưu trữ goroutine có thể chạy toàn cầu, chưa được phân bổ cho P cụ thể.

![scheduler-9.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/scheduler-9.png)

Scheduler của Go là một phần của Runtime Go, nó được nhúng trong chương trình Go và chạy cùng với chương trình Go. Do đó, nó chạy trong không gian người dùng, trên lớp trên hệ điều hành. Khác với lập lịch OS theo kiểu chạy chấm dứt (preemptive), Go scheduler sử dụng lập lịch hợp tác (cooperating).

> Being a cooperating scheduler means the scheduler needs well-defined user space events that happen at safe points in the code to make scheduling decisions.

Lập lịch hợp tác thường yêu cầu người dùng đặt điểm lập lịch, ví dụ như câu lệnh yield trong Python để cho biết OS Scheduler có thể lập lịch tôi.

Tuy nhiên, trong Go, việc lập lịch goroutine được thực hiện bởi Go runtime và không được người dùng kiểm soát, vì vậy chúng ta vẫn có thể coi Go scheduler là lập lịch chấm dứt, vì người dùng không thể dự đoán hành động tiếp theo của lập lịch.

Giống như thread, goroutine cũng có ba trạng thái (đơn giản):

| Trạng thái | Giải thích                                                                                                                                                                        |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Waiting    | Trạng thái chờ đợi, goroutine đang chờ xảy ra một sự kiện nào đó. Ví dụ: chờ dữ liệu mạng, đĩa, gọi API hệ điều hành, chờ điều kiện đồng bộ hóa truy cập bộ nhớ như atomic, mutex |
| Runnable   | Trạng thái sẵn sàng, chỉ cần có M tôi có thể chạy                                                                                                                                 |
| Executing  | Trạng thái đang chạy. Goroutine đang thực thi trên M, đây là trạng thái chúng ta muốn                                                                                             |

Hình sau đây cho thấy quy trình làm việc của goroutine:

![scheduler-10.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/scheduler-10.png)
