---
title: MiniDB Log & Recovery
tags:
  - minidb
  - project
categories: 
date created: 2024-04-19
date modified: 2024-04-19
---

# Log và Recovery

## Lời nói đầu

MiniDB cung cấp khả năng phục hồi dữ liệu sau sự cố. Lớp DM sẽ ghi log vào đĩa mỗi khi nó hoạt động trên dữ liệu cơ bản. Sau khi cơ sở dữ liệu gặp sự cố, khi khởi động lại, các tệp dữ liệu có thể được khôi phục dựa trên nội dung của log để đảm bảo tính nhất quán của chúng.

## Đọc và ghi log

Tệp log nhị phân được tổ chức theo định dạng sau:

```
[XChecksum][Log1][Log2][Log3]...[LogN][BadTail]
```

Ở đây, `XChecksum` là một số nguyên 4 byte, là tổng kiểm tra tính của tất cả các log tiếp theo. `Log1` ~ `LogN` là dữ liệu log thông thường, `BadTail` là dữ liệu log chưa được ghi hoàn chỉnh khi cơ sở dữ liệu gặp sự cố, và `BadTail` không nhất thiết phải tồn tại.

Định dạng của mỗi bản ghi log như sau:

```
[Size][Checksum][Data]
```

Trong số đó, Size là số nguyên 4 byte xác định số byte trong phân đoạn Data. Checksum là tổng kiểm tra tính của bản ghi log đó.

Checksum log tính được tính bằng cách sử dụng một giá trị seed cụ thể:

```java
private int calChecksum(int xCheck, byte[] log) {
    for (byte b : log) {
        xCheck = xCheck * SEED + b;
    }
    return xCheck;
}
```

Bằng cách này, tính toán kiểm tra tính cho tất cả các log, sau đó cộng tổng sẽ thu được checksum của tệp log.

Logger được triển khai dưới dạng [[Iterator Pattern|mẫu Iterator]], thông qua phương thức `next()`, liên tục đọc ra từng bản ghi log tiếp theo từ tệp và phân tích dữ liệu bên trong rồi trả về. Triển khai của phương thức `next()` chủ yếu dựa trên phương thức `internNext()`, một cách tổng quát như sau, trong đó `position` là vị trí lệch hiện tại mà tệp log đang đọc:  

```java
private byte[] internNext() {
    if(position + OF_DATA >= fileSize) {
        return null;
    }
    // Đọc size
    ByteBuffer tmp = ByteBuffer.allocate(4);
    fc.position(position);
    fc.read(tmp);
    int size = Parser.parseInt(tmp.array());
    if(position + size + OF_DATA > fileSize) {
        return null;
    }

    // Đọc checksum + data
    ByteBuffer buf = ByteBuffer.allocate(OF_DATA + size);
    fc.position(position);
    fc.read(buf);
    byte[] log = buf.array();

    // Kiểm tra checksum
    int checkSum1 = calChecksum(0, Arrays.copyOfRange(log, OF_DATA, log.length));
    int checkSum2 = Parser.parseInt(Arrays.copyOfRange(log, OF_CHECKSUM, OF_DATA));
    if(checkSum1 != checkSum2) {
        return null;
    }
    position += log.length;
    return log;
}

```

Khi mở một tệp log, cần trước tiên kiểm tra XChecksum của tệp log và loại bỏ BadTail có thể tồn tại ở cuối tệp. Do BadTail của bản ghi log đó chưa được ghi hoàn chỉnh, nên checksum của tệp log sẽ không bao gồm checksum của bản ghi log đó. Bằng cách loại bỏ BadTail, có thể đảm bảo tính nhất quán của tệp log.

```java
private void checkAndRemoveTail() {
    rewind();

    int xCheck = 0;
    while(true) {
        byte[] log = internNext();
        if(log == null) break;
        xCheck = calChecksum(xCheck, log);
    }
    if(xCheck != xChecksum) {
        Panic.panic(Error.BadLogFileException);
    }

    // Cắt bớt tệp đến cuối log hợp lệ
    truncate(position);
    rewind();
}

```

