---
title: CF MyBatis-Plus
tags:
  - codeforum
  - project
categories: 
date created: 2024-04-10
date modified: 2024-04-11
---

# Tích hợp MyBatis-Plus vào dự án Spring Boot

Như cái tên, MyBatis-Plus là một phiên bản mở rộng của MyBatis, cung cấp một số tính năng bổ sung như constructor điều kiện, plugin phân trang, generator mã và nhiều hơn nữa, giúp chúng ta tập trung vào logic nghiệp vụ thay vì viết các câu lệnh SQL.

Mã nguồn của MyBatis-Plus cũng là mã nguồn mở, đã thu hút hơn 15.7k sao trên GitHub, rất được lòng cộng đồng. Nếu có ý định nghiên cứu mã nguồn, các bạn có thể thử.

> [https://github.com/baomidou/mybatis-plus](https://github.com/baomidou/mybatis-plus)

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240411153138.png)

MyBatis-Plus cũng cung cấp tài liệu chính thức, giới thiệu chi tiết về cách bắt đầu với MyBatis-Plus, các tính năng cốt lõi, tính năng mở rộng, cũng như các plugin, mọi người có thể tìm hiểu thêm thông qua tài liệu chính thức.

> https://www.baomidou.com/pages/24112f/

## Tích hợp MyBatis-Plus

Cách tích hợp MyBatis-Plus vào dự án rất đơn giản. Bước đầu tiên là thêm starter vào tập tin pom.xml.

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
</dependency>
```

Bước thứ hai là sử dụng annotation `@MapperScan` để quét các tập tin mapper.

```java
@Configuration  
@ComponentScan("com.hnv99.forum.service")  
@MapperScan(basePackages = {  
        "com.hnv99.forum.service.article.repository.mapper",  
        "com.hnv99.forum.service.user.repository.mapper",  
        "com.hnv99.forum.service.comment.repository.mapper",  
        "com.hnv99.forum.service.config.repository.mapper",  
        "com.hnv99.forum.service.statistics.repository.mapper",  
        "com.hnv99.forum.service.notify.repository.mapper",})  
public class ServiceAutoConfig {  
}
```

ServiceAutoConfig là một lớp cấu hình độc lập, các mapper interface được phân loại theo nghiệp vụ và các tập tin mapper.xml được đặt trong thư mục resources. Phải thừa nhận rằng cấu trúc thư mục như vậy của kỹ thuật tích hợp rất rõ ràng, có trật tự, dễ hiểu ngay từ cái nhìn đầu tiên.

Bước thứ ba là thêm cấu hình chung của MyBatis-Plus vào tập tin application.yml.

```yml
# Cấu hình MyBatis-Plus liên quan
mybatis-plus:
  configuration:
    # Bật chuyển đổi gạch dưới sang kiểu chữ thường viết hoa
    map-underscore-to-camel-case: true

```

`map-underscore-to-camel-case: true` giúp chuyển đổi cách đặt tên từ dấu gạch dưới trong cơ sở dữ liệu (underscore case) sang cách đặt tên kiểu lạc đà (camel case) trong đối tượng Java. Ví dụ, tên cột trong bảng cơ sở dữ liệu là user_name, tên thuộc tính trong đối tượng Java tương ứng là userName.

OK, với ba bước trên, ta đã hoàn thành việc tích hợp MyBatis-Plus vào dự án Spring Boot. Tiếp theo, chúng ta sẽ đi sâu vào từng bước cơ bản của MyBatis-Plus, bao gồm thêm mới, annotation, truy vấn, constructor điều kiện, SQL tùy chỉnh, truy vấn phân trang, cập nhật xóa, mô hình AR, chiến lược khóa chính, và dịch vụ CRUD.

## Sử dụng MyBatis-Plus cơ bản

### CRUD Service

Trong kỹ thuật tích hợp, CRUD thông thường được thực hiện thông qua các CRUD Interface của MyBatis-Plus.

Ví dụ, nếu chúng ta muốn lưu một nhãn của bài viết, có thể thực hiện như sau.

```java
@Autowired
private TagDao tagDao;

