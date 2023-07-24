---
title: Redis Persistence
tags: [db, redis, nosql]
categories: [db, redis, nosql]
date created: 2023-07-24
date modified: 2023-07-24
---

# Lưu trữ bền vững trong Redis

> Redis hỗ trợ lưu trữ bền vững, tức là lưu trữ dữ liệu vào đĩa cứng.
>
> Redis cung cấp hai phương pháp lưu trữ bền vững:
>
> - **`RDB Snapshot`** - Lưu trữ tất cả dữ liệu Redis tồn tại tại một thời điểm cụ thể vào một tập tin nhị phân nén (tập tin RDB).
> - **`Append-only file (AOF)`** - Khi thực hiện các lệnh ghi, sao chép các lệnh ghi đó vào đĩa cứng.
>
> Cả hai phương pháp lưu trữ bền vững này có thể được sử dụng cùng nhau hoặc riêng lẻ.
>
> Một lý do chính để lưu trữ dữ liệu từ bộ nhớ vào đĩa cứng là để sử dụng lại dữ liệu sau này hoặc để sao lưu dữ liệu vào một vị trí từ xa để phòng tránh sự cố hệ thống. Ngoài ra, dữ liệu được lưu trữ trong Redis có thể là kết quả của tính toán trong thời gian dài hoặc có chương trình đang sử dụng dữ liệu được lưu trữ trong Redis để tính toán, vì vậy người dùng muốn lưu trữ dữ liệu này để sử dụng sau này mà không cần tính toán lại từ đầu.
>
> Redis cung cấp hai phương pháp lưu trữ bền vững: RDB và AOF. Bạn có thể kích hoạt cả hai phương pháp lưu trữ bền vững cùng một lúc. Trong trường hợp này, khi khởi động lại Redis, nó sẽ ưu tiên tải tập tin AOF để khôi phục dữ liệu ban đầu, vì tập tin AOF thường chứa tập dữ liệu hoàn chỉnh hơn so với tập tin RDB.

## 1. RDB

### Giới thiệu về RDB

**RDB là phương pháp chụp nhanh (snapshot), nó lưu trữ tất cả dữ liệu Redis tại một thời điểm cụ thể vào một tập tin nhị phân nén (tập tin RDB)**.

Sau khi tạo RDB, người dùng có thể **sao lưu** RDB, có thể **sao chép** RDB sang các máy chủ khác để tạo bản sao máy chủ với cùng dữ liệu, và có thể sử dụng khi **khởi động lại** máy chủ. Nói một cách đơn giản: RDB thích hợp để sử dụng như một **bản sao lạnh**.

RDB có thể được thực hiện thủ công hoặc được thực hiện định kỳ dựa trên tùy chọn cấu hình của máy chủ. Chức năng này cho phép lưu trạng thái cơ sở dữ liệu tại một thời điểm cụ thể vào một tập tin RDB.

### Lợi ích của RDB

- tập tin RDB rất nhỏ gọn, **phù hợp để sử dụng như một bản sao lạnh**. Ví dụ: Bạn có thể lưu trữ dữ liệu trong 24 giờ gần đây mỗi giờ, đồng thời lưu trữ dữ liệu trong 30 ngày gần đây mỗi ngày, điều này cho phép bạn khôi phục dữ liệu thành các phiên bản khác nhau theo yêu cầu.
- Trong quá trình lưu tập tin RDB, quá trình cha chỉ cần tạo một quá trình con, tất cả công việc tiếp theo sẽ do quá trình con thực hiện, quá trình cha không cần thực hiện bất kỳ hoạt động IO nào khác, vì vậy phương pháp snapshot có thể tối đa hóa hiệu suất của Redis.
- **Khi khôi phục dữ liệu lớn, RDB nhanh hơn AOF**.

### Nhược điểm của RDB

