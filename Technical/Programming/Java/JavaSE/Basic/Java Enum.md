---
title: Java Enum
tags: [java, javase]
categories: [java, javase, enum]
date created: 2023-07-13
date modified: 2023-07-13
---

# Hiểu sâu về Enum trong Java

## Giới thiệu

`enum` là một tính năng được giới thiệu trong JDK5.

Trong Java, kiểu được đánh dấu bằng từ khóa `enum` được gọi là kiểu enum. Cú pháp như sau:

```java
enum ColorEn { RED, GREEN, BLUE }
```

**Lợi ích của enum**: Có thể tổ chức các hằng số lại với nhau và quản lý chúng một cách thống nhất.

**Ứng dụng điển hình của enum**: Mã lỗi, máy trạng thái, v.v.

## Bản chất của enum

Lớp `java.lang.Enum` được khai báo như sau:

```java
public abstract class Enum<E extends Enum<E>>
        implements Comparable<E>, Serializable { ... }
```

Tạo một tệp ColorEn.java với nội dung sau:

```java
package com.hnv99.javacore.enumeration;

public enum ColorEn {
    RED,YELLOW,BLUE
}
```

Chạy lệnh `javac ColorEn.java` để tạo tệp ColorEn.class.

Sau đó, chạy lệnh `javap ColorEn.class` để xem kết quả:

```java
Compiled from "ColorEn.java"
public final class com.hnv99.javacore.enumeration.ColorEn extends java.lang.Enum<com.hnv99.javacore.enumeration.ColorEn> {
  public static final com.hnv99.javacore.enumeration.ColorEn RED;
  public static final com.hnv99.javacore.enumeration.ColorEn YELLOW;
  public static final com.hnv99.javacore.enumeration.ColorEn BLUE;
  public static com.hnv99.javacore.enumeration.ColorEn[] values();
  public static com.hnv99.javacore.enumeration.ColorEn valueOf(java.lang.String);
  static {};
}
```

> 💡 Giải thích:
>
> Từ ví dụ trên, có thể thấy:
>
> **Bản chất của enum là một lớp con của `java.lang.Enum`.**
>
> Mặc dù enum có vẻ như là một kiểu dữ liệu mới, nhưng thực tế, **enum là một lớp có giới hạn và có các phương thức riêng của nó**. Vì lớp đặc biệt này được đánh dấu là `final`, nên không thể kế thừa từ lớp khác.
>
> Các giá trị enum được định nghĩa mặc định sẽ được đánh dấu là `public static final`, từ các từ khóa này, có thể thấy rằng giá trị enum thực chất là hằng số tĩnh.

## Phương thức của Enum

Trong enum, cung cấp một số phương thức cơ bản:

- `values()`: Trả về một mảng các phần tử của enum, và các phần tử trong mảng này được sắp xếp theo thứ tự khai báo trong enum.
- `name()`: Trả về tên của phần tử.
- `ordinal()`: Trả về chỉ số của phần tử khi khai báo, bắt đầu từ 0.
- `getDeclaringClass()`: Trả về kiểu enum mà phần tử thuộc về.
- `equals()`: Kiểm tra xem có phải là cùng một đối tượng hay không.

Có thể sử dụng ` == ` để so sánh các phần tử của enum.

Ngoài ra, `java.lang.Enum` cũng triển khai các giao diện `Comparable` và `Serializable`, do đó cung cấp phương thức `compareTo()`.

**Ví dụ: Hiển thị các phương thức cơ bản của enum**

```java
public class EnumMethodDemo {
    enum Color {RED, GREEN, BLUE;}
    enum Size {BIG, MIDDLE, SMALL;}
    public static void main(String args[]) {
        System.out.println("=========== Print all Color ===========");
        for (Color c : Color.values()) {
            System.out.println(c + " ordinal: " + c.ordinal());
        }
        System.out.println("=========== Print all Size ===========");
        for (Size s : Size.values()) {
            System.out.println(s + " ordinal: " + s.ordinal());
        }

        Color green = Color.GREEN;
        System.out.println("green name(): " + green.name());
        System.out.println("green getDeclaringClass(): " + green.getDeclaringClass());
        System.out.println("green hashCode(): " + green.hashCode());
        System.out.println("green compareTo Color.GREEN: " + green.compareTo(Color.GREEN));
        System.out.println("green equals Color.GREEN: " + green.equals(Color.GREEN));
        System.out.println("green equals Size.MIDDLE: " + green.equals(Size.MIDDLE));
        System.out.println("green equals 1: " + green.equals(1));
        System.out.format("green == Color.BLUE: %b\n", green == Color.BLUE);
    }
}
```

