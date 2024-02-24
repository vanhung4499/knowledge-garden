---
title: Elastic Stack Filebeat
tags:
  - elastic
  - filebeat
categories: 
date created: 2024-02-24
date modified: 2024-02-24
---

# Elastic Stack và Filebeat

## Giới thiệu

Beats là các đại lý truyền dữ liệu được cài đặt trên máy chủ.

Beats có thể truyền dữ liệu trực tiếp đến Elasticsearch hoặc đến Logstash.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/beats-platform.png)  

Beats có nhiều loại, bạn có thể chọn loại phù hợp với nhu cầu thực tế của bạn.

Các loại phổ biến bao gồm:

- **Packetbeat:** Trình phân tích gói dữ liệu mạng, cung cấp thông tin về các giao dịch được trao đổi giữa các máy chủ ứng dụng của bạn.
- **Filebeat:** Gửi các tệp nhật ký từ máy chủ của bạn.
- **Metricbeat:** Là một đại lý giám sát máy chủ, thu thập định kỳ các chỉ số từ hệ điều hành và dịch vụ đang chạy trên máy chủ.
- **Winlogbeat:** Cung cấp nhật ký sự kiện Windows.

> **Tham khảo**
>
> Các loại Beats khác có thể tham khảo tại: [community-beats](https://www.elastic.co/guide/en/beats/libbeat/current/community-beats.html)
>
> **Chú ý**
>
> Vì tôi chỉ sử dụng FileBeat trong công việc, nên nội dung sau chỉ giới thiệu về FileBeat.

### FileBeat có tác dụng gì?

So với Logstash, FileBeat nhẹ nhàng hơn.

Trong bất kỳ môi trường nào, ứng dụng đều có khả năng bị tắt. Filebeat đọc và chuyển tiếp các dòng nhật ký, nếu bị gián đoạn, nó sẽ nhớ tất cả các sự kiện ở vị trí khi trạng thái trực tuyến được khôi phục.

Filebeat có các mô-đun nội bộ (auditd, Apache, Nginx, System và MySQL) để đơn giản hóa việc thu thập, phân tích và trực quan hóa định dạng nhật ký phổ biến.

FileBeat không làm quá tải ống dẫn của bạn. Nếu FileBeat truyền dữ liệu đến Logstash, khi Logstash bận xử lý dữ liệu, nó sẽ thông báo cho FileBeat làm chậm tốc độ đọc. Khi tình trạng tắc nghẽn được giải quyết, FileBeat sẽ trở lại tốc độ ban đầu và tiếp tục truyền dữ liệu.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/filebeat.png)

## Cài đặt

Đối với hệ thống Unix / Linux, bạn nên cài đặt theo cách sau vì nó khá phổ biến.

```bash
wget https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-6.1.1-linux-x86_64.tar.gz
tar -zxf filebeat-6.1.1-linux-x86_64.tar.gz
```

> **Tham khảo**
>
> Để biết thêm thông tin, bạn có thể tham khảo: [filebeat-installation](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-installation.html)

## Cấu hình

### Tệp cấu hình

Đầu tiên, điều cần biết là: `filebeat.yml` là tệp cấu hình của Filebeat. Đường dẫn của tệp cấu hình có thể thay đổi tùy thuộc vào cách bạn cài đặt.

