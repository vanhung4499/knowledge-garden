---
title: CF Caffeine Cache
tags:
  - codeforum
  - project
categories: 
date created: 2024-04-17
date modified: 2024-04-17
---

# Tích hợp Caffeine local cache

Caffeine là một trong những thư viện bộ nhớ cache local phổ biến nhất hiện nay và được sử dụng rộng rãi trong các dự án thực tế. Nó có thể hiệu quả tăng cường throughput, QPS và giảm RT của dịch vụ.

Trong dự án, cũng sử dụng Caffeine làm bộ nhớ local cache, chủ yếu để lưu trữ thông tin sidebar, thông tin này thường ít thay đổi.

Chúng ta thường sử dụng `Caffeine` kết hợp với `@Cacheable` như sau:

```java
@Cacheable(value = "sidebarCache", key = "'sidebar_' + #param")
public SidebarDTO getSidebarInfo(String param) {
    // Logic để lấy thông tin sidebar từ nguồn dữ liệu
}
```

Dưới đây là cách chúng ta thường sử dụng cache trong dự án thực tế:

## Cấu hình

### Dependencies

Thêm các dependencies liên quan vào tập tin pom.xml:

```xml
<!-- caffeine cache usage -->
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
</dependency>
<!-- Spring's @Cacheable annotation related -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
```

### Bộ quản lý bộ đệm

Thêm một bộ quản lý bộ đệm tùy chỉnh vào trong lớp cấu hình `ForumCoreAutoConfig.java` bằng cách thêm đoạn mã sau:

```java
/**
 * Định nghĩa bộ quản lý bộ đệm, sử dụng kết hợp với @Cache của Spring
 *
 * @return
 */
@Bean("caffeineCacheManager")
public CacheManager cacheManager() {
    CaffeineCacheManager cacheManager = new CaffeineCacheManager();
    cacheManager.setCaffeine(Caffeine.newBuilder()
            // Thiết lập thời gian hết hạn, sau năm phút sẽ hết hạn
            .expireAfterWrite(5, TimeUnit.MINUTES)
            // Khởi tạo kích thước không gian bộ đệm
            .initialCapacity(100)
            // Số lượng tối đa các mục trong bộ đệm
            .maximumSize(200)
    );
    return cacheManager;
}
```

Xin lưu ý, ngoài cách cấu hình như trên, bạn cũng có thể thêm vào file `application.yml` bằng cách cấu hình như sau:

```yaml
# Chỉ định chiến lược bộ đệm mặc định toàn cầu
spring:
  cache:
    type: caffeine
    caffeine:
      spec: initialCapacity=10,maximumSize=200,expireAfterWrite=5m
```

Khi sử dụng cách cấu hình như trên, bạn có thể bỏ qua việc định nghĩa bean `CacheManager` ở trên.  

**Vậy tại sao các chuyên gia công nghệ không sử dụng cách cấu hình từ file như vậy?**

## Sử dụng

Sau khi cấu hình hoàn tất, bạn có thể tiến vào giai đoạn sử dụng.

### Thêm annotation @EnableCaching

Bước đầu tiên, bạn cần thêm annotation `@EnableCaching` vào điểm khởi đầu của dự án. Khi thiếu nó, các annotation bộ đệm sau này sẽ không có hiệu lực.

```java
@Slf4j  
@EnableAsync  
@EnableScheduling  
@EnableCaching  
@ServletComponentScan  
@SpringBootApplication  
public class QuickForumApplication implements WebMvcConfigurer, ApplicationRunner {  
    @Value("${server.port:8080}")  
    private Integer webPort;  
  
    @Resource  
    private GlobalViewInterceptor globalViewInterceptor;

...
```

### Ví dụ về Sử dụng Bộ đệm

Ở đây, chúng tôi chọn `SidebarService` để thêm vào bộ đệm, chủ yếu là vì giá trị của nó cao nhất, có thể giảm thiểu hiệu suất truy cập cơ sở dữ liệu một cách hiệu quả (bởi vì dữ liệu thanh bên thường được cấu hình từ phía máy chủ, ít thay đổi, và hầu hết thời gian không có sự thay đổi).

Trong trường hợp sử dụng thực tế như sau:

```java
/**
 * Sử dụng bộ đệm caffeine cục bộ để xử lý dữ liệu thanh bên ít thay đổi
 * <p>
 * cacheNames -> Tương tự như tiền tố của bộ đệm
 * key -> Biểu thức SpEL, có thể lấy từ tham số truyền vào để xây dựng khóa bộ đệm
 * cacheManager -> Bộ quản lý bộ đệm, nếu chỉ có một bộ đệm toàn cầu, có thể bỏ qua
 *
 * @return
 */
@Override
@Cacheable(key = "'homeSidebar'", cacheManager = "caffeineCacheManager", cacheNames = "home")
public List<SideBarDTO> queryHomeSidebarList() {
    List<SideBarDTO> list = new ArrayList<>();
    list.add(noticeSideBar());
    list.add(columnSideBar());
    list.add(hotArticles());
    return list;
}

@Override
@Cacheable(key = "'columnSidebar'", cacheManager = "caffeineCacheManager", cacheNames = "column")
public List<SideBarDTO> queryColumnSidebarList() {
    List<SideBarDTO> list = new ArrayList<>();
    list.add(subscribeSideBar());
    return list;
}

/**
 * Thiết lập bộ đệm theo chiều người dùng + bài viết
 *
 * @param author    id của tác giả bài viết
 * @param articleId id của bài viết
 * @return
 */
@Override
@Cacheable(key = "'sideBar_' + #articleId", cacheManager = "caffeineCacheManager", cacheNames = "article")
public List<SideBarDTO> queryArticleDetailSidebarList(Long author, Long articleId) {
    List<SideBarDTO> list = new ArrayList<>(2);
    // Không thể gọi pdfSideBar() trực tiếp, sẽ làm cho bộ đệm không hoạt động
    list.add(SpringUtil.getBean(SidebarServiceImpl.class).pdfSideBar());
    list.add(recommendByAuthor(author, articleId, PageParam.DEFAULT_PAGE_SIZE));
    return list;
}

/**
 * Tài nguyên PDF chất lượng cao
 *
 * @return
 */
@Cacheable(key = "'sideBar'", cacheManager = "caffeineCacheManager", cacheNames = "article")
public SideBarDTO pdfSideBar() {
    List<ConfigDTO> pdfList = configService.getConfigList(ConfigTypeEnum.PDF);
    List<SideBarItemDTO> items = new ArrayList<>(pdfList.size());
    .... 
}

```

**Lưu ý 1**  

Chú ý đặc biệt đến annotation bộ đệm `@Cacheable` như trên:

- cacheManager: Chỉ định bộ quản lý bộ đệm đã đăng ký trong lớp cấu hình trước đó (vậy nên, câu trả lời cho câu hỏi trước có ý nghĩa đúng không?)
- cacheNames: Có thể hiểu đơn giản là tiền tố của bộ đệm, ví dụ như thanh bên trang chủ, thanh bên chuyên mục, thanh bên trang chi tiết bài viết
- key: Biểu thức SpEL, có thể dựa trên tham số của phương thức để tạo ra khóa bộ đệm tương ứng; nếu là một chuỗi hằng số, hãy bọc trong dấu ngoặc đơn

> annotation bộ đệm này biểu thị rằng ưu tiên lấy dữ liệu từ bộ đệm, nếu không có trong bộ đệm, sau đó thực thi logic trong phương thức và lưu kết quả trả về vào bộ đệm

**Lưu ý 2**  

Thứ hai, điều cần chú ý tiếp theo là trong cùng một dịch vụ, nếu muốn annotation bộ đệm có hiệu lực, hãy không gọi trực tiếp bên trong dịch vụ, mà cần phải trung chuyển thông qua cách làm như `SpringUtil.getBean(xxx).xxx` như ở trên, để thực hiện gọi qua proxy.

---

Đặc biệt là các tình huống sử dụng bộ đệm, chúng tôi cũng cung cấp một tình huống về việc hủy bỏ bộ đệm một cách tự động. Trong `ArticleSettingServiceImpl`, chủ yếu là thay đổi số lượng lượt đọc của thanh bên trang chi tiết bài viết, cần phải xóa bộ đệm một cách tự động.

```java
@Override
@CacheEvict(key = "'sideBar_' + #req.articleId", cacheManager = "caffeineCacheManager", cacheNames = "article")
public void updateArticle(ArticlePostReq req) {
    ArticleDO article = articleDao.getById(req.getArticleId());
    // Bỏ qua
}

```

Điểm quan trọng là annotation `@CacheEvict`, hủy bỏ bộ đệm, nó được sử dụng cùng với phương thức `queryArticleDetailSidebarList(xxx)` ở trên.

---

**Kiến thức mở rộng:** Ngoài hai chú thích bộ đệm đã được giới thiệu ở trên, Spring còn có hai chú thích khác cũng rất phổ biến:

- `@CachePut`: Sau khi phương thức được thực thi, kết quả tương ứng sẽ được ghi vào bộ đệm một cách tự động.
- `@Caching`: Có thể kết hợp nhiều chú thích bộ đệm để sử dụng.

Ví dụ:

```java
@Caching(cacheable = @Cacheable(cacheNames = "caching", key = "#age"),
        evict = @CacheEvict(cacheNames = "t4", key = "#age"))
public String caching(int age) {
    return "caching: " + age + "-->" + UUID.randomUUID().toString();
}

```
