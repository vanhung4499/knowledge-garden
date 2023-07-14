---
title: Java Collection List
tags: [java, javase, collection]
categories: [java, javase]
date created: 2023-07-14
date modified: 2023-07-14
---

# Java Collection - List

> `List` là một giao diện con của `Collection`, nó cho phép lưu trữ các phần tử có thể lặp lại.

## Giới thiệu về List

`List` là một giao diện mô tả một hàng đợi có thứ tự.

`AbstractList` là một lớp trừu tượng kế thừa từ `AbstractCollection`. `AbstractList` triển khai tất cả các phương thức trong giao diện `List` ngoại trừ `size()` và `get(int location)`.

`AbstractSequentialList` là một lớp trừu tượng kế thừa từ `AbstractList`. `AbstractSequentialList` triển khai tất cả các phương thức trong giao diện `List` liên quan đến việc thao tác trên danh sách dựa trên chỉ mục.

### ArrayList và LinkedList

`ArrayList` và `LinkedList` là hai cách triển khai phổ biến nhất của `List`.

- `ArrayList` được triển khai dựa trên mảng động và có giới hạn về dung lượng. Khi số lượng phần tử vượt quá dung lượng tối đa, nó sẽ tự động mở rộng. `LinkedList` được triển khai dựa trên danh sách liên kết hai chiều và không có giới hạn về dung lượng.
- `ArrayList` có tốc độ truy cập ngẫu nhiên nhanh, nhưng tốc độ chèn và xóa ngẫu nhiên chậm. `LinkedList` có tốc độ chèn và xóa ngẫu nhiên nhanh, nhưng tốc độ truy cập ngẫu nhiên chậm.
- Cả `ArrayList` và `LinkedList` đều không an toàn đối với luồng.

### Vector và Stack

`Vector` và `Stack` được thiết kế để làm các triển khai an toàn đối với luồng của `List` và thay thế cho `ArrayList`.

- `Vector` - `Vector` tương tự như `ArrayList`, cũng triển khai giao diện `List`. Tuy nhiên, tất cả các phương thức chính trong `Vector` đều được đồng bộ hóa bằng từ khóa `synchronized`, đảm bảo tính an toàn của các hoạt động.
- `Stack` - `Stack` cũng là một collection được đồng bộ hóa, các phương thức của nó cũng được đồng bộ hóa bằng từ khóa `synchronized`. Nó thực tế là một lớp con của `Vector`.

## ArrayList

> Từ góc độ cấu trúc dữ liệu, `ArrayList` có thể được coi là một danh sách tuyến tính có khả năng mở rộng.

### Điểm chính của ArrayList

`ArrayList` là một danh sách, tương đương với một **mảng động**. **`ArrayList` có dung lượng khởi tạo mặc định là `10` và khi thêm phần tử, nếu dung lượng đã đầy, nó sẽ tự động mở rộng lên `1.5` lần dung lượng ban đầu**. Do đó, khi khởi tạo `ArrayList`, nên chỉ định dung lượng khởi tạo phù hợp để giảm thiểu chi phí mở rộng.

Định nghĩa của `ArrayList`:

```java
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable
```

Từ định nghĩa của ArrayList, có thể thấy một số đặc điểm cơ bản của ArrayList:

- `ArrayList` triển khai giao diện `List` và kế thừa từ `AbstractList`, nó hỗ trợ tất cả các hoạt động của `List`.
- `ArrayList` triển khai giao diện `RandomAccess`, **hỗ trợ truy cập ngẫu nhiên**. `RandomAccess` là một giao diện đánh dấu, nghĩa là "bất kỳ lớp triển khai giao diện này đều hỗ trợ truy cập ngẫu nhiên nhanh chóng". Trong `ArrayList`, chúng ta có thể **nhanh chóng lấy phần tử bằng chỉ số của nó**; đó là truy cập ngẫu nhiên nhanh chóng.
- `ArrayList` triển khai giao diện `Cloneable`, mặc định là **sao chép nông**.
- `ArrayList` triển khai giao diện `Serializable`, **hỗ trợ tuần tự hóa**, có thể truyền qua tuần tự hóa.

