---
title: State Pattern
tags:
  - design-pattern
categories:
  - design-pattern
date created: 2023-10-06
date modified: 2023-10-06
---

## Ý nghĩa

**State Pattern** là một mẫu thiết kế hành vi, nó cho phép bạn thay đổi hành vi của một đối tượng khi trạng thái nội bộ của nó thay đổi. Nó giúp đảm bảo rằng đối tượng sẽ có hành vi chính xác tương ứng với trạng thái hiện tại của nó.

## Ứng dụng

- Sử dụng State Pattern khi bạn muốn thay đổi hành vi của một đối tượng dựa trên trạng thái nội bộ của nó.
- Sử dụng State Pattern khi có nhiều hành vi khác nhau liên quan đến một đối tượng và bạn muốn tránh việc sử dụng nhiều câu lệnh điều kiện trong mã của bạn.

## Cấu trúc

### Giải thích cấu trúc

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20231006213246.png)

1. **Context** (Ngữ cảnh) lưu giữ một tham chiếu đến một đối tượng trạng thái cụ thể và chuyển giao tất cả công việc liên quan đến trạng thái đó cho nó. Context tương tác với đối tượng trạng thái thông qua giao diện trạng thái và cung cấp một phương thức thiết lập để chuyển đối tượng trạng thái mới.
2. **State** (Trạng thái) giao diện khai báo các phương thức đặc thù cho trạng thái. Các phương thức này nên được hiểu bởi tất cả các đối tượng trạng thái cụ thể khác vì bạn không muốn có các phương thức mà một số trạng thái có mà không bao giờ được gọi.
3. **Concrete State** (Trạng thái cụ thể) tự triển khai các phương thức đặc thù cho trạng thái. Để tránh việc có mã tương tự trong nhiều trạng thái, bạn có thể cung cấp một lớp trung gian trừu tượng chứa một số hành vi chung.
    - Đối tượng trạng thái có thể lưu trữ một tham chiếu đến đối tượng ngữ cảnh. Trạng thái có thể sử dụng tham chiếu này để lấy thông tin cần thiết từ ngữ cảnh và kích hoạt chuyển đổi trạng thái.
4. Ngữ cảnh và trạng thái cụ thể đều có thể thiết lập trạng thái tiếp theo của ngữ cảnh và hoàn thành việc chuyển đổi trạng thái thực tế bằng cách thay thế đối tượng trạng thái được kết nối với ngữ cảnh.

### Mẫu mã cấu trúc

**State**: Định nghĩa một giao diện để đóng gói hành vi liên quan đến một trạng thái cụ thể của Context.

```java
abstract class State {
    public abstract void Handle(Context context);
}
```

**ConcreteState**: Mỗi lớp con triển khai một hành vi liên quan đến một trạng thái cụ thể của Context.

```java
class ConcreteStateA extends State {
    @Override
    public void Handle(Context context) {
        context.SetState(new ConcreteStateB());
    }
}

class ConcreteStateB extends State {
    @Override
    public void Handle(Context context) {
        context.SetState(new ConcreteStateA());
    }
}
```

**Context**: Duy trì một thể hiện của lớp con ConcreteState, thể hiện này xác định trạng thái hiện tại.

```java
class Context {
    private State state;
    public Context(State state) {
        this.state = state;
    }

    public void SetState(State state) {
        this.state = state;
        System.out.println("Trạng thái hiện tại: " + state.getClass().getName());
    }
    public State GetState() {
        return state;
    }

    public void Request() {
        state.Handle(this);
    }
}

```

Client

```java
public class StatePattern {
    public static void main(String[] args) {
        Context c = new Context(new ConcreteStateA());
        c.Request();
        c.Request();
    }
}
```

Output

```
Trạng thái hiện tại: ConcreteStateB
Trạng thái hiện tại: ConcreteStateA
```

## Pseudocode

Trong ví dụ này, mẫu **State** cho phép các thành phần trong trình phát đa phương tiện thực hiện các hành vi khác nhau dựa trên trạng thái phát hiện hiện tại.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210520175904.png)

Đối tượng chính của trình phát luôn được kết nối với một đối tượng trạng thái chịu trách nhiệm cho hầu hết công việc của trình phát. Một số hoạt động sẽ thay đổi đối tượng trạng thái hiện tại của trình phát, từ đó thay đổi phản ứng của trình phát đối với tương tác của người dùng.

