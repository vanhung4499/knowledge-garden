---
title: Builder Pattern Practice
tags:
  - design-pattern
categories: 
date created: 2024-03-26
date modified: 2024-03-26
---

# Builder Pattern: Lựa chọn các gói trang trí nội thất khác nhau

## Giới thiệu

"Chỉ khi thực hiện theo quy trình phát triển mới có thể viết ra chương trình tốt!"

Một dự án đi vào hoạt động thường phải trải qua `yêu cầu nghiệp vụ`, `thiết kế sản phẩm`, `triển khai phát triển`, `kiểm tthử`, `triển khai đưa vào sử dụng`, `phát hành chính thức`, và trong đó một phần quan trọng là quá trình triển khai phát triển, nó cũng có thể bao gồm: `chọn kiến trúc`, `thiết kế chức năng`, `đánh giá thiết kế`, `triển khai code`, `đánh giá code`, `unit test`, `viết tài liệu`, `gửi cho tester`. Vì vậy, trong một số quy trình, thực sự rất khó để bạn có thể phát triển code một cách tự do.

Quá trình viết code không phải là `trình diễn kỹ năng`, giống như xây nhà mà không tuân thủ kế hoạch, sau khi quay lại bạn sẽ thấy mình đang xây một phòng bếp và phòng tắm trên tường núi! Có lẽ trong thực tế điều này có vẻ ngớ ngẩn, nhưng trong phát triển chức năng, luôn có một số code như vậy.  

**Vì vậy, chúng ta cũng cần một số ý tưởng tiêu chuẩn của mẫu thiết kế, để xây dựng cấu trúc code, nâng cao khả năng kiểm soát tổng thể.**

## Môi trường phát triển

1. JDK 1.8
2. Idea + Maven
3. Code: [vanhung4499/practical-java-design](https://github.com/vanhung4499/practical-java-design)  

| Dự án                    | Mô tả                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| demo-design-3-00 | Dự án mô phỏng, mô phỏng quá trình lựa chọn gói trang trí (Sang trọng, Nông thôn, Đơn giản) |
| demo-design-3-01 | Sử dụng một đống code để đáp ứng yêu cầu kinh doanh, cũng là việc sử dụng ifelse              |
| demo-design-3-02 | Tối ưu và cải tiến code thông qua các mẫu thiết kế, tạo ra sự so sánh để học hỏi              |

## Giới thiệu Builder Pattern

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240326192230.png)

**Nội dung mà Builder Pattern thực hiện là thông qua việc sắp xếp từng bước để xây dựng một đối tượng phức tạp từ nhiều đối tượng đơn giản.**

`Vậy, nơi nào có cảnh này chứ?`

Ví dụ, khi bạn khởi đầu màn hình của Liên Quân Mobile: có ba con đường, có cây cối, có quái vật rừng, có trụ bảo vệ vv, thậm chí phụ thuộc vào tình trạng mạng của bạn để điều chỉnh độ nét. Và khi bạn chuyển sang một cảnh khác để chọn các chế độ khác nhau, vẫn sẽ xây dựng các yếu tố như đường, cây cối, quái vật rừng vv, nhưng vị trí và kích thước của chúng sẽ khác nhau. Ở đây, Builder Pattern có thể được sử dụng để khởi tạo các yếu tố của trò chơi.

Và những thành phần dựa trên cùng một "vật liệu", với sự sắp xếp khác nhau sẽ tạo ra nội dung cụ thể khác nhau, đó chính là mục đích cuối cùng của Builder Pattern, cũng chính là: **Tách một quá trình xây dựng phức tạp khỏi việc biểu diễn của nó, làm cho cùng một quá trình xây dựng có thể tạo ra nhiều biểu diễn khác nhau.**

## Mô phỏng kịch bản

**Ở đây chúng ta mô phỏng một số kịch bản của các dịch vụ trang trí của các công ty trang trí thiết kế nội thất.**