- **Nếu hệ thống gặp sự cố, dữ liệu sau lần tạo snapshot cuối cùng sẽ bị mất**. Nếu bạn muốn mất ít dữ liệu nhất trong trường hợp Redis dừng hoạt động một cách bất ngờ (ví dụ: mất điện), thì snapshot không phù hợp. Mặc dù bạn có thể cấu hình các điểm lưu trữ khác nhau (ví dụ: mỗi 5 phút và có 100 thao tác ghi trên tập dữ liệu), việc lưu trữ toàn bộ tập dữ liệu của Redis là một công việc khá nặng, thường bạn sẽ lưu trữ toàn bộ tập dữ liệu mỗi 5 phút hoặc lâu hơn, nếu Redis dừng hoạt động một cách bất ngờ, bạn có thể mất vài phút dữ liệu.
- **Nếu tập dữ liệu lớn, việc lưu snapshot sẽ mất thời gian lâu**. Snapshot yêu cầu quá trình cha thường xuyên tạo ra một quá trình con để lưu trữ dữ liệu trên đĩa cứng. Khi tập dữ liệu lớn, quá trình fork là tốn thời gian, có thể làm cho Redis không thể phản hồi yêu cầu của khách hàng trong vài mili giây. Nếu tập dữ liệu lớn và hiệu suất CPU không tốt, tình trạng này có thể kéo dài 1 giây. AOF cũng cần fork, nhưng bạn có thể điều chỉnh tần suất ghi đè tập tin nhật ký để tăng độ bền của tập dữ liệu.

### Tạo RDB

Redis có hai lệnh để tạo tập tin RDB: `SAVE` và `BGSAVE`.

- **`SAVE`** - Lệnh này sẽ chặn tiến trình Redis cho đến khi tạo xong RDB, trong thời gian chặn này, Redis sẽ không thể phản hồi bất kỳ yêu cầu lệnh nào.
- **`BGSAVE`** - Lệnh này sẽ tạo một tiến trình con (fork) và tiến trình con sẽ tạo tập tin RDB, trong khi tiến trình máy chủ (tiến trình cha) tiếp tục xử lý yêu cầu lệnh.

> :bell: Lưu ý: Trong quá trình thực hiện `BGSAVE`, các lệnh `SAVE`, `BGSAVE`, `BGREWRITEAOF` sẽ bị từ chối để tránh xung đột với hoạt động `BGSAVE` hiện tại và giảm hiệu suất.

#### Tự động tạo snapshot

Redis cho phép người dùng cấu hình máy chủ để tự động thực hiện lệnh `BGSAVE` sau một khoảng thời gian nhất định.

Người dùng có thể cấu hình nhiều điều kiện lưu trữ, nhưng chỉ cần một trong các điều kiện được đáp ứng, máy chủ sẽ thực hiện lệnh `BGSAVE`.

Ví dụ, trong tập tin `redis.conf`, bạn có các cấu hình sau:

```
save 900 1       -- Trong 900 giây, ít nhất có 1 thao tác ghi trên cơ sở dữ liệu
save 300 10      -- Trong 300 giây, ít nhất có 10 thao tác ghi trên cơ sở dữ liệu
save 60 10000    -- Trong 60 giây, ít nhất có 10000 thao tác ghi trên cơ sở dữ liệu
```

Chỉ cần một trong các điều kiện trên được đáp ứng, Redis sẽ thực hiện lệnh `BGSAVE`.

### Tải RDB

**Quá trình tải tập tin RDB được thực hiện tự động khi máy chủ khởi động**, Redis không cung cấp lệnh riêng để tải tập tin RDB.

Trong quá trình tải tập tin RDB, máy chủ sẽ ở trạng thái chặn cho đến khi hoàn thành việc tải.

> 🔔 Lưu ý: Do AOF thường có tần suất cập nhật cao hơn RDB, vì vậy mất dữ liệu ít hơn. Dựa trên điều này, Redis có hành vi mặc định sau:
>
> - Chỉ khi tắt chức năng AOF, Redis mới sử dụng RDB để khôi phục dữ liệu, nếu không, Redis sẽ ưu tiên sử dụng tập tin AOF để khôi phục dữ liệu.

### Cấu trúc tập tin RDB

tập tin RDB là một tập tin nhị phân nén, được tạo thành từ nhiều phần khác nhau.

Đối với các cặp khóa-giá trị khác nhau (STRING, HASH, LIST, SET, SORTED SET), tập tin RDB sẽ sử dụng cách lưu trữ khác nhau.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/redis-rdb-structure.png)

Redis cung cấp công cụ kiểm tra tập tin RDB redis-check-dump.

### Cấu hình RDB

Cấu hình RDB mặc định của Redis như sau:

```
save 900 1
save 300 10
save 60 10000
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
dir ./
```

