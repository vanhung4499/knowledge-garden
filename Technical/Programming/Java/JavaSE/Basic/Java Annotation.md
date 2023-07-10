---
categories: [java]
title: Java Annotation
date created: 2023-07-03
date modified: 2023-07-10
tags: [java]
---

## Khái niệm cơ bản về chú thích (Annotation)

Chú thích (Annotation) là một tính năng được giới thiệu từ phiên bản JDK 1.5, được sử dụng để giải thích mã nguồn, có thể áp dụng cho gói, lớp, giao diện, trường, tham số phương thức, biến cục bộ và nhiều thứ khác. Nó là một trong những khái niệm cơ bản mà các nhà phát triển và thiết kế framework cần phải nắm vững.

Chú thích có các vai trò chính sau đây:

- Tạo tài liệu: Tạo tài liệu `javadoc` từ các `metadata` được đánh dấu trong mã nguồn.
- Kiểm tra biên dịch: Cho phép kiểm tra và xác nhận các `metadata` trong quá trình biên dịch.
- Xử lý tại thời điểm biên dịch: Xử lý động dựa trên các `metadata` trong quá trình biên dịch, ví dụ như tạo mã nguồn động.
- Xử lý tại thời điểm chạy: Xử lý động dựa trên các `metadata` trong quá trình chạy, ví dụ như sử dụng phản chiếu để chèn đối tượng.

Chúng ta có thể phân loại chú thích theo các loại sau:

- **Chú thích tiêu chuẩn được tích hợp sẵn trong Java (built-in annotation)**, bao gồm `@Override`, `@Deprecated` và `@SuppressWarnings`. Chúng được sử dụng để đánh dấu việc ghi đè phương thức, đánh dấu mã đã bị loại bỏ và đánh dấu để bỏ qua các cảnh báo trong quá trình biên dịch.
- **Chú thích Meta (meta-annotation)**: Đây là các chú thích được sử dụng để định nghĩa các chú thích tùy chỉnh. Ví dụ: `@Retention`, `@Target`, `@Inherited`, `@Documented`. Chúng được sử dụng để định nghĩa các chú thích tùy chỉnh.
- **Chú thích tùy chỉnh (customize annotation)**: Chúng ta có thể định nghĩa các chú thích tùy chỉnh dựa trên nhu cầu của mình và có thể sử dụng các chú thích meta để chú thích chúng.

Tiếp theo, chúng ta sẽ hiểu chú thích từ góc nhìn phân loại này.

### Built-in Annotation trong Java

Bắt đầu bằng những Built-in Annotation phổ biến nhất trong Java, hãy xem đoạn mã sau:

```java
class A{  
    public void test() {

    }
}

class B extends A{

    /**
        * Ghi đè phương thức test của lớp cha
        */
    @Override
    public void test() {
    }

    /**
        * Phương thức đã bị loại bỏ
        */
    @Deprecated
    public void oldMethod() {
    }

    /**
        * Bỏ qua cảnh báo
        * 
        * @return
        */
    @SuppressWarnings("rawtypes")
    public List processList() {
        List list = new ArrayList();
        return list;
    }
}  
```

Java từ phiên bản 1.5 đã tích hợp sẵn các chú thích tiêu chuẩn, bao gồm `@Override`, `@Deprecated` và `@SuppressWarnings`:

- `@Override`: Được sử dụng để chỉ ra rằng phương thức hiện tại đang ghi đè phương thức cùng tên trong lớp cha.
- `@Deprecated`: Được sử dụng để đánh dấu mã đã bị loại bỏ, nếu sử dụng mã được đánh dấu `@Deprecated`, trình biên dịch sẽ cảnh báo.
- `@SuppressWarnings`: Được sử dụng để tắt cảnh báo từ trình biên dịch.

Chúng ta hãy xem xét cụ thể các Built-in Annotation này và thông qua định nghĩa của các chú thích meta trong chúng để giới thiệu về chú thích meta.

#### Built-in Annotation - @Override

Đầu tiên, chúng ta hãy xem định nghĩa của chú thích này:

```java
@Target(ElementType.METHOD)  
@Retention(RetentionPolicy.SOURCE)  
public @interface Override {  
}  
```

Từ định nghĩa này, chúng ta có thể thấy rằng chú thích này có thể được sử dụng để chú thích phương thức và chỉ có hiệu lực trong quá trình biên dịch, không tồn tại trong tệp class sau khi biên dịch. Chú thích này được sử dụng để thông báo cho trình biên dịch rằng phương thức được chú thích là ghi đè phương thức cùng tên trong lớp cha, trình biên dịch sẽ kiểm tra điều này và báo lỗi nếu không tìm thấy phương thức trong lớp cha hoặc phương thức có chữ ký khác.

#### Built-in Annotation - @Deprecated

Định nghĩa của chú thích này như sau:

```java  
@Documented  
@Retention(RetentionPolicy.RUNTIME)  
@Target(value={CONSTRUCTOR, FIELD, LOCAL_VARIABLE, METHOD, PACKAGE, PARAMETER, TYPE})  
public @interface Deprecated {  
}  
```

Từ định nghĩa này, chúng ta có thể thấy rằng chú thích này sẽ được tạo tài liệu, tồn tại trong quá trình chạy và có thể được sử dụng để chú thích cho các phần tử như constructor, trường, biến cục bộ, phương thức, gói, tham số, kiểu. Chú thích này được sử dụng để thông báo rằng các phần tử được chú thích đã bị "loại bỏ" và không được khuyến nghị sử dụng nữa.

#### Built-in Annotation - @SuppressWarnings

Chú thích này cũng khá phổ biến, hãy xem định nghĩa của nó:

```java
@Target({TYPE, FIELD, METHOD, PARAMETER, CONSTRUCTOR, LOCAL_VARIABLE})  
@Retention(RetentionPolicy.SOURCE)  
public @interface SuppressWarnings {  
    String[] value();  
}
```  

Nó có thể được áp dụng cho các yếu tố chương trình bao gồm kiểu, thuộc tính, phương thức, tham số, hàm tạo, biến cục bộ và chỉ tồn tại trong mã nguồn, giá trị của nó là một mảng `String[]`. Chú thích này được sử dụng để thông báo cho trình biên dịch để bỏ qua các cảnh báo cụ thể, giá trị của chú thích là các chuỗi chỉ định các cảnh báo cần bị bỏ qua. Các giá trị mà nó có thể nhận được như sau:

Tham số|Tác dụng|Mô tả gốc
---|---|---
all|Ẩn tất cả các cảnh báo|to suppress all warnings
boxing|Ẩn cảnh báo liên quan đến các hoạt động đóng gói/mở gói|to suppress warnings relative to boxing/unboxing operations
cast|Ẩn cảnh báo liên quan đến các hoạt động ép kiểu|to suppress warnings relative to cast operations
dep-ann|Ẩn cảnh báo liên quan đến chú thích đã bị loại bỏ|to suppress warnings relative to deprecated annotation
deprecation|Ẩn cảnh báo liên quan đến các phương thức đã bị lỗi thời|to suppress warnings relative to deprecation
fallthrough|Ẩn cảnh báo liên quan đến việc thiếu break trong câu lệnh switch|to suppress warnings relative to missing breaks in switch statements
finally|Ẩn cảnh báo liên quan đến khối finally không trả về|to suppress warnings relative to finally block that don’t return
hiding|Ẩn cảnh báo liên quan đến các biến cục bộ che giấu biến|to suppress warnings relative to locals that hide variable（）
incomplete-switch|Bỏ qua cảnh báo liên quan đến việc thiếu các mục trong câu lệnh switch (trường hợp enum)|to suppress warnings relative to missing entries in a switch statement (enum case)
nls|Bỏ qua các chuỗi không phải là chuỗi nls|to suppress warnings relative to non-nls string literals
null|Bỏ qua các hoạt động liên quan đến null|to suppress warnings relative to null analysis
rawtype|Bỏ qua các cảnh báo liên quan đến việc sử dụng generics mà không chỉ định kiểu tương ứng|to suppress warnings relative to un-specific types when using
restriction|Ẩn cảnh báo liên quan đến việc sử dụng các tham chiếu không được khuyến nghị hoặc bị cấm|to suppress warnings relative to usage of discouraged or
serial|Bỏ qua cảnh báo liên quan đến việc thiếu trường serialVersionUID trong lớp có thể tuần tự hóa|to suppress warnings relative to missing serialVersionUID field for a serializable class
static-access|Ẩn cảnh báo liên quan đến việc truy cập tĩnh không chính xác|to suppress warnings relative to incorrect static access
synthetic-access|Ẩn cảnh báo liên quan đến việc truy cập không tối ưu từ các lớp nội|to suppress warnings relative to unoptimized access from inner classes
unchecked|Ẩn cảnh báo liên quan đến các hoạt động không kiểm tra kiểu|to suppress warnings relative to unchecked operations
unqualified-field-access|Ẩn cảnh báo liên quan đến việc truy cập trường không có quyền truy cập|to suppress warnings relative to field access unqualified
unused|Ẩn cảnh báo liên quan đến mã không được sử dụng|to suppress warnings relative to unused code

### Meta-Annotation

Trong JDK 1.5, có 4 meta-annotation chuẩn được cung cấp: `@Target`, `@Retention`, `@Documented`, `@Inherited`. Trong JDK 1.8, có 2 meta-annotation mới: `@Repeatable` và `@Native`.

#### Meta Annotation - @Target

> `@Target` được sử dụng để mô tả phạm vi sử dụng của annotation (tức là nơi mà annotation có thể được sử dụng).