Nhiều công ty trang trí sẽ cung cấp các dịch vụ trang trí theo gói của họ, thường có: Châu Âu Cao cấp, Nông thôn Nhẹ nhàng, Hiện đại Đơn giản vv, và sau các gói này là sự kết hợp của các sản phẩm khác nhau. Ví dụ: Trần nhà & Trần nhà hai tầng, sơn lót Dulux, sàn nhà Sanhoo, gạch lát nhà vệ sinh Marco Polo vv, chọn kết hợp các thương hiệu khác nhau theo giá cả khác nhau của các gói, cuối cùng lại đưa ra một báo giá tổng thể dựa trên diện tích trang trí.

Ở đây chúng ta sẽ mô phỏng một số dịch vụ trang trí mà các công ty trang trí muốn triển khai, và kết hợp các thương hiệu khác nhau theo giá khác nhau của các gói, để sử dụng Builder Pattern.

### Dự án mô phỏng kịch bản

```shell
design-demo-3-00/
├── pom.xml
└── src
    └── main
        └── java
            └── com
                └── hnv99
                    └── design
                        ├── Matter.java
                        ├── ceiling
                        │   ├── LevelOneCeiling.java
                        │   └── LevelTwoCeiling.java
                        ├── coat
                        │   ├── DuluxCoat.java
                        │   └── NipponCoat.java
                        ├── floor
                        │   ├── DerFloor.java
                        │   └── InovarFloor.java
                        └── tile
                            ├── MarcoPoloTile.java
                            └── PrimeTile.java

```

Dự án mô phỏng cung cấp các vật liệu cần thiết để trang trí; `ceiling` (trần), `coat` (sơn lót), `floor` (sàn), `tile` (gạch ốp lát), bốn hạng mục này. (*Các vật liệu trang trí thực tế còn nhiều hơn thế này*)

### Mô tả ngắn gọn

#### Matter interface

```java
public interface Matter {

    String scene();      // Bối cảnh: Sàn nhà, Gạch, Sơn, Trần nhà

    String brand();      // Thương hiệu

    String model();      // Mẫu code

    BigDecimal price();  // Giá

    String desc();       // Mô tả

}

```

Matter interface cung cấp các thông tin cơ bản để đảm bảo tất cả các vật liệu trang trí có thể được truy xuất theo một tiêu chuẩn thống nhất.

#### Trần nhà

**Loại 1**

```java
public class LevelOneCeiling implements Matter {  
  
    public String scene() {  
        return "Trần nhà";  
    }  
    public String brand() {  
        return "Công ty trang trí tự động";  
    }  
    public String model() {  
        return "Trần nhà cấp 1";  
    }  
    public BigDecimal price() {  
        return new BigDecimal(260);  
    }  
    public String desc() {  
        return "Thiết kế chỉ có một tầng, chỉ có một tầng của trần nhà, thường là cách trần 120-150mm";  
    }  
}
```

**Loại 2**

```java
public class LevelTwoCeiling implements Matter {  
  
    public String scene() {  
        return "Trần nhà";  
    }  
    public String brand() {  
        return "Công ty trang trí tự động";  
    }  
    public String model() {  
        return "Trần nhà cấp 2";  
    }  
    public BigDecimal price() {  
        return new BigDecimal(850);  
    }  
    public String desc() {  
        return "Trần nhà hai tầng, trần nhà cấp 2 thường được làm rộng hơn 20cm, nếu chiều cao trần rất cao, bạn cũng có thể tăng độ dày của mỗi tầng";  
    }  
}
```

#### Sơn lót

**Dulux**

```java
public class DuluxCoat implements Matter {  
  
    public String scene() {  
        return "Sơn";  
    }  
    public String brand() {  
        return "Dulux";  
    }  
    public String model() {  
        return "Thế hệ thứ hai";  
    }  
    public BigDecimal price() {  
        return new BigDecimal(719);  
    }  
    public String desc() {  
        return "Dulux là một thương hiệu sơn nổi tiếng thuộc sở hữu của tập đoàn AkzoNobel, sản phẩm được bán chạy ở hơn 100 quốc gia trên thế giới, mỗi năm có khoảng 50 triệu hộ gia đình sử dụng sơn Dulux.";  
    }  
}
```

