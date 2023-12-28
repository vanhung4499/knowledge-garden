---
title: Redis Interview Part 2
tags: [interview, db, redis]
categories: [interview, db, redis]
date created: 2023-08-19
date modified: 2023-08-19
---

# Redis Interview Part 2

## Làm thế nào để giải quyết vấn đề cạnh tranh khóa trong Redis?

Vấn đề cạnh tranh khóa trong Redis xảy ra khi nhiều hệ thống cùng thao tác trên cùng một khóa, nhưng thứ tự thực hiện cuối cùng không giống với thứ tự mong đợi, dẫn đến kết quả khác nhau!

Một giải pháp được đề xuất là sử dụng khóa phân tán (distributed lock) (cả ZooKeeper và Redis đều có thể thực hiện khóa phân tán). (Nếu không có vấn đề cạnh tranh khóa trong Redis, không nên sử dụng khóa phân tán, điều này sẽ ảnh hưởng đến hiệu suất)

Khóa phân tán dựa trên các nút tạm thời có thứ tự của ZooKeeper có thể thực hiện khóa phân tán. Ý tưởng chính là khi mỗi khách hàng khóa một phương thức cụ thể trên ZooKeeper, tạo ra một nút tạm thời có thứ tự duy nhất trong thư mục tương ứng với phương thức đó. Cách kiểm tra xem có nhận được khóa hay không rất đơn giản, chỉ cần kiểm tra nút có thứ tự nhỏ nhất trong các nút có thứ tự. Khi giải phóng khóa, chỉ cần xóa nút tạm thời này. Đồng thời, nó cũng giúp tránh tình trạng khóa không thể giải phóng do sự cố dẫn đến việc dịch vụ bị tắt. Sau khi hoàn thành quy trình kinh doanh, hãy xóa các nút con tương ứng để giải phóng khóa.

Trong thực tế, tất nhiên là đặt tính sẵn có lên hàng đầu. Vì vậy, ZooKeeper là lựa chọn hàng đầu.

## Làm thế nào để đảm bảo tính nhất quán giữa bộ nhớ cache và cơ sở dữ liệu khi ghi đồng thời?

Đầu tiên, hãy nói rằng, chỉ cần sử dụng bộ nhớ cache, bạn có thể liên quan đến việc lưu trữ đồng thời cache và cơ sở dữ liệu, bạn sẽ chắc chắn gặp vấn đề về tính nhất quán dữ liệu, vậy bạn phải làm thế nào để giải quyết vấn đề tính nhất quán?

Nói chung, nếu hệ thống của bạn không yêu cầu tính nhất quán tuyệt đối giữa bộ nhớ cache và cơ sở dữ liệu, bạn có thể chấp nhận một số trường hợp không nhất quán giữa bộ nhớ cache và cơ sở dữ liệu. Tốt nhất là không nên triển khai giải pháp này, tốt nhất là làm cho các yêu cầu đọc và ghi tuần tự, đẩy vào một hàng đợi bộ nhớ để đảm bảo chắc chắn không có tình trạng không nhất quán xảy ra.

Sau khi tuần tự hóa, điều này sẽ dẫn đến giảm hiệu suất hệ thống đáng kể, sử dụng nhiều máy chủ gấp mấy lần số máy chủ bình thường để hỗ trợ một yêu cầu trực tuyến.

Mô hình đọc và ghi cache cơ bản nhất là **Mô hình dự trữ cache** (Cache Aside Pattern).

- Khi đọc, đọc cache trước, nếu không có trong cache, hãy đọc cơ sở dữ liệu, sau đó lấy dữ liệu và đưa vào cache, đồng thời trả về phản hồi.
- Khi cập nhật, **xóa cache trước, sau đó cập nhật cơ sở dữ liệu**, điều này sẽ khiến cho việc đọc sẽ không tìm thấy dữ liệu trong cache và truy cập trực tiếp vào cơ sở dữ liệu để lấy dữ liệu. (Vì cần xóa, một số trình biên tập có thể tối ưu hóa mà không xóa hoàn toàn dữ liệu trong cache)

Các công ty Internet thích hỏi câu hỏi phỏng vấn này vì việc sử dụng bộ nhớ cache trong các công ty Internet rất phổ biến.

Trong các tình huống kinh doanh cao cấp, hạn chế hiệu suất của cơ sở dữ liệu thường là do lượng truy cập đồng thời của người dùng. Vì vậy, thường sử dụng Redis để làm bộ đệm, cho phép yêu cầu truy cập Redis trước, thay vì truy cập trực tiếp vào cơ sở dữ liệu như MySQL, để giảm thiểu độ trễ phản hồi của yêu cầu mạng.

