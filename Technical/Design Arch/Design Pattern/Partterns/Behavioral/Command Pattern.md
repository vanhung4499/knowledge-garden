---
title: Command Pattern
tags:
  - design-pattern
categories:
  - design-pattern
date created: 2023-10-06
date modified: 2023-10-06
---

## Ý nghĩa

**Command Pattern** là một mẫu thiết kế hành vi, nó chuyển đổi một yêu cầu thành một đối tượng độc lập chứa tất cả thông tin liên quan đến yêu cầu. Quá trình chuyển đổi này cho phép bạn tham số hóa các phương thức, trì hoãn việc thực thi yêu cầu hoặc đưa yêu cầu vào hàng đợi, và cung cấp khả năng hoàn tác yêu cầu.

### Tương tác trong Command Pattern

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20200726110040.png)

- Client tạo một đối tượng ConcreteCommand và chỉ định đối tượng Receiver của nó.
- Một đối tượng Invoker nào đó lưu trữ đối tượng ConcreteCommand này.
- Invoker gửi yêu cầu bằng cách gọi phương thức Execute của đối tượng Command. Nếu lệnh này có thể hoàn tác, ConcreteCommand sẽ lưu trạng thái hiện tại trước khi thực hiện lệnh.
- Đối tượng ConcreteCommand thực hiện một số hoạt động trên Receiver của nó để thực hiện yêu cầu.

### Điểm chính của Command Pattern

- Bản chất của Command Pattern là đóng gói lệnh, tách trách nhiệm gửi lệnh và thực thi lệnh.
- Mỗi lệnh là một hoạt động: bên yêu cầu gửi yêu cầu, yêu cầu thực hiện một hoạt động; bên nhận yêu cầu nhận yêu cầu và thực hiện hoạt động.
- Command Pattern cho phép bên yêu cầu và bên nhận yêu cầu hoạt động độc lập, không cần biết về giao diện của bên nhận, cũng không cần biết cách yêu cầu được nhận và hoạt động có được thực hiện, khi nào được thực hiện và cách thức thực hiện.
- Command Pattern biến yêu cầu thành một đối tượng, đối tượng này có thể được lưu trữ và truyền như bất kỳ đối tượng nào khác.
- Điểm quan trọng của Command Pattern là giới thiệu một giao diện lệnh trừu tượng và lập trình bên gửi yêu cầu chỉ dựa trên giao diện lệnh trừu tượng này, chỉ có các lệnh cụ thể đã triển khai giao diện lệnh trừu tượng mới có thể liên quan đến bên nhận.

## Các trường hợp sử dụng

- Nếu bạn cần tham số hóa đối tượng bằng cách sử dụng hoạt động, bạn có thể sử dụng Command Pattern.
- Nếu bạn muốn đưa hoạt động vào hàng đợi, thực hiện hoạt động từ xa hoặc thực hiện hoạt động từ xa, bạn có thể sử dụng Command Pattern.
- Nếu bạn muốn triển khai chức năng hoàn tác, bạn có thể sử dụng Command Pattern.

## Cấu trúc

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210519150619.png)

### Giải thích cấu trúc

1. **Người gửi** (Sender) - còn được gọi là "Invoker" - lớp chịu trách nhiệm khởi tạo yêu cầu, trong đó phải chứa một biến thành viên để lưu trữ tham chiếu đến đối tượng lệnh. Người gửi kích hoạt lệnh mà không gửi yêu cầu trực tiếp đến người nhận. Lưu ý rằng người gửi không chịu trách nhiệm tạo đối tượng lệnh: thường là thông qua hàm tạo, người gửi nhận được đối tượng lệnh được tạo trước đó từ khách hàng.
2. **Lệnh** (Command) - giao diện thường chỉ khai báo một phương thức để thực hiện lệnh.
3. **Lệnh cụ thể** (Concrete Commands) - triển khai các loại yêu cầu khác nhau. Lệnh cụ thể không thực hiện công việc mà nó được ủy quyền cho một đối tượng logic kinh doanh. Tuy nhiên, để đơn giản hóa mã, các lớp này có thể được kết hợp.

   Các tham số cần thiết cho phương thức thực thi của đối tượng nhận có thể được khai báo là các biến thành viên của lệnh cụ thể. Bạn có thể làm cho đối tượng lệnh trở thành không thay đổi và chỉ cho phép khởi tạo các biến thành viên này thông qua hàm tạo.

