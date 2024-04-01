---
title: Iterator Pattern Practice
tags:
  - design-pattern
categories: 
date created: 2024-04-01
date modified: 2024-04-01
---

# Iterator Pattern Practice: Mô phỏng mối quan hệ cấu trúc cây trong cơ cấu tổ chức của công ty và duyệt thông qua kịch bản đầu ra thông tin nhân sự

## Giới thiệu

`Hãy tin vào sức mạnh của niềm tin!`

Từ thời kỳ tuổi trẻ mông lung, đến khi nắm lấy bàn phím, có thể viết ra một "HelloWorld". Đa số mọi người trong chúng ta không cảm thấy điều này khó khăn và không nghĩ rằng không thể thực hiện được. Bởi vì với ví dụ như vậy, có sự hướng dẫn của giáo viên, có các ví dụ trong sách, có kinh nghiệm của người đi trước. Nhưng khi thời gian phát triển của bạn ngày càng dài, và bạn phải giải quyết các vấn đề phức tạp hơn hoặc đổi mới công nghệ, sau một vài ngày tìm kiếm trên mạng mà không tìm được câu trả lời, liệu bạn có nghĩ đến việc từ bỏ, hay vẫn kiên trì thử nghiệm từng chút một để hoàn thành kết quả mà bạn mong muốn không? Thường thì, trong những tình huống không có kinh nghiệm trước, khi bạn phải tự giải quyết vấn đề, có thể thực sự làm bạn bị quằn quại đến nỗi muốn bỏ cuộc, nhưng nếu bạn sẵn lòng kiên định, sẵn lòng bước đi mặc kệ khó khăn, sẵn lòng tin vào sức mạnh của niềm tin, thì bạn nhất định có thể giải quyết được. Thậm chí nếu không thể giải quyết được, bạn cũng có thể khám phá được nhiều điều hơn trên con đường này, để đóng vai trò như một bước đệm cho những bước tiến sau này.

`Thời gian hạn hẹp không phải là lý do để viết code lỗi!`

Vặn ốc? Ctrl+C, Ctrl+V? Viết code như dán miếng băng dính? Không có cách nào, không có thời gian, thường thì đó chỉ là lý do gợi ý, chỉ khi trái tim bạn không có nét mực, bạn mới phải chấp nhận tình trạng hiện tại. Liệu việc viết code tốt chỉ là lãng phí thời gian, hay việc ghép nối CRUD sẽ nhanh hơn, điều này hoàn toàn không thể. Bởi vì không biết, chưa từng thực hành, ít khi xây dựng được thiết kế toàn bộ cảnh quan, mới là lý do khiến việc viết code tốt khó khăn. Hãy tăng cường kỹ năng lập trình ("kỹ năng võ thuật") của bản thân, trở nên khéo léo trong mọi tình huống lập trình, để có thể đối phó với việc phát triển yêu cầu và sắp xếp nhân lực trong tình huống khẩn cấp. Giống như Hàn Tín vậy, có sự lên kế hoạch và chiến thuật, mới có thể giữ quyền lực trên hàng triệu quân lính.

`Đừng chỉ là một công cụ!`

Vì việc viết code yêu cầu kinh doanh đơn giản hàng ngày, dẫn đến việc bạn trở nên giống như một công cụ, sau một thời gian dài, bạn cũng ít khi đi sâu vào học tập về các công nghệ khác nhau. Khi thấy có công cụ, có thành phần, có khung, thì lấy ra sử dụng thôi, bởi vì không có gì nặng nề và cũng không có vấn đề gì phát sinh. Nhưng nếu bạn muốn có thu nhập cao hơn, thậm chí là việc tái tạo bánh xe, bạn cũng nên thử một lần, ngay cả khi không sử dụng trong sản xuất, bạn vẫn có thể làm được. Một số vấn đề chỉ khi bạn trải qua, mới có thể cảm nhận sâu sắc nhất, tham gia vào thực hành, mới có thể tổng hợp, đánh giá và học hỏi được.

## Môi trường phát triển

