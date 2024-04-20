---
title: CF Guava Cache
tags:
  - project
  - codeforum
categories: 
date created: 2024-04-17
date modified: 2024-04-17
---

# Tích hợp Guava local cache

Bài viết này giới thiệu với mọi người cách mà codeforum tích hợp bộ nhớ local cache Guava. Đáng lưu ý, các ứng dụng internet thường thích đạt được độ phân tán cao và khả năng sẵn có cao, vì vậy, vị trí của bộ nhớ cache có thể nói là quan trọng, giúp cải thiện hiệu suất của chương trình đáng kể.

Codeforum là một dự án Spring Boot, và Spring Boot cũng cung cấp nhiều giải pháp công nghệ để hỗ trợ cache, các giải pháp phổ biến bao gồm:

1. Redis: Một hệ thống cache phân tán dựa trên mạng, có thể hỗ trợ lưu trữ dữ liệu và triển khai phân tán, phù hợp với cache dữ liệu lớn, đồng thời cung cấp các loại dữ liệu phức tạp và chiến lược cache phong phú, chẳng hạn như hỗ trợ thuật toán loại bỏ LRU (Least Recently Used, ưu tiên loại bỏ dữ liệu được sử dụng ít nhất gần đây nhất), LFU (Least Frequently Used, ưu tiên loại bỏ dữ liệu cache ít sử dụng nhất) và các thuật toán loại bỏ khác. Tuy nhiên, do Redis dựa trên giao tiếp mạng, nên có một vài độ trễ mạng so với bộ nhớ local cache.
2. Guava Cache: Cũng chính là đối tượng chính của bài viết này, một thư viện local cache nhẹ, cung cấp nhiều chiến lược cache, bao gồm chiến lược thu hồi dựa trên kích thước, thời gian và tham chiếu. Dữ liệu được lưu trữ trong bộ nhớ ứng dụng, vì vậy tốc độ đọc/ghi rất nhanh, phù hợp với các tình huống đọc nhiều ghi ít, và có số lượng truy cập cực lớn.
3. Caffeine: Một thư viện local cache hiệu suất cao dựa trên Java 8, có thể được sử dụng như là một lựa chọn thay thế cho Guava Cache.

Trong dự án, ba giải pháp cache này đều được sử dụng.

## Giới thiệu Guava

Guava là một thư viện công cụ Java mã nguồn mở của Google, cung cấp một số tính năng mà JDK không có hoặc tăng cường JDK, bao gồm:

- com.google.common.collect: Bộ công cụ tập hợp, cung cấp nhiều loại tập hợp và phương thức thao tác tập hợp mà JDK không có.
- com.google.common.io: Bộ công cụ I/O, cung cấp nhiều lớp và phương thức thao tác I/O hữu ích.
- com.google.common.cache: Bộ công cụ cache, cung cấp một triển khai cache địa phương hiệu suất cao.
- com.google.common.math: Bộ công cụ toán học, cung cấp nhiều phương thức tính toán và toán học hữu ích.
- com.google.common.eventbus: Bộ công cụ event bus, cung cấp chức năng xuất bản và đăng ký sự kiện dựa trên mô hình quan sát viên.
- com.google.common.reflect: Bộ công cụ phản ánh, cung cấp API phản ánh tốt hơn.
- com.google.common.util.concurrent: Bộ công cụ đồng thời, cung cấp nhiều lớp công cụ và phương thức đồng thời hữu ích mà JDK không có.

Có thể thấy Guava rất mạnh mẽ, và Cache chỉ là một phần trong số đó.

Vậy làm thế nào để tích hợp Guava Cache vào ứng dụng Spring Boot? Trong phiên bản ban đầu của Spring Boot, có hai cách để làm điều này, một cách là sử dụng GuavaCacheManager, một cách là sử dụng CacheBuilder.

## Sử dụng GuavaCacheManager

Trong các phiên bản ban đầu của Spring Boot, việc tích hợp Bộ nhớ đệm Guava rất đơn giản, vì Spring đã định nghĩa interface CacheManager để thống nhất các công nghệ bộ nhớ đệm khác nhau như Guava, Redis, Caffeine.

- GuavaCacheManager: Sử dụng Guava làm công nghệ bộ nhớ đệm
- RedisCacheManager: Sử dụng Redis làm công nghệ bộ nhớ đệm
- CaffeineCacheManager: Sử dụng Caffeine làm công nghệ bộ nhớ đệm
- ConcurrentMapCacheManager: Triển khai bộ nhớ đệm mặc định của Spring Boot

