---
categories: [os, computer-science]
title: IPC
date created: 2023-06-03
date modified: 2023-07-10
tags: [os, computer-science]
---

## 🟠 IPC (Inter Process Communication)

- Như đã đề cập trong bài [[Process and Thread]], mỗi process có không gian bộ nhớ độc lập riêng nên không có cách nào chia sẻ dữ liệu với nhau.  
- Do đó, phương pháp được đưa ra là một phương thức liên lạc giữa các tiến trình sử dụng IPC.  
- Giao tiếp giữa các tiến trình có nghĩa là có sự truyền và nhận dữ liệu giữa các tiến trình và bộ nhớ đó phải được chia sẻ. Để làm được điều này, cần có **công cụ giao tiếp** == **IPC**

```
Nói cách khác, IPC là một phương thức giao tiếp cho phép giao tiếp giữa các tiến trình.
```

Các tiến trình có thể giao tiếp với các tiến trình bằng cách sử dụng các cơ sở IPC do Kernel cung cấp.

## 🟠 Phân loại IPC

Có nhiều loại IPC khác nhau. Tùy theo nhu cầu mà lựa chọn và sử dụng tốt phương thức giao tiếp IPC. IPC có thể được phân loại là:

![188942675-424c0d3b-c44e-4250-bcc3-7da697e3dd02](https://raw.githubusercontent.com/vanhung4499/images/master/snap/188942675-424c0d3b-c44e-4250-bcc3-7da697e3dd02.png)

- Message Passing System
- Shared Memory System

### 🔸  Message Passing System

- Message có độ dài cố định và message có độ dài thay đổi được trao đổi giữa người gửi và người nhận thông qua kernel và dữ liệu được lưu vào bộ đệm trong kernel.  
- Nó có thể hoạt động mà không cần chia sẻ bộ nhớ giữa các tiến trình.  
- Giao tiếp client-server là ví dụ điển hình nhất của Message Passing System.  
- Trong mô hình chuyển tin, IPC có thể được xem như một loại I/O từ quan điểm của tiến trình. Do đó, càng nhiều IPC được thực thi thì càng xảy ra nhiều context switch.

### 👉 Triển khai Message Passing loại IPC

Có 3 kiểu triển khi nhờ sử dụng:

- PIPE
- Message Queue
- Socket

#### 🥕 PIPE (Anonymous PIPE)

![Pasted image 20230603221041](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230603221041.png)

- Phương tiện được chia sẻ là một `file`.  
- Nó được sử dụng để giao tiếp giữa tiến trình cha và tiến trình con.  
- Mục đích của phương pháp này là tạo các tiến trình cha và con bằng cách sử dụng `fork()` để cho phép thực thi đồng thời từng tiến trình trên mỗi nhân CPU để thực thi nhanh. Đó là, xử lý song song được sử dụng để tăng tốc độ thực thi chương trình.  
- Một PIPE ẩn danh cho phép một tiến trình ghi dữ liệu trong khi tiến trình kia chỉ đọc nó.  
- Vì giao tiếp chỉ có thể theo một hướng nên nó được gọi là giao tiếp Half-Duplex. (Điều này có thể được thực thi hai chiều bằng cách sử dụng hai PIPE, nhưng việc triển khai có thể rất phức tạp.)  
- Sử dụng khi biết rõ ràng cần giao tiếp với tiến trình nào.  
- Nó có ưu điểm là rất đơn giản để thực thi.

#### 🥕 Named PIPE

- Phương tiện được chia sẻ là một `file`.  
- Phương pháp FIFO được sử dụng.  
- Không giống như PIPE ẩn danh, có thể giao tiếp giữa các tiến trình hoàn toàn khác nhau bất kể tiến trình gốc.  
- Nó sử dụng các file được đặt tên để liên lạc.  
- Giống như PIPE ẩn danh, nó chỉ cho phép giao tiếp một chiều, nhưng bạn có thể giải quyết vấn đề này bằng cách sử dụng hai tệp được đặt tên.

#### 🥕 Message Queue

- Đây là một phương pháp giao tiếp hai chiều.  
- Phương tiện được chia sẻ là `memory`.  
- Nó sử dụng cùng một phương thức nhập/xuất (FIFO) như Named PIPE, nhưng có một điểm khác biệt là Named PIPE là một luồng dữ liệu, trong khi Message Queue là một `Memory Space`.  
- Đây là một phương thức trong đó kernel quản lý một message queue để trao đổi dữ liệu.
- Có thể truy cập bởi tất cả các tiến trình. (Tất cả các bộ xử lý biết bộ truy cập (mã định danh) của hàng đợi tin nhắn đều có thể truy cập cùng một hàng đợi tin nhắn và chia sẻ dữ liệu.)

#### 🥕 Socket

- Chia sẻ dữ liệu thông qua giao tiếp network socket.  
- Một cấu trúc trong đó client và server giao tiếp thông qua một socket và được sử dụng khi chia sẻ dữ liệu từ xa giữa các tiến trình.

### 🔸 Shared Memory System

- Đó là một giao tiếp hai chiều.  
- Phương tiện được chia sẻ là `memory`.  
- Hai hoặc nhiều tiến trình chia sẻ một phần không gian địa chỉ và giao tiếp bằng cách đọc/ghi vào vùng bộ nhớ dùng chung.  
- Khi bộ nhớ dùng chung được thiết lập, giao tiếp sau đó có thể tiến hành mà không cần sự tham gia của kernel.  
- Nó là IPC nhanh nhất vì nó có thể truy cập trực tiếp vào bộ nhớ mà không cần trung gian. (vì nó truy cập trực tiếp vào bộ nhớ mà không có sự tham gia của kernel!)  
- Có thể giao tiếp miễn phí bằng cách cung cấp chức năng giao tiếp ở cấp độ chương trình.  
- Khi một tiến trình yêu cầu cấp phát bộ nhớ dùng chung từ kernel, thì nhân sẽ cấp phát một không gian bộ nhớ cho tiến trình và sau đó tất cả các tiến trình có thể truy cập vào vùng bộ nhớ. (Bất kỳ ai biết ID của bộ nhớ dùng chung đều có thể truy cập bộ nhớ)

#### 🥕 File - Memory mapping

- Memory Mapping là phương pháp chia sẻ file đang mở bằng cách ánh xạ file đó vào bộ nhớ (nghĩa là phương tiện chia sẻ là bộ nhớ file).  
- Nó chủ yếu được sử dụng khi cần chia sẻ một lượng lớn dữ liệu dưới dạng file.
