---
title: MiniDB Page Index
tags:
  - project
  - minidb
categories: 
date created: 2024-04-19
date modified: 2024-04-19
---

# Triển khai Page Index và DM

## Lời nói đầu

Ở phần này, chúng ta sẽ hoàn thiện DM Layer bằng cách giới thiệu một cấu trúc chỉ mục trang đơn giản. Ngoài ra, chúng ta sẽ triển khai một khái niệm trừu tượng của DM Layer đối với lớp trên cùng: DataItem.

## Chỉ mục trang

Chỉ mục trang lưu trữ thông tin về không gian trống trên mỗi trang. Điều này giúp cho việc thực thi các thao tác chèn từ lớp trên cùng trở nên nhanh chóng hơn, bằng cách tìm kiếm nhanh chóng một trang có không gian trống phù hợp mà không cần kiểm tra thông tin của mỗi trang từ ổ đĩa hoặc bộ đệm.

MiniDB sử dụng một thuật toán đơn giản để triển khai chỉ mục trang bằng cách chia mỗi trang thành 40 khoảng. Khi khởi động, hệ thống sẽ duyệt qua tất cả các trang để lấy thông tin không gian trống của mỗi trang và sắp xếp chúng vào 40 khoảng này. Khi có yêu cầu chèn mới, hệ thống sẽ trước tiên làm tròn lên không gian cần thiết và ánh xạ nó vào một trong các khoảng này. Sau đó, bất kỳ trang nào trong khoảng đó cũng có thể đáp ứng yêu cầu.

Cài đặt của PageIndex cũng khá đơn giản, chỉ là một mảng kiểu List.

```java
public class PageIndex {
    private static final int INTERVALS_NO = 40;
    private static final int THRESHOLD = PageCache.PAGE_SIZE / INTERVALS_NO;

    private List[] lists;
}
```

Việc lấy trang từ PageIndex cũng đơn giản, chỉ cần tính toán số khoảng, sau đó trả về trang đầu tiên trong khoảng đó:

```java
public PageInfo select(int spaceSize) {
    int number = spaceSize / THRESHOLD;
    if(number < INTERVALS_NO) number ++;
    while(number <= INTERVALS_NO) {
        if(lists[number].size() == 0) {
            number++;
            continue;
        }
        return lists[number].remove(0);
    }
    return null;
}
```

PageInfo được trả về chứa thông tin về số trang và kích thước không gian trống.

Cần lưu ý rằng trang được chọn sẽ được loại bỏ trực tiếp khỏi PageIndex, điều này có nghĩa là không cho phép viết đồng thời vào cùng một trang. Sau khi lớp trên cùng đã sử dụng trang này, nó cần được chèn lại vào PageIndex:

```java
public void add(int pgno, int freeSpace) {
    int number = freeSpace / THRESHOLD;
    lists[number].add(new PageInfo(pgno, freeSpace));
}
```

Khi DataManager được tạo ra, nó cần lấy tất cả các trang và điền vào PageIndex:

```java
void fillPageIndex() {
    int pageNumber = pc.getPageNumber();
    for(int i = 2; i <= pageNumber; i ++) {
        Page pg = null;
        try {
            pg = pc.getPage(i);
        } catch (Exception e) {
            Panic.panic(e);
        }
        pIndex.add(pg.getPageNumber(), PageX.getFreeSpace(pg));
        pg.release();
    }
}
```

Lưu ý rằng trang cần phải được release ngay sau khi sử dụng để tránh tình trạng làm tràn bộ nhớ đệm.

## DataItem

DataItem là một trừu tượng dữ liệu mà DM Layer cung cấp cho lớp trên cùng. Lớp trên cùng có thể yêu cầu DM Layer trả về DataItem tương ứng thông qua địa chỉ và sau đó lấy dữ liệu từ đó.  

Cài đặt của DataItem rất đơn giản:

```java
public class DataItemImpl implements DataItem {
    private SubArray raw;
    private byte[] oldRaw;
    private DataManagerImpl dm;
    private long uid;
    private Page pg;
}
```

