---
categories: [java, javase]
title: Java Exception In Depth
date created: 2023-07-03
date modified: 2023-07-13
tags: [java, javase, exception]
---

## Phân cấp ngoại lệ (Exception)

**Ngoại lệ (Exception)** đề cập đến các tình huống không mong muốn xảy ra, chẳng hạn như không tìm thấy tệp, kết nối mạng thất bại, tham số không hợp lệ, v.v. Ngoại lệ là một sự kiện xảy ra trong quá trình chạy chương trình, làm gián đoạn quy trình lệnh bình thường. Trong Java, các ngoại lệ khác nhau được mô tả bằng các lớp con của lớp `Throwable` trong API. Do đó, các ngoại lệ trong Java đều là các đối tượng, là các thể hiện của lớp con của Throwable, mô tả các điều kiện lỗi xuất hiện trong đoạn mã. Khi điều kiện được tạo ra, lỗi sẽ gây ra ngoại lệ.  

Sơ đồ cấu trúc lớp ngoại lệ trong Java:

![Pasted image 20230703161647](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230703161647.png)

### Throwable

`Throwable` là một lớp cha của tất cả các lỗi (`Error`) và ngoại lệ (`Exception`) trong Java. Trong Java, chỉ có thể ném (`throw`) hoặc bắt (`catch`) các đối tượng kiểu `Throwable`, nó là thành phần cơ bản của cơ chế xử lý ngoại lệ.

`Throwable` chứa một bản chụp ngăn xếp thực thi của luồng khi nó được tạo ra, nó cung cấp các phương thức như `printStackTrace()` để lấy thông tin về ngăn xếp thực thi.

Các phương thức chính:

- `fillInStackTrace` - Điền ngăn xếp thực thi của đối tượng `Throwable` với ngăn xếp thực thi của cuộc gọi hiện tại và thêm vào bất kỳ thông tin trước đó nào.
- `getMessage` - Trả về thông tin chi tiết về lỗi đã xảy ra. Thông điệp này được khởi tạo trong constructor của `Throwable`.
- `getCause` - Trả về một đối tượng `Throwable` đại diện cho nguyên nhân của ngoại lệ.
- `getStackTrace` - Trả về một mảng chứa ngăn xếp thực thi. Phần tử có chỉ số 0 đại diện cho đỉnh ngăn xếp, phần tử cuối cùng đại diện cho đáy ngăn xếp thực thi.
- `printStackTrace` - In kết quả của `toString()` và ngăn xếp thực thi ra `System.err`, tức là luồng lỗi.
- `toString` - Trả về một chuỗi đại diện cho đối tượng `Throwable`.

### Error

`Error` là một lớp con của `Throwable`. `Error` đại diện cho các vấn đề nghiêm trọng mà trong tình huống bình thường thì không thể xảy ra. **Trình biên dịch không kiểm tra `Error`.** Hầu hết các `Error` sẽ dẫn đến trạng thái không bình thường và không thể khôi phục được của chương trình (ví dụ: `OutOfMemoryError` và các lớp con khác).

Các `Error` phổ biến:

- `AssertionError` - Lỗi khẳng định.
- `VirtualMachineError` - Lỗi máy ảo.
- `UnsupportedClassVersionError` - Lỗi phiên bản lớp Java.
- `StackOverflowError` - Lỗi tràn ngăn xếp.
- `OutOfMemoryError` - Lỗi tràn bộ nhớ.

Những lỗi này không phải là ngoại lệ kiểm tra, không phải là lỗi liên quan đến mã. Do đó, khi xảy ra các lỗi này, ứng dụng không nên xử lý các lỗi này. Theo quy ước của Java, chúng ta không nên triển khai bất kỳ lớp con Error mới nào!

### Exception (Ngoại lệ)

`Exception` là một lớp con của `Throwable`. `Exception` đại diện cho các điều kiện mà một ứng dụng hợp lý có thể muốn bắt (`catch`). Exception là những tình huống không bình thường có thể dự đoán được trong quá trình chạy chương trình và nên được bắt và xử lý.

`Exception` được chia thành hai loại: `checked exception` (ngoại lệ kiểm tra) và `unchecked exception` (ngoại lệ không kiểm tra). `checked exception` phải được khai báo hoặc xử lý bằng cách sử dụng `throws` hoặc `try catch`, trong khi `unchecked exception` không yêu cầu điều này và có thể được bỏ qua trong quá trình biên dịch.

Các `Exception` phổ biến:

- `ClassNotFoundException` - Thrown khi ứng dụng cố gắng tải một lớp nhưng không tìm thấy lớp đó.
- `CloneNotSupportedException` - Thrown khi gọi phương thức clone của một đối tượng nhưng lớp đó không thể triển khai giao diện Cloneable.
- `IllegalAccessException` - Thrown khi truy cập vào một lớp bị từ chối.
- `InstantiationException` - Thrown khi cố gắng tạo một thể hiện của một lớp mà đối tượng của lớp đó không thể được tạo ra vì nó là một giao diện hoặc một lớp trừu tượng.
- `InterruptedException` - Thrown khi một luồng khác đã ngắt một luồng hiện tại.
- `NoSuchFieldException` - Thrown khi truy cập vào một trường không tồn tại.
- `NoSuchMethodException` - Thrown khi truy cập vào một phương thức không tồn tại.  

Ví dụ:

```java
public class ExceptionDemo {
    public static void main(String[] args) {
        Method method = String.class.getMethod("toString", int.class);
    }
};
```

Khi cố gắng biên dịch và chạy, sẽ có lỗi:

```
Error:(7, 47) java: unreported exception java.lang.NoSuchMethodException; must be caught or declared to be thrown
```

### RuntimeException

`RuntimeException` là một lớp con của `Exception`. `RuntimeException` là lớp cha của các ngoại lệ có thể xảy ra trong quá trình chạy bình thường của máy ảo Java.

**Trình biên dịch không kiểm tra các ngoại lệ `RuntimeException`.** Khi chương trình có thể gây ra ngoại lệ này, nếu không khai báo nó bằng cách sử dụng `throws`, cũng không sử dụng câu lệnh `try catch` để bắt nó, chương trình vẫn sẽ được biên dịch thành công.

Ví dụ:

```java
public class RuntimeExceptionDemo {
    public static void main(String[] args) {
        // Gây ra ngoại lệ ở đây
        int result = 10 / 0;
        System.out.println("Kết quả của phép chia hai số là: " + result);
        System.out.println("----------------------------");
    }
};
```

Kết quả chạy:

```
Exception in thread "main" java.lang.ArithmeticException: / by zero
	at com.hnv99.javacore.exception.RumtimeExceptionDemo01.main(RumtimeExceptionDemo01.java:6)
```

Các `RuntimeException` phổ biến:

