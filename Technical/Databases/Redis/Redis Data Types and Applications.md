---
title: Redis Data Types and Applications
tags: [db, redis, nosql]
categories: [db, redis, nosql]
date created: 2023-07-24
date modified: 2023-07-24
---

# Redis Kiểu dữ liệu và Ứng dụng

> Redis cung cấp nhiều loại dữ liệu, mỗi loại dữ liệu có hỗ trợ các lệnh phong phú.
>
> Khi sử dụng Redis, không chỉ cần hiểu các đặc điểm của các loại dữ liệu, mà còn cần linh hoạt và hiệu quả trong việc sử dụng các loại dữ liệu này để xây dựng mô hình dữ liệu phù hợp với kịch bản kinh doanh.

## 1. Các kiểu dữ liệu cơ bản của Redis

|Kiểu dữ liệu|Giá trị có thể lưu trữ|Các hoạt động|
|---|---|---|
|STRING|Chuỗi, số nguyên hoặc số thực|Thực hiện các hoạt động trên toàn bộ chuỗi hoặc một phần của chuỗi  <br>Thực hiện tăng hoặc giảm giá trị số nguyên hoặc số thực|
|LIST|Danh sách|Thêm hoặc lấy ra phần tử từ hai đầu  <br>Đọc một hoặc nhiều phần tử  <br>Thực hiện cắt tỉa, chỉ giữ lại một phạm vi phần tử|
|SET|Tập hợp không thứ tự|Thêm, lấy và xóa một phần tử  <br>Kiểm tra xem một phần tử có tồn tại trong tập hợp hay không  <br>Tính toán giao, hợp, hiệu  <br>Lấy ngẫu nhiên một phần tử từ tập hợp|
|HASH|Bảng băm không thứ tự|Thêm, lấy và xóa một cặp khóa-giá trị  <br>Lấy tất cả các cặp khóa-giá trị  <br>Kiểm tra xem một khóa có tồn tại trong bảng hay không|
|ZSET|Tập hợp có thứ tự|Thêm, lấy và xóa phần tử  <br>Lấy phần tử dựa trên phạm vi hoặc thành viên  <br>Tính hạng của một khóa|

> [What Redis data structures look like](https://redislabs.com/ebook/part-1-getting-started/chapter-1-getting-to-know-redis/1-2-what-redis-data-structures-look-like/)

### STRING

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230724115329.png)

**Ứng dụng: Bộ nhớ cache, bộ đếm, chia sẻ phiên**

Các lệnh:

|Lệnh|Hành vi|
|---|---|
|`GET`|Lấy giá trị được lưu trữ trong khóa đã cho.|
|`SET`|Đặt giá trị vào khóa đã cho.|
|`DEL`|Xóa giá trị được lưu trữ trong khóa đã cho (lệnh này có thể được sử dụng cho tất cả các loại dữ liệu).|
|`INCR`|Tăng giá trị số nguyên được lưu trữ trong khóa `key`.|
|`DECR`|Giảm giá trị số nguyên được lưu trữ trong khóa `key`.|

> Để biết thêm thông tin về các lệnh, vui lòng tham khảo: [Redis String Commands](https://redis.io/commands#string)

Ví dụ:

```shell
127.0.0.1:6379> set hello world
OK
127.0.0.1:6379> get hello
"world"
127.0.0.1:6379> del hello
(integer) 1
127.0.0.1:6379> get hello
(nil)
```

### HASH

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230724122757.png)

**Ứng dụng: Lưu trữ dữ liệu có cấu trúc**, như thông tin người dùng, thông tin sản phẩm, v.v.

Các lệnh:

|Lệnh|Hành động|
|---|---|
|`HSET`|Liên kết một cặp khóa-giá trị trong hash.|
|`HGET`|Lấy giá trị của khóa hash đã cho.|
|`HGETALL`|Lấy tất cả các cặp khóa-giá trị trong hash.|
|`HDEL`|Xóa khóa hash nếu nó tồn tại.|

> Để biết thêm lệnh, vui lòng tham khảo: [Redis Hash Commands](https://redis.io/commands#hash)

Ví dụ:

```shell
127.0.0.1:6379> hset hash-key sub-key1 value1
(integer) 1
127.0.0.1:6379> hset hash-key sub-key2 value2
(integer) 1
127.0.0.1:6379> hset hash-key sub-key1 value1
(integer) 0
127.0.0.1:6379> hset hash-key sub-key3 value2
(integer) 0
127.0.0.1:6379> hgetall hash-key
1) "sub-key1"
2) "value1"
3) "sub-key2"
4) "value2"
127.0.0.1:6379> hdel hash-key sub-key2
(integer) 1
127.0.0.1:6379> hdel hash-key sub-key2
(integer) 0
127.0.0.1:6379> hget hash-key sub-key1
"value1"
127.0.0.1:6379> hgetall hash-key
1) "sub-key1"
2) "value1"
```

### LIST

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230724122821.png)  

**Ứng dụng: Dùng để lưu trữ dữ liệu dạng danh sách**, như danh sách người theo dõi, danh sách sản phẩm, v.v.

Các lệnh:

|Lệnh|Hành động|
|---|---|
|`LPUSH`|Đẩy giá trị đã cho vào đầu danh sách.|
|`RPUSH`|Đẩy giá trị đã cho vào cuối danh sách.|
|`LPOP`|Lấy ra và trả về giá trị từ đầu danh sách.|
|`RPOP`|Lấy ra và trả về giá trị từ cuối danh sách.|
|`LRANGE`|Lấy tất cả các giá trị trong khoảng đã cho.|
|`LINDEX`|Lấy ra một phần tử duy nhất từ danh sách.|
|`LREM`|Xóa một giá trị đã cho từ danh sách.|
|`LTRIM`|Chỉ giữ lại các phần tử trong khoảng đã cho và xóa các phần tử khác.|

> Để biết thêm lệnh, vui lòng tham khảo: [Redis List Commands](https://redis.io/commands#list)

Ví dụ:

```shell
127.0.0.1:6379> rpush list-key item
(integer) 1
127.0.0.1:6379> rpush list-key item2
(integer) 2
127.0.0.1:6379> rpush list-key item
(integer) 3
127.0.0.1:6379> lrange list-key 0 -1
1) "item"
2) "item2"
3) "item"
127.0.0.1:6379> lindex list-key 1
"item2"
127.0.0.1:6379> lpop list-key
"item"
127.0.0.1:6379> lrange list-key 0 -1
1) "item2"
2) "item"
```

### SET

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230724122943.png)

