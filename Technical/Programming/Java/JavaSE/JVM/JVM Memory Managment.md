---
title: JVM Memory Managment
tags: [java, javase, jvm]
categories: [java, javase, jvm]
date created: 2023-07-18
date modified: 2023-07-18
---

# Quản lý bộ nhớ trong JVM

## Giới thiệu về bộ nhớ

### Bộ nhớ vật lý và bộ nhớ ảo

Bộ nhớ vật lý là RAM (Random Access Memory) mà chúng ta thường nói đến.

Bộ nhớ ảo cho phép nhiều tiến trình chạy đồng thời có thể chia sẻ bộ nhớ vật lý, tuy nhiên, việc chia sẻ chỉ diễn ra trên mặt không gian, các tiến trình vẫn được cô lập logic với nhau.

### Không gian kernel và không gian người dùng

Một máy tính thông thường thường có một không gian bộ nhớ cố định, nhưng các chương trình không thể sử dụng toàn bộ không gian này. Vì không gian này được chia thành không gian kernel và không gian người dùng, và các chương trình chỉ có thể sử dụng bộ nhớ trong không gian người dùng.

### Các thành phần Java sử dụng bộ nhớ

Sau khi Java được khởi động, nó chạy như một tiến trình trong hệ điều hành.

Các thành phần Java nào sử dụng bộ nhớ?

- Bộ nhớ Heap: Java Heap, lớp và trình tải lớp
- Bộ nhớ Stack: luồng
- Bộ nhớ cục bộ: NIO, JNI

## Các khu vực dữ liệu thời gian chạy

JVM trong quá trình thực thi chương trình Java sẽ chia bộ nhớ mà nó quản lý thành nhiều khu vực dữ liệu khác nhau. Các khu vực này có mục đích và thời gian tạo và hủy khác nhau, một số khu vực tồn tại khi quá trình JVM khởi động, trong khi một số khu vực khác được tạo và hủy bởi các luồng người dùng. Hình sau đây mô tả các khu vực dữ liệu thời gian chạy:

![JVM-memory-runtime-area.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/JVM-memory-runtime-area.png)

### Bộ đếm chương trình

**Bộ đếm chương trình (Program Counter Register)** là một vùng nhớ nhỏ, nó có thể coi là chỉ số dòng lệnh hiện tại đang được thực thi bởi luồng. Ví dụ, các nhánh, vòng lặp, nhảy, ngoại lệ, khôi phục luồng, v.v. đều phụ thuộc vào bộ đếm chương trình.

Khi số lượng luồng đang chạy vượt quá số lượng CPU, các luồng sẽ cạnh tranh với nhau để lấy tài nguyên CPU theo chu kỳ thời gian. Nếu một luồng hết thời gian, hoặc tài nguyên CPU của nó bị cướp trước khi hoàn thành, luồng này cần một bộ đếm chương trình riêng để ghi lại chỉ thị thực thi tiếp theo, từ đó có thể phục hồi đúng vị trí thực thi sau khi chuyển luồng. Các bộ đếm chương trình giữa các luồng không ảnh hưởng lẫn nhau, chúng được lưu trữ riêng biệt, chúng ta gọi khu vực bộ nhớ này là "riêng tư của luồng".

- Nếu luồng đang thực thi một phương thức Java, bộ đếm chương trình ghi lại địa chỉ của chỉ thị bytecode đang thực thi;
- Nếu luồng đang thực thi một phương thức Native, giá trị bộ đếm chương trình sẽ không xác định (Undefined).

> 🔔 Lưu ý: Khu vực này là duy nhất trong JVM mà không có trường hợp `OutOfMemoryError` nào được xác định.

### JVM Stack

**JVM Stack (Java Virtual Machine Stack)** cũng là riêng tư của luồng và có tuổi thọ bằng với luồng.

Mỗi phương thức Java được thực thi sẽ tạo ra một khung ngăn xếp (stack frame) thông tin như **bảng biến cục bộ**, **ngăn xếp toán hạng**, **tham chiếu hằng số** và nhiều thông tin khác. Mỗi phương thức từ cuộc gọi đến khi hoàn thành tương ứng với một khung ngăn xếp được thêm vào và loại bỏ khỏi JVM Stack.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230718105750.png)

- **Bảng biến cục bộ** - Dùng để lưu trữ các biến cục bộ, tham chiếu đối tượng, kiểu dữ liệu cơ bản, `ReturnAddress` và nhiều loại khác.
- **Ngăn xếp toán hạng - Được sử dụng bởi bộ máy thực thi dựa trên ngăn xếp, JVM sử dụng ngăn xếp toán hạng như một không gian làm việc, hầu hết các chỉ thị đều phải lấy dữ liệu từ đây, thực hiện phép tính và đẩy kết quả trở lại ngăn xếp.
- **Liên kết động** - Mỗi khung ngăn xếp chứa một tham chiếu đến phương thức mà khung ngăn xếp này thuộc về trong không gian hằng số thời gian chạy (một phần của không gian phương thức). Việc giữ tham chiếu này để hỗ trợ quá trình liên kết động trong quá trình gọi phương thức. Hằng số thời gian chạy của tệp lớp chứa rất nhiều tham chiếu biểu tượng, chỉ thị gọi phương thức trong bytecode sẽ có tham số là tham chiếu biểu tượng trong không gian hằng số. Một số tham chiếu biểu tượng sẽ được chuyển thành tham chiếu trực tiếp trong quá trình tải lớp hoặc khi sử dụng lần đầu tiên, quá trình này được gọi là phân giải tĩnh. Một số tham chiếu sẽ được chuyển thành tham chiếu trực tiếp trong mỗi lần chạy, quá trình này được gọi là liên kết động.
- **Điểm thoát khỏi phương thức** - Trả về vị trí phương thức đã được gọi, khôi phục biến cục bộ và ngăn xếp hoạt động của phương thức gọi. Nếu không có giá trị trả về, nó sẽ được đẩy vào ngăn xếp hoạt động của người gọi.

