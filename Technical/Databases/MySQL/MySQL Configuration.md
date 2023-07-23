---
title: MySQL Configuration
tags: [db, mysql, sql]
categories: [db, mysql, sql]
date created: 2023-07-23
date modified: 2023-07-24
---

# Cấu hình MySQL

> Phiên bản: ![mysql](https://img.shields.io/badge/mysql-8.0-blue)

## Cấu hình cơ bản

```ini
[mysqld]
# GENERAL
# -------------------------------------------------------------------------------
datadir = /var/lib/mysql
socket  = /var/lib/mysql/mysql.sock
pid_file = /var/lib/mysql/mysql.pid
user = mysql
port = 3306
default_storage_engine = InnoDB
default_time_zone = '+8：00'
character_set_server = utf8mb4
collation_server = utf8mb4_0900_ai_ci

# LOG
# -------------------------------------------------------------------------------
log_error = /var/log/mysql/mysql-error.log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/mysql-slow.log

# InnoDB
# -------------------------------------------------------------------------------
innodb_buffer_pool_size = <giá trị>
innodb_log_file_size = <giá trị>
innodb_file_per_table = 1
innodb_flush_method = O_DIRECT

# MyIsam
# -------------------------------------------------------------------------------
key_buffer_size = <giá trị>

# OTHER
# -------------------------------------------------------------------------------
tmp_table_size = 32M
max_heap_table_size = 32M
max_connections = <giá trị>
open_files_limit = 65535

[client]
socket  = /var/lib/mysql/mysql.sock
port = 3306
```

## Giải thích các cấu hình

```ini
[client]
# Số hiệu cổng dịch vụ, mặc định là 3306
port = 3306

# Tập tin socket
socket = /var/lib/mysql/mysql.sock



[mysqld]

# GENERAL
# -------------------------------------------------------------------------------

# Tập tin socket
socket = /var/lib/mysql/mysql.sock

# Tập tin PID
pid_file = /var/lib/mysql/mysql.pid

# Người dùng chạy tiến trình dịch vụ mysql
user = mysql

# Số hiệu cổng dịch vụ, mặc định là 3306
port = 3306

# Múi giờ mặc định
default_time_zone = '+8：00'

# ID dịch vụ MySQL, không cần thiết khi chỉ có một dịch vụ đơn lẻ
server-id = 1

# Cấu hình cách cô lập giao dịch, mặc định là REPEATABLE-READ (có thể gây ra khóa khoảng trống và ảnh hưởng đến hiệu suất, nhưng việc thay đổi ảnh hưởng đến sao chép chính và khôi phục thảm họa, nên khuyến nghị thay đổi mã logic)
# Các mức cô lập có thể chọn: READ-UNCOMMITTED READ-COMMITTED REPEATABLE-READ SERIALIZABLE
transaction_isolation = REPEATABLE-READ

# Cấu hình thư mục
# -------------------------------------------------------------------------------

# Thư mục cài đặt mysql
basedir = /usr/local/mysql-5.7.21

# Thư mục chứa dữ liệu mysql
datadir = /var/lib/mysql

# Thư mục tạm thời, ví dụ như load data infile sẽ sử dụng, thường là /tmp
tmpdir = /tmp

# Cấu hình động cơ cơ sở dữ liệu
# -------------------------------------------------------------------------------

# Mysql từ phiên bản 5.1 trở đi, mặc định sử dụng InnoDB
default_storage_engine = InnoDB

# Độ lớn bộ đệm bộ nhớ cho bảng tạm thời, mặc định InnoDB
default_tmp_storage_engine = InnoDB

# Độ lớn bộ nhớ tạm thời trên đĩa cho bảng tạm thời, mặc định InnoDB
internal_tmp_disk_storage_engine = InnoDB

# Cấu hình bộ ký tự
# -------------------------------------------------------------------------------

# Bộ ký tự mặc định của cơ sở dữ liệu, hỗ trợ các biểu tượng cảm xúc đặc biệt (biểu tượng đặc biệt chiếm 4 byte)
character_set_server = utf8mb4

# Quy tắc sắp xếp tương ứng với bộ ký tự cơ sở dữ liệu, hãy chắc chắn phù hợp với character_set_server
collation-server = utf8mb4_0900_ai_ci

# Đặt bộ ký tự khi kết nối client với mysql, tránh hiện tượng lỗi mã hóa
# init_connect='SET NAMES utf8'

# Có phân biệt chữ hoa chữ thường trong câu lệnh SQL hay không, mặc định là 0, 1 có nghĩa là không phân biệt
lower_case_table_names = 1

# Cấu hình kết nối cơ sở dữ liệu
# -------------------------------------------------------------------------------

# Số kết nối tối đa, có thể đặt tối đa là 16384, thường xem xét một số tổng hợp dựa trên số người trực tuyến đồng thời, vì giá trị này không tốn nhiều tài nguyên hệ thống, nên khuyến nghị đặt trực tiếp là 10000
# Nếu thường xuyên gặp thông báo lỗi "Too Many Connections" khi truy cập, bạn cần tăng giá trị này
max_connections = 10000

# Giá trị mặc định là 100, số lỗi kết nối tối đa, nếu có quá nhiều lỗi kết nối bị ngắt, máy chủ sẽ bị cấm kết nối. Để mở lại máy chủ, thực hiện: FLUSH HOST
# Xem xét khả năng chống lỗi trong trường hợp tải cao, khuyến nghị tăng giá trị này.
max_connect_errors = 10000

# Giới hạn số lượng tệp mở của MySQL, mặc định tối thiểu là 1024;
# Khi open_files_limit chưa được cấu hình, so sánh giá trị max_connections * 5 và giá trị ulimit -n, sử dụng giá trị lớn hơn,
# Khi open_file_limit được cấu hình, so sánh giá trị open_files_limit và giá trị max_connections * 5, sử dụng giá trị lớn hơn.
# Lưu ý: Vẫn có thể xảy ra thông báo lỗi Can't create a new thread; trong trường hợp này, quan sát giới hạn ulimit của hệ thống cat /proc/mysql process_number/limits, quan sát giới hạn ulimit của tiến trình.
# Nếu quá nhỏ, xem xét sửa bảng cấu hình hệ thống, /etc/security/limits.conf và /etc/security/limits.d/90-nproc.conf
open_files_limit = 65535

# Cấu hình thời gian chờ
# -------------------------------------------------------------------------------

# Giá trị mặc định của wait_timeout là 8 giờ, tham số interactive_timeout cần được cấu hình cùng để có hiệu lực
# Khi kết nối không hoạt động trong một khoảng thời gian nhất định (đơn vị: giây, ở đây là 1800 giây), nó sẽ bị đóng mạnh
interactive_timeout = 1800
wait_timeout = 1800

# Trong một khoảng thời gian ngắn trước khi MySQL tạm dừng phản hồi các yêu cầu mới, bao nhiêu yêu cầu có thể được lưu trữ trong ngăn xếp
# Đề xuất của nhà sản xuất là back_log = 50 + (max_connections / 5), tối đa là 900
back_log = 900

# Cấu hình trao đổi dữ liệu cơ sở dữ liệu
# -------------------------------------------------------------------------------
# Tham số này giới hạn kích thước gói dữ liệu mà máy chủ có thể chấp nhận, nếu có các trường BLOB, đề nghị tăng giá trị này để tránh việc ghi hoặc cập nhật gặp lỗi. Có trường BLOB, đề nghị thay đổi thành 1024M
max_allowed_packet = 128M

# Cấu hình bộ nhớ, bộ đệm và bộ đệm

# Kích thước tối đa của bảng tạm thời trong bộ nhớ, mặc định là 16M, ở đây đặt thành 64M
tmp_table_size = 64M

# Kích thước tối đa của bảng tạm thời do người dùng tạo ra trong bộ nhớ, mặc định là 16M, thường được đặt cùng với tmp_table_size, giới hạn kích thước bảng tạm thời của người dùng.
# Nếu vượt quá giới hạn, MySQL sẽ tự động chuyển nó thành bảng MyISAM dựa trên đĩa, lưu trữ trong thư mục tmpdir được chỉ định, tăng tải IO, đề nghị tăng kích thước bộ nhớ, tăng giá trị này.
max_heap_table_size = 64M

# Biểu thị xem phiên bản mysql có hỗ trợ bộ nhớ cache truy vấn hay không. ps: SHOW STATUS LIKE 'qcache%';, các biến trạng thái liên quan đến bộ nhớ cache.
# have_query_cache

# Biến hệ thống này điều khiển chức năng bộ nhớ cache truy vấn, 0 biểu thị tắt, 1 biểu thị bật, 2 biểu thị chỉ khi truy vấn được chỉ định SQL_CACHE mới được lưu vào bộ nhớ cache.
# Xem xét kịch bản kinh doanh để quyết định xem có sử dụng bộ nhớ cache hay không, nếu không sử dụng, không cần cấu hình dưới đây.
# Mysql8 không hỗ trợ
query_cache_type = 0

# Giá trị mặc định là 1M, ưu điểm là bộ nhớ cache truy vấn có thể cải thiện tốc độ máy chủ đáng kể, nếu bạn có nhiều truy vấn giống nhau và ít khi thay đổi bảng.
# Nhược điểm: Trong trường hợp bảng thay đổi thường xuyên hoặc nếu câu truy vấn gốc của bạn không giống nhau mỗi lần, bộ nhớ cache truy vấn có thể làm giảm hiệu suất thay vì cải thiện hiệu suất.
# Mysql8 không hỗ trợ
query_cache_size = 64M

# Chỉ có kết quả nhỏ hơn giá trị này mới được lưu vào bộ nhớ cache, bảo vệ bộ nhớ cache truy vấn, tránh một tập kết quả lớn ghi đè lên tất cả các kết quả truy vấn khác.
query_cache_limit = 2M

# Kích thước tối thiểu mà mỗi kết quả cache sẽ chiếm trong bộ nhớ, giá trị mặc định là 4kb, thường không cần điều chỉnh.
# Nếu giá trị Qcache_free_blocks quá lớn, có thể do giá trị query_cache_min_res_unit quá lớn, nên giảm nó xuống.
# Ước tính giá trị query_cache_min_res_unit: (query_cache_size - Qcache_free_memory) / Qcache_queries_in_cache
query_cache_min_res_unit = 4kb

# Kích thước bộ nhớ được sử dụng cho việc ghi log lại trạng thái SQL của binlog trong mỗi giao dịch
# Nếu bạn thường xuyên sử dụng các giao dịch lớn và nhiều khai báo, bạn có thể tăng giá trị này để có hiệu suất tốt hơn.
# Tất cả các trạng thái từ giao dịch đều được lưu trữ trong bộ nhớ đệm binlog và sau đó được ghi vào binlog sau khi giao dịch được gửi đi.
# Khi giao dịch lớn hơn giá trị này, sẽ sử dụng tệp tạm trên đĩa để thay thế.
# Bộ đệm này được tạo ra khi giao dịch đầu tiên của mỗi kết nối được cập nhật
binlog_cache_size = 1M

# Cấu hình nhật ký
# -------------------------------------------------------------------------------

# Cấu hình tập tin nhật ký, thường chỉ bật ba loại nhật ký, lỗi, truy vấn chậm, nhật ký nhị phân. Không bật nhật ký truy vấn thông thường.
# Nhật ký truy vấn thông thường, giá trị mặc định là off, không bật
general_log = 0

# Đường dẫn tập tin nhật ký truy vấn thông thường
general_log_file = /usr/local/mysql-5.7.21/log/mysql-general.log

# Biến động toàn cục, giá trị mặc định là 3, phạm vi: 1-3
# Biểu thị thông tin nhật ký lỗi, 1: chỉ ghi lại thông tin lỗi; 2: ghi lại thông tin lỗi và cảnh báo; 3: ghi lại thông tin lỗi, cảnh báo và ghi chú thông thường.
log_error_verbosity = 2

# Tập tin nhật ký lỗi
log_error = /usr/local/mysql-5.7.21/log/mysql-error.log

# Bật ghi lại truy vấn chậm
slow_query_log = 1

# Bật ghi lại truy vấn chậm khi thời gian đạt đến giá trị này mới ghi lại dữ liệu
long_query_time = 3

# Ghi lại truy vấn chậm chỉ khi số hàng kiểm tra đạt đến giá trị này
min_examined_row_limit = 100

# Mysql 5.6.5 mới, được sử dụng để chỉ định số lần truy vấn SQL không sử dụng chỉ mục được ghi lại trong slow log mỗi phút, giá trị mặc định là 0, không giới hạn.
log_throttle_queries_not_using_indexes = 0

# Đường dẫn tập tin nhật ký truy vấn chậm
slow_query_log_file = /var/log/mysql/mysql-slow.log

# Bật ghi lại các truy vấn không sử dụng chỉ mục
log-queries-not-using-indexes = 1

# Bật ghi lại nhật ký nhị phân
log_bin = /usr/local/mysql-5.7.21/log/mysql-bin.log

# Thời gian để xóa các nhật ký cũ, giá trị mặc định là 0, không tự động xóa.
expire_logs_days = 0

# Nếu nội dung ghi vào nhật ký nhị phân vượt quá giá trị này, nhật ký sẽ được cuộn. Bạn không thể đặt giá trị lớn hơn 1GB hoặc nhỏ hơn 4096 byte. Giá trị mặc định là 1GB.
max_binlog_size = 1000M

# Định dạng nhật ký nhị phân, có ba loại: STATEMENT, ROW, MIXED. Mysql 5.7.7 trở đi, giá trị mặc định đã thay đổi từ MIXED thành ROW
# Về vấn đề định dạng nhật ký nhị phân, vui lòng tham khảo tài liệu trên mạng
binlog_format = row

# Số lần ghi vào nhật ký nhị phân trước khi đồng bộ hóa vào đĩa, giá trị mặc định là 1
# Đề nghị đặt thành 1 để đảm bảo nhật ký nhị phân không bị mất sau khi khởi động lại MySQL.
# sync_binlog = 1

# Cấu hình độ lớn của bộ nhớ đệm cho MyISAM
# -------------------------------------------------------------------------------

# Xác định kích thước bộ đệm chỉ mục, cho phép chia sẻ bộ đệm chỉ mục cho các luồng, không ảnh hưởng đến INNODB. Ảnh hưởng đáng kể đến hiệu suất của MyISAM.
# Không nên đặt giá trị lớn hơn 30% dung lượng bộ nhớ có sẵn của bạn, vì một phần bộ nhớ cũng được sử dụng bởi hệ điều hành để đệm dòng dữ liệu
# Ngay cả khi bạn không sử dụng bảng MyISAM, bạn vẫn nên đặt ít nhất 8-64M bởi vì nó cũng sẽ được sử dụng bởi bảng tạm thời dựa trên đĩa nội bộ
# Giá trị mặc định là 8M, giá trị đề nghị: Với 4GB RAM, đề nghị đặt 256M hoặc 384M. Lưu ý: Giá trị này càng lớn thì hiệu suất toàn bộ máy chủ càng giảm!
key_buffer_size = 64M

# Dành cho mỗi luồng quét MyISAM, xác định kích thước bộ đệm bộ đọc, mặc định là 128kb, đề nghị: 16G RAM đề nghị 1M, 4G: 128kb hoặc 256kb.
# Lưu ý, bộ đệm này được cấp phát cho mỗi kết nối, vì vậy kích thước bộ đệm tổng cộng là 128kb * số kết nối; trong trường hợp cực đoan, 128kb * maxconnectiosns, sẽ rất lớn, vì vậy hãy xem xét số kết nối trung bình hàng ngày.
read_buffer_size = 262144

# Hỗ trợ cho bất kỳ cơ sở dữ liệu nào
# Kích thước bộ đệm đọc ngẫu nhiên MySQL, tăng kích thước để cải thiện hiệu suất.
# Giá trị mặc định là 256kb; đề nghị: 16/32G RAM, đặt 512kb, các giá trị khác thường không thay đổi, nếu báo lỗi: Thread stack overrun, hãy tăng nó lên xem.
# Lưu ý, mỗi luồng cấp phát không gian bộ nhớ, vì vậy tổng không gian bộ nhớ ... bạn hiểu rồi.
read_rnd_buffer_size = 1M

# Sử dụng cho ORDER BY hoặc GROUP BY
# Hỗ trợ tất cả các động cơ, innodb và myisam có innodb_sort_buffer_size và myisam_sort_buffer_size riêng
# Giá trị mặc định là 256kb; đề nghị: 16/32G RAM, đặt 8M.
# Lưu ý, mỗi luồng cấp phát không gian bộ nhớ, vì vậy tổng không gian bộ nhớ ... bạn hiểu rồi.
sort_buffer_size = 1M

# Thực hiện các liên kết toàn cục (full JOINs không có chỉ mục) được tối ưu hóa
# Các liên kết tương tự thường có hiệu suất rất kém trong hầu hết các trường hợp, nhưng việc tăng giá trị này có thể giảm bớt hiệu suất thay vì cải thiện hiệu suất.
# Tất cả các trạng thái từ các giao dịch đầu tiên của mỗi kết nối được lưu trữ trong bộ nhớ đệm và sau đó được ghi vào binlog sau khi giao dịch được gửi đi.
# Khi giao dịch lớn hơn giá trị này, sẽ sử dụng tệp tạm trên đĩa để thay thế.
# Bộ đệm này được tạo ra khi giao dịch đầu tiên của mỗi kết nối được cập nhật
join_buffer_size = 1M

# Giới hạn số lượng bảng dữ liệu mà MySQL có thể mở, nếu có nhiều bảng trong cơ sở dữ liệu, hãy tăng giá trị này.
# Giá trị mặc định là 1400, tối đa là 2000, đề nghị giá trị mặc định.
table_open_cache = 2000

# Bộ nhớ cache thông tin định nghĩa bảng, tăng tốc độ đọc thông tin bảng
# Giá trị mặc định là 1400, tối đa là 2000, đề nghị giá trị mặc định.
table_definition_cache = 1400

# Tham số này được sử dụng để cải thiện khả năng mở rộng và hiệu suất của InnoDB.
# Giá trị mặc định là 1 hoặc 8, đề nghị: innodb_buffer_pool_size/innodb_buffer_pool_instances >= 1G
innodb_buffer_pool_instances = 1

# Tham số này được sử dụng để cải thiện khả năng mở rộng và hiệu suất của InnoDB.
# Giá trị mặc định là 1 hoặc 8, đề nghị: innodb_buffer_pool_size/innodb_buffer_pool_instances >= 1G
innodb_buffer_pool_chunk_size = 128M

# Tải dữ liệu nóng vào bộ nhớ khi khởi động. Giá trị mặc định là bật.
innodb_buffer_pool_load_at_startup = 1

# Ghi dữ liệu nóng vào đĩa cục bộ khi tắt. Giá trị mặc định là bật.
innodb_buffer_pool_dump_at_shutdown = 1

# Số lần quét LRU (Least Recently Used) trong mỗi giây, giá trị mặc định là 1024
innodb_lru_scan_depth = 1024

# Thời gian chờ khi chờ tài nguyên giao dịch, đơn vị là giây, xem tình huống kinh doanh cụ thể, mặc định là 50, đề nghị xem tình huống kinh doanh.
innodb_lock_wait_timeout = 60

# Được sử dụng để giới hạn số lượng hoạt động I/O của Innodb, đề nghị từ 100 đối với ổ cứng SATA, 200 đối với ổ cứng SAS10, 2000 đối với SSD, 50000 đối với fushion-io;
# Hoặc sử dụng công cụ kiểm tra hiệu suất để lấy giá trị IOPS sau đó đặt giá trị IOPS/2.
innodb_io_capacity = 2000

# Giá trị mặc định là gấp đôi innodb_io_capacity. Đề nghị sử dụng giá trị IOPS sau khi kiểm tra bằng iometer.
innodb_io_capacity_max = 4000

# Điều khiển cách dữ liệu và nhật ký được ghi vào đĩa, ba chế độ: fdatasync (mặc định), O_DSYNC, O_DIRECT
# fdatasync: dữ liệu, bộ đệm hệ thống -> bộ đệm os -> đĩa; nhật ký, bộ đệm hệ thống -> bộ đệm os -> đĩa;
# O_DSYNC: dữ liệu, bộ đệm hệ thống -> bộ đệm os -> đĩa; nhật ký, bộ đệm hệ thống -> đĩa;
# O_DIRECT: dữ liệu, bộ đệm hệ thống -> đĩa; nhật ký, bộ đệm hệ thống -> bộ đệm os -> đĩa;
# Giá trị mặc định là trống, đề nghị: sử dụng SAN hoặc raid, đề nghị sử dụng O_DIRECT mặc định trên môi trường sản xuất nếu bạn không hiểu kiểm tra.
innodb_flush_method = O_DIRECT

# MySQL 5.7 trở đi, mỗi bảng có một không gian bảng riêng.
# Giá trị mặc định là 1, bật
innodb_file_per_table = 1

# Đường dẫn thư mục undo log sử dụng cho InnoDB. Thường bằng với thư mục lưu trữ undo log.
# Giá trị mặc định là ./; tự cấu hình
innodb_undo_directory = /usr/local/mysql-5.7.21/log

# Số lượng bảng không gian hoạt động được sử dụng bởi InnoDB, bằng số lượng tệp undo log. Bắt đầu từ 5.7.21, không còn sử dụng nữa
# Giá trị mặc định là 0, giá trị mặc định là không cần thiết.
innodb_undo_tablespaces = 0

# Xác định số lượng đoạn ghi nhật ký undo được sử dụng bởi InnoDB. Bắt đầu từ 5.7.19, không còn sử dụng nữa.
# Giá trị mặc định là 128, đề nghị giữ nguyên giá trị mặc định.
innodb_undo_logs = 128

# Sử dụng để thu hẹp không gian undo log trực tuyến.
# Giá trị mặc định là 1G, đề nghị giữ nguyên giá trị mặc định.
innodb_undo_log_truncate = 1

# Kích thước tối đa của nhật ký undo. Giá trị mặc định là 1G, đề nghị giữ nguyên giá trị mặc định, không thay đổi.
innodb_max_undo_log_size = 1G

# Thư mục lưu trữ nhật ký phục hồi
innodb_log_group_home_dir = /usr/local/mysql-5.7.21/log

# Kích thước tệp nhật ký
# Giá trị mặc định là 48M, đề nghị điều chỉnh kích thước dựa trên dung lượng đĩa hệ thống và tốc độ tăng trưởng nhật ký
innodb_log_file_size = 128M

# Số lượng tệp nhật ký trong nhóm, MySQL ghi nhật ký theo cách vòng lặp.
# Giá trị mặc định là 2, đề nghị điều chỉnh kích thước dựa trên dung lượng đĩa hệ thống và tốc độ tăng trưởng nhật ký
innodb_log_files_in_group = 3

# Tham số này xác định kích thước bộ nhớ được sử dụng cho việc ghi log vào nhật ký, tính bằng M. Bộ đệm lớn hơn có thể cải thiện hiệu suất, nhưng dữ liệu sẽ bị mất nếu xảy ra sự cố không mong muốn. Nhà phát triển MySQL khuyến nghị đặt từ 1-8M.
innodb_log_buffer_size = 16M

# Thời gian để đồng bộ hóa ghi log từ bộ đệm vào tệp nhật ký, tăng giá trị có thể giảm tải hệ thống
# Giá trị mặc định là 1; đề nghị giữ nguyên giá trị mặc định. Hiệu suất hệ thống thông thường đ


# Cấu hình động cơ InnoDB
# -------------------------------------------------------------------------------

# Giải thích: Tham số này có thể nâng cao khả năng mở rộng và hiệu suất xóa trang bẩn.
# Giá trị mặc định là 1, đề xuất: 4-8; và phải nhỏ hơn innodb_buffer_pool_instances
innodb_page_cleaners = 4

# Giải thích: Thông thường chọn giữa 8k và 16k, nếu chọn 8k thì tiêu thụ CPU ít hơn và hiệu suất truy vấn cao hơn, thường không cần thay đổi
# Giá trị mặc định: 16k; đề xuất: không thay đổi,
innodb_page_size = 16384

# Giải thích: InnoDB sử dụng một bộ đệm để lưu trữ chỉ mục và dữ liệu gốc, không giống như MyISAM. Khi bạn đặt giá trị này lớn hơn, bạn cần ít I/O đĩa hơn khi truy cập dữ liệu trong bảng.
# Trên một máy chủ cơ sở dữ liệu độc lập, bạn có thể đặt biến này thành 60% - 80% kích thước bộ nhớ vật lý của máy chủ
# Chú ý không đặt quá lớn, sẽ làm cho không gian swap của hệ thống bị chiếm dụng, làm chậm hệ điều hành và làm giảm hiệu suất truy vấn SQL
# Giá trị mặc định: 128M, đề xuất: 60% - 80% kích thước bộ nhớ vật lý
innodb_buffer_pool_size = 512M

# Giải thích: Chỉ có ý nghĩa khi giá trị innodb_buffer_pool_size lớn hơn 1G, nhỏ hơn 1G, instances mặc định là 1, lớn hơn 1G, instances mặc định là 8
# Tuy nhiên, có nhận xét trên mạng rằng, hiệu suất tốt nhất, mỗi instance ít nhất 1G.
# Giá trị mặc định: 1 hoặc 8, đề xuất: innodb_buffer_pool_size/innodb_buffer_pool_instances >= 1G
innodb_buffer_pool_instances = 1

# Giải thích: tính năng mới của mysql 5.7, xác định kích thước phần tử cho các hoạt động thay đổi kích thước bộ đệm InnoDB trực tuyến.
# Kích thước bộ đệm thực tế phải là bội số của innodb_buffer_pool_chunk_size * innodb_buffer_pool_instances, lấy giá trị lớn hơn innodb_buffer_pool_size một chút
# Giá trị mặc định: 128M, đề xuất: giữ nguyên giá trị mặc định, thay đổi ngẫu nhiên có thể gây ra vấn đề, nó sẽ ảnh hưởng đến kích thước thực tế của bộ nhớ đệm.
innodb_buffer_pool_chunk_size = 128M

# Tải dữ liệu nóng vào bộ nhớ khi khởi động. Giá trị mặc định là bật, không thay đổi
innodb_buffer_pool_load_at_startup = 1

# Lưu dữ liệu nóng vào đĩa cục bộ khi tắt. Giá trị mặc định là bật, không thay đổi
innodb_buffer_pool_dump_at_shutdown = 1

# Giải thích: Ảnh hưởng đến thuật toán làm mới bộ đệm Innodb, đề xuất cấu hình từ nhỏ đến lớn, cho đến khi không còn trang trống; innodb_lru_scan_depth * innodb_buffer_pool_instances xác định số công việc được thực hiện bởi luồng xóa trang mỗi giây.
# Giá trị mặc định: 1024, đề xuất: không biết
innodb_lru_scan_depth = 1024

# Giải thích: Thời gian chờ tối đa để giao dịch chờ lấy tài nguyên, tính bằng giây, xem tình hình kinh doanh cụ thể, thường giá trị mặc định là đủ
# Giá trị mặc định: 50, đề xuất: xem tình hình kinh doanh.
innodb_lock_wait_timeout = 60

# Giải thích: Đặt giới hạn số lượng hoạt động I/O mỗi giây của tác vụ nền MySQL (ví dụ: làm mới trang và merge dadta từ bộ đệm)。
# Giá trị mặc định: 200, đề xuất: phương pháp 1, đối với ổ đĩa SATA đặt 100, đối với SAS10, RAID10 đặt 200, đối với SSD đặt 2000, đối với fushion-io đặt 50000; phương pháp 2, đo lường hiệu suất I/O đĩa bằng công cụ kiểm tra và đặt giá trị IOPS/2.
innodb_io_capacity = 2000

# Giải thích: Tham số này là tổng giới hạn của tất cả các luồng I/O của bộ đệm.
# Giá trị mặc định: gấp đôi innodb_io_capacity. Đề xuất: ví dụ, sau khi kiểm tra hiệu suất IOPS của công cụ, chỉ định giá trị số IOPS.
innodb_io_capacity_max = 4000

# Giải thích: Điều khiển chế độ mở và ghi tệp dữ liệu InnoDB và redo log, có ba chế độ: fdatasync (mặc định), O_DSYNC, O_DIRECT
# fdatasync: tệp dữ liệu, bộ đệm os->bộ đệm os->đĩa; tệp nhật ký, bộ đệm os->bộ đệm os->đĩa;
# O_DSYNC: tệp dữ liệu, bộ đệm os->bộ đệm os->đĩa; tệp nhật ký, bộ đệm os->đĩa;
# O_DIRECT: tệp dữ liệu, bộ đệm os->đĩa; tệp nhật ký, bộ đệm os->bộ đệm os->đĩa;
# Giá trị mặc định là trống, đề xuất: sử dụng SAN hoặc raid, đề xuất sử dụng O_DIRECT, nếu không hiểu kiểm tra, sử dụng mặc định O_DIRECT trong sản xuất
innodb_flush_method = O_DIRECT

# Giải thích: Mặc định mở từ mysql 5.7, có nghĩa là mỗi bảng một không gian bảng độc lập.
# Giá trị mặc định: 1, bật
innodb_file_per_table = 1

# Giải thích: Đường dẫn nơi InnoDB tạo không gian bảng hoàn tác. Thông thường bằng với thư mục lưu trữ của nhật ký hoàn tác.
# Giá trị mặc định: ./; tự đặt
innodb_undo_directory = /usr/local/mysql-5.7.21/log

# Giải thích: Số lượng không gian bảng hoàn tác được sử dụng bởi InnoDB bằng số lượng nhật ký hoàn tác. Bắt đầu từ 5.7.21 đã bị loại bỏ
# Giá trị mặc định là 0, đề xuất giữ nguyên giá trị mặc định, không cần điều chỉnh.
innodb_undo_tablespaces = 0

# Giải thích: Xác định số lượng đoạn hoàn tác được sử dụng bởi undo. Bị loại bỏ từ 5.7.19
# Giá trị mặc định: 128, đề xuất không thay đổi, sẽ bị loại bỏ trong tương lai.
innodb_undo_logs = 128

# Giải thích: Bắt đầu từ 5.7.5, thu gọn không gian undo log được sử dụng trực tuyến.
# Giá trị mặc định: tắt, đề xuất: bật
innodb_undo_log_truncate = 1

# Giải thích: Kích thước tối đa của undo log. 
# Giá trị mặc định: 1G, đề xuất: không thay đổi.
innodb_max_undo_log_size = 1G

# Giải thích: Thư mục lưu trữ tệp nhật ký ghi lại
innodb_log_group_home_dir = /usr/local/mysql-5.7.21/log

# Giải thích: Kích thước tệp nhật ký
# Giá trị mặc định: 48M, đề xuất: điều chỉnh kích thước dựa trên không gian đĩa hệ thống và tăng trưởng nhật ký
innodb_log_file_size = 128M

# Giải thích: Số lượng tệp nhật ký trong nhóm, MySQL ghi nhật ký theo cách vòng lặp
# Giá trị mặc định: 2, đề xuất: điều chỉnh kích thước dựa trên không gian đĩa hệ thống và tăng trưởng nhật ký
innodb_log_files_in_group = 3

# Tham số này xác định kích thước bộ nhớ được sử dụng cho các tệp nhật ký, tính bằng M. Bộ đệm lớn hơn có thể cải thiện hiệu suất, nhưng nếu xảy ra sự cố bất ngờ, dữ liệu có thể bị mất. Nhà phát triển MySQL đề xuất đặt giá trị từ 1-8M
innodb_log_buffer_size = 16M

# Giải thích: Có thể điều chỉnh tần suất ghi log từ bộ đệm hệ thống vào tệp đĩa, tăng có thể giảm tải hệ thống
# Giá trị mặc định là 1; đề xuất không thay đổi. Hiệu suất hệ thống thông thường đủ.
innodb_flush_log_at_timeout = 1

# Giải thích: Tham số có thể được đặt thành 0, 1, 2;
# Tham số 0: có nghĩa là mỗi giây, nội dung bộ đệm nhật ký được ghi vào bộ đệm hệ thống, sau đó gọi hoạt động flush của hệ thống để ghi vào tệp đĩa.
# Tham số 1: có nghĩa là mỗi lần giao dịch được gửi, nhật ký redo được ghi trực tiếp vào đĩa.
# Tham số 2: có nghĩa là mỗi lần giao dịch được gửi, sau 1 giây thì nhật ký redo mới được ghi vào đĩa.
# Đề xuất đặt thành 1, điều này đảm bảo không mất dữ liệu sau khi MySQL khởi động lại bất thường.
innodb_flush_log_at_trx_commit = 1

# Giải thích: Giới hạn số bảng mà InnoDB có thể mở, nếu có nhiều bảng trong cơ sở dữ liệu, hãy tăng giá trị này.
# Giá trị mặc định là 2000, đề xuất: tham khảo tổng số bảng cơ sở dữ liệu và điều chỉnh, thông thường đủ sử dụng.
innodb_open_files = 8192

# Số luồng I/O đọc/ghi của InnoDB, xác định dựa trên số lõi CPU, giá trị có thể từ 1-64
# Giá trị mặc định: 4, đề xuất: giữ nguyên giá trị mặc định, giữ một nửa số lõi CPU logic.
innodb_read_io_threads = 4
innodb_write_io_threads = 4

# Mặc định là 0, không giới hạn số lượng đồng thời, ở đây đề xuất đặt thành 0, tận dụng tốt khả năng xử lý đa nhân CPU, tăng số lượng đồng thời
innodb_thread_concurrency = 0

# Giá trị mặc định là 4, đề xuất không thay đổi. Trong InnoDB, việc xóa là một loại hoạt động định kỳ để thu hồi dữ liệu không sử dụng. Từ mysql 5.5 trở đi, hỗ trợ xóa đa luồng.
innodb_purge_threads = 4

# Giải thích: Bộ nhớ đệm MySQL được chia thành khối mới và khối cũ; tham số này xác định tỷ lệ khối cũ;
# Giá trị mặc định: 37, đề xuất: thông thường không thay đổi
innodb_old_blocks_pct = 37

# Giải thích: Dữ liệu mới được tải vào bộ nhớ đệm, vào khu vực trang cũ, nếu truy cập lại sau 1 giây, nó sẽ được nâng lên khu vực trang mới.
# Giá trị mặc định: 1000
innodb_old_blocks_time=1000

# Giải thích: Bật bất đồng bộ I/O, có thể tăng cường đồng thời, mặc định bật.
# Giá trị mặc định là 1, đề xuất không thay đổi
innodb_use_native_aio = 1

# Giải thích: Mặc định là trống, sử dụng thư mục dữ liệu, thông thường không thay đổi.
innodb_data_home_dir=/usr/local/mysql-5.7.21/data

# Giải thích: Xác định tên, kích thước và thuộc tính của các tệp dữ liệu không gian hệ thống InnoDB.
# Giá trị mặc định, không chỉ định, mặc định là ibdata1: 12M: autoextend
innodb_data_file_path = ibdata1: 12M: autoextend

# Giải thích: Đặt kích thước bộ nhớ được sử dụng bởi InnoDB để lưu trữ thông tin từ điển dữ liệu và một số cấu trúc dữ liệu nội bộ, trừ khi đối tượng dữ liệu của bạn rất nhiều, nếu không, thông thường không cần thay đổi.
# innodb_additional_mem_pool_size = 16M
# Giải thích: Chế độ khôi phục sau sự cố. Chỉ khi cần phục hồi dữ liệu trong trường hợp khẩn cấp, hãy đặt giá trị lớn hơn 1-6, ý nghĩa xem trang web chính thức.
# Giá trị mặc định là 0;
#innodb_force_recovery = 0



[mysqldump]

# Tùy chọn quick buộc mysqldump truy vấn dữ liệu trực tiếp từ máy chủ và xuất chúng thay vì lấy tất cả các bản ghi và lưu chúng vào bộ nhớ cache
quick

max_allowed_packet = 16M



[mysql]

# Công cụ dòng lệnh mysql không sử dụng chức năng tự động hoàn thiện, đề xuất thay đổi thành
# no-auto-rehash
auto-rehash

# Tệp socket
socket = /var/lib/mysql/mysql.sock
```
