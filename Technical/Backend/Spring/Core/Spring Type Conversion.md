---
title: Spring Type Conversion
tags: [spring, java, backend]
categories: [spring, java, backend]
date created: 2023-07-26
date modified: 2023-07-26
---

# Chuyển đổi kiểu dữ liệu trong Spring

## Cài đặt Chuyển đổi Kiểu dữ liệu của Spring

- Cài đặt dựa trên giao diện JavaBeans
  - Mở rộng giao diện java.beans.PropertyEditor
- Cài đặt Chuyển đổi Kiểu dữ liệu chung của Spring 3.0+

## Các Tình huống Sử dụng

| Tình huống             | Cài đặt Chuyển đổi Kiểu dữ liệu dựa trên JavaBeans | Cài đặt Chuyển đổi Kiểu dữ liệu chung của Spring 3.0+ |
| ---------------------- | ------------------------------------------------- | ---------------------------------------------------- |
| Data Binding           | CÓ                                                | CÓ                                                   |
| BeanWrapper            | CÓ                                                | CÓ                                                   |
| Chuyển đổi Kiểu dữ liệu thuộc tính Bean | CÓ                                                | CÓ                                                   |
| Chuyển đổi Kiểu dữ liệu thuộc tính thuộc tính | CÓ                                                | CÓ                                                   |
| Chuyển đổi Kiểu dữ liệu thuộc tính bên ngoài | KHÔNG                                             | CÓ                                                   |

## Cài đặt Chuyển đổi Kiểu dữ liệu dựa trên JavaBeans

Trách nhiệm cốt lõi

- Chuyển đổi nội dung kiểu String thành đối tượng kiểu mục tiêu

Nguyên tắc mở rộng

- Spring Framework truyền nội dung văn bản vào phương thức setAsText(String) của PropertyEditor
- Phương thức setAsText(String) của PropertyEditor thực hiện chuyển đổi kiểu String thành đối tượng kiểu mục tiêu
- Đối tượng kiểu mục tiêu được truyền vào phương thức setValue(Object) của PropertyEditor
- Phương thức setValue(Object) của PropertyEditor thực hiện lưu trữ tạm thời đối tượng được truyền vào
- Spring Framework lấy đối tượng đã chuyển đổi kiểu bằng cách gọi getValue() của PropertyEditor

## Các PropertyEditor mặc định của Spring

Các PropertyEditor mặc định (trong gói org.springframework.beans.propertyeditors)

| Tình huống chuyển đổi            | Lớp cài đặt                                                            |
| ------------------------------- | ---------------------------------------------------------------------- |
| String -> Mảng Byte             | org.springframework.beans.propertyeditors.ByteArrayPropertyEditor      |
| String -> Char                  | org.springframework.beans.propertyeditors.CharacterEditor              |
| String -> Mảng Char             | org.springframework.beans.propertyeditors.CharArrayPropertyEditor      |
| String -> Charset               | org.springframework.beans.propertyeditors.CharsetEditor                |
| String -> Class                 | org.springframework.beans.propertyeditors.ClassEditor                  |
| String -> Tiền tệ (Currency)    | org.springframework.beans.propertyeditors.CurrencyEditor               |
|                                 |                                                                        |

## Mở rộng PropertyEditor tùy chỉnh

Mô hình mở rộng

- Mở rộng lớp `java.beans.PropertyEditorSupport`

Cài đặt `org.springframework.beans.PropertyEditorRegistrar`

- Triển khai phương thức `registerCustomEditors(org.springframework.beans.PropertyEditorRegistry)`
- Đăng ký triển khai `PropertyEditorRegistrar` như một Bean của Spring

Đăng ký PropertyEditor tùy chỉnh với `org.springframework.beans.PropertyEditorRegistry`

- Đăng ký chung các loại chuyển đổi bằng cách gọi `registerCustomEditor(Class<?>, PropertyEditor)`
- Đăng ký chuyển đổi kiểu thuộc tính Bean: `registerCustomEditor(Class<?>, String, PropertyEditor)`

## Nhược điểm của PropertyEditor trong Spring

Vi phạm nguyên tắc đơn nhất trách nhiệm

- Giao diện `java.beans.PropertyEditor` có quá nhiều trách nhiệm, không chỉ là chuyển đổi kiểu, mà còn bao gồm sự kiện Java Beans và tương tác GUI Java

Cài đặt `java.beans.PropertyEditor` có giới hạn về kiểu

- Chỉ hỗ trợ kiểu nguồn là `java.lang.String`

Cài đặt `java.beans.PropertyEditor` thiếu tính an toàn kiểu

- Ngoài việc đặt tên lớp cài đặt có thể diễn đạt ý nghĩa, lớp cài đặt không nhận biết được kiểu chuyển đổi mục tiêu

## Giao diện chuyển đổi kiểu chung trong Spring 3

Giao diện chuyển đổi kiểu - org.springframework.core.convert.converter.Converter<S, T>

- Tham số kiểu S: Kiểu nguồn, tham số kiểu T: Kiểu đích
- Phương thức chính: T convert(S)

Giao diện chuyển đổi kiểu chung - org.springframework.core.convert.converter.GenericConverter

- Phương thức chính: convert(Object, TypeDescriptor, TypeDescriptor)
- Cặp kiểu: org.springframework.core.convert.converter.GenericConverter.ConvertiblePair
- Miêu tả kiểu: org.springframework.core.convert.TypeDescriptor

## Bộ chuyển đổi kiểu được tích hợp sẵn trong Spring

Các phần mở rộng tích hợp sẵn

