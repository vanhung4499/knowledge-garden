---
title: Go Interface compare to CPP
tags: 
categories: 
date created: 2023-09-21
date modified: 2023-09-21
---

# Go Interface compare to C++

Giao diện định nghĩa một quy chuẩn, mô tả hành vi và chức năng của một lớp, mà không thực hiện cụ thể.

Trong C++, giao diện được thực hiện bằng cách sử dụng lớp trừu tượng. Nếu ít nhất một hàm trong lớp được khai báo là hàm thuần ảo, thì lớp đó được coi là lớp trừu tượng. Hàm thuần ảo được chỉ định bằng cách sử dụng "= 0" trong khai báo. Ví dụ:

```cpp
class Shape
{
   public:
      // Hàm thuần ảo
      virtual double getArea() = 0;
   private:
      string name;      // Tên
};
```

Mục đích của việc thiết kế lớp trừu tượng là cung cấp một lớp cơ sở có thể được kế thừa bởi các lớp khác. Lớp trừu tượng không thể được sử dụng để khởi tạo đối tượng, nó chỉ có thể được sử dụng như một giao diện.

Lớp dẫn xuất cần khai báo rõ ràng rằng nó kế thừa từ lớp cơ sở và cần triển khai tất cả các hàm thuần ảo trong lớp cơ sở.

Cách định nghĩa giao diện trong C++ được gọi là "xâm phạm" (invasive), trong khi Go sử dụng cách "không xâm phạm" (non-invasive), không cần khai báo rõ ràng, chỉ cần triển khai các hàm được định nghĩa trong giao diện, trình biên dịch sẽ tự động nhận biết.

Sự khác biệt trong cách định nghĩa giao diện giữa C++ và Go cũng dẫn đến sự khác biệt trong cài đặt cơ bản. Trong C++, bảng hàm ảo được sử dụng để triển khai việc gọi hàm của lớp dẫn xuất từ lớp cơ sở; trong khi Go sử dụng trường `fun` trong `itab` để triển khai việc gọi hàm của biến giao diện từ kiểu thực thể. Bảng hàm ảo trong C++ được tạo ra trong quá trình biên dịch; trong khi trường `fun` trong `itab` của Go được tạo ra động trong quá trình chạy. Lý do là trong Go, kiểu thực thể có thể vô tình triển khai nhiều giao diện, nhiều giao diện không phải là những gì thực sự cần thiết, vì vậy không thể tạo ra một `itab` cho tất cả các giao diện mà kiểu thực thể triển khai, đây là tác động của "không xâm phạm"; điều này không có trong C++, vì dẫn xuất phải khai báo rõ ràng nó kế thừa từ lớp cơ sở.
