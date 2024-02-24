---
title: Elastic Stack Logstash
tags:
  - elastic
  - logstash
categories: 
date created: 2024-02-24
date modified: 2024-02-24
---

# Elastic Stack: Logstash

> Bài viết này tập trung vào Logstash, một thành phần của Elastic Technology Stack (ELK).
>
> Nếu bạn không quen với cách cài đặt, cấu hình và triển khai Elastic, bạn có thể tham khảo hướng dẫn: [[Elastic Quick Start|Bắt đầu nhanh với Elastic Technology Stack]])

## Giới thiệu

Logstash được sử dụng để vận chuyển và xử lý các logs, giao dịch hoặc dữ liệu khác của bạn.

### Tính năng

Logstash là ống dẫn dữ liệu tốt nhất cho Elasticsearch.

Logstash tuân theo kiến trúc dựa trên plugin, cho phép tùy chỉnh thông qua các plugin ở các giai đoạn input, filter, output và codec. Cộng đồng Logstash cung cấp hơn 200 plugin có sẵn.

### Cách hoạt động

Logstash bao gồm ba yếu tố cơ bản: `input`, `filter` và `output`. Có một yếu tố tùy chọn là `codec`.

Ba yếu tố này đại diện cho ba giai đoạn xử lý sự kiện của Logstash: input > filter > output.

