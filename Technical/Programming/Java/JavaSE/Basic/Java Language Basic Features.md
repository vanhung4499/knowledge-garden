---
title: Java Language Basic Features
tags: [java, javase]
categories: [java, javase]
date created: 2023-07-11
date modified: 2023-07-12
---

# Cú pháp cơ bản của Java

## Chú thích (Comment)

Dòng trống hoặc nội dung chú thích sẽ được bỏ qua bởi trình biên dịch Java.

Java hỗ trợ nhiều cách chú thích khác nhau, ví dụ dưới đây cho thấy cách sử dụng các chú thích khác nhau:

```java
public class HelloWorld {
    /*
     * Chú thích JavaDoc
     */
    public static void main(String[] args) {
        // Chú thích một dòng
        /* Chú thích nhiều dòng:
           1. Điểm chú ý a
           2. Điểm chú ý b
         */
        System.out.println("Hello World");
    }
}
```

## Kiểu dữ liệu cơ bản (Basic Data Type)

> 👉 Đọc thêm: [[Java Basic Data Type In Depth]]

## Biến (Variable)

Java hỗ trợ các loại biến sau:

- `Biến cục bộ (local variable)` - Biến trong phạm vi của phương thức lớp.
- `Biến thành viên (instance variable)` - Biến nằm ngoài phạm vi phương thức, nhưng không có từ khóa `static`.
- `Biến tĩnh (static variable)` - Biến nằm ngoài phạm vi phương thức, được đánh dấu bằng từ khóa `static`.

So sánh các đặc điểm:

| Biến cục bộ (local variable)                                                                                                              | Biến thành viên (instance variable)                                                                                                            | Biến tĩnh (static variable)                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Biến cục bộ được khai báo trong phương thức, hàm tạo hoặc khối lệnh.                                                         | Biến thành viên được khai báo ngoài phạm vi phương thức, hàm tạo và khối lệnh.                                                                                  | Biến tĩnh được khai báo ngoài phạm vi phương thức, hàm tạo và khối lệnh. Và được đánh dấu bằng từ khóa `static`.                                                                                     |
| Biến cục bộ được tạo ra khi phương thức, hàm tạo hoặc khối lệnh được thực thi và bị hủy khi chúng hoàn thành.               | Biến thành viên được tạo ra khi đối tượng được tạo ra và bị hủy khi đối tượng bị hủy.                                                                          | Biến tĩnh được tạo ra khi được truy cập lần đầu tiên và bị hủy khi chương trình kết thúc.                                                                                                        |
| Biến cục bộ không có giá trị mặc định, vì vậy phải được khởi tạo trước khi sử dụng.                                          | Biến thành viên có giá trị mặc định. Giá trị mặc định của biến số là 0, giá trị mặc định của biến boolean là false, giá trị mặc định của biến tham chiếu là null. | Biến tĩnh có giá trị mặc định. Giá trị mặc định của biến số là 0, giá trị mặc định của biến boolean là false, giá trị mặc định của biến tham chiếu là null. Ngoài ra, biến tĩnh còn có thể được khởi tạo trong khối tĩnh. |
| Đối với biến cục bộ, nếu là kiểu cơ bản, giá trị sẽ được lưu trữ trực tiếp trong ngăn xếp; nếu là kiểu tham chiếu, đối tượng sẽ được lưu trữ trong heap và con trỏ đến đối tượng đó sẽ được lưu trữ trong ngăn xếp. | Biến thành viên được lưu trữ trong heap.                                                                                                                      | Biến tĩnh được lưu trữ trong vùng lưu trữ tĩnh.                                                                                                                                                   |
| Không thể sử dụng từ khóa truy cập cho biến cục bộ.                                                                       | Có thể sử dụng từ khóa truy cập cho biến thành viên.                                                                                                          | Có thể sử dụng từ khóa truy cập cho Biến tĩnh.                                                                                                                                                   |
| Biến cục bộ chỉ có thể nhìn thấy trong phương thức, hàm tạo hoặc khối lệnh mà nó được khai báo.                             | Biến thành viên có thể nhìn thấy trong phương thức, hàm tạo hoặc khối lệnh của lớp. Thông thường, biến thành viên nên được đặt là private.                        | Biến tĩnh có thể nhìn thấy trong phương thức, hàm tạo hoặc khối lệnh của lớp. Tuy nhiên, để nhìn thấy Biến tĩnh từ bên ngoài, nên đặt biến tĩnh là public.                                               |
|                                                                                                                          | Biến thành viên có thể truy cập trực tiếp thông qua tên biến. Tuy nhiên, trong phương thức tĩnh và lớp khác, cần sử dụng tên đầy đủ: ObejectReference.VariableName. | Biến tĩnh có thể truy cập thông qua: ClassName.VariableName.                                                                                                                                   |
|                                                                                                                          |                                                                                                                                                             | Một lớp chỉ có một bản sao của biến tĩnh, bất kể số lượng đối tượng được tạo ra từ lớp đó.                                                                                                    |
|                                                                                                                          |                                                                                                                                                             | Biến tĩnh ít được sử dụng ngoài việc được khai báo là hằng số.                                                                                                                                  |

**Các từ khóa sửa đổi biến**

- **Từ khóa truy cập (access modifier)**
	- Nếu biến là biến thành viên hoặc Biến tĩnh, có thể thêm từ khóa truy cập (`public`/`protected`/`private`).
- **Từ khóa static**
	- Nếu biến là biến tĩnh, cần thêm từ khóa `static` và nó chỉ thuộc về lớp.
- **final**
	- Nếu biến được sử dụng với từ khóa `final`, nghĩa là đây là một hằng số và không thể thay đổi.

## Array (Mảng)

> 👉 Đọc thêm: [[Java Array In Depth]]

## Enum

> 👉 Đọc thêm: [[Java Enum In Depth]]

## Opearator (Toán tử)

Java hỗ trợ các loại toán tử sau:

> 👉 Đọc thêm: [Java Operators](http://www.runoob.com/java/java-operators.html)

## Method (Phương thức)

> 👉 Đọc thêm: [[Java Method In Dpeth]]

## Control statement (Câu lệnh điều khiển)

> 👉 Đọc thêm: [[Java Control Statements]]

## Exception (Ngoại lệ)

> 👉 Đọc thêm: [[Java Exception In Depth]]

## Generic (Kiểu tham số hoá)

> 👉 Đọc thêm: [[Java Generic In Depth]]

## Reflection (Phản chiếu)

> 👉 Đọc thêm: [[Java Reflection and Dynamic Proxy]]

## Annotation (Chú thích)

> 👉 Đọc thêm: [[Java Annotation In Depth]]

## Serialization (Tuần tự hóa)

> 👉 Đọc thêm: [[Java Serialization]]
