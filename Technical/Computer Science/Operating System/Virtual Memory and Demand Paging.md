---
categories: [os, computer-science]
title: Virtual Memory and Demand Paging
date created: 2023-05-31
date modified: 2023-07-10
tags: [os, computer-science]
---

## 🎯 Virtual Memory

- Kỹ thuật làm cho bộ nhớ có vẻ lớn hơn dung lượng thực của nó.  
- Ý tưởng là khi một tiến trình đang chạy, nó có thể được thực thi ngay cả khi toàn bộ tiến trình không được nạp vào bộ nhớ.  
- Nó liên quan chặt chẽ đến locality of reference.  
- Cung cấp RAM và Disk dạng một vùng bộ nhớ trừu tượng duy nhất.  
- Hệ điều hành chỉ tải những phần cần thiết trong vùng địa chỉ logic của chương trình vào bộ nhớ thông qua kỹ thuật bộ nhớ ảo và lưu trữ phần còn lại trên đĩa.

### Bối cảnh xuất hiện

- Để giải quyết vấn đề ảnh hưởng đến toàn bộ hệ thống khi một chương trình bị kết thúc bất thường trong khi chiếm bộ nhớ.  
- Nó đảm bảo sự ổn định của hệ thống bằng cách giới hạn không gian mà tiến trình chiếm giữ trong không gian địa chỉ ảo.
- Để chạy các tiến trình cần nhiều dung lượng hơn bộ nhớ vật lý.  
- Ý tưởng là vị trí của tham chiếu cho phép thực thi ngay cả khi toàn bộ tiến trình không có trong bộ nhớ vật lý.  

### Ưu điểm của Virtual Memory

- Các chương trình không bị giới hạn bởi kích thước bộ nhớ vật lý thực tế.  
- Nhiều chương trình có thể được thực hiện đồng thời, tăng tốc độ xử lý và sử dụng CPU.  
- Giảm I/O cần thiết cho trao đổi chương trình.  

### Không gian địa chỉ ảo (logic): Virtual Address Space

- Không gian bộ nhớ logic của người dùng/tiến trình.  
	- Bắt đầu từ địa chỉ 0.  
	- Được Memory Mangement Unit (MMU) chuyển đổi thành địa chỉ bộ nhớ vật lý.  

### Công nghệ cốt lõi để triển khai Virtual Memory

- Nhu cầu phân trang (Demand Paging)
	- Tải các trang đã hoán đổi vào bộ nhớ khi cần.  
	- Dịch địa chỉ dựa trên các kỹ thuật phân trang cơ bản.  
- Thay thế trang (Page Replacement)  
	- Khi dung lượng bộ nhớ không đủ, các trang sẽ được hoán đổi và thay thế.

## Demand Paging

- Tải từng trang của không gian địa chỉ logic vào bộ nhớ khi nó thực sự cần thiết.  
	- Các trang không sử dụng được lưu trữ trong swap space.  
	- Nó có thể lưu các yêu cầu vật lý của bộ nhớ.  
	- Giảm thời gian trao đổi.

### Phân trang theo yêu cầu và Page Table

- Không giống như phân trang chung, mỗi trang được chia thành bộ nhớ và không gian hoán đổi, do đó, cần có một Memory Mangement Unit (MMU) để chỉ ra vị trí hợp lý của trang.  
	- Valid/Invalid bit
		- Valid : Trạng thái của trang trong bộ nhớ.  
		- Invalid : Trang nằm trong swap space.  
- Nếu bạn đang đề cập đến một trang trạng thái invalid  
	- Hệ điều hành tạo trap (software interrupt) lỗi trang dưới dạng interrupt và I/O xảy ra để đưa trang từ swap space và tải nó vào bộ nhớ.  
	- Quá trình đợi cho đến khi thao tác I/O kết thúc.

### Xử lý lỗi trang

![Pasted image 20230602165709](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230602165709.png)

1. Các tiến trình tham chiếu đến Page Table để truy cập dữ liệu mới và trang được đánh dấu là không hợp lệ.  
2. Tạo một trap lỗi trang ngắt nội bộ và chuyển tiếp nó tới trình xử lý ngắt của hệ điều hành  
3. Bắt đầu thao tác IO đọc dữ liệu từ swap space.
4. Tải dữ liệu cần thiết vào vị trí thích hợp trong bộ nhớ  
5. Cập nhật Page Table không hợp lệ -> hợp lệ  
6. Quá trình restart interrupt xảy ra, được gửi đến tiến trình, tiến trình tiếp tục

### Hiệu suất lý thuyết

