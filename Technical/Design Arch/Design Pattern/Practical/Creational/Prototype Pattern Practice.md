---
title: Prototype Pattern Practice
tags:
  - design-pattern
categories: 
date created: 2024-03-26
date modified: 2024-03-27
---

# Prototype Pattern Practice: Sinh nhiều bộ đề thi, mỗi bộ có câu hỏi và câu trả lời bị sắp xếp ngẫu nhiên

## Giới thiệu

**Cố lên, sẽ được thưởng!**

Trong công việc làm lập trình viên có hai loại người: một là những người yêu thích và đam mê công việc của mình, hai là những người chỉ coi đó là công việc. Những người yêu thích lập trình sẽ tự chủ học hỏi để mở rộng kiến thức của họ và thường xuyên khám phá cách áp dụng kiến thức họ học vào việc phát triển yêu cầu kinh doanh hàng ngày. Với những người bạn nhỏ đó, việc viết code khi đi làm cũng là cách để kiếm tiền, đó thực sự là hạnh phúc!

**Làm sao để trở thành những người yêu thích code lập trình**

Việc bạn thích cái gì, thường là từ việc bạn thích cái đó, thường xuyên nhận được cảm giác thành công. Về lập trình, khi mỗi dòng code của bạn ảnh hưởng đến hàng triệu người, khi mỗi dòng code của bạn làm cho hệ thống trở nên ổn định hơn, khi mỗi dòng code của bạn chịu nổi tất cả các cuộc tấn công từ khác nhau, … Tất cả những dòng code như vậy đều là kinh nghiệm bạn học được qua từng ngày. Vì vậy, nếu bạn muốn trở thành một lập trình viên cảm thấy hạnh phúc như vậy, bạn cần tiếp tục học hỏi, tiếp tục áp dụng nhiều kiến thức kỹ năng để thực hiện code của bạn vào hệ thống cốt lõi hơn.

**Nếu không đi đúng hướng, sự nỗ lực sẽ trở nên vô ích**

Thường bạn đã bỏ ra rất nhiều thời gian, nhưng bạn không nhận được nhiều lợi ích. Ví dụ, đôi khi nhiều người hỏi tôi, tôi nên học một nội dung mà tôi chưa tiếp xúc bao giờ. Kinh nghiệm cá nhân của tôi rất khuyến khích, đầu tiên không nên học quá nhiều nội dung lý thuyết, mà thay vào đó hãy thử nghiệm thực tế, làm một số demo của nội dung bạn muốn học. Điều này giống như bạn mua một chiếc xe đạp và bạn có thể tháo rời nó và học cách hoạt động, hoặc bạn sẽ đạp một vài vòng trước? Ngay cả khi bạn gặp tai nạn, nhưng những kinh nghiệm đó vẫn là bắt buộc phải trải qua.

**Tôi cũng biết nhiều người không học được gì từ mẫu thiết kế vì họ không có ví dụ hoặc ví dụ không gần gũi với các kịch bản thực tế. Quá trời, quá ảo, quá ảo, không có điểm nắm bắt!**

Vì vậy, tôi bắt đầu viết bài để giải thích các mẫu thiết kế dựa trên các trường hợp thực tế, nhằm giúp mọi người phát triển đồng thời cho phép bản thân tích lũy một số kinh nghiệm!

## Môi trường phát triển

1. JDK 1.8
2. Idea + Maven
3. Code: [vanhung4499/practical-java-design](https://github.com/vanhung4499/practical-java-design)  

| Dự án            | Mô tả                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------- |
| demo-design-4-00 | Dự án mô phỏng, mô phỏng việc rút gọn và xáo trộn câu hỏi từ cơ sở dữ liệu câu hỏi trực tuyến |
| demo-design-4-01 | Sử dụng đoạn code để thực hiện yêu cầu kinh doanh, cũng là việc sử dụng if-else               |
| demo-design-4-02 | Tối ưu và tái cấu trúc code thông qua mẫu thiết kế, tạo ra so sánh để học hỏi                 |

## Giới thiệu về Prototype Pattern

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240326233242.png)

Prototype Pattern chủ yếu giải quyết vấn đề của việc tạo ra các đối tượng trùng lặp, trong đó nội dung của các `đối tượng` này thường phức tạp, quá trình tạo ra có thể tốn thời gian từ việc truy vấn cơ sở dữ liệu hoặc giao tiếp RPC, do đó việc sử dụng cách sao chép giúp tiết kiệm thời gian.

Thực tế, tình huống này thường xảy ra xung quanh chúng ta, chỉ là ít khi được sử dụng trong quá trình phát triển của chính mình, như:

1. Bạn thường `Ctrl+C`, `Ctrl+V`, sao chép và dán code.
2. Các phương thức API được cung cấp trong hầu hết các lớp Java: `Object clone()`.
3. Sự phân chia bào tử của tế bào.

Có nhiều tình huống tương tự như trên, nhưng nếu bạn được hỏi liệu bạn đã sử dụng mẫu thiết kế này trong code của mình hay không? Thực sự không dễ dàng tìm thấy, thậm chí đôi khi bạn có thể bỏ qua cách tiếp cận này. Trước khi đọc phần tiếp theo, bạn cũng có thể suy nghĩ về các tình huống nào có thể áp dụng được.

