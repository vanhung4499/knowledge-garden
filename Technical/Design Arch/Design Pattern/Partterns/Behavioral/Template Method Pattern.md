---
title: Template Method Pattern
tags:
  - design-pattern
categories:
  - design-pattern
date created: 2023-10-06
date modified: 2024-03-250-06
---

# Template Method Pattern

## Ý nghĩa

**Template Method Pattern** là một mẫu thiết kế hành vi, nó định nghĩa một khung của một thuật toán trong lớp cha và cho phép các lớp con ghi đè các bước cụ thể của thuật toán mà không làm thay đổi cấu trúc.

Template Method Pattern là một trong những mẫu thiết kế phổ biến nhất, nó là một kỹ thuật cơ bản của việc tái sử dụng mã dựa trên kế thừa. Trong sơ đồ lớp của Template Method Pattern, chỉ có mối quan hệ kế thừa.

Template Method Pattern yêu cầu sự cộng tác giữa nhà thiết kế của lớp trừu tượng và các lớp con cụ thể. Một nhà thiết kế đảm nhận việc xác định khung của thuật toán, tức là triển khai tất cả các phương thức cần thiết cho thuật toán.

- Các phương thức chung được đặt trong phương thức cụ thể của lớp cha.
- Các phương thức cụ thể của từng lớp con được đặt trong phương thức cụ thể của lớp con đó. Tuy nhiên, lớp cha phải có các phương thức trừu tượng tương ứng.

Phương thức kết nối có thể cho phép lớp con quyết định xem có nên kết nối các điểm khác nhau của thuật toán hay không.

## Ứng dụng

- Khi bạn chỉ muốn mở rộng một bước cụ thể của thuật toán, mà không phải toàn bộ thuật toán hoặc cấu trúc của nó, bạn có thể sử dụng Template Method Pattern.
- Khi các thuật toán của nhiều lớp chỉ khác nhau một chút, bạn có thể sử dụng mẫu thiết kế này. Tuy nhiên, hậu quả của việc này là khi thuật toán thay đổi, bạn có thể phải sửa đổi tất cả các lớp.

## Cấu trúc

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210517201945.png)

### Giải thích cấu trúc

1. **Lớp trừu tượng** (Abstract Class) khai báo và triển khai một Template Method. Template Method này xác định cấu trúc của thuật toán và gọi các phương thức cụ thể tương ứng. Các bước thuật toán có thể được khai báo là kiểu trừu tượng hoặc có thể cung cấp một số triển khai mặc định.
2. **Lớp cụ thể** (Concrete Class) có thể ghi đè tất cả các bước hoặc một số bước của thuật toán, nhưng không thể ghi đè Template Method chính.

### Mẫu mã cấu trúc

**AbstractClass**: Lớp trừu tượng, định nghĩa và triển khai một Template Method. Template Method này xác định cấu trúc của thuật toán, trong đó các bước logic được hoãn lại để các lớp con triển khai. Phương thức cấp cao cũng có thể gọi các phương thức cụ thể.

```java
abstract class AbstractClass {
    public abstract void PrimitiveOperation1();
    public abstract void PrimitiveOperation2();

    public void TemplateMethod() {
        PrimitiveOperation1();
        PrimitiveOperation2();
    }
}
```

**ConcreteClass**: Triển khai một hoặc nhiều phương thức trừu tượng của lớp cha.

```java
class ConcreteClassA extends AbstractClass {
    @Override
    public void PrimitiveOperation1() {
        System.out.println("Phương thức cụ thể của lớp A 1");
    }

    @Override
    public void PrimitiveOperation2() {
        System.out.println("Phương thức cụ thể của lớp A 2");
    }
}

class ConcreteClassB extends AbstractClass {
    @Override
    public void PrimitiveOperation1() {
        System.out.println("Phương thức cụ thể của lớp B 1");
    }

    @Override
    public void PrimitiveOperation2() {
        System.out.println("Phương thức cụ thể của lớp B 2");
    }
}
```

Khách hàng

