---
title: MiniDB Deadlock & VM
tags:
  - minidb
  - project
categories: 
date created: 2024-04-20
date modified: 2024-04-20
---

# Phát hiện deadlock và triển khai VM

## Lời nói đầu

Phần này sẽ kết thúc lớp VM, giới thiệu vấn đề nhảy phiên bản có thể do MVCC gây ra và cách MiniDB tránh các deadlock do 2PL gây ra và tích hợp nó vào Version Manager.

## Vấn đề nhảy phiên bản

Trước khi giới thiệu vấn đề nhảy phiên bản, hãy đề cập đến việc triển khai MVCC làm cho việc thu hồi hoặc quay lại giao dịch trở nên rất đơn giản trong MiniDB: chỉ cần đánh dấu giao dịch đó là đã hủy. Dựa trên khả năng hiển thị đã được đề cập trong chương trước, mỗi giao dịch chỉ có thể nhìn thấy dữ liệu được tạo ra bởi các giao dịch đã được commit, vì vậy dữ liệu được tạo ra bởi một giao dịch đã hủy không ảnh hưởng đến các giao dịch khác, nó giống như giao dịch đó chưa từng tồn tại.  

Vấn đề bước nhảy phiên bản liên quan đến trường hợp sau, giả sử X chỉ có phiên bản x0 ban đầu, và T1 và T2 đều có cấp độ cách biệt lặp lại:

```
T1 begin
T2 begin
R1(X) // T1 reads x0
R2(X) // T2 reads x0
U1(X) // T1 updates X to x1
T1 commit
U2(X) // T2 updates X to x2
T2 commit
```

Mặc dù tình huống như vậy có thể không gặp vấn đề trong thực tế, nhưng từ quan điểm logic thì không chính xác. T1 cập nhật X từ x0 lên x1, điều này không có vấn đề. Nhưng T2 lại trực tiếp cập nhật X từ x0 lên x2 mà không thông qua x1.

Dưới cấp độ cô lập read commited, việc nhảy phiên bản được phép xảy ra, nhưng dưới cấp độ cô lập repeatable read thì không được phép. Phương pháp giải quyết vấn đề bước nhảy phiên bản cũng rất đơn giản: nếu giao dịch Ti cần cập nhật X, và X đã được giao dịch không thể nhìn thấy Ti làm thay đổi, thì yêu cầu Ti hủy bỏ.

Như đã tóm tắt ở phần trước, có hai tình huống xảy ra với Tj khi Ti vô hình:

1. XID(Tj) > XID(Ti)
2. Tj nằm trong SP(Ti)

Vì vậy, việc kiểm tra nhảy phiên bản rất đơn giản. Lấy ra phiên bản mới nhất của dữ liệu X cần sửa đổi và kiểm tra xem người tạo phiên bản mới nhất có hiển thị với giao dịch hiện tại hay không:

```java
public static boolean isVersionSkip(TransactionManager tm, Transaction t, Entry e) {
    long xmax = e.getXmax();
    if(t.level == 0) {
        return false;
    } else {
        return tm.isCommitted(xmax) && (xmax > t.xid  t.isInSnapshot(xmax));
  }
}
```

## Phát hiện deadlock

Trong phần trước, đã đề cập đến việc 2PL sẽ block các giao dịch cho đến khi luồng nắm giữ khóa giải phóng khóa. Có thể trừu tượng hóa mối quan hệ chờ đợi này thành các cạnh có hướng, ví dụ như Tj đang chờ đợi Ti, có thể biểu diễn là Tj -> Ti. Như vậy, hàng nghìn cạnh có hướng có thể tạo thành một đồ thị (không nhất thiết phải là đồ thị liên thông). Việc phát hiện deadlock cũng trở nên đơn giản chỉ cần kiểm tra xem đồ thị này có chu trình không.  

MiniDB sử dụng một đối tượng LockTable để duy trì bảng này trong bộ nhớ. Cấu trúc duy trì như sau:

```java
public class LockTable {

    private Map<Long, List<Long>> x2u;  // Danh sách UID của tài nguyên đã được XID nắm giữ
    private Map<Long, Long> u2x;        // UID đã được XID nào đó nắm giữ
    private Map<Long, List<Long>> wait; // Danh sách XID đang chờ UID
    private Map<Long, Lock> waitLock;   // Lock của XID đang chờ tài nguyên
    private Map<Long, Long> waitU;      // UID mà XID đang chờ
    private Lock lock;

    ...
}
```

Mỗi khi có tình huống chờ đợi xảy ra, hệ thống sẽ cố gắng thêm một cạnh vào đồ thị và thực hiện phát hiện deadlock. Nếu phát hiện deadlock, cạnh sẽ bị loại bỏ và giao dịch đó sẽ bị hủy.

