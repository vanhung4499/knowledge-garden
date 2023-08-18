---
title: Network Interview Part 4
tags: [network, interview]
categories: [network, interview]
date created: 2023-08-18
date modified: 2023-08-18
---

# Network Interview Q&A Part 4

## Liên quan đến quá trình bắt tay bốn bước

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230818225152.png)

Để thiết lập một kết nối, cần ba bước bắt tay, trong khi để kết thúc một kết nối, cần bốn bước chấm dứt (có thể gọi là bốn bước bắt tay). Điều này là do TCP có khả năng **đóng một phía của kết nối sau khi kết thúc việc gửi dữ liệu**.

Việc hủy bỏ kết nối TCP đòi hỏi gửi bốn gói tin, do đó được gọi là bốn bước chấm dứt (Four-way handshake), cả khách hàng và máy chủ đều có thể khởi xướng hành động chấm dứt.

### Câu trả lời thứ nhất

Ban đầu, cả khách hàng và máy chủ đều ở trạng thái ESTABLISHED, giả sử khách hàng khởi tạo yêu cầu đóng kết nối. Quá trình bốn bước chấm dứt diễn ra như sau:

- Bước chấm dứt thứ nhất: Khách hàng gửi một gói tin FIN, gói tin này sẽ chỉ định một số thứ tự. Lúc này, khách hàng ở trạng thái FIN_WAIT1. Gói tin này được gửi để **gửi thông báo giải phóng kết nối** (FIN = 1, số thứ tự seq = u), và dừng việc gửi dữ liệu, đóng kết nối TCP một cách chủ động, chuyển sang trạng thái FIN_WAIT1 (chờ giải phóng 1), chờ xác nhận từ máy chủ.
- Bước chấm dứt thứ hai: Sau khi nhận được FIN từ khách hàng, máy chủ sẽ gửi gói tin ACK và tăng giá trị số thứ tự của khách hàng lên 1 để làm số thứ tự của gói tin ACK, cho biết đã nhận được gói tin từ khách hàng. Lúc này, máy chủ ở trạng thái CLOSE_WAIT. Gói tin này được gửi để **gửi thông báo xác nhận** (ACK = 1, số thứ tự seq = v, số xác nhận ack = u + 1), máy chủ chuyển sang trạng thái CLOSE_WAIT (chờ đóng), TCP ở trạng thái bán đóng, giữa khách hàng và máy chủ. Khi khách hàng nhận được xác nhận từ máy chủ, nó chuyển sang trạng thái FIN_WAIT2 (chờ giải phóng 2), chờ gói tin giải phóng kết nối từ máy chủ.
- Bước chấm dứt thứ ba: Nếu máy chủ cũng muốn đóng kết nối, giống như yêu cầu đóng kết nối của khách hàng lần đầu, nó gửi gói tin FIN và chỉ định một số thứ tự. Lúc này, máy chủ ở trạng thái LAST_ACK. Gói tin này được gửi để **gửi thông báo giải phóng kết nối** (FIN = 1, ACK = 1, số thứ tự seq = w, số xác nhận ack = u + 1), máy chủ chuyển sang trạng thái LAST_ACK (xác nhận cuối cùng), chờ xác nhận từ khách hàng.
- Bước chấm dứt thứ tư: Khi khách hàng nhận được FIN từ máy chủ, nó gửi một gói tin ACK làm phản hồi và tăng giá trị số thứ tự của máy chủ lên 1 để làm số xác nhận của gói tin ACK của chính mình, lúc này khách hàng ở trạng thái TIME_WAIT. Cần một khoảng thời gian để đảm bảo rằng máy chủ đã nhận được gói tin ACK của khách hàng trước khi nó chuyển sang trạng thái CLOSED, máy chủ nhận được gói tin ACK từ khách hàng, nó chuyển sang trạng thái CLOSED, khách hàng cũng chuyển sang trạng thái CLOSED sau một khoảng thời gian chờ 2MSL.

Nhận một gói tin FIN chỉ định rằng không có luồng dữ liệu diễn ra trong hướng đó. **Việc khách hàng thực hiện chấm dứt và chuyển sang trạng thái TIME_WAIT là bình thường, máy chủ thường thực hiện chấm dứt theo cách bị động, không chuyển sang trạng thái TIME_WAIT**.

### Câu trả lời thứ hai