- `ArrayIndexOutOfBoundsException` - Ngoại lệ xảy ra khi truy cập mảng với chỉ số không hợp lệ. Chỉ số không hợp lệ là số âm hoặc lớn hơn hoặc bằng kích thước của mảng.
- `ArrayStoreException` - Ngoại lệ xảy ra khi cố gắng lưu trữ một đối tượng không đúng kiểu vào một mảng đối tượng.
- `ClassCastException` - Ngoại lệ xảy ra khi cố gắng ép kiểu đối tượng sang một lớp con mà đối tượng không phải là một phiên bản của nó.
- `IllegalArgumentException` - Ngoại lệ xảy ra khi đối số được truyền vào phương thức không hợp lệ hoặc không chính xác.
- `IllegalMonitorStateException` - Ngoại lệ xảy ra khi một luồng đã cố gắng chờ đợi trình giám sát của một đối tượng hoặc cố gắng thông báo cho các luồng khác đang chờ đợi trình giám sát của đối tượng mà nó không sở hữu.
- `IllegalStateException` - Ngoại lệ xảy ra khi gọi phương thức vào thời điểm không hợp lệ hoặc không thích hợp.
- `IllegalThreadStateException` - Ngoại lệ xảy ra khi một luồng không ở trạng thái yêu cầu để thực hiện một hoạt động.
- `IndexOutOfBoundsException` - Ngoại lệ xảy ra khi chỉ số sắp xếp (ví dụ: sắp xếp mảng, chuỗi hoặc vector) vượt quá phạm vi.
- `NegativeArraySizeException` - Ngoại lệ xảy ra khi chương trình cố gắng tạo một mảng với kích thước âm.
- `NullPointerException` - Ngoại lệ xảy ra khi chương trình cố gắng sử dụng null trong một vị trí yêu cầu một đối tượng.
- `NumberFormatException` - Ngoại lệ xảy ra khi chương trình cố gắng chuyển đổi một chuỗi thành một kiểu số nhưng chuỗi không thể chuyển đổi thành định dạng phù hợp.
- `SecurityException` - Ngoại lệ xảy ra khi có vi phạm bảo mật.
- `StringIndexOutOfBoundsException` - Ngoại lệ xảy ra khi một phương thức của lớp String tham số chỉ mục không hợp lệ, là số âm hoặc vượt quá kích thước của chuỗi.
- `UnsupportedOperationException` - Ngoại lệ xảy ra khi phương thức không hỗ trợ được yêu cầu.

### Non Runtime Exception

Là ngoại lệ khác `RuntimeException`, nó thuộc loại `Exception` và các lớp con của nó. Từ góc độ cú pháp chương trình, ngoại lệ này là ngoại lệ phải xử lý, nếu không xử lý, chương trình sẽ không được biên dịch. Ví dụ: `IOException`, `SQLException` và ngoại lệ do người dùng tự định nghĩa, thông thường không tự định nghĩa ngoại lệ kiểm tra.

## Cơ bản về ngoại lệ

> Tiếp theo chúng ta xem xét những điều cơ bản của việc sử dụng ngoại lệ.

### Từ khóa ngoại lệ

- **try** - được sử dụng để lắng nghe. Đoạn mã (có thể gây ra ngoại lệ) mà muốn lắng nghe được đặt trong khối try, khi có ngoại lệ xảy ra trong khối try, ngoại lệ sẽ được ném ra.
- **catch** - được sử dụng để bắt ngoại lệ. catch được sử dụng để bắt ngoại lệ xảy ra trong khối try.
- **finally** - khối finally luôn được thực thi. Nó chủ yếu được sử dụng để giải phóng tài nguyên vật lý đã mở trong khối try (như kết nối cơ sở dữ liệu, kết nối mạng và tệp tin đĩa). Chỉ sau khi khối finally được thực thi, các câu lệnh return hoặc throw trong khối try hoặc catch mới được thực hiện. Nếu khối finally chứa câu lệnh kết thúc như return hoặc throw, nó sẽ không quay lại thực thi các câu lệnh trong try hoặc catch, mà sẽ dừng lại ngay lập tức.
- **throw** - được sử dụng để ném ngoại lệ.
- **throws** - được sử dụng trong khai báo phương thức, để khai báo ngoại lệ có thể ném ra từ phương thức đó.

### Khai báo ngoại lệ (throws)

Trong Java, mọi câu lệnh đang thực thi phải thuộc về một phương thức nào đó. Trình thông dịch Java gọi phương thức `main` để bắt đầu thực thi chương trình. Nếu phương thức chứa ngoại lệ kiểm tra và không bắt nó, thì phải khai báo rõ ràng ngoại lệ đó trong phần đầu của phương thức, để thông báo cho trình gọi biết phương thức có ngoại lệ và cần xử lý. Để khai báo một ngoại lệ trong phương thức, sử dụng từ khóa throws sau đó là các ngoại lệ cần khai báo. Nếu có nhiều ngoại lệ, sử dụng dấu phẩy để phân tách. Ví dụ:

```java
public static void method() throws IOException, FileNotFoundException{  
    //something statements
} 
```

Lưu ý: Nếu phương thức cha không khai báo ngoại lệ, thì phương thức con kế thừa từ phương thức cha cũng không thể khai báo ngoại lệ.  

Thông thường, nên bắt các ngoại lệ mà biết cách xử lý, và tiếp tục ném các ngoại lệ không biết cách xử lý. Việc ném ngoại lệ có thể được thực hiện bằng cách sử dụng từ khóa `throws` trong khai báo phương thức.

```java
private static void readFile(String filePath) throws IOException {  
    File file = new File(filePath);  
    String result;  
    BufferedReader reader = new BufferedReader(new FileReader(file));  
    while((result = reader.readLine())!=null) {  
        System.out.println(result);  
    }  
    reader.close();  
} 
```

Quy tắc ném ngoại lệ bằng từ khóa `throws`:

- Nếu là ngoại lệ không kiểm tra (unchecked exception), tức là `Error`, `RuntimeException` hoặc các lớp con của chúng, thì không cần sử dụng từ khóa `throws` để khai báo ngoại lệ, mã vẫn có thể biên dịch thành công, nhưng sẽ bị hệ thống ném ra khi chạy.
- Phải khai báo bất kỳ ngoại lệ kiểm tra nào (checked exception). Nghĩa là nếu một phương thức có thể gây ra ngoại lệ kiểm tra, phải hoặc bắt nó bằng câu lệnh try-catch, hoặc khai báo nó bằng từ khóa throws, nếu không sẽ gây lỗi biên dịch.
- Chỉ khi ném ngoại lệ, trình gọi phương thức mới phải xử lý hoặc ném lại ngoại lệ đó.
- trình gọi phương thức phải tuân theo quy tắc xử lý và khai báo ngoại lệ kiểm tra. Nếu ghi đè phương thức, không thể khai báo ngoại lệ khác với phương thức được ghi đè. Mọi ngoại lệ được khai báo phải là lớp con hoặc cùng loại với ngoại lệ được khai báo trong phương thức được ghi đè.

### Ném ngoại lệ (throw)

Nếu mã có thể gây ra lỗi, có thể tạo một thể hiện của lớp ngoại lệ thích hợp và ném nó, đó là ném ngoại lệ. Ví dụ:

```java
public static double method(int value) {  
    if(value == 0) {  
        throw new ArithmeticException("Tham số không thể là 0"); //ném một ngoại lệ runtime  
    }  
    return 5.0 / value;  
}
```

Trong hầu hết các trường hợp, không cần phải ném ngoại lệ thủ công, vì hầu hết các phương thức trong Java đã xử lý ngoại lệ hoặc đã khai báo ngoại lệ. Vì vậy, thường là bắt ngoại lệ hoặc ném ngoại lệ lên trên.

