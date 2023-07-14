---
title: Java Collection Set
tags: [java, javase, collection]
categories: [java, javase]
date created: 2023-07-14
date modified: 2023-07-15
---

# Java Collection - Set

## Giới thiệu về Set

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230715000722.png)

Các thành viên trong dòng họ Set:

- `Set` kế thừa giao diện `Collection`. Trên thực tế, `Set` chỉ là `Collection` với một số hành vi khác nhau: tập hợp Set không cho phép các phần tử trùng lặp.
- `SortedSet` kế thừa giao diện `Set`. Nội dung của `SortedSet` được sắp xếp theo thứ tự duy nhất, sắp xếp bằng cách sử dụng trình so sánh (Comparator).
- `NavigableSet` kế thừa giao diện `SortedSet`. Nó cung cấp các phương thức tìm kiếm phong phú như "lấy phần tử lớn hơn / bằng một giá trị", "lấy phần tử nhỏ hơn / bằng một giá trị", v.v.
- `AbstractSet` là một lớp trừu tượng, nó kế thừa từ `AbstractCollection`. `AbstractCollection` triển khai hầu hết các phương thức của Set, cung cấp tiện ích cho các lớp thực hiện Set.
- `HashSet` phụ thuộc vào `HashMap`, thực tế nó được triển khai bằng cách sử dụng `HashMap`. Các phần tử trong `HashSet` là không có thứ tự và phân tán.
- `TreeSet` phụ thuộc vào `TreeMap`, thực tế nó được triển khai bằng cách sử dụng `TreeMap`. Các phần tử trong `TreeSet` được sắp xếp và được sắp xếp theo thứ tự tự nhiên hoặc theo trình so sánh do người dùng chỉ định.
- `LinkedHashSet` là một Set được sắp xếp theo thứ tự chèn.
- `EnumSet` chỉ chứa các phần tử của kiểu Enum.

### Giao diện Set

`Set` kế thừa giao diện `Collection`. Trên thực tế, `Set` chỉ là `Collection`, hai giao diện này cung cấp các phương thức hoàn toàn giống nhau.

Định nghĩa giao diện `Set` như sau:

```java
public interface Set<E> extends Collection<E> {}
```

### Giao diện SortedSet

Kế thừa giao diện `Set`. Nội dung của `SortedSet` được sắp xếp theo thứ tự duy nhất, sắp xếp bằng cách sử dụng trình so sánh (Comparator).

Định nghĩa giao diện `SortedSet` như sau:

```java
public interface SortedSet<E> extends Set<E> {}
```

Giao diện `SortedSet` mở rộng các phương thức mới:

- `comparator` - Trả về trình so sánh (Comparator)
- `subSet` - Trả về tập con trong khoảng chỉ định
- `headSet` - Trả về tập con nhỏ hơn phần tử chỉ định
- `tailSet` - Trả về tập con lớn hơn phần tử chỉ định
- `first` - Trả về phần tử đầu tiên
- `last` - Trả về phần tử cuối cùng
- spliterator

### Giao diện NavigableSet

Kế thừa giao diện `SortedSet`. Nó cung cấp các phương thức tìm kiếm phong phú.

Định nghĩa giao diện `NavigableSet` như sau:

```java
public interface NavigableSet<E> extends SortedSet<E> {}
```

Giao diện `NavigableSet` mở rộng các phương thức mới:

- `lower` - Trả về phần tử gần nhất nhỏ hơn giá trị chỉ định
- `higher` - Trả về phần tử gần nhất lớn hơn giá trị chỉ định
- `floor` - Trả về phần tử gần nhất nhỏ hơn hoặc bằng giá trị chỉ định
- `ceiling` - Trả về phần tử gần nhất lớn hơn hoặc bằng giá trị chỉ định
- `pollFirst` - Lấy và xóa phần tử đầu tiên (nhỏ nhất)
- `pollLast` - Lấy và xóa phần tử cuối cùng (lớn nhất)
- `descendingSet` - Trả về tập hợp được sắp xếp theo thứ tự ngược lại
- `descendingIterator` - Trả về trình lặp tập hợp được sắp xếp theo thứ tự ngược lại
- `subSet` - Trả về tập con trong khoảng chỉ định
- `headSet` - Trả về tập con nhỏ hơn phần tử chỉ định
- `tailSet` - Trả về tập con lớn hơn phần tử chỉ định

