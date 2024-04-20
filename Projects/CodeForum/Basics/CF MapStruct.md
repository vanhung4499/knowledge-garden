---
title: CF MapStruct
tags:
  - codeforum
  - project
categories: 
date created: 2024-04-17
date modified: 2024-04-17
---

# Sao chép bằng MapStruct

Bài viết này sẽ giới thiệu về ứng dụng của MapStruct trong dự án. Đơn giản mà nói, MapStruct là một bộ ánh xạ Java Bean. Chúng ta chỉ cần định nghĩa các phương thức trong một interface XXXStructMapper và MapStruct sẽ tự động tạo ra lớp cài đặt tương ứng vào thời điểm biên dịch. Lớp cài đặt này chứa mã ánh xạ cụ thể, giúp tăng cường hiệu suất lập trình và loại bỏ rất nhiều mã mẫu.

## Rắc rối với cách code bình thường

Nếu không sử dụng MapStruct, khi chúng ta cần chuyển đổi một đối tượng DO thành một đối tượng DTO, chúng ta phải làm như sau:

```java
public static ArticleDTO toDto(ArticleDO articleDO) {
    if (articleDO == null) {
        return null;
    }
    ArticleDTO articleDTO = new ArticleDTO();
    articleDTO.setAuthor(articleDO.getUserId());
    articleDTO.setArticleId(articleDO.getId());
    articleDTO.setArticleType(articleDO.getArticleType());
    articleDTO.setTitle(articleDO.getTitle());
    articleDTO.setShortTitle(articleDO.getShortTitle());
    articleDTO.setSummary(articleDO.getSummary());
    articleDTO.setCover(articleDO.getPicture());
    articleDTO.setSourceType(SourceTypeEnum.formCode(articleDO.getSource()).getDesc());
    articleDTO.setSourceUrl(articleDO.getSourceUrl());
    articleDTO.setStatus(articleDO.getStatus());
    articleDTO.setCreateTime(articleDO.getCreateTime().getTime());
    articleDTO.setLastUpdateTime(articleDO.getUpdateTime().getTime());
    articleDTO.setOfficalStat(articleDO.getOfficalStat());
    articleDTO.setToppingStat(articleDO.getToppingStat());
    articleDTO.setCreamStat(articleDO.getCreamStat());

    // Set category id
    articleDTO.setCategory(new CategoryDTO(articleDO.getCategoryId(), null));
    return articleDTO;
}

```

Nếu là một danh sách, chúng ta còn phải lặp qua từng phần tử.

```java
public static List<ArticleDTO> toArticleDtoList(List<ArticleDO> articleDOS) {
    return articleDOS.stream().map(ArticleConverter::toDto).collect(Collectors.toList());
}

```

Viết code như vậy nhiều lần sẽ khiến bạn cảm thấy không có giá trị, như một người copy-paste không ý nghĩa.

Nhưng nếu sử dụng MapStruct thì sao?

```java
@Mapper
public interface ArticleStructMapper {
    ArticleStructMapper INSTANCE = Mappers.getMapper(ArticleStructMapper.class );

    ArticleDTO toDTO(ArticleDO do);
}

```

Chúng ta định nghĩa một interface `ArticleStructMapper`, interface này chủ yếu để chuyển đổi đối tượng `ArticleDO` thành đối tượng `ArticleDTO`.  

Hãy phân tích từng bước:

1. **@Mapper**:

Đây là một trong những annotation cốt lõi của MapStruct. Nó đánh dấu interface này là một bộ ánh xạ và cho biết trình xử lý annotation của MapStruct sẽ tạo ra một cài đặt cho interface này trong quá trình biên dịch.

2. **INSTANCE constant**:

```java
ArticleStructMapper INSTANCE = Mappers.getMapper( ArticleStructMapper.class );

```

