---
title: Chain of Responsibility Pattern
tags:
  - design-pattern
categories:
  - design-pattern
date created: 2023-10-06
date modified: 2023-10-06
---

## Ý tưởng

**Chain of Responsibility Pattern** là một mẫu thiết kế hành vi, cho phép bạn chuyển tiếp yêu cầu qua một chuỗi các đối tượng xử lý. Sau khi nhận được yêu cầu, mỗi đối tượng xử lý có thể xử lý yêu cầu hoặc chuyển tiếp nó cho đối tượng xử lý tiếp theo trong chuỗi.

Mục đích của mẫu này là cho phép nhiều đối tượng có cơ hội xử lý yêu cầu, từ đó tránh sự ràng buộc giữa người gửi yêu cầu và người nhận yêu cầu.  
Chuỗi các đối tượng này được kết nối với nhau và yêu cầu được chuyển tiếp theo chuỗi này cho đến khi có một đối tượng xử lý nó.

## Ứng dụng

- Khi chương trình cần xử lý các loại yêu cầu khác nhau theo cách khác nhau và loại yêu cầu và thứ tự không được biết trước, bạn có thể sử dụng Chain of Responsibility Pattern.
- Khi cần thực hiện tuần tự nhiều đối tượng xử lý, bạn có thể sử dụng mẫu này.
- Nếu các đối tượng xử lý cần được thay đổi và thứ tự của chúng cần được thay đổi trong quá trình chạy, bạn có thể sử dụng Chain of Responsibility Pattern.

## Cấu trúc

### Miêu tả cấu trúc

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210520172147.png)

1. **Trình xử lý** (Handler) khai báo giao diện chung cho tất cả các Trình xử lý cụ thể. Giao diện này thường chỉ chứa một phương thức để xử lý yêu cầu, nhưng đôi khi nó cũng có thể chứa một phương thức để thiết lập Trình xử lý tiếp theo trong chuỗi.
2. **Trình xử lý cơ bản** (Base Handler) là một lớp tùy chọn, bạn có thể đặt mã mẫu chung cho tất cả các Trình xử lý trong đó.  
	Thường thì lớp này định nghĩa một biến thành viên để lưu trữ tham chiếu đến Trình xử lý tiếp theo trong chuỗi. Khách hàng có thể tạo chuỗi bằng cách chuyển Trình xử lý cho Trình xử lý trước đó thông qua hàm tạo hoặc phương thức thiết lập. Lớp này cũng có thể triển khai hành vi xử lý mặc định: xác định xem Trình xử lý tiếp theo có tồn tại hay không trước khi chuyển tiếp yêu cầu cho nó.

3. **Trình xử lý cụ thể** (Concrete Handlers) chứa mã thực tế để xử lý yêu cầu. Sau khi nhận được yêu cầu, mỗi Trình xử lý phải quyết định xem có xử lý yêu cầu hay không và có chuyển tiếp nó qua chuỗi hay không.

   Trình xử lý thường là độc lập và không thay đổi, và cần nhận tất cả dữ liệu cần thiết thông qua hàm tạo một lần.

4. **Khách hàng** (Client) có thể tạo chuỗi một lần hoặc động dựa trên logic của chương trình. Đáng chú ý là yêu cầu có thể được gửi đến bất kỳ Trình xử lý nào trong chuỗi, không nhất thiết phải là Trình xử lý đầu tiên.

### Mẫu code cấu trúc

**Handler**: Định nghĩa một giao diện xử lý yêu cầu. (Tùy chọn) Cung cấp phương thức để thiết lập người kế nhiệm.

```java
abstract class Handler {
    protected Handler successor;
    public void SetSuccesssor(Handler successor) {
        this.successor = successor;
    }

    public abstract void HandlerRequest(int request);
}
```

**ConcreteHandler**: Xử lý yêu cầu mà nó chịu trách nhiệm, có thể truy cập người kế nhiệm của nó. Nếu có thể xử lý yêu cầu, thì xử lý nó, nếu không, chuyển tiếp yêu cầu cho người kế nhiệm của nó.

```java
class ConcreteHandler1 extends Handler {
    @Override
    public void HandlerRequest(int request) {
        if (request >= 0 && request < 10) {
            System.out.println("ConcreteHandler1 xử lý yêu cầu " + request);
        } else if (null != successor) {
            successor.HandlerRequest(request);
        }
    }
}

class ConcreteHandler2 extends Handler {
    @Override
    public void HandlerRequest(int request) {
        if (request >= 10 && request < 20) {
            System.out.println("ConcreteHandler2 xử lý yêu cầu " + request);
        } else if (null != successor) {
            successor.HandlerRequest(request);
        }
    }
}

class ConcreteHandler3 extends Handler {
    @Override
    public void HandlerRequest(int request) {
        if (request >= 20 && request < 30) {
            System.out.println("ConcreteHandler3 xử lý yêu cầu " + request);
        } else if (null != successor) {
            successor.HandlerRequest(request);
        }
    }
}
```

