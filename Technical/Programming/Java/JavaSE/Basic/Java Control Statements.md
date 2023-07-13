---
title: Java Control Statements
tags: [java, javase]
categories: [java, javase]
date created: 2023-07-13
date modified: 2023-07-13
---

# Câu lệnh điều khiển trong Java

> Câu lệnh điều khiển trong Java có thể chia thành ba loại chính:
>
> - Câu lệnh điều kiện
> 	- if, else-if, else
> 	- switch
> - Câu lệnh lặp
> 	- while
> 	- do…while
> 	- for
> 	- foreach
> - Câu lệnh ngắt
> 	- break
> 	- continue
> 	- return

## Câu lệnh điều kiện

### Câu lệnh if

Câu lệnh `if` kiểm tra xem biểu thức trong dấu ngoặc đơn có đúng hay không. Nếu đúng, thì khối mã lệnh bên trong câu lệnh `if` sẽ được thực thi, ngược lại, nó sẽ bỏ qua khối mã lệnh đó và tiếp tục thực thi các câu lệnh tiếp theo.

**Cú pháp**

```java
if (biểu_thức) {
   // Nếu biểu thức là true, thực thi các câu lệnh trong khối này
}
```

**Ví dụ**

```java
public class IfDemo {
    public static void main(String args[]) {
        int x = 10;
        if (x < 20) {
            System.out.print("Đây là câu lệnh if");
        }
    }
}
// output:
// Đây là câu lệnh if
```

### Câu lệnh if…else

Câu lệnh `if` có thể được kết hợp với câu lệnh `else` để thực thi một khối mã lệnh khác khi biểu thức trong câu lệnh `if` là sai.

**Cú pháp**

```java
if (biểu_thức) {
   // Nếu biểu thức là true, thực thi các câu lệnh trong khối này
} else {
   // Nếu biểu thức là false, thực thi các câu lệnh trong khối này
}
```

**Ví dụ**

```java
public class IfElseDemo {
    public static void main(String args[]) {
        int x = 30;
        if (x < 20) {
            System.out.print("Đây là câu lệnh if");
        } else {
            System.out.print("Đây là câu lệnh else");
        }
    }
}
// output:
// Đây là câu lệnh else
```

### Câu lệnh if…else if…else

- Câu lệnh `if` có thể có tối đa 1 câu lệnh `else` và câu lệnh `else` phải đứng sau tất cả các câu lệnh `else if`.
- Câu lệnh `if` có thể có nhiều câu lệnh `else if`, nhưng chúng phải đứng trước câu lệnh `else`.
- Một khi một câu lệnh `else if` được thực thi, các câu lệnh `else if` và `else` khác sẽ được bỏ qua.

**Cú pháp**

```java
if (biểu_thức 1) {
   // Nếu biểu thức 1 là true, thực thi các câu lệnh trong khối này
} else if (biểu_thức 2) {
   // Nếu biểu thức 2 là true, thực thi các câu lệnh trong khối này
} else if (biểu_thức 3) {
   // Nếu biểu thức 3 là true, thực thi các câu lệnh trong khối này
} else {
   // Nếu tất cả các biểu thức trên đều là false, thực thi các câu lệnh trong khối này
}
```

**Ví dụ**

```java
public class IfElseifElseDemo {
    public static void main(String args[]) {
        int x = 3;

        if (x == 1) {
            System.out.print("Giá trị của X là 1");
        } else if (x == 2) {
            System.out.print("Giá trị của X là 2");
        } else if (x == 3) {
            System.out.print("Giá trị của X là 3");
        } else {
            System.out.print("Đây là câu lệnh else");
        }
    }
}
// output:
// Giá trị của X là 3
```

### Câu lệnh if lồng nhau

Có thể sử dụng câu lệnh `if else` lồng nhau. Điều này có nghĩa là bạn có thể sử dụng câu lệnh `if` hoặc `else if` trong một câu lệnh `if` hoặc `else if` khác.

**Cú pháp**

```java
if (biểu_thức 1) {
   // Nếu biểu thức 1 là true, thực thi các câu lệnh trong khối này
   if (biểu_thức 2) {
      // Nếu biểu thức 2 là true, thực thi các câu lệnh trong khối này
   }
}
```

**Ví dụ**

```java
public class IfNestDemo {
    public static void main(String args[]) {
        int x = 30;
        int y = 10;

        if (x == 30) {
            if (y == 10) {
                System.out.print("X = 30 và Y = 10");
            }
        }
    }
}
// output:
// X = 30 và Y = 10
```

### Câu lệnh switch

Câu lệnh `switch` kiểm tra một biến với một loạt các giá trị để xem nó có bằng với giá trị nào đó hay không. Mỗi giá trị được gọi là một nhánh.

Câu lệnh `switch` có các quy tắc sau:

- Kiểu biến trong câu lệnh `switch` chỉ có thể là `byte`、`short`、`int`、`char` hoặc `String`.
- Câu lệnh `switch` có thể có nhiều câu lệnh `case`. Mỗi câu lệnh `case` được theo sau bởi một giá trị để so sánh và dấu hai chấm.
- Kiểu dữ liệu của giá trị trong câu lệnh `case` phải giống với kiểu dữ liệu của biến và chỉ có thể là hằng số hoặc giá trị chữ cái.
- Khi giá trị của biến bằng với giá trị trong câu lệnh `case`, các câu lệnh sau câu lệnh `case` đó sẽ được thực thi cho đến khi gặp câu lệnh `break`.
- Khi gặp câu lệnh `break`, câu lệnh `switch` kết thúc. Chương trình nhảy đến câu lệnh sau câu lệnh `switch`. Câu lệnh `case` không nhất thiết phải chứa câu lệnh `break`. Nếu không có câu lệnh `break`, chương trình sẽ tiếp tục thực thi câu lệnh `case` tiếp theo cho đến khi gặp câu lệnh `break`.
- Câu lệnh `switch` có thể chứa một nhánh `default`, nhánh này phải là nhánh cuối cùng của câu lệnh `switch`. Nhánh `default` sẽ được thực thi khi không có giá trị của câu lệnh `case` nào khớp với giá trị của biến.

**Cú pháp**

```java
switch (biểu_thức) {
    case giá_trị:
       // Các câu lệnh
       break; // Tùy chọn
    case giá_trị:
       // Các câu lệnh
       break; // Tùy chọn
    // Bạn có thể có bất kỳ số lượng câu lệnh case nào
    default: // Tùy chọn
       // Các câu lệnh
       break; // Tùy chọn, nhưng nên có
}
```

**Ví dụ**

```java
public class SwitchDemo {
    public static void main(String args[]) {
        char grade = 'C';

        switch (grade) {
        case 'A':
            System.out.println("Xuất sắc!");
            break;
        case 'B':
        case 'C':
            System.out.println("Làm tốt");
            break;
        case 'D':
            System.out.println("Bạn đã qua môn");
        case 'F':
            System.out.println("Hãy cố gắng thêm");
            break;
        default:
            System.out.println("Điểm không hợp lệ");
            break;
        }
        System.out.println("Điểm của bạn là " + grade);
    }
}
// output:
// Làm tốt
// Điểm của bạn là C
```

## Câu lệnh lặp

### Vòng lặp while

Vòng lặp `while` sẽ tiếp tục thực hiện mã lệnh trong khối lệnh cho đến khi biểu thức boolean trở thành `false`.

**Cú pháp**

```java
while (biểu_thức) {
    // mã lệnh
}
```

**Ví dụ**

```java
public class WhileDemo {
    public static void main(String args[]) {
        int x = 10;
        while (x < 20) {
            System.out.print("giá trị của x : " + x);
            x++;
            System.out.print("\n");
        }
    }
}
// output:
// giá trị của x : 10
// giá trị của x : 11
// giá trị của x : 12
// giá trị của x : 13
// giá trị của x : 14
// giá trị của x : 15
// giá trị của x : 16
// giá trị của x : 17
// giá trị của x : 18
// giá trị của x : 19
```

### Vòng lặp do…while

Vòng lặp `do…while` tương tự như vòng lặp `while`, nhưng khối lệnh sẽ được thực thi ít nhất một lần, ngay cả khi biểu thức boolean là `false`.

**Cú pháp**

```java
do {
    // mã lệnh
} while (biểu_thức);
```

Biểu thức boolean được đặt sau khối lệnh, vì vậy khối lệnh sẽ được thực thi trước khi kiểm tra biểu thức boolean. Nếu giá trị của biểu thức boolean là `true`, khối lệnh sẽ được thực thi tiếp tục. Nếu giá trị của biểu thức boolean là `false`, vòng lặp sẽ kết thúc và chương trình sẽ tiếp tục thực hiện các câu lệnh sau vòng lặp.

**Ví dụ**

```java
public class DoWhileDemo {
    public static void main(String args[]) {
        int x = 10;

        do {
            System.out.print("giá trị của x : " + x);
            x++;
            System.out.print("\n");
        } while (x < 20);
    }
}
// output:
// giá trị của x : 10
// giá trị của x : 11
// giá trị của x : 12
// giá trị của x : 13
// giá trị của x : 14
// giá trị của x : 15
// giá trị của x : 16
// giá trị của x : 17
// giá trị của x : 18
// giá trị của x : 19
```

### Vòng lặp for

Mặc dù tất cả các vòng lặp có thể được biểu diễn bằng cách sử dụng `while` hoặc `do…while`, nhưng Java cung cấp một cú pháp đặc biệt cho vòng lặp `for`, làm cho một số vòng lặp trở nên dễ dàng hơn.

Vòng lặp `for` thực hiện một số lần lặp đã biết trước.

**Cú pháp**

```java
for (khởi_tạo; biểu_thức; cập_nhật) {
    // mã lệnh
}
```

