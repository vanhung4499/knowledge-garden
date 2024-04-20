---
title: CF Redis Ranking Impl
tags:
  - project
  - codeforum
categories: 
date created: 2024-04-15
date modified: 2024-04-15
---

# Technical Redis triển khai xếp hạng hoạt dộng người dùng

> Leaderboard là một yêu cầu phổ biến, và có thể nói là các phương án chọn công nghệ tương ứng cũng rất hoàn thiện. Trong dự án này, tôi cũng đã giới thiệu một bảng xếp hạng sự hoạt động của người dùng, chủ yếu dựa trên cấu trúc dữ liệu ZSET của Redis để triển khai. Hãy cùng xem ví dụ thực tế về cách triển khai một bảng xếp hạng.

## Thiết kế

Trước khi giới thiệu code cụ thể, hãy hiểu về tình huống

### 1. Mô tả tình huống

Trong forum, chúng tôi cung cấp một bảng xếp hạng hoạt động của người dùng, tuy nhiên với một cộng đồng blog, điều quan trọng hơn là triển khai một bảng xếp hạng cho các tác giả. Với mục tiêu giúp mọi người cảm thấy được tham gia hơn, chúng tôi thiết kế một bảng xếp hạng dựa trên hoạt động của người dùng, phân biệt giữa hai bảng xếp hạng hàng ngày và hàng tháng.

Cách tính hoạt động của người dùng:

1. Mỗi khi một người dùng truy cập một trang web mới, +1 điểm
2. Đối với mỗi bài viết, mỗi lượt thích hoặc lưu trữ, +2 điểm; khi hủy thích hoặc hủy lưu trữ, điểm hoạt động trước đó sẽ được thu hồi
3. Mỗi bình luận về bài viết, +3 điểm
4. Đăng một bài viết được phê duyệt +10 điểm

Bảng xếp hạng:

- Hiển thị 30 người dùng có hoạt động cao nhất

### 2. Thiết kế giải pháp

Thuộc tính nghiệp vụ của bảng xếp hạng khá rõ ràng và đơn giản, và cấu trúc dữ liệu tương ứng có thể được thiết kế một cách dễ dàng, thông tin cốt lõi như sau

**Đơn vị lưu trữ**

Đại diện cho thông tin mà mỗi người dùng trên bảng xếp hạng nên giữ như sau

```java
// Để chỉ rõ người dùng cụ thể
long userId;
// Xếp hạng của người dùng trên bảng xếp hạng
long rank;
// Điểm cao nhất của người dùng, cũng là điểm hoạt động trên bảng xếp hạng
long score;
```

**Cấu trúc dữ liệu**

Bảng xếp hạng, nhìn chung, là liên tục, và từ đó chúng ta có thể nghĩ đến một cấu trúc dữ liệu LinkedList phù hợp, ưu điểm là khi xếp hạng thay đổi, không cần sao chép mảng

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240415222718.png)

Trong hình ảnh dưới đây, khi hoạt động của một người dùng thay đổi, chúng ta cần duyệt từ phía trước để tìm vị trí thích hợp, chèn và nhận xếp hạng mới, khi cập nhật và chèn, so với ArrayList thì có nhiều điểm lợi hơn, nhưng vẫn có một số vấn đề sau đây

**Vấn đề 1: Làm thế nào người dùng có thể lấy được xếp hạng của mình?**

Sử dụng `LinkedList` mang lại ưu điểm trong việc cập nhật chèn và xóa cùng với hỗ trợ lấy phần tử ngẫu nhiên nhưng có thể làm cho việc này chậm hơn, trong trường hợp xấu nhất là cần phải quét từ đầu đến cuối.

**Vấn đề 2: Vấn đề về hỗ trợ đồng thời?**

Khi nhiều người dùng cùng cập nhật điểm số đồng thời, vấn đề về cập nhật xếp hạng đồng thời trở nên rõ ràng hơn, tất nhiên có thể sử dụng các giải pháp tương tự như việc sao chép mảng khi ghi trong JDK.

Trên đây là những vấn đề mà chúng ta sẽ gặp khi triển khai cấu trúc dữ liệu này, tuy nhiên chủ đề của chúng ta là sử dụng Redis để triển khai bảng xếp hạng. Bây giờ chúng ta sẽ xem xét cách sử dụng Redis để hỗ trợ nhu cầu của chúng ta một cách đơn giản.

### 3. Phương án sử dụng Redis

Ở đây chúng ta chủ yếu sử dụng cấu trúc dữ liệu ZSET của Redis, đó là một tập hợp có trọng số. Dưới đây là phân tích về các khả năng:

- Set: Tập hợp đảm bảo tính duy nhất của các phần tử bên trong.
- Trọng số: Điều này có thể xem như là điểm số của chúng ta, vì vậy mỗi phần tử đều có một điểm số.
- ZSET: Đây là một tập hợp được sắp xếp theo điểm số.

Dựa trên tính chất của ZSET, điểm số của mỗi người dùng sẽ được đặt vào ZSET, tạo thành một phần tử có trọng số, và đã được sắp xếp. Chỉ cần lấy chỉ mục của phần tử, chúng ta sẽ có thứ hạng dự kiến của mình.

## Triển khai bảng xếp hạng

Tiếp theo, chúng ta sẽ xem cách bảng xếp hạng hoạt động của dự án được triển khai như thế nào.

Đường dẫn gói core: `com.hnv99.forum.service.rank`

Triển khai code: `com.hnv99.forum.service.rank.service.impl.UserActivityRankServiceImpl`

### 1. Cập nhật điểm hoạt động của người dùng

Đầu tiên, chúng ta sẽ triển khai một phương thức cập nhật hoạt động của người dùng. Đầu tiên, chúng ta định nghĩa một thực thể truyền tham số bao gồm các thông tin liên quan đến kịch bản nghiệp vụ được gọi là `ActivityScoreBo`.

Tiếp theo, chúng ta sẽ suy nghĩ về cách triển khai cụ thể này, đầu tiên hãy làm sáng tỏ quy trình nghiệp vụ của triển khai

1. Dựa trên thực thể nghiệp vụ, tính toán sự tăng/giảm điểm hoạt động cần thiết.
2. Đối với việc tăng điểm hoạt động:
   - 2.1 Thực hiện một hoạt động bất biến để tránh thêm trùng lặp, do đó cần kiểm tra xem trước đó có thêm điểm hoạt động liên quan không.
   - 2.2 Nếu có hoạt động bất biến, thì chỉ cần trả về; nếu không, thực hiện cập nhật và lưu trữ bất biến.
3. Đối với việc giảm điểm hoạt động:
   - 3.1 Kiểm tra xem trước đó đã thêm điểm hoạt động chưa, để tránh việc trừ điểm dưới 0.
   - 3.2 Nếu trước đó không trừ điểm, chỉ cần trả về; nếu không, thực hiện việc trừ điểm và loại bỏ bất biến.

Sau khi đã rõ ràng về logic nghiệp vụ trên, hãy xem xét các yếu tố chính của triển khai của chúng tôi.

1. Làm sao để thực hiện hoạt động bất biến?
2. Làm sao để cập nhật điểm số của bảng xếp hạng?

#### 1.1. Chiến lược idempotent

Để ngăn chặn việc thêm điểm hoạt động lặp lại, làm thế nào để thực hiện tính idempotent? Một giải pháp đơn giản là ghi lại mỗi mục điểm thưởng của người dùng, và khi thực hiện việc thêm điểm cụ thể, dựa trên điều này để xác định tính idempotent.

Dựa trên cách tiếp cận trên, một giải pháp dễ hiểu là mỗi người dùng duy trì một bảng lịch sử cập nhật hoạt động, chúng ta nên thiết kế nó một cách nhẹ nhàng nhất có thể.

Trực tiếp lưu lịch sử hoạt động của người dùng trong cấu trúc dữ liệu hash của Redis, mỗi ngày một bản ghi:

- key: `activity_rank_{user_id}_{yyyyMMdd}`
- field: `Khóa cập nhật hoạt động`
- value: `Số lượng hoạt động được thêm vào`

#### 1.2. Cập nhật điểm xếp hạng

Việc này tương đối đơn giản, chỉ cần sử dụng phương thức incr của zset.

Chúng tôi cũng đã mở rộng lớp công cụ RedisClient một chút, bổ sung các hoạt động liên quan đến zset.

```java
    public static Double zIncrBy(String key, String value, Integer score) {
        return template.execute(new RedisCallback<Double>() {
            @Override
            public Double doInRedis(RedisConnection connection) throws DataAccessException {
                return connection.zIncrBy(keyBytes(key), score, valBytes(value));
            }
        });
    }
```

#### 1.3. Triển khai cụ thể

Sau đây là triển khai cụ thể trong lớp `UserActivityRankServiceImpl`;

