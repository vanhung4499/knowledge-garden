---
title: Flyweight Pattern
tags: 
categories: 
date created: 2023-10-06
date modified: 2023-10-06
---

# Mẫu thiết kế Flyweight

## Ý nghĩa

**Flyweight Pattern** là một mẫu thiết kế cấu trúc, nó loại bỏ cách lưu trữ tất cả dữ liệu trong mỗi đối tượng bằng cách chia sẻ trạng thái chung giữa nhiều đối tượng, cho phép bạn tải nhiều đối tượng hơn trong một dung lượng bộ nhớ hạn chế.

## Ứng dụng

- Sử dụng Flyweight Pattern chỉ khi chương trình phải hỗ trợ một lượng lớn đối tượng và không đủ dung lượng bộ nhớ.

## Cấu trúc

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210430182947.png)

### Giải thích cấu trúc

1. Flyweight Pattern chỉ là một phương pháp tối ưu hóa. Trước khi áp dụng mẫu này, bạn phải xác định vấn đề về tiêu thụ bộ nhớ liên quan đến việc cùng lúc sử dụng nhiều đối tượng tương tự và đảm bảo rằng vấn đề này không thể được giải quyết bằng cách khác.
2. Lớp **Flyweight** chứa một phần trạng thái chung trong các đối tượng gốc. Cùng một đối tượng Flyweight có thể được sử dụng trong nhiều tình huống khác nhau. Trạng thái được lưu trữ trong Flyweight được gọi là "trạng thái nội tại". Trạng thái được truyền vào phương thức Flyweight được gọi là "trạng thái bên ngoài".
3. Lớp **Context** chứa trạng thái bên ngoài khác nhau của đối tượng gốc. Context kết hợp với đối tượng Flyweight để đại diện cho toàn bộ trạng thái của đối tượng gốc.
4. Thông thường, hành vi của đối tượng gốc được giữ trong lớp Flyweight. Do đó, việc gọi phương thức Flyweight phải cung cấp một số trạng thái bên ngoài làm tham số. Tuy nhiên, bạn cũng có thể di chuyển hành vi vào lớp Context, sau đó xem Flyweight kết nối như một đối tượng dữ liệu thuần túy.
5. **Client** chịu trách nhiệm tính toán hoặc lưu trữ trạng thái bên ngoài của Flyweight. Đối với khách hàng, Flyweight là một mẫu đối tượng mà có thể được cấu hình tại thời điểm chạy bằng cách truyền một số dữ liệu tình huống vào phương thức của nó.
6. **Flyweight Factory** quản lý bể cache của Flyweight đã có. Có Factory, khách hàng không cần tạo Flyweight trực tiếp, chỉ cần gọi Factory và truyền vào một số trạng thái nội tại của Flyweight mục tiêu. Factory sẽ tìm kiếm trong các Flyweight đã tạo trước đó dựa trên tham số và trả về nếu tìm thấy; nếu không tìm thấy, nó sẽ tạo mới Flyweight dựa trên tham số.

### Mẫu code cấu trúc

**Flyweight**: Nó là lớp cha hoặc giao diện của tất cả các lớp Flyweight cụ thể, thông qua giao diện này, Flyweight có thể chấp nhận và tác động lên trạng thái bên ngoài.

```java
abstract class Flyweight {
    public abstract void operation(int extrinsicstates);
}
```

**ConcreteFlyweight**: Là lớp con của Flyweight hoặc triển khai giao diện Flyweight, và tăng thêm không gian lưu trữ cho trạng thái nội tại.

```java
class ConcreteFlyweight extends Flyweight {
    @Override
    public void operation(int extrinsicstates) {
        System.out.println("Flyweight được chia sẻ: " + extrinsicstates);
    }
}
```

**UnsharedConcreteFlyweight**: Đề cập đến những lớp Flyweight con không cần chia sẻ, vì giao diện Flyweight cho phép chia sẻ, nhưng nó không bắt buộc chia sẻ.

