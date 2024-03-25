---
title: Facade Pattern
tags:
  - design-pattern
categories:
  - design-pattern
date created: 2023-10-06
date modified: 2023-10-06
---

## Mục đích

**Facade Pattern** là một mẫu thiết kế cấu trúc, cung cấp một giao diện đơn giản để truy cập vào một nhóm giao diện con trong một hệ thống phức tạp. Mẫu thiết kế này định nghĩa một giao diện cao cấp, giúp việc sử dụng các giao diện con trong hệ thống dễ dàng hơn.

- Facade Pattern cung cấp một cách tiếp cận thuận tiện cho các chức năng của một nhóm giao diện con, mà không thay đổi hoặc mở rộng chức năng của chúng.
- Facade Pattern triển khai một mối quan hệ lỏng lẻo giữa hệ thống con và khách hàng.
- Facade Pattern không đóng gói các lớp hệ thống con, chỉ cung cấp một giao diện đơn giản. Nếu ứng dụng yêu cầu, nó không hạn chế khách hàng sử dụng các lớp hệ thống con. Do đó, nó có thể lựa chọn giữa tính dễ sử dụng và tính chung chung của hệ thống.

## Trường hợp sử dụng

- Nếu bạn cần một giao diện trực tiếp đến một nhóm chức năng phức tạp trong hệ thống, và giao diện này có giới hạn chức năng, bạn có thể sử dụng Facade Pattern.
- Nếu bạn cần tổ chức hệ thống thành một cấu trúc nhiều tầng, bạn có thể sử dụng Facade Pattern.

## Cấu trúc

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20231006165447.png)

### Mô tả cấu trúc

1. **Facade** (Giao diện): Cung cấp một cách tiếp cận thuận tiện để truy cập vào các chức năng của một nhóm giao diện con. Nó hiểu cách chuyển hướng yêu cầu từ khách hàng và biết cách thực hiện tất cả các hoạt động liên quan.
2. Tạo **Facade bổ sung** (Additional Facade) có thể tránh tình trạng gộp nhiều chức năng không liên quan vào một Facade duy nhất, biến nó thành một cấu trúc phức tạp hơn. Cả khách hàng và các Facade khác đều có thể sử dụng Facade bổ sung.
3. **Hệ thống con phức tạp** (Complex Subsystem) bao gồm nhiều đối tượng khác nhau. Để thực hiện công việc có ý nghĩa, bạn phải hiểu chi tiết triển khai của hệ thống con, chẳng hạn như khởi tạo đúng thứ tự các đối tượng và cung cấp dữ liệu đúng định dạng cho chúng.

   Lớp hệ thống con không nhận thức sự tồn tại của Facade, chúng hoạt động trong hệ thống và có thể tương tác trực tiếp với nhau.

4. **Khách hàng** (Client) sử dụng Facade thay vì gọi trực tiếp các phương thức của hệ thống con.

### Mẫu mã cấu trúc

**Facade**: Hiểu về chức năng của mỗi lớp hệ thống con, chịu trách nhiệm phân phối yêu cầu của khách hàng cho các hệ thống con để xử lý.

```java
class Class1 {
    public void op1() {
        System.out.println("Method1");
    }
}

class Class2 {
    public void op2() {
        System.out.println("Method2");
    }
}

class Class3 {
    public void op3() {
        System.out.println("Method3");
    }
}
```

**Subsystem Classes**: Thực hiện chức năng của hệ thống con. Xử lý công việc được giao bởi đối tượng Facade mà không nhận biết sự tồn tại của nó.

```java
class Facade {
    private Class1 one = new Class1();
    private Class2 two = new Class2();
    private Class3 three = new Class3();

    public void op1() {
        System.out.println("Facade op1()");
        one.op1();
    }

    public void op2() {
        System.out.println("Facade op2()");
        two.op2();
    }

    public void op3() {
        System.out.println("Facade op3()");
        three.op3();
    }

    public void Method() {
        System.out.println("Facade Method()");
        three.op3();
        two.op2();
        one.op1();
    }
}
```

【Khách hàng】

```java
public class FacadePattern {
    public static void main(String[] args) {
        Facade facade = new Facade();
        facade.Method();

        facade.op1();
    }
}
```

【Kết quả】

```
Facade Method()
Method3
Method2
Method1
Facade op1()
Method1
```

## Pseudocode

Trong ví dụ này, mẫu **Facade** giúp đơn giản hóa giao tiếp giữa khách hàng và framework chuyển đổi video phức tạp.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20231006165901.png)

Bạn có thể tạo một lớp facade để đóng gói các chức năng cần thiết và ẩn đi mã code khác, từ đó không cần phải tương tác trực tiếp với hàng chục lớp trong framework. Cấu trúc này cũng giảm thiểu tác động khi nâng cấp hoặc thay đổi framework trong tương lai, chỉ cần chỉnh sửa cài đặt của phương thức facade trong chương trình.

