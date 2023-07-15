---
title: Java IO Model
tags: [java, javase, io]
categories: [java, javase]
date created: 2023-07-15
date modified: 2023-07-15
---

# Mô hình I/O trong Java

> I/O, viết tắt của Input/Output, là quá trình sao chép dữ liệu giữa bộ nhớ máy tính và các thiết bị ngoại vi. Vì tốc độ truy cập bộ nhớ của CPU nhanh hơn rất nhiều so với các thiết bị ngoại vi, nên CPU sẽ đọc dữ liệu từ các thiết bị ngoại vi vào bộ nhớ trước, sau đó mới tiến hành xử lý.

**Keyword**: `InputStream`, `OutputStream`, `Reader`, `Writer`

## Mô hình I/O trong UNIX

Có 5 mô hình I/O trong hệ điều hành UNIX:

- I/O đồng bộ chặn
- I/O đồng bộ không chặn
- Đa kênh I/O
- I/O dựa trên tín hiệu
- I/O không đồng bộ

Để hiểu mô hình I/O trong UNIX, chúng ta có thể xem xét hai khía cạnh chính:

- Phân biệt đồng bộ hoặc không đồng bộ (đồng bộ/bất đồng bộ). Đơn giản nói, đồng bộ là một cơ chế hoạt động có thứ tự đáng tin cậy, khi chúng ta thực hiện một hoạt động đồng bộ, các tác vụ tiếp theo phải đợi cho đến khi cuộc gọi hiện tại trả về trước khi tiếp tục; trong khi bất đồng bộ thì ngược lại, các tác vụ khác không cần đợi cuộc gọi hiện tại trả về, thường dựa trên sự kiện, gọi lại và các cơ chế khác để xác định quan hệ thứ tự giữa các tác vụ.
- Phân biệt chặn và không chặn (chặn/không chặn). Trong quá trình thực hiện hoạt động chặn, luồng hiện tại sẽ bị chặn, không thể thực hiện các tác vụ khác, chỉ khi điều kiện sẵn sàng mới tiếp tục, ví dụ như kết nối mới của ServerSocket hoàn thành hoặc hoàn thành việc đọc, ghi dữ liệu; trong khi không chặn thì ngược lại, không quan tâm hoạt động I/O có kết thúc hay chưa, chỉ trả về trực tiếp, các hoạt động tương ứng tiếp tục xử lý trong nền.

Không thể tổng quát rằng đồng bộ hoặc chặn là không hiệu quả, điều này phụ thuộc vào ứng dụng và đặc điểm hệ thống.

Đối với quá trình giao tiếp I/O mạng, chẳng hạn như đọc dữ liệu mạng, liên quan đến hai đối tượng, một là luồng người dùng gọi I/O và một là kernel hệ điều hành. Không gian địa chỉ của một quá trình được chia thành không gian người dùng và không gian kernel, luồng người dùng không thể truy cập trực tiếp không gian kernel.

Khi luồng người dùng gọi I/O, quá trình đọc dữ liệu mạng sẽ trải qua hai bước:

- **Luồng người dùng đợi kernel sao chép dữ liệu từ card mạng vào không gian kernel.**
- **Kernel sao chép dữ liệu từ không gian kernel vào không gian người dùng.**

Sự khác biệt giữa các mô hình I/O là cách chúng thực hiện hai bước này.

### I/O đồng bộ chặn (Blocking I/O)

Sau khi luồng người dùng gọi read, nó sẽ bị chặn và nhường CPU. kernel đợi dữ liệu mạng đến, sao chép dữ liệu từ card mạng vào không gian kernel, sau đó sao chép dữ liệu vào không gian người dùng và đánh thức luồng người dùng.

### I/O đồng bộ không chặn (Non-blocking I/O)

Luồng người dùng liên tục gọi read, khi dữ liệu chưa đến không gian kernel, mỗi lần đều trả về thất bại, cho đến khi dữ liệu đến không gian kernel, lần gọi read này sẽ thành công, trong thời gian chờ sao chép dữ liệu từ không gian kernel vào không gian người dùng, luồng vẫn bị chặn. Khi dữ liệu đến không gian người dùng, luồng được đánh thức.

