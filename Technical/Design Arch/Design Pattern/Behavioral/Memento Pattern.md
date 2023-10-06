---
title: Memento Pattern
tags:
  - design-pattern
categories:
  - design-pattern
date created: 2023-10-06
date modified: 2023-10-06
---

## Ý nghĩa

**Memento Pattern** là một mẫu thiết kế hành vi, cho phép lưu và khôi phục trạng thái trước đó của đối tượng mà không tiết lộ chi tiết cài đặt của đối tượng.

## Các trường hợp sử dụng

- Khi bạn cần tạo bản sao trạng thái của đối tượng để khôi phục trạng thái trước đó.
- Khi truy cập trực tiếp vào biến thành viên, truy cập getter hoặc setter của đối tượng sẽ phá vỡ tính đóng gói, bạn có thể sử dụng Memento Pattern.

## Cấu trúc

### Mô tả cấu trúc

#### Cài đặt dựa trên lớp lồng nhau

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210520172952.png)

1. **Người khởi tạo** (Originator) có thể tạo ra bản sao trạng thái của chính nó và khôi phục trạng thái từ bản sao.
2. **Bản ghi nhớ** (Memento) là một đối tượng giá trị (value object) lưu trạng thái của nguyên tố. Thông thường, một cách tiếp cận là làm cho Memento không thể thay đổi và truyền dữ liệu thông qua constructor.
3. **Người chăm sóc** (Caretaker) chỉ biết "khi nào" và "tại sao" lưu trạng thái của nguyên tố và khi nào khôi phục trạng thái.  
   Người chăm sóc ghi lại lịch sử trạng thái của nguyên tố bằng cách lưu trữ Memento trong một ngăn xếp. Khi nguyên tố cần quay lại trạng thái trước đó, người chăm sóc sẽ lấy Memento trên cùng của ngăn xếp và truyền nó cho phương thức khôi phục của nguyên tố.
4. Trong cách triển khai này, lớp Memento được lồng vào trong nguyên tố. Điều này cho phép nguyên tố truy cập biến thành viên và phương thức của Memento, ngay cả khi chúng được khai báo là riêng tư. Tuy nhiên, người chăm sóc chỉ có quyền truy cập hạn chế đến biến thành viên và phương thức của Memento: chỉ có thể lưu trữ Memento trong ngăn xếp, không thể thay đổi trạng thái của nó.

#### Cài đặt dựa trên giao diện trung gian

Phương pháp triển khai khác phù hợp với các ngôn ngữ lập trình không hỗ trợ lớp lồng nhau (ví dụ: PHP).

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210520173029.png)

1. Trong trường hợp không có lớp lồng nhau, bạn có thể quy định người chăm sóc chỉ có thể tương tác với Memento thông qua giao diện trung gian được khai báo rõ ràng, giao diện chỉ khai báo các phương thức liên quan đến dữ liệu siêu dữ liệu của Memento, giới hạn quyền truy cập trực tiếp vào biến thành viên của Memento.
2. Ngược lại, nguyên tố có thể tương tác trực tiếp với đối tượng Memento, truy cập biến thành viên và phương thức được khai báo trong lớp Memento. Nhược điểm của phương pháp này là bạn cần khai báo tất cả các biến thành viên của Memento là công khai.

#### Cài đặt nghiêm ngặt hơn

Nếu bạn không muốn cho phép bất kỳ lớp nào khác có cơ hội truy cập vào trạng thái của nguyên tố thông qua Memento, còn một cách triển khai khác có sẵn.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210520173117.png)

