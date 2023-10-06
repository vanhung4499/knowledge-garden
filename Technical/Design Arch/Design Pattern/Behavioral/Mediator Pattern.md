---
title: Mediator Pattern
tags:
  - design-pattern
categories:
  - design-pattern
date created: 2023-10-06
date modified: 2023-10-06
---

## Mục đích

**Mediator Pattern** là một mẫu thiết kế hành vi giúp giảm thiểu sự phụ thuộc lẫn nhau và sự hỗn loạn giữa các đối tượng. Mẫu này giới hạn sự giao tiếp trực tiếp giữa các đối tượng và buộc chúng phải hợp tác thông qua một đối tượng trung gian.

## Ứng dụng

- Mediator Pattern được sử dụng khi các đối tượng và các đối tượng khác liên kết chặt chẽ đến mức khó có thể thay đổi.
- Khi các thành phần không thể được tái sử dụng trong các ứng dụng khác vì sự phụ thuộc quá mức vào các thành phần khác.
- Khi bạn cần tạo ra một số hành vi cơ bản có thể được tái sử dụng trong các tình huống khác nhau, nhưng điều này dẫn đến việc phải tạo ra nhiều lớp con của thành phần.

## Cấu trúc

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210520171152.png)

### Giải thích cấu trúc

1. **Component** (Thành phần) là các lớp chứa logic kinh doanh. Mỗi thành phần có một tham chiếu đến trung gian, được khai báo dưới dạng kiểu giao diện trung gian. Thành phần không biết lớp trung gian thực tế, do đó bạn có thể tái sử dụng nó trong các chương trình khác nhau bằng cách kết nối nó với các trung gian khác nhau.
2. **Mediator** (Trung gian) là giao diện khai báo các phương thức để giao tiếp với thành phần, nhưng thường chỉ bao gồm một phương thức thông báo. Thành phần có thể chuyển bất kỳ ngữ cảnh nào (bao gồm đối tượng của chính nó) làm đối số cho phương thức này, chỉ khi đó thành phần và lớp gửi không bị ràng buộc chặt chẽ.
3. **Concrete Mediator** (Trung gian cụ thể) đóng gói các mối quan hệ giữa nhiều thành phần. Trung gian cụ thể thường lưu trữ tham chiếu đến tất cả các thành phần và quản lý chúng, thậm chí có thể quản lý vòng đời của chúng.
4. Thành phần không biết về tình hình của các thành phần khác. Nếu có sự kiện quan trọng xảy ra trong thành phần, nó chỉ có thể thông báo cho trung gian. Sau khi nhận được thông báo, trung gian có thể dễ dàng xác định người gửi, điều này có thể đủ để xác định thành phần tiếp theo cần kích hoạt.

### Mẫu code cấu trúc

**Mediator**: Định nghĩa một giao diện giao tiếp cho các đối tượng Colleague.

```java
abstract class Mediator {
    public abstract void Send(String message, Colleague colleague);
}
```

**ConcreteMediator**: Thực hiện giao diện giao tiếp trong Mediator. Lớp này cần hiểu và duy trì tất cả các đối tượng Colleague.

```java
class ConcreteMediator extends Mediator {
    private ConcreteColleague1 colleague1;
    private ConcreteColleague2 colleague2;

    public void setColleague1(ConcreteColleague1 colleague1) {
        this.colleague1 = colleague1;
    }

    public void setColleague2(ConcreteColleague2 colleague2) {
        this.colleague2 = colleague2;
    }

    @Override
    public void Send(String message, Colleague colleague) {
        if (colleague == colleague1) {
            colleague2.Notify(message);
        } else if (colleague == colleague2){
            colleague1.Notify(message);
        } else {
            System.out.println("Lỗi!");
        }
    }
}
```

**Nhóm Colleague**: Mỗi đối tượng Colleague nên biết về đối tượng Mediator của nó, nhưng không biết về các đối tượng Colleague khác. Nó chỉ có thể liên lạc với đối tượng Mediator.

```java
abstract class Colleague {
    protected Mediator mediator;

    public Colleague(Mediator mediator) {
        this.mediator = mediator;
    }

    public void Send(String message) {
        mediator.Send(message, this);
    }

    public abstract void Notify(String message);
}

class ConcreteColleague1 extends Colleague {
    public ConcreteColleague1(Mediator mediator) {
        super(mediator);
    }

    @Override
    public void Notify(String message) {
        System.out.println("Đồng nghiệp 1 nhận được thông điệp: " + message);
    }
}

class ConcreteColleague2 extends Colleague {
    public ConcreteColleague2(Mediator mediator) {
        super(mediator);
    }

    @Override
    public void Notify(String message) {
        System.out.println("Đồng nghiệp 2 nhận được thông điệp: " + message);
    }
}
```