Các tùy chọn liên quan đến RDB trong tập tin cấu hình Redis `redis.conf`:

- `save` - Redis sẽ tự động thực hiện lệnh `BGSAVE` theo tùy chọn `save` để lưu trữ dữ liệu.
- `stop-writes-on-bgsave-error` - Dừng ghi RDB khi có lỗi BGSAVE.
- `rdbcompression` - Kích hoạt nén RDB.
- `rdbchecksum` - Kiểm tra RDB.
- `dbfilename` - Tên tập tin RDB.
- `dir` - Đường dẫn lưu trữ tập tin RDB và tập tin AOF.

## 2. AOF

### Giới thiệu về AOF

`AOF (Append Only File)` là một tập tin ghi lại tất cả các lệnh ghi bằng định dạng giao thức yêu cầu lệnh Redis và được ghi vào cuối tập tin AOF dưới dạng nhật ký văn bản để ghi lại sự thay đổi dữ liệu. Khi máy chủ khởi động lại, nó sẽ tải và thực thi các lệnh trong tập tin AOF để khôi phục dữ liệu ban đầu. AOF phù hợp để sử dụng làm bản sao dự phòng nóng.

AOF có thể được bật bằng cách cấu hình `appendonly yes`.

Các lệnh ghi sẽ được lưu trữ trong bộ đệm AOF trước khi được ghi và đồng bộ hóa định kỳ vào tập tin AOF.

#### Ưu điểm của AOF

- **Nếu hệ thống gặp sự cố, AOF mất ít dữ liệu hơn RDB**. Bạn có thể sử dụng các chiến lược fsync khác nhau: không fsync; fsync mỗi giây; fsync mỗi lần ghi. Với chiến lược fsync mỗi giây mặc định, hiệu suất của Redis vẫn rất tốt (fsync được xử lý bởi luồng nền, luồng chính sẽ cố gắng xử lý yêu cầu khách hàng), và khi gặp sự cố, bạn chỉ mất tối đa 1 giây dữ liệu.
- **tập tin AOF có thể được sửa chữa** - tập tin AOF là một tập tin nhật ký chỉ thực hiện việc ghi thêm, vì vậy không cần seek để ghi, ngay cả khi không thực hiện ghi hoàn chỉnh vì một số lý do (đầy không gian đĩa, bị treo trong quá trình ghi, v.v.), bạn cũng có thể sửa chữa các vấn đề này bằng cách sử dụng công cụ redis-check-aof.
- **tập tin AOF có thể nén**. Redis có thể tự động thực hiện việc viết lại AOF trong nền khi tập tin AOF trở nên quá lớn: tập tin AOF mới viết lại chỉ chứa tập hợp lệnh tối thiểu cần thiết để khôi phục tập dữ liệu hiện tại. Toàn bộ quá trình viết lại là an toàn tuyệt đối, vì Redis vẫn tiếp tục ghi các lệnh vào tập tin AOF hiện có trong quá trình tạo tập tin AOF mới, ngay cả khi có sự cố trong quá trình viết lại. Khi tập tin AOF mới được tạo xong, Redis sẽ chuyển từ tập tin AOF cũ sang tập tin AOF mới và bắt đầu ghi thêm vào tập tin AOF mới.
- **tập tin AOF có thể đọc được** - tập tin AOF lưu trữ tất cả các hoạt động ghi vào cơ sở dữ liệu theo thứ tự. Vì vậy, nội dung của tập tin AOF rất dễ đọc và phân tích. Việc phân tích tập tin (parse) cũng rất dễ dàng. Ví dụ, nếu bạn vô tình thực hiện lệnh FLUSHALL, nhưng chỉ cần dừng máy chủ, loại bỏ lệnh FLUSHALL ở cuối tập tin AOF và khởi động lại Redis, bạn có thể khôi phục tập dữ liệu trạng thái trước khi thực hiện FLUSHALL.

#### Nhược điểm của AOF

- **tập tin AOF thường lớn hơn RDB** - Đối với cùng một tập dữ liệu, tập tin AOF thường lớn hơn tập tin RDB.
- **Khi khôi phục tập dữ liệu lớn, AOF chậm hơn RDB** - Tốc độ AOF có thể chậm hơn tập tin snapshot tùy thuộc vào chiến lược fsync được sử dụng. Trong tình huống thông thường, hiệu suất của fsync mỗi giây vẫn rất cao, và việc tắt fsync có thể làm cho tốc độ AOF giống như tốc độ snapshot, ngay cả trong tải cao. Tuy nhiên, snapshot có thể cung cấp thời gian chờ tối đa đáng tin cậy hơn khi xử lý tải ghi lớn.