- **Trạng thái khởi tạo**: Cả khách hàng và máy chủ đều ở trạng thái kết nối, tiếp theo là bắt đầu thực hiện bốn bước chấm dứt để đóng kết nối.
- **Bước chấm dứt thứ nhất**: Bất kỳ bên nào cũng có thể khởi xướng bước chấm dứt đầu tiên, vì TCP là full-duplex.

> Nếu khách hàng đã gửi dữ liệu và đã gửi xong, gửi FIN = 1 **cho biết cho máy chủ rằng khách hàng đã gửi xong tất cả dữ liệu của mình**, **máy chủ, bạn có thể đóng kết nối nhận dữ liệu**, nhưng nếu máy chủ có dữ liệu muốn gửi cho khách hàng, khách hàng vẫn có thể nhận được. Lúc này, khách hàng ở trạng thái chờ xác nhận FIN = 1 từ máy chủ.

- **Bước chấm dứt thứ hai**: Sau khi nhận được FIN từ khách hàng, máy chủ biết rằng khách hàng không có dữ liệu để gửi nữa, **sau đó máy chủ gửi ACK = 1 để thông báo cho khách hàng rằng đã nhận được gói tin từ khách hàng**. Lúc này, máy chủ ở trạng thái CLOSE_WAIT. (Máy chủ trả lời trước cho khách hàng, tôi đã biết, nhưng máy chủ sẽ có thể gửi dữ liệu, vì vậy bước thứ ba đến.)
- **Bước chấm dứt thứ ba**: Lúc này, nếu máy chủ cũng muốn đóng kết nối, tương tự như yêu cầu đóng kết nối của khách hàng lần đầu, nó gửi FIN và chỉ định một số thứ tự. Lúc này, máy chủ ở trạng thái LAST_ACK. Gói tin này được gửi để **gửi thông báo giải phóng kết nối** (FIN = 1, ACK = 1, số thứ tự seq = w, số xác nhận ack = u + 1), máy chủ chuyển sang trạng thái LAST_ACK (xác nhận cuối cùng), chờ xác nhận từ khách hàng.
- **Bước chấm dứt thứ tư**: Khi khách hàng nhận được FIN từ máy chủ, nó gửi một gói tin ACK làm phản hồi và tăng giá trị số thứ tự của máy chủ lên 1 để làm số xác nhận của gói tin ACK của chính mình, lúc này khách hàng ở trạng thái TIME_WAIT. Cần một khoảng thời gian để đảm bảo rằng máy chủ đã nhận được gói tin ACK của khách hàng trước khi nó chuyển sang trạng thái CLOSED, máy chủ nhận được gói tin ACK từ khách hàng, nó chuyển sang trạng thái CLOSED, khách hàng cũng chuyển sang trạng thái CLOSED sau một khoảng thời gian chờ 2MSL.

## Tại sao cần bốn bước chấm dứt?

### Câu trả lời thứ nhất

Bởi vì khi máy chủ nhận được gói tin FIN từ khách hàng, nó có thể không đóng SOCKET ngay lập tức, vì vậy chỉ có thể trả lời bằng một gói tin ACK, thông báo cho khách hàng rằng "tôi đã nhận được gói tin FIN của bạn". Chỉ khi tất cả các gói tin của máy chủ đã được gửi đi, nó mới có thể gửi gói tin FIN, do đó không thể gửi cùng một lúc. Do đó, cần bốn bước chấm dứt.

### Câu trả lời thứ hai

Bất kỳ bên nào cũng có thể gửi thông báo chấm dứt sau khi truyền dữ liệu xong, sau khi đối phương xác nhận, nó sẽ chuyển sang trạng thái bán đóng. Khi cả hai bên đều không còn dữ liệu để gửi, họ sẽ gửi thông báo chấm dứt và kết thúc kết nối TCP hoàn toàn. Ví dụ: A và B đang nói chuyện qua điện thoại, trước khi kết thúc cuộc trò chuyện, A nói "Tôi không còn gì để nói nữa", B trả lời "Tôi hiểu rồi", nhưng B có thể vẫn có điều muốn nói, A không thể yêu cầu B kết thúc cuộc trò chuyện theo nhịp của mình, sau đó B có thể nói một lúc, cuối cùng B nói "Tôi đã nói xong", A trả lời "Tôi hiểu rồi", cuộc trò chuyện mới kết thúc.

## Trạng thái TIME_WAIT và 2MSL là gì?

