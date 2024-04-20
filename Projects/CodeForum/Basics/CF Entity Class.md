---
title: CF Entity Class
tags:
  - codeforum
  - project
categories: 
date created: 2024-04-10
date modified: 2024-04-10
---

# Entity Class: DO/DTO/VO

Trong hệ sinh thái của Java, chúng ta sẽ thấy các lớp thực thể phổ biến được đặt tên theo các quy ước khác nhau, chẳng hạn như do, dto, bo, vo, po, entity, rsp, req, vv.

Tương tự, trong cộng đồng kỹ thuật, các lớp thực thể cũng có nhiều cách gọi khác nhau. Vậy thì điều gì làm cho chúng khác biệt? Các tên này phù hợp với những tình huống nào?

## Khái niệm

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240410161656.png)

### do - Domain Object

domain object: Đối tượng miền - là các thực thể nghiệp vụ cụ thể hoặc trừu tượng được trừu tượng hóa từ thế giới thực.

### dto - Data Transfer Object

data transfer object: Đối tượng truyền dữ liệu - mục đích của nó là cung cấp các thực thể dữ liệu cấp độ thô cho các ứng dụng phân tán, nhằm giảm số lần gọi mạng và tăng hiệu suất của các cuộc gọi phân tán.

Thường được sử dụng cho việc truyền dữ liệu giữa lớp hiển thị và lớp dịch vụ, hoặc giữa các lớp dịch vụ khác nhau.

### bo - Business Object

Business Object: Đối tượng nghiệp vụ - thường là các thuộc tính liên quan đến nghiệp vụ trong phạm vi dịch vụ.

### po - Persistant

Persistant Object: Đối tượng lưu trữ - thường tương ứng với thực thể trong cơ sở dữ liệu.

Một quy ước đặt tên phổ biến khác là Entity.

### vo - View Object

view object: Đối tượng xem - thường được hiểu là đối tượng được hiển thị, có thể là trên trang web, ứng dụng di động hoặc ứng dụng máy tính.

### req - Request

request: Lớp đóng gói tham số yêu cầu, thường được sử dụng để chuyển đối số cho các API.

### rsp - Response

response: Lớp đóng gói kết quả trả về, thường được sử dụng để định dạng và trả về đồng nhất cho lớp hiển thị.

## Sự khác biệt

### vo và dto

Đối với hầu hết các tình huống ứng dụng, giá trị thuộc tính của DTO và VO cơ bản là giống nhau, và chúng thường là POJO. Tuy nhiên, về mặt khái niệm, hai thứ này có sự khác biệt cốt lõi. DTO đại diện cho dữ liệu mà lớp dịch vụ cần nhận và trả về, trong khi VO đại diện cho dữ liệu mà lớp hiển thị cần hiển thị.

Nếu bạn vẫn chưa hiểu lời mô tả ở trên, có một cách phân biệt đơn giản (không đảm bảo hoàn toàn chính xác):

- Đối tượng dữ liệu tương tác giữa backend và frontend, trả về vo
- Đối tượng dữ liệu tương tác giữa các dịch vụ backend, trả về dto

### dto và do

Ở mặt thiết kế, DTO được truyền từ lớp hiển thị sang lớp dịch vụ và DTO được trả về từ lớp dịch vụ cho lớp hiển thị có sự khác biệt về khái niệm, nhưng ở mức triển khai, chúng ta thường ít khi làm như vậy (định nghĩa hai UserInfo, thậm chí nhiều hơn). Bởi vì làm như vậy không nhất thiết là thông minh, chúng ta có thể hoàn toàn thiết kế một DTO hoàn toàn tương thích, các thuộc tính không nên được thiết lập bởi lớp hiển thị (ví dụ: tổng giá trị đơn hàng nên được xác định bởi giá đơn vị, số lượng, giảm giá, v.v.), bất kể lớp hiển thị có đặt hay không, lớp dịch vụ đều bỏ qua và khi dữ liệu được trả về từ lớp dịch vụ, dữ liệu không nên trả về (ví dụ: mật khẩu người dùng), không cần thiết lập thuộc tính tương ứng.

Đối với DO, còn có một điểm cần phải giải thích: Tại sao không trực tiếp trả về DO trong lớp dịch vụ? Lý do như sau:

- Sự khác biệt cốt lõi giữa hai đối tượng này là có thể chúng khôgn tương ứng một-một mới nhau, một DTO có thể tương ứng với nhiều DO, ngược lại cũng vậy, thậm chí còn có mối quan hệ nhiều-nhiều giữa hai thứ.
- DO có một số dữ liệu mà lớp hiển thị không nên biết.
- DO có các phương thức nghiệp vụ, nếu trực tiếp trả về DO cho lớp hiển thị, mã của lớp hiển thị có thể tránh qua lớp dịch vụ và gọi các hoạt động mà nó không nên truy cập, đối với cơ chế kiểm soát truy cập dựa trên giao diện dịch vụ thì vấn đề này trở nên nổi bật, và việc gọi phương thức nghiệp vụ của DO từ lớp hiển thị cũng có thể gây ra vấn đề về giao dịch vì các vấn đề về giao dịch khó kiểm soát.
- Về mặt thiết kế, lớp hiển thị phụ thuộc vào lớp dịch vụ, lớp dịch vụ phụ thuộc vào lớp miền, nếu mà DO được tiết lộ, điều này sẽ dẫn đến lớp hiển thị phụ thuộc trực tiếp vào lớp miền, mặc dù điều này vẫn là sự phụ thuộc một chiều, nhưng sự phụ thuộc chéo lớp này sẽ dẫn đến sự ràng buộc không cần thiết.

Đối với DTO, cũng cần phải nói rằng, DTO nên là một "đối tượng phẳng hai chiều", để giải thích điều này, hãy xem xét ví dụ sau: Nếu User liên kết với nhiều đối tượng khác nhau (ví dụ: Địa chỉ, Tài khoản, Khu vực, v.v.), vậy getUser() trả về UserInfo, liệu nó có cần phải trả về tất cả các đối tượng liên kết của nó không?

Nếu làm như vậy, điều này dẫn đến việc tăng lượng dữ liệu truyền, đối với các ứng dụng phân tán, vì việc truyền, tuần tự hóa và phục hồi dữ liệu trên mạng, thiết kế như vậy không chấp nhận được. Nếu getUser cần trả về thông tin cơ bản của User cũng như một AccountID, AccountName, RegionID, RegionName, vậy, hãy đặt các thuộc tính này vào UserInfo, làm phẳng cây đối tượng thành một "đối tượng phẳng hai chiều", trong dự án mà tôi từng tham gia, là một hệ thống phân tán, hệ thống này chỉ cần chuyển đổi tất cả các đối tượng liên kết của một đối tượng thành cây đối tượng DTO cùng cấu trúc và trả về, điều này đã dẫn đến hiệu suất rất chậm.

### do và po

DO và PO trong hầu hết các trường hợp sẽ tương ứng một-một, nhưng từ góc độ ứng dụng có sự khác biệt rõ ràng:

- Đôi khi DO không cần phải được lưu trữ một cách rõ ràng trong một số tình huống, PO không tồn tại
- Tương tự, trong một số tình huống, PO cũng không có DO tương ứng
- Trong một số trường hợp, vì một số chiến lược lưu trữ hoặc sự xem xét về hiệu suất, một PO có thể tương ứng với nhiều DO, và ngược lại.
- Một số giá trị thuộc tính của PO không có ý nghĩa gì đối với DO, các giá trị này có thể tồn tại để giải quyết một số vấn đề lưu trữ, chẳng hạn như để thực hiện "khóa lạc quan", PO tồn tại một thuộc tính phiên bản, thuộc tính này không có ý nghĩa nghiệp vụ đối với DO, nó không nên tồn tại trong DO. Tương tự, DO có thể chứa các thuộc tính không cần phải lưu trữ.

### po và entity

Thực ra không có sự khác biệt cốt lõi nào, chỉ cần xem quy định dự án, thông thường chúng tương ứng với đối tượng lưu trữ cơ sở dữ liệu.

### dto và bo

BO thường là các đối tượng liên quan đến nghiệp vụ, không tương tác với bên ngoài, thông thường khi chúng ta gọi một giao diện dịch vụ bên ngoài, một cách tiếp cận tốt là không sử dụng trực tiếp đối tượng DTO được trả về bởi bên kia, mà là chuyển đổi đối tượng DTO thành đối tượng BO bên trong theo nhu cầu nghiệp vụ thực tế, sau đó sử dụng bên trong.

Tại sao làm như vậy?

- Ví dụ, nếu API của bên kia được nâng cấp và thay đổi đường dẫn gói, sau đó tôi sẽ phải sửa rất nhiều điểm.
- Đối tượng DTO được trả về bởi bên kia, quy tắc đặt tên có thể khác biệt lớn so với dự án của tôi, và hầu hết các tình huống, tôi sẽ không quan tâm đến dữ liệu toàn bộ của nó, tốt nhất là chỉ sử dụng theo nhu cầu.