## Tại sao dữ liệu có thể không nhất quán?

Vấn đề này chủ yếu xảy ra khi có các yêu cầu đọc và ghi đồng thời, dẫn đến sự giao thoa giữa bộ nhớ cache và dữ liệu.

### 1. Trường hợp đơn lẻ

Cùng một thời điểm xảy ra các yêu cầu đọc và ghi đồng thời, ví dụ như yêu cầu A (ghi) và yêu cầu B (đọc).

1. Yêu cầu A gửi một hoạt động ghi đến máy chủ, bước đầu tiên là loại bỏ cache, sau đó vì một số lý do nào đó bị treo, không thực hiện các hoạt động kinh doanh sau (ví dụ: nhiều hoạt động kinh doanh, gọi dịch vụ khác để xử lý tiêu thụ 1 giây).
    
2. Yêu cầu B gửi một hoạt động đọc, đọc cache, vì cache đã bị loại bỏ nên trống rỗng.
    
3. Yêu cầu B tiếp tục đọc cơ sở dữ liệu, đọc ra một dữ liệu bẩn và ghi vào cache.
    
4. Yêu cầu A cuối cùng được thực hiện và ghi dữ liệu vào cơ sở dữ liệu.

Tóm lại: Vì dữ liệu ghi vào cơ sở dữ liệu cuối cùng và không đồng bộ. Dữ liệu trong cache vẫn giữ nguyên dữ liệu bẩn.

Dữ liệu bẩn là dữ liệu trong hệ thống nguồn không nằm trong phạm vi cho trước hoặc không có ý nghĩa với doanh nghiệp thực tế, hoặc có định dạng dữ liệu không hợp lệ và mã hóa không chuẩn trong hệ thống nguồn.

### **2. Trường hợp đồng bộ chính-phụ, đọc ghi tách biệt, dẫn đến dữ liệu bẩn**

1. Yêu cầu A gửi một hoạt động ghi đến máy chủ, bước đầu tiên là loại bỏ cache.
    
2. Yêu cầu A ghi vào cơ sở dữ liệu chính, ghi dữ liệu mới nhất.
    
3. Yêu cầu B gửi một hoạt động đọc, đọc cache, vì cache đã bị loại bỏ nên trống rỗng.
    
4. Yêu cầu B tiếp tục đọc cơ sở dữ liệu, đọc từ cơ sở dữ liệu phụ, vào thời điểm này, đồng bộ chính-phụ vẫn chưa hoàn thành. Đọc dữ liệu bẩn và ghi vào cache.
    
5. Cuối cùng, đồng bộ chính-phụ cơ sở dữ liệu hoàn thành.

Tóm lại: Trong trường hợp này, thứ tự hoạt động của yêu cầu A và yêu cầu B không có vấn đề, vấn đề là độ trễ đồng bộ chính-phụ (giả sử là 1 giây), dẫn đến yêu cầu đọc đọc dữ liệu bẩn từ cơ sở dữ liệu phụ.

**Nguyên nhân chính:**

Trong trường hợp đơn lẻ, việc xử lý logic mất 1 giây có thể dẫn đến đọc dữ liệu cũ vào cache.

Trong trường hợp đồng bộ chính-phụ và đọc ghi tách biệt, dữ liệu cũ từ cơ sở dữ liệu phụ được đọc vào cache trong thời gian đồng bộ chính-phụ 1 giây.

## Bạn có biết các phương pháp tối ưu dữ liệu phổ biến?

1. **Phương pháp loại bỏ bộ nhớ đệm kép:**
   - Đầu tiên, loại bỏ bộ nhớ đệm.
   - Sau đó, ghi vào cơ sở dữ liệu.
   - Gửi một tin nhắn loại bỏ đến hệ thống truyền thông tin (ESB) để loại bỏ bộ nhớ đệm. Quá trình này xảy ra ngay lập tức và không làm tăng thời gian xử lý yêu cầu ghi. Phương pháp này được gọi là "phương pháp loại bỏ bộ nhớ đệm kép" vì nó loại bỏ bộ nhớ đệm hai lần. Dưới hệ thống truyền thông tin, có một tiêu thụ bất đồng bộ loại bỏ bộ nhớ đệm, loại bỏ bộ nhớ đệm sau khi nhận được tin nhắn loại bỏ trong 1 giây. Điều này đảm bảo rằng dù có dữ liệu bẩn được ghi vào bộ nhớ đệm trong 1 giây, nó cũng có thể bị loại bỏ.

