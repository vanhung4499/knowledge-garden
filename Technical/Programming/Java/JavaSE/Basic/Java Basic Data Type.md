---
title: Java Basic Data Type In Depth
tags: [java, javase]
categories: [java, javase]
date created: 2023-07-11
date modified: 2023-07-12
---

# Hiểu sâu về các kiểu dữ liệu trong Java

![Java Basic Data Type](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Java%20Basic%20Data%20Type.png)

## Phân loại kiểu dữ liệu

Trong Java, có hai loại kiểu dữ liệu:

- Kiểu giá trị - value type (còn được gọi là kiểu dữ liệu nguyên thuỷ - primitive type)
- Kiểu tham chiếu - reference type (ngoại trừ kiểu giá trị, tất cả đều là kiểu tham chiếu, bao gồm `String`, `Array`, …)

### Kiểu giá trị

Java cung cấp **8** kiểu dữ liệu nguyên thuỷ, chia thành **4** loại chính:

| kiểu dữ liệu nguyên thuỷ | Phân loại       | Số bit | Giá trị mặc định | Phạm vi giá trị                 | Mô tả                              |
| ------------ | ---------- | ------ | ---------- | ----------------------------- | --------------------------------- |
| `boolean`    | **Kiểu boolean** | 8 bit  | `false`    | {false, true}                 |                                   |
| `char`       | **Kiểu ký tự** | 16 bit | `'\u0000'` | [0, $2^{16} - 1$]             | Lưu trữ mã Unicode, gán giá trị bằng dấu nháy đơn     |
| `byte`       | **Kiểu số nguyên** | 8 bit  | `0`        | [-$2^7$, $2^7 - 1$]           |                                   |
| `short`      | **Kiểu số nguyên** | 16 bit | `0`        | [-$2^{15}$, $2^{15} - 1$]     |                                   |
| `int`        | **Kiểu số nguyên** | 32 bit | `0`        | [-$2^{31}$, $2^{31} - 1$]     |                                   |
| `long`       | **Kiểu số nguyên** | 64 bit | `0L`       | [-$2^{63}$, $2^{63} - 1$]     | Thường thì gán giá trị bằng số và sau đó thêm `l` hoặc `L` |
| `float`      | **Kiểu số thực** | 32 bit | `+0.0F`    | [$2^{-149}$, $2^{128} - 1$]   | Phải thêm `f` hoặc `F` sau số khi gán giá trị |
| `double`     | **Kiểu số thực** | 64 bit | `+0.0D`    | [$2^{-1074}$, $2^{1024} - 1$] | Thường thì gán giá trị bằng số và sau đó thêm `d` hoặc `D`   |

Mặc dù các kiểu dữ liệu có giá trị mặc định khác nhau, nhưng trong bộ nhớ, tất cả đều là 0.

Trong các kiểu dữ liệu nguyên thuỷ này, `boolean` và `char` là hai kiểu dữ liệu duy nhất không có dấu.

### Sự khác biệt giữa kiểu giá trị và kiểu tham chiếu

- Về mặt khái niệm
  - Kiểu giá trị: Tên biến trỏ đến một giá trị cụ thể.
  - Kiểu tham chiếu: Tên biến trỏ đến địa chỉ bộ nhớ lưu trữ đối tượng dữ liệu.
- Về mặt bộ nhớ
  - Kiểu giá trị: Sau khi khai báo, Java sẽ cấp phát không gian bộ nhớ cho biến ngay lập tức.
  - Kiểu tham chiếu: Nó trỏ đến một đối tượng dữ liệu trong bộ nhớ (tương tự con trỏ C), khi khai báo không cấp phát bộ nhớ, chỉ lưu trữ địa chỉ bộ nhớ.
- Về mặt sử dụng
  - Kiểu giá trị: Khi sử dụng, cần gán giá trị cụ thể, so sánh sử dụng ` == `.
  - Kiểu tham chiếu: Khi sử dụng, có thể gán giá trị null, so sánh sử dụng phương thức `equals`.

## Chuyển đổi dữ liệu

Trong Java, có hai cách để chuyển đổi kiểu dữ liệu:

- Chuyển đổi tự động
- Chuyển đổi bằng ép buộc

### Chuyển đổi tự động

Nói chung, khi đã định nghĩa một biến với một kiểu dữ liệu, bạn không thể chuyển đổi kiểu dữ liệu một cách tự do. Tuy nhiên, JAVA cho phép người dùng chuyển đổi kiểu dữ liệu nguyên thuỷ một cách hạn chế nếu thoả mãn các điều kiện sau:

- **Chuyển đổi từ kiểu dữ liệu nhỏ hơn sang kiểu dữ liệu lớn hơn**

    Rõ ràng là kiểu dữ liệu "nhỏ" có phạm vi biểu diễn giá trị nhỏ hơn kiểu dữ liệu "lớn", tức là độ chính xác nhỏ hơn kiểu dữ liệu "lớn".

    Vì vậy, nếu chuyển đổi từ kiểu dữ liệu "lớn" sang kiểu dữ liệu "nhỏ", sẽ mất mất độ chính xác của dữ liệu. Ví dụ: chuyển đổi từ `long` sang `int`, các giá trị vượt quá phạm vi biểu diễn của `int` sẽ bị mất, dẫn đến kết quả không xác định.

    Ngược lại, nếu chuyển đổi từ kiểu dữ liệu "nhỏ" sang kiểu dữ liệu "lớn", không có dữ liệu bị mất. Vì lý do này, chuyển đổi kiểu này còn được gọi là **mở rộng**.

    Các kiểu dữ liệu từ "nhỏ" đến "lớn" lần lượt là: (byte, short, char) < int < long < float < double.

- **Kiểu dữ liệu trước và sau chuyển đổi phải tương thích**

    Vì kiểu dữ liệu `boolean` chỉ có thể lưu trữ `true` hoặc `false`, điều này không tương thích với số nguyên hoặc ký tự, vì vậy không thể chuyển đổi kiểu dữ liệu.

- **Sau khi tính toán giữa kiểu số nguyên và kiểu số thực, kết quả sẽ được chuyển đổi thành kiểu số thực**

Ví dụ:

```java
long x = 30;
float y = 14.3f;
System.out.println("x/y = " + x/y);
```

Kết quả:

```
x/y = 1.9607843
```

Có thể thấy rằng mặc dù `long` có độ chính xác lớn hơn `float`, nhưng kết quả lại là kiểu số thực.

### Chuyển đổi bằng ép buộc

Khi không thỏa mãn điều kiện tự động chuyển đổi hoặc theo yêu cầu của người dùng, có thể chuyển đổi kiểu dữ liệu một cách bắt buộc.

**Chuyển đổi bằng ép buộc sử dụng dấu ngoặc đơn `()`**.

Kiểu tham chiếu cũng có thể sử dụng chuyển đổi bằng ép buộc.

Ví dụ:

```java
float f = 25.5f;
int x = (int)f;
System.out.println("x = " + x);
```

## Đóng gói và mở gói

### Lớp bao đóng, đóng gói, mở gói

Trong Java, mỗi kiểu dữ liệu nguyên thuỷ được cung cấp một lớp bao đóng (wrapper class) tương ứng, như sau:

```
Byte <-> byte
Short <-> short
Integer <-> int
Long <-> long
Float <-> float
Double <-> double
Character <-> char
Boolean <-> boolean
```

**Mục đích của việc giới thiệu lớp bao đóng** là: cung cấp một cơ chế cho phép **kiểu dữ liệu nguyên thuỷ có thể chuyển đổi thành kiểu tham chiếu**.

Chuyển đổi kiểu dữ liệu nguyên thuỷ và lớp bao đóng được gọi là `đóng gói` và `mở gói`.

- **`Đóng gói` (boxing)** là chuyển đổi từ kiểu giá trị sang kiểu tham chiếu. Ví dụ: `int` chuyển đổi thành `Integer`.
    - Quá trình đóng gói được thực hiện bằng cách gọi phương thức `valueOf` của lớp bao đóng tương ứng.
- **`Mở gói` (unboxing)** là chuyển đổi từ kiểu tham chiếu sang kiểu giá trị. Ví dụ: `Integer` chuyển đổi thành `int`.
    - Quá trình mở gói được thực hiện bằng cách gọi phương thức `xxxValue` của lớp bao đóng tương ứng. (xxx đại diện cho kiểu dữ liệu nguyên thuỷ tương ứng).

### Đóng gói tự động, mở gói tự động

Chức năng tự động đóng gói (auto boxing) và tự động mở gói (auto unboxing) kiểu dữ liệu nguyên thuỷ (Primitive Type) được cung cấp từ JDK 5 trở đi.

