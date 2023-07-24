---
title: Redis Operations
tags: [db, redis, nosql]
categories: [db, redis, nosql]
date created: 2023-07-24
date modified: 2023-07-25
---

# Quản trị Redis

> **Redis** là một cơ sở dữ liệu key-value có hiệu suất cao.
>
> Thao tác SET có thể đạt tới 110.000 lần mỗi giây; thao tác GET có thể đạt tới 81.000 lần mỗi giây.

## 1. Cài đặt Redis

### Cài đặt trên Windows

**Đường dẫn tải về:** [https://github.com/MSOpenTech/redis/releases](https://github.com/MSOpenTech/redis/releases).

Redis hỗ trợ cả phiên bản 32-bit và 64-bit. Bạn cần chọn phiên bản phù hợp với hệ điều hành của bạn. Tại đây, chúng ta tải xuống tệp nén **Redis-x64-xxx.zip** và giải nén vào ổ đĩa C, sau đó đổi tên thư mục thành **redis**.

Mở cửa sổ **cmd** và sử dụng lệnh cd để chuyển đến thư mục **C:\redis**, chạy lệnh **redis-server.exe redis.windows.conf**.

Nếu muốn tiện lợi hơn, bạn có thể thêm đường dẫn của Redis vào biến môi trường hệ thống, điều này sẽ giúp bạn không cần phải nhập đường dẫn mỗi lần sử dụng. Bạn có thể bỏ qua phần redis.windows.conf nếu muốn, nếu bỏ qua, Redis sẽ sử dụng cấu hình mặc định.

Bây giờ mở một cửa sổ cmd mới, không đóng cửa sổ cũ, vì nếu đóng thì bạn sẽ không thể truy cập vào máy chủ dịch vụ nữa.

Chuyển đến thư mục redis và chạy lệnh **redis-cli.exe -h 127.0.0.1 -p 6379**.

### Cài đặt trên Linux

**Đường dẫn tải về:** http://redis.io/download, tải phiên bản mới nhất.

Tải xuống, giải nén và biên dịch Redis:

```shell
wget http://download.redis.io/releases/redis-5.0.4.tar.gz
tar xzf redis-5.0.4.tar.gz
cd redis-5.0.4
make
```

Để biên dịch mã nguồn Redis, bạn cần cài đặt gcc-c++ và tcl. Nếu bạn đang sử dụng CentOS, bạn có thể cài đặt bằng lệnh `yum install -y gcc-c++ tcl`.

Sau khi giải nén, điều hướng đến thư mục `src` và khởi động Redis bằng lệnh sau:

```shell
src/redis-server
```

Bạn có thể sử dụng client tích hợp để tương tác với Redis:

```shell
$ src/redis-cli
redis> set foo bar
OK
redis> get foo
"bar"
```

### Cài đặt trên Ubuntu

Trên hệ điều hành Ubuntu, bạn có thể cài đặt Redis bằng các lệnh sau:

```shell
sudo apt-get update
sudo apt-get install redis-server
```

### Tự động khởi động khi máy khởi động

- Cấu hình tự động khởi động: `echo "/usr/local/bin/redis-server /etc/redis.conf" >> /etc/rc.local`

### Mở cổng trên tường lửa

- Thêm quy tắc: `iptables -I INPUT -p tcp -m tcp --dport 6379 -j ACCEPT`
- Lưu quy tắc: `service iptables save`
- Khởi động lại iptables: `service iptables restart`

### Kịch bản cài đặt Redis

> Kịch bản cài đặt cho môi trường CentOS 7

**Hướng dẫn cài đặt**

- Cài đặt Redis bằng cách biên dịch và đăng ký nó như một dịch vụ systemd
- Đường dẫn cài đặt là: `/usr/local/redis`
- Phiên bản mặc định là `5.0.4`, cổng mặc định là `6379`, mật khẩu truy cập là trống

**Cách sử dụng**

- Cài đặt mặc định - Chạy bất kỳ lệnh nào sau đây:

```shell
curl -o- https://gitee.com/turnon/linux-tutorial/raw/master/codes/linux/soft/redis-install.sh | bash
wget -qO- https://gitee.com/turnon/linux-tutorial/raw/master/codes/linux/soft/redis-install.sh | bash
```

- Cài đặt tùy chỉnh - Tải xuống kịch bản và chạy theo định dạng sau:

```shell
sh redis-install.sh [version] [port] [password]
```

Giải thích các tham số:

- `version` - số phiên bản Redis
- `port` - số cổng dịch vụ Redis
- `password` - mật khẩu truy cập

## 2. Sử dụng và cấu hình Redis đơn

### Khởi động Redis

**Khởi động dịch vụ Redis**

```shell
cd /usr/local/redis/src
./redis-server
```

**Khởi động client Redis**

```shell
cd /usr/local/redis/src
./redis-cli
```

**Kiểm tra Redis đã khởi động chưa**

```shell
redis-cli
```

Lệnh trên sẽ mở một terminal như sau:

```shell
redis 127.0.0.1:6379>
```

127.0.0.1 là địa chỉ IP của máy local, 6379 là cổng của dịch vụ Redis. Bây giờ chúng ta gõ lệnh PING.

```shell
redis 127.0.0.1:6379> ping
PONG
```

Điều này chứng tỏ chúng ta đã khởi động Redis thành công.

### Cấu hình Redis thông thường

> Tệp cấu hình mặc định của Redis là `redis.conf` trong thư mục gốc.
>
> Nếu bạn muốn chỉ định một tệp cấu hình cụ thể, bạn cần sử dụng lệnh: `./redis-server -c xxx.conf`
>
> Sau mỗi lần thay đổi cấu hình, bạn cần khởi động lại Redis để áp dụng thay đổi.
>
> Cấu hình mặc định của Redis:
>
> - Tài liệu mô tả bản thân [redis.conf cho Redis 2.8](https://raw.githubusercontent.com/antirez/redis/2.8/redis.conf)
> - Tài liệu mô tả bản thân [redis.conf cho Redis 2.6](https://raw.githubusercontent.com/antirez/redis/2.6/redis.conf).
> - Tài liệu mô tả bản thân [redis.conf cho Redis 2.4](https://raw.githubusercontent.com/antirez/redis/2.4/redis.conf).
>
> Từ Redis 2.6 trở đi, bạn có thể truyền các tham số cấu hình Redis trực tiếp từ dòng lệnh. Phương pháp này có thể được sử dụng cho mục đích kiểm tra.

### Đặt Redis làm tiến trình nền

Redis mặc định không chạy như một tiến trình nền, nhưng thông thường chúng ta sẽ đặt Redis làm tiến trình nền. Cấu hình: `daemonize yes`

#### Truy cập từ xa

Redis mặc định ràng buộc với địa chỉ 127.0.0.1, điều này chỉ cho phép truy cập từ máy cục bộ. Nếu bạn muốn cho phép truy cập từ xa vào Redis, bạn cần cấu hình: `bind 0.0.0.0`

#### Đặt mật khẩu

Redis mặc định không yêu cầu mật khẩu khi truy cập. Nếu bạn muốn đặt mật khẩu, bạn cần cấu hình như sau:

- `protected-mode yes`
- `requirepass <mật khẩu>`

#### Bảng tham số cấu hình

| Cấu hình                                                                                                                                                                                                               | Mô tả                                                                                                                                                                                                                                                                                   |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `daemonize no`                                                                                                                                                                                                         | Redis mặc định không chạy như một tiến trình nền, bạn có thể sử dụng cấu hình này để thay đổi. Sử dụng `yes` để bật chế độ tiến trình nền (Windows không hỗ trợ cấu hình tiến trình nền).                                                                                                    |
| `pidfile /var/run/redis.pid`                                                                                                                                                                                           | Khi Redis chạy như một tiến trình nền, Redis mặc định sẽ ghi pid vào tệp /var/run/redis.pid. Bạn có thể chỉ định pidfile để thay đổi vị trí ghi pid.                                                                                                                                      |
| `port 6379`                                                                                                                                                                                                            | Chỉ định cổng mà Redis lắng nghe, mặc định là cổng 6379. Nguyên tắc chọn cổng mặc định là 6379 được giải thích trong bài viết của tác giả, vì 6379 tương ứng với MERZ trên bàn phím điện thoại di động, MERZ lấy từ tên của nữ ca sĩ Alessia Merz của Ý.                                      |
| `bind 127.0.0.1`                                                                                                                                                                                                       | Địa chỉ IP của máy chủ được ràng buộc                                                                                                                                                                                                                                                    |
| `timeout 300`                                                                                                                                                                                                          | Thời gian chờ tối đa (giây) trước khi đóng kết nối với khách hàng. Nếu đặt thành 0, chức năng này sẽ bị tắt.                                                                                                                                                                                |
| `loglevel notice`                                                                                                                                                                                                      | Chỉ định cấp độ ghi nhật ký, Redis hỗ trợ bốn cấp độ: debug, verbose, notice, warning. Mặc định là notice.                                                                                                                                                                               |
| `logfile stdout`                                                                                                                                                                                                       | Chỉ định cách ghi nhật ký, mặc định là ghi vào đầu ra tiêu chuẩn. Nếu cấu hình Redis chạy như một tiến trình nền và bạn cấu hình ghi nhật ký vào đầu ra tiêu chuẩn, nhật ký sẽ được gửi đến /dev/null.                                                                                     |
| `databases 16`                                                                                                                                                                                                         | Đặt số lượng cơ sở dữ liệu, mặc định là 0. Bạn có thể sử dụng lệnh SELECT trên kết nối để chỉ định id cơ sở dữ liệu.                                                                                                                                                                      |
| `save <seconds> <changes>` Tệp cấu hình mặc định của Redis cung cấp ba điều kiện: **save 900 1**, **save 300 10**, **save 60 10000**.                                                                                       | Chỉ định thời gian và số lần thay đổi để đồng bộ dữ liệu với tệp dữ liệu trong một khoảng thời gian nhất định. Bạn có thể kết hợp nhiều điều kiện để cấu hình.                                                                                                                             |
| `rdbcompression yes`                                                                                                                                                                                                   | Chỉ định xem liệu dữ liệu có nén khi lưu trữ trong cơ sở dữ liệu cục bộ hay không. Mặc định là yes. Redis sử dụng phương pháp nén LZF. Nếu bạn muốn tiết kiệm thời gian CPU, bạn có thể tắt tùy chọn này, nhưng điều này sẽ làm cho tệp cơ sở dữ liệu trở nên rất lớn.                                |
| `dbfilename dump.rdb`                                                                                                                                                                                                  | Chỉ định tên tệp cơ sở dữ liệu cục bộ, mặc định là dump.rdb.                                                                                                                                                                                                                              |
| `dir ./`                                                                                                                                                                                                               | Chỉ định thư mục lưu trữ cơ sở dữ liệu cục bộ, mặc định là thư mục hiện tại.                                                                                                                                                                                                              |
| `slaveof <masterip> <masterport>`                                                                                                                                                                                      | Đặt Redis làm dịch vụ slave, chỉ định địa chỉ IP và cổng của dịch vụ master. Khi Redis khởi động, nó sẽ tự động đồng bộ dữ liệu từ master.                                                                                                                                               |
| `masterauth <master-password>`                                                                                                                                                                                         | Khi dịch vụ master được bảo vệ bằng mật khẩu, chỉ định mật khẩu kết nối từ slave đến master.                                                                                                                                                                                            |
| `requirepass foobared`                                                                                                                                                                                                 | Đặt mật khẩu kết nối Redis. Nếu cấu hình mật khẩu kết nối, khách hàng phải cung cấp mật khẩu bằng lệnh `AUTH <password>` khi kết nối Redis. Mặc định là không yêu cầu mật khẩu.                                                                                                              |
| `maxclients 128`                                                                                                                                                                                                       | Đặt số lượng kết nối khách hàng tối đa cùng một thời điểm, mặc định là không giới hạn. Redis có thể mở cùng một lúc số lượng kết nối khách hàng bằng với số lượng mô tả tệp tin cấu hình Redis. Nếu đặt maxclients thành 0, không có giới hạn. Khi số lượng kết nối khách hàng đạt đến giới hạn, Redis sẽ đóng kết nối mới và trả về thông báo lỗi "max number of clients reached". |
| `maxmemory <bytes>`                                                                                                                                                                                                    | Chỉ định giới hạn bộ nhớ tối đa cho Redis. Khi Redis khởi động, dữ liệu sẽ được tải vào bộ nhớ. Khi đạt đến giới hạn bộ nhớ tối đa, Redis sẽ cố gắng xóa các khóa đã hết hạn hoặc sắp hết hạn. Nếu vẫn không đủ, Redis sẽ không thể ghi dữ liệu mới, nhưng vẫn cho phép đọc dữ liệu. Redis sử dụng cơ chế vm để lưu trữ các khóa trong bộ nhớ và các giá trị trong swap. |
| `appendonly no`                                                                                                                                                                                                        | Chỉ định xem liệu Redis có ghi nhật ký sau mỗi lần cập nhật hay không. Mặc định, Redis sẽ ghi dữ liệu vào đĩa bất đồng bộ. Nếu không bật tùy chọn này, dữ liệu có thể bị mất trong một khoảng thời gian khi mất điện. Vì Redis đồng bộ dữ liệu với tệp dữ liệu theo các điều kiện save đã cấu hình, nên một số dữ liệu chỉ tồn tại trong bộ nhớ trong một khoảng thời gian. Mặc định là no. |
| `appendfilename appendonly.aof`                                                                                                                                                                                        | Chỉ định tên tệp ghi nhật ký cập nhật, mặc định là appendonly.aof.                                                                                                                                                                                                                         |
| `appendfsync everysec`                                                                                                                                                                                                 | Chỉ định điều kiện ghi nhật ký cập nhật, có 3 giá trị có thể chọn: **no**: dữ liệu được đồng bộ hóa với bộ nhớ đệm của hệ điều hành (nhanh). **always**: sau mỗi lần cập nhật, Redis sẽ gọi thủ công fsync() để ghi dữ liệu vào đĩa (chậm, an toàn). **everysec**: đồng bộ dữ liệu mỗi giây (giữa hai giá trị trên, mặc định). |
| `vm-enabled no`                                                                                                                                                                                                        | Chỉ định xem Redis có sử dụng bộ nhớ ảo hay không, mặc định là no. Bài viết này sẽ phân tích cơ chế bộ nhớ ảo của Redis sau.                                                                                                                                                             |
| `vm-swap-file /tmp/redis.swap`                                                                                                                                                                                         | Đường dẫn tệp swap, mặc định là /tmp/redis.swap, không thể chia sẻ giữa nhiều phiên bản Redis.                                                                                                                                                                                           |
| `vm-max-memory 0`                                                                                                                                                                                                      | Lưu trữ tất cả các giá trị lớn hơn vm-max-memory vào bộ nhớ ảo, bất kể vm-max-memory được đặt thành bao nhiêu, tất cả các chỉ mục dữ liệu (keys) đều được lưu trữ trong bộ nhớ (Redis chỉ lưu trữ các giá trị trong swap). Mặc định là 0.                                                                                                                |
| `vm-page-size 32`                                                                                                                                                                                                      | Tệp swap Redis được chia thành nhiều trang, một đối tượng có thể được lưu trữ trên nhiều trang, nhưng một trang không thể được chia sẻ bởi nhiều đối tượng. Vì vậy, vm-page-size phải được đặt dựa trên kích thước dữ liệu được lưu trữ. Tác giả đề xuất nếu lưu trữ nhiều đối tượng nhỏ, hãy đặt kích thước trang là 32 hoặc 64 byte; nếu lưu trữ đối tượng lớn, hãy sử dụng trang lớn hơn. Nếu không chắc chắn, hãy sử dụng giá trị mặc định. |
| `vm-pages 134217728`                                                                                                                                                                                                   | Đặt số lượng trang trong tệp swap, vì bảng trang (bitmap biểu thị trang trống hoặc sử dụng) được lưu trữ trong bộ nhớ, mỗi 8 trang trên đĩa sẽ sử dụng 1 byte bộ nhớ.                                                                                                                                                                                     |
| `vm-max-threads 4`                                                                                                                                                                                                     | Đặt số luồng truy cập vào tệp swap, tốt nhất không vượt quá số lõi của máy, nếu đặt thành 0, tất cả các hoạt động trên tệp swap sẽ tuần tự, có thể gây ra độ trễ lâu. Mặc định là 4.                                                                                                                                                                       |
| `glueoutputbuf yes`                                                                                                                                                                                                    | Đặt xem liệu Redis có gộp các gói nhỏ thành một gói lớn khi trả lời khách hàng hay không. Mặc định là bật.                                                                                                                                                                                |
| `hash-max-zipmap-entries 64 hash-max-zipmap-value 512`                                                                                                                                                                 | Chỉ định xem liệu Redis có sử dụng thuật toán băm đặc biệt khi số lượng mục vượt quá một ngưỡng nhất định hoặc giá trị lớn nhất vượt quá một ngưỡng nhất định hay không.                                                                                                                                                                               |
| `activerehashing yes`                                                                                                                                                                                                  | Chỉ định xem Redis có kích hoạt việc băm lại dữ liệu hay không. Mặc định là bật (sẽ được giải thích cụ thể khi phân tích thuật toán băm Redis).                                                                                                                                              |
| `include /path/to/local.conf`                                                                                                                                                                                          | Chỉ định tệp cấu hình bao gồm, bạn có thể sử dụng cùng một tệp cấu hình cho nhiều phiên bản Redis trên cùng một máy, nhưng mỗi phiên bản Redis vẫn có tệp cấu hình riêng của mình.                                                                                                                                                                    |

### Kiểm tra hiệu suất

> Tham khảo tài liệu chính thức: [How fast is Redis?](https://redis.io/topics/benchmarks)

Redis đi kèm với một công cụ kiểm tra hiệu suất: `redis-benchmark`

**(1) Kiểm tra cơ bản**

```shell
redis-benchmark -q -n 100000
```

- `-q` thực hiện ở chế độ yên lặng
- `-n 100000` yêu cầu 100.000 lần

**(2) Kiểm tra các lệnh đọc và ghi cụ thể**

```shell
$ redis-benchmark -t set,lpush -n 100000 -q
SET: 74239.05 requests per second
LPUSH: 79239.30 requests per second
```

**(3) Kiểm tra chế độ pipeline với các lệnh đọc và ghi cụ thể**

```shell
redis-benchmark -n 1000000 -t set,get -P 16 -q
SET: 403063.28 requests per second
GET: 508388.41 requests per second
```

## 3. Sử dụng và cấu hình Redis Cluster

Redis từ phiên bản 3.0 trở đi hỗ trợ chế độ Cluster.

### Qui hoạch Cluster

Redis Cluster thường được hình thành từ **nhiều node**, số lượng node ít nhất phải là 6 để đảm bảo hình thành một Cluster **hoàn chỉnh và có khả năng sẵn sàng cao**.

Trong trường hợp lý tưởng, mỗi node sẽ được đặt trên các máy chủ khác nhau. Tuy nhiên, trong trường hợp tài nguyên hạn chế, tôi chỉ có 3 máy chủ khi triển khai Redis Cluster. Vì vậy, tôi đã lên kế hoạch triển khai 2 node Redis trên mỗi máy chủ.

【Ví dụ】Kế hoạch triển khai Redis Cluster đơn giản nhưng có khả năng sẵn sàng cao nhất

Cấu hình máy chủ: 16G RAM + 8 nhân CPU + 1T ổ cứng

Mỗi quá trình Redis được cấp phát 10G RAM. Trong môi trường sản xuất trực tuyến, hãy cố gắng không vượt quá 10G RAM cho Redis, vì vượt quá 10G có thể gây ra vấn đề.

Topology của Cluster: Ba master và ba slave; ba Sentinel, mỗi Sentinel lắng nghe tất cả các master node.

Ước tính hiệu suất:

- Dung lượng: Ba master chiếm 30G RAM, do đó dung lượng lưu trữ tối đa là 30G. Giả sử kích thước trung bình của mỗi bản ghi dữ liệu là 10K, điều này có nghĩa là tối đa có thể lưu trữ 3 triệu bản ghi dữ liệu.
- Thông lượng: Trên một máy chủ, TPS/QPS thông thường là khoảng 50.000 đến 80.000. Giả sử là 50.000, vậy ba master và ba slave lý thuyết có thể đạt được TPS 150.000 và QPS 300.000.

### Triển khai Cluster

> Việc cài đặt các node trong Redis Cluster tương tự như cài đặt dịch vụ đơn lẻ, khác biệt chỉ nằm ở cách triển khai.
>
> Lưu ý: Để tiện cho việc trình bày, ví dụ này sẽ triển khai tất cả các node Redis Cluster trên cùng một máy chủ. Tuy nhiên, trong môi trường sản xuất thực tế, thì thường sẽ triển khai các node trên các máy chủ khác nhau. Đối với yêu cầu cao hơn, có thể cần xem xét triển khai trên nhiều trung tâm dữ liệu.

(1) Tạo thư mục cho các node

Tôi thường đặt phần mềm trong thư mục `/opt`, trên máy tính của tôi, Redis được cài đặt trong thư mục `/usr/local/redis`. Vì vậy, các lệnh và cấu hình dưới đây giả định rằng thư mục cài đặt Redis là `/usr/local/redis`.

Đảm bảo rằng máy chủ đã cài đặt Redis, thực hiện các lệnh sau để tạo thư mục cho các instance của node Redis Cluster:

```shell
sudo mkdir -p /usr/local/redis/conf/7001
sudo mkdir -p /usr/local/redis/conf/7002
sudo mkdir -p /usr/local/redis/conf/7003
sudo mkdir -p /usr/local/redis/conf/7004
sudo mkdir -p /usr/local/redis/conf/7005
sudo mkdir -p /usr/local/redis/conf/7006
```

(2) Cấu hình các node Cluster

Trong mỗi thư mục instance, tạo tệp cấu hình `redis.conf`.

Dưới đây là mẫu cấu hình cho node 7001 (thay thế số cổng 7001 bằng số cổng của các node khác):

```shell
# Số cổng
port 7001
# Số cổng máy chủ được ràng buộc (0.0.0.0 cho phép truy cập từ xa)
bind 0.0.0.0
# Khởi động dưới dạng tiến trình nền
daemonize yes

# Bật chế độ Cluster
cluster-enabled yes
# Tệp cấu hình cho Cluster, tệp cấu hình sẽ được tạo tự động khi khởi động lần đầu
cluster-config-file /usr/local/redis/conf/7001/7001.conf
# Thời gian chờ yêu cầu, thiết lập 10 giây
cluster-node-timeout 10000

# Bật chế độ AOF
appendonly yes
# Thư mục lưu trữ dữ liệu
dir /usr/local/redis/conf/7001
# Tệp tiến trình
pidfile /usr/local/redis/conf/7001/7001.pid
# Tệp nhật ký
logfile /usr/local/redis/conf/7001/7001.log
```

(3) Khởi động các node Redis

Redis đi kèm với một tập lệnh `create-cluster` trong thư mục utils/create-cluster, nó cho phép tạo, khởi động, dừng và khởi động lại các node Redis.

Có một số tham số quan trọng trong tập lệnh này:

- `PORT`=30000 - Số cổng ban đầu
- `TIMEOUT`=2000 - Thời gian chờ
- `NODES`=6 - Số node
- `REPLICAS`=1 - Số bản sao

Mỗi lệnh trong tập lệnh này sẽ thực hiện các thao tác dựa trên số cổng ban đầu và số node đã được cấu hình.

Vì các cổng của các node đã được lên kế hoạch từ 7001 đến 7006, nên cần thay đổi biến PORT thành 7000.

Để khởi động các node Redis, chúng ta cần sửa đổi như sau:

```shell
PORT=7000
TIMEOUT=2000
NODES=6
ENDPORT=$((PORT+NODES))

# ...

if [ "$1" == "start" ]
then
    while [ $((PORT < ENDPORT)) != "0" ]; do
        PORT=$((PORT+1))
        echo "Starting $PORT"
        /usr/local/redis/src/redis-server /usr/local/redis/conf/${PORT}/redis.conf
    done
    exit 0
fi
```

Sau đó, trên mỗi máy chủ, chạy `./create-cluster start` để khởi động các node.

Sau đó, sử dụng lệnh `ps` để kiểm tra xem tiến trình Redis đã hoạt động chưa:

```shell
$ ps -ef | grep redis
root      4604     1  0 11:07 ?        00:00:00 /opt/redis/src/redis-server 0.0.0.0:7001 [cluster]
root      4609     1  0 11:07 ?        00:00:00 /opt/redis/src/redis-server 0.0.0.0:7002 [cluster]
root      4614     1  0 11:07 ?        00:00:00 /opt/redis/src/redis-server 0.0.0.0:7003 [cluster]
root      4619     1  0 11:07 ?        00:00:00 /opt/redis/src/redis-server 0.0.0.0:7004 [cluster]
root      4624     1  0 11:07 ?        00:00:00 /opt/redis/src/redis-server 0.0.0.0:7005 [cluster]
root      4629     1  0 11:07 ?        00:00:00 /opt/redis/src/redis-server 0.0.0.0:7006 [cluster]
```

(4) Khởi động Cluster

Sử dụng lệnh `redis-cli --cluster create` để tự động cấu hình Cluster:

```shell
./redis-cli --cluster create 127.0.0.1:7001 127.0.0.1:7002 127.0.0.2:7003 127.0.0.2:7004 127.0.0.3:7005 127.0.0.3:7006 --cluster-replicas 1
```

Redis Cluster sẽ tự động phân chia các slot (hash slot) dựa trên số node và số bản sao đã được cấu hình. Nếu bạn hài lòng với kết quả, nhập "yes" để bắt đầu phân chia.

```
>>> Performing hash slots allocation on 6 nodes...
Master[0] -> Slots 0 - 5460
Master[1] -> Slots 5461 - 10922
Master[2] -> Slots 10923 - 16383
Adding replica 127.0.0.2:7004 to 127.0.0.1:7001
Adding replica 127.0.0.3:7006 to 127.0.0.2:7003
Adding replica 127.0.0.1:7002 to 127.0.0.3:7005
M: b721235997deb6b9a7a2be690b5b9663db8057c6 127.0.0.1:7001
   slots:[0-5460] (5461 slots) master
S: bda9b7036df0bbefe601bda4ce45d3787a2e9bd9 127.0.0.1:7002
   replicates 3623fff69b5243ed18c02a2fbb6f53069b0f1505
M: 91523c0391a044da6cc9f53bb965aabe89502187 127.0.0.2:7003
   slots:[5461-10922] (5462 slots) master
S: 9d899cbe49dead7b8c4f769920cdb75714a441ae 127.0.0.2:7004
   replicates b721235997deb6b9a7a2be690b5b9663db8057c6
M: 3623fff69b5243ed18c02a2fbb6f53069b0f1505 127.0.0.3:7005
   slots:[10923-16383] (5461 slots) master
S: a2869dc153ea4977ca790b76483574a5d56cb40e 127.0.0.3:7006
   replicates 91523c0391a044da6cc9f53bb965aabe89502187
Can I set the above configuration? (type 'yes' to accept): yes
>>> Nodes configuration updated
>>> Assign a different config epoch to each node
>>> Sending CLUSTER MEET messages to join the cluster
Waiting for the cluster to join
....
>>> Performing Cluster Check (using node 127.0.0.1:7001)
M: b721235997deb6b9a7a2be690b5b9663db8057c6 127.0.0.1:7001
   slots:[0-5460] (5461 slots) master
   1 additional replica(s)
S: a2869dc153ea4977ca790b76483574a5d56cb40e 127.0.0.1:7006
   slots: (0 slots) slave
   replicates 91523c0391a044da6cc9f53bb965aabe89502187
M: 91523c0391a044da6cc9f53bb965aabe89502187 127.0.0.1:7003
   slots:[5461-10922] (5462 slots) master
   1 additional replica(s)
M: 3623fff69b5243ed18c02a2fbb6f53069b0f1505 127.0.0.1:7005
   slots:[10923-16383] (5461 slots) master
   1 additional replica(s)
S: 9d899cbe49dead7b8c4f769920cdb75714a441ae 127.0.0.1:7004
   slots: (0 slots) slave
   replicates b721235997deb6b9a7a2be690b5b9663db8057c6
S: bda9b7036df0bbefe601bda4ce45d3787a2e9bd9 127.0.0.1:7002
   slots: (0 slots) slave
   replicates 3623fff69b5243ed18c02a2fbb6f53069b0f1505
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
```

(5) Thao tác bảo trì hàng ngày

- Dừng Cluster - `./create-cluster stop`
- Kiểm tra sức khỏe của Cluster (chỉ cần chỉ định một node bất kỳ): `./redis-cli --cluster check <ip:port>`
- Thử sửa chữa các node trong Cluster: `./redis-cli --cluster fix <ip:port>`

### Triển khai Sentinel

Redis Cluster đã giải quyết vấn đề phân tán và sao chép dữ liệu trong Redis.

Tuy nhiên, Redis Cluster không giải quyết vấn đề chuyển giao lỗi. Khi một node Master bị sự cố, mất kết nối mạng, Redis Cluster sẽ không hoạt động. Để giải quyết vấn đề này, Redis cung cấp Redis Sentinel để giám sát trạng thái của các node Redis và tổ chức cuộc bầu cử để chọn một Slave node làm Master khi Master gặp sự cố.

(1) Tạo thư mục cho các node

Tôi thường đặt phần mềm trong thư mục `/opt`, trên máy tính của tôi, Redis được cài đặt trong thư mục `/usr/local/redis`. Vì vậy, các lệnh và cấu hình dưới đây giả định rằng thư mục cài đặt Redis là `/usr/local/redis`.

Đảm bảo rằng máy chủ đã cài đặt Redis, thực hiện các lệnh sau để tạo thư mục cho các instance của node Sentinel:

```shell
sudo mkdir -p /usr/local/redis/conf/27001
sudo mkdir -p /usr/local/redis/conf/27002
sudo mkdir -p /usr/local/redis/conf/27003
```

(2) Cấu hình các node Sentinel

Trong mỗi thư mục instance, tạo tệp cấu hình `sentinel.conf`.

Dưới đây là mẫu cấu hình cho node 27001 (thay thế số cổng 27001 bằng số cổng của các node khác):

```shell
port 27001
daemonize yes
sentinel monitor redis-master 172.22.6.3 7001 2
sentinel down-after-milliseconds redis-master 5000
sentinel failover-timeout redis-master 900000
sentinel parallel-syncs redis-master 1
#sentinel auth-pass redis-master 123456
logfile /usr/local/redis/conf/27001/27001.log
```

(3) Khởi động các node Sentinel

```
/opt/redis/src/redis-sentinel /usr/local/redis/conf/27001/sentinel.conf
/opt/redis/src/redis-sentinel /usr/local/redis/conf/27002/sentinel.conf
/opt/redis/src/redis-sentinel /usr/local/redis/conf/27003/sentinel.conf
```

### Mở rộng Cluster

(1) Xem thông tin

Truy cập vào bất kỳ nút nào

```
./redis-cli -h 172.22.6.3 -p 7001
```

cluster info để xem trạng thái các nút trong cụm

```
172.22.6.3:7001> cluster nodes
f158bf70bb2767cac271ce4efcfc14ba0b7ca98b 172.22.6.3:7006@17006 slave e7aa182e756b76ec85b471797db9b66e4b2da725 0 1594528179000 6 connected
f348e67648460c7a800120d69b4977bf2e4524cb 172.22.6.3:7001@17001 myself,master - 0 1594528179000 1 connected 0-5460
52601e2d4af0e64b83f4cc6d20e8316d0ac38b99 172.22.6.3:7004@17004 slave 4802fafe897160c46392c6e569d6f5e466cca696 0 1594528178000 4 connected
c6c6a68674ae8aac3c6ec792c8af4dc1228c6c31 172.22.6.3:7005@17005 slave f348e67648460c7a800120d69b4977bf2e4524cb 0 1594528179852 5 connected
e7aa182e756b76ec85b471797db9b66e4b2da725 172.22.6.3:7002@17002 master - 0 1594528178000 2 connected 5461-10922
4802fafe897160c46392c6e569d6f5e466cca696 172.22.6.3:7003@17003 master - 0 1594528178000 3 connected 10923-16383
```

cluster info để xem thông tin cụm

```
172.22.6.3:7001> cluster info
cluster_state:ok
cluster_slots_assigned:16384
cluster_slots_ok:16384
cluster_slots_pfail:0
cluster_slots_fail:0
cluster_known_nodes:6
cluster_size:3
cluster_current_epoch:6
cluster_my_epoch:1
cluster_stats_messages_ping_sent:3406
cluster_stats_messages_pong_sent:3569
cluster_stats_messages_publish_sent:5035
cluster_stats_messages_sent:12010
cluster_stats_messages_ping_received:3564
cluster_stats_messages_pong_received:3406
cluster_stats_messages_meet_received:5
cluster_stats_messages_publish_received:5033
cluster_stats_messages_received:12008
```

(2) Thêm nút vào cụm

Thêm các phiên bản nút đã được khởi động vào cụm

```
redis-cli --cluster add-node 127.0.0.1:7007 127.0.0.1:7008
```

**Thêm nút chính**

Thêm một nhóm nút chính

```
./redis-cli --cluster add-node 172.22.6.3:7007 172.22.6.3:7001
./redis-cli --cluster add-node 172.22.6.3:7008 172.22.6.3:7001
./redis-cli --cluster add-node 172.22.6.3:7009 172.22.6.3:7001
```

Xem trạng thái nút

```
172.22.6.3:7001> cluster nodes
f158bf70bb2767cac271ce4efcfc14ba0b7ca98b 172.22.6.3:7006@17006 slave e7aa182e756b76ec85b471797db9b66e4b2da725 0 1594529342575 6 connected
f348e67648460c7a800120d69b4977bf2e4524cb 172.22.6.3:7001@17001 myself,master - 0 1594529340000 1 connected 0-5460
55cacf121662833a4a19dbeb4a5df712cfedf77f 172.22.6.3:7009@17009 master - 0 1594529342000 0 connected
c6c6a68674ae8aac3c6ec792c8af4dc1228c6c31 172.22.6.3:7005@17005 slave f348e67648460c7a800120d69b4977bf2e4524cb 0 1594529341573 5 connected
4802fafe897160c46392c6e569d6f5e466cca696 172.22.6.3:7003@17003 master - 0 1594529343577 3 connected 10923-16383
e7aa182e756b76ec85b471797db9b66e4b2da725 172.22.6.3:7002@17002 master - 0 1594529342000 2 connected 5461-10922
e5ba78fe629115977a74fbbe1478caf8868d6d55 172.22.6.3:7007@17007 master - 0 1594529341000 0 connected
52601e2d4af0e64b83f4cc6d20e8316d0ac38b99 172.22.6.3:7004@17004 slave 4802fafe897160c46392c6e569d6f5e466cca696 0 1594529340000 4 connected
79d4fffc2cec210556c3b4c44e63ab506e87eda3 172.22.6.3:7008@17008 master - 0 1594529340000 7 connected
```

Có thể thấy, ba nút chính mới được thêm vào vẫn chưa được phân chia các hash slot, vì vậy tạm thời vẫn không thể truy cập.

**Thêm nút phụ**

--slave: Đặt tham số này, sau đó nút mới sẽ tham gia vào cụm với vai trò slave  
--master-id: Tham số này cần được đặt khi đã đặt --slave, --master-id được sử dụng để chỉ định nút chủ cho nút mới. Nếu không đặt tham số này, nút sẽ được chọn ngẫu nhiên cho nút chủ.

Cú pháp

```
redis-cli --cluster add-node  Địa chỉ IP của nút mới: Cổng    Địa chỉ IP của nút hiện có: Cổng --cluster-slave (nút phụ) --cluster-master-id (ID của nút chính)
redis-cli --cluster add-node   10.42.141.119:6379  10.42.166.105:6379  --cluster-slave   --cluster-master-id  dfa238fff8a7a49230cff7eb74f573f5645c8ec5
```

Ví dụ

```
./redis-cli --cluster add-node 172.22.6.3:7010 172.22.6.3:7007 --cluster-slave
./redis-cli --cluster add-node 172.22.6.3:7011 172.22.6.3:7008 --cluster-slave
./redis-cli --cluster add-node 172.22.6.3:7012 172.22.6.3:7009 --cluster-slave
```

Xem trạng thái

```
172.22.6.3:7001> cluster nodes
ef5c1b9ce4cc795dc12b2c1e8736a572647b4c3e 172.22.6.3:7011@17011 slave 79d4fffc2cec210556c3b4c44e63ab506e87eda3 0 1594529492043 7 connected
f158bf70bb2767cac271ce4efcfc14ba0b7ca98b 172.22.6.3:7006@17006 slave e7aa182e756b76ec85b471797db9b66e4b2da725 0 1594529491943 6 connected
f348e67648460c7a800120d69b4977bf2e4524cb 172.22.6.3:7001@17001 myself,master - 0 1594529488000 1 connected 0-5460
5140d1129ed850df59c51cf818c4eb74545d9959 172.22.6.3:7010@17010 slave e5ba78fe629115977a74fbbe1478caf8868d6d55 0 1594529488000 0 connected
55cacf121662833a4a19dbeb4a5df712cfedf77f 172.22.6.3:7009@17009 master - 0 1594529488000 8 connected
c6c6a68674ae8aac3c6ec792c8af4dc1228c6c31 172.22.6.3:7005@17005 slave f348e67648460c7a800120d69b4977bf2e4524cb 0 1594529490000 5 connected
4802fafe897160c46392c6e569d6f5e466cca696 172.22.6.3:7003@17003 master - 0 1594529489939 3 connected 10923-16383
e7aa182e756b76ec85b471797db9b66e4b2da725 172.22.6.3:7002@17002 master - 0 1594529491000 2 connected 5461-10922
e5ba78fe629115977a74fbbe1478caf8868d6d55 172.22.6.3:7007@17007 master - 0 1594529490942 0 connected
52601e2d4af0e64b83f4cc6d20e8316d0ac38b99 172.22.6.3:7004@17004 slave 4802fafe897160c46392c6e569d6f5e466cca696 0 1594529491000 4 connected
02e9f57b5b45c350dc57acf1c8efa8db136db7b7 172.22.6.3:7012@17012 master - 0 1594529489000 0 connected
79d4fffc2cec210556c3b4c44e63ab506e87eda3 172.22.6.3:7008@17008 master - 0 1594529489000 7 connected
```

Phân chia hash slot

Chạy `./redis-cli --cluster rebalance 172.22.6.3:7001 --cluster-threshold 1 --cluster-use-empty-masters`

Giải thích các tham số:

rebalance: Cho phép Redis tự động cân bằng phân chia hash slot dựa trên số lượng nút.

--cluster-use-empty-masters: Chỉ định rằng các nút chủ trống sẽ được sử dụng.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230725005340.png)

Sau khi thực hiện xong, kiểm tra trạng thái:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230725005345.png)

## 4. Lệnh Redis

### Lệnh chung

> Để biết chi tiết về cách sử dụng các lệnh, vui lòng tham khảo [**Tài liệu chính thức về lệnh Redis**](https://redis.io/commands)
>
> Di chuyển hai hình cheat sheet, nguồn: [https://www.cheatography.com/tasjaevan/cheat-sheets/redis/](https://www.cheatography.com/tasjaevan/cheat-sheets/redis/)

### Lệnh cụm

- **Cụm**
    - `cluster info` - In thông tin về cụm
    - `cluster nodes` - Liệt kê tất cả các nút hiện có trong cụm và thông tin liên quan đến các nút này.
- **Nút**
    - `cluster meet <ip> <port>` - Thêm nút được chỉ định bởi ip và port vào cụm, biến nó thành một thành viên của cụm.
    - `cluster forget <node_id>` - Xóa nút được chỉ định bởi node_id khỏi cụm.
    - `cluster replicate <node_id>` - Đặt nút hiện tại là một nút con của nút được chỉ định bởi node_id.
    - `cluster saveconfig` - Lưu cấu hình của nút vào đĩa cứng.
- **Khe (slot)**
    - `cluster addslots <slot> [slot …]` - Gán một hoặc nhiều khe (slot) cho nút hiện tại.
    - `cluster delslots <slot> [slot …]` - Xóa gán khe (slot) cho nút hiện tại.
    - `cluster flushslots` - Xóa tất cả các khe (slot) đã gán cho nút hiện tại, biến nút hiện tại thành một nút không có khe nào được gán.
    - `cluster setslot <slot> node <node_id>` - Gán khe (slot) cho nút được chỉ định bởi node_id. Nếu khe (slot) đã được gán cho một nút khác, trước tiên hãy yêu cầu nút khác xóa khe (slot) đó, sau đó mới gán.
    - `cluster setslot <slot> migrating <node_id>` - Di chuyển khe (slot) của nút hiện tại sang nút được chỉ định bởi node_id.
    - `cluster setslot <slot> importing <node_id>` - Nhập khe (slot) từ nút được chỉ định bởi node_id vào nút hiện tại.
    - `cluster setslot <slot> stable` - Hủy bỏ việc nhập (import) hoặc di chuyển (migrate) khe (slot) đã gán.
- **Khóa**
    - `cluster keyslot <key>` - Tính toán khe (slot) mà khóa key nên được đặt vào.
    - `cluster countkeysinslot <slot>` - Trả về số lượng cặp khóa-giá trị hiện có trong khe (slot) được chỉ định.
    - `cluster getkeysinslot <slot> <count>` - Trả về count khóa trong khe (slot) được chỉ định.

#### Tái phân vùng

Thêm nút:

```
./redis-cli --cluster add-node 192.168.1.136:7007 192.168.1.136:7001 --cluster-slave

redis-cli --cluster reshard 172.22.6.3 7001
```

## 5. Client

Đề xuất sử dụng [**RedisDesktopManager**](https://github.com/uglide/RedisDesktopManager)