Trạng thái TIME_WAIT còn được gọi là trạng thái chờ 2MSL. Mỗi hiện thực cụ thể của TCP phải chọn một thời gian sống tối đa cho các đoạn tin (MSL - Maximum Segment Lifetime), đây là thời gian tối đa mà một đoạn tin có thể tồn tại trong mạng trước khi bị loại bỏ. Thời gian này là hạn chế vì các đoạn tin TCP được truyền qua gói tin IP trong mạng, và gói tin IP có một trường TTL (Time To Live) để giới hạn thời gian sống của nó.

Đối với một giá trị MSL cụ thể được cho bởi hiện thực TCP, nguyên tắc xử lý là: khi TCP thực hiện đóng kết nối một cách chủ động và gửi lại ACK cuối cùng, kết nối đó phải ở trạng thái TIME_WAIT trong một khoảng thời gian là gấp đôi MSL. Điều này cho phép TCP gửi lại ACK cuối cùng nếu ACK này bị mất (phía đối tác gửi lại FIN cuối cùng sau khi quá thời gian chờ).

Kết quả khác của việc chờ 2MSL là trong thời gian chờ này, cặp cổng (địa chỉ IP và số cổng của khách hàng và máy chủ) xác định kết nối không thể được sử dụng. Kết nối này chỉ có thể được sử dụng sau khi 2MSL kết thúc.

## Khi giải phóng kết nối bằng bắt tay bốn bước , ý nghĩa của việc chờ 2MSL là gì?

> **MSL** là viết tắt của Maximum Segment Lifetime, có thể dịch là "Tuổi thọ tối đa của đoạn tin", đây là thời gian tối đa mà một đoạn tin có thể tồn tại trên mạng trước khi bị loại bỏ.

Việc chờ 2MSL là để đảm bảo rằng gói tin ACK cuối cùng mà khách hàng gửi có thể đến được máy chủ. Bởi vì ACK này có thể bị mất, dẫn đến máy chủ đang ở trạng thái LAST-ACK không nhận được xác nhận cho FIN-ACK đã gửi. Máy chủ sẽ gửi lại FIN-ACK này sau khi quá thời gian chờ, sau đó khách hàng sẽ gửi lại một lần xác nhận, khởi động lại bộ đếm thời gian chờ 2MSL. Cuối cùng, cả khách hàng và máy chủ đều có thể đóng kết nối một cách bình thường. Giả sử khách hàng không chờ 2MSL mà đóng kết nối ngay sau khi gửi ACK, nếu ACK này bị mất, máy chủ sẽ không nhận được FIN-ACK gửi lại và sẽ không gửi xác nhận lần thứ hai, do đó máy chủ không thể đóng kết nối một cách bình thường.

### Hai lý do

1. Đảm bảo gói tin ACK cuối cùng mà khách hàng gửi có thể đến được máy chủ. ACK này có thể bị mất, khiến máy chủ ở trạng thái LAST-ACK không nhận được xác nhận cho FIN+ACK đã gửi. Máy chủ sẽ gửi lại FIN+ACK này sau khi quá thời gian chờ, và khách hàng có thể nhận được FIN+ACK gửi lại này trong khoảng thời gian chờ 2MSL, sau đó khách hàng gửi lại một lần xác nhận, khởi động lại bộ đếm thời gian chờ 2MSL. Cuối cùng, cả khách hàng và máy chủ đều có thể vào trạng thái CLOSED. Nếu khách hàng không chờ 2MSL và đóng kết nối ngay sau khi gửi ACK, nếu ACK này bị mất, máy chủ sẽ không nhận được FIN+ACK gửi lại và sẽ không gửi lại xác nhận, do đó máy chủ không thể vào trạng thái CLOSED một cách bình thường.
2. Ngăn chặn "đoạn tin yêu cầu kết nối đã hết hiệu lực" xuất hiện trong kết nối hiện tại. Sau khi khách hàng gửi ACK cuối cùng, trong 2MSL, tất cả các đoạn tin được tạo ra trong thời gian tồn tại của kết nối sẽ biến mất khỏi mạng, ngăn chặn đoạn tin yêu cầu kết nối cũ xuất hiện trong kết nối mới.

## Tại sao trạng thái TIME_WAIT cần mất 2MSL để quay trở lại trạng thái CLOSE?

### Câu trả lời thứ nhất

Lý thuyết, sau khi gửi 4 đoạn tin, kết nối có thể trực tiếp chuyển sang trạng thái CLOSE. Tuy nhiên, mạng có thể không đáng tin cậy và có thể mất ACK cuối cùng. Do đó, **trạng thái TIME_WAIT được sử dụng để gửi lại ACK có thể bị mất**.

### Câu trả lời thứ hai