Cơ chế đóng gói và mở gói tự động cho phép chúng ta sử dụng kiểu dữ liệu nguyên thủy hoặc kiểu đối tượng một cách đơn giản và trực tiếp trong các trường hợp gán biến hoặc gọi phương thức, v.v.

Vì đóng gói tự động sẽ tạo ra đối tượng một cách ngầm định, nếu trong một vòng lặp, tạo ra các đối tượng trung gian không cần thiết, điều này sẽ tăng áp lực GC, làm giảm hiệu suất của chương trình. Vì vậy, khi viết vòng lặp, cần chú ý mã của bạn, tránh tạo ra các hoạt động đóng gói tự động không cần thiết.

Trước JDK 5:

```java
Integer i1 = new Integer(10); // Không phải đóng gói tự động
```

Sau JDK 5:

```java
Integer i2 = 10; // Đóng gói tự động
```

Thiết kế của Java cho việc đóng gói và mở gói dựa trên một mẫu thiết kế gọi là Flyweight Pattern (nếu bạn quan tâm, bạn có thể tìm hiểu mã nguồn, ở đây không mở rộng về mẫu thiết kế).

### Ứng dụng và lưu ý khi đóng gói và mở gói

#### Các tình huống ứng dụng đóng gói và mở gói

- Một tình huống phổ biến là: gọi một phương thức có tham số kiểu `Object`, trong đó `Object` có thể chứa bất kỳ kiểu dữ liệu nào (vì `Object` là lớp cha của tất cả các lớp), để đảm bảo tính chung chung. Khi bạn cần truyền một giá trị kiểu nguyên thuỷ (ví dụ: int), bạn cần đóng gói nó thành `Integer`.
- Một ứng dụng khác là: một **collection không phải là generic**, cũng để đảm bảo tính chung chung, và định nghĩa kiểu phần tử là `Object`. Do đó, khi thêm dữ liệu kiểu giá trị vào collection, bạn cần đóng gói nó.
- Khi sử dụng toán tử ` == ` với hai toán hạng, một toán hạng là một đối tượng và một toán hạng là biểu thức (bao gồm các phép toán số học), thì so sánh sẽ là giá trị (tức là sẽ kích hoạt quá trình mở gói tự động).

【Ví dụ】Ví dụ về đóng gói và mở gói

```java
Integer i1 = 10; // Tự động đóng gói
Integer i2 = new Integer(10); // Không tự động đóng gói
Integer i3 = Integer.valueOf(10); // Không tự động đóng gói
int i4 = new Integer(10); // Tự động mở gói
int i5 = i2.intValue(); // Không tự động mở gói
System.out.println("i1 = [" + i1 + "]");
System.out.println("i2 = [" + i2 + "]");
System.out.println("i3 = [" + i3 + "]");
System.out.println("i4 = [" + i4 + "]");
System.out.println("i5 = [" + i5 + "]");
System.out.println("i1 == i2 is [" + (i1 == i2) + "]");
System.out.println("i1 == i4 is [" + (i1 == i4) + "]"); // Tự động mở gói
// Output:
// i1 = [10]
// i2 = [10]
// i3 = [10]
// i4 = [10]
// i5 = [10]
// i1 == i2 is [false]
// i1 == i4 is [true]
```

【Giải thích】

Trong ví dụ trên, mặc dù đều khởi tạo các biến với giá trị 10, tại sao lại có `i1 == i2 is [false]` trong khi `i1 == i4 is [true]`?

Lý do là:

- i1, i2 đều là các đối tượng, khi sử dụng toán tử ` == `, Java xem chúng là hai đối tượng khác nhau, chứ không phải hai giá trị `int`, vì vậy hai đối tượng này tự nhiên là không bằng nhau. Phép so sánh đúng nên sử dụng phương thức `equals`.
- i1 là đối tượng gói, i4 là kiểu dữ liệu nguyên thuỷ, khi sử dụng toán tử ` == `, Java sẽ tự động mở gói đối tượng i1 này thành một giá trị `int`, sau đó thực hiện phép so sánh ` == ` giữa hai giá trị `int`, vì giá trị bằng nhau, kết quả là true.

【Ví dụ】Vấn đề so sánh các lớp bao đóng