### Tạo AOF

**Lệnh Redis sẽ được lưu trữ trong bộ đệm AOF trước khi được ghi và đồng bộ hóa vào tập tin AOF**.

Quá trình tạo AOF có thể chia thành ba bước: ghi lệnh (append), ghi tập tin và đồng bộ tập tin.

- **Ghi lệnh** - Khi máy chủ Redis bật chức năng AOF, sau khi thực hiện một lệnh ghi, máy chủ sẽ ghi lệnh ghi được thực thi vào cuối bộ đệm AOF.
- **Ghi tập tin** và **đồng bộ tập tin** - Quá trình chạy máy chủ Redis là một vòng lặp sự kiện, trong đó sự kiện tập tin xử lý yêu cầu lệnh từ khách hàng và gửi phản hồi lệnh cho khách hàng. Sự kiện thời gian thực hiện chức năng chạy định kỳ. Vì máy chủ xử lý sự kiện tập tin có thể thực hiện lệnh ghi, các lệnh ghi này sẽ được ghi vào bộ đệm AOF. Mỗi khi máy chủ kết thúc vòng lặp sự kiện trước, nó sẽ kiểm tra xem nội dung bộ đệm AOF có cần được ghi và đồng bộ hóa vào tập tin AOF không, dựa trên tùy chọn `appendfsync`.

`appendfsync` có các tùy chọn khác nhau để quyết định hành vi bền vững:

- **`always`** - Ghi tất cả nội dung bộ đệm và đồng bộ hóa vào tập tin AOF.
- **`everysec`** - Ghi tất cả nội dung bộ đệm vào tập tin AOF. Nếu thời gian kể từ lần đồng bộ AOF cuối cùng đã vượt quá một giây, thực hiện đồng bộ AOF lần nữa. Hoạt động đồng bộ này được thực hiện bởi một luồng riêng biệt.
- **`no`** - Ghi tất cả nội dung bộ đệm vào tập tin AOF, nhưng không đồng bộ hóa tập tin AOF. Thời điểm đồng bộ hóa được quyết định bởi hệ điều hành.

### Tải AOF

Vì tập tin AOF chứa tất cả các lệnh ghi cần thiết để tái tạo trạng thái cơ sở dữ liệu trước khi máy chủ tắt, máy chủ chỉ cần tải và thực thi các lệnh ghi từ tập tin AOF để khôi phục trạng thái cơ sở dữ liệu trước đó.

Quá trình tải AOF như sau:

1. Khởi động chương trình tải.
2. Tạo một khách hàng giả. Vì lệnh Redis chỉ có thể được thực thi trong ngữ cảnh khách hàng, nên cần tạo một khách hàng giả để tải và thực thi các lệnh từ tập tin AOF.
3. Phân tích và đọc một lệnh ghi từ tập tin AOF.
4. Sử dụng khách hàng giả để thực thi lệnh ghi.
5. Lặp lại bước 3, 4 cho đến khi tất cả các lệnh ghi được xử lý.
6. Hoàn thành quá trình tải.

### Viết lại AOF

Khi Redis hoạt động, tập tin AOF sẽ ngày càng lớn, điều này gây ra hai vấn đề:

- tập tin AOF sẽ chiếm hết không gian đĩa.
- Khi Redis khởi động lại, nó phải thực thi tất cả các lệnh ghi trong tập tin AOF để khôi phục trạng thái cơ sở dữ liệu. Nếu tập tin AOF quá lớn, thời gian thực hiện khôi phục sẽ rất lâu.

Để giải quyết vấn đề tăng kích thước của tập tin AOF, Redis cung cấp chức năng viết lại AOF để nén tập tin AOF. **Viết lại AOF có thể tạo ra một tập tin AOF mới, tập tin AOF mới này giữ trạng thái cơ sở dữ liệu giống với tập tin AOF ban đầu, nhưng kích thước nhỏ hơn**.

