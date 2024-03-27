---
title: Bridge Pattern Practice
tags:
  - design-pattern
categories: 
date created: 2024-03-27
date modified: 2024-03-28
---

# Bridge Pattern Practice

## Giới thiệu

**Tại sao code của bạn có quá nhiều điều kiện if-else?**

Cùng loại hình kinh doanh, cùng chức năng, tại sao bạn có thể viết ra nhiều `ifelse` như vậy. Đôi khi những bạn mới chỉ vừa ra trường, hoặc một số lập trình viên từ các công ty nhỏ chuyển sang công ty lớn, khi lần đầu tiên đối mặt với yêu cầu nghiệp vụ, thường viết code chưa chín chắn, thường xuyên viết các yêu cầu một cách tuyến tính. Thực hiện lần đầu có thể nhanh chóng, nhưng việc bảo trì và mở rộng sau này lại đau đầu. Vì chi phí bảo trì của một đoạn code càng cao, thì càng khó đọc.

**Design Pattern có thể giúp bạn cải thiện code của mình?**

Nhiều khi, những điều kiện if-else mà bạn viết ra không có cân nhắc sử dụng design pattern để tối ưu. Giống như: đóng gói cuộc gọi của dịch vụ cùng loại, xây dựng nhóm vật liệu khác nhau từ cùng một loại, nhà máy tiếp thị của nhiều hình thức phần thưởng khác nhau, v.v. Tất cả chúng đều có thể biến những điều kiện if trong code của bạn thành các lớp và quy trình lập trình hướng đối tượng.

**Làm sao để kết hợp design pattern với phát triển thực tế?**

Hãy suy nghĩ từ các tình huống thực tế, chỉ tìm ra điểm tối ưu của việc tối ưu hóa code, không cần phải suy nghĩ về việc sử dụng design pattern. Giống như bạn đã bắt đầu học design pattern, vì không có mô phỏng kịch bản thực tế, tất cả đều là một số hình vẽ hình tròn, hình vuông, rất không thân thiện đối với những người mới hoặc những người hiểu biết không đủ tốt. Vì vậy, ngay cả khi học rất lâu, nhưng sử dụng thực tế vẫn là điều khó.

## Môi trường phát triển

1. JDK 1.8
2. Idea + Maven
3. Code: [vanhung4499/practical-java-design](https://github.com/vanhung4499/practical-java-design)  

| Dự án            | Mô tả                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------- |
| demo-design-7-01 | Triển khai yêu cầu kinh doanh bằng cách viết code lộn xộn                                   |
| demo-design-7-02 | Tối ưu và cải thiện code bằng cách sử dụng các mẫu thiết kế để tạo ra sự so sánh và học hỏi |

### Giới thiệu Bridge Pattern

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240327233204.png)  

Bridge Pattern chính là việc tách biệt phần trừu tượng và phần cụ thể, kết hợp nhiều sự kết hợp có thể tương thích. Nói một cách đơn giản, việc triển khai cốt lõi là trong lớp A có một lớp B, và lớp B được truyền qua qua hàm tạo, lớp B này chính là cái `cầu` trong thiết kế.

**Vậy trong phát triển hàng ngày của chúng ta, Bridge Pattern được áp dụng trong những tình huống nào?**

Việc triển khai nhiều trình điều khiển JDBC, máy tính để bàn và máy tính xách tay cùng một thương hiệu, và dịch vụ lọc nhóm đa loại trong các ứng dụng kinh doanh là những ví dụ phù hợp cho việc sử dụng Bridge Pattern, vì trong một số kết hợp, nếu mỗi lớp triển khai một dịch vụ khác nhau có thể gây ra các bộ kết hợp vô hạn, nhưng việc sử dụng Bridge Pattern có thể làm cho nó đơn giản hơn nhiều.

## Mô phỏng kịch bản

