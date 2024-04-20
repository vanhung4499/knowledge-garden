---
title: CF Email Service
tags:
  - codeforum
  - project
categories: 
date created: 2024-04-17
date modified: 2024-04-17
---

# Tích hợp email service

Trong một số trường hợp, công nghệ không hỗ trợ đăng nhập thông qua email, nhưng vẫn tích hợp dịch vụ email, chủ yếu được sử dụng để cảnh báo về các trường hợp ngoại lệ. Dựa trên nhật ký lỗi, kích hoạt một cơ chế cảnh báo email khi xuất hiện lỗi ngoại lệ, từ đó gửi đống lỗi đến người quản lý. Dựa trên điều này, một dịch vụ cảnh báo có chi phí gần như không đáng kể được xây dựng.

Trước khi cụ thể hóa việc thiết kế và triển khai cơ chế cảnh báo từ nhật ký, chúng ta cần bổ sung kiến thức về cách tích hợp dịch vụ email cho dịch vụ của chúng ta và cách sử dụng dịch vụ email để gửi mail.

## Ví dụ sử dụng

### Lớp đóng gói dịch vụ Email

Đầu tiên trong dự án của bạn, hãy tìm kiếm toàn bộ dự án để định vị các địa điểm cụ thể sử dụng từ khóa `Email`.

Bạn có thể nhanh chóng tìm thấy lớp quan trọng `EmailUtil`. Hãy xem một cách đơn giản cách nó được triển khai:

```java
@Slf4j
public class EmailUtil {

    private static volatile String from;

    /**
     * Gets the sender email address.
     */
    public static String getFrom() {
        if (from == null) {
            synchronized (EmailUtil.class) {
                if (from == null) {
                    from = SpringUtil.getConfig("spring.mail.from", "hnv99@gmail.com");
                }
            }
        }
        return from;
    }

    /**
     * Sends an email using the Spring Boot email package.
     *
     * @param title The title of the email.
     * @param to The recipient email address.
     * @param content The content of the email.
     * @return true if the email is sent successfully, false otherwise.
     */
    public static boolean sendMail(String title, String to, String content) {
        try {
            JavaMailSender javaMailSender = SpringUtil.getBean(JavaMailSender.class);
            MimeMessage mimeMailMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMailMessage, true);
            mimeMessageHelper.setFrom(getFrom());
            mimeMessageHelper.setTo(to);
            mimeMessageHelper.setSubject(title);
            // Email content with support for HTML templates
            mimeMessageHelper.setText(content, true);
            // Fix for the "JavaMailSender no object DCH for MIME type multipart/mixed" issue
            Thread.currentThread().setContextClassLoader(EmailUtil.class.getClassLoader());
            javaMailSender.send(mimeMailMessage);
            return true;
        } catch (Exception e) {
            log.warn("sendEmail error {}@{}, {}", title, to, e);
            return false;
        }
    }
}

```

Đoạn mã trên không cần quan tâm chi tiết cụ thể, hãy xem kết quả sử dụng trước.

### Ví dụ Sử dụng

Trong dự án, chúng tôi đã đặc biệt thêm một `TestController` để cho mọi người trải nghiệm một số tính năng cơ bản, như việc cung cấp một giao diện kiểm tra dựa trên dịch vụ email.

```java
@Slf4j
@RestController
@RequestMapping(path = "test")
public class TestController {
    private AtomicInteger cnt = new AtomicInteger(1);

    /**
     * Test email sending
     *
     * @param req Email request object
     * @return Response object indicating the success or failure of the email sending operation
     */
    @RequestMapping(path = "email")
    public ResVo<String> email(EmailReqVo req) {
        if (StringUtils.isBlank(req.getTo()) || req.getTo().indexOf("@") <= 0) {
            return ResVo.fail(Status.newStatus(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "Invalid email recipient"));
        }
        if (StringUtils.isBlank(req.getTitle())) {
            req.setTitle("Test email sending from Tech Department");
        }
        if (StringUtils.isBlank(req.getContent())) {
            req.setContent("Test content for email sending from Tech Department");
        } else {
            // Escaping the email content to avoid potential security issues
            req.setContent(StringEscapeUtils.escapeHtml4(req.getContent()));
        }

        boolean ans = EmailUtil.sendMail(req.getTitle(), req.getTo(), req.getContent());
        log.info("Test email sent, count: {}, content: {}", cnt.addAndGet(1), req);
        return ResVo.ok(String.valueOf(ans));
    }
}
```

