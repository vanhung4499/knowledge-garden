---
title: Spring Generic Processing
tags: [spring, java, backend]
categories: [spring, java, backend]
date created: 2023-07-26
date modified: 2023-07-26
---

# Xử lý kiểu dữ liệu Generic trong Spring

## Cơ bản về kiểu dữ liệu Generic trong Java

Kiểu dữ liệu Generic

- Kiểu dữ liệu Generic là lớp hoặc giao diện có tham số hóa trên kiểu

Các trường hợp sử dụng kiểu dữ liệu Generic

- Kiểm tra kiểu tại thời điểm biên dịch
- Tránh việc ép kiểu
- Triển khai thuật toán chung

Xóa thông tin kiểu dữ liệu Generic

- Kiểu dữ liệu Generic được giới thiệu vào ngôn ngữ Java để cung cấp kiểm tra kiểu nghiêm ngặt hơn và hỗ trợ lập trình Generic. Việc xóa thông tin kiểu đảm bảo không tạo ra các lớp mới cho các kiểu được tham số hóa; do đó, kiểu dữ liệu Generic không tạo ra bất kỳ chi phí chạy thời gian nào. Để thực hiện kiểu dữ liệu Generic, trình biên dịch áp dụng xóa thông tin kiểu cho:
  - Thay thế tất cả các tham số kiểu trong kiểu dữ liệu Generic bằng giới hạn của chúng (nếu có). Nếu không có giới hạn, chúng được thay thế bằng `Object`.
  - Xóa tất cả các kiểu tham số trong các phương thức và lớp.
  - Thêm kiểm tra kiểu nếu cần thiết để duy trì tính toàn vẹn kiểu.

## Giao diện Java 5

Giao diện Java 5 - `java.lang.reflect.Type`

| Lớp hoặc giao diện                  | Mô tả                                     |
| ---------------------------------- | ----------------------------------------- |
| `java.lang.Class`                  | API lớp Java, ví dụ: `java.lang.String`   |
| `java.lang.reflect.GenericArrayType` | Kiểu mảng Generic                       |
| `java.lang.reflect.ParameterizedType`| Kiểu tham số Generic                    |
| `java.lang.reflect.TypeVariable`    | Biến kiểu Generic, ví dụ: E trong `Collection<E>` |
| `java.lang.reflect.WildcardType`    | Kiểu đại diện Generic                    |

API phản chiếu kiểu Generic trong Java

| Kiểu thông tin Generic (Generics Info) | API                                              |
| ---------------------------------------- | ------------------------------------------------ |
| Kiểu tham số Generic (Parameters)       | `java.lang.Class#getGenericInfo()`                |
| Kiểu cha Generic (Super Classes)        | `java.lang.Class#getGenericSuperclass()`          |
| Kiểu giao diện Generic (Interfaces)     | `java.lang.Class#getGenericInterfaces()`          |
| Khai báo Generic (Generics Declaration)  | `java.lang.reflect.GenericDeclaration`            |

## Các lớp trợ giúp kiểu Generic trong Spring

API cốt lõi - `org.springframework.core.GenericTypeResolver`

- Phiên bản hỗ trợ: `[2.5.2 , )`
- Các phương thức liên quan đến xử lý kiểu (Type)
  - `resolveReturnType`
  - `resolveType`
- Các phương thức liên quan đến xử lý tham số kiểu thống nhất (ParameterizedType)
  - `resolveReturnTypeArgument`
  - `resolveTypeArgument`
  - `resolveTypeArguments`
- Các phương thức liên quan đến xử lý biến kiểu (TypeVariable)
  - `getTypeVariableMap`

## Các lớp trợ giúp kiểu Generic cho các tập hợp trong Spring

API cốt lõi - `org.springframework.core.GenericCollectionTypeResolver`

- Phiên bản hỗ trợ: 2.0 tới 4.3
- Thay thế bằng cài đặt: `org.springframework.core.ResolvableType`
- Xử lý liên quan đến Collection
  - `getCollection*Type`
- Xử lý liên quan đến Map
  - `getMapKey*Type`
  - `getMapValue*Type`

# Xử lý tham số phương thức trong Spring - MethodParameter

API cốt lõi - `org.springframework.core.MethodParameter`

- Phiên bản hỗ trợ: 2.0 trở đi
- Thông tin meta
  - Phương thức liên quan - Method
  - Hàm tạo liên quan - Constructor
  - Chỉ mục tham số của hàm tạo hoặc phương thức - parameterIndex
  - Kiểu tham số của hàm tạo hoặc phương thức - parameterType
  - Kiểu tham số Generic của hàm tạo hoặc phương thức - genericParameterType
  - Tên tham số của hàm tạo hoặc phương thức - parameterName
  - Lớp chứa

## Cải tiến kiểu Generic trong Spring 4.0 - ResolvableType

API cốt lõi - `org.springframework.core.ResolvableType`

- Phiên bản hỗ trợ: từ 4.0 trở đi
- Đóng vai trò của `GenericTypeResolver` và `GenericCollectionTypeResolver`
- Phương thức tạo: `for*`
- Phương thức chuyển đổi: `as*`
- Phương thức xử lý: `resolve*`

## Hạn chế của ResolvableType

- Hạn chế 1: ResolvableType không thể xử lý việc xóa thông tin kiểu
- Hạn chế 2: ResolvableType không thể xử lý ParameterizedType không cụ thể

## Câu hỏi

**Việc xóa thông tin kiểu trong Java xảy ra tại thời điểm biên dịch hay thời điểm chạy?**

Xảy ra tại thời điểm chạy

**Hãy giới thiệu các lớp hoặc giao diện phụ thuộc vào lớp Type trong Java 5**

- `java.lang.Class`
- `java.lang.reflect.GenericArrayType`
- `java.lang.reflect.ParameterizedType`
- `java.lang.reflect.TypeVariable`
- `java.lang.reflect.WildcardType`

**Hãy giải thích lợi ích thiết kế của ResolvableType**

- Đơn giản hóa việc phát triển API Type trong Java 5, ẩn đi sự phức tạp của API như ParameterizedType
- Thiết kế không thay đổi (Immutability)
- Thiết kế API Fluent (Builder pattern), lập trình chuỗi