tagDao.save(tagDO);
```

1. `tagDao` là một đối tượng truy cập dữ liệu (Data Access Object - DAO) mà chúng ta đã định nghĩa, nó kế thừa từ lớp `ServiceImpl` của MyBatis-Plus. Annotation `@Autowired` tự động tiêm `TagDao` vào lớp hiện tại. Đây là tính năng Dependency Injection (DI) do Spring cung cấp, cho phép chúng ta dễ dàng sử dụng TagDao trong lớp hiện tại.

```java
@Repository
public class TagDao extends ServiceImpl<TagMapper, TagDO> {
```

①. Annotation `@Repository`: Đây là một annotation do Spring cung cấp, dùng để xác định rằng lớp này là một thành phần của lớp truy cập dữ liệu (DAO). Spring sẽ tự động quét và tạo một Bean từ nó, giúp chúng ta có thể sử dụng TagDao trong các lớp khác thông qua DI.

②. `ServiceImpl<TagMapper, TagDO>`: ServiceImpl là một lớp trừu tượng được MyBatis-Plus cung cấp, cung cấp các phương thức CRUD chung. Tham số generic `<TagMapper, TagDO>` chỉ ra rằng TagDao chủ yếu được sử dụng để thực hiện các thao tác cơ sở dữ liệu trên đối tượng dữ liệu `TagDO` và sử dụng các phương thức được định nghĩa trong giao diện `TagMapper`.

Bằng cách kế thừa từ lớp `ServiceImpl`, `TagDao` có thể sử dụng các phương thức CRUD chung của MyBatis-Plus như `save`, `getById`, `updateById` và nhiều hơn nữa. Các phương thức này đã được triển khai để thực hiện các thao tác cơ bản trên cơ sở dữ liệu và thường không cần viết câu lệnh SQL thủ công.

```java
/**
 * Lớp triển khai IService ( generic: M là đối tượng mapper, T là thực thể )
 * @author hubin
 * @since 2018-06-23
 */
@SuppressWarnings("unchecked")
public class ServiceImpl<M extends BaseMapper<T>, T> implements IService<T> {
}

```

2. Tham số tagDO là một đối tượng dữ liệu (Data Object - DO), biểu thị cho bảng tag trong cơ sở dữ liệu.

```java
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("tag")
public class TagDO extends BaseDO {
    private static final long serialVersionUID = 3796460143933607644L;

    /**
     * Tag name
     */
    private String tagName;

    /**
     * Tag type: 1 - system tag, 2 - custom tag
     */
    private Integer tagType;

    /**
     * Status: 0 - unpublished, 1 - published
     */
    private Integer status;

    /**
     * Whether deleted
     */
    private Integer deleted;
}
```

①. Annotation `@Data` được cung cấp bởi Lombok, tự động tạo ra các phương thức getter, setter, equals, hashCode và toString cho lớp, giúp rút ngắn mã nguồn.

②. Annotation `@EqualsAndHashCode(callSuper = true)` cũng được cung cấp bởi Lombok, `callSuper = true` chỉ ra rằng nó sẽ gọi các phương thức equals và hashCode của lớp cha (BaseDO).

BaseDO là một lớp cơ sở DO mà chúng ta tự định nghĩa, triển khai Serializable interface và định nghĩa các trường chính id (`@TableId(type = IdType.AUTO)` chỉ ra rằng nó là tự tăng, đây là annotation do MyBatis-Plus cung cấp), thời gian tạo `createTime` và thời gian cập nhật `updateTime`.

```java
@Data
public class BaseDO implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Date createTime;

    private Date updateTime;
}
```

③. Annotation `@TableName("tag")` được cung cấp bởi MyBatis-Plus, dùng để chỉ định tên bảng trong cơ sở dữ liệu.

④. Ngoài ra, chúng ta còn định nghĩa bốn thuộc tính: `tagName` (tên nhãn), `tagType` (loại nhãn), `status` (trạng thái) và `deleted` (đã xóa chưa). Những thuộc tính này tương ứng với các cột trong bảng cơ sở dữ liệu.

OK, để hình dung cụ thể bạn có thể tham khảo mã nguồn của dự án!

### CRUD Mapper

Ngoài việc cung cấp CRUD Service, MyBatis-Plus còn cung cấp CRUD Mapper.

Trong kỹ thuật tích hợp, một số thao tác thêm, xóa, sửa, truy vấn đặc biệt được thực hiện thông qua các CRUD interface của MyBatis-Plus.

Ví dụ, nếu chúng ta muốn lưu một bài viết, có thể thực hiện như sau.

```java
@Repository
public class ArticleDao extends ServiceImpl<ArticleMapper, ArticleDO> {
    @Resource
    private ArticleDetailMapper articleDetailMapper;
    