```java
Integer a = 127; //Integer.valueOf(127)
Integer b = 127; //Integer.valueOf(127)
log.info("\nInteger a = 127;\nInteger b = 127;\na == b ? {}", a == b);    // true

Integer c = 128; //Integer.valueOf(128)
Integer d = 128; //Integer.valueOf(128)
log.info("\nInteger c = 128;\nInteger d = 128;\nc == d ? {}", c == d);   //false
//Thử lại với -XX:AutoBoxCacheMax=1000

Integer e = 127; //Integer.valueOf(127)
Integer f = new Integer(127); //new instance
log.info("\nInteger e = 127;\nInteger f = new Integer(127);\ne == f ? {}", e == f);   //false

Integer g = new Integer(127); //new instance
Integer h = new Integer(127); //new instance
log.info("\nInteger g = new Integer(127);\nInteger h = new Integer(127);\ng == h ? {}", g == h);  //false

Integer i = 128; //unbox
int j = 128;
log.info("\nInteger i = 128;\nint j = 128;\ni == j ? {}", i == j); //true
```

Từ kết quả chạy, ta có thể thấy rằng, mặc dù luôn so sánh 127 với 127, 128 với 128, nhưng == không phải lúc nào cũng trả về true.

#### Lưu ý khi đóng gói và mở gói

1. Thao tác đóng gói sẽ tạo ra đối tượng, thao tác đóng gói thường xuyên sẽ gây tốn bộ nhớ không cần thiết và ảnh hưởng đến hiệu suất. Do đó, **nên tránh thao tác đóng gói nếu có thể**.
2. So sánh giữa các kiểu dữ liệu nguyên thuỷ sử dụng ` == `, so sánh giữa các đối tượng sử dụng phương thức `equals`.

## Vấn đề so sánh

Trong Java, chúng ta thường sử dụng `equals` hoặc ` == ` để so sánh. `equals` là một phương thức trong khi ` == ` là một toán tử. Ngoài ra, chúng cũng có sự khác biệt trong cách sử dụng:

- Đối với **kiểu dữ liệu nguyên thuỷ**, như `int`, `long`, để so sánh, **chỉ có thể sử dụng ` == ` và so sánh giá trị chữ số**. Bởi vì giá trị của kiểu dữ liệu nguyên thuỷ chính là giá trị số.
- Đối với **kiểu dữ liệu tham chiếu**, như `Integer`, `Long` và `String`, để so sánh, **phải sử dụng `equals` để so sánh nội dung**. Bởi vì giá trị trực tiếp của kiểu dữ liệu tham chiếu là con trỏ, nếu sử dụng ` == `, sẽ so sánh con trỏ, tức là so sánh hai đối tượng có cùng địa chỉ trong bộ nhớ, chứ không phải so sánh nội dung của đối tượng.

### So sánh các lớp bao đóng

Chúng ta sẽ đi sâu vào vấn đề so sánh thông qua một ví dụ.

【Ví dụ】So sánh các lớp bao

```java
Integer a = 127; //Integer.valueOf(127)
Integer b = 127; //Integer.valueOf(127)
log.info("\nInteger a = 127;\nInteger b = 127;\na == b ? {}", a == b);    // true

Integer c = 128; //Integer.valueOf(128)
Integer d = 128; //Integer.valueOf(128)
log.info("\nInteger c = 128;\nInteger d = 128;\nc == d ? {}", c == d);   //false
//Thử lại với -XX:AutoBoxCacheMax=1000

Integer e = 127; //Integer.valueOf(127)
Integer f = new Integer(127); //new instance
log.info("\nInteger e = 127;\nInteger f = new Integer(127);\ne == f ? {}", e == f);   //false

Integer g = new Integer(127); //new instance
Integer h = new Integer(127); //new instance
log.info("\nInteger g = new Integer(127);\nInteger h = new Integer(127);\ng == h ? {}", g == h);  //false

Integer i = 128; //unbox
int j = 128;
log.info("\nInteger i = 128;\nint j = 128;\ni == j ? {}", i == j); //true
```

Trong trường hợp đầu tiên, trình biên dịch sẽ chuyển đổi `Integer a = 127` thành `Integer.valueOf(127)`. Xem mã nguồn, chúng ta có thể thấy rằng quá trình chuyển đổi này thực sự đã tạo ra một bộ nhớ cache, làm cho hai đối tượng Integer trỏ đến cùng một đối tượng, do đó ` == ` trả về true.

```java
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high)
        return IntegerCache.cache[i + (-IntegerCache.low)];
    return new Integer(i);
}
```

Trong trường hợp thứ hai, lý do tại sao cùng một đoạn mã 128 lại trả về false là vì mặc định, chỉ có [-128, 127] được lưu trong bộ nhớ cache, và 128 nằm ngoài khoảng này. Hãy thử lại với tham số `JVM -XX:AutoBoxCacheMax=1000`, liệu kết quả có trả về true không?

