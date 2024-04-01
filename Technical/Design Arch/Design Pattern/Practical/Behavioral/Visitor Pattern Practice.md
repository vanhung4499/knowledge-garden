---
title: Visitor Pattern Practice
tags:
  - design-pattern
categories: 
date created: 2024-04-01
date modified: 2024-04-02
---

# Visitor Pattern Practice: Mô phỏng phụ huynh và hiệu trưởng truy cập thông tin từ các góc nhìn khác nhau của học sinh và giáo viên

## Giới thiệu

"Khả năng là bảo đảm lớn nhất cho sự tiến bộ của bạn."

Tuổi tác sẽ ngày càng tăng lên, nhưng điều gì có thể làm cho bạn không hoang mang? Đó chính là khả năng. Ngay cả trong một công việc có vẻ ổn định, chỉ khi bạn có "khả năng ở lại" và "khả năng bước ra ngoài", bạn mới có thể cảm thấy ổn định. Sự cải thiện về khả năng không ngừng là việc vượt qua những điều chưa biết của chính mình, nghĩa là mở rộng phạm vi, cũng như xây dựng sức ảnh hưởng cá nhân trong lĩnh vực chuyên môn, nghĩa là sâu sắc. Nếu mỗi ngày trong 365 ngày, bạn chỉ làm công việc đó, mọi thứ không thay đổi chỉ là sự lặp lại, điều này chỉ làm cho bàn tay bạn cứng lại, và thời gian trôi đi khiến cuộc sống cảm thấy ngắn ngủi.

"Có đứng cao mới nhìn xa được chứ?"

Thật sự, chỉ khi đứng cao mới có thể nhìn xa, cũng như tạo ra nhiều mục tiêu cho bản thân. Nhưng khi đứng cao, những điều trước đây bạn nhìn rõ bỗng trở nên mờ nhạt. Sự khác biệt về góc nhìn và điểm tập trung sẽ tạo ra nhiều lựa chọn khác nhau cho chúng ta, và việc điều chỉnh lại mình làm cho bản thân mình có một nền tảng vững chắc để tiến lên là điều cần thiết. Khi thực sự có thể đi một cách ổn định đến đỉnh núi, đó mới là thời điểm phù hợp để nhìn xa hơn.

"Phải giỏi toán mới học được lập trình à?"

Thường thì những người mới học lập trình sẽ hỏi liệu họ có thể học nếu không giỏi toán không? Thực ra, hãy suy nghĩ xem tại sao bạn lại không giỏi toán? Trên con đường mà bạn chưa đi tới, bạn đã dành bao nhiêu thời gian cho nó? Nếu một việc bạn dám làm và làm quen với nó như việc viết tên của mình, liệu có điều gì khó khăn không? Từ đại học đến lúc tốt nghiệp có thể viết ra 400 nghìn dòng mã, liệu có lo lắng không khi không thể tìm được việc làm? Mỗi ngày tích lũy, không có gì khó khăn. Khó khăn là khi bạn muốn học xong thành tích của người khác trong một tháng cuối cùng. Hãy bắt đầu học ngay từ bây giờ.

## Môi trường phát triển

1. JDK 1.8
2. Idea + Maven
3. Code: [vanhung4499/practical-java-design](https://github.com/vanhung4499/practical-java-design)  

| Dự án             | Mô tả                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------- |
| demo-design-22-00 | Dự án mô phỏng tình huống: mô phỏng quan điểm truy cập khác nhau giữa sinh viên và giáo viên |

## Giới thiệu về Visitor Pattern

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240401235154.png)

Vấn đề cốt lõi mà Người Ghé Thăm phải giải quyết là, trong một cấu trúc dữ liệu ổn định, chẳng hạn như thông tin người dùng, thông tin nhân viên, v.v., làm thế nào để thêm vào các logic truy cập kinh doanh dễ thay đổi. Để tăng tính mở rộng, đây là một mẫu thiết kế tách biệt logic kinh doanh của hai phần này.

