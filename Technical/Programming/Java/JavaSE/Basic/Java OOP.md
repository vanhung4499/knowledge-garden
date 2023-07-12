---
categories: [java, javase]
title: Java OOP
date created: 2023-07-02
date modified: 2023-07-13
tags: [java, javase]
---

# Java OOP

Mỗi ngôn ngữ lập trình đều có cách riêng để thao tác với các phần tử trong bộ nhớ.

Trong Java, chúng ta có các kiểu dữ liệu cơ bản ([[Java Basic Data Type In Depth]]), nhưng chúng vẫn không đáp ứng đủ nhu cầu trừu tượng hóa các kiểu dữ liệu phức tạp hơn trong quá trình viết chương trình. Do đó, trong Java, chúng ta được phép tạo ra các kiểu dữ liệu tùy chỉnh bằng cách sử dụng lớp (chúng ta sẽ tìm hiểu về cơ chế lớp sau).

Có được kiểu dữ liệu tùy chỉnh, tự nhiên kiểu dữ liệu sẽ thay đổi theo nhiều cách khác nhau, vì vậy, cần có một cơ chế để đảm bảo rằng chúng vẫn giữ một số đặc điểm cần thiết và chung.

Trong thế giới Java có một câu nói nổi tiếng: "Mọi thứ đều là đối tượng". Câu này bạn có thể nghe từ ngày đầu tiên học Java. Đây không chỉ là một khẩu hiệu, mà còn phản ánh trong thiết kế của Java.

- Đầu tiên, tất cả các lớp Java đều kế thừa từ lớp `Object` (từ cái tên này, bạn có thể thấy điều này).
- Hầu hết các đối tượng Java được khởi tạo bằng cách sử dụng từ khóa `new` (ngoại trừ các kiểu dữ liệu cơ bản, String, và đặc biệt là enum), và các đối tượng được lưu trữ trong heap.

```java
// Ví dụ dưới đây
String s = "abc";
String s = new String("abc");
```

Ở đây, `String s` định nghĩa một tham chiếu có tên là `s`, nó trỏ đến một đối tượng kiểu `String`, trong khi đối tượng thực tế là chuỗi `"abc"`. Điều này giống như việc sử dụng điều khiển từ xa (tham chiếu) để điều khiển một chiếc TV (đối tượng).

Khác với ngôn ngữ C/C++, bạn chỉ cần tạo một đối tượng bằng cách sử dụng `new`, nhưng không cần phải loại bỏ (destructor) một đối tượng. Máy ảo Java chịu trách nhiệm chạy chương trình Java có một bộ thu gom rác (Garbage Collector), nó sẽ giám sát các đối tượng được tạo bằng `new`, và một khi phát hiện đối tượng không được tham chiếu nữa, nó sẽ giải phóng không gian bộ nhớ của đối tượng.

## Ba đặc điểm chính của OOP

> [!NOTE]+ Tại sao lại là 3, phải là 4 chứ?  
> Bởi vì tôi xem trừu tượng (abstraction) là một phần trong đóng gói (encapsulation)

### Đóng gói (Encapsulation)

Sử dụng kiểu dữ liệu trừu tượng để đóng gói dữ liệu và các hoạt động dựa trên dữ liệu thành một thực thể độc lập không thể tách rời. Dữ liệu được bảo vệ trong phạm vi của kiểu dữ liệu trừu tượng, ẩn các chi tiết bên trong càng nhiều càng tốt, chỉ giữ lại một số giao diện bên ngoài để liên kết với bên ngoài. Người dùng không cần biết chi tiết bên trong của đối tượng, nhưng có thể truy cập vào đối tượng đó thông qua các giao diện mà đối tượng cung cấp.  

> **Encapsulation  =  Data Hiding + Abstraction.**

Ưu điểm:

- Giảm sự kết nối: Có thể phát triển, kiểm thử, tối ưu hóa, sử dụng, hiểu và sửa đổi độc lập
- Giảm gánh nặng bảo trì: Dễ hiểu hơn cho các lập trình viên và có thể gỡ lỗi mà không ảnh hưởng đến các module khác
- Điều chỉnh hiệu suất hiệu quả: Có thể xác định các module nào ảnh hưởng đến hiệu suất hệ thống Nâng cao khả năng tái sử dụng phần mềm
- Giảm rủi ro xây dựng hệ thống lớn: Ngay cả khi toàn bộ hệ thống không khả dụng, các module độc lập này vẫn có thể khả dụng

Lớp Person dưới đây đóng gói các thuộc tính như tên (name), giới tính (gender), tuổi (age), v.v. Bên ngoài chỉ có thể truy cập vào thuộc tính name và gender của một đối tượng Person thông qua phương thức get(), trong khi không thể truy cập vào thuộc tính age. Tuy nhiên, thuộc tính age có thể được sử dụng bởi phương thức work().

Lưu ý rằng thuộc tính gender được lưu trữ bằng kiểu dữ liệu int, nhưng việc đóng gói giúp người dùng không nhận thấy chi tiết cài đặt này. Và khi cần thay đổi kiểu dữ liệu sử dụng cho thuộc tính gender, cũng có thể thực hiện mà không ảnh hưởng đến mã khách hàng.

```java
public class Person {

    private String name;
    private int gender;
    private int age;

    public String getName() {
        return name;
    }

    public String getGender() {
        return gender == 0 ? "man" : "woman";
    }

    public void work() {
        if (18 <= age && age <= 50) {
            System.out.println(name + " is working very hard!");
        } else {
            System.out.println(name + " can't work any more!");
        }
    }
}
```

### Kế thừa (Inheritance)

Kế thừa là một trong những nền tảng của kỹ thuật lập trình hướng đối tượng, vì nó cho phép tạo ra một cấu trúc phân cấp các lớp.

Kế thừa là quá trình mà một lớp con kế thừa các đặc điểm và hành vi của lớp cha, làm cho đối tượng của lớp con (thể hiện) có các trường và phương thức của lớp cha, hoặc lớp con kế thừa phương thức từ lớp cha, làm cho đối tượng của lớp con có cùng phương thức với lớp cha.

Ví dụ trong thực tế:

Chó và chim đều là động vật. Nếu chúng ta xem chó và chim là các lớp, chúng có thể kế thừa lớp động vật.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230712220146.png)

Kế thừa thực hiện mối quan hệ **IS-A**, ví dụ như Cat Dog Animal là một mối quan hệ IS-A, vì vậy Dog có thể kế thừa từ Animal để có được các thuộc tính và phương thức không phải private của Animal.  

Kế thừa nên tuân theo nguyên tắc thay thế Liskov, đối tượng của lớp con phải có thể thay thế cho tất cả các đối tượng của lớp cha.  

Cat có thể được sử dụng như một Animal, có nghĩa là có thể sử dụng tham chiếu Animal để tham chiếu đối tượng Cat. Tham chiếu của lớp cha trỏ đến đối tượng của lớp con được gọi là **upcasting**.

```java
class Animal {};

class Dog extends Animal {};

Animal animal = new Dog();
```

#### Đặc điểm của kế thừa

- Lớp con có thể kế thừa các thuộc tính và phương thức của lớp cha. Lưu ý rằng, trừ các phương thức khởi tạo (constructor), các constructor chỉ có thể được gọi, không thể được kế thừa.
- Lớp con có thể có các thuộc tính và phương thức riêng của nó, tức là lớp con có thể mở rộng lớp cha.
- Lớp con có thể triển khai các phương thức của lớp cha theo cách riêng của nó.
- Java hỗ trợ kế thừa đơn, không hỗ trợ đa kế thừa, nhưng có thể kế thừa nhiều lớp, đơn kế thừa chỉ có nghĩa là một lớp con chỉ có thể kế thừa một lớp cha, trong khi đa kế thừa nhiều lớp có nghĩa là, ví dụ, lớp A kế thừa lớp B, lớp B kế thừa lớp C, vì vậy theo quan hệ này, lớp C là lớp cha của lớp B và lớp B là lớp cha của lớp A, đây là một tính năng khác biệt giữa kế thừa Java và kế thừa C++.
- Kế thừa tăng tính kết nối giữa các lớp (nhược điểm của kế thừa, độ kết nối cao sẽ làm cho sự liên kết giữa các đoạn mã càng chặt chẽ, độc lập mã càng kém).

