---
title: Redis Sentinel
tags: [db, redis, nosql]
categories: [db, redis, nosql]
date created: 2023-07-24
date modified: 2023-07-24
---

# Redis Sentinel

> Redis Sentinel là giải pháp **khả dụng cao** (High Availability) cho Redis.
>
> Redis Sentinel là việc triển khai cụ thể của thuật toán Raft.

## 1. Giới thiệu về Sentinel

Redis Sentinel là giải pháp **cao khả dụng** (High Availability) cho Redis: Hệ thống Sentinel được tạo thành từ một hoặc nhiều phiên bản Sentinel có thể giám sát nhiều máy chủ chính và tất cả các máy chủ con của chúng. Khi một máy chủ chính được giám sát bị chuyển sang trạng thái offline, Sentinel sẽ tự động nâng cấp một máy chủ con thành máy chủ chính mới và máy chủ chính mới này sẽ tiếp tục xử lý các yêu cầu lệnh thay thế cho máy chủ chính đã offline.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200131135847.png)

Các chức năng chính của Sentinel bao gồm:

- **Giám sát (Monitoring)** - Sentinel liên tục kiểm tra xem các máy chủ chính và máy chủ con có hoạt động bình thường hay không.
- **Thông báo (Notification)** - Sentinel có thể thông báo cho quản trị viên hệ thống hoặc ứng dụng khác rằng các phiên bản Redis đang được giám sát gặp vấn đề.
- **Tự động chuyển giao khi lỗi (Automatic Failover)** - Nếu một máy chủ chính bị offline, Sentinel sẽ bắt đầu quá trình chuyển giao tự động: nâng cấp một máy chủ con thành máy chủ chính và cấu hình lại các máy chủ con khác để sử dụng máy chủ chính mới. Ứng dụng sử dụng dịch vụ Redis cũng sẽ được thông báo về địa chỉ mới.
- **Cung cấp cấu hình (Configuration Provider)** - Sentinel cung cấp nguồn cấu hình cho việc khám phá dịch vụ của khách hàng: Đối với một dịch vụ cụ thể, khách hàng kết nối đến các Sentinel để tìm địa chỉ máy chủ chính hiện tại. Khi quá trình chuyển giao xảy ra, Sentinel sẽ báo cáo địa chỉ mới.

## 2. Khởi động Sentinel

Có thể khởi động một Sentinel bằng bất kỳ lệnh nào dưới đây, hai lệnh này có hiệu quả hoàn toàn giống nhau.

```shell
redis-sentinel /path/to/sentinel.conf
redis-server /path/to/sentinel.conf --sentinel
```

Khi một Sentinel được khởi động, nó sẽ thực hiện các bước sau:

1. Khởi tạo máy chủ.
2. Sử dụng mã đặc biệt của Sentinel.
3. Khởi tạo trạng thái của Sentinel.
4. Khởi tạo danh sách máy chủ chính của Sentinel.
5. Tạo kết nối mạng đến máy chủ chính được giám sát.

**Sentinel thực chất là một máy chủ Redis hoạt động trong chế độ đặc biệt**.

Trong chế độ Sentinel, máy chủ Redis chỉ hỗ trợ bảy lệnh: `PING`, `SENTINEL`, `INFO`, `SUBSCRIBE`, `UNSUBSCRIBE`, `PSUBSCRIBE`, `PUNSUBSCRIBE`.

Khi tạo kết nối mạng đến máy chủ chính được giám sát, Sentinel sẽ trở thành một khách hàng của máy chủ chính, nó có thể gửi lệnh đến máy chủ chính và nhận thông tin liên quan từ phản hồi lệnh. Đối với mỗi máy chủ chính được giám sát bởi Sentinel, Sentinel sẽ tạo hai kết nối mạng bất đồng bộ đến máy chủ chính:

- Kết nối lệnh: Được sử dụng đặc biệt để gửi lệnh đến máy chủ chính và nhận phản hồi lệnh.
- Kết nối đăng ký: Được sử dụng đặc biệt để đăng ký kênh `__sentinel__:hello` của máy chủ chính.

## 3. Giám sát

### Kiểm tra trạng thái máy chủ

> **Sentinel gửi lệnh `PING` tới máy chủ Redis để kiểm tra trạng thái của nó**.

Mặc định, **mỗi** nút `Sentinel` sẽ gửi lệnh `PING` tới các nút `Redis` và các nút `Sentinel` **khác** với tần suất là mỗi giây và dựa vào phản hồi từ các nút để xác định xem nút đó có trực tuyến hay không.

