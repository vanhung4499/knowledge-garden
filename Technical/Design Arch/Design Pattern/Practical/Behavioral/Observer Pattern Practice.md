---
title: Observer Pattern Practice
tags:
  - design-pattern
categories: 
date created: 2024-04-01
date modified: 2024-04-01
---

# Observer Pattern Practice: Mô phỏng quy trình xổ số và giám sát các tin nhắn để thông báo cho người dùng về các kịch bản chiến thắng

## Giới thiệu

"Kiến thức càng nhiều, điều chúng ta không biết càng nhiều."

Con đường phát triển trong lập trình không bao giờ kết thúc, giống như từ trước đây bạn có thể tự tin nói bạn thành thạo Java, sau đó bạn chỉ muốn hiểu biết về Java, và sau vài năm bạn chỉ muốn nói bạn hiểu một chút về Java. Khi tầm nhìn và tầm nhìn mở rộng, chúng ta sẽ càng phát hiện ra cách nhìn của mình trước đây là nông cạn như thế nào, giống như đứng trên Trái đất nhìn Trái đất và đứng trong Vũ trụ nhìn Trái đất. Nhưng chính vì lòng rộng lớn và tầm nhìn mở rộng, chúng ta có nhiều nhận thức hơn và dần dần học được nhiều kỹ năng hơn. Mặc dù không biết càng nhiều, nhưng cũng nhờ đó mà bản thân chúng ta đã tích lũy được nhiều kiến thức, khiến bản thân mạnh mẽ hơn.

"Sự lười biếng trong việc học hỏi là đáng sợ."

Bây giờ không giống như trước, tài liệu đa dạng, cách tiếp cận rộng rãi, trong đó chứa đựng rất nhiều quảng cáo. Điều này làm cho rất nhiều người mới học khó khăn để tìm kiếm kiến thức mà họ cần, và cuối cùng khi họ thấy có người giới thiệu tài liệu học liên quan, họ ngay lập tức chặn, xóa, nhưng đồng thời, các tài liệu học chất lượng cũng không được những người cần xem. Dần dần, họ dành nhiều thời gian và năng lượng của mình cho trò chơi, giải trí, và đa phương tiện, việc giải trí phù hợp là được chấp nhận, nhưng thường xuyên dễ dàng mắc phải, và sau đó rất khó để thoát ra khỏi. Do đó, họ cần phải lập kế hoạch để tự mình phát triển, và giữ một chút kiên nhẫn.

"Cân nhắc giữa chi phí thiết kế phần mềm và chi phí thực hiện là quan trọng."

Đôi khi, một thiết kế kiến trúc phần mềm cần phải phù hợp với các yếu tố hiện tại, thường không thể bắt đầu thực hiện chỉ vì một kế hoạch trong đầu. Có thể mặc dù thiết kế của bạn rất xuất sắc, nhưng vẫn khó đáp ứng yêu cầu thời gian của doanh nghiệp, khi mà nhu cầu cơ bản của một dự án không được đáp ứng, dự án toàn bộ cũng sẽ đứng im. Nhưng phát triển cũng không thể chỉ là một đống mã lạ mắt, vì vậy cần phải tìm ra một mức độ phù hợp, ví dụ như có thể thiết lập một nền tảng vững chắc, dễ mở rộng. Nhưng về cơ bản, các tính năng cụ thể có thể được đơn giản hóa ban đầu, và sau đó được hoàn thiện trong quá trình phát triển.

## Môi trường phát triển

1. JDK 1.8
2. Idea + Maven
3. Code: [vanhung4499/practical-java-design](https://github.com/vanhung4499/practical-java-design)  

| Dự án             | Mô tả                                                                 |
| ----------------- | --------------------------------------------------------------------- |
| demo-design-18-00 | Dự án m Dự án mô phỏng tình huống: mô phỏng một giao diện rút thăm xe hơi nhỏ     ign-18-01 | Sử dụng một Triển khai code để thực hiện yêu cầu kinh doanh                           18-02 | Tối ưu code thông qua mô hình thiết kế, tạo ra sự so sánh để học        |
|                   |                                                                       |

## Giới thiệu mô hình quan sát

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240401150915.png)

Để nói một cách đơn giản về mô hình quan sát🕵, đó là khi một hành động xảy ra, thông tin được chuyển đến người nghe khác để thực hiện xử lý tương ứng, không có mối liên kết trực tiếp giữa hai bên. Ví dụ; Xạ thủ bắn tỉa, Lý Văn Lượng.