Với sự cạnh tranh trên thị trường, trong lĩnh vực thanh toán đã xuất hiện các dịch vụ như WeChat Pay và Alipay cùng với một số dịch vụ thanh toán khác. Tuy nhiên, đối với các doanh nghiệp, họ không muốn thay đổi thói quen của người dùng. Ví dụ, nếu gian hàng của tôi chỉ chấp nhận thanh toán qua WeChat hoặc chỉ chấp nhận thanh toán qua Alipay, điều này sẽ khiến khách hàng của tôi thất vọng và thậm chí không mua được bánh mì ốp la nữa.

Trong thời điểm này, đã xuất hiện các nền tảng bên thứ ba, tổng hợp hơn 90% dịch vụ thanh toán trên thị trường vào một nền tảng duy nhất và cung cấp nền tảng này cho các cửa hàng, siêu thị, gian hàng để sử dụng. Đồng thời hỗ trợ nhiều phương thức thanh toán như quét khuôn mặt, quét code và nhập mật khẩu.

Trong ví dụ này, chúng ta sẽ mô phỏng một nền tảng bên thứ ba như vậy để đảm nhận các khả năng thanh toán khác nhau, đồng thời sử dụng công nghệ nhận dạng khuôn mặt của chính họ để giúp người dùng thanh toán dễ dàng hơn. Vì vậy, chúng ta sẽ có sự kết hợp giữa **nhiều dịch vụ thanh toán** và **nhiều chế độ thanh toán**, và nếu triển khai mỗi chế độ thanh toán cho mỗi dịch vụ, thậm chí là cả việc kế thừa lớp, chúng ta cũng cần phải phát triển rất nhiều. Đồng thời, với việc tiếp nhận thêm nhiều dịch vụ thanh toán hoặc cách thanh toán khác, việc mở rộng sẽ trở nên rất phức tạp.

Hãy suy nghĩ về cách triển khai kịch bản như thế nào!

## Triển khai code tuyến tính

**Quản lý sản phẩm nói rằng yêu cầu của sếp phải triển khai nhanh chóng, bạn xem cách giải quyết KPI!**

Vậy thì nếu bạn ép tôi thì đừng trách tôi vô tình, không có yêu cầu nào tôi không thể triển khai! Dĩ nhiên là khi viết xong thì xong, nhận KPI và bỏ đi. Mỗi ngày lại ép tôi viết yêu cầu, code nguồn càng ngày càng lộn xộn, tôi đau lòng cho những người tiếp theo chỉ trong 3 giây.

### Cấu trúc dự án

```java
design-demo-7-01/
├── pom.xml
└── src
    ├── main
    │   └── java
    │       └── com
    │           └── hnv99
    │               └── design
    │                   └── PayController.java
    └── test
        └── java
            └── com
                └── hnv99
                    └── design
                        └── ApiTest.java
```

- Dự án chỉ có một lớp `PayController` trong đó toàn bộ là các điều kiện `if-else`. Lớp này triển khai tất cả các chức năng liên quan đến thanh toán và xử lý.

### Triển khai code

```java
public class PayController {  
  
    private Logger logger = LoggerFactory.getLogger(PayController.class);  
  
    public boolean doPay(String uId, String tradeId, BigDecimal amount, int channelType, int modeType) {  
        // Thanh toán qua WeChat  
        if (1 == channelType) {  
            logger.info("Bắt đầu thanh toán qua kênh WeChat. uId：{} tradeId：{} amount：{}", uId, tradeId, amount);  
            if (1 == modeType) {  
                logger.info("Thanh toán bằng mật khẩu, kiểm tra an ninh môi trường");  
            } else if (2 == modeType) {  
                logger.info("Thanh toán bằng khuôn mặt, kiểm tra nhận diện khuôn mặt");  
            } else if (3 == modeType) {  
                logger.info("Thanh toán bằng dấu vân tay, kiểm tra thông tin dấu vân tay");  
            }        }        // Thanh toán qua Alipay  
        else if (2 == channelType) {  
            logger.info("Bắt đầu thanh toán qua kênh Alipay. uId：{} tradeId：{} amount：{}", uId, tradeId, amount);  
            if (1 == modeType) {  
                logger.info("Thanh toán bằng mật khẩu, kiểm tra an ninh môi trường");  
            } else if (2 == modeType) {  
                logger.info("Thanh toán bằng khuôn mặt, kiểm tra nhận diện khuôn mặt");  
            } else if (3 == modeType) {  
                logger.info("Thanh toán bằng dấu vân tay, kiểm tra thông tin dấu vân tay");  
            }        }        return true;  
    }  
}
```