**Ứng dụng: Dùng để lưu trữ dữ liệu dạng danh sách không trùng lặp**.

Các lệnh:

|Lệnh|Hành động|
|---|---|
|`SADD`|Thêm phần tử đã cho vào tập hợp.|
|`SMEMBERS`|Trả về tất cả các phần tử trong tập hợp.|
|`SISMEMBER`|Kiểm tra xem phần tử đã cho có tồn tại trong tập hợp hay không.|
|`SREM`|Nếu phần tử đã cho tồn tại trong tập hợp, thì xóa phần tử đó.|

> Để biết thêm lệnh, vui lòng tham khảo: [Redis Set Commands](https://redis.io/commands#set)

Ví dụ:

```shell
127.0.0.1:6379> sadd set-key item
(integer) 1
127.0.0.1:6379> sadd set-key item2
(integer) 1
127.0.0.1:6379> sadd set-key item3
(integer) 1
127.0.0.1:6379> sadd set-key item
(integer) 0
127.0.0.1:6379> smembers set-key
1) "item"
2) "item2"
3) "item3"
127.0.0.1:6379> sismember set-key item4
(integer) 0
127.0.0.1:6379> sismember set-key item
(integer) 1
127.0.0.1:6379> srem set-key item2
(integer) 1
127.0.0.1:6379> srem set-key item2
(integer) 0
127.0.0.1:6379> smembers set-key
1) "item"
2) "item3"
```

### ZSET (Sorted Set)

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230724123002.png)

**Ứng dụng: Dùng để lưu trữ dữ liệu dạng danh sách có thứ tự và không trùng lặp**.

Các lệnh:

|Lệnh|Hành động|
|---|---|
|`ZADD`|Thêm phần tử đã cho vào danh sách có thứ tự.|
|`ZRANGE`|Trả về các phần tử trong khoảng đã cho.|
|`ZREVRANGE`|Trả về các phần tử trong khoảng đã cho theo thứ tự ngược lại.|
|`ZSCORE`|Trả về điểm số của phần tử đã cho.|
|`ZREM`|Xóa phần tử đã cho khỏi danh sách.|

> Để biết thêm lệnh, vui lòng tham khảo: [Redis Sorted Set Commands](https://redis.io/commands#sorted_set)

Ví dụ:

```shell
127.0.0.1:6379> zadd zset-key 1 item1
(integer) 1
127.0.0.1:6379> zadd zset-key 2 item2
(integer) 1
127.0.0.1:6379> zadd zset-key 3 item3
(integer) 1
127.0.0.1:6379> zadd zset-key 2 item4
(integer) 0
127.0.0.1:6379> zrange zset-key 0 -1
1) "item1"
2) "item4"
3) "item2"
4) "item3"
127.0.0.1:6379> zrevrange zset-key 0 -1
1) "item3"
2) "item2"
3) "item4"
4) "item1"
127.0.0.1:6379> zscore zset-key item2
"2"
127.0.0.1:6379> zrem zset-key item4
(integer) 1
127.0.0.1:6379> zrange zset-key 0 -1
1) "item1"
2) "item2"
3) "item3"
```

### Lệnh chung

#### Sắp xếp

Lệnh `SORT` của Redis được sử dụng để sắp xếp các phần tử trong `LIST`, `SET`, `ZSET`.

| Lệnh   | Mô tả                                                                                                                                                                                                    |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SORT` | `SORT source-key [BY pattern] [LIMIT offset count] [GET pattern [GET pattern …]] [ASC | DESC] [ALPHA] [STORE dest-key]`—Sắp xếp các phần tử trong `LIST`, `SET`, `ZSET` đầu vào theo các tùy chọn đã cho, sau đó trả về hoặc lưu trữ kết quả đã sắp xếp. |

Ví dụ:

```shell
127.0.0.1:6379[15]> RPUSH 'sort-input' 23 15 110 7
(integer) 4
127.0.0.1:6379[15]> SORT 'sort-input'
1) "7"
2) "15"
3) "23"
4) "110"
127.0.0.1:6379[15]> SORT 'sort-input' alpha
1) "110"
2) "15"
3) "23"
4) "7"
127.0.0.1:6379[15]> HSET 'd-7' 'field' 5
(integer) 1
127.0.0.1:6379[15]> HSET 'd-15' 'field' 1
(integer) 1
127.0.0.1:6379[15]> HSET 'd-23' 'field' 9
(integer) 1
127.0.0.1:6379[15]> HSET 'd-110' 'field' 3
(integer) 1
127.0.0.1:6379[15]> SORT 'sort-input' by 'd-*->field'
1) "15"
2) "110"
3) "7"
4) "23"
127.0.0.1:6379[15]> SORT 'sort-input' by 'd-*->field' get 'd-*->field'
1) "1"
2) "3"
3) "5"
4) "9"
```

#### Thời gian hết hạn của khóa

Lệnh `EXPIRE` của Redis được sử dụng để đặt thời gian hết hạn cho một khóa, khi đạt đến thời gian hết hạn, Redis sẽ tự động xóa khóa đó.

| Lệnh        | Mô tả                                                                                                                                    |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `PERSIST`   | `PERSIST key-name`—Xóa thời gian hết hạn của khóa                                                                                       |
| `TTL`       | `TTL key-name`—Xem còn bao nhiêu giây nữa thì khóa sẽ hết hạn                                                                             |
| `EXPIRE`    | `EXPIRE key-name seconds`—Đặt thời gian hết hạn cho khóa trong số giây đã cho                                                             |
| `EXPIREAT`  | `EXPIREAT key-name timestamp`—Đặt thời gian hết hạn cho khóa dựa trên timestamp UNIX đã cho                                                |
| `PTTL`      | `PTTL key-name`—Xem còn bao nhiêu mili giây nữa thì khóa sẽ hết hạn (lệnh này chỉ có sẵn trong Redis phiên bản 2.6 trở lên)               |
| `PEXPIRE`   | `PEXPIRE key-name milliseconds`—Đặt thời gian hết hạn cho khóa trong số mili giây đã cho (lệnh này chỉ có sẵn trong Redis phiên bản 2.6 trở lên) |
| `PEXPIREAT` | `PEXPIREAT key-name timestamp-milliseconds`—Đặt thời gian hết hạn cho khóa dựa trên timestamp UNIX với độ chính xác mili giây (lệnh này chỉ có sẵn trong Redis phiên bản 2.6 trở lên) |

Ví dụ:

```shell
127.0.0.1:6379[15]> SET key value
OK
127.0.0.1:6379[15]> GET key
"value"
127.0.0.1:6379[15]> EXPIRE key 2
(integer) 1
127.0.0.1:6379[15]> GET key
(nil)
```

## 2. Các kiểu dữ liệu nâng cao trong Redis

### BitMap

BitMap là một cấu trúc dữ liệu được sử dụng để thao tác bit trên các chuỗi dữ liệu. BitMap không phải là một cấu trúc dữ liệu thực sự, mà là một tập hợp các hoạt động bit trên chuỗi dữ liệu kiểu STRING. Vì STRING là một chuỗi nhị phân an toàn và có độ dài tối đa là 512MB, nên BitMap có thể lưu trữ tối đa $$2^{32}$$ bit khác nhau.

Ưu điểm lớn nhất của BitMap là tiết kiệm không gian lưu trữ thông tin. Ví dụ, trong một hệ thống, người dùng được đại diện bằng một ID người dùng tăng dần. Với 40 tỷ ($$2^{32}$$ = $$4*1024*1024*1024$$ ≈ 40 tỷ) người dùng, chỉ cần 512MB bộ nhớ để ghi nhớ thông tin như người dùng đã đăng nhập hay chưa.

#### Các lệnh BitMap

- [SETBIT](https://redis.io/commands/setbit) - Đặt hoặc xóa bit tại vị trí đã cho trong giá trị chuỗi được lưu trữ bởi `key`.
- [GETBIT](https://redis.io/commands/getbit) - Lấy giá trị bit tại vị trí đã cho trong giá trị chuỗi được lưu trữ bởi `key`.
- [BITCOUNT](https://redis.io/commands/bitcount) - Đếm số bit có giá trị là 1 trong chuỗi đã cho.
- [BITPOS](https://redis.io/commands/bitpos)
- [BITOP](https://redis.io/commands/bitop)
- [BITFIELD](https://redis.io/commands/bitfield)

#### Ví dụ về BitMap

```shell
# GETBIT trên key không tồn tại hoặc vị trí không tồn tại, trả về 0