Nói một cách đơn giản, cốt lõi của Visitor Pattern là thông tin được truy cập dưới các góc độ khác nhau của cùng một vật thể sẽ khác nhau, ví dụ như một `cô gái xinh đẹp` cầm một `kem`. Một đứa trẻ sẽ chú ý vào kem, một người lớn sẽ tìm những điểm họ thích để quan sát môi trường xung quanh.

## Mô phỏng Trường Hợp Thực Tế

**Trong trường hợp này, chúng ta mô phỏng các quan điểm truy cập khác nhau của học sinh và giáo viên trong trường học**

Trong trường hợp này, chúng ta mô phỏng các quan điểm truy cập khác nhau của học sinh và giáo viên trong một trường học. Với phụ huynh và hiệu trưởng, quan điểm của họ về vấn đề là khác nhau. Phụ huynh quan tâm hơn đến điểm số của con và năng lực của giáo viên, trong khi hiệu trưởng quan tâm hơn đến số lượng học sinh trong lớp và tỉ lệ chuyển cấp học (được mô phỏng ở đây).

Do đó, `học sinh` và `giáo viên` là nội dung thông tin cố định, và muốn người dùng từ các góc nhìn khác nhau có thể truy cập thông tin quan trọng của họ, thì mẫu quan sát sẽ rất phù hợp để thực hiện, từ đó giúp tách rời thực thể và logic kinh doanh, tăng tính mở rộng. **Tuy nhiên, cấu trúc lớp toàn bộ của mẫu quan sát có độ phức tạp tương đối, cần phải được sắp xếp rõ ràng trước khi phát triển**.

## Xây dựng dự án theo Visitor Pattern

Cấu trúc lớp của Visitor Pattern tương đối phức tạp so với các mẫu thiết kế khác, nhưng đối với tôi, mẫu thiết kế như vậy có sức hấp dẫn hơn, nó mở ra cho bạn một cái nhìn mới về cấu trúc mã nguồn, và sử dụng tư duy như vậy để xây dựng cấu trúc mã nguồn tốt hơn liên tục.

Về hạt nhân logic của trường hợp này, có những điểm sau đây:

1. Xây dựng lớp trừu tượng Người Dùng và phương thức truy cập trừu tượng, sau đó được thực hiện bởi các người dùng khác nhau; giáo viên và học sinh.
2. Xây dựng giao diện Người Ghé Thăm, được sử dụng cho các hoạt động ghé thăm của các cá nhân khác nhau; hiệu trưởng và phụ huynh.
3. Cuối cùng là xây dựng bảng điều khiển dữ liệu, được sử dụng để hiển thị kết quả truy cập từ các góc nhìn khác nhau.

### Cấu trúc Dự án

```java
design-demo-22-00/
├── pom.xml
└── src
    ├── main
    │   └── java
    │       └── com
    │           └── hnv99
    │               └── design
    │                   ├── DataView.java
    │                   ├── user
    │                   │   ├── User.java
    │                   │   └── impl
    │                   │       ├── Student.java
    │                   │       └── Teacher.java
    │                   └── visitor
    │                       ├── Visitor.java
    │                       └── impl
    │                           ├── Parent.java
    │                           └── Principal.java
    └── test
        └── java
            └── com
                └── hnv99
                    └── design
                        └── ApiTest.java

```            

**Cấu trúc Mô hình Mẫu Người Ghé Thăm**  