**Nippon**

```java
public class NipponCoat {  
    public String scene() {  
        return "Sơn";  
    }  
    public String brand() {  
        return "Nippon";  
    }  
    public String model() {  
        return "Thế hệ thứ hai";  
    }  
    public String price() {  
        return "719";  
    }  
    public String desc() {  
        return "Nippon là một thương hiệu sơn nổi tiếng, là thương hiệu sơn hàng đầu tại châu Á, với hơn 130 năm kinh nghiệm trong ngành công nghiệp sơn.";  
    }}
```

#### Sàn

**Der**

```java
public class DerFloor implements Matter {  
  
    public String scene() {  
        return "Sàn gỗ";  
    }  
    public String brand() {  
        return "Der";  
    }  
    public String model() {  
        return "A+";  
    }  
    public BigDecimal price() {  
        return new BigDecimal(119);  
    }  
    public String desc() {  
        return "Tập đoàn Der là một trong những nhà sản xuất sàn gỗ chuyên nghiệp hàng đầu thế giới, là nhà cung cấp sàn gỗ cho trang trí nội thất và công trình công cộng của Thế vận hội Olympic Bắc Kinh 2008.";  
    }  
}
```

**Inovar**

```java
public class InovarFloor {  
    public String scene() {  
        return "Sàn";  
    }  
    public String brand() {  
        return "Inovar";  
    }  
    public String model() {  
        return "Thế hệ thứ hai";  
    }  
    public String price() {  
        return "719";  
    }  
    public String desc() {  
        return "Inovar là một thương hiệu sàn nổi tiếng, là thương hiệu sàn hàng đầu tại châu Á, với hơn 130 năm kinh nghiệm trong ngành công nghiệp sàn.";  
    }
}
```

#### Gạch ốp lát

**MarcoPolo**

```java
public class MarcoPoloTile implements Matter {  
  
    public String scene() {  
        return "Gạch lát";  
    }  
    public String brand() {  
        return "Marco Polo";  
    }  
    public String model() {  
        return "Mặc định";  
    }  
    public BigDecimal price() {  
        return new BigDecimal(140);  
    }  
    public String desc() {  
        return "Thương hiệu 'Marco Polo' được thành lập vào năm 1996 và là một trong những thương hiệu gạch lát hàng đầu ở Trung Quốc. Với phong cách 'Gạch lát cổ điển' độc đáo, thương hiệu này đã thu hút sự chú ý của thị trường và được biết đến với biệt danh 'Vị vua của Gạch lát cổ điển'.";  
    }  
}
```

**Prime**

```java
public class PrimeTile {  
    public String scene() {  
        return "Gạch";  
    }  
    public String brand() {  
        return "Prime";  
    }  
    public String model() {  
        return "Mặc định";  
    }  
    public String price() {  
        return "140";  
    }  
    public String desc() {  
        return "Prime là một thương hiệu gạch hàng đầu tại châu Á, với hơn 130 năm kinh nghiệm trong ngành công nghiệp gạch.";  
    }
}
```

- Trên đây là một ví dụ về "danh sách vật liệu trang trí" được cung cấp bởi công ty trang trí nội thất trong dự án này, tiếp theo chúng ta sẽ sử dụng các vật liệu khác nhau để tạo ra các gói dịch vụ trang trí khác nhau trong ví dụ.

> [!warning]  
> Các thông tin về các loại vật liệu chỉ mang tính chất tham khảo, !

## Triển khai code

"Thực ra, không có vấn đề nào mà ifelse không thể giải quyết được, nếu không được thì thêm một dòng nữa!"

