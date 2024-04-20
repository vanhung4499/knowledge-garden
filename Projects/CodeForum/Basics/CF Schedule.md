---
title: CF Schedule
tags:
  - project
  - codeforum
categories: 
date created: 2024-04-17
date modified: 2024-04-17
---

# Lập lịch tác vụ với Schedule

Học về công việc lập lịch là một kỹ năng cơ bản, đặc biệt là trong công việc thực tế. Trong các dự án đã được phát triển đến mức độ tương đối hoàn thiện, thường sẽ sử dụng các công cụ như xxl-job, elastic-job để thực hiện các nhiệm vụ lập lịch phân tán. Trong dự án, công việc lập lịch là một trong những kiến thức cần phải nắm vững.  

Đối với loạt bài hướng dẫn về công việc lập lịch, chúng tôi sẽ bắt đầu từ nhiệm vụ đơn giản với Spring Schedule trên máy đơn, sau đó từng bước giới thiệu cách thực hiện các nhiệm vụ lập lịch phân tán bằng cách sử dụng các thành phần bên thứ ba đã phát triển. Đầu tiên, chúng ta hãy tìm hiểu cách thực hiện công việc lập lịch trên Spring cho máy đơn.

## Ví dụ sử dụng

Trong dự án, bạn có thể dễ dàng tìm thấy các vị trí sử dụng `@Scheduled` bằng cách tìm kiếm toàn bộ mã nguồn.

### Tình huống ứng dụng

> com.hnv99.forum.service.sitemap.service.SitemapServiceImpl#autoRefreshCache

```java
/**  
 * Automatically refresh the sitemap at 5:15 AM every day to ensure data consistency */@Scheduled(cron = "0 15 5 * * ?")  
public void autoRefreshCache() {  
    log.info("Start refreshing the URL addresses of sitemap.xml to avoid data inconsistency issues!");  
    refreshSitemap();  
    log.info("Refresh completed!");  
}
```

Nhiệm vụ lập lịch ở trên rất đơn giản: làm mới sitemap của trang web mỗi ngày vào lúc 5:15 sáng để tạo ra tệp sitemap.xml cho SEO.

Nếu trong dự án thực tế của bạn cần sử dụng công việc lập lịch, bạn cần bật chúng một cách chủ động. Thông thường, điều này được thực hiện bằng cách thêm annotation `@EnableScheduling` trên lớp khởi chạy, như minh họa dưới đây:

```java
@EnableScheduling
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class);
    }
}
```

Sau khi hoàn thành cấu hình trên, công việc đặt lịch sẽ hoàn tất. Tổng quan về việc sử dụng là rất đơn giản và tiện lợi.

## Kiến thức cơ bản

Từ góc độ sử dụng trong dự án, việc sử dụng thực sự rất đơn giản và không có gì đặc biệt. Tuy nhiên, có rất nhiều kiến thức được liên quan trong đó, chúng ta sẽ đi vào từng phần một:

### Biểu thức cron

Biểu thức cron là một chuỗi được phân chia bằng 5 hoặc 6 dấu cách, chia thành 6 hoặc 7 trường, mỗi trường đại diện cho một ý nghĩa. Có hai cú pháp cho biểu thức cron:

```shell
Seconds Minutes Hours DayofMonth Month DayofWeek Year
Seconds Minutes Hours DayofMonth Month DayofWeek
```

Ở đây mỗi trường có thể có các giá trị khác nhau, giải thích một số biểu tượng mà bạn có thể gặp:

- `*`: Đại diện cho bất kỳ giá trị nào trong trường đó. Ví dụ: khi trường phút là `*`, nó có nghĩa là mỗi phút đều thực hiện.
- `?`: Chỉ có thể được sử dụng trong các trường DayofMonth và DayofWeek. Nó cũng đại diện cho bất kỳ giá trị nào trong trường đó, nhưng thực tế thì không. Bởi vì DayofMonth và DayofWeek ảnh hưởng lẫn nhau. Ví dụ: để kích hoạt công việc vào ngày 20 của mỗi tháng, bất kể ngày 20 thực sự là thứ mấy, bạn phải sử dụng cú pháp: `13 13 15 20 ?`.
- `-`: Đại diện cho một phạm vi. Ví dụ: trong trường Phút, `5-20` có nghĩa là từ 5 đến 20 phút mỗi phút đều thực hiện một lần.
- `/`: Đại diện cho việc bắt đầu thực hiện từ thời gian ban đầu, sau đó thực hiện mỗi khoảng thời gian cố định. Ví dụ: trong trường Phút, `5/20` có nghĩa là thực hiện mỗi 5 phút, vì vậy các phút 25, 45,… sẽ thực hiện một lần.
- `,`: Đại diện cho các giá trị được liệt kê. Ví dụ: trong trường Phút, `5,20` có nghĩa là thực hiện vào 5 và 20 phút mỗi phút.
- `L`: Đại diện cho cuối cùng, chỉ có thể xuất hiện trong các trường DayofWeek và DayofMonth. Ví dụ: `5L` trong trường DayofWeek có nghĩa là vào thứ năm cuối cùng.
- `W`: Đại diện cho ngày làm việc hợp lệ (từ thứ hai đến thứ sáu), chỉ có thể xuất hiện trong trường DayofMonth, hệ thống sẽ kích hoạt sự kiện vào ngày làm việc gần nhất từ ngày được chỉ định. Ví dụ: `5W` trong trường DayofMonth, nếu ngày 5 là thứ bảy, sẽ kích hoạt vào ngày làm việc gần nhất: thứ sáu, tức là ngày 4. Nếu ngày 5 là chủ nhật, sẽ kích hoạt vào ngày làm việc gần nhất: thứ hai, tức là ngày 6.
- `LW`: Hai ký tự này có thể được kết hợp, đại diện cho ngày làm việc cuối cùng của mỗi tháng, nghĩa là thứ sáu cuối cùng của mỗi tháng.
- `#`: Dùng để xác định ngày trong tuần thứ mấy của tháng, chỉ có thể xuất hiện trong trường DayofMonth. Ví dụ: `4#2`, đại diện cho thứ tư thứ hai của mỗi tháng.  

Dựa trên giải thích trên, các biểu thức cron trước đó sẽ trở nên dễ hiểu hơn:

```shell
0/1 * * * * ?
Mỗi giây một lần
```

Dưới đây là vài ví dụ đơn giản để minh họa:

```java
"0 0 10,14,16 * * ?": Mỗi ngày lúc 10 giờ, 14 giờ và 16 giờ.
"0 0/30 9-17 * * ?": Mỗi nửa giờ trong khoảng từ 9 giờ sáng đến 5 giờ chiều trong ngày làm việc.
"0 0 12 ? * WED": Mỗi thứ tư lúc 12 giờ trưa.
"0 0 12 * * ?": Mỗi ngày lúc 12 giờ trưa.
"0 15 10 ? * *": Mỗi ngày lúc 10 giờ 15 phút sáng.
"0 15 10 * * ?": Mỗi ngày lúc 10 giờ 15 phút sáng.
"0 15 10 * * ? *": Mỗi ngày lúc 10 giờ 15 phút sáng.
"0 15 10 * * ? 2005": Mỗi ngày lúc 10 giờ 15 phút sáng trong năm 2005.
"0 * 14 * * ?": Mỗi giờ trong khoảng từ 2 giờ đến 2 giờ 59 phút chiều.
"0 0/5 14 * * ?": Mỗi 5 phút trong khoảng từ 2 giờ đến 2 giờ 55 phút chiều.
"0 0/5 14,18 * * ?": Mỗi 5 phút trong khoảng từ 2 giờ đến 2 giờ 55 phút chiều và từ 6 giờ đến 6 giờ 55 phút tối.
"0 0-5 14 * * ?": Mỗi phút trong khoảng từ 2 giờ đến 2 giờ 5 phút chiều.
"0 10,44 14 ? 3 WED": Vào lúc 2 giờ 10 phút và 2 giờ 44 phút chiều mỗi thứ tư trong tháng ba.
"0 15 10 ? * MON-FRI": Mỗi thứ hai đến thứ sáu lúc 10 giờ 15 phút sáng.
"0 15 10 15 * ?": Lúc 10 giờ 15 phút sáng mỗi ngày 15.
"0 15 10 L * ?": Lúc 10 giờ 15 phút sáng vào cuối tháng.
"0 15 10 ? * 6L": Lúc 10 giờ 15 phút sáng vào cuối tuần cuối cùng trong tháng.
"0 15 10 ? * 6L 2002-2005": Lúc 10 giờ 15 phút sáng vào cuối tuần cuối cùng trong tháng từ năm 2002 đến năm 2005.
"0 15 10 ? * 6#3": Lúc 10 giờ 15 phút sáng vào tuần thứ ba của tháng.

```