Viết lại AOF không phải là việc đọc và phân tích nội dung tập tin AOF hiện có, mà là đọc trạng thái cơ sở dữ liệu hiện tại trực tiếp từ cơ sở dữ liệu. Đọc từng cặp khóa-giá trị trong cơ sở dữ liệu và sử dụng một lệnh để ghi lại cặp khóa-giá trị đó, thay thế cho các lệnh có thể lặp lại từ trước đó.

#### Viết lại AOF ở nền

Là một tính năng hỗ trợ, rõ ràng là Redis không muốn chặn dịch vụ Redis khác khi viết lại AOF. Do đó, Redis quyết định tạo một tiến trình con thông qua lệnh `BGREWRITEAOF` và sau đó tiến trình con sẽ chịu trách nhiệm viết lại tập tin AOF, tương tự như cách `BGSAVE` hoạt động.

- Khi thực hiện lệnh `BGREWRITEAOF`, máy chủ Redis sẽ duy trì một bộ đệm viết lại AOF. Khi tiến trình con viết lại AOF bắt đầu làm việc, Redis sẽ gửi mỗi lệnh ghi được thực hiện đến cả bộ đệm AOF và bộ đệm viết lại AOF.
- Vì chúng không chạy trong cùng một quá trình, việc viết lại AOF không ảnh hưởng đến việc ghi và đồng bộ AOF. Khi tiến trình con hoàn thành việc tạo tập tin AOF mới, máy chủ sẽ ghi tất cả nội dung của bộ đệm viết lại vào cuối tập tin AOF mới, làm cho trạng thái cơ sở dữ liệu của hai tập tin AOF cũ và mới giống nhau.
- Cuối cùng, máy chủ sẽ thay thế tập tin AOF cũ bằng tập tin AOF mới để hoàn thành quá trình viết lại AOF.

Có thể tự động thực hiện `BGREWRITEAOF` bằng cách cấu hình `auto-aof-rewrite-percentage` và `auto-aof-rewrite-min-size`.

Giả sử cấu hình như sau:

```
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
```

Điều này có nghĩa là khi AOF vượt quá `64MB` và kích thước AOF lớn hơn kích thước sau khi viết lại lần trước ít nhất `100%`, thực hiện `BGREWRITEAOF`.

### Cấu hình AOF

Cấu hình mặc định của AOF:

```
appendonly no
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
```

AOF được bật bằng cách cấu hình `appendonly yes` trong tệp `redis.conf`.

- **`appendonly`** - Bật chức năng AOF.
- **`appendfilename`** - Tên tệp AOF.
- **`appendfsync`** - Được sử dụng để đặt tần suất đồng bộ, có các tùy chọn sau:
	- **`always`** - Mỗi lệnh ghi Redis đều được đồng bộ và ghi vào đĩa cứng. Điều này sẽ làm giảm hiệu suất của Redis đáng kể.
	- **`everysec`** - Mỗi giây thực hiện một lần đồng bộ, rõ ràng đồng bộ nhiều lệnh ghi vào đĩa cứng. Để đảm bảo an toàn dữ liệu và hiệu suất ghi, khuyến nghị sử dụng tùy chọn `appendfsync everysec`. Hiệu suất của Redis khi đồng bộ AOF mỗi giây không khác biệt nhiều so với không sử dụng tính năng bền vững.
	- **`no`** - Ghi tất cả nội dung bộ đệm vào tệp AOF, nhưng không đồng bộ hóa tệp AOF. Thời điểm đồng bộ hóa được quyết định bởi hệ điều hành.
- `no-appendfsync-on-rewrite` - Không hỗ trợ ghi thêm lệnh trong quá trình viết lại AOF.
- `auto-aof-rewrite-percentage` - Phần trăm viết lại AOF.
- `auto-aof-rewrite-min-size` - Kích thước tệp AOF tối thiểu để viết lại.
- `dir` - Đường dẫn lưu trữ tệp RDB và tệp AOF.

## 3. RDB vs AOF

> Khi Redis khởi động, nếu cả RDB và AOF đều được kích hoạt, chương trình sẽ ưu tiên sử dụng tập tin AOF để khôi phục tập dữ liệu, vì tập tin AOF thường chứa dữ liệu hoàn chỉnh nhất.

### Cách chọn phương pháp bền vững

