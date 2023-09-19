---
title: HTTPS and HTTP
tags:
  - network
  - computer-science
categories: network, computer-science
date created: 2023-09-17
date modified: 2023-09-17
---

# So sánh HTTPS vs HTTP

## Giao thức HTTP

### Giới thiệu về giao thức HTTP

Giao thức HTTP, viết tắt của Hypertext Transfer Protocol (Giao thức Truyền tải Siêu văn bản), như tên gọi, được sử dụng để quy định việc truyền tải siêu văn bản, tức là các thông điệp trên mạng. Cụ thể hơn, nó chủ yếu được sử dụng để quy định hành vi giữa trình duyệt và máy chủ.

Ngoài ra, HTTP còn là một giao thức không trạng thái (stateless), có nghĩa là máy chủ không lưu trữ bất kỳ thông tin nào về các yêu cầu trước đó từ phía máy khách. Điều này thực sự là một cách làm lười biếng, giao thức có trạng thái sẽ phức tạp hơn, đòi hỏi việc duy trì trạng thái (thông tin lịch sử), và nếu máy khách hoặc máy chủ gặp sự cố, có thể dẫn đến trạng thái không nhất quán, điều này sẽ tốn kém để giải quyết.

### Quá trình truyền thông giao thức HTTP

HTTP là một giao thức tầng ứng dụng, nó chạy trên TCP (giao thức tầng vận chuyển) và sử dụng cổng mặc định là 80. Quá trình truyền thông chính như sau:

1. Máy chủ lắng nghe yêu cầu từ máy khách trên cổng 80.
2. Trình duyệt khởi tạo kết nối TCP đến máy chủ (tạo socket).
3. Máy chủ chấp nhận kết nối TCP từ trình duyệt.
4. Trình duyệt (máy khách HTTP) và máy chủ HTTP trao đổi thông điệp HTTP.
5. Đóng kết nối TCP.

### Ưu điểm của giao thức HTTP

Mở rộng linh hoạt, tốc độ nhanh, hỗ trợ đa nền tảng tốt.

## Giao thức HTTPS

### Giới thiệu về giao thức HTTPS

Giao thức HTTPS (Hyper Text Transfer Protocol Secure), là phiên bản bảo mật của HTTP. HTTPS dựa trên HTTP và sử dụng SSL/TLS làm giao thức mã hóa và xác thực bảo mật. Cổng mặc định của HTTPS là 443.

Trong giao thức HTTPS, kênh SSL thường sử dụng thuật toán mã hóa dựa trên khóa, độ dài khóa thường là 40 bit hoặc 128 bit.

### Ưu điểm của giao thức HTTPS

Đảm bảo tính bảo mật cao, đáng tin cậy.

## Cốt lõi của giao thức HTTPS: SSL/TLS

HTTPS có khả năng đáp ứng yêu cầu về bảo mật cao chủ yếu nhờ kết hợp giữa giao thức SSL/TLS và giao thức TCP, mã hóa dữ liệu truyền thông để giải quyết vấn đề dữ liệu HTTP trong suốt. Tiếp theo, chúng ta sẽ tập trung giới thiệu về cách SSL/TLS hoạt động.

### Sự khác biệt giữa SSL và TLS?

**SSL và TLS không có sự khác biệt lớn.**

SSL là viết tắt của Secure Sockets Layer, được phát hành lần đầu vào năm 1996. Phiên bản đầu tiên của SSL thực tế là phiên bản 3.0, SSL 1.0 không bao giờ được phát hành và SSL 2.0 có những khuyết điểm lớn (lỗ hổng DROWN - Decrypting RSA with Obsolete and Weakened eNcryption). Nhanh chóng, vào năm 1999, SSL 3.0 được nâng cấp thêm và **phiên bản mới được đặt tên là TLS 1.0**. Do đó, TLS được xây dựng dựa trên SSL, nhưng do quy ước đặt tên phổ biến nên giao thức mã hóa cốt lõi trong HTTPS thường được gọi là SSL/TLS.

