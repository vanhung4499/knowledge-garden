---
title: Memento Pattern Practice
tags:
  - design-pattern
categories: 
date created: 2024-04-01
date modified: 2024-04-01
---

# Memento Pattern Practice: Mô phỏng kịch bản khôi phục tệp cấu hình trong quá trình chạy trực tuyến của hệ thống

## Giới thiệu

"Không thể thực hiện, liệu có phải là lời biện hộ của nhóm phát triển không?"

Không thể thực hiện, đôi khi là do tính phức tạp của chức năng khó thực hiện, đôi khi là do thời gian triển khai ngắn không thể hoàn thành. Và hành động lập trình lại là quá trình không dễ đo lường. Cùng một chức năng, cách triển khai của mỗi người khác nhau, tốc độ giải quyết vấn đề cũng không giống nhau. Ngoài ra, việc giải thích cụ thể tại sao cần phải tuân thủ thời gian triển khai cũng là một vấn đề không dễ dàng. Điều này giống như bản vẽ của công trình, cuối cùng cần bao nhiêu xi măng và cát. Lúc đó, nhóm phát triển sẽ cố gắng thiết lập quy trình chuẩn, thiết kế, phát triển, xem xét và xác định một phạm vi thời gian có thể hoàn thành và tránh rủi ro. Khi bị ép giảm, thường sẽ gây ra một số mâu thuẫn, khi có thể giảm bớt, phải giải thích tại sao trước đó cần thời gian nhiều, không thể giảm bớt lại có áp lực từ nhiều phía. Vì vậy, đôi khi không nhất thiết là lời biện hộ, mà là cần suy nghĩ về cách làm cho toàn bộ nhóm phát triển phát triển mạnh mẽ.

"Khích lệ đôi khi quan trọng hơn áp lực!"

Trong quá trình học, nhiều khi chúng ta thường nghe thấy, "bạn phải làm thế này, thế kia, bạn nhìn xem ai đó đã làm gì gì đấy", ngay cả khi không nghe thấy những tiếng này, nhưng vì đã từng nghe nhiều lần mà dẫn đến sự phản đối nội tâm. Mặc dù cũng biết mình phải học, nhưng rất khó mà kiên trì, khi học codei mà không có hướng đi, nhìn thấy còn nhiều thứ chưa biết càng cảm thấy hoang mang, đến mức cuối cùng mất hướng, thấy còn nhiều thứ không biết càng hoang mang hơn, đến mức cuối cùng tinh thần đổ vỡ, không muốn học nữa. Thực tế, áp lực của lập trình viên không nhỏ, muốn phát triển gần như cần phải học suốt đời, giống như không dám nói rằng đã thành thạo java nữa rồi, khối lượng kiến thức thực sự là tăng lên theo sâu hơn, theo học sâu hơn, theo học rộng hơn. Vì vậy, cần phải học vui vẻ, phát triển hạnh phúc!

"Bạn luôn có vẻ rất vội vã khi đến gần thời điểm quyết định!"

Thường nghe thấy: "Ngày mai giáo viên sẽ yêu cầu bạn, hãy giúp tôi làm việc này", "Bạn hãy viết xong cái này cho tôi, tôi cần nó ngay lúc này", "Bây giờ bạn không có thời gian để học sao? Hãy xem cho tôi xem". Thực ra cũng thấy nhiều thứ tương tự, rất tò mò về sự vội vã của bạn, không thể, người ngồi nhà, tai ương từ trên trời rơi xuống. Tại sao giáo viên lại chọn bạn vào thời điểm đó, tại sao sếp lại yêu cầu bạn vào hôm nay, thậm chí không có thời gian học nữa? Đây không phải là do bạn chưa học, bạn đã không học đúng cách! Ngay cả khi cuối cùng có người giúp bạn, nhưng tốt nhất là không nên chủ quan, cần học ngay lập tức, tránh qua một cách nào đó nhưng không bao giờ đủ!

## Môi trường phát triển

1. JDK 1.8
2. IDEA + Maven
3. Code: [vanhung4499/practical-java-design](https://github.com/vanhung4499/practical-java-design)  

| Dự án             | Mô tả                      |
| ----------------- | -------------------------- |
| demo-design-17-00 | Sổ tay cấu hình phát triển |

## Giới thiệu về Memento Pattern

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240401142413.png)

Memento Pattern là một mẫu thiết kế với chức năng chính là có thể phục hồi hoặc quay lại cấu hình, phiên bản, hoặc chức năng quay lại trạng thái trước đó, và mẫu này thuộc về loại mẫu hành vi. Trong triển khai chức năng, Memento Pattern tạo ra một lớp ghi chú mà không làm hỏng đối tượng gốc, ghi lại hành vi của đối tượng gốc để thực hiện Memento Pattern.

