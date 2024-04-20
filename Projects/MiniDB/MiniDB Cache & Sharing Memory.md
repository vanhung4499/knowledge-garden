---
title: MiniDB Cache & Sharing Memory
tags:
  - minidb
  - project
categories: 
date created: 2024-04-19
date modified: 2024-04-19
---

# Reference counting cache framework and shared memory array

## Lời nói đầu

Từ chương này, chúng ta bắt đầu thảo luận về module thấp nhất trong MiniDB: Trình quản lý dữ liệu (Data Manager):

> DM trực tiếp quản lý các tệp cơ sở dữ liệu và tệp nhật ký. Trách nhiệm chính của DM là:  
	1. Quản lý các tệp DB trong phân trang và lưu trữ chúng.  
	2. Quản lý các tệp nhật ký để đảm bảo khôi phục dựa trên nhật ký khi xảy ra lỗi.  
	3. Các tệp DB trừu tượng được các module lớp trên sử dụng làm DataItems và cung cấp bộ đệm.

Các chức năng của DM thực sự có thể được tóm tắt thành hai điểm: một lớp trừu tượng giữa module phía trên và hệ thống tệp, lớp này trực tiếp đọc và ghi các tệp từ dưới lên và cung cấp khả năng đóng gói dữ liệu lên trên. Lớp còn lại là chức năng ghi nhật ký.

Có thể lưu ý rằng dù tăng hay giảm, DM đều cung cấp chức năng lưu vào bộ nhớ đệm và sử dụng các thao tác bộ nhớ để đảm bảo hiệu năng.

## Khung bộ đệm đếm tham chiếu

### WHY NOT LRU?

Do quản lý trang và quản lý chỉ mục dữ liệu đều liên quan đến bộ nhớ cache, ở đây ta thiết kế một khung bộ nhớ cache tổng quát hơn.

Khi đến đây, dường như các bạn đã bắt đầu tự hỏi, tại sao sử dụng chiến lược đếm tham chiếu, mà không sử dụng chiến lược LRU "rất tiên tiến"?

Trong thiết kế giao diện của bộ nhớ cache, nếu sử dụng bộ nhớ cache LRU, thì chỉ cần thiết kế một giao diện `get(key)` là đủ, việc giải phóng bộ nhớ cache có thể tự động diễn ra khi bộ nhớ cache đã đầy. Hãy tưởng tượng một tình huống như sau: Tại một thời điểm nào đó, bộ nhớ cache đã đầy, và bộ nhớ cache loại bỏ một tài nguyên. Lúc này, một module ở tầng trên muốn ép buộc đẩy một tài nguyên nào đó trở lại nguồn dữ liệu, và tài nguyên này chính là tài nguyên vừa bị loại bỏ khỏi bộ nhớ cache. Lúc này, module ở tầng trên sẽ phát hiện rằng dữ liệu này đã biến mất khỏi bộ nhớ cache, và module này sẽ rơi vào tình trạng khó xử: liệu có cần thực hiện thao tác truy xuất nguồn dữ liệu không?

Tất nhiên, chúng ta có thể ghi lại thời gian sửa đổi cuối cùng của tài nguyên và để bộ nhớ đệm ghi lại thời điểm tài nguyên bị trục xuất. Nhưng……

Vấn đề cơ bản là trong chiến lược LRU, việc loại bỏ tài nguyên là không thể kiểm soát, và các module ở tầng trên không thể biết được. Trong khi đó, chiến lược đếm tham chiếu lại giải quyết được vấn đề này. Chỉ khi các module ở tầng trên tự giải phóng tham chiếu, và bộ nhớ cache đảm bảo không có module nào đang sử dụng tài nguyên đó nữa, thì tài nguyên mới bị loại bỏ.

### Triển khai

Để triển khai điều này, bạn sẽ cần triển khai lớp `AbstractCache<T>`, một lớp trừu tượng có hai phương thức trừu tượng, mà các lớp triển khai sẽ phải triển khai:

```java
/**
 * Lấy dữ liệu khi không có trong bộ nhớ cache
 */
protected abstract T getForCache(long key) throws Exception;

/**
 * Ghi dữ liệu trở lại khi bị loại bỏ khỏi cache
 */
protected abstract void releaseForCache(T obj);

```

Đối với việc đếm tham chiếu, ngoài chức năng cache thông thường, bạn cũng cần duy trì một bộ đếm riêng. Ngoài ra, để xử lý các tình huống đa luồng, bạn cũng cần ghi lại những tài nguyên nào đang được lấy từ nguồn dữ liệu (việc lấy tài nguyên từ nguồn dữ liệu là một thao tác tương đối tốn thời gian). Vì vậy, bạn sẽ cần ba map như sau:

```java
Map<Long, Integer> referenceCountMap; // Lưu trữ số lượng tham chiếu đến từng tài nguyên
Map<Long, T> cacheMap; // Bộ nhớ cache lưu trữ các tài nguyên
Map<Long, Boolean> loadingMap; // Ghi lại trạng thái lấy dữ liệu từ nguồn dữ liệu cho từng tài nguyên
```