### Cơ chế của ArrayList

#### Cấu trúc dữ liệu của ArrayList

ArrayList bao gồm hai thành phần quan trọng: `elementData` và `size`.

```java
// Dung lượng khởi tạo mặc định
private static final int DEFAULT_CAPACITY = 10;
// Mảng đối tượng
transient Object[] elementData;
// Kích thước mảng
private int size;
```

- `size` - là kích thước thực tế của mảng động.
- `elementData` - là một mảng `Object` dùng để lưu trữ các phần tử được thêm vào `ArrayList`.

#### Tuần tự hóa của ArrayList

ArrayList có khả năng mở rộng động, do đó không phải lúc nào cũng sử dụng toàn bộ mảng để lưu trữ các phần tử. Vì vậy, ArrayList đã tùy chỉnh cách tuần tự hóa của nó. Cụ thể là:

- Mảng lưu trữ phần tử (`elementData`) được đánh dấu bằng từ khóa `transient`, cho phép nó bị bỏ qua trong quá trình tuần tự hóa Java.
- ArrayList ghi đè các phương thức `writeObject()` và `readObject()` để kiểm soát quá trình tuần tự hóa mảng chỉ chứa phần tử đã được điền.

💡 Nếu bạn không quen với cách tuần tự hóa Java, bạn có thể tham khảo: [Java Serialization]()

#### Phương thức khởi tạo của ArrayList

Lớp ArrayList triển khai ba phương thức khởi tạo:

- Phương thức đầu tiên là phương thức khởi tạo mặc định, ArrayList sẽ tạo một mảng rỗng.
- Phương thức thứ hai là phương thức khởi tạo ArrayList với giá trị khởi tạo.
- Phương thức thứ ba là phương thức khởi tạo ArrayList với một tập hợp đã cho.

Khi thêm phần tử vào ArrayList, nếu số lượng phần tử vượt quá dung lượng hiện tại, nó sẽ tính toán dung lượng mới trước khi mở rộng. Việc mở rộng mảng có thể dẫn đến việc sao chép toàn bộ mảng. Do đó, **khi khởi tạo ArrayList, nên chỉ định một dung lượng khởi tạo xấp xỉ để giảm số lần mở rộng mảng**.

```java
public ArrayList() {
    // Tạo một mảng rỗng
	this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
}

public ArrayList(int initialCapacity) {
	if (initialCapacity > 0) {
        // Tạo một mảng với kích thước khởi tạo
		this.elementData = new Object[initialCapacity];
	} else if (initialCapacity == 0) {
        // Khi kích thước khởi tạo là 0, tạo một mảng rỗng
		this.elementData = EMPTY_ELEMENTDATA;
	} else {
		throw new IllegalArgumentException("Illegal Capacity: "+
										   initialCapacity);
	}
}
```

#### Truy cập phần tử của ArrayList

Việc truy cập phần tử trong `ArrayList` được thực hiện dựa trên chỉ số của phần tử đó.

```java
// Lấy phần tử thứ index
public E get(int index) {
    rangeCheck(index);
    return elementData(index);
}

E elementData(int index) {
    return (E) elementData[index];
}
```

Cách triển khai rất đơn giản, chỉ cần **truy cập phần tử trong mảng dựa trên chỉ số**, nên tốc độ rất nhanh, có độ phức tạp thời gian là O(1).

#### Thêm phần tử vào ArrayList

`ArrayList` có hai phương thức để thêm phần tử: một là thêm phần tử vào cuối mảng, hai là thêm phần tử vào bất kỳ vị trí nào.

```java
// Thêm phần tử vào cuối mảng
public boolean add(E e) {
    ensureCapacityInternal(size + 1);  // Tăng modCount!!
    elementData[size++] = e;
    return true;
}

// Thêm phần tử vào bất kỳ vị trí
public void add(int index, E element) {
	rangeCheckForAdd(index);

	ensureCapacityInternal(size + 1);  // Tăng modCount!!
	System.arraycopy(elementData, index, elementData, index + 1,
					 size - index);
	elementData[index] = element;
	size++;
}
```