`Mappers.getMapper` là một phương thức tiện ích được cung cấp bởi MapStruct, cho phép chúng ta lấy một thể hiện của bộ ánh xạ mà không cần sử dụng Spring hoặc các khung công cụ tiêm cận phụ thuộc khác.

3. **phương thức toDTO**:

Phương thức này xác định một phương thức chuyển đổi. Chức năng của nó rất rõ ràng.

So sánh giữa hai cách tiếp cận, cảm giác có sự khác biệt hoàn toàn chứ đúng không?

## Cách sử dụng cơ bản của MapStruct

Bước đầu tiên là thêm MapStruct vào tập tin pom.xml.

```xml
<!-- Thêm MapStruct -->
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
</dependency>
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct-processor</artifactId>
    <scope>compile</scope>
</dependency>
```

Chúng có các vai trò sau:

1. **org.mapstruct:mapstruct**:
   - Thư viện cốt lõi của MapStruct. Nó cung cấp các annotation chính và phương pháp công cụ cần thiết cho MapStruct, chẳng hạn như các annotation như `@Mapper`, `@Mapping`, và phương thức `Mappers.getMapper()`.
   - Tại thời điểm chạy, thư viện này là bắt buộc và mã ánh xạ được tạo ra sẽ phụ thuộc vào nó.
2. **org.mapstruct:mapstruct-processor**:
   - Bộ xử lý annotation của MapStruct. Nó tạo mã cụ thể cho các ánh xạ trong quá trình biên dịch.
   - Phạm vi `compile`, có nghĩa là nó chỉ được sử dụng trong quá trình biên dịch.
   - Khi bạn biên dịch một dự án sử dụng các annotation MapStruct, bộ xử lý annotation sẽ kiểm tra mã của bạn và tạo mã thực thi cho các interface `@Mapper` hoặc các lớp trừu tượng.

Bước thứ hai là định nghĩa interface ánh xạ, giống như interface ArticleStructMapper mà chúng ta đã thấy trước đó, nhưng chúng ta sẽ tạo một cái phức tạp hơn một chút.

```java
@Mapper
public interface ColumnStructMapper {
    ColumnStructMapper INSTANCE = Mappers.getMapper(ColumnStructMapper.class);

    /**
     * Chuyển từ ColumnInfoDO sang ColumnDTO
     * @param columnInfoDO
     * @return
     */
    // sources là tham số, target là mục tiêu
    @Mapping(source = "id", target = "columnId")
    @Mapping(source = "columnName", target = "column")
    @Mapping(source = "userId", target = "author")
    // Chuyển từ Date sang Long
    @Mapping(target = "publishTime", expression = "java(columnInfoDO.getPublishTime().getTime())")
    @Mapping(target = "freeStartTime", expression = "java(columnInfoDO.getFreeStartTime().getTime())")
    @Mapping(target = "freeEndTime", expression = "java(columnInfoDO.getFreeEndTime().getTime())")
    ColumnDTO infotoDto(ColumnInfoDO columnInfoDO);

    List<ColumnDTO> infoToDtos(List<ColumnInfoDO> columnInfoDOs);

    @Mapping(source = "column", target = "columnName")
    @Mapping(source = "author", target = "userId")
    // Chuyển từ Long sang Date
    @Mapping(target = "freeStartTime", expression = "java(new java.util.Date(req.getFreeStartTime()))")
    @Mapping(target = "freeEndTime", expression = "java(new java.util.Date(req.getFreeEndTime()))")
    ColumnInfoDO toDo(ColumnReq req);
}
```

Đây là cách mà mã này định nghĩa cách chuyển đổi giữa các đối tượng `ColumnInfoDO` và `ColumnDTO`, cũng như cách chuyển đổi từ `ColumnReq` sang `ColumnInfoDO`. Mỗi phần được giải thích như sau:

1. **Phương thức `infotoDto`**:
   - Sử dụng annotation `@Mapping` để chỉ định quy tắc ánh xạ thuộc tính. Ví dụ, ánh xạ thuộc tính `id` của `ColumnInfoDO` sang thuộc tính `columnId` của `ColumnDTO`.
   - Sử dụng thuộc tính `expression` để định nghĩa các biến đổi thuộc tính phức tạp hơn, như lấy thời gian từ đối tượng `Date`.

2. **Phương thức `infoToDtos`**:
   - Hiển thị cách MapStruct dễ dàng chuyển đổi danh sách đối tượng. Phương thức này chuyển đổi từ `List<ColumnInfoDO>` sang `List<ColumnDTO>`. Vì ánh xạ cho một đối tượng đã được định nghĩa trong phương thức `infotoDto`, nên không cần annotation phụ thêm ở đây.

3. **Phương thức `toDo`**:
   - Đối với `freeStartTime` và `freeEndTime`, vì chúng là loại dữ liệu `Long` là timestamp trong `ColumnReq`, trong khi trong `ColumnInfoDO` chúng là loại `Date`, nên sử dụng thuộc tính `expression` để thực hiện chuyển đổi.

### Annotation [@Mapping](/Mapping)

Ở đây, chúng ta sẽ tập trung vào annotation `@Mapping`, khi tên trường hoặc kiểu trường không giống nhau giữa hai đối tượng.

Nói một cách khác, khi tên trường/kiểu trường của hai đối tượng hoàn toàn giống nhau, annotation này hoàn toàn không cần thiết, MapStruct sẽ tự động sao chép.

Ví dụ, nếu tên trường và kiểu trường của SimpleSource và SimpleDestination hoàn toàn giống nhau:

```java
public class SimpleSource {
    private String name;
    private String description;
    // getters và setters
}
 
public class SimpleDestination {
    private String name;
    private String description;
    // getters và setters
}
```

Chỉ cần định nghĩa bộ ánh xạ SimpleSourceDestinationMapper là đủ.

```java
@Mapper
public interface SimpleSourceDestinationMapper {
    SimpleSourceDestinationMapper INSTANCE = Mappers.getMapper(SimpleSourceDestinationMapper.class);
    SimpleDestination sourceToDestination(SimpleSource source);
    SimpleSource destinationToSource(SimpleDestination destination);
}
```

Khi sử dụng, bạn có thể sử dụng `SimpleSourceDestinationMapper.INSTANCE` để thực hiện chuyển đổi.

```java
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = QuickForumApplication.class)
public class SimpleSourceDestinationMapperIntegrationTest {

    @Test
    public void givenSourceToDestination_whenMaps_thenCorrect() {
        SimpleSource simpleSource = new SimpleSource();
        simpleSource.setName("hung");
        simpleSource.setDescription("dev");
        SimpleDestination destination = SimpleSourceDestinationMapper.INSTANCE.sourceToDestination(simpleSource);
        assertEquals(simpleSource.getName(), destination.getName());
        assertEquals(simpleSource.getDescription(), destination.getDescription());
    }
}

```

OK, quay lại với annotation @Mapping

`@Mapping` là một annotation trong MapStruct được sử dụng để định nghĩa các quy tắc ánh xạ giữa các trường. Nó rất linh hoạt và có thể xử lý các trường hợp ánh xạ phức tạp. Dưới đây là một số cách sử dụng phổ biến của `@Mapping`:

1. **Ánh xạ cơ bản**:

   Bằng cách chỉ định `source` và `target` để ánh xạ thuộc tính của đối tượng nguồn sang thuộc tính của đối tượng đích.

```java
@Mapping(source = "name", target = "fullName")
```

   Điều này sẽ ánh xạ thuộc tính `name` của đối tượng nguồn sang thuộc tính `fullName` của đối tượng đích.

2. **Ánh xạ hằng số**:

   Có thể đặt trường đích thành một giá trị hằng số cố định.

```java
@Mapping(target = "status", constant = "ACTIVE")
```

   Điều này sẽ đặt thuộc tính `status` của đối tượng đích thành "ACTIVE".

