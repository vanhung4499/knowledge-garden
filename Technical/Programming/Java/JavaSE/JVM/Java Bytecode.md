---
title: Java Bytecode
tags: [java, javase, jvm, bytecode, javaagent, asm, javassist]
categories: [java, javase, jvm]
date created: 2023-07-19
date modified: 2023-07-19
---

# Java Bytecode

## Giới thiệu về Bytecode

### Bytecode là gì?

Java bytecode là một định dạng lệnh mà máy ảo Java (JVM) thực thi. Java bytecode được gọi là "bytecode" vì: **Tệp Java bytecode (`.class`) là một luồng dữ liệu nhị phân được cấu trúc gọn gàng với đơn vị cơ bản là byte 8 bit**, các mục dữ liệu được sắp xếp chặt chẽ theo thứ tự trong tệp .class mà không có bất kỳ ký tự phân tách nào. **Toàn bộ tệp .class thực chất là một bảng**.

Java có thể thực hiện "compile once, run anywhere" (một lần biên dịch, chạy ở bất kỳ đâu) vì: JVM đã được tùy chỉnh cho các hệ điều hành, nền tảng khác nhau; và bất kể nền tảng nào, bạn cũng có thể biên dịch và tạo ra tệp Java bytecode (.class) có định dạng cố định.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230719115010.png)

### Giải mã bytecode

Chúng ta sẽ sử dụng một ví dụ để giải thích cách giải mã tệp bytecode.

(1) Đầu tiên, tạo một tệp `Demo.java` với nội dung như sau:

```java
public class Demo {

    public static void main(String[] args) {
        System.out.println("hello world");
    }

}
```

(2) Biên dịch tệp `Demo.java` bằng cách chạy `javac Demo.java`, tệp `Demo.class` sẽ được tạo ra trong thư mục hiện tại.

Nội dung tệp là một chuỗi số hexa:

```
cafe babe 0000 0034 001d 0a00 0600 0f09
0010 0011 0800 120a 0013 0014 0700 1507
0016 0100 063c 696e 6974 3e01 0003 2829
5601 0004 436f 6465 0100 0f4c 696e 654e
756d 6265 7254 6162 6c65 0100 046d 6169
6e01 0016 285b 4c6a 6176 612f 6c61 6e67
2f53 7472 696e 673b 2956 0100 0a53 6f75
7263 6546 696c 6501 0009 4465 6d6f 2e6a
6176 610c 0007 0008 0700 170c 0018 0019
0100 0b68 656c 6c6f 2077 6f72 6c64 0700
1a0c 001b 001c 0100 1b63 6f6d 2f68 6e76
3939 2f6a 6176 6163 6f72 652f 6a76 6d2f
4465 6d6f 0100 106a 6176 612f 6c61 6e67
2f4f 626a 6563 7401 0010 6a61 7661 2f6c
616e 672f 5379 7374 656d 0100 036f 7574
0100 154c 6a61 7661 2f69 6f2f 5072 696e
7453 7472 6561 6d3b 0100 136a 6176 612f
696f 2f50 7269 6e74 5374 7265 616d 0100
0770 7269 6e74 6c6e 0100 1528 4c6a 6176
612f 6c61 6e67 2f53 7472 696e 673b 2956
0021 0005 0006 0000 0000 0002 0001 0007
0008 0001 0009 0000 001d 0001 0001 0000
0005 2ab7 0001 b100 0000 0100 0a00 0000
0600 0100 0000 0300 0900 0b00 0c00 0100
0900 0000 2500 0200 0100 0000 09b2 0002
1203 b600 04b1 0000 0001 000a 0000 000a
0002 0000 0006 0008 0007 0001 000d 0000
0002 000e 
```

Trước đó đã đề cập: Tệp Java bytecode (`.class`) là một luồng dữ liệu nhị phân được cấu trúc gọn gàng với đơn vị cơ bản là byte 8 bit, các mục dữ liệu được sắp xếp chặt chẽ theo thứ tự trong tệp .class mà không có bất kỳ ký tự phân tách nào.

(3) Chúng ta có thể **giải mã** tệp bytecode bằng công cụ giải mã tích hợp sẵn trong Java, `javap`.

Chạy `javap -verbose -p Demo.class`, kết quả sẽ hiển thị các hướng dẫn tương đối dễ hiểu trên cửa sổ điều khiển. Kết quả đầu ra gần như như sau:

```java
Classfile /Users/kirito4499/Desktop/Learn/Java/javacore/src/main/java/com/hnv99/javacore/jvm/Demo.class
  Last modified Jul 19, 2023; size 436 bytes
  MD5 checksum 1048b81da0c1b88301731243e6c260c1
  Compiled from "Demo.java"
public class com.hnv99.javacore.jvm.Demo
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #6.#15         // java/lang/Object."<init>":()V
   #2 = Fieldref           #16.#17        // java/lang/System.out:Ljava/io/PrintStream;
   #3 = String             #18            // hello world
   #4 = Methodref          #19.#20        // java/io/PrintStream.println:(Ljava/lang/String;)V
   #5 = Class              #21            // com/hnv99/javacore/jvm/Demo
   #6 = Class              #22            // java/lang/Object
   #7 = Utf8               <init>
   #8 = Utf8               ()V
   #9 = Utf8               Code
  #10 = Utf8               LineNumberTable
  #11 = Utf8               main
  #12 = Utf8               ([Ljava/lang/String;)V
  #13 = Utf8               SourceFile
  #14 = Utf8               Demo.java
  #15 = NameAndType        #7:#8          // "<init>":()V
  #16 = Class              #23            // java/lang/System
  #17 = NameAndType        #24:#25        // out:Ljava/io/PrintStream;
  #18 = Utf8               hello world
  #19 = Class              #26            // java/io/PrintStream
  #20 = NameAndType        #27:#28        // println:(Ljava/lang/String;)V
  #21 = Utf8               com/hnv99/javacore/jvm/Demo
  #22 = Utf8               java/lang/Object
  #23 = Utf8               java/lang/System
  #24 = Utf8               out
  #25 = Utf8               Ljava/io/PrintStream;
  #26 = Utf8               java/io/PrintStream
  #27 = Utf8               println
  #28 = Utf8               (Ljava/lang/String;)V
{
  public com.hnv99.javacore.jvm.Demo();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 3: 0

  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=1, args_size=1
         0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
         3: ldc           #3                  // String hello world
         5: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
         8: return
      LineNumberTable:
        line 6: 0
        line 7: 8
}
SourceFile: "Demo.java"


```

### Cấu trúc tệp bytecode

Tệp bytecode có vẻ lộn xộn và không có thứ tự, nhưng thực tế nó được cấu thành từ các yêu cầu định dạng nghiêm ngặt.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230719120335.png)

#### Magic Number

4 byte đầu tiên của mỗi tệp `.class` được gọi là **`Magic Number`**, nó chỉ ra xem tệp này có phải là một tệp `.class` được JVM chấp nhận hay không. Giá trị cố định của magic number là: `0xCAFEBABE`.

#### Version

Số phiên bản (version) có 4 byte, **2 byte đầu tiên đại diện cho số phiên bản phụ (Minor Version), 2 byte cuối cùng đại diện cho số phiên bản chính (Major Version)**.

Ví dụ, nếu số phiên bản là "00 00 00 34". Khi đó, số phiên bản phụ chuyển đổi sang hệ thập phân là 0, số phiên bản chính chuyển đổi sang hệ thập phân là 52. Tìm kiếm số phiên bản chính tương ứng với số phiên bản 52 trên trang web chính thức của Oracle, ta có số phiên bản chính 52 tương ứng với phiên bản Java 1.8, vì vậy phiên bản Java mà tệp được biên dịch là 1.8.0.

#### Constant Pool

Ngay sau version chính là Constant Pool, constant pool có thể được hiểu như một kho lưu trữ tài nguyên trong tệp `.class`.

Constant Pool chia thành hai phần chính: Constant Pool Count và Constant Pool Data.

- **Constant Pool Count** - Vì số lượng hằng số không cố định, nên cần hai byte đầu tiên để đại diện cho giá trị đếm số lượng hằng số trong constant pool.
    
- **Constant Pool Data** - Mỗi hằng số trong khu vực dữ liệu là một bảng và có cấu trúc khác nhau.

Constant Pool chủ yếu chứa hai loại hằng số:

- **Hằng số kí tự** - Ví dụ như chuỗi văn bản, giá trị hằng số được khai báo là `final`.
- **Tham chiếu tượng trưng**
	- Tên đầy đủ của lớp và giao diện
	- Tên và mô tả của trường
	- Tên và mô tả của phương thức

#### Access Flags