Ngoài các tình huống trong cuộc sống, chúng ta cũng thường sử dụng một số mô hình hoặc thành phần theo dõi trong quá trình phát triển phần mềm, ví dụ như dịch vụ MQ mà chúng ta thường sử dụng. Mặc dù dịch vụ MQ có một trung tâm thông báo và không phải tất cả các dịch vụ lớp nhận thông báo, nhưng nó cũng có thể được coi là thiết kế mô hình quan sát. Ví dụ khác có thể là một số bus lắng nghe sự kiện, cho phép dịch vụ chính chia rẽ khỏi các dịch vụ phụ khác, nhằm giảm kết nối và tăng tính mở rộng của hệ thống.

## Mô phỏng tình huống

**Trong tình huống này, chúng tôi mô phỏng mỗi lần sự kiện rút thăm số xe nhỏ, thông báo sự kiện (Thực tế sự kiện này sẽ không được trang web chính thức gửi tin nhắn cho bạn)**

Có lẽ đa số mọi người khi nhìn thấy ví dụ này sẽ nghĩ đến tình huống mỗi khi rút thăm số xe nhỏ mà mình không trúng, nhận được một tin nhắn thông báo đáng tiếc. Tuy nhiên, hệ thống rút thăm hiện tại không gửi tin nhắn cho bạn, mà được gửi bằng Google hoặc một số plugin khác. Vậy nếu bạn phải phát triển một tính năng rút thăm tương tự và cần thông báo sự kiện cho người dùng bên ngoài cũng như thêm một số quy trình hỗ trợ bổ sung ngoài quy trình chính thì bạn sẽ xử lý như thế nào?

Đa số mọi người thường thực hiện việc triển khai các lớp thông báo sự kiện như vậy một cách khá thô sơ, đơn giản là thêm trực tiếp vào lớp. 1 là vì họ nghĩ rằng việc này có thể không mở rộng, 2 là vì họ thậm chí không nghĩ tới. Nhưng nếu bạn đã suy nghĩ kỹ về chức năng của lớp cốt lõi của mình, bạn sẽ nhận ra rằng có một số chức năng cốt lõi, cũng như một số chức năng hỗ trợ. Ví dụ, sau khi hoàn thành một hành động nào đó, cần kích hoạt MQ để gửi ra bên ngoài và thực hiện một số thông báo PUSH cho người dùng, tất cả những điều này không phải là một chuỗi quy trình cốt lõi và có thể được xử lý thông qua cách thông báo sự kiện.

Tiếp theo, chúng ta sẽ sử dụng mẫu thiết kế như vậy để tối ưu hóa mã trong tình huống này.

### Dự án mô phỏng tình huống

```java
design-demo-18-00
├── pom.xml
└── src
    └── main
        └── java
            └── com
                └── hnv99
                    └── design
                        └── MinibusTargetService.java
```

- Đây là một dịch vụ giao diện mô phỏng rút thăm số xe nhỏ.

### Tóm tắt tình huống

#### Dịch vụ rút thăm

```java
public class MinibusTargetService {

    /**
     * Giả lập rút thăm, nhưng không phải thuật toán rút thăm thực sự
     *
     * @param uId Mã người dùng
     * @return Kết quả
     */
    public String lottery(String uId) {
        return Math.abs(uId.hashCode()) % 2 == 0 ? "Chúc mừng bạn, mã".concat(uId).concat(" được chọn trong lần rút thăm này") : "Rất tiếc, mã".concat(uId).concat(" không được chọn trong lần rút thăm này hoặc hết thời hạn rút thăm");
    }

}
```

- Đây là một giao diện giả lập rút thăm, nhưng không phải là thuật toán rút thăm thực sự.

## Triển khai code trực tiếp

`Ở đây chúng ta sẽ bắt đầu bằng cách triển khai chức năng một cách tệ hại nhất`

Theo yêu cầu, chúng ta cần thêm chức năng gửi tin nhắn MQ và thông báo ngắn cho dịch vụ rút thăm số xe nhỏ hiện có. Nếu sử dụng cách tiếp cận trực tiếp nhất, bạn có thể bổ sung chức năng trực tiếp vào phương thức.

### Cấu trúc dự án

```java
itstack-demo-design-18-01
└── src
    └── main
        └── java
            └── org.itstack.demo.design
                ├── LotteryResult.java
                ├── LotteryService.java
                └── LotteryServiceImpl.java
```

- Mã trong giao diện này bao gồm ba phần; Đối tượng trả về (`LotteryResult`), định nghĩa giao diện (`LotteryService`), và triển khai cụ thể (`LotteryServiceImpl`).

### Triển khai code

