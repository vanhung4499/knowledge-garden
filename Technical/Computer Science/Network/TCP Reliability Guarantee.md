---
title: TCP Reliability Guarantee
tags:
  - network
  - computer-science
categories: " network, computer-science"
date created: 2023-09-18
date modified: 2023-09-18
---

# Đảm bảo độ tin cậy TCP (tầng vận chuyển)

## Làm thế nào TCP đảm bảo tính tin cậy của việc truyền dữ liệu?

1. **Dựa trên việc truyền gói dữ liệu** : Dữ liệu ứng dụng được chia thành các khối dữ liệu mà TCP cho là phù hợp nhất để gửi đi, sau đó được chuyển đến tầng mạng. Các khối dữ liệu này được gọi là các đoạn hoặc phân đoạn.
2. **Sắp xếp lại và loại bỏ các gói dữ liệu không tuân thủ thứ tự** : TCP gán một số thứ tự cho mỗi gói tin để đảm bảo không có gói tin nào bị mất. Có số thứ tự, dữ liệu nhận được có thể được sắp xếp theo thứ tự và loại bỏ các gói tin có số thứ tự trùng lặp để đảm bảo tính toàn vẹn của dữ liệu.
3. **Kiểm tra checksum** : TCP duy trì một checksum trong tiêu đề và dữ liệu của nó. Đây là một checksum từ đầu đến cuối, nhằm mục đích phát hiện bất kỳ sự thay đổi nào trong dữ liệu trong quá trình truyền. Nếu checksum của một đoạn bị lỗi, TCP sẽ loại bỏ đoạn đó và không xác nhận việc nhận đoạn đó.
4. **Truyền lại khi quá thời gian** : Sau khi bên gửi gửi đi dữ liệu, nó sẽ bắt đầu một bộ đếm thời gian và chờ xác nhận từ bên nhận rằng gói tin đã được nhận. Nếu bên gửi không nhận được xác nhận trong khoảng thời gian đi lại hợp lý (RTT), gói tin tương ứng sẽ được cho là đã bị mất và được gửi lại.
5. **Kiểm soát lưu lượng** : Mỗi bên của kết nối TCP đều có một không gian đệm có kích thước cố định. Bên nhận của TCP chỉ cho phép bên gửi gửi dữ liệu mà bên nhận có thể chứa. Khi bên nhận không xử lý kịp dữ liệu từ bên gửi, nó có thể thông báo cho bên gửi giảm tốc độ gửi để tránh mất gói tin. Giao thức kiểm soát lưu lượng mà TCP sử dụng là giao thức cửa sổ trượt có kích thước thay đổi (TCP sử dụng cửa sổ trượt để kiểm soát lưu lượng).
6. **Kiểm soát tắc nghẽn** : Khi mạng quá tải, giảm tốc độ gửi dữ liệu.

## Làm thế nào TCP thực hiện điều khiển lưu lượng?

**TCP sử dụng cửa sổ trượt để thực hiện điều khiển lưu lượng. Điều khiển lưu lượng nhằm kiểm soát tốc độ gửi của bên gửi để đảm bảo bên nhận kịp thời nhận được dữ liệu.** Trường `window` trong các gói ACK được gửi từ bên nhận có thể được sử dụng để điều khiển kích thước cửa sổ của bên gửi, từ đó ảnh hưởng đến tốc độ gửi của bên gửi. Khi trường `window` được đặt thành 0, bên gửi không thể gửi dữ liệu.

**Tại sao cần điều khiển lưu lượng?** Điều này là vì tốc độ gửi của bên gửi và tốc độ nhận của bên nhận không nhất thiết phải bằng nhau trong quá trình truyền thông. Nếu tốc độ gửi của bên gửi quá nhanh, bên nhận có thể không xử lý kịp. Nếu bên nhận không xử lý kịp, dữ liệu không thể nhận được sẽ được lưu trữ trong **bộ đệm nhận (Receiving Buffers)** (các gói tin không tuân thủ thứ tự cũng được lưu trữ trong bộ đệm). Nếu bộ đệm đầy và bên gửi vẫn tiếp tục gửi dữ liệu, bên nhận sẽ phải loại bỏ các gói tin nhận được. Điều này dẫn đến việc mất gói tin và lãng phí tài nguyên mạng quý giá. Do đó, chúng ta cần kiểm soát tốc độ gửi của bên gửi để duy trì một cân bằng động giữa bên nhận và bên gửi.