Chúng ta tập trung vào GuavaCacheManager, nó cung cấp một cách quản lý bộ nhớ đệm dựa trên chú thích, thông qua việc thêm các chú thích như @Cacheable, @CachePut, @CacheEvict vào các phương thức, để bộ nhớ đệm kết quả trả về từ phương thức.

- @Cacheable: Trước khi phương thức được thực thi, Spring sẽ kiểm tra xem dữ liệu bộ nhớ đệm với cùng một khóa đã tồn tại chưa. Nếu có, nó sẽ trả về dữ liệu bộ nhớ đệm trực tiếp. Nếu không, nó sẽ thực thi phương thức và lưu kết quả trả về vào bộ nhớ đệm.
- @CachePut: Dù dữ liệu bộ nhớ đệm với cùng một khóa đã tồn tại hay không, phương thức vẫn được thực thi và kết quả trả về được lưu vào bộ nhớ đệm, được sử dụng để cập nhật dữ liệu bộ nhớ đệm.
- @CacheEvict: Dùng để xóa dữ liệu bộ nhớ đệm của khóa đã chỉ định.

Tuy nhiên, phiên bản Spring Boot 2.7.1 đã loại bỏ GuavaCacheManager và thay thế bằng CaffeineCacheManager.

Tóm lại, nếu chúng ta muốn tiếp tục sử dụng Guava Cache, chúng ta cần sử dụng CacheBuilder. Tiếp theo, chúng ta sẽ tìm hiểu cách sử dụng nó, nói ít làm nhiều(😂).

## Sử dụng CacheBuilder

### 1) Thêm phụ thuộc vào pom.xml

Người ta thường thêm phụ thuộc này vào tập tin pom.xml của vanhung4499-core.

```xml
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
</dependency>
```

### 2) Ví dụ minh họa

```java
// Tạo một đối tượng CacheBuilder
CacheBuilder<Object, Object> cacheBuilder = CacheBuilder.newBuilder()
        .maximumSize(100)  // Số lượng mục tối đa trong bộ nhớ đệm
        .expireAfterAccess(30, TimeUnit.MINUTES) // Thời gian mục trong bộ nhớ đệm sẽ hết hạn nếu không được truy cập trong khoảng thời gian nhất định
        .recordStats();  // Bật tính năng thống kê

// Xây dựng một đối tượng LoadingCache
LoadingCache<String, String> cache = cacheBuilder.build(new CacheLoader<String, String>() {
    @Override
    public String load(String key) throws Exception {
        return "Giá trị của：" + key; // Khi không có giá trị trong bộ nhớ đệm, tải giá trị tương ứng và trả về
    }
});

// Lưu vào bộ nhớ đệm
cache.put("hnv99", "Hung Nguyen");

// Lấy giá trị từ bộ nhớ đệm
// Đã lưu
System.out.println(cache.get("hnv99"));
// Chưa lưu
System.out.println(cache.get("codeforum"));

// In thông tin thống kê về bộ nhớ đệm
System.out.println(cache.stats());
```

CacheBuilder là một constructor trong Guava Cache dùng để xây dựng bộ nhớ đệm cục bộ. Thông qua CacheBuilder, bạn có thể cấu hình các thuộc tính của bộ nhớ đệm như số lượng mục tối đa, thời gian hết hạn của mục, thông báo khi một mục bị loại bỏ, v.v.

Dưới đây là một số phương thức phổ biến của CacheBuilder:

① `newBuilder()`

Phương thức này trả về một thể hiện của CacheBuilder để tạo một bộ nhớ đệm mới.

② `maximumSize(long maximumSize)`

Phương thức này dùng để đặt kích thước tối đa của bộ nhớ đệm, tính bằng số mục. Nếu số mục trong bộ nhớ đệm vượt quá kích thước tối đa, các chiến lược loại bỏ bộ nhớ đệm có thể được kích hoạt để giải phóng một số không gian bộ nhớ.

③ `expireAfterWrite(long duration, TimeUnit unit)`

Phương thức này dùng để đặt thời gian hết hạn của mỗi mục trong bộ nhớ đệm. Sau khoảng thời gian đã đặt, mỗi mục sẽ được tự động xóa khỏi bộ nhớ đệm.

④ `expireAfterAccess(long duration, TimeUnit unit)`

Phương thức này tương tự như `expireAfterWrite`, nhưng thời gian hết hạn được tính từ lần truy cập cuối cùng vào mỗi mục trong bộ nhớ đệm.

⑤ `stats()`