```java
    @Override
    public void addActivityScore(Long userId, ActivityScoreBo activityScore) {
        if (userId == null) {
            return;
        }

        // 1. Calculate activity (positive for adding activity, negative for subtracting activity)
        String field;
        int score = 0;
        if (activityScore.getPath() != null) {
            field = "path_" + activityScore.getPath();
            score = 1;
        } else if (activityScore.getArticleId() != null) {
            field = activityScore.getArticleId() + "_";
            if (activityScore.getPraise() != null) {
                field += "praise";
                score = BooleanUtils.isTrue(activityScore.getPraise()) ? 2 : -2;
            } else if (activityScore.getCollect() != null) {
                field += "collect";
                score = BooleanUtils.isTrue(activityScore.getCollect()) ? 2 : -2;
            } else if (activityScore.getRate() != null) {
                // Comment reply
                field += "rate";
                score = BooleanUtils.isTrue(activityScore.getRate()) ? 3 : -3;
            } else if (BooleanUtils.isTrue(activityScore.getPublishArticle())) {
                // Publish article
                field += "publish";
                score += 10;
            }
        } else if (activityScore.getFollowedUserId() != null) {
            field = activityScore.getFollowedUserId() + "_follow";
            score = BooleanUtils.isTrue(activityScore.getFollow()) ? 2 : -2;
        } else {
            return;
        }

        final String todayRankKey = todayRankKey();
        final String monthRankKey = monthRankKey();
        // 2. Idempotent: Determine if relevant activity information has been updated before
        final String userActionKey = ACTIVITY_SCORE_KEY + userId + DateUtil.format(DateTimeFormatter.ofPattern("yyyyMMdd"), System.currentTimeMillis());
        Integer ans = RedisClient.hGet(userActionKey, field, Integer.class);
        if (ans == null) {
            // 2.1 There is no record of adding points before, execute specific addition
            if (score > 0) {
                // Record adding points
                RedisClient.hSet(userActionKey, field, score);
                // Personal user operation record, valid for one month, convenient for users to query their recent 31 days of activity
                RedisClient.expire(userActionKey, 31 * DateUtil.ONE_DAY_SECONDS);

                // Update today's and this month's activity rankings
                Double newAns = RedisClient.zIncrBy(todayRankKey, String.valueOf(userId), score);
                RedisClient.zIncrBy(monthRankKey, String.valueOf(userId), score);
                if (log.isDebugEnabled()) {
                    log.info("Activity score update! key#field = {}#{}, add = {}, newScore = {}", todayRankKey, userId, score, newAns);
                }
                if (newAns <= score) {
                    // Since only daily/monthly activity increases are implemented above, but no corresponding expiration period is set; in order to avoid high redis usage caused by persistent storage, here the expiration period is set
                    // Daily activity rankings, save for 31 days; Monthly activity rankings, save for 1 year
                    // Why is it newAns <= score to set the expiration period?
                    // Because newAns is the user's activity of the day, if it is found equal to the activity to be added score, it means that it is the first time to add a record today, so setting the expiration period at this time is more in line with expectations
                    // But please note that there are two defects in the implementation below:
                    //  1. For the validity period of the month, it becomes this month, and the expiration period is recalculated every time the activity score is added for the first time each day, which is inconsistent with the setting of the expiration period when the cache is first added
                    //  2. If you first add 1 activity score, then subtract 1, and then add 1 activity score again, it will also cause the expiration period to be recalculated
                    // A more rigorous approach would be to first judge the ttl of the key, and set the expiration period only for those that have not been set, as follows
                    Long ttl = RedisClient.ttl(todayRankKey);
                    if (!NumUtil.upZero(ttl)) {
                        RedisClient.expire(todayRankKey, 31 * DateUtil.ONE_DAY_SECONDS);
                    }
                    ttl = RedisClient.ttl(monthRankKey);
                    if (!NumUtil.upZero(ttl)) {
                        RedisClient.expire(monthRankKey, 12 * DateUtil.ONE_MONTH_SECONDS);
                    }
                }
            }
        } else if (ans > 0) {
            // 2.2 Points have been added before, so this time subtracting points can be executed
            if (score < 0) {
                // Remove the user's activity execution record --> that is, remove the idempotent key used to prevent duplicate addition of activity score
                Boolean oldHave = RedisClient.hDel(userActionKey, field);
                if (BooleanUtils.isTrue(oldHave)) {
                    Double newAns = RedisClient.zIncrBy(todayRankKey, String.valueOf(userId), score);
                    RedisClient.zIncrBy(monthRankKey, String.valueOf(userId), score);
                    if (log.isDebugEnabled()) {
                        log.info("Activity score update deduction! key#field = {}#{}, add = {}, newScore = {}", todayRankKey, userId, score, newAns);
                    }
                }
            }
        }
    }
```

