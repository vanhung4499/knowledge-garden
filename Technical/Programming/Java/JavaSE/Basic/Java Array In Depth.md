---
title: Java Array In Depth
tags: 
categories: 
date created: 2023-07-13
date modified: 2023-07-13
---

# Hiểu sâu về mảng trong Java

## Giới thiệu

### Đặc điểm của mảng

Mảng là một trong những cấu trúc dữ liệu quan trọng trong mọi ngôn ngữ lập trình, tuy nhiên cách thức thực hiện và xử lý mảng khác nhau giữa các ngôn ngữ.

Mảng đại diện cho một chuỗi các đối tượng hoặc kiểu dữ liệu cơ bản, nhóm các đối tượng hoặc kiểu dữ liệu cùng loại lại với nhau và được đóng gói thành một định danh duy nhất.

**Mảng được định nghĩa và sử dụng bằng cách sử dụng dấu ngoặc vuông `[]`.**

> **Trong Java, mảng là một kiểu tham chiếu.**
>
> **Trong Java, mảng được sử dụng để lưu trữ một số lượng cố định các phần tử cùng loại.**

### Array và Collection

Trong Java, với sự phát triển của các cấu trúc dữ liệu linh hoạt như Collection, liệu chúng ta còn cần mảng không?

Câu trả lời là có.

Đúng là trong hầu hết các trường hợp, chúng ta nên chọn sử dụng Collection để lưu trữ dữ liệu.

Tuy nhiên, mảng cũng không phải là không có giá trị:

- Trong Java, mảng là cách lưu trữ và truy cập ngẫu nhiên các tham chiếu đối tượng hiệu quả nhất. **Mảng hiệu suất cao hơn so với Collection** (ví dụ: ArrayList).
- **Mảng có thể chứa các kiểu dữ liệu nguyên thuỷ, trong khi Collection không thể** (trong trường hợp này, chúng ta phải sử dụng các lớp bao đóng).

### Mảng trong Java là đối tượng

**Mảng trong Java là một đối tượng**. Nó có một số đặc điểm cơ bản giống như các đối tượng khác trong Java: nó đóng gói một số dữ liệu, có thể truy cập các thuộc tính và có thể gọi các phương thức. Vì vậy, mảng cũng là một đối tượng.

Nếu có hai lớp A và B, và B kế thừa (extends) từ A, thì một tham chiếu kiểu A[] có thể trỏ đến một đối tượng kiểu B[].

### Mảng Java và bộ nhớ

Mảng Java được lưu trữ trong bộ nhớ như sau:

Đối tượng mảng (có thể coi là một con trỏ) được lưu trữ trong stack.

Các phần tử của mảng được lưu trữ trong heap.

Hình ảnh dưới đây chỉ ra rằng chỉ khi JVM thực thi `new String[]`, nó mới cấp phát một khu vực bộ nhớ tương ứng trong heap. Đối tượng mảng `array` có thể coi là một con trỏ, trỏ đến địa chỉ lưu trữ trong bộ nhớ này.

![array-memory.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/array-memory.png)

## Khai báo mảng

Cú pháp để khai báo biến mảng như sau:

```java
int[] arr1; // Cách viết khuyến nghị
int arr2[]; // Cách viết tương đương
```

## Tạo mảng

Trong Java, chúng ta sử dụng toán tử `new` để tạo mảng. Có hai cách để tạo mảng:

- Xác định kích thước mảng
  - Tạo một mảng với kích thước cụ thể.
  - Nếu các phần tử của mảng là kiểu dữ liệu cơ bản, chúng sẽ được gán giá trị mặc định; nếu là kiểu tham chiếu, các phần tử sẽ được gán giá trị `null`.
- Không xác định kích thước mảng
  - Khởi tạo mảng với các phần tử cụ thể trong dấu ngoặc nhọn, kích thước của mảng sẽ bằng số lượng phần tử.

Ví dụ 1:

```java
public class ArrayDemo {
    public static void main(String[] args) {
        int[] array1 = new int[2]; // Xác định kích thước mảng
        int[] array2 = new int[] { 1, 2 }; // Không xác định kích thước mảng

        System.out.println("array1 size is " + array1.length);
        for (int item : array1) {
            System.out.println(item);
        }

        System.out.println("array2 size is " + array1.length);
        for (int item : array2) {
            System.out.println(item);
        }
    }
}
// Output:
// array1 size is 2
// 0
// 0
// array2 size is 2
// 1
// 2
```

