---
title: Elasticsearch performance optimization
tags:
  - elasticssearch
  - database
categories: 
date created: 2024-02-24
date modified: 2024-02-24
---

# Tối ưu hóa hiệu suất Elasticsearch

Elasticsearch là công cụ tìm kiếm cấp doanh nghiệp phổ biến hiện nay, được thiết kế để hoạt động trong môi trường đám mây, có khả năng tìm kiếm thời gian thực, ổn định, đáng tin cậy, nhanh chóng và dễ dàng cài đặt. Dù là một sản phẩm sẵn sàng sử dụng ngay sau khi mở hộp, sau khi đưa vào môi trường sản xuất, chúng ta không thể đảm bảo được hiệu suất và ổn định của nó. Việc tăng cường hiệu suất dịch vụ dựa trên tình hình thực tế có rất nhiều kỹ thuật. Trong chương này, chúng tôi sẽ chia sẻ những kinh nghiệm tối ưu hóa hiệu suất Elasticsearch từ thực tiễn, chủ yếu từ các khía cạnh như tối ưu hóa cấu hình phần cứng, cài đặt tối ưu hóa chỉ mục, tối ưu hóa truy vấn, tối ưu hóa cấu trúc dữ liệu, tối ưu hóa kiến trúc cụm.

## Tối ưu hóa cấu hình phần cứng

Nâng cấp cấu hình phần cứng luôn là phương pháp tăng cường khả năng phục vụ nhanh chóng và hiệu quả nhất, ba yếu tố có thể ảnh hưởng đến hiệu suất ứng dụng ở cấp độ hệ thống bao gồm: CPU, bộ nhớ và IO, có thể tối ưu hóa hiệu suất ES từ ba khía cạnh này.

### Cấu hình CPU

Nói chung, có một số lý do khiến CPU bận rộn:

1. Có vòng lặp vô hạn, không chặn, khớp mẫu thông thường hoặc chỉ tính toán trong luồng;
2. Xảy ra GC thường xuyên;
3. Chuyển đổi ngữ cảnh của nhiều luồng;

Hầu hết các triển khai Elasticsearch thường không đặt yêu cầu cao đối với CPU. Do đó, so với các tài nguyên khác, việc cấu hình bao nhiêu (CPU) không quan trọng lắm. Bạn nên chọn bộ xử lý hiện đại có nhiều nhân, máy chủ trong cụm thường sử dụng từ 2 đến 8 nhân. **Nếu bạn phải chọn giữa CPUs nhanh hơn và số lượng nhân nhiều hơn, việc chọn số lượng nhân nhiều hơn sẽ tốt hơn**. Số lượng nhân bổ sung cung cấp đồng thời nhiều hơn rất nhiều so với tốc độ xung nhịp nhanh hơn một chút.

### Cấu hình bộ nhớ

Nếu có một loại tài nguyên nào đó sẽ được tiêu thụ trước tiên, đó có thể là bộ nhớ. Sắp xếp và tổng hợp đều tiêu thụ nhiều bộ nhớ, vì vậy việc có đủ không gian heap để xử lý chúng là rất quan trọng. Ngay cả khi không gian heap khá nhỏ, nó cũng có thể cung cấp thêm bộ nhớ cho bộ đệm tệp hệ điều hành. Bởi vì nhiều cấu trúc dữ liệu mà Lucene sử dụng dựa trên định dạng dựa trên đĩa, Elasticsearch tận dụng bộ đệm hệ điều hành có thể tạo ra hiệu quả lớn.

**Máy có bộ nhớ 64 GB là rất lý tưởng**, nhưng máy 32 GB và 16 GB cũng rất phổ biến. Dưới 8 GB sẽ phản tác dụng (bạn cuối cùng sẽ cần rất nhiều máy nhỏ), máy có bộ nhớ lớn hơn 64 GB cũng sẽ gặp vấn đề.

Do ES được xây dựng dựa trên lucene, và sức mạnh của thiết kế lucene nằm ở chỗ lucene có thể tận dụng tốt bộ nhớ hệ điều hành để lưu trữ dữ liệu chỉ mục, để cung cấp hiệu suất truy vấn nhanh. Các tệp phân đoạn chỉ mục của lucene được lưu trữ trong một tệp duy nhất và không thay đổi, đối với hệ điều hành, có thể giữ tệp chỉ mục trong bộ đệm một cách thân thiện, để truy cập nhanh; do đó, chúng ta cần để một nửa bộ nhớ vật lý cho lucene; nửa còn lại của bộ nhớ vật lý để cho ES (JVM heap).

#### Phân bổ bộ nhớ

