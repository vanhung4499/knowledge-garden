---
title: CF Knife4J API Doc
tags:
  - project
  - codeforum
categories: 
date created: 2024-04-09
date modified: 2024-04-10
---

# API Document: Kinfe4j

## Mở đầu

Ngày mới học code, mỗi khi tôi tạo ra một API, để test nó, tôi dùng Postman để tạo request. Vấn đề ở đây là việc này thực hiện bằng cơm, thủ công. Trong các dự án thực tế, backend cần phải trả API Doc cho Frontend để làm việc, việc chỉnh sửa thủ công như thế rất mất thời gian, nếu có quá nhiều api thì nó sẽ rất nhàm chán. Hơn thế mỗi lần cập nhật, bạn sẽ phải sửa lại API Doc và gửi lại hoặc yêu cầu phái Frontend phải cập nhật API Doc. Cần một công cụ tự tạo các API Doc để không phải làm thủ công, đó chính là Swagger.

Nếu bạn đã từng code SpringBoot thì khả năng cao bạn đã sử dụng qua Swagger. Swagger là công cụ tạo tự động và kiểm thử API như đã nói ở trên. Ở thời điểm đầu khi phát triển SpringBoot hay NestJS chắc chắn tôi sẽ sử dụng Swagger. Swagger sẽ dựa trên code của bạn mà sinh ra các API Doc tức là bạn sửa code thì api doc cũng sẽ được sửa theo, bạn chỉ cần tập trung vào code.

Nhưng mà vì cái tiêu đề bài viết này thì tôi không phải giới thiệu Swagger, chắc nó có vấn đề! Đúng thế, khi số lượng API lớn, việc nhồi nhét tất cả api doc vào cùng 1 trang web đó không có điều hướng, mỗi api doc có thể dài hơn cái màn hình của bạn, việc lăn chuột hay gõ phím để tìm đến api bạn muốn cũng sẽ gây khó chịu. Phần mô tả các request/response data cũng không thực linh hoạt, đôi lúc nó thực sự khó nhìn, dài dòng!

Khi tôi đọc một blog của một lập trình viên JAVA Trung Quốc, tôi mới biết tới Kinfe4j, một sự bù đắp hoàn hảo thiếu sót cho Swagger, đẹp và thân thiện hơn.

## Giới thiệu Swagger

Nói chính xác thì Swagger là mộti dịch vụ web hoàn chỉnh để tạo và gọi các RESTFul API. Nó cung cấp nhiều thành phần chẳng hạn như:

- Swagger Editor
- Swagger UI
- Swagger Codegen
- …  
Cụ thể bạn có thể tìm hiểu ở trang chủ [Swagger](https://swagger.io/)

Về ví dụ và vấn đề tôi đã nói ở phía trên.

Ngày xưa khi mới dùng tôi có thể xem giao diện của Swager trông cũng ổn. Nhưng sau khi dùng Knife4J tôi thấy nó thực sự tệ: `Knife4j = Swagger + Postman`

## Giới thiệu Knife4j

Tiền thân của Knife4j là swagger-bootstrap-ui, là một triên khai giao diện người dùng nâng cao của springfox-swagger-ui. Knife4j là bản cải tiến hơn, nhẹ hơn và mạnh hơn.

Knife4j cải tiến không phải chỉ mỗi giao diện trực quan và bắt mắt hơn mà còn mạnh mẽ hơn về chức năng: code backend và module frontend ui được tách riêng, giúp nó linh hoạt hơn trong microservice.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240409234043.png)

Ngoài ra, Knife4j còn hỗ trợ:

- Sử dụng markdown trong api doc có thể tăng tính dễ đọc và dễ bảo trì
- Xuất api doc sang HTML, PDF hoặc markdwon offline để dễ chia sẻ
- Hỗ trợ sử dụng các cấu hình API Doc khác nhau trong môi trường khác nhau (dev, prod, test, …)
- Hỗ trợ các tham số độkng, cho phép sửa đổi tham số yêu cầu API khi chạy, cải thiện tính linh hoạt trong kiểm thử  

