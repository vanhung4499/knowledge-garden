---
title: JavaIO Utility Classes
tags: [java, javase, io]
categories: [java, javase]
date created: 2023-07-15
date modified: 2023-07-15
---

# Lớp tiện ích IO trong Java

> **Keyword**: `File`, `RandomAccessFile`, `System`, `Scanner`
>
> Bài viết này giới thiệu về cách sử dụng và tính năng của một số lớp tiện ích IO phổ biến trong Java.

## File

Lớp `File` là lớp duy nhất trong gói `java.io` được sử dụng để thao tác trực tiếp với tệp tin. Nó cho phép thêm, xóa và truy vấn tệp tin và thư mục.

### createNewFile

**Có thể sử dụng phương thức `createNewFile()` để tạo một tệp tin mới**.

Lưu ý:

- Trong Windows, ký tự `\` được sử dụng để phân tách thư mục.
- Trong Linux/macOS, ký tự `/` được sử dụng để phân tách thư mục.

Tốt nhất là sử dụng hằng số tĩnh `File.separator`, nó sẽ tự động chọn ký tự phân tách thư mục tương ứng với hệ điều hành.

【Ví dụ】Tạo tệp tin

```java
File f = new File(filename);
boolean flag = f.createNewFile();
```

### mkdir

**Có thể sử dụng phương thức `mkdir()` để tạo một thư mục**. Tuy nhiên, nếu thư mục cha không tồn tại, thì không thể tạo thành công.

Để giải quyết vấn đề này, có thể sử dụng `mkdirs()`, nếu thư mục cha không tồn tại, nó sẽ tự động tạo cả thư mục cha.

【Ví dụ】Tạo thư mục

```java
File f = new File(filename);
boolean flag = f.mkdir();
```

### delete

**Có thể sử dụng phương thức `delete()` để xóa tệp tin hoặc thư mục**.

Lưu ý rằng, nếu xóa một thư mục và thư mục không trống, việc xóa bằng cách sử dụng `delete()` sẽ thất bại.

【Ví dụ】Xóa tệp tin hoặc thư mục

```java
File f = new File(filename);
boolean flag = f.delete();
```

### list và listFiles

Lớp `File` cung cấp hai phương thức để liệt kê nội dung của thư mục:

- **`list()`: Liệt kê tất cả các tên, trả về một mảng chuỗi**.
- **`listFiles()`: Liệt kê tất cả các đường dẫn đầy đủ, trả về một mảng đối tượng `File`**.

【Ví dụ】Liệt kê tệp tin và thư mục

```java
File f = new File(filename);
String str[] = f.list(); // Liệt kê tất cả các tên
File files[] = f.listFiles(); // Liệt kê tất cả các đường dẫn
```

## RandomAccessFile

> Lưu ý: Mặc dù lớp `RandomAccessFile` cho phép đọc và ghi nội dung của tệp tin, nhưng nó khá phức tạp. Vì vậy, thường sử dụng byte stream hoặc stream ký tự để thao tác với nội dung của tệp tin.

Lớp `RandomAccessFile` là một lớp đọc/ghi ngẫu nhiên, nó là một lớp độc lập hoàn toàn.

Nó được sử dụng cho các tệp tin gồm các bản ghi có kích thước đã biết trước, vì vậy chúng ta có thể sử dụng `seek()` để di chuyển bản ghi từ một vị trí này sang vị trí khác, sau đó đọc hoặc sửa đổi bản ghi.

Kích thước của các bản ghi trong tệp tin không nhất thiết phải giống nhau, chỉ cần xác định kích thước của các bản ghi và vị trí của chúng trong tệp tin là đủ.

### Ghi RandomAccessFile

Khi khai báo đối tượng `RandomAccessFile` với chế độ `rw`, nếu file mà chúng ta muốn ghi không tồn tại, hệ thống sẽ tự động tạo mới.

- `r` là chỉ đọc
- `w` là chỉ ghi
- `rw` là đọc và ghi.

【Ví dụ】Ghi ngẫu nhiên vào file

```java
public class RandomAccessFileDemo01 {

