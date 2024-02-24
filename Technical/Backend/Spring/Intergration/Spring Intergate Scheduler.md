---
title: Spring Intergate Scheduler
tags: [spring, java, backend]
categories: [spring, java, backend]
date created: 2023-08-11
date modified: 2024-02-22
---

# Spring tích hợp lập lịch

## Tổng quan

Nếu bạn muốn sử dụng chức năng lập lịch tác vụ trong Spring, ngoài việc tích hợp khung lập lịch Quartz, bạn cũng có thể sử dụng khung lập lịch tác vụ của chính Spring. Sử dụng khung lập lịch của Spring có lợi thế là: hỗ trợ annotation `@Scheduler`, có thể giảm bớt một số cấu hình.

## Kích hoạt tác vụ lập lịch theo thời gian thực

### TaskScheduler Interface

Spring 3 đã giới thiệu interface TaskScheduler, interface này định nghĩa các phương thức trừu tượng để lập lịch các nhiệm vụ.  
Khai báo interface TaskScheduler:

```java
public interface TaskScheduler {

    ScheduledFuture schedule(Runnable task, Trigger trigger);

    ScheduledFuture schedule(Runnable task, Date startTime);

    ScheduledFuture scheduleAtFixedRate(Runnable task, Date startTime, long period);

    ScheduledFuture scheduleAtFixedRate(Runnable task, long period);

    ScheduledFuture scheduleWithFixedDelay(Runnable task, Date startTime, long delay);

    ScheduledFuture scheduleWithFixedDelay(Runnable task, long delay);

}
```

Từ các phương thức trên, bạn có thể thấy TaskScheduler có hai loại tham số quan trọng:

- Một là phương thức cần lập lịch, tức là phương thức run() của một lớp luồng đã thực hiện interface Runnable;
- Một là điều kiện kích hoạt.

**Các lớp thực hiện interface TaskScheduler**  
Nó có ba lớp thực hiện: `DefaultManagedTaskScheduler`, `ThreadPoolTaskScheduler`, `TimerManagerTaskScheduler`.  
**DefaultManagedTaskScheduler**: Lập lịch dựa trên JNDI.  
**TimerManagerTaskScheduler**: Lập lịch quản lý các phiên bản `commonj.timers.TimerManager`.  
**ThreadPoolTaskScheduler**: Lập lịch cung cấp quản lý thread pool, nó cũng thực hiện interface `TaskExecutor`, do đó một thực thể duy nhất có thể thực hiện càng nhanh càng tốt một cách bất đồng bộ.

#### Interface Trigger

Interface Trigger trừu tượng các phương thức cho điều kiện kích hoạt.  
Khai báo interface Trigger:

```
public interface Trigger {
    Date nextExecutionTime(TriggerContext triggerContext);
}
```

**Các lớp triển khai của Trigger**  
**CronTrigger**: Triển khai trigger theo quy tắc cron (giống với quy tắc cron của Quartz).  
**PeriodicTrigger**: Triển khai trigger theo quy tắc chu kỳ (ví dụ: xác định thời gian kích hoạt, khoảng thời gian giữa các lần kích hoạt, v.v.).

#### Ví dụ đầy đủ

Để triển khai chức năng lập lịch, có một số điểm quan trọng sau:  
**(1) Xác định TaskScheduler**  
Cấu hình trong spring-bean.xml  
Sử dụng thẻ `task:scheduler` để xác định một TaskScheduler với kích thước bể luồng là 10, Spring sẽ tạo ra một đối tượng ThreadPoolTaskScheduler.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:task="http://www.springframework.org/schema/task"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
       http://www.springframework.org/schema/mvc
       http://www.springframework.org/schema/mvc/spring-mvc-3.1.xsd
       http://www.springframework.org/schema/task
       http://www.springframework.org/schema/task/spring-task-3.1.xsd">
  <mvc:annotation-driven/>
  <task:scheduler id="myScheduler" pool-size="10"/>