Việc lưu trữ một tham chiếu đến dm là vì việc giải phóng của nó phụ thuộc vào việc giải phóng của dm (dm cũng triển khai interface bộ đệm để lưu trữ DataItem) và việc ghi nhật ký khi sửa đổi dữ liệu.

Dữ liệu được lưu trữ trong DataItem có cấu trúc như sau:

```
[ValidFlag] [DataSize] [Data]
```

Trong đó, ValidFlag chiếm 1 byte, xác định liệu DataItem có hợp lệ không. Để xóa một DataItem, chỉ cần đặt bit valid của nó thành 0. DataSize chiếm 2 byte, xác định độ dài dữ liệu phía sau.

Khi lớp trên cùng nhận được DataItem, nó có thể sử dụng phương thức `data()` để truy cập dữ liệu. Mảng được trả về từ phương thức này là dữ liệu được chia sẻ, không phải là một bản sao, do đó sử dụng `SubArray`.

```java
@Override
public SubArray data() {
    return new SubArray(raw.raw, raw.start+OF_DATA, raw.end);
}
```

Khi lớp trên cùng cố gắng thay đổi DataItem, nó phải tuân thủ một quy trình nhất định: trước khi thay đổi, cần gọi phương thức `before()`, nếu muốn hoàn tác thay đổi, gọi phương thức `unBefore()`, và sau khi hoàn thành thay đổi, gọi phương thức `after()`. Toàn bộ quy trình này chủ yếu để lưu trữ giá trị trước khi thay đổi và ghi nhật ký kịp thời. DM sẽ đảm bảo rằng việc thay đổi `DataItem` là nguyên tử.

```java
@Override
public void before() {
    wLock.lock();
    pg.setDirty(true);
    System.arraycopy(raw.raw, raw.start, oldRaw, 0, oldRaw.length);
}

@Override
public void unBefore() {
    System.arraycopy(oldRaw, 0, raw.raw, raw.start, oldRaw.length);
    wLock.unlock();
}

@Override
public void after(long xid) {
    dm.logDataItem(xid, this);
    wLock.unlock();
}
```

Phương thức `after()` chủ yếu gọi một phương thức trong dm để ghi nhật ký thay đổi, không cần mô tả chi tiết ở đây.

Sau khi sử dụng xong `DataItem`, cũng cần gọi phương thức `release()` kịp thời để giải phóng bộ nhớ cache của `DataItem` (do DM cache DataItem).

```java
@Override
public void release() {
    dm.releaseDataItem(this);
}
```

## Triển khai DM

DataManager là lớp cung cấp trực tiếp các phương thức cho lớp DM, và nó cũng triển khai một bộ nhớ cache cho các đối tượng DataItem. Khóa được lưu trữ trong DataItem là một số nguyên không dấu 8 byte bao gồm số trang và lệch trang, mỗi phần chiếm 4 byte.

Đối với bộ nhớ cache DataItem, phương thức `getForCache()` chỉ cần giải mã số trang từ khóa, lấy trang từ bộ nhớ cache trang, sau đó giải mã DataItem dựa trên độ lệch:

```java
@Override
protected DataItem getForCache(long uid) throws Exception {
    short offset = (short)(uid & ((1L << 16) - 1));
    uid >>>= 32;
    int pgno = (int)(uid & ((1L << 32) - 1));
    Page pg = pc.getPage(pgno);
    return DataItem.parseDataItem(pg, offset, this);
}
```

Việc giải phóng cache DataItem chỉ đơn giản là việc giải phóng trang chứa DataItem, vì việc đọc/ghi vào tệp được thực hiện theo trang:

```java
@Override
protected void releaseForCache(DataItem di) {
    di.page().release();
}
```

