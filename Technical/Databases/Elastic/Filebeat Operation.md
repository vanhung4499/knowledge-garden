---
title: Filebeat Operation
tags:
  - filebeat
  - elastic
categories: 
date created: 2024-02-24
date modified: 2024-02-24
---

# Vận hành Filebeat

> Nền tảng Beats kết hợp nhiều trình thu thập dữ liệu đơn nhiệm. Chúng gửi dữ liệu từ hàng trăm, hàng nghìn hoặc hàng triệu máy và hệ thống đến Logstash hoặc Elasticsearch.
>
> Vì tôi chỉ tiếp xúc với Filebeat, nên bài viết này chỉ giới thiệu về vận hành của Filebeat.

## 1. Cài đặt Filebeat

### 1.1. Yêu cầu môi trường

> Phiên bản: Elastic Stack 7.4

### 1.2. Các bước cài đặt

Đối với hệ thống Unix / Linux, khuyến nghị sử dụng cách cài đặt sau đây vì nó khá phổ biến.

```
wget https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-6.1.1-linux-x86_64.tar.gz
tar -zxf filebeat-6.1.1-linux-x86_64.tar.gz
```

> Để biết thêm thông tin, bạn có thể tham khảo: [filebeat-installation](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-installation.html)

## 2. Cấu hình Filebeat

