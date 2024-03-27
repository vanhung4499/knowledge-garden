---
title: Adapter Pattern Practice
tags:
  - design-pattern
categories: 
date created: 2024-03-27
date modified: 2024-03-27
---

# Adapter Pattern Practice:

## Giới thiệu

**80% diện tích của giấy vệ sinh đều được dùng để bảo vệ tay!**

Sau khi làm việc được khoảng vài năm, phần lớn lập trình viên đều muốn nâng cao năng lực kỹ thuật của mình, bắt đầu thử đọc mã nguồn một số thư viện, ví dụ như `Spring`, `Mybatis`, `Dubbo`, vv. Nhưng khi đọc, họ càng thấy khó hiểu hơn, đôi khi từ một nơi này sang một nơi khác. Thậm chí cảm thấy nghi ngờ về kỹ thuật của mình, dần dần không muốn tiếp cận vào kiến thức này nữa.

Nguyên nhân chính là một framework, theo thời gian phát triển, độ phức tạp của nó càng cao, từ một điểm cốt lõi rất nhỏ cho đến cuối cùng là rất nhiều nhánh lá. Điều này giống như một phần của code doanh nghiệp bạn phát triển hoặc một số thành phần khác, phần lớn đầu tiên của code lõi có thể chỉ chiếm 20%, trong khi các phần khác đều phải đảm bảo rằng luồng lõi hoạt động bình thường. Vì vậy, đây cũng là một phần lý do khiến việc đọc mã nguồn trở nên khó khăn.

**Design Pattern được sử dụng trong framework không?**

Không chỉ có một mà còn nhiều loại design pattern được sử dụng trong framework, đôi khi không phải là việc sử dụng một mẫu duy nhất mà là sự kết hợp của nhiều loại design pattern. Khác biệt hoàn toàn so với việc bạn phát triển CRUD hàng ngày, nếu tất cả chỉ là các câu lệnh if từ trên xuống dưới, đó cũng không thể gọi là một framework. Ví dụ, nếu bạn tìm từ khóa "Adapter" trong mã nguồn của Spring, bạn sẽ thấy nhiều lớp thực hiện, chẳng hạn như `UserCredentialsDataSourceAdapter`. Và mẫu thiết kế này chính là Adapter Pattern mà chúng ta sẽ giới thiệu trong bài viết này.

**Adapter có mặt ở khắp mọi nơi trong cuộc sống hàng ngày**

Nếu nhắc đến sự tồn tại của nhiều adapter trong cuộc sống hàng ngày, bạn sẽ nghĩ đến điều gì? Trước khi đọc tiếp, hãy suy nghĩ.

## Môi trường phát triển

1. JDK 1.8
2. Idea + Maven
3. Code: [vanhung4499/practical-java-design](https://github.com/vanhung4499/practical-java-design)  

| Dự án            | Mô tả                                                                      |
| ---------------- | -------------------------------------------------------------------------- |
| demo-design-6-00 | Dự án mô phỏng kịch bản, Mô phỏng nhiều cấu trúc thông điệp MQ             |
| demo-design-6-01 | Triển khai yêu cầu kinh doanh bằng một đống mã                             |
| demo-design-6-02 | Tối ưu và cải thiện mã thông qua mẫu thiết kế để tạo ra so sánh và học hỏi |

## Giới thiệu về Adapter Pattern

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240327200238.png)  

Chức năng chính của mẫu Adapter là chuyển đổi giao diện ban đầu không tương thích thành một giao diện đồng nhất thông qua việc điều chỉnh. Điều này giúp người dùng sử dụng một cách thuận tiện, giống như các cục sạc đa năng, dây cáp, đầu chuyển của máy tính MAC, cục sạc chuẩn quốc tế khi đi du lịch nước ngoài, v.v. Tất cả đều là để điều chỉnh các `Adapter` khác nhau để làm cho chúng tương thích.

