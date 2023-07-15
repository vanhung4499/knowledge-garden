---
title: Java NIO
tags: [java, javase, io]
categories: [java, javase]
date created: 2023-07-15
date modified: 2023-07-15
---

# Java NIO

> Keyword: `Channel`, `Buffer`, `Selector`, `non-blocking`, `multiplexing`

## Giới thiệu về NIO

NIO là một mô hình I/O đồng bộ không chặn, được giới thiệu trong Java 1.4 và tương ứng với gói `java.nio`. Nó cung cấp các trừu tượng như `Channel`, `Selector` và `Buffer`.

Chữ cái "N" trong NIO có thể hiểu là Non-blocking, không chỉ đơn giản là New. Nó hỗ trợ phương pháp I/O dựa trên bộ đệm và kênh. NIO cung cấp hai loại kênh socket khác nhau, tương ứng với Socket và ServerSocket trong mô hình BIO truyền thống: SocketChannel và ServerSocketChannel. Cả hai loại kênh này đều hỗ trợ hai chế độ blocking và non-blocking. Chế độ blocking hoạt động giống như trong mô hình truyền thống, rất đơn giản nhưng hiệu suất và tin cậy không cao; ngược lại, chế độ non-blocking hoạt động ngược lại. Đối với các ứng dụng có tải thấp hoặc ít xung lượng song song, việc sử dụng I/O blocking có thể nâng cao tốc độ phát triển và tính bảo trì; Đối với các ứng dụng có tải cao hoặc xung lượng cao (mạng), nên sử dụng chế độ non-blocking của NIO để phát triển.

### Sự khác biệt giữa NIO và BIO

#### Non-blocking IO (không chặn)

**BIO là chặn, NIO là không chặn**.

Các Stream trong BIO là chặn. Điều này có nghĩa rằng khi một luồng gọi `read()` hoặc `write()`, luồng đó bị chặn cho đến khi có dữ liệu được đọc hoặc việc ghi hoàn toàn. Trong thời gian này, luồng không thể làm bất kỳ công việc khác.

NIO cho phép thực hiện các hoạt động I/O không chặn. Ví dụ, trong một luồng duy nhất, bạn có thể tiếp tục làm việc khác trong khi từ kênh đọc dữ liệu vào bộ đệm. Khi dữ liệu đã được đọc vào bộ đệm, luồng tiếp tục xử lý dữ liệu. Viết cũng tương tự như vậy. Bên cạnh đó, viết không chắn cũng vậy. Một luồngthực hiện yêu cầu ghi một số dữ liệu vào một kênh nàođó nhưngxem ra không cần phải chờ đến khi nó được ghi hoàn toàn, luồng này có thể làm việc khác.

#### Bộ đệm (Buffer)

**BIO hướng stream (Stream oriented), trong khi NIO hướng buffer (Buffer oriented)**.

Bộ đệm là một đối tượng chứa các dữ liệu cần ghi hoặc đọc. Việc thêm vào các đối tượng Buffer trong thư viện NIO phản ánh sự khác biệt quan trọng giữa NIO và BIO. Trong BIO hướng stream, bạn có thể ghi trực tiếp dữ liệu vào hoặc đọc trực tiếp từ các đối tượng Stream. Mặc dù Stream cũng có các lớp mở rộng bắt đầu bằng Buffer, nhưng chúng chỉ là lớp bao của Stream, vẫn là từ Stream sang Buffer, trong khi NIO lại được ghi trực tiếp vào Buffer để thao tác.

Trong NIO, tất cả dữ liệu được xử lý thông qua bộ đệm. Khi đọc dữ liệu, nó được trực tiếp từ bộ nhớ cache; khi ghi dữ liệu, nó được ghi vào bộ nhớ cache. Bất kỳ lúc nào truy cập vào dữ liệu trong NIO, điều này được thực hiện thông qua việc xử lý qua buffer.

Bộ nhớ cache phổ biến nhất là ByteBuffer - một ByteBuffer cung cấp một số tính năng để xử lý mảng byte. Ngoài ByteBuffer, còn có một số bộ đệm khác, thực tế là mỗi kiểu dữ liệu cơ bản của Java (ngoại trừ kiểu Boolean) đều tương ứng với một loại bộ đệm.

