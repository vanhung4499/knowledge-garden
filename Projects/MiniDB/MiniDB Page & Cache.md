---
title: MiniDB Page & Cache
tags:
  - minidb
  - project
categories: 
date created: 2024-04-19
date modified: 2024-04-19
---

# Bộ nhớ đệm và quản lý các trang dữ liệu

## Lời nói đầu

Nội dung chính của phần này là sự trừu tượng hóa của hệ thống tập tin bởi module DM. DM trừu tượng hóa hệ thống tập tin thành các trang, và mỗi hoạt động đọc và ghi trên hệ thống tập tin được thực hiện theo đơn vị của các trang. Tương tự, dữ liệu đọc từ hệ thống tập tin cũng được lưu trữ trong các trang.

## Bộ đệm trang

Ở đây, chúng ta sẽ tham khảo thiết kế của hầu hết các cơ sở dữ liệu bằng cách đặt kích thước trang mặc định là 8K. Nếu muốn cải thiện hiệu suất trong trường hợp ghi dữ liệu lớn vào cơ sở dữ liệu, bạn cũng có thể tăng giá trị này một cách phù hợp.

Trong phần trước, chúng ta đã triển khai một khung bộ nhớ đệm chung, vì vậy trong phần này chúng ta có thể sử dụng trực tiếp khung bộ nhớ đó để đệm các trang. Tuy nhiên, trước hết, cần phải định nghĩa cấu trúc của trang. Lưu ý rằng trang này được lưu trữ trong bộ nhớ và khác biệt so với trang trừu tượng đã được lưu trữ vào đĩa.

Định nghĩa một trang như sau:

```java
public class PageImpl implements Page {
    private int pageNumber;
    private byte[] data;
    private boolean dirty;
    private Lock lock;

    private PageCache pc;
}
```

Trong đó, pageNumber là số trang của trang này, **bắt đầu từ 1**. Dữ liệu là dữ liệu byte thực sự chứa trong trang này. dirty chỉ ra xem trang này có phải là trang bẩn không. Trong quá trình loại bỏ bộ nhớ đệm, trang bẩn cần được ghi lại vào đĩa. Đây lưu trữ một tham chiếu PageCache (chưa được định nghĩa) để dễ dàng giải phóng trang này khỏi bộ nhớ đệm khi có tham chiếu Page.

Định nghĩa interface của bộ nhớ đệm trang như sau:

```java
public interface PageCache {
    int newPage(byte[] initData);
    Page getPage(int pgno) throws Exception;
    void close();
    void release(Page page);

    void truncateByBgno(int maxPgno);
    int getPageNumber();
    void flushPage(Page pg);
}
```

Cụ thể, lớp thực hiện bộ nhớ đệm trang cần phải kế thừa khung bộ nhớ đệm trừu tượng và triển khai hai phương thức trừu tượng `getForCache()` và `releaseForCache()`. Vì nguồn dữ liệu là hệ thống tệp, `getForCache()` chỉ cần đọc trực tiếp từ tệp và bọc thành `Page`:

```java
@Override
protected Page getForCache(long key) throws Exception {
    int pgno = (int)key;
    long offset = PageCacheImpl.pageOffset(pgno);

    ByteBuffer buf = ByteBuffer.allocate(PAGE_SIZE);
    fileLock.lock();
    try {
        fc.position(offset);
        fc.read(buf);
    } catch(IOException e) {
        Panic.panic(e);
    }
    fileLock.unlock();
    return new PageImpl(pgno, buf.array(), this);
}

private static long pageOffset(int pgno) {
	// Số trang bắt đầu từ 1
    return (pgno-1) * PAGE_SIZE;
}

```

Khi `releaseForCache()` xóa một trang, chỉ cần quyết định xem nó có cần được ghi lại vào hệ thống tệp hay không dựa trên việc trang đó có phải là trang bẩn hay không:

```java
@Override
protected void releaseForCache(Page page) {
    PageImpl pg = (PageImpl) page;
    if (pg.isDirty()) {
        flush(pg);
        pg.setDirty(false);
    }
}

private void flush(PageImpl pg) {
    int pgno = pg.getPageNumber();
    long offset = pageOffset(pgno);

    ByteBuffer buf = ByteBuffer.wrap(pg.getData());
    fileLock.lock();
    try {
        fc.position(offset);
        fc.write(buf);
        fc.force(false);
    } catch(IOException e) {
        Panic.panic(e);
    } finally {
        fileLock.unlock();
    }
}

```

PageCache còn sử dụng một **AtomicInteger** để ghi lại số lượng trang của tệp cơ sở dữ liệu đang mở. Số này được tính toán khi tệp cơ sở dữ liệu được mở và được tăng lên mỗi khi một trang mới được tạo ra.

```java
public int newPage(byte[] initData) {
    int pgno = pageNumbers.incrementAndGet();
    Page pg = new PageImpl(pgno, initData, null);
    flush(pg);  // Trang mới tạo cần được ghi ngay
    return pgno;
}

```