Trong trường hợp như sau, ACK = 1 cuối cùng mà khách hàng gửi đến máy chủ **bị mất** và máy chủ không nhận được. Máy chủ sẽ nghĩ gì? Tôi đã gửi xong dữ liệu rồi, tại sao khách hàng không phản hồi? Có phải nó bị mất giữa chừng không? Sau đó, máy chủ sẽ gửi lại yêu cầu đóng kết nối, một vòng tròn là 2MSL.

ACK = 1 mà khách hàng gửi bị mất, **máy chủ chờ 1MSL mà không nhận được**, **sau đó gửi lại yêu cầu đóng kết nối mất 1MSL**. Nếu nhận được tin nhắn từ máy chủ lần nữa, **đồng hồ 2MSL được khởi động lại**, **gửi yêu cầu xác nhận**. Khách hàng chỉ cần chờ 2MSL, nếu không nhận được tin nhắn từ máy chủ lần nữa, có nghĩa là máy chủ đã nhận được xác nhận của khách hàng; lúc này cả hai bên đều đóng kết nối và quá trình chia tay TCP 4 bước hoàn tất.

## Vấn đề gắn kết TCP là gì? Bạn sẽ làm thế nào để giải quyết nó?

**Vấn đề gắn kết TCP** là khi người gửi gửi nhiều gói dữ liệu đến người nhận, nhưng khi nhận, các gói dữ liệu này lại được gắn kết thành một gói duy nhất. Từ góc nhìn của bộ đệm nhận, phần đầu của gói dữ liệu sau cùng kết nối chặt chẽ với phần cuối của gói dữ liệu trước đó.

- Vấn đề gắn kết TCP có thể xảy ra do việc tái sử dụng kết nối TCP.
- Vấn đề này cũng có thể do việc sử dụng thuật toán Nagle mặc định của TCP gây ra.
  - Chỉ khi gói trước đó được xác nhận, gói tiếp theo mới được gửi đi;
  - Gom nhiều gói nhỏ lại và gửi cùng một lúc khi có một xác nhận đến.

**Giải quyết**:

1. Vấn đề do thuật toán Nagle gây ra, cần tắt thuật toán này trong một số trường hợp cụ thể.
2. Đánh dấu kết thúc gói dữ liệu. Sử dụng một ký tự đặc biệt hoặc một chuỗi ký tự để đánh dấu ranh giới giữa các gói dữ liệu, ví dụ như \n\r, \t, hoặc một số ký tự ẩn khác.
3. Nhận dữ liệu theo từng phần. Thêm thông tin về độ dài dữ liệu vào phần đầu của gói tin TCP.
4. Gửi dữ liệu với độ dài cố định. Gửi dữ liệu từ lớp ứng dụng với độ dài cố định, giúp giải quyết vấn đề gắn kết TCP.

## Trong mô hình OSI bao gồm 7 tầng, chức năng của tầng biểu diễn và tầng phiên là gì?

- Tầng biểu diễn: Mã hóa và giải mã hình ảnh, video, mã hóa dữ liệu.
    
- Tầng phiên: Thiết lập phiên làm việc, như xác thực phiên, tiếp tục truyền dữ liệu sau khi bị gián đoạn.

## Đối với mã hóa đối xứng, ưu điểm và nhược điểm là gì?

Mã hóa đối xứng (Symmetric-Key Encryption) sử dụng cùng một khóa để mã hóa và giải mã.

- Ưu điểm: Tốc độ xử lý nhanh.
- Nhược điểm: Không thể truyền khóa một cách an toàn cho bên giao tiếp.

## Bạn có hiểu về mã hóa không đối xứng? Ưu điểm và nhược điểm là gì?

Mã hóa không đối xứng, còn được gọi là mã hóa khóa công khai (Public-Key Encryption), sử dụng hai khóa khác nhau để mã hóa và giải mã.

Khóa công khai có thể được công khai cho mọi người, **sau khi bên gửi nhận được khóa công khai của bên nhận, bên gửi có thể sử dụng khóa công khai để mã hóa**, **bên nhận sau khi nhận được nội dung giao tiếp sẽ sử dụng khóa riêng để giải mã**.

Ngoài việc sử dụng để mã hóa, khóa không đối xứng còn được sử dụng để tạo chữ ký. Vì khóa riêng không thể được lấy được bởi người khác, bên gửi sử dụng khóa riêng của mình để tạo chữ ký, bên nhận sử dụng khóa công khai của bên gửi để giải mã chữ ký và kiểm tra tính hợp lệ của chữ ký.