Đôi khi chúng ta có thể ném một ngoại lệ từ khối `catch`, với mục đích thay đổi loại ngoại lệ. Thường được sử dụng trong việc tích hợp nhiều hệ thống, khi một hệ thống con gặp sự cố, có thể có nhiều loại ngoại lệ, có thể sử dụng một loại ngoại lệ thống nhất để tiếp tục truyền ra bên ngoài, không cần tiết lộ quá nhiều chi tiết ngoại lệ nội bộ.

```java
private static void readFile(String filePath) throws MyException {  
    try {  
        // code  
    } catch (IOException e) {  
        MyException ex = new MyException("read file failed.");  
        ex.initCause(e);  
        throw ex;  
    }  
}
```

### Tự định nghĩa ngoại lệ

Thông thường, khi định nghĩa một lớp ngoại lệ, nên bao gồm hai hàm tạo, một là hàm tạo không tham số và một là hàm tạo có mô tả chi tiết (phương thức `toString` của `Throwable` sẽ in ra các thông tin chi tiết này, rất hữu ích trong quá trình gỡ lỗi), ví dụ như `MyException` đã sử dụng ở trên:

```java
public class MyException extends Exception {  
    public MyException(){ }  
    public MyException(String msg){  
        super(msg);  
    }  
    // …  
}
```

### Bắt và xử lý ngoại lệ

Các cách bắt và xử lý ngoại lệ thường bao gồm:

- try-catch
- try-catch-finally
- try-finally
- try-with-resource

#### try-catch

Trong một khối `try-catch`, có thể bắt nhiều loại ngoại lệ khác nhau và xử lý chúng theo cách khác nhau.

```java
private static void readFile(String filePath) {
    try {
        // code
    } catch (FileNotFoundException e) {
        // handle FileNotFoundException
    } catch (IOException e){
        // handle IOException
    }
}
```

Cùng một khối catch cũng có thể bắt nhiều loại ngoại lệ, được phân tách bằng dấu `|`.

```java
private static void readFile(String filePath) {
    try {
        // code
    } catch (FileNotFoundException | UnknownHostException e) {
        // handle FileNotFoundException or UnknownHostException
    } catch (IOException e){
        // handle IOException
    }
}
```

#### try-catch-finally

- Cú pháp thông thường

```java
try {
    // mã lệnh có thể gây ra ngoại lệ              
} catch(Exception e) {  
    // bắt ngoại lệ và xử lý  
} finally {  
    // mã lệnh luôn được thực thi  
}  
```

- Thứ tự thực thi  
	- Khi không có ngoại lệ được bắt trong khối `try`: Các câu lệnh trong khối try `được` thực thi tuần tự, chương trình sẽ bỏ qua khối `catch` và thực thi khối `finally` và các câu lệnh sau đó.
	- Khi có ngoại lệ được bắt trong khối `try`, nhưng không có khối `catch` xử lý ngoại lệ này: Khi một câu lệnh trong khối `try` gây ra ngoại lệ và không có khối `catch` xử lý ngoại lệ này, ngoại lệ sẽ được ném cho JVM xử lý, khối `finally` vẫn được thực thi, nhưng các câu lệnh sau khối `finally` sẽ không được thực thi.
	- Khi có ngoại lệ được bắt trong khối `try` và có khối `catch` xử lý ngoại lệ này: Trong khối `try`, các câu lệnh được thực thi theo thứ tự, khi một câu lệnh gây ra ngoại lệ, chương trình sẽ nhảy đến khối `catch` và so khớp từng khối `catch` để tìm chương trình xử lý phù hợp, các khối `catch` khác sẽ không được thực thi, các câu lệnh sau khối `try` cũng sẽ không được thực thi, sau khi khối `catch` được thực thi, khối `finally` sẽ được thực thi, cuối cùng là các câu lệnh sau khối `finally`.  

![Pasted image 20230703164928](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Pasted%20image%2020230703164928.png)

- Ví dụ đầy đủ