```java
// Nếu không cần chờ đợi, trả về null, nếu không, trả về đối tượng khóa
// Nếu gặp deadlock, ném ra ngoại lệ
public Lock add(long xid, long uid) throws Exception {
    lock.lock();
    try {
        if(isInList(x2u, xid, uid)) {
            return null;
        }
        if(!u2x.containsKey(uid)) {
            u2x.put(uid, xid);
            putIntoList(x2u, xid, uid);
            return null;
        }
        waitU.put(xid, uid);
        putIntoList(wait, xid, uid);
        if(hasDeadLock()) {
            waitU.remove(xid);
            removeFromList(wait, uid, xid);
            throw Error.DeadlockException;
        }
        Lock l = new ReentrantLock();
        l.lock();
        waitLock.put(xid, l);
        return l;
    } finally {
        lock.unlock();
    }
}
```

Gọi add, nếu cần phải chờ đợi, sẽ trả về một đối tượng Lock đã được khóa. Người gọi cần thử nắm giữ khóa của đối tượng này khi nhận được, để thực hiện mục đích chặn luồng, ví dụ:

```java
Lock l = lt.add(xid, uid);
if(l != null) {
    l.lock();   // Đang chặn ở đây
    l.unlock();
}
```

Thuật toán tìm chu trình trong đồ thị cũng rất đơn giản, chỉ là một phần của việc tìm kiếm đệ qui, chỉ cần chú ý rằng đồ thị này không nhất thiết là một đồ thị liên thông. Ý tưởng là thiết lập một dấu thời gian truy cập cho mỗi nút, ban đầu được khởi tạo là -1. Sau đó, lặp qua tất cả các nút, sử dụng mỗi nút không phải là -1 làm nút gốc để thực hiện tìm kiếm đệ qui, và đặt tất cả các nút mà đệ qui gặp phải trong cùng một thành phần liên thông thành một số, các thành phần liên thông khác nhau có số khác nhau. Điều này có nghĩa là nếu trong quá trình lặp lại đồ thị nào đó, gặp lại một nút đã được lặp lại trước đó, nghĩa là đã gặp chu trình.

Việc triển khai rất đơn giản:

```java
private boolean hasDeadLock() {
    xidStamp = new HashMap<>();
    stamp = 1;
    for(long xid : x2u.keySet()) {
        Integer s = xidStamp.get(xid);
        if(s != null && s > 0) {
            continue;
        }
        stamp ++;
        if(dfs(xid)) {
            return true;
        }
    }
    return false;
}

private boolean dfs(long xid) {
    Integer stp = xidStamp.get(xid);
    if(stp != null && stp == stamp) {
        return true;
    }
    if(stp != null && stp < stamp) {
        return false;
    }
    xidStamp.put(xid, stamp);

    Long uid = waitU.get(xid);
    if(uid == null) return false;
    Long x = u2x.get(uid);
    assert x != null;
    return dfs(x);
}
```

Khii một giao dịch commit hoặc abort, tất cả các khóa mà nó đang giữ sẽ được giải phóng và giao dịch sẽ được loại bỏ khỏi đồ thị chờ đợi.

```java
public void remove(long xid) {
    lock.lock();
    try {
        List<Long> l = x2u.get(xid);
        if(l != null) {
            while(l.size() > 0) {
                Long uid = l.remove(0);
                selectNewXID(uid);
            }
        }
        waitU.remove(xid);
        x2u.remove(xid);
        waitLock.remove(xid);
    } finally {
        lock.unlock();
    }
}
```

Vòng lặp while giải phóng tất cả các khóa mà luồng này đang giữ, các tài nguyên này có thể được các luồng đang chờ sử dụng:

```java
private void selectNewXID(long uid) {
    u2x.remove(uid);
    List<Long> l = wait.get(uid);
    if(l == null) return;
    assert l.size() > 0;
    while(l.size() > 0) {
        long xid = l.remove(0);
        if(!waitLock.containsKey(xid)) {
            continue;
        } else {
            u2x.put(uid, xid);
            Lock lo = waitLock.remove(xid);
            waitU.remove(xid);
            lo.unlock();
            break;
        }
    }
    if(l.size() == 0) wait.remove(uid);
}
```

Việc thử mở khóa bắt đầu từ đầu danh sách và là một khóa công bằng. Khi mở khóa, đơn giản là unlock đối tượng Lock này, do đó luồng nghiệp vụ sẽ có thể tiếp tục.

## Triển khai Version Manager

VM triển khai thông qua interface VersionManager, cung cấp các tính năng cho lớp trên như sau:

```java
public interface VersionManager {
    byte[] read(long xid, long uid) throws Exception;
    long insert(long xid, byte[] data) throws Exception;
    boolean delete(long xid, long uid) throws Exception;

    long begin(int level);
    void commit(long xid) throws Exception;
    void abort(long xid);
}
```