Một điểm cần lưu ý, dữ liệu cùng một bản ghi không được phép được lưu trữ qua nhiều trang, điều này sẽ được thể hiện từ các phần sau. Điều này có nghĩa là kích thước của mỗi bản ghi không được vượt quá kích thước của trang cơ sở dữ liệu.

## Quản lý trang dữ liệu

### Trang đầu tiên

Trang đầu tiên của tệp cơ sở dữ liệu thường được sử dụng cho một số mục đích đặc biệt, chẳng hạn như lưu trữ một số siêu dữ liệu, được sử dụng để khởi động kiểm tra và những công việc tương tự. Trang đầu tiên của MiniDB chỉ được sử dụng để thực hiện kiểm tra khởi động. Cụ thể, mỗi khi cơ sở dữ liệu được khởi động, một chuỗi byte ngẫu nhiên sẽ được tạo ra và lưu trữ từ byte 100 đến 107. Mỗi khi cơ sở dữ liệu đóng bình thường, chuỗi byte này sẽ được sao chép vào trang đầu tiên từ byte 108 đến 115.

Như vậy, mỗi khi khởi động cơ sở dữ liệu, hai điểm byte trên trang đầu tiên sẽ được kiểm tra xem chúng có giống nhau không, từ đó xác định xem lần trước cơ sở dữ liệu đã đóng bình thường hay không. Nếu có lỗi khi đóng, quá trình phục hồi dữ liệu sẽ được thực thi.

Thiết lập byte ban đầu khi khởi động:

```java
public static void setVcOpen(Page pg) {
    pg.setDirty(true);
    setVcOpen(pg.getData());
}

private static void setVcOpen(byte[] raw) {
    System.arraycopy(RandomUtil.randomBytes(LEN_VC), 0, raw, OF_VC, LEN_VC);
}

```

Sao chép byte khi đóng:

```java
public static void setVcClose(Page pg) {
    pg.setDirty(true);
    setVcClose(pg.getData());
}

private static void setVcClose(byte[] raw) {
    System.arraycopy(raw, OF_VC, raw, OF_VC+LEN_VC, LEN_VC);
}

```

Kiểm tra byte:

```java
public static boolean checkVc(Page pg) {
    return checkVc(pg.getData());
}

private static boolean checkVc(byte[] raw) {
    return Arrays.equals(Arrays.copyOfRange(raw, OF_VC, OF_VC+LEN_VC), Arrays.copyOfRange(raw, OF_VC+LEN_VC, OF_VC+2*LEN_VC));
}
```

Có vẻ như phương thức `Arrays.compare()` này không tương thích với JDK8 và có thể được thay thế bằng các phương thức tương đương khác.

### Trang bình thường

Việc quản lý các trang dữ liệu thông thường của MiniDB tương đối đơn giản. Một trang bình thường bắt đầu bằng một số nguyên không dấu 2 byte, biểu thị vị trí lệch (offset) của trang này cho không gian trống. Phần còn lại của trang là dữ liệu thực sự được lưu trữ.

Do đó, quản lý trang thông thường chủ yếu xoay quanh việc thực hiện các thao tác trên FSO (Free Space Offset). Ví dụ, khi chèn dữ liệu vào trang:

```java
// Chèn dữ liệu raw vào trang pg, trả về vị trí chèn
public static short insert(Page pg, byte[] raw) {
    pg.setDirty(true);
    short offset = getFSO(pg.getData());
    System.arraycopy(raw, 0, pg.getData(), offset, raw.length);
    setFSO(pg.getData(), (short)(offset + raw.length));
    return offset;
}
```

Trước khi ghi, lấy FSO để xác định vị trí ghi, và sau khi ghi, cập nhật FSO. Các hoạt động trên FSO như sau:

```java
private static void setFSO(byte[] raw, short ofData) {
    System.arraycopy(Parser.short2Byte(ofData), 0, raw, OF_FREE, OF_DATA);
}

// Lấy FSO của trang pg
public static short getFSO(Page pg) {
    return getFSO(pg.getData());
}

private static short getFSO(byte[] raw) {
    return Parser.parseShort(Arrays.copyOfRange(raw, 0, 2));
}

// Lấy kích thước không gian trống của trang
public static int getFreeSpace(Page pg) {
    return PageCache.PAGE_SIZE - (int)getFSO(pg.getData());
}

```

Hai hàm còn lại `recoverInsert()` và `recoverUpdate()` được sử dụng để khôi phục dữ liệu sau khi cơ sở dữ liệu bị sự cố và được mở lại.

```java
// Chèn dữ liệu raw vào trang pg tại vị trí lệch offset, và cập nhật FSO của pg
public static void recoverInsert(Page pg, byte[] raw, short offset) {
    pg.setDirty(true);
    System.arraycopy(raw, 0, pg.getData(), offset, raw.length);

    short rawFSO = getFSO(pg.getData());
    if(rawFSO < offset + raw.length) {
        setFSO(pg.getData(), (short)(offset+raw.length));
    }
}

// Chèn dữ liệu raw vào trang pg tại vị trí lệch offset, không cập nhật FSO
public static void recoverUpdate(Page pg, byte[] raw, short offset) {
    pg.setDirty(true);
    System.arraycopy(raw, 0, pg.getData(), offset, raw.length);
}

```