Sự khác biệt giữa hai phương thức thêm phần tử là:

- Khi thêm phần tử vào bất kỳ vị trí nào, tất cả các phần tử ở vị trí đó và sau đó đều phải được sao chép lại.
- Khi thêm phần tử vào cuối mảng, nếu không cần mở rộng, không có quá trình sao chép và sắp xếp các phần tử.

Cả hai phương thức thêm phần tử đều kiểm tra dung lượng của mảng trước khi thêm phần tử. **Nếu dung lượng không đủ, nó sẽ tự động mở rộng lên `1.5` lần dung lượng ban đầu**.

Các phương thức thêm phần tử của `ArrayList` được triển khai dựa trên mã nguồn quan trọng sau:

```java
private void ensureCapacityInternal(int minCapacity) {
    if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
        minCapacity = Math.max(DEFAULT_CAPACITY, minCapacity);
    }

    ensureExplicitCapacity(minCapacity);
}

private void ensureExplicitCapacity(int minCapacity) {
    modCount++;

    // Kiểm tra tràn
    if (minCapacity - elementData.length > 0)
        grow(minCapacity);
}

private void grow(int minCapacity) {
    // Kiểm tra tràn
    int oldCapacity = elementData.length;
    int newCapacity = oldCapacity + (oldCapacity >> 1);
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    // Vì minCapacity thường gần với size, nên đây là một lợi thế:
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```

Khi thực hiện thao tác thêm phần tử (`add`), `ArrayList` sẽ gọi phương thức `ensureCapacityInternal` để đảm bảo rằng dung lượng đủ.

- Nếu dung lượng đủ, dữ liệu sẽ được ghi vào vị trí `size+1` trong mảng và `size` tăng lên 1.
- Nếu dung lượng không đủ, phải sử dụng phương thức `grow` để mở rộng mảng. Dung lượng mới được tính bằng cách nhân dung lượng cũ với `1.5`. Quá trình mở rộng mảng thực chất là **sao chép mảng gốc thành một mảng mới**. Vì vậy, tốt nhất là chỉ định kích thước khởi tạo xấp xỉ khi tạo đối tượng `ArrayList` để giảm số lần mở rộng mảng.

#### Xóa phần tử khỏi ArrayList

Phương thức xóa của `ArrayList` tương tự như phương thức thêm phần tử vào bất kỳ vị trí nào.

Sau mỗi lần xóa thành công, `ArrayList` sẽ thực hiện việc sao chép lại mảng và xóa phần tử cuối cùng.

```java
public E remove(int index) {
    rangeCheck(index);

    modCount++;
    E oldValue = elementData(index);

    int numMoved = size - index - 1;
    if (numMoved > 0)
        System.arraycopy(elementData, index+1, elementData, index, numMoved);
    elementData[--size] = null; // Xóa để GC làm việc

    return oldValue;
}
```

#### Fail-Fast của ArrayList

`ArrayList` sử dụng `modCount` để ghi lại số lần thay đổi cấu trúc. Thay đổi cấu trúc là thêm hoặc xóa ít nhất một phần tử, hoặc điều chỉnh kích thước mảng. Chỉ đơn giản đặt giá trị của một phần tử không được tính là thay đổi cấu trúc.

Khi thực hiện tuần tự hóa hoặc lặp qua `ArrayList`, cần so sánh `modCount` trước và sau thao tác. Nếu có sự thay đổi, `ArrayList` sẽ ném ra `ConcurrentModificationException`.

```java
private void writeObject(java.io.ObjectOutputStream s)
    throws java.io.IOException{
    // Ghi số lượng phần tử và các thông tin ẩn khác
    int expectedModCount = modCount;
    s.defaultWriteObject();

    // Ghi kích thước như dung lượng để tương thích với clone()
    s.writeInt(size);

    // Ghi tất cả các phần tử theo thứ tự đúng.
    for (int i=0; i<size; i++) {
        s.writeObject(elementData[i]);
    }

    if (modCount != expectedModCount) {
        throw new ConcurrentModificationException();
    }
}
```