#### Từ khóa kế thừa

Kế thừa có thể được thực hiện bằng cách sử dụng từ khóa `extends` và `implements`, và tất cả các lớp đều kế thừa từ `java.lang.Object`. Khi một lớp không có từ khóa kế thừa, nó mặc định kế thừa từ `Object` (lớp này nằm trong gói **`java.lang`**, nên không cần **`import`**).

### Đa hình (Polymorphism)

Khi bắt đầu học lập trình hướng đối tượng, bạn có thể bị mất trong các thuật ngữ khác nhau. Vì vậy, nhiều người sẽ học thuộc lòng các định nghĩa thuật ngữ trong sách giáo trình.

Tuy nhiên, khi bạn áp dụng và hiểu sâu hơn, bạn sẽ có một cái nhìn tổng quan hơn và hiểu rõ hơn về chúng.

Trước khi học về lớp, hãy cùng suy nghĩ về một câu hỏi: Tại sao Java lại giới thiệu cơ chế lớp, mục đích thiết kế là gì?

Java cung cấp các kiểu dữ liệu cơ bản, chỉ có thể đại diện cho một giá trị đơn. Điều này hữu ích cho tính toán số, nhưng không đủ để mô phỏng các đối tượng phức tạp trong thực tế.

Hãy tưởng tượng bạn cần mô phỏng mô hình dữ liệu cho một con chó, bạn sẽ làm thế nào? Con chó có mắt, tai, miệng, mũi và các cơ quan khác, nó có chân, chó có kích thước, màu lông, đây là trạng thái của nó, con chó có thể chạy, kêu, ăn, đây là hành vi của nó.

Việc giới thiệu lớp là để trừu tượng hóa những thứ phức tạp tương đối như vậy.

Đa hình chia thành đa hình biên dịch và đa hình chạy:

- Đa hình biên dịch chủ yếu ám chỉ việc nạp chồng phương thức (method overloading).
- Đa hình chạy ám chỉ rằng loại cụ thể mà tham chiếu đối tượng được định nghĩa trong chương trình chỉ được xác định trong thời gian chạy.

Đa hình chạy có ba điều kiện:

- Kế thừa
- Ghi đè
- Upcasting

Trong đoạn mã dưới đây, lớp `Instrument` có hai lớp con: `Wind` và `Percussion`, chúng đều ghi đè phương thức `play()` của lớp cha và trong phương thức `main()`, sử dụng tham chiếu của lớp cha `Instrument` để tham chiếu đối tượng `Wind` và `Percussion`. Khi tham chiếu `Instrument` gọi phương thức `play()`, nó sẽ thực thi phương thức `play()` của lớp thực tế mà tham chiếu đối tượng đang trỏ tới, chứ không phải phương thức của lớp `Instrument`.

```java
public class Instrument {
    public void play() {
        System.out.println("Instrument is playing...");
    }
}

public class Wind extends Instrument {
    public void play() {
        System.out.println("Wind is playing...");
    }
}

public class Percussion extends Instrument {
    public void play() {
        System.out.println("Percussion is playing...");
    }
}

public class Music {
    public static void main(String[] args) {
        List<Instrument> instruments = new ArrayList<>();
        instruments.add(new Wind());
        instruments.add(new Percussion());
        for(Instrument instrument : instruments) {
            instrument.play();
        }
    }
}
```

## Lớp (Class)

Giống như hầu hết các ngôn ngữ lập trình hướng đối tượng khác, Java sử dụng từ khóa `class` để đại diện cho các kiểu tùy chỉnh. Kiểu tùy chỉnh được tạo ra để dễ dàng trừu tượng hóa các đối tượng trong thực tế.

Trong một lớp, có hai thành phần chính: thuộc tính (tĩnh) và phương thức (động).

