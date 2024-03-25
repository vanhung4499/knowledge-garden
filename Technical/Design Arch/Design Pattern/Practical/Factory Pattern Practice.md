---
title: Factory Pattern Practice
tags:
  - design-pattern
categories: 
date created: 2024-03-25
date modified: 2024-03-25
---

# Thực chiến Factory Method Pattern "Xây dựng dịch vụ phát thưởng thống nhất cho nhiều loại hàng hóa khác nhau"

## Giới thiệu

"Code đẹp như nhau, nhưng chương trình kinh tởm thì được thăng chức và tăng lương."

Việc nói hay không nói, hầu hết các lập trình viên đều biết hoặc hiểu về mẫu thiết kế, nhưng hầu hết các bạn viết mã vẫn có thói quen tự do. Dù có bao nhiêu business logic cũng chỉ là một lớp với hàng nghìn dòng code, quá trình phát triển như vậy có thể tóm gọn trong ba bước: xác định thuộc tính, tạo phương thức, gọi interface, Done! Chỉ là việc phát triển ngắn hạn, nhưng tái cấu trúc là đập đi xây lại.

Mã nguồn tốt không chỉ để hoàn thành chức năng hiện tại, mà còn xem xét mở rộng sau này. Trên cấu trúc thiết kế là mềm dẻo, dễ đọc, dễ mở rộng, trong thực thi lĩnh vực cao độ gắn kết không để lộ chi tiết thực hiện không bị làm phiền bởi bên ngoài. Và điều này giống như trang trí nhà bạn với các loại nhà ba phòng ngủ (MVC), bốn phòng ngủ (DDD), bạn sẽ không cho phép một ngôi nhà giá hàng trăm nghìn đô la để dây cáp ống nước lộ ra ngoài, cũng như không cho phép đặt bồn cầu trong phòng bếp, bếp nướng lắp đặt trong phòng tắm.

**Ai phát minh ra mẫu thiết kế?** Khái niệm về mẫu thiết kế ban đầu được `Christopher Alexander` đề xuất trong tác phẩm của ông, `Ngôn ngữ mẫu kiến trúc`. Cuốn sách này giới thiệu "ngôn ngữ" của thiết kế đô thị, cung cấp 253 mẫu mô tả về thành phố, khu phố, nhà ở, khu vườn, phòng và cấu trúc phương Tây, và đơn vị cơ bản của "ngôn ngữ" như vậy là mẫu. Sau đó, `Erich Gamma`, `John Vlissides`, `Ralph Johnson` và `Richard Helm` bốn tác giả đã chấp nhận khái niệm về mẫu. Vào năm 1994, họ đã xuất bản cuốn sách `Mẫu thiết kế: Cơ sở của phần mềm hướng đối tượng có thể tái sử dụng`.

Thực ra, một phần của người không đọc kỹ sách và tài liệu liên quan đến mẫu thiết kế, nhưng vẫn có thể viết code tốt. Điều này chủ yếu là do sau nhiều dự án trải qua và sự theo đuổi liên tục của thiết kế chương trình, đã trích xuất ra được kinh nghiệm. Và kinh nghiệm này cuối cùng sẽ gần như giống như nội dung được đề cập trong mẫu thiết kế, đòi hỏi sự kết hợp cao, kết hợp thấp, có thể mở rộng, có thể tái sử dụng. Bạn có thể gặp phải một số trải nghiệm tương tự, khi nghiên cứu mã nguồn của một số framework, bạn phát hiện ra rằng một số thiết kế trong đó giống như khi bạn phát triển.

**Tôi không học được mẫu thiết kế làm sao?** Tiền đã bỏ ra, sách đã mua. Code vẫn là một chùm! Mẫu thiết kế được rút ra từ kinh nghiệm nhiều năm và trở thành tư duy hướng dẫn phát triển. Giống như tôi nói với bạn làm thế nào để đi xe đạp, lái xe, nhưng chỉ cần bạn không chạy hàng nghìn dặm, bạn chỉ có thể nhớ lý thuyết, muốn tham gia giao thông vẫn cảm thấy hoang mang!

