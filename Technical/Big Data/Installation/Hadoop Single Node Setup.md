---
title: Hadoop Single Node Setup
tags:
  - hadoop
  - big-data
categories: 
date created: 2024-03-22
date modified: 2024-03-22
---

# Cài đặt môi trường Hadoop Single Node

## Điều kiện tiên quyết

Hadoop hoạt động phụ thuộc vào JDK, cần phải cài đặt trước, các bước cài đặt xem tại:

- [[LinuxJDK Install|Cài đặt JDK trên Linux]]

## Cấu hình SSH đăng nhập không cần mật mã

Các thành phần của Hadoop cần giao tiếp với nhau thông qua SSH.

### Cấu hình ánh xạ

Cấu hình ánh xạ địa chỉ IP và tên máy chủ:

```shell
vim /etc/hosts
# Thêm vào cuối tệp
192.168.43.202  hadoop001
```

### Tạo public-private key

Chạy dòng lệnh sau để tạo public key và privatekey:

```
ssh-keygen -t rsa
```

### Ủy quyền

Đi vào thư mục `~/.ssh`, kiểm tra public key và private key đã tạo, sau đó ghi public key vào tệp ủy quyền:

```shell
[root@@hadoop001 sbin]#  cd ~/.ssh
[root@@hadoop001 .ssh]# ll
-rw-------. 1 root root 1675 3 月  15 09:48 id_rsa
-rw-r--r--. 1 root root  388 3 月  15 09:48 id_rsa.pub
```

```shell
# Ghi public key vào tệp ủy quyền
cat id_rsa.pub >> authorized_keys
chmod 600 authorized_keys
```

## Cài đặt môi trường Hadoop (HDFS)

### Tải về và giải nén

Tải về gói cài đặt Hadoop từ trang chủ, địa chỉ tải về là: [Index of /hadoop/common/hadoop-2.10.2](https://dlcdn.apache.org/hadoop/common/hadoop-2.10.2/)

```shell
# Giải nén
tar -zvxf hadoop-2.10.2.tar.gz
```

### Cấu hình biến môi trường

```shell
vi /etc/profile
```

Cấu hình biến môi trường:

```
export HADOOP_HOME=/usr/app/hadoop-2.10.2
export PATH=${HADOOP_HOME}/bin:$PATH
```

Thực hiện lệnh `source` để cấu hình biến môi trường có hiệu lực ngay lập tức:

```shell
source /etc/profile
```

### Sửa cấu hình Hadoop

Truy cập vào thư mục `${HADOOP_HOME}/etc/hadoop/ `, sửa các cấu hình sau:

#### 1. hadoop-env.sh

```shell
# Đường dẫn cài đặt JDK
export  JAVA_HOME=/usr/java/jdk1.8.0_201/
```

#### 2. core-site.xml

```xml
<configuration>
    <property>
        <!--Chỉ định địa chỉ giao tiếp hệ thống tệp tin của namenode với giao thức hdfs-->
        <name>fs.defaultFS</name>
        <value>hdfs://hadoop001:8020</value>
    </property>
    <property>
        <!--Chỉ định thư mục mà Hadoop lưu trữ các tệp tin tạm thời-->
        <name>hadoop.tmp.dir</name>
        <value>/home/hadoop/tmp</value>
    </property>
</configuration>
```

#### 3. hdfs-site.xml

Chỉ định hệ số bản sao và vị trí lưu trữ tệp tin tạm thời:

```xml
<configuration>
    <property>
        <!--Vì chúng ta đang cài đặt phiên bản đơn, nên chỉ định hệ số bản sao của dfs là 1-->
        <name>dfs.replication</name>
        <value>1</value>
    </property>
</configuration>
```

#### 4. slaves

Cấu hình tên máy chủ hoặc địa chỉ IP của tất cả các nút phụ thuộc, do đây là phiên bản đơn, nên chỉ cần chỉ định máy chủ này:

```shell
hadoop001
```

### Tắt tường lửa

Nếu không tắt tường lửa, có thể sẽ không thể truy cập vào giao diện Web UI của Hadoop:

```shell
# Kiểm tra trạng thái của tường lửa
sudo firewall-cmd --state
# Tắt tường lửa:
sudo systemctl stop firewalld.service
```

### Khởi tạo

Lần đầu tiên khởi động Hadoop cần phải khởi tạo, truy cập vào thư mục `${HADOOP_HOME}/bin/`, thực hiện lệnh sau:

```shell
./hdfs namenode -format
```

### Khởi động HDFS

Truy cập vào thư mục `${HADOOP_HOME}/sbin/`, khởi động HDFS:

```shell
./start-dfs.sh
```

### Kiểm tra xem đã khởi động thành công chưa

Cách một: Thực hiện lệnh `jps` để kiểm tra xem dịch vụ `NameNode` và `DataNode` đã khởi động hay chưa:

```shell
jps
9137 DataNode
9026 NameNode
9390 SecondaryNameNode
```

Cách hai: Kiểm tra giao diện Web UI, cổng là `50070`:

<div align="center"> <img width="700px" src="https://gitee.com/heibaiying/BigData-Notes/raw/master/pictures/hadoop安装验证.png"/> </div>

## Cài đặt môi trường Hadoop (YARN)

### Sửa cấu hình

Truy cập vào thư mục `${HADOOP_HOME}/etc/hadoop/ `, sửa các cấu hình sau:

#### 1. mapred-site.xml

```shell
# Nếu không có mapred-site.xml, hãy sao chép một tệp mẫu sau đó sửa đổi
cp mapred-site.xml.template mapred-site.xml
```

```xml
<configuration>
    <property>
        <name>mapreduce.framework.name</name>
        <value>yarn</value>
    </property>
</configuration>
```

#### 2. yarn-site.xml

```xml
<configuration>
    <property>
        <!--Cấu hình dịch vụ phụ thuộc chạy trên NodeManager. Cần cấu hình thành mapreduce_shuffle sau đó mới có thể chạy chương trình MapReduce trên Yarn.-->
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
    </property>
</configuration>
```

### Khởi động dịch vụ

Truy cập vào thư mục `${HADOOP_HOME}/sbin/`, khởi động YARN:

```shell
./start-yarn.sh
```

#### Kiểm tra xem đã khởi động thành công chưa

Cách một: Thực hiện lệnh `jps` để kiểm tra xem dịch vụ `NodeManager` và `ResourceManager` đã khởi động hay chưa:

```shell
jps
9137 DataNode
9026 NameNode
12294 NodeManager
12185 ResourceManager
9390 SecondaryNameNode
```

Cách hai: Kiểm tra giao diện Web UI, cổng là `8088`:

<div align="center"> <img width="700px" src="https://gitee.com/heibaiying/BigData-Notes/raw/master/pictures/hadoop-yarn安装验证.png"/> </div>