Khi ghi vào tệp log, dữ liệu được trước tiên đóng gói thành định dạng của một bản ghi log, sau đó được ghi vào tệp. Sau khi ghi, checksum của tệp log được cập nhật và bộ đệm được đồng bộ hóa để đảm bảo nội dung được ghi vào đĩa.

```java
public void log(byte[] data) {
    byte[] log = wrapLog(data); // Đóng gói dữ liệu thành bản ghi log
    ByteBuffer buf = ByteBuffer.wrap(log);
    lock.lock();
    try {
        fc.position(fc.size()); // Đặt vị trí của con trỏ tệp đến cuối tệp log
        fc.write(buf); // Ghi bản ghi log vào tệp
    } catch(IOException e) {
        Panic.panic(e); // Xử lý ngoại lệ nếu có
    } finally {
        lock.unlock(); // Giải phóng khóa
    }
    updateXChecksum(log); // Cập nhật checksum của tệp log
}

private void updateXChecksum(byte[] log) {
    this.xChecksum = calChecksum(this.xChecksum, log); // Tính toán checksum mới
    fc.position(0); // Di chuyển đến đầu tệp
    fc.write(ByteBuffer.wrap(Parser.int2Byte(xChecksum))); // Ghi checksum mới vào tệp
    fc.force(false); // Đồng bộ hóa bộ đệm để đảm bảo nội dung được ghi vào đĩa
}

private byte[] wrapLog(byte[] data) {
    byte[] checksum = Parser.int2Byte(calChecksum(0, data)); // Tính toán checksum cho dữ liệu
    byte[] size = Parser.int2Byte(data.length); // Tính toán kích thước của dữ liệu
    return Bytes.concat(size, checksum, data); // Trả về dữ liệu được đóng gói
}

```

## Chiến lược phục hồi

Chiến lược khôi phục xuất phát từ chiến lược khôi phục của NYADB2, khá rối não (theo ý kiến ​​​​của tôi).

DM là module lớp trên và cung cấp hai thao tác, đó là chèn dữ liệu mới (I) và cập nhật dữ liệu hiện có (U). Về lý do tại sao dữ liệu không bị xóa, điều này sẽ được mô tả trong phần VM.

Chiến lược ghi log của DM rất đơn giản trong một câu:

>  Trước khi thực hiện các thao tác I và U, thao tác log tương ứng phải được thực hiện trước và các thao tác dữ liệu chỉ được thực hiện sau khi log được ghi vào đĩa.

Chiến lược ghi log này cho phép DM thoải mái hơn trong việc đồng bộ hóa các hoạt động dữ liệu trên đĩa. log được đảm bảo đến đĩa trước khi thao tác dữ liệu, vì vậy ngay cả khi thao tác dữ liệu cuối cùng không có thời gian để đồng bộ hóa với đĩa, cơ sở dữ liệu sẽ gặp sự cố và dữ liệu có thể được khôi phục thông qua log trên đĩa sau đó.

Đối với hai thao tác dữ liệu, log được DM ghi lại như sau:

- (Ti,I,A,x), biểu thị giao dịch Ti đã chèn một đoạn dữ liệu x vào vị trí A
- (Ti, U, A, oldx, newx) nghĩa là giao dịch Ti cập nhật dữ liệu tại vị trí A từ oldx thành newx  

Nếu trước tiên chúng ta không xem xét tính đồng thời thì tại một thời điểm nhất định, chỉ có một giao dịch có thể đang vận hành cơ sở dữ liệu. log sẽ trông như thế này:

```
(Ti, x, x), ..., (Ti, x, x), (Tj, x, x), ..., (Tj, x, x), (Tk, x, x), ..., (Tk, x, x)
```

### Đơn luồng

Do là đơn luồng nên các log của Ti, Tj và Tk không bao giờ giao nhau. Trong trường hợp này, việc sử dụng khôi phục log rất đơn giản. Giả sử rằng giao dịch cuối cùng trong log là Ti:

1. Redo tất cả các giao dịch trước Ti trong log:
    - Tìm kiếm qua tất cả các giao dịch trước Ti và thực thi lại chúng (redo).