`@Target` được sử dụng để chỉ ra các đối tượng mà annotation có thể được áp dụng: packages (gói), types (lớp, giao diện, enum, annotation class), class members (phương thức, constructor, biến thành viên, giá trị enum), method parameters (tham số của phương thức) và local variables (biến cục bộ, ví dụ như biến trong vòng lặp hoặc biến trong khối catch). Khi định nghĩa một annotation class và sử dụng `@Target`, ta có thể biết rõ được annotation đó có thể được sử dụng để chú thích những đối tượng nào. Các giá trị của `@Target` được định nghĩa trong `enum ElementType`.

```java
public enum ElementType {
	TYPE, // Kiểu (class, interface, enum)
	
	FIELD, // Trường thành viên (bao gồm cả hằng số enum)
	
	METHOD, // Phương thức thành viên
	
	PARAMETER, // Tham số của phương thức
	
	CONSTRUCTOR, // Phương thức khởi tạo
	
	LOCAL_VARIABLE, // Biến cục bộ
	
	ANNOTATION_TYPE, // Kiểu chú thích (annotation)
	
	PACKAGE, // Gói (package)
	
	TYPE_PARAMETER, // Tham số kiểu (JDK 1.8)
	
	TYPE_USE // Sử dụng kiểu ở bất kỳ đâu (JDK 1.8)
}
```

#### Meta annotation - @Retention & @RetentionTarget

> Meta-annotation `@Retention` và `@RetentionTarget` được sử dụng để mô tả thời gian mà annotation được giữ lại trong lớp mà nó được áp dụng.

`@Retention` được sử dụng để xác định thời gian mà annotation có thể được giữ lại sau khi được áp dụng vào các lớp khác. Có ba chiến lược giữ lại được định nghĩa trong `enum RetentionPolicy`:

```java
public enum RetentionPolicy { 
	SOURCE, // Giữ lại trong tệp nguồn 
	CLASS, // Giữ lại trong quá trình biên dịch, giá trị mặc định 
	RUNTIME // Giữ lại trong quá trình chạy, có thể truy xuất thông tin Annotation bằng phản chiếu }
```

Để xác minh sự khác biệt giữa các Annotation đã áp dụng ba chiến lược này, chúng ta sẽ tạo ba Annotation khác nhau sử dụng mỗi chiến lược một lần để kiểm tra.

```java
@Retention(RetentionPolicy.SOURCE) public @interface SourcePolicy {

}

@Retention(RetentionPolicy.CLASS) public @interface ClassPolicy {

}

@Retention(RetentionPolicy.RUNTIME) public @interface RuntimePolicy {

}
```

Sau đó, chúng ta sẽ sử dụng ba Annotation đã tạo để chú thích cho một phương thức.

```java
public class RetentionTest {

	@SourcePolicy
		public void sourcePolicy() {
	}
	
	@ClassPolicy
		public void classPolicy() {
	}
	
	@RuntimePolicy
		public void runtimePolicy() {
	}
}
```

Bằng cách chạy lệnh `javap -verbose RetentionTest`, chúng ta có thể xem nội dung `bytecode` của lớp `RetentionTest` như sau:

```java
{
  public retention.RetentionTest();
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 3: 0

  public void sourcePolicy();
    flags: ACC_PUBLIC
    Code:
      stack=0, locals=1, args_size=1
         0: return
      LineNumberTable:
        line 7: 0

  public void classPolicy();
    flags: ACC_PUBLIC
    Code:
      stack=0, locals=1, args_size=1
         0: return
      LineNumberTable:
        line 11: 0
    RuntimeInvisibleAnnotations:
      0: #11()

  public void runtimePolicy();
    flags: ACC_PUBLIC
    Code:
      stack=0, locals=1, args_size=1
         0: return
      LineNumberTable:
        line 15: 0
    RuntimeVisibleAnnotations:
      0: #14()
}
```

Từ nội dung `bytecode` của `RetentionTest`, chúng ta có thể rút ra hai kết luận sau:

- Trình biên dịch không ghi lại thông tin chú thích của phương thức `sourcePolicy()`.
- Trình biên dịch sử dụng các thuộc tính `RuntimeInvisibleAnnotations` và `RuntimeVisibleAnnotations` để ghi lại thông tin chú thích của phương thức `classPolicy()` và `runtimePolicy()`.

#### Meta annotation - @Documented

> Documented Annotation được sử dụng để mô tả liệu khi sử dụng công cụ javadoc để tạo tài liệu trợ giúp cho một lớp, liệu liệu đó có bao gồm thông tin chú thích của nó hay không.

Đoạn mã dưới đây sẽ cho phép thông tin chú thích của Annotation `@TestDocAnnotation` được bao gồm trong tài liệu được tạo bằng công cụ Javadoc.

```java
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Target;
 
@Documented
@Target({ElementType.TYPE,ElementType.METHOD})
public @interface TestDocAnnotation {
 
	public String value() default "default";
}
```

```java
@TestDocAnnotation("myMethodDoc")
public void testDoc() {

}
```