4. **Người nhận** (Receiver) - lớp chứa một số logic kinh doanh. Hầu hết các lệnh chỉ xử lý các chi tiết về cách chuyển giao yêu cầu cho người nhận, người nhận sẽ thực hiện công việc thực tế.
5. **Khách hàng** (Client) - tạo và cấu hình các đối tượng lệnh cụ thể. Khách hàng phải chuyển tất cả các tham số yêu cầu, bao gồm cả thực thể người nhận, cho hàm tạo của lệnh. Sau đó, lệnh được tạo ra có thể được liên kết với một hoặc nhiều người gửi.

### Mẫu code

**Command**: Được sử dụng để khai báo một giao diện thực hiện hành động.

```java
abstract class Command {
    protected Receiver receiver;
    public Command(Receiver receiver) {
        this.receiver = receiver;
    }

    public abstract void Execute();
}
```

**ConcreteCommand**: Liên kết một đối tượng Receiver với một hành động, gọi phương thức tương ứng của Receiver để thực hiện Execute.

```java
class ConcreteCommand extends Command {
    public ConcreteCommand(Receiver receiver) {
        super(receiver);
    }

    @Override
    public void Execute() {
        receiver.Action();
    }
}
```

**Invoker**: Yêu cầu lệnh thực hiện yêu cầu này.

```java
class Invoker {
    private Command command;

    public Invoker(Command command) {
        this.command = command;
    }

    public void ExecuteCommand() {
        command.Execute();
    }
}
```

**Receiver**: Biết cách thực hiện và thực hiện hành động liên quan đến yêu cầu, bất kỳ lớp nào cũng có thể là một Receiver.

```java
class Receiver {
    public void Action() {
        System.out.println("Thực hiện yêu cầu");
    }
}
```

**Client**: Tạo một đối tượng ConcreteCommand và thiết lập Receiver của nó.

```java
public class CommandPattern {
    public static void main(String[] args) {
        Receiver receiver = new Receiver();
        Command cmd = new ConcreteCommand(receiver);
        Invoker invoker = new Invoker(cmd);
        invoker.ExecuteCommand();
    }
}
```

## Pseudocode

Trong ví dụ này, một mẫu **Command** sẽ ghi lại lịch sử các hoạt động đã thực hiện để hoàn tác hoạt động khi cần thiết.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20231006195258.png)

Một số lệnh sẽ thay đổi trạng thái của trình soạn thảo (ví dụ: cắt và dán), chúng có thể sao lưu trạng thái của trình soạn thảo trước khi thực hiện các hoạt động liên quan. Sau khi thực hiện lệnh, nó sẽ được đưa vào lịch sử lệnh (ngăn xếp đối tượng lệnh). Sau đó, nếu người dùng cần hoàn tác hoạt động, chương trình có thể lấy lệnh gần nhất từ lịch sử, đọc sao lưu trạng thái trình soạn thảo tương ứng và khôi phục.

Mã khách hàng (gồm các phần tử GUI và lịch sử lệnh) không phụ thuộc vào các lớp lệnh cụ thể, vì nó sử dụng lệnh thông qua giao diện lệnh. Điều này cho phép bạn thêm lệnh mới vào chương trình mà không cần sửa đổi mã hiện có.