redis> EXISTS bit
(integer) 0

redis> GETBIT bit 10086
(integer) 0


# GETBIT trên vị trí đã tồn tại

redis> SETBIT bit 10086 1
(integer) 0

redis> GETBIT bit 10086
(integer) 1

redis> BITCOUNT bit
(integer) 1
```

#### Ứng dụng của BitMap

BitMap rất hiệu quả đối với một số tính toán đặc biệt. Ví dụ: sử dụng BitMap để thống kê số lần người dùng đã đăng nhập.

Giả sử chúng ta muốn ghi nhớ tần suất đăng nhập của người dùng trên trang web của mình, ví dụ: tính toán số ngày người dùng A đã đăng nhập, số ngày người dùng B đã đăng nhập, và cũng như vậy. Chúng ta có thể sử dụng lệnh [SETBIT key offset value](https://redis.io/commands/setbit) và [BITCOUNT key [start\] [end]](https://redis.io/commands/bitcount) để thực hiện điều này.

Ví dụ, mỗi khi người dùng đăng nhập vào một ngày nào đó, chúng ta sử dụng [SETBIT key offset value](https://redis.io/commands/setbit) với key là tên người dùng, offset là ngày đại diện cho ngày đăng nhập trên trang web và đặt bit tại offset đó thành 1.

> Để biết thêm chi tiết về cách triển khai, bạn có thể tham khảo: > [Fast, easy, realtime metrics using Redis bitmaps](http://blog.getspool.com/2011/11/29/fast-easy-realtime-metrics-using-redis-bitmaps/)

### HyperLogLog

HyperLogLog là một cấu trúc dữ liệu xác suất được sử dụng để ước lượng số lượng phần tử duy nhất trong một tập hợp (được gọi là cardinality). Khi đếm số lượng phần tử duy nhất, số lượng phần tử càng nhiều thì cần nhiều bộ nhớ hơn vì cần ghi nhớ các phần tử đã xem trước đó để tránh đếm lại chúng.

#### Các lệnh HyperLogLog

- [PFADD](https://redis.io/commands/pfadd) - Thêm một hoặc nhiều phần tử vào HyperLogLog đã cho.
- [PFCOUNT](https://redis.io/commands/pfcount) - Trả về ước lượng số lượng phần tử duy nhất trong HyperLogLog.
- [PFMERGE](https://redis.io/commands/pfmerge) - Kết hợp (merge) nhiều HyperLogLog thành một HyperLogLog, kết quả HyperLogLog có độ chính xác gần với hợp của tất cả các HyperLogLog đầu vào. HyperLogLog kết quả sẽ được lưu trữ trong `destkey`, nếu `destkey` không tồn tại, Redis sẽ tạo một HyperLogLog trống trước khi thực hiện merge.

Ví dụ:

```shell
redis> PFADD  databases  "Redis"  "MongoDB"  "MySQL"
(integer) 1

redis> PFCOUNT  databases
(integer) 3

redis> PFADD  databases  "Redis"    # Redis đã tồn tại, không cần cập nhật ước lượng
(integer) 0

redis> PFCOUNT  databases    # Ước lượng số lượng phần tử không thay đổi
(integer) 3

redis> PFADD  databases  "PostgreSQL"    # Thêm một phần tử không tồn tại
(integer) 1