### Nguyên lý hoạt động của SSL/TLS

#### Mã hóa không đối xứng

Yếu tố cốt lõi của SSL/TLS là **mã hóa không đối xứng**. Mã hóa không đối xứng sử dụng hai khóa - một khóa công khai và một khóa bí mật. Trong quá trình truyền thông, khóa bí mật chỉ được giữ bởi người giải mã, trong khi khóa công khai có thể được biết bởi bất kỳ người gửi nào muốn giao tiếp với người giải mã. Hãy tưởng tượng một tình huống như sau:

> Trong một quầy gửi thư tự động nào đó, mỗi kênh truyền thông đều là một hòm thư, mỗi chủ sở hữu hòm thư đều treo một tấm biển bên cạnh, trên đó có một chìa khóa: Đây là khóa công khai của tôi, người gửi vui lòng đặt thư vào hòm thư của tôi và khóa bằng khóa công khai.
>
> Nhưng khóa công khai chỉ có thể khóa, không thể mở khóa. Chỉ có chủ sở hữu hòm thư - vì chỉ có ông ta giữ bí mật khóa bí mật - mới có thể mở khóa.
>
> Như vậy, thông tin truyền tải sẽ không bị người khác chặn lại, điều này phụ thuộc vào tính bảo mật của khóa bí mật.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230917195940.png)

Cặp khóa công khai và khóa bí mật của mã hóa không đối xứng cần được tạo ra bằng một cơ chế toán học phức tạp (mật mã học cho rằng, để đảm bảo tính bảo mật cao, nên tránh tự tạo giải pháp mã hóa). Quá trình tạo ra cặp khóa công khai và khóa bí mật phụ thuộc vào hàm băm một chiều.

> Hàm một chiều: Với hàm một chiều đã biết, cho một đầu vào bất kỳ x, dễ dàng tính được đầu ra y = f(x). Nhưng với một đầu ra y đã biết, giả sử tồn tại f(x) = y, rất khó tính toán x dựa trên f.
>
> Hàm băm một chiều có thể được coi là một hàm băm yếu. Với hàm băm một chiều đã biết, cho một đầu vào bất kỳ x, dễ dàng tính được đầu ra y = f(x,h); nhưng với một đầu ra y đã biết, giả sử tồn tại f(x,h) = y, rất khó tính toán x dựa trên f, nhưng x có thể được suy ra dựa trên f và h.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230917200143.png)

Hình trên là một hàm một chiều (không phải là hàm băm một chiều). Giả sử có một cuốn sách bí truyền, bất kỳ ai biết cuốn sách này đều có thể đảo ngược nước táo thành táo, vậy cuốn sách này chính là "chiều hướng" đúng không?

Ở đây, phép tính của hàm f tương đương với khóa công khai, hàm băm tương đương với khóa bí mật. Khóa công khai f là công khai, bất kỳ ai đã có đầu vào đều có thể mã hóa bằng f, trong khi để khôi phục thông tin gốc từ thông tin đã được mã hóa, cần phải có khóa bí mật.

#### Mã hóa đối xứng

Các bên sử dụng SSL/TLS để giao tiếp cần sử dụng giải pháp mã hóa đối xứng để mã hóa tin nhắn, nhưng việc tính toán trong quá trình truyền thông thực tế của mã hóa không đối xứng có chi phí cao, hiệu suất quá thấp. Do đó, SSL/TLS thực tế sử dụng mã hóa đối xứng cho việc mã hóa tin nhắn.

> Mã hóa đối xứng: Các bên giao tiếp chia sẻ một khóa bí mật duy nhất k, thuật toán mã hóa và giải mã đã biết, bên mã hóa sử dụng khóa bí mật k để mã hóa, bên giải mã sử dụng khóa bí mật k để giải mã, tính bảo mật phụ thuộc vào tính bảo mật của khóa bí mật k.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230917200749.png)

