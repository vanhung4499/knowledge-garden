---
title: Visitor Pattern
tags: 
categories: 
date created: 2023-10-06
date modified: 2023-10-06
---

## Ý nghĩa

Visitor Pattern là một mẫu thiết kế hành vi, nó cho phép tách biệt thuật toán và các đối tượng mà thuật toán đó tác động.

## Ứng dụng

- Sử dụng Visitor Pattern khi bạn cần thực hiện một số hoạt động trên tất cả các phần tử trong một cấu trúc đối tượng phức tạp (ví dụ: cây đối tượng).
- Visitor Pattern có thể được sử dụng để tách logic kinh doanh của các hoạt động phụ.

## Cấu trúc

### Giải thích cấu trúc

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20231006212401.png)

1. **Visitor**: Giao diện Visitor khai báo một loạt các phương thức truy cập với các đối tượng cụ thể trong cấu trúc đối tượng. Nếu ngôn ngữ lập trình hỗ trợ việc nạp chồng, các phương thức này có thể có cùng tên nhưng các tham số phải khác nhau.
2. **Concrete Visitor**: Concrete Visitor triển khai một số phiên bản khác nhau của cùng một hành vi cho các lớp đối tượng cụ thể.
3. **Element**: Giao diện Element khai báo một phương thức "chấp nhận" Visitor. Phương thức này phải có một tham số được khai báo là kiểu giao diện Visitor.
4. **Concrete Element**: Concrete Element phải triển khai phương thức chấp nhận. Mục đích của phương thức này là chuyển hướng cuộc gọi dựa trên lớp Element hiện tại đến phương thức tương ứng của Visitor tương ứng. Lưu ý rằng, ngay cả khi lớp cơ sở Element triển khai phương thức này, tất cả các lớp con đều phải ghi đè nó và gọi phương thức thích hợp trong đối tượng Visitor.
5. **Client**: Client thường đại diện cho một tập hợp hoặc một đối tượng phức tạp khác (ví dụ: cây [[Composite Pattern]]). Client thường không biết về tất cả các lớp Concrete Element, vì chúng sẽ tương tác với các đối tượng trong tập hợp thông qua giao diện trừu tượng.

### Mẫu code cấu trúc

**Visitor**: Khai báo một phương thức Visit cho mỗi lớp ConcreteElement trong cấu trúc đối tượng.

```java
abstract class Visitor {
    public abstract void VisitConcreteElementA(ConcreteElementA elementA);
    public abstract void VisitConcreteElementB(ConcreteElementB elementB);
}
```

**ConcreteVisitor**: Triển khai các phương thức Visit được khai báo bởi Visitor. Mỗi phương thức triển khai một phần của thuật toán, tương ứng với lớp đối tượng trong cấu trúc.

```java
class ConcreteVisitor1 extends Visitor {
    @Override
    public void VisitConcreteElementA(ConcreteElementA elementA) {
        System.out.println(this.getClass().getName() + " thăm " + elementA.getClass().getName());
    }

    @Override
    public void VisitConcreteElementB(ConcreteElementB elementB) {
        System.out.println(this.getClass().getName() + " thăm " + elementB.getClass().getName());
    }
}

class ConcreteVisitor2 extends Visitor {
    @Override
    public void VisitConcreteElementA(ConcreteElementA elementA) {
        System.out.println(this.getClass().getName() + " thăm " + elementA.getClass().getName());
    }

    @Override
    public void VisitConcreteElementB(ConcreteElementB elementB) {
        System.out.println(this.getClass().getName() + " thăm " + elementB.getClass().getName());
    }
}
```

**Element**: Định nghĩa một phương thức Accept, nhận một Visitor làm tham số.

```java
abstract class Element {
    public abstract void Accept(Visitor visitor);
}
```

**ConcreteElement**: Triển khai phương thức Accept được khai báo bởi Element.

```java
class ConcreteElementA extends Element {
    @Override
    public void Accept(Visitor visitor) {
        visitor.VisitConcreteElementA(this);
    }
}

class ConcreteElementB extends Element {
    @Override
    public void Accept(Visitor visitor) {
        visitor.VisitConcreteElementB(this);
    }
}
```

**ObjectStructure**: Liệt kê các phần tử trong nó và cung cấp một giao diện cao cấp để cho phép Visitor truy cập các phần tử.

```java
class ObjectStructure {
    private List<Element> elements = new ArrayList<Element>();

    public void Attach(Element element) {
        elements.add(element);
    }

    public void Detach(Element element) {
        elements.remove(element);
    }

    public void Accept(Visitor visitor) {
        for (Element elem : elements) {
            elem.Accept(visitor);
        }
    }
}
```

Khách hàng

```java
public class VisitorPattern {
    public static void main(String[] args) {
        ObjectStructure o = new ObjectStructure();
        o.Attach(new ConcreteElementA());
        o.Attach(new ConcreteElementB());

        ConcreteVisitor1 v1 = new ConcreteVisitor1();
        ConcreteVisitor2 v2 = new ConcreteVisitor2();

        o.Accept(v1);
        o.Accept(v2);
    }
}
```

