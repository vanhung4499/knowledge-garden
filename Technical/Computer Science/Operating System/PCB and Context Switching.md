---
categories: [os, computer-science]
title: PCB & Context Switching
date created: 2023-05-31
date modified: 2023-07-10
tags: [os, computer-science]
---

## PCB(Process Controll Block)

PCB (Process Controll Block) là một cấu trúc dữ liệu lưu trữ thông tin về một tiến trình. Nó được lưu trữ và sử dụng trong bảng tiến trình, được lưu trữ trong main memory và cần thiết cho Context Switching.

![Pasted image 20230603223937](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230603223937.png)

### Trạng thái của tiến trình  

Một tiến trình có một số trạng thái.

![Pasted image 20230601181014](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601181014.png)

#### new & terminated

`new` có nghĩa là tiến trình đã được tạo và `terminated` có nghĩa là tiến trình kết thúc. Hai trạng thái trên là trạng thái tạm thời và tiến trình được vận hành chủ yếu bằng cách luân phiên ba trạng thái sau.

#### ready

Tiến trình đã sẵn sàng để chạy. Bạn lập lịch (scheuler) cho những tiến trình đang chạy và điều phối (dispatch) chúng. `running` là trạng thái mà tiến trình đang chạy và `waiting` là trạng thái mà nó đang chờ input từ người dùng.

> scheuler: chọn một trong các tiến trình  
> dispatch: gán một tiến trình đã chọn cho cpu

#### running & waiting

`running` là trạng thái mà tiến trình đang chạy và `waiting` là trạng thái chờ người dùng nhập dữ liệu.

Khi download file, có những tình huống cần có sự cho phép của người dùng để download. Khi đó bạn có thể hiểu download là trạng thái `running`, còn trạng thái yêu cầu sự cho phép của người dùng là `waiting`.

### Cấu trúc của PCB

![Pasted image 20230601182141](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601182141.png)

**Thông tin được lưu trữ trong PCB**

- Mã định danh tiến trình (Process ID , PID)
- Pointer: được sử dụng để xác định vị trí tiến trình  
- Trạng thái tiến trình (Process State): new, ready, running, waiting, terminated
- Program Counter: Bộ đếm chương trình trỏ đến địa chỉ của lệnh tiếp theo mà tiến trình này sẽ thực hiện.
- CPU Regiters : Accumulator, Index Register, v.v
- Quyền xử lý: Để lưu trữ vị trí hiện tại của một tiến trình  
- Thông tin lập lịch trình CPU: mức độ ưu tiên của tiến trình, thời gian thực hiện cuối cùng, thời gian chiếm dụng CPU, v.v.  
- Thông tin quản lý bộ nhớ: Page table, Segment table, v.v  
- Thông tin trạng thái I/O: Danh sách các thiết bị I/O được phân bổ cho tiến trình, danh sách các tệp đang mở, v.v.  
- Thông tin tài khoản: thời gian sử dụng CPU, giới hạn thời gian, số tài khoản, v.v.
- Thông tin trạng thái I/O: Các thiết bị I/O được phân bổ cho tiến trình, danh sách các tệp đang mở, v.v.

## Context Switching

### Context Switching hoạt động thế nào?

Chuyển ngữ cảnh (Context Switching) là một quá trình trong đó CPU lưu trữ trạng thái của tiến trình trước đó trong PCB và đọc thông tin của một quá trình khác từ PCB và tải nó vào register.

![Pasted image 20230601183515](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601183515.png)

> - Idle: trạng thái nhàn rỗi
> - Excuting: trạng thái chạy

1. Khi quá trình p1 gặp interrupt hoặc system call, thông tin tiến trình được lưu trữ trong PCB1.  
2. Nạp thông tin của tiến trình p2 từ PCB2, thay đổi trạng thái và cấp phát cpu cho p2.  
3. Khi công việc của tiến trình p2 gặp interrupt hoặc system call, thông tin tiến trình được lưu vào PCB2.  
4. Nạp lại thông tin của tiến trình p1 từ PCB1, thay đổi trạng thái và cấp phát cpu cho p1.

### Nguyên nhân Context Switching

Điều này là do phương pháp lập lịch ưu tiên.  
Trong lập lịch ưu tiên, khi một tiến trình có mức ưu tiên cao hơn được gán cho CPU, tiến trình đang chạy trước đó sẽ bị dừng và tiến trình có mức ưu tiên cao hơn sẽ tiếp tục.  
Chuyển ngữ cảnh là một cách để lưu lại thông tin của tiến trình đã dừng và thực thi tiến trình với mức ưu tiên cao hơn.

### Sự cố với Context Switching

Nếu Context Switching diễn ra thường xuyên, Overhead sẽ xảy ra và hiệu suất sẽ giảm.

> Overhead: thời gian sử dụng và dung lượng bộ nhớ đã sử dụng

Trong khi tải thông tin của tiến trình được thực thi từ PCB, không có tiến trình nào được phân phối cho CPU, vì vậy không thể làm gì được.

-> Nếu điều này xảy ra thường xuyên, nó sẽ dẫn đến hiệu suất kém.

### Context Cost

- Khởi tạo cache  
- Khởi tạo Memory Mapping  
- Giữ Kenel chạy

Để giải quyết vấn đề trên, thay vì chuyển ngữ cảnh trong nhiều tiến trình, hãy tạo nhiều luồng trong một quy trình và thực hiện chuyển ngữ cảnh trong các luồng.  
Các luồng sẽ tiêu tốn ít chi phí hơn các tiến trình vì chúng chia sẻ không gian bộ nhớ và chỉ cần dọn sạch stack.