1. JDK 1.8
2. Idea + Maven
3. Code: [vanhung4499/practical-java-design](https://github.com/vanhung4499/practical-java-design)  

| Dự án             | Mô tả                                               |
| ----------------- | --------------------------------------------------- |
| demo-design-15-00 | Phát triển trình duyệt các mối quan hệ cây cấu trúc |

## Giới thiệu về Mẫu Iterator

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240401110019.png)

Mẫu Iterator, thường gặp trong việc sử dụng `iterator` để duyệt. Mặc dù mẫu thiết kế này không phổ biến trong các kịch bản phát triển thực tế của chúng ta, nhưng gần như mỗi ngày chúng ta đều phải sử dụng `iterator` mà JDK cung cấp cho chúng ta để duyệt các tập hợp `list`. Ngoài ra, mặc dù vòng lặp for được tăng cường là một vòng lặp để duyệt qua dữ liệu, nhưng nó không phải là mẫu Iterator. Đặc điểm của mẫu Iterator là triển khai giao diện `Iterable`, thông qua cách lấy phần tử của tập hợp bằng cách sử dụng `next`, đồng thời hỗ trợ các thao tác như xóa phần tử. Trong khi đó, vòng lặp for được tăng cường không thể thực hiện các thao tác này.

Lợi ích của mẫu thiết kế này là nó cho phép chúng ta duyệt qua các phần tử của các cấu trúc dữ liệu khác nhau theo cách tương tự, bao gồm; `mảng`, `danh sách liên kết`, `cây`, v.v. Khi sử dụng, người dùng không cần quan tâm đến logic xử lý duyệt từng cấu trúc dữ liệu khác nhau, từ đó làm cho việc sử dụng trở nên thống nhất và dễ dàng hơn.

## Mô phỏng Tình huống

**Trong trường hợp này, chúng tôi mô phỏng việc duyệt qua danh sách nhân viên trong cấu trúc tổ chức cây của công ty.**

Hầu hết các tổ chức công ty đều có cấu trúc tổ chức theo dạng kim tự tháp, cũng gọi là cấu trúc cây, chia thành các bộ phận cấp 1, cấp 2, cấp 3 và cứ tiếp tục như vậy. Mỗi bộ phận của tổ chức được điền đầy bởi nhân viên, cuối cùng tạo ra một mối quan hệ cấu trúc cây tổng thể.

Thường thì chúng ta sử dụng các phương pháp duyệt mặc định được cung cấp bởi JDK, để duyệt qua các tập hợp danh sách. Tuy nhiên, đối với cấu trúc cây với tính chất doanh nghiệp lớn như vậy, nếu cần duyệt qua, ta có thể tự thực hiện. Tiếp theo, chúng ta sẽ triển khai mối quan hệ cấu trúc cây này thông qua cấu trúc dữ liệu cây và hoàn thành chức năng của Iterator.

## Năm, Duyệt cấu trúc tổ chức bằng Iterator

Trước khi triển khai Iterator, bạn có thể đọc phần triển khai iterator trong phần về phương thức `list` trong Java. Gần như tất cả các triển khai Iterator sẽ tuân theo mẫu thiết kế này, mẫu thiết kế này chủ yếu chia thành các phần sau:

1. Collection: Phần phương thức của tập hợp được sử dụng để thêm các phương thức chung cho cấu trúc dữ liệu tùy chỉnh của bạn; `add`, `remove`, `iterator` và các phương thức cốt lõi khác.
2. Iterable: Cung cấp phương thức để lấy Iterator, giao diện này sẽ được Collection kế thừa.
3. Iterator: Cung cấp định nghĩa cho hai phương thức; `hasNext`, `next`, mà sẽ được triển khai trong cấu trúc dữ liệu cụ thể.

Ngoài cách triển khai iterator thông thường như trên, cấu trúc cây quan hệ tổ chức của chúng ta được hình thành từ các nút và mối quan hệ liên kết giữa các nút, vì vậy sẽ có một số tham số đầu vào hơn so với các phần trên.

### Cấu trúc dự án

```java
design-demo-15-00
├── pom.xml
└── src
    ├── main
    │   └── java
    │       └── com
    │           └── hnv99
    │               └── design
    │                   ├── group
    │                   │   ├── Employee.java
    │                   │   ├── GroupStructure.java
    │                   │   └── Link.java
    │                   └── lang
    │                       ├── Collection.java
    │                       ├── Iterable.java
    │                       └── Iterator.java
    └── test
        └── java
            └── com
                └── hnv99
                    └── design
                        └── ApiTest.java

```

