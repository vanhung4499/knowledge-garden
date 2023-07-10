---
categories: [java]
title: Java Language Basic
date created: 2023-07-02
date modified: 2023-07-10
tags: [java]
---

## Kiểu dữ liệu

### Kiểu đóng gói (Wrapper Type)

Có tám kiểu cơ bản (Basic Type) và sẽ có các kiểu đóng gói tương ứng (Wrapper Type)

Basic Type|Wrapper Type|Size (bit)
---|---|--
boolean|Boolean|1
byte|Byte|8|
char|Character|16
short|Short|16
int|Integer|32
float|Float|32
long|Long|64
double|Double|64

Các kiểu cơ bản có thể được gán giá trị cho các kiểu đóng gói tương ứng và ngược lại thông qua quá trình autoboxing và unboxing. Ví dụ:

```java
Integer x = 2; // Autoboxing 
int y = x; // Unboxing
```

### Cache Pool

Sự khác biệt giữa `new Integer(123)` và `Integer.valueOf(123)` là:  

- `new Integer(123)` sẽ tạo một đối tượng mới mỗi lần gọi
- `Integer.valueOf(123)` sẽ sử dụng đối tượng từ bộ nhớ cache, nếu đã tồn tại. Nhiều lần gọi sẽ trả về cùng một tham chiếu đến đối tượng.

```java
Integer x = new Integer(123);
Integer y = new Integer(123);
System.out.println(x == y);    // false
Integer z = Integer.valueOf(123);
Integer k = Integer.valueOf(123);
System.out.println(z == k);   // true
```

Phương thức `valueOf()` được thực hiện đơn giản, trước tiên kiểm tra giá trị có trong bộ nhớ cache hay không, nếu có thì trả về đối tượng từ cache. Nếu không có, tạo một đối tượng mới.

```java
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high)
        return IntegerCache.cache[i + (-IntegerCache.low)];
    return new Integer(i);
}
```

Trong Java 8, kích thước bộ nhớ cache Integer mặc định là -128~127.

```java
static final int low = -128;
static final int high;
static final Integer cache[];

static {
    // high value may be configured by property
    int h = 127;
    String integerCacheHighPropValue =
        sun.misc.VM.getSavedProperty("java.lang.Integer.IntegerCache.high");
    if (integerCacheHighPropValue != null) {
        try {
            int i = parseInt(integerCacheHighPropValue);
            i = Math.max(i, 127);
            // Maximum array size is Integer.MAX_VALUE
            h = Math.min(i, Integer.MAX_VALUE - (-low) -1);
        } catch( NumberFormatException nfe) {
            // If the property cannot be parsed into an int, ignore it.
        }
    }
    high = h;

    cache = new Integer[(high - low) + 1];
    int j = low;
    for(int k = 0; k < cache.length; k++)
        cache[k] = new Integer(j++);

    // range [-128, 127] must be interned (JLS7 5.1.7)
    assert IntegerCache.high >= 127;
}
```

Trình biên dịch sẽ tự động gọi phương thức `valueOf()` cho các kiểu cơ bản nằm trong phạm vi bộ nhớ cache trong quá trình đóng gói tự động, do đó nhiều đối tượng Integer có giá trị giống nhau sẽ có cùng một tham chiếu.

```java
Integer m = 123;
Integer n = 123;
System.out.println(m == n); // true
```

Bộ nhớ cache cho các kiểu cơ bản như sau:

- boolean: true và false
- tất cả các giá trị byte
- short trong khoảng -128 đến 127
- giá trị int trong khoảng -128 đến 127
- giá trị char trong khoảng `\u0000` đến `\u007F`

Khi sử dụng các kiểu đóng gói tương ứng với các kiểu cơ bản này, có thể trực tiếp sử dụng các đối tượng từ bộ nhớ cache. Nếu nằm ngoài bộ nhớ cache:

```java
Integer m = 323;
Integer n = 323;
System.out.println(m == n); // false
```

## Chuỗi (String)

### Tổng quan

String được khai báo là `final`, do đó không thể kế thừa.

Nội bộ sử dụng mảng char để lưu trữ dữ liệu, mảng này được khai báo là `final`, điều này có nghĩa là sau khi khởi tạo, không thể tham chiếu đến mảng khác. Và String không có phương thức để thay đổi mảng giá trị, do đó đảm bảo **tính bất biến (immutable)**.

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    /** The value is used for character storage. */
    private final char value[];