    public Long saveArticleContent(Long articleId, String content) {
        ArticleDetailDO detail = new ArticleDetailDO();
        detail.setArticleId(articleId);
        detail.setContent(content);
        detail.setVersion(1L);
        articleDetailMapper.insert(detail);
        return detail.getId();
    }
}
```

1. `articleDetailMapper` là một Mapper interface được tiêm vào trong lớp hiện tại.

```java
public interface ArticleDetailMapper extends BaseMapper<ArticleDetailDO> {
}

```

Nó kế thừa từ BaseMapper interface của MyBatis-Plus.

```java
/**
 * Khi một Mapper kế thừa interface này, không cần viết tệp mapper.xml, vẫn có thể sử dụng chức năng CRUD
 * <p>Mapper này hỗ trợ kiểu id generic</p>
 *
 * @author hubin
 * @since 2016-01-23
 */
public interface BaseMapper<T> extends Mapper<T> {

    /**
     * Chèn một bản ghi mới
     *
     * @param entity Đối tượng thực thể
     */
    int insert(T entity);
    
    /**
     * Xóa các bản ghi dựa trên điều kiện của entity
     *
     * @param queryWrapper Lớp bao bọc thực thể (có thể là null, entity bên trong dùng để tạo câu lệnh where)
     */
    int delete(@Param(Constants.WRAPPER) Wrapper<T> queryWrapper);
    
    /**
     * Cập nhật bản ghi dựa trên điều kiện của whereEntity
     *
     * @param entity        Đối tượng thực thể (set giá trị điều kiện, có thể là null)
     * @param updateWrapper Lớp bao bọc thực thể (có thể là null, entity bên trong dùng để tạo câu lệnh where)
     */
    int update(@Param(Constants.ENTITY) T entity, @Param(Constants.WRAPPER) Wrapper<T> updateWrapper);
    
    /**
     * Truy vấn dựa trên ID
     *
     * @param id ID chính
     */
    T selectById(Serializable id);
}

```

Như vậy, `articleDetailMapper` cũng có các chức năng cơ bản của thêm, xóa, sửa, truy vấn.

Hãy thử truy cập vào `http://localhost:8080/` trong thanh địa chỉ của trình duyệt và viết một bài viết.

### Annotation thông dụng

- `@TableName`：Dùng để chỉ định tên bảng trong cơ sở dữ liệu, thường được sử dụng trên lớp entity (DO hoặc Entity). Ví dụ: `@TableName("user")`.
- `@TableId`：Dùng để chỉ định trường khóa chính trong bảng. Thường được sử dụng trên thuộc tính khóa chính của lớp entity. Ví dụ: `@TableId(value = "id", type = IdType.AUTO)`，ở đó value là tên trường khóa chính, type là chiến lược sinh khóa chính.
- `@TableField`：Dùng để chỉ định các trường không phải là khóa chính trong bảng. Có thể sử dụng trên thuộc tính của lớp entity để ánh xạ thuộc tính và trường trong cơ sở dữ liệu. Ví dụ: `@TableField(value = "user_name", exist = true)`，ở đó value là tên trường trong cơ sở dữ liệu, exist chỉ ra trường đó có tồn tại trong cơ sở dữ liệu hay không (mặc định là true, nếu đặt là false thì có nghĩa là trường đó không tồn tại trong cơ sở dữ liệu).
- `@TableLogic`：Dùng để chỉ định trường xóa logic. Xóa logic là chỉ đánh dấu rằng một bản ghi đã bị xóa trong cơ sở dữ liệu, thay vì thực sự xóa bản ghi đó. Ví dụ: `@TableLogic(value = "0", delval = "1")`，ở đó value là giá trị mặc định cho trạng thái chưa xóa, delval là giá trị cho trạng thái đã xóa.
- `@Version`：Dùng để chỉ định trường khóa phiên bản (Optimistic Locking). Khóa phiên bản là một chiến lược kiểm soát song song, được sử dụng để giải quyết vấn đề nhiều luồng cùng thay đổi một bản ghi. Ví dụ: `@Version private Integer version;`.
- `@EnumValue`：Dùng để chỉ định ánh xạ cho trường kiểu enum. Ví dụ: `@EnumValue private Integer status;`.
- `@InterceptorIgnore`：Dùng để bỏ qua việc xử lý của các interceptor trong MyBatis-Plus. Ví dụ: `@InterceptorIgnore(tenantLine = "true")`，điều này có nghĩa là bỏ qua interceptor của đa người dùng.