## LinkedList

> Từ góc độ cấu trúc dữ liệu, `LinkedList` có thể được coi là một danh sách liên kết hai chiều.

### Điểm chính của LinkedList

`LinkedList` được triển khai dựa trên cấu trúc danh sách liên kết hai chiều. Vì nó là danh sách liên kết hai chiều, nên **truy cập tuần tự sẽ rất hiệu quả, trong khi truy cập ngẫu nhiên có hiệu suất thấp**.

Định nghĩa LinkedList:

```java
public class LinkedList<E>
    extends AbstractSequentialList<E>
    implements List<E>, Deque<E>, Cloneable, java.io.Serializable
```

Từ định nghĩa của `LinkedList`, chúng ta có thể rút ra một số đặc điểm cơ bản của `LinkedList`:

- `LinkedList` triển khai giao diện `List` và kế thừa `AbstractSequentialList` , nó hỗ trợ tất cả các hoạt động của `List`.
- `LinkedList` triển khai giao diện `Deque`, nó cũng có thể được sử dụng như một hàng đợi (`Queue`) hoặc hàng đợi hai đầu (`Deque`), ngoài ra, nó cũng có thể được sử dụng để triển khai ngăn xếp.
- `LinkedList` triển khai giao diện `Cloneable`, mặc định là **sao chép nông**.
- `LinkedList` triển khai giao diện `Serializable`, **hỗ trợ tuần tự hóa**.
- `LinkedList` **không an toàn đa luồng**.

### Nguyên lý của LinkedList

#### Cấu trúc dữ liệu LinkedList

**`LinkedList` bên trong duy trì một danh sách liên kết hai chiều**.

`LinkedList` truy cập dữ liệu thông qua con trỏ đầu và cuối (biến `first` và `last`) của danh sách liên kết.

```java
// Độ dài của danh sách liên kết
transient int size = 0;
// Con trỏ đầu của danh sách liên kết
transient Node<E> first;
// Con trỏ cuối của danh sách liên kết
transient Node<E> last;
```

- `size` - **đại diện cho số lượng nút trong danh sách liên kết, ban đầu là 0**.
- `first` và `last` - **lần lượt là con trỏ đầu và cuối của danh sách liên kết**.

`Node` là một lớp nội bộ của `LinkedList`, nó đại diện cho một phiên bản phần tử trong danh sách. `Node` chứa ba thành phần:

- `prev` là nút trước đó của nút hiện tại;
- `next` là nút tiếp theo của nút hiện tại;
- `item` là giá trị chứa trong nút hiện tại.

```java
private static class Node<E> {
    E item;
    Node<E> next;
    Node<E> prev;
    ...
}
```

#### Tuần tự hóa LinkedList

`LinkedList` cũng như `ArrayList`, nó cũng tùy chỉnh cách tuần tự hóa của riêng mình. Cụ thể là:

- Đặt `size` (kích thước danh sách liên kết), `first` và `last` (con trỏ đầu và cuối của danh sách liên kết) thành `transient`, để chúng có thể được bỏ qua trong quá trình tuần tự hóa Java.
- Ghi đè phương thức `writeObject()` và `readObject()` để kiểm soát quá trình tuần tự hóa, chỉ xử lý các phần tử trong danh sách liên kết có thể được liên kết với con trỏ đầu.

#### Truy cập phần tử trong LinkedList

Cài đặt truy cập phần tử của `LinkedList` chủ yếu dựa trên mã nguồn quan trọng sau đây:

```java
public E get(int index) {
    checkElementIndex(index);
    return node(index).item;
}

Node<E> node(int index) {
    // assert isElementIndex(index);

    if (index < (size >> 1)) {
        Node<E> x = first;
        for (int i = 0; i < index; i++)
            x = x.next;
        return x;
    } else {
        Node<E> x = last;
        for (int i = size - 1; i > index; i--)
            x = x.prev;
        return x;
    }
}
```

