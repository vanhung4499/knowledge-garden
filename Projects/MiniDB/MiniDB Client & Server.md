---
title: MiniDB Client & Server
tags:
  - minidb
  - project
categories: 
date created: 2024-04-20
date modified: 2024-04-20
---

# Triển khai Server và các quy tắc giao tiếp

### Lời nói đầu

MiniDB được thiết kế theo cấu trúc Client-Server, tương tự như MySQL. Hỗ trợ khởi động một Server và có nhiều Client kết nối với nó, giao tiếp qua các ổ cắm và thực thi SQL để trả về kết quả.

### Giao tiếp C/S

MYDB sử dụng định dạng nhị phân đặc biệt để liên lạc với Client và Server. Tất nhiên, nếu bạn thấy phiền phức thì không thể sử dụng trực tiếp văn bản thuần túy.

Cấu trúc truyền tin cơ bản nhất là Package:

```java
public class Package {
    byte[] data;
    Exception err;
}
```

Mỗi Package được Encoder mã hóa thành một mảng byte trước khi được gửi và cũng sẽ được Encoder giải mã thành đối tượng Gói sau khi bên kia nhận được. Các quy tắc mã hóa và giải mã như sau:

```
[Flag][data]
```

Nếu flag bằng 0, điều đó có nghĩa là dữ liệu đã được gửi, thì dữ liệu chính là dữ liệu đó; nếu flag là 1, điều đó có nghĩa là lỗi đã được gửi và dữ liệu là thông báo lỗi của Exception.getMessage(). như sau:

```java
public class Encoder {
    public byte[] encode(Package pkg) {
        if(pkg.getErr() != null) {
            Exception err = pkg.getErr();
            String msg = "Intern server error!";
            if(err.getMessage() != null) {
                msg = err.getMessage();
            }
            return Bytes.concat(new byte[]{1}, msg.getBytes());
        } else {
            return Bytes.concat(new byte[]{0}, pkg.getData());
        }
    }

    public Package decode(byte[] data) throws Exception {
        if(data.length < 1) {
            throw Error.InvalidPkgDataException;
        }
        if(data[0] == 0) {
            return new Package(Arrays.copyOfRange(data, 1, data.length), null);
        } else if(data[0] == 1) {
            return new Package(null, new RuntimeException(new String(Arrays.copyOfRange(data, 1, data.length))));
        } else {
            throw Error.InvalidPkgDataException;
        }
    }
}
```

Thông tin được mã hóa sẽ được ghi vào luồng đầu ra và gửi đi thông qua lớp Transporter. Để tránh các vấn đề do các ký tự đặc biệt gây ra, dữ liệu sẽ được chuyển đổi thành chuỗi thập lục phân (Chuỗi Hex) và ký tự dòng mới sẽ được thêm vào cuối thông tin. Bằng cách này, khi gửi và nhận dữ liệu, bạn chỉ cần sử dụng BufferedReader và Writer để đọc và ghi trực tiếp các hàng.

```java
public class Transporter {
    private Socket socket;
    private BufferedReader reader;
    private BufferedWriter writer;

    public Transporter(Socket socket) throws IOException {
        this.socket = socket;
        this.reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
    }

    public void send(byte[] data) throws Exception {
        String raw = hexEncode(data);
        writer.write(raw);
        writer.flush();
    }

    public byte[] receive() throws Exception {
        String line = reader.readLine();
        if(line == null) {
            close();
        }
        return hexDecode(line);
    }

    public void close() throws IOException {
        writer.close();
        reader.close();
        socket.close();
    }

    private String hexEncode(byte[] buf) {
        return Hex.encodeHexString(buf, true)+"n";
    }

    private byte[] hexDecode(String buf) throws DecoderException {
        return Hex.decodeHex(buf);
    }
}
```

Packager là sự kết hợp giữa Encoding và Transporter, cung cấp các phương thức gửi và nhận trực tiếp ra thế giới bên ngoài:

```java
public class Packager {
    private Transporter transpoter;
    private Encoder encoder;

    public Packager(Transporter transpoter, Encoder encoder) {
        this.transpoter = transpoter;
        this.encoder = encoder;
    }

    public void send(Package pkg) throws Exception {
        byte[] data = encoder.encode(pkg);
        transpoter.send(data);
    }

    public Package receive() throws Exception {
        byte[] data = transpoter.receive();
        return encoder.decode(data);
    }

    public void close() throws Exception {
        transpoter.close();
    }
}
```

### Triển khai Server và Client

Server và Client sử dụng trực tiếp các socket Java một cách lười biếng.

Server khởi động cổng nghe ServerSocket và khi có yêu cầu, nó sẽ trực tiếp gửi yêu cầu đó đến một luồng mới để xử lý. Phần này sẽ đi trực tiếp đến bảng điều khiển phía sau.

Lớp SocketHandler triển khai giao diện Runnable, khởi tạo Packager sau khi thiết lập kết nối, sau đó lặp lại để nhận và xử lý dữ liệu từ Client:

```java
Packager packager = null;
try {
    Transporter t = new Transporter(socket);
    Encoder e = new Encoder();
    packager = new Packager(t, e);
} catch(IOException e) {
    e.printStackTrace();
    try {
        socket.close();
    } catch (IOException e1) {
        e1.printStackTrace();
    }
    return;
}
Executor exe = new Executor(tbm);
while(true) {
    Package pkg = null;
    try {
        pkg = packager.receive();
    } catch(Exception e) {
        break;
    }
    byte[] sql = pkg.getData();
    byte[] result = null;
    Exception e = null;
    try {
        result = exe.execute(sql);
    } catch (Exception e1) {
        e = e1;
        e.printStackTrace();
    }
    pkg = new Package(result, e);
    try {
        packager.send(pkg);
    } catch (Exception e1) {
        e1.printStackTrace();
        break;
    }
}
```

Cốt lõi của quá trình xử lý là lớp Executor. Executor gọi Parser để lấy đối tượng thông tin có cấu trúc của câu lệnh tương ứng và gọi các phương thức TBM khác nhau để xử lý tùy theo loại đối tượng. Các chi tiết sẽ không được mô tả lại.  

Lớp com.hnv99.minidb.backend.Launcher là lối vào khởi động của Server. Lớp này phân tích các đối số dòng lệnh. Một tham số rất quan trọng là -open hoặc -create. Trình khởi chạy quyết định tạo tệp cơ sở dữ liệu hay khởi động cơ sở dữ liệu hiện có dựa trên hai tham số.

```java
private static void createDB(String path) {
    TransactionManager tm = TransactionManager.create(path);
    DataManager dm = DataManager.create(path, DEFALUT_MEM, tm);
    VersionManager vm = new VersionManagerImpl(tm, dm);
    TableManager.create(path, vm, dm);
    tm.close();
    dm.close();
}

private static void openDB(String path, long mem) {
    TransactionManager tm = TransactionManager.open(path);
    DataManager dm = DataManager.open(path, mem, tm);
    VersionManager vm = new VersionManagerImpl(tm, dm);
    TableManager tbm = TableManager.open(path, vm, dm);
    new Server(port, tbm).start();
}
```

Quá trình client kết nối với server cũng chính là backplane. Client có một shell đơn giản thực ra chỉ đọc dữ liệu đầu vào của người dùng và gọi Client.execute().

```java
public byte[] execute(byte[] stat) throws Exception {
    Package pkg = new Package(stat, null);
    Package resPkg = rt.roundTrip(pkg);
    if(resPkg.getErr() != null) {
        throw resPkg.getErr();
    }
    return resPkg.getData();
}

```

Lớp RoundTripper thực sự triển khai một hành động gửi và nhận duy nhất:

```java
public Package roundTrip(Package pkg) throws Exception {
    packager.send(pkg);
    return packager.receive();
}
```

Cuối cùng, mục khởi động của Client đã được đính kèm. Rất đơn giản, chỉ cần chạy Shell:

```java
public class Launcher {
    public static void main(String[] args) throws UnknownHostException, IOException {
        Socket socket = new Socket("127.0.0.1", 9999);
        Encoder e = new Encoder();
        Transporter t = new Transporter(socket);
        Packager packager = new Packager(t, e);

        Client client = new Client(packager);
        Shell shell = new Shell(client);
        shell.run();
    }
}
```