```java
// Ở đây có một số lớp trong framework chuyển đổi video phức tạp của bên thứ ba. Chúng ta không biết mã code bên trong nên không thể đơn giản hóa chúng.

class VideoFile
// ...

class OggCompressionCodec
// ...

class MPEG4CompressionCodec
// ...

class CodecFactory
// ...

class BitrateReader
// ...

class AudioMixer
// ...


// Để ẩn đi sự phức tạp của framework trong một giao diện đơn giản, chúng ta tạo ra một lớp facade. Đây là một sự cân nhắc giữa tính năng và tính đơn giản.
class VideoConverter is
    method convert(filename, format):File is
        file = new VideoFile(filename)
        sourceCodec = new CodecFactory.extract(file)
        if (format == "mp4")
            destinationCodec = new MPEG4CompressionCodec()
        else
            destinationCodec = new OggCompressionCodec()
        buffer = BitrateReader.read(filename, sourceCodec)
        result = BitrateReader.convert(buffer, destinationCodec)
        result = (new AudioMixer()).fix(result)
        return new File(result)

// Lớp trong ứng dụng không phụ thuộc vào hàng ngàn lớp trong framework phức tạp. Tương tự, nếu bạn quyết định thay đổi framework, bạn chỉ cần viết lại lớp facade.
class Application is
    method main() is
        convertor = new VideoConverter()
        mp4 = convertor.convert("funny-cats-video.ogg", "mp4")
        mp4.save()
```

## Ví dụ

**Sử dụng ví dụ:** Mẫu facade thường được sử dụng trong các chương trình được phát triển bằng Java. Nó đặc biệt hữu ích khi làm việc với các thư viện và API phức tạp.

Dưới đây là một số ví dụ về facade trong các thư viện Java cốt lõi:

- [`javax.faces.context.FacesContext`](http://docs.oracle.com/javaee/7/api/javax/faces/context/FacesContext.html) sử dụng các lớp [`Life­Cycle`](http://docs.oracle.com/javaee/7/api/javax/faces/lifecycle/Lifecycle.html), [`View­Handler`](http://docs.oracle.com/javaee/7/api/javax/faces/application/ViewHandler.html) và [`Navigation­Handler`](http://docs.oracle.com/javaee/7/api/javax/faces/application/NavigationHandler.html) trong nền tảng để thực hiện công việc, nhưng đa số khách hàng không biết điều này.
- [`javax.faces.context.ExternalContext`](http://docs.oracle.com/javaee/7/api/javax/faces/context/ExternalContext.html) sử dụng các lớp [`Servlet­Context`](http://docs.oracle.com/javaee/7/api/javax/servlet/ServletContext.html), [`Http­Session`](http://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpSession.html), [`Http­Servlet­Request`](http://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpServletRequest.html), [`Http­Servlet­Response`](http://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpServletResponse.html) và các lớp khác.

**Cách nhận biết:** Facade có thể được nhận biết bằng cách sử dụng một giao diện đơn giản để đóng gói công việc phức tạp của nhiều lớp. Thông thường, facade quản lý toàn bộ vòng đời của các đối tượng mà nó sử dụng.

## Mối quan hệ với các mẫu khác

- [[Facade Pattern]] định nghĩa một giao diện mới cho các đối tượng hiện có, trong khi [[Adapter Pattern]] cố gắng sử dụng giao diện hiện có. *Adapter* thường chỉ đóng gói một đối tượng, trong khi *Facade* thường hoạt động trên toàn bộ hệ thống con đối tượng.
- Khi chỉ cần ẩn cách tạo đối tượng của hệ thống con khỏi mã khách hàng, bạn có thể sử dụng [[Abstract Factory Pattern]] thay vì [[Facade Pattern]].
- [[Flyweight Pattern]] cho thấy cách tạo ra một lượng lớn các đối tượng nhỏ, trong khi *Facade* cho thấy cách sử dụng một đối tượng đại diện cho toàn bộ hệ thống con.
- [[Facade Pattern]] và [[Mediator Pattern]] có trách nhiệm tương tự: cả hai cố gắng tổ chức sự tương tác giữa các thành phần trong một hệ thống chặt chẽ.
  - *Facade* định nghĩa một giao diện đơn giản cho tất cả các đối tượng trong hệ thống con, nhưng nó không cung cấp bất kỳ chức năng mới nào. Các đối tượng trong hệ thống con có thể tương tác trực tiếp với nhau.
  - *Mediator* tập trung tất cả các hoạt động giao tiếp của các thành phần trong hệ thống. Các thành phần chỉ biết về đối tượng trung gian và không thể tương tác trực tiếp với nhau.
- [[Facade Pattern]] thường có thể chuyển đổi thành một lớp [[Singleton Pattern]], vì trong hầu hết các trường hợp, chỉ cần một đối tượng facade là đủ.
- [[Facade Pattern]] và [[Proxy Pattern]] tương tự nhau trong việc lưu trữ một thực thể phức tạp và tự khởi tạo nó. *Proxy* và đối tượng dịch vụ tuân theo cùng một giao diện, cho phép thay thế lẫn nhau, điều này khác với *Facade*.