Thuật toán để lấy phần tử thứ index của `LinkedList` như sau:

- Kiểm tra xem index thuộc nửa trước hay nửa sau của danh sách liên kết.
- Nếu thuộc nửa trước, bắt đầu tìm kiếm từ con trỏ đầu; nếu thuộc nửa sau, bắt đầu tìm kiếm từ con trỏ cuối.

Hiệu suất truy cập phần tử của `LinkedList` là O(N) (trường hợp cực đoan, quét qua N/2 phần tử); so với O(1) của `ArrayList`, rõ ràng là chậm hơn nhiều.

**Khuyến nghị sử dụng vòng lặp lặp qua `LinkedList` , không sử dụng vòng lặp `for` truyền thống**. Lưu ý: cú pháp foreach sẽ được biên dịch thành vòng lặp lặp qua, nhưng trong quá trình lặp, không được phép thay đổi độ dài của `List`, tức là không thể thực hiện thêm hoặc xóa phần tử.

#### Thêm phần tử vào LinkedList

`LinkedList` có nhiều phương thức để thêm phần tử:

- `add(E e)`: Phương thức thêm phần tử mặc định (thêm vào cuối danh sách)
- `add(int index, E element)`: Thêm phần tử vào bất kỳ vị trí nào
- `addFirst(E e)`: Thêm phần tử vào đầu danh sách
- `addLast(E e)`: Thêm phần tử vào cuối danh sách

```java
public boolean add(E e) {
    linkLast(e);
    return true;
}

public void add(int index, E element) {
    checkPositionIndex(index);

    if (index == size)
        linkLast(element);
    else
        linkBefore(element, node(index));
}

public void addFirst(E e) {
    linkFirst(e);
}

public void addLast(E e) {
    linkLast(e);
}
```

Cài đặt thêm phần tử của `LinkedList` chủ yếu dựa trên mã nguồn quan trọng sau đây:

```java
private void linkFirst(E e) {
    final Node<E> f = first;
    final Node<E> newNode = new Node<>(null, e, f);
    first = newNode;
    if (f == null)
        last = newNode;
    else
        f.prev = newNode;
    size++;
    modCount++;
}

void linkLast(E e) {
    final Node<E> l = last;
    final Node<E> newNode = new Node<>(l, e, null);
    last = newNode;
    if (l == null)
        first = newNode;
    else
        l.next = newNode;
    size++;
    modCount++;
}

void linkBefore(E e, Node<E> succ) {
    // assert succ != null;
    final Node<E> pred = succ.prev;
    final Node<E> newNode = new Node<>(pred, e, succ);
    succ.prev = newNode;
    if (pred == null)
        first = newNode;
    else
        pred.next = newNode;
    size++;
    modCount++;
}
```

Thuật toán như sau:

- Đóng gói dữ liệu mới thêm vào trong `Node`.
- Nếu thêm phần tử vào đầu danh sách, thì con trỏ đầu `first` trỏ đến `Node` mới, `prev` của `first` trước đó trỏ đến `Node` mới.
- Nếu thêm phần tử vào cuối danh sách, thì con trỏ cuối `last` trỏ đến `Node` mới, `next` của `last` trước đó trỏ đến `Node` mới.

#### Xóa phần tử khỏi LinkedList

Cài đặt xóa phần tử của `LinkedList` chủ yếu dựa trên mã nguồn quan trọng sau đây:

```java
public boolean remove(Object o) {
    if (o == null) {
        // Tìm kiếm phần tử cần xóa trong danh sách liên kết
        for (Node<E> x = first; x != null; x = x.next) {
            if (x.item == null) {
                unlink(x);
                return true;
            }
        }
    } else {
        // Tìm kiếm phần tử cần xóa trong danh sách liên kết
        for (Node<E> x = first; x != null; x = x.next) {
            if (o.equals(x.item)) {
                unlink(x);
                return true;
            }
        }
    }
    return false;
}

E unlink(Node<E> x) {
    // assert x != null;
    final E element = x.item;
    final Node<E> next = x.next;
    final Node<E> prev = x.prev;

    if (prev == null) {
        first = next;
    } else {
        prev.next = next;
        x.prev = null;
    }

    if (next == null) {
        last = prev;
    } else {
        next.prev = prev;
        x.next = null;
    }

    x.item = null;
    size--;
    modCount++;
    return element;
}
```