```java
import java.util.Date;

public class LotteryServiceImpl implements LotteryService {

    private Logger logger = LoggerFactory.getLogger(LotteryServiceImpl.class);

    private MinibusTargetService minibusTargetService = new MinibusTargetService();

    public LotteryResult doDraw(String uId) {
        // Rút thăm
        String lottery = minibusTargetService.lottery(uId);
        // Gửi tin nhắn
        logger.info("Gửi tin nhắn thông báo cho người dùng {} (tin nhắn): {}", uId, lottery);
        // Gửi tin nhắn MQ
        logger.info("Ghi nhận kết quả rút thăm của người dùng {} (MQ): {}", uId, lottery);
        // Kết quả
        return new LotteryResult(uId, lottery, new Date());
    }

}
```

- Từ các phần code triển khai trên, bạn có thể thấy rằng quá trình tổng cả ba phần gồm có; Rút thăm, gửi tin nhắn, và gửi tin nhắn MQ, và tất cả chúng đều được gọi theo thứ tự.
- Ngoài việc gọi giao diện "rút thăm", các phần sau đều không phải là một chuỗi chính của quy trình, và chúng sẽ phát triển và điều chỉnh liên tục theo yêu cầu kinh doanh trong tương lai. Dưới dạng phát triển này, cách tiếp cận hiện tại rất khó để bảo trì.

### Kiểm thử

#### Viết lớp kiểm thử

```java
@Test
public void test() {
    LotteryService lotteryService = new LotteryServiceImpl();
    LotteryResult result = lotteryService.doDraw("2765789109876");
    logger.info("Kết quả kiểm tra: {}", JSON.toJSONString(result));
}
```

- Trong quá trình kiểm thử, gọi giao diện dịch vụ rút thăm số xe nhỏ.

#### Kết quả

```java
2024-04-01 15:41:41.498	INFO	main		(ApiTest.java:14)	|	Kết quả kiểm tra: Rất tiếc, mã2765789109876không trúng hoặc đã hết hạn tham gia quay số lần này
```

- Kết quả kiểm tra là đúng như dự kiến, và cũng giống như cách mà chúng ta thường thấy trong việc phát triển code.

## Tái cấu trúc theo Observer Pattern

### Cấu trúc dự án

```java
itstack-demo-design-18-02
└── src
    └── main
        └── java
            └── org.itstack.demo.design
                ├── event
                │    ├── listener
                │    │    ├── EventListener.java
                │    │    ├── MessageEventListener.java
                │    │    └── MQEventListener.java
                │    └── EventManager.java
                ├── LotteryResult.java
                ├── LotteryService.java
                └── LotteryServiceImpl.java
```

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240401154345.png)

- Trong hình ảnh trên, chúng ta có thể chia thành ba phần chính; `lắng nghe sự kiện`, `xử lý sự kiện`, `quy trình kinh doanh cụ thể`, và trong quy trình kinh doanh cụ thể `LotteryService` được định nghĩa là một lớp trừu tượng, vì điều này có thể ẩn đi chức năng sự kiện thông qua lớp trừu tượng, người phát triển quy trình kinh doanh bên ngoài không cần biết về các hoạt động thông báo cụ thể.
- Hình tròn ở góc dưới bên phải đại diện cho cấu trúc của quy trình chính và quy trình phụ, trong phát triển, chúng ta sẽ hoàn thành quy trình chính trước, sau đó xử lý các quy trình phụ thông qua cách thông báo. Chúng có thể là không đồng bộ, trong xử lý thông qua MQ và công việc lên lịch, đảm bảo tính nhất quán cuối cùng.

### Triển khai code

#### Định nghĩa giao diện lắng nghe sự kiện

```java
public interface EventListener {

    void doEvent(LotteryResult result);

}
```

- Giao diện định nghĩa một lớp sự kiện cơ bản, ở đây nếu kiểu thông tin đầu vào của phương thức thay đổi, bạn có thể sử dụng generics `<T>`.

#### Triển khai hai sự kiện lắng nghe cụ thể

**Lắng nghe sự kiện tin nhắn**

```java
public class MessageEventListener implements EventListener {  
  
    private Logger logger = LoggerFactory.getLogger(MessageEventListener.class);  
  
    @Override  
    public void doEvent(LotteryResult result) {  
        logger.info("Gửi tin nhắn thông báo (Tin nhắn) đến người dùng {}: {}", result.getUId(), result.getMsg());  
    }  
}
```

**Lắng nghe sự kiện gửi MQ**

```java
public class MQEventListener implements EventListener {  
  
    private Logger logger = LoggerFactory.getLogger(MQEventListener.class);  
  
    @Override  
    public void doEvent(LotteryResult result) {  
        logger.info("Ghi lại kết quả rút thăm của người dùng {} (MQ): {}", result.getUId(), result.getMsg());  
    }  
}
```