Mẫu này thường xuất hiện trong cuộc sống hàng ngày hoặc phát triển phần mềm, ví dụ như: thuốc lắc, thuốc lạc (quay lại 0), tính năng hoàn tác và làm mới trong IDEA, lưu trạng thái trò chơi trong máy chơi game. Đương nhiên, còn có một ứng dụng rất phổ biến là Photoshop History.

## Mô phỏng tình huống

**Trong tình huống này, chúng ta mô phỏng việc ghi lại các tệp cấu hình trực tuyến để sử dụng cho việc quay lại khẩn cấp.**

Trong quá trình triển khai hệ thống của các công ty Internet lớn, việc triển khai và ra mắt hệ thống phải đảm bảo tính dễ sử dụng, an toàn và khả năng xử lý tình huống khẩn cấp. Đồng thời, để có thể cách ly giữa môi trường trực tuyến và môi trường cục bộ, thông thường các tệp cấu hình sẽ được trích xuất và lưu trữ trực tuyến, tránh việc có người vô tình thao tác sai dẫn đến việc xuất bản nội dung cấu hình cục bộ. Đồng thời, các tệp cấu hình trực tuyến cũng sẽ được ghi lại mỗi khi có sự thay đổi, bao gồm; số phiên bản, thời gian, MD5, thông tin nội dung và người thực hiện thay đổi.

Trong quá trình triển khai sau này, nếu phát hiện ra vấn đề cấp bách, hệ thống sẽ cần phải thực hiện quay lại. Nếu thực hiện quay lại, cũng có thể thiết lập xem liệu tệp cấu hình có nên quay lại hay không. Bởi vì mỗi phiên bản hệ thống có thể đi kèm với một số thông tin cấu hình, từ đó có thể dễ dàng thực hiện quay lại hệ thống cùng với các tệp cấu hình.

Tiếp theo, chúng ta sẽ sử dụng Memento Pattern để mô phỏng cách ghi lại thông tin cấu hình. Trong thực tế, thông tin sẽ được lưu trữ trong cơ sở dữ liệu để sử dụng, nhưng ở đây chúng ta tạm thời sử dụng bộ nhớ để ghi lại thông tin.

## Năm. Ghi chú phiên bản thông tin cấu hình bằng mẫu thiết kế Ghi chú

Cách thức triển khai mẫu thiết kế ghi chú là tạo ra một lớp ghi chú mới mà không thay đổi lớp gốc, và lưu trữ thông tin ghi chú trong lớp ghi chú. Dù bạn có thể không cần thiết phải triển khai cấu trúc code của mẫu thiết kế này hàng ngày, nhưng trong thực tế, bạn có thể đã thực hiện chức năng tương tự như ghi chú thông tin hệ thống.

Ngoài ví dụ hiện tại, có thể là người vận hành ghi lại thông tin hoạt động khi tạo ra các sự kiện trong hệ thống ERP, giúp họ có thể điều chỉnh các phiên bản của mình một cách linh hoạt mà không lo lắng về việc mất thông tin do lỗi hoạt động.

### 1. Cấu trúc Dự án

```java
design-demo-17-00/
├── pom.xml
└── src
    ├── main
    │   └── java
    │       └── com
    │           └── hnv99
    │               └── design
    │                   ├── Admin.java
    │                   ├── ConfigFile.java
    │                   ├── ConfigMemento.java
    │                   └── ConfigOriginator.java
    └── test
        └── java
            └── com
                └── hnv99
                    └── design
                        └── ApiTest.java

```      

**Cấu trúc mẫu thiết kế Ghi chú**

