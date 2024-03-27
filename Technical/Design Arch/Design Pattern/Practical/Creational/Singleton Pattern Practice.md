---
title: Singleton Pattern Practice
tags:
  - design-pattern
categories: 
date created: 2024-03-27
date modified: 2024-03-27
---

# Singleton Pattern Practice: 7 cách triển khai Singleton

## Giới thiệu

 **Mẫu thiết kế tạo lập cuối cùng**

Trong thiết kế mẫu, có ba loại chính được chia thành ba loại khác nhau dựa trên cách xử lý khác nhau; **mẫu tạo lập**, **mẫu cấu trúc** và **mẫu hành vi**, trong đó mẫu tạo lập đã được giới thiệu qua bốn mẫu; `factory method`, `abstract factory`, `builder` và `prototype`, ngoài ra còn có một mẫu cuối cùng đó là `singleton`.

**Kiến thức đã được nắm vững mới là của bạn**

Trong việc viết **mẫu thiết kế Java**, cố gắng sử dụng nhiều ví dụ thực tế khác nhau để giới thiệu việc sử dụng mẫu thiết kế, bao gồm các tình huống mà chúng ta đã sử dụng: `việc phát giải thưởng của mọi loại hàng hoá`, `nâng cấp đa cụm Redis`, `bảng giá báo giá của công ty trang trí` và `bài kiểm tra với câu trả lời được xáo trộn`, thông qua các ví dụ thực tế này để cảm nhận được tư duy thiết kế mẫu. Tuy nhiên, những tình huống này chỉ là kinh nghiệm rời rạc của tác giả, chưa phải là kiến thức của bạn, vì vậy nếu bạn muốn hiểu biết và áp dụng một cách toàn diện, bạn nhất định phải tự thực hiện và hoàn thành công việc.

**Sách không phải là để đọc mà là để sử dụng**

Tôi muốn nhấn mạnh về phương pháp học tập ở đây, luôn có rất nhiều bạn trẻ có nghi ngờ về việc học tập, dường như đã đọc, hiểu khi đọc, nhưng khi áp dụng thực tế lại không thể sử dụng. Hoặc đôi khi bạn nghĩ liệu có phải là một cách nào đó sẽ tốt hơn nếu có các minh họa hoạt hình hoặc so sánh một cách sinh động hơn, tất nhiên các phương pháp này có thể làm tăng tốc độ hiểu biết về kiến thức. Tuy nhiên, chỉ khi bạn coi video học như xem phim, đọc sách như đọc truyện, mới rất khó để nắm vững công nghệ này. Chỉ khi bạn sử dụng nó, khám phá từng từng chi tiết, loại bỏ tất cả các điểm mù gặp phải, bạn mới thực sự có thể nắm vững kỹ năng này.

## Môi trường phát triển

1. JDK 1.8
2. Idea + Maven
3. Code: [vanhung4499/practical-java-design](https://github.com/vanhung4499/practical-java-design)  

## Giới thiệu về Singleton Pattern

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240327173041.png)

Singleton Pattern có thể coi là một trong những mẫu đơn giản nhất trong toàn bộ thiết kế, và phương pháp này thậm chí cũng được sử dụng thường xuyên trong lập trình mà không cần phải đọc các tài liệu liên quan đến thiết kế.

Vì trong quá trình phát triển phần mềm, thường xuyên gặp phải một tình huống như sau: cần đảm bảo rằng một lớp chỉ có một thể hiện ngay cả khi có nhiều luồng đồng thời truy cập, và cần cung cấp một điểm truy cập toàn cục cho thể hiện này.

Tóm lại và cũng như trong quá trình phát triển thông thường của chúng ta, có thể tổng kết một kinh nghiệm: Singleton Pattern chủ yếu giải quyết việc một lớp được sử dụng toàn cầu được tạo và tiêu thụ thường xuyên, từ đó nâng cao hiệu suất tổng thể của mã.

## Kịch bản sử dụng Singleton Pattern

Trong phần này, chúng ta sẽ tìm hiểu về các tình huống phổ biến mà chúng ta thường gặp trong quá trình phát triển phần mềm, trong đó việc sử dụng Singleton Pattern có thể được áp dụng một cách hữu ích:

1. **Kết nối cơ sở dữ liệu**: Không cần tạo lại các kết nối cơ sở dữ liệu mỗi khi cần sử dụng, mà thay vào đó, chúng ta chỉ cần sử dụng một đối tượng kết nối duy nhất.
2. **Spring Bean Singleton**: Trong Spring Framework, khi chúng ta định nghĩa một bean với phạm vi singleton, Spring sẽ chỉ tạo một đối tượng bean duy nhất cho mỗi ứng dụng hoặc môi trường.
3. **Lưu trữ thuộc tính toàn cục**: Trong một số trường hợp, chúng ta cần lưu trữ các thuộc tính toàn cục mà có thể truy cập từ bất kỳ nơi nào trong ứng dụng. Trong trường hợp này, Singleton Pattern có thể được sử dụng để tạo một đối tượng duy nhất để lưu trữ các giá trị này.