```

### Lợi ích của bất biến

**1. Có thể lưu trữ giá trị hash và bộ đệm**

Vì giá trị hash của String thường được sử dụng, ví dụ như khi String được sử dụng làm khóa trong HashMap. Tính không thay đổi của String đảm bảo giá trị hash cũng không thay đổi, do đó chỉ cần tính toán một lần.  

**2. Yêu cầu của String Pool**  

Nếu một đối tượng String đã được tạo, thì sẽ lấy tham chiếu từ String Pool. Chỉ khi String là không thay đổi, mới có thể sử dụng String Pool.  

![Pasted image 20230702160800](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230702160800.png)

**3. Bảo mật**  

String thường được sử dụng làm tham số, tính không thay đổi của String đảm bảo tham số không thay đổi. Ví dụ: trong trường hợp sử dụng làm tham số kết nối mạng, nếu String là có thể thay đổi, thì trong quá trình kết nối mạng, String bị thay đổi, phía sử dụng String có thể nghĩ rằng đang kết nối với máy chủ khác, trong khi thực tế không nhất thiết như vậy.  

**4. An toàn đa luồng**  

Tính không thay đổi của String tự nhiên có tính an toàn đa luồng, có thể sử dụng an toàn trong nhiều luồng.

> [Program Creek : Why String is immutable in Java?](https://www.programcreek.com/2013/04/why-string-is-immutable-in-java/)

### String, StringBuffer and StringBuilder

1. Khả năng thay đổi:
    - String không thay đổi.
    - StringBuffer và StringBuilder có thể thay đổi.
2. An toàn đa luồng:
    - String không thay đổi, do đó là an toàn đa luồng.
    - StringBuilder không an toàn đa luồng.
    - StringBuffer an toàn đa luồng, sử dụng synchronized để đồng bộ hóa.

> [StackOverflow : String, StringBuffer, and StringBuilder](https://stackoverflow.com/questions/2971315/string-stringbuffer-and-stringbuilder)

### String.intern()

Sử dụng String.intern() để đảm bảo các biến chuỗi có cùng nội dung tham chiếu đến cùng một đối tượng bộ nhớ.

Trong ví dụ dưới đây, `s1` và `s2` được tạo bằng cách sử dụng `new String()`, tạo ra hai đối tượng khác nhau. Trong khi đó, `s3` được lấy từ `s1.intern()`, trả về tham chiếu đến đối tượng trong String Pool. Do đó, `s3` và `s1` tham chiếu đến cùng một đối tượng trong String Pool.

```java
String s1 = new String("aaa");
String s2 = new String("aaa");
System.out.println(s1 == s2);           // false
String s3 = s1.intern();
System.out.println(s1.intern() == s3);  // true
```

Nếu sử dụng cách tạo chuỗi bằng cách sử dụng dấu ngoặc kép, đối tượng mới sẽ tự động được đặt vào String Pool.

```java
String s4 = "bbb";
String s5 = "bbb";
System.out.println(s4 == s5);  // true
```

**Vị trí lưu trữ của String Pool trong HotSpot:**

1. **Runtime Constant Pool** là một phần của phạm vi phương thức trong quy tắc của **máy ảo Java (JVM)**. Nó được tạo ra khi lớp và cấu trúc được tải vào máy ảo Java. Trong quá trình này, các chuỗi hằng số được lưu trữ trong vị trí gọi là **String Pool**. Vì vậy, từ góc nhìn này, String Pool thuộc về phạm vi phương thức trong quy tắc của máy ảo Java, nó là một khái niệm logic. Trong khi đó, Heap (Không gian động), PermGen (Vùng không gian vĩnh viễn) và Metaspace (Không gian siêu dữ liệu) là các vị trí thực tế để lưu trữ dữ liệu.
2. Quy tắc về phạm vi máy ảo khác nhau (ví dụ: phạm vi phương thức) có thể khác nhau, chỉ có HotSpot mới có khái niệm về PermGen.
3. HotSpot cũng đang phát triển, do một số vấn đề tồn tại, HotSpot đang dần loại bỏ PermGen. Vị trí lưu trữ thực tế cũng khác nhau đối với các phiên bản JDK khác nhau, xem bảng dưới đây:

|JDK Version|PermGen có tồn tại?|Vị trí String Pool|
|---|---|---|
|JDK 1.6 và trước|Có|Nằm trong PermGen|
|JDK 1.7|Có|Di chuyển vào Heap|
|JDK 1.8 và sau|Không|Nằm trong Metaspace|

## Operation

### Truyền tham số (pass paramater)

Tham số trong Java được truyền theo cách truyền giá trị, chứ không phải truyền tham chiếu.  

Trong đoạn mã dưới đây, `dog` trong hàm `main` là một con trỏ, lưu trữ địa chỉ của đối tượng. Khi một tham số được truyền vào một phương thức, thực chất là truyền địa chỉ của đối tượng dưới dạng giá trị cho tham số hình thức. Do đó, khi thay đổi đối tượng mà con trỏ đang trỏ đến trong phương thức, hai con trỏ này sẽ trỏ đến hai đối tượng hoàn toàn khác nhau, và việc thay đổi nội dung của đối tượng một bên sẽ không ảnh hưởng đến bên kia.

```java
public class Dog {
    String name;

    Dog(String name) {
        this.name = name;
    }

    String getName() {
        return this.name;
    }

    void setName(String name) {
        this.name = name;
    }

    String getObjectAddress() {
        return super.toString();
    }
}
```

```java
public class PassByValueExample {
    public static void main(String[] args) {
        Dog dog = new Dog("A");
        System.out.println(dog.getObjectAddress()); // Dog@4554617c
        func(dog);
        System.out.println(dog.getObjectAddress()); // Dog@4554617c
        System.out.println(dog.getName());          // A
    }

    private static void func(Dog dog) {
        System.out.println(dog.getObjectAddress()); // Dog@4554617c
        dog = new Dog("B");
        System.out.println(dog.getObjectAddress()); // Dog@74a14482
        System.out.println(dog.getName());          // B
    }
}
```

Tuy nhiên, nếu thay đổi giá trị của trường trong đối tượng, giá trị của đối tượng gốc cũng sẽ thay đổi, vì cả hai đang trỏ đến cùng một địa chỉ.

```java
class PassByValueExample {
    public static void main(String[] args) {
        Dog dog = new Dog("A");
        func(dog);
        System.out.println(dog.getName());          // B
    }