**Ngoài các tình huống phổ biến về việc điều chỉnh xuất hiện trong cuộc sống hàng ngày, thì trong phát triển doanh nghiệp thì sao?**  

Trong phát triển doanh nghiệp, chúng ta thường cần thích nghi với các giao diện khác nhau, đặc biệt là trong dịch vụ trung tâm, nơi mà trung tâm cần gói các dịch vụ từ nhiều dòng kinh doanh khác nhau và sau đó cung cấp giao diện đồng nhất để sử dụng bên ngoài. Điều này cũng là rất phổ biến trong quá trình phát triển hàng ngày của chúng ta.

## Mô phỏng kịch bản

Khi doanh nghiệp phát triển và các hệ thống cơ bản dần hình thành, hoạt động kinh doanh sẽ bắt đầu thực hiện các hoạt động để thu hút người dùng mới và kích thích họ sử dụng, nhằm đảm bảo tăng trưởng `DAU` và cuối cùng là chuyển đổi `ROI`.

Vào thời điểm này, một hệ thống tiếp thị sẽ cần được tạo ra, phần lớn các hoạt động tiếp thị thông thường là phân nhánh, thu hút khách hàng, ví dụ: nếu bạn mời một người dùng mở tài khoản hoặc mời một người dùng đặt hàng, nền tảng sẽ hoàn tiền cho bạn, mời càng nhiều, nhận càng nhiều. Đồng thời, khi lượng người mời ngày càng nhiều, họ bắt đầu thiết lập một số tiêu chuẩn hàng tháng cho việc đặt hàng đầu tiên để nhận phần thưởng đầu tiên, v.v. Các tình huống tiếp thị khác nhau.

Lúc này, một hệ thống như vậy sẽ nhận các loại tin nhắn MQ khác nhau hoặc giao diện khác nhau. Nếu phải phát triển từng cái một, sẽ tốn nhiều chi phí, đồng thời cũng có một số khó khăn trong việc mở rộng sau này. Trong trường hợp này, một hệ thống có thể được cấu hình để kết nối với các MQ bên ngoài một cách linh hoạt, và các MQ này giống như đã đề cập ở trên có thể là các tin nhắn đăng ký tài khoản, tin nhắn đặt hàng sản phẩm, v.v.

Và cách tiếp cận của bản mô phỏng này cũng có thể được áp dụng vào việc điều chỉnh các thuộc tính thông tin.

### Dự án mô phỏng kịch bản

```shell
design-demo-6-00/
├── pom.xml
└── src
    └── main
        └── java
            └── com
                └── hnv99
                    └── design
                        ├── mq
                        │   ├── CreateAccount.java
                        │   ├── OrderMq.java
                        │   └── POPOrderDelivered.java
                        └── service
                            ├── OrderService.java
                            └── POPOrderService.java

```

- Trong dự án này, mô phỏng ba loại tin nhắn MQ khác nhau, trong đó mỗi tin nhắn đều có một số trường bắt buộc như: ID người dùng, thời gian, ID dịch vụ, nhưng mỗi loại MQ lại có các thuộc tính khác nhau. Ví dụ, trường ID người dùng trong các MQ khác nhau có thể là: uId, userId, v.v.
- Đồng thời, cung cấp hai loại interface khác nhau, một dùng để truy vấn số lượng đơn hàng trong hệ thống nội bộ, một dùng để truy vấn xem liệu một đơn hàng từ bên thứ ba có phải là đơn hàng đầu tiên hay không.
- Tiếp theo, sẽ thực hiện việc tạo ra các adapter để làm cho các loại tin nhắn MQ và interface tương thích với nhau.

### Mô tả ngắn gọn

#### MQ đăng ký mở tài khoản

