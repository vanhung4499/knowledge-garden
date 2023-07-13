---
categories: [java, javase]
title: Java Reflection
date created: 2023-07-03
date modified: 2023-07-13
tags: [java, javase]
---

# Hiểu sâu về Reflection và Dynamic Proxy trong Java

## Giới thiệu về Reflection

### Reflection là gì?

Reflection (Phản chiếu) là một trong những đặc điểm của ngôn ngữ lập trình Java, cho phép chương trình Java trong quá trình chạy có thể truy cập thông tin về chính nó và thao tác với các thuộc tính bên trong của lớp hoặc đối tượng.

**Thông qua cơ chế Reflection, chúng ta có thể truy cập vào các thuộc tính, phương thức, constructor của đối tượng Java trong quá trình chạy.**

### Các ứng dụng của Reflection

Reflection được sử dụng chủ yếu trong các trường hợp sau:

- **Phát triển các framework chung** - Reflection là ứng dụng quan trọng nhất của việc phát triển các framework chung. Nhiều framework (ví dụ như Spring) được cấu hình thông qua các tệp XML (ví dụ như cấu hình JavaBean, Filter, v.v.), để đảm bảo tính chung của framework, chúng có thể cần tải các đối tượng hoặc lớp khác nhau dựa trên tệp cấu hình, và gọi các phương thức khác nhau, lúc này cần sử dụng Reflection - tải đối tượng cần tải trong quá trình chạy.
- **Động lực hóa** - Trong lập trình hướng khía cạnh (AOP), cần chặn các phương thức cụ thể, thường chọn cách động lực hóa. Lúc này, cần sử dụng công nghệ Reflection để thực hiện.
- **Chú thích** - Chú thích chính nó chỉ đóng vai trò đánh dấu, nó cần sử dụng cơ chế Reflection để gọi trình thông dịch chú thích dựa trên đánh dấu chú thích, thực hiện hành vi. Nếu không có cơ chế Reflection, chú thích không hữu ích hơn chú thích.
- **Tính năng mở rộng** - Ứng dụng có thể sử dụng Reflection để tạo các phiên bản đối tượng có thể mở rộng bằng cách sử dụng tên đầy đủ của nó.

### Nhược điểm của Reflection

- **Tốn kém về hiệu năng** - Do Reflection liên quan đến việc phân tích động các loại, nên không thể thực hiện một số tối ưu hóa của máy ảo Java. Do đó, hiệu năng của các hoạt động Reflection thường kém hơn so với các hoạt động không sử dụng Reflection, nên nên tránh sử dụng trong các đoạn mã cần tần suất gọi trong các ứng dụng nhạy cảm về hiệu năng.
- **Phá vỡ tính đóng gói** - Khi gọi phương thức bằng Reflection, có thể bỏ qua kiểm tra quyền truy cập, do đó có thể phá vỡ tính đóng gói và gây ra vấn đề về bảo mật.
- **Tiết lộ thông tin nội bộ** - Do Reflection cho phép mã thực thi các hoạt động không hợp lệ trong mã không sử dụng Reflection, ví dụ như truy cập vào các trường và phương thức riêng tư, do đó việc sử dụng Reflection có thể gây ra các tác động phụ không mong muốn, dẫn đến lỗi chức năng và có thể phá vỡ tính di động của mã. Mã Reflection phá vỡ tính trừu tượng, do đó có thể thay đổi hành vi theo cách không mong muốn khi nâng cấp nền tảng.

## Cơ chế Reflection

### Quá trình tải lớp

![JavaClassLoad.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/JavaClassLoad.png)

Quá trình tải lớp hoàn chỉnh như sau:

1. Trong quá trình biên dịch, trình biên dịch Java biên dịch tệp `.java` thành tệp `.class`. Tệp `.class` là tệp nhị phân chứa mã máy chỉ JVM mới có thể nhận dạng.
2. Trình tải lớp trong JVM đọc tệp bytecode, trích xuất dữ liệu nhị phân và tải lên bộ nhớ, phân tích cú pháp và thông tin trong tệp `.class`. Trình tải lớp sẽ sử dụng tên đầy đủ của lớp để lấy luồng byte của lớp này; sau đó, nó sẽ chuyển đổi cấu trúc lưu trữ tĩnh này thành cấu trúc dữ liệu thời gian chạy của vùng nhớ phương thức.
3. Sau khi quá trình tải lớp kết thúc, JVM bắt đầu giai đoạn kết nối (bao gồm xác minh, chuẩn bị, khởi tạo). Sau một loạt các hoạt động này, biến của lớp sẽ được khởi tạo.

### Đối tượng Class

Để sử dụng Reflection, trước tiên cần có đối tượng Class tương ứng với lớp mà ta muốn thao tác. **Trong Java, dù có bao nhiêu đối tượng của một lớp được tạo ra, chúng đều tương ứng với cùng một đối tượng Class**. Đối tượng Class này được tạo ra bởi JVM và cho phép ta truy cập vào toàn bộ cấu trúc của lớp.

**Reflection thực chất là việc ánh xạ các thành phần của lớp Java thành các đối tượng Java.**

Ví dụ, nếu có đoạn mã sau:

```java
User user = new User();
```

Các bước thực hiện như sau:

1. Khi JVM tải lớp, nếu gặp `new User()` thì JVM sẽ tải lớp `User.class`.
2. JVM sẽ tìm kiếm tệp `User.class` trên đĩa và tải nó vào bộ nhớ JVM.
3. JVM sẽ tạo một đối tượng `java.lang.Class` proxy cho lớp `User` và lưu trữ nó trong vùng nhớ của JVM. Lưu ý rằng **một lớp chỉ có một đối tượng `Class` tương ứng**.

### Gọi phương thức bằng Reflection

Gọi phương thức bằng Reflection được thực hiện bằng cách sử dụng phương thức `Method.invoke`.

Mã nguồn của phương thức `Method.invoke`:

```java
public final class Method extends Executable {
  ...
  public Object invoke(Object obj, Object... args) throws ... {
    ... // Kiểm tra quyền truy cập
    MethodAccessor ma = methodAccessor;
    if (ma == null) {
      ma = acquireMethodAccessor();
    }
    return ma.invoke(obj, args);
  }
}
```

Phương thức `Method.invoke` thực tế sẽ gọi phương thức `invoke` của giao diện `MethodAccessor`. Nó có hai cài đặt cụ thể đã có:

- `NativeMethodAccessorImpl`: Sử dụng phương thức native để triển khai gọi phản chiếu.
- `DelegatingMethodAccessorImpl`: Sử dụng mô hình ủy quyền để triển khai gọi phản chiếu.

Mỗi đối tượng `Method` sẽ tạo ra một cài đặt ủy quyền (DelegatingMethodAccessorImpl) khi gọi phản chiếu lần đầu tiên. Cài đặt ủy quyền này sẽ ủy quyền cho một cài đặt cụ thể (NativeMethodAccessorImpl), nơi thực sự gọi phương thức. Cài đặt cụ thể này rất dễ hiểu. Khi chúng ta đã vào bên trong máy ảo Java, chúng ta đã có địa chỉ cụ thể của phương thức mà đối tượng `Method` đang chỉ đến. Lúc này, việc gọi phản chiếu chỉ đơn giản là chuẩn bị các tham số và gọi phương thức đích.

【Ví dụ】In ra thông tin gọi phương thức `Method.invoke`

```java

public class MethodDemo01 {

    public static void target(int i) {
        new Exception("#" + i).printStackTrace();
    }

    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("com.hnv99.javacore.reflect.MethodDemo01");
        Method method = clazz.getMethod("target", int.class);
        method.invoke(null, 0);
    }

}
// Output  
// java.lang.Exception: #0  
// at com.hnv99.javacore.reflect.MethodDemo01.target(MethodDemo01.java:8) 
// at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)  
// at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)  
// at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)  
// at java.lang.reflect.Method.invoke(Method.java:498)  
// at com.hnv99.javacore.reflect.MethodDemo01.main(MethodDemo01.java:14)
```

Đầu tiên, nó gọi `DelegatingMethodAccessorImpl` và sau đó gọi `NativeMethodAccessorImpl` và cuối cùng gọi phương thức thực tế.

Tại sao gọi `DelegatingMethodAccessorImpl` làm trung gian, thay vì gọi trực tiếp cài đặt native?

Thực tế, Java còn có một cài đặt tạo mã bytecode động (dynamic bytecode) khác, sử dụng chỉ thị invoke để gọi phương thức đích. So với cài đặt native, cài đặt tạo mã bytecode động chạy nhanh hơn gấp 20 lần. Điều này bởi vì cài đặt tạo mã bytecode động không cần thông qua quá trình chuyển đổi từ Java sang C++ rồi lại chuyển đổi từ C++ sang Java. Tuy nhiên, việc tạo bytecode rất tốn thời gian, chỉ cần gọi một lần thì cài đặt native lại nhanh hơn 3-4 lần.

Với mục tiêu làm việc hiệu quả, Java Virtual Machine (JVM) đã đặt một ngưỡng là 15 (có thể điều chỉnh bằng cách sử dụng -Dsun.reflect.inflationThreshold), khi số lần gọi phản chiếu vượt qua ngưỡng này, JVM sẽ bắt đầu tạo bytecode động và chuyển đổi đối tượng ủy quyền từ cài đặt native sang cài đặt bytecode động. Quá trình này được gọi là Inflation.

【Ví dụ】Chạy `java -verbose:class MethodDemo02`

```java
public class MethodDemo02 {

    public static void target(int i) {
        new Exception("#" + i).printStackTrace();
    }

    public static void main(String[] args) throws Exception {
        Class<?> klass = Class.forName("com.hnv99.javacore.reflect.MethodDemo02");
        Method method = klass.getMethod("target", int.class);
        for (int i = 0; i < 20; i++) {
            method.invoke(null, i);
        }
    }

}
```

Kết quả:

```java
// ...Bỏ qua
java.lang.Exception: #15
    at com.hnv99.javacore.reflect.MethodDemo02.target(MethodDemo02.java:8)
    at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
    at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    at java.lang.reflect.Method.invoke(Method.java:498)
    at com.hnv99.javacore.reflect.MethodDemo02.main(MethodDemo02.java:15)
java.lang.Exception: #16
    at com.hnv99.javacore.reflect.MethodDemo02.target(MethodDemo02.java:8)
    at sun.reflect.GeneratedMethodAccessor1.invoke(Unknown Source)
    at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    at java.lang.reflect.Method.invoke(Method.java:498)
    at com.hnv99.javacore.reflect.MethodDemo02.main(MethodDemo02.java:15)
// ...Bỏ qua
```