- Đầu tiên, khởi tạo được thực hiện. Bạn có thể khai báo một biến mới hoặc khởi tạo một biến đã tồn tại.
- Sau đó, biểu thức được kiểm tra. Nếu giá trị của biểu thức là `true`, khối lệnh sẽ được thực thi. Nếu giá trị của biểu thức là `false`, vòng lặp sẽ kết thúc và chương trình sẽ tiếp tục thực hiện các câu lệnh sau vòng lặp.
- Sau khi thực hiện khối lệnh, cập nhật được thực hiện. Thường là tăng giá trị của biến điều khiển vòng lặp.
- Sau đó, biểu thức được kiểm tra lại. Quá trình này tiếp tục cho đến khi giá trị của biểu thức là `false`.

**Ví dụ**

```java
public class ForDemo {
    public static void main(String args[]) {
        for (int x = 10; x < 20; x = x + 1) {
            System.out.print("giá trị của x : " + x);
            System.out.print("\n");
        }
    }
}
// output:
// giá trị của x : 10
// giá trị của x : 11
// giá trị của x : 12
// giá trị của x : 13
// giá trị của x : 14
// giá trị của x : 15
// giá trị của x : 16
// giá trị của x : 17
// giá trị của x : 18
// giá trị của x : 19
```

### Vòng lặp foreach

Java 5 giới thiệu một vòng lặp foreach được sử dụng chủ yếu cho mảng.

**Cú pháp**

```java
for (kiểu_đối_tượng biến : mảng) {
    // mã lệnh
}
```

**kiểu_đối_tượng**: Khai báo một biến mới có kiểu dữ liệu của các phần tử trong mảng.

**biến**: Tên biến mới được khai báo, đại diện cho từng phần tử trong mảng.

**mảng**: Tên mảng hoặc biểu thức trả về một mảng.

**Ví dụ**

```java
public class ForeachDemo {
    public static void main(String args[]) {
        int[] numbers = { 10, 20, 30, 40, 50 };

        for (int x : numbers) {
            System.out.print(x);
            System.out.print(",");
        }

        System.out.print("\n");
        String[] names = { "James", "Larry", "Tom", "Lacy" };

        for (String name : names) {
            System.out.print(name);
            System.out.print(",");
        }
    }
}
// output:
// 10,20,30,40,50,
// James,Larry,Tom,Lacy,
```

## Câu lệnh ngắt

### Từ khóa break

`break` được sử dụng chủ yếu trong vòng lặp hoặc câu lệnh `switch`, để thoát khỏi toàn bộ khối lệnh.

`break` sẽ thoát khỏi vòng lặp hiện tại và tiếp tục thực hiện các câu lệnh sau vòng lặp.

**Ví dụ**

```java
public class BreakDemo {
    public static void main(String args[]) {
        int[] numbers = { 10, 20, 30, 40, 50 };

        for (int x : numbers) {
            if (x == 30) {
                break;
            }
            System.out.print(x);
            System.out.print("\n");
        }

        System.out.println("Kết thúc ví dụ về break");
    }
}
// output:
// 10
// 20
// Kết thúc ví dụ về break
```

### Từ khóa continue

`continue` được sử dụng trong bất kỳ cấu trúc lặp nào. Nó cho phép chương trình nhảy ngay lập tức đến lần lặp tiếp theo.

**Ví dụ**

```java
public class ContinueDemo {
    public static void main(String args[]) {
        int[] numbers = { 10, 20, 30, 40, 50 };

        for (int x : numbers) {
            if (x == 30) {
                continue;
            }
            System.out.print(x);
            System.out.print("\n");
        }
    }
}
// output:
// 10
// 20
// 40
// 50
```

### Từ khóa return

`return` dùng để thoát khỏi toàn bộ khối lệnh của một phương thức. Các câu lệnh sau `return` trong phương thức sẽ không được thực thi.

**Ví dụ**

```java
public class ReturnDemo {
    public static void main(String args[]) {
        int[] numbers = { 10, 20, 30, 40, 50 };

        for (int x : numbers) {
            if (x == 30) {
                return;
            }
            System.out.print(x);
            System.out.print("\n");
        }

        System.out.println("Kết thúc ví dụ về return");
    }
}
// output:
// 10
// 20
```

> 🔔 Lưu ý: Hãy lưu ý sự khác biệt giữa `return` và `break`.

## Thực hành

- Trong trường hợp có nhiều lựa chọn, câu lệnh `switch` tốt hơn câu lệnh `if…else if…else`.
- Đừng ngần ngại sử dụng `default` trong câu lệnh `switch`.
- Đặt câu lệnh `default` cuối cùng trong câu lệnh `switch`.
- Uu tiên vòng lặp `foreach` hơn vòng lặp `for` truyền thống.
- Không lặp qua các phần tử của một collection và xóa các phần tử cụ thể. Cách đúng là lặp qua iterator của collection và xóa phần tử.
