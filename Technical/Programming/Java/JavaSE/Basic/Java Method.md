---
title: Java Method
tags: [java, javase]
categories: [java, javase]
date created: 2023-07-13
date modified: 2023-07-13
---

# Hiểu sâu về Phương thức trong Java

> **Phương thức - Method (có người thích gọi là hàm) là một đoạn mã có thể tái sử dụng.**

## Sử dụng phương thức

### Định nghĩa phương thức

Cú pháp định nghĩa phương thức:

```java
<access_modifier> <return_type> <method_name>(list_of_parameters)
{
    //body
    
    return <return_value>;
}
```

Ví dụ:

```java
public static void main(String[] args) {
    System.out.println("Hello World");
}
```

Một phương thức bao gồm một phần tiêu đề phương thức và một phần thân phương thức. Dưới đây là tất cả các phần của một phương thức:

- **Phạm vi truy cập (access_modifier)** - Phạm vi truy cập là tùy chọn, nó cho trình biên dịch biết cách gọi phương thức. Xác định loại truy cập của phương thức.
- **Kiểu trả về (return_type)** - Kiểu trả về chỉ ra kiểu dữ liệu của kết quả trả về sau khi phương thức thực thi. Nếu không có giá trị trả về, kiểu trả về phải được đặt là void.
- **Tên phương thức (method_name)** - Tên phương thức là tên thực tế của phương thức. Tên phương thức và danh sách tham số cùng tạo thành chữ ký phương thức.
- **Danh sách tham số (list_of_parameters)** - Tham số là một biến giống như một biến tạm. Khi phương thức được gọi, giá trị được chuyển cho tham số. Danh sách tham số chỉ ra kiểu, thứ tự và số lượng tham số của phương thức. Tham số là tùy chọn, một phương thức có thể không chứa bất kỳ tham số nào.
- **Thân phương thức (body)** - Thân phương thức chứa các câu lệnh cụ thể, xác định chức năng của phương thức.
- **return** - Phải trả về một giá trị có cùng kiểu dữ liệu với kiểu trả về được khai báo khi khai báo phương thức. Trong phương thức void, câu lệnh return có thể có hoặc không, nếu có thì chỉ có thể là `return;`.

### Gọi phương thức

Khi chương trình gọi một phương thức, quyền điều khiển của chương trình được chuyển sang phương thức được gọi. Khi câu lệnh return trong phương thức được thực thi hoặc đạt đến dấu ngoặc nhọn cuối cùng của thân phương thức, quyền điều khiển được trả lại cho chương trình.

Java hỗ trợ hai cách gọi phương thức, tùy thuộc vào việc phương thức có giá trị trả về hay không.

- Phương thức có giá trị trả về - Phương thức có giá trị trả về thường được sử dụng để gán giá trị cho một biến hoặc sử dụng trong biểu thức tính toán.

```java
int larger = max(30, 40);
```

- Phương thức không có giá trị trả về - Phương thức không có giá trị trả về chỉ có thể là một câu lệnh duy nhất.

```java
System.out.println("Hello World");
```

#### Gọi đệ quy

Java hỗ trợ đệ quy (tức là gọi chính nó).

> 🔔 Lưu ý:
>
> - Phương thức đệ quy phải có điều kiện dừng rõ ràng.
> - Tránh sử dụng đệ quy nếu không cần thiết. Vì nếu không xử lý đệ quy một cách đúng đắn, có thể gây ra tràn ngăn xếp (stack overflow).

Ví dụ về dãy Fibonacci (một thuật toán đệ quy điển hình):

```java
public class RecursionMethodDemo {
    public static int fib(int num) {
        if (num == 1 || num == 2) {
            return 1;
        } else {
            return fib(num - 2) + fib(num - 1);
        }
    }

    public static void main(String[] args) {
        for (int i = 1; i < 10; i++) {
            System.out.print(fib(i) + "\t");
        }
    }
}
```

## Truyền tham số của phương thức

Trong các ngôn ngữ lập trình như C/C++, có hai hình thức truyền tham số cho phương thức:

- Truyền tham trị - Tham số truyền vào được gọi là tham số hình thức. Khi truyền tham trị, các thay đổi trong phương thức không ảnh hưởng đến giá trị bên ngoài phương thức.
- Truyền tham chiếu - Tham số truyền vào được gọi là tham số thực. Khi truyền tham chiếu, các thay đổi trong phương thức ảnh hưởng đến giá trị bên ngoài phương thức.

Vậy trong Java thì sao?

**Trong Java, chỉ có truyền tham trị.**

Ví dụ 1:

```java
public class MethodParamDemo {
    public static void method(int value) {
        value =  value + 1;
    }
    public static void main(String[] args) {
        int num = 0;
        method(num);
        System.out.println("num = [" + num + "]");
        method(num);
        System.out.println("num = [" + num + "]");
    }
}
// Output:
// num = [0]
// num = [0]
```

Ví dụ 2:

```java
public class MethodParamDemo2 {
    public static void method(StringBuilder sb) {
        sb = new StringBuilder("B");
    }

    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder("A");
        System.out.println("sb = [" + sb.toString() + "]");
        method(sb);
        System.out.println("sb = [" + sb.toString() + "]");
        sb = new StringBuilder("C");
        System.out.println("sb = [" + sb.toString() + "]");
    }
}
// Output:
// sb = [A]
// sb = [A]
// sb = [C]
```

Giải thích:

Cả hai ví dụ trên, cho dù truyền vào phương thức là kiểu dữ liệu nguyên thuỷ hay kiểu dữ liệu tham chiếu, các thay đổi trong phương thức không ảnh hưởng đến giá trị bên ngoài phương thức.

Trong Java, đối với kiểu dữ liệu nguyên thuỷ, giá trị được sao chép và truyền vào phương thức; đối với kiểu dữ liệu tham chiếu, sao chép địa chỉ tham chiếu của đối tượng hiện tại, sau đó truyền địa chỉ này vào phương thức, vì vậy cũng là truyền tham trị.

## Method Modifier

Như đã đề cập trước đó, các phương thức trong Java có thể có hoặc không có các modifier, nó cho biết cho trình biên dịch cách gọi phương thức đó và xác định quyền truy cập của phương thức. Dưới đây là một số modifier của phương thức trong Java:

### Access Modifier

Có các cấp độ quyền truy cập từ cao đến thấp như sau:

```
public > protected > quyền truy cập gói (không có từ khóa nào) > private
```

- `public` - Được truy cập bởi bất kỳ lớp nào.
- `quyền truy cập gói` - Quyền truy cập gói, không có từ khóa nào. Nó chỉ cho phép các lớp khác trong cùng gói truy cập, nhưng không cho phép các lớp trong các gói khác truy cập.
- `protected` - Cho phép lớp con truy cập, ngoài ra, các lớp khác trong cùng gói cũng có thể truy cập, ngay cả khi chúng không phải là lớp con.
- `private` - Không cho phép bất kỳ lớp nào khác truy cập.

### static

**Phương thức được đánh dấu bằng `static` được gọi là phương thức tĩnh.**

Phương thức tĩnh có những khác biệt sau so với phương thức thông thường:

- Khi gọi phương thức tĩnh từ bên ngoài, bạn có thể sử dụng cú pháp `TênLớp.TênPhươngThức` hoặc `TênĐốiTượng.TênPhươngThức`. Trong khi đó, phương thức thông thường chỉ có thể sử dụng cú pháp sau.
- **Phương thức tĩnh chỉ có thể truy cập các thành viên tĩnh** (biến thành viên tĩnh và phương thức tĩnh), không thể truy cập các thành viên của đối tượng. Trong khi đó, phương thức thông thường không có giới hạn này.

Phương thức tĩnh thường được sử dụng trong các lớp tiện ích, lớp phương thức tạo và các lớp khác.

### final

Phương thức được đánh dấu bằng `final` không thể bị ghi đè (override) bởi lớp con.

Ví dụ về phương thức final:

```java
public class FinalMethodDemo {
    static class Father {
        protected final void print() {
            System.out.println("call Father print()");
        };
    }

    static class Son extends Father {
        @Override
        protected void print() {
            System.out.println("call print()");
        }
    }

    public static void main(String[] args) {
        Father demo = new Son();
        demo.print();
    }
}
// Sẽ báo lỗi khi biên dịch
```

