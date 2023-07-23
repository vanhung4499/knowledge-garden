---
title: MongoDB Sharding
tags: [db, mongodb, nosql]
categories: [db, mongodb, nosql]
date created: 2023-07-24
date modified: 2023-07-24
---

# MongoDB Phân đoạn

## Giới thiệu về cụm phân đoạn

Khi MongoDB cần lưu trữ dữ liệu lớn, một nút đơn không đủ để lưu trữ toàn bộ dữ liệu và có thể không cung cấp được hiệu suất đáng hài lòng. Do đó, chúng ta có thể sử dụng cơ chế phân đoạn của MongoDB để hỗ trợ mở rộng theo chiều ngang.

### Đặc điểm của cụm phân đoạn

Hoàn toàn trong suốt với ứng dụng

Cân bằng dữ liệu tự động

Mở rộng động

Cung cấp ba phương pháp phân đoạn khác nhau

### Các thành phần của cụm phân đoạn

Cụm phân đoạn MongoDB bao gồm các thành phần sau:

- [shard](https://docs.mongodb.com/manual/core/sharded-cluster-shards/): Mỗi phân đoạn chứa một phần con của dữ liệu phân đoạn. Mỗi phân đoạn có thể triển khai như một bộ nhân bản.
- [mongos](https://docs.mongodb.com/manual/core/sharded-cluster-query-router/): mongos hoạt động như một bộ định tuyến truy vấn, cung cấp giao diện giữa ứng dụng khách hàng và cụm phân đoạn. Từ phiên bản MongoDB 4.4 trở đi, mongos có thể hỗ trợ [hedged reads](https://docs.mongodb.com/manual/core/sharded-cluster-query-router/#mongos-hedged-reads) để giảm thiểu độ trễ.
- [config servers](https://docs.mongodb.com/manual/core/sharded-cluster-config-servers/): Cung cấp lưu trữ dữ liệu siêu dữ liệu và ánh xạ phân phối dữ liệu.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230724020005.png)

### Phân phối của cụm phân đoạn

**Cụm sao chép MongoDB được phân phối theo bộ sưu tập**, phân phối dữ liệu trên các phân đoạn trong cụm. Tối đa cho phép 1024 phân đoạn.

Dữ liệu giữa các phân đoạn trong cụm sao chép MongoDB không trùng lặp, chỉ khi tất cả các phân đoạn đều hoạt động bình thường, cụm mới hoạt động đầy đủ.

Cơ sở dữ liệu MongoDB có thể chứa cả bộ sưu tập đã phân đoạn và chưa phân đoạn. Các bộ sưu tập đã phân đoạn sẽ được phân phối trên các nút trong cụm. Trong khi đó, các bộ sưu tập chưa phân đoạn được lưu trữ trên nút chính. Mỗi cơ sở dữ liệu có nút chính riêng của nó.

Bộ sưu tập đã phân đoạn và chưa phân đoạn:

![20200920212159.svg](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200920212159.svg)

### Nút định tuyến mongos

Để kết nối với [cụm phân đoạn MongoDB](https://docs.mongodb.com/manual/reference/glossary/#term-sharded-cluster), bạn phải kết nối với bộ định tuyến [`mongos`](https://docs.mongodb.com/manual/reference/glossary/#term-mongos). Điều này bao gồm cả các bộ sưu tập đã phân đoạn và chưa phân đoạn. Khách hàng không nên kết nối trực tiếp với các nút phân đoạn để thực hiện các hoạt động đọc và ghi.

Cách kết nối với [`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) tương tự như kết nối với [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod), ví dụ như thông qua [`mongo`](https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo) shell hoặc [MongoDB driver](https://docs.mongodb.com/drivers/?jump=docs).

![20200920212157.svg](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200920212157.svg)

Vai trò của nút định tuyến:

- Cung cấp điểm vào duy nhất cho cụm
- Chuyển tiếp yêu cầu từ ứng dụng
- Chọn nút dữ liệu phù hợp để đọc và ghi
- Kết hợp kết quả từ nhiều nút dữ liệu

Thường thì, nên có ít nhất 2 nút định tuyến mongos.

# Khóa phân đoạn

MongoDB sử dụng khóa phân đoạn để phân phối các tài liệu trong bộ sưu tập giữa các phân đoạn. Khóa phân đoạn được tạo thành từ một hoặc nhiều trường trong tài liệu.

- Từ phiên bản MongoDB 4.4 trở đi, các tài liệu trong bộ sưu tập phân đoạn có thể thiếu trường khóa phân đoạn. Khi phân phối tài liệu qua các phân đoạn, việc thiếu trường khóa phân đoạn sẽ được coi như có giá trị rỗng, nhưng không được sử dụng trong các truy vấn định tuyến.
- Trong MongoDB 4.2 và các phiên bản cũ hơn, trường khóa phân đoạn phải tồn tại trong mỗi tài liệu trong bộ sưu tập phân đoạn.

Lựa chọn khóa phân đoạn khi phân đoạn bộ sưu tập.

- Từ phiên bản MongoDB 4.4 trở đi, bạn có thể tối ưu hóa khóa phân đoạn của bộ sưu tập bằng cách thêm một hoặc nhiều trường hậu tố vào khóa hiện có.
- Trong MongoDB 4.2 và các phiên bản cũ hơn, không thể thay đổi lựa chọn khóa phân đoạn sau khi đã phân đoạn.

Giá trị khóa phân đoạn của tài liệu xác định phân phối của nó trên các phân đoạn

- Từ phiên bản MongoDB 4.2 trở đi, bạn có thể cập nhật giá trị khóa phân đoạn của tài liệu trừ khi trường khóa phân đoạn của bạn là trường không thể thay đổi như \_id.
- Trong MongoDB 4.0 và các phiên bản cũ hơn, giá trị trường khóa phân đoạn của tài liệu là không thể thay đổi.

Chỉ mục khóa phân đoạn: Để phân đoạn một bộ sưu tập đã được điền, bộ sưu tập đó phải có một chỉ mục bắt đầu bằng khóa phân đoạn. Khi phân đoạn một bộ sưu tập trống, MongoDB sẽ tạo một chỉ mục hỗ trợ cho khóa phân đoạn đã chỉ định nếu bộ sưu tập đó chưa có chỉ mục phù hợp.

Chiến lược phân đoạn: Lựa chọn khóa phân đoạn ảnh hưởng đến hiệu suất, hiệu quả và khả năng mở rộng của cụm phân đoạn. Lựa chọn khóa phân đoạn và chỉ mục phụ trợ cũng ảnh hưởng đến chiến lược phân đoạn mà cụm có thể sử dụng.

MongoDB phân đoạn dữ liệu. Mỗi phân đoạn có giới hạn dựa trên khóa phân đoạn.

Để đảm bảo phân phối đồng đều của các phân đoạn trên toàn cụm, trình cân bằng chạy trong nền và di chuyển các phân đoạn trên các phân đoạn.

## Chiến lược phân đoạn

MongoDB hỗ trợ hai chiến lược phân đoạn: Phân đoạn theo băm và phân đoạn theo phạm vi.

### Phân đoạn theo băm

Chiến lược phân đoạn theo băm tính toán giá trị băm của trường khóa phân đoạn; sau đó, mỗi [chunk](https://docs.mongodb.com/manual/reference/glossary/#term-chunk) được gán một phạm vi dựa trên giá trị khóa phân đoạn.

> Lưu ý: Khi giải quyết truy vấn sử dụng chỉ mục băm, MongoDB tự động tính toán giá trị băm, không cần ứng dụng tính toán giá trị băm.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200920213343.svg)

Mặc dù các phạm vi khóa phân đoạn có thể "gần nhau", nhưng giá trị băm của chúng không thể có khả năng nằm trên cùng một [chunk](https://docs.mongodb.com/manual/reference/glossary/#term-chunk). Phân phối dữ liệu dựa trên băm giúp phân phối dữ liệu đồng đều hơn, đặc biệt là trong các tập dữ liệu mà khóa phân đoạn thay đổi một cách đơn điệu.

Tuy nhiên, phân đoạn theo băm có nghĩa là các truy vấn phạm vi trên khóa phân đoạn không thể được hướng đến một phân đoạn duy nhất, dẫn đến nhiều hoạt động truyền phát trong phạm vi cụm.

### Phân đoạn theo phạm vi

Phân đoạn theo phạm vi chia dữ liệu thành nhiều phạm vi dựa trên giá trị khóa phân đoạn. Sau đó, mỗi [chunk](https://docs.mongodb.com/manual/reference/glossary/#term-chunk) được gán một phạm vi dựa trên giá trị khóa phân đoạn.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200920213345.svg)

Các giá trị khóa phân đoạn tương đối gần nhau có khả năng nằm trên cùng một [chunk](https://docs.mongodb.com/manual/reference/glossary/#term-chunk). Hiệu suất của phân đoạn theo phạm vi phụ thuộc vào lựa chọn khóa phân đoạn. Lựa chọn khóa phân đoạn không tốt có thể dẫn đến phân phối dữ liệu không đồng đều, gây suy giảm một số lợi ích của phân đoạn hoặc gây ra hạn chế hiệu suất.

## Vùng trong cụm phân đoạn

Vùng có thể cải thiện tính cục bộ của dữ liệu trong cụm phân đoạn chạy trên nhiều trung tâm dữ liệu.

Trong cụm phân đoạn, có thể tạo ra các [vùng](https://docs.mongodb.com/manual/reference/glossary/#term-zone) dữ liệu dựa trên khóa phân đoạn. Mỗi vùng có thể được liên kết với một hoặc nhiều phân đoạn trong cụm. Một phân đoạn có thể được liên kết với bất kỳ số lượng vùng nào. Trong cụm cân bằng, MongoDB chỉ di chuyển các [chunk](https://docs.mongodb.com/manual/reference/glossary/#term-chunk) mà vùng bao phủ tới phân đoạn liên quan đến vùng đó.

Mỗi vùng bao phủ một hoặc nhiều phạm vi giá trị khóa phân đoạn. Mỗi phạm vi bao phủ luôn bao gồm cả giới hạn trên và giới hạn dưới của nó.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200920214854.svg)

Khi xác định các phạm vi mới để bao phủ vùng, phải sử dụng các trường có trong khóa phân đoạn. Nếu sử dụng khóa phân đoạn kết hợp, phạm vi phải bao gồm tiền tố của khóa phân đoạn.

Khi lựa chọn khóa phân đoạn, nên xem xét các vùng có thể sử dụng trong tương lai.
