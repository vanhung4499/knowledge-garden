---
title: Elasticsearch Operations
tags: 
categories: 
date created: 2024-02-24
date modified: 2024-02-24
---

# Elasticsearch Operations

> [Elasticsearch](https://github.com/elastic/elasticsearch) là một công cụ tìm kiếm và phân tích dữ liệu phân tán, hỗ trợ RESTful, có khả năng giải quyết một số lượng ngày càng tăng các trường hợp sử dụng. Là trung tâm của Elastic Stack, nó lưu trữ dữ liệu của bạn tập trung để tìm kiếm nhanh chóng, tinh chỉnh độ liên quan, và phân tích mạnh mẽ có thể mở rộng dễ dàng.

## Cài đặt Elasticsearch

> [Hướng dẫn tải và cài đặt chính thức của Elasticsearch](https://www.elastic.co/cn/downloads/elasticsearch)

(1) Tải và giải nén

Truy cập [địa chỉ tải chính thức](https://www.elastic.co/cn/downloads/elasticsearch), chọn phiên bản cần thiết, tải và giải nén về máy của bạn.

(2) Chạy

Chạy `bin/elasticsearch` (Trên hệ thống Windows, chạy `bin\elasticsearch.bat`)

(3) Truy cập

Thực hiện `curl http://localhost:9200/` để kiểm tra xem dịch vụ đã khởi động chưa

## Lập kế hoạch cho Cluster Elasticsearch

Cluster Elasticsearch cần được lập kế hoạch một cách hợp lý dựa trên tình hình thực tế của doanh nghiệp.

Các điểm cần xem xét:

- Cần triển khai bao nhiêu node trong cluster?
- Có bao nhiêu index?
- Mỗi index có bao nhiêu dữ liệu?
- Mỗi index có bao nhiêu shard?

Một kế hoạch tham khảo:

- 3 máy, mỗi máy là 6-core 64G.
- Tăng hàng ngày của cluster ES của chúng tôi là khoảng 20 triệu bản ghi, dữ liệu tăng hàng ngày là khoảng 500MB, dữ liệu tăng hàng tháng là khoảng 600 triệu, 15G. Hệ thống đã hoạt động trong vài tháng, và bây giờ tổng lượng dữ liệu trong cluster ES là khoảng 100G.
- Hiện tại có 5 index trực tuyến (điều này được kết hợp với doanh nghiệp của bạn, xem dữ liệu nào của bạn có thể đặt trong ES), mỗi index có khối lượng dữ liệu là khoảng 20G, vì vậy trong khối lượng dữ liệu này, chúng tôi phân bổ 8 shard cho mỗi index, đó là 3 shard nhiều hơn mặc định là 5 shard.

## Cấu hình Elasticsearch

Tệp cấu hình mặc định của ES là `config/elasticsearch.yml`

Dưới đây là một số thông tin cơ bản về cấu hình:

```yml
cluster.name: elasticsearch
# Cấu hình tên cụm của es, mặc định là elasticsearch, es sẽ tự động phát hiện es trong cùng một shard mạng, nếu có nhiều cụm trong cùng một shard mạng, thuộc tính này có thể được sử dụng để phân biệt các cụm khác nhau.
node.name: 'Franz Kafka'
# Tên node, mặc định được chỉ định một cách ngẫu nhiên từ danh sách tên, danh sách này nằm trong tệp name.txt trong thư mục cấu hình trong gói jar es, trong đó có nhiều tên thú vị được thêm bởi các tác giả.
node.master: true
# Xác định node này có đủ điều kiện để được bầu làm node hay không, mặc định là true, es mặc định là máy đầu tiên trong cụm là master, nếu máy này bị treo thì sẽ bầu lại master.
node.data: true
# Xác định node này có lưu trữ dữ liệu index hay không, mặc định là true.
index.number_of_shards: 5
# Đặt số lượng mảnh shard mặc định cho index, mặc định là 5 mảnh.
index.number_of_replicas: 1
# Đặt số lượng bản sao mặc định cho index, mặc định là 1 bản sao.
path.conf: /path/to/conf
# Đặt đường dẫn lưu trữ tệp cấu hình, mặc định là thư mục config trong thư mục gốc es.
path.data: /path/to/data
# Đặt đường dẫn lưu trữ dữ liệu index, mặc định là thư mục data trong thư mục gốc es, có thể đặt nhiều đường dẫn lưu trữ, phân cách bằng dấu phẩy, ví dụ:
#path.data: /path/to/data1,/path/to/data2
path.work: /path/to/work
# Đặt đường dẫn lưu trữ tệp tạm thời, mặc định là thư mục work trong thư mục gốc es.
path.logs: /path/to/logs
# Đặt đường dẫn lưu trữ tệp nhật ký, mặc định là thư mục logs trong thư mục gốc es
path.plugins: /path/to/plugins
# Đặt đường dẫn lưu trữ plugin, mặc định là thư mục plugins trong thư mục gốc es
bootstrap.mlockall: true
# Đặt true để khóa bộ nhớ. Bởi vì khi jvm bắt đầu swapping thì hiệu suất của es sẽ giảm, vì vậy để đảm bảo nó không swap, bạn có thể đặt hai biến môi trường ES_MIN_MEM và ES_MAX_MEM thành cùng một giá trị, và đảm bảo máy có đủ bộ nhớ để phân bổ cho es. Đồng thời, bạn cũng phải cho phép tiến trình elasticsearch có thể khóa bộ nhớ, trên linux bạn có thể sử dụng lệnh `ulimit -l unlimited`.
network.bind_host: 192.168.0.1
# Đặt địa chỉ ip được liên kết, có thể là ipv4 hoặc ipv6, mặc định là 0.0.0.0.
network.publish_host: 192.168.0.1
# Đặt địa chỉ ip mà các node khác và node này tương tác, nếu không đặt nó sẽ tự động xác định, giá trị phải là một địa chỉ ip thực sự.
network.host: 192.168.0.1
# Tham số này được sử dụng để đồng thời đặt bind_host và publish_host ở trên.
transport.tcp.port: 9300
# Đặt cổng tcp để tương tác giữa các node, mặc định là 9300.
transport.tcp.compress: true
# Đặt liệu có nén dữ liệu khi truyền tải tcp hay không, mặc định là false, không nén.
http.port: 9200
# Đặt cổng http phục vụ bên ngoài, mặc định là 9200.
http.max_content_length: 100mb
# Đặt dung lượng tối đa của nội dung, mặc định là 100mb
http.enabled: false
# Có sử dụng giao thức http để cung cấp dịch vụ bên ngoài hay không, mặc định là true, được mở.
gateway.type: local
# Loại gateway, mặc định là local tức là hệ thống tệp cục bộ, có thể đặt là hệ thống tệp cục bộ, hệ thống tệp phân tán, HDFS của hadoop, và máy chủ s3 của amazon, cách đặt hệ thống tệp khác sẽ được nói chi tiết vào lần sau.
gateway.recover_after_nodes: 1
# Đặt số lượng node trong cụm khi khởi động để khôi phục dữ liệu, mặc định là 1.
gateway.recover_after_time: 5m
# Đặt thời gian chờ tối đa để khởi tạo quá trình khôi phục dữ liệu, mặc định là 5 phút.
gateway.expected_nodes: 2
# Đặt số lượng node trong cụm này, mặc định là 2, một khi N node này được khởi động, quá trình khôi phục dữ liệu sẽ được bắt đầu ngay lập tức.
cluster.routing.allocation.node_initial_primaries_recoveries: 4
# Khi khôi phục dữ liệu ban đầu, số lượng luồng khôi phục đồng thời, mặc định là 4.
cluster.routing.allocation.node_concurrent_recoveries: 2
# Khi thêm hoặc xóa node hoặc cân bằng tải, số lượng luồng khôi phục đồng thời, mặc định là 2.
indices.recovery.max_size_per_sec: 0
# Đặt băng thông giới hạn khi khôi phục dữ liệu, ví dụ 100mb, mặc định là 0, tức không giới hạn.
indices.recovery.concurrent_streams: 5
# Đặt tham số này để giới hạn số lượng luồng đồng thời mở tối đa khi khôi phục dữ liệu từ các mảnh khác, mặc định là 5.
discovery.zen.minimum_master_nodes: 1
# Đặt tham số này để đảm bảo rằng các node trong cụm có thể biết được số lượng tối thiểu N node khác có đủ điều kiện làm master. Mặc định là 1, đối với cụm lớn, có thể đặt giá trị lớn hơn một chút (2-4)
discovery.zen.ping.timeout: 3s
# Đặt thời gian chờ kết nối ping khi tự động phát hiện các node khác trong cụm, mặc định là 3 giây, đối với môi trường mạng kém, có thể đặt giá trị cao hơn để ngăn chặn lỗi khi phát hiện tự động.
discovery.zen.ping.multicast.enabled: false
# Đặt liệu có mở phát hiện node đa phát hay không, mặc định là true.
discovery.zen.ping.unicast.hosts: ['host1', 'host2:port', 'host3[portX-portY]']
# Đặt danh sách ban đầu của các node master trong cụm, các node mới tham gia cụm có thể được phát hiện tự động thông qua các node này.
```

## Elasticsearch FAQ

### Elasticsearch không cho phép chạy với quyền root

**Vấn đề:** Trong môi trường Linux, Elasticsearch không cho phép chạy với quyền root.

Nếu bạn chạy Elasticsearch dưới quyền root, bạn sẽ nhận được lỗi sau:

```
can not run elasticsearch as root
```

**Cách giải quyết:** Chạy Elasticsearch dưới tài khoản không có quyền root

```bash
# Tạo nhóm người dùng
groupadd elk
# Tạo người dùng mới, -g elk đặt nhóm người dùng của nó thành elk, -p elk đặt mật khẩu của nó thành elk
useradd elk -g elk -p elk
# Thay đổi chủ sở hữu của thư mục /opt và các tệp bên trong thành elk:elk
chown -R elk:elk /opt # Giả sử bạn đã cài đặt elasticsearch trong thư mục opt
# Chuyển đổi tài khoản
su elk
```

### vm.max_map_count không thấp hơn 262144

**Vấn đề:** `vm.max_map_count` biểu thị kích thước bộ nhớ ảo, đây là một tham số kernel. Elasticsearch yêu cầu `vm.max_map_count` không thấp hơn 262144.

```
max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]
```

**Cách giải quyết:**

Bạn có thể thực hiện lệnh sau để đặt `vm.max_map_count`, nhưng sau khi khởi động lại, nó sẽ trở lại giá trị ban đầu.

```
sysctl -w vm.max_map_count=262144
```

Cách làm lâu dài là sửa đổi tham số `vm.max_map_count` trong tệp `/etc/sysctl.conf`:

```
echo "vm.max_map_count=262144" > /etc/sysctl.conf
sysctl -p
```

> **Lưu ý**
>
> Nếu môi trường chạy là docker container, có thể sẽ hạn chế việc thực hiện sysctl để sửa đổi tham số kernel.
>
> Trong trường hợp này, bạn chỉ có thể chọn sửa đổi tham số trên máy chủ chủ.

### nofile không thấp hơn 65536

**Vấn đề:** `nofile` biểu thị số lượng tệp tối đa mà một quá trình có thể mở. Quá trình Elasticsearch yêu cầu số lượng tệp tối đa có thể mở không thấp hơn 65536.

```
max file descriptors [4096] for elasticsearch process is too low, increase to at least [65536]
```

**Cách giải quyết:**

Sửa đổi tham số `nofile` trong tệp `/etc/security/limits.conf`:

```
echo "* soft nofile 65536" > /etc/security/limits.conf
echo "* hard nofile 131072" > /etc/security/limits.conf
```

### nproc không thấp hơn 2048

**Vấn đề:** `nproc` biểu thị số lượng tối đa của các thread. Elasticsearch yêu cầu số lượng tối đa thread không thấp hơn 2048.

```
max number of threads [1024] for user [user] is too low, increase to at least [2048]
```

**Cách giải quyết:**

Sửa đổi tham số `nproc` trong tệp `/etc/security/limits.conf`:

```
echo "* soft nproc 2048" > /etc/security/limits.conf
echo "* hard nproc 4096" > /etc/security/limits.conf
```

## Tài liệu tham khảo

- [Hướng dẫn tải và cài đặt Elasticsearch chính thức](https://www.elastic.co/cn/downloads/elasticsearch)
- [Cài đặt Elasticsearch với RPM](https://www.elastic.co/guide/en/elasticsearch/reference/current/rpm.html#rpm)
- [Tích lũy sử dụng Elasticsearch](http://siye1982.github.io/2015/09/17/es-optimize/)