- Ưu điểm: Có thể truyền khóa công khai một cách an toàn cho bên gửi;
- Nhược điểm: Tốc độ xử lý chậm.

## HTTPS là gì?

HTTPS không phải là một giao thức mới, mà là việc **HTTP trước tiên giao tiếp với SSL (Secure Sockets Layer), sau đó SSL giao tiếp với TCP, tức là HTTPS sử dụng một kênh truyền thông qua**. Bằng cách sử dụng SSL, HTTPS có khả năng mã hóa (ngăn chặn nghe trộm), xác thực (ngăn chặn giả mạo) và bảo vệ tính toàn vẹn (ngăn chặn sửa đổi) của dữ liệu.

## HTTP có nhược điểm gì?

- Sử dụng giao tiếp bằng văn bản thô, nội dung có thể bị nghe trộm;
- Không xác minh danh tính của bên giao tiếp, người gửi có thể bị giả mạo;
- Không thể chứng minh tính toàn vẹn của thông điệp, thông điệp có thể bị sửa đổi.

##  HTTPS sử dụng các phương thức mã hóa nào? Có phải là đối xứng hay không đối xứng?

HTTPS sử dụng cơ chế mã hóa kết hợp, sử dụng **mã hóa khóa không đối xứng để truyền khóa đối xứng để đảm bảo tính an toàn của quá trình truyền** và sau đó sử dụng **mã hóa khóa đối xứng để truyền thông tin để đảm bảo hiệu suất của quá trình truyền thông**.

Đảm bảo tính an toàn trong quá trình truyền (thực tế là nguyên lý RSA):

1. Client cung cấp số phiên bản giao thức, một số ngẫu nhiên được tạo bởi client (Client random) và các phương pháp mã hóa mà client hỗ trợ.
2. Server xác nhận phương pháp mã hóa được sử dụng bởi cả hai bên và cung cấp chứng chỉ số, cùng với một số ngẫu nhiên được tạo bởi server (Server random).
3. Client xác nhận tính hợp lệ của chứng chỉ số và sau đó tạo ra một số ngẫu nhiên mới (Premaster secret) và mã hóa số ngẫu nhiên này bằng khóa công khai trong chứng chỉ số, gửi cho Server.
4. Server sử dụng khóa riêng của mình để giải mã số ngẫu nhiên (Premaster secret) mà Client gửi.
5. Client và Server sử dụng các phương pháp mã hóa đã thỏa thuận, sử dụng ba số ngẫu nhiên trên, tạo ra "khóa phiên" (session key) để mã hóa toàn bộ quá trình trò chuyện tiếp theo.

## Tại sao đôi khi làm mới trang không cần thiết lập lại kết nối SSL?

Kết nối TCP đôi khi được duy trì trong một khoảng thời gian bởi trình duyệt và máy chủ, vì vậy TCP không cần thiết lập lại và SSL cũng sẽ sử dụng lại kết nối trước đó.

## Chứng chỉ trong quá trình xác thực SSL là gì? Bạn có hiểu không?

Chứng chỉ được sử dụng để xác thực các bên tham gia giao tiếp.

Cơ quan chứng thực chứng chỉ số (CA, Certificate Authority) là một bên thứ ba mà cả client và server đều tin tưởng.

Người điều hành máy chủ yêu cầu chứng thực khóa công khai của mình từ CA. Sau khi xác định danh tính của người nộp đơn, CA sẽ ký số công khai đã được đăng ký và sau đó phân phối khóa công khai đã ký này trong một chứng chỉ số.

Trong quá trình truyền thông HTTPS, máy chủ sẽ gửi chứng chỉ cho client. Sau khi client nhận được chứng chỉ, nó sẽ sử dụng chữ ký số để xác minh tính hợp lệ của chứng chỉ. Nếu xác minh thành công, quá trình truyền thông có thể bắt đầu.

## Làm thế nào để vô hiệu hóa bộ nhớ cache trong HTTP? Làm thế nào để xác nhận bộ nhớ cache?

HTTP/1.1 sử dụng trường tiêu đề Cache-Control để kiểm soát bộ nhớ cache.

**Vô hiệu hóa bộ nhớ cache**

Chỉ thị no-store xác định rằng không được lưu trữ bất kỳ phần nào của yêu cầu hoặc phản hồi vào bộ nhớ cache.

```html
Cache-Control: no-store
```

Xác nhận bộ nhớ cache