- Thời gian truy cập bộ nhớ phụ thuộc lỗi trang.  
	- Bị ảnh hưởng bởi tỷ lệ lỗi trang.  
	- Thông thường giảm hiệu suất gấp 10 lần so với khi tất cả thông tin được tải vào bộ nhớ  
	- Tuy nhiên, do local reference trong việc yêu cầu đến bộ nhớ do bản chất của việc thực hiện tiến trình, sự suy giảm hiệu suất thông qua truy cập bộ nhớ ảo hiếm khi xảy ra.  

### Cân nhắc hiệu suất  

- Quản lý hiệu quả không gian hoán đổi
	- Cung cấp IO nhanh hơn các hệ thống file IO điển hình.  
		- Sử dụng nhiều đơn vị đầu vào/đầu ra dữ liệu (block) cùng một lúc.  
		- Tìm kiếm tệp, không sử dụng kỹ thuật phân bổ gián tiếp.  
	- Chọn cách sử dụng swap space khi chạy một tiến trình  
		- Yêu cầu phân trang tiến trình sau khi đưa toàn bộ hình ảnh quá trình vào swap space.  
	- Các file thực thi chương trình có được lưu trong swap space hay không?  
		- Vì các file thực thi chương trình chỉ đọc (read only) nên chúng không được lưu trữ trong swap space khi hoán đổi.  
- Giảm thiểu lỗi trang  
	- Nó phụ thuộc rất nhiều vào loại tiến trình. Các phần không thể kiểm soát của hệ điều hành  
	- Tác động của việc thay thế trang  
		- Thuật toán phụ thuộc vào việc thay thế trang  
		- Phân tích các mẫu truy cập trang và thay thế trang thích hợp nên được thực hiện.

## 🎯 Page Replacement

### Memory overallocation

- Trạng thái trong đó tất cả các vùng của bộ nhớ vật lý được phân bổ cho các tiến trình
- Trạng thái không có khung bộ nhớ trống để xử lý phân trang yêu cầu  

### Làm thế nào để giải quyết  

- Kết thúc tiến trình  
	- Ngữ cảnh thực thi của tiến trình đã bị thay đổi, điều này vi phạm mục đích ban đầu của dịch vụ quản lý bộ nhớ.  
- Quy trình swap out  
	- Nếu toàn bộ tiến trình cụ thể được hoán đổi, mức độ đa xử lý sẽ giảm xuống vì tải lại vào bộ nhớ rất tốn kém.  
- Trao đổi một số trang  
	- Thay thế trang  
	- Các yếu tố cần thiết của quy trình phân trang theo nhu cầu  

### Thuật toán thay thế trang  

> - Vấn đề trọng tâm nhất trong phân trang theo yêu cầu với thuật toán cấp phát khung.  
> - Mục tiêu: Giảm thiểu lỗi trang

- **FIFO First In First Out**
	- Thay thế trang cũ nhất trong bộ nhớ.  
		- Quản lý dữ liệu cho từng trang dưới dạng hàng đợi.  
		- Nó có thể được thực hiện theo cách đơn giản nhất, nhưng hiệu suất không được đảm bảo.  
	- Khả năng mâu thuẫn Belady tồn tại
- **OPR Optimal Page Replacement**
	- Tỷ lệ lỗi trang khác có thể được giảm thiểu mà không tạo ra mâu thuẫn Belady.
	- Thuật toán thay thế các trang không được sử dụng trong thời gian dài nhất trong tương lai
	- Thực tế việc triển khai là không thể.  
		- Bởi vì chúng tôi cần biết hình dạng của các tham chiếu trang trong tương lai  
		- Nó được sử dụng để so sánh hiệu suất của các thuật toán khác nhau.  
			- Tính toán bằng cách áp dụng một cột tham chiếu và khung bộ nhớ đã cho
- **LRU Least Recently Used**
	- Phương pháp gần với thuật toán OPR  
	- Thuật toán thay thế các trang dựa trên lịch sử tham chiếu trong quá khứ.  
	- Cân nhắc  
		- Bạn sẽ có thể lấy lịch sử trang.  
		- Cần có hỗ trợ phần cứng có thể cập nhật thông tin thời gian tham chiếu cho tất cả các tham chiếu bộ nhớ.  
		- Ghi lại thông tin thời gian cho các trang được sử dụng.  
		- Duy trì một chồng thông tin trang  
			- Trang được tham chiếu gần đây nhất được chuyển lên đầu ngăn xếp.  
			- Trang được thay thế sẽ trở thành trang ở dưới cùng của ngăn xếp.
- **Counting**  
	- Ghi lại số lần sử dụng của từng trang  
		- Nó không dễ triển khai trong thực tế và khó xấp xỉ thuật toán tối ưu.  
		- Được chia thành LFU và MFU  
		- LFU Least Frequently Used - thay thế trang có số lượng tài liệu tham khảo ít nhất
		- MFU Most Frequently Used - thay thế trang bằng số lượng tham chiếu nhiều nhất
