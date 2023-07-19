---
title: JVM Class Loader
tags: [java, javase, jvm]
categories: [java, javase, jvm]
date created: 2023-07-19
date modified: 2023-07-19
---

# Quá trình tải lớp JVM

## Cơ chế tải lớp

> Lớp được tải vào trong quá trình chạy.

Tải lớp đề cập đến việc đọc dữ liệu nhị phân từ tệp `.class` của lớp vào bộ nhớ, đặt nó trong phần dữ liệu chạy thời gian của khu vực phương thức, sau đó tạo một đối tượng `java.lang.Class` trong heap, được sử dụng để đóng gói cấu trúc dữ liệu của lớp trong khu vực phương pháp và cung cấp một giao diện cho người lập trình Java để truy cập vào cấu trúc dữ liệu trong khu vực phương pháp.

Lớp không cần phải chờ đến khi lớp được "sử dụng lần đầu tiên một cách chủ động" mới tải nó, quy định của JVM cho phép bộ tải lớp tải lớp trước khi dự đoán một lớp sẽ được sử dụng. Nếu trong quá trình tải trước, tệp `.class` bị thiếu hoặc có lỗi, bộ tải lớp phải báo cáo lỗi chỉ khi lớp được sử dụng lần đầu tiên bởi chương trình (lỗi LinkageError). Nếu lớp không bao giờ được sử dụng bởi chương trình, bộ tải lớp sẽ không báo cáo lỗi.

## Vòng đời của lớp