Chỉ thị no-cache yêu cầu máy chủ bộ nhớ cache xác minh tính hợp lệ của tài nguyên bộ nhớ cache với máy chủ nguồn trước khi phản hồi yêu cầu của khách hàng.

```html
Cache-Control: no-cache
```

## Dung lượng tối đa mà GET và POST có thể truyền đi là bao nhiêu?

GET truyền dữ liệu qua URL, do đó dung lượng dữ liệu mà GET có thể truyền phụ thuộc vào độ dài tối đa mà URL có thể đạt được.

Nhiều bài viết nói rằng GET chỉ có thể truyền tối đa 1024 byte dữ liệu, nhưng thực tế, URL không có giới hạn về tham số. Cũng không có giới hạn về độ dài URL trong các quy định giao thức HTTP.

Giới hạn này phụ thuộc vào trình duyệt và máy chủ cụ thể, ví dụ: giới hạn độ dài URL của IE là 2083 byte (2K+35 byte). Đối với các trình duyệt khác như FireFox, Netscape, không có giới hạn độ dài, giới hạn này phụ thuộc vào hệ điều hành của máy chủ; nghĩa là nếu URL quá dài, máy chủ có thể từ chối yêu cầu hoặc yêu cầu dữ liệu không hoàn chỉnh do cài đặt bảo mật.

POST lý thuyết không có giới hạn về kích thước, quy định giao thức HTTP cũng không giới hạn kích thước. Tuy nhiên, thực tế, kích thước dữ liệu mà POST có thể truyền phụ thuộc vào cài đặt của máy chủ và kích thước bộ nhớ.

Vì thường ta không truyền dữ liệu lớn hơn vài MB qua POST, nên hiếm khi ta cảm nhận được giới hạn về kích thước dữ liệu của POST. Tuy nhiên, trong thực tế, nếu bạn tải lên tệp lớn lên máy chủ, bạn có thể gặp vấn đề này, tức là không thể tải lên thành công.

Ví dụ với ngôn ngữ PHP, khi tìm hiểu nguyên nhân, bạn có thể thấy rằng PHP mặc định có giới hạn tải lên, thông thường giá trị này là 2MB, để thay đổi giá trị này bạn cần thay đổi giá trị post_max_size trong tệp php.ini. Điều này cho thấy rõ vấn đề này.

## Các giao thức phổ biến trong tầng mạng? Bạn có thể nói về chúng được không?

| Giao thức | Tên                 | Chức năng                                                     |
| ---- | -------------------- | ------------------------------------------------------------ |
| IP   | Internet Protocol             | Giao thức IP không chỉ định định dạng và đơn vị cơ bản cho việc truyền dữ liệu, mà còn xác định phương pháp chuyển tiếp gói tin và lựa chọn đường đi |
| ICMP | Internet Control Message Protocol | ICMP là một "cơ chế phát hiện và báo cáo lỗi", mục đích của nó là cho phép chúng ta kiểm tra tình trạng kết nối mạng và đảm bảo tính chính xác của kết nối, đây là giao thức làm việc của ping và traceroute |
| RIP  | Routing Information Protocol         | Sử dụng "số bước nhảy" (metric) để đo khoảng cách đến đích |
| IGMP | Internet Group Management Protocol   | Được sử dụng để triển khai truyền phát đa điểm, truyền phát và giao tiếp rộng rãi |

## Tóm tắt bốn thuật toán điều khiển tắc nghẽn TCP? (Rất quan trọng)

### Bốn thuật toán chính

Điều khiển tắc nghẽn chủ yếu bao gồm bốn thuật toán: 1) Khởi động chậm, 2) Tránh tắc nghẽn, 3) Xảy ra tắc nghẽn, 4) Phục hồi nhanh. Bốn thuật toán này không được tạo ra trong một ngày, mà đã trải qua nhiều thời gian phát triển và vẫn đang được tối ưu hóa đến ngày nay.

