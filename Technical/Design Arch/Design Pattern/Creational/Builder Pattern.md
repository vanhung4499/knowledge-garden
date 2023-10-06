---
title: Builder Pattern
tags:
  - design-pattern
categories:
  - design-pattern
date created: 2023-10-06
date modified: 2023-10-06
---

## Ý tưởng

**Builder Pattern** (Builder Pattern) là một mẫu thiết kế tạo đối tương (creational design pattern), cho phép bạn tạo ra các đối tượng phức tạp bằng cách xây dựng chúng theo từng bước. Mẫu thiết kế này cho phép bạn sử dụng cùng một mã tạo ra các đối tượng khác nhau về loại và hình thức.

Bằng cách sử dụng Builder Pattern, người dùng chỉ cần chỉ định loại đối tượng cần tạo, không cần biết về quá trình xây dựng cụ thể và chi tiết.

Builder Pattern cho phép thay đổi cách biểu diễn nội bộ của một sản phẩm.

Nó tách biệt mã xây dựng và mã biểu diễn.

Nó kiểm soát quá trình xây dựng một cách tốt.

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20200724105836.png)

Giải thích quy trình Builder Pattern:

1. Client tạo đối tượng Director và cấu hình các đối tượng Builder cần thiết.
2. Director chịu trách nhiệm thông báo cho builder khi nào cần xây dựng các thành phần của sản phẩm.
3. Builder xử lý yêu cầu từ director và thêm các thành phần của sản phẩm.
4. Client nhận được sản phẩm từ builder.

## Tình huống sử dụng

- Sử dụng Builder Pattern để tránh việc sử dụng "hàm tạo chồng chéo (telescopic constructor)".
- Khi bạn muốn sử dụng mã để tạo ra các sản phẩm khác nhau về hình thức.
- Sử dụng Builder Pattern để xây dựng cây hợp thành hoặc các đối tượng phức tạp khác.

## Cấu trúc

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20210506090518.png)

1. **Builder** (Builder) là một giao diện khai báo các bước xây dựng sản phẩm chung cho tất cả các loại builder.
2. **Concrete Builder** (Concrete Builders) cung cấp các cài đặt khác nhau cho quá trình xây dựng. Concrete Builder cũng có thể xây dựng các sản phẩm không tuân theo giao diện chung.
3. **Product** (Sản phẩm) là đối tượng cuối cùng được tạo ra. Sản phẩm được xây dựng bởi các builder khác nhau không cần phải thuộc cùng một cấu trúc lớp hoặc giao diện.
4. **Director** (Người chỉ đạo) lớp xác định thứ tự gọi các bước xây dựng, cho phép bạn tạo và tái sử dụng cấu hình sản phẩm cụ thể.
5. **Client** (Khách hàng) phải liên kết một đối tượng builder với lớp Director. Thông thường, bạn chỉ cần liên kết một lần thông qua tham số của phương thức khởi tạo của Director. Tuy nhiên, còn một cách khác để chuyển đối tượng builder cho phương thức xây dựng của Director mỗi lần bạn muốn tạo một sản phẩm với builder khác nhau.

**Product** (Sản phẩm) là một lớp đại diện cho sản phẩm, được tạo thành từ nhiều thành phần.

```java
class Product {
    List<String> parts = new ArrayList<String>();

    public void AddPart(String part) {
        parts.add(part);
    }

    public void show() {
        System.out.println("============== Tạo sản phẩm ==============");
        for (String part : parts) {
            System.out.println(part);
        }
    }
}
```

**Builder**

Builder là một giao diện trừu tượng, xác định các phương thức xây dựng các thành phần của sản phẩm A, B và C, và khai báo phương thức getResult để nhận kết quả xây dựng sản phẩm.

```java
interface Builder {
    public void buildPartA();
    public void buildPartB();
    public void buildPartC();
    public Product getResult();
}
```

**ConcreteBuilder**

ConcreteBuilder triển khai các phương thức cụ thể của Builder.

```java
class ConcreteBuilder implements Builder {
    private Product product = new Product();

    @Override
    public void buildPartA() {
        product.AddPart("Phần A");
    }

    @Override
    public void buildPartB() {
        product.AddPart("Phần B");
    }

    @Override
    public void buildPartC() {
        product.AddPart("Phần C");
    }

    @Override
    public Product getResult() {
        return product;
    }
}
```

**Director**

Director là lớp điều hành, điều hướng quá trình xây dựng sản phẩm (điều khiển thứ tự xây dựng các thành phần).

```java
class Director {
    public void construct(Builder builder) {
        builder.buildPartC();
        builder.buildPartA();
        builder.buildPartB();
    }
}
```

**Client**

Người dùng không cần biết về quá trình xây dựng cụ thể, chỉ cần chỉ định loại sản phẩm cần tạo.

