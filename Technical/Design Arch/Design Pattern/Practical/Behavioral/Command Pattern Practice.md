---
title: Command Pattern Practice
tags:
  - design-pattern
categories: 
date created: 2024-03-30
date modified: 2024-04-01
---

# Command Pattern Practice: Mô phỏng tám món ăn chính của một nhà hàng cao cấp, người phục vụ gọi món cho đầu bếp

## Giới thiệu

`Sự quan trọng của kiên nhẫn`

Khi bắt đầu học lập trình, thường xuyên chúng ta sẽ cảm thấy mơ hồ và gặp phải nhiều vấn đề khác nhau. Thậm chí đối với đoạn mã mà người khác chạy một cách trơn tru, bạn cũng có thể viết theo nhưng lại gặp lỗi. Nhưng may mắn thay bạn đã kiên trì, nếu không có thể bạn không đọc được bài viết này. Thời gian và sự phát triển liên quan chặt chẽ với nhau. Bạn sẽ nhìn thấy sự đẹp đẽ của điểm cuối của con đường nào mà bạn kiên trì đi, nhưng nếu bạn lãng phí cơ hội nỗ lực lần này và lần khác, bạn cũng sẽ bỏ lỡ nhiều cơ hội, vì con đường của bạn đã thay đổi. Kiên trì học hỏi, nỗ lực phát triển, và sự kiên nhẫn sẽ mang lại kết quả.

`Sự quan trọng của phương pháp học`

Không biết cách học thường làm phí hoài thời gian mà không có kết quả đáng kể. Nhưng đôi khi không biết cách học là do **lười biếng**, đặc biệt là khi học video, sách và tài liệu kỹ thuật. Nếu chỉ đọc mà không thực hành và kiểm tra, thì rất khó để hấp thụ kiến thức của người khác vào bản thân mình, ngay cả khi bạn cảm thấy bạn đã hiểu. Thỉnh thoảng bạn sẽ gặp ai đó nói với bạn; "Tôi không biết cái này, hãy cho tôi biết trước, sau đó tôi sẽ học." Nhưng sau đó, bạn đã học chưa?

`Bạn có sẵn lòng bỏ ra bao lâu để giải quyết một khu vực kiến thức trống trải`

Bạn có từng nghĩ trong lòng những từ như này không; "Quá khó, tôi không biết làm sao", "Hãy tìm một người để giúp đỡ", "Tôi bỏ cuộc, tôi bỏ cuộc". Trên thực tế, ai cũng có thể gặp phải các vấn đề khó giải quyết, và bạn cũng có thể hỏi và tham khảo. Nhưng nếu trước đó bạn không tìm kiếm câu trả lời trong đầu của mình, thì tâm trí của bạn sẽ không hình thành một cây kiến thức lồi lõm, thiếu đi quá trình học này cũng thiếu đi cơ hội tra cứu các tài liệu để lấp đầy kiến thức cho bản thân, dù bạn có hỏi được câu trả lời cuối cùng cũng sẽ quên sau một thời gian.

## Môi trường phát triển

1. JDK 1.8
2. Idea + Maven
3. Code: [vanhung4499/practical-java-design](https://github.com/vanhung4499/practical-java-design)  

| Dự án             | Mô tả                                                                   |
| ----------------- | ----------------------------------------------------------------------- |
| demo-design-14-01 | Triển khai nhu cầu kinh doanh bằng code lộn xộn                         |
| demo-design-14-02 | Tối ưu cấu trúc mã thông qua thiết kế mẫu, tăng tính mở rộng và bảo trì |

## Giới thiệu về Command Pattern

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240401003705.png)

Command Pattern ít được sử dụng trong phát triển web thông thường, nhưng mẫu này thường được sử dụng hàng ngày trong cuộc sống của chúng ta, chẳng hạn như `Ctrl+C`, `Ctrl+V`. Tất nhiên, nếu bạn đã từng phát triển một số ứng dụng desktop, bạn cũng sẽ cảm nhận được các tình huống áp dụng mẫu này. Từ cách triển khai mẫu này, bạn có thể thấy rằng nó tách biệt logic thực hiện và yêu cầu hoạt động, giảm thiểu sự liên kết và dễ dàng mở rộng.  