    private static void func(Dog dog) {
        dog.setName("B");
    }
}
```

> [StackOverflow: Is Java “pass-by-reference” or “pass-by-value”?](https://stackoverflow.com/questions/40480/is-java-pass-by-reference-or-pass-by-value)

### float vs double

Giá trị `1.1` là kiểu `double`, không thể gán trực tiếp cho biến `float` vì đây là một quá trình ép kiểu xuống (down casting). Java không thể tự động thực hiện ép kiểu xuống vì điều này sẽ làm giảm độ chính xác.

```java
// float f = 1.1;
```

`1.1f` là kiểu `float`.

```java
float f = 1.1f;
```

### Ép kiểu ngầm định

Vì giá trị `1` là kiểu `int`, có độ chính xác cao hơn kiểu `short`, nên không thể ép kiểu ngầm định từ `int` sang `short`.

```java
short s1 = 1;
// s1 = s1 + 1;
```

 Tuy nhiên, việc sử dụng toán tử `+=` cho phép thực hiện ép kiểu ngầm định.

```java
s1 += 1;
```

  Câu lệnh trên tương đương với

```java
s1 = (short) (s1 + 1);
```

> [StackOverflow : Why don't Java's +=, -=, *=, /= compound assignment operators require casting?](https://stackoverflow.com/questions/8710619/why-dont-javas-compound-assignment-operators-require-casting)

### switch

Từ Java 7 trở đi, có thể sử dụng đối tượng String trong câu lệnh `switch`.

```java
String s = "a";
switch (s) {
    case "a":
        System.out.println("aaa");
        break;
    case "b":
        System.out.println("bbb");
        break;
}
```

 Câu lệnh `switch` không hỗ trợ kiểu long vì `switch` được thiết kế ban đầu để so sánh giá trị của một số lượng nhỏ các giá trị, nếu giá trị quá phức tạp thì sử dụng câu lệnh `if` là phù hợp hơn.

```java
// long x = 111;
// switch (x) { // Incompatible types. Found: 'long', required: 'char, byte, short, int, Character, Byte, Short, Integer, String, or an enum'
//     case 111:
//         System.out.println(111);
//         break;
//     case 222:
//         System.out.println(222);
//         break;
// }
```

> [StackOverflow : Why can't your switch statement data type be long, Java?](https://stackoverflow.com/questions/2676210/why-cant-your-switch-statement-data-type-be-long-java)

## Kế thừa (Inheritance)

### Quyền truy cập (Access Modifier)

Trong Java, có ba từ khóa quyền truy cập: `private`, `protected` và `public`. Nếu không có từ khóa quyền truy cập, nghĩa là chỉ có thể truy cập trong phạm vi gói (`package`).

Có thể áp dụng từ khóa quyền truy cập cho lớp hoặc thành viên của lớp (trường - field và phương thức - method).

- Quyền truy cập của lớp cho phép các lớp khác tạo đối tượng từ lớp đó.
- Quyền truy cập của thành viên cho phép các lớp khác truy cập thành viên đó thông qua đối tượng của lớp.

Từ khóa `protected` được sử dụng để chỉ ra rằng thành viên có thể được truy cập từ các lớp con trong hệ thống kế thừa, nhưng từ khóa này không có ý nghĩa đối với lớp.

Một module tốt được thiết kế để ẩn tất cả các chi tiết cài đặt, tách rời giao diện (interface) của nó và cài đặt một cách rõ ràng. Các module chỉ giao tiếp thông qua giao diện (interface) của chúng, một module không cần biết về cách thức hoạt động bên trong của các module khác, điều này được gọi là ẩn thông tin hoặc đóng gói. Do đó, quyền truy cập nên được sử dụng để giới hạn việc truy cập từ bên ngoài cho mỗi lớp hoặc thành viên.

Nếu một phương thức trong lớp con ghi đè phương thức trong lớp cha, thì quyền truy cập của phương thức trong lớp con không được phép thấp hơn quyền truy cập của phương thức trong lớp cha. Điều này đảm bảo rằng mọi nơi mà một thể hiện của lớp cha có thể được sử dụng, một thể hiện của lớp con cũng có thể được sử dụng, đồng nghĩa với việc tuân thủ **nguyên tắc thay thế Liskov**.  

Các trường không bao giờ được công khai, vì điều này sẽ mất đi sự kiểm soát về hành vi thay đổi trường từ phía khách hàng. Ví dụ, trong ví dụ dưới đây, `AccessExample` có trường `id` công khai. Nếu tại một thời điểm nào đó, chúng ta muốn sử dụng `int` để lưu trữ trường `id`, chúng ta sẽ phải sửa đổi tất cả mã khách hàng.

```java
public class AccessExample { public String id; } 
```

Thay vào đó, có thể sử dụng các phương thức `getter` và `setter` công khai để thay thế trường công khai, điều này cho phép kiểm soát hành vi thay đổi trường.

```java
public class AccessExample {

    private int id;

    public String getId() {
        return id + "";
    }

    public void setId(String id) {
        this.id = Integer.valueOf(id);
    }
}
```

Tuy nhiên, có một ngoại lệ, nếu lớp có phạm vi gói hoặc lớp lồng nhau có phạm vi riêng tư, việc tiếp cận trực tiếp thành viên sẽ không ảnh hưởng nhiều.

```java
public class AccessWithInnerClassExample {
    private class InnerClass {
        int x;
    }

    private InnerClass innerClass;

    public AccessWithInnerClassExample() {
        innerClass = new InnerClass();
    }

    public int getValue() {
        return innerClass.x;  // Direct access
    }
}
```

### Abstract Class vs Interface

#### Abstract Class

Lớp trừu tượng (abstract class) và phương thức trừu tượng (abstract method) được khai báo bằng từ khóa `abstract`. Lớp trừu tượng thường chứa các phương thức trừu tượng và phương thức trừu tượng phải nằm trong lớp trừu tượng.

Lớp trừu tượng không thể được khởi tạo trực tiếp, mà cần được kế thừa để tạo đối tượng từ lớp con.

```java
public abstract class AbstractClassExample {

    protected int x;
    private int y;

    public abstract void func1();

