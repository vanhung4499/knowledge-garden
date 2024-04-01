---
title: Template Method Pattern Practice
tags:
  - design-pattern
categories: 
date created: 2024-04-01
date modified: 2024-04-01
---

# Template Method Pattern Practice: Mô phỏng trình thu thập thông tin của các sản phẩm thương mại điện tử khác nhau và tạo cảnh áp phích quảng cáo tiếp thị

## Giới thiệu

`Sự kiên nhẫn trước bình minh, liệu bạn có thể chịu đựng không?`

Có người đã đưa ra một ví dụ như sau: trước hết bạn nhận được một lá thư thông báo nhập học của Đại học Bắc Kinh, nhưng yêu cầu bạn phải thức dậy lúc 5 giờ sáng mỗi ngày, đi ngủ lúc 12 giờ đêm, học hành cật lực và chăm chỉ tiến bộ. Chỉ cần bạn kiên trì trong ba năm, lá thư thông báo này sẽ có hiệu lực. Nếu là bạn, liệu bạn có kiên trì không? Trên thực tế, ví dụ này khó có thể xuất hiện trong cuộc sống của chúng ta, vì nó có mục tiêu rõ ràng, có một con đường di chuyển cụ thể. Giống như khi bạn là một người giàu có, gia đình đã sắp xếp mọi thứ rõ ràng, chỉ cần bạn tuân thủ con đường này là không có vấn đề gì. Tuy nhiên, đa số thời gian chúng ta không có một con đường như vậy, thậm chí không biết bao lâu mới đạt được bình minh của bản thân. Nhưng! Ai lại không mong muốn thấy bình minh, hãy kiên trì lên!

`Đừng dễ dàng bị làm nhục`

`Nhà bàn phím ⌨`, `Người phun lửa trên mạng`, gần như khi bạn cố gắng kiên trì với một điều gì đó, trên con đường này bạn sẽ gặp phải nhiều loại người và sự việc. Đôi khi việc tiếp nhận lời khuyên để hoàn thiện bản thân là cần thiết, nhưng không thể từ bỏ lý tưởng và đường lối của bản thân, đôi khi chỉ sự kiên trì của bản thân cũng là điều quý giá. `Sự can đảm của Tử Lạc, sự khéo léo của Tử Cống, sự thông minh của Nhân Hữu, ba người này, đều là những người hiếm có khó tìm thấy trên thế giới này`. Ánh nắng và nỗ lực là những thứ ấm áp nhất trên thế giới này, hãy cố gắng kiên trì và duy trì lối đi bạn đã chọn.

`Đôi khi kiên trì cũng tốt`

Khi bạn cảm thấy rất hạnh phúc về một quyết định của mình 😄, liệu bạn có cảm ơn bản thân mình đã kiên trì không? Kiên trì, nỗ lực, học hành suốt đời, dường như là những điều không thể thiếu trong ngành công nghiệp lập trình viên, khi bạn sẵn lòng coi nó như một sở thích mà bạn có thể nỗ lực. Và chúng ta khó có thể nói chỉ chuẩn bị khi cơ hội đến, mà luôn nỗ lực chờ đợi cơ hội. Đó là lý do tại sao nhiều người nói rằng người khác nắm bắt cơ hội là vì họ luôn sẵn sàng.

## Môi trường phát triển

1. JDK 1.8
2. Idea + Maven
3. Code: [vanhung4499/practical-java-design](https://github.com/vanhung4499/practical-java-design)  

| Dự án             | Mô tả                                                               |
| ----------------- | ------------------------------------------------------------------- |
| demo-design-21-00 | Dự án mô phỏng: mô phỏng cảnh tạo biểu ngữ sản phẩm của web crawler |

## Ba, Giới thiệu về Template Pattern

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240401232205.png)

Ý tưởng thiết kế cốt lõi của Template Pattern là thông qua việc xác định thứ tự thực hiện của các phương thức trừu tượng trong lớp trừu tượng và đặt các phương thức trừu tượng này để chỉ có lớp con thực hiện, nhưng không thiết kế phương thức truy cập `độc lập`. Đơn giản nói, đó là cách bạn sắp xếp mọi thứ một cách rõ ràng.

Giống như 99 và 81 kiếp nạn trong Tây Du Ký, về cơ bản mọi cấp độ đều giống nhau: Thầy bị bắt, đánh quái vật, quái vật bị giữ, bạn tự xác định quái vật cụ thể, cách đánh bạn tìm cách, cuối cùng giữ hoặc giết xem bạn có bản lĩnh không, tôi chỉ định thứ tự thực hiện và chiến lược cơ bản, mỗi khó khăn cụ thể do Quan Âm chỉ định.

## Mô phỏng tình huống