```java
@Data  
public class CreateAccount {  
    private String number;      // Số tài khoản  
    private String address;     // Địa chỉ mở tài khoản  
    private Date accountDate;   // Ngày mở tài khoản  
    private String desc;        // Mô tả về tài khoản  
  
    @Override  
    public String toString() {  
        return JSON.toJSONString(this);  
    }  
}
```

#### MQ đơn hàng nội bộ

```java
@Data  
public class OrderMq {  
  
    private String uid;           // ID Người dùng  
    private String sku;           // Mặt hàng  
    private String orderId;       // ID Đơn hàng  
    private Date createOrderTime; // Thời gian đặt hàng  
  
    @Override  
    public String toString() {  
        return JSON.toJSONString(this);  
    }
}
```

#### MQ đơn hàng từ bên thứ ba

```java
@Data  
public class POPOrderDelivered {

    private String uId;     // ID Người dùng  
    private String orderId; // ID Đơn hàng  
    private Date orderTime; // Thời gian đặt hàng  
    private Date sku;       // Mặt hàng  
    private Date skuName;   // Tên mặt hàng  
    private BigDecimal decimal; // Số tiền  
  
    @Override  
    public String toString() {  
        return JSON.toJSONString(this);  
    }
}
```

#### Interface truy vấn số lượng đơn hàng nội bộ của người dùng

```java
public class OrderService {

    private Logger logger = LoggerFactory.getLogger(POPOrderService.class);

    public long queryUserOrderCount(String userId){
        logger.info("Cửa hàng tự doanh, truy vấn xem số đơn hàng của người dùng có phải là đơn hàng đầu tiên không: {}", userId);
        return 10L;
    }

}
```

#### Interface truy vấn xem người dùng từ bên thứ ba có đơn hàng đầu tiên không

```java
public class POPOrderService {

    private Logger logger = LoggerFactory.getLogger(POPOrderService.class);

    public boolean isFirstOrder(String uId) {
        logger.info("Cửa hàng POP, truy vấn xem đơn hàng của người dùng có phải là đơn hàng đầu tiên không: {}", uId);
        return true;
    }

}
```

- Các mục trên đại diện cho các MQ và interface khác nhau. Sau này, chúng ta sẽ sử dụng các MQ và interface này và triển khai các adapter tương ứng.

> [!info] lombok  
> Để làm cho code ngắn gọn hơn, tôi dùng lombok annotation để rút gọn code, các phần như setter, getter, constructor sẽ được lombok xử lý!

## Triển khai code

**Thực tế, hầu hết thời gian việc nhận tin nhắn MQ là tạo một lớp để tiêu thụ, thông qua việc chuyển đổi thuộc tính tin nhắn MQ của nó cho các phương thức của mình.**

Tiếp theo, chúng ta cũng sẽ trình bày một cách thực hiện mô phỏng cách thức này, nhưng cách thực hiện này có một vấn đề lớn là, khi lượng tin nhắn MQ càng ngày càng nhiều, thậm chí sau vài chục hoặc vài trăm nghìn tin nhắn, bạn làm thế nào để tối ưu cho trung gian?

### Cấu trúc dự án

```java
design-demo-6-00/
├── pom.xml
└── src
    └── main
        └── java
            └── com
                └── hnv99
                    └── design
                        ├── mq
                        │   ├── CreateAccount.java
                        │   ├── OrderMq.java
                        │   └── POPOrderDelivered.java
                        └── service
                            ├── OrderService.java
                            └── POPOrderService.java

```

- Hiện tại cần nhận ba tin nhắn MQ khác nhau, do đó có ba lớp tương ứng, và cách triển khai giống như các đoạn mã thông thường. Nếu số lượng MQ của bạn không nhiều, phương pháp này cũng không có vấn đề gì. Tuy nhiên, khi số lượng tăng lên, bạn sẽ cần xem xét sử dụng một số mẫu thiết kế để giải quyết vấn đề.

### Triển khai nhận tin nhắn MQ

