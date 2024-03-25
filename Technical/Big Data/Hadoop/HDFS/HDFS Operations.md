---
title: HDFS Operations
tags:
  - big-data
  - hadoop
  - hdfs
categories: 
date created: 2024-03-21
date modified: 2024-03-21
---

# HDFS Operations

## Các lệnh HDFS

### Hiển thị cấu trúc thư mục hiện tại

```shell
# Hiển thị cấu trúc thư mục hiện tại
hdfs dfs -ls <đường dẫn>
# Hiển thị đệ quy cấu trúc thư mục hiện tại
hdfs dfs -ls -R <đường dẫn>
# Hiển thị nội dung trong thư mục gốc
hdfs dfs -ls /
```

### Tạo thư mục

```shell
# Tạo thư mục
hdfs dfs -mkdir <đường dẫn>
# Tạo đệ quy thư mục
hdfs dfs -mkdir -p <đường dẫn>
```

### Thao tác xóa

```shell
# Xóa tệp
hdfs dfs -rm <đường dẫn>
# Xóa đệ quy thư mục và tệp
hdfs dfs -rm -R <đường dẫn>
```

### Nhập tệp vào HDFS

```shell
# Chọn một trong hai để thực thi
hdfs dfs -put [nguồn cục bộ] [đích]
hdfs dfs -copyFromLocal [nguồn cục bộ] [đích]
```

### Xuất tệp từ HDFS

```shell
# Chọn một trong hai để thực thi
hdfs dfs -get [đích] [nguồn cục bộ]
hdfs dfs -copyToLocal [đích] [nguồn cục bộ]
```

### Xem nội dung tệp

```shell
# Chọn một trong hai để thực thi
hdfs dfs -text <đường dẫn>
hdfs dfs -cat <đường dẫn>
```

### Hiển thị một nghìn byte cuối cùng của tệp

```shell
hdfs dfs -tail <đường dẫn>
# Giống như trong Linux, nó sẽ tiếp tục lắng nghe các thay đổi nội dung tệp và hiển thị một nghìn byte cuối cùng của tệp
hdfs dfs -tail -f <đường dẫn>
```

### Sao chép tệp

```shell
hdfs dfs -cp [nguồn] [đích]
```

### Di chuyển tệp

```shell
hdfs dfs -mv [nguồn] [đích]
```

### Thống kê kích thước của từng tệp trong thư mục hiện tại

- Đơn vị mặc định là byte
- -s: hiển thị tổng kích thước của tất cả các tệp,
- -h: sẽ hiển thị kích thước tệp theo cách thân thiện hơn (ví dụ: 64.0m thay vì 67108864)

```
hdfs dfs -du <đường dẫn>
```

### Hợp nhất và tải về nhiều tệp

- -nl thêm ký tự xuống dòng (LF) vào cuối mỗi tệp
- -skip-empty-file bỏ qua các tệp trống

```
hdfs dfs -getmerge
# Ví dụ: Hợp nhất các tệp hbase-policy.xml và hbase-site.xml trên HDFS và tải về /usr/test.xml cục bộ
hdfs dfs -getmerge -nl  /test/hbase-policy.xml /test/hbase-site.xml /usr/test.xml
```

### Thống kê thông tin về không gian có sẵn của hệ thống tệp

```
hdfs dfs -df -h /
```

### Thay đổi yếu tố nhân bản tệp

```
hdfs dfs -setrep [-R] [-w] <numReplicas> <đường dẫn>
```

- Thay đổi yếu tố nhân bản của tệp. Nếu đường dẫn là một thư mục, thay đổi yếu tố nhân bản cho tất cả các tệp bên dưới nó
- -w: yêu cầu lệnh có chờ đợi nhân bản hoàn thành hay không

```
# Ví dụ
hdfs dfs -setrep -w 3 /user/hadoop/dir1
```

### Kiểm soát quyền

```
# Kiểm soát quyền giống như trong Linux
# Thay đổi nhóm sở hữu của một tệp hoặc thư mục. Người dùng phải là chủ sở hữu của tệp hoặc người dùng siêu cấp.
hdfs dfs -chgrp [-R] GROUP URI [URI ...]
# Sửa đổi quyền truy cập của một tệp hoặc thư mục. Người dùng phải là chủ sở hữu của tệp hoặc người dùng siêu cấp.
hdfs dfs -chmod [-R] <MODE[,MODE]... | OCTALMODE> URI [URI ...]
# Thay đổi chủ sở hữu của một tệp. Người dùng phải là người dùng siêu cấp.
hdfs dfs -chown [-R] [OWNER][:[GROUP]] URI [URI ]
```

### Kiểm tra tệp

```
hdfs dfs -test - [defsz]  URI
```

Các tùy chọn không bắt buộc:

- -d: nếu đường dẫn là một thư mục, trả về 0.
- -e: nếu đường dẫn tồn tại, thì trả về 0.
- -f: nếu đường dẫn là một tệp, thì trả về 0.
- -s: nếu đường dẫn không trống, thì trả về 0.
- -r: nếu đường dẫn tồn tại và được cấp quyền đọc, thì trả về 0.
- -w: nếu đường dẫn tồn tại và được cấp quyền ghi, thì trả về 0.
- -z: nếu chiều dài tệp là không, thì trả về 0.

```
# Ví dụ
hdfs dfs -test -e filename
```

## HDFS Chế độ an toàn

### Chế độ an toàn là gì?

- Chế độ an toàn là một trạng thái đặc biệt của HDFS, trong trạng thái này, HDFS chỉ nhận yêu cầu đọc dữ liệu, không nhận các yêu cầu thay đổi như ghi, xóa, sửa đổi.
- Chế độ an toàn là một cơ chế bảo vệ của HDFS để đảm bảo an toàn cho dữ liệu Block.
- Khi Active NameNode khởi động, HDFS sẽ vào chế độ an toàn, DataNode tự động báo cáo danh sách Block có sẵn cho NameNode, và HDFS sẽ ở trạng thái "chỉ đọc" cho đến khi hệ thống đạt đến tiêu chuẩn an toàn.

### Khi nào thoát khỏi chế độ an toàn một cách bình thường

- Tỉ lệ báo cáo Block: Số Block có sẵn được báo cáo bởi DataNode / Số Block được ghi trong metadata của NameNode.
- Khi tỉ lệ báo cáo Block >= ngưỡng, HDFS mới có thể thoát khỏi chế độ an toàn, ngưỡng mặc định là 0.999.
- Không nên buộc thoát chế độ an toàn một cách thủ công.

### Nguyên nhân kích hoạt chế độ an toàn

- NameNode khởi động lại.
- Không đủ không gian đĩa trên NameNode.
- Tỉ lệ báo cáo Block thấp hơn ngưỡng.
- DataNode không thể khởi động một cách bình thường.
- Có lỗi nghiêm trọng xuất hiện trong nhật ký.
- Thao tác của người dùng không đúng, như: **tắt máy một cách buộc bất chợt (cần chú ý đặc biệt!)**

### Điều chỉnh sự cố

- Tìm ra nguyên nhân DataNode không thể khởi động một cách bình thường, khởi động lại DataNode.
- Dọn dẹp không gian đĩa của NameNode.
- Thao tác cẩn thận, nếu có vấn đề, liên hệ với Xinghuan để tránh mất dữ liệu.

## Tài liệu tham khảo

- [Tài liệu chính thức của HDFS](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html)
- [Tổng hợp kiến thức HDFS](https://www.cnblogs.com/caiyisen/p/7395843.html)