Mỗi chương trình, chúng tôi sẽ sử dụng cách rất trực quan để triển khai chức năng, sau đó sẽ tối ưu và hoàn thiện thông qua các mẫu thiết kế. Cấu trúc code này cũng rất đơn giản, không có các mối quan hệ phức tạp giữa các lớp, chỉ là code trực tiếp. Ngoài việc nhấn mạnh rằng code như vậy không thể mở rộng tốt, làm một số ví dụ về các dự án demo vẫn là điều có ích.

### Cấu trúc dự án

```shell
design-demo-3-01/
├── pom.xml
└── src
    └── main
        └── java
            └── com
                └── hnv99
                    └── design
                        └── DecorationPackageController.java

```

Bạn đã bao giờ thấy một lớp có một vài nghìn dòng chưa? Hôm nay bạn sẽ được trải nghiệm điều đó!

### Triển khai kiểu ifelse

```java
  
public class DecorationPackageController {  
  
    public String getMatterList(BigDecimal area, Integer level) {  
        List<Matter> list = new ArrayList<Matter>(); // Danh sách vật liệu trang trí  
        BigDecimal price = BigDecimal.ZERO;          // Giá trang trí  
  
        // Sang trọng kiểu Châu Âu        if (1 == level) {  
  
            LevelTwoCeiling levelTwoCeiling = new LevelTwoCeiling(); // Trần nhà, trần nhà cấp hai  
            DuluxCoat duluxCoat = new DuluxCoat();                   // Sơn, sơn Dulux  
            InovarFloor inovarFloor = new InovarFloor();             // Sàn, sàn Inovar  
  
            list.add(levelTwoCeiling);  
            list.add(duluxCoat);  
            list.add(inovarFloor);  
  
            price = price.add(area.multiply(new BigDecimal("0.2")).multiply(levelTwoCeiling.price()));  
            price = price.add(area.multiply(new BigDecimal("1.4")).multiply(duluxCoat.price()));  
            price = price.add(area.multiply(inovarFloor.price()));  
  
        }  
        // Nông thôn nhẹ nhàng  
        if (2 == level) {  
  
            LevelTwoCeiling levelTwoCeiling = new LevelTwoCeiling(); // Trần nhà, trần nhà cấp hai  
            NipponCoat nipponCoat = new NipponCoat();                // Sơn, sơn nippon  
            MarcoPoloTile marcoPoloTile = new MarcoPoloTile();       // Gạch, gạch Marco Polo  
  
            list.add(levelTwoCeiling);  
            list.add(nipponCoat);  
            list.add(marcoPoloTile);  
  
            price = price.add(area.multiply(new BigDecimal("0.2")).multiply(levelTwoCeiling.price()));  
            price = price.add(area.multiply(new BigDecimal("1.4")).multiply(nipponCoat.price()));  
            price = price.add(area.multiply(marcoPoloTile.price()));  
  
        }  
        // Hiện đại đơn giản  
        if (3 == level) {  
  
            LevelOneCeiling levelOneCeiling = new LevelOneCeiling();  // Trần nhà, trần nhà cấp một  
            NipponCoat nipponCoat = new NipponCoat();                 // Sơn, sơn Li Bang  
            PrimeTile primeTile = new PrimeTile();           // Gạch, gạch Đông Bằng  
  
            list.add(levelOneCeiling);  
            list.add(nipponCoat);  
            list.add(primeTile);  
  
            price = price.add(area.multiply(new BigDecimal("0.2")).multiply(levelOneCeiling.price()));  
            price = price.add(area.multiply(new BigDecimal("1.4")).multiply(nipponCoat.price()));  
            price = price.add(area.multiply(primeTile.price()));  
        }  
        StringBuilder detail = new StringBuilder("\r\n-------------------------------------------------------\r\n" +  
                "Danh sách vật liệu trang trí" + "\r\n" +  
                "Cấp độ gói：" + level + "\r\n" +  
                "Giá gói：" + price.setScale(2, BigDecimal.ROUND_HALF_UP) + " đồng\r\n" +  
                "Diện tích nhà：" + area.doubleValue() + " mét vuông\r\n" +  
                "Danh sách vật liệu：\r\n");  
  
        for (Matter matter: list) {  
            detail.append(matter.scene()).append("：").append(matter.brand()).append("、").append(matter.model()).append("、Giá/m²：").append(matter.price()).append(" đồng。\n");  
        }  
        return detail.toString();  
    }  
}
```