Điều cần lưu ý ở đây (một hiểu lầm phổ biến):

- Bên gửi không đồng nghĩa với khách hàng (client).
- Bên nhận không đồng nghĩa với máy chủ (server).

TCP là giao thức truyền thông hai chiều (Full-Duplex, FDX), hai bên có thể truyền thông hai chiều, khách hàng và máy chủ đều có thể là bên gửi và bên nhận. Do đó, mỗi bên có một bộ đệm gửi và một bộ đệm nhận, và mỗi bên duy trì một cửa sổ gửi và một cửa sổ nhận. Kích thước cửa sổ nhận phụ thuộc vào hạn chế của ứng dụng, hệ thống và phần cứng (tốc độ truyền TCP không thể vượt quá tốc độ xử lý dữ liệu của ứng dụng). Yêu cầu kích thước cửa sổ gửi và cửa sổ nhận của cả hai bên là giống nhau.

**Cửa sổ gửi TCP có thể được chia thành bốn phần**:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230918140244.png)

1. Các đoạn TCP đã gửi và đã xác nhận (đã gửi và đã xác nhận) (xanh dương).
2. Các đoạn TCP đã gửi nhưng chưa được xác nhận (đã gửi nhưng chưa xác nhận) (vàng).
3. Các đoạn TCP chưa được gửi nhưng bên nhận đã sẵn sàng nhận (có thể gửi) (xanh lá).
4. Các đoạn TCP chưa được gửi và bên nhận không sẵn sàng nhận (không thể gửi) (xám).

**Biểu đồ cửa sổ gửi TCP**

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230918140601.png)

- **SND.WND**: Cửa sổ gửi.
- **SND.UNA**: Con trỏ Send Unacknowledged, trỏ đến byte đầu tiên trong cửa sổ gửi.
- **SND.NXT**: Con trỏ Send Next, trỏ đến byte đầu tiên trong cửa sổ có thể sử dụng.

**Kích thước cửa sổ có thể sử dụng** = `SND.UNA + SND.WND - SND.NXT`.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230918140653.png)

**Cửa sổ nhận TCP có thể chia thành ba phần**:

1. Các đoạn TCP đã nhận và đã xác nhận (đã nhận và đã xác nhận).
2. Các đoạn TCP đang chờ nhận và cho phép bên gửi gửi đoạn TCP (có thể nhận nhưng chưa xác nhận).
3. Các đoạn TCP không thể nhận và không cho phép bên gửi gửi đoạn TCP (không thể nhận).

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230918140751.png)

**Kích thước cửa sổ nhận được điều chỉnh động dựa trên tốc độ xử lý dữ liệu của bên nhận.** Nếu bên nhận đọc dữ liệu nhanh, cửa sổ nhận có thể mở rộng. Nếu không, nó có thể thu hẹp.

Lưu ý rằng kích thước cửa sổ trượt chỉ được sử dụng để minh họa, kích thước cửa sổ thực tế thường lớn hơn nhiều so với giá trị này.

## Kiểm soát tắc nghẽn TCP được triển khai như thế nào?

Trong một khoảng thời gian nào đó, nếu nhu cầu về một tài nguyên trong mạng vượt quá phần tài nguyên có sẵn mà tài nguyên đó có thể cung cấp, hiệu suất của mạng sẽ bị giảm. Tình trạng này được gọi là tắc nghẽn. Kiểm soát tắc nghẽn nhằm ngăn chặn việc tiến hành quá nhiều dữ liệu vào mạng, từ đó giúp các bộ định tuyến hoặc liên kết trong mạng không bị quá tải. Kiểm soát tắc nghẽn phải đảm bảo mạng có thể chịu được tải trọng mạng hiện tại. Kiểm soát tắc nghẽn là quá trình toàn cầu, liên quan đến tất cả các máy chủ, tất cả các bộ định tuyến và tất cả các yếu tố liên quan đến giảm hiệu suất truyền thông mạng. Ngược lại, kiểm soát lưu lượng thường là việc kiểm soát lượng truyền thông điểm-điểm, là một vấn đề từ đầu đến cuối. Kiểm soát lưu lượng nhằm kiềm chế tốc độ gửi dữ liệu từ bên gửi để đảm bảo bên nhận có thể kịp thời nhận được.