3. **Giá trị mặc định**:

   Khi thuộc tính nguồn là `null`, có thể đặt giá trị mặc định cho thuộc tính đích.

```java
@Mapping(source = "count", target = "total", defaultValue = "0")
```

   Nếu `count` là `null`, `total` sẽ được đặt thành "0".

4. **Biểu thức**:

   Đối với logic chuyển đổi phức tạp, có thể sử dụng biểu thức Java.

```java
@Mapping(target = "timestamp", expression = "java(source.getDate().getTime())")
```

   Điều này sẽ chuyển đổi đối tượng `Date` thành timestamp.

`@Mapping` cho phép bạn linh hoạt điều chỉnh quy tắc ánh xạ giữa các trường theo nhiều cách khác nhau, tùy thuộc vào yêu cầu cụ thể của bạn.

5. **Định dạng ngày tháng**:

   Đối với ánh xạ giữa ngày tháng và chuỗi, có thể chỉ định định dạng ngày tháng.

```java
@Mapping(source = "date", target = "formattedDate", dateFormat = "yyyy-MM-dd")
```

   Điều này sẽ chuyển đổi đối tượng `Date` thành chuỗi có định dạng "yyyy-MM-dd".

6. **Ánh xạ điều kiện**:

   Sử dụng `qualifiedByName` hoặc `qualifiedBy` để chỉ định một phương thức hoặc annotation điều kiện, những phương thức/annotation này quyết định xem ánh xạ có nên thực hiện hay không.

```java
@Mapping(source = "value", target = "data", qualifiedByName = "specialConverter")
```

   Ở đây, ánh xạ sẽ sử dụng phương thức có tên là `specialConverter`.

7. **Ánh xạ lồng nhau**:

   Khi xử lý các đối tượng lồng nhau, có thể sử dụng cú pháp dấu chấm.

```java
@Mapping(source = "address.street", target = "streetName")
```

   Điều này sẽ ánh xạ thuộc tính `street` của đối tượng `address` trong đối tượng nguồn sang thuộc tính `streetName` của đối tượng đích.

8. **Bỏ qua ánh xạ**:

   Trong một số trường hợp, có thể muốn một thuộc tính cụ thể không được ánh xạ, có thể sử dụng `ignore`.

```java
@Mapping(target = "internalId", ignore = true)
```

   Điều này đảm bảo rằng thuộc tính `internalId` của đối tượng đích không được đặt giá trị.

9. **Sử dụng phương thức ánh xạ tùy chỉnh**:

   Có thể chỉ định phương thức tùy chỉnh để thực hiện ánh xạ.

```java
@Mapping(target = "data", source = "value", qualifiedByName = "customMethod")
```

### Spring Dependency Injection

Cho đến hiện tại, chúng ta đã sử dụng `Mappers.getMapper` để có được INSTANCE của bộ ánh xạ.

```java
ColumnStructMapper INSTANCE = Mappers.getMapper(ColumnStructMapper.class);
```

Trong một môi trường Spring, bạn cũng có thể thêm tham số `componentModel = "spring"` vào annotation [@Mapper](/Mapper) để MapStruct cung cấp Dependency Injection của Spring khi tạo ra các lớp thực hiện ánh xạ.

```java
@Mapper(componentModel = "spring")
public interface ColumnStructMapper {}
```

Điều này cho phép bạn sử dụng `@Autowired` để tiêm vào đối tượng ColumnStructMapper, và sau đó bạn có thể sử dụng nó như sau:

```java
@Autowired
private ColumnStructMapper columnStructMapper;
ColumnInfoDO columnInfoDO = columnStructMapper.toDo(req);
```

Khi đó, bạn không cần phải thêm INSTANCE vào trong interface ánh xạ nữa.

## Plugin MapStruct cho IDEA