</beans>
```

**_Chú ý: Đừng quên nhập xsd:_**

```xml
http://www.springframework.org/schema/task
http://www.springframework.org/schema/task/spring-task-3.1.xsd
```

**(2) Xác định nhiệm vụ lập lịch**  
Xác định một lớp luồng triển khai Runnable.

```
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DemoTask implements Runnable {
    final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public void run() {
        logger.info("call DemoTask.run");
    }
}
```

**(3) Lắp ráp TaskScheduler và thực hiện nhiệm vụ lập lịch**  
Sử dụng annotation `@Autowired` để lắp ráp TaskScheduler trong một lớp Controller.  
Sau đó, gọi phương thức schedule của đối tượng TaskScheduler để khởi động lập lịch và thực hiện nhiệm vụ lập lịch.

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/scheduler")
public class SchedulerController {
    @Autowired
    TaskScheduler scheduler;

    @RequestMapping(value = "/start", method = RequestMethod.POST)
    public void start() {
        scheduler.schedule(new DemoTask(), new CronTrigger("0/5 * * * * *"));
    }
}
```

Truy cập vào interface /scheduler/start, khởi động TaskScheduler, bạn sẽ thấy các thông tin nhật ký sau:

```
13:53:15.010 myScheduler-1 o.zp.notes.spring.scheduler.DemoTask.run - call DemoTask.run
13:53:20.003 myScheduler-1 o.zp.notes.spring.scheduler.DemoTask.run - call DemoTask.run
13:53:25.004 myScheduler-2 o.zp.notes.spring.scheduler.DemoTask.run - call DemoTask.run
13:53:30.005 myScheduler-1 o.zp.notes.spring.scheduler.DemoTask.run - call DemoTask.run
```

### Cách sử dụng @Scheduler

Một điểm nổi bật của trình lập lịch trong Spring là sử dụng annotation @Scheduler, điều này giúp tiết kiệm rất nhiều cấu hình phức tạp.

#### Kích hoạt annotation

Để sử dụng annotation @Scheduler, trước tiên cần kích hoạt cơ chế annotation bằng cách sử dụng `<task:annotation-driven>`.  
**_Ví dụ:_**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:task="http://www.springframework.org/schema/task"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
       http://www.springframework.org/schema/mvc
       http://www.springframework.org/schema/mvc/spring-mvc-3.1.xsd
       http://www.springframework.org/schema/task
       http://www.springframework.org/schema/task/spring-task-3.1.xsd">
  <mvc:annotation-driven/>
  <task:annotation-driven executor="myExecutor" scheduler="myScheduler"/>
  <task:executor id="myExecutor" pool-size="5"/>
  <task:scheduler id="myScheduler" pool-size="10"/>
</beans>
```

#### Định nghĩa điều kiện kích hoạt bằng @Scheduler

Ví dụ: Sử dụng `fixedDelay` để chỉ định điều kiện kích hoạt là thực hiện mỗi 5000 milliseconds. Lưu ý: Phải chờ 5000 milliseconds sau khi lần kích hoạt trước thành công mới thực hiện lần kích hoạt tiếp theo.

```java
@Scheduled(fixedDelay=5000)
public void doSomething() {
    // cái gì đó cần thực hiện định kỳ
}
```

Ví dụ: Sử dụng `fixedRate` để chỉ định điều kiện kích hoạt là thực hiện mỗi 5000 milliseconds. Lưu ý: Thực hiện lần kích hoạt tiếp theo sau chính xác 5000 milliseconds, bất kể lần kích hoạt trước có thành công hay không.

```java
@Scheduled(fixedRate=5000)
public void doSomething() {
    // cái gì đó cần thực hiện định kỳ
}
```

Ví dụ: Sử dụng `initialDelay` để chỉ định phương thức bắt đầu lập lịch sau 1000 milliseconds kể từ khi khởi tạo.

```java
@Scheduled(initialDelay=1000, fixedRate=5000)
public void doSomething() {
    // cái gì đó cần thực hiện định kỳ
}
```

Ví dụ: Sử dụng biểu thức `cron` để chỉ định điều kiện kích hoạt là thực hiện mỗi 5000 milliseconds. Quy tắc cron tương tự như trong Quartz.

```java
@Scheduled(cron="*/5 * * * * MON-FRI")
public void doSomething() {
    // cái gì đó cần thực hiện vào các ngày trong tuần
}
```

#### Ví dụ đầy đủ

**(1) Kích hoạt annotation và xác định trình lập lịch và trình thực thi**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:task="http://www.springframework.org/schema/task"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
       http://www.springframework.org/schema/mvc
       http://www.springframework.org/schema/mvc/spring-mvc-3.1.xsd
       http://www.springframework.org/schema/task
       http://www.springframework.org/schema/task/spring-task-3.1.xsd">

  <mvc:annotation-driven/>
  <task:annotation-driven executor="myExecutor" scheduler="myScheduler"/>
  <task:executor id="myExecutor" pool-size="5"/>
  <task:scheduler id="myScheduler" pool-size="10"/>
</beans>
```