![class-life-cycle](https://raw.githubusercontent.com/vanhung4499/images/master/snap/JVMCLassLifeCycle.png)

Vòng đời đầy đủ của lớp Java bao gồm các giai đoạn sau:

- **Tải (Loading)**
- **Liên kết (Linking)**
	- **Xác minh (Verification)**
	- **Chuẩn bị (Preparation)**
	- **Giải quyết (Resolution)**
- **Khởi tạo (Initialization)**
- **Sử dụng (Using)**
- **Hủy (Unloading)**

Quá trình tải, liên kết, chuẩn bị, giải quyết và khởi tạo 5 giai đoạn này là có thứ tự cố định. Quá trình tải lớp phải bắt đầu theo thứ tự này. Trong một số trường hợp, quá trình giải quyết có thể bắt đầu sau giai đoạn khởi tạo để hỗ trợ việc ràng buộc động trong Java.

Quá trình tải lớp đề cập đến việc tải, xác minh, chuẩn bị, giải quyết và khởi tạo lớp.

### (1) Tải

Tải là một giai đoạn của quá trình tải lớp, hãy chú ý không nhầm lẫn.

**Tải, đề cập đến việc tìm kiếm dòng byte và tạo lớp dựa trên nó**.

Quá trình tải hoàn thành ba công việc sau:

- Sử dụng tên đầy đủ của một lớp để lấy dòng byte mô tả lớp này.
- Chuyển đổi cấu trúc lưu trữ tĩnh này thành cấu trúc lưu trữ thời gian chạy của khu vực phương pháp.
- Tạo một đối tượng `Class` trong bộ nhớ, đại diện cho cấu trúc dữ liệu của lớp trong khu vực phương pháp và cung cấp một giao diện để truy cập vào cấu trúc dữ liệu trong khu vực phương pháp.

Dòng byte có thể được lấy từ các nguồn sau:

- Đọc từ gói ZIP, điều này rất phổ biến và cuối cùng trở thành cơ sở cho các định dạng JAR, EAR, WAR trong tương lai.
- Lấy từ mạng, trường hợp sử dụng phổ biến nhất là Applet.
- Sinh ra trong quá trình tính toán, trường hợp sử dụng phổ biến nhất là kỹ thuật đại diện động, trong `java.lang.reflect.Proxy`, sử dụng `ProxyGenerator.generateProxyClass` để sinh ra dòng byte của lớp đại diện.
- Được tạo ra từ các tệp khác, trường hợp sử dụng phổ biến là ứng dụng JSP, nghĩa là tạo lớp từ tệp JSP.
- Đọc từ cơ sở dữ liệu, trường hợp này ít phổ biến, ví dụ: một số máy chủ trung gian (như SAP Netweaver) có thể chọn cài đặt chương trình vào cơ sở dữ liệu để phân phối mã chương trình giữa các cụm.

### (2) Xác minh

Xác minh là bước đầu tiên của giai đoạn liên kết. **Mục tiêu của việc xác minh là đảm bảo dữ liệu nhị phân của tệp Class chứa thông tin phù hợp với yêu cầu của máy ảo hiện tại và không gây nguy hiểm cho bảo mật của máy ảo**.

Giai đoạn xác minh chủ yếu hoàn thành 4 giai đoạn kiểm tra sau:

- **Xác minh định dạng tệp** - Xác minh xem dòng byte có tuân theo định dạng tệp Class không và có thể được xử lý bởi phiên bản máy ảo hiện tại không.
- **Xác minh dữ liệu siêu dữ liệu** - Phân tích cú pháp thông tin mô tả byte code để đảm bảo rằng thông tin mô tả này tuân theo yêu cầu của ngôn ngữ Java.
- **Xác minh byte code** - Sử dụng phân tích dữ liệu luồng và dữ liệu điều khiển để đảm bảo rằng cú pháp của chương trình hợp lệ và tuân thủ luật lệ của ngôn ngữ.
- **Xác minh tham chiếu biểu tượng** - Xảy ra khi máy ảo chuyển đổi tham chiếu biểu tượng thành tham chiếu trực tiếp, kiểm tra tính phù hợp của thông tin ngoài lớp (tham chiếu biểu tượng) với thông tin trong lớp (tham chiếu trực tiếp).

Giai đoạn xác minh là rất quan trọng, nhưng không bắt buộc, nó không ảnh hưởng đến quá trình chạy của chương trình, nếu lớp được xác minh nhiều lần, bạn có thể xem xét việc tắt hầu hết các biện pháp xác minh lớp bằng cách sử dụng tham số `-Xverifynone` để rút ngắn thời gian tải lớp của máy ảo.

### (3) Chuẩn bị

**Biến lớp là các biến được đánh dấu bằng static, giai đoạn chuẩn bị là để phân bổ bộ nhớ cho biến lớp và khởi tạo giá trị mặc định, sử dụng bộ nhớ của khu vực phương pháp**.

Các biến thể không được phân bổ bộ nhớ trong giai đoạn này, chúng sẽ được phân bổ cùng với việc khởi tạo đối tượng khi đối tượng được khởi tạo (khởi tạo không phải là quá trình tải lớp, quá trình tải lớp xảy ra trước tất cả các hoạt động khởi tạo và chỉ xảy ra một lần, khởi tạo có thể xảy ra nhiều lần).

Giá trị khởi tạo thường là giá trị 0, ví dụ biến lớp value được khởi tạo là 0 chứ không phải là 123.

```java
public static int value = 123;
```

Nếu biến lớp là hằng số, thì sẽ được khởi tạo theo biểu thức, chứ không phải là gán bằng 0.

```java
public static final int value = 123;
```

Giai đoạn chuẩn bị cần lưu ý các điểm sau:

- Chỉ cần phân bổ bộ nhớ cho biến lớp (static), không phải là biến thể, biến thể sẽ được phân bổ cùng với đối tượng khi đối tượng được khởi tạo trong Java Heap.
- Giá trị khởi tạo thường là giá trị mặc định của kiểu dữ liệu (ví dụ: `0`, `0L`, `null`, `false`), không phải là giá trị được gán một cách rõ ràng trong mã Java.

Giả sử một biến lớp được định nghĩa là: `public static int value = 3`；

Lúc này, giá trị của biến value sau giai đoạn chuẩn bị là 0, không phải là 3, vì lúc này chưa bắt đầu thực thi bất kỳ phương thức Java nào, và việc gán giá trị 3 cho value thông qua chỉ thị `public static` sẽ được thực hiện trong phương thức khởi tạo của lớp `（）`，vì vậy hành động gán giá trị 3 cho value sẽ được thực hiện trong giai đoạn khởi tạo.

> Cần chú ý các điểm sau:
>
> - Đối với kiểu dữ liệu cơ bản, đối với biến lớp (static) và biến toàn cục, nếu không gán giá trị một cách rõ ràng và sử dụng trực tiếp, hệ thống sẽ gán giá trị mặc định cho nó, trong khi đối với biến cục bộ, cần gán giá trị một cách rõ ràng trước khi sử dụng, nếu không, việc biên dịch sẽ không thành công.
> - Đối với kiểu dữ liệu tham chiếu, chẳng hạn như tham chiếu mảng, tham chiếu đối tượng, nếu không sử dụng trực tiếp, hệ thống sẽ gán giá trị mặc định cho nó, tức là null.
> - Nếu không gán giá trị cho các phần tử trong mảng khi khởi tạo mảng, thì các phần tử trong mảng sẽ được gán giá trị mặc định tương ứng với kiểu dữ liệu của chúng.

- Nếu trường thuộc tính của lớp có thuộc tính `ConstantValue` trong bảng thuộc tính của trường, tức là đồng thời được đánh dấu bằng final và static, thì trong giai đoạn chuẩn bị, biến value sẽ được khởi tạo thành giá trị được chỉ định bởi thuộc tính ConstValue.

Giả sử biến lớp value được định nghĩa là: `public static final int value = 3`；

Khi biên dịch, Javac sẽ tạo thuộc tính ConstantValue cho value, trong giai đoạn chuẩn bị, máy ảo sẽ khởi tạo value thành 3 dựa trên cài đặt của thuộc tính `ConstantValue`. Chúng ta có thể hiểu rằng hằng số static final trong quá trình biên dịch đã đưa kết quả vào hằng số của lớp gọi nó.

### (4) Giải quyết

Trước khi tệp `.class` được tải vào JVM, lớp không thể biết địa chỉ cụ thể của các lớp và phương thức, trường hợp thậm chí không biết địa chỉ của chính nó. Do đó, mỗi khi cần tham chiếu đến các thành viên này, trình biên dịch Java sẽ tạo ra một tham chiếu biểu tượng. Trong quá trình chạy, tham chiếu biểu tượng này thường có thể xác định một cách chính xác đến mục tiêu.

Giải quyết là giai đoạn để thay thế các tham chiếu biểu tượng trong bộ nhớ hằng số bằng các tham chiếu trực tiếp. Giải quyết chủ yếu áp dụng cho 7 loại tham chiếu biểu tượng: lớp hoặc giao diện, trường, phương thức lớp, phương thức giao diện, kiểu phương thức, xử lý phương thức và bộ giới hạn điểm gọi.

- **Tham chiếu biểu tượng (Symbolic References)** - Tham chiếu biểu tượng mô tả một tập hợp các biểu tượng tham chiếu và được sử dụng để chỉ định mục tiêu tham chiếu.
- **Tham chiếu trực tiếp (Direct References)** - Tham chiếu trực tiếp có thể là con trỏ trực tiếp đến mục tiêu, địa chỉ tương đối hoặc một con trỏ có thể xác định mục tiêu một cách gián tiếp.

### (5) Khởi tạo

Trong mã Java, nếu muốn khởi tạo một trường tĩnh, bạn có thể gán giá trị trực tiếp khi khai báo hoặc gán giá trị trong khối mã tĩnh.

Nếu trường tĩnh được gán giá trị trực tiếp và được đánh dấu là `final`, và kiểu dữ liệu của nó là kiểu cơ bản hoặc chuỗi, thì trường này sẽ được trình biên dịch Java đánh dấu là giá trị hằng số (ConstantValue) và quá trình khởi tạo sẽ được JVM thực hiện. Ngoài ra, các phép gán trực tiếp khác và tất cả các khối mã tĩnh sẽ được trình biên dịch Java đặt trong một phương thức duy nhất và đặt tên là `<clinit>`.

Khởi tạo là giai đoạn thực sự thực hiện mã chương trình được định nghĩa trong lớp. **Khởi tạo, gán giá trị ban đầu chính xác cho biến lớp, JVM chịu trách nhiệm khởi tạo lớp, chủ yếu là khởi tạo biến lớp**.

#### Cách khởi tạo lớp

- Gán giá trị ban đầu khi khai báo biến lớp.
- Sử dụng khối mã tĩnh để gán giá trị cho biến lớp.

> Trong giai đoạn chuẩn bị, biến lớp đã được gán giá trị theo yêu cầu của hệ thống, trong khi trong giai đoạn khởi tạo, biến lớp và các nguồn tài nguyên khác sẽ được khởi tạo theo kế hoạch chủ quan được quy định bởi lập trình viên thông qua chương trình.

#### Bước khởi tạo lớp

1. Nếu lớp chưa được tải và liên kết, bắt đầu tải lớp này.
2. Nếu lớp cha của lớp này chưa được khởi tạo, hãy khởi tạo lớp cha trước.
3. Nếu lớp này có câu lệnh khởi tạo, hãy thực hiện các câu lệnh khởi tạo này theo thứ tự.

#### Thời điểm khởi tạo lớp

Chỉ khi lớp được chủ động tham chiếu mới gây ra việc khởi tạo lớp.

**(1) Tham chiếu chủ động**

Tham chiếu chủ động của lớp bao gồm sáu trường hợp sau:

- **Tạo một phiên bản của lớp** - cũng là `new` đối tượng
- **Truy cập biến tĩnh** - truy cập biến tĩnh của một lớp hoặc giao diện hoặc gán giá trị cho biến tĩnh đó
- **Truy cập phương thức tĩnh**
- **Phản chiếu** - như `Class.forName("com.shengsiyuan.Test")`
- **Khởi tạo lớp con** - khởi tạo một lớp con của một lớp, lớp cha cũng sẽ được khởi tạo
- **Lớp khởi động** - lớp được đánh dấu là lớp khởi động của máy ảo Java (Java Test), được sử dụng trực tiếp bằng cách sử dụng lệnh `java.exe` để chạy một lớp chính

**(2) Tham chiếu bị động**

Ngoài sáu trường hợp trên, tất cả các cách tham chiếu lớp khác đều không gây ra việc khởi tạo lớp, được gọi là tham chiếu bị động. Ví dụ về tham chiếu bị động bao gồm:

- **Tham chiếu trường của lớp cha bằng lớp con, không gây ra việc khởi tạo lớp con**。

```java
System.out.println(SubClass.value); // value là trường được định nghĩa trong SuperClass
```

- **Tham chiếu lớp thông qua mảng, không gây ra việc khởi tạo lớp**。Quá trình này sẽ khởi tạo lớp mảng, lớp mảng là một lớp con của `Object` được tạo tự động bởi máy ảo, nó chứa các thuộc tính và phương thức của mảng.

```java
SuperClass[] sca = new SuperClass[10];
```

- Hằng số được lưu trong bộ nhớ hằng số của lớp gọi, không gây ra việc khởi tạo lớp gọi。

```java
System.out.println(ConstClass.HELLOWORLD);
```

#### Chi tiết khởi tạo lớp

Phương thức `<clinit>()` của lớp có các chi tiết sau:

- Được tự động thu thập bởi trình biên dịch các hoạt động gán giá trị cho tất cả các biến lớp và các câu lệnh trong khối mã tĩnh (`static {}`) thành một phương thức, trình biên dịch thu thập theo thứ tự xuất hiện trong tệp nguồn. Đặc biệt cần lưu ý rằng khối mã tĩnh chỉ có thể truy cập các biến lớp được định nghĩa trước nó, các biến lớp được định nghĩa sau nó chỉ có thể được gán giá trị, không thể truy cập. Ví dụ mã sau:

```java
public class Test {
    static {
        i = 0;                // Gán giá trị cho biến có thể biên dịch thành công
        System.out.print(i);  // Dòng này sẽ báo lỗi "illegal forward reference" từ trình biên dịch
    }
    static int i = 1;
}
```

- Khác với phương thức khởi tạo (`<init>()`), không cần gọi rõ ràng phương thức khởi tạo của lớp cha. Máy ảo sẽ đảm bảo rằng phương thức `<clinit>()` của lớp cha đã kết thúc trước khi phương thức `<clinit>()` của lớp con bắt đầu. Do đó, lớp đầu tiên thực hiện phương thức `<clinit>()` là lớp `java.lang.Object`.
- Vì phương thức khởi tạo `<clinit>()` chỉ được thực hiện một lần, nên lớp không cần phải gọi phương thức khởi tạo của lớp cha. Ví dụ mã sau:

```java
static class Parent {
    public static int A = 1;
    static {
        A = 2;
    }
}

static class Sub extends Parent {
    public static int B = A;
}

public static void main(String[] args) {
     System.out.println(Sub.B);  // Kết quả in ra là giá trị của biến A trong lớp cha, tức là 2.
}
```

- Phương thức `<clinit>()` không bắt buộc cho các lớp hoặc giao diện, nếu một lớp không chứa khối mã tĩnh, cũng không có gán giá trị cho biến lớp, trình biên dịch có thể không tạo phương thức `<clinit>()`.
- Giao diện không thể sử dụng khối mã tĩnh, nhưng vẫn có khởi tạo biến lớp, do đó, giao diện và lớp giải quyết trong quá trình khởi tạo không cần phải thực hiện phương thức `<clinit>()` của giao diện. Ngoài ra, các lớp thực hiện giao diện cũng không thực hiện phương thức `<clinit>()` của giao diện.
- Máy ảo sẽ đảm bảo rằng phương thức `<clinit>()` của một lớp được khóa và đồng bộ đúng trong môi trường đa luồng. Nếu nhiều luồng cùng khởi tạo một lớp, chỉ có một luồng thực hiện phương thức `<clinit>()`, các luồng khác sẽ bị chặn và chờ đợi cho đến khi luồng hoạt động hoàn tất phương thức `<clinit>()`. Nếu có một hoạt động tốn thời gian trong phương thức `<clinit>()`, nó có thể gây ra nhiều luồng bị chặn trong quá trình thực hiện thực tế này.

# ClassLoader

`ClassLoader` là một lớp trong JVM (Java Virtual Machine) có trách nhiệm tải các lớp vào JVM. Nó cho phép ứng dụng tự quyết định cách để lấy các lớp cần thiết.

JVM tải các file `class` vào bộ nhớ theo hai cách:

- Tải ẩn - JVM tự động tải các lớp cần thiết vào bộ nhớ.
- Tải hiển thị - Sử dụng `ClassLoader` để tải một lớp vào bộ nhớ.

### Class và ClassLoader

Cách xác định hai lớp có giống nhau hay không: Lớp chính là như nhau và được tải bởi cùng một `ClassLoader`. Điều này có nghĩa là lớp được tải bởi cùng một `ClassLoader` và có thể được coi là giống nhau.

Sự giống nhau bao gồm việc sử dụng phương thức `equals()` của đối tượng `Class` và phương thức `isAssignableFrom()` và `isInstance()` trả về true, cũng như sử dụng từ khóa `instanceof` để kiểm tra quan hệ sở hữu đối tượng.

### Phân loại ClassLoader

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230719172338.png)