Việc tạo ra khóa đối xứng có chi phí tính toán thấp hơn nhiều so với việc tạo ra cặp khóa công khai và khóa bí mật, vậy tại sao SSL/TLS vẫn cần sử dụng mã hóa không đối xứng? Bởi vì tính bảo mật của mã hóa đối xứng hoàn toàn phụ thuộc vào tính bảo mật của khóa bí mật. Trước khi hai bên giao tiếp, cần thỏa thuận một khóa đối xứng để sử dụng mã hóa. Chúng ta biết rằng kênh truyền thông mạng là không an toàn, gói tin truyền tải có thể được nhìn thấy bởi bất kỳ ai, việc trao đổi khóa không thể trực tiếp truyền qua kênh truyền thông mạng. Do đó, sử dụng mã hóa không đối xứng, mã hóa khóa đối xứng để bảo vệ khóa khỏi việc nghe trộm trên kênh truyền thông mạng. Sau đó, hai bên giao tiếp chỉ cần mã hóa thông tin bằng khóa tuyệt mật an toàn, để đảm bảo tính bảo mật của thông điệp truyền tải.

#### Độ tin cậy của việc truyền tải khóa công khai

Khi giới thiệu về SSL/TLS, người hiểu về an ninh mạng sẽ nghĩ đến một vấn đề an ninh tiềm ẩn. Hãy tưởng tượng một tình huống như sau:

>Máy khách C và máy chủ S muốn sử dụng SSL/TLS để giao tiếp. Theo nguyên tắc truyền thông SSL/TLS đã được giới thiệu, C cần biết khóa công khai của S và cách duy nhất để có được khóa công khai của S là truyền nó qua kênh truyền thông mạng. Hãy lưu ý rằng trong quá trình truyền thông mạng có một số điều kiện tiên quyết:
>
> 1. Bất kỳ ai cũng có thể bắt gói tin truyền thông.
> 2. Tính bảo mật của gói tin truyền thông do người gửi thiết kế.
> 3. Thiết kế giải thuật bảo mật mặc định là công khai, trong khi khóa (giải mã) mặc định là an toàn.
>
> Do đó, giả sử khóa công khai của S không được mã hóa và truyền qua kênh truyền thông mạng, thì có thể tồn tại một kẻ tấn công A gửi cho C một gói tin giả mạo, giả vờ là khóa công khai của S, nhưng thực tế là khóa công khai của máy chủ AS. Khi C nhận được khóa công khai của AS (nhưng tưởng là khóa công khai của S), C sẽ sử dụng khóa công khai của AS để mã hóa dữ liệu và truyền qua kênh truyền thông công khai. Kẻ tấn công A sẽ bắt được các gói tin mã hóa này, giải mã bằng khóa bí mật của AS và nắm giữ nội dung mà C thực sự muốn gửi cho S, trong khi C và S không hề hay biết chuyện này.
>
> Tương tự, khóa công khai của S, ngay cả khi được mã hóa, cũng khó tránh được vấn đề tin cậy này, C đã bị lừa bởi AS!

Để giải quyết vấn đề tin cậy trong việc truyền tải khóa công khai, đã xuất hiện một tổ chức bên thứ ba - Cơ quan Chứng thực (CA, Certificate Authority). CA mặc định là một bên thứ ba đáng tin cậy. CA sẽ cấp chứng chỉ cho các máy chủ, chứng chỉ được lưu trữ trên máy chủ và được ký số bởi CA.

Khi máy khách (trình duyệt) gửi yêu cầu HTTPS đến máy chủ, trước hết phải lấy được chứng chỉ của máy chủ và kiểm tra tính hợp lệ của chứng chỉ dựa trên thông tin trên chứng chỉ. Một khi máy khách phát hiện chứng chỉ không hợp lệ, sẽ xảy ra lỗi. Sau khi máy khách nhận được chứng chỉ của máy chủ, vì tính tin cậy của chứng chỉ được xác nhận bởi một cơ quan đáng tin cậy bên thứ ba và chứng chỉ chứa thông tin khóa công khai của máy chủ, máy khách có thể tin tưởng rằng khóa công khai trên chứng chỉ là khóa công khai của máy chủ mục tiêu.

