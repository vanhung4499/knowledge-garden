---
title: Redis Cluster
tags: [db, redis, nosql]
categories: [db, redis, nosql]
date created: 2023-07-24
date modified: 2023-07-24
---

# Redis Cluster

> **Redis Cluster** là một giải pháp cơ sở dữ liệu phân tán được cung cấp bởi Redis.
>
> Vì là một hệ thống phân tán, nó tự nhiên có các tính chất cơ bản của hệ thống phân tán: có thể mở rộng, có sẵn và nhất quán.
>
> - Redis Cluster phân vùng dữ liệu bằng cách chia các khe băm (hash slot) để chia sẻ dữ liệu.
> - Redis Cluster sử dụng mô hình master-slave đồng bộ để cung cấp tính năng sao chép và chuyển giao lỗi, đảm bảo tính sẵn có cao cho Redis Cluster.
> - Theo lý thuyết CAP, không thể đạt được Consistency, Availability và Partition tolerance cùng một lúc, và Redis Cluster chọn lựa chọn AP. Các nút trong Redis Cluster giao tiếp bất đồng bộ, không đảm bảo tính nhất quán mạnh, nhưng cố gắng đạt được tính nhất quán cuối cùng.

## 1. Phân vùng Redis Cluster

### 1.1. Các nút trong Cluster

Redis Cluster bao gồm nhiều nút, khi một nút khởi động, các nút này ban đầu là độc lập với nhau. **Các nút kết nối với nhau bằng cách gửi tin nhắn "CLUSTER MEET" để thêm các nút khác vào cụm của mình**.

Bằng cách gửi lệnh "CLUSTER MEET" đến một nút, nút hiện tại sẽ kết nối với nút được chỉ định bởi IP và PORT, và khi kết nối thành công, nút hiện tại sẽ thêm nút được chỉ định vào cụm của mình.

**Các nút trong Redis Cluster lưu trữ cặp khóa-giá trị và thời gian hết hạn giống như trong Redis đơn**.

Redis Cluster có các nút chính (master) và nút phụ (slave), trong đó nút chính được sử dụng để xử lý các khe băm (slot), và nút phụ được sử dụng để sao chép một nút chính cụ thể và thay thế nút chính khi nút chính bị lỗi.

### 1.2. Phân chia Hash Slot

Vấn đề chính cần giải quyết trong lưu trữ phân tán là phân chia **toàn bộ tập dữ liệu** theo **quy tắc phân vùng** thành **nhiều phân vùng** trên **nhiều nút**, mỗi nút chịu trách nhiệm cho một phần dữ liệu của toàn bộ.

**Redis Cluster sử dụng phân chia hash slot để phân vùng dữ liệu**. Redis Cluster chia toàn bộ cơ sở dữ liệu thành 16384 hash slot (khe hash), mỗi khóa trong cơ sở dữ liệu thuộc một trong số 16384 khe hash này, và mỗi nút trong cụm có thể xử lý từ 0 đến tối đa 16384 khe hash. **Nếu có bất kỳ khe hash nào không được xử lý, cụm Redis sẽ được đánh dấu là offline**.