Do đó, khi sử dụng phương thức `get()`, trước hết, chúng ta vào một vòng lặp vô hạn để liên tục thử lấy tài nguyên từ bộ nhớ cache. Đầu tiên, chúng ta cần kiểm tra liệu có luồng nào khác đang cố gắng lấy tài nguyên này từ nguồn dữ liệu không. Nếu có, chúng ta sẽ chờ một lúc rồi quay lại kiểm tra sau.

```java
while(true) {
    lock.lock();
    if(getting.containsKey(key)) {
        // Tài nguyên mà chúng ta yêu cầu đang được luồng khác lấy từ nguồn dữ liệu
        lock.unlock();
        try {
            Thread.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
            continue;
        }
        continue;
    }
    ...
}

```

Tất nhiên, nếu tài nguyên đã có trong bộ nhớ cache, chúng ta có thể lấy và trả về ngay lập tức. Đừng quên tăng số tham chiếu đến tài nguyên lên 1. Nếu bộ nhớ cache chưa đầy, chúng ta sẽ đăng ký luồng hiện tại đang cố gắng lấy tài nguyên từ nguồn dữ liệu.

```java
while(true) {
    if(cache.containsKey(key)) {
        // Tài nguyên có sẵn trong bộ nhớ cache, trả về ngay
        T obj = cache.get(key);
        references.put(key, references.get(key) + 1);
        lock.unlock();
        return obj;
    }

    // Thử lấy tài nguyên này
    if(maxResource > 0 && count == maxResource) {
        lock.unlock();
        throw Error.CacheFullException;
    }
    count ++;
    getting.put(key, true);
    lock.unlock();
    break;
}

```

Lấy tài nguyên từ nguồn dữ liệu là một quá trình đơn giản, chỉ cần gọi phương thức trừu tượng đó và nhớ loại bỏ khóa từ getting khi lấy xong.

```java
T obj = null;
try {
    obj = getForCache(key);
} catch(Exception e) {
    lock.lock();
    count --;
    getting.remove(key);
    lock.unlock();
    throw e;
}

lock.lock();
getting.remove(key);
cache.put(key, obj);
references.put(key, 1);
lock.unlock();
```

Giải phóng một tài nguyên từ bộ nhớ cache đơn giản hơn nhiều, chỉ cần giảm 1 từ references. Nếu đã giảm xuống 0, chúng ta có thể truy xuất lại nguồn và xóa tất cả cấu trúc liên quan trong cache:

```java
/**
 * Giải phóng một tài nguyên cache một cách ép buộc
 */
protected void release(long key) {
    lock.lock();
    try {
        int ref = references.get(key) - 1;
        if(ref == 0) {
            T obj = cache.get(key);
            releaseForCache(obj);
            references.remove(key);
            cache.remove(key);
            count --;
        } else {
            references.put(key, ref);
        }
    } finally {
        lock.unlock();
    }
}
```

Cache cũng nên có chức năng đóng an toàn. Khi đóng, tất cả các tài nguyên trong cache sẽ được trả về nguồn một cách ép buộc.

```java
lock.lock();
try {
    Set<Long> keys = cache.keySet();
    for (long key : keys) {
        release(key);
        references.remove(key);
        cache.remove(key);
    }
} finally {
    lock.unlock();
}
```

Như vậy, một framework cache đơn giản đã được triển khai. Các cache khác chỉ cần kế thừa lớp này và triển khai hai phương thức trừu tượng đó là đủ.

### Mảng bộ nhớ dùng chung

Ở đây tôi phải đề cập đến một khía cạnh rất nhức nhối của Java.

Trong Java, một mảng được coi là một đối tượng và nó cũng được lưu trữ dưới dạng một đối tượng trong bộ nhớ. Trong các ngôn ngữ như C, C++ và Go, mảng được triển khai bằng cách sử dụng con trỏ. Bởi vậy mới có câu:

> Only Java has real arrays

Nhưng đây dường như không phải là tin tốt cho dự án. Ví dụ: trong golang, bạn có thể thực thi câu lệnh sau:

```go
var array1 [10]int64
array2 := array1[5:]
```

Trong trường hợp này, `array2` và phần từ thứ năm đến cuối cùng của `array1` chia sẻ cùng một phần của bộ nhớ, ngay cả khi độ dài của hai mảng này khác nhau.

Trong Java, điều này không thể thực hiện được (Ôi, ngôn ngữ lập trình cao cấp là gì nhỉ~). Trong Java, khi bạn thực hiện các hoạt động tương tự như subArray, chỉ có một bản sao cơ bản được thực hiện ở cấp độ dưới, không thể chia sẻ cùng một vùng nhớ.

Vì vậy, tôi đã viết một lớp `SubArray` để (một cách mờ nhạt) xác định phạm vi sử dụng của mảng này:

```java
public class SubArray {
    public byte[] raw;
    public int start;
    public int end;

    public SubArray(byte[] raw, int start, int end) {
        this.raw = raw;
        this.start = start;
        this.end = end;
    }
}

```

Nói thật, đây là một giải pháp khá bất ổn, nhưng tạm thời chỉ có cách này thôi.
