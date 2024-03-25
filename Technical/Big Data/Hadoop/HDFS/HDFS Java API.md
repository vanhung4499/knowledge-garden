---
title: HDFS Java API
tags:
  - hadoop
  - big-data
  - hdfs
categories: 
date created: 2024-03-21
date modified: 2024-03-21
---

# HDFS Java API

Để sử dụng HDFS API, bạn cần nhập phụ thuộc `hadoop-client`. Nếu bạn đang sử dụng phiên bản Hadoop CDH, bạn cũng cần chỉ định địa chỉ kho lưu trữ:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.heibaiying</groupId>
    <artifactId>hdfs-java-api</artifactId>
    <version>1.0</version>


    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <hadoop.version>2.6.0-cdh5.15.2</hadoop.version>
    </properties>


    <!---Cấu hình địa chỉ kho CDH-->
    <repositories>
        <repository>
            <id>cloudera</id>
            <url>https://repository.cloudera.com/artifactory/cloudera-repos/</url>
        </repository>
    </repositories>


    <dependencies>
        <!--Hadoop-client-->
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-client</artifactId>
            <version>${hadoop.version}</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```

## FileSystem

FileSystem là điểm vào chính cho tất cả các hoạt động HDFS. Vì mỗi unit test sau đây đều cần sử dụng nó, nên ở đây chúng tôi sử dụng annotation `@Before`.

```java
private static final String HDFS_PATH = "hdfs://192.168.0.106:8020";
private static final String HDFS_USER = "root";
private static FileSystem fileSystem;

@Before
public void prepare() {
    try {
        Configuration configuration = new Configuration();
        // Ở đây tôi khởi động Hadoop đơn nút, vì vậy hệ số bản sao được đặt là 1, giá trị mặc định là 3
        configuration.set("dfs.replication", "1");
        fileSystem = FileSystem.get(new URI(HDFS_PATH), configuration, HDFS_USER);
    } catch (IOException e) {
        e.printStackTrace();
    } catch (InterruptedException e) {
        e.printStackTrace();
    } catch (URISyntaxException e) {
        e.printStackTrace();
    }
}


@After
public void destroy() {
    fileSystem = null;
}
```

## Tạo thư mục

Hỗ trợ tạo thư mục:

```java
@Test
public void mkDir() throws Exception {
    fileSystem.mkdirs(new Path("/hdfs-api/test0/"));
}
```

## Tạo thư mục với quyền truy cập cụ thể

Ba tham số của `FsPermission(FsAction u, FsAction g, FsAction o)` tương ứng với: quyền truy cập của người tạo, quyền truy cập của người dùng khác trong cùng nhóm, quyền truy cập của người dùng khác. Giá trị quyền được định nghĩa trong lớp enum `FsAction`.

```java
@Test
public void mkDirWithPermission() throws Exception {
    fileSystem.mkdirs(new Path("/hdfs-api/test1/"),
            new FsPermission(FsAction.READ_WRITE, FsAction.READ, FsAction.READ));
}
```

## Tạo tệp và ghi nội dung

```java
@Test
public void create() throws Exception {
    // Nếu tệp tồn tại, mặc định sẽ được ghi đè, có thể kiểm soát thông qua tham số thứ hai. 
    // Tham số thứ ba có thể kiểm soát kích thước của bộ đệm được sử dụng
    FSDataOutputStream out = fileSystem.create(new Path("/hdfs-api/test/a.txt"),
                                               true, 4096);
    out.write("hello hadoop!".getBytes());
    out.write("hello spark!".getBytes());
    out.write("hello flink!".getBytes());
    // Ép bộ đệm phải đẩy nội dung ra
    out.flush();
    out.close();
}
```

## Kiểm tra xem tệp có tồn tại không

```java
@Test
public void exist() throws Exception {
    boolean exists = fileSystem.exists(new Path("/hdfs-api/test/a.txt"));
    System.out.println(exists);
}
```

## Xem nội dung tệp

Xem nội dung của tệp văn bản nhỏ, chuyển đổi thành chuỗi và xuất ra:

```java
@Test
public void readToString() throws Exception {
    FSDataInputStream inputStream = fileSystem.open(new Path("/hdfs-api/test/a.txt"));
    String context = inputStreamToString(inputStream, "utf-8");
    System.out.println(context);
}
```

`inputStreamToString` là một phương thức tùy chỉnh, mã như sau:

```java
/**
 * Chuyển đổi luồng đầu vào thành ký tự có mã hóa cụ thể
 *
 * @param inputStream Luồng đầu vào
 * @param encode      Loại mã hóa cụ thể
 */
