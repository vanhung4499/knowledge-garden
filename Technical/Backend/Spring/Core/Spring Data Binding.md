---
title: Spring Data Binding
tags: [spring, java, backend]
categories: [spring, java, backend]
date created: 2023-07-26
date modified: 2023-07-26
---

# Spring Data Binding

Spring Data Binding là cơ chế để liên kết động dữ liệu nhập của người dùng với JavaBean. Nói cách khác, cơ chế Spring Data Binding là cách để thiết lập giá trị thuộc tính vào đối tượng mục tiêu.

Trong Spring, chức năng Data Binding chủ yếu được thực hiện bởi lớp `DataBinder`. Ngoài ra, `BeanWrapper` cũng có chức năng tương tự, nhưng `DataBinder` hỗ trợ thêm kiểm tra trường, định dạng trường và phân tích kết quả liên kết.

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230111150930.png)

## Bắt đầu nhanh

Định nghĩa một JavaBean để kiểm tra

```java
public class TestBean {

    private int num;

    public int getNum() {
        return num;
    }

    public void setNum(int num) {
        this.num = num;
    }

    @Override
    public String toString() {
        return "TestBean{" + "num=" + num + '}';
    }

}
```

Ví dụ về Data Binding

```java
public class DataBindingDemo {

    public static void main(String[] args) {

        MutablePropertyValues mpv = new MutablePropertyValues();
        mpv.add("num", "10");

        TestBean testBean = new TestBean();
        DataBinder db = new DataBinder(testBean);

        db.bind(mpv);
        System.out.println(testBean);
    }

}
```

## Các tình huống sử dụng Spring Data Binding

- Tạo Bean từ `BeanDefinition` trong Spring
- Data Binding của Spring (`DataBinder`)
- Data Binding tham số trong Spring Web (`WebDataBinder`)

## DataBinder

Trong Spring, lớp `DataBinder` là lớp cơ sở cho chức năng Data Binding. `WebDataBinder` là một lớp con của `DataBinder`, được sử dụng chủ yếu cho Data Binding trong Spring Web. Ngoài ra, còn có một số lớp con mở rộng của `WebDataBinder`, như được hiển thị trong hình sau:

![](https://raw.githubusercontent.com/vanhung4499/images/master/snap/20230111152225.png)

Các thuộc tính chính của lớp `DataBinder`:

| Thuộc tính              | Mô tả                         |
| ---------------------- | ------------------------------ |
| `target`               | Đối tượng Bean liên kết         |
| `objectName`           | Tên của đối tượng Bean         |
| `bindingResult`        | Kết quả liên kết thuộc tính    |
| `typeConverter`        | Bộ chuyển đổi kiểu             |
| `conversionService`    | Dịch vụ chuyển đổi kiểu        |
| `messageCodesResolver` | Bộ giải mã mã lỗi kiểm tra     |
| `validators`           | Danh sách các Validator liên kết |

Phương thức chính của lớp `DataBinder` là `bind(PropertyValues)`: ánh xạ nội dung Key-Value của PropertyValues vào các thuộc tính của đối tượng Bean liên kết (target)

- Giả sử PropertyValues chứa cặp khóa giá trị name=hnv99, và đối tượng Bean User có thuộc tính name, khi phương thức bind được thực thi, giá trị thuộc tính name trong đối tượng User sẽ được liên kết với hnv99.

## Spring Data Binding Metadata

Metadata của DataBinder - PropertyValues

| Đặc điểm | Mô tả                                                                 |
| -------- | -------------------------------------------------------------------- |
| Nguồn dữ liệu | BeanDefinition, chủ yếu từ cấu hình BeanDefinition của tài nguyên XML |
| Cấu trúc dữ liệu | Bao gồm một hoặc nhiều PropertyValue                                  |
| Cấu trúc thành viên | PropertyValue bao gồm tên thuộc tính và giá trị thuộc tính (bao gồm giá trị gốc và giá trị sau khi chuyển đổi kiểu) |
| Cài đặt phổ biến | MutablePropertyValues                                                |
| Cài đặt mở rộng Web | ServletConfigPropertyValues, ServletRequestParameterPropertyValues   |
| Liên quan đến vòng đời | InstantiationAwareBeanPostProcessor#postProcessProperties            |

## Tham số điều khiển Data Binding của Spring

Phân tích các tình huống đặc biệt của DataBinder

- Khi PropertyValues chứa PropertyValue với tên x, và đối tượng mục tiêu B không có thuộc tính x, điều gì xảy ra khi thực hiện phương thức bind?
- Khi PropertyValues chứa PropertyValue với tên x, và đối tượng mục tiêu B có thuộc tính x, làm thế nào để tránh việc liên kết thuộc tính x của B?
- Khi PropertyValues chứa PropertyValue với tên x.y, và đối tượng mục tiêu B có thuộc tính x (với thuộc tính lồng y), điều gì xảy ra khi thực hiện phương thức bind?

### Tham số điều khiển DataBinder

| Tên tham số            | Mô tả                               |
| --------------------- | ---------------------------------- |
| ignoreUnknownFields   | Có bỏ qua các trường không xác định hay không, giá trị mặc định: true     |
| ignoreInvalidFields   | Có bỏ qua các trường không hợp lệ hay không, giá trị mặc định: false    |
| autoGrowNestedPaths   | Có tự động tăng đường dẫn lồng nhau hay không, giá trị mặc định: true |
| allowedFields         | Danh sách trường được phép liên kết                     |
| disallowedFields      | Danh sách trường không được phép liên kết                     |
| requiredFields        | Danh sách trường bắt buộc liên kết                       |

## Sử dụng BeanWrapper

- Giao diện trung tâm của cơ sở hạ tầng JavaBeans của Spring
- Thường không được sử dụng trực tiếp, được sử dụng gián tiếp thông qua BeanFactory và DataBinder
- Cung cấp phân tích và thao tác Java Bean tiêu chuẩn, có thể lưu trữ thuộc tính (properties) của Java Bean độc lập hoặc theo lô
- Hỗ trợ đường dẫn thuộc tính lồng nhau (nested path)
- Implement: org.springframework.beans.BeanWrapperImpl

## Thay thế cài đặt Java Beans cốt lõi của Spring

Cài đặt cốt lõi của JavaBeans - `java.beans.BeanInfo`

- Thuộc tính (Property)
  - `java.beans.PropertyEditor`
- Phương thức (Method)
- Sự kiện (Event)
- Biểu thức (Expression)

Cài đặt thay thế của Spring - `org.springframework.beans.BeanWrapper`

- Thuộc tính (Property)
  - `java.beans.PropertyEditor`
- Đường dẫn thuộc tính lồng nhau (nested path)

## DataBinder và Data Validation

DataBinder và BeanWrapper

- Phương thức bind tạo ra BeanPropertyBindingResult
- BeanPropertyBindingResult liên kết với BeanWrapper

## Câu hỏi

JavaBeans chuẩn thực hiện các thao tác thuộc tính như thế nào?

| API                           | Mô tả                     |
| ----------------------------- | ------------------------ |
| java.beans.Introspector       | API Java Beans introspection      |
| java.beans.BeanInfo           | API thông tin Java Bean     |
| java.beans.BeanDescriptor     | Mô tả thông tin Java Bean     |
| java.beans.PropertyDescriptor | Mô tả thuộc tính Java Bean     |
| java.beans.MethodDescriptor   | Mô tả phương thức Java Bean     |
| java.beans.EventSetDescriptor | Mô tả tập sự kiện Java Bean |