Bằng cách gửi lệnh [`CLUSTER ADDSLOTS`](https://redis.io/commands/cluster-addslots) đến một nút, bạn có thể gán một hoặc nhiều khe hash cho nút đó.

```
> CLUSTER ADDSLOTS 1 2 3
OK
```

Mỗi nút trong cụm chịu trách nhiệm cho một phần khe hash. Ví dụ, trong một cụm có 3 nút:

- Nút A chịu trách nhiệm cho khe hash từ 0 đến 5500.
- Nút B chịu trách nhiệm cho khe hash từ 5501 đến 11000.
- Nút C chịu trách nhiệm cho khe hash từ 11001 đến 16384.

### 1.3. Địa chỉ

Khi máy khách gửi một lệnh liên quan đến khóa cơ sở dữ liệu cho nút, nút nhận lệnh sẽ tính toán xem lệnh cần xử lý thuộc về khe nào của cơ sở dữ liệu và kiểm tra xem khe này có được giao cho nút hiện tại không:

- Nếu khe chứa khóa được giao cho nút hiện tại, nút hiện tại sẽ thực hiện lệnh.
- Nếu khe chứa khóa không được giao cho nút hiện tại, nút sẽ trả về một lỗi MOVED cho máy khách, hướng dẫn máy khách chuyển hướng đến nút đúng.

#### 1.3.1. Tính toán khe mà khóa thuộc về

Giải thuật để quyết định một khóa nên được giao cho khe nào là: **tính toán kết quả CRC16 của khóa và sau đó lấy phần dư của kết quả chia cho 16834**.

```
HASH_SLOT = CRC16(KEY) mod 16384
```

Khi nút tính toán khe mà khóa thuộc về là i, nút sẽ kiểm tra các điều kiện sau để xác định xem khe có được giao cho nút hay không:

```
clusterState.slots[i] == clusterState.myself
```

#### 1.3.2. Lỗi MOVED

Khi nút phát hiện rằng khe chứa khóa không được giao cho nút hiện tại, nút sẽ trả về một lỗi `MOVED`, hướng dẫn máy khách chuyển hướng đến nút đang chịu trách nhiệm khe đó.

Định dạng lỗi `MOVED` như sau:

```
MOVED <khe> <ip>:<port>
```

> Hiểu theo cách cá nhân: Hành động MOVED này tương tự như chuyển hướng trong giao thức HTTP.

### 1.4. Tái phân vùng

**Hoạt động tái phân vùng trong Redis Cluster cho phép chuyển một số lượng bất kỳ các khe băm đã được giao cho một nút (nút nguồn) sang một nút khác (nút đích), và các cặp khóa-giá trị liên quan đến các khe băm đó cũng sẽ được di chuyển từ nút nguồn sang nút đích**.

Hoạt động tái phân vùng **có thể được thực hiện trực tuyến**, trong quá trình tái phân vùng, Redis Cluster không cần tắt máy và cả nút nguồn và nút đích đều có thể tiếp tục xử lý các yêu cầu lệnh.

Hoạt động tái phân vùng trong Redis Cluster được thực hiện bởi công cụ quản lý Redis Cluster **redis-trib**, nó gửi các lệnh đến nút nguồn và nút đích để thực hiện tái phân vùng.

### 1.5. Lỗi ASK

Lỗi `ASK` khác với lỗi `MOVED` ở chỗ: **Lỗi `ASK` chỉ là một biện pháp tạm thời được sử dụng trong quá trình di chuyển khe băm**, sau khi khách hàng nhận được lỗi `ASK` về khe băm X, khách hàng chỉ sẽ chuyển hướng yêu cầu lệnh liên quan đến khe băm X sang nút được chỉ định trong lần yêu cầu lệnh tiếp theo, nhưng việc chuyển hướng này sẽ không ảnh hưởng đến các yêu cầu lệnh liên quan đến khe băm X trong tương lai, khách hàng vẫn sẽ gửi yêu cầu lệnh liên quan đến khe băm X đến nút hiện tại đang chịu trách nhiệm xử lý khe băm X, trừ khi lỗi `ASK` xuất hiện một lần nữa.

## 2. Redis Cluster - Quá trình chuyển giao khi xảy ra sự cố

### 2.1. Sao chép

Cơ chế sao chép Redis có thể được tham khảo tại: [[Redis Replication]]

### 2.2. Phát hiện sự cố

**Mỗi nút trong cụm Redis sẽ định kỳ gửi tin nhắn PING đến các nút khác trong cụm để kiểm tra xem chúng có hoạt động không**.

Trạng thái của mỗi nút có thể được chia thành:

- Trạng thái trực tuyến;
- Trạng thái ngoại tuyến (FAIL);
- Trạng thái nghi ngờ ngoại tuyến (PFAIL), tức là không có phản hồi PING trong khoảng thời gian quy định;

### 2.3. Chuyển giao khi xảy ra sự cố

1. Trong số tất cả các nút con của nút chính bị xảy ra sự cố, một nút con sẽ được chọn.
2. Nút con được chọn sẽ thực hiện lệnh `SLAVEOF no one`, trở thành nút chính mới.
3. Nút chính mới sẽ hủy bỏ việc gán khe cho nút chính đã bị xảy ra sự cố và gán tất cả các khe này cho chính nó.
4. Nút chính mới sẽ phát sóng một tin nhắn PONG đến cụm Redis, thông báo rằng nút con này đã trở thành nút chính mới.

### 2.4. Bầu chọn nút chính mới

Quá trình bầu chọn nút chính mới trong Redis Cluster dựa trên thuật toán đồng thuận: Raft.

## 3. Giao tiếp trong Redis Cluster

Các nút trong cụm Redis giao tiếp thông qua việc gửi và nhận các tin nhắn.

Có năm loại tin nhắn chính mà các nút trong cụm Redis gửi đi:

- `MEET` - Yêu cầu nút nhận tham gia vào cụm mà nút gửi đang tham gia.
- `PING` - Mỗi nút trong cụm Redis sẽ chọn ngẫu nhiên năm nút từ danh sách nút đã biết và gửi tin nhắn PING đến năm nút này, nhằm kiểm tra xem các nút đã chọn có hoạt động không.
- `PONG` - Khi nút nhận được tin nhắn MEET hoặc PING từ nút gửi, nó sẽ trả lời bằng một tin nhắn PONG.
- `FAIL` - Khi một nút chính A xác định rằng một nút chính B đã vào trạng thái FAIL, nút A sẽ phát sóng một tin nhắn FAIL về nút B cho toàn bộ cụm Redis, tất cả các nút nhận được tin nhắn này sẽ đánh dấu nút B là đã ngoại tuyến.
- `PUBLISH` - Khi một nút nhận được một lệnh PUBLISH, nó sẽ thực hiện lệnh này và phát sóng một tin nhắn PUBLISH đến cụm Redis, tất cả các nút nhận được tin nhắn này sẽ thực hiện cùng một lệnh PUBLISH.

## 4. Ứng dụng của Redis Cluster

### 4.1. Giới hạn chức năng của cụm

Redis Cluster so với Redis đơn lẻ có một số giới hạn chức năng, các nhà phát triển cần hiểu trước và tránh khi sử dụng.

- Hỗ trợ hạn chế cho các hoạt động **đa khóa**: Các hoạt động như `mset`, `mget` chỉ hỗ trợ cho các khóa có cùng giá trị `slot`. Các khóa được ánh xạ vào các `slot` khác nhau không được hỗ trợ.
- Hỗ trợ hạn chế cho các hoạt động **giao dịch**: Chỉ hỗ trợ giao dịch cho nhiều khóa trên cùng một nút. Khi nhiều khóa phân tán trên các nút khác nhau, không thể sử dụng chức năng giao dịch.
- Không thể ánh xạ một đối tượng khóa lớn như `hash`, `list` vào các nút khác nhau. `Key` được coi là đơn vị phân vùng dữ liệu.
- Không hỗ trợ **nhiều không gian cơ sở dữ liệu**: Redis đơn lẻ có thể hỗ trợ `16` không gian cơ sở dữ liệu (`db0 ~ db15`), trong khi chế độ cụm chỉ hỗ trợ sử dụng một không gian cơ sở dữ liệu duy nhất, tức là `db0`.
- **Sao chép** chỉ hỗ trợ một cấp: Các nút con chỉ có thể sao chép từ nút chính, không hỗ trợ cấu trúc sao chép cây lồng nhau.

### 4.2. Giới hạn quy mô cụm

Redis Cluster dễ sử dụng. Các chức năng phân vùng, sao chép chính và mở rộng linh hoạt đều được tự động hóa, chỉ cần triển khai đơn giản là có thể có một cụm Redis lớn với khả năng chứa lượng dữ liệu lớn, đáng tin cậy và có sẵn cao, và đối với ứng dụng, nó gần như là trong suốt.

Vì vậy, Redis Cluster rất phù hợp để xây dựng các cụm Redis trung bình và nhỏ, trong đó có khoảng vài đến vài chục nút.

Tuy nhiên, Redis Cluster không phù hợp để xây dựng các cụm quy mô lớn, chủ yếu là do nó sử dụng một thiết kế phi tập trung.

Trên mỗi nút Redis, nó lưu trữ một bảng ánh xạ giữa tất cả các khe và nút, khách hàng có thể truy cập vào bất kỳ nút nào và sau đó thông qua lệnh chuyển hướng, tìm ra nút chứa dữ liệu. Vậy, bảng ánh xạ này được cập nhật như thế nào? Redis Cluster sử dụng giao thức lan truyền tin đồn (Gossip) để truyền bá các thay đổi cấu hình cụm.

Ưu điểm của Gossip là phi tập trung; nhược điểm là tốc độ truyền bá chậm và càng lớn quy mô cụm, tốc độ truyền bá càng chậm.

### 4.3. Cấu hình cụm

Trước khi triển khai một cụm Redis, chúng ta sẽ giới thiệu các tham số cấu hình trong tệp redis.conf của cụm.

- **cluster-enabled** `<yes/no>` - Nếu được cấu hình là "yes", chức năng cụm sẽ được bật và Redis instance sẽ là một nút trong cụm, nếu không, nó sẽ là một instance Redis đơn lẻ.
- **cluster-config-file** `<filename>` - Lưu ý: Mặc dù tên cấu hình này được gọi là "tệp cấu hình cụm", nhưng tệp cấu hình này không thể chỉnh sửa thủ công, nó là một tệp cấu hình tự động được duy trì bởi các nút cụm, chủ yếu để ghi lại thông tin về các nút trong cụm, trạng thái của chúng và một số tham số bền vững, để khôi phục trạng thái này khi khởi động lại. Thông thường, tệp này sẽ được cập nhật sau khi nhận được yêu cầu.
- **cluster-node-timeout** `<milliseconds>` - Đây là thời gian tối đa mà một nút trong cụm có thể mất kết nối. Nếu vượt quá thời gian này, nút sẽ được coi là gặp sự cố. Nếu một nút chính vẫn không thể kết nối sau thời gian này, nút con của nó sẽ tiếp tục chuyển đổi thành nút chính. Lưu ý, nếu một nút không thể kết nối với hầu hết các nút chính trong thời gian này, nó sẽ ngừng nhận bất kỳ yêu cầu nào.
- **cluster-slave-validity-factor** `<factor>` - Nếu được đặt thành 0, bất kể mất kết nối giữa nút con và nút chính đã kéo dài bao lâu, nút con sẽ cố gắng trở thành nút chính. Nếu được đặt thành một số dương, thì thời gian mà cluster-node-timeout nhân với cluster-slave-validity-factor sẽ là thời gian hiệu quả của nút con sau khi mất kết nối với nút chính, vượt quá thời gian này, nút con sẽ không chuyển đổi thành nút chính. Giả sử cluster-node-timeout = 5, cluster-slave-validity-factor = 10, nếu nút con mất kết nối với nút chính quá 50 giây, nó sẽ không thể trở thành nút chính. Lưu ý, nếu tham số này được cấu hình thành một số dương, có thể xảy ra tình huống mà một nút chính không thể được thay thế bởi bất kỳ nút con nào, dẫn đến cụm không hoạt động, trong trường hợp này, chỉ khi nút chính ban đầu trở lại cụm, cụm mới hoạt động trở lại.
- **cluster-migration-barrier** `<count>` - Số lượng tối thiểu của nút con cần thiết cho một nút chính, chỉ khi đạt được số lượng này, khi nút chính gặp sự cố, nút con của nó mới được chuyển đổi. Chi tiết hơn về việc sao chép nút con sang một phần, hãy xem phần sau của hướng dẫn này.
- **cluster-require-full-coverage** `<yes/no>` - Khi một số nút không khả dụng trong một phần key, nếu tham số này được cấu hình thành "yes" (giá trị mặc định), cụm sẽ ngừng nhận các hoạt động; nếu tham số này được cấu hình thành "no", cụm vẫn cung cấp hoạt động đọc cho các key trên các nút có thể truy cập.

## 5. Các giải pháp cụm Redis khác

Redis Cluster không phù hợp cho việc xây dựng các cụm Redis quy mô lớn, do đó, nếu bạn muốn xây dựng một cụm Redis quy mô lớn, bạn cần chọn các giải pháp thay thế. Thông thường có ba loại giải pháp:

- Giải pháp phân vùng khách hàng (Client-side sharding)
- Giải pháp phân vùng trung gian (Proxy-based sharding)
- Giải pháp định tuyến truy vấn (Query routing)

### 5.1. Giải pháp phân vùng khách hàng (Client-side sharding)

Trong giải pháp này, **khách hàng** tự quyết định dữ liệu sẽ được **lưu trữ** trên nút Redis nào hoặc dữ liệu sẽ được **đọc** từ nút Redis nào. Ý tưởng chính là sử dụng thuật toán **hashing** để phân tán các khóa Redis, thông qua hàm **hash**, các khóa cụ thể sẽ được **ánh xạ** vào các nút Redis cụ thể.

Giải pháp phân vùng khách hàng phổ biến là Redis Sharding, đây là phương pháp **cụm nhiều phiên bản** Redis được sử dụng rộng rãi trước khi Redis Cluster ra đời. Thư viện điều khiển Redis cho Java [**Jedis**](https://github.com/redis/jedis) hỗ trợ chức năng Redis Sharding, bao gồm ShardedJedis và ShardedJedisPool kết hợp với **bể cache**.

- **Ưu điểm**: Không sử dụng **phần mềm trung gian**, quy tắc phân vùng có thể được kiểm soát, cấu hình đơn giản, không có sự phụ thuộc giữa các nút, dễ dàng mở rộng tuyến tính, linh hoạt.
- **Nhược điểm**: **Khách hàng** không thể **tự động thêm/xóa** nút dịch vụ, khách hàng phải tự quản lý quy tắc **phân phối**, không có **chia sẻ kết nối** giữa các khách hàng, dẫn đến lãng phí kết nối.

### 5.2. Giải pháp phân vùng trung gian (Proxy-based sharding)

Trong giải pháp này, **khách hàng** gửi yêu cầu đến một **thành phần trung gian**, **thành phần trung gian** phân tích dữ liệu của khách hàng và chuyển tiếp yêu cầu đến nút Redis chính xác, sau đó trả kết quả về cho khách hàng.

- **Ưu điểm**: Giảm đơn giản hóa **phân tán logic** của khách hàng, khách hàng kết nối một cách **trong suốt**, chi phí chuyển tiếp và lưu trữ được **tách biệt**.
- **Nhược điểm**: Thêm một **lớp trung gian**, tăng độ phức tạp của kiến trúc và hiệu suất.

Các giải pháp phân vùng trung gian phổ biến bao gồm **[Twemproxy](https://github.com/twitter/twemproxy)** và **[Codis](https://github.com/CodisLabs/codis)**.

#### 5.2.1. Twemproxy

**[Twemproxy](https://github.com/twitter/twemproxy)**, còn được gọi là "nutcraker", là một chương trình trung gian Redis và Memcache mã nguồn mở của Twitter.

**[Twemproxy](https://github.com/twitter/twemproxy)** hoạt động như một trung gian, có thể chấp nhận truy cập từ nhiều chương trình và dựa trên quy tắc định tuyến, chuyển tiếp yêu cầu đến các máy chủ Redis phía sau và trả kết quả trở lại. **[Twemproxy](https://github.com/twitter/twemproxy)** có vấn đề về **điểm đơn** và cần phải kết hợp với Lvs và Keepalived để có giải pháp **cao nhất**.

- **Ưu điểm**: Phạm vi ứng dụng rộng, ổn định, **cao nhất** cho lớp trung gian.
- **Nhược điểm**: Không thể **mở rộng/ thu hẹp** một cách mượt mà, không có giao diện quản lý **trực quan**, không thể tự động chuyển tiếp khi xảy ra sự cố.

#### 5.2.2. Codis

[**Codis**](https://github.com/CodisLabs/codis) là một giải pháp Redis **phân tán**. Đối với ứng dụng trên cùng, kết nối với Codis-Proxy và kết nối trực tiếp với Redis-Server gốc không có sự khác biệt. [**Codis**](https://github.com/CodisLabs/codis) xử lý việc chuyển tiếp yêu cầu và làm việc không ngừng để di chuyển dữ liệu mà không cần tắt máy. [**Codis**](https://github.com/CodisLabs/codis) sử dụng một lớp trung gian **không có trạng thái**, đối với **khách hàng**, mọi thứ đều trong suốt.

- **Ưu điểm**: Cung cấp **khả năng cao** cho Proxy và Redis gốc, **phân vùng dữ liệu** và **cân bằng tự động**, cung cấp giao diện dòng lệnh và RESTful API, cung cấp giao diện **giám sát** và **quản lý**, cho phép **thêm/xóa** nút Redis động.
- **Nhược điểm**: **Triển khai kiến trúc** và **cấu hình** phức tạp, không hỗ trợ **đa trụ sở** và **đa người dùng**, không hỗ trợ **quản lý xác thực**.

### 5.3. Giải pháp định tuyến truy vấn (Query routing)

Trong giải pháp này, **khách hàng** gửi yêu cầu đến một **nút Redis** bất kỳ, sau đó Redis sẽ **chuyển tiếp** yêu cầu đến **nút Redis** chính xác. Redis Cluster thực hiện một hình thức **định tuyến truy vấn kết hợp**, nhưng không phải là chuyển tiếp yêu cầu từ một nút Redis sang một nút Redis khác, mà là thông qua **chuyển hướng** trực tiếp từ **khách hàng** đến nút Redis chứa dữ liệu.

- **Ưu điểm**: **Phi tập trung**, dữ liệu được lưu trữ và phân phối trên nhiều nút Redis, có thể mở rộng/thu hẹp nút một cách mượt mà, hỗ trợ **cao nhất** và **chuyển tiếp tự động** khi xảy ra sự cố, chi phí quản trị thấp.
- **Nhược điểm**: Phụ thuộc nặng vào công cụ Redis-trib, thiếu **giám sát quản lý**, phải dựa vào Smart Client (**duy trì kết nối**, **bộ nhớ đệm bảng định tuyến**, hỗ trợ `MultiOp` và `Pipeline`). Kiểm tra **Failover** của nút mất thời gian, không thể phân biệt dữ liệu **lạnh/hot** dựa trên thống kê.