2. **Loại bỏ bộ nhớ đệm bất đồng bộ:**

   - Các bước trên đều được thực hiện trong dòng kinh doanh. Tuy nhiên, bạn có thể thêm một mô-đun bất đồng bộ đọc binlog để loại bỏ bộ nhớ đệm. Mô-đun này sẽ đọc dữ liệu từ binlog và loại bỏ bộ nhớ đệm một cách bất đồng bộ.

   Ý tưởng đơn giản sau đây được cung cấp:

   1. Ý tưởng:
      - MySQL binlog đăng ký tiêu thụ tăng cường + hàng đợi tin nhắn + cập nhật dữ liệu tăng cường vào Redis.

      1) Yêu cầu đọc đi qua Redis: Dữ liệu nóng chủ yếu nằm trong Redis.

      2) Yêu cầu ghi đi qua MySQL: Thêm, xóa, sửa đều thao tác trên MySQL.

      3) Cập nhật dữ liệu Redis: Hoạt động dữ liệu của MySQL được ghi vào binlog, sau đó cập nhật vào Redis dựa trên ghi chú trong binlog.

   2. Cập nhật Redis:

      1) Hoạt động dữ liệu chia thành hai phần chính:

      - Một là toàn bộ (ghi toàn bộ dữ liệu vào Redis một lần).
      - Hai là tăng cường (cập nhật theo thời gian thực).

      Đây chỉ là một ý tưởng đơn giản, chỉ đề cập đến cách tăng cường, tức là thay đổi dữ liệu của MySQL như cập nhật, chèn, xóa. Điều này cho phép khi có thay đổi ghi vào MySQL, tin nhắn liên quan đến binlog được đẩy đến Redis, và Redis sẽ cập nhật dữ liệu dựa trên ghi chú trong binlog, không cần thao tác bộ nhớ đệm từ dòng kinh doanh.

## Redis đảm bảo tính cao cấp và khả năng sẵn có cao như thế nào?

Vấn đề này chủ yếu xuất hiện khi truy cập đọc và ghi xảy ra song song, dẫn đến sự giao thoa giữa bộ nhớ cache và dữ liệu.

### Kiến trúc Master-Slave của Redis

Kiến trúc Master-Slave của Redis là nguồn phụ thuộc chính để đạt được tính cao cấp. Thông thường, nhiều dự án chỉ cần một master và nhiều slave để triển khai các chức năng mong muốn. Thông qua việc sử dụng một master duy nhất để ghi dữ liệu, hệ thống có thể xử lý hàng ngàn QPS (truy vấn/giây); trong khi các slave được sử dụng chủ yếu để truy vấn dữ liệu, mỗi instance slave có thể hỗ trợ 10 vạn QPS (truy vấn/giây).

Một số dự án cần đáp ứng yêu cầu tính cao cùng khả năng lưu trữ lượng lớn dữ liệu. Trong tình huống này, Redis Cluster được sử dụng để hỗ trợ hàng trăm ngàn RPS (đọc/ghi/truy vấn/giây).

Đối với tính khả thi của Redis, trong trường hợp triển khai kiến trúc Master-Slave, việc kết hợp với Sentinel sẽ giúp đảm bảo chuyển đổi dự phòng khi một instance gặp sự cố.

Redis đơn lẻ có thể xử lý khoảng từ vài ngàn đến vài chục ngàn QPS. Đối với cache, nó thường được sử dụng để hỗ trợ **đọc cao cấp**. Do đó, kiến trúc Master-Slave (master-slave) được triển khai, trong đó master chịu trách nhiệm ghi dữ liệu và sao chép sang các node slave khác để xử lý yêu cầu đọc. Tất cả các yêu cầu **đọc đi qua các node slave**. Điều này cho phép mở rộng theo chiều ngang một cách dễ dàng và hỗ trợ **đọc cao cấp**.

Sao chép Redis -> Kiến trúc Master-Slave -> Phân tách việc ghi/đọc -> Mở rộng theo chiều ngang để hỗ trợ tính cao cấp của việc đọc.

### Cơ chế cốt lõi của sao chép Redis