```java
private static class IntegerCache {
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

    private IntegerCache() {}
}
```

Trong trường hợp thứ ba và thứ tư, Integer được tạo ra bằng từ khoá `new` sẽ không được lưu trong bộ nhớ cache. So sánh hai đối tượng mới hoặc so sánh một đối tượng mới với một đối tượng từ bộ nhớ cache, kết quả sẽ không phải là cùng một đối tượng, do đó trả về false.

Trong trường hợp thứ năm, khi so sánh Integer đã được đóng gói và kiểu dữ liệu nguyên thuỷ int, trước tiên nó sẽ được mở gói và sau đó so sánh giá trị chứ không phải so sánh con trỏ, do đó trả về true.

> 【Tổng kết】Từ những điều trên, chúng ta có thể kết luận rằng: **Các lớp bao đóng cần sử dụng `equals` để so sánh nội dung, không thể sử dụng ` == `**.

### So sánh String

```java
String a = "1";
String b = "1";
log.info("\nString a = \"1\";\nString b = \"1\";\na == b ? {}", a == b); //true

String c = new String("2");
String d = new String("2");
log.info("\nString c = new String(\"2\");\nString d = new String(\"2\");\nc == d ? {}", c == d); //false

String e = new String("3").intern();
String f = new String("3").intern();
log.info("\nString e = new String(\"3\").intern();\nString f = new String(\"3\").intern();\ne == f ? {}", e == f); //true

String g = new String("4");
String h = new String("4");
log.info("\nString g = new String(\"4\");\nString h = new String(\"4\");\ng == h ? {}", g.equals(h)); //true
```

Trong JVM, khi một chuỗi được tạo ra bằng cách sử dụng cú pháp dấu ngoặc kép, JVM sẽ kiểm tra chuỗi này. Nếu có một đối tượng chuỗi có nội dung giống nhau trong bộ nhớ cache, thì con trỏ của đối tượng này sẽ được trả về. Nếu không, một đối tượng chuỗi mới sẽ được tạo ra, sau đó con trỏ sẽ được đưa vào bộ nhớ cache và trả về. Bộ nhớ cache này được gọi là hoặc **string pool**.

Trong trường hợp đầu tiên, vì **string pool** của Java, hai đối tượng String được tạo ra bằng cách sử dụng dấu ngoặc kép trỏ đến cùng một đối tượng trong bộ nhớ cache, do đó ` == ` trả về true.

Trong trường hợp thứ hai, vì hai đối tượng String được tạo ra bằng từ khoá `new`, chúng là hai đối tượng khác nhau, do đó ` == ` trả về false.

Trong trường hợp thứ ba, việc sử dụng phương thức intern của String cũng sẽ sử dụng cơ chế cache, do đó cũng trả về true.

Trong trường hợp thứ tư, chúng ta sử dụng phương thức `equals` để so sánh nội dung, đây là cách xử lý đúng, và kết quả là `true`.

Mặc dù việc sử dụng phương thức intern của String để cache chuỗi vào **string pool**, nhưng việc lạm dụng intern trong mã doanh nghiệp có thể gây ra vấn đề về hiệu suất.

【Ví dụ】Kiểm tra hiệu suất của String#intern

```java
//-XX:+PrintStringTableStatistics
//-XX:StringTableSize=10000000
List<String> list = new ArrayList<>();
long begin = System.currentTimeMillis();
list = IntStream.rangeClosed(1, 10000000)
    .mapToObj(i -> String.valueOf(i).intern())
    .collect(Collectors.toList());
System.out.println("size:" + list.size());
System.out.println("time:" + (System.currentTimeMillis() - begin));
```

Ví dụ trên sẽ mất thời gian khá lâu. Nguyên nhân là bảng hằng số chuỗi là một bảng có dung lượng cố định. Nếu dung lượng quá nhỏ (Number of buckets=60013) và số lượng chuỗi quá lớn (10 triệu chuỗi), thì số lượng chuỗi trong mỗi bucket sẽ rất nhiều, do đó tìm kiếm sẽ rất chậm. Average bucket size=167 trong kết quả đầu ra cho thấy độ dài trung bình của các bucket là 167.

Giải pháp là thiết lập tham số JVM -XX:StringTableSize=10000000, chỉ định nhiều bucket hơn.