```java
class UnsharedConcreteFlyweight extends Flyweight {
    @Override
    public void operation(int extrinsicstates) {
        System.out.println("Flyweight không được chia sẻ: " + extrinsicstates);
    }
}
```

**FlywightFactory**: Là một nhà máy Flyweight, được sử dụng để tạo và quản lý các đối tượng Flyweight. Nó chủ yếu để đảm bảo việc chia sẻ Flyweight một cách hợp lý, khi người dùng yêu cầu một Flyweight, đối tượng FlyweightFactory cung cấp một phiên bản đã tạo trước hoặc tạo mới (nếu đối tượng không tồn tại).

```java
class FlywightFactory {
    private Hashtable<String, Flyweight> flyweights = new Hashtable<String, Flyweight>();

    public FlywightFactory() {
        flyweights.put("X", new ConcreteFlyweight());
        flyweights.put("Y", new ConcreteFlyweight());
        flyweights.put("Z", new ConcreteFlyweight());
    }

    public Flyweight getFlyweight(String key) {
        return ((Flyweight)flyweights.get(key));
    }
}
```

**Client**

```java
public class FlyweightPattern {
    public static void main(String[] args) {
        int extrinsicstates = 1;
        FlywightFactory factory = new FlywightFactory();

        Flyweight fx = factory.getFlyweight("X");
        fx.operation(extrinsicstates);

        Flyweight fy = factory.getFlyweight("Y");
        fy.operation(++extrinsicstates);

        Flyweight fz = factory.getFlyweight("Z");
        fz.operation(++extrinsicstates);

        Flyweight uf = new UnsharedConcreteFlyweight();
        uf.operation(++extrinsicstates);
    }
}
```

**Output**

```
Flyweight được chia sẻ: 1
Flyweight được chia sẻ: 2
Flyweight được chia sẻ: 3
Flyweight không được chia sẻ: 4
```

## Pseudocode

Trong ví dụ này, **Flyweight Pattern** giúp giảm thiểu lượng bộ nhớ cần thiết khi vẽ hàng triệu đối tượng cây trên bề mặt.

Mẫu này trích xuất trạng thái nội tại từ lớp chính `Cây` và di chuyển nó vào lớp Flyweight `Loại cây`.

Ban đầu, chương trình cần lưu trữ dữ liệu giống nhau trong nhiều đối tượng, nhưng bây giờ chỉ cần lưu trữ dữ liệu trong một số đối tượng Flyweight và sau đó kết nối chúng vào đối tượng `Cây` như một tình huống. Mã khách hàng sử dụng Flyweight Factory để tạo đối tượng cây và đóng gói hành vi phức tạp của việc tìm kiếm đối tượng cụ thể, và có thể tái sử dụng đối tượng khi cần thiết.