Ngay sau Constant Pool là 2 byte đại diện cho Access Flags, cờ này **được sử dụng để nhận dạng thông tin truy cập của một số lớp hoặc giao diện**, mô tả xem Class này là lớp hay giao diện,và có được `public`, `abstract`, `final` hay các từ khóa khác điều chỉnh không.

Access Flags có các loại sau:

|Tên Access Flags|Giá trị cờ|Ý nghĩa|
|---|---|---|
|**ACC_PUBLIC**|0x0001|Có phải là loại Public hay không|
|**ACC_FINAL**|0x0010|Được khai báo là final, chỉ có lớp mới có thể đặt|
|**ACC_SUPER**|0x0020|Cho phép sử dụng cú pháp mới của lệnh invokespecial|
|**ACC_INTERFACE**|0x0200|Đây là một giao diện|
|**ACC_ABSTRACT**|0x0400|Có phải là loại abstract hay không, đối với giao diện hoặc lớp trừu tượng|
|**ACC_SYNTHETIC**|0x1000|Lớp này không được tạo ra bởi mã nguồn người dùng|
|**ACC_ANNOTATION**|0x2000|Đây là một chú thích|
|**ACC_ENUM**|0x4000|Đây là một enum|

#### This Class, Super Class, Interface Class

This Class và Super Class đều là dữ liệu 2 byte, trong khi chỉ mục giao diện là một tập hợp dữ liệu 2 byte. **Trong tệp `.class`, 3 dữ liệu này được sử dụng để xác định mối quan hệ kế thừa của lớp này**.

> Java chỉ hỗ trợ đơn kế thừa nhưng có thể triển khai nhiều interface -> Super Class tối đa một bản ghi, interface thì có thể có nhiều bản ghi hơn

#### Field Table

**Field Table (Bảng trường) được sử dụng để mô tả các biến được khai báo trong lớp và giao diện**. Bao gồm biến cấp lớp và biến cấp thể hiện, nhưng không bao gồm biến cục bộ được khai báo trong phạm vi phương thức.

Bảng trường cũng được chia thành hai phần, phần đầu tiên là Fields Count (2 byte), mô tả số lượng trường; phần thứ hai là thông tin chi tiết về từng trường (Field Entries).

#### Method Table

Sau Field Table là Method Table (bảng phương thức), cấu trúc bảng phương thức tương tự như bảng trường, bao gồm cờ truy cập, chỉ mục tên, chỉ mục mô tả và tập hợp thuộc tính.

#### Attribues

Tập hợp thuộc tính chứa thông tin cơ bản về các thuộc tính (field, method, class) được định nghĩa trong lớp hoặc giao diện trong tệp này.

Các thuộc tính được sử dụng để đại diện cho:

- Code
- Local variables, constant value, information about the stack and exceptions
- Inner Classes, Bootstrap Methods, Enclosing methods
- Annotations
- Information for debug/decompilation
- Complementary information (Deprecated, Signature…)

### Các chỉ thị bytecode

Các chỉ thị bytecode được tạo thành từ một số nhận dạng độ dài 1 byte (gọi là mã chỉ thị, Opcode) và một hoặc nhiều tham số theo sau đại diện cho hành động cụ thể của chỉ thị đó. Vì JVM sử dụng kiến trúc dựa trên ngăn xếp toán hạng thay vì kiến trúc dựa trên thanh ghi, nên hầu hết các chỉ thị không bao gồm các toán hạng, chỉ có một mã chỉ thị.

Độ dài của mã chỉ thị JVM là 1 byte, vì vậy tập hợp mã chỉ thị có tối đa 256 chỉ thị.

Các chỉ thị bytecode chia thành khoảng 9 loại:

- Chỉ thị tải và lưu trữ
- Chỉ thị tính toán
- Chỉ thị chuyển đổi kiểu
- Chỉ thị tạo và truy cập đối tượng
- Chỉ thị quản lý ngăn xếp toán hạng
- Chỉ thị điều khiển chuyển đổi
- Chỉ thị gọi và trả về phương thức
- Chỉ thị xử lý ngoại lệ
- Chỉ thị đồng bộ

## Tăng cường bytecode

Kỹ thuật tăng cường bytecode là một loại kỹ thuật để sửa đổi hoặc tạo ra các tệp bytecode hoàn toàn mới.

Các framework tăng cường bytecode phổ biến bao gồm:

- [asm](https://asm.ow2.io/) - ASM là một thư viện mã bytecode Java nhỏ gọn và hiệu quả, được sử dụng để đọc, viết và biên dịch bytecode Java. Nó cung cấp các API cho việc tạo, sửa đổi và phân tích cú pháp bytecode Java.
- [javassist](https://github.com/jboss-javassist/javassist) - Javassist cho phép thay đổi các lớp trong thời gian chạy bằng cách kiểm soát bytecode cơ bản. Nó cung cấp một API dễ sử dụng để tạo ra và sửa đổi bytecode Java.
- [Byte Buddy](https://github.com/raphw/byte-buddy) - Byte Buddy là một thư viện tạo bytecode Java hiệu quả và dễ sử dụng. Nó cho phép tạo ra và sửa đổi bytecode Java trong thời gian chạy một cách linh hoạt và mạnh mẽ.

### Asm

Đối với yêu cầu thay đổi bytecode một cách thủ công, bạn có thể sử dụng Asm, nó có thể tạo ra tệp bytecode `.class` trực tiếp hoặc thay đổi hành vi của lớp trước khi nó được tải vào JVM.

Asm có hai loại API: Core API và Tree API

- **Core API** - Asm Core API có thể được so sánh với cách phân tích cú pháp XML bằng cách sử dụng SAX, không cần đọc toàn bộ cấu trúc của lớp này vào bộ nhớ, bạn có thể xử lý tệp bytecode theo cách dòng chảy. Lợi ích của nó là tiết kiệm bộ nhớ rất nhiều, nhưng độ khó lập trình cao. Tuy nhiên, vì lý do hiệu suất, thường sử dụng Core API để lập trình. Trong Core API, có một số lớp quan trọng sau:
	- **`ClassReader`** - Đọc tệp `.class` đã được biên dịch.
	- **`ClassWriter`** - Xây dựng lại lớp đã biên dịch, như thay đổi tên lớp, thuộc tính và phương thức, hoặc tạo tệp bytecode mới cho một lớp.
	- Các lớp **`Visitor`** khác - Core API xử lý bytecode từ trên xuống dưới theo thứ tự, với mỗi vùng khác nhau trong tệp bytecode, có một Visitor khác nhau, ví dụ: MethodVisitor để truy cập phương thức, FieldVisitor để truy cập biến, AnnotationVisitor để truy cập chú thích, vv. Để thực hiện AOP, cần sử dụng MethodVisitor.
- **Tree API** - Asm Tree API có thể được so sánh với cách phân tích cú pháp XML bằng cách sử dụng DOM, nó đọc toàn bộ cấu trúc của lớp vào bộ nhớ, nhược điểm là tiêu tốn nhiều bộ nhớ hơn, nhưng lập trình đơn giản hơn. Tree API khác với Core API, Tree API ánh xạ các vùng khác nhau của bytecode thành các nút, tương tự như các nút DOM, để lập trình dễ hiểu hơn.

### Javassist

Khi sử dụng Javassist để thực hiện tăng cường bytecode, bạn không cần quan tâm đến cấu trúc cứng nhắc của bytecode, ưu điểm của Javassist nằm ở việc lập trình đơn giản. Bạn có thể sử dụng mã Java trực tiếp mà không cần hiểu về các chỉ thị máy ảo, để thay đổi cấu trúc của lớp hoặc tạo lớp động.

Các lớp cốt lõi của Javassist bao gồm:

- `CtClass (compile-time class)` - Thông tin lớp tại thời gian biên dịch. Nó là một trừu tượng của tệp `class` trong mã nguồn, bạn có thể lấy một đối tượng `CtClass` bằng cách sử dụng tên đầy đủ của lớp để đại diện cho tệp lớp đó.
- `ClassPool` - `ClassPool` có thể được coi như một bảng băm lưu trữ thông tin `CtClass`, với khóa là tên lớp và giá trị là đối tượng `CtClass` tương ứng với tên lớp đó. Khi bạn muốn thay đổi một lớp cụ thể, bạn có thể sử dụng phương thức `pool.getCtClass("className")` để lấy `CtClass` tương ứng từ pool.
- `CtMethod`, `CtField` - Tương ứng với các phương thức và thuộc tính trong lớp.

## Overloading Runtime Class

### Instrument

Instrument là một thư viện được cung cấp bởi JVM để sửa đổi các lớp đã được tải, đặc biệt hỗ trợ cho việc viết mã gắn kết cho ngôn ngữ Java. Nó phụ thuộc vào cơ chế Attach API của JVMTI để thực hiện. Trước JDK 1.6, Instrument chỉ hoạt động khi lớp được tải lên JVM khi khởi động, nhưng từ JDK 1.6 trở đi, Instrument hỗ trợ sửa đổi lớp trong quá trình chạy. Để sử dụng chức năng sửa đổi lớp của Instrument, chúng ta cần triển khai giao diện ClassFileTransformer và định nghĩa một trình biên dịch tệp lớp. Phương thức transform() trong giao diện này sẽ được gọi khi tệp lớp được tải, và trong phương thức transform, chúng ta có thể sử dụng ASM hoặc Javassist để sửa đổi hoặc thay thế bytecode được truyền vào và trả về một mảng bytecode mới.

## JavaAgent

**JavaAgent là gì?**

JavaAgent là một tham số của lệnh java. Tham số javaagent có thể được sử dụng để chỉ định một tệp jar, nó sử dụng API Instrumentation của JVM để thay đổi bytecode của các lớp đã tải trong JVM.

1. Tệp jar này phải chỉ định mục Premain-Class trong MANIFEST.MF.
2. Lớp được chỉ định bởi Premain-Class phải triển khai phương thức premain().

Phương thức premain, dựa trên ý nghĩa của nó, là một lớp chạy trước khi main. Khi máy ảo Java khởi động, trước khi thực hiện main, JVM sẽ chạy phương thức premain của lớp được chỉ định trong tệp jar bằng cách sử dụng tham số -javaagent.

Trong terminal, nhập `java` để xem các tham số tương ứng, trong đó có liên quan đến java agent:

```shell
-agentlib:<libname>[=<options>]
			  Load native agent library <libname>, e.g. -agentlib:hprof
			  See also -agentlib:jdwp=help and -agentlib:hprof=help
-agentpath:<pathname>[=<options>]
			  Load native agent library by full pathname
-javaagent:<jarpath>[=<options>]
			  Load Java programming language agent, see java.lang.instrument
```

### Giới thiệu về Java Agent

Java Agent, còn được gọi là Java Proxy được giới thiệu từ JDK1.5, đây là một công nghệ cho phép chỉnh sửa bytecode của Java một cách linh hoạt. Trong Java, các lớp được biên dịch thành bytecode và được thực thi bởi JVM. Trước khi JVM thực thi bytecode này, Java Agent có thể lấy thông tin về mã bytecode này và sử dụng trình biên dịch bytecode để thay đổi nó, từ đó thực hiện các chức năng bổ sung.

Java Agent không thể chạy riêng lẻ như một tệp jar, mà nó hoạt động bằng cách gắn kết vào quá trình JVM của chương trình mục tiêu. Khi khởi động, chỉ cần thêm tùy chọn -javaagent và ClassFileTransformer (trình biên dịch bytecode) vào các thông số khởi động của chương trình mục tiêu, tương tự như việc gắn kết interceptor trước phương thức main.

### Chức năng của Java Agent

Java Agent chủ yếu có các chức năng sau:

- Java Agent có thể chặn và sửa đổi mã bytecode trước khi nó được tải vào JVM.
- Java Agent có thể sửa đổi mã bytecode đã được tải vào JVM trong quá trình chạy.

Java Agent được sử dụng trong các trường hợp sau:

- Các tính năng gỡ lỗi của các IDE như Eclipse, IntelliJ IDEA.
- Tính năng triển khai nóng (hot deployment) như JRebel, XRebel, spring-loaded, …
- Các công cụ chẩn đoán trực tuyến như Btrace, Greys, Arthas của Alibaba, …
- Các công cụ phân tích hiệu suất như Visual VM, JConsole, …
- Các công cụ kiểm tra hiệu suất toàn bộ hệ thống như Skywalking, Pinpoint, …

### Nguyên lý hoạt động của Java Agent

Trước khi hiểu nguyên lý hoạt động của Java Agent, cần có một hiểu biết rõ về cơ chế tải lớp trong Java. Java Agent có hai cách thực hiện: một là thông qua premain trước khi phương thức main được thực thi, hai là thông qua JVM Attach trong quá trình chạy, dựa trên JVMTI.

Chủ yếu là chặn trước quá trình tải lớp và sửa đổi mã bytecode.

Dưới đây, chúng ta sẽ giới thiệu các thuật ngữ quan trọng:

- **JVMTI** (JVM Tool Interface) là một tập hợp các giao diện mà JVM cung cấp cho người dùng mở rộng. JVMTI hoạt động dựa trên sự kiện, mỗi khi JVM thực hiện một số logic, nó sẽ kích hoạt các giao diện gọi lại tương ứng, người dùng có thể mở rộng thông qua các giao diện gọi lại này.

  JVMTI là nền tảng chung để triển khai các công cụ như Debugger, Profiler, Monitor, Thread Analyser,… và được hỗ trợ trên hầu hết các máy ảo Java phổ biến.

- **JVMTIAgent** là một thư viện động, sử dụng các giao diện mà JVMTI cung cấp để thực hiện các tác vụ mà thông thường không thể thực hiện. Thông thường, nó triển khai một hoặc nhiều hàm sau:
	- Hàm Agent_OnLoad: được gọi khi agent được tải vào trong quá trình khởi động.
	- Hàm Agent_OnAttach: được gọi khi agent được tải vào trong quá trình chạy thông qua JVM Attach.
	- Hàm Agent_OnUnload: được gọi khi agent bị gỡ bỏ.
- **javaagent** phụ thuộc vào JVMTIAgent của instrument (trên Linux, thư viện động tương ứng là libinstrument.so), còn được gọi là JPLISAgent (Java Programming Language Instrumentation Services Agent), hỗ trợ việc gắn kết cho các dịch vụ gắn kết ngôn ngữ Java.
- **instrument** triển khai các phương thức Agent_OnLoad và Agent_OnAttach, có nghĩa là agent có thể được tải vào trong quá trình khởi động hoặc được tải vào trong quá trình chạy. Trong quá trình khởi động, agent có thể được tải vào gián tiếp thông qua cách như -javaagent: đường dẫn tới file jar. Trong quá trình chạy, việc tải động phụ thuộc vào cơ chế attach của JVM, thông qua việc gửi lệnh load để tải agent.
- **JVM Attach** là một tính năng của JVM cho phép giao tiếp giữa các tiến trình, cho phép một tiến trình gửi lệnh cho tiến trình khác và thực hiện một số hoạt động nội bộ, ví dụ như thực hiện thread dump, cần thực hiện jstack và truyền các tham số như pid cho luồng cần dump.

### Ví dụ về Java Agent

#### Chặn trước quá trình tải lớp Java

##### Dự án App

(1) Tạo một dự án Maven có tên `javacore-javaagent-app`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.hnv99</groupId>
    <artifactId>javacore-javaagent-app</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

</project>
```

(2) Tạo một lớp khởi chạy ứng dụng

```java
public class AppMain {

    public static void main(String[] args) {
        System.out.println("Khởi động ứng dụng!!!");
        AppInit.init();
    }

}
```

(3) Tạo một lớp mô phỏng quá trình khởi tạo ứng dụng

```java
public class AppInit {

    public static void init() {
        try {
            System.out.println("Đang khởi tạo ứng dụng...");
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

}
```

(4) Kết quả đầu ra

```
Khởi động ứng dụng!!!
Đang khởi tạo ứng dụng...
```

##### Dự án Agent

(1) Tạo một dự án Maven có tên `javacore-javaagent-agent`

```java
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://maven.apache.org/POM/4.0.0"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>io.github.dunwu.javacore</groupId>
  <artifactId>javacore-javaagent-agent</artifactId>
  <version>1.0.1</version>
  <name>JavaCore :: JavaAgent :: Agent</name>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <java.version>1.8</java.version>
    <maven.compiler.source>${java.version}</maven.compiler.source>
    <maven.compiler.target>${java.version}</maven.compiler.target>
  </properties>

  <dependencies>
    <!--Gói công cụ javaagent-->
    <dependency>
      <groupId>org.javassist</groupId>
      <artifactId>javassist</artifactId>
      <version>3.26.0-GA</version>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.5.1</version>
        <!--Chỉ định phiên bản jdk cho việc biên dịch maven. Nếu không chỉ định, maven3 mặc định sử dụng jdk 1.5; maven2 mặc định sử dụng jdk 1.3-->
        <configuration>
          <source>8</source>
          <target>8</target>
        </configuration>
      </plugin>

      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-jar-plugin</artifactId>
        <version>3.2.0</version>
        <configuration>
          <archive>
            <!--Tự động thêm META-INF/MANIFEST.MF -->
            <manifest>
              <addClasspath>true</addClasspath>
            </manifest>
            <manifestEntries>
              <Menifest-Version>1.0</Menifest-Version>
              <Premain-Class>io.github.dunwu.javacore.javaagent.RunTimeAgent</Premain-Class>
              <Can-Redefine-Classes>true</Can-Redefine-Classes>
              <Can-Retransform-Classes>true</Can-Retransform-Classes>
            </manifestEntries>
          </archive>
        </configuration>
      </plugin>
    </plugins>
  </build>
</project>
```

(2) Tạo một lớp khởi chạy Agent

```java
public class RunTimeAgent {

    public static void premain(String arg, Instrumentation instrumentation) {
        System.out.println("Khởi động chương trình chặn trước quá trình tải lớp!!!");
        System.out.println("Tham số truyền vào của chương trình chặn trước quá trình tải lớp: " + arg);
        instrumentation.addTransformer(new RunTimeTransformer());
    }
}
```

Ở đây, mỗi lần tải lớp, chúng ta sẽ đi qua phương thức này, chúng ta có thể chỉ định lớp cần chặn bằng cách sử dụng className, sau đó sử dụng công cụ javassist để xử lý lớp. Ý tưởng ở đây tương tự như reflection, nhưng mạnh mẽ hơn về khả năng sửa đổi bytecode.

(3) Sử dụng javassist để chặn lớp chỉ định và tăng cường mã

```java
package com.hnv99.javacore.javaagent;

import javassist.ClassPool;
import javassist.CtClass;
import javassist.CtMethod;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.IllegalClassFormatException;
import java.security.ProtectionDomain;

public class RunTimeTransformer implements ClassFileTransformer {

    private static final String INJECTED_CLASS = "com.hnv99.javacore.javaagent.AppInit";

    @Override
    public byte[] transform(ClassLoader loader, String className, Class<?> classBeingRedefined,
                            ProtectionDomain protectionDomain, byte[] classfileBuffer) throws IllegalClassFormatException {
        String realClassName = className.replace("/", ".");
        if (realClassName.equals(INJECTED_CLASS)) {
            System.out.println("Lớp bị chặn: " + realClassName);
            CtClass ctClass;
            try {
                // Sử dụng javassist để lấy lớp bytecode
                ClassPool classPool = ClassPool.getDefault();
                ctClass = classPool.get(realClassName);

                // Lấy tất cả các phương thức của lớp và tăng cường mã
                CtMethod[] declaredMethods = ctClass.getDeclaredMethods();
                for (CtMethod method : declaredMethods) {
                    System.out.println("Phương thức bị chặn: " + method.getName());
                    method.addLocalVariable("time", CtClass.longType);
                    method.insertBefore("System.out.println(\"---Bắt đầu thực thi---\");");
                    method.insertBefore("time = System.currentTimeMillis();");
                    method.insertAfter("System.out.println(\"---Kết thúc thực thi---\");");
                    method.insertAfter("System.out.println(\"Thời gian chạy: \" + (System.currentTimeMillis() - time));");
                }
                return ctClass.toBytecode();
            } catch (Throwable e) { // Ở đây phải sử dụng Throwable, không sử dụng Exception
                System.out.println(e.getMessage());
                e.printStackTrace();
            }
        }
        return classfileBuffer;
    }

}

```

(4) Kết quả đầu ra

Chỉ định tham số VM `-javaagent:/Users/kirito4499/Desktop/Learn/Java/javacore-javaagent-agent/target/javacore-javaagent-agent-1.0-SNAPSHOT.jar=hello`, chạy AppMain

```
Khởi động chương trình chặn trước quá trình tải lớp!!!
Tham số truyền vào của chương trình chặn trước quá trình tải lớp: hello
Khởi động ứng dụng!!!
Lớp bị chặn: io.github.dunwu.javacore.javaagent.AppInit
Phương thức bị chặn: init
---Bắt đầu thực thi---
Đang khởi tạo ứng dụng...
---Kết thúc thực thi---
Thời gian chạy: 1014
```

#### Chặn trong quá trình chạy (JDK 1.6 trở lên)

Làm thế nào để thực hiện sửa đổi bytecode động trong quá trình chạy chương trình?

Để thực hiện sửa đổi bytecode động, chúng ta cần phụ thuộc vào công cụ JVM mà JDK cung cấp cho chúng ta, đó là Attach, thông qua nó để tải chương trình đại diện của chúng ta.

Trước tiên, chúng ta cần định nghĩa một phương thức có tên là agentmain trong chương trình đại diện của chúng ta, nó có thể giống với premain mà chúng ta đã đề cập ở trên, hoặc có thể phát triển theo logic của riêng mình dựa trên tính năng của agentmain.

```java
/**
 * agentmain được khởi chạy sau khi main bắt đầu chạy (phụ thuộc vào cơ chế Attach)
 */
public class RunTimeAgent {

    public static void agentmain(String arg, Instrumentation instrumentation) {
        System.out.println("Khởi động chương trình chặn trong quá trình chạy!!!");
        System.out.println("Tham số truyền vào của chương trình chặn trong quá trình chạy: " + arg);
        instrumentation.addTransformer(new RunTimeTransformer());
    }
}
```

Tiếp theo, chúng ta cần cấu hình để cho nó biết rằng chương trình đại diện của chúng ta cần được tải, trong Maven, chúng ta có thể cấu hình như sau, tương tự với tệp META-INF/MANIFEST.MF.

```xml
<!--<Premain-Class>com.zhj.agent.agentmain.RunTimeAgent</Premain-Class>-->
<Agent-Class>com.zhj.agent.agentmain.RunTimeAgent</Agent-Class>
```

Thực tế, chúng ta đã hoàn thành việc cải tiến chương trình đại diện của chúng ta. Sau đó, chúng ta cần chèn một số mã vào phương thức main của chương trình mục tiêu để nó có thể đọc chương trình đại diện của chúng ta, từ đó chúng ta không cần cấu hình tham số JVM mà vẫn có thể tải chương trình đại diện.

```java
public class APPMain {

    public static void main(String[] args) {
        System.out.println("Khởi động ứng dụng!!!");
        for (VirtualMachineDescriptor vmd : VirtualMachine.list()) {
            // Chỉ tải chương trình đại diện cho VM đã chỉ định
            if (true) {
                System.out.println("VM này là VM đại diện đã chỉ định");
                System.out.println(vmd.displayName());
                try {
                    VirtualMachine vm = VirtualMachine.attach(vmd.id());
                    vm.loadAgent("D:/Code/java/idea_project/agent-test/runtime-agent/target/runtime-agent-1.0-SNAPSHOT.jar=hello");
                    vm.detach();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        AppInit.init();
    }
}
```

Ở đây, VirtualMachine là một lớp trong gói công cụ JDK, nếu biến môi trường hệ thống không được cấu hình, bạn cần tự đưa nó vào Maven.

```xml
<dependency>
    <groupId>com.sun</groupId>
    <artifactId>tools</artifactId>
    <version>1.8</version>
    <scope>system</scope>
	<systemPath>/Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home/lib/tools.jar</systemPath>
</dependency>
```

Như vậy, chúng ta đã hoàn thành một ví dụ đơn giản về việc sửa đổi bytecode động trong quá trình chạy chương trình.

## Công cụ bytecode

- [jclasslib](https://plugins.jetbrains.com/plugin/9248-jclasslib-bytecode-viewer) - Plugin cho IDEA, cho phép xem thông tin lớp, hằng số, vùng phương thức và các thông tin khác của bytecode hiện tại.
- [classpy](https://github.com/zxh0/classpy) - Classpy là một công cụ GUI để nghiên cứu các tệp lớp Java, khối nhị phân Lua, mã nhị phân Wasm và các định dạng tệp nhị phân khác.
- [ASM ByteCode Outline](https://plugins.jetbrains.com/plugin/5918-asm-bytecode-outline) - Khi viết bytecode bằng tay với ASM, bạn cần sử dụng một loạt các phương thức visitXXXXInsn() để viết các hướng dẫn tương ứng. Vì vậy, bạn cần chuyển mỗi dòng mã nguồn thành một hướng dẫn, sau đó chuyển đổi cú pháp ASM thành visitXXXXInsn(). Điều đầu tiên là chuyển mã nguồn thành hướng dẫn đã đủ phức tạp, nếu bạn không quen với tập hợp hướng dẫn bytecode, bạn cần biên dịch mã nguồn và sau đó giải mã để có được các hướng dẫn tương ứng. Thứ hai là cách truyền tham số khi viết bytecode bằng ASM cũng là một vấn đề khó khăn. Cộng đồng ASM cũng nhận thức được hai vấn đề này, vì vậy họ cung cấp công cụ này.