Phương thức này dùng để bật chế độ thống kê của bộ nhớ đệm, giúp theo dõi cách bộ nhớ đệm được sử dụng.

⑥ `build()`

Phương thức này dùng để tạo và trả về một thể hiện mới của bộ nhớ đệm. Trước khi gọi phương thức này, bạn cần cấu hình các thuộc tính khác của bộ nhớ đệm, chẳng hạn như kích thước tối đa, thời gian hết hạn, v.v.

LoadingCache là một loại Cache đặc biệt, khi giá trị của một khóa không tồn tại trong bộ nhớ cache, nó có thể được tải vào bộ nhớ cache thông qua CacheLoader và được thêm vào bộ nhớ cache. Giao diện LoadingCache định nghĩa nhiều phương thức hữu ích, dưới đây là một số phương thức chính:

- `get(K key)`: Lấy giá trị cache tương ứng với khóa được chỉ định. Nếu không có giá trị tương ứng với khóa trong cache, phương thức sẽ gọi phương thức load trong CacheLoader để tải giá trị vào cache. Nếu phương thức load trả về null, phương thức get cũng sẽ trả về null. Nếu phương thức load ném ra một ngoại lệ, phương thức get sẽ chuyển đổi nó thành ExecutionException và ném ra.
- `put(K key, V value)`: Đưa khóa và giá trị chỉ định vào cache. Nếu trước đó đã có giá trị tương ứng với khóa trong cache, giá trị cache trước đó sẽ bị ghi đè. Nếu giá trị là null, phương thức put sẽ ném ra ngoại lệ NullPointerException.
- `invalidate(K key)`: Làm cho giá trị cache tương ứng với khóa chỉ định không còn hiệu lực và loại bỏ giá trị đó khỏi cache.
- `invalidateAll()`: Làm cho tất cả các giá trị cache không còn hiệu lực và loại bỏ tất cả các giá trị cache.
- `size()`: Trả về số lượng cặp khóa-giá trị hiện tại trong cache.
- `stats()`: Trả về thông tin thống kê về cache, bao gồm tỷ lệ trúng cache, tỷ lệ tải thành công của cache, thời gian trung bình để tải cache, v.v.
- `ConcurrentMap<K, V> asMap()`: Trả về một ConcurrentMap an toàn đối với luồng.

CacheLoader là một giao diện trong thư viện Guava Cache, được sử dụng để tải giá trị vào cache khi cache không chứa khóa. Nó định nghĩa một phương thức load(K key), sẽ được gọi khi không có giá trị tương ứng với khóa trong cache, để lấy giá trị tương ứng với khóa đó và đưa vào cache.

- Trong phương thức load, bạn có thể thực hiện logic để tải giá trị cache từ nguồn dữ liệu.
- Phương thức load có thể ném ra ngoại lệ để biểu diễn trường hợp tải thất bại, chẳng hạn như lỗi truy cập nguồn dữ liệu.
- Khi sử dụng LoadingCache, thì việc triển khai trong phương thức load nên là idempotent, nghĩa là nhiều lần gọi sẽ trả về kết quả giống nhau.

Trong ví dụ trên, chúng ta đặt một cặp khóa-giá trị vào cache (hnv99, "Hung Nguyen"), sau đó sử dụng phương thức get để lấy ra từ cache, với khóa là "paicoding" không có trong cache, nên sẽ sử dụng CacheLoader để tải giá trị và trả về.

Cuối cùng, in thông tin thống kê về cache. Hãy xem kết quả.

```
Hung Nguyen
Giá trị của "codeforum": codeforum
CacheStats{hitCount=1, missCount=1, loadSuccessCount=1, loadExceptionCount=0, totalLoadTime=2132781, evictionCount=0}
```

Thỏa mãn kỳ vọng của chúng ta.

Có giá trị cho khóa "hnv99", không có giá trị cho khóa "codeforum", vì vậy số lần trúng (hitCount) là 1, số lần không trúng (missCount) là 1.

### 3) Guava Cache trong lập trình hướng kỹ thuật

Hiện tại, trong lập trình hướng kỹ thuật, có tất cả ba nơi đang sử dụng Guava Cache. Tôi sẽ giải thích mỗi nơi một cách đầy đủ và tương ứng với từng tình huống nghiệp vụ cụ thể để giúp mọi người hiểu rõ hơn.

#### Nơi đầu tiên là việc lấy danh mục (trong lớp `CategoryServiceImpl`)

