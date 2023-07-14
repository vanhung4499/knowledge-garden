---
title: Java Internationalization
tags: [java, javase]
categories: [java, javase]
date created: 2023-07-14
date modified: 2023-07-14
---

# Java Internationalization

## Kiến thức nền tảng

Với sự phát triển của viễn thông, sự giao tiếp giữa các quốc gia trên thế giới ngày càng trở nên gần gũi hơn. Nhiều sản phẩm phần mềm cũng phải hướng đến người dùng ở các quốc gia khác nhau trên thế giới. Trong đó, rào cản ngôn ngữ rõ ràng là một vấn đề quan trọng khi tiếp thị sản phẩm cho người dùng từ nhiều ngôn ngữ khác nhau.

Bài viết này xoay quanh chủ đề quốc tế hóa, trước tiên giới thiệu về mã hóa ngôn ngữ theo tiêu chuẩn quốc tế, sau đó giải thích cách thực hiện quốc tế hóa trong ứng dụng Java.

### Mã hóa ngôn ngữ và mã hóa quốc gia/vùng lãnh thổ

Các bạn làm việc trong lĩnh vực phát triển web có thể đã từng tiếp xúc với các mã như **vi-vn**, **en-us** để chỉ mã hóa quốc gia/vùng lãnh thổ cụ thể.

Các mã này được sử dụng để đại diện cho loại ngôn ngữ của một quốc gia/vùng lãnh thổ cụ thể. Vậy, các mã hóa đặc biệt này được tạo ra như thế nào?

