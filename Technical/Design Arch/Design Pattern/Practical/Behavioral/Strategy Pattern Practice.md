---
title: Strategy Pattern Practice
tags:
  - design-pattern
categories: 
date created: 2024-04-01
date modified: 2024-04-01
---

# Strategy Pattern Practice: Mô phỏng nhiều loại tiếp thị phiếu giảm giá và kịch bản chiến lược tính toán số tiền chiết khấu

## Giới thiệu

"Không có người đứng đầu, không có vũ khí số hai."

Mỗi người, dù họ hướng tới các mục tiêu khác nhau nhưng đều có giá trị và điểm sáng riêng, và đều có thể học hỏi lẫn nhau. Đừng quá dùng cây giáo trong tay mình để tấn công mũi giáo của người khác, thậm chí nếu bạn đã tranh luận thành công, đó có thể chỉ là vì vai trò bạn được đặt ở vị trí khác. Lấy sức mạnh của người khác để bù đắp điểm yếu của bản thân, sự kết hợp giữa cây giáo và mũi giáo có thể là một chiếc xe tăng.

"Việc giải thích kiến thức phức tạp một cách đơn giản là rất quan trọng."

Trong quá trình học tập, chúng ta đã xem qua nhiều tài liệu, video, tài liệu v.v. Vì có quá nhiều tài liệu và video hiện nay, nên một khái niệm có thể được giải thích dưới nhiều hình thức video khác nhau. Ngoài việc quảng cáo và tiếp thị, thực sự có nhiều video giải thích rất xuất sắc, ví dụ như các video ngắn của giáo sư Lý Vĩnh Lợi, có thể giải thích một khái niệm phức tạp như vậy trên một bảng đen, giải thích một cách dễ hiểu và sâu sắc. Cũng giống như chúng ta, những người học lập trình cũng cần học cách giải thích một cách rõ ràng và viết rõ ràng.

"Nâng cao tầm nhìn và giao lưu với nhiều bạn cùng sở thích."

Đôi khi, môi trường là rất quan trọng, giống như khi bạn còn học, bạn sẽ phát hiện ra rằng có một loại học sinh trong lớp học không nghe giảng, nhưng học rất giỏi. Vậy nếu họ phải ở nhà không thể ở trong lớp học? Có các môi trường tương tự khác; thư viện, quán internet, nhóm bạn đồng hành, nhóm kỹ thuật v.v., tất cả đều có thể giúp bạn phát triển thông qua kỹ năng được chia sẻ bởi những người có cùng sở thích hoặc qua bầu không khí được tạo ra bởi mọi người cùng nhau.

## Môi trường phát triển

1. JDK 1.8
2. Idea + Maven
3. Code: [vanhung4499/practical-java-design](https://github.com/vanhung4499/practical-java-design)  

| Dự án             | Mô tả                                                                    |
| ----------------- | ------------------------------------------------------------------------ |
| design-demo-20-01 | Thực hiện nhu cầu kinh doanh bằng code thô sơ                            |
| design-demo-20-02 | Tối ưu và cải thiện thông qua thiết kế mẫu, tạo ra sự so sánh để học hỏi |

## Giới thiệu về Strategy Pattern

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240401213859.png)

Strategy Pattern là một mẫu hành vi, cũng là một công cụ thay thế lượng lớn câu lệnh `if else`. Nó giúp giải quyết các tình huống có logic thuộc cùng một loại có thể thay thế được. Ví dụ: các loại giao dịch khác nhau (thẻ tín dụng, Alipay, WeChat), chiến lược tạo ID duy nhất (UUID, auto increasement, DB + Redis, thuật toán snowflake, thuật toán Leaf), có thể sử dụng Strategy Pattern để đóng gói hành vi và cung cấp cho bên ngoài sử dụng.

## Mô phỏng tình huống thực tế

**Trong trường hợp này, chúng tôi mô phỏng các loại phiếu giảm giá khác nhau được sử dụng khi mua hàng (giảm giá toàn bộ, chiết khấu trực tiếp, chiết khấu, mua sỉ, …)**

Tình huống này gần như là một kênh tiết kiệm hàng ngày của mọi người, khi mua hàng thường muốn tìm kiếm các phiếu giảm giá để làm cho việc mua hàng trở nên tiết kiệm hơn. Đặc biệt vào thời gian khuyến codei lớn, sẽ có nhiều phiếu giảm giá hơn cần tính toán để mua các sản phẩm cùng nhau với giá ưu đãi!!!