Trong quá trình phát triển hàng ngày, singleton thường sẽ được sử dụng trong các tình huống trên, mặc dù chế độ singleton không phức tạp nhưng có phạm vi sử dụng rất rộng.

## 7 cách triển khai Singleton

Có nhiều cách để triển khai Singleton Pattern, chủ yếu phụ thuộc vào việc có hỗ trợ việc trì hoãn việc tạo đối tượng (lazy initialization) hay không, cũng như việc bảo đảm tính đồng thời cho việc truy cập đa luồng. Dưới đây là 7 cách phổ biến để triển khai Singleton Pattern:

### Sử dụng lớp tĩnh

```java
public class Singleton_00 {

    public static Map<String,String> cache = new ConcurrentHashMap<String, String>();
    
}
```

- Cách này khá phổ biến trong phát triển hàng ngày. Việc sử dụng lớp tĩnh cho phép chúng ta khởi tạo một Map ngay từ lần chạy đầu tiên, và không cần phải quan tâm đến việc trì hoãn tạo đối tượng.
- Khi không cần duy trì bất kỳ trạng thái nào và chỉ cần truy cập toàn cục, việc sử dụng lớp tĩnh là cách tiện lợi nhất.
- Tuy nhiên, nếu cần được kế thừa hoặc cần duy trì một số trạng thái cụ thể, việc sử dụng Singleton sẽ phù hợp hơn.

### Lazy Singleton (Không an toàn cho luồng)

```java
public class Singleton_01 {

    private static Singleton_01 instance;

    private Singleton_01() {
    }

    public static Singleton_01 getInstance(){
        if (null != instance) return instance;
        instance = new Singleton_01();
        return instance;
    }

}
```

- Một đặc điểm của Singleton là không cho phép tạo ra đối tượng từ bên ngoài, nghĩa là `new Singleton_01()`. Do đó, ở đây ta thêm thuộc tính riêng tư `private` cho hàm tạo mặc định.
- Hiện tại, cách triển khai này thỏa mãn việc trì hoãn tạo đối tượng, nhưng nếu có nhiều người truy cập cùng một lúc để lấy đối tượng (bạn có thể tưởng tượng như một đám đông đang cố gắng dùng nhà vệ sinh), sẽ dẫn đến việc tạo ra nhiều phiên bản của đối tượng và đưa ra ngoài, từ đó không đảm bảo tính duy nhất của Singleton.

### Lazy Singleton (An toàn cho luồng)

```java
public class Singleton_02 {

    private static Singleton_02 instance;

    private Singleton_02() {
    }

    public static synchronized Singleton_02 getInstance(){
        if (null != instance) return instance;
        instance = new Singleton_02();
        return instance;
    }

}
```

- Mặc dù cách triển khai này là an toàn về mặt luồng, nhưng do việc thêm khóa vào phương thức, tất cả các truy cập đều phải chờ khóa, dẫn đến lãng phí tài nguyên. Nếu không có trường hợp đặc biệt, không khuyến khích sử dụng cách triển khai này cho Singleton.

### Eager Singleton (An toàn cho luồng)

```java
public class Singleton_03 {

    private static Singleton_03 instance = new Singleton_03();

    private Singleton_03() {
    }

    public static Singleton_03 getInstance() {
        return instance;
    }

}
```

- Cách triển khai này tương tự với việc khởi tạo `Map` ở đầu tiên trong ví dụ của chúng ta. Nó được tạo ra ngay khi ứng dụng bắt đầu, và sẵn sàng sử dụng ngay lập tức.
- Tuy nhiên, cách triển khai này không phải là lười biếng, nghĩa là nó sẽ tạo ra một thể hiện ngay cả khi không cần thiết.

### Sử dụng inner class (An toàn cho luồng)

```java
public class Singleton_04 {

    private static class SingletonHolder {
        private static Singleton_04 instance = new Singleton_04();
    }

    private Singleton_04() {
    }

    public static Singleton_04 getInstance() {
        return SingletonHolder.instance;
    }

}
```

- Sử dụng inner class để triển khai Singleton Pattern cung cấp tính năng an toàn cho luồng (thread-safe) và lười biếng (lazy-loading).
- Kỹ thuật này sử dụng tính năng của JVM để đảm bảo rằng lớp nội bộ chỉ được tạo ra khi nó được yêu cầu.
- Đây là một cách triển khai Singleton Pattern được khuyến khích sử dụng trong Java.

### Kiểm tra đồng bộ kép (An toàn cho luồng)

```java
public class Singleton_05 {

    private static volatile Singleton_05 instance;

    private Singleton_05() {
    }

    public static Singleton_05 getInstance(){
       if(null != instance) return instance;
       synchronized (Singleton_05.class){
           if (null == instance){
               instance = new Singleton_05();
           }
       }
       return instance;
    }

}
```

- Phương pháp kiểm tra đồng bộ kép (double-checked locking) là một cách triển khai Singleton Pattern cải tiến, giảm thiểu thời gian chờ đợi khi lấy thể hiện.
- Đồng thời, cách triển khai này cũng đảm bảo việc tạo thể hiện trì hoãn.
- Tuy nhiên, cần lưu ý rằng việc sử dụng từ khóa `volatile` để đảm bảo rằng `instance` là thread-safe.