> 🔔 Lưu ý:
>
> Khu vực này có thể gây ra các ngoại lệ sau:
>
> - Nếu độ sâu ngăn xếp yêu cầu của luồng vượt quá giá trị tối đa, nó sẽ gây ra ngoại lệ `StackOverflowError`.
> - Nếu không thể mở rộng ngăn xếp Java Virtual Machine, không thể cấp phát đủ bộ nhớ, nó sẽ gây ra ngoại lệ `OutOfMemoryError`.

> 💡 Mẹo:
>
> Bạn có thể sử dụng tham số máy ảo `-Xss` để chỉ định kích thước ngăn xếp Java Virtual Machine của chương trình:
>
> ```java
> java -Xss=512M HackTheJava
> ```

### Ngăn xếp phương thức Native

**Ngăn xếp phương thức Native (Native Method Stack)** có chức năng tương tự như ngăn xếp Java Virtual Machine.

Sự khác biệt giữa hai ngăn xếp này là: **Ngăn xếp Java Virtual Machine phục vụ cho các phương thức Java, trong khi Ngăn xếp phương thức Native phục vụ cho các phương thức Native**. Phương thức Native không được viết bằng Java, mà được viết bằng ngôn ngữ C.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230718110417.png)

> 🔔 Lưu ý: Ngăn xếp phương thức Native cũng có thể gây ra ngoại lệ `StackOverflowError` và `OutOfMemoryError`.

### Java Heap

**Java Heap** được sử dụng để lưu trữ các đối tượng. Hầu hết các đối tượng trong Java đều được cấp phát bộ nhớ ở đây.

Java Heap là khu vực chính để thu gom rác (do đó còn được gọi là "GC Heap"). Hầu hết các bộ thu gom rác hiện đại đều sử dụng thuật toán thu gom theo thế hệ, trong đó mỗi đối tượng được xem xét bằng các thuật toán thu gom rác khác nhau.

Vì vậy, JVM chia Java Heap thành ba phần sau:

- **Thế hệ trẻ (Young Generation)**
  - `Eden` - Tỷ lệ giữa Eden và Survivor là 8:1
  - `From Survivor`
  - `To Survivor`
- **Thế hệ già (Old Generation)**
- **Thế hệ vĩnh viễn (Permanent Generation)**

Khi một đối tượng được tạo ra, nó sẽ được đưa vào thế hệ mới, sau đó có thể được chuyển sang thế hệ già. Thế hệ mới chứa nhiều đối tượng có tuổi thọ ngắn, do đó tần suất thu gom rác ở đây cao nhất.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230718110822.png)

> 🔔 Lưu ý: Java Heap không yêu cầu bộ nhớ liên tục và có thể mở rộng động, nếu mở rộng không thành công, nó sẽ gây ra ngoại lệ `OutOfMemoryError`.
>
> 💡 Mẹo: Bạn có thể sử dụng hai tham số máy ảo `-Xms` và `-Xmx` để chỉ định kích thước Java Heap của chương trình, tham số đầu tiên đặt giá trị khởi tạo, tham số thứ hai đặt giá trị tối đa.
>
> ```java
> java -Xms=1M -Xmx=2M HackTheJava
> ```

### Khu vực phương thức

Khu vực phương thức (Method Area) còn được gọi là vùng vĩnh viễn. **Khu vực phương thức được sử dụng để lưu trữ thông tin lớp đã được tải, hằng số, biến tĩnh, mã đã được biên dịch bởi trình biên dịch JIT và các dữ liệu khác**.

Mục tiêu chính của việc thu gom rác trong khu vực này là thu gom rác trong bộ nhớ hằng số và gỡ bỏ các lớp không cần thiết, nhưng thường khá khó thực hiện.

> 🔔 Lưu ý: Giống như Java Heap, khu vực này không yêu cầu bộ nhớ liên tục và có thể mở rộng động, nếu mở rộng không thành công, nó sẽ gây ra ngoại lệ `OutOfMemoryError`.
>
> 💡 Mẹo:
>
> - Trước JDK 1.7, HotSpot JVM xem khu vực này là vùng vĩnh viễn và thu gom rác. Bạn có thể sử dụng các tham số `-XX:PermSize` và `-XX:MaxPermSize` để đặt kích thước.
> - Sau JDK 1.8, khu vực vĩnh viễn đã bị loại bỏ và được thay thế bằng **`metaspace (vùng dữ liệu)`**. Bạn có thể sử dụng tham số `-XX:MaxMetaspaceSize` để đặt kích thước.

### Bảng hằng số thời gian chạy

**`Bảng hằng số thời gian chạy (Runtime Constant Pool)` là một phần của khu vực phương thức** trong không gian phương thức. Trong tệp Class, ngoài thông tin về phiên bản lớp, trường, phương thức, giao diện, còn có một mục thông tin khác là bảng hằng số (Constant Pool Table), **được sử dụng để lưu trữ các literal và tham chiếu tượng trưng được tạo bởi trình biên dịch**. Nội dung này sẽ được đưa vào khu vực này sau khi lớp được tải.

- **Literal** - Chuỗi văn bản, giá trị hằng số được khai báo là `final`, v.v.
- **Tham chiếu tượng trưng** - Tên đầy đủ của lớp và giao diện (Fully Qualified Name), tên và mô tả của trường (Descriptor), tên và mô tả của phương thức.

