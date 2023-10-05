---
title: Abstract Factory Pattern
tags:
  - design-pattern
categories:
  - design-pattern
date created: 2023-10-05
date modified: 2023-10-05
---

## Ý tưởng

**Abstract Factory Pattern** là một mẫu thiết kế tạo đối tượng, cho phép tạo ra một loạt các đối tượng liên quan mà không cần chỉ định lớp cụ thể của chúng.

## Ưu điểm

- Abstract Factory Pattern **cô lập việc tạo ra các lớp cụ thể**, người dùng không cần biết điều gì đang được tạo ra. Do sự cô lập này, việc thay đổi một nhà máy cụ thể trở nên tương đối dễ dàng. Tất cả các nhà máy cụ thể đều triển khai các giao diện công cộng được định nghĩa trong nhà máy trừu tượng, do đó chỉ cần thay đổi thể hiện của nhà máy cụ thể, bạn có thể thay đổi hành vi của toàn bộ hệ thống phần mềm một cách tương đối. Ngoài ra, việc áp dụng Abstract Factory Pattern có thể đạt được mục tiêu thiết kế có độ kết hợp cao và độ phụ thuộc thấp, do đó Abstract Factory Pattern được áp dụng rộng rãi.
- Khi nhiều đối tượng trong một họ sản phẩm được thiết kế để làm việc cùng nhau, Abstract Factory Pattern **đảm bảo rằng khách hàng luôn sử dụng các đối tượng trong cùng một họ sản phẩm**. Điều này rất hữu ích đối với một số hệ thống phần mềm cần quyết định hành vi của mình dựa trên môi trường hiện tại.
- **Thêm các nhà máy cụ thể và họ sản phẩm mới rất dễ dàng, không cần sửa đổi hệ thống hiện có**, tuân thủ nguyên tắc "Open-Closed".

## Nhược điểm

- Khi thêm đối tượng mới, việc mở rộng Abstract Factory để tạo ra loại sản phẩm mới trở nên khó khăn, điều này bởi vì Abstract Factory đã định nghĩa tập hợp tất cả các sản phẩm có thể được tạo ra. Để hỗ trợ loại sản phẩm mới, bạn cần mở rộng giao diện Abstract Factory, điều này sẽ liên quan đến việc sửa đổi Abstract Factory và tất cả các lớp con của nó, điều này có thể gây rất nhiều bất tiện.

## Các trường hợp sử dụng

Abstract Factory Pattern được sử dụng trong các trường hợp sau:

- Khi một hệ thống cần độc lập với việc tạo, kết hợp và biểu diễn các sản phẩm của nó.
- Khi một hệ thống cần được cấu hình bằng một trong nhiều loạt sản phẩm.
- Khi bạn muốn nhấn mạnh thiết kế của một loạt các đối tượng liên quan để sử dụng chung.
- Khi bạn cung cấp một thư viện lớp sản phẩm và chỉ muốn hiển thị giao diện của chúng mà không cần triển khai.

## Cấu trúc

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20231005225812.png)

### Mô tả cấu trúc

1. **Sản phẩm trừu tượng** (Abstract Product) khai báo một giao diện cho một nhóm các sản phẩm khác nhau nhưng có liên quan.
2. **Sản phẩm cụ thể** (Concrete Product) là các phiên bản cụ thể của sản phẩm trừu tượng. Tất cả các biến thể (Victorian/Modern) phải triển khai sản phẩm trừu tượng tương ứng (ghế/sofa).
3. **Nhà máy trừu tượng** (Abstract Factory) khai báo một tập hợp các phương pháp để tạo ra các sản phẩm trừu tượng khác nhau.
4. **Nhà máy cụ thể** (Concrete Factory) triển khai các phương pháp xây dựng của nhà máy trừu tượng. Mỗi nhà máy cụ thể tương ứng với một biến thể sản phẩm cụ thể và chỉ tạo ra biến thể sản phẩm đó.
5. Mặc dù nhà máy cụ thể có thể khởi tạo sản phẩm cụ thể, chữ ký của phương thức xây dựng phải trả về sản phẩm trừu tượng tương ứng. Điều này giúp mã khách hàng sử dụng nhà máy không bị ràng buộc với biến thể sản phẩm cụ thể được tạo ra bởi nhà máy. **Khách hàng** (Client) chỉ cần gọi giao diện trừu tượng để tương tác với nhà máy và đối tượng sản phẩm.