Về cơ bản là sau khi logic nghiệp vụ phía trước đã được làm rõ, việc xem lại triển khai ở trên không có gì quá khó khăn, nhưng hãy lưu ý rằng, triển khai toàn bộ ở trên có mạch lạc không?

> 1. Vấn đề giao dịch: Do có nhiều thao tác redis lặp lại, vấn đề giao dịch tồn tại
> 2. Vấn đề đồng thời: Không có xử lý song song, tính chất đa chiều không thể hoạt động 100%, vẫn có thể xảy ra tình huống thêm/xoá điểm hoạt động trùng lặp

Trên đây đã nêu ra hai vấn đề, đó là điều chúng ta cần cân nhắc quan trọng khi thực hiện bảng xếp hạng thực tế, ở đây chúng ta không mở rộng, chỉ nêu ra một số điểm kiến thức chính (xử lý song song bằng cách sử dụng khóa, giao dịch được bảo đảm thông qua tính nhất quán cuối cùng).

#### 1.4. Kích hoạt hoạt động cập nhật xếp hạng

Ở trên chỉ cung cấp một phương thức tăng mức độ hoạt động, nhưng khi nào gọi nó? Ở đây, chúng ta sử dụng cách thức Event/Listener đã triển khai trước đó để xử lý cập nhật xếp hạng hoạt động.

- Lắng nghe sự kiện hoạt động liên quan đến bài viết/người dùng và cập nhật mức độ hoạt động tương ứng trong lớp `UserActivityListener`.

```java
@EventListener(classes = NotifyMsgEvent.class)
    @Async
    public void notifyMsgListener(NotifyMsgEvent msgEvent) {
        switch (msgEvent.getNotifyType()) {
            case COMMENT:
            case REPLY:
                CommentDO comment = (CommentDO) msgEvent.getContent();
                userActivityRankService.addActivityScore(ReqInfoContext.getReqInfo().getUserId(), new ActivityScoreBo().setRate(true).setArticleId(comment.getArticleId()));
                break;
            case COLLECT:
                UserFootDO foot = (UserFootDO) msgEvent.getContent();
                userActivityRankService.addActivityScore(ReqInfoContext.getReqInfo().getUserId(), new ActivityScoreBo().setCollect(true).setArticleId(foot.getDocumentId()));
                break;
            case CANCEL_COLLECT:
                foot = (UserFootDO) msgEvent.getContent();
                userActivityRankService.addActivityScore(ReqInfoContext.getReqInfo().getUserId(), new ActivityScoreBo().setCollect(false).setArticleId(foot.getDocumentId()));
                break;
            case PRAISE:
                foot = (UserFootDO) msgEvent.getContent();
                userActivityRankService.addActivityScore(ReqInfoContext.getReqInfo().getUserId(), new ActivityScoreBo().setPraise(true).setArticleId(foot.getDocumentId()));
                break;
            case CANCEL_PRAISE:
                foot = (UserFootDO) msgEvent.getContent();
                userActivityRankService.addActivityScore(ReqInfoContext.getReqInfo().getUserId(), new ActivityScoreBo().setPraise(false).setArticleId(foot.getDocumentId()));
                break;
            case FOLLOW:
                UserRelationDO relation = (UserRelationDO) msgEvent.getContent();
                userActivityRankService.addActivityScore(ReqInfoContext.getReqInfo().getUserId(), new ActivityScoreBo().setFollow(true).setArticleId(relation.getUserId()));
                break;
            case CANCEL_FOLLOW:
                relation = (UserRelationDO) msgEvent.getContent();
                userActivityRankService.addActivityScore(ReqInfoContext.getReqInfo().getUserId(), new ActivityScoreBo().setFollow(false).setArticleId(relation.getUserId()));
                break;
            default:
        }
    }
```

- Sự kiện xuất bản bài viết (``UserActivityListener``)

```java
@Async  
@EventListener(ArticleMsgEvent.class)  
public void publishArticleListener(ArticleMsgEvent<ArticleDO> event) {  
    ArticleEventEnum type = event.getType();  
    if (type == ArticleEventEnum.ONLINE) {  
        userActivityRankService.addActivityScore(ReqInfoContext.getReqInfo().getUserId(), new ActivityScoreBo().setPublishArticle(true).setArticleId(event.getContent().getId()));  
    }}
```

Tiếp theo là cập nhật xếp hạng hoạt động dựa trên hành vi duyệt web của người dùng, điều này có thể triển khai ở cấp độ Filter/Interceptor trong `GlobalViewInterceptor`.