```java
private static void readFile(String filePath) throws MyException {
    File file = new File(filePath);
    String result;
    BufferedReader reader = null;
    try {
        reader = new BufferedReader(new FileReader(file));
        while((result = reader.readLine())!=null) {
            System.out.println(result);
        }
    } catch (IOException e) {
        System.out.println("readFile method catch block.");
        MyException ex = new MyException("read file failed.");
        ex.initCause(e);
        throw ex;
    } finally {
        System.out.println("readFile method finally block.");
        if (null != reader) {
            try {
                reader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

#### try-finally

> Có thể sử dụng trực tiếp `try-finally` không? Có thể.

Khi khối `try` gây ra ngoại lệ, các câu lệnh sau mã lỗi không được thực thi, mà thay vào đó, khối `finally` được thực thi. Khi khối `try` không gây ra ngoại lệ, sau khi thực thi khối `try`, khối `finally` được thực thi.

`try-finally` có thể được sử dụng trong các đoạn mã không cần bắt ngoại lệ, để đảm bảo tài nguyên được giải phóng sau khi sử dụng. Ví dụ về sử dụng `Lock` để đồng bộ luồng, thông qua `finally` có thể đảm bảo rằng khóa sẽ được giải phóng.

```java
// Ví dụ về sử dụng Lock trong try-finally
ReentrantLock lock = new ReentrantLock();  
try {  
    // mã lệnh cần khóa  
} finally {  
    lock.unlock(); // đảm bảo rằng khóa sẽ được giải phóng  
}  
```

`finally` không được thực thi trong các trường hợp sau:

- Trong các đoạn mã trước đó, đã sử dụng System.exit() để thoát khỏi chương trình.
- Trong khối finally xảy ra ngoại lệ.
- Luồng chương trình bị kết thúc.
- CPU bị tắt.

#### try-with-resource

> `try-with-resource` được giới thiệu trong Java 7 và thường bị bỏ qua.

Trong ví dụ trên, phần `finally` có phương thức `close` cũng có thể gây ra `IOException`, ghi đè lên ngoại lệ ban đầu. Java 7 cung cấp một cách tinh vi hơn để tự động giải phóng tài nguyên, tài nguyên tự động giải phóng phải là một lớp triển khai giao diện `AutoCloseable`.

- Cú pháp của nó như sau:

```java
private static void tryWithResourceTest(){  
    try (Scanner scanner = new Scanner(new FileInputStream("c:/abc"),"UTF-8")){  
        // mã lệnh  
    } catch (IOException e){  
        // xử lý ngoại lệ  
    }  
}  
```

- Chú ý vào scanner

```java
public final class Scanner implements Iterator<String>, Closeable {
  // ...
}
public interface Closeable extends AutoCloseable {
    public void close() throws IOException;
}
```

Khi khối `try` thoát, phương thức `scanner.close` sẽ được tự động gọi. Khác với việc đặt phương thức `scanner.close` trong khối `finally`, nếu phương thức `scanner.close` gây ra ngoại lệ, ngoại lệ sẽ bị ức chế và ngoại lệ ban đầu vẫn được ném ra. Các ngoại lệ bị bắt sẽ được thêm vào ngoại lệ ban đầu bằng phương thức `addSuppressed`, nếu muốn lấy danh sách các ngoại lệ bị bắt, có thể sử dụng phương thức `getSuppressed`.

### Tổng kết cơ bản về ngoại lệ

- `try`, `catch` và `finally` không thể sử dụng độc lập, chỉ có thể sử dụng trong cấu trúc `try-catch`, `try-finally` hoặc `try-catch-finally`.
- Khối `try` theo dõi mã lệnh và dừng thực thi nếu có ngoại lệ xảy ra, sau đó ngoại lệ được chuyển cho khối `catch` để xử lý.
- Khối `finally` sẽ luôn luôn được thực thi, thường được sử dụng để giải phóng tài nguyên.
- `throws`: Khai báo một ngoại lệ để thông báo cho trình gọi phương thức.
- `throw`: Ném một ngoại lệ, không quan tâm liệu ngoại lệ đó có được bắt hay tiếp tục ném ra ngoài hay không.

Tổng kết về ngoại lệ từ sách:

- Xử lý vấn đề ở mức độ phù hợp. (Bắt ngoại lệ khi biết cách xử lý vấn đề đó).
- Giải quyết vấn đề và gọi lại phương thức gây ra ngoại lệ.
- Sửa chữa một số lỗi nhỏ và tiếp tục thực thi qua vị trí gây ra ngoại lệ.
- Thực hiện tính toán bằng dữ liệu khác để thay thế giá trị dự kiến sẽ được trả về bởi phương thức.
- Hoàn thành tất cả công việc có thể làm trong môi trường thực thi hiện tại, sau đó ném ngoại lệ tương tự lên tầng cao hơn.
- Hoàn thành tất cả công việc có thể làm trong môi trường thực thi hiện tại, sau đó ném các ngoại lệ khác lên tầng cao hơn.
- Chấm dứt chương trình.
- Đơn giản hóa (nếu mẫu ngoại lệ của bạn làm cho vấn đề trở nên quá phức tạp, sẽ rất khó sử dụng).
- Làm cho thư viện và chương trình an toàn hơn.

### Các ngoại lệ phổ biến

Trong Java, có một số ngoại lệ được sử dụng để mô tả các lỗi thường gặp, một số yêu cầu người lập trình xử lý hoặc khai báo ngoại lệ này, trong khi một số khác được Java Virtual Machine tự động xử lý. Một số lớp ngoại lệ phổ biến trong Java bao gồm:

- **RuntimeException**
    - **java.lang.ArrayIndexOutOfBoundsException**: Ngoại lệ vượt quá chỉ số mảng. Xảy ra khi chỉ số mảng là số âm hoặc lớn hơn hoặc bằng kích thước của mảng.
    - **java.lang.ArithmeticException**: Ngoại lệ toán học. Ví dụ: chia một số nguyên cho 0.
    - **java.lang.NullPointerException**: Ngoại lệ con trỏ null. Xảy ra khi một đối tượng null được sử dụng trong một vị trí yêu cầu sử dụng đối tượng.
    - **java.lang.ClassNotFoundException**: Ngoại lệ không tìm thấy lớp. Xảy ra khi không tìm thấy tệp class tương ứng với tên lớp được cung cấp.
    - **java.lang.NegativeArraySizeException**: Ngoại lệ kích thước mảng âm.
    - **java.lang.ArrayStoreException**: Ngoại lệ chứa giá trị không tương thích trong mảng.
    - **java.lang.SecurityException**: Ngoại lệ bảo mật.
    - **java.lang.IllegalArgumentException**: Ngoại lệ tham số không hợp lệ.
- **IOException**: Ngoại lệ liên quan đến thao tác đọc và ghi dữ liệu vào luồng (stream).
    - **java.io.EOFException**: Ngoại lệ kết thúc tệp.
    - **java.io.FileNotFoundException**: Ngoại lệ không tìm thấy tệp.
- **Khác**:
    - **java.lang.ClassCastException**: Ngoại lệ chuyển đổi kiểu không hợp lệ.
    - **java.sql.SQLException**: Ngoại lệ liên quan đến thao tác với cơ sở dữ liệu.
    - **java.lang.NumberFormatException**: Ngoại lệ chuyển đổi chuỗi thành số.
    - **java.lang.StringIndexOutOfBoundsException**: Ngoại lệ vượt quá chỉ số chuỗi.
    - **java.lang.IllegalAccessException**: Ngoại lệ không cho phép truy cập vào lớp.
    - **java.lang.InstantiationException**: Ngoại lệ không thể khởi tạo một đối tượng từ lớp được chỉ định.

Lưu ý: Đây chỉ là một số ngoại lệ phổ biến, còn rất nhiều ngoại lệ khác trong Java.

## Thực hành xử lý ngoại lệ

> Lưu ý:
>
> Xử lý ngoại lệ trong Java không phải là một việc đơn giản. Không chỉ những người mới học mà ngay cả những nhà phát triển có kinh nghiệm cũng phải dành nhiều thời gian để suy nghĩ về cách xử lý ngoại lệ, bao gồm xác định xem nên xử lý những ngoại lệ nào, cách xử lý như thế nào, v.v. Đó cũng là lý do tại sao hầu hết các nhóm phát triển đều thiết lập các quy tắc để điều chỉnh cách xử lý ngoại lệ.

Khi bạn ném hoặc bắt ngoại lệ, có nhiều tình huống khác nhau cần được xem xét, và hầu hết mọi thứ đều nhằm cải thiện tính đọc được của mã hoặc tính khả dụng của API.

Ngoại lệ không chỉ là một cơ chế kiểm soát lỗi, mà còn là một phương tiện truyền thông. Do đó, để làm việc tốt hơn với đồng đội, một nhóm phát triển phải thiết lập các quy tắc và hướng dẫn tốt nhất để giúp các thành viên trong nhóm hiểu các khái niệm chung này và sử dụng chúng trong công việc.

Dưới đây là một số quy tắc tốt nhất về xử lý ngoại lệ được sử dụng bởi nhiều nhóm phát triển.

### Chỉ xử lý trong các trường hợp không bình thường

> Ngoại lệ chỉ nên được sử dụng cho các điều kiện không bình thường và không bao giờ được sử dụng trong luồng điều khiển bình thường. "Hướng dẫn về mã lệnh của Alibaba": 【Bắt buộc】Không nên xử lý các ngoại lệ RuntimeException có thể được tránh được bằng cách kiểm tra trước, ví dụ: NullPointerException, IndexOutOfBoundsException, v.v.

Ví dụ, khi phân tích một chuỗi thành số, có thể xảy ra lỗi định dạng số. Không nên sử dụng catch Exception để xử lý.

- Mã lỗi 1

```java
if (obj != null) {
  //...
}
```

- Mã lỗi 2

```java
try { 
  obj.method(); 
} catch (NullPointerException e) {
  //...
}
```

Lý do chính là:

- Thiết kế ban đầu của cơ chế ngoại lệ là để xử lý các tình huống không bình thường, do đó, việc tạo, ném và bắt ngoại lệ có giá trị cao.
- Đặt mã vào khối `try-catch` ngăn JVM thực hiện một số tối ưu hóa cụ thể mà nó có thể thực hiện.
- Mẫu chuẩn để lặp qua một mảng không gây ra kiểm tra thừa, một số JVM hiện đại sẽ tối ưu hóa chúng.

### Dọn dẹp tài nguyên trong khối finally hoặc sử dụng try-with-resource

Khi sử dụng các tài nguyên như `InputStream` cần đóng sau khi sử dụng, một lỗi phổ biến là đóng tài nguyên cuối cùng trong khối `try`.

- Ví dụ lỗi

```java
public void doNotCloseResourceInTry() {
    FileInputStream inputStream = null;
    try {
        File file = new File("./tmp.txt");
        inputStream = new FileInputStream(file);
		// use the inputStream to read a file
        // do NOT do this
        inputStream.close();
    } catch (FileNotFoundException e) {
        log.error(e);
    } catch (IOException e) {
        log.error(e);
    }
}
```

Vấn đề là chỉ khi không có ngoại lệ được ném ra, đoạn mã này mới hoạt động đúng. Khối `try` sẽ được thực thi và tài nguyên có thể được đóng. Nhưng khi sử dụng khối `try` là vì một lý do cụ thể, thường là gọi một hoặc nhiều phương thức có thể ném ra ngoại lệ và bạn cũng có thể ném ra một ngoại lệ của riêng bạn, điều này có nghĩa là đoạn mã có thể không thực thi đến cuối khối `try`. Kết quả là bạn không đóng tài nguyên.

Vì vậy, bạn nên đặt mã dọn dẹp vào khối `finally` hoặc sử dụng tính năng `try-with-resource`.

- Phương pháp 1: Sử dụng khối `finally`

Khác với một số dòng mã `try` trước đó, khối `finally` luôn được thực thi. Không quan trọng là khối `try` thực thi thành công sau đó hoặc bạn xử lý ngoại lệ trong khối `catch`, khối `finally` sẽ luôn được thực thi. Do đó, bạn có thể đảm bảo rằng bạn đã dọn dẹp tất cả các tài nguyên đã mở.

```java
public void closeResourceInFinally() {
    FileInputStream inputStream = null;
    try {
        File file = new File("./tmp.txt");
        inputStream = new FileInputStream(file);
        // use the inputStream to read a file
    } catch (FileNotFoundException e) {
        log.error(e);
    } finally {
        if (inputStream != null) {
            try {
                inputStream.close();
            } catch (IOException e) {
                log.error(e);
            }
        }
    }
}
```

- Phương pháp 2: Cú pháp try-with-resource của Java 7

Nếu tài nguyên của bạn triển khai giao diện `AutoCloseable`, bạn có thể sử dụng cú pháp này. Hầu hết các tài nguyên tiêu chuẩn của Java đều kế thừa giao diện này. Khi bạn mở tài nguyên trong mệnh đề `try`, tài nguyên sẽ tự động đóng sau khi mệnh đề `try` hoặc xử lý ngoại lệ kết thúc.

```java
public void automaticallyCloseResource() {
    File file = new File("./tmp.txt");
    try (FileInputStream inputStream = new FileInputStream(file);) {
        // use the inputStream to read a file
    } catch (FileNotFoundException e) {
        log.error(e);
    } catch (IOException e) {
        log.error(e);
    }
}

