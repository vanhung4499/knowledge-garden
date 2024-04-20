---
title: CF Redis Statistics
tags:
  - project
  - codeforum
categories: 
date created: 2024-04-16
date modified: 2024-04-16
---

# Technical Redis: Triển khai đếm số liệu thống kê

Các bộ đếm được sử dụng rộng rãi trong các dự án trên Internet, không phân biệt kích thước dự án lớn hay nhỏ. Bạn có thể tìm thấy phạm vi ứng dụng của chúng trong mọi tình huống, kể cả trong các dự án hướng công nghệ, ví dụ như:

- Số lượt thích bài viết
- Số lượt lưu trữ
- Số lượt bình luận
- Số lượng người theo dõi người dùng

Trong dự án này tôi dùng hai cách để truy vấn thông tin liên quan đến việc đếm. Một cách là dựa trên ghi chú thời gian thực trong cơ sở dữ liệu, còn một cách khác là sử dụng tính năng `incr` của Redis để triển khai bộ đếm.

Tiếp theo, chúng ta sẽ tập trung vào cách sử dụng bộ đếm Redis trong các tình huống đếm của dự án.

## Các kịch bản nghiệp vụ của bộ đếm

Trước tiên, hãy xem các kịch bản trong kỹ thuật mà sử dụng bộ đếm, chia thành hai loại chính (đếm nghiệp vụ + pv/uv), và ba lĩnh vực cụ thể (người dùng, bài viết, trang web):

- Thống kê liên quan đến người dùng
	- Số lượng bài viết, tổng số lượt đọc bài viết, số lượng người theo dõi, số lượng người theo dõi tác giả, số lượng lượt lưu trữ bài viết, số lượng lượt thích bài viết
- Thống kê liên quan đến bài viết
	- Số lượt thích bài viết, số lượt đọc, số lượt lưu trữ, số lượt bình luận
- Thống kê pv/uv của trang web
	- Tổng số pv/uv của trang web, pv/uv của một ngày cụ thể, pv/uv của một URI cụ thể

Lưu ý các kịch bản trên, mục đích chính của bài viết là giới thiệu về cách sử dụng bộ đếm Redis.

Trong đó, việc thống kê liên quan đến người dùng và bài viết sẽ là trọng tâm của chúng tôi, vì tính chất nghiệp vụ của hai cái này rất giống nhau, vì vậy chúng tôi chọn một để tập trung giới thiệu, và chúng tôi sẽ chọn thống kê người dùng để giới thiệu.

## Bộ Đếm Redis

Bộ đếm Redis chủ yếu sử dụng lệnh `incr` cơ bản để thực hiện việc tăng/giảm một đơn vị một cách nguyên tử (+1/-1). Điều tuyệt vời là không chỉ cấu trúc dữ liệu string của Redis hỗ trợ incr, mà cả các cấu trúc dữ liệu hash và zset cũng hỗ trợ incr.

### 1. Lệnh incr

Lệnh `incr` của Redis tăng giá trị số trong key lên một.

- Nếu key không tồn tại, giá trị của key sẽ được khởi tạo thành 0, sau đó thực hiện thao tác INCR.
- Nếu giá trị chứa loại sai, hoặc giá trị kiểu chuỗi không thể biểu diễn dưới dạng số, thì trả về một lỗi.
- Giá trị của thao tác này được giới hạn trong phạm vi số nguyên có dấu 64 bit.

Tiếp theo là cách triển khai được đóng gói trong kỹ thuật:

```java
/**
 * Tăng giá trị
 *
 * @param key
 * @param filed
 * @param cnt
 * @return
 */
public static Long hIncr(String key, String filed, Integer cnt) {
    return template.execute((RedisCallback<Long>) con -> con.hIncrBy(keyBytes(key), valBytes(filed), cnt));
}
```

### 2. Thống Kê Đếm Người Dùng

Chúng tôi thống kê các thông tin liên quan đến người dùng, mỗi người dùng tương ứng với một cấu trúc dữ liệu hash.