Khi bộ nhớ máy nhỏ hơn 64G, tuân theo nguyên tắc chung, 50% cho ES, 50% cho lucene.

Khi bộ nhớ máy lớn hơn 64G, tuân theo nguyên tắc sau:

- Nếu cảnh sử dụng chính là tìm kiếm toàn văn bản, thì nên cấp 4~32G bộ nhớ cho ES Heap; bộ nhớ khác để cho hệ điều hành, cho lucene sử dụng (segments cache), để cung cấp hiệu suất truy vấn nhanh hơn.
- Nếu cảnh sử dụng chính là tổng hợp hoặc sắp xếp, và hầu hết là numerics, dates, geo_points và các loại ký tự not_analyzed, nên cấp 4~32G bộ nhớ cho ES Heap; bộ nhớ khác để cho hệ điều hành, cho lucene sử dụng, cung cấp hiệu suất tổng hợp, sắp xếp nhanh hơn dựa trên tài liệu.
- Nếu cảnh sử dụng là tổng hợp hoặc sắp xếp, và tất cả đều dựa trên dữ liệu ký tự analyzed, thì cần nhiều heap size hơn, nên chạy nhiều thực thể ES trên máy, mỗi thực thể giữ không vượt quá 50% cài đặt heap ES (nhưng không vượt quá 32 G, khi heap memory được cài đặt dưới 32 G, JVM sử dụng kỹ thuật nén chỉ số đối tượng để tiết kiệm không gian), hơn 50% để cho lucene.

#### Vô hiệu hóa swap

Vô hiệu hóa swap, một khi cho phép trao đổi bộ nhớ với đĩa, sẽ gây ra vấn đề về hiệu suất nghiêm trọng. Có thể thông qua `bootstrap.memory_lock: true` trong elasticsearch.yml, để giữ JVM khóa bộ nhớ, đảm bảo hiệu suất của ES.

#### Cài đặt GC

Giữ cài đặt GC hiện tại, cài đặt mặc định là: Concurrent-Mark and Sweep (CMS), không chuyển sang G1 GC, vì hiện tại G1 vẫn có rất nhiều BUG.

Giữ cài đặt hiện tại của thread pool, hiện tại cài đặt thread pool của ES đã có nhiều cài đặt tối ưu hóa so với 1.X, giữ nguyên là được; kích thước thread pool mặc định bằng số lượng lõi CPU. Nếu cần thay đổi, cài đặt theo công thức ((số lượng lõi CPU * 3) / 2) + 1; không được vượt quá gấp đôi số lượng lõi CPU; nhưng không nên thay đổi cấu hình mặc định, nếu không sẽ gây tổn thương cho CPU.

### Đĩa

Đĩa quan trọng đối với tất cả các cụm, đặc biệt quan trọng đối với các cụm có lượng ghi lớn (ví dụ như những cụm lưu trữ dữ liệu nhật ký). Đĩa là hệ thống con chậm nhất trên máy chủ, điều này có nghĩa là những cụm có lượng ghi lớn dễ dàng làm cho đĩa bão hòa, khiến nó trở thành nút thắt cổ chai của cụm.

**Trong phạm vi chịu đựng được áp lực kinh tế, hãy sử dụng ổ đĩa thể rắn (SSD) càng nhiều càng tốt**. So với bất kỳ phương tiện quay nào (ổ đĩa cứng cơ học, băng từ, v.v.), ổ đĩa thể rắn sẽ tăng cường IO đáng kể, dù là ghi ngẫu nhiên hay ghi tuần tự.

> Nếu bạn đang sử dụng SSD, hãy đảm bảo rằng trình lập lịch I/O của hệ thống bạn được cấu hình đúng. Khi bạn ghi dữ liệu vào đĩa, trình lập lịch I/O quyết định khi nào thực sự gửi dữ liệu đến đĩa. Hầu hết các phiên bản \*nix mặc định có trình lập lịch là cfq (Completely Fair Queuing).
>
> Trình lập lịch phân bổ thời gian cho mỗi quy trình. Và tối ưu hóa việc chuyển các hàng đợi lớn đến đĩa. Nhưng nó được tối ưu hóa cho phương tiện quay: đặc tính cố hữu của ổ đĩa cơ học có nghĩa là việc ghi dữ liệu vào đĩa dựa trên bố cục vật lý sẽ hiệu quả hơn.
>
> Điều này không hiệu quả đối với SSD, mặc dù không liên quan đến ổ đĩa cơ học. Tuy nhiên, deadline hoặc noop nên được sử dụng. Trình lập lịch deadline tối ưu hóa dựa trên thời gian chờ ghi, trong khi noop chỉ là một hàng đợi FIFO đơn giản.
>
> Thay đổi đơn giản này có thể tạo ra sự khác biệt đáng kể. Chỉ cần sử dụng trình lập lịch đúng, chúng tôi đã thấy khả năng ghi tăng lên 500 lần.