    public void func2() {
        System.out.println("func2");
    }
}
```

```java
public class AbstractExtendClassExample extends AbstractClassExample {
    @Override
    public void func1() {
        System.out.println("func1");
    }
}
```

```java
// AbstractClassExample ac1 = new AbstractClassExample(); // 'AbstractClassExample' is abstract; cannot be instantiated
AbstractClassExample ac2 = new AbstractExtendClassExample();
ac2.func1();
```

### Inteface

Giao diện (Interface) là một mở rộng của lớp trừu tượng. Trước Java 8, giao diện được coi là một lớp hoàn toàn trừu tượng, có nghĩa là không có phương thức được triển khai.

Từ Java 8 trở đi, giao diện cũng có thể có các phương thức mặc định, vì việc duy trì giao diện không hỗ trợ phương thức mặc định là không hiệu quả. Trước Java 8, nếu một giao diện muốn thêm các phương thức mới, tất cả các lớp đã triển khai giao diện đó phải được sửa đổi.

Các thành viên của giao diện (trường + phương thức) mặc định đều là `public` và không được phép định nghĩa là `private` hoặc `protected`.

Các trường của giao diện mặc định là `static` và `final`.

```java
public interface InterfaceExample {
    void func1();

    default void func2(){
        System.out.println("func2");
    }

    int x = 123;
    // int y;               // Variable 'y' might not have been initialized
    public int z = 0;       // Modifier 'public' is redundant for interface fields
    // private int k = 0;   // Modifier 'private' not allowed here
    // protected int l = 0; // Modifier 'protected' not allowed here
    // private void fun3(); // Modifier 'private' not allowed here
}
```

```java
public class InterfaceImplementExample implements InterfaceExample {
    @Override
    public void func1() {
        System.out.println("func1");
    }
}
```

```java
// InterfaceExample ie1 = new InterfaceExample(); // 'InterfaceExample' is abstract; cannot be instantiated
InterfaceExample ie2 = new InterfaceImplementExample();
ie2.func1();
System.out.println(InterfaceExample.x);s
```

#### So sánh

- Từ góc nhìn thiết kế, lớp trừu tượng cung cấp một mối quan hệ IS-A, điều này đòi hỏi đối tượng con phải có thể thay thế tất cả các đối tượng cha. Trong khi đó, giao diện giống như một mối quan hệ LIKE-A, nó chỉ cung cấp một hợp đồng thực hiện phương thức và không yêu cầu giao diện và lớp thực hiện giao diện có mối quan hệ IS-A.
- Về việc sử dụng, một lớp có thể thực hiện nhiều giao diện nhưng không thể kế thừa nhiều lớp trừu tượng.
- Trường của giao diện chỉ có thể là kiểu `static` và `final`, trong khi trường của lớp trừu tượng không có ràng buộc này.
- Thành viên của giao diện chỉ có thể là `public`, trong khi thành viên của lớp trừu tượng có thể có nhiều quyền truy cập khác nhau.

#### Lựa chọn sử dụng

- Sử dụng giao diện khi:
	- Cần để các lớp không liên quan cùng thực hiện một phương thức, ví dụ như các lớp không liên quan có thể thực hiện phương thức `compareTo()` trong giao diện `Comparable`
	- Cần sử dụng đa kế thừa.
- Sử dụng lớp trừu tượng khi:
	- Cần chia sẻ mã giữa một số lớp liên quan
	- Cần kiểm soát quyền truy cập của thành viên được kế thừa, không nhất thiết phải là public
	- Cần kế thừa các trường không phải là static và hằng số.

Trong nhiều trường hợp, giao diện được ưu tiên hơn lớp trừu tượng vì giao diện không yêu cầu một cấu trúc lớp chặt chẽ như lớp trừu tượng, cho phép linh hoạt thêm hành vi cho một lớp. Và từ Java 8 trở đi, giao diện cũng có thể có các phương thức mặc định, làm giảm chi phí sửa đổi giao diện.

- [IBM Developer](https://www.ibm.com/developerworks/java/l-javainterface-abstract/)
- [When to Use Abstract Class and Interface](https://dzone.com/articles/when-to-use-abstract-class-and-intreface)

### super

- Sử dụng `super` để truy cập `constructor` của lớp cha: có thể sử dụng `super()` để truy cập `constructor` của lớp cha và giao phó cho lớp cha thực hiện một số công việc khởi tạo.
- Truy cập thành viên của lớp cha: nếu lớp con ghi đè phương thức cụ thể của lớp cha, có thể sử dụng từ khóa `super` để tham chiếu đến cài đặt phương thức của lớp cha.

```java
public class SuperExample {
    protected int x;
    protected int y;

    public SuperExample(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public void func() {
        System.out.println("SuperExample.func()");
    }
}
```

```java
public class SuperExtendExample extends SuperExample {
    private int z;

    public SuperExtendExample(int x, int y, int z) {
        super(x, y);
        this.z = z;
    }