#### Bootstrap ClassLoader

`Bootstrap ClassLoader` là ClassLoader khởi động, nó **chịu trách nhiệm tải các lớp cần thiết cho JVM**.

`Bootstrap ClassLoader` sẽ tải các thư viện lớp được lưu trữ trong thư mục `<JAVA_HOME>\lib` hoặc được chỉ định bởi tham số `-Xbootclasspath` và chỉ tải các thư viện lớp mà JVM nhận dạng (dựa trên tên tệp, ví dụ: rt.jar, các tệp không phù hợp với tên sẽ không được tải).

`Bootstrap ClassLoader` được triển khai bằng C++, nó hoàn toàn được JVM kiểm soát và không thể được tham chiếu trực tiếp bởi chương trình Java. Khi viết ClassLoader tùy chỉnh, nếu bạn muốn gửi yêu cầu tải đến `Bootstrap ClassLoader`, bạn có thể sử dụng `null` thay thế.

#### ExtClassLoader

`ExtClassLoader` là ClassLoader mở rộng, nó được triển khai bởi `ExtClassLoader(sun.misc.Launcher\$ExtClassLoader)`.

`ExtClassLoader` chịu trách nhiệm tải các thư viện lớp từ thư mục `<JAVA_HOME>\lib\ext` hoặc được chỉ định bởi biến môi trường `java.ext.dir` của hệ thống.