#### Kênh (Channel)

NIO sử dụng Channel để đọc và ghi.

Kênh là hai chiều, có thể đọc và ghi, trong khi luồn chỉ có thể đọc hoặc ghi. Bất kỳ lúc nào muốn đọc hoặc ghi thông qua kênh, chúng ta chỉ có thể tương tác với Buffer. Nhờ vào Buffer này, việc đọc và ghi qua kênh có thể được tiến hành không đồng bộ.

#### Bộ chọn (Selector)

NIO có Bộ chọn (Selector), trong khi IO không có.

Bộ chọn được sử dụng để xử lý nhiều kênh bằng một luồng duy nhất. Do đó, nó yêu cầu ít luồng hơn để xử lý các kênh này. Việc chuyển giữa các luồng là phức tạp và tốn kém cho hệ điều hành. Vì vậy, việc sử dụng Bộ chọn giúp cải thiện hiệu suất hệ thống.

### Quá trình cơ bản của NIO

Nhìn chung, toàn bộ IO trong NIO đều bắt đầu từ Kênh (Channel).

- Đọc dữ liệu từ kênh: Tạo một bộ đệm, sau đó yêu cầu kênh đọc dữ liệu.
- Ghi dữ liệu vào kênh: Tạo một bộ đệm, điền dữ liệu và yêu cầu kênh ghi dữ liệu.

### Các thành phần chính của NIO

NIO bao gồm các thành phần chính sau:

- **Kênh (Channel)**
- **Bộ đệm (Buffer)**
- **Bộ chọn (Selector)**

## Kênh (Channel)

Kênh (`Channel`) là mô phỏng Stream trong BIO, cho phép đọc và ghi dữ liệu thông qua nó.

Kênh tương tự như các con trỏ tệp được thấy trên hệ điều hành Linux và các hệ điều hành tương tự. Nó là một trừu tượng được sử dụng trong NIO để hỗ trợ hoạt động IO theo lô.

Tập tin hoặc Socket thường được coi là mức trừu tượng cao hơn, trong khi Kênh lại là một loại trừu tượng cấp thấp của hệ điều hành. Điều này giúp NIO tận dụng toàn bộ cơ chế nền của các hệ điều hành hiện đại để có được hiệu suất tối ưu cho các kịch bản cụ thể, ví dụ như DMA (Direct Memory Access). Các lớp trừu tượng khác nhau liên quan chặt chẽ với nhau; ta có thể lấy Channel từ Socket và ngược lại.

Sự khác biệt giữa channel và stream:

- **Stream chỉ có chiều** - Một stream chỉ có thể đọc hoặc ghi.
- **Channel hai chiều** - Một channel có thể được sử dụng để đọc và ghi cùng một lúc.

Có các loại kênh sau:

- `FileChannel`: Đọc và ghi dữ liệu từ tập tin.
- `DatagramChannel`: Đọc và ghi dữ liệu qua UDP trong mạng.
- `SocketChannel`: Đọc và ghi dữ liệu qua TCP trong mạng.
- `ServerSocketChannel`: Lắng nghe các kết nối TCP mới, tạo ra một SocketChannel cho mỗi kết nối mới.

## Bộ đệm (Buffer)

NIO khác với IO truyền thống, nó hoạt động theo cơ chế khối (Block), xử lý dữ liệu theo khối. Bộ đệm (`Buffer`) là một khối liên tục của bộ nhớ, được sử dụng để đọc và ghi dữ liệu trong NIO. Bằng cách sử dụng bộ đệm, ta có thể đưa toàn bộ tập tin vào bộ nhớ rồi tiến hành xử lý sau này, điều này không giống với phương pháp truyền thống là đọc file khi xử lý.

**Dữ liệu được ghi hoặc đọc từ Channel phải được chứa trong Buffer trước**. Tức là không thể trực tiếp ghi hoặc đọc từ Kênh; ta phải thông qua bộ đệm. Mặc dù bản chất của bộ nhớ chỉ là mảng, nhưng nó không chỉ là một mảng thông thường. Bộ đệm cung cấp truy cập có cấu trúc vào dữ liệu và theo dõi quá trình đọc/ghi của hệ thống.