```

### Sử dụng các ngoại lệ tiêu chuẩn một cách tối đa

> Việc tái sử dụng mã là một nguyên tắc được khuyến khích, và điều này cũng áp dụng cho các ngoại lệ.

Việc tái sử dụng các ngoại lệ hiện có có một số lợi ích:

- Nó làm cho API của bạn dễ học và sử dụng hơn, vì nó tuân thủ các quy ước mà các lập trình viên đã quen thuộc.
- Đối với các chương trình sử dụng API này, mã của chúng dễ đọc hơn, vì nó không chứa các ngoại lệ mà lập trình viên không quen thuộc.
- Số lượng lớp ngoại lệ càng ít, thì bộ nhớ chiếm dụng càng nhỏ và thời gian tải các lớp này cũng ít hơn.

Có một số ngoại lệ tiêu chuẩn trong Java được sử dụng thường xuyên. Dưới đây là một số ví dụ:

|Ngoại lệ|Sử dụng|
|---|---|
|IllegalArgumentException|Giá trị tham số không hợp lệ|
|IllegalStateException|Trạng thái của đối tượng không hợp lệ|
|NullPointerException|Tham số có giá trị null trong trường hợp không cho phép null|
|IndexOutOfBoundsException|Vượt quá giới hạn chỉ mục|
|ConcurrentModificationException|Sự thay đổi đồng thời của đối tượng trong trường hợp không cho phép thay đổi đồng thời|
|UnsupportedOperationException|Đối tượng không hỗ trợ phương thức được yêu cầu bởi khách hàng|

Mặc dù đây là các ngoại lệ tiêu chuẩn được sử dụng nhiều nhất trong thư viện Java, nhưng trong một số trường hợp, bạn cũng có thể tái sử dụng các ngoại lệ khác nếu điều đó được phép. Ví dụ, nếu bạn đang triển khai một đối tượng toán học như số phức hoặc ma trận, việc tái sử dụng `ArithmeticException` hoặc `NumberFormatException` sẽ rất hợp lý. Nếu một ngoại lệ phù hợp với nhu cầu của bạn, hãy sử dụng nó mà không ngần ngại, nhưng hãy đảm bảo rằng điều kiện ném ngoại lệ phù hợp với mô tả điều kiện của ngoại lệ trong tài liệu. Việc tái sử dụng ngoại lệ phải dựa trên ý nghĩa của nó, không chỉ là tên của nó.

Cuối cùng, hãy nhớ rằng không có quy tắc cứng nhắc về việc chọn ngoại lệ để tái sử dụng. Ví dụ, trong trường hợp đối tượng bài tây, giả sử có một phương thức để chia bài, tham số (số lượng bài) của phương thức này có thể được hiểu là quá lớn so với số lượng bài còn lại trong bộ bài. Trong trường hợp này, điều này có thể được hiểu là `IllegalArgumentException` (số lượng bài quá lớn) hoặc `IllegalStateException` (số lượng bài quá ít so với yêu cầu của khách hàng).

### Mô tả ngoại lệ trong tài liệu

> Khi khai báo ngoại lệ được ném ra từ một phương thức, cũng cần mô tả ngoại lệ trong tài liệu. Mục đích là cung cấp cho trình gọi càng nhiều thông tin càng tốt để tránh hoặc xử lý ngoại lệ một cách tốt nhất.

Thêm `@throws` vào Javadoc và mô tả các tình huống ngoại lệ được ném ra.

```java
/**
* Method description
* 
* @throws MyBusinessException - businuess exception description
*/
public void doSomething(String input) throws MyBusinessException {
   // ...
}
```

Đồng thời, khi ném ra ngoại lệ `MyBusinessException`, cần mô tả vấn đề và thông tin liên quan một cách chính xác nhất, để dễ đọc hơn cho việc in ra log hoặc xem trong công cụ giám sát, từ đó dễ dàng xác định thông tin lỗi cụ thể, mức độ nghiêm trọng của lỗi, v.v.

### Ưu tiên bắt ngoại lệ cụ thể nhất

> Hầu hết các IDE đều hỗ trợ việc thực hiện quy tắc tốt này. Khi bạn cố gắng bắt ngoại lệ không cụ thể đầu tiên, chúng sẽ báo lỗi về các khối mã không thể truy cập được.

Tuy nhiên, chỉ có khối `catch` phù hợp với ngoại lệ đầu tiên sẽ được thực thi. Do đó, nếu bạn bắt đầu bằng việc bắt `IllegalArgumentException` (không cụ thể) trước, bạn sẽ không bao giờ đến được khối `catch` xử lý `NumberFormatException` (cụ thể hơn), vì nó là một lớp con của `IllegalArgumentException`.

Luôn luôn ưu tiên bắt ngoại lệ cụ thể nhất và thêm các khối catch ít cụ thể hơn vào cuối danh sách.

Dưới đây là một ví dụ về một câu lệnh `try-catch`. Khối `catch` đầu tiên xử lý tất cả các ngoại lệ `NumberFormatException`, khối catch thứ hai xử lý tất cả các ngoại lệ `IllegalArgumentException` không phải là `NumberFormatException`.

```java
public void catchMostSpecificExceptionFirst() {
    try {
        doSomething("A message");
    } catch (NumberFormatException e) {
        log.error(e);
    } catch (IllegalArgumentException e) {
        log.error(e)
    }
}
```

### Không nên bắt lớp Throwable

> Throwable là lớp cha của tất cả các ngoại lệ và lỗi. Bạn có thể sử dụng nó trong khối catch, nhưng bạn không bao giờ nên làm điều đó!

Nếu bạn sử dụng `Throwable` trong khối catch, nó không chỉ bắt tất cả các ngoại lệ mà còn bắt tất cả các lỗi. JVM ném ra lỗi để chỉ ra các vấn đề nghiêm trọng không nên được xử lý bởi ứng dụng. Ví dụ điển hình là `OutOfMemoryError` hoặc `StackOverflowError`. Cả hai đều là các tình huống nằm ngoài tầm kiểm soát của ứng dụng và không thể xử lý được.

Vì vậy, tốt nhất là không bắt `Throwable`, trừ khi bạn chắc chắn rằng bạn đang ở trong một tình huống đặc biệt có thể xử lý lỗi.

```java
public void doNotCatchThrowable() {
    try {
        // do something
    } catch (Throwable t) {
        // don't do this!
    }
}
```

### Không nên bỏ qua ngoại lệ

> Rất nhiều lần, các nhà phát triển tự tin rằng không có ngoại lệ nào sẽ xảy ra, vì vậy họ viết một khối catch nhưng không làm gì hoặc ghi log.

```java
public void doNotIgnoreExceptions() {
    try {
        // do something
    } catch (NumberFormatException e) {
        // điều này không bao giờ xảy ra
    }
}
```

Tuy nhiên, thực tế là có thể xảy ra các ngoại lệ không thể dự đoán hoặc không thể xác định liệu mã này có thay đổi trong tương lai (ví dụ: xóa mã ngăn chặn ngoại lệ), điều này khiến việc không có đủ thông tin lỗi để xác định vấn đề.

Phương pháp hợp lý là ghi lại thông tin về ngoại lệ ít nhất.

```java
public void logAnException() {
    try {
        // do something
    } catch (NumberFormatException e) {
        log.error("This should never happen: " + e); // see this line
    }
}
```

### Không nên ghi log và ném lại ngoại lệ

> Đây có thể là một trong những quy tắc tốt nhất trong bài viết này mà thường bị bỏ qua.

Có thể thấy rất nhiều mã hoặc thư viện có một khối `catch` để bắt ngoại lệ, ghi log và sau đó ném lại ngoại lệ. Ví dụ:

```java
try {
    new Long("xyz");
} catch (NumberFormatException e) {
    log.error(e);
    throw e;
}
```

Quy trình này thường dẫn đến việc ghi log nhiều lần cho cùng một ngoại lệ. Ví dụ:

```java
17:44:28,945 ERROR TestExceptionHandling:65 - java.lang.NumberFormatException: For input string: "xyz"
Exception in thread "main" java.lang.NumberFormatException: For input string: "xyz"
at java.lang.NumberFormatException.forInputString(NumberFormatException.java:65)
at java.lang.Long.parseLong(Long.java:589)
at java.lang.Long.(Long.java:965)
at com.stackify.example.TestExceptionHandling.logAndThrowException(TestExceptionHandling.java:63)
at com.stackify.example.TestExceptionHandling.main(TestExceptionHandling.java:58)
```

Như bạn có thể thấy, các thông báo log sau không cung cấp bất kỳ thông tin hữu ích nào. Nếu bạn muốn cung cấp thông tin hữu ích hơn, bạn có thể bọc ngoại lệ trong một ngoại lệ tùy chỉnh.

```java
public void wrapException(String input) throws MyBusinessException {
    try {
        // do something
    } catch (NumberFormatException e) {
        throw new MyBusinessException("A message that describes the error.", e);
    }
}
```

Do đó, chỉ nên bắt ngoại lệ khi bạn muốn xử lý nó, nếu không chỉ cần khai báo nó trong chữ ký phương thức để cho trình gọi xử lý.

### Không nên bỏ qua ngoại lệ gốc khi bao gói ngoại lệ

Việc bắt ngoại lệ tiêu chuẩn và bao gói nó thành một ngoại lệ tùy chỉnh là một thực hành phổ biến. Điều này cho phép thêm thông tin cụ thể về ngoại lệ và xử lý ngoại lệ một cách tương ứng. Khi làm như vậy, hãy đảm bảo đặt ngoại lệ gốc làm nguyên nhân (xem ví dụ dưới đây với `NumberFormatException` e). Lớp `Exception` cung cấp một phương thức đặc biệt để nhận một `Throwable` làm tham số. Nếu không làm như vậy, bạn sẽ mất thông tin về ngăn xếp và thông báo của ngoại lệ gốc, điều này làm cho việc phân tích sự kiện gây ra ngoại lệ trở nên khó khăn.

```java
public void wrapException(String input) throws MyBusinessException {
    try {
        // thực hiện một số công việc
    } catch (NumberFormatException e) {
        throw new MyBusinessException("A message that describes the error.", e);
    }
}
```

### Không sử dụng ngoại lệ để điều khiển luồng chương trình

Không nên sử dụng ngoại lệ để điều khiển luồng chương trình, ví dụ: sử dụng ngoại lệ để thay thế cho câu lệnh if trong trường hợp kiểm tra điều kiện. Điều này là một thói quen xấu và ảnh hưởng nghiêm trọng đến hiệu suất của ứng dụng.

### Không sử dụng return trong khối finally

Khi sử dụng câu lệnh `return` trong khối `try`, nó không trả về ngay lập tức, mà sẽ tiếp tục thực thi các câu lệnh trong khối `finally`. Nếu có câu lệnh `return` trong đó, nó sẽ trả về ngay tại đó và bỏ qua điểm trả về của khối try.

Dưới đây là một ví dụ về một trường hợp không tốt:

```java
private int x = 0;
public int checkReturn() {
    try {
        // x = 1, không trả về ở đây
        return ++x;
    } finally {
        // Kết quả trả về là 2
        return ++x;
    }
}
```

## Hiểu sâu về ngoại lệ

### JVM xử lý ngoại lệ như thế nào?

Để hiểu cơ chế xử lý ngoại lệ của JVM, chúng ta cần nhắc đến Exception Table, sau đây gọi là bảng xử lý ngoại lệ. Tuy nhiên, trước tiên hãy xem một ví dụ đơn giản về cách Java xử lý ngoại lệ.

```java
public static void simpleTryCatch() {
   try {
       testNPE();
   } catch (Exception e) {
       e.printStackTrace();
   }
}
```

Đoạn mã trên là một ví dụ đơn giản để bắt và xử lý một ngoại lệ null pointer exception.

Tuy nhiên, nếu chỉ nhìn vào đoạn mã đơn giản như vậy, chúng ta khó có thể nhìn thấy điều gì đó sâu sắc hơn và không có nội dung mà bài viết hôm nay muốn thảo luận.

Vì vậy, chúng ta cần sử dụng một công cụ mạnh mẽ, đó là `javap`, một công cụ để phân tích các tệp `class`, được cung cấp bởi **JDK**.

Sau đó, chúng ta sử dụng `javap` để phân tích đoạn mã này (cần biên dịch trước bằng `javac`).

```java
//javap -c Main
 public static void simpleTryCatch();
    Code:
       0: invokestatic  #3                  // Method testNPE:()V
       3: goto          11
       6: astore_0
       7: aload_0
       8: invokevirtual #5                  // Method java/lang/Exception.printStackTrace:()V
      11: return
    Exception table:
       from    to  target type
           0     3     6   Class java/lang/Exception