- Đây là hai triển khai sự kiện cụ thể, tương đối đơn giản. Trong phát triển thực tế của doanh nghiệp, bạn có thể cần gọi API bên ngoài và xử lý ngoại lệ.
- Đồng thời, như đã đề cập ở trên, giao diện sự kiện được thêm generics, nếu cần, trong triển khai sự kiện, bạn có thể đóng gói nội dung sự kiện theo các loại khác nhau.

#### Lớp xử lý sự kiện

```java
public class EventManager {

    Map<Enum<EventType>, List<EventListener>> listeners = new HashMap<>();

    public EventManager(Enum<EventType>... operations) {
        for (Enum<EventType> operation : operations) {
            this.listeners.put(operation, new ArrayList<>());
        }
    }

    public enum EventType {
        MQ, Message
    }

    /**
     * Đăng ký
     * @param eventType Loại sự kiện
     * @param listener  Trình nghe
     */
    public void subscribe(Enum<EventType> eventType, EventListener listener) {
        List<EventListener> users = listeners.get(eventType);
        users.add(listener);
    }

    /**
     * Hủy đăng ký
     * @param eventType Loại sự kiện
     * @param listener  Trình nghe
     */
    public void unsubscribe(Enum<EventType> eventType, EventListener listener) {
        List<EventListener> users = listeners.get(eventType);
        users.remove(listener);
    }

    /**
     * Thông báo
     * @param eventType Loại sự kiện
     * @param result    Kết quả
     */
    public void notify(Enum<EventType> eventType, LotteryResult result) {
        List<EventListener> users = listeners.get(eventType);
        for (EventListener listener : users) {
            listener.doEvent(result);
        }
    }

}
```

- Trong triển khai này, ba phương thức chính được cung cấp: đăng ký (`subscribe`), hủy đăng ký (`unsubscribe`) và thông báo (`notify`). Các phương thức này được sử dụng để thêm và sử dụng các sự kiện lắng nghe.
- Bên cạnh đó, vì sự kiện có các loại khác nhau, ở đây sử dụng cách liệt kê để xử lý, cũng dễ dàng cho phía bên ngoài sử dụng sự kiện trong các quy tắc cụ thể (`EventType.MQ`, `EventType.Message`).

#### Giao diện lớp trừu tượng kinh doanh

```java
public abstract class LotteryService {

    private EventManager eventManager;

    public LotteryService() {
        eventManager = new EventManager(EventManager.EventType.MQ, EventManager.EventType.Message);
        eventManager.subscribe(EventManager.EventType.MQ, new MQEventListener());
        eventManager.subscribe(EventManager.EventType.Message, new MessageEventListener());
    }

    public LotteryResult draw(String uId) {
        LotteryResult lotteryResult = doDraw(uId);
        // Gọi đến những gì cần thông báo
        eventManager.notify(EventManager.EventType.MQ, lotteryResult);
        eventManager.notify(EventManager.EventType.Message, lotteryResult);
        return lotteryResult;
    }

    protected abstract LotteryResult doDraw(String uId);

}
```

- Cách triển khai này sử dụng lớp trừu tượng để định nghĩa phương thức thực hiện, có thể mở rộng và thêm các cuộc gọi bổ sung. Nó cung cấp một phương thức trừu tượng `abstract LotteryResult doDraw(String uId)` để các lớp con triển khai.
- Đồng thời, phương thức được định nghĩa bằng `protected`, đảm bảo rằng người gọi từ bên ngoài sẽ không gọi phương thức này, chỉ có thể gọi `draw(String uId)` để hoàn thành việc thông báo sự kiện.
- Cách triển khai này là viết một phương thức cơ bản trong một lớp trừu tượng, trong phương thức, thêm một cách tiếp cận mới trong khi thêm việc sử dụng lớp trừu tượng. Sự định nghĩa của lớp trừu tượng này sẽ được triển khai bởi lớp con.
- Ngoài ra, trong hàm tạo, đã cung cấp định nghĩa cho các sự kiện: `eventManager.subscribe(EventManager.EventType.MQ, new MQEventListener())`.
- Khi sử dụng, cũng sử dụng cách liệt kê để thông báo sự kiện, truyền loại gì `EventManager.EventType.MQ`, sự kiện đó sẽ được thực hiện, và thêm sự kiện theo nhu cầu.

#### Lớp triển khai giao diện kinh doanh