- Trước hết, vấn đề mà đoạn code này cần giải quyết là nhận các thông số đầu vào: diện tích (diện tích), cấp độ trang trí (level) và lựa chọn các vật liệu khác nhau theo các loại cấp độ trang trí khác nhau.
- Thứ hai, trong quá trình triển khai, chúng ta có thể thấy mỗi khối `if` chứa các vật liệu khác nhau ( *trần, sơn, sàn, gạch lát ), và cuối cùng là danh sách trang trí và chi phí trang trí được tạo ra.
- Cuối cùng, một phương thức được cung cấp để lấy các chi tiết trang trí và trả về cho người gọi để biết danh sách trang trí.

### Kiểm thử

Tiếp theo, chúng tôi kiểm tra unit test qua Junit, nhấn mạnh rằng việc viết các bài unit test tốt hàng ngày có thể cải thiện tốt hơn tính mạnh mẽ của hệ thống.

**Unit test**

```java
  
public class ApiTest {  
  
    @Test  
    public void test_DecorationPackageController(){  
        DecorationPackageController decoration = new DecorationPackageController();  
  
        // Sang trọng kiểu Châu Âu  
        System.out.println(decoration.getMatterList(new BigDecimal("132.52"),1));  
  
        // Nông thôn nhẹ nhàng  
        System.out.println(decoration.getMatterList(new BigDecimal("98.25"),2));  
  
        // Hiện đại đơn giản  
        System.out.println(decoration.getMatterList(new BigDecimal("85.43"),3));  
    }  
}
```

**Kết quả**

```shell
Danh sách vật liệu trang trí
Cấp độ gói：1
Giá gói：198064.39 đồng
Diện tích nhà：132.52 mét vuông
Danh sách vật liệu：
Trần nhà：Công ty trang trí tự động、Trần nhà cấp 2、Giá/m²：850 đồng。
Sơn：Dulux、Thế hệ thứ hai、Giá/m²：719 đồng。
Sàn：Inovar、Thế hệ thứ hai、Giá/m²：318 đồng。


-------------------------------------------------------
Danh sách vật liệu trang trí
Cấp độ gói：2
Giá gói：119865.00 đồng
Diện tích nhà：98.25 mét vuông
Danh sách vật liệu：
Trần nhà：Công ty trang trí tự động、Trần nhà cấp 2、Giá/m²：850 đồng。
Sơn：Nippon、Thế hệ thứ hai、Giá/m²：650 đồng。
Gạch lát：Marco Polo、Mặc định、Giá/m²：140 đồng。


-------------------------------------------------------
Danh sách vật liệu trang trí
Cấp độ gói：3
Giá gói：90897.52 đồng
Diện tích nhà：85.43 mét vuông
Danh sách vật liệu：
Trần nhà：Công ty trang trí tự động、Trần nhà cấp 1、Giá/m²：260 đồng。
Sơn：Nippon、Thế hệ thứ hai、Giá/m²：650 đồng。
Gạch：Prime、Mặc định、Giá/m²：102 đồng。

```

- Nhìn kết quả đầu ra có cảm giác như một công ty trang trí đưa ra báo giá. code được triển khai theo phương pháp `ifelse` sử dụng ở trên hiện đáp ứng một số chức năng của chúng tôi. Tuy nhiên, với yêu cầu phát triển kinh doanh nhanh chóng của ông chủ, nhiều gói thầu sẽ được cung cấp cho các loại căn hộ khác nhau. Sau đó, code triển khai này sẽ nhanh chóng mở rộng đến hàng nghìn dòng và ngay cả trong quá trình sửa đổi, nó sẽ khó bảo trì.