Command Pattern là một loại mẫu hành vi, trong đó `đối tượng lệnh`, có thể được chuyển đến `người gọi` thông qua hàm tạo. Người gọi sau đó cung cấp các phương thức thích hợp để thực hiện lệnh. Có thể cảm thấy hơi phức tạp ở điểm này, nhưng bạn có thể hiểu thông qua việc triển khai mã và thực hành để trở nên thành thạo.

Trong quá trình triển khai mẫu này, có một số điểm quan trọng như sau:

1. Lớp lệnh trừu tượng; khai báo giao diện và phương thức thực thi lệnh
2. Lớp lệnh cụ thể; triển khai cụ thể của giao diện, có thể là một nhóm logic hành vi tương tự
3. Người thực hiện; là lớp cụ thể thực hiện cho lệnh
4. Người gọi; xử lý lệnh, thực hiện các hoạt động cụ thể, chịu trách nhiệm cung cấp dịch vụ lệnh ra bên ngoài

## Mô phỏng Tình huống

**Trong tình huống này, chúng tôi mô phỏng một tình huống trong nhà hàng khi đặt món và giao cho đầu bếp để nấu.**

Logic cốt lõi của tình huống lệnh là người gọi không cần quan tâm đến việc thực hiện cụ thể. Trong tình huống này, người đặt món chỉ cần giao các loại món cần đặt cho `người hầu` là được, người hầu sau đó sẽ giao từng món đến từng đầu bếp để nấu. Nghĩa là người đặt món không cần trao đổi với từng đầu bếp, chỉ cần đưa ra lệnh trong một môi trường thống nhất là được.

Trong tình huống này, bạn có thể thấy có các loại món khác nhau; Shandong (ẩm thực Lỗ), Sichuan (ẩm thực Sì Chuẩn), Jiangsu (ẩm thực Tô), Guangdong (ẩm thực Quảng Đông), Fujian (ẩm thực Phúc Kiến), Zhejiang (ẩm thực Chấn Giang), và Hunan (ẩm thực Tương Tử). Mỗi loại món sẽ được đầu bếp khác nhau 👩‍🍳 thực hiện. Khách hàng không quan tâm đến ai đang nấu, và đầu bếp cũng không quan tâm ai đã đặt món. Khách hàng chỉ quan tâm món ăn đến sớm, và đầu bếp chỉ quan tâm còn bao nhiêu món cần nấu. Và quá trình kết nối giữa chúng được hoàn thành bởi người hầu.

Với một tình huống mô phỏng như vậy, bạn có thể suy nghĩ 🤔 phần nào là việc phân tích Command Pattern, phần nào là người gọi lệnh và phần nào là logic thực hiện của lệnh.

## Triển khai code trực tiếp

`Nếu không xem xét mẫu thiết kế, khi triển khai một hệ thống đặt món như vậy, chỉ cần một lớp là đủ`

Trong một tình huống phức tạp như vậy, nếu không biết về mẫu thiết kế và triển khai trực tiếp, cũng có thể đạt được mục tiêu. Nhưng đối với việc mở rộng các loại món, triển khai đầu bếp và cách triệu hồi sẽ trở nên rất rối rắm và khó mở rộng.

### Cấu trúc dự án

```java
design-demo-14-01
├── pom.xml
└── src
    ├── main
    │   └── java
    │       └── com
    │           └── hnv99
    │               └── design
    │                   └── XiaoEr.java
    └── test
        └── java
            └── com
                └── hnv99
                    └── design
                        └── ApiTest.java

```

- Chỉ có một lớp người phục vụ nhà hàng ở đây, thông qua lớp này để triển khai logic đặt món cho các loại món khác nhau.

### Triển khai code

