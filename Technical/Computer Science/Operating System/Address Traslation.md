---
categories: [os, computer-science]
title: Address Traslation
date created: 2023-05-31
date modified: 2023-07-10
tags: [os, computer-science]
---

## Per Process Address Space

![Pasted image 20230601201336](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601201336.png)

Trong hình trên, hãy xem quá trình OS chuyển đổi Address space thành địa chỉ Physical memory.

## Memory Virtualizing with Efficiency and Control

- Như đã đề cập trước đó trong [[Address Space]], ảo hóa bộ nhớ có nghĩa là OS tạo cho các tiến trình tưởng rằng chúng có không gian bộ nhớ riêng.
- Nó có một chiến lược tương tự như LDE (Limited Direct Execution) về hiệu quả (Efficiency), khả năng kiểm soát (Controllability) và tính linh hoạt (Flexibility).
- Tóm lại, LDE cho phép một chương trình chạy trực tiếp trên phần cứng, nhưng tại một số thời điểm (khi xảy ra I/O Request đối với đĩa, hoặc khi CPU hoặc bộ nhớ giành được quyền truy cập vào nhiều tài nguyên hệ thống hơn), OS sẽ chạy chương trình bằng cách trực tiếp tham gia thực hiện.
- Một cách để giới thiệu ảo hóa bộ nhớ là sử dụng kỹ thuật dịch địa chỉ (address translatation) trong đó OS chuyển đổi **virtual address(=logical address)** thành **physical address** trên phần cứng.

## Address Translation

- Hãy xem xét việc dịch địa chỉ dựa trên phần cứng để biết cơ chế ảo hóa bộ nhớ.
- Dịch địa chỉ đề cập đến hỗ trợ phần cứng dịch địa chỉ ảo trong CPU thành địa chỉ bộ nhớ vật lý trong DRAM.
- Điều này cho phép OS thực hiện ảo hóa khiến tiến trình nhầm địa chỉ ảo thành địa chỉ bộ nhớ thực.

## Base and Bounds Register

- Cần có hai register trong CPU để sử dụng kỹ thuật dịch địa chỉ.
- Một register được gọi là `base register` và cái còn lại được gọi là `bound register`.
	- `base register`: Chỉ đến điểm bắt đầu của Address Space khi Virtual Address Space được chuyển vào Physical Memory.
	- `bound register`: cho biết kích thước của Virtual Address Space.
- Đừng quên rằng cả 2 register đều là phần cứng (SRAM) tồn tại trong CPU.

![Pasted image 20230601210428](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601210428.png)

- Như hình trên, `bound register` là 16 KB và cho biết kích thước của không gian địa chỉ ảo. Và `base register` là 32KB và trỏ đến phần đầu của không gian địa chỉ bộ nhớ vật lý.
- Hai register cho phép bạn đặt không gian địa chỉ ảo ở bất kỳ đâu trong bộ nhớ vật lý, và cho phép các tiến trình truy cập vào không gian địa chỉ của chính chúng.

## Dynamic(Hardware-based) Relocation

- Dynamic Relocation là phương pháp dịch địa chỉ dựa trên phần cứng bằng cách sử dụng các **base**, **bound** register.
- Khi một chương trình bắt đầu chạy, OS sẽ xác định vị trí bộ nhớ vật lý nơi tiến trình sẽ được tải.
	- Đầu tiên, giá trị của base register được xác định.  
	 > physical address = virtual address + base
	- Địa chỉ ảo không được lớn hơn bound và phải lớn hơn hoặc bằng 0.
	 > 0 <= virtual address < bound
- Thông qua đó, quá trình và quá trình chuyển đổi địa chỉ có thể được bảo vệ và nếu xảy ra sự cố trong các thanh ghi cơ sở và ràng buộc, HĐH có thể can thiệp và xử lý sự cố.

### Essential prerequisite (điều kiện tiên quyết cần thiết)