#### AppClassLoader

`AppClassLoader` là ClassLoader ứng dụng, nó được triển khai bởi `AppClassLoader(sun.misc.Launcher\$AppClassLoader)`. Vì vậy, `AppClassLoader` là giá trị trả về của phương thức `getSystemClassLoader()` trong lớp `ClassLoader` và thường được gọi là ClassLoader hệ thống.

`AppClassLoader` chịu trách nhiệm tải các thư viện lớp từ đường dẫn của lớp người dùng (classpath). Nếu không có ClassLoader tùy chỉnh trong ứng dụng, `AppClassLoader` thường là ClassLoader mặc định trong chương trình.

#### ClassLoader tùy chỉnh

ClassLoader tùy chỉnh có thể thực hiện các nhiệm vụ sau:

- Tự động xác minh chữ ký số trước khi thực thi mã không đáng tin cậy.
- Tạo động các lớp xây dựng tùy chỉnh phù hợp với nhu cầu cụ thể của người dùng.
- Lấy lớp Java từ một vị trí cụ thể, chẳng hạn như cơ sở dữ liệu hoặc mạng.

Giả sử chúng ta muốn tạo một ClassLoader tùy chỉnh có tên là `FileSystemClassLoader` kế thừa từ `java.lang.ClassLoader`, được sử dụng để tải các lớp từ hệ thống tệp. Đầu tiên, nó sẽ tìm kiếm tệp mã byte của lớp dựa trên tên đầy đủ của lớp trên hệ thống tệp, sau đó đọc nội dung của tệp, cuối cùng sử dụng phương thức `defineClass()` để chuyển đổi các mã byte này thành một đối tượng `java.lang.Class`.