![Cấu trúc Mô hình Mẫu Người Ghé Thăm](https://raw.githubusercontent.com/vanhung4499/images/master/snap/itstack-demo-design-22-04.png)

Trên đây là sơ đồ trình bày cấu trúc lõi của mã nguồn, bao gồm các mô hình truy cập của người dùng khác nhau dưới các góc độ khác nhau.

Một điểm quan trọng cần chú ý ở đây là; `visitor.visit(this)` trong mỗi lớp thực thi người dùng, bao gồm; `Student` và `Teacher`. Trong các triển khai dưới đây, điều này được tập trung chú ý.

### Triển khai code

#### Định nghĩa lớp trừu tượng Người Dùng

```java
// Thông tin người dùng cơ bản
public abstract class User {

    public String name;      // Tên
    public String identity;  // Danh tính; Lớp nâng cao, lớp thông thường | Giáo viên siêu cấp, giáo viên thông thường, giáo viên thực tập
    public String clazz;     // Lớp

    public User(String name, String identity, String clazz) {
        this.name = name;
        this.identity = identity;
        this.clazz = clazz;
    }

    // Phương thức truy cập cốt lõi
    public abstract void accept(Visitor visitor);

}
```       

- Thông tin cơ bản bao gồm; Tên, Danh tính, Lớp, cũng có thể là một lớp thuộc tính người dùng kinh doanh.
- Định nghĩa phương thức trừu tượng chính, `abstract void accept(Visitor visitor)`; phương thức này được tạo ra để cho phép các lớp cụ thể người dùng sau này cung cấp một phương thức truy cập cho bên ngoài sử dụng.

#### Triển khai Thông tin Người Dùng (Giáo viên và Học sinh)

**Lớp Giáo viên**

```java
public class Teacher extends User {

    public Teacher(String name, String identity, String clazz) {
        super(name, identity, clazz);
    }

    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    // Tỷ lệ chuyển cấp
    public double entranceRatio() {
        return BigDecimal.valueOf(Math.random() * 100).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

}
```

**Lớp Học sinh**

```java
public class Student extends User {

    public Student(String name, String identity, String clazz) {
        super(name, identity, clazz);
    }

    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    // Xếp hạng
    public int ranking() {
        return (int) (Math.random() * 100);
    }

}
```  

- Ở đây, lớp Giáo viên và Học sinh được triển khai, cả hai đều cung cấp hàm tạo của lớp cha.
- Trong phương thức `accept`, chúng ta cung cấp việc truy cập địa phương của đối tượng; `visitor.visit(this)`; điều này cần được hiểu rõ hơn.
- Cả lớp Giáo viên và Học sinh đều cung cấp các phương thức đặc trưng của chính họ; Tỷ lệ chuyển cấp (`entranceRatio`), Xếp hạng (`ranking`), các phương thức tương tự có thể được mở rộng theo yêu cầu kinh doanh.

#### Định nghĩa Giao diện Truy cập Dữ liệu

```java
public interface Visitor {

    // Truy cập thông tin học sinh
    void visit(Student student);

    // Truy cập thông tin giáo viên
    void visit(Teacher teacher);

}
```     

- Giao diện truy cập khá đơn giản, cùng tên phương thức, loại người dùng khác nhau được truyền vào.
- Điều này cho phép các lớp truy cập cụ thể, khi triển khai, có thể tập trung vào các đối tượng dữ liệu cụ thể của từng loại người dùng, chẳng hạn như; Tỷ lệ chuyển cấp và Xếp hạng.

#### Triển khai Loại Truy cập (Hiệu trưởng và Phụ huynh)

**Người ghé thăm; Hiệu trưởng**

```java
public class Principal implements Visitor {

    private Logger logger = LoggerFactory.getLogger(Principal.class);

    public void visit(Student student) {
        logger.info("Thông tin học sinh Tên: {} Lớp: {}", student.name, student.clazz);
    }

    public void visit(Teacher teacher) {
        logger.info("Thông tin giáo viên Tên: {} Lớp: {} Tỷ lệ chuyển cấp: {}", teacher.name, teacher.clazz, teacher.entranceRatio());
    }

}
```

**Người ghé thăm; Phụ huynh**

```java
public class Parent implements Visitor {

    private Logger logger = LoggerFactory.getLogger(Parent.class);

    public void visit(Student student) {
        logger.info("Thông tin học sinh Tên: {} Lớp: {} Xếp hạng: {}", student.name, student.clazz, student.ranking());
    }

    public void visit(Teacher teacher) {
        logger.info("Thông tin giáo viên Tên: {} Lớp: {} Cấp bậc: {}", teacher.name, teacher.clazz, teacher.identity);
    }

}
```   

- Đây là hai lớp người ghé thăm cụ thể, mỗi người ghé thăm có quan điểm riêng của mình.
- Hiệu trưởng quan tâm đến; Tên và Lớp của học sinh, Tỷ lệ chuyển cấp của giáo viên trong lớp đó.
- Phụ huynh quan tâm đến; Xếp hạng của con mình, Lớp và Cấp bậc của giáo viên.

#### Bảng Điều khiển Dữ liệu

```java
public class DataView {

    List<User> userList = new ArrayList<User>();

    public DataView() {
        userList.add(new Student("谢飞机", "Lớp nâng cao", "1A"));
        userList.add(new Student("windy", "Lớp nâng cao", "1A"));
        userList.add(new Student("Đại mao", "Lớp thông thường", "2C"));
        userList.add(new Student("Shing", "Lớp thông thường", "3D"));
        userList.add(new Teacher("BK", "Giáo viên siêu cấp", "1A"));
        userList.add(new Teacher("NanaGoddess", "Giáo viên siêu cấp", "1A"));
        userList.add(new Teacher("Dangdang", "Giáo viên thông thường", "2C"));
        userList.add(new Teacher("Zedong", "Giáo viên thực tập", "3D"));
    }

    // Hiển thị
    public void show(Visitor visitor) {
        for (User user : userList) {
            user.accept(visitor);
        }
    }

}
```     

- Đầu tiên, lớp này khởi tạo dữ liệu cơ bản, thông tin về học sinh và giáo viên.
- Và cung cấp một lớp hiển thị, thông qua việc truyền vào các `người ghé thăm (Hiệu trưởng, Phụ huynh)` khác nhau để in ra thông tin khác nhau.

### Kiểm thử

#### Viết Lớp Kiểm thử

```java
@Test
public void test(){
    DataView dataView = new DataView();      

    logger.info("\r\nQuan điểm của Phụ huynh:");
    dataView.show(new Parent());     // Phụ huynh

    logger.info("\r\nQuan điểm của Hiệu trưởng:");
    dataView.show(new Principal());  // Hiệu trưởng
}
```    

- Từ lớp kiểm thử, chúng ta có thể thấy rằng, phụ huynh và hiệu trưởng được xem xét từ hai quan điểm truy cập khác nhau.

#### Kết quả

```shell
2024-04-02 00:03:31.870	INFO	main		(ApiTest.java:16)	|	
Quan điểm của Phụ huynh:
2024-04-02 00:03:31.875	INFO	main		(Parent.java:14)	|	Thông tin học sinh Tên: fly Lớp: 1A Xếp hạng: 46
2024-04-02 00:03:31.875	INFO	main		(Parent.java:14)	|	Thông tin học sinh Tên: windy Lớp: 1A Xếp hạng: 41
2024-04-02 00:03:31.875	INFO	main		(Parent.java:14)	|	Thông tin học sinh Tên: Đại mao Lớp: 2C Xếp hạng: 81
2024-04-02 00:03:31.875	INFO	main		(Parent.java:14)	|	Thông tin học sinh Tên: Shing Lớp: 3D Xếp hạng: 8
2024-04-02 00:03:31.875	INFO	main		(Parent.java:18)	|	Thông tin giáo viên Tên: BK Lớp: 1A Cấp bậc: Giáo viên siêu cấp
2024-04-02 00:03:31.875	INFO	main		(Parent.java:18)	|	Thông tin giáo viên Tên: NanaGoddess Lớp: 1A Cấp bậc: Giáo viên siêu cấp
2024-04-02 00:03:31.875	INFO	main		(Parent.java:18)	|	Thông tin giáo viên Tên: Dangdang Lớp: 2C Cấp bậc: Giáo viên thông thường
2024-04-02 00:03:31.875	INFO	main		(Parent.java:18)	|	Thông tin giáo viên Tên: Zedong Lớp: 3D Cấp bậc: Giáo viên thực tập
2024-04-02 00:03:31.875	INFO	main		(ApiTest.java:19)	|	
Quan điểm của Hiệu trưởng:
2024-04-02 00:03:31.876	INFO	main		(Principal.java:14)	|	Thông tin học sinh Tên: fly Lớp: 1A
2024-04-02 00:03:31.876	INFO	main		(Principal.java:14)	|	Thông tin học sinh Tên: windy Lớp: 1A
2024-04-02 00:03:31.876	INFO	main		(Principal.java:14)	|	Thông tin học sinh Tên: Đại mao Lớp: 2C
2024-04-02 00:03:31.876	INFO	main		(Principal.java:14)	|	Thông tin học sinh Tên: Shing Lớp: 3D
2024-04-02 00:03:31.878	INFO	main		(Principal.java:18)	|	Thông tin giáo viên Tên: BK Lớp: 1A Tỷ lệ chuyển cấp: 33.54
2024-04-02 00:03:31.878	INFO	main		(Principal.java:18)	|	Thông tin giáo viên Tên: NanaGoddess Lớp: 1A Tỷ lệ chuyển cấp: 72.76
2024-04-02 00:03:31.878	INFO	main		(Principal.java:18)	|	Thông tin giáo viên Tên: Dangdang Lớp: 2C Tỷ lệ chuyển cấp: 35.18
2024-04-02 00:03:31.878	INFO	main		(Principal.java:18)	|	Thông tin giáo viên Tên: Zedong Lớp: 3D Tỷ lệ chuyển cấp: 40.12

```

- Từ kết quả kiểm thử, chúng ta thấy rằng, quan điểm của phụ huynh và hiệu trưởng đều được đồng bộ, nhưng dữ liệu thu được thực sự là khác nhau. Dưới góc độ của phụ huynh, họ có thể xem xếp hạng của học sinh, trong khi dưới góc độ của hiệu trưởng, họ có thể xem tỷ lệ chuyển cấp của lớp học.
- Thông qua kết quả thử nghiệm như vậy, chúng ta có thể thấy được mục đích và kết quả ban đầu của chế độ khách, việc áp dụng chế độ phù hợp trong kịch bản phù hợp sẽ rất có lợi cho việc phát triển chương trình.

## Tổng kết

- Từ cảnh quan trọng của kịch bản kinh doanh được trình bày ở trên, ta thấy rằng, việc tích hợp mẫu người truy cập có thể làm cho cấu trúc toàn bộ dự án dễ dàng thêm và sửa đổi. Điều này giúp giải mạng dịch vụ hệ thống và tránh việc phải thêm nhiều câu lệnh `if` hoặc ép kiểu lớp không cần thiết để truy cập thông tin loại khác nhau. Điều này giúp cấu trúc mã nguồn trở nên rõ ràng hơn thông qua việc áp dụng mẫu thiết kế như vậy.
- Ngoài ra, trong quá trình triển khai, bạn có thể nhận ra rằng, khi định nghĩa lớp trừu tượng, bạn cần chờ đợi định nghĩa giao diện người truy cập, điều này làm cho việc tổ chức mã nguồn trở nên khó khăn hơn một chút. Ngoài ra, từ quan điểm của các nguyên tắc thiết kế mẫu, điều này vi phạm nguyên tắc của Lớp ít biết nhất. Do đó, khi sử dụng, nên phù hợp với việc áp dụng trong môi trường và trích xuất bản chất của phần suy nghĩ thiết kế này.
- Cách tốt nhất để học là cách tốt nhất để chấp nhận kiến thức, và học lập trình cần nhiều hơn là đọc, mà là thực hành. Mỗi mẫu thiết kế có khoa học của riêng nó, cũng có thể nói là sự khéo léo của nó, những điểm khéo léo như vậy thường là góc nhìn tốt nhất để giải quyết vấn đề phức tạp. Hãy tự làm, chỉ khi đó bạn mới có thể làm được mọi thứ, vì khao khát của bản thân!