Nhược điểm lớn nhất của nó là nó không có tài liệu tiếng anh, chỉ có tiếng trung. Tôi cũng phải dùng google dịch để tìm hiểu nó!

Địa chỉ trang chủ: [Knife4j · 集Swagger2及OpenAPI3为一体的增强解决方案. | Knife4j](https://doc.xiaominfo.com/)

## Tích hợp Knife4j

Kinfe4j tuân thủ theo Swagger nên cách sử dụng không khác gì nhiều.

Đầu tiên là thêm phụ thuốc và `pom.xml`

```xml
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>knife4j-openapi2-spring-boot-starter</artifactId>
    <version>${knife4j-version}</version>
</dependency>
```

Không cần thêm springfox-boot-starter mà Swagger yêu cầu, vì trong Knife4j đã có sẵn.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240410082314.png)

Thứ hai là tạo một lớp cấu hình Java (vd như `Knife4jConfig.java`) và sử dụng annotation @EnableKnife4j để kích hoạt.

```java
@Configuration
@EnableOpenApi
public class SwaggerConfig {
    @Bean
    public Docket docket() {
        Docket docket = new Docket(DocumentationType.OAS_30)
                .apiInfo(apiInfo()).enable(true)
                .select()
                //apis： Add swagger interface extraction scope
                .apis(RequestHandlerSelectors.basePackage("com.hnv99.forum.controller"))
                .paths(PathSelectors.any())
                .build();

        return docket;
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("CodeForum")
                .description("A community system based on Spring Boot, MyBatis-Plus, MySQL, Redis, ElasticSearch, MongoDB, Docker, RabbitMQ and other technology stacks. It is a modern community project that is very suitable for secondary development/practical combat 👍.")
                .contact(new Contact("Hung Nguyen","vanhung4499@gmail.com"))
                .version("v1.0")
                .build();
    }
}

```

Hoặc bạn cũng có thể không tạo lớp cấu hình Java, thay vào đó có thể đạt được mục tiêu tương tự bằng cách thiết lập các thuộc tính trong tệp `application.yml`.

```yml
# knife4j  
knife4j:  
  enable: true  
  setting:  
    language: en-US  
  openapi:  
    title: CodeForum  
    description: A community system based on Spring Boot, MyBatis-Plus, MySQL, Redis, ElasticSearch, MongoDB, Docker, RabbitMQ and other technology stacks. It is a modern community project that is very suitable for secondary development/practical combat 👍.  
    version: 1.0.0  
    concat:  
      - Hung Nguyen Van  
      - https://vanhung4499.com  
      - https://github.com/vanhung4499/code4rum  
    license: Apache License 2.0  
    license-url: https://github.com/vanhung4499/code4rum/blob/main/License  
    email: vanhung4499@gmail.com  
    group:  
      admin:  
        group-name: Admin Backend Interface Group  
        api-rule: package  
        api-rule-resources:  
          - com.hnv99.forum.web.admin  
      front:  
        group-name: Frontend Interface Group  
        api-rule: package  
        api-rule-resources:  
          - com.hnv99.forum.web.front
```

Trong các phiên bản trước, chúng ta cần sử dụng `@EnableKnife4j` trong tệp cấu hình để kích hoạt tính năng tăng cường, từ phiên bản 2.0.6 trở lên, chỉ cần cấu hình `knife4j.enable=true` trong tệp cấu hình là đủ.

Dưới đây là mô tả từng thuộc tính:

① `knife4j.enable`: Đặt thành true để kích hoạt Knife4j, cho phép hiển thị giao diện người dùng Knife4j trong ứng dụng.

② `knife4j.openapi`: Thuộc tính này chứa các thông tin siêu dữ liệu cơ bản của tài liệu API Swagger, chẳng hạn như tiêu đề, mô tả, phiên bản, v.v.

- `title`: Tiêu đề của tài liệu API.
- `description`: Mô tả chi tiết của tài liệu API.
- `version`: Số phiên bản của tài liệu API.
- `concat`: Thông tin tác giả của tài liệu API. Bao gồm tên tác giả, trang web và kho lưu trữ GitHub.
- `license`: Loại giấy phép của tài liệu API.
- `license-url`: Liên kết đến giấy phép của tài liệu API.
- `email`: Email liên hệ của tác giả tài liệu API.