```java
public class CreateAccountMqService {

    public void onMessage(String message) {  
  
        CreateAccount mq = JSON.parseObject(message, CreateAccount.class);  
  
        mq.getNumber();  
        mq.getAccountDate();  
  
        // ... Xử lý nghiệp vụ của riêng bạn  
    }  
}
```

- Xử lý tin nhắn MQ cho ba nhóm MQ đều tương tự như trên. Tôi không mô tả từng bước một, bạn có thể xem thêm trong mã nguồn.

## Tái cấu trúc theo Adapter Pattern

**Tiếp theo, chúng ta sẽ sử dụng mẫu Adapter để tối ưu mã, đồng thời cũng là một lần tái cấu trúc nhỏ.**

Vấn đề chính mà mẫu Adapter giải quyết là thống nhất đầu ra từ nhiều loại interface khác biệt, điều này cũng đã được đề cập trong việc học mẫu Factory Method, khi xử lý các loại phần thưởng khác nhau, thực ra cũng là ứng dụng của Adapter.

Trong bài viết này, chúng ta cũng sẽ thấy một tình huống sử dụng MQ với nhiều loại tin nhắn khác nhau. Để xử lý chúng một cách thống nhất, giúp giảm thiểu công việc sau này với việc nhận tin nhắn từ MQ.

Nếu bạn trước đây chưa phát triển chức năng nhận tin nhắn từ MQ, có thể sẽ không hiểu rõ tình huống này. Đối với điều này, tôi cá nhân khuyên bạn nên tìm hiểu về MQ trước. Hơn nữa, thậm chí nếu không hiểu, cũng không vấn đề gì, điều này không ảnh hưởng đến việc hiểu cách tư duy.

Hơn nữa, phần lõi của việc tương thích với MQ mà bài viết này trình bày, chính là việc xử lý việc điều chỉnh các trường dữ liệu khác nhau. Và nếu chúng ta nhận tin nhắn từ MQ, khi cấu hình các lớp tiêu thụ khác nhau, nếu không muốn phát triển từng lớp một, bạn có thể sử dụng cách tiếp cận của lớp proxy để xử lý.

### Cấu trúc dự án

```shell
design-demo-6-02/
├── pom.xml
└── src
    └── main
        └── java
            └── com
                └── hnv99
                    └── design
                        ├── MQAdapter.java
                        ├── OrderAdapterService.java
                        ├── RebateInfo.java
                        └── cuisine
                            └── impl
                                ├── InsideOrderService.java
                                └── POPOrderAdapterServiceImpl.java

```

**Cấu trúc mô hình Adapter**

- Đây bao gồm hai loại Adapter: Adapter Interface và Adapter MQ. Lý do không chỉ giả lập việc điều chỉnh Interface là vì nhiều khi mọi người đã quen thuộc, vì vậy, chúng tôi thay đổi cách suy nghĩ về việc áp dụng mô hình Adapter vào thân tin nhắn MQ, để tăng cường hiểu biết về nhiều mẫu thiết kế.
- **Đầu tiên là việc thực hiện điều chỉnh MQ**, nhận các loại tin nhắn MQ khác nhau. Khi doanh nghiệp phát triển nhanh chóng và cần phải thưởng cho người dùng đặt hàng đầu tiên, trong tình huống như vậy, chúng ta thêm hoạt động **điều chỉnh interface**.

### Triển khai code (điều chỉnh thông báo MQ)

#### Nội dung tin nhắn MQ thống nhất

```java
public class RebateInfo {

    private String userId;  // ID người dùng
    private String bizId;   // ID nghiệp vụ
    private Date bizTime;   // Thời gian nghiệp vụ
    private String desc;    // Mô tả
    
    // ... getter/setter
}

```