    public static void main(String args[]) throws IOException {
        File f = new File("d:" + File.separator + "test.txt"); // Chỉ định file cần thao tác
        RandomAccessFile rdf = null; // Khai báo đối tượng của lớp RandomAccessFile
        rdf = new RandomAccessFile(f, "rw");// Chế độ đọc và ghi, nếu file không tồn tại, sẽ tự động tạo mới
        String name = null;
        int age = 0;
        name = "zhangsan"; // Độ dài chuỗi là 8
        age = 30; // Độ dài số là 4
        rdf.writeBytes(name); // Ghi tên vào file
        rdf.writeInt(age); // Ghi tuổi vào file
        name = "lisi    "; // Độ dài chuỗi là 8
        age = 31; // Độ dài số là 4
        rdf.writeBytes(name); // Ghi tên vào file
        rdf.writeInt(age); // Ghi tuổi vào file
        name = "wangwu  "; // Độ dài chuỗi là 8
        age = 32; // Độ dài số là 4
        rdf.writeBytes(name); // Ghi tên vào file
        rdf.writeInt(age); // Ghi tuổi vào file
        rdf.close(); // Đóng file
    }
}
```

### Đọc RandomAccessFile

Để đọc file, chúng ta chỉ cần sử dụng chế độ `r`, mở file ở chế độ chỉ đọc.

Khi đọc, tất cả các chuỗi chỉ có thể được đọc dưới dạng mảng byte và độ dài phải khớp với độ dài cố định khi ghi vào.

```java
public class RandomAccessFileDemo02 {

    public static void main(String args[]) throws IOException {
        File f = new File("d:" + File.separator + "test.txt");    // Chỉ định file cần thao tác
        RandomAccessFile rdf = null;        // Khai báo đối tượng của lớp RandomAccessFile
        rdf = new RandomAccessFile(f, "r");// Mở file ở chế độ chỉ đọc
        String name = null;
        int age = 0;
        byte b[] = new byte[8];    // Khởi tạo mảng byte
        // Đọc thông tin của người thứ hai, có nghĩa là bỏ qua thông tin của người thứ nhất
        rdf.skipBytes(12);        // Bỏ qua thông tin của người thứ nhất
        for (int i = 0; i < b.length; i++) {
            b[i] = rdf.readByte();    // Đọc một byte
        }
        name = new String(b);    // Chuyển đổi mảng byte đã đọc thành chuỗi
        age = rdf.readInt();    // Đọc số
        System.out.println("Thông tin người thứ hai --> Tên: " + name + "；Tuổi: " + age);
        // Đọc thông tin của người thứ nhất
        rdf.seek(0);    // Đưa con trỏ về đầu file
        for (int i = 0; i < b.length; i++) {
            b[i] = rdf.readByte();    // Đọc một byte
        }
        name = new String(b);    // Chuyển đổi mảng byte đã đọc thành chuỗi
        age = rdf.readInt();    // Đọc số
        System.out.println("Thông tin người thứ nhất --> Tên: " + name + "；Tuổi: " + age);
        rdf.skipBytes(12);    // Bỏ qua thông tin của người thứ hai
        for (int i = 0; i < b.length; i++) {
            b[i] = rdf.readByte();    // Đọc một byte
        }
        name = new String(b);    // Chuyển đổi mảng byte đã đọc thành chuỗi
        age = rdf.readInt();    // Đọc số
        System.out.println("Thông tin người thứ ba --> Tên: " + name + "；Tuổi: " + age);
        rdf.close();                // Đóng file
    }
}
```

## System

Lớp `System` cung cấp nhiều phương thức tĩnh để lấy thông tin liên quan đến hệ thống hoặc thực hiện các hoạt động cấp hệ thống. Trong đó, có ba thành viên tĩnh thường được sử dụng trong IO:

- `System.out` - Một stream PrintStream. System.out thường được sử dụng để in dữ liệu ra màn hình console. System.out thường chỉ được sử dụng trong các chương trình dòng lệnh tương tự. System.out cũng thường được sử dụng để in thông tin gỡ lỗi của chương trình (mặc dù nó không phải là cách tốt nhất để lấy thông tin gỡ lỗi của chương trình).
- `System.err` - Một stream PrintStream. System.err hoạt động tương tự như System.out, nhưng nó được sử dụng chủ yếu để in ra các thông báo lỗi. Một số chương trình như Eclipse sẽ in thông báo lỗi dưới dạng văn bản màu đỏ thông qua System.err để làm nổi bật thông báo lỗi.
- `System.in` - Một stream InputStream kết nối với bàn phím. Thông thường, khi dữ liệu được truyền cho chương trình Java dòng lệnh thông qua tham số dòng lệnh hoặc tệp cấu hình, System.in không được sử dụng nhiều. Các chương trình giao diện đồ họa sẽ truyền tham số cho chương trình thông qua giao diện, đây là một cơ chế IO đầu vào riêng biệt.

【Ví dụ】Chuyển hướng stream xuất của `System.out`

```java
import java.io.*;
public class SystemOutDemo {