**Nếu bạn sử dụng phương tiện quay (như ổ đĩa cơ học), hãy cố gắng có được ổ đĩa nhanh nhất có thể (ổ đĩa máy chủ hiệu suất cao, ổ đĩa 15k RPM)**.

**Sử dụng RAID0 là cách hiệu quả để tăng tốc độ đĩa, đối với cả ổ đĩa cơ học và SSD**. Không cần phải sử dụng gương hoặc các biến thể RAID khác, bởi vì Elasticsearch đã cung cấp chức năng sao lưu ở cấp độ tự thân thông qua các bản sao, vì vậy không cần sử dụng chức năng sao lưu của đĩa, đồng thời nếu sử dụng chức năng sao lưu của đĩa, sẽ ảnh hưởng lớn đến tốc độ ghi.

**Cuối cùng, hãy tránh sử dụng lưu trữ kết nối mạng (NAS)**. Mọi người thường tuyên bố rằng giải pháp NAS của họ nhanh hơn và đáng tin cậy hơn so với ổ đĩa cục bộ. Bỏ qua những tuyên bố này, chúng tôi chưa bao giờ thấy NAS đáng giá cho sự quảng cáo lớn của nó. NAS thường rất chậm, hiển thị độ trễ lớn hơn và phương sai độ trễ trung bình rộng hơn, và nó là điểm lỗi đơn.

## Cài đặt tối ưu hóa chỉ mục

Tối ưu hóa chỉ mục chủ yếu tập trung vào việc tối ưu hóa ở mức độ chèn của Elasticsearch, tốc độ chỉ mục của Elasticsearch thực sự khá nhanh, dữ liệu cụ thể, chúng ta có thể tham khảo dữ liệu benchmark chính thức. Chúng ta có thể tối ưu hóa chỉ mục dựa trên các yêu cầu khác nhau.

### Gửi hàng loạt

Khi có rất nhiều dữ liệu cần gửi, nên sử dụng gửi hàng loạt (hoạt động Bulk); ngoài ra, khi sử dụng yêu cầu bulk, mỗi yêu cầu không nên vượt quá vài chục MB, vì nếu quá lớn sẽ dẫn đến việc sử dụng quá nhiều bộ nhớ.

Ví dụ, trong quá trình thực thi ELK, Logstash indexer gửi dữ liệu vào Elasticsearch, kích thước batch có thể hoạt động như một điểm tối ưu hóa. Tuy nhiên, kích thước tối ưu cần phải xác định dựa trên kích thước tài liệu và hiệu suất máy chủ.

Ví dụ, trong Logstash, nếu kích thước tài liệu gửi vượt quá 20MB, Logstash sẽ chia một yêu cầu hàng loạt thành nhiều yêu cầu hàng loạt.

Nếu trong quá trình gửi, bạn gặp phải ngoại lệ EsRejectedExecutionException, thì điều này cho thấy hiệu suất chỉ mục của cụm đã đạt đến giới hạn. Trong trường hợp này, bạn cần tăng nguồn lực của cụm máy chủ hoặc giảm tốc độ thu thập dữ liệu dựa trên quy tắc kinh doanh, ví dụ chỉ thu thập nhật ký cấp Warn, Error trở lên.

### Tăng khoảng thời gian Refresh

Để tăng hiệu suất chỉ mục, Elasticsearch sử dụng chiến lược ghi trễ khi ghi dữ liệu, tức là dữ liệu được ghi vào bộ nhớ trước, khi vượt quá 1 giây mặc định (index.refresh_interval) sẽ thực hiện một hoạt động ghi, tức là làm mới dữ liệu segment trong bộ nhớ vào đĩa, lúc này chúng ta mới có thể tìm kiếm dữ liệu. Đây là lý do tại sao Elasticsearch cung cấp chức năng tìm kiếm gần thời gian thực, chứ không phải là tìm kiếm thời gian thực.

Nếu hệ thống của chúng ta không đặt yêu cầu cao về độ trễ dữ liệu, chúng ta **có thể tăng khoảng thời gian làm mới để giảm áp lực hợp nhất segment và tăng tốc độ chỉ mục**. Ví dụ, trong quá trình theo dõi toàn bộ chuỗi, chúng tôi đã đặt `index.refresh_interval` thành 30 giây, giảm số lần làm mới. Một ví dụ khác, khi tiến hành chỉ mục toàn bộ, bạn có thể tạm thời tắt số lần làm mới, tức là đặt `index.refresh_interval` thành -1, sau khi dữ liệu được nhập thành công, hãy mở lại chế độ bình thường, ví dụ 30 giây.