**Vì vậy**, ở phần đầu của loạt chủ đề mẫu thiết kế này, chúng tôi sẽ đưa bạn sử dụng ý tưởng về mẫu thiết kế để tối ưu hóa mã. Điều này giúp bạn học hỏi và tích lũy kinh nghiệm cho bản thân. Tất nhiên, ở đây cần phải thực hành nhiều hơn, chỉ khi _con người và phương tiện hoà hợp,_ chúng ta mới có thể xây dựng được code hợp lý hơn dựa trên các mẫu thiết kế.

## Môi trường phát triển

1. JDK 1.8
2. Idea + Maven
3. Code: [vanhung4499/practical-java-design](https://github.com/vanhung4499/practical-java-design)

| Dự án             | Mô tả                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------- |
| demo-design-1-00  | Dự án mô phỏng, cung cấp interface phát thưởng cho ba nhóm sản phẩm khác nhau               |
| demo-design-1-01  | Sử dụng mã nguồn lạng lách để triển khai business requiremetnt, cũng là việc sử dụng ifelse |
| idemo-design-1-02 | Tối ưu mã nguồn thông qua mấu thiết kể, tạo ra sự so sánh để học hỏi                    |

> [!info] Cách đánh thứ tự
> - 1-00, 1 đại diện cho mấu thiết kể đầu tiên, Factory Method Pattern
> - 1-00, 00 đại diện cho tình huống mô phỏng
> - 1-01, 01 đại diện cho phương pháp triển khai đầu tiên, tiếp theo là 02 03 và cứ thế

## ## Giới thiệu về Mẫu thiết kế Factory Method

Mẫu thiết kế Factory, còn được gọi là mẫu thiết kế Factory Method, là một mẫu thiết kế tạo đối tượng, trong đó phương thức tạo đối tượng được cung cấp trong lớp cha, cho phép lớp con quyết định loại đối tượng được khởi tạo.

Mẫu thiết kế này cũng là một trong những mẫu thiết kế phổ biến nhất trong phát triển Java. Mục đích chính của nó là xác định một interface tạo đối tượng, để cho phép các lớp con tự quyết định khởi tạo đối tượng nào, mẫu thiết kế factory cho phép quá trình tạo ra trì hoãn cho lớp con.

Nói một cách đơn giản, mục đích của nó là cung cấp tính mở rộng của cấu trúc mã nguồn và che giấu logic cụ thể của từng lớp chức năng. Điều này giúp việc gọi từ bên ngoài trở nên đơn giản hơn, đồng thời cũng là cách loại bỏ nhiều trường hợp `ifelse`. Tất nhiên, điều này cũng có thể có một số nhược điểm, như số lượng lớp cần triển khai rất nhiều, cách thức quản lý như thế nào, làm thế nào để giảm thiểu chi phí phát triển. Tuy nhiên, những vấn đề này có thể được giảm bớt thông qua việc sử dụng kết hợp mẫu thiết kế sau này.

## Mô phỏng việc phát thưởng nhiều loại hàng hóa

Để làm cho các ví dụ học tập trở nên gần gũi hơn với việc phát triển thực tế, ở đây chúng ta mô phỏng một doanh nghiệp trực tuyến trong một tình huống tiếp thị. Do tính phức tạp, thay đổi và tạm thời của tình huống tiếp thị, việc thiết kế yêu cầu sự chuyên sâu hơn, nếu không sẽ thường xuyên đối mặt với các hoạt động CRUD khẩn cấp, dẫn đến cấu trúc mã nguồn lộn xộn và khó bảo trì.

Trong tình huống tiếp thị, thường xuyên có người dùng thực hiện một số thao tác: đăng ký, chia sẻ, đánh giá, mời đăng ký, v.v, để nhận điểm thưởng và cuối cùng sử dụng điểm thưởng để đổi hàng hoá, từ đó thúc đẩy buôn bán và thu hút người dùng mới.

Vì vậy, ở đây chúng ta mô phỏng việc phát thưởng nhiều loại hàng hóa trong quá trình đổi điểm thưởng, giả sử bây giờ chúng ta có ba loại interface hàng hóa sau:

| STT | Loại                         | Interface                                                               |
| --- | ---------------------------- | ----------------------------------------------------------------------- |
| 1   | Phiếu giảm giá               | `CouponResult sendCoupon(String uId, String couponNumber, String uuid)` |
| 2   | Hàng hóa thực                | `Boolean deliverGoods(DeliverReq req)`                                  |
| 3   | Thẻ đổi Iqiyi của bên thứ ba | `void grantToken(String bindMobileNumber, String cardId)`               |  

**Từ các interface trên, ta có các thông tin sau:**

- Ba interface trả về khác nhau, có kiểu đối tượng, kiểu boolean và một kiểu rỗng.
- Các tham số đầu vào khác nhau, việc gửi phiếu giảm giá cần thông tin khách hàng, số phiếu giảm giá, uuid; việc đổi thẻ cần ID thẻ, hàng hóa thực cần thông tin về địa chỉ giao hàng (chứa trong đối tượng).
- Ngoài ra, có thể sẽ có thêm loại hàng hóa khác được thêm vào sau này do yêu cầu phát triển kinh doanh của bạn. Bởi vì mọi nhu cầu phát triển của bạn đều điều chỉnh theo sự mở rộng của doanh nghiệp đối với thị trường.

## Triển khai bằng cách viết code lồng nhau

Nếu không xem xét đến tính mở rộng, chỉ để đáp ứng yêu cầu một cách nhanh chóng, thì việc phát thưởng cho các loại như vậy chỉ cần sử dụng câu lệnh if-else để kiểm tra và gọi các interface khác nhau là đủ. Điều này có thể là cách thường được sử dụng bởi một số bạn mới bắt đầu lập trình. Tiếp theo, chúng ta sẽ triển khai business requirement theo cách này trước.

### Cấu trúc dự án

```bash
design-demo-1-01/
├── pom.xml
└── src
    ├── main
    │   └── java
    │       └── com
    │           └── hnv99
    │               └── design
    │                   ├── AwardReq.java
    │                   ├── AwardRes.java
    │                   └── PrizeController.java
    └── test
        └── java
            └── com
                └── hnv99
                    └── design
                        └── ApiTest.java
```

- Cấu trúc dự án rất đơn giản, bao gồm một đối tượng đầu vào `AwardReq`, một đối tượng đầu ra `AwardRes`, và một lớp interface `PrizeController`.

### Triển khai bằng if-else

```java
  
public class PrizeController {  
  
    private Logger logger = LoggerFactory.getLogger(PrizeController.class);  
  
    public AwardRes awardToUser(AwardReq req) {  
        String reqJson = JSON.toJSONString(req);  
        AwardRes awardRes = null;  
        try {  
            logger.info("Bắt đầu phát thưởng cho {}。req:{}", req.getUId(), reqJson);  
            // Dựa vào loại phần thưởng khác nhau [1 phiếu giảm giá, 2 hàng hóa thực tế, 3 thẻ đổi thưởng bên thứ ba (ví dụ  Garena)]  
            if (req.getAwardType() == 1) {  
                CouponService couponService = new CouponService();  
                CouponResult couponResult = couponService.sendCoupon(req.getUId(), req.getAwardNumber(), req.getBizId());  
                if ("0000".equals(couponResult.getCode())) {  
                    awardRes = new AwardRes("0000", "Phát thành công");  
                } else {  
                    awardRes = new AwardRes("0001", couponResult.getInfo());  
                }            } else if (req.getAwardType() == 2) {  
                GoodsService goodsService = new GoodsService();  
                DeliveryReq deliverReq = new DeliveryReq();  
                deliverReq.setUserName(queryUserName(req.getUId()));  
                deliverReq.setUserPhone(queryUserPhoneNumber(req.getUId()));  
                deliverReq.setSku(req.getAwardNumber());  
                deliverReq.setOrderId(req.getBizId());  
                deliverReq.setConsigneeUserName(req.getExtMap().get("consigneeUserName"));  
                deliverReq.setConsigneeUserPhone(req.getExtMap().get("consigneeUserPhone"));  
                deliverReq.setConsigneeUserAddress(req.getExtMap().get("consigneeUserAddress"));  
                Boolean isSuccess = goodsService.deliverGoods(deliverReq);  
                if (isSuccess) {  
                    awardRes = new AwardRes("0000", "Phát thành công");  
                } else {  
                    awardRes = new AwardRes("0001", "Phát thất bại");  
                }            } else if (req.getAwardType() == 3) {  
                String bindMobileNumber = queryUserPhoneNumber(req.getUId());  
                GarenaCardService garenaCardService = new GarenaCardService();  
                garenaCardService.grantToken(bindMobileNumber, req.getAwardNumber());  
                awardRes = new AwardRes("0000", "Phát thành công");  
            }            logger.info("Hoàn tất việc phát thưởng cho {}。", req.getUId());  
        } catch (Exception e) {  
            logger.error("Phát thưởng thất bại {}。req:{}", req.getUId(), reqJson, e);  
            awardRes = new AwardRes("0001", e.getMessage());  
        }  
        return awardRes;  
    }  
    private String queryUserName(String uId) {  
        return "Hung Nguyen";  
    }  
    private String queryUserPhoneNumber(String uId) {  
        return "012345678";  
    }}
```

Trên đây là một đoạn code trực tiếp sử dụng if-else để triển khai business requirement. Nếu chỉ xem xét từ góc độ business, việc triển khai cũng như dự kiến đã thực hiện được.

Code này trong tình hình hiện tại không có vấn đề gì đáng lo ngại. Tuy nhiên nếu sau này code này phải trải qua một vài lần phát triển và mở rộng, việc phát triển code sẽ trở nên khó khăn. Chi phí tái cấu trúc cao, cần phải sửa lại các interface trước đó, thời gian kiểm tra dài, cần phải kiểm tra lại toàn bộ một lần. Đây cũng là lý do tại sao nhiều người không muốn tiếp nhận mã nguồn của người khác, và nếu nhận, họ sẽ bị ép buộc về thời gian phát triển. Do đó, có thể thấy rằng số lần sử dụng if-else như vậy sẽ tiếp tục tăng lên.

### Kiểm thử

Viết một bài unit test để kiểm tra phương pháp xử lý trên. Phát triển thói quen viết unit test sẽ giúp bạn nâng cao chất lượng code.

```java
public class ApiTest {  
  
    private Logger logger = LoggerFactory.getLogger(ApiTest.class);  
  
    @Test  
    public void test_awardToUser() {  
        PrizeController prizeController = new PrizeController();  
  
        System.out.println("\r\nKiểm tra phát phiếu giảm giá\r\n");  
        // Kiểm tra phát phiếu giảm giá  
        AwardReq req01 = new AwardReq();  
        req01.setUId("10001");  
        req01.setAwardType(1);  
        req01.setAwardNumber("EGM1023938910232121323432");  
        req01.setBizId("791098764902132");  
        AwardRes awardRes01 = prizeController.awardToUser(req01);  
  
        logger.info("Tham số yêu cầu: {}", JSON.toJSON(req01));  
        logger.info("Kết quả kiểm tra: {}", JSON.toJSON(awardRes01));  
  
        System.out.println("\r\nKiểm tra việc giao dịch hàng hoá thực\r\n");  
        // Kiểm tra giao dịch hàng hoá thực  
        AwardReq req02 = new AwardReq();  
        req02.setUId("10001");  
        req02.setAwardType(2);  
        req02.setAwardNumber("9820198721311");  
        req02.setBizId("1023000020112221113");  
        req02.setExtMap(new HashMap<String, String>() {{  
            put("consigneeUserName", "Hung Nguyen");  
            put("consigneeUserPhone", "012345678");  
            put("consigneeUserAddress", "Thu Duc, HCMC");  
        }});  
        AwardRes awardRes02 = prizeController.awardToUser(req02);  
        logger.info("Tham số yêu cầu: {}", JSON.toJSON(req02));  
        logger.info("Kết quả kiểm tra: {}", JSON.toJSON(awardRes02));  
  
        System.out.println("\r\nThẻ đổi thưởng bên thứ ba (Garena)\r\n");  
        AwardReq req03 = new AwardReq();  
        req03.setUId("10001");  
        req03.setAwardType(3);  
        req03.setAwardNumber("AQY1xjkUodl8LO975GdfrYUio");  
  
        AwardRes awardRes03 = prizeController.awardToUser(req03);  
        logger.info("Tham số yêu cầu: {}", JSON.toJSON(req03));  
        logger.info("Kết quả kiểm tra: {}", JSON.toJSON(awardRes03));    
    }
}
```

**Kết quả:**

```shell
Kiểm tra phát phiếu giảm giá

2024-03-25 20:58:32.171	INFO	main		(PrizeController.java:21)	|	Bắt đầu phát thưởng cho 10001。req:{"awardNumber":"EGM1023938910232121323432","awardType":1,"bizId":"791098764902132","uId":"10001"}
Mô phỏng việc phát phiếu giảm giá: 10001, EGM1023938910232121323432, 791098764902132
2024-03-25 20:58:32.175	INFO	main		(PrizeController.java:53)	|	Hoàn tất việc phát thưởng cho 10001。
2024-03-25 20:58:32.176	INFO	main		(ApiTest.java:27)	|	Tham số yêu cầu: {"uId":"10001","bizId":"791098764902132","awardNumber":"EGM1023938910232121323432","awardType":1}
2024-03-25 20:58:32.178	INFO	main		(ApiTest.java:28)	|	Kết quả kiểm tra: {"code":"0000","info":"Phát thành công"}

Kiểm tra việc giao dịch hàng hoá thực

2024-03-25 20:58:32.179	INFO	main		(PrizeController.java:21)	|	Bắt đầu phát thưởng cho 10001。req:{"awardNumber":"9820198721311","awardType":2,"bizId":"1023000020112221113","extMap":{"consigneeUserName":"Hung Nguyen","consigneeUserPhone":"012345678","consigneeUserAddress":"Thu Duc, HCMC"},"uId":"10001"}
Mô phỏng việc giao hàng hàng hoá thực: {"consigneeUserAddress":"Thu Duc, HCMC","consigneeUserName":"Hung Nguyen","consigneeUserPhone":"012345678","orderId":"1023000020112221113","sku":"9820198721311","userName":"Hung Nguyen","userPhone":"012345678"}
2024-03-25 20:58:32.183	INFO	main		(PrizeController.java:53)	|	Hoàn tất việc phát thưởng cho 10001。
2024-03-25 20:58:32.183	INFO	main		(ApiTest.java:44)	|	Tham số yêu cầu: {"extMap":{"consigneeUserName":"Hung Nguyen","consigneeUserAddress":"Thu Duc, HCMC","consigneeUserPhone":"012345678"},"uId":"10001","bizId":"1023000020112221113","awardNumber":"9820198721311","awardType":2}
2024-03-25 20:58:32.183	INFO	main		(ApiTest.java:45)	|	Kết quả kiểm tra: {"code":"0000","info":"Phát thành công"}

Thẻ đổi thưởng bên thứ ba (Garena)

2024-03-25 20:58:32.183	INFO	main		(PrizeController.java:21)	|	Bắt đầu phát thưởng cho 10001。req:{"awardNumber":"AQY1xjkUodl8LO975GdfrYUio","awardType":3,"uId":"10001"}
Mô phỏng việc phát thẻ game Garena: 012345678, AQY1xjkUodl8LO975GdfrYUio
2024-03-25 20:58:32.184	INFO	main		(PrizeController.java:53)	|	Hoàn tất việc phát thưởng cho 10001。
2024-03-25 20:58:32.184	INFO	main		(ApiTest.java:54)	|	Tham số yêu cầu: {"uId":"10001","awardNumber":"AQY1xjkUodl8LO975GdfrYUio","awardType":3}
2024-03-25 20:58:32.184	INFO	main		(ApiTest.java:55)	|	Kết quả kiểm tra: {"code":"0000","info":"Phát thành công"}

```

- Kết quả chạy bình thường, đáp ứng mọi business requirement hiện tại và viết rất nhanh. Nhưng! Thực sự rất khó để bảo trì!

## Tái cấu trúc: Factory Method Pattern

Tiếp theo, chúng ta sẽ sử dụng Factory Method Pattern để tối ưu hóa mã, đây cũng được coi là một ví dụ nhỏ về **Refactoring**. Sau khi Refactoring, bạn sẽ thấy cấu trúc mã rõ ràng hơn và có khả năng mở rộng cho các yêu cầu nghiệp vụ mới trong tương lai. Tuy nhiên, trong thực tế, chúng ta sẽ tiếp tục hoàn thiện nó, phần hiện tại chỉ tóm tắt phần cốt lõi nhất để bạn dễ dàng học tập.

### Cấu trúc dự án

- Đầu tiên, hãy nhìn vào cấu trúc dự án trên, bạn có cảm nhận gì? Ví dụ:
	- Nó có vẻ rõ ràng hơn.
	- Việc phân chia tầng lớp như vậy giúp mở rộng dễ dàng hơn.
	- Có thể tưởng tượng mỗi lớp thực hiện chức năng gì.
- Nếu bạn vẫn chưa hiểu tại sao cần sửa đổi như vậy, cũng không sao cả. Bởi vì bạn đang học hỏi sức mạnh của Factory Pattern thông qua bài viết này. Đồng thời, sau khi xem mã nguồn và thực hành vài lần, bạn sẽ dần dần nắm vững kỹ thuật của Factory Pattern.

### Triển khai code

#### Định nghĩa Interface phát thưởng

```java
public interface ICommodity {
    void sendCommodity(String uId, String commodityId, String bizId, Map<String, String> extMap) throws Exception;
}
```

- Tất cả các giải thưởng, dù là vật lý, ảo hay bên thứ ba, đều cần được xử lý thông qua chương trình của chúng tôi để triển khai interface này nhằm đảm bảo tính thống nhất của đầu vào và đầu ra sau cùng.
- Các thông số đầu vào của interface bao gồm: `User ID`, `Prize ID`, `Business ID` và `Extra Field` được sử dụng để xử lý địa chỉ thu hoạch khi phát thưởng hàng hóa vật lý.

#### Implement ICommodity Interface

##### **Coupon (Phiếu giảm giá)**

```java
public class CouponCommodityService implements ICommodity {  
  
    private Logger logger = LoggerFactory.getLogger(CouponCommodityService.class);  
  
    private CouponService couponService = new CouponService();  
  
    public void sendCommodity(String uId, String commodityId, String bizId, Map<String, String> extMap) throws Exception {  
        CouponResult couponResult = couponService.sendCoupon(uId, commodityId, bizId);  
        logger.info("Tham số yêu cầu[Phiếu giảm giá] => uId：{} commodityId：{} bizId：{} extMap：{}", uId, commodityId, bizId, JSON.toJSON(extMap));  
        logger.info("Kết quả kiểm thử[Phiếu giảm giá]：{}", JSON.toJSON(couponResult));  
        if (!"0000".equals(couponResult.getCode())) throw new RuntimeException(couponResult.getInfo());  
    }  
}
```

##### **Goods (Hàng hóa)**

```java
public class GoodsCommodityService implements ICommodity {  
  
    private Logger logger = LoggerFactory.getLogger(GoodsCommodityService.class);  
  
    private GoodsService goodsService = new GoodsService();  
  
    public void sendCommodity(String uId, String commodityId, String bizId, Map<String, String> extMap) throws Exception {  
        DeliveryReq deliveryReq = new DeliveryReq();  
        deliveryReq.setUserName(queryUserName(uId));  
        deliveryReq.setUserPhone(queryUserPhoneNumber(uId));  
        deliveryReq.setSku(commodityId);  
        deliveryReq.setOrderId(bizId);  
        deliveryReq.setConsigneeUserName(extMap.get("consigneeUserName"));  
        deliveryReq.setConsigneeUserPhone(extMap.get("consigneeUserPhone"));  
        deliveryReq.setConsigneeUserAddress(extMap.get("consigneeUserAddress"));  
  
        Boolean isSuccess = goodsService.deliverGoods(deliveryReq);  
  
        logger.info("Tham số yêu cầu[Phiếu giảm giá] => uId：{} commodityId：{} bizId：{} extMap：{}", uId, commodityId, bizId, JSON.toJSON(extMap));  
        logger.info("Kết quả kiểm thử[Phiếu giảm giá]：{}", isSuccess);  
  
        if (!isSuccess) throw new RuntimeException("Phát hàng hóa thất bại");  
    }  
    private String queryUserName(String uId) {  
        return "Hung Nguyen";  
    }  
    private String queryUserPhoneNumber(String uId) {  
        return "012345678";  
    }  
}
```

##### **Card (Thẻ)**

```java
  
public class CardCommodityService implements ICommodity {  
  
    private Logger logger = LoggerFactory.getLogger(CardCommodityService.class);  
  
    // Giả lập việc chèn  
    private GarenaCardService garenaCardService = new GarenaCardService();  
  
    public void sendCommodity(String uId, String commodityId, String bizId, Map<String, String> extMap) throws Exception {  
        String mobile = queryUserMobile(uId);  
        garenaCardService.grantToken(mobile, bizId);  
        logger.info("Tham số yêu cầu[Thẻ đổi thưởng Garena] => uId：{} commodityId：{} bizId：{} extMap：{}", uId, commodityId, bizId, JSON.toJSON(extMap));  
        logger.info("Kết quả kiểm thử[Thẻ đổi thưởng Garena]：Thành công");  
    }  
    private String queryUserMobile(String uId) {  
        return "012345678";  
    }  
}
```

- Có thể thấy mỗi loại phần thưởng được triển khai trong lớp riêng của nó, việc thêm, sửa đổi hoặc xóa sẽ không ảnh hưởng đến chức năng kiểm thử của các phần thưởng khác.
- Các giải thưởng bổ sung sau đó chỉ cần điền theo cấu trúc này, rất dễ duy trì và mở rộng.
- Sau khi thống nhất các tham số đầu vào và tham số đầu ra, người gọi không còn cần quan tâm đến logic bên trong của việc phân phối giải thưởng và có thể xử lý nó một cách thống nhất.

#### Tạo StoreFactory

```java
public class StoreFactory {
    public ICommodity getCommodityService(Integer commodityType) {
        if (null == commodityType) return null;
        if (1 == commodityType) return new CouponCommodityService();
        if (2 == commodityType) return new GoodsCommodityService();
        if (3 == commodityType) return new CardCommodityService();
		throw new RuntimeException("Product or service type not found."); 
    }
}
```

- Ở đây, chúng ta đã định nghĩa một lớp Factory cho cửa hàng, trong đó thực hiện các dịch vụ phát thưởng theo loại. Điều này giúp code của bạn trở nên sạch và dễ hiểu, và các mặt hàng mới sẽ được mở rộng ở đây. Nếu bạn không thích câu lệnh `if`, bạn cũng có thể sử dụng `switch` hoặc cấu trúc cấu hình `map` để làm cho mã nguồn sạch sẽ hơn.
- Ngoài ra, nhiều phần mềm kiểm tra mã nguồn và yêu cầu viết mở rộng sau câu lệnh `if`, tuy nhiên ở đây chúng tôi không làm như vậy để làm cho logic trở nên sạch sẽ hơn. Trong thực tế, bạn có thể thêm dấu ngoặc vào sau câu lệnh `if` trong code thực tế.

### Kiểm thử

**Viết unit test:**

```java
@Test
public void test_commodity() throws Exception {
    StoreFactory storeFactory = new StoreFactory();
    // 1. Phiếu giảm giá
    ICommodity commodityService_1 = storeFactory.getCommodityService(1);
    commodityService_1.sendCommodity("10001", "EGM1023938910232121323432", "791098764902132", null);
    // 2. Hàng hóa thực
    ICommodity commodityService_2 = storeFactory.getCommodityService(2);
    
    Map<String,String> extMap = new HashMap<String,String>();
    extMap.put("consigneeUserName", "Hung Nguyen");
    extMap.put("consigneeUserPhone", "15200292123");
    extMap.put("consigneeUserAddress", "Thu Duc, HCM");

    commodityService_2.sendCommodity("10001","9820198721311","1023000020112221113", extMap);
    // 3. Thẻ đổi thưởng của bên thứ ba (Garena)
    ICommodity commodityService_3 = storeFactory.getCommodityService(3);
    commodityService_3.sendCommodity("10001","AQY1xjkUodl8LO975GdfrYUio",null,null);
}

```

**Kết quả:**

```shell
Mô phỏng việc phát phiếu giảm giá: 10001, EGM1023938910232121323432, 791098764902132
2024-03-25 23:35:26.176	INFO	main		(CouponCommodityService.java:20)	|	Tham số yêu cầu[Phiếu giảm giá] => uId：10001 commodityId：EGM1023938910232121323432 bizId：791098764902132 extMap：null
2024-03-25 23:35:26.205	INFO	main		(CouponCommodityService.java:21)	|	Kết quả kiểm thử[Phiếu giảm giá]：{"code":"0000","info":"Phát thành công"}
Mô phỏng việc giao hàng hàng hoá thực: {"consigneeUserAddress":"Thu Duc, HCM","consigneeUserName":"Hung Nguyen","consigneeUserPhone":"012345678","orderId":"1023000020112221113","sku":"9820198721311","userName":"Hung Nguyen","userPhone":"012345678"}
2024-03-25 23:35:26.209	INFO	main		(GoodsCommodityService.java:30)	|	Tham số yêu cầu[Phiếu giảm giá] => uId：10001 commodityId：9820198721311 bizId：1023000020112221113 extMap：{"consigneeUserName":"Hung Nguyen","consigneeUserAddress":"Thu Duc, HCM","consigneeUserPhone":"012345678"}
2024-03-25 23:35:26.210	INFO	main		(GoodsCommodityService.java:31)	|	Kết quả kiểm thử[Phiếu giảm giá]：true
Mô phỏng việc phát thẻ game Garena: 012345678, null
2024-03-25 23:35:26.210	INFO	main		(CardCommodityService.java:21)	|	Tham số yêu cầu[Thẻ đổi thưởng Garena] => uId：10001 commodityId：AQY1xjkUodl8LO975GdfrYUio bizId：null extMap：null
2024-03-25 23:35:26.210	INFO	main		(CardCommodityService.java:22)	|	Kết quả kiểm thử[Thẻ đổi thưởng Garena]：Thành công

```

- Kết quả chạy bình thường, đáp ứng yêu cầu business requirement và đáp ứng tiêu chí của riêng tôi. Mã nguồn như vậy khi triển khai và chạy trực tuyến sẽ không khiến bạn lo lắng, không cảm thấy lo sợ có thể nhận cuộc gọi vào nửa đêm.
- Ngoài ra, từ kết quả chạy thử nghiệm cũng có thể thấy rằng sau khi đóng gói, có thể thấy rõ sự hoàn thiện của toàn bộ bộ dịch vụ phân phối giải thưởng, đầu vào và kết quả là thống nhất.

## Tổng kết

- Từ việc tối ưu từ trên xuống dưới, có thể thấy rằng Factory Method Pattern không phức tạp, thậm chí sau khi bạn hiểu rõ, bạn sẽ thấy nó càng đơn giản hơn.  
- Về lợi ích của việc phát triển như vậy, bạn cũng có thể tổng kết ra các ưu điểm; `Tránh sự ràng buộc giữa người tạo và logic cụ thể của sản phẩm`, `Đáp ứng nguyên tắc trách nhiệm đơn lẻ, business logic được thực hiện trong lớp tương ứng của nó`, `Đáp ứng nguyên tắc mở và đóng, không cần thay đổi, người gọi có thể thêm các loại sản phẩm mới vào chương trình mà không cần sửa đổi`.
- Tuy nhiên, điều này cũng có thể mang lại một số vấn đề, ví dụ: Nếu có rất nhiều loại sản phẩm, số lượng lớp con sẽ mở rộng rất nhanh. Do đó, cũng cần sử dụng các mẫu khác để tối ưu hóa, những điều này sẽ được đề cập dần dần trong các mẫu thiết kế sau này.
- Bằng cách bắt đầu từ các ví dụ, việc hiểu về mẫu thiết kế thường dễ dàng hơn so với việc học lý thuyết, vì ví dụ là cách tốt nhất để rút ngắn khoảng cách từ lý thuyết đến thực hành. Nếu bạn đã có một số kiến thức, hãy thử áp dụng vào thực tế.