1. Cách triển khai này cho phép tồn tại nhiều loại nguyên tố và Memento khác nhau. Mỗi nguyên tố sẽ tương tác với lớp Memento tương ứng của nó. Nguyên tố và Memento đều không tiết lộ trạng thái của chúng cho các lớp khác.
2. Người chăm sóc bị cấm sửa đổi trạng thái được lưu trữ trong Memento. Tuy nhiên, lớp người chăm sóc sẽ độc lập với nguyên tố vì phương thức khôi phục được định nghĩa trong lớp Memento.
3. Mỗi Memento sẽ được kết nối với nguyên tố đã tạo ra nó. Nguyên tố sẽ chuyển đối tượng và trạng thái của chính nó cho constructor của Memento. Vì các lớp này có mối quan hệ chặt chẽ với nhau, chỉ cần nguyên tố định nghĩa các setter thích hợp, Memento có thể khôi phục trạng thái của nó.

### Mẫu code cấu trúc

**Memento**: Đảm nhận việc lưu trữ trạng thái nội bộ của đối tượng Originator và ngăn chặn các đối tượng khác ngoài Originator truy cập vào Memento.

Memento có hai giao diện, Caretaker chỉ có thể nhìn thấy giao diện hẹp của Memento và chỉ có thể chuyển Memento cho các đối tượng khác.  
Originator có thể nhìn thấy một giao diện rộng, cho phép nó truy cập vào tất cả dữ liệu cần thiết để trở lại trạng thái trước đó.

```java
class Memento {
    private String state;
    public Memento(String state) {
        this.state = state;
    }

    public String GetState() {
        return state;
    }
}
```

**Originator**: Đảm nhận việc tạo ra một Memento để ghi lại trạng thái nội bộ hiện tại của nó và có thể sử dụng Memento để khôi phục trạng thái nội bộ.

Originator có thể quyết định Memento lưu trữ những trạng thái nội bộ nào của Originator theo nhu cầu.

```java
class Originator {
    private String state;

    public void SetState(String state) {
        this.state = state;
    }
    public String GetState() {
        return state;
    }

    public Memento CreateMemento() {
        return (new Memento(state));
    }

    public void SetMemento(Memento memento) {
        state = memento.GetState();
    }

    public void Show() {
        System.out.println("State = " + state);
    }
}
```

**Caretaker**: Đảm nhận việc lưu trữ Memento tốt, không thể thực hiện hoặc kiểm tra nội dung của Memento.

```java
class Caretaker {
    private Memento memento;

    public void SetMemento(Memento memento) {
        this.memento = memento;
    }
    public Memento GetMemento() {
        return memento;
    }
}
```

Client

```java
public class MementoPattern {
    public static void main(String[] args) {
        Originator o = new Originator();
        o.SetState("ON");
        o.Show();

        Caretaker c = new Caretaker();
        c.SetMemento(o.CreateMemento());

        o.SetState("OFF");
        o.Show();

        o.SetMemento(c.GetMemento());
        o.Show();
    }
}
```

Output

```
State = ON
State = OFF
State = ON
```

## Pseudocode

Trong ví dụ này, kết hợp mẫu thiết kế Command và Memento để lưu trạng thái của một trình chỉnh sửa văn bản phức tạp và khôi phục trạng thái trước đó khi cần.

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20231006210505.png)

Đối tượng Command sẽ đóng vai trò là người quản lý và sẽ lấy bản ghi Memento của trình chỉnh sửa trước khi thực hiện các hoạt động liên quan đến lệnh. Khi người dùng cố gắng hoàn tác lệnh gần nhất, trình chỉnh sửa có thể sử dụng Memento đã lưu trong lệnh để quay trở lại trạng thái trước đó.

Lớp Memento không khai báo bất kỳ biến thành viên công khai, getter hoặc setter nào, do đó không có đối tượng nào có thể thay đổi nội dung của nó. Memento được kết nối với trình chỉnh sửa cụ thể mà nó tạo ra, cho phép Memento truyền dữ liệu thông qua setter của đối tượng trình chỉnh sửa để khôi phục trạng thái của nó. Vì Memento được kết nối với đối tượng trình chỉnh sửa cụ thể, chương trình có thể hỗ trợ nhiều cửa sổ chỉnh sửa độc lập bằng cách sử dụng một ngăn xếp hoàn tác trung tâm.