![Pasted image 20230526003335](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%2520image%252020230526003335.png)

Để thực hiện kiểm soát tắc nghẽn, bên gửi TCP phải duy trì một biến trạng thái gọi là **cửa sổ tắc nghẽn (cwnd)**. Kích thước của cửa sổ tắc nghẽn phụ thuộc vào mức độ tắc nghẽn của mạng và thay đổi động. Bên gửi chọn kích thước cửa sổ gửi là giá trị nhỏ nhất giữa cửa sổ tắc nghẽn và cửa sổ nhận của bên nhận.

TCP sử dụng bốn thuật toán kiểm soát tắc nghẽn, gồm **khởi đầu chậm**, **tránh tắc nghẽn**, **nhận dữ liệu nhanh** và **phục hồi nhanh**. Ở tầng mạng, cũng có thể sử dụng các chiến lược loại bỏ gói tin phù hợp trên bộ định tuyến (như quản lý hàng đợi chủ động AQM) để giảm thiểu tắc nghẽn mạng.

- **Khởi đầu chậm (slow start):** Thuật toán khởi đầu chậm có ý tưởng là khi máy chủ bắt đầu gửi dữ liệu, nếu ngay lập tức tiến hành truyền lượng lớn byte dữ liệu vào mạng, có thể gây tắc nghẽn mạng vì chưa biết được tình trạng của mạng. Kinh nghiệm cho thấy, phương pháp tốt hơn là tiến hành khám phá, tức là tăng kích thước cửa sổ gửi từ nhỏ đến lớn, cũng chính là tăng giá trị cửa sổ tắc nghẽn từ nhỏ đến lớn. Giá trị ban đầu của cwnd là 1, và sau mỗi vòng truyền thông, cwnd được tăng gấp đôi.
- **Tránh tắc nghẽn (congestion avoidance):** Thuật toán tránh tắc nghẽn cho phép cwnd tăng chậm, cụ thể là tăng thêm 1 sau mỗi 1 RTT.
- **Truyền lại nhanh và phục hồi nhanh:** Trong TCP/IP, fast retransmit and recovery (FRR) là một thuật toán kiểm soát tắc nghẽn cho phép khôi phục nhanh các gói tin bị mất. Nếu không có FRR, khi một gói tin bị mất, TCP sẽ sử dụng bộ hẹn giờ để yêu cầu tạm dừng truyền. Trong thời gian này, không có gói tin mới hoặc gói tin đã được sao chép được gửi đi. Với FRR, nếu bên nhận nhận được một đoạn dữ liệu không theo thứ tự, nó sẽ ngay lập tức gửi một xác nhận lặp lại cho bên gửi. Nếu bên gửi nhận được ba xác nhận lặp lại, nó sẽ cho rằng các đoạn dữ liệu được chỉ định đã bị mất và ngay lập tức gửi lại các đoạn dữ liệu bị mất đó. Với FRR, không có sự trì hoãn do yêu cầu tạm dừng trong quá trình gửi lại. FRR hoạt động hiệu quả nhất khi chỉ có một gói tin duy nhất bị mất. Khi nhiều gói tin dữ liệu bị mất trong một khoảng thời gian ngắn, FRR không hoạt động hiệu quả.

## Bạn có hiểu về giao thức ARQ không?

Giao thức ARQ (Automatic Repeat-reQuest) là một trong những giao thức sửa lỗi trong lớp liên kết dữ liệu và lớp truyền dữ liệu trong mô hình OSI. Nó sử dụng hai cơ chế là xác nhận và thời gian chờ để đảm bảo truyền thông tin đáng tin cậy trên dịch vụ không đáng tin cậy. Nếu bên gửi không nhận được xác nhận trong một khoảng thời gian sau khi gửi, thì thường sẽ gửi lại cho đến khi nhận được xác nhận hoặc vượt quá số lần thử lại cho phép.