### I/O đa kênh (I/O Multiplexing)

Luồng người dùng chia thành hai bước đọc, trước tiên gọi select để hỏi kernel dữ liệu đã sẵn sàng chưa? Khi kernel đã sẵn sàng dữ liệu, luồng người dùng gọi read. Trong thời gian chờ sao chép dữ liệu từ không gian kernel vào không gian người dùng, luồng vẫn bị chặn. Vì sao gọi là đa kênh I/O? Bởi vì một lần gọi select có thể kiểm tra trạng thái của nhiều kênh dữ liệu (Channel).

### I/O dựa trên tín hiệu (Signal-driven I/O)

Trước tiên, bật chức năng I/O dựa trên tín hiệu của Socket và cài đặt một hàm xử lý tín hiệu, quá trình tiếp tục chạy mà không bị chặn. Khi dữ liệu sẵn sàng, quá trình sẽ nhận được một tín hiệu SIGIO và có thể gọi hàm I/O để xử lý dữ liệu. **Ưu điểm của mô hình I/O dựa trên tín hiệu là quá trình không bị chặn trong quá trình dữ liệu đến, chúng ta chỉ cần chờ thông báo từ hàm xử lý tín hiệu.**

### I/O bất đồng bộ (Asynchronous I/O)

Khi luồng người dùng gọi read, nó đăng ký một hàm gọi lại, read trả về ngay lập tức, chờ kernel chuẩn bị dữ liệu xong, sau đó gọi hàm gọi lại đã chỉ định để hoàn thành xử lý. Trong quá trình này, luồng người dùng không bị chặn.

## Mô hình I/O trong Java

### BIO

> BIO (Blocking IO) có nghĩa là IO chặn. Đây chủ yếu là các gói truyền thống của `java.io`, nó được thực hiện dựa trên mô hình luồng.

#### Giới thiệu về BIO

`java.io` cung cấp một số chức năng IO mà chúng ta quen thuộc như trừu tượng hoá tập tin, stream đầu vào/đầu ra, v.v. Cách tương tác là đồng bộ và chặn, có nghĩa là khi đọc stream đầu vào hoặc ghi vào stream đầu ra, luồng sẽ bị chặn cho đến khi hoàn thành đọc, ghi. Các cuộc gọi giữa chúng là tuân thủ tuần tự đáng tin cậy.

Trong nhiều trường hợp, người ta cũng xem xét một số API mạng được cung cấp trong `java.net`, như `Socket`, `ServerSocket`, `HttpURLConnection`, cũng thuộc loại thư viện IO đồng bộ chặn, vì giao tiếp mạng cũng là một hành vi IO.

Ưu điểm của BIO là mã nguồn đơn giản, dễ hiểu; nhược điểm là hiệu suất IO và khả năng mở rộng bị hạn chế, dễ trở thành điểm hạn chế hiệu suất ứng dụng.

#### Nhược điểm về hiệu suất của BIO

**BIO sẽ chặn tiến trình, không phù hợp với các tình huống đa nhiệm cao**.

Máy chủ sử dụng BIO thường có một luồng Acceptor độc lập để lắng nghe yêu cầu kết nối từ khách hàng. Máy chủ thường gọi phương thức `accept()` trong vòng lặp `while(true)` để chờ yêu cầu kết nối từ khách hàng. Khi một yêu cầu kết nối được nhận, máy chủ có thể tạo ra một Socket và thực hiện đọc/ghi dữ liệu dựa trên Socket này. Lúc này, máy chủ không thể chấp nhận yêu cầu kết nối khách hàng khác, chỉ có thể chờ đợi hoàn thành hoạt động hiện tại của kết nối hiện tại.

Nếu muốn mô hình giao tiếp BIO có thể xử lý đồng thời nhiều yêu cầu kết nối khách hàng, cần sử dụng nhiều luồng (lý do chính là `socket.accept()`, `socket.read()`, `socket.write()` đều là các hàm chặn đồng bộ), nhưng điều này sẽ tạo ra một overhead không cần thiết về luồng. Tuy nhiên, điều này có thể được cải thiện bằng cơ chế **thread pool**, thread pool cũng giúp giảm chi phí tạo và thu hồi luồng tương đối thấp.

