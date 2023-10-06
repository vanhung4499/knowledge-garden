---
title: Strategy Pattern
tags:
  - design-pattern
categories:
  - design-pattern
date created: 2023-10-06
date modified: 2023-10-06
---

## Ý nghĩa

**Strategy Pattern** là một mẫu thiết kế hành vi, cho phép bạn xác định một loạt các thuật toán và đặt mỗi thuật toán vào một lớp riêng biệt. Điều này cho phép các thuật toán có thể được thay đổi linh hoạt trong quá trình chạy.

## Các trường hợp sử dụng

- Khi bạn muốn sử dụng các biến thể thuật toán khác nhau trong một đối tượng và muốn có khả năng thay đổi thuật toán trong quá trình chạy, bạn có thể sử dụng Strategy Pattern.
- Khi bạn có nhiều lớp tương tự nhau chỉ khác nhau một chút trong hành vi, bạn có thể sử dụng Strategy Pattern.
- Nếu thuật toán không quan trọng trong logic của ngữ cảnh, việc sử dụng mẫu này có thể tách biệt logic của lớp khỏi chi tiết thực hiện thuật toán.

## Cấu trúc

### Mô tả cấu trúc

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210520173840.png)

1. **Ngữ cảnh** (Context) duy trì một tham chiếu đến chiến lược cụ thể và chỉ giao tiếp với đối tượng thông qua giao diện chiến lược.
2. **Chiến lược** (Strategy) là giao diện chung cho tất cả các chiến lược cụ thể, nó khai báo một phương thức để thực hiện chiến lược trong ngữ cảnh.
3. **Chiến lược cụ thể** (Concrete Strategies) triển khai các biến thể khác nhau của thuật toán được sử dụng bởi ngữ cảnh.
4. Khi ngữ cảnh cần thực thi thuật toán, nó gọi phương thức thực thi trên đối tượng chiến lược đã được kết nối. Ngữ cảnh không biết loại chiến lược và cách thực hiện thuật toán.
5. **Khách hàng** (Client) tạo một đối tượng chiến lược cụ thể và chuyển nó cho ngữ cảnh. Ngữ cảnh cung cấp một phương thức thiết lập để cho phép khách hàng thay thế chiến lược liên quan trong quá trình chạy.

### Mẫu code cấu trúc

**Strategy** : Định nghĩa giao diện chung cho tất cả các thuật toán (AlgorithmInterface). Context sử dụng giao diện này để gọi các thuật toán cụ thể được định nghĩa bởi ConcreteStrategy.

```java
abstract class Strategy {
    public abstract void AlgorithmInterface();
}
```

**ConcreteStrategy** : Thực hiện giao diện thuật toán (AlgorithmInterface) trong Strategy.

```java
class ConcreteStrategyA extends Strategy {
    @Override
    public void AlgorithmInterface() {
        System.out.println("Thuật toán A");
    }
}

class ConcreteStrategyB extends Strategy {
    @Override
    public void AlgorithmInterface() {
        System.out.println("Thuật toán B");
    }
}

class ConcreteStrategyC extends Strategy {
    @Override
    public void AlgorithmInterface() {
        System.out.println("Thuật toán C");
    }
}
```

**Context** : Sử dụng một ConcreteStrategy để cấu hình. Giữ một tham chiếu đến đối tượng Strategy.

```java
class Context {
    Strategy strategy;
    public Context(Strategy strategy) {
        this.strategy = strategy;
    }

    public void ContextInterface() {
        strategy.AlgorithmInterface();
    }
}
```

Khách hàng

```java
public class StrategyPattern {
    public static void main(String[] args) {
        Context context1 = new Context(new ConcreteStrategyA());
        context1.ContextInterface();

        Context context2 = new Context(new ConcreteStrategyB());
        context2.ContextInterface();

        Context context3 = new Context(new ConcreteStrategyC());
        context3.ContextInterface();
    }
}
```

Kết quả

```
Thuật toán A
Thuật toán B
Thuật toán C
```

## Pseudocode

Trong ví dụ này, ngữ cảnh sử dụng nhiều **chiến lược** để thực hiện các phép tính khác nhau.

```java
// Giao diện chiến lược khai báo các hoạt động chung của một thuật toán giữa các phiên bản khác nhau. Ngữ cảnh sẽ sử dụng giao diện này để gọi thuật toán được xác định cụ thể bởi Chiến lược cụ thể.
interface Strategy is
    method execute(a, b)

// Chiến lược cụ thể sẽ triển khai thuật toán trong giao diện chiến lược. Giao diện này triển khai tính tương thích giữa chúng trong ngữ cảnh.
class ConcreteStrategyAdd implements Strategy is
    method execute(a, b) is
        return a + b

class ConcreteStrategySubtract implements Strategy is
    method execute(a, b) is
        return a - b

class ConcreteStrategyMultiply implements Strategy is
    method execute(a, b) is
        return a * b

// Ngữ cảnh xác định giao diện mà khách hàng quan tâm.
class Context is
    // Ngữ cảnh sẽ duy trì một tham chiếu đến đối tượng chiến lược. Ngữ cảnh không biết về lớp cụ thể của chiến lược. Ngữ cảnh phải tương tác với tất cả các chiến lược thông qua giao diện chiến lược.
    private strategy: Strategy

    // Ngữ cảnh thường nhận đối tượng chiến lược thông qua hàm tạo và cung cấp một phương thức thiết lập để chuyển đổi chiến lược trong quá trình chạy.
    method setStrategy(Strategy strategy) is
        this.strategy = strategy

    // Ngữ cảnh sẽ ủy quyền một số công việc cho đối tượng chiến lược thay vì tự triển khai các phiên bản thuật toán khác nhau.
    method executeStrategy(int a, int b) is
        return strategy.execute(a, b)


// Mã khách hàng sẽ chọn chiến lược cụ thể và chuyển nó cho ngữ cảnh. Khách hàng phải biết sự khác biệt giữa các chiến lược để có thể chọn đúng.
class ExampleApplication is
    method main() is

        Tạo đối tượng ngữ cảnh.

        Đọc số đầu tiên.
        Đọc số cuối cùng.
        Đọc hành động mong muốn từ đầu vào người dùng.

        if (action == addition) then
            context.setStrategy(new ConcreteStrategyAdd())

        if (action == subtraction) then
            context.setStrategy(new ConcreteStrategySubtract())

        if (action == multiplication) then
            context.setStrategy(new ConcreteStrategyMultiply())

        result = context.executeStrategy(First number, Second number)

        In kết quả.
```