Ngoài các hằng số được tạo ra trong quá trình biên dịch, còn cho phép tạo ra động, ví dụ như `intern()` của lớp `String`. Các hằng số này cũng sẽ được đưa vào bảng hằng số thời chạy.

> 🔔 Lưu ý: Khi không gian hằng số không thể cấp phát thêm bộ nhớ, nó sẽ gây ra ngoại lệ `OutOfMemoryError`.

### Bộ nhớ trực tiếp

Bộ nhớ trực tiếp (Direct Memory) không phải là một phần của các khu vực dữ liệu thời gian chạy của JVM và không được định nghĩa trong quy tắc JVM.

Trong JDK 1.4, NIO được giới thiệu, cho phép sử dụng thư viện hàm Native để cấp phát bộ nhớ ngoài Heap, sau đó sử dụng một đối tượng `DirectByteBuffer` được lưu trữ trong Java Heap để tham chiếu đến bộ nhớ này và thực hiện các thao tác. Điều này có thể cải thiện đáng kể hiệu suất trong một số tình huống, vì tránh sao chép dữ liệu giữa Java Heap và Native Heap.

> 🔔 Lưu ý: Bộ nhớ trực tiếp cũng được sử dụng một cách thường xuyên và cũng có thể gây ra ngoại lệ `OutOfMemoryError`.
>
> 💡 Mẹo: Bạn có thể sử dụng tham số `-XX:MaxDirectMemorySize` để chỉ định kích thước bộ nhớ trực tiếp. Nếu không chỉ định, nó sẽ mặc định giống với kích thước tối đa của Java Heap (`-Xmx` đã chỉ định).

### So sánh các khu vực bộ nhớ trong Java

| Khu vực bộ nhớ   | Phạm vi bộ nhớ | Ngoại lệ                                     |
| --------------- | -------------- | -------------------------------------------- |
| Bộ đếm chương trình | Riêng tư của luồng | Không có                                          |
| Ngăn xếp JVM | Riêng tư của luồng | `StackOverflowError` và `OutOfMemoryError` |
| Ngăn xếp phương thức Native | Riêng tư của luồng | `StackOverflowError` và `OutOfMemoryError` |
| Java Heap       | Chia sẻ giữa các luồng | `OutOfMemoryError`                           |
| Khu vực phương thức | Chia sẻ giữa các luồng | `OutOfMemoryError`                           |
| Bảng hằng số thời gian chạy | Chia sẻ giữa các luồng | `OutOfMemoryError`                           |
| Bộ nhớ trực tiếp | Không phải là khu vực dữ liệu thời gian chạy | `OutOfMemoryError`                           |

## Nguyên lý hoạt động của JVM

```java
public class JVMCase {

	// Hằng số
	public final static String MAN_SEX_TYPE = "man";

	// Biến tĩnh
	public static String WOMAN_SEX_TYPE = "woman";

	public static void main(String[] args) {

		Student stu = new Student();
		stu.setName("nick");
		stu.setSexType(MAN_SEX_TYPE);
		stu.setAge(20);

		JVMCase jvmcase = new JVMCase();

		// Gọi phương thức tĩnh
		print(stu);
		// Gọi phương thức không tĩnh
		jvmcase.sayHello(stu);
	}


	// Phương thức tĩnh thông thường
	public static void print(Student stu) {
		System.out.println("name: " + stu.getName() + "; sex:" + stu.getSexType() + "; age:" + stu.getAge());
	}


	// Phương thức không tĩnh
	public void sayHello(Student stu) {
		System.out.println(stu.getName() + "say: hello");
	}
}

class Student{
	String name;
	String sexType;
	int age;

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	public String getSexType() {
		return sexType;
	}
	public void setSexType(String sexType) {
		this.sexType = sexType;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
}
```

Khi chạy mã trên, quá trình xử lý của JVM như sau:

（1）JVM yêu cầu bộ nhớ từ hệ điều hành, bước đầu tiên của JVM là yêu cầu bộ nhớ từ hệ điều hành thông qua cấu hình tham số hoặc cấu hình mặc định, JVM sẽ yêu cầu một không gian bộ nhớ cụ thể từ hệ điều hành và sau đó phân bổ nó trong JVM.

（2）Sau khi có không gian bộ nhớ, JVM sẽ phân bổ kích thước bộ nhớ cho heap, stack và phần không gian phương thức dựa trên cấu hình tham số.

（3）Tải lớp, xác minh, chuẩn bị và phân tích cú pháp của tệp class, trong đó giai đoạn chuẩn bị sẽ phân bổ bộ nhớ cho các biến tĩnh của lớp và khởi tạo chúng với giá trị khởi tạo mặc định (phần này sẽ được giải thích chi tiết sau).

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230718134850.png)

（4）Sau khi hoàn thành bước trước, JVM sẽ thực hiện giai đoạn khởi tạo cuối cùng. Trong giai đoạn này, JVM sẽ thực hiện phương thức `<clinit>` (phương thức khởi tạo lớp) đầu tiên. Trình biên dịch sẽ thu thập tất cả mã khởi tạo lớp, bao gồm các câu lệnh gán biến tĩnh, khối mã tĩnh và phương thức tĩnh, và tổng hợp chúng thành phương thức `<clinit>()`.

![jvm-process-4.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/jvm-process-4.png)

（5）Thực hiện phương thức. Khởi động luồng chính (main thread), thực hiện phương thức main, bắt đầu thực hiện dòng mã đầu tiên. Lúc này, một đối tượng student sẽ được tạo trong heap, và tham chiếu đến student sẽ được lưu trữ trong stack.

![jvm-process-5.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/jvm-process-5.png)