#### Meta annotation - @Inherited

> Inherited Annotation được sử dụng để mô tả rằng một Annotation được áp dụng cho một lớp sẽ được kế thừa bởi các lớp con của nó. Nếu một lớp sử dụng một Annotation được đánh dấu bằng @Inherited, thì các lớp con của nó sẽ tự động kế thừa Annotation đó.

Chúng ta sẽ thử nghiệm Annotation này như sau:

- Định nghĩa Annotation @Inherited:

```java
@Inherited
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
public @interface TestInheritedAnnotation {
    String[] values();
    int number();
}
```

- Sử dụng Annotation này:

```java
@TestInheritedAnnotation(values = {"value"}, number = 10)
public class Person {
}

class Student extends Person {
    @Test
    public void test() {
        Class clazz = Student.class;
        Annotation[] annotations = clazz.getAnnotations();
        for (Annotation annotation : annotations) {
            System.out.println(annotation.toString());
        }
    }
}
```

Kết quả đầu ra:

```java
xxxxxxx.TestInheritedAnnotation(values=[value], number=10)
```

Dù lớp Student không được chú thích trực tiếp bằng `@TestInheritedAnnotation`, nhưng lớp cha của nó là `Person` được chú thích và `@TestInheritedAnnotation` được đánh dấu bằng `@Inherited`. Do đó, lớp `Student` tự động kế thừa `Annotation` này.

#### Meta annotation - @Repeatable (Java8)

Vui lòng tham khảo `@Repeatable` trong [[Java 8 Reapeatable Annotation]]

#### Meta annotation - @Native (Java8)

Khi sử dụng Annotation `@Native` để chú thích một biến thành viên, điều này có nghĩa là biến này có thể được tham chiếu bởi mã native (mã nguồn gốc), thường được sử dụng bởi các công cụ tạo mã. Annotation `@Native` không được sử dụng thường xuyên, chỉ cần biết về nó là đủ.

#### Annotation and Reflection

> Sau khi định nghĩa một Annotation và sử dụng giao diện phản chiếu (reflection) trong gói `java.lang.reflect`, chúng ta có thể sử dụng các phương thức của giao diện `AnnotatedElement` để truy cập nội dung của Annotation. Lưu ý rằng chỉ khi Annotation được định nghĩa với `RetentionPolicy.RUNTIME`, Annotation đó mới có thể được nhìn thấy trong runtime, và Annotation được lưu trữ trong tệp class khi nó được tải vào bởi máy ảo Java.

Giao diện `AnnotatedElement` là giao diện cha của tất cả các thành phần chương trình (Class, Method và Constructor), do đó khi sử dụng phản chiếu, chúng ta có thể gọi các phương thức của đối tượng `AnnotatedElement` để truy cập thông tin Annotation. Dưới đây là một số phương thức quan trọng của giao diện `AnnotatedElement`:

- `boolean isAnnotationPresent(Class<? extends Annotation> annotationClass)`
	- Kiểm tra xem thành phần chương trình có chứa loại Annotation chỉ định không. Nếu tồn tại, trả về true, ngược lại trả về false.
- `<T extends Annotation> T getAnnotation(Class<T> annotationClass)`
	- Trả về Annotation của loại chỉ định có tồn tại trong thành phần chương trình. Nếu không tồn tại, trả về null.
- `Annotation[] getAnnotations()`
	- Trả về tất cả các Annotation tồn tại trong thành phần chương trình. Nếu không có Annotation, trả về một mảng có độ dài bằng 0.
- `<T extends Annotation> T[] getAnnotationsByType(Class<T> annotationClass)`
	- Trả về một mảng các Annotation của loại chỉ định tồn tại trong thành phần chương trình. Nếu không có Annotation, trả về một mảng có độ dài bằng 0. Phương thức này kiểm tra cả các Annotation lặp lại.
- `<T extends Annotation> T getDeclaredAnnotation(Class<T> annotationClass)`
	- Trả về tất cả các Annotation trực tiếp tồn tại trong thành phần chương trình. Phương thức này bỏ qua việc kế thừa Annotation. Nếu không có Annotation trực tiếp tồn tại, trả về null.
- `<T extends Annotation> T[] getDeclaredAnnotationsByType(Class<T> annotationClass)`
	- Trả về một mảng các Annotation trực tiếp tồn tại trong thành phần chương trình. Phương thức này bỏ qua việc kế thừa Annotation. Nếu không có Annotation trực tiếp tồn tại, trả về một mảng có độ dài bằng 0.
- `Annotation[] getDeclaredAnnotations()`
	- Trả về tất cả các Annotation trực tiếp tồn tại trong thành phần chương trình cùng với các Annotation lặp lại tương ứng. Phương thức này bỏ qua việc kế thừa Annotation. Nếu không có Annotation trực tiếp tồn tại, trả về một mảng có độ dài bằng 0.