Bạn có thể tìm hiểu thêm về các annotation khác trong tài liệu chính thức, ở đây chỉ nói về vài cái phổ biến nhất.

## Phương thức truy vấn trong MyBatis-Plus

### Truy vấn thông thường

BaseMapper của MyBatis-Plus cung cấp nhiều phương thức truy vấn. Ví dụ, để tìm bài viết theo ID trong trường hợp kỹ thuật, bạn có thể sử dụng:

```java
ArticleDO article = baseMapper.selectById(articleId);
```

Ngoài ra, còn có phương thức `selectBatchIds` để truy vấn theo ID một cách hàng loạt:

```java
List<T> selectBatchIds(@Param(Constants.COLL) Collection<? extends Serializable> idList);
```

Cách sử dụng cũng rất đơn giản:

```java
baseMapper.selectBatchIds(Arrays.asList(1,2));
```

Bạn cũng có thể truy vấn theo cặp khóa và giá trị sử dụng `selectByMap`:

```java
List<T> selectByMap(@Param(Constants.COLUMN_MAP) Map<String, Object> columnMap);
```

Cách sử dụng như sau (với id là 15):

```java
Map<String, Object> map = new HashMap<>();
map.put("id", 15L);
List<ArticleDO> dtoList = baseMapper.selectByMap(map);
```

### Bộ điều kiện xây dựng

Wrapper của MyBatis-Plus là một bộ điều kiện xây dựng, được sử dụng để đơn giản hóa việc xây dựng các điều kiện truy vấn SQL phức tạp. Nó cung cấp một loạt các API dễ sử dụng, cho phép bạn viết các điều kiện truy vấn theo cách liên kết một cách chuỗi, mà không cần phải viết SQL thủ công.

Ví dụ, để truy vấn bài viết có thẻ chứa 'j' và trạng thái đã xuất bản , chúng ta có thể xây dựng một bộ điều kiện như sau:

```java
@Test
public void testWrapper() {
    QueryWrapper<TagDO> wrapper = new QueryWrapper<>();
    // chứa “j” và trạng thái là đã xuất bản
    wrapper.like("tag_name", "j").eq("status", 1);
    BaseMapper<TagDO> baseMapper = tagDao.getBaseMapper();
    List<TagDO> tagList = baseMapper.selectList(wrapper);
    tagList.forEach(System.out::println);
}
```

QueryWrapper: được sử dụng để xây dựng các điều kiện truy vấn. Nó kế thừa từ AbstractWrapper, cung cấp một loạt các phương thức xây dựng điều kiện truy vấn, như eq, ne, gt, ge, lt, le, like, isNull, orderBy, v.v.

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/af9b3173-7288-42c8-bdc0-ac68ef42cdb1.png)

Qua cách tiếp cận trên, chúng ta sẽ trả về tất cả các cột. Nếu chỉ muốn trả về một phần, làm thế nào? Bạn có thể sử dụng select để thiết lập các trường truy vấn.

```java
wrapper.select("tag_name","status")
      .like("tag_name", "j").eq("status", 1);
```

Tuy nhiên, việc sử dụng tên cột của bảng luôn là một cảm giác không thoải mái, nếu bảng cơ sở dữ liệu thay đổi vào một ngày nào đó, thì sao? Code và cơ sở dữ liệu sẽ không phù hợp đúng không?

Cách làm tinh tế hơn là sử dụng Lambda, đây là cách mà kỹ thuật sử dụng cho điều kiện xây dựng.

Ví dụ, để truy vấn các thẻ:

```java
public List<TagDTO> listOnlineTag(String key, PageParam pageParam) {
    LambdaQueryWrapper<TagDO> query = Wrappers.lambdaQuery();
    query.eq(TagDO::getStatus, PushStatusEnum.ONLINE.getCode())
            .eq(TagDO::getDeleted, YesOrNoEnum.NO.getCode())
            .and(!StringUtils.isEmpty(key), v -> v.like(TagDO::getTagName, key))
            .orderByDesc(TagDO::getId);
    if (pageParam != null) {
        query.last(PageParam.getLimitSql(pageParam));
    }
    List<TagDO> list = baseMapper.selectList(query);
    return ArticleConverter.toDtoList(list);
}
```

①. Có thể sử dụng `Wrappers.lambdaQuery()` để tạo một Lambda điều kiện xây dựng.

②. `eq(TagDO::getStatus, PushStatusEnum.ONLINE.getCode())`: biểu thị các điều kiện truy vấn là status bằng `PushStatusEnum.ONLINE` (nghĩa là chỉ truy vấn các thẻ đã được xuất bản).

③. `eq(TagDO::getDeleted, YesOrNoEnum.NO.getCode())`: biểu thị điều kiện truy vấn là deleted bằng YesOrNoEnum.NO (nghĩa là chỉ truy vấn các bản ghi chưa bị xóa).

④. `and(!StringUtils.isEmpty(key), v -> v.like(TagDO::getTagName, key))`: biểu thị nếu key không trống, thêm một điều kiện truy vấn, yêu cầu tag_name chứa key.

⑤. `orderByDesc(TagDO::getId)`: biểu thị sắp xếp theo id theo thứ tự giảm dần.

⑥. `if (pageParam != null) { query.last(PageParam.getLimitSql(pageParam)); }`: nếu pageParam không null, thêm tham số phân trang.

Như vậy, chúng ta có thể tách biệt code và cột của cơ sở dữ liệu, hoàn toàn truy vấn thông qua code. Ví dụ khác, để truy vấn danh sách bài viết:

```java
public List<ArticleDO> listArticles(PageParam pageParam) {
    return lambdaQuery()
            .eq(ArticleDO::getDeleted, YesOrNoEnum.NO.getCode())
            .last(PageParam.getLimitSql(pageParam))
            .orderByDesc(ArticleDO::getId)
            .list();
}
```

①. `lambdaQuery()` là một phương thức mặc định được cung cấp bởi IService của MyBatis-Plus, cho phép trả về một Lambda điều kiện xây dựng.

```java
default LambdaQueryChainWrapper<T> lambdaQuery() {
    return ChainWrappers.lambdaQueryChain(getBaseMapper());
}
```

②. `eq(ArticleDO::getDeleted, YesOrNoEnum.NO.getCode())`：biểu thị điều kiện truy vấn là deleted bằng YesOrNoEnum.NO (nghĩa là chỉ truy vấn các bản ghi chưa bị xóa).

③. `last(PageParam.getLimitSql(pageParam))`：thêm một câu l

ệnh phân trang vào cuối truy vấn, ở đây dựa trên tham số pageParam để tạo câu SQL phân trang.

④. `orderByDesc(ArticleDO::getId)`：sắp xếp kết quả theo id theo thứ tự giảm dần.

⑤. `list()`：thực hiện truy vấn và trả về danh sách kết quả.

## Tùy chỉnh SQL trong MyBatis-Plus

MyBatis-Plus hỗ trợ tùy chỉnh các câu lệnh SQL, chúng ta có thể viết các phương thức SQL tùy chỉnh trong interface Mapper và sử dụng các chú thích để thêm các câu lệnh SQL tùy chỉnh.

Trong dự án, khi sử dụng đăng nhập qua Google, câu lệnh SQL sau được thực thi:

```java
public interface UserMapper extends BaseMapper<UserDO> {
    /**
     * Tìm kiếm theo ID của tài khoản bên thứ ba
     *
     * @param accountId
     * @return
     */
    @Select("select * from user where third_account_id = #{account_id} limit 1")
    UserDO getByThirdAccountId(@Param("account_id") String accountId);
}

```

Interface định nghĩa một phương thức có tên là getByThirdAccountId, nhận một tham số accountId.

Phương thức này sử dụng chú thích `@Select`, chú thích này được sử dụng để viết các câu lệnh SQL tùy chỉnh. Câu lệnh SQL trong chú thích `@Select` là: `select * from user where third_account_id = #{account_id} limit 1`, nó sẽ truy vấn các bản ghi trong bảng user dựa trên tham số accountId được truyền vào.