```java
// Trình chỉnh sửa chứa một số dữ liệu quan trọng có thể thay đổi theo thời gian. 
// Nó cũng xác định phương thức để lưu trạng thái của chính nó trong Memento 
// và phục hồi trạng thái từ Memento.
class Editor is
    private field text, curX, curY, selectionWidth

    method setText(text) is
        this.text = text

    method setCursor(x, y) is
        this.curX = curX
        this.curY = curY

    method setSelectionWidth(width) is
        this.selectionWidth = width

    // Lưu trạng thái hiện tại vào Memento.
    method createSnapshot(): Snapshot is
        // Memento là một đối tượng không thể thay đổi, 
        // vì vậy trình chỉnh sửa sẽ truyền trạng thái của chính nó 
        // như là đối số cho hàm tạo của Memento.
        return new Snapshot(this, text, curX, curY, selectionWidth)

// Lớp Memento lưu trữ trạng thái trước đó của trình chỉnh sửa.
class Snapshot is
    private field editor: Editor
    private field text, curX, curY, selectionWidth

    constructor Snapshot(editor, text, curX, curY, selectionWidth) is
        this.editor = editor
        this.text = text
        this.curX = curX
        this.curY = curY
        this.selectionWidth = selectionWidth

    // Tại một thời điểm nào đó, trạng thái trước đó của trình chỉnh sửa 
    // có thể được khôi phục bằng cách sử dụng đối tượng Memento.
    method restore() is
        editor.setText(text)
        editor.setCursor(curX, curY)
        editor.setSelectionWidth(selectionWidth)

// Đối tượng Command có thể là người quản lý. Trong trường hợp này, 
// lệnh sẽ lấy Memento của trình chỉnh sửa trước khi sửa đổi trạng thái của nó. 
// Khi cần hoàn tác, nó sẽ khôi phục trạng thái của trình chỉnh sửa từ Memento.
class Command is
    private field backup: Snapshot

    method makeBackup() is
        backup = editor.createSnapshot()

    method undo() is
        if (backup != null)
            backup.restore()
    // ...
```

## Mối quan hệ với các mẫu thiết kế khác

- Bạn có thể sử dụng cả [[Command Pattern]] và [[Memento Pattern]] để triển khai chức năng "Hoàn tác". Trong trường hợp này, lệnh được sử dụng để thực hiện các hoạt động khác nhau trên đối tượng mục tiêu, và nhớ lưu được sử dụng để lưu trạng thái của đối tượng trước khi thay đổi.
- Bạn có thể sử dụng cả [[Memento Pattern]] và [[Iterator Pattern]] để lưu trạng thái của trình lặp hiện tại và quay lại trạng thái trước đó khi cần thiết.
- Đôi khi [[Prototype Pattern]] có thể được sử dụng như một phiên bản đơn giản hóa của [[Memento Pattern]], với điều kiện rằng trạng thái của đối tượng cần lưu trong lịch sử là đơn giản và không cần liên kết với các tài nguyên bên ngoài hoặc liên kết có thể được tái tạo một cách dễ dàng.

## Ví dụ

**Ví dụ sử dụng:** Nguyên tắc cơ bản của mẫu nhớ lưu có thể được thực hiện thông qua việc tuân thủ quy tắc serialization, điều này rất phổ biến trong ngôn ngữ Java. Mặc dù mẫu nhớ lưu không phải là phương pháp duy nhất hoặc hiệu quả nhất để tạo bản sao trạng thái của đối tượng, nhưng nó có thể lưu một bản sao dự phòng của trạng thái đối tượng mà không tiết lộ cấu trúc gốc của đối tượng cho các đối tượng khác.

Dưới đây là một số ví dụ trong thư viện chính của Java:

- Tất cả các lớp triển khai [`java.io.Serializable`](http://docs.oracle.com/javase/8/docs/api/java/io/Serializable.html) có thể được coi là một mẫu nhớ lưu.
- Tất cả các lớp triển khai [`javax.faces.component.StateHolder`](http://docs.oracle.com/javaee/7/api/javax/faces/component/StateHolder.html).
