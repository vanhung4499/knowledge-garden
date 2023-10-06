---
title: Observer Pattern
tags:
  - design-pattern
categories:
  - design-pattern
date created: 2023-10-06
date modified: 2023-10-06
---

## Ý tưởng

**Observer Pattern** là một mẫu thiết kế hành vi cho phép bạn xác định một cơ chế đăng ký, cho phép nhiều đối tượng "quan sát" một đối tượng khác và được thông báo khi sự kiện xảy ra trên đối tượng đó.

## Ứng dụng

- Sử dụng Observer Pattern khi việc thay đổi trạng thái của một đối tượng cần thay đổi các đối tượng khác, hoặc khi đối tượng thực tế là không xác định trước hoặc thay đổi động.
- Sử dụng Observer Pattern khi một số đối tượng trong ứng dụng phải quan sát các đối tượng khác. Tuy nhiên, việc quan sát chỉ diễn ra trong một khoảng thời gian hạn chế hoặc trong một số trường hợp cụ thể.

## Cấu trúc

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210519174232.png)

### Giải thích cấu trúc

1. **Người phát hành** (Publisher) gửi các sự kiện quan trọng đến các đối tượng khác. Sự kiện xảy ra khi trạng thái của người phát hành thay đổi hoặc khi một hành động cụ thể được thực hiện. Người phát hành chứa một cơ chế đăng ký cho phép các người đăng ký mới tham gia và các người đăng ký hiện tại rời khỏi danh sách.
2. Khi một sự kiện mới xảy ra, người gửi sẽ lặp qua danh sách đăng ký và gọi phương thức thông báo của mỗi đối tượng đăng ký. Phương thức này được khai báo trong giao diện đăng ký.
3. **Người đăng ký** (Subscriber) giao diện khai báo phương thức thông báo. Trong hầu hết các trường hợp, giao diện này chỉ chứa một phương thức cập nhật (update). Phương thức này có thể có nhiều tham số, cho phép người phát hành truyền thông tin chi tiết về sự kiện trong quá trình cập nhật.
4. **Người đăng ký cụ thể** (Concrete Subscribers) có thể thực hiện một số hành động để phản hồi thông báo từ người phát hành. Tất cả các lớp người đăng ký cụ thể đều triển khai cùng một giao diện, do đó người phát hành không cần phụ thuộc vào các lớp cụ thể.
5. Người đăng ký thường cần một số thông tin ngữ cảnh để xử lý cập nhật một cách chính xác. Do đó, người phát hành thường truyền một số dữ liệu ngữ cảnh như tham số cho phương thức thông báo. Người phát hành cũng có thể truyền chính nó như một tham số để cho người đăng ký truy cập trực tiếp vào dữ liệu cần thiết.
6. **Khách hàng** (Client) tạo các đối tượng người phát hành và người đăng ký, sau đó đăng ký người đăng ký với người phát hành để nhận thông báo từ nó.

### Mẫu code cấu trúc

**Subject**: Là lớp chủ đề, lưu trữ tất cả các quan sát viên đăng ký cho chủ đề này, số lượng quan sát viên là tùy ý. Xác định giao diện để **thêm quan sát viên (Attach)** và **xóa quan sát viên (Detach)**.

```java
abstract class Subject {
    protected String name;
    protected String state;
    protected List<Observer> observers = new ArrayList<Observer>();

    public abstract String getState();
    public abstract void setState(String state);
    public abstract void Notify();

    public Subject(String name) {
        this.name = name;
    }

    public void Attach(Observer observer) {
        observers.add(observer);
    }

    public void Detach(Observer observer) {
        observers.remove(observer);
    }
}
```

**Observer**: Là lớp quan sát viên, xác định giao diện **cập nhật (Update)**, khi nhận được thông báo từ Chủ đề, Quan sát viên cần cập nhật thông tin đồng bộ.

```java
abstract class Observer {
    protected String name;
    protected Subject subject;
    public Observer(String name, Subject subject) {
        this.name = name;
        this.subject = subject;
    }
    public abstract void Update();
}
```

**ConcreteSubject**: Là lớp chủ đề cụ thể, lưu trữ tất cả các quan sát viên quan tâm đến chủ đề này. Khi trạng thái nội bộ thay đổi, nên **thông báo cho tất cả các quan sát viên đã đăng ký (Notify)**.