| Tình huống chuyển đổi | Gói chứa lớp thực hiện                        |
| -------------------- | -------------------------------------------- |
| Liên quan đến ngày/tháng | org.springframework.format.datetime          |
| Liên quan đến ngày/tháng trong Java 8 | org.springframework.format.datetime.standard |
| Thực hiện chung | org.springframework.core.convert.support     |

## Hạn chế của giao diện Converter

Hạn chế thứ nhất: Thiếu kiểm tra trước kiểu nguồn và kiểu đích

- Giải pháp: Thêm giao diện org.springframework.core.convert.converter.ConditionalConverter

Hạn chế thứ hai: Chỉ có thể chuyển đổi từng kiểu nguồn và kiểu đích duy nhất

- Giải pháp: Sử dụng giao diện org.springframework.core.convert.converter.GenericConverter thay thế

## Giao diện GenericConverter

`org.springframework.core.convert.converter.GenericConverter`

| Yếu tố chính | Mô tả                                                                          |
| -------- | ----------------------------------------------------------------------------- |
| Tình huống sử dụng | Dùng cho tình huống chuyển đổi kiểu "phức tạp", ví dụ như Collection, Map, mảng, v.v.                          |
| Phạm vi chuyển đổi | `Set<ConvertiblePair> getConvertibleTypes()`                                  |
| Cặp kiểu | `org.springframework.core.convert.converter.GenericConverter.ConvertiblePair` |
| Phương thức chuyển đổi | `convert(Object,TypeDescriptor,TypeDescriptor)`                               |
| Miêu tả kiểu | `org.springframework.core.convert.TypeDescriptor`                             |

## Tối ưu hóa giao diện GenericConverter

Hạn chế của GenericConverter

- Thiếu kiểm tra trước kiểu nguồn và kiểu đích
- Cài đặt chuyển đổi đơn giản nhưng phức tạp

Giao diện tối ưu hóa của GenericConverter - `ConditionalGenericConverter`

- Chuyển đổi kiểu phức tạp: `org.springframework.core.convert.converter.GenericConverter`
- Kiểm tra điều kiện kiểu: `org.springframework.core.convert.converter.ConditionalConverter`

## Mở rộng trình chuyển đổi kiểu trong Spring

Cài đặt giao diện chuyển đổi

- `org.springframework.core.convert.converter.Converter`
- `org.springframework.core.convert.converter.ConverterFactory`
- `org.springframework.core.convert.converter.GenericConverter`

Đăng ký cài đặt chuyển đổi

- Sử dụng Spring Bean `ConversionServiceFactoryBean`
- Sử dụng API `org.springframework.core.convert.ConversionService`

## Dịch vụ chuyển đổi kiểu thống nhất

`org.springframework.core.convert.ConversionService`

| Loại cài đặt                             | Mô tả                                                                                      |
| ------------------------------------ | ----------------------------------------------------------------------------------------- |
| `GenericConversionService`           | Cài đặt mẫu ConversionService chung, không cài đặt chuyển đổi sẵn                                         |
| `DefaultConversionService`           | Cài đặt cơ bản của ConversionService, cài đặt chuyển đổi thông dụng                                           |
| `FormattingConversionService`        | Cài đặt Formatter + GenericConversionService chung, không cài đặt chuyển đổi và Formatter sẵn có             |
| `DefaultFormattingConversionService` | Cài đặt DefaultConversionService + định dạng (ví dụ: JSR-354 Money & Currency, JSR-310 Date-Time) |

## ConversionService như một phụ thuộc

Giao diện trình chuyển đổi kiểu cơ bản - `org.springframework.beans.TypeConverter`

- Phiên bản bắt đầu: Spring 2.0
- Phương thức chính - convertIfNecessary (phương thức nạp chồng)
- Cài đặt trừu tượng - `org.springframework.beans.TypeConverterSupport`
- Cài đặt đơn giản - `org.springframework.beans.SimpleTypeConverter`

Cài đặt trừu tượng trình chuyển đổi kiểu - `org.springframework.beans.TypeConverterSupport`

- Cài đặt giao diện - `org.springframework.beans.TypeConverter`
- Cài đặt mở rộng - `org.springframework.beans.PropertyEditorRegistrySupport`
- Cài đặt ủy quyền - `org.springframework.beans.TypeConverterDelegate`

Cài đặt ủy quyền trình chuyển đổi kiểu - `org.springframework.beans.TypeConverterDelegate`

- Xây dựng nguồn - Cài đặt `org.springframework.beans.AbstractNestablePropertyAccessor`
  - `org.springframework.beans.BeanWrapperImpl`
- Phụ thuộc - Cài đặt `java.beans.PropertyEditor`
  - Cài đặt mặc định tích hợp sẵn - `PropertyEditorRegistrySupport#registerDefaultEditors`
- Phụ thuộc tùy chọn - Cài đặt `org.springframework.core.convert.ConversionService`

## Câu hỏi

**Spring có những cách để thực hiện chuyển đổi kiểu dữ liệu nào?**

- Thực hiện dựa trên giao diện JavaBeans PropertyEditor.
- Thực hiện chuyển đổi kiểu dữ liệu chung từ Spring 3.0 trở lên.

**Spring có những giao diện chuyển đổi kiểu dữ liệu nào?**

- Giao diện chuyển đổi kiểu dữ liệu - `org.springframework.core.convert.converter.Converter`
- Giao diện chuyển đổi kiểu dữ liệu chung - `org.springframework.core.convert.converter.GenericConverter`
- Giao diện điều kiện kiểu dữ liệu - `org.springframework.core.convert.converter.ConditionalConverter`
- Giao diện chuyển đổi kiểu dữ liệu tổng hợp - `org.springframework.core.convert.converter.ConditionalGenericConverter`
