---
title: MiniDB Transaction Isolation
tags:
  - minidb
  - project
categories: 
date created: 2024-04-19
date modified: 2024-04-20
---

# Tách biệt phiên bản đã ghi khỏi giao dịch

## Giới thiệu

Bắt đầu từ chương này, chúng ta sẽ bắt đầu trình bày về Version Manager (VM).

> VM triển khai khả năng tuần tự hóa của các chuỗi lập lịch dựa trên giao thức khóa hai giai đoạn và triển khai MVCC để loại bỏ việc chặn ghi đọc. Cả hai mức cô lập đều được triển khai đồng thời.

Tương tự như Data Manager là trung tâm quản lý dữ liệu của MiniDB, Version Manager là trung tâm quản lý giao dịch và phiên bản dữ liệu của MiniDB.

## 2PL và MVCC

### XUNG ĐỘT VÀ 2PL

Đầu tiên, hãy xác định xung đột trong cơ sở dữ liệu. Tạm thời không xem xét các hoạt động chèn, chỉ xem xét các hoạt động cập nhật (U) và đọc (R). Hai hoạt động chỉ cần đáp ứng ba điều kiện sau, chúng ta có thể nói rằng hai hoạt động này xung đột lẫn nhau:

1. Hai hoạt động được thực hiện bởi hai giao dịch khác nhau.
2. Hai hoạt động này hoạt động trên cùng một mục dữ liệu.
3. Ít nhất một trong hai hoạt động là hoạt động cập nhật.

Với việc này, có chỉ hai trường hợp xung đột cho các hoạt động trên cùng một dữ liệu:

1. Xung đột giữa hai hoạt động cập nhật từ hai giao dịch khác nhau.
2. Xung đột giữa các hoạt động cập nhật và đọc từ hai giao dịch khác nhau.

Vậy xung đột hoặc không xung đột có ý nghĩa gì? Ý nghĩa của việc này là việc hoán đổi thứ tự của hai hoạt động không xung đột không ảnh hưởng đến kết quả cuối cùng, trong khi việc hoán đổi thứ tự của hai hoạt động xung đột sẽ có ảnh hưởng.

Bây giờ hãy bỏ qua vấn đề xung đột. Bạn có nhớ ví dụ được đưa ra trong bài trước không? Trong tình huống đồng thời, hai giao dịch cùng thực hiện hoạt động trên x. Giả sử giá trị ban đầu của x là 0:

```
T1 begin
T2 begin
R1(x) // T1 reads 0
R2(x) // T2 reads 0
U1(0+1) // T1 tries to put x+1
U2(0+1) // T2 tries to put x+1
T1 commit
T2 commit
```

Kết quả cuối cùng của x là 1, kết quả này rõ ràng không đúng.

Một trong những trách nhiệm quan trọng của VM là triển khai chuỗi lịch trình có thể tính tuần tự. MiniDB sử dụng giao thức khóa hai giai đoạn (2PL - Two Phase Lock) để triển khai điều này. Khi sử dụng 2PL, nếu một giao dịch i đã khóa x và một giao dịch j khác cũng muốn thực thi hoạt động trên x, nhưng hoạt động này xung đột với các hoạt động trước đó của giao dịch i, thì giao dịch j sẽ bị chặn. Ví dụ, khi T1 đã khóa x vì U1(x), thì các hoạt động đọc hoặc ghi của T2 trên x sẽ bị chặn, và T2 phải đợi T1 giải phóng khóa trên x.  

Từ quan điểm này, 2PL đảm bảo rằng trình tự lập lịch có thể được tuần tự hóa, nhưng chắc chắn nó sẽ dẫn đến việc chặn lẫn nhau giữa các giao dịch và thậm chí có thể dẫn đến bế tắc. Để nâng cao hiệu quả xử lý giao dịch và giảm khả năng bị chặn, MiniDB triển khai MVCC.

### MVCC

Trước khi giới thiệu về MVCC, đầu tiên hãy làm rõ các khái niệm về bản ghi (entry) và phiên bản (version).  
Tầng DM cung cấp khái niệm về mục dữ liệu (Data Item) cho các tầng phía trên, trong khi VM cung cấp khái niệm về bản ghi (entry) cho các tầng phía trên thông qua việc quản lý tất cả các mục dữ liệu. Các module phía trên thao tác với đơn vị dữ liệu tối thiểu bằng cách thao tác với entry. Trong VM, mỗi bản ghi đều được duy trì một số phiên bản (version). Mỗi khi một module phía trên thay đổi một bản ghi nào đó, VM sẽ tạo ra một phiên bản mới cho bản ghi đó.

