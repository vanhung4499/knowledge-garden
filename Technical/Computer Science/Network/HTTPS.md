---
categories:
  - network
  - computer-science
title: HTTPS
date created: 2023-05-27
date modified: 2023-09-17
tags:
  - network
  - computer-science
---

# HTTPS

Chúng ta có thể làm nhiều thứ với web. Trong số đó, bạn có thể có trải nghiệm mua hàng bằng thẻ tín dụng trên một trang web.

Tại thời điểm này, giao tiếp giữa trình duyệt của chúng tôi và máy chủ gần như chắc chắn sẽ qua [[TLS]]. (Nếu URL của bạn bắt đầu bằng https, bạn đang sử dụng TLS)

HTTPS là công nghệ cơ bản nhất để bảo vệ thông tin quan trọng như thông tin tài chính hoặc e-mail.

## 🔒 HTTPS (Hypertext Transfer Protocol Secure)

> Giao thức truyền thông được sử dụng bởi máy khách và máy chủ để trao đổi tài nguyên bằng giao thức mã hóa thông tin [[TLS]] trên Internet

HTTP là một loại giao thức TCP truyền văn bản thuần túy, tức là văn bản không được mã hóa. Thêm S (Secure) vào HTTP để có HTTPS.

Để thêm một lớp bảo mật bổ sung, thứ bạn cài đặt trên máy chủ web của mình là chứng chỉ SSL/TLS.

![Pasted image 20230529131555](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230529131555.png)

Port mặc định của HTTPS là 443, còn HTTP là 80

### ✔️ Bảo mật kết nối TCP: TLS

Giao thức SSL và giao thức TLS có thể bị nhầm lẫn.

Giao thức SSL ban đầu được phát minh bởi Netscape. Tuy nhiên, khi Netscape chuyển giao quyền kiểm soát SSL cho IETF [RFC 4346], nó đã được chuẩn hóa thành TLS.

Giao thức TLS nên được hiểu là một sự phát triển của giao thức SSL.

#### Ví dụ về sự cần thiết: Thương mại trực tuyến

Để minh họa nhu cầu, hãy xem xét một ví dụ về việc mua một sản phẩm trên Internet.

```
Bob lướt ShopeeFood trên Internet để mua một món ăn cho Alice.

🐰 Bob: Hả? Một cửa hàng bánh ngọt ưa thích? Không sao, tôi sẽ mua nó ở đây! Bấm vào nút đặt hàng!

Fancy's Bakery cung cấp một biểu mẫu để nhập loại bánh, số lượng, địa chỉ và số thẻ tín dụng.
 
🐰 Bob: Tôi đã nhập tất cả thông tin và việc mua hàng đã hoàn tất!

Sau khi gửi thông tin như thế này, Bob đợi bánh quy được chuyển đến.
```

Có vẻ như đơn đặt hàng đã được hoàn thành một cách hoàn hảo. Tuy nhiên, nếu bạn không an toàn trong quá trình này, một số điều có thể xảy ra.

Tóm lại, cần có ba đặc điểm để liên lạc an toàn.

1. Bảo mật: Chỉ người gửi và người nhận được chỉ định mới có thể hiểu nội dung của message được truyền đi.
2. Tính toàn vẹn của message: Thông tin không được thay đổi trong quá trình truyền.
3. Xác thực đầu cuối: Người gửi và người nhận phải có khả năng xác minh danh tính của bên kia tham gia giao tiếp để xác minh họ thực sự là ai.

Hãy xem xét một tình huống mà ba điều này không được đảm nảo.

1. Bảo mật (mã hóa) ❌ : Hacker có thể chặn gói tin của Bob và lấy thông tin thẻ tín dụng
2. Message (data) Tính toàn vẹn ❌: Hacker có thể sửa đổi đơn đặt hàng của Bob để khiến cô ấy mua số lượng đồ ngọt nhiều hơn 100 lần so với đơn đặt hàng.
3. Xác thực đầi cuối (máy chủ) ❌: Hacker có thể tạo một trang web giả mạo là một cửa hàng nike, nhận đơn đặt hàng từ Bob và lấy tiền chạy mất. Hắn ta cũng bỏ chạy với thông tin mà Jack đã nhập.

TLS loại bỏ rủi ro này và giải quyết vấn đề bằng cách cải thiện TCP.

### ✔️ Phương pháp mã hóa

#### 1. Mã hóa khóa đối xứng

> Một thuật toán sử dụng cùng một key để mã hóa và giải mã

Mật mã khóa đối xứng giống như chìa khóa của cổng. Chỉ có chìa khoá mới mở được ổ khoá.

