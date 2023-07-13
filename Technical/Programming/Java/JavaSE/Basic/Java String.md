---
title: Java String
tags: [java, javase]
categories: [java, javase]
date created: 2023-07-13
date modified: 2023-07-13
---

# Hiểu sâu về lớp String trong Java

> Lớp String có thể là một trong những lớp tham chiếu phổ biến nhất trong Java, nhưng vấn đề về hiệu suất của nó thường bị bỏ qua. Sử dụng chuỗi hiệu quả có thể cải thiện hiệu suất tổng thể của hệ thống. Tuy nhiên, để sử dụng chuỗi hiệu quả, chúng ta cần hiểu rõ về các đặc điểm của nó.

## Tính không thay đổi của String

Trước tiên, chúng ta hãy xem định nghĩa của lớp String:

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    /** The value is used for character storage. */
    private final char value[];
```

Lớp String được đánh dấu bằng từ khóa `final`, có nghĩa là **không thể kế thừa lớp String**.

Dữ liệu của lớp String được lưu trữ trong một mảng `char[]`, mảng này được đánh dấu bằng từ khóa `final`, có nghĩa là **đối tượng String không thể thay đổi**.

Tại sao Java lại thiết kế như vậy?

(1) **Đảm bảo tính an toàn của đối tượng String**. Tránh việc thay đổi String.

(2) **Đảm bảo giá trị hash không thay đổi thường xuyên**.

(3) **Có thể thực hiện hằng số hóa chuỗi**. Thông thường có hai cách để tạo đối tượng chuỗi, một là thông qua cách tạo hằng số chuỗi, ví dụ: `String str = "abc";` Cách thứ hai là tạo đối tượng chuỗi thông qua cách tạo mới, ví dụ: `String str = new String("abc")`.

Khi tạo đối tượng chuỗi bằng cách sử dụng cách thứ nhất, JVM sẽ kiểm tra xem đối tượng đó có tồn tại trong bộ nhớ hằng số (String Pool) không. Nếu có, nó sẽ trả về tham chiếu của đối tượng đó, nếu không, chuỗi mới sẽ được tạo trong bộ nhớ hằng số. Cách này giúp giảm việc tạo lại đối tượng chuỗi có cùng giá trị, tiết kiệm bộ nhớ.

Khi tạo đối tượng chuỗi bằng cách sử dụng cách thứ hai, đầu tiên, trong quá trình biên dịch, chuỗi hằng số `"abc"` sẽ được đặt vào cấu trúc hằng số, và khi lớp được tải, `"abc"` sẽ được tạo trong bộ nhớ hằng số; sau đó, khi gọi `new`, JVM sẽ gọi hàm tạo của String và tham chiếu đến chuỗi `"abc"` trong bộ nhớ hằng số, tạo một đối tượng String trong bộ nhớ heap; cuối cùng, str sẽ tham chiếu đến đối tượng String.

## Hiệu suất của String

### Nối chuỗi

**Khi nối chuỗi hằng số, trình biên dịch sẽ tối ưu thành một chuỗi hằng số**.

【Ví dụ】Nối chuỗi hằng số

```java
public static void main(String[] args) {
    // Dòng mã này trong tệp class sẽ được trình biên dịch tối ưu trực tiếp thành:
    // String str = "abc";
    String str = "a" + "b" + "c";
    System.out.println("str = " + str);
}
```

**Khi nối chuỗi biến, trình biên dịch sẽ tối ưu thành cách sử dụng `StringBuilder`**.

【Ví dụ】Nối chuỗi biến

```java
public static void main(String[] args) {
    String str = "";
    for(int i=0; i<1000; i++) {
        // Dòng mã này sẽ được trình biên dịch tối ưu thành:
        // str = (new StringBuilder(String.valueOf(str))).append(i).toString();
        str = str + i;
    }
}
```

Tuy nhiên, mỗi lần lặp sẽ tạo một đối tượng StringBuilder mới, điều này cũng sẽ làm giảm hiệu suất của hệ thống.

Cách làm đúng khi nối chuỗi:

- Nếu cần nối chuỗi, nên ưu tiên sử dụng phương thức `append` của `StringBuilder` thay vì sử dụng dấu `+`.
- Nếu trong lập trình đa luồng, việc nối chuỗi liên quan đến an toàn luồng, có thể sử dụng `StringBuffer`. Tuy nhiên, cần lưu ý rằng vì `StringBuffer` là an toàn luồng, liên quan đến cạnh tranh khóa, nên từ mặt hiệu suất, nó sẽ kém hơn `StringBuilder`.

### Tách chuỗi

**Phương thức `split()` của String sử dụng biểu thức chính quy để thực hiện chức năng tách chuỗi mạnh mẽ**. Hiệu suất của biểu thức chính quy là không ổn định, sử dụng không đúng cách có thể gây ra vấn đề về đệ quy, dẫn đến CPU hoạt động ở mức cao.

Vì vậy, cần cẩn thận sử dụng phương thức `split()` và **có thể sử dụng phương thức `indexOf()` của String để thay thế phương thức `split()` để thực hiện tách chuỗi**. Nếu không thể đáp ứng yêu cầu, bạn chỉ cần chú ý vấn đề đệ quy khi sử dụng phương thức `split()`.

### String.intern

**Khi gán giá trị, sử dụng phương thức `intern()` của String, nếu giá trị đã tồn tại trong bộ nhớ hằng số, đối tượng sẽ được sử dụng lại và trả về tham chiếu đến đối tượng đó, điều này cho phép đối tượng ban đầu có thể được thu hồi**.

Trong chuỗi hằng số, mặc định sẽ đặt đối tượng vào bộ nhớ hằng số; trong chuỗi biến, đối tượng sẽ được tạo trong bộ nhớ heap và cũng sẽ tạo một đối tượng chuỗi trong bộ nhớ hằng số, sao chép vào đối tượng heap.

Nếu gọi phương thức `intern()`, nó sẽ kiểm tra xem chuỗi đã tồn tại trong bộ nhớ hằng số chưa. Nếu chưa, nó sẽ tạo một chuỗi mới trong bộ nhớ hằng số và trả về tham chiếu đến chuỗi đó; nếu có, nó sẽ trả về tham chiếu đến chuỗi trong bộ nhớ hằng số. Đối tượng trong heap ban đầu sẽ bị thu hồi do không có tham chiếu trỏ đến nó.

【Ví dụ】

```java
public class SharedLocation {