```java
class ConcreteSubject extends Subject {
    public ConcreteSubject(String name) {
        super(name);
    }

    @Override
    public String getState() {
        return state;
    }

    @Override
    public void setState(String state) {
        this.state = state;
    }

    @Override
    public void Notify() {
        System.out.println("======= " + this.name + " chủ đề có thông báo mới =======");
        for (Observer observer : observers) {
            observer.Update();
        }
    }
}
```

**ConcreteObserver**: Là lớp quan sát viên cụ thể, triển khai phương thức **cập nhật (Update)** của Observer để đồng bộ thông tin trạng thái với Chủ đề.

```java
class ConcreteObserver extends Observer {
    private String state;
    public ConcreteObserver(String name, Subject subject) {
        super(name, subject);
    }

    @Override
    public void Update() {
        state = subject.getState();
        System.out.println(this.name + " nhận được trạng thái hiện tại: " + state);
    }
}
```

Client

```java
public class ObserverPattern {
    public static void main(String[] args) {
        ConcreteSubject subject = new ConcreteSubject("Thời tiết");
        ConcreteObserver observer1 = new ConcreteObserver("John", subject);
        ConcreteObserver observer2 = new ConcreteObserver("Alice", subject);
        ConcreteObserver observer3 = new ConcreteObserver("Bob", subject);

        subject.Attach(observer1);
        subject.Attach(observer2);
        subject.Attach(observer3);
        subject.setState("Hôm nay mưa");
        subject.Notify();

        subject.Detach(observer2);
        subject.setState("Ngày mai nắng");
        subject.Notify();
    }
}
```

Output

```
======= Chủ đề Thời tiết có thông báo mới =======
John nhận được trạng thái hiện tại: Hôm nay mưa
Alice nhận được trạng thái hiện tại: Hôm nay mưa
Bob nhận được trạng thái hiện tại: Hôm nay mưa
======= Chủ đề Thời tiết có thông báo mới =======
John nhận được trạng thái hiện tại: Ngày mai nắng
Bob nhận được trạng thái hiện tại: Ngày mai nắng
```

## Pseudocode

Trong ví dụ này, mẫu **Quan sát viên** cho phép đối tượng trình soạn thảo văn bản thông báo về các thay đổi trạng thái của nó cho các đối tượng dịch vụ khác.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210519175224.png)

Danh sách người đăng ký được tạo động: đối tượng có thể bắt đầu hoặc dừng lắng nghe thông báo theo nhu cầu của chương trình.

Trong cài đặt này, lớp trình soạn thảo không tự quản lý danh sách đăng ký. Nó giao việc này cho một đối tượng trợ giúp đặc biệt chịu trách nhiệm. Bạn cũng có thể nâng cấp đối tượng này thành một trình phân phối sự kiện trung tâm, cho phép bất kỳ đối tượng nào trở thành người phát hành.

Miễn là người phát hành tương tác với tất cả các người đăng ký thông qua cùng một giao diện, không cần sửa đổi mã của lớp người phát hành hiện có khi thêm người đăng ký vào chương trình.

```java
// The base publisher class includes subscription management
// code and notification methods.
class EventManager is
    private field listeners: hash map of event types and listeners

    method subscribe(eventType, listener) is
        listeners.add(eventType, listener)

    method unsubscribe(eventType, listener) is
        listeners.remove(eventType, listener)

    method notify(eventType, data) is
        foreach (listener in listeners.of(eventType)) do
            listener.update(data)

// The concrete publisher contains real business logic that's
// interesting for some subscribers. We could derive this class
// from the base publisher, but that isn't always possible in
// real life because the concrete publisher might already be a
// subclass. In this case, you can patch the subscription logic
// in with composition, as we did here.
class Editor is
    public field events: EventManager
    private field file: File

    constructor Editor() is
        events = new EventManager()

    // Methods of business logic can notify subscribers about
    // changes.
    method openFile(path) is
        this.file = new File(path)
        events.notify("open", file.name)

    method saveFile() is
        file.write()
        events.notify("save", file.name)

    // ...

// Here's the subscriber interface. If your programming language
// supports functional types, you can replace the whole
// subscriber hierarchy with a set of functions.
interface EventListener is
    method update(filename)

// Concrete subscribers react to updates issued by the publisher
// they are attached to.
class LoggingListener implements EventListener is
    private field log: File
    private field message: string

    constructor LoggingListener(log_filename, message) is
        this.log = new File(log_filename)
        this.message = message

    method update(filename) is
        log.write(replace('%s',filename,message))

class EmailAlertsListener implements EventListener is
    private field email: string
    private field message: string

    constructor EmailAlertsListener(email, message) is
        this.email = email
        this.message = message

    method update(filename) is
        system.email(email, replace('%s',filename,message))

// An application can configure publishers and subscribers at
// runtime.
class Application is
    method config() is
        editor = new Editor()

        logger = new LoggingListener(
            "/path/to/log.txt",
            "Someone has opened the file: %s")
        editor.events.subscribe("open", logger)

        emailAlerts = new EmailAlertsListener(
            "admin@example.com",
            "Someone has changed the file: %s")
        editor.events.subscribe("save", emailAlerts)
```

