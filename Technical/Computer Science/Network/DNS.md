---
categories: [network, computer-science]
title: DNS
date created: 2023-05-26
date modified: 2023-09-17
tags: [network, computer-science]
---

# DNS

Một người có thể được xác định bằng số CCCD có độ dài cố định và tên. Máy tính sẽ thích số CCCD và người bình thường sẽ thích tên hơn.

Do đó, các hostname như www.google.com được người dùng ưa thích hơn vì chúng dễ nhớ. Tuy nhiên, thông tin về vị trí của máy chủ không thể lấy được với hostname này và các bộ định tuyến khó xử lý nó dưới dạng độ dài thay đổi. Vì vậy, nó được xác định bởi địa chỉ IP của nó.

Nghĩa là, có hai cách để xác định máy chủ: hostname và địa chỉ IP.

## DNS(Domain Name System)

Mọi người và bộ định tuyến có số nhận dạng ưu tiên khác nhau. Để thỏa hiệp, bạn cần chuyển đổi hostname thành địa chỉ IP, sử dụng DNS.

DNS là cơ sở dữ liệu phân tán lưu trữ tên miền (domain name) và địa chỉ IP. Bạn có thể coi DNS như một sổ địa chỉ cho các trang web.

Thay vì địa chỉ IP dạng số (ví dụ: 63.245.217.105), nó dùng để ánh xạ các địa chỉ để người dùng có thể sử dụng chúng một cách thuận tiện.

![Pasted image 20230528144958](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230528144958.png)

## DNS: Distributed Database

Nếu bạn thực hiện tất cả các truy vấn của mình ở một nơi thì thật đơn giản. Tuy nhiên, có thể thấy rằng cơ sở dữ liệu tập trung không thể mở rộng khi xem xét các vấn đề như lỗi máy chủ, lưu lượng truy cập, cơ sở dữ liệu tập trung từ xa và bảo trì.

💡 Vì vậy, DNS được phân phối theo dạng phân cấp sử dụng nhiều máy chủ. Nó là một cơ sở dữ liệu phân tán (Distributed Database).

![Pasted image 20230526185431](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230526185431.png)

## DNS query

DNS recursor (còn được gọi là DNS resolver) là một máy chủ nhận truy vấn từ DNS client, sau đó tương tác với các DNS server khác để truy tìm IP chính xác.

- **Mục đích của DNS query**: Đó là tìm kiếm các máy chủ DNS để tìm địa chỉ IP của trang web. Cho đến khi tìm thấy một địa chỉ IP, máy chủ DNS sẽ chuyển đi chuyển lại từ một máy chủ DNS này qua máy chủ DNS khác cho đến khi xảy ra lỗi.  

Có 2 kiểu truy vấn DNS

- Tìm kiếm đệ quy (recursive search)
- Truy vấn lặp (iterative query)

### Recursive search

Trong tra cứu Recursive DNS, một DNS server giao tiếp với các DNS server khác cao hơn trong hệ thống phân cấp. Giao tiếp này thay mặt cho local DNS server cho đến khi nó giải quyết hoàn toàn địa chỉ IP và được gửi trở lại máy client. Trong cách tiếp cận đệ quy, truy vấn nằm giữa server và local DNS server.

![recursive-dns-lookup 1](https://raw.githubusercontent.com/vanhung4499/images/master/snap/recursive-dns-lookup%201.png)

```
Khi tìm kiếm địa chỉ 'www.google.com':
1. Client truy vấn domain name tới Local DNS Server
2. Local DNS Server truy vấn đến Root DNS Server
3. Root DNS Server truy vấn đến TLD DNS Server (.com)
4. TLD DNS Server truy vấn đến Google DNS Server (google.com)
5. Google DNS Server trả IP cần tìm về TLD DNS Server
6. TLD DNS Server trả IP về Root DNS Server
7. Root DNS Server trả IP về Local DNS Server
8. Local DNS Server trả về địa chỉ IP cho client
```

### Iterative query

Với Iterative DNS query, máy client tương tác và yêu cầu phân giải tên miền từ mỗi DNS Server. Truy vấn giữa Local DNS Server và các server khác.

![iterative-dns-lookup](https://raw.githubusercontent.com/vanhung4499/images/master/snap/iterative-dns-lookup.png)

```
Khi tìm kiếm địa chỉ 'www.google.com':
1. Client truy vấn domain name tới Local DNS Server
2. Local DNS Server gửi yêu cầu đến Root DNS Server
3. Root DNS Server trả về địa chỉ IP của TLD DNS Server (.com)
4. Local DNS Server gửi yêu cầu đến TLD DNS Server (.com)
5. TLD DNS Server trả về địa chỉ IP của Google DNS Server (google.com)
6. Local DNS Server gửi yêu cầu đến Google DNS Server
7. Google DNS Server trả về địa chỉ IP tương ứng của 'google.com'
8. Local DNS Server trả về địa chỉ IP cho client
```

Cần có nhiều yêu cầu truy vấn để gửi kết quả ánh xạ tới máy chủ yêu cầu.

Do đó, DNS Cache được sử dụng để giảm truyền truy vấn.

## DNS Cache

Cache được sử dụng để cải thiện hiệu suất cục bộ của DNS và giảm số lượng yêu cầu DNS trên mạng.

Khi máy chủ DNS nhận được phản hồi DNS, nó có thể lưu trữ thông tin phản hồi trong bộ nhớ cục bộ.  
Khi cặp hostname và địa chỉ IP được lưu trữ trong máy chủ DNS, lần đầu tiên trình duyệt sẽ kiểm tra DNS trong bộ nhớ cache và nếu không có bản ghi được lưu, trình duyệt sẽ chuyển sang truy vấn DNS.  
Vì ánh xạ (hostname : IP Address) của máy chủ lưu trữ không phải là vĩnh viễn nên nó sẽ bị xóa một khoảng thời gian nhất định.

🎯 Bạn có thể bắt đầu liên lạc sau khi lấy địa chỉ IP của tên miền thông qua tên miền được nhập trong trình duyệt.