> Giải thích:
>
> Trong ví dụ trên, lớp cha Father định nghĩa một phương thức `final` `print()`, do đó lớp con không thể ghi đè phương thức final này, nếu không sẽ báo lỗi khi biên dịch.

### default

Từ JDK 8, chúng ta có thể định nghĩa phương thức `default` trong giao diện (interface). **Phương thức `default` chỉ có thể xuất hiện trong giao diện (interface).**

Phương thức `default` trong giao diện được gọi là phương thức mặc định. Nếu một lớp triển khai giao diện mà không ghi đè phương thức mặc định này, nó sẽ kế thừa phương thức này mà không cần phải cài đặt.

Ví dụ về phương thức `default`:

```java
public class DefaultMethodDemo {
    interface MyInterface {
        default void print() {
            System.out.println("Hello World");
        }
    }


    static class MyClass implements MyInterface {}

    public static void main(String[] args) {
        MyInterface obj = new MyClass();
        obj.print();
    }
}
// Output:
// Hello World
```

### abstract

**Phương thức được đánh dấu bằng `abstract` được gọi là phương thức trừu tượng, không có thân phương thức. Phương thức trừu tượng chỉ có thể xuất hiện trong lớp trừu tượng (abstract class).**

Ví dụ về phương thức trừu tượng:

```java
public class AbstractMethodDemo {
    static abstract class AbstractClass {
        abstract void print();
    }

    static class ConcreteClass extends AbstractClass {
        @Override
        void print() {
            System.out.println("call print()");
        }
    }

    public static void main(String[] args) {
        AbstractClass demo = new ConcreteClass();
        demo.print();
    }

}
// Output:
// call print()
```

### synchronized

`Synchronized` được sử dụng trong lập trình đa luồng. **Phương thức được đánh dấu bằng `synchronized` chỉ cho phép một luồng thực thi vào một thời điểm.**

Trong các collection đồng bộ của Java (Vector, Stack, HashTable), bạn sẽ thấy rất nhiều phương thức được đánh dấu bằng `synchronized`. Tuy nhiên, hãy nhớ rằng trong lập trình đa luồng Java, phương thức `synchronized` không phải lúc nào cũng là lựa chọn tốt, trong hầu hết các trường hợp, chúng ta sẽ chọn khóa nhẹ hơn.

## Phương thức đặc biệt

Trong Java, có một số phương thức đặc biệt được sử dụng trong các tình huống đặc biệt.

### Phương thức main

Phương thức main trong Java là một phương thức tĩnh đặc biệt, vì tất cả các chương trình Java đều bắt đầu thực thi từ phương thức `public static void main(String[] args)`.

Nhiều người mới học Java sử dụng phương thức main mà không biết đến ý nghĩa của tham số `args`. Thực tế, đây là để nhận các tham số đầu vào từ dòng lệnh.

Ví dụ:

```java
public class MainMethodDemo {
    public static void main(String[] args) {
        for (String arg : args) {
            System.out.println("arg = [" + arg + "]");
        }
    }
}
```

Chạy lần lượt các lệnh sau:

```java
javac MainMethodDemo.java
java MainMethodDemo A B C
```

Kết quả trên màn hình sẽ là:

```
arg = [A]
arg = [B]
arg = [C]
```

### Phương thức khởi tạo (Constructor)

Mọi lớp đều có phương thức khởi tạo (constructor), phương thức khởi tạo có tác dụng thiết lập trạng thái của đối tượng khi khởi tạo.

Mỗi lớp đều có phương thức khởi tạo. Nếu không định nghĩa bất kỳ phương thức khởi tạo nào cho lớp, trình biên dịch Java sẽ tự động tạo một phương thức khởi tạo mặc định cho lớp đó.

Khi tạo một đối tượng, ít nhất phải gọi một phương thức khởi tạo. Tên phương thức khởi tạo phải giống với tên của lớp, một lớp có thể có nhiều phương thức khởi tạo.

```java
public class ConstructorMethodDemo {

    static class Person {
        private String name;

        public Person(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    public static void main(String[] args) {
        Person person = new Person("jack");
        System.out.println("person name is " + person.getName());
    }
}
```

