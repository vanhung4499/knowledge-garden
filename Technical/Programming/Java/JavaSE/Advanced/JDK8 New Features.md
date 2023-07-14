---
title: JDK8 New Features
tags: [java, javase, jdk8]
categories: [java, javase]
date created: 2023-07-14
date modified: 2023-07-14
---

# Hướng dẫn cơ bản về JDK 8

> Phần về câu hỏi thường gặp khi nâng cấp JDK 8 là trích dẫn từ kinh nghiệm cá nhân của tôi. Các nội dung khác được dịch từ [java8-tutorial](https://github.com/winterbe/java8-tutorial)
>
> Từ khóa: `Stream`, `lambda`, `Optional`, `@FunctionalInterface`

## Default Methods for Interfaces (Phương thức mặc định cho Interface)

Java 8 cho phép chúng ta thêm các phương thức không trừu tượng vào interface bằng cách sử dụng từ khóa `default`. Tính năng này còn được gọi là phương thức mở rộng ảo.

Đây là ví dụ đầu tiên của chúng ta:

```java
interface Formula {
    double calculate(int a);

    default double sqrt(int a) {
        return Math.sqrt(a);
    }
}
```

Ngoài phương thức trừu tượng `calculate`, interface `Formula` còn định nghĩa phương thức mặc định `sqrt`. Lớp cụ thể chỉ cần triển khai phương thức trừu tượng để tính toán. Phương thức mặc định `sqrt` có thể được sử dụng ngay lập tức.

```java
Formula formula = new Formula() {
    @Override
    public double calculate(int a) {
        return sqrt(a * 100);
    }
};

formula.calculate(100);     // 100.0
formula.sqrt(16);           // 4.0
```

`Formula` được triển khai bằng một đối tượng ẩn danh. Mã rất dài: 6 dòng mã để tính toán đơn giản `sqrt(a * 100)`. Như chúng ta sẽ thấy trong phần tiếp theo, trong Java 8, có cách tốt hơn để triển khai đối tượng với một phương thức duy nhất.

## Lambda expressions (Biểu thức Lambda)

Hãy xem một ví dụ đơn giản để minh họa cách sắp xếp danh sách chuỗi trong các phiên bản Java trước:

```java
List<String> names = Arrays.asList("peter", "anna", "mike", "xenia");

Collections.sort(names, new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return b.compareTo(a);
    }
});
```

Phương thức tiện ích tĩnh `Collections.sort` được sử dụng để sắp xếp danh sách được chỉ định, nhận một danh sách và một bộ so sánh. Bạn thường thấy mình phải tạo một bộ so sánh ẩn danh và chuyển nó vào phương thức sắp xếp.

Java 8 sử dụng biểu thức lambda ngắn gọn hơn để tránh việc tạo đối tượng ẩn danh thường xuyên:

```java
Collections.sort(names, (String a, String b) -> {
    return b.compareTo(a);
});
```

Như bạn thấy, mã này ngắn gọn hơn rất nhiều so với mã trước. Nhưng nó còn có thể ngắn gọn hơn nữa:

```java
Collections.sort(names, (String a, String b) -> b.compareTo(a));
```

Dòng mã này loại bỏ dấu ngoặc nhọn `{}` và từ khóa `return`. Nhưng điều này chưa phải là tối ưu, nó còn có thể ngắn gọn hơn nữa:

```java
names.sort((a, b) -> b.compareTo(a));
```

Danh sách hiện có một phương thức `sort`. Hơn nữa, trình biên dịch Java biết về kiểu dữ liệu của tham số, vì vậy bạn không cần chỉ định kiểu dữ liệu của tham số đầu vào. Hãy khám phá sâu hơn về cách sử dụng biểu thức lambda.

## Giao diện phương thức (Functional Interfaces)

Làm thế nào lambda expression phù hợp với hệ thống kiểu dữ liệu của Java? Mỗi lambda tương ứng với một loại được chỉ định bởi một giao diện. Một *giao diện phương thức* phải chứa một **khai báo phương thức trừu tượng**. Mỗi lambda expression của loại này sẽ khớp với phương thức trừu tượng này. Vì các phương thức mặc định không phải là trừu tượng, bạn có thể tự do thêm các phương thức mặc định vào giao diện phương thức của bạn.

Chỉ cần đảm bảo giao diện chỉ chứa một phương thức trừu tượng, bạn có thể sử dụng bất kỳ giao diện nào làm lambda expression. Để đảm bảo giao diện của bạn đáp ứng yêu cầu, bạn nên thêm chú thích `@FunctionalInterface`. Khi trình biên dịch nhận thấy chú thích này, nếu bạn cố gắng thêm một khai báo phương thức trừu tượng thứ hai vào giao diện, trình biên dịch sẽ báo lỗi.

Ví dụ:

```java
@FunctionalInterface
interface Converter<F, T> {
    T convert(F from);
}
```

```java
Converter<String, Integer> converter = (from) -> Integer.valueOf(from);
Integer converted = converter.convert("123");
System.out.println(converted);    // 123
```

Hãy nhớ rằng mã vẫn là hợp lệ nếu bỏ qua chú thích `@FunctionalInterface`.

## Tham chiếu phương thức và hàm tạo (Method and Constructor References)

Mã ví dụ trên có thể được đơn giản hóa bằng cách sử dụng tham chiếu phương thức tĩnh:

```java
Converter<String, Integer> converter = Integer::valueOf;
Integer converted = converter.convert("123");
System.out.println(converted);   // 123
```

Java 8 cho phép bạn truyền tham chiếu đến phương thức hoặc hàm tạo bằng cú pháp `::`. Ví dụ trên cho thấy cách tham chiếu đến một phương thức tĩnh. Nhưng chúng ta cũng có thể tham chiếu đến phương thức của đối tượng:

```java
class Something {
    String startsWith(String s) {
        return String.valueOf(s.charAt(0));
    }
}
```

```java
Something something = new Something();
Converter<String, String> converter = something::startsWith;
String converted = converter.convert("Java");
System.out.println(converted);    // "J"
```

Hãy xem cách `::` hoạt động với hàm tạo. Đầu tiên, chúng ta định nghĩa một lớp ví dụ có nhiều hàm tạo.

```java
class Person {
    String firstName;
    String lastName;

    Person() {}

    Person(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
```

Sau đó, chúng ta chỉ định một giao diện PersonFactory để tạo đối tượng Person.

```java
interface PersonFactory<P extends Person> {
    P create(String firstName, String lastName);
}
```

Thay vì thủ công triển khai một factory, chúng ta kết hợp mọi thứ bằng tham chiếu hàm tạo:

```java
PersonFactory<Person> personFactory = Person::new;
Person person = personFactory.create("Peter", "Parker");
```

Chúng ta sử dụng `Person::new` để tạo một tham chiếu đến hàm tạo Person. Trình biên dịch Java sẽ tự động khớp với hàm tạo chính xác dựa trên chữ ký của `PersonFactory.create`.

## Phạm vi của Lambda (Lambda Scopes)

Truy cập biến phạm vi bên ngoài lambda expression tương tự như truy cập vào đối tượng vô danh. Bạn có thể truy cập các hằng số trong phạm vi bên ngoài cục bộ cũng như các biến thành viên và biến tĩnh của đối tượng.

### Truy cập biến cục bộ (Accessing local variables)

Chúng ta có thể truy cập các hằng số trong phạm vi bên ngoài lambda expression:

```java
final int num = 1;
Converter<Integer, String> stringConverter =
        (from) -> String.valueOf(from + num);

stringConverter.convert(2);     // 3
```

Khác với đối tượng vô danh, biến `num` không nhất thiết phải được đánh dấu là `final`. Đoạn mã dưới đây cũng hợp lệ:

```java
int num = 1;
Converter<Integer, String> stringConverter =
        (from) -> String.valueOf(from + num);

stringConverter.convert(2);     // 3
```

Tuy nhiên, `num` phải là một hằng số ngụ ý. Đoạn mã dưới đây sẽ không biên dịch được:

```java
int num = 1;
Converter<Integer, String> stringConverter =
        (from) -> String.valueOf(from + num);
num = 3;
```

Ngoài ra, việc thực hiện ghi vào `num` trong lambda expression cũng bị cấm.

### Truy cập các trường và biến tĩnh (Accessing fields and static variables)

So với biến cục bộ, chúng ta có thể đọc và ghi vào các biến thành viên của đối tượng cũng như các biến tĩnh của đối tượng. Hành vi này đã được biết đến trong đối tượng vô danh.

```java
class Lambda4 {
    static int outerStaticNum;
    int outerNum;

    void testScopes() {
        Converter<Integer, String> stringConverter1 = (from) -> {
            outerNum = 23;
            return String.valueOf(from);
        };

        Converter<Integer, String> stringConverter2 = (from) -> {
            outerStaticNum = 72;
            return String.valueOf(from);
        };
    }
}
```

### Truy cập các phương thức mặc định của giao diện (Accessing Default Interface Methods)

Nhớ lại ví dụ về `formula` ở phần đầu, giao diện `Formula` định nghĩa một phương thức mặc định `sqrt` có thể được truy cập bởi mọi instance của formula (bao gồm cả đối tượng vô danh). Tính năng này không áp dụng cho lambda expression.

Phương thức mặc định **không thể** được truy cập bởi lambda expression. Đoạn mã dưới đây sẽ không biên dịch được:

```java
Formula formula = (a) -> sqrt(a * 100);
```

## Giao diện chức năng tích hợp sẵn (Built-in Functional Interfaces)

API JDK 1.8 bao gồm nhiều giao diện chức năng tích hợp sẵn. Một số trong số chúng đã được biết đến trong các phiên bản Java trước đây (như `Comparator` hoặc `Runnable`). Các giao diện hiện có được mở rộng để hỗ trợ Lambda bằng cách chú thích `@FunctionalInterface`.

Tuy nhiên, API Java 8 cũng cung cấp nhiều giao diện chức năng mới. Một số giao diện mới này đã được biết đến trong thư viện [Google Guava](https://code.google.com/p/guava-libraries/). Ngay cả khi bạn đã quen thuộc với thư viện này, bạn nên chú ý đến cách mở rộng các giao diện này bằng cách sử dụng các phương thức hữu ích.

### Predicates

`Predicate` là một hàm boolean với một tham số. Giao diện này bao gồm các phương thức mặc định khác nhau để kết hợp các điều kiện thành các biểu thức logic phức tạp (AND, OR, NOT).

```java
Predicate<String> predicate = (s) -> s.length() > 0;

predicate.test("foo");              // true
predicate.negate().test("foo");     // false

Predicate<Boolean> nonNull = Objects::nonNull;
Predicate<Boolean> isNull = Objects::isNull;

Predicate<String> isEmpty = String::isEmpty;
Predicate<String> isNotEmpty = isEmpty.negate();
```

### Functions

`Function` nhận một tham số và trả về một kết quả. Có thể kết hợp nhiều hàm với nhau bằng cách sử dụng các phương thức mặc định (compose, andThen).

```java
Function<String, Integer> toInteger = Integer::valueOf;
Function<String, String> backToString = toInteger.andThen(String::valueOf);

backToString.apply("123");     // "123"
```

### Suppliers

`Supplier` tạo ra một kết quả kiểu generic. Khác với `Function`, `Supplier` không nhận tham số.

```java
Supplier<Person> personSupplier = Person::new;
personSupplier.get();   // new Person
```

### Consumers

Consumer đại diện cho một hoạt động được thực hiện trên một tham số đầu vào.

```java
Consumer<Person> greeter = (p) -> System.out.println("Hello, " + p.firstName);
greeter.accept(new Person("Luke", "Skywalker"));
```

### Comparators

Comparators đã được biết đến trong các phiên bản Java cũ. Java 8 đã thêm các phương thức mặc định khác nhau cho giao diện này.

```java
Comparator<Person> comparator = (p1, p2) -> p1.firstName.compareTo(p2.firstName);

Person p1 = new Person("John", "Doe");
Person p2 = new Person("Alice", "Wonderland");

comparator.compare(p1, p2);             // > 0
comparator.reversed().compare(p1, p2);  // < 0
```

## Optional (Tùy chọn)

`Optional` không phải là một giao diện chức năng, mà là một công cụ tốt để ngăn chặn `NullPointerException`. Đây là một khái niệm quan trọng trong phần tiếp theo, vì vậy hãy xem nhanh cách `Optional` hoạt động.

`Optional` là một container đơn giản, giá trị của nó có thể là null hoặc không null. Hãy tưởng tượng một phương thức có thể trả về một kết quả không null, nhưng đôi khi không trả về gì cả. Thay vì trả về null, chúng ta trả về `Optional` trong Java 8.

```java
Optional<String> optional = Optional.of("bam");

optional.isPresent();           // true
optional.get();                 // "bam"
optional.orElse("fallback");    // "bam"

optional.ifPresent((s) -> System.out.println(s.charAt(0)));     // "b"
```

## Streams (Luồng)

`java.util.Stream` đại diện cho một chuỗi các phần tử mà bạn có thể thực hiện một hoặc nhiều thao tác trên đó. Các hoạt động trên luồng có thể là trung gian hoặc kết thúc. Khi hoạt động kết thúc trả về một loại kết quả cụ thể, các hoạt động trung gian trả về chính luồng, vì vậy bạn có thể liên kết nhiều cuộc gọi phương thức. Luồng được tạo ra từ nguồn như một `java.util.Collection` như danh sách hoặc tập hợp (không hỗ trợ ánh xạ). Các hoạt động trên luồng có thể được thực hiện theo thứ tự hoặc song song.

> Luồng là một tính năng mạnh mẽ, vì vậy tôi đã viết một [hướng dẫn riêng về Java 8 Streams](http://winterbe.com/posts/2014/07/31/java8-stream-tutorial-examples/). **Bạn cũng nên xem thư viện Sequent, một thư viện tương tự cho web.**

Hãy xem cách luồng tuần tự hoạt động trước. Trước tiên, chúng ta tạo một nguồn dữ liệu dưới dạng danh sách chuỗi:

```java
List<String> stringCollection = new ArrayList<>();
stringCollection.add("ddd2");
stringCollection.add("aaa2");
stringCollection.add("bbb1");
stringCollection.add("aaa1");
stringCollection.add("bbb3");
stringCollection.add("ccc");
stringCollection.add("bbb2");
stringCollection.add("ddd1");
```

Trong Java 8, các bộ sưu tập đã được mở rộng để bạn có thể tạo luồng bằng cách gọi `Collection.stream()` hoặc `Collection.parallelStream()` một cách đơn giản. Các phần sau giới thiệu các hoạt động luồng phổ biến nhất.

### Filter (Lọc)

Phương thức lọc chấp nhận một tiền đề để lọc tất cả các phần tử của luồng. Đây là một hoạt động trung gian, cho phép chúng ta gọi kết quả của một hoạt động khác (`forEach`) trên luồng. `forEach` chấp nhận một người tiêu dùng để thực hiện một hành động trên mỗi phần tử trong luồng đã lọc. `forEach` là một hoạt động kết thúc. Nó không trả về giá trị, vì vậy chúng ta không thể gọi một hoạt động luồng khác.

```java
stringCollection
    .stream()
    .filter((s) -> s.startsWith("a"))
    .forEach(System.out::println);

// "aaa2", "aaa1"
```

### Sorted (Sắp xếp)

Sắp xếp là một hoạt động trung gian, trả về một cái nhìn sắp xếp của luồng. Các phần tử được sắp xếp theo thứ tự tự nhiên, trừ khi bạn chuyển một bộ so sánh tùy chỉnh.

```java
stringCollection
    .stream()
    .sorted()
    .filter((s) -> s.startsWith("a"))
    .forEach(System.out::println);

// "aaa1", "aaa2"
```

Hãy nhớ rằng sắp xếp chỉ tạo ra một cái nhìn sắp xếp của luồng, không ảnh hưởng đến sắp xếp của bộ sưu tập gốc `stringCollection`:

```java
System.out.println(stringCollection);
// ddd2, aaa2, bbb1, aaa1, bbb3, ccc, bbb2, ddd1
```

### Map (Ánh xạ)

Hoạt động trung gian ánh xạ chuyển đổi mỗi phần tử thành một đối tượng khác bằng cách sử dụng một hàm đã cho. Ví dụ dưới đây chuyển đổi mỗi chuỗi thành một chuỗi chữ hoa. Nhưng bạn cũng có thể sử dụng `map` để chuyển đổi mỗi đối tượng thành một loại khác. Loại chung của kết quả luồng phụ thuộc vào loại chung của hàm bạn chuyển cho `map`.

```java
stringCollection
    .stream()
    .map(String::toUpperCase)
    .sorted((a, b) -> b.compareTo(a))
    .forEach(System.out::println);

// "DDD2", "DDD1", "CCC", "BBB3", "BBB2", "AAA2", "AAA1"
```

### Match (Phù hợp)

Bạn có thể sử dụng các hoạt động phù hợp khác nhau để kiểm tra xem một tiền đề có khớp với luồng hay không. Tất cả các hoạt động này là hoạt động kết thúc và trả về kết quả boolean.

```java
boolean anyStartsWithA =
    stringCollection
        .stream()
        .anyMatch((s) -> s.startsWith("a"));

System.out.println(anyStartsWithA);      // true

boolean allStartsWithA =
    stringCollection
        .stream()
        .allMatch((s) -> s.startsWith("a"));

System.out.println(allStartsWithA);      // false

boolean noneStartsWithZ =
    stringCollection
        .stream()
        .noneMatch((s) -> s.startsWith("z"));

System.out.println(noneStartsWithZ);      // true
```

#### Count (Đếm)

Count là một hoạt động kết thúc, trả về số lượng phần tử trong luồng.

```java
long startsWithB =
    stringCollection
        .stream()
        .filter((s) -> s.startsWith("b"))
        .count();

System.out.println(startsWithB);    // 3
```

### Reduce (Giảm)

Hoạt động kết thúc này giảm các phần tử của luồng thành một giá trị duy nhất bằng cách sử dụng một chức năng đã cho. Kết quả là một `Optional` chứa giá trị giảm.

```java
Optional<String> reduced =
    stringCollection
        .stream()
        .sorted()
        .reduce((s1, s2) -> s1 + "#" + s2);

reduced.ifPresent(System.out::println);
// "aaa1##aaa2##bbb1##bbb2##bbb3##ccc##ddd1##ddd2"
```

## Parallel Streams (Luồng song song)

Như đã đề cập trước đó, luồng có thể là tuần tự hoặc song song. Các hoạt động trên luồng tuần tự được thực hiện trên một luồng duy nhất, trong khi các hoạt động trên luồng song song được thực hiện trên nhiều luồng cùng một lúc.

Các ví dụ dưới đây cho thấy cách dễ dàng tăng hiệu suất bằng cách sử dụng luồng song song.

Trước tiên, chúng ta tạo một danh sách các phần tử duy nhất lớn:

```java
int max = 1000000;
List<String> values = new ArrayList<>(max);
for (int i = 0; i < max; i++) {
    UUID uuid = UUID.randomUUID();
    values.add(uuid.toString());
}
```

Bây giờ chúng ta đo thời gian mất để sắp xếp danh sách này.

### Sequential Sort (Sắp xếp tuần tự)

```java
long t0 = System.nanoTime();

long count = values.stream().sorted().count();
System.out.println(count);

long t1 = System.nanoTime();

long millis = TimeUnit.NANOSECONDS.toMillis(t1 - t0);
System.out.println(String.format("sequential sort took: %d ms", millis));

// sequential sort took: 899 ms
```

### Parallel Sort (Sắp xếp song song)

```java
long t0 = System.nanoTime();

long count = values.parallelStream().sorted().count();
System.out.println(count);

long t1 = System.nanoTime();

long millis = TimeUnit.NANOSECONDS.toMillis(t1 - t0);
System.out.println(String.format("parallel sort took: %d ms", millis));

// parallel sort took: 472 ms
```

Như bạn có thể thấy, hai đoạn mã gần như giống nhau, nhưng sắp xếp song song nhanh hơn gần 50%. Bạn chỉ cần thay đổi `stream()` thành `parallelStream()`.

## Maps (Ánh xạ)

Như đã đề cập trước đó, map không hỗ trợ trực tiếp luồng. Giao diện Map không có phương thức `stream()` sẵn có, nhưng bạn có thể tạo luồng cụ thể bằng cách sử dụng `map.keySet().stream()` , `map.values().stream()` và `map.entrySet().stream()`.

Ngoài ra, map hỗ trợ nhiều phương thức mới và hữu ích để xử lý các tác vụ thông thường.

```java
Map<Integer, String> map = new HashMap<>();

for (int i = 0; i < 10; i++) {
    map.putIfAbsent(i, "val" + i);
}

map.forEach((id, val) -> System.out.println(val));
```

Đoạn mã trên nên tự giải thích: `putIfAbsent` ngăn chúng ta viết thêm kiểm tra giá trị null; `forEach` chấp nhận một người tiêu dùng để thực hiện một hành động trên mỗi giá trị trong map.

Ví dụ này cho thấy cách tính toán trên map bằng cách sử dụng hàm:

```java
map.computeIfPresent(3, (num, val) -> val + num);
map.get(3);             // val33

map.computeIfPresent(9, (num, val) -> null);
map.containsKey(9);     // false

map.computeIfAbsent(23, num -> "val" + num);
map.containsKey(23);    // true

map.computeIfAbsent(3, num -> "bam");
map.get(3);             // val33
```

Tiếp theo, chúng ta học cách xóa mục nhập cho một khóa đã cho chỉ khi khóa hiện tại ánh xạ đến giá trị đã cho:

```java
map.remove(3, "val3");
map.get(3);             // val33

map.remove(3, "val33");
map.get(3);             // null
```

Một phương thức hữu ích khác:

```java
map.getOrDefault(42, "not found");  // not found
```

Kết hợp một entry của map rất đơn giản:

```java
map.merge(9, "val9", (value, newValue) -> value.concat(newValue));
map.get(9);             // val9

map.merge(9, "concat", (value, newValue) -> value.concat(newValue));
map.get(9);             // val9concat
```

Nếu không có mục nhập cho khóa đã cho, nó sẽ được hợp nhất hoặc đặt cặp khóa/giá trị vào map; nếu không, nó sẽ gọi hàm hợp nhất để thay đổi giá trị hiện có.

## Date API

Java 8 đã thêm một API ngày tháng mới trong gói `java.time`. API ngày tháng mới tương tự như thư viện Joda-Time, nhưng có một số khác biệt. Các ví dụ dưới đây bao gồm các phần quan trọng nhất của API mới này.

### Clock

`Clock` cung cấp truy cập vào ngày và giờ hiện tại. `Clock` biết về múi giờ và có thể được sử dụng để thay thế `System.currentTimeMillis()`, để lấy thời gian hiện tại tính từ **Unix EPOCH** theo đơn vị mili giây. Một thời điểm trên đường thời gian cũng được biểu diễn bởi lớp `Instant`. Các thời điểm có thể được sử dụng để tạo đối tượng `java.util.Date` theo cách cũ.

```java
Clock clock = Clock.systemDefaultZone();
long millis = clock.millis();

Instant instant = clock.instant();
Date legacyDate = Date.from(instant);   // java.util.Date cũ
```

### Timezones

Múi giờ được biểu diễn bởi `ZoneId`. Chúng có thể dễ dàng truy cập thông qua các phương thức tạo tĩnh. Múi giờ xác định sự chênh lệch quan trọng giữa một thời điểm cụ thể và ngày giờ địa phương.

```java
System.out.println(ZoneId.getAvailableZoneIds());
// in ra tất cả các mã múi giờ có sẵn

ZoneId zone1 = ZoneId.of("Europe/Berlin");
ZoneId zone2 = ZoneId.of("Brazil/East");
System.out.println(zone1.getRules());
System.out.println(zone2.getRules());

// ZoneRules[currentStandardOffset=+01:00]
// ZoneRules[currentStandardOffset=-03:00]
```

### LocalTime

`LocalTime` đại diện cho thời gian không có múi giờ, ví dụ như 10 giờ tối hoặc 17:30:15. Ví dụ dưới đây tạo ra hai thời gian địa phương cho các múi giờ đã được xác định ở trên. Sau đó, chúng ta so sánh hai thời gian và tính khoảng cách giữa chúng theo giờ và phút.

```java
LocalTime now1 = LocalTime.now(zone1);
LocalTime now2 = LocalTime.now(zone2);

System.out.println(now1.isBefore(now2));  // false

long hoursBetween = ChronoUnit.HOURS.between(now1, now2);
long minutesBetween = ChronoUnit.MINUTES.between(now1, now2);

System.out.println(hoursBetween);       // -3
System.out.println(minutesBetween);     // -239
```

`LocalTime` có nhiều phương thức tạo đối tượng khác nhau để đơn giản hóa việc tạo đối tượng mới, bao gồm cả phân tích chuỗi thời gian.

```java
LocalTime late = LocalTime.of(23, 59, 59);
System.out.println(late);       // 23:59:59

DateTimeFormatter germanFormatter =
    DateTimeFormatter
        .ofLocalizedTime(FormatStyle.SHORT)
        .withLocale(Locale.GERMAN);

LocalTime leetTime = LocalTime.parse("13:37", germanFormatter);
System.out.println(leetTime);   // 13:37
```

### LocalDate

`LocalDate` đại diện cho một ngày cụ thể, ví dụ như ngày 11 tháng 3 năm 2014. Nó là không thay đổi và hoàn toàn tương tự với `LocalTime`. Ví dụ dưới đây cho thấy cách tính toán các ngày mới bằng cách thêm hoặc trừ số ngày, tháng hoặc năm. Hãy nhớ rằng mỗi thao tác đều trả về một đối tượng mới.

```java
LocalDate today = LocalDate.now();
LocalDate tomorrow = today.plus(1, ChronoUnit.DAYS);
LocalDate yesterday = tomorrow.minusDays(2);

LocalDate independenceDay = LocalDate.of(2014, Month.JULY, 4);
DayOfWeek dayOfWeek = independenceDay.getDayOfWeek();
System.out.println(dayOfWeek);    // FRIDAY
```

Việc phân tích một chuỗi thành đối tượng `LocalDate` cũng rất đơn giản, tương tự như phân tích `LocalTime`:

```java
DateTimeFormatter germanFormatter =
    DateTimeFormatter
        .ofLocalizedDate(FormatStyle.MEDIUM)
        .withLocale(Locale.GERMAN);

LocalDate xmas = LocalDate.parse("24.12.2014", germanFormatter);
System.out.println(xmas);   // 2014-12-24
```

### LocalDateTime

`LocalDateTime` đại diện cho ngày và giờ. Nó kết hợp ngày và giờ thành một đối tượng. `LocalDateTime` cũng không thay đổi và hoạt động tương tự như `LocalTime` và `LocalDate`. Chúng ta có thể sử dụng các phương thức để lấy giá trị của một đơn vị cụ thể trong ngày và giờ.

```java
LocalDateTime sylvester = LocalDateTime.of(2014, Month.DECEMBER, 31, 23, 59, 59);

DayOfWeek dayOfWeek = sylvester.getDayOfWeek();
System.out.println(dayOfWeek);      // WEDNESDAY

Month month = sylvester.getMonth();
System.out.println(month);          // DECEMBER

long minuteOfDay = sylvester.getLong(ChronoField.MINUTE_OF_DAY);
System.out.println(minuteOfDay);    // 1439
```

Chúng ta có thể chuyển đổi một đối tượng `LocalDateTime` thành một đối tượng `java.util.Date` bằng cách thêm thông tin về múi giờ. Điều này rất hữu ích khi chuyển đổi giữa các kiểu dữ liệu khác nhau.

```java
Instant instant = sylvester
        .atZone(ZoneId.systemDefault())
        .toInstant();

Date legacyDate = Date.from(instant);
System.out.println(legacyDate);     // Wed Dec 31 23:59:59 CET 2014
```

Định dạng ngày và giờ tương tự như định dạng ngày hoặc giờ. Chúng ta có thể tạo một định dạng tùy chỉnh bằng cách sử dụng mẫu tùy chỉnh thay vì sử dụng định dạng được xác định sẵn.

```java
DateTimeFormatter formatter =
    DateTimeFormatter
        .ofPattern("MMM dd, yyyy - HH:mm");

LocalDateTime parsed = LocalDateTime.parse("Nov 03, 2014 - 07:13", formatter);
String string = formatter.format(parsed);
System.out.println(string);     // Nov 03, 2014 - 07:13
```

Khác với `java.text.NumberFormat`, `DateTimeFormatter` là không thay đổi và **an toàn đối với luồng**.

Để biết thêm thông tin về định dạng ngày tháng, bạn có thể tham khảo [đây](https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html).

## Annotations

Trong Java 8, chú thích có thể lặp lại. Hãy xem một ví dụ để giải quyết vấn đề này.

Đầu tiên, chúng ta định nghĩa một chú thích bên ngoài chứa một mảng chú thích thực tế:

```java
@interface Hints {
    Hint[] value();
}

@Repeatable(Hints.class)
@interface Hint {
    String value();
}
```

Java 8 cho phép chúng ta sử dụng chú thích `@Repeatable` để giới thiệu nhiều chú thích cùng loại.

### Biến thể 1: Sử dụng chú thích chứa (cách truyền thống)

```java
@Hints({@Hint("hint1"), @Hint("hint2")})
class Person {}
```

### Biến thể 2: Sử dụng chú thích lặp lại (cách mới)

```java
@Hint("hint1")
@Hint("hint2")
class Person {}
```

Trong biến thể 2, trình biên dịch Java tự động đặt chú thích `@Hints` cho chúng ta.

Điều này quan trọng khi đọc thông tin chú thích bằng phản chiếu.

```java
Hint hint = Person.class.getAnnotation(Hint.class);
System.out.println(hint);                   // null

Hints hints1 = Person.class.getAnnotation(Hints.class);
System.out.println(hints1.value().length);  // 2

Hint[] hints2 = Person.class.getAnnotationsByType(Hint.class);
System.out.println(hints2.length);          // 2
```

Mặc dù chúng ta không khai báo chú thích `@Hints` trên lớp Person, nhưng chúng ta vẫn có thể đọc nó thông qua `getAnnotation(Hints.class)`. Tuy nhiên, cách tiện lợi hơn là sử dụng `getAnnotationsByType`, nó cho phép truy cập trực tiếp vào tất cả các chú thích `@Hint`.

Ngoài ra, chú thích trong Java 8 sử dụng hai mục tiêu mới mở rộng:

```java
@Target({ElementType.TYPE_PARAMETER, ElementType.TYPE_USE})
@interface MyAnnotation {}
```

Phần trên dòng ngang là nội dung được dịch từ [java8-tutorial](https://github.com/winterbe/java8-tutorial).

## Các vấn đề khi nâng cấp lên JDK 8

> JDK 8 đã được phát hành từ lâu và nó cung cấp nhiều tính năng mới hấp dẫn, giúp cải thiện hiệu suất lập trình.
>
> Đối với các dự án cũ, việc nâng cấp lên JDK 8 có thể gặp một số vấn đề tương thích, việc nâng cấp cần được xem xét cẩn thận.
>
> Gần đây, tôi đã gặp một nhiệm vụ trong công việc là nâng cấp phiên bản JDK của tất cả các dự án trong phòng ban lên 1.8 (phiên bản cũ hầu hết là 1.6). Trong quá trình này, tôi đã gặp một số vấn đề và kết hợp với những lỗi mà tôi đã đọc trên mạng, tôi xin tổng kết lại ở đây.

### Cài đặt JDK trong Intellij

#### Cài đặt

Nhấp vào **File > Settings > Java Compiler**

Chọn phiên bản bytecode của dự án là 1.8

Nhấp vào **File > Settings > Build Tools > Maven > Importing**

Chọn JDK cho trình nhập khẩu là 1.8

#### Cài đặt cho dự án

Chọn **Project SDK** là 1.8

#### Ứng dụng

Nếu cách khởi động ứng dụng web là thông qua ứng dụng, cần thay đổi JRE

Nhấp vào **Run/Debug Configurations > Configuration**

Chọn JRE là 1.8

### Thay đổi trong môi trường Linux

#### Thay đổi biến môi trường

Sửa đổi biến **JAVA_HOME** trong `/etc/profile`, đặt nó thành đường dẫn của JDK 8.

Sau khi sửa đổi, chạy lệnh `source /etc/profile` để áp dụng thay đổi.

Nếu trong tập lệnh biên dịch hoặc triển khai có `export JAVA_HOME`, cần lưu ý rằng cần sử dụng đường dẫn của JDK 8.

#### Thay đổi trong Maven

Trong tệp `settings.xml`, nếu điều kiện kích hoạt của profile là JDK, cần sửa đổi phiên bản JDK.

```xml
<activation>
  <jdk>1.8</jdk> <!-- Sửa thành 1.8 -->
</activation>
```

#### Thay đổi trong máy chủ

Sửa đổi tham số javac trong máy chủ, ví dụ như resin:

Sửa đổi tham số javac trong tệp cấu hình của resin.

```xml
<javac compiler="internal" args="-source 1.8"/>
```

### Vấn đề thiếu gói sun.\*

JDK 8 không cung cấp gói `sun.*` cho các nhà phát triển sử dụng, vì các giao diện này không phải là giao diện công khai và không đảm bảo hoạt động trên tất cả các nền tảng tương thích Java.

Nếu chương trình sử dụng các API này và muốn nâng cấp lên JDK 1.8, cần tìm các giải pháp thay thế.

Mặc dù có thể tự nhập gói chứa các giao diện `sun.*` vào thư mục classpath, nhưng đây không phải là một cách tốt.

Cần hiểu rõ tại sao không nên sử dụng `sun.*`, có thể tham khảo tài liệu chính thức: [Why Developers Should Not Write Programs That Call 'sun' Packages](http://www.oracle.com/technetwork/java/faq-sun-packages-142232.html)

### Thay đổi trong chính sách bảo mật mặc định

Sau khi nâng cấp, có thể gặp lỗi khi sử dụng các thuật toán không an toàn. Vì vậy, hỗ trợ các thuật toán không an toàn vẫn là cần thiết.

Tìm tệp `java.security` trong thư mục `$JAVA_HOME/jre/lib/security` và đặt các thuật toán bị vô hiệu hóa thành rỗng: `jdk.certpath.disabledAlgorithms=`.

### Thay đổi các tham số JVM

Trong JDK 8, các tham số liên quan đến PermSize không còn được sử dụng:

```
-XX:MaxPermSize=size

Đặt kích thước không gian thế hệ vĩnh viễn tối đa (tính bằng byte). Tùy chọn này đã bị lỗi thời trong JDK 8 và được thay thế bằng tùy chọn -XX:MaxMetaspaceSize.

-XX:PermSize=size

Đặt không gian (tính bằng byte) được cấp cho thế hệ vĩnh viễn, gây ra một bộ sưu tập rác nếu vượt quá. Tùy chọn này đã bị lỗi thời trong JDK 8 và được thay thế bằng tùy chọn -XX:MetaspaceSize.
```

Trong JDK 8, không còn PermGen nữa. Một số phần, chẳng hạn như các chuỗi được intern, đã được chuyển từ PermGen sang heap thông thường từ JDK 7 trở đi. **Các cấu trúc khác sẽ được chuyển sang một khu vực bộ nhớ nguyên gốc được gọi là "Metaspace" trong JDK 8, khu vực này sẽ tự động mở rộng theo mặc định và cũng sẽ được thu gom rác. Nó có hai cấu hình: MetaspaceSize và MaxMetaspaceSize.**

-XX:MetaspaceSize=size

> Đặt kích thước không gian lớp metadata đã cấp phát sẽ kích hoạt một bộ sưu tập rác lần đầu tiên nếu vượt quá kích thước này. Ngưỡng này cho việc thu gom rác được tăng hoặc giảm tùy thuộc vào lượng metadata đã sử dụng. Kích thước mặc định phụ thuộc vào nền tảng.

-XX:MaxMetaspaceSize=size

> Đặt số lượng bộ nhớ nguyên gốc tối đa có thể cấp phát cho metadata lớp. Mặc định, kích thước không bị giới hạn. Số lượng metadata cho một ứng dụng phụ thuộc vào ứng dụng đó, các ứng dụng khác đang chạy và lượng bộ nhớ có sẵn trên hệ thống.

Dưới đây là ví dụ về cách đặt giới hạn metadata lớp là 256 MB:

XX:MaxMetaspaceSize=256m

### Vấn đề về bytecode

ASM 5.0 beta đã hỗ trợ JDK 8.

**Lỗi bytecode**

```
Caused by: java.io.IOException: invalid constant type: 15
	at javassist.bytecode.ConstPool.readOne(ConstPool.java:1113)
```

- Tìm các thành phần sử dụng mvel, để tăng hiệu suất, mvel đã tối ưu bytecode. Đúng lúc gặp lỗ hổng JDK 8, vì vậy cần nâng cấp.

```xml
<dependency>
  <groupId>org.mvel</groupId>
  <artifactId>mvel2</artifactId>
  <version>2.2.7.Final</version>
</dependency>
```

- javassist

```xml
<dependency>
  <groupId>org.javassist</groupId>
  <artifactId>javassist</artifactId>
  <version>3.18.1-GA</version>
</dependency>
```

> **Lưu ý**
>
> Một số công cụ triển khai không xóa các tệp jar phiên bản cũ, vì vậy có thể thử xóa các tệp jar phiên bản cũ thủ công.

http://asm.ow2.org/history.html

### Lỗi kết nối Java với Redis: Error redis clients jedis HostAndPort cant resolve localhost address

Môi trường lỗi:  
Môi trường phát triển trên Windows không gặp vấn đề. Khi triển khai trên môi trường Linux, gặp sự cố.  
Thông báo lỗi:  
Error redis clients jedis HostAndPort cant resolve localhost address

Giải pháp:

(1) Kiểm tra tên máy chủ của hệ thống Linux

```
# hostname
template
```

(2) Kiểm tra xem tệp /etc/hosts có chứa 127.0.0.1 tương ứng với tên máy chủ không, nếu không, thêm vào

### Đặt JDK 1.8 cho máy chủ Resin

Nếu phiên bản resin trước đó là dưới JDK 1.8, khi chạy ứng dụng web được biên dịch bằng JDK 1.8, có thể gặp lỗi:

```
java.lang.UnsupportedClassVersionError: PR/Sort : Unsupported major.minor version 52.0
```

Giải pháp là cần biên dịch lại bằng JDK 1.8. Tuy nhiên, tôi đã gặp trường hợp sau khi triển khai vẫn gặp lỗi, sau khi khởi động lại máy chủ, vấn đề được giải quyết, không biết nguyên nhân là gì.

```
./configure --prefix=/usr/local/resin  --with-java=/usr/local/jdk1.8.0_121
make & make install
```