**Ngay cả khi có thể tối ưu hóa bằng thread pool, nhưng nó vẫn tiêu tốn tài nguyên luồng quý giá và không thể chịu đựng trong tình huống hàng triệu xử lý đồng thời**. Nếu lưu lượng truy cập đồng thời tăng lên, số lượng luồng sẽ tăng một cách đáng kể, có thể gây ra các vấn đề như tràn bộ nhớ luồng, không thể tạo luồng mới, v.v., cuối cùng dẫn đến tiến trình bị treo hoặc chết, không thể cung cấp dịch vụ ngoại vi.

### NIO

> NIO (Non-blocking IO) có nghĩa là IO không chặn. Đây là gói `java.nio` được giới thiệu trong Java 1.4.

Để giải quyết vấn đề hiệu suất của BIO, gói `java.nio` được giới thiệu trong Java 1.4. NIO cải tiến việc sao chép bộ nhớ và vấn đề hiệu suất nghiêm trọng do chặn gây ra.

`java.nio` cung cấp các trừu tượng mới như `Channel`, `Selector`, `Buffer`, v.v., cho phép xây dựng chương trình IO không chặn đa luồng, đồng thời cung cấp cách tiếp cận hoạt động dữ liệu hiệu suất cao gần với hệ điều hành.

NIO có những điểm cải tiến hiệu suất nào?

#### Tối ưu hóa việc đọc/ghi dữ liệu bằng cách sử dụng bộ đệm

NIO khác với IO truyền thống, nó dựa trên khối (Block) và xử lý dữ liệu dựa trên khối. Trong NIO, hai thành phần quan trọng nhất là bộ đệm (`Buffer`) và kênh (`Channel`).

`Buffer` là một khối bộ nhớ liên tục, là bộ đệm cho việc đọc/ghi dữ liệu trong NIO. `Buffer` có thể đọc toàn bộ tệp vào bộ nhớ rồi thực hiện xử lý tiếp theo, trong khi cách truyền thống là đọc tệp và xử lý dữ liệu cùng lúc. `Channel` đại diện cho nguồn hoặc đích của dữ liệu bộ đệm, được sử dụng để đọc bộ đệm hoặc ghi dữ liệu, là giao diện truy cập vào bộ đệm.

#### Sử dụng DirectBuffer để giảm sao chép bộ nhớ

NIO cũng cung cấp một lớp có thể truy cập trực tiếp vào bộ nhớ vật lý gọi là `DirectBuffer`. `Buffer` thông thường được phân bổ trong bộ nhớ heap của JVM, trong khi `DirectBuffer` được phân bổ trực tiếp trong bộ nhớ vật lý.

Dữ liệu cần được xuất ra thiết bị ngoại vi phải được sao chép từ không gian người dùng sang không gian kernel, sau đó sao chép từ không gian kernel sang thiết bị đầu ra. `DirectBuffer` giúp đơn giản hóa quá trình này bằng cách sao chép từ không gian kernel trực tiếp sang thiết bị đầu ra, giảm số lần sao chép dữ liệu.

Ở đây, một chú thích là `DirectBuffer` yêu cầu bộ nhớ không phải là bộ nhớ JVM, vì vậy việc tạo và hủy `DirectBuffer` tốn kém. Bộ nhớ được phân bổ bởi `DirectBuffer` không được thu gom rác trực tiếp bởi JVM, nhưng khi lớp bao `DirectBuffer` được thu hồi, nó sẽ giải phóng khối bộ nhớ này thông qua cơ chế tham chiếu Java.

#### Tối ưu hóa IO, tránh chặn

IO truyền thống đọc/ghi dữ liệu bằng cách sao chép giữa không gian người dùng và không gian kernel, dữ liệu trong không gian kernel được đọc/ghi thông qua giao diện IO của hệ điều hành từ ổ đĩa. Trong NIO, `Channel` có bộ xử lý riêng, có thể thực hiện hoạt động IO giữa không gian kernel và ổ đĩa. Trong NIO, chúng ta đọc/ghi dữ liệu thông qua `Channel`, vì `Channel` là hai chiều, nên đọc và ghi có thể diễn ra cùng một lúc.