```java
@Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (handler instanceof HandlerMethod) {
            HandlerMethod handlerMethod = (HandlerMethod) handler;
            Permission permission = handlerMethod.getMethod().getAnnotation(Permission.class);
            if (permission == null) {
                permission = handlerMethod.getBeanType().getAnnotation(Permission.class);
            }

            if (permission == null || permission.role() == UserRole.ALL) {
                if (ReqInfoContext.getReqInfo() != null) {
                    // Update user activity
                    SpringUtil.getBean(UserActivityRankService.class).addActivityScore(ReqInfoContext.getReqInfo().getUserId(), new ActivityScoreBo().setPath(ReqInfoContext.getReqInfo().getPath()));
                }
                return true;
            }

    ...
```

### 2. Truy vấn bảng xếp hạng

Trong triển khai trước đó, dữ liệu của chúng ta đã lưu trữ một bảng xếp hạng hoàn chỉnh, tiếp theo là hiển thị bảng xếp hạng này cho người dùng xem.

Luồng cơ bản như sau:

1. Lấy topN người dùng + điểm số từ redis.
2. Truy vấn thông tin của người dùng.
3. Sắp xếp theo điểm số của người dùng và cập nhật thứ hạng của mỗi người dùng.

```java
@Override  
public List<RankItemDTO> queryRankList(ActivityRankTimeEnum time, int size) {  
    String rankKey = time == ActivityRankTimeEnum.DAY ? todayRankKey() : monthRankKey();  
    // 1. Get the top N active users  
    List<ImmutablePair<String, Double>> rankList = RedisClient.zTopNScore(rankKey, size);  
    if (CollectionUtils.isEmpty(rankList)) {  
        return Collections.emptyList();  
    }  
    // 2. Query basic information of users  
    // Build userId -> active score map mapping for supplementing user information    Map<Long, Integer> userScoreMap = rankList.stream().collect(Collectors.toMap(s -> Long.valueOf(s.getLeft()), s -> s.getRight().intValue()));  
    List<SimpleUserInfoDTO> users = userService.batchQuerySimpleUserInfo(userScoreMap.keySet());  
  
    // 3. Sort by score  
    List<RankItemDTO> rank = users.stream()  
            .map(user -> new RankItemDTO().setUser(user).setScore(userScoreMap.getOrDefault(user.getUserId(), 0)))  
            .sorted((o1, o2) -> Integer.compare(o2.getScore(), o1.getScore()))  
            .collect(Collectors.toList());  
  
    // 4. Supplement the ranking of each user  
    IntStream.range(0, rank.size()).forEach(i -> rank.get(i).setRank(i + 1));  
    return rank;  
}
```

Triển khai chính của redis như sau, sử dụng `zRangeWithScores` trực tiếp để lấy người dùng + điểm số ở thứ hạng được chỉ định, cách viết cho topN như sau:

```java
    public static List<ImmutablePair<String, Double>> zTopNScore(String key, int n) {
        return template.execute(new RedisCallback<List<ImmutablePair<String, Double>>>() {
            @Override
            public List<ImmutablePair<String, Double>> doInRedis(RedisConnection connection) throws DataAccessException {
                Set<RedisZSetCommands.Tuple> set = connection.zRangeWithScores(keyBytes(key), -n, -1);
                if (set == null) {
                    return Collections.emptyList();
                }
                return set.stream()
                        .map(tuple -> ImmutablePair.of(toObj(tuple.getValue(), String.class), tuple.getScore()))
                        .sorted((o1, o2) -> Double.compare(o2.getRight(), o1.getRight())).collect(Collectors.toList());
            }
        });
    }
```

### 3. Tổng kết

Dựa trên điều này, chức năng bảng xếp hạng của backend đã được triển khai hoàn toàn; còn về việc hiển thị phía frontend, chi tiết của giao tiếp giữa frontend và backend, chúng tôi sẽ không đi sâu vào ở đây; tổng thể, chúng tôi đã cung cấp một thiết kế và triển khai toàn bộ quy trình cơ bản, dễ sử dụng cho bảng xếp hạng.

Khi dự án của chúng ta lớn đủ và số lượng người dùng cũng lớn, vẫn còn nhiều điểm cần phải hoàn thiện:

- Làm thế nào để ngăn chặn tấn công giả mạo?
- Làm thế nào để tránh vấn đề đồng thời?
- Làm thế nào để tránh vấn đề giao dịch do các hoạt động redis không nguyên tử?
- Làm thế nào để thực hiện kiểm tra hiệu suất?
- Khi dữ liệu lớn, có giải pháp nào để giảm áp lực lưu trữ từ các bản ghi hoạt động của người dùng?
