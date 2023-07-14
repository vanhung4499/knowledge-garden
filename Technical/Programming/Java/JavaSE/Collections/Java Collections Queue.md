---
title: Java Collection Queue
tags: [java, javase, collection]
categories: [java, javase]
date created: 2023-07-15
date modified: 2023-07-15
---

# Java Containers: Queue

## Giới thiệu về Queue

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230715000706.png)

### Giao diện Queue

Giao diện `Queue` được định nghĩa như sau:

```java
public interface Queue<E> extends Collection<E> {}
```

### Lớp AbstractQueue

Lớp `AbstractQueue` cung cấp cài đặt cốt lõi cho giao diện `Queue`, giúp giảm thiểu công việc cần thiết để triển khai các lớp thực thể của `Queue`.

Lớp `AbstractQueue` được định nghĩa như sau:

```java
public abstract class AbstractQueue<E> extends AbstractCollection<E> implements Queue<E> {}
```

### Giao diện Deque

Giao diện `Deque` là viết tắt của double ended queue, có nghĩa là hàng đợi hai đầu. Giao diện `Deque` kế thừa giao diện `Queue` và mở rộng hỗ trợ việc chèn và xóa phần tử ở cả hai đầu của hàng đợi.

Do đó, nó cung cấp các phương thức đặc biệt như:

- `addLast(e)` - chèn phần tử vào cuối hàng đợi.
- `offerLast(e)` - chèn phần tử vào cuối hàng đợi.
- `removeLast()` - xóa phần tử cuối cùng trong hàng đợi.
- `pollLast()` - xóa và trả về phần tử cuối cùng trong hàng đợi.

Hầu hết các triển khai không giới hạn số lượng phần tử, nhưng giao diện này cũng hỗ trợ deque với giới hạn kích thước cố định.

## Lớp ArrayDeque

`ArrayDeque` là triển khai của `Deque` sử dụng mảng.

`ArrayDeque` sử dụng một mảng động để triển khai tất cả các hoạt động cần thiết cho một hàng đợi và ngăn xếp.

## Lớp LinkedList

`LinkedList` là triển khai của `Deque` sử dụng danh sách liên kết.

Ví dụ:

```java
public class LinkedListQueueDemo {

    public static void main(String[] args) {
        //add() và remove() sẽ ném ra ngoại lệ nếu thất bại (không được khuyến nghị)
        Queue<String> queue = new LinkedList<>();

        queue.offer("a"); // Thêm vào hàng đợi
        queue.offer("b"); // Thêm vào hàng đợi
        queue.offer("c"); // Thêm vào hàng đợi
        for (String q : queue) {
            System.out.println(q);
        }
        System.out.println("===");
        System.out.println("poll=" + queue.poll()); // Lấy phần tử đầu tiên ra khỏi hàng đợi
        for (String q : queue) {
            System.out.println(q);
        }
        System.out.println("===");
        System.out.println("element=" + queue.element()); // Trả về phần tử đầu tiên
        for (String q : queue) {
            System.out.println(q);
        }
        System.out.println("===");
        System.out.println("peek=" + queue.peek()); // Trả về phần tử đầu tiên
        for (String q : queue) {
            System.out.println(q);
        }
    }

}
```

## Lớp PriorityQueue

Lớp `PriorityQueue` được định nghĩa như sau:

```java
public class PriorityQueue<E> extends AbstractQueue<E> implements java.io.Serializable {}
```

Điểm chính của `PriorityQueue`:

- `PriorityQueue` triển khai `Serializable`, hỗ trợ tuần tự hóa.
- `PriorityQueue` là hàng đợi ưu tiên không giới hạn.
- Các phần tử trong `PriorityQueue` được sắp xếp theo thứ tự tự nhiên hoặc theo thứ tự được cung cấp bởi `Comparator`.
- `PriorityQueue` không chấp nhận phần tử null.
- `PriorityQueue` không an toàn đối với luồng.