### AIO

> AIO (Asynchronous IO) có nghĩa là IO không chặn. Đây là NIO2 được giới thiệu trong Java 7, giới thiệu phương pháp IO không chặn.

Trong Java 7, NIO được cải tiến thêm, còn được gọi là NIO2, giới thiệu phương pháp IO không chặn gọi là AIO (Asynchronous IO). Hoạt động IO không chặn dựa trên sự kiện và cơ chế gọi lại, có thể đơn giản hiểu là, các hoạt động ứng dụng trả về trực tiếp mà không chặn ở đó, khi xử lý phía sau hoàn thành, hệ điều hành sẽ thông báo cho luồng tương ứng tiếp tục công việc tiếp theo.

## Stream IO truyền thống

Stream là một dòng dữ liệu liên tục theo khái niệm. Khi chương trình cần đọc dữ liệu, nó sử dụng stream đầu vào để đọc dữ liệu, khi cần ghi dữ liệu ra ngoài, nó sử dụng stream đầu ra để ghi dữ liệu.

Trong BIO, có hai loại Stream chính, Byte Stream và Character Stream, và cả hai loại đều có thể chia thành stream đầu vào và stream đầu ra dựa trên hướng luồng.

- **Byte Stream**
	- Stream đầu vào byte: `InputStream`
	- Stream đầu ra byte: `OutputStream`
- **Character Stream**
	- Stream đầu vào ký tự: `Reader`
	- Stream đầu ra ký tự: `Writer`

![JavaBIOFlow.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/JavaBIOFlow.png)

### Byte Stream

Byte Stream chủ yếu làm việc với dữ liệu byte hoặc đối tượng nhị phân.

Có hai lớp trừu tượng chính của Byte Stream: `InputStream` và `OutputStream`. Tất cả các lớp Byte Stream đều kế thừa từ hai lớp trừu tượng này.

#### File Byte Stream

`FileOutputStream` và `FileInputStream` cung cấp khả năng đọc và ghi byte vào tệp.

Các bước thực hiện luồng tệp thường như sau:

1. Sử dụng lớp `File` để liên kết với một tệp.
2. Gắn đối tượng `File` vào đối tượng `Stream`.
3. Thực hiện hoạt động đọc hoặc ghi.
4. Đóng `Stream`.

Ví dụ về `FileOutputStream` và `FileInputStream`:

```java
public class FileStreamDemo {

    private static final String FILEPATH = "temp.log";

    public static void main(String[] args) throws Exception {
        write(FILEPATH);
        read(FILEPATH);
    }

    public static void write(String filepath) throws IOException {
        // Bước 1: Sử dụng lớp File để tìm một tệp
        File f = new File(filepath);

        // Bước 2: Khởi tạo đối tượng Stream từ lớp con
        OutputStream out = new FileOutputStream(f);
        // Mặc định là ghi đè nội dung tệp gốc; nếu thêm tham số true, nó sẽ chuyển sang chế độ ghi nối tiếp nội dung tệp gốc.
        // OutputStream out = new FileOutputStream(f, true);

        // Bước 3: Thực hiện hoạt động ghi
        String str = "Hello World\n";
        byte[] bytes = str.getBytes();
        out.write(bytes);

        // Bước 4: Đóng stream đầu ra
        out.close();
    }

    public static void read(String filepath) throws IOException {
        // Bước 1: Sử dụng lớp File để tìm một tệp
        File f = new File(filepath);

        // Bước 2: Khởi tạo đối tượng Stream từ lớp con
        InputStream input = new FileInputStream(f);

        // Bước 3: Thực hiện hoạt động đọc
        // Có ba cách đọc, hãy trải nghiệm sự khác biệt của chúng
        byte[] bytes = new byte[(int) f.length()];
        int len = input.read(bytes); // Đọc nội dung
        System.out.println("Độ dài dữ liệu đã đọc: " + len);

        // Bước 4: Đóng stream đầu vào
        input.close();
        System.out.println("Nội dung là:\n" + new String(bytes));
    }

}
```