- **Thuộc tính (còn được gọi là thành viên, trường)** - Thuộc tính trừu tượng hóa trạng thái của đối tượng. Thuộc tính của lớp có thể là bất kỳ loại đối tượng nào.
- **Phương thức (còn được gọi là hàm)** - Phương thức trừu tượng hóa hành vi của đối tượng.

## Phương thức (Method)

### Định nghĩa phương thức

```
[phạm vi truy cập] [kiểu trả về] [tên phương thức]([danh sách tham số]) {
    // Khối lệnh
    return [giá trị trả về];
}
```

Một phương thức bao gồm một tiêu đề phương thức và một khối lệnh. Dưới đây là tất cả các phần của một phương thức:

- **Phạm vi truy cập:** Phạm vi truy cập là tùy chọn và cho biết cách gọi phương thức. Nó xác định loại truy cập của phương thức.
- **Kiểu trả về:** Phương thức có thể trả về một giá trị. Nếu không có giá trị trả về, trong trường hợp này, kiểu trả về phải được đặt là `void`.
- **Tên phương thức:** Đây là tên thực tế của phương thức. Tên phương thức và danh sách tham số cùng tạo thành chữ ký phương thức.
- **Danh sách tham số:** Tham số là một biến giống như một tham số. Khi phương thức được gọi, giá trị được chuyển cho tham số. Giá trị này được gọi là đối số hoặc tham số thực.
- **Khối lệnh:** Khối lệnh chứa các câu lệnh cụ thể, xác định chức năng của phương thức.
- **Giá trị trả về:** Nếu phương thức trả về một giá trị, phương thức sẽ chứa một câu lệnh `return` để trả về giá trị đó.

Ví dụ:

```java
public static int add(int x, int y) {
   return x + y;
}
```

### Gọi phương thức

Java hỗ trợ hai cách gọi phương thức, tùy thuộc vào việc phương thức có trả về giá trị hay không.

Khi một chương trình gọi một phương thức, quyền điều khiển của chương trình được chuyển cho phương thức được gọi. Khi câu lệnh `return` trong phương thức được thực thi hoặc đến cuối khối lệnh của phương thức, quyền điều khiển được trả lại cho chương trình.

Khi phương thức trả về một giá trị, phương thức gọi thường được coi là một giá trị. Ví dụ:

```java
int larger = max(30, 40);
```

Nếu phương thức không trả về giá trị, cuộc gọi phương thức thường là một câu lệnh. Ví dụ, phương thức `println` trả về `void`. Cuộc gọi dưới đây là một câu lệnh:

```java
System.out.println("Hello World");
```

### Phương thức khởi tạo (constructor)

Mỗi lớp đều có một phương thức khởi tạo. Nếu không có phương thức khởi tạo được xác định rõ cho lớp, trình biên dịch Java sẽ tạo ra một phương thức khởi tạo mặc định cho lớp đó.

Khi tạo một đối tượng, ít nhất một phương thức khởi tạo phải được gọi. Phương thức khởi tạo có tên phải giống với tên lớp và một lớp có thể có nhiều phương thức khởi tạo.

```java
public class Puppy{
    public Puppy(){
    }

    public Puppy(String name){
        // Phương thức khởi tạo này chỉ có một tham số: name
    }
}
```

## Biến (Variable)

Java hỗ trợ các loại biến sau:

- `Biến cục bộ` - Biến trong phương thức của lớp.
- `Biến thể hiện (còn gọi là biến thành viên)` - Biến nằm ngoài phương thức của lớp, nhưng không có từ khóa `static`.
- `Biến lớp (còn gọi là biến tĩnh)` - Biến nằm ngoài phương thức của lớp và được đánh dấu bằng từ khóa `static`.

So sánh các đặc điểm:

| Biến cục bộ                                                                                                                | Biến thể hiện (còn gọi là biến thành viên)                                                                                                                  | Biến lớp (còn gọi là biến tĩnh)                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Biến cục bộ được khai báo trong phương thức, hàm tạo hoặc khối lệnh.                                                         | Biến thể hiện được khai báo ngoài phương thức, hàm tạo và khối lệnh.                                                                                           | Biến lớp được khai báo ngoài phương thức, hàm tạo và khối lệnh. Và được đánh dấu bằng từ khóa `static`.                                                                                             |
| Biến cục bộ được tạo khi phương thức, hàm tạo hoặc khối lệnh được thực thi và bị hủy sau khi thực thi xong.                  | Biến thể hiện được tạo khi đối tượng được tạo và bị hủy khi đối tượng bị hủy.                                                                                  | Biến lớp được tạo khi được truy cập lần đầu tiên và bị hủy khi chương trình kết thúc.                                                                                                              |
| Biến cục bộ không có giá trị mặc định, vì vậy phải được khởi tạo trước khi sử dụng.                                          | Biến thể hiện có giá trị mặc định. Giá trị mặc định của biến số là 0, giá trị mặc định của biến boolean là false và giá trị mặc định của biến tham chiếu là null. | Biến lớp có giá trị mặc định. Giá trị mặc định của biến số là 0, giá trị mặc định của biến boolean là false và giá trị mặc định của biến tham chiếu là null. Ngoài ra, biến tĩnh còn có thể được khởi tạo trong khối lệnh tĩnh. |
| Đối với biến cục bộ, nếu là kiểu dữ liệu cơ bản, giá trị sẽ được lưu trữ trực tiếp trong stack; nếu là kiểu dữ liệu tham chiếu, đối tượng sẽ được lưu trữ trong heap và con trỏ đến đối tượng này sẽ được lưu trữ trong stack. | Biến thể hiện được lưu trữ trong heap.                                                                                                                        | Biến lớp được lưu trữ trong vùng lưu trữ tĩnh.                                                                                                                                                     |
| Không thể sử dụng từ khóa truy cập cho biến cục bộ.                                                                         | Có thể sử dụng từ khóa truy cập cho biến thể hiện.                                                                                                           | Có thể sử dụng từ khóa truy cập cho biến lớp.                                                                                                                                                     |
| Biến cục bộ chỉ có thể nhìn thấy trong phương thức, hàm tạo hoặc khối lệnh mà nó được khai báo.                               | Biến thể hiện có thể nhìn thấy trong phương thức, hàm tạo hoặc khối lệnh của lớp. Thông thường, biến thể hiện nên được đặt là private.                           | Tương tự biến thể hiện, biến lớp cũng có thể nhìn thấy trong phương thức, hàm tạo hoặc khối lệnh của lớp. Tuy nhiên, để nhìn thấy từ bên ngoài lớp, hầu hết biến tĩnh được khai báo là public.               |
|                                                                                                                          | Biến thể hiện có thể truy cập trực tiếp bằng tên biến. Tuy nhiên, trong phương thức tĩnh và các lớp khác, cần sử dụng tên đầy đủ: ObejectReference.VariableName. | Biến tĩnh có thể truy cập bằng cách sử dụng: ClassName.VariableName.                                                                                                                               |
|                                                                                                                          |                                                                                                                                                           | Một lớp chỉ có một bản sao của biến tĩnh, dù cho lớp tạo ra bao nhiêu đối tượng.                                                                                                                   |
|                                                                                                                          |                                                                                                                                                           | Biến tĩnh ít được sử dụng ngoại trừ khi được khai báo là hằng số.                                                                                                                                   |

### Các từ khóa sửa đổi biến

- Từ khóa sửa đổi cấp độ truy cập - Nếu biến là biến thể hiện hoặc biến lớp, có thể thêm từ khóa sửa đổi cấp độ truy cập (public/protected/private).
- Từ khóa tĩnh - Nếu biến là biến lớp, cần thêm từ khóa static.
- final - Nếu biến được sử dụng với từ khóa final, nghĩa là đây là một hằng số và không thể thay đổi.

### Tạo đối tượng

Đối tượng được tạo dựa trên lớp. Trong Java, sử dụng từ khóa `new` để tạo một đối tượng mới. Quá trình tạo đối tượng bao gồm ba bước sau:

- **Khai báo**: Khai báo một đối tượng, bao gồm tên đối tượng và kiểu đối tượng.
- **Khởi tạo thực thể**: Sử dụng từ khóa `new` để tạo một đối tượng.
- **Khởi tạo**: Khi tạo đối tượng bằng từ khóa `new`, sẽ gọi phương thức khởi tạo để khởi tạo đối tượng.

```java
public class Puppy{
   public Puppy(String name){
      // Constructor này chỉ có một tham số: name
      System.out.println("Tên chú chó nhỏ là : " + name );
   }
   public static void main(String[] args){
      // Dòng sau sẽ tạo một đối tượng Puppy
      Puppy myPuppy = new Puppy( "cat" );
   }
}
```

### Truy cập biến thể hiện và phương thức

```java
/* Tạo đối tượng */
ObjectReference = new Constructor();
/* Truy cập biến trong lớp */
ObjectReference.variableName;
/* Truy cập phương thức trong lớp */
ObjectReference.methodName();
```

## Kiểm soát quyền truy cập

### Tổ chức mã

**Khi biên dịch một tệp .java, mỗi lớp trong tệp .java sẽ tạo ra một tệp .class có cùng tên.**

Ví dụ MultiClassDemo.java:

```java
class MultiClass1 {}

class MultiClass2 {}

class MultiClass3 {}

public class MultiClassDemo {}
```

Khi chạy lệnh `javac MultiClassDemo.java`, sẽ tạo ra bốn tệp `MultiClass1.class`, `MultiClass2.class`, `MultiClass3.class` và `MultiClassDemo.class`.

**Chương trình Java có thể chạy là một tập hợp các tệp .class được đóng gói và nén thành một tệp .jar.** Trình thông dịch Java có trách nhiệm tìm kiếm, tải và giải thích các tệp này. **Thư viện lớp Java thực tế là một tập hợp các tệp lớp (.java).**

- **Mỗi tệp cho phép có một public class và bất kỳ số lớp non-public nào**.
- **Tên public class phải giống với tên tệp .java, bao gồm cả chữ hoa và chữ thường**.

Chương trình thường không chỉ do một người viết, nó sẽ gọi lệnh hệ thống, mã của bên thứ ba, mã được viết bởi người khác trong dự án, v.v. Vì mục đích khác nhau, cùng một tên lớp / giao diện có thể được định nghĩa bởi nhiều người, đây là xung đột tên.

Trong Java, để giải quyết vấn đề xung đột tên, cung cấp cơ chế gói (package) và cơ chế nhập (import).

#### package

Nguyên tắc của gói (package):

- Gói tương tự như thư mục, tệp được đặt trong thư mục, lớp và giao diện được đặt trong gói. Để dễ dàng tổ chức, thư mục thường là một cấu trúc cây có cấu trúc.
- **Tên gói được phân tách bằng dấu chấm (.) để chỉ ra cấu trúc cây**.
- Một quy ước phổ biến để đặt tên gói là sử dụng tên miền làm tiền tố, vì tên miền là duy nhất, thông thường, tên gói được định nghĩa theo thứ tự ngược của tên miền, ví dụ, tên miền là: apache.org, tên gói bắt đầu bằng org.apache.
- **Tên gói và cấu trúc thư mục phải khớp hoàn toàn**. Quá trình thực thi Java như sau:
	- Tìm biến môi trường `CLASSPATH` làm thư mục gốc của tệp .class.
	- Bắt đầu từ thư mục gốc, lấy tên gói và thay thế dấu chấm (.) bằng dấu phân cách thư mục (gạch chéo /), sau đó sử dụng tên đường dẫn này để tìm kiếm lớp Java.

#### import

Nếu lớp không nằm trong cùng một gói, lớp đó phải biết gói của nó để sử dụng nó, có hai cách để làm điều này:

- Sử dụng tên đầy đủ của lớp
- Sử dụng từ khóa `import` để nhập lớp cần sử dụng vào lớp hiện tại