Tất cả các sản phẩm trong loạt Beat đều dựa trên định dạng cấu hình [YAML](http://www.yaml.org/), và FileBeat cũng không phải là ngoại lệ.

Ví dụ về một phần cấu hình filebeat.yml:

```yaml
filebeat:
  prospectors:
    - type: log
      paths:
        - /var/log/*.log
      multiline:
        pattern: '^['
        match: after
```

> **Tham khảo**
>
> Để biết thêm về cấu hình Filebeat, bạn có thể tham khảo: [Cấu hình Filebeat](https://www.elastic.co/guide/en/beats/filebeat/current/configuring-howto-filebeat.html)
>
> Để biết thêm về định dạng tệp filebeat.yml, bạn có thể tham khảo: [Định dạng tệp filebeat.yml](https://www.elastic.co/guide/en/beats/libbeat/6.1/config-file-format.html)

### Các mục cấu hình quan trọng

#### filebeat.prospectors

(Trình theo dõi tệp) được sử dụng để chỉ định các tệp cần quan tâm.

**Ví dụ**

```yaml
filebeat.prospectors:
  - type: log
    enabled: true
    paths:
      - /var/log/*.log
```

#### output.elasticsearch

Nếu bạn muốn Filebeat trực tiếp xuất dữ liệu đến Elasticsearch, bạn cần cấu hình output.elasticsearch.

**Ví dụ**

```yaml
output.elasticsearch:
  hosts: ['192.168.1.42:9200']
```

#### output.logstash

Nếu bạn muốn Filebeat xuất dữ liệu đến Logstash, sau đó Logstash sẽ xuất dữ liệu đến Elasticsearch, bạn cần cấu hình output.logstash.

> **Lưu ý**
>
> So với xuất dữ liệu đến Elasticsearch, tôi khuyên bạn nên xuất dữ liệu đến Logstash.
>
> Bởi vì khi Logstash và Filebeat làm việc cùng nhau, nếu Logstash bận xử lý dữ liệu, nó sẽ thông báo cho FileBeat làm chậm tốc độ đọc. Một khi tình trạng tắc nghẽn được giải quyết, FileBeat sẽ trở lại tốc độ ban đầu và tiếp tục truyền dữ liệu. Như vậy, có thể giảm bớt tình trạng quá tải ống dẫn.

**Ví dụ**

```yaml
output.logstash:
  hosts: ['127.0.0.1:5044']
```

Ngoài ra, bạn cũng cần chỉ định plugin đầu vào beats trong tệp cấu hình Logstash (như logstash.conf):

```yaml
input {
  beats {
    port => 5044 # Cổng này cần phải giống với cổng trong filebeat.yml
  }
}

# Phần filter của tệp này được bình luận để chỉ ra rằng nó là
# tùy chọn.
# filter {
#
# }

output {
  elasticsearch {
    hosts => "localhost:9200"
    manage_template => false
    index => "%{[@metadata][beat]}-%{[@metadata][version]}-%{+YYYY.MM.dd}"
    document_type => "%{[@metadata][type]}"
  }
}
```

#### setup.kibana

Nếu bạn dự định sử dụng bảng điều khiển Kibana do Filebeat cung cấp, bạn cần cấu hình setup.kibana.

**Ví dụ**

```yaml
setup.kibana:
  host: 'localhost:5601'
```

#### setup.template.settings

Trong Elasticsearch, [mẫu chỉ mục](https://www.elastic.co/guide/en/elasticsearch/reference/6.1/indices-templates.html) được sử dụng để định nghĩa cài đặt và ánh xạ, để xác định cách phân tích các trường.

Trong Filebeat, setup.template.settings được sử dụng để cấu hình mẫu chỉ mục.

Filebeat gợi ý mẫu chỉ mục được cài đặt bởi gói phần mềm Filebeat. Nếu bạn chấp nhận cấu hình mặc định trong tệp cấu hình filebeat.yml, Filebeat tự động tải mẫu sau khi kết nối thành công với Elasticsearch.

Bạn có thể vô hiệu hóa tải mẫu tự động hoặc tải mẫu của riêng bạn bằng cách cấu hình các tùy chọn tải mẫu trong tệp cấu hình Filebeat. Bạn cũng có thể đặt tùy chọn để thay đổi tên chỉ mục và mẫu chỉ mục.

> **Tham khảo**
>
> Để biết thêm thông tin, bạn có thể tham khảo: [filebeat-template](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-template.html)
>
> **Chú ý**
>
> Nếu không cần thiết, hãy sử dụng mẫu chỉ mục mặc định trong tệp cấu hình Filebeat.

#### setup.dashboards

Filebeat đi kèm với các bảng điều khiển Kibana mẫu. Trước khi sử dụng bảng điều khiển, bạn cần tạo mẫu chỉ mục `filebeat-*` và tải bảng điều khiển vào Kibana. Để làm điều này, bạn có thể chạy lệnh `setup` hoặc cấu hình tải bảng điều khiển trong tệp `filebeat.yml`.

Để tải bảng điều khiển Filebeat vào Kibana, bạn cần bật chức năng trong cấu hình `filebeat.yml`:

```
setup.dashboards.enabled: true
```

> **Tham khảo**
>
> Để biết thêm thông tin, bạn có thể tham khảo: [configuration-dashboards](https://www.elastic.co/guide/en/beats/filebeat/current/configuration-dashboards.html)

## Lệnh

Filebeat cung cấp một loạt các lệnh để hoàn thành nhiều chức năng.

Cách thực hiện lệnh:

```bash
./filebeat COMMAND
```

> **Tham khảo**
>
> Để biết thêm thông tin, bạn có thể tham khảo: [command-line-options](https://www.elastic.co/guide/en/beats/filebeat/current/command-line-options.html)
>
> **Chú ý**
>
> Theo quan điểm cá nhân, không cần phải nắm bắt tất cả các lệnh, bởi vì hầu hết các chức năng đều có thể được hoàn thành thông qua cấu hình. Hơn nữa, việc chỉ định chức năng thông qua dòng lệnh đòi hỏi phải nhập cùng một tham số mỗi lần, điều này không thuận lợi cho việc khởi động cố định.
>
> Quan trọng nhất, tất nhiên, là lệnh khởi động run.
>
> **Ví dụ** Khởi động bằng cách chỉ định tệp cấu hình
>
> ```bash
> ./filebeat run -e -c filebeat.yml -d "publish"
> ./filebeat -e -c filebeat.yml -d "publish" # run có thể bỏ qua
> ```

## Module

Filebeat cung cấp một bộ module được xây dựng sẵn, cho phép bạn triển khai giải pháp giám sát log nhanh chóng và đi kèm với các bảng điều khiển mẫu và trực quan hóa dữ liệu. Những module này hỗ trợ các định dạng log phổ biến như Nginx, Apache2 và MySQL, v.v.

### Các bước để chạy module

- Cấu hình elasticsearch và kibana

```
output.elasticsearch:
  hosts: ["myEShost:9200"]
  username: "elastic"
  password: "elastic"
setup.kibana:
  host: "mykibanahost:5601"
  username: "elastic"
  password: "elastic
```

> username và password là tùy chọn, nếu không cần xác thực thì không cần điền.

- Khởi tạo môi trường

Chạy lệnh dưới đây, Filebeat sẽ tải mẫu chỉ mục được gợi ý.

```
./filebeat setup -e
```

- Chỉ định module

Chạy lệnh dưới đây, chỉ định module bạn muốn tải.

```
./filebeat -e --modules system,nginx,mysql
```

> **Tham khảo**
>
> Để biết thêm thông tin, bạn có thể tham khảo: [Cấu hình module Filebeat](https://www.elastic.co/guide/en/beats/filebeat/current/configuration-filebeat-modules.html) | [Module được hỗ trợ bởi Filebeat](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-modules.html)

## Nguyên lý

Filebeat có hai thành phần chính:

harvester: chịu trách nhiệm đọc nội dung của một tệp. Nó sẽ đọc từng dòng nội dung của tệp và gửi nội dung đến đích xuất.

prospector: chịu trách nhiệm quản lý harvester và tìm tất cả các nguồn tệp cần đọc. Ví dụ, nếu kiểu là log, prospector sẽ duyệt qua tất cả các tệp phù hợp với yêu cầu trong đường dẫn đã chỉ định.

```yaml
filebeat.prospectors:
  - type: log
    paths:
      - /var/log/*.log
      - /var/path2/*.log
```

Filebeat giữ trạng thái của mỗi tệp và thường xuyên làm mới trạng thái đĩa trong tệp đăng ký. Trạng thái được sử dụng để nhớ vị trí cuối cùng mà harvester đang đọc và đảm bảo tất cả các dòng log được gửi đi.

Filebeat lưu trạng thái gửi của mỗi sự kiện trong tệp đăng ký. Vì vậy, nó có thể đảm bảo rằng sự kiện được gửi ít nhất một lần đến đầu ra được cấu hình, không có dữ liệu bị mất.

## Tài liệu

[Tài liệu chính thức của Beats](https://www.elastic.co/guide/en/beats/libbeat/current/index.html)