## Mô phỏng tình huống

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240326233746.png)

Mỗi người đều đã trải qua kỳ thi, từ phiên bản trên giấy đến phiên bản trực tuyến, có hàng trăm kỳ thi lớn nhỏ. Và trước đây, mỗi bài kiểm tra ngồi trong lớp học đều có cùng một bộ đề thi, và trong quá trình kiểm tra, có thể lén lút hoặc nhận tin nhắn từ người khác để sao chép câu trả lời.

Tuy nhiên, từ một phần nội dung có thể làm bài kiểm tra trực tuyến, dưới sự đảm bảo của các câu hỏi cùng loại, bắt đầu xuất hiện việc trộn lẫn các câu hỏi trong đề cùng với các câu trả lời tốt hơn. Điều này làm tăng chi phí sao chép và cũng đảm bảo công bằng trong kỳ thi.

**Nhưng nếu nhiệm vụ này cần được giao cho bạn, bạn sẽ làm như thế nào?**

Bởi vì cần triển khai một dịch vụ để chọn câu hỏi cho kỳ thi trực tuyến, vì vậy ở đây tạo một thông tin lớp học về câu hỏi trong ngân hàng câu hỏi, được sử dụng để tạo ra; `Câu hỏi chọn lựa` (_choices_) và `Câu hỏi trả lời` (_responses_).

### Mô phỏng Tình huống Dự án

```shell
design-demo-4-00/
├── pom.xml
└── src
    ├── main
    │   └── java
    │       └── com
    │           └── hnv99
    │               └── design
    │                   ├── AnswerQuestion.java
    │                   └── ChoiceQuestion.java
    └── test
        └── java
            └── com
                └── hnv99
                    └── design
                        └── ApiTest.java

```

- Ở đây mô phỏng hai lớp câu hỏi cho bài thi; `ChoiceQuestion`(_Câu hỏi chọn lựa_) và `AnswerQuestion`(_Câu hỏi trả lời_). Trong thực tế, trong quá trình phát triển kịch bản kinh doanh, có thể có nhiều loại câu hỏi hơn, bạn có thể nhớ lại bài thi đại học của mình.

### Mô tả Tình huống

#### Câu hỏi chọn lựa

```java
public class ChoiceQuestion {

    private String name;                 // Câu hỏi
    private Map<String, String> option;  // Các lựa chọn; A, B, C, D
    private String key;                  // Đáp án; B

    public ChoiceQuestion() {
    }

    public ChoiceQuestion(String name, Map<String, String> option, String key) {
        this.name = name;
        this.option = option;
        this.key = key;
    }

    // ...get/set
}
```

#### Câu hỏi Trả lời

```java
public class AnswerQuestion {

    private String name;  // Câu hỏi
    private String key;   // Đáp án

    public AnswerQuestion() {
    }

    public AnswerQuestion(String name, String key) {
        this.name = name;
        this.key = key;
    }

    // ...get/set
}
```

- Cả hai lớp trên là nội dung cần thiết trong tình huống của chúng ta, tương đối đơn giản. Nếu bạn muốn mở rộng phạm vi học hỏi trong quá trình thử nghiệm, bạn có thể tiếp tục thêm một số vật liệu khác (_loại câu hỏi_).

## Triển khai code

Trong các ví dụ sau đây, chúng tôi sẽ tạo ra các câu hỏi cho mỗi người dùng và trả về cho bên gọi.

### Cấu trúc dự án

```shell
design-demo-4-01/
├── pom.xml
└── src
    └── main
        └── java
            └── com
                └── hnv99
                    └── design
                        └── QuestionBankController.java
```

- Bạn đã từng thấy một lớp có một vài ngàn dòng code chưa? Được rồi, hôm nay hãy cho bạn thấy một lớp có tiềm năng như thế!

### Triển khai theo cách thông thường