redis> PFCOUNT  databases    # Ước lượng số lượng phần tử tăng lên 4
4
```

### GEO

Chức năng này cho phép lưu trữ thông tin vị trí địa lý (kinh độ và vĩ độ) mà người dùng cung cấp và thực hiện các hoạt động trên dữ liệu này.

#### Các lệnh GEO

- [GEOADD](https://redis.io/commands/geoadd) - Thêm một vị trí địa lý (kinh độ, vĩ độ, tên) vào key đã cho.
- [GEOPOS](https://redis.io/commands/geopos) - Trả về tọa độ (kinh độ và vĩ độ) của các thành phần đã cho trong key.
- [GEODIST](https://redis.io/commands/geodist) - Trả về khoảng cách giữa hai thành phần đã cho trong key.
- [GEOHASH](https://redis.io/commands/geohash) - Trả về giá trị Geohash chuẩn của một hoặc nhiều thành phần vị trí, có thể sử dụng tại http://geohash.org/.
- [GEORADIUS](https://redis.io/commands/georadius)
- [GEORADIUSBYMEMBER](https://redis.io/commands/georadiusbymember)

## 3. Ứng dụng các kiểu dữ liệu trong Redis

### Case study - Bài viết phổ biến nhất

Để chọn ra các bài viết phổ biến nhất, cần hỗ trợ việc đánh giá bài viết.

#### Bình chọn cho bài viết

(1) Lưu trữ bài viết bằng HASH

Sử dụng kiểu dữ liệu HASH để lưu trữ thông tin của bài viết. Trong đó: key là ID của bài viết; field là khóa thuộc tính của bài viết; value là giá trị tương ứng của thuộc tính.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200225143038.jpg)

Các thao tác:

- Lưu trữ thông tin bài viết - Sử dụng lệnh HSET hoặc HMSET
- Truy vấn thông tin bài viết - Sử dụng lệnh HGETALL
- Thêm phiếu bình chọn - Sử dụng lệnh HINCRBY

(2) Sử dụng ZSET để sắp xếp tập hợp bài viết theo các tiêu chí khác nhau

Sử dụng kiểu dữ liệu ZSET để lưu trữ tập hợp các ID bài viết được sắp xếp theo thời gian và điểm số.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200225145742.jpg)

Các thao tác:

- Thêm bản ghi - Sử dụng lệnh ZADD
- Thêm điểm - Sử dụng lệnh ZINCRBY
- Lấy ra nhiều bài viết - Sử dụng lệnh ZREVRANGE

(3) Để tránh việc bình chọn trùng lặp, sử dụng kiểu dữ liệu SET để ghi lại tập hợp các bài viết đã được bình chọn.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200225150105.jpg)

Các thao tác:

- Thêm người bình chọn - Sử dụng lệnh SADD
- Đặt thời gian hiệu lực - Sử dụng lệnh EXPIRE

(4) Giả sử user:115423 bình chọn cho article:100408, cần cập nhật cả tập hợp sắp xếp theo điểm số và tập hợp bình chọn.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200225150138.jpg)

Khi cần bình chọn cho một bài viết, chương trình cần sử dụng lệnh ZSCORE để kiểm tra tập hợp sắp xếp theo thời gian đăng bài viết và xác định xem thời gian đăng bài viết có vượt quá thời gian hiệu lực của bình chọn (ví dụ: một tuần) hay không.

```java
    public void articleVote(Jedis conn, String user, String article) {
        // Tính toán thời gian kết thúc bình chọn của bài viết.
        long cutoff = (System.currentTimeMillis() / 1000) - ONE_WEEK_IN_SECONDS;

        // Kiểm tra xem có thể bình chọn cho bài viết hay không
        // (Mặc dù có thể lấy thời gian đăng bài viết từ HASH,
        // nhưng tập hợp sắp xếp trả về thời gian đăng bài viết dưới dạng số thực,
        // nên có thể sử dụng trực tiếp mà không cần chuyển đổi).
        if (conn.zscore("time:", article) < cutoff) {
            return;
        }

        // Lấy ID của bài viết từ định danh article:id.
        String articleId = article.substring(article.indexOf(':') + 1);

        // Nếu người dùng chưa bình chọn cho bài viết này, tăng số lượng bình chọn và điểm số của bài viết.
        if (conn.sadd("voted:" + articleId, user) == 1) {
            conn.zincrby("score:", VOTE_SCORE, article);
            conn.hincrBy(article, "votes", 1);
        }
    }
```

#### Đăng và lấy bài viết

Đăng bài viết:

- Thêm bài viết - Sử dụng lệnh `INCR` để tính toán ID mới cho bài viết, điền thông tin bài viết và sử dụng lệnh `HSET` hoặc `HMSET` để ghi vào cấu trúc `HASH`.
- Thêm ID tác giả vào danh sách bình chọn - Sử dụng lệnh `SADD` để thêm vào cấu trúc `SET` đại diện cho danh sách bình chọn.
- Đặt thời gian hiệu lực của bình chọn - Sử dụng lệnh `EXPIRE` để đặt thời gian hiệu lực của bình chọn.

```java
    public String postArticle(Jedis conn, String user, String title, String link) {
        // Tạo một ID mới cho bài viết.
        String articleId = String.valueOf(conn.incr("article:"));

        String voted = "voted:" + articleId;
        // Thêm người dùng đăng bài vào danh sách đã bình chọn của bài viết,
        conn.sadd(voted, user);
        // Đặt thời gian tồn tại của danh sách này là một tuần (Chương 3 sẽ giải thích chi tiết hơn về thời gian tồn tại).
        conn.expire(voted, ONE_WEEK_IN_SECONDS);

        long now = System.currentTimeMillis() / 1000;
        String article = "article:" + articleId;
        // Lưu thông tin bài viết vào một hash.
        HashMap<String, String> articleData = new HashMap<String, String>();
        articleData.put("title", title);
        articleData.put("link", link);
        articleData.put("user", user);
        articleData.put("now", String.valueOf(now));
        articleData.put("votes", "1");
        conn.hmset(article, articleData);

        // Thêm bài viết vào tập hợp sắp xếp theo thời gian đăng và tập hợp sắp xếp theo điểm số.
        conn.zadd("score:", now + VOTE_SCORE, article);
        conn.zadd("time:", now, article);

        return articleId;
    }
```

Truy vấn phân trang cho các bài viết phổ biến:

Sử dụng lệnh `ZINTERSTORE` để truy vấn danh sách ID bài viết theo trang, số bài viết trên mỗi trang và số thứ tự sắp xếp theo điểm số từ cao xuống thấp.

```java
    public List<Map<String, String>> getArticles(Jedis conn, int page, String order) {
        // Đặt chỉ mục bắt đầu và kết thúc để lấy bài viết.
        int start = (page - 1) * ARTICLES_PER_PAGE;
        int end = start + ARTICLES_PER_PAGE - 1;

        // Lấy danh sách ID bài viết.
        Set<String> ids = conn.zrevrange(order, start, end);
        List<Map<String, String>> articles = new ArrayList<>();
        // Lấy thông tin chi tiết của bài viết dựa trên ID bài viết.
        for (String id : ids) {
            Map<String, String> articleData = conn.hgetAll(id);
            articleData.put("id", id);
            articles.add(articleData);
        }

        return articles;
    }
