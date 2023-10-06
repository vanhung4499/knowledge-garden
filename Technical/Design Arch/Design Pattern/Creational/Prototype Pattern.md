---
title: Prototype Pattern
tags:
  - design-pattern
categories:
  - design-pattern
date created: 2023-10-06
date modified: 2023-10-06
---

## Mô tả

**Mẫu thiết kế Prototype** (Prototype Pattern) là một Mẫu thiết kế thiết kế tạo đối tượng (creational design pattern), cho phép bạn sao chép các đối tượng đã tồn tại mà không cần phụ thuộc vào lớp của chúng.

Prototype Pattern chủ yếu được sử dụng để sao chép đối tượng. Đối tượng gốc và đối tượng sao chép có cùng kiểu dữ liệu, nhưng không chia sẻ cùng một bộ nhớ.

### Sao chép sâu và sao chép nông

Sao chép nông (shallow copy) chỉ sao chép các giá trị của các trường của đối tượng, trong khi các trường tham chiếu vẫn trỏ đến cùng một đối tượng.

Ví dụ: Nếu một đối tượng có một trường tham chiếu đến một chuỗi, và chúng ta sao chép đối tượng này một cách nông (shallow copy), thì hai đối tượng sẽ trỏ đến cùng một chuỗi.

Sao chép sâu (deep copy) là quá trình sao chép tất cả các trường và các đối tượng được tham chiếu bởi các trường đó. Điều này đảm bảo rằng các đối tượng sao chép và đối tượng gốc không chia sẻ cùng một bộ nhớ.

## Ứng dụng

- Khi bạn cần sao chép một số đối tượng và đồng thời muốn mã của bạn độc lập với lớp của các đối tượng đó, bạn có thể sử dụng Prototype Pattern.
- Nếu sự khác biệt giữa các lớp con chỉ nằm trong cách khởi tạo đối tượng của chúng, bạn có thể sử dụng Mẫu thiết kế này để giảm số lượng lớp con. Người khác có thể tạo ra các lớp con này để tạo ra các đối tượng cụ thể.

## Cấu trúc

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20210506094301.png)

1. **Prototype** (Prototype) là một giao diện khai báo phương thức sao chép. Trong hầu hết các trường hợp, chỉ có một phương thức sao chép được gọi là `clone`.
2. **Concrete Prototype** (Concrete Prototype) là lớp triển khai phương thức sao chép. Ngoài việc sao chép dữ liệu của đối tượng gốc vào đối tượng sao chép, phương thức này cũng có thể xử lý các trường hợp đặc biệt trong quá trình sao chép, như sao chép các đối tượng liên quan và giải quyết các phụ thuộc đệ quy.
3. **Client** (Client) có thể sao chép bất kỳ đối tượng nào đã triển khai giao diện Prototype.

## Pseudocode

Trong ví dụ này, **Prototype Pattern** cho phép bạn tạo ra các bản sao hoàn toàn giống nhau của các đối tượng hình học mà không cần phụ thuộc vào lớp của chúng.

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20210506095002.png)

Tất cả các lớp hình dạng đều tuân thủ cùng một giao diện cung cấp phương thức clone. Trước khi sao chép các giá trị biến thành đối tượng kết quả, các lớp con có thể gọi phương thức clone của lớp cha.