## Tái cấu trúc sử dụng Builder Pattern

Tiếp theo, chúng ta sẽ sử dụng Builder Pattern để tối ưu hóa code, cũng có thể coi đây là một phần nhỏ của việc tái cấu trúc.

Builder Pattern chủ yếu giải quyết vấn đề làm thế nào để tạo ra "một đối tượng phức tạp" trong hệ thống phần mềm, thường được tạo thành từ các phần con của nó thông qua một quá trình cụ thể; do yêu cầu thay đổi, các phần con của đối tượng phức tạp này thường phải đối mặt với sự thay đổi lớn, nhưng quá trình kết hợp chúng lại vẫn tương đối ổn định.

Ở đây, chúng ta sẽ giao việc xây dựng cho lớp `Builder`, và tạo ra các `gói trang trí` khác nhau thông qua việc sử dụng `bộ công cụ xây dựng` của chúng tôi.

### 1. Cấu Trúc Dự Án

```shell
design-demo-3-02/
├── pom.xml
└── src
    ├── main
    │   └── java
    │       └── com
    │           └── hnv99
    │               └── design
    │                   ├── Builder.java
    │                   ├── DecorationPackageMenu.java
    │                   └── IMenu.java
    └── test
        └── java
            └── com
                └── hnv99
                    └── design
                        └── ApiTest.java

```

Dự án bao gồm ba lớp cốt lõi và một lớp kiểm tra, các lớp cốt lõi này thực hiện Builder Pattern cụ thể. So với cách thực hiện sử dụng `if-else`, chúng ta có thêm hai lớp bổ sung. Các chức năng cụ thể như sau:

- `Builder`: Lớp xây dựng chịu trách nhiệm thực hiện tất cả các loại lắp ráp cụ thể.
- `DecorationPackageMenu`: Là lớp triển khai của interface `IMenu`, chủ yếu là nơi chứa các bộ nội dung trong quá trình xây dựng. Nó giống như một bộ trung gian giữa các vật liệu và người tạo.

**Được rồi**, tiếp theo chúng ta sẽ đi vào chi tiết cách thực hiện của từng lớp.

### Triển khai code

#### Định nghĩa interface

```java
public interface IMenu {

    IMenu appendCeiling(Matter matter); // Trần nhà

    IMenu appendCoat(Matter matter);    // Sơn phủ

    IMenu appendFloor(Matter matter);   // Sàn nhà

    IMenu appendTile(Matter matter);    // Gạch lát

    String getDetail();                 // Chi tiết 

}

```

- Trong lớp giao diện, các phương thức để điền các vật liệu khác nhau đã được định nghĩa; `Trần nhà`, `Sơn phủ`, `Sàn nhà`, `Gạch lát`, và cuối cùng là phương thức để lấy toàn bộ chi tiết.

#### Triển khai gói trang trí