- Redis sử dụng phương thức **bất đồng bộ** để sao chép dữ liệu sang các nút slave, tuy nhiên từ phiên bản Redis 2.8 trở đi, các nút slave sẽ định kỳ xác nhận số lượng dữ liệu đã được sao chép;
- Một master node có thể cấu hình nhiều slave node;
- Slave node cũng có thể kết nối với các slave node khác;
- Khi thực hiện sao chép, slave node không làm gián đoạn công việc bình thường của master node;
- Trong quá trình sao chép, slave node không làm gián đoạn hoạt động truy vấn của riêng mình, nó sẽ sử dụng tập dữ liệu cũ để phục vụ; Tuy nhiên khi hoàn thành việc sao chép, cần xóa tập dữ liệu cũ và tải tập dữ liệu mới vào, lúc này sẽ ngừng phục vụ ra bên ngoài;
- Slave node được sử dụng chủ yếu để mở rộng theo chiều ngang (horizontal scaling), thực hiện phân biệt ghi/đọc (read-write separation). Việc mở rộng theo chiều ngang của slave node có thể gia tăng khả năng xử lý đọc.

Lưu ý, nếu sử dụng kiến trúc master-slave, thì đề nghị bắt buộc **bật** tính năng bền vững (persistence) cho master node. Không khuyến nghị sử dụng slave node làm sao lưu dự phòng cho master node, vì trong trường hợp này, nếu bạn tắt tính năng bền vững của master, có thể khi master gặp sự cố và khởi động lại, dữ liệu trên master sẽ rỗng và sau khi sao chép một lần, dữ liệu trên slave node cũng biến mất.

Ngoài ra, các giải pháp sao lưu cho master cũng cần được thực hiện. Trong trường hợp tất cả các tệp tin local bị mất đi hoàn toàn, bạn có thể chọn một file rdb từ việc sao lưu để khôi phục lại master. Điều này mới **đảm bảo rằng khi khởi động lại Redis đã có dữ liệu**, ngay cả khi áp dụng các biện pháp **cao suy yếu** đã được giới thiệu sau này như slave node tự động tiếm quyền từ master node; Tuy nhiên vẫn có thể xảy ra trường hợp sentinel chưa kịp phát hiện sự cố master, master node tự động khởi động lại và dẫn đến việc mất toàn bộ dữ liệu trên tất cả các slave node đã nêu ở trên.

### Nguyên tắc cốt lõi của sao chép từ master đến slave trong Redis

Khi khởi động một slave node, nó sẽ gửi một lệnh `PSYNC` tới master node.

Nếu đây là lần kết nối ban đầu giữa slave và master, thì quá trình sao chép toàn bộ dữ liệu (full resynchronization) sẽ được kích hoạt. Lúc này, master sẽ khởi động một tiểu trình phía sau để tạo ra một file snapshot RDB và các lệnh ghi mới nhận được từ client sẽ được cache trong bộ nhớ. Sau khi file RDB đã được tạo xong, master sẽ gửi file này cho slave. Slave sẽ **ghi vào ổ cứng local trước rồi mới load vào bộ nhớ**, sau đó master sẽ gửi các lệnh ghi đã cache trong bộ nhớ cho slave để sao chép dữ liệu. Nếu có vấn đề về kết nối giữa slave và master do lỗi mạng, khi kết nối lại, chỉ dữ liệu thiếu của phần đã sao chép mới được copy từ master sang slave.

### Tiếp tục sao chép từ điểm dừng của Sao chép Master-Slave

Từ phiên bản Redis 2.8 trở đi, hỗ trợ tiếp tục sao chép từ điểm dừng trong quá trình sao chép Master-Slave. Nếu kết nối mạng bị ngắt giữa quá trình sao chép, bạn có thể tiếp tục sao chép từ vị trí đã được sao chép lần cuối, thay vì phải bắt đầu lại từ đầu.

Nút Master sẽ duy trì một backlog trong bộ nhớ và cả master và slave đều lưu giữ replica offset và master run id. Offset là thông tin được lưu trong backlog. Nếu kết nối mạng giữa master và slave bị ngắt, slave sẽ yêu cầu master tiếp tục sao chép từ replica offset lần cuối. Nếu không tìm thấy offset tương ứng, quá trình "đồng bộ hóa" sẽ được thực hiện.

> Việc xác định nút Master dựa vào host+ip là không tin cậy, nếu nút Master khởi động lại hoặc dữ liệu thay đổi, các nút Slave phải phân biệt theo run id khác nhau.

### Không cần sao chép đĩa

Master tạo trực tiếp `RDB` trong bộ nhớ và gửi cho slave mà không lưu xuống đĩa cục bộ. Chỉ cần mở `repl-diskless-sync yes` trong tệp cấu hình.

