---
title: Singleton Pattern
tags:
  - design-pattern
categories:
  - design-pattern
date created: 2023-10-06
date modified: 2023-10-06
---

## Ý tưởng

**Singleton Pattern** là một mẫu thiết kế tạo ra một đối tượng duy nhất của một lớp và cung cấp một điểm truy cập toàn cầu để truy xuất đến đối tượng đó.

Lớp Singleton khai báo một phương thức tĩnh `getInstance` để trả về một phiên bản duy nhất của lớp đó.

Hàm tạo của Singleton phải được ẩn đi để mã khách hàng không thể sử dụng toán tử `new` để tạo đối tượng.

Tất cả các triển khai của Singleton đều bao gồm hai bước chung sau:

- **Đặt hàm tạo mặc định thành riêng tư** để ngăn các đối tượng khác sử dụng toán tử `new` của lớp Singleton.
- **Tạo một phương thức tạo tĩnh như một hàm tạo**. Phương thức này sẽ "bí mật" gọi hàm tạo riêng tư để tạo đối tượng và lưu trữ nó trong một biến thành viên tĩnh. Từ đó, mọi lần gọi phương thức này sẽ trả về đối tượng được lưu trữ trong biến thành viên.

Nếu mã của bạn có thể truy cập vào lớp Singleton, nó có thể gọi phương thức tĩnh của lớp Singleton. Bất kể khi nào phương thức này được gọi, nó luôn trả về cùng một đối tượng.

Ưu điểm của Singleton Pattern:

- ✔ Bạn có thể đảm bảo rằng một lớp chỉ có một phiên bản.
- ✔ Bạn có một điểm truy cập toàn cầu để truy xuất đến phiên bản đó.
- ✔ Chỉ khởi tạo đối tượng khi lần đầu tiên yêu cầu.

Nhược điểm của Singleton Pattern:

- ❌ Vi phạm nguyên tắc *đơn trách nhiệm (single responsbility)*. Mẫu này giải quyết cùng lúc hai vấn đề.
- ❌ Singleton Pattern có thể che giấu thiết kế kém chất lượng, ví dụ như các thành phần trong chương trình biết quá nhiều về nhau.
- ❌ Mẫu này cần xử lý đặc biệt trong môi trường đa luồng để tránh việc tạo nhiều đối tượng Singleton bởi nhiều luồng cùng một lúc.
- ❌ Việc kiểm thử đơn vị cho mã khách của Singleton có thể khó khăn, vì nhiều framework kiểm thử tạo đối tượng giả bằng cách kế thừa. Vì hàm tạo của lớp Singleton là riêng tư và hầu hết các ngôn ngữ không cho phép ghi đè phương thức tĩnh, bạn cần nghĩ ra cách khác để tạo đối tượng giả. Bạn có thể không viết mã kiểm thử hoặc không sử dụng Singleton Pattern.

## Ứng dụng

- Nếu một lớp trong chương trình chỉ có một phiên bản duy nhất và chỉ có thể sử dụng cho tất cả các khách hàng, bạn có thể sử dụng Singleton Pattern.  
  ⚡ Singleton Pattern ngăn chặn việc tạo đối tượng của lớp trừ khi sử dụng phương thức tạo đặc biệt. Phương thức này có thể tạo một đối tượng mới, nhưng nếu đối tượng đã được tạo, nó sẽ trả về đối tượng hiện có.
- Nếu bạn cần kiểm soát biến toàn cầu một cách nghiêm ngặt, bạn có thể sử dụng Singleton Pattern.  
  ⚡ Singleton Pattern khác biệt với biến toàn cầu, nó đảm bảo chỉ có một phiên bản của lớp tồn tại. Ngoài lớp Singleton, không có cách nào thay thế phiên bản được lưu trữ.

Lưu ý rằng bạn có thể điều chỉnh giới hạn và số lượng phiên bản Singleton bằng cách chỉnh sửa phương thức `getInstance` trong mã.

Ví dụ, một số trình quản lý tài nguyên thường được thiết kế theo Singleton Pattern.

Trong hệ thống máy tính, các tài nguyên cần quản lý bao gồm các tài nguyên bên ngoài phần mềm, ví dụ như mỗi máy tính có thể có nhiều máy in, nhưng chỉ có một Printer Spooler để tránh việc hai công việc in cùng lúc.

