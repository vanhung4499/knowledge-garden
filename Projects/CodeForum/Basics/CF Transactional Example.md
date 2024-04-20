---
title: CF Transactional Example
tags:
  - codeforum
  - project
categories: 
date created: 2024-04-17
date modified: 2024-04-17
---

# Ví dụ sử dụng Transactional

Trong quá trình làm việc thực tế, giao dịch đóng vai trò rất quan trọng, đặc biệt là khi chúng ta mong muốn một nhóm hoạt động hoặc thao tác cụ thể sẽ thành công hoặc thất bại hoàn toàn. Trong cả kịch bản yêu cầu dự án thực tế và phỏng vấn kỹ thuật, chủ đề giao dịch thường là một phần không thể tránh khỏi.  

Trong dự án này, việc áp dụng giao dịch rất nổi bật, đặc biệt là trong các tình huống như việc xuất bản bài viết, nơi mà nó liên quan đến các hoạt động sau:

- Ghi vào bảng bài viết
- Ghi vào bảng chi tiết bài viết
- Gắn thẻ cho bài viết
- Ghi lại lịch sử đọc

Dưới đây là một ví dụ về cách sử dụng thực tiễn của giao dịch trong dự án:

## Ví dụ Sử dụng

### Cách sử dụng giao dịch bằng khai báo

Lấy ví dụ về logic lưu/trình bày bài viết, chúng ta sẽ xem cách triển khai cụ thể như sau:

```java
/**
 * Lưu bài viết, khi articleId tồn tại, biểu thị cập nhật bản ghi; khi không tồn tại, biểu thị chèn
 *
 * @param req
 * @return
 */
@Transactional(rollbackFor = Exception.class)
@Override
public Long saveArticle(ArticlePostReq req, Long author) {
    ArticleDO article = ArticleConverter.toArticleDo(req, author);
    String content = imageService.mdImgReplace(req.getContent());
    if (NumUtil.nullOrZero(req.getArticleId())) {
        return insertArticle(article, content, req.getTagIds());
    } else {
        return updateArticle(article, content, req.getTagIds());
    }
}
```

Cách sử dụng giao dịch được khai báo bằng cách thêm annotation `@Transactional` vào phương thức, và cụ thể như sau:

1. Vị trí annotation:
    
    - Thêm annotation vào phương thức.
    - Thêm annotation vào lớp: **Điều này biểu thị rằng tất cả các phương thức public trong lớp đều hỗ trợ giao dịch.**  

2. Thuộc tính bên trong annotation:

| **Thuộc tính** | **Mô Tả** |
| --- | --- |
| name | Khi có nhiều TransactionManager trong tệp cấu hình, thuộc tính này cho phép chọn lựa TransactionManager nào được sử dụng. |
| propagation | Hành vi truyền giao dịch, giá trị mặc định là REQUIRED. |
| isolation | Độ cô lập của giao dịch, giá trị mặc định là DEFAULT. |
| timeout | Thời gian chờ giao dịch, giá trị mặc định là -1. Nếu giao dịch không hoàn thành sau thời gian này, nó sẽ tự động quay trở lại. |
| read-only | Xác định xem giao dịch có phải là chỉ đọc hay không, giá trị mặc định là false; Để bỏ qua những phương thức không cần giao dịch, chẳng hạn như đọc dữ liệu, bạn có thể đặt read-only là true. |
| rollback-for | Xác định loại ngoại lệ nào có thể gây ra việc quay trở lại giao dịch. Nếu có nhiều loại ngoại lệ cần xác định, bạn có thể phân tách chúng bằng dấu phẩy. |
| no-rollbackfor | Ngoại lệ được chỉ định trong no-rollback-for sẽ không gây ra việc quay trở lại giao dịch. |

**Lưu Ý:**

- **rollback-for: Khi không xác định cụ thể loại ngoại lệ, mặc định chỉ có ngoại lệ chạy thời gian mới sẽ gây ra giao dịch quay trở lại.**

Ví dụ đơn giản sau đây minh họa điều này:

```java
/**
 * Lưu bài viết, khi articleId tồn tại, biểu thị cập nhật bản ghi; khi không tồn tại, biểu thị thêm mới
 */
@Transactional
@Override
public Long saveArticle(ArticlePostReq req, Long author) throws Exception {
    ArticleDO article = ArticleConverter.toArticleDo(req, author);
    String content = imageService.mdImgReplace(req.getContent());
    Long ans;
    if (NumUtil.nullOrZero(req.getArticleId())) {
        ans = insertArticle(article, content, req.getTagIds());
    } else {
        ans = updateArticle(article, content, req.getTagIds());
    }
    throw new Exception("Lỗi được khai báo");
}
```

**Phương thức trên sẽ gây ra một ngoại lệ, nhưng các truy vấn SQL sẽ được thực hiện một cách bình thường, không gây ra việc quay trở lại. Bạn có thể tự thử nghiệm bằng cách thay đổi nó.**

### Cách Sử Dụng Giao Dịch theo Phong Cách Lập Trình

