---
title: Iterator Pattern
tags:
  - design-pattern
categories:
  - design-pattern
date created: 2023-10-06
date modified: 2023-10-06
---

## Mục đích

**Iterator Pattern** là một mẫu thiết kế hành vi, cho phép bạn duyệt qua tất cả các phần tử trong một tập hợp mà không cần tiết lộ cấu trúc dữ liệu nền của tập hợp (như danh sách, ngăn xếp và cây).

## Điều kiện áp dụng

- Khi cấu trúc dữ liệu phía sau tập hợp là phức tạp và bạn muốn ẩn đi sự phức tạp đó khỏi khách hàng (vì sự tiện lợi hoặc vấn đề bảo mật), bạn có thể sử dụng Iterator Pattern.
- Sử dụng mẫu này có thể giảm số lượng mã lặp lại trong chương trình.
- Nếu bạn muốn mã của bạn có thể duyệt qua các cấu trúc dữ liệu khác nhau, thậm chí là các cấu trúc dữ liệu không thể dự đoán trước, bạn có thể sử dụng Iterator Pattern.

## Cấu trúc

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210519153411.png)

### Giải thích cấu trúc

1. **Iterator** (Iterator) là một giao diện khai báo các hoạt động cần thiết để duyệt qua tập hợp: lấy phần tử tiếp theo, lấy vị trí hiện tại và bắt đầu lại việc duyệt.
2. **ConcreteIterator** (Concrete Iterators) triển khai một thuật toán cụ thể để duyệt qua tập hợp. Đối tượng Iterator phải theo dõi tiến trình duyệt của nó. Điều này cho phép nhiều Iterator có thể duyệt qua cùng một tập hợp mà không ảnh hưởng lẫn nhau.
3. **Collection** (Collection) là một giao diện khai báo một hoặc nhiều phương thức để lấy Iterator tương thích với tập hợp. Lưu ý rằng kiểu trả về của phương thức phải được khai báo là giao diện Iterator, do đó Collection cụ thể có thể trả về nhiều loại Iterator khác nhau.
4. **ConcreteCollection** (Concrete Collections) trả về một phiên bản cụ thể của ConcreteIterator khi được yêu cầu bởi khách hàng. Bạn có thể tự hỏi, phần còn lại của mã của Collection ở đâu? Đừng lo lắng, nó cũng nằm trong cùng một lớp. Chỉ là các chi tiết này không quan trọng đối với mẫu thực tế, vì vậy chúng tôi đã bỏ qua nó.
5. **Client** (Client) tương tác với Collection và Iterator thông qua giao diện của chúng. Điều này cho phép khách hàng không cần phụ thuộc vào các lớp cụ thể, cho phép cùng mã khách hàng có thể sử dụng nhiều loại Collection và Iterator khác nhau.
   - Thông thường, khách hàng không tự tạo Iterator mà lấy nó từ Collection. Tuy nhiên, trong một số trường hợp cụ thể, khách hàng có thể tạo một Iterator trực tiếp (ví dụ: khi khách hàng cần tạo một Iterator đặc biệt).

### Mã mẫu cấu trúc

**Iterator**: Định nghĩa giao diện truy cập các phần tử.

```java
interface Iterator {
    public Object first();
    public Object next();
    public boolean isDone();
    public Object currentItem();
}
```

**ConcreteIterator**: Triển khai giao diện Iterator. Ghi nhớ vị trí hiện tại của phần tử trong tập hợp.

```java
class ConcreteIterator implements Iterator {
    private int current = 0;
    private ConcreteAggregate aggregate;

    public ConcreteIterator(ConcreteAggregate aggregate) {
        this.aggregate = aggregate;
    }

    @Override
    public Object first() {
        return aggregate.get(0);
    }

    @Override
    public Object next() {
        current++;
        if (current < aggregate.size()) {
            return aggregate.get(current);
        }
        return null;
    }

    @Override
    public boolean isDone() {
        return (current >= aggregate.size()) ? true : false;
    }

    @Override
    public Object currentItem() {
        return aggregate.get(current);
    }
}
```