- Lớp trên cung cấp một chức năng dịch vụ thanh toán bằng cách điều khiển phương thức thanh toán dựa trên các trường được cung cấp: `userID`, `transactionID`, `amount`, `channel`, và `mode`.
- Các câu lệnh `ifelse` được sử dụng ở đây đại diện cho một trong những cách tồi nhất để xử lý logic này. Ngay cả khi sử dụng `ifelse`, cũng có các phương pháp tối ưu tốt hơn.

### Kiểm thử

**Unit test**

```java
public class ApiTest {  
  
    @Test  
    public void testPay() {  
        PayController pay = new PayController();  
  
        System.out.println("\r\nMô phỏng kịch bản kiểm thử; thanh toán qua WeChat, bằng khuôn mặt.");  
        pay.doPay("weixin_1092033111", "100000109893", new BigDecimal(100), 1, 2);  
  
        System.out.println("\r\nMô phỏng kịch bản kiểm thử; thanh toán qua Alipay, bằng dấu vân tay.");  
        pay.doPay("jlu19dlxo111","100000109894",new BigDecimal(100), 2, 3);  
    }  
}
```

- Đoạn code trên kiểm tra hai loại thanh toán và chế độ khác nhau: Thanh toán qua WeChat sử dụng nhận dạng khuôn mặt và thanh toán qua Alipay sử dụng nhận dạng vân tay.

**Kết quả**

```shell
Mô phỏng kịch bản kiểm thử; thanh toán qua WeChat, bằng khuôn mặt.
2024-03-28 00:02:51.327	INFO	main		(PayController.java:15)	|	Bắt đầu thanh toán qua kênh WeChat. uId：weixin_1092033111 tradeId：100000109893 amount：100
2024-03-28 00:02:51.330	INFO	main		(PayController.java:19)	|	Thanh toán bằng khuôn mặt, kiểm tra nhận diện khuôn mặt

Mô phỏng kịch bản kiểm thử; thanh toán qua Alipay, bằng dấu vân tay.
2024-03-28 00:02:51.331	INFO	main		(PayController.java:26)	|	Bắt đầu thanh toán qua kênh Alipay. uId：jlu19dlxo111 tradeId：100000109894 amount：100
2024-03-28 00:02:51.331	INFO	main		(PayController.java:32)	|	Thanh toán bằng dấu vân tay, kiểm tra thông tin dấu vân tay
```

- Kết quả kiểm tra cho thấy cách xử lý thành công các loại thanh toán và chế độ khác nhau. Tuy nhiên, code này sẽ trở nên rất phức tạp để duy trì và mở rộng trong tương lai.

## Tái cấu trúc theo Bridge Pattern

**Tiếp theo, chúng ta sẽ sử dụng Bridge Pattern để tối ưu code, đồng thời cũng là một lần tái cấu trúc nhỏ.**

Từ cách triển khai sử dụng `if-else` như trên, có thể thấy rằng đây là sự kết hợp của hai loại khác nhau. Do đó, chúng ta có thể phân tách _phương thức thanh toán_ và _chế độ thanh toán_ bằng cách **phụ thuộc trừu tượng vào lớp triển khai**, thông qua cách phân tách như vậy, phương thức thanh toán và chế độ thanh toán thực tế có thể được sử dụng độc lập, và khi cần kết hợp, chỉ cần chuyển chế độ cho phương thức thanh toán là đủ.

Ý nghĩa chính của Bridge Pattern là điểm kết nối được chọn để phân chia. Nếu không có điểm kết nối như vậy, thì không cần thiết phải sử dụng Bridge Pattern.

### Cấu trúc dự án

