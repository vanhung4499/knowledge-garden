---
title: CF Redis Whitelist Impl
tags:
  - project
  - codeforum
categories: 
date created: 2024-04-16
date modified: 2024-04-16
---

# Technical Redis Triển khai whitelist

Thông qua kỹ thuật đang sử dụng để đăng bài, bạn đã chú ý rằng bài viết sẽ được kiểm duyệt trước khi xuất hiện trên trang web. Vậy liệu tất cả các tác giả đều cần phải được kiểm duyệt trước khi đăng bài không?

Câu trả lời tất nhiên là không. Chúng tôi đã tạo ra một whitelist, trong đó các người dùng được phép đăng bài mà không cần phải qua kiểm duyệt, và có thể xuất hiện trực tiếp trên trang web.

Khi thấy điều này, tự nhiên sẽ có một số câu hỏi:

**Tại sao cần phải kiểm duyệt?**

Hầu hết các bài viết của các tác giả là đáng được mọi người đánh giá cao, nhưng cũng có nhiều người chỉ đơn giản là muốn trải nghiệm quá trình đăng bài trên dự án kỹ thuật này, nên nội dung của bài viết có thể chỉ là nội dung kiểm tra. Nếu không qua kiểm duyệt mà đưa trực tiếp lên trang web, điều này sẽ dẫn đến sự giảm chất lượng của toàn bộ cộng đồng bài viết.

Thứ hai, một cộng đồng bài viết bình thường, việc kiểm duyệt là một tiêu chuẩn; đây còn liên quan đến nhiều điểm kiến thức liên quan, làm sao chúng ta có thể bỏ qua được nhỉ O(∩_∩)O~

**Làm sao để triển khai whitelist?**

Có nhiều cách để thêm tác giả vào whitelist:

- Ghi cứng vào tập tin cấu hình (tương tự như mã cứng)
	- Ưu điểm: Đơn giản
	- Nhược điểm: Không linh hoạt, mỗi lần thay đổi đều cần chỉnh sửa mã nguồn và phát hành lại, gần như không thích hợp cho các dự án thực tế  
- Cấu hình một bảng whitelist trong cơ sở dữ liệu
	- Ưu điểm: Linh hoạt, phù hợp
	- Nhược điểm: Triển khai phức tạp hơn một chút  
- Thực hiện whitelist dựa trên Redis set
	- Ưu điểm: Đơn giản, nhẹ nhàng
	- Nhược điểm: Phụ thuộc vào Redis

Trong dự án, whitelist được triển khai dựa trên Redis set. Bây giờ chúng ta sẽ xem chi tiết về chiến lược thực hiện này.

## Triển khai whitelist bằng Redis

Đối với việc sử dụng Redis để triển khai whitelist, cấu trúc dữ liệu dễ nhất để nghĩ đến là tập hợp (set). (Ngoài lề, về năm cấu trúc dữ liệu string, list, set, zset, hash của Redis, bạn có thể nghĩ ra bao nhiêu ứng dụng cho mỗi loại?)

### Kiến thức cơ bản về tập hợp (set)

Tiếp theo, chúng ta sẽ làm quen với các lệnh hoạt động liên quan đến tập hợp trong Redis:

**Thêm**

```bash
# Thêm nhiều thành viên vào tập hợp
sadd key val1 val2
```

**Số lượng thành viên trong tập hợp**

```bash
scard key
```

**Kiểm tra xem tập hợp có chứa phần tử không**

```bash
sismember key val
```

Trả về 1 nếu có, 0 nếu không.

**Trả về tất cả các thành viên của tập hợp**

```bash
smembers key
```

**Xóa một thành viên từ tập hợp**

```bash
srem key val
```

**Xóa một thành viên ngẫu nhiên từ tập hợp**

```bash
spop key
```

**Trả về một hoặc nhiều thành viên ngẫu nhiên từ tập hợp**

```bash
srandmember key count
```

Một ví dụ đơn giản được minh họa dưới đây:

![](https://files.mdnice.com/user/6227/e808bfc6-5d55-4d33-9ef9-a15d3942ef59.png#id=lGfDI&originHeight=488&originWidth=377&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

---

Ngoài các thao tác cơ bản đã nêu trên, tập hợp còn hỗ trợ các phép toán giữa nhiều tập hợp:

**Trả về sự khác biệt giữa tập hợp đầu tiên và các tập hợp khác**

```bash
sdiff key1 key2 key3...
```

**Trả về tất cả các thành viên của các tập hợp đã cho và lưu vào tập hợp đích**

```bash
sdiffstore destination key1 key2 key3...
```

**Trả về phần giao của các tập hợp đã cho**

```bash
sinter key1 key2
```

**Trả về phần giao của các tập hợp đã cho và lưu vào tập hợp đích**

```bash
sinterstore destination key1 key2...
```

**Trả về phần hợp của tất cả các tập hợp đã cho**

```bash
sunion key1 key2...
```

**Trả về phần hợp của tất cả các tập hợp đã cho và lưu vào tập hợp đích**

```bash
sunionstore destination key1 key2...
```

![](https://files.mdnice.com/user/6227/fcbbd7ba-8afb-406d-b3dc-3e4560400317.png#id=WAcA9&originHeight=730&originWidth=581&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### Các Thao Tác RedisTemplate

Trong dự án Spring, việc sử dụng RedisTemplate để thực hiện các thao tác với tập hợp cũng rất đơn giản.

**Thêm mới**

```java
/**
 * Thêm một giá trị mới vào tập hợp (sadd)
 *
 * @param key
 * @param value
 */
public void add(String key, String value) {
    redisTemplate.opsForSet().add(key, value);
}
```

**Xóa**

```java
/**
 * Xóa một giá trị khỏi tập hợp (srem)
 *
 * @param key
 * @param value
 */
public void remove(String key, String value) {
    redisTemplate.opsForSet().remove(key, value);
}
```

**Kiểm tra tồn tại**

```java
/**
 * Kiểm tra xem giá trị có trong tập hợp không (sismember)
 *
 * @param key
 * @param value
 */
public void contains(String key, String value) {
    redisTemplate.opsForSet().isMember(key, value);
}
```

**Lấy tất cả các giá trị**

```java
/**
 * Lấy tất cả các giá trị trong tập hợp (smembers)
 *
 * @param key
 * @return
 */
public Set<String> values(String key) {
    return redisTemplate.opsForSet().members(key);
}
```

**Phép toán trên tập hợp**

```java
/**
 * Trả về tập hợp hợp của nhiều tập hợp (sunion)
 *
 * @param key1
 * @param key2
 * @return
 */
public Set<String> union(String key1, String key2) {
    return redisTemplate.opsForSet().union(key1, key2);
}

/**
 * Trả về tập hợp giao của nhiều tập hợp (sinter)
 *
 * @param key1
 * @param key2
 * @return
 */
public Set<String> intersect(String key1, String key2) {
    return redisTemplate.opsForSet().intersect(key1, key2);
}

/**
 * Trả về tập hợp khác của key1 mà không có trong key2 (sdiff)
 *
 * @param key1
 * @param key2
 * @return
 */
public Set<String> diff(String key1, String key2) {
    return redisTemplate.opsForSet().difference(key1, key2);
}
```

### Ví dụ sử dụng whitelist

Các hoạt động liên quan đến whitelist được đóng gói trong `AuthorWhiteListService`:

```java
public interface AuthorWhiteListService {

    /**
     * Checks if the author is in the white list for article publication.
     * This white list is mainly used to control whether authors need to be reviewed after publishing articles.
     *
     * @param authorId the ID of the author
     * @return true if the author is in the white list, false otherwise
     */
    boolean authorInArticleWhiteList(Long authorId);

    /**
     * Retrieves all users in the article white list.
     *
     * @return a list of users in the article white list
     */
    List<BaseUserInfoDTO> queryAllArticleWhiteListAuthors();

    /**
     * Adds a user to the article white list.
     *
     * @param userId the ID of the user to be added to the white list
     */
    void addAuthorToArticleWhiteList(Long userId);

    /**
     * Removes a user from the article white list.
     *
     * @param userId the ID of the user to be removed from the white list
     */
    void removeAuthorFromArticleWhiteList(Long userId);
}
```

Trong đó, chức năng chính là phương thức đầu tiên, kiểm tra xem tác giả có trong whitelist không; ba phương thức còn lại được sử dụng để bảo trì whitelist từ phía quản trị viên sau. Triển khai cụ thể như sau:

```java
@Service
public class AuthorWhiteListServiceImpl implements AuthorWhiteListService {
    /**
     * Use Redis set to store the white list of users allowed to publish articles directly.
     */
    private static final String ARTICLE_WHITE_LIST = "auth_article_white_list";

    @Autowired
    private UserService userService;

    /**
     * Checks if the author is in the article white list.
     *
     * @param authorId The ID of the author
     * @return true if the author is in the white list, otherwise false
     */
    @Override
    public boolean authorInArticleWhiteList(Long authorId) {
        return RedisClient.sIsMember(ARTICLE_WHITE_LIST, authorId);
    }

	...
```

Chúng tôi đã đóng gói thao tác cho Set một cách thống nhất, tương tự như những gì đã được giới thiệu ở trên, nhưng ở đây chúng tôi chọn một chiến lược triển khai khác.

```java
    /**
     * Check if value is in the set
     *
     * @param key
     * @param value
     * @return
     */
    public static <T> Boolean sIsMember(String key, T value) {
        return template.execute(new RedisCallback<Boolean>() {
            @Override
            public Boolean doInRedis(RedisConnection connection) throws DataAccessException {
                return connection.sIsMember(keyBytes(key), valBytes(value));
            }
        });
    }
```

Các phương thức chính được đóng gói, mọi người cũng có thể trực tiếp lấy từ mã nguồn

Các phương thức chính được đóng gói, mọi người cũng có thể trực tiếp lấy từ mã nguồn

> com.hnv99.forum.core.cache.RedisClient#sIsMember

```java
/**
 * Kiểm tra xem giá trị có trong set hay không
 *
 * @param key
 * @param value
 * @return
 */
public static <T> Boolean sIsMember(String key, T value) {
    return template.execute(new RedisCallback<Boolean>() {
        @Override
        public Boolean doInRedis(RedisConnection connection) throws DataAccessException {
            return connection.sIsMember(keyBytes(key), valBytes(value));
        }
    });
}

/**
 * Lấy tất cả nội dung trong set
 *
 * @param key
 * @param clz
 * @param <T>
 * @return
 */
public static <T> Set<T> sGetAll(String key, Class<T> clz) {
    return template.execute(new RedisCallback<Set<T>>() {
        @Override
        public Set<T> doInRedis(RedisConnection connection) throws DataAccessException {
            Set<byte[]> set = connection.sMembers(keyBytes(key));
            if (CollectionUtils.isEmpty(set)) {
                return Collections.emptySet();
            }
            return set.stream().map(s -> toObj(s, clz)).collect(Collectors.toSet());
        }
    });
}

/**
 * Thêm nội dung vào set
 *
 * @param key
 * @param val
 * @param <T>
 * @return
 */
public static <T> boolean sPut(String key, T val) {
    return template.execute(new RedisCallback<Long>() {
        @Override
        public Long doInRedis(RedisConnection connection) throws DataAccessException {
            return connection.sAdd(keyBytes(key), valBytes(val));
        }
    }) > 0;
}

/**
 * Xóa nội dung khỏi set
 *
 * @param key
 * @param val
 * @param <T>
 */
public static <T> void sDel(String key, T val) {
    template.execute(new RedisCallback<Void>() {
        @Override
        public Void doInRedis(RedisConnection connection) throws DataAccessException {
            connection.sRem(keyBytes(key), valBytes(val));
            return null;
        }
    });
}

```

Tiếp theo, chúng ta sẽ xem xét cụ thể các trường hợp sử dụng, trong core service của bài viết.

```java
    /**
     * Articles published by users not on the whitelist need to be reviewed first
     *
     * @param article
     * @return
     */
    private boolean needToReview(ArticleDO article) {
        // Add the admin user to the whitelist
        BaseUserInfoDTO user = ReqInfoContext.getReqInfo().getUser();
        if (user.getRole() != null && user.getRole().equalsIgnoreCase(UserRole.ADMIN.name())) {
            return false;
        }
        return article.getStatus() == PushStatusEnum.ONLINE.getCode() && !articleWhiteListService.authorInArticleWhiteList(article.getUserId());
    }

```

- Đối với người dùng không có trong whitelist, nếu họ thực hiện hoạt động trên bài viết, họ sẽ cần phải được duyệt.

Ví dụ: Đăng bài viết

```java
    private Long insertArticle(ArticleDO article, String content, Set<Long> tags) {
        // Data changes for three tables: article, article_detail, and tag.
        if (needToReview(article)) {
            // Articles published by authors not on the whitelist need to be reviewed.
            article.setStatus(PushStatusEnum.REVIEW.getCode());
        }

        ...
```

Ví dụ: Cập nhật một bài viết

```java
    private Long updateArticle(ArticleDO article, String content, Set<Long> tags) {
        // FIXME: Support for article version history needs to be supplemented: If the article is under review, update the previous record directly; otherwise, insert a new record.
        boolean review = article.getStatus().equals(PushStatusEnum.REVIEW.getCode());
        if (needToReview(article)) {
            article.setStatus(PushStatusEnum.REVIEW.getCode());
        }
        // Update the article.
        article.setUpdateTime(new Date());
        articleDao.updateById(article);
    ...
```

---

Đó là các tình huống sử dụng whitelist, tất nhiên đối với quản trị viên, còn có lối vào để thao tác trên whitelist, tất cả được tập hợp trong `ArticleWhiteListContoller`.

## Tổng kết

Nội dung tổng thể của bài viết này khá đơn giản, điểm suy nghĩ cốt lõi là dựa trên tình huống sử dụng whitelist, giới thiệu cách sử dụng cụ thể của Redis trong cấu trúc set.  

Thường thì, việc hiểu rõ năm cấu trúc dữ liệu cơ bản của Redis là một kiến thức bắt buộc; nhưng từ kinh nghiệm phỏng vấn của tôi trong thời gian vừa qua với hơn ba chữ số, khoảng 80% trở lên mọi người không thể tìm ra một ứng dụng thích hợp cho mỗi cấu trúc dữ liệu, thật sự làm tôi bất ngờ một chút; chỉ có kiến thức lý thuyết không đủ, quan trọng là phải kết hợp với các tình huống thực tế để lựa chọn, từ đó mới có thể làm sâu hơn vốn kiến thức của bạn.