Đồng thời, lớp triển khai của VM cũng được thiết kế để làm bộ nhớ cache cho Entry, cần phải kế thừa `AbstractCache<Entry>`. Các phương thức cần được triển khai để lấy dữ liệu từ cache và giải phóng chúng:

```java
@Override
protected Entry getForCache(long uid) throws Exception {
    Entry entry = Entry.loadEntry(this, uid);
    if(entry == null) {
        throw Error.NullEntryException;
    }
    return entry;
}

@Override
protected void releaseForCache(Entry entry) {
    entry.remove();
}
```

Phương thức begin() khởi động một giao dịch và khởi tạo cấu trúc của giao dịch, lưu trữ nó trong activeTransaction để sử dụng cho kiểm tra và snapshot:

```java
@Override
public long begin(int level) {
    lock.lock();
    try {
        long xid = tm.begin();
        Transaction t = Transaction.newTransaction(xid, level, activeTransaction);
        activeTransaction.put(xid, t);
        return xid;
    } finally {
        lock.unlock();
    }
}
```

Phương thức commit() được sử dụng để cam kết một giao dịch, chủ yếu là giải phóng các cấu trúc liên quan và giải phóng các khóa đang giữ, sau đó thay đổi trạng thái của TM:

```java
@Override
public void commit(long xid) throws Exception {
    lock.lock();
    Transaction t = activeTransaction.get(xid);
    lock.unlock();
    try {
        if(t.err != null) {
            throw t.err;
        }
    } catch(NullPointerException n) {
        System.out.println(xid);
        System.out.println(activeTransaction.keySet());
        Panic.panic(n);
    }
    lock.lock();
    activeTransaction.remove(xid);
    lock.unlock();
    lt.remove(xid);
    tm.commit(xid);
}
```

Phương thức abort() có hai loại, thủ công và tự động. Loại thủ công đề cập đến việc gọi phương thức abort(), trong khi tự động là khi giao dịch được phát hiện có deadlock, giao dịch rollback sẽ tự động bị hủy hoặc khi xảy ra hiện tượng nhảy phiên bản, việc rollback cũng sẽ tự động được khôi phục:

```java
private void internAbort(long xid, boolean autoAborted) {
    lock.lock();
    Transaction t = activeTransaction.get(xid);
    if(!autoAborted) {
        activeTransaction.remove(xid);
    }
    lock.unlock();
    if(t.autoAborted) return;
    lt.remove(xid);
    tm.abort(xid);
}
```

Phương thức read() được sử dụng để đọc một entry, chú ý kiểm tra tính hiệu lực là đủ:

```java
@Override
public byte[] read(long xid, long uid) throws Exception {
    lock.lock();
    Transaction t = activeTransaction.get(xid);
    lock.unlock();
    if(t.err != null) {
        throw t.err;
    }
    Entry entry = super.get(uid);
    try {
        if(Visibility.isVisible(tm, t, entry)) {
            return entry.data();
        } else {
            return null;
        }
    } finally {
        entry.release();
    }
}
```

Phương thức insert() được sử dụng để bao gói dữ liệu thành một Entry, sau đó gửi cho DM:

```java
@Override
public long insert(long xid, byte[] data) throws Exception {
    lock.lock();
    Transaction t = activeTransaction.get(xid);
    lock.unlock();
    if(t.err != null) {
        throw t.err;
    }
    byte[] raw = Entry.wrapEntryRaw(xid, data);
    return dm.insert(xid, raw);
}
```

Phương thức delete() có vẻ phức tạp một chút:

```java
@Override
public boolean delete(long xid, long uid) throws Exception {
    lock.lock();
    Transaction t = activeTransaction.get(xid);
    lock.unlock();

    if(t.err != null) {
        throw t.err;
    }
    Entry entry = super.get(uid);
    try {
        if(!Visibility.isVisible(tm, t, entry)) {
            return false;
        }
        Lock l = null;
        try {
            l = lt.add(xid, uid);
        } catch(Exception e) {
            t.err = Error.ConcurrentUpdateException;
            internAbort(xid, true);
            t.autoAborted = true;
            throw t.err;
        }
        if(l != null) {
            l.lock();
            l.unlock();
        }
        if(entry.getXmax() == xid) {
            return false;
        }
        if(Visibility.isVersionSkip(tm, t, entry)) {
            t.err = Error.ConcurrentUpdateException;
            internAbort(xid, true);
            t.autoAborted = true;
            throw t.err;
        }
        entry.setXmax(xid);
        return true;
    } finally {
        entry.release();
    }
}
```

Thực tế, nó chủ yếu là ba việc tiền điều: một là kiểm tra tính hiệu lực, hai là nhận khóa tài nguyên, ba là kiểm tra nhảy phiên bản. Hoạt động xóa chỉ có một việc duy nhất là thiết lập XMAX.