```shell
design-demo-7-02/
├── pom.xml
└── src
    ├── main
    │   └── java
    │       └── com
    │           └── hnv99
    │               └── design
    │                   ├── channel
    │                   │   ├── Pay.java
    │                   │   ├── WxPay.java
    │                   │   └── ZfbPay.java
    │                   └── mode
    │                       ├── IPayMode.java
    │                       ├── PayCypher.java
    │                       ├── PayFaceMode.java
    │                       └── PayFingerprintMode.java
    └── test
        └── java
            └── com
                └── hnv99
                    └── design
                        └── ApiTest.java

```

**Cấu trúc Bridge Pattern**

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240328005130.png)

- Bên trái, `Pay` là một lớp trừu tượng, dưới đó là hai triển khai loại thanh toán của nó; thanh toán qua WeChat và thanh toán qua Alipay.
- Bên phải, `IPayMode` là một giao diện, dưới đó là hai chế độ thanh toán của nó; thanh toán bằng khuôn mặt và thanh toán bằng dấu vân tay.
- Do đó, `loại thanh toán` × `chế độ thanh toán` = có thể thu được sự kết hợp tương ứng.
- **Lưu ý**, mỗi loại thanh toán có sự khác biệt, và quy trình xác minh khuôn mặt và dấu vân tay cũng khác nhau, có thể sử dụng mẫu adapter để xử lý, nhưng điều này không phải là điểm tập trung của bài viết này, bạn có thể xem phần mẫu adapter.

### Triển khai code

#### Lớp trừu tượng cầu nối loại thanh toán

```java
public abstract class Pay {

    protected Logger logger = LoggerFactory.getLogger(Pay.class);

    protected IPayMode payMode;

    public Pay(IPayMode payMode) {
        this.payMode = payMode;
    }

    public abstract String transfer(String uId, String tradeId, BigDecimal amount);

}

```

- Trong lớp này, chúng tôi đã định nghĩa một phương thức chuyển tiền cần phải được thực hiện bởi loại thanh toán: `transfer`, cũng như giao diện cầu nối: `IPayMode`, và trong hàm tạo chọn lựa của người dùng cho loại thanh toán.
- Nếu bạn chưa quen với cách triển khai này, hãy tập trung vào `IPayMode payMode`, đây là phần cầu nối chính.

#### Triển khai hai cổng thanh toán

**Thanh toán qua WeChat**

```java
public class WxPay extends Pay {

    public WxPay(IPayMode payMode) {
        super(payMode);
    }

    public String transfer(String uId, String tradeId, BigDecimal amount) {
        logger.info("Bắt đầu chuyển khoản qua kênh WeChat. uId：{} tradeId：{} amount：{}", uId, tradeId, amount);
        boolean security = payMode.security(uId);
        logger.info("Kiểm tra an ninh kênh thanh toán WeChat. uId：{} tradeId：{} security：{}", uId, tradeId, security);
        if (!security) {
            logger.info("Chặn thanh toán qua kênh WeChat. uId：{} tradeId：{} amount：{}", uId, tradeId, amount);
            return "0001";
        }
        logger.info("Chuyển khoản qua kênh WeChat thành công. uId：{} tradeId：{} amount：{}", uId, tradeId, amount);
        return "0000";
    }

}
```

**Thanh toán qua Alipay**

```java
public class ZfbPay extends Pay {

    public ZfbPay(IPayMode payMode) {
        super(payMode);
    }

    public String transfer(String uId, String tradeId, BigDecimal amount) {
        logger.info("Bắt đầu chuyển khoản qua kênh Alipay. uId：{} tradeId：{} amount：{}", uId, tradeId, amount);
        boolean security = payMode.security(uId);
        logger.info("Kiểm tra an ninh kênh thanh toán Alipay. uId：{} tradeId：{} security：{}", uId, tradeId, security);
        if (!security) {
            logger.info("Chặn thanh toán qua kênh Alipay. uId：{} tradeId：{} amount：{}", uId, tradeId, amount);
            return "0001";
        }
        logger.info("Chuyển khoản qua kênh Alipay thành công. uId：{} tradeId：{} amount：{}", uId, tradeId, amount);
        return "0000";
    }

}
```