Có thể thấy, từ lần thứ 16 trở đi, chỉ sử dụng `DelegatingMethodAccessorImpl` và không sử dụng cài đặt cục bộ `NativeMethodAccessorImpl` nữa.

### Hiệu suất của việc gọi phản chiếu

Việc gọi phản chiếu của phương thức có thể gây ra một số hiệu suất kém, chủ yếu do ba nguyên nhân:

- Mảng Object gây ra bởi phương thức có tham số biến đổi
- Tự động đóng gói và mở gói các kiểu dữ liệu cơ bản
- Và quan trọng nhất là việc nội tuyến hóa phương thức

`Class.forName` sẽ gọi phương thức cục bộ, trong khi `Class.getMethod` sẽ duyệt qua các phương thức công khai của lớp đó. Nếu không tìm thấy, nó sẽ tiếp tục duyệt qua các phương thức công khai của lớp cha. Cả hai hoạt động này đều tốn thời gian.

> Lưu ý, các hoạt động tìm kiếm phương thức, ví dụ như `getMethod`, sẽ trả về một bản sao của kết quả tìm kiếm. Do đó, chúng ta nên tránh sử dụng `getMethods` hoặc `getDeclaredMethods` trả về một mảng `Method` trong mã nguồn quan trọng để giảm sự tiêu tốn không cần thiết của bộ nhớ heap. Trong thực tế, chúng ta thường lưu kết quả của `Class.forName` và `Class.getMethod` trong ứng dụng.

Dưới đây chỉ tập trung vào hiệu suất của việc gọi phản chiếu chính nó.

Đầu tiên, vì `Method.invoke` là một phương thức có tham số biến đổi, ở mức bytecode, tham số cuối cùng của nó sẽ là một mảng Object (các bạn có thể sử dụng `javap` để kiểm tra). Trình biên dịch Java sẽ tạo ra một mảng Object có độ dài bằng số lượng tham số được truyền vào và lưu trữ các tham số trong mảng này.

Thứ hai, vì mảng Object không thể lưu trữ các kiểu dữ liệu cơ bản, trình biên dịch Java sẽ tự động đóng gói các tham số kiểu dữ liệu cơ bản.

Cả hai thao tác này không chỉ gây ra hiệu suất kém mà còn có thể chiếm dụng bộ nhớ heap, làm tăng tần suất của việc thu gom rác (GC). (Nếu bạn quan tâm, bạn có thể thử sử dụng tham số máy ảo `-XX:+PrintGC`.)

Vậy làm thế nào để giảm bớt sự tiêu tốn này?

## Sử dụng Reflection

### Gói java.lang.reflect

Gói `java.lang.reflect` trong Java cung cấp các tính năng reflection. Các lớp trong gói `java.lang.reflect` không có phương thức khởi tạo công khai (`public`).

Các giao diện và lớp chính trong gói `java.lang.reflect` bao gồm:

- Giao diện `Member`: Phản ánh thông tin định danh về một thành viên đơn (trường hoặc phương thức) hoặc một hàm tạo.
- Lớp `Field`: Cung cấp thông tin về các trường của một lớp và cung cấp giao diện để truy cập vào các trường của lớp.
- Lớp `Method`: Cung cấp thông tin về các phương thức của một lớp và cung cấp giao diện để truy cập vào các phương thức của lớp.
- Lớp `Constructor`: Cung cấp thông tin về các hàm tạo của một lớp và cung cấp giao diện để truy cập vào các hàm tạo của lớp.
- Lớp `Array`: Cung cấp các phương thức để tạo và truy cập mảng Java động.
- Lớp `Modifier`: Cung cấp các phương thức tĩnh và hằng số để giải mã các quyền truy cập và sửa đổi của lớp và thành viên.
- Lớp `Proxy`: Cung cấp các phương thức tĩnh để tạo lớp proxy và các phiên bản lớp động.

### Lấy đối tượng Class

Có ba cách để lấy đối tượng `Class`:

(1) **Phương thức tĩnh `Class.forName`**

【Ví dụ】Sử dụng phương thức tĩnh `Class.forName` để lấy đối tượng `Class`

```java
package com.hnv99.javacore.reflect;

public class ReflectClassDemo01 {

    public static void main(String[] args) throws ClassNotFoundException {
        Class c1 = Class.forName("com.hnv99.javacore.reflect.ReflectClassDemo01");
        System.out.println(c1.getCanonicalName());

        Class c2 = Class.forName("[D");
        System.out.println(c2.getCanonicalName());

        Class c3 = Class.forName("[[Ljava.lang.String;");
        System.out.println(c3.getCanonicalName());
    }

}

//Output:
//com.hnv99.javacore.reflect.ReflectClassDemo01
//double[]
//java.lang.String[][]
```

Sử dụng tên đầy đủ của lớp để phản ánh lớp đối tượng. Ứng dụng phổ biến là: sử dụng phương thức này để tải trình điều khiển cơ sở dữ liệu trong phát triển JDBC.

(2) **Tên lớp + `.class`**

