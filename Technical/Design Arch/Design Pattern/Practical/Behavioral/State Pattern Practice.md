---
title: State Pattern Practice
tags:
  - design-pattern
categories: 
date created: 2024-04-01
date modified: 2024-04-01
---

# State Pattern Practice: Mô phỏng các hoạt động hệ thống tiếp thị, xem xét quy trình trạng thái và đưa ra các kịch bản trực tuyến

## Giới thiệu

`Ba điểm quan trọng khi viết code`

Nếu bạn tưởng tượng việc viết code như việc trang trí nội thất trong nhà, bạn chắc chắn sẽ nghĩ đến việc cần có một bản thiết kế tốt nhất là phòng đẹp và thông thoáng, đồ nội thất mua về tốt nhất là có chất lượng đảm bảo từ thương hiệu, sau đó là phải phù hợp về kích thước, không thể đặt đồ xong nhìn thấy lạ lẫm. Vì vậy, quá trình này trừu tượng thành việc viết code cần có ba điểm chính; `Kiến trúc` (bố cục của phòng), `Tên gọi` (thương hiệu và chất lượng), `Chú thích` (hướng dẫn về kích thước), chỉ khi ba điểm này được thực hiện tốt thì mới có thể tạo ra một **ngôi nhà** đẹp mắt.

`Việc viết code là dễ dàng khi bắt đầu nhưng khó khăn khi thu thập`

Bạn đã viết bao nhiêu code trong quá trình học? Bạn có thể viết bao nhiêu code trong một năm làm việc? Bạn đã tự học viết bao nhiêu code khi về nhà? Nền tảng kỹ thuật của phẩm chất cá nhân được xây dựng từng viên gạch một, và bạn viết càng nhiều và rộng hơn, nền tảng sẽ càng vững chắc. Khi nền tảng đã vững chắc, việc xây dựng lên tầng trên trở nên dễ dàng hơn, cũng như làm cho quá trình xây dựng trở nên thuận lợi hơn. Thường thì việc khó nhất là vượt qua từng giai đoạn một, việc vượt qua giống như việc đập vỡ lớp vỏ, cũng giống như việc làm cho nền tảng cứng cáp, trong thời gian ngắn không thể thấy được kết quả, cũng không thể nhìn thấy chiều cao. Nhưng sau này, ai có thể tiến bước mạnh mẽ, phụ thuộc vào việc lắng nghe và tích lũy một cách im lặng.

`Sự quan trọng của việc kế thừa công nghệ`

Có thể là vì nhịp sống hiện tại quá nhanh, một yêu cầu được đưa ra và muốn triển khai ngay trong ngày (`Yêu cầu này đơn giản, tôi không quan tâm cách triển khai, vào ngày mai triển khai!`), dẫn đến tình trạng lo lắng, hối hả, mệt mỏi và sụp đổ của mọi người trong nhóm, cuối cùng là sự thay đổi liên tục của nhân sự, dự án đã chuyển giao N lần trong quá trình này, tài liệu không đầy đủ, code nguồn hỗn độn, phức tạp, bất kỳ ai tiếp quản sau cũng chỉ có thể sửa chữa, giống như một căn nhà dở dang. Dự án không có sự truyền thụ, không có tích lũy, rất khó đi theo sự phát triển của kinh doanh. Cuối cùng! Nền tảng không vững chắc, một chỗ toàn là rối rắm.

## Môi trường phát triển