MiniDB sử dụng MVCC để giảm xác suất chặn của các giao dịch. Ví dụ, T1 muốn cập nhật giá trị của bản ghi X, do đó T1 cần khóa X trước tiên, sau đó cập nhật nó, tức là tạo ra một phiên bản mới của X, giả sử là x3. Giả sử T1 chưa giải phóng khóa của X, khi đó T2 muốn đọc giá trị của X, lúc này không có chặn nào xảy ra, MiniDB sẽ trả về một phiên bản cũ hơn của X, chẳng hạn là x2. Kết quả cuối cùng là, T2 được thực hiện trước, T1 sau, chuỗi lịch trình vẫn có thể tuần tự hoá. Nếu không có phiên bản cũ hơn nào của X, thì chỉ có thể chờ đợi T1 giải phóng khóa. Do đó, chỉ giảm xác suất chặn.

Hãy nhớ trong bài trước, để đảm bảo dữ liệu có thể khôi phục được, chuỗi lệnh được chuyển từ tầng VM xuống tầng DM cần tuân thủ hai quy tắc sau:

> Quy tắc 1: Giao dịch đang thực thi sẽ không đọc bất kỳ dữ liệu nào được tạo ra bởi bất kỳ giao dịch chưa được xác nhận nào khác.  
> Quy tắc 2: Giao dịch đang thực thi sẽ không sửa đổi bất kỳ dữ liệu được tạo ra hoặc sửa đổi bởi bất kỳ giao dịch chưa được cam kết nào khác.

Với sự kết hợp của 2PL và MVCC, chúng ta có thể thấy rằng cả hai điều kiện này đều dễ dàng được đáp ứng.

## Triển khai

Đối với mỗi bản ghi, MiniDB sử dụng lớp Entry để duy trì cấu trúc của nó. Mặc dù theo lý thuyết, MVCC triển khai nhiều phiên bản, nhưng trong thực tế, VM không cung cấp hoạt động Cập nhật, việc cập nhật trường được thực hiện bởi bảng và Table Manager (TBM) ở phía sau. Do đó, trong triển khai của VM, mỗi bản ghi chỉ có một phiên bản.

Mỗi bản ghi được lưu trữ trong một mục dữ liệu, vì vậy Entry chỉ cần lưu trữ một tham chiếu của DataItem:

```java
public class Entry {
    private static final int OF_XMIN = 0;
    private static final int OF_XMAX = OF_XMIN + 8;
    private static final int OF_DATA = OF_XMAX + 8;

    private long uid;
    private DataItem dataItem;
    private VersionManager vm;

    public static Entry loadEntry(VersionManager vm, long uid) throws Exception {
        DataItem di = ((VersionManagerImpl) vm).dm.read(uid);
        return newEntry(vm, di, uid);
    }

    public void remove() {
        dataItem.release();
    }
}
```

Chúng ta quy định rằng định dạng dữ liệu được lưu trữ trong mỗi bản ghi như sau:

```
[XMIN] [XMAX] [DATA]
```

`XMIN` là số hiệu giao dịch tạo ra bản ghi (phiên bản), trong khi `XMAX` là số hiệu giao dịch xóa bản ghi đó (phiên bản). Chúng sẽ được giải thích ở phần tiếp theo. `DATA` là dữ liệu mà bản ghi đó giữ. Dựa trên cấu trúc này, phương thức `wrapEntryRaw()` được gọi khi tạo bản ghi như sau:

```java
public static byte[] wrapEntryRaw(long xid, byte[] data) {
    byte[] xmin = Parser.long2Byte(xid);
    byte[] xmax = new byte[8];
    return Bytes.concat(xmin, xmax, data);
}
```

Tương tự, nếu muốn truy xuất dữ liệu mà bản ghi giữ, cũng cần phải giải mã theo cấu trúc này:

```java
// Trả về nội dung dưới dạng sao chép
public byte[] data() {
    dataItem.rLock();
    try {
        SubArray sa = dataItem.data();
        byte[] data = new byte[sa.end - sa.start - OF_DATA];
        System.arraycopy(sa.raw, sa.start + OF_DATA, data, 0, data.length);
        return data;
    } finally {
        dataItem.rUnLock();
    }
}
```