### Lớp AbstractSet

Lớp `AbstractSet` cung cấp cài đặt cốt lõi cho giao diện `Set`, giúp giảm thiểu công việc cần thiết để triển khai các lớp thực thể của `Set`.

Định nghĩa lớp `AbstractSet` như sau:

```java
public abstract class AbstractSet<E> extends AbstractCollection<E> implements Set<E> {}
```

Thực tế, hầu hết các cài đặt chính đã được thực hiện trong `AbstractCollection`.

## Lớp HashSet

Lớp `HashSet` phụ thuộc vào `HashMap`, thực tế nó được triển khai bằng cách sử dụng `HashMap`. Các phần tử trong `HashSet` không có thứ tự và phân tán.

Định nghĩa lớp `HashSet` như sau:

```java
public class HashSet<E>
    extends AbstractSet<E>
    implements Set<E>, Cloneable, java.io.Serializable {}
```

### Điểm chính của HashSet

- `HashSet` triển khai các phương thức cốt lõi của `Set` thông qua việc kế thừa từ `AbstractSet`.
- `HashSet` triển khai `Cloneable`, vì vậy hỗ trợ việc sao chép.
- `HashSet` triển khai `Serializable`, vì vậy hỗ trợ việc tuần tự hóa.
- Các phần tử trong `HashSet` không có thứ tự.
- `HashSet` cho phép phần tử null.
- `HashSet` không an toàn đối với luồng.

### Nguyên lý của HashSet

**`HashSet` được triển khai dựa trên `HashMap`.**

```java
// Lõi của HashSet, triển khai các phương thức của HashSet thông qua việc duy trì một đối tượng HashMap
private transient HashMap<E,Object> map;

// PRESENT được sử dụng để liên kết phần tử hiện tại trong map
private static final Object PRESENT = new Object();
}
```

- `HashSet` duy trì một đối tượng `HashMap` có tên là `map` trong nội bộ. Các phương thức quan trọng của `HashSet` như `add`, `remove`, `iterator`, `clear`, `size` đều được triển khai dựa trên `map`.
    - Lớp `HashSet` xác định cơ chế tuần tự hóa và giải tuần tự hóa thông qua việc định nghĩa các phương thức `writeObject()` và `readObject()`.
- `PRESENT` được sử dụng để liên kết phần tử hiện tại trong `map`.

## Lớp TreeSet

Lớp `TreeSet` phụ thuộc vào `TreeMap`, thực tế nó được triển khai bằng cách sử dụng `TreeMap`. Các phần tử trong `TreeSet` được sắp xếp và được sắp xếp theo thứ tự tự nhiên hoặc theo trình so sánh do người dùng chỉ định.

Định nghĩa lớp `TreeSet` như sau:

```java
public class TreeSet<E> extends AbstractSet<E>
    implements NavigableSet<E>, Cloneable, java.io.Serializable {}
```

### Điểm chính của TreeSet

- `TreeSet` triển khai các phương thức cốt lõi của `NavigableSet` thông qua việc kế thừa từ `AbstractSet`.
- `TreeSet` triển khai `Cloneable`, vì vậy hỗ trợ việc sao chép.
- `TreeSet` triển khai `Serializable`, vì vậy hỗ trợ việc tuần tự hóa.
- Các phần tử trong `TreeSet` được sắp xếp. Quy tắc sắp xếp dựa trên thứ tự tự nhiên hoặc trình so sánh (Comparator) do người dùng chỉ định.
- `TreeSet` không an toàn đối với luồng.

### Mã nguồn của TreeSet

**`TreeSet` được triển khai dựa trên `TreeMap`.**

