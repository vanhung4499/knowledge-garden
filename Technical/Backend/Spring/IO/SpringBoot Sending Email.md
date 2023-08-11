---
title: SpringBoot Sending Email
tags: [spring, java, backend]
categories: [spring, java, backend]
date created: 2023-08-11
date modified: 2023-08-11
---

# Gửi email trong Spring Boot

## Giới thiệu

Cách đơn giản nhất để gửi và nhận email trong Spring Boot là sử dụng `spring-boot-starter-mail`.

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

`spring-boot-starter-mail` thực chất sử dụng JavaMail (javax.mail). Nếu bạn muốn tìm hiểu thêm về JavaMail, bạn có thể tham khảo: [Hướng dẫn sử dụng JavaMail](https://dunwu.github.io/java-tutorial/#/javalib/javamail)

## API

Spring Framework cung cấp một cách tiếp cận đơn giản để gửi email bằng cách sử dụng giao diện `JavaMailSender`, đây là API chính để gửi email.

Các API được cung cấp bởi giao diện `JavaMailSender` như sau:

![img](https://raw.githubusercontent.com/dunwu/images/dev/snap/20190110111102.png)

## Cấu hình

Spring Boot cung cấp cấu hình tự động và mô-đun khởi động cho `JavaMailSender`.

Nếu `spring.mail.host` và các thư viện liên quan (được xác định bởi `spring-boot-starter-mail`) có sẵn, Spring Boot sẽ tạo ra một `JavaMailSender` mặc định (nếu chưa tồn tại). Bạn có thể tùy chỉnh người gửi bằng cách sử dụng các cấu hình trong không gian tên `spring.mail`.  
Đặc biệt là, một số giá trị timeout mặc định là vô hạn, bạn có thể thay đổi chúng để tránh việc máy chủ email không phản hồi và làm chặn luồng, như ví dụ sau:

```properties
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=3000
spring.mail.properties.mail.smtp.writetimeout=5000
```

Bạn cũng có thể sử dụng cấu hình phiên bản hiện có trong JNDI cho `JavaMailSender`:

```
spring.mail.jndi-name=mail/Session
```

Dưới đây là các cấu hình liên quan đến Mail trong Spring Boot:

Để biết thêm thông tin chi tiết, vui lòng xem [`MailProperties`](https://github.com/spring-projects/spring-boot/tree/v2.1.1.RELEASE/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/mail/MailProperties.java).

```properties
# Email (MailProperties)
spring.mail.default-encoding=UTF-8 # Default MimeMessage encoding.
spring.mail.host= # SMTP server host. For instance, `smtp.example.com`.
spring.mail.jndi-name= # Session JNDI name. When set, takes precedence over other Session settings.
spring.mail.password= # Login password of the SMTP server.
spring.mail.port= # SMTP server port.
spring.mail.properties.*= # Additional JavaMail Session properties.
spring.mail.protocol=smtp # Protocol used by the SMTP server.
spring.mail.test-connection=false # Whether to test that the mail server is available on startup.
spring.mail.username= # Login user of the SMTP server.

```

## Triển khai

### Thêm các phụ thuộc

```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
  </dependency>

  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
  </dependency>
  <dependency>
    <groupId>com.github.dozermapper</groupId>
    <artifactId>dozer-spring-boot-starter</artifactId>
    <version>6.4.0</version>
  </dependency>
</dependencies>
```

### Cấu hình thuộc tính email

Thêm tệp cấu hình `application-163.properties` vào thư mục `src/main/resources`, nội dung như sau:

```properties
spring.mail.host = smtp.163.com
spring.mail.username = xxxxxx
spring.mail.password = xxxxxx
spring.mail.properties.mail.smtp.auth = true
spring.mail.properties.mail.smtp.starttls.enable = true
spring.mail.properties.mail.smtp.starttls.required = true
spring.mail.default-encoding = UTF-8

mail.domain = 163.com
mail.from = ${spring.mail.username}@${mail.domain}
```

Lưu ý: Thay thế `spring.mail.username` và `spring.mail.password` bằng tên người dùng và mật khẩu hợp lệ.

Tệp cấu hình `application-163.properties` đại diện cho cấu hình khi sử dụng hộp thư 163. Để kích hoạt nó, cần sử dụng `spring.profiles.active = 163`.

Thêm tệp cấu hình `application.properties` vào thư mục `src/main/resources`, nội dung như sau:

```properties
spring.profiles.active = 163
```

### Java Code

Trước tiên, chúng ta cần đọc một số thuộc tính cấu hình, phương thức như sau:

```java
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

@Validated
@Component
@ConfigurationProperties(prefix = "mail")
public class MailProperties {
    private String domain;
    private String from;

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }
}
```

Tiếp theo, định nghĩa một lớp thực thể tham số email (sử dụng lombok để rút gọn getter, setter):

```java
import lombok.Data;
import java.util.Date;

@Data
public class MailDTO {
    private String from;
    private String replyTo;
    private String[] to;
    private String[] cc;
    private String[] bcc;
    private Date sentDate;
    private String subject;
    private String text;
    private String[] filenames;
}
```

Sau đó, triển khai giao diện chức năng gửi email:

```java
import com.github.dozermapper.core.Mapper;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import java.io.IOException;

@Service
public class MailService {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private MailProperties mailProperties;

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private Mapper mapper;

    public void sendSimpleMailMessage(MailDTO mailDTO) {
        SimpleMailMessage simpleMailMessage = mapper.map(mailDTO, SimpleMailMessage.class);
        if (StringUtils.isEmpty(mailDTO.getFrom())) {
            mailDTO.setFrom(mailProperties.getFrom());
        }
        javaMailSender.send(simpleMailMessage);
    }

    public void sendMimeMessage(MailDTO mailDTO) {

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper messageHelper;
        try {
            messageHelper = new MimeMessageHelper(mimeMessage, true);

            if (StringUtils.isEmpty(mailDTO.getFrom())) {
                messageHelper.setFrom(mailProperties.getFrom());
            }
            messageHelper.setTo(mailDTO.getTo());
            messageHelper.setSubject(mailDTO.getSubject());

            mimeMessage = messageHelper.getMimeMessage();
            MimeBodyPart mimeBodyPart = new MimeBodyPart();
            mimeBodyPart.setContent(mailDTO.getText(), "text/html;charset=UTF-8");

            // Mô tả mối quan hệ dữ liệu
            MimeMultipart mm = new MimeMultipart();
            mm.setSubType("related");
            mm.addBodyPart(mimeBodyPart);

            // Thêm tệp đính kèm email
            for (String filename : mailDTO.getFilenames()) {
                MimeBodyPart attachPart = new MimeBodyPart();
                try {
                    attachPart.attachFile(filename);
                } catch (IOException e) {
                    e.printStackTrace();
                }
                mm.addBodyPart(attachPart);
            }
            mimeMessage.setContent(mm);
            mimeMessage.saveChanges();

        } catch (MessagingException e) {
            e.printStackTrace();
        }

        javaMailSender.send(mimeMessage);
    }
}
```