**(2) Sử dụng annotation @Scheduler để trang trí một phương thức cần lập lịch**  
Dưới đây là ví dụ về cách sử dụng annotation @Scheduler để xác định các điều kiện kích hoạt khác nhau.

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @description Ví dụ về việc sử dụng annotation @Scheduler để lập lịch nhiệm vụ
 * @author Victor
 * @date 2016年8月31日
 */
@Component
public class ScheduledMgr {
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    final Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     * In ra thời gian khởi tạo trong constructor
     */
    public ScheduledMgr() {
        logger.info("Current time: {}", dateFormat.format(new Date()));
    }

    /**
     * Thuộc tính fixedDelay xác định thời gian gián cách giữa các lần lập lịch. Lập lịch phải chờ cho đến khi lần lập lịch trước hoàn thành trước khi thực hiện lần lập lịch tiếp theo.
     */
    @Scheduled(fixedDelay = 5000)
    public void testFixedDelay() throws Exception {
        Thread.sleep(6000);
        logger.info("Current time: {}", dateFormat.format(new Date()));
    }

    /**
     * Thuộc tính fixedRate xác định thời gian gián cách giữa các lần lập lịch. Lập lịch không chờ đợi lần lập lịch trước hoàn thành trước khi thực hiện lần lập lịch tiếp theo.
     */
    @Scheduled(fixedRate = 5000)
    public void testFixedRate() throws Exception {
        Thread.sleep(6000);
        logger.info("Current time: {}", dateFormat.format(new Date()));
    }

    /**
     * Thuộc tính initialDelay xác định thời gian trễ khởi động sau khi khởi tạo
     */
    @Scheduled(initialDelay = 1000, fixedRate = 5000)
    public void testInitialDelay() throws Exception {
        Thread.sleep(6000);
        logger.info("Current time: {}", dateFormat.format(new Date()));
    }