```java
public class TemplateMethodPattern {
    public static void main(String[] args) {
        AbstractClass objA = new ConcreteClassA();
        AbstractClass objB = new ConcreteClassB();
        objA.TemplateMethod();
        objB.TemplateMethod();
    }
}
```

## Pseudocode

Trong ví dụ này, Template Method Pattern được sử dụng để cung cấp một "khung" cho các nhánh AI khác nhau trong một trò chơi chiến thuật đơn giản.

![Cấu trúc ví dụ Template Method Pattern](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210517202308.png)

Một lớp AI cho trò chơi đơn giản.

Tất cả các chủng tộc trong trò chơi đều có các đơn vị và công trình gần như giống nhau. Do đó, bạn có thể tái sử dụng cấu trúc AI giống nhau trên các chủng tộc khác nhau, đồng thời vẫn cần khả năng ghi đè một số chi tiết. Bằng cách này, bạn có thể ghi đè AI của Orcs để làm nó tấn công hơn, hoặc làm cho con người tập trung vào phòng thủ, hoặc ngăn chặn quá trình xây dựng công trình của quái vật. Để thêm một chủng tộc mới vào trò chơi, bạn cần tạo một lớp con AI mới và ghi đè các phương thức mặc định được khai báo trong lớp cơ sở AI.

```java
// Lớp trừu tượng định nghĩa một Template Method, trong đó thường bao gồm một số hoạt động nguyên tắc trừu tượng. Các lớp con sẽ triển khai các hoạt động này, nhưng không thể thay đổi Template Method chính.
class GameAI is
    // Template Method xác định cấu trúc của một thuật toán.
    method turn() is
        collectResources()
        buildStructures()
        buildUnits()
        attack()

    // Một số bước có thể được triển khai trực tiếp trong lớp cơ sở.
    method collectResources() is
        foreach (s in this.builtStructures) do
            s.collect()

    // Một số bước có thể được khai báo là trừu tượng.
    abstract method buildStructures()
    abstract method buildUnits()

    // Một lớp có thể chứa nhiều Template Method.
    method attack() is
        enemy = closestEnemy()
        if (enemy == null)
            sendScouts(map.center)
        else
            sendWarriors(enemy.position)

    abstract method sendScouts(position)
    abstract method sendWarriors(position)

// Lớp cụ thể phải triển khai tất cả các hoạt động trừu tượng trong lớp cơ sở.
class OrcsAI extends GameAI is
    method buildStructures() is
        if (there are some resources) then
            // Xây dựng farm, sau đó là kho chứa, sau đó là pháo đài.

    method buildUnits() is
        if (there are plenty of resources) then
            if (there are no scouts)
                // Xây dựng công nhân và thêm vào nhóm trinh sát.
            else
                // Xây dựng lính orc và thêm vào nhóm chiến binh.

    // ...

    method sendScouts(position) is
        if (scouts.length > 0) then
            // Gửi nhóm trinh sát đến vị trí chỉ định.

    method sendWarriors(position) is
        if (warriors.length > 5) then
            // Gửi nhóm chiến binh đến vị trí chỉ định.

// Lớp con có thể ghi đè một số hoạt động mặc định.
class MonstersAI extends GameAI is
    method collectResources() is
        // Quái vật không thu thập tài nguyên.

    method buildStructures() is
        // Quái vật không xây dựng công trình.

    method buildUnits() is
        // Quái vật không xây dựng đơn vị.
```

## Ví dụ

Template Method Pattern được áp dụng rộng rãi trong nhiều tình huống.

Trong chương về Template Method Pattern trong sách "Head First", có một ví dụ rất đặc trưng.

Trong cuộc sống hàng ngày, trà và cà phê là những loại đồ uống phổ biến. Quá trình pha trà và pha cà phê như thế nào?

Hãy xem xét quy trình.

- Pha trà: Đun nước sôi ==> Ngâm lá trà ==> Rót vào cốc ==> Thêm chanh
- Pha cà phê: Đun nước sôi ==> Pha cà phê ==> Rót vào cốc ==> Thêm đường và sữa