**Cấu trúc mô hình của Iterator**

![Cấu trúc mô hình của Iterator](https://raw.githubusercontent.com/vanhung4499/images/master/snap/itstack-demo-design-15-03.png)

- Đây là cấu trúc lớp dự án của chúng tôi, phía bên trái là định nghĩa cho Iterator, phía bên phải là triển khai chức năng của Iterator trong cấu trúc dữ liệu.
- Phần bên trái là giống như cách triển khai trong JDK, vì vậy bạn có thể tham khảo nhau và mở rộng kiến thức của mình.
- Ngoài ra, cách duyệt này là duyệt sâu cây, để dễ hiểu hơn cho các bạn học, tôi đã triển khai một phương pháp duyệt cây khá đơn giản. *Bạn cũng có thể mở rộng việc duyệt thành duyệt ngang, tức là duyệt theo chiều rộng.*

### Triển khai code

#### Lớp thực thể Nhân viên

```java
/**
 * Nhân viên
 */
public class Employee {

    private String uId;   // ID
    private String name;  // Tên
    private String desc;  // Ghi chú
    
    // ...get/set
}
```

- Đây là một lớp đơn giản đại diện cho thông tin của nhân viên trong công ty, bao gồm các thông tin cần thiết như: id, tên, ghi chú.

#### Liên kết giữa các nút của cây

```java
/**
 * Liên kết giữa các nút của cây
 */
public class Link {

    private String fromId; // ID nhân viên gốc
    private String toId;   // ID nhân viên đích    
    
    // ...get/set
}
```

- Lớp này mô tả mối quan hệ giữa các nút trong cấu trúc cây, cụ thể là `A to B`, `B to C`, `B to D`, tạo thành một cấu trúc tổ chức cây hoàn chỉnh.

#### Định nghĩa Iterator

```java
public interface Iterator<E> {

    boolean hasNext();

    E next();
    
}
```

- Lớp này tương tự như lớp `Iterator` trong `jdk`, giúp bạn có thể tham khảo và học hỏi code nguồn của lớp `Iterator` trong `list`.
- Phương thức bao gồm: `hasNext`, kiểm tra xem có phần tử tiếp theo không, `next`, trả về phần tử tiếp theo. Các phương thức này thường được sử dụng khi duyệt qua danh sách.

#### Định nghĩa Iterable Interface

```java
public interface Iterable<E> {

    Iterator<E> iterator();

}
```

- Interface này cung cấp cách để nhận được triển khai của `Iterator` đã được định nghĩa ở trên, giúp bên ngoài có thể lấy và sử dụng nó.

#### Định nghĩa giao diện chức năng của Collection

```java
public interface Collection<E, L> extends Iterable<E> {

    boolean add(E e);

    boolean remove(E e);

    boolean addLink(String key, L l);

    boolean removeLink(String key);

    Iterator<E> iterator();

}
```

- Ở đây, chúng ta định nghĩa một giao diện cho các hoạt động liên quan đến tập hợp; `Collection`, đồng thời kế thừa một giao diện khác `Iterable` với phương thức `iterator()`. Điều này đảm bảo rằng các lớp triển khai giao diện này cần phải cung cấp một số chức năng cơ bản đã được định nghĩa như: `thêm phần tử`, `xóa phần tử`, `duyệt qua các phần tử`.
- Đồng thời, bạn có thể nhận thấy rằng ở đây chúng ta định nghĩa hai tham số kiểu `<E, L>`, vì cấu trúc dữ liệu của chúng ta cần một tham số để thêm các phần tử, và một tham số khác để thêm các mối quan hệ liên kết giữa các nút trong cây.

#### Triển khai chức năng duyệt

```java

public class GroupStructure implements Collection<Employee, Link> {

    private String groupId;                                                 // ID của tổ chức, cũng là ID của một chuỗi tổ chức
    private String groupName;                                               // Tên của tổ chức
    private Map<String, Employee> employeeMap = new ConcurrentHashMap<>();  // Danh sách nhân viên
    private Map<String, List<Link>> linkMap = new ConcurrentHashMap<>();  // Mối quan hệ cấu trúc tổ chức; id->list
    private Map<String, String> invertedMap = new ConcurrentHashMap<>();       // Mối quan hệ nghịch đảo

    public GroupStructure(String groupId, String groupName) {
        this.groupId = groupId;
        this.groupName = groupName;
    }

    public boolean add(Employee employee) {
        return null != employeeMap.put(employee.getUId(), employee);
    }

    public boolean remove(Employee o) {
        return null != employeeMap.remove(o.getUId());
    }

    public boolean addLink(String key, Link link) {
        invertedMap.put(link.getToId(), link.getFromId());
        if (linkMap.containsKey(key)) {
            return linkMap.get(key).add(link);
        } else {
            List<Link> links = new LinkedList<>();
            links.add(link);
            linkMap.put(key, links);
            return true;
        }
    }

    public boolean removeLink(String key) {
        return null != linkMap.remove(key);
    }

    public Iterator<Employee> iterator() {

        return new Iterator<Employee>() {

            HashMap<String, Integer> keyMap = new HashMap<>();

            int totalIdx = 0;
            private String fromId = groupId;  // ID của nhân viên, From
            private String toId = groupId;   // ID của nhân viên, To

            public boolean hasNext() {
                return totalIdx < employeeMap.size();
            }

            public Employee next() {
                List<Link> links = linkMap.get(toId);
                int cursorIdx = getCursorIdx(toId);

                // Quét các nút cùng cấp
                if (null == links) {
                    cursorIdx = getCursorIdx(fromId);
                    links = linkMap.get(fromId);
                }

                // Quét các nút cấp trên
                while (cursorIdx > links.size() - 1) {
                    fromId = invertedMap.get(fromId);
                    cursorIdx = getCursorIdx(fromId);
                    links = linkMap.get(fromId);
                }

                // Lấy nút
                Link link = links.get(cursorIdx);
                toId = link.getToId();
                fromId = link.getFromId();
                totalIdx++;

                // Trả về kết quả
                return employeeMap.get(link.getToId());
            }

            // Xác định tiến độ duyệt theo chiều ngang cho mỗi cấp
            public int getCursorIdx(String key) {
                int idx = 0;
                if (keyMap.containsKey(key)) {
                    idx = keyMap.get(key);
                    keyMap.put(key, ++idx);
                } else {
                    keyMap.put(key, idx);
                }
                return idx;
            }
        };
    }

}

```

- Phần code trên có một chút dài, chủ yếu bao gồm thêm và xóa phần tử. Một phần quan trọng khác là triển khai `new Iterator<Employee>` để lặp lại.
- Thêm và xóa phần tử khá đơn giản, chúng tôi sử dụng hai bản đồ `map` để định nghĩa; `danh sách nhân viên` và `mối quan hệ cấu trúc tổ chức; id->list`. Khi thêm một phần tử, chúng tôi sẽ thêm **mối quan hệ (A->B)** vào trong hai cấu trúc dữ liệu khác nhau.

**Triển khai duyệt**

1. Trong cấu trúc cây này, chúng ta cần làm là lặp lại theo chiều sâu, cũng chính là việc duyệt qua các nút bên trái cho đến khi tới nút sâu nhất.
2. Khi đến nút sâu nhất, bắt đầu duyệt qua các nút bên phải của nút sâu nhất đó.
3. Khi duyệt xong các nút bên phải, tiếp tục tìm kiếm các nút bên phải ở cấp trên cho đến khi duyệt xong toàn bộ cây.

### Kiểm thử

#### Viết lớp kiểm thử

```java
@Test
public void testIterator() { 
    // Điền dữ liệu
    GroupStructure groupStructure = new GroupStructure("1", "Xuân vị");  
    
    // Thông tin nhân viên
    groupStructure.add(new Employee("2", "Hoa hoa", "Bộ phận cấp 2"));
    groupStructure.add(new Employee("3", "Đậu bao", "Bộ phận cấp 2"));
    groupStructure.add(new Employee("4", "Bèo bèo", "Bộ phận cấp 3"));
    groupStructure.add(new Employee("5", "Đại thiêu", "Bộ phận cấp 3"));
    groupStructure.add(new Employee("6", "Hổ cao", "Bộ phận cấp 4"));
    groupStructure.add(new Employee("7", "Linh chị", "Bộ phận cấp 4"));
    groupStructure.add(new Employee("8", "Thu dã", "Bộ phận cấp 4"));   
    
    // Mối quan hệ nút 1->(1,2) 2->(4,5)
    groupStructure.addLink("1", new Link("1", "2"));
    groupStructure.addLink("1", new Link("1", "3"));
    groupStructure.addLink("2", new Link("2", "4"));
    groupStructure.addLink("2", new Link("2", "5"));
    groupStructure.addLink("5", new Link("5", "6"));
    groupStructure.addLink("5", new Link("5", "7"));
    groupStructure.addLink("5", new Link("5", "8"));       

    Iterator<Employee> iterator = groupStructure.iterator();
    while (iterator.hasNext()) {
        Employee employee = iterator.next();
        logger.info("{}，ID nhân viên：{} Tên：{}", employee.getDesc(), employee.getuId(), employee.getName());
    }
}
```

#### Kết quả

```shell
2024-04-01 11:47:46.578	INFO	main		(ApiTest.java:41)	|	Bộ phận cấp 2，ID nhân viên：2 Tên：Hoa hoa
2024-04-01 11:47:46.585	INFO	main		(ApiTest.java:41)	|	Bộ phận cấp 3，ID nhân viên：4 Tên：Bèo bèo
2024-04-01 11:47:46.585	INFO	main		(ApiTest.java:41)	|	Bộ phận cấp 3，ID nhân viên：5 Tên：Đại thiêu
2024-04-01 11:47:46.585	INFO	main		(ApiTest.java:41)	|	Bộ phận cấp 4，ID nhân viên：6 Tên：Hổ cao
2024-04-01 11:47:46.585	INFO	main		(ApiTest.java:41)	|	Bộ phận cấp 4，ID nhân viên：7 Tên：Linh chi
2024-04-01 11:47:46.586	INFO	main		(ApiTest.java:41)	|	Bộ phận cấp 4，ID nhân viên：8 Tên：Thu dã
2024-04-01 11:47:46.586	INFO	main		(ApiTest.java:41)	|	Bộ phận cấp 2，ID nhân viên：3 Tên：Đậu bao

```

- Từ kết quả của việc duyệt có thể thấy rằng, chúng ta duyệt theo chiều sâu của cấu trúc cây, từ đầu tiên đến nút phải cuối cùng **3**; `ID nhân viên：2, ID nhân viên：4…ID nhân viên：3`

## Tóm lại

- Mẫu thiết kế Iterator từ việc thực hiện chức năng có thể thấy rằng, nó đáp ứng nguyên tắc trách nhiệm duy nhất và nguyên tắc mở rộng, và bên gọi không cần phải biết bất kỳ sự khác biệt trong cách duyệt giữa các cấu trúc dữ liệu khác nhau. Điều này làm cho việc mở rộng trở nên rất dễ dàng và làm cho quá trình duyệt trở nên sạch sẽ hơn.
- Tuy nhiên, từ cấu trúc triển khai có thể thấy rằng, quá trình triển khai của mẫu Iterator tương đối phức tạp, và mở rộng một số lớp cần được định nghĩa bên ngoài, làm cho quá trình duyệt và cấu trúc dữ liệu gốc được tách biệt. Mặc dù điều này là khó chịu, nhưng có thể thấy rằng khi sử dụng Java SDK, mẫu Iterator vẫn rất hữu ích và dễ dàng mở rộng.
- Việc triển khai mô phỏng trường hợp mẫu thiết kế này có thể khó hiểu đối với người mới, bao gồm; định nghĩa ba giao diện của Iterator, mối quan hệ dữ liệu của cấu trúc cây, và cách duyệt cấu trúc cây theo chiều sâu. Điều này đòi hỏi thực hành lặp đi lặp lại để hiểu sâu hơn, tham gia và thực hành làm mới có thể nắm vững kiến thức này.