Để dễ quan sát, bạn có thể đặt tham số JVM -XX:+PrintStringTableStatistic khi khởi động chương trình, sau khi chương trình kết thúc, thông tin thống kê về bảng hằng số chuỗi sẽ được in ra.

Kết quả thực thi nhanh hơn nhiều khi không đặt -XX:StringTableSize.

> 【Tổng kết】**Không nên lạm dụng intern, nếu cần sử dụng, hãy kiểm soát số lượng chuỗi được cache và theo dõi các chỉ số của bảng hằng số**.

### Triển khai equals

Nếu bạn đã xem mã nguồn của lớp `Object`, bạn có thể biết rằng, triển khai của `equals` thực sự là so sánh con trỏ đối tượng.

```java
public boolean equals(Object obj) {
    return (this == obj);
}
```

Lý do tại sao Integer hoặc String có thể thực hiện so sánh nội dung bằng equals là vì chúng đã ghi đè phương thức này.

Đối với các kiểu tùy chỉnh, nếu không ghi đè `equals`, mặc định sẽ sử dụng triển khai mặc định của lớp cơ sở `Object`, tức là so sánh con trỏ.

Triển khai một `equals` tốt hơn nên chú ý các điểm sau:

- Với hiệu suất, bạn có thể trước tiên so sánh con trỏ, nếu đối tượng là cùng một đối tượng, hãy trả về true;
- Cần kiểm tra đối tượng kia có `null` không, so sánh đối tượng `null` với chính nó, kết quả chắc chắn là `false`;
- Cần kiểm tra hai đối tượng có cùng kiểu không, nếu kiểu khác nhau, hãy trả về `false` ngay lập tức;
- Đảm bảo rằng trong trường hợp hai đối tượng có cùng kiểu, hãy thực hiện ép kiểu, sau đó so sánh từng trường một.

【Ví dụ】Ví dụ về equals tùy chỉnh

Lớp tùy chỉnh:

```java
class Point {
    private final int x;
    private final int y;
    private final String desc;
}
```

Triển khai equals:

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Point that = (Point) o;
    return x == that.x && y == that.y;
}
```

### hashCode và equals phải được triển khai cùng nhau

```java
Point p1 = new Point(1, 2, "a");
Point p2 = new Point(1, 2, "b");

HashSet<PointWrong> points = new HashSet<>();
points.add(p1);
log.info("points.contains(p2) ? {}", points.contains(p2));
```

Trong ví dụ trên, theo triển khai `equals` cải tiến, hai đối tượng này có thể được coi là giống nhau và nếu p1 đã tồn tại trong Set, thì p2 cũng nên được chứa trong Set. Nhưng kết quả lại là false.

Nguyên nhân gây ra lỗi này là bảng băm cần sử dụng `hashCode` để xác định đối tượng được đặt vào bucket nào. Nếu đối tượng tùy chỉnh không triển khai phương thức `hashCode` tùy chỉnh, nó sẽ sử dụng triển khai mặc định của lớp `Object`, dẫn đến hai `hashCode` khác nhau và không thể đáp ứng yêu cầu.

Để triển khai `hashCode` tùy chỉnh, chúng ta có thể sử dụng phương thức `Objects.hashCode` trực tiếp.

```java
@Override
public int hashCode() {
    return Objects.hash(x, y);
}
```

### Sự nhất quán giữa compareTo và equals

【Ví dụ】Lỗi khi tự triển khai compareTo

```java
@Data
@AllArgsConstructor
static class Student implements Comparable<Student> {

    private int id;
    private String name;

    @Override
    public int compareTo(Student other) {
        int result = Integer.compare(other.id, id);
        if (result == 0) { log.info("this {} == other {}", this, other); }
        return result;
    }

}
```

Gọi:

```java
List<Student> list = new ArrayList<>();  
list.add(new Student(1, "Tom"));  
list.add(new Student(2, "Jerry"));  
Student student = new Student(2, "Spike");

log.info("ArrayList.indexOf");
int index1 = list.indexOf(student);
Collections.sort(list);
log.info("Collections.binarySearch");
int index2 = Collections.binarySearch(list, student);