Kết quả

```
ConcreteVisitor1 thăm ConcreteElementA
ConcreteVisitor1 thăm ConcreteElementB
ConcreteVisitor2 thăm ConcreteElementA
ConcreteVisitor2 thăm ConcreteElementB
```

## Pseudocode

Trong ví dụ này, mẫu thiết kế **Visitor** được sử dụng để hỗ trợ việc xuất các hình học trong cấu trúc đối tượng thành tệp XML.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20231006212755.png)

```java
// Giao diện Element khai báo một phương thức accept, nhận một Visitor làm tham số.
interface Shape is
    method move(x, y)
    method draw()
    method accept(v: Visitor)

// Mỗi lớp Concrete Element phải triển khai phương thức accept, chuyển hướng cuộc gọi dựa trên lớp Element hiện tại đến phương thức tương ứng của Visitor.
class Dot implements Shape is
    method accept(v: Visitor) is
        v.visitDot(this)

class Circle implements Shape is
    method accept(v: Visitor) is
        v.visitCircle(this)

class Rectangle implements Shape is
    method accept(v: Visitor) is
        v.visitRectangle(this)

class CompoundShape implements Shape is
    method accept(v: Visitor) is
        v.visitCompoundShape(this)


// Giao diện Visitor khai báo một tập hợp các phương thức truy cập tương ứng với các lớp Concrete Element.
interface Visitor is
    method visitDot(d: Dot)
    method visitCircle(c: Circle)
    method visitRectangle(r: Rectangle)
    method visitCompoundShape(cs: CompoundShape)

// Lớp Concrete Visitor triển khai các phương thức truy cập tương ứng với các lớp Concrete Element.
class XMLExportVisitor implements Visitor is
    method visitDot(d: Dot) is
        // Xuất ID và tọa độ trung tâm của Dot.

    method visitCircle(c: Circle) is
        // Xuất ID, tọa độ trung tâm và bán kính của Circle.

    method visitRectangle(r: Rectangle) is
        // Xuất ID, tọa độ góc trên bên trái, chiều rộng và chiều dài của Rectangle.

    method visitCompoundShape(cs: CompoundShape) is
        // Xuất ID của hình dạng và danh sách ID của các phần tử con.


// Lớp Application đại diện cho một tập hợp các hình học hoặc một đối tượng phức tạp khác. 
class Application is
    field allShapes: array of Shapes

    method export() is
        exportVisitor = new XMLExportVisitor()

        foreach (shape in allShapes) do
            shape.accept(exportVisitor)
```

## Ví dụ

**Ví dụ sử dụng:** Visitor Pattern không phổ biến nhưng vẫn có một số ứng dụng trong các thư viện Java. Dưới đây là một số ví dụ:

- [`javax.lang.model.element.AnnotationValue`](http://docs.oracle.com/javase/8/docs/api/javax/lang/model/element/AnnotationValue.html) và [`Annotation­Value­Visitor`](http://docs.oracle.com/javase/8/docs/api/javax/lang/model/element/AnnotationValueVisitor.html)
- [`javax.lang.model.element.Element`](http://docs.oracle.com/javase/8/docs/api/javax/lang/model/element/Element.html) và [`Element­Visitor`](http://docs.oracle.com/javase/8/docs/api/javax/lang/model/element/ElementVisitor.html)
- [`javax.lang.model.type.TypeMirror`](http://docs.oracle.com/javase/8/docs/api/javax/lang/model/type/TypeMirror.html) và [`Type­Visitor`](http://docs.oracle.com/javase/8/docs/api/javax/lang/model/type/TypeVisitor.html)
- [`java.nio.file.FileVisitor`](http://docs.oracle.com/javase/8/docs/api/java/nio/file/FileVisitor.html) và [`Simple­File­Visitor`](http://docs.oracle.com/javase/8/docs/api/java/nio/file/SimpleFileVisitor.html)
- [`javax.faces.component.visit.VisitContext`](http://docs.oracle.com/javaee/7/api/javax/faces/component/visit/VisitContext.html) và [`Visit­Callback`](http://docs.oracle.com/javaee/7/api/javax/faces/component/visit/VisitCallback.html)

## Mối quan hệ với các mẫu khác

- Bạn có thể coi [[Visitor Pattern]] là một phiên bản mạnh mẽ hơn của [[Command Pattern]], trong đó đối tượng Visitor có thể thực hiện các hoạt động trên nhiều lớp khác nhau.
- Bạn có thể sử dụng [[Visitor Pattern]] để thực hiện các hoạt động trên toàn bộ cây [[Composite Pattern|Composite]].
- Bạn có thể sử dụng [[Visitor Pattern]]n và [[Iterator Pattern]] cùng nhau để duyệt qua cấu trúc dữ liệu phức tạp và thực hiện các hoạt động mong muốn trên các phần tử, ngay cả khi các phần tử thuộc các lớp khác nhau hoàn toàn.