```

#### Phân nhóm bài viết

Nếu bài viết cần được phân nhóm, chức năng sẽ được chia thành hai phần:

- Ghi nhận bài viết thuộc nhóm nào
- Trích xuất các bài viết trong nhóm

Thêm và xóa nhóm cho bài viết:

```java
    public void addRemoveGroups(Jedis conn, String articleId, String[] toAdd, String[] toRemove) {
        // Xây dựng tên khóa để lưu thông tin bài viết.
        String article = "article:" + articleId;
        // Thêm bài viết vào các nhóm mà nó thuộc về.
        for (String group : toAdd) {
            conn.sadd("group:" + group, article);
        }
        // Xóa bài viết khỏi các nhóm.
        for (String group : toRemove) {
            conn.srem("group:" + group, article);
        }
    }
```

Trích xuất các bài viết trong nhóm:

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200225214210.jpg)

- Bằng cách thực hiện lệnh `ZINTERSTORE` trên tập hợp các bài viết trong nhóm và tập hợp sắp xếp theo điểm số của bài viết, chúng ta có thể nhận được các bài viết trong nhóm được sắp xếp theo điểm số.
- Bằng cách thực hiện lệnh `ZINTERSTORE` trên tập hợp các bài viết trong nhóm và tập hợp sắp xếp theo thời gian đăng bài viết, chúng ta có thể nhận được các bài viết trong nhóm được sắp xếp theo thời gian đăng.

```java
    public List<Map<String, String>> getGroupArticles(Jedis conn, String group, int page, String order) {
        // Tạo một khóa cho mỗi thứ tự sắp xếp của mỗi nhóm.
        String key = order + group;
        // Kiểm tra xem có kết quả sắp xếp đã được lưu trữ trong bộ nhớ cache chưa, nếu chưa thì tiến hành sắp xếp.
        if (!conn.exists(key)) {
            // Sắp xếp các bài viết trong nhóm theo điểm số hoặc thời gian đăng bài viết.
            ZParams params = new ZParams().aggregate(ZParams.Aggregate.MAX);
            conn.zinterstore(key, params, "group:" + group, order);
            // Đặt thời gian tồn tại của tập hợp sắp xếp này là 60 giây.
            conn.expire(key, 60);
        }
        // Gọi hàm getArticles đã được định nghĩa trước đó để phân trang và lấy dữ liệu bài viết.
        return getArticles(conn, page, key);
    }
```

### Case study - Quản lý token

Trang web thường lưu trữ thông tin xác thực người dùng dưới dạng Cookie, Session, Token và các thông tin tương tự.

Có thể lưu trữ mappinng giữa Cookie/Session/Token và người dùng trong cấu trúc HASH.

Dưới đây là ví dụ với Token.

#### Kiểm tra Token

```java
    public String checkToken(Jedis conn, String token) {
        // Thử lấy và trả về người dùng tương ứng với token.
        return conn.hget("login:", token);
    }
```

#### Cập nhật Token

- Mỗi lần người dùng truy cập trang, có thể ghi lại mapping giữa token và timestamp hiện tại, lưu vào một cấu trúc ZSET để phân tích xem người dùng có hoạt động hay không, sau đó có thể định kỳ xóa các token cũ nhất, thống kê số người dùng đang trực tuyến, v.v.
- Nếu người dùng đang xem sản phẩm, có thể ghi lại các sản phẩm đã xem gần đây vào một cấu trúc ZSET (có thể giới hạn số lượng, vượt quá số lượng sẽ bị cắt bỏ), lưu vào một cấu trúc ZSET để phân tích xem người dùng có thể quan tâm đến sản phẩm nào gần đây, từ đó có thể gợi ý sản phẩm.

```java
    public void updateToken(Jedis conn, String token, String user, String item) {
        // Lấy timestamp hiện tại.
        long timestamp = System.currentTimeMillis() / 1000;
        // Lưu mapping giữa token và người dùng đã đăng nhập.
        conn.hset("login:", token, user);
        // Ghi lại thời gian xuất hiện cuối cùng của token.
        conn.zadd("recent:", timestamp, token);
        if (item != null) {
            // Ghi lại các sản phẩm người dùng đã xem.
            conn.zadd("viewed:" + token, timestamp, item);
            // Xóa các bản ghi cũ, chỉ giữ lại 25 sản phẩm người dùng đã xem gần đây nhất.
            conn.zremrangeByRank("viewed:" + token, 0, -26);
            conn.zincrby("viewed:", -1, item);
        }
    }
```

#### Xóa Token

Như đã đề cập ở phần trước, khi cập nhật token, mapping giữa token và timestamp hiện tại được lưu vào cấu trúc ZSET. Do đó, có thể biết được những token nào là cũ nhất. Nếu không xóa, việc cập nhật token sẽ tiếp tục chiếm dụng bộ nhớ cho đến khi gây ra sự cố.

Ví dụ: Cho phép lưu trữ tối đa 10 triệu thông tin token, kiểm tra định kỳ, nếu số lượng token vượt quá 10 triệu, sắp xếp ZSET từ mới đến cũ và xóa các thông tin vượt quá 10 triệu.

```java
public static class CleanSessionsThread extends Thread {

    private Jedis conn;

    private int limit;

    private volatile boolean quit;

    public CleanSessionsThread(int limit) {
        this.conn = new Jedis("localhost");
        this.conn.select(15);
        this.limit = limit;
    }

    public void quit() {
        quit = true;
    }