```java
// Base prototype.
abstract class Shape is
    field X: int
    field Y: int
    field color: string

    // A regular constructor.
    constructor Shape() is
        // ...

    // The prototype constructor. A fresh object is initialized
    // with values from the existing object.
    constructor Shape(source: Shape) is
        this()
        this.X = source.X
        this.Y = source.Y
        this.color = source.color

    // The clone operation returns one of the Shape subclasses.
    abstract method clone():Shape

// Concrete prototype. The cloning method creates a new object
// in one go by calling the constructor of the current class and
// passing the current object as the constructor's argument.
// Performing all the actual copying in the constructor helps to
// keep the result consistent: the constructor will not return a
// result until the new object is fully built; thus, no object
// can have a reference to a partially-built clone.
class Rectangle extends Shape is
    field width: int
    field height: int

    constructor Rectangle(source: Rectangle) is
        // A parent constructor call is needed to copy private
        // fields defined in the parent class.
        super(source)
        this.width = source.width
        this.height = source.height

    method clone():Shape is
        return new Rectangle(this)

class Circle extends Shape is
    field radius: int

    constructor Circle(source: Circle) is
        super(source)
        this.radius = source.radius

    method clone():Shape is
        return new Circle(this)

// Somewhere in the client code.
class Application is
    field shapes: array of Shape

    constructor Application() is
        Circle circle = new Circle()
        circle.X = 10
        circle.Y = 10
        circle.radius = 20
        shapes.add(circle)

        Circle anotherCircle = circle.clone()
        shapes.add(anotherCircle)
        // The `anotherCircle` variable contains an exact copy
        // of the `circle` object.

        Rectangle rectangle = new Rectangle()
        rectangle.width = 10
        rectangle.height = 20
        shapes.add(rectangle)

    method businessLogic() is
        // Prototype rocks because it lets you produce a copy of
        // an object without knowing anything about its type.
        Array shapesCopy = new Array of Shapes.

        // For instance, we don't know the exact elements in the
        // shapes array. All we know is that they are all
        // shapes. But thanks to polymorphism, when we call the
        // `clone` method on a shape the program checks its real
        // class and runs the appropriate clone method defined
        // in that class. That's why we get proper clones
        // instead of a set of simple Shape objects.
        foreach (s in shapes) do
            shapesCopy.add(s.clone())

        // The `shapesCopy` array contains exact copies of the
        // `shape` array's children.
```

## Ví dụ

**Ví dụ sử dụng:** Mô hình Prototype được sử dụng rộng rãi trong Java, đặc biệt trong việc tạo bản sao của các đối tượng có sẵn.

Trong thư viện Java, chúng ta có một ví dụ về mô hình Prototype là giao diện `Cloneable` và phương thức `clone()` trong lớp `Object`.

**Cách nhận biết:** Mô hình Prototype có thể được nhận biết bằng cách kiểm tra xem lớp có phương thức `clone()` hoặc `copy()` không.

## Ví dụ

**Ví dụ sử dụng:** Giao diện `Cloneable` của Java là một ví dụ cụ thể của mẫu Prototype có thể sử dụng ngay lập tức.

Bất kỳ lớp nào cũng có thể triển khai giao diện này để có tính chất có thể sao chép.

- [`java.lang.Object#clone()`](http://docs.oracle.com/javase/8/docs/api/java/lang/Object.html#clone--) (Lớp phải triển khai giao diện [`java.lang.Cloneable`](http://docs.oracle.com/javase/8/docs/api/java/lang/Cloneable.html))

**Cách nhận biết:** Prototype có thể dễ dàng được nhận biết thông qua các phương thức như `clone` hoặc `copy`.

## Mối quan hệ với các mẫu khác

- Trong giai đoạn thiết kế ban đầu, thường sử dụng [[Factory Method Pattern]] (đơn giản hơn và dễ tùy chỉnh hơn thông qua các lớp con) và sau đó tiến triển thành việc sử dụng [[Abstract Factory Pattern]], [[Prototype Pattern]] hoặc [[Builder Pattern]] (linh hoạt hơn nhưng phức tạp hơn).
- [[Abstract Factory Pattern]] thường dựa trên một tập hợp các [[Factory Method Pattern]], nhưng bạn cũng có thể sử dụng [[Prototype Pattern]] để tạo các đối tượng này.
- [[Prototype Pattern]] có thể được sử dụng để lưu trữ lịch sử của [[Command Pattern]].
- Thiết kế sử dụng nhiều [[Composite Pattern]] và [[Decorator Pattern]] thường có lợi từ việc sử dụng [[Prototype Pattern]]. Bạn có thể sao chép cấu trúc phức tạp này thay vì xây dựng lại từ đầu.
- [[Prototype Pattern]] không dựa trên kế thừa, do đó không có nhược điểm của kế thừa. Tuy nhiên, Prototype đòi hỏi quá trình khởi tạo phức tạp cho đối tượng được sao chép. [[Factory Method Pattern]] dựa trên kế thừa, nhưng không yêu cầu quá trình khởi tạo.
- Đôi khi, [[Prototype Pattern]] có thể được sử dụng như một phiên bản đơn giản hóa của [[Memento Pattern]], với điều kiện là trạng thái của đối tượng cần lưu trữ trong lịch sử đơn giản hơn, không cần liên kết với tài nguyên bên ngoài hoặc liên kết có thể dễ dàng tái tạo.
- [[Abstract Factory Pattern]], [[Builder Pattern]] và [[Prototype Pattern]] đều có thể được triển khai bằng [[Singleton Pattern]].