```java
public class XiaoEr {  
  
    private Logger logger = LoggerFactory.getLogger(XiaoEr.class);  
  
    private Map<Integer, String> cuisineMap = new ConcurrentHashMap<>();  
  
    public void order(int cuisine) {  
        // Quảng Đông (món ngon Quảng Đông)  
        if (1 == cuisine) {  
            cuisineMap.put(1, "Đầu bếp Quảng Đông, nấu món Lục Thái, là loại món ăn lớn nhất của cung đình, dựa trên hương vị cung đình");  
        }  
        // Giang Tô (món ngon Tô)  
        if (2 == cuisine) {  
            cuisineMap.put(2, "Đầu bếp Giang Tô, nấu món Tô, là loại món ăn lớn nhì của cung đình, được yêu thích nhất trong các bữa tiệc quốc gia từ xưa đến nay.");  
        }  
        // Sơn Đông (món ngon Lục)  
        if (3 == cuisine) {  
            cuisineMap.put(3, "Đầu bếp Sơn Đông, nấu món Lục Thái, là loại món ăn lớn nhất của cung đình, dựa trên hương vị cung đình.");  
        }  
        // Tứ Xuyên (món ngon Truân)  
        if (4 == cuisine) {  
            cuisineMap.put(4, "Đầu bếp Tứ Xuyên, nấu món Truân, là loại món ăn đặc trưng nhất của Trung Quốc, cũng là loại món ăn lớn nhất của dân gian.");  
        }  
    }  
    public void placeOrder() {  
        logger.info("Thực đơn: {}", JSON.toJSONString(cuisineMap));  
    }  
}
```

- Trong lớp này, có hai phương thức được triển khai, một phương thức để thêm các món ăn vào đơn đặt hàng `order()`, và một phương thức để hiển thị thông tin món ăn `placeOrder()`.
- Có nhiều câu lệnh điều kiện if để thêm các loại món ăn, và với mã nguồn lớn hơn, việc duy trì sẽ trở nên khó khăn hơn. Tất cả các loại món ăn đều được thêm vào trong một lớp duy nhất, điều này sẽ tạo ra sự phụ thuộc lẫn nhau rất nặng nề.

### Tái cấu trúc bằng Command Pattern

Tiếp theo, chúng ta sẽ tối ưu mã bằng Command Pattern, một nỗ lực tối ưu nhỏ.

Command Pattern phân chia mã thành ba thành phần chính: lệnh, người thực hiện lệnh và người gọi lệnh. Khi có các món mới hoặc đầu bếp cần được thêm vào, chúng có thể dễ dàng được thực hiện trong cấu trúc lớp được chỉ định, làm cho việc gọi bên ngoài rất dễ mở rộng.

### Cấu trúc Dự án

```java
design-demo-14-02
├── pom.xml
└── src
    ├── main
    │   └── java
    │       └── com
    │           └── hnv99
    │               └── design
    │                   ├── XiaoEr.java
    │                   ├── cook
    │                   │   ├── ICook.java
    │                   │   └── impl
    │                   │       ├── GuangDongCook.java
    │                   │       ├── JiangSuCook.java
    │                   │       ├── ShanDongCook.java
    │                   │       └── SiChuanCook.java
    │                   └── cuisine
    │                       ├── ICuisine.java
    │                       └── impl
    │                           ├── GuangDoneCuisine.java
    │                           ├── JiangSuCuisine.java
    │                           ├── ShanDongCuisine.java
    │                           └── SiChuanCuisine.java
    └── test
        └── java
            └── com
                └── hnv99
                    └── design
                        └── ApiTest.java
```

**Cấu Trúc Mô Hình Command Pattern**

- Cấu trúc được chia thành ba khối chính: thực hiện lệnh (món ăn), triển khai logic (đầu bếp) và người gọi (XiaoEr). Việc triển khai ba khía cạnh này tạo nên nội dung cốt lõi của Command Pattern.
- Sau phân rã như vậy, việc mở rộng món ăn và đầu bếp trở nên rất thuận tiện. Với người gọi, những phần này được kết nối lỏng lẻo, làm cho việc thêm logic triển khai trong khung tổng thể trở nên rất dễ dàng.