```java
public class LotteryServiceImpl extends LotteryService {

    private MinibusTargetService minibusTargetService = new MinibusTargetService();

    @Override
    protected LotteryResult doDraw(String uId) {
        // Trực tiếp ra số
        String lottery = minibusTargetService.lottery(uId);
        // Trả về kết quả
        return new LotteryResult(uId, lottery, new Date());
    }

}
```

- Bây giờ, khi nhìn vào triển khai luồng công việc, ta thấy rằng nó đã trở nên rất đơn giản, không có luồng công việc phụ trợ nào, chỉ có xử lý luồng công việc cốt lõi.

#### Lớp triển khai giao diện kinh doanh

```java
public class LotteryServiceImpl extends LotteryService {

    private MinibusTargetService minibusTargetService = new MinibusTargetService();

    @Override
    protected LotteryResult doDraw(String uId) {
        // Trực tiếp ra số
        String lottery = minibusTargetService.lottery(uId);
        // Trả về kết quả
        return new LotteryResult(uId, lottery, new Date());
    }

}
```

- Bây giờ, khi nhìn vào triển khai luồng công việc, ta thấy rằng nó đã trở nên rất đơn giản, không có luồng công việc phụ trợ nào, chỉ có xử lý luồng công việc cốt lõi.

### Kiểm thử

#### Viết lớp kiểm thử

```java
@Test
public void test() {
    LotteryService lotteryService = new LotteryServiceImpl();
    LotteryResult result = lotteryService.draw("2765789109876");
    logger.info("Kết quả kiểm thử: {}", JSON.toJSONString(result));
}
```

- Từ cách gọi trông gần như không có sự khác biệt, nhưng cách triển khai này giúp việc bảo trì mã nguồn và mở rộng yêu cầu mới trở nên dễ dàng hơn.

#### Kết quả

```shell
2024-04-01 16:00:55.903	INFO	main		(MQEventListener.java:13)	|	Ghi lại kết quả rút thăm của người dùng 2765789109876 (MQ): Rất tiếc, mã2765789109876không trúng hoặc đã hết hạn tham gia quay số lần này
2024-04-01 16:00:55.909	INFO	main		(MessageEventListener.java:13)	|	Gửi tin nhắn thông báo (Tin nhắn) đến người dùng 2765789109876: Rất tiếc, mã2765789109876không trúng hoặc đã hết hạn tham gia quay số lần này
2024-04-01 16:00:55.973	INFO	main		(ApiTest.java:16)	|	Kết quả kiểm thử: {"dateTime":1711962055902,"msg":"Rất tiếc, mã2765789109876không trúng hoặc đã hết hạn tham gia quay số lần này","uId":"2765789109876"}

```

- Từ kết quả kiểm thử, chúng ta thấy rằng kết quả đã đáp ứng các kỳ vọng của chúng ta. Mặc dù kết quả là giống nhau, nhưng chỉ có chúng ta mới hiểu được sức mạnh của mô hình thiết kế.

## Tổng kết

- Từ quá trình phát triển cơ bản ban đầu của chúng ta và sau đó là sử dụng Observer Pattern trong lập trình hướng đối tượng, chúng ta có thể thấy rằng sau khi cải tiến theo mẫu thiết kế, chúng ta đã tách rời các quy trình lõi và các quy trình hỗ trợ của mã. Thông thường, các quy trình lõi trong mã không thay đổi thường xuyên. Nhưng các quy trình hỗ trợ sẽ thay đổi theo thời gian và yêu cầu kinh doanh, bao gồm; `Tiếp thị`, `Phân chia` và `Khuyến mãi` vv, do đó việc sử dụng mẫu thiết kế để xây dựng mã trở nên rất cần thiết.
- Mô hình thiết kế này đáp ứng nguyên tắc mở đóng từ mặt cấu trúc. Khi bạn cần thêm các sự kiện nghe hoặc sửa đổi logic nghe, bạn không cần phải sửa đổi lớp xử lý sự kiện. Tuy nhiên, có thể bạn không kiểm soát thứ tự gọi hoặc cần phải xử lý một số kết quả sự kiện để tiếp tục thực hiện, vì vậy trong quá trình sử dụng, bạn cần xem xét tính hợp lý của tình huống.
- Bất kỳ mẫu thiết kế nào cũng không phải là một mình, chúng cần phải kết hợp với các mẫu khác để xây dựng cùng nhau. Ngoài ra, việc sử dụng mẫu thiết kế nhằm làm cho mã dễ mở rộng và bảo trì hơn, không thể làm cho cấu trúc trở nên phức tạp hơn và khó bảo trì chỉ vì thêm mẫu thiết kế. Kinh nghiệm sử dụng mẫu này một cách hợp lý cần được tích lũy thông qua việc thực hành thực tế nhiều.