BIO và NIO đã được tích hợp tốt, `java.io.*` đã được triển khai lại dựa trên NIO, vì vậy nó có thể tận dụng một số tính năng của NIO. Ví dụ, một số lớp trong gói `java.io.*` bao gồm các phương pháp để đọc và ghi dữ liệu theo khối, điều này giúp tăng tốc xử lý ngay cả trong các hệ thống hướng luồng.

Các loại bộ đệm bao gồm:

- `ByteBuffer`
- `CharBuffer`
- `ShortBuffer`
- `IntBuffer`
- `LongBuffer`
- `FloatBuffer`
- `DoubleBuffer`

### Biến trạng thái của vùng đệm

- `capacity`: Sức chứa tối đa;
- `position`: Số byte đã được đọc và ghi hiện tại;
- `limit`: Số byte còn lại có thể đọc và ghi.
- `mark`: Ghi nhớ vị trí position trước đó, mặc định là 0, điều này được xem là tiện lợi và không bắt buộc.

Ví dụ về quá trình thay đổi biến trạng thái của vùng đệm:

1. Tạo một vùng đệm có kích thước 8 byte, lúc này position là 0 và limit = capacity = 8. Biến capacity sẽ không thay đổi, phần nào sau sẽ bỏ qua việc bàn luận này.
2. Đọc 5 byte dữ liệu từ kênh nhập vào và ghi vào trong vùng đệm, lúc này di chuyển position thành 5, limit giữ nguyên.
3. Trước khi ghi dữ liệu từ vùng đệm ra kênh xuất ra, cần phải gọi phương thức flip(), phương thức này sẽ thiết lập limit thành position hiện tại và position thành 0.
4. Lấy ra 4 byte từ vùng đệm để ghi vào bộ nhớ cache xuất ra, lúc này thiết lập position thành 4.
5. Cuối cùng cần gọi phương thức clear() để làm sạch vùng đệm, lúc này position và limit được thiết lập lại thành vị trí ban đầu.

### Ví dụ NIO cho tệp tin

Dưới đây là một ví dụ minh họa việc sao chép nhanh tệp tin bằng NIO:

```java
public static void fastCopy(String src, String dist) throws IOException {

    /* Lấy luồng byte vào từ tệp nguồn */
    FileInputStream fin = new FileInputStream(src);

    /* Lấy kênh của luồng byte vào */
    FileChannel fcin = fin.getChannel();

    /* Lấy luồng byte ra từ tệp đích */
    FileOutputStream fout = new FileOutputStream(dist);

    /* Lấy kênh của luồng byte ra */
    FileChannel fcout = fout.getChannel();

    /* Cấp phát 1024 byte cho vùng đệm */
    ByteBuffer buffer = ByteBuffer.allocateDirect(1024);

    while (true) {

        /* Đọc dữ liệu từ kênh nhập vào và ghi vào trong vùng đệm */
        int r = fcin.read(buffer);

        /* read() trả về -1 khi gặp EOF (End of File) */
        if (r == -1) {
            break;
        }

        /* Chuyển sang chế độ ghi/đọc */
        buffer.flip();

        /* Ghi nội dung của vùng đệm vào trong tập tin xuất ra*/
        fcout.write(buffer);

         /** Xóa sạch nội dung trong vùng đệm **/
         buffer.clear();
     }
}
```

## Bộ chọn (Selector)

NIO thường được gọi là IO không chặn, chủ yếu là do tính năng không chặn của NIO trong giao tiếp mạng được sử dụng rộng rãi.

`Selector` là cơ bản của lập trình Java NIO. Được sử dụng để kiểm tra xem một hoặc nhiều `Channel` NIO có ở trạng thái đọc được hay ghi được hay không.

**NIO triển khai mô hình Reactor trong việc kết hợp IO nhiều đường**:

- Một luồng (`Thread`) sử dụng một **bộ chọn `Selector` để theo dõi các sự kiện (accept, read) trên nhiều kênh `Channel` thông qua việc tuần tự kiểm tra**, nếu có sự kiện theo dõi xảy ra trên một kênh, kênh này đã ở trạng thái đã sẵn sàng và sau đó tiến hành hoạt động I/O.
- Bằng cách **định cấu hình cho các kênh nghe thành không chặn**, khi các biến cố I/O trên kênh vẫn chưa diễn ra, nó sẽ không bị block và tiếp tục tuần tự kiểm tra các kênh khác để tìm ra những kênh đã có biến cố I/O diễn ra để thực hiện.
- Vì việc tạo và chuyển đổi luồng có chi phí lớn, do đó sử dụng **một luồng để xử lý nhiều biến cố** thay vì một luồng xử lý một biến cố mang lại hiệu suất tốt hơn.