**Client**: Cần thiết lập một chuỗi các đối tượng xử lý yêu cầu.

```java
public class ChainOfResponsibilityPattern {
    public static void main(String[] args) {
        Handler h1 = new ConcreteHandler1();
        Handler h2 = new ConcreteHandler2();
        Handler h3 = new ConcreteHandler3();
        h1.SetSuccesssor(h2);
        h2.SetSuccesssor(h3);

        int[] requests = {2, 29, 9, 15, 4, 19};
        for (int i : requests) {
            h1.HandlerRequest(i);
        }
    }
}
```

### Mã giả

Trong ví dụ này, mẫu **Chain of Responsibility** được sử dụng để hiển thị thông tin trợ giúp ngữ cảnh cho các phần tử GUI trong ứng dụng.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20231006204925.png)

Giao diện người dùng của ứng dụng thường là một cấu trúc cây đối tượng. Ví dụ: Lớp `Dialog` chịu trách nhiệm vẽ cửa sổ chính của chương trình là nút gốc của cây đối tượng. Dialog chứa các `Panel`, và mỗi Panel có thể chứa các Panel khác hoặc các phần tử con như `Button` và `TextField`.

Khi một phần tử đơn giản có văn bản trợ giúp được chỉ định, nó có thể hiển thị một gợi ý ngắn về ngữ cảnh. Nhưng các phần tử phức tạp hơn có thể tùy chỉnh cách hiển thị văn bản trợ giúp ngữ cảnh, ví dụ như hiển thị nội dung trích dẫn từ tài liệu hoặc mở một trang web trong trình duyệt.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20231006204906.png)

Khi người dùng di chuyển con trỏ chuột vào một phần tử và nhấn phím `F1`, chương trình phát hiện phần tử dưới con trỏ và gửi yêu cầu trợ giúp cho nó. Yêu cầu này được chuyển tiếp lên tới tất cả các container của phần tử cho đến khi một phần tử có thể hiển thị thông tin trợ giúp.

```java
// Giao diện xử lý khai báo phương thức tạo chuỗi xử lý. Nó cũng khai báo phương thức thực thi yêu cầu.
interface ComponentWithContextualHelp is
    method showHelp()


// Lớp cơ sở cho các phần tử đơn giản.
abstract class Component implements ComponentWithContextualHelp is
    field tooltipText: string

    // Container của phần tử được sử dụng như một liên kết "tiếp theo" trong chuỗi xử lý.
    protected field container: Container

    // Nếu phần tử có văn bản trợ giúp, nó sẽ hiển thị gợi ý.
    // Nếu phần tử không có văn bản trợ giúp và container tồn tại, nó sẽ chuyển cuộc gọi cho container.
    method showHelp() is
        if (tooltipText != null)
            // Hiển thị gợi ý.
        else
            container.showHelp()


// Container có thể chứa các phần tử đơn giản và các container khác như con của nó. Mối quan hệ chuỗi được thiết lập ở đây. Lớp này kế thừa hành vi showHelp (hiển thị trợ giúp) từ lớp cha của nó.
abstract class Container extends Component is
    protected field children: array of Component

    method add(child) is
        children.add(child)
        child.container = this


// Các phần tử gốc có thể sử dụng triển khai mặc định của hoạt động trợ giúp...
class Button extends Component is
    // ...

// Nhưng các phần tử phức tạp có thể ghi đè triển khai mặc định. Nếu không thể cung cấp văn bản trợ giúp theo cách mới, phần tử vẫn có thể gọi triển khai cơ bản (xem lớp Component).
class Panel extends Container is
    field modalHelpText: string

    method showHelp() is
        if (modalHelpText != null)
            // Hiển thị cửa sổ modal chứa văn bản trợ giúp.
        else
            super.showHelp()

// ...Tương tự như trên...
class Dialog extends Container is
    field wikiPageURL: string

    method showHelp() is
        if (wikiPageURL != null)
            // Mở trang trợ giúp từ wiki.
        else
            super.showHelp()


// Mã khách hàng.
class Application is
    // Mỗi ứng dụng có thể cấu hình chuỗi xử lý theo cách khác nhau.
    method createUI() is
        dialog = new Dialog("Báo cáo ngân sách")
        dialog.wikiPageURL = "http://..."
        panel = new Panel(0, 0, 400, 800)
        panel.modalHelpText = "Panel này được sử dụng để..."
        ok = new Button(250, 760, 50, 20, "Xác nhận")
        ok.tooltipText = "Đây là nút xác nhận..."
        cancel = new Button(320, 760, 50, 20, "Hủy bỏ")
        // ...
        panel.add(ok)
        panel.add(cancel)
        dialog.add(panel)

    // Giả sử có một số hành động ở đây.
    method onF1KeyPress() is
        component = this.getComponentAtMouseCoords()
        component.showHelp()
```