```java
// Lõi của TreeSet, triển khai các phương thức của TreeSet thông qua việc duy trì một đối tượng NavigableMap
private transient NavigableMap<E,Object> m;

// PRESENT được sử dụng để liên kết phần tử hiện tại trong map
private static final Object PRESENT = new Object();
```

- `TreeSet` duy trì một đối tượng `NavigableMap` có tên là `m` trong nội bộ (thực tế là một đối tượng `TreeMap`). Các phương thức quan trọng của `TreeSet` như `add`, `remove`, `iterator`, `clear`, `size` đều được triển khai dựa trên `m`.
- `PRESENT` được sử dụng để liên kết phần tử hiện tại trong `map`. Các phần tử trong `TreeSet` được coi là các khóa trong `TreeMap`, và giá trị của chúng là `PRESENT`.

## Lớp LinkedHashSet

`LinkedHashSet` là một Set được sắp xếp theo thứ tự chèn.

Định nghĩa lớp `LinkedHashSet` như sau:

```java
public class LinkedHashSet<E>
    extends HashSet<E>
    implements Set<E>, Cloneable, java.io.Serializable {}
```

### Điểm chính của LinkedHashSet

- `LinkedHashSet` triển khai các phương thức cốt lõi của `Set` thông qua việc kế thừa từ `HashSet`.
- `LinkedHashSet` triển khai `Cloneable`, vì vậy hỗ trợ việc sao chép.
- `LinkedHashSet` triển khai `Serializable`, vì vậy hỗ trợ việc tuần tự hóa.
- Các phần tử trong `LinkedHashSet` được lưu trữ theo thứ tự chèn.
- `LinkedHashSet` không an toàn đối với luồng.

### Nguyên lý của LinkedHashSet

`LinkedHashSet` có ba phương thức khởi tạo, tất cả đều gọi phương thức khởi tạo của lớp cha `HashSet`.

```java
public LinkedHashSet(int initialCapacity, float loadFactor) {
    super(initialCapacity, loadFactor, true);
}
public LinkedHashSet(int initialCapacity) {
    super(initialCapacity, .75f, true);
}
public LinkedHashSet() {
    super(16, .75f, true);
}
```

Cần lưu ý rằng: **Phương thức khởi tạo của LinkedHashSet thực tế gọi phương thức khởi tạo không public của lớp cha HashSet.**

```java
HashSet(int initialCapacity, float loadFactor, boolean dummy) {
    map = new LinkedHashMap<>(initialCapacity, loadFactor);
}
```

Khác với phương thức khởi tạo public của `HashSet` mà khởi tạo một đối tượng `HashMap`, phương thức này khởi tạo một đối tượng `LinkedHashMap`.

Điều này có nghĩa là `LinkedHashSet` duy trì một danh sách liên kết hai chiều. Với tính chất của danh sách liên kết hai chiều, nó lưu trữ các phần tử theo thứ tự chèn. Vì vậy, đây là nguyên lý lưu trữ các phần tử trong `LinkedHashSet` theo thứ tự chèn.

## Lớp EnumSet

Định nghĩa lớp `EnumSet` như sau:

```java
public abstract class EnumSet<E extends Enum<E>> extends AbstractSet<E>
    implements Cloneable, java.io.Serializable {}
```

### Điểm chính của EnumSet

- `EnumSet` kế thừa từ `AbstractSet`, vì vậy có các phương thức cốt lõi của `Set`.
- `EnumSet` triển khai `Cloneable`, vì vậy hỗ trợ việc sao chép.
- `EnumSet` triển khai `Serializable`, vì vậy hỗ trợ việc tuần tự hóa.
- `EnumSet` giới hạn các phần tử lưu trữ phải là giá trị Enum.
- `EnumSet` không có constructor, chỉ có thể tạo đối tượng `EnumSet` thông qua các phương thức `static` trong lớp.
- `EnumSet` có thứ tự. Thứ tự của các phần tử trong `EnumSet` dựa trên thứ tự định nghĩa của chúng trong lớp Enum.
- `EnumSet` không an toàn đối với luồng.