（6）Sau đó, tạo một đối tượng JVMCase và gọi phương thức không tĩnh sayHello. Phương thức sayHello thuộc về đối tượng JVMCase, nó được đưa vào stack và gọi đối tượng student trong heap thông qua tham chiếu student; sau đó, gọi phương thức tĩnh print, phương thức print thuộc về lớp JVMCase, được lấy từ phương thức tĩnh và gọi đối tượng student trong heap thông qua tham chiếu student.

![jvm-process-6.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/jvm-process-6.png)

## OutOfMemoryError

### OutOfMemoryError là gì

`OutOfMemoryError` (viết tắt là OOM) là một lỗi trong Java, nghĩa là không còn bộ nhớ trống và bộ thu gom rác không thể cung cấp thêm bộ nhớ. Đơn giản hơn, OOM có nghĩa là không đủ bộ nhớ trong JVM.

Theo quy tắc JVM, **ngoại trừ vùng bộ đếm chương trình (Program COunter), các vùng dữ liệu thời gian chạy khác đều có thể gây ra ngoại lệ `OutOfMemoryError` (viết tắt là OOM)**.

Dưới đây là các tình huống có thể gây ra OOM.

### Tràn bộ nhớ Heap

`java.lang.OutOfMemoryError: Java heap space` là một lỗi chỉ ra rằng: **tràn bộ nhớ Heap**.

Cụ thể hơn, đó là khi bộ nhớ Heap của Java đã đạt đến giới hạn tối đa được đặt bởi `-Xmx`. Bộ nhớ Heap được sử dụng để lưu trữ các đối tượng, và nếu liên tục tạo ra các đối tượng và đảm bảo rằng các đối tượng này không bị thu gom bởi bộ thu gom rác, thì khi bộ nhớ Heap đạt đến giới hạn tối đa, sẽ xảy ra OOM.

Tràn bộ nhớ Heap có thể là kết quả của **`rò rỉ bộ nhớ (Memory Leak)`** hoặc **`tràn bộ nhớ (Memory Overflow)`**. Cần sử dụng jstack và jmap để tạo ra threaddump và heapdump, sau đó sử dụng các công cụ phân tích bộ nhớ (như MAT) để phân tích.

#### Bước phân tích tràn bộ nhớ Heap

1. Sử dụng `jmap` hoặc `-XX:+HeapDumpOnOutOfMemoryError` để lấy bản chụp nhanh Heap.
2. Sử dụng công cụ phân tích bộ nhớ (visualvm, mat, jProfile, v.v.) để phân tích tệp chụp nhanh Heapdump.
3. Dựa trên biểu đồ phân tích, tập trung vào xác định xem các đối tượng trong bộ nhớ có cần thiết hay không, và xác định xem có phải là rò rỉ bộ nhớ (Memory Leak) hay tràn bộ nhớ (Memory Overflow).

#### Rò rỉ bộ nhớ (Memory Leak)

**Rò rỉ bộ nhớ là khi chương trình không giải phóng bộ nhớ không còn sử dụng được do sơ suất hoặc lỗi**.

Rò rỉ bộ nhớ không phải là việc mất mát vật lý của bộ nhớ, mà là khi ứng dụng cấp phát một phần bộ nhớ nhưng do sai sót thiết kế, nó mất đi sự kiểm soát của đoạn bộ nhớ đó, dẫn đến lãng phí bộ nhớ. Rò rỉ bộ nhớ tăng lên theo số lần thực thi và cuối cùng sẽ gây ra tràn bộ nhớ.

Các tình huống rò rỉ bộ nhớ phổ biến:

- Collection tĩnh
	- Các collection như `HashMap`, `Vector` được khai báo là tĩnh (`static`)
	- Nói một cách đơn giản, nếu A chứa B, chỉ cần đặt B thành null, A không được đặt thành null, khi thu gom rác, B không thể thu hồi vì nó được tham chiếu bởi A.
- Trình nghe
	- Đăng ký trình nghe nhưng không xóa trình nghe khi giải phóng đối tượng
- Kết nối vật lý
	- Các kết nối được tạo bởi các bể kết nối, phải đóng kết nối bằng `close()`
- Tham chiếu đến các lớp nội bộ và mô-đun bên ngoài
	- Tìm cách phát hiện nó giống như tràn bộ nhớ, có thể thêm quan sát thời gian thực
	- `jstat -gcutil 7362 2500 70`

Chú ý đặc biệt:

- `FGC` - Số lần Full GC xảy ra từ khi ứng dụng được khởi động đến thời điểm lấy mẫu.
- `FGCT` - Thời gian (tính bằng giây) mà Full GC đã sử dụng từ khi ứng dụng được khởi động đến thời điểm lấy mẫu.
- Số lần `FGC` càng nhiều, thời gian `FGCT` càng lâu, càng có khả năng có rò rỉ bộ nhớ.

Nếu là rò rỉ bộ nhớ, bạn có thể xem xét chuỗi tham chiếu từ đối tượng rò rỉ đến GC Roots. Điều này sẽ giúp bạn tìm ra cách mà đối tượng rò rỉ liên quan và dẫn đến GC không thể thu hồi chúng. Khi bạn hiểu được nguyên nhân này, bạn có thể xác định chính xác mã gây ra rò rỉ bộ nhớ.

Nguyên nhân phổ biến gây ra rò rỉ bộ nhớ là sử dụng các collection và không ngừng thêm phần tử vào collection mà không xóa chúng, dẫn đến sự mở rộng không ngừng của collection trong bộ nhớ.

【Ví dụ】

```java
/**
 * Ví dụ rò rỉ bộ nhớ
 * Hiện tượng lỗi: java.lang.OutOfMemoryError: Java heap space
 * VM Args: -verbose:gc -Xms10M -Xmx10M -XX:+HeapDumpOnOutOfMemoryError
 */
public class HeapOutOfMemoryDemo {

    public static void main(String[] args) {
        List<OomObject> list = new ArrayList<>();
        while (true) {
            list.add(new OomObject());
        }
    }

    static class OomObject {}

}
```

