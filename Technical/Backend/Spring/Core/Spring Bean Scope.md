---
title: Spring Bean Scope
tags: [spring, java, backend, bean]
categories: [spring, java, backend]
date created: 2023-07-26
date modified: 2023-07-26
---

# Phạm vi của Bean trong Spring

## Phạm vi của Bean trong Spring

| Phạm vi     | Mô tả                                                     |
| ----------- | --------------------------------------------------------- |
| singleton   | Mặc định phạm vi của Bean trong Spring, một BeanFactory chỉ có một thể hiện duy nhất |
| prototype   | Phạm vi nguyên mẫu, mỗi lần tìm kiếm phụ thuộc và tiêm phụ thuộc sẽ tạo ra một đối tượng Bean mới |
| request     | Lưu trữ Bean Spring trong ngữ cảnh ServletRequest          |
| session     | Lưu trữ Bean Spring trong HttpSession                      |
| application | Lưu trữ Bean Spring trong ServletContext                   |

## Phạm vi Bean "singleton"

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20221221170833.png)

## Phạm vi Bean "prototype"

Spring không thể quản lý toàn bộ vòng đời của Bean nguyên mẫu (prototype), cũng không thể ghi nhớ sự tồn tại của các thể hiện. Phương thức hủy sẽ không được gọi và có thể sử dụng BeanPostProcessor để thực hiện công việc dọn dẹp.

## Phạm vi Bean "request"

- Cấu hình
  - XML - `<bean class="…" scope = “request" />`
  - Annotation - `@RequestScope` hoặc `@Scope(WebApplicationContext.SCOPE_REQUEST)`
- Triển khai
  - API - RequestScope

## Phạm vi Bean "session"

- Cấu hình
  - XML - `<bean class="…" scope = “session" />`
  - Annotation - `@SessionScope` hoặc `@Scope(WebApplicationContext.SCOPE_SESSION)`
- Triển khai
  - API - SessionScope

## Phạm vi Bean "application"

- Cấu hình
  - XML - `<bean class="…" scope = “application" />`
  - Annotation - `@ApplicationScope` hoặc `@Scope(WebApplicationContext.SCOPE_APPLICATION)`
- Triển khai
  - API - ServletContextScope

## Tự định nghĩa phạm vi Bean

- Triển khai Scope
  - `org.springframework.beans.factory.config.Scope`
- Đăng ký Scope
  - API - `org.springframework.beans.factory.config.ConfigurableBeanFactory#registerScope`
- Cấu hình

  ```xml
  <bean class="org.springframework.beans.factory.config.CustomScopeConfigurer">
    <property name="scopes">
      <map>
        <entry key="...">
        </entry>
      </map>
    </property>
  </bean>
  ```

## Câu hỏi

Spring có bao nhiêu phạm vi Bean tích hợp sẵn?

singleton, prototype, request, session, application và websocket

Bean "singleton" có duy nhất trong một ứng dụng không?

Không. Bean singleton chỉ là duy nhất trong Spring IoC container (BeanFactory) hiện tại.

Có thể thay thế Bean "application" bằng cách khác không?

Có thể, thực tế, Bean "application" và Bean "singleton" không có sự khác biệt cơ bản.