```java
  
public class QuestionBankController {  
  
    public String createPaper(String candidate, String number) {  
  
        List<ChoiceQuestion> choiceQuestionList = new ArrayList<ChoiceQuestion>();  
        List<AnswerQuestion> answerQuestionList = new ArrayList<AnswerQuestion>();  
  
        Map<String, String> map01 = new HashMap<String, String>();  
        map01.put("A", "JAVA2 EE");  
        map01.put("B", "JAVA2 Card");  
        map01.put("C", "JAVA2 ME");  
        map01.put("D", "JAVA2 HE");  
        map01.put("E", "JAVA2 SE");  
  
        Map<String, String> map02 = new HashMap<String, String>();  
        map02.put("A", "Phương thức main của JAVA phải được viết trong một lớp");  
        map02.put("B", "Trong JAVA có thể có nhiều phương thức main");  
        map02.put("C", "Tên lớp trong JAVA phải giống với tên tệp");  
        map02.put("D", "Trong phương thức main của JAVA, nếu chỉ có một câu lệnh, có thể không cần {} (ngoặc nhọn) bao quanh");  
  
        Map<String, String> map03 = new HashMap<String, String>();  
        map03.put("A", "Biến có thể được tạo thành từ chữ cái, dấu gạch dưới, số, và ký tự $");  
        map03.put("B", "Biến không thể bắt đầu bằng số");  
        map03.put("C", "A và a là cùng một biến trong JAVA");  
        map03.put("D", "Các biến khác nhau có thể có cùng tên");  
  
        Map<String, String> map04 = new HashMap<String, String>();  
        map04.put("A", "STRING");  
        map04.put("B", "x3x;");  
        map04.put("C", "void");  
        map04.put("D", "de$f");  
  
        Map<String, String> map05 = new HashMap<String, String>();  
        map05.put("A", "31");  
        map05.put("B", "0");  
        map05.put("C", "1");  
        map05.put("D", "2");  
  
        choiceQuestionList.add(new ChoiceQuestion("Các phiên bản JAVA sau đây không bao gồm", map01, "D"));  
        choiceQuestionList.add(new ChoiceQuestion("Câu nào dưới đây đúng", map02, "A"));  
        choiceQuestionList.add(new ChoiceQuestion("Quy tắc đặt tên biến đúng là", map03, "B"));  
        choiceQuestionList.add(new ChoiceQuestion("() sau đây không phải là một biến hợp lệ", map04, "C"));  
        choiceQuestionList.add(new ChoiceQuestion("Giá trị của biểu thức (11+3*8)/4%3 là", map05, "D"));  
        answerQuestionList.add(new AnswerQuestion("Ngựa con của ngựa đỏ và ngựa đen có bao nhiêu chân", "4 chân"));  
        answerQuestionList.add(new AnswerQuestion("Đánh đầu bằng gậy sắt hay gậy gỗ đau hơn", "Đầu đau nhất"));  
        answerQuestionList.add(new AnswerQuestion("Cái gì không phải là chiếc giường có thể ngủ", "Chiếc giường răng"));  
        answerQuestionList.add(new AnswerQuestion("Tại sao ngựa tốt không ăn cỏ cũ", "Cỏ phía sau đã không còn"));  
  
        // Xuất kết quả  
        StringBuilder detail = new StringBuilder("Thí sinh: " + candidate + "\r\n" +  
                "Số báo danh: " + number + "\r\n" +  
                "--------------------------------------------\r\n" +  
                "I. Câu hỏi lựa chọn" + "\r\n\n");  
  
        for (int idx = 0; idx < choiceQuestionList.size(); idx++) {  
            detail.append("Câu ").append(idx + 1).append(": ").append(choiceQuestionList.get(idx).getName()).append("\r\n");  
            Map<String, String> option = choiceQuestionList.get(idx).getOption();  
            for (String key : option.keySet()) {  
                detail.append(key).append(": ").append(option.get(key)).append("\r\n");  
            }            detail.append("Đáp án: ").append(choiceQuestionList.get(idx).getKey()).append("\r\n\n");  
        }  
        detail.append("II. Câu hỏi trả lời" + "\r\n\n");  
  
        for (int idx = 0; idx < answerQuestionList.size(); idx++) {  
            detail.append("Câu ").append(idx + 1).append(": ").append(answerQuestionList.get(idx).getName()).append("\r\n");  
            detail.append("Đáp án: ").append(answerQuestionList.get(idx).getKey()).append("\r\n\n");  
        }  
        return detail.toString();  
    }  
}
```

- Loại code như vậy thường rất dễ hiểu, cung cấp code cho những gì cần, không phải là hướng đối tượng, chỉ hướng thủ tục. Không xem xét tính mở rộng, chỉ cần chạy được là được.
- code trên chia thành ba phần chính: đầu tiên là tạo câu hỏi lựa chọn và câu hỏi trả lời vào các tập hợp, định nghĩa chuỗi chi tiết để bao gói kết quả, và trả về nội dung kết quả.
- Nhưng code trên có một điểm chưa được thực hiện là không thể xáo trộn, thứ tự đề của tất cả mọi người đều giống nhau. Nếu cần thêm tính năng xáo trộn, cũng có thể, nhưng độ phức tạp sẽ tăng lên. _Ở đây không hiển thị cụ thể quá nhiều việc triển khai, chỉ để so sánh với việc tái cấu trúc trong phần sau_.

### Kiểm thử

Tiếp theo, chúng ta sẽ viết unit test qua JUnit, nhấn mạnh rằng việc viết unit test hàng ngày có thể nâng cao tính chắc chắn của hệ thống.

**Unit test**

```java
public class ApiTest {  
  
    @Test  
    public void test_QuestionBankController() {  
        QuestionBankController questionBankController = new QuestionBankController();  
        System.out.println(questionBankController.createPaper("Hung Nguyen", "1000001921032"));  
        System.out.println(questionBankController.createPaper("An Nguyen", "1000001921051"));  
        System.out.println(questionBankController.createPaper("Bao Nguyen", "1000001921987"));  
    }  
}

```

**Kết quả**