Những phương thức này cho phép chúng ta truy cập thông tin Annotation của một thành phần chương trình thông qua phản chiếu.

### Customize Annotation

> Khi đã hiểu về các Annotation tích hợp sẵn, các Annotation meta và giao diện phản chiếu để truy cập thông tin Annotation, chúng ta có thể bắt đầu tự định nghĩa Annotation của chúng ta. Dưới đây là một ví dụ đơn giản mà tôi sẽ kết hợp tất cả các kiến thức trên vào đó:

Định nghĩa Customize Annotation:

```java
package com.hnv99.java.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyMethodAnnotation {

    public String title() default "";

    public String description() default "";

}
```

Sử dụng Annotation:

```java
package com.hnv99.java.annotation;

import java.io.FileNotFoundException;
import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

public class TestMethodAnnotation {

    @Override
    @MyMethodAnnotation(title = "toStringMethod", description = "override toString method")
    public String toString() {
        return "Override toString method";
    }

    @Deprecated
    @MyMethodAnnotation(title = "old static method", description = "deprecated old static method")
    public static void oldMethod() {
        System.out.println("old method, don't use it.");
    }

    @SuppressWarnings({"unchecked", "deprecation"})
    @MyMethodAnnotation(title = "test method", description = "suppress warning static method")
    public static void genericsTest() throws FileNotFoundException {
        List l = new ArrayList();
        l.add("abc");
        oldMethod();
    }
}
```

Sử dụng giao diện phản chiếu để lấy thông tin Annotation, thêm phương thức main vào lớp `TestMethodAnnotation` để kiểm tra:

```java
public static void main(String[] args) {
    try {
        // Lấy tất cả các method
        Method[] methods = TestMethodAnnotation.class.getClassLoader()
                .loadClass(("com.hnv99.java.annotation.TestMethodAnnotation"))
                .getMethods();

        // Duyệt qua từng method
        for (Method method : methods) {
            // Kiểm tra xem method có chứa Annotation MyMethodAnnotation không
            if (method.isAnnotationPresent(MyMethodAnnotation.class)) {
                try {
                    // Lấy và duyệt qua tất cả các Annotation trên method
                    for (Annotation anno : method.getDeclaredAnnotations()) {
                        System.out.println("Annotation in Method '"
                                + method + "' : " + anno);
                    }

                    // Lấy thông tin đối tượng MyMethodAnnotation
                    MyMethodAnnotation methodAnno = method
                            .getAnnotation(MyMethodAnnotation.class);

                    System.out.println(methodAnno.title());

                } catch (Throwable ex) {
                    ex.printStackTrace();
                }
            }
        }
    } catch (SecurityException | ClassNotFoundException e) {
        e.printStackTrace();
    }
}
```

Kết quả kiểm tra:

```java
Annotation in Method 'public static void com.hnv99.java.annotation.TestMethodAnnotation.oldMethod()' : @java.lang.Deprecated()
Annotation in Method 'public static void com.hnv99.java.annotation.TestMethodAnnotation.oldMethod()' : @com.hnv99.java.annotation.MyMethodAnnotation(title=old static method, description=deprecated old static method)
old static method
Annotation in Method 'public static void com.hnv99.java.annotation.TestMethodAnnotation.genericsTest() throws java.io.FileNotFoundException' : @com.hnv99.java.annotation.MyMethodAnnotation(title=test method, description=suppress warning static method)
test method
Annotation in Method 'public java.lang.String com.hnv99.java.annotation.TestMethodAnnotation.toString()' : @com.hnv99.java.annotation.MyMethodAnnotation(title=toStringMethod, description=override toString method)
toStringMethod
```

Trong ví dụ trên, chúng ta đã định nghĩa một Annotation tùy chỉnh là `MyMethodAnnotation` và sử dụng nó trên các phương thức trong lớp `TestMethodAnnotation`. Sau đó, chúng ta sử dụng giao diện phản chiếu để lấy thông tin Annotation. Kết quả cho thấy chúng ta đã thành công trong việc truy cập và hiển thị thông tin của các Annotation được sử dụng trong mã.

## Hiểu sâu về annotation

### Java 8 cung cấp những Annotation mới nào?

- `@Repeatable`

Vui lòng tham khảo [[Java 8 Reapeatable Annotation]]

- `ElementType.TYPE_USE`

Được sử dụng để đánh dấu một Annotation có thể được áp dụng trên một loại dữ liệu cụ thể, bao gồm cả khai báo kiểu và khai báo tham số kiểu. Đây là một cách thuận tiện cho các nhà thiết kế để thực hiện kiểm tra kiểu.

Vui lòng tham khảo [[Java 8 Type Annotation]]

- `ElementType.TYPE_PARAMETER`

Được sử dụng để đánh dấu một Annotation có thể được áp dụng trên khai báo tham số kiểu. Đây là một cách thuận tiện cho các nhà phát triển để thực hiện kiểm tra kiểu.

Dưới đây là một ví dụ:

```java
// Định nghĩa Annotation với ElementType.TYPE_PARAMETER
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE_PARAMETER)
public @interface MyNotEmpty {
}

// Định nghĩa Annotation với ElementType.TYPE_USE
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE_USE)
public @interface MyNotNull {
}

// Lớp kiểm tra
public class TypeParameterAndTypeUseAnnotation<@MyNotEmpty T>{

  // Sử dụng ElementType.TYPE_PARAMETER, sẽ không biên dịch thành công
//	public @MyNotEmpty T test(@MyNotEmpty T a){
//		new ArrayList<@MyNotEmpty String>();
//			return a;
//	}

  // Sử dụng ElementType.TYPE_USE, biên dịch thành công
  public @MyNotNull T test2(@MyNotNull T a){
    new ArrayList<@MyNotNull String>();
    return a;
  }
}
```

### Annotation có hỗ trợ kế thừa không?

> Annotation không hỗ trợ kế thừa

Annotation không hỗ trợ kế thừa bằng từ khóa `extends` để kế thừa một `@interface` khác. Tuy nhiên, khi biên dịch, trình biên dịch sẽ tự động kế thừa giao diện `java.lang.annotation.Annotation`.

Mặc dù giao diện Java có thể triển khai đa kế thừa, nhưng khi định nghĩa Annotation, không thể sử dụng từ khóa `extends` để kế thừa `@interface`.

Để kế thừa Annotation từ lớp cha, chúng ta có thể sử dụng `@Inherited`: Nếu một lớp sử dụng Annotation được đánh dấu bằng `@Inherited`, thì các lớp con của nó sẽ tự động kế thừa Annotation đó.

### Nguyên lý hoạt động của Annotation là gì?

> Có rất nhiều bài viết trên mạng không đề cập đúng đến nguyên lý hoạt động của Annotation.

Dưới đây là hai bài viết mà tôi muốn giới thiệu cho bạn

- https://blog.csdn.net/qq_20009015/article/details/106038023
- https://www.race604.com/annotation-processing/  

## Ứng dụng thực tế của Annotation:

> Cuối cùng, hãy xem một số tình huống áp dụng thực tế của Annotation trong phát triển phần mềm.

### Chuyển từ cấu hình hóa sang chú thích hóa - Tiến bộ của các framework:

Ví dụ về Spring Framework, chuyển từ cấu hình hóa sang chú thích hóa.

### Chuyển từ triển khai kế thừa sang triển khai chú thích - Từ Junit 3 sang Junit 4

> Từ Junit 3 sang Junit 4, một ví dụ về việc đóng gói một module. Đa số người thường triển khai bằng cách kế thừa và kết hợp, nhưng nếu kết hợp với chú thích, sẽ giúp cải thiện tính tinh vi của việc triển khai (giảm độ ràng buộc).

- Lớp cần kiểm tra

```java
public class HelloWorld {
 	
 	public void sayHello(){
 		System.out.println("hello....");
 		throw new NumberFormatException();
 	}
 	
 	public void sayWorld(){
 		System.out.println("world....");
 	}
 	
 	public String say(){
 		return "hello world!";
 	}
 	
}
```

- Junit 3 thực hiện Unit Test:

Triển khai bằng cách kế thừa lớp `TestCase`, việc khởi tạo được thực hiện bằng cách ghi đè phương thức của lớp cha, và cách kiểm thử được xác định bằng cách sử dụng tiền tố `test`.

```java
public class HelloWorldTest extends TestCase{
	private HelloWorld hw;

	@Override
	protected void setUp() throws Exception {
		super.setUp();
		hw=new HelloWorld();
	}

	//1. Phương thức kiểm thử không có giá trị trả về
	public void testHello(){
		try {
			hw.sayHello();
		} catch (Exception e) {
			System.out.println("Xảy ra ngoại lệ.....");
		}
	}

	public void testWorld(){
		hw.sayWorld();
	}

	//2. Phương thức kiểm thử có giá trị trả về
	// Trả về chuỗi
	public void testSay(){
		assertEquals("Kiểm thử không thành công", hw.say(), "hello world!");
	}

	// Trả về đối tượng
	public void testObj(){
		assertNull("Kiểm thử đối tượng không rỗng", null);
		assertNotNull("Kiểm thử đối tượng rỗng",new String());
	}

	@Override
	protected void tearDown() throws Exception {
		super.tearDown();
		hw=null;
	}	
}
```

- Junit 4 thực hiện Unit Test

Triển khai bằng cách sử dụng các chú thích như `@Before`, `@Test`, `@After`, v.v.