![Cấu trúc mẫu thiết kế Ghi chú](https://raw.githubusercontent.com/vanhung4499/images/master/snap/itstack-demo-design-17-04.png)

- Đây chỉ là một biểu đồ lớp của cấu trúc dự án, tương đối đơn giản, ngoài lớp cấu hình gốc (`ConfigFile`), chỉ có ba lớp mới được thêm vào.
- `ConfigMemento`: Lớp ghi chú, tương đương với việc mở rộng của lớp cấu hình gốc.
- `ConfigOriginator`: Lớp ghi nhớ, lấy và trả về thông tin đối tượng lớp ghi chú.
- `Admin`: Lớp quản trị viên, được sử dụng để thao tác ghi nhớ thông tin, ví dụ như thực hiện một loạt các hoạt động hoặc thông tin nội dung của một phiên bản cụ thể.

### Triển khai code

#### Lớp Thông tin Cấu hình

```java
public class ConfigFile {

    private String versionNo; // Số phiên bản
    private String content;   // Nội dung
    private Date dateTime;    // Thời gian
    private String operator;  // Người vận hành
    
    // ...get/set
}
```

- Lớp cấu hình có thể có bất kỳ hình thức nào, ở đây chỉ mô tả đơn giản về nội dung cấu hình cơ bản.

#### Lớp Ghi chú

```java
public class ConfigMemento {

    private ConfigFile configFile;

    public ConfigMemento(ConfigFile configFile) {
        this.configFile = configFile;
    }

    public ConfigFile getConfigFile() {
        return configFile;
    }

    public void setConfigFile(ConfigFile configFile) {
        this.configFile = configFile;
    }
    
}
```       

- Ghi chú là một phần mở rộng của lớp cấu hình gốc, có thể thiết lập và lấy thông tin cấu hình.

#### Lớp Ghi nhớ

```java
public class ConfigOriginator {

    private ConfigFile configFile;

    public ConfigFile getConfigFile() {
        return configFile;
    }

    public void setConfigFile(ConfigFile configFile) {
        this.configFile = configFile;
    }

    public ConfigMemento saveMemento(){
        return new ConfigMemento(configFile);
    }

    public void getMemento(ConfigMemento memento){
        this.configFile = memento.getConfigFile();
    }

}
```     

- Lớp ghi nhớ ngoài việc thêm các phương thức để lấy và thiết lập `ConfigFile`, còn có hai phương thức quan trọng.
- `saveMemento`: Khi lưu trữ ghi nhớ, nó sẽ tạo ra một đối tượng ghi nhớ và trả về nó để được xử lý bởi quản trị viên.
- `getMemento`: Sau khi lấy ghi nhớ, không phải trả về trực tiếp, mà là chuyển thông tin của ghi nhớ vào tệp cấu hình hiện tại `this.configFile`, phần này cần chú ý.

#### Lớp Quản trị viên

```java
public class Admin {

    private int cursorIdx = 0;
    private List<ConfigMemento> mementoList = new ArrayList<ConfigMemento>();
    private Map<String, ConfigMemento> mementoMap = new ConcurrentHashMap<String, ConfigMemento>();

    public void append(ConfigMemento memento) {
        mementoList.add(memento);
        mementoMap.put(memento.getConfigFile().getVersionNo(), memento);
        cursorIdx++;
    }

    public ConfigMemento undo() {
        if (--cursorIdx <= 0) return mementoList.get(0);
        return mementoList.get(cursorIdx);
    }

    public ConfigMemento redo() {
        if (++cursorIdx > mementoList.size()) return mementoList.get(mementoList.size() - 1);
        return mementoList.get(cursorIdx);
    }

    public ConfigMemento get(String versionNo){
        return mementoMap.get(versionNo);
    }

}
```   

- Trong lớp này, chức năng chính được thực hiện là ghi nhớ thông tin cấu hình, tương đương với tác dụng của ghi nhớ, sau đó cung cấp các phương thức để hoàn tác và lấy thông tin.
- Đồng thời, lớp này cũng thiết lập hai cấu trúc dữ liệu để lưu trữ ghi nhớ, thực tế có thể thiết lập theo nhu cầu. `List<ConfigMemento>` và `Map<String, ConfigMemento>`.
- Cuối cùng là các phương thức thực hiện các hoạt động ghi nhớ; thêm (`append`), hoàn tác (`undo`), tiếp tục (`redo`), và lấy ra theo định hướng (`get`), với bốn phương thức hoạt động như vậy.

### Kiểm tra và Xác minh

#### Viết lớp kiểm tra

```java
@Test
public void test() {
    Admin admin = new Admin();
    ConfigOriginator configOriginator = new ConfigOriginator();
    configOriginator.setConfigFile(new ConfigFile("1000001", "Nội dung cấu hình A=HaHa", new Date(), "Anh Phúc"));
    admin.append(configOriginator.saveMemento()); // Lưu cấu hình
    configOriginator.setConfigFile(new ConfigFile("1000002", "Nội dung cấu hình A=HiHi", new Date(), "Anh Phúc"));
    admin.append(configOriginator.saveMemento()); // Lưu cấu hình
    configOriginator.setConfigFile(new ConfigFile("1000003", "Nội dung cấu hình A=Mềm Mềm", new Date(), "Anh Phúc"));
    admin.append(configOriginator.saveMemento()); // Lưu cấu hình
    configOriginator.setConfigFile(new ConfigFile("1000004", "Nội dung cấu hình A=HêHê", new Date(), "Anh Phúc"));
    admin.append(configOriginator.saveMemento()); // Lưu cấu hình  

    // Cấu hình lịch sử (quay lại)
    configOriginator.getMemento(admin.undo());
    logger.info("Cấu hình lịch sử (quay lại) undo：{}", JSON.toJSONString(configOriginator.getConfigFile()));  

    // Cấu hình lịch sử (quay lại)
    configOriginator.getMemento(admin.undo());
    logger.info("Cấu hình lịch sử (quay lại) undo：{}", JSON.toJSONString(configOriginator.getConfigFile()));  

    // Cấu hình lịch sử (tiếp tục)
    configOriginator.getMemento(admin.redo());
    logger.info("Cấu hình lịch sử (tiếp tục) redo：{}", JSON.toJSONString(configOriginator.getConfigFile()));   

    // Cấu hình lịch sử (lấy)
    configOriginator.getMemento(admin.get("1000002"));
    logger.info("Cấu hình lịch sử (lấy) get：{}", JSON.toJSONString(configOriginator.getConfigFile()));
}
```

- Phần học của mẫu thiết kế này được thể hiện chủ yếu trong lớp kiểm tra đơn vị, bao gồm bốn lần lưu trữ thông tin và hoạt động lịch sử ghi nhớ.
- Sau khi thêm bốn cấu hình như trên, các hoạt động tiếp theo bao gồm; `quay lại 1 lần`, `quay lại 1 lần nữa`, `tiếp tục 1 lần`, `và lấy cấu hình phiên bản cụ thể`. Kết quả cụ thể có thể tham khảo kết quả kiểm tra.

#### Kết quả

```shell
2024-04-01 14:34:00.918	INFO	main		(ApiTest.java:35)	|	Lịch sử cấu hình (quay lại) undo: {"content":"Nội dung cấu hình A=Hehe","dateTime":1711956840847,"operator":"Tiểu Phúc Ca","versionNo":"1000004"}
2024-04-01 14:34:00.921	INFO	main		(ApiTest.java:39)	|	Lịch sử cấu hình (quay lại) undo: {"content":"Nội dung cấu hình A=Meme","dateTime":1711956840847,"operator":"Tiểu Phúc Ca","versionNo":"1000003"}
2024-04-01 14:34:00.921	INFO	main		(ApiTest.java:43)	|	Lịch sử cấu hình (tiến tới) redo: {"content":"Nội dung cấu hình A=Hehe","dateTime":1711956840847,"operator":"Tiểu Phúc Ca","versionNo":"1000004"}
2024-04-01 14:34:00.922	INFO	main		(ApiTest.java:47)	|	Lịch sử cấu hình (nhận) get: {"content":"Nội dung cấu hình A=Hihi","dateTime":1711956840847,"operator":"Tiểu Phúc Ca","versionNo":"1000002"}

```  

- Từ kết quả kiểm tra, có thể thấy rằng lịch sử cấu hình đã được quay lại và tiếp tục theo các chỉ thị của chúng tôi, cuối cùng là lấy cấu hình phiên bản cụ thể, đều đạt được kết quả dự kiến.

## Tổng kết

- Cách thức triển khai mẫu thiết kế này có thể đáp ứng nhu cầu mở rộng chức năng của ghi nhớ mà không làm thay đổi các lớp thuộc tính gốc. Mặc dù cách thức triển khai này giống như cách chúng ta thường làm trong thực tế, nhưng việc triển khai cụ thể vẫn cần được nghiền ngẫm, và cách tiếp cận như vậy cũng được thể hiện trong một số code nguồn.
- Trong việc lưu trữ các cấu hình vào bộ nhớ, nếu tắt nguồn sẽ dẫn đến mất thông tin cấu hình, vì vậy trong một số trường hợp thực tế cần lưu trữ vào cơ sở dữ liệu. Tuy nhiên, việc lưu trữ cấu hình trong bộ nhớ và khôi phục cũng có thể xảy ra trong một số trường hợp, ví dụ như Photoshop, hoặc nhân viên vận hành ERP cấu hình hoạt động, không cần phải lưu trữ vào cơ sở dữ liệu để khôi phục. Ngoài ra, nếu lưu trữ thông tin trong bộ nhớ, cần xem xét vấn đề lưu trữ để tránh tốn nhiều bộ nhớ.
- Việc học mẫu thiết kế này là để viết code có thể mở rộng, quản lý và bảo trì tốt hơn, và quá trình học này đòi hỏi thực hành nhiều hơn. Hãy nhớ thường xuyên thực hành!
