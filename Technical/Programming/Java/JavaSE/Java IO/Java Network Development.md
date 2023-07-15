---
title: Java Network Development
tags: [java, javase, io]
categories: [java, javase]
date created: 2023-07-15
date modified: 2023-07-15
---

# Lập trình mạng Java

> **Keywork**: `Socket`, `ServerSocket`, `DatagramPacket`, `DatagramSocket`
>
> Lập trình mạng là việc viết các chương trình chạy trên nhiều thiết bị (máy tính) và kết nối với nhau thông qua mạng.
>
> Gói `java.net` trong Java cung cấp các chi tiết giao tiếp mạng ở mức thấp. Bạn có thể sử dụng các lớp và giao diện trong gói này để tập trung vào giải quyết vấn đề mà không cần quan tâm đến chi tiết giao tiếp.
>
> Gói `java.net` cung cấp hỗ trợ cho hai giao thức mạng phổ biến:
>
> - **TCP** - TCP là viết tắt của Transmission Control Protocol, nó đảm bảo giao tiếp đáng tin cậy giữa hai ứng dụng. Thường được sử dụng trong giao thức Internet, được gọi là TCP/IP.
> - **UDP** - UDP là viết tắt của User Datagram Protocol, một giao thức không kết nối. Cung cấp các gói tin dữ liệu để ứng dụng liên lạc.

## Socket và ServerSocket

Socket sử dụng TCP để cung cấp cơ chế giao tiếp giữa hai máy tính. Chương trình máy khách tạo một socket và cố gắng kết nối với socket của máy chủ.

**Java sử dụng Socket và ServerSocket để hỗ trợ TCP**. Trong lập trình Socket trong Java, bạn có thể hiểu đơn giản như sau: **`java.net.Socket` đại diện cho máy khách, `java.net.ServerSocket` đại diện cho máy chủ**. Hai đối tượng này có thể thiết lập kết nối và giao tiếp với nhau.

Dưới đây là quá trình xây dựng kết nối trong giao tiếp Socket:

- Máy chủ khởi tạo một đối tượng `ServerSocket`, đại diện cho máy chủ ràng buộc vào một cổng.
- Máy chủ gọi phương thức `accept()` của `ServerSocket`, phương thức này sẽ chờ đến khi máy khách kết nối đến cổng ràng buộc của máy chủ (cổng lắng nghe).
- Trong quá trình lắng nghe cổng, máy khách khởi tạo một đối tượng `Socket`, chỉ định tên máy chủ và số cổng để yêu cầu kết nối.
- Hàm tạo của lớp `Socket` cố gắng kết nối máy khách với máy chủ và số cổng được chỉ định. Nếu kết nối thành công, một đối tượng Socket được tạo ra trên máy khách để giao tiếp với máy chủ.
- Ở phía máy chủ, phương thức `accept()` trả về một tham chiếu Socket mới trên máy chủ, tham chiếu này kết nối với Socket của máy khách.

Sau khi kết nối được thiết lập, bạn có thể sử dụng Stream IO để giao tiếp. Mỗi Socket đều có một stream đầu ra và một stream đầu vào. Stream đầu ra của máy khách kết nối với Stream đầu vào của máy chủ, trong khi Stream đầu vào của máy khách kết nối với Stream đầu ra của máy chủ.

TCP là một giao thức hai chiều, vì vậy dữ liệu có thể được gửi qua hai luồng dữ liệu cùng một lúc. Dưới đây là một số phương thức hữu ích của các lớp để triển khai sockets.

### ServerSocket

Chương trình máy chủ sử dụng lớp `java.net.ServerSocket` để lấy một cổng và lắng nghe yêu cầu kết nối từ máy khách đến cổng này.

#### Các phương thức khởi tạo của ServerSocket

`ServerSocket` có nhiều phương thức khởi tạo:

| **Phương thức**                                              | **Mô tả**                                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `ServerSocket()`                                              | Tạo một socket máy chủ không ràng buộc.                                   |
| `ServerSocket(int port)`                                      | Tạo một socket máy chủ được ràng buộc vào một cổng cụ thể.                 |
| `ServerSocket(int port, int backlog)`                         | Tạo một socket máy chủ với `backlog` cụ thể và ràng buộc vào cổng cụ thể. |
| `ServerSocket(int port, int backlog, InetAddress address)`    | Tạo một socket máy chủ với cổng cụ thể, `backlog` lắng nghe và IP cục bộ. |
| `ServerSocket(SocketAddress host, int backlog)`               | Ràng buộc `ServerSocket` vào địa chỉ cụ thể (địa chỉ IP và số cổng).      |
| `ServerSocket(SocketAddress host, int backlog, InetAddress address)` | Tạo một socket máy chủ với cổng cụ thể, `backlog` lắng nghe và địa chỉ IP cục bộ. |

#### Các phương thức thông dụng của ServerSocket

Tạo một socket máy chủ không ràng buộc. Nếu không có ngoại lệ nào được ném ra từ phương thức khởi tạo của `ServerSocket`, điều đó có nghĩa ứng dụng của bạn đã ràng buộc thành công vào cổng được chỉ định và lắng nghe yêu cầu từ máy khách.

Dưới đây là một số phương thức thông dụng của lớp `ServerSocket`:

| **Phương thức**                                     | **Mô tả**                                                         |
| --------------------------------------------------- | ---------------------------------------------------------------- |
| `int getLocalPort()`                                | Trả về cổng mà socket này đang lắng nghe.                          |
| `Socket accept()`                                   | Lắng nghe và chấp nhận kết nối đến socket này.                     |
| `void setSoTimeout(int timeout)`                    | Bật/tắt `SO_TIMEOUT` với giá trị thời gian chờ được chỉ định (ms). |
| `void bind(SocketAddress host, int backlog)`        | Ràng buộc `ServerSocket` vào địa chỉ cụ thể (địa chỉ IP và số cổng). |

### Socket

Lớp `java.net.Socket` đại diện cho socket được sử dụng để giao tiếp giữa máy khách và máy chủ. Máy khách nhận được một đối tượng `Socket` bằng cách khởi tạo, trong khi máy chủ nhận được một đối tượng `Socket` thông qua giá trị trả về của phương thức `accept()`.

#### Các phương thức khởi tạo của Socket

Lớp `Socket` có 5 phương thức khởi tạo:

| **Phương thức**                                                                      | **Mô tả**                                                                                     |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `Socket()`                                                                           | Tạo một socket chưa được kết nối với `SocketImpl` mặc định của hệ thống.                       |
| `Socket(String host, int port)`                                                      | Tạo một socket luồng và kết nối nó đến máy chủ được chỉ định trên cổng được chỉ định.           |
| `Socket(InetAddress host, int port)`                                                 | Tạo một socket luồng và kết nối nó đến địa chỉ IP được chỉ định trên cổng được chỉ định.       |
| `Socket(String host, int port, InetAddress localAddress, int localPort)`             | Tạo một socket và kết nối nó đến máy chủ từ xa được chỉ định trên cổng từ xa được chỉ định.   |
| `Socket(InetAddress host, int port, InetAddress localAddress, int localPort)`        | Tạo một socket và kết nối nó đến địa chỉ từ xa được chỉ định trên cổng từ xa được chỉ định.   |

Khi phương thức khởi tạo của Socket trả về, nó không chỉ đơn giản là khởi tạo một đối tượng Socket, mà nó cũng cố gắng kết nối đến máy chủ và cổng được chỉ định.

### ServerSocket

Chương trình máy chủ sử dụng lớp `java.net.ServerSocket` để lấy một cổng và lắng nghe yêu cầu kết nối từ Máy khách đến cổng này.

#### Các phương thức khởi tạo của ServerSocket

`ServerSocket` có nhiều phương thức khởi tạo:

| **Phương thức**                                                   | **Mô tả**                                                                 |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `ServerSocket()`                                                   | Tạo một socket máy chủ không ràng buộc.                                   |
| `ServerSocket(int port)`                                           | Tạo một socket máy chủ được ràng buộc vào một cổng cụ thể.                 |
| `ServerSocket(int port, int backlog)`                              | Tạo một socket máy chủ với `backlog` cụ thể và ràng buộc vào cổng cụ thể. |
| `ServerSocket(int port, int backlog, InetAddress address)`         | Tạo một socket máy chủ với cổng cụ thể, `backlog` lắng nghe và IP cục bộ. |
| `ServerSocket(SocketAddress host, int backlog)`                    | Ràng buộc `ServerSocket` vào địa chỉ cụ thể (địa chỉ IP và số cổng).      |
| `ServerSocket(SocketAddress host, int backlog, InetAddress address)` | Tạo một socket máy chủ với cổng cụ thể, `backlog` lắng nghe và địa chỉ IP cục bộ. |

