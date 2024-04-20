---
title: CF Count Online User
tags: 
categories: 
date created: 2024-04-17
date modified: 2024-04-17
---

# Thống kê số người dùng trực tuyến thời gian thực

Trong dự án, đã sử dụng một Listener từ ba thành phần Web để thực hiện chức năng thống kê số người trực tuyến một cách đơn giản. Nguyên tắc chính của nó là sử dụng lắng nghe sự kiện tạo và hủy phiên làm việc (session), từ đó thực hiện đếm tăng giảm +1/-1 số lượng người trực tuyến.

## Thống kê số người trực tuyến

### Ý tưởng thiết kế

Mỗi khi người dùng truy cập, nếu phiên (session) chưa được tạo, hệ thống sẽ tạo một phiên mới và thiết lập thời gian hiệu lực của nó. Nếu phiên đã tồn tại, hệ thống sẽ cập nhật thời gian truy cập của phiên. Khi người dùng tự nguyện thoát hoặc sau một khoảng thời gian không tương tác, hệ thống sẽ coi người dùng đã rời đi và phiên sẽ hết hiệu lực.

Cơ chế thống kê số người trực tuyến dựa trên việc tạo và tự động hủy phiên:

Ý tưởng trên khá rõ ràng, với hai điểm chính:

- Lắng nghe sự kiện tạo và hủy phiên của người dùng: `OnlineUserCountListener`
- Dịch vụ đếm: `UserStatisticService`

### Lắng nghe sự kiện session

Chúng ta có thể tạo một lớp lắng nghe (listener) tùy chỉnh để triển khai `HttpSessionListener`.  

Đường dẫn mã nguồn: `com.hnv99.forum.web.hook.listener.OnlineUserCountListener`

```java
@WebListener
public class OnlineUserCountListener implements HttpSessionListener {


    /**
     * Khi phiên mới được tạo ra, số người trực tuyến tăng thêm 1.
     *
     * @param se
     */
    public void sessionCreated(HttpSessionEvent se) {
        HttpSessionListener.super.sessionCreated(se);
        SpringUtil.getBean(UserStatisticService.class).incrOnlineUserCnt(1);
    }

    /**
     * Khi phiên hủy bỏ, số người trực tuyến giảm đi 1.
     *
     * @param se
     */
    public void sessionDestroyed(HttpSessionEvent se) {
        HttpSessionListener.super.sessionDestroyed(se);
        SpringUtil.getBean(UserStatisticService.class).incrOnlineUserCnt(-1);
    }
}

```

### Dịch vụ Đếm

Trong dự án, chúng tôi đã triển khai một dịch vụ đếm cực kỳ cơ bản, hiện chỉ phù hợp với cảnh đơn máy; khi mở rộng lên chế độ cụm, có thể xem xét việc sử dụng Redis để thay thế biến bộ nhớ `AtomicInteger onlineUserCnt = new AtomicInteger(0)` dưới đây.

Đường dẫn mã nguồn: `com.hnv99.forum.service.statistics.service.impl.UserStatisticServiceImpl`

```java
@Service
public class UserStatisticServiceImpl implements UserStatisticService {

    /**
     * For single-server scenarios, local variables can be used directly for counting.
     * For clustered scenarios, consider using a Redis sorted set (zset) to implement cluster-wide online user count statistics.
     */
    private AtomicInteger onlineUserCnt = new AtomicInteger(0);

    /**
     * Add online user count
     *
     * @param add positive number to add online user count; negative number to decrease online user count
     * @return the updated online user count
     */
    public int incOnlineUserCnt(int add) {
        return onlineUserCnt.addAndGet(add);
    }

    /**
     * Get the number of online users
     *
     * @return the number of online users
     */
    public int getOnlineUserCnt() {
        return onlineUserCnt.get();
    }
}
```

Đối với trường hợp đơn máy, việc sử dụng biến cục bộ như trên là hoàn toàn hợp lý. Tuy nhiên, khi triển khai trong một môi trường cụm, chúng ta cần xem xét việc sử dụng cơ chế lưu trữ dữ liệu phân tán như Redis để đảm bảo tính nhất quán và khả năng mở rộng.

### Tạo phiên

Toàn bộ giải pháp trên dựa trên việc tạo và hủy session, do đó chúng ta có thể xem xét việc tạo phiên trực tiếp trong Filter.

```java
    private HttpServletRequest initReqInfo(HttpServletRequest request, HttpServletResponse response) {
        if (isStaticURI(request)) {
            // Directly allow static resources
            return request;
        }

        StopWatch stopWatch = new StopWatch("Building Request Parameters");
        try {
            stopWatch.start("TraceId");
            // Add the traceId for the entire link
            MdcUtil.addTraceId();
            stopWatch.stop();

            stopWatch.start("Request Basic Information");
            // Manually write a session to implement real-time statistics of online users with the help of OnlineUserCountListener
            request.getSession().setAttribute("latestVisit", System.currentTimeMillis());

            ...
```

Về các kiến thức liên quan đến session, vui lòng đọc [[CF Session Cookie]].

### Hủy session

Về việc hủy phiên, chúng ta cung cấp hai cách tiếp cận: một là người dùng đăng xuất, hai là tự động hết hạn.

**Giải pháp cho việc đăng xuất**

```java
    @Permission(role = UserRole.LOGIN)
    @RequestMapping("logout")
    public ResVo<Boolean> logOut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Invalidate session
        request.getSession().invalidate();
        Optional.ofNullable(ReqInfoContext.getReqInfo()).ifPresent(s -> loginService.logout(s.getSession()));
        // Remove cookie
        response.addCookie(SessionUtil.delCookie(LoginService.SESSION_KEY));
        // Redirect to the current page
        String referer = request.getHeader("Referer");
        if (StringUtils.isBlank(referer)) {
            referer = "/";
        }
        response.sendRedirect(referer);
        return ResVo.ok(true);
    }
```

**Thiết lập thời gian hiệu lực của phiên**

```yml
server:  
  port: 8080  
  servlet:  
    session:  
      timeout: 5m # Set the session timeout to five minutes
```

### Trả về Số người trực tuyến

Như đã đề cập ở đầu bài viết, thông tin về số người trực tuyến được hiển thị ở phía dưới của mọi trang, trong một gợi ý về số người trực tuyến. Do đó, thông tin này được đặt trực tiếp trong tham số toàn cầu.

```java
/**  
 * Initialize global attributes. 
 */
public GlobalVo globalAttr() {  
    GlobalVo vo = new GlobalVo();  
    vo.setEnv(env);  
    vo.setSiteInfo(globalViewConfig);  
    vo.setOnlineCnt(userStatisticService.getOnlineUserCnt()); // 
    ...
```

## Tổng kết

Nhìn chung, nội dung của bài viết này khá đơn giản, dựa trên những kiến thức cơ bản của web như Listener và session để thực hiện thống kê số người trực tuyến. Các điểm kiến thức được liên kết trong bài viết như sau:

- Kiến thức cơ bản về Listener trong ba thành phần của web: [[CF WEB Listener]]
- Kiến thức liên quan đến Filter trong ba thành phần của web: [[CF Web Filter]]
- Kiến thức về cookie/session: [[CF Session Cookie]]
- Bộ đếm dựa trên AtomicInteger để thực hiện thống kê số người trực tuyến trên một máy đơn lẻ.