Đồng thời, tham số phương thức `accountId` sử dụng chú thích `@Param`, chỉ định tên của tham số trong câu lệnh SQL là `account_id`. Điều này cho phép MyBatis thay thế giá trị tham số vào vị trí tương ứng khi thực thi câu lệnh SQL.

Ngoài ra, trong dự án còn sử dụng cách viết XML để định nghĩa một số câu lệnh SQL phức tạp. Ví dụ, để thống kê PV, UV của trang web, chúng ta có thể tạo một tệp XML mới trong thư mục resources, có tên là QueryCountMapper.xml, nội dung như sau:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.hnv99.forum.service.statistics.repository.mapper.RequestCountMapper">

    <select id="getPvTotalCount" resultType="java.lang.Long">
        select sum(cnt) from request_count
    </select>

    <select id="getPvDayList" resultType="com.hnv99.forum.api.model.vo.statistics.dto.StatisticsDayDTO">
        SELECT sum(cnt) as count, date
        FROM request_count
        group by date order by date asc
        limit #{day};
    </select>

    <select id="getUvDayList" resultType="com.hnv99.forum.api.model.vo.statistics.dto.StatisticsDayDTO">
        SELECT count(*) as count, date
        FROM request_count
        group by date order by date asc
        limit #{day};
    </select>

</mapper>

```

①, Ưu điểm của việc đặt tệp trong thư mục resources là MyBatis-Plus mặc định đã cấu hình đường dẫn của các tệp XML, bạn không cần phải cấu hình lại trong tệp `application.yml`.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240411175732.png)

`classpath*:\/mapper\/**\/*.xml` cho biết MyBatis-Plus sẽ quét tất cả các tệp XML trong thư mục mapper và tất cả các thư mục con của nó trong thư mục resources. Đây là một cấu trúc thư mục được khuyến nghị vì nó tách riêng tệp tài nguyên khỏi mã Java, làm cho cấu trúc dự án trở nên rõ ràng hơn.

②, Tệp XML này định nghĩa một Mapper có tên RequestCountMapper, nó chứa ba câu lệnh truy vấn tùy chỉnh: getPvTotalCount, getPvDayList và getUvDayList. Nó khớp với `com.github.paicoding.forum.service.statistics.repository.mapper.RequestCountMapper`.

```java
public interface RequestCountMapper extends BaseMapper<RequestCountDO> {

    /**
     * Lấy tổng số PV
     *
     * @return
     */
    Long getPvTotalCount();

    /**
     * Lấy danh sách PV theo ngày
     * @param day
     * @return
     */
    List<StatisticsDayDTO> getPvDayList(@Param("day") Integer day);

    /**
     * Lấy danh sách UV theo ngày
     *
     * @param day
     * @return
     */
    List<StatisticsDayDTO> getUvDayList(@Param("day") Integer day);
}

```

③, Truy vấn getPvTotalCount: trả về kiểu `java.lang.Long`, truy vấn là `select sum(cnt) from request_count`. Truy vấn này tính tổng giá trị cột cnt trong tất cả các bản ghi của bảng request_count.

④, Truy vấn getPvDayList: trả về kiểu `StatisticsDayDTO`. Truy vấn này lấy số lượng yêu cầu được nhóm theo ngày và sắp xếp theo ngày tăng dần, dựa trên tham số ngày được truyền vào.

⑤, Truy vấn getPvDayList: trả về kiểu tương tự là StatisticsDayDTO. Truy vấn này lấy số lượng du khách duy nhất được nhóm theo ngày và sắp xếp theo ngày tăng dần, dựa trên tham số ngày được truyền vào.

Bạn có thể xem kĩ hơn trong mã nguồn dự án.

## Cập nhật và Xóa trong MyBatis-Plus

### Cập nhật

Đầu tiên, hãy xem một ví dụ đơn giản nhất, việc gọi phương thức `updateById` của Service, tức là cập nhật theo ID, ví dụ: cập nhật nội dung của một tag:

```java
public void saveTag(TagReq tagReq) {
    TagDO tagDO = ArticleConverter.toDO(tagReq);
    if (NumUtil.nullOrZero(tagReq.getTagId())) {
        tagDao.save(tagDO);
    } else {
        tagDO.setId(tagReq.getTagId());
        tagDao.updateById(tagDO);
    }
}

