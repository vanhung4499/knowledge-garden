---
title: Adapter Pattern
tags: [design-pattern, Adapter]
categories:
  - design-pattern
date created: 2023-10-06
date modified: 2024-03-25
---

# Adapter Pattern

## Ý tưởng

**Mẫu Adapter** (Adapter) là một mẫu thiết kế cấu trúc, cho phép các đối tượng không tương thích làm việc cùng nhau.

Mẫu Adapter ẩn đi quá trình chuyển đổi phức tạp bên trong bằng cách đóng gói đối tượng. Đối tượng được đóng gói thậm chí không nhận ra sự tồn tại của Adapter.

Adapter không chỉ có thể chuyển đổi dữ liệu từ các định dạng khác nhau, mà còn hỗ trợ sự hợp tác giữa các đối tượng có các giao diện khác nhau. Cách hoạt động của nó như sau:

- Adapter triển khai một giao diện tương thích với một trong các đối tượng hiện có.
- Đối tượng hiện có có thể sử dụng giao diện này để gọi các phương thức của Adapter một cách an toàn.
- Sau khi phương thức của Adapter được gọi, nó chuyển tiếp yêu cầu theo đúng định dạng và thứ tự của một đối tượng khác mà nó tương thích.

## Trường hợp sử dụng

- Khi bạn muốn sử dụng một lớp nhưng giao diện của nó không tương thích với mã khác, bạn có thể sử dụng lớp Adapter.
- Nếu bạn cần tái sử dụng một số lớp trong cùng một cấu trúc kế thừa và chúng có một số phương thức chung bổ sung, nhưng không phải tất cả các lớp con trong cấu trúc kế thừa đó đều có sự chung nhất về phương thức đó.

## Cấu trúc

Adapter triển khai một giao diện của một đối tượng và đóng gói đối tượng khác.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210430141928.png)

### Giải thích cấu trúc

1. **Khách hàng** (Client) là lớp chứa logic kinh doanh hiện tại của chương trình.
2. **Giao diện khách hàng** (Client Interface) mô tả giao thức mà các lớp khác phải tuân thủ khi làm việc với mã khách hàng.
3. **Dịch vụ** (Service) chứa một số lớp chức năng (thường là từ bên thứ ba hoặc hệ thống cũ). Khách hàng không tương thích với giao diện của chúng, do đó không thể gọi chức năng của chúng trực tiếp.
4. **Adapter** là một lớp có thể tương tác với cả khách hàng và dịch vụ: nó triển khai giao diện của khách hàng trong khi đóng gói đối tượng dịch vụ. Adapter nhận các cuộc gọi từ khách hàng thông qua giao diện adapter và chuyển tiếp chúng thành các cuộc gọi phù hợp với đối tượng dịch vụ được đóng gói.
5. Mã khách hàng chỉ cần tương tác với adapter thông qua giao diện, không cần phụ thuộc vào lớp adapter cụ thể. Do đó, bạn có thể thêm các loại adapter mới vào chương trình mà không cần sửa đổi mã hiện có. Điều này hữu ích khi giao diện của lớp dịch vụ bị thay đổi hoặc thay thế: bạn có thể tạo ra các lớp adapter mới mà không cần sửa đổi mã khách hàng hiện có.

### Mẫu mã cấu trúc

【Target】

Định nghĩa **giao diện thực sự cần thiết** cho người dùng.

```java
abstract class Target {
    public abstract void Request();
}
```

【Adaptee】

Định nghĩa một **giao diện cần được chuyển đổi**.

```java
class Adaptee {
    public void SpecificRequest() {
        System.out.println("Yêu cầu đặc biệt");
    }
}
```

【Adapter】

Bằng cách **đóng gói một đối tượng Adaptee**, chuyển đổi giao diện nguồn thành giao diện mục tiêu.

```java
class Adapter extends Target {
    private Adaptee adaptee = new Adaptee();

    @Override
    public void Request() {
        adaptee.SpecificRequest();
    }
}
```

【Khách hàng】

```java
public class AdapterPattern {
    public static void main(String[] args) {
        Target target = new Adapter();
        target.Request();
    }
}
```

【Đầu ra】

```
Yêu cầu đặc biệt
```

## Pseudocode

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20231006151431.png)

Adapter giả vờ là một đinh vòng (RoundPeg), có bán kính bằng một nửa đường chéo của đinh vuông (SquarePeg) (tức là bán kính của hình tròn ngoại tiếp nhỏ nhất có thể chứa đinh vuông).