- **Offline chủ quan**: Offline chủ quan áp dụng cho cả nút chính và nút phụ. Nếu trong khoảng thời gian `down-after-milliseconds`, `Sentinel` không nhận được phản hồi hợp lệ từ nút mục tiêu, nó sẽ xem nút đó là offline chủ quan.
- **Offline khách quan**: Offline khách quan chỉ áp dụng cho nút chính. Sau khi `Sentinel` xác định một máy chủ chính là offline chủ quan, để xác nhận rằng máy chủ chính thực sự đã offline, nó sẽ hỏi các `Sentinel` khác đang theo dõi máy chủ chính đó xem họ có đồng ý rằng máy chủ chính đã offline hay không. Khi đủ số lượng `Sentinel` đồng ý rằng máy chủ chính đã offline, nó sẽ được xem là offline khách quan và thực hiện hoạt động chuyển giao lỗi.
	- Nút `Sentinel` sử dụng lệnh `sentinel is-master-down-by-addr` để hỏi các nút `Sentinel` khác về **đánh giá trạng thái** của nút đó.

### Lấy thông tin máy chủ

> **Sentinel gửi lệnh `INFO` tới máy chủ chính để lấy thông tin về máy chủ chính và các máy chủ phụ của nó**.

- **Lấy thông tin máy chủ chính** - Sentinel mặc định sẽ gửi lệnh `INFO` tới máy chủ chính mà nó đang giám sát với tần suất là mỗi 10 giây và dựa vào phản hồi từ lệnh `INFO` để lấy thông tin hiện tại của máy chủ chính.
  - Thông tin về máy chủ chính: bao gồm ID chạy của máy chủ được ghi lại trong trường run_id và vai trò của máy chủ được ghi lại trong trường role.
  - Thông tin về máy chủ phụ của máy chủ chính: bao gồm địa chỉ IP và cổng.
- **Lấy thông tin máy chủ phụ** - Khi Sentinel phát hiện một máy chủ chính có máy chủ phụ mới xuất hiện, ngoài việc tạo cấu trúc thực thể tương ứng cho máy chủ phụ mới, Sentinel cũng sẽ tạo kết nối lệnh và kết nối đăng ký tới máy chủ phụ.

## 4. Thông báo

Đối với mỗi máy chủ kết nối với Sentinel, Sentinel sẽ gửi tin nhắn đến kênh `__sentinel__:hello` của máy chủ và cũng đăng ký nhận tin nhắn từ kênh `__sentinel__:hello` của máy chủ.

### Gửi tin nhắn đến máy chủ

Mặc định, Sentinel sẽ gửi lệnh theo định dạng sau đến tất cả các máy chủ chính và máy chủ phụ được giám sát một lần mỗi hai giây.

```
PUBLISH __sentinel__:hello "<s_ip>,<s_port>,<s_runid>,<s_epoch>,<m_name>,<m_ip>,<m_port>,<m_epoch>"
```

Lệnh này gửi một tin nhắn đến kênh `__sentinel__:hello` của máy chủ.

### Nhận tin nhắn từ máy chủ

Khi Sentinel thiết lập kết nối đăng ký với một máy chủ chính hoặc máy chủ phụ, Sentinel sẽ gửi lệnh `SUBSCRIBE __sentinel__:hello` thông qua kết nối đăng ký.

Sentinel sẽ tiếp tục đăng ký kênh `__sentinel__:hello` cho đến khi Sentinel ngắt kết nối với máy chủ.

## 5. Lựa chọn Leader