```shell
Thí sinh: Hung Nguyen
Số báo danh: 1000001921032
--------------------------------------------
I. Câu hỏi lựa chọn

Câu 1: Các phiên bản JAVA sau đây không bao gồm
A: JAVA2 EE
B: JAVA2 Card
C: JAVA2 ME
D: JAVA2 HE
E: JAVA2 SE
Đáp án: D

Câu 2: Câu nào dưới đây đúng
A: Phương thức main của JAVA phải được viết trong một lớp
B: Trong JAVA có thể có nhiều phương thức main
C: Tên lớp trong JAVA phải giống với tên tệp
D: Trong phương thức main của JAVA, nếu chỉ có một câu lệnh, có thể không cần {} (ngoặc nhọn) bao quanh
Đáp án: A

Câu 3: Quy tắc đặt tên biến đúng là
A: Biến có thể được tạo thành từ chữ cái, dấu gạch dưới, số, và ký tự $
B: Biến không thể bắt đầu bằng số
C: A và a là cùng một biến trong JAVA
D: Các biến khác nhau có thể có cùng tên
Đáp án: B

Câu 4: () sau đây không phải là một biến hợp lệ
A: STRING
B: x3x;
C: void
D: de$f
Đáp án: C

Câu 5: Giá trị của biểu thức (11+3*8)/4%3 là
A: 31
B: 0
C: 1
D: 2
Đáp án: D

II. Câu hỏi trả lời

Câu 1: Ngựa con của ngựa đỏ và ngựa đen có bao nhiêu chân
Đáp án: 4 chân

Câu 2: Đánh đầu bằng gậy sắt hay gậy gỗ đau hơn
Đáp án: Đầu đau nhất

Câu 3: Cái gì không phải là chiếc giường có thể ngủ
Đáp án: Chiếc giường răng

Câu 4: Tại sao ngựa tốt không ăn cỏ cũ
Đáp án: Cỏ phía sau đã không còn


Thí sinh: An Nguyen
Số báo danh: 1000001921051
--------------------------------------------
I. Câu hỏi lựa chọn

Câu 1: Các phiên bản JAVA sau đây không bao gồm
A: JAVA2 EE
B: JAVA2 Card
C: JAVA2 ME
D: JAVA2 HE
E: JAVA2 SE
Đáp án: D

Câu 2: Câu nào dưới đây đúng
A: Phương thức main của JAVA phải được viết trong một lớp
B: Trong JAVA có thể có nhiều phương thức main
C: Tên lớp trong JAVA phải giống với tên tệp
D: Trong phương thức main của JAVA, nếu chỉ có một câu lệnh, có thể không cần {} (ngoặc nhọn) bao quanh
Đáp án: A

Câu 3: Quy tắc đặt tên biến đúng là
A: Biến có thể được tạo thành từ chữ cái, dấu gạch dưới, số, và ký tự $
B: Biến không thể bắt đầu bằng số
C: A và a là cùng một biến trong JAVA
D: Các biến khác nhau có thể có cùng tên
Đáp án: B

Câu 4: () sau đây không phải là một biến hợp lệ
A: STRING
B: x3x;
C: void
D: de$f
Đáp án: C

Câu 5: Giá trị của biểu thức (11+3*8)/4%3 là
A: 31
B: 0
C: 1
D: 2
Đáp án: D

II. Câu hỏi trả lời

Câu 1: Ngựa con của ngựa đỏ và ngựa đen có bao nhiêu chân
Đáp án: 4 chân

Câu 2: Đánh đầu bằng gậy sắt hay gậy gỗ đau hơn
Đáp án: Đầu đau nhất

Câu 3: Cái gì không phải là chiếc giường có thể ngủ
Đáp án: Chiếc giường răng

Câu 4: Tại sao ngựa tốt không ăn cỏ cũ
Đáp án: Cỏ phía sau đã không còn


Thí sinh: Bao Nguyen
Số báo danh: 1000001921987
--------------------------------------------
I. Câu hỏi lựa chọn

Câu 1: Các phiên bản JAVA sau đây không bao gồm
A: JAVA2 EE
B: JAVA2 Card
C: JAVA2 ME
D: JAVA2 HE
E: JAVA2 SE
Đáp án: D

Câu 2: Câu nào dưới đây đúng
A: Phương thức main của JAVA phải được viết trong một lớp
B: Trong JAVA có thể có nhiều phương thức main
C: Tên lớp trong JAVA phải giống với tên tệp
D: Trong phương thức main của JAVA, nếu chỉ có một câu lệnh, có thể không cần {} (ngoặc nhọn) bao quanh
Đáp án: A

Câu 3: Quy tắc đặt tên biến đúng là
A: Biến có thể được tạo thành từ chữ cái, dấu gạch dưới, số, và ký tự $
B: Biến không thể bắt đầu bằng số
C: A và a là cùng một biến trong JAVA
D: Các biến khác nhau có thể có cùng tên
Đáp án: B

Câu 4: () sau đây không phải là một biến hợp lệ
A: STRING
B: x3x;
C: void
D: de$f
Đáp án: C

Câu 5: Giá trị của biểu thức (11+3*8)/4%3 là
A: 31
B: 0
C: 1
D: 2
Đáp án: D

II. Câu hỏi trả lời

Câu 1: Ngựa con của ngựa đỏ và ngựa đen có bao nhiêu chân
Đáp án: 4 chân

Câu 2: Đánh đầu bằng gậy sắt hay gậy gỗ đau hơn
Đáp án: Đầu đau nhất

Câu 3: Cái gì không phải là chiếc giường có thể ngủ
Đáp án: Chiếc giường răng

Câu 4: Tại sao ngựa tốt không ăn cỏ cũ
Đáp án: Cỏ phía sau đã không còn

```