**Aggregate**: Định nghĩa giao diện để tạo đối tượng Iterator.

```java
interface Aggregate {
    public Iterator CreateIterator();
}
```

**ConcreteAggregate**: Triển khai giao diện Iterator, trả về một phiên bản cụ thể của ConcreteIterator.

```java
class ConcreteAggregate implements Aggregate {
    private List<Object> items = new ArrayList<Object>();

    @Override
    public Iterator CreateIterator() {
        return new ConcreteIterator(this);
    }

    public int size() {
        return items.size();
    }

    public Object get(int index) {
        return items.get(index);
    }

    public void set(int index, Object element) {
        items.set(index, element);
    }

    public void add(Object element) {
        items.add(element);
    }
}
```

**Khách hàng**

```java
public class IteratorPattern {
    public static void main(String[] args) {
        ConcreteAggregate aggregate = new ConcreteAggregate();
        aggregate.add("AA");
        aggregate.add("BB");
        aggregate.add("CC");
        aggregate.add("DD");

        Iterator iter = new ConcreteIterator(aggregate);
        Object item = iter.first();
        System.out.println("Người đầu tiên là: " + item);
        System.out.println("Danh sách tất cả mọi người:");
        while (!iter.isDone()) {
            System.out.println(iter.currentItem());
            iter.next();
        }
    }
}
```

**Kết quả**

```
Người đầu tiên là: AA
Danh sách tất cả mọi người:
AA
BB
CC
DD
```

## Pseudo code

Trong ví dụ này, mẫu **Iterator** được sử dụng để lặp qua một tập hợp đặc biệt chứa chức năng truy cập vào quan hệ bạn bè trên WeChat. Tập hợp này cung cấp nhiều Iterator khác nhau để lặp qua thông tin hồ sơ.

![img](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20210519153656.png)

Iterator "friends" được sử dụng để lặp qua danh sách bạn bè của một hồ sơ cụ thể. Iterator "colleagues" cũng cung cấp chức năng tương tự, nhưng chỉ bao gồm những người bạn làm việc cùng trong cùng một công ty với người dùng mục tiêu. Cả hai Iterator này đều triển khai cùng một giao diện chung, cho phép khách hàng truy cập vào hồ sơ mà không cần biết chi tiết về xác thực và gửi yêu cầu REST.

Khách hàng chỉ tương tác với tập hợp và Iterator thông qua giao diện, do đó không có sự ràng buộc với các lớp cụ thể. Nếu bạn quyết định kết nối ứng dụng với mạng xã hội hoàn toàn mới, bạn chỉ cần cung cấp các lớp tập hợp và Iterator mới mà không cần sửa đổi mã hiện có.