```

Nhìn vào đoạn mã trên, bạn có thể cảm thấy vui mừng vì cuối cùng đã thấy **Exception table**, đó chính là bảng xử lý ngoại lệ mà chúng ta muốn nghiên cứu.

Bảng xử lý ngoại lệ chứa thông tin về một hoặc nhiều trình xử lý ngoại lệ (**Exception Handler**), thông tin này bao gồm:

- **from**: Điểm bắt đầu có thể xảy ra ngoại lệ
- **to**: Điểm kết thúc có thể xảy ra ngoại lệ
- **target**: Vị trí của trình xử lý ngoại lệ sau khi xảy ra ngoại lệ từ from đến to
- **type**: Thông tin về lớp xử lý ngoại lệ mà trình xử lý xử lý

**Vậy bảng xử lý ngoại lệ được sử dụng khi nào?**

Câu trả lời là khi có một ngoại lệ xảy ra, khi một ngoại lệ xảy ra:

- 1. JVM sẽ tìm trong phương thức hiện tại có bảng xử lý ngoại lệ nào phù hợp để xử lý ngoại lệ hay không.
- 2. Nếu bảng xử lý ngoại lệ của phương thức hiện tại không rỗng và ngoại lệ phù hợp với các nút from và to của trình xử lý, cũng như kiểu ngoại lệ, JVM sẽ gọi trình gọi ở vị trí target để xử lý.
- 3. Nếu không tìm thấy trình xử lý phù hợp theo quy tắc trên, JVM sẽ tiếp tục tìm kiếm các mục còn lại trong bảng xử lý ngoại lệ.
- 4. Nếu bảng xử lý ngoại lệ của phương thức hiện tại không thể xử lý, JVM sẽ tìm kiếm ngược (pop the stack) đến vị trí gọi phương thức cuối cùng và lặp lại các bước trên.
- 5. Nếu tất cả các khung stack đã được pop và không có xử lý ngoại lệ, ngoại lệ sẽ được ném cho Thread hiện tại và Thread sẽ kết thúc.
- 6. Nếu Thread hiện tại là Thread cuối cùng không phải là daemon thread và không có ngoại lệ được xử lý, JVM sẽ dừng hoạt động.

Đó là một số cơ chế mà JVM sử dụng để xử lý ngoại lệ.

**Try-catch-finally**

Ngoài việc sử dụng `try-catch` đơn giản, chúng ta thường kết hợp nó với `finally`. Ví dụ như đoạn mã sau:

```java
public static void simpleTryCatchFinally() {
   try {
       testNPE();
   } catch (Exception e) {
       e.printStackTrace();
   } finally {
       System.out.println("Finally");
   }
}
```

Chúng ta cũng sử dụng javap để phân tích đoạn mã này.

```java
public static void simpleTryCatchFinally();
    Code:
       0: invokestatic  #3                  // Method testNPE:()V
       3: getstatic     #6                  // Field java/lang/System.out:Ljava/io/PrintStream;
       6: ldc           #7                  // String Finally
       8: invokevirtual #8                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      11: goto          41
      14: astore_0
      15: aload_0
      16: invokevirtual #5                  // Method java/lang/Exception.printStackTrace:()V
      19: getstatic     #6                  // Field java/lang/System.out:Ljava/io/PrintStream;
      22: ldc           #7                  // String Finally
      24: invokevirtual #8                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      27: goto          41
      30: astore_1
      31: getstatic     #6                  // Field java/lang/System.out:Ljava/io/PrintStream;
      34: ldc           #7                  // String Finally
      36: invokevirtual #8                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      39: aload_1
      40: athrow
      41: return
    Exception table:
       from    to  target type
           0     3    14   Class java/lang/Exception
           0     3    30   any
          14    19    30   any
