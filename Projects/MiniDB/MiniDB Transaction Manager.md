---
title: MiniDB Transaction Manager
tags: 
categories: 
date created: 2024-04-19
date modified: 2024-04-19
---

# Bắt đầu với Transaction Manager

Như đã đề cập trước:

> TM duy trì trạng thái giao dịch bằng cách duy trì các tệp **XID** và cung cấp interface cho các module khác để truy vấn trạng thái của một giao dịch nhất định.

### Tập tin XID

Sau đây chủ yếu là định nghĩa của các quy tắc.

Trong MiniDB, mỗi giao dịch có một **XID**, xác định giao dịch đólà duy nhất. **XID** của giao dịch được đánh số bắt đầu từ 1 và tự tăng dần và không thể lặp lại. Và đặc biệt quy định **XID** 0 là siêu giao dịch (Super Transaction). Khi một số thao tác muốn được thực thi mà không yêu cầu giao dịch, **XID** của thao tác có thể được đặt thành 0. Trạng thái của giao dịch với **XID** 0 luôn được commit.

Trình quản lý giao dịch duy trì một tệp ở định dạng XID để ghi lại trạng thái của từng giao dịch. Trong MiniDB, mỗi giao dịch có ba trạng thái sau:

1. Đang hoạt động, đang diễn ra, chưa kết thúc (Running)
2. Cam kết, hoàn thành (Commit)
3. Bị hủy bỏ, bị thu hồi (Rollback)

Tệp XID phân bổ một byte dung lượng cho mỗi giao dịch để lưu trạng thái của nó. Đồng thời, một số 8 byte cũng được lưu trong phần header của file XID, ghi lại số lượng giao dịch được quản lý bởi file XID này. Do đó, trạng thái của giao dịch xid trong tệp được lưu trữ ở `(xid-1)+8` byte `xid-1` là do không cần ghi lại trạng thái của xid 0 (Super XID).

Trình quản lý giao dịch cung cấp một số interface để các module khác gọi để tạo giao dịch và truy vấn trạng thái giao dịch. Cụ thể hơn:

```java
public interface TransactionManager {
    long begin();                       // Start a new transaction
    void commit(long xid);             // Commit a transaction
    void abort(long xid);              // Abort a transaction
    boolean isActive(long xid);        // Check if a transaction is active
    boolean isCommitted(long xid);     // Check if a transaction is committed
    boolean isAborted(long xid);       // Check if a transaction is aborted
    void close();                      // Close the Transaction Manager
}
```

## Triển khai

Các quy tắc rất đơn giản, phần còn lại là triển khai code.

Đầu tiên xác định một số hằng số cần thiết:

```java
// Length of XID file header
static final int LEN_XID_HEADER_LENGTH = 8;
// Size of each transaction
private static final int XID_FIELD_SIZE = 1;

// Three states of a transaction
private static final byte FIELD_TRAN_ACTIVE = 0;
private static final byte FIELD_TRAN_COMMITTED = 1;
private static final byte FIELD_TRAN_ABORTED = 2;

// Super transaction, always in committed state
public static final long SUPER_XID = 0;

static final String XID_SUFFIX = ".xid";
```

Đọc và ghi tệp sử dụng NIO FileChannel. Phương pháp đọc và ghi hơi khác so với Luồng đầu vào/đầu ra IO truyền thống. Tuy nhiên, sự khác biệt chủ yếu nằm ở interface.

Sau khi hàm tạo tạo **TransactionManager**, trước tiên tệp **XID** phải được xác minh để đảm bảo rằng đó là tệp **XID** hợp lệ. Phương pháp xác minh cũng rất đơn giản. Độ dài lý thuyết của tệp được suy ra từ số 8 byte trong tiêu đề tệp và được so sánh với độ dài thực tế của tệp. Nếu khác, tệp XID được coi là không hợp lệ.

```java
private void checkXIDCounter() {
    long fileLen = 0;
    try {
        fileLen = file.length();
    } catch (IOException e1) {
        Panic.panic(Error.BadXIDFileException);
    }
    if(fileLen < LEN_XID_HEADER_LENGTH) {
        Panic.panic(Error.BadXIDFileException);
    }

    ByteBuffer buf = ByteBuffer.allocate(LEN_XID_HEADER_LENGTH);
    try {
        fc.position(0);
        fc.read(buf);
    } catch (IOException e) {
        Panic.panic(e);
    }
    this.xidCounter = Parser.parseLong(buf.array());
    long end = getXidPosition(this.xidCounter + 1);
    if(end != fileLen) {
        Panic.panic(Error.BadXIDFileException);
    }
}
```