### Mẫu Code

【AbstractProduct】

Khai báo một giao diện, giao diện này chứa loại đối tượng sản phẩm.

```java
abstract class AbstractProductA {
    public abstract void show();
}

abstract class AbstractProductB {
    public abstract void show();
}
```

【ConcreteProduct】

Định nghĩa một đối tượng sản phẩm, đối tượng sản phẩm này được tạo ra bởi các nhà máy cụ thể liên quan.

```java
class ConcreteProductA1 extends AbstractProductA {
    @Override
    public void show() {
        System.out.println("ConcreteProductA1");
    }
}

class ConcreteProductA2 extends AbstractProductA {
    @Override
    public void show() {
        System.out.println("ConcreteProductA2");
    }
}

class ConcreteProductB1 extends AbstractProductB {
    @Override
    public void show() {
        System.out.println("ConcreteProductB1");
    }
}

class ConcreteProductB2 extends AbstractProductB {
    @Override
    public void show() {
        System.out.println("ConcreteProductB2");
    }
}
```

【AbstractFactory】

Khai báo một giao diện, giao diện này chứa các phương thức tạo ra đối tượng sản phẩm trừu tượng.

```java
abstract class AbstractFactory {
    public abstract AbstractProductA createProductA();
    public abstract AbstractProductB createProductB();
}
```

【ConcreteFactory】

Triển khai các phương thức tạo ra đối tượng sản phẩm cụ thể.

```java
class ConcreteFactory1 extends AbstractFactory {
    @Override
    public AbstractProductA createProductA() {
        return new ConcreteProductA1();
    }

    @Override
    public AbstractProductB createProductB() {
        return new ConcreteProductB1();
    }
}

class ConcreteFactory2 extends AbstractFactory {
    @Override
    public AbstractProductA createProductA() {
        return new ConcreteProductA2();
    }

    @Override
    public AbstractProductB createProductB() {
        return new ConcreteProductB2();
    }
}
```

【Khách hàng】

Chỉ sử dụng giao diện được khai báo bởi `AbstractFactory` và `AbstractProduct`.

```java
public class AbstarctFactoryPattern {
    public static void main(String[] args) {
        AbstractFactory factory1 = new ConcreteFactory1();
        AbstractProductA productA1 = factory1.createProductA();
        AbstractProductB productB1 = factory1.createProductB();
        productA1.show();
        productB1.show();

        AbstractFactory factory2 = new ConcreteFactory2();
        AbstractProductA productA2 = factory2.createProductA();
        AbstractProductB productB2 = factory2.createProductB();
        productA2.show();
        productB2.show();
    }
}
```

【Output】

```
ConcreteProductA1
ConcreteProductB1
ConcreteProductA2
ConcreteProductB2
```

## Pseudocode

Dưới đây là một ví dụ về việc áp dụng mẫu **Abstract Factory**, cho phép mã khách hàng tạo ra các UI element (Button và Checkbox) phù hợp với hệ điều hành hiện tại.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210517195732.png)

Trong ứng dụng đa nền tảng, các UI element có chức năng tương tự nhưng có giao diện khác nhau trên các hệ điều hành khác nhau. Bên cạnh đó, bạn cần đảm bảo rằng UI element được tạo ra phù hợp với phong cách của hệ điều hành hiện tại. Bạn không muốn hiển thị các control của macOS trong ứng dụng chạy trên hệ điều hành Windows.

Giao diện Abstract Factory khai báo một tập hợp các phương thức để tạo ra các UI element trừu tượng khác nhau. Mã khách hàng có thể gọi các phương thức này để tạo ra các UI element với các phong cách khác nhau.