```java
// Giả sử bạn có hai lớp tương thích với nhau: lỗ tròn (RoundHole) và đinh vòng (RoundPeg).
class RoundHole is
    constructor RoundHole(radius) { ... }

    method getRadius() is
        // Trả về bán kính của lỗ.

    method fits(peg: RoundPeg) is
        return this.getRadius() >= peg.getRadius()

class RoundPeg is
    constructor RoundPeg(radius) { ... }

    method getRadius() is
        // Trả về bán kính của đinh.


// Nhưng cũng có một lớp không tương thích: đinh vuông (SquarePeg).
class SquarePeg is
    constructor SquarePeg(width) { ... }

    method getWidth() is
        // Trả về chiều rộng của đinh.


// Lớp Adapter cho phép bạn đặt đinh vuông vào lỗ tròn. Nó mở rộng lớp RoundPeg để chấp nhận một đối tượng Adapter như một đinh vòng.
class SquarePegAdapter extends RoundPeg is
    // Trong thực tế, Adapter sẽ chứa một phiên bản của lớp SquarePeg.
    private field peg: SquarePeg

    constructor SquarePegAdapter(peg: SquarePeg) is
        this.peg = peg

    method getRadius() is
        // Adapter sẽ giả vờ là một đinh vòng,
        // có bán kính chính xác để phù hợp với đinh vuông được đóng gói trong Adapter.
        return peg.getWidth() * Math.sqrt(2) / 2


// Một vị trí nào đó trong mã khách hàng.
hole = new RoundHole(5)
rpeg = new RoundPeg(5)
hole.fits(rpeg) // true

small_sqpeg = new SquarePeg(5)
large_sqpeg = new SquarePeg(10)
hole.fits(small_sqpeg) // Lỗi biên dịch ở đây (không tương thích kiểu).

small_sqpeg_adapter = new SquarePegAdapter(small_sqpeg)
large_sqpeg_adapter = new SquarePegAdapter(large_sqpeg)
hole.fits(small_sqpeg_adapter) // true
hole.fits(large_sqpeg_adapter) // false
```

## Ví dụ

Mô hình Adapter rất phổ biến trong mã Java.

Thư viện lõi của Java có một số Adapter tiêu chuẩn:

- [`java.util.Arrays#asList()`](https://docs.oracle.com/javase/8/docs/api/java/util/Arrays.html#asList-T...-)
- [`java.util.Collections#list()`](https://docs.oracle.com/javase/8/docs/api/java/util/Collections.html#list-java.util.Enumeration-)
- [`java.util.Collections#enumeration()`](https://docs.oracle.com/javase/8/docs/api/java/util/Collections.html#enumeration-java.util.Collection-)
- [`java.io.InputStreamReader(InputStream)`](https://docs.oracle.com/javase/8/docs/api/java/io/InputStreamReader.html#InputStreamReader-java.io.InputStream-) (trả về đối tượng `Reader`)
- [`java.io.OutputStreamWriter(OutputStream)`](https://docs.oracle.com/javase/8/docs/api/java/io/OutputStreamWriter.html#OutputStreamWriter-java.io.OutputStream-) (trả về đối tượng `Writer`)
- [`javax.xml.bind.annotation.adapters.XmlAdapter#marshal()`](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/adapters/XmlAdapter.html#marshal-BoundType-) và `#unmarshal()`

**Cách nhận biết**: Adapter có thể được nhận biết thông qua hàm tạo nhận tham số là một đối tượng của một kiểu trừu tượng hoặc giao diện khác nhau. Khi một phương thức của Adapter được gọi, nó sẽ chuyển đổi tham số thành định dạng phù hợp và sau đó chuyển hướng cuộc gọi đến một hoặc nhiều phương thức trong đối tượng bọc của nó.

## Mối quan hệ với các mẫu khác

- [[Bridge Pattern]] thường được thiết kế ở giai đoạn đầu của quá trình phát triển để cho phép các phần khác nhau của chương trình hoạt động độc lập. Mặt khác, [[Adapter Pattern]] thường được sử dụng trong các chương trình đã có để cho phép các lớp không tương thích hoạt động cùng nhau.
- [[Adapter Pattern]] có thể thay đổi giao diện của đối tượng hiện có, trong khi [[Decorator Pattern]] có thể tăng cường chức năng của đối tượng mà không thay đổi giao diện của nó. Ngoài ra, *Decorator* hỗ trợ kết hợp đệ quy, trong khi *Adapter* không thể thực hiện điều này.
- [[Adapter Pattern]] cung cấp giao diện khác cho đối tượng được đóng gói, trong khi [[Proxy Pattern]] cung cấp cùng một giao diện cho đối tượng. [[Decorator Pattern]] cũng cung cấp giao diện tăng cường cho đối tượng.
- [[Facade Pattern]] định nghĩa một giao diện mới cho đối tượng hiện có, trong khi [Adapter Pattern]] cố gắng sử dụng giao diện hiện có. *Adapter* thường chỉ đóng gói một đối tượng, trong khi *Facade* thường áp dụng cho toàn bộ hệ thống con đối tượng.
- [[Bridge Pattern]], [[State Pattern]] và [[Strategy Pattern]] (bao gồm một phần [[Adapter Pattern]]) có giao diện rất tương tự. Trên thực tế, chúng đều dựa trên [[Composite Pattern]] - tức là giao việc cho các đối tượng khác nhau, nhưng lại giải quyết các vấn đề khác nhau. Mẫu không chỉ là công thức sắp xếp mã theo cách cụ thể, bạn cũng có thể sử dụng chúng để thảo luận với các nhà phát triển khác về các vấn đề mà mẫu giải quyết.