## Tích hợp Dịch vụ Email

Sau khi đã thấy cách sử dụng trong các tình huống thực tế, tiếp theo chúng ta sẽ tìm hiểu cách tích hợp dịch vụ email vào dự án của chúng ta.

### Cấu hình

Trong tệp `pom.xml`, chúng ta cần thêm các phụ thuộc sau:

```xml
<dependencies>
    <!-- Core dependency for email sending -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-mail</artifactId>
    </dependency>
    <!-- Dependency for sending emails in HTML template format, using FreeMarker for HTML template rendering -->
    <!-- Although Tech Department primarily uses Thymeleaf for template rendering, here we'll use FreeMarker for email template rendering to provide you with additional knowledge -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-freemarker</artifactId>
    </dependency>
</dependencies>

```

Tiếp theo, chúng ta cần thêm cấu hình liên quan đến email vào tệp cấu hình, ở đây là `application-email.yml`. Tôi sử dụng email của google để gửi email, nếu bạn sử dụng email khác, vui lòng điều chỉnh cấu hình tương ứng.

```yml
# Email configuration
spring:  
  mail:  
    host: smtp.gmail.com  
    from: vanhung4499@gmail.com  
    # Fill in your own sender username and authorization code  
    username:  
    password:  
    default-encoding: UTF-8  
    port: 465  
    properties:  
      mail:  
        smtp:  
          socketFactory:  
            port: 465  
            class: javax.net.ssl.SSLSocketFactory  
            fallback: false  
          auth: true  
          starttls:  
            enable: true  
            required: true

```

Nhớ điền thông tin tên người dùng và mật khẩu của bạn để có thể gửi email từ tài khoản của bạn.

### Gửi Email

Tiếp theo, chúng ta sẽ giới thiệu một số phương pháp gửi email đơn giản.

#### Gửi Email Văn bản Cơ bản

Ở đây, chúng ta sẽ sử dụng trực tiếp `JavaMailSender` để gửi một email văn bản cơ bản.

```java
@Service
public class MailDemo {
    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.from:vanhung4499@gmail.com}")
    private String from;

    private void basicSend() {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        // Người gửi email
        simpleMailMessage.setFrom(from);
        // Người nhận email, có thể là nhiều người, tham số là biến đổi
        simpleMailMessage.setTo("kirito4499@gmail.com");
        // Tiêu đề email
        simpleMailMessage.setSubject("Thử gửi email từ Spring Boot");
        // Nội dung email
        simpleMailMessage.setText("Nội dung email đơn giản");

        javaMailSender.send(simpleMailMessage);
    }
}
```

- JavaMailSender: Sử dụng trực tiếp như một bean Spring.
- SimpleMailMessage: Đối tượng email đơn giản, chứa các thông tin cơ bản khi gửi email.
   - from: Người gửi
   - replyTo: Người nhận hồi đáp email
   - to: Người nhận
   - cc: Sao chép
   - bcc: Bí mật
   - subject: Chủ đề, tức là tiêu đề email
   - text: Nội dung email, định dạng văn bản
   - date: Thời gian gửi email

#### Gửi Email HTML

Đối với việc gửi email với nội dung HTML, chúng ta có thể sử dụng `MimeMessage` thay vì `SimpleMailMessage` như ở trên. Điều này cho phép chúng ta tạo nội dung email với định dạng HTML để có giao diện đẹp hơn.

```java
/**
 * Send HTML email
 */
public void sendHtml() throws MessagingException {
    MimeMessage mimeMailMessage = javaMailSender.createMimeMessage();
    MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMailMessage, true);
    mimeMessageHelper.setFrom(from);
    mimeMessageHelper.setTo("kirito4499@gmail.com");
    mimeMessageHelper.setSubject("SpringBoot Test Email");

    // Email content
    mimeMessageHelper.setText("<h1>Hello World</h1> <br/> " +
            "<div> Welcome to click <a href=\"https://codeforum.com\">CodeForum</a><br/>" +
            "</div>", true);

    javaMailSender.send(mimeMailMessage);
}

```

**Lưu ý**

- Lưu ý đối số thứ hai của phương thức `setText` ở trên, nó phải là `true`, nếu không email sẽ được gửi dưới dạng văn bản thô.

#### Thêm Tệp đính kèm

Khi gửi email, chúng ta có thể muốn đính kèm một hoặc nhiều tệp tin. Trong ví dụ dưới đây, chúng ta sẽ thêm một tệp ảnh vào email.