Tránh việc truy vấn từ cơ sở dữ liệu mỗi lần. Logic rất đơn giản, chỉ cần thêm một bộ nhớ cache cho danh mục, với khóa là categoryId. Nếu không có trong bộ nhớ cache, thì truy vấn từ DB, cuối cùng trả về một đối tượng chứa ID danh mục, tên danh mục và thứ tự sắp xếp danh mục.

Phù hợp với tình huống nghiệp vụ như khi trang chủ hiển thị danh mục.

Trong lớp **CategoryServiceImpl**, chúng ta chủ yếu sử dụng CacheBuilder, CacheLoader và LoadingCache của Guava Cache, như đã đề cập trước đó, tôi sẽ không đi sâu vào nữa, hãy xem mã nguồn.

①, Sử dụng CacheBuilder.newBuilder để xây dựng đối tượng LoadingCache.

```java
private LoadingCache<Long, CategoryDTO> categoryCaches;

@PostConstruct // Chú thích phương thức này sẽ được thực hiện sau khi Bean được khởi tạo
public void init() {
    categoryCaches = CacheBuilder.newBuilder().maximumSize(300).build(new CacheLoader<Long, CategoryDTO>() {
        @Override
        public CategoryDTO load(@NotNull Long categoryId) throws Exception {
            // Lấy thông tin danh mục từ cơ sở dữ liệu
            CategoryDO category = categoryDao.getById(categoryId);
            if (category == null || category.getDeleted() == YesOrNoEnum.YES.getCode()) {
                // Nếu danh mục không tồn tại hoặc đã bị xóa, trả về đối tượng rỗng
                return CategoryDTO.EMPTY;
            }
            // Chuyển đổi thông tin danh mục thành đối tượng DTO và trả về
            return new CategoryDTO(categoryId, category.getCategoryName(), category.getRank());
        }
    });
}
```

②, Khi tải tất cả các danh mục, sẽ lấy từ bộ nhớ cache.

```java
public List<CategoryDTO> loadAllCategories() {
    // Nếu số lượng danh mục trong cache nhỏ hơn hoặc bằng 5, thì làm mới cache
    if (categoryCaches.size() <= 5) {
        refreshCache();
    }
    // Chuyển đổi các đối tượng CategoryDTO thành danh sách và loại bỏ các danh mục không hợp lệ (ID nhỏ hơn hoặc bằng 0), sau đó sắp xếp theo trường rank và trả về
    List<CategoryDTO> list = new ArrayList<>(categoryCaches.asMap().values());
    list.removeIf(s -> s.getCategoryId() <= 0);
    list.sort(Comparator.comparingLong(CategoryDTO::getRank));
    return list;
}
```

③, Làm mới cache, lấy danh mục từ DB, sau đó xóa bộ nhớ cache và đặt danh mục vào bộ nhớ cache theo ID danh mục:

```java
public void refreshCache() {
    // Lấy tất cả các đối tượng danh mục DO từ cơ sở dữ liệu
    List<CategoryDO> list = categoryDao.listAllCategoriesFromDb();
    // Xóa bộ nhớ cache
    categoryCaches.invalidateAll();
    categoryCaches.cleanUp();
    // Chuyển đổi các đối tượng danh mục DO thành đối tượng DTO và đặt vào bộ nhớ cache
    list.forEach(s -> categoryCaches.put(s.getId(), ArticleConverter.toDto(s)));
}
```

#### Nơi thứ hai là lớp UserSessionHelper

①, Phương thức genVerifyCode để tạo mã xác nhận

Khóa là mã xác nhận và giá trị là ID người dùng. Khi tạo mã xác nhận, mã xác nhận và ID người dùng sẽ được đặt vào bộ nhớ cache.

Phù hợp với tình huống nghiệp vụ là khi chúng ta đăng nhập tại tầng của đội kỹ thuật dựa trên người dùng WeChat sẽ tạo mã xác nhận.

```java
public String genVerifyCode(Long userId) {
    int cnt = 0;
    while (true) {
        // Tạo mã xác nhận
        String code = CodeGenerateUtil.genCode(cnt++);
        // Kiểm tra xem mã xác nhận đã có trong bộ nhớ cache chưa
        if (codeUserIdCache.getIfPresent(code) != null) {
            // Nếu có, tiếp tục tạo mã xác nhận mới
            continue;
        }
        // Nếu không, đặt mã xác nhận và ID người dùng vào bộ nhớ cache
        codeUserIdCache.put(code, userId);
        // Trả về mã xác nhận đã tạo
        return code;
    }
}
```

