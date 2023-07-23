---
title: MongoDB Operations
tags: [db, mongodb, nosql]
categories: [db, mongodb, nosql]
date created: 2023-07-24
date modified: 2023-07-24
---

# Quản trị MongoDB

## Cài đặt MongoDB

### Windows

(1) Tải xuống và giải nén

Truy cập vào trang web chính thức để tải xuống MongoDB và chọn phiên bản phù hợp tại: [Download MongoDB Community Server | MongoDB](https://www.mongodb.com/try/download/community)

(2) Tạo thư mục dữ liệu

MongoDB lưu trữ dữ liệu trong thư mục db. Tuy nhiên, thư mục này không được tự động tạo ra, chúng ta cần tạo nó sau khi cài đặt.

Ví dụ: `D:\Tools\Server\mongodb\mongodb-4.4.0\data\db`

(3) Chạy dịch vụ MongoDB

```shell
mongod --dbpath D:\Tools\Server\mongodb\mongodb-4.4.0\data\db
```

(4) Kết nối với MongoDB từ máy khách

Bạn có thể kết nối với MongoDB bằng cách chạy lệnh `mongo.exe` trong cửa sổ dòng lệnh.

(5) Cấu hình dịch vụ MongoDB

### Linux

(1) Cài đặt bằng gói cài đặt

Trước khi cài đặt, chúng ta cần cài đặt các gói phụ thuộc cho các nền tảng Linux.

**Red Hat/CentOS:**

```
sudo yum install libcurl openssl
```

**Ubuntu 18.04 LTS ("Bionic")/Debian 10 "Buster":**

```
sudo apt-get install libcurl4 openssl
```

**Ubuntu 16.04 LTS ("Xenial")/Debian 9 "Stretch":**

```
sudo apt-get install libcurl3 openssl
```

(2) Tạo thư mục dữ liệu

Mặc định, MongoDB sẽ khởi tạo hai thư mục sau khi khởi động:

- Thư mục lưu trữ dữ liệu: /var/lib/mongodb
- Thư mục ghi nhật ký: /var/log/mongodb

Trước khi khởi động, chúng ta có thể tạo hai thư mục này và đặt quyền đọc và ghi cho người dùng hiện tại:

```shell
sudo mkdir -p /var/lib/mongo
sudo mkdir -p /var/log/mongodb
sudo chown `whoami` /var/lib/mongo     # Đặt quyền
sudo chown `whoami` /var/log/mongodb   # Đặt quyền
```

(3) Chạy dịch vụ MongoDB

```shell
mongod --dbpath /var/lib/mongo --logpath /var/log/mongodb/mongod.log --fork
```

Mở tệp /var/log/mongodb/mongod.log và kiểm tra thông tin sau, nếu xuất hiện, điều đó có nghĩa là khởi động thành công.

```shell
# tail -10f /var/log/mongodb/mongod.log
2020-07-09T12:20:17.391+0800 I  NETWORK  [listener] Listening on /tmp/mongodb-27017.sock
2020-07-09T12:20:17.392+0800 I  NETWORK  [listener] Listening on 127.0.0.1
2020-07-09T12:20:17.392+0800 I  NETWORK  [listener] waiting for connections on port 27017
```

(4) Kết nối với MongoDB từ máy khách

```shell
cd /usr/local/mongodb4/bin
./mongo
```

### Thiết lập tên người dùng và mật khẩu

```shell
> use admin
chuyển sang db admin
> db.createUser({"user":"root","pwd":"root","roles":[{"role":"userAdminAnyDatabase","db":"admin"}]})
Thêm người dùng thành công: {
        "user" : "root",
        "roles" : [
                {
                        "role" : "userAdminAnyDatabase",
                        "db" : "admin"
                }
        ]
}
>
```

## Sao lưu và khôi phục dữ liệu

### Sao lưu dữ liệu

Trong MongoDB, chúng ta sử dụng lệnh `mongodump` để sao lưu dữ liệu MongoDB. Lệnh này cho phép xuất tất cả dữ liệu vào một thư mục được chỉ định.

Cú pháp lệnh `mongodump` như sau:

```
mongodump -h dbhost -d dbname -o dbdirectory
```

- -h: Địa chỉ máy chủ MongoDB, ví dụ: 127.0.0.1, cũng có thể chỉ định cổng: 127.0.0.1:27017.
- -d: Tên cơ sở dữ liệu cần sao lưu, ví dụ: test.
- -o: Đường dẫn lưu trữ dữ liệu sao lưu, ví dụ: c:\data\dump. Trước khi sao lưu, thư mục này cần được tạo trước. Sau khi sao lưu hoàn tất, MongoDB sẽ tự động tạo một thư mục test trong thư mục dump, chứa dữ liệu sao lưu của cơ sở dữ liệu đó.

Các tham số tùy chọn cho lệnh `mongodump` như sau:

| Cú pháp                                              | Mô tả                           | Ví dụ                                             |
| :--------------------------------------------------- | :----------------------------- | :----------------------------------------------- |
| mongodump --host HOST_NAME --port PORT_NUMBER         | Sao lưu toàn bộ dữ liệu MongoDB | mongodump --host runoob.com --port 27017         |
| mongodump --dbpath DB_PATH --out BACKUP_DIRECTORY    |                                | mongodump --dbpath /data/db/ --out /data/backup/ |
| mongodump --collection COLLECTION --db DB_NAME       | Sao lưu một bộ sưu tập cụ thể   | mongodump --collection mycol --db test           |

【Ví dụ】Sao lưu toàn bộ dữ liệu

```shell
$ mongodump -h 127.0.0.1 --port 27017 -o test2
...
2020-09-11T11:55:58.086+0800    done dumping test.company (18801 documents)
2020-09-11T11:56:00.725+0800    [#############...........]  test.people  559101/1000000  (55.9%)
2020-09-11T11:56:03.725+0800    [###################.....]  test.people  829496/1000000  (82.9%)
2020-09-11T11:56:06.725+0800    [#####################...]  test.people  884614/1000000  (88.5%)
2020-09-11T11:56:08.088+0800    [########################]  test.people  1000000/1000000  (100.0%)
2020-09-11T11:56:08.350+0800    done dumping test.people (1000000 documents)
```

【Ví dụ】Sao lưu cơ sở dữ liệu cụ thể

```shell
mongodump -h 127.0.0.1 --port 27017 -d admin -o test3
```

### Khôi phục dữ liệu

Trong MongoDB, chúng ta sử dụng lệnh `mongorestore` để khôi phục dữ liệu đã được sao lưu.

Cú pháp lệnh `mongorestore` như sau:

```shell
> mongorestore -h <hostname><:port> -d dbname <path>
```

- `--host <:port>`, `-h <:port>`: Địa chỉ máy chủ MongoDB, mặc định là: localhost:27017.
- `--db`, `-d`: Cơ sở dữ liệu cần khôi phục, ví dụ: test, tên này cũng có thể khác với tên khi sao lưu, ví dụ: test2.
- `--drop`: Trong quá trình khôi phục, trước tiên xóa dữ liệu hiện tại và sau đó khôi phục dữ liệu đã sao lưu. Điều này có nghĩa là sau khi khôi phục, dữ liệu đã được thêm hoặc sửa đổi sau khi sao lưu sẽ bị xóa, hãy sử dụng cẩn thận!
- `<path>`: Thư mục chứa dữ liệu sao lưu. Bạn không thể chỉ định cùng lúc `<path>` và tùy chọn `--dir`, `--dir` cũng có thể được sử dụng để chỉ định thư mục sao lưu.
- `--dir`: Chỉ định thư mục sao lưu. Bạn không thể chỉ định cùng lúc `<path>` và tùy chọn `--dir`.

【Ví dụ】

```shell
$ mongorestore -h 127.0.0.1 --port 27017 -d test --dir test --drop
...
2020-09-11T11:46:16.053+0800    finished restoring test.tweets (966 documents, 0 failures)
2020-09-11T11:46:18.256+0800    [###.....................]  test.people  164MB/1.03GB  (15.6%)
2020-09-11T11:46:21.255+0800    [########................]  test.people  364MB/1.03GB  (34.6%)
2020-09-11T11:46:24.256+0800    [############............]  test.people  558MB/1.03GB  (53.0%)
2020-09-11T11:46:27.255+0800    [###############.........]  test.people  700MB/1.03GB  (66.5%)
2020-09-11T11:46:30.257+0800    [###################.....]  test.people  846MB/1.03GB  (80.3%)
2020-09-11T11:46:33.255+0800    [######################..]  test.people  990MB/1.03GB  (94.0%)
2020-09-11T11:46:34.542+0800    [########################]  test.people  1.03GB/1.03GB  (100.0%)
2020-09-11T11:46:34.543+0800    no indexes to restore
2020-09-11T11:46:34.543+0800    finished restoring test.people (1000000 documents, 0 failures)
2020-09-11T11:46:34.544+0800    1000966 document(s) restored successfully. 0 document(s) failed to restore.
```

## Import và Export

Các công cụ `mongoimport` và `mongoexport` không thể đảm bảo lưu trữ tất cả các loại dữ liệu BSON phong phú một cách đáng tin cậy, vì JSON chỉ có thể đại diện cho một phần con của các loại dữ liệu BSON được hỗ trợ. Do đó, việc xuất và nhập dữ liệu có thể dẫn đến mất mát một số độ chính xác.

### Thực hiện Import

Trong MongoDB, chúng ta sử dụng lệnh `mongoimport` để nhập dữ liệu. Mặc định, `mongoimport` sẽ nhập dữ liệu vào một MongoDB instance đang chạy trên máy chủ cục bộ và cổng 27017. Để nhập dữ liệu vào một instance MongoDB đang chạy trên máy chủ hoặc cổng khác, hãy chỉ định máy chủ và cổng bằng cách sử dụng các tùy chọn `--host` và `--port`. Sử dụng tùy chọn `--drop` để xóa bộ sưu tập (nếu nó đã tồn tại) trước khi nhập dữ liệu. Điều này đảm bảo rằng bộ sưu tập chỉ chứa dữ liệu bạn muốn nhập.

Cú pháp lệnh `mongoimport` như sau:

```bash
mongoimport -h IP --port PORT -u USERNAME -p PASSWORD -d DATABASE -c COLLECTION --type TYPE --headerline --upsert --drop FILENAME
```

【Ví dụ】Nhập dữ liệu vào một bảng

```shell
$ mongoimport -h 127.0.0.1 --port 27017 -d test -c book --drop test/book.dat
2020-09-11T10:53:56.359+0800    connected to: mongodb://127.0.0.1:27017/
2020-09-11T10:53:56.372+0800    dropping: test.book
2020-09-11T10:53:56.628+0800    431 document(s) imported successfully. 0 document(s) failed to import.
```

【Ví dụ】Nhập dữ liệu từ tệp JSON

```shell
$ mongoimport -h 127.0.0.1 --port 27017 -d test -c student --upsert test/student.json
2020-09-11T11:02:55.907+0800    connected to: mongodb://127.0.0.1:27017/
2020-09-11T11:02:56.068+0800    200 document(s) imported successfully. 0 document(s) failed to import.
```

【Ví dụ】Nhập dữ liệu từ tệp CSV

```shell
$ mongoimport -h 127.0.0.1 --port 27017 -d test -c product --type csv --headerline test/product.csv
2020-09-11T11:07:49.788+0800    connected to: mongodb://127.0.0.1:27017/
2020-09-11T11:07:51.051+0800    11 document(s) imported successfully. 0 document(s) failed to import.
```

【Ví dụ】Nhập một phần dữ liệu từ bảng

```shell
$ mongoimport -h 127.0.0.1 --port 27017 -d test -c product --type json --upsertFields name,price test/product.json
2020-09-11T11:14:05.410+0800    connected to: mongodb://127.0.0.1:27017/
2020-09-11T11:14:05.612+0800    11 document(s) imported successfully. 0 document(s) failed to import.
```

### Thực hiện Export

Cú pháp lệnh như sau:

```shell
mongoexport -h <IP> --port <PORT> -u <USERNAME> -p <PASSWORD> -d <DATABASE> -c <COLLECTION> -f <FIELDS> -q <QUERY> --csv -o <FILENAME>
```

- `-f`: Chỉ định các trường cần xuất, phân tách bằng dấu phẩy, `-f name,email,age` chỉ định xuất ba trường name, email, age.
- `-q`: Có thể chỉ định truy vấn để xuất, `-q '{ "uid" : "100" }'` chỉ định xuất dữ liệu với uid là 100.
- `--csv`: Chỉ định định dạng tệp xuất là csv, điều này hữu ích vì hầu hết các cơ sở dữ liệu quan hệ đều hỗ trợ csv và có điểm chung này.

【Ví dụ】Xuất toàn bộ bảng

```shell
$ mongoexport -h 127.0.0.1 --port 27017 -d test -c product -o test/product.dat
2020-09-11T10:44:23.161+0800    connected to: mongodb://127.0.0.1:27017/
2020-09-11T10:44:23.177+0800    exported 11 records
```

【Ví dụ】Xuất bảng thành tệp JSON

```shell
$ mongoexport -h 127.0.0.1 --port 27017 -d test -c product --type json -o test/product.json
2020-09-11T10:49:52.735+0800    connected to: mongodb://127.0.0.1:27017/
2020-09-11T10:49:52.750+0800    exported 11 records
```

【Ví dụ】Xuất một phần trường từ bảng thành tệp CSV

```shell
$ mongoexport -h 127.0.0.1 --port 27017 -d test -c product --type csv -f name,price -o test/product.csv
2020-09-11T10:47:33.160+0800    connected to: mongodb://127.0.0.1:27017/
2020-09-11T10:47:33.176+0800    exported 11 records
```
