---
title: Decorator Pattern
tags:
  - design-pattern
categories:
  - design-pattern
date created: 2023-10-06
date modified: 2023-10-06
---

## Mục đích

**Decorator Pattern** là một mấu thiết kế thiết kế cấu trúc, cho phép thêm một số **chức năng bổ sung** vào một đối tượng mà không làm thay đổi cấu trúc của nó. Decorator Pattern linh hoạt hơn việc tạo ra các lớp con mới để mở rộng chức năng.

- Đối tượng trang trí và đối tượng thật có cùng giao diện. Điều này cho phép đối tượng khách hàng tương tác với đối tượng trang trí như với đối tượng thật.
- Đối tượng trang trí chứa một tham chiếu đến đối tượng thật.
- Đối tượng trang trí chấp nhận tất cả các yêu cầu từ khách hàng. Nó chuyển tiếp các yêu cầu này cho đối tượng thật.
- Đối tượng trang trí có thể thêm một số chức năng bổ sung trước hoặc sau khi chuyển tiếp các yêu cầu này. Điều này đảm bảo rằng chúng ta có thể thêm chức năng bổ sung từ bên ngoài mà không cần thay đổi cấu trúc của đối tượng đã cho. Trong thiết kế hướng đối tượng, thường sử dụng kế thừa để mở rộng chức năng của một lớp đã cho.

## Trường hợp sử dụng

- Nếu bạn muốn sử dụng một đối tượng mà không cần chỉnh sửa mã nguồn và muốn thêm chức năng bổ sung cho đối tượng trong thời gian chạy, bạn có thể sử dụng Decorator Pattern.
- Nếu việc mở rộng chức năng của một đối tượng bằng cách kế thừa là khó thực hiện hoặc không khả thi, bạn có thể sử dụng mấu thiết kế này.

## Cấu trúc

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20210430172133.png)

### Mô tả cấu trúc

1. **Component** (Thành phần): Khai báo giao diện chung cho các lớp trang trí và đối tượng được trang trí.
2. **Concrete Component** (Thành phần cụ thể): Là lớp của đối tượng được trang trí. Nó xác định hành vi cơ bản, nhưng các lớp trang trí có thể thay đổi hành vi này.
3. **Base Decorator** (Trang trí cơ bản): Lớp này có một biến tham chiếu đến đối tượng được trang trí. Kiểu của biến này nên được khai báo là giao diện thành phần chung, để nó có thể tham chiếu đến thành phần cụ thể và các trang trí. Lớp trang trí cơ bản sẽ chuyển tiếp tất cả các hoạt động cho đối tượng được trang trí.
4. **Concrete Decorators** (Trang trí cụ thể): Xác định các chức năng bổ sung có thể được thêm vào thành phần. Các lớp trang trí cụ thể sẽ ghi đè các phương thức của lớp trang trí cơ bản và thực hiện các hành vi bổ sung trước hoặc sau khi gọi phương thức của lớp cha.
5. **Client** (Khách hàng): Có thể sử dụng nhiều lớp trang trí để trang trí thành phần, miễn là nó có thể tương tác với tất cả các đối tượng thông qua giao diện chung.

### Mẫu mã cấu trúc

**Component**: Định nghĩa một giao diện cho đối tượng, cho phép thêm chức năng bổ sung.

```java
interface Component {
    public void operation();
}
```

**ConcreteComponent**: Thực hiện giao diện đã được định nghĩa bởi **Component**.

```java
class ConcreteComponent implements Component {
    @Override
    public void operation() {
        System.out.println("Hành vi ban đầu");
    }
}
```

**Decorator**: Lớp trang trí trừu tượng, kế thừa từ **Component**, mở rộng chức năng của lớp **Component** bằng cách bên ngoài, nhưng đối với **Component**, không cần biết về sự tồn tại của **Decorator**.

```java
class Decorator implements Component {
    // Giữ một tham chiếu đến đối tượng được trang trí, tạo quan hệ tổng hợp với Component
    protected Component component;

    // Truyền vào đối tượng để trang trí
    public Decorator(Component component) {
        this.component = component;
    }

    @Override
    // Gọi phương thức gốc của đối tượng được trang trí
    public void operation() {
        component.operation();
    }
}
```