Khách hàng

```java
public class MediatorPattern {
    public static void main(String[] args) {
        ConcreteMediator mediator = new ConcreteMediator();
        ConcreteColleague1 colleague1 = new ConcreteColleague1(mediator);
        ConcreteColleague2 colleague2 = new ConcreteColleague2(mediator);

        mediator.setColleague1(colleague1);
        mediator.setColleague2(colleague2);

        colleague1.Send("Bạn khỏe không?");
        colleague2.Send("Tốt, cảm ơn bạn. Còn bạn?");
        colleague1.Send("Mình cũng tốt, cảm ơn.");
    }
}
```

Đầu ra

```
Đồng nghiệp 2 nhận được thông điệp: Bạn khỏe không?
Đồng nghiệp 1 nhận được thông điệp: Tốt, cảm ơn bạn. Còn bạn?
Đồng nghiệp 2 nhận được thông điệp: Mình cũng tốt, cảm ơn.
```

## Pseudocode

Trong ví dụ này, Mediator Pattern giúp giảm thiểu sự phụ thuộc lẫn nhau giữa các lớp giao diện người dùng (Button, Checkbox và Textbox).

Các phần tử được kích hoạt bởi người dùng không giao tiếp trực tiếp với các phần tử khác, mặc dù có vẻ như chúng nên làm như vậy. Thay vào đó, các phần tử chỉ cần thông báo cho trung gian về sự kiện và có thể truyền bất kỳ thông tin ngữ cảnh nào cùng với thông báo.

Trong ví dụ này, trung gian là hộp thoại xác thực. Hộp thoại biết cách các phần tử cụ thể phối hợp và tạo điều kiện cho giao tiếp gián tiếp giữa chúng. Khi nhận được thông báo sự kiện, hộp thoại xác thực xác định phần tử chịu trách nhiệm xử lý sự kiện và chuyển tiếp yêu cầu dựa trên điều đó.

```java
// Giao diện trung gian khai báo một phương thức cho phép các thành phần thông báo sự kiện cho trung gian. Trung gian có thể phản ứng và xử lý các sự kiện này hoặc chuyển tiếp yêu cầu cho một thành phần khác.
interface Mediator is
    method notify(sender: Component, event: string)


// Lớp trung gian cụ thể có thể giải quyết các mối quan hệ chéo giữa các thành phần và chuyển chúng vào trung gian.
class AuthenticationDialog implements Mediator is
    private field title: string
    private field loginOrRegisterChkBx: Checkbox
    private field loginUsername, loginPassword: Textbox
    private field registrationUsername, registrationPassword,
                  registrationEmail: Textbox
    private field okBtn, cancelBtn: Button

    constructor AuthenticationDialog() is
        // Tạo tất cả các đối tượng thành phần và chuyển trung gian hiện tại vào hàm tạo của chúng để thiết lập kết nối.

    // Khi có sự kiện xảy ra trong thành phần, nó sẽ thông báo cho trung gian. Trung gian có thể tự xử lý các sự kiện này hoặc chuyển tiếp yêu cầu cho một thành phần khác.
    method notify(sender, event) is
        if (sender == loginOrRegisterChkBx and event == "check")
            if (loginOrRegisterChkBx.checked)
                title = "Đăng nhập"
                // 1. Hiển thị thành phần biểu mẫu đăng nhập.
                // 2. Ẩn thành phần biểu mẫu đăng ký.
            else
                title = "Đăng ký"
                // 1. Hiển thị thành phần biểu mẫu đăng ký.
                // 2. Ẩn thành phần biểu mẫu đăng nhập.

        if (sender == okBtn && event == "click")
            if (loginOrRegister.checked)
                // Thử tìm người dùng sử dụng thông tin đăng nhập.
                if (!found)
                    // Hiển thị thông báo lỗi trên trường đăng nhập.

            else
                // 1. Tạo tài khoản người dùng với dữ liệu từ trường đăng ký.
                // 2. Hoàn thành công việc đăng nhập người dùng. ...


// Các thành phần sẽ giao tiếp với trung gian thông qua giao diện trung gian. Vì vậy, chỉ cần kết nối chúng với các trung gian khác nhau, bạn có thể sử dụng chúng trong các ngữ cảnh khác nhau.
class Component is
    field dialog: Mediator

    constructor Component(dialog) is
        this.dialog = dialog

    method click() is
        dialog.notify(this, "click")

    method keypress() is
        dialog.notify(this, "keypress")

// Các thành phần cụ thể không thể giao tiếp trực tiếp với nhau. Chúng chỉ có một kênh giao tiếp, đó là thông báo cho trung gian.
class Button extends Component is
    // ...

class Textbox extends Component is
    // ...

class Checkbox extends Component is
    method check() is
        dialog.notify(this, "check")
    // ...
```