#### Memory Byte Stream

`ByteArrayInputStream` và `ByteArrayOutputStream` được sử dụng để thực hiện chức năng đầu vào và đầu ra trong bộ nhớ.

Stream hoạt động trong bộ nhớ thường được sử dụng khi tạo thông tin tạm thời. Nếu thông tin tạm thời được lưu trữ trong tệp, bạn cần xóa tệp sau khi hết hạn, điều này khá phiền toái.

Ví dụ về `ByteArrayInputStream` và `ByteArrayOutputStream`:

```java
public class ByteArrayStreamDemo {

    public static void main(String[] args) {
        String str = "HELLOWORLD"; // Định nghĩa một chuỗi, toàn bộ là chữ cái in hoa
        ByteArrayInputStream bis = new ByteArrayInputStream(str.getBytes());
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        // Chuẩn bị đọc nội dung từ ByteArrayInputStream trong bộ nhớ
        int temp = 0;
        while ((temp = bis.read()) != -1) {
            char c = (char) temp; // Đọc số và chuyển đổi thành ký tự
            bos.write(Character.toLowerCase(c)); // Chuyển đổi ký tự thành chữ thường
        }
        // Tất cả dữ liệu đều nằm trong ByteArrayOutputStream
        String newStr = bos.toString(); // Lấy nội dung
        try {
            bis.close();
            bos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println(newStr);
    }

}
```

#### Pipeline Stream

Pipeline Stream được sử dụng chủ yếu để truyền thông giữa hai luồng.

Để thực hiện truyền thông ống, `PipedOutputStream` phải được kết nối với `PipedInputStream`. Để làm điều này, `PipedOutputStream` cung cấp phương thức `connect()`.

```java
public class PipedStreamDemo {

    public static void main(String[] args) {
        Send s = new Send();
        Receive r = new Receive();
        try {
            s.getPos().connect(r.getPis()); // Kết nối ống
        } catch (IOException e) {
            e.printStackTrace();
        }
        new Thread(s).start(); // Khởi động luồng
        new Thread(r).start(); // Khởi động luồng
    }

    static class Send implements Runnable {

        private PipedOutputStream pos = null;

        Send() {
            pos = new PipedOutputStream(); // Khởi tạo stream đầu ra
        }

        @Override
        public void run() {
            String str = "Hello World!!!";
            try {
                pos.write(str.getBytes());
            } catch (IOException e) {
                e.printStackTrace();
            }
            try {
                pos.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        /**
         * Lấy stream đầu ra của luồng này
         */
        PipedOutputStream getPos() {
            return pos;
        }

    }

    static class Receive implements Runnable {

        private PipedInputStream pis = null;

        Receive() {
            pis = new PipedInputStream();
        }

        @Override
        public void run() {
            byte[] b = new byte[1024];
            int len = 0;
            try {
                len = pis.read(b);
            } catch (IOException e) {
                e.printStackTrace();
            }
            try {
                pis.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            System.out.println("Nội dung nhận được là: " + new String(b, 0, len));
        }

        /**
         * Lấy stream đầu vào của luồng này
         */
        PipedInputStream getPis() {
            return pis;
        }

    }

}
```

#### Object Byte Stream

`ObjectInputStream` và `ObjectOutputStream` là stream đầu vào và đầu ra của đối tượng, thường được sử dụng cho việc tuần tự hóa đối tượng.

Ở đây không mở rộng nhiều, nếu bạn muốn biết chi tiết và ví dụ, bạn có thể tham khảo: [[Java Serialization]]

#### Data Stream

Data Stream cung cấp các phương thức định dạng để đọc và ghi dữ liệu, lần lượt là `DataInputStream` và `DataOutputStream`.

Ví dụ về đọc và ghi stream dữ liệu `DataInputStream` và `DataOutputStream`:

```java
public class DataStreamDemo {

    public static final String FILEPATH = "temp.log";

    public static void main(String[] args) throws IOException {
        write(FILEPATH);
        read(FILEPATH);
    }

    private static void write(String filepath) throws IOException {
        // Bước 1: Sử dụng lớp File để tìm một tệp
        File f = new File(filepath);

        // Bước 2: Khởi tạo đối tượng Stream từ lớp con
        DataOutputStream dos = new DataOutputStream(new FileOutputStream(f));

        // Bước 3: Thực hiện hoạt động đọc hoặc ghi
        String[] names = { "Áo sơ mi", "Găng tay", "Khăn quàng" };
        float[] prices = { 98.3f, 30.3f, 50.5f };
        int[] nums = { 3, 2, 1 };
        for (int i = 0; i < names.length; i++) {
            dos.writeChars(names[i]);
            dos.writeChar('\t');
            dos.writeFloat(prices[i]);
            dos.writeChar('\t');
            dos.writeInt(nums[i]);
            dos.writeChar('\n');
        }

        // Bước 4: Đóng Stream
        dos.close();
    }

    private static void read(String filepath) throws IOException {
        // Bước 1: Sử dụng lớp File để tìm một tệp
        File f = new File(filepath);

        // Bước 2: Khởi tạo đối tượng Stream từ lớp con
        DataInputStream dis = new DataInputStream(new FileInputStream(f));

        // Bước 3: Thực hiện hoạt động đọc hoặc ghi
        String name = null; // Nhận tên
        float price = 0.0f; // Nhận giá
        int num = 0; // Nhận số lượng
        char[] temp = null; // Nhận tên sản phẩm
        int len = 0; // Lưu số lượng dữ liệu đã đọc
        char c = 0; // '\u0000'
        try {
            while (true) {
                temp = new char[200]; // Cấp phát không gian
                len = 0;
                while ((c = dis.readChar()) != '\t') { // Nhận nội dung
                    temp[len] = c;
                    len++; // Tăng độ dài đọc
                }
                name = new String(temp, 0, len); // Chuyển đổi mảng ký tự thành String
                price = dis.readFloat(); // Đọc giá
                dis.readChar(); // Đọc '\t'
                num = dis.readInt(); // Đọc int
                dis.readChar(); // Đọc '\n'
                System.out.printf("Tên: %s; Giá: %5.2f; Số lượng: %d\n", name, price, num);
            }
        } catch (EOFException e) {
            System.out.println("Kết thúc");
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Bước 4: Đóng Stream
        dis.close();
    }

}
```

#### Merge Stream

Merge Stream có chức năng chuyển đổi nhiều `InputStream` thành một `InputStream`. Chức năng của luồng kết hợp được thực hiện bởi `SequenceInputStream`.

```java
public class SequenceInputStreamDemo {

    public static void main(String[] args) throws Exception {

        InputStream is1 = new FileInputStream("temp1.log");
        InputStream is2 = new FileInputStream("temp2.log");
        SequenceInputStream sis = new SequenceInputStream(is1, is2);

        int temp = 0; // Nhận nội dung
        OutputStream os = new FileOutputStream("temp3.logt");
        while ((temp = sis.read()) != -1) { // Vòng lặp xuất ra
            os.write(temp); // Lưu nội dung
        }

        sis.close(); // Đóng stream kết hợp
        is1.close(); // Đóng stream đầu vào 1
        is2.close(); // Đóng stream đầu vào 2
        os.close(); // Đóng stream đầu ra
    }

}
```

### Character Stream

Character Stream chủ yếu làm việc với ký tự, một ký tự tương đương với hai byte.

Có hai lớp trừu tượng chính của Character Stream: `Reader` và `Writer`. Tất cả các lớp Character Stream đều kế thừa từ hai lớp trừu tượng này.

#### File Character stream

`FileReader` và `FileWriter` được sử dụng để đọc và ghi dữ liệu văn bản vào tệp.

Ví dụ về đọc và ghi stream ký tự `FileReader` và `FileWriter`:

```java
public class FileReadWriteDemo {

    private static final String FILEPATH = "temp.log";

    public static void main(String[] args) throws IOException {
        write(FILEPATH);
        System.out.println("Nội dung là: " + new String(read(FILEPATH)));
    }

    public static void write(String filepath) throws IOException {
        // Bước 1: Sử dụng lớp File để tìm một tệp
        File f = new File(filepath);

        // Bước 2: Gắn đối tượng File vào đối tượng Stream
        Writer out = new FileWriter(f);
        // Writer out = new FileWriter(f, true); // Chế độ ghi nối tiếp

        // Bước 3: Thực hiện hoạt động đọc hoặc ghi
        String str = "Hello World!!!\r\n";
        out.write(str);

        // Bước 4: Đóng stream
        // Stream ký tự sử dụng bộ đệm và khi đóng Character Stream, nó sẽ ép buộc đầu ra bộ đệm
        // Nếu không đóng stream, nội dung bộ đệm sẽ không được xuất ra
        // Nếu muốn xuất nội dung bộ đệm khi không đóng stream, có thể sử dụng flush để ép buộc xóa bộ đệm
        out.flush();
        out.close();
    }

    public static char[] read(String filepath) throws IOException {
        // Bước 1: Sử dụng lớp File để tìm một tệp
        File f = new File(filepath);

        // Bước 2: Gắn đối tượng File vào đối tượng Stream
        Reader input = new FileReader(f);

        // Bước 3: Thực hiện hoạt động đọc hoặc ghi
        int temp = 0; // Nhận từng nội dung
        int len = 0; // Độ dài nội dung
        char[] c = new char[1024];
        while ((temp = input.read()) != -1) {
            // Nếu không phải -1 thì có nghĩa là còn nội dung, có thể tiếp tục đọc
            c[len] = (char) temp;
            len++;
        }
        System.out.println("Số ký tự trong tệp là: " + len);

        // Bước 4: Đóng stream
        input.close();

        return c;
    }

}
```

#### Chuyển đổi Byte Stream sang Character Stream

Chúng ta có thể sử dụng `InputStreamReader` để chuyển đổi Byte Stream đầu vào thành Character Stream; và `OutputStreamWriter` để chuyển đổi Byte Stream đầu ra thành Character Stream.

Ví dụ về `OutputStreamWriter`:

```java
public class OutputStreamWriterDemo {

    public static void main(String[] args) throws IOException {
        File f = new File("temp.log");
        Writer out = new OutputStreamWriter(new FileOutputStream(f));
        out.write("hello world!!");
        out.close();
    }

}
```

Ví dụ về `InputStreamReader`:

```java
public class InputStreamReaderDemo {

    public static void main(String[] args) throws IOException {
        File f = new File("temp.log");
        Reader reader = new InputStreamReader(new FileInputStream(f));
        char[] c = new char[1024];
        int len = reader.read(c);
        reader.close();
        System.out.println(new String(c, 0, len));
    }

}
```

### Byte Stream vs Character Stream

Giống nhau:

Cả Byte Stream và Character Stream đều có các phương thức như `read()`, `write()`, `flush()`, `close()`, điều này quyết định cách thức hoạt động của chúng gần như tương đồng.

Khác biệt:

- **Kiểu dữ liệu**
	 - Dữ liệu của Byte Stream là byte (đối tượng nhị phân). Các lớp trung tâm là lớp `InputStream` và `OutputStream`.
	- Dữ liệu của Character Stream là ký tự, mỗi ký tự tương đương với hai byte. Các lớp trung tâm là lớp `Reader` và `Writer`.
- **Bộ đệm**
	- Byte Stream không sử dụng bộ đệm (mà là bộ nhớ) trong quá trình hoạt động, mà là trực tiếp hoạt động trên tệp.
	- Character Stream sử dụng bộ đệm trong quá trình hoạt động, thông qua bộ đệm để hoạt động trên tệp.

Lựa chọn:

Tất cả các tệp đều được lưu trữ dưới dạng byte trên đĩa hoặc trong quá trình truyền. Ví dụ: hình ảnh, tệp âm thanh, v.v. đều được lưu trữ dưới dạng byte. Character Stream không đọc hoặc ghi các tệp này!

Do đó, ngoại trừ tệp dữ liệu văn bản thuần túy, các loại tệp khác nên sử dụng Byte Stream.