Nếu bạn đã cài đặt plugin MapStruct trong Intellij IDEA, bạn có thể tìm kiếm từ khóa MapStruct trực tiếp trong Thị trường plugin.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240417195718.png)

Sau khi cài đặt xong, bạn có thể dễ dàng điều hướng nhanh chóng giữa interface @Mapper và các lớp thực hiện của nó.

## Nguyên lý hoạt động của MapStruct

Quá trình thực thi chương trình Java bắt đầu bằng việc trình biên dịch biên dịch các tệp java thành các tệp byte class, sau đó được JVM thực thi các tệp class này.

MapStruct chính là công cụ giúp chúng ta thực hiện các phương thức chuyển đổi từ tệp java đến class, tức là thực hiện các bước tiền xử lý, biên dịch trước tệp và giúp bạn tránh được việc phải viết mã thủ công, tương tự như sử dụng lombok.

Đầu tiên, hãy xem xét đoạn mã đơn giản nhất của SimpleSourceDestinationMapper, nó được định nghĩa như sau:

```java
@Mapper
public interface SimpleSourceDestinationMapper {
    SimpleSourceDestinationMapper INSTANCE = Mappers.getMapper(SimpleSourceDestinationMapper.class);
    
    SimpleDestination sourceToDestination(SimpleSource source);
    
    SimpleSource destinationToSource(SimpleDestination destination);
}

```

Sau khi biên dịch, sẽ tạo ra hai tệp là SimpleSourceDestinationMapper và SimpleSourceDestinationMapperImpl.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240417195859.png)

Bạn có thể thấy tiền tố của các tệp là "class" thông qua terminal.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240417195922.png)

Tiếp theo, chúng ta sẽ xem nội dung của các tệp class, tất nhiên là thông qua việc giải mã ngược. Đầu tiên là SimpleSourceDestinationMapper.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240417195934.png)

Tiếp theo là lớp thực thi SimpleSourceDestinationMapperImpl, chúng ta sẽ dán mã đã giải mã ngược.

```java
public class SimpleSourceDestinationMapperImpl implements SimpleSourceDestinationMapper {
    public SimpleSourceDestinationMapperImpl() {
    }

    public SimpleDestination sourceToDestination(SimpleSource source) {
        if (source == null) {
            return null;
        } else {
            SimpleDestination simpleDestination = new SimpleDestination();
            simpleDestination.setName(source.getName());
            simpleDestination.setDescription(source.getDescription());
            return simpleDestination;
        }
    }

    public SimpleSource destinationToSource(SimpleDestination destination) {
        if (destination == null) {
            return null;
        } else {
            SimpleSource simpleSource = new SimpleSource();
            simpleSource.setName(destination.getName());
            simpleSource.setDescription(destination.getDescription());
            return simpleSource;
        }
    }
}

```

Nội dung thực tế không khác gì so với việc viết mã Converter thủ công, bằng cách tạo một đối tượng mới và gán giá trị thông qua các phương thức set.

Nếu sử dụng `@Mapper(componentModel = "spring")`, trong quá trình tạo ra, các lớp sẽ được annotation với [@Component](https://chat.openai.com/Component).

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240417200102.png)

> Các lớp được chú thích bằng [@Component](https://chat.openai.com/Component) sẽ được phát hiện và đăng ký vào ApplicationContext trong quá trình quét thành phần của Spring, từ đó biến chúng thành Spring Bean.

Điều này giải thích tại sao chúng ta có thể nhận được mapper object trực tiếp thông qua [@Autowired](https://chat.openai.com/Autowired).

Vì MapStruct không sử dụng Reflect Java trong Runtime để thực hiện việc ánh xạ giữa các đối tượng, mà thay vào đó tạo ra mã Java thông thường, rõ ràng, dễ theo dõi trong quá trình biên dịch. Điều này có nghĩa là nó chạy nhanh hơn vì không có chi phí reflect trong thời gian chạy và tránh được các vấn đề liên quan đến reflect.