- Ở trên là bài thi của ba người. Mỗi người có cùng một nội dung đề thi không có vấn đề, nhưng câu hỏi và thứ tự các lựa chọn của ba người đều giống nhau, không đáp ứng yêu cầu xáo trộn như chúng ta mong muốn.
- Ngoài ra, code như vậy rất khó mở rộng, với sự tăng lên của số lượng câu hỏi và tính năng xáo trộn, đoạn code này sẽ trở nên rối rắm hơn và rối rắm hơn.

## Tái cấu trúc theo Prototype Pattern

**Tiếp theo, chúng ta sẽ sử dụng Prototype Pattern để tối ưu code, cũng có thể coi đây là một phần nhỏ của việc tái cấu trúc.**

Prototype Pattern chủ yếu giải quyết vấn đề tạo ra nhiều lớp trùng lặp, trong khi kịch bản mô phỏng của chúng ta cần tạo ra các đề thi giống nhau cho các người dùng khác nhau, nhưng việc lấy các câu hỏi từ thư viện mỗi lần là không thuận tiện, thậm chí đôi khi cần gọi RPC từ xa. Điều này tốn thời gian rất nhiều, và với sự gia tăng của số lượng đối tượng được tạo ra, sẽ ảnh hưởng nghiêm trọng đến hiệu suất.

Trong Prototype Pattern, phương tiện quan trọng mà chúng ta cần là việc sao chép, mọi lớp cần sao chép cần phải triển khai interface `implements Cloneable`.

### Cấu trúc dự án

```shell
design-demo-4-02/
├── pom.xml
└── src
    ├── main
    │   └── java
    │       └── com
    │           └── hnv99
    │               └── design
    │                   ├── QuestionBank.java
    │                   ├── QuestionBankController.java
    │                   └── utils
    │                       ├── Topic.java
    │                       └── TopicRandomUtil.java
    └── test
        └── java
            └── com
                └── hnv99
                    └── design
                        └── ApiTest.java

```

**Cấu trúc Prototype Pattern**

- Dự án bao gồm lớp chính của thư viện đề thi `QuestionBank`, thư viện đề thi chịu trách nhiệm tổ chức các câu hỏi và đầu ra cuối cùng là đề thi.
- Đối với mỗi đề thi, chúng ta sẽ sao chép bằng cách sử dụng phương thức clone, sau khi sao chép xong, các câu hỏi và câu trả lời của mỗi câu hỏi sẽ được xáo trộn. Ở đây cung cấp một bộ công cụ: `TopicRandomUtil`.

### Triển khai mã

#### Công cụ xáo trộn các lựa chọn câu hỏi

```java
  
public class TopicRandomUtil {  
  
    /**  
     * Pha trộn các phần tử trong Map, ghi lại key đáp án tương ứng     * @param option Câu hỏi  
     * @param key    Đáp án  
     * @return Topic Sau khi pha trộn {A=c., B=d., C=a., D=b.}  
     */    static public Topic random(Map<String, String> option, String key) {  
        Set<String> keySet = option.keySet();  
        List<String> keyList = new ArrayList<>(keySet);  
        Collections.shuffle(keyList);  
        HashMap<String, String> optionNew = new HashMap<>();  
        int idx = 0;  
        String keyNew = "";  
        for (String next : keySet) {  
            String randomKey = keyList.get(idx++);  
            if (key.equals(next)) {  
                keyNew = randomKey;  
            }            optionNew.put(randomKey, option.get(next));  
        }        return new Topic(optionNew, keyNew);  
    }  
}
```

- Trong phần trước, chúng ta đã sử dụng Map để lưu trữ các lựa chọn cho câu hỏi, và thuộc tính key của map được sử dụng để lưu trữ câu trả lời đúng. Nếu bạn quên, bạn có thể lướt lại phần trước.
- Chức năng của lớp công cụ này là thực hiện việc xáo trộn các phần tử trong Map ban đầu, "nghĩa là nội dung lựa chọn A được chuyển đến B", "lựa chọn của B có thể được chuyển đến C", đồng thời ghi lại vị trí của câu trả lời đúng sau khi xử lý.

#### Lớp xử lý đối tượng sao chép

