---
title: JS Parastic Constructor Pattern
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-06
date modified: 2023-08-06
---

# Mô hình hàm tạo ẩn danh

Ý tưởng cơ bản của mô hình hàm tạo ẩn danh là tạo ra một hàm chỉ để đóng gói mã tạo đối tượng, sau đó trả về đối tượng mới được tạo ra; nhưng từ bên ngoài, hàm này trông giống như một hàm tạo thông thường.

```js
function Person(name, age, job){
  let obj = new Object();
  obj.name = name;
  obj.age = age;
  obj.job = job;
  obj.sayName = function(){
      console.log(`I'm ${this.name}`);
  };

  return obj;
}

let faker = new Person('Faker', 27, 'E-Sports Player');
uzi.sayName();
// I'm Faker
```

Thêm một câu lệnh `return` vào cuối hàm tạo có thể ghi đè giá trị trả về khi gọi hàm tạo.

Về mô hình hàm tạo ẩn danh, cần lưu ý rằng đối tượng được trả về không có mối quan hệ với hàm tạo hoặc các thuộc tính nguyên mẫu của hàm tạo. Nghĩa là, đối tượng được trả về từ hàm tạo không khác gì đối tượng được tạo ra bên ngoài hàm tạo. Do đó, không thể dựa vào toán tử `instanceof` để xác định kiểu đối tượng.