Đôi khi người dùng sẽ thấy thú vị khi sử dụng chức năng này, nhưng từ đầu việc thiết lập tính năng này và sự phát triển liên tục của sản phẩm đối với các nhà phát triển phần mềm👨‍💻‍ không phải lúc nào cũng dễ dàng. Bởi vì điều này bao gồm nhiều quy tắc và logic ưu đãi, vì vậy chúng tôi mô phỏng một cách tính ưu đãi, sử dụng Strategy Pattern để thực hiện.

## Triển khai bằng code thô sơ

`Ở đây, chúng ta sẽ sử dụng cách triển khai thô sơ nhất để thực hiện tính năng.`

Ban đầu, thiết kế các phiếu giảm giá có thể rất đơn giản, chỉ là một số tiền được giảm trừ, cũng không có nhiều loại như hiện nay. Vì vậy, nếu không có kinh nghiệm về tình huống này, thiết kế ban đầu thường rất đơn giản. Tuy nhiên, với việc phát triển liên tục của các tính năng sản phẩm, nếu thiết kế ban đầu không có tính mở rộng tốt, thì trong tương lai nó sẽ trở nên lộn xộn hơn.

### Cấu trúc dự án

```java
design-demo-20-01
├── pom.xml
└── src
    └── main
        └── java
            └── com
                └── hnv99
                    └── design
                        └── CouponDiscountService.java
```

- Cấu trúc dự án `thô sơ` rất đơn giản, cũng là cách phát triển trực tiếp nhất hướng tới quá trình.

### Triển khai code

```java
/**
 * Blog: https://bugstack.cn - Lắng đọng, Chia sẻ, Phát triển, cho cả bản thân và người khác có thể có được điều gì đó!
 * Official Account: bugstack虫洞栈
 * Tạo bởi 小傅哥(fustack) @2020
 * Giao diện tính giảm giá phiếu giảm giá
 * <p>
 * Loại phiếu giảm giá;
 * 1. Giảm trực tiếp
 * 2. Giảm khi đạt
 * 3. Phiếu giảm giá
 * 4. Mua n đồng
 */
public class CouponDiscountService {

    public double discountAmount(int type, double typeContent, double skuPrice, double typeExt) {
        // 1. Giảm trực tiếp
        if (1 == type) {
            return skuPrice - typeContent;
        }
        // 2. Giảm khi đạt
        if (2 == type) {
            if (skuPrice < typeExt) return skuPrice;
            return skuPrice - typeContent;
        }
        // 3. Phiếu giảm giá
        if (3 == type) {
            return skuPrice * typeContent;
        }
        // 4. Mua n đồng
        if (4 == type) {
            return typeContent;
        }
        return 0D;
    }

}
```

- Trên đây là số tiền giảm giá thực tế sau khi tính toán cho mỗi loại phiếu giảm giá.
- Các tham số đầu vào bao gồm; loại phiếu giảm giá, số tiền phiếu giảm giá, giá sản phẩm, vì một số phiếu giảm giá là giảm giá khi mua đủ số lượng nhất định, nên đã thêm `typeExt` loại. Điều này cũng là vấn đề về tính mở rộng của phương pháp.
- Cuối cùng là việc triển khai của phần thân phương thức tính số tiền giảm giá của phiếu giảm giá, ban đầu có thể là một loại phiếu giảm giá đơn giản nhất, sau đó với sự phát triển của tính năng sản phẩm, câu lệnh `if` được mở rộng không ngừng. Thực tế, code có thể lớn hơn nhiều so với ví dụ trên.

## Tái cấu trúc theo Strategy Pattern

`Tiếp theo, sử dụng Strategy Pattern để tối ưu hóa code, có thể coi đây là một lần tái cấu trúc nhỏ.`

So với sự phát triển theo định hướng quy trình ở trên, các mẫu thiết kế và cấu trúc code ưu tiên sẽ được sử dụng ở đây để nâng cao khả năng mở rộng tổng thể.

### Cấu trúc dự án

```java
design-demo-20-02
├── pom.xml
└── src
    ├── main
    │   └── java
    │       └── com
    │           └── hnv99
    │               └── design
    │                   ├── Context.java
    │                   ├── ICouponDiscount.java
    │                   └── impl
    │                       ├── MJCouponDiscount.java
    │                       ├── NYGCouponDiscount.java
    │                       ├── ZJCouponDiscount.java
    │                       └── ZKCouponDiscount.java
    └── test
        └── java
            └── com
                └── hnv99
                    └── design
                        └── ApiTest.java

```

**Cấu trúc mô hình chiến lược**  