log.info("index1 = " + index1);
log.info("index2 = " + index2);
```

Phương thức `binarySearch` gọi phương thức `compareTo` của phần tử để so sánh;

- Kết quả của `indexOf` không có vấn đề, không tìm thấy sinh viên có `id` là `2` và `name` là `Spike` trong danh sách;
- `binarySearch` trả về chỉ số `0`, đại diện cho sinh viên có `id` là `2` và tên là `Jerry` (do mảng đã được sắp xếp).

Cách sửa rất đơn giản, đảm bảo rằng logic so sánh của `compareTo` và `equals` là nhất quán.

```java
@Data
@AllArgsConstructor
static class StudentRight implements Comparable<StudentRight> {

    private int id;
    private String name;

    @Override
    public int compareTo(StudentRight other) {
        return Comparator.comparing(StudentRight::getName)
            .thenComparingInt(StudentRight::getId)
            .compare(this, other);
    }

}
``````

### Cẩn thận với "lỗ hổng" của mã được tạo bởi Lombok

Chú thích `@Data` của Lombok sẽ giúp chúng ta triển khai các phương thức `equals` và `hashCode`, nhưng khi có mối quan hệ kế thừa, các phương thức được tự động tạo bởi Lombok có thể không phải là những gì chúng ta mong đợi.

`@EqualsAndHashCode` mặc định không sử dụng thuộc tính của lớp cha. Để giải quyết vấn đề này, chúng ta có thể thiết lập cờ `callSuper = true` để ghi đè phương thức mặc định này.

## Tính toán số học

### Vấn đề tính toán số thực

Máy tính lưu trữ giá trị số trong biến, các biến số khác nhau có thể lưu trữ phạm vi giá trị khác nhau, khi giá trị vượt quá giới hạn trên của kiểu dữ liệu, sẽ xảy ra vấn đề tràn số.

```java
System.out.println(0.1 + 0.2); // 0.30000000000000004
System.out.println(1.0 - 0.8); // 0.19999999999999996
System.out.println(4.015 * 100); // 401.49999999999994
System.out.println(123.3 / 100); // 1.2329999999999999
double amount1 = 2.15;
double amount2 = 1.10;
System.out.println(amount1 - amount2); // 1.0499999999999998
```

Các ví dụ trên, kết quả đầu ra không giống với kỳ vọng của chúng ta. Tại sao lại như vậy?

Nguyên nhân chính gây ra vấn đề này là máy tính lưu trữ số dưới dạng nhị phân, số thực cũng không ngoại lệ. Java sử dụng tiêu chuẩn **IEEE 754** để biểu diễn và tính toán số thực, bạn có thể xem kết quả chuyển đổi số thành nhị phân tại đây.

Ví dụ, biểu diễn nhị phân của `0.1` là `0.0 0011 0011 0011…` (0011 lặp vô hạn), chuyển đổi thành thập phân là `0.1000000000000000055511151231257827021181583404541015625`. Đối với máy tính, `0.1` không thể biểu diễn chính xác, đây là nguyên nhân gây mất độ chính xác trong tính toán số thực.

**Trong các tình huống không thể biểu diễn và tính toán số thực chính xác, hãy sử dụng kiểu dữ liệu BigDecimal**.

Khi sử dụng BigDecimal, có một chi tiết cần lưu ý đặc biệt. Hãy xem đoạn mã sau:

```java
System.out.println(new BigDecimal(0.1).add(new BigDecimal(0.2)));
// Kết quả: 0.3000000000000000166533453693773481063544750213623046875

System.out.println(new BigDecimal(1.0).subtract(new BigDecimal(0.8)));
// Kết quả: 0.1999999999999999555910790149937383830547332763671875

System.out.println(new BigDecimal(4.015).multiply(new BigDecimal(100)));
// Kết quả: 401.49999999999996802557689079549163579940795898437500

System.out.println(new BigDecimal(123.3).divide(new BigDecimal(100)));
// Kết quả: 1.232999999999999971578290569595992565155029296875
```

Tại sao kết quả vẫn không đúng như kỳ vọng?

**Khi sử dụng BigDecimal để biểu diễn và tính toán số thực, hãy chắc chắn sử dụng phương thức khởi tạo từ chuỗi để khởi tạo BigDecimal**.

### Độ chính xác và định dạng số thực

**Định dạng chuỗi của số thực cũng cần sử dụng BigDecimal**.

