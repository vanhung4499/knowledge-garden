---
categories: [network, computer-science]
title: SOP and CORS
date created: 2023-05-26
date modified: 2023-07-10
tags: [network, computer-science]
---

## Origin

Trước khi nói về SOP và CORS, hãy chỉ ra nguồn gốc liên quan đến cả hai khái niệm này.

Một nguồn (Origin) bao gồm một Protocol hoặc Scheme, một Host và một Port. Nếy tất cả chúng giống nhau thì được coi là cùng một nguồn.

Trong `https://www.domain.com:443`, `https://` là protocol, `www.domain.com` là host và `:443` là port.

Nhấn f12 trong trình duyệt (`fn+12` trên Mac) và nhập `document.location.origin` vào cửa sổ console để kiểm tra nguồn.

### Ví dụ cùng một origin

- `https://www.starbucks.com` và `http://www.starbucks.com/` không phải là cùng một origin vì các giao thức khác nhau.
- `https://www.apple.com/vn/` và `https://www.apple.com/vn/iphone/` là cùng một nguồn vì chỉ có đường dẫn là khác nhau.
- `https://www.youtube.com` và `https://www.youtube.com:443` có cùng origin vì cổng mặc định của https là 443.

## SOP (Same-Origin-Policy)  

- SOP là một biện pháp bảo mật quan trọng hạn chế các tài liệu hoặc tập lệnh từ một nguồn (origin) tương tác với các tài nguyên từ các nguồn (orgin) khác.
- Nói một cách đơn giản, về cơ bản, nếu nguồn (orgin) khác nhau, thì không thể truy cập tài liệu hoặc tập lệnh của nhau và chỉ có thể truy cập đối với các đối tượng cực kỳ hạn chế.
- Các trình duyệt triển khai chính sách origin giống nhau sẽ hạn chế các tập lệnh trang web được cung cấp từ một origin gửi yêu cầu đến một origin khác bằng cách sử dụng các phương thức như `XMLHttpsRequest` hoặc `FetchAPI` .

## Bối cảnh CORS(Cross-Origin-Resource Sharing)

- Hiện tại, có nhiều trường hợp web frontend và backend API được cấu hình riêng biệt. Nó có nghĩa là có một trang web giao diện người dùng riêng biệt và một API web server riêng biệt.
- Trong trường hợp này, thường có một tình huống yêu cầu phải được thực hiện từ frontend tới backend API nằm trong một domain khác.
- Nhưng trong quá khứ, tính năng này không được coi là đương nhiên.
- Trên thực tế, ban đầu, chính sách cơ bản của trình duyệt web là ngăn gửi và nhận yêu cầu từ các domain khác nhau.
- Trước đây, nếu bạn đang tạo một trang web trước đây, thì đây là cấu trúc.

![Pasted image 20230529031620](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230529031620.png)

- Khi người dùng nhập một URL chỉ vào thanh địa chỉ của trình duyệt web, một yêu cầu sẽ được gửi đến máy chủ tương ứng.
- Sau đó, máy chủ trả về một trang HTML khi phản hồi.
- Nói cách khác, người ta thường xây dựng các trang có logic nghiệp vụ và html cùng nhau trên một máy chủ.
- Nếu bạn hỏi tại sao trước đây bạn phải gửi và nhận yêu cầu từ cùng một miền, thì đó là vì bạn nghi ngờ rằng mình đang thực hiện hành vi nguy hiểm về mặt bảo mật, chẳng hạn như rò rỉ thông tin cá nhân hoặc các trang web lừa đảo.
- Tuy nhiên, theo thời gian, có rất nhiều thứ bạn có thể làm trên trang web của mình.
- Ngoài việc đơn giản là viết tài liệu, tôi bắt đầu tạo các ứng dụng và khi những tình huống như vậy ngày càng gia tăng, những điểm khó chịu về chính sách bảo mật của trình duyệt web hiện tại bắt đầu phát sinh từng chút một.
- Vì vậy, cuối cùng, chính CORS đã mở đường chính thức trong trình duyệt web.

## CORS(Cross-Origin-Resource Sharing) là gì?

- Để giải quyết nhu cầu truy cập API của bên thứ ba, các chính sách của CORS xác định cách các tập lệnh do một origin cung cấp có thể yêu cầu tài nguyên từ một origin khác.
- Nói một cách đơn giản, nó có nghĩa là chia sẻ tài nguyên giữa các doamin khác nhau.  
- Các chính sách của CORS xác định các header HTTP cụ thể phải có trong các tương tác request/response.
- Cho phép máy chủ liên lạc origin nào sẽ chấp nhận yêu cầu.
- Sau đó, trình duyệt thực hiện điều này bằng cách cho phép hoặc cấm các tập lệnh truy cập vào response.

![Pasted image 20230529032232](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230529032232.png)