```java
@Setter  
public class QuestionBank {  
  
    private String candidate; // Thí sinh  
    private String number;    // Số báo danh  
  
    private ArrayList<ChoiceQuestion> choiceQuestionList = new ArrayList<>();  
    private ArrayList<AnswerQuestion> answerQuestionList = new ArrayList<>();  
  
    public QuestionBank append(ChoiceQuestion choiceQuestion) {  
        choiceQuestionList.add(choiceQuestion);  
        return this;  
    }  
    public QuestionBank append(AnswerQuestion answerQuestion) {  
        answerQuestionList.add(answerQuestion);  
        return this;  
    }  
    @Override  
    public Object clone() throws CloneNotSupportedException {  
        QuestionBank questionBank = (QuestionBank) super.clone();  
        questionBank.choiceQuestionList = (ArrayList<ChoiceQuestion>) choiceQuestionList.clone();  
        questionBank.answerQuestionList = (ArrayList<AnswerQuestion>) answerQuestionList.clone();  
  
        // Xáo trộn câu hỏi  
        Collections.shuffle(questionBank.choiceQuestionList);  
        Collections.shuffle(questionBank.answerQuestionList);  
        // Xáo trộn đáp án  
        for (ChoiceQuestion question : questionBank.choiceQuestionList) {  
            Topic random = TopicRandomUtil.random(question.getOption(), question.getKey());  
            question.setOption(random.getOption());  
            question.setKey(random.getKey());  
        }        return questionBank;  
    }  
    @Override  
    public String toString() {  
  
        StringBuilder detail = new StringBuilder("Thí sinh: " + candidate + "\r\n" +  
                "Số báo danh: " + number + "\r\n" +  
                "--------------------------------------------\r\n" +  
                "I. Câu hỏi lựa chọn" + "\r\n\n");  
  
        for (int idx = 0; idx < choiceQuestionList.size(); idx++) {  
            detail.append("Câu ").append(idx + 1).append(": ").append(choiceQuestionList.get(idx).getName()).append("\r\n");  
            for (String key : choiceQuestionList.get(idx).getOption().keySet()) {  
                detail.append(key).append(": ").append(choiceQuestionList.get(idx).getOption().get(key)).append("\r\n");  
            }            detail.append("Đáp án: ").append(choiceQuestionList.get(idx).getKey()).append("\r\n\n");  
        }  
        detail.append("II. Câu hỏi trả lời" + "\r\n\n");  
  
        for (int idx = 0; idx < answerQuestionList.size(); idx++) {  
            detail.append("Câu ").append(idx + 1).append(": ").append(answerQuestionList.get(idx).getName()).append("\r\n");  
            detail.append("Đáp án: ").append(answerQuestionList.get(idx).getKey()).append("\r\n\n");  
        }  
        return detail.toString();  
    }  
}
```

Ở đây có ba hoạt động chính:

- Hai phương thức `append()`, được sử dụng để thêm các câu hỏi vào bộ đề, giống như cách chúng ta sử dụng trong mẫu thiết kế Builder để thêm các vật liệu trang trí.
- Phương thức `clone()`, hoạt động cốt lõi ở đây là sao chép đối tượng, sao chép không chỉ bao gồm đối tượng chính nó mà còn sao chép hai tập hợp. Chỉ có cách sao chép như vậy mới đảm bảo rằng việc sao chép đối tượng không ảnh hưởng đến đối tượng gốc.
- Hoạt động xáo trộn, trong tập hợp `list`, có một phương thức, `Collections.shuffle()`, có thể xáo trộn thứ tự của tập hợp gốc và xuất ra một thứ tự mới. Ở đây, chúng ta sử dụng phương thức này để xáo trộn các câu hỏi.

#### Khởi tạo dữ liệu bài thi

```java
  
public class QuestionBankController {  
  
    private final QuestionBank questionBank = new QuestionBank();  
  
    public QuestionBankController() {  
  
        Map<String, String> map01 = new HashMap<>();  
        map01.put("A", "JAVA2 EE");  
        map01.put("B", "JAVA2 Card");  
        map01.put("C", "JAVA2 ME");  
        map01.put("D", "JAVA2 HE");  
        map01.put("E", "JAVA2 SE");  
  
        Map<String, String> map02 = new HashMap<>();  
        map02.put("A", "Phương thức main của JAVA phải được viết trong lớp");  
        map02.put("B", "Trong JAVA, có thể có nhiều phương thức main");  
        map02.put("C", "Trong JAVA, tên lớp phải giống với tên tệp");  
        map02.put("D", "Trong phương thức main của JAVA, nếu chỉ có một câu lệnh, có thể không cần dùng dấu {} (ngoặc nhọn)");  
  
        Map<String, String> map03 = new HashMap<>();  
        map03.put("A", "Biến có thể được tạo ra từ chữ cái, dấu gạch dưới, số, và ký tự $");  
        map03.put("B", "Biến không thể bắt đầu bằng số");  
        map03.put("C", "A và a được xem như là một biến duy nhất trong JAVA");  
        map03.put("D", "Các biến khác nhau có thể được đặt tên giống nhau");  
  
        Map<String, String> map04 = new HashMap<>();  
        map04.put("A", "STRING");  
        map04.put("B", "x3x;");  
        map04.put("C", "void");  
        map04.put("D", "de$f");  
  
        Map<String, String> map05 = new HashMap<>();  
        map05.put("A", "31");  
        map05.put("B", "0");  
        map05.put("C", "1");  
        map05.put("D", "2");  
  
        questionBank.append(new ChoiceQuestion("JAVA không bao gồm phiên bản nào sau đây", map01, "D"))  
                .append(new ChoiceQuestion("Câu nào sau đây là đúng", map02, "A"))  
                .append(new ChoiceQuestion("Câu nào sau đây là đúng về quy tắc đặt tên biến", map03, "B"))  
                .append(new ChoiceQuestion("Cái nào sau đây không phải là một biến hợp lệ",map04, "C"))  
                .append(new ChoiceQuestion("Giá trị của biểu thức (11+3*8)/4%3 là", map05, "D"))  
                .append(new AnswerQuestion("Mấy chân của con ngựa con của ngựa đực đỏ và ngựa đực đen", "4 chân"))  
                .append(new AnswerQuestion("Nên đánh đầu bằng gậy sắt hay gậy gỗ", "Đầu là chỗ đau nhất"))  
                .append(new AnswerQuestion("Chiếc giường nào không thể ngủ", "Giường răng"))  
                .append(new AnswerQuestion("Tại sao ngựa tốt không ăn cỏ ở phía sau", "Cỏ ở phía sau không còn nữa"));  
    }  
    public String createPaper(String candidate, String number) throws CloneNotSupportedException {  
        QuestionBank questionBankClone = (QuestionBank) questionBank.clone();  
        questionBankClone.setCandidate(candidate);  
        questionBankClone.setNumber(number);  
        return questionBankClone.toString();  
    }  
}
```