#### Mở rộng biểu thức

Trong Spring 5.3 (Spring Boot 2.4) và các phiên bản sau này, biểu thức cron đã được mở rộng:

> [New in Spring 5.3: Improved Cron Expressions](https://spring.io/blog/2020/11/10/new-in-spring-5-3-improved-cron-expressions)

**1. Macros**

Đặc điểm chính là việc thêm vào một số Macros:

| Macro                     | Biểu thức     | Giải thích                 |
| ------------------------- | ------------- | -------------------------- |
| `@yearly`                 | `0 0 0 1 1 *` | Mỗi năm vào ngày 1 tháng 1 |
| `@monthly`                | `0 0 0 1 * *` | Mỗi tháng một lần          |
| `@weekly`                 | `0 0 0 * * 0` | Mỗi tuần một lần           |
| `@daily` hoặc `@midnight` | `0 0 0 * * *` | Mỗi ngày một lần           |
| `@hourly`                 | `0 0 * * * *` | Mỗi giờ một lần            |  

**2. Các ngày cuối cùng**

```css
      Ngày trong tuần 
          v
* * * * * *
      ^
    Ngày trong tháng
```

Trong đó, các trường "Ngày trong tháng" và "Ngày trong tuần" hỗ trợ ý nghĩa của "cuối cùng" (L). Ví dụ:

```css
"0 0 0 L * *" Mỗi ngày cuối tháng lúc 12 giờ đêm.
"0 0 0 L-3 * *" Mỗi ngày cuối cùng của tháng trừ 3 ngày lúc 12 giờ đêm.
"0 0 0 * * 5L" Mỗi thứ sáu cuối cùng của tháng lúc 12 giờ đêm.
"0 0 0 * * THUL" Mỗi thứ năm cuối cùng của tháng lúc 12 giờ đêm.
```

**3. Mở rộng biểu thức gốc - Ngày làm việc**

```css
* * * * * *
       ^
    Ngày trong tháng

```

Trong đó, trường "Ngày trong tháng" hỗ trợ ý nghĩa của "ngày làm việc" (W). Ví dụ:

```css
"0 0 0 1W * *" Ngày làm việc đầu tiên của mỗi tháng lúc 12 giờ đêm.
"0 0 0 LW * *" Ngày làm việc cuối cùng của mỗi tháng lúc 12 giờ đêm.
```

**4. Mở rộng biểu thức gốc - Ngày trong tuần của mỗi tháng**

```css
      Ngày trong tuần
           v
 * * * * * *
```

Trong đó, trường "Ngày trong tuần" hỗ trợ ý nghĩa "ngày trong tuần của mỗi tháng". Ví dụ:

```css
"0 0 0 ? * 5#2" Mỗi thứ sáu thứ hai của mỗi tháng lúc 12 giờ đêm.
"0 0 0 ? * MON#1" Mỗi thứ hai đầu tiên của mỗi tháng lúc 12 giờ đêm.
```

### Chạy nhiều nhiệm vụ định kỳ

Làm thế nào để xác nhận rằng nhiều nhiệm vụ định kỳ trong một dự án được thực thi tuần tự hay song song? Để kiểm tra chức năng này, cách tốt nhất là viết một testcase, ví dụ như định nghĩa hai nhiệm vụ định kỳ, trong một trong các nhiệm vụ đó, hãy viết một vòng lặp vô hạn để xem liệu nhiệm vụ khác có được thực thi bình thường hay không.

Đầu tiên, chúng ta phân tích xem các nhiệm vụ sc1 và sc2 này có thực hiện tuần tự hay song song không, tạm thời bỏ qua việc sc1 bị chặn khi gọi, xem liệu trong giây tiếp theo có mở một luồng mới và gọi lại sc1 không:

- Nếu tuần tự: thì sc1 in ra một lần, sc2 có thể in ra 0 hoặc 1 lần
- Nếu song song: sc1 in ra một lần, sc2 in ra nhiều lần

### Ưu tiên thực thi của nhiệm vụ định kỳ

Nếu quá trình thực hiện theo thứ tự, thì ưu tiên làm thế nào? Có cố định mỗi lần, hay là ngẫu nhiên?  
Để xác minh phương pháp trên, cũng dễ dàng, cũng là hai nhiệm vụ, nhìn xem kết quả của chúng có bị lẫn lộn không, nếu mỗi lần nhiệm vụ 1 in ra trước rồi mới đến nhiệm vụ 2, thì đó là ưu tiên cố định; nếu không, thì không thể đoán trước được thứ tự khi lên lịch.

Mã kiểm thử như sau:

```java
@Scheduled(cron = "0/1 * * * * ?")
public void sc1()  {
    System.out.println(Thread.currentThread().getName() + " | sc1 " + System.currentTimeMillis());
}

@Scheduled(cron = "0/1 * * * * ?")
public void sc2() {
    System.out.println(Thread.currentThread().getName() + " | sc2 " + System.currentTimeMillis());
}
```

Kết quả thực tế như sau:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240417154815.png)