### Định nghĩa lớp trừu tượng (Giao diện món ăn)

```java
/**
 * Hệ thống các món ăn
 * 01. Sơn Đông (Món Lục Thực) - Món Lục Thực lớn nhất trong cung điện, với hương vị của gia đình Khổng.
 * 02. Tứ Xuyên (Món Sì Chuẩn) - Món ăn phong cách đặc trưng của Trung Quốc, cũng là món ăn lớn nhất ở dân dã.
 * 03. Giang Tô (Món Tô Thực) - Món Lục Thực thứ hai trong cung điện, là món ăn được yêu thích nhất trên bàn tiệc của cả xưa và nay.
 * 04. Quảng Đông (Món Tiểu Thực) - Món Lục Thực thứ hai trong nước, là món ăn Trung Quốc có ảnh hưởng nhất ở nước ngoài, có thể đại diện cho Trung Quốc.
 * 05. Phúc Kiến (Món Miến Thực) - Đại diện cho món ăn của người Hà Khẩu.
 * 06. Chiết Giang (Món Chiết Thực) - Một trong những hệ thống lớn nhất và cổ nhất của Trung Quốc, là món ăn lớn nhất thứ ba trong cung điện.
 * 07. Hồ Nam (Món Hương Thực) - Món Lục Thực thứ ba trong nước.
 * 08. An Huy (Món Huê Thực) - Đại diện cho văn hóa Huê Châu.
 */
public interface ICuisine {

    void cook(); // Nấu ăn, chế biến

}

```

- Đây là định nghĩa của giao diện lệnh, và cung cấp một phương thức nấu ăn. Sau này, chúng ta sẽ triển khai bốn loại món ăn.

#### Triển khai lệnh cụ thể (Bốn loại món ăn)

**Quảng Đông (Món Tiểu Thực)**

```java
public class GuangDoneCuisine implements ICuisine {

    private ICook cook;

    public GuangDoneCuisine(ICook cook) {
        this.cook = cook;
    }

    public void cook() {
        cook.doCooking();
    }

}
```

**Giang Tô (Món Tô Thực)**

```java
public class JiangSuCuisine implements ICuisine {

    private ICook cook;

    public JiangSuCuisine(ICook cook) {
        this.cook = cook;
    }

    public void cook() {
        cook.doCooking();
    }

}
```

**Sơn Đông (Món Lục Thực)**

```java
public class ShanDongCuisine implements ICuisine {

    private ICook cook;

    public ShanDongCuisine(ICook cook) {
        this.cook = cook;
    }

    public void cook() {
        cook.doCooking();
    }

}
```

**Tứ Xuyên (Món Sì Chuẩn)**

```java
public class SiChuanCuisine implements ICuisine {

    private ICook cook;

    public SiChuanCuisine(ICook cook) {
        this.cook = cook;
    }

    public void cook() {
        cook.doCooking();
    }

}
```

- Các lớp triển khai trên đều thêm một đối tượng đầu bếp (`ICook`) và sử dụng phương thức `cook.doCooking()` của đối tượng này để thực hiện lệnh (nấu món).
- Quá trình triển khai của lệnh có thể được bổ sung theo logic cụ thể. Hiện tại, các triển khai này đơn giản chỉ mô phỏng quá trình nấu món và giả định rằng các đầu bếp đều nấu món cùng một lúc.

#### Định nghĩa giao diện cho người thực hiện (Đầu bếp)

```java
public interface ICook {

    void doCooking();

}
```

- Ở đây, chúng ta định nghĩa người thực hiện cụ thể cho các lệnh, trong trường hợp này là đầu bếp nấu món tương ứng với mỗi loại món.

#### Triển khai cụ thể cho người thực hiện (Bốn loại đầu bếp)

**Đầu bếp phong cách Quảng Đông**

