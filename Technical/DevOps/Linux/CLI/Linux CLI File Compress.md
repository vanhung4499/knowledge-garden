---
title: Linux CLI File Compress
tags: [linux]
categories: [linux]
date created: 2023-09-03
date modified: 2023-09-03
---

# Nén và giải nén tệp trên Linux

> Từ khóa: `tar`, `gzip`, `zip`, `unzip`

## 1. Điểm cần lưu ý khi nén và giải nén tệp trên Linux

- Nén và giải nén tệp tar - Sử dụng [tar](#tar)
- Nén và giải nén tệp gz - Sử dụng [gzip](#gzip)
- Nén và giải nén tệp zip - Sử dụng [zip](#zip) và [unzip](#unzip)

## 2. Các cách sử dụng phổ biến của các lệnh

### 2.1. tar

> Lệnh tar được sử dụng để tạo tệp lưu trữ cho các tệp và thư mục trên Linux. Bằng cách sử dụng tar, bạn có thể tạo ra một tệp lưu trữ (tệp sao lưu) cho một tệp cụ thể, thay đổi tệp trong tệp lưu trữ hoặc thêm tệp mới vào tệp lưu trữ. Ban đầu, tar được sử dụng để tạo tệp lưu trữ trên băng, nhưng hiện nay, người dùng có thể tạo tệp lưu trữ trên bất kỳ thiết bị nào. Bằng cách sử dụng lệnh tar, bạn có thể đóng gói một số lượng lớn tệp và thư mục thành một tệp duy nhất, điều này rất hữu ích để sao lưu tệp hoặc kết hợp một số tệp thành một tệp để dễ dàng truyền qua mạng.
>
> Tham khảo: http://man.linuxde.net/tar

Ví dụ:

```bash
tar -cvf log.tar log2012.log            # Chỉ đóng gói, không nén
tar -zcvf log.tar.gz log2012.log        # Đóng gói và nén bằng gzip
tar -jcvf log.tar.bz2 log2012.log       # Đóng gói và nén bằng bzip2

tar -ztvf log.tar.gz                    # Xem các tệp trong tệp tar đã nén
tar -zxvf log.tar.gz                    # Giải nén tệp tar
tar -zxvf log30.tar.gz log2013.log      # Chỉ giải nén một số tệp từ tệp tar
```

### 2.2. gzip

> Lệnh gzip được sử dụng để nén tệp. gzip là một chương trình nén rộng rãi sử dụng để nén tệp, tên tệp sẽ có phần mở rộng ".gz" sau khi nén.
>
> gzip là một lệnh thường được sử dụng để nén tệp lớn hoặc ít sử dụng để tiết kiệm không gian đĩa, cũng như tạo thành một định dạng nén phổ biến trên hệ điều hành Linux. Theo thống kê, gzip có tỷ lệ nén 60% ~ 70% đối với tệp văn bản. Giảm kích thước tệp có hai lợi ích rõ rệt, một là giảm không gian lưu trữ, hai là giảm thời gian truyền tệp qua mạng.
>
> Tham khảo: http://man.linuxde.net/gzip

Ví dụ:

```bash
gzip * # Nén tất cả các tệp thành tệp .gz
gzip -l * # Hiển thị thông tin chi tiết về các tệp nén, không giải nén
gzip -dv * # Giải nén tất cả các tệp nén trong ví dụ trên và hiển thị thông tin chi tiết
gzip -r log.tar     # Nén một tệp sao lưu tar, tên tệp nén sẽ là .tar.gz
gzip -rv test/      # Nén thư mục đệ quy
gzip -dr test/      # Giải nén thư mục đệ quy
```

### 2.3. zip

> Lệnh zip được sử dụng để nén và giải nén tệp tin. zip là một chương trình nén rộng rãi sử dụng để nén tệp, tệp nén sẽ có phần mở rộng ".zip".
>
> Tham khảo: http://man.linuxde.net/zip

Ví dụ:

```bash
# Nén tất cả các tệp và thư mục trong /home/Blinux/html thành tệp html.zip trong thư mục hiện tại
zip -q -r html.zip /home/Blinux/html
```

### 2.4. unzip

> Lệnh unzip được sử dụng để giải nén các tệp tin đã được nén bằng lệnh zip.
>
> Tham khảo: http://man.linuxde.net/unzip

Ví dụ:

```bash
unzip test.zip              # Giải nén tệp zip
unzip -n test.zip -d /tmp/  # Giải nén tệp zip vào thư mục chỉ định
unzip -o test.zip -d /tmp/  # Giải nén tệp zip vào thư mục chỉ định, ghi đè nếu có tệp trùng lặp
unzip -v test.zip           # Xem nội dung của tệp zip, không giải nén
```