- key: `user_statistic_${userId}`
- field:
    - followCount: Số lượt theo dõi
    - fansCount: Số lượt người theo dõi
    - articleCount: Số lượng bài viết đã xuất bản
    - praiseCount: Số lượt thích bài viết
    - readCount: Số lượt đọc bài viết
    - collectionCount: Số lượt lưu trữ bài viết

Trong bộ đếm, cốt lõi nằm ở việc thực hiện +1/-1 một cách nguyên tử sau khi thỏa mãn điều kiện đếm.

Thường trong các tình huống nghiệp vụ, việc đếm như vậy không được khuyến khích gắn kết chặt chẽ với mã nghiệp vụ trực tiếp. Ví dụ:

Người dùng lưu trữ một bài viết, nếu theo thiết kế bình thường, khi người dùng lưu trữ, lệnh đếm sẽ được gọi để thực hiện thêm 1.

Nhưng có vấn đề gì với cách thực hiện như trên không?

- Tất nhiên là không có vấn đề, nhưng không đủ tinh tế.

Ví dụ, trong thiết kế hiện tại của dự án, sau khi thích một bài viết, ngoài việc cập nhật đếm, còn có cập nhật hoạt động tích cực của người dùng như đã đề cập ở trên. Nếu tất cả các logic được đặt trong mã nghiệp vụ, sẽ dẫn đến mức độ gắn kết của nghiệp vụ rất nặng.

Kỹ thuật chọn cơ chế tin nhắn để đối phó với tình huống này (Mở rộng thêm, tại sao các dự án lớn hơn thường thiết kế hệ thống tin nhắn riêng của họ? Một mục tiêu quan trọng là tập trung logic nghiệp vụ của họ, chỉ gửi các tin nhắn thay đổi trạng thái/khối lượng nghiệp vụ của họ ra bên ngoài, để thực hiện giảm kết nối).

Tương ứng với đó, logic thực hiện đếm được triển khai trong `com.hnv99.forum.service.statistics.listener.UserStatisticEventListener`.

```java
@EventListener(classes = NotifyMsgEvent.class)
@Async
public void notifyMsgListener(NotifyMsgEvent msgEvent) {
    switch (msgEvent.getNotifyType()) {
        case COMMENT:
        case REPLY:
            // Bình luận/Trả lời
            CommentDO comment = (CommentDO) msgEvent.getContent();
            RedisClient.hIncr(CountConstants.ARTICLE_STATISTIC_INFO + comment.getArticleId(), CountConstants.COMMENT_COUNT, 1);
            break;
        case DELETE_COMMENT:
        case DELETE_REPLY:
            // Xóa bình luận/Trả lời
            comment = (CommentDO) msgEvent.getContent();
            RedisClient.hIncr(CountConstants.ARTICLE_STATISTIC_INFO + comment.getArticleId(), CountConstants.COMMENT_COUNT, -1);
            break;
        case COLLECT:
            // Lưu trữ
            UserFootDO foot = (UserFootDO) msgEvent.getContent();
            RedisClient.hIncr(CountConstants.USER_STATISTIC_INFO + foot.getDocumentUserId(), CountConstants.COLLECTION_COUNT, 1);
            RedisClient.hIncr(CountConstants.ARTICLE_STATISTIC_INFO + foot.getDocumentId(), CountConstants.COLLECTION_COUNT, 1);
            break;
        case CANCEL_COLLECT:
            // Hủy lưu trữ
            foot = (UserFootDO) msgEvent.getContent();
            RedisClient.hIncr(CountConstants.USER_STATISTIC_INFO + foot.getDocumentUserId(), CountConstants.COLLECTION_COUNT, -1);
            RedisClient.hIncr(CountConstants.ARTICLE_STATISTIC_INFO + foot.getDocumentId(), CountConstants.COLLECTION_COUNT, -1);
            break;
        case PRAISE:
            // Thích
            foot = (UserFootDO) msgEvent.getContent();
            RedisClient.hIncr(CountConstants.USER_STATISTIC_INFO + foot.getDocumentUserId(), CountConstants.PRAISE_COUNT, 1);
            RedisClient.hIncr(CountConstants.ARTICLE_STATISTIC_INFO + foot.getDocumentId(), CountConstants.PRAISE_COUNT, 1);
            break;
        case CANCEL_PRAISE:
            // Hủy thích
            foot = (UserFootDO) msgEvent.getContent();
            RedisClient.hIncr(CountConstants.USER_STATISTIC_INFO + foot.getDocumentUserId(), CountConstants.PRAISE_COUNT, -1);
            RedisClient.hIncr(CountConstants.ARTICLE_STATISTIC_INFO + foot.getDocumentId(), CountConstants.PRAISE_COUNT, -1);
            break;
        case FOLLOW:
            UserRelationDO relation = (UserRelationDO) msgEvent.getContent();
            // Số lượng người theo dõi chính của người dùng + 1
            RedisClient.hIncr(CountConstants.USER_STATISTIC_INFO + relation.getUserId(), CountConstants.FANS_COUNT, 1);
            // Số lượt theo dõi của người theo dõi + 1
            RedisClient.hIncr(CountConstants.USER_STATISTIC_INFO + relation.getFollowUserId(), CountConstants.FOLLOW_COUNT, 1);
            break;
        case CANCEL_FOLLOW:
            relation = (UserRelationDO) msgEvent.getContent();
            // Số lượng người theo dõi chính của người dùng + 1
            RedisClient.hIncr(CountConstants.USER_STATISTIC_INFO + relation.getUserId(), CountConstants.FANS_COUNT, -1);
            // Số lượt theo dõi của người theo dõi + 1
            RedisClient.hIncr(CountConstants.USER_STATISTIC_INFO + relation.getFollowUserId(), CountConstants.FOLLOW_COUNT, -1);
            break;
        default:
    }
}

@Async  
@EventListener(ArticleMsgEvent.class)  
public void publishArticleListener(ArticleMsgEvent<ArticleDO> event) {  
    ArticleEventEnum type = event.getType();  
    if (type == ArticleEventEnum.ONLINE) {  
        userActivityRankService.addActivityScore(ReqInfoContext.getReqInfo().getUserId(), new ActivityScoreBo().setPublishArticle(true).setArticleId(event.getContent().getId()));  
    }
}
```