    @Override
    public void run() {
        while (!quit) {
            // Lấy số lượng token hiện có.
            long size = conn.zcard("recent:");
            // Nếu số lượng token không vượt quá giới hạn, ngủ và kiểm tra lại sau.
            if (size <= limit) {
                try {
                    sleep(1000);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
                continue;
            }

            // Lấy các token cần xóa.
            long endIndex = Math.min(size - limit, 100);
            Set<String> tokenSet = conn.zrange("recent:", 0, endIndex - 1);
            String[] tokens = tokenSet.toArray(new String[tokenSet.size()]);

            // Xây dựng các key cho các token sẽ bị xóa.
            ArrayList<String> sessionKeys = new ArrayList<String>();
            for (String token : tokens) {
                sessionKeys.add("viewed:" + token);
            }

            // Xóa các token cũ nhất.
            conn.del(sessionKeys.toArray(new String[sessionKeys.size()]));
            conn.hdel("login:", tokens);
            conn.zrem("recent:", tokens);
        }
    }

}
```

### Case study - Giỏ hàng

Có thể sử dụng cấu trúc HASH để triển khai chức năng giỏ hàng.

Mỗi giỏ hàng của người dùng lưu trữ ánh xạ giữa ID sản phẩm và số lượng sản phẩm.

#### Thêm và xóa sản phẩm trong giỏ hàng

```java
    public void addToCart(Jedis conn, String session, String item, int count) {
        if (count <= 0) {
            // Xóa sản phẩm cụ thể khỏi giỏ hàng.
            conn.hdel("cart:" + session, item);
        } else {
            // Thêm sản phẩm cụ thể vào giỏ hàng.
            conn.hset("cart:" + session, item, String.valueOf(count));
        }
    }
```

#### Xóa toàn bộ giỏ hàng

Dựa trên [Xóa Token](#xóa-token), khi xóa phiên làm việc, cũng xóa luôn giỏ hàng.

```java
   while (!quit) {
        long size = conn.zcard("recent:");
        if (size <= limit) {
            try {
                sleep(1000);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
            }
            continue;
        }

        long endIndex = Math.min(size - limit, 100);
        Set<String> sessionSet = conn.zrange("recent:", 0, endIndex - 1);
        String[] sessions = sessionSet.toArray(new String[sessionSet.size()]);

        ArrayList<String> sessionKeys = new ArrayList<String>();
        for (String sess : sessions) {
            sessionKeys.add("viewed:" + sess);
            // Dòng code mới được thêm vào để xóa giỏ hàng của người dùng tương ứng với phiên làm việc cũ.
            sessionKeys.add("cart:" + sess);
        }

        conn.del(sessionKeys.toArray(new String[sessionKeys.size()]));
        conn.hdel("login:", sessions);
        conn.zrem("recent:", sessions);
    }
```

### Case study - Bộ nhớ cache trang web

Hầu hết nội dung trang web không thay đổi thường xuyên, nhưng khi truy cập, phía máy chủ cần tính toán động, điều này có thể tốn thời gian. Trong trường hợp này, có thể sử dụng cấu trúc `STRING` để lưu trữ bộ nhớ cache trang web.

```java
    public String cacheRequest(Jedis conn, String request, Callback callback) {
        // Đối với các yêu cầu không thể được lưu vào bộ nhớ cache, gọi hàm callback trực tiếp.
        if (!canCache(conn, request)) {
            return callback != null ? callback.call(request) : null;
        }

        // Chuyển đổi yêu cầu thành một khóa chuỗi đơn giản để dễ dàng tìm kiếm sau này.
        String pageKey = "cache:" + hashRequest(request);
        // Thử tìm trang web đã được lưu trong bộ nhớ cache.
        String content = conn.get(pageKey);

        if (content == null && callback != null) {
            // Nếu trang web chưa được lưu trong bộ nhớ cache, tạo trang web.
            content = callback.call(request);
            // Lưu trang web mới tạo vào bộ nhớ cache.
            conn.setex(pageKey, 300, content);
        }

        // Trả về nội dung trang web.
        return content;
    }
```

### Case study - Bộ nhớ cache dòng dữ liệu

Các trang web thương mại điện tử có thể có các hoạt động khuyến mãi, giảm giá, rút thăm may mắn, v.v. Những trang web này chỉ cần tải vài dòng dữ liệu từ cơ sở dữ liệu, chẳng hạn như thông tin người dùng, thông tin sản phẩm.

Có thể sử dụng cấu trúc STRING để lưu trữ bộ nhớ cache cho các dòng dữ liệu này, sử dụng JSON để lưu trữ thông tin có cấu trúc.

Ngoài ra, cần có hai cấu trúc ZSET để ghi lại thời điểm cập nhật bộ nhớ cache:

- Cấu trúc ZSET thứ nhất là tập hợp lịch trình;
- Cấu trúc ZSET thứ hai là tập hợp trễ.

Ghi lại thời điểm cập nhật bộ nhớ cache:

```java
    public void scheduleRowCache(Jedis conn, String rowId, int delay) {
        // Đặt giá trị trễ cho dòng dữ liệu.
        conn.zadd("delay:", delay, rowId);
        // Lập lịch cập nhật bộ nhớ cache cho dòng dữ liệu.
        conn.zadd("schedule:", System.currentTimeMillis() / 1000, rowId);
    }
```

Cập nhật bộ nhớ cache dòng dữ liệu theo định kỳ:

```java
public class CacheRowsThread extends Thread {

    private Jedis conn;

    private boolean quit;

    public CacheRowsThread() {
        this.conn = new Jedis("localhost");
        this.conn.select(15);
    }

    public void quit() {
        quit = true;
    }