【Ví dụ】Sử dụng tên lớp + `.class` để lấy đối tượng `Class`

```java
package com.hnv99.javacore.reflect;

public class ReflectClassDemo02 {
    public static void main(String[] args) {
        boolean b;
        // Class c = b.getClass(); // Lỗi biên dịch
        Class c1 = boolean.class;
        System.out.println(c1.getCanonicalName());

        Class c2 = java.io.PrintStream.class;
        System.out.println(c2.getCanonicalName());

        Class c3 = int[][][].class;
        System.out.println(c3.getCanonicalName());
    }
}
//Output:
//boolean
//java.io.PrintStream
//int[][][]
```

(3) **Phương thức `getClass` của đối tượng `Object`**

Lớp `Object` có phương thức `getClass`, vì tất cả các lớp đều kế thừa từ lớp `Object`. Do đó, có thể sử dụng lớp `Object` để lấy đối tượng `Class`.

【Ví dụ】Sử dụng phương thức `getClass` của đối tượng `Object` để lấy đối tượng `Class`

```java
package com.hnv99.javacore.reflect;

import java.util.HashSet;
import java.util.Set;

public class ReflectClassDemo03 {
    enum E { A, B }

    public static void main(String[] args) {
        Class c = "foo".getClass();
        System.out.println(c.getCanonicalName());

        Class c2 = ReflectClassDemo03.E.A.getClass();
        System.out.println(c2.getCanonicalName());

        byte[] bytes = new byte[1024];
        Class c3 = bytes.getClass();
        System.out.println(c3.getCanonicalName());

        Set<String> set = new HashSet<>();
        Class c4 = set.getClass();
        System.out.println(c4.getCanonicalName());
    }
}
//Output:
//java.lang.String
//com.hnv99.javacore.reflect.ReflectClassDemo03.E
//byte[]
//java.util.HashSet
```

### Kiểm tra xem một đối tượng có phải là một thể hiện của một lớp nào đó không

Có hai cách để kiểm tra xem một đối tượng có phải là một thể hiện của một lớp nào đó không:

1. **Sử dụng từ khóa `instanceof`**
2. **Sử dụng phương thức `isInstance` của đối tượng `Class`** (đây là một phương thức Native)

【Ví dụ】

```java
public class InstanceofDemo {
    public static void main(String[] args) {
        ArrayList arrayList = new ArrayList();
        if (arrayList instanceof List) {
            System.out.println("ArrayList là List");
        }
        if (List.class.isInstance(arrayList)) {
            System.out.println("ArrayList là List");
        }
    }
}
//Output:
//ArrayList là List
//ArrayList là List
```

### Tạo thể hiện

Có hai cách chính để tạo thể hiện đối tượng bằng cách sử dụng reflection:

- Sử dụng phương thức `newInstance` của đối tượng `Class`.
- Sử dụng phương thức `newInstance` của đối tượng `Constructor`.

【Ví dụ】

```java
public class NewInstanceDemo {
    public static void main(String[] args)
        throws IllegalAccessException, InstantiationException, NoSuchMethodException, InvocationTargetException {
        Class<?> c1 = StringBuilder.class;
        StringBuilder sb = (StringBuilder) c1.newInstance();
        sb.append("aaa");
        System.out.println(sb.toString());

        // Lấy đối tượng Class tương ứng với String
        Class<?> c2 = String.class;
        // Lấy constructor của String với một tham số kiểu String
        Constructor constructor = c2.getConstructor(String.class);
        // Tạo thể hiện đối tượng dựa trên constructor
        String str2 = (String) constructor.newInstance("bbb");
        System.out.println(str2);
    }
}
//Output:
//aaa
//bbb
```

### Tạo thể hiện mảng

Mảng là một kiểu đặc biệt của kiểu trong Java và nó có thể được gán cho một tham chiếu đối tượng. Trong Java, **sử dụng `Array.newInstance` để tạo thể hiện mảng**.

【Ví dụ】Sử dụng reflection để tạo mảng

```java
public class ReflectArrayDemo {
    public static void main(String[] args) throws ClassNotFoundException {
        Class<?> cls = Class.forName("java.lang.String");
        Object array = Array.newInstance(cls, 25);
        // Thêm nội dung vào mảng
        Array.set(array, 0, "Scala");
        Array.set(array, 1, "Java");
        Array.set(array, 2, "Groovy");
        Array.set(array, 3, "Scala");
        Array.set(array, 4, "Clojure");
        // Lấy nội dung của một phần tử
        System.out.println(Array.get(array, 3));
    }
}
//Output:
//Scala
```

Trong đó, lớp Array là lớp `java.lang.reflect.Array`. Nguyên mẫu của `Array.newInstance` là:

```java
public static Object newInstance(Class<?> componentType, int length)
    throws NegativeArraySizeException {
    return newArray(componentType, length);
}
```

### Field

Đối tượng `Class` cung cấp các phương thức sau để lấy thành viên (Field) của đối tượng:

- `getFiled` - Lấy thành viên công khai (public) của lớp dựa trên tên.
- `getDeclaredField` - Lấy thành viên đã khai báo của lớp dựa trên tên. Tuy nhiên, không thể lấy được thành viên của lớp cha.
- `getFields` - Lấy tất cả các thành viên công khai (public) của lớp.
- `getDeclaredFields` - Lấy tất cả các thành viên đã khai báo của lớp.

