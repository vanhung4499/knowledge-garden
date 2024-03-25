---
title: Bridge Pattern
tags:
  - design-pattern
categories:
  - design-pattern
date created: 2023-10-06
date modified: 2023-10-06
---

## Ý tưởng

**Bridge Pattern** là một mẫu thiết kế cấu trúc, cho phép tách biệt phần **trừu tượng** và phần **thực thi**, cho phép chúng có thể thay đổi độc lập.

Nếu một hệ thống cần thêm tính linh hoạt giữa vai trò trừu tượng và vai trò cụ thể, tránh thiết lập một liên kết tĩnh giữa hai tầng. Cả vai trò trừu tượng và vai trò cụ thể đều có thể được mở rộng bằng cách tạo lớp con. Trong trường hợp này, Bridge Pattern cho phép kết hợp linh hoạt giữa các vai trò trừu tượng và vai trò cụ thể và mở rộng chúng một cách độc lập.

Yêu cầu thiết kế là bất kỳ thay đổi nào trong vai trò cụ thể không được ảnh hưởng đến khách hàng, hoặc nói cách khác, thay đổi trong vai trò cụ thể phải hoàn toàn trong suốt đối với khách hàng.

## Các tình huống sử dụng

- Nếu bạn muốn phân tách hoặc tái cấu trúc một lớp phức tạp có nhiều chức năng (ví dụ: một lớp có thể tương tác với nhiều máy chủ cơ sở dữ liệu), bạn có thể sử dụng Bridge Pattern.
- Nếu bạn muốn mở rộng một lớp theo nhiều chiều độc lập, bạn có thể sử dụng mẫu này.
- Nếu bạn cần chuyển đổi phương pháp thực thi khác nhau trong thời gian chạy, bạn có thể sử dụng Bridge Pattern.

## Cấu trúc

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20231006153154.png)

### Mô tả cấu trúc

1. **Phần trừu tượng** (Abstraction) cung cấp logic điều khiển cấp cao, phụ thuộc vào đối tượng triển khai để hoàn thành công việc thực tế ở cấp thấp.
2. **Phần triển khai** (Implementation) khai báo giao diện chung cho tất cả các triển khai cụ thể. Phần trừu tượng chỉ có thể tương tác với đối tượng triển khai thông qua các phương thức được khai báo ở đây.
   - Phần trừu tượng có thể liệt kê các phương thức giống như phần triển khai, nhưng phần trừu tượng thường khai báo các hành vi phức tạp, phụ thuộc vào nhiều hoạt động nguyên tắc được khai báo bởi phần triển khai.
3. **Triển khai cụ thể** (Concrete Implementations) bao gồm mã cụ thể cho từng nền tảng.
4. **Phần trừu tượng tinh tế** (Refined Abstraction) cung cấp biến thể của logic điều khiển. Giống như lớp cha của nó, chúng tương tác với các triển khai khác nhau thông qua giao diện triển khai chung.
5. Thông thường, **khách hàng** (Client) chỉ quan tâm cách tương tác với phần trừu tượng. Tuy nhiên, khách hàng cần kết nối đối tượng trừu tượng với một đối tượng triển khai.

### Mẫu mã cấu trúc

【Implementor】định nghĩa **giao diện triển khai**.

```java
interface Implementor {
    // Định nghĩa các chức năng cụ thể cần thiết cho phần trừu tượng
    public void operationImpl();
}
```

【Abstraction】định nghĩa **giao diện trừu tượng**.

```java
abstract class Abstraction {
    // Giữ một đối tượng Implementor, tạo thành mối quan hệ tổng hợp
    protected Implementor implementor;

    public Abstraction(Implementor implementor) {
        this.implementor = implementor;
    }

    // Có thể cần chuyển tiếp đến phần triển khai cụ thể để triển khai
    public void operation() {
        implementor.operationImpl();
    }
}
```

【ConcreteImplementor】triển khai giao diện được định nghĩa trong **Implementor**.

```java
class ConcreteImplementorA implements Implementor {
    @Override
    public void operationImpl() {
        // triển khai thực sự
        System.out.println("Triển khai cụ thể A");
    }
}

class ConcreteImplementorB implements Implementor {
    @Override
    public void operationImpl() {
        // triển khai thực sự
        System.out.println("Triển khai cụ thể B");
    }
}
```

【RefinedAbstraction】mở rộng lớp **Abstraction**.

```java
class RefinedAbstraction extends Abstraction {

    public RefinedAbstraction(Implementor implementor) {
        super(implementor);
    }

    public void otherOperation() {
        // triển khai một số chức năng, có thể sử dụng phương thức triển khai cụ thể của phần triển khai,
        // nhưng phương thức này có thể sử dụng các phương thức được định nghĩa trong Abstraction để hoàn thành nhiều chức năng hơn.
    }
}
```

【Client】

```java
public class BridgePattern {
    public static void main(String[] args) {
        Implementor implementor = new ConcreteImplementorA();
        RefinedAbstraction abstraction = new RefinedAbstraction(implementor);
        abstraction.operation();
        abstraction.otherOperation();
    }
}
```

【Output】