```java
public class GuangDongCook implements ICook {

    private Logger logger = LoggerFactory.getLogger(ICook.class);

    public void doCooking() {
        logger.info("Đầu bếp phong cách Quảng Đông, nấu món Quảng Đông, là một trong những dòng ẩm thực cung đình lớn nhất, đặc sắc với phong cách nhà Khổng.");
    }

}
```

**Đầu bếp phong cách Giang Tô**

```java
public class JiangSuCook implements ICook {

    private Logger logger = LoggerFactory.getLogger(ICook.class);

    public void doCooking() {
        logger.info("Đầu bếp phong cách Giang Tô, nấu món Giang Tô, là một trong những dòng ẩm thực cung đình lớn nhất, được yêu thích nhất trong các tiệc quốc gia từ xưa đến nay.");
    }

}
```

**Đầu bếp phong cách Sơn Đông**

```java
public class ShanDongCook implements ICook {

    private Logger logger = LoggerFactory.getLogger(ICook.class);

    public void doCooking() {
        logger.info("Đầu bếp phong cách Sơn Đông, nấu món Sơn Đông, là một trong những dòng ẩm thực cung đình lớn nhất, đặc sắc với phong cách nhà Khổng.");
    }

}
```

**Đầu bếp phong cách Sơn Tây**

```java
public class SiChuanCook implements ICook {

    private Logger logger = LoggerFactory.getLogger(ICook.class);

    public void doCooking() {
        logger.info("Đầu bếp phong cách Sơn Tây, nấu món Sơn Tây, là một trong những dòng ẩm thực cung đình lớn nhất, đặc sắc với phong cách nhà Khổng.");
    }

}
```

- Đây là bốn loại đầu bếp khác nhau cho bốn loại món khác nhau. Trong quá trình triển khai, chúng ta mô phỏng việc ghi log, tương tự như thông báo cho đầu bếp trong nhà bếp để nấu món tương ứng.
- Có thể thấy rằng, khi cần mở rộng, chúng ta có thể thêm mới một cách dễ dàng và mỗi lớp đều tuân theo nguyên tắc trách nhiệm duy nhất.

#### Người gọi (Người phục vụ)

```java
public class XiaoEr {

    private Logger logger = LoggerFactory.getLogger(XiaoEr.class);

    private List<ICuisine> cuisineList = new ArrayList<ICuisine>();

    public void order(ICuisine cuisine) {
        cuisineList.add(cuisine);
    }

    public synchronized void placeOrder() {
        for (ICuisine cuisine : cuisineList) {
            cuisine.cook();
        }
        cuisineList.clear();
    }

}
```

- Trong việc triển khai cụ thể của người gọi, đã cung cấp việc thêm món và thực hiện nấu ăn cho thực đơn. Quá trình này là cuộc gọi cụ thể của mẫu lệnh, thông qua việc truyền món ăn và đầu bếp từ bên ngoài để thực hiện cuộc gọi cụ thể.

### Kiểm tra và xác minh

#### Viết lớp kiểm tra

```java
@Test
public void test(){

    // Các món ăn + Đầu bếp; Quảng Đông (Món Quảng Đông), Giang Tây (Món Giang Tây), Sơn Đông (Món Sơn Đông), Tứ Xuyên (Món Tứ Xuyên)
    ICuisine guangDoneCuisine = new GuangDoneCuisine(new GuangDongCook());
    JiangSuCuisine jiangSuCuisine = new JiangSuCuisine(new JiangSuCook());
    ShanDongCuisine shanDongCuisine = new ShanDongCuisine(new ShanDongCook());
    SiChuanCuisine siChuanCuisine = new SiChuanCuisine(new SiChuanCook());

    // Đặt hàng
    XiaoEr xiaoEr = new XiaoEr();
    xiaoEr.order(guangDoneCuisine);
    xiaoEr.order(jiangSuCuisine);
    xiaoEr.order(shanDongCuisine);
    xiaoEr.order(siChuanCuisine);

    // Đặt hàng
    xiaoEr.placeOrder();
}
```