#### Tràn bộ nhớ (Memory Overflow)

Nếu không có rò rỉ bộ nhớ, có nghĩa là các đối tượng trong bộ nhớ thực sự cần tồn tại, bạn nên kiểm tra các tham số heap của máy ảo Java (`-Xmx` và `-Xms`) và so sánh với bộ nhớ vật lý của máy tính để xem liệu có thể tăng kích thước heap hay không. Đồng thời, kiểm tra mã nguồn để xem có tồn tại các đối tượng có tuổi thọ dài, thời gian giữ chúng quá lâu không, và thử giảm tiêu thụ bộ nhớ trong quá trình chạy chương trình.

【Ví dụ】

```java
/**
 * Ví dụ tràn bộ nhớ Heap
 * <p>
 * Hiện tượng lỗi: java.lang.OutOfMemoryError: Java heap space
 * <p>
 * VM Args：-verbose:gc -Xms10M -Xmx10M
 */
public class HeapOutOfMemoryDemo {

    public static void main(String[] args) {
        Double[] array = new Double[999999999];
        System.out.println("array length = [" + array.length + "]");
    }

}
```

Chạy lệnh `java -verbose:gc -Xms10M -Xmx10M -XX:+HeapDumpOnOutOfMemoryError io.github.dunwu.javacore.jvm.memory.HeapMemoryLeakMemoryErrorDemo`

Trong ví dụ trên, đây là một ví dụ cực đoan, cố gắng tạo ra một mảng có kích thước rất lớn, bộ nhớ heap không đủ để cấp phát, dẫn đến lỗi: `Java heap space`.

Tuy nhiên, trong thực tế, nếu mã nguồn không có vấn đề, chỉ là do bộ nhớ heap không đủ, bạn có thể điều chỉnh kích thước heap một cách phù hợp bằng cách sử dụng `-Xms` và `-Xmx`.

### Chi phí GC vượt quá giới hạn

`java.lang.OutOfMemoryError: GC overhead limit exceeded` là một lỗi, theo định nghĩa của Java, xảy ra khi **hơn `98%` thời gian được sử dụng để thực hiện GC và chỉ thu được dưới `2%` bộ nhớ heap**. Điều này xảy ra khi GC mất nhiều thời gian để giải phóng một lượng bộ nhớ nhỏ, đây là một cơ chế bảo vệ. Nguyên nhân gây ra lỗi này thường là do heap quá nhỏ và không đủ bộ nhớ.

【Ví dụ】

```java
/**
 * Ví dụ vượt quá giới hạn chi phí GC
 * Hiện tượng lỗi: java.lang.OutOfMemoryError: GC overhead limit exceeded
 * Lỗi xảy ra khi GC mất nhiều thời gian để giải phóng một lượng bộ nhớ nhỏ, đây là một cơ chế bảo vệ. Nguyên nhân gây ra lỗi này thường là do heap quá nhỏ và không đủ bộ nhớ.
 * Định nghĩa chính thức của Java: Khi hơn 98% thời gian được sử dụng để thực hiện GC và chỉ thu được dưới 2% bộ nhớ heap, lỗi này sẽ được ném ra.
 * VM Args: -Xms10M -Xmx10M
 */
public class GcOverheadLimitExceededDemo {

    public static void main(String[] args) {
        List<Double> list = new ArrayList<>();
        double d = 0.0;
        while (true) {
            list.add(d++);
        }
    }

}
```

【Xử lý】

Xử lý lỗi này tương tự như xử lý lỗi **Tràn bộ nhớ Heap**, trước tiên hãy kiểm tra xem có rò rỉ bộ nhớ không. Nếu có, hãy sửa mã nguồn. Nếu không, hãy điều chỉnh kích thước heap bằng cách sử dụng `-Xms` và `-Xmx` một cách phù hợp.

### Không đủ không gian PermGen

【Lỗi】

```
java.lang.OutOfMemoryError: PermGen space
```

【Nguyên nhân】

Không gian PermGen (Permanent Generation) chủ yếu được sử dụng để lưu trữ thông tin về `Class` và Meta, bao gồm tên lớp, trường, phương thức được biên dịch thành mã bytecode, thông tin hằng số, mảng đối tượng và mảng kiểu liên quan đến lớp, và tối ưu hóa bởi trình biên dịch JIT. GC không thực hiện việc dọn dẹp không gian PermGen trong quá trình chạy chương trình và mặc định có kích thước là 64M.

Dựa trên định nghĩa trên, có thể kết luận rằng **kích thước PermGen phụ thuộc vào số lượng lớp được tải và kích thước của các lớp đó**. Do đó, nguyên nhân chính gây ra lỗi này là có quá nhiều lớp được tải vào PermGen hoặc có lớp quá lớn trong đó.

Trong các phiên bản JDK trước JDK8, có thể sử dụng các tham số `-XX:PermSize` và `-XX:MaxPermSize` để đặt kích thước không gian PermGen, từ đó giới hạn kích thước của vùng phương thức và vùng hằng số trong đó.

#### Không đủ không gian PermGen khi khởi tạo

【Ví dụ】