```java
// Lớp cơ bản của lệnh định nghĩa giao diện chung cho tất cả các lệnh cụ thể.
abstract class Command is
    protected field app: Application
    protected field editor: Editor
    protected field backup: text

    constructor Command(app: Application, editor: Editor) is
        this.app = app
        this.editor = editor

    // Sao lưu trạng thái của trình soạn thảo.
    method saveBackup() is
        backup = editor.text

    // Khôi phục trạng thái của trình soạn thảo.
    method undo() is
        editor.text = backup

    // Phương thức thực thi được khai báo là trừu tượng để buộc tất cả các lệnh cụ thể cung cấp cài đặt riêng của chúng. Phương thức này phải trả về true hoặc false tùy thuộc vào việc lệnh có thay đổi trạng thái của trình soạn thảo hay không.
    abstract method execute()


// Đây là các lệnh cụ thể.
class CopyCommand extends Command is
    // Lệnh sao chép không được lưu trong lịch sử vì nó không thay đổi trạng thái của trình soạn thảo.
    method execute() is
        app.clipboard = editor.getSelection()
        return false

class CutCommand extends Command is
    // Lệnh cắt thay đổi trạng thái của trình soạn thảo, vì vậy nó phải được lưu trong lịch sử. Nếu phương thức trả về true, nó sẽ được lưu.
    method execute() is
        saveBackup()
        app.clipboard = editor.getSelection()
        editor.deleteSelection()
        return true

class PasteCommand extends Command is
    method execute() is
        saveBackup()
        editor.replaceSelection(app.clipboard)
        return true

// Lệnh hoàn tác cũng là một lệnh.
class UndoCommand extends Command is
    method execute() is
        app.undo()
        return false


// Lịch sử lệnh toàn cục là một ngăn xếp.
class CommandHistory is
    private field history: array of Command

    // Thêm lệnh vào cuối mảng lịch sử.
    method push(c: Command) is
        // ...

    // Lấy lệnh gần nhất từ lịch sử.
    method pop():Command is
        // ...


// Lớp trình soạn thảo chứa các hoạt động chỉnh sửa văn bản thực tế. Nó đóng vai trò của người nhận: cuối cùng, tất cả các lệnh sẽ chuyển công việc thực hiện cho các phương thức của trình soạn thảo.
class Editor is
    field text: string

    method getSelection() is
        // Trả về văn bản được chọn.

    method deleteSelection() is
        // Xóa văn bản được chọn.

    method replaceSelection(text) is
        // Chèn nội dung từ clipboard vào vị trí hiện tại.


// Lớp ứng dụng thiết lập các mối quan hệ giữa các đối tượng. Nó đóng vai trò của người gửi: khi cần hoàn thành một số công việc, nó sẽ tạo và thực thi một đối tượng lệnh.
class Application is
    field clipboard: string
    field editors: array of Editors
    field activeEditor: Editor
    field history: CommandHistory

    // Mã phân phối lệnh cho các đối tượng UI có thể như sau.
    method createUI() is
        // ...
        copy = function() { executeCommand(
            new CopyCommand(this, activeEditor)) }
        copyButton.setCommand(copy)
        shortcuts.onKeyPress("Ctrl+C", copy)

        cut = function() { executeCommand(
            new CutCommand(this, activeEditor)) }
        cutButton.setCommand(cut)
        shortcuts.onKeyPress("Ctrl+X", cut)

        paste = function() { executeCommand(
            new PasteCommand(this, activeEditor)) }
        pasteButton.setCommand(paste)
        shortcuts.onKeyPress("Ctrl+V", paste)

        undo = function() { executeCommand(
            new UndoCommand(this, activeEditor)) }
        undoButton.setCommand(undo)
        shortcuts.onKeyPress("Ctrl+Z", undo)

    // Thực thi một lệnh và kiểm tra xem có cần thêm vào lịch sử lệnh hay không.
    method executeCommand(command) is
        if (command.execute)
            history.push(command)

    // Lấy lệnh gần nhất từ lịch sử lệnh và chạy phương thức undo (hoàn tác) của nó. Lưu ý rằng bạn không biết lớp mà lệnh thuộc về. Nhưng chúng ta không cần biết vì lệnh tự biết cách hoàn tác hành động của nó.
    method undo() is
        command = history.pop()
        if (command != null)
            command.undo()
```

## Ví dụ

