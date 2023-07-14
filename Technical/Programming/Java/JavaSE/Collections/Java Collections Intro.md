---
title: Java Container Intro
tags: [java, javase, collection]
categories: [java, javase]
date created: 2023-07-14
date modified: 2023-07-14
---

# Giới thiệu về Collections trong Java

## Giới thiệu về Collections

### Array và Collection

Trong Java, các bộ chứa phổ biến để lưu trữ dữ liệu là array và collection. Hai loại này có các khác biệt sau:

- Kích thước lưu trữ có cố định hay không
	- Array có kích thước cố định.
	- Collection có kích thước có thể thay đổi.
- Kiểu dữ liệu
	- Array có thể lưu trữ kiểu dữ liệu cơ bản và kiểu dữ liệu tham chiếu;
	- Collection chỉ có thể lưu trữ kiểu dữ liệu tham chiếu, các biến kiểu dữ liệu cơ bản phải được chuyển đổi thành các lớp bao đóng để đặt trong collection.

> 💡 Nếu bạn không hiểu các khái niệm như kiểu dữ liệu cơ bản, kiểu dữ liệu tham chiếu, lớp bao, bạn có thể tham khảo: [Java Basic Data Type](/Technical/Programming/Java/JavaSE/Basic/Java-Basic-Data-Type)

### Collections Framework

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230714202852.png)

Collections Framework trong Java chủ yếu được chia thành hai loại: `Collection` và `Map`. Trong đó, `Collection` được chia thành `List`, `Set` và `Queue`.

- `Collection` - Một chuỗi các phần tử độc lập, các phần tử này tuân theo một hoặc nhiều quy tắc.
    - `List` - Phải lưu trữ các phần tử theo thứ tự chèn.
    - `Set` - Không thể có các phần tử trùng lặp.
    - `Queue` - Xác định thứ tự các đối tượng được tạo ra (thường giống với thứ tự chèn chúng).
- `Map` - Một tập hợp các cặp "khóa-giá trị", cho phép bạn sử dụng khóa để tìm giá trị.

## Cơ chế cơ bản của Collection

> Các collection trong Java có một số điểm chung, chúng hoặc toàn bộ hoặc một phần dựa trên các kỹ thuật sau. Vì vậy, việc học các điểm kỹ thuật sau đây rất hữu ích để hiểu các đặc điểm và nguyên lý của collection Java.

### Generics (Kiểu tham số hoá)

Java 1.5 đã giới thiệu kỹ thuật Generics.

Java **collection sử dụng kỹ thuật Generics để đảm bảo tính an toàn của kiểu dữ liệu**. Điều gì là tính an toàn của kiểu dữ liệu?

Ví dụ: Nếu có một collection `List<Object>`, **trình biên dịch Java không kiểm tra tính an toàn của kiểu dữ liệu gốc trong quá trình biên dịch**, nhưng nó sẽ kiểm tra kiểu dữ liệu tham số. Bằng cách sử dụng Object làm kiểu, bạn có thể cho biết trình biên dịch rằng phương thức này có thể chấp nhận bất kỳ kiểu đối tượng nào, chẳng hạn như String hoặc Integer.

```java
List<Object> list = new ArrayList<Object>();
list.add("123");
list.add(123);
```

Nếu không có kỹ thuật Generics, như trong đoạn mã ví dụ trên, collection có thể lưu trữ bất kỳ kiểu dữ liệu nào, điều này là rất nguy hiểm.

```
List<String> list = new ArrayList<String>();
list.add("123");
list.add(123);
```

> 💡 Để hiểu sâu hơn về cách sử dụng và nguyên lý của kỹ thuật Generics trong Java, bạn có thể tham khảo: [Java Generics In Depth](/Technical/Programming/Java/JavaSE/Basic/Java-Generics-In-Depth)

### Iterable và Iterator

> Iterable và Iterator nhằm mục đích duyệt qua các phần tử trong collection.

Giao diện `Iterator` được định nghĩa như sau:

```java
public interface Iterator<E> {

    boolean hasNext();

    E next();

    default void remove() {
        throw new UnsupportedOperationException("remove");
    }

    default void forEachRemaining(Consumer<? super E> action) {
        Objects.requireNonNull(action);
        while (hasNext())
            action.accept(next());
    }
}
```

Giao diện `Iterable` được định nghĩa như sau:

```java
public interface Iterable<T> {

    Iterator<T> iterator();

    default void forEach(Consumer<? super T> action) {
        Objects.requireNonNull(action);
        for (T t : this) {
            action.accept(t);
        }
    }

    default Spliterator<T> spliterator() {
        return Spliterators.spliteratorUnknownSize(iterator(), 0);
    }
}
```

Giao diện `Collection` mở rộng giao diện `Iterable`.

Duyệt qua các phần tử có thể được hiểu đơn giản là duyệt qua tất cả các đối tượng trong các collection khác nhau. Nó là một mẫu thiết kế cổ điển - Iterator Pattern.

**Iterator Pattern** - **Cung cấp một cách để truy cập tuần tự các phần tử của một đối tượng tập hợp mà không cần tiết lộ cấu trúc nội bộ của nó**.

![](https://raw.githubusercontent.com/dunwu/images/dev/cs/java/oop/design-patterns/iterator-pattern.png)

Ví dụ: Duyệt qua các phần tử bằng Iterator

```java
public class IteratorDemo {

    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(2);
        list.add(3);
        Iterator it = list.iterator();
        while (it.hasNext()) {
            System.out.println(it.next());
        }
    }

}
```

### Comparable và Comparator

`Comparable` là giao diện sắp xếp. Nếu một lớp triển khai giao diện `Comparable`, điều đó có nghĩa là các phiên bản của lớp đó có thể được so sánh và hỗ trợ sắp xếp. Các đối tượng trong một mảng hoặc danh sách có thể được sắp xếp tự động bằng cách sử dụng `Collections.sort` hoặc `Arrays.sort`.

Giao diện `Comparable` được định nghĩa như sau:

```java
public interface Comparable<T> {
    public int compareTo(T o);
}
```

`Comparator` là giao diện so sánh, nếu chúng ta muốn kiểm soát thứ tự của một lớp nhưng lớp đó không hỗ trợ sắp xếp (nghĩa là không triển khai giao diện `Comparable`), chúng ta có thể tạo ra một "bộ so sánh của lớp đó" để sắp xếp. Bộ so sánh này chỉ cần triển khai giao diện `Comparator`. Điều này có nghĩa là chúng ta có thể sắp xếp một lớp bằng cách triển khai `Comparator`.

Giao diện `Comparator` được định nghĩa như sau:

```java
@FunctionalInterface
public interface Comparator<T> {

    int compare(T o1, T o2);

    boolean equals(Object obj);

    // reversed method is omitted

    // thenComparingXXX methods are omitted

    // static methods are omitted
}
```

Trong các collection Java, một số collection có thể được sắp xếp có thể định nghĩa quy tắc sắp xếp cho các phần tử bên trong bằng cách truyền vào `Comparator`.

### Cloneable

Một lớp Java phải triển khai giao diện `Cloneable` để có thể triển khai chức năng sao chép (`clone`). Nếu không, khi gọi `clone()`, nó sẽ ném ra ngoại lệ `CloneNotSupportedException`.

Tất cả các lớp Java mặc định đều kế thừa lớp `java.lang.Object`, trong lớp `java.lang.Object` có một phương thức `clone()`, phương thức này sẽ trả về một bản sao của đối tượng `Object`. Phương thức `clone()` trong lớp `Object` chỉ được sử dụng để sao chép nông (chỉ sao chép các thuộc tính thành viên cơ bản, chỉ trả về một tham chiếu đến địa chỉ đó).

Nếu một lớp Java cần sao chép sâu, nó phải ghi đè phương thức `clone()`.

### fail-fast

#### Điểm chính của fail-fast

Các collection Java (như ArrayList, HashMap, TreeSet, v.v.) thường đề cập đến mô tả tương tự như sau trong javadoc:

> Lưu ý, hành vi nhanh chóng thất bại của trình lặp không thể được đảm bảo, vì trong nhiều trường hợp, không thể đảm bảo rằng các sửa đổi không đồng bộ xảy ra. Trình lặp nhanh chóng thất bại sẽ cố gắng ném `ConcurrentModificationException`. Do đó, viết một chương trình phụ thuộc vào ngoại lệ này để đảm bảo tính chính xác của trình lặp nhanh chóng thất bại là một cách tiếp cận sai: hành vi nhanh chóng thất bại của trình lặp nên chỉ được sử dụng để phát hiện lỗi.

Vậy, chúng ta không thể không hỏi, fail-fast là gì, tại sao lại có cơ chế fail-fast?

**fail-fast là một cơ chế kiểm tra lỗi của collection Java**. Khi nhiều luồng thực hiện các thay đổi cấu trúc trên collection, cơ chế fail-fast có thể được kích hoạt. Hãy nhớ rằng có thể kích hoạt cơ chế fail-fast, không phải lúc nào cũng nhưng có thể.

Ví dụ: Giả sử có hai luồng (luồng 1, luồng 2), luồng 1 đang duyệt qua các phần tử trong collection A bằng cách sử dụng `Iterator`, tại một thời điểm nào đó, luồng 2 thay đổi cấu trúc của collection A (thay đổi cấu trúc, không phải chỉ đơn giản là thay đổi nội dung của các phần tử trong collection), lúc này chương trình sẽ ném ra ngoại lệ `ConcurrentModificationException`, từ đó tạo ra cơ chế fail-fast.

**Các thay đổi số lượng phần tử trong collection (thêm, xóa phần tử) trong quá trình lặp có thể gây ra fail-fast**.

Ví dụ: Ví dụ về fail-fast

```java
public class FailFastDemo {

    private static int MAX = 100;

    private static List<Integer> list = new ArrayList<>();

    public static void main(String[] args) {
        for (int i = 0; i < MAX; i++) {
            list.add(i);
        }
        new Thread(new MyThreadA()).start();
        new Thread(new MyThreadB()).start();
    }

    /** Duyệt qua tất cả các phần tử trong collection */
    static class MyThreadA implements Runnable {

        @Override
        public void run() {
            Iterator<Integer> iterator = list.iterator();
            while (iterator.hasNext()) {
                int i = iterator.next();
                System.out.println("MyThreadA truy cập phần tử: " + i);
                try {
                    TimeUnit.MILLISECONDS.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }

    }

    /** Duyệt qua và xóa tất cả các số chẵn trong một phạm vi nhất định */
    static class MyThreadB implements Runnable {

        @Override
        public void run() {
            int i = 0;
            while (i < MAX) {
                if (i % 2 == 0) {
                    System.out.println("MyThreadB xóa phần tử " + i);
                    list.remove(i);
                }
                i++;
            }
        }

    }

}
```

Khi thực thi, ngoại lệ `java.util.ConcurrentModificationException` sẽ được ném ra.

#### Giải quyết fail-fast

Có hai cách giải quyết fail-fast:

- Đặt từ khóa `synchronized` hoặc sử dụng các collection `Collections.synchronizedXXX` trong tất cả các vị trí liên quan đến thay đổi số lượng phần tử trong quá trình lặp. Tuy nhiên, không khuyến nghị làm như vậy vì việc thêm/xóa có thể gây chặn lặp lại và ảnh hưởng đến hiệu suất.
- Sử dụng các collection đồng thời như `CopyOnWriterArrayList`.

## Collection và đồng bộ hóa luồng

Để sử dụng collection một cách an toàn trong môi trường đa luồng, Java cung cấp các collection đồng bộ hóa và collection đồng thời.

> Chi tiết về collection đồng bộ hóa và collection đồng thời xin xem: [Java Concurrent Collections]()