- Nói chung, hầu như không cần thiết lập trực tiếp cài đặt CORS này và nếu bạn chỉ nhập tùy chọn CORS khi thực hiện yêu cầu từ frontend, nằm trong request header.
- Tương tự, trong máy chủ web, CORS được cấu hình để bật và tắt thông qua một tùy chọn đơn giản.
- Nói cách khác, về phía frontend, các tùy chọn liên quan đến CORS được đặt trong Request Header và về phía backend, câu lệnh cho phép các request từ frontend đặt trong response header.
- Nếu có một điểm đặc biệt nho nhỏ thì đó chính là phương thức HTTP OPTION như trong hình dưới đây.

![Pasted image 20230529032525](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230529032525.png)

- Gửi cors request được gửi hai lần: Client -> Server
- Vì vậy, để nhận được cors request từ trình duyệt web trên máy chủ, cần xử lý riêng phương thức OPTION cho cùng một bộ định tuyến.
- Thông thường, máy chủ thực hiện dễ dàng.
- Chúng ta sẽ xem xét các ví dụ trên chi tiết hơn một chút bên dưới.

## Xử lý CORS

- Đối với các cors request, có ba loại xử lý ở trình duyệt:

### 1. Simple Request

![Pasted image 20230529135722](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230529135722.png)

- Đây là một mô tả về những gì trong hình ảnh:  
- Đầu tiên, trình duyệt gửi request đến máy chủ với `origin` header để xác định origin.
- Máy chủ trả về response bao gồm **access-control-allow-origin** header có giá trị là`https://www.site.com`.  
- Trình duyệt thực hiện việc này bằng cách cho phép phương thức **requestHandler** truy cập dữ liệu phản hồi.
- **access-control-allow-origin** header là một trong những CORS header cơ bản mà máy chủ có thể sử dụng để đánh dấu request nào sẽ được cho phép.
- Để cho phép CORS ở mọi nơi, chỉ cần gõ `*`, có nghĩa là tất cả.
- Trong hình trên, nó là một origin yêu cầu trình duyệt cho phép truy cập vào một origin cụ thể.

```
- Example - 
(Nếu bạn cho phép truy cập vào origin cụ thể)
Access-Control-Allow-Origin: https://www.site.com

(Nếu bạn cho phép truy cập vào tất cả các origin)
Access-Control-Allow-Origin: *
```

- Nếu máy chủ không phản hồi với **access-control-allow-origin** header hoặc nếu header value là cho một domain không khớp với origin của request, thì trình duyệt sẽ ngăn response được chuyển trở lại tập lệnh.
- Một request đơn giản là request cầu thỏa mãn những điều sau:
	- Cho phép các yêu cầu GET, HEAD hoặc POST.
	- Chỉ các header `Accept`, `Accept-Language`, `Content-Langauage`, `Content-Type` và User-Agent nằm trong **CORS Safelisted** mới được truyền đi.
	- Không sử dụng các đối tượng `ReadableStream`.
	- Không có trình xử lý sự kiện nào được đính kèm với `XMLHttpRequest.upload`

### 2. Preflighted Request

![Pasted image 20230529141242](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230529141242.png)

- Đây là một request trong đó trình duyệt kiểm tra với máy chủ xem nó có cho phép loại request này hay không trước khi gửi request thực tế.
- Yêu cầu preflight là một OPTIONS request chứa các header sau:

```
- origin : cho máy chủ biết yêu cầu đến từ đâu.
  
- access-control-request-method : cho máy chủ biết HTTP method nào mà yêu cầu thực hiện.
  
- access-control-request-headers : thông báo cho máy chủ về các header có trong yêu cầu.
```

Đáp lại, máy chủ có thể quyết định có chấp nhận loại yêu cầu này từ Nguồn này hay không bằng cách trả lời với tiêu đề sau:

```
- access-control-allow-origin – origin máy chủ sẽ cho phép
  
- access-control-allow-methods – danh sách các method phân tách bằng dấu phẩy được máy chủ cho phép
  
- access-control-allow-headers – danh sách các header phân tách bằng dấu phẩy được máy chủ cho phép

- access-control-max-age - Cho trình duyệt biết khoảng thời gian, tính bằng giây, để lưu vào bộ nhớ đệm các response ứng với request trước.
```

#### Tại sao phải Preflight?

- Điều này là do các preflight request cung cấp cho máy chủ cơ hội kiểm tra và cho phép hoặc không cho phép các request trước khi chúng được thực thi.
- Và nó giúp bảo vệ máy chủ bằng cách chặn một số request mà máy chủ không cho phép từ các origin khác.
- Ngoài ra, máy chủ có thể thay đổi các method và header mà nó chấp nhận khi nó được phát triển.

### 3. Credentialed Request

- Request này được sử dụng khi bao gồm các header liên quan đến xác thực.
- Thông tin xác thực có thể là cookie, authorization header hoặc CA TLS.
- Nó chỉ được phép khi thông tin xác thực nằm ở phía máy khách và `Access-Control-Allow-Credentials: true` trong response từ phía máy chủ.
- Trong trường hợp này, máy chủ phải chỉ định origin trong giá trị của header `Access-Control-Allow-Origin` thay vì chỉ định ký tự đại diện `*`.