```java
// Lớp Flyweight chứa một phần trạng thái của cây. Các biến thành viên này lưu trữ các giá trị duy nhất đối với cây cụ thể. Ví dụ, bạn sẽ không tìm thấy tọa độ của cây ở đây. Nhưng bạn sẽ tìm thấy các dữ liệu chung như mẫu và màu sắc giữa nhiều cây. Vì dữ liệu này thường có kích thước lớn, nếu lưu trữ chúng trong mỗi cây sẽ tốn rất nhiều bộ nhớ. Vì vậy, bạn có thể xuất dữ liệu mẫu, màu sắc và các dữ liệu lặp lại khác vào một đối tượng riêng biệt, sau đó cho phép nhiều đối tượng cây đơn lẻ tham chiếu đến nó.
class TreeType is
    field name
    field color
    field texture
    constructor TreeType(name, color, texture) { ... }
    method draw(canvas, x, y) is
        // 1. Tạo một bitmap cho loại cây, màu sắc và mẫu cụ thể.
        // 2. Vẽ bitmap tại tọa độ (X, Y) trên bề mặt.

// Flyweight Factory quyết định xem có tái sử dụng Flyweight hiện có hay tạo một đối tượng mới.
class TreeFactory is
    static field treeTypes: collection of tree types
    static method getTreeType(name, color, texture) is
        type = treeTypes.find(name, color, texture)
        if (type == null)
            type = new TreeType(name, color, texture)
            treeTypes.add(type)
        return type

// Lớp Context chứa phần trạng thái bên ngoài của cây. Chương trình có thể tạo hàng tỷ đối tượng như vậy vì chúng có kích thước nhỏ: chỉ có hai tọa độ nguyên và một biến thành viên tham chiếu.
class Tree is
    field x,y
    field type: TreeType
    constructor Tree(x, y, type) { ... }
    method draw(canvas) is
        type.draw(canvas, this.x, this.y)

// Lớp Tree và Forest là khách hàng của Flyweight. Nếu bạn không có kế hoạch mở rộng lớp Tree, bạn có thể kết hợp chúng.
class Forest is
    field trees: collection of Trees

    method plantTree(x, y, name, color, texture) is
        type = TreeFactory.getTreeType(name, color, texture)
        tree = new Tree(x, y, type)
        trees.add(tree)

    method draw(canvas) is
        foreach (tree in trees) do
            tree.draw(canvas)
```

## Ví dụ

**Ví dụ sử dụng:** Flyweight Pattern chỉ có một mục đích: giảm thiểu lượng bộ nhớ tiêu thụ. Nếu chương trình của bạn không gặp vấn đề về dung lượng bộ nhớ không đủ, bạn có thể tạm thời bỏ qua mẫu này.

Ví dụ về Flyweight Pattern trong thư viện Java cốt lõi:

- [`java.lang.Integer#valueOf(int)`](http://docs.oracle.com/javase/8/docs/api/java/lang/Integer.html#valueOf-int-) (cũng như [`Boolean`](http://docs.oracle.com/javase/8/docs/api/java/lang/Boolean.html#valueOf-boolean-)、 [`Byte`](http://docs.oracle.com/javase/8/docs/api/java/lang/Byte.html#valueOf-byte-)、 [`Character`](http://docs.oracle.com/javase/8/docs/api/java/lang/Character.html#valueOf-char-)、 [`Short`](http://docs.oracle.com/javase/8/docs/api/java/lang/Short.html#valueOf-short-)、 [`Long`](http://docs.oracle.com/javase/8/docs/api/java/lang/Long.html#valueOf-long-) và [`Big­Decimal`](https://docs.oracle.com/javase/8/docs/api/java/math/BigDecimal.html#valueOf-long-int-))

**Cách nhận biết:** Flyweight có thể được nhận biết thông qua phương thức xây dựng, nó trả về đối tượng cache thay vì tạo đối tượng mới.

## Mối quan hệ với các mẫu khác

- Bạn có thể sử dụng [[Flyweight Pattern]] để triển khai các nút lá được chia sẻ trong [[Composite Pattern]] để tiết kiệm bộ nhớ.
- [[Flyweight Pattern]] cho thấy cách tạo ra nhiều đối tượng nhỏ, trong khi mẫu [[Facade Pattern]] cho thấy cách sử dụng một đối tượng để đại diện cho toàn bộ hệ thống con.
- Nếu bạn có thể đơn giản hóa tất cả trạng thái chia sẻ của đối tượng thành một đối tượng Flyweight, thì [[Flyweight Pattern]] sẽ trở nên giống với [[Singleton Pattern]]. Tuy nhiên, hai mẫu này có hai khác biệt cơ bản.
  1. Chỉ có một thực thể duy nhất của Singleton, trong khi lớp Flyweight có thể có nhiều thực thể và trạng thái nội tại của chúng cũng có thể khác nhau.
  2. Đối tượng Singleton có thể thay đổi, trong khi đối tượng Flyweight là không thay đổi.