> Khi tải dữ liệu lớn, bạn có thể tạm thời không sử dụng refresh và repliccas, đặt index.refresh_interval thành -1, đặt index.number_of_replicas thành 0.

### Chỉnh sửa cài đặt index_buffer_size

Cài đặt bộ đệm chỉ mục có thể kiểm soát bao nhiêu bộ nhớ được phân bổ cho quá trình chỉ mục. Đây là một cấu hình toàn cầu, sẽ được áp dụng cho tất cả các phân đoạn khác nhau trên một nút.

```yml
indices.memory.index_buffer_size: 10%
indices.memory.min_index_buffer_size: 48mb
```

`indices.memory.index_buffer_size` chấp nhận một phần trăm hoặc một giá trị biểu thị kích thước byte. Mặc định là 10%, có nghĩa là 10% tổng bộ nhớ được phân bổ cho nút được sử dụng để làm kích thước bộ đệm chỉ mục. Giá trị này được chia cho các phân đoạn (shards) khác nhau. Nếu bạn đặt phần trăm, bạn cũng có thể đặt `min_index_buffer_size` (mặc định là 48mb) và `max_index_buffer_size` (mặc định không có giới hạn trên).

### Chỉnh sửa cài đặt liên quan đến translog

Một là kiểm soát tần suất hoạt động từ bộ nhớ đến ổ cứng, để giảm IO ổ cứng. Bạn có thể đặt thời gian sync_interval lớn hơn. Mặc định là 5 giây.

```yml
index.translog.sync_interval: 5s
```

Bạn cũng có thể kiểm soát kích thước khối dữ liệu tranlog, khi đạt đến kích thước threshold, dữ liệu mới sẽ được flush vào tệp chỉ mục lucene. Mặc định là 512mb.

```yml
index.translog.flush_threshold_size: 512mb
```

### Chú ý sử dụng trường \_id

Trong việc sử dụng trường \_id, bạn nên tránh tùy chỉnh \_id để tránh quản lý phiên bản dựa trên ID; nên sử dụng chiến lược tạo ID mặc định của ES hoặc sử dụng ID kiểu số làm khóa chính.

### Chú ý sử dụng trường \_all và trường \_source

Bạn nên chú ý đến việc sử dụng trường \_all và trường \_source, tùy thuộc vào tình huống và nhu cầu, trường \_all bao gồm tất cả các trường chỉ mục, thuận tiện cho việc tìm kiếm toàn văn, nếu không có nhu cầu này, có thể tắt; \_source lưu trữ nội dung tài liệu gốc, nếu không có nhu cầu lấy dữ liệu tài liệu gốc, có thể định nghĩa các trường được đưa vào \_source bằng cách đặt thuộc tính includes, excludes.

### Sử dụng thuộc tính index một cách hợp lý

Hãy sử dụng thuộc tính index một cách hợp lý, analyzed và not_analyzed, kiểm soát trường có phải là từ vựng hay không dựa trên yêu cầu kinh doanh. Chỉ cần các trường yêu cầu groupby, khi cấu hình, đặt thành not_analyzed để tăng hiệu suất truy vấn hoặc phân loại.

### Giảm số lượng bản sao

Elasticsearch mặc định số lượng bản sao là 3, mặc dù điều này sẽ cải thiện khả năng sẵn có của cụm, tăng số lượng truy vấn đồng thời, nhưng cũng sẽ ảnh hưởng đến hiệu suất ghi chỉ mục.

Trong quá trình chỉ mục, cần gửi tài liệu được cập nhật đến các nút bản sao, chờ nút bản sao hoạt động sau đó trả về kết thúc. Khi sử dụng Elasticsearch để tìm kiếm kinh doanh, nên đặt số lượng bản sao là 3, nhưng trong hệ thống nhật ký ELK nội bộ, hệ thống theo dõi phân tán, hoàn toàn có thể đặt số lượng bản sao là 1.

## Tối ưu hóa về truy vấn

Khi Elasticsearch được sử dụng như một truy vấn gần thời gian thực cho tìm kiếm kinh doanh, việc tối ưu hóa hiệu suất truy vấn trở nên rất quan trọng.

### Tối ưu hóa định tuyến

Khi chúng tôi truy vấn một tài liệu, Elasticsearch làm thế nào để biết một tài liệu nên được lưu trữ trong phân đoạn nào? Thực tế, nó được tính toán thông qua công thức sau đây.