- Nếu không quan tâm đến việc mất dữ liệu, có thể không sử dụng phương pháp bền vững.
- Nếu có thể chịu đựng mất dữ liệu trong vài phút, chỉ cần sử dụng RDB.
- Nếu không thể chịu đựng mất dữ liệu trong vài phút, có thể sử dụng cả RDB và AOF cùng lúc.

Có nhiều người dùng chỉ sử dụng AOF để bền vững, nhưng không khuyến nghị cách tiếp cận này: vì việc tạo bản snapshot RDB định kỳ rất thuận tiện để sao lưu cơ sở dữ liệu và tốc độ khôi phục tập dữ liệu từ snapshot cũng nhanh hơn so với AOF. Ngoài ra, việc sử dụng snapshot cũng giúp tránh lỗi chương trình AOF đã được đề cập trước đó.

### Chuyển từ RDB sang AOF

Trong Redis phiên bản 2.2 trở lên, bạn có thể chuyển từ RDB sang AOF mà không cần khởi động lại Redis:

- Sao lưu tệp dump.rdb mới nhất.
- Đặt sao lưu vào một vị trí an toàn.
- Thực hiện hai lệnh sau:
- redis-cli config set appendonly yes
- redis-cli config set save
- Đảm bảo rằng các lệnh ghi sẽ được ghi đúng vào cuối tệp AOF.
- Lệnh đầu tiên được thực hiện để bật chức năng AOF: Redis sẽ chặn cho đến khi tệp AOF ban đầu được tạo xong, sau đó Redis sẽ tiếp tục xử lý các yêu cầu lệnh và bắt đầu ghi các lệnh ghi vào cuối tệp AOF.

Lệnh thứ hai được sử dụng để tắt chức năng snapshot. Bước này là tùy chọn, nếu bạn muốn, bạn cũng có thể sử dụng cả snapshot và AOF cùng một lúc.

> 🔔 Quan trọng: Đừng quên mở chức năng AOF trong `redis.conf`! Nếu không, sau khi khởi động lại máy chủ, các cấu hình được thiết lập trước đó thông qua CONFIG SET sẽ bị mất và chương trình sẽ khởi động máy chủ theo cấu hình ban đầu.

### Tương tác giữa AOF và RDB

Lệnh `BGSAVE` và `BGREWRITEAOF` không thể được thực thi cùng lúc. Điều này nhằm tránh hai tiến trình Redis nền cùng thực hiện nhiều hoạt động I/O trên đĩa cùng một lúc.

Nếu lệnh `BGSAVE` đang được thực thi và người dùng gọi lệnh `BGREWRITEAOF` một cách rõ ràng, máy chủ sẽ trả lời người dùng với trạng thái OK và thông báo rằng `BGREWRITEAOF` đã được đặt lịch để thực thi. Sau khi `BGSAVE` hoàn thành, `BGREWRITEAOF` sẽ bắt đầu chính thức.

## 4. Sao lưu Redis

Cần đảm bảo rằng dữ liệu Redis được sao lưu đầy đủ.

Đề xuất sao lưu dữ liệu Redis bằng cách sử dụng RDB.

### Quy trình sao lưu

1. Tạo một tác vụ định kỳ (cron job) để sao lưu một tệp RDB vào một thư mục mỗi giờ và sao lưu một tệp RDB vào một thư mục khác mỗi ngày.
2. Đảm bảo rằng các bản sao lưu của snapshot đều có thông tin ngày và giờ tương ứng, mỗi lần thực thi tác vụ định kỳ, sử dụng lệnh find để xóa các snapshot đã hết hạn: ví dụ, bạn có thể giữ lại mỗi giờ trong vòng 48 giờ gần đây và giữ lại mỗi ngày trong vòng một hoặc hai tháng gần đây.
3. Ít nhất mỗi ngày một lần, sao lưu RDB ra khỏi trung tâm dữ liệu của bạn, hoặc ít nhất là sao lưu ra khỏi máy vật lý chạy máy chủ Redis của bạn.

### Sao lưu phòng chống thảm họa

Sao lưu phòng chống thảm họa của Redis thực chất là sao lưu dữ liệu và chuyển các bản sao lưu này đến nhiều trung tâm dữ liệu bên ngoài khác nhau.

Sao lưu phòng chống thảm họa cho phép dữ liệu vẫn được bảo vệ khi xảy ra sự cố nghiêm trọng tại trung tâm dữ liệu chính nơi Redis đang chạy.
