---
categories: [os, computer-science]
title: Process and Thread
date created: 2023-05-31
date modified: 2023-07-10
tags: [os, computer-science]
---

## Process

Tiến trình (Process) là một đơn vị công việc được phân bổ tài nguyên từ hệ điều hành.

Khi bạn chạy một chương trình, hệ điều hành sẽ phân bổ các tệp chương trình vào không gian bộ nhớ máy tính.  
Nói cách khác, một chương trình đã được cấp phát không gian bộ nhớ và đang được thực thi được gọi là một tiến trình.  

Hệ điều hành cấp phát các vùng bộ nhớ độc lập cho mỗi tiến trình dưới dạng Code/Stack/Heap/Data:

- Code: Lưu trữ mã của chương trình
- Data: Lưu các biến toàn cục
- Stack: Lưu các giá trị tạm thời như tham số hàm, địa chỉ trả về và biến cục bộ.
- Heap: Lưu các giá trị được cấp phát động.

![Pasted image 20230531173844](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230531173844.png)

Vì mỗi tiến trình chạy trong một không gian bộ nhớ riêng nên nó không thể truy cập tài nguyên của các tiến trình khác.  
Vì vậy chúng giao tiếp với nhau qua một trung gian là [[IPC]](Inter Process Communication).

Hệ điều hành không nên chỉ có một process chạy, mà sẽ có thể chạy rất nhiều process!

## Thread

Luồng (Thread) là đơn vị của luồng thực thi sử dụng các tài nguyên được phân bổ cho tiến trình.

Luồng là sự phân tách các tác vụ của một tiến trình thành một luồng thực thi.  
Theo mặc định, một tiến trình có ít nhất một luồng, được gọi là main thread.

Chủ đề tồn tại trong các quy trình. Nếu chúng ta so sánh các quy trình và luồng với mã, thì một quy trình là toàn bộ mã và một luồng có thể là một chức năng trong số chúng, chẳng hạn như chức năng chính.

Các luồng chỉ được phân bổ stack riêng trong tiến trình và các vùng data, heap và code được dùng chung.

![Pasted image 20230531173907](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230531173907.png)

Vì vậy, không giống như các tiến trình, chúng hoạt động bằng cách chia sẻ một số không gian hoặc tài nguyên giữa các luồng.

![Thread-share](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Thread-share.png)

## Multi Process vs Multi Thread

### Multi Process

- Tổ chức một ứng dụng thành nhiều tiến trình, mỗi tiến trình thực hiện một nhiệm vụ duy nhất.  
- Ưu điểm:  
	- Nếu một trong các tiến trình con bị lỗi, các tác động sẽ không lan rộng ra ngoài cái chết của tiến trình con đó. (SAFETY)  
- Nhược điểm
	- Chi phí Context Switching
		- Vì mỗi tiến trình được cấp phát một vùng bộ nhớ độc lập nên không có bộ nhớ dùng chung. Do đó, có một vấn đề trong đó là chi phí chung, chẳng hạn như công việc nặng nhọc như khởi tạo bộ nhớ cache được thực hiện và tiêu tốn rất nhiều thời gian.
	- Kỹ thuật giao tiếp giữa tiến trình IPC
		- Vì mỗi tiến trình được cấp phát một vùng bộ nhớ độc lập nên các biến hoặc cấu trúc dữ liệu không thể chia sẻ giữa các tiến trình. Do đó, phải sử dụng một phương pháp gọi là IPC, đây là một phương pháp truyền thông khó và phức tạp.

### Multi Thread

- Tổ chức một ứng dụng thành nhiều luồng, với mỗi luồng xử lý một tác vụ.
- Mặc dù nhiều OS như Windows và Linux hỗ trợ đa xử lý nhưng chúng dựa trên đa luồng.
- Web Server là một ứng dụng đa luồng điển hình.
- Ưu điểm:
	- Không gian bộ nhớ và tiêu thụ tài nguyên hệ thống được giảm.  
	- Khi giao tiếp giữa các luồng, phương thức giao tiếp rất đơn giản vì dữ liệu được trao đổi bằng cách sử dụng không gian biến toàn cục hoặc vùng heap được cấp phát động.  
	- Context Switching ít tốn kém hơn và nhanh hơn vì không cần giải phóng bộ nhớ cache.  
	- Do đó, thông lượng của hệ thống được cải thiện, mức tiêu thụ tài nguyên giảm và thời gian phản hồi của chương trình được rút ngắn.  
- Nhược điểm:
	- Bởi vì các luồng khác nhau chia sẻ vùng Data và Heap, một luồng có thể truy cập các biến hoặc cấu trúc dữ liệu được sử dụng bởi các luồng khác và đọc hoặc sửa đổi các giá trị sai. Tức là xảy ra vấn đề chia sẻ tài nguyên (Synchronization).  
	- Nếu một luồng bị lỗi, toàn bộ quá trình sẽ bị ảnh hưởng.  
	- Yêu cầu thiết kế cẩn thận, khó gỡ lỗi

### So sánh

Đa luồng chiếm ít dung lượng bộ nhớ hơn so với đa tiến trình và có ưu điểm là context switching nhanh.

Mặt khác, phương pháp đa tiến trình có ưu điểm là dù một tiến trình có chết cũng không ảnh hưởng đến các tiến trình khác và được thực thi bình thường.

Hai phương pháp này giống nhau ở chỗ chúng thực hiện nhiều công việc cùng một lúc, nhưng phù hợp hay không phù hợp được phân biệt tùy thuộc vào hệ thống được áp dụng. Do đó, cần phải lựa chọn và áp dụng một phương thức hoạt động phù hợp theo đặc điểm và mục tiêu của hệ thống.