Thông qua việc dựa vào các sự kiện thông báo mà dự án đang sử dụng, để thực hiện các thay đổi đếm tương ứng cho người dùng/bài viết.

Điểm khác biệt nằm ở việc thống kê số lượng bài viết của người dùng, bởi vì khi tạo một thông báo, không có thông tin nào cho biết bài viết đó có từ trạng thái chưa được xuất bản cho đến trạng thái đã được xuất bản, xuất bản đến việc ngừng phát hành/xóa, vì vậy không thể thực hiện +1/-1 trực tiếp.

Chúng tôi chọn chiến lược cập nhật toàn bộ.

### 3. Truy Vấn Thông Tin Thống Kê Của Người Dùng

Sau khi thực hiện việc thống kê các thông tin liên quan đến người dùng, việc truy vấn thông tin thống kê của người dùng trở nên đơn giản hơn nhiều, chỉ cần sử dụng lệnh `hgetall` trực tiếp. Code nằm trong lớp `CountServiceImpl`.

```java
@Override  
public UserStatisticInfoDTO queryUserStatisticInfo(Long userId) {  
    Map<String, Integer> ans = RedisClient.hGetAll(CountConstants.USER_STATISTIC_INFO + userId, Integer.class);  
    UserStatisticInfoDTO info = new UserStatisticInfoDTO();  
    info.setFollowCount(ans.getOrDefault(CountConstants.FOLLOW_COUNT, 0));  
    info.setArticleCount(ans.getOrDefault(CountConstants.ARTICLE_COUNT, 0));  
    info.setPraiseCount(ans.getOrDefault(CountConstants.PRAISE_COUNT, 0));  
    info.setCollectionCount(ans.getOrDefault(CountConstants.COLLECTION_COUNT, 0));  
    info.setReadCount(ans.getOrDefault(CountConstants.READ_COUNT, 0));  
    info.setFansCount(ans.getOrDefault(CountConstants.FANS_COUNT, 0));  
    return info;  
}
```

### 4. Tính nhất quán của bộ đệm