```java
/**
 * Ví dụ không đủ không gian PermGen khi khởi tạo
 * <p>
 * Hiện tượng lỗi:
 * <ul>
 * <li>java.lang.OutOfMemoryError: PermGen space (Phiên bản JDK trước JDK8)</li>
 * <li>java.lang.OutOfMemoryError: Metaspace (Phiên bản JDK8 trở lên)</li>
 * </ul>
 * VM Args:
 * <ul>
 * <li>-Xmx100M -XX:MaxPermSize=16M (Phiên bản JDK trước JDK8)</li>
 * <li>-Xmx100M -XX:MaxMetaspaceSize=16M (Phiên bản JDK8 trở lên)</li>
 * </ul>
 */
public class PermOutOfMemoryErrorDemo {

    public static void main(String[] args) throws Exception {
        for (int i = 0; i < 100_000_000; i++) {
            generate("eu.plumbr.demo.Generated" + i);
        }
    }

    public static Class generate(String name) throws Exception {
        ClassPool pool = ClassPool.getDefault();
        return pool.makeClass(name).toClass();
    }

}
```

Trong ví dụ này, đoạn mã lặp qua và tạo ra các lớp trong thời gian chạy. Thư viện javassist được sử dụng để xử lý sự phức tạp của việc tạo lớp.

#### Không đủ không gian PermGen khi triển khai lại

Đối với ví dụ phức tạp và thực tế hơn, hãy xem xét từng bước xảy ra lỗi không gian Permgen trong quá trình triển khai lại ứng dụng. Khi triển khai lại ứng dụng, bạn mong muốn garbage collector sẽ giải phóng các lớp đã tải trước đó bằng cách thay thế chúng bằng classloader mới tải các lớp mới.

Tuy nhiên, nhiều thư viện bên thứ ba và cách xử lý tài nguyên như luồng, trình điều khiển JDBC hoặc handle hệ thống tệ hại đã ngăn không cho classloader cũ bị hủy bỏ. Nhưng ngược lại, điều này có nghĩa là trong mỗi lần triển khai lại, tất cả các phiên bản trước của lớp vẫn còn tồn tại trong PermGen, dẫn đến việc tạo ra hàng chục megabyte rác trong mỗi lần triển khai lại.

Hãy tưởng tượng một ứng dụng ví dụ kết nối đến cơ sở dữ liệu quan hệ bằng trình điều khiển JDBC. Khi ứng dụng khởi động, mã khởi tạo sẽ tải trình điều khiển JDBC để kết nối đến cơ sở dữ liệu. Theo quy định, trình điều khiển JDBC đăng ký với java.sql.DriverManager. Đăng ký này bao gồm việc lưu trữ một tham chiếu đến một phiên bản trình điều khiển trong các trường tĩnh của DriverManager.

Bây giờ, khi hủy triển khai ứng dụng từ máy chủ ứng dụng, java.sql.DriverManager vẫn giữ tham chiếu đó. Chúng ta đã có một tham chiếu thời gian thực đến lớp trình điều khiển, và lớp trình điều khiển giữ tham chiếu đến java.lang.Classloader được sử dụng để tải ứng dụng. Ngược lại, điều này có nghĩa là thuật toán thu gom rác không thể thu hồi không gian này.

Và lớp java.lang.Classloader này vẫn giữ tham chiếu đến tất cả các lớp của ứng dụng, thường chiếm đến hàng chục megabyte trong PermGen. Điều này có nghĩa là chỉ cần một số triển khai lại nhỏ để điền vào PermGen với kích thước thông thường.

#### Giải pháp cho không gian PermGen

(1) Giải quyết `OutOfMemoryError` khi khởi tạo

Khi gặp `OutOfMemoryError` do hết không gian PermGen trong quá trình khởi động ứng dụng, giải pháp đơn giản là tăng kích thước không gian PermGen. Ứng dụng chỉ cần thêm không gian để tải tất cả các lớp vào PermGen, vì vậy chúng ta chỉ cần tăng kích thước của nó. Để làm điều này, chỉnh sửa cấu hình khởi động của ứng dụng và thêm (hoặc tăng nếu đã tồn tại) tham số `-XX:MaxPermSize`, tương tự như ví dụ sau:

```
java -XX:MaxPermSize=512m com.yourcompany.YourClass
```

Cấu hình trên sẽ cho JVM biết rằng PermGen có thể tăng lên đến 512MB.

Xóa các tệp jar không cần thiết trong thư mục `WEB-INF/lib` của ứng dụng, di chuyển các tệp jar chung cho nhiều ứng dụng vào thư mục `lib` của Tomcat để giảm việc tải lặp lại.

🔔 Lưu ý: `-XX:PermSize` thường được đặt là 64M.

(2) Giải quyết `OutOfMemoryError` khi triển khai lại

Khi gặp `OutOfMemoryError` khi triển khai lại ứng dụng ngay lập tức, ứng dụng đang gặp vấn đề với việc rò rỉ classloader. Trong trường hợp này, giải pháp đầu tiên là tiếp tục phân tích heap dump - sử dụng lệnh tạo heap dump như sau:

```
jmap -dump:format=b,file=dump.hprof <process-id>
```

Sau đó, sử dụng trình phân tích heap dump ưa thích của bạn (ví dụ: Eclipse MAT) để mở dump và tìm các lớp trùng lặp, đặc biệt là các lớp đang tải lớp ứng dụng. Từ đó, bạn cần tìm tất cả các classloader và tìm đường dẫn ngắn nhất từ GC root thu thập từ classloader không hoạt động để xác định các tham chiếu ngăn chúng bị thu gom rác. Có được thông tin này, bạn sẽ tìm ra nguyên nhân cốt lõi. Nếu nguyên nhân nằm trong thư viện bên thứ ba, bạn có thể tìm kiếm trên Google/StackOverflow để xem liệu có phải là vấn đề đã biết và có bản vá/giải pháp không.

(3) Giải quyết `OutOfMemoryError` trong quá trình chạy