![](http://oss.interviewguide.cn/img/202205220036635.png)

### Thuật toán khởi động chậm - Slow Start

Khởi động chậm, cũng có nghĩa là khi kết nối TCP vừa được thiết lập, tăng tốc từng chút một, thử nghiệm khả năng chịu đựng của mạng, để tránh làm xáo trộn trật tự kênh mạng trực tuyến.

Thuật toán khởi động chậm:

1. Khi bắt đầu kết nối, khởi tạo kích thước cửa sổ tắc nghẽn cwnd là 1, cho biết có thể truyền một gói tin có kích thước MSS.
2. Mỗi khi nhận được một ACK, tăng kích thước cwnd lên 1, tăng theo cấp số nhân.
3. Mỗi khi qua một khoảng thời gian trễ RTT (Round-Trip Time), kích thước cwnd tăng gấp đôi, nhân với 2, tăng theo cấp số nhân.
4. Có một giới hạn trên gọi là ssthresh (ngưỡng khởi động chậm), khi cwnd >= ssthresh, thuật toán chuyển sang "Thuật toán tránh tắc nghẽn" (sẽ được đề cập sau).

### Thuật toán tránh tắc nghẽn - Congestion Avoidance

Như đã đề cập trước đó, khi kích thước cửa sổ tắc nghẽn cwnd lớn hơn hoặc bằng ngưỡng khởi động chậm ssthresh, thuật toán tránh tắc nghẽn sẽ được áp dụng. Thuật toán như sau:

1. Khi nhận được một ACK, cwnd = cwnd + 1 / cwnd.
2. Mỗi khi qua một khoảng thời gian trễ RTT, kích thước cwnd tăng lên 1.

Sau khi vượt qua ngưỡng khởi động chậm, thuật toán tránh tắc nghẽn có thể tránh tăng kích thước cửa sổ quá nhanh dẫn đến tắc nghẽn cửa sổ, mà thay vào đó tăng chậm để điều chỉnh đến giá trị tốt nhất của mạng.

### Thuật toán xảy ra tắc nghẽn

Nói chung, điều khiển tắc nghẽn TCP mặc định cho rằng gói tin bị mất là do tắc nghẽn mạng gây ra, vì vậy thuật toán điều khiển tắc nghẽn TCP thông thường sử dụng mất gói tin làm tín hiệu để mạng vào trạng thái tắc nghẽn. Có hai cách để xác định gói tin bị mất, một là vượt quá thời gian chờ gửi lại RTO (Retransmission Timeout), hai là nhận được ba ACK xác nhận trùng lặp.

Việc gửi lại sau thời gian chờ gửi lại RTO (Retransmission Timeout) là cơ chế quan trọng của giao thức TCP để đảm bảo tính tin cậy của dữ liệu. Nguyên tắc của nó là sau khi gửi một gói tin, một bộ đếm thời gian được khởi động và nếu không nhận được ACK của gói tin gửi đi trong một khoảng thời gian nhất định, thì gói tin sẽ được gửi lại cho đến khi gửi thành công.

Tuy nhiên, nếu bên gửi nhận được 3 ACK trùng lặp trở lên, TCP nhận ra rằng dữ liệu đã bị mất và cần gửi lại. Cơ chế này không cần chờ đến khi hết thời gian chờ gửi lại RTO, nên được gọi là "Gửi lại nhanh" (Fast Retransmit). Sau khi gửi lại nhanh, không sử dụng thuật toán khởi động chậm, mà sử dụng thuật toán tránh tắc nghẽn, vì vậy nó còn được gọi là "Phục hồi nhanh".

Khi xảy ra thời gian chờ gửi lại RTO, TCP sẽ gửi lại gói tin. TCP coi trường hợp này khá tồi tệ và phản ứng mạnh mẽ:

- Vì gói tin bị mất, ssthresh được đặt thành một nửa của cwnd hiện tại, tức là ssthresh = cwnd / 2.
- cwnd được thiết lập lại thành 1.
- Tiến vào quá trình khởi động chậm.

Thuật toán TCP Tahoe ban đầu chỉ sử dụng các biện pháp xử lý đã nêu trên, nhưng vì mọi thứ bị mất đều được bắt đầu lại từ đầu, dẫn đến cwnd được thiết lập lại thành 1, điều này không thuận lợi cho việc truyền dữ liệu mạng ổn định.

Vì vậy, thuật toán TCP Reno đã được tối ưu hóa. Khi nhận được ba ACK xác nhận trùng lặp, TCP kích hoạt thuật toán gửi lại nhanh Fast Retransmit, thay vì chờ đến khi RTO hết thời gian để gửi lại:

- Kích thước cửa sổ tắc nghẽn cwnd được thu nhỏ xuống một nửa kích thước hiện tại.
- ssthresh được đặt thành kích thước cwnd thu nhỏ.
- Sau đó, tiến vào thuật toán phục hồi nhanh Fast Recovery.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230818233149.png)

### Thuật toán phục hồi nhanh - Fast Recovery