Nếu xác minh không thành công, phương pháp hoảng loạn sẽ được sử dụng trực tiếp để buộc tắt máy. Lỗi ở một số module cơ bản sẽ được xử lý theo cách này. Lỗi không thể phục hồi chỉ có thể tắt trực tiếp.

Trước tiên chúng ta có thể viết một phương thức nhỏ để lấy offset của trạng thái xid trong tệp:

```java
// Get the position in the xid file corresponding to the transaction xid  
private long getXidPosition(long xid) {  
    return LEN_XID_HEADER_LENGTH + (xid - 1) * XID_FIELD_SIZE;  
}
```

Phương thức `begin()` này sẽ bắt đầu một giao dịch. Cụ thể hơn, trước tiên, nó đặt trạng thái của giao dịch thành hoạt động `xidCounter+1`, sau đó `xidCounter` được tăng lên và tiêu đề tệp được cập nhật.

```java
    // Start a transaction and return XID
    @Override
    public long begin() {
        counterLock.lock();
        try {
            long xid = xidCounter + 1;
            updateXID(xid, FIELD_TRAN_ACTIVE);
            incrXIDCounter();
            return xid;
        } finally {
            counterLock.unlock();
        }
    }


    // Update the status of the xid transaction to 'status'
    private void updateXID(long xid, byte status) {
        long offset = getXidPosition(xid);
        byte[] tmp = new byte[XID_FIELD_SIZE];
        tmp[0] = status;
        ByteBuffer buf = ByteBuffer.wrap(tmp);
        try {
            fc.position(offset);
            fc.write(buf);
        } catch (IOException e) {
            Panic.panic(e);
        }
        try {
            fc.force(false);
        } catch (IOException e) {
            Panic.panic(e);
        }
    }

    // Increment XID by one and update XID Header
    private void incrXIDCounter() {
        xidCounter++;
        ByteBuffer buf = ByteBuffer.wrap(Parser.long2Byte(xidCounter));
        try {
            fc.position(0);
            fc.write(buf);
        } catch (IOException e) {
            Panic.panic(e);
        }
        try {
            fc.force(false);
        } catch (IOException e) {
            Panic.panic(e);
        }
    }

```

Lưu ý rằng tất cả các thao tác với file ở đây cần phải được xóa vào file ngay sau khi thực thi để tránh việc file bị mất dữ liệu sau khi gặp sự cố. Phương thức `force()` của `fileChannel` buộc nội dung bộ đệm phải được đồng bộ hóa với file, tương tự như phương thức `flush()` trong BIO. Tham số của phương thức bắt buộc là Boolean cho biết có đồng bộ hóa siêu dữ liệu của tệp hay không (chẳng hạn như thời gian sửa đổi lần cuối, v.v.).

Các phương thức `commit()` và `abort()` có thể được triển khai trực tiếp với sự hỗ trợ của phương thức `updateXID()`.

```java
    // Check if the XID transaction is in the specified status
    private boolean checkXID(long xid, byte status) {
        long offset = getXidPosition(xid);
        ByteBuffer buf = ByteBuffer.wrap(new byte[XID_FIELD_SIZE]);
        try {
            fc.position(offset);
            fc.read(buf);
        } catch (IOException e) {
            Panic.panic(e);
        }
        return buf.array()[0] == status;
    }
```

Tất nhiên, hãy nhớ loại trừ `SUPER_XID` giữa các lần kiểm tra.

Ngoài ra, có hai phương thức tĩnh: `create()`và `open()`, tương ứng thể hiện việc tạo tệp XID và tạo TM và tạo TM từ tệp XID hiện có. Khi tạo tệp XID từ đầu, bạn cần viết tiêu đề tệp XID trống, nghĩa là đặt `xidCounter` thành 0, nếu không việc xác minh tiếp theo sẽ là không hợp lệ:

```java
    public static TransactionManagerImpl create(String path) {
        
        ...

        // Write empty XID file header
        ByteBuffer buf = ByteBuffer.wrap(new byte[TransactionManagerImpl.LEN_XID_HEADER_LENGTH]);
        try {
            fc.position(0);
            fc.write(buf);
        } catch (IOException e) {
            Panic.panic(e);
        }

        return new TransactionManagerImpl(raf, fc);
    }
```

Đến đây có thể xem là xong phần TM, có vẻ không khó khăn gì!