    public static void main(String args[]) throws Exception {
        OutputStream out = new FileOutputStream("d:\\test.txt");
        PrintStream ps = new PrintStream(out);
        System.setOut(ps);
        System.out.println("Xin chào!");
        ps.close();
        out.close();
    }
}
```

【Ví dụ】Chuyển hướng stream đầu ra `System.err`

```java
public class SystemErrDemo {

    public static void main(String args[]) throws IOException {
        OutputStream bos = new ByteArrayOutputStream();        // Khởi tạo
        PrintStream ps = new PrintStream(bos);        // Khởi tạo
        System.setErr(ps);    // Định tuyến đầu ra
        System.err.print("Lỗi ở đây");
        System.out.println(bos);    // Đầu ra dữ liệu trong bộ nhớ
    }
}
```

【Ví dụ】`System.in` nhận thông tin đầu vào từ bàn phím

```java
import java.io.*;
public class SystemInDemo {

    public static void main(String args[]) throws IOException {
        InputStream input = System.in;
        StringBuffer buf = new StringBuffer();
        System.out.print("Vui lòng nhập nội dung: ");
        int temp = 0;
        while ((temp = input.read()) != -1) {
            char c = (char) temp;
            if (c == '\n') {
                break;
            }
            buf.append(c);
        }
        System.out.println("Nội dung đã nhập là: " + buf);
        input.close();
    }
}
```

## Scanner

**`Scanner` có thể lấy đầu vào từ người dùng và kiểm tra dữ liệu**.

【Ví dụ】Kiểm tra xem dữ liệu đầu vào có đúng định dạng không

```java
import java.io.*;
public class ScannerDemo {

    public static void main(String args[]) {
        Scanner scan = new Scanner(System.in);    // Lấy dữ liệu từ bàn phím
        int i = 0;
        float f = 0.0f;
        System.out.print("Nhập số nguyên: ");
        if (scan.hasNextInt()) {    // Kiểm tra xem dữ liệu nhập vào có phải là số nguyên không
            i = scan.nextInt();    // Lấy số nguyên
            System.out.println("Dữ liệu số nguyên: " + i);
        } else {
            System.out.println("Dữ liệu nhập vào không phải là số nguyên!");
        }

        System.out.print("Nhập số thập phân: ");
        if (scan.hasNextFloat()) {    // Kiểm tra xem dữ liệu nhập vào có phải là số thập phân không
            f = scan.nextFloat();    // Lấy số thập phân
            System.out.println("Dữ liệu số thập phân: " + f);
        } else {
            System.out.println("Dữ liệu nhập vào không phải là số thập phân!");
        }

        Date date = null;
        String str = null;
        System.out.print("Nhập ngày (yyyy-MM-dd): ");
        if (scan.hasNext("^\\d{4}-\\d{2}-\\d{2}$")) {    // Kiểm tra
            str = scan.next("^\\d{4}-\\d{2}-\\d{2}$");    // Lấy
            try {
                date = new SimpleDateFormat("yyyy-MM-dd").parse(str);
            } catch (Exception e) {}
        } else {
            System.out.println("Định dạng ngày nhập vào không đúng!");
        }
        System.out.println(date);
    }
}
```

Kết quả:

```
Nhập số nguyên: 20
Dữ liệu số nguyên: 20
Nhập số thập phân: 3.2
Dữ liệu số thập phân: 3.2
Nhập ngày (yyyy-MM-dd): 1999-13-04
Định dạng ngày nhập vào không đúng!
null
```