> 💡 **Giải thích**  
> Lưu ý rằng các phần tử trong mảng array1 chưa được khởi tạo, nhưng kích thước và số lượng phần tử đã được cấp phát bộ nhớ tương ứng.
>
> Các phần tử trong mảng array1 được gán giá trị mặc định.

Ví dụ 2:

```java
public class ArrayDemo2 {
    static class User {}

    public static void main(String[] args) {
        User[] array1 = new User[2]; // Xác định kích thước mảng
        User[] array2 = new User[] {new User(), new User()}; // Không xác định kích thước mảng

        System.out.println("array1: ");
        for (User item : array1) {
            System.out.println(item);
        }

        System.out.println("array2: ");
        for (User item : array2) {
            System.out.println(item);
        }
    }
}
// Output:
// array1:
// null
// null
// array2:
// io.github.dunwu.javacore.array.ArrayDemo2$User@4141d797
// io.github.dunwu.javacore.array.ArrayDemo2$User@68f7aae2
```

> 💡 **Giải thích**  
> So sánh ví dụ này với ví dụ 1, ta có thể thấy: khi tạo mảng với cách xác định kích thước, và các phần tử của mảng là kiểu tham chiếu, các phần tử trong mảng sẽ được gán giá trị `null`.

### Hình thức của kích thước mảng

Khi tạo mảng, kích thước của mảng có thể có nhiều hình thức khác nhau:

- Kích thước mảng có thể là số nguyên hoặc ký tự.
- Kích thước mảng có thể là biến kiểu số nguyên hoặc ký tự.
- Kích thước mảng có thể là biểu thức cho kết quả là số nguyên hoặc ký tự.

Ví dụ:

```java
public class ArrayDemo3 {
    public static void main(String[] args) {
        int length = 3;
        // Mở chú thích các dòng code dưới đây, trình biên dịch sẽ báo lỗi
        // int[] array = new int[4.0];
        // int[] array2 = new int["test"];
        int[] array3 = new int['a'];
        int[] array4 = new int[length];
        int[] array5 = new int[length + 2];
        int[] array6 = new int['a' + 2];
        // int[] array7 = new int[length + 2.1];
        System.out.println("array3.length = [" + array3.length + "]");
        System.out.println("array4.length = [" + array4.length + "]");
        System.out.println("array5.length = [" + array5.length + "]");
        System.out.println("array6.length = [" + array6.length + "]");
    }
}
// Output:
// array3.length = [97]
// array4.length = [3]
// array5.length = [5]
// array6.length = [99]
```

> 💡 **Giải thích**
>
> Khi kích thước mảng được chỉ định là ký tự, Java sẽ chuyển đổi nó thành số nguyên. Ví dụ, mã ASCII của ký tự `a` là 97.
>
> Tóm lại, **kích thước mảng trong Java có thể là hằng số, biến hoặc biểu thức, miễn là nó có thể chuyển đổi thành số nguyên**.
>
> Hãy lưu ý rằng một số ngôn ngữ lập trình không hỗ trợ tính năng này, ví dụ như ngôn ngữ C/C++, chỉ cho phép kích thước mảng là hằng số.

### Kích thước của mảng

**Kích thước của mảng không phải là vô hạn, nếu giá trị quá lớn, sẽ báo lỗi khi biên dịch.**

```java
int[] array = new int[6553612431]; // Kích thước mảng quá lớn, báo lỗi khi biên dịch
```

Ngoài ra, **mảng quá lớn có thể gây ra tràn ngăn xếp (stack overflow)**.

## Truy cập vào mảng

**Trong Java, bạn có thể truy cập vào các phần tử của mảng bằng cách chỉ định chỉ mục trong `[]`, với chỉ mục bắt đầu từ 0.**

```java
public class ArrayDemo4 {
    public static void main(String[] args) {
        int[] array = {1, 2, 3};
        for (int i = 0; i < array.length; i++) {
            array[i]++;
            System.out.println(String.format("array[%d] = %d", i, array[i]));
        }
    }
}
// Output:
// array[0] = 2
// array[1] = 3
// array[2] = 4
```

> 💡 **Giải thích**
>
> Trong ví dụ trên, chúng ta sử dụng chỉ mục để duyệt qua tất cả các phần tử của mảng `array` và tăng giá trị của mỗi phần tử lên 1.

## Tham chiếu đến mảng

**Trong Java, kiểu mảng là một kiểu tham chiếu**.

Do đó, nó có thể được sử dụng như một tham chiếu và được truyền vào hoặc trả về từ các hàm trong Java.

Ví dụ về việc truyền mảng vào hàm:

```java
public class ArrayRefDemo {
    private static void fun(int[] array) {
        for (int i : array) {
            System.out.print(i + "\t");
        }
    }

    public static void main(String[] args) {
        int[] array = new int[] {1, 3, 5};
        fun(array);
    }
}
// Output:
// 1	3	5
```

Ví dụ về việc trả về mảng từ hàm:

```java
public class ArrayRefDemo2 {
    /**
     * Trả về một mảng
     */
    private static int[] fun() {
        return new int[] {1, 3, 5};
    }

    public static void main(String[] args) {
        int[] array = fun();
        System.out.println(Arrays.toString(array));
    }
}
// Output:
// [1, 3, 5]
```

## Generic và mảng

Thường thì, việc kết hợp giữa Generic và mảng không được tốt. Bạn không thể tạo một mảng có kiểu tham số hóa.

```java
Peel<Banana>[] peels = new Pell<Banana>[10]; // Dòng code này không hợp lệ
```

Java không cho phép trực tiếp tạo mảng Generic. Tuy nhiên, bạn có thể tạo một mảng bị xóa kiểu và sau đó ép kiểu để tạo một mảng Generic.

```java
public class GenericArrayDemo<T> {

    static class GenericArray<T> {
        private T[] array;

        public GenericArray(int num) {
            array = (T[]) new Object[num];
        }

        public void put(int index, T item) {
            array[index] = item;
        }

        public T get(int index) { return array[index]; }

        public T[] array() { return array; }
    }



    public static void main(String[] args) {
        GenericArray<Integer> genericArray = new GenericArray<Integer>(4);
        genericArray.put(0, 0);
        genericArray.put(1, 1);
        Object[] array = genericArray.array();
        System.out.println(Arrays.deepToString(array));
    }
}
// Output:
// [0, 1, null, null]
```

> Đọc thêm: [[Java Generics]]
>
> Tôi nghĩ rằng, hiểu về mảng Generic tạm thời đến đây là đủ. Trên thực tế, nếu thực sự cần lưu trữ Generic, sử dụng các cấu trúc dữ liệu khác như Collection sẽ tốt hơn.

## Mảng đa chiều

Mảng đa chiều có thể được coi là một mảng của các mảng, ví dụ mảng hai chiều là một trường hợp đặc biệt của mảng một chiều, trong đó mỗi phần tử là một mảng một chiều.

Java hỗ trợ mảng hai chiều, mảng ba chiều, mảng bốn chiều, mảng năm chiều…

Tuy nhiên, với khả năng hiểu của con người, thường chỉ hiểu được tới mảng ba chiều. Vì vậy, xin đừng làm những việc không hợp lý như định nghĩa mảng có quá nhiều chiều.

Ví dụ sử dụng mảng đa chiều:

```java
public class MultiArrayDemo {
    public static void main(String[] args) {
        Integer[][] a1 = { // Tự động đóng gói
            {1, 2, 3,},
            {4, 5, 6,},
        };
        Double[][][] a2 = { // Tự động đóng gói
            { {1.1, 2.2}, {3.3, 4.4} },
            { {5.5, 6.6}, {7.7, 8.8} },
            { {9.9, 1.2}, {2.3, 3.4} },
        };
        String[][] a3 = {
            {"The", "Quick", "Sly", "Fox"},
            {"Jumped", "Over"},
            {"The", "Lazy", "Brown", "Dog", "and", "friend"},
        };
        System.out.println("a1: " + Arrays.deepToString(a1));
        System.out.println("a2: " + Arrays.deepToString(a2));
        System.out.println("a3: " + Arrays.deepToString(a3));
    }
}
// Output:
// a1: [[1, 2, 3], [4, 5, 6]]
// a2: [[[1.1, 2.2], [3.3, 4.4]], [[5.5, 6.6], [7.7, 8.8]], [[9.9, 1.2], [2.3, 3.4]]]
// a3: [[The, Quick, Sly, Fox], [Jumped, Over], [The, Lazy, Brown, Dog, and, friend]]
```

## Lớp Arrays

Trong Java, có một lớp tiện ích mảng rất hữu ích được gọi là Arrays.

Lớp này cung cấp các phương thức chính sau:

- `sort` - Sắp xếp
- `binarySearch` - Tìm kiếm
- `equals` - So sánh
- `fill` - Điền giá trị
- `asList` - Chuyển thành danh sách
- `hash` - Băm
- `toString` - Chuyển thành chuỗi

## Tóm tắt

![Java Array.svg](https://raw.githubusercontent.com/vanhung4499/images/master/snap/Java%20Array.svg)