**Sử dụng ví dụ**: Mẫu Command rất phổ biến trong mã Java. Trong hầu hết các trường hợp, nó được sử dụng để thay thế các hàm gọi lại của các yếu tố giao diện người dùng được tham số hóa bằng hành vi. Ngoài ra, nó cũng được sử dụng để sắp xếp nhiệm vụ và ghi lại lịch sử hoạt động.

Dưới đây là một số ví dụ trong thư viện Java cốt lõi:

- Tất cả các triển khai của [`java.lang.Runnable`](http://docs.oracle.com/javase/8/docs/api/java/lang/Runnable.html)
- Tất cả các triển khai của [`javax.swing.Action`](http://docs.oracle.com/javase/8/docs/api/javax/swing/Action.html)

**Cách nhận biết**: Mẫu Command có thể được nhận biết thông qua phương thức hành vi trong kiểu trừu tượng hoặc giao diện (người gửi), mà gọi một phương thức khác trong kiểu trừu tượng hoặc giao diện khác (người nhận) được thực hiện bởi một triển khai của mẫu Command khi nó được tạo ra. Lớp Command thường chỉ giới hạn trong một số hành vi đặc biệt.

## Mối quan hệ với các mẫu khác

- [[Chain of Responsibility Pattern]], [[Command Pattern]], [[Mediator Pattern]] và [[Observer Pattern]] được sử dụng để xử lý các kết nối khác nhau giữa người gửi yêu cầu và người nhận:
  - [[Chain of Responsibility Pattern]] chuyển tiếp yêu cầu động cho một chuỗi các người nhận tiềm năng cho đến khi một trong số họ xử lý yêu cầu.
  - [[Command Pattern]] thiết lập một kết nối một chiều giữa người gửi và người nhận yêu cầu.
  - [[Mediator Pattern]] loại bỏ kết nối trực tiếp giữa người gửi và người nhận, buộc chúng phải giao tiếp gián tiếp thông qua một đối tượng trung gian.
  - [[Observer Pattern]] cho phép người nhận đăng ký hoặc hủy đăng ký động để nhận yêu cầu.
- [[Chain of Responsibility Pattern]] có thể được triển khai bằng cách sử dụng [[Command Pattern]]. Trong trường hợp này, bạn có thể thực hiện nhiều hành động khác nhau trên cùng một đối tượng ngữ cảnh được đại diện bởi yêu cầu.  
  Cách triển khai khác là khi chính yêu cầu là một đối tượng *Command*. Trong trường hợp này, bạn có thể thực hiện cùng một hành động trên một chuỗi các kết nối ngữ cảnh khác nhau.
- Bạn có thể sử dụng [[Command Pattern]] và [[Memento Pattern]] cùng nhau để triển khai tính năng "Hoàn tác". Trong trường hợp này, *Command* được sử dụng để thực hiện các hoạt động trên đối tượng mục tiêu, và *Memento* được sử dụng để lưu trạng thái của đối tượng trước khi thực hiện lệnh.
- [[Command Pattern]] và [[Strategy Pattern]] có vẻ giống nhau vì cả hai đều cho phép đối tượng được tham số hóa bằng cách sử dụng hành vi. Tuy nhiên, ý định của chúng rất khác nhau.
  - Bạn có thể sử dụng *Command* để chuyển đổi bất kỳ hoạt động nào thành một đối tượng. Các tham số của hoạt động sẽ trở thành các biến thành viên của đối tượng. Bạn có thể trì hoãn việc thực hiện hoạt động, đặt hoạt động vào hàng đợi, lưu trữ lịch sử lệnh hoặc gửi lệnh đến dịch vụ từ xa và nhiều hơn nữa.
  - Trong khi đó, *Strategy* thường được sử dụng để mô tả các cách khác nhau để thực hiện một công việc, cho phép bạn chuyển đổi giữa các thuật toán trong cùng một lớp ngữ cảnh.
- [[Prototype Pattern]] có thể được sử dụng để lưu trữ lịch sử lệnh của *Command*.
- Bạn có thể coi [[Visitor Pattern]] là một phiên bản nâng cao của [[Command Pattern]], trong đó đối tượng có thể thực hiện các hoạt động trên nhiều đối tượng khác nhau của các lớp khác nhau.