- Trong tin nhắn MQ có thể có nhiều loại thuộc tính khác nhau, mặc dù tất cả chúng đều cung cấp cùng một giá trị cho bên sử dụng, nhưng nếu chúng ta tiếp tục kết nối theo cách này, khi có nhiều tin nhắn MQ thì sẽ rất rắc rối.
- Vì vậy, trong ví dụ này, chúng ta đã định nghĩa một thân tin nhắn MQ thông thường, sau đó tiến hành xử lý tất cả các tin nhắn đến một cách thống nhất.

#### Lớp chuyển đổi nội dung tin nhắn MQ

```java
public class MQAdapter {

    public static RebateInfo filter(String strJson, Map<String, String> link) throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
        return filter(JSON.parseObject(strJson, Map.class), link);
    }

    public static RebateInfo filter(Map obj, Map<String, String> link) throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
        RebateInfo rebateInfo = new RebateInfo();
        for (String key : link.keySet()) {
            Object val = obj.get(link.get(key));
            RebateInfo.class.getMethod("set" + key.substring(0, 1).toUpperCase() + key.substring(1), String.class).invoke(rebateInfo, val.toString());
        }
        return rebateInfo;
    }

}

```

- Phương thức trong lớp này rất quan trọng, chủ yếu được sử dụng để ánh xạ các thuộc tính từ các loại MQ khác nhau thành các thuộc tính chúng ta cần và trả về. Giống như một thuộc tính có `ID người dùng: uId`, ánh xạ thành điều chúng ta cần; `userId`, để xử lý một cách thống nhất.
- Trong quá trình xử lý này, cần chuyển quản lý ánh xạ cho `Map<String, String> link`, nó chính xác mô tả tên thuộc tính hiện tại của MQ, ánh xạ thành tên thuộc tính của chúng tôi.
- Cuối cùng, vì chúng ta nhận được các tin nhắn `mq` cơ bản đều có định dạng `json`, có thể chuyển đổi thành cấu trúc MAP. Sau đó sử dụng phương thức gọi ngược để gán giá trị cho kiểu của chúng ta.

#### Kiểm thử

**Unit test**

```java
public class ApiTest {  
  
    @Test  
    public void testMQAdapter() throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, ParseException {  
  
        SimpleDateFormat s = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
        Date parse = s.parse("2020-06-01 23:20:16");  
  
        CreateAccount createAccount = new CreateAccount();  
        createAccount.setNumber("100001");  
        createAccount.setAddress("Thu Duc, HCMC, Vietnam");  
        createAccount.setAccountDate(parse);  
        createAccount.setDesc("Mo tai khoan phong gym");  
  
        HashMap<String, String> link01 = new HashMap<>();  
        link01.put("userId", "number");  
        link01.put("bizId", "number");  
        link01.put("bizTime", "accountDate");  
        link01.put("desc", "desc");  
        RebateInfo rebateInfo01 = MQAdapter.filter(createAccount.toString(), link01);  
        System.out.println("mq.CreateAccount(Trước khi điều chỉnh): " + createAccount.toString());  
        System.out.println("mq.CreateAccount(Sau khi điều chỉnh): " + JSON.toJSONString(rebateInfo01));  
  
        System.out.println("");  
  
        OrderMq orderMq = new OrderMq();  
        orderMq.setUid("100001");  
        orderMq.setSku("10928092093111123");  
        orderMq.setOrderId("100000890193847111");  
        orderMq.setCreateOrderTime(parse);  
  
        HashMap<String, String> link02 = new HashMap<String, String>();  
        link02.put("userId", "uid");  
        link02.put("bizId", "orderId");  
        link02.put("bizTime", "createOrderTime");  
        RebateInfo rebateInfo02 = MQAdapter.filter(orderMq.toString(), link02);  
        System.out.println("mq.orderMq(Trước khi điều chỉnh): " + orderMq.toString());  
        System.out.println("mq.orderMq(Sau khi điều chỉnh): " + JSON.toJSONString(rebateInfo02));  
    }
```