Phong cách sử dụng giao dịch theo khai báo đã có một ràng buộc rõ ràng nhất: phạm vi tối thiểu là mức độ phương thức; khi chúng ta muốn áp dụng ràng buộc giao dịch cho một phần mã trong một phương thức, chúng ta có thể sử dụng giao dịch theo phong cách lập trình.

Vì vậy, phần triển khai trên có một điểm cụ thể có thể được cải thiện: dòng mã `String content = imageService.mdImgReplace(req.getContent());`, trong đó việc lưu trữ hình ảnh, bao gồm việc tải hình ảnh từ mạng và tải lên OSS, thường mất nhiều thời gian. Thực tế, nó hoàn toàn không cần phải được bao gồm trong giao dịch. Thông thường, khi sử dụng giao dịch, hãy nhớ nguyên tắc phạm vi tối thiểu.

Dựa trên điều này, chúng ta sẽ tiến hành cải thiện sử dụng giao dịch theo phong cách lập trình:

1. Trước tiên, tiêm vào phụ thuộc TransactionTemplate

```java
@Autowired
private TransactionTemplate transactionTemplate;
```

2. Chuyển đổi logic trên thành phong cách lập trình:

```java
@Override
public Long saveArticle(ArticlePostReq req, Long author) {
    ArticleDO article = ArticleConverter.toArticleDo(req, author);
    String content = imageService.mdImgReplace(req.getContent());
    return transactionTemplate.execute(new TransactionCallback<Long>() {
        @Override
        public Long doInTransaction(TransactionStatus status) {
            if (NumUtil.nullOrZero(req.getArticleId())) {
                return insertArticle(article, content, req.getTagIds());
            } else {
                return updateArticle(article, content, req.getTagIds());
            }
        }
    });
}
```

**Lưu Ý: Code mới nhất đã sử dụng phong cách lập trình.**

## Tổng kết

### So sánh hai phong cách sử dụng giao dịch

- Khai báo: Dựa trên AOP, mã nguồn ngắn gọn hơn, sử dụng dễ dàng hơn và dễ hiểu hơn.
- Lập trình: Cực kỳ linh hoạt, hoàn toàn do người dùng kiểm soát, có thể kiểm soát phạm vi giao dịch ở mức độ tối thiểu nhất.

### Lưu Ý Khi Sử Dụng Giao Dịch

#### 1. Xác Định Tình Huống Sử Dụng

Đầu tiên, hãy xác định tình huống sử dụng giao dịch, không nên sử dụng giao dịch mà không cần thiết; ví dụ đơn giản là tình huống chỉ đọc, khi nào cần phải sử dụng giao dịch?

- Khi một đơn vị nghiệp vụ cơ bản (như API công cộng, phương thức dịch vụ) có ít nhất hai sự thay đổi dữ liệu, bạn cần xem xét xem việc một phần cập nhật thành công, một phần không thành công có thể dẫn đến dữ liệu bẩn, ảnh hưởng đến hệ thống hay không,
    - Nếu có: xem xét việc sử dụng giao dịch
    - Nếu không: không khuyến khích thêm giao dịch
- Chỉ có một sự thay đổi dữ liệu, nhưng sau đó có sự phụ thuộc mạnh mẽ vào logic dữ liệu, cũng cần phải thêm giao dịch
    - Ví dụ: khi nhận được tin nhắn thanh toán thành công, chúng ta muốn thực hiện một nhiệm vụ kiểm tra dữ liệu nền.
    - Logic nghiệp vụ của chúng tôi là: Đầu tiên, kiểm tra xem giao dịch có hợp lệ không, sau đó cập nhật trạng thái cục bộ thành công, cuối cùng thông báo trạng thái đơn hàng thông qua MQ
    - Lúc này chúng ta cần đặt sự thay đổi dữ liệu ở bước hai và thông báo tin nhắn ở bước ba trong giao dịch, chỉ cần thông báo không thành công, chúng ta vẫn không cập nhật trạng thái cục bộ, tránh trường hợp chúng tôi đã xác nhận thành công nhưng đơn hàng vẫn chưa thanh toán.

#### 2. Tránh Sự Cố

Đặc biệt, đối với các chú thích khai báo, có một số phong cách sử dụng sẽ khiến giao dịch không hoạt động, hãy chú ý đặc biệt; chi tiết xem tại [[CF Transaction Notes]]

#### 3. Lời Khuyên Sử Dụng

- Tránh giao dịch lớn, chỉ thêm giao dịch khi cần thiết
- Chú ý đến tình huống giao dịch phân phối
- Tất cả các thao tác, hãy sử dụng chỉ mục, tránh khóa bảng
- Giảm thiểu phạm vi, tình huống xử lý dữ liệu hàng loạt lớn
- Nếu có hỗ trợ nghiệp vụ, có thể giảm thiểu cấp độ cô lập, một là giảm chi phí phát sinh từ việc cô lập, hai là có thể tránh được một số tình huống deadlock.