Phương thức `loadClass()` của lớp `java.lang.ClassLoader` thực hiện logic của mô hình giao nhận cha đôi, do đó ClassLoader tùy chỉnh thường không ghi đè phương thức này, mà thay vào đó ghi đè phương thức `findClass()`.

ClassLoader thường được sử dụng trong các tình huống sau:

- Container - Ứng dụng điển hình: Servlet container (ví dụ: Tomcat, Jetty), udf (Mysql, Hive) và nhiều hơn nữa. Tải và giải nén tệp JAR hoặc WAR, sau đó tải các lớp của nó vào ClassLoader cụ thể để chạy (thường cần xem xét cách cô lập không gian).
- Triển khai nóng (Hot Deploy), cắm nóng (Hot Plug) - Khởi động ứng dụng và sau đó động lấy thông tin về một lớp, sau đó tải nó vào JVM. Nhiều phần mềm, framework nổi tiếng, khung (ví dụ: Spring) sử dụng ClassLoader để triển khai nóng của chính nó.

【Ví dụ】Tạo một ClassLoader tùy chỉnh

```java
public class FileSystemClassLoader extends ClassLoader {

    private String rootDir;

    public FileSystemClassLoader(String rootDir) {
        this.rootDir = rootDir;
    }

    protected Class<?> findClass(String name) throws ClassNotFoundException {
        byte[] classData = getClassData(name);
        if (classData == null) {
            throw new ClassNotFoundException();
        } else {
            return defineClass(name, classData, 0, classData.length);
        }
    }

    private byte[] getClassData(String className) {
        String path = classNameToPath(className);
        try {
            InputStream ins = new FileInputStream(path);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            int bufferSize = 4096;
            byte[] buffer = new byte[bufferSize];
            int bytesNumRead;
            while ((bytesNumRead = ins.read(buffer)) != -1) {
                baos.write(buffer, 0, bytesNumRead);
            }
            return baos.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    private String classNameToPath(String className) {
        return rootDir + File.separatorChar
                + className.replace('.', File.separatorChar) + ".class";
    }
}
```