- Ở đây, chúng tôi mô phỏng việc gọi hai kênh thanh toán của bên thứ ba; WeChat và Alipay. Tuy nhiên, như là một nền tảng thanh toán tổng hợp, có thể không chỉ là hai kênh này mà còn nhiều hơn nữa.
- Bạn cũng có thể thấy rằng khi thanh toán, chúng tôi đã gọi một giao diện kiểm soát bảo mật để xác minh, nghĩa là mọi phương thức thanh toán (`Quét khuôn mặt`, `Quét vân tay`) đều cần thông qua kiểm soát bảo mật đã chỉ định để đảm bảo an toàn thanh toán.

#### Định nghĩa interface thanh toán

```java
public interface IPayMode {

    boolean security(String uId);

}
```

- Mọi phương thức thanh toán; Quét khuôn mặt, Quét vân tay, Mật khẩu, đều sẽ trải qua kiểm soát an ninh khác nhau. Ở đây, chúng tôi định nghĩa một giao diện kiểm soát bảo mật.

#### Ba loại kiểm soát bảo mật thanh toán (Quét khuôn mặt, Quét vân tay, Mật khẩu)

**Quét khuôn mặt**

```java
public class PayFaceMode implements IPayMode{

    protected Logger logger = LoggerFactory.getLogger(PayCypher.class);

    public boolean security(String uId) {
        logger.info("Thanh toán bằng quét khuôn mặt, kiểm tra nhận diện khuôn mặt");
        return true;
    }

}
```

**Quét vân tay**

```java
public class PayFingerprintMode implements IPayMode{

    protected Logger logger = LoggerFactory.getLogger(PayCypher.class);

    public boolean security(String uId) {
        logger.info("Thanh toán bằng quét vân tay, kiểm tra thông tin vân tay");
        return true;
    }

}
```

**Mật khẩu**

```java
public class PayCypher implements IPayMode{

    protected Logger logger = LoggerFactory.getLogger(PayCypher.class);

    public boolean security(String uId) {
        logger.info("Thanh toán bằng mật khẩu, kiểm tra môi trường an ninh");
        return true;
    }

}
```

- Ở đây, chúng tôi triển khai ba loại kiểm soát bảo mật thanh toán (Quét khuôn mặt, Quét vân tay, Mật khẩu). Khi người dùng chọn loại thanh toán khác nhau, một phương thức kiểm soát bảo mật tương ứng sẽ được thực hiện để đảm bảo an toàn thanh toán.

### Kiểm thử

#### Viết unit test

```java
public class ApiTest {  
    @Test  
    public void testPay() {  
  
        System.out.println("\r\nMô phỏng kịch bản kiểm thử; thanh toán qua WeChat, bằng khuôn mặt.");  
        Pay wxPay = new WxPay(new PayFaceMode());  
        wxPay.transfer("weixin_1092033111", "100000109893", new BigDecimal(100));  
  
        System.out.println("\r\nMô phỏng kịch bản kiểm thử; thanh toán qua Alipay, bằng dấu vân tay.");  
        Pay zfbPay = new ZfbPay(new PayFingerprintMode());  
        zfbPay.transfer("jlu19dlxo111","100000109894",new BigDecimal(100));  
  
    }
}
```         

- So với cách triển khai ifelse ở trên, cách tiếp cận ở đây trở nên gọn gàng, sạch sẽ và dễ sử dụng hơn; `new WxPay(new PayFaceMode())` và `new ZfbPay(new PayFingerprintMode())`.
- Người dùng giao diện sử dụng bên ngoài không cần quan tâm đến cài đặt cụ thể, chỉ cần chọn và sử dụng theo nhu cầu.
- Hiện tại, việc tối ưu hóa chủ yếu đối với phần logic `if` đã được thực hiện bằng cách sử dụng bridge pattern, phần gọi có thể được cấu hình hóa bằng `abstract factory` hoặc `strategy pattern` kết hợp với cấu trúc bản đồ. Vì mục đích chính ở đây là trình bày `mô hình cầu nối`, nên không cần phải thêm mã nguồn phức tạp, tránh làm mất tập trung.