```java
/**
 * Send email with attachment
 */
public void sendWithFile() throws MessagingException, IOException {
    MimeMessage mimeMailMessage = javaMailSender.createMimeMessage();
    MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMailMessage, true);
    mimeMessageHelper.setFrom(from);
    mimeMessageHelper.setTo("kirito4499@gmail.com");
    mimeMessageHelper.setSubject("SpringBoot Test Email");

	mimeMessageHelper.setText("<h1>Hello World</h1> <br/> " +
            "<div> Welcome to click <a href=\"https://codeforum.com\">CodeForum</a><br/>" +
            "</div>", true);

    String url = "https://runcode-app-public.s3.amazonaws.com/images/spring-ide-online-editor-compiler.original.png";
    URL imgUrl = new URL(url);
    mimeMessageHelper.addAttachment("img.jpg", imgUrl::openStream);

    javaMailSender.send(mimeMailMessage);
}

```

Chú ý rằng, chúng ta sử dụng phương thức `addAttachment` để thêm tệp đính kèm. Trong ví dụ này, chúng ta thêm một ảnh từ một URL, sau đó sử dụng phương thức `openStream` của URL để mở một luồng đọc tệp và truyền nó vào phương thức `addAttachment`.

#### Mẫu Freemaker

Trong phần gửi email, việc tự mình tạo HTML cho nội dung email có thể không phải là một cách làm tốt nhất. Sử dụng một trình kết xuất trang để hỗ trợ mẫu email là một giải pháp phổ biến, và ở đây chúng ta sẽ giới thiệu cách triển khai với Freemaker.

Đầu tiên, chúng ta sẽ viết một mẫu email `resources/template/mail.ftl`.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="SpringBoot thymeleaf"/>
    <meta name="author" content="YiHui"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Email Template</title>
</head>
<style>
    .title {
        color: #c00;
        font-weight: normal;
        font-size: 2em;
    }

    .content {
        color: darkblue;
        font-size: 1.2em;
    }

    .sign {
        color: lightgray;
        font-size: 0.8em;
        font-style: italic;
    }
</style>
<body>

<div>
    <div class="title">${title}</div>
    <div class="content">${content}</div>
</div>
</body>
</html>

```

Trong mẫu trên, chúng ta xác định hai biến: `title` và `content`, đây là những giá trị mà chúng ta sẽ thay thế.

Tiếp theo là ví dụ về việc gửi email.

```java
import freemarker.template.Configuration;

@Autowired
private Configuration configuration;

/**
 * Freemarker template
 */
public void freeMakerTemplate() throws MessagingException, IOException, TemplateException {
    MimeMessage mimeMailMessage = javaMailSender.createMimeMessage();
    MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMailMessage, true);
    mimeMessageHelper.setFrom(from);
    mimeMessageHelper.setTo("kirito4499@gmail.com");
    mimeMessageHelper.setSubject("SpringBoot Test Email");

    Map<String, Object> map = new HashMap<>();
    map.put("title", "Email Subject");
    map.put("content", "Email Body");
    String text = FreeMarkerTemplateUtils.processTemplateIntoString(configuration.getTemplate("mail.ftl"), map);
    mimeMessageHelper.setText(text, true);

    String url = "https://runcode-app-public.s3.amazonaws.com/images/spring-ide-online-editor-compiler.original.png";
    URL imgUrl = new URL(url);
    mimeMessageHelper.addAttachment("img.jpg", imgUrl::openStream);

    javaMailSender.send(mimeMailMessage);
}

```

Chú ý rằng, chúng ta sử dụng `FreeMarkerTemplateUtils` để kết hợp mẫu và dữ liệu, và sau đó chúng ta chèn HTML vào phương thức `setText`. Điều này cho phép chúng ta tạo nội dung email từ một mẫu được định nghĩa trước.

## Tổng kết

Hướng dẫn này đã giới thiệu cách tích hợp dịch vụ email, cách gửi email và cung cấp các ví dụ về gửi email với nội dung văn bản đơn giản, nội dung HTML và đính kèm tệp. Tổng quan, việc sử dụng không quá phức tạp, nhưng có một số thuật ngữ liên quan đến email mà bạn nên biết:

- to: Người nhận, là mục tiêu của email.
- cc: Sao chép, thường là danh sách người nhận được thông báo, là người biết được.
- bcc: Ẩn sao chép, khác biệt lớn nhất so với hai loại trên là người nhận và sao chép không biết ai được ẩn sao chép.