### Delegation Model

Trước khi hiểu về Delegation Model, hãy xem một ví dụ.

【Ví dụ】Tìm kiếm lớp tải

```java
public static void main(String[] args) {
    ClassLoader loader = Thread.currentThread().getContextClassLoader();
    System.out.println(loader);
    System.out.println(loader.getParent());
    System.out.println(loader.getParent().getParent());
}
```

Kết quả:

```
sun.misc.Launcher$AppClassLoader@18b4aac2
sun.misc.Launcher$ExtClassLoader@19e1023e
null
```

Kết quả trên cho thấy không có `ExtClassLoader` cha, nguyên nhân là `Bootstrap Loader` (lớp tải khởi động) được triển khai bằng C, không tìm thấy cách trả về chính xác của cha Loader, do đó trả về null.

Hình ảnh dưới đây hiển thị mối quan hệ giữa các ClassLoader, được gọi là Delegation Model của ClassLoader. **Delegation Model yêu cầu tất cả các ClassLoader, ngoại trừ Bootstrap ClassLoader, đều có một ClassLoader cha của riêng mình**. **Mối quan hệ cha con giữa các ClassLoader thường được thực hiện thông qua mối quan hệ hợp thành (Composition), chứ không phải thông qua mối quan hệ kế thừa (Inheritance)**.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230719172838.png)

**（1）Quá trình làm việc**

**Một ClassLoader trước tiên sẽ chuyển yêu cầu tải lớp đến ClassLoader cha, chỉ khi ClassLoader cha không thể hoàn thành yêu cầu tải lớp thì nó mới thử tải**.

**（2）Lợi ích**

**Làm cho các lớp Java có một mối quan hệ phân cấp ưu tiên với ClassLoader của chúng**, từ đó đảm bảo tính thống nhất của các lớp cơ bản:

- Ngăn chặn việc xuất hiện nhiều bản sao của bytecode cùng một lớp trong bộ nhớ
- Đảm bảo chương trình Java chạy một cách an toàn và ổn định

Ví dụ: `java.lang.Object` được lưu trữ trong rt.jar, nếu viết một lớp khác `java.lang.Object` và đặt nó trong `classpath`, chương trình vẫn có thể biên dịch thành công. Bởi vì sự tồn tại của mô hình ủy quyền cha mẹ, nên `Object` trong rt.jar có độ ưu tiên cao hơn `Object` trong `classpath`, vì `Object` trong rt.jar sử dụng ClassLoader khởi động, trong khi `Object` trong `classpath` sử dụng ClassLoader của ứng dụng. Chính vì `Object` trong rt.jar có độ ưu tiên cao hơn, nên tất cả các `Object` trong chương trình đều là `Object` này.

**（3）Thực hiện**

Dưới đây là đoạn mã trích dẫn của lớp trừu tượng `java.lang.ClassLoader`, quá trình chạy phương thức `loadClass()` như sau:

```java
public abstract class ClassLoader {
    // ClassLoader cha để ủy quyền
    private final ClassLoader parent;

    public Class<?> loadClass(String name) throws ClassNotFoundException {
        return loadClass(name, false);
    }

    protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException {
        synchronized (getClassLoadingLock(name)) {
            // Kiểm tra xem lớp đã được tải chưa
            Class<?> c = findLoadedClass(name);
            if (c == null) {
                // Nếu chưa được tải, ủy quyền cho ClassLoader cha hoặc ủy quyền cho ClassLoader khởi động
                try {
                    if (parent != null) {
                        // Nếu có ClassLoader cha, ủy quyền cho ClassLoader cha tải
                        c = parent.loadClass(name, false);
                    } else {
                        // Nếu không có ClassLoader cha, kiểm tra xem lớp có được tải bởi ClassLoader khởi động không, bằng cách gọi phương thức native Class findBootstrapClass(String name)
                        c = findBootstrapClassOrNull(name);
                    }
                } catch (ClassNotFoundException e) {
                    // Nếu ClassLoader cha không tải được, ném ClassNotFoundException
                }

                if (c == null) {
                    // Nếu cả ClassLoader cha và ClassLoader khởi động đều không thể hoàn thành nhiệm vụ tải, thì tự tải lớp
                    c = findClass(name);
                }
            }
            if (resolve) {
                resolveClass(c);
            }
            return c;
        }
    }

    protected Class<?> findClass(String name) throws ClassNotFoundException {
        throw new ClassNotFoundException(name);
    }
}
```

【Giải thích】

- Kiểm tra xem lớp đã được tải chưa, nếu chưa thì cho phép ClassLoader cha tải.
- Khi ClassLoader cha không thể tải được, ném ra `ClassNotFoundException`, lúc này thử tải bằng chính ClassLoader của mình.

### Tham số ClassLoader

Khi khởi động ứng dụng Java trên môi trường sản xuất, thường sẽ chỉ định một số tham số ClassLoader để tải các thư viện cần thiết cho ứng dụng:

```shell
java -jar xxx.jar -classpath lib/*
```

Các tùy chọn tham số ClassLoader liên quan:

| Tùy chọn tham số                             | Loại ClassLoader        | Giải thích                                                             |
| -------------------------------------------- | ----------------------- | --------------------------------------------------------------------- |
| `-Xbootclasspath`                            | `Bootstrap ClassLoader` | Thiết lập đường dẫn tìm kiếm của `Bootstrap ClassLoader`.【Ít sử dụng】   |
| `-Xbootclasspath/a`                          | `Bootstrap ClassLoader` | Thêm đường dẫn vào cuối danh sách tìm kiếm của `Bootstrap ClassLoader`.【Thường sử dụng】 |
| `-Xbootclasspath/p`                          | `Bootstrap ClassLoader` | Thêm đường dẫn vào đầu danh sách tìm kiếm của `Bootstrap ClassLoader`.【Ít sử dụng】 |
| `-Djava.ext.dirs`                            | `ExtClassLoader`        | Thiết lập đường dẫn tìm kiếm của `ExtClassLoader`.                      |
| `-Djava.class.path` hoặc `-cp` hoặc `-classpath` | `AppClassLoader`        | Thiết lập đường dẫn tìm kiếm của `AppClassLoader`.                      |