```

Phương thức update của Service thực chất là một bao bọc của phương thức update của Mapper.

```java
default boolean updateById(T entity) {
    return SqlHelper.retBool(getBaseMapper().updateById(entity));
}
```

Bạn cũng có thể sử dụng XML để cập nhật một loạt các tin nhắn khi trạng thái của chúng thay đổi, kỹ thuật đã sử dụng cách này để cập nhật.

```xml
<update id="updateNoticeRead">
    update notify_msg set `state` = 1 where `id` in
    <foreach collection="ids" open="(" close=")" separator="," item="id" index="index">
        #{id}
    </foreach>
</update>

```

Mapper tương ứng được viết như sau:

```java
void updateNoticeRead(@Param("ids") List<Long> ids);
```

### Xóa

Trong kỹ thuật, việc xóa đa số là xóa logic hay soft delete, không phải xóa vật lý, có nghĩa là thay đổi trường delete thay vì xóa bản ghi thực sự khỏi bảng, vì vậy, cuối cùng, phương thức được gọi là phương thức update, ví dụ: xóa bài viết.

```java
public void deleteArticle(Long articleId, Long loginUserId) {
    ArticleDO dto = articleDao.getById(articleId);
    if (dto != null && !Objects.equals(dto.getUserId(), loginUserId)) {
        // No permission
        throw ExceptionUtil.of(StatusEnum.FORBID_ERROR_MIXED, "Please confirm if the article belongs to you!");
    }

    if (dto != null && dto.getDeleted() != YesOrNoEnum.YES.getCode()) {
        dto.setDeleted(YesOrNoEnum.YES.getCode());
        articleDao.updateById(dto);

        // Publish article deletion event
        SpringUtil.publishEvent(new ArticleMsgEvent<>(this, ArticleEventEnum.DELETE, articleId));
    }
}
```

## Chiến lược Khóa chính trong MyBatis-Plus

Trong kỹ thuật, chiến lược khóa chính thường sử dụng là tự tăng, có nghĩa là, cột ID trong bảng cơ sở dữ liệu sẽ được đặt là Auto Increment.

Sau đó, đối tượng thực thể DO sẽ kế thừa từ BaseDO, ví dụ: CategoryDO cho các danh mục:

```java
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("category")
public class CategoryDO extends BaseDO {

    private static final long serialVersionUID = 1L;

    /**
     * Category name
     */
    private String categoryName;

    /**
     * Status: 0 - unpublished, 1 - published
     */
    private Integer status;

    /**
     * Sorting
     */
    @TableField("`rank`")
    private Integer rank;

    private Integer deleted;
}
```

Trong đó, BaseDO là lớp cơ sở được cung cấp bởi MyBatis-Plus, trường id bên trong đã được thêm annotation `@TableId(type = IdType.AUTO)`.

```java
@Data
public class BaseDO implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Date createTime;

    private Date updateTime;
}
```

Khi chèn dữ liệu, không cần thiết lập giá trị khóa chính, cơ sở dữ liệu sẽ tự động cấp phát giá trị khóa chính.

Ngoài IdType.AUTO, MyBatis-Plus cũng cung cấp một số chiến lược khác như IdType.NONE: Không có chiến lược khóa chính. Điều này có nghĩa là không sử dụng bất kỳ chiến lược sinh khóa chính nào, giá trị khóa chính cần được thiết lập thủ công.

```java
public class User {
    @TableId(type = IdType.NONE)
    private Long id;
    // ...
}
```

IdType.UUID: Sử dụng UUID làm khóa chính. Khi chèn dữ liệu, MyBatis-Plus sẽ tự động tạo ra một giá trị UUID để sử dụng làm khóa chính.

```java
public class User {
    @TableId(type = IdType.UUID)
    private String id;
    // ...
}
```

IdType.ID_WORKER: Sử dụng thuật toán snowflake để sinh ID phân tán duy nhất. Khi chèn dữ liệu, MyBatis-Plus sẽ tự động tạo ra một Snowflake ID để sử dụng làm khóa chính.

```java
public class User {
    @TableId(type = IdType.ID_WORKER)
    private Long id;
    // ...
}
```