Cách hoạt động như sau: sau khi ứng dụng khởi động, nó sẽ kiểm tra hệ điều hành hiện tại. Dựa trên thông tin đó, ứng dụng sẽ tạo ra một factory object tương ứng với hệ điều hành đó. Các UI element sẽ được tạo ra bằng cách sử dụng factory object này. Điều này giúp tránh việc tạo ra các loại UI element không đúng.

Bằng cách này, mã khách hàng chỉ cần gọi giao diện trừu tượng để tương tác với factory và các đối tượng sản phẩm.

```java
// Giao diện Abstract Factory khai báo một tập hợp các phương thức để tạo ra các đối tượng sản phẩm trừu tượng.
interface GUIFactory is
    method createButton(): Button
    method createCheckbox(): Checkbox

// Các lớp Factory cụ thể triển khai các phương thức tạo ra các đối tượng sản phẩm cụ thể.
class WinFactory implements GUIFactory is
    method createButton(): Button is
        return new WinButton()
    method createCheckbox(): Checkbox is
        return new WinCheckbox()

class MacFactory implements GUIFactory is
    method createButton(): Button is
        return new MacButton()
    method createCheckbox(): Checkbox is
        return new MacCheckbox()

// Giao diện Abstract Product khai báo các phương thức chung cho tất cả các sản phẩm.
interface Button is
    method paint()

interface Checkbox is
    method paint()

// Các lớp Product cụ thể triển khai các phương thức của giao diện Abstract Product.
class WinButton implements Button is
    method paint() is
        // Vẽ button theo phong cách của Windows

class MacButton implements Button is
    method paint() is
        // Vẽ button theo phong cách của macOS

class WinCheckbox implements Checkbox is
    method paint() is
        // Vẽ checkbox theo phong cách của Windows

class MacCheckbox implements Checkbox is
    method paint() is
        // Vẽ checkbox theo phong cách của macOS

// Mã khách hàng chỉ sử dụng giao diện được khai báo bởi Abstract Factory và Abstract Product.
class Client is
    field factory: GUIFactory
    field button: Button
    field checkbox: Checkbox

    constructor Client(factory: GUIFactory) is
        this.factory = factory

    method createUI() is
        this.button = factory.createButton()
        this.checkbox = factory.createCheckbox()

    method paint() is
        button.paint()
        checkbox.paint()

// Ứng dụng sẽ chọn loại factory dựa trên cấu hình hoặc môi trường hiện tại, và tạo factory object tương ứng (thường trong giai đoạn khởi tạo).
class Application is
    method main() is
        config = readApplicationConfigFile()

        if (config.OS == "Windows") then
            factory = new WinFactory()
        else if (config.OS == "Mac") then
            factory = new MacFactory()
        else
            throw new Exception("Lỗi! Hệ điều hành không xác định.")

        client = new Client(factory)
        client.createUI()
        client.paint()
```

## Ví dụ

Như chúng ta đã biết, Apple và Samsung là hai công ty sản xuất thiết bị điện tử hàng đầu thế giới, bao gồm điện thoại di động và máy tính.

Chúng ta sẽ lấy việc sản xuất điện thoại di động và máy tính làm ví dụ, để minh họa việc áp dụng mẫu thiết kế Abstract Factory.

【Vai trò AbstractProduct】

Trước tiên, chúng ta xác định hai giao diện trừu tượng là Telephone (điện thoại di động) và Computer (máy tính), mỗi giao diện này đều có thông tin sản phẩm riêng.

```java
interface Telephone {
    public String getProductInfo();
}

interface Computer {
    public String getProductInfo();
}
```

【Vai trò ConcreteProduct】

`ConcreteProduct` dựa trên `AbstractProduct` để xác định thuộc tính và phương thức cụ thể của sản phẩm.

Trong ví dụ của chúng ta, điện thoại di động và máy tính của Apple và Samsung đều có thông tin sản phẩm cụ thể riêng.

