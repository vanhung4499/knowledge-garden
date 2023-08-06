---
title: JS Combination Constructor And Prototype Pattern
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-06
date modified: 2023-08-06
---

# Kết hợp sử dụng mô hình hàm tạo và mô hình nguyên mẫu

Mô hình hàm tạo được sử dụng để **định nghĩa các thuộc tính của thực thể**, trong khi mô hình nguyên mẫu được sử dụng để **định nghĩa các phương thức và thuộc tính chia sẻ**.

Kết quả là, mỗi thực thể sẽ có một bản sao riêng của các thuộc tính của thực thể, nhưng đồng thời cũng chia sẻ tham chiếu đến các phương thức, tiết kiệm bộ nhớ tối đa. Ngoài ra, mô hình kết hợp này còn hỗ trợ truyền tham số cho hàm tạo, là sự kết hợp tốt nhất của hai mô hình.

```js
// Mô hình hàm tạo
function Person(name, age, job){
  this.name = name;
  this.age = age;
  this.job = job;
  this.friends = ['Bengi', 'Bang'];
}

// Mô hình nguyên mẫu
Person.prototype = {
  constructor: Person,
  sayName: function(){
    console.log(this.name);
  }
}

const faker = new Person('Faker', 27, 'President');
const wolf = new Person('Wolf', 27, 'Supporter');

faker.friends.push('Oner');
console.log(faker.friends);
// 'Bengi,Bang,Oner'
console.log(wolf.friends);
// 'Bengi,Bang'

console.log(faker.friends == wolf.friends);
// false
console.log(faker.sayName == wolf.sayName);
// true
```

Trong ví dụ này, các thuộc tính của thực thể được định nghĩa trong hàm tạo, trong khi thuộc tính `constructor` và phương thức `sayName()` được định nghĩa trong nguyên mẫu. Khi thay đổi `faker.friends` (thêm một phần tử mới vào mảng), điều này không ảnh hưởng đến `wolf.friends`, vì chúng tham chiếu đến các mảng khác nhau.