Ví dụ:

```java
public class ReflectFieldDemo {
    class FieldSpy<T> {
        public boolean[][] b = { {false, false}, {true, true} };
        public String name = "Alice";
        public List<Integer> list;
        public T val;
    }

    public static void main(String[] args) throws NoSuchFieldException {
        Field f1 = FieldSpy.class.getField("b");
        System.out.format("Type: %s%n", f1.getType());

        Field f2 = FieldSpy.class.getField("name");
        System.out.format("Type: %s%n", f2.getType());

        Field f3 = FieldSpy.class.getField("list");
        System.out.format("Type: %s%n", f3.getType());

        Field f4 = FieldSpy.class.getField("val");
        System.out.format("Type: %s%n", f4.getType());
    }
}
//Output:
//Type: class [[Z
//Type: class java.lang.String
//Type: interface java.util.List
//Type: class java.lang.Object
```

### Method

Lớp `Class` cung cấp các phương thức sau để lấy các phương thức (method) của đối tượng:

- `getMethod` - Trả về phương thức cụ thể của lớp hoặc giao diện. Tham số đầu tiên là tên phương thức, các tham số sau là các đối tượng Class tương ứng với các tham số của phương thức.
- `getDeclaredMethod` - Trả về phương thức khai báo cụ thể của lớp hoặc giao diện. Tham số đầu tiên là tên phương thức, các tham số sau là các đối tượng Class tương ứng với các tham số của phương thức.
- `getMethods` - Trả về tất cả các phương thức public của lớp hoặc giao diện, bao gồm cả các phương thức public của lớp cha.
- `getDeclaredMethods` - Trả về tất cả các phương thức đã khai báo của lớp hoặc giao diện, bao gồm các phương thức public, protected, default và private, nhưng không bao gồm các phương thức được kế thừa.

Sau khi có một đối tượng `Method`, có thể sử dụng phương thức `invoke` để gọi phương thức đó.

Nguyên mẫu của phương thức `invoke` là:

```java
public Object invoke(Object obj, Object... args)
        throws IllegalAccessException, IllegalArgumentException,
           InvocationTargetException
```

【Ví dụ】

```java
public class ReflectMethodDemo {
    public static void main(String[] args)
        throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {

        // Lấy tất cả các phương thức
        Method[] methods1 = System.class.getDeclaredMethods();
        System.out.println("Danh sách các phương thức của System (số lượng = " + methods1.length + "):");
        for (Method m : methods1) {
            System.out.println(m);
        }

        // Lấy tất cả các phương thức public
        Method[] methods2 = System.class.getMethods();
        System.out.println("Danh sách các phương thức public của System (số lượng = " + methods2.length + "):");
        for (Method m : methods2) {
            System.out.println(m);
        }

        // Sử dụng phương thức invoke của Method để gọi System.currentTimeMillis()
        Method method = System.class.getMethod("currentTimeMillis");
        System.out.println(method);
        System.out.println(method.invoke(null));
    }
}
```

### Constructor

Lớp `Class` cung cấp các phương thức sau để lấy các constructor (hàm tạo) của đối tượng:

- `getConstructor` - Trả về constructor public cụ thể của lớp. Tham số là các đối tượng Class tương ứng với các tham số của constructor.
- `getDeclaredConstructor` - Trả về constructor cụ thể của lớp. Tham số là các đối tượng Class tương ứng với các tham số của constructor.
- `getConstructors` - Trả về tất cả các constructor public của lớp.
- `getDeclaredConstructors` - Trả về tất cả các constructor của lớp.

Sau khi có một đối tượng `Constructor`, có thể sử dụng phương thức `newInstance` để tạo một thể hiện của lớp.

【Ví dụ】

```java
public class ReflectMethodConstructorDemo {
    public static void main(String[] args)
        throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {
        Constructor<?>[] constructors1 = String.class.getDeclaredConstructors();
        System.out.println("Danh sách các constructor của String (số lượng = " + constructors1.length + "):");
        for (Constructor c : constructors1) {
            System.out.println(c);
        }

        Constructor<?>[] constructors2 = String.class.getConstructors();
        System.out.println("Danh sách các constructor public của String (số lượng = " + constructors2.length + "):");
        for (Constructor c : constructors2) {
            System.out.println(c);
        }

        System.out.println("====================");
        Constructor constructor = String.class.getConstructor(String.class);
        System.out.println(constructor);
        String str = (String) constructor.newInstance("bbb");
        System.out.println(str);
    }
}
```

### Vượt qua giới hạn truy cập

Đôi khi, chúng ta cần truy cập vào các thành viên, phương thức riêng tư (private). Có thể sử dụng `Constructor/Field/Method.setAccessible(true)` để vượt qua giới hạn truy cập trong Java.

## Dynamic Proxy

Dynamic Proxy là một cơ chế tiện lợi để xây dựng proxy và xử lý động các cuộc gọi phương thức của proxy trong thời gian chạy. Nhiều tình huống trong lập trình sử dụng cơ chế tương tự, chẳng hạn như đóng gói các lệnh gọi RPC, lập trình hướng khía cạnh (AOP).

