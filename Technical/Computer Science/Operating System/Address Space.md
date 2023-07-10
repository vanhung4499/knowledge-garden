---
categories: [os, computer-science]
title: Address Space
date created: 2023-05-31
date modified: 2023-07-10
tags: [os, computer-science]
---

## OS in The Early System

Cấu hình bộ nhớ máy tính ban đầu như sau.

![Pasted image 20230601185139](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601185139.png)

- Tổ chức bộ nhớ của máy tính ban đầu không có sự trừu tượng hoá.
- Một tiến trình tại một thời điểm đang sử dụng toàn bộ bộ nhớ.
- Trước đây, khi chạy một chương trình, chỉ có HĐH và một tiến trình được sử dụng, vì vậy không có vấn đề gì khi chỉ sử dụng bộ nhớ.

## Multiprogramming and Time Sharing

- Tuy nhiên, do các máy tính hiện đại chạy nhiều chương trình đồng thời, nên cấu hình bộ nhớ của các máy tính đời đầu thiếu khả năng sử dụng (**utilization**) và không hiệu (**efficiency**) quả nên không thể sử dụng được nữa.
- Vì vậy, như một giải pháp, cấu hình bộ nhớ được thay đổi để chạy nhiều chương trình bằng kỹ thuật **Time Sharing** như sau.

![Pasted image 20230601185318](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601185318.png)

- Không gian có sẵn cho các tiến trình (multiple processes) trong bộ nhớ được phân chia để nhiều tiến trình có thể chạy trong một không gian bộ nhớ.
- Do đó, do một số tiến trình được chuyển đổi trong một không gian bộ nhớ nên việc sử dụng và hiệu quả được tăng lên.
- Tuy nhiên, nếu nhiều tiến trình truy cập bộ nhớ cùng một lúc, các vấn đề bảo mật có thể phát sinh do chúng có thể truy cập tiến trình đang chạy.

## Virtual Memory

`Address space` có nghĩa là **OS** trừu tượng hóa (**`abstraction`**) bộ nhớ vật lý và phân phối nó cho tiến trình (**process**) hiện đang chạy.

![Pasted image 20230601193655](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601193655.png)

- Ví dụ: OS trừu tượng hóa bộ nhớ vật lý và phân bổ không gian địa chỉ cho Process A.
- Tại thời điểm này, Process A có địa chỉ từ 0~64 KB trong không gian địa chỉ trừu tượng (Virtual Memory) và truy cập 0 KB, nhưng trong bộ nhớ vật lý (Physical memory), nó truy cập 320 KB với địa chỉ từ 320 đến 384 KB.
- Điểm quan trọng ở đây là HĐH đánh lừa Process A nghĩ rằng nó được tải vào bộ nhớ tại một địa chỉ cụ thể và có một không gian địa chỉ rất lớn, đó là điểm **ảo hóa bộ nhớ**.

## Address Space

- Tóm lại, **Address Space** được tạo do OS trừu tượng hóa bộ nhớ vật lý (physical memory).  
- **Address space** chứa mọi thứ về chương trình hiện đang chạy, tức là tiến trình.

![Pasted image 20230601194701](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601194701.png)

- Trong Address Space có `Program code`, `Heap`, `Stack`, v.v
	- Program code: Nó bao gồm vùng dữ liệu và là không gian lưu trữ các biến static và biến toàn cục.
	- Heap: Đây là không gian lưu trữ dữ liệu được cấp phát động bằng cách sử dụng new() hoặc malloc() system call.
	- Stack: Đây là một không gian lưu trữ các địa chỉ hoặc giá trị trả về để có thể theo dõi vị trí bằng cách gọi một hàm. Bao gồm các biến cục bộ.
- Trên thực tế, không có tiến trình đơn lẻ nào chiếm hết bộ nhớ.
- Do đó, sự trừu tượng hóa là cần thiết để hệ điều hành ảo hóa bộ nhớ. Điều này là do hệ điều hành có thể chạy đồng thời nhiều chương trình bằng cách trừu tượng hóa bộ nhớ vật lý.  
- **Virtual address** còn được gọi là **Logical address** và có nghĩa là địa chỉ do CPU tạo ra.
- **Physical address** là địa chỉ được tạo bởi thiết bị bộ nhớ và được quản lý bởi OS.

## Goal of Memory Virtualization

**Ảo hóa bộ nhớ (Memory Virtualization) có những ưu điểm sau:**

1. Thuận tiện để sử dụng trong lập trình.
2. Transparency (Minh bạch): Hệ điều hành phải tạo ảo giác rằng các chương trình đang chạy không biết rằng bộ nhớ được ảo hóa. Một chương trình nên hoạt động như thể nó có một bộ nhớ vật lý độc lập.
3. Efficiency (Hiệu quả): OS nên sử dụng bộ nhớ hiệu quả về mặt thời gian và không gian. Bạn nên căn thời gian để nó không ảnh hưởng tiêu cực đến hiệu suất và sắp xếp khoảng cách sao cho nó tạo ra một lượng không gian tối thiểu cho ảo hóa. Để đạt hiệu quả này, OS cần hỗ trợ phần cứng như TLB.
4. Protection (Bảo vệ): OS bảo vệ các tiến trình khỏi các tiến trình khác và bản thân OS phải tự bảo vệ mình khỏi các tiến trình.