TCP Tahoe là thuật toán ban đầu, nên không có thuật toán phục hồi nhanh, trong khi TCP Reno có. Trước khi tiến vào quá trình phục hồi nhanh, cwnd và ssthresh đã được thay đổi thành một nửa của cwnd ban đầu. Logic của thuật toán phục hồi nhanh như sau:

- cwnd = cwnd + 3 _MSS, việc thêm 3_ MSS là do nhận được 3 ACK trùng lặp.
    
- Gửi lại các gói tin được chỉ định bởi DACKs.
    
- Nếu tiếp tục nhận được DACKs, kích thước cwnd tăng lên một.
    
- Nếu nhận được ACK mới, cho biết gói tin được gửi lại thành công, sau đó thoát khỏi quá trình phục hồi nhanh. Đặt cwnd thành ssthresh hiện tại và sau đó tiến vào thuật toán tránh tắc nghẽn.

![](http://oss.interviewguide.cn/img/202205220036984.png)

Như hình minh họa, gói tin thứ năm bị mất, dẫn đến bên nhận nhận được ba ACK trùng lặp, tức là ACK5. Vì vậy, ssthresh được đặt thành một nửa của cwnd hiện tại, tức là 6/2 = 3, cwnd được đặt thành 3 + 3 = 6. Sau đó, gửi lại gói tin thứ năm. Khi nhận được ACK mới, tức là ACK11, thoát khỏi giai đoạn phục hồi nhanh, đặt lại cwnd thành ssthresh hiện tại, tức là 3, sau đó tiến vào giai đoạn tránh tắc nghẽn.

## Tại sao Fast Retransmit được chọn là 3 lần ACK?

Lý do chính để chọn 3 lần ACK trùng là để phân biệt xem gói tin bị mất là do lỗi mạng hay do các yếu tố khác như sắp xếp không đúng thứ tự.

Khi có 2 lần ACK trùng, rất có thể là do sắp xếp không đúng thứ tự. Khi có 3 lần ACK trùng, rất có thể là do gói tin bị mất. Khi có 4 lần ACK trùng, khả năng là gói tin bị mất càng cao hơn, nhưng phản ứng này quá chậm. Mất gói tin chắc chắn sẽ dẫn đến 3 lần ACK trùng! Tóm lại, việc nhận được 3 lần ACK trùng khiến cửa sổ giảm một nửa là hiệu quả nhất, đó là kinh nghiệm thực tế.

Trước khi có thuật toán fast retransmit/recovery, việc gửi lại dựa trên retransmit timeout của bên gửi, tức là nếu trong khoảng thời gian timeout mà không nhận được ACK từ bên nhận, gói tin được coi là bị mất và bên gửi sẽ gửi lại. Nguyên nhân gói tin bị mất có thể là:

1) Lỗi checksum của gói tin

2) Mạng quá tải

3) Mạng bị ngắt, bao gồm cả sự hồi phục định tuyến, nhưng bên gửi không thể xác định được nguyên nhân, vì vậy nó sử dụng phương pháp ngu ngốc nhất, đó là giảm tốc độ gửi đi một nửa, tức là giảm CWND xuống còn 1/2. Phương pháp này hiệu quả đối với trường hợp 2, có thể giảm tải mạng, nhưng đối với trường hợp 3 thì không quan trọng, vì mạng đã bị ngắt, bất kể gửi nhanh hay chậm cũng sẽ bị mất; nhưng đối với trường hợp 1, mất gói tin là do lỗi ngẫu nhiên, việc giảm tốc độ gửi đi một nửa không hợp lý.

Vì vậy, đã có thuật toán fast retransmit, dựa trên việc nhận được ACK ngược, có thể cho rằng mạng vẫn hoạt động, nếu không thì cũng không thể nhận được ACK. Nếu trong khoảng thời gian timeout không nhận được 2 ACK trùng, có thể xác suất lớn là do sắp xếp không đúng thứ tự, không cần gửi lại;

Nhưng nếu nhận được 3 hoặc nhiều hơn 3 ACK trùng, có thể xác suất lớn là gói tin bị mất, có thể suy luận logic, bên gửi có thể nhận được ACK, mạng vẫn hoạt động, có thể là do 1 hoặc 2 gây ra, vì vậy không giảm tốc độ gửi, gửi lại một lần, nếu nhận được ACK chính xác, thì mọi thứ OK, tốc độ truyền vẫn như cũ (gói tin bị lỗi bị mất).

Nhưng nếu vẫn nhận được ACK trùng, có thể coi đó là do mạng quá tải, lúc này giảm tốc độ truyền là hợp lý hơn.