**Dựa vào kết quả xuất ra, ta có kết luận: Thứ tự là lẫn lộn, không có mối quan hệ ưu tiên rõ ràng.**

### Lập lịch song song

Vấn đề tiếp theo là tôi muốn các nhiệm vụ này có thể thực thi song song, có thể thực hiện được không?

Dĩ nhiên là có thể, và cũng khá đơn giản, đầu tiên là thêm annotation `@EnableAsync` vào ứng dụng, bật gọi bất đồng bộ, sau đó thêm annotation `@Async` vào nhiệm vụ được lập lịch, một demo đơn giản như sau:

```java
@EnableAsync
@EnableScheduling
@SpringBootApplication
public class QuickMediaApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuickMediaApplication.class, args);
    }

    @Scheduled(cron = "0/1 * * * * ?")
    @Async
    public void sc1()  {
        System.out.println(Thread.currentThread().getName() + " | sc1 " + System.currentTimeMillis());
    }
}

```

Sau khi thực thi mã trên, kiểm tra đầu ra (khi gọi bất đồng bộ, lý thuyết là tên luồng phải khác nhau):

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240417160540.png)

Từ đầu ra trên, có thể suy luận đơn giản, mỗi lần lập lịch nhiệm vụ trên là một luồng mới được mở để thực hiện, vì vậy nếu viết một vòng lặp vô hạn trong nhiệm vụ lập lịch, liệu có dẫn đến việc có vô số luồng và cuối cùng là làm cho toàn bộ tiến trình sập?

**Ngoài ra, nhắc thêm rằng số lượng luồng trong một tiến trình đơn trên hệ thống Linux có một giới hạn, có thể kiểm tra bằng lệnh:**

```shell
ulimit -u
```

Trước khi thử nghiệm, hãy xem nhiệm vụ thực hiện bình thường như thế nào, như hình động dưới đây, số luồng không tăng mạnh:

Trước khi thử nghiệm, hãy xem nhiệm vụ thực hiện bình thường như thế nào, như hình động dưới đây, số luồng không tăng mạnh:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/a868925d-db61-4ede-80db-3e904507a145.gif)

Tiếp theo, thay đổi sang cách lập lịch vô hạn, kết quả thực tế như sau, số luồng tăng lên đáng kể:

![65ae203b-ba26-4bae-b815-84393d486a4f.gif](https://raw.githubusercontent.com/vanhung4499/images/master/snap/65ae203b-ba26-4bae-b815-84393d486a4f.gif)

Vậy nên, việc sử dụng cách gọi bất đồng bộ mặc định không phải là một giải pháp tốt, có thể sẽ bị "giết chết" mà không hề hay biết, vậy có thể sử dụng bộ bãi biển luồng của riêng mình để quản lý các nhiệm vụ bất đồng bộ này không?

### Customize Thread Pool

Sử dụng Customize Thread Pool thay vì cách quản lý luồng mặc định không chỉ là một cách an toàn và linh hoạt hơn mà còn không phức tạp khi sử dụng. Không có gì khác biệt so với cách thông thường để tạo Thread Pool, để sử dụng trong hệ sinh thái Spring, chỉ cần biến nó thành bean.

Trực tiếp sử dụng Thread Pool của Spring `ThreadPoolTaskExecutor` như sau:

```java
@Bean
public AsyncTaskExecutor asyncTaskExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setThreadNamePrefix("yhh-schedule-");
    executor.setMaxPoolSize(10);
    executor.setCorePoolSize(3);
    executor.setQueueCapacity(0);
    executor.setRejectedExecutionHandler(new ThreadPoolExecutor.AbortPolicy());
    return executor;
}

@Scheduled(cron = "0/1 * * * * ?")
@Async
public void sc1() throws InterruptedException {
    System.out.println(Thread.currentThread().getName() + " | sc1 " + System.currentTimeMillis());
    while (true) {
        Thread.sleep(1000 * 5);
    }
}

```

Kết quả thực tế được hiển thị như sau, tối đa là 10 luồng và các nhiệm vụ được gửi sau đó được loại bỏ:

![5754e6c7-cd25-451b-b1ee-d9c5a01e9437.gif](https://raw.githubusercontent.com/vanhung4499/images/master/snap/5754e6c7-cd25-451b-b1ee-d9c5a01e9437.gif)

Một số lợi ích của việc sử dụng bể bơi luồng tùy chỉnh:

- Phân phối hợp lý các tham số của bể bơi luồng
- Lựa chọn chiến lược từ chối cũng khá thú vị (có thể xử lý các nhiệm vụ "nặng nề" theo ý muốn của bạn)
- Đặt tên cho bể bơi luồng, sẽ hỗ trợ rất nhiều trong việc giải quyết vấn đề sau này

### Tổng kết

Về các điểm kiến thức liên quan đến nhiệm vụ lập lịch trong Spring, các thông tin cốt lõi như sau:

**Cách sử dụng** Đầu tiên, bật nhiệm vụ lập lịch bằng cách thêm chú thích `@Scheduling`; sau đó, trên các phương thức công cộng cần, thêm `Scheduled` để thực hiện một nhiệm vụ lập lịch. **Các điểm kiến thức về nhiệm vụ lập lịch**

- Biểu thức crond
- Mặc định, tất cả các nhiệm vụ lập lịch đều được lập lịch tuần tự, một luồng, và thậm chí không thể đảm bảo thứ tự của hai nhiệm vụ có crond hoàn toàn giống nhau (lý do cụ thể cần phân tích mã nguồn, xem cách hỗ trợ trong phần này làm thế nào)
- Sử dụng chú thích `@Async` có thể làm cho nhiệm vụ lập lịch được gọi bất đồng bộ; nhưng cần mở cấu hình, thêm chú thích `@EnableAsync` vào lớp khởi động
- Khi thực hiện song song, nên sử dụng bể bơi luồng tùy chỉnh thay vì sử dụng mặc định, lý do đã được đề cập ở trên

**Cuối cùng, đặt ra một câu hỏi:**

- Khi dự án có nhiều nhiệm vụ lập lịch đều được thực hiện vào lúc 11 giờ tối, nếu một trong số chúng gây ra ngoại lệ khi thực hiện, nhưng mã kinh doanh không xử lý ngoại lệ, liệu các nhiệm vụ lập lịch khác sẽ bị ảnh hưởng không? Có thể thực hiện bình thường không?
- Rất hoan nghênh ý kiến của bạn trong phần bình luận