- Nội dung của lớp này khá đơn giản, chủ yếu cung cấp các hoạt động khởi tạo mẫu cho nội dung của bài thi (_tất cả các bài thi của thí sinh đều giống nhau, nhưng thứ tự các câu hỏi không giống nhau_).
- Ngoài ra, nó cung cấp phương thức để tạo bài thi cho bên ngoài, trong quá trình tạo, nó sử dụng phương thức sao chép: `(QuestionBank) questionBank.clone();`, và cuối cùng trả về thông tin bài thi.

### Kiểm thử

**Unit test**

```java
  
public class ApiTest {  
  
    @Test  
    public void test_QuestionBankController() throws CloneNotSupportedException {  
        QuestionBankController questionBankController = new QuestionBankController();  
        System.out.println(questionBankController.createPaper("Hung Nguyen", "1000001921032"));  
        System.out.println(questionBankController.createPaper("An Nguyen", "1000001921051"));  
        System.out.println(questionBankController.createPaper("Bao Nguyen", "1000001921987"));  
    }  
}
```

**Kết quả**

```java
Thí sinh: Hung Nguyen
Số báo danh: 1000001921032
--------------------------------------------
I. Câu hỏi lựa chọn

Câu 1: JAVA không bao gồm phiên bản nào sau đây
A: JAVA2 HE
B: JAVA2 EE
C: JAVA2 ME
D: JAVA2 Card
E: JAVA2 SE
Đáp án: A

Câu 2: Câu nào sau đây là đúng
A: Trong phương thức main của JAVA, nếu chỉ có một câu lệnh, có thể không cần dùng dấu {} (ngoặc nhọn)
B: Phương thức main của JAVA phải được viết trong lớp
C: Trong JAVA, có thể có nhiều phương thức main
D: Trong JAVA, tên lớp phải giống với tên tệp
Đáp án: B

Câu 3: Giá trị của biểu thức (11+3*8)/4%3 là
A: 31
B: 2
C: 0
D: 1
Đáp án: B

Câu 4: Cái nào sau đây không phải là một biến hợp lệ
A: void
B: de$f
C: x3x;
D: STRING
Đáp án: A

Câu 5: Câu nào sau đây là đúng về quy tắc đặt tên biến
A: A và a được xem như là một biến duy nhất trong JAVA
B: Biến có thể được tạo ra từ chữ cái, dấu gạch dưới, số, và ký tự $
C: Biến không thể bắt đầu bằng số
D: Các biến khác nhau có thể được đặt tên giống nhau
Đáp án: C

II. Câu hỏi trả lời

Câu 1: Mấy chân của con ngựa con của ngựa đực đỏ và ngựa đực đen
Đáp án: 4 chân

Câu 2: Tại sao ngựa tốt không ăn cỏ ở phía sau
Đáp án: Cỏ ở phía sau không còn nữa

Câu 3: Chiếc giường nào không thể ngủ
Đáp án: Giường răng

Câu 4: Nên đánh đầu bằng gậy sắt hay gậy gỗ
Đáp án: Đầu là chỗ đau nhất


Thí sinh: An Nguyen
Số báo danh: 1000001921051
--------------------------------------------
I. Câu hỏi lựa chọn

Câu 1: Câu nào sau đây là đúng
A: Trong JAVA, có thể có nhiều phương thức main
B: Trong phương thức main của JAVA, nếu chỉ có một câu lệnh, có thể không cần dùng dấu {} (ngoặc nhọn)
C: Phương thức main của JAVA phải được viết trong lớp
D: Trong JAVA, tên lớp phải giống với tên tệp
Đáp án: C

Câu 2: Giá trị của biểu thức (11+3*8)/4%3 là
A: 0
B: 31
C: 1
D: 2
Đáp án: D

Câu 3: Cái nào sau đây không phải là một biến hợp lệ
A: de$f
B: x3x;
C: void
D: STRING
Đáp án: C

Câu 4: Câu nào sau đây là đúng về quy tắc đặt tên biến
A: Các biến khác nhau có thể được đặt tên giống nhau
B: Biến không thể bắt đầu bằng số
C: A và a được xem như là một biến duy nhất trong JAVA
D: Biến có thể được tạo ra từ chữ cái, dấu gạch dưới, số, và ký tự $
Đáp án: B

Câu 5: JAVA không bao gồm phiên bản nào sau đây
A: JAVA2 Card
B: JAVA2 ME
C: JAVA2 EE
D: JAVA2 SE
E: JAVA2 HE
Đáp án: E

II. Câu hỏi trả lời

Câu 1: Tại sao ngựa tốt không ăn cỏ ở phía sau
Đáp án: Cỏ ở phía sau không còn nữa

Câu 2: Chiếc giường nào không thể ngủ
Đáp án: Giường răng

Câu 3: Mấy chân của con ngựa con của ngựa đực đỏ và ngựa đực đen
Đáp án: 4 chân

Câu 4: Nên đánh đầu bằng gậy sắt hay gậy gỗ
Đáp án: Đầu là chỗ đau nhất


Thí sinh: Bao Nguyen
Số báo danh: 1000001921987
--------------------------------------------
I. Câu hỏi lựa chọn

Câu 1: Câu nào sau đây là đúng
A: Trong JAVA, tên lớp phải giống với tên tệp
B: Phương thức main của JAVA phải được viết trong lớp
C: Trong phương thức main của JAVA, nếu chỉ có một câu lệnh, có thể không cần dùng dấu {} (ngoặc nhọn)
D: Trong JAVA, có thể có nhiều phương thức main
Đáp án: B

Câu 2: Cái nào sau đây không phải là một biến hợp lệ
A: STRING
B: de$f
C: void
D: x3x;
Đáp án: C

Câu 3: Câu nào sau đây là đúng về quy tắc đặt tên biến
A: Biến có thể được tạo ra từ chữ cái, dấu gạch dưới, số, và ký tự $
B: A và a được xem như là một biến duy nhất trong JAVA
C: Biến không thể bắt đầu bằng số
D: Các biến khác nhau có thể được đặt tên giống nhau
Đáp án: C

Câu 4: Giá trị của biểu thức (11+3*8)/4%3 là
A: 2
B: 0
C: 31
D: 1
Đáp án: A

Câu 5: JAVA không bao gồm phiên bản nào sau đây
A: JAVA2 Card
B: JAVA2 EE
C: JAVA2 ME
D: JAVA2 SE
E: JAVA2 HE
Đáp án: E

II. Câu hỏi trả lời

Câu 1: Nên đánh đầu bằng gậy sắt hay gậy gỗ
Đáp án: Đầu là chỗ đau nhất

Câu 2: Chiếc giường nào không thể ngủ
Đáp án: Giường răng

Câu 3: Mấy chân của con ngựa con của ngựa đực đỏ và ngựa đực đen
Đáp án: 4 chân

Câu 4: Tại sao ngựa tốt không ăn cỏ ở phía sau
Đáp án: Cỏ ở phía sau không còn nữa
```