**Trong trường hợp này, chúng tôi mô phỏng việc lấy thông tin sản phẩm từ các trang web thương mại điện tử khác nhau, tạo ra những quảng cáo tiếp thị (`quảng cáo chứa mã mời cá nhân`) để kiếm hoa hồng từ sản phẩm. * Lưu ý, đây chỉ là việc mô phỏng, không phải là việc lấy thực sự *

Quy trình lấy thông tin toàn bộ phân thành ba bước; mô phỏng đăng nhập, lấy thông tin, tạo biểu ngữ, và ba bước này có thể sử dụng Template Pattern để thiết lập và có các cảnh cụ thể làm lớp con triển khai.

1. Bởi vì một số sản phẩm chỉ có thể lấy thông tin sau khi đăng nhập, và đăng nhập có thể xem giá cả cụ thể khác nhau so với giá mà người dùng chưa đăng nhập nhìn thấy.
2. Cách lấy thông tin từ các trang web thương mại điện tử khác nhau khác nhau, và cách phân tích cũng khác nhau, do đó có thể làm những điều này là các cài đặt cụ thể trong mỗi lớp triển khai.
3. Quy trình tạo biểu ngữ cơ bản giống nhau, nhưng có thể có các biểu ngữ đặc biệt từ nguồn sản phẩm. Vì vậy, ba bước này có thể được thiết lập bằng Template Pattern và có các tình huống cụ thể triển khai.

## Xây dựng dự án theo Template Pattern

Cảnh kinh doanh của Template Pattern có thể không phổ biến trong quá trình phát triển hàng ngày, chủ yếu vì mẫu thiết kế này sẽ xác định thứ tự thực hiện của hành vi logic trong lớp trừu tượng. Thông thường, các hành vi logic được xác định trong các lớp trừu tượng mà chúng ta sử dụng đều khá nhẹ hoặc không có, chỉ cung cấp một số phương thức cơ bản để sử dụng và triển khai chung.

Tuy nhiên, nếu gặp phải các tình huống phù hợp, việc sử dụng mẫu thiết kế như vậy cũng rất tiện lợi, vì nó có thể kiểm soát thứ tự thực hiện của toàn bộ logic và đầu vào, đầu ra thống nhất, trong khi các bên triển khai chỉ cần quan tâm đến logic kinh doanh của họ.

Trong tình huống của chúng ta, chỉ cần nhớ triển khai ba bước sau; `mô phỏng đăng nhập`, `lấy thông tin`, `tạo biểu ngữ`

### Cấu trúc dự án

```java
design-demo-21-00
├── pom.xml
└── src
    ├── main
    │   └── java
    │       └── com
    │           └── hnv99
    │               └── design
    │                   ├── HttpClient.java
    │                   ├── NetMall.java
    │                   └── impl
    │                       ├── DangDangNetMall.java
    │                       ├── JDNetMall.java
    │                       └── TaoBaoNetMall.java
    └── test
        └── java
            └── com
                └── hnv99
                    └── design
                        └── ApiTest.java

```       

**Cấu trúc mô hình của Template Pattern**  

