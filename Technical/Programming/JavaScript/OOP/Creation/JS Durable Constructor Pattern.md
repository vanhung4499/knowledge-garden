---
title: JS Durable Constructor Pattern
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-06
date modified: 2023-08-06
---

# Mô hình hàm tạo an toàn

Đối tượng an toàn, được hiểu là không có thuộc tính công khai và các phương thức của nó không tham chiếu đến `this`. Mô hình hàm tạo an toàn rất phù hợp để sử dụng trong một số môi trường an toàn (nơi mà việc sử dụng `this` và `new` bị cấm) hoặc khi muốn ngăn chặn dữ liệu bị thay đổi bởi các ứng dụng khác. Mô hình hàm tạo an toàn tuân theo một mô hình tương tự như mô hình hàm tạo ẩn danh, nhưng có hai điểm khác biệt: đầu tiên, các phương thức của đối tượng mới được tạo không tham chiếu đến `this`; thứ hai, không sử dụng toán tử `new` để gọi hàm tạo.

```js
function Person(name, age, job) {
  // Tạo đối tượng sẽ trả về
  const obj = new Object();

  // Có thể định nghĩa các biến và hàm riêng tư ở đây

  // Thêm phương thức
  obj.sayName = function() {
    console.log(name);
  };

  // Trả về đối tượng
  return obj;
}
```

Lưu ý rằng trong đối tượng được tạo bằng mô hình này, ngoài việc sử dụng phương thức `sayName()`, không có cách nào khác để truy cập giá trị của `name`. Có thể sử dụng hàm tạo an toàn `Person` như sau:

```js
let faker = Person('Faker', 27, 'E-Sports Player');

faker.sayName();
// 'Faker'
```

Như vậy, biến `faker` chứa một đối tượng an toàn, và ngoài việc gọi phương thức `sayName()`, không có cách nào khác để truy cập các thành viên dữ liệu của nó được truyền vào hàm tạo. Mô hình hàm tạo an toàn cung cấp tính an toàn này, làm cho nó rất phù hợp để sử dụng trong một số môi trường thực thi an toàn.

> Giống như mô hình hàm tạo ẩn danh, các đối tượng được tạo bằng mô hình hàm tạo an toàn không có mối quan hệ với hàm tạo, do đó toán tử `instanceof` không có ý nghĩa đối với các đối tượng này.