③ `knife4j.group`: Xác định các nhóm API. Ở đây có hai nhóm: admin và front.

**admin**: Nhóm các api quản trị.

- `group-name`: Tên nhóm.
- `api-rule`: Quy tắc nhóm, ở đây sử dụng quy tắc gói.
- `api-rule-resources`: Chỉ định tên gói, Knife4j sẽ quét tất cả các API Interface trong gói này và thêm chúng vào nhóm này.

front: Nhóm api frontend, các thuộc tính dưới đây tương tự như admin.

Bước thứ ba, thêm giao diện Knife4j vào lớp kiểm thử.

```java
@ApiOperation("Test Knife4j")
@RequestMapping(value ="/testKnife4j", method = RequestMethod.POST)
public String testKnife4j() {
    return "Test Kinfe4j";
}
```

Ở đây, giải thích về các annotation @ApiOperation, @ApiParam, @ApiModel.

① @ApiOperation: Dùng để mô tả một hoạt động API cụ thể. Thông thường được sử dụng để đánh dấu trên các phương thức của lớp Controller. Nó có ba thuộc tính chính sau:

- value: Mô tả ngắn gọn về hoạt động API, sẽ hiển thị trong tài liệu API.
- notes: Mô tả chi tiết về hoạt động API, sẽ hiển thị trong tài liệu API.
- tags: Nhãn của hoạt động API, được sử dụng để phân loại và nhóm hoạt động API.

Ví dụ:

```java
@ApiOperation(value = "Lấy thông tin người dùng", notes = "Lấy thông tin chi tiết của người dùng dựa trên ID người dùng")
```

② @ApiParam: Dùng để mô tả tham số của hoạt động API. Thông thường được sử dụng để đánh dấu trên tham số của phương thức của lớp Controller. Nó có các thuộc tính chính sau:

- name: Tên của tham số.
- value: Mô tả về tham số.
- required: Xác định liệu tham số có bắt buộc không, mặc định là false.
- defaultValue: Giá trị mặc định của tham số.
- allowableValues: Phạm vi giá trị cho phép của tham số.

Ví dụ:

```java
public ResponseEntity<User> getUser(@ApiParam(value = "ID người dùng", required = true) @PathVariable("id") Long id) {
    // ...
}
```

③ @ApiModel: Dùng để mô tả một mô hình dữ liệu được trả về hoặc yêu cầu bởi hoạt động API. Thông thường được sử dụng để đánh dấu trên lớp thực thể hoặc DTO. Nó có các thuộc tính chính sau:

- value: Tên của mô hình.
- description: Mô tả về mô hình.

Ví dụ:

```java
@ApiModel(value = "Người dùng", description = "Thông tin chi tiết về người dùng")
public class User {
    // ...
}
```

