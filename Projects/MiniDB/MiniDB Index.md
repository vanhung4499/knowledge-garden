---
title: MiniDB Index
tags:
  - project
  - minidb
categories: 
date created: 2024-04-20
date modified: 2024-04-20
---

# Index Manager

## Lời nói đầu

IM, Trình quản lý chỉ mục, cung cấp cho MiniDB một chỉ mục được nhóm dựa trên cây B+. Hiện tại MiniDB chỉ hỗ trợ tìm kiếm dữ liệu dựa trên chỉ mục và chưa hỗ trợ quét toàn bộ bảng.

Như bạn có thể thấy trong sơ đồ phụ thuộc, IM trực tiếp dựa trên DM chứ không dựa trên VM. Dữ liệu được lập chỉ mục được chèn trực tiếp vào tệp cơ sở dữ liệu mà không cần phiên bản.

Phần này sẽ không đi sâu vào chi tiết về thuật toán cây B+ mà sẽ mô tả cách triển khai chi tiết hơn.

## Cây nhị phân chỉ mục

Cây nhị phân được hình thành từ các nút, mỗi nút được lưu trữ trong một mục dữ liệu. Cấu trúc như sau:

```
[LeafFlag][KeyNumber][SiblingUid]
[Son0][Key0][Son1][Key1]...[SonN][KeyN]
```

Trong số đó, LeafFlag đánh dấu xem nút có phải là nút lá hay không; KeyNumber là số khóa trong nút; SiblingUid là UID của nút anh chị em của nó được lưu trữ trong DM. Tiếp theo là nút con (SonN) và KeyN xen kẽ. KeyN cuối cùng luôn là MAX_VALUE để thuận tiện cho việc tìm kiếm.  

Lớp Node giữ một tham chiếu đến cấu trúc cây B+ của nó, tham chiếu DataItem và tham chiếu SubArray, để dễ dàng sửa đổi và giải phóng dữ liệu một cách nhanh chóng.

```java
public class Node {
    BPlusTree tree;
    DataItem dataItem;
    SubArray raw;
    long uid;
    ...
}
```

Vì vậy, dữ liệu của một nút gốc có thể được viết như sau:

```java
static byte[] newRootRaw(long left, long right, long key)  {
    SubArray raw = new SubArray(new byte[NODE_SIZE], 0, NODE_SIZE);
    setRawIsLeaf(raw, false);
    setRawNoKeys(raw, 2);
    setRawSibling(raw, 0);
    setRawKthSon(raw, left, 0);
    setRawKthKey(raw, key, 0);
    setRawKthSon(raw, right, 1);
    setRawKthKey(raw, Long.MAX_VALUE, 1);
    return raw.raw;
}
```

Hai nút con ban đầu của nút gốc là trái và phải và giá trị khóa ban đầu là khóa.

Tương tự, tạo dữ liệu nút gốc trống:

```java
static byte[] newNilRootRaw()  {
    SubArray raw = new SubArray(new byte[NODE_SIZE], 0, NODE_SIZE);
    setRawIsLeaf(raw, true);
    setRawNoKeys(raw, 0);
    setRawSibling(raw, 0);
    return raw.raw;
}
```

Lớp Node có hai phương thức được sử dụng để hỗ trợ cây B+ trong các hoạt động chèn và tìm kiếm, đó là phương thức searchNext và phương thức leafSearchRange.

```java
public SearchNextRes searchNext(long key) {
    dataItem.rLock();
    try {
        SearchNextRes res = new SearchNextRes();
        int noKeys = getRawNoKeys(raw);
        for(int i = 0; i < noKeys; i ++) {
            long ik = getRawKthKey(raw, i);
            if(key < ik) {
                res.uid = getRawKthSon(raw, i);
                res.siblingUid = 0;
                return res;
            }
        }
        res.uid = 0;
        res.siblingUid = getRawSibling(raw);
        return res;
    } finally {
        dataItem.rUnLock();
    }
}
```

Phương thức leafSearchRange thực hiện tìm kiếm phạm vi trên nút hiện tại và phạm vi là [leftKey, rightKey]. Ở đây, người ta đồng ý rằng nếu rightKey lớn hơn hoặc bằng khóa lớn nhất của nút thì UID của nút anh chị em sẽ cũng được trả về cùng lúc để tạo điều kiện thuận lợi cho việc tìm kiếm nút tiếp theo.