**ConcreteDecorator**: Đối tượng trang trí cụ thể, thêm chức năng bổ sung cho **Component**.

```java
class ConcreteDecoratorA extends Decorator {
    private String addedState = "Thuộc tính mới 1";

    public ConcreteDecoratorA(Component component) {
        super(component);
    }

    public void operation() {
        super.operation();
        System.out.println("Thêm thuộc tính: " + addedState);
    }
}

class ConcreteDecoratorB extends Decorator {
    public ConcreteDecoratorB(Component component) {
        super(component);
    }

    public void operation() {
        super.operation();
        AddedBehavior();
    }

    public void AddedBehavior() {
        System.out.println("Thêm hành vi");
    }
}
```

**Client**: Có thể sử dụng nhiều lớp trang trí để trang trí thành phần, miễn là nó có thể tương tác với tất cả các đối tượng thông qua giao diện chung.

```java
public class DecoratorPattern {
    public static void main(String[] args) {
        Component component = new ConcreteComponent();
        component.operation();

        System.out.println("======================================");
        Decorator decoratorA = new ConcreteDecoratorA(component);
        decoratorA.operation();

        System.out.println("======================================");
        Decorator decoratorB = new ConcreteDecoratorB(decoratorA);
        decoratorB.operation();
    }
}
```

**Kết quả**:

```
Hành vi ban đầu
======================================
Hành vi ban đầu
Thêm thuộc tính: Thuộc tính mới 1
======================================
Hành vi ban đầu
Thêm thuộc tính: Thuộc tính mới 1
Thêm hành vi
```

## Pseudocode

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210430172723.png)

Trong ví dụ này, mô hình trang trí được sử dụng để nén và mã hóa dữ liệu nhạy cảm, đồng thời tách dữ liệu khỏi mã nguồn sử dụng dữ liệu.

Chương trình sử dụng một cặp trang trí để đóng gói đối tượng nguồn dữ liệu. Hai trang trí này thay đổi cách đọc và ghi dữ liệu từ đĩa:

- Trước khi dữ liệu được **ghi vào đĩa**, trang trí mã hóa và nén dữ liệu. Mà không làm thay đổi lớp gốc, dữ liệu đã được mã hóa và bảo vệ được ghi vào tệp.
- Sau khi dữ liệu được **đọc từ đĩa**, trang trí giải nén và giải mã dữ liệu. Trang trí và lớp nguồn dữ liệu cùng tuân thủ một giao diện chung, cho phép thay thế chúng trong mã khách hàng.