### CAS "AtomicReference" (An toàn đa luồng)

```java
public class Singleton_06 {

    private static final AtomicReference<Singleton_06> INSTANCE = new AtomicReference<Singleton_06>();

    private Singleton_06() {
    }

    public static final Singleton_06 getInstance() {
        for (; ; ) {
            Singleton_06 instance = INSTANCE.get();
            if (null != instance) return instance;
            INSTANCE.compareAndSet(null, new Singleton_06());
            return INSTANCE.get();
        }
    }

    public static void main(String[] args) {
        System.out.println(Singleton_06.getInstance()); // com.hnv99.design.Singleton_06@2e349c8e
        System.out.println(Singleton_06.getInstance()); // com.hnv99.design.Singleton_06@2e349c8e
    }

}
```

- Thư viện đa luồng trong Java cung cấp nhiều lớp nguyên tử để hỗ trợ tính an toàn của dữ liệu trong lúc truy cập đa luồng; `AtomicInteger`, `AtomicBoolean`, `AtomicLong`, `AtomicReference`.
- `AtomicReference<V>` có thể đóng gói một tham chiếu tới một thể hiện V, hỗ trợ truy cập đa luồng như cách triển khai đơn giản trên.
- Việc sử dụng CAS mang lại lợi ích là không cần sử dụng cách khóa truyền thống để đảm bảo an toàn đa luồng, mà thay vào đó dựa vào thuật toán bận rộn của CAS, phụ thuộc vào việc triển khai phần cứng cơ bản, để đảm bảo an toàn đa luồng. So với triển khai khóa khác, không có việc chuyển đổi và chặn luồng nào khác, không có chi phí phụ thêm và có thể hỗ trợ mức độ đa luồng lớn hơn.
- Tất nhiên, CAS cũng có một nhược điểm là bận rộn, nếu mãi mãi không nhận được giá trị, nó sẽ rơi vào vòng lặp vô hạn.

### Singleton Pattern được khuyến nghị bởi tác giả của Effective Java (An toàn đa luồng)

```java
public enum Singleton_07 {

    INSTANCE;
    
    public void test(){
        System.out.println("Xin chào~");
    }

}
```

> Joshua J. Bloch (sinh ngày 28 tháng 8 năm 1961) là một lập trình viên nổi tiếng người Mỹ. Ông đã thiết kế và triển khai nhiều tính năng cho nền tảng Java, từng là Kiến trúc sư Java chính tại Google.

- Tác giả của Effective Java khuyến nghị sử dụng Singleton Pattern dưới dạng enum để giải quyết vấn đề, một phương pháp ít được sử dụng nhất trong thực tế.
- Phương pháp này giải quyết các vấn đề chính như an toàn đa luồng, tự động hóa việc serialization, và chỉ có một thể hiện duy nhất.

**Cách gọi**

```java
@Test
public void test() {
    Singleton_07.INSTANCE.test();
```

*Phương pháp này rất giống với phương pháp public field về chức năng, nhưng nó đơn giản hơn, cung cấp cơ chế serialization miễn phí, và ngăn chặn tuyệt đối việc tạo thêm thể hiện, ngay cả khi đối mặt với việc serialization phức tạp hoặc tấn công phản chiếu. Mặc dù phương pháp này chưa được sử dụng rộng rãi, nhưng kiểu enum với một phần tử đã trở thành phương pháp tốt nhất để triển khai Singleton.*

Tuy nhiên, cũng cần biết rằng phương pháp này không thể sử dụng trong các tình huống kế thừa.

## Tóm tắt

- Mặc dù chỉ là một Singleton Pattern thông thường, nhưng thực sự có thể thấy sự phản ánh của những kiến thức cơ bản của Java trong các cách triển khai khác nhau, bao gồm: lazy, eager, an toàn đa luồng, static class, inner class, lock, và serialization và nhiều hơn nữa.
- Trong quá trình phát triển hàng ngày, nếu có thể đảm bảo rằng lớp này có sẵn toàn cầu và không cần tải lười biếng, thì chỉ cần tạo ra và gọi từ bên ngoài là được. Nhưng nếu có nhiều lớp và một số cần hiển thị chỉ khi người dùng kích hoạt một số điều kiện nhất định (ví dụ: cấp độ trong trò chơi), thì nhất định phải sử dụng lazy load. Việc bảo đảm an toàn đa luồng có thể được chọn theo nhu cầu.
- Đề xuất rằng trong quá trình học, hãy nhất định thực hành, nếu không sẽ khó để hoàn thiện một hệ thống kiến thức hoàn chỉnh. Ví dụ, cuốn sách "Effective Java" được đề cập trong ví dụ cũng là một cuốn sách rất đáng để đọc. Ngoài ra, tôi cũng đề xuất khám phá GitHub của tác giả này: [https://github.com/jbloch](https://github.com/jbloch)