```

Khác với trước đây, lần này bảng xử lý ngoại lệ có ba mục, trong khi chúng ta chỉ bắt một `Exception`. Hai mục cuối cùng trong bảng xử lý ngoại lệ có kiểu `any`; Ba mục trong bảng xử lý ngoại lệ có ý nghĩa như sau:

- Nếu có ngoại lệ kiểu `Exception` xảy ra từ 0 đến 3 (tức là try block), gọi trình xử lý ngoại lệ ở vị trí 14.
- Nếu có bất kỳ ngoại lệ nào xảy ra từ 0 đến 3 (tức là `try block`), gọi trình xử lý ở vị trí 30.
- Nếu có bất kỳ ngoại lệ nào xảy ra từ 14 đến 19 (tức là phần `catch`), gọi trình xử lý ở vị trí 30.

Tiếp tục phân tích mã Java trên, phần `finally` đã được trích xuất vào phần try và phần `catch`. Chúng ta hãy chạy lại mã để xem kết quả.

```java
public static void simpleTryCatchFinally();
    Code:
      // Phần try đã trích xuất mã finally, nếu không có ngoại lệ xảy ra, thì thực hiện in ra "Finally" và tiếp tục đến vị trí 41 để kết thúc hàm.

       0: invokestatic  #3                  // Method testNPE:()V
       3: getstatic     #6                  // Field java/lang/System.out:Ljava/io/PrintStream;
       6: ldc           #7                  // String Finally
       8: invokevirtual #8                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      11: goto          41

      // Phần catch đã trích xuất mã finally, nếu không có ngoại lệ xảy ra, thì thực hiện in ra "Finally" và tiếp tục đến vị trí 41 để kết thúc hàm.
      14: astore_0
      15: aload_0
      16: invokevirtual #5                  // Method java/lang/Exception.printStackTrace:()V
      19: getstatic     #6                  // Field java/lang/System.out:Ljava/io/PrintStream;
      22: ldc           #7                  // String Finally
      24: invokevirtual #8                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      27: goto          41
      // Phần finally có thể được gọi từ phần try hoặc phần catch nếu có ngoại lệ xảy ra.
      30: astore_1
      31: getstatic     #6                  // Field java/lang/System.out:Ljava/io/PrintStream;
      34: ldc           #7                  // String Finally
      36: invokevirtual #8                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      39: aload_1
      40: athrow     // Nếu ngoại lệ không được bắt, mà đến đây, sau khi thực hiện câu lệnh trong finally, ngoại lệ vẫn phải được ném ra để chuyển đến nơi gọi hàm.
      41: return