> Đầu tiên, điều cần biết là: `filebeat.yml` là tệp cấu hình của Filebeat. Đường dẫn của nó có thể thay đổi tùy theo cách bạn cài đặt.
>
> Tất cả các tệp cấu hình của sản phẩm Beat đều dựa trên định dạng [YAML](http://www.yaml.org/), và FileBeat cũng không ngoại lệ.
>
> Để biết thêm về cấu hình Filebeat, bạn có thể tham khảo: [Cấu hình Filebeat](https://www.elastic.co/guide/en/beats/filebeat/current/configuring-howto-filebeat.html)
>
> Để biết thêm về định dạng tệp filebeat.yml, bạn có thể tham khảo: [Định dạng tệp filebeat.yml](https://www.elastic.co/guide/en/beats/libbeat/6.1/config-file-format.html)

Ví dụ về một phần cấu hình filebeat.yml:

```yml
filebeat:
  prospectors:
    - type: log
      paths:
        - /var/log/*.log
      multiline:
        pattern: '^['
        match: after
```

### 2.1. Các mục cấu hình quan trọng

> Dưới đây, tôi sẽ liệt kê các mục cấu hình quan trọng của Filebeat.
>
> Nếu bạn muốn tìm hiểu thêm về thông tin cấu hình, bạn có thể tham khảo:
>
> Để biết thêm về cấu hình Filebeat, bạn có thể tham khảo: [Cấu hình Filebeat](https://www.elastic.co/guide/en/beats/filebeat/current/configuring-howto-filebeat.html)
>
> Để biết thêm về định dạng tệp filebeat.yml, bạn có thể tham khảo: [Định dạng tệp filebeat.yml](https://www.elastic.co/guide/en/beats/libbeat/6.1/config-file-format.html)

#### 2.1.1. filebeat.prospectors

(Trình theo dõi tệp) được sử dụng để chỉ định các tệp cần quan tâm.

**Ví dụ**

```yaml
filebeat.prospectors:
  - type: log
    enabled: true
    paths:
      - /var/log/*.log
```

#### 2.1.2. output.elasticsearch

Nếu bạn muốn Filebeat trực tiếp xuất dữ liệu đến Elasticsearch, bạn cần cấu hình output.elasticsearch.

**Ví dụ**

```yaml
output.elasticsearch:
  hosts: ['192.168.1.42:9200']
```

#### 2.1.3. output.logstash

Nếu bạn muốn Filebeat xuất dữ liệu đến Logstash, sau đó Logstash sẽ xuất dữ liệu đến Elasticsearch, bạn cần cấu hình output.logstash.

> **Lưu ý**
>
> So với việc xuất dữ liệu đến Elasticsearch, tôi khuyên bạn nên xuất dữ liệu đến Logstash.
>
> Bởi vì khi Logstash và Filebeat làm việc cùng nhau, nếu Logstash bận xử lý dữ liệu, nó sẽ thông báo cho FileBeat làm chậm tốc độ đọc. Một khi tình trạng tắc nghẽn được giải quyết, FileBeat sẽ trở lại tốc độ ban đầu và tiếp tục truyền dữ liệu. Như vậy, có thể giảm thiểu tình trạng quá tải của đường truyền.

**Ví dụ**

```yaml
output.logstash:
  hosts: ['127.0.0.1:5044']
```

Ngoài ra, bạn cũng cần chỉ định plugin beats input trong tệp cấu hình của Logstash (như logstash.conf):

```yaml
input {
  beats {
    port => 5044 # Cổng này cần phải giống với cổng trong filebeat.yml
  }
}

# Phần filter của tệp này được bình luận để chỉ ra rằng nó
# là tùy chọn.
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

#### 2.1.4. setup.kibana

Nếu bạn định sử dụng bảng điều khiển Kibana do Filebeat cung cấp, bạn cần cấu hình setup.kibana.

**Ví dụ**

```yaml
setup.kibana:
  host: 'localhost:5601'
```

#### 2.1.5. setup.template.settings

Trong Elasticsearch, [mẫu chỉ mục](https://www.elastic.co/guide/en/elasticsearch/reference/6.1/indices-templates.html) được sử dụng để xác định cài đặt và ánh xạ, để xác định cách phân tích các trường.

Trong Filebeat, setup.template.settings được sử dụng để cấu hình mẫu chỉ mục.

Mẫu chỉ mục được Filebeat khuyên dùng được cài đặt bởi gói phần mềm Filebeat. Nếu bạn chấp nhận cấu hình mặc định trong tệp filebeat.yml, Filebeat sẽ tự động tải mẫu sau khi kết nối thành công với Elasticsearch.

Bạn có thể tắt tải mẫu tự động hoặc tải mẫu của riêng bạn bằng cách cấu hình các tùy chọn tải mẫu trong tệp cấu hình Filebeat. Bạn cũng có thể đặt các tùy chọn để thay đổi tên chỉ mục và mẫu chỉ mục.

> **Tham khảo**
>
> Để biết thêm thông tin, bạn có thể tham khảo: [filebeat-template](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-template.html)
>
> **Ghi chú**
>
> Nếu không cần thiết, hãy sử dụng mẫu chỉ mục mặc định trong tệp cấu hình Filebeat.

#### 2.1.6. setup.dashboards

Filebeat đi kèm với các bảng điều khiển Kibana mẫu. Trước khi sử dụng các bảng điều khiển, bạn cần tạo mẫu chỉ mục `filebeat-*` và tải các bảng điều khiển vào Kibana. Để làm điều này, bạn có thể chạy lệnh `setup` hoặc cấu hình tải bảng điều khiển trong tệp `filebeat.yml`.

Để tải các bảng điều khiển Filebeat vào Kibana, bạn cần kích hoạt công tắc trong cấu hình `filebeat.yml`:

```
setup.dashboards.enabled: true
```

> **Tham khảo**
>
> Để biết thêm thông tin, bạn có thể tham khảo: [configuration-dashboards](https://www.elastic.co/guide/en/beats/filebeat/current/configuration-dashboards.html)

## 3. Lệnh Filebeat

Filebeat cung cấp một loạt các lệnh để hoàn thành nhiều chức năng khác nhau.

Cách thực hiện lệnh:

```bash
./filebeat COMMAND
```

> **Tham khảo**
>
> Để biết thêm thông tin, bạn có thể tham khảo: [command-line-options](https://www.elastic.co/guide/en/beats/filebeat/current/command-line-options.html)
>
> **Ghi chú**
>
> Theo quan điểm cá nhân, không cần phải nắm vững tất cả các lệnh dòng lệnh, vì hầu hết các chức năng đều có thể hoàn thành thông qua cấu hình. Và việc chỉ định chức năng thông qua dòng lệnh yêu cầu nhập cùng một tham số mỗi lần, không thuận lợi cho việc khởi động cố định.
>
> Đương nhiên, lệnh khởi động quan trọng nhất là run.
>
> **Ví dụ** Khởi động bằng cách chỉ định tệp cấu hình
>
> ```bash
> ./filebeat run -e -c filebeat.yml -d "publish"
> ./filebeat -e -c filebeat.yml -d "publish" # run có thể bỏ qua
> ```

## 4. Module Filebeat

> [Filebeat](https://www.elastic.co/cn/products/beats/filebeat) và [Metricbeat](https://www.elastic.co/cn/products/beats/metricbeat) tích hợp một loạt các module để đơn giản hóa quá trình thu thập, phân tích và hiển thị các định dạng nhật ký thông thường (như NGINX, Apache hoặc các chỉ số hệ thống như Redis hoặc Docker).

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

Chạy lệnh dưới đây, filebeat sẽ tải mẫu chỉ mục được khuyến nghị.

```
./filebeat setup -e
```

- Chỉ định module

Chạy lệnh dưới đây để chỉ định các module bạn muốn tải.

```
./filebeat -e --modules system,nginx,mysql
```

> Để biết thêm thông tin, bạn có thể tham khảo:
>
> - [Cấu hình module filebeat](https://www.elastic.co/guide/en/beats/filebeat/current/configuration-filebeat-modules.html)
> - [Module hỗ trợ filebeat](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-modules.html)

## 5. Tài liệu tham khảo

- [Trang chủ Beats](https://www.elastic.co/cn/products/beats)
- [Beats Github](https://github.com/elastic/beats)
- [Tài liệu chính thức Beats](https://www.elastic.co/guide/en/beats/libbeat/current/index.html)