## Mối quan hệ với các mẫu khác

- [[Chain of Responsibility Pattern]], [[Command Pattern]], [[Mediator Pattern]] và [[Observer Pattern]] được sử dụng để xử lý các kết nối khác nhau giữa người gửi yêu cầu và người nhận:
  - *[[Chain of Responsibility Pattern]]* chuyển động động cơ yêu cầu cho một loạt các người nhận tiềm năng cho đến khi một trong số chúng xử lý yêu cầu.
  - [[Command Pattern]] thiết lập một kết nối một chiều giữa người gửi và người nhận yêu cầu.
  - [[Mediator Pattern]] loại bỏ kết nối trực tiếp giữa người gửi và người nhận, buộc chúng phải giao tiếp gián tiếp thông qua một đối tượng trung gian.
  - [[Observer Pattern]] cho phép người nhận đăng ký hoặc hủy đăng ký động để nhận yêu cầu.
- [[Facade Pattern]] và [[Mediator Pattern]] có trách nhiệm tương tự nhau: cả hai đều cố gắng tổ chức sự hợp tác trong một số lượng lớn các lớp chặt chẽ kết nối.
  - *Facade* định nghĩa một giao diện đơn giản cho tất cả các đối tượng trong hệ thống con, nhưng nó không cung cấp bất kỳ chức năng mới nào. Các đối tượng trong hệ thống con không nhận thức về sự tồn tại của fasade và có thể giao tiếp trực tiếp với nhau.
  - *Mediator* tập trung trung tâm hóa hành vi giao tiếp của các thành phần trong hệ thống. Các thành phần khác chỉ biết về đối tượng trung gian và không thể giao tiếp trực tiếp với nhau.
- Việc phân biệt giữa [[Mediator Pattern]] và [[Observer Pattern]] thường khá khó nhớ. Trong hầu hết các trường hợp, bạn có thể sử dụng một trong hai mẫu, và đôi khi bạn có thể sử dụng cả hai cùng một lúc. Hãy xem cách làm điều này.
  - Mục tiêu chính của *Mediator* là loại bỏ sự phụ thuộc chặt chẽ giữa các thành phần của hệ thống. Các thành phần này sẽ phụ thuộc vào cùng một đối tượng trung gian. Mục tiêu của *Observer* là thiết lập các kết nối động giữa các đối tượng, trong đó một số đối tượng có thể phụ thuộc vào các đối tượng khác.
  - Có một cách triển khai phổ biến của mẫu trung gian dựa trên *Observer*. Đối tượng trung gian đóng vai trò nhà xuất bản, trong khi các thành phần khác đóng vai trò là người đăng ký và có thể đăng ký hoặc hủy đăng ký đối tượng trung gian. Khi *Mediator* được triển khai theo cách này, nó có thể trông giống như *Observer* rất nhiều.
  - Khi bạn cảm thấy bối rối, hãy nhớ rằng có thể triển khai *Mediator* theo cách khác. Ví dụ, bạn có thể liên kết tất cả các thành phần với cùng một đối tượng trung gian vĩnh viễn. Cách triển khai này không giống với *Observer*, nhưng nó vẫn là một cách triển khai của mẫu trung gian.
  - Giả sử có một chương trình trong đó tất cả các thành phần trở thành nhà xuất bản và chúng có thể thiết lập kết nối động với nhau. Trong trường hợp này, không có đối tượng trung tâm trung gian, mà chỉ có các nhà xuất bản phân tán.

## Ví dụ

**Ứng dụng:** Mẫu trung gian thường được sử dụng trong mã Java để hỗ trợ giao tiếp giữa các thành phần giao diện người dùng của chương trình. Trong mô hình MVC, bộ điều khiển (controller) được coi là một trung gian.

Dưới đây là một số ví dụ về việc sử dụng mẫu này trong thư viện Java cốt lõi:

- [`java.util.Timer`](http://docs.oracle.com/javase/8/docs/api/java/util/Timer.html) (tất cả các phương thức `schedule­XXX()`)
- [`java.util.concurrent.Executor#execute()`](http://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Executor.html#execute-java.lang.Runnable-)
- [`java.util.concurrent.ExecutorService`](http://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html) (các phương thức `invoke­XXX()` và `submit­()`)
- [`java.util.concurrent.ScheduledExecutorService`](http://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ScheduledExecutorService.html) (tất cả các phương thức `schedule­XXX()`)
- [`java.lang.reflect.Method#invoke()`](http://docs.oracle.com/javase/8/docs/api/java/lang/reflect/Method.html#invoke-java.lang.Object-java.lang.Object...-)