Lưu ý, phương thức khởi tạo có thể được đánh dấu là private, trong trường hợp này, lớp không thể sử dụng phương thức khởi tạo này để khởi tạo đối tượng, điều này thường được sử dụng trong mẫu thiết kế Singleton.

### Phương thức có tham số biến (Varargs)

Từ JDK5, Java hỗ trợ truyền một số lượng biến cùng loại vào một phương thức. Trong khai báo phương thức, sau kiểu tham số, ta thêm dấu ba chấm `…`. Một phương thức chỉ có thể có một tham số biến và nó phải là tham số cuối cùng của phương thức. Bất kỳ tham số thông thường nào phải được khai báo trước nó.

Ví dụ về phương thức có tham số biến:

```java
public class VarargsDemo {
    public static void method(String... params) {
        System.out.println("params.length = " + params.length);
        for (String param : params) {
            System.out.println("params = [" + param + "]");
        }
    }

    public static void main(String[] args) {
        method("red");
        method("red", "yellow");
        method("red", "yellow", "blue");
    }
}
```

### Phương thức finalize

`finalize` được gọi trước khi đối tượng bị thu hồi bởi bộ thu gom rác, nó được sử dụng để làm sạch đối tượng trước khi nó bị thu hồi.

`finalize` được định nghĩa trong `java.lang.Object`, điều này có nghĩa là mọi đối tượng đều có phương thức này. Phương thức này được gọi khi GC bắt đầu và đối tượng đó bị thu hồi.

Phương thức `finalize()` thường là không xác định và nguy hiểm, trong hầu hết các trường hợp, nó không cần thiết. Sử dụng phương thức finalize() có thể dẫn đến hành vi không ổn định, giảm hiệu suất và vấn đề về tính di động.

**Hãy nhớ: Hãy tránh sử dụng `finalize()`**. Đừng coi nó như là một phương thức hủy như trong C/C++. Lý do là: **Luồng finalize sẽ cạnh tranh với luồng chính của chúng ta, nhưng do ưu tiên thấp, nên nó không bao giờ theo kịp luồng chính. Vì vậy, cuối cùng có thể xảy ra ngoại lệ OutOfMemoryError.**

## Ghi đè và Nạp chồng

**Ghi đè (Override)** là khi một lớp con định nghĩa một phương thức có cùng tên với phương thức trong lớp cha, nhưng phải chú ý đến quyền truy cập, phương thức ghi đè trong lớp con không được có quyền truy cập nghiêm ngặt hơn phương thức trong lớp cha.

Nếu phương thức ghi đè muốn truy cập phương thức của lớp cha, ta có thể sử dụng từ khóa `super`.

Ví dụ về ghi đè:

```java
public class MethodOverrideDemo {
    static class Animal {
        public void move() {
            System.out.println("move");
        }
    }
    static class Dog extends Animal {
        @Override
        public void move() {
            super.move();
            System.out.println("run");
        }
    }

    public static void main(String[] args) {
        Animal dog = new Dog();
        dog.move();
    }
}
// Output:
// move
// run
```

**Nạp chồng (Overload)** là khi hai phương thức có cùng tên nhưng có số lượng tham số hoặc kiểu dữ liệu tham số khác nhau. Bằng cách truyền số lượng và kiểu dữ liệu tham số khác nhau, ta có thể thực hiện các cuộc gọi phương thức khác nhau.

> 🔔 Lưu ý:
>
> Nạp chồng phải có các tham số của phương thức không hoàn toàn giống nhau. Nếu các tham số của phương thức hoàn toàn giống nhau, chỉ khác nhau ở giá trị trả về, Java sẽ không biên dịch được.

Ví dụ về nạp chồng:

```java
public class MethodOverloadDemo {
    public static void add(int x, int y) {
        System.out.println("x + y = " + (x + y));
    }

    public static void add(double x, double y) {
        System.out.println("x + y = " + (x + y));
    }

    public static void main(String[] args) {
        add(10, 20);
        add(1.0, 2.0);
    }
}
// Output:
// x + y = 30
// x + y = 3.0
```

## Tổng kết

![Java%20Method.svg](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Java%20Method.svg)