#### Các phương thức thông dụng của ServerSocket

Tạo một socket máy chủ không ràng buộc. Nếu không có ngoại lệ nào được ném ra từ phương thức khởi tạo của `ServerSocket`, điều đó có nghĩa ứng dụng của bạn đã ràng buộc thành công vào cổng được chỉ định và lắng nghe yêu cầu từ Máy khách.

Dưới đây là một số phương thức thông dụng của lớp `ServerSocket`:

| **Phương thức**                                     | **Mô tả**                                              |
| --------------------------------------------------- | ----------------------------------------------------- |
| `int getLocalPort()`                                | Trả về cổng mà socket này đang lắng nghe.               |
| `Socket accept()`                                   | Lắng nghe và chấp nhận kết nối đến socket này.          |
| `void setSoTimeout(int timeout)`                    | Bật/tắt `SO_TIMEOUT` với giá trị thời gian chờ chỉ định. |
| `void bind(SocketAddress host, int backlog)`        | Ràng buộc `ServerSocket` vào địa chỉ cụ thể (địa chỉ IP và số cổng). |

### Socket

Lớp `java.net.Socket` đại diện cho socket được sử dụng để giao tiếp giữa Máy khách và máy chủ. Máy khách nhận được một đối tượng `Socket` bằng cách khởi tạo, trong khi máy chủ nhận được một đối tượng `Socket` thông qua giá trị trả về của phương thức `accept()`.

#### Các phương thức khởi tạo của Socket

Lớp `Socket` có 5 phương thức khởi tạo:

| **Phương thức**                                                                      | **Mô tả**                                                 |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `Socket()`                                                                           | Tạo một socket chưa được kết nối với `SocketImpl` mặc định của hệ thống.                       |
| `Socket(String host, int port)`                                                      | Tạo một socket luồng và kết nối nó đến máy chủ được chỉ định trên cổng được chỉ định.           |
| `Socket(InetAddress host, int port)`                                                 | Tạo một socket luồng và kết nối nó đến địa chỉ IP được chỉ định trên cổng được chỉ định.       |
| `Socket(String host, int port, InetAddress localAddress, int localPort)`             | Tạo một socket và kết nối nó đến máy chủ từ xa được chỉ định trên cổng từ xa được chỉ định.   |
| `Socket(InetAddress host, int port, InetAddress localAddress, int localPort)`        | Tạo một socket và kết nối nó đến địa chỉ từ xa được chỉ định trên cổng từ xa được chỉ định.   |

Khi phương thức khởi tạo của Socket trả về, nó không chỉ đơn giản là khởi tạo một đối tượng Socket, mà nó cũng cố gắng kết nối đến máy chủ và cổng được chỉ định.

#### Các phương thức thông dụng của Socket

Dưới đây là một số phương thức thông dụng của lớp `Socket`. Lưu ý rằng cả Máy khách và máy chủ đều có một đối tượng Socket, vì vậy cả hai đều có thể gọi các phương thức này.

| **Phương thức**                                        | **Mô tả**                                              |
| ------------------------------------------------------ | ----------------------------------------------------- |
| `void connect(SocketAddress host, int timeout)`         | Kết nối socket này đến máy chủ và chỉ định một thời gian chờ. |
| `InetAddress getInetAddress()`                          | Trả về địa chỉ kết nối của socket.                     |
| `int getPort()`                                         | Trả về cổng từ xa mà socket này đang kết nối đến.       |
| `int getLocalPort()`                                    | Trả về cổng cục bộ mà socket này đang ràng buộc.        |
| `SocketAddress getRemoteSocketAddress()`               | Trả về địa chỉ của đầu cuối kết nối của socket, hoặc null nếu chưa kết nối. |
| `InputStream getInputStream()`                          | Trả về luồng đầu vào của socket.                        |
| `OutputStream getOutputStream()`                        | Trả về luồng đầu ra của socket.                          |
| `void close()`                                          | Đóng socket này.                                       |

