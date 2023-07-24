---
title: Redis In Action
tags: [db, redis, nosql]
categories: [db, redis, nosql]
date created: 2023-07-24
date modified: 2023-07-24
---

# Redis thực tế

## 1. Các tình huống sử dụng

Redis có thể được áp dụng trong nhiều tình huống, dưới đây là một số tình huống sử dụng phổ biến.

### Bộ nhớ cache

Cache là một trong những tình huống sử dụng phổ biến nhất của Redis.

Redis có nhiều kiểu dữ liệu và các lệnh thao tác phong phú, cùng với hiệu suất cao và tính sẵn sàng cao, rất phù hợp để sử dụng làm cache phân tán.

> Nguyên tắc cơ bản của việc sử dụng cache, vui lòng tham khảo phần [**Nguyên tắc cơ bản của cache**].

### BitMap và BloomFilter

Redis không chỉ hỗ trợ 5 kiểu dữ liệu cơ bản mà còn hỗ trợ BitMap và BloomFilter (có thể được hỗ trợ thông qua Redis Module).

BitMap và BloomFilter đều có thể được sử dụng để giải quyết vấn đề cache penetration. Điểm quan trọng là loại bỏ một số dữ liệu không thể tồn tại.

> Vấn đề cache penetration có thể được tìm hiểu tại: [**Nguyên tắc cơ bản của cache**]

BitMap phù hợp cho dữ liệu nhỏ, trong khi BloomFilter phù hợp cho dữ liệu lớn.

### Khóa phân tán

Sử dụng Redis làm khóa phân tán, các điểm cần lưu ý như sau:

- **Độc quyền** - Sử dụng `setnx` để giành lấy khóa.
- **Tránh không bao giờ giải phóng khóa** - Sử dụng `expire` để đặt thời gian hết hạn, tránh việc giữ khóa mãi mãi dẫn đến chặn.
- **Tính nguyên tử** - setnx và expire phải được kết hợp thành một lệnh nguyên tử, tránh trường hợp setnx sau đó máy chủ bị sập mà không kịp đặt expire, dẫn đến việc khóa không bao giờ được giải phóng.

> Để biết thêm về các cách triển khai khóa phân tán và chi tiết, vui lòng tham khảo: [**Nguyên tắc cơ bản của khóa phân tán**]

## 2. Tip

Dựa trên các đặc điểm của Redis, có một số tip nhỏ trong thực tế áp dụng.

### keys và scan

Sử dụng lệnh `keys` để liệt kê danh sách các khóa theo mẫu chỉ định.

Nếu Redis đang phục vụ cho dịch vụ trực tuyến, việc sử dụng lệnh `keys` sẽ gặp vấn đề gì?

Đầu tiên, Redis là một luồng đơn. Lệnh `keys` sẽ gây chặn luồng trong một khoảng thời gian, dịch vụ trực tuyến sẽ tạm dừng cho đến khi lệnh được thực thi xong.

Trong trường hợp này, bạn có thể sử dụng lệnh `scan`, lệnh `scan` có thể trích xuất danh sách các khóa theo mẫu chỉ định mà không gây chặn, nhưng có thể có một số khóa trùng lặp, bạn có thể loại bỏ chúng trong khách hàng và thời gian tổng cộng sẽ lâu hơn so với việc sử dụng lệnh `keys`.

Tuy nhiên, các lệnh tăng dần vẫn không hoàn toàn không có nhược điểm: ví dụ, lệnh `SMEMBERS` có thể trả về tất cả các thành viên hiện tại của một tập hợp khóa, nhưng đối với các lệnh tăng dần như `SCAN`, vì trong quá trình tăng dần khóa, khóa có thể bị sửa đổi, do đó, các lệnh tăng dần chỉ có thể đảm bảo giới hạn hợp lý cho các thành viên được trả về.