![Cấu trúc mô hình chiến lược](https://raw.githubusercontent.com/vanhung4499/images/master/snap/itstack-demo-design-20-04.png)

- Cấu trúc tổng thể không phức tạp, chủ yếu là sự khác biệt giữa các loại phiếu giảm giá trong cách tính toán chiến lược giảm giá.
- Bao gồm một lớp giao diện (`ICouponDiscount`) và bốn cách thức cụ thể để thực hiện loại phiếu giảm giá.
- Cuối cùng, cung cấp một lớp điều khiển trên và dưới để xử lý dịch vụ chiến lược toàn bộ.

### Triển khai code

#### Giao diện phiếu giảm giá

```java
public interface ICouponDiscount<T> {

    /**
     * Tính toán số tiền giảm giá của phiếu
     * @param couponInfo Thông tin giảm giá; giảm trực tiếp, giảm khi đủ điều kiện, giảm giá, mua với giá N yuan
     * @param skuPrice   Giá trị của SKU
     * @return           Số tiền sau khi giảm giá
     */
    BigDecimal discountAmount(T couponInfo, BigDecimal skuPrice);

}

```

- Định nghĩa giao diện giảm giá phiếu, cũng đã thêm generic để các loại giao diện khác nhau có thể truyền tham số loại khác nhau.
- Giao diện bao gồm thông tin giảm giá sản phẩm và giá trị trả về cuối cùng sau khi giảm giá, trong thực tế, giao diện có thể có nhiều tham số hơn so với bây giờ, nhưng logic cốt lõi là như vậy.

#### Triển khai giao diện phiếu giảm giá

**Giảm giá đầy đủ**

```java
public class MJCouponDiscount implements ICouponDiscount<Map<String,String>>  {

    /**
     * Tính toán số tiền giảm giá khi đủ điều kiện
     * 1. Kiểm tra x đến n sau đó giảm
     * 2. Số tiền thanh toán tối thiểu là 1 đô la
     */
    public BigDecimal discountAmount(Map<String,String> couponInfo, BigDecimal skuPrice) {
        String x = couponInfo.get("x");
        String o = couponInfo.get("n");

        // Nếu giá sản phẩm nhỏ hơn điều kiện, trả về giá gốc của sản phẩm
        if (skuPrice.compareTo(new BigDecimal(x)) < 0) return skuPrice;
        // Kiểm tra số tiền giảm
        BigDecimal discountAmount = skuPrice.subtract(new BigDecimal(o));
        if (discountAmount.compareTo(BigDecimal.ZERO) < 1) return BigDecimal.ONE;

        return discountAmount;
    }
}
```

**Giảm giá trực tiếp**

```java
public class ZJCouponDiscount implements ICouponDiscount<Double>  {

    /**
     * Tính toán số tiền giảm giá trực tiếp
     * 1. Sử dụng giá sản phẩm trừ đi giá giảm giá
     * 2. Số tiền thanh toán tối thiểu là 1 đô la
     */
    public BigDecimal discountAmount(Double couponInfo, BigDecimal skuPrice) {
        BigDecimal discountAmount = skuPrice.subtract(new BigDecimal(couponInfo));
        if (discountAmount.compareTo(BigDecimal.ZERO) < 1) return BigDecimal.ONE;
        return discountAmount;
    }

}
```

**Giảm giá phần trăm**

```java
public class ZKCouponDiscount implements ICouponDiscount<Double> {


    /**
     * Tính toán số tiền giảm giá phần trăm
     * 1. Sử dụng giá sản phẩm nhân với tỷ lệ giảm giá, để được số tiền thanh toán cuối cùng
     * 2. Làm tròn 2 chữ số thập phân
     * 3. Số tiền thanh toán tối thiểu là 1 đô la
     */
    public BigDecimal discountAmount(Double couponInfo, BigDecimal skuPrice) {
        BigDecimal discountAmount = skuPrice.multiply(new BigDecimal(couponInfo)).setScale(2, BigDecimal.ROUND_HALF_UP);
        if (discountAmount.compareTo(BigDecimal.ZERO) < 1) return BigDecimal.ONE;
        return discountAmount;
    }

}
```

**Mua với giá N đô la**

```java
public class NYGCouponDiscount implements ICouponDiscount<Double> {

    /**
     * Mua với giá N đô la
     * 1. Mua với giá cố định, không quan tâm giá gốc là bao nhiêu
     */
    public BigDecimal discountAmount(Double couponInfo, BigDecimal skuPrice) {
        return new BigDecimal(couponInfo);
    }

}
```

- Đây là bốn loại chiến lược tính toán số tiền giảm giá cho phiếu giảm giá khác nhau, bạn có thể thấy số tiền giảm giá cho mỗi loại phiếu giảm giá từ code này.

### Kiểm thử

#### Viết lớp kiểm thử (Ưu đãi trực tiếp)

```java
@Test
public void testZj() {
    // Trừ trực tiếp; 100-10, sản phẩm có giá 100 đồng
    Context<Double> context = new Context<Double>(new ZJCouponDiscount());
    BigDecimal discountAmount = context.discountAmount(10D, new BigDecimal(100));
    logger.info("Kết quả kiểm thử: Giá sau ưu đãi trực tiếp {}", discountAmount);
}
```

**Kết quả kiểm thử**

```java
2024-04-01 23:10:07.166	INFO	main		(ApiTest.java:18)	|	Kết quả kiểm thử: Giá sau ưu đãi trực tiếp 90
```

#### Viết lớp kiểm thử (Ưu đãi theo số lượng)

```java
@Test  
public void test_mj() {  
    // Giảm 10 khi mua từ 100, sản phẩm có giá 100 đồng  
    Context<Map<String,String>> context;  
    context = new Context<Map<String,String>>(new MJCouponDiscount());  
    Map<String,String> mapReq = new HashMap<>();  
    mapReq.put("x","100");  
    mapReq.put("n","10");  
    BigDecimal discountAmount = context.discountAmount(mapReq, new BigDecimal(100));  
    logger.info("Kết quả kiểm thử: Giá sau ưu đãi theo số lượng {}", discountAmount);  
}
```

**Kết quả kiểm thử**

```java
2024-04-01 23:11:18.211	INFO	main		(ApiTest.java:33)	|	Kết quả kiểm thử: Giá sau ưu đãi theo số lượng 90
```

#### Viết lớp kiểm thử (Ưu đãi giảm giá)

```java
@Test
public void testZk() {
    // Giảm giá 10%, sản phẩm có giá 100 đồng
    Context<Double> context = new Context<Double>(new ZKCouponDiscount());
    BigDecimal discountAmount = context.discountAmount(0.9D, new BigDecimal(100));
    logger.info("Kết quả kiểm thử: Giá sau ưu đãi giảm giá 9 {}", discountAmount);
}
```

**Kết quả kiểm thử**

```java
2024-04-01 23:12:00.984	INFO	main		(ApiTest.java:42)	|	Kết quả kiểm thử: Giá sau ưu đãi giảm giá 9 90.00
```

#### Viết lớp kiểm thử (Ưu đãi mua N đồng)

```java
@Test
public void test_nyg() {
    // Mua với giá N đồng; giảm 10%, sản phẩm có giá 100 đồng
    Context<Double> context = new Context<Double>(new NYGCouponDiscount());
    BigDecimal discountAmount = context.discountAmount(90D, new BigDecimal(100));
    logger.info("Kết quả kiểm thử: Giá sau ưu đãi mua với giá N đồng {}", discountAmount);
```

**Kết quả kiểm thử**

```java
2024-04-01 23:13:06.475	INFO	main		(ApiTest.java:51)	|	Kết quả kiểm thử: Giá sau ưu đãi mua với giá N đồng 90
```

- Bốn bộ kiểm thử trên thực hiện kiểm tra các chiến lược ưu đãi khác nhau của phiếu giảm giá và kết quả kiểm thử đều đáp ứng kỳ vọng của chúng ta.
- Bốn loại phiếu giảm giá này cuối cùng đều giảm giá `10 đồng` trên giá gốc `100 đồng`, cuối cùng thanh toán là `90 đồng`.

## Tổng kết

- Các ví dụ về Strategy Pattern được trình bày ở trên không phức tạp, với logic chính tập trung vào chiến lược tính giảm giá của các loại phiếu giảm giá khác nhau. Cấu trúc tương đối đơn giản và mẫu thiết kế này cũng rất phổ biến trong thực tế. Ngoài ra, cấu trúc này có sự tương đồng với mẫu thiết kế lệnh và mẫu thiết kế trình điều chỉnh, nhưng có sự khác biệt trong cách tiếp cận.
- Bằng cách sử dụng Strategy Pattern, có thể loại bỏ các câu lệnh if trong phương thức, vì việc sử dụng nhiều câu lệnh if sẽ làm cho mã nguồn khó mở rộng và khó bảo trì. Đồng thời, khi gặp phải các vấn đề sau này, cũng khó để bảo trì. Sau khi sử dụng mẫu thiết kế này, có thể đáp ứng tốt yêu cầu về tính cách ly và mở rộng, đồng thời cũng dễ dàng thích ứng với các yêu cầu mới không ngừng tăng lên.
- `Mẫu thiết kế chiến lược`, `Mẫu thiết kế điều chỉnh`, `Mẫu thiết kế kết hợp`, và các mẫu thiết kế khác có thể có cấu trúc tương đối giống nhau, nhưng mỗi mẫu thiết kế lại có các đặc điểm logic riêng. Trong quá trình sử dụng, cách tốt nhất là học hỏi từ kinh nghiệm thực tế để cung cấp đầu ra công nghệ tốt hơn cho quá trình phát triển sau này.