- Ở đây, chúng ta mô phỏng việc truyền vào hai loại tin nhắn MQ khác nhau và thiết lập quan hệ ánh xạ giữa các trường.
- Trong thực tế, khi phát triển các tình huống kinh doanh thực sự, chúng ta có thể cấu hình quan hệ ánh xạ như vậy vào tệp cấu hình hoặc cơ sở dữ liệu, giảm thiểu mã hóa.

**Kết quả**

```shell
mq.CreateAccount(Trước khi điều chỉnh): {"accountDate":1591028416000,"address":"Thu Duc, HCMC, Vietnam","desc":"Mo tai khoan phong gym","number":"100001"}
mq.CreateAccount(Sau khi điều chỉnh): {"bizId":"100001","bizTime":1591028416000,"desc":"Mo tai khoan phong gym","userId":"100001"}

mq.orderMq(Trước khi điều chỉnh): {"createOrderTime":1591028416000,"orderId":"100000890193847111","sku":"10928092093111123","uid":"100001"}
mq.orderMq(Sau khi điều chỉnh): {"bizId":"100000890193847111","bizTime":1591028416000,"userId":"100001"}
```

- Từ kết quả trên, bạn có thể thấy rằng cùng một trường giá trị trong tin nhắn đã được thống nhất sau khi điều chỉnh, giúp quá trình xử lý trong kinh doanh trở nên đơn giản hơn.
- Ngoài ra, một điều rất quan trọng trong phát triển thực tế là, ngoài việc sử dụng reflect, chúng ta cũng có thể thêm một **lớp proxy** để chuyển quản lý cấu hình ánh xạ cho nó. Điều này giúp chúng ta không cần phải tạo từng lớp mq một cách thủ công.

### Triển khai code (Sử dụng Adapter Interface)

Như chúng ta đã đề cập trước đó, với sự phát triển của doanh nghiệp, chính chương trình khuyến mãi cũng cần được điều chỉnh. Không thể chỉ nhận tin nhắn từ MQ mà không phát phần thưởng. Vì lúc này, số lượng người mới tham gia đã tăng lên, và cần phải thực hiện một số hạn chế.

Vì đã thêm điều kiện chỉ có người đặt hàng đầu tiên mới được thưởng, nghĩa là chỉ có đơn hàng đầu tiên của bạn trong năm hoặc chỉ trong một tháng mới được thưởng, không phải mỗi lần đặt hàng trước đó đều được thưởng.

Vậy nên, cần hạn chế theo cách này và trong tin nhắn MQ không có thuộc tính để kiểm tra đơn đầu tiên. Chỉ có thể thực hiện truy vấn thông qua giao diện và nhận được giao diện như sau;

| Interface                                                                      | Mô tả                                                            |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| com.hnv99.design.service.OrderService.queryUserOrderCount(String userId)       | Đầu ra là long, truy vấn số lượng đơn hàng                       |
| com.hnv99.design.service.OrderService.POPOrderService.isFirstOrder(String uId) | Đầu ra là boolean, kiểm tra xem đó có phải là đơn đầu tiên không |

- Logic kiểm tra và cách sử dụng của hai interface này đều khác nhau, trả về kiểu khác nhau. Một cái là kiểm tra xem đó có phải là đơn hàng đầu tiên không, cái kia cần phải kiểm tra dựa trên số lượng đơn hàng.
- Vì vậy, ở đây cần sử dụng mẫu Adapter để triển khai. Tất nhiên, bạn cũng có thể triển khai bằng câu lệnh if, nhưng chúng ta thường nói rằng mã như vậy khó bảo trì.

#### Định nghĩa adapter interface thống nhất

```java
public interface OrderAdapterService {

    boolean isFirst(String uId);

}

```

Các lớp triển khai sau cần triển khai interface này và đóng gói logic cụ thể vào lớp được chỉ định, đáp ứng nguyên tắc trách nhiệm duy nhất.

#### Triển khai hai lớp khác nhau