Bước đầu tiên là kiểm tra xem GC có được phép gỡ bỏ các lớp khỏi PermGen hay không. Trong mặc định, JVM khá thận trọng với việc gỡ bỏ lớp - lớp được sinh ra để tồn tại mãi mãi. Do đó, ngay cả khi không có mã nào sử dụng chúng, lớp vẫn được giữ trong bộ nhớ. Khi ứng dụng tạo ra nhiều lớp động và lớp này không cần tạo mã trong thời gian dài, điều này có thể trở thành vấn đề. Trong trường hợp này, cho phép JVM gỡ bỏ các định nghĩa lớp có thể giúp ích. Điều này có thể được thực hiện bằng cách thêm cấu hình sau vào tập lệnh khởi động:

```
-XX:+CMSClassUnloadingEnabled
```

Mặc định, tùy chọn này được đặt thành false, vì vậy để bật tính năng này, bạn cần đặt nó một cách rõ ràng trong các tùy chọn Java. Nếu CMSClassUnloadingEnabled được bật, GC cũng sẽ quét PermGen và loại bỏ các lớp không còn sử dụng. Hãy nhớ rằng tùy chọn này chỉ có tác dụng khi sử dụng UseConcMarkSweepGC.

```
-XX:+UseConcMarkSweepGC
```

Sau khi đảm bảo rằng lớp có thể được gỡ bỏ và vẫn còn vấn đề, bạn nên tiếp tục phân tích heap dump - sử dụng lệnh tạo heap dump như sau:

```
jmap -dump:file=dump.hprof,format=b <process-id>
```

Sau đó, sử dụng trình phân tích heap dump ưa thích của bạn (ví dụ: Eclipse MAT) để mở dump và tìm các lớp đã tải, sau đó sắp xếp theo số lượng thể hiện để đặt các đối tượng nghi ngờ ở đầu danh sách.

Sau đó, đối với mỗi đối tượng nghi ngờ, bạn cần theo dõi ngược lại để xác định nguyên nhân cốt lõi từ mã ứng dụng tạo ra lớp này.

### Không đủ không gian Metaspace

【Lỗi】

```
Exception in thread "main" java.lang.OutOfMemoryError: Metaspace
```

【Nguyên nhân】

Từ Java 8 trở đi, không gian bộ nhớ JVM đã trải qua nhiều thay đổi đáng kể. Không còn sử dụng vùng Permanent Generation (PermGen), thay vào đó là không gian Metaspace.

**Lỗi không đủ không gian Metaspace xảy ra khi không đủ không gian trong vùng phương thức (method area) và hằng số thời gian chạy (runtime constant pool)**.

Vùng phương thức được sử dụng để lưu trữ thông tin liên quan đến Class, bao gồm tên lớp, các quyền truy cập, hằng số thời gian chạy, mô tả trường, mô tả phương thức, v.v.

Một lớp chỉ được thu gom rác khi đáp ứng điều kiện khá nghiêm ngặt. Trong các ứng dụng tạo động nhiều lớp, và những lớp này không cần mã trong thời gian dài, điều này có thể trở thành một vấn đề. Đặc biệt là trong các trường hợp sử dụng CGLib để tăng cường bytecode và các ngôn ngữ động khác, cũng như các ứng dụng tạo ra nhiều tệp JSP hoặc tạo động tệp JSP (JSP cần được biên dịch thành lớp Java khi chạy lần đầu tiên), hoặc các ứng dụng dựa trên OSGi (đối với cùng một tệp lớp, nếu nó được tải bởi các classloader khác nhau, nó sẽ được coi là các lớp khác nhau).

【Ví dụ】Lỗi không đủ không gian Metaspace trong vùng phương thức

```java
public class MethodAreaOutOfMemoryDemo {

    public static void main(String[] args) {
        while (true) {
            Enhancer enhancer = new Enhancer();
            enhancer.setSuperclass(Bean.class);
            enhancer.setUseCache(false);
            enhancer.setCallback(new MethodInterceptor() {
                @Override
                public Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy) throws Throwable {
                    return proxy.invokeSuper(obj, args);
                }
            });
            enhancer.create();
        }
    }

    static class Bean {}

}
```

【Giải pháp】

Khi gặp `OutOfMemoryError` do không đủ không gian Metaspace, giải pháp đầu tiên là tăng kích thước Metaspace. Thay đổi cấu hình khởi động của ứng dụng và thêm (hoặc tăng nếu đã tồn tại) tham số `-XX:MaxMetaspaceSize`, tương tự như ví dụ sau:

```
-XX:MaxMetaspaceSize=512m
```

Cấu hình trên cho JVM biết rằng Metaspace có thể tăng lên đến 512MB.

Một giải pháp khác đơn giản hơn là loại bỏ tham số này để không giới hạn kích thước của Metaspace. JVM mặc định không giới hạn kích thước của Metaspace. Tuy nhiên, hãy lưu ý rằng việc làm này có thể dẫn đến việc sử dụng bộ nhớ trao đổi nhiều hoặc đạt đến giới hạn bộ nhớ vật lý của máy tính.

### Không thể tạo luồng native mới

`java.lang.OutOfMemoryError: Unable to create new native thread` là một lỗi có nghĩa là: **Ứng dụng Java đã đạt đến giới hạn số lượng luồng mà nó có thể khởi tạo**.

【Nguyên nhân】

Khi tạo một luồng, máy ảo Java (JVM) tạo một đối tượng `Thread` trong bộ nhớ JVM và tạo một luồng hệ điều hành tương ứng trong bộ nhớ hệ điều hành. Bộ nhớ mà luồng hệ điều hành sử dụng không phải là bộ nhớ JVM, mà là bộ nhớ còn lại trong hệ thống.

Vậy số lượng luồng mà chúng ta có thể tạo được là bao nhiêu? Có một công thức để tính toán:

```
Số lượng luồng = (MaxProcessMemory - JVMMemory - ReservedOsMemory) / (ThreadStackSize)
```