    /**
     * Thuộc tính cron hỗ trợ sử dụng biểu thức cron để xác định điều kiện kích hoạt
     */
    @Scheduled(cron = "0/5 * * * * ?")
    public void testCron() throws Exception {
        Thread.sleep(6000);
        logger.info("Current time: {}", dateFormat.format(new Date()));
    }
}
```

Tôi đã cố ý đặt các khoảng thời gian kích hoạt là 5 giây và có một câu lệnh Thread.sleep(6000); trong mỗi phương thức. Điều này đảm bảo rằng phương thức không thể hoàn thành trước thời điểm kích hoạt tiếp theo, để xem xét các phương pháp khác nhau hoạt động như thế nào.  
Sau khi khởi động dự án Spring, Spring sẽ quét các annotation @Component và khởi tạo ScheduledMgr.  
Tiếp theo, Spring sẽ quét các annotation @Scheduler và khởi tạo trình lập lịch. Trình lập lịch bắt đầu hoạt động khi điều kiện kích hoạt khớp, và in ra các thông tin nhật ký.  
Tôi sẽ trích dẫn một số thông tin nhật ký để phân tích.

```
10:58:46.479 localhost-startStop-1 o.z.n.s.scheduler.ScheduledTasks.<init> - Current time: 2016-08-31 10:58:46
10:58:52.523 myScheduler-1 o.z.n.s.scheduler.ScheduledTasks.testFixedRate - Current time: 2016-08-31 10:58:52
10:58:52.523 myScheduler-3 o.z.n.s.scheduler.ScheduledTasks.testFixedDelay - Current time: 2016-08-31 10:58:52
10:58:53.524 myScheduler-2 o.z.n.s.scheduler.ScheduledTasks.testInitialDelay - Current time: 2016-08-31 10:58:53
10:58:55.993 myScheduler-4 o.z.n.s.scheduler.ScheduledTasks.testCron - Current time: 2016-08-31 10:58:55
10:58:58.507 myScheduler-1 o.z.n.s.scheduler.ScheduledTasks.testFixedRate - Current time: 2016-08-31 10:58:58
10:58:59.525 myScheduler-5 o.z.n.s.scheduler.ScheduledTasks.testInitialDelay - Current time: 2016-08-31 10:58:59
10:59:03.536 myScheduler-3 o.z.n.s.scheduler.ScheduledTasks.testFixedDelay - Current time: 2016-08-31 10:59:03
10:59:04.527 myScheduler-1 o.z.n.s.scheduler.ScheduledTasks.testFixedRate - Current time: 2016-08-31 10:59:04
10:59:05.527 myScheduler-4 o.z.n.s.scheduler.ScheduledTasks.testInitialDelay - Current time: 2016-08-31 10:59:05
10:59:06.032 myScheduler-2 o.z.n.s.scheduler.ScheduledTasks.testCron - Current time: 2016-08-31 10:59:06
10:59:10.534 myScheduler-9 o.z.n.s.scheduler.ScheduledTasks.testFixedRate - Current time: 2016-08-31 10:59:10
10:59:11.527 myScheduler-10 o.z.n.s.scheduler.ScheduledTasks.testInitialDelay - Current time: 2016-08-31 10:59:11
10:59:14.524 myScheduler-4 o.z.n.s.scheduler.ScheduledTasks.testFixedDelay - Current time: 2016-08-31 10:59:14
10:59:15.987 myScheduler-6 o.z.n.s.scheduler.ScheduledTasks.testCron - Current time: 2016-08-31 10:59:15
```

Phương thức khởi tạo được in ra một lần, thời điểm là 10:58:46.  
`testFixedRate` được in ra bốn lần, mỗi lần cách nhau 6 giây. Điều này cho thấy, `fixedRate` không chờ đợi lần lập lịch trước hoàn thành, khi thời gian chờ đợi đạt đến, nó sẽ thực thi ngay lập tức.  
`testFixedDelay` được in ra ba lần, mỗi lần cách nhau hơn 6 giây, và thời gian không cố định. Điều này cho thấy, `fixedDelay` chờ đợi cho đến khi lần lập lịch trước hoàn thành, sau đó bắt đầu tính toán thời gian chờ đợi, sau đó mới thực thi.  
`testInitialDelay` lần đầu tiên lập lịch và thời gian lập lịch của phương thức khởi tạo cách nhau 7 giây. Điều này cho thấy, `initialDelay` chờ sau khi khởi tạo và chờ đợi một khoảng thời gian chờ đợi cụ thể trước khi bắt đầu lập lịch.  
`testCron` in ra ba lần, khoảng thời gian không phải là 5 hoặc 6 giây, rõ ràng, `cron` chờ đợi cho đến khi lần lập lịch trước hoàn thành, sau đó bắt đầu tính toán thời gian chờ đợi, sau đó mới thực thi.  
Ngoài ra, bạn có thể thấy từ nhật ký rằng, số lượng tối đa của các luồng in nhật ký chỉ là 10, cho thấy cấu hình thread pool lập lịch trong phần 2.1 đã có hiệu lực.

## Tham khảo

[Tài liệu chính thức của Spring Framework](http://docs.spring.io/spring/docs/current/spring-framework-reference/htmlsingle/)