```

**Vấn đề về thứ tự catch**

Thứ tự catch trong mã của chúng ta xác định vị trí xử lý ngoại lệ trong bảng ngoại lệ, vì vậy, ngoại lệ cụ thể hơn phải được xử lý trước, nếu không sẽ gặp vấn đề như sau:

```java
private static void misuseCatchException() {
   try {
       testNPE();
   } catch (Throwable t) {
       t.printStackTrace();
   } catch (Exception e) { // Lỗi xảy ra trong quá trình biên dịch với thông báo Lỗi Exception Java.lang.Exception đã được bắt trước đó.
       e.printStackTrace();
   }
}
```

Đoạn mã này sẽ không biên dịch thành công, vì việc bắt `Throwable` trước rồi mới bắt `Exception` sẽ khiến catch sau mãi mãi không được thực thi.

**Vấn đề về Return và finally**

Đây là một vấn đề tương đối cực đoan mà chúng ta mở rộng, đó là khi có cả câu lệnh `return` và `finally`, liệu `finally` có được thực thi hay không.

```java
public static String tryCatchReturn() {
   try {
       testNPE();
       return  "OK";
   } catch (Exception e) {
       return "ERROR";
   } finally {
       System.out.println("tryCatchReturn");
   }
}
```

Đáp án là `finally` sẽ được thực thi. Chúng ta hãy sử dụng phương pháp trên để xem tại sao `finally` được thực thi.

```java
public static java.lang.String tryCatchReturn();
    Code:
       0: invokestatic  #3                  // Method testNPE:()V
       3: ldc           #6                  // String OK
       5: astore_0
       6: getstatic     #7                  // Field java/lang/System.out:Ljava/io/PrintStream;
       9: ldc           #8                  // String tryCatchReturn
      11: invokevirtual #9                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      14: aload_0
      15: areturn       Trả về chuỗi "OK", areturn có nghĩa là trả về một tham chiếu từ một phương thức
      16: astore_0
      17: ldc           #10                 // String ERROR
      19: astore_1
      20: getstatic     #7                  // Field java/lang/System.out:Ljava/io/PrintStream;
      23: ldc           #8                  // String tryCatchReturn
      25: invokevirtual #9                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      28: aload_1
      29: areturn  Trả về chuỗi "ERROR"
      30: astore_2
      31: getstatic     #7                  // Field java/lang/System.out:Ljava/io/PrintStream;
      34: ldc           #8                  // String tryCatchReturn
      36: invokevirtual #9                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      39: aload_2
      40: athrow   Nếu có ngoại lệ chưa được xử lý trong catch, nó sẽ được ném ra.
```

### Các ngoại lệ có tốn thời gian không? Tại sao lại tốn thời gian?

Nói về tốc độ chậm của việc sử dụng ngoại lệ, trước tiên hãy xem xét nơi mà nó chậm như thế nào và chậm bao nhiêu. Dưới đây là một số trường hợp kiểm thử đơn giản để so sánh thời gian mất để tạo đối tượng, tạo đối tượng ngoại lệ và ném và bắt đối tượng ngoại lệ:

```java
public class ExceptionTest {  
  
    private int testTimes;  
  
    public ExceptionTest(int testTimes) {  
        this.testTimes = testTimes;  
    }  
  
    public void newObject() {  
        long l = System.nanoTime();  
        for (int i = 0; i < testTimes; i++) {  
            new Object();  
        }  
        System.out.println("Tạo đối tượng: " + (System.nanoTime() - l));  
    }  
  
    public void newException() {  
        long l = System.nanoTime();  
        for (int i = 0; i < testTimes; i++) {  
            new Exception();  
        }  
        System.out.println("Tạo đối tượng ngoại lệ: " + (System.nanoTime() - l));  
    }  
  
    public void catchException() {  
        long l = System.nanoTime();  
        for (int i = 0; i < testTimes; i++) {  
            try {  
                throw new Exception();  
            } catch (Exception e) {  
            }  
        }  
        System.out.println("Tạo, ném và bắt đối tượng ngoại lệ: " + (System.nanoTime() - l));  
    }  
  
    public static void main(String[] args) {  
        ExceptionTest test = new ExceptionTest(10000);  
        test.newObject();  
        test.newException();  
        test.catchException();  
    }  
}  
```

Kết quả chạy:

```bash
Tạo đối tượng: 575817  
Tạo đối tượng ngoại lệ: 9589080  
Tạo, ném và bắt đối tượng ngoại lệ: 47394475  
```

Tạo một đối tượng ngoại lệ mất khoảng 20 lần thời gian so với việc tạo một đối tượng thông thường (thực tế, khoảng cách này sẽ lớn hơn nhiều vì vòng lặp cũng mất thời gian, độc giả muốn chính xác hơn có thể đo thời gian của vòng lặp trống và trừ đi phần này trước khi so sánh), trong khi việc ném và bắt đối tượng ngoại lệ mất khoảng 4 lần thời gian so với việc tạo đối tượng ngoại lệ.

## Best Practices

- Sử dụng các ngoại lệ kiểm tra (Exception) cho các trường hợp có thể khôi phục được, sử dụng các ngoại lệ chạy (RuntimeException) cho các lỗi lập trình.
- Ưu tiên sử dụng các ngoại lệ tiêu chuẩn của Java.
- Ném các ngoại lệ tương ứng với trừu tượng tương ứng.
- Bao gồm thông tin có thể dẫn đến việc xảy ra lỗi trong thông điệp chi tiết.
- Giảm kích thước của khối try càng nhỏ càng tốt.
- Giới hạn phạm vi của ngoại lệ càng nhỏ càng tốt. Ví dụ, nếu bạn biết rằng bạn chỉ đang cố gắng bắt một ArithmeticException, hãy bắt ArithmeticException thay vì RuntimeException hoặc thậm chí là Exception có phạm vi lớn hơn.
- Tránh ném ngoại lệ hoặc trả về giá trị trong khối finally.
- Không bỏ qua ngoại lệ, một khi đã bắt được ngoại lệ, bạn nên xử lý nó thay vì bỏ qua nó.
- Xử lý ngoại lệ rất chậm, vì vậy không nên sử dụng ngoại lệ để xử lý logic kinh doanh.
- Mỗi loại ngoại lệ phải có ghi chú riêng, phân loại và quản lý theo cấp độ, vì đôi khi chỉ muốn hiển thị ngoại lệ logic cho nhà quản trị hệ thống thứ ba mà không phải là thông tin chi tiết hơn.
- Cách phân loại ngoại lệ:
	- Ngoại lệ logic, được sử dụng để mô tả các tình huống không thể xử lý theo cách dự kiến trong kinh doanh, đó là những sự cố do người dùng tạo ra.
	- Lỗi mã, được sử dụng để mô tả các lỗi mã lập trình, ví dụ: NPE, ILLARG, đều là lỗi do lập trình viên tạo ra.
	- Ngoại lệ đặc biệt, thường được sử dụng trong các tình huống kinh doanh cụ thể, để mô tả các tình huống không thể xử lý trước đó của công việc cụ thể.
