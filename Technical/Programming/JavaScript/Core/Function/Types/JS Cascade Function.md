---
title: JS Cascade Function
tags: [js, programming]
categories: [js, programming]
date created: 2023-08-05
date modified: 2023-08-05
---

# Hàm liên kết

**Hàm liên kết (Cascading Function)**, còn được gọi là **hàm chuỗi (Chained Function)**, là một kỹ thuật sử dụng mã liên tục trên một đối tượng để lặp lại việc gọi các phương thức khác nhau. Kỹ thuật này rất phổ biến trong jQuery và một số thư viện JavaScript khác, nó cũng là tính chất bên trong của một số phương thức nguyên thuỷ của JavaScript, ví dụ như các phương thức xâu thông dụng. Một mức độ nhất định có thể giảm thiểu lượng mã, nâng cao tính đọc hiểu của mã, điểm yếu là nó chiếm giữ giá trị trả về của hàm.

Cú pháp của hàm liên kết như sau:

```js
// jQuery
$('#wrapper').fadeOut().html('Welcome, Sir').fadeIn();

// Xử lý chuỗi
'kankuuii'.replace('k', 'R').toUpperCase().substr(0, 4);
// 'RANK'
```

## Cách thực hiện

Để sử dụng hàm liên kết, chúng ta chỉ cần trả về đối tượng `this` (tức là đối tượng được thao tác trong các phương thức sau) trong mỗi phương thức. Đối tượng được thao tác sẽ tiếp tục gọi các phương thức sau khi thực hiện xong một phương thức, từ đó thực hiện các hoạt động nối tiếp.

```js
function Person() {
  this.name = '';
  this.age = 0;
  this.weight = 10;
}

Person.prototype = {
  setName:function(name){
    this.name = name;
    return this;
  },
  setAge:function(age){
    this.age = age;
    return this;
  },
  setWeight:function(weight) {
    this.weight = weight;
    return this;
  }
}

var faker = new Person();

faker.setName('Faker').setAge(27).setWeight(176);

console.log(faker);
// { name: 'Faker', age: 27, weight: 176 }
```

Bằng cách tạo đối tượng thông qua hàm tạo, vì tất cả các đối tượng đều kế thừa thuộc tính và phương thức của đối tượng nguyên mẫu của nó, chúng ta có thể làm cho các phương thức trong đối tượng nguyên mẫu trả về tham chiếu của đối tượng thực hiện phương thức để có thể gọi các phương thức nối tiếp.
