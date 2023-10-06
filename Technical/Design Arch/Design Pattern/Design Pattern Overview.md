---
title: Design Pattern Overview
tags:
  - design-pattern
categories:
  - design-pattern
date created: 2023-10-05
date modified: 2023-10-06
---

# Tổng quan về mẫu thiết kế

> Mẫu thiết kế (Design Pattern) đại diện cho các phương pháp tốt nhất thường được sử dụng bởi các nhà phát triển phần mềm có kinh nghiệm. Mẫu thiết kế là các giải pháp cho các vấn đề chung mà các nhà phát triển phần mềm gặp phải trong quá trình phát triển phần mềm. Những giải pháp này được rút ra từ thời gian dài thử nghiệm và lỗi của nhiều nhà phát triển phần mềm.

## Mẫu thiết kế tạo đối tượng

### Giới thiệu về mẫu thiết kế tạo đối tượng

**Mẫu thiết kế tạo đối tượng (Creational Pattern)** trừu tượng hóa quá trình **khởi tạo**. Nó tách biệt **hệ thống** với cách **tạo đối tượng**, kết hợp và biểu diễn chúng.

Mẫu thiết kế tạo đối tượng đóng gói thông tin về việc sử dụng các lớp cụ thể trong hệ thống.

Trong kỹ thuật phần mềm, mẫu thiết kế tạo đối tượng là mẫu thiết kế xử lý việc tạo đối tượng, cố gắng sử dụng cách tạo đối tượng phù hợp dựa trên tình huống cụ thể.

Cách tạo đối tượng cơ bản có thể gây ra các vấn đề thiết kế hoặc làm tăng độ phức tạp của thiết kế. Mẫu thiết kế tạo đối tượng giải quyết vấn đề này bằng cách kiểm soát cách tạo đối tượng theo một cách nào đó.

Ý tưởng chủ đạo của mẫu thiết kế tạo đối tượng là:

- Đóng gói các lớp cụ thể được sử dụng trong hệ thống.
- Ẩn cách tạo ra các phiên bản cụ thể của các lớp này và cách kết hợp chúng.

Mẫu thiết kế tạo đối tượng được chia thành hai loại: **mẫu tạo đối tượng đối tượng** và **mẫu tạo đối tượng lớp**. Mẫu tạo đối tượng đối tượng xử lý việc tạo đối tượng, trong khi mẫu tạo đối tượng lớp xử lý việc tạo lớp.

- **Mẫu tạo đối tượng đối tượng** trì hoãn việc tạo đối tượng một phần đến một đối tượng khác. (Các mẫu đại diện: **mẫu Singleton**, **mẫu Builder**, **mẫu Prototype**, **mẫu Abstract Factory**)
- **Mẫu tạo đối tượng lớp** trì hoãn việc tạo đối tượng cho các lớp con. (Mẫu đại diện: **mẫu Factory Method**)

### Ứng dụng của mẫu thiết kế tạo đối tượng

Kỹ thuật phần mềm hiện đại dựa nhiều vào việc kết hợp đối tượng thay vì kế thừa lớp, nhấn mạnh việc chuyển từ hành vi được mã hóa cứng sang việc định nghĩa một tập hợp các hành vi cơ bản để kết hợp thành hành vi phức tạp.

Hành vi được mã hóa cứng không linh hoạt vì nếu muốn thay đổi một phần của thiết kế, cần phải thực hiện việc ghi đè hoặc triển khai lại.

Hơn nữa, mã hóa cứng không cung cấp khả năng tái sử dụng và khó theo dõi lỗi. Vì những lý do này, mẫu thiết kế tạo đối tượng có ích hơn mã hóa cứng.

Mẫu thiết kế tạo đối tượng làm cho thiết kế linh hoạt hơn, cung cấp các cách khác nhau để loại bỏ các tham chiếu đến các lớp cụ thể cần tạo đối tượng từ mã. Nói cách khác, những mẫu này tăng cường tính độc lập giữa đối tượng và lớp.

Có thể xem xét áp dụng mẫu thiết kế tạo đối tượng trong các trường hợp sau:

- Hệ thống cần độc lập với việc tạo đối tượng và sản phẩm của nó.
- Một nhóm các đối tượng liên quan được thiết kế để sử dụng cùng nhau.
- Ẩn cài đặt cụ thể của một thư viện, chỉ tiết lộ giao diện của chúng.
- Tạo ra các biểu diễn khác nhau của một đối tượng phức tạp.
- Một lớp muốn các lớp con của nó triển khai đối tượng mà nó tạo ra.
- Việc khởi tạo đối tượng được chỉ định vào thời điểm chạy.
- Một lớp chỉ có thể có một phiên bản và phiên bản này có thể truy cập từ bất kỳ đâu.
- Phiên bản phải có khả năng mở rộng mà không cần sửa đổi.

### Mẫu thiết kế tạo đối tượng (Creational Pattern)

> Mẫu thiết kế tạo đối tượng cung cấp cơ chế tạo đối tượng, giúp tăng tính linh hoạt và khả năng tái sử dụng của mã hiện có.

- [[Simple Factory Pattern]]
- [[Factory Method Pattern]]
- [[Abstract Factory Pattern]]
- [[Builder Pattern]]
- [[Prototype Pattern]]
- [[Singleton Pattern]]

### Mẫu thiết kế cấu trúc (Structural Pattern)

> Mẫu thiết kế cấu trúc giúp tổ chức các đối tượng và lớp thành các cấu trúc lớn hơn, đồng thời duy trì tính linh hoạt và hiệu suất của cấu trúc đó.

- [[Adapter Pattern]]
- [[Bridge Pattern]]
- [[Composite Pattern]]
- [[Decorator Pattern]]
- [[Facade Pattern]]
- [[Flyweight Pattern]]
- [[Proxy Pattern]]

### Mẫu thiết kế hành vi (Behavioral pattern)

> Mẫu thiết kế hành vi đảm nhận trách nhiệm giao tiếp hiệu quả giữa các đối tượng và phân phối trách nhiệm.

- [[Template Method Pattern]]
- [[Command Pattern]]
- [[Iterator Pattern]]
- [[Observer Pattern]]
- [[Interpreter Pattern]] Updating!
- [[Mediator Pattern]]
- [[Chain of Responsibility Pattern]]
- [[Memento Pattern]]
- [[Strategy Pattern]]
- [[Visitor Pattern]]
- [[State Pattern]]