**Lớp Sản phẩm Nội bộ**

```java
public class InsideOrderService implements OrderAdapterService {

    private OrderService orderService = new OrderService();

    public boolean isFirst(String uId) {
        return orderService.queryUserOrderCount(uId) <= 1;
    }

}

```

**Lớp Sản phẩm của Bên thứ ba**

```java
public class POPOrderAdapterServiceImpl implements OrderAdapterService {

    private POPOrderService popOrderService = new POPOrderService();

    public boolean isFirst(String uId) {
        return popOrderService.isFirstOrder(uId);
    }

}

```

- Trong hai lớp này, đều triển khai cách kiểm tra riêng của chúng, đặc biệt là lớp cung cấp số lượng đơn hàng, cần phải tự kiểm tra xem số lượng đơn hàng nhận được khi nhận mq có `<= 1`, từ đó xác định xem đó có phải là đơn hàng đầu tiên không.

#### Kiểm thử

**Unit test**

```java
@Test  
public void testItfAdapter() {  
    OrderAdapterService popOrderAdapterService = new POPOrderAdapterServiceImpl();  
    System.out.println("Kiểm tra đơn hàng đầu tiên, giao diện điều chỉnh(POP): " + popOrderAdapterService.isFirst("100001"));  
  
    OrderAdapterService insideOrderService = new InsideOrderService();  
    System.out.println("Kiểm tra đơn hàng đầu tiên, giao diện điều chỉnh(Doanh nghiệp tự vận hành): " + insideOrderService.isFirst("100001"));  
}
```

**Kết quả**

```shell
2024-03-27 22:44:07.909	INFO	main		(POPOrderService.java:11)	|	Cửa hàng POP, truy vấn xem đơn hàng của người dùng có phải là đơn hàng đầu tiên không: 100001
Kiểm tra đơn hàng đầu tiên, giao diện điều chỉnh(POP): true
2024-03-27 22:44:07.915	INFO	main		(OrderService.java:10)	|	Cửa hàng tự kinh doanh, truy vấn xem số đơn hàng của người dùng có phải là đơn hàng đầu tiên không: 100001
Kiểm tra đơn hàng đầu tiên, giao diện điều chỉnh(Doanh nghiệp tự vận hành): false
```

- Từ kết quả kiểm thử trên, có thể thấy rằng các lớp đã được đóng gói một cách thống nhất, khi sử dụng bên ngoài không cần quan tâm đến logic cụ thể bên trong. Và khi gọi, chỉ cần truyền tham số thống nhất là được, điều này đáp ứng mục đích của việc sử dụng Adapter.

## Tổng kết

- Từ các phần trước, có thể thấy rằng, các chức năng có thể được triển khai mà không sử dụng mẫu Adapter, nhưng việc sử dụng mẫu Adapter có thể làm cho mã nguồn: sạch sẽ, dễ bảo trì, giảm thiểu số lượng lớn các câu lệnh điều kiện lặp lại và làm cho mã nguồn dễ bảo trì và mở rộng hơn.
- Đặc biệt, khi chúng ta phải điều chỉnh các giá trị thuộc tính khác nhau của các loại thông điệp trong MQ như nhau, sau đó sử dụng lớp proxy, chúng ta có thể dễ dàng kết nối các thông điệp MQ được cung cấp bởi bên thứ ba bằng cách sử dụng cách cấu hình đơn giản mà không cần phải phát triển lại nhiều. Điều này rất thuận lợi cho việc mở rộng.
- Quá trình học mẫu thiết kế có thể sẽ đề cập đến các mẫu thiết kế khác trong một số chương, nhưng không chú trọng vào việc giảng dạy, để tránh làm xáo trộn cảm xúc. Tuy nhiên, trong việc sử dụng thực tế, thường các mẫu thiết kế được sử dụng kết hợp, không phải lúc nào cũng xuất hiện độc lập.