## Mối quan hệ với các mẫu khác

- [[Chain of Responsibility Pattern]], [[Command Pattern]], [[Mediator Pattern]] và [[Observer Pattern]] được sử dụng để xử lý các cách kết nối khác nhau giữa người gửi yêu cầu và người nhận:
  - *Chain of Responsibility* chuyển tiếp yêu cầu động theo thứ tự cho một loạt các người nhận tiềm năng cho đến khi một người nhận xử lý yêu cầu.
  - *Command* thiết lập một kết nối một chiều giữa người gửi và người nhận yêu cầu.
  - *Mediator* loại bỏ kết nối trực tiếp giữa người gửi và người nhận, buộc họ giao tiếp gián tiếp thông qua một đối tượng trung gian.
  - *Observer* cho phép người nhận đăng ký hoặc hủy đăng ký động để nhận yêu cầu.
- Sự khác biệt giữa [[Mediator Pattern]] và [[Observer Pattern]] thường khó nhớ. Trong hầu hết các trường hợp, bạn có thể sử dụng một trong hai mẫu này, và đôi khi bạn có thể sử dụng cả hai cùng một lúc. Hãy xem cách làm điều đó.
  - Mục tiêu chính của *Mediator* là loại bỏ sự phụ thuộc lẫn nhau giữa các thành phần của hệ thống. Các thành phần này sẽ phụ thuộc vào cùng một đối tượng trung gian. Mục tiêu của *Observer* là thiết lập kết nối động một chiều giữa các đối tượng, cho phép một số đối tượng phụ thuộc vào các đối tượng khác để thực hiện chức năng phụ.
  - Có một cách phổ biến để triển khai *Mediator* dựa trên *Observer*. Đối tượng trung gian đóng vai trò như một người phát hành, trong khi các thành phần khác đóng vai trò như các người nghe, có thể đăng ký hoặc hủy đăng ký với người phát hành. Khi *Mediator* được triển khai theo cách này, nó có thể trông giống như *Observer* rất nhiều.
  - Khi bạn cảm thấy bối rối, hãy nhớ rằng *Mediator* có thể được triển khai theo cách khác. Ví dụ, bạn có thể liên kết tất cả các thành phần với cùng một đối tượng trung gian một cách vĩnh viễn. Cách triển khai này không giống với *Observer*, nhưng nó vẫn là một mẫu *Mediator*.
  - Giả sử có một chương trình trong đó tất cả các thành phần trở thành người phát hành và có thể thiết lập kết nối động với nhau. Trong trường hợp đó, không có một đối tượng trung tâm trung gian, mà chỉ có một số người nghe phân tán.

## Ví dụ

**Sử dụng ví dụ:** Mẫu Observer rất phổ biến trong mã Java, đặc biệt là trong các thành phần GUI. Nó cung cấp một cách để phản ứng với các sự kiện của thành phần mà không phụ thuộc vào lớp chủ sở hữu khác.

Dưới đây là một số ví dụ trong thư viện cốt lõi của Java:

- `java.util.Observer`/`java.util.Observable` (rất ít được sử dụng trong thực tế)
- Tất cả các triển khai của `java.util.EventListener` (rất phổ biến trong các thành phần Swing)
- `javax.servlet.http.HttpSessionBindingListener`
- `javax.servlet.http.HttpSessionAttributeListener`
- `javax.faces.event.PhaseListener`

**Cách nhận biết:** Mẫu này có thể được nhận biết bằng cách lưu trữ đối tượng trong một danh sách đăng ký và gọi phương thức cập nhật cho các đối tượng trong danh sách khi có sự cập nhật từ phía đối tượng gửi yêu cầu.