```
shard = hash(routing) % number_of_primary_shards
```

Giá trị mặc định của routing là id của tài liệu, nhưng cũng có thể sử dụng giá trị tùy chỉnh, chẳng hạn như ID người dùng.

#### Truy vấn không có routing

Khi truy vấn, vì không biết dữ liệu cần truy vấn cụ thể nằm trên phân đoạn nào, nên toàn bộ quá trình được chia thành 2 bước:

1. Phân phối: Khi yêu cầu đến nút điều phối, nút điều phối sẽ phân phối yêu cầu truy vấn đến mỗi phân đoạn.
2. Tổng hợp: Nút điều phối thu thập kết quả truy vấn từ mỗi phân đoạn, sau đó sắp xếp kết quả truy vấn, sau đó trả về kết quả cho người dùng.

#### Truy vấn có routing

Khi truy vấn, có thể trực tiếp xác định một phân đoạn truy vấn dựa trên thông tin routing, không cần truy vấn tất cả các phân đoạn, sau đó sắp xếp thông qua nút điều phối.

Như truy vấn người dùng tùy chỉnh ở trên, nếu routing được đặt là userid, thì có thể trực tiếp truy vấn ra dữ liệu, hiệu quả tăng rất nhiều.

### Filter VS Query

Nếu có thể, hãy sử dụng ngữ cảnh bộ lọc (Filter) thay vì ngữ cảnh truy vấn (Query)

- Query: Tài liệu này khớp với câu truy vấn con này ở mức độ nào?
- Filter: Tài liệu này có khớp với câu truy vấn con không?

Elasticsearch chỉ cần trả lời "có" hoặc "không" cho các truy vấn Filter, không cần tính điểm liên quan như truy vấn Query, đồng thời kết quả Filter có thể được lưu vào bộ nhớ cache.

### Phân trang sâu

Trong quá trình sử dụng Elasticsearch, nên tránh việc phân trang lớn xảy ra.

Truy vấn phân trang thông thường đều bắt đầu từ from và lấy size bản ghi, điều này yêu cầu truy vấn và xếp hạng from+size bản ghi đầu tiên trong mỗi phân đoạn. Nút điều phối thu thập from+size bản ghi đầu tiên từ mỗi phân đoạn. Nút điều phối sẽ nhận được N*(from+size) bản ghi, sau đó sắp xếp chúng, sau đó trả về from đến from+size bản ghi. Nếu from hoặc size rất lớn, số lượng bản ghi tham gia sắp xếp sẽ tăng lên nhiều, cuối cùng sẽ làm tăng tiêu hao tài nguyên CPU.

Có thể giải quyết vấn đề này bằng cách sử dụng scroll và scroll-scan hiệu quả của Elasticsearch.

Cũng có thể kết hợp với đặc điểm kinh doanh thực tế, nếu kích thước id tài liệu và thời gian tạo tài liệu là đồng nhất và có thứ tự, có thể sử dụng id tài liệu làm offset phân trang, và đặt nó làm một điều kiện truy vấn phân trang.

### Sử dụng script một cách hợp lý

