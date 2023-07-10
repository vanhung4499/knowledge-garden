---
categories: [os, computer-science]
title: Interrupt
date created: 2023-05-31
date modified: 2023-07-10
tags: [os, computer-science]
---

## Interrupt là gì?

Ngắt (interrupt) là một phương pháp bất đồng bộ để thông báo cho bộ xử lý về một sự kiện (event), lưu vị trí của lệnh hiện tại (pcb), dừng nó và xử lý nó để làm việc khác.

### Ngắt phần cứng  

1. Ngắt phần cứng phổ biến  
	- Các ngắt do bộ điều khiển của thiết bị phần cứng tạo ra để yêu cầu dịch vụ từ CPU  
2. Ngắt hẹn giờ (Timer) của hệ điều hành  
	- Trong hệ điều hành, mỗi lập trình viên sử dụng CPU trong thời gian đã định, để họ có thể được phân bổ CPU trong một khoảng thời gian hợp lý và xảy ra ngắt khi hết thời gian sử dụng.

![Pasted image 20230601145720](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601145720.png)

### Ngắt phần mềm (Trap)

1. Ngoại lệ (Exception)
	- Một ngắt được tạo tự động khi một chương trình gặp lỗi (try-catch).  
	- ví dụ: chia cho 0, NullPointerException, v.v.  
2. System Call  
	- Một ngắt xảy ra khi một tiến trình gọi một kernel function để yêu cầu một dịch vụ từ hệ điều hành.

![Pasted image 20230601145729](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601145729.png)

## Tại sao phải ngắt?

Nó được sử dụng để tránh lãng phí CPU càng nhiều càng tốt. Nếu không có Interrupt, CPU sẽ ở trong vòng chờ kiểm tra trạng thái thiết bị và do đó, CPU bị lãng phí do không thể thực hiện các hoạt động khác.

## Chu kỳ xử lý các Interrupt

![Interrupt-Cycle](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Interrupt-Cycle.svg)

Nếu một ngắt được CPU thực hiện ngay lập tức mặc dù nó đã xảy ra, quá trình xử lý của CPU trở nên phức tạp và không được xử lý hiệu quả. Do đó, khi chu kỳ lệnh kết thúc, quá trình xử lý ngắt được thực hiện.

## Interrupt Service Routine (ISR)  

Interrupt service routine (ISR) còn được gọi là trình xử lý ngắt, nó là một software routine thực sự xử lý các interrupt. Nó lưu các register và PC (Programming Counter) đang được thực thi, duy trì trạng thái của CPU đang được thực thi và trả về trạng thái ban đầu khi quá trình xử lý ngắt kết thúc.

### Quá trình xử lý ngắt

![Pasted image 20230601155304](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601155304.png)

- Dừng chương trình đang chạy.  
- Lưu trữ trạng thái tiến trình hiện tại. (Context Switching)  
- Thực thi thủ tục xử lý ngắt.  
- Thực thi chương trình phục vụ ngắt (ISR).  
- Quay trở lại vị trí thực hiện trước đó bằng cách khôi phục các giá trị của PC được lưu trữ trước đó.  
- Sau đó thực thi chương trình.
