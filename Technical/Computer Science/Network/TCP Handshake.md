---
title: TCP Handshake
tags:
  - network
  - computer-science
  - interview
categories: network, computer-science
date created: 2023-09-18
date modified: 2023-09-18
---

# Bắt tay ba bước và bốn bước TCP (tầng vận chuyển)

Để truyền dữ liệu đến đích một cách chính xác và không lỗi, giao thức TCP sử dụng chiến lược bắt tay ba bước.

## Thiết lập kết nối - bắt tay ba bước TCP

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230708004358.png)

Để thiết lập một kết nối TCP, cần phải có "bắt tay ba bước", không thể thiếu bất kỳ bước nào:

- **Bước bắt tay lần 1**: Máy khách gửi một gói tin có cờ SYN (SEQ=x) -> Máy chủ, sau đó máy khách chuyển sang trạng thái **SYN_SEND**, chờ xác nhận từ máy chủ.
- **Bước bắt tay lần 2**: Máy chủ gửi một gói tin có cờ SYN+ACK (SEQ=y, ACK=x+1) -> Máy khách, sau đó máy chủ chuyển sang trạng thái **SYN_RECV**.
- **Bước bắt tay lần 3**: Máy khách gửi một gói tin có cờ ACK (ACK=y+1) -> Máy chủ, sau đó cả máy khách và máy chủ đều chuyển sang trạng thái **ESTABLISHED**, hoàn tất bắt tay ba bước TCP.

Sau khi hoàn tất bắt tay ba bước, máy khách và máy chủ có thể truyền dữ liệu!

### Tại sao cần bắt tay ba bước ?

Mục đích của bắt tay ba bước là thiết lập một kênh truyền thông tin đáng tin cậy, nói đơn giản là xác nhận rằng cả hai bên đều có khả năng gửi và nhận thông tin một cách bình thường.

1. **Bước bắt tay lần 1**: Máy khách không thể xác nhận bất kỳ điều gì; Máy chủ xác nhận rằng gửi và nhận từ phía đối tác đều bình thường.
2. **Bước bắt tay lần 2**: Máy khách xác nhận: gửi và nhận từ phía mình đều bình thường, gửi và nhận từ phía đối tác đều bình thường; Máy chủ xác nhận: gửi từ phía đối tác đều bình thường, nhận từ phía mình đều bình thường.
3. **Bước bắt tay lần 3**: Máy khách xác nhận: gửi và nhận từ phía mình đều bình thường, gửi và nhận từ phía đối tác đều bình thường; Máy chủ xác nhận: gửi và nhận từ phía mình đều bình thường, gửi và nhận từ phía đối tác đều bình thường.

Bắt tay ba bước đảm bảo cả hai bên đều có khả năng gửi và nhận thông tin một cách bình thường, không thể thiếu bất kỳ bước nào.

### Tại sao trong bước bắt tay lần 2, cần gửi lại SYN?

Máy chủ gửi lại ACK để thông báo cho máy khách rằng "Tôi đã nhận được tín hiệu mà bạn đã gửi", điều này cho thấy việc truyền thông từ máy khách đến máy chủ là bình thường. Gửi lại SYN để thiết lập và xác nhận việc truyền thông từ máy chủ đến máy khách.

> SYN (Synchronize Sequence Numbers) là tín hiệu bắt tay được sử dụng trong quá trình thiết lập kết nối TCP/IP. Khi thiết lập một kết nối mạng TCP đáng tin cậy giữa máy khách và máy chủ, máy khách gửi một thông điệp SYN, máy chủ sử dụng SYN-ACK để trả lời, sau đó máy khách sẽ gửi một thông điệp ACK. Điều này cho phép máy khách và máy chủ thiết lập kết nối TCP đáng tin cậy và cho phép truyền dữ liệu giữa máy khách và máy chủ.

## Ngắt kết nối - Bắt tay bốn bước TCP

![Pasted image 20230525232625](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230525232625.png)

Để ngắt một kết nối TCP, cần phải có "bắt tay bốn bước", không thể thiếu bất kỳ bước nào:

1. **Bước bắt tay lần 1**: Máy khách gửi một gói tin có cờ FIN (SEQ=x) -> Máy chủ, để đóng kết nối truyền dữ liệu từ máy khách đến máy chủ. Sau đó, máy khách chuyển sang trạng thái **FIN-WAIT-1**.
2. **Bước bắt tay lần 2**: Máy chủ nhận được gói tin có cờ FIN (SEQ=X) này, nó gửi một gói tin có cờ ACK (ACK=x+1) -> Máy khách. Sau đó, máy chủ chuyển sang trạng thái **CLOSE-WAIT**, máy khách chuyển sang trạng thái **FIN-WAIT-2**.
3. **Bước bắt tay lần 3**: Máy chủ gửi một gói tin có cờ FIN (SEQ=y) -> Máy khách, yêu cầu đóng kết nối. Sau đó, máy chủ chuyển sang trạng thái **LAST-ACK**.
4. **Bước bắt tay lần 4**: Máy khách gửi một gói tin có cờ ACK (ACK=y+1) -> Máy chủ, sau đó máy khách chuyển sang trạng thái **TIME-WAIT**. Nếu máy khách không nhận được phản hồi sau 2MSL, chứng tỏ máy chủ đã đóng kết nối một cách bình thường, sau đó máy khách cũng có thể đóng kết nối.

**Chỉ cần bắt tay bốn bước chưa kết thúc, máy khách và máy chủ vẫn có thể tiếp tục truyền dữ liệu!**

### Tại sao cần bắt tay bốn bước?

TCP là giao thức truyền thông hai chiều, có thể truyền dữ liệu theo cả hai hướng. Bất kỳ bên nào cũng có thể gửi một thông báo giải phóng kết nối sau khi truyền dữ liệu xong, khi đối tác xác nhận sau đó chuyển sang trạng thái bán đóng. Khi bên kia cũng không còn gửi dữ liệu nữa, nó sẽ gửi một thông báo giải phóng kết nối, sau khi đối tác xác nhận thì kết nối TCP sẽ hoàn toàn đóng.

Ví dụ: A và B đang nói chuyện điện thoại, cuộc trò chuyện sắp kết thúc.

1. **Bước bắt tay lần 1**: A nói "Tôi không còn gì để nói nữa"
2. **Bước bắt tay lần 2**: B trả lời "Tôi hiểu rồi", nhưng B có thể còn muốn nói một vài điều, A không thể yêu cầu B kết thúc cuộc trò chuyện theo nhịp của mình
3. **Bước bắt tay lần 3**: Vì vậy, B có thể tiếp tục nói một vài điều, cuối cùng B nói "Tôi đã nói xong"
4. **Bước bắt tay lần 4**: A trả lời "Tôi hiểu rồi", cuộc trò chuyện mới kết thúc.

### Tại sao không thể kết hợp ACK và FIN của máy chủ trong bước bắt tay lần 2 để trở thành ba bước bắt tay?

Vì máy chủ có thể nhận được yêu cầu ngắt kết nối từ máy khách khi vẫn còn một số dữ liệu chưa gửi xong, do đó, máy chủ trả lời ACK để xác nhận yêu cầu ngắt kết nối. Sau khi gửi xong dữ liệu, máy chủ mới gửi FIN để ngắt kết nối từ máy chủ đến máy khách.

### Nếu ACK của máy khách trong bước bắt tay lần 2 không được gửi đến máy chủ, điều gì sẽ xảy ra?

Nếu máy khách không nhận được xác nhận ACK, nó sẽ gửi lại yêu cầu FIN.

### Tại sao máy khách cần chờ 2\*MSL (tuổi thọ gói tin tối đa) trước khi chuyển sang trạng thái CLOSED trong bước bắt tay lần 4?

Trong bước bắt tay lần 4, máy khách gửi ACK cho máy chủ, có thể xảy ra trường hợp ACK bị mất. Nếu máy chủ không nhận được ACK, nó sẽ gửi lại FIN. Nếu máy khách nhận được FIN trong khoảng thời gian 2\*MSL, nó sẽ gửi lại ACK và chờ thêm 2MSL nữa, để đảm bảo rằng máy chủ đã nhận được ACK và kết thúc kết nối TCP một cách bình thường.

> **MSL (Maximum Segment Lifetime)**: Thời gian sống tối đa của một đoạn trong mạng, 2MSL là thời gian tối đa cần thiết cho một gửi và một phản hồi. Nếu sau 2MSL, máy khách vẫn không nhận được FIN, máy khách sẽ cho rằng ACK đã được nhận thành công, sau đó kết thúc kết nối TCP.