```java
// Trang trí có thể thay đổi các hoạt động được định nghĩa bởi giao diện thành phần.
interface DataSource is
    method writeData(data)
    method readData():data

// Lớp thành phần cung cấp triển khai mặc định cho các hoạt động. Có thể có nhiều biến thể của lớp này trong chương trình.
class FileDataSource implements DataSource is
    constructor FileDataSource(filename) { ... }

    method writeData(data) is
        // Ghi dữ liệu vào tệp.

    method readData():data is
        // Đọc dữ liệu từ tệp.

// Lớp trang trí cơ bản và các thành phần khác tuân thủ cùng một giao diện. Nhiệm vụ chính của lớp này là định nghĩa giao diện đóng gói cho tất cả các trang trí cụ thể. Mã mặc định trong triển khai gói có thể bao gồm một biến thành viên để lưu trữ thành phần được đóng gói và khởi tạo nó.
class DataSourceDecorator implements DataSource is
    protected field wrappee: DataSource

    constructor DataSourceDecorator(source: DataSource) is
        wrappee = source

    // Lớp trang trí cơ bản chuyển tiếp tất cả công việc cho thành phần được đóng gói. Các trang trí cụ thể có thể thêm các hành vi bổ sung.
    method writeData(data) is
        wrappee.writeData(data)

    // Trang trí cụ thể có thể gọi phương thức của lớp cha để thực hiện, thay vì gọi trực tiếp đối tượng được đóng gói. Điều này giúp đơn giản hóa việc mở rộng lớp trang trí.
    method readData():data is
        return wrappee.readData()

// Trang trí cụ thể phải gọi phương thức trên đối tượng được đóng gói và có thể thêm nội dung vào kết quả.
// Trang trí phải thực hiện hành vi bổ sung trước hoặc sau khi gọi phương thức trên đối tượng được đóng gói.
class EncryptionDecorator extends DataSourceDecorator is
    method writeData(data) is
        // 1. Mã hóa dữ liệu được truyền.
        // 2. Chuyển dữ liệu đã mã hóa cho phương thức writeData (ghi dữ liệu) của đối tượng được đóng gói.

    method readData():data is
        // 1. Lấy dữ liệu từ phương thức readData (đọc dữ liệu) của đối tượng được đóng gói.
        // 2. Giải mã dữ liệu nếu nó đã được mã hóa.
        // 3. Trả về kết quả.

// Bạn có thể đóng gói đối tượng trong nhiều lớp trang trí.
class CompressionDecorator extends DataSourceDecorator is
    method writeData(data) is
        // 1. Nén dữ liệu được truyền.
        // 2. Chuyển dữ liệu đã nén cho phương thức writeData (ghi dữ liệu) của đối tượng được đóng gói.

    method readData():data is
        // 1. Lấy dữ liệu từ phương thức readData (đọc dữ liệu) của đối tượng được đóng gói.
        // 2. Giải nén dữ liệu nếu nó đã được nén.
        // 3. Trả về kết quả.


// Tùy chọn 1: Ví dụ đơn giản về đóng gói thành phần
class Application is
    method dumbUsageExample() is
        source = new FileDataSource("somefile.dat")
        source.writeData(salaryRecords)
        // Dữ liệu rõ được ghi vào tệp mục tiêu.

        source = new CompressionDecorator(source)
        source.writeData(salaryRecords)
        // Dữ liệu nén được ghi vào tệp mục tiêu.

        source = new EncryptionDecorator(source)
        // Biến nguồn bây giờ chứa:
        // Encryption > Compression > FileDataSource
        source.writeData(salaryRecords)
        // Dữ liệu đã nén và được mã hóa được ghi vào tệp mục tiêu.


// Tùy chọn 2: Khách hàng sử dụng nguồn dữ liệu bên ngoài. Đối tượng SalaryManager không quan tâm về cách lưu trữ dữ liệu. Chúng sẽ tương tác với nguồn dữ liệu được cấu hình trước, nguồn dữ liệu được lấy từ cấu hình chương trình.
class SalaryManager is
    field source: DataSource

    constructor SalaryManager(source: DataSource) { ... }

    method load() is
        return source.readData()

    method save() is
        source.writeData(salaryRecords)
    // ...các phương thức hữu ích khác...


// Chương trình có thể tổ hợp các trang trí khác nhau tại thời điểm chạy, dựa trên cấu hình hoặc môi trường.
class ApplicationConfigurator is
    method configurationExample() is
        source = new FileDataSource("salary.dat")
        if (enabledEncryption)
            source = new EncryptionDecorator(source)
        if (enabledCompression)
            source = new CompressionDecorator(source)

        logger = new SalaryManager(source)
        salary = logger.load()
    // ...
```

## Ví dụ

**Ví dụ sử dụng**: Mô hình trang trí là một cấu hình tiêu chuẩn trong mã Java, đặc biệt là trong mã liên quan đến tải dữ liệu theo luồng.

Có một số ví dụ về trang trí trong thư viện lõi của Java:

- [`java.io.InputStream`](http://docs.oracle.com/javase/8/docs/api/java/io/InputStream.html), [`Output­Stream`](http://docs.oracle.com/javase/8/docs/api/java/io/OutputStream.html), [`Reader`](http://docs.oracle.com/javase/8/docs/api/java/io/Reader.html), và [`Writer`](http://docs.oracle.com/javase/8/docs/api/java/io/Writer.html) có các hàm tạo nhận đối tượng của chính kiểu của nó làm tham số.
- [`java.util.Collections`](http://docs.oracle.com/javase/8/docs/api/java/util/Collections.html); các phương thức [`checked­XXX()`](http://docs.oracle.com/javase/8/docs/api/java/util/Collections.html#checkedCollection-java.util.Collection-java.lang.Class-), [`synchronized­XXX()`](http://docs.oracle.com/javase/8/docs/api/java/util/Collections.html#synchronizedCollection-java.util.Collection-), và [`unmodifiable­XXX()`](http://docs.oracle.com/javase/8/docs/api/java/util/Collections.html#unmodifiableCollection-java.util.Collection-) .
- [`javax.servlet.http.HttpServletRequestWrapper`](http://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpServletRequestWrapper.html) và [`Http­Servlet­Response­Wrapper`](http://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpServletResponseWrapper.html)

**Cách nhận biết**: Trang trí có thể được nhận biết bằng cách tạo phương thức hoặc hàm tạo có tham số là chính lớp hoặc đối tượng hiện tại.

## Mối quan hệ với các mẫu khác

- [[Adapter Pattern]] có thể thay đổi giao diện của đối tượng hiện có, trong khi [[Decorator Pattern]] có thể cung cấp chức năng mở rộng cho đối tượng mà không thay đổi giao diện của nó. Hơn nữa, *Decorator* hỗ trợ sự kết hợp đệ quy, trong khi *Adapter* không thể thực hiện điều này.
- *Adapter* có thể cung cấp giao diện khác cho đối tượng được đóng gói, trong khi *Proxy* có thể cung cấp cùng một giao diện cho đối tượng. *Decorator* có thể cung cấp giao diện tăng cường cho đối tượng.
- [[Chain of Responsibility Pattern]] và [[Decorator Pattern]] có cấu trúc lớp rất tương tự. Cả hai đều sử dụng kết hợp đệ quy để chuyển tiếp các hoạt động cần thực hiện cho một loạt các đối tượng. Tuy nhiên, có một số điểm khác biệt quan trọng giữa hai mô hình này.
  - *Chain of Responsibility* cho phép các quản lý viên thực hiện công việc mà không phụ thuộc vào nhau và có thể dừng việc chuyển tiếp yêu cầu bất kỳ lúc nào. Trong khi đó, các *Decorator* cụ thể có thể thêm hành vi bổ sung trước hoặc sau khi gọi phương thức trên đối tượng được đóng gói. *Decorator* không thể ngăn chặn việc chuyển tiếp yêu cầu.
- [[Composite Pattern]] và [[Decorator Pattern]] có cấu trúc lớp rất giống nhau, vì cả hai đều dựa trên nguyên tắc kết hợp đệ quy để tổ chức một số lượng vô hạn các đối tượng.
  - *Decorator* tương tự như *Composite*, nhưng chỉ có một thành phần con. Ngoài ra, có một sự khác biệt rõ ràng: *Decorator* thêm các trách nhiệm bổ sung cho đối tượng được đóng gói, trong khi *Composite* chỉ tổng hợp kết quả của các nút con.
  - Tuy nhiên, các mô hình cũng có thể cộng tác với nhau: bạn có thể sử dụng *Decorator* để mở rộng hành vi của một đối tượng cụ thể trong cây *Composite*.
- Thiết kế sử dụng nhiều [[Composite Pattern]] và [[Decorator Pattern]] thường có lợi từ việc sử dụng [[Prototype Pattern]]. Bạn có thể sao chép cấu trúc phức tạp bằng cách sử dụng mô hình này thay vì xây dựng lại từ đầu.
- [[Decorator Pattern]] cho phép bạn thay đổi diện mạo của một đối tượng, trong khi [[Strategy Pattern]] cho phép bạn thay đổi bản chất của nó.
- [[Decorator Pattern]] và [[Proxy Pattern]] có cấu trúc tương tự nhau, nhưng mục đích của chúng rất khác nhau. Cả hai mô hình đều dựa trên nguyên tắc kết hợp, tức là một đối tượng nên chuyển một phần công việc cho một đối tượng khác. Sự khác biệt giữa hai mô hình là *Proxy* thường tự quản lý vòng đời của đối tượng dịch vụ của mình, trong khi *Decorator* luôn được kiểm soát bởi mã khách hàng.