```
Triển khai cụ thể A
Các hoạt động khác
```

## Pseudocode

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210430170020.png)

Lớp cơ bản của điều khiển từ xa khai báo một biến thành viên tham chiếu đến đối tượng thiết bị. Tất cả các điều khiển từ xa tương tác với thiết bị thông qua giao diện thiết bị chung, cho phép cùng một điều khiển từ xa hỗ trợ nhiều loại thiết bị khác nhau.

Bạn có thể phát triển các lớp điều khiển từ xa độc lập với lớp thiết bị, chỉ cần tạo một lớp con của điều khiển từ xa. Ví dụ, điều khiển từ xa cơ bản có thể chỉ có hai nút nhưng bạn có thể mở rộng chúng với các tính năng mới như một viên pin phụ hoặc một màn hình cảm ứng.

Mã khách hàng kết nối điều khiển từ xa với đối tượng thiết bị thông qua hàm tạo của điều khiển từ xa.

```java
// Phần trừu tượng định nghĩa giao diện cho "phần điều khiển" của hai cấp lớp. Nó
// giữ một tham chiếu đến đối tượng trong cấp lớp "thực hiện" và sẽ chuyển tiếp tất
// cả công việc thực tế cho đối tượng đó.
class RemoteControl is
    protected field device: Device
    constructor RemoteControl(device: Device) is
        this.device = device
    method togglePower() is
        if (device.isEnabled()) then
            device.disable()
        else
            device.enable()
    method volumeDown() is
        device.setVolume(device.getVolume() - 10)
    method volumeUp() is
        device.setVolume(device.getVolume() + 10)
    method channelDown() is
        device.setChannel(device.getChannel() - 1)
    method channelUp() is
        device.setChannel(device.getChannel() + 1)


// Bạn có thể mở rộng lớp trừu tượng mà không phụ thuộc vào lớp thiết bị.
class AdvancedRemoteControl extends RemoteControl is
    method mute() is
        device.setVolume(0)


// Giao diện "thực hiện" khai báo các phương thức chung cho tất cả các lớp thực hiện.
// Nó không cần phù hợp với giao diện trừu tượng. Trên thực tế, hai giao diện này có
// thể hoàn toàn khác nhau. Thông thường, giao diện thực hiện chỉ cung cấp các hoạt
// động cơ bản, trong khi giao diện trừu tượng định nghĩa các hoạt động cấp cao hơn
// dựa trên các hoạt động cơ bản này.
interface Device is
    method isEnabled()
    method enable()
    method disable()
    method getVolume()
    method setVolume(percent)
    method getChannel()
    method setChannel(channel)


// Tất cả các thiết bị tuân thủ cùng một giao diện.
class Tv implements Device is
    // ...

class Radio implements Device is
    // ...


// Vị trí nào đó trong mã khách hàng.
tv = new Tv()
remote = new RemoteControl(tv)
remote.togglePower()

radio = new Radio()
remote = new AdvancedRemoteControl(radio)
```

## Ví dụ

**Ứng dụng ví dụ:** Mẫu cầu rất hữu ích khi xử lý ứng dụng đa nền tảng, hỗ trợ nhiều loại máy chủ cơ sở dữ liệu hoặc làm việc với nhiều nhà cung cấp API cụ thể (ví dụ: nền tảng đám mây và mạng xã hội).

**Cách nhận biết**: Mẫu cầu có thể được nhận biết thông qua sự phân biệt rõ ràng giữa thực thể điều khiển và nhiều nền tảng khác nhau mà nó phụ thuộc.

Một ví dụ điển hình về việc áp dụng mẫu cầu trong Java là gói cầu của thành phần ghi nhật ký slf4j.

Giả sử bạn đang phát triển một ứng dụng và các thành phần được gọi trong ứng dụng đã sử dụng common-logging. Bây giờ bạn cần sử dụng jcl-over-slf4j.jar để chuyển hướng thông tin ghi nhật ký đến slf4j-api, sau đó slf4j-api sẽ gọi thành phần ghi nhật ký thực tế mà nó phụ thuộc. Quá trình này được gọi là cầu. Dưới đây là mô hình cầu chính thức của slf4j:

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20231006153729.png)  

## Mối quan hệ với các mẫu khác

- [[Bridge Pattern]] thường được thiết kế ở giai đoạn đầu của quá trình phát triển để cho phép các phần khác nhau của chương trình hoạt động độc lập. Mặt khác, [[Adapter Pattern]] thường được sử dụng trong các chương trình đã có để cho phép các lớp không tương thích hoạt động cùng nhau.
- [[Bridge Pattern]], [[State Pattern]] và [Strategy Pattern]] (bao gồm một phần [[Adapter Pattern]]) có giao diện rất tương tự. Trên thực tế, chúng đều dựa trên [[Composite Pattern]] - tức là giao việc cho các đối tượng khác nhau, nhưng lại giải quyết các vấn đề khác nhau. Mẫu không chỉ là cách tổ chức mã theo cách cụ thể, bạn cũng có thể sử dụng chúng để thảo luận với các nhà phát triển khác về các vấn đề mà mẫu giải quyết.