    @Override
    public void func() {
        super.func();
        System.out.println("SuperExtendExample.func()");
    }
}
```

```java
SuperExample e = new SuperExtendExample(1, 2, 3);
e.func();
```

```java
SuperExample.func()
SuperExtendExample.func()
```

> [Using the Keyword super](https://docs.oracle.com/javase/tutorial/java/IandI/super.html)

### Override and Overload

**1. Ghi đè (Override)**

Tồn tại trong hệ thống kế thừa, chỉ ra rằng lớp con triển khai một phương thức hoàn toàn giống với phương thức của lớp cha trong khai báo.

Để tuân thủ nguyên tắc thay thế Liskov, ghi đè có hai giới hạn sau:

- Phạm vi truy cập của phương thức lớp con phải lớn hơn hoặc bằng phạm vi truy cập của phương thức lớp cha
- Kiểu trả về của phương thức lớp con phải là kiểu trả về của phương thức lớp cha hoặc là một kiểu con của nó

Sử dụng chú thích `@Override` có thể giúp trình biên dịch kiểm tra xem có đáp ứng hai giới hạn trên hay không.

**2. Nạp chồng (Overload)**

Tồn tại trong cùng một lớp, chỉ ra rằng một phương thức có cùng tên với một phương thức đã tồn tại, nhưng có ít nhất một tham số khác về kiểu dữ liệu, số lượng hoặc thứ tự.

Cần lưu ý rằng việc khác nhau về giá trị trả về không được coi là nạp chồng.

## Common Object methods

### Tổng quan

```java
public final native Class<?> getClass()

public native int hashCode()

public boolean equals(Object obj)

protected native Object clone() throws CloneNotSupportedException

public String toString()

public final native void notify()

public final native void notifyAll()

public final native void wait(long timeout) throws InterruptedException

public final void wait(long timeout, int nanos) throws InterruptedException

public final void wait() throws InterruptedException

protected void finalize() throws Throwable {}
```

### equals()

**1. Mối quan hệ tương đương (Equivalence relation)**

(1) Tính phản xạ

```java
x.equals(x); // true
```

(2) Tính đối xứng

```java
x.equals(y) == y.equals(x); // true
```

(3) Tính bắc cầu

```java
if (x.equals(y) && y.equals(z))
    x.equals(z); // true;
```

(4) Tính nhất quán

Kết quả gọi phương thức `equals()` nhiều lần không thay đổi

```java
x.equals(y) == x.equals(y); // true
```

(5) So sánh với null

Gọi `x.equals(null)` trên bất kỳ đối tượng x nào không `null` trả về false

```java
x.equals(null); // false;
```

**2. equals() và ` == `**

- Đối với kiểu dữ liệu nguyên thuỷ, toán tử == kiểm tra xem hai giá trị có bằng nhau hay không, kiểu dữ liệu cơ bản không có phương thức `equals()`.
- Đối với kiểu dữ liệu tham chiếu, toán tử == kiểm tra xem hai biến có tham chiếu đến cùng một đối tượng hay không, trong khi `equals()` kiểm tra xem hai đối tượng có tương đương nhau hay không.

```java
Integer x = new Integer(1);
Integer y = new Integer(1);
System.out.println(x.equals(y)); // true
System.out.println(x == y);      // false
```

**3. Thực hành**

- Kiểm tra xem hai biến có tham chiếu đến cùng một đối tượng hay không, nếu có thì trả về `true`.
- Kiểm tra xem hai biến có cùng kiểu dữ liệu hay không, nếu không thì trả về false.
- Ép kiểu đối tượng thành kiểu `Object`.
- So sánh từng trường quan trọng để xem chúng có bằng nhau hay không.

```java
public class EqualExample {
    private int x;
    private int y;
    private int z;

    public EqualExample(int x, int y, int z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        EqualExample that = (EqualExample) o;

        if (x != that.x) return false;
        if (y != that.y) return false;
        return z == that.z;
    }
}
```

### hashCode()

Phương thức `hashCode()` trả về giá trị băm (hash code), trong khi `equals()` được sử dụng để kiểm tra xem hai đối tượng có tương đương nhau hay không. Hai đối tượng tương đương nhau sẽ có cùng giá trị băm, nhưng hai đối tượng có cùng giá trị băm không nhất thiết là tương đương nhau.  

Khi ghi đè phương thức `equals()`, luôn nên ghi đè phương thức `hashCode()` để đảm bảo rằng hai đối tượng tương đương sẽ có cùng giá trị băm.

Trong đoạn mã dưới đây, tạo hai đối tượng tương đương và thêm chúng vào `HashSet`. Chúng ta muốn coi hai đối tượng này như là một, chỉ thêm một đối tượng vào tập hợp. Tuy nhiên, vì `EqualExample` không ghi đè phương thức `hashCode()`, nên hai đối tượng này có giá trị băm khác nhau, dẫn đến tập hợp thêm hai đối tượng tương đương.

```java
EqualExample e1 = new EqualExample(1, 1, 1);
EqualExample e2 = new EqualExample(1, 1, 1);
System.out.println(e1.equals(e2)); // true
HashSet<EqualExample> set = new HashSet<>();
set.add(e1);
set.add(e2);
System.out.println(set.size());   // 2
```

Hàm băm lý tưởng nên có tính đều đặn, tức là các đối tượng không tương đương nên được phân bố đều trên tất cả các giá trị băm có thể. Điều này đòi hỏi hàm băm phải xem xét tất cả các trường dữ liệu, có thể coi mỗi trường như một bit trong hệ thống cơ số R, sau đó tạo thành một số nguyên hệ cơ số R. R thường chọn là 31, vì nó là một số nguyên tố lẻ. Nếu chọn số chẵn, khi có sự tràn số trong phép nhân, thông tin sẽ bị mất đi vì phép nhân với 2 tương đương với dịch trái một bit.

Phép nhân với 31 có thể được chuyển đổi thành phép dịch và trừ: `31*x == (x<<5)-x`, trình biên dịch sẽ tự động tối ưu hóa điều này.

```java
@Override
public int hashCode() {
    int result = 17;
    result = 31 * result + x;
    result = 31 * result + y;
    result = 31 * result + z;
    return result;
}
```

### toString()

Theo mặc định, nó trả về dạng `ToStringExample@4554617c`, trong đó giá trị phía sau @ là biểu diễn thập lục phân không dấu của mã băm.

```java
public class ToStringExample {
    private int number;