```java
// Lớp AudioPlayer là ngữ cảnh. Nó cũng duy trì một tham chiếu đến một
// đối tượng trạng thái, đại diện cho trạng thái hiện tại của trình phát âm thanh.
class AudioPlayer is
    field state: State
    field UI, volume, playlist, currentSong

    constructor AudioPlayer() is
        this.state = new ReadyState(this)

        // Ngữ cảnh sẽ chuyển giao công việc xử lý đầu vào của người dùng cho đối tượng trạng thái.
        // Vì mỗi trạng thái xử lý đầu vào theo cách khác nhau, kết quả tự nhiên sẽ phụ thuộc vào trạng thái hiện tại.
        UI = new UserInterface()
        UI.lockButton.onClick(this.clickLock)
        UI.playButton.onClick(this.clickPlay)
        UI.nextButton.onClick(this.clickNext)
        UI.prevButton.onClick(this.clickPrevious)

    // Các đối tượng khác phải có thể chuyển đổi trạng thái hiện tại của trình phát âm thanh.
    method changeState(state: State) is
        this.state = state

    // Các phương thức UI sẽ chuyển giao công việc thực thi cho trạng thái hiện tại.
    method clickLock() is
        state.clickLock()
    method clickPlay() is
        state.clickPlay()
    method clickNext() is
        state.clickNext()
    method clickPrevious() is
        state.clickPrevious()

    // Trạng thái có thể gọi các dịch vụ của ngữ cảnh.
    method startPlayback() is
        // ...
    method stopPlayback() is
        // ...
    method nextSong() is
        // ...
    method previousSong() is
        // ...
    method fastForward(time) is
        // ...
    method rewind(time) is
        // ...


// Tất cả các lớp trạng thái cụ thể phải triển khai các phương thức được khai báo trong lớp trạng thái cơ bản và cung cấp một tham chiếu ngược đến đối tượng ngữ cảnh liên quan đến trạng thái.
abstract class State is
    protected field player: AudioPlayer

    // Ngữ cảnh sẽ chuyển đối chính nó cho hàm tạo trạng thái. Điều này giúp trạng thái lấy một số dữ liệu hữu ích từ ngữ cảnh khi cần thiết.
    constructor State(player) is
        this.player = player

    abstract method clickLock()
    abstract method clickPlay()
    abstract method clickNext()
    abstract method clickPrevious()


// Các lớp trạng thái cụ thể sẽ triển khai nhiều hành vi liên quan đến trạng thái hiện tại.
class LockedState extends State is

    // Khi bạn mở khóa trình phát đã bị khóa, nó có thể ở một trong hai trạng thái.
    method clickLock() is
        if (player.playing)
            player.changeState(new PlayingState(player))
        else
            player.changeState(new ReadyState(player))

    method clickPlay() is
        // Đã khóa, không làm gì.

    method clickNext() is
        // Đã khóa, không làm gì.

    method clickPrevious() is
        // Đã khóa, không làm gì.


// Các lớp trạng thái cụ thể cũng có thể kích hoạt chuyển đổi trạng thái trong ngữ cảnh.
class ReadyState extends State is
    method clickLock() is
        player.changeState(new LockedState(player))

    method clickPlay() is
        player.startPlayback()
        player.changeState(new PlayingState(player))

    method clickNext() is
        player.nextSong()

    method clickPrevious() is
        player.previousSong()


class PlayingState extends State is
    method clickLock() is
        player.changeState(new LockedState(player))

    method clickPlay() is
        player.stopPlayback()
        player.changeState(new ReadyState(player))

    method clickNext() is
        if (event.doubleclick)
            player.nextSong()
        else
            player.fastForward(5)

    method clickPrevious() is
        if (event.doubleclick)
            player.previous()
        else
            player.rewind(5)
```

## Ví dụ

**Ví dụ sử dụng:** Trong ngôn ngữ Java, **State Pattern** thường được sử dụng để chuyển đổi một máy trạng thái lớn dựa trên câu lệnh `switch` thành các đối tượng.

Dưới đây là một số ví dụ về State Pattern trong thư viện Java core:

- [`javax.faces.lifecycle.LifeCycle#execute()`](http://docs.oracle.com/javaee/7/api/javax/faces/lifecycle/Lifecycle.html#execute-javax.faces.context.FacesContext-) (được điều khiển bởi [Faces­Servlet](http://docs.oracle.com/javaee/7/api/javax/faces/webapp/FacesServlet.html): hành vi phụ thuộc vào giai đoạn (trạng thái) của vòng đời JSF hiện tại)

**Cách nhận biết:** State Pattern có thể được nhận biết bằng cách có các phương thức được điều khiển bởi bên ngoài và có thể thay đổi hành vi dựa trên trạng thái của đối tượng.

## Mối quan hệ với các mẫu khác

- [[Bridge Pattern]], [[State Pattern]] và [[Strategy Pattern]] (bao gồm một phần [[Adapter Pattern]]) có giao diện rất tương tự. Trên thực tế, chúng đều dựa trên [[Composite Pattern]] - tức là giao việc cho các đối tượng khác, nhưng mỗi mẫu giải quyết một vấn đề khác nhau. Mẫu không chỉ là công thức để tổ chức mã theo một cách cụ thể, bạn cũng có thể sử dụng chúng để thảo luận với các nhà phát triển khác về vấn đề mà mẫu giải quyết.
- [[State Pattern]] có thể được coi là mở rộng của [[Strategy Pattern]]. Cả hai đều dựa trên cơ chế kết hợp: chúng đều thay đổi hành vi của mình dựa trên ngữ cảnh khác nhau bằng cách giao việc cho các đối tượng "người trợ giúp". *Strategy* làm cho các đối tượng này hoàn toàn độc lập với nhau, chúng không biết sự tồn tại của các đối tượng khác. Nhưng mẫu *State* không giới hạn sự phụ thuộc giữa các trạng thái cụ thể và cho phép chúng tự thay đổi trạng thái của mình trong các ngữ cảnh khác nhau.