#### 3.2 Kết quả kiểm tra

```java
Mô phỏng kịch bản kiểm thử; thanh toán qua WeChat, bằng khuôn mặt.
2024-03-28 00:49:16.191	INFO	main		(WxPay.java:14)	|	Bắt đầu chuyển khoản qua kênh WeChat. uId：weixin_1092033111 tradeId：100000109893 amount：100
2024-03-28 00:49:16.194	INFO	main		(PayFaceMode.java:11)	|	Thanh toán bằng khuôn mặt, kiểm tra nhận diện khuôn mặt
2024-03-28 00:49:16.194	INFO	main		(WxPay.java:16)	|	Kiểm tra bảo mật kênh WeChat. uId：weixin_1092033111 tradeId：100000109893 security：true
2024-03-28 00:49:16.194	INFO	main		(WxPay.java:21)	|	Chuyển khoản qua kênh WeChat thành công. uId：weixin_1092033111 tradeId：100000109893 amount：100

Mô phỏng kịch bản kiểm thử; thanh toán qua Alipay, bằng dấu vân tay.
2024-03-28 00:49:16.194	INFO	main		(ZfbPay.java:14)	|	Bắt đầu chuyển khoản qua kênh Alipay. uId：jlu19dlxo111 tradeId：100000109894 amount：100
2024-03-28 00:49:16.194	INFO	main		(PayFingerprintMode.java:11)	|	Thanh toán bằng dấu vân tay, kiểm tra thông tin dấu vân tay
2024-03-28 00:49:16.195	INFO	main		(ZfbPay.java:16)	|	Kiểm tra bảo mật kênh Alipay. uId：jlu19dlxo111 tradeId：100000109894 security：true
2024-03-28 00:49:16.195	INFO	main		(ZfbPay.java:21)	|	Chuyển khoản qua kênh Alipay thành công. uId：jlu19dlxo111 tradeId：100000109894 amount：100

```           

- Từ kết quả kiểm tra, nội dung là giống nhau, nhưng cách triển khai tổng thể đã thay đổi rất nhiều. **Vì vậy, đôi khi không chỉ cần xem kết quả, mà còn cần xem quá trình**

## Tổng kết

- Bằng cách mô phỏng hai kênh thanh toán WeChat và Alipay trong các cấu hình thanh toán khác nhau, như `quét khuôn mặt`, `quét vân tay`, và `mật khẩu`, chúng ta đã thể hiện được sự áp dụng hợp lý của bridge pattern trong các tình huống như vậy. Điều này giúp giảm đơn giản hóa việc phát triển mã nguồn, đồng thời tạo điều kiện cho việc mở rộng yêu cầu trong tương lai.
- Từ cách triển khai của bridge pattern, chúng ta đã tuân thủ nguyên tắc trách nhiệm đơn giản và nguyên tắc mở rộng. Điều này làm cho mỗi phần của mã nguồn trở nên rõ ràng và dễ bảo trì và mở rộng. Tuy nhiên, nếu chúng ta triển khai mã nguồn với sự tập trung cao, mã nguồn có thể trở nên phức tạp. Vì vậy, khi chọn lựa việc tái cấu trúc mã nguồn, cần cân nhắc kỹ lưỡng về thiết kế tổng thể của dự án, nếu không, việc lựa chọn mẫu thiết kế sẽ trở nên khó khăn và có thể làm cho mã nguồn trở nên khó phát triển.
- Việc lựa chọn và sử dụng bất kỳ mẫu thiết kế nào cũng nên tuân thủ nguyên tắc phù hợp với tình huống cụ thể, không nên sử dụng cố ý. Đồng thời, trong một số trường hợp, do sự phức tạp của yêu cầu kinh doanh, có thể cần sử dụng sự kết hợp của nhiều mẫu thiết kế để thiết kế mã nguồn một cách hợp lý. Tuy nhiên, những kinh nghiệm này cần được học từ dự án thực tế và tiếp tục áp dụng.
