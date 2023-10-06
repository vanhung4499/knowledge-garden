---
title: Composite Pattern
tags:
  - design-pattern
categories:
  - design-pattern
date created: 2023-10-06
date modified: 2023-10-06
---

## Ý tưởng

**Composite Pattern** là một mẫu thiết kế cấu trúc, cho phép tổ chức các đối tượng thành cấu trúc cây để biểu diễn các mối quan hệ "một phần - toàn bộ" của chúng.

Composite Pattern cho phép người dùng sử dụng các đối tượng đơn lẻ và các đối tượng tổ hợp theo cách duy nhất.

## Các tình huống sử dụng

Composite Pattern được sử dụng trong các tình huống sau:

- Muốn biểu diễn cấu trúc "một phần - toàn bộ" của đối tượng.
- Muốn cho phép khách hàng bỏ qua sự khác biệt giữa đối tượng tổ hợp và đối tượng đơn lẻ, khách hàng sẽ sử dụng tất cả các đối tượng trong cấu trúc tổ hợp theo cách thống nhất.

Một ví dụ phổ biến về cấu trúc dữ liệu có cấu trúc cây là **hệ thống tệp** mà bạn gặp phải mỗi khi sử dụng máy tính.

Hệ thống tệp bao gồm thư mục và tệp. Mỗi thư mục có thể chứa nội dung. Nội dung của một thư mục có thể là tệp hoặc thư mục khác.

Theo cách này, hệ thống tệp của máy tính được tổ chức dưới dạng cấu trúc đệ quy. Nếu bạn muốn mô tả một cấu trúc dữ liệu như vậy, bạn có thể sử dụng Composite Pattern.

## Cấu trúc

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20231006154527.png)

### Mô tả cấu trúc

1. **Component** (Component) là giao diện mô tả các hoạt động chung của các mục đơn giản và các mục phức tạp trong cây. Nó quản lý một tham chiếu đến đối tượng trong cấu trúc "thực hiện" và sẽ chuyển tiếp tất cả công việc thực tế cho đối tượng đó.
2. **Leaf** (Leaf) là cấu trúc cơ bản của cây, không chứa các mục con. Thông thường, các lá sẽ thực hiện hầu hết công việc thực tế, vì chúng không thể giao công việc cho các phần khác.
3. **Composite** (Composite) - còn được gọi là "thành phần" - là đơn vị chứa các mục lá hoặc các mục khác. Composite không biết lớp cụ thể của các mục con của nó, nó chỉ tương tác với chúng thông qua giao diện thành phần chung. Composite nhận yêu cầu và giao công việc cho các mục con của mình, xử lý kết quả trung gian và sau đó trả kết quả cuối cùng cho khách hàng.
4. **Client** tương tác với tất cả các mục trong cấu trúc thông qua giao diện thành phần. Do đó, khách hàng có thể tương tác với các mục đơn giản hoặc các mục phức tạp trong cấu trúc cây theo cách thống nhất.

### Code mẫu

**Component**: Đối tượng trong cấu trúc composite khai báo giao diện, trong một số trường hợp, triển khai hành vi mặc định của tất cả các lớp. Nó khai báo một giao diện để truy cập và quản lý các thành phần con của Component.

```java
abstract class Component {
    protected String name;

    public Component(String name) {
        this.name = name;
    }

    public abstract void Add(Component c);
    public abstract void Remove(Component c);
    public abstract void Display(int depth);
}
```

**Leaf**: Đại diện cho đối tượng lá. Các lá không có các thành phần con.

```java
class Leaf extends Component {

    public Leaf(String name) {
        super(name);
    }

    @Override
    public void Add(Component c) {
        System.out.println("Không thể thêm vào một lá");
    }

    @Override
    public void Remove(Component c) {
        System.out.println("Không thể xóa khỏi một lá");
    }

    @Override
    public void Display(int depth) {
        String temp = "";
        for (int i = 0; i < depth; i++)
            temp += '-';
        System.out.println(temp + name);
    }

}
```

**Composite**: Định nghĩa hành vi của nút nhánh, lưu trữ các thành phần con, triển khai các hoạt động liên quan đến thành phần con trong giao diện Component, ví dụ như Add và Remove.

```java
class Composite extends Component {

    private List<Component> children = new ArrayList<Component>();

    public Composite(String name) {
        super(name);
    }

    @Override
    public void Add(Component c) {
        children.add(c);
    }

    @Override
    public void Remove(Component c) {
        children.remove(c);
    }

    @Override
    public void Display(int depth) {
        String temp = "";
        for (int i = 0; i < depth; i++)
            temp += '-';
        System.out.println(temp + name);

        for (Component c : children) {
            c.Display(depth + 2);
        }
    }

}
```