```java
/**
 * Gói trang trí
 */
public class DecorationPackageMenu implements IMenu {

    private List<Matter> list = new ArrayList<Matter>();  // Danh sách vật liệu trang trí
    private BigDecimal price = BigDecimal.ZERO;      // Giá trị trang trí

    private BigDecimal area;  // Diện tích
    private String grade;     // Cấp độ trang trí; sang trọng kiểu Âu, nông thôn xa hoa, hiện đại tiết kiệm

    private DecorationPackageMenu() {
    }

    public DecorationPackageMenu(Double area, String grade) {
        this.area = new BigDecimal(area);
        this.grade = grade;
    }

    public IMenu appendCeiling(Matter matter) {
        list.add(matter);
        price = price.add(area.multiply(new BigDecimal("0.2")).multiply(matter.price()));
        return this;
    }

    public IMenu appendCoat(Matter matter) {
        list.add(matter);
        price = price.add(area.multiply(new BigDecimal("1.4")).multiply(matter.price()));
        return this;
    }

    public IMenu appendFloor(Matter matter) {
        list.add(matter);
        price = price.add(area.multiply(matter.price()));
        return this;
    }

    public IMenu appendTile(Matter matter) {
        list.add(matter);
        price = price.add(area.multiply(matter.price()));
        return this;
    }

    public String getDetail() {

        StringBuilder detail = new StringBuilder("\r\n-------------------------------------------------------\r\n" +
                "Danh sách trang trí" + "\r\n" +
                "Cấp độ gói：" + grade + "\r\n" +
                "Giá gói：" + price.setScale(2, BigDecimal.ROUND_HALF_UP) + " Đồng\r\n" +
                "Diện tích căn nhà：" + area.doubleValue() + " mét vuông\r\n" +
                "Danh sách vật liệu：\r\n");

        for (Matter matter: list) {
            detail.append(matter.scene()).append("：").append(matter.brand()).append("、").append(matter.model()).append("、Giá mỗi mét vuông：").append(matter.price()).append(" Đồng。\n");
        }

        return detail.toString();
    }

}

```

- Trong việc triển khai của gói trang trí, mỗi phương thức đều trả về `this`, điều này giúp cho việc liên tục điền các vật liệu trở nên rất thuận tiện.
- Đồng thời, trong quá trình điền các vật liệu, giá trị của từng loại sẽ được tính dựa trên diện tích, trần và sơn được tính dựa trên diện tích nhân với hệ số cố định.
- Cuối cùng, cũng cung cấp một phương thức thống nhất để lấy chi tiết danh sách vật liệu trang trí.

#### Phương thức Builder

```java
  
public class Builder {  
  
    public IMenu levelOne(Double area) {  
        return new DecorationPackageMenu(area, "Cao cấp Châu Âu")  
                .appendCeiling(new LevelTwoCeiling())    // Trần nhà, trần cấp 2  
                .appendCoat(new DuluxCoat())             // Sơn, Dulux  
                .appendFloor(new InovarFloor());         // Sàn nhà, Sàn Inovar  
    }  
  
    public IMenu levelTwo(Double area){  
        return new DecorationPackageMenu(area, "Nông thôn nhẹ nhàng")  
                .appendCeiling(new LevelTwoCeiling())   // Trần nhà, trần cấp 2  
                .appendCoat(new NipponCoat())           // Sơn, Nippon  
                .appendTile(new MarcoPoloTile());       // Gạch lát, Marco Polo  
    }  
  
    public IMenu levelThree(Double area){  
        return new DecorationPackageMenu(area, "Hiện đại đơn giản")  
                .appendCeiling(new LevelOneCeiling())   // Trần nhà, trần cấp 1  
                .appendCoat(new NipponCoat())           // Sơn, Nippon  
                .appendTile(new PrimeTile());           // Gạch lát, Prime  
    }  
  
}
```

- Việc sử dụng của Builder đã trở nên rất dễ dàng, cách xây dựng thống nhất, điền các vật liệu khác nhau để tạo ra các phong cách trang trí khác nhau: `Sang trọng Châu Âu`, `Nông thôn nhẹ nhàng`, `Hiện đại đơn giản`, nếu trong tương lai kinh doanh mở rộng cũng có thể cấu hình phần này từ cơ sở dữ liệu để tự động tạo ra. Tuy nhiên, ý tưởng tổng thể vẫn có thể sử dụng mô hình Builder để xây dựng.

### Kiểm thử

**Unit Test**

```java
public class ApiTest {  
  
    @Test  
    public void test_Builder(){  
        Builder builder = new Builder();  
  
        // Cao cấp Châu Âu  
        System.out.println(builder.levelOne(132.52D).getDetail());  
  
        // Nông thôn nhẹ nhàng  
        System.out.println(builder.levelTwo(98.25D).getDetail());  
  
        // Hiện đại đơn giản  
        System.out.println(builder.levelThree(85.43D).getDetail());  
    }  
}
```