Thuật toán như sau:

- Tìm kiếm phần tử cần xóa trong danh sách liên kết, sau đó gọi phương thức `unlink` để xóa nút.
- Phương thức `unlink` xóa nút như sau:
    - Nếu nút hiện tại có nút trước, thì cho nút trước trỏ đến nút tiếp theo của nút hiện tại; nếu không, cho con trỏ đầu của danh sách liên kết trỏ đến nút tiếp theo.
    - Nếu nút hiện tại có nút sau, thì cho nút sau trỏ đến nút trước của nút hiện tại; nếu không, cho con trỏ cuối của danh sách liên kết trỏ đến nút trước.

## Các vấn đề thường gặp với List

### Vấn đề với Arrays.asList

Trong quá trình phát triển ứng dụng, chúng ta thường chuyển đổi mảng gốc thành cấu trúc dữ liệu List để tiếp tục thực hiện các thao tác Stream khác nhau. Thông thường, chúng ta sẽ sử dụng phương thức Arrays.asList để chuyển đổi mảng thành List.

【Ví dụ】Chuyển đổi mảng kiểu nguyên thủy thành List

```java
int[] arr = { 1, 2, 3 };
List<Integer> list = Arrays.asList(arr);
log.info("list:{} size:{} class:{}", list, list.size(), list.get(0).getClass());
```

【Kết quả】

```
11:26:33.214 [main] INFO com.hnv99.javacore.collections.list.AsListProblem - list:[[I@ae45eb6] size:1 class:class [I
```

Số lượng phần tử trong mảng là 3, nhưng số lượng phần tử trong danh sách sau khi chuyển đổi là 1.

Từ đó có thể thấy, vấn đề đầu tiên của Arrays.asList là: **không thể sử dụng trực tiếp Arrays.asList để chuyển đổi mảng kiểu nguyên thủy**.

Nguyên nhân là: phương thức Arrays.asList nhận đối số biến đổi kiểu T có thể thay đổi, và cuối cùng mảng int được coi là một đối tượng và trở thành kiểu T:

```java
public static <T> List<T> asList(T... a) {
    return new ArrayList<>(a);
}
```

Việc lặp qua danh sách như vậy chắc chắn sẽ gây ra lỗi, có hai cách để khắc phục, nếu sử dụng phiên bản Java8 trở lên, bạn có thể sử dụng phương thức Arrays.stream để chuyển đổi, nếu không, bạn có thể khai báo mảng int là một mảng Integer bọc:

【Ví dụ】Cách chuyển đổi mảng số nguyên sang List đúng

```java
int[] arr1 = { 1, 2, 3 };
List<Integer> list1 = Arrays.stream(arr1).boxed().collect(Collectors.toList());
log.info("list:{} size:{} class:{}", list1, list1.size(), list1.get(0).getClass());

Integer[] arr2 = { 1, 2, 3 };
List<Integer> list2 = Arrays.asList(arr2);
log.info("list:{} size:{} class:{}", list2, list2.size(), list2.get(0).getClass());
```

【Ví dụ】Chuyển đổi mảng kiểu tham chiếu thành List

```java
String[] arr = { "1", "2", "3" };
List<String> list = Arrays.asList(arr);
arr[1] = "4";
try {
    list.add("5");
} catch (Exception ex) {
    ex.printStackTrace();
}
log.info("arr:{} list:{}", Arrays.toString(arr), list);
```

Ném ra ngoại lệ `java.lang.UnsupportedOperationException`.

Lý do ném ra ngoại lệ là: vấn đề thứ hai của Arrays.asList là: **List trả về từ Arrays.asList không hỗ trợ thao tác thêm và xóa**. List trả về từ Arrays.asList không phải là ArrayList mà chúng ta mong đợi, mà là lớp ArrayList bên trong của Arrays.