Ví dụ sử dụng tên đầy đủ của lớp:

```java
public class PackageDemo {
    public static void main(String[] args) {
        System.out.println(new java.util.Date());
        System.out.println(new java.util.Date());
    }
}
```

Ví dụ sử dụng từ khóa `import` để nhập lớp từ gói khác vào lớp hiện tại:

```java
import java.util.Date;

public class PackageDemo2 {
    public static void main(String[] args) {
        System.out.println(new Date());
        System.out.println(new Date());
    }
}
```

> Lưu ý: So sánh hai ví dụ trên, rõ ràng là ví dụ sử dụng từ khóa nhập (import) có mã nguồn gọn gàng hơn.

### Từ khóa điều chỉnh quyền truy cập (Access Modifier)

Cấp độ kiểm soát quyền truy cập từ cấp độ cao nhất đến cấp độ thấp nhất là:

```
public > protected > quyền truy cập gói (không có từ khóa) > private
```

- `public` - Cho phép bất kỳ lớp nào truy cập.
- `quyền truy cập gói` - Quyền truy cập gói, không có từ khóa. Nó cho phép tất cả các lớp khác trong gói hiện tại truy cập, nhưng các lớp trong gói khác không thể truy cập.
- `protected` - Cho phép lớp con truy cập, ngoài ra, các lớp khác trong cùng một gói cũng có thể truy cập, ngay cả khi chúng không phải là lớp con.
- `private` - Không cho phép bất kỳ lớp nào khác truy cập.

## Giao diện (Interface)

Giao diện là một trừu tượng hóa của hành vi, nó là một tập hợp các phương thức trừu tượng. Giao diện cho phép tách biệt định nghĩa API và việc triển khai.

Giao diện không thể được khởi tạo; không thể chứa bất kỳ thành viên nào không phải là hằng số, tất cả các trường đều được ngầm định là `public static final`; đồng thời, không có phương thức nào không phải là phương thức trừu tượng hoặc phương thức tĩnh.

Trong thư viện lớp tiêu chuẩn của Java, đã định nghĩa rất nhiều giao diện như `java.util.List`.

```java
public interface Comparable<T> {
    public int compareTo(T o);
}
```

## Lớp trừu tượng (Abstract Class)

Lớp trừu tượng là một lớp không thể khởi tạo, được đánh dấu bằng từ khóa `abstract` trước từ khóa `class` để chỉ ra mục đích chính là tái sử dụng mã. Ngoài việc không thể khởi tạo, hình thức của lớp trừu tượng không khác biệt nhiều so với lớp Java thông thường, có thể có một hoặc nhiều phương thức trừu tượng, hoặc không có phương thức trừu tượng. Lớp trừu tượng thường được sử dụng để trích xuất các phương thức chung hoặc biến thành viên chung của các lớp Java liên quan, sau đó sử dụng kế thừa để tái sử dụng mã.

Trong thư viện lớp tiêu chuẩn của Java, ví dụ như `collection`, nhiều phần chung đã được trích xuất thành lớp trừu tượng, ví dụ `java.util.AbstractList`.

1. Lớp trừu tượng không thể được khởi tạo (đây là một lỗi phổ biến của người mới học), nếu khởi tạo, sẽ gây ra lỗi và không thể biên dịch. Chỉ có thể tạo đối tượng từ lớp con không trừu tượng của nó.
2. Lớp trừu tượng không nhất thiết phải chứa phương thức trừu tượng, nhưng lớp có phương thức trừu tượng nhất định phải là lớp trừu tượng.
3. Phương thức trừu tượng trong lớp trừu tượng chỉ là khai báo, không chứa thân phương thức, có nghĩa là không cung cấp cài đặt cụ thể của phương thức.
4. Phương thức khởi tạo, phương thức lớp (được đánh dấu bằng từ khóa static) không thể khai báo là phương thức trừu tượng.
5. Lớp con của lớp trừu tượng phải cung cấp cài đặt cụ thể cho các phương thức trừu tượng trong lớp trừu tượng, trừ khi lớp con đó cũng là lớp trừu tượng.