```java
// Giao diện tập hợp phải khai báo một phương thức tạo Iterator. Nếu chương trình
// có nhiều loại Iterator, bạn cũng có thể khai báo nhiều phương thức.
interface SocialNetwork is
    method createFriendsIterator(profileId): ProfileIterator
    method createCoworkersIterator(profileId): ProfileIterator


// Mỗi lớp tập hợp cụ thể được liên kết với một tập hợp cụ thể của Iterator mà nó
// trả về. Tuy nhiên, khách hàng không phải như vậy, vì các phương thức này sẽ trả
// về giao diện Iterator.
class WeChat implements SocialNetwork is
    // ...Nhiều mã tập hợp nằm ở đây...

    // Mã tạo Iterator.
    method createFriendsIterator(profileId) is
        return new WeChatIterator(this, profileId, "friends")
    method createCoworkersIterator(profileId) is
        return new WeChatIterator(this, profileId, "coworkers")


// Giao diện chung cho tất cả các Iterator.
interface ProfileIterator is
    method getNext(): Profile
    method hasMore(): bool


// Lớp cụ thể của Iterator.
class WeChatIterator implements ProfileIterator is
    // Iterator cần một tham chiếu đến tập hợp mà nó lặp qua.
    private field weChat: WeChat
    private field profileId, type: string

    // Đối tượng Iterator sẽ lặp qua tập hợp độc lập với các Iterator khác. Do đó,
    // nó phải giữ trạng thái của Iterator.
    private field currentPosition
    private field cache: array of Profile

    constructor WeChatIterator(weChat, profileId, type) is
        this.weChat = weChat
        this.profileId = profileId
        this.type = type

    private method lazyInit() is
        if (cache == null)
            cache = weChat.socialGraphRequest(profileId, type)

    // Mỗi lớp Iterator cụ thể sẽ triển khai giao diện Iterator chung.
    method getNext() is
        if (hasMore())
            currentPosition++
            return cache[currentPosition]

    method hasMore() is
        lazyInit()
        return currentPosition < cache.length


// Đây là một chiêu hay khác: bạn có thể chuyển Iterator cho lớp khách hàng mà không
// cần cung cấp quyền truy cập vào toàn bộ tập hợp. Điều này giúp bạn không phải
// tiết lộ tập hợp cho khách hàng.
//
// Một lợi ích khác là bạn có thể chuyển các Iterator khác nhau cho khách hàng tại
// thời điểm chạy, từ đó thay đổi cách khách hàng tương tác với tập hợp. Phương
// pháp này khả thi vì mã khách hàng không ràng buộc với lớp Iterator cụ thể.
class SocialSpammer is
    method send(iterator: ProfileIterator, message: string) is
        while (iterator.hasMore())
            profile = iterator.getNext()
            System.sendEmail(profile.getEmail(), message)


// Lớp ứng dụng có thể cấu hình tập hợp và Iterator, sau đó chuyển chúng cho mã
// khách hàng.
class Application is
    field network: SocialNetwork
    field spammer: SocialSpammer

    method config() is
        if working with WeChat
            this.network = new WeChat()
        if working with LinkedIn
            this.network = new LinkedIn()
        this.spammer = new SocialSpammer()

    method sendSpamToFriends(profile) is
        iterator = network.createFriendsIterator(profile.getId())
        spammer.send(iterator, "Thông báo quan trọng")

    method sendSpamToCoworkers(profile) is
        iterator = network.createCoworkersIterator(profile.getId())
        spammer.send(iterator, "Thông báo quan trọng")
```

## Ví dụ

**Sử dụng ví dụ:** Mẫu này rất phổ biến trong mã Java. Nhiều framework và thư viện sử dụng nó để cung cấp cách tiêu chuẩn để lặp qua các tập hợp của chúng.

Dưới đây là một số ví dụ trong thư viện Java cốt lõi:

- Tất cả các triển khai của [`java.util.Iterator`](http://docs.oracle.com/javase/8/docs/api/java/util/Iterator.html) (cũng như [`java.util.Scanner`](http://docs.oracle.com/javase/8/docs/api/java/util/Scanner.html)).
- Tất cả các triển khai của [`java.util.Enumeration`](http://docs.oracle.com/javase/8/docs/api/java/util/Enumeration.html).

**Cách nhận biết:** Iterator có thể dễ dàng nhận biết thông qua các phương thức điều hướng như `next` và `previous`. Mã khách hàng sử dụng Iterator có thể không có quyền truy cập trực tiếp vào tập hợp mà nó đang lặp qua.

## Mối quan hệ với các mẫu khác

- Bạn có thể sử dụng mẫu [[Iterator Pattern]] để lặp qua cây [[Composite Pattern]].
- Bạn có thể kết hợp sử dụng mẫu [[Factory Method Pattern]] và [[Iterator Pattern]] để cho phép các lớp con của tập hợp trả về các loại Iterator khác nhau và đảm bảo rằng Iterator phù hợp với tập hợp.
- Bạn có thể kết hợp sử dụng mẫu [[Memento Pattern]] và [[Iterator Pattern]] để lưu trạng thái của Iterator hiện tại và khôi phục lại trạng thái đó khi cần thiết.
- Bạn có thể kết hợp sử dụng mẫu [[Visitor Pattern]] và [[Iterator Pattern]] để lặp qua cấu trúc dữ liệu phức tạp và thực hiện các hoạt động mong muốn trên các phần tử, ngay cả khi các phần tử thuộc về các lớp hoàn toàn khác nhau.