Kiểm tra mã nguồn, chúng ta có thể thấy ArrayList trả về từ Arrays.asList kế thừa từ AbstractList, nhưng không ghi đè phương thức add và remove.

```java
private static class ArrayList<E> extends AbstractList<E>
    implements RandomAccess, java.io.Serializable
{
    private static final long serialVersionUID = -2764017481108945198L;
    private final E[] a;

    ArrayList(E[] array) {
        a = Objects.requireNonNull(array);
    }

    // ...

    @Override
    public E set(int index, E element) {
        E oldValue = a[index];
        a[index] = element;
        return oldValue;
    }

}

public abstract class AbstractList<E> extends AbstractCollection<E> implements List<E> {
    public void add(int index, E element) {
        throw new UnsupportedOperationException();
    }

    public E remove(int index) {
        throw new UnsupportedOperationException();
    }
}
```

Vấn đề thứ ba của Arrays.asList là: **sửa đổi mảng gốc sẽ ảnh hưởng đến List mà chúng ta nhận được**. ArrayList thực sự sử dụng trực tiếp mảng gốc.

Cách giải quyết rất đơn giản, chỉ cần tạo một ArrayList mới và khởi tạo List trả về từ Arrays.asList:

```java
String[] arr = { "1", "2", "3" };
List<String> list = new ArrayList<>(Arrays.asList(arr));
arr[1] = "4";
try {
    list.add("5");
} catch (Exception ex) {
    ex.printStackTrace();
}
log.info("arr:{} list:{}", Arrays.toString(arr), list);
```

### Vấn đề với List.subList

List.subList trực tiếp tham chiếu đến List gốc, cũng có thể coi là chia sẻ "lưu trữ", và thực hiện sửa đổi cấu trúc trực tiếp trên List gốc sẽ dẫn đến lỗi xuất hiện ở SubList.

```java
private static List<List<Integer>> data = new ArrayList<>();

private static void oom() {
    for (int i = 0; i < 1000; i++) {
        List<Integer> rawList = IntStream.rangeClosed(1, 100000).boxed().collect(Collectors.toList());
        data.add(rawList.subList(0, 1));
    }
}
```

Lý do gây ra OOM là 1000 danh sách có 100.000 phần tử mỗi danh sách trong vòng lặp không bao giờ được thu hồi, vì nó luôn được tham chiếu mạnh bởi List trả về từ phương thức subList.

Cách giải quyết là:

```java
private static void oomfix() {
    for (int i = 0; i < 1000; i++) {
        List<Integer> rawList = IntStream.rangeClosed(1, 100000).boxed().collect(Collectors.toList());
        data.add(new ArrayList<>(rawList.subList(0, 1)));
    }
}
```

【Ví dụ】SubList tham chiếu mạnh List gốc

```java
private static void wrong() {
    List<Integer> list = IntStream.rangeClosed(1, 10).boxed().collect(Collectors.toList());
    List<Integer> subList = list.subList(1, 4);
    System.out.println(subList);
    subList.remove(1);
    System.out.println(list);
    list.add(0);
    try {
        subList.forEach(System.out::println);
    } catch (Exception ex) {
        ex.printStackTrace();
    }
}
```

Ném ra ngoại lệ `java.util.ConcurrentModificationException`.

Cách giải quyết:

Một cách là không sử dụng trực tiếp SubList trả về từ phương thức subList, mà là tạo một ArrayList mới và chuyển SubList vào trong phương thức khởi tạo để xây dựng một ArrayList độc lập;

Một cách khác là sử dụng phương thức skip và limit của Stream trong Java 8 để bỏ qua các phần tử trong luồng và giới hạn số lượng phần tử trong luồng, cũng có thể đạt được mục đích cắt SubList.

```java
// Cách 1:
List<Integer> subList = new ArrayList<>(list.subList(1, 4));
// Cách 2:
List<Integer> subList = list.stream().skip(1).limit(3).collect(Collectors.toList());
```