Có nhiều cách để thực hiện dynamic proxy, ví dụ như dynamic proxy được cung cấp bởi JDK sử dụng cơ chế phản chiếu đã được đề cập ở trên. Có các phương pháp triển khai khác, chẳng hạn như sử dụng cơ chế hoạt động mã byte hiệu suất cao như ASM, cglib (dựa trên ASM), Javassist, v.v.

### Static Proxy

> Static Proxy thực chất là mô hình proxy trong design pattern.

**Mô hình proxy cung cấp một proxy cho các đối tượng khác để kiểm soát việc truy cập vào đối tượng đó.**

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/3101171-6269723ea61527bd.png)

**Subject** xác định giao diện chung của RealSubject và Proxy, điều này cho phép Proxy được sử dụng ở bất kỳ đâu mà RealSubject được sử dụng.

```java
abstract class Subject {
    public abstract void Request();
}
```

**RealSubject** xác định thực thể thực sự mà Proxy proxy.

```java
class RealSubject extends Subject {
    @Override
    public void Request() {
        System.out.println("Yêu cầu thực sự");
    }
}
```

**Proxy** lưu trữ một tham chiếu cho phép Proxy truy cập vào thực thể và cung cấp một giao diện giống như giao diện của Subject, điều này cho phép Proxy thay thế thực thể.

```java
class Proxy extends Subject {
    private RealSubject real;

    @Override
    public void Request() {
        if (null == real) {
            real = new RealSubject();
        }
        real.Request();
    }
}
```

> Giải thích:
>
> Mặc dù mô hình static proxy có nhiều ưu điểm trong việc truy cập vào tài nguyên không thể truy cập và tăng cường chức năng kinh doanh của giao diện hiện có, nhưng việc sử static proxy một cách lớn sẽ làm tăng kích thước của lớp trong hệ thống và khó bảo trì; và vì chức năng của Proxy và RealSubject cơ bản là giống nhau, Proxy chỉ đóng vai trò là một trung gian, sự tồn tại của proxy này trong hệ thống dẫn đến cấu trúc hệ thống trở nên phình to và lỏng lẻo.

### Dynamic Proxy JDK

Để giải quyết vấn đề của static proxy, đã có ý tưởng tạo ra một dynamic proxy:

Trong trạng thái chạy, nơi cần proxy, dựa trên Subject và RealSubject, tạo động một Proxy, sau khi sử dụng xong, nó sẽ bị hủy, điều này giúp tránh vấn đề dư thừa các lớp Proxy trong hệ thống.

![JavaDynamicProxyJDK.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/JavaDynamicProxyJDK.png)

Java dynamic proxy dựa trên mô hình proxy cổ điển, giới thiệu một `InvocationHandler`, `InvocationHandler` chịu trách nhiệm quản lý tất cả cuộc gọi phương thức của Proxy.

Các bước dynamic proxy:

1. Lấy danh sách giao diện trên RealSubject;
2. Xác định tên lớp của lớp Proxy được tạo ra, mặc định là: `com.sun.proxy.$ProxyXXXX`;
3. Dựa trên thông tin giao diện cần triển khai, tạo mã byte của lớp Proxy trong mã nguồn;
4. Chuyển đổi mã byte tương ứng thành đối tượng lớp;
5. Tạo một đối tượng handler của `InvocationHandler` để xử lý tất cả cuộc gọi phương thức của Proxy;
6. Sử dụng đối tượng class của Proxy để khởi tạo một đối tượng proxy, sử dụng đối tượng handler đã tạo.

Nhìn vào trên, chúng ta có thể thấy rằng, cách triển khai dynamic proxy JDK dựa trên việc triển khai giao diện, làm cho Proxy và RealSubject có cùng chức năng.

Tuy nhiên, thực tế còn một cách suy nghĩ khác: thông qua kế thừa. Nghĩa là: cho phép Proxy kế thừa RealSubject, điều này làm cho cả hai đều có chức năng giống nhau, Proxy còn có thể triển khai đa hình bằng cách ghi đè các phương thức trong RealSubject. CGLIB được thiết kế dựa trên cách suy nghĩ này.

Trong cơ chế dynamic proxy của Java, có hai lớp (giao diện) quan trọng, một là giao diện `InvocationHandler`, một là lớp `Proxy`, lớp này và một giao diện là những gì chúng ta cần để triển khai dynamic proxy.

#### Giao diện InvocationHandler

Giao diện InvocationHandler được định nghĩa như sau:

```java
public interface InvocationHandler {
    public Object invoke(Object proxy, Method method, Object[] args)
        throws Throwable;
}
```

Mỗi lớp dynamic proxy cần phải triển khai giao diện InvocationHandler này và mỗi đối tượng proxy được liên kết với một Handler. Khi chúng ta gọi một phương thức thông qua đối tượng proxy, cuộc gọi phương thức sẽ được chuyển tiếp cho phương thức invoke của giao diện InvocationHandler.

Chúng ta hãy xem xét phương thức invoke trong giao diện `InvocationHandler`:

```java
Object invoke(Object proxy, Method method, Object[] args) throws Throwable
```

Giải thích các tham số:

- **proxy** - Đối tượng thực sự của proxy.
- **method** - Đối tượng Method của phương thức cần gọi trên đối tượng thực sự.
- **args** - Các tham số được truyền cho phương thức cần gọi trên đối tượng thực sự.