**Kết quả**

```
=========== Print all Color ===========
RED ordinal: 0
GREEN ordinal: 1
BLUE ordinal: 2
=========== Print all Size ===========
BIG ordinal: 0
MIDDLE ordinal: 1
SMALL ordinal: 2
green name(): GREEN
green getDeclaringClass(): class org.zp.javase.enumeration.EnumDemo$Color
green hashCode(): 460141958
green compareTo Color.GREEN: 0
green equals Color.GREEN: true
green equals Size.MIDDLE: false
green equals 1: false
green == Color.BLUE: false
```

## Tính năng của Enum

Tính năng của enum có thể tóm tắt trong một câu:

> **Ngoại trừ không thể kế thừa, cơ bản có thể coi enum như một lớp thông thường**.

Tuy nhiên, câu này cần được phân tách để hiểu rõ hơn, hãy đi vào chi tiết.

### Tính năng cơ bản

**Nếu enum không định nghĩa phương thức, có thể thêm dấu phẩy, dấu chấm phẩy hoặc không thêm gì sau phần tử cuối cùng.**

Nếu enum không định nghĩa phương thức, **giá trị enum mặc định là các số nguyên tuần tự bắt đầu từ 0**. Ví dụ với kiểu enum Color, các hằng số enum sẽ là `RED: 0, GREEN: 1, BLUE: 2`.

### Enum có thể thêm phương thức

Trong phần giới thiệu, đã đề cập đến rằng **giá trị enum mặc định là các số nguyên tuần tự bắt đầu từ 0**. Vậy câu hỏi đặt ra là: làm thế nào để gán giá trị enum một cách rõ ràng.

(1) **Java không cho phép sử dụng ` = ` để gán giá trị cho hằng số enum**

Nếu bạn đã làm quen với C/C++, bạn chắc chắn sẽ tự nhiên nghĩ đến dấu ` = ` để gán giá trị cho hằng số enum. Trong ngôn ngữ C/C++, có thể sử dụng dấu ` = ` để gán giá trị cho hằng số enum; nhưng rất tiếc, **Java không cho phép sử dụng dấu ` = ` để gán giá trị cho hằng số enum**.

**Ví dụ: Khai báo enum trong ngôn ngữ C/C++**

```c
typedef enum {
    ONE = 1,
    TWO,
    THREE = 3,
    TEN = 10
} Number;
```

(2) **Enum có thể thêm phương thức thông thường, phương thức tĩnh, phương thức trừu tượng, phương thức khởi tạo**

Mặc dù Java không cho phép gán giá trị trực tiếp cho các phần tử enum, nhưng nó có một giải pháp tốt hơn: **thêm phương thức cho enum để gián tiếp gán giá trị**.

Khi tạo enum, có thể thêm nhiều loại phương thức cho nó, thậm chí có thể thêm phương thức khởi tạo.

**Lưu ý một chi tiết: Nếu muốn định nghĩa phương thức cho enum, thì phải thêm dấu chấm phẩy vào cuối phần tử enum cuối cùng. Ngoài ra, trong enum, phải định nghĩa phần tử trước, không thể định nghĩa trường hoặc phương thức trước phần tử. Nếu không, trình biên dịch sẽ báo lỗi.**

**Ví dụ: Hiển thị đầy đủ cách định nghĩa phương thức thông thường, phương thức tĩnh, phương thức trừu tượng, phương thức khởi tạo trong enum**

```java
public enum ErrorCodeEn {
    OK(0) {
        @Override
        public String getDescription() {
            return "Thành công";
        }
    },
    ERROR_A(100) {
        @Override
        public String getDescription() {
            return "Lỗi A";
        }
    },
    ERROR_B(200) {
        @Override
        public String getDescription() {
            return "Lỗi B";
        }
    };

    private int code;

    // Phương thức khởi tạo: Phương thức khởi tạo của enum chỉ có thể được khai báo với quyền riêng tư hoặc không khai báo quyền hạn
    private ErrorCodeEn(int number) { // Phương thức khởi tạo
        this.code = number;
    }

    public int getCode() { // Phương thức thông thường
        return code;
    } // Phương thức thông thường

    public abstract String getDescription(); // Phương thức trừu tượng

    public static void main(String args[]) { // Phương thức tĩnh
        for (ErrorCodeEn s : ErrorCodeEn.values()) {
            System.out.println("code: " + s.getCode() + ", description: " + s.getDescription());
        }
    }
}
// Kết quả:
// code: 0, description: Thành công
// code: 100, description: Lỗi A
// code: 200, description: Lỗi B
```