    public ToStringExample(int number) {
        this.number = number;
    }
}
```

```java
ToStringExample example = new ToStringExample(123);
System.out.println(example.toString());
```

```java
ToStringExample@4554617c
```

### clone()

**1. cloneable**

Phương thức `clone()` là một phương thức `protected` của lớp `Object`, không phải là `public`. Một lớp không ghi đè một phương thức `clone()` mà không cho phép lớp khác gọi trực tiếp phương thức `clone()` của một đối tượng của nó.

```java
public class CloneExample {
    private int a;
    private int b;
}
```

```java
CloneExample e1 = new CloneExample();
// CloneExample e2 = e1.clone(); // 'clone()' has protected access in 'java.lang.Object'
```

Để ghi đè phương thức `clone()`, ta có thể thực hiện như sau:

```java
public class CloneExample {
    private int a;
    private int b;

    @Override
    protected CloneExample clone() throws CloneNotSupportedException {
        return (CloneExample)super.clone();
    }
}
```

```java
CloneExample e1 = new CloneExample();
try {
    CloneExample e2 = e1.clone();
} catch (CloneNotSupportedException e) {
    e.printStackTrace();
}
```

```html
java.lang.CloneNotSupportedException: CloneExample
```

Ở trên, `CloneNotSupportedException` được thả vì `CloneExample` không triển khai giao diện `Cloneable`.

Cần lưu ý rằng phương thức `clone()` không phải là một phương thức của giao diện `Cloneable`, mà là một phương thức `protected` của `Object`. Giao diện `Cloneable` chỉ quy định rằng nếu một lớp không triển khai giao diện `Cloneable` và gọi phương thức `clone()`, `CloneNotSupportedException` sẽ được thả.

```java
public class CloneExample implements Cloneable {
    private int a;
    private int b;

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

**2. Sao chép nông (Shallow Clone)**

Sao chép đối tượng và các tham chiếu đến đối tượng gốc cùng trỏ đến cùng một đối tượng.

```java
public class ShallowCloneExample implements Cloneable {
    private int[] arr;

    public ShallowCloneExample() {
        arr = new int[10];
        for (int i = 0; i < arr.length; i++) {
            arr[i] = i;
        }
    }

    public void set(int index, int value) {
        arr[index] = value;
    }

    public int get(int index) {
        return arr[index];
    }

    @Override
    protected ShallowCloneExample clone() throws CloneNotSupportedException {
        return (ShallowCloneExample) super.clone();
    }
}
```

```java
ShallowCloneExample e1 = new ShallowCloneExample();
ShallowCloneExample e2 = null;
try {
    e2 = e1.clone();
} catch (CloneNotSupportedException e) {
    e.printStackTrace();
}
e1.set(2, 222);
System.out.println(e2.get(2)); // 222
```

**3. Sao chép sâu (Deep Clone)**

Sao chép đối tượng và các tham chiếu đến đối tượng gốc trỏ đến các đối tượng khác.

```java
public class DeepCloneExample implements Cloneable {
    private int[] arr;

    public DeepCloneExample() {
        arr = new int[10];
        for (int i = 0; i < arr.length; i++) {
            arr[i] = i;
        }
    }

    public void set(int index, int value) {
        arr[index] = value;
    }

    public int get(int index) {
        return arr[index];
    }

    @Override
    protected DeepCloneExample clone() throws CloneNotSupportedException {
        DeepCloneExample result = (DeepCloneExample) super.clone();
        result.arr = new int[arr.length];
        for (int i = 0; i < arr.length; i++) {
            result.arr[i] = arr[i];
        }
        return result;
    }
}
```

```java
DeepCloneExample e1 = new DeepCloneExample();
DeepCloneExample e2 = null;
try {
    e2 = e1.clone();
} catch (CloneNotSupportedException e) {
    e.printStackTrace();
}
e1.set(2, 222);
System.out.println(e2.get(2)); // 2
```

**4. Thay thế cho clone()**

Sử dụng phương thức `clone()` để sao chép một đối tượng là phức tạp và có rủi ro, nó có thể gây ra ngoại lệ và yêu cầu ép kiểu. Trong cuốn **Effective Java**, nói rằng tốt nhất là không sử dụng `clone()`, có thể sử dụng `constructor` hoặc `factory method` để sao chép một đối tượng.

```java
public class CloneConstructorExample {
    private int[] arr;

    public CloneConstructorExample() {
        arr = new int[10];
        for (int i = 0; i < arr.length; i++) {
            arr[i] = i;
        }
    }

    public CloneConstructorExample(CloneConstructorExample original) {
        arr = new int[original.arr.length];
        for (int i = 0; i < original.arr.length; i++) {
            arr[i] = original.arr[i];
        }
    }

    public void set(int index, int value) {
        arr[index] = value;
    }

    public int get(int index) {
        return arr[index];
    }
}
```

```java
CloneConstructorExample e1 = new CloneConstructorExample();
CloneConstructorExample e2 = new CloneConstructorExample(e1);
e1.set(2, 222);
System.out.println(e2.get(2)); // 2
```

## Từ khoá (Keyword)

### final

**1. Biến (Variable)**

Khai báo biến là hằng số, có thể là hằng số biên dịch hoặc là hằng số không thể thay đổi sau khi được khởi tạo trong quá trình chạy.

- Đối với kiểu dữ liệu nguyên thuỷ, `final` làm cho giá trị không thay đổi
- Dối với kiểu dữ liệu tham chiếu, `final` làm cho tham chiếu không thay đổi, tức không thể tham chiếu đến đối tượng khác, nhưng đối tượng được tham chiếu có thể được thay đổi.

```java
final int x = 1;
// x = 2;  // cannot assign value to final variable 'x'
final A y = new A();
y.a = 1;
```

**2. Phương thức (Method)**

Phương thức không thể được ghi đè bởi lớp con.

Phương thức `private` mặc định được xem như là `final`, nếu phương thức trong lớp con có cùng tên với một phương thức `private` trong lớp cha, thì phương thức trong lớp con không phải là việc ghi đè phương thức của lớp cha, mà là định nghĩa một phương thức mới trong lớp con.

**3. Lớp (Class)**

Lớp khai báo `final` không thể được kế thừa.

### static

**1. Biến tĩnh (static variable)**

- Biến tĩnh (static variable): còn được gọi là biến lớp, nghĩa là biến thuộc về lớp, tất cả các thể hiện của lớp đều chia sẻ biến static và có thể truy cập trực tiếp thông qua tên lớp. biến static chỉ tồn tại một lần trong bộ nhớ.
- Biến thể hiện (instance variable): Mỗi khi một thể hiện được tạo, một biến thể hiện sẽ được tạo, biến này sống và chết cùng với thể hiện.

```java
public class A {
    private int x;         // instance varibale
    private static int y;  // static variable

    public static void main(String[] args) {
        // int x = A.x;  // Non-static field 'x' cannot be referenced from a static context
        A a = new A();
        int x = a.x;
        int y = A.y;
    }
}
```

**2. Phương thức tĩnh (static method)**

Một phương thức tĩnh tồn tại khi lớp được tải vào bộ nhớ, không phụ thuộc vào bất kỳ thể hiện nào. Vì vậy, phương thức static phải có một thân thực hiện và không thể là phương thức trừu tượng (abstract).

```java
public abstract class A {
    public static void func1(){
    }
    // public abstract static void func2();  // Illegal combination of modifiers: 'abstract' and 'static'
}
```

Chỉ có thể truy cập các trường tĩnh và các phương thức tĩnh của lớp mà nó thuộc về và các phương thức không thể có từ khóa `this` và `super`.

```java
public class A {
    private static int x;
    private int y;

    public static void func1(){
        int a = x;
        // int b = y;  // Non-static field 'y' cannot be referenced from a static context
        // int b = this.y;     // 'A.this' cannot be referenced from a static context
    }
}
```

**3. Khối tĩnh (static block)**

Các khối câu lệnh tĩnh được thực thi một lần khi lớp được tải vào bộ nhớ.

```java
public class A {
    static {
        System.out.println("123");
    }

    public static void main(String[] args) {
        A a1 = new A();
        A a2 = new A();
    }
}
```

```bash
123
```

**4. Lớp bên trong tĩnh (static inner class)**

Một lớp bên trong không tĩnh phụ (non-static inner class) thuộc vào một thể hiện của lớp bên ngoài, trong khi một lớp bên trong tĩnh thì không.

```java
public class OuterClass {
    class InnerClass {
    }

    static class StaticInnerClass {
    }

    public static void main(String[] args) {
        // InnerClass innerClass = new InnerClass(); // 'OuterClass.this' cannot be referenced from a static context
        OuterClass outerClass = new OuterClass();
        InnerClass innerClass = outerClass.new InnerClass();
        StaticInnerClass staticInnerClass = new StaticInnerClass();
    }
}
```

Các lớp bên trong tĩnh không thể truy cập các biến và phương thức không tĩnh của các lớp bên ngoài.

**5. Nhập gói tĩnh (static import)**

Khi sử dụng biến và phương thức static, không cần chỉ định tên lớp, giúp viết code ngắn gọn hơn, nhưng độ dễ đọc của code giảm đi.

```java
import static com.xxx.ClassName.*
```

**6. Trình tự khởi tạo**

Biến static và khối static được khởi tạo trước biến thể hiện và khối thường, thứ tự khởi tạo của biến static và khối static phụ thuộc vào thứ tự xuất hiện trong mã nguồn.

```java
public static String staticField = "static field";
```

```java
static {
    System.out.println("static block");
}
```

```java
public String field = "instance field";
```

```java
{
    System.out.println("block");
}
```

Cuối cùng là khởi tạo hàm tạo (constructor).

```java
public InitialOrderTest() {
    System.out.println("constructor");
}
```

Trong trường hợp kế thừa, thứ tự khởi tạo là:

- Lớp cha (biến static và khối static)
- Lớp con (biến static và khối static)
- Lớp cha (biến thể hiện và khối thường)
- Lớp cha (constructor)
- Lớp con (biến thể hiện và khối thường), lớp con (constructor).

## Phản chiếu (Reflect)

Mỗi lớp đều có một đối tượng **Class**, chứa thông tin liên quan đến lớp. Khi biên dịch một lớp mới, một tệp `.class` cùng tên sẽ được tạo ra, nội dung của tệp này lưu trữ đối tượng Class. Quá trình tải lớp tương đương với việc tải đối tượng Class.

Lớp chỉ được tải vào **JVM** khi được sử dụng lần đầu tiên, và có thể sử dụng `Class.forName("com.mysql.jdbc.Driver")` để kiểm soát việc tải lớp này, phương thức này sẽ trả về một đối tượng Class.

Reflection cho phép cung cấp thông tin về lớp trong thời gian chạy và lớp này có thể được tải vào trong thời gian chạy, thậm chí khi không có tệp `.class` của lớp này tồn tại trong quá trình biên dịch.

`Class` và `java.lang.reflect` cung cấp hỗ trợ cho reflection, thư viện `java.lang.reflect` chủ yếu bao gồm ba lớp sau:

- **Field**: cho phép đọc và sửa đổi các trường liên quan đến đối tượng Field thông qua các phương thức get() và set()
- **Method**: cho phép gọi các phương thức liên quan đến đối tượng Method thông qua phương thức invoke()
- **Constructor**: cho phép tạo đối tượng mới thông qua lớp Constructor.

**Advantages of Using Reflection:**

- **Extensibility Features** : An application may make use of external, user-defined classes by creating instances of extensibility objects using their fully-qualified names.
- **Class Browsers and Visual Development Environments** : A class browser needs to be able to enumerate the members of classes. Visual development environments can benefit from making use of type information available in reflection to aid the developer in writing correct code.
- **Debuggers and Test Tools** : Debuggers need to be able to examine private members on classes. Test harnesses can make use of reflection to systematically call a discoverable set APIs defined on a class, to insure a high level of code coverage in a test suite.

**Drawbacks of Reflection:**

Reflection is powerful, but should not be used indiscriminately. If it is possible to perform an operation without using reflection, then it is preferable to avoid using it. The following concerns should be kept in mind when accessing code via reflection.

- **Performance Overhead** : Because reflection involves types that are dynamically resolved, certain Java virtual machine optimizations can not be performed. Consequently, reflective operations have slower performance than their non-reflective counterparts, and should be avoided in sections of code which are called frequently in performance-sensitive applications.
- **Security Restrictions** : Reflection requires a runtime permission which may not be present when running under a security manager. This is in an important consideration for code which has to run in a restricted security context, such as in an Applet.
- **Exposure of Internals** :Since reflection allows code to perform operations that would be illegal in non-reflective code, such as accessing private fields and methods, the use of reflection can result in unexpected side-effects, which may render code dysfunctional and may destroy portability. Reflective code breaks abstractions and therefore may change behavior with upgrades of the platform.

> [[Java Exception]]

## Ngoại lệ (Exception)

`Throwable` có thể được sử dụng để đại diện cho bất kỳ lớp nào có thể được ném như một ngoại lệ, được chia thành hai loại: `Error` và `Exception`. Trong đó, `Error` được sử dụng để đại diện cho các lỗi mà **JVM** không thể xử lý, Exception được chia thành hai loại:

- Exception kiểm tra: cần phải bắt và xử lý bằng câu lệnh try…catch… và có thể phục hồi từ ngoại lệ
- Exception không kiểm tra: là các lỗi xảy ra trong quá trình thực thi chương trình, ví dụ như chia cho 0 sẽ gây ra Arithmetic Exception, trong trường hợp này chương trình sẽ bị crash và không thể phục hồi.

![Pasted image 20230702190438](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230702190438.png)

Đọc thêm: [[Java Reflection]]

## Generic

```java
public class Box<T> {
    // T stands for "Type"
    private T t;
    public void set(T t) { this.t = t; }
    public T get() { return t; }
}
```

Đọc thêm: [[Java Generics]]

## Annotation

Chú thích (Annotation) trong Java là các thông tin bổ sung được đính kèm trong mã nguồn, được sử dụng bởi các công cụ để phân tích và sử dụng trong quá trình biên dịch và thực thi. Chú thích không ảnh hưởng và không thay đổi logic thực tế của mã nguồn, mà chỉ đóng vai trò phụ trợ.

Đọc thêm: [[Java Annotation]]

## Feature

### Các tính năng mới trong Java

**New highlights in Java SE 8**

1. Lambda Expressions
2. Pipelines and Streams
3. Date and Time API
4. Default Methods
5. Type Annotations
6. Nashhorn JavaScript Engine
7. Concurrent Accumulators
8. Parallel operations
9. PermGen Error Removed

**New highlights in Java SE 7**

1. Strings in Switch Statement
2. Type Inference for Generic Instance Creation
3. Multiple Exception Handling
4. Support for Dynamic Languages
5. Try with Resources
6. Java nio Package
7. Binary Literals, Underscore in literals
8. Diamond Syntax

> [Difference between Java 1.8 and Java 1.7?](http://www.selfgrowth.com/articles/difference-between-java-18-and-java-17)

### Sự khác biệt Java vs C++

- Java là một ngôn ngữ hướng đối tượng thuần túy, tất cả các đối tượng đều kế thừa từ java.lang.Object. C++ hỗ trợ cả hướng đối tượng và hướng thủ tục để tương thích với C.
- Java sử dụng máy ảo để đạt được tính chất đa nền tảng, trong khi C++ phụ thuộc vào nền tảng cụ thể.
- Java không có con trỏ, thay vào đó, tham chiếu trong Java có thể hiểu là con trỏ an toàn, trong khi C++ có con trỏ giống như C.
- Java hỗ trợ thu gom rác tự động, trong khi C++ cần phải thu gom rác thủ công.
- Java không hỗ trợ đa kế thừa, chỉ có thể đạt được cùng mục đích thông qua việc triển khai nhiều giao diện, trong khi C++ hỗ trợ đa kế thừa.
- Java không hỗ trợ nạp chồng toán tử, mặc dù có thể thực hiện phép cộng cho hai đối tượng String, nhưng đây là một phép toán được hỗ trợ sẵn trong ngôn ngữ, không thuộc về nạp chồng toán tử, trong khi C++ có thể.
- Từ khóa `goto` trong Java là từ khóa được dành riêng nhưng không sử dụng được, trong khi C++ có thể sử dụng `goto`.
- Java không hỗ trợ biên dịch có điều kiện, C++ sử dụng các lệnh tiền xử lý như `#ifdef` `#ifndef` để thực hiện biên dịch có điều kiện.

> [What are the main differences between Java and C++?](http://cs-fundamentals.com/tech-interview/java/differences-between-java-and-cpp.php)

### JRE vs JDK

- JRE is the JVM program, Java application need to run on JRE.
- JDK is a superset of JRE, JRE + tools for developing java programs. e.g, it provides the compiler "javac"