    @Override
    public void run() {
        Gson gson = new Gson();
        while (!quit) {
            // Thử lấy dòng dữ liệu tiếp theo cần được cập nhật và thời điểm lên lịch của nó,
            // Lệnh sẽ trả về một danh sách chứa một hoặc không có cặp (tuple).
            Set<Tuple> range = conn.zrangeWithScores("schedule:", 0, 0);
            Tuple next = range.size() > 0 ? range.iterator().next() : null;
            long now = System.currentTimeMillis() / 1000;
            if (next == null || next.getScore() > now) {
                try {
                    // Tạm thời không có dòng dữ liệu cần được cập nhật, ngủ 50ms và thử lại.
                    sleep(50);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
                continue;
            }

            String rowId = next.getElement();
            // Lấy thời gian trễ trước lần cập nhật tiếp theo.
            double delay = conn.zscore("delay:", rowId);
            if (delay <= 0) {
                // Không cần cập nhật dòng dữ liệu này nữa, xóa nó khỏi bộ nhớ cache.
                conn.zrem("delay:", rowId);
                conn.zrem("schedule:", rowId);
                conn.del("inv:" + rowId);
                continue;
            }

            // Đọc dòng dữ liệu.
            Inventory row = Inventory.get(rowId);
            // Cập nhật thời gian lên lịch và đặt giá trị bộ nhớ cache.
            conn.zadd("schedule:", now + delay, rowId);
            conn.set("inv:" + rowId, gson.toJson(row));
        }
    }

}
```

### Case study - Phân tích trang web

Trang web có thể thu thập hành vi truy cập, tương tác và mua hàng của người dùng, sau đó phân tích thói quen và sở thích của người dùng để đánh giá tình hình thị trường và cơ hội kinh doanh tiềm năng.

Vậy làm thế nào để ghi lại các trang sản phẩm mà người dùng đã truy cập trong một khoảng thời gian nhất định?

Tham khảo ví dụ mã code [Cập nhật Token](#cập-nhật-token), ghi lại số lần truy cập của người dùng vào các trang sản phẩm khác nhau và sắp xếp chúng.

Để xác định xem trang có cần được lưu vào bộ nhớ cache hay không, dựa trên điểm đánh giá để xác định xem trang sản phẩm có phổ biến hay không:

```java
    public boolean canCache(Jedis conn, String request) {
        try {
            URL url = new URL(request);
            HashMap<String, String> params = new HashMap<>();
            if (url.getQuery() != null) {
                for (String param : url.getQuery().split("&")) {
                    String[] pair = param.split("=", 2);
                    params.put(pair[0], pair.length == 2 ? pair[1] : null);
                }
            }

            // Thử lấy ID sản phẩm từ trang.
            String itemId = extractItemId(params);
            // Kiểm tra xem trang này có thể được lưu vào bộ nhớ cache và có phải là trang sản phẩm hay không.
            if (itemId == null || isDynamic(params)) {
                return false;
            }
            // Lấy xếp hạng số lần xem của sản phẩm.
            Long rank = conn.zrank("viewed:", itemId);
            // Dựa trên xếp hạng số lần xem của sản phẩm để xác định xem trang này có cần được lưu vào bộ nhớ cache hay không.
            return rank != null && rank < 10000;
        } catch (MalformedURLException mue) {
            return false;
        }
    }
```

### Case study - Ghi log

Có thể sử dụng cấu trúc LIST để lưu trữ dữ liệu nhật ký (log).

```java
    public void logRecent(Jedis conn, String name, String message, String severity) {
        String destination = "recent:" + name + ':' + severity;
        Pipeline pipe = conn.pipelined();
        pipe.lpush(destination, TIMESTAMP.format(new Date()) + ' ' + message);
        pipe.ltrim(destination, 0, 99);
        pipe.sync();
    }
```

### Case study - Thống kê dữ liệu

Cập nhật bộ đếm:

```java
    public static final int[] PRECISION = new int[] { 1, 5, 60, 300, 3600, 18000, 86400 };