Chỉ OS mới có thể truy cập các base và bound register và thay đổi giá trị của chúng.

## Memory Management Unit

- Tiếp theo, hãy xem xét một MMU đơn giản.
- `MMU` là tên viết tắt của Memory Management Unit, và là một thiết bị phần cứng quản lý quyền truy cập của CPU vào bộ nhớ.
- Nó hữu ích khi địa chỉ ảo sử dụng kỹ thuật dịch địa chỉ sang địa chỉ thực.

![Pasted image 20230601215714](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601215714.png)

- MMU dịch một địa chỉ ảo (virtual address) thành một địa chỉ vật lý (physical address) khi nó nằm trong phạm vi của bound register.
- Nghĩa là, nó bảo vệ bộ nhớ bằng cách ngăn nó đi đến một địa chỉ vật lý khác.
- Tóm lại, nếu tổng của địa chỉ ảo (virtual address) và base register nằm trong phạm vi của bound register, thông qua MMU, nó sẽ được chuyển đổi thành địa chỉ thực (physical address) và nếu nó nằm ngoài phạm vi, một ngoại lệ sẽ được thả.

![Pasted image 20230601220543](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601220543.png)

## OS Issues for Memory Virtualizing

- Bây giờ chúng ta đã thấy phần cứng làm gì trong việc dịch địa chỉ, hãy xem xét vai trò của OS.
- Các tình huống mà hệ điều hành phải can thiệp để thực thi base và bound register như sau.

1. Khi một tiến trình bắt đầu chạy, nó cần tìm xem có dung lượng trống trong bộ nhớ vật lý có đủ cho không gian địa chỉ của nó hay không.
2. Khi một tiến trình kết thúc, không gian bộ nhớ được sử dụng bởi quá trình kết thúc phải được giải phóng để cho các tiến trình khác sử dụng.
3. Khi xảy ra context switching, thông tin của base và bound register phải được lưu và khôi phục.
4. Bạn phải cung cấp các trình xử lý ngoại lệ hoặc các hàm được gọi khi xảy ra các ngoại lệ khác ngoài ba trường hợp được mô tả ở trên.

### OS Issues: 1. When a Process Starts Running

- Khi một tiến trình được tạo, OS phải tìm không gian trống cho không gian địa chỉ mới.
- `Free list` có nghĩa là một danh sách phạm vi của physical memory không sử dụng. Nói một cách đơn giản, đó là không gian trống có thể được sử dụng.

![Pasted image 20230601221357](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601221357.png)

- Nghĩa là, `16KB` và `48KB` (khoanh tròn) được biểu thị bằng `free list` ở bên trái có nghĩa là vị trí dung lượng trống đang không được sử dụng.
- Trên thực tế, OS phải theo dõi vị trí của dung lượng trống trong bộ nhớ vật lý (DRAM).

### OS Issues: 2. When a Process Is Terminated

- Khi một tiến trình kết thúc, OS phải trả lại không gian địa chỉ của quá trình đã kết thúc trở lại `Free list`.

![Pasted image 20230601223414](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601223414.png)

- Khi Process A thoát, không gian địa chỉ của nó sẽ được thêm vào `Free list` để sử dụng sau này.

### OS Issues: 3. When Context Switch Occurs

- Khi xảy ra Context Switch, OS phải đồng thời lưu và khôi phục base & bound register.
- Các giá trị của base & bound register của các tiến trình riêng lẻ được quản lý trong `process structure` hoặc PCB (khối điều khiển quy trình) cho mỗi tiến trình bởi OS.

![Pasted image 20230601223614](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230601223614.png)

- Ví dụ: nếu Context Switch xảy ra khi `Process A` đang chạy, base & bound register của `Process A` được lưu trên PCB của chính nó.
- Và khi `Process B` được thực thi và kết thúc, nó sẽ truy xuất base & bound register của Process A được lưu trong PCB và thực thi lại.