Mỗi máy tính có thể có nhiều cổng giao tiếp, hệ thống phải quản lý tập trung các cổng giao tiếp này để tránh một cổng giao tiếp bị gọi đồng thời bởi hai yêu cầu. Trình quản lý nhiệm vụ khó khăn để khởi động hai tác vụ giống nhau.

## Cấu trúc

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20231006145225.png)

1. Lớp **Singleton** khai báo một phương thức tĩnh `getInstance` để trả về một phiên bản duy nhất của lớp đó.
    - Hàm tạo của Singleton phải được ẩn đi để mã khách không thể sử dụng toán tử `new` để tạo đối tượng.

## Pseudocode

Trong ví dụ này, lớp kết nối cơ sở dữ liệu là một **Singleton**.

Lớp này không cung cấp hàm tạo công khai, vì vậy cách duy nhất để lấy đối tượng là thông qua phương thức `getInstance`. Phương thức này sẽ lưu trữ đối tượng được tạo lần đầu tiên và trả về nó cho tất cả các lần gọi sau đó.

```java
// Lớp cơ sở dữ liệu sẽ định nghĩa phương thức `getInstance` để cho phép mã khách
// truy cập vào cùng một phiên bản kết nối cơ sở dữ liệu ở khắp mọi nơi trong chương trình.
class Database is
    // Biến thành viên để lưu trữ phiên bản Singleton phải được khai báo là tĩnh.
    private static field instance: Database

    // Hàm tạo của Singleton phải luôn là riêng tư để ngăn mã khách gọi trực tiếp
    // hàm tạo bằng toán tử `new`.
    private constructor Database() is
        // Một số mã khởi tạo (ví dụ: kết nối thực tế đến máy chủ cơ sở dữ liệu).
        // ...

    // Phương thức tĩnh để kiểm soát quyền truy cập vào phiên bản Singleton.
    public static method getInstance() is
        if (Database.instance == null) then
            acquireThreadLock() and then
                // Đảm bảo không có luồng khác khởi tạo phiên bản trong khi luồng này đang chờ mở khóa.
                if (Database.instance == null) then
                    Database.instance = new Database()
        return Database.instance

    // Cuối cùng, Singleton phải định nghĩa một số logic kinh doanh có thể thực hiện trên phiên bản của nó.
    public method query(sql) is
        // Ví dụ: tất cả các yêu cầu truy vấn cơ sở dữ liệu của ứng dụng đều phải thông qua phương thức này. Bạn có thể thêm logic giới hạn tải hoặc đệm ở đây.
        // ...

class Application is
    method main() is
        Database foo = Database.getInstance()
        foo.query("SELECT ...")
        // ...
        Database bar = Database.getInstance()
        bar.query("SELECT ...")
        // Cả biến `bar` và `foo` đều chứa cùng một đối tượng.
```

## Ví dụ

**Ví dụ sử dụng:** Nhiều nhà phát triển xem mẫu Singleton là một anti-pattern. Do đó, tần suất sử dụng nó trong mã Java đang dần giảm.

Tuy nhiên, vẫn có một số ví dụ về Singleton trong thư viện lõi của Java:

- [`java.lang.Runtime#getRuntime()`](http://docs.oracle.com/javase/8/docs/api/java/lang/Runtime.html#getRuntime--)
- [`java.awt.Desktop#getDesktop()`](http://docs.oracle.com/javase/8/docs/api/java/awt/Desktop.html#getDesktop--)
- [`java.lang.System#getSecurityManager()`](http://docs.oracle.com/javase/8/docs/api/java/lang/System.html#getSecurityManager--)

**Cách nhận biết:** Singleton có thể được nhận biết thông qua phương thức tạo tĩnh trả về cùng một đối tượng được lưu trữ trong bộ nhớ cache.

### Lớp kết nối cơ sở dữ liệu

Lớp kết nối cơ sở dữ liệu là một ví dụ về **Singleton**.

Lớp này không cung cấp hàm tạo công khai, vì vậy cách duy nhất để lấy đối tượng là thông qua phương thức `getInstance`. Phương thức này sẽ lưu trữ đối tượng được tạo lần đầu tiên và trả về nó cho tất cả các lần gọi sau đó.

```java
// Lớp cơ sở dữ liệu định nghĩa phương thức `getInstance` để cho phép mã khách
// truy cập vào cùng một phiên bản kết nối cơ sở dữ liệu ở khắp mọi nơi trong chương trình.
class Database is
    // Biến thành viên để lưu trữ phiên bản Singleton phải được khai báo là tĩnh.
    private static field instance: Database

    // Hàm tạo của Singleton phải luôn là riêng tư để ngăn mã khách gọi trực tiếp
    // hàm tạo bằng toán tử `new`.
    private constructor Database() is
        // Một số mã khởi tạo (ví dụ: kết nối thực tế đến máy chủ cơ sở dữ liệu).
        // ...

    // Phương thức tĩnh để kiểm soát quyền truy cập vào phiên bản Singleton.
    public static method getInstance() is
        if (Database.instance == null) then
            acquireThreadLock() and then
                // Đảm bảo không có luồng khác khởi tạo phiên bản trong khi luồng này đang chờ mở khóa.
                if (Database.instance == null) then
                    Database.instance = new Database()
        return Database.instance

    // Cuối cùng, Singleton phải định nghĩa một số logic kinh doanh có thể thực hiện trên phiên bản của nó.
    public method query(sql) is
        // Ví dụ: tất cả các yêu cầu truy vấn cơ sở dữ liệu của ứng dụng đều phải thông qua phương thức này. Bạn có thể thêm logic giới hạn tải hoặc đệm ở đây.
        // ...

class Application is
    method main() is
        Database foo = Database.getInstance()
        foo.query("SELECT ...")
        // ...
        Database bar = Database.getInstance()
        bar.query("SELECT ...")
        // Cả biến `bar` và `foo` đều chứa cùng một đối tượng.
```

### Lazy Singleton (Singleton Lười)

Ý tưởng triển khai Lazy Singleton là: Lười không tìm kiếm, lười không muốn khởi tạo chính mình.

`instance` không được khởi tạo ban đầu, chỉ khi lần đầu tiên gọi `getInstance()` thì đối tượng mới được tạo.

**Nhược điểm**: Khi có hai luồng gọi `getInstance()` cùng một lúc và cả hai đều thực hiện đến dòng mã `if (null == instance)`, `instance` sẽ là `null`.

Tiếp tục thực thi, sẽ tạo ra hai đối tượng, vi phạm mục đích ban đầu của Singleton.

```java
public class LazySingleton {
    private LazySingleton() {
        System.out.println("Singleton()");
    }

    private static LazySingleton instance = null;

    public static LazySingleton getInstance() {
        if (null == instance) {
            instance = new LazySingleton();
        }
        return instance;
    }
}
```

### Double-Checked Locking (Kiểm tra khóa hai lần)

Nếu không muốn tạo ra chi phí khi không cần lấy đối tượng và không muốn gặp vấn đề an toàn luồng, có thể sử dụng kiểm tra khóa hai lần.

```java
public class SyncSingleton {
    private SyncSingleton() {
        System.out.println("Singleton()");
    }

    private static SyncSingleton instance = null;

    public static SyncSingleton getInstance() {
        if (null == instance) {
            synchronized(SyncSingleton.class) {
                if (null == instance) {
                    instance = new SyncSingleton();
                }
            }
        }
        return instance;
    }
}
```

> **Lưu ý: Tại sao lại có một lần kiểm tra `instance` trong khối đồng bộ?**
>
> Điều này là do nếu `instance` là `null` và hai luồng cùng gọi `getInstance()`, do cơ chế `synchronized`, chỉ cho phép một luồng đi vào, luồng còn lại phải chờ đợi.
>
> Trong trường hợp này, nếu không có lần kiểm tra `instance` thứ hai, có thể xảy ra tình huống luồng đầu tiên tạo một đối tượng và luồng thứ hai cũng tạo một đối tượng.

## Mối quan hệ với các mẫu thiết kế khác

- Lớp [[Facade Pattern]] thường có thể được chuyển đổi thành một lớp [[Singleton Pattern]], vì trong hầu hết các trường hợp, một đối tượng facade là đủ.
- Nếu bạn có thể giảm bớt tất cả các trạng thái chia sẻ của đối tượng thành một đối tượng flyweight, thì [[Flyweight Pattern]] và [[Singleton Pattern]] sẽ trở nên tương tự. Tuy nhiên, hai mẫu này có hai khác biệt cơ bản.
  1. Chỉ có một thực thể Singleton, trong khi lớp flyweight có thể có nhiều thực thể và có thể có trạng thái nội tại khác nhau.
  2. Đối tượng Singleton có thể thay đổi, trong khi đối tượng flyweight là không thay đổi.
- [[Abstract Factory Pattern]], [[Builder Pattern]] và [[Prototype Pattern]] đều có thể được triển khai bằng [[Singleton Pattern]].