Ở đây, dữ liệu được trả về dưới dạng sao chép, nếu cần sửa đổi, cần thực thi phương thức `before()` trên `DataItem`, điều này được thể hiện trong việc thiết lập giá trị `XMAX`:

```java
public void setXmax(long xid) {
    dataItem.before();
    try {
        SubArray sa = dataItem.data();
        System.arraycopy(Parser.long2Byte(xid), 0, sa.raw, sa.start + OF_XMAX, 8);
    } finally {
        dataItem.after(xid);
    }
}
```

`before()` và `after()` đã được định nghĩa trong phần xử lý sửa đổi mục dữ liệu.

## Isolation Level

### Read Commited

Như đã đề cập ở trên, nếu phiên bản mới nhất của một bản ghi bị khóa, khi một giao dịch khác muốn sửa đổi hoặc đọc bản ghi này, MiniDB sẽ trả về dữ liệu của một phiên bản cũ hơn. Ở điều kiện này, có thể coi rằng phiên bản mới nhất bị khóa không thể nhìn thấy được đối với một giao dịch khác. Do đó, khái niệm về tính hiển thị của phiên bản đã được tạo ra.

Tính hiển thị của phiên bản liên quan đến mức độ cô lập của giao dịch. Mức độ cô lập giao dịch tối thiểu được hỗ trợ bởi MiniDB là Read Committed, có nghĩa là khi giao dịch đọc dữ liệu, chỉ có thể đọc dữ liệu được tạo ra bởi các giao dịch đã được gửi. Việc đảm bảo tính hiển thị tối thiểu này đã được giải thích trong bài trước (để ngăn chặn lăn ngược cấp độ và xung đột với ngữ cảnh commit).

MiniDB duy trì hai biến cho mỗi phiên bản, đó là XMIN và XMAX như đã đề cập trước đó:

- XMIN: Số ID giao dịch tạo ra phiên bản này
- XMAX: Số ID giao dịch xóa phiên bản này

XMIN nên được điền khi tạo phiên bản, trong khi XMAX được điền khi phiên bản bị xóa hoặc có phiên bản mới xuất hiện.

Biến XMAX, cũng giải thích tại sao lớp DM không cung cấp hoạt động xóa, khi muốn xóa một phiên bản, chỉ cần đặt giá trị XMAX của nó. Điều này làm cho phiên bản này trở thành không thể nhìn thấy đối với mọi giao dịch sau mỗi XMAX, tương đương với việc xóa.

Do đó, ở cấp độ Read Commited, logic tính hiển thị của phiên bản đối với giao dịch t là:

```
(XMIN == Ti and                             // Được tạo bởi Ti và
    XMAX == NULL                            // chưa bị xoá
)
or                                          // hoặc
(XMIN is commited and                       // Được tạo bởi một giao dịch đã commit và
    (XMAX == NULL or                        // Chưa bị xóa hoặc
    (XMAX != Ti and XMAX is not commited)   // Được xóa bởi một giao dịch chưa commit
))
```

Nếu điều kiện đúng, thì phiên bản là hiển thị cho Ti. Vì vậy, để lấy phiên bản phù hợp với Ti, chỉ cần bắt đầu từ phiên bản mới nhất và kiểm tra tính hiển thị một cách ngược lại, nếu đúng, có thể trả về trực tiếp.

Phương thức sau xác định xem một bản ghi có hiển thị cho giao dịch t không:

```java
private static boolean readCommitted(TransactionManager tm, Transaction t, Entry e) {
    long xid = t.xid;
    long xmin = e.getXmin();
    long xmax = e.getXmax();
    if(xmin == xid && xmax == 0) return true;

    if(tm.isCommitted(xmin)) {
        if(xmax == 0) return true;
        if(xmax != xid) {
            if(!tm.isCommitted(xmax)) {
                return true;
            }
        }
    }
    return false;
}
```

Ở đây, cấu trúc Transaction chỉ cung cấp một XID.

### Repeatable Read

Mọi người cũng đã hiểu được vấn đề gây ra bởi việc đọc không có khả năng lặp lại và đã học một số kiến thức về nó. Đó chính là đọc không lặp lại (non-repeatable read) và đọc "ma" (phantom read). Ở đây, chúng ta sẽ giải quyết vấn đề đọc không lặp lại.