![Cấu trúc mô hình của Template Pattern](https://raw.githubusercontent.com/vanhung4499/images/master/snap/itstack-demo-design-21-04.png)

- Cấu trúc mã trên vẫn khá đơn giản, một lớp trừu tượng chính xác đã xác định thứ tự thực hiện của các phương thức trừu tượng cốt lõi, cũng như ba dịch vụ thương mại điện tử cụ thể (`JD`, `Tmall`, `Dangdang`).

### Triển khai code

#### Định nghĩa lớp trừu tượng xác định thứ tự thực hiện

```java
/**
 * Dịch vụ quảng cáo cơ bản của cửa hàng trực tuyến
 * 1. Tạo biển quảng cáo hàng hóa tốt nhất
 * 2. Biển quảng cáo chứa mã mời quảng cáo
 */
public abstract class NetMall {

    protected Logger logger = LoggerFactory.getLogger(NetMall.class);

    String uId;   // ID người dùng
    String uPwd;  // Mật khẩu người dùng

    public NetMall(String uId, String uPwd) {
        this.uId = uId;
        this.uPwd = uPwd;
    }

    /**
     * Tạo biển quảng cáo hàng hóa
     *
     * @param skuUrl Địa chỉ hàng hóa (JD, Taobao, Dangdang)
     * @return Thông tin hình ảnh base64 của biển quảng cáo
     */
    public String generateGoodsPoster(String skuUrl) {
        if (!login(uId, uPwd)) return null;             // 1. Xác thực đăng nhập
        Map<String, String> reptile = reptile(skuUrl);  // 2. Thực hiện thu thập thông tin sản phẩm
        return createBase64(reptile);                   // 3. Tạo biển quảng cáo
    }

    // Mô phỏng đăng nhập
    protected abstract Boolean login(String uId, String uPwd);

    // Mô phỏng thu thập thông tin sản phẩm (giá ưu đãi sau khi đăng nhập)
    protected abstract Map<String, String> reptile(String skuUrl);

    // Tạo thông tin biển quảng cáo sản phẩm
    protected abstract String createBase64(Map<String, String> goodsInfo);

}
```    

- Lớp này là linh hồn của mô hình thiết kế này
- Định nghĩa phương thức `generateGoodsPoster` có thể truy cập bên ngoài, được sử dụng để tạo biển quảng cáo hàng hóa
- `generateGoodsPoster` định nghĩa thứ tự thực hiện của các phương thức trừu tượng là 1 2 3
- Cung cấp ba phương thức trừu tượng cụ thể, cho phép các lớp con triển khai; mô phỏng đăng nhập (`login`), mô phỏng thu thập (`reptile`), tạo biển quảng cáo (`createBase64`)

#### Mô phỏng thu thập dữ liệu từ trang web JD

```java
public class JDNetMall extends NetMall {

    public JDNetMall(String uId, String uPwd) {
        super(uId, uPwd);
    }

    public Boolean login(String uId, String uPwd) {
        logger.info("Mô phỏng đăng nhập người dùng JD uId：{} uPwd：{}", uId, uPwd);
        return true;
    }

    public Map<String, String> reptile(String skuUrl) {
        String str = HttpClient.doGet(skuUrl);
        Pattern p9 = Pattern.compile("(?<=title\\>).*(?=</title)");
        Matcher m9 = p9.matcher(str);
        Map<String, String> map = new ConcurrentHashMap<String, String>();
        if (m9.find()) {
            map.put("name", m9.group());
        }
        map.put("price", "5999.00");
        logger.info("Mô phỏng phân tích dữ liệu của mặt hàng trên JD：{} | {} đồng {}", map.get("name"), map.get("price"), skuUrl);
        return map;
    }

    public String createBase64(Map<String, String> goodsInfo) {
        BASE64Encoder encoder = new BASE64Encoder();
        logger.info("Mô phỏng tạo ảnh base64 cho mặt hàng trên JD");
        return encoder.encode(JSON.toJSONString(goodsInfo).getBytes());
    }

}
```

- Mô phỏng đăng nhập
- Thu thập thông tin, ở đây chỉ cắt ra kết quả đã thu thập của trường `title`.
- Mô phỏng việc tạo hình ảnh base64

#### Mô phỏng thu thập dữ liệu từ trang web Taobao

```java
public class TaoBaoNetMall extends NetMall {

    public TaoBaoNetMall(String uId, String uPwd) {
        super(uId, uPwd);
    }

    @Override
    public Boolean login(String uId, String uPwd) {
        logger.info("Mô phỏng đăng nhập người dùng Taobao uId：{} uPwd：{}", uId, uPwd);
        return true;
    }

    @Override
    public Map<String, String> reptile(String skuUrl) {
        String str = HttpClient.doGet(skuUrl);
        Pattern p9 = Pattern.compile("(?<=title\\>).*(?=</title)");
        Matcher m9 = p9.matcher(str);
        Map<String, String> map = new ConcurrentHashMap<String, String>();
        if (m9.find()) {
            map.put("name", m9.group());
        }
        map.put("price", "4799.00");
        logger.info("Mô phỏng phân tích dữ liệu sản phẩm Taobao：{} | {} đồng {}", map.get("name"), map.get("price"), skuUrl);
        return map;
    }

    @Override
    public String createBase64(Map<String, String> goodsInfo) {
        BASE64Encoder encoder = new BASE64Encoder();
        logger.info("Mô phỏng tạo biển quảng cáo sản phẩm Taobao base64");
        return encoder.encode(JSON.toJSONString(goodsInfo).getBytes());
    }

}
```   

- Tương tự như trên, mô phỏng đăng nhập và crawl và tạo hình ảnh`base64`

#### Mô phỏng thu thập dữ liệu từ trang web DangDang

```java
public class DangDangNetMall extends NetMall {

    public DangDangNetMall(String uId, String uPwd) {
        super(uId, uPwd);
    }

    @Override
    public Boolean login(String uId, String uPwd) {
        logger.info("Mô phỏng đăng nhập người dùng DangDang uId：{} uPwd：{}", uId, uPwd);
        return true;
    }

    @Override
    public Map<String, String> reptile(String skuUrl) {
        String str = HttpClient.doGet(skuUrl);
        Pattern p9 = Pattern.compile("(?<=title\\>).*(?=</title)");
        Matcher m9 = p9.matcher(str);
        Map<String, String> map = new ConcurrentHashMap<String, String>();
        if (m9.find()) {
            map.put("name", m9.group());
        }
        map.put("price", "4548.00");
        logger.info("Mô phỏng phân tích dữ liệu phẩm DangDang：{} | {} đồng {}", map.get("name"), map.get("price"), skuUrl);
        return map;
    }

    @Override
    public String createBase64(Map<String, String> goodsInfo) {
        BASE64Encoder encoder = new BASE64Encoder();
        logger.info("Mô phỏng tạo biển quảng cáo sản phẩm DangDang base64");
        return encoder.encode(JSON.toJSONString(goodsInfo).getBytes());
    }

}
```    

- Tương tự như trên, mô phỏng đăng nhập và crawl và tạo hình ảnh`base64`

### Kiểm tra và Xác minh

#### Viết lớp kiểm thử

```java
public class ApiTest {  
  
    public Logger logger = LoggerFactory.getLogger(ApiTest.class);  
  
    /**  
     * Kiểm tra liên kết     * JD: https://item.jd.com/100008348542.html     * Tmall: https://detail.tmall.com/item.htm     * Dangdang: http://product.dangdang.com/1509704171.html     */    @Test  
    public void test_NetMall() {  
        NetMall netMall = new JDNetMall("1000001","*******");  
        String base64 = netMall.generateGoodsPoster("https://item.jd.com/100008348542.html");  
        logger.info("Kết quả kiểm tra: {}", base64);  
    }  
}
```     

- Lớp kiểm thử cung cấp ba liên kết sản phẩm, cũng có thể là liên kết sản phẩm khác
- Quá trình cào dữ liệu giả mạo sản phẩm từ JD, có thể thay thế bằng dịch vụ sản phẩm khác `new JDNetMall`, `new TaoBaoNetMall`, `new DangDangNetMall`

#### Kết quả kiểm tra

```java
2024-04-01 23:41:45.035	INFO	main		(JDNetMall.java:20)	|	Mô phỏng đăng nhập người dùng JD uId：1000001 uPwd：*******
2024-04-01 23:41:46.959	INFO	main		(JDNetMall.java:33)	|	Mô phỏng phân tích dữ liệu của mặt hàng trên JD：【AppleiPhone 11】Apple iPhone 11 (A2223) 128GB 黑色 移动联通电信4G手机 双卡双待【行情 报价 价格 评测】-京东 | 5999.00 đồng https://item.jd.com/100008348542.html
2024-04-01 23:41:46.959	INFO	main		(JDNetMall.java:39)	|	Mô phỏng tạo ảnh base64 cho mặt hàng trên JD
2024-04-01 23:41:47.000	INFO	main		(ApiTest.java:22)	|	Kết quả kiểm tra: eyJwcmljZSI6IjU5OTkuMDAiLCJuYW1lIjoi44CQQXBwbGVpUGhvbmUgMTHjgJFBcHBsZSBpUGhv
bmUgMTEgKEEyMjIzKSAxMjhHQiDpu5HoibIg56e75Yqo6IGU6YCa55S15L+hNEfmiYvmnLog5Y+M
5Y2h5Y+M5b6F44CQ6KGM5oOFIOaKpeS7tyDku7fmoLwg6K+E5rWL44CRLeS6rOS4nCJ9
```

## Tổng kết

- Từ việc triển khai trên, ta có thể thấy rằng `mẫu Template` rất thuận tiện trong việc xác định cấu trúc thống nhất, cũng chính là tiêu chuẩn thực thi. Điều này giúp kiểm soát việc các triển khai sau này không cần quan tâm đến logic gọi, mà chỉ cần thực thi theo cách thống nhất. Do đó, người triển khai chỉ cần quan tâm đến logic kinh doanh cụ thể.
- Ngoài ra, mẫu Template cũng được thiết kế để giải quyết vấn đề của phương thức chung trong các lớp con, được đặt trong lớp cha. Điều này giúp trích xuất mã chung, hành vi được quản lý bởi lớp cha, mở rộng phần có thể thay đổi, cũng làm tăng khả năng phát triển và nâng cấp.
- Tuy nhiên, mỗi loại mẫu thiết kế đều có các tình huống đặc biệt của riêng nó, nếu vượt quá phạm vi của tình huống đó thì cần phải xem xét thêm về việc áp dụng các mẫu thiết kế khác. Không nên ép buộc sử dụng, nếu không hiểu rõ lý do tại sao lại như vậy, cũng khó để người tiếp theo tiếp tục duy trì mã. Để áp dụng hiệu quả, cần phải luyện tập nhiều hơn, có nhiều kinh nghiệm thực tế.