```java
public class HelloWorldTest {
	private HelloWorld hw;

	@Before
	public void setUp() {
		hw = new HelloWorld();
	}

	@Test(expected=NumberFormatException.class)
	// 1. Phương thức kiểm thử không có giá trị trả về, thuận tiện hơn so với Junit 3
	public void testHello() {
		hw.sayHello();
	}

	@Test
	public void testWorld() {
		hw.sayWorld();
	}

	@Test
	// 2. Phương thức kiểm thử có giá trị trả về
	// Trả về chuỗi
	public void testSay() {
		assertEquals("Kiểm thử không thành công", hw.say(), "hello world!");
	}

	@Test
	// Trả về đối tượng
	public void testObj() {
		assertNull("Kiểm thử đối tượng không rỗng", null);
		assertNotNull("Kiểm thử đối tượng rỗng", new String());
	}

	@After
	public void tearDown() throws Exception {
		hw = null;
	}
}
```

Ở đây, chúng ta nhận thấy rằng việc triển khai bằng cách sử dụng chú thích sẽ làm cho việc thực hiện unit test trở nên tinh tế hơn.

### Chú thích tùy chỉnh và AOP

> Một trong những cách phổ biến nhất để thực hiện phân tách cặp nhất đó là sử dụng Spring AOP để thực hiện quản lý nhật ký hoạt động thống nhất. Ở đây tôi đã tìm một ví dụ trong một dự án mã nguồn mở (chỉ hiển thị mã chính), để cho bạn thấy cách sử dụng chú thích để thực hiện phân tách cặp nhất.

- Chú thích tùy chỉnh Log:

```java
@Target({ ElementType.PARAMETER, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Log {
    /**
     * Mô-đun 
     */
    public String title() default "";

    /**
     * Chức năng
     */
    public BusinessType businessType() default BusinessType.OTHER;

    /**
     * Loại người thực hiện
     */
    public OperatorType operatorType() default OperatorType.MANAGE;

    /**
     * Có lưu thông tin yêu cầu không
     */
    public boolean isSaveRequestData() default true;
}
```

- Triển khai khía cạnh (aspect) để xử lý nhật ký, chặn điểm cắt chú thích tùy chỉnh Log và thực hiện các hành động nhất định cho các phương thức đã được chú thích bằng `@Log`.

```java
@Aspect
@Component
public class LogAspect {
    private static final Logger log = LoggerFactory.getLogger(LogAspect.class);

    /**
     * Định nghĩa điểm cắt - gói chú thích tùy chỉnh
     */
    @Pointcut("@annotation(com.xxx.aspectj.lang.annotation.Log)")
    public void logPointCut() {
    }

    /**
     * Xử lý sau khi hoàn thành yêu cầu
     *
     * @param joinPoint Điểm cắt
     */
    @AfterReturning(pointcut = "logPointCut()", returning = "jsonResult")
    public void doAfterReturning(JoinPoint joinPoint, Object jsonResult) {
        handleLog(joinPoint, null, jsonResult);
    }

    /**
     * Chặn xử lý ngoại lệ
     * 
     * @param joinPoint Điểm cắt
     * @param e Ngoại lệ
     */
    @AfterThrowing(value = "logPointCut()", throwing = "e")
    public void doAfterThrowing(JoinPoint joinPoint, Exception e) {
        handleLog(joinPoint, e, null);
    }

    protected void handleLog(final JoinPoint joinPoint, final Exception e, Object jsonResult) {
        try {
            // Lấy chú thích
            Log controllerLog = getAnnotationLog(joinPoint);
            if (controllerLog == null) {
                return;
            }

            // Lấy người dùng hiện tại
            User currentUser = ShiroUtils.getSysUser();

            // *========Nhật ký cơ sở dữ liệu=========*//
            OperLog operLog = new OperLog();
            operLog.setStatus(BusinessStatus.SUCCESS.ordinal());
            // Địa chỉ yêu cầu
            String ip = ShiroUtils.getIp();
            operLog.setOperIp(ip);
            // Kết quả trả về
            operLog.setJsonResult(JSONObject.toJSONString(jsonResult));

            operLog.setOperUrl(ServletUtils.getRequest().getRequestURI());
            if (currentUser != null) {
                operLog.setOperName(currentUser.getLoginName());
                if (StringUtils.isNotNull(currentUser.getDept())
                        && StringUtils.isNotEmpty(currentUser.getDept().getDeptName())) {
                    operLog.setDeptName(currentUser.getDept().getDeptName());
                }
            }

            if (e != null) {
                operLog.setStatus(BusinessStatus.FAIL.ordinal());
                operLog.setErrorMsg(StringUtils.substring(e.getMessage(), 0, 2000));
            }
            // Đặt tên phương thức
            String className = joinPoint.getTarget().getClass().getName();
            String methodName = joinPoint.getSignature().getName();
            operLog.setMethod(className + "." + methodName + "()");
            // Đặt phương thức yêu cầu
            operLog.setRequestMethod(ServletUtils.getRequest().getMethod());
            // Xử lý đặt tham số từ chú thích
            getControllerMethodDescription(controllerLog, operLog);
            // Lưu vào cơ sở dữ liệu
            AsyncManager.me().execute(AsyncFactory.recordOper(operLog));
        } catch (Exception exp) {
            // Ghi nhật ký ngoại lệ cục bộ
            log.error("==Ngoại lệ thông báo trước==");
            log.error("Thông tin ngoại lệ:{}", exp.getMessage());
            exp.printStackTrace();
        }
    }

    /**
     * Lấy thông tin mô tả phương thức từ chú thích ở tầng Controller
     * 
     * @param log Chú thích
     * @param operLog Nhật ký hoạt động
     * @throws Exception
     */
    public void getControllerMethodDescription(Log log, OperLog operLog) throws Exception {
        // Đặt hành động
        operLog.setBusinessType(log.businessType().ordinal());
        // Đặt tiêu đề
        operLog.setTitle(log.title());
        // Đặt loại người thực hiện
        operLog.setOperatorType(log.operatorType().ordinal());
        // Có cần lưu thông tin yêu cầu không
        if (log.isSaveRequestData()) {
            // Lấy thông tin tham số và giá trị, lưu vào cơ sở dữ liệu
            setRequestValue(operLog);
        }
    }

    /**
     * Lấy tham số yêu cầu, lưu vào nhật ký
     * 
     * @param operLog Nhật ký hoạt động
     * @param request
     */
    private void setRequestValue(OperLog operLog) {
        Map<String, String[]> map = ServletUtils.getRequest().getParameterMap();
        String params = JSONObject.toJSONString(map);
        operLog.setOperParam(StringUtils.substring(params, 0, 2000));
    }

    /**
     * Kiểm tra xem có chú thích không, nếu có thì lấy
     */
    private Log getAnnotationLog(JoinPoint joinPoint) throws Exception {
        Signature signature = joinPoint.getSignature();
        MethodSignature methodSignature = (MethodSignature) signature;
        Method method = methodSignature.getMethod();

        if (method != null)
        {
            return method.getAnnotation(Log.class);
        }
        return null;
    }
}
```