```java
private static void wrong1() {
    double num1 = 3.35;
    float num2 = 3.35f;
    System.out.println(String.format("%.1f", num1)); // 3.4
    System.out.println(String.format("%.1f", num2)); // 3.3
}

private static void wrong2() {
    double num1 = 3.35;
    float num2 = 3.35f;
    DecimalFormat format = new DecimalFormat("#.##");
    format.setRoundingMode(RoundingMode.DOWN);
    System.out.println(format.format(num1)); // 3.35
    format.setRoundingMode(RoundingMode.DOWN);
    System.out.println(format.format(num2)); // 3.34
}

private static void right() {
    BigDecimal num1 = new BigDecimal("3.35");
    BigDecimal num2 = num1.setScale(1, BigDecimal.ROUND_DOWN);
    System.out.println(num2); // 3.3
    BigDecimal num3 = num1.setScale(1, BigDecimal.ROUND_HALF_UP);
    System.out.println(num3); // 3.4
}
```

### Vấn đề so sánh BigDecimal

```java
private static void wrong() {
    System.out.println(new BigDecimal("1.0").equals(new BigDecimal("1")));
}

private static void right() {
    System.out.println(new BigDecimal("1.0").compareTo(new BigDecimal("1")) == 0);
}
```

Chú thích của phương thức equals của BigDecimal cho biết nguyên nhân, equals so sánh giá trị và scale của BigDecimal, scale của 1.0 là 1, scale của 1 là 0, vì vậy kết quả sẽ luôn là false.

**Nếu chúng ta chỉ muốn so sánh giá trị của BigDecimal, có thể sử dụng phương thức compareTo**.

Phương thức equals và hashCode của BigDecimal đồng thời xem xét value và scale, nếu kết hợp với HashSet hoặc HashMap, có thể gây ra vấn đề. Ví dụ, chúng ta thêm BigDecimal có giá trị là 1.0 vào HashSet, sau đó kiểm tra xem có tồn tại BigDecimal có giá trị là 1 không, kết quả sẽ là false.

```java
Set<BigDecimal> hashSet1 = new HashSet<>();
hashSet1.add(new BigDecimal("1.0"));
System.out.println(hashSet1.contains(new BigDecimal("1")));// false
```

Có hai cách để giải quyết vấn đề này:

Cách thứ nhất là, sử dụng TreeSet thay thế HashSet. TreeSet không sử dụng phương thức hashCode và không so sánh các phần tử bằng equals, mà sử dụng phương thức compareTo, vì vậy không có vấn đề gì.

Cách thứ hai là, trước khi lưu BigDecimal vào HashSet hoặc HashMap, sử dụng phương thức stripTrailingZeros để loại bỏ số 0 ở cuối, so sánh cũng loại bỏ số 0 ở cuối, đảm bảo rằng các BigDecimal có cùng giá trị, cùng scale.

```java
Set<BigDecimal> hashSet2 = new HashSet<>();
hashSet2.add(new BigDecimal("1.0").stripTrailingZeros());
System.out.println(hashSet2.contains(new BigDecimal("1.000").stripTrailingZeros()));// true

Set<BigDecimal> treeSet = new TreeSet<>();
treeSet.add(new BigDecimal("1.0"));
System.out.println(treeSet.contains(new BigDecimal("1")));// true
```

### Tràn số

Một điểm cần chú ý khác trong tính toán số học là tràn số, không phân biệt là int hay long, tất cả các kiểu dữ liệu số học cơ bản đều có khả năng vượt quá phạm vi biểu diễn.

```java
long l = Long.MAX_VALUE;
System.out.println(l + 1); // -9223372036854775808
System.out.println(l + 1 == Long.MIN_VALUE); // true
```

**Rõ ràng đây là một tràn số, và còn là tràn số im lặng, không có bất kỳ ngoại lệ nào được ném ra**. Loại vấn đề này rất dễ bị bỏ qua, có hai cách để cải thiện.

Cách thứ nhất là, xem xét sử dụng các phương thức `xxExact` của lớp `Math` như `addExact`, `subtractExact` để thực hiện tính toán số học, các phương thức này có thể ném ra ngoại lệ khi tràn số.

```java
try {
    long l = Long.MAX_VALUE;
    System.out.println(Math.addExact(l, 1));
} catch (Exception ex) {
    ex.printStackTrace();
}
```

Cách thứ hai là, sử dụng lớp BigInteger. BigDecimal là chuyên gia xử lý số thực, còn BigInteger là chuyên gia tính toán khoa học cho số lớn.

```java
BigInteger i = new BigInteger(String.valueOf(Long.MAX_VALUE));
System.out.println(i.add(BigInteger.ONE).toString());

try {
    long l = i.add(BigInteger.ONE).longValueExact();
} catch (Exception ex) {
    ex.printStackTrace();
}
```