**Client**: Tương tác với các đối tượng trong cấu trúc thông qua giao diện Component.

```java
public class CompositePattern {

    public static void main(String[] args) {
        Composite root = new Composite("root");
        root.Add(new Leaf("Leaf A"));
        root.Add(new Leaf("Leaf B"));

        Composite compX = new Composite("Composite X");
        compX.Add(new Leaf("Leaf XA"));
        compX.Add(new Leaf("Leaf XB"));
        root.Add(compX);

        Composite compXY = new Composite("Composite XY");
        compXY.Add(new Leaf("Leaf XYA"));
        compXY.Add(new Leaf("Leaf XYB"));
        compX.Add(compXY);

        root.Display(1);
    }

}
```

## Pseudocode

Trong ví dụ này, chúng ta sẽ sử dụng Composite Pattern để giúp bạn triển khai một loạt các hình học trong trình chỉnh sửa đồ họa.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20231006161239.png)

Giao diện `Graphic` định nghĩa các hoạt động chung của các thành phần đơn giản và thành phần phức tạp trong cây. Nó quản lý một tham chiếu đến đối tượng "thực hiện" trong cấu trúc và chuyển tiếp tất cả công việc thực tế cho đối tượng đó.

Thông qua giao diện chung của tất cả các lớp đồ họa, mã khách hàng có thể tương tác với tất cả các đối tượng đồ họa. Do đó, mã khách hàng không biết liệu nó đang tương tác với thành phần đơn giản hay thành phần phức tạp trong cây. Mã khách hàng có thể tương tác với cấu trúc đối tượng rất phức tạp mà không cần phụ thuộc chặt chẽ vào các lớp cấu thành của nó.

Trong mã giả, giao diện `Graphic` định nghĩa các phương thức chung cho tất cả các thành phần. Lớp `Leaf` đại diện cho các thành phần lá, và lớp `Composite` đại diện cho các thành phần tổ hợp. Lớp `Client` trình bày cách sử d

```java
// Giao diện Graphic khai báo các hoạt động chung của đối tượng đơn giản và phức tạp trong thành phần.
interface Graphic is
    method move(x, y)
    method draw()

// Lớp nút lá đại diện cho đối tượng cuối cùng trong thành phần. Đối tượng nút lá không thể chứa bất kỳ đối tượng con nào. Đối tượng nút lá thường thực hiện công việc thực tế, trong khi đối tượng thành phần chỉ chuyển công việc cho các thành phần con của nó.
class Dot implements Graphic is
    field x, y

    constructor Dot(x, y) { ... }

    method move(x, y) is
        this.x += x, this.y += y

    method draw() is
        // Vẽ một điểm tại vị trí (X,Y).

// Tất cả các lớp thành phần có thể mở rộng thành phần khác.
class Circle extends Dot is
    field radius

    constructor Circle(x, y, radius) { ... }

    method draw() is
        // Vẽ một hình tròn có bán kính R tại vị trí (X,Y).

// Lớp thành phần đại diện cho thành phần phức tạp có thể chứa các thành phần con. Đối tượng thành phần thường chuyển công việc thực tế cho các thành phần con của nó và sau đó "tổng hợp" kết quả.
class CompoundGraphic implements Graphic is
    field children: mảng các Graphic

    // Đối tượng thành phần có thể thêm hoặc xóa thành phần khác (đơn giản hoặc phức tạp) trong danh sách các thành phần của nó.
    method add(child: Graphic) is
        // Thêm một thành phần vào mảng các thành phần con.

    method remove(child: Graphic) is
        // Xóa một thành phần khỏi mảng các thành phần con.

    method move(x, y) is
        foreach (child in children) do
            child.move(x, y)

    // Thành phần tổng hợp thực hiện logic chính của nó theo một cách cụ thể. Nó sẽ duyệt qua tất cả các thành phần con và thu thập và tổng hợp kết quả của chúng. Vì các thành phần con của thành phần tổng hợp cũng sẽ chuyển cuộc gọi cho các thành phần con của chúng, và cứ như vậy, cuối cùng thành phần tổng hợp sẽ hoàn thành việc duyệt qua toàn bộ cây đối tượng.
    method draw() is
        // 1. Đối với mỗi thành phần con:
        //     - Vẽ thành phần đó.
        //     - Cập nhật tọa độ viền.
        // 2. Vẽ một hình chữ nhật đường kẻ theo tọa độ viền.

// Mã khách hàng tương tác với tất cả các thành phần thông qua giao diện cơ bản. Như vậy, mã khách hàng có thể hỗ trợ đồng thời cả các thành phần nút lá đơn giản và các thành phần phức tạp.
class ImageEditor is
    field all: CompoundGraphic

    method load() is
        all = new CompoundGraphic()
        all.add(new Dot(1, 2))
        all.add(new Circle(5, 3, 10))
        // ...

    // Kết hợp các thành phần cần thiết thành một thành phần phức tạp.
    method groupSelected(components: mảng các Graphic) is
        group = new CompoundGraphic()
        foreach (component in components) do
            group.add(component)
            all.remove(component)
        all.add(group)
        // Tất cả các thành phần sẽ được vẽ.
        all.draw()
```