```java
public class BuilderPattern {
    public static void main(String[] args) {
        Director director = new Director();
        Builder builder = new ConcreteBuilder();

        director.construct(builder);
        Product product = builder.getResult();
        product.show();
    }
}
```

**Kết quả**

```
============== Tạo sản phẩm ==============
Phần C
Phần A
Phần B
```

## Pseudocode

Dưới đây là một ví dụ về mẫu thiết kế **Builder** cho thấy cách bạn có thể tái sử dụng mã xây dựng đối tượng để tạo ra các loại sản phẩm khác nhau - ví dụ: ô tô (Car) và hướng dẫn sử dụng tương ứng (Manual).

![img](https://raw.githubusercontent.com/dunwu/images/master/snap/20210506090759.png)

```java
// Chỉ khi sản phẩm phức tạp và cần cấu hình chi tiết, Builder Pattern mới có ý nghĩa. Dưới đây là hai sản phẩm
// mặc dù không có cùng một giao diện, nhưng lại có mối quan hệ với nhau.
class Car is
    // Một chiếc ô tô có thể được trang bị với thiết bị GPS, máy tính điều khiển và một số ghế. Các mẫu
    // khác nhau của ô tô (xe thể thao, SUV và xe mui trần) có thể được trang bị hoặc kích hoạt các tính năng khác nhau.

class Manual is
    // Hướng dẫn sử dụng phải được biên soạn dựa trên cấu hình của ô tô và giới thiệu tất cả các tính năng của ô tô.


// Giao diện Builder khai báo các phương thức để xây dựng các thành phần của sản phẩm.
interface Builder is
    phương thức reset()
    phương thức setSeats(...)
    phương thức setEngine(...)
    phương thức setTripComputer(...)
    phương thức setGPS(...)

// Lớp Concrete Builder sẽ tuân thủ giao diện Builder và cung cấp cài đặt cụ thể cho quá trình xây dựng. Trong chương trình của bạn, có thể
// có nhiều biến thể của Concrete Builder được triển khai theo cách khác nhau.
class CarBuilder implements Builder is
    private field car:Car

    // Một phiên bản mới của Concrete Builder phải chứa một đối tượng sản phẩm trống được sử dụng trong quá trình lắp ráp tiếp theo.
    constructor CarBuilder() is
        this.reset()

    // phương thức reset (đặt lại) có thể xóa đối tượng đang được tạo.
    method reset() is
        this.car = new Car()

    // Tất cả các bước xây dựng đều tương tác với cùng một đối tượng sản phẩm.
    method setSeats(...) is
        // Đặt số lượng ghế của ô tô.

    method setEngine(...) is
        // Lắp đặt động cơ cụ thể.

    method setTripComputer(...) is
        // Lắp đặt máy tính điều khiển.

    method setGPS(...) is
        // Lắp đặt hệ thống định vị toàn cầu (GPS).

    // Concrete Builder phải cung cấp một phương thức để nhận kết quả xây dựng. Điều này là do các loại khác nhau của Concrete Builder
    // có thể tạo ra các sản phẩm khác nhau không tuân theo cùng một giao diện. Vì vậy, không thể khai báo các phương thức này trong giao diện Builder
    // (ít nhất trong ngôn ngữ lập trình kiểu tĩnh).
    method getProduct():Car is
        sản phẩm = this.car
        this.reset()
        trả về sản phẩm

// Builder khác biệt từ các mẫu thiết kế tạo khác ở chỗ nó cho phép bạn tạo ra các sản phẩm không tuân theo cùng một giao diện.
class CarManualBuilder implements Builder is
    private field manual:Manual

    constructor CarManualBuilder() is
        this.reset()

    method reset() is
        this.manual = new Manual()

    method setSeats(...) is
        // Thêm tài liệu về chức năng ghế ô tô.

    method setEngine(...) is
        // Thêm giới thiệu về động cơ.

    method setTripComputer(...) is
        // Thêm giới thiệu về máy tính điều khiển.

    method setGPS(...) is
        // Thêm giới thiệu về GPS.

    method getProduct():Manual is
        // Trả về hướng dẫn sử dụng và đặt lại Builder.


// Người chỉ đạo chỉ chịu trách nhiệm thực hiện các bước xây dựng theo một thứ tự cụ thể. Điều này sẽ hữu ích khi tạo ra sản phẩm dựa trên các bước hoặc cấu hình cụ thể.
// Vì khách hàng có thể điều khiển trực tiếp Builder, nên nghiêm ngặt mà nói, lớp Director không bắt buộc.
class Director is
    private field builder: Builder

    // Người chỉ đạo có thể tương tác với bất kỳ phiên bản Builder nào được chuyển cho nó bởi mã khách hàng. Điều này cho phép thay đổi
    // loại cuối cùng của sản phẩm mới được tạo bằng cách chuyển Builder khác nhau cho phương thức xây dựng.
    method setBuilder(builder: Builder)
        this.builder = builder

    // Người chỉ đạo có thể tạo ra nhiều biến thể sản phẩm bằng cách sử dụng cùng một bước xây dựng.
	method constructSportsCar(builder: Builder) is
        builder.reset()
        builder.setSeats(2)
        builder.setEngine(new SportEngine())
        builder.setTripComputer(true)
        builder.setGPS(true)

    method constructSUV(builder: Builder) là
        // ...


// Mã khách hàng sẽ tạo ra đối tượng Builder và chuyển nó cho Người chỉ đạo, sau đó thực hiện quá trình xây dựng. Kết quả cuối cùng
// sẽ cần được lấy từ đối tượng Builder.
class Application is

    method makeCar() is
        director = new Director()

        CarBuilder builder = new CarBuilder()
        director.constructSportsCar(builder)
        Car car = builder.getProduct()

        CarManualBuilder builder = new CarManualBuilder()
        director.constructSportsCar(builder)

        // Kết quả cuối cùng thường cần được lấy từ đối tượng Builder, vì Người chỉ đạo không biết về sự tồn tại của Builder và
        // sản phẩm, cũng không phụ thuộc vào chúng.
        Manual manual = builder.getProduct()
```

## Ví dụ

**Ví dụ sử dụng:** Builder Pattern là một mẫu thiết kế nổi tiếng trong thế giới Java. Nó được sử dụng đặc biệt hữu ích khi bạn cần tạo ra một đối tượng có thể có nhiều tùy chọn cấu hình.

Builder đã được sử dụng rộng rãi trong thư viện cốt lõi của Java:

- [`java.lang.StringBuilder#append()`](http://docs.oracle.com/javase/8/docs/api/java/lang/StringBuilder.html#append-boolean-) (không đồng bộ)
- [`java.lang.StringBuffer#append()`](http://docs.oracle.com/javase/8/docs/api/java/lang/StringBuffer.html#append-boolean-) (đồng bộ)
- [`java.nio.ByteBuffer#put()`](http://docs.oracle.com/javase/8/docs/api/java/nio/ByteBuffer.html#put-byte-) (cũng như [`Char­Buffer`](http://docs.oracle.com/javase/8/docs/api/java/nio/CharBuffer.html#put-char-), [`Short­Buffer`](http://docs.oracle.com/javase/8/docs/api/java/nio/ShortBuffer.html#put-short-), [`Int­Buffer`](http://docs.oracle.com/javase/8/docs/api/java/nio/IntBuffer.html#put-int-), [`Long­Buffer`](http://docs.oracle.com/javase/8/docs/api/java/nio/LongBuffer.html#put-long-), [`Float­Buffer`](http://docs.oracle.com/javase/8/docs/api/java/nio/FloatBuffer.html#put-float-) và [`Double­Buffer`](http://docs.oracle.com/javase/8/docs/api/java/nio/DoubleBuffer.html#put-double-))
- Tất cả các lớp triển khai [`java.lang.Appendable`](http://docs.oracle.com/javase/8/docs/api/java/lang/Appendable.html)

**Cách nhận biết:** Builder Pattern có thể được nhận biết bằng cách xem xét lớp có một phương thức xây dựng và nhiều phương thức cấu hình cho các kết quả đối tượng. Phương thức xây dựng của Builder thường hỗ trợ chuỗi phương thức (ví dụ: `someBuilder->setValueA(1)->setValueB(2)->create()`)

## Mối quan hệ với các mẫu thiết kế khác

- Trong giai đoạn thiết kế ban đầu của nhiều công việc, [[Factory Method Pattern]] được sử dụng (đơn giản hơn và có thể tùy chỉnh dễ dàng hơn thông qua lớp con), sau đó tiến triển thành sử dụng [[Abstract Factory Pattern]], [[Prototype Pattern]] hoặc [[Builder Pattern Pattern]] (linh hoạt hơn nhưng phức tạp hơn).
- [[Builder Pattern]] tập trung vào cách xây dựng đối tượng phức tạp theo từng bước. [[Abstract Factory Pattern]] chuyên sản xuất một loạt các đối tượng liên quan. *Abstract Factory* trả về ngay lập tức sản phẩm, trong khi *Builder* cho phép bạn thực hiện một số bước xây dựng bổ sung trước khi nhận sản phẩm.
- Bạn có thể sử dụng [[Builder Pattern]] khi tạo cây [[Composite Pattern]], vì điều này cho phép các bước xây dựng chạy đệ quy.
- Bạn có thể kết hợp [[Builder Pattern]] với [[Bridge Pattern]]: *Director* chịu trách nhiệm về phần trừu tượng, trong khi các *Builder* khác nhau chịu trách nhiệm về phần cài đặt.
- [[Abstract Factory Pattern]], [[Builder Pattern]] và [[Prototype Pattern]] có thể được triển khai bằng [[Singleton Pattern]].