Chúng ta biết rằng việc sử dụng script chủ yếu có 3 hình thức, cách biên dịch động nội tuyến, lưu trữ trong thư viện chỉ mục \_script và lưu trữ dưới dạng script tệp; cảnh báo thông thường là sắp xếp thô, nên sử dụng cách thứ hai để lưu trữ script trong thư viện chỉ mục \_script trước, để biên dịch trước, sau đó sử dụng thông qua id script và kết hợp với params, có thể đạt được mô hình (logic) và dữ liệu đã được phân tách, đồng thời dễ dàng mở rộng và bảo dưỡng mô-đun script. Vui lòng tham khảo chi tiết về nội dung script ES tại [Giải thích chi tiết về mô-đun script Elasticsearch](https://www.knowledgedict.com/tutorial/elasticsearch-script.html).

## Tối ưu hóa cấu trúc dữ liệu

Dựa trên các tình huống sử dụng của Elasticsearch, cấu trúc dữ liệu tài liệu nên được kết hợp với tình huống sử dụng, loại bỏ dữ liệu không cần thiết và không hợp lý.

### Giảm thiểu các trường không cần thiết

Nếu Elasticsearch được sử dụng cho dịch vụ tìm kiếm kinh doanh, một số trường không cần thiết để tìm kiếm nên không được lưu trong ES. Điều này không chỉ tiết kiệm không gian, mà còn cải thiện hiệu suất tìm kiếm với cùng một lượng dữ liệu.

Tránh sử dụng giá trị động làm trường, việc tăng mapping động có thể dẫn đến sự cố ở cụm; tương tự, cần kiểm soát số lượng trường, không lập chỉ mục cho các trường không được sử dụng trong kinh doanh. Kiểm soát số lượng trường chỉ mục, độ sâu của mapping, loại trường chỉ mục, là quan trọng nhất trong việc tối ưu hóa hiệu suất ES.

Dưới đây là một số cài đặt mặc định của ES về số lượng trường, độ sâu mapping:

```yml
index.mapping.nested_objects.limit: 10000
index.mapping.total_fields.limit: 1000
index.mapping.depth.limit: 20
```

### Nested Object vs Parent/Child

Hạn chế sử dụng các trường nested hoặc parent/child, không sử dụng nếu không cần thiết; nested query chậm, parent/child query còn chậm hơn, chậm hơn nested query hàng trăm lần; vì vậy, nếu có thể giải quyết ở giai đoạn thiết kế mapping (thiết kế bảng rộng lớn hoặc sử dụng cấu trúc dữ liệu thông minh), thì không nên sử dụng mapping quan hệ cha-con.

Nếu bạn cần sử dụng nested fields, hãy đảm bảo không có quá nhiều trường nested, hiện tại giới hạn mặc định của ES là 50. Bởi vì đối với 1 tài liệu, mỗi trường nested sẽ tạo ra một tài liệu độc lập, điều này sẽ làm tăng số lượng tài liệu một cách đáng kể, ảnh hưởng đến hiệu suất truy vấn, đặc biệt là hiệu suất JOIN.

```yml
index.mapping.nested_fields.limit: 50
```

| So sánh | Nested Object                        | Parent/Child                                       |
| :--- | :----------------------------------- | :------------------------------------------------- |
| Ưu điểm | Các tài liệu được lưu trữ cùng nhau, do đó hiệu suất đọc cao         | Các tài liệu cha và con có thể được cập nhật độc lập, không ảnh hưởng lẫn nhau                     |
| Nhược điểm | Khi cập nhật tài liệu cha hoặc con, cần cập nhật toàn bộ tài liệu | Để duy trì mối quan hệ join, cần sử dụng một phần bộ nhớ, hiệu suất đọc thấp |
| Tình huống | Tài liệu con cập nhật ít, truy vấn thường xuyên             | Tài liệu con cập nhật thường xuyên                                     |

### Chọn mapping tĩnh, nếu không cần thiết, hãy vô hiệu hóa mapping động

Hạn chế sử dụng mapping động càng nhiều càng tốt, điều này có thể dẫn đến sự cố ở cụm, ngoài ra, mapping động có thể mang lại loại dữ liệu không thể kiểm soát, từ đó có thể dẫn đến các ngoại lệ liên quan đến truy vấn, ảnh hưởng đến kinh doanh.

Ngoài ra, khi Elasticsearch được sử dụng như một công cụ tìm kiếm, chủ yếu chịu trách nhiệm cho việc khớp và sắp xếp truy vấn, vì vậy loại dữ liệu lưu trữ dựa trên hai chức năng này được chia thành hai loại, một là trường cần phải khớp, được sử dụng để tạo chỉ mục đảo ngược cho việc khớp truy vấn, và loại khác là trường đặc trưng được sử dụng cho việc sắp xếp thô, như ctr, số lượt nhấp, số lượng bình luận, v.v.

## Thiết kế kiến trúc cụm

Việc triển khai Elasticsearch một cách hợp lý sẽ giúp cải thiện khả năng sẵn sàng tổng thể của dịch vụ.

### Phân tách nút chính, nút dữ liệu và nút điều phối

Khi thiết kế kiến trúc cụm Elasticsearch, hãy áp dụng kiến trúc phân tách giữa nút chính, nút dữ liệu và nút cân bằng tải. Trong phiên bản 5.x trở đi, nút dữ liệu có thể được phân chia thành mô hình "Hot-Warm".

Có 2 tham số trong tệp cấu hình Elasticsearch là node.master và node.data. Sự kết hợp của hai tham số này có thể giúp cải thiện hiệu suất máy chủ.

#### Nút chính (master)

Cấu hình `node.master:true` và `node.data:false`, nút máy chủ này chỉ hoạt động như một nút chính, nhưng không lưu trữ bất kỳ dữ liệu chỉ mục nào. Chúng tôi khuyên bạn nên chạy 3 nút chính chuyên dụng trong mỗi cụm để cung cấp độ linh hoạt tốt nhất. Khi sử dụng, bạn cũng cần đặt tham số `discovery.zen.minimum_master_nodes setting` thành 2 để tránh tình trạng phân rã (split-brain). Sử dụng 3 nút chính chuyên dụng, chịu trách nhiệm quản lý cụm và tăng cường sự ổn định tổng thể của trạng thái. Bởi vì 3 nút chính này không chứa dữ liệu và không tham gia vào hoạt động tìm kiếm và chỉ mục thực tế, họ không phải làm những việc giống nhau trên JVM, chẳng hạn như chỉ mục nặng hoặc tìm kiếm tốn thời gian và tài nguyên. Do đó, họ ít có khả năng bị dừng lại do việc thu gom rác. Do đó, cấu hình CPU, bộ nhớ và đĩa của nút chính có thể ít hơn nhiều so với nút dữ liệu.

#### Nút dữ liệu (data)

Cấu hình `node.master:false` và `node.data:true`, nút máy chủ này chỉ hoạt động như một nút dữ liệu, chỉ được sử dụng để lưu trữ dữ liệu chỉ mục, làm cho nút máy chủ này hoạt động đơn giản, chỉ được sử dụng để lưu trữ dữ liệu và truy vấn dữ liệu, giảm tỷ lệ tiêu hao tài nguyên của nó.

Trong phiên bản Elasticsearch 5.x trở đi, nút dữ liệu có thể được chia thành mô hình "Hot-Warm", tức là chia thành nút nóng (hot node) và nút ấm (warm node).

nút nóng:

Nút nóng chủ yếu là nút chỉ mục (nút ghi), đồng thời lưu trữ một số chỉ mục được truy vấn thường xuyên gần đây. Do việc thực hiện chỉ mục rất tiêu tốn CPU và IO, đó là hoạt động IO và CPU nặng, nên sử dụng loại đĩa SSD, duy trì hiệu suất ghi tốt; chúng tôi khuyên bạn nên triển khai ít nhất 3 nút nóng để đảm bảo khả năng sẵn sàng cao. Dựa trên lượng dữ liệu cần thu thập và truy vấn gần đây, bạn có thể tăng số lượng máy chủ để đạt được hiệu suất mong muốn.

Để đặt nút thành loại nóng, bạn cần cấu hình như sau trong elasticsearch.yml:

```
node.attr.box_type: hot
```

Nếu đang hoạt động trên chỉ mục cụ thể, bạn có thể đặt `index.routing.allocation.require.box_type: hot` để ghi chỉ mục vào nút nóng.

nút ấm:

Loại nút này được thiết kế để xử lý một lượng lớn chỉ mục chỉ đọc mà không thường xuyên truy cập. Do các chỉ mục này chỉ đọc, nút ấm có xu hướng gắn kết một lượng lớn đĩa (đĩa thông thường) thay vì SSD. Cấu hình bộ nhớ, CPU giống như nút nóng; số lượng nút thường cũng lớn hơn hoặc bằng 3.

Để đặt nút thành loại ấm, bạn cần cấu hình như sau trong elasticsearch.yml:

```
node.attr.box_type: warm
```

Đồng thời, bạn cũng có thể đặt `index.codec:best_compression` trong elasticsearch.yml để đảm bảo cấu hình nén của nút ấm.

Khi chỉ mục không còn được truy vấn thường xuyên, bạn có thể đánh dấu chỉ mục là ấm thông qua `index.routing.allocation.require.box_type:warm`, để đảm bảo rằng chỉ mục không được ghi vào nút nóng, để giữ nguyên tài nguyên đĩa SSD. Một khi bạn đặt thuộc tính này, ES sẽ tự động hợp nhất chỉ mục vào nút ấm.

#### Nút điều phối (coordinating)

Nút điều phối được sử dụng để điều phối trong phân tán, trả về dữ liệu sau khi kết hợp từ các phân đoạn hoặc nút khác. Nút này sẽ không được chọn làm nút chính, cũng không lưu trữ bất kỳ dữ liệu chỉ mục nào. Máy chủ này chủ yếu được sử dụng để cân bằng tải truy vấn. Khi truy vấn, thường sẽ liên quan đến việc truy vấn dữ liệu từ nhiều máy chủ nút và phân phối yêu cầu đến nhiều máy chủ nút chỉ định, và xử lý tổng hợp kết quả trả về từ các máy chủ nút, cuối cùng trả về cho máy khách. Trong cụm ES, tất cả các nút đều có thể là nút điều phối, nhưng bạn có thể đặt `node.master`, `node.data`, `node.ingest` tất cả đều là `false` để đặt nút điều phối chuyên dụng. Cần CPU tốt và bộ nhớ cao.

- node.master:false và node.data:true, máy chủ nút này chỉ hoạt động như một nút dữ liệu, chỉ dùng để lưu trữ dữ liệu chỉ mục, làm cho máy chủ nút này chỉ có một chức năng, chỉ dùng để lưu trữ dữ liệu và truy vấn dữ liệu, giảm tỷ lệ tiêu hao tài nguyên của nó.
- node.master:true và node.data:false, máy chủ nút này chỉ hoạt động như một nút chính, nhưng không lưu trữ bất kỳ dữ liệu chỉ mục nào, máy chủ nút này sẽ sử dụng tài nguyên rảnh rỗi của chính nó, để điều phối các yêu cầu tạo chỉ mục hoặc truy vấn, và phân phối các yêu cầu này một cách hợp lý đến các máy chủ nút liên quan.
- node.master:false và node.data:false, máy chủ nút này không sẽ được chọn làm nút chính, cũng không lưu trữ bất kỳ dữ liệu chỉ mục nào. Máy chủ này chủ yếu được sử dụng để cân bằng tải truy vấn. Khi truy vấn, thường sẽ liên quan đến việc truy vấn dữ liệu từ nhiều máy chủ nút và phân phối yêu cầu đến nhiều máy chủ nút chỉ định, và xử lý tổng hợp kết quả trả về từ các máy chủ nút, cuối cùng trả về cho máy khách.

## Tắt chức năng http trên các nút dữ liệu

Đối với tất cả các nút dữ liệu trong cụm Elasticsearch, không cần mở dịch vụ http. Đặt tham số cấu hình như sau: `http.enabled:false`, đồng thời không cài đặt các plugin giám sát như head, bigdesk, marvel, v.v. Điều này đảm bảo rằng các nút dữ liệu chỉ cần xử lý các hoạt động như tạo/cập nhật/xóa/truy vấn dữ liệu chỉ mục.

Chức năng http có thể được mở trên các máy chủ không phải nút dữ liệu, và các plugin giám sát liên quan cũng được cài đặt trên những máy chủ này, được sử dụng để giám sát trạng thái cụm Elasticsearch và các thông tin dữ liệu khác. Việc làm này vừa đảm bảo an ninh dữ liệu, vừa cải thiện hiệu suất dịch vụ.

## Mỗi máy chủ nên chỉ triển khai một nút

Một máy chủ vật lý có thể khởi động nhiều nút máy chủ (bằng cách đặt các cổng khởi động khác nhau), nhưng tài nguyên CPU, bộ nhớ, đĩa cứng, v.v. của một máy chủ cuối cùng là có giới hạn, vì vậy, từ góc độ hiệu suất máy chủ, không khuyến nghị khởi động nhiều nút trên một máy chủ.

## Cài đặt phân mảnh cụm

Một khi bạn đã tạo chỉ mục trên ES, bạn không thể điều chỉnh cài đặt phân mảnh. Trong ES, một phân mảnh thực tế tương ứng với một chỉ mục lucene, và việc đọc và ghi chỉ mục lucene sẽ tiêu thụ rất nhiều tài nguyên hệ thống, do đó, số lượng phân mảnh không nên được đặt quá lớn; vì vậy, khi tạo chỉ mục, việc cấu hình số lượng phân mảnh một cách hợp lý rất quan trọng. Nói chung, chúng ta tuân theo một số nguyên tắc sau:

1. Kiểm soát dung lượng đĩa mà mỗi phân mảnh chiếm không vượt quá cài đặt không gian heap JVM tối đa của ES (thông thường không được đặt quá 32 G, tham khảo nguyên tắc cài đặt bộ nhớ JVM ở trên), do đó, nếu tổng dung lượng chỉ mục khoảng 500 G, thì số lượng phân mảnh khoảng 16 là đủ; tất nhiên, tốt nhất là cân nhắc nguyên tắc 2 cùng một lúc.
2. Xem xét số lượng nút, thường một nút đôi khi chỉ là một máy chủ vật lý, nếu số lượng phân mảnh quá nhiều, vượt quá số lượng nút, rất có thể một nút sẽ chứa nhiều phân mảnh, nếu nút này gặp sự cố, ngay cả khi giữ được hơn 1 bản sao, cũng có thể dẫn đến mất dữ liệu, cụm không thể khôi phục. Vì vậy, **thông thường, chúng tôi đặt số lượng phân mảnh không vượt quá 3 lần số lượng nút**.

## Tài liệu tham khảo

- [Hướng dẫn Elasticsearch](https://www.knowledgedict.com/tutorial/elasticsearch-intro.html)