- Ở đây, chúng ta có thể quan sát chính xác sự kết hợp giữa `món ăn` và `đầu bếp`; `new GuangDoneCuisine(new GuangDongCook());`, Mỗi một lệnh cụ thể đều có một lớp thực hiện tương ứng, có thể kết hợp với nhau.
- Khi các món ăn và lớp thực hiện cụ thể được xác định, bởi nhân viên giao hàng thực hiện đặt hàng, `xiaoEr.order(guangDoneCuisine);`, ở đây, chúng tôi đã thêm bốn loại món ăn cho nhân viên giao hàng.
- Cuối cùng là đặt hàng, đây là hoạt động thực hiện cụ thể của lệnh, tương đương với việc chuyển thẻ món ăn từ tay nhân viên giao hàng sang đầu bếp. Tất nhiên, ở đây chúng ta cũng có thể cung cấp chức năng xóa và hủy, nghĩa là khách hàng đã hủy một số món ăn của họ.

#### Kết quả

```shell
2024-04-01 10:50:15.118	INFO	main		(GuangDongCook.java:13)	|	Đầu bếp phong cách Quảng Đông, nấu món Quảng Đông, là một trong những dòng ẩm thực cung đình lớn nhất, đặc sắc với phong cách nhà Khổng.
2024-04-01 10:50:15.122	INFO	main		(JiangSuCook.java:12)	|	Đầu bếp phong cách Giang Tô, nấu món Giang Tô, là một trong những dòng ẩm thực cung đình lớn nhất, được yêu thích nhất trong các tiệc quốc gia từ xưa đến nay.
2024-04-01 10:50:15.122	INFO	main		(ShanDongCook.java:12)	|	Đầu bếp phong cách Sơn Đông, nấu món Sơn Đông, là một trong những dòng ẩm thực cung đình lớn nhất, đặc sắc với phong cách nhà Khổng.
2024-04-01 10:50:15.122	INFO	main		(SiChuanCook.java:12)	|	Đầu bếp phong cách Sơn Tây, nấu món Sơn Tây, là một trong những dòng ẩm thực cung đình lớn nhất, đặc sắc với phong cách nhà Khổng.

```

- Từ kết quả kiểm tra trên, chúng ta có thể thấy rằng việc đặt hàng của chúng tôi đã được chuyển cho các nhà hàng khác nhau để thực hiện (nấu ăn).
- Ngoài ra, khi chúng ta cần các món ăn khác nhau hoặc sửa đổi, chúng ta cũng có thể dễ dàng thêm và chỉnh sửa. Dưới cấu trúc của các lớp đảm bảo trách nhiệm duy nhất, việc mở rộng trở nên rất dễ dàng.

## Tổng kết

- Từ nội dung và ví dụ trên, chúng ta có thể cảm nhận được rằng việc sử dụng mẫu lệnh cần phân chia thành ba phần lớn; `Lệnh`, `Thực hiện`, `Người gọi`, và việc phân chia ba phần này cũng là yếu tố quan trọng trong việc chọn lựa mẫu phù hợp cho các tình huống. Sau quá trình phân chia như vậy, logic có trách nhiệm duy nhất được thiết lập, dễ dàng mở rộng.
- So với câu lệnh if, việc thực hiện này giảm thiểu sự kết nối và dễ dàng mở rộng cho các lệnh và thực hiện khác nhau. Tuy nhiên, mẫu thiết kế này cũng mang lại một số vấn đề, đó là dưới các kết hợp lệnh và thực hiện khác nhau, sẽ mở rộng ra nhiều lớp thực hiện, cần phải quản lý.
- Học mẫu thiết kế yêu cầu luyện tập chăm chỉ, ngay cả khi bắt đầu bằng cách mô phỏng cài đặt. Sau nhiều lần luyện tập, hãy tìm những tình huống có thể tối ưu và dần dần áp dụng vào công việc phát triển của bạn. Nâng cao cảm giác thiết kế mã của bạn, làm cho cấu trúc mã trở nên rõ ràng và dễ mở rộng hơn.