**Kết quả**

```shell
-------------------------------------------------------
Danh sách trang trí
Cấp độ gói：Cao cấp Châu Âu
Giá gói：198064.39 Đồng
Diện tích căn nhà：132.52 mét vuông
Danh sách vật liệu：
Trần nhà：Công ty trang trí tự động、Trần nhà cấp 2、Giá mỗi mét vuông：850 Đồng。
Sơn：Dulux、Thế hệ thứ hai、Giá mỗi mét vuông：719 Đồng。
Sàn：Inovar、Thế hệ thứ hai、Giá mỗi mét vuông：318 Đồng。


-------------------------------------------------------
Danh sách trang trí
Cấp độ gói：Nông thôn nhẹ nhàng
Giá gói：119865.00 Đồng
Diện tích căn nhà：98.25 mét vuông
Danh sách vật liệu：
Trần nhà：Công ty trang trí tự động、Trần nhà cấp 2、Giá mỗi mét vuông：850 Đồng。
Sơn：Nippon、Thế hệ thứ hai、Giá mỗi mét vuông：650 Đồng。
Gạch lát：Marco Polo、Mặc định、Giá mỗi mét vuông：140 Đồng。


-------------------------------------------------------
Danh sách trang trí
Cấp độ gói：Hiện đại đơn giản
Giá gói：90897.52 Đồng
Diện tích căn nhà：85.43 mét vuông
Danh sách vật liệu：
Trần nhà：Công ty trang trí tự động、Trần nhà cấp 1、Giá mỗi mét vuông：260 Đồng。
Sơn：Nippon、Thế hệ thứ hai、Giá mỗi mét vuông：650 Đồng。
Gạch：Prime、Mặc định、Giá mỗi mét vuông：102 Đồng。

```

- Kết quả kiểm thử vẫn giống nhau, cách gọi cũng tương tự. Tuy nhiên, cấu trúc code hiện tại cho phép bạn mở rộng và phát triển dịch vụ một cách dễ dàng và có trật tự. Thay vì đặt tất cả code vào câu lệnh `if else` như trước đây.

## Tổng kết

- Thông qua việc sử dụng mẫu Builder như trên, bạn có thể hiểu được một chút về cách làm việc của nó. Khi nào thì chúng ta nên chọn một mẫu thiết kế như vậy? Khi: `một số vật liệu cơ bản không thay đổi, nhưng cách kết hợp chúng thay đổi thường xuyên`, bạn có thể chọn một mẫu thiết kế như vậy để xây dựng code của mình.
- Mẫu thiết kế này đáp ứng nguyên tắc đơn trách nhiệm duy nhất và công nghệ có thể tái sử dụng, Builder độc lập, dễ mở rộng, dễ kiểm soát các rủi ro chi tiết. Tuy nhiên, đồng thời, khi có nhiều vật liệu đặc biệt và nhiều kết hợp, việc mở rộng liên tục của các lớp cũng có thể gây ra vấn đề khó bảo trì. Nhưng cấu trúc thiết kế này có thể trừu tượng hóa nội dung lặp lại vào cơ sở dữ liệu, được cấu hình theo nhu cầu. Điều này giúp giảm bớt code lặp lại trong dự án.
- Mẫu thiết kế mang lại cho bạn một số ý tưởng, nhưng trong quá trình phát triển hàng ngày, làm sao để trích xuất một module xây dựng phù hợp với ý tưởng này là khá khó khăn. Điều này đòi hỏi một số trải nghiệm và phải làm việc trên nhiều dự án để có được kinh nghiệm này. Đôi khi code của bạn viết tốt, thường là do áp lực, do sự phức tạp của doanh nghiệp và thách thức không ngừng!