### Ví dụ về giao tiếp qua Socket

Ví dụ máy chủ:

```java
public class HelloServer {

    public static void main(String[] args) throws Exception {
        // Máy chủ Socket
        // Máy chủ lắng nghe trên cổng 8888
        ServerSocket server = new ServerSocket(8888);
        System.out.println("Máy chủ đang chạy, đang chờ kết nối từ Máy khách.");
        // Chấp nhận kết nối, chương trình chuyển sang trạng thái chặn
        Socket client = server.accept();
        // Sử dụng PrintStream để in thông tin
        PrintStream out = new PrintStream(client.getOutputStream());
        // Gửi thông điệp tới Máy khách
        out.println("Xin chào thế giới");
        client.close();
        server.close();
        System.out.println("Máy chủ đã gửi thông điệp tới Máy khách và thoát.");
    }

}
```

Ví dụ Máy khách:

```java
public class HelloClient {

    public static void main(String[] args) throws Exception {
        // Máy khách Socket
        Socket client = new Socket("localhost", 8888);
        InputStreamReader inputStreamReader = new InputStreamReader(client.getInputStream());
        // Đọc toàn bộ dữ liệu một lần
        BufferedReader buf = new BufferedReader(inputStreamReader);
        String str = buf.readLine();
        buf.close();
        client.close();
        System.out.println("Máy khách đã nhận được thông điệp từ máy chủ: " + str + " và thoát");
    }

}
```

## DatagramSocket và DatagramPacket

Java sử dụng `DatagramSocket` và `DatagramPacket` để hỗ trợ giao thức UDP.

- `DatagramPacket`: Lớp gói dữ liệu
- `DatagramSocket`: Lớp giao tiếp

Ví dụ máy chủ UDP:

```java
public class UDPServer {

    public static void main(String[] args) throws Exception {
        String str = "Xin chào thế giới!!!";
        DatagramSocket ds = new DatagramSocket(3000); // Máy chủ lắng nghe trên cổng 3000 để gửi thông điệp
        DatagramPacket dp =
            new DatagramPacket(str.getBytes(), str.length(), InetAddress.getByName("localhost"), 9000); // Tất cả thông tin được lưu trữ trong dp
        System.out.println("Gửi thông điệp.");
        ds.send(dp); // Gửi thông điệp đi
        ds.close();
    }

}
```

Ví dụ Máy khách UDP:

```java
public class UDPClient {

    public static void main(String[] args) throws Exception {
        byte[] buf = new byte[1024]; // Khởi tạo mảng để nhận dữ liệu
        DatagramSocket ds = new DatagramSocket(9000); // Máy khách lắng nghe trên cổng 9000 để nhận thông điệp từ máy chủ
        DatagramPacket dp = new DatagramPacket(buf, 1024); // Tất cả thông tin được lưu trữ trong dp
        ds.receive(dp); // Nhận dữ liệu
        String str = new String(dp.getData(), 0, dp.getLength()) + " từ " + dp.getAddress().getHostAddress() + ":"
            + dp.getPort();
        System.out.println(str); // In nội dung
    }

}
```

## InetAddress

Lớp `InetAddress` đại diện cho địa chỉ giao thức Internet (IP).

Không có hàm tạo công khai, chỉ có thể tạo các thể hiện thông qua các phương thức tĩnh.

```java
InetAddress.getByName(String host);
InetAddress.getByAddress(byte[] address);
```

## URL

Có thể đọc dữ liệu dạng byte trực tiếp từ URL.

```java
public static void main(String[] args) throws IOException {

    URL url = new URL("http://www.baidu.com");

    /* Dữ liệu dạng byte */
    InputStream is = url.openStream();

    /* Dữ liệu dạng ký tự */
    InputStreamReader isr = new InputStreamReader(is, "utf-8");

    /* Cung cấp bộ nhớ đệm */
    BufferedReader br = new BufferedReader(isr);

    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }

    br.close();
}
```