#### Chữ ký số

Đến phần cuối cùng của SSL/TLS rồi. Trong phần trước, đã đề cập đến chữ ký số, mục tiêu của chữ ký số là ngăn chặn việc giả mạo chứng chỉ. Lý do mà các cơ quan đáng tin cậy thứ ba như CA có thể được tin cậy là nhờ vào **công nghệ chữ ký số**.

Chữ ký số là một công nghệ mà CA sử dụng khi cấp chứng chỉ cho máy chủ. Kỹ thuật này kết hợp giữa việc tạo băm và mã hóa để tạo ra một chữ ký trên chứng chỉ, từ đó cung cấp tính xác thực. Cụ thể, quá trình hoạt động như sau:

> CA biết khóa công khai của máy chủ và sử dụng kỹ thuật tạo băm để tạo ra một bản tóm tắt của chứng chỉ. CA sử dụng khóa bí mật của mình để mã hóa bản tóm tắt đó và đặt nó dưới chứng chỉ, sau đó gửi cho máy chủ.
>
> Bây giờ máy chủ gửi chứng chỉ đó cho máy khách, máy khách cần xác minh danh tính của chứng chỉ. Máy khách tìm đến cơ quan đáng tin cậy thứ ba CA, biết khóa công khai của CA và sử dụng khóa công khai đó để giải mã chữ ký trên chứng chỉ, từ đó lấy được bản tóm tắt mà CA đã tạo ra.
>
> Máy khách cũng sử dụng cùng một quá trình tạo băm để tạo ra bản tóm tắt từ dữ liệu chứng chỉ (bao gồm khóa công khai của máy chủ). Máy khách so sánh bản tóm tắt này với bản tóm tắt đã giải mã từ chữ ký, nếu giống nhau, xác minh thành công; nếu không, xác minh thất bại.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230917203734.png)

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230917204119.png)

Tóm lại, quy trình truyền tải khóa công khai với chứng chỉ như sau:

1. Có máy chủ S, máy khách C và cơ quan đáng tin cậy thứ ba CA.
2. S tin tưởng CA và CA biết khóa công khai của S. CA cấp chứng chỉ cho S và sử dụng khóa bí mật của mình để tạo chữ ký mã hóa cho bản tóm tắt của chứng chỉ.
3. S nhận được chứng chỉ từ CA và gửi nó cho C.
4. C nhận được chứng chỉ của S, tin tưởng CA và biết khóa công khai của CA. C sử dụng khóa công khai của CA để giải mã chữ ký trên chứng chỉ và tạo bản tóm tắt từ dữ liệu chứng chỉ. C so sánh bản tóm tắt này với bản tóm tắt đã giải mã từ chữ ký, nếu giống nhau, xác minh thành công; nếu không, xác minh thất bại.

## Tóm tắt

- **Cổng kết nối**: HTTP mặc định sử dụng cổng 80, HTTPS mặc định sử dụng cổng 443.
- **Tiền tố URL**: HTTP có tiền tố URL là `http://`, HTTPS có tiền tố URL là `https://`.
- **Bảo mật và tiêu thụ tài nguyên**: Giao thức HTTP hoạt động trên TCP, tất cả nội dung truyền tải đều là văn bản rõ ràng, cả máy khách và máy chủ đều không thể xác minh danh tính của nhau. HTTPS là giao thức HTTP hoạt động trên SSL/TLS, SSL/TLS hoạt động trên TCP. Tất cả nội dung truyền tải đều được mã hóa, mã hóa sử dụng mã hóa đối xứng, nhưng khóa mã hóa đối xứng được mã hóa bằng chứng chỉ của máy chủ. Vì vậy, HTTP không an toàn bằng HTTPS, nhưng HTTPS tốn nhiều tài nguyên máy chủ hơn.