ARQ bao gồm hai loại giao thức: ARQ dừng và chờ (Stop-and-Wait ARQ) và ARQ liên tục (Continuous ARQ).

### Giao thức Stop-and-Wait ARQ

Giao thức dừng và chờ được thiết kế để đảm bảo truyền thông tin đáng tin cậy. Nguyên tắc cơ bản của nó là sau khi gửi một frame dữ liệu, bên gửi sẽ dừng gửi và chờ xác nhận (ACK) từ bên nhận. Nếu sau một khoảng thời gian (thời gian chờ) vẫn không nhận được ACK, bên gửi sẽ cho rằng khung dữ liệu đã bị mất và gửi lại. Trong giao thức ARQ dừng và chờ, nếu bên nhận nhận được một khung dữ liệu trùng lặp, nó sẽ từ chối nó nhưng vẫn gửi ACK.

**1) Trường hợp không có lỗi:**

Bên gửi gửi một khung dữ liệu, bên nhận nhận được trong khoảng thời gian quy định và gửi lại ACK. Bên gửi tiếp tục gửi.

**2) Trường hợp có lỗi (gửi lại sau thời gian chờ):**

Trong giao thức ARQ dừng và chờ, nếu sau một khoảng thời gian vẫn không nhận được ACK, bên gửi sẽ cho rằng khung dữ liệu đã bị mất và gửi lại khung dữ liệu đã gửi trước đó (giả sử khung dữ liệu bị mất). Do đó, sau khi gửi mỗi khung dữ liệu, bên gửi cần thiết lập một bộ đếm thời gian chờ, thời gian này nên dài hơn thời gian trung bình để truyền khung dữ liệu qua mạng. Cách tự động gửi lại này thường được gọi là ARQ tự động (ARQ).

**3) Mất ACK và ACK trễ**

- **Mất ACK:** ACK bị mất trong quá trình truyền. Khi A gửi thông điệp M1, B nhận được và gửi lại ACK M1, nhưng ACK bị mất trong quá trình truyền. A không biết điều này, sau khi hết thời gian chờ, A gửi lại M1, B nhận được lần thứ hai và thực hiện hai biện pháp sau: 1. Loại bỏ thông điệp M1 trùng lặp này và không gửi lên tầng trên. 2. Gửi lại ACK cho A. (Không xem như đã gửi trước đó, vì A có thể gửi lại, chứng tỏ ACK của B bị mất).
- **ACK trễ:** ACK trễ trong quá trình truyền. A gửi M1, B nhận và gửi ACK. Trong thời gian chờ, A gửi lại M1, B vẫn nhận và tiếp tục gửi ACK (B nhận được 2 bản M1). Lúc này, A nhận được ACK lần thứ hai từ B. Xử lý như sau: 1. A nhận được ACK trùng lặp, loại bỏ nó. 2. B nhận được M1 trùng lặp, loại bỏ M1 trùng lặp này.

### Giao thức Continuous ARQ

Giao thức Continuous ARQ cho phép tăng hiệu suất sử dụng kênh truyền. Bên gửi duy trì một cửa sổ gửi, mọi khối dữ liệu nằm trong cửa sổ gửi có thể được gửi liên tiếp mà không cần chờ xác nhận từ bên nhận. Bên nhận thường sử dụng xác nhận tích lũy, chỉ gửi xác nhận cho khối dữ liệu cuối cùng đến mà nó nhận được theo thứ tự, cho biết tất cả các khối dữ liệu đến trước đó đã được nhận đúng.

**Ưu điểm:** Tỷ lệ sử dụng kênh cao, dễ triển khai, ngay cả khi xác nhận bị mất, không cần phải gửi lại.

**Nhược điểm:** Không thể phản ánh cho bên gửi tất cả các khối dữ liệu đã nhận đúng. Ví dụ: Bên gửi gửi 5 tin nhắn, tin nhắn thứ ba bị mất (số 3), lúc này bên nhận chỉ có thể xác nhận cho hai tin nhắn đầu tiên. Bên gửi không biết được số phận của ba tin nhắn còn lại và buộc phải gửi lại tất cả ba tin nhắn đó một lần nữa. Điều này còn được gọi là Go-Back-N (quay lại N), cho biết cần quay lại và gửi lại N tin nhắn đã gửi trước đó.
