---
title: Logstash Operation
tags:
  - logstash
  - elastic
categories: 
date created: 2024-02-24
date modified: 2024-02-25
---

Dưới đây là bản dịch sang tiếng Việt của đoạn văn bạn yêu cầu:

# Vận hành Logstash

> [Logstash](https://github.com/elastic/logstash) là một pipeline xử lý dữ liệu phía máy chủ mã nguồn mở, có khả năng thu thập dữ liệu từ nhiều nguồn, chuyển đổi dữ liệu và sau đó gửi dữ liệu đến "kho lưu trữ" yêu thích của bạn.

## 1. Cài đặt

### 1.1. Các bước cài đặt

Các bước cài đặt như sau:

(1) Tải xuống gói phiên bản mong muốn từ [địa chỉ tải xuống chính thức của logstash](https://www.elastic.co/downloads/logstash) và giải nén nó vào máy cục bộ.

(2) Thêm tệp `logstash.conf`, chỉ định các plugin bạn muốn sử dụng và cấu hình cho mỗi plugin. Dưới đây là một ví dụ đơn giản:

```
input { stdin { } }
output {
  elasticsearch { hosts => ["localhost:9200"] }
  stdout { codec => rubydebug }
}
```

(3) Chạy lệnh `bin/logstash -f logstash.conf` (trên Windows, chạy `bin/logstash.bat -f logstash.conf`)

## 2. Cấu hình

### 2.1. Tệp cấu hình

- **`logstash.yml`**: Tệp cấu hình khởi động mặc định của logstash.
- **`jvm.options`**: Tệp cấu hình JVM của logstash.
- **`startup.options`** (Linux): Chứa các tùy chọn được sử dụng bởi tập lệnh cài đặt hệ thống trong `/usr/share/logstash/bin` để xây dựng các tập lệnh khởi động phù hợp cho hệ thống của bạn. Khi cài đặt gói logstash, tập lệnh cài đặt hệ thống sẽ được thực thi khi quá trình cài đặt kết thúc và sử dụng các cài đặt được chỉ định trong `startup.options` để đặt người dùng, nhóm, tên dịch vụ và mô tả dịch vụ.

### 2.2. Các mục cấu hình trong logstash.yml

Dưới đây là một số mục cấu hình được trích dẫn, vui lòng xem thêm tại: <https://www.elastic.co/guide/en/logstash/current/logstash-settings-file.html>

| Tham số                    | Mô tả                                                                                                                                                                                                                                                                                                                                                            | Giá trị mặc định                                                                                                                         |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `node.name`                | Tên nút                                                                                                                                                                                                                                                                                                                                                          | Tên máy chủ                                                                                                                              |
| `path.data`                | Thư mục được sử dụng bởi Logstash và các plugin của nó cho bất kỳ nhu cầu lưu trữ nào.                                                                                                                                                                                                                                                                           | `LOGSTASH_HOME/data`                                                                                                                     |
| `pipeline.workers`         | Số lượng nhiệm vụ làm việc đồng thời trong giai đoạn lọc và đầu ra của đường ống. Nếu nhận thấy sự chậm trễ trong xử lý sự kiện hoặc CPU chưa bão hòa, hãy xem xét tăng số này để tận dụng tốt hơn khả năng xử lý của máy.                                                                                                                                       | Số lõi CPU của máy chủ                                                                                                                   |
| `pipeline.batch.size`      | Số lượng sự kiện tối đa mà một luồng làm việc có thể thu thập từ đầu vào trước khi thực hiện giai đoạn lọc và đầu ra. Kích thước lô lớn hơn thường hiệu quả hơn, nhưng với mức độ tiêu thụ bộ nhớ tăng lên. Bạn có thể cần tăng kích thước heap JVM bằng cách đặt biến `LS_HEAP_SIZE`.                                                                           | `125`                                                                                                                                    |
| `pipeline.batch.delay`     | Thời gian chờ giữa mỗi sự kiện để tạo lô sự kiện trong quá trình xử lý ống (theo mili giây).                                                                                                                                                                                                                                                                     | `5`                                                                                                                                      |
| `pipeline.unsafe_shutdown` | Nếu được đặt thành `true`, Logstash sẽ thoát ngay cả khi vẫn còn các sự kiện đang chờ xử lý trong bộ nhớ. Mặc định, Logstash sẽ từ chối thoát cho đến khi tất cả các sự kiện nhận được đã được đẩy ra đầu ra. Bật tùy chọn này có thể dẫn đến mất dữ liệu trong quá trình tắt.                                                                                   | `false`                                                                                                                                  |
| `path.config`              | Đường dẫn cấu hình Logstash chính. Nếu bạn chỉ định một thư mục hoặc ký tự đại diện, các tệp cấu hình sẽ được đọc từ thư mục theo thứ tự chữ cái.                                                                                                                                                                                                                | Phụ thuộc vào nền tảng. Xem [[dir-layout\]](https://github.com/elastic/logstash/blob/6.1/docs/static/settings-file.asciidoc#dir-layout). |
| `config.string`            | Chuỗi chứa cấu hình ống chính. Sử dụng cú pháp giống với tệp cấu hình.                                                                                                                                                                                                                                                                                           | Không có                                                                                                                                 |
| `config.test_and_exit`     | Khi được đặt thành `true`, kiểm tra tính hợp lệ của cấu hình và sau đó thoát. Lưu ý rằng việc sử dụng cài đặt này sẽ không kiểm tra tính hợp lệ của các mẫu grok. Logstash có thể đọc nhiều tệp cấu hình từ một thư mục. Khi kết hợp cài đặt này với `log.level: debug`, Logstash sẽ ghi lại cấu hình được kết hợp và chú thích các khối cấu hình của tệp nguồn. | `false`                                                                                                                                  |
| `config.reload.automatic`  | Khi được đặt thành `true`, Logstash sẽ định kỳ kiểm tra xem tệp cấu hình đã thay đổi và tải lại cấu hình khi có thay đổi. Cũng có thể kích hoạt bằng tay bằng tín hiệu SIGHUP.                                                                                                                                                                                   | `false`                                                                                                                                  |
| `config.reload.interval`   | Khoảng thời gian Logstash kiểm tra thay đổi tệp cấu hình.                                                                                                                                                                                                                                                                                                        | `3s`                                                                                                                                     |
| `config.debug`             | Khi được đặt thành `true`, hiển thị cấu hình đã được biên dịch hoàn chỉnh như một tin nhắn ghi nhật ký gỡ lỗi. Bạn cũng phải đặt `log.level: debug`. Cảnh báo: Tin nhắn ghi nhật ký sẽ bao gồm bất kỳ tùy chọn "mật khẩu" được truyền vào cấu hình plugin dưới dạng văn bản rõ và có thể dẫn đến việc lộ mật khẩu rõ trong nhật ký của bạn!                      | `false`                                                                                                                                  |
| `config.support_escapes`   | Khi được đặt thành `true`, chuỗi được bao quanh bằng dấu ngoặc kép sẽ xử lý các ký tự thoát.                                                                                                                                                                                                                                                                     | `false`                                                                                                                                  |
| `modules`                  | Cấu hình các mô-đun. Các mô-đun phải nằm trong cấu trúc YAML lồng nhau như đã mô tả trong bảng trên.                                                                                                                                                                                                                                                             | Không có                                                                                                                                 |
| `http.host`                | Địa chỉ ràng buộc                                                                                                                                                                                                                                                                                                                                                | `"127.0.0.1"`                                                                                                                            |
| `http.port`                | Cổng ràng buộc                                                                                                                                                                                                                                                                                                                                                   | `9600`                                                                                                                                   |
| `log.level`                | Cấp độ ghi nhật ký. Tùy chọn hợp lệ: fatal > error > warn > info > debug > trace                                                                                                                                                                                                                                                                                 | `info`                                                                                                                                   |
| `log.format`               | Định dạng ghi nhật ký. json (định dạng JSON) hoặc plain (đối tượng gốc)                                                                                                                                                                                                                                                                                          | `plain`                                                                                                                                  |
| `path.logs`                | Đường dẫn lưu trữ nhật ký Logstash chính                                                                                                                                                                                                                                                                                                                         | `LOGSTASH_HOME/logs`                                                                                                                     |
| `path.plugins`             | Đường dẫn để tìm các plugin tùy chỉnh. Bạn có thể chỉ định đường dẫn này nhiều lần để bao gồm nhiều đường dẫn.                                                                                                                                                                                                                                                   |                                                                                                                                          |

## 3. Khởi động

### 3.1. Dòng lệnh

Để khởi động Logstash thông qua dòng lệnh, bạn có thể sử dụng cú pháp sau:

```
bin/logstash [tùy chọn]
```

Ở đây, `tùy chọn` là các cờ dòng lệnh mà bạn có thể chỉ định để điều khiển việc thực thi của Logstash.

Bất kỳ cờ nào được đặt trên dòng lệnh sẽ ghi đè lên các cài đặt tương ứng trong tệp cấu hình Logstash (`logstash.yml`), nhưng tệp cấu hình không bị thay đổi.

> **Lưu ý**
>
> Mặc dù bạn có thể sử dụng các tham số dòng lệnh để điều khiển cách Logstash hoạt động, nhưng thường thì cách này khá phức tạp.
>
> Đề nghị sử dụng cách chỉ định tệp cấu hình để khởi động Logstash. Dưới đây là cú pháp khởi động:
>
> ```
> bin/logstash -f logstash.conf
> ```
>
> Nếu bạn muốn tìm hiểu thêm về các tùy chọn dòng lệnh chi tiết, vui lòng tham khảo: [https://www.elastic.co/guide/en/logstash/current/running-logstash-command-line.html](https://www.elastic.co/guide/en/logstash/current/running-logstash-command-line.html)

### 3.2. Tệp cấu hình

Như đã đề cập ở phần trước, bạn có thể điều khiển cách Logstash hoạt động bằng cách chỉ định tệp cấu hình, tệp này sẽ ghi đè lên các cài đặt mặc định trong tệp cấu hình Logstash (`logstash.yml`).

Trong phần này, chúng ta sẽ tìm hiểu cách cấu hình tệp cấu hình này.

#### 3.2.1. Cấu trúc tệp cấu hình

Như đã biết ở phần làm việc của Logstash, Logstash có ba giai đoạn chính là đầu vào (input), bộ lọc (filter) và đầu ra (output). Tệp cấu hình Logstash cũng tương ứng với cấu trúc này:

```
input {}

filter {}

output {}
```

> Mỗi phần chứa các tùy chọn cấu hình cho một hoặc nhiều plugin. Nếu chỉ định nhiều bộ lọc, chúng sẽ được áp dụng theo thứ tự hiển thị trong tệp cấu hình.

#### 3.2.2. Cấu hình plugin

Cấu hình của plugin bao gồm tên plugin và một khối cài đặt của plugin đó.

Dưới đây là một ví dụ về cấu hình hai plugin đầu vào:

```
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

Bạn có thể cấu hình các tùy chọn khác nhau cho từng loại plugin. Bạn có thể tham khảo: [Các plugin đầu vào](https://www.elastic.co/guide/en/logstash/current/input-plugins.html), [Các plugin đầu ra](https://www.elastic.co/guide/en/logstash/current/output-plugins.html), [Các plugin bộ lọc](https://www.elastic.co/guide/en/logstash/current/filter-plugins.html) và [Các plugin codec](https://www.elastic.co/guide/en/logstash/current/codec-plugins.html).

#### 3.2.3. Kiểu giá trị

Một plugin có thể yêu cầu giá trị của cài đặt là một kiểu giá trị cụ thể, chẳng hạn như boolean, danh sách hoặc băm (hash). Các kiểu giá trị sau được hỗ trợ.

- Mảng (Array)

```
users => [ {id => 1, name => bob}, {id => 2, name => jane} ]
```

- Danh sách (Lists)

```
path => [ "/var/log/messages", "/var/log/*.log" ]
uris => [ "http://elastic.co", "http://example.net" ]
```

- Boolean

```
ssl_enable => true
```

- Bytes

```
my_bytes => "1113"   # 1113 bytes
my_bytes => "10MiB"  # 10485760 bytes
my_bytes => "100kib" # 102400 bytes
my_bytes => "180 mb" # 180000000 bytes
```

- Codec

```
codec => "json"
```

- Băm (Hash)

```
match => {
  "field1" => "value1"
  "field2" => "value2"
  ...
}
```

- Số (Number)

```
port => 33
```

- Mật khẩu (Password)

```
my_password => "password"
```

- URI

```
my_uri => "http://foo:bar@example.net"
```

- Đường dẫn (Path)

```
my_path => "/tmp/logstash"
```

- Chuỗi (String)
- Ký tự thoát (Escape Characters)

## 5. Thực hành

Những phần trước đã giới thiệu và giải thích về Logstash và nguyên lý hoạt động của nó. Bây giờ, chúng ta sẽ thực hành một số kịch bản ứng dụng phổ biến.

### 5.1. Truyền dữ liệu từ bàn phím

> Plugin đầu vào stdin input đọc sự kiện từ đầu vào tiêu chuẩn. Đây là plugin đầu vào đơn giản nhất, thường được sử dụng cho các kịch bản kiểm tra.

**Ứng dụng**

(1) Tạo tệp `logstash-input-stdin.conf`:

```
input { stdin { } }
output {
  elasticsearch { hosts => ["localhost:9200"] }
  stdout { codec => rubydebug }
}
```

Bạn có thể tham khảo thêm các tùy chọn cấu hình tại: [https://www.elastic.co/guide/en/logstash/current/plugins-inputs-stdin.html](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-stdin.html)

(2) Chạy Logstash bằng cách sử dụng `-f` để chỉ định tệp cấu hình của bạn:

```
bin/logstash -f logstash-input-stdin.conf
```

### 5.2. Truyền logback logs

> ELK mặc định sử dụng log4j2 là công cụ ghi log Java, không hỗ trợ logback và log4j.
>
> Để sử dụng logback + logstash, bạn có thể sử dụng [logstash-logback-encoder](https://github.com/logstash/logstash-logback-encoder). [logstash-logback-encoder](https://github.com/logstash/logstash-logback-encoder) cung cấp các cách truyền dữ liệu nhật ký từ logback tới logstash bằng UDP / TCP / bất đồng bộ.
>
> Nếu bạn đang sử dụng log4j, bạn cũng có thể sử dụng cách này bằng cách chỉ cần nhập jar bridge. Nếu bạn không quen biết với log4j, logback hoặc jar bridge, bạn có thể tham khảo bài viết của tôi: [Đánh giá các thư viện ghi log Java phổ biến](https://github.com/dunwu/JavaStack/blob/master/docs/javalib/java-log.md).

#### 5.2.1. Ứng dụng TCP

Cấu hình Logstash:

(1) Tạo tệp `logstash-input-tcp.conf`:

```
input {
  tcp {
    host => "127.0.0.1"
    port => 9250
    mode => "server"
    tags => ["tags"]
    codec => json_lines
  }
}
output {
  elasticsearch { hosts => ["localhost:9200"] }
  stdout { codec => rubydebug }
}
```

Bạn có thể tham khảo thêm các tùy chọn cấu hình tại: [https://www.elastic.co/guide/en/logstash/current/plugins-inputs-tcp.html](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-tcp.html)

(2) Chạy Logstash bằng cách sử dụng `-f` để chỉ định tệp cấu hình của bạn: `bin/logstash -f logstash-input-tcp.conf`

Cấu hình ứng dụng Java:

(1) Thêm các jar dependency vào file pom.xml của ứng dụng Java:

```xml
<dependency>
 <groupId>net.logstash.logback</groupId>
 <artifactId>logstash-logback-encoder</artifactId>
 <version>4.11</version>
</dependency>

<!-- Dependencies for logback -->
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

(2) Tiếp theo, thêm appender vào file logback.xml:

```xml
<appender name="ELK-TCP" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
 <destination>192.168.28.32:9251</destination>
 <encoder charset="UTF-8" class="net.logstash.logback.encoder.LogstashEncoder"/>
</appender>
<logger name="io.github.dunwu.spring" level="TRACE" additivity="false">
 <appender-ref ref="ELK-TCP" />
</logger>
```

Sau đó, tất cả các thông tin nhật ký từ gói `io.github.dunwu.spring` với mức TRACE trở lên sẽ được truyền đến dịch vụ Logstash.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/3101171-cd876d79a14955b0.png)

Tiếp theo, bạn cần sử dụng logback. Nếu bạn không quen với logback, bạn có thể tham khảo bài viết của tôi: [Đánh giá các thư viện ghi log Java phổ biến](https://github.com/dunwu/JavaStack/blob/master/docs/javalib/java-log.md).

**Ví dụ:** [logback.xml của tôi](https://github.com/dunwu/JavaStack/blob/master/codes/javatool/src/main/resources/logback.xml)

#### 5.2.2. Ứng dụng UDP

Cách sử dụng UDP và TCP tương tự nhau.

Cấu hình Logstash:

(1) Tạo tệp `logstash-input-udp.conf`:

```
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

(2) Chạy Logstash bằng cách sử dụng `-f` để chỉ định tệp cấu hình của bạn: `bin/logstash -f logstash-input-udp.conf`

Cấu hình ứng dụng Java:

(1) Thêm các jar dependency vào file pom.xml của ứng dụng Java:

Tương tự như phần **Ứng dụng TCP**.

(2) Tiếp theo, thêm appender vào file logback.xml:

```xml
<appender name="ELK-UDP" class="net.logstash.logback.appender.LogstashSocketAppender">
  <host>192.168.28.32</host>
  <port>9250</port>
</appender>
<logger name="io.github.dunwu.spring" level="TRACE" additivity="false">
  <appender-ref ref="ELK-UDP" />
</logger>
```

(3) Tiếp theo, bạn cần sử dụng logback. Nếu bạn không quen với logback, bạn có thể tham khảo bài viết của tôi: [Đánh giá các thư viện ghi log Java phổ biến](https://github.com/dunwu/JavaStack/blob/master/docs/javalib/java-log.md).

**Ví dụ:** [logback.xml của tôi](https://github.com/dunwu/JavaStack/blob/master/codes/javatool/src/main/resources/logback.xml)

### 5.3. Truyền dữ liệu từ tệp

> Trong lĩnh vực Java Web, chúng ta thường cần sử dụng một số công cụ quan trọng như Tomcat, Nginx, Mysql, v.v. Những công cụ này không phải là ứng dụng kinh doanh, nhưng dữ liệu nhật ký của chúng cũng rất quan trọng để xác định vấn đề và phân tích thống kê. Khi đó, việc truyền dữ liệu nhật ký từ logback tới logstash không khả thi.
>
> Làm thế nào để thu thập các tệp nhật ký này? Đừng lo, bạn có thể sử dụng plugin đầu vào file input của Logstash.
>
> Lưu ý rằng, cách truyền dữ liệu từ tệp này yêu cầu bạn phải triển khai Logstash trên máy chứa nhật ký.

**Ứng dụng**

Cấu hình Logstash:

(1) Tạo tệp `logstash-input-file.conf`:

```
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

(2) Chạy Logstash bằng cách sử dụng `-f` để chỉ định tệp cấu hình của bạn: `bin/logstash -f logstash-input-file.conf`

Bạn có thể tham khảo thêm các tùy chọn cấu hình tại: [https://www.elastic.co/guide/en/logstash/current/plugins-inputs-file.html](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-file.html)

## 6. Khuyến nghị

### 6.1. Khởi động và dừng ứng dụng

Nếu bạn thường khởi động Logstash bằng cách chỉ định tệp cấu hình mỗi lần, bạn có thể tạo một tập lệnh khởi động.

```
# Chuyển đến thư mục bin trong thư mục cài đặt Logstash
cd /đường/dẫn/logstash/bin
./logstash -f logstash.conf
```

Nếu Logstash của bạn chạy trên hệ điều hành Linux, bạn có thể sử dụng nohup để khởi động một tiến trình ngầm. Điều này giúp ứng dụng vẫn chạy ngay cả khi bạn đóng terminal.

Tạo tệp startup.sh:

```
nohup ./logstash -f logstash.conf >> nohup.out 2>&1 &
```

Không có cách tốt để dừng ứng dụng, bạn chỉ có thể sử dụng lệnh `ps -ef | grep logstash` để tìm tiến trình và sử dụng lệnh `kill` để kết thúc nó. Tuy nhiên, bạn có thể viết một tập lệnh để làm việc này:

Tạo tệp shutdown.sh:

```
PID=`ps -ef | grep logstash | awk '{ print $2}' | head -n 1`
kill -9 ${PID}
```

## 7. Tài liệu tham khảo

- [Trang chủ Logstash](https://www.elastic.co/cn/products/logstash)
- [Logstash trên Github](https://github.com/elastic/logstash)
- [Tài liệu chính thức Logstash](https://www.elastic.co/guide/en/logstash/current/index.html)
- [logstash-logback-encoder](https://github.com/logstash/logstash-logback-encoder)
- [Hướng dẫn cài đặt và cấu hình ELK (Elasticsearch, Logstash, Kibana)](https://github.com/judasn/Linux-Tutorial/blob/master/ELK-Install-And-Settings.md)