Cần lưu ý rằng chỉ `SocketChannel` mới có thể được định cấu hình thành không chặn, trong khi `FileChannel` không thể, vì việc định cấu hình `FileChannel` thành không chặn là vô nghĩa.

> Hiện nay các công cụ IO kết hợp nhiều kênh của hệ điều hành sử dụng epoll đã loại bỏ giới hạn 1024 kết nối. Do đó, Selector trong lí thuyết có thể tuần tự hàng ngàn khách hàng.

### Tạo bộ chọn

```java
Selector selector = Selector.open();
```

### Đăng ký kênh vào bộ chọn

```java

ServerSocketChannel ssChannel = ServerSocketChannel.open();

ssChannel.configureBlocking(false);

ssChannel.register(selector, SelectionKey.OP_ACCEPT);

```

Kênh phải được thiết lập ở chế độ không chặn, nếu không việc sử dụng bộ chọn sẽ trở nên vô ích, vì nếu một kênh bị block trên một sự kiện nào đó, máy chủ sẽ không thể phản hồi các sự kiện khác và phải chờ cho đến khi xử lý xong sự kiện này mới có thể xử lý các sự kiện khác, điều này rõ ràng trái ngược với mục đích của bộ chọn.

Khi đăng ký kênh vào bộ chọn, cần chỉ định các sự kiện cụ thể để đăng ký, chủ yếu có những loại sau:

- `SelectionKey.OP_CONNECT`
- `SelectionKey.OP_ACCEPT`
- `SelectionKey.OP_READ`
- `SelectionKey.OP_WRITE`

Chúng được xác định trong SelectionKey như sau:

```java
public static final int OP_READ = 1 << 0;
public static final int OP_WRITE = 1 << 2;
public static final int OP_CONNECT = 1 << 3;
public static final int OP_ACCEPT = 1 << 4;
```

Có thể thấy mỗi sự kiện có thể được coi là một trường bit, từ đó tạo thành số nguyên tập hợp các sự kiện. Ví dụ:

```java
int interestSet = SelectionKey.OP_READ | SelectionKey.OP_WRITE;
```

### Lắng nghe sự kiện

```java
int num = selector.select();
```

Sử dụng `select()` để lắng nghe các sự kiện đã đến, nó sẽ chờ đến khi có ít nhất một sự kiện đến.

### Lấy các sự kiện đã đến

```java
Set<SelectionKey> keys = selector.selectedKeys();
Iterator<SelectionKey> keyIterator = keys.iterator();
while (keyIterator.hasNext()) {
    SelectionKey key = keyIterator.next();
    if (key.isAcceptable()) {
        // ...
    } else if (key.isReadable()) {
        // ...
    }
    keyIterator.remove();
}
```

### Vòng lặp sự kiện

Vì một lần gọi `select()` không thể xử lý tất cả các sự kiện và máy chủ có thể cần lắng nghe sự kiện liên tục, vì vậy mã xử lý sự kiện của máy chủ thường được đặt trong một vòng lặp vô hạn.

```java
while (true) {
    int num = selector.select();
    Set<SelectionKey> keys = selector.selectedKeys();
    Iterator<SelectionKey> keyIterator = keys.iterator();
    while (keyIterator.hasNext()) {
        SelectionKey key = keyIterator.next();
        if (key.isAcceptable()) {
            // ...
        } else if (key.isReadable()) {
            // ...
        }
        keyIterator.remove();
    }
}
```

### Ví dụ với Socket NIO