Tiêu chuẩn [**ISO-639**](http://www.loc.gov/standards/iso639-2/php/English_list.php) sử dụng mã hóa để định nghĩa các ngôn ngữ phổ biến trên toàn cầu, mỗi ngôn ngữ được biểu thị bằng hai chữ cái viết thường.

Tiêu chuẩn [**ISO-3166**](https://www.iso.org/obp/ui/#iso:std:iso:3166:-2:ed-3:v1:en,fr) sử dụng mã hóa để định nghĩa các quốc gia/vùng lãnh thổ, mỗi quốc gia/vùng lãnh thổ được biểu thị bằng hai chữ cái viết hoa.

Bảng dưới đây liệt kê một số mã hóa ngôn ngữ của các quốc gia/vùng lãnh thổ phổ biến:

| Quốc gia/Vùng lãnh thổ          | Mã hóa ngôn ngữ | Quốc gia/Vùng lãnh thổ             | Mã hóa ngôn ngữ |     |     |     |
| ------------------------------- | --------------- | ---------------------------------- | --------------- | --- | --- | --- |
| Tiếng việt | vi-vn |||
| Tiếng Anh (Mỹ)                  | en-us           | Tiếng Anh (Anh)                    | en-gb           |     |     |     |
| Tiếng Anh (Toàn cầu)            | en-ww           | Tiếng Anh (Canada)                 | en-ca           |     |     |     |
| Tiếng Anh (Úc)                  | en-au           | Tiếng Anh (Ireland)                | en-ie           |     |     |     |
| Tiếng Anh (Phần Lan)            | en-fi           | Tiếng Đan Mạch (Đan Mạch)          | da-dk           |     |     |     |
| Tiếng Anh (Israel)              | en-il           | Tiếng Hebrew (Israel)              | he-il           |     |     |     |
| Tiếng Anh (Nam Phi)             | en-za           | Tiếng Anh (Ấn Độ)                  | en-in           |     |     |     |
| Tiếng Anh (Na Uy)               | en-no           | Tiếng Anh (Singapore)              | en-sg           |     |     |     |
| Tiếng Anh (New Zealand)         | en-nz           | Tiếng Anh (Indonesia)              | en-id           |     |     |     |
| Tiếng Anh (Philippines)         | en-ph           | Tiếng Anh (Thái Lan)               | en-th           |     |     |     |
| Tiếng Anh (Malaysia)            | en-my           | Tiếng Anh (Ả Rập)                  | en-xa           |     |     |     |
| Tiếng Hàn (Hàn Quốc)            | ko-kr           | Tiếng Nhật (Nhật Bản)              | ja-jp           |     |     |     |
| Tiếng Hà Lan (Hà Lan)           | nl-nl           | Tiếng Hà Lan (Bỉ)                  | nl-be           |     |     |     |
| Tiếng Bồ Đào Nha (Bồ Đào Nha)   | pt-pt           | Tiếng Bồ Đào Nha (Brazil)          | pt-br           |     |     |     |
| Tiếng Pháp (Pháp)               | fr-fr           | Tiếng Pháp (Luxembourg)            | fr-lu           |     |     |     |
| Tiếng Pháp (Thụy Sĩ)            | fr-ch           | Tiếng Pháp (Bỉ)                    | fr-be           |     |     |     |
| Tiếng Pháp (Canada)             | fr-ca           | Tiếng Tây Ban Nha (Châu Mỹ Latinh) | es-la           |     |     |     |
| Tiếng Tây Ban Nha (Tây Ban Nha) | es-es           | Tiếng Tây Ban Nha (Argentina)      | es-ar           |     |     |     |
| Tiếng Tây Ban Nha (Mỹ)          | es-us           | Tiếng Tây Ban Nha (Mexico)         | es-mx           |     |     |     |
| Tiếng Tây Ban Nha (Colombia)    | es-co           | Tiếng Tây Ban Nha (Puerto Rico)    | es-pr           |     |     |     |
| Tiếng Đức (Đức)                 | de-de           | Tiếng Đức (Áo)                     | de-at           |     |     |     |
| Tiếng Đức (Thụy Sĩ)             | de-ch           | Tiếng Nga (Nga)                    | ru-ru           |     |     |     |
| Tiếng Ý (Ý)                     | it-it           | Tiếng Hy Lạp (Hy Lạp)              | el-gr           |     |     |     |
| Tiếng Na Uy (Na Uy)             | no-no           | Tiếng Hungary (Hungary)            | hu-hu           |     |     |     |
| Tiếng Thổ Nhĩ Kỳ (Thổ Nhĩ Kỳ)   | tr-tr           | Tiếng Séc (Cộng hòa Séc)           | cs-cz           |     |     |     |
| Tiếng Slovenia                  | sl-sl           | Tiếng Ba Lan (Ba Lan)              | pl-pl           |     |     |     |
| Tiếng Thụy Điển (Thụy Điển)     | sv-se           |                                    |                 |     |     |     |
| Tiếng Trung (Trung Quốc)        | zh-cn           | Tiếng Trung (Đài Loan)             | zh-tw           |     |     |     |
| Tiếng Trung (Hồng Kông)         | zh-hk           | Tiếng Anh (Hồng Kông)              | en-hk           |     |     |     |

**Chú ý: Bảng trên cho thấy mã hóa ngôn ngữ và quốc gia/vùng lãnh thổ thường là viết tắt của từ tiếng Anh.**

### Mã hóa ký tự

Ở đây, chúng ta mở rộng khái niệm về mã hóa ký tự.

**Vậy, có mã hóa ngôn ngữ và quốc gia/vùng lãnh thổ, máy tính có thể nhận dạng các ngôn ngữ khác nhau chứ?**

Câu trả lời là không. Là một lập trình viên, chắc chắn mỗi người đã gặp phải tình huống sau: mong muốn in ra tiếng Trung, nhưng kết quả lại là ký tự lạ.

Tình huống này thường xảy ra do vấn đề về mã hóa ký tự.

Khi thiết kế máy tính ban đầu, không có sự cân nhắc đến việc áp dụng nhiều quốc gia và nhiều ngôn ngữ. Lúc đó, một mã hóa được định nghĩa là `ASCII`, sử dụng 7 bit nhị phân để biểu thị chữ cái, số và các ký tự khác. Sau đó, khi máy tính trở nên phổ biến trên toàn thế giới, để đáp ứng nhu cầu chuyển đổi văn bản qua các ngôn ngữ khác nhau, đã xuất hiện nhiều định dạng mã hóa khác nhau.

Do đó, một vấn đề khác đã xuất hiện: **các định dạng mã hóa khác nhau không thể nhận dạng lẫn nhau**. Vì vậy, để thống nhất, đã xuất hiện mã hóa `Unicode`. Nó gán một mã nhị phân duy nhất và đồng nhất cho mỗi ký tự trong mọi ngôn ngữ, nhằm đáp ứng nhu cầu chuyển đổi văn bản qua các ngôn ngữ và nền tảng khác nhau.

Có một điểm yếu của `Unicode`: để hỗ trợ tất cả các ký tự của mọi ngôn ngữ, nó cần sử dụng nhiều bit hơn, ví dụ: `ASCII` chỉ cần một byte để biểu thị một ký tự tiếng Anh, trong khi `Unicode` cần hai byte. Rõ ràng, nếu có nhiều ký tự hơn, hiệu suất sẽ giảm.

Để giải quyết vấn đề này, đã xuất hiện một số định dạng mã hóa trung gian: như `UTF-8`, `UTF-16`, `UTF-32`.

## Thực hiện quốc tế hóa trong Java

Cách thực hiện quốc tế hóa rất đơn giản:

1. Đầu tiên, xác định các mẫu cho các ngôn ngữ khác nhau;
2. Chọn ngôn ngữ;
3. Tải mẫu cho ngôn ngữ đã chọn.

Tiếp theo, bài viết này sẽ từng bước giải thích cách thực hiện quốc tế hóa.

### Định nghĩa mẫu cho các ngôn ngữ khác nhau

**Trong Java, văn bản đa ngôn ngữ được lưu trữ trong các tệp tài nguyên có định dạng `properties`.**

Nó phải tuân theo quy tắc đặt tên sau:

```
<resource_name>_<language_code>_<country/region_code>.properties
```

Trong đó, mã hóa ngôn ngữ và mã hóa quốc gia/vùng lãnh thổ là tùy chọn.

Chú ý: Tệp tài nguyên có tên `<resource_name>.properties` là tệp tài nguyên mặc định, tức là nếu không tìm thấy tệp tài nguyên cụ thể cho một loại quốc tế hóa trong hệ thống, nó sẽ sử dụng tệp tài nguyên mặc định này.

#### Định nghĩa tệp properties

Trong thư mục `src/main/resources/locales`, hãy định nghĩa các tệp tài nguyên cho ngôn ngữ khác nhau với tên `content`:

**content_en_US.properties**

```
hello = Hello!
time = The current time is %s.
```

**content_vi_VN.properties**

```
hello = Xin ch\u00e0o!  
time = Th\u1eddi gian hi\u1ec7n t\u1ea1i l\u00e0 %s.
```

Có thể thấy: Một số tệp tài nguyên có cùng Key nhưng các giá trị khác nhau cho từng ngôn ngữ.

Mặc dù các giá trị thuộc tính khác nhau, nhưng tên thuộc tính lại giống nhau, điều này cho phép ứng dụng truy cập vào giá trị thuộc tính cụ thể bằng cách sử dụng đối tượng Locale và tên thuộc tính.

#### Công cụ chuyển đổi Unicode

Trong phần trước, các giá trị thuộc tính trong tệp tài nguyên tiếng Trung của chúng ta được biểu thị bằng các số hexa 16-bit bắt đầu bằng \ u. Thực tế, điều này đại diện cho một mã Unicode.

```
hello = Xin ch\u00e0o!  
time = Th\u1eddi gian hi\u1ec7n t\u1ea1i l\u00e0 %s.
```

Trong phần về mã hóa ký tự, chúng ta đã đề cập rằng để hiển thị chính xác trên các mã hóa khác nhau, có cần chuyển đổi các ký tự không phải ASCII sang mã Unicode. Các tệp tài nguyên tiếng Trung của chúng ta chính là kết quả của việc chuyển đổi tiếng Trung sang mã Unicode.

Làm thế nào để chuyển đổi các ký tự không phải ASCII sang mã Unicode?

JDK cung cấp cho chúng ta một công cụ chuyển đổi: **native2ascii**.

Nó có thể chuyển đổi tệp tài nguyên chứa ký tự tiếng Trung sang định dạng mã Unicode, cú pháp như sau:

```
native2ascii [-reverse] [-encoding encoding] [input_file [output_file]]
```

Giả sử **content_vi_VN.properties** nằm trong thư mục `Desktop`. Bằng cách thực hiện lệnh sau, chúng ta có thể tạo một tệp mới có tên **content_vi_VN_new.properties**, trong đó nội dung của nó là kết quả chuyển đổi các ký tự tiếng Trung sang định dạng mã hóa UTF-8.

```bash
native2ascii -encoding utf-8 ~/Desktop/content_vi_VN.properties ~/Desktop/content_vi_VN_new.properties
```

### Chọn ngôn ngữ

Sau khi định nghĩa các tệp tài nguyên đa ngôn ngữ, bước thứ hai là chọn tệp mẫu dựa trên ngôn ngữ cục bộ.

#### Locale

Trong Java, một đối tượng `java.util.Locale` đại diện cho một khu vực địa lý, chính trị và văn hóa cụ thể. Các hoạt động cần Locale để thực hiện nhiệm vụ của mình được gọi là hoạt động nhạy cảm với ngôn ngữ, nó sử dụng Locale để tùy chỉnh thông tin cục bộ cho người dùng.

Nó có ba phương thức khởi tạo:

`Locale(String language)`: Khởi tạo dựa trên mã hóa ngôn ngữ  
`Locale(String language, String country)`: Khởi tạo dựa trên mã hóa ngôn ngữ và mã hóa quốc gia  
`Locale(String language, String country, String variant)`: Khởi tạo dựa trên mã hóa ngôn ngữ, mã hóa quốc gia và biến thể

Ngoài ra, Locale định nghĩa một số hằng số Locale phổ biến: `Locale.ENGLISH`, `Locale.VIETNAMESE`, v.v.

```java
// Khởi tạo một Locale tiếng Anh chung
Locale locale1 = new Locale("en");
// Khởi tạo một Locale tiếng Anh Canada
Locale locale2 = new Locale("en", "CA");
// Khởi tạo một Locale tiếng Anh Mỹ với biến thể SiliconValley
Locale locale3 = new Locale("en", "US", "SiliconValley");
// Khởi tạo một Locale tiếng Viêt
Locale locale4 = new Locale("vi", "VN");
```

### Tải mẫu cho ngôn ngữ đã chọn

#### ResourceBundle

Java cung cấp cho chúng ta một lớp tiện ích để tải tệp tài nguyên đa quốc gia: `java.util.ResourceBundle`.

`ResourceBundle` cung cấp nhiều phương thức tĩnh `getBundle`, các phương thức này được sử dụng để chọn tệp tài nguyên ngôn ngữ cụ thể dựa trên tên tài nguyên và Locale. Cần lưu ý rằng tham số đầu tiên của phương thức `getBundle` thường là `baseName`, đại diện cho tên tệp tài nguyên.

`ResourceBundle` cũng cung cấp phương thức `getString` để lấy giá trị tương ứng với khóa từ tệp tài nguyên.

```java
import java.util.Locale;
import java.util.ResourceBundle;

public class ResourceBundleDemo {

    public static void main(String[] args) {
        // Khởi tạo dựa trên mã ngôn ngữ + mã quốc gia
        ResourceBundle rbUS = ResourceBundle.getBundle("locales.content", new Locale("en", "US"));
        // Khởi tạo dựa trên hằng số Locale
        ResourceBundle rbVN = ResourceBundle.getBundle("locales.content", new Locale("vi", "VN"));
        // Khởi tạo dựa trên Locale mặc định của hệ thống
        // ResourceBundle rbDefault = ResourceBundle.getBundle("locales.content", Locale.getDefault());
        // ResourceBundle rbDefault =ResourceBundle.getBundle("locales.content", Locale.getDefault()); // Tương đương với dòng trên

        System.out.println("en-US: " + rbUS.getString("hello"));
        System.out.println("en-US: " + String.format(rbUS.getString("time"), "08:00"));
        System.out.println("vi-VN: " + rbVN.getString("hello"));
        System.out.println("vi-VN: " + String.format(rbVN.getString("time"), "08:00"));
        // System.out.println("default: " + rbDefault.getString("hello"));
        // System.out.println("default: " + String.format(rbDefault.getString("time"), "08:00"));
    }

}

// Output:
// en-US: Hello!
// en-US: The current time is 08:00.
// vi-VN: Xin chào!
// vi-VN: Thời gian hiện tại là 08:00.
```

Chú ý: Khi tải tài nguyên, nếu tệp tài nguyên quốc tế được chỉ định không tồn tại, nó sẽ thử tải tài nguyên khác theo thứ tự sau: tài nguyên tương ứng với Locale mặc định của hệ thống -> tài nguyên mặc định. Nếu chỉ định sai, Java sẽ báo lỗi không tìm thấy tệp tài nguyên.

## Các lớp tiện ích hỗ trợ quốc tế hóa

Trong Java, cũng có một số lớp tiện ích hỗ trợ quốc tế hóa. Ví dụ: `NumberFormat`, `DateFormat`, `MessageFormat`.

### NumberFormat

`NumberFormat` là lớp cơ sở cho tất cả các lớp định dạng số. Nó cung cấp các phương thức để định dạng và phân tích cú pháp số. Nó cũng cung cấp các phương thức để xác định loại ngôn ngữ của số.

```java
import java.text.NumberFormat;
import java.util.Locale;

public class NumberFormatDemo {

    public static void main(String[] args) {
        double num = 123456.78;
        NumberFormat format = NumberFormat.getCurrencyInstance(Locale.US);
        System.out.format("Quốc tế hóa (%s) của %f: %s\n", Locale.US, num, format.format(num));
    }

}

// Output:
// Quốc tế hóa (en_US) của 123456.780000: $123,456.78
```

### DateFormat

`DateFormat` là lớp trừu tượng cho các lớp định dạng ngày tháng và thời gian. Nó hỗ trợ định dạng ngày tháng và thời gian dựa trên quy ước ngôn ngữ.

```java
import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;

public class DateFormatDemo {

    public static void main(String[] args) {
        Date date = new Date();
        DateFormat df = DateFormat.getDateInstance(DateFormat.MEDIUM, Locale.ENGLISH);
        DateFormat df2 = DateFormat.getDateInstance(DateFormat.MEDIUM, Locale.JAPANESE);
        System.out.format("Quốc tế hóa (%s) của %s: %s\n", Locale.ENGLISH, date, df.format(date));
        System.out.format("Quốc tế hóa (%s) của %s: %s\n", Locale.JAPANESE, date, df2.format(date));
    }

}

// Output
// Quốc tế hóa (en) của Fri Jul 14 16:16:48 ICT 2023: Jul 14, 2023
// Quốc tế hóa (ja) của Fri Jul 14 16:16:48 ICT 2023: 2023/07/14
```

### MessageFormat

`MessageFormat` cung cấp một cách gắn kết thông điệp không phụ thuộc vào ngôn ngữ. Bằng cách gắn kết này, thông điệp cuối cùng được trả về cho người dùng.

```java
package com.hnv99.javacore.i18n;

import java.text.MessageFormat;
import java.util.GregorianCalendar;
import java.util.Locale;

public class MessageFormatDemo {

    public static void main(String[] args) {
        String pattern1 = "{0}，xin chào! Bạn đã tiêu {2} đô vào {1}.";
        String pattern2 = "Vào lúc {1,time,short} ngày {1,date,long}，{0} đã thanh toán {2,number, currency}.";
        Object[] params = { "Jack", new GregorianCalendar().getTime(), 8888 };
        String msg1 = MessageFormat.format(pattern1, params);
        MessageFormat mf = new MessageFormat(pattern2, Locale.US);
        String msg2 = mf.format(params);
        System.out.println(msg1);
        System.out.println(msg2);
    }

}

// Output:
// Jack，xin chào! Bạn đã tiêu 8,888 đô vào 7/14/23 4:19 PM.
// Vào lúc 4:19 PM ngày July 14, 2023，Jack đã thanh toán $8,888.00.
```