## Ví dụ

**Ví dụ sử dụng:** Mẫu thiết kế Chiến lược rất phổ biến trong mã Java. Nó thường được sử dụng trong các framework khác nhau để cung cấp cho người dùng cách thay đổi hành vi mà không cần mở rộng lớp.

Từ Java 8 trở đi, lambda expression được hỗ trợ, đây là một cách đơn giản để thay thế cho mẫu thiết kế Chiến lược.

Dưới đây là một số ví dụ về mẫu thiết kế Chiến lược trong các thư viện Java cốt lõi:

- Cuộc gọi `java.util.Comparator#compare()` trong `Collections#sort()`.
- [`javax.servlet.http.HttpServlet`](http://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpServlet.html): phương thức `service()` và tất cả các phương thức `doXXX()` nhận đối tượng `Http­Servlet­Request` và `Http­Servlet­Response` làm tham số.
- [`javax.servlet.Filter#doFilter()`](http://docs.oracle.com/javaee/7/api/javax/servlet/Filter.html#doFilter-javax.servlet.ServletRequest-javax.servlet.ServletResponse-javax.servlet.FilterChain-)

**Cách nhận biết:** Mẫu thiết kế Chiến lược có thể được nhận biết thông qua cách nó cho phép một đối tượng lồng nhau thực hiện công việc thực tế và thông qua việc cung cấp một trình thiết lập cho phép thay thế đối tượng đó bằng đối tượng khác.

## Mối quan hệ với các mẫu khác

- [[Bridge Pattern]], [[State Pattern]] và [[Strategy Pattern]] (bao gồm [[Adapter Pattern]] ở một mức độ) có giao diện rất tương tự. Trên thực tế, chúng đều dựa trên [[Composite Pattern]] - tức là giao việc cho các đối tượng khác nhau, nhưng mỗi mẫu giải quyết một vấn đề khác nhau. Mẫu không chỉ là công thức để tổ chức mã theo cách cụ thể, mà còn là cách để bạn trò chuyện với các nhà phát triển khác về vấn đề mà mẫu giải quyết.
- [[Command Pattern]] và [[Strategy Pattern]] trông giống nhau vì cả hai đều cho phép tham số hóa hành động thành đối tượng. Tuy nhiên, mục đích của chúng rất khác nhau.
  - Bạn có thể sử dụng *Command* để chuyển đổi bất kỳ hoạt động nào thành một đối tượng. Tham số của hoạt động sẽ trở thành thuộc tính của đối tượng. Bạn có thể trì hoãn việc thực thi hoạt động, đưa hoạt động vào hàng đợi, lưu trữ lịch sử lệnh hoặc gửi lệnh đến dịch vụ từ xa.
  - Mặt khác, *Strategy* thường được sử dụng để mô tả các cách khác nhau để thực hiện một công việc, cho phép bạn chuyển đổi thuật toán trong cùng một ngữ cảnh lớp.
- [[Decorator Pattern]] cho phép bạn thay đổi diện mạo của một đối tượng, trong khi [[Strategy Pattern]] cho phép bạn thay đổi bản chất của nó.
- [[Template Method Pattern]] dựa trên kế thừa: nó cho phép bạn thay đổi một phần của thuật toán bằng cách mở rộng trong các lớp con. [[Strategy Pattern]] dựa trên sự kết hợp: bạn có thể thay đổi một phần hành vi bằng cách cung cấp các chiến lược khác nhau cho cùng một ngữ cảnh đối tượng. *Template Method* hoạt động trên cấp lớp, vì vậy nó là tĩnh. *Strategy* hoạt động trên cấp đối tượng, cho phép thay đổi hành vi trong thời gian chạy.
- [[State Pattern]] có thể được coi là một mở rộng của [[Strategy Pattern]]]. Cả hai đều dựa trên cơ chế kết hợp: chúng đều thay đổi hành vi của đối tượng trong các tình huống khác nhau bằng cách ủy quyền một phần công việc cho đối tượng "trợ giúp". *Strategy* làm cho các đối tượng này hoàn toàn độc lập với nhau, chúng không biết về sự tồn tại của các đối tượng khác. Tuy nhiên, [[State Pattern]] không giới hạn sự phụ thuộc giữa các trạng thái cụ thể và cho phép chúng tự thay đổi trạng thái trong các tình huống khác nhau.