![img](https://www.elastic.co/guide/en/logstash/current/static/images/basic_logstash_pipeline.png)

- `input` có trách nhiệm thu thập dữ liệu từ nguồn dữ liệu.
- `filter` sửa đổi dữ liệu thành định dạng hoặc nội dung được chỉ định.
- `output` chuyển dữ liệu đến đích của nó.

Trong các kịch bản thực tế, thường có nhiều input, output và filter. Logstash cho phép người dùng chọn và kết hợp các plugin cho mỗi giai đoạn dựa trên nhu cầu ứng dụng của họ.

Chi tiết về các plugin sẽ được thảo luận sau.

## Cấu hình

### Tệp cấu hình

- **`logstash.yml`**: Tệp cấu hình khởi động mặc định cho Logstash.
- **`jvm.options`**: Tệp cấu hình JVM cho Logstash.
- **`startup.options`** (Linux): Chứa các tùy chọn được sử dụng bởi tập lệnh cài đặt hệ thống trong `/usr/share/logstash/bin` để xây dựng các tập lệnh khởi động phù hợp cho hệ thống của bạn. Tập lệnh cài đặt hệ thống được thực thi trong quá trình cài đặt và đặt các tùy chọn như người dùng, nhóm, tên dịch vụ và mô tả dịch vụ dựa trên các thiết lập được chỉ định trong `startup.options`.

### Cài đặt logstash.yml

Dưới đây là một số cài đặt được chọn lọc. Để biết thêm tùy chọn, vui lòng tham khảo: [https://www.elastic.co/guide/en/logstash/current/logstash-settings-file.html](https://www.elastic.co/guide/en/logstash/current/logstash-settings-file.html)

| Tham số                    | Mô tả                                                                                                                                                                                                                                                                                                                                                         | Giá trị mặc định                                                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `node.name`                | Tên của node.                                                                                                                                                                                                                                                                                                                                                 | Tên máy chủ                                                                                                                                 |
| `path.data`                | Thư mục nơi Logstash và các plugin lưu trữ bất kỳ dữ liệu lưu trữ nào mà chúng cần.                                                                                                                                                                                                                                                                           | `LOGSTASH_HOME/data`                                                                                                                        |
| `pipeline.workers`         | Số luồng worker thực thi các giai đoạn filter và output của pipeline đồng thời. Nếu sự kiện đang chờ hoặc CPU không được tận dụng đầy đủ, hãy xem xét tăng số này để tận dụng tốt hơn khả năng xử lý của máy tính.                                                                                                                                            | Số lõi CPU của máy chủ                                                                                                                      |
| `pipeline.batch.size`      | Số sự kiện tối đa được thu thập bởi một luồng worker duy nhất từ input trước khi thực hiện filter và output. Kích thước batch lớn hơn thường thực hiện tốt hơn nhưng đi kèm với tăng trưởng bộ nhớ. Bạn có thể cần tăng kích thước heap JVM một cách hiệu quả bằng cách sử dụng biến `LS_HEAP_SIZE`.                                                          | `125`                                                                                                                                       |
| `pipeline.batch.delay`     | Thời gian (theo mili giây) mà mỗi sự kiện chờ trước khi một batch sự kiện, có kích thước nhỏ hơn kích thước batch, được gửi đến tác vụ worker của pipeline.                                                                                                                                                                                                   | `5`                                                                                                                                         |
| `pipeline.unsafe_shutdown` | Nếu đặt thành `true`, Logstash sẽ buộc thoát trong quá trình tắt ngay cả khi vẫn còn sự kiện đang xử lý trong bộ nhớ. Mặc định, Logstash từ chối thoát cho đến khi tất cả các sự kiện đã nhận được được đẩy vào output. Bật tùy chọn này có thể dẫn đến mất dữ liệu trong quá trình tắt.                                                                      | `false`                                                                                                                                     |
| `path.config`              | Đường dẫn đến cấu hình Logstash cho pipeline chính. Nếu bạn chỉ định một thư mục hoặc ký tự đại diện, các tệp cấu hình sẽ được đọc từ thư mục theo thứ tự bảng chữ cái.                                                                                                                                                                                       | Đặcific cho từng nền tảng. Xem [[dir-layout\]](https://github.com/elastic/logstash/blob/6.1/docs/static/settings-file.asciidoc#dir-layout). |
| `config.string`            | Một chuỗi chứa cấu hình pipeline cho pipeline chính. Sử dụng cú pháp giống như tệp cấu hình.                                                                                                                                                                                                                                                                  | Không có                                                                                                                                    |
| `config.test_and_exit`     | Khi đặt thành `true`, kiểm tra tính hợp lệ của cấu hình và sau đó thoát. Lưu ý rằng việc sử dụng cài đặt này không kiểm tra tính chính xác của các mẫu grok. Logstash có thể đọc nhiều tệp cấu hình từ một thư mục. Khi kết hợp với `log.level: debug`, Logstash sẽ ghi lại cấu hình kết hợp và chú thích các khối cấu hình từ các tệp nguồn của nó.          | `false`                                                                                                                                     |
| `config.reload.automatic`  | Khi đặt thành `true`, kiểm tra định kỳ các thay đổi trong cấu hình và tải lại cấu hình khi phát hiện thay đổi. Điều này cũng có thể được kích hoạt thủ công bằng tín hiệu SIGHUP.                                                                                                                                                                             | `false`                                                                                                                                     |
| `config.reload.interval`   | Khoảng thời gian mà Logstash kiểm tra các tệp cấu hình để tìm thay đổi.                                                                                                                                                                                                                                                                                       | `3s`                                                                                                                                        |
| `config.debug`             | Khi đặt thành `true`, hiển thị cấu hình đã được biên dịch hoàn chỉnh dưới dạng thông báo ghi log debug. Bạn cũng phải đặt `log.level: debug`. Cảnh báo: Tin nhắn ghi log sẽ bao gồm bất kỳ tùy chọn "password" nào được truyền cho các cấu hình plugin dưới dạng văn bản thuần và có thể dẫn đến xuất hiện mật khẩu dạng văn bản thuần trong nhật ký của bạn! | `false`                                                                                                                                     |
| `config.support_escapes`   | Khi đặt thành `true`, các chuỗi được trích dẫn sẽ xử lý các ký tự thoát.                                                                                                                                                                                                                                                                                      | `false`                                                                                                                                     |
| `modules`                  | Các modules phải là cấu trúc YAML lồng nhau như đã mô tả trong bảng trên.                                                                                                                                                                                                                                                                                     | Không có                                                                                                                                    |
| `http.host`                | Địa chỉ kết nối.                                                                                                                                                                                                                                                                                                                                              | `"127.0.0.1"`                                                                                                                               |
| `http.port`                | Cổng kết nối.                                                                                                                                                                                                                                                                                                                                                 | `9600`                                                                                                                                      |
| `log.level`                | Cấp độ ghi log. Tùy chọn hợp lệ: fatal > error > warn > info > debug > trace                                                                                                                                                                                                                                                                                  | `info`                                                                                                                                      |
| `log.format`               | Định dạng ghi log. Tùy chọn: json (định dạng JSON) hoặc plain (đối tượng ban đầu)                                                                                                                                                                                                                                                                             | `plain`                                                                                                                                     |
| `path.logs`                | Đường dẫn lưu trữ cho các nhật ký của Logstash.                                                                                                                                                                                                                                                                                                               | `LOGSTASH_HOME/logs`                                                                                                                        |
| `path.plugins`             | Nơi tìm các plugin tùy chỉnh. Bạn có thể chỉ định cài đặt này nhiều lần để bao gồm nhiều đường dẫn.                                                                                                                                                                                                                                                           |                                                                                                                                             |

## Khởi động

### Dòng lệnh

Cách khởi động Logstash thông qua dòng lệnh như sau:

```shell
bin/logstash [options]
```

Trong đó `options` là các cờ dòng lệnh mà bạn có thể chỉ định để điều khiển việc thực thi của Logstash.

Bất kỳ cờ nào được đặt trên dòng lệnh sẽ ghi đè lên các cài đặt tương ứng trong tệp cấu hình của Logstash (`logstash.yml`), tuy nhiên tệp cấu hình không bị thay đổi.

> **Chú ý**
>
> Mặc dù có thể điều khiển cách Logstash chạy bằng cách chỉ định các tham số dòng lệnh, nhưng rõ ràng là cách này rất phức tạp.
>
> Đề nghị sử dụng cách chỉ định tệp cấu hình để điều khiển việc chạy Logstash, lệnh khởi động như sau:
>
> ```shell
> bin/logstash -f logstash.conf
> ```
>
> Nếu bạn muốn tìm hiểu thêm chi tiết về các tham số dòng lệnh, vui lòng tham khảo: <https://www.elastic.co/guide/en/logstash/current/running-logstash-command-line.html>

### Tệp cấu hình

Trong phần trước, chúng ta đã biết rằng Logstash có thể được thực thi bằng lệnh: `bin/logstash -f logstash.conf`, nó sẽ ghi đè các cài đặt mặc định trong tệp cấu hình (`logstash.yml`) bằng các tham số trong tệp cấu hình.

Ở phần này, chúng ta sẽ tìm hiểu cách cấu hình các tham số trong tệp cấu hình này.

#### Cấu trúc tệp cấu hình

Trong phần làm việc của Logstash mà chúng ta đã biết ở trước đó, Logstash chia quá trình làm việc thành ba giai đoạn chính: đầu vào (input), bộ lọc (filter) và đầu ra (output). Và cấu trúc tệp cấu hình của Logstash cũng tương ứng với ba giai đoạn này:

```javascript
input {}

filter {}

output {}
```

> Mỗi phần chứa một hoặc nhiều tùy chọn cấu hình cho các plugin. Nếu có nhiều bộ lọc được chỉ định, chúng sẽ được áp dụng theo thứ tự xuất hiện trong tệp cấu hình.

#### Cấu hình plugin

Cấu hình của plugin bao gồm tên plugin và một khối cài đặt của plugin.

Dưới đây là ví dụ về cấu hình hai plugin đầu vào:

```javascript
input {
  file {
    path => "/var/log/messages"
    type => "syslog"
  }

  file {
    path => "/var/log/apache/access.log"
    type => "apache"
  }
}
```

Bạn có thể cấu hình các giá trị tùy chỉnh tùy thuộc vào loại plugin. Bạn có thể tham khảo: [Các plugin đầu vào](https://www.elastic.co/guide/en/logstash/current/input-plugins.html), [Các plugin đầu ra](https://www.elastic.co/guide/en/logstash/current/output-plugins.html), [Các plugin bộ lọc](https://www.elastic.co/guide/en/logstash/current/filter-plugins.html) và [Các plugin codec](https://www.elastic.co/guide/en/logstash/current/codec-plugins.html).

#### Kiểu giá trị

Một plugin có thể yêu cầu giá trị của cài đặt là một kiểu giá trị cụ thể, chẳng hạn như giá trị boolean, danh sách hoặc giá trị băm. Dưới đây là các loại giá trị được hỗ trợ.

- Mảng

```javascript
users => [ {id => 1, name => bob}, {id => 2, name => jane} ]
```

- Danh sách

```javascript
path => ['/var/log/messages', '/var/log/*.log']
uris => ['http://elastic.co', 'http://example.net']
```

- Boolean

```javascript
ssl_enable => true
```

- Bytes

```javascript
my_bytes => "1113"   # 1113 byte
my_bytes => "10MiB"  # 10485760 byte
my_bytes => "100kib" # 102400 byte
my_bytes => "180 mb" # 180000000 byte
```

- Codec

```javascript
codec => 'json'
```

- Hash

```javascript
match => {
  "field1" => "value1"
  "field2" => "value2"
  ...
}
```

- Số

```javascript
port => 33
```

- Mật khẩu

```javascript
my_password => 'password'
```

- URI

```javascript
my_uri => 'http://foo:bar@example.net'
```

- Đường dẫn

```javascript
my_path => '/tmp/logstash'
```

- Chuỗi
- Ký tự thoát

## Plugin

### input (đầu vào)

> Logstash hỗ trợ các lựa chọn đầu vào đa dạng, cho phép bạn thu thập sự kiện từ nhiều nguồn thông qua luồng liên tục. Bạn có thể dễ dàng thu thập dữ liệu từ nhật ký, số liệu, ứng dụng web, lưu trữ dữ liệu và các dịch vụ AWS khác.

#### Các plugin đầu vào phổ biến

- **file**: Đọc từ file trên hệ thống tệp, tương tự như lệnh UNIX `tail -0F`.
- **syslog**: Nghe các tin nhắn nhật ký hệ thống trên cổng 514 được biết đến và phân tích theo định dạng RFC3164.
- **redis**: Đọc từ máy chủ redis, sử dụng kênh redis và danh sách redis. Redis thường được sử dụng như một "proxy" trong cài đặt Logstash tập trung, cho phép xếp hàng sự kiện Logstash từ "người gửi" Logstash từ xa.
- **beats**: Xử lý các sự kiện được gửi bởi Filebeat.

Xem thêm chi tiết tại: [Các plugin đầu vào](https://www.elastic.co/guide/en/logstash/current/input-plugins.html)

### filter (bộ lọc)

> Bộ lọc là các thiết bị xử lý trung gian trong đường ống Logstash. Bạn có thể kết hợp các bộ lọc điều kiện lại với nhau để thực hiện các hoạt động trên sự kiện nếu nó đáp ứng các điều kiện cụ thể.

#### Các plugin bộ lọc phổ biến

- **grok**: Phân tích cú pháp và cấu trúc dữ liệu văn bản tùy ý. Hiện tại, Grok là phương pháp tốt nhất trong Logstash để phân tích dữ liệu nhật ký không cấu trúc thành dạng có cấu trúc và có thể truy vấn được.
- **mutate**: Thực hiện các biến đổi chung trên trường sự kiện. Bạn có thể đổi tên, xóa, thay thế và sửa đổi các trường trong sự kiện.
- **drop**: Hoàn toàn bỏ qua một sự kiện, ví dụ: sự kiện gỡ lỗi.
- **clone**: Tạo một bản sao của sự kiện, có thể thêm hoặc xóa trường.
- **geoip**: Thêm thông tin về vị trí địa lý của địa chỉ IP (cũng có thể hiển thị biểu đồ tuyệt vời trong Kibana!).

Xem thêm chi tiết tại: [Các plugin bộ lọc](https://www.elastic.co/guide/en/logstash/current/filter-plugins.html)

### output (đầu ra)

> Đầu ra là giai đoạn cuối cùng của đường ống Logstash. Một sự kiện có thể được đưa qua nhiều đầu ra, nhưng khi tất cả các đầu ra đã xử lý xong, sự kiện được coi là đã hoàn thành.

#### Các plugin đầu ra phổ biến

- **elasticsearch**: Gửi dữ liệu sự kiện đến Elasticsearch (chế độ được khuyến nghị).
- **file**: Ghi dữ liệu sự kiện vào tệp hoặc đĩa.
- **graphite**: Gửi dữ liệu sự kiện đến graphite (một công cụ mã nguồn mở phổ biến để lưu trữ và vẽ biểu đồ chỉ số. <http://graphite.readthedocs.io/en/latest/>).
- **statsd**: Gửi dữ liệu sự kiện đến statsd (đây là một dịch vụ lắng nghe dữ liệu thống kê như bộ đếm và đồng hồ bằng cách gửi qua UDP và gửi tổng hợp đến một hoặc nhiều backend service có thể cắm được).

Xem thêm chi tiết tại: [Các plugin đầu ra](https://www.elastic.co/guide/en/logstash/current/output-plugins.html)

### codec (mã hóa)

Được sử dụng để định dạng nội dung tương ứng.

#### Các plugin codec phổ biến

- **json**: Mã hóa hoặc giải mã dữ liệu theo định dạng JSON.
- **multiline**: Kết hợp các sự kiện văn bản nhiều dòng (ví dụ: lỗi Java và thông báo theo dõi ngăn xếp) thành một sự kiện duy nhất.

Xem thêm plugin tại: [Các plugin codec](https://www.elastic.co/guide/en/logstash/current/codec-plugins.html)

## Thực hành

Phần trước đây đã giới thiệu về Logstash và giải thích về nguyên lý hoạt động. Tiếp theo, chúng ta sẽ thực hành một số kịch bản ứng dụng phổ biến.

### Truyền dữ liệu từ bảng điều khiển

> Plugin đầu vào stdin đọc sự kiện từ đầu vào tiêu chuẩn. Đây là plugin đầu vào đơn giản nhất, thường được sử dụng cho các kịch bản kiểm tra.

**Cách sử dụng**

(1) Tạo tệp `logstash-input-stdin.conf`:

```javascript
input { stdin { } }
output {
  elasticsearch { hosts => ["localhost:9200"] }
  stdout { codec => rubydebug }
}
```

Bạn có thể tham khảo thêm các tùy chọn cấu hình tại: <https://www.elastic.co/guide/en/logstash/current/plugins-inputs-stdin.html>

(2) Chạy logstash bằng cách sử dụng `-f` để chỉ định tệp cấu hình của bạn:

```shell
bin/logstash -f logstash-input-stdin.conf
```

Ví dụ này cho thấy cách sử dụng plugin đầu vào stdin của Logstash để đọc sự kiện từ đầu vào tiêu chuẩn và truyền dữ liệu sự kiện đến Elasticsearch (sử dụng plugin đầu ra elasticsearch) và bảng điều khiển (sử dụng plugin stdout). Bạn có thể tùy chỉnh các tham số khác trong tệp cấu hình theo nhu cầu của bạn.

Lưu ý rằng ví dụ này chủ yếu được sử dụng cho các kịch bản kiểm tra, bạn có thể nhập thủ công dữ liệu sự kiện và quan sát kết quả xử lý của Logstash.

### Truyền log từ logback

> ELK mặc định sử dụng công cụ ghi nhật ký Java là log4j2, không hỗ trợ logback và log4j.
>
> Để sử dụng logback + logstash, bạn có thể sử dụng [logstash-logback-encoder](https://github.com/logstash/logstash-logback-encoder). [logstash-logback-encoder](https://github.com/logstash/logstash-logback-encoder) cung cấp các cách truyền dữ liệu nhật ký đến logstash bằng UDP / TCP / bất đồng bộ.
>
> Nếu bạn đang sử dụng log4j, bạn cũng có thể sử dụng cách này bằng cách chỉ cần nhập gói cầu nối. Nếu bạn không quen thuộc với log4j, logback hoặc gói cầu nối, bạn có thể tham khảo bài viết của tôi: [Giới thiệu về các thư viện ghi nhật ký chính trong Java](https://github.com/dunwu/JavaStack/blob/master/docs/javalib/java-log.md).

#### Ứng dụng TCP

Cấu hình logstash

(1) Tạo tệp `logstash-input-tcp.conf`:

```javascript
input {
tcp {
  port => 9251
  codec => json_lines
  mode => server
}
}
output {
 elasticsearch { hosts => ["localhost:9200"] }
 stdout { codec => rubydebug }
}
```

Bạn có thể tham khảo thêm các tùy chọn cấu hình tại: <https://www.elastic.co/guide/en/logstash/current/plugins-inputs-tcp.html>

(2) Chạy logstash bằng cách sử dụng `-f` để chỉ định tệp cấu hình của bạn: `bin/logstash -f logstash-input-udp.conf`

Cấu hình ứng dụng Java

(1) Trong tệp pom.xml của ứng dụng Java, nhập gói jar:

```xml
<dependency>
 <groupId>net.logstash.logback</groupId>
 <artifactId>logstash-logback-encoder</artifactId>
 <version>4.11</version>
</dependency>

<!-- Gói phụ thuộc logback -->
<dependency>
 <groupId>ch.qos.logback</groupId>
 <artifactId>logback-core</artifactId>
 <version>1.2.3</version>
</dependency>
<dependency>
 <groupId>ch.qos.logback</groupId>
 <artifactId>logback-classic</artifactId>
 <version>1.2.3</version>
</dependency>
<dependency>
 <groupId>ch.qos.logback</groupId>
 <artifactId>logback-access</artifactId>
 <version>1.2.3</version>
</dependency>
```

(2) Tiếp theo, trong logback.xml, thêm appender:

```xml
<appender name="ELK-TCP" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
 <!--
 destination là host:port của dịch vụ logstash,
 tương đương với việc thiết lập đường ống với logstash để truyền dữ liệu nhật ký
 -->
 <destination>192.168.28.32:9251</destination>
 <encoder charset="UTF-8" class="net.logstash.logback.encoder.LogstashEncoder"/>
</appender>
<logger name="io.github.dunwu.spring" level="TRACE" additivity="false">
 <appender-ref ref="ELK-TCP" />
</logger>
```

(3) Tiếp theo, sử dụng logback cụ thể. Nếu bạn không quen thuộc với điều này, bạn có thể tham khảo bài viết của tôi: [Giới thiệu về các thư viện ghi nhật ký chính trong Java](https://github.com/dunwu/JavaStack/blob/master/docs/javalib/java-log.md).

**Ví dụ:** [logback.xml của tôi](https://github.com/dunwu/JavaStack/blob/master/codes/javatool/src/main/resources/logback.xml)

#### Ứng dụng UDP

Cách sử dụng UDP và TCP tương tự nhau.

Cấu hình logstash

(1) Tạo tệp `logstash-input-udp.conf`:

```javascript
input {
udp {
  port => 9250
  codec => json
}
}
output {
 elasticsearch { hosts => ["localhost:9200"] }
 stdout { codec => rubydebug }
}
```

Bạn có thể tham khảo thêm các tùy chọn cấu hình tại: [https://www.elastic.co/guide/en/logstash/current/plugins-inputs-udp.html](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-udp.html)

(2) Chạy logstash bằng cách sử dụng `-f` để chỉ định tệp cấu hình của bạn: `bin/logstash -f logstash-input-udp.conf`

Cấu hình ứng dụng Java

(1) Trong tệp pom.xml của ứng dụng Java, nhập gói jar giống như phần **Ứng dụng TCP**.

(2) Tiếp theo, trong logback.xml, thêm appender:

```xml
<appender name="ELK-UDP" class="net.logstash.logback.appender.LogstashSocketAppender">
  <host>192.168.28.32</host>
  <port>9250</port>
</appender>
<logger name="io.github.dunwu.spring" level="TRACE" additivity="false">
  <appender-ref ref="ELK-UDP" />
</logger>
```

(3) Tiếp theo, sử dụng logback cụ thể. Nếu bạn không quen thuộc với điều này, bạn có thể tham khảo bài viết của tôi: [Giới thiệu về các thư viện ghi nhật ký chính trong Java](https://github.com/dunwu/JavaStack/blob/master/docs/javalib/java-log.md).

### Truyền tệp tin

> Trong lĩnh vực Java Web, chúng ta thường sử dụng một số công cụ quan trọng như Tomcat, Nginx, MySQL, v.v. Đây không phải là các ứng dụng kinh doanh, nhưng dữ liệu nhật ký của chúng cũng rất quan trọng để xác định vấn đề và thống kê phân tích. Trong trường hợp này, không thể sử dụng logback để truyền dữ liệu nhật ký của chúng đến logstash.
>
> Làm thế nào để thu thập các tệp nhật ký này? Đừng lo, bạn có thể sử dụng plugin đầu vào file của logstash.
>
> Lưu ý rằng, phương pháp truyền tệp tin này phải triển khai logstash trên máy chứa nhật ký.

**Thực hành**

Cấu hình logstash

(1) Tạo tệp `logstash-input-file.conf`:

```javascript
input {
 file {
  path => ["/var/log/nginx/access.log"]
  type => "nginx-access-log"
  start_position => "beginning"
 }
}

output {
 if [type] == "nginx-access-log" {
  elasticsearch {
   hosts => ["localhost:9200"]
   index => "nginx-access-log"
  }
 }
}
```

(2) Chạy logstash bằng cách sử dụng `-f` để chỉ định tệp cấu hình của bạn: `bin/logstash -f logstash-input-file.conf`

Bạn có thể tham khảo thêm các tùy chọn cấu hình tại: <https://www.elastic.co/guide/en/logstash/current/plugins-inputs-file.html>

## Mẹo nhỏ

### Khởi động và kết thúc ứng dụng

Nếu bạn phải khởi động logstash bằng cách chỉ định tệp cấu hình mỗi lần, hãy tạo một tập lệnh khởi động.

```shell
# cd xxx để vào thư mục bin trong thư mục cài đặt của logstash
logstash -f logstash.conf
```

Nếu logstash của bạn chạy trên hệ điều hành Linux, hãy sử dụng nohup để khởi động một tiến trình nền. Điều này có lợi vì ứng dụng sẽ tiếp tục chạy ngay cả khi bạn đóng terminal.

**Tạo startup.sh**

```shell
nohup ./logstash -f logstash.conf >> nohup.out 2>&1 &
```

Không có cách tốt để kết thúc ứng dụng, bạn chỉ có thể sử dụng ps -ef | grep logstash để tìm tiến trình và kết thúc nó. Tuy nhiên, chúng ta có thể viết một tập lệnh để làm điều này:

**Tạo shutdown.sh**

Tôi sẽ không giải thích quá nhiều về tập lệnh này, hãy tự hiểu nó.

```shell
PID=`ps -ef | grep logstash | awk '{ print $2}' | head -n 1`
kill -9 ${PID}
```

## Tài liệu

- [Tài liệu chính thức của Logstash](https://www.elastic.co/guide/en/logstash/current/index.html)
- [logstash-logback-encoder](https://github.com/logstash/logstash-logback-encoder)
- [Cài đặt và cấu hình ELK (Elasticsearch, Logstash, Kibana)](https://github.com/judasn/Linux-Tutorial/blob/master/ELK-Install-And-Settings.md)