Nhưng nếu bạn làm mất chìa khóa thì thật nguy hiểm vì một người nào đó mà bạn không quen biết có thể mở cửa vào nhà bạn!

#### 2. Mã hóa khóa công khai  

> Thuật toán trong đó key để mã hóa và giải mã là khác nhau (public key và private key)

Có hai key, chúng được gọi là một cặp khóa.

1. Public key  
2. Private key

Chúng ta hãy xem xét kỹ hơn giao tiếp của Bob với Alice.

```
Alice có hai key. Một là public key (KB) được mọi người trên thế giới biết đến, hai là private key (KB-) chỉ Alice biết.

1. Bob mã hóa tin nhắn thành m để gửi đến Alice bằng public key. KB+(m)
2. Khi nhận được tin nhắn mã hoá, Alice giải mã nó bằng private key. m = KB-(KB+(m)) 
```

Bằng cách này, không cần phải chia sẻ private key, Bob có thể mang theo public key của Alice và gửi một tin nhắn bí mật.

Và chỉ Alice mới có thể giải mã và mở tin nhắn.

![Pasted image 20230528003706](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230528003706.png)

### ✔️ TLS handshake

Để hiểu bức tranh toàn cảnh về cách TLS được sử dụng, chúng ta hãy xem sơ đồ đơn giản hóa bên dưới.

Quá trình này được chia thành ba giai đoạn. Hãy xem giao tiếp giữa máy khách (Alice) và máy chủ (Bob).

```
1. Bắt tay (handshake)
2. Phát sinh khóa (key derivation)
3. Truyền dữ liệu (data transfer)
```

Máy chủ (Alice) có private và public key, đồng thời ký hợp đồng bằng cách yêu cầu một công ty CA đáng tin cậy quản lý khóa.

- **CA(Certificate Authority)** : Một công ty tư nhân có độ tin cậy cao đã được xác minh để lưu trữ public key

```
1) Thiết lập kết nối TCP.

2) Khi kết nối được thiết lập, máy khách sẽ gửi thông báo chào và máy chủ phản hồi bằng chứng chỉ chứa public key.

(Tại thời điểm này, chứng chỉ được CA chứng nhận, vì vậy máy khách có thể tin tưởng rằng public key trong chứng chỉ thuộc về máy chủ.)

c) Máy khách mã hóa message bằng public key của máy chủ cung cấp và máy chủ giải mã nó bằng private key.
```

Quá trình TLS handshake kết thúc và giao tiếp HTTPS bắt đầu.

![Pasted image 20230528004718](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230528004718.png)

Trong quy trình này, cả phương thức khóa đối xứng và phương thức khóa công khai đều được sử dụng cho chứng chỉ TLS. Làm mọi thứ theo cách khóa công khai đặt rất nhiều gánh nặng lên máy chủ web và trình duyệt. Vì vậy, quy trình bắt tay TLS sử dụng phương thức khóa công khai và giao tiếp HTTPS tiếp theo sử dụng phương thức khóa đối xứng.

## HTTPS vs HTTP

1. Sự khác biệt lớn nhất giữa HTTPS và HTTP là tính bảo mật.

	- HTTPS sử dụng mã hóa SSL/TLS để xác thực các đối tượng yêu cầu và phản hồi, và vì dữ liệu truyền đi cũng được mã hóa nên không thể giải mã và giả mạo. Đó là, tính toàn vẹn dữ liệu được đảm bảo.
	- HTTPS nên được sử dụng khi các thông tin nhạy cảm và quan trọng như thông tin cá nhân của người dùng hoặc thông tin thanh toán cần được truyền đi.

2. Một sự khác biệt bổ sung là chất lượng SEO.

	- SEO (Search Engine Optimization): Chiến lược tối ưu hóa tìm kiếm để website được tìm kiếm và hiển thị tốt trên các công cụ tìm kiếm như Google.  
	- Công cụ tìm kiếm Google khuyến khích các trang web sử dụng giao thức HTTPS bằng cách thưởng SEO cho các trang web sử dụng giao thức HTTPS.
	- Hơn nữa, các trình duyệt như Chrome gián tiếp chặn người dùng truy cập các trang web HTTP bằng cách hiển thị thông báo “không an toàn” khi giao tiếp bằng giao thức HTTP hoặc sử dụng chứng chỉ không đáng tin cậy.
	- Bạn cũng phải sử dụng giao thức HTTPS để hưởng lợi từ AMP(Accelerated Mobile Pages) do Google hỗ trợ.

3. Sự khác biệt nhỏ về hiệu suất có thể tồn tại, nhưng với sự phát triển của công nghệ, nó trở thành một cấp độ không thể cảm nhận được, hay nói đúng hơn là HTTPS thể hiện hiệu suất tốt hơn.