Dù đã đạt được một dịch vụ đếm hoàn chỉnh như trên, nhưng trong thực tế, ngay cả những người tự tin nhất cũng không thể khẳng định rằng hệ thống đếm của họ là hoàn toàn không có vấn đề.

Thường thì chúng ta sẽ thực hiện một nhiệm vụ đồng bộ/kiểm tra định kỳ để đảm bảo tính nhất quán giữa cache và dữ liệu thực tế.

Kỹ thuật đã chọn một phương án đồng bộ định kỳ đơn giản để triển khai:

- Thống kê thông tin của người dùng được đồng bộ toàn bộ mỗi ngày.

```java
    @Scheduled(cron = "0 15 4 * * ?")
    public void autoRefreshAllUserStatisticInfo() {
        Long now = System.currentTimeMillis();
        log.info("Start auto refreshing user statistics information");
        Long userId = 0L;
        int batchSize = 20;
        while (true) {
            List<Long> userIds = userDao.scanUserId(userId, batchSize);
            userIds.forEach(this::refreshUserStatisticInfo);
            if (userIds.size() < batchSize) {
                userId = userIds.get(userIds.size() - 1);
                break;
            } else {
                userId = userIds.get(batchSize - 1);
            }
        }
        log.info("End auto refreshing user statistics information, total time: {}ms, maxUserId: {}", System.currentTimeMillis() - now, userId);
    }
```

- Thống kê thông tin của bài viết được đồng bộ toàn bộ mỗi ngày.

```java
    private synchronized void initSiteMap() {
        long lastId = 0L;
        RedisClient.del(SITE_MAP_CACHE_KEY);
        while (true) {
            List<SimpleArticleDTO> list = articleDao.getBaseMapper().listArticlesOrderById(lastId, SCAN_SIZE);
            list.forEach(s -> countService.refreshArticleStatisticInfo(s.getId()));

            Map<String, Long> map = list.stream().collect(Collectors.toMap(s -> String.valueOf(s.getId()), s -> s.getCreateTime().getTime(), (a, b) -> a));
            RedisClient.hMSet(SITE_MAP_CACHE_KEY, map);
            if (list.size() < SCAN_SIZE) {
                break;
            }
            lastId = list.get(list.size() - 1).getId();
        }
    }

```

### 5. Tổng Kết

Dựa trên lệnh `incr` của Redis, việc triển khai các yêu cầu đếm trở nên dễ dàng hơn nhiều. Nhưng tại sao chúng ta lại sử dụng Redis để triển khai một bộ đếm? Có vấn đề gì khi sử dụng dữ liệu gốc của cơ sở dữ liệu để thống kê trực tiếp không?

Trong mã nguồn của dự án, đối với việc thống kê liên quan đến người dùng/bài viết, cung cấp hai giải pháp: sử dụng đếm db + đếm Redis

Thường thì, ở giai đoạn ban đầu của dự án hoặc khi dự án rất đơn giản và lưu lượng truy cập thấp, chỉ cần thực hiện thống kê trực tiếp bằng db là đủ. Ưu điểm của phương pháp này là đơn giản, dễ hiểu và ít gặp vấn đề; nhược điểm là hiệu suất thống kê trực tiếp mỗi lần rất kém, không mở rộng được.

Khi dự án của chúng ta phát triển, việc lưu trữ kết quả cuối cùng trực tiếp trong Redis, và truy vấn trực tiếp từ đó trong lớp hiển thị, giúp tăng hiệu suất, đáp ứng mơ ước về lưu lượng truy cập cao. Nhược điểm là việc đảm bảo tính nhất quán dữ liệu trở nên khó khăn hơn.

Tổng cộng, theo quan điểm cá nhân của tôi, không có phương pháp chọn lựa nào là hoàn hảo. Đừng mù quáng trước quyền lực, khi bạn có cơ hội lựa chọn, hãy ưu tiên chọn một giải pháp có chi phí triển khai thấp nhất, thay vì một giải pháp hoàn hảo nhất và phù hợp nhất, để bạn còn có cơ hội tái cấu trúc. Không phải không có cơ hội tái cấu trúc, nếu không thì làm sao bạn có thể thể hiện khối lượng công việc của mình đấy phải không?