> Thuật toán lựa chọn Leader trong hệ thống Redis Sentinel được thực hiện bằng cách triển khai [Raft](https://ramcloud.atlassian.net/wiki/download/attachments/6586375/raft.pdf).
>
> Raft là một thuật toán đồng thuận, để hiểu nguyên lý hoạt động của nó, bạn có thể tham khảo [Phân tích sâu về thuật toán đồng thuận Raft](https://dunwu.github.io/blog/pages/4907dc/).

**Khi một máy chủ chính được xác định là offline khách quan, các Sentinel theo dõi máy chủ chính này sẽ thực hiện thỏa thuận và lựa chọn một Sentinel đầu tiên, sau đó Sentinel đầu tiên này sẽ thực hiện hoạt động chuyển giao lỗi cho máy chủ chính offline**.

Tất cả các Sentinel đang hoạt động đều có khả năng được chọn làm Leader.

Mỗi nút `Sentinel` cần thực hiện định kỳ các nhiệm vụ sau đây:

(1) Mỗi `Sentinel` gửi một lệnh `PING` tới các máy chủ chính, máy chủ phụ và các phiên bản `Sentinel` khác mà nó biết với tần suất là mỗi giây.

(2) Nếu một phiên bản (instance) không nhận được phản hồi hợp lệ từ lệnh `PING` trong khoảng thời gian quy định bởi `down-after-milliseconds`, phiên bản này sẽ được đánh dấu là offline chủ quan bởi `Sentinel`.

(3) Nếu một máy chủ chính được đánh dấu là offline chủ quan, tất cả các nút `Sentinel` đang theo dõi máy chủ chính này sẽ xác nhận rằng máy chủ chính đã chính thức vào trạng thái offline chủ quan với tần suất là mỗi giây.

(4) Nếu một máy chủ chính được đánh dấu là offline chủ quan và có đủ số lượng `Sentinel` (ít nhất là số lượng được chỉ định trong tệp cấu hình) đồng ý với quyết định này trong khoảng thời gian quy định, máy chủ chính này sẽ được đánh dấu là offline khách quan.

(5) Trong trường hợp bình thường, mỗi `Sentinel` sẽ gửi lệnh `INFO` tới tất cả các máy chủ chính và phụ mà nó biết với tần suất là mỗi 10 giây. Khi một máy chủ chính được đánh dấu là offline khách quan bởi `Sentinel`, tần suất gửi lệnh `INFO` từ `Sentinel` tới tất cả các máy chủ phụ của máy chủ chính offline sẽ tăng từ 10 giây mỗi lần thành mỗi giây.

(6) `Sentinel` và các `Sentinel` khác thương lượng về trạng thái của nút chính, nếu nút chính ở trạng thái `SDOWN`, một nút chính mới sẽ được tự động bầu chọn. Các nút phụ còn lại sẽ được chỉ định đến nút chính mới để sao chép dữ liệu.

(7) Khi không có đủ số lượng `Sentinel` đồng ý với việc đánh dấu máy chủ chính là offline, trạng thái offline khách quan của máy chủ chính sẽ bị xóa bỏ. Khi máy chủ chính trả lời lệnh `PING` của `Sentinel` với phản hồi hợp lệ, trạng thái offline chủ quan của máy chủ chính sẽ bị xóa bỏ.

> Lưu ý: Phản hồi hợp lệ của lệnh `PING` có thể là: `+PONG`, `-LOADING` hoặc `-MASTERDOWN`. Nếu máy chủ trả về phản hồi khác ngoài ba phản hồi trên hoặc không trả lời lệnh `PING` trong khoảng thời gian quy định, `Sentinel` sẽ coi phản hồi từ máy chủ là không hợp lệ (non-valid).

## 6. Chuyển giao lỗi

Sau khi Sentinel Leader được bầu chọn, Sentinel Leader sẽ thực hiện hoạt động chuyển giao lỗi cho máy chủ chính đã offline. Hoạt động này bao gồm ba bước sau:

(1) **Chọn ra máy chủ chính mới**

Bước đầu tiên của hoạt động chuyển giao lỗi là Sentinel Leader chọn ra một máy chủ phụ trong tất cả các máy chủ phụ thuộc vào máy chủ chính đã offline, mà trạng thái là tốt và dữ liệu là hoàn chỉnh. Sau đó, Sentinel Leader gửi lệnh `SLAVEOF no one` tới máy chủ phụ này để chuyển đổi nó thành máy chủ chính.

Cách Sentinel Leader chọn ra máy chủ chính mới:

- Xóa tất cả các máy chủ phụ đang offline hoặc bị ngắt kết nối khỏi danh sách.
- Xóa tất cả các máy chủ phụ mà trong vòng 5 giây gần đây không phản hồi lệnh INFO từ Sentinel Leader.
- Xóa tất cả các máy chủ phụ mà kết nối với máy chủ chính đã offline bị ngắt quá thời gian `down-after-milliseconds` * 10 mili giây (thời gian cần để xác định máy chủ chính đã offline).

Sau đó, Sentinel Leader chọn ra máy chủ phụ có độ ưu tiên cao nhất. Nếu các máy chủ phụ có cùng độ ưu tiên, Sentinel Leader chọn máy chủ phụ có bộ nhớ đệm sao chép lớn nhất. Nếu vẫn còn nhiều kết quả, Sentinel Leader chọn máy chủ phụ có ID chạy nhỏ nhất.

(2) **Thay đổi mục tiêu sao chép cho các máy chủ phụ**

Sau khi chọn ra máy chủ chính mới, Sentinel Leader gửi lệnh `SLAVEOF` tới tất cả các máy chủ phụ để yêu cầu chúng sao chép từ máy chủ chính mới.

(3) **Biến máy chủ chính cũ thành máy chủ phụ**

Sentinel Leader đánh dấu máy chủ chính cũ là máy chủ phụ. Khi máy chủ chính cũ trở lại hoạt động, Sentinel sẽ gửi lệnh SLAVEOF tới nó để biến nó thành máy chủ phụ.