Nếu bạn chưa hiểu rõ, chúng ta sẽ đi vào chi tiết các tham số này thông qua một ví dụ cụ thể.

#### Lớp Proxy

Lớp Proxy được sử dụng để tạo đối tượng dynamic proxy. Nó cung cấp nhiều phương thức, nhưng phương thức chúng ta sử dụng nhiều nhất là phương thức `newProxyInstance`:

```java
public static Object newProxyInstance(ClassLoader loader, Class<?>[] interfaces,  InvocationHandler h)  throws IllegalArgumentException
```

Phương thức này được sử dụng để tạo một đối tượng dynamic proxy.

Giải thích các tham số:

- **loader** - Một đối tượng ClassLoader, xác định lớp nào sẽ tải đối tượng proxy được tạo ra.
- **interfaces** - Một mảng đối tượng `Class<?>`, proxy cho một tập hợp các giao diện mà đối tượng proxy sẽ triển khai. Nếu chúng ta cung cấp một tập hợp giao diện, đối tượng proxy sẽ được coi là triển khai các giao diện này (đa hình), cho phép chúng ta gọi các phương thức trong tập hợp giao diện này.
- **h** - Một đối tượng InvocationHandler, proxy cho đối tượng Handler mà đối tượng proxy sẽ liên kết với.

#### Ví dụ về dynamic proxy JDK

Sau khi đã giới thiệu hai giao diện (lớp) trên, chúng ta sẽ xem xét một ví dụ để hiểu rõ hơn về mô hình dynamic proxy của chúng ta:

Đầu tiên, chúng ta định nghĩa một giao diện Subject, và khai báo hai phương thức cho nó:

```java
public interface Subject {

    void hello(String str);

    String bye();
}
```

Tiếp theo, chúng ta định nghĩa một lớp để triển khai giao diện này, đây là đối tượng thực sự của chúng ta, lớp RealSubject:

```java
public class RealSubject implements Subject {

    @Override
    public void hello(String str) {
        System.out.println("Hello  " + str);
    }

    @Override
    public String bye() {
        System.out.println("Goodbye");
        return "Over";
    }
}
```

Tiếp theo, chúng ta sẽ định nghĩa một lớp dynamic proxy, như đã đề cập trước đó, mỗi lớp dynamic proxy đều phải triển khai giao diện InvocationHandler, vì vậy lớp dynamic proxy của chúng ta cũng không ngoại lệ:

```java
public class InvocationHandlerDemo implements InvocationHandler {
    // Đây là đối tượng thực sự mà chúng ta muốn proxy
    private Object subject;

    // Phương thức khởi tạo, gán giá trị ban đầu cho đối tượng thực sự mà chúng ta muốn proxy
    public InvocationHandlerDemo(Object subject) {
        this.subject = subject;
    }

    @Override
    public Object invoke(Object object, Method method, Object[] args)
        throws Throwable {
        // Trước khi proxy đối tượng thực sự, chúng ta có thể thêm một số hoạt động của riêng mình
        System.out.println("Before method");

        System.out.println("Call Method: " + method);

        // Khi đối tượng proxy gọi phương thức của đối tượng thực sự, nó sẽ tự động chuyển hướng đến phương thức invoke của đối tượng Handler liên kết với nó
        Object obj = method.invoke(subject, args);

        // Sau khi proxy đối tượng thực sự, chúng ta cũng có thể thêm một số hoạt động của riêng mình
        System.out.println("After method");
        System.out.println();

        return obj;
    }
}
```

Cuối cùng, hãy xem xét lớp Client của chúng ta:

```java
public class Client {
    public static void main(String[] args) {
        // Đối tượng thực sự mà chúng ta muốn proxy
        Subject realSubject = new RealSubject();

        // Chúng ta muốn proxy đối tượng nào, chúng ta sẽ chuyển đối tượng đó vào, cuối cùng là thông qua đối tượng thực sự này để gọi phương thức của nó
        InvocationHandler handler = new InvocationHandlerDemo(realSubject);

        /*
         * Sử dụng phương thức newProxyInstance của Proxy để tạo đối tượng dynamic proxy của chúng ta, hãy xem xét ba tham số của nó
         * Tham số đầu tiên handler.getClass().getClassLoader(), ở đây chúng ta sử dụng ClassLoader của lớp handler để tải đối tượng proxy của chúng ta
         * Tham số thứ hai realSubject.getClass().getInterfaces(), ở đây chúng ta cung cấp một tập hợp các giao diện mà đối tượng proxy sẽ triển khai, proxy rằng đối tượng proxy của chúng ta triển khai các giao diện này, cho phép chúng ta gọi các phương thức trong tập hợp giao diện này
         * Tham số thứ ba handler, ở đây chúng ta liên kết đối tượng proxy này với đối tượng Handler trên
         */
        Subject subject = (Subject)Proxy.newProxyInstance(handler.getClass().getClassLoader(), realSubject
                .getClass().getInterfaces(), handler);

        System.out.println(subject.getClass().getName());
        subject.hello("World");
        String result = subject.bye();
        System.out.println("Result is: " + result);
    }
}
```

Trước tiên, hãy xem xét đầu ra của bảng điều khiển:

```
com.sun.proxy.$Proxy0
Before method
Call Method: public abstract void com.hnv99.javacore.reflect.InvocationHandlerDemo$Subject.hello(java.lang.String)
Hello  World
After method

Before method
Call Method: public abstract java.lang.String com.hnv99.javacore.reflect.InvocationHandlerDemo$Subject.bye()
Goodbye
After method

Result is: Over
```

Trước tiên, chúng ta hãy xem xét phần "com.sun.proxy.$Proxy0", chúng ta thấy rằng điều này được in ra bởi câu lệnh `System.out.println(subject.getClass().getName());`, vậy tại sao tên lớp proxy trả về lại như vậy?

```java
Subject subject = (Subject)Proxy.newProxyInstance(handler.getClass().getClassLoader(), realSubject
                .getClass().getInterfaces(), handler);
```

Có thể tôi nghĩ rằng đối tượng proxy trả về sẽ là một đối tượng kiểu Subject hoặc là một đối tượng kiểu InvocationHandler, nhưng kết quả lại không phải như vậy. Đầu tiên, chúng ta hãy giải thích **tại sao chúng ta có thể chuyển đổi nó thành một đối tượng kiểu Subject?**

Lý do là: trên tham số thứ hai của phương thức newProxyInstance này, chúng ta cung cấp một tập hợp các giao diện, vì vậy đối tượng proxy sẽ triển khai các giao diện này, trong trường hợp này là Subject, vì vậy chúng ta có thể chuyển đổi nó thành kiểu Subject.

**Đồng thời, chúng ta nhớ rằng đối tượng proxy được tạo ra bằng cách sử dụng `Proxy.newProxyInstance` là một đối tượng động được tạo ra trong quá trình chạy của JVM, nó không phải là một đối tượng kiểu InvocationHandler hoặc là một đối tượng kiểu giao diện mà chúng ta đã định nghĩa, mà là một đối tượng được tạo ra trong quá trình chạy và được đặt tên theo cách này, bắt đầu bằng \$, proxy là trung gian và số cuối cùng proxy cho số thứ tự của đối tượng**.

Tiếp theo, chúng ta hãy xem xét hai câu lệnh sau:

```java
subject.hello("World");
String result = subject.bye();
```

Ở đây, chúng ta gọi phương thức của đối tượng thực sự thông qua đối tượng proxy, lúc này chương trình sẽ chuyển hướng đến phương thức invoke của đối tượng Handler liên kết với nó để thực hiện, và đối tượng Handler của chúng ta nhận một tham số kiểu RealSubject, proxy cho đối tượng thực sự mà chúng ta muốn, vì vậy lúc này phương thức invoke sẽ được gọi.

Chúng ta thấy rằng khi gọi phương thức thực sự của đối tượng thông qua đối tượng proxy, chúng ta có thể thêm một số hoạt động của riêng mình trước và sau phương thức đó, đồng thời chúng ta cũng thấy rằng đối tượng method trong phương thức invoke của chúng ta có dạng như sau:

```java
public abstract void com.hnv99.javacore.reflect.InvocationHandlerDemo$Subject.hello(java.lang.String)
public abstract java.lang.String com.hnv99.javacore.reflect.InvocationHandlerDemo$Subject.bye()
```

Chính xác là các phương thức trong giao diện Subject của chúng ta, điều này cũng chứng minh rằng khi chúng ta gọi phương thức thông qua đối tượng proxy, thực tế là chúng ta đang gọi thông qua các proxy, không phải tự gọi.

#### Tổng kết về Dynamic Proxy JDK

Lớp proxy và lớp ủy nhiệm cùng triển khai cùng một giao diện, chủ yếu là thông qua lớp proxy triển khai `InvocationHandler` và ghi đè phương thức `invoke` để triển khai dynamic proxy và phương thức `invoke` được xử lý trong phương thức.

Đặc điểm của dynamic proxy JDK:

- Ưu điểm: So với mô hình static proxy, không cần mã hóa cứng giao diện, tỷ lệ tái sử dụng mã cao.
- Nhược điểm: Yêu cầu lớp proxy triển khai giao diện `InvocationHandler`.

### Dynamic Proxy CGLIB

CGLIB cung cấp một giải pháp khác so với dynamic proxy JDK. Nhiều framework, ví dụ như Spring AOP, sử dụng dynamic proxy CGLIB.

CGLIB hoạt động dựa trên ASM, một framework mã bytecode Java mạnh mẽ để thực hiện tăng cường mã bytecode.

Các bước làm việc của dynamic proxy CGLIB:

- Tạo tệp bytecode nhị phân cho lớp proxy;
- Tải bytecode nhị phân và tạo đối tượng `Class` (ví dụ: sử dụng phương thức `Class.forName()`);
- Sử dụng cơ chế phản chiếu để lấy hàm tạo và tạo đối tượng lớp proxy.

Đặc điểm của dynamic proxy CGLIB:

Ưu điểm: Sử dụng tăng cường mã bytecode, hiệu năng cao hơn so với cách dynamic proxy JDK. Có thể tăng cường lớp hoặc giao diện trong thời gian chạy, và lớp ủy nhiệm không cần triển khai giao diện.

Nhược điểm: Không thể proxy cho lớp `final` hoặc phương thức `final`.