Cụ thể, mã đầu tiên định nghĩa một bộ đếm cnt và bắt đầu một vòng lặp while. Trong vòng lặp này, mã xác nhận được tạo bằng cách gọi phương thức `CodeGenerateUtil.genCode(cnt++)`. Sau đó, mã này sẽ được kiểm tra xem có trong bộ nhớ cache không thông qua `codeUserIdCache.getIfPresent(code)`. Nếu đã tồn tại, tiếp tục tạo mã mới. Nếu không, đặt mã xác nhận và ID người dùng vào bộ nhớ cache và trả về mã xác nhận đã tạo.

②, Khởi tạo codeUserIdCache như sau:

```java
@PostConstruct // Chú thích phương thức này sẽ được thực hiện sau khi Bean được khởi tạo
public void init() {
    // Tạo một đối tượng cache, hỗ trợ tối đa 300 người dùng đăng nhập, thời gian tồn tại trong cache là 5 phút
    // Lưu ý: Khi triển khai dịch vụ trên nhiều máy chủ, việc sử dụng bộ nhớ cache cục bộ sẽ gặp vấn đề, nên khuyến nghị sử dụng Redis hoặc Memcache v.v.
    codeUserIdCache = CacheBuilder.newBuilder().maximumSize(300).expireAfterWrite(5, TimeUnit.MINUTES).build(new CacheLoader<String, Long>() {
        @Override
        public Long load(String s) throws Exception {
            // Nếu không trúng cache, ném ra ngoại lệ để thông báo không trúng cache
            throw new NoVlaInGuavaException("not hit!");
        }
    });
}

```

③, Lấy ID người dùng từ mã xác nhận trong bộ nhớ cache:

```java
public Long getUserIdByCode(String code) {
    return codeUserIdCache.getIfPresent(code);
}

```

④, Nếu xác nhận mã thành công, loại bỏ mã xác nhận từ bộ nhớ cache:

```java
public String codeVerifySucceed(String code, Long userId) {
    // Tạo một ID phiên ngẫu nhiên
    String session = "s-" + UUID.randomUUID();
    // Đặt ID phiên và ID người dùng vào bộ nhớ cache Redis, và đặt thời gian hết hạn là SESSION_EXPIRE_TIME
    RedisClient.setStrWithExpire(session, String.valueOf(userId), SESSION_EXPIRE_TIME);
    // Loại bỏ mã xác nhận từ bộ nhớ cache codeUserIdCache, tránh việc sử dụng lại
    codeUserIdCache.invalidate(code);
    // Trả về ID phiên đã tạo
    return session;
}

```

#### Nơi thứ ba là lớp ImageServiceImpl.

Công việc tương ứng là khi chúng ta chỉnh sửa bài viết, nếu hình ảnh không phải từ trang web, sẽ được chuyển đổi thành liên kết để tránh việc hình ảnh ngoại tuyến bị giới hạn dẫn đến không thể sử dụng.

Caching kết quả chuyển đổi hình ảnh, tránh trường hợp một hình ảnh ngoại tuyến được chuyển đổi liên tục.

```java
private LoadingCache<String, String> imgReplaceCache = CacheBuilder.newBuilder().maximumSize(300).expireAfterWrite(5, TimeUnit.MINUTES).build(new CacheLoader<String, String>() {
    @Override
    public String load(String img) {
        try {
            // Lấy luồng đầu vào của hình ảnh bằng tên tệp
            InputStream stream = FileReadUtil.getStreamByFileName(img);
            // Phân tích URL hình ảnh, lấy đường dẫn và loại tệp từ đó
            URI uri = URI.create(img);
            String path = uri.getPath();
            int index = path.lastIndexOf(".");
            String fileType = null;
            if (index > 0) {
                fileType = path.substring(index + 1);
            }
            // Tải hình ảnh lên OSS và trả về URL trong OSS
            return ossUploader.upload(stream, fileType);
        } catch (Exception e) {
            log.error("Lỗi chuyển đổi hình ảnh từ ngoại tuyến! img:{}", img, e);
            return "";
        }
    }
});

```

## Tổng kết

Sử dụng bộ nhớ cache có thể tránh việc tính toán lặp lại, giảm thiểu tài nguyên hệ thống, và cải thiện tốc độ phản hồi của chương trình. Và Guava Cache, với thiết kế nhẹ nhàng, là một cách triển khai bộ nhớ cache đủ linh hoạt. Hy vọng mọi người có thể kết hợp mã nguồn của kỹ thuật phần và hiểu rõ hơn về phần này.