```java
public LeafSearchRangeRes leafSearchRange(long leftKey, long rightKey) {
    dataItem.rLock();
    try {
        int noKeys = getRawNoKeys(raw);
        int kth = 0;
        while(kth < noKeys) {
            long ik = getRawKthKey(raw, kth);
            if(ik >= leftKey) {
                break;
            }
            kth ++;
        }
        List<Long> uids = new ArrayList<>();
        while(kth < noKeys) {
            long ik = getRawKthKey(raw, kth);
            if(ik <= rightKey) {
                uids.add(getRawKthSon(raw, kth));
                kth ++;
            } else {
                break;
            }
        }
        long siblingUid = 0;
        if(kth == noKeys) {
            siblingUid = getRawSibling(raw);
        }
        LeafSearchRangeRes res = new LeafSearchRangeRes();
        res.uids = uids;
        res.siblingUid = siblingUid;
        return res;
    } finally {
        dataItem.rUnLock();
    }
}
```

Vì cây B+ sẽ được điều chỉnh linh hoạt khi chèn và xóa, nên nút gốc không phải là nút cố định, do đó bootDataItem được đặt và UID của nút gốc được lưu trữ trong DataItem. Có thể lưu ý rằng khi IM vận hành DM thì các giao dịch được sử dụng là `SUPER_XID`.

```java
public class BPlusTree {
    DataItem bootDataItem;

    private long rootUid() {
        bootLock.lock();
        try {
            SubArray sa = bootDataItem.data();
            return Parser.parseLong(Arrays.copyOfRange(sa.raw, sa.start, sa.start+8));
        } finally {
            bootLock.unlock();
        }
    }

    private void updateRootUid(long left, long right, long rightKey) throws Exception {
        bootLock.lock();
        try {
            byte[] rootRaw = Node.newRootRaw(left, right, rightKey);
            long newRootUid = dm.insert(TransactionManagerImpl.SUPER_XID, rootRaw);
            bootDataItem.before();
            SubArray diRaw = bootDataItem.data();
            System.arraycopy(Parser.long2Byte(newRootUid), 0, diRaw.raw, diRaw.start, 8);
            bootDataItem.after(TransactionManagerImpl.SUPER_XID);
        } finally {
            bootLock.unlock();
        }
    }
}
```

IM chủ yếu cung cấp hai khả năng cho module lớp trên: chèn chỉ mục và tìm kiếm nút. Thuật toán và cách triển khai chèn nút vào cây B+ và tìm kiếm nút sẽ không được mô tả lại.  

Ở đây có thể có câu hỏi về việc tại sao IM không cung cấp khả năng xóa chỉ mục. Khi module phía trên xóa Entry thông qua VM, thao tác thực tế là đặt XMAX của nó. Nếu bạn không xóa chỉ mục tương ứng, khi bạn cố gắng đọc lại Entry sau, bạn có thể tìm thấy nó thông qua chỉ mục. Tuy nhiên, do XMAX được đặt nên không thể tìm thấy phiên bản phù hợp và trả về lỗi không tìm thấy nội dung.

### Các lỗi có thể xảy ra và cách phục hồi

Trong quá trình vận hành cây B+, có thể xảy ra hai lỗi, đó là lỗi nút bên trong và lỗi mối quan hệ giữa các nút.

MiniDB gặp sự cố khi xảy ra lỗi nút nội bộ, tức là khi Ti đang thực hiện các thay đổi đối với dữ liệu của nút. Vì IM dựa vào DM nên Ti sẽ bị thu hồi (hoàn tác) sau khi cơ sở dữ liệu được khởi động lại và tác động của lỗi lên nút sẽ bị loại bỏ.

Nếu xảy ra lỗi giữa các nút, thì đó phải là tình huống sau: thao tác chèn trên nút u tạo ra một nút mới v. Tại thời điểm này, anh chị em (u)=v, nhưng v không được chèn vào nút cha.

```
[parent]
    
    v
   [u] -> [v]
```

Trạng thái chính xác phải như sau:

```
[ parent ]
       
 v      v
[u] -> [v]
```

Tại thời điểm này, nếu bạn muốn chèn hoặc tìm kiếm nút, nếu thất bại, nó sẽ tiếp tục lặp lại các nút anh chị em của nó và cuối cùng có thể tìm thấy nút v. Nhược điểm duy nhất là v không thể được tìm thấy trực tiếp thông qua nút cha và v chỉ có thể được lấy gián tiếp thông qua u.