```java
public class NIOServer {

    public static void main(String[] args) throws IOException {

        Selector selector = Selector.open();

        ServerSocketChannel ssChannel = ServerSocketChannel.open();
        ssChannel.configureBlocking(false);
        ssChannel.register(selector, SelectionKey.OP_ACCEPT);

        ServerSocket serverSocket = ssChannel.socket();
        InetSocketAddress address = new InetSocketAddress("127.0.0.1", 8888);
        serverSocket.bind(address);

        while (true) {

            selector.select();
            Set<SelectionKey> keys = selector.selectedKeys();
            Iterator<SelectionKey> keyIterator = keys.iterator();

            while (keyIterator.hasNext()) {

                SelectionKey key = keyIterator.next();

                if (key.isAcceptable()) {

                    ServerSocketChannel ssChannel1 = (ServerSocketChannel) key.channel();

                    // Máy chủ sẽ tạo một SocketChannel cho mỗi kết nối mới
                    SocketChannel sChannel = ssChannel1.accept();
                    sChannel.configureBlocking(false);

                    // Kết nối mới này được sử dụng chủ yếu để đọc dữ liệu từ khách hàng
                    sChannel.register(selector, SelectionKey.OP_READ);

                } else if (key.isReadable()) {

                    SocketChannel sChannel = (SocketChannel) key.channel();
                    System.out.println(readDataFromSocketChannel(sChannel));
                    sChannel.close();
                }

                keyIterator.remove();
            }
        }
    }

    private static String readDataFromSocketChannel(SocketChannel sChannel) throws IOException {

        ByteBuffer buffer = ByteBuffer.allocate(1024);
        StringBuilder data = new StringBuilder();

        while (true) {

            buffer.clear();
            int n = sChannel.read(buffer);
            if (n == -1) {
                break;
            }
            buffer.flip();
            int limit = buffer.limit();
            char[] dst = new char[limit];
            for (int i = 0; i < limit; i++) {
                dst[i] = (char) buffer.get(i);
            }
            data.append(dst);
            buffer.clear();
        }
        return data.toString();
    }
}
```

```java
public class NIOClient {

    public static void main(String[] args) throws IOException {
        Socket socket = new Socket("127.0.0.1", 8888);
        OutputStream out = socket.getOutputStream();
        String s = "hello world";
        out.write(s.getBytes());
        out.close();
    }
}
```

### Bộ nhớ được ánh xạ

I/O ánh xạ bộ nhớ là một phương pháp đọc và ghi dữ liệu từ tệp tin, nó có thể nhanh hơn nhiều so với I/O truyền thống dựa trên stream hoặc channel.

Việc ghi vào bộ nhớ ánh xạ có thể nguy hiểm, chỉ cần thay đổi một phần tử trong mảng, có thể thay đổi trực tiếp tệp tin trên đĩa. Việc thay đổi dữ liệu và lưu dữ liệu vào đĩa không được tách riêng.

Dòng mã dưới đây ánh xạ 1024 byte đầu tiên của tệp vào bộ nhớ, phương thức `map()` trả về một `MappedByteBuffer`, đó là một lớp con của ByteBuffer. Vì vậy, có thể sử dụng bộ đệm ánh xạ mới như bất kỳ ByteBuffer nào khác, hệ điều hành sẽ thực hiện ánh xạ khi cần thiết.

```java
MappedByteBuffer mbb = fc.map(FileChannel.MapMode.READ_WRITE, 0, 1024);
```

## NIO vs BIO

Sự khác biệt quan trọng nhất giữa BIO và NIO là cách đóng gói và truyền dữ liệu: **BIO xử lý dữ liệu theo stream, trong khi NIO xử lý dữ liệu theo block**.

- **BIO hướng stream, xử lý một byte dữ liệu mỗi lần**: Một luồng đầu vào tạo ra một byte dữ liệu, một luồng đầu ra tiêu thụ một byte dữ liệu. Việc tạo bộ lọc cho dữ liệu stream rất dễ dàng, liên kết một số bộ lọc để mỗi bộ lọc chỉ chịu trách nhiệm cho một phần cơ chế xử lý phức tạp. Mặt khác, I/O hướng stream thường khá chậm.
- **NIO hướng block, xử lý một khối dữ liệu mỗi lần**, xử lý dữ liệu theo block nhanh hơn xử lý dữ liệu theo stream nhiều. Tuy nhiên, NIO thiếu tính thanh lịch và đơn giản của BIO.

Chế độ BIO:

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200630212345.png)

Chế độ NIO:

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200630212248.png)