## Mối quan hệ với các mẫu khác

- [[Chain of Responsibility Pattern]], [[Command Pattern]], [[Mediator Pattern]], và [[Observer Pattern]] được sử dụng để xử lý các kết nối khác nhau giữa người gửi yêu cầu và người nhận:
  - [[Chain of Responsibility]] chuyển tiếp yêu cầu đến một chuỗi các người nhận tiềm năng theo thứ tự cho đến khi một người nhận xử lý yêu cầu.
  - [[Command Pattern]] thiết lập một kết nối một chiều giữa người gửi và người nhận yêu cầu.
  - [[Mediator Pattern]] loại bỏ kết nối trực tiếp giữa người gửi và người nhận, buộc họ giao tiếp thông qua một đối tượng trung gian.
  - [[Observer Pattern]] cho phép người nhận đăng ký hoặc hủy đăng ký động để nhận yêu cầu.
- [[Chain of Responsibility Pattern]] thường được kết hợp với [[Composite Pattern]]. Trong trường hợp này, các thành phần lá nhận yêu cầu và chuyển tiếp yêu cầu qua chuỗi các thành phần cha chứa chúng.
- [[Chain of Responsibility Pattern]] có thể được triển khai bằng [[Command Pattern]]. Trong trường hợp này, bạn có thể thực hiện nhiều hoạt động khác nhau trên cùng một đối tượng ngữ cảnh được đại diện bởi yêu cầu.

  Một cách triển khai khác là yêu cầu chính nó là một đối tượng [[Command Pattern]]. Trong trường hợp này, bạn có thể thực hiện cùng một hoạt động trên một chuỗi các kết nối ngữ cảnh khác nhau.

- [[Chain of Responsibility Pattern]] và [[Decorator Pattern]] có cấu trúc lớp rất tương tự nhau. Cả hai đều sử dụng kết hợp đệ quy để chuyển tiếp hoạt động cần thực hiện cho một chuỗi đối tượng. Tuy nhiên, có một số điểm khác biệt quan trọng giữa hai mẫu.

  [[Chain of Responsibility Pattern]] cho phép các người nhận thực hiện các hoạt động độc lập và có thể dừng việc chuyển tiếp yêu cầu bất kỳ lúc nào. Trong khi đó, [[Decorator Pattern]] cho phép mở rộng hành vi của đối tượng bằng cách tuân theo giao diện cơ bản. Hơn nữa, [[Decorator Pattern]] không thể ngăn chặn việc chuyển tiếp yêu cầu.

## Ví dụ

**Sử dụng ví dụ:** Chain of Responsibility Pattern không phổ biến trong các ứng dụng Java vì nó chỉ hoạt động khi có một liên kết đối tượng trong chuỗi.

Một trong những ví dụ phổ biến sử dụng mẫu này là khi chuyển tiếp sự kiện từ các thành phần GUI đến các thành phần cha. Một ví dụ khác là khi duyệt qua các bộ lọc theo thứ tự.

Dưới đây là một số ví dụ về việc sử dụng mẫu này trong thư viện Java cốt lõi:

- [`javax.servlet.Filter#doFilter()`](http://docs.oracle.com/javaee/7/api/javax/servlet/Filter.html#doFilter-javax.servlet.ServletRequest-javax.servlet.ServletResponse-javax.servlet.FilterChain-)
- [`java.util.logging.Logger#log()`](http://docs.oracle.com/javase/8/docs/api/java/util/logging/Logger.html#log-java.util.logging.Level-java.lang.String-)

**Cách nhận biết:** Mẫu này có thể được nhận biết bằng cách các phương thức hành vi của một nhóm đối tượng gọi trực tiếp các phương thức tương tự của các đối tượng khác và tất cả các đối tượng tuân theo cùng một giao diện.