2. Kiểm tra trạng thái của Ti (bằng XID file):
    - Nếu Ti đã hoàn thành (bao gồm đã commit hoặc đã rollback), thì thực thi lại Ti (redo).
    - Nếu không, thực hiện thủ tục hoàn tác (undo).

Quá trình redo cho một giao dịch Ti như sau:

1. Quét log của giao dịch Ti theo thứ tự từ đầu đến cuối:
2. Nếu log là thao tác chèn (Ti, I, A, x), thì chèn lại x vào vị trí A.
3. Nếu log là thao tác cập nhật (Ti, U, A, oldx, newx), thì cập nhật giá trị tại vị trí A thành newx.

Quá trình undo cũng tương tự:

1. Quét log của giao dịch Ti theo thứ tự từ cuối đến đầu:
2. Nếu log là thao tác chèn (Ti, I, A, x), thì xóa dữ liệu tại vị trí A.
3. Nếu log là thao tác cập nhật (Ti, U, A, oldx, newx), thì cập nhật giá trị tại vị trí A thành oldx.

Lưu ý rằng trong MiniDB thực tế không có thao tác xóa (delete) hoàn toàn. Trong trường hợp undo của thao tác chèn, chỉ cần đánh dấu cờ cho phần tử bị xóa (invalid). Việc xóa sẽ được đề cập trong phần VM.

### Đa luồng

Sau các hoạt động trên, khả năng phục hồi của MiniDB trong một luồng có thể được đảm bảo. Còn đa luồng thì sao? Chúng ta hãy xem xét hai tình huống sau đây.  

**Tình huống thứ nhất:**

```css
T1 begin
T2 begin
T2 U(x)
T1 R(x)
...
T1 commit
MiniDB break down
```

Khi hệ thống gặp sự cố, T2 vẫn đang hoạt động. Khi cơ sở dữ liệu được khôi phục và thực hiện quy trình khôi phục, T2 sẽ bị hoàn tác, loại bỏ tác động của nó đến cơ sở dữ liệu. Tuy nhiên, vì T1 đã đọc giá trị được cập nhật bởi T2, và sau đó T2 bị hoàn tác, T1 cũng phải được hoàn tác. Điều này gây ra một mâu thuẫn với việc T1 đã commit. Do đó, cần thiết lập:

> **Quy tắc 1:** Các giao dịch đang thực hiện không được đọc dữ liệu được tạo ra bởi bất kỳ giao dịch chưa được commit nào khác.

**Tình huống thứ hai:**

```css
T1 begin
T2 begin
T1 set x = x+1 // The log generated is (T1, U, A, 0, 1)
T2 set x = x+1 // The log generated is (T1, U, A, 1, 2)
T2 commit
MiniDB break down
```

Khi hệ thống gặp sự cố, T1 vẫn đang hoạt động. Khi cơ sở dữ liệu được khôi phục, T1 sẽ được hoàn tác và T2 sẽ được thực thi lại. Tuy nhiên, không có cách nào để đảm bảo rằng giá trị cuối cùng của x là 0 hoặc 2. Điều này là do log của chúng ta quá đơn giản, chỉ ghi lại "trạng thái trước" và "trạng thái sau". Giải pháp cho vấn đề này có hai cách:

1. Mở rộng loại log.
2. Hạn chế các hoạt động cơ sở dữ liệu.  

Trong MiniDB, giải pháp được sử dụng là hạn chế các hoạt động cơ sở dữ liệu, đảm bảo rằng:

> **Quy định 2:** Các giao dịch đang thực thi không được sửa đổi dữ liệu được tạo ra hoặc sửa đổi bởi bất kỳ giao dịch chưa được commit nào khác.

Khi quy định 1 và quy định 2 được thực hiện trong VM và truyền xuống lớp DM, tất cả các trường hợp đồng thời của log có thể được giải quyết bằng cách:

- Thực thhi lại tất cả các giao dịch đã hoàn tất (đã commit hoặc đã rollback) khi khôi phục.
- Hoàn tác tất cả các giao dịch chưa hoàn thành (đang hoạt động) khi khôi phục.

### Triển khai

Trước hết, đặt hai định dạng log như sau:

```java
private static final byte LOG_TYPE_INSERT = 0;
private static final byte LOG_TYPE_UPDATE = 1;

// updateLog:
// [LogType] [XID] [UID] [OldRaw] [NewRaw]

// insertLog:
// [LogType] [XID] [Pgno] [Offset] [Raw]

```

Giống như mô tả trong lý thuyết, quy trình khôi phục chủ yếu cũng gồm hai bước: redo (thực thi lại) tất cả các giao dịch đã hoàn tất và undo (hoàn tác) tất cả các giao dịch chưa hoàn tất:

```java
private static void redoTranscations(TransactionManager tm, Logger lg, PageCache pc) {
    lg.rewind();
    while(true) {
        byte[] log = lg.next();
        if(log == null) break;
        if(isInsertLog(log)) {
            InsertLogInfo li = parseInsertLog(log);
            long xid = li.xid;
            if(!tm.isActive(xid)) {
                doInsertLog(pc, log, REDO);
            }
        } else {
            UpdateLogInfo xi = parseUpdateLog(log);
            long xid = xi.xid;
            if(!tm.isActive(xid)) {
                doUpdateLog(pc, log, REDO);
            }
        }
    }
}

private static void undoTranscations(TransactionManager tm, Logger lg, PageCache pc) {
    Map<Long, List<byte[]>> logCache = new HashMap<>();
    lg.rewind();
    while(true) {
        byte[] log = lg.next();
        if(log == null) break;
        if(isInsertLog(log)) {
            InsertLogInfo li = parseInsertLog(log);
            long xid = li.xid;
            if(tm.isActive(xid)) {
                if(!logCache.containsKey(xid)) {
                    logCache.put(xid, new ArrayList<>());
                }
                logCache.get(xid).add(log);
            }
        } else {
            UpdateLogInfo xi = parseUpdateLog(log);
            long xid = xi.xid;
            if(tm.isActive(xid)) {
                if(!logCache.containsKey(xid)) {
                    logCache.put(xid, new ArrayList<>());
                }
                logCache.get(xid).add(log);
            }
        }
    }

    // Undo tất cả các log đang active
    for(Entry<Long, List<byte[]>> entry : logCache.entrySet()) {
        List<byte[]> logs = entry.getValue();
        for (int i = logs.size()-1; i >= 0; i --) {
            byte[] log = logs.get(i);
            if(isInsertLog(log)) {
                doInsertLog(pc, log, UNDO);
            } else {
                doUpdateLog(pc, log, UNDO);
            }
        }
        tm.abort(entry.getKey());
    }
}

```

Cả hai loại log redo và undo được triển khai trong cùng một phương thức:

```java
private static void doUpdateLog(PageCache pc, byte[] log, int flag) {
    int pgno;
    short offset;
    byte[] raw;
    if(flag == REDO) {
        UpdateLogInfo xi = parseUpdateLog(log);
        pgno = xi.pgno;
        offset = xi.offset;
        raw = xi.newRaw;
    } else {
        UpdateLogInfo xi = parseUpdateLog(log);
        pgno = xi.pgno;
        offset = xi.offset;
        raw = xi.oldRaw;
    }
    Page pg = null;
    try {
        pg = pc.getPage(pgno);
    } catch (Exception e) {
        Panic.panic(e);
    }
    try {
        PageX.recoverUpdate(pg, raw, offset);
    } finally {
        pg.release();
    }
}

private static void doInsertLog(PageCache pc, byte[] log, int flag) {
    InsertLogInfo li = parseInsertLog(log);
    Page pg = null;
    try {
        pg = pc.getPage(li.pgno);
    } catch(Exception e) {
        Panic.panic(e);
    }
    try {
        if(flag == UNDO) {
            DataItem.setDataItemRawInvalid(li.raw);
        }
        PageX.recoverInsert(pg, li.raw, li.offset);
    } finally {
        pg.release();
    }
}

```

Chú ý rằng trong phương thức `doInsertLog()`, việc xóa được thực hiện bằng cách sử dụng `DataItem.setDataItemRawInvalid(li.raw)`, trong đó dataItem sẽ được giải thích trong phần tiếp theo, ý nghĩa chung là đặt bit hiệu lực của mục dữ liệu đó thành không hiệu lực để thực hiện xóa logic (soft delete).