    public void updateCounter(Jedis conn, String name, int count, long now) {
        Transaction trans = conn.multi();
        for (int prec : PRECISION) {
            long pnow = (now / prec) * prec;
            String hash = String.valueOf(prec) + ':' + name;
            trans.zadd("known:", 0, hash);
            trans.hincrBy("count:" + hash, String.valueOf(pnow), count);
        }
        trans.exec();
    }
```

Xem dữ liệu bộ đếm:

```java
    public List<Pair<Integer>> getCounter(
        Jedis conn, String name, int precision) {
        String hash = String.valueOf(precision) + ':' + name;
        Map<String, String> data = conn.hgetAll("count:" + hash);
        List<Pair<Integer>> results = new ArrayList<>();
        for (Map.Entry<String, String> entry : data.entrySet()) {
            results.add(new Pair<>(
                entry.getKey(),
                Integer.parseInt(entry.getValue())));
        }
        Collections.sort(results);
        return results;
    }
```

### Case study - Tìm địa chỉ IP thuộc về đâu

Tìm địa chỉ IP thuộc về đâu bằng cách sử dụng Redis nhanh hơn so với cách thực hiện trên cơ sở dữ liệu quan hệ.

#### Tải dữ liệu IP

Chuyển đổi địa chỉ IP thành giá trị số nguyên:

```java
    public int ipToScore(String ipAddress) {
        int score = 0;
        for (String v : ipAddress.split("\\.")) {
            score = score * 256 + Integer.parseInt(v, 10);
        }
        return score;
    }
```

Tạo ánh xạ giữa địa chỉ IP và ID thành phố:

```java
    public void importIpsToRedis(Jedis conn, File file) {
        FileReader reader = null;
        try {
            // Tải dữ liệu từ tệp csv
            reader = new FileReader(file);
            CSVFormat csvFormat = CSVFormat.DEFAULT.withRecordSeparator("\n");
            CSVParser csvParser = csvFormat.parse(reader);
            int count = 0;
            List<CSVRecord> records = csvParser.getRecords();
            for (CSVRecord line : records) {
                String startIp = line.get(0);
                if (startIp.toLowerCase().indexOf('i') != -1) {
                    continue;
                }
                // Chuyển đổi địa chỉ IP thành giá trị số nguyên
                int score = 0;
                if (startIp.indexOf('.') != -1) {
                    score = ipToScore(startIp);
                } else {
                    try {
                        score = Integer.parseInt(startIp, 10);
                    } catch (NumberFormatException nfe) {
                        // Bỏ qua dòng đầu tiên của tệp và các mục không đúng định dạng
                        continue;
                    }
                }

                // Xây dựng ID thành phố duy nhất
                String cityId = line.get(2) + '_' + count;
                // Thêm ID thành phố và giá trị số nguyên tương ứng của địa chỉ IP vào ZSET
                conn.zadd("ip2cityid:", score, cityId);
                count++;
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            try {
                reader.close();
            } catch (Exception e) {
                // bỏ qua
            }
        }
    }
```

Lưu trữ thông tin thành phố:

```java
    public void importCitiesToRedis(Jedis conn, File file) {
        Gson gson = new Gson();
        FileReader reader = null;
        try {
            // Tải thông tin từ tệp csv
            reader = new FileReader(file);
            CSVFormat csvFormat = CSVFormat.DEFAULT.withRecordSeparator("\n");
            CSVParser parser = new CSVParser(reader, csvFormat);
            // String[] line;
            List<CSVRecord> records = parser.getRecords();
            for (CSVRecord record : records) {

                if (record.size() < 4 || !Character.isDigit(record.get(0).charAt(0))) {
                    continue;
                }

                // Chuyển đổi thông tin địa lý thành cấu trúc json và lưu vào HASH
                String cityId = record.get(0);
                String country = record.get(1);
                String region = record.get(2);
                String city = record.get(3);
                String json = gson.toJson(new String[] { city, region, country });
                conn.hset("cityid2city:", cityId, json);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            try {
                reader.close();
            } catch (Exception e) {
                // bỏ qua
            }
        }
    }
```

#### Tìm địa chỉ IP thuộc về thành phố nào

Các bước thực hiện:

1. Chuyển đổi địa chỉ IP cần tìm thành giá trị số nguyên;
2. Tìm tất cả các địa chỉ có điểm số nhỏ hơn hoặc bằng địa chỉ IP cần tìm, lấy ra bản ghi có điểm số lớn nhất;
3. Sử dụng ID thành phố tìm thấy để truy vấn thông tin thành phố.

```java
    public String[] findCityByIp(Jedis conn, String ipAddress) {
        int score = ipToScore(ipAddress);
        Set<String> results = conn.zrevrangeByScore("ip2cityid:", score, 0, 0, 1);
        if (results.size() == 0) {
            return null;
        }

        String cityId = results.iterator().next();
        cityId = cityId.substring(0, cityId.indexOf('_'));
        return new Gson().fromJson(conn.hget("cityid2city:", cityId), String[].class);
    }
```

### Case study - Phát hiện và cấu hình dịch vụ

### Case study - Tự động hoàn chỉnh

Yêu cầu: Tự động hoàn chỉnh thông tin dựa trên đầu vào của người dùng, ví dụ: tên liên lạc, tên sản phẩm, v.v.

- Tình huống điển hình 1: Hệ thống mạng xã hội ghi lại 100 người bạn gần đây nhất mà người dùng đã liên lạc, khi người dùng tìm kiếm bạn bè, tự động hoàn chỉnh tên dựa trên từ khóa nhập vào.
- Tình huống điển hình 2: Hệ thống thương mại điện tử ghi lại 10 sản phẩm mà người dùng đã xem gần đây, khi người dùng tìm kiếm sản phẩm, tự động hoàn chỉnh tên sản phẩm dựa trên từ khóa nhập vào.

Mô hình dữ liệu: Sử dụng kiểu dữ liệu LIST của Redis để lưu trữ danh sách liên lạc gần đây.

Xây dựng danh sách hoàn chỉnh tự động thường bao gồm các hoạt động sau:

- Nếu người liên hệ đã được chỉ định tồn tại trong danh sách liên lạc gần đây, hãy loại bỏ nó khỏi danh sách. Tương ứng với lệnh `LREM`.
- Thêm người liên hệ đã chỉ định vào đầu danh sách liên lạc gần đây. Tương ứng với lệnh `LPUSH`.
- Sau khi hoạt động thêm đã hoàn thành, nếu số lượng người liên hệ trong danh sách vượt quá 100, thực hiện cắt tỉa. Tương ứng với lệnh `LTRIM`.

### Case study - Định hướng quảng cáo

### Case study - Tìm kiếm vị trí công việc

Yêu cầu: Trên một trang web tuyển dụng, người tìm việc có một danh sách kỹ năng của riêng mình; các công ty tuyển dụng có một danh sách kỹ năng cần thiết cho vị trí công việc. Các công ty tuyển dụng cần tìm kiếm người tìm việc phù hợp với yêu cầu công việc của mình; người tìm việc cần tìm kiếm các vị trí công việc mà mình có thể nộp đơn.

Mô hình dữ liệu quan trọng: Sử dụng kiểu dữ liệu `SET` để lưu trữ danh sách kỹ năng của người tìm việc và danh sách kỹ năng của vị trí công việc.

Hoạt động quan trọng: Sử dụng lệnh `SDIFF` để so sánh sự khác biệt giữa hai `SET`, trả về `empty` nếu đáp ứng yêu cầu.

Ví dụ sử dụng Redis CLI:

```shell
# -----------------------------------------------------------
# Mô hình dữ liệu tìm kiếm vị trí công việc trong Redis
# -----------------------------------------------------------

# (1) Bảng kỹ năng vị trí công việc: Lưu trữ bằng kiểu dữ liệu SET
# Công việc job:001 yêu cầu 4 kỹ năng
SADD job:001 skill:001
SADD job:001 skill:002
SADD job:001 skill:003
SADD job:001 skill:004

# Công việc job:002 yêu cầu 3 kỹ năng
SADD job:002 skill:001
SADD job:002 skill:002
SADD job:002 skill:003

# Công việc job:003 yêu cầu 2 kỹ năng
SADD job:003 skill:001
SADD job:003 skill:003

# Xem danh sách kỹ năng
SMEMBERS job:001
SMEMBERS job:002
SMEMBERS job:003

# (2) Bảng kỹ năng của người tìm việc: Lưu trữ bằng kiểu dữ liệu SET
SADD interviewee:001 skill:001
SADD interviewee:001 skill:003

SADD interviewee:002 skill:001
SADD interviewee:002 skill:002
SADD interviewee:002 skill:003
SADD interviewee:002 skill:004
SADD interviewee:002 skill:005

# Xem danh sách kỹ năng
SMEMBERS interviewee:001
SMEMBERS interviewee:002

# (3) Người tìm việc tìm kiếm các vị trí công việc phù hợp với yêu cầu của mình (trả về empty nếu tất cả các kỹ năng yêu cầu đều được đáp ứng)
# So sánh sự khác biệt giữa danh sách kỹ năng của vị trí công việc và danh sách kỹ năng của người tìm việc
SDIFF job:001 interviewee:001
SDIFF job:002 interviewee:001
SDIFF job:003 interviewee:001

SDIFF job:001 interviewee:002
SDIFF job:002 interviewee:002
SDIFF job:003 interviewee:002

# (4) Công ty tuyển dụng tìm kiếm người tìm việc phù hợp với yêu cầu công việc của mình (trả về empty nếu tất cả các kỹ năng yêu cầu đều được đáp ứng)
# So sánh sự khác biệt giữa danh sách kỹ năng của người tìm việc và danh sách kỹ năng của vị trí công việc
SDIFF interviewee:001 job:001
SDIFF interviewee:002 job:001

SDIFF interviewee:001 job:002
SDIFF interviewee:002 job:002

SDIFF interviewee:001 job:003
SDIFF interviewee:002 job:003
```