Từ các bước xử lý trên, dễ thấy quy trình chuẩn bị đồ uống này rất tương tự nhau. Chúng ta có thể sử dụng Template Method để xác định cấu trúc của thuật toán pha đồ uống.

Các bước chung và có tính chất chung (ví dụ: đun nước sôi, rót vào cốc) được thực hiện trong phương thức cụ thể của lớp trừu tượng.

Các bước có sự khác biệt được thực hiện trong các lớp cụ thể tương ứng. Tuy nhiên, lớp trừu tượng phải có các phương thức trừu tượng tương ứng.

【Lớp trừu tượng】

```java
abstract class Beverage {

    // Template Method, xác định cấu trúc của thuật toán. Tương đương với phương thức TemplateMethod()
    public void prepareBeverage() {
        boilWater();
        brew();
        pourInCup();
        if (customWantsCondiments())
        {
            addCondiments();
        }
    }

    // Hoạt động chung, được định nghĩa trực tiếp trong lớp trừu tượng
    public void boilWater() {
        System.out.println("Đun nước sôi");
    }

    // Hoạt động chung, được định nghĩa trực tiếp trong lớp trừu tượng
    public void pourInCup() {
        System.out.println("Rót vào cốc");
    }

    // Phương thức kết nối, quyết định xem một số bước thuật toán có nên được kết nối trong thuật toán hay không
    public boolean customWantsCondiments() {
        return true;
    }

    // Hoạt động đặc biệt, được thực hiện trong lớp con cụ thể
    public abstract void brew();

    // Hoạt động đặc biệt, được thực hiện trong lớp con cụ thể
    public abstract void addCondiments();

}
```

【Lớp cụ thể】

```java
class Tea extends Beverage {

    @Override
    public void brew() {
        System.out.println("Ngâm lá trà");
    }

    @Override
    public void addCondiments() {
        System.out.println("Thêm chanh");
    }

}

class Coffee extends Beverage {

    @Override
    public void brew() {
        System.out.println("Pha cà phê");
    }

    @Override
    public void addCondiments() {
        System.out.println("Thêm đường và sữa");
    }

}
```

【Khách hàng】

```java
public static void main(String[] args) {

    System.out.println("============= Chuẩn bị trà =============");
    Beverage tea = new Tea();
    tea.prepareBeverage();

    System.out.println("============= Chuẩn bị cà phê =============");
    Beverage coffee = new Coffee();
    coffee.prepareBeverage();

}
```

Kết quả

```
============= Chuẩn bị trà =============
Đun nước sôi
Ngâm lá trà
Rót vào cốc
Thêm chanh
============= Chuẩn bị cà phê =============
Đun nước sôi
Pha cà phê
Rót vào cốc
Thêm đường và sữa
```

## Ví dụ thực tế

**Ví dụ sử dụng:** Mẫu Template Method thường được sử dụng trong các framework Java. Nhà phát triển thường sử dụng nó để cung cấp một cách đơn giản để mở rộng chức năng tiêu chuẩn thông qua kế thừa cho người dùng của framework.

Dưới đây là một số ví dụ về Template Method trong các thư viện Java cốt lõi:

- Tất cả các phương thức không trừu tượng của [`java.io.InputStream`](http://docs.oracle.com/javase/8/docs/api/java/io/InputStream.html), [`java.io.OutputStream`](http://docs.oracle.com/javase/8/docs/api/java/io/OutputStream.html), [`java.io.Reader`](http://docs.oracle.com/javase/8/docs/api/java/io/Reader.html) và [`java.io.Writer`](http://docs.oracle.com/javase/8/docs/api/java/io/Writer.html).
- Tất cả các phương thức không trừu tượng của [`java.util.AbstractList`](http://docs.oracle.com/javase/8/docs/api/java/util/AbstractList.html), [`java.util.AbstractSet`](http://docs.oracle.com/javase/8/docs/api/java/util/AbstractSet.html) và [`java.util.AbstractMap`](http://docs.oracle.com/javase/8/docs/api/java/util/AbstractMap.html).
- [`javax.servlet.http.HttpServlet`](http://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpServlet.html), tất cả các phương thức `do­XXX()` mặc định gửi phản hồi lỗi HTTP 405 "Phương thức không được phép". Bạn có thể ghi đè lên chúng bất cứ lúc nào.

**Cách nhận biết:** Template Method có thể được nhận biết thông qua phương thức hành vi, phương thức này đã có một hành vi "mặc định" được định nghĩa trong lớp cơ sở.

### Loại bỏ if … else và mã lặp lại

Giả sử chúng ta muốn phát triển một chức năng giỏ hàng để xử lý khác nhau cho các người dùng khác nhau:

- Người dùng thông thường phải trả phí vận chuyển, phí vận chuyển là 10% giá sản phẩm, không có giảm giá sản phẩm;
- Người dùng VIP cũng phải trả phí vận chuyển 10% giá sản phẩm, nhưng khi mua hai mặt hàng giống nhau trở lên, từ mặt hàng thứ ba trở đi sẽ được giảm giá một số lượng nhất định;
- Người dùng nội bộ có thể miễn phí vận chuyển, không có giảm giá sản phẩm.

#### Phiên bản 1.0 của vấn đề

Giỏ hàng của người dùng thông thường

```java
public class NormalUserCart {

    public Cart process(long userId, Map<Long, Integer> items) {
        Cart cart = new Cart();

        // Chuyển đổi giỏ hàng từ Map thành danh sách Item
        List<Item> itemList = new ArrayList<>();
        items.entrySet().stream().forEach(entry -> {
            Item item = new Item();
            item.setId(entry.getKey());
            item.setPrice(Db.getItemPrice(entry.getKey()));
            item.setQuantity(entry.getValue());
            itemList.add(item);
        });
        cart.setItems(itemList);

        // Xử lý phí vận chuyển và giảm giá sản phẩm
        itemList.stream().forEach(item -> {
            // Phí vận chuyển là 10% tổng giá trị sản phẩm
            item.setDeliveryPrice(
                item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())).multiply(new BigDecimal("0.1")));
            // Không có giảm giá
            item.setCouponPrice(BigDecimal.ZERO);
        });

        // Tính tổng giá trị sản phẩm thuần túy
        cart.setTotalItemPrice(cart.getItems()
            .stream()
            .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add));
        // Tính tổng phí vận chuyển
        cart.setTotalDeliveryPrice(
            cart.getItems().stream().map(Item::getDeliveryPrice).reduce(BigDecimal.ZERO, BigDecimal::add));
        // Tính tổng giảm giá
        cart.setTotalDiscount(
            cart.getItems().stream().map(Item::getCouponPrice).reduce(BigDecimal.ZERO, BigDecimal::add));
        // Tổng số tiền phải trả = tổng giá trị sản phẩm + tổng phí vận chuyển - tổng giảm giá
        cart.setPayPrice(cart.getTotalItemPrice().add(cart.getTotalDeliveryPrice()).subtract(cart.getTotalDiscount()));
        return cart;
    }

}
```

Giỏ hàng của người dùng VIP

```java
public class VipUserCart {

    public Cart process(long userId, Map<Long, Integer> items) {
        Cart cart = new Cart();

        // Chuyển đổi giỏ hàng từ Map thành danh sách Item
        List<Item> itemList = new ArrayList<>();
        items.entrySet().stream().forEach(entry -> {
            Item item = new Item();
            item.setId(entry.getKey());
            item.setPrice(Db.getItemPrice(entry.getKey()));
            item.setQuantity(entry.getValue());
            itemList.add(item);
        });
        cart.setItems(itemList);

        itemList.stream().forEach(item -> {
            // Phí vận chuyển là 10% tổng giá trị sản phẩm
            item.setDeliveryPrice(
                item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())).multiply(new BigDecimal("0.1")));
            // Mua hai mặt hàng giống nhau trở lên, từ mặt hàng thứ ba trở đi sẽ được giảm giá một số lượng nhất định
            if (item.getQuantity() > 2) {
                item.setCouponPrice(item.getPrice()
                    .multiply(BigDecimal.valueOf(100 - Db.getUserCouponPercent(userId)).divide(new BigDecimal("100")))
                    .multiply(BigDecimal.valueOf(item.getQuantity() - 2)));
            } else {
                item.setCouponPrice(BigDecimal.ZERO);
            }
        });

        cart.setTotalItemPrice(cart.getItems()
            .stream()
            .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add));
        cart.setTotalDeliveryPrice(
            cart.getItems().stream().map(Item::getDeliveryPrice).reduce(BigDecimal.ZERO, BigDecimal::add));
        cart.setTotalDiscount(
            cart.getItems().stream().map(Item::getCouponPrice).reduce(BigDecimal.ZERO, BigDecimal::add));
        cart.setPayPrice(cart.getTotalItemPrice().add(cart.getTotalDeliveryPrice()).subtract(cart.getTotalDiscount()));
        return cart;
    }

}
```

Giỏ hàng của người dùng nội bộ

```java
public class InternalUserCart {

    public Cart process(long userId, Map<Long, Integer> items) {
        Cart cart = new Cart();

        // Chuyển đổi giỏ hàng từ Map thành danh sách Item
        List<Item> itemList = new ArrayList<>();
        items.entrySet().stream().forEach(entry -> {
            Item item = new Item();
            item.setId(entry.getKey());
            item.setPrice(Db.getItemPrice(entry.getKey()));
            item.setQuantity(entry.getValue());
            itemList.add(item);
        });
        cart.setItems(itemList);

        itemList.stream().forEach(item -> {
            // Miễn phí vận chuyển
            item.setDeliveryPrice(BigDecimal.ZERO);
            // Không có giảm giá
            item.setCouponPrice(BigDecimal.ZERO);
        });

        cart.setTotalItemPrice(cart.getItems()
            .stream()
            .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add));
        cart.setTotalDeliveryPrice(
            cart.getItems().stream().map(Item::getDeliveryPrice).reduce(BigDecimal.ZERO, BigDecimal::add));
        cart.setTotalDiscount(
            cart.getItems().stream().map(Item::getCouponPrice).reduce(BigDecimal.ZERO, BigDecimal::add));
        cart.setPayPrice(cart.getTotalItemPrice().add(cart.getTotalDeliveryPrice()).subtract(cart.getTotalDiscount()));
        return cart;
    }

}
```

Client

```java
@GetMapping("wrong")
public Cart wrong(@RequestParam("userId") int userId) {
    String userCategory = Db.getUserCategory(userId);

    if (userCategory.equals("Normal")) {
        NormalUserCart normalUserCart = new NormalUserCart();
        return normalUserCart.process(userId, items);
    }

    if (userCategory.equals("Vip")) {
        VipUserCart vipUserCart = new VipUserCart();
        return vipUserCart.process(userId, items);
    }

    if (userCategory.equals("Internal")) {
        InternalUserCart internalUserCart = new InternalUserCart();
        return internalUserCart.process(userId, items);
    }

    return null;
}
```

> So sánh mã, chúng ta có thể thấy rằng 70% mã của ba loại giỏ hàng là trùng lặp. Lý do rất đơn giản, mặc dù cách tính phí vận chuyển và giảm giá khác nhau cho các người dùng khác nhau, nhưng logic khởi tạo giỏ hàng, tính tổng giá trị, tổng phí vận chuyển, tổng giảm giá và giá thanh toán của toàn bộ giỏ hàng đều giống nhau.

#### Phiên bản đã sửa

Vấn đề của phiên bản 1.0 là: cùng một đoạn mã nên chỉ xuất hiện ở một nơi.

Nếu chúng ta đã hiểu rõ định nghĩa của lớp trừu tượng và phương thức trừu tượng, có thể nghĩ đến việc có thể định nghĩa đoạn mã lặp lại trong lớp trừu tượng và chỉ cần triển khai phần mã khác nhau cho ba giỏ hàng?

Thực tế, mẫu thiết kế này chính là mẫu Template Method.

> Dưới đây là phiên bản tối ưu dựa trên mẫu thiết kế Factory + Template Method.

【Lớp trừu tượng】

```java
public abstract class AbstractCart {

    public Cart process(long userId, Map<Long, Integer> items) {

        Cart cart = new Cart();

        List<Item> itemList = new ArrayList<>();
        items.entrySet().stream().forEach(entry -> {
            Item item = new Item();
            item.setId(entry.getKey());
            item.setPrice(Db.getItemPrice(entry.getKey()));
            item.setQuantity(entry.getValue());
            itemList.add(item);
        });
        cart.setItems(itemList);

        itemList.stream().forEach(item -> {
            processCouponPrice(userId, item);
            processDeliveryPrice(userId, item);
        });

        cart.setTotalItemPrice(cart.getItems()
            .stream()
            .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add));
        cart.setTotalDeliveryPrice(
            cart.getItems().stream().map(Item::getDeliveryPrice).reduce(BigDecimal.ZERO, BigDecimal::add));
        cart.setTotalDiscount(
            cart.getItems().stream().map(Item::getCouponPrice).reduce(BigDecimal.ZERO, BigDecimal::add));
        cart.setPayPrice(cart.getTotalItemPrice().add(cart.getTotalDeliveryPrice()).subtract(cart.getTotalDiscount()));
        return cart;
    }

    protected abstract void processCouponPrice(long userId, Item item);

    protected abstract void processDeliveryPrice(long userId, Item item);

}
```

Giỏ hàng của người dùng thông thường

```java
@Service(value = "NormalUserCart")
public class NormalUserCart extends AbstractCart {

    @Override
    protected void processCouponPrice(long userId, Item item) {
        item.setCouponPrice(BigDecimal.ZERO);
    }

    @Override
    protected void processDeliveryPrice(long userId, Item item) {
        item.setDeliveryPrice(item.getPrice()
            .multiply(BigDecimal.valueOf(item.getQuantity()))
            .multiply(new BigDecimal("0.1")));
    }

}
```

Giỏ hàng của người dùng VIP

```java
@Service(value = "VipUserCart")
public class VipUserCart extends NormalUserCart {

    @Override
    protected void processCouponPrice(long userId, Item item) {
        if (item.getQuantity() > 2) {
            item.setCouponPrice(item.getPrice()
                .multiply(BigDecimal.valueOf(100 - Db.getUserCouponPercent(userId)).divide(new BigDecimal("100")))
                .multiply(BigDecimal.valueOf(item.getQuantity() - 2)));
        } else {
            item.setCouponPrice(BigDecimal.ZERO);
        }
    }

}
```

Giỏ hàng của người dùng nội bộ

```java
@Service(value = "InternalUserCart")
public class InternalUserCart extends AbstractCart {

    @Override
    protected void processCouponPrice(long userId, Item item) {
        item.setCouponPrice(BigDecimal.ZERO);
    }

    @Override
    protected void processDeliveryPrice(long userId, Item item) {
        item.setDeliveryPrice(BigDecimal.ZERO);
    }

}
```

Client

```java
@GetMapping("right")
public Cart right(@RequestParam("userId") int userId) {
    String userCategory = Db.getUserCategory(userId);
    AbstractCart cart = (AbstractCart) applicationContext.getBean(userCategory + "UserCart");
    return cart.process(userId, items);
}
```

## Mối quan hệ với các mẫu khác

- [[Factory Method Pattern]] là một dạng đặc biệt của [[Template Method Pattern]]. Đồng thời, *Factory Method* có thể là một bước trong một *Template Method* lớn hơn.
- [[Template Method Pattern]] dựa trên cơ chế kế thừa: nó cho phép bạn thay đổi một phần của thuật toán bằng cách mở rộng nội dung của lớp con. [[Strategy Pattern]] dựa trên cơ chế tổ hợp: bạn có thể thay đổi một phần hành vi của đối tượng bằng cách cung cấp các chiến lược khác nhau cho hành vi tương ứng. *Template Method* hoạt động trên cấp độ lớp, do đó nó là tĩnh. *Strategy* hoạt động trên cấp độ đối tượng, cho phép thay đổi hành vi trong thời gian chạy.