Bước thứ tư là chạy dự án, sau đó truy cập vào trình duyệt và nhập địa chỉ [http://localhost:8080/doc.html](http://localhost:8080/doc.html) vào thanh địa chỉ để xem tài liệu API.

## Ưu điểm của Knife4j

Knife4j đã tối ưu hóa giao diện người dùng và thêm vào một số tính năng hữu ích trên cơ sở của Swagger, làm cho tài liệu API trở nên dễ đọc và dễ sử dụng hơn. Dưới đây là một số tính năng đặc biệt của Knife4j:

### Tính năng vô hiệu hoá ở môi trường product

Nếu bạn cần vô hiệu hoá các tài nguyên liên quan đến Swagger trong môi trường product, chỉ cần thêm cấu hình sau vào tệp `application.yml`.

```yaml
# Bật tính năng tắt ở  môi trường product
production: true
```

Lưu ý, cấu hình phải chứa ít nhất một tùy chọn `knife4j.setting`. Ví dụ:

```yaml
knife4j:
  setting:
    language: en-US
```

Nếu không, sẽ gặp lỗi.

### Kiểm soát quyền truy cập vào trang

Mặc định, tất cả người dùng đều có thể truy cập doc.html, tức trang chính của Knife4j, mà không có bất kỳ hạn chế nào. Tuy nhiên, nếu bạn cần thêm kiểm soát truy cập, bạn có thể kích hoạt chức năng xác thực cơ bản (Basic Authentication) trong tệp `application.yml`.

```yaml
basic:
  enable: true
  # Cấu hình tên người dùng và mật khẩu cho xác thực Basic
  username: admin
  password: 123456
```

Sau đó, khi truy cập vào API, bạn sẽ cần đăng nhập bằng tên người dùng và mật khẩu.

Thông qua các tính năng này, Knife4j mang lại sự linh hoạt và bảo mật trong việc quản lý tài liệu API.

### Hỗ trợ afterScript

Đối với các API Interface loại JWT, sau khi gọi giao diện đăng nhập, mỗi yêu cầu giao diện sẽ cần mang theo tham số Token. Ở đây, bạn có thể sử dụng kịch bản để tự động gán giá trị cho tham số token toàn cục, tiết kiệm công việc sao chép và dán.

```javascript
var code = ke.response.data.code;
if (code == 8200) {
    // Kiểm tra, chỉ thực thi nếu mã phản hồi từ máy chủ là 8200
    // Nhận token
    var token = ke.response.data.data.token;
    // 1. Nếu tham số là Header, sau đó thiết lập Header toàn cục trong nhóm logic hiện tại
    ke.global.setHeader("token", token);
}
```

### Hỗ trợ tham số toàn cục

Khi một số yêu cầu cần tham số toàn cục, chức năng này sẽ rất hữu ích, bạn có thể tìm thấy nó trong menu bên trái "Quản lý tài liệu". Knife4j hỗ trợ hai cách: header và query.

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/b81f0732-503b-4d50-884d-f2922ef1a9b3.png)

### Hỗ trợ tài liệu ngoại tuyến

Knife4j hỗ trợ xuất API tài liệu thành tài liệu ngoại tuyến (hỗ trợ định dạng markdown, HTML, Word, vv.).

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/23f4287a-8d3f-45bd-9bbb-7d74de1d41ea.png)

Thông qua các tính năng này, Knife4j giúp quản lý tài liệu API trở nên linh hoạt và thuận tiện hơn, đặc biệt là trong các kịch bản sử dụng JWT.

### Hỗ trợ tài liệu ngoại tuyến

Knife4j cho phép xuất tài liệu API thành tài liệu ngoại tuyến (hỗ trợ các định dạng markdown, HTML, Word, v.v.).

![](https://files.mdnice.com/user/3903/23f4287a-8d3f-45bd-9bbb-7d74de1d41ea.png#id=Jr4vn&originHeight=998&originWidth=2278&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### Hỗ trợ thu gọn JSON

Swagger không hỗ trợ việc gập JSON, khi thông tin trả về quá nhiều, giao diện sẽ trở nên rất lộn xộn. Tuy nhiên, Knife4j lại khác, nó cho phép gập các nút JSON trả về.

![](https://files.mdnice.com/user/3903/16ad5f11-1454-49ac-b381-9db4eb66e5eb.png#id=DK8xs&originHeight=1612&originWidth=2594&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### Hỗ trợ tìm kiếm giao diện API

Swagger không có tính năng tìm kiếm, khi cần thử nghiệm nhiều giao diện API, việc tìm kiếm một giao diện cụ thể sẽ gặp khó khăn, chỉ có thể cuộn từng giao diện một. Trong khi đó, Knife4j cung cấp tính năng tìm kiếm tài liệu ngay trên góc phải của trang, bạn chỉ cần nhập từ khóa cần tìm kiếm và chọn lọc.

![](https://files.mdnice.com/user/3903/284ccb45-293d-48f5-adbe-568ed780c70d.png#id=Y08Dd&originHeight=1612&originWidth=2594&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

Hiện nay, hỗ trợ tìm kiếm địa chỉ giao diện API, tên và mô tả.

## Kết luận

Ngoài những tính năng đã đề cập ở trên, Knife4j còn cung cấp nhiều thuộc tính hữu ích khác. Bạn có thể tìm hiểu và trải nghiệm trên trang web chính thức của Knife4j, tôi không tiếp tục giới thiệu từng tính năng một ở đây.