Đọc lại sẽ gây ra việc một giao dịch đọc dữ liệu từ cùng một mục dữ liệu trong quá trình thực thi nhưng nhận được các kết quả khác nhau. Như kết quả dưới đây, giả sử giá trị ban đầu của X là 0:

```
T1 begin
R1(X) // T1 read 0
T2 begin
U2(X) // Change X to 1
T2 commit
R1(X) // T1 read 1
```

Có thể thấy rằng, T1 đọc X hai lần và nhận được kết quả khác nhau. Để tránh tình huống này, chúng ta cần giới thiệu một cấp độ cô lập nghiêm ngặt hơn, đó là "có thể lặp lại" (repeatable read).

Khi T1 đọc lần thứ hai, nó đọc giá trị đã được T2 gửi, gây ra vấn đề này. Do đó, chúng ta có thể quy định:

> Giao dịch chỉ có thể đọc các phiên bản dữ liệu đã được tạo ra bởi các giao dịch đã kết thúc vào thời điểm nó bắt đầu

Điều khoản này, được thêm vào, yêu cầu giao dịch phải bỏ qua:

1. Dữ liệu của các giao dịch bắt đầu sau giao dịch hiện tại.
2. Dữ liệu của các giao dịch vẫn còn hoạt động khi giao dịch hiện tại bắt đầu.

Đối với điều thứ nhất, chỉ cần so sánh ID giao dịch để xác định. Tuy nhiên, đối với điều thứ hai, chúng ta cần ghi nhớ tất cả các giao dịch đang hoạt động vào thời điểm giao dịch Ti bắt đầu. Nếu phiên bản ghi nhớ của một phiên bản nào đó, XMIN nằm trong SP(Ti), nó cũng không thể nhìn thấy Ti.

Do đó, logic đánh giá tính hiển thị của "có thể lặp lại" như sau:

```
(XMIN == Ti and                 // Được tạo bởi Ti và
 (XMAX == NULL or               // Chưa bị xóa
))
or                              // Hoặc
(XMIN is commited and           // Được tạo bởi một giao dịch đã commit và
 XMIN < XID and                 // Giao dịch này nhỏ hơn Ti và
 XMIN is not in SP(Ti) and      // Giao dịch này đã commit trước Ti và
 (XMAX == NULL or               // Chưa bị xóa hoặc
  (XMAX != Ti and               // Được xóa bởi giao dịch khác nhưng
   (XMAX is not commited or     // Giao dịch này chưa được commit hoặc
XMAX > Ti or                    // Giao dịch này bắt đầu sau Ti hoặc
XMAX is in SP(Ti)               // Giao dịch này đã bắt đầu trước Ti
))))
```

Do đó, cần cung cấp một cấu trúc để trừu tượng hóa một giao dịch, để lưu trữ dữ liệu snapshot:

```java
public class Transaction {
    public long xid;
    public int level;
    public Map<Long, Boolean> snapshot;
    public Exception err;
    public boolean autoAborted;

    public static Transaction newTransaction(long xid, int level, Map<Long, Transaction> active) {
        Transaction t = new Transaction();
        t.xid = xid;
        t.level = level;
        if(level != 0) {
            t.snapshot = new HashMap<>();
            for(Long x : active.keySet()) {
                t.snapshot.put(x, true);
            }
        }
        return t;
    }

    public boolean isInSnapshot(long xid) {
        if(xid == TransactionManagerImpl.SUPER_XID) {
            return false;
        }
        return snapshot.containsKey(xid);
    }
}
```

Trong hàm tạo, active lưu trữ tất cả các giao dịch đang hoạt động hiện tại. Do đó, dưới cấp độ "có thể lặp lại", quyết định xem một phiên bản có hiển thị cho một giao dịch không như sau:

```java
private static boolean repeatableRead(TransactionManager tm, Transaction t, Entry e) {
    long xid = t.xid;
    long xmin = e.getXmin();
    long xmax = e.getXmax();
    if(xmin == xid && xmax == 0) return true;

    if(tm.isCommitted(xmin) && xmin < xid && !t.isInSnapshot(xmin)) {
        if(xmax == 0) return true;
        if(xmax != xid) {
            if(!tm.isCommitted(xmax) && xmax > xid && t.isInSnapshot(xmax)) {
                return true;
            }
        }
    }
    return false;
}
```