```bash
repl-diskless-sync yes

# Đợi 5 giây trước khi bắt đầu sao chép, để các slave kết nối lại
repl-diskless-sync-delay 5Copy to clipboardErrorCopied
```

### Xử lý khóa hết hạn

Slave không bao giờ xóa khóa hết hạn, chỉ đợi master xóa. Nếu master xóa một khóa đã hết hạn hoặc loại bỏ nó thông qua LRU, thì sẽ gửi một lệnh del giả cho slave.

### Quy trình sao chép đầy đủ

Khi slave node được khởi động, nó sẽ lưu thông tin của master node trong máy cục bộ, bao gồm `host` và `ip` của master node nhưng quá trình sao chép chưa được bắt đầu.

Trong slave node có một công việc theo thời gian, kiểm tra hàng giây để xem có kết nối và sao chép với master node mới hay không. Nếu phát hiện ra rồi, nó sẽ thiết lập kết nối socket với master node. Sau đó, slave node gửi lệnh `ping` tới master node. Nếu master đã thiết lập requirepass (mật khẩu yêu cầu), thì slave phải gửi mã thông báo của requirepass để xác minh danh tính. Master **thực hiện sao chép toàn diện ban đầu**, gửi tất cả dữ liệu cho slave. Trong quá trình tiếp theo, master liên tục sao chép các lệnh ghi sang slave ở chế độ không đồng bộ.

### Sao chép toàn bộ

- master thực hiện bgsave, tạo một file snapshot rdb trên máy cục bộ.
- master node gửi file snapshot rdb cho slave node. Nếu thời gian sao chép rdb vượt quá 60 giây (repl-timeout), slave node sẽ coi như quá trình sao chép thất bại, có thể tăng thông số này lên (đối với máy có card mạng gigabit, thông thường truyền 100MB/giây, file 6G có khả năng vượt qua 60s)
- Khi master node tạo ra rdb, nó sẽ lưu tất cả các lệnh ghi mới trong bộ đệm của nó. Sau khi slave node đã lưu lại rdb, nó sẽ sao chép các lệnh ghi mới sang slave node.
- Nếu trong quá trình sao chép, kích thước buffer cache tiêu hao liên tục vượt qua 64MB hoặc vượt qua 256MB một lần duy nhất, việc sao chép dừng lại và coi là không thành công.

```bash
client-output-buffer-limit slave 256MB 64MB 60Copy to clipboardErrorCopied
```

- Sau khi nhận được rdb từ master, slave node xóa dữ liệu cũ của mình và sau đó tải lại vào bộ nhớ của mình từ rdb. Đồng thời, nó cung cấp dịch vụ dựa trên phiên bản dữ liệu cũ.
- Nếu slave node đã kích hoạt AOF, nó sẽ thực hiện ngay lập tức BGREWRITEAOF để viết lại AOF.

### Sao chép tăng

- Nếu trong quá trình sao chép toàn bộ, kết nối mạng giữa master và slave bị ngắt, khi slave kết nối lại với master, quá trình sao chép tăng sẽ được khởi động.
- Master lấy các dữ liệu mất một phần từ backlog của riêng mình và gửi cho slave node. Mặc định backlog là 1MB.
- Master lấy dữ liệu từ backlog theo offset được gửi từ slave trong psync.

### heartbeat

Các nút chủ và nút con sẽ gửi tin nhắn heartbeat cho nhau.

Mặc định, nút chủ gửi một lần heartbeat sau mỗi 10 giây, trong khi nút con gửi một lần heartbeat sau mỗi 1 giây.

### Sao chép bất đồng bộ

Sau khi nhận được lệnh viết từ máy chủ, máy chủ sẽ trước tiên ghi dữ liệu vào bộ nhớ trong và sau đó gửi không đồng bộ cho các nút con.

## Redis làm thế nào để đạt được tính sẵn có cao?

Nếu hệ thống trong vòng 365 ngày, có thể cung cấp dịch vụ cho bên ngoài suốt 99.99% thời gian, thì ta coi hệ thống đó là có tính sẵn có cao.

Khi một slave bị chết đi, không ảnh hưởng đến tính sẵn có của hệ thống, vì còn các slave khác tiếp tục cung cấp dịch vụ truy vấn ra bên ngoài với dữ liệu giống nhau.

Nhưng nếu master node chết đi, sao nhỉ? Không ghi được dữ liệu nữa, khi viết vào cache toàn bộ đã mất hiệu lực. Slave node còn ý nghĩa gì khi không có master sao chép dữ liệu cho chúng? Hệ thống tương đương không khả dụng.