Quá trình tạo DataManager từ tệp trống và tạo từ tệp đã có một chút khác biệt. Ngoài cách tạo PageCache và Logger có chút khác biệt, việc tạo từ tệp trống đầu tiên cần khởi tạo trang đầu tiên, trong khi việc tạo từ tệp đã có cần kiểm tra trang đầu tiên để xác định liệu có cần thực hiện quy trình khôi phục không. Đồng thời tạo ngẫu nhiên các byte cho trang đầu tiên.

```java
public static DataManager create(String path, long mem, TransactionManager tm) {
    PageCache pc = PageCache.create(path, mem);
    Logger lg = Logger.create(path);
    DataManagerImpl dm = new DataManagerImpl(pc, lg, tm);
    dm.initPageOne();
    return dm;
}

public static DataManager open(String path, long mem, TransactionManager tm) {
    PageCache pc = PageCache.open(path, mem);
    Logger lg = Logger.open(path);
    DataManagerImpl dm = new DataManagerImpl(pc, lg, tm);
    if(!dm.loadCheckPageOne()) {
        Recover.recover(tm, lg, pc);
    }
    dm.fillPageIndex();
    PageOne.setVcOpen(dm.pageOne);
    dm.pc.flushPage(dm.pageOne);
    return dm;
}
```

Trong đó, việc khởi tạo trang đầu tiên và kiểm tra trang đầu tiên đều được thực hiện chủ yếu thông qua các phương thức trong lớp PageOne:

```java
// Khởi tạo PageOne khi tạo tệp
void initPageOne() {
    int pgno = pc.newPage(PageOne.InitRaw());
    assert pgno == 1;
    try {
        pageOne = pc.getPage(pgno);
    } catch (Exception e) {
        Panic.panic(e);
    }
    pc.flushPage(pageOne);
}

// Đọc và kiểm tra PageOne khi mở tệp đã tồn tại
boolean loadCheckPageOne() {
    try {
        pageOne = pc.getPage(1);
    } catch (Exception e) {
        Panic.panic(e);
    }
    return PageOne.checkVc(pageOne);
}
```

DM cung cấp ba chức năng cho lớp trên cùng sử dụng, đó là đọc, chèn và sửa đổi. Sửa đổi được thực hiện thông qua DataItem lấy ra từ việc đọc, do đó DataManager chỉ cần cung cấp phương thức `read()` và `insert()`.

```java
@Override
public long insert(long xid, byte[] data) throws Exception {
    byte[] raw = DataItem.wrapDataItemRaw(data);
    if(raw.length > PageX.MAX_FREE_SPACE) {
        throw Error.DataTooLargeException;
    }

    // Thử lấy trang có thể sử dụng
    PageInfo pi = null;
    for(int i = 0; i < 5; i ++) {
        pi = pIndex.select(raw.length);
        if (pi != null) {
            break;
        } else {
            int newPgno = pc.newPage(PageX.initRaw());
            pIndex.add(newPgno, PageX.MAX_FREE_SPACE);
        }
    }
    if(pi == null) {
        throw Error.DatabaseBusyException;
    }

    Page pg = null;
    int freeSpace = 0;
    try {
        pg = pc.getPage(pi.pgno);
        // Ghi log chèn trước
        byte[] log = Recover.insertLog(xid, pg, raw);
        logger.log(log);
        // Thực hiện chèn dữ liệu
        short offset = PageX.insert(pg, raw);

        pg.release();
        return Types.addressToUid(pi.pgno, offset);

    } finally {
        // Chèn lại thông tin trang đã lấy vào pageIndex
        if(pg != null) {
            pIndex.add(pi.pgno, PageX.getFreeSpace(pg));
        } else {
            pIndex.add(pi.pgno, freeSpace);
        }
    }
}
```

Khi đóng DataManager một cách bình thường, cần phải thực hiện quy trình đóng cache và log, và không quên thiết lập kiểm tra byte đầu tiên:

```java
@Override
public void close() {
    super.close();
    logger.close();

    PageOne.setVcClose(pageOne);
    pageOne.release();
    pc.close();
}
```

Đó là tất cả về DM.