Chú ý: Ví dụ trên chỉ để minh họa, không phải là một ví dụ tốt. Ví dụ chính xác được trình bày trong phần [Mã lỗi](#Mã-lỗi).

### Enum có thể triển khai giao diện

**Enum có thể triển khai giao diện giống như một lớp thông thường**.

Cũng giống như lớp thông thường, enum có thể triển khai giao diện. Điều này cho phép ràng buộc các phương thức của enum.

```java
public interface INumberEnum {
    int getCode();
    String getDescription();
}

public enum ErrorCodeEn2 implements INumberEnum {
    OK(0, "Thành công"),
    ERROR_A(100, "Lỗi A"),
    ERROR_B(200, "Lỗi B");

    ErrorCodeEn2(int number, String description) {
        this.code = number;
        this.description = description;
    }

    private int code;
    private String description;

    @Override
    public int getCode() {
        return code;
    }

    @Override
    public String getDescription() {
        return description;
    }
}
```

### Enum không thể kế thừa

**Enum không thể kế thừa từ một lớp khác, và tất nhiên cũng không thể kế thừa từ một enum khác**.

Vì thực tế, enum là một lớp con của lớp `java.lang.Enum`, và Java không hỗ trợ đa kế thừa, nên enum không thể kế thừa từ lớp khác và tất nhiên cũng không thể kế thừa từ một enum khác.

## Ứng dụng của Enum

### Tổ chức hằng số

Trước JDK5, trong Java, việc định nghĩa hằng số thường được thực hiện bằng cách sử dụng cú pháp `public static final TYPE a;`. Với enum, bạn có thể tổ chức các hằng số có mối quan hệ với nhau, làm cho mã nguồn dễ đọc hơn, an toàn hơn và cũng có thể sử dụng các phương thức được cung cấp bởi enum.

Ba cách khai báo sau đây tương đương:

```java
enum Color { RED, GREEN, BLUE }
enum Color { RED, GREEN, BLUE, }
enum Color { RED, GREEN, BLUE; }
```

### Switch với trạng thái

Chúng ta thường sử dụng câu lệnh switch để viết máy trạng thái. Từ JDK7 trở đi, câu lệnh switch đã hỗ trợ tham số kiểu `int`, `char`, `String`, `enum`. So với các kiểu tham số khác, việc sử dụng enum trong câu lệnh switch có mã nguồn dễ đọc hơn.

```java
public class StateMachineDemo {
    public enum Signal {
        GREEN, YELLOW, RED
    }

    public static String getTrafficInstruct(Signal signal) {
        String instruct = "Đèn giao thông bị hỏng";
        switch (signal) {
            case RED:
                instruct = "Đèn đỏ, dừng lại";
                break;
            case YELLOW:
                instruct = "Đèn vàng, chú ý";
                break;
            case GREEN:
                instruct = "Đèn xanh, tiến lên";
                break;
            default:
                break;
        }
        return instruct;
    }

    public static void main(String[] args) {
        System.out.println(getTrafficInstruct(Signal.RED));
    }
}
// Output:
// Đèn đỏ, dừng lại
```

### Mã lỗi

Enum thường được sử dụng để định nghĩa mã lỗi của chương trình. Dưới đây là một ví dụ đơn giản:

```java
public class ErrorCodeEnumDemo {
    enum ErrorCodeEn {
        OK(0, "Thành công"),
        ERROR_A(100, "Lỗi A"),
        ERROR_B(200, "Lỗi B");

        ErrorCodeEn(int number, String msg) {
            this.code = number;
            this.msg = msg;
        }

        private int code;
        private String msg;

        public int getCode() {
            return code;
        }

        public String getMsg() {
            return msg;
        }

        @Override
        public String toString() {
            return "ErrorCodeEn{" + "code=" + code + ", msg='" + msg + '\'' + '}';
        }

        public static String toStringAll() {
            StringBuilder sb = new StringBuilder();
            sb.append("ErrorCodeEn All Elements: [");
            for (ErrorCodeEn code : ErrorCodeEn.values()) {
                sb.append(code.getCode()).append(", ");
            }
            sb.append("]");
            return sb.toString();
        }
    }

    public static void main(String[] args) {
        System.out.println(ErrorCodeEn.toStringAll());
        for (ErrorCodeEn s : ErrorCodeEn.values()) {
            System.out.println(s);
        }
    }
}
// Output:
// ErrorCodeEn All Elements: [0, 100, 200, ]
// ErrorCodeEn{code=0, msg='Thành công'}
// ErrorCodeEn{code=100, msg='Lỗi A'}
// ErrorCodeEn{code=200, msg='Lỗi B'}
```

### Tổ chức enum

Có thể sử dụng giao diện hoặc lớp để tổ chức các enum có cùng loại, nhưng thường thì sử dụng giao diện để tổ chức.

Lý do là: Java tự động thêm từ khóa `public static` cho kiểu enum khi biên dịch; Java tự động thêm từ khóa `static` cho kiểu enum khi biên dịch. Bạn có thể thấy sự khác biệt chưa? Đúng rồi, điều đó có nghĩa là nếu bạn tổ chức enum trong một lớp, nếu bạn không đặt quyền truy cập là `public`, thì chỉ có thể truy cập trong gói hiện tại.

**Ví dụ: Tổ chức enum trong giao diện**

```java
public class EnumInInterfaceDemo {
    public interface INumberEnum {
        int getCode();
        String getDescription();
    }


    public interface Plant {
        enum Vegetable implements INumberEnum {
            POTATO(0, "Khoai tây"),
            TOMATO(0, "Cà chua");

            Vegetable(int number, String description) {
                this.code = number;
                this.description = description;
            }

            private int code;
            private String description;

            @Override
            public int getCode() {
                return this.code;
            }

            @Override
            public String getDescription() {
                return this.description;
            }
        }


        enum Fruit implements INumberEnum {
            APPLE(0, "Táo"),
            ORANGE(0, "Cam"),
            BANANA(0, "Chuối");

            Fruit(int number, String description) {
                this.code = number;
                this.description = description;
            }

            private int code;
            private String description;

            @Override
            public int getCode() {
                return this.code;
            }

            @Override
            public String getDescription() {
                return this.description;
            }
        }
    }

    public static void main(String[] args) {
        for (Plant.Fruit f : Plant.Fruit.values()) {
            System.out.println(f.getDescription());
        }
    }
}
// Output:
// Táo
// Cam
// Chuối
```

**Ví dụ: Tổ chức enum trong lớp**

Ví dụ này có cùng hiệu quả với ví dụ trước.

```java
public class EnumInClassDemo {
    public interface INumberEnum {
        int getCode();
        String getDescription();
    }

    public static class Plant2 {
        enum Vegetable implements INumberEnum {
            // Giống như ví dụ trước
        }
        enum Fruit implements INumberEnum {
            // Giống như ví dụ trước
        }
    }

    // Giống như ví dụ trước
}
// Output:
// Khoai tây
// Cà chua
```

### Enum chiến lược

Effective Java trình bày một loại enum chiến lược. Enum này sử dụng enum lồng nhau để phân loại các hằng số enum.

Phương pháp này không ngắn gọn như câu lệnh switch, nhưng nó an toàn hơn và linh hoạt hơn.

**Ví dụ: Một ví dụ về enum chiến lược từ Effective Java**

```java
enum PayrollDay {
    MONDAY(PayType.WEEKDAY), TUESDAY(PayType.WEEKDAY), WEDNESDAY(
            PayType.WEEKDAY), THURSDAY(PayType.WEEKDAY), FRIDAY(PayType.WEEKDAY), SATURDAY(
            PayType.WEEKEND), SUNDAY(PayType.WEEKEND);

    private final PayType payType;

    PayrollDay(PayType payType) {
        this.payType = payType;
    }

    double pay(double hoursWorked, double payRate) {
        return payType.pay(hoursWorked, payRate);
    }

    // Enum chiến lược
    private enum PayType {
        WEEKDAY {
            double overtimePay(double hours, double payRate) {
                return hours <= HOURS_PER_SHIFT ? 0 : (hours - HOURS_PER_SHIFT)
                        * payRate / 2;
            }
        },
        WEEKEND {
            double overtimePay(double hours, double payRate) {
                return hours * payRate / 2;
            }
        };
        private static final int HOURS_PER_SHIFT = 8;

        abstract double overtimePay(double hrs, double payRate);

        double pay(double hoursWorked, double payRate) {
            double basePay = hoursWorked * payRate;
            return basePay + overtimePay(hoursWorked, payRate);
        }
    }
}
```

**Kiểm tra**

```java
System.out.println("Lương của người làm công 100 giờ vào thứ 6: " + PayrollDay.FRIDAY.pay(8.0, 100));
System.out.println("Lương của người làm công 100 giờ vào thứ 7: " + PayrollDay.SATURDAY.pay(8.0, 100));
```

### Enum triển khai Singleton Pattern

Singleton Pattern là mẫu thiết kế phổ biến nhất.

Singleton Pattern có vấn đề an toàn đối với luồng trong môi trường đa luồng.

Để giải quyết vấn đề an toàn đối với luồng, có một số phương pháp truyền thống:

- Khởi tạo sẵn (Eager initialization)
- Lười biếng (Lazy initialization) với synchronize và kiểm tra kép
- Tận dụng cơ chế tải tĩnh của Java

So với các phương pháp trên, việc sử dụng enum cũng có thể triển khai Singleton và còn đơn giản hơn:

```java
public class SingleEnumDemo {
    public enum SingleEn {

        INSTANCE;

        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    public static void main(String[] args) {
        SingleEn.INSTANCE.setName("zp");
        System.out.println(SingleEn.INSTANCE.getName());
    }
}
```

## Công cụ của lớp Enum

Trong Java, có hai lớp tiện ích để làm việc với enum - `EnumSet` và `EnumMap`.

### EnumSet

`EnumSet` là một cài đặt `Set` hiệu suất cao cho kiểu enum. Nó yêu cầu các hằng số enum được đưa vào nó phải thuộc cùng một kiểu enum.

Giao diện chính:

- `noneOf` - Tạo một EnumSet rỗng với loại phần tử được chỉ định.
- `allOf` - Tạo một EnumSet với loại phần tử được chỉ định và chứa tất cả các giá trị enum.
- `range` - Tạo một EnumSet chứa các phần tử trong một phạm vi giá trị enum được chỉ định.
- `complementOf` - Tạo một EnumSet chứa phần bù của tập hợp được chỉ định.
- `of` - Tạo một EnumSet chứa tất cả các phần tử được chỉ định.
- `copyOf` - Tạo một EnumSet chứa tất cả các phần tử trong bộ chứa được chỉ định.

Ví dụ:

```java
public class EnumSetDemo {
    public static void main(String[] args) {
        System.out.println("Hiển thị EnumSet");
        EnumSet<ErrorCodeEn> errSet = EnumSet.allOf(ErrorCodeEn.class);
        for (ErrorCodeEn e : errSet) {
            System.out.println(e.name() + " : " + e.ordinal());
        }
    }
}
```

### EnumMap

`EnumMap` là một cài đặt `Map` đặc biệt dành riêng cho kiểu enum. Mặc dù bạn có thể sử dụng các cài đặt `Map` khác (như HashMap) để ánh xạ các phần tử enum thành giá trị, nhưng việc sử dụng EnumMap sẽ hiệu quả hơn: nó chỉ chấp nhận các phần tử enum cùng một kiểu làm khóa và do số lượng phần tử enum tương đối cố định và hạn chế, nên EnumMap sử dụng một mảng để lưu trữ các giá trị tương ứng với các phần tử enum. Điều này làm cho EnumMap rất hiệu quả.

Giao diện chính:

- `size` - Trả về số cặp key-value.
- `containsValue` - Kiểm tra xem giá trị đã cho có tồn tại trong bản đồ không.
- `containsKey` - Kiểm tra xem khóa đã cho có tồn tại trong bản đồ không.
- `get` - Trả về giá trị tương ứng với khóa đã cho.
- `put` - Đặt một cặp key-value vào bản đồ.
- `remove` - Xóa khóa đã cho khỏi bản đồ.
- `putAll` - Đặt tất cả các cặp key-value từ bản đồ đã cho vào bản đồ hiện tại.
- `clear` - Xóa tất cả các cặp key-value khỏi m.
- `keySet` - Trả về tập hợp các khóa trong bản đồ.
- `values` - Trả về tất cả các giá trị trong bản đồ.

Ví dụ:

```java
public class EnumMapDemo {
    public enum Signal {
        GREEN, YELLOW, RED
    }

    public static void main(String[] args) {
        System.out.println("Hiển thị EnumMap");
        EnumMap<Signal, String> errMap = new EnumMap(Signal.class);
        errMap.put(Signal.RED, "Đèn đỏ");
        errMap.put(Signal.YELLOW, "Đèn vàng");
        errMap.put(Signal.GREEN, "Đèn xanh");
        for (Iterator<Map.Entry<Signal, String>> iter = errMap.entrySet().iterator(); iter.hasNext();) {
            Map.Entry<Signal, String> entry = iter.next();
            System.out.println(entry.getKey().name() + " : " + entry.getValue());
        }
    }
}
```

## Tóm tắt

![Java Enum](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Java%20Enum.svg)