## Ví dụ

**Ứng dụng thực tế:** Composite Pattern rất phổ biến trong mã Java, thường được sử dụng để đại diện cho các thành phần giao diện người dùng hoặc cấu trúc mã có liên quan đến đồ họa.

Dưới đây là một số ví dụ về Composite từ thư viện chương trình tiêu chuẩn của Java:

- [`java.awt.Container#add(Component)`](http://docs.oracle.com/javase/8/docs/api/java/awt/Container.html#add-java.awt.Component-) (phổ biến trong các thành phần Swing)
- [`javax.faces.component.UIComponent#getChildren()`](http://docs.oracle.com/javaee/7/api/javax/faces/component/UIComponent.html#getChildren--) (phổ biến trong các thành phần UI JSF)

**Cách nhận biết:** Composite có thể dễ dàng nhận biết bằng cách đặt các phiên bản cùng một loại trừu tượng hoặc giao diện vào các phương thức hành vi của cấu trúc cây.

## Mối quan hệ với các mẫu khác

## Mối quan hệ với các mẫu khác

- Giao diện của [Bridge Pattern]], [[State Pattern]] và [[Strategy Pattern]] (bao gồm một phần [[Adapter Pattern]]) rất giống nhau. Thực tế, chúng đều dựa trên [[Composite Pattern]] - tức là giao việc cho các đối tượng khác, nhưng cũng giải quyết các vấn đề khác nhau. Mẫu không chỉ là công thức sắp xếp mã theo một cách cụ thể, bạn cũng có thể sử dụng chúng để thảo luận với các nhà phát triển khác về vấn đề mà mẫu giải quyết.
- Bạn có thể sử dụng [[Builder Pattern]] khi tạo ra cây [[Composite Pattern]] phức tạp, vì điều này cho phép xây dựng cây theo cách đệ quy.
- [[Chain of Responsibility Pattern]] thường được kết hợp với [[Composite Pattern]]. Trong trường hợp này, các thành phần lá có thể chuyển tiếp yêu cầu qua chuỗi chứa tất cả các thành phần cha.
- Bạn có thể sử dụng [[Iterator Pattern]] để duyệt qua cây [[Composite Pattern]].
- Bạn có thể sử dụng [[Visitor Pattern]] để thực hiện các hoạt động trên toàn bộ cây [[Composite Pattern]].
- Bạn có thể sử dụng [[Flyweight Pattern]] để chia sẻ các nút lá trong cây [tổ hợp Pattern]] và tiết kiệm bộ nhớ.
- Cấu trúc của [[Composite Pattern]] và [[Decorator Pattern]] rất giống nhau, vì cả hai đều dựa trên tổ hợp đệ quy để tổ chức một số lượng vô hạn các đối tượng.
  - *Decorator* tương tự như *Composite*, nhưng chỉ có một thành phần con. Ngoài ra, có một sự khác biệt rõ ràng: *Decorator* thêm các trách nhiệm bổ sung cho đối tượng được đóng gói, trong khi *Composite* chỉ tổng hợp kết quả của các nút con.
  - Tuy nhiên, các mẫu cũng có thể cộng tác với nhau: bạn có thể sử dụng *Decorator* để mở rộng hành vi của một đối tượng cụ thể trong cây *Composite*.
- Thiết kế sử dụng nhiều *Composite* và *Decorator* thường có lợi từ việc sử dụng [[Prototype Pattern]]. Bạn có thể sao chép cấu trúc phức tạp bằng cách sử dụng mô hình này thay vì xây dựng lại từ đầu.