## Tải lớp

### Cách tải lớp

Có ba cách để tải lớp:

- Khi khởi động ứng dụng từ dòng lệnh, JVM sẽ tải lớp theo cách khởi tạo.
- Tải lớp động bằng phương thức `Class.forName()`.
- Tải lớp động bằng phương thức `ClassLoader.loadClass()`.

**Sự khác biệt giữa `Class.forName()` và `ClassLoader.loadClass()`**

- `Class.forName()` không chỉ tải file `.class` vào JVM, mà còn giải thích và thực thi các khối `static` trong lớp.
- `ClassLoader.loadClass()` chỉ tải file `.class` vào JVM mà không thực thi nội dung của khối `static`, chỉ khi gọi `newInstance()` mới thực thi khối `static`.
- `Class.forName(name, initialize, loader)` có thể điều khiển việc tải khối `static`. Chỉ khi gọi `newInstance()` mới gọi hàm khởi tạo và tạo đối tượng của lớp.

### Lỗi tải lớp

#### ClassNotFoundException

`ClassNotFoundException` là một lỗi phổ biến. **`ClassNotFoundException` đại diện cho việc không tìm thấy lớp cụ thể trong `classpath`**.

Nguyên nhân phổ biến:

- Gọi phương thức `forName()` của lớp `Class`, không tìm thấy lớp.
- Gọi phương thức `loadClass()` của `ClassLoader`, không tìm thấy lớp.
- Gọi phương thức `findSystemClass()` của `ClassLoader`, không tìm thấy lớp.

【Ví dụ】Chạy đoạn mã sau sẽ ném ra ngoại lệ `ClassNotFoundException`:

```java
public class ClassNotFoundExceptionDemo {
    public static void main(String[] args) {
        try {
            Class.forName("NotFound");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```

Cách khắc phục: Kiểm tra xem lớp có tồn tại trong `classpath` không.

#### NoClassDefFoundError

Nguyên nhân phổ biến:

- Lớp phụ thuộc không tồn tại.
- Tệp lớp tồn tại, nhưng nằm trong các lĩnh vực khác nhau.

Cách khắc phục: Trong dự án Java hiện đại, thường sử dụng các công cụ xây dựng như `maven`, `gradle` để quản lý dự án, hãy kiểm tra xem tệp lớp không tìm thấy nằm trong gói jar đã được thêm làm phụ thuộc hay chưa.

#### UnsatisfiedLinkError

Lỗi này không phổ biến, nhưng nếu xảy ra, thường là do xóa một thư viện trong JVM khi khởi động JVM.

【Ví dụ】Chạy đoạn mã sau sẽ ném ra lỗi `UnsatisfiedLinkError`.

```java
public class UnsatisfiedLinkErrorDemo {

    public native void nativeMethod();

    static {
        System.loadLibrary("NoLib");
    }

    public static void main(String[] args) {
        new UnsatisfiedLinkErrorDemo().nativeMethod();
    }

}
```

【Kết quả】

```java
java.lang.UnsatisfiedLinkError: no NoLib in java.library.path
	at java.lang.ClassLoader.loadLibrary(ClassLoader.java:1867)
	at java.lang.Runtime.loadLibrary0(Runtime.java:870)
	at java.lang.System.loadLibrary(System.java:1122)
	at com.hnv99.javacore.jvm.classloader.exception.UnsatisfiedLinkErrorDemo.<clinit>(UnsatisfiedLinkErrorDemo.java:12)
```

#### ClassCastException

`ClassCastException` thường xảy ra khi ép kiểu tường minh trong chương trình không thành công.

【Ví dụ】Chạy đoạn mã sau sẽ ném ra ngoại lệ `ClassCastException`.

```java
public class ClassCastExceptionDemo {

    public static void main(String[] args) {
        Object obj = new Object();
        EmptyClass newObj = (EmptyClass) obj;
    }

    static class EmptyClass {}

}
```

【Kết quả】

```java
Exception in thread "main" java.lang.ClassCastException: java.lang.Object cannot be cast to com.hnv99.javacore.jvm.classloader.exception.ClassCastExceptionDemo$EmptyClass
	at com.hnv99.javacore.jvm.classloader.exception.ClassCastExceptionDemo.main(ClassCastExceptionDemo.java:11)
```