- Sử dụng chú thích @Log

Trong ví dụ CRUD đơn giản, ở đây tôi chỉ hiển thị một phần mã: Mỗi khi thực hiện các hoạt động CRUD với "Phòng ban", một bản ghi nhật ký hoạt động sẽ được tạo ra và lưu vào cơ sở dữ liệu.

```java
@Controller
@RequestMapping("/system/dept")
public class DeptController extends BaseController {
    private String prefix = "system/dept";

    @Autowired
    private IDeptService deptService;
    
    /**
     * Thêm mới và lưu phòng ban
     */
    @Log(title = "Quản lý phòng ban", businessType = BusinessType.INSERT)
    @RequiresPermissions("system:dept:add")
    @PostMapping("/add")
    @ResponseBody
    public AjaxResult addSave(@Validated Dept dept) {
        if (UserConstants.DEPT_NAME_NOT_UNIQUE.equals(deptService.checkDeptNameUnique(dept))) {
            return error("Thêm mới phòng ban '" + dept.getDeptName() + "' thất bại, tên phòng ban đã tồn tại");
        }
        return toAjax(deptService.insertDept(dept));
    }

    /**
     * Cập nhật
     */
    @Log(title = "Quản lý phòng ban", businessType = BusinessType.UPDATE)
    @RequiresPermissions("system:dept:edit")
    @PostMapping("/edit")
    @ResponseBody
    public AjaxResult editSave(@Validated Dept dept) {
        if (UserConstants.DEPT_NAME_NOT_UNIQUE.equals(deptService.checkDeptNameUnique(dept))) {
            return error("Sửa phòng ban '" + dept.getDeptName() + "' thất bại, tên phòng ban đã tồn tại");
        } else if(dept.getParentId().equals(dept.getDeptId())) {
            return error("Sửa phòng ban '" + dept.getDeptName() + "' thất bại, phòng ban cấp trên không thể là chính nó");
        }
        return toAjax(deptService.updateDept(dept));
    }

    /**
     * Xóa
     */
    @Log(title = "Quản lý phòng ban", businessType = BusinessType.DELETE)
    @RequiresPermissions("system:dept:remove")
    @GetMapping("/remove/{deptId}")
    @ResponseBody
    public AjaxResult remove(@PathVariable("deptId") Long deptId) {
        if (deptService.selectDeptCount(deptId) > 0) {
            return AjaxResult.warn("Có phòng ban cấp dưới, không được phép xóa");
        }
        if (deptService.checkDeptExistUser(deptId)) {
            return AjaxResult.warn("Phòng ban có người dùng, không được phép xóa");
        }
        return toAjax(deptService.deleteDeptById(deptId));
    }

  // ...
}
```

> Tương tự, bạn cũng có thể thấy quản lý quyền hạn cũng được thực hiện thông qua cơ chế chú thích tương tự (`@RequiresPermissions`). Vì vậy, chúng ta có thể thấy rằng mục tiêu cuối cùng của chú thích + AOP là để thực hiện phân tách cặp của các module.