private static String inputStreamToString(InputStream inputStream, String encode) {
    try {
        if (encode == null || ("".equals(encode))) {
            encode = "utf-8";
        }
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, encode));
        StringBuilder builder = new StringBuilder();
        String str = "";
        while ((str = reader.readLine()) != null) {
            builder.append(str).append("\n");
        }
        return builder.toString();
    } catch (IOException e) {
        e.printStackTrace();
    }
    return null;
}
```

## Đổi tên tệp

```java
@Test
public void rename() throws Exception {
    Path oldPath = new Path("/hdfs-api/test/a.txt");
    Path newPath = new Path("/hdfs-api/test/b.txt");
    boolean result = fileSystem.rename(oldPath, newPath);
    System.out.println(result);
}
```

## Xóa thư mục hoặc tệp

```java
public void delete() throws Exception {
    /*
     *  Tham số thứ hai biểu thị xem có xóa đệ quy không
     *    +  Nếu path là một thư mục và xóa đệ quy là true, thì xóa thư mục và tất cả các tệp trong đó;
     *    +  Nếu path là một thư mục nhưng xóa đệ quy là false, thì sẽ ném ra một ngoại lệ.
     */
    boolean result = fileSystem.delete(new Path("/hdfs-api/test/b.txt"), true);
    System.out.println(result);
}
```

## Tải tệp lên HDFS

```java
@Test
public void copyFromLocalFile() throws Exception {
    // Nếu đường dẫn chỉ định là một thư mục, thì thư mục và tất cả các tệp bên trong sẽ được sao chép vào thư mục đích
    Path src = new Path("D:\\BigData-Notes\\notes\\installation");
    Path dst = new Path("/hdfs-api/test/");
    fileSystem.copyFromLocalFile(src, dst);
}
```

## Tải tệp lớn và hiển thị tiến trình tải lên

```java
@Test
    public void copyFromLocalBigFile() throws Exception {

        File file = new File("D:\\kafka.tgz");
        final float fileSize = file.length();
        InputStream in = new BufferedInputStream(new FileInputStream(file));

        FSDataOutputStream out = fileSystem.create(new Path("/hdfs-api/test/kafka5.tgz"),
                new Progressable() {
                  long fileCount = 0;

                  public void progress() {
                     fileCount++;
                     // Phương thức progress sẽ được gọi mỗi khi tải lên khoảng 64KB dữ liệu
                     System.out.println("Tiến trình tải lên：" + (fileCount * 64 * 1024 / fileSize) * 100 + " %");
                   }
                });

        IOUtils.copyBytes(in, out, 4096);

    }
```

## Tải tệp từ HDFS

```java
@Test
public void copyToLocalFile() throws Exception {
    Path src = new Path("/hdfs-api/test/kafka.tgz");
    Path dst = new Path("D:\\app\\");
    /*
     * Tham số đầu tiên kiểm soát xem sau khi tải xuống có xóa tệp gốc không, mặc định là true, tức là xóa;
     * Tham số cuối cùng chỉ ra liệu có sử dụng RawLocalFileSystem làm hệ thống tệp cục bộ hay không;
     * RawLocalFileSystem mặc định là false, thường không cần thiết lập,
     * nhưng nếu bạn gặp lỗi NullPointerException khi thực thi, điều này có thể cho thấy có sự không tương thích giữa hệ thống tệp và chương trình của bạn (thường gặp trên windows),
     * trong trường hợp này, bạn có thể đặt RawLocalFileSystem thành true
     */
    fileSystem.copyToLocalFile(false, src, dst, true);
}
```

## Xem thông tin tất cả các tệp trong thư mục chỉ định

```java
public void listFiles() throws Exception {
    FileStatus[] statuses = fileSystem.listStatus(new Path("/hdfs-api"));
    for (FileStatus fileStatus : statuses) {
        // Phương thức toString của fileStatus đã được ghi đè, bạn có thể xem tất cả thông tin chỉ bằng cách in trực tiếp
        System.out.println(fileStatus.toString());
    }
}
```

`FileStatus` chứa thông tin cơ bản về tệp, chẳng hạn như đường dẫn tệp, có phải là thư mục hay không, thời gian chỉnh sửa, thời gian truy cập, chủ sở hữu, nhóm, quyền tệp, có phải là liên kết tượng trưng hay không, v.v., ví dụ về nội dung đầu ra:

```properties
FileStatus{
path=hdfs://192.168.0.106:8020/hdfs-api/test;
isDirectory=true;
modification_time=1556680796191;
access_time=0;
owner=root;
group=supergroup;
permission=rwxr-xr-x;
isSymlink=false
}
```

## Xem thông tin tất cả các tệp trong thư mục chỉ định một cách đệ quy

```java
@Test
public void listFilesRecursive() throws Exception {
    RemoteIterator<LocatedFileStatus> files = fileSystem.listFiles(new Path("/hbase"), true);
    while (files.hasNext()) {
        System.out.println(files.next());
    }
}
```

Nội dung đầu ra tương tự như ở trên, nhưng thêm thông tin về kích thước tệp, số lượng bản sao, kích thước khối.

```properties
LocatedFileStatus{
path=hdfs://192.168.0.106:8020/hbase/hbase.version;
isDirectory=false;
length=7;
replication=1;
blocksize=134217728;
modification_time=1554129052916;
access_time=1554902661455;
owner=root; group=supergroup;
permission=rw-r--r--;
isSymlink=false}
```

## Xem thông tin khối của tệp

```java
@Test
public void getFileBlockLocations() throws Exception {

    FileStatus fileStatus = fileSystem.getFileStatus(new Path("/hdfs-api/test/kafka.tgz"));
    BlockLocation[] blocks = fileSystem.getFileBlockLocations(fileStatus, 0, fileStatus.getLen());
    for (BlockLocation block : blocks) {
        System.out.println(block);
    }
}
```

Thông tin khối đầu ra có ba giá trị, tương ứng là độ lệch bắt đầu của tệp (offset), kích thước tệp (length), tên máy chủ chứa khối (hosts).

```
0,57028557,hadoop001
```

Ở đây tôi tải lên một tệp chỉ có 57M (nhỏ hơn 128M), và trong chương trình tôi đã đặt số lượng bản sao là 1, vì vậy chỉ có thông tin về một khối.