	private String city;
	private String region;
	private String countryCode;
}

SharedLocation sharedLocation = new SharedLocation();
sharedLocation.setCity(messageInfo.getCity().intern());		sharedLocation.setCountryCode(messageInfo.getRegion().intern());
sharedLocation.setRegion(messageInfo.getCountryCode().intern());
```

> Việc sử dụng phương thức `intern()` cần chú ý: luôn kết hợp với tình huống thực tế. Vì cách triển khai của bộ nhớ hằng số tương tự như cách triển khai của HashTable, kích thước dữ liệu càng lớn, độ phức tạp của việc duyệt càng tăng. Nếu dữ liệu quá lớn, nó sẽ tạo gánh nặng cho toàn bộ bộ nhớ hằng số.

## Sự khác biệt giữa String, StringBuffer và StringBuilder

`String` là một lớp rất cơ bản và quan trọng trong ngôn ngữ Java, cung cấp các logic cơ bản để xây dựng và quản lý chuỗi. Nó là một lớp **bất biến (immutable)**, được khai báo là `final class` và tất cả các thuộc tính cũng là `final`. Do tính không thay đổi của nó, các hành động như nối chuỗi, cắt chuỗi sẽ tạo ra đối tượng String mới. Vì các hoạt động liên quan đến chuỗi rất phổ biến, hiệu suất của chúng thường ảnh hưởng đáng kể đến hiệu suất ứng dụng.

`StringBuffer` được tạo ra để giải quyết vấn đề tạo ra quá nhiều đối tượng trung gian khi nối chuỗi. Chúng ta có thể sử dụng các phương thức `append` hoặc `add` để thêm chuỗi vào cuối chuỗi hiện có hoặc vị trí chỉ định. `StringBuffer` là một chuỗi có thể sửa đổi **an toàn đa luồng (thread-safe)**. Tính an toàn đa luồng của `StringBuffer` được đảm bảo bằng cách sử dụng từ khóa `synchronized` trên các phương thức sửa đổi dữ liệu.

`StringBuilder` là một lớp mới được thêm vào từ Java 1.5. Nó có khả năng tương tự như `StringBuffer`, nhưng không an toàn đa luồng. `StringBuilder` loại bỏ phần an toàn đa luồng, giảm thiểu chi phí và là lựa chọn hàng đầu cho hầu hết các trường hợp nối chuỗi.

Cả `StringBuffer` và `StringBuilder` đều sử dụng một mảng có thể sửa đổi (char, từ JDK 9 trở đi là byte) làm cơ sở, cả hai đều kế thừa từ `AbstractStringBuilder` và chứa các phương thức cơ bản. Sự khác biệt chính giữa chúng chỉ là các phương thức cuối cùng có được đánh dấu bằng từ khóa `synchronized`. Khi xây dựng, kích thước ban đầu được tăng thêm 16 (điều này có nghĩa là nếu không có chuỗi ban đầu được nhập vào khi xây dựng đối tượng, giá trị ban đầu sẽ là 16). Nếu bạn có thể dự đoán được rằng việc nối chuỗi sẽ xảy ra rất nhiều lần và có thể dự đoán được, bạn có thể chỉ định kích thước phù hợp để tránh chi phí của việc mở rộng nhiều lần. Việc mở rộng sẽ tạo ra nhiều chi phí, vì nó phải vứt bỏ mảng ban đầu, tạo một mảng mới (có thể đơn giản coi là bội số) và sao chép dữ liệu bằng `arraycopy`.