【Tham số】

- `MaxProcessMemory` - Bộ nhớ tối đa của một tiến trình
- `JVMMemory` - Bộ nhớ JVM
- `ReservedOsMemory` - Bộ nhớ dành riêng cho hệ điều hành
- `ThreadStackSize` - Kích thước ngăn xếp của luồng

**Khi chúng ta cấp phát nhiều bộ nhớ cho JVM, bộ nhớ có thể sử dụng để tạo luồng hệ điều hành càng ít, càng dễ xảy ra lỗi `unable to create new native thread`**. Vì vậy, việc cấp phát quá nhiều bộ nhớ cho JVM không phải lúc nào cũng tốt.

Tuy nhiên, thông thường các tình huống gây ra lỗi `java.lang.OutOfMemoryError` là do không thể tạo ra luồng mới, và điều này xảy ra theo các bước sau:

1. Ứng dụng chạy trong JVM gửi yêu cầu tạo luồng Java mới.
2. Mã native trong JVM đại diện cho yêu cầu tạo luồng hệ điều hành.
3. Hệ điều hành cố gắng tạo một luồng hệ điều hành mới, cần phải cấp phát bộ nhớ cho luồng này.
4. Hệ điều hành từ chối cấp phát bộ nhớ cho luồng hệ điều hành mới vì không gian địa chỉ của quá trình Java 32 bit đã hết (ví dụ: đã đạt đến giới hạn kích thước quá trình 2-4 GB) hoặc bộ nhớ ảo của hệ điều hành đã hết.
5. Gây ra lỗi `java.lang.OutOfMemoryError: Unable to create new native thread`.

【Ví dụ】

```java
public class UnableCreateNativeThreadErrorDemo {

    public static void main(String[] args) {
        while (true) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        TimeUnit.MINUTES.sleep(5);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }).start();
        }
    }
}
```

【Giải pháp】

Có thể vượt qua vấn đề không thể tạo luồng hệ điều hành mới bằng cách tăng giới hạn số lượng tiến trình mà JVM có thể tạo ra. Ví dụ, nếu giới hạn số lượng tiến trình mà JVM có thể tạo ra trong không gian người dùng đã bị hạn chế, bạn nên kiểm tra và có thể tăng giới hạn đó:

```shell
[root@dev ~]# ulimit -a
core file size          (blocks, -c) 0
--- cut for brevity ---
max user processes              (-u) 1800
```

Thường thì `OutOfMemoryError` do không thể tạo luồng hệ điều hành mới chỉ ra một lỗi lập trình. Rất ít ứng dụng có thể hưởng lợi từ một số lượng lớn luồng như vậy.

Một cách tiếp cận để giải quyết vấn đề này là bắt đầu thực hiện thread dump để tìm hiểu tình hình.

### Tràn bộ nhớ trực tiếp

Lỗi tràn bộ nhớ do tràn bộ nhớ trực tiếp (Direct Memory) là một đặc điểm rõ ràng là không có lỗi rõ ràng trong tệp Head Dump. Nếu bạn phát hiện rằng tệp Dump sau khi xảy ra OOM rất nhỏ, trong khi chương trình sử dụng trực tiếp hoặc gián tiếp NIO, bạn có thể xem xét kiểm tra xem có phải là nguyên nhân từ phía này.

【Ví dụ】Lỗi tràn bộ nhớ trực tiếp

```java
/**
 * Ví dụ tràn bộ nhớ trực tiếp
 * Hiện tượng lỗi: java.lang.OutOfMemoryError
 * VM Args：-Xmx20M -XX:MaxDirectMemorySize=10M
 */
public class DirectOutOfMemoryDemo {

    private static final int _1MB = 1024 * 1024;

    public static void main(String[] args) throws IllegalAccessException {
        Field unsafeField = Unsafe.class.getDeclaredFields()[0];
        unsafeField.setAccessible(true);
        Unsafe unsafe = (Unsafe) unsafeField.get(null);
        while (true) {
            unsafe.allocateMemory(_1MB);
        }
    }

}
```

【Xử lý】

Để xử lý lỗi tràn bộ nhớ trực tiếp, bạn có thể thử tăng kích thước bộ nhớ trực tiếp (`-XX:MaxDirectMemorySize`) hoặc giảm bộ nhớ heap (`-Xmx`) để giải phóng bộ nhớ cho bộ nhớ trực tiếp. Ngoài ra, bạn cũng có thể kiểm tra xem có sử dụng trực tiếp NIO không cần thiết và giải phóng bộ nhớ trực tiếp sau khi sử dụng xong.

## StackOverflowError

Đối với máy ảo HotSpot, dung lượng của ngăn xếp chỉ được quyết định bởi tham số `-Xss`. Nếu một luồng yêu cầu độ sâu của ngăn xếp lớn hơn giới hạn tối đa cho phép của máy ảo, nó sẽ gây ra ngoại lệ `StackOverflowError`.

Trong thực tế, nguyên nhân phổ biến gây ra lỗi tràn ngăn xếp bao gồm:

- **Số lượng lời gọi hàm đệ quy quá nhiều**
- **Vòng lặp lớn hoặc vòng lặp vô hạn**

【Ví dụ】Lỗi StackOverflowError do số lượng lời gọi hàm đệ quy quá nhiều

```java
public class StackOverflowDemo {

    private int stackLength = 1;

    public void recursion() {
        stackLength++;
        recursion();
    }

    public static void main(String[] args) {
        StackOverflowDemo obj = new StackOverflowDemo();
        try {
            obj.recursion();
        } catch (Throwable e) {
            System.out.println("Độ sâu ngăn xếp: " + obj.stackLength);
            e.printStackTrace();
        }
    }

}
```