Kiến trúc sẵn có cao của Redis được gọi là "failover" hoặc "chuyển giao từ máy chủ chính sang máy phụ".

Khi master node gặp sự cố, quá trình tự động phát hiện và chuyển đổi một slave node thành master node được gọi là "chuyển giao từ máy chủ chính sang máy phụ". Quá trình này triển khai tính sẵn có cao trong kiến trúc master-slave của Redis.

## Redis và triển khai Sentinel Cluster để đảm bảo tính sẵn có cao

### Giới thiệu về Sentinel

Sentinel, còn được gọi là "đội ngũ canh gác", là một thành phần quan trọng trong kiến trúc Redis Cluster. Nó có các chức năng chính sau:

- Giám sát cụm: Đảm nhận việc giám sát quá trình hoạt động của Redis master và slave.
- Thông báo: Nếu một Redis instance nào đó gặp sự cố, Sentinel sẽ gửi thông báo như cảnh báo cho quản trị viên.
- Chuyển giao khi gặp sự cố: Nếu master node bị hỏng, Sentinel sẽ tự động chuyển giao sang slave node.
- Trung tâm cấu hình: Khi có chuyển giao khi gặp sự cố, Sentinel sẽ thông báo cho client về địa chỉ master mới.

Sentinel được sử dụng để đảm bảo tính sẵn có cao cho Redis Cluster, nó cũng là một hệ thống phân tán, hoạt động cùng nhau như một cụm Sentinel.

- Để xác định xem một master node có bị hỏng hay không, cần có sự đồng thuận từ phần lớn các Sentinel, điều này liên quan đến việc bầu cử phân tán.
- Ngay cả khi một số Sentinel node bị hỏng, cụm Sentinel vẫn có thể hoạt động bình thường, vì nếu một hệ thống chuyển giao quan trọng như vậy lại là một điểm duy nhất, thì điều đó sẽ gây rối.

### Kiến thức cốt lõi của Sentinel

- Cụm Sentinel cần ít nhất 3 instance để đảm bảo tính ổn định.
- Kiến trúc triển khai Sentinel + Redis master/slave không đảm bảo không mất dữ liệu, chỉ đảm bảo tính sẵn có cao cho Redis Cluster.
- Với kiến trúc phức tạp như Sentinel + Redis master/slave, hãy thực hiện đủ kiểm tra và thực hành trong môi trường thử nghiệm và môi trường sản xuất.

Cụm Sentinel cần triển khai ít nhất 2 node, nếu cụm Sentinel chỉ triển khai 2 instance, quorum = 1.

```
+----+         +----+
| M1 |---------| R1 |
| S1 |         | S2 |
+----+         +----+
```

Cấu hình `quorum=1`, nếu master bị hỏng, chỉ cần có 1 Sentinel nào đó trong S1 và S2 cho rằng master đã bị hỏng, quá trình chuyển giao sẽ được thực hiện, đồng thời S1 và S2 sẽ bầu ra một Sentinel để thực hiện chuyển giao. Tuy nhiên, cùng lúc đó, cần có majority, tức là phần lớn Sentinel đang hoạt động.

```
2 Sentinel, majority=2
3 Sentinel, majority=2
4 Sentinel, majority=2
5 Sentinel, majority=3
...
```

Nếu lúc này chỉ có quá trình M1 bị hỏng, Sentinel S1 vẫn hoạt động bình thường, quá trình chuyển giao sẽ diễn ra. Tuy nhiên, nếu cả máy chủ chạy M1 và S1 đều bị hỏng, chỉ còn 1 Sentinel, lúc này không có majority để thực hiện chuyển giao, mặc dù vẫn còn một R1 trên máy chủ khác, nhưng chuyển giao sẽ không được thực hiện.

Cụm Sentinel 3 node cổ điển như sau:

```
       +----+
       | M1 |
       | S1 |
       +----+
          |
+----+    |    +----+
| R2 |----+----| R3 |
| S2 |         | S3 |
+----+
```

Cấu hình `quorum=2`, nếu máy chủ chứa M1 bị hỏng, ba Sentinel còn lại chỉ còn 2, S2 và S3 có thể đồng ý rằng master đã bị hỏng và bầu ra một Sentinel để thực hiện chuyển giao, đồng thời majority của 3 Sentinel là 2, vì vậy hai Sentinel còn lại vẫn hoạt động, cho phép thực hiện chuyển giao.