```java
class AppleTelephone implements Telephone {

    @Override
    public String getProductInfo() {
        return "Điện thoại di động Apple, sử dụng hệ điều hành iOS";
    }
}

class SamsungTelephone implements Telephone {

    @Override
    public String getProductInfo() {
        return "Điện thoại di động Samsung, sử dụng hệ điều hành Android";
    }
}

class AppleComputer implements Computer {

    @Override
    public String getProductInfo() {
        return "Máy tính Apple, sử dụng hệ điều hành macOS";
    }
}

class SamsungComputer implements Computer {

    @Override
    public String getProductInfo() {
        return "Máy tính Samsung, sử dụng hệ điều hành Windows";
    }
}
```

【Vai trò AbstractFactory】

Apple và Samsung đều sản xuất điện thoại di động và máy tính. Vì vậy, họ có thể có một lớp cha hoặc giao diện trừu tượng, cung cấp phương thức sản xuất điện thoại di động và máy tính.

```java
interface ElectronicFactory {

    public Telephone produceTelephone();

    public Computer produceComputer();
}
```

【Vai trò ConcreteFactory】

Các nhà máy Apple và Samsung lần lượt triển khai giao diện cha, sản xuất các loại sản phẩm khác nhau.

```java
class AppleFactory implements ElectronicFactory {

    @Override
    public Telephone produceTelephone() {
        return new AppleTelephone();
    }

    @Override
    public Computer produceComputer() {
        return new AppleComputer();
    }
}

class SamsungFactory implements ElectronicFactory {

    @Override
    public Telephone produceTelephone() {
        return new SamsungTelephone();
    }

    @Override
    public Computer produceComputer() {
        return new SamsungComputer();
    }
}
```

【Client】

```java
public class PhoneFactoryDemo {
    public static void main(String[] args) {
        ElectronicFactory appleFactory = new AppleFactory();
        Telephone phone = appleFactory.produceTelephone();
        System.out.println(phone.getProductInfo());
        Computer computer = appleFactory.produceComputer();
        System.out.println(computer.getProductInfo());
    }
}
```

【Kết quả】

```
Điện thoại di động Apple, sử dụng hệ điều hành iOS
Máy tính Apple, sử dụng hệ điều hành macOS
```

## Mối quan hệ với các mẫu khác

- Trong quá trình thiết kế, thường sử dụng [[Factory Method Pattern]] ở giai đoạn đầu (đơn giản hơn và dễ dàng tùy chỉnh thông qua lớp con), sau đó tiến hóa thành sử dụng [[Abstract Factory Pattern]], [[Prototype Pattern]] hoặc [[Builder Pattern]] (linh hoạt hơn nhưng phức tạp hơn).
- [[Builder Pattern]] tập trung vào cách tạo ra đối tượng phức tạp từng bước một. [[Abstract Factory Pattern]] tập trung vào việc sản xuất một loạt các đối tượng liên quan. *Abstract Factory Pattern* trả về sản phẩm ngay lập tức, trong khi *Builder Pattern* cho phép bạn thực hiện các bước xây dựng bổ sung trước khi nhận được sản phẩm.
- [[Abstract Factory Pattern]] thường dựa trên một tập hợp các [phương thức nhà máy](https://refactoringguru.vn/design-patterns/factory-method), nhưng bạn cũng có thể sử dụng [[Prototype Pattern]] để tạo ra các phương thức này.
- Khi chỉ cần ẩn cách tạo đối tượng của một hệ thống con khỏi mã khách hàng, bạn có thể sử dụng [[Abstract Factory Pattern]] thay vì [Mẫu giao diện](https://refactoringguru.vn/design-patterns/facade).
- Bạn có thể kết hợp [[Abstract Factory Pattern]] với [[Bridge Pattern]]. Nếu trừu tượng được xác định bởi *bridge* chỉ có thể hoạt động với một cài đặt cụ thể, việc kết hợp này rất hữu ích. Trong trường hợp này, *Abstract Factory Pattern* có thể đóng gói các mối quan hệ này và ẩn sự phức tạp của chúng khỏi mã khách hàng.
- [[Abstract Factory Pattern]], [[Builder Pattern]] và [[Prototype Pattern]] đều có thể được thực hiện bằng [[Singleton Pattern]].