1. JDK 1.8
2. Idea + Maven
3. Code: [vanhung4499/practical-java-design](https://github.com/vanhung4499/practical-java-design)  

| Dự án             | Mô tả                                                                       |
| ----------------- | --------------------------------------------------------------------------- |
| demo-design-19-00 | Dự án mô phỏng; Dịch vụ hoạt động tiếp thị mô phỏng (truy vấn, duyệt)       |
| demo-design-19-01 | Thực hiện nhu cầu kinh doanh bằng một đống code                               |
| demo-design-19-02 | Tối ưu và cải thiện code thông qua mẫu thiết kế, tạo ra sự so sánh để học hỏi |

## Giới thiệu về State Pattern

![image.png](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20240401162424.png)

Mô hình trạng thái mô tả nhiều trạng thái khác nhau của một hành vi, ví dụ, trạng thái của một trang web, nội dung hiển thị có sự khác biệt nhỏ giữa khi bạn đăng nhập và khi bạn không đăng nhập (`Không đăng nhập không thể hiển thị thông tin cá nhân`), và sự chuyển đổi giữa `đăng nhập` và `không đăng nhập` làm thay đổi toàn bộ hành vi.

Ít nhất là các bạn sinh ra trong thập niên 80, 90 cơ bản đã từng sử dụng máy nghe radio casset này (`có thể không đẹp như vậy`), nó có một hàng nút ở phía trên, khi đặt vào đĩa casset, bạn có thể phát nội dung trên đĩa casset (`nghe đề thi tiếng Anh`), và một số nút là đối xứng, chỉ có thể nhấn một nút khác khi ở trong một trạng thái nhất định (`Điều này cũng là một điểm quan trọng trong thiết kế mẫu`).

## Mô phỏng trường hợp thực tếs

**Trong trường hợp này, chúng tôi mô phỏng quy trình chuyển đổi trạng thái duyệt hoạt động tiếp thị (một hoạt động cần được duyệt qua nhiều cấp độ trước khi được triển khai)**

Các nút của quy trình của chúng tôi bao gồm các điều kiện liên kết giữa các trạng thái, ví dụ: chỉ có thể chuyển từ trạng thái duyệt qua để triển khai hoạt động, không thể chuyển từ trạng thái chỉnh sửa trực tiếp sang trạng thái hoạt động, và các biến đổi trạng thái này chính là xử lý các tình huống chúng tôi cần hoàn thành.

Hầu hết các lập trình viên đã từng phát triển các trường hợp kinh doanh tương tự, nơi hoạt động hoặc một số cấu hình cần được duyệt trước khi được công bố, và quá trình duyệt này thường được thiết lập với nhiều cấp độ kiểm soát để đảm bảo một hoạt động có thể được triển khai một cách an toàn, tránh gây tổn thất tài sản.

Tất nhiên, đôi khi chúng ta cũng sử dụng một số cấu hình luồng duyệt, điều này cũng rất tiện lợi để phát triển các quy trình tương tự, cũng có thể đặt người phê duyệt cho một nút cụ thể trong cấu hình. Nhưng điều này không phải là điểm chính chúng tôi muốn thể hiện, trong trường hợp này chúng tôi chủ yếu mô phỏng và học hỏi về việc kiểm soát duyệt của nhiều nút trạng thái cho một hoạt động.

### Dự án mô phỏng tình huống

```java
design-demo-19-00
├── pom.xml
└── src
    └── main
        └── java
            └── com
                └── hnv99
                    └── design
                        ├── ActivityInfo.java
                        ├── ActivityService.java
                        └── Status.java
```

- Trong dự án mô phỏng này, chúng tôi cung cấp ba lớp, bao gồm; enum trạng thái (`Status`), đối tượng hoạt động (`ActivityInfo`), và dịch vụ hoạt động (`ActivityService`), ba lớp dịch vụ.
- Tiếp theo, chúng tôi sẽ giới thiệu nội dung của từng lớp.

### Triển khai code

#### Thông tin hoạt động cơ bản

```java
public class ActivityInfo {

    private String activityId;    // ID hoạt động
    private String activityName;  // Tên hoạt động
    private Enum<Status> status;  // Trạng thái hoạt động
    private Date beginTime;       // Thời gian bắt đầu
    private Date endTime;         // Thời gian kết thúc
   
    // ...get/set
}  
```

- Một số thông tin cơ bản của hoạt động; ID hoạt động, tên hoạt động, trạng thái hoạt động, thời gian bắt đầu, thời gian kết thúc.

#### Enum trạng thái hoạt động

```java
public enum Status {

    // 1 Tạo chỉnh sửa, 2 Chờ xác nhận, 3 Đã duyệt (quét công việc thành hoạt động), 4 Từ chối xác nhận (có thể rút xét về trạng thái chỉnh sửa), 5 Trong quá trình hoạt động, 6 Đóng, 7 Mở (quét công việc thành hoạt động)
    Editing, Check, Pass, Refuse, Doing, Close, Open

}
```

- Enum của hoạt động; 1 Tạo chỉnh sửa, 2 Chờ xác nhận, 3 Đã duyệt (quét công việc thành hoạt động), 4 Từ chối xác nhận (có thể rút xét về trạng thái chỉnh sửa), 5 Trong quá trình hoạt động, 6 Đóng, 7 Mở (quét công việc thành hoạt động)

#### Activity Service

```java

public class ActivityService {

    private static Map<String, Enum<Status>> statusMap = new ConcurrentHashMap<>();

    public static void init(String activityId, Enum<Status> status) {
        // Mô phỏng truy vấn thông tin hoạt động
        ActivityInfo activityInfo = new ActivityInfo();
        activityInfo.setActivityId(activityId);
        activityInfo.setActivityName("Chương trình thưởng thức sáng sớm và học tập");
        activityInfo.setStatus(status);
        activityInfo.setBeginTime(new Date());
        activityInfo.setEndTime(new Date());
        statusMap.put(activityId, status);
    }

    /**
     * Truy vấn thông tin hoạt động
     *
     * @param activityId ID hoạt động
     * @return Kết quả truy vấn
     */
    public static ActivityInfo queryActivityInfo(String activityId) {
        // Mô phỏng truy vấn thông tin hoạt động
        ActivityInfo activityInfo = new ActivityInfo();
        activityInfo.setActivityId(activityId);
        activityInfo.setActivityName("Chương trình thưởng thức sáng sớm và học tập");
        activityInfo.setStatus(statusMap.get(activityId));
        activityInfo.setBeginTime(new Date());
        activityInfo.setEndTime(new Date());
        return activityInfo;
    }

    /**
     * Truy vấn trạng thái hoạt động
     *
     * @param activityId ID hoạt động
     * @return Kết quả truy vấn
     */
    public static Enum<Status> queryActivityStatus(String activityId) {
        return statusMap.get(activityId);
    }

    /**
     * Thực hiện thay đổi trạng thái
     *
     * @param activityId   ID hoạt động
     * @param beforeStatus Trạng thái trước khi thay đổi
     * @param afterStatus  Trạng thái sau khi thay đổi
     */
    public static synchronized void execStatus(String activityId, Enum<Status> beforeStatus, Enum<Status> afterStatus) {
        if (!beforeStatus.equals(statusMap.get(activityId))) return;
        statusMap.put(activityId, afterStatus);
    }

}
```

- Trong lớp tĩnh này cung cấp các giao diện truy vấn và thay đổi trạng thái của hoạt động; `queryActivityInfo`, `queryActivityStatus`, `execStatus`.
- Đồng thời sử dụng cấu trúc Map để ghi lại thông tin ID hoạt động và thay đổi trạng thái, cùng với phương thức init để khởi tạo dữ liệu hoạt động. Trong thực tế, thông tin như vậy thường được lấy từ `cơ sở dữ liệu` hoặc `Redis`.

## Triển khai code trực tiếp

`Ở đây chúng ta sẽ sử dụng cách thô sơ nhất để triển khai chức năng`

Đối với các biến đổi trạng thái đa dạng như vậy, điều mà chúng ta nghĩ ngay đến là sử dụng `if` và `else` để xử lý. Mỗi trạng thái có thể chuyển đến trạng thái tiếp theo làm thế nào, đều có thể sử dụng `if` lồng nhau để thực hiện.

### Cấu trúc dự án

```java
design-demo-19-01
├── pom.xml
└── src
    ├── main
    │   └── java
    │       └── com
    │           └── hnv99
    │               └── design
    │                   ├── ActivityExecStatusController.java
    │                   └── Result.java
    └── test
        └── java
            └── com
                └── hnv99
                    └── design
                        └── ApiTest.java

```

- Cấu trúc dự án triển khai khá đơn giản, chỉ bao gồm hai lớp; `ActivityExecStatusController`, `Result`, một là xử lý trạng thái quá trình, hai là đối tượng trả về.

### Triển khai code

```java
public class ActivityExecStatusController {

    /**
     * Thay đổi trạng thái hoạt động
     * 1. Chỉnh sửa -> Kiểm tra, Đóng
     * 2. Đã duyệt -> Từ chối, Đóng, Đang thực hiện
     * 3. Từ chối -> Rút lại, Đóng
     * 4. Đang thực hiện -> Đóng
     * 5. Đã đóng -> Mở
     * 6. Đang mở -> Đóng
     *
     * @param activityId   ID hoạt động
     * @param beforeStatus Trạng thái trước khi thay đổi
     * @param afterStatus  Trạng thái sau khi thay đổi
     * @return Kết quả
     */
    public Result execStatus(String activityId, Enum<Status> beforeStatus, Enum<Status> afterStatus) {

        // 1. Chỉnh sửa -> Kiểm tra, Đóng
        if (Status.Editing.equals(beforeStatus)) {
            if (Status.Check.equals(afterStatus) || Status.Close.equals(afterStatus)) {
                ActivityService.execStatus(activityId, beforeStatus, afterStatus);
                return new Result("0000", "Thay đổi trạng thái thành công");
            } else {
                return new Result("0001", "Từ chối thay đổi trạng thái");
            }
        }

        // 2. Đã duyệt -> Từ chối, Đóng, Đang thực hiện
        if (Status.Pass.equals(beforeStatus)) {
            if (Status.Refuse.equals(afterStatus) || Status.Doing.equals(afterStatus) || Status.Close.equals(afterStatus)) {
                ActivityService.execStatus(activityId, beforeStatus, afterStatus);
                return new Result("0000", "Thay đổi trạng thái thành công");
            } else {
                return new Result("0001", "Từ chối thay đổi trạng thái");
            }
        }

        // 3. Từ chối -> Rút lại, Đóng
        if (Status.Refuse.equals(beforeStatus)) {
            if (Status.Editing.equals(afterStatus) || Status.Close.equals(afterStatus)) {
                ActivityService.execStatus(activityId, beforeStatus, afterStatus);
                return new Result("0000", "Thay đổi trạng thái thành công");
            } else {
                return new Result("0001", "Từ chối thay đổi trạng thái");
            }
        }

        // 4. Đang thực hiện -> Đóng
        if (Status.Doing.equals(beforeStatus)) {
            if (Status.Close.equals(afterStatus)) {
                ActivityService.execStatus(activityId, beforeStatus, afterStatus);
                return new Result("0000", "Thay đổi trạng thái thành công");
            } else {
                return new Result("0001", "Từ chối thay đổi trạng thái");
            }
        }

        // 5. Đã đóng -> Mở
        if (Status.Close.equals(beforeStatus)) {
            if (Status.Open.equals(afterStatus)) {
                ActivityService.execStatus(activityId, beforeStatus, afterStatus);
                return new Result("0000", "Thay đổi trạng thái thành công");
            } else {
                return new Result("0001", "Từ chối thay đổi trạng thái");
            }
        }

        // 6. Đang mở -> Đóng
        if (Status.Open.equals(beforeStatus)) {
            if (Status.Close.equals(afterStatus)) {
                ActivityService.execStatus(activityId, beforeStatus, afterStatus);
                return new Result("0000", "Thay đổi trạng thái thành công");
            } else {
                return new Result("0001", "Từ chối thay đổi trạng thái");
            }
        }

        return new Result("0001", "Không thể xử lý thay đổi trạng thái hoạt động");

    }

}

```

- Ở đây, chúng ta chỉ cần xem cấu trúc của code. Từ trên xuống dưới là một chuỗi `if else` hoàn chỉnh, cơ bản đây cũng là cách phát triển của hầu hết các lập trình viên mới.
- Cách phát triển dựa trên quá trình này, với những yêu cầu không cần thay đổi code và không cần lặp lại lần hai, vẫn có thể sử dụng được (`nhưng thực sự rất ít khi không cần lặp lại`). Và với sự thay đổi về trạng thái và yêu cầu, việc bảo trì sẽ trở nên ngày càng khó khăn hơn, người đọc code sau này cũng không dễ hiểu và rất dễ bị làm lố. `Vấn đề trở nên rối rắm từ những điểm nhỏ nhặt`

### Kiểm thử

#### Viết lớp kiểm tra

```java
@Test
public void test() {
    // Khởi tạo dữ liệu
    String activityId = "100001";
    ActivityService.init(activityId, Status.Editing);  

    ActivityExecStatusController activityExecStatusController = new ActivityExecStatusController();
    Result resultRefuse = activityExecStatusController.execStatus(activityId, Status.Editing, Status.Refuse); 
    logger.info("Kết quả kiểm tra (Từ Chỉnh sửa đến Từ chối kiểm tra): {}", JSON.toJSONString(resultRefuse));                           

    Result resultCheck = activityExecStatusController.execStatus(activityId, Status.Editing, Status.Check);
    logger.info("Kết quả kiểm tra (Từ Chỉnh sửa đến Gửi kiểm tra): {}", JSON.toJSONString(resultCheck));
}
```

- Code kiểm tra của chúng ta bao gồm hai chức năng xác minh, một là từ `Chỉnh sửa` đến `Từ chối kiểm tra`, hai là từ `Chỉnh sửa` đến `Gửi kiểm tra`.
- Bởi vì từ luồng quy trình của chúng ta có thể thấy, hoạt động đang chỉnh sửa không thể trực tiếp chuyển đến `Từ chối kiểm tra`, vẫn cần `Gửi` trước.

#### Kết quả kiểm tra

```java
2024-04-01 20:28:59.837	INFO	main		(ApiTest.java:19)	|	Kết quả kiểm tra (Từ Chỉnh sửa đến Từ chối kiểm tra): {"code":"0001","info":"Từ chối thay đổi trạng thái"}
2024-04-01 20:28:59.839	INFO	main		(ApiTest.java:22)	|	Kết quả kiểm tra (Từ Chỉnh sửa đến Gửi kiểm tra): {"code":"0000","info":"Thay đổi trạng thái thành công"}

Process finished with exit code 0
```

- Từ kết quả kiểm tra và quá trình luồng trạng thái của chúng ta có thể thấy, đó là đáng giá kỳ vọng từ kết quả kiểm tra. Ngoại trừ việc không dễ bảo trì, quy trình phát triển như vậy vẫn khá nhanh chóng, nhưng không khuyến khích làm như vậy!

## Tái cấu trúc theo State Pattern

`Tiếp theo, sử dụng State Pattern để tối ưu hóa code, có thể coi đây là một lần tái cấu trúc nhỏ. `

Trọng tâm của việc tái cấu trúc thường là xử lý `ifelse` và để xử lý `ifelse` về cơ bản yêu cầu **interface** và **abstract class**, đồng thời cũng cần định hình lại cấu trúc code.

### Cấu trúc dự án

```java
design-demo-19-02
├── pom.xml
└── src
    ├── main
    │   └── java
    │       └── com
    │           └── hnv99
    │               └── design
    │                   ├── Result.java
    │                   ├── State.java
    │                   ├── StateHandler.java
    │                   └── event
    │                       ├── CheckState.java
    │                       ├── CloseState.java
    │                       ├── DoingState.java
    │                       ├── EditingState.java
    │                       ├── OpenState.java
    │                       ├── PassState.java
    │                       └── RefuseState.java
    └── test
        └── java
            └── com
                └── hnv99
                    └── design
                        └── ApiTest.java

```

**Cấu trúc mô hình của trạng thái**

![Cấu trúc mô hình của trạng thái](https://raw.githubusercontent.com/vanhung4499/images/master/snap/itstack-demo-design-19-04.png)

- Trên đây là cấu trúc toàn bộ dự án của mô hình trạng thái. State là một lớp trừu tượng, xác định các giao diện hoạt động khác nhau (`kiểm tra, duyệt, từ chối, v.v.`).
- Các trạng thái khác nhau màu sắc ở bên phải giữa mô phỏng các màu sắc trong mô phỏng kịch bản của chúng tôi, là thực hiện các hoạt động khác nhau của quy trình trạng thái. Một điểm quan trọng trong việc triển khai ở đây là từ mỗi trạng thái sang trạng thái tiếp theo, được phân phối cho từng phương pháp triển khai để kiểm soát, do đó không cần sử dụng câu lệnh `if`.
- Cuối cùng là `StateHandler` xử lý thống nhất quy trình trạng thái, cung cấp các giao diện dịch vụ Map cho các cuộc gọi dịch vụ trạng thái khác nhau, do đó tránh được việc sử dụng `if` để kiểm tra quy trình chuyển đổi trạng thái.

### Triển khai code

#### Định nghĩa lớp trạng thái trừu tượng

```java
public abstract class State {

    /**
     * Kiểm tra hoạt động
     *
     * @param activityId    ID hoạt động
     * @param currentStatus Trạng thái hiện tại
     * @return Kết quả thực hiện
     */
    public abstract Result arraignment(String activityId, Enum<Status> currentStatus);

    /**
     * Duyệt
     *
     * @param activityId    ID hoạt động
     * @param currentStatus Trạng thái hiện tại
     * @return Kết quả thực hiện
     */
    public abstract Result checkPass(String activityId, Enum<Status> currentStatus);

    /**
     * Từ chối
     *
     * @param activityId    ID hoạt động
     * @param currentStatus Trạng thái hiện tại
     * @return Kết quả thực hiện
     */
    public abstract Result checkRefuse(String activityId, Enum<Status> currentStatus);

    /**
     * Thu hồi
     *
     * @param activityId    ID hoạt động
     * @param currentStatus Trạng thái hiện tại
     * @return Kết quả thực hiện
     */
    public abstract Result checkRevoke(String activityId, Enum<Status> currentStatus);

    /**
     * Đóng
     *
     * @param activityId    ID hoạt động
     * @param currentStatus Trạng thái hiện tại
     * @return Kết quả thực hiện
     */
    public abstract Result close(String activityId, Enum<Status> currentStatus);

    /**
     * Mở
     *
     * @param activityId    ID hoạt động
     * @param currentStatus Trạng thái hiện tại
     * @return Kết quả thực hiện
     */
    public abstract Result open(String activityId, Enum<Status> currentStatus);

    /**
     * Thực hiện
     *
     * @param activityId    ID hoạt động
     * @param currentStatus Trạng thái hiện tại
     * @return Kết quả thực hiện
     */
    public abstract Result doing(String activityId, Enum<Status> currentStatus);

}
```

- Trong lớp này, cung cấp các giao diện dịch vụ cho từng quy trình chuyển đổi trạng thái, ví dụ; Kiểm tra hoạt động, duyệt, từ chối, thu hồi, đóng, mở và thực hiện, tổng cộng 7 phương thức.
- Trong các phương thức này, tất cả các đối số đầu vào đều giống nhau, activityId (`ID hoạt động`), currentStatus (`Trạng thái hiện tại`), chỉ có cách triển khai cụ thể của chúng là khác nhau.

#### Triển khai một số quy trình chuyển đổi trạng thái

**Chỉnh sửa**

```java
public class EditingState extends State {

    public Result arraignment(String activityId, Enum<Status> currentStatus) {
        ActivityService.execStatus(activityId, currentStatus, Status.Check);
        return new Result("0000", "Hoạt động đã được đề nghị thành công");
    }

    public Result checkPass(String activityId, Enum<Status> currentStatus) {
        return new Result("0001", "Không thể duyệt trong quá trình chỉnh sửa");
    }

    public Result checkRefuse(String activityId, Enum<Status> currentStatus) {
        return new Result("0001", "Không thể từ chối trong quá trình chỉnh sửa");
    }

    @Override
    public Result checkRevoke(String activityId, Enum<Status> currentStatus) {
        return new Result("0001", "Không thể thu hồi kiểm tra trong quá trình chỉnh sửa");
    }

    public Result close(String activityId, Enum<Status> currentStatus) {
        ActivityService.execStatus(activityId, currentStatus, Status.Close);
        return new Result("0000", "Hoạt động đã đóng thành công");
    }

    public Result open(String activityId, Enum<Status> currentStatus) {
        return new Result("0001", "Không thể mở hoạt động khi không được đóng");
    }

    public Result doing(String activityId, Enum<Status> currentStatus) {
        return new Result("0001", "Hoạt động không thể thực hiện trong quá trình chỉnh sửa");
    }

}
```

**Kiểm tra**

```java
public class CheckState extends State {

    public Result arraignment(String activityId, Enum<Status> currentStatus) {
        return new Result("0001", "Trạng thái chờ xem không thể gửi đề xuất lại");
    }

    public Result checkPass(String activityId, Enum<Status> currentStatus) {
        ActivityService.execStatus(activityId, currentStatus, Status.Pass);
        return new Result("0000", "Hoạt động đã được duyệt");
    }

    public Result checkRefuse(String activityId, Enum<Status> currentStatus) {
        ActivityService.execStatus(activityId, currentStatus, Status.Refuse);
        return new Result("0000", "Hoạt động đã bị từ chối");
    }

    @Override
    public Result checkRevoke(String activityId, Enum<Status> currentStatus) {
        ActivityService.execStatus(activityId, currentStatus, Status.Editing);
        return new Result("0000", "Hoạt động đã được thu hồi và trở lại chỉnh sửa");
    }

    public Result close(String activityId, Enum<Status> currentStatus) {
        ActivityService.execStatus(activityId, currentStatus, Status.Close);
        return new Result("0000", "Hoạt động đã được đóng");
    }

    public Result open(String activityId, Enum<Status> currentStatus) {
        return new Result("0001", "Không thể mở hoạt động khi không được đóng");
    }

    public Result doing(String activityId, Enum<Status> currentStatus) {
        return new Result("0001", "Hoạt động không thể thực hiện trong quá trình chờ xem");
    }

}
```

- Ở đây cung cấp nội dung của hai lớp cụ thể, trạng thái chỉnh sửa và trạng thái chờ xem.
- Ví dụ, trong hai lớp này, phương thức `checkRefuse` có sự thực hiện khác nhau trong mỗi lớp, có nghĩa là các thao tác chuyển đổi tiếp theo có thể thực hiện được trong mỗi phương thức cụ thể.
- Các lớp khác cũng tương tự, do đó, không cần trình bày cụ thể ở đây. Bạn có thể học và hiểu thông qua code nguồn.

#### Dịch vụ xử lý trạng thái

```java
public class StateHandler {

    private Map<Enum<Status>, State> stateMap = new ConcurrentHashMap<Enum<Status>, State>();

    public StateHandler() {
        stateMap.put(Status.Check, new CheckState());     // Đang chờ xem xét
        stateMap.put(Status.Close, new CloseState());     // Đã đóng
        stateMap.put(Status.Doing, new DoingState());     // Đang thực hiện
        stateMap.put(Status.Editing, new EditingState()); // Đang chỉnh sửa
        stateMap.put(Status.Open, new OpenState());       // Đã mở
        stateMap.put(Status.Pass, new PassState());       // Đã phê duyệt
        stateMap.put(Status.Refuse, new RefuseState());   // Đã từ chối
    }

    public Result arraignment(String activityId, Enum<Status> currentStatus) {
        return stateMap.get(currentStatus).arraignment(activityId, currentStatus);
    }

    public Result checkPass(String activityId, Enum<Status> currentStatus) {
        return stateMap.get(currentStatus).checkPass(activityId, currentStatus);
    }

    public Result checkRefuse(String activityId, Enum<Status> currentStatus) {
        return stateMap.get(currentStatus).checkRefuse(activityId, currentStatus);
    }

    public Result checkRevoke(String activityId, Enum<Status> currentStatus) {
        return stateMap.get(currentStatus).checkRevoke(activityId, currentStatus);
    }

    public Result close(String activityId, Enum<Status> currentStatus) {
        return stateMap.get(currentStatus).close(activityId, currentStatus);
    }

    public Result open(String activityId, Enum<Status> currentStatus) {
        return stateMap.get(currentStatus).open(activityId, currentStatus);
    }

    public Result doing(String activityId, Enum<Status> currentStatus) {
        return stateMap.get(currentStatus).doing(activityId, currentStatus);
    }
    
}

```

- Đây là trung tâm kiểm soát trạng thái thống nhất, có thể thấy trong hàm tạo đã cung cấp liên kết cụ thể giữa tất cả các trạng thái và triển khai của chúng, được đặt vào cấu trúc dữ liệu Map.
- Đồng thời, nó cung cấp các lớp giao diện với tên khác nhau, giúp bên gọi bên ngoài có thể sử dụng các giao diện chức năng này một cách dễ dàng hơn, mà không cần phải giống như trong ví dụ `design-demo-19-01` vẫn phải truyền hai trạng thái để kiểm tra.

### Kiểm thử

#### Viết lớp kiểm thử (Editing2Arraignment)

```java
@Test
public void testEditing2Arraignment() {
    String activityId = "100001";
    ActivityService.init(activityId, Status.Editing);
    StateHandler stateHandler = new StateHandler();
    Result result = stateHandler.arraignment(activityId, Status.Editing);
    logger.info("Kết quả kiểm thử (Chỉnh sửa sang Đề xuất): {}", JSON.toJSONString(result));
    logger.info("Thông tin hoạt động: {} Trạng thái: {}", JSON.toJSONString(ActivityService.queryActivityInfo(activityId)), JSON.toJSONString(ActivityService.queryActivityInfo(activityId).getStatus()));
}
```

**Kết quả kiểm thử**

```java
2024-04-01 20:59:37.298	INFO	main		(ApiTest.java:17)	|	Kết quả kiểm thử (Chỉnh sửa sang Đề xuất): {"code":"0000","info":"Hoạt động đã được đề nghị thành công"}
2024-04-01 20:59:37.311	INFO	main		(ApiTest.java:18)	|	Thông tin hoạt động: {"activityId":"100001","activityName":"Chương trình thưởng thức sáng sớm và học tập","beginTime":1711979977303,"endTime":1711979977303,"status":"Check"} Trạng thái: "Check"

```

- Kiểm thử việc chuyển từ Chỉnh sửa sang Đề xuất của hoạt động.

#### Viết lớp kiểm thử (Editing2Open)

```java
@Test
public void testEditing2Open() {
    String activityId = "100001";
    ActivityService.init(activityId, Status.Editing);
    StateHandler stateHandler = new StateHandler();
    Result result = stateHandler.open(activityId, Status.Editing);
    logger.info("Kết quả kiểm thử (Chỉnh sửa sang Mở): {}", JSON.toJSONString(result));
    logger.info("Thông tin hoạt động: {} Trạng thái: {}", JSON.toJSONString(ActivityService.queryActivityInfo(activityId)), JSON.toJSONString(ActivityService.queryActivityInfo(activityId).getStatus()));
}
```

**Kết quả kiểm thử**

```java
2024-04-01 21:00:32.304	INFO	main		(ApiTest.java:27)	|	Kết quả kiểm thử (Chỉnh sửa sang Mở): {"code":"0001","info":"Không thể mở hoạt động khi không được đóng"}
2024-04-01 21:00:32.316	INFO	main		(ApiTest.java:28)	|	Thông tin hoạt động: {"activityId":"100001","activityName":"Chương trình thưởng thức sáng sớm và học tập","beginTime":1711980032310,"endTime":1711980032310,"status":"Editing"} Trạng thái: "Editing"

```

- Kiểm thử việc chuyển từ Chỉnh sửa sang Mở của hoạt động.

#### 3.3 Viết lớp kiểm thử (Refuse2Doing)

```java
@Test
public void testRefuse2Doing() {
    String activityId = "100001";
    ActivityService.init(activityId, Status.Refuse);
    StateHandler stateHandler = new StateHandler();
    Result result = stateHandler.doing(activityId, Status.Refuse);
    logger.info("Kết quả kiểm thử (Từ từ chối sang Đang thực hiện): {}", JSON.toJSONString(result));
    logger.info("Thông tin hoạt động: {} Trạng thái: {}", JSON.toJSONString(ActivityService.queryActivityInfo(activityId)), JSON.toJSONString(ActivityService.queryActivityInfo(activityId).getStatus()));
}
```

**Kết quả kiểm thử**

```java
2024-04-01 21:01:54.987	INFO	main		(ApiTest.java:47)	|	Kết quả kiểm thử (Từ từ chối sang Đang thực hiện): {"code":"0001","info":"Không thể thực hiện hoạt động khi đã từ chối kiểm tra"}
2024-04-01 21:01:54.997	INFO	main		(ApiTest.java:48)	|	Thông tin hoạt động: {"activityId":"100001","activityName":"Chương trình thưởng thức sáng sớm và học tập","beginTime":1711980114991,"endTime":1711980114991,"status":"Refuse"} Trạng thái: "Refuse"
```

- Kiểm thử quá trình chuyển từ Từ từ chối sang Đang thực hiện của hoạt động.

#### Viết lớp kiểm thử (Refuse2Revoke)

```java
@Test
public void testRefuse2Revoke() {
    String activityId = "100001";
    ActivityService.init(activityId, Status.Refuse);
    StateHandler stateHandler = new StateHandler();
    Result result = stateHandler.checkRevoke(activityId, Status.Refuse);
    logger.info("Kết quả kiểm thử (Từ từ chối sang Thu hồi): {}", JSON.toJSONString(result));
    logger.info("Thông tin hoạt động: {} Trạng thái: {}", JSON.toJSONString(ActivityService.queryActivityInfo(activityId)), JSON.toJSONString(ActivityService.queryActivityInfo(activityId).getStatus()));
}
```

**Kết quả kiểm thử**

```java
2024-04-01 21:02:20.446	INFO	main		(ApiTest.java:37)	|	Kết quả kiểm thử (Từ từ chối sang Thu hồi): {"code":"0000","info":"Thu hồi kiểm tra hoàn tất"}
2024-04-01 21:02:20.459	INFO	main		(ApiTest.java:38)	|	Thông tin hoạt động: {"activityId":"100001","activityName":"Chương trình thưởng thức sáng sớm và học tập","beginTime":1711980140454,"endTime":1711980140454,"status":"Editing"} Trạng thái: "Editing"
```

- Kiểm thử quá trình chuyển từ Từ từ chối sang Thu hồi của hoạt động.
- **Tóm lại**, bốn lớp kiểm thử trên mô phỏng các luồng chuyển trạng thái khác nhau giữa các trạng thái, bao gồm cả luồng chuyển trạng thái `hợp lệ` và `không hợp lệ`.

## Tổng kết

- Từ hai phương pháp triển khai trên, chúng ta có thể thấy rằng trong cách tiếp cận thứ hai sử dụng mẫu thiết kế đã loại bỏ hoàn toàn câu lệnh `if-else`, làm cho cấu trúc code nguồn trở nên rõ ràng và dễ mở rộng hơn. Điều này chính là ưu điểm của mẫu thiết kế, có thể thay đổi cấu trúc code nguồn hiện có một cách mạnh mẽ, giúp việc mở rộng và bảo trì sau này trở nên dễ dàng hơn.
- Trên cách tiếp cận về cách triển khai cấu trúc, chúng ta có thể thấy rằng không còn là lập trình theo hướng thủ tục nữa, mà là lập trình hướng đối tượng. Đồng thời, mẫu thiết kế như vậy đáp ứng được nguyên lý "đơn trách nhiệm" và "đóng mở". Chỉ khi bạn đạt được cấu trúc như vậy, bạn mới nhận ra rằng việc mở rộng code nguồn trở nên dễ dàng, tức là việc thêm và sửa đổi các tính năng sẽ không ảnh hưởng đến toàn bộ hệ thống.
- Tuy nhiên, nếu trạng thái và các luồng điều khiển có quá nhiều như trong ví dụ của bài viết, sẽ tạo ra quá nhiều lớp triển khai. Do đó, điều này có thể mang lại chi phí thời gian trong việc triển khai code nguồn, vì vậy khi gặp phải tình huống như vậy, bạn có thể đánh giá chi phí và lợi ích theo nhu cầu. Điểm quan trọng là xem liệu bạn có thường xuyên thay đổi không, liệu có thể làm thành các thành phần riêng biệt, và phân chia các chức năng kinh doanh và không phải chức năng kinh doanh.