**Từ kết quả xuất ra ở trên, có thể thấy rằng, các câu hỏi và câu trả lời của mỗi người đều được xáo trộn và khác biệt.**

## Tổng kết

- Trong ví dụ trên, chúng ta đã mô phỏng được vai trò của Prototype Pattern trong việc tái cấu trúc trong phát triển thực tế. Tuy nhiên, tần suất sử dụng Prototype Pattern thực sự không cao. Nếu có một số tình huống đặc biệt cần sử dụng, ta cũng có thể tối ưu hóa theo mẫu này.
- Ngoài ra, các điểm lợi ích của Prototype Pattern bao gồm: dễ dàng tạo ra đối tượng phức tạp thông qua việc sao chép, cũng có thể tránh được việc thực hiện lại các hoạt động khởi tạo, không cần phụ thuộc vào các lớp khác trong cùng một lớp. Tuy nhiên, cũng có một số điểm nhược điểm, như khi sao chép đối tượng chứa các tham chiếu lặp lại, hoặc khi sử dụng sao chép đối tượng sâu trong lớp, đều làm cho mẫu này trở nên phức tạp.
- Cuối cùng, mẫu thiết kế là một hệ thống tư duy toàn diện. Sử dụng một cách hợp lý trong các tình huống khác nhau có thể cải thiện chất lượng kiến trúc tổng thể. Không bao giờ nên cố gắng áp dụng một mẫu thiết kế một cách cứng nhắc, nếu không sẽ dẫn đến thiết kế quá mức và tăng chi phí phát triển và bảo trì khi cần phải thích ứng với các yêu cầu thay đổi của doanh nghiệp.
- Giai đoạn ban đầu là tối ưu hóa mã nguồn, ở giữa là sử dụng các mẫu thiết kế, và cuối cùng là xây dựng dịch vụ tổng thể. Liên tục cải thiện khả năng quản lý tổng thể của bản thân, cũng như sâu sắc hơn trong việc xử lý chi tiết là cách tiếp cận tốt nhất của một lập trình viên. Khả năng thích ứng với mọi tình huống là cách tiếp cận tốt nhất